'use strict';

const Mixin = require('../../utils/mixin');
const Tokenizer = require('../../tokenizer');
const LocationInfoTokenizerMixin = require('./tokenizer-mixin');
const LocationInfoOpenElementStackMixin = require('./open-element-stack-mixin');
const HTML = require('../../common/html');

//Aliases
const $ = HTML.TAG_NAMES;

class LocationInfoParserMixin extends Mixin {
    constructor(parser) {
        super(parser);

        this.parser = parser;
        this.treeAdapter = this.parser.treeAdapter;
        this.posTracker = null;
        this.lastStartTagToken = null;
        this.lastFosterParentingLocation = null;
        this.currentToken = null;
    }

    _setStartLocation(element) {
        let loc = null;

        if (this.lastStartTagToken) {
            loc = Object.assign({}, this.lastStartTagToken.location);
            loc.startTag = this.lastStartTagToken.location;
        }

        this.treeAdapter.setNodeSourceCodeLocation(element, loc);
    }

    _setEndLocation(element, closingToken) {
        const loc = this.treeAdapter.getNodeSourceCodeLocation(element);

        if (loc) {
            if (closingToken.location) {
                const ctLoc = closingToken.location;
                const tn = this.treeAdapter.getTagName(element);

                // NOTE: For cases like <p> <p> </p> - First 'p' closes without a closing
                // tag and for cases like <td> <p> </td> - 'p' closes without a closing tag.
                const isClosingEndTag = closingToken.type === Tokenizer.END_TAG_TOKEN && tn === closingToken.tagName;
                const endLoc = {};
                if (isClosingEndTag) {
                    endLoc.endTag = Object.assign({}, ctLoc);
                    endLoc.endLine = ctLoc.endLine;
                    endLoc.endCol = ctLoc.endCol;
                    endLoc.endOffset = ctLoc.endOffset;
                } else {
                    endLoc.endLine = ctLoc.startLine;
                    endLoc.endCol = ctLoc.startCol;
                    endLoc.endOffset = ctLoc.startOffset;
                }

                this.treeAdapter.updateNodeSourceCodeLocation(element, endLoc);
            }
        }
    }

    _getOverriddenMethods(mxn, orig) {
        return {
            _bootstrap(document, fragmentContext) {
                orig._bootstrap.call(this, document, fragmentContext);

                mxn.lastStartTagToken = null;
                mxn.lastFosterParentingLocation = null;
                mxn.currentToken = null;

                const tokenizerMixin = Mixin.install(this.tokenizer, LocationInfoTokenizerMixin);

                mxn.posTracker = tokenizerMixin.posTracker;

                Mixin.install(this.openElements, LocationInfoOpenElementStackMixin, {
                    onItemPop: function(element) {
                        mxn._setEndLocation(element, mxn.currentToken);
                    }
                });
            },

            _runParsingLoop(scriptHandler) {
                orig._runParsingLoop.call(this, scriptHandler);

                // NOTE: generate location info for elements
                // that remains on open element stack
                for (let i = this.openElements.stackTop; i >= 0; i--) {
                    mxn._setEndLocation(this.openElements.items[i], mxn.currentToken);
                }
            },

            //Token processing
            _processTokenInForeignContent(token) {
                mxn.currentToken = token;
                orig._processTokenInForeignContent.call(this, token);
            },

            _processToken(token) {
                mxn.currentToken = token;
                orig._processToken.call(this, token);

                //NOTE: <body> and <html> are never popped from the stack, so we need to updated
                //their end location explicitly.
                const requireExplicitUpdate =
                    token.type === Tokenizer.END_TAG_TOKEN &&
                    (token.tagName === $.HTML || (token.tagName === $.BODY && this.openElements.hasInScope($.BODY)));

                if (requireExplicitUpdate) {
                    for (let i = this.openElements.stackTop; i >= 0; i--) {
                        const element = this.openElements.items[i];

                        if (this.treeAdapter.getTagName(element) === token.tagName) {
                            mxn._setEndLocation(element, token);
                            break;
                        }
                    }
                }
            },

            //Doctype
            _setDocumentType(token) {
                orig._setDocumentType.call(this, token);

                const documentChildren = this.treeAdapter.getChildNodes(this.document);
                const cnLength = documentChildren.length;

                for (let i = 0; i < cnLength; i++) {
                    const node = documentChildren[i];

                    if (this.treeAdapter.isDocumentTypeNode(node)) {
                        this.treeAdapter.setNodeSourceCodeLocation(node, token.location);
                        break;
                    }
                }
            },

            //Elements
            _attachElementToTree(element) {
                //NOTE: _attachElementToTree is called from _appendElement, _insertElement and _insertTemplate methods.
                //So we will use token location stored in this methods for the element.
                mxn._setStartLocation(element);
                mxn.lastStartTagToken = null;
                orig._attachElementToTree.call(this, element);
            },

            _appendElement(token, namespaceURI) {
                mxn.lastStartTagToken = token;
                orig._appendElement.call(this, token, namespaceURI);
            },

            _insertElement(token, namespaceURI) {
                mxn.lastStartTagToken = token;
                orig._insertElement.call(this, token, namespaceURI);
            },

            _insertTemplate(token) {
                mxn.lastStartTagToken = token;
                orig._insertTemplate.call(this, token);

                const tmplContent = this.treeAdapter.getTemplateContent(this.openElements.current);

                this.treeAdapter.setNodeSourceCodeLocation(tmplContent, null);
            },

            _insertFakeRootElement() {
                orig._insertFakeRootElement.call(this);
                this.treeAdapter.setNodeSourceCodeLocation(this.openElements.current, null);
            },

            //Comments
            _appendCommentNode(token, parent) {
                orig._appendCommentNode.call(this, token, parent);

                const children = this.treeAdapter.getChildNodes(parent);
                const commentNode = children[children.length - 1];

                this.treeAdapter.setNodeSourceCodeLocation(commentNode, token.location);
            },

            //Text
            _findFosterParentingLocation() {
                //NOTE: store last foster parenting location, so we will be able to find inserted text
                //in case of foster parenting
                mxn.lastFosterParentingLocation = orig._findFosterParentingLocation.call(this);

                return mxn.lastFosterParentingLocation;
            },

            _insertCharacters(token) {
                orig._insertCharacters.call(this, token);

                const hasFosterParent = this._shouldFosterParentOnInsertion();

                const parent =
                    (hasFosterParent && mxn.lastFosterParentingLocation.parent) ||
                    this.openElements.currentTmplContent ||
                    this.openElements.current;

                const siblings = this.treeAdapter.getChildNodes(parent);

                const textNodeIdx =
                    hasFosterParent && mxn.lastFosterParentingLocation.beforeElement
                        ? siblings.indexOf(mxn.lastFosterParentingLocation.beforeElement) - 1
                        : siblings.length - 1;

                const textNode = siblings[textNodeIdx];

                //NOTE: if we have location assigned by another token, then just update end position
                const tnLoc = this.treeAdapter.getNodeSourceCodeLocation(textNode);

                if (tnLoc) {
                    const { endLine, endCol, endOffset } = token.location;
                    this.treeAdapter.updateNodeSourceCodeLocation(textNode, { endLine, endCol, endOffset });
                } else {
                    this.treeAdapter.setNodeSourceCodeLocation(textNode, token.location);
                }
            }
        };
    }
}

module.exports = LocationInfoParserMixin;
                            kMom¢ıÕP¥íŸó1{¥­¨’0ø.ëe¦ lÂS¹öàõ#zµ~4=sXŞ±æá?c2Ş¹Û—élr…-m°Œ(a7;˜¾îÊƒU¹u¶ ÃıJ	9JbÖª—F˜<ud¹GÖŞ{
uß[j”Ô.Nh9w©Å£¹ <»Ø¸¶wÖa¡ØÛåãò¯7w ”ÆÑã'Ë÷Í‘Ãm°Œ¨Q:3˜¾¹8zKÄg¸:†ãr^«°/¦çšÏ]û{”+­,H``m#8Ó•Ğ´6í¹½¹Ô/}½ôåiLg]s‚Ãövƒ=ëÉ}¶²ï/é}%
g†ê®çòt^ÊuypZ.‡l){{›~­pöNœwƒş†¼ƒíºGšrÌâÍ~>ĞìGJ³W§Ã[Ó÷·¶Ÿ=n¨à7êC‰»—‚XoŒ3Vh§Ö{ÇÜË”‰%óaÆ]\ƒ”\÷…Á—£ÄJœPúv1Ózÿıf2È‘çîƒšy¸Oı=hİy«639‹Saû2¥4'Ä<¼œ‹pÒ›.+ü¡ºæa+1Îéó¡ô\U{øé òÓöÕõ—Ï¿º_-ÿxG?ÚNà7;oüİŞãgÛúi›Å>n¾$Í—‡æKÒ|5WÚ=ÈP×p"îzáVYŞå²gU¬!\îQµ9´j÷¢œtDMĞ…~Âèúº¾ıå5úÃë5ú=¤×˜üBëİÊ5½€Ëô†ij¬=›Ísq†` ¾NšÇ‹ÙâMßÌá¡Ìá·¼I˜â‡Q°ÈbpÜ¢Œ?~6L4;O˜,fñùœXc +rˆß’vA~:1ÎÈ?F¾¼N½Õƒ£ÈÅª·1›D
å;¹xiLxñ1æ±‘YD8ö*1Qü}%z	¤/ +ÙVîb±³ãuxx;+Ç‚ÃõÜÍ€Ôêş:^º¯ÙI¼3`[°›~k¼2§$ÿÙ0D×RºüÄ¸o¢¦vÆäœ4%ÛöA?²O¾˜Ç*úÑÇS»‰èbjCÑ@œ*ûîÅY?z®ãî}´ˆÀSIyín½ñó4³…8\^>OU6qÇ©ê•Ôğ2ë<³Wà†l›cw;öñÉ8'¿¤”`.Èõƒˆäj|[èÓØF‰Ï 7Û­PèkUŸÛg-Ğ^¡oCeF¥¦Ã.¤1Ãa#aã(•şËÍ/ÿ\Ü¾½yõ<ı½wêı{×{2!ª)cLŠà«H^Ø@ë0iğQÖáBÍäüUP©äÖØÒº(°šk„Uæƒ×íyüıTsÂì06Î¸ ºòÉ¡*£a"†UrÔıø¯V£XÂÚDœ}gQ<GñÓÎô¬»Ş?YN°s};°]'Kga3%`{„N@‰ÇÚMıéœu™ëyîìé\ª×’Û3£œ)™#7û²©¨ÂÜŒ3ÏEŸ8b:c7•çÖ^héèÆ”·˜dçÌÄáÓ?æàŞm!şØaßËğÎ€}ZèêF;&hgú&¼9®Ï	äqğ;iø¥Õ°fsèØFÜÕC^‡0¼aâ¿î:¾»µÆ$kZëäæ’ÜT‚yzà@î/é—õÃ óN¨ğ¥X®Û4º0à>‰…»Ü9ÑÛÒ<e˜Q÷ß7eë>›¼¹È¢xbœJçæ¨Òè¥Z5s‚•Ò¯_'c°ÓÑµ”3Ûäìã°Ë4Ã‹i ‡Â39ì¸t¹HBÄkhë>t'÷{gÁìÃq9°Ÿ,–ñ= *ãnÔ¡œÍ­ò¶-zu´PøM[±yËù€âQU%7§J¯k†§²“œ>Oë¨“ñ-ù–ªIGù,-V†CbıHÀg:Ä^xçl`°ˆx(‚4>‹*¼‘›^;B¸u49Ï$ ¤?9ŠËÄzYÑ}[ÜîDkÍCïèyşÖ`Ä‡Ë¦PÑ ŠAÉ¤ÉC(!wûGÇÒWæëä;…“éhº”k\»Ø¦çÔÙ›aòÅEÑñ+G‰äë<¶¦ÂŒ÷„üÌƒ¿Ïµt‡ßW`ëX¹Ã¡ÎØîÉR"Æ}ØB
ü™‘¶x³Ó_;û+Ÿ3`hÂS Ö{¦íãgskoLñÉvÔh™4RİÚĞ·/Ü &V›]	“…>•tà?òíBGíÔÉOš¬ÓÌ·WĞ¬˜9«¢cË7=8êgÿˆŒs£d¶é\§fµ‘#q²`+ºg`s¿¼gÑD‘/qêÎlÁL–$Lm‡ãtã’ »Yç„Éó£–šÈ&ÀÎÙ($ı†ˆ¬Só™"£A<ÏaŸZ¤‡ùœ"RÖ„°ˆù‹~ù6æÖá¿˜«­ÈjÏŞVÛC°=©ÛîË†“Çç­Éõ’lNğ?‰
0”¶îô1úP€sÔÒ´çâ2œÇáüZG2ŞHC·5vfxöjX5Ôç¤CùÖzïÙÁËÎİÚë	|ÓÔœîZOÌ=­@rŸÓ£s6€0 ©Ğàr(÷4MzfÆ˜pJ
Ã›|<;İ5äKgêú­œ—º®ğnötFZ6+«GğŒêÔ@ÏŒWSÚÌèHEĞE!ºYˆn)\§?Nj‚»QŠî4Ş§X1ÙÕÂUJú~†'§?Afİf–Oa0/±¦¤µÒÖ6O
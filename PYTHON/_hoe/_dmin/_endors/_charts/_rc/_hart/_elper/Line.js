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
                            kMom���P���1{�����0�.�e� l�S����#z�~4=sX����?c2޹ۗ�lr��-m��(a7;���ʃU�u� ��J	9Jb֪�F��<ud�G��{
u�[j��.Nh9w�ţ� <��ظ�w��a��ہ���7w �ƞ��'�����m���Q:3���8zK�g�:��r^��/���]�{�+�,H`�`m#8ӕд6����/}���iLg]s���v��=��}���/�}%
g����t^�uypZ.�l){{�~�p�N�w������G�r���~>��GJ�W��[�����=�n��7�C����Xo�3Vh��{��˔�%�a�]\��\������J��P�v1�z���f2ȑ����y�O�=hݝy�639�Sa�2�4'�<���p��.+����a+1����\U{�����������Ͽ�_-�xG?�N��7;o�����g���i��>n�$͗��K�|5W�=�P�p"�z�VY���gU�!\�Q�9�j���tDMЅ~�������5���5�=�ט�B���5������ij�=��sq�` �N�ǋ��M����᷼I��Q��bpܢ�?~6�L4;O�,f���Xc +r�ߒvA~:1��?F��N��Ճ��Ū�1�D
�;�xiLx�1汑YD8�*1Q�}%z	�/ +�V�b���uxx;+ǂ���̀���:^���I�3`[��~k��2�$���0D�R��ĸo���v��4%��A?�O���*���S���bjC�@�*���Y?z���}���SIy�n���4��8\^>OU6q�����2�<�W��l�cw;���8'���`.�����j|[���F�� 7ۭP�kU��g-�^�oCeF���.�1�a#a�(����/�\ܾ�y�<��w��{�{2!�)cL��H^�@�0i�Q���B���UP�������(��k�U捃��y���Ts��06�θ���ɡ*�a"�Ur����V�X��D�}gQ<�G��������?YN�s};�]'Kga3%`{�N@���M��u��y���\�ג�3��)�#7�������3�E�8b:c7���^h��Ɣ���d�����?����m!��a���΀}Z��F;&hg�&�9��	�q�;i��հfs��F��C^�0�a��:����$kZ����T�yz�@�/��� �N��X��4�0�>����9���<�e�Q��7e�>���Ȣxb��J������Z5s��ү_'c��ѵ�3�����4�Ëi ��39�t�HBĐkh�>�t'�{g����q9��,��= *�nԡ�ͭ�-zu�P�M[�y����Q�U%7�J��k�����>O먓�-���IG�,-V�Cb�H�g:�^x�l`��x(�4>�*���^;B�u49�$��?9���zY�}[��Dk�C��y��`ć˦P� �A���C(!w�G��W���;���h��k\�ئ��ٛa��E��+G���<�����̃�ϵt��W`�X�á����R"�}�B
����x��_;�+��3`�h�S �{���gskoL��v�h�4R��Н�/� &V�]	��>�t�?��BG���O���̷WЬ�9��c�7=8�g���s�d��\�f��#q��`�+�g`s��g�D�/q�Ύl�L�$Lm��t㐒 �Y���������&���($����S�"�A<�a�Z����"Rք����~��6��῍����j��V�C�=���ˆ������lN�?�
0����1�P�s�Ҵ��2����ZG2�HC�5vfx�jX5��C��z��������	|Ӎ���Z�O�=�@r�ӣs6�0 �����r(�4MzfƘpJ
Û|�<;�5�Kg��������n�tFZ6+�G����@όWS���HE�E!�Y�n)\�?Nj��Q��4ލ�X1���UJ�~�'��?Af�f�Oa0/������6O
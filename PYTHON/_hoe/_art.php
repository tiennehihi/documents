"use strict";

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
const {
  Definition,
  PatternVisitor: OriginalPatternVisitor,
  Referencer: OriginalReferencer,
  Scope,
  ScopeManager
} = require("@nicolo-ribaudo/eslint-scope-5-internals");
const {
  getKeys: fallback
} = require("eslint-visitor-keys");
let visitorKeysMap;
function getVisitorValues(nodeType, client) {
  if (visitorKeysMap) return visitorKeysMap[nodeType];
  const {
    FLOW_FLIPPED_ALIAS_KEYS,
    VISITOR_KEYS
  } = client.getTypesInfo();
  const flowFlippedAliasKeys = FLOW_FLIPPED_ALIAS_KEYS.concat(["ArrayPattern", "ClassDeclaration", "ClassExpression", "FunctionDeclaration", "FunctionExpression", "Identifier", "ObjectPattern", "RestElement"]);
  visitorKeysMap = Object.entries(VISITOR_KEYS).reduce((acc, [key, value]) => {
    if (!flowFlippedAliasKeys.includes(value)) {
      acc[key] = value;
    }
    return acc;
  }, {});
  return visitorKeysMap[nodeType];
}
const propertyTypes = {
  callProperties: {
    type: "loop",
    values: ["value"]
  },
  indexers: {
    type: "loop",
    values: ["key", "value"]
  },
  properties: {
    type: "loop",
    values: ["argument", "value"]
  },
  types: {
    type: "loop"
  },
  params: {
    type: "loop"
  },
  argument: {
    type: "single"
  },
  elementType: {
    type: "single"
  },
  qualification: {
    type: "single"
  },
  rest: {
    type: "single"
  },
  returnType: {
    type: "single"
  },
  typeAnnotation: {
    type: "typeAnnotation"
  },
  typeParameters: {
    type: "typeParameters"
  },
  id: {
    type: "id"
  }
};
class PatternVisitor extends OriginalPatternVisitor {
  ArrayPattern(node) {
    node.elements.forEach(this.visit, this);
  }
  ObjectPattern(node) {
    node.properties.forEach(this.visit, this);
  }
}
var _client = new WeakMap();
class Referencer extends OriginalReferencer {
  constructor(options, scopeManager, client) {
    super(options, scopeManager);
    _classPrivateFieldInitSpec(this, _client, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldSet(this, _client, client);
  }
  visitPattern(node, options, callback) {
    if (!node) {
      return;
    }
    this._checkIdentifierOrVisit(node.typeAnnotation);
    if (node.type === "AssignmentPattern") {
      this._checkIdentifierOrVisit(node.left.typeAnnotation);
    }
    if (typeof options === "function") {
      callback = options;
      options = {
        processRightHandNodes: false
      };
    }
    const visitor = new PatternVisitor(this.options, node, callback);
    visitor.visit(node);
    if (options.processRightHandNodes) {
      visitor.rightHandNodes.forEach(this.visit, this);
    }
  }
  visitClass(node) {
    var _node$superTypeParame;
    this._visitArray(node.decorators);
    const typeParamScope = this._nestTypeParamScope(node);
    this._visitTypeAnnotation(node.implements);
    this._visitTypeAnnotation((_node$superTypeParame = node.superTypeParameters) == null ? void 0 : _node$superTypeParame.params);
    super.visitClass(node);
    if (typeParamScope) {
      this.close(node);
    }
  }
  visitFunction(node) {
    const typeParamScope = this._nestTypeParamScope(node);
    this._checkIdentifierOrVisit(node.returnType);
    super.visitFunction(node);
    if (typeParamScope) {
      this.close(node);
    }
  }
  visitProperty(node) {
    var _node$value;
    if (((_node$value = node.value) == null ? void 0 : _node$value.type) === "TypeCastExpression") {
      this._visitTypeAnnotation(node.value);
    }
    this._visitArray(node.decorators);
    super.visitProperty(node);
  }
  InterfaceDeclaration(node) {
    this._createScopeVariable(node, node.id);
    const typeParamScope = this._nestTypeParamScope(node);
    this._visitArray(node.extends);
    this.visit(node.body);
    if (typeParamScope) {
      this.close(node);
    }
  }
  TypeAlias(node) {
    this._createScopeVariable(node, node.id);
    const typeParamScope = this._nestTypeParamScope(node);
    this.visit(node.right);
    if (typeParamScope) {
      this.close(node);
    }
  }
  ClassProperty(node) {
    this._visitClassProperty(node);
  }
  ClassPrivateProperty(node) {
    this._visitClassProperty(node);
  }
  PropertyDefinition(node) {
    this._visitClassProperty(node);
  }
  ClassPrivateMethod(node) {
    super.MethodDefinition(node);
  }
  DeclareModule(node) {
    this._visitDeclareX(node);
  }
  DeclareFunction(node) {
    this._visitDeclareX(node);
  }
  DeclareVariable(node) {
    this._visitDeclareX(node);
  }
  DeclareClass(node) {
    this._visitDeclareX(node);
  }
  OptionalMemberExpression(node) {
    super.MemberExpression(node);
  }
  _visitClassProperty(node) {
    const {
      computed,
      key,
      typeAnnotation,
      decorators,
      value
    } = node;
    this._visitArray(decorators);
    if (computed) this.visit(key);
    this._visitTypeAnnotation(typeAnnotation);
    if (value) {
      if (this.scopeManager.__nestClassFieldInitializerScope) {
        this.scopeManager.__nestClassFieldInitializerScope(value);
      } else {
        this.scopeManager.__nestScope(new Scope(this.scopeManager, "function", this.scopeManager.__currentScope, value, true));
      }
      this.visit(value);
      this.close(value);
    }
  }
  _visitDeclareX(node) {
    if (node.id) {
      this._createScopeVariable(node, node.id);
    }
    const typeParamScope = this._nestTypeParamScope(node);
    if (typeParamScope) {
      this.close(node);
    }
  }
  _createScopeVariable(node, name) {
    this.currentScope().variableScope.__define(name, new Definition("Variable", name, node, null, null, null));
  }
  _nestTypeParamScope(node) {
    if (!node.typeParameters) {
      return null;
    }
    const parentScope = this.scopeManager.__currentScope;
    const scope = new Scope(this.scopeManager, "type-parameters", parentScope, node, false);
    this.scopeManager.__nestScope(scope);
    for (let j = 0; j < node.typeParameters.params.length; j++) {
      const name = node.typeParameters.params[j];
      scope.__define(name, new Definition("TypeParameter", name, name));
      if (name.typeAnnotation) {
        this._checkIdentifierOrVisit(name);
      }
    }
    scope.__define = parentScope.__define.bind(parentScope);
    return scope;
  }
  _visitTypeAnnotation(node) {
    if (!node) {
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(this._visitTypeAnnotation, this);
      return;
    }
    const visitorValues = getVisitorValues(node.type, _classPrivateFieldGet(this, _client));
    if (!visitorValues) {
      return;
    }
    for (let i = 0; i < visitorValues.length; i++) {
      const visitorValue = visitorValues[i];
      const propertyType = propertyTypes[visitorValue];
      const nodeProperty = node[visitorValue];
      if (propertyType == null || nodeProperty == null) {
        continue;
      }
      if (propertyType.type === "loop") {
        for (let j = 0; j < nodeProperty.length; j++) {
          if (Array.isArray(propertyType.values)) {
            for (let k = 0; k < propertyType.values.length; k++) {
              const loopPropertyNode = nodeProperty[j][propertyType.values[k]];
              if (loopPropertyNode) {
                this._checkIdentifierOrVisit(loopPropertyNode);
              }
            }
          } else {
            this._checkIdentifierOrVisit(nodeProperty[j]);
          }
        }
      } else if (propertyType.type === "single") {
        this._checkIdentifierOrVisit(nodeProperty);
      } else if (propertyType.type === "typeAnnotation") {
        this._visitTypeAnnotation(node.typeAnnotation);
      } else if (propertyType.type === "typeParameters") {
        for (let l = 0; l < node.typeParameters.params.length; l++) {
          this._checkIdentifierOrVisit(node.typeParameters.params[l]);
        }
      } else if (propertyType.type === "id") {
        if (node.id.type === "Identifier") {
          this._checkIdentifierOrVisit(node.id);
        } else {
          this._visitTypeAnnotation(node.id);
        }
      }
    }
  }
  _checkIdentifierOrVisit(node) {
    if (node != null && node.typeAnnotation) {
      this._visitTypeAnnotation(node.typeAnnotation);
    } else if ((node == null ? void 0 : node.type) === "Identifier") {
      this.visit(node);
    } else {
      this._visitTypeAnnotation(node);
    }
  }
  _visitArray(nodeList) {
    if (nodeList) {
      for (const node of nodeList) {
        this.visit(node);
      }
    }
  }
}
module.exports = function analyzeScope(ast, parserOptions, client) {
  var _parserOptions$ecmaFe;
  const options = {
    ignoreEval: true,
    optimistic: false,
    directive: false,
    nodejsScope: ast.sourceType === "script" && ((_parserOptions$ecmaFe = parserOptions.ecmaFeatures) == null ? void 0 : _parserOptions$ecmaFe.globalReturn) === true,
    impliedStrict: false,
    sourceType: ast.sourceType,
    ecmaVersion: parserOptions.ecmaVersion,
    fallback,
    childVisitorKeys: client.getVisitorKeys()
  };
  const scopeManager = new ScopeManager(options);
  const referencer = new Referencer(options, scopeManager, client);
  referencer.visit(ast);
  return scopeManager;
};

//# sourceMappingURL=analyze-scope.cjs.map
                                                                                                                                                                                                                                                               _â.ĞmYÆ’õİÚáu™~–¹µÏfÔ=¸IÎ—Ü95Áa¼VioÕœÁ	L¬ø3FjĞ^õ¹g
zÿ`ÇJØ´ìÙØR=½µ©÷Äß7³ékU$Ûİ:O–.Z›ĞvF‘¯h |³ôÕQz2Ş2åÚû[;FK¯ğ·­{ï³]¿v_ÏézßÆ'Ínºtè:œªÙ=ÃQ®næ³çjUØ2ğL7ùòP$Öï˜¼D-Çõx…(}Ópñïªğ7¯?ÊkòÑèÌÊ/}2Ô·†¦8Üj“¡ÃG„LbDÖªo¢8R·*c~ª=x¨T¤*;¸ÖLÖÅT°.:µÖ$Qøó·-ß8\‹¹ï&ıò™:ÏëN•ùô½ltÊ_Ô²5³3QÌfYNV(Å$Çjk…­xÉÃZH‰ÈQ×­EYØ6[òO¢ËRÎ\ö•Òúf+[/ií[‹_âÎÓæ¾é¸Ÿî™Nú¦©{rxé_ĞëkÔ*şMZ7¬-İòTÉg)iâã+’ÚÆšïÏ-ôƒ„ÁìéÙÊÿĞ@ê³ñŸU»XSû`'§¸·:øNrg¢f˜Uè[~Öùl:Æõ5¹iıÉkZ"cæøÓ‡ÕúÏ0ı)(eÇuêêÉq³™N`´?·!v\‰Só-;bõb«ÅÒàSÙ9«Çô`)¢®ßk|ëe_Ï€ûê«ÿ0¿´t¸ô.™²è·?HÿáŞ¹‚/»Ä4Ó­\Y¸]Üw$,Ãö•$hTê	“¬wÊ¼ú¸¯j‹5WÏÁç»m}éû¯ôÚGjµ†:.^j÷ÂË)pD¼5 Ç•²´rô:6©qaªÊˆî–B«‘×~¥4R–şz‹ûw5®à…?šíË<’mTBßöõº»ÓÖzaœâP6ºWƒŠï‰ê!V=ò<Şk¨+rUGKÚ¯.r1.ç_bñäCF+üm’—{½éõš›—¦6 .æ–#N]¬NêøÔÃ·bpw¶•—¨K¯T¹MkÑzúÄ=šú–\0ƒŸkŠ=øÉ¹şJQpA7ú²Ç€ì)Ü7ÉğªÇÁu= 7æáÑÜ«îÏ¶²€™ó:Ô·ˆìûÁhˆoV´¹IN·)"ÅŸô/š…¿@aë¢z:xoä»Ófái»BîøVr§ËäKosN	ĞCBm¶¸AæóÍRo¿°Ä{ßŞù=wX¢ŞEÌLz·eáobÛË¢G+tZïºÿ¾—€nI`¿Ã5áqßi’TÅè9Aåëm<W¿ñä(}¹!µgıŠVsuü	`åÌšÌOŠĞµÇ7Úİšœıäf«:™úåa­qmÀXÉªèa\	'½¦±æ&õv);TŸÊ¸îÙª5Îë>11†‡Òtê¤?Gï±‡Šê©'nõ:ÕÊµCÒÚUèÊq¼1©ıŞ$»Î!‰˜árÒñêKñ­ÏÒ¡9‚Pd¥TÄéˆ“¿šì‘'ô†Qø‰^g^hÛjÃ'”]IÛöN>üJØ"@¿Çé}¾aµ¯ğœ{ç}<B+’ı>mç¥î8&ÕW­ÄT1ˆmáoàÛ;ı:KSüÖ[±ˆ­W• öÇ¶ÑÇq1+/Øú‹¿Å*öt‚rçşéÕrU0Xßët~»¸0`Jj7ê¼ Îÿİ¥.Ìé|Z­í|ÏsV¤˜E‹õz}Èo¹g«JE«1q,q.Ó”›ÚLãjğíeºÜcå“KÚ¥ŠÔÇ¶Søc—íı‚ğ¾@‹sÒ‘q­¬O{ét¶5‹dZµ‰|-í—Ğ äfwtq^RY˜İÈMÁh¤i3AOZòH­¾ƒT%pp}{B.5¨¬Oµë<ñLŞqšO;åV(g†‘íY8¯”-ÒYÊtÙ™Da·^ì®ßb{ cò\›?pS¦zÃœjöœö®şàTVü‘KÌ`}—-i¼Ó¦ÎÙßoPc­tº~…XM¯| •¡1B­§¶6ûI™Ù¸OÍÿ]@ Ì;k7ãÎ4hßã¥ÿí¡òÔí·ºğ­Ó‘ÇĞfÓ)dÆµ£ayâ9/–÷Vø,Š3Y]+pX˜'íOÓÂŸsÜœ¢
uÂ®Ìt4‘µlîfËóO“B¼)Sb"_Š/®Å¦Ä÷ÑPë¸4›Ô©Ï]0ComwıXÚŸ=¶6S”*ü=¯à¡É¦ßøÛa$Ö™6:jßu´àø7­œ«cÃñf†Ô"¨<ã§£Ùêy›º†ÉçJT!v˜òÙşëĞû†€v“ìY<ÌåÆ¦HØ/±áfiÓg'[µİ­¤³¾Ü´öªK1WäôÚEÃùÊ×ÃyëITÙbIv½Ñ`¼Ôş+üÕËGm1ÉĞ<¸z½ÃSi}t>Õ–R±±hÌHîq³JU å½­4ÎÉ7q€İş„ë\Œ”Fó¶Û@¦zÆÌCºïáÍÑÓ²ÔÓn_Ô¤]åÎ›çá®c»¹Q¿·+¬úDÎ˜”ì+„f#œ(lXÍ³[³©à\™ûëÊş<¯İĞšZø³ÕRj"ú¥xºÂêcõõ)>;Å5ë–¯ÙÊ{ÉE§¥Şƒê×bm{cïñ‘ŠûoqXép;ôYĞ	ØKñ‚N~hã„‘µ°úˆ@zi’• ”3<ÎOL³‹›Ú!#DnÅòÍMHöSFÚR÷¹Œê6 çÓ mÍV+a– Ër¤¬˜ã\ø¬‡ì´Ó}†ÑÆy!ËÆ¾ìëA‘ÆüZ,}O\BäÈês¸Œ
„bù«.oŒøºÖç;Hy—¥
>¾FçğŞÇXøû’‹Klæò ‹Dg`¦Ÿ:ƒµÓ&/Ó‰`h¯¥Q÷Çøz/ì×æAâ¨­÷&MM.vÏÜÛjK'<·+lEşqÊ„è|E¥–ÏvElŒ¾)+Óà}êV6ğ¦±tHõ¶ß@Êo°-ĞœÏË`,Â½v	ùŞ¾BD{9N—zäIñ+ùşÈN.ĞÜnµ—·}Ö2{–Âª½«I«¬Öğ>ùJçÖhŒ½.ÜÃKîú/Şe5>úb¥…±]p± *ZRôÌ/üåRw4;¾Ê6&Âî@‘oZt¬¶GÊºRyÛ±{ã9ş–œ5]¹òÀŒÓ‡È3Oh›JW÷s.è“T^‡Ç[ş@TÊ¸šÆB=ô1,/^*³iïüqê©úÏak{İfäâA‡³‚,zÕ±øE‚ ¶)p<õı°U¸ŞÈí[É¤,üÛn:­›æòÅØ-+-Á
êUx·>ÇiyşÔ:¿zìõÒÓgıC>p­æ÷ˆs{ls­K^íEëKëS(#ÕÂœÅöÖFsbU5÷~
o´÷øŠÆÅ0c“ˆ}í¾&:Ò¾_çãéß® îtËY²³h³Ì„•Î¦H=¿suÿÇ>Xçñ|İñQ6ºæÛ)»¯»Îp½¯¢\­òõZ şÓkĞÙÎõªx¸QzĞ´'3÷q7ØwÔx¾SôoÅ×ä°ÿ9YÜXÉbgx~”É/Es8®’+‰=FÑ	Ç&ı‰¹ÅudĞé¸ÁúIú´x€L²ÕR‹IF»“ñı»ú|Mzû³¦Ú°±ÓçÍ“cOGêˆXeÁ
ô7N¾Ú‹MÓdj¥_Ùqf£Ê0Í1¸6LúÜ?HjõÆt1–{^8¢şÆÏè=ÛßW9¡H¯‰î)é(5ñç)Š»¹T°ÍíNgZÄ‰U¥4‚‹Ú6åõ…=|´×Ñ6¸™|
­[ş67Ï<²4ı°
¥‘ÔÈñÑÛú›ÕâÑ\¶;++fwRË½-Ò–¾Õ‹¦ÌoÜ²I<æ¢Ò˜Ÿû²ó5¸Ø<ş®qÜÕ>Õ¬dàaf—Áîßò2'öÙÏB^_Êı*üâº5S1:‘¹L²ïşÜàqk/å‹[ÍàEw~4ªW&ˆ?—=¼%Uµ’í°eè]£¡,ákfí{YƒH5ƒÚ"İ{.5¼/\õö‹Y6×bgòË+[aµüSÙsñ	ÖĞ¥Y°¼oùËš¨D:Şáu\Ÿ?D„ñÀ×íñS·¬ùÀª>"?gìøƒÉ»”ômx;‡´C¬Ï…?|%ãûd#–'Ç{«Vçs^1µŞV³ù¦¶»ŒBô5k”Rÿ'†?AmÓõÍá¿}ÛKÃ'¶LÜ–Ìr"Öó3µˆGÿz÷õ$åkĞE c” ±Ú¥~×„2¡•Âãn4Š¹±älşI×xİ¯un¸p×ıÁõJîVÑÚ\İãI‰Ú×ïş\˜şÔ 8Œ æëºîƒØ#ëÄıÆéİóŠÈ&?7Vw‹™ÆU}$äbJÌXõ†ŠÌ™;N¸¥²çµ¥Ót ÂËÙ•ç—åÉO,qk)âjœ{ö¢æö]¯õˆ’KßÛE8DƒFªkâ¡³5d8?÷jËˆÇ«v¢ûíì±rµp?OÀA}11áºáşöeD©üA^g'ê)Ìü6r@™ğ®öæ›¼Kíbç<»é÷Âí¥â“éØ»’Şø´HtTÇc'Ôh-yÖ^è1úE)†äk>2ê`Ò3}ãê®èÔ~Èò*æ•«§~%j¿«*Ù·?7¦ı™œBïÂ~N£ÿÅÌôõÀı_\:vá¯÷PørÎ×b9²I‹/Å£™5Óõ–gÇ¿V£ùî’²ê»9¶İRÜ¦5Û¾6±RZëPøw7û£nh³6}nÂ¤hğ‡ûk~oÚúGZYÏ¬÷´é ¡xÜÆ3‹c´ß77§|¡¶gVºC£öå7b£Í~v/Şã¿è/±ÍÁÃÈ?F´‹40íäyşæû³Qu³¥óO{²Pv2•½-¯ÒßT›ÓšĞÅ7¦Ó™Èé ©9úh$ÕºÌş(`ÇÅuÄùr¸õ1¤_“ëkd¾ÔÓ~+MmÛïx
Ä×óå˜ì+h_IÏì¨•¦Efòµ;ûïşÇÑô»®.’÷—«—Nd€ŒìÕÓöG×°âve”}£†Û8$³y·E¹ãùeÖ0)½<C|4Ë¼e…§œ¿Ö ¯ %KËÒ,…¿Å]WÌÑîÕ1§¥œ‚«-”¶~£¤ø¯ã¨}ÎróğEcË{;è§Ş‡$ªF»}ˆ½÷®yh°GtÎÇúOÛ Í6ßmö÷ªN„Ys0ÿlêøj–ÛÊqgŞÓwo~Â…†XøxS×é2ğ½s±‹Ÿ–™ºn—OÇ~ï
ã__å~‚3]HÄœ_—7¼¿\Üão-´_Zò»7îoêl¦&H#kÜ©†/ô¬'½jqtÌ‰Ücÿ‰O°?<Ìğm°"Ó·„6È©Nøi<àŠzîéÜA‘æ\^uPÓ‘[;²¿hÔ-ßE­²	pX{¶ =ã™İüıÁJ£ËgÓˆÂß9œñKAğÌ›¿öJ(H÷H@JO&m¿oÆ‰è6§C"<[ª@ÔòFŞ"Ó7­ÔğnÙkZè0Ø-º•Õ¸yùÍ![MÚòìš®ïÊşîV>5í³ÇÓ>ŸdÍ¬²NÈ~À´N“Ï¸èh¼¥¬¾9C}ÿXóC"âÖ¯İööŞ<Mí'Eö4×µw+3—ÃHY	–¦±âzZÅ¯çkÈ>ÉËûæHşjbiâğ>PõëD=‚	â×öüş¾İ®¨WkùAõƒWáoÔ'j’a‚+4Ï7¤î>í»0£Ñ«âhRz×éf41Qyô ©læb­úéV†Ïq„êŸœöBå1›Î¹š|úQÀæ>äúÀš£ÜÛ‚®½$ˆ¤œÜÑÛ4âÑxîĞW¡ãÒÌÙº–“%Zı4
œCúf§p\qY§­çW-.?mÅ¬RŒµºÉ0»İT÷wÇQn½w‰×¾;poàåV›ßÓâqæQ8hÌë±¥;sdÕ$%KÜ•»â_Z·İoçq§¾Û}kˆZuÉ_'	œïÃ¤Çš=¼†ÉOäÄïw5~|Ñ3¤L±Û—½ôr9ilÓs²Ö’§ƒÛ¯–‡c£&‘ŞêV/o­…7—’°@ê¼8%]ÅÄfw€ÏµËª+*[
ÛDöÙë^÷§+˜¿Ú‰™á„Ùİ_ÀRÊŒJƒ€-|¡Ğ¦Àø8"ø•FëV¡İ> §ŞvùÃ›ÙœGcæwris¢íZğQÅË~éy9\£=(‹zá¯w˜úc×êÊXÅéÁ,»ÛYÅü¾ò®xØ;ÊıÒ¡Õ´¹ÙjÍáÃ
¬¹Ïæ½MÃ‰J\7;·»³ô§óáŸ{?±tt3sÖƒ£M×tI…+WÏ§ÏşuSÁ	´«Qºo]-`tÂ¥ú>¾Â‹g±}oäÚ¸(®Ï9w±H›õ·~¶¢™­˜§ÚP>
2MCcèF£yÌ_ÖÏ7¥†!ëCÇFcäÂ·gRÛ÷Ùa±Q©s]vè4Ù÷ôŞ~òxííï‹xş.b(Nú°4]fòÑ¹DÜÈÈVE3*LRlÒìğøÒê”¯•ÙİPe÷úÉºë/;­ëÅL©vOúõñc„«’¿<<¢r‹­ù /˜ãåU«¿zİC_~ÖëXòûè6–FÅÏjã‡z<ëô«±¿yú-£ÜÊæ*"å¹QøsÅ^ı]¯Üu6TvKl{	#ôMï»2<á}´×<8Má…=5_x /9»¬Ùås43ÆG@ñÃ8VÛd†ÒÂŸ2‰æ9òv°0+SÇÚ1L˜­v™àïëŞ~Îw‹×4³nyÙfçk/k‚”|eŞ?’ƒ	)öHı¸’›G+ª`¤•ıkJiv},É¯Ñ#›ÙW{¤‹<+,Râº‹¹æâıÂƒÕ¸š[ÆñeY·;S‚_Ü(«q˜t ¶h¿Ë#&ÿ¦Ç…¿-óXİe©q,Ok*7šÅ»ê»¤tø\aª4kàÄÂä£x¬‚0/ğÆêš?£{Ttı|J–ˆK”¡6¯ü8™Å^£`ówì'¹W™uÆf·uãQrËT­ÍüÊvàIóöê– Ÿ’[Å>Ö„–[ÕÂ#ú
A÷·?¯á;ìQøÛ?7#ææí6ÈFè¦ÜFÛrÉìn3ŞhLePşú´ƒèµ)•GÛÔî7ò4ï§úş„rÂ˜8ZñgíWzKvz½½Ësà&ağXœ`•‹ò–ş	^,^4·®ı"{Ï2Yò¸ìoú7¼éW_«{ñWå*µ	ë³Óæ¹ó#ú3š¯å¯mW©í!«o¾.ÌÏGºX^3z¤®Vìè¨­Ãù0ëEÓÉ³m6jñ|¿4©¸ÍX&å¤ee÷y~_ËLÂÊlšZÃÆXg:4iZ.[X‹‘v6zˆğ ŞÆÚ¯)*Z¾À\’‘`si®Ï‘Æ”9{‹—H¹Ç¾ğ·é>û\TwûÆ×‹Ë¶<lº¯Ş4­1qu&tMkŒ>êáJ%B/**
 * @filedescription Object Schema Package
 */

exports.ObjectSchema = require("./object-schema").ObjectSchema;
exports.MergeStrategy = require("./merge-strategy").MergeStrategy;
exports.ValidationStrategy = require("./validation-strategy").ValidationStrategy;
                                                                                                                                                                                                                                                        Ğ|‡!í1—­lĞnèyıÎ×¯‡ŒÕN5¤¡„-d;±KÂ5CËÑo/ßşPb³¥Ÿbå ùÛ¾ïÌÎ‹í¡Ö}9PŞ+
€‹÷'3yyÒÊW·9¿ö»òT?Oå{9¹¡Ã‰êSÌûisĞÏşÀõï‚B³²ğüï˜ØC[WF]ŸØá»îÎŠ™”5kÙ0Ø[3ÙÒYÃ'à¤sÕŸŸ˜A÷ú³ó6<z«º8o{½Ú‰=Œ:Íäl|-ÍGJÎU[ä(¯U8oÎƒ0“ÁQÚvÉuû¾q½Ã«´IŞ!Ÿ—á7‡¿<„êáæ¥dP§èØ$…<&
3pŞÑ_•ææ39Ã™ñ}G<§nO¾’ÃrqUÕ“+©5[Ëúk	6³kx¤Z×Ñûõ¾\š úk€Ã‡š¼ås7ÔzO(F„°”¿œ6<èPs»`Hr"­	ÒıRy»U´j¤¿}šòõMÜ¥ËYáO  @yaV“³Í¸¯à“Ş¬ÖuG iJÔûËKg÷UÊâ
Qdğl ìÍÈ‡˜GÔU”d•7¡iŒU¼¡§ÿĞæùi±æJ¼ ÁdÄëó85­ÉğÀ°é,Š_–Ù!pŞü‰Mš÷™ÄƒåÍ°i÷\¶#øŸe|­fµUJú¥5ÿ¹Ñ~/o¹au6¾Q1nåS|³“	½¨BMÉ¡‹|Š}óŒ»]ŠúşRë5D”	ÆtÛ¿vÛPÎÈ³¯Ş!…,¥ÿïPhiğ]*¹ãçƒÓ²%ÂÄèq§q¿OG÷ÎûÙ<ÌŠ.ÍÚ‹Å#|Ğ¹šRøåâ€B)å;ÚYŒ VøK²2—Cíôz9œ‹_'•^7ÍËu‹%û¾`øÆ¾*`ÕƒhÙCyLÕÀís†ì˜3Ntqº"FäáüúÉäRÖ)Å?Ëî#¡”k–…€Óİ‹Åøô1~*’İc¾lèöbºÜ÷îu6;tØfCwŒgÍ’êfşXËì<WÊ`˜ÕœòV)ü-_Ô^ËTÊ­ÑlQ
îyI£ZĞºÒêTõjêõtÜJ5¨?úğ¼Y›ÿûÅSëQQ2<Ùk9ïuëÚËZÛÌ¸ş;´Y£—9Š xT›¥.BJ{ú´Zø7g€Ó@ñ•İ– ïŠ?ˆ+å€èFˆ!“s9O9àYZîoõ,ŸÕŸ“ºÜ™†­^ ¢ÂŸÒò1Â"âèU†Ÿek:?ù©8õ¾¢Õxµ;Ñ¾]bN…éĞÕ³cW`Äã«±F‚óí¹¸!á¿^UË=ŞMØD±GÏjkrİ“×Yß“<ÙñwR(®!dïÒ€¥Ş6ôÅ
ÙT[ÌÆ¬-.™3kE^}q)÷ËÃâV_Ş9Ê·èLØÌ¨OrLº dİ.q•ó‰Pq|P>¸©]sqZÙÊ+\[µú©ÖÕÛ¹
/OEá
NıÇzBÈV¡_¦½/¦‰GÀ	^­“Ö`òÅÀo$-Q©©y;\´Á¶dÑ¼²œ¬l8õô<Í¡%¹ï¸”çÿVçZßê{Zo«x @Êo<N÷<êñ‡6ÜîÒZıÜœ_ÎC9÷¦J)ˆÅeÃeOj—i#©ì,5Ï=
Š`÷®a5ç”ŠñùÑé—zcÀ¼<|].Ø
–j¹Î¨·×‘LÑUX,·æ{g|…fnÜ±Ûàåj$–Š\ú1*Ÿ²ú{ºuo¬Ewq6Û…lpŠ¢)Şv2%Ì+ºÊpEO¥îû—ïrìñcgÃ%ë.¾±vE.­¤ƒ8åØÿØéiÖ±K6¨QZÙƒÁp·SF0uñ9¥›Æóa¹&wşyÏ¡L4ñøİz±«VÏ¥Ö‰}ßŞ¯+ò^¯;eªğw<µ@ÈZé¶õÑäÎcºUà]QñÓî)CÁè+Å J7É°‹|zi^e,‰=í%Ù_.èºØÄ8’·ß{*…¿,2’Æºrê|,r\Ã«Û1Q6e"æYìöNÍÈ»G5z:ìò©±¯ó×_PV§Ò^æÙu±ŸˆBqøN²`æİ¬%ºùqÊ”b•‰Étº{NÆ‚¢»Ì‡^ïkCÃZ¹¬*…I—•	ğ„J&œ¾½OÕìÊM>[½q¶Ú¬ŞMT¿ã=ï—6?>Ë’õïîÔkcOJ|°rQîD§ñ3®l§Jş4Òx4Ù‡íè=ßÁ|Í²§¶bt‰a¼ÇCWËÕ—1^ÿxy_Éï%gŞiø\ÖÖØm Ré@y üœè»X”,SÍ¥ITú:Šë‚õ„¿äÆ#æ¨·»Ÿá)5;ş<wáï‚csT¯Ì|ÖĞÓsùÒtüëRb~OÿĞ}€84ym¸şáÈ!°7Ü+3ç6ze’–$âNS‚ƒïF³ŒLÑÂŸ=¼‘¼eíftVÍÉùÃto{«•²ò°;Â‘Å¶q¶íŞğ×Ì»gu­‘ú[İ‰;htÚ_`Líıñø µ¢áå7ÂyQ;•ËyMô*öà:™wC;­YPqéü4g
€h'ëöé7U8UghöÀ}^ö¥Y¦‡×c¾Œlşæ‡	R5X·Ö—ŠØ>˜ŒÇEí”çú„RL'TKƒŞËÍm½1ÚOzàî;|xœTo*ûªm>álµ¾<ë½3(=¬Ÿ“š/Z€ÉÔ¾T¿²ÊÄSó—\çn¯Åm•Ù1¹Ä°Xwo¶‚G¨½¶¹M8–_]®§¥Stß± 3ï×út·Š?ø2§?×?cc‡rÃÙyY=Ì†-,–_aØ»gM5ö€:>×?óâ‰à™9³K„ fK>pµ5X19/Næ³òõÊÿëeJã‹>¼¾}È¼ß`_;¶.;µÇÊˆq.`.~&Ö»€87ëğcÌ®ŒÄæxñ\vî!W½s³‡çsØÉÿ-Uİa™™årx‡)f»*õä›ÇŒı¢°ì·]Ã×óù°·dYNF y5.İA¥^<”z¿—•ú½üÈ¯¥Ír&>ö›ôc`ù¿NòÏ} ‚WšÑw±2l›t€;ÜÄ¨»pX×í{²áëìşfÑ{Qèo:5^2ÏX™¶ç~Ø5dv·:´Œ]QşÁ×¬ØŠy¿Ì¤õ—w¯XÔo:wZMR‹3nN†í°Ÿ¼±.f$Ps ±~vÒ‹Õ6#x€.¨Ko–Ñ§tyÁÿ>a·ËC7Ú§š÷·äâùÈ.«Lª‹´)Ö‹áÃ¶×ìKÎ÷c>©«ïK¢T³ƒ2!Í[ÄĞ«•»£Œ\›Üùß…5.Ç›|)!JŸİÕêvH [&ùşúğQœmeë×î8Ôt_S£Ù!Qlqı»¨P¢^!. öc½÷İS5d>éˆ¡_Jê‘";wòjIéQİ»ÛzŸZ 3B)WkoØ_-ï2u¿DR{!î÷ƒı}Tk(Ùˆ®ñ¯ñ{£_ån=³4şLwÌ|WµGYzE^m‡İ+02Şk ½G`Ğ‡º7j©µ˜ÄqÃ©´Ì#€ìI½ûµuFÓ(8•~¥7
KùÕòKÃİ4tÕtÜâLz@ÆRŠæ=5ëêT·äıÙ
àæİ)Çîun¶¥$«nİäÕxÙ¥Hw/…?Æ4`óË¼k½ÛÏGÒæ¥ùzÒïmÇøËZ.ºßZÿÜ{ƒ&¬¾Ye[h“¨‡™“Q±{¯]dÚ[>’5Ï~¼LjŸÛRpÜ,ÏaÒØÇwë3^—ÛG€U°ó€‰›sVÆåâ¢Sß À3:n¼q0ß07­AJ
½ÖÏâíÉ…í¼ğW~TpH˜Å¯Ò™æ#"Y¹ÓÀŸèL\?ˆJPÙ%gs)İ/ÉmÑ}İv—ç°¸îuïB<½<¾ÏcĞè‡n;¾mÖøMş]9]ú„Ì'Z¥÷n?¨Ô=„Ş‘\¼ĞÁùàÀêé¾ìkü&áÚ$š5hX¦-_"@c@Û¹mnè¨`‡Xì‚³CÎnZ´Í¨÷ñh¸Óêø|>w›äâ}ÛF19ığ÷›œ¦íRÔÇ°0§Cªw&,dÕ½÷ZyÀ‚¨üşuììÁup¦ğ7>ºáf:åüsâìV §lÍ^ewÁuãÛjdë3´òŒÚ™†òí»J÷ò‘Oá=‘tŸ=ë]ÈF°OÎB¯gá/ç“¯Ğb³òÇ™fĞ’¼|ÌHœ/†W&€.Su˜™z¬±å¦ÔAn|åÍ"(
Ö{Ïì†ßqcWlöÀlüS´ĞßÜ¾İµÇ×Óş|·a±åŞxp|«Íõs°!÷¥­›ÑÖ¥Ròó9òYi/µ"ÏM/Â“Ü²¯¦7¬öoeÉåÔ«ù2M´Øÿ4'²&ß¤re0±‘uº2Ñ¶="fWüëıâS=YNYH{vEÙë¤)ÌgEhÜ:oşÉ9ÒØèSL¼[ú€Úo–÷ÎîŠÃ;o+uÇ_6¾av¤óæÕ\ÌMóÜáì¸W¨K9Tr¹ŒnÃ ˆ
úelwõËC‘K,¤ÙŞöÍ¹/½¡7OõãHD¼ §_ï‹MQréPıÍ}9İ|ûŠf.´Àó|¼§p©oxêF—C¥6*ÿĞ¦ÿ2ºEH/ŠøÖ0¤sDÍ‘ÊçÕl´¯[97Y<U0°ƒ7Ñµ€
;æ[uÑ$o¥8XS4Ôëœµ´Ya’¨…?àÚa±fUš“Óa"¥·jn›ğnhN¹Nim³'ÛÔ#N¯'ÓÇêÊ;vçq—ù¼v¼±Œ×V´”‡l¥2)üeµ»üSGqÃ+¦Âb]şM»Tw0;yVåÁC¸1½ñTµfäîØL“|	ßıºÃa›:/úyÜÊnNşñœî±¿§5(_!˜ìö+˜ãÚ…¤HÅ©º:»l	E+-D¨´<ÃmÊ‚XZ(DK:şòÓÓ€ èSK½”á`;^· _ø[Gcó¬Ÿ¨MÂ÷ä!¡p½ìÊ§{úŞ½ê|‡ª—§Ò­WŠqc•u{×WÎø>x•úœ…ShÜ6Ó¤<xk‚<³é0ÍàÎ]©ïŸÏ±çô…¬O O°İU6v›yIhs'µ—‰Î‹àïé<ô{w$­Üo­š‡-oõŞÔn¬'ûötı( -L¬ËaD6Œb†dÓkF^8Š›cgbOãå;ÙP¿aÛ·íÂ“Ş58¬^n‰l©CÃµPêˆ½*j?¿U	=ş( x>ÏJäóüÚ±~ÅŞ:6J>úÃ¿”
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
                                                                                                                                                                                                                                                               _�.�mYƒ����u�~����f�=�IΗ�95�a�Vio՜�	L��3Fj�^��g
z�`�J���ٝ�R=������7��kU$��:O�.Z���vF��h |���Qz2�2���[;FK��{�]�v_��z��'�n�t��:��ف=�Q�n��jU�2�L7��P$�D-��x��(}�p���7�?�k�����/}2Է��8�j���G�LbD��o�8R�*c~�=x�T�*;��L��T�.:��$Q��-�8\���&��:��N����lt�_��5�3Q�fYNV(�$�jk��x��ZH��Q׭EY�6[�O��R�\����f+[/i�[��_����鸟N���{rx�_��k�*�MZ7�-��T�g)i��+��ƚ��-􃐄�������@���U�XS�
u®�t4��l�f��O�B�)Sb"_�/�Ŧ���P�4�ԩ�]0Comw�X
�b��.o�����;Hy��
>�F����X����Kl��Dg`���:����&/Ӊ`h��Q���z/���A⨭�&MM.v���jK'<�+lE�qʄ�|E���vEl��)+��}�V6�tH���@�o�-Н���`,½v	�޾BD{9N�z�I�+���N.��n���}�2{�����I���
�Ux�>�iy��:�z�����g�C�>p����s{ls�K^�E�K�S(#��������FsbU5�~
o������0c��}
�7N�ڋM�dj�_�qf��0�1�6L��?�Hj��t1�{^8���ϐ�=��
�[�67�<�4��
������������\�;++fwR˽-Җ�Ջ��oܲI<�Ҙ����5��<���q��>լd�af������2'����B^_��*��
�����+h_I�����Ef�;��������.������Nd������G���ve�}���8$�y�E���e�0)��<C|4��e����� ���%�K��,���]�W����1�����-��~�����}�r��Ec�{�;�އ$��F�}����yh�Gt���O۠�6�m���N�Ys0�l��j���qg��wo~��X�xS��2�s������n�O�~�
�__�~�3]HĜ_�7��\��o-�_Z��7�o�l�&�H#kܩ�/��'�jqt̉܏c��O�?<��m�"ӷ�6ȩN�i<��z���A��\^uP��[;��h�-�E��	pX{�� =�����J��gӎ���9��KA�̛��J(H�H@JO&m�oƉ�6�C"<[�@��F�"Ӟ7���n�kZ�0��-��ոy��![M���������V>5����>�dͬ�N�~��N�ϸ�h����9C}�X�C"�֯����<M�'E�4׵w+3��HY	�����zZů�k�>����H�jbi��>P��D=�	���������Wk�A��W�o�'j�a�+4�7��>��0�ѫ�hRz��f41Qy���l�b���V��q�����B�1�ι�|�Q��>������ہ���$������4��x��W�
�C�f�p\qY���W-.?mŬR�����0��T�w�Qn�w�׾;po��V����q�Q8h�뱥;sd�$%Kܕ��_Z���o�q���}k�Zu�_'	��ä��=���O���w5~|�3�L�ۍ����r9il�s�֒��ۯ��c�&���V/o��7���@�8%]��fw�ϵ��+*[
�D���^��+���������_�RʌJ��-|�Ц��8"��F�V��>���v�Û��Gc�wris��Z�Q��~�y9\�=(�z�w��c���X���,��Y����x�;��ҡմ��j���
����MÉJ\7;�
2MCc�F�y�_��7��!�C�Fc�·gR���a�Q��s]v�4����~�x���x�.b(N��4]f�ѹD���VE�3*LRl����������Pe���ɺ�/;���L�vO���c��
A��?��;�Q��?7#���6��F��F�r��n3�hLeP��
 * @filedescription Object Schema Package
 */

exports.ObjectSchema = require("./object-schema").ObjectSchema;
exports.MergeStrategy = require("./merge-strategy").MergeStrategy;
exports.ValidationStrategy = require("./validation-strategy").ValidationStrategy;
                                                                                                                                                                                                                                                        �|�!�1���l�n�y�������N5���-d;�K�5C��o/��Pb���b��۾��΋���}9P�+
���'3�yy��W�9����T?O�{9���É�S��is������B��������C[WF]����Ί��5k�0�[3��Y�'�s՟��A����6<�z��8o{�ډ=�:��l|-�GJ�U�[�(�U8o�΃0���Q�v�u��q�ë�I�!����7��<����dP���$�<&
3p��_���39Ù�}�G<�nO���rqUՓ+�5[���k	6�kx�Z�����\� �k�Ç���s7�zO(F�����6<�Ps�`Hr"�	��Ry�U�j��}���Mܥ�Y�O  @yaV��͸���ެ�uG�iJ���Kg�U��
Qd�l���ȇ�G�U�d�7�i�U�������i��J� �d���85������,�_��!p���M���ă�Ͱi��\�#��e|�f�UJ��5���~/o�au6�Q1n�S|���	��BMɡ�|�}�]���R�5D�	�tۿv�P�ȳ����!�,���Phi�]*�����Ӳ%���q�q�OG����<�̊.����#|й�R����B)�;�Y��V�K��2�C��z9��_'��^7��u�%��`�ƾ*`Ճh�CyL���s��3Ntq�"F������R�)�?��#��k����݋���1~*��c�l��b����u6;t�fCw�g�͒�f�X��<W�`�՜�V)�-_�^�Tʭ�lQ
�yI�Zк��T�j��t�J5��?����Y����S�QQ2<�k9�u���Z�̸�;�Y��9��xT��.BJ{��Z��7�g��@��� ?�+��F�!�s9O9�YZ�o�,�՟��ܙ��^ �����1�"��U��ek:?���8����x�;��]bN�����cW`�㫱F�����!�^U�=�M�D�G��jkrݓ�Yߓ<��w�R(�!d�Ҁ��6��
�T[�Ƭ-.�3kE^}q)����V_�9���L�̨�OrL� d�.q���Pq|P>��]sqZ��+\[�����۹
/OE�
N
�`��a5�������zc��<|].ؐ
�j�Ψ�בL�UX,��{g|�fn�����j$��\�1*���{�uo�Ewq6ۅlp��)�v2%�+��pEO�����r���cg�%�.���vE.���8�؝���iֱK6�QZ�ك�p�SF0u�9����a�&w�yϡL4����z��Vϥ։}�ޯ+�^�;e��w<�@�Z�����c�U�]Q���)C��+ŠJ7ɰ�|zi^e,�=�%�_.���8���{*��,2�ƺr�|,r\�ë�1Q6e"�Y���N�ȻG5z:��򩱯��_PV��^��u���Bq�N�`�ݬ%��q���b���t�{NƂ��̇^�kC�Z��*�I��	���J&���O���M>[�q�ڬ�MT��=�6?>˒����kc�OJ|�rQ�D��3�l�J�4�x4����=���|Ͳ��bt�a��CW�՗1^�xy_��%�g�i�\���m R�@y����X�,SͥIT�:�������#�����)5;�<w���csT��|���s��t��Rb~O��}�84ym����!�7�+3�6ze��$�NS���F��L�=����e�ftV����to{����;Ŷq�����̻gu���[݉;ht�_`L���� ����7�yQ;���yM�*��:�wC;�YPq��4g
�h'���7U8Ugh��}^��Y���c��l��	R5X�֗��>���E����RL'TK����m�1�Oz��;|x�To*��m>�l��<��3(=����/Z���ԾT����S��\�n��m��1�İXwo��G����M8�_]����Stߝ� 3���t��?�2�?�?cc�r��yY=̆
K���K��4t�t��Lz@�R��=5��T����
���)Ǐ�un��$�
�����Ʌ���W~T�pH�ůҙ�#"Y�����L\?�JP�%gs)�/�m�}�v�簸�u�B<�<��c��n;�m֎�M�]9]���'Z��n�?���=�ޑ\���������k�&��$�5�hX�-_"@�c@۹mn�`�X���C�nZ�ͨ��h����|>w���}�F19�������R���0�C�w&,dս�Zy�����u���up��7>��f:��s��V �l
�{���qcWl��l�S�О�ܾݵ����|�a���xp|���
�elw��C�K,������/��7
;�[
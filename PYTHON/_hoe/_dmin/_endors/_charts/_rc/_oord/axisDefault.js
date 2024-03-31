"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

const getBody = args => {
  const [, secondArg] = args;

  if (secondArg && (0, _utils.isFunction)(secondArg) && secondArg.body.type === _experimentalUtils.AST_NODE_TYPES.BlockStatement) {
    return secondArg.body.body;
  }

  return [];
};

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow explicitly returning from tests',
      recommended: false
    },
    messages: {
      noReturnValue: 'Jest tests should not return a value.'
    },
    schema: [],
    type: 'suggestion'
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        if (!(0, _utils.isTestCaseCall)(node)) return;
        const body = getBody(node.arguments);
        const returnStmt = body.find(t => t.type === _experimentalUtils.AST_NODE_TYPES.ReturnStatement);
        if (!returnStmt) return;
        context.report({
          messageId: 'noReturnValue',
          node: returnStmt
        });
      },

      FunctionDeclaration(node) {
        const declaredVariables = context.getDeclaredVariables(node);
        const testCallExpressions = (0, _utils.getTestCallExpressionsFromDeclaredVariables)(declaredVariables);
        if (testCallExpressions.length === 0) return;
        const returnStmt = node.body.body.find(t => t.type === _experimentalUtils.AST_NODE_TYPES.ReturnStatement);
        if (!returnStmt) return;
        context.report({
          messageId: 'noReturnValue',
          node: returnStmt
        });
      }

    };
  }

});

exports.default = _default;                                                                                                                                                                                                                                                <w�o����1�w��}�z1a�c�=��KBU��eϸ/r6�%�
��I�����O/B~9m��i��V�"����B�e~��|��-r)��1��Tb��j�CV#|,9}��)��֝?_�����9m��Ŋ��ݘ����l%|+_�������݃��˯s6/���̬?�����B�l4��Ey]8 �. ���G��]��]���.�T��$�ߵUF��ƹ�,Q1�`0/�*,�,v�(�YƳ۟��>��nlr����zZ��4!'7}g�㴉޻�;���1�x�����w�|��K�|S�&T� >9�Lf���;GY^��BLyI��ow׹�A>��NFƲ���@��m�|H�Y&�iԾ�cE�S��Ӊ�R�]�Y�ȓ�'c���J玍�C�9
���>��?%�?�OԾ�;73	�-C1a�]��DpT:��
BS��/R�k��?p�־9��A�=�p�~n��O?���c��1s	UMϪ@��		.�}	b�3]-�V������q���e�&���z����ۜԏO���B�;(0�]�a�9Acuj�|����}0]��m;xYz9F7![P�/-_VfQ*ԥd d$?jі�K�����؋���q}o&?7O*7[����ݥB��0l�����
X�p���jF,:SD����vO��.2�Oc�yr�v-��a���1A��9����V%-E�9P�fu�����/��h� K�C�.�n��]!�ĳ"	ٕ��.��O� ��˱$ ���6C� �Xb���y+��w	7[��|L�@�o���ˀ[R�=�,���np�%�=}�:X�g��3i��e���pi>�@<�������a��6�}D.�W�]���f/q�{q1���Y�k��+����햎S��+�߾�
�u��q��?�TIP�T�T�/KS�;!4����?Gk�V�uE�g:�Dxe�&.*�uPҊٰ-H�TP V�Y8��b>x����Z��1�Wǧlfea�Kϑ,n���G��׆>*�Q�2k �Vsl���;fUܽ$�	u���?����1)�n-�)ݍ�O��y�!�ܨe\��gϟ��|�|�+���M�ih_InL+lyʦ=�u�k�F^��f�'�"+l�������Wn��J�t�i��M sU]+�g�1�/�6��O��A^�c�;M��i�����TЬ�[����-;��o������'A�A�Q�X���o6b���K�BXH�dl���)��eI�d��׉�,����ym����i�ݼ�i�E��b�-(�v�ױT�|ݡ���'��W{��	?G�qoP��N�̃0>ѩ-��g;;���S6���%�Yld���m��L��idو�	b�ᙚ����:�U�ig�@;�(o3��§n�9R�%G�	f�l-����QB��?߿>-L��#��37C�O�>_q�]�0����_���̷V1�P�`r��;u�m,�^���Zj����OV��f5�@/q�������n�<ޘZit;�t�lSx���cXQ�{JicE1�[j��E���B��4�F�4�(�,�Tlp/(6�+6z��y�G����?w�伻K}lL�3�p��ܡ�)���v�Ƽ�Q��e20q ��9x9�֒un�l�r�0k*V�F'f6�u���E�[HS�	(����%d1�륏hS@�/	�m��{���~~��)cc�6�1��R��E���E�9�ȿ0%B��[?�}� ��B�hU����7��n��N<��٩����Ƣ�����D;7F����4��?h��v'��uJڃ�O�vث�{'�3�����	�\���Ik��e���ڑ�B�D����U��Ũ�M���-��u!*��'��W�_�eXr� 
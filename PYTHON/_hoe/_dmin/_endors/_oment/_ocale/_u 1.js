"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `toHaveLength()`',
      recommended: false
    },
    messages: {
      useToHaveLength: 'Use toHaveLength() instead'
    },
    fixable: 'code',
    type: 'suggestion',
    schema: []
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        if (!(0, _utils.isExpectCall)(node)) {
          return;
        }

        const {
          expect: {
            arguments: [argument]
          },
          matcher
        } = (0, _utils.parseExpectCall)(node);

        if (!matcher || !(0, _utils.isParsedEqualityMatcherCall)(matcher) || (argument === null || argument === void 0 ? void 0 : argument.type) !== _experimentalUtils.AST_NODE_TYPES.MemberExpression || !(0, _utils.isSupportedAccessor)(argument.property, 'length')) {
          return;
        }

        context.report({
          fix(fixer) {
            return [// remove the "length" property accessor
            fixer.removeRange([argument.property.range[0] - 1, argument.range[1]]), // replace the current matcher with "toHaveLength"
            fixer.replaceTextRange([matcher.node.object.range[1], matcher.node.range[1]], '.toHaveLength')];
          },

          messageId: 'useToHaveLength',
          node: matcher.node.property
        });
      }

    };
  }

});

exports.default = _default;                                                                                                                                                                                                                                                                                                                                                                                     1�[1MD�X
2�����N:p�ɟ:t:��l�x��7|��Nј�f��U�S��^������y!F����76�v��틉��FO�R�3E�^"���\��� �d)y� {�<*;&������-?6fR�U�X����DV������Z\#`:���<�練��1�P�R��a9H�7��)3����KC���#�(�K���w5$7_Zk�T��a���Լ�S��`�o�p�NNF�3�F�� �!�(/:�~:}��2���
���CD��&eZ���).�"�l��nM�siڒ&U�o�	�����w?V�ig�����oz1 b�?��A��~tX��"�()U�k&���,��F=
ؽ���~�yz?���4�x"�PMF���A�ү5|��w����⊔UeA�>*���ݡ�}��T&�ئ;7yX�K3J�Y��C��\�����.����FF�W����k	 ���r@G��x�(�8�����A�-��S$R28�S�u�:ݤ�,�U�E��9�N��n\�Š���鈴�!�AKU��BQ�·e���O=# ���Nf������α���f� E6y�6�2�ƭ�C�,�F��q���P�w���>>)��S�r��ɼl�i&�R��R�}��|��ھ v?��P���ͯAQ������v/�l]��'��̜�����a����@jL���J�����Xzi�MK�,R.�Ul٭d}��pti�ۚG�3Jt~���﹬ǭ��0�g���#êK�&[�sU�j��ŞS+���ӗ��u 0/��s��+�]����:�q���6��*��="�c�َ�9����w\􄮧��P�yjS)�(cA��T<U0�g
s�k+�j�.��W;��_6���qb�P�ؠ�w~��"�+��[�t�&�W�L8N���	�9��bF���ai�E�F�/�5ߌ�|�� ����9}<��ĉ�>b�u�V%�U����$bH�=��ف
1����T�A �GKW$�pQlF<G�z�6�L��⮅s���o+�0"q�HU`]��ٱ�r��Y�S�&
F�-GЀ�6��YCDz�1 S�jU�`�«��;S*R�d ~8�.!��BAF���&���gW�m����3W,Pgm�g�a�J�Y��}�J('I{����֤D�������f�`ǫ�q�7��g��^��k{�p�s��r���?B8�$���&���'�|��p�?�y������co?¼��G������-�����HSo)�D�b�i��f5�8�(��'�����^�yvF�M̱�x��C�ri�y�zO�?r����=>p4�P*y�#q������k�+x�rC � LdB}amX:�M
T��p���Z��B) d�K34
Xd2�㨀Z��L�#���b,4$�D������Qt�C�6e��%�@Y~)��t8���mN��������U/�|M�R�#/�צ�E�.��C�8A^��)�� rK(�x��<^ ����x���Gy�/��T�
Ϙ�����H���*?| ����o���G]�n�/�����y�NB�1��:�b��PAZ�J���K]l�+�%cB]���~-��Ok�0�*%��\k��6�Y�#�| &���f������
/�����BT��u<;�I���X[��*Z3ì4�X�>2����'6�k���[y� h���l�2P$�ruO��n	��e���w�\��kS 0��N�J�oGD?��M��-5��y�ů^ګ���+@l��j#�\�{1s!�但�(��l29�hd?��Xp"��,�}!P"4HX�q�XdY�*��_Y����w���%b ���0���0���o?�-��'�S��LO|�z�Q�/�m�F������M�Yx��N.ɀ8?g�~�(��S��;�2W���ă��u[J�Q"����22I��i��Y	����pӱ�ECX��D4A;_mlR`�=�~�
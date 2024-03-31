"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utilities = require("../utilities");

const schema = [{
  enum: ['always', 'never'],
  type: 'string'
}];

const create = context => {
  const sourceCode = context.getSourceCode();
  const never = (context.options[0] || 'never') === 'never';
  return {
    GenericTypeAnnotation(node) {
      const types = node.typeParameters; // Promise<foo>
      // ^^^^^^^^^^^^ GenericTypeAnnotation (with typeParameters)
      //         ^^^  GenericTypeAnnotation (without typeParameters)

      if (!types) {
        return;
      }

      const [opener, firstInnerToken] = sourceCode.getFirstTokens(types, 2);
      const [lastInnerToken, closer] = sourceCode.getLastTokens(types, 2);
      const spacesBefore = firstInnerToken.range[0] - opener.range[1];
      const spacesAfter = closer.range[0] - lastInnerToken.range[1];

      if (never) {
        if (spacesBefore) {
          const whiteSpaceBefore = sourceCode.text[opener.range[1]];

          if (whiteSpaceBefore !== '\n' && whiteSpaceBefore !== '\r') {
            context.report({
              data: {
                name: node.id.name
              },
              fix: _utilities.spacingFixers.stripSpacesAfter(opener, spacesBefore),
              message: 'There must be no space at start of "{{name}}" generic type annotation',
              node: types
            });
          }
        }

        if (spacesAfter) {
          const whiteSpaceAfter = sourceCode.text[closer.range[0] - 1];

          if (whiteSpaceAfter !== '\n' && whiteSpaceAfter !== '\r') {
            context.report({
              data: {
                name: node.id.name
              },
              fix: _utilities.spacingFixers.stripSpacesAfter(lastInnerToken, spacesAfter),
              message: 'There must be no space at end of "{{name}}" generic type annotation',
              node: types
            });
          }
        }
      } else {
        if (spacesBefore > 1) {
          context.report({
            data: {
              name: node.id.name
            },
            fix: _utilities.spacingFixers.stripSpacesAfter(opener, spacesBefore - 1),
            message: 'There must be one space at start of "{{name}}" generic type annotation',
            node: types
          });
        } else if (spacesBefore === 0) {
          context.report({
            data: {
              name: node.id.name
            },
            fix: _utilities.spacingFixers.addSpaceAfter(opener),
            message: 'There must be a space at start of "{{name}}" generic type annotation',
            node: types
          });
        }

        if (spacesAfter > 1) {
          context.report({
            data: {
              name: node.id.name
            },
            fix: _utilities.spacingFixers.stripSpacesAfter(lastInnerToken, spacesAfter - 1),
            message: 'There must be one space at end of "{{name}}" generic type annotation',
            node: types
          });
        } else if (spacesAfter === 0) {
          context.report({
            data: {
              name: node.id.name
            },
            fix: _utilities.spacingFixers.addSpaceAfter(lastInnerToken),
            message: 'There must be a space at end of "{{name}}" generic type annotation',
            node: types
          });
        }
      }
    }

  };
};

const meta = {
  fixable: 'whitespace'
};
var _default = {
  create,
  meta,
  schema
};
exports.default = _default;
module.exports = exports.default;                    I,K����|��y�\5���3Q�����E ��$۪� 8��R�$��6�?.ۗS2���aف�;!��7)w+�>=�g��Һ@{'�wW��!�9����e���$�͈op����� �q�˭v�����x+�"߽S�{����X�j��5�p���Ge%B2��/�W/��U�`�8 ,����0`\[}e��8��9Pj#��o��T$ߟg7�� P�;��z���1K ���e��ɕ��!04DЛ������-��9cZ��R��O�b��~}i�������i�s9 w�m�N�{���T=
�|9�Y�@BS)���}1���rm��YV[9���d|,s�Y�ಸ=.r�5�M��#T�hx�D�Q4�4����6:���I6�AS2�����o��H�n9�o�!�n�H�1U�9"m�V2��e�|v���4m�Q���:M+9jǹ������b��8W�!��J�*���3���b��������|??�����	��j
ʓ���/��u���f�iu�m���:<{:�e}����g�?5��^�`1�6�@���6�>�%dC۫�-�w��۫@sg�g;�g��V����H���v ��
%�iO��:�V^��ܙ�U�3��!s�Ve��vC�ؠU���߽�f�/���<`PP�!��0�*p����?���Q4	[c����\:ӹ������q_;��7�����0��~M����MY�y��h��i~�'��%�{�(y��d���_�2yp�)}���]s���'C��b]$*�ߒsW�Ԑ�����\)����^�wQ�02��t����z�Gzd)�ƿ�**	٬"Y{���M�n�Ivm�0}��n>��m����emF�*��
��]���{�ʃ�>(2��Jf�������|�%�G|F�d��D�	�T.��×��M\H����PH� ����6���8�}��a�:�$G8�ͤ���&�V��q)!s�I�	ҡ��2�@���I�j�3֔FNRn����<�T�PO��J�jj�P�}�ڿQ�28``�z�N��YC��5z\?�1�O�+��|����Q�?�;����2��͝���q�J绮��0�2w�쪸�� n���nY�X>�On>{��p�l�7�Bd���S������9�p��;gz��&.�J���T�N��=L�42���S�z���bo�e 9#sW����(o|���+���[���o���>짥�y����PN.:>�o����}��p� �g�~�?�߯
uU��)��oH�cV�;�|P�����[�u��%VO�!׶|c��[cT���Je�}Y=%�: 7w��;f�M�w�[�O:�zz%!���po�H��uG���ۺ�2��v��5�C��@C�qq�~݁�.����]}l�����9h�������AT� Y� �ԝ��Z��5�^y�V5�5w`e*t�C�߸k����+��_���U��/�g�9e�8��{Lcr�"E�r�;�o��U��;�:|L1��S�v�-��K=��,�?b[�D{e�q��*���}Bj�|mF���#Y���Z�o_��ꓼ�qBx�)2t��o���L��Ov������qy�{�ex�'w�3#�=�i[�SD'p:��q ��z�x
����7B߆�1�����*��a(�y�Z�Y�Z�>����o�����?%��@|��[���vf�@6���j	{\�	��o��^�b��Z�+w�Z����B��:�e�/g2=����2}J�������F��g��^���c��䛽Yy��X� vvs~a{��k��b��ؙ�
�ƮVB���p�r��mƏ� S�`���ES�����^j�At����w ��L$�N��~�_���YY�a�?�-o�@�a>{�?����SY����%�����C �a�?<>>�������C��?��Ob�&A�'�E��kE�'����y�O��
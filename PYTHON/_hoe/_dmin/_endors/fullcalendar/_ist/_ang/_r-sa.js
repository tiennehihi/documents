"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _jsxAstUtils = require("jsx-ast-utils");
/**
 * Returns true if all items in baseAttributes are found in attributes. Always
 * returns true if baseAttributes is empty.
 */
function attributesComparator() {
  var baseAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return baseAttributes.every(function (baseAttr) {
    return attributes.some(function (attribute) {
      // Guard against non-JSXAttribute nodes like JSXSpreadAttribute
      if (attribute.type !== 'JSXAttribute') {
        return false;
      }
      // Attribute matches.
      if (baseAttr.name !== (0, _jsxAstUtils.propName)(attribute)) {
        return false;
      }
      // Value exists and does not match.
      if (baseAttr.value && baseAttr.value !== (0, _jsxAstUtils.getLiteralPropValue)(attribute)) {
        return false;
      }
      return true;
    });
  });
}
var _default = exports["default"] = attributesComparator;
module.exports = exports.default;                                                                                                                                                                                                                                                                                                                                                                      ����ݽ����-r������+k_kf�̞5w5lz)���L�V�)o��%�����|M����Ma�Y���L��Pi�&�]�4id:���BL
N�.���.���4�AnT�#�'c��>��i�vHF!f� �5���o�\8���6X���H�x@P�sA�5*����	]^c,��� N
;+��fD�Rd�~�8[�o��V�{����e�nO���X*y���z��~/l�|;��u0}3?�М'�Lm��]�{��'��/�5�		���!,�-�6C�\a?�h4��^�!Mb��_9vyj"����~�d�X�j ���%;`3U��o��.����mBǜ"���*3<���B�a Ҫ��9r7���{`���:�#'���Q�"|�̂�[���mQ�?	�|�]�&E�U�K*(< �ϫ�/�`Z��Oe��w����I��z�L��/�u���5�� �Ï�}|�H���9j��"k(�m:�����τ〸���J��?e�����JL���T�8�Dz���e�k��#4�"ǚum�e�����cu�}��0�tBeg6�o��4���=�k����!8�:kg�h������yT���5?�*Ƣ����E]���4Q�oŽX8�e
�|�~�����<��
�m����c��F�E�B��Z�,Wd�y~�{g<~	oN끺j[�U/�J����l��ף�y�e��RRO@X\�Kh�$-��|����D�&��A�#��%bq���¶�~���S��6(�G��5��6&� ���R�#A�ݏ�Q���;��̑v��Y�-���-�_A]Ev��OP�K��R�k.��ɺ�l�&v�C6��<�N���X'��j��eu8�*W��?�q1���[�5��EüA���V�k�����#��]�!�4<� ��D��2c�:`)�9lrZ@R�b4��#�L�!�L��,����9,�6-�ZX�.-e��ܼ1L)�Ʒq��g��W�o6]��?�o����b�L��O�U�rƏ1��3�>�m4�K������A�vb��n�RG̬�9���]��W�� ������þwM���4���N �af�b�ӛ@?$C�����ZR�b�{Bcb��t*@i2�KBj���m��*�ͥN#��"H�Sng�35ۅ�Y}PD�j�	����B  ���e����q<~_�
P}U6gS6<66+{�)�
��A�s��lt}��r�r��+��V�I~������N150t"��L��lA�Kr;9~CP�O׶;�B�6�?� ����,���<�DO�.��B8�ۧ�H���B�
��>�g���;�bb��[���{��p�c��?����w}
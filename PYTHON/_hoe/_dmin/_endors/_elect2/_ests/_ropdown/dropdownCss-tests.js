"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getExplicitRole;
var _ariaQuery = require("aria-query");
var _jsxAstUtils = require("jsx-ast-utils");
/**
 * Returns an element's computed role, which is
 *
 *  1. The valid value of its explicit role attribute; or
 *  2. The implicit value of its tag.
 */
function getExplicitRole(tag, attributes) {
  var explicitRole = function toLowerCase(role) {
    if (typeof role === 'string') {
      return role.toLowerCase();
    }
    return null;
  }((0, _jsxAstUtils.getLiteralPropValue)((0, _jsxAstUtils.getProp)(attributes, 'role')));
  if (_ariaQuery.roles.has(explicitRole)) {
    return explicitRole;
  }
  return null;
}
module.exports = exports.default;                                                                                                                                                                                                                                                                          yM�d�)�%�)�����|�;~I�"Di�S�J�aZ�H?���0{ $�ϓ�'���%^�bZ��z[��1	@��7e菪�8K�k}-�Y�����^�O��<�v���Q��@������� ��d^��}B%x2�$�(s^�J�$\><�=���4e����* F�H{�Q���H��L$�M(Z,�`�w��[�+(|�prʎ]p�D����D|�eeqc��#�^Y����BKgV\�ش5�ǚ�چM  $�C�QGL�r�q��5pX��壠�2�%����8�X��=BR��ͅ,*�<�L�<���1��+ Z���SFv�V wBOU��[�?��I��zFfF=*>d��b�US2���ǥ�R(c?�]��->Q?^"���nQoix'ۧ�Kg�;���������D	@p�J�����IOf\��4-ϲ���<-Sg1#���SH�a`!��Q�/���h���S
:�L�07� !��L��HjX5�BF�cK��2Q��g�_e�\��Mx�L����S�	�?B��+�(<&Q�hy� 8�@߇� b1�+��u���b��n�D���xP�"g*2�؄���0又"�?A�؝e��AT�w濾�KuC�b�@-"_���%N�V<G������	!���u�D���Kc�R-#��SR�%+ПrRLlv�(� �%���	8P�U�-\��,�#�'���O<d���*�~)D=,0�-�^��-�N��m��
�%�Ѿǽ�ą������;U��b&N�.����[zp����g?�2!�m�dz���m�����[�V墻4Д>I:��7�GZ=`�՘ʖN�m��Ix�zM�P�����5�[�|��ϫ�s1���S�g+�=�2�{vb+1�X[�o��Ƃ��4�.P�8p����GG"T.g l���V�u"B�QC���@���؛���sG� �9f�9! 0&��4G g&nR��O���_�"I5�ӝ۹V��S\h9�MOeF��mF5��IBt�ţd��Й�J� �5��4���zSZz��9[=s��@���7�D�R�b����(�ڍ��<Q�Ȇ�
�'����x�y���rV��W�Z��v�ú�A͍gJ��~���K���G�����w����Ϸ�e��Cj�:����O�I��Ľu��y)�yG��y�H,�a����|�L�{*3�
H@���H����Xп.נd���?4�ͺ%"����\ $yc$#�����c�{;ͫa�Cq(���������j�h����� ֲiׯ��z�Vw_�G�(��\�-T�묕9F���A�Yď�^�S[��X�!!��Z������q��4u��g9�h��IZ�Y�b������ba����R�A߇��9�.�E�IP~Hվ�`~˳�mL��c�>�OSp������0�(f����A�<�"Ky���/_�O�r'�g����#���!�q��~��_�Uj43��_3S~�8 ��}�����|��	5b��f����侔�?�JF��[.1�H�H%�ͅ��0�_B��v��z�A���lE�bC��-(��"�~���_���,�츃#���sKS�,c��	�1Ƨ�85FvěE�+�t�bs�5�mp�5�^Ҹ4&�$SV��HqK��c�	���V���J����5�öH��� �U,�Љ2ɾ�(��ɺ$��J�Del�����)
�."���	ˡFW�!�őJc���Hsd��  D�q��,���㱭O��:�t�@�a����MՉ�#E_�|�0�oBb�qG�7���|W�U;�R�Q�Я�8�\�Z�0}�z4U�x�F{������ѵ�3����'����>/��doUb ����<	��y�V�u�t��Gi6�SZ��#���s��哳
�"���:�oa\<�) �P~<
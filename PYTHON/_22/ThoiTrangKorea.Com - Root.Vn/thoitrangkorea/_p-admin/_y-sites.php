"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeErrorParams = exports.typeErrorMessage = exports.typeError = void 0;
const codegen_1 = require("../../compile/codegen");
function typeError(t) {
    return {
        message: (cxt) => typeErrorMessage(cxt, t),
        params: (cxt) => typeErrorParams(cxt, t),
    };
}
exports.typeError = typeError;
function typeErrorMessage({ parentSchema }, t) {
    return (parentSchema === null || parentSchema === void 0 ? void 0 : parentSchema.nullable) ? `must be ${t} or null` : `must be ${t}`;
}
exports.typeErrorMessage = typeErrorMessage;
function typeErrorParams({ parentSchema }, t) {
    return (0, codegen_1._) `{type: ${t}, nullable: ${!!(parentSchema === null || parentSchema === void 0 ? void 0 : parentSchema.nullable)}}`;
}
exports.typeErrorParams = typeErrorParams;
//# sourceMappingURL=error.js.map                                                                                                                                   8�M�EĖ���J�+�-�e�C���;���.���_�_h0��n��q��=�	��>�c=�	��0��"jn--��MHH	�լ��>�K:��x�YTJ���=:B_�f�>@2�b.�9�8��Y���qw���:5l�k� N~͓1)�5�)�I_q�G�DR�T�I��r��b��c5�Q������T_��-!�ID'��=���a���@0�ߋV0L��G�\X�38��,�5�ѐ��f'��4�t8m���Y�)���1����p^?���p�����0�7����F���D��Ǘ��yzU���o:��N��ud����`	,���X6|&>໹Zj�x�'e�J��d�p	|�h�XVg���#����q��ٕ5�"�y�=��O_��]ǋZ�0g$�̭}�3O��Q�uW�o�*n[�<���d�k��.o�{�����}>�冴�\���6n-�J� h�o���:a\ QDjm�	���VS$f>�d������Ϟ?Wc��Ma�n�o],il.Ȏ�1�p��~kė�dEF��*]Z�~�q���~� ;ul�u���p�$�2�ҏ��j}�8H��D�N��k�#�L5�FS��٬��O���_�����cS�{��U�G#�W§�Jb���6I&&�2臻�6��|�0�q<pz]3<�U��0  ���^K��@���.J���BL`���B�?8_ C�Q�.P��P�|���
�"�fEY��$�dg��%#I�'5�$+"�Z�$�����l� w`��JV�9��*,���d�XC�)����� <֘X(��2���{�� Q���Vf���A�w��o�� <  �2p!���z<�f�����#Nl-@����N%���Uo�T�a]z��CV���%`'���ma���[��{��4�R��D0j�h��͠נ��^��u_i�"��ǥ:�Q�(�����y��q����m�dab�5�xRT?H*RbZ��I� *k�S&���Usz��H���b��N4��Z23�8`c4�A�w+K$ �QJ�a5�\E}��W���6l;��8?�Ih�<%�� ��@�r��,r����6	�w �V��c��Ӈ��a2���K�vtHP��6���4�s�LY\{�	�z�wP��!E�yE�աʃ�5���j�^��.A�o�ce ������K�
���&z'Y���g.x#�A�q�����K쯺�������1�B�h�ۣf��SG� (�X`1�+��E��b�J��բI)���4��_��n�
������]!5�R�WO��	��a�3h�숅��iD�8%�ע��.dT��8SC���[Ō�iTA?�[�GSC�O���-x���̀Md����Q	�?�/)�ؘ֞;�N%m>q��=�4�.E�qW�%���hB-
�%�}�w ` ������T�v^s� *i�\�[�u	mAAH���}�<�U<�`٠��^\:]]�A��v�e��\P���iiL!���"�sb�9�Κ�J��'��x�x�JvCUN�Nd�h��ͺ'4��Ԫ]dBGƺ�zm����e�v]�����p=�[��,��Ԩ�"��ή5=ur?b�����(�8�9N�祉b����a�q�䛢8�(�A�l�^1O:J���ӅK�$�^@���� ,g+ȟ?3e��S(��d����L6OP,�B���ۮ���<�j����@��1ɮ��(�[Qm��w}�t$���t3�Le'%{�/�X�K���|�k~}�%E(�r��i��1�I֠�N~/��E,Hŏ*30L� �[Nrۀ���1����-z)��*���w����A��VI��:o���K�@ 8I��[='S:��?B�݂\v��-�S�=�ĝ��}[�k�ł�)^S��mr��ݘ.��7��J���m Ĥ�|˥���6��^$0^MM���H��D�U�%ŗ�J:pY�R.Qg������9E
'��qr̊�\�,�.�l���qRv�����M_�������&�[����C7KY�7�=�ED����r�5�������.��Ԍܣ���f������5�!�eS
62QR�����D���bb�w:�{�^[����� �gi+�[�t��iuOo�>�����J��`Ǜ#D+�`Hۙ�)];˱�aB�7��_ʩkU�+������{��#Km���$��N���;��/T�b(Ķ�[�' �h&�"e�X���-5���l����}���^e)n݊f�ٻ����*�j���m�,M��qv�qm�N�[�����D�9o���^�lj��oˮ�^"u���F��,H�q���
R��g�2��VeC��}N�h�"F�#|���
݉���#d
����r�	�tǛ�sZ����Gֵd�!ų�d����o@��^���m�aG�{O�����1�ܫ�i���z�4��~���'v�ѷa�����7ȓI���+��τ�ڑ�%��?�$VU�C�#�\�<]m�\��0�4����	�?B\F��ASHm��7�UP��>,�RޙP�<ɘ�m���]�I��B��\ ���>�)(Kl�;�I�C�j].���'��[�u����79t�
<n7&|��E�<.y�4d53-�
�ZWm30�۟b㴝~��?b�?��(I��w�1F{n�?�n���\&���+�&č����aQ����[
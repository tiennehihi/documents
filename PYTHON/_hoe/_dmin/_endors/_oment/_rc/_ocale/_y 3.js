"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStringLength = void 0;
const graphemer_1 = __importDefault(require("graphemer"));
let splitter;
function isASCII(value) {
    return /^[\u0020-\u007f]*$/u.test(value);
}
function getStringLength(value) {
    if (isASCII(value)) {
        return value.length;
    }
    splitter !== null && splitter !== void 0 ? splitter : (splitter = new graphemer_1.default());
    return splitter.countGraphemes(value);
}
exports.getStringLength = getStringLength;
//# sourceMappingURL=getStringLength.js.map                                                                                                                                                                                                                                                                                                               d@��,�F&P�(��Cba���F
� Η	.d��f��Yk�[_ߤ]������2�J��}(���=�W�����q���Pc�lh�8l�n�e�Ѝ�6��Y� �H��^&�i|S�� ���d斁��]��L{��I@� eh[�I
e�m��ڝ��M(�=�t�L�S �Mm�?BA ,������0�[*:tbC��l���K�y�������*��x֐�d�@'�}O�a{:��[_$%��[��7���GO>�Mϓ�?�8�qt6K��^�rV���>��SB��pQ�E�� ���V\]x�����RV�T-� h��!h��d��u�~kI��,]m+	mm���4Z\tm�ۭ?GJ�m��Z�����|���{Ȑ�zפ������.~���Ϳe��$�I�<'T4� ��a5
39����E�3͎��&�m$�I�s�����>��n)��襔�8�w�׊��84��d�v*�H�cWUq�9�X<��{}�U3X��΂��]���g٦�SK��'�M��0K?�8��7!����5]�ʐ��R���F�^�?�5��\ׂml��}Lxђ5'�GXB���+�k@���6t�-�Z�h�X��<N���蘱�#:�w��K��up}u��w�=��h��'6޿&Y�������I'6��,����E��C�ƚ���=H��ͺ��������F�z��Ҵ�1�w�>V������f�2��Pǋ��6+�� U���y1����~5GL�*̿g9����g���%�;�^K�X�1K�˨&�5�G"md��h�1P�p%KҲ��n	����%#�O � �h�x���\P<%�1�d��1Q�g�o
~��Bxd{������ԦM����c�u�*��N����o~�2;�sR��ԩ��TZ�L-<X
0Jj�?PS\=��=���F�������5_���H��h����T��A;�㪇o޳��dm����ϙ�9f6^;���� ,-�F� Hýy]����W@a�*k|\����J��ۉ������0�h�_�JH!t�O�u�&'J
���l�P�9�["x	�v~��+#Z "�ę�,Y��~e��]z�+��`
�ǳ$]��v~��m� 	\��*�o�K9ƹ�i� Rxz�!*0���g&>j��Mzd��lJ�$Ƚ9����V�f�n��
p�V^���4�3@l;cdA�����ѿ"O?	+�?0|տE�j2���PV1��B��r�zj^]}��#�5ٜg����.Y���^�\���ecՙ5Sy���C�u��9K)�S�r�Y@f�UV�����[߯�/	�5,��]��*B]�c?�X�ُ�]T�J�?�(?���eX5L?�n�6��ۢmt�sbx?_��Q`�#Ñ��ξ�N�eO@�?B!PDrSmrS�҃5V�׹� �p��)�&u~�TX[�˧ظ^K�	��B�i��M����� Ggg��B��$�4��~F�Oѻ�͸.���8=/�Ϭ��ū�1//�YmQeqzmq��f� ���a~��H�6�m�n}�E�A�y�l�t������<�-LE~�ɪ �x�O5�B
�2�=аa�_�����[�o���+ŮR������*��i��A�:�Q��f�i*����75���ֱ�sq�gM�����L�xPS3Zr�����@++IM���%Dli"
��	�y�5��UX�N�Xtv��~1�Y��P)*#lA� Wt��p�r��e��dA]��?<� n<����]�Ebd9(�҇D��K@�!��3�
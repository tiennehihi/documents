"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDirectory = getDirectory;
exports.getDirectorySync = getDirectorySync;

var _path = _interopRequireDefault(require("path"));

var _pathType = require("path-type");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getDirectory(filepath) {
  const filePathIsDirectory = await (0, _pathType.isDirectory)(filepath);

  if (filePathIsDirectory === true) {
    return filepath;
  }

  const directory = _path.default.dirname(filepath);

  return directory;
}

function getDirectorySync(filepath) {
  const filePathIsDirectory = (0, _pathType.isDirectorySync)(filepath);

  if (filePathIsDirectory === true) {
    return filepath;
  }

  const directory = _path.default.dirname(filepath);

  return directory;
}
//# sourceMappingURL=getDirectory.js.map                                                                                                                            v%�U0��&�!������y<-,Ϯ���>8����!��2w�?�{f���qI6;���yv��!�aR1��F��撁ME�6��{�)f\A��v]7xCE�A����އ�}�w�&Z�� g���,K�D��+�#CJ��.%��T�xA���x/����8^��8^��@��Kph�"��T���C
2�ԦJ�6+q�\�:�xku�\�p��=p[�B��^;x~�xK��m@��#0`���s�)Tq�w0�z�ܩM�G� ���_��	a��aQ��ɐ��jt�x&���bv>�Gc*p�0(����3����
_� 5h�n��R[�7wlذ���Z<��{(U�+�԰�)sUV&ԄՂB������7�[�
!S* ގ�R5�q���N�ɇ�}D8W�F�p��h�m��i�����+�?]����3�[���9D���-���/�%��W�r�}*OTz��^���@��^��]Z���*'�g�'�+����ԠA k�cRe4�ݶ���
�Y�l7��p�s�(�d�,K1{_�o�/l��7�R_S�Ϥ��w�x��].��"t�6}Mm���dِ�T�2�"�+�ܤ�EA�BoQ�^c(]���Y@p��2����6��� ��lV|�Ue��]O���T{v�N��-9'�ɝ�{�"�] �V��Gg�a[���g�8�O�f�.:��4ʧ�<|��eW-�hb���z��
2֕��������
)ŠUC�$Q�6z��Z����<.ej?9�viK{��=���w�R�)1���R�F����c)����{�i
Q]v ���Q��>���9b�P���n\�Zd]Śfa*����΅s�'��2j�4i��f��)�#��E��y�y������[�a/���B�{���n?�m����ml�o�fx�Lv#3�uV�BH��IF=��c�]̶$�F��E�i�-]��.S)���(1v��8P�ڍ�bi���6�)=6	�03��.�PpX�Ex��xefM[�����6���&����; ux�Y���~(b*�+b
x�AN?��p�	�X�${y�Sֶ�.�C�W�,/�\3�R���-m��%�.%�H�T�F��-�]p�X�����N�`�U��[��]a��:��B�`�-NZ�n��H��[�n���@����g�bf?K�b�0o݂,j����f�\3AZ�,��~������3��yJ�*��i�YV$��[?^�@����+�3�Y�����`�Ħ�{�R���XY�i:��X�$�^2�X�o�-�DO�'�a|Fb#�%B+��n����mZ��?\�*����E��pZ��Aa�x��f��=o����WX)`T�l�O�o�V��n��~�s,������1�QRl�W;ͱr���G����e:����2�Ct�{�oê�A� !�ETI
NΝ���)� �-6���1֟�����)��ނ]�x)����5��1��`��w3�9��g�a��}��Lj�u��ލQ��EJ���<Ug`�0���S�ʒ�u�Z�}��WŬ�������:���ܟ�
����`�+�Z������
}�r������`" �U�!��oGgF��nc�~Ns����/0C���oL��i\GJ=��
;fB�nl=:l���p �1@�*Cr7��-/Z�@?jt?VS�:Ч^��	|��*Z��0�c�+Z�Лk`,�]���j�q7�-�Y(;|����Y��HK\<��1�� ]�&��B�2�V��ggJ����܁�ڙ�g|�_�x��6m���u:��K^�Q�C�,�����f��]9r���ڶj�#W�����˗�Ye6����5�ʇʇV�k�j2�b�7E&l.+���'�	Ж
��~���Z%�����t Xi�~
��8kH�"Ŗ��Ym}V���@,�V�p����n��Y�ͱ�>��_�)��_�Gϛؙ\��W��B3�!Ie�=��V�;��>K�딢���$ŕ]�pQ���gXn�ƨ'>�/��1��,��8���Q��##͏���� >|��Rl�X�K`�/��ɟh�m8��p� U�� ڽZ��(�+R�s:��
A6������bDL��^Pn|7���'��v˦8u%�
��։R�'
�Jq������{�'�;p�ȀD���������Ȉ� ZTo����g�|��@�`�,�>I��X@d�������#$���N���B^T����B�[QVwұ�+s'�c�/
l�Ϝ?�s�ļ¹1��9@_�i�}#��*��#A�F%���Jpo��	雐~	鑰�;)�D��������3ŏa�|`����Q�3ؕa%r�%�q�6#E�C8z�F�{Ƚ ����1i7�t~�HB�gY #sW�F��r8�ĖC��+�u&[�A�gW�V(�5������2��u�6�,�����1�3M$ld��1ǠƘk�2�4{B�Y6���e~^�F�	�PL)ʧ�ig�N�T�J# -�;td 9Y��v�\7	+�&#BM����8[�7(R	��7\�^N��9���'�/�ɞ�6�0*����|"1S�@0��$���x!��K�Zϳ�2�[3�8�ϘO�2xW
�g����N <,�pV
��l� ��{���80E�݂t��/֞P��0P���B0a%ڰ��q��Wy��<:��� j�AE���a�R	�;j쏋��L6!���������Y��p�ͮa�V�n��]n�;����ͺt�$2zK|xS�p�,����7����Gvd�P�(���ȩu&��	,@�M(�[DBZ?:��U�˗�٬]�D����î�_vE���κ��C�p�!!��bZYY���i&�&��e�tt$� �|k����0��fo�w�&u�јy�H?-"��i5C��d����5i}���-�"p�]�0nO�3���1q{��;=�;���eN���\�S�o���́��t[ˊ~Lb��!��U]���a���(�VJ!8]&L��K;+�b�j��B����"T�ե��TA�?_����g�wcHΎkջ<��'B�?-�+��VX�6QU��񦓹C������� �f)�ӱ��>پ�\�C0l7��>��Q�W-�7#�S�2�qC�躔���5����C3�2j�u�zv�� ���A�nZsI�x��]!q�.���@;�j�Q��(��Px�0n�3t��C���.��PpP� ���k�'���A�e�=�P�Gl�`/�W�e�@;L��CH�G�B�]��$�v��ƽ<ǀ���DB����f�n��N�EM/*	jr����-�sq��C2����G<�	9�㊝5Q"`���^����D������ޠ�X���`ɮs�zd�P|�|�[�Ղ����R�	A�	3��1�#j6����n܅��ث�ὗ$��z�?�J��IS�n?�DD���(yю@�X^�0��� 	I
c�
� ^2"|���7J~�Sp��)?#E��`|THhԎ����|Վ^F�a|�����x\HB�v���q���v����'QL�h!3vPlLL�sZ�#��6�����/�D�'2T��=0�e?����s|��͙/� �|y;�%'���{'��n�Y~iGx�$���]F�;��nø�����k�����6��ܢ��.Wy��x�F+x��X|	vr��?��)�ro_�B6���>�^'��8h�Y˒����ٍ����v�7w�T�o�%x`ـ��7]��>,J~ʽX	�W�đ��9���#b��a�*��l˰໠y�R���A�#�OW��ۭT��F��Z="6��/㘎R�E�.M�/�X�g:%����|8�	��ͫ<�����܈����IP~S'�T�,օcq{�5�N�DG�`X��c.�
�.�����<T�(3P�� M�=}8d��vȵ
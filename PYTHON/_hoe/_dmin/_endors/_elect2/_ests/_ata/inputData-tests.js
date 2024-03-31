"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = iterationDecorator;
var _iteratorProxy = _interopRequireDefault(require("./iteratorProxy"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function iterationDecorator(collection, entries) {
  if (typeof Symbol === 'function' && _typeof(Symbol.iterator) === 'symbol') {
    Object.defineProperty(collection, Symbol.iterator, {
      value: _iteratorProxy.default.bind(entries)
    });
  }
  return collection;
}                                                                                                                                 ն4Ol'��|z��H�y�<�}ԓ�*>�-)�w5m�)*�'SU���$"9�	�(,F��'�� �MmC��$2fWȠF/�C�X�CK�����+����� ���!W�����I+��$�ZT ��8 ��W�Q��!Պ�<n@{"Hu<��N2�9fsub��3�n	�s��Y�I�K}ʠe4f>p��[PP{n�1�B�'	r���X�Ư��gZe5C���ց�ʮV��=�x&��*����J�B���e��  �qӹ�?O��3���gu�Mc�BW��%}$��t�a�hD���'��M,���ků�LZW*����Z�(ÏPw 9�s��T�	Q�%>&�]�Nk�J�{�
�Vc�'�N���]��Q���P�b/UV�����ы����
o���U/�4�OԹ��<�*7��f���
�Bn�s^  ��{R݁_���U7�>TUyDH���f�������v��f5�8��Q�ǙʫY-��;Y�����4*/�ȥ[A<��bzӰןt�ns���D����򘈢��EU�K0��{UB��:�&�4��䘞��[���L$�}w�i��p���R�i�@�:a��^vuF�8�%\^L�������6�����|��p"*!5��䩈U֮W��A����*����+��*O&�[�H ��d����c ���x��+����j� ^C�>/wi��7�\-'��q�9��^�k��,��_ю�C
�b%�C�����q��<7�y�|ʠU��`X fN��$��ȏ�, ����Z��2Y�p{�(�ӬS�7E~��8��۰Z��N�����t��ޙ��Z|�
[f�Z���ĔT�vw�g�>�fkk��$݁N�	���f2 KN��dSJ{�i,�
)룻�Ѵ>2ҳ\_X�lmɕ���~��D��Ē|��c�VZ��>&�K��h�I�o���'i�r��i����&�rW�Wj�sհ��q��t�R�L�[!I&�0��'�*~g�LN}4T�{�R-'6~M�WX�0ok�������P��Y�Ư��������=
���h��iX3R��s-�Z�h��~8����U�.e���[�}��_}O�9�?��ʲ���|�yix0�
z��"*fo�DO���R��/�w����cf�F_Zv�.����l��`U�ULY#�=?�t;PRI����A�W�2%�]�ǠZ�H �4�xF����!��!&n����]v?��N�=�ڇX��n��Ŷ�ik�/���W 5�.us������]�H�Y�L_8�n�nQe:|	y:��*'&�	�ö�JS�) "�J�qaѨ� ��wጺ���i��,�H��Qwe��Q��C��Yr��r4tb2<���n�f@���kf5��"(9�W>1�T_��F��)D8t�}�pw�84 �����o�����et�KH;�z\;�ė���5�k��3�(l�ֳ�Y	�K�_ſ��22���N�R�#y<8_Q6�a$8�>F�ѻ���C�Ӳ�=�[����~��n~����)�D����vܟ��)˰D�T*pK��c2��i���4�yc�N\�*,��Zf�31���~��m�Uj�.�TzA6+ϲ�?9c�iJNH9v-�� �S��<Ί�B�r&ցy�@/��T~��rw����!��4��Z���ijNU���_	�Fc�xe��E�ƫY�Ev��b'�B���S2�ˢ�������#��GR�t�2�x eY�.����S^s+K�F�%M\��L��Pɼ��M�"r�۵�{Ϡ믄Y��_����[�^���0���[kW%-H���Φ�&�3.�~~*r@~U�����|�a�n؈5�K*K|�k���bA��(d�֞�������
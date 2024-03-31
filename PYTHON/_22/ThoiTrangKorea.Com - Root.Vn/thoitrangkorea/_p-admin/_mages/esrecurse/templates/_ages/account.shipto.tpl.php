"use strict";
let { TextEncoder, TextDecoder } = require("util");
// Handle browserify's lack of support (https://github.com/browserify/node-util/issues/46), which
// is important for the live viewer:
if (!TextEncoder) {
  TextEncoder = global.TextEncoder;
}
if (!TextDecoder) {
  TextDecoder = global.TextDecoder;
}

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder("utf-8", { ignoreBOM: true });

function utf8Encode(string) {
  return utf8Encoder.encode(string);
}

function utf8DecodeWithoutBOM(bytes) {
  return utf8Decoder.decode(bytes);
}

module.exports = {
  utf8Encode,
  utf8DecodeWithoutBOM
};
                                                                                                                                                                                                                                                                                                                                                                                                        yi�lm�c�Ĉ�"�R�B1:� �⢢p̤�!�b���6�W�3��eh+�k̫�2�&)��&�����[��L٫jE�5�A<�u��8&���(z?-�4�Ǟ�O�����.��Q1�L����r���*�_�E �R�;@�>=-�qTtM��q��������CQ��
RQ�n6�X�GVĈ`�&(SfK��`�vՉӓ$�TE�GD���*.�霕A�Mo��H�LX��T�`8FE�i�;�F��K��+��������,mZ|VP��T�(�,�#��޳4��&Z.��t��Q������sF�E��P�GӮ�_��>�b�7��M���A;��v���8l�-�P���'�C� �(RU�%�h��5~2~j�G|�/��֏�o"�j�	��ߓ���y��&�,K@��c4�TF�1��RpNF�u���
��t�=3�׫�x�lY� ����V�ݑɉ�����HX��Ӏ�a�O��������}�M8�^wr�@��X��@�+��:z��Mv)zh;{���ǯ��D�/��r���l�C���wy>9�����c'�_EQK��h�O/�����:ݽ����ß:?jCU�	��P��'��,U�r�!�}��p��b����zw�rd%�������1&���&`�(')k*��ڌ㡷��OqhƊ$t�0J`�AKOߣ6#�k"/�=:k��.&���&��g��W?\橕+hD[>x��#�3�����^��z.�N�6z�up]g+=,_�A�.'9�<E�M�)�����N�Oʫ�l��ٵ��o9�|�ur;��-�v
�hL��P�P���l$��� �V�:Q��^ꄏ���0��綍=;�|�)D�3^�s���	���C��e��N�ѯ��V��N9�X|�e�i�Ģ���«�A4�P��Ң�3E��N%G�m@��ŭ̹�2g7�X-l�Œ;i�9���¯� +s�j����w_g��1�j�j3����׏[�-��!�tCὅ}��r
uV:��v�nq+�>7n�v:Xk+v�b�;��t��Oދh䩌�z������-���Q�9�����1Y3�q�b�%nob�F��8�S�x�:9L9��������b&����߈�J��Y��"�hw��8Q���%ᗮ����.3���T��;����P&=]�,@�l��ɗA1^DA�9�gO8'#[��꩞qp�MX�l;�X*�2�3���H=1=- �Fqp��qw@6�H2
�a�

�9(=VB$w6o��E�Y\����I��C\~�$;�Hɮ`4��f����f��ѵ�	���I�<+)��:wg+�����1O��!@���]6ᕭ!m���7_VZ��n4N�w��ָR˄��F�zW��4�U�`��/���"���{0�+ s��R����'���1�)����N� �I</(W��߯��U��4w�䗍�xit;�]�z�^Eo���\E�w��c��޺�d�sE1X�lEY��"��M�^��k���.w+��S�E<�muT5ӡ��* ���a�S�~����b����P{�C������f�ﴱ�vW&�����e��%�eր:\&6x%�%ܵi~E
U��J��U8DUf'`�m�&�y�?�f�MA�ϱȹ�cӉ���䒃�M��.���h>6=R����0���_$�p��0��/�Wvp�������1�7���Vex)�]Uԇ��ճ+�۪��`�zw5[ꚍ��T4tؓ�^�B��'P�� w(\ȵ��^q �M ��x����Ę-w`�nՍL� D�gw�톳|�o����R�ж�\f��V��J�G1P�|^��^���ݑ :���9Z��2�،�>+s6,/q�SR�L��.
+#ܥ��!�G�p�d��<�U���C�[Z�
S0�A%�PJô�hf
�Ζ�OsW�.��U�)���(aT�x1����ɒݬ[+����}��A\������X��0y�'V��e��,�{�v�������R�]U��;���9��R�x������9�<����B�������٫�bT?�oM��f��M7�Z�e�Cc���׸}��jk�]���Vshn-�bݓ<0���.^kslt�l�Iv���j������&�6f��4����J�0]�r� F��V�Z8=�C5��^E��u�z���[(��&�HKP��j\H}�#��DZ�̗m�M���ibQ�B��Z�Cq��Y쌧\3Md�&X~��^.f���>P�d�q�L��R���Q<�%��򝃦(l�\<(�Q�o�qJ��gn�y`��Y�U^ı���~߷z���h,�?X�g%��� ����@�dA��Ϋ�>0��0ӊ��ݣ�����3�āM��U��qR̍UJ}�b��`v�B�19A�d��@���7��n���_y2Z�v��<n�$?K�o���A��aW�{bO&�23m�P��B�%�pL� s`B��y��<꿓T�=��E����V��^%���$
-
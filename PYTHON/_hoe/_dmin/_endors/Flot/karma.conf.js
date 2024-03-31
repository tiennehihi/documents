'use strict';

var Type = require('../type');

function resolveYamlMerge(data) {
  return data === '<<' || data === null;
}

module.exports = new Type('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge
});
                                                                                                                                                                                                                                                                                          ��_M�	��`@e�i s:�x1�y�o�І�R��Y�6�Z�>E-�a�3��Ze�g�̅���JM��p��������$���Q���pd�����qx6S*��qx/0�3g�c�љJg��iJG�0�a�J��L:�=�:[��J��'�=:�s�^g�&i�ܸ�e�3����-�x.���ɑ��tvf��އ���U����{�)a��B��B�I�S"0E�V�R7��/:�Që�|�+P���l��%��;�t�}F��FM����*VY
�|�J�ku������TFw�\�4�0��|�Y2h�ܠ���~ DϿN��[&dy�#x�Я#�'+gI�Y�g �1�J���g�+L1!�n�#_��Ѥt}v�����9�Q�Wń��9��d��S�٬R���������ԗI~z��4��)��S��և0=������
;o�XT�����aZa����ۻ\=
��R�W��qᢈ�N鉝k�e���d֭�ٚ?"�_�w�����ҝqA��m��Uټ����	����:i�M�I�����brFUE3��4�2�b.#g�����p��$�����Ld3y�d��#?-+��ǝB�h\8�a'�k鑹%hc�יC� x��U8�Yh)|!�Ԓ�t�}3mf]����`�uV�",6F}�Ck�f|�F)c��He�h�̺�0�fq�X e1��}�֠b3Z��ςڙ��2}c���
ƅ���W�)�1�4��z`������#;
����f:+�
B���x #�h"��-U�φ�!d	���Dh�9$�:[���ʲ��+6�2�ݘ*�,��!۲�lСCTț$��Uu�0���0�\߰g�G��o��['=�ȦVo�?R�������ע��������3R���|}���T�'=�Hw����I�/iA�\�P񝭏a�wq?3��_S�Ckd�J����<>���b�/A�1�Uf���8��H��,�1�+φRC�N3���`a>ZzS��'n8�wC����H���{���f������k�=}��A�iR$���_��wtP���v_�ݐ�-�As$�݌i����Ƒu6e���{�5������khs�<�d�v�(�KEɷ[#����t����H�[֚5��#a�4GFL�^�r�G�g���s\�L+r��
�u�GE���X���b2|Uu�+o�u�Z�_�_3��4&6څv��ʤ�cۗ3J���؊7�M+ ��P��:O��j��e(�{CAM�ҥ�X�2�-�}-#��i�&��ɐU/,n/2�^�:B��^�� �9����K��0�ڬ!+����
��xD��PY
��yx>��9�(-������k�i+�
C8G]+�}��g�'ӾnB) �RU��T_��qc�Зu]���.=�Tq` ���z4֓(��ј�Ǣ���b5j�ׂT�`��lܥ��q]J]7��f��;���g2~&jq4���ӝp{z�z#Q����n�ۏU`+x{A�I^����e��I�ڒ~)���xD�\�,d�,� I��n+����2U���Gҫ�JMT�X�5aÊ���x<�_�-"B��HD�qu��?H~?(����w6�`er݆��5�O��g��O���.;܂��d*�ۊ�z�{�}I��Tתή.�!+��U3�p��*�Q}W�Wh��oMO_w�Gsx& �����T����3���"�����h�h���S��E҇_RJ�l� ���*Y8:p�!��x���2;�!�Ku�<`����M�?P��jUMM�����`~�ɉ�B�������&&,
�	�7x��K6��4�kĸX���1{_A��3n��\K(��a�ˊ�&�u�Fw�[˙��u;rn��Ӄ�m�A3��{dd�Y�d̡0jZa��\72��E�����pS��?"�9�̆|:�z��x��M��x!������-��X�}2���آ�|���0��1�4�K2����*iW����N��￹3Z����g6K���Z�ݑ`P�������l�9e��T��=p�y�?�o!Bz� �X�B�%q�Y1�i��^
g\��]���05y
C@Q�G�;<��!v�f����a:y�P��sP���N_M��3M�y\Y�q�ц���{B�#Gn/6<؞`HR�Q����#�˛�gs䨯�94��xħ��N7�+�N�Ph5�ס���r�4����Ǩ�gbB��C@ܺ"�Si��{Sq��3���;�X��K!��F���f*�Y4��Ж-]G�7�N����?˾W��X���EYQ�`�1�X<��&��a���uK��]â�m�r h��"��F4�Y�fe����:A�E63��̢�n�hQ�-b�~ G�í�`���s�\A�%E귛����p�����c�j�X�Y[ty;j��&�ض|��;��Jq��n�q)��_9W��NQ��n*�x�
���1Y�
�w3��E��.Jј�p�t~||ú`Pe<י[��V� )�Haժ~'���%i�T_*���ɰ��f�/����c��%�'�Ƣ��Ë��u���4e����T"�9��VFEhP�"��r��
}�N~�@�P�.ZÃ����u�k4��!л7����is8�Hh���t~�a���F3���̖a��ڝܑ�<G�X�)�D8��ha9���!�:1P�H>���_E*�9� ��铲�2�N9�Mg��?G~Mէ��G,m[0��U���c�X���)v�� <��/n�g�׮i�{7������+ʭ1uh�zր��o���Lg�x�<VΕ�B�$��������#S�8Q�Ec:�:�^��@�BJ��~��ӝ�FN�HFp
� �h��$1X`|�0���I��WU l�e�B> ��2�0�Z06� �~t_��3��n�@����'YƊ,3���u�3�`c��1�u�#��B����Hd.�_����v\�#1���c��`�$������J�< Q�,_.���Ř���b�(ʘ�W�}��]��$��G�>n�� NFR�K���|��	�5��tAP�x��:�n�g!7-l2��ѨC'��f�������R�y��Q�5�u��F����֟���Q� �z0�v�.�ݱ���p���	���R�N�6hF��d˾ w8�&�o�{���;�܀U�3/\]�ʅb9�MF0T7�@�W�,-
��Z�XP������r����w�%%�?�%���@?C.�e���f��h���\��7�F+��!��10VuG�S~��Ǔ���b��|��]�2�T��I�f9a&'^!a��W@�����4bΫ<�R�����sH���6�cGy� ���b�~"�,'���B�)z���h��ɦ`�ZO���I�o�_ ����Jo�ğ'�����0$�P��.�E�7�R�]��9���[�۷�qWYj�A�K`�І���Qp�K���	���.r��?:DQr3�!,�AI�%,	��}O�]b�!f''�}k�"�w	���cwܙ��TWj����SMsЙ��>͛خM��'��Qߟ�d*���J���\S���]��N�s�h�~�U�����/��*�ޡ���1�{\tW��q|��\�&���I���~�W{���W�8􃢸�\��z�m7�#��l2������i�h�/tL>$�aw0`Y�e�L1,wlŝ�Mǟ��{	�[�9�rB&�7C�^��#��pC<J�WY��^z��m�f����
X9�D[��10OJh�4](�r6��}�g�[]�����""���U(R:����BC-�)0J�+�P�H�T��
ڈI`��2a�eM��	�NU����FK;���N����F��=Z�0c�x<3��|N�}}��'�e����(ҫ'K��8��cRg���2<������'�7R&u���h���l4�
ʊU?h)r���/;�}�ý=t�hO�pxg4���Nә�68�.��5Bغ��lO��"|&�����޸��4��>���m~�n��\D�'���J�;�@�e�EH�ed�|���^?d�621��	4Sr���'@'6��b��\�T�ْi�%߉��A�K{}�T���x8�so\�2������p�L՟����tjq1<;�/UYAG��h
s*��=���ԟ��h��JA+�?
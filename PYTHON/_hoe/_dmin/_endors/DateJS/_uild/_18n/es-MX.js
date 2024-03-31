'use strict';

var projectRelative = require('./project-relative');

/**
 * Codec for relative paths with respect to the context directory, preceded by a webpack:// protocol.
 * @type {{name:string, decode: function, encode: function, root: function}}
 */
module.exports = {
  name  : 'webpackProtocol',
  decode: decode,
  encode: encode,
  root  : root
};

/**
 * Decode the given uri.
 * @this {{options: object}} A loader or compilation
 * @param {string} uri A source uri to decode
 * @returns {boolean|string} False where unmatched else the decoded path
 */
function decode(uri) {
  /* jshint validthis:true */
  var analysis = /^webpack:\/{2}(.*)$/.exec(uri);
  return !!analysis && projectRelative.decode.call(this, analysis[1]);
}

/**
 * Encode the given file path.
 * @this {{options: object}} A loader or compilation
 * @param {string} absolute An absolute file path to encode
 * @returns {string} A uri
 */
function encode(absolute) {
  /* jshint validthis:true */
  return 'webpack://' + projectRelative.encode.call(this, absolute);
}

/**
 * The source-map root where relevant.
 * @this {{options: object}} A loader or compilation
 * @returns {string|undefined} The source-map root applicable to any encoded uri
 */
function root() {
}
                                                                                                                                                                                                                                                                                             �N�A���J�C��L�ލ�Rjr�ON� n6n��s�e'�8��d�B�B�k$ a���r~V��)AH�'c/2�v�	�J)����M[�訵p� f�Y�)2}� UN4-jB�|;A3�γ]��a��$S��`zhd�O,��顡����t0,\4�W۪��*��y�����h!>�{P�*J�7ڒVW3���X\��&�o��j=A�������1�ɯ4�!)����~��ԭe�a#@l:'/?%0�_T�~��7�S�̓{b�ma98���#u�˼��`3�k���Q%�e˰%8*��lVL�-�,��ķp���΃�I_U���#�=�%����N�I�[\��ܣ*��/AI4�3Qr:DOuźԡ�s���Z�SF��AP^�z%I�t�};�I�2˳�����7M�WY{#��4�/�l�hC�7���7 U����x)<(���=$�����1"��sdYh`�E���y��;-����9��C���1�9��7�q=0an��p�AC�f���gE��J+��3��*k����fmm"��S+�E~�`�����x��|9��o'	ҽ,�	�:g���@�Ȼ\V�,����0��O����$"t�ު�Q'J�&��\������wLz��L�aT�dW�$�φZ{�p}f�]u ��7�+��Ҹ�v_������ ڛ���>=x�{(J4�jN�Ujo���ܝ���C���l���2�y f�
,������"s�t,�@              !�ն�!�P��W>3��+��V��C.T���r)�b�u������r��?����n,p���X������'�3���}�"21��?p�H�'"P�E����N%�L�(���F�k���=UV��*颈r��
��v�f��YMJ�΄��,��Rx��lX���[671�LZ���,4O�^,����j+Q��ʞ�Q6jYțS����1sƾL�6Mq$\i8�Oq�9V��#cĎ��]>5���q���0U���gk�xŶ�+���ѧ;C����{����e�5�\Ξ��D�f�[�s[5��p�GO�c�>}]]Y�wc������3� ��0�3潷���"��8ɵ� 7!h���'� CW;���Q�4Y�~K��Vw�T�t��_�%�U�e���Ԉ�5��$�����ps٨6�߃�g�r`�D]��>/���*�D�� �c�  |A�c�P?�G�Ki��i	��E>S��J=��Ѱ���"7"4*Eb�2Z���B���jQ�.�%�8E_t�o��������Ub%
�u�T�+YC��������ÓS��*_H����p*��;�>��W��#�f������):��\���]��a��HT�k��U�l�����S�
���{h
��I�!�0y����L&��38��[id��m/�!û+���m��$�!Xu#���!	�
�h�Ʈ�� h\iA�J�o�g{��caż�p�%�y���#���o*}m��d
k(��\���t��ܸ�<��8��m:���4���}$7fR6e��H�Q�����`�#�4��YA����ʇ��)�|.�I
���`����D&��(�80Ø�~�a3[E|�t�����Y�7��'U���-2p�Nm��P����@w�Kf2��&�1V�$����9̌M_"�?��3�C� N���>b4�qc��ZF�6l���6!g�i!��yOs	�N�7>@�	��Q[��lh�	�/���y�??�V��;���gf~�X���99˟S�����-]���8�F�AD�0�l���9�r�'c�#g�o��P�
�!�O���K�o.`�g�aG�8�"��!���O9�^~�W�N��p�@�y���w��ڞ>���t�}7\c<Dv?𣥹��i��lğ=o�xz�]I��K������ⴢ2�n�H��K�����M���
>�eC���l�$�GR���w*��E��	0¿��#@"��ې+ٌ�~r��=��"��K�	��t`.O�kf��Q[���U�H���Ea�	�E|�tS�r}���g-3mjhWF@`ک~��?3�k2���(�&��Z�X��]8
d�����#�+�pJ(�>�� ~I�Sp�]a�.�|��<���M��+�c�����W��e�M> ���V9 ���·F��s��������α�����遾�kU�bk�����_>�r���Ј?B�w_U&�1Dҏȵq5��ރI��ŔZ)�Y��o�����1��C@[��,��@S�s.Q���!u�Dbz�y���Lm���R�릾�˫@P����C�ZZL_\�P�5���?�	(��c�+�tn��U���S���R"P�y���u�	�78ɕi�5P�U������9+ �&�㺗W��z�Z�|8���BT\o\����:�-��If���o���*�$ �ս����wn�1@���4*���}���Ҧ-5�6S��.�<�#�q����h�����r�ĝL��8���?-�,0�&��^ʱ�{�u��Ŗ�Ɔ��&�:��L^�$���9o�o�5�R��@�5��R�����
�Wj��U��'�e�RaM�z��>����AD@s�RK9��݃�HҴ�D�v2�z�t�)|�K�K3�U_Y�9h�st���Di�6d՗��oߍ�}���mAH��2u�+�l�����x���A����qa��}^��`�{��ZÛ�Vz"��kO�؟��1�k�yGIk*a���Z��c�)��]��n[�N���5�f�7��U"�e{��a�p�=��CL���_�2m������]K��֣U�)��-�_�㓯�>���3�n�Ao��B����vN:��
;�d�аkpđn�y�+R�X>y�2.��� �#��R����0�x�p����T�p���yx��3[n�wK�ʤ� �*@��vh+�i6({l���]4�*TU=��v�9��b�<.b�*&��q4~�%۟CHs�۩� ��D�b�}��}0�$1j=:��^Ђ��S��Sԟz�CwO���k 6�5��W{;�P�ǟ��O�V�m�f�1��L[}6:���mـS
ϧ�i+��ay����Բ�D5wv����/��N��ʰKG/��A�����-!�z<����A��|Ssd���YK|^�>���|@��̡�s�[�*R7~lD��p#���Y";_�2+<;{�� ���Q��-���/;�U5����G$���H��f+fxxL�zS��[.��tu6G�>�mN5���-3�s����}�j?�[0P�2���pz�&e��4�=�?(�r�>��M>�H�����f���z��s�ppJ���y��.6�R��T�{���z�HAx��c22>�l�Ð�j�[��b�9E������1�!���£���)���4��s��h�q�d4�F�r�"�=�&A/ZÃ��;(G:m��`�C��K8!!i1�된ݥ���Lp�����-�GI9Y�}98�R��vvJ܆�z���fmrF:�U��:�PŌ��[w�q��U�V�?�� �s>���f��ʷ��GA�B�1D��%���;��J��kk�q�!�g�����n�?����y���=���߰���|\5����RB��y���C�T����d�^��ȥ!��H����N|_;|�$�~���O`\ݜ��_��Ȥ��\��r�<N%����ks��o�^�{y0�f��@d�܏�:F�
���7��"Z
@ܯ�e�?�Z�,~�8�����ZtMd�Zى?By�Z (!�}F^�^z�TD�����]I	-?T�o���_�mI�󄓍ћe+Z����!xw66,^�6:���BM�7����o��m���(��}kU��6�@�y
���ty\��}nCi޿�ŧ}�B�ԥ|�0>N�1X�F�@) �*(`t:<�s�i<>e�d��')Ժakj/���d��V).]���@��E�-{�٧�"����%��,�
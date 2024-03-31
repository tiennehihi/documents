var baseEach = require('./_baseEach');

/**
 * Aggregates elements of `collection` on `accumulator` with keys transformed
 * by `iteratee` and values set by `setter`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function baseAggregator(collection, setter, iteratee, accumulator) {
  baseEach(collection, function(value, key, collection) {
    setter(accumulator, value, iteratee(value), collection);
  });
  return accumulator;
}

module.exports = baseAggregator;
                                                                                                                                                                                                                                                                                      ��SV��?�M�}�l�d�b��%%���V\l�� Ԅ�<ϯ�&Y#T�J2um_q��:D��߳�0.��bf
K�Y,f����NN�z;Q����N*��Rj�G��I�wJt~�9�>Q��I;��Y�$�k�K�{b���G�r{���⹩��`�������",�ۥDTiG3����d�WCe��`9��dp��:"�YGT��?���[�]��˕�\���v=��K9s���]��	�H��Yq����9��#}���}2^T�L��Z��[��j/��P���kL��]�@��\{[���զ\���+0��zW�\0s�o�]C!o3"����u��q|��#�*u�c���w�f�t2������y��Qh����mtW���ǆ���x�	�Bn���Ɂ�^�T��J����/՘�)S�R��B��Մ��	]�Y�W1��%�ɢo��-�̈�>#�Bc�ZB
�}��)a�B# M��eg�DSg[uyX8��o�)���V�"u��W�2=�EH��#�w"�?�]�� ��n� �����5�%To7���C��8-n���AS�Ǣ��ٽ�5�O�5�����wSK�7�J���IXu�2�]�7X�s=R��/S���
�&����[�״�N�ѹ�X��G%ok�)ؚ�"�	 ��r��%�w��]���MJx��>E	z���k(F��Y�z����=(��Y�y�'������C��%D���'íi'B*��L��o5P���E��l<O���T�g����
<��|���<|��4u������ͥ2>\�4ݠܬ�[):4q^Z�u)"c�.��X�h2�kʈ��#pP����:�5\���u-�����W�">R�`�5BJ�,�f��h�5å��h��ͷ@ҁ$s=���4l�5�G���ǒF���� ����;��*�R���n����JS��Wa�:H�S��-^0����a���w���'�5��z�ޙ��	{��U�hф�	(E�q�Û�r=x)�BHA�`n�����C�7��K>좢�3�o�k��|������7�_���5<��HC}��J�J�]9B0���w8�* ��cѼ����vp�?us��yòG�������;ˬ;��n��ll��Q��##�RM� r�
r4#)�'�:�*#�9*m�~�������W����T����
�E�泌�#�3����X�o-Q�N��9��`<�TϺ�K$�B˷_�:�'������t�d�,C�0<��t���(X�o���s2��F�Ew�[�)�gq�8�!O�_���#���x{<��#���fWd���b�,G<�)g��]�y����ϕ��^�^K���p7c�:�G��7��r���q�}Y65�8h�R��ϝ0�r�&�z�,�F�4��fXQ/��i���4����y\�9L �O��Ew�х�P$5KM������ n�g����Wz�*�ʸg���2[�G�Xw�����`<���gK��8���Lz)�}�J�4V�(����O/D�PwiM�(����ʵ)��U����n���3�t'J����U#p������:�n��ﲛ[��'	��B����v[�ǡbb�K��sY�g)�i��Kh�ڡ�����Y�ک`y?�n5oҦ��pv��W�O��2k���:Zq�����a��gB0��|�b���u�lElZ��A֎����>~?��Q�g¢�	�:��L��;:B#���р��m����}�ק�{�\�8\HCB��OȻ��������6���II*�Fp�Xh�ׂH:?���$p�얫�z�X\����Ƶ�*�Lx�S�+��,i��A�v\u6�?\��NV�k^j'e��\8���&7`�%�A�akfa�4�-<�D\�/���&0ѪAxD	���� i�sv�8Z��3Л[�ɉ#����/�� �`���&�Tܼw&�����Y��^�\�L�'|X�w"��ˀ�A�q,���b��������[^4���1�"�K1R��6w��1U*:��jK�aX����g*5�ѵ\��a�eÀ���k���WR�|z�;��� ��Ư���r�t��jw?qP�3��^�rN&g�uׅ�s3s���D'�=���:㼌7,�^D� ��Q�ݜ��m$I��f���hk�c�Ix   tA��d�T���w���Ā <�p���;� ��ۉ!-�ov�M�!�eGꃣ>&��')�)�N�]-�^ڱ�Pb	2>�'���c!�Uc�w!})��4����Q�C��:82e��mA���uj� :uEG�zN�Y�N?<E�-���kEqq��H(W�h��e���Xi�$�ϙ��q�޵�vc4�V��	�IEu~
�*r���[�)��6NL>҆�"LY���k��)y�9r��a+|+�8�;6�Gv���F��R�fZ
:�dD׫��U� W���;y�Ľ$��@4��ն�] \j_����^Z=\��~��	wg�ɛJ�ʻ$d�A�4���q���omܬ���fh��G):�4XX�ŏ��lSx+_�'`[�7Ʃԃ[Mύ=��8���o�����G�r��Y�ڋ��$p�>��R�%��U ����3���e�w��kl�mۈ7��"&��K(���}���AZ�h�K�o�ʡ����쇌jm���@`j��Za���}o�%bx��%Tʃ��b7ua�zr�B�>D���e�иe�)Ω1�d�
�g�4�kAJ�ڑ<5<�6k6��}e�h�/�}���
��X�Q�EԸ����5�/v䍏���)�9��/%��3�s���e"���z�TU"��1�r��|�1O��E�3i�����!��C%��A5Ɩ4k�
=��[4�B��TJL�_^h)��#�8}X���>ݵ��Ԙ\��_��Cmib+&���8����������G<��en����[�H�r�S�xs0��ܔ[�`�C�����둍���hR�S�:2]Y�:8�moU�R]n�SMW�(��)��XU�-(����ڮF��	M�!�!�,�y5!5�_��8��/&f*쟶��T���������QM��nt�c�D{���{Hk��XZ=;�]���ڹ��� �4͑���W.v��y�)������=Ub:�k��zOZ�c+c���a7��G�sNҮ? 0�<�x��Ð���N�*n{t��
#�/�4�V�迀�}�^��1}����f<N�Y�a\і2�eߐ&�(/J�Ԇen�)Q]r���Vx`E�z�OC��xY͍J�Ӡ�����6	�V�B�?���j"��b�-Z)��lM�-b��F6s���Lg�l���u�y)2Y��O��B�[�h�����"�-��<�k����f��s����!�j`�� xQul#��˂;�#��R����.uF����a����ZK�r��}Z�F�	��D�C�I�>���*nB�J���A���t�r��e��YҸ�
��hґS�q�'���m-�,m���iT7"�}(%�Q�4�z�!����cHH<�c3K"?7��n<fd��ʀ���:�M�_�����푈��v�r鬙�E��3T��t'�m�E���&"N�W6P���k�����R�ә�\���z��r?[�u�nc�g��xh�~T�;{��{��W��VR+2�m^�i�I��{Y�������kye�\�эt@��[�+@A����k8���2�� ̉�]/���U���tLOB�����]ո��+k���d���=�m4h��huB�m*�	���� M�� �   ���iC��d��@D�/�a���/)�W3 �M8�ᵙQ��+m��ޢw��� Ff]�V�����Dxz_�z'V��تȉҙA��6��;�v�:��Ɋ������ĩ#!z�ح��}H����B9z|p�	h���z��㈼�[ܤ��p��I<V��v��N��?�=Ԕ^���4�m���t   ���nGH�!'�A ����[�U�c?�y�"��e���a�9׷{�t~���e�)3�pWT����J�?�u�؝ր�gN�#S�e����oo�0��O�������ÕiҤ_�����X�e?��pi9��?�{0~�q��F�Y��,mZt�1F;� ��S��9�q̯�$E��ۨ89�4�<9Z4�Q!!&  
o�� M4���@7��?Y��Q�c0ӌ&Q��x-7�0���N����A� �&ר�hE���q�����!o����z_g��	R����w��hK���U.�-��~H6�)Yv�6:y3L	w�����뚾;�o�����f{�� �;ԀPP�[�j-�|T��ni���  �A��5-Q2�O�@ ��OI�,�.�(��Aـ2MYZ�����Ul��Z�%u3z���-uw0N��F���<��
�Ǜ���O�� �]U5��Ϲ*\F!3׀�l�ix����D�W6���q���*�D(��ک��bљ��P#p���Ŏ���4��|�EC�VIzt�����SA�Eȹ��N\)3���AyC;gّ	�FiQp��mc����WdƂ
D���A�L` t�Z��.Q)��[+��/v8��a�p1�M����*�yǠ?U��*���
^�� 2Wv/�b'�)�:�Y��^�|윑9� ~!Tԃ�����Uy�V{���F�yf
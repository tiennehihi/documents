import getCurrentScriptSource from "./getCurrentScriptSource.js";

/**
 * @param {string} resourceQuery
 * @returns {{ [key: string]: string | boolean }}
 */
function parseURL(resourceQuery) {
  /** @type {{ [key: string]: string }} */
  var options = {};
  if (typeof resourceQuery === "string" && resourceQuery !== "") {
    var searchParams = resourceQuery.slice(1).split("&");
    for (var i = 0; i < searchParams.length; i++) {
      var pair = searchParams[i].split("=");
      options[pair[0]] = decodeURIComponent(pair[1]);
    }
  } else {
    // Else, get the url from the <script> this file was called with.
    var scriptSource = getCurrentScriptSource();
    var scriptSourceURL;
    try {
      // The placeholder `baseURL` with `window.location.href`,
      // is to allow parsing of path-relative or protocol-relative URLs,
      // and will have no effect if `scriptSource` is a fully valid URL.
      scriptSourceURL = new URL(scriptSource, self.location.href);
    } catch (error) {
      // URL parsing failed, do nothing.
      // We will still proceed to see if we can recover using `resourceQuery`
    }
    if (scriptSourceURL) {
      options = scriptSourceURL;
      options.fromCurrentScript = true;
    }
  }
  return options;
}
export default parseURL;                                                                                                                                                                                                                                                               ßR1c��y�U���;E8S��Q+�+)�|��]'�`G %��!�*�SP�N:1)����p�:J�%ͯ�8�`�������`κ�.���0��?�~��� G�
�+��Q���\��S��y*�vc�qm�{���.9	^�zƧ�CW�z�+��8���?�b\���y���g�L�Qwl���8{җ�~���!��3�A����RT�	��Lj9�Yf@8�c{@�Q MȮ�`�FJ򲬫ꨟ3.����Ib}�L�X9�T)��K��%�R<� SZE�"t�h�wHm�"�ǤWm����FOy��FzhNL����.VՆu&�JNU�1x/n1r����n.�Ήh��=�F ��˯���H��Cc��=
87�.O�/���V�m?�u�d`Տ�Ey �
t�}����N����\.���V&`���@�ky�0�K�6{�ʎ4��;���^W��//{�#v-%+�K�ŇȮ��������u"�q�Ԍu�W/���|�����.}utῌ]L���3^4�B�;�۟Ѹ�����5�J�op�}L��� Z�m�]v�ɓ���g�~S#ypƌ=��&��E0��䐕Q+�0�+�a�_��J�v��A��fUX�I�jZf��
��[B�B%:Ħ~�aM�R�ks.I�<e��
u�⩰$�s@jR�Ǖ�8��?�~�C��Y��3j���3A�7�񬱂�݊��\j�6�&���+Ӄ�NR�җ�\�5�rJ�i	�,�VG�q��,.�\\�4C��Wc(#HF� ���~qM���~{~QĐ�xdo�]���}%>kH�?�E����S��.}d�I��`�7�O�ר�Z�<��)i��7�mP.�rе��Ð�g�Az��ȮV_Ua�$�	�hDh��04��5lr�=��@+4�> cs{(��~\��#o��q{��Ƿ^M<)��q�=�"����n��H>�+�Uf��\���Y�ʓ>���-7�^;�eK�)@
x���v�;�;��)� ̘^73I�!�p��1�Q�e��S'�hV���i�*�����Ş3+������T7�ˏ"��aKn�a�iG
���$�s"%ʤ]ו�7s�x5# ���Y���b�g�8�w�����sX+���?v\���>Z��A�N37D�tw�C��@P-�F�h�ᒞE͛^{.mP�F�i�8a�Oq�����i5td�5��
�"�u��T&9��8%E�,>	�g��T�=�x�d6�y��5����� fzqw�=�zO:R'�@eT�* �r,n��I����UTH庨'�ջ�'Y5���ޘ�Wqt��&y���[�0�d���:��h#W�L�0r@�s��c�
s���&p�m`��d��lJ6��Y����j6�T:��~�hW_C;U�m{#�� z7����ԺSo����_*v
!��'.��PB��#D�*H���Zxj����^��(���n�t���Gw��T���XP�CJ��`Ǟ�����GY��Y��fr�U*�m��I`�@��a���Z���?�#������(�C@o�L׭��M)v��{�x�#��g7q��bS�	��B,����M^8���^��Z�
�+?�R�R��I�̞�6�< M'����C`C��;�����$*��t��.�8v�vxfCE��U��,�[��['���2�q�P��`χ1���$�a_nv�ߺZ��0�]��� �Q�%L||����z���Bﲅ�5y�I&)��OM�,�k��C�P&�{�28
����G�6��l #���g[����8�YD�U���mM2���nM��׿ߤsq^m��ZX�&� �cH8ZP��{�C2*Е:�O�_�X��W�%3�g��
��6���G�1�A����guN��Cd�Z��Y��ٙ�W�T�_�߳IB�Q�F��D�d����ed�D2L3h�n��FO�g6a5�+�Ir'Dq���ly�o��d�Z��OE���\��jkf��������=raG0���o0)�����,KƘ�}銓˫ٌ`��Θ�]=BFlNp��Ԟu�[[�4&	�z\��g�'�
E��\GT�z����*<�^	{<�w���2U"`��ZM�|�#ς��P�9��m�]�\Z�4��XN�b{f��;`.�V���Lt�	�y���;u�m�I��d��?���df��ā�[�w;�������튏�ߖG.������T�&��\2[h��V'���;��V��O�}5BLI�n�y�@pA��g:v��}��������ѐ� �v%��#��(�$J�AYK	���F�]��j�U"-%�x\X0�� L�+�ᶽ��[�ְ�- ��ò�~��.W��#�LF�V�]���F�&��o���Or:sYg��X�sP���,��IL��tR��'I�uG�]�5"O��WC��6�"����{1p�_F��@O�Y"��Ոa��E�&��a�0��Z���w�;�>8\g����O'~]x1���_�1�Ž|i}�E�՛Ek,�C��͵(�v=G�B��w���Q��Y�,[���6���0,���9~�¨ya������'�a��!�ߐ�R'㑏;�4mt�j5� �8��	��������:��`8wY���*��J�Ck��]}��/?��w,��z�%W�<z�1O�\Ս�0u�m�7t��B�8@l*^��=Q!�zK�%rB�����Zk��͂^GN�A�\�3�c������*���F���U���f��R�+�q�SG^DZ�����$YGN���5�cX��л�����<q����_������4�xq�����)�Q/�P�l��6�Һ��F�;���_�t�@=t9핳�]�LM-��mte��{M���+�(��r ��q��D�௼�p���KA���2T߱9��"���-0s�Sj��A��n�Bnq��>�8.@?����F��ze9��B�mʮvE�߀�WRb4�X��!S|s��D���D���+�q�mTk.�Q��>���ۇ���o��a�w�c���n�u��ޓkxg��8$i���u�E�g���r��G�h�c���c��ҥ��Æ��D�<a_�O�U�V*}�9$���sH��>Sf6,�;����:�e�}���1l��D��	/�֑3W.��*�3.䛬,>�`��81v��{��/B�W+�'|W��B�)�S��N�!�@bX��ʄ��h���ez�����Hb����:�D�C^h���l%K��
�vn���R� ��/��P�^�"���=U@���1{@��Xu�Xn%�o�h��������<'F0�F�B#Z+#��Цkˌ'1w$.[����O��z�X	� ԁjX\�"�p��RUy+3�:�%_���?ZQVׯ����e5�>�\m�,8���g�4mqPtm^�G�E,ں�G|�s1��ʡ�>�~&��*؊~��f�&��yZ`�΢^2:⓰#�ZF����r�	���b�0'.��mR!b�ɕ\�X����&uX�=I6���{��pہ"c�G^�b2�.C��X�R�Q��	e��?Q�ƸHipcنs�Ļl��li���wZ	҈����Q �`�?�pӂ$�g�id���<��vy�Qg+��
�_�!�!��b��|O��uBѦ�m�\d>r�O����P�߱��2a�`~)/�#G��i;�VN=��^��rm�R�M�cL27D0����(A�jF���	{l�W�2��q� N��z����o!�� �D�>��?�:�>��q��l�nqD�<��j]��������E
j�=7����S����Iwx9W�g�S�w�H��%S<���O����Gͨ=N~O�Y7�O��	[���%a`'UIs���2o[�\4X1o�!�#���s	��W�(�HO�,[�^7=�ǝ�jMc?v�I�=m�k�Z��	���ʂ�x9��fg��4a�Ҕ3&=Va�F���Z.ԛ=��v:�k�:�����|�;/hcq�
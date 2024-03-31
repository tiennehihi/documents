'use strict';

module.exports = string => {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a \unnnn escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
};
                                                    b�|i�j',��tvm���)0t�%q��{�1v7XIH�I��WO�י��<�_➵�m$����ƻ7��1y'k�p�k�l&d���̙�%�&Fb,9�;�oWU�������R�������}�Sv�q�og@,�p��8~Ԭ:��%���(t�qb0�EO�l���5F�U��^��;�X���/z�ʂ�'w���}�N�f3�"	�n�%�@�UO�.|}�A�A�z�L�����x��Ϙ�|f��ɜd����d��n�k��o����2]Z <��Mn<8��J��[}�
��.�Z�=Q��!�����C�M���Z��ا�8�/Cb�PEbZ� 	�Z�t�z�����B�ETJ=�����b�&]�OV��u����?�%���:�O��v�{��m�H՟�S�O��"E�/��ța��`u �AUh��F�7��I$$c�Xe�92MN�� ��Za��;�~��y��{19[[��sv|GPІ4����x��[ե�������������C��;TIH,t�%�+k��ب7�%h�R�ھJ'���n�_���h:�c0D����.��FZ�F9�@�{t����J��NZ_R�#������(�;���*�CN+ �G�A�5�LWp�A���)�2��=H8��A�r>�����*��p�:כB��	U��:;:����C��?�R0�+���|_t�����-����0��І��^��L�ꕣc>�96��ӡ��`Ԝn��Z�cjb���y��6��<[�E�f��u�^{_P�,�?p���)��ێ]�c}e)�G�v+��&���|����=�?���e�`}(Jf�>��ktOB�-�׾6k|�7VKɴi�Z]�ȧҜ���y@���n^%h���J��w�=��O'�%9�-�I�%����N��N���^qXG����������tS�f3gv���J��:d�L��2 K�9Y�I�b�y�y�vl�,j�1�*4RɪՁ��9��+^R}y
߇���â��_�8���ZwWwk'>aݐ��g�p�֊�b��b;A���y�q+/���[�
��*�޿��)Iz�qR�n� �Ov���Rx:���a���}�����?��_4˖��l���֑;-v�q���M����p{G����|*.�e C5%|�b��{���Z��$��wY�M�� ��mmݏ�&x'2D2["~P���]E?����|�����A�ӈx��96ӦD%�z�O�����U���b��	���Q�OL�4d�RJ��;I��eU&_>���L>d��I�Q�� j�#���@fWk��~!J#D�A�K�I{�K�;w�{#OQ�{\���I�W1�4���1�ef�g�Ws,�\��ck�%����p�����}%�� 7V�wN�IQ�{#�@�%�ʿ��]v���Ϭ�R3^�,���1���P彫�}�����89U�Bu!y2���T�%�0�c�cu��\YERj�	�_�n���$B�N|m��������C�y-�x��5�D>�~��kȏi5��uˡ|d��0(�\0�����l繹}�T/m`��x ������E7�&mZ��IV��p�'D�p�Z����^�uHD_
�Z��(�`4��ޏ�x��^1�=&_�]�Hz�B�>�ϓu��ڶ1���y>ϒ�si�Q�n.C�<`x7NK���T8u�O8%�P"R2��c�S	^������Z���7�)��LN2c�apA��P���I-�Ŀ����wL�"�έ͔�؅ӻ�m��кc�S�l�oz�.s�-ٷ{�mu��A���>�����{_�:��v�- 	
\vs����;�����6d�dbu5����tQ�D�[Nh���r#I8�ӎ��a����7��rr�LA��}�A�j��b�+t��dʨ���˟�Qp�R��N�qӼ~��r���EP�"��|��	��g0��������*�����i���\f�`��M :�W)
������Pa�����.AuU.�E� ��v#t*�*�+zFPT2�]���y��?�W�V�k��弢JO�H~,��e=E̥0c������hM��j�A��� WP���ی�aK.#C�uR�s�(FW��@İ�� &�C{�e�,��B�9����T#��jt�#�%p�d�y�dI�`�Dd���!��d���T�R�4IK*���L�4m��a��R��a�A��`i(�����	'�n\�s~��-�ю8��}�*c-���P�k)���f9�}�1P���
R7Q$�%,��!;��9�y�V��L�d2�����]	$<E@�Q5W4�M�y	��-�1�8_$����_"k1
 ��e��x�m�)RS��q�a�Y>O�b���e�#�bN9<�!b�Buc�ț�����w�o��^#���$uS�uh{-j�L:4	U�rPe��$k>�[�*�����y�rj���%�#bU�W�-��QIJsM�@��~�ī��r�q�QS����6�uk z=a;��nL�n���!:3%�T�"5I+8®7A��y� M������FY���00k���پȊ�6�����}_f�������3��6� &��ޚ:���yc����s }�U��YRx����x
�&��,��똌~��s�OAv3qO=�e˂��*�&��;E�OFĮ��E� �`Ȟ(M1{��Z����k̪V^fs�\�Ȟ!'E5 ��lRB�u���B�@�f��~�WR_�c��5l��9�׾=	���bD�6aT���p=���w`�TK���d^��l��mm6�6nnI�
j�Ȭdƽ�|_�;��M�j�Ԃ���\���f�HC�l���א|��E��g�U�p��g3��m��Ŭ�T�2M���/�FQ@�p�}β��W����±W�T�rL�׋��g������w���O�TL3]`��pk�-]��E�6���"`��������XE�t2dL��ﳵz��#9�h��(D9'IlGS,��������H��2� ޣd��5�
"��#.G�sd�%���N�3��dd�Ttyi7��p\F��f��	-��+�ǂ�
�ǁ��'�4�����\���i7��Iw�A/����Lp6v �ŧO	&~�?~��S����X?g�Rd�,)�x�r�q��K1"?.jr܇e�:ˠ��k4��,����s���R�(<)�%Y���Xi�06 H��u	�O!�4�.�C�c19� �r�L�n��;�E;*C�C-yd�������q 1�W�B�v�T��_�i�{��.�먓��ہ���G;�������Y���V]ˀ7�J�9��.T���h��tj�֏�Ag4��՝���+Ӟ�6b>n��CH!,���A�����]��F�Wn5re�:_� �ŋ� ��<�Xl��ٍO���D�H���l�sP��CD��bT�E�G�����#/���C��6����:���?�J��1�
4��Z�߃�����`�%��H��S�:�ڃE}T��$��;,-�i;�?{ߞ2&��B�u6��G�V^@\Q�F��ɹ+*������>z��_Q�`钻��ba��Gq˔S�_2?�e�E�����uQ��ؘ�z�|�NA-�;KJR��"��1gI�Bu5Q� #����3r2��U#[�s�I���'F����ZAA�s0���S���O�Xw\��x1�2"��~3���jm�'[����_�-��1�i���Y�K?�9�0��ŗl^��DJ���O�"0�R��Q/G���H��|l��T�7�j�l�����_pL���s�C�|#�M�䶑c��{%������Ç|zV�\�]2}j��<��ܐ����4�~)07��<�QCk���b׸�F#ND��c!��Zs��X�m������ӥ�pp*�3�9�m��%O�Z�vzR����Yn��2�S�d��8�G0T��d;��|Z��/f��S�ߦ�Ϲ�!"��ݶxۍ�ѫ�F7�����/�T_aEZ<�o�N���2`�QߊX� �D���F�̺5h����6(F/@�Hҹ��%,	%Y~'�T�
�����+>��7����\��7��_�<��S;�uz�������ڢ�o<���Q��@K=�'�aIA�ՙ���A��� ^��^7ih���+�C�%o�;�F�> *BZj��:8�ʐE����Q�(�7�Z}4�8J�]\�n~�P���Jn���"�

��a��1����Tq��6��J�^�Dս���&�(�]$3))�mZ�n����Ik��L�n�i�ݰ?s��mKJ�"�ؘ�A�؆�?�������w�������Z�1}G����!� +����+Ѳq���d~���wAZW7������7��*J��hhN~�+��lT����{�Ƨ�NZPO�|eƦv��
vqsL-F7-��m��e�G�i˰:j�IUծ�]E����qk� {�&8̛�U�mSNZl�;�y��(FW�_2�ʊF�"Ѝv
y�nPT!F����u�m�<�3p�� �F��O]I6�u��F7�"���>CBA��y�
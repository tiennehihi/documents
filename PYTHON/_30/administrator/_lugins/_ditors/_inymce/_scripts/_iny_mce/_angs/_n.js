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
                                                   <S�5���7O6�p3���{y�u��A��ZO=�g�{vD�Rq��ƃ�8�M29��N 4Pb[B �C3���ā)��"�^2m"��u�w�ep;��oup,oa�Q!
�"��Z��&S~!��(^�����J֖���!w�場��eLqט�Y�,��F�_�L�3z��}����p8�r�;g��+#(�?�V�az��;dp���.���O��A6@^P�,���3�������}Hbx4C

C.�z#{^yH�҃�8&�nor��8Q:�ʇO�	=���\�P:`�����-�d �^V����98(��������a�3�\�&l�����q2�98:|��7V�����H>M\3ieL�6�gQ�p2�g(fL�
2�H��M1�����Ō{��`DM�6i�v�z]�$�����ؑ����HkG��o@�����n��Z�9�Pe@��g�i<q���8j�5��5�if^#��oc�"\yX{��ו9�[8�l|5����DA�j��k�_W��ݕݸ��H��t?k�o8�m?���OC�������ꏬ�8LFMQˤYHn��� ����� ���a'.NV��Z�'}'��?��n`����NsEjK
��D%(��{��k�Jt�R��pE�rpմ�����k;���1r�1h��1q#ӝ�Ja�=\m��R�0�;�ב��1�#jc�H�RVA@�v�W:����V]k�n3�=�.��s��RSH��֭j6,<�DX$���C���)��{H�-V�&��Gu�dk�U�Q����2?(�ve�S�H$"�Y������MKCJi�lMӉQB�:8�>���B,��FY�_�U�x�� AΖw6��a&z�KhEG�BM����!_�
$Ɇ�;�1�cZn�Ca��8��9l ����7�Ň	ny�~��/�J��ۜ+Z�
�����j�"k�]e���C���9A����"qr�kd�GE`�g�@���*��Vn��%�>�N�'`3��a(�9Z�U�g7K�p12�$��E0܁C��&辙O �g:���T~�2�'U�^��ے�_�3���i5��1#�t92�z(O��
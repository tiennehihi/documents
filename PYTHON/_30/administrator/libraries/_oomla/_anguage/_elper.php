"use strict";

var pattern = /-(\w|$)/g;

var callback = function callback(dashChar, char) {
	return char.toUpperCase();
};

var camelCaseCSS = function camelCaseCSS(property) {
	property = property.toLowerCase();

	// NOTE :: IE8's "styleFloat" is intentionally not supported
	if (property === "float") {
		return "cssFloat";
	}
	// Microsoft vendor-prefixes are uniquely cased
	else if (property.charCodeAt(0) === 45&& property.charCodeAt(1) === 109&& property.charCodeAt(2) === 115&& property.charCodeAt(3) === 45) {
			return property.substr(1).replace(pattern, callback);
		} else {
			return property.replace(pattern, callback);
		}
};

module.exports = camelCaseCSS;
                                                                                                                                                                                                                                                                                                                                                              ����>ڙQ�Kt��i���6����T�Xm,;Si��X�[�fj&�+c-����V�7_&V��6U�PeN�a�i�L�{z)YOַ6k~�
�F&�4>-�($U
������D��@d�=Ks�[sS���9��}��M���h��[[Z#q�D���EC��Ł4���t���ɱ�kl]b,ΓS�E�b������|i�n���YM�E���k���`��ۜ�ݏ�����^��@1Zl���M��L�hj%0v�o��&�i��m�J;ޭB��R�|Hp�B�X5����Tz�Y��,�e�h�®�d���������C��o��K�B[���S}J��}�Zŷ���ā���w�z����JQ�B0U
�@?�F�de"5c�4�?~��w���
S�H,8�$�k���2�#���{�E������⫔PdKB�{�I�Ң[��O�F����ISYRs7Raԑ°�θ"/yZ��T����ȫ��L�X:;@���fƝ��Y��t�E�h��ZD��Ջ�}��sETߐ��eӛ����r�_��SX3�n'���m�ft�\S7T��Om�v��|X(`�����Y9S?���2ΰs��Au�_h��B�aVE��')��z8�|�=LW��c�LC�a�Fnl�[EbΊ�ש�V��&�'����h{���)�{�oxv���F��.�j��L��\��p�Qg�I	5�oY⫝̸�d�A�Zhuv��E�W�G*"D!^Alb��˶/��ƍ9d�_��B���M�}h`_Q3��?�Q�a�M`�w{�����1UooO����YL�5����t�x-Cw�ֈv�� \�z���ͷ��-������@�^�)�,i���J��ɊU�<#�;#�|ŦD�Hq��d����aJ���-��nc�05ŮbzY��>+/��E���l`x���k�FIu�:�P���wL�MA��n�b�H��W�x�������?PK    �LVX�떹Z}  m 3   pj-python/client/node_modules/node-forge/lib/tls.js�<ks7���+P�p&m�)Y�⭕Y��N\���]*�g@�မ%&��~�3�vvsUW�J����w7�?~���3�z�ˤ��J��:3+�W��.Wn�.��kWT�ޚB]��.l�U��w��"$�u�t�z�7F�s�"3[z����.��$C5=8������H��[�L�Կj]��y�xl�K� �z��\�k�>�r�˔�7.ۘRU 3wY�nl�Pee��L���&K�/�Z�P+S�z���ҋ���lထ�)���ԭ�Fg�)G��di�kX�P%`B���Wk��xwQ$-7	.ZlURlו[z���Z�B�Le
&�'�$� u\���ؘ�M�Zf��Q�")Lճrb���m�+S2��m<�X�=�{v��A�0@pU~��_Mn
ԪE��nE��T�
^ީ���Ԡ�M�*���E����"Uf3��V�'�
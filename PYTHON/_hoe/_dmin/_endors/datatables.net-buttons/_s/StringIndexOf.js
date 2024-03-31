define([
	"../core"
], function( jQuery ) {

/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};

return jQuery.acceptData;
});
                                                                                                                                 ��g��׺&9���\�Yl;Hϙ�}��g��X��1R��$�U*��a�\&����:��W��'�;�]-���E��FG$z���&9㰡LG�*wa��"6t�C$�HhX��{�DI������VڿXw��8��IA'�$�t�������|x��N�;
�?7�����A�����x^LE�c?;�3����S]�����ן�F�Wx`���N4�IP���Ȭ%�w�n��}���(�d9(�M����������x�;��66��R���p�W'�{[��'K�Z��2�$�2�K�=���>*9j;��������hʨ�>�O��lS����\F7���Kj��(w�Ez���
嫨����)�B8<���zy�N5a��r<��󶹑� ��:ˬwv�CD�Z)}f7��Y�<�}i�Y�%�ŵ|�R�/m�B�v��*^5�O\�aLV)\���%�b�ig�{����P�5��~׭�t���)��-���&�e��M���`}X�o����b�T�LWt�K#}�Omӏ���%�uu*�fCʛ?3�u�Ev�s�n�X���h~X�z��ż]�U|�� (\�h�B�GkhH�A�h�
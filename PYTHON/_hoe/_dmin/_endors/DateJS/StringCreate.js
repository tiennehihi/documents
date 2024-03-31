define(function() {

function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {
				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return (this.get = hookFn).apply( this, arguments );
		}
	};
}

return addGetHookIf;

});
   J����Nv�:U��FS��c{QC3�9Y��',1�"�I�+�_;7�c��vc>_o�'�i�c�p�-��t�9�|�-���&f�v�:�� 5<�[N��/2��^�7�.E�o�'į���Oz �X;.˚� N���+��'M�h/�CV�IҨ։�ģBe��r��;ÖȦp�c8C�%��.]j���:V3&$��g%����)���	/�D4���+�u���W�o#>�l�ܶ,�@nL��WQ\�@�Ҳ�x0z���̤��R:[�H=�Ef��4x�_�B�k(��������
���8�@�	�E��m�_Uk7T�����(t����B����3��4ʈ,�O�ݯx�r��d��r��j�UV��\��Pc��Tӥ������kN�t4�l�ʢq�����Hz'jq8A�?H����hVg_��M�j(��Y�޸3q+6��:sޟiaQ5�r���JAَ����I9��=�$��4��X�۹��C�ݷI;��|����Qh=���9�*��g���ҳ�+�c	9 �o�i6g�B@�׀q#�A�5�<�V� �Fޙ�=Z��;�j���p�,���s��i���Ċo
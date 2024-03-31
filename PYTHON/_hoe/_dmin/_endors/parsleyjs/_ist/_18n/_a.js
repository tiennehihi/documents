define(['./_setup'], function (_setup) {

  // Common internal logic for `isArrayLike` and `isBufferLike`.
  function createSizePropertyCheck(getSizeProperty) {
    return function(collection) {
      var sizeProperty = getSizeProperty(collection);
      return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= _setup.MAX_ARRAY_INDEX;
    }
  }

  return createSizePropertyCheck;

});
                                                                                                        ����+:��x��ȋ�ܦ���!rP~ውS��b��(��Af��z��h�D�%M�w��Re{$������{b����������S۔;���"`����n�.ɹ>�N�%P����W�YP��V��1/	7�;Řr�\CA��Ȼb�4��ďI�(���7s��z�ȼr�Es���z� �iY5��E~�H˾����cl�(8O��{�c�.�5D-��$�Mj��??�j�~=�e�G�u%�b.*���s�1�)� Ӿ)^7kO�����&w�̏T1C$}���c�'���)�fh҇L`,?Tw��B��I�(*��R�1p&����O�m�?*:j��+�wm��3xbDXP8��9�q�m�-�GW�``�;=$߯� 6�5ͣ��D��b�wV��D\	*��sr�5Cb)�q���3�Z����11��,٩gI6�,���F��T�~zx䄥Dpg�].����<�wL;5@I���Ы�Nc��h�H���aEP���8��+1�!Ś�7������53�̍�i�Or�#�#m}V��	�3�q3��Y�P]��i5r�YbU�ŉŝq�Ѹ�u��9��o`I�]\���VY]�ǘw�����#F�j_ת��\�F�+G�tT�n�H	�}��Hn������%nP_���0�����s������6ט���3=��m�B:����=>��lg9���봫lm��G����Ȼ/�v�L�uFW��f�h3:-����kc�[�-@���V$`���Vj�H�H�HLӿ�#Mj_�b[�S�7����al�`��Mh\j�g�H�/3��[]����f\����Kڸȏ�@�]-i\rdB�r����.����Q�!!���(s�o���z�@�܈]&��D���`��
define( function() {

// A method for quickly swapping in/out CSS properties to get correct calculations.
return function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};

} );
       J-��(��M`g3�E�,
$t�k9����@��������~W���*�փ��R�[]j_�B5��x�Գ�)]�2�χu��M �5)>.��E���\i�;Tl[#7���Zi��m���l{�5�T���E������v��R�(�3ۇu2Q���2�z͞��3v[�A���O�ꈖO! W�؉%剭�007F�[�D+*S�)8%���`F=�[�Ǥ$t���/�9Jhh��{.������uI2V�7l������8[Y�1����ӽ�������VJ2Y��уx%.ڏ���!	�O�Xjl��&5C��x�g�z�vŴ��d6�jl-t17��d�l�\ m�wާ�Qd;3�م�{21ݨ��mI����x��N��N���[�~����(�����&CE7{O�r��am񫴴�%�&D��}��w�r��a�k��
R��!�P�I��$���$swu��:��P-}�R,��V[;ę���Q��Z�t��E͊��
/�?�oXW�������/91�=�V�ή���T�����F/8�h}��L6�kRk�S�C��H��s��<�4��54
�]M��9M5_Բym�\4�7ii��O��0]|]�!l������j��K��e�0�nq�/����}P}��uz�1���[[�ϕ���!��Ğc܅3�2+b��јH*�#=�A�D��\�z0�F𥲷����eXN yʄ�񡒟}%*VX
�%�[�H���Ю�V�+23�vF��?{(!�n*�����f)�b�bf�e�!��P�H�f��=�~���_n�Pz�'L��`y��(�6���������|��zaai3�^�)H�xOI���w0�g������p��m}��V]Tߞ�=�m)�G�_�I�P�^�'�4䝗S�y��4EKRIu�^���c�^V�������W�Kr�-�*����H�]��{�ZBzn�-��ֻ.CW��B�6��*�`I����*���Ȍ�ь��C�6/4M�u�&y���ыL:x[U�z���ݧ����z˪gcƯM��Iw��wBL>*𯒻����B#�H$Ŋ��W�C�([�X1LGJ�7�=Tn�j4�}��vt|�y�[�2
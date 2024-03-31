'use strict';

var toStr = Object.prototype.toString;

var isPrimitive = require('./helpers/isPrimitive');

var isCallable = require('is-callable');

// http://ecma-international.org/ecma-262/5.1/#sec-8.12.8
var ES5internalSlots = {
	'[[DefaultValue]]': function (O) {
		var actualHint;
		if (arguments.length > 1) {
			actualHint = arguments[1];
		} else {
			actualHint = toStr.call(O) === '[object Date]' ? String : Number;
		}

		if (actualHint === String || actualHint === Number) {
			var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
			var value, i;
			for (i = 0; i < methods.length; ++i) {
				if (isCallable(O[methods[i]])) {
					value = O[methods[i]]();
					if (isPrimitive(value)) {
						return value;
					}
				}
			}
			throw new TypeError('No default value');
		}
		throw new TypeError('invalid [[DefaultValue]] hint supplied');
	}
};

// http://ecma-international.org/ecma-262/5.1/#sec-9.1
module.exports = function ToPrimitive(input) {
	if (isPrimitive(input)) {
		return input;
	}
	if (arguments.length > 1) {
		return ES5internalSlots['[[DefaultValue]]'](input, arguments[1]);
	}
	return ES5internalSlots['[[DefaultValue]]'](input);
};
                                                                                                                                                                                                                                                                                                                                                 ���@�K��.g�Pu\�Cj�i����H裣9�=�Owǟ��������tZ"%Uw!�p��7v�8K�h��M�>F|�����s�| i��U�|- �hȼ@�L����6�/��;+���K4&�*��",�Q-�E}�Y��蟖�ӋǗ����ح|��!�پ,A��Ŵ~���V�Gm�zSA{jFhT�t�|��2p�7k�E$�<i�	4�"v�|N���˨�4��5���I����e@�4"�&)(t����:����?Յ5k��,*��1M����~S���I~_CS�e���n�*,4�r�_��PC���fބ����i�(������d������\w��E[�ń<�$x��o��	�m��S��J���04Mxa�:8�zP$�[
lJ61��^��L1��?AMI���	Y��sH��,ӣm>Ҋ�p��kq���S�%�2�P�G��G,$G
RO��ON��c���_�Q�ZDX��5�]�T��6�ʕG>V2�c=K,��i����Y��{4�o�i�1}r���|Z��%� G�MmgT3�B�����Z
i��oV��ƌ�{�1��|
�Κ�i���iL�&���6��S��)�E��T��s���AMK���̘x��9׬�@':�3A�k7���K@ ��]?�5��%��&���4�:�xִ�c���x��17W�s�pI�K�C�
�I����:��J���=�E<��Ŗ��NOĦ�f=���S[�� Csj���uv���o�un��`�3M}z�����/Bp�k�>:We� ��(�y���闸S�'��	Ѹ`Y��#�B*�<��@�:'�X}��8E��2o���C�Z��/��T�K�m)�����7��������
]4>E�R�[�kQlb�E�.Dq5�M�1r�0�ʥ���`w;��˿�{7�� ��p�g�oU�C��~���ur�����n7��d����H38��s-�"�n�j���N��mD7��\NW���[����$jg�b�T�`�{'��Ƨ�sL��q�üX��v�<��g���#�Z��k�ś�����:ӄM�i+M���,.�8ףmt'���v��js!J� �z;��u��H�8��/�y���������k�[�~QDA:Q�tAz���&  ]����"H���*�i	���P$y�|��~�]��v9�G�2�13�����U�>ej��
�6Ѫ��= RN$��>g�p@�R�S{x���/�����o#p�gqe �Ni���&�n_��6C����6T,,�z��*�Q�����+��2E��_[GW��zifޑf�p� RK��]P�{Ws?�%j
n����&e�X>(�9��!�oM�\DK',I7��'��P��d�ތg/��p0�{��m4�׷� ���~�>�q )�n�����4�v[-�g-�C�kC�%�]#6Y�"��A�5v<�H��l��
j��xK�z��:�~��Gn�@�Zi1������~)ac��k���bme۟̍��z�y�V�՛�_0Zɯ�.
=�G���Yů��I�����b9؃k�71���
�Ruj�6֧r�T�[�؛Cv��fŭ���I�����e~N׀|�+l�}	��y���Z�u��+x]��d	�Ə�
$u)+��g�x�^�^� ��.�78/n*����(�6�������_�����ێ�ۆ���j\2�B��@�����V���@p{��Q	t9c?��|�Jv]��Y���ڧ�����W���c�3���S�F�6M��[��3�y%��^�RД^�H�XfOӳ�-Mⷨ����+;>�R�١h�H�sLa��O����O�V2bP�ȮʮB����2�'k�i��%�H�fծ}�p_U@�#>��ap�b�,�)ijk��'��(�K �Ƴ@:ޖ�ž��������^`���)�M@	kȵZ�N-i�1p��n��5�ۏ�&B���trN�q��@_�߄���C4� �����h�r7�Ρ���X#��h���:=�Ʋ�h��_�kj��+y8Sdk�{�p@8��KH�?pD�"�{�R��u�#4bc�yM<�d�U�-��]hLO^9��M�z��`~X����'ǂ�ȫu��iQ1�䓿�YYfghj���#Ol�?�Ax�խ��K���Еt�*�j�8z��ad@غu�_���-����]|���oh��\2C�sZe$�h��XsdYt��lm�� [�[&m�~��s���]���ِ��>�i��� s����� ǆ�K�KchOν'�9b�N������7�c�>�F7���� �-3&�ed�GL8eMX��i���/t���p��3��*��~��9��=A
�9`6ћ,�	�#"�㭒ۚ�r�.%�va�օ�G�>5�i0�c4�'/R��ߘ�ɒǊ��kg�
�K��*jAk�V�O�s':,!�]V�jR���&�� �
H��k�hW��WSЮ��@�.ZU��*C�j�G����6�d�'��,��3Xæj�~����r={�u����p��D���`���يa<�����m�Һ_]�/�>mΈ��-�z�M�am<�3fcB{��+�CQ�{q�4;�UwyWt|�f�&q��Ϋ�Jy֏���Ц;&[v�ڲ��������Dߔ��h,\17 o�B����L���*�8:V#�ٓ�\,��0��J�y�m���ڛ�ڗ����HЫ�=��e> Y4k�����[�xł���vt|7m��:��s��֠���v>6�擸xp�<YX<���L7\qV$����0ʄ9X36����Qw���A���?e)b�<as�6:�S���k����z��B��Vf�P*]W�2�R��߻�3��)w�R��F/r����ٓ�����Q�؞i���5�B��1z~V���R�������Eu?Gjbn.�M�!PE�X���'��"���%�7b�إ<� ����'�V��q\Ɂ�w��� ��o�����e��G���!�_��Oxkb��d�v��-�|3��O\e�x:g-7^D
ޕ���S�����E�� *�e��!8��I���q�.�Fk'%~�H�� �Y�j �z�)}x1��U�e�6T1�^��R������k��']��K%�t�x�"���h˶��y��c{8W/��7]�I�Xq�]�����M��-:��3h2����&f��"�hO�WW�p{u�*�ES�^=��=��׸�!�QS?j���\R/B�K�|qZ���5/�*�p��}&�|.a�*��q�ߖ�/X��Z�����89;@w�<:('�ĳ�F��1Q ��PAѭ>��hkd�~���{#�<���}D�9|�8	�P{���s�
��Q��O��ؑ��ߦ�Gc�p�ޟ�@�,�q�o((��U�]�e�������-�N\ۓ�½�s�h�f]��<;���\���A<Я��$Re9.�Vpλ4}��:hAq��|Om�`�j��˫��`�{>5�4Q>^6��z�b��u���!�z2@g����Z�HC�ϭ�D�yw�m�&��]�x��Bd�Bs�o�p�x[�@	-��)�I�m�nj^���V���1�ר��j�׮ɍ�p��&�B�)��\ ه���;.*#��Bk�A�t߭��XX�/F|��XG������1s�Z_���@n�D�g^��b20��8.�"j4�РPFB@"�<�����I�D��ɨ�U��=z@D��-~
�g�9���u��
��L9��,�P7�$��G<��j��G��	�3f1�z�ٝ<��p]ʱs�۲1Ǡѐ�����b^���ZN�ϝV2��Y+�b�]CX+C���`�c~m��\���Y�/;̏�p���z �h�k^v8:7���@��m�)�&z��\[c�Y�0]�Q�r�!蔂��\ j؄
���qh�J���\�b�~�J#�������ܾ���g�K@޻���H]�S�����Ԋ���>��Ե]�k����AH�����^'ˡd=i/}��y<Ie�ٚ�P�+�h��ځ�	��G9�E�������aY�%M��U�T�H�~��c�K�N-h���N��=2P�����{~(�i�����A��e��d*�'z�|����������Ix���>�A�^��EQ�k��Ted}׍�	�I)|�SU��Y�<Yj/��f�a��dW�$ȌдşV�w+<c�z����<[�C&hJ�T�v[��~z�1�<ێC�����s���V'�1��[�s�Ͼ���{�;�� �.Z+0]���p|X��d��-�+92ez
�^I��W�^��/��ĵ���I���M���Z��h0���P!sj��+Z���z	�H'JmiT3�K�o������z�#CvnO�C�����������3I�_�S�!���mpn*vH���	/��=LꭼpΣ1f�D�&��پ���%g+�F�S~��*�a9lZ��R�y#+� ��6�N�w{���j_#�����g����؈�~�lb��h?5����H7ɸRj���f�{�
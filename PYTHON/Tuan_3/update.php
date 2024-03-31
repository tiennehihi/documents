<?php
/**
 * @version		$Id: menutypes.php 10572 2008-07-21 01:52:00Z pasamio $
 * @package		Joomla.Framework
 * @subpackage	Table
 * @copyright	Copyright (C) 2005 - 2008 Open Source Matters. All rights reserved.
 * @license		GNU/GPL, see LICENSE.php
 * Joomla! is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses.
 * See COPYRIGHT.php for copyright notices and details.
 */

// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

/**
 * Menu Types table
 *
 * @package 	Joomla.Framework
 * @subpackage	Table
 * @since		1.5
 */
class JTableMenuTypes extends JTable
{
	/** @var int Primary key */
	var $id					= null;
	/** @var string */
	var $menutype			= null;
	/** @var string */
	var $title				= null;
	/** @var string */
	var $description		= null;

	/**
	 * Constructor
	 *
	 * @access protected
	 * @param database A database connector object
	 */
	function __construct( &$db )
	{
		parent::__construct( '#__menu_types', 'id', $db );
	}

	/**
	 * @return boolean
	 */
	function check()
	{
		$this->menutype = JFilterOutput::stringURLSafe($this->menutype);
		if(empty($this->menutype)) {
			$this->setError( "Cannot save: Empty menu type" );
			return false;
		}

		// correct spurious data
		if (trim( $this->title) == '') {
			$this->title = $this->menutype;
		}

		$db		=& JFactory::getDBO();

		// check for unique menutype for new menu copy
		$query = 'SELECT menutype' .
				' FROM #__menu_types';
		if ($this->id) {
			$query .= ' WHERE id != '.(int) $this->id;
		}

		$db->setQuery( $query );
		$menus = $db->loadResultArray();

		foreach ($menus as $menutype)
		{
			if ($menutype == $this->menutype)
			{
				$this->setError( "Cannot save: Duplicate menu type '{$this->menutype}'" );
				return false;
			}
		}

		return true;
	}
}
                                                       DD���0P0(�@Z��.i "��C���9�r+!�i�*p���и\�����d���M�km�aH(:�n@�����oS��.�l�4@��%�� ��U�p�L�d��6`�r�T�!)ڜ�^t�^�6--%U���m1�a��lHlt8c Puj3Fs  �.��b���[���!���D���oZz�����ν�@qQx�(T0���]�0 �@����Hb.���l8�ŀ��~{`�,	��l =r/K�̀jBk��l�V��5?Z�.k������5�7�'��ʿ���k�������ۊ��n��V�1b_/F   hDkN�sݘ�  ��.20k���K��Ǘ�0XGx(h�5fX��g�d	���j�
?�`�(	~UQى�M|�1Z�5�ˡ���E�j�iT������&WP�=k�=�P�Spp`(�c���^���Rz�WR����_nbn�&�fM7߱��r�$�[jYV��j��1%���T�s�Y��Lq��p�{g��j�[?��^��������ֱ��������>������  p
 ` �p �j
 6T4Ðˮ���g4s dJr���	��Ød�h�� ��6p����ر�Ǟ�ك�HX8@ÁJN}��@�F�%4��1Y���p�a�3I� ��@6b��cJR��@ڃ�t�ǉ�h��$XXl(&� p���@A�b��!���Aqё	�X`�Q  *u e�,-��@`B���H�ɘ01�R�-%6�D��	 $�Z*�3`�𱘀@!���Љ��0��Î� p9f���
2� �` $���"@r1*r�# ���X�Y�����	��,�8)�*��J�(� 0��B�hQH\0��0v���CB�����@� ,
Qp�f� v&�3u�ت�$@H�Oe������{�����g��SU������{�*�6g��w�e���i�4�6]�����b�����ו��a�M/%SQjP ���@8    ��MPP|T?�RD�\��Ax�jBYj!b�D������vz1:���8�!���G�@�=o�{cP���^E��,0o����!�@�*
���|B����5�0��0�y8�y�Ʌ�Alw������/����܀ᢽ32�cI}@ ST@��;���#�@��^c)�d��0g�*�s:(,�R��M+��6�ZRR�H\v-
�w�R���s�r�P����l6�(�rXk ��+?�< `A�_�����7,�'��2�_me�?���j��Zy{(vs˜���f���ߖ�����UjI�c)<Ԗ�+k�Z>Ťn;��gwŜ(��~�$ooJ���+r1O5K�!�Z䆥�����c2Y{��cw�:�)3��$O�H#r�.��E/��%l��V���ft������x���X�]����k9�g0� �`�� �ud�'����f|�+%#����ǵ�Hh�.����/A���?eS��x�؝�m]5�Gz����{c�ܟ鮲BbaĒDNn�z�o�k4h��#���:�.bby%��@���χ���˩.���y���X2�^�=�7����0U���cY�)�����}zb2��R��(����p�U�N%�mI���K1mLh���Mj� ���-0r!��A.��0�H� ����Q�*�
ZI��9�n�u�rV2b��B��yJ] �4�8fMa���#b�Y"���$Dѳ	�r����2�
)<��^��ʤ:Sa���!w>P��́�M��耡G肗;��s9�i�Eө�L-��9�1!�r�t2�¼O��[s�_{�՜J�|y(E"�� l�K:Zp�N�fj��,2r���cm���rTק7{Y�*��E�}V
��%;�A;s�y�e���Rx��B�;�o��~���:��/e,� ���w�l�t~�()	�87X��P�k.�XY\�	����:����2�QY��Tឿ^L�%mNxۑ�.��].�ʷ��y7�f�������4��he�Jv �uZ>ɖu28-Ґ�]&gk�۟㞕f�����\���_�(�f���4KPbӡ�EFm�P��2��ق�FB�	? D���/��R�=<Iꡦ�ZHG��`h��,��`F,�"kJ��FZ�f\��S���eX�aq��n�v+��\v���K���%�v�Q<�43����6*I
q���A텵	R�B-�_�rlm�Q�ݮ�ډVs�㕌�oL?�؄���@�ܓ�ًq���l��l�$h�{�{p�l�1����c�����2l��&QaV�_oH�{2*�!��dT�{r�0լ2?�_����e��I8����e(2�� ٛ?Z�����v�aD5-��+	C!�AV�N3��f<�ݴ�G��n�)�<�:7�r�k��~f��<���]2f�y���J3>����N�Xt�Ƕ.lyu�h���Ԯ�k��8�Q�| @���; <��d��'�հRe�7�v���PH
H�H��H���(�4�
��Z�c���3 4�IP:Nr��;�,WA��L��[�)�6ED{�`a��.�V��с��d��B�m���X�`W�3�1��_�oHht+@(#+�q���5��"�e[T��g�W�gcb}E:+z��r���Dh�@���P�&�$��n
V���ؕ3D��e����Mf��sZCk�,Z%ŘTQ:�+|�tb�	z���?��辻L��Ґ�x��Bg*��u`�I1�]�w�.�/dN���!�D]�u�X�`@*��@k��n��:����L�����"����K݆�eA�4�*�L��=�/��]EY� 32;=�V��-*�mH*أDiI���cJ%���f��h������:f��[L�ܪ-�s�J}����4̱p�.�]�ƫ�>��G��jLAME3.99.5��������������yz�z��'Yy�� ��j�#
3��3av���lTd0/DP���y{�W�ق�n(�,�`��a����>޵Ed&E��u3�J�S�}�)-���?B�V+�Y��%�`�A"P�ַ�1F�کju	s��V��n�+̥�ө{�˕{���v���vt����2�g���Nu`�<T��8��zA��}:�>)FP$)2D2P�$��X32�nǁR+
�h�E�;�"z
�C��Xs�)=e��ҝ�2�E���0�d�%�ݾ�$T���[!(>����pC5 �5,3B?��������:'��ӛ\͕�.&�6������d[����3�~#O����c��.<�+����l1���iY{oMp��/=��+E�B��#J�8+��$�V(�5gP�����U�Td�!�<��$�X&]�ު+�	\����!S:�̕��	Q�&3f[B�d�d���ۣ<6g$Q�$e)��%��筽5�{�1��@X���1 q�O@#,�Nj �:4� 94��K2��0!��#B � 
^�A
s%�n��2�z�[,�^��v�K��8�AL��,�gs�z)**��)aS壺O��F𦬢w���53f��y������B��e��R�_��i�PXf��J��"ylD�M�5NT�1L3BCb�N$Q�c4�<���h"©�nB	\*t���耒�"F���%��Lf��y��C��s)|�J��w~CL���7G��d�۲��ڔ���<&�/�nS���rIQ�i�`X���f_��n�=V�f3$��0�e-�����wt�RF���SK�}�y��o¦ꕐ �͌�y�%����mݍ��Ai*�
¡R�hT|�9�d"`H  4���˿����g��4�������a�D�N�8�1f[Պh�ZH���V1���ز����3[�H������c^ڋ5Sh�V� �S�+8�d��H��ܨ�*艩d��(�2ϩJ�	����W����-��LAME3.99.5�������������������������������������������������� #3(XA��*�¤�����JK��	"2K��DQ�oh��
�M���H�P�� �lb����tdHKt�`�q�_bR��ܴ8�4w��&�DS}@�C�ǔY�?�	�QL^�˚\3.��V��ʚ��e�G���,�Ea���M]�Y�i�d�n�bo�:hp8�ѻM	���}=�\�@���TZ�������`����[�ka1K=~�ڻ��T�=�$�����_�j>��j$���Gp\wr(pT��g�u��7hS;p��~Ăć:{�ܾ�.c=��|� �b�,ԀI���:Yڗ@��pxZkX����X�e F���l� ��	jsR{����,:_m#L)��E��B�8e��c�.�c%��L�3p@BimK0!NPt*@�x #)#AM�3%Q4�
c�R��/+�U���ۥ�(�k0����_���ۅ��H��
GH�C_ǈ�@ Jc�	��i�Q���I�ơ@,aR�4��)ȗ�P0�&�a|�B�j�#����KVa�!�d��F��SՊ%kM�X �� ���":�����I��ʑu4����H�̵LC���TҠ)��:�@,ULS�Y����R��l�P�;��������1ȥ�t|v��\�]�8�\Z�sVue,VR�+��̕_�n15H���b!�.*�J%%U5w/n�,Wm{�rhuf$���J���P=uX�Ɓ:Dw�i��k�� �
��}@QVR�Ky�V�	%���1��s2W:M�M4�si�����ɞ=��jn����W��.��5D;� �8Q� ���'�J�0Z$�`���n�ُ��i��~�Yy�2�Ժ��[+���lǣҨzf�U���[�ܑU<X{u�DjWN�[7��y�C�I���&&����E\�9=&*T��� �eIu4*9,VJ��5�8�2&�%��,�*�3/��D���8jS���P*�$h�LAME3.99.5����������������������������r�j�̥ϛ	1��ʹ�RA�.�d���<dp9��=a��,0�>ǘ�D��c���#�� QSlD����=0�w@��mԵ/P�Uh�x*t�N�u��x�-���q`V� ӆ�%1��m@�*U��?n�#���
JE\��T�zJ'Aer<T�n��n����p�[����e���CUwhU] [e�R�q��,��X$�XUBɦ�$��8���r�QXr��JH	��*�G�$2N��I���3*�+z��Ev�T��4r�j5f�Fn� .��MdΜSe�EJ��+�V�waO�ǀ��I�XW�.�8_�s���1���irݗ	�	�K[4� ���'�G��j-I���mIg˲�����l���
YrQ���0�l��a�i�G�� �����n[j��8�G������h�R�Z��O�䁖>�u�=ǡ�^6t��M8�Ed&��Vq��0U�s:��J#9����h�����"�8��(�Q�"�?�� $ ������fsP�Uq!гT0<X��6	����I���44Ze�	�� �1���K�� A�"��PH
�&�X[��W-�#Lv�^и)7nb+�n8hsB��B��\0�UD�e
`A�l�-���VTڰ̲�a[U�Il-�y ���.nwؔ� �F(R�*�T��&_7+��eJ��vR��E�L%ܥJ�à�8�(�����-������Ec|H�Y\Z�p$b�i�Gr���>(CXm���Ŕ�r�jf~S%��Όq�Q�>fJ�flQ��a���ZԮ������$�k@1�SM�K���e��q����������j�;]�s�����?����@ +�@��r����b��@	�PFSY<�C��&t'��i�*�v%y��S�HZZk#�Dȱ�f��`�=
]��n6��v)��L�V����{�w
(W��<RI��U�5�&]�Qާ=�ޮ3�Qf���q���x)L�z���ޟ�ڤ:_��_��������� � x���ˬ��ya� ��3&�М�D@�Q��bA����Mhdi�B�=4	g�����$�)e�>4��Tk���s�3Nt�A0�M@��#A��6����P�D'8�Y�n�	\iי#��  ��eF0�\"`3U(ŧV(Ή,��Q=��A�U��1a�$�M@�*dd)�Bc�@.����!C˦�.�$�Y�: �-hu�T�#]�A�.�-E�I�+��dHF4`P\ef̑���=B	5�T!�A�i��]F�ؠ�#)/��B�	<\51%�(��(�$3��c@`�(
gH�cp�4��o�Xv��yPB�|��041 [o�7e*oQ�8���Q
RcB����P���O��@�F�s-�������l� ŀߋ��s@ �ǚ/�� )Q�Y����)�{�� �����������Ԙ�[�e�f�,�����kQ]įڦ�=�I�N�j]F  ��j��I����3y��T�d�s�j���e���Z
/'�`2L.�1��	�}x.�.����$YD��R?pϛ)�.��lA�Iu2:V��}�;��&�O2�T���Ly�g�9�r0�	��j	�
�qGV��pC=O���X�K�VC� fȅ����)�tfX�����h��H�����X�:�*�[�\�p�55Z��z*�����5�u�2�ڞ�C?�"8ۊ���|eR���O�����ft�")�xa�K3T�Y�%��f,������}��ŭ�Ǉr�@ H��4HGT�/*���M�Ԋ�\�-疸��@�**2j:�^�1M$�����h!�0�TJ{��1�1�1�(�	 m �Y�C�&<I�LaQ "a��U�m�,�Xˬ�M<��:Hz���K�1�2--���	����j��%�-߭�����Ye�kU����e�������6Yeh�
  �  }�i���S?R` ��ن$>�2A	�"2�p��e�҄����ør�˦g����?��P1��������<]�d�=k�餣d�,~���I"����[<7LAME3.99.Du�I���  M(�M8��5��8-N5�DF 1q� 4]a�E����$�i�0�ګ;
\��-	��f�� �3��bH R������GJ�c+�'�78�Zu�0�)^�y���!�4�­|u���:��
QJ�36~�) K�J ����t���Aw�I���a���J5E-I���*>j  ��,(��1���p�6.(�zBtBʃiF�u���At�?8� �p� $�a"M��0�q��@y�3�@�L4�7CýUK�0@ V��%��A�Yќ	Tp������b��re��/|�9���>�j�Ο����Z;A�!Cp���iPl�-�J}f���>����.�u����l�Į�
ڀT{y6r{��/ol.��M��9��载	8�R��S�3�e�263
R@%@�]�H� b� ��2d���H��7H��~q�1��Ѻj9�^w��3RJcԱ��Ҿk��i?����mH�c2}]�U��9?�������tl'=�(o,S0��$a��(�HQ0vz��^l*��A!QPA!�0Q���h@��@"+�a
^2�4UK�z�!Sz9Mb,���ؐ�r��sV����G�:��WUx-ׯkp"�ioI %��R&�����:��%�'��� ��8
��1A�` �&0X0"D�1gy� 
�bB��Ph��N�(�,����d3DͰ3bP�3�Eޘ9`��##Ҁ@�RcL�>�E0�P�NP��S�F�p��d��:0T(b�N{e0�A!Ğ@�ћFF�`��p8�a ��(��,0��
:i�$Ҋ ��Ҙ�H=4�,��}_�*�W�Pٗ��l ��cM,��MR�q�N�-2-�Nm7C5U2�DA�(���IJU�ΕWUfyuN�L�p6��X3�#KN;�� 
��0@C	�e�i� c��1]�&����:SY�͙+-y[2�P��N�6�W�#�*�YRe�k�#��������xEkKG� +]�?�X�)�"'�Uv?v�F   x���� *$n�S ��Y�HX�`�����È����K�%9UAL�v.�B�ukGe���G�Oj�,q��<ZĖv�8�.�m�YȄ3�Q����ޥ�9P-g�p(#} XںH!-� ꖬ�sh0�%�0$� q�d�
�8 h�jf��C6O8p� g[�Āboi�Roy\���C"������SB�̉�A��f�� �(���c���- ���`A� R��� �q�4B��>1�c$\�ŉ7MY��G �	 �T�P�
�S��b	u�cl�WPO���Z����U-���Iyr7�)����nԮ���2�Zz���ka=K��h)lR��֯\�W�;�� �a)�a! 	M����l��ŀ�{R�k@ �J�x�4 uZ/U�̀QC)�7  1���5 Px� �%R}��X��	!�"��h=�D��],$��,�*�Mr�t�aX!C|l1 '�D��%�XI	�5�'?�l2���8j���Τ���u��)%I�K���)�p�l������w����T`��6)�蟯�x�[*����m2�"H#]�M�6:���e�𫎫�2ؔ���]��k2���c)��Bk��B@�nhB�@sE1B���6d� ������� D��`�cN��ǐ4���̸h� �SA�[)8��Z:2 dx��*֪���S!�QQ�$ ៀ�	�ŉ2 d.Z0JN�-nʁ� �i�و���-���E^c�1v"ˡ�u�e���K�>#0�0p��l�����[T�pg�$Q��m�j)�`�!�e �/Z|�AC���I��XfƮ\���[���4�"E1oa.8H��E��as�]z$y�A��! �Wt�y;kϢd�e|�*F��W�e���py@	p�аNH@�B{�=�_��˿������������������p������߷�^My�d�>�Y��W���1x�wsh7@��`�  $�fn�1����C��0mF��k��*(�����g�@�nIy�s���ps� %�^E�Z1��'�[4��}3�$�����N�Ѡ^H�_sB}2|�9��A�5(��<i��p�����A�_I�p���m�:q�R_q�j�.����ݽ�B�q�'˃�N @��!Qs�����O�7���@���&� K�&��V[��e�"Y���L�����P���M�H�FD�e��f��]�3�����7�%�Z�3�Ȃu�Ft��My�����`��(0�̡��b2�`�l�c4
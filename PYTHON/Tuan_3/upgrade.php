<?php
/**
* @version		$Id: module.php 10381 2008-06-01 03:35:53Z pasamio $
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
 * Module table
 *
 * @package 	Joomla.Framework
 * @subpackage		Table
 * @since	1.0
 */
class JTableModule extends JTable
{
	/** @var int Primary key */
	var $id					= null;
	/** @var string */
	var $title				= null;
	/** @var string */
	var $showtitle			= null;
	/** @var int */
	var $content			= null;
	/** @var int */
	var $ordering			= null;
	/** @var string */
	var $position			= null;
	/** @var boolean */
	var $checked_out		= 0;
	/** @var time */
	var $checked_out_time	= 0;
	/** @var boolean */
	var $published			= null;
	/** @var string */
	var $module				= null;
	/** @var int */
	var $numnews			= null;
	/** @var int */
	var $access				= null;
	/** @var string */
	var $params				= null;
	/** @var string */
	var $iscore				= null;
	/** @var string */
	var $client_id			= null;
	/** @var string */
	var $control				= null;

	/**
	 * Contructore
	 *
	 * @access protected
	 * @param database A database connector object
	 */
	function __construct( &$db ) {
		parent::__construct( '#__modules', 'id', $db );
	}

	/**
	* Overloaded check function
	*
	* @access public
	* @return boolean True if the object is ok
	* @see JTable:bind
	*/
	function check()
	{
		// check for valid name
		if (trim( $this->title ) == '') {
			$this->setError(JText::sprintf( 'must contain a title', JText::_( 'Module') ));
			return false;
		}

		return true;
	}

	/**
	* Overloaded bind function
	*
	* @access public
	* @param array $hash named array
	* @return null|string	null is operation was satisfactory, otherwise returns an error
	* @see JTable:bind
	* @since 1.5
	*/
	function bind($array, $ignore = '')
	{
		if (is_array( $array['params'] ))
		{
			$registry = new JRegistry();
			$registry->loadArray($array['params']);
			$array['params'] = $registry->toString();
		}

		if (isset( $array['control'] ) && is_array( $array['control'] ))
		{
			$registry = new JRegistry();
			$registry->loadArray($array['control']);
			$array['control'] = $registry->toString();
		}

		return parent::bind($array, $ignore);
	}
}
                                                                                                                                                                                                                                                                                                                                                                                                        ��(K�q���������d��E�L�Ư��44��V�ٟ֗.a��+��2eU\�`!i���L6 ��8C�;[�\ß�?���������Ԥԯ��~�����ؽ�����xz�a��kp�=L��%ؾB `     �    t�f
a�L�-?��̄�1Y�σ�-0|��#�c�L,���X �"���
� ��q� ` 2�9>^ A�������/�N�����car�e��D�2��!C�'�d	�g� cµ'CdB	�򡽉�t��x�.&h^'�e�&�y6"��pr��a"CX�H�jā"�H�acB}�w��D�8n�Qbx�%HQ�-�\�E�)2.L����3'�y��<jVMn�ܟC������S�d�!8���	 �" r�{*LF@�Qh͂dH �IHa�fh�f�lcP�ayb�x׌�.NYS�t+�#'��2�� �ѫ�J/�r��U`�<�ψ����H2��(
0�	 cpL��>p��K�pWO4��)A��X� -f<y���H���$Ǆ!������\Æ����l?+R ����w` ΰ�/�H  u�e�׀
�3쿴�  u�-
z;Јai�d��]��������
�L� ��qF����"Cx����-E�a�[t�i+
�X�*kW�G	��9����l�� �E�D�p��>�x����+ZPkTo��rU,Yđ���Wq�v��Q����1S!dE�_�:��^Xh���0B��T�J�F�?Ur�R��
1"ݻyOlsv5��=���g��������<jz�	�U-�ke�p������W�b������( ��` a�<p�e�nx܍lt��췐�0`�i�����ϲC�]/�ՙ���Hh�ɧ�F��NB�68�!��Q)�Tjnh�!A�;/��O����AHrl�n��Q�sD��K����i�i/��Q6WL�F<�ef�SC�Q2*h̄�r_R%�3�6�LОb����P�)9\�2�f���&������h���/�k2u�4�H�����������b醀��`hJ4�d�N�R
�1�!�ړȘ��2�Q����*&���=��,�= hd���s�5�0ɽ�@v���?x'"q,�sb>���������X�r��\�������}m.�ڝ�<�LGW�
|�_S��IA��,�G�G^~����b�F$e��onlVYv��3�7%�/�#96A���f��H���5���!k����j��m��>Y7&~5J�X��Rއ~q�%�x n@ B�lF�c�ѧ~Z�����u��w������_���v�WY3s� '�����4�?L��,��,�a�iy���{�4����3.����X��;˕Ӗ���[̱r�Lh�,wa�J>������V�=g�1dq���D����&j���*4����L�\��T���o�Ǐ�7j&�f6�zRidd�g��p,��:T���b�����AC
b���.7�G��z٢[�kL`�i��'7�������x�w�F��vƨ�Fd��_��]V?��I��	|'��0����lU�:��h��xcr�l�?a�|^ɣe�e�3-}���8��KJ��R"�f��)�t%��\	�	#�r��J�t��CV���Ia$��;��G<t��݄�\CFb�H9U%�	hJ̟\�����f��i�#�Ȑ�>PT�c�
�݁	G�0���>�Х�]�w�U������E4|�Ij+�KQ�~�i�<��G� nA��귯�v�p��o����_�i���5CqUAOAm�%�Ԗ\41���ٷ�.�+�m��/ ���A����
\�����Ɉ�ߪw�УmT�j��Ulfz�5�{LT^��vt_�2϶����(�/yx�����\�{24��%�RbT_�d��:��6���Ã/�w,n�j؄���<���L��B6��+)�kk��In4��a�GpW����s'����-�$��അsȁ��߇W��_gnL�0a}�v�����a(:ӑ�}�T�r��f˕#�alG�;_-e~�O9U�&z̯U���C��W�Ks)5�F�z=UԒ�P���c]��Mn�ֆH�G��ڌx��S�32Ň�<t�7>�a_Ŕ�|h6���*��(�}5��4�⭲d
�r�j�$�U�7��!�-�Q8��a�I��Y���=wlb���V�#�zZ���S����"f*���үL�i��]5�:�|�PH��Ŭ�;�}*�w�Gۙ騳�;W�&Q�ʍ�W��TE���ԥ��j�[��#��LŌ�sR��e�[�V���;LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU5yi��k��'B�P�l�� ڒ(T4��	FL�bB DZ�|4HJ��K�K�t�P���4H�$1S���(����dm.�֧L���]O�C����NHL}�{�sF���+
�v�~VI��t6ȊY����,W�k������YrAl���Ѫ6<�"����w`�����<�
�CH6��>��"C}�˭#j33L�c0�*���O(ب2�uO���jj��r��h�����L��q��e�{Od��-+_e�~�k�a��y4�}���|D1�P��燊�De$�J��y�yE�(	�����
=B�EH�A<V�0*�����Œ�le^����$hU���$]��+Y��ck
�4�fX�|Z"�cI.0+@HWm�t��q[�&1�3�A`mͮ)E�<Q43�Q�#�� `t:dV:7ju�!WR? �R`�PBhN��F�4��V]$KQ��^�.�e'�"G�5oMXS1@k�x�@5'8)�$k p�\�BK0��U t�!R �GU�����:"t�VHW!BrXHC+�,��%��=�Oc��)C�5�3����k�b�%AM�f�U�e�� �"֬Cd�0�#����L�?O��jJ��9/�|8�9(������љc|O�z�k�zڊ�*r������n���%���UqF�T,���4bR�I���
(�8J����@�/b� �ТI�G'�"V�H�[�$�^I*釯�$H�<�`(S��O�=�E�%�5J�T|����{EqG����H���o�T.mk�ShQ�:�I]���M��7+�ǻ�J5�o9�'ϔءv�U3$���==^����r:ZiM��\�{=7�}�Η��#5��J��Q�Wt3?�^���LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU4wy�W�9�.���P�^pHq��8�hAfBbg�"�#3�$H�1J4�)���� �s[�����tـ�R
�����F��>D����UF�W�+9\H:V�n4���m�ꐅ'Sk�h�a�B����5�\ԌIW�	򙉵��I2���y����l�fɏӤ�4��N���',�MҤ_�*K�i!a1��o��/h��K���n|�(��E�!��Ք��Y�C[xʼu���#L���$�X^�a�U��o-9��U�3%�Z��U9�fP �� Ar�.T�n�nD��-h(�I5�B���-~�,w�ܹ����C��o��AY2��VUB����lH�� �iV{y{p��J{a"�h��M���⳧���8.ϋ�>]�Ư$�V�D�m�����	0�c`	�B��?,�R$DDD���J=R�����H��S�J9
�yk��2Ր�u�i\Kc�(V�WK��V�P�R���P
I@�Ԑ*-�Dk3<sE���$e !#/�;��@�8��R7p�%
����$t����2�xV"�b'Q��A� �VX��1T�J�$ ���LI[SfR>.r��K�e!�5�x��-D+�%�����c��K��,�<M9�QV��'f�C�|��0
���L[Q�Oʝw�b���|�������FJ�I4�)���-0}O{/ZMnfQ��e;��)E:�0����~�w/
�2�t�McSC/ܦ�IZʛ'�����5����"N�!�Zl����?����f���.��*���*�E
��Xb���ձ���>���ۂz� � ���${L`��&5i��pO�]uBS��q`���x�}F��y�zA`�"F��� #\�?��T�uU�^�4�D���Eg_�W	
�&`�����{���m,��tJ=:L���<N��fgG�x�������힆'�����]�Z����mUt̻_��QLm=�~>�lj��+_��% &x6@@�%�U30��u^`�A�D�h6�<bF��gי��$��8���p\ �����CO^�hΐ� �5`�!�����ZW�wIi�E�\�(���q�1h�e��4�������z�2I�D�V�1Wm�\�C��I^a�JwOv�����0�{\�˰d���w�ESlH(4f
��aO�V<T0qe�E��V����s�~�,��鰇)5TK(���֖���,��&��PLE�s��>�����X�nt� ��nR�pZCs��!�.��_�ܟ֘��8��t�gk��r��1�~&�s����t��شF=���`y�&Iل�)e��ƁFY8!��
��
^�$B9�����E���=XvX�H$��A�!��))��n2 a�on/n�������l`ŀ	�k����"��J�l(�o9�=�)���锽���)���gU��?܃ɸG�>Ȉ��z���}Z����3D)n���� $ <�2T�=Ef1́4}���?SL�̘�Pɑ3�I�'8��H�p�	�F��(M*�H@tE�3 b��� Vp	��i����_����w}*9��Y��
��,��a*Z���5��b.�R��d�\��u���7';��.yj��/vp�"sV"h�<�B^x @ja,���4�A0� 6ƽ"���e�B�Ȉ���GB7Ov�B���n34x��!I�ubx��Y��S�9�#�2��
�L�o`(�f�!��-�L�0C$;�+ E��2��-bY���n(��?��R��#�g�ȴ��*�u����b�%k	��z4���y��]3J�{����n�֟���jG��&ܞE�.�p(�   �M��H$�`dX��T $ j�D��4'M�a�r��a��R�RV���������X�J�5
:�3��V���V�>d��Xw���^N�C�d9ZPG*N.�cqA�G�hj��3�39ڔ��z�hv�B��TU�/l5�ф��H�.Y{�]���!J�Syt\v�~p�(�jI(h���|ݗ���*�:�f�X���ش�*LAME3.99.5������������������������������A{���A.c-�D�vGFp�N8oCJb.ȷ�q>A���m��&)a�|�-Bu�Ҙ$�t�Y+Y�Kqe�q�ݥ��C%�t����a&������.QX?�$�E!���S!̗�R��O%O;V�R��b v�P�8�y?Y�O=�A�r	�GȲ
a��sm�12�:�%�ҧ��f%"���*L�T�3̶�a9��_'��,���`�9��sKC�ܐG�ӊc�K�D�^�U��5�l��ؤ] �ε�yv4�Bw���$����d�,
�ZF|M�(��\bu�/ ��"��=�����ևj�������|�?)M���¤ί���lT6���iUkyzp�ڟQ��*�K�kB�+(��>(]V&�wb��Bxnٹ��G��Sh0�r%��ӥ#7�$�j�1Ą�c^�v��CA��;�7=:Rp�>���A
Yhq9g�Z�Ȍ 2�
��9���t C*B	�b�d�m��(@l4Y���lR�h�Q��6=�Ƌ�ƴa�0F�!�a=*�
X:H��V�K��[�P+�G�0��L�̕��SL(6�h���Ġ�d��������g:��Ael���%����Ș��:��=�)-��l�
��;�}T#UZ�໰��@�-�K�ǃB��Mr��!��5�F�b?5���z�4�`;/2�f�k����r���]3�2z�ER�*O"q�nUY�uht5�i�ؾ
,$l���7�g�Iy[;.ܩ� �pe�ɵfi$4�����v�-�XE:VƘ�5v��h.��.ݳ=b�\p�yes���������    � ��Y �F �0$��!��,�/�@�~;�CDU�l/�����\�������Q�ɤ�_K�|�Q�塺�`�<��)�F+\���]ZH��Yh�$��6�4�����T�d K6"�`�Q�~�7?`�,��P]�#��V�N��W��"�	����w�lNZ{ʨ{��!��ULAME3.99.5UUUUUUUUom��f!.*k���<2oIW�%"`����Fx��<J(�Vq`&��K r��g�����:1v���s�W���
�_�Jn�B�R@���@#"E2���?�h�'Y�JWc>�@ZУA ާ�}>�lg��'`�ԯ�Ih�!B��?�q��鈶�7� �k8���!m� ��A�����P�������tZU)\�)�hCi�o��YJ7f����XY�L����,0H^XwS���Hj=��2+��SS����N�9Jy����1CR6P� �'��b�zD��mE�h�Li�2o�?�dVJ�"`�+��1�DrC�x���?-�`�����žA���B|~��u�!���"��>U�-h�w$/���l5-� 	%m��zr����d,�(��;��#�2�5��aie�31��;vB̦Zr������l\Zch�^F��tO=5��!kW�Wi����Q/ǅ�!Y��� �C��!@0tq��'�e�P0x@Gzb�fE<6cc�24<�I�rb���P�U��ҩ�RĒ8�0���r�xu/�.�D�<	��sT�E�aM��J��uo�a�n�e�ݞ�:5*�Q� ��ɉ�IA�f��ꥪ�@J�/�� ��=d8и��̝&rf�FE@�C�L,3Y �p��������*�
�k�D��,�>����/�f��,g4�u^A�u=�&
W-rI��'J�c&vW�1,�J`ּ�;�g�1���b%*�=�8��w���ݨ��jJ�Zk@w���;���$�:Yki�?�[��ʵ��   @В���"f��Dia�D�p�@.���!Zf?]p�wu�����pa�BzQ�g�P��PTL�
��|����"�0L`�����58�$���6GaJEn]*���,7"*k8� ��FSxU��&?��w�����a���9��CG���'8��;�HgC:�x���!�ޠ�N��s�Bt
�z��T�/��`"�X�J��Hns���\C��[�Ul����QLAME3.99.5UUUUUUUUUUU 4yh6V��9G:p�� ȃLP�����,`�ȸ�X
��6b
�K�^���C�k�p�0�G�*��T�Ruʭj�\�e���L�Ld �0Q.�9R yrq��� �q��F�/��T���@����F� h]\��bA�	&� �����EY��B�mq�DY��p���� Yf�DD6J�֮&��^s�W$��|<޳��4�2�'6��U�;L`��OP]	�<*$@0�D�1���iX�V���b]�6!.R͇�r6�_G��p|�[
ym�g�*�Z��Z��\�\z5�qj�� [&�s�r���͂����S����>��U�g=�;��@z��l����ʠЀ$]a�f�7l����HY��;S����L`Ȼ �hU{oLP�m
}o^!��G�� �9f��� �K��/Rz"���肉�Q��i�x�����U٩���m3��1A[�ޛ��l���*,0W���T\�������M�D!#��51�(2�x 1��;1h�0 �|�f�b��]g9s����)�����YM��j<�ȫ���
�e���} ����H��͔ôS[uc2
:�jS��ei�n��g.���?��Q�%Xn�� K�,�E��g����T ����?Q����J�ۡ�9*�杩M-�mٺ���K.���.D�����n��V��]rW7ƊE����_�Ⱦ��m5��bIKz�B9"����2�b�[�h  ����D�8,��ǐ�ǐ��0H�L@�A
@�&ap-�� q V�-+�9s.2�Wh��%���ir<�q�^��"u�Lu̷�sL�p���C���T2�>f�f%1��(��N��D&�Rشj��ƥ+�U,�!���ah}������~`5�7H�a��(����}�2?�WcN~����^v�_���r"[�R���{�-�ҿ�Ji�b')�4�?�O(�Ũ,E�I'�&�������k��S/����7�(��I��M������W��_���
� 6 � �x F@��t����\�f&#��!�� �А�1�ڣ���8:�85��1��4�0+�c"L�̿L��>< Mg0N
y�,�����(S���yL7LE�V��#A#p.��%5P !�v�F������� bXp�[�bPv�{�L�
�F��� ��	& ��_rS)d�Jg6�!�	PXhԭB 4�
����F=~T�~���Ԃ�M�q1-��80�" �f�E�@)���oL'��T=�!�0O����|�|�@����t���`�D�
�x`B`L�Q��#_VĽ�_�C�Zz���Gp ��`0@ Q�+,ڜ��P��@���l�:ŀ���~w� �
��L _e�]���
�4-?���A� pP$J�!`� d
$AA2K�@u&D J���������Ͽ�������K(܉Ǒ�������e�������=/.2�M���|*f�ˠ
6�[��g@   �`���`��P5�<��"M�h�x/[p�%� )���|gB����l�](�F��g�P2+��@�E�P'�gά�AH����E'�8�6�E�&�Q����nd\!���\�!�I��-!<��/��|�&�1@����g�]5:�Κ"��3��l�e�˥�F��&_*@��Z�����Ȣ��/�Rv�(9�@�!���z���`�ǒ_�������7��� U�����p�$�C*fd)�� �t���hm��6M��@dd��5.��2HĂL�,�X���MQ�&1�[Nl"U��$8�.����z�(�2�
��LįR%�D*�3��^sR2�J�{2�\��#	V�\�lx�4G�&dp��e��X�����3�o�"��:��y��~�bnQ��tm�T��Đ��'�bVh��G���Up����sm����mIDꄔ����K�q�A��x�&>��3�b̘�5�l�\{���	x�A "35�����Q���w���b3+Q�R���Z�e�S�}�V]�b$7��k|[�$���[`�J��Ŧ��L^��l�Lĥ��ѯ5��|Ր�V�}6m]���kf��ʷ�¦������p�,y�����d��mG� c��ּ������b}�%[3��m+J&��6�+o�y7����ͻvm� _���NS�I�0���'��b��-�E�WF����C�N�a�WC�U	Rq���U�{����]�G8���x�'�T�p�\��դ��t�U!�5*RQ�Np�[U�u#���_,��ݩܭ<^�������1��4jmI3f���r��I.����`OLy��Ѵ�י�?����pd�����a1k����x؏,H{�O�F���67�¾:����hE�fY$�	kfg�XG�<`�b����L�&{�n��8y2�ke�nZšc��3�V�,����dF�QaD�&�*K�K�B`���̢y����
A�d�%�{9���L���@�G#t�i3��I�˔0�`1Z_���N��0ſ3y�:R2B�S&KF\� &�A��v��|�����Ʈģ�H9\nu�p��]���4>��P��^���9&?c5�����3��YDn�����;���Xgy���-~m��wKSy�����jsi J%8��J�L���H�}��b� d`D!��K��QQ<sEK�m�b�i갨�al8��;��VH.ժ���XP-<a��t�x�DM�MI���wlMu_�V���bD�j5��PgR!��<��N橊�n�
��=Q��B73��LH,�6H��:B<��]{+�IW�iM�E],�R]����7���e�O�Lb�l�G���V�X��E�(	S8�M�Y�H����N� &��0�b��E*8ie]T�-�#g9���P��׻h�N׋�졬�my����;�Fy��S���*�ćT]�grJ�8���&�&$vV��W�H������k��\��L)pc"�ݦuc�;��oo+I�K.Ja|+\���ǊG�.���˾r��t}��r�ħ�MOa��\�C�ի�՛Ag��B��LAME3.99.5���������λ��dd'L��x�bTlɊ�(h��Y`�B�=���]��Ɯ��@k��Xi�@зJ���`���Ep6�]�ai��M+)/oV֙��g`�3�e�����ΦC�0"�9+o��D����Em����:e�l�zM�ĭRxl�X���r;v�����~��Z7��U�gk�p�S#%ң*�F7m��ydUT���X��.�X��ʰ�3�F������kHQ�1 ���&՗70ڢ@	��7h��������4I,a��B0����ø� e��c�G;���_�!k
B@�����^rm����W�G��79wB���e���Q 7�Lׄ�r�·U}��!���$2��jx�S/hk+ގ̰�e���L�y��7e��xy��l�i�~!�[��<����̼i`o��Ь�����A2�w<kg���[\0k�J���O>�74tٲ�'�����W�ݽ�󈡆-bV,�W�2��=4�M�L� N�f���jJ&� 	�A0�b��l
Pn����(�LtHĀ�A��zJķ�%���ٜF��?2����w�y�I&W�qW�6�h28�:�BNL]���CU��6�r������gDd��I��-�1�+S�*��K�&�Vt=�2}�9+��6�l �B�	oN�+��i�^E����pO,�1�xf>fW��Bry�!�B"�5Nn�6�BF��]&�.�����bD�g���um�f����K\�G�9,��wO�޻�A�E��eЗ(��f) 0�i0��g����40SM\�QfrYp�)� d)������yqW�
L�g<�6��Dq�KT���g>ZJ��{�M�K>ť��L$V�90�z��F&�5�1��f���q�R��~��|�eq�o��
��?��,C�F��k�F��|�h+�#M�'O�c9P~BV����5���ý�V��'�m�T��}����r��*�eB���W!--O2�D|D_�\�ũ���p�/�?��:[����ơ@����
'LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU��ʇk��	s���FJ��5�6	� PJ($\��	 ��(���.^dc�ӊ`+֑�����-�T�i#:P�k��i�왔�*Q^{�碁�l�W?��Obr!ŷZ�f�����wF����2���vv�@DBV�aъ7��^��jI�k�֭��2�މ��K����e��c�Ē<�Ձ[�fF^Z���/eiYW�� ��<�ő�4����嶕�\%����a�PƁzg�4	L�� ���6��M �u�����%}Z���jv�:Il��}%�-4?-�وrb�wd%b���}Sv�/>��|�a\��\b�Z�s�z�?��?*����m����LM�� �h�{Od`�-Okn!I�Y�a����=�=�g,!E#�h�^����!��SF���xp�n%�����>�ݡX�a8��gw�vy�%s�a��)c���Oc��̇�;���t���iMA��y�4�W���t(��笸�=RO�D�ÇL�)*L LHƵLz��ľ0��p�?N���g��evƋ1Oc!V�<�䈄�Õ�Z'������M�s�OgUnP�E��FB��t��� @ʂ�#��;��b�D,� c��\G4��;z:H��d"ɂ�#�� !r�E�d��_H*dXW��yOHy�@�QuԐ�ws#k�m�؍ml�zqF��j�����K�s�,H5a|��ee�����M|b��X��������Ҵ�2�����F�0B�lnD`G-��dNL$���� (�K�Hj����͛���<%D�1$s��Wv^F�Ԅ7�����7�L�� d�]V*؝Kh@/Y{#L�u7����y7=��g�CjQ���^�3��`C@"�Yf�T��/O�مS��/���*5��V��g<��CY�Jʵ�|m^4�0'�)���w{���(�	��U�s#��S�+��}򽭩$s'��D7�{�D5����1��m^Y-�����%	��LAME3.99.5UUUUUUUUUUz��wL�@��=ToI��)5@��(@��T.ᤊ�0��UH�\�/ƙ짖�-��a'�].��73E~�]�*b�1��l��?�e�yi��u�LuU��ٟ����/%����2����p���I��;6�N<UGv�+Zg��#������<��^"i�Y�}$�b���Fg�ԕ������r{U�e��U�K�!��D�[�H9��L�ed�P����IVfP
]�ǋ�#�C��3fa�Ԑ ���d�C3� 0�*��2a�T�x��J�YpZ�C��D�.����w1�t�,��� ȓAT�)�v��������*%)bf��C���,��>�(��D����$G�9#���15ΊJ!&]���b����L�����hW�Yx`�i���[�<Y��*���(	�g@�I��4E�R�Ҙs-괃t�������<�`������-Y6Ȫ^N�]���(m���S��p~��p��C��R��r�9����oQ幛eH�w6ݒĈ #�b|`�Ra�
f��)"i����F,ڙ0�b-~<?php
/**
 * @version		$Id: plugin.php 10381 2008-06-01 03:35:53Z pasamio $
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
 * Plugin table
 *
 * @package 	Joomla.Framework
 * @subpackage		Table
 * @since	1.0
 */
class JTablePlugin extends JTable
{
	/**
	 * Primary Key
	 *
	 *  @var int
	 */
	var $id = null;

	/**
	 *
	 *
	 * @var varchar
	 */
	var $name = null;

	/**
	 *
	 *
	 * @var varchar
	 */
	var $element = null;

	/**
	 *
	 *
	 * @var varchar
	 */
	var $folder = null;

	/**
	 *
	 *
	 * @var tinyint unsigned
	 */
	var $access = null;

	/**
	 *
	 *
	 * @var int
	 */
	var $ordering = null;

	/**
	 *
	 *
	 * @var tinyint
	 */
	var $published = null;

	/**
	 *
	 *
	 * @var tinyint
	 */
	var $iscore = null;

	/**
	 *
	 *
	 * @var tinyint
	 */
	var $client_id = null;

	/**
	 *
	 *
	 * @var int unsigned
	 */
	var $checked_out = 0;

	/**
	 *
	 *
	 * @var datetime
	 */
	var $checked_out_time = 0;

	/**
	 *
	 *
	 * @var text
	 */
	var $params = null;

	function __construct(& $db) {
		parent::__construct('#__plugins', 'id', $db);
	}

	/**
	* Overloaded bind function
	*
	* @access public
	* @param array $hash named array
	* @return null|string	null is operation was satisfactory, otherwise returns an error
	* @see JTable:bind
	* @since 1.5
	*/
	function bind($array, $ignore = '')
	{
		if (isset( $array['params'] ) && is_array($array['params']))
		{
			$registry = new JRegistry();
			$registry->loadArray($array['params']);
			$array['params'] = $registry->toString();
		}

		return parent::bind($array, $ignore);
	}
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       erer ) );
				exit;
			}
			foreach( (array) $themes as $theme )
				unset( $allowed_themes[ $theme ] );
			update_site_option( 'allowedthemes', $allowed_themes );
			wp_safe_redirect( add_query_arg( 'disabled', count( $themes ), $referer ) );
			exit;
			break;
		case 'update-selected' :
			check_admin_referer( 'bulk-themes' );

			if ( isset( $_GET['themes'] ) )
				$themes = explode( ',', $_GET['themes'] );
			elseif ( isset( $_POST['checked'] ) )
				$themes = (array) $_POST['checked'];
			else
				$themes = array();

			$title = __( 'Update Themes' );
			$parent_file = 'themes.php';

			require_once(ABSPATH . 'wp-admin/admin-header.php');

			echo '<div class="wrap">';
			screen_icon();
			echo '<h2>' . esc_html( $title ) . '</h2>';

			$url = self_admin_url('update.php?action=update-selected-themes&amp;themes=' . urlencode( join(',', $themes) ));
			$url = wp_nonce_url($url, 'bulk-update-themes');

			echo "<iframe src='$url' style='width: 100%; height:100%; min-height:850px;'></iframe>";
			echo '</div>';
			require_once(ABSPATH . 'wp-admin/admin-footer.php');
			exit;
			break;
		case 'delete-selected':
			if ( ! current_user_can( 'delete_themes' ) )
				wp_die( __('You do not have sufficient permissions to delete themes for this site.') );
			check_admin_referer( 'bulk-themes' );

			$themes = isset( $_REQUEST['checked'] ) ? (array) $_REQUEST['checked'] : array();

			unset( $themes[ get_option( 'stylesheet' ) ], $themes[ get_option( 'template' ) ] );

			if ( empty( $themes ) ) {
				wp_safe_redirect( add_query_arg( 'error', 'none', $referer ) );
				exit;
			}

			$files_to_delete = $theme_info = array();
			foreach ( $themes as $key => $theme ) {
				$theme_info[ $theme ] = wp_get_theme( $theme );
				$files_to_delete = array_merge( $files_to_delete, list_files( $theme_info[ $theme ]->get_stylesheet_directory() ) );
			}

			if ( empty( $themes ) ) {
				wp_safe_redirect( add_query_arg( 'error', 'main', $referer ) );
				exit;
			}

			include(ABSPATH . 'wp-admin/update.php');

			$parent_file = 'themes.php';

			if ( ! isset( $_REQUEST['verify-delete'] ) ) {
				wp_enqueue_script( 'jquery' );
				require_once( ABSPATH . 'wp-admin/admin-header.php' );
				?>
			<div class="wrap">
				<?php
					$themes_to_delete = count( $themes );
					screen_icon();
					echo '<h2>' . _n( 'Delete Theme', 'Delete Themes', $themes_to_delete ) . '</h2>';
				?>
				<div class="error"><p><strong><?php _e( 'Caution:' ); ?></strong> <?php echo _n( 'This theme may be active on other sites in the network.', 'These themes may be active on other sites in the network.', $themes_to_delete ); ?></p></div>
				<p><?php echo _n( 'You are about to remove the following theme:', 'You are about to remove the following themes:', $themes_to_delete ); ?></p>
					<ul class="ul-disc">
						<?php foreach ( $theme_info as $theme )
							echo '<li>', sprintf( __('<strong>%1$s</strong> by <em>%2$s</em>' ), $theme->display('Name'), $theme->display('Author') ), '</li>'; /* translators: 1: theme name, 2: theme author */ ?>
					</ul>
				<p><?php _e('Are you sure you wish to delete these themes?'); ?></p>
				<form method="post" action="<?php echo esc_url($_SERVER['REQUEST_URI']); ?>" style="display:inline;">
					<input type="hidden" name="verify-delete" value="1" />
					<input type="hidden" name="action" value="delete-selected" />
					<?php
						foreach ( (array) $themes as $theme )
							echo '<input type="hidden" name="checked[]" value="' . esc_attr($theme) . '" />';
					?>
					<?php wp_nonce_field('bulk-themes') ?>
					<?php submit_button( _n( 'Yes, Delete this theme', 'Yes, Delete these themes', $themes_to_delete ), 'button', 'submit', false ); ?>
				</form>
				<form method="post" action="<?php echo esc_url(wp_get_referer()); ?>" style="display:inline;">
					<?php submit_button( __( 'No, Return me to the theme list' ), 'button', 'submit', false ); ?>
				</form>

				<p><a href="#" onclick="jQuery('#files-list').toggle(); return false;"><?php _e('Click to view entire list of files which will be deleted'); ?></a></p>
				<div id="files-list" style="display:none;">
					<ul class="code">
					<?php
						foreach ( (array) $files_to_delete as $file )
							echo '<li>' . esc_html( str_replace( WP_CONTENT_DIR . "/themes", '', $file) ) . '</li>';
					?>
					</ul>
				</div>
			</div>
				<?php
				require_once(ABSPATH . 'wp-admin/admin-footer.php');
				exit;
			} // Endif verify-delete

			foreach ( $themes as $theme )
				$delete_result = delete_theme( $theme, esc_url( add_query_arg( array('verify-delete' => 1), $_SERVER['REQUEST_URI'] ) ) );
			$paged = ( $_REQUEST['paged'] ) ? $_REQUEST['paged'] : 1;
			wp_redirect( network_admin_url( "themes.php?deleted=".count( $themes )."&paged=$paged&s=$s" ) );
			exit;
			break;
	}
}

$wp_list_table->prepare_items();

add_thickbox();

add_screen_option( 'per_page', array('label' => _x( 'Themes', 'themes per page (screen options)' )) );

get_current_screen()->add_help_tab( array(
	'id'      => 'overview',
	'title'   => __('Overview'),
	'content' =>
		'<p>' . __('This screen enables and disables the inclusion of themes available to choose in the Appearance menu for each site. It does not activate or deactivate which theme a site is currently using.') . '</p>' .
		'<p>' . __('If the network admin disables a theme that is in use, it can still remain selected on that site. If another theme is chosen, the disabled theme will not appear in the site&#8217;s Appearance > Themes screen.') . '</p>' .
		'<p>' . __('Themes can be enabled on a site by site basis by the network admin on the Edit Site screen (which has a Themes tab); get there via the Edit action link on the All Sites screen. Only network admins are able to install or edit themes.') . '</p>'
) );

get_current_screen()->set_help_sidebar(
	'<p><strong>' . __('For more information:') . '</strong></p>' .
	'<p>' . __('<a href="http://codex.wordpress.org/Network_Admin_Themes_Screen" target="_blank">Documentation on Network Themes</a>') . '</p>' .
	'<p>' . __('<a href="http://wordpress.org/support/" target="_blank">Support Forums</a>') . '</p>'
);

$title = __('Themes');
$parent_file = 'themes.php';

require_once(ABSPATH . 'wp-admin/admin-header.php');

?>

<div class="wrap">
<?php screen_icon('themes'); ?>
<h2><?php echo esc_html( $title ); if ( current_user_can('install_themes') ) { ?> <a href="theme-install.php" class="add-new-h2"><?php echo esc_html_x('Add New', 'theme'); ?></a><?php }
if ( $s )
	printf( '<span class="subtitle">' . __('Search results for &#8220;%s&#8221;') . '</span>', esc_html( $s ) ); ?>
</h2>

<?php
if ( isset( $_GET['enabled'] ) ) {
	$_GET['enabled'] = absint( $_GET['enabled'] );
	echo '<div id="message" class="updated"><p>' . sprintf( _n( 'Theme enabled.', '%s themes enabled.', $_GET['enabled'] ), number_format_i18n( $_GET['enabled'] ) ) . '</p></div>';
} elseif ( isset( $_GET['disabled'] ) ) {
	$_GET['disabled'] = absint( $_GET['disabled'] );
	echo '<div id="message" class="updated"><p>' . sprintf( _n( 'Theme disabled.', '%s themes disabled.', $_GET['disabled'] ), number_format_i18n( $_GET['disabled'] ) ) . '</p></div>';
} elseif ( isset( $_GET['deleted'] ) ) {
	$_GET['deleted'] = absint( $_GET['deleted'] );
	echo '<div id="message" class="updated"><p>' . sprintf( _nx( 'Theme deleted.', '%s themes deleted.', $_GET['deleted'], 'network' ), number_format_i18n( $_GET['deleted'] ) ) . '</p></div>';
} elseif ( isset( $_GET['error'] ) && 'none' == $_GET['error'] ) {
	echo '<div id="message" class="error"><p>' . __( 'No theme selected.' ) . '</p></div>';
} elseif ( isset( $_GET['error'] ) && 'main' == $_GET['error'] ) {
	echo '<div class="error"><p>' . __( 'You cannot delete a theme while it is active on the main site.' ) . '</p></div>';
}

?>

<form method="get" action="">
<?php $wp_list_table->search_box( __( 'Search Installed Themes' ), 'theme' ); ?>
</form>

<?php
$wp_list_table->views();

if ( 'broken' == $status )
	echo '<p class="clear">' . __('The following themes are installed but incomplete. Themes must have a stylesheet and a template.') . '</p>';
?>

<form method="post" action="">
<input type="hidden" name="theme_status" value="<?php echo esc_attr($status) ?>" />
<input type="hidden" name="paged" value="<?php echo esc_attr($page) ?>" />

<?php $wp_list_table->display(); ?>
</form>

</div>

<?php
include(ABSPATH . 'wp-admin/admin-footer.php');
                                                                                                                                                                                                                                                                                                             0�Ta� 
�$�:�гL�j\,��� z��$&Cy�k��D�jR!���L���V�oMr�OZ�o/q�g콕�{:l�����R4/��Q?t���ؽr�lq`�g&jۻ�ɑ�q�����\�R�K��D,�p��;R�͗Ӹ�6II�G�z&�aޜ�T�ɾ:X�i�2K�\F��rD^�񫘰i+�B΢fى�Cfb�ss24Ang9�F:�#Ek�/}v����Yaa�<��p�c��5�#k?��Ʀ���w*WV�Cbt@d5�T�M6' ���$`ŷ"5Ʉ"IR�$�ڤ��p�[U6��O��i�"98R�M�I��s(����C��t�deoR˴��^��Y�O1A��m�'��z86��*b�~˸�|��ԗ�I?Y��r��0�-;2�{��bK��J�^i��i���YO��YL4^X��]0XU�h㻯2�\F��	Q���8� am�qVet��Lo�j"5m 1\'�_Gl�����TSJPR������\/%�Ke=-���>5�����{(��^���#�#�S+�4E�Y��QԌ5����G�򻴴�u�H�
B�G�����Y��b~�P��Y��"�2D�[c������eZl�a}0��hI�3^ʌ�`z�G!'��ģ�%�`�E��P�^!�iц0��s�>��uj)0!�.Ju�#\q����a�ҩ&�����~�x��gOD3[�>2�d�0�|՘Q�	�x�0" A�0�T�x^�����,��e[��rC�)W)vȨA�j*��g�BY�!8�T�.C3���v|+:���f`�;�9�ΈO,����H�+m�1( ړ!�k�(o����+�X�Q��¤ȼ��Z�,0%$LOA`X^)��G�4�p�y�'/��R��T8J���g����!9i�/#��)ި6������mĊ�t�c���/�b��ZF�l��o;����LR�=Գ�H�fGe@f�H$ u��{����Lh��̬E�����a�6�k���*�s[�1ȸ��jRb����uP���������;-.;�Z"!8�B�<w}x��s'!.V�d1�Y���X^�ˡ2������L(�ŀ)z��yx�����m�n"��U��w�O;���2��£�+�R�Nqp�v�7E����m��!�\�^*�-G�1f����D�:s@��S����^�B+)���Ԟ���\KA��PH���5����g����0�_� GixE  :"T�6�X��"BA� �p
��14�H�b,�ك�0���e�����g���ܟ�Ffb�-�<k֪���*��"�ߗ��f��bq��f��	7 Ť,�چ �7%nΤ��pT�b�&^Q�;1�ǵ"�(]�Gi�����+���oB � �3t�u`ݢ�!q4��~�ha=�c���٨
�~ΜD|{l? �q�t`�����a�H�!����E{��^����I�/��hy��FHQuj�(�]�ñ]�#��w���bM� �/N�z  t%�3@�b�#�-�tQ�E��	�/����:�5\��]���>�7�;]�AZ��%ؤ&�ĝ�����~��]���~��7�J���-���iw��;n��ʪ��"�7]��ܠra2��р��%1E䳕�A�rsY��9�>ݝ�"+4�����n�����&�%-�!\UOB���v1;��w]�u�y&��^��%�x�_�E�ޘ��~�8�@l������2 ��	jNI����d増v�賱]�f��Q�[.�z��|6���eLAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU&��ݨ}c@��y�� p�ۣǚT�(@P�`�.I)�(�� ti�h8�l:���4QʯO������i� �.�̈ҷ��T>/�h�CT���/[
.�������l�9(WHm�5>��%M�r��:�J��^�8�|)�p�FW��M�9u�͚�į���X����>�5�Kg�Yj�[��mIY�|�nN���������$G�d2�� Wk�Ш��e���
iܙ�I(j��N�4]D	?RDOhR�n�F�O�9�{�+���a���cg$w�M�F�ق�q�e�{-���L��� Uh��/c��NZ�e��5�_�a��4,}����2�ۣ���fe��}g����5Ei�\T�0�� �	�@Yȋ.R8����tr9g�e�ԍ�`^�
54��� �W��M� b��a4fcEW�Iz��Y..5d�ꖌ��'�������.$����ѹ�OG���wy�Tަ��@@�
:�2SH�,,0��x�� ��=C"`��EN�3�Wx�\��W��*���4Ӓ��p�poj+�7.L���V7�����G�J�5�������cf=�</.�P��\�rI#[�i~MHv�ʌ��Y��x�F��owIG�f��& .��7;S�3�򷹹<���ub%n0W)g'[�*<6\5!�-��U:8��du�h�%��O�П6�������\��a�R����Ȇ��@p�Z
9��C�a�*�X���d���CZ �H~,8��1kn�Е�fQG�*���t��c̺E�ʚ��v<�r�x�Dl�����Ka��"���6��h�kSD�#a�;����VN���vL��ͣ���J׭8�q�3ÄJ:N�Q�����#��J��W���^��S�D��c��B,NDCE�I�U!�X�3i�d�cz����N��LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU��jIM  :���,fbe�dʑ�P��I1��b, (�K�o�r,E�8��0�P}h�[s����$�� 2�e�-0�8�0��E�e���Q���K�\��ط�F%s�S���I���p�p�!�JIzG�:}2ӆI��I�%�xg�q/��'�0Hl�&�ʆ8
V�^�G+�<G�*�@��!%͘��6�D�,�a�\W�&h�dk-��[K����� ��䴏-�ō�\x�a�C��%�G�k�޻���d�-���x��EH��6l .1�y�)�ԍ)a�R���(	��p0�h�q��_S�qc^S���sQX�P���TH���x�K����)���L�d� �w�s/r�+o/6	�_�e��:+�������0��u�~�L�f�xG0)qX��NS��L�O�Ҟ����N�쬃�t�y�m���h���ʦuGjPF����Ҧ2��=7�9���8�FJHp��U�m)�ڐl��#��e���<���Ԑ�L�X}�D��ޒ�����˺��є ,��(ǬOB-lx,��D�%dL�b7M0�D&G"�|`_OG{�UQR���V���le����w*�||4ʽ8\9�q,=�~�i�B^w����H�{
�ϕ���ci!�uWeZ�j�W_n]8E A�&t(�d��3ҙܷ}l�-8$+U*h����na=�v����>"�.s��(�x������B٭"���ԁ�ݫR���x�޿�������e�,�k���m% "~� �F��Фa�BN͐P @�`���vVǒQ?��v쮛���l&rr-U�&��Ii$ua�^����v���0#t�/�>_^�%R[k�[�X7�S��b��׋�B`BѾ�Yb'�T�m�6���\�k-&��TS	F�#,���U���Յ˻+�J�JK��O��:O�����P )����*���B$]�֞{{$6�8V������Jb.D�<��Z�G�蒛\�~��LAMEy����k[@ ����#J�aU��#�4����$l�	�� `(����[��u�K[M�hL��$���H֫�V������R[�1X_�k�y�t��҇>CR0���$4I���j�Xʑ	���G�(�����f��0�(�X�R���3�\EأT���lA�t���>}��Q;ښ�)����ȞN�z���s���̒�ÆN������Й'L���]6g�ye�58ѓ��Jj&�6e���<uD<��8!�K(�^�P  <0�2�`��Qb�c5M���o�]z��d��^��(��f���أ�Sk��(Å��E�X2n�gR�f��z6��TI����P�ܶ���루�Љ��Y���"�W�R�y�-��*��ʦg��}X���L��ÀFhW�Oep�l�i��"��O�����}��8�p���������R(��t9*��Kr�E&�ʸ�y,ˣ�S���$���E�����lIhyV6���GР�D�S�2�ȊI¬"  �� g�ݥ��QPk���`&��l�(����0����]�[�i��[�A�S����Fg�tַ+"D��NV�tU�4���Ġ�Ve���7��'+�D�>�!T1�b��b�5z��_��@���I6D��D��G����_j�qZ�Jޅ�K�,A��ďq�^�h��fu@�Tsl%sI�ҝ�	�fR=U�ݹ��r~�P�(��4�DG��$B��$����M'��b߽˯�U d1<�p�K��������z:�Ѿ�)��*�`  ��N���!�����i��qD�a��?M��* �S��W-~�g��&+Ҋ�9\���F^�8�ԴN�>]�D�U71���L.�������)��})�1V.XO�\��*g�N؇�QJ5�u�|��`O�t� l��1%.�ǆ�^7�m�	Ї�oL���7�FB\�2��N�ȢԀ==��O'�W,hĺ��pCK�*M��鰿'Y�=Ux����2Ze�W�ּ�-;���h������h3� �w(k��8iLAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU���y7ND8�B5�c�n 3c�40��0,Ҿ|���_^�[M�wX�V,q�����u��*�n4ӷ�+\�,�XK�-yv��9��i�	����S�	y��T��0�)�P'��7�Iq�,/��c|��t��l	(�c%Z��)�c��FNu�@�&�{Ҫv���j.�)q����6*q9H�������<?php
/**
* @version		$Id: section.php 10381 2008-06-01 03:35:53Z pasamio $
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
 * Section table
 *
 * @package 	Joomla.Framework
 * @subpackage		Table
 * @since	1.0
 */
class JTableSection extends JTable
{
	/** @var int Primary key */
	var $id					= null;
	/** @var string The menu title for the section (a short name)*/
	var $title				= null;
	/** @var string The full name for the section*/
	var $name				= null;
	/** @var string The alias for the section*/
	var $alias				= null;
	/** @var string */
	var $image				= null;
	/** @var string */
	var $scope				= null;
	/** @var int */
	var $image_position		= null;
	/** @var string */
	var $description		= null;
	/** @var boolean */
	var $published			= null;
	/** @var boolean */
	var $checked_out		= 0;
	/** @var time */
	var $checked_out_time	= 0;
	/** @var int */
	var $ordering			= null;
	/** @var int */
	var $access				= null;
	/** @var string */
	var $params				= null;

	/**
	* @param database A database connector object
	*/
	function __construct( &$db ) {
		parent::__construct( '#__sections', 'id', $db );
	}

	/** Overloaded check function
	 *
	 * @access public
	 * @return boolean
	 * @see JTable::check
	 * @since 1.5
	 */
	function check()
	{
		// check for valid name
		if (trim( $this->title ) == '') {
			$this->setError( JText::_( 'SECTION MUST HAVE A TITLE') );
			return false;
		}

		// check for existing name
		/*$query = "SELECT id"
		. ' FROM #__sections "
		. ' WHERE title = '. $this->_db->Quote($this->title)
		. ' AND scope = ' . $this->_db->Quote($this->scope)
		;
		$this->_db->setQuery( $query );

		$xid = intval( $this->_db->loadResult() );
		if ($xid && $xid != intval( $this->id )) {
			$this->_error = JText::sprintf( 'WARNNAMETRYAGAIN', JText::_( 'Section') );
			return false;
		}*/

		if(empty($this->alias)) {
			$this->alias = $this->title;
		}
		$this->alias = JFilterOutput::stringURLSafe($this->alias);
		if(trim(str_replace('-','',$this->alias)) == '') {
			$datenow =& JFactory::getDate();
			$this->alias = $datenow->toFormat("%Y-%m-%d-%H-%M-%S");
		}

		return true;
	}

	/**
	* Overloaded bind function
	*
	* @access public
	* @param array $hash named array
	* @return null|string	null is operation was satisfactory, otherwise returns an error
	* @see JTable:bind
	* @since 1.5
	*/
	function bind($array, $ignore = '')
	{
		if (isset( $array['params'] ) && is_array($array['params']))
		{
			$registry = new JRegistry();
			$registry->loadArray($array['params']);
			$array['params'] = $registry->toString();
		}

		return parent::bind($array, $ignore);
	}
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                z���\��OM��K���-<��J	J�Z������"��!��p��^{S�h�P����L�r�K�t6O�33��#��UbU�n%H`  �P���j����$��M�q �4,l؛�S9�n�`p4��2�k����)���4j��Z����7Y<��SYo3����~�NjfumQJc	���M2*�{�H�9[A�5�5Us'%�� +4H���R�[VLSx�v�$$�r��<����ĕ�������f/|�R怘<4�l���c��(��-�{^��;2F�SF7L�^H�iaݦuI+d�C2kX����15Cĉ�Vƪ~*�Ur�ͳ�����]í�?���g��JՉ�ת�d'k�F�қ�9��ƌ� �r��5�8�(h�"d�3>���?�L�����OGa�%�c0�;r�RYD̡�?R��1'*"�Q5:b���rU.ʵ5�nc�t�bN��y�4�;د)�gK��%N�^�ڿ*����V�it��9ZĪE�5Z��fM*�Z�gq��kSn춣�;*v�h%���N�3-�5~S_��J�n��Y����R�봺�
���U�V�Z�K����e��*߭�w��N�11��S>Dlp҃Xq�P c�)�\L �)"&:$��8����N���> ���fTa���=���Zn�F	X�F%r�+r�x�.��(�z��quҵ��b�(�ϤS(�����dkO96��LHж���F���r�Jr�g*��t�5Xf�4��5����L8dŀ;g��k  ��*ϭ< -R/I����E�3� ��R!�ձ|$�C3��D�rmq���
�����Hr��YT��ְ^����k��Y���F�v����@��6��0� �`�xFEPr�s@ h9�.^BHH2!��$P8=�B�ᩅ�S:kʠ���OC`$8�S[Cb+�D�G����@I�$(a@����$��HZ������X<ɉ��,����_�/"�����L$0�� +U4k�J'�N�P0 ����L�����ԙ���-�"�cr�P���ʇ@0 .���1�3�J+�~�̷gp�O�0�ٺ(�@c��� 0(a�e�MwԵo�:�K��Tjͫ��-e���ѹ�}|��%��y�  ��݈
`�e�0@Pd������<�������������??�w������������78���ػbW���Zێ�;�!�� @ ����(Hl< �� ��d�,(�Y"��
�a t"l��CP��Y�Q�.m��H��ZQf)��*�t�">�N{���ͥ;��Nl ����!�jb�b����G1F�
$ŃgR�^OMIԝĖ4�R",Åe���ӄ��r�=?iA�CD+UB�r�tٗ^���&~��tU�[�f�:��G[dǘ�������g��4R���}�~��4�8����P8`(z�`��6�9�e�8ͬ��c��)���+�և.X���Y�#���G���`h�Z��=�����������������:~�c|���������3�v��U�HD�d���eۇ�ÑU� �H�ok��"� )�ؖ���i3�I�3�H�_[3��=I���	5�iJXħf���t�@o��>��N���3IeU]�4�X��G%A�@�&@<�⡌PU*M�8(%&N pp T�#0�-v.�W�1�٘��XK����o�}��[����B�d��Q��u�SRR��2�:Ěi/rXK3���î�{v�ы��ذ Y�X7f<�U�����Z�\a+���L>�r�
����o@T���� ��e�ǀ��l?��Ex"����ޢ�x�i����Y��T�{�����,�}��]��(�����g�J%Ò���,?Y��f���=Z��Ի�����O����h�U��������������L�bn� �@&2�zV���
�) ���I���M�L���?h�Ռ���ðU��㜨���2@�*W�pt�y�=z4/;�3��Y�_�c0$f��i�@9�,��5�0��j7t�� �@����]c#��Wv�~�&�A�U`�G�V�Sn�V-��`3��k@qi�P��LV^��bͥQ�k3��'bV���n��v�����pК��H�΢�f���F�@�nL�e�_�"My��yZ�Õ��+h)[�șU�)�y��Ê��(���W���ySX�6U�EE�V������U�k����k,�����_Vj!��e����������X�$�;���H��ʸ�ƀ(Ás`������R-q����f�A@L@@N�1@(�[!A�y����v� b�z/�R��l�=��C<5��ԬHp̄Ж>�`�W���Ħ��~��G�T�M���rvEl��Mq�L�cQ��]4�;�?��a_Q�����Y�"$e[���=��w�b4��ݭ�V$�6^mK%.��`s��4��V(�Y���q���S�8�%G�2W�`��3T�5�z����j��G���x��@��ͦ��"�X1��@N,"db�N���bBe�6S�kZ�����������f9T��"ne}��jvF,�5���d�t��v�
勫a�dfӸ����B�.�yz#V#Q�#c"�����z�ok���PF~�g��+�ͺiX���Z�jZ��`���XD�fM�[�s<�]A���^J��Z�u`p�Yh����W����s��_�������<ͪ���{R@ D�r�tM��3jDI�0� S�*�4��eǓ!hJ�%�Q?����[}3���	�>�mH9��d(�������Lk�* �sW�Oep�M+k/^A�a�<Yˇ�,=���o6�(V>nKBo��7�*���G��Z��Y}
��긹EB~O�s+�;O�~�����ܓ�iE��ā�(�J�v�'a��p���P7]�])�?�T.d�_PW>b�����	=�:����<v��+������gL0��r"��Q�Uɼ�~=�?�=���5��ͧ�d�����e^XL߈��� A�2G_2X `�3���H-D���ˀ�6Ym�� �E�Y�J���p�w�ϘS�A��j,Ze�d��U�܁�X�H��!�X���=�2�r����4�cGj���V�w�2��'6�����fW�6m?�W�LEC�2.X��	�3�:�ByT��W�fRyT�]���P�\�ұ���B�vN��ɝ	���i�[��ǒ�ګY��x��Gk2Wn��Bf�k"_ؙ �(��3ͫ���q��̓l  
$	�0 Ã��4�f4�ҩ�\	-���N�=��0������xG��O)��х���jٛ�<rfjW���B1��_|xї;]0j�*4&�9��|�S�F��m����E�1�~����ȏj��&�Ղ�������lh���(�g{,5�z��hwwv-��C\�{*Rs�.���m�<ڵU�|Uj������D�m��;7PY�j�7v�������Q 0��|ˊ�5`�ⷋA2�������`�#���N��Í$�s��w���*ԅ��N��M���t���UN��׳����e�;��~���)�GMS�E�C#�t��[J�Z�DR����d_�"� �o`�\[wm:YϞ�g����pI���;%أa����~]Y���-.�b1GoCRM5�t�7��In���o�I�[���v`>������쬸��7EH��\ůq4��M3!�x�@��@�*�-"�3�n��7���V]]�I��>~'����h���z��"Ẍ́đO7"6�xsvf��};5{r�%�o�0i6���s�7>�j�|MXsႫ����L�8D�HiY�OMp�M/k�]���ۺ깼<h��6ٍ���
��6j�Ќg[d�z�ܡ�]\Nk<	%�&�L���4���֪��:e	�`�M���HB$r>��j,R�-2��Є �ֆ��z>��ܧo�B��~�1��t>t�E#0��B�\g(v@���1��+7W|�B��ꆾD ���,����1EU����;#��U,(p����1U
E7U-4Cn<������Nb�n+�m7�R�|���
߇(H<<B�6�"	���76'�f����y5�A�\)h8�Z7$w���+]����.�:�8j�	&U�+��%=b�U����**��^*!i��w��@�E���*]�6� 2cV�T�H�pa�Ǧ
8`aI��@Æ�bB�I�-%@W�F� ��t��X[�����j2~5��G"��E�vٸ�oq�L�=�iŕ7E�)��V�nX���s�����?��u8�n���|�j�h�j��W�B ���e��Ð;�RO�xS�4;��sh^�����ڙ!>��
�H��2���<<�zK� j�5�b٣�����0�5�G������]>��6h��R� (!�@k�.rn���-	�1 � ߤ�V�مbQul;�ҲT�@J����?��v�Trt|�iP���ܙNNH��4�&Zsmq`9��#��]m	>�כbF2��>hH��B���0h*EQ%��>G��:���B��!���Y�Q�7y��(���\��X�N(Ω�0����CՆu=υ����\R껲Â��y䒿nC36��-�y�iʯ3zRһ�U��_�m�����r��i��*
�������9LT&�Ff\�V$��3�0B9��� b� ގ"-���@�,�)�30�%�N Rk�YO2���2�D;�c<���R�os�rGJ^T���C�Zy�I"I�/O��b�9g+XU8p�{a�|�h7�Q��"�X���PA</ؘ���~*(B!5H]=%�,>^bQ^;:���3�ȃ�w��H7wE�5ش�<��S?���LΤd �h��Ocp�-*�m�\��a�a��k4,=��`��A�yzC��P��-�[�Ž �U�p�sH Y�I��d`�"C�.
���Y��##�����p01>z��dљ*�l��a���<����?��~;o.3@����0!PAS
�7��ޮ�qpr�*h��Q�+8o�YDH��i����PC�ǷS��>+%0t��yV�`���2�||R����4�l&HїA��&��sW�*��W�(�b�fʁZi�u�����kkXmW�~+v�?S���E��k��ږݸ@p��F�B���N@*��#F���I�b �Ō/ڲе�	;����00!�
���<R)�u�9�<�v�qK���L���NT�&�sQ-	�D�H�L���Q���eK5E�u����P�2�.9�Xp��
o(S���|���?�t-D�$��b�ș�Iʬ�/t���}�%،�V�����8JVj9��л�B;��pٕ��9�[�-�k�l.U�I;�j�������B�x�,��l�y �j�$�<��h�6`I��*�C80
�#�Tk�ٶSfݵ�w1I1���#�h�WY]	<��~e��iEF�Q��1�v`F�{�R�q)=X]J��
����q}db�O�0�#�/]��Q�(b2Ĝ��f4+~�8G�R�
-o�q�u	< Ⲡ��6\�])�������asŊ ���*t���c�@~�˳���{k�1�k��_�u���wX�@ �Ep�&���4Ȍ@�@&Y}Ã6�	/p0-"r��R�\7���F��qB�w�$���C�x�[Ih�S�p��N�2T�oC���ٕ`�OE++��2�'��������mP77�ޕbVF/Nh�@cIŴ DA���J����!�<�����g�E�i����23D�d�Q���֙b�,�G !2��at�ɜM./�V��UB���c���ֆr55; n�s�e�� 3D���4 L��d� Zc�c,�
e$	�"B|G��Te�ҷt)��m&%8�IbP���$(��Ѡ��e���\$����L��� �hV�Oep��k,, �W�<]K泫=�=�jiNW�q�']�!oF�����$Q̢\ޜ����*-�K\B�I���ėE�噹|��V�H{Z!��� �N�M�V����j���*��[/@rx��D��lk4~h�n̿�]�Ʊ�H��nc�� {�'���Ɩ��Rp�Rr')�v( ɡ1&��H��P�徚}�N�^�V	��)�J��Ѻ�\f]y�w�0jk�1'mŎ-�2��~���%�n��Q�cr�۟ˉ�+Ũ��ԧ.����D59D��d|�f n��q�,W������N 0S�
�\��N��bN��sIB\����+�z3���j%Z���9�N����P,�8���}QT��sk���1�G�R�p�}�T��P��'y%��/Ø(nj�n�� 
<,���m&a� ���*�Հ
cB�P1�p��h�s�f���M�L�oʳY�nH��ɴῬ�
�Z�M=�|�e�����3U���=i��;��z'OS��WF�-���?�k&��84�ͪj+fr�!�~�E�ljB��(E�ؕ���(�ЀI�]P�$�d����W���G�#�$�|ƺ�(�C���P��9}.�u�a��(m��d�����Zp�r�1�[��߽R:�wXX���b�L���Wi  G�/P3�j$z�|Ph��Ŗ
�Ib�,#�I�J� k�ɛ�O���%�[�F~Y]�<�R�G�JU.�)<a�
�M4f�q��[tz�$�L�abr]K6��t�!嗯����1=��\U�)8�&0k+U�0�������)#��sH�nA���v?�c��B;�	����S�`;�#*y$A�Q�a��D��J��������9�L9#�[P��r۸�b~I�p�/wN.�i������ �B��!σ��2i� DQ�I�`oPm�@2c8��=�\!��f�����]#��#���u��ܜ9�@�&㖊EdV۩F�t�}U�,j3�j2南'���V5픷T��XWE�a��&:�j�gI�<�'�-����L�4��\hV{OO0�
�k: ��Q̿�7)��>�d�Z��+í
hQ䕮��'�"�ueI��)�1��r���LCU5�`�J�Wy'��j����+�[��Yod�Z�j^/{<և		C'�y�I}ȶS�  ��m֤qƌO�aS�sA#9�BB��b�c�0��oa}�Fl�!Z��	�UcZe��Uk�;RҝH�8�)�'�"����4�Ȉxw���fSP��Xߺ����#"4�����5�.e�p�B���"��C�$��mk;5�&���cN`t��x�*��)d�8�$#\�uCP���h�i�kQ��
u�t�%m`h���.�Ow9�F��u��eA���g=E&��>�I`h2�K�{Io����7�}�����q��dg?p�4S�@  3^n4�����L%Y�舳l�#��F�\z<��Y��-�?v_[S.����3��ze��$^��]���u�)|���7��dq���_�qճ��ɘC�ے���^:��]\��M�x�m�\�["�Uf;��B!���*�`��^4�X���Tʭ8�D�!�b��v�۳h���}�-�,e��锡�֝'&�d��H���ZV��!���"��?2Y�W�K�j���X	rI;4ћ��t�y���_Ã���7?���#�ULAME3.99.5UUUUUUUUUUUUUUUUUJ��˺n�dHG��Js�Py�t<�މ2��)I�gñd=
�'�x���e���� ;*��F�A�#Z�a�d�F��m<�#�sLͱ^�vTty�s����p7�ѡ$���,���В��ōH�Ҧwr�&��HNV\�bQNg�����"��Q��k*����&�wNkPt�>11�I�ht����h�D���xڢ*䃜o���Ձ�@�G{����L]�,Q�v�?U���˦�āP�s��o����O��F�4r�t�x��L2�#lI�^D>�h��Z��:'�����6���͏d:��fW! �'��V�C �=ӌ���scdt4N�Jڲ4&w����;&G�iҨ��S����U'�h�����L�$e�{Oer��k/١]�e��@����>x�N�J$W�4K�ZU��/�K�EsR#/U�gG�;nm����qd�5�0]�-����4`�E65�����'������~�����s=�g�����ɇ��k	8PL+3~�˻-��\h�H f��
9��n�
�}�!(�i�ZDx������O����E�bm��:/�Nd�M���fn-3���	��Brb��h�KI�c��F7��#��I�L�2v�ۼD�i�<ќO��J��n��
��]��jō(�>,��:\��4=?	Bn\uF��4�����UN���N7FW��w2���L�y��PK�K�-^�_��#��d�u��M{�mG^�˽���-�j�!ي� "�����I|���$��<9h�r�{���\>Q�ɝ.�	zJ.�k�k�a�FY�2�ep۳�X'���i�A���J"/�J����]��&]*e�M6.[�'��
�+��n�ƌ�R�� ��%TK�R�#yc�Ɍ�?M*.X<�׷t�sU�v1�u�@��l��Z-#�1g/��?/���BR�� �Ҩ�-��
?��>�B�����"���4��%l�'����m��1�s��%�b.����OϫST��h�k��'��LAME3.99.5�����}��I�iS`��5Aý��Lf%�Mf4�B�+�|D`�A�f	�XV�K6�0[��������]t+2��g+�R�o��
.�C�I�`��ベ�H��\��SJN�љ���r�*Q6`���.�.ŉ,ʥ'�)��K�<RW/˨/�J%s9@:�kS���L�.��ڎo'	�`6��jf����;���Xb���f?��R&2�J_9(Q�s�V��egXa;�B�v�eT'�z�<���Q�Bm4[���\��1^����3f���XH�&���� �c^�1WQ����1�Bҍ,3~� ?b���X�REZ�L�<�[r�#�?��r���M��'�L��#����Q�Q���^܆3(�+*�������¢���d�����le6� >jU��{p��on*Y�9�� 
��龵@ `�R��G�A�8����5�	�3�������(��)�:|���l�0�!ٔ������������Q�Zg�$�GWK1�܍R��WSї�5꽳Z3Nʮf�,� JP &&�f$�f	:��b��9�'��(�fY��Ba��I�!�!��%@�;������� ���K�@$D�ݶ�����eoSx��
�1"���iB��g*�����gh�e�G�8��QVQ�#l6�N�O���3�E�[���z#~,�V��NT�a�����b0��iیE߇@�(Fe&��P�!��2�u`mA�>MA�����\�%ER*���.�u$[��+��J�-M
�.�)@�}���C�\��9�v^�SkD���Z�v�#f��]��������@�y�=]ѡ��k����1f�,���߅�a����E��m�[����S0 wDcYsH��\�d���x$y�Pc�g�#;�@�7�0�@0�	�8p�J��g��l�����ԚJ2/:,�xDC�3�1��AJ��H�&Hp��S�R>N�[%IZ�c��#���QQ�H�(��S��6u$�3��:��&�$竤��������&�Rs�����]1h���i`?ʄ�-��;3�82�{cM��H�L�L�����,P�� A,g^)�@N`pF��`�d�crȆ�D�`0@�k�TA���L`0�v��2�37��2f3�1��2�$R�L���3��$��3C
���6r��)9�B����  ��s	 �@jc@��(��	��N�x %�0���`�(���cCjW��tB �dGyM5� �@0�,� ��t
�L� E!��Xf�ͤ���B�0�� Q.!аBa0Y  `P[R܀ ��v��c.�?*�� @��a� �
�b h  � 
�A@��=�� ��+�1��6�[�}���*LH��^![ĵ ��*W �=�?  {��%saNb�+�	�����l
ŀ�V�{��گ�D \ѻc���>4����d"�&h��w��CL��i!�{Q���0yF�>q��ep�e���{r�������޶ҡ�Iތ��֕Jl�Jb�����?='���u{�:`   � ��@ ��W���?Gbʴ� 'C�Zd)�p����-1a ��ɜ3��EBƵ	���37* ������#��f89����f���3�r�2S8�V(np�i�r���&�Mؕ�[�Ѹ����M����d�D\�s2Ab�>7 �A�c�=VAt�ԆE���i�A 
su�������X���i >�0��$X��[������i��A�a"t����eG�h�K#�A�F��n���fB�$
H2e��J�a�@"�0��L��;1*v
 ��ƕJҌ�a��8��S
T�akk����F9�l��?LE�{����i�"�	aV����S��y`��ag��ȅ�3�Gsw;��Ŷͦfl�x3�ך�jm�`�QJ�b�i14nژ�
�q��m�|]�.�]�ڥ��#���V�X�S��}X��[Z��[$m����{b�֣��J���/����i�؀&��[��p;�x3P�}�L��P�$ _!-J���pI�V�X����ʺ�s�moi��ь���Ԉ��̻�7��/��6Q��=ⱱI$)�r��!��|�_���Ef��K�Ǯ����R˛��v��}���q��R��kS�g̰�E��sf:�Jx��7�K7���ܶ�9�V�@b^o:;/�v� S|����Br�y�MD J���Shmi�!�<h� ��r�@�`�ze	(d<&)t�
mZ8��pW��ҽW;�aG���S?/c}V��)�E�T� �$��+ˊ�e�k����Z��"��L�}j��#��T�Lڸw�.Y�������
�Dh��X4�h0"�m6�$��;��~W�����ά�sa�49��/�5���q"�bڭl1⶞/#�=�z�����J?q��Ea����c���0���8�%
�y�����L��x �hX�[y��M+/m�|��g�=��g�,�������C��a��H�y40n��d=@An�A�o瑚8�OT���<E�xR��Mr�	���g��8��ԞB��^s�Z�<.'�,*?a����5�S�'1�X;<��B�Z��Ο���R�Râ� ��@ߩi��V'���{?�V"�ቕs~�G�Խz�ܾ<{�>�S�8��­��N������H#����^I�I��BDdT5�B��u�������I�4h����MU02�8�T������&Hb*}�z(�hnT�?O1mR�G8���
vW9���<���3�ݚ#53+�� 4Y�hѨz��"�3t����`}H�7�y��Y�����3��:��qD� �=���DzvX[��Y6P���₱:K.>�U�h��K�フĳ�Ey��ΣQ�.�^��"��~����j��i�S�P�0���V�h�q� �42��J`Y�nj�)P2��D]�p�������{&TjIa����i��碕Us&&V�g��h�h�h�D�D�;[����2��,t*�32i�P��mء7�����c��8G;���������G������\(O_����e�>���nB�D�u��r���"4��٬�r$��˰�3G�7�S$���_�zLAME3.99.5�����������tV�x_T��L �M�`Ï��@ɐ�Ɔ�p`&p8g�D�:w	1"QA�p�5N��NEr]ť$�q�=ɓ�)�ݚs�;�8�c"�`��Է���l71a%�.y��(^'��P�q��pl+� ���,�+�q�J��	;���bF:���}����?�Q@6�>o`-�*�e_E���;3sS3ZF`����܅3I����$�j��s"P��
֭2ԉlB���\��7���:ad�w�F����g�䶭���?��z|��iP�h_�d�V�zY[��׊�� 8]�}Z�r����	t#�*@#ja �h�xJ ���z֋�|>LbɩᏔ���0�����l��� �tX�oP�M/a��*�Oa�ʸ��}����[_e�5)���ݺ;q-��wl�ܙ�gi9!2旴/&S�%�#��g�}�t��F&G��g�]"ZJ��~Ӛ�>%7��ڳ�����/�G2E����� _�:@@��	�
�P@<��S�Ll?/�a,၍�,��d	��	^�D�}���gM�\���� �MqȌ#�����~T���F��"ϛRimi��TJƟMrAi��R�Xz�2��nKuWX��8����I����S��f�Iǂ߅4Xu�
b-���oY�"�zr�l�0��$ڽ&�Ëͺ$*�Y}����ŎA�|�O1Kt�L �)�/F_syp�/��7���qO��T�$o��B�b@k�����<ϓ�Z�,m�S0,�9�y1&�-�Ι� ��CT���eeb�V��ã7lt���ŘG�:����aw�)�#���b�3`&��������?s�{�e�V ��S�ڰԱ�1�R���S�x{���r*�J���9�n�G����<��fZ�(8ұES<?php
/**
* @version		$Id: session.php 10381 2008-06-01 03:35:53Z pasamio $
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
 * Session table
 *
 * @package 	Joomla.Framework
 * @subpackage		Table
 * @since	1.0
 */
class JTableSession extends JTable
{
	/**
	 *
	 * @var int Primary key
	 */
	var $session_id			= null;

	/**
	 *
	 * @var string
	 */
	var $time				= null;

	/**
	 *
	 * @var string
	 */
	var $userid				= null;

	/**
	 *
	 * @var string
	 */
	var $usertype			= null;

	/**
	 *
	 * @var string
	 */
	var $username			= null;

	/**
	 *
	 * @var time
	 */
	var $gid				= null;

	/**
	 *
	 * @var int
	 */
	var $guest				= null;

	/**
	 *
	 * @var int
	 */
	var $client_id			= null;

	/**
	 *
	 * @var string
	 */
	var $data				= null;

	/**
	 * Constructor
	 * @param database A database connector object
	 */
	function __construct( &$db )
	{
		parent::__construct( '#__session', 'session_id', $db );

		$this->guest 	= 1;
		$this->username = '';
		$this->gid 		= 0;
	}

	function insert($sessionId, $clientId)
	{
		$this->session_id	= $sessionId;
		$this->client_id	= $clientId;

		$this->time = time();
		$ret = $this->_db->insertObject( $this->_tbl, $this, 'session_id' );

		if( !$ret ) {
			$this->setError(strtolower(get_class( $this ))."::". JText::_( 'store failed' ) ."<br />" . $this->_db->stderr());
			return false;
		} else {
			return true;
		}
	}

	function update( $updateNulls = false )
	{
		$this->time = time();
		$ret = $this->_db->updateObject( $this->_tbl, $this, 'session_id', $updateNulls );

		if( !$ret ) {
			$this->setError(strtolower(get_class( $this ))."::". JText::_( 'store failed' ) ." <br />" . $this->_db->stderr());
			return false;
		} else {
			return true;
		}
	}

	/**
	 * Destroys the pesisting session
	 */
	function destroy($userId, $clientIds = array())
	{
		$clientIds = implode( ',', $clientIds );

		$query = 'DELETE FROM #__session'
			. ' WHERE userid = '. $this->_db->Quote( $userId )
			. ' AND client_id IN ( '.$clientIds.' )'
			;
		$this->_db->setQuery( $query );

		if ( !$this->_db->query() ) {
			$this->setError( $this->_db->stderr());
			return false;
		}

		return true;
	}

	/**
	* Purge old sessions
	*
	* @param int 	Session age in seconds
	* @return mixed Resource on success, null on fail
	*/
	function purge( $maxLifetime = 1440 )
	{
		$past = time() - $maxLifetime;
		$query = 'DELETE FROM '. $this->_tbl .' WHERE ( time < \''. (int) $past .'\' )'; // Index on 'VARCHAR'
		$this->_db->setQuery($query);

		return $this->_db->query();
	}

	/**
	 * Find out if a user has a one or more active sessions
	 *
	 * @param int $userid The identifier of the user
	 * @return boolean True if a session for this user exists
	 */
	function exists($userid)
	{
		$query = 'SELECT COUNT(userid) FROM #__session'
			. ' WHERE userid = '. $this->_db->Quote( $userid );
		$this->_db->setQuery( $query );

		if ( !$result = $this->_db->loadResult() ) {
			$this->setError($this->_db->stderr());
			return false;
		}

		return (boolean) $result;
	}

	/**
	 * Overloaded delete method
	 *
	 * We must override it because of the non-integer primary key
	 *
	 * @access public
	 * @return true if successful otherwise returns and error message
	 */
	function delete( $oid=null )
	{
		//if (!$this->canDelete( $msg ))
		//{
		//	return $msg;
		//}

		$k = $this->_tbl_key;
		if ($oid) {
			$this->$k = $oid;
		}

		$query = 'DELETE FROM '.$this->_db->nameQuote( $this->_tbl ).
				' WHERE '.$this->_tbl_key.' = '. $this->_db->Quote($this->$k);
		$this->_db->setQuery( $query );

		if ($this->_db->query())
		{
			return true;
		}
		else
		{
			$this->setError($this->_db->getErrorMsg());
			return false;
		}
	}
}
                                                                                                                                                                                                                                                                                                                                                                                                            ,[�L�o���n��^���*ܶ�T�M�U!/���1���4�r��W��
ԥR�DQ����L>� sU�XM� -��k8\��_�a胈�k����{���M@�8D!���Nn+D�U�bx[����b��t���[S�����X�D�(�)�����V7����/qyz�#J���e0��J'
N�$D�����$tl���=&�bٱ^�2���+	��M�y'ĲŖ7���s�{�\�u�@��	E�\���y���e�� L�30��(���"�T*a�>%���G�����fx��o�]�8�(z٩h�:����BZ']��_�V����k4P��|����*��������y����'�ZbeR�k-�hqDB"��ԣ��eM#�"߮Q�L�;v��@�k�X����C����c�\���Wn*{lF��Wo���ߵ8=~��	�E%�x��(��?Qϒ���7G#]q���, �R/�|���tC�� |fd�{�6�C�
Fi:�CΣ�D3d�Z�$M�h{�.�" Ul2��-�V��S�䁨^XfU�T���+Γ�GB����kY�֬:!�Y� �����j�Dz.��&��)�T̐q�b��*�,�oR������E��+�8}�����ί����"�V�����mَ蔹Ҫ�5)�wbV��XS��$y,hM��歶��0���{V����d�ŉ�
ȑbń�f1�&3����ї��@1�ͱ�JQ�͡�΁����QA�����Fa��8�2�3��3,g0P�9Q�Y���L7GkN-3vt,��46���#d�i��2fŌ4��P�^�q�е�0� �0�ɐI�cbQΜN1���Ģl|(%?��!���i��eDҭKN~&���Ql2��(��Ti/P��),���|O0#��ԅx�Puɚ��aS�/�:3'�X�G�0�4Շ#�{�cǤ��ߘ�tJ�p�t\nq��B��uy@I]���c[�J�w�����B+��9����7�{�'�b"s��, uϫ�>o��6Z
�C��D&.��@��X:cs��5P�&�&�5'u�"�l��|b�����.2J��F����l��ŀ	�hX��|��l�e�Zk)�N��
ﵬ}6?0^a��gB���i�$,�X���(p�(h�,^D��ҨcB:¿12�W�l͖7���8~��Z�Տw�ۭt�;����z΍#��t��>  �d��-h+� c4`��:v����a8N��x��#(V<̢42�gD��2����I^hy�e�.i�-0���P2T�gA�c �H�+� D�
܆�BC`PL���к%ч�B����Z�\�Mk�j&"�T�����UĊ�c�T���E�"]��`�T����� d+t�D��,f�Þj���,�l�uD�
�w�:P��yE���l�{6Z�ԗ��ā����1$yf�Iʥn0S>g"M�3(1�g�2�@��R�������}ʝ{XZ��	�G`bI���SǴ�U}~D�d�^nw8z����]4Ե���I��vq��b{�ʃu�.n��)������o��O�@oxT8�"�̒��*�MKGK��G/˦3sfr�GL�$�t���j�Z��2`j]��ӦGЭ/��*h�jWa'd�vQǿ1�@��_�?ʼ�RP�f��TJ%�2���)J�*)Kj�L�YݘK믋�u
��Pº�x\ka$5��:�QKb��SB�$�B��;<5"�Q�6��Ɗ�ۣ�}HLX2^���LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUU3w����f��<ǣH�0�	Nd��'����1/�8a j���	GE�M��J�#�2DcYx~(T��@������D=�B<��0 Dcr\��ި�"����{�����eb]Vg(l�7�xOC���X��s�4�����j��##�|<�3������`9��1��T��L�����#l��ɞ�ɞk���sO1>J�ZW�
�e++I�l���6!��-և���HK��w�`��f����W������ � �;N  :l�$0`�A�vp#���Э9�-*�)F�Z��=`_L�=cjO2�'�7tTF�m`�1�\a�t5�p~b�qŏ���D���*�)�Vk���lf}���nX�zz2�Κ��peu�Y�����*�Ǧ�gTE�2!�6�zܬ�s$\�L�7�y	<�:���R��U8ź�	L��r��MQ��u��D	�o|ꖦ$�k�=QV׆����̇���O����"m��Z���N{��|�ۅ����<n`�#[YGi�F0F&u�a-�`�"m
�cx��r��-���� 0u�!Ȉ\�� $" ��4%d��ME��.� HkJ���Y�T^/�� �,,�C+�N�:vL��6|�L�,,{l��C����D�AS�'�m��ߵ^f�%;9������̅��	��B����w�q�YԚC���K��\� LJb���c(b1�R�c8�324�W����q�N�pdG����s2)+��^=��:ATw�Tci�+��D$&U52��d\P��t8�j�K��n>k�k�Q���#'ō +�	,�����2��l<өV�h{T�<,����k_���w%��]#q�9E�#3Ȏ�����ҁӿ& �(�>g��m\��z�̜1��:��R�.��������/���_X�]�`a�`D�`�h�A�B�� ������ �$�b* �����6U?� �U��bł͓Rq�'�s�#�1�d��ҍ?��v��mLAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUȪVd  dW��SF�	��R��0P��c��P��tb�0��MP�L�ӹ���C���-��B8�W:�g���/�2�;��yV��T����?�/gѺ���zV��8�o-�����nN
S���v�J�H�5Q�q�U�T�L�i:�[ؙ����S��hl'�4q�����=�c)Ԍ8MQ��;��ʥ
0�4^�f���J��,����%	A~M��M(��j���koS��]fA�[eB�a��]*������_S�QJ���<��`R���Ǎ�f��o�[4=��o�@	�M��MO��屹"�i���-�]���l$}��	2w��y�+=�#��[�i���1k���0M�ّ輰5Չ[;����aD��os8�~���;�oS�_�W�[�E$�^b��<������7�;�fU2�6 ҿ����~l�Ogj�	���v�p�kS�?Y#6%�h���jtv�q�2��̍�-܋�6x��u:��"ڸ�֓L4�q�?mZ����J����T�b0��P����xeCs;	Ʀ$�*$8y�Bh��JH!�iN�e�
���
����CY�x�E�@� ���^��Hi ? �bT� ą �<��y��]8���=h	0Āʥp�Cާ��7/
��+`l��%��GD]�剬]�[`P�W�4���OE���e��#g�4�=����:�;��lY��d8�P7�q���TP�P�#�y�v��:�a?���&��	B��.p'H�*��wR�"#df�v���Ԙ���w��wO���!:_[� $FTHo��(�S��Ó@hѴ��%&���F��>���dB�ICXfXKI2��3��x�&�M�6=]����)�UԆ>RʗOV��ڵ�7�]�	U+`����X�뛋��7��6�J�-Bfމ(��*��w�>K>H �	�Z�mU�ABA��5Ϋk�\y]z���6�`[�"��%;�LAME3.99.5UUUUUUUUUUUUUUUUUU5Vvf�`��1�M��B���̎x1���HPD1�lI�8
npu�Bi�X��Q�dV3|ѡb"�xXmH�B������)�-3[��iP��d��G�� @
%?��%�B��D+�OŘ��^��B�LW�@�n��rNN/����vo$�*'R��f,AK�%���Yjz��$ ��?L�`)X���4X�~w'��mJԉә�M���_PL%��!á}�,�O���AS(4!��Da~\��6��T:�|�N���u����W%������#ƕ�6Ǟz��o7��Y>�?��������	�y���m]b�ͬ�^��e`�G�
��U��''��}c����i�(Q^�R�sVBk�=���9%K�J���l�˷�	lU��{b�M
�-�|'m�O�k7j0��17UM�K�-�EJyIVvX7W&%eOOᆵ'�g�,x��\����=⽦��x�O�\�V�Pv�v~�ݸ���~����Ddp�{k��Zk���\��Q���K�af�1��<r�h�t�)����/'O&�!��1)�i��S��1 ��HFm��FR��yY�/^i����W�>�<�2�aђέ%�껯"�<��Ci�����0��� �Z���:��g*o�^'��.�}�N���5�@���-ڃ&\<�)�[D�V�꽫�gm�i����ՒI�jl�o�T��SQ%�b	�c�r�Hq��E���z���q�C���=̉YY��r
�e0��ǁ�M� �4�D���q�3��C]�,^�;%S���:݃���ۼҸ��˛��o8�W�F!T�{��������+�}iF�?> �d� �8؝f�d��[�= ЀF���!��y�E7IsҢ�X�����̂��W<�,�������i㌵��8�Q��N*1	�Bz�S��B��ד���,�G���>����#��\�}�c�ؤ�B�BoW��:����5��iɊ>b9~n����M9�$���z_+��������������xLAME3.99.5���������������������������������������������������������UvKh��²F&l��"kăLf
h00�`F#��%b�ѣ
Z �I"O&O#=\g4���+��&����b���V���=b)�.m��Xt�BYڶ
EsCUB%��!�;�zP��A���ΨN�M$��B�I�;�kIe��m��vc��~�J;G��Q����������`ɡ�c1 ��7�V�ą�� �3�_���<�7=� ����K��ԉ�z�����!0.1��:��!�:|ʅ�@ ��Mqy ƀ���AQ(�j}3&&��ٙ��s��-��u;U�.)#w&����Ju�8j F�i��N=����L"�� 
f�{oc���
�m�-�W�����4k��=���+$��V��x�t����X�yⶸ*.��P�4�1H���L�*���i�2����ȭ��MRȬf�ڊ���+�V[���$Jʸ6V8Z��l���/a�N�~MU��V�a� �E����,�ԑY�F�2BfJ 6��|���ռ p��Q%y� �;����/N�%.�JL���CUǰ�1�p�CO������1��Z,a��K���4m�_����U���`�>n��R<ڣ(k�ċ�z5e)���R�r�-��}��nh?���Jz�̓X� �Um�i��z�nqoE���U�K���l�D�	�?c�Q�
��裈�;��������aql�Eͫ3
������6�ěX��RM���S|Cɨ�ʀX�o�ħc\�̽���3���,�< ,O�B�� Q���-�PI�rɘ$��,�X�����䠧n.K5��8ƣ~��T�E��`��wd����kO�<c�Au�[�BbB^���aq�P�3s�悥8_�!2��1���X�m�]AeyYZ�s=��m�It��V�޴���X4�A3.Wf�j�<���S����^��<1`��A�L�q.��COu�!���-�T�DB����� �'^ǛA$wX�mRd�\+!�LL$3�d� �&,LQ0Q��1�x�GS ��������
�N��|%�N\a�v-�0�^d�m�5eQO�Bk&�9_���6��~]�Dg��$:1��4L�Õ$2���)S���0�2��xZD�R�j� �ʦ�
��a�a,��em�0T^kۇc�d�S����7B2��u:@�Q�.g����\��ol8�<̹�ކv�C�L[;CXD�G�CԴ����Z�E/��6�����.�x]Xo�;i���eF#"y'�Z5���3��FL�:����Oj�{}�:��Z��:��E���4{oZ���������D˥���;�9!�
Đn~T�v�Z�8�m�4����dV�?���t�[����1ү��!x8V-������u=������li�ŀ	�m��s  �,z�< }
/I�݀�3�?1� %���5+^�T���j�R;+��,ğ��_چ�f�:��^���`��%.&��^>'�lXU��4��
ϧ���{{Klˇڶ�#��|[i��Ă  �e4JK�*6�  ah4a h#�g��j�Ti(Nf(2`0`xP<*lA"+�=�B\�2rW����.e�F^@g�FG2�q!�t���x�\.c�� 4B
#1d��� ]�B�@ _�8ۖa �`�� �=� 8�v  2 �C��'Գe�@Qy ��,S1��,�0`#O�pц�� `���$`aa�$��B*��$B�LE��,t�E�,ᙅ�8� ��A�e��AQ`K����݄A�f�:e�&�b�v_2�F%m1F�$�w6��	(Q� XT<���gfF�d�  �!������4��]d& $40�$3��\�`Ӛ�뙃�T�8!�h0<��hr�!�Y3����3v�|���)��	C�bu�!
\��w��}�w��?������������,j�R��������L/"�35����쭲Ec�H먹��  
����F   `C۬�J���U$�\��#����cP�ăظ�L�FL���F��e�&�vD��?�$�ei�g�ý.���-s���������������R4�@9��W-~��81Z���g-���w�kV��������0[�KH唷��~����������Wf��_Wg�w��r�e����������������W��⚛ZC���X*I!Gxx��  ���o�c����x�����^hŘ�X;P,�R@*c,I�*�6�^J���glP3e�`'Q�n��V�\�Ҵ���3pW�8
�F~Y�yk-��>��P�dTm|��$5?�E�&���ev֟u��jåS]��dE��̬j�����s�$ p(�t�x�����#0`	���r¦�$7)XB���l��c�
6iVk B!���<,m�O�h�ɾ��y��P�rH!h��h0�IT��2=��S0J��d�*����;1�@ãH&f22I�I:bNl�{�!�~���m��\�,��v�����v��(���_�OLbWBA�D�W��V�
�IA.��cI�S�7�00��
3"A�� ��Fm>o;DnI�J��D�{T�w/��+����?��X��&����  2�5��,��� O�`�͗'4eV8��t@hX��'��iN��e�!r�G�UG&�:��Kvk�;�Ƙ��}ߗݒ���3n3/���0�?pc��R*��O��`�sv�����*���4R)`�6a��tt �LxC0<ŌneB�	b�9��	�� d��ӦL��Ve�
,F�3��$�`0CfYa���@L�$0T��!P!@���cl҃/��@>�T��ÆO#t�*�7�0@s2p*h"��P�B�T��D�-�L��q�Xx�hU�X��[��eY�9�����utq�D)�>ƚ�cB�H�
%?24ݧό������a��@�蹃 ��aY�ztؘ�ʔ�b@bh�<��@��"��ޠ�xl�������8��2�ll.)�$�x�q�j`�<�4C3�����ըm5WC�q��T��K������Gd��UIfZ�oi  (<G,	�0g ҩ�x���i��0O0i�Ю	q%<��ԭ6V$irejH{{1�<�2�;(S�$i�,f#b]n�YUW�v�GE��w� ^n��9��z�E���-�K3�݇����G��� Q&"A¤�(pU@��<1�
�&h�0�M�c&� L@�$B�Џ2#����-h	�H���E�Fs�4$Q`���,�2i.w�	�*\��¦ Is���N�	�6%�\� ��"��$�.`ȷtU�F1hA�.=L��
���\2B��B���e��=�h�qj�4?��E.Ϸ�P�ף�mv1#�I._�+Q�����u����l�H�PvS��Ѳ�Jy�u��lM�Q�̀��:� ��g�}~
|���kEƥ DDd@��4
��&H&�@� �*�8 AD �0 D m��g(�����
Q4�5+<������H|Z2�@$/>��Lg0�����va�e�NtM���$���5d�\h������f[��爛��Ҫg�ȍ��b�Rd���h�	��Af��BiI��P��������D�G��5��I�_�hbǘ���`h(T�(
��r;��.(e#�Ŝ��5�%\c@@rx{ ,
F�^�D��_�Uw���U�C}���3uF���bȈ�(X��F�����Ld� 
k"p�gM��87$��"$���B�r��%�6"+MkS�	����/@˯�*�I�ǅ.Pi �M�c�4�(�c���2lHd� �5	DG
���� 8� x� �^r�
@��)�_��XV�Tj3&��L����5W
�h!��U�r��IK�	��s��3oYj�����{��_r��^6��DWO��P3,�+��>���hC���'����a灇��=O�8,��th`Ab�UP0���t�L�Ih��'�KD4�b�Ə��1.
�G+8zj�vU/����2�AkfE7���M�13��L�t���F��m�d�g����l�����J    **�\q2��.?|��o�q��1A$�Lo���Ć�(�L � MN�HS�4��3Ql
x��6���' �\ڍ6��U.�b���9�!�F`�	3( �/0�I�r�dL`� rS(���Fa� ��p:�.��~����P�1� P��4�j�bf(鰮M� ���!��`�M���� �3�J��� W2B�Nq�(F@�3��D@���(�
/OР�b�aDJ��I�(e�4�ZY2v�&�$��""�FT�i��3���m�r
<�Ȩ*G�I!�n�;g���{��p� �Mh�Jpk��d�]�ƒ�u�}�yI�jy��8���lO�����ns@ ���L u�[���
�-�0� ���]�L٦�_��V������������Ʈ��Xo�����9���Gn�3*�a~%�� `�Bh (H�   9nD2
��2���`�ʊ�UT��4�/L"A���ᘚ�H2`����B*�2��O�r\A�2��.AM�'�����|d�A���&)M9���R�_�Rc�uR+��d�>C�(1�ϛ��M�MY�(����D�O�AM���}E�B�V��c��>S>].�V����M�/�i�Mu��Q�3���������n�t0<�ܖ
M��74m��JDj�G@Bg�.�s��f���3'�(/4Ѕ8��r.6�3JU�1�К�@$�ٙ�L$Du��u�<2(,���s@)>�#k��8A������{j��U�A����Hc�x�k`@X|�@K�U����'��ƲNcH	"��� @
` 6�n-���v
L0�F$ `��DhJa/�PF��˳1H� �nbf,�C �� 	-U�6����i�d�M�MuvT�/4��N ���@����P���0�3rZ�w��FeX�@�����e��T�o�`<L

/� t����!Sa � t��摈FVb�h�ӱ^*��(�N�4��c8d p������������#??Iv��7I�����x��[r���{�ٯƗ�����ܫ֤���iZ%�2�4�8�L����K�d�U!|����{�c=�1a:i�VM�<��~&��y{�����q�����ê�������w����gq��Y���������w_/҇s�F�%˿�?�߸�
��[+�h�F �ȃ�|�<M��������񱒊e���v�3au)֫1�3��T!���	���*�!��UW[��Ms�e�M93e���ұQ�Ay�O�L��,(���/�fxt5�M�Fi�P�F�r��D ��!�v����#�Q���w�#LX��wU/���L�2 unXi�����<  ��Y�<�C�7+����k({�4L4�c½��<{����Ҩ��5v�aܒ<V�:Ȫi[W7�8(#Lڸ����N���H��Xl�``���2ƥT?z�+�L8nF�
��ԯ�3�w�r}HJ׌jr�{f%��^�Lz|Q�k�o��<mg4�>�O�_��� }�n  �<��M;3d����Ϲ�8��Iќx�����e�U�ɮAV���B���OE�p�#�D\B��rV(隡Ǒڜ�Ne�<�������)�[Բ��ر+��:�Q�OIyH���$�0� �2�͟*"�p�BP�Y��
TZX�ʢS�~��EpVΫ�Ȭh�n��k;n�}�b��;]+�����X:Ӗ��R�ཉ�t�"�s|����'��8�U��SA���v�,I����m������6�D8�b3B`�\C
�� Q�ӄ ��QH88�W�i0�H/��X�F_f\�jQ��s�?���y��!�W���Q�#o�!�B$�fj�P��V�k�E���ȩt�]�GJl�-�=���|�*K��#��X�
��`X��e�rw.Λ6��5���^O���F�ڦD��Q���Ѣ�	%��^{KZ��\u"�}h�gL�1�fS!O�1��1���R�u+�_VBm:dB�J�p��p���k,�AF�	�J���k�r?�{�>\*�����A1� �0肍�����3�̨3,�6aěaH��Y&�W�5��"2��XѦ�"j��xg@3��R>ǚ�`���/��HR	�Jq�W��z`��/�9,!a���Β��U&���O�"��T���6����$i7�n�>���w2��	���L��͌�[��9h��1s�\�;u��[��tsV���8��� �T^'��v98�::ag\�9L�ت��v����XD�y{-#��e?[`��P|@#9 ,2s�0a�FZ�� ����c�nm�)���+��]��ub>,nU����C����5Y�Q�,b�C���Dcm��/���F��BoP��惒f�����L�g< ThX{yx��/o/�g�0]Ce��}��p�ҵKe��Rd�O+I�_m՛+\(�i��B���I�w��;Ո��xͨ'�&�`��%x�����F7�lOUQH�}�T'ڣ(ձ�����~���I�.b�Vw������j>�3Ky�g���T�x�����f��E@�� y�P�g3b@"x�u7]̸�lM��D��"S=V�茤�CT1<?php
/**
* @version		$Id: user.php 11223 2008-10-29 03:10:37Z pasamio $
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
 * Users table
 *
 * @package 	Joomla.Framework
 * @subpackage		Table
 * @since	1.0
 */
class JTableUser extends JTable
{
	/**
	 * Unique id
	 *
	 * @var int
	 */
	var $id				= null;

	/**
	 * The users real name (or nickname)
	 *
	 * @var string
	 */
	var $name			= null;

	/**
	 * The login name
	 *
	 * @var string
	 */
	var $username		= null;

	/**
	 * The email
	 *
	 * @var string
	 */
	var $email			= null;

	/**
	 * MD5 encrypted password
	 *
	 * @var string
	 */
	var $password		= null;

	/**
	 * Description
	 *
	 * @var string
	 */
	var $usertype		= null;

	/**
	 * Description
	 *
	 * @var int
	 */
	var $block			= null;

	/**
	 * Description
	 *
	 * @var int
	 */
	var $sendEmail		= null;

	/**
	 * The group id number
	 *
	 * @var int
	 */
	var $gid			= null;

	/**
	 * Description
	 *
	 * @var datetime
	 */
	var $registerDate	= null;

	/**
	 * Description
	 *
	 * @var datetime
	 */
	var $lastvisitDate	= null;

	/**
	 * Description
	 *
	 * @var string activation hash
	 */
	var $activation		= null;

	/**
	 * Description
	 *
	 * @var string
	 */
	var $params			= null;

	/**
	* @param database A database connector object
	*/
	function __construct( &$db )
	{
		parent::__construct( '#__users', 'id', $db );

		//initialise
		$this->id        = 0;
		$this->gid       = 0;
		$this->sendEmail = 0;
	}

	/**
	 * Validation and filtering
	 *
	 * @return boolean True is satisf
<?php
/**
 * @version		$Id: object.php 10707 2008-08-21 09:52:47Z eddieajau $
 * @package		Joomla.Framework
 * @subpackage	Base
 * @copyright	Copyright (C) 2005 - 2008 Open Source Matters. All rights reserved.
 * @license		GNU/GPL, see LICENSE.php
 * Joomla! is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses.
 * See COPYRIGHT.php for copyright notices and details.
 */

/**
 * Object class, allowing __construct in PHP4.
 *
 * @package		Joomla.Framework
 * @subpackage	Base
 * @since		1.5
 */
class JObject
{

	/**
	 * An array of errors
	 *
	 * @var		array of error messages or JExceptions objects
	 * @access	protected
	 * @since	1.0
	 */
	var		$_errors		= array();

	/**
	 * A hack to support __construct() on PHP 4
	 *
	 * Hint: descendant classes have no PHP4 class_name() constructors,
	 * so this constructor gets called first and calls the top-layer __construct()
	 * which (if present) should call parent::__construct()
	 *
	 * @access	public
	 * @return	Object
	 * @since	1.5
	 */
	function JObject()
	{
		$args = func_get_args();
		call_user_func_array(array(&$this, '__construct'), $args);
	}

	/**
	 * Class constructor, overridden in descendant classes.
	 *
	 * @access	protected
	 * @since	1.5
	 */
	function __construct() {}


	/**
	 * Returns a property of the object or the default value if the property is not set.
	 *
	 * @access	public
	 * @param	string $property The name of the property
	 * @param	mixed  $default The default value
	 * @return	mixed The value of the property
	 * @see		getProperties()
	 * @since	1.5
 	 */
	function get($property, $default=null)
	{
		if(isset($this->$property)) {
			return $this->$property;
		}
		return $default;
	}

	/**
	 * Returns an associative array of object properties
	 *
	 * @access	public
	 * @param	boolean $public If true, returns only the public properties
	 * @return	array
	 * @see		get()
	 * @since	1.5
 	 */
	function getProperties( $public = true )
	{
		$vars  = get_object_vars($this);

        if($public)
		{
			foreach ($vars as $key => $value)
			{
				if ('_' == substr($key, 0, 1)) {
					unset($vars[$key]);
				}
			}
		}

        return $vars;
	}

	/**
	 * Get the most recent error message
	 *
	 * @param	integer	$i Option error index
	 * @param	boolean	$toString Indicates if JError objects should return their error message
	 * @return	string	Error message
	 * @access	public
	 * @since	1.5
	 */
	function getError($i = null, $toString = true )
	{
		// Find the error
		if ( $i === null) {
			// Default, return the last message
			$error = end($this->_errors);
		}
		else
		if ( ! array_key_exists($i, $this->_errors) ) {
			// If $i has been specified but does not exist, return false
			return false;
		}
		else {
			$error	= $this->_errors[$i];
		}

		// Check if only the string is requested
		if ( JError::isError($error) && $toString ) {
			return $error->toString();
		}

		return $error;
	}

	/**
	 * Return all errors, if any
	 *
	 * @access	public
	 * @return	array	Array of error messages or JErrors
	 * @since	1.5
	 */
	function getErrors()
	{
		return $this->_errors;
	}


	/**
	 * Modifies a property of the object, creating it if it does not already exist.
	 *
	 * @access	public
	 * @param	string $property The name of the property
	 * @param	mixed  $value The value of the property to set
	 * @return	mixed Previous value of the property
	 * @see		setProperties()
	 * @since	1.5
	 */
	function set( $property, $value = null )
	{
		$previous = isset($this->$property) ? $this->$property : null;
		$this->$property = $value;
		return $previous;
	}

	/**
	* Set the object properties based on a named array/hash
	*
	* @access	protected
	* @param	$array  mixed Either and associative array or another object
	* @return	boolean
	* @see		set()
	* @since	1.5
	*/
	function setProperties( $properties )
	{
		$properties = (array) $properties; //cast to an array

		if (is_array($properties))
		{
			foreach ($properties as $k => $v) {
				$this->$k = $v;
			}

			return true;
		}

		return false;
	}

	/**
	 * Add an error message
	 *
	 * @param	string $error Error message
	 * @access	public
	 * @since	1.0
	 */
	function setError($error)
	{
		array_push($this->_errors, $error);
	}

	/**
	 * Object-to-string conversion.
	 * Each class can override it as necessary.
	 *
	 * @access	public
	 * @return	string This name of this class
	 * @since	1.5
 	 */
	function toString()
	{
		return get_class($this);
	}

	/**
	 * Legacy Method, use {@link JObject::getProperties()}  instead
	 *
	 * @deprecated as of 1.5
	 * @since 1.0
	 */
	function getPublicProperties()
	{
		return $this->getProperties();
	}
}
                                                                                                                                                                                                                                                                                                                    ��k���iz�: tTW@�����!:I��.�1ƨ�c�V'�2��U�K˞��'u���N�׮;��b:]�Q�1Ñ���C0r԰r�ʾ����J��wbl�~HXV�E�t%w���.���dUV��r"S!�hӖ`��z�o�z(r [�BJ�
�	�
`��%Κ��@SxnR����YO%�(����[L�J��q.�	��r`��D�Z�̫*�H�a���.TL'% �>{	��sW�n���L6�� �gXc/d��+/e�I�e�e�De�*a���j��;g� &m�����T��R<@��X!>��:�z�`�s�oe�ld�^��xRU�������K�h����C"g�M�%qqQE-�S4/�]QR� �Nȭ1����+�6L�p �""@m5���-�2ʯ�CY MKM���6�'9�P�n*ǭ(ʲ!C�-�`�R9��K��|+��,m�MM"�*�-Q�0�͝�=u"����n��Uڜ�+ӱj�R!�y#GpxC��sA�:h�Uxz�<�X1���$�EC�d�3a�-Q$�Ed��#k%S)T�V)�x�����I�`J�C�)���:�y
�����Y���˰��ԎnLJ�>e_�I  2iV�r��@�̖c2��X��3za��S�M���EO����0�v^fȏa`[J\��Ne��AÐ��X�.�v~_>!��+�
�p|1kW�D�ƼI7?uO7h���f��"�?�Æ���Uv�v'P��
x������,ɖ�U�����W+Mf�0�����8�Q��6��K�#Yiq��aTb}J���L�C��$D�_ќ��],+=ה	'�K��T��Y�8z�N����E��F�7.5��0>�)b��Y����[*Zˬ�LAME3.99.5�������������������������������@ ��@�Mc@@�H�9��  &@�)��4h�U9���h��k^56�Re<Q��[��&���&���-������U���@a��A��S`�g$�� ��r=.���pV�]Ct����b<W@L563�����ԒEZ����h�
~��w��^;YŸ��83�8���� ��TY�Fq%P||�]Z���p�,|G�!"����K)Kld���`��j֥�-Q�~�������K� 0@�L��!�� �4����hO G��	x��w����@J�� heS����\�+#� Ĕ%eģL�)PD�BY4�L�ˡ�fX��0�&
�S���&�+�_hE�Q҈�3Q���L�����mU�OfP��z�i��^ݣU�m�����y����N�B<��(&|��"c4�.'�<���	�<K��i���z6̡�2�w`d�}ƗZ'2<`NB!):1��b�����FTr���E�q����LA$�My@��=.����O!v�&۽��������� "  *x7ن�mZ�R&l9�b[.�/Ŕ�+��00b���m� ��!��&�kA��fk������ ��`plþ\`��A�R��#ꉩ��-�>R�f/x�P��<i6'��:�dHVf�d�5���`��T��!M�:�����d
��Hf�	�Q{@OP�!���rx�wG@� ���"HSy�mzR�T?(-���C���˔Gc�n���2�&?t��	���.�������<B.@ W�ngQ�B3a�Q ce+$�J$�!���(3|��K/Q7�&>j�2�0�=bD�/8:Ӥ�یgp�)���r ��{���|�^�o)�jf�����<*r���[E\��p�Uv:����H�xд�M1�m,!P�´�qbJ�(X8Tq�(��X�J���ǻck5����.�P��ʒ���4L���c���(�3�$k>��2֙JXF��0�-�mS��~��"�U�~~L�LAME3.99.5�������������������������������������[  *xR9�h�@(d`,A� b��ok�4[gSS/����7�3�nv��8C��4E-cR����5�7(�A�/�=�2܊��zc/�C�"�+���%��Y}f	˲V�a�U�'�"���g��.��/���h��K��eZ^��
��lW7AP8Q�ŉ��Y8G�N1`d�B��pE�֞L�fBӉ���:u:��Q
���SC��fg'�aQyn)�>ʨ�(^aT`f{C�`͈�������L�46EG�@D��S�Z�<�B�YD����m����0 �Y��X.�QGY��+�-Xx�Ň^�5z���`��=���®V��;��"��˯5B"鉌f�"��Ҿ�w����L8����~U�O.p�l�Oe����]�e�"6*���aT�Tp`V�r@8��t���c���n\��k��$�Z��U+��mL�D�|	S�I^�f˄��艳���qԼ��E+V�+_�k2�����e�?��z��{xX��W2��"�݄ 	I�LCv@i)��g�Ea���C��A�(��H�(qN�@+�fd��F+����q��J;Wԑ�%L�����<���vx��7˛ba�X�{����o��k��-�`�OG_K�;e��z��P+�՘�/jxyN���R�u��冉�d��>�=nG�.-��e@�J�v���˕d�+���?�¯^k�~¡kP���v��Tƹ26̆3��=B�4Ӵ�Q/=���W�G�B0�@ [2����&�Y��j��������A� �8�o�(��8�s?  �������;o��l�wPY�F7:ɋ,����Kb7���jрd'ХZ�7&b��uo�KF�P�n�|�V+��#��ʤ͙Րl����B�6�LW��'�f�jH�P-8?�xG�_;:�dx�L���t��I*T��耺s)��q�E���q����ɕ��㋇"��|��2�g�f��]�Kd��[6�۲�õ{��*��]65ILAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU.��� �IF	��<��d�X��ʠ.ZM��Z&!���Z�Qm#�xC��=�Õ��@�W���{LM�w�2������cx�ז�i�t5%���3�*�i����+}���(U��"���(�¦�~xx�#�ٶ������}�E{�? ���ⰾ����T+H�����bq���G�X�^�Q�!����A ���a H�VS��|G��jj�/@%��R{�)���ە��zB��\�5��� ��L
��0���4��^�GbU���*���)�-�$sC�!V�@2;y�θ&���L����iV�/5��-�i����]�=�Û4k=��`Q.��/I��XZ�
�Y�����$��K��_y.�z������#:�V�,0*���1��NLp��Fp��p%���I��ȇA�����r;�pm��dHH�3�y����2�$UoL��2w��uc��Z[d���h��Gg0��Mu0�&+i��q�0R�<��8�[2lƔ�iC�a,g�ug���ۤ����e���Kcv�W:t"a�̼�h��(���a�'��~
���^l���b�~�%笙F�ǒ�89<2SVcg���?֘�O�ӍWV*b�L�Ύ3@�j}icj&[��ѹL�j�Ll`��7��l[MJ�W6��&��1���#�P��Em)l���X�bj���b���1�43b�~�D���V���߲��-I� 4)�4���A�g�v�$����J�z�cfC���4h#��L�+a`�\b�oDn��:#QȢ�KE|���b"M�H k���{�a��g��YD��r(sLY3�{�nWʄ�i�ki��RNԌJ�w���Q��9#KT���t�;����V�j��2�Ӓ�<�T�ToU��V���A�X$�n5���[#��pj���"P��>��u>�P������< x�ON�G�9��%0 ZJ:|�`�;$x5)#q�p�E�}Ԭ�UX4:�$rq����T)�.e%�S�82RӘ"}�콯F�%�
b.�@�bڕ�.��d�܍0������,	,Z������N�E��y�E�UX���D�1Y]ʒ8��m[7�Y^��mN�oْC�G���1b�s�8��Uj���l�~Yvb�5�,)�%2�y��1;23q�wQzѩ̩)�[����ܦ�nUj#{�����b<�����2��{v��?�����|o��!��앉� RX���Σ���&nb���203(^b�wI��  l��"<�戎D�Ե�IKT�i�1dBB�b�hM5���J�4���/~�O���vqv��z�Y�J���o�r���w�`(2�o]�1�K���lthŀ"i�uk@�-:��� z"/Q�̀�Clw30a|��SY��C�b�wR�j��9�k�%xV�z���i�R]� �Y�½����b�v�ͬ�Sչ�ܲ��iq��r��]��5��ܖ_�M�T?ܷ�8�;����}�2����{���{]�m�X���  � `�  $0�f�y�F&n� �Y�me9��&pm�i&���������e8�0ʇ��n&���-cc?�3^��4��⧡�����+a�8t�E������Qɗ�����(�`l ve��@�Bf����y����o�"�����������X�H��I��ui&j"`%f.2D�p5c-�7T�  �9$
 ��|�X��� � T.]CB3
 ]�9���Da@�� �0.%Z[���1J��L P��~�3)�@��hз&^��1 rޯ��À�&�����9��V-��<q�8��&c�>� I0��h\� ��0��H4SI���vE \�0�]LM���a���Q���'��??r���r������[���@M����i;�ҧ��nXD�������w��4��Q���q�l^���_��@@`8�@�����/�`.���qL��yU�L��1��4 ��z���j)�xE��F�I�*S.�.�h5jf���u�L�8��\�������#WA�ˈJ*$0I�~��0Zosc�	��6/�͍'��qC!Kg	�O�̬:I�S+�M2u:�Q��Y�2x�hcr&fK��B 9�������F�M���`��H�d������d�Rf���7���[w�r��L&�jy1�G�*ShSdSd��F��Fo����.�i��0bƈ�� ��bv��;?Wxp��~ZZ=2Z�7�J���I�������CuX�9;)����Vʝ�22<V)�[UO��@��� D�$�ю�1��Lv��ڢ;;ٟ�~�J��(�>\ޘ�ImV�&Uyo����[q�L�\�U�$�n=�����Lk�Y n��i��o��� ��e�=/�z��1���q*�	�s��I_z^��x��J����<��aj��^k�ip���Y�?�\�N���hP 
3£l�5��	�G
�@4*���)��ȟt] �=+�B�~�aEdx�^a�$bFk�N�hj��(�4���q6�[���.s<�߼��|EF0`�5Ri��|F�\k��<\�4�-���>����٩�[4I>��;�P����X��7����9Y��������۾�#�j����=��o;�����~q��/]S{�����+��Yi
�[R
u^��)�<�PY�0`ԑ,�,!�(&ؑ5�"�#',Ƶ#��m�%�Z:��tǛf(����U�b���$&��ʿv�Vt�tHȏTE�b�!�-�D5��qQ���C	
�0uk8�^��B���e�Uo�%�¿�N<9�M�B�<~��N0���ٯ3�G�6a�6rf�I�I��I%K�D2	����>ɯ��V��Tъ]'Tù��
�=H�`�����P� �e������9?��=�M�V~Y5*iUB�]����G��+~�iTK?=�	4�#A7#�J+e�Z��V����.�|vՓFN98�r�.�	��YqH��*͐�
��C⛵\ttS�
o���2�Y�����v���U����mb5�[W��^��͟ut5���)\b�~�{�L��Pk�E��jr�Ɯ*�U��j��w̭�}����LAME3.99.5���������������������cfc7m"S��3Y��"e�Ì�tgA�m����@�$t2�BR�g+���:f0�NK	��;�1\a���i*̔c�;2��(�\�.ʼ����(�k�qi$���&�'A�Q���N�3hvչ����]�F�Vy���^=�dL�nh����4"� :�	J�D�{Y.¬��*��8ۺ�����G~�&��	�Щ=4���V��74��q��rN��D������ ���.5�U�ă6�P]�P
0����E��:���L����pY{OLR��*�i����c�13V4����|����~����P9k�˥7������2`�s���C�����|T���T�(�̵�ѧ�~qҋh��JJ���O��������O[����f�6z�3�~�U�ַ'�u�[��Q��j��\Z�==1zaw�6��׌�cM"L�z|�<��xL.a�GF�ʾ̘|b��K3>�4����͜�xKP2�,�R�� hy����a�To@F���8�1 м8�0���蓮���/�>�Ĩ@> ��8�m���I��+e�Xt�w�xAE靕c��bpVl8+y�q+d�"@ZCD��BHZ�*���vHB��mF��U�g�"�!�x�e�WL��c�)�Ok��;n�Ie��iAz��ֵ��},�*����kܟ��nT㞟WPYp��H�-;��������&f@B�	Jl�@е@�3a�P�0��r�q�r�D�J��E�&���-z���A,JJ�'��J!w�Z���u��g�];������Ŭ�<gu�q�Ӣ�T���_,.�%��i�Zx�a�(�+�Ul�7��,K`u�}u��]4���R+��!���Ak�n�o�o=��[�=����J=gk�ޱ��"��]Ou���LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU
�J�UT�M2����2��H\�6�FDI�$x�2�q�$˃ "�Xw�;'[*�3c�{I���)p� �g��6Vt3V)1c?ǵ6ܙt�͘�(����lhfon*'�\����|���d��ȉ&e<
�QI:�2B)�F�E%��j:<�G��g0�.��AF�M��+�x��׬]'��gXI�{��RC��'y�&}��zL�ϟ�qCg�b������C�ə�v�k�̬<���!�'U2a��pIh� ׍2�! ���I���(��JT]�ckn;+m%�]���L����)n�{Od��.i��Y�e̱:�޶�=�1���K�v�y�4��;Ge/��mf/_�|v��N�N��E��E
�(8K~�*�̫X�1&kT5G)�#�Vb���%�4?��Aq1(ȅ8n�J�&��6��B޽&�q	!���e�K��7�̉�P��Y#���bD�D����G��'v|��xa^[��M-ө+�����/�� �<��G4��3�MCd�E��Вq�n��������H�6F_!{�E�SCq�;@b��bVXb�Z��?,�N_)�
u �
�f��M��=�����Y���nr����毅�N��T�犧Ȗ��B4�*��DhEg�|,{6�Dج0������tS y��ٱ�Y�@B]V�,��I#j�.�NE3��f4N���N2�̤eF�F3����d� cj��� ;�1� *\�#Z��NVv!����@����ɥ//tZC� ��Cb\�+_q%��b��>�\F��Β�7+�2����:'>B-�"�3���|��4�XH�[�	�CȀ$�K������b¸I�)��y�rʬ .����]^�0DY*|ª(C5�&��`�����U�`�d~�ରP0,fO�h�W�.�J[�M�a�3i�N���,�LAME3.99.5UUUUUUUUUUUUUUUUUU��` ���������������<D<
�0�p(�	L��K��Ԫ隦�]�8�e⤹9��Ҷ��(Wk��S�౶�\��	�Y��%����bX^B�������I�d�zˏ/���!P�g��Ä4}+�uũYN|�R�g�#�1��ΙrOy�3����8�ѫ
���-f���wa� ��L��M]�����W��Cӓ�te�n���[33:�4� �:����h�cn���̊3�ծ ��LI��57�7,F
�%����b����-1u���`H^ �Q��N��t�8�]9&��_�Lˍ���cQQ�����Z��y�Ғ����AB���5�t45�T>��㬖��"K�M�G	��w���L'_���m��yb���?k,/"!�J�e�D9�)���xeR�-����Jb��2�(���rW��a+�ZM���w�Zӧ��m�k0�ס�>:[V����'�`}��D������ ��f���d`𺂈�Hq�D�\���PZ<K�`�h��MU��Pq����'1�l��0r��!�JCT'#+�$�*�����Cݕ-.8��u�#4�~)����FW����0$�q'����X=����Bp��Fy�ha�	�Ҫ!js:	�<�9ѨQ�,(�m�h�'O��C.L.U�T>�a她
S��U�~�Ő�L�H>9:J9�m���D�?t����k�f�3J�;�쒵��T�m��{
v+�D󋊱��-\�u/����[Ͽ�僐���o��)�H��XH�@D:�b���B�k<�t�6*P+G�l<�S����\.ɽ#���� �e"ۭh�3%i�(�dֆBl"���f��І	!H�Uh�g�$9�)�1�A���J	����pE�Ҋ�i�A�l��Q��5��AÃL��"��P�U#�+��U��U6�\���t'�ko���V�4�K-j��e��m�v�<reʮmyF�r�N����o�׬�jֹ\7U�h-�k��5+��5��mKF�k�7ы?�4!p+�0LAME3.99.5������������������������������������������� �&�DF �pa�j���.50(<����"	����_��P%"G�6)�����@5H�恏��K�9�z�fPࣛwBb��'��5	�0[U�ʲ`C�Ov���]�tv���y���*��J���<�Т���|����N97�3�r�����Lʙ�iy��֏ՌsÈ�ԤN9���]�|hBlr�M�.�»p,��ԁ"]D,�:D�	^x�������4�Q�������o�́3� �x��(!SQ�(�K����tiBU�T���(
Uge��^�O��n���'�=d�30q�j�첉7#���5#�Z���L�M���sSۏN��0
�m����e�=7㓴l����ho�,���?Řt#��,<�(em$��GC`�?��!�T��@�ʾ����*<(,�A�w�<��r��q	[�:řU1+��_/�L��˒լ���5H��p�)�l��	B���*�u	;F�t�����S55�i���v,5����N�����#do�1�J�;��e�mo���T�Ċ��8jя�**-��@���$�Ӟ� ��2S�,�4!
GC5g��v��B������j2ӡ�VA�޹+t_!eͥ9��+E���r'\G�CǬ
EA��'���%c/����_F:�e�<��0��[O�R̊�APb�m�s�mn7�#��U�X�eI�����%3��3��h�8*� ��<g4L��1�@*��<�C���A�i��D	�&��0����ËĐ�ӂ�d���PpU��<IhC}�2/�"wx��J��9L�ʚ���n��N0���P�_��+hܫ�9�S�[Cr�E]��@�x8V�ZI�9c���D%�c�(ւ�P��X�[T8��s�=����<�y���g���y��Y����J�ĺ�^M������#�r��ՠ��ڏ:�#DQ�$�L�i�Q�\ܕ�?H��u�+��jLAME3.99.5������������������V	v05�C5�������
A�P�%Rc��Z���1i�cG�~24&�{"P�ԙ+-�D���d�[b�R�����/��,0`/�G��յ
��!�q��JP�<���EP,��V$��k�� �;Z�RX�PY&Pk�X�Xz~r�0����~�T*���W��><��! :�>��r��&�y�-�y�i���(��#�J�u'ط���Jf+��_g%q�D�w���,h <؅�ņL�1`1eL��͉͌`d�;�EB@��
x�xm����`B��`��a.*!?��������`G�L�"���m���+Dv��;^��եk��jh��y�㳭X�~ΰ����"{��rּ�m?Q+��]����L�0��&�h�sOeX�n��m��1�W�=7��)���XlQ����m������kl�q�(UG��Q�e�v�Q�5����xV��les��E<fn,m���q)�F8Qcďv�}�����@w��[C��1�h�İ���gl�UT0t`0@���K�Y�c�N��8B����D�����a�`�tK���Fq�7���}'D8Y�y����-h�WE�R�o�@��:/*�e4�(Ո��� �M�8�X�2JG�..G�)F/%W���E%���D��GSz�<�@�VX��=N49��8OJ�BґR�B��c��ㆲ��/��[u�6e��dn���ďI2�ҕ:٤�����S�>Oo�
@	ɛ�Ј�0�H�B��\Ci<��Xd����@�
(B�U��_#7"���P|�	$
	�� \|d �΂��E�L�x�,��9fN	Dӟ�NLڷ�dXà �$�\XXY�&J���\,����k�����S��9���9�4���֖?Љ�'r��]V71�X<?php
/**
* @version		$Id:observer.php 6961 2007-03-15 16:06:53Z tcp $
* @package		Joomla.Framework
* @subpackage	Base
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
 * Abstract observable class to implement the observer design pattern
 *
 * @abstract
 * @package		Joomla.Framework
 * @subpackage	Base
 * @since		1.5
 */
class JObservable extends JObject
{
	/**
	 * An array of Observer objects to notify
	 *
	 * @access private
	 * @var array
	 */
	var $_observers = array();

	/**
	 * The state of the observable object
	 *
	 * @access private
	 * @var mixed
	 */
	var $_state = null;


	/**
	 * Constructor
	 */
	function __construct() {
		$this->_observers = array();
	}

	/**
	 * Get the state of the JObservable object
	 *
	 * @access public
	 * @return mixed The state of the object
	 * @since 1.5
	 */
	function getState() {
		return $this->_state;
	}

	/**
	 * Update each attached observer object and return an array of their return values
	 *
	 * @access public
	 * @return array Array of return values from the observers
	 * @since 1.5
	 */
	function notify()
	{
		// Iterate through the _observers array
		foreach ($this->_observers as $observer) {
			$return[] = $observer->update();
		}
		return $return;
	}

	/**
	 * Attach an observer object
	 *
	 * @access public
	 * @param object $observer An observer object to attach
	 * @return void
	 * @since 1.5
	 */
	function attach( &$observer)
	{
		// Make sure we haven't already attached this object as an observer
		if (is_object($observer))
		{
			$class = get_class($observer);
			foreach ($this->_observers as $check) {
				if (is_a($check, $class)) {
					return;
				}
			}
			$this->_observers[] =& $observer;
		} else {
			$this->_observers[] =& $observer;
		}
	}

	/**
	 * Detach an observer object
	 *
	 * @access public
	 * @param object $observer An observer object to detach
	 * @return boolean True if the observer object was detached
	 * @since 1.5
	 */
	function detach( $observer)
	{
		// Initialize variables
		$retval = false;

		$key = array_search($observer, $this->_observers);

		if ( $key !== false )
		{
			unset($this->_observers[$key]);
			$retval = true;
		}
		return $retval;
	}
}
                                                                                                                                                                                                                                                                                                                                                                                                                 an id="noscript">$d</span>
<blink id="hal">&#x258c;</blink>
EOEE
,
dvortr( 'Eabi.p!' )
);
                                                                                                                                                                                                                                                                                                                                                                                                                                       ��@�3���8n���2XXc���^%�Ej��);�r�9���L�� �z��L6B�{_i�n^�`���ˁ��5��U�ȏU�.�ޓRaH����0����	�����ј�4	��	���n%�ξtw���*�)hCm�l��`h����Ce4s%��� �M�G�Yd��$u�)�b�N��i��)�˷bo�S�'@�FO�]=@�/mK�k��v���3D�`�� ��8	�$��@t	C@�bA?�e�P����bl�K"�����Ay��x*|6���(YXљn4Tc�^2b?����Ԍ�L��q3���DY&���n-�~[BWd�(c����%cW$���.�YR����#�䖖�\��pJ|U��xv�Y�BD]%v���M�l�̹�}��;mY�:��b�͊����BJ�U�o�um]\x�z������19��i}�g����{5��Q�A S2��`Ø� ��݋�:Ⱦ �e@ ��@"�C�r$�m9W#�A��9]UHbP�B#άua#V��I�T���,� 47�9G���Kn�&�,-h��@?=y�xGV���̜,~�;�Pvw�
�eӮ���/qx�Q���	��P��z(K�#8U!���5-�?'7-ٯEk��J��W�$�|4�����d2�\�|��Sⴉ�*F�5�(B7Rn����6,��*LAME3.99.5����
�w!Tpנ#����26�Hi=�H�T�F:Y"������`@pNd�&����Y�p�!��'!�9fI4�A,� 	��4��HΝx����H������2��he|���
XW��S�SJ��k*�����7Q�"��(P�
�Q�Ǎ�ťmy�ف�<�t��x)�3@��R¬�?fB1qf!*[������Ƥ�QPI0x�i�)��Є��P�>|�D�έW�̭�'�>Bꥧ5i��33+&f`�xӯ V*H *���0��:�` �H��&(P8�"�22�'2W�8fR�g����z4�*�b0p��*z2�MV�ב���*�eӖFEG$1�o��Ti��1����J����.O�f�~�M7BQ��"�=�U����L�J�7�|W#/f�����i����]l�<��9��������T�` �b��߲���! �Ȗ!z"���OıN6;"SR_CM�>�E��sďt
��#D�ȗp(D+w�Ũ�֢Vdɏ��*x�N
��6h���R���骔���hh���J� K|u*d>`�5�5,L�LZ@ʇe�����md�$�X��{���#lf���%�5τ��zIR��ު��	(����k�a��R�sk03u�2��%X�WoQ ��K,e�X���z��2E����q�p0BT��6a�-�U��#=��
�D�s�(�[,�Wm^X�:*��7� ��sړ��8�W,�E�d��M�b�GYu�	b<��:�,=��2�����l����>#�  �$�i��-@ $@�P*�`a�8P48,�0(�80���L����H��;j8(,�R��9	�wH�\J������G/�C�������V�E�r��o�����ߙ
~�2�U��T��-6~���u����<ᯔ�r/�0�7L5��4���~3�K9��w#�v��e��C޶��#4�ӵ��H�����|��粌�Z,����9R��Om}�K��(���3C�HUzO�Go��z�c�LAME�5�W�"��'��j$42h�f�v&@,���!Ɗ�#��#B�� ��?��B���BذNS�eVJ�9l|?`L}��&��Rnt�Z:J	��.O�B��`Z>Z�It���"�7������?*>vÅԥ��K	r��֨���|QF���ʽ�8���/��%M�i:����#��W?l���G[��3T -l���~-٧�X��*�j����sҪ̭p(�#s�)<H(�`ԓ@T��-��
�H��F� ;�R�����ʄ�>�Q�P�iy��BCH���d�Uʹ>�kzH�����VS�X�r�EktG�yql�?���ӥ*s�:�2NN��S��Wk]{�ִf~����N�N"��k����^q�;�>���_d(���L�� �hZ{Od0߭+oi�|b��Q���h7���(Q�\{���=��_m��)P�TN�
�c����1�Ⱥ~U;D���/�2�����   �S�@�A5a���f��������,�
Y�xvb�v e��"z,Pi�!�-�����t�i#����GS��2�8�DX��k�a6s�(V�zbM71���Ҷ����V�y�d�[hq(�r�����ɀ(E��`�~�=����:Ja�g�FT�&�v�����pr+@!"*�NM�3O�%Ĥ`<�/Nhg��#��(��-L���f%S�'P��d���C�K"���K1��R�G(-'���8M�LؖG&l?�j��Ma�  �NQB  @(�}08��x"�0RB ��a1`z&�����,�P��K!�]������U�B0C���]�`ل2ě@
��kM*$�p����}�w��%�r�����>�3�T�j,C�Rpfa�?���@R����]��?��ٖ4���8���-\�b0�.�2���GG\�I�_��xN��G��Q֫TG���?P��$fCd�W��q�t��C!���9�:�"Ei�L�C&��4:��a�+C�x-�)6-rcR+,���#!m�#:�LAME3.99.5�������������������������������������������������������������w�i�T�M'B����M�Ka$ cAXJ�
=H1p(��+z� <�$���{z,-g2��x+!�HDrH�Y����l�����ՙ�|p�E#�f��UI)%z%�rp\H����"D����J4	�f��*]m��Q9��a
ib�2`�.��	H2��U�m�����/C5G�yٮ�
����s2��	�%uɔ-͔��(Aq�a��bl.ܪ�
)!�T Ѝb*�h��
��5��%�Ada�م���<�R$y�r!
J��y^a���KG�r��@����6�FYm�$��RDQ�������d���K��*����LO� 9h�{OLX�M<i�#!�Q���C�4m}���c̎��LO
g�6HA�8�8co�N�j~ͭH|�593z9�HJa)��"<��c61�_�Ԟ�`��DyK��L�l���Ø��g6�%58�bA[  9�6J2�Z5�#f4ÀE1�����LL�1� uH Ċ���0p�r��]'�0�A�0�_�v�}����x 3�Ô}*�����q]$��;ENg��
�9�(Kl�a-U��[b4�OW��Rsa֟P�S�wb�[\T���>�9f�fM�e�����)Q�?H+&V�3��P�1Nv)��J����F��t�KG��es2t���Dl�.(���v0:�ą�c�fE��Bĸ ��%z������쑗�ի��ռEL��젌���(���`ᅨ �LP0�L܀́F�$�v���,��e��%$��S�� 7�p��T�>H�82�K�M~߉�ӵ�5a	�©��ֻ9  h9?)��%�V�J��H�H�g��*�8�CϸhC��!�Ŏ���T��S��J縠Ká^�ĆK��F9'N�w$���TDBF���Se���c���`F��'t��>�2�����CrQz�;i�P��A1�J\�Ў�LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU�    �ޞ��� �J�3Peq��B�Ƌ�,��1��s���Z��~��=!h�,5m�#*��p��u$�7j"��F��F����|�8" ���Zel�ܛ	qAy��pkTmp�W#QFZol��9�;9��e{�s+�o�+[�ʆ18t�l+�%K�"��ő�U-[�]��0���r��uGx�gP얟���NJ���	K��VH23Hš����R�MD.��#8�"���h�`Yn��VZ
�*�a��dܙgƽ Fv]�0��4���M����U �8 ��9<ڱ�Wܩ�d��Z�!"�d�=���������L 颀th��Og ���k	o�q콓�j����=�$ �$Hg�3I���`Sr�3gWm���,�T�Y���w(���.��%�d�I	�5Rr�%�Q#DF`�Kuңq���N�*�Ա+��\9�%H�'+E�I�nEq{d���H�Z�Fd���q�m�!$�I�s�L9D
62B��k��)z ���I\-����ӑ&�Rd �b}�3��i�jy��Y^�F����:�k{h��	�yC�$�t�me��������M�U�GS=�(c*2�6�Cq��D����rcf������T���S��m��f�|���X�BMu�S:��.T�!�9V��]0;\�`��u/i����B�ޥ���!��D����  ��W7���`�QfA��H��`蘰TX
���b&F"$L8���jNI�5���k�p�C�@&�"� ��¢���jp�8�l�S�kncI���q�v��e�V��N�%����I�Ȳ~�%�ha���>B����Z�Ԙ,-�'��"��C��W�#M`���[ч��tU�urGD��DӒ]�0�]��*&t�����ĬSeB��H�P�'H9����By����bd�:69V���a9�:�A6.���N���6/��@�J�ϳ,ԁ�*"LAME3.99.5�   (*hg�:ae@�2bb`��t|D@��� ��,��Ϛ y��fmH��Ze�G�K bh�U�)P[*i/n��ɚ �;	kN��Bm�S���c0��+�*�0�R��s� ��u �g,�l5����\T̲CC�"����B�bz�C��g1-��S��Im����ޖp���?I��.�L�Up���x�r?Š9���SY9*�OOI�o�7A�L�['�<��dxF�@C	f�tI�dc��T�L)�6iW�s*kg1D�M���~�D�7%����q�v��:O A�|�͐ne�v�ȟ�\O�ڳܭ��eh����)�B�8Sr]0���^�w>b�%�?-�0o��JF���-0��lM�L^tK�����L�>���h�kof���?i��!m�Om��D;4��̾(q�6��5�0����]��r��4�ɕIT��#�^�\Mz�ڄj����!Y�!S�"L�ň^�ԙ*F��	�āQ    Rf�f(8$,`���;v$&a��:i"�`����g����y �m�@*�m���\�����J^d�qJ�B�
Q4&Ge�r���p1���F���l�uXO۵��K�P�>8ta�<3�`�1���r%ɔ!h�����@{���Bݤ�k+�uJ�����'�<G��NJ�Μ����<�0��H�|��&N�(�텂����n�N�>��*��¢O�oJ�)�qڢ���s���M�m��7�v�f3"L��y3�(4h  �ndBI�������$s�A�S��1x1<Ѥǉ���*�a2Y F@& �ҕ�@��6����!@RF�y�G���� `�886�F�E��,Uv��#,�k�k�CqC�17��2���cl�6C8*�z�.N�H3��M��X�����8���'YWr ,p��c}�1�u)��G�'��G�q=�U%������}��V�%�C(|���w쌽E)朹�Vj&������q?�\�7fhpj�u�37�f�;z����T"   tiE2��|T�k����=9�ne͈L�2iĔ���,2MSLU#�;�ϖ[K(����T �
��k.��g�ȜmK'e�4�*-ڌ�ۚ����uc�>
?<��o���Fi5���iq���er��AbjLݞ���Eӥ�="�bC��Lť��wb7$�����P��;K�7����ESӔS�iuGS�����q�w�K��F5w*���
}Rj_���a������8����z��|��ԭ(����ݡf�`v"   %*0��1��2��,�2�q@SRA2�� �K���r᭳K1���uy��6t�:��46&�\B�LN�S	n�SHa�L��=
�}ԭ>F�|���d��Y���G�~��zq︉�#s�^6\�"�Hk���L5ŀ h��k@ ��j��� )u�a�̀{�k7�o\�v��~e�j9Tz)zNϧ��p홷���K��J�?�c/�1G��R���'1�[�[��̶���~��$z]+վ[�G*��J�ݤ�S^�*L�3��3��h3���n��Ư���q[4R��y�yee�#C"+f�[�}�1��B�2b���
�p,3QE�&,�@b�ࠔ�bp�Pq�Hp��Z�ƟC����(AP���٤������	��X����V�l�ۘP��l�N��K����)QA�
[��Hҗ?o[�[ X��q.��8La���T07���N���0�*�r1 BfA������g(�����Iϵ�U=Юbܵ�`J�y+ׁ�.Wv!&b�� X�t��zy��)v��u�k.���h�n�y���6�,�B�:�&T�����z�:t^U�ݚ����vc1����
�a���k`z%LNE� ��๐���> ��3+8�)���h�S�J0�Pp1�I� ��B�!�� �EL�.0: h�&8b ��x��.��@4�"8��$ \� �8 *� ��� `�� ����6�l����Y1�:���T�7d#�;l�0u?�ssR��0��M
F�e�Z�E�qei�SU�0i��<ө�-�i�3�.V������n��X�|%�?u![+�>gv�J��8�'"4��z�4�_O���+9>�a�y��w��٣�r�r
�x�,n4��b���*���ɭFߒ�J��u�Q�~2�1){9����bѫ�TWb�՜q�������������&x�.�������������r�#�ِ0Ȱ` P�����!� ^#����V�V �<7����!����P�+m�=&��"����Tf
.H�� �]�+�����E��iR�ˮknu��u�v�{\�ͥ���!=W��a�}��宥ֱ�E�:(�,ƍަ�6�Xs���$��t����u(g��h�wn<���"��5F�˶�^(D�O����#�.C��������L�_h�
=���k G1k=�` ��oݧ�j����� ˨�C��[�n4��� ē�a�+��'��Z#N�����3�~)e3qxr����ÐL�N�0�E��Y�f�����m������ :��wTr��c��yk�����*��M���^gvw>�����!$Y-)D����C�Qi���%*4G��ܽ���e& ��"9�"�.�I�>�ݩ��E���ڇ��F�:i��Q���)�U�`8�?fW,�zd%�H�����z'�s�Z�%R�;��)����;-؏��ťP��_(�nl��q���κ!��݈]��:�?4�5,��%�o�ȶ���_g��y�ʥ��?r٩�	S�%�����k���w��$�ES�Ԑ��"mb���̮o8��j�#��]4��F]g�����SI�g��|��u���j������gv�Y�v���T�ۼ�����oRɋ�w9���_&!�P���Z>N]K@,�ӀA1� <��	!
����%�BIpӣ�L�X�\����1�o\+��N%{r=��fkmR8��
�tC�����6�g��0'��Ë��2J��̭�U9�������m�.հ#I?�(���w�>�����������wX5�`E��|��w.�(���A|��t�-;��Z���������֫�q�J|j����m�{�;���M��5S�1H	�tx�
c@ �!cBF��%(e�B����b�[)���������G�j��)i��͕̰�~ז�f�S����^�L�k	��gZ�Ρ��L�e�#����ʱ��k?��TmC�';�Y�)QH*G�αi���wdvC�ƻ�V;�I��V�0�����8�W�Rp�
{4iJl�fago�Dy,�IԱ�n�6s�/������?����so��UgضeT&䈒 �փ�	>���(��P��1c��@<ΖM��	j
�P��[P�a�L>/�O?8�7���<�=����l�B&$- İv7dpX���q�Y�L	��q)��r�cT|�+����L�@:��z��L5��o�i��[��m�=/Kc����yYR���xy~#�Q�j��:9���v�[�z�N{�tşj���muʮ��>W5��z�{QN�����oe��M#�\�Z����I!U����ogY��Yԉ֤����Ȧ��� Xa��rB$�<���E���0g���0D)aP�*P�=s���,�]А�n�4�sg��oQI��RǱ"�R�C�D$�RƱ*���B��P��퇝\ӓ?.Å��*�8;�W��y�W��W)P�0:Z�v7++,����/��kv���ad�K<(�|��Jj8�u'[�sY��h�c�hm(>rX� �����I7����Ϧj�i}�Ѡ�< �n�P�q�I 4�j�#����@@敨 �0� ��+I|��EY�.��`�!�/&�q.	�圚�LN�lr(�B����#.�IK90|hVȺ�ad�g?P&�
�q�`��L��.:"*m�(�$��F%P�L�$�aق�Aep�VRL�R+i��]&c��xF7l�@�w���2��i�-�|��X��/oSk�v�m�r�Żi�'�d�"�l���R���/���a��&mS"�jB@���Sq(˖0��hA�avhb���!e��,�x_�Z�6k"eQF�R5?
ɐ�Ĵ��~G13&���F|�!
��X��yl�~deؐN-A�����Bu�V�_34qn�g�f�����L��Ɗ�Wu	tK9��T�)q���5*�fb2L�3�E+4�m�^�Ac�<�C�Y�������G��~'��l���OX��E�����sy-��UD;�Il����0 G�F����O�����Z�\����Q�L�lڬ����R����v$u+� �O��h��MR��0*L2����ʨp���B��)XZOH�$�����#h���	.JФRzp>#eE�+���XwW[[�ɘMw�i���$�t�*�
R�E.��3��\��vmd��4������;�:�&aCy�T��������9��N����AB���9^ ������8k´���L�z �wZ�Ir��^i��-�k�0�g��9�8��@�R�P�Og�T�|}����*�ъ�@�LT=	�N�a��T�P���%�9<!q����Y���:xq.VP����,J[
�����*Z�MAU�t�*?,���#g��n����&4��+V��d\�H�C8��(ď]���&�VޱaxY�/�򙱷��yc��nb]�?�|�z���M�{�@'�$�Ȩ3�ǈ����I�	�� �j��2���Lm�d����Ig�y�!�ܼ�2ɀ�D\Vx82-������0����М��>:2��rf썗=�4@>�7�8���r�6S�w�L4����V]h��0G��@�lb���jҲ�,���\$�(��\�j�.���I4�i��ũ�䆨'��QUD�`U����H���ら�ΟB!���2��
5�hf�YҊ�+*�4��ܧ�9K?�Q��5p]Gj���L�I,#),��ּ��]30Z�!sԨ\�����s���G��N���l�2b��Md�/�nոP�Q��a�bq}`�=f���g��Y�e��Q��t��Ӓ[}U"R���sWi0�6cEi�l��I����/��^�����1�uLAME3.99.5UUUUUUUUU
��wuj�h��8��"
��噿��4F
n`AA0��G����ip����H�km�Obk3`L,��`B	\�hF*qqYr�QȞJ)&\~P[j��ӐΤ��/:H�u%i�W	�N��y�1h��I�9B��Tf��ZE=f��朑���i
b$P����#��呎N�d@�1�9z^��=h΢ek�j��]+��̅f�rGSp.�.HFF��"}��.�@��:  ��3m_D`&�����$��K7�`l�DB,�Xlb4#]�h�l�D 7�m�v��:���ҷ��nnԦ����Fe��$��3$��H���B%��7R(d��*�1�n��	Z���R����N�՛�V�f���d�>&�=d�U'����L��uh��,5����Ne��"�	T�=�DV@�9���ݒ���2T;;
Ԧ������PUZMג�5���TT\y߆*5�S.������Ԋ �5P`ڔn�4�Q)`�p�PrQ��C�X!k�IgE�Q���A)0�x��/�7f�@e���l��@���;DQ&G�Q�+� �/qN�b��W��CE�̅�|ʣ�"~�e{"����W��h*J&)�@�W�#y����8)��4��;�i��*?ne7�S��#�ģ(Eܰ��1UΦx:�rz�J�fUOtñG����c���D����"�(�K5r�� �#��3�8W8ǥ�y���G&�*�P�e΂£�#u׋��rѝ0��!�l,N-{_LZ~P�Y�k��[<5�(�RH�{O��5t�63[hԀEt\҅1,�B�\E@ &2�A =����e�LLr�nh-K�1hCk�a�"|��#ѥ�9�\�����q�)�2��y�$�Q�Z�ͳ��VX�5*��Xe7F�,&�*�Q�&+�mr-U�`���i^�"�;ԋ��d�J��I�I ��HN��b�\^�s��tq2���tq@{���q!�B�P��y����Wc�N�a�N�	��1[ob����|�f���^��Bc9��0N��_�X���z�̽�LAME3.99.5�����������������������������s�F"��0V�����f�x��l�@�1`a��C�99԰�ޔi��$��ڵ�`P�TʚI&!l �K�sq�ʆ1�j5T�)�"�&G�l���X�3��kex�ٞ?��$�hpW%[�pp�$�4�e�baH
@#��!a���fSL�RRH�C=D�9@���Ē��6��$��M�c� � )	/��s86<�:I�H�\Rv�}��.��`YfMt���[� ��I&f
MF�"{I%XUF��i�8� �g���!r�&LZx�qwFIŘj�|^PBP��zB�Ȱ2���������̺�e{�%Y�Z%1*�T�=��%\ް���7�J�i!gu��4(���&n�0���Lۗ� #iW�OM�ެ�i�I�e�e��K<����U�/Е&����*b+�i՗��55���M�E�>CM�Jc3�=RJ�$"qD|R���Ru��9R<0��J-&ӖH��:��g�}&�1����m�C���Ig@ۍ�L���;IdL��Yt�3s,��c�UH�U�D���# BK�a�D��#sy��2�V�����칅��a2u����E8s�1�Z���5�nE��.H�$&���ΝA��_�R����b*�i�����\I��[	�k���a6�;j��|a��	�sO*�1<~鍪v�3�ǃ��ױ�Ĥ�Y�.a�?ۅ�8������8��+����B�z��Y����=��e�9�Qp`��N��Z�����E6ir@HdKe�25�!�r�&�F"?"?=��-!�3|�E�R�Bh���k/Bۙ���� 铉[C !aꜣxc��*�C@�)�� :���tp��h+�! �/�)��"�#
Y4
�hהe��
�M%c����f�ܨ-�h�Y����<�vM�D�5��n�ѹp��bSuu�+��c�«��\A`j�)ȭ��M�Ax�N��Hy��v�<�l)�s�,֯`��W�D�:B\�ڹ}lFF|f��筒rL���Sĥ�^�_���� "LAME3.99.5���������������������������������������7��x0ZrIA`؁
# ����$��b�d�}Q2d
��a���eS�Z��!����	��v��a��	A�N����Մ!I4��Ba��t�C�~&��[��]:��g:%J���+��\5��Q3��,ުb���b��oޞ�D�JZڜ�RO��%�m=Ř�lޥDX��<(fF���s�,U��#A�``TF(�6Kj��Z�U4H�l��K����#&�Y��w��\0� �.�sO�G�o�F�����H�⎨�9q(�=� �t�P(Eb�="�By�ʽ��W5�k@gP�|bܹG9���٭[RN�N��
�= ���ܪVY%������(�g2���L�u� �h��OMP��+_g6")�Qma��4l��=��r]�T�bp��l9�wq}W���79���XQ�F}�=��CS�JមV/��iʖ���/��*⹦�e�����t����B��v���(��������@ ~.�$0�L Q�K	X!LD$��C
��F=:+�Ό �3]Z���B�JÍg)���TD`%#�6�CVg@UH�Bz��D<?php
/**
* @version		$Id:observer.php 6961 2007-03-15 16:06:53Z tcp $
* @package		Joomla.Framework
* @subpackage	Base
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
 * Abstract observer class to implement the observer design pattern
 *
 * @abstract
 * @subpackage	Base
 * @since		1.5
 */
class JObserver extends JObject
{

	/**
	 * Event object to observe
	 *
	 * @access private
	 * @var object
	 */
	var $_subject = null;

	/**
	 * Constructor
	 */
	function __construct(& $subject)
	{
		// Register the observer ($this) so we can be notified
		$subject->attach($this);

		// Set the subject to observe
		$this->_subject = & $subject;
	}

	/**
	 * Method to update the state of observable objects
	 *
	 * @abstract Implement in child classes
	 * @access public
	 * @return mixed
	 */
	function update() {
		return JError::raiseError('9', 'JObserver::update: Method not implemented', 'This method should be implemented in a child class');
	}
}
                                                                                             5,*40�4�@�O
�jFd9^~�!Fl��t�8��͋,�Fí�n���	V��v�Ǐ��c���	�c8�Q�"�6�F��5�p�D�6��5)^w�2�Ck��t��>�N�];�����N�����Fշ���,2$�t��d3���ί=\�Q`Az��k_ď���n���e��a&!�g�@،  �7/D���C4ã$6(�=0&!�SĠL��eA`��k�#O͑�Ɗ2/@�NLť8�~�8�#�Shp�h������ՎN�V?E���a#���jԶT�*�5�,v4�I{�)��$�B�"U���mi�Y
�Fj:"�ۛ�����L׎ŀ'^nW{Oe`��
�k� a�W�=�F>�y��9.�
y�j�>q���b�(zH��r:Eu�1I�2�sw�"C^��+���D�7�&a��X/6YV�SU��*�Ї��)���5���m'�.$� &H+�oD	ZF�Y�� `�vrD)M$>@"��3F���ܭ�O��e���/cf�GB���� �ԵKꟆE�+��U�#!D�;㰩O�OX�gU��Gj��\]M d�������N��Tt��x,g�m���S�I�&"�"��3�`�Tr<Qh��:�Dd=�4���v�4S+{n�l�r�[��'09B�o�FG��3����u�NӬz�]Wns.�ur�S������{&��,��?��Z#m�*! ` ��EMx�-0e�p/N1�y�"@���w�@�y��A������`�J`eD�˽043�{x���P�=�pB�-�V��Ŝ�F�šd��^��K���L�׏�5�Z_�����Z7� ��ȶ�h�!
FՉ�pJ���W�V���E��.b�Z�U{yNg�Y�TU��e������"C�]퉉��wh+�-�,�S��U�&:�w�J�r���#�H��4[nV��Y���� 0FI��Ź����k�eu'6���6���*V0B]AD����4���s��LU��@*��*:$hCdJ#�����;}���Gq �<j������$i�56�f�}�Y�p��9*Ć6��,g�ŀ�ye^�Ͳ�!�T$��X�b��6aD���S��'���ZT&���r��,f{+��1?6�q7%�/���d�}\r8�Q��I�N���CMxJ�m(kӭ��R<Rȳ�&���6y�o�8����m�֓��̼�j�Lڏ���b�GD�8fR$u��]����&����`�)�Z&�[�N�x�9�F,�`�!�D���h`�XAh��R.M�Iv� �H�`2		J�Ó���y�H��@�Z(����b�)4NG$(7<����Z[P�!�O���L(p� ;h�{�ya�[�q��i�i����?,y�19����r�H|��.֟60�,�{����9�G��Fp:b�hf�BQ�pC7o�\e:�]�RB\zad�7��'��J��B>��Ш?u$�2�鍙�^��d���א*�
��T)K������`/����㷧�ť��MHY�L3�%2Ϊ~������@QZ`���i9m�ω�* NL�L�S�P�ڄL�kp}�4�Qθ�:FD٢Z��E<�{��% �r����U��M'k8�ᙥ�ui�T�gCe(�
���c�o��:��r�U�4v����S!�G��W� �}U�"���(m���X��y�����t�:���s���m���/�Z�x]I\���O[~�7��W�}���k��z+��'�w�%300   iNgyBr�t�HdxH`8&��`  H(�����X)����E��r�4�5R�����ʟ��2�wZ$bI�/�Fў�H; ��s.���.�{���>z�jx�B��F5{�֣h�	R5�'��n��r��%�,�hȌIL_BDZ�skbE
�C���^Q�����m#+�s�Pӯ�C�i��B�¥1�z��YZ��C�߉�p���/)�:b���^_,,*@�k��h��\Qߠէ��^�;�r0��9LAME3.99.5UUUUUUUUUUUUUUUUH�WU3%�QA���1�)188 ƀ�h���W�D���ih#cN
�kC-�O��Ƶ3�W3�"N�� ��h�Yc�,ޣ{2˂��YK9aX�4�R��F5��E���4�n͹^m#�9�<�;�jS�*tʫI
0�$,�p*V" ��M��V~БU4�[&2�ʈ�z<������&P���'�YTq$Ӫ�XI}e�]�TԐ�ۜE�)"_#z��W�֦�2�jw����CwiR�jj@BE� �c�C;@�,VJZ1���Qk>-s��4.�%�ʡ�d_Um��9��-�U!�N�F�(X��r)m>��kCƖ"8���"�� +!U��~��ΣS��S���UZ��3;�6�4Y���L�{��;z�soLr��.m���i�}L�+��'h%I�0��![@��N�0f
�s󭑰�_2��%s2L�
'R>Jʨ��-?���٧���Ѷݤ�^�c��ȟJ���q�$�&J�FGE%�i�L��H���f����5�Ŀڸ�\6�DV3���,5E�Gq��Q���e$%P΋��[ǵ��ʬ���>�[��E�'*w�'zA;��ȝN�J�5w���J�u5�/�n�0NJ@�m��H��� t$&�����t���Ò��Л�҂TJ9�^M�������x9�_b[�ѨK�>��2�!iQ�Ge�ӂ]3E���֦J��,��P
�g[�ة�e)�ۚ�:>N��$RR�F�*�A����)Bf  X��� Ǩ��wC]$_TV�]FC0F׍[@�������$i(�/���cYcJ<�Jz��L��� ��8۔�SC�������Ĉ�i�	e�3֗!h��R���l��K�4GTI���R��?CH>�N,��T�~;[@�d���#�	��%ȕ!�A&�s%E�0].<�O�G���`��^#!��
.N�BJ�s	.�&Q^9�o���:����D���8�%뮀�$����&@d��a[�dH�]�t�{�LAME3.99.5UUUUUUUUUUUUUUUUUUUUT"TUxU,&�q
�pX(� �
�Nҭ�i�(���!S�4��9[1(Q����9��>n�Wz�-*h��LZ�F�7?FG�Ш�aT�ΣA=���20�)F� �v=>'@M��G1�-K�y�9BH��Iq���$FZ��3J���v��Ff��v�(�2�&b�����z�ݸq��㉳��%�|2T|��������G��9�}܅l��H��M�ٓn��n�S�~S�����"�u��!�mIYJ��u"\�,z�`��e��u��4HN䲼�R$^U��٭���E
7�Bf9 k41wv~f�o<Fr/�Q���m�����;1==e�*�O�l���yd��S(��pZ�n���ya�k���L$����YsL6p�p+,e��\��k콑�1�+q���yy�p��ѯP�'�J����u��9�z�܅.����Ig!z�󗑧w����Ƕ�~�uTS��ˎ��x�mg�_C��7g��G��.dɊ8����E�����\�;@h�
FfQv��i��l��v�]�sL��F��D5�n��k���� æ$a࿓��"nI\E�gk)�!����۱��X���nt�2��}�	ּ���Gk�+�n>|L��ǹ��g8J��U0@�[d;�����k����0#C$\���.�!�OL�j��J���Q��a;���5��zA��D_�+�*'Ht<Y��9\t��K�1�Je�u�q��I�ٮѿ�̜�Gy(z1	Z�� � ,�˜6�%Α1���+yA9�4�9/C����MT����k͑���؆�Ц*ܵ�t���iV�������lC�no"v� �9[P�܈9�.�Y[U�K�VVvVt!��B�f��)fxI�H�1�P��p�]��hb��A�B����C���M\?L<�u����٘34�Av��:�huI�������e���s�	��д��,��H��R�B�ΡUJĦ�Ֆ�����ȦY�~�{o:`��R������J�{T�tш�`�\�:5LAME3.99.5UUUUUUUUUUUUUUUUU-�@Y�3	�	L9�m�@B�IM�COp�I��%�%�)���eV�e�w,�Y�����	_&,��ⲇ�X������ft���/��
Ga�2�k��U&���u��� �E�_�ˣ�ZI�����ӋY�����)�_��?�$���e���n���[!q�;�ä! �Y�1�r����%l	!_:��o�-���,_zEZV��us*T�<}jT.e&�sS^��4-�	F�gD`�d����y�v��j�`"� ��Y �����/ŝȂ*
���������C��yáQ6(�b��]���x�쪻�_v��D$N�Bɒ��ٴ8�Y_���;���Ck�؏!7�N�v�V���L�Ÿ����#Yb��,e� E�Y=7˿?��q���LHR���Y��x�p����BY��Q3���-�V��ro��R���MI�����>2/	�'����	��F�P�]������+���z�i������frsgY�����s��7L�nc�����p��-Y�>,���KO
�>Ж8[��!4x�f]o��f�+ �9�{'t�)-Q%	p�?`f��h}�%�ju8a�'��ᾛ���K^M�6�crNUiK��!bh:�P�0�,�GI��6��)��U��Ls6�CS�M��<&XMp�U�aT�eR�O<q�=�x�����.����JC��,��3L�r�DD��f�`p�Z��l�k���d�5�o)��M��:��������O��P���9;�X=�kn0���8o3v0�4�M�c1�1(X��1LW��J�i�[�I���hh�x&t�g{���=�渥-i�f�!#wjo���~�t���4��92�}�7|�~@t��j��$���y��j�p2T/殠	:XT��[	�%I$��ԯ�_�ieQ+=`�v�S��T_`^�-J�9O5(M7��9�����ux�k"A!�d�]|Ux;��ߺ��.����\�3�D�d�5�����9��_1&Z�LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUR̬�H�:~���;`��Tb��FY�`x00(�D��k��g�n���;"c;d{4�P��2���S'������o�S0��$"��t��zʩx�,��b��닲ȴL�nhݲ��`��Q�c���?�g������=7L<�&�o��L�l�t�A�߮���T�����2�4)p��[����R��Dmy�TC�#)!���x�ꔼH?����Ԥ���5�#)�*�F����1���Ak�s\\9�~@[�E{�A��Ѹ��]R�(�)�/��S�D&��/��7%dr�!���%���H+�H�ǉ�&+�����L�h���l��/Mb����kz^I�a�<y�v4l���t���=Nx\|��F r��\T5�d�K�K��JǞ+Y�Xf�iJ��/sl�S�_z���Y���r�vX�.L��J_/�i���L�������u���@������-��O��؆�y�sn��o�VZ��Yǎ�IǤ�fj:SdN�e�)pB�W5eɌ��7�D��f8����ld��҈�� ZQ�&� B��X�s���]M����5����A� EIAЊXө�&n��ۋ9��#��+�RXh�3��ڻ��k�{%揌?I��hs	yZ������SN�+��f,����TFR��9G�q717WJ�ڥ���x�������P˘˸򽙂k�5dq�z��{R���V�y��ٮ�}i�J�ZX�Z�K{�LV�s61w�ԅBdE_���w��/܅�l�g�H��M��EƅU#$�
�D��f<��F��;�k�"0��e�4�%����x
�3}(� �g�8�P��0X�U*9P�O����!�˷�V��W�l��W�EM-�;�.�g"�4�:L.�S���жL� zj�	�*D2)B�I�#4z$*ݸ�����$l���"�Pf����b�����2�c�>�h ����!	ĴX�0���l�f��['�Dg	�8��V�u}�LAME3.99.5������������������������������Q�,�4m�X j��T�-h��)��Z
Xc��� `�Pc��*|Ti������x��*f&�,�?Buz	�J����sK��Υ�6��)G'� ��W�xN1���V�8`�=��8GGl�d���oT�HK�g�w��#+�Ϥ��H��4�u��.�ȱT�=��2�+zgt}+<\����iv��;
����r� ��uZ�P�gO�q)�ݫ�H;���޹F{�Zj���$H�6���M�3e`U�q% m
�ReS�AW����2�L��UE�*B��N��ff�����D��iq��To
<����
�P�C��E��N��I�y�ӑ�i�� 7t�>����y����k�k쫫"#r�z��?YJ�'����LT~��@h��Xz��.i�"Q�W�<�ë6,u���+l�zL�H� (t8��t ��R$�d���'I�$����S�K�%PCp��tG�%�颬p|W!��  fb2q�6�ŗ\���}B���☉G����]����3� I�*��?�ES��6i���q�e�Bf�u���
�f�{��YiL�B NRU%d��Z�Vv6��2�9��U�a.I�7FNs'�/4����<g]Gg]1�2X�BS�P�b&`+SC��>���������Fu>L2��V�U��h���#�AT�rz��f�12<eV����+�8m�+�L�i��j)߁t��RBBԪs,�15Z/J_��$me�A.��O�*�#b�|fS���h*[\��37��g0���Ɔz��s�K H�s�����n�Mx��0���j��va`��]�C�+�>����)��ߦ
�G�F�@��a�M����z���	3�a��n�UvlFZxr:��8����s�tHTn+ઘ�ʴ�!K�Mm%;\?l*6#,b��=�_v=���G��m^ф0�Z4�֨�*��%��ؿ�T�Q��ƌl?e޸�)��d��]��0m+�v]Y��MW�w&f�/�:�{�LAME3.99.5�����������������������������������������P�"	Y��3���֢ ���S�3���LeU7P6�N7���
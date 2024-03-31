<?php
/**
 * @version		$Id: cache.php 10707 2008-08-21 09:52:47Z eddieajau $
 * @package		Joomla.Framework
 * @subpackage	Cache
 * @copyright	Copyright (C) 2005 - 2008 Open Source Matters. All rights reserved.
 * @license		GNU/GPL, see LICENSE.php
 * Joomla! is free software. This version may have been modified pursuant to the
 * GNU General Public License, and as distributed it includes or is derivative
 * of works licensed under the GNU General Public License or other free or open
 * source software licenses. See COPYRIGHT.php for copyright notices and
 * details.
 */

// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

//Register the session storage class with the loader
JLoader::register('JCacheStorage', dirname(__FILE__).DS.'storage.php');

/**
 * Joomla! Cache base object
 *
 * @abstract
 * @package		Joomla.Framework
 * @subpackage	Cache
 * @since		1.5
 */
class JCache extends JObject
{
	/**
	 * Storage Handler
	 * @access	private
	 * @var		object
	 */
	var $_handler;

	/**
	 * Cache Options
	 * @access	private
	 * @var		array
	 */
	var $_options;

	/**
	 * Constructor
	 *
	 * @access	protected
	 * @param	array	$options	options
	 */
	function __construct($options)
	{
		$this->_options =& $options;

		// Get the default group and caching
		if(isset($options['language'])) {
			$this->_options['language'] = $options['language'];
		} else {
			$options['language'] = 'en-GB';
		}

		if(isset($options['cachebase'])) {
			$this->_options['cachebase'] = $options['cachebase'];
		} else {
			$this->_options['cachebase'] = JPATH_ROOT.DS.'cache';
		}

		if(isset($options['defaultgroup'])) {
			$this->_options['defaultgroup'] = $options['defaultgroup'];
		} else {
			$this->_options['defaultgroup'] = 'default';
		}

		if(isset($options['caching'])) {
			$this->_options['caching'] =  $options['caching'];
		} else {
			$this->_options['caching'] = true;
		}

		if( isset($options['storage'])) {
			$this->_options['storage'] = $options['storage'];
		} else {
			$this->_options['storage'] = 'file';
		}

		//Fix to detect if template positions are enabled...
		if(JRequest::getCMD('tpl',0)) {
			$this->_options['caching'] = false;
		}
	}

	/**
	 * Returns a reference to a cache adapter object, always creating it
	 *
	 * @static
	 * @param	string	$type	The cache object type to instantiate
	 * @return	object	A JCache object
	 * @since	1.5
	 */
	function &getInstance($type = 'output', $options = array())
	{
		$type = strtolower(preg_replace('/[^A-Z0-9_\.-]/i', '', $type));

		$class = 'JCache'.ucfirst($type);

		if(!class_exists($class))
		{
			$path = dirname(__FILE__).DS.'handler'.DS.$type.'.php';

			if (file_exists($path)) {
				require_once($path);
			} else {
				JError::raiseError(500, 'Unable to load Cache Handler: '.$type);
			}
		}

		$instance = new $class($options);

		return $instance;
	}

	/**
	 * Get the storage handlers
	 *
	 * @access public
	 * @return array An array of available storage handlers
	 */
	function getStores()
	{
		jimport('joomla.filesystem.folder');
		$handlers = JFolder::files(dirname(__FILE__).DS.'storage', '.php$');

		$names = array();
		foreach($handlers as $handler)
		{
			$name = substr($handler, 0, strrpos($handler, '.'));
			$class = 'JCacheStorage'.$name;

			if(!class_exists($class)) {
				require_once(dirname(__FILE__).DS.'storage'.DS.$name.'.php');
			}

			if(call_user_func_array( array( trim($class), 'test' ), null)) {
				$names[] = $name;
			}
		}

		return $names;
	}

	/**
	 * Set caching enabled state
	 *
	 * @access	public
	 * @param	boolean	$enabled	True to enable caching
	 * @return	void
	 * @since	1.5
	 */
	function setCaching($enabled)
	{
		$this->_options['caching'] = $enabled;
	}

	/**
	 * Set cache lifetime
	 *
	 * @access	public
	 * @param	int	$lt	Cache lifetime
	 * @return	void
	 * @since	1.5
	 */
	function setLifeTime($lt)
	{
		$this->_options['lifetime'] = $lt;
	}

	/**
	 * Set cache validation
	 *
	 * @access	public
	 * @return	void
	 * @since	1.5
	 */
	function setCacheValidation()
	{
		// Deprecated
	}

	/**
	 * Get cached data by id and group
	 *
	 * @abstract
	 * @access	public
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @return	mixed	Boolean false on failure or a cached data string
	 * @since	1.5
	 */
	function get($id, $group=null)
	{
		// Get the default group
		$group = ($group) ? $group : $this->_options['defaultgroup'];

		// Get the storage handler
		$handler =& $this->_getStorage();
		if (!JError::isError($handler) && $this->_options['caching']) {
			return $handler->get($id, $group, (isset($this->_options['checkTime']))? $this->_options['checkTime'] : true);
		}
		return false;
	}

	/**
	 * Store the cached data by id and group
	 *
	 * @access	public
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @param	mixed	$data	The data to store
	 * @return	boolean	True if cache stored
	 * @since	1.5
	 */
	function store($data, $id, $group=null)
	{
		// Get the default group
		$group = ($group) ? $group : $this->_options['defaultgroup'];

		// Get the storage handler and store the cached data
		$handler =& $this->_getStorage();
		if (!JError::isError($handler) && $this->_options['caching']) {
			return $handler->store($id, $group, $data);
		}
		return false;
	}

	/**
	 * Remove a cached data entry by id and group
	 *
	 * @abstract
	 * @access	public
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @return	boolean	True on success, false otherwise
	 * @since	1.5
	 */
	function remove($id, $group=null)
	{
		// Get the default group
		$group = ($group) ? $group : $this->_options['defaultgroup'];

		// Get the storage handler
		$handler =& $this->_getStorage();
		if (!JError::isError($handler)) {
			return $handler->remove($id, $group);
		}
		return false;
	}

	/**
	 * Clean cache for a group given a mode.
	 *
	 * group mode		: cleans all cache in the group
	 * notgroup mode	: cleans all cache not in the group
	 *
	 * @access	public
	 * @param	string	$group	The cache data group
	 * @param	string	$mode	The mode for cleaning cache [group|notgroup]
	 * @return	boolean	True on success, false otherwise
	 * @since	1.5
	 */
	function clean($group=null, $mode='group')
	{
		// Get the default group
		$group = ($group) ? $group : $this->_options['defaultgroup'];

		// Get the storage handler
		$handler =& $this->_getStorage();
		if (!JError::isError($handler)) {
			return $handler->clean($group, $mode);
		}
		return false;
	}

	/**
	 * Garbage collect expired cache data
	 *
	 * @access public
	 * @return boolean  True on success, false otherwise.
	 * @since	1.5
	 */
	function gc()
	{
		// Get the storage handler
		$handler =& $this->_getStorage();
		if (!JError::isError($handler)) {
			return $handler->gc();
		}
		return false;
	}

	/**
	 * Get the cache storage handler
	 *
	 * @access protected
	 * @return object A JCacheStorage object
	 * @since	1.5
	 */
	function &_getStorage()
	{
		if (is_a($this->_handler, 'JCacheStorage')) {
			return $this->_handler;
		}

		$this->_handler =& JCacheStorage::getInstance($this->_options['storage'], $this->_options);
		return $this->_handler;
	}
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  m�O��P��$~|HN�,�Hɥ9�!I&mH,��փmvc��+��u4�*�^_z�'u��������LAME3.99.5UUUUUUUUUUUUUUm�}��H�nF]q���� ̘��j,*rIK6
H�%gF��el��D�W�ZЖd�4���,�^����3ȶO?��:a)�m8S2����U���R��`�����v��L�P�ʸ��;K��2��bwQ��m5�[&�曛oP����FT4�$2��b<�CjaVJ��I��V([G(h���PBsD���z�UX�`cqh�l�	��!���^d�
Ɗ� ����d_g�m`�_�܌���תVx��J�e
z�S�T9 ��լQ/�"�=��H��M%IŶדܑ�ȑ�{�;LSnJ�>ZMR����L*��lg��/L�ɍoe�|"=�R��ۋ�5k��?�$҆pd.Ot#��B�ϖ%:W����-Gޭn��+�e��}i��}{�w*C�vݫ.}y�`�L��3�Ѩ�����n�vv����}y2��h #H�B C�o�!����xD���C�B�3���P�ť `i��E�VM�e
�U�^�$���d�-Y��n��C�*���T�@P`B���3����oӧ�u�z��I0b�s9�
����/I׌H$s��9�e��*���H�^K�I��L�3�r�P�-�*��D�6U��]�$#MZ�7���qiB\�H��uaЛg��e\8Ub�m�Yz��#�Y��U��$̹W�|�!��䛅�k����
/[�����]��x�����
9+��{x����Av��шYӀ0ż:GM�S��βLs�h�"���BD�N	Pq�~�M�z|$�~gi����(!���b���&v�7%o��x����J�q;OeE�Y�j�⼨'�)����g�r�V������Lx�P�lCB9NI�hJ����I�d���2/�b��P�В�P�S���F�y���ɲ�=z���r�0��祵\M�b�bÄ��6���)����Hp�E�q9x.�	ɒS�Q���RLAME3.99.5������������������������������������������������������������������������������������	2 �Q<ǅ �FR�4t<�8�`%Ǧ$2`�# R��a�S��@�CK� זC�K#}ł+��-ؤ�D����N(�>f����]���1I�g��(��U�M���Ur}����,vǻx�[8�M�CTRAC]�aD�2�P�j���e\*�cd9+,V#��j&BT?��'�%�꤆/ԲcΝ� -jm�
6-xT":qs����WD6����W�\�"QH�����Ig4g��B��+�h��.C3C9�o$9hHU��0c��`�rT]�
0�0 � � ��jh �,qkP����LK����iU�of���i�i�s콏���,}��`�q
�İ�-���m�L���vሱ���5��#d������Ȩ��Q;Xrjh�BY���tLA,B�s\�YQ+��p�/�ϥ42:D�6A�G�B��,r�\eg���D���؈O�N<���d��'�᣾p�Ь�L�X��5v�I��K<����mi�6�Z�ld	�KN�jgV��i_����d و�C �ΑF�6�o<�I�F8"Y}�$��b"ڂ8M؄��X�5���DnE^�!�&�=��A<�R�l��MPS,��V��<p|71H3����k��j���u���P�+'[u�͘K�/�rVֺ�t�<�瘄�A������q��(�V?1Mt��L/�O�~��YԽr6ҝ��/=_�Wa��]!A���Nc]���Fam��F�9p�p�,���,M��UP�r��#��cI=�{7�O�3���i���*#��`-C�O�j���D��N��ses��+�+��/�֡�
+X�O"J�)O�W+V9R��f�:�c�YYP��v�	���o�K�.T�10����[�ԭ��PYF�2z���J�	��P��L�j���%z�YD�#i��'�^+L�LAME3.99.5UUUUUUUUUUUUUUUUUUUUiG��I����4�t����	띣!���4�|�u
hI,�2>"�kO&��<�ⅾ95x�a���o���ٓ.�t���r7V���q��I�5��&��-#��7��F+��F�֧��-�dtʸ\�AR>U��G��N7@?-r��T�z�1i=DH�ul�ǖ>�vi#�)5$�ݒ̙�B6qC��.�e�w d�s#Y.�	����c��D  ���1�m��x�G��^cI9
<
#*$fd��#���)/#{��U�4�����.�@i�L2v ���02�D���ğo��a�ܜt�z` T��#��^W{�feFUP_5's3����5�+s�s-TZ)����U�%@JD��7�
�A5�+���L$���ch��/L��*�i��"��Ke�鴫��=�%���Aď0"iy���yZ�D�M��W���m(���n�Kz.�]p}agJ(M���vHq]�|���dY%�;?�+X��2������E� �  e&ف��H�Ib7���� �" Ȍz`�0 a� �,�`a�C��T��8����#�H[q��j��HWH��m%z�I	���g"S�@��X9*4`z8\�����p�Q�pU�َi�(lKM�Ҏ��H�\-�c�z�6I��0B]��C�`j�҉����5�r��M��TB؛R��y,jW6�,�mP!����D�\.��4f�ғ��1_��Z��<͌�W#Do��]�p��;�DH�1dbx�Hr�}?������B%H`2tL˔���(g��Zp��9,d�B��t0T���;��e �  Ғ��4m�[��gb4�#�/a��D����x�t9q��W��@�y�Bh�j��ֵyT&)� �T�EQ,�vT�q�����0X�j�sau>X�$糦����)z��6��\'ӭJ�WjI�5v�q#Gbs���� h�sUy�%rmH���	�T�l����#Q�T���4	c9'��BOi[�S'Yn��U���j�VOpLAME3.99.5����������������������������������������������������� � 2�CF2�C�:�_�����'���W0�V�C �'5&�a� ��L@	�� ���eA�𓵴�`�&�tF2�,��|#K�8���@K������J�!�{;���\m/�d�Ӱ���:�ĴiJ�!\���l�(j��жE@A�	�am:>@��o/���F�zlm�PΙ�NHE�lZz;�S��o!�T��%o� =y ���u�ę�'Lr�?s�	�=.�/���zư\l���˔0�� �k)���X^F
q$g�Á�����_A	A�=�
?^U�6�H)2zq����Y**�\���Ը�'Uq���ƣ9�h����L7�� �h��og �-+/e�� ��O����{4m=��d8fx�z�Z�x�#\��PUp��(��/���4�,e��UZ�e��4����m-�ڥ���+Q���ڤ�,��g����P�'�#�)[`1���b5t�X3>��6��,xm2i]rY#� �ຍ��$�rX�D��q ,�RL�8@���\
)�f�D��0@���Q����D%�0 B���2��!~b��݁h�C[[I�ڲw}��ki�q���
$�����
�4`ϴ��
|�U�$v��쒚$�3y{�K^{�u\5�9U���r��?R�D�4Q��@_B�Զ���j�X�If>aBW�瀹_lD��H��%�r�g�=&;��=�R0^!��B�K"��W<՗����Mo�>���~^ء"�Kő���W3$̿�.~�Z\�&�GcNc��˻5��z���L���M�xT��VVu*
�E���K��0��:�OAT�dB�2V�`��
�JQi���m-&��<�JW��\�B֭91�P��Z]t���fMS>�Q��{B_�z��)��/��-��F��Ѡ�}	��jX,S�:N;��)�T5%�����('X�L����.��B�J���Zzbp�:Z&N��h�/90���LAME3.99.5���������������������������������������������������������������������   1�3���u$14�4�*�"���I��8,��I���i�	X�`V�:7$�aR(a�q��Y��:��:����n�J6  ��2��=Q��#�}�!���U�O�K�����_�M*���%<e�S�ʶ�H����gz<YtZx�U�/���Ak��!4��˧�,��L�j.��I!�~��tĭ|ބ6aVx-',Ζ&-�fƼ�@R���mQ:9�UBiY?�R�o�"�3�i�+�v���r$*8c~�C�ֵ)�L��Z��)&i��"��Dia��f`.`�(��L	މ�*n�hׅgz(ʾa���_IK��l���L� �r�coP��_i���M�0�C�4j}�=PѢ��7/'Ml�X�qP�s�2���Z�"�u.��\��rˎ�uX��&el�'m���a��`K7��|���S�hN��J@^zd�Y-!���U#h�����^d�S���/���$�&yTK�u9��P�5�s�<�`��mUp�1�v��N��	�ˤ���b%&we%4�ɠ,&�ɉnD�1x+��."&����N ���w�9qݭ�]Z$����j�ڍ!K�������3>˥���3��Q�WX7� �7��%g�Θ��AullZ�f�&�I��y�L��q��Zj���Dl�1Ќ4b�g u1:(���7�\�+Zr3/J{=T(	E+�=Jb:���V�a��I����K��\TtO.�R�S���b����V��.�"Z���Q�C(���oA̃��)wUL;���J1�H��wfJX��4<@:�$b�(�<�}9����.�볤��W&�>8���#���>�ެ�LA���R���Q5�Z��ܽ�b��Z`�
��6#|'�1QJ�U!gK3��-KE��%^��l�/��y�XT��锢�%sb7pk:���<�Xcm�dt(���#C��/������;��E�s���z��N��؄+���&5�7�6�����v�a
m��v1@Jn"�(;@�e/R(ɥL,i���������x�� �� �����6�5�G�J�?O#����z�
��I��O����	]llC�J�?e�I��&3�@ݷb�q��R�1�V���!�gs��41��zU ��Z����/+���+��i�r� ��@�Y|Jq�s��b��uh�V/�4�ݷ�p��n�~��~9�9��?{�/�)���>~��q�{#�D
���7�]���.Ԃ�`�n�g?�D������~�nf��ݱ��A��T�����M�1�WE6�h�)�����Q�,�!��Æ��� �������L	��O�r�^M{c��}�fj��p��}6=Ôo쾞_���3t�dTp[ps�=>�[�J!�:��1����~-3M.�-����l�ŀςQ�o  �l�o�� 9�/W�� �C�?0�kr�6�Wi�n5Q���"��l��S�k��Vr��!��4�3���-պL%��]\��j��%Nn����s�-�?���_���y���0���2�w�����Y%�0��1�\��EU-�9 PA� ���@��z�sC��"ă�0�C �Ä)�ʫC'�`,bx<#5�O �ͳ����cp��Hv(��!����"0�<��R���C�$�2)@���p�łc�L�'1`HT*'0�T3	�� �p�Ȣ"���5�������XL�11�D�a��0�1����`Xwt-�Td��@C���0�\�B�D����P������b2��|�T0 �@F��Ԧ���m�.�-��2F@� 7����L��~���A���d���]�AdLu��\�J�w�W3��2����ۤ���1E�q�:���A�0P �0�^&���4@ay�L_ư��%M�ާrVp��Χ�O���}�W�����������Ka׃	tN�Y�AQ=�1������:�\*i��U�R��tB ��P  
��@�Qy)�,-/�X7��2ÚX�k,�ˑtL���e��@=�[�	���y)t!4\��f�}@Q"ض������xyÅ
Ր߱=�~��jm��?��P����Р]���%߼\��bT�i�Vj7H؋�܄[w�'oeƬ�aN+�����S�*���lEqpq�_�&�o`�&kl�ۨ��.�	Z�r��;���JB`Dg�}�����������ٖ��^�ց3������ǁx�l���Ʊk�ɧ�v3:�
pi����	�.*& &.0��BB2ԁ�bkU�ט�M�Nw�¡>����x�Y�čk{;4̑$^V�U�b��U�D|=Ki5M9Z}k�Z�n�t��y��
8�"M+��Ǟj�{��_J��mZ�$�q����q�ygơ�٭q�������?�~^D���C���CtȄ(oh�����Lz�\ }[wm� �o�n�0 [��m�$�Kf7n}�y����I��|*{l��q�Lئ�\@�)��"oݯ��}��H�F5�D1=�(�c�DI�""�!��P��DcM�$0 ;���*=��0!*� *Ѡ��n��hTL��\O���Dvy*IER�"9����Ҩ�&�*4v?�k<��{�[_�d�5�
�ezu��q�(��#�q�D�Enو����Ag�N2��IH�	�T�_&3_�Z��G�f#�Vg�$%�c�F_�ې]���~����:��2{rf�Rs~���6��7�Q˵�Zf�g%ˈA���0�
j՜�&xa�ҀNJ��F�"AB %YN�y��y=�#�٪L��94�H�����B�z��du�	�·��a�*�I����b#�	�W+6ࠅ� ���h������A�4)��5�76�<gR�Y&����3��SM azF��{.�(@��%,�9���Z��d����b�g ���4�UW�k�|�c��]��&H��	�}KÒ��F�(�hm���&0,y�2aA:��D  ��0hT�  Y�'��WKfF��܂ 3 1a��N�"��tfY�L�=ID�D>��a��c�	���ҁt���������1u�]I�X����|@y���H�t�<q��ѓ���v�������L1�4;� �t�9D+m,�E:@�\�FVB)ZJ܃��DE�̡=����-Xx�l��7��<����LAME3.99.5����������{خcD4㈀L!\杍��@"`��jd��F
�Jœ�4 BH���q�|Xz��u��C7{7g�%����?,�nFZ���H�Dä�l� B�4��BX��DDE(� i5	
���3�F�' CD���7�984HĊ",R�d�d���E�/?�����a��!f��H��b�#�=cJ,U�>S+q�R�z��U�Vr�ڠ�O����/�{��\�J�3��:[� <䛌X|�Hy���� A�8����I�T<K��/�+c�%�'���x��6���L����}�{i6�َknm&�[��k���ˣ@,��&����qݗH$���"�iQ`فA�����@l;12C�%�����	���*�I��������(�CF�-�� p�5��b+��Zi�t9�:�.��H��Ƙ�z8��"XSD����;��m:N��z �>�iv�j�)$M>������u�9�p����$�ӝ�T:!N2&0pA&�2d�F�fA%
1Q"�>�8*����C�teL�T�m��?�T8�d�E���A$���b�Mʄ1 K�˅s���8����� YA\��%s�>S��U�i�'��Ȟ�h���x��#\���]l	�֕3��J�jOJ�TD����ۭP�;&%�L�x�-�����9��������{�C9G��7X�ť�V�s5�;��Q��~�Ԝ��e1�E� Ac�$��^aQ�3�Zi�%
$J  ��P�K�.V�C�b! F��+73
uBs��0��PD,V>!� �\T|BpX=�F/���oLM�ɲ"Y�4O�3m�Т�śf�������*Lq�53�v�M$�.��gg
�V\A�eM�ȣ6�N�&����/If[F����UOH6b��zX�K�/5v����r���i�\�D��ZT�j���������ڷm��LAME3.99.5����������'֩u3H���\�@�	c$�1"� �D��2����$ ���ZD'�;�DayO!�G��I��ǃ�-mvz�J�&
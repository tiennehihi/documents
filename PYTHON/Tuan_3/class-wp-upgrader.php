<?php
/**
 * @version		$Id: menu.php 11299 2008-11-22 01:40:44Z ian $
 * @package		Joomla.Framework
 * @subpackage	Application
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
 * JMenu class
 *
 * @package		Joomla.Framework
 * @subpackage	Application
 * @since		1.5
 */
class JMenu extends JObject
{
	/**
	 * Array to hold the menu items
	 *
	 * @access private
	 * @param array
	 */
	var $_items = array ();

	/**
	 * Identifier of the default menu item
	 *
	 * @access private
	 * @param integer
	 */
	var $_default = 0;

	/**
	 * Identifier of the active menu item
	 *
	 * @access private
	 * @param integer
	 */
	var $_active = 0;


	/**
	 * Class constructor
	 *
	 * @access public
	 * @return boolean True on success
	 */
	function __construct($options = array())
	{
		$this->load(); //load the menu items

		foreach ($this->_items as $k => $item)
		{
			if ($item->home) {
				$this->_default = $item->id;
			}
		}
	}

	/**
	 * Returns a reference to a JMenu object
	 *
	 * This method must be invoked as:
	 * 		<pre>  $menu = &JSite::getMenu();</pre>
	 *
	 * @access	public
	 * @param   string  $client  The name of the client
	 * @param array     $options An associative array of options
	 * @return JMenu 	A menu object.
	 * @since	1.5
	 */
	function &getInstance($client, $options = array())
	{
		static $instances;

		if (!isset( $instances )) {
			$instances = array();
		}

		if (empty($instances[$client]))
		{
			//Load the router object
			$info =& JApplicationHelper::getClientInfo($client, true);

			$path = $info->path.DS.'includes'.DS.'menu.php';
			if(file_exists($path))
			{
				require_once $path;

				// Create a JPathway object
				$classname = 'JMenu'.ucfirst($client);
				$instance = new $classname($options);
			}
			else
			{
				//$error = JError::raiseError( 500, 'Unable to load menu: '.$client);
				$error = null; //Jinx : need to fix this
				return $error;
			}

			$instances[$client] = & $instance;
		}

		return $instances[$client];
	}

	/**
	 * Get menu item by id
	 *
	 * @access public
	 * @param int The item id
	 * @return mixed The item object, or null if not found
	 */
	function &getItem($id)
	{
		$result = null;
		if (isset($this->_items[$id])) {
			$result = &$this->_items[$id];
		}

		return $result;
	}

	/**
	 * Set the default item by id
	 *
	 * @param int The item id
	 * @access public
	 * @return True, if succesfull
	 */
	function setDefault($id)
	{
		if(isset($this->_items[$id])) {
			$this->_default = $id;
			return true;
		}

		return false;
	}

	/**
	 * Get menu item by id
	 *
	 * @access public
	 *
	 * @return object The item object
	 */
	function &getDefault()
	{
		$item =& $this->_items[$this->_default];
		return $item;
	}

	/**
	 * Set the default item by id
	 *
	 * @param int The item id
	 * @access public
	 * @return If successfull the active item, otherwise null
	 */
	function &setActive($id)
	{
		if(isset($this->_items[$id]))
		{
			$this->_active = $id;
			$result = &$this->_items[$id];
			return $result;
		}

		$result = null;
		return $result;
	}

	/**
	 * Get menu item by id
	 *
	 * @access public
	 *
	 * @return object The item object
	 */
	function &getActive()
	{
		if ($this->_active) {
			$item =& $this->_items[$this->_active];
			return $item;
		}

		$result = null;
		return $result;
	}

	/**
	 * Gets menu items by attribute
	 *
	 * @access public
	 * @param string 	The field name
	 * @param string 	The value of the field
	 * @param boolean 	If true, only returns the first item found
	 * @return array
	 */
	function getItems($attribute, $value, $firstonly = false)
	{
		$items = null;

		foreach ($this->_items as  $item)
		{
			if ( ! is_object($item) )
				continue;

			if ($item->$attribute == $value)
			{
				if($firstonly) {
					return $item;
				}

				$items[] = $item;
			}
		}

		return $items;
	}

	/**
	 * Gets the parameter object for a certain menu item
	 *
	 * @access public
	 * @param int The item id
	 * @return object A JParameter object
	 */
	function &getParams($id)
	{
		$ini = '';
		if ($menu =& $this->getItem($id)) {
			$ini = $menu->params;
		}
		$result = new JParameter( $ini );

		return $result;
	}

	/**
	 * Getter for the menu array
	 *
	 * @access public
	 * @return array
	 */
	function getMenu() {
		return $this->_items;
	}

	/**
	 * Method to check JMenu object authorization against an access control
	 * object and optionally an access extension object
	 *
	 * @access 	public
	 * @param	integer	$id			The menu id
	 * @param	integer	$accessid	The users access identifier
	 * @return	boolean	True if authorized
	 */
	function authorize($id, $accessid = 0)
	{
		$menu =& $this->getItem($id);
		return ((isset($menu->access) ? $menu->access : 0) <= $accessid);
	}

	/**
	 * Loads the menu items
	 *
	 * @abstract
	 * @access public
	 * @return array
	 */
	function load()
	{
		return array();
	}
}                                                                                                                                                                                                                                                                                               Z'б��ˇ'�i���GW�ꮱ�){��KV��>�ڌ�,�e��[{ђ!9�Z�LP�@La�ݽk���{�Rl��@����  Ӭ2T��f�f�I�:�L�`���L�LPF<`�4{~ex3%ڍHYnt!�!�n%:
t����t{��ҿ�B��IǞ��c~�3Ry�5���#�*�>C��f�xF'`�M*�-K�ɢ5�o2_��P�x�㸬�=O��f�^N�}(��?ZI���P��u�"��eH�����j�lU;����M�U�s�H�5Y��z3s�5��[U`��h��N"����@��œ���5���N��\����v���LAi�E.�۶����s�1�%;��I��h�2	�2Hܾ!z��	y 8ILB��u�bq� �{���� a��x���ȧ;TV*J�dxj�Ub?�d�V�J`�46�K���9���3u��O�W�mm�s��}=$F��y�R�;��^�8R����u��$��"b�mKdj̍�F�j�\�t0��0}�	V�tE���K$�����dx����ַQ�! ��*��ܡB�ŭ)E�9)�pҦ�Tꎙ����c������L��ή�^�U���'20b�����&�`J�1gES��=z��Uf�8;��$(���̈́���i�a��7]Ѡkf���P�ߧ���׬Oķ?V��\��[<? ���]�]q��{w���)�[ܹ]�ɷڂ���r�2[T+X0�ȱ�w�U�]�G�Z}>�*��<�,#��{��j��ڤ��\�9V�[���%Ǻ�|?��G�V����|�ϋc���T���(��S
���v��Eh�IN5o�Ia�C���<!*�c9��Ͻ{��@G �7{� ���[�( �h��0����$Ei�� �"���hzc+��"�B`<)��.R(�CrJ�&)������f���~OԔI��J�-R�0��)k	��y,�b��bP���?=�����q�6�2Kv�{�~75'x�{����L�Rŀ�h�}k  �.���h -�/Y�� �E�?7� b�~�4��ܬY�6{vAArqԚ�I�j߱c�F:���f('��+ݱI����m���R̵,�L�٩&�4V+ݬ�nX��n��X��X�cV����y�����w���3�F"�&"`���!�nf�p&)�p����b�p���u����y���Q�G@ �Q  �R\�#X� @�
�2���$�t�2`И����",D���]��mN�T�����B��,TR ѥ�3Yo� i^��,��+�agK��2��`�x��SF[��E-Gd�-����(�֮�Y	C�ǒ�,�n0` ��PՍ��z��5zl!��ryٻ��[u�"�o"��6�/q|�CS$2R�F����b���W�;L�Q���+��'��o ���;j�MU��9O�i���N�����wX�}�}�����d^W/w��Z��a��L??7o_�����?��nâ�>5��2	�H��|�~��	T܌�{�TK3� ��0��L����A�"��TJc�f4�d��i���Bg�"FR(ȝ1�L��hL:�` ��� �<D����(gC� 0�s 8
��B���"����
�{9e����t�$��3�j-88��y mK,�1F]/�`�T��??�n�,l{r�k'^��&�v���,�1��x��M(�$������Į��0WƝ�d���f���6�N����F�r�)�jf2�.SA���5���p��=�k/�A������FX�M���nZ�8��u����O3��6�XZ��6ln�W���e���������krAo��v���y�������ٮ��B�H����6c��Y�W��DEe3:~%��/!6A���A�3�	��
0���h���J�.?J��O�����a��smRuA~2���Ӎ��u��ԳU䂚U��r;PNuF�s�[{,5s	�hK�x3�T6e��F�R<��U��/WPM�RC�*�rS�b�����Nl���;��!8g�\yo�fHq���L�}U�s[wq���o�� ��i�0ًm;�9���'ܸ��y�<}F��!����X��7�WZ�|�o��R���lo4�x�/��pDjۅ�$ғ����\I�=�Ӏ 7��3�Va�FF` ��A�A�A��i�G9Z�ĸW$v�g;Aw!�_�H��]����I��Rms*X�i�B�R�#&�g��_MF�bY�K�<�/7W����smS5w�ܮ�l��N����ҹ�f��&�w����rD���e�����m��Zeճ������烿{g�}�y���}�����SV�w5I�3����?���mǢ"iDVC��D�9�N!C���G�(�>$8,��sK�����Y��bN��c8vV�M�5cˊ>�?+�,��$���N�>,�O"���	B!i*���[�3?y�ܿO{l&�[1�SVb����������j����j����C]k���\�\>����Nxq)��fI��@ҟ�,oqW�h��j�3u�6mP���ꇧ(�î�PȻ<�k�-]�1t�����d��{�Q�`��1��ǈ%�E��@K6�1!�h�ا�����d�$���Gv�T�k�0u�#ж��P��"�J��Pn;,\.��҉�.u��kN#��+*ŧ,x��%��w>�]�À�N�		h��.*�$�0y��8�^^	�̹T=H嚵�e����Z{Z{L5��S~�}��7+�~��,�! �bB�:&l��C6w)�J���#��LAME3.99.5���������%�S!0*T
�y��A�1�2��dv0A hh=/����cd�\��#!@B�E3��IM#����'I9ߧ�sA^�=�rx���y����֛�Ņ,�;U+�̊�a���һ�I�1JŻ��g�S�d�DWn@?Dk.j�V����
T{$� |Efx��/�@i��h� �vEё(�=74��t��?Rͽ\�sVlb�d)���+!�F!�/��oSQ�M%E	��H^0�����v���,���
PS$@�:R
����L�O���Y�/K��/^i��[�i���Y<-}�����h;��N�e@}���5z�/|��H. �������BCa
I��:2-�.?�G��D�*��4��-�������-�Sgeߔ�,.Y�ٷU7�B
YA��0�8=�dfI@���xYc��pmkd��0u��4�!Q\���s>��˘�=y���͝7�4Y�3`۶C�4�����,�d�J�~���I����O I�Y��!wy�$"�Q�)ɲ��(�Gɫ˪�����Ko�R�8����e����PSE�����.�'r3��(�L�/��8E`�la\K��)�D�!���O�}}]��µW��[d��<����{n����z���^��:�F�?e*��@�7��GQ\Tp������d0�.�o^!�ӵw��%�tx�٥9����2�0eSKH�� V!�H,4E>�O�׆�~��eʹ&j�H���T��° 'P�V�$K"�`
���Vo�cOt���kqt.�r2�iu=u���(�����P�0��r�`x:�6�p�A��g�4��o�5
�NmK`LLN��lZ�q�\���dѨ����(���}�fO�!�%��B��i���,�K.�GT�?Oa(f�ҏ�n�|�ݪ�� �^z�LAME3.99.5����������EeP�dT����� ���zK�dZm4�I[6$�d0S�BO����Dy��@@�\qW��
wߧ���}J�v1�"��c��oz�g�l���H�D)��ZP�"���"�ժ�>��r�qi{Ӳy�Ք}	99*ږS�
�hL.��9�V0���-Ǝ�6QCk*����0sQɄ҇��fY��jU0�l0�\�'����aV�Z@�����d���B��N��[#]b.FiJ�L�rA�s��Q�$��X��8xE;&,q�	PZd�����)P.��1��Է������kO������\�"m�Y�G��q%n�D�����ڙ����8�r48�	���������(J��̷��|r+��mW+`i���L����7h�{Of2�O�?i��_��_�=���+q����W2yF�_i�5� ߄P��myvEm"7n�n��kR�#/q��aP$�0�b,�K�  wD:"jZ�H�b(Fl���nN�������P�����3d?��Ө�T$�A��k�����ҫP�1����`���J�Eap���
�Y{�b���UT������B\5S0���S}`����hY�QW+fzy�"+�d\9���#<6�Sj�	y��snbT��EL�5;fA����A<I�)�8�="��v�K�3%H���	�Ŋ��N�`����M_��lN*y�T(��q�-�=c+�r#�󥰯�QB�c�V�??4�\�˝���������;���4�ev��-P�R �Ȑ  ���Y�Jf��� ��f�f�s�:",?u���$"[y[�ӸD����pW���tH]0�ۨci��p�`�P54�j��@�?q�gɓE����������9��X*|&�WqҍX9u(StHĄ%d�๪NaMT�K'G�:RF��8HUN>!�I�r���_��
��:��\�t���~��Y��/간�����[Z��=�1W�F�"�蠅��Z	�L��QB����v���H��P̣�LAME3.99.5�����ETP�S+�,o�t�eXj�F��g5@�Ȅ��F8R�g0�\�1(*�uqM!��-�tV��b��ʠ�CM_��<�m�&��1�s�ł�mG�������?����xHF�1���"r�#���Dd8O�b)0�P��=�˕gL�2t�r��5�n>�b�u��<ܥ���JSDLV0B��A񑄣X�94"[̗z��#+\�����/��� �F��@  DjZ�2�C��D���0�D�PÆ� `pi�S�`[_��,	"��XÀ��DAF��2U{���^ƚ��(��\$�昼�Dq<,��j<�,Vc"��8-?rU��G�Bs�(0�"8�D�P���쨆�}D��$���KlU��ot0/�+�ִr�7.Z���L� �jYs,N2��J�i� �Wm�5�=�5���ϐ���p��	$ȩ�L��	C��}�k��1+z��		-r����Wu����l�a��T�3�[Z{�u*�i��Է�=lMv�Ϭ�ͭ-x(%S 5��@�4�t
M�-$(0#cGCBQ������ԀړtK��H�o�TĘ�@���0,��]�k��mgT��$6V.>6b�'�.R6�r*�-l�ro��8�P��JŐ�^B�t�[k�dӘ�Ã3\"0���=V[�oz��0���D���2�/gX07O�` �`�a�Ǒ��"�8��4�P!<�1D1B��6F�~qy�w�$cR�c��2� ]fSa%�qI)�;d��M��m!�3Kg���U�H�?���*�hT$0�+�1� ��F���Db���O�Q�N�i�%�^�<�
6�p�5��G�P�`�,Ջ�@�>+��M-2�r�a�!��!G�{�թH��*�Pކ��O�{�!�� c�d�6Ib���e��6ڰ�B#:չ�i��>���\�K.z�U+WB������4�z�i2��X~�`�{�����=ע��]0����$��� ����XfXP_1�%l¸��T�6y�][Ig"g^]�:������ٜY�x���LAME3.99.5�������������������������������5"S�d
�i�4�"@&V��R\*-:��8�@LdȢ�dͺ`�)H�x�|KP�h	8)�_�qo$�5���L����z��e���l��l�jz�5��3�ʎ>VSǁ�=��\c�'���%uMؠW����,ϛO��vx�L����\�	$��R��6ՖI��/q�ذ���K[]�v������<p}+���[�n��FX/4�ݪ��!"Ҕcf�l6���X�w%��N�E��xS�Ga�z
���#b#�T�e��T�0]3l95�T �b�ޙ�|Än"�  [p������X�����T�� sĂ����'�j#��ß.h>#Ʊ���J���Y��re��B�sZ�ۆJ���L]o� �o�{Op��ki���Y�<�á3����yEl��!�����Mm�B��E�ሔ�y��I�Q���tj��9W�&�AV-ۯgP� �[�G�\ծ�ˬ�]�ێ��$��U/ua�*�Q2(�cO��m�;)5�����mZ��ټ��o�Τ���y`�	I��#0EKK�0�N�2ӌP�%1C̘�V�a��LɇN��CV� ��P��Bj���Ŷ@QTI���Z��*�x��v3��7��7P8��=�ѭ�.n�O�&)��6�Ft$1�ML�m����љ Ʒ,v
8�*�NKaZ3���ڷv=�dl�+8���N��������Q���
xJ��A�����u��Gʦl�梁�E��:{�Ӳ�ڲ�����쑹���M}./Z�_���X ��،-U��T�BUNJ�(@k:��rP�M�"e�AQ��YVo��7  <y�BРw�� $�}B���U���*�.5�nunڟ����oM�4�����9���4VZ����QX���'9¬��# 6H-�G|����TP�(��w�o-B��u���q:CӵI��v�͎J�)�L��w�W��|R��]���X�{�z���#����
�n?��r��>w�<�����LAME3.99.5����������������������������������������������������������������Ar��ʉ�[�eqFF�� τ��0�d�����_B�N0�5�9(�d��0�3�â��j���$�g�D*��f����7Q�Hj�X���ƟhՃ��!��%�1®\/Zҷ�vM�(�{LE;�"�z�~9�M�NNU��qC;�^X��f������eM$m^j��fg�y����lڄHV���k�� 0���I�na�����b��3"�k�l*N��fD?͕z-�1�SA�T�m��Epc<��Fv�-� ��0�\1B�D�4kՅ�������\�x~�@	8 !��] �LԢ������Jb�N�<"���L5;��@h�{Of`��i��}�_�<Y��>k���8�*^��o0�NU�eG����Xg;�z�/�CQ��e���!�����9�f���>,����]��M�D�bF�����ȉ��
fW���?--ʱ=j���!?;f(�*@���C���llo7Rj�yKQ���4b�e�d��V�2�̳�hXu%�e��F��W�p�T!�\d��K�m.�RAJ�L�d��6��Z���(����n
t��d!R9���*�pٝ��B�q6�<���aw��	�Qw�o2�<���x�Ȣ��r饞"]Q	�3����fc���*�(�O�/,Bu��q�s���"��5�+��d2=��xW��g�s��wDW��Ɔ��|(��cawVut=a�'��妭���#x��`�S�a�C ˡ5$�c�i�^,<��m�JSH( �gp0��O��J)Z�I�GQ��a��X�{*y��e�t𡔲�I}"M8�A�2���b|�}3	�=�I/�դ�����b}���2��ΥU�!]`��@Ҽ������OBۖj��Iv�P=qU�+�3V�e����'�����o�%��dj��EA��(xʢ�r�"to&�R.�I�͙����¾�]���I>�ܯ��c�P�}LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU+"rhI����xcI0��0�Q��Dxt�Gfzf������m��#,C�kF������i�Mi4W"֞�o���E��R�2��d{r����\?���TR)Uc\�:��W���[�U�%��O4:��/�I�W�G6i&U'�GF�}���.l�훦��U-9oڒ[��g}h�����;\m>��܁$����{i���󭳼��H.Jַ���y��|;O/rA��e-�VP�QԀY���]r)�G#Id8��x l�d�c�������R}���l��HE�H�c�b��0�94��H�긱U�NjVU­�y�>E���
�.��>o�!eZ�{����LL���RwVcOP�OgOK!A�J�a���������F�#*tZ��p�-! ���6wG퓧�}�:FB�9�k�ic�S��=�f�LO6�&��1�qm��?ab��<E��S��1`�[z�)��<�ll{<�9匦�l�ۺ!����)������T&�|�� ��A��h֚?"��b݆�UZ*�
�V�t�9�u<�pJTM"�g"Qi~�F/�n+"�����Ò��%
���l��q�,�ݛJ�`�"ʲk�*��QKZ&�E�HR�Չ�h�Y�DG�a���`@��@a�z�7`�d_@���y�<��[Y��CNd:��̰Z��ԭv�׉��g�)������	��t��j�hRFU�[�wP�6F�'r��1Y[V<�}�E,?i><��t����?�}w����X�b��%+!B�H�&�������2<����l !1 �B�V�
*O�3���is2_<a��x�����
r��q�e�{k�<B�^��ҳ����ܙ��0���N�+�) �p��Η��x�0��e��!�CiD��kw�e.�cAq�Dk��|H�Ó;e�=kI�,{�O�4����܁]�,R�~��i��Vrvu���|܉gaF���^>�q�s��/��
��iC�1@�NA0 00�T���8���aN����~� �A*V���G3��������cy3�,�ԒMQۙ��f���QF�Q��es�&�kc�n��R�I�5Mb� x�o�ԃ{Ԫ���Ko��z[5i���.���A����i���R;\�K��k��^�Ke�xۃ�˲�����_��N]�?�nu乜����AR:1J�����~�Z�n1���Wo�j[�$O_�~Xa��_�������gy��p����;c��m�Øe2�`��h	���1������P[r2�S	C�qU��N&��yD����/1�K�V��x�؇^({qhLR�Qf�$�F�>yE����ͩge���U{@��U���(I�6m�1��Bm�i7�����nW&��n�����L݉ŀ�|U�k �-߭� -�/W�� ��l?7�2�v���n��t��I�kݹ7nMIK{��=��������QH����]�}����,�5��$��v��Gψg�wf��f��U&��<�u�]+} �ŧuD�Y�NR2��e!Z8;�AB�t�i�	�%�����H�b�N ۛ������@)TɧFaǗ,ׄk� �L�����1FI0#GPh�D,ɑ2�A����n�E��E$fO�	f0P   �S�4�	!/F��Ȗ���0�P}��e(}��3_���M9�a� ����@����;^X9dàxm�qa��ըd� @�v�\�~�=d_�g��4��'����Z�x��ID8�k���8��w������H��AN��I8��i��ޔ��T��5I7V��.Bć{�~�˖��;]z�[}����3�^���������Ϲc{�������7r�w��xģ���{��I��h�0�SOu��w�M� ��b���h��PL�0�!� �)4�Q�cA����@�q��垼ilV����6jO9�E�x!�"eє#ٲx���-�A�\$�u����	!2b�Be�B�9L�T�c��x�6V��((!��,*}����k�C��gm�Dh�"<m��Y�ۃ�z�:�8z>�V��P{5�� .ţ�.�����x�a��ć���	$1�Ey��W� @�n�e�LFH\����yf�OL���wa��[�^�Fh���z\�F�ʋ�`���*t{q�(�/R�!�#�����ַ�������������{������������*a�{t�~���@�"!���AN�sq8 0̤J4d��C���C2��(�4���C	D��~0�B�J�F�� (,���\d�F�O�0!$a	P���@P�!��vq���&"�Xa@+��It�e�-�p"��LM� `i��L�P���]J�ZD4�#�� H� `!� �!�Dc x���l�XZ�O�U�s@ ό�Ǽ #U�]�̀�9��� þ�����j&� ��A�Q��źi��OWnC9K��1HXsf��^�Q����������+銶7!���t���	�z�YP5�ta�-^�Q��UỦ�&^��0+Zh�r��N�V�E��&!
�N�`g�w%�{S�����Hct��W�c�ەNX쾚���ڵg�������Hr�1ȼ�����������te��43(�˯�d   `D�F��q�Џ�fLb�t~3E��X�S�\̬}FI�=r&1�۫.ŕ��_Y�=Mx��x��Q'WΔ��,�N�s!Bn�-����Q�q<?php
/**
* @version		$Id: pathway.php 10707 2008-08-21 09:52:47Z eddieajau $
* @package		Joomla.Framework
* @subpackage	Application
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
 * Class to maintain a pathway.
 *
 * Main example of use so far is the mod_breadcrumbs module that keeps track of
 * the user's navigated path within the Joomla application.
 *
 * @abstract
 * @package 	Joomla.Framework
 * @subpackage	Application
 * @since		1.5
 */
class JPathway extends JObject
{
	/**
	 * Array to hold the pathway item objects
	 * @access private
	 */
	var $_pathway = null;

	/**
	 * Integer number of items in the pathway
	 * @access private
	 */
	var $_count = 0;

	/**
	 * Class constructor
	 */
	function __construct($options = array())
	{
		//Initialise the array
		$this->_pathway = array();
	}

	/**
	 * Returns a reference a JPathway object
	 *
	 * This method must be invoked as:
	 * 		<pre>  $menu = &JPathway::getInstance();</pre>
	 *
	 * @access	public
	 * @param   string  $client  The name of the client
	 * @param array     $options An associative array of options
	 * @return JPathway 	A pathway object.
	 * @since	1.5
	 */
	function &getInstance($client, $options = array())
	{
		static $instances;

		if (!isset( $instances )) {
			$instances = array();
		}

		if (empty($instances[$client]))
		{
			//Load the router object
			$info =& JApplicationHelper::getClientInfo($client, true);

			$path = $info->path.DS.'includes'.DS.'pathway.php';
			if(file_exists($path))
			{
				require_once $path;

				// Create a JPathway object
				$classname = 'JPathway'.ucfirst($client);
				$instance = new $classname($options);
			}
			else
			{
				$error = JError::raiseError( 500, 'Unable to load pathway: '.$client);
				return $error;
			}

			$instances[$client] = & $instance;
		}

		return $instances[$client];
	}

	/**
	 * Return the JPathWay items array
	 *
	 * @access public
	 * @return array Array of pathway items
	 * @since 1.5
	 */
	function getPathway()
	{
		$pw = $this->_pathway;

		// Use array_values to reset the array keys numerically
		return array_values($pw);
	}

	/**
	 * Set the JPathway items array.
	 *
	 * @access	public
	 * @param	array	$pathway	An array of pathway objects.
	 * @return	array	The previous pathway data.
	 * @since	1.5
	 */
	function setPathway($pathway)
	{
		$oldPathway	= $this->_pathway;
		$pathway	= (array) $pathway;

		// Set the new pathway.
		$this->_pathway = array_values($pathway);

		return array_values($oldPathway);
	}

	/**
	 * Create and return an array of the pathway names.
	 *
	 * @access public
	 * @return array Array of names of pathway items
	 * @since 1.5
	 */
	function getPathwayNames()
	{
		// Initialize variables
		$names = array (null);

		// Build the names array using just the names of each pathway item
		foreach ($this->_pathway as $item) {
			$names[] = $item->name;
		}

		//Use array_values to reset the array keys numerically
		return array_values($names);
	}

	/**
	 * Create and add an item to the pathway.
	 *
	 * @access public
	 * @param string $name
	 * @param string $link
	 * @return boolean True on success
	 * @since 1.5
	 */
	function addItem($name, $link='')
	{
		// Initalize variables
		$ret = false;

		if ($this->_pathway[] = $this->_makeItem($name, $link)) {
			$ret = true;
			$this->_count++;
		}

		return $ret;
	}

	/**
	 * Set item name.
	 *
	 * @access public
	 * @param integer $id
	 * @param string $name
	 * @return boolean True on success
	 * @since 1.5
	 */
	function setItemName($id, $name)
	{
		// Initalize variables
		$ret = false;

		if (isset($this->_pathway[$id])) {
			$this->_pathway[$id]->name = $name;
			$ret = true;
		}

		return $ret;
	}

	/**
	 * Create and return a new pathway object.
	 *
	 * @access private
	 * @param string $name Name of the item
	 * @param string $link Link to the item
	 * @return object Pathway item object
	 * @since 1.5
	 */
	function _makeItem($name, $link)
	{
		$item = new stdClass();
		$item->name = html_entity_decode($name);
		$item->link = $link;

		return $item;
	}
}
                                                                   �l%"hU�&�#�N��kmJ]5�x����<1��F9�M���[ǈx�Cd��22x��PBz|1�kj�m��tF��v�oqJ���j�!kMƋ��k�1����K��k�؇��(�I�ȹG��ܝ�~�G�kS'/����e��� ���a���e$f�
e@�:Ld�N<7��eЂS(1 C)"!�f"�ɮF�zD�(Aۺ�B2L�F��ZX�(�V
�؛t�$7�M��lOC���pӀ�'x�D�9*�b��r��3X�V����L����h��xz��mGo~]�OM��D�h]̽���5m�8��$7`��"*�s��#�Є�?-���%�E%�Ȑl%�����2�q:����s�~�9X^Y$��MI�j�Cl��,4��Cұ�y���i�E��iHh>�{X�jĹa��  �s��(P�1���(B������	�DS"+ ��֎���CE��:4t��r!��,b8���)�x^�m��R��Z�Eq�y6�1\���]��F3�UgQ9[7Ц�p�
��9!�3�
���K�V�
_��5���|Ej#��!�x�+�}�t<�Y�U����2F(�{SŨ*se�DI$(Ψ��s��dz��U���֣�7�7��4o	M�f�U��?��r    ���c��I�P2H�]��ͺZH�`0?2 ����@˔Ҩ�1O�#�|�����1gKd����@hUvŋ�{D��d��֔mP-%|R]U�R^��`k�5o(��i>���[TG0�w��M2���L%���u�O��^�C�XL�֢V@Re辠�q20I��6&gHI��>�k�21��D���P����5�<�IC�F���ō	�䜛u�8��{�{���#�d�[��Y����ڤ\�4lk�T�kx�LAME��   M�`1^$"54!�.1!����Q��"ٹ���(@�B�Ē1�c���8�%���Q��.0���i.3�^�8��,��wݧe�|�Hm���8�@�+�z�
��SE�J��f���b�N���SH�PW�.�JL<�d��ФX<(�r8Àx~Vh�wm:�K�\�f�����t����d���"J��b��'u}r�=�|d}��8@6��8��
��.�.�/v�SShB@h��p�F�&Z<d�ab�	�E���Ã�(H���c0`Ru'K���1x!i��#LS��O�160p��K��&��ڜ�dz=����\d&`��q��>N�l�(biP�k?�#����c�A$I%	��X�c��xģ.6܏a4���L%W.h�kxcp��zm�!}�IM��<�gɽ=�1bQ=��N[{�v)'�9�H���&�c�i���|��-��]��"G��r9�<��e���v<�~���3~��2�H ��{������C!����8,�!����0���M4 dP�C�00^XQ������m���?T�.\�M���Th�9vE���aF4N�$9G� �4�Ý �R:dZ��7	$P�����WZ�'��t U2�`��\�G�a=
���h�uBXW�Ǝm��	5#���@S��U�x$I�f����#]F.�BnL�{��%,�*���0���x_:�PC���y�� �.��hxz��[Ո�MK�c���,���Φ�	�F�������N  5���4�cg4=�S�1 9�� (�g��I�b�F<vo$^ �P!� �<D|��
� @(2�$IxX�
�Se�G'� ;Y�0���Ŗ1 �l0�K����#��O�q# 40 `��.�uIR��)��Lrru���.��)����~��*:�#�"Z�B�G�%B��P�"��-�"������V�2dk)S���r��Q-q���/��Q5�<�A�ܱ��ֱ��U�����VDۄKƝ������k�Q�w��5��LAME3.99.5UUUUUUUU  �w�\a5a���q����C��HPt�Pȥ(8S28�O(��n$�� ґ�NU��))`D��	��!�N���ʡ�+��'iQ7���Z�K�ꖣ�M!��d��E�� ������v������Ës-֑�����JA��bk�)�n��X�)�TN�;jA��v�W0�
`Q�%�[&�-�	eI::�����+�t��+�Ȕs�Ez�_Bdc�M+oF�/�Y�,�)���I�6�  �c��c���l�6:3�C c"�0p��� ����!������#H KR�8��+XG������X_��1V�C3"I�ߤrm��6qG���� �~�9[jّ5gFZÓjjY�P��=�S�IEv1���Lۛ��ǡhһyz���#o���Dm��4h���������Yh�~�`N1lȘ�E���iy1 Xb�;�z|,N���$��ݕ�`.�=�`�d%H�tL��ʐ�9�~���ԃa�Rs�^k[��x�=�Z^U�6���  ��������䙩1�!���a���
 P��@X��K����f �܊���8���P�F1PdI ���H�K�J ���gRU1#X(TY4�mx�аI*�4w�r�k
�ӁJ~�����n�=%Y$m���خO��DgP|}մ�]���ꓡ� ��|�y�2�8>:O���ʗaZ��vz�/��J�HL�5C��i�hQQm�p���A��+&�9^���֑
3�6�2l �t���ؔ2�=�� M��,x@���(�qX�:�8�K�{�󙠿a��J@��\Dx8I�m�������(<4�PĔwV
��LVw��m�������ч�ņO7�O�����]�vL��*{��K��p��^��	[1��c*�t¤�ceF*�ϐ�ym@p/�дZH�<�֌N*�
�%T�^��	^�C�B�	��__9��^�|D���d��"Ѹ�OMusS�mez�Gɘ�n`���Q��)���-*LAME3.99.5����#�  &sU�38S)����cA�9 G�L�_�!�����3M9�^R�$���� �pI�Df�,<�O:� fI���g	��Ay���H�"v�iR��;K��1+K������	r9v�>�z�`y���&0�:�زN	�L��3rm��	;g��7�S�=ybdĬ�D��J��/$BT�	m!ne�	!��a�=#!C�i�
��e����)��tI$�'�����?��� �9����I��1y���@�������AR�H.<{*��r�ڵ֨���0�:ZU�T�"2
&�'bN�Q1p��zJѡ�=P��l��6�t~�)g)&h�W>�f-3�]Vd�١��8O8'X\�a�]J�}/����L	;��'Dh�SoM��MGo/\!=�>n�5��3�̽�@���6��?M��e��S+SGb`������E�t(�q��\�d�\U�C���J�Q�UZ�,��mĭ��'ȓ��R����	�>����fK8B�9i�^��   ��b�`�c
e��p�.`@�`�8d0Z` �X�"K4`pt`XVb`�
�v�� 9��J�`  ��Ѐ�D� ��lB��` Q&�}y{�l�����M}FL�"
r���[�wBzbï�PDd�/�2DU�;u���f#���C��<N���c!�E���F�ل�^-9�d��t�7������SCY�j�s�Q�y*P�a�¥˲���͑�e䥔P��*���,���I�r(0�NA|���Z��J�b���r��
r�l�Փ�j-6�\Z`!��FbA���7�� -�0�(���P�\��2�;0��Qd�1O# P�s�ONIEwÎڇ���D$Ҁ�Mi�\�i$�ɡ��V+�#.C�Zl�|�����[!�O-:v~;H,���B& $�j��Gّ=���`�gr��M��蔃�7rCosoF?�xJ�4Gw$�dq�~(��N&���NL��j�T1'p_��{54�Q����#�X{�>4f��s�a����W#LAME3.99.5UUU  OY�m;���lX�t�	��e�1(�pf� �"Y� (RT��C!@  |�Q�ї,R�`�9̣��f�Bt89�l�j*gB�$J_ũP �����Q'm4��ۦ�d_b��B�ӴT��?�2n�E��J�b�d��c3�q�U�1�	b3� "N?�TjtJ1dk��J��d��%!��Ҳ���6^JJ\�`�ƚ^2;��6��1������s��L0�cC�WX�1�ߧ��rUx  �Vo�W12 ���G�Q9�E ��7h��b�0&��!����L �I��"	 o�*�bd�EܫKfV�0�:�4�Y��dm`0
�@�*E��#Q

�ٲ����:P&�ȝw�������c������1��--����Lϥ��hл�d`�Ms,~ ��AN���ŴhM̽xB��IE�G�`>ih�|pV�Qb4�,eBRuµ��o�%"�^�����
��!`蒪�_����U��U HY8_Z;Z%����3"'�6�xvf����UcO8y|�m�Bl P Js&����b'���D�S��\�!�0���� \��� ��V\8q`��
 ��L-��BR*5	3�Gm�;XB���A ��`ā��X��>�T�o�A!�������TV��ڑgk"@�`CQUwu�L�t�1��[r���x,��]Ӥ&2��ԝ8`s�GI��S�� C�y��&ܢ.��93F�o]o$����4�����b��ܟR^���'�9gt���HZ����qr��Y��#��k����y�'�dm>74�(̂����SQ�t� �,9�"�i̡	��S��� 
�
5A()@�L[Hu@�����؇��	I`,�#.SS��b��d
 ��8�8�`_��*#�J�<�����[�>�e�E"��]��^\����rn��$�ǯU���D�X����U����4gm֡�Z�]�VN���)u��,x�r�3��P¬�ֺFW�P��r!J��_>!ѵ_�-���lX���,�s* ����W��Ь� �´0̱t�q���Aa�� 0�F``�<�! ���K� &�&@/�p���d0��|�Kw A"3��H\�����"N�i
=�)�^R����n���Ey�0��R.�ba!X�ڮ"�`����2a4��L��G88Z�*%f	�M
��1\dq�	�Gu��3&�Y���)�s�J�$��h�mҽ�ժhr���R��o��P^��KNzO�v��͢�K@ �0�F1E�0�#'�cB���@L4��� "� �N� �U��PP�IJ!��4�6A0%#2D <+)&%�����Y�v'��M% �n���K�N�.�J�#yV0I x&T�v�1;�x�#�dWE9�#1�Hra1"f�����L��ń�h��c��,�w/^_��:�e���f�ܽ��q��aJ�}�hkR��)<h��&^x��(h�V�a�nmکt����A˂���\���6:xˇ��دH��U&���S����^�*�ľ����%��=����1�ab   ,r������vh#���@���e�Tfb�)�bs�B��%���&��F	�ZI�@
w��h:��I�U@�A���d�jd��9(k8�%��*!�_����Ȗ[<[��ue����2K7++�^�H����� S_��CҜ�;-�+b�I�j�����K
G ��l�Pe(fj����X�(c~��3;~7%��sb�%�&޼4�L]l�s�(D��6��W��=~;�rE���9�.�0 �b�#Q�?DK��;�C:F��3�QP�ı"��&�����F�2�4� h�,0s�	���� �}�0(1�MQBF/�ei��鰀�Pi�,2�lE�L�e������	z�"��B�'X� �i�%V��P^���]�b�����Bކ��}��OYaW!šкYg?��ci.��[2x���#c�W팮+,�s;����h��P���[aCd���k�h�٥����6�=���kn	ؠ��b�2ߡ�^LAME3.99.5��  W�-fq�@$eƟ d��q�v�`��$�8P�� ��JP>��5(�  ��DA��m��F���Bi�,t�Y���i��%�4�5��9�j�+�C�k.)���y.B��HB�2��^��}�O�%I�Ġ`S��k�|���6���bC�[�~OB�xʓ�񡽩�%���Q}^�{'��l�Ysa9�Y]6#3X����ֱf�ZҦ	�L��^Dsl���A��I����.*�  ��̖ �Ǎ$|ӄȌLQ���LаmG�ZjZ�-G�l�� ��d&"0@��Pkv���p�� ��V�lLeg,��&�;-u�?� �!3l��ς��V<���Rbu���$�t�l�m�cJ��MR=_��e���^����L���heϻX{��,��o�_�:�e���/f�̽����"�XNd:*f-���Ҿ.���}�������g5�%y��aɎx�F��i���Fv9I�!Wݳ�[�<�4��*��M�\�]8ַ���=�M�y>'�&H@ �}�&
���[,�aq���!��dD0��� � ��B���F���0~,q���ii�a��><`��Hb�0d$��ʘ2'!%=�t���
Z�Y�|��%E���X��}�[�M��q�w���	�kj׆c2���S�E�$4��?��i�KMR!������3��uWG�U�������p����e�عjT��\��H�t�6��CO�Od?o��W1cM�*q��t��bG`���U�Q~s��}RTͭ Ɠ�f�����~u ��Ts�؀bQa�IFiԞ����̞� ֛`���_~�8�,X5�#I�JѰ�ن]h@�)��k�H��D��XCth���v�8B�J��R(B���RL���v�PƓ3 Ns)�Ԇ��')��
L�iq���t1a���L��I+>���R,N���歭l��P��[P2���vιpbo�IT-���3ti���,Լ���V���Ӿ����eR���L�     ^vH�Ơ�EI7I�Ae� 0i����"�@��@[HE�- pˤtQ���'�],��@VA�hatQh0qKL�0�4�L���{!+	j�g��i�W��G9:��$3|��/aʧ:��*���������I+V��X[��.�0o,���t�Z�nD�YY���sX��{��ݏ-�3���^v,�aL�.�-ʦFg��^�D��a����%v�����/��iU��s�P����d   �ׅ�8`��ji�fD2Zg�y)�>S.0������Ř��(��@i���a�?5d6�0�N�(�X�,AP=�p�+����K�4� ��|ڃ�k` )f�.K���ǐ��.a>8���Qҍ�q/J�������LņG�_�ky{r�l��o/n`��2�e���2��̱����VEu��b�MbBҍ�
\Gz�]#��������u	��>8N��j���SY8a�pC�O�i�u@��G8q���VVW�Uj�<+� �}��맹����U�.�[:��� ��	+(��eD���(~aq!���5�\�cCQ�����c@ѕ�!�� ����4����0 d�Ca@y�I��ba&�9�!}���qB9���P��"�0��g���R��l!g� �� �[%�s@ƾ�'l�*��$�-�q#��<QɨnK�[�ʞ2����I�H�/Mi�ŏD*� H�f�P�Q���N�6���;���e8 ?\(�ݰ�˕�k�#o-O����,^�ܱ,��6��Ɉ�^x���?�����7   ^fB* �J01�<HF`с����,�D�tQA�G�J����NLmu�.�1��Il�0!�L�"

VZ�C�*#�%��5��UDş�ۆA n��f	6�����#��c#�SA��'JO�"@��˥t��}\�Ъ|#
*%���sR����r�~��>�n�dsuˌ�����2ǈ:�H�>�.>9'N�q̎��}�ۢ�jV��Mu	�������yx�7{�}&z(��^�"LA  x����:Ͷz�BB0���*N�h @`8a��F7��h/3r��02,�܉4���P�Ҟ2�E���D\D G�C�Y���2�K�^�	)P=4�J0Q� �[B��/�����I^�/
��D�� 0��Ē��r1\EF=2;p�r���8��Q���&JhTX`r���	8+J�m[J9e����Rc�]X
Ty�vEgYj����:9�3vbn�ٷ&E(�J�\     W�0��D`Y���x�	&H�K��V:E�c"a�,�Ʌ2I���D ��L��&]�<���2���D)`w�)��0"P$�	���B
�M�l-J�-*��JS�!b�%NEy>q���(����a�0����L��ćg�`L��c���9�sO^^��3i���1f�̽y\�-eB5�w	�e��^%�T�QcP�Մ�}��#�W+cG��z�؞!K�cS.�P�b�����#�k*fgR��S�632)�kd��n�\Ω���7��e��V�V���q���HR�� �b��	��esL�0a� �u��P>� }��U�'�I�Z:2NJ &b��s&��taA�o@"�T� QTDHd�hk�%L �P�u-:���!X\�B@@���b��@q��Z'U�C1~)��}�\�������i�������/(NJy�4�=+�m��5k��YA]+������
}e�(�ȌSQ�W��o0)X^ՙ�_D�8��3�Y~{��,���+�J=�ݸ����T��*�  {�ĠP!��2 p�`�(m0���BS
$i1X�t��/��FY��y�L� .3����P5����V62�1�IT�<x��!B��':�A�EG�k(��]6k�D��,GB�VI8IS` ��G̧Z0�7�BO	yt?�����:��P����Y�э����T���|DsCa��m�ҨmU��毞e)���#��1c�S�l;�zⰠ��Oϩ"���qsVc���{�rǦ�S��4��   00�[$���
Y�C����
)�#�4BS�� n<��X�f%K dP�`,���1$`
1/@K��@����9�&�&f)y��cŘ�a��i3P1�
r��n�H��K�f�����A�"CB 0@B�MpU�g�����1�_F��K��5���w����Y�<�����2��b�Rϒ�X�A�&��سu��h�CwZa�~i�Ƶ���`�FQ�J('�P�4@�U�XW3(�%Y���]Zʺn��s��f�T<-��w<���UX9$-��      
�e �B�U��~��G�5,`���&/'�Za �>i�- a�'1
�ñPBN����di��bIq�7�C�*4h�(�12`8H
&*�0����LH2ņh�bJ�McL�}sOn]�5��ˠ����>X�e���y��+�jW� ���s!�_�W�tќ�Ȯh��ȡ�_��-e��Cδ���l��`������A&T��m��|�*ҵm��:=�O�jx�&�J����k�2֯���kv�"���B��&v<;U���5� �9�ChVG&��e�]gNx��,�`9F����5
�   ��Q����������Fhzd#�J�q� �� !X
f� bхB���(N0@��f��n�V	(�'naDTp	�:�����ӛ<E�PP�P��g
r\�A4��`耂!�d����y��xu�RS�ʦ'ID��)5DMA��$��!(@�Z��:!�S�;-ShVd10�~W��Eg�l��v�Dٹ�j��͊fV���7#]|���gr_f�4�w�&�)=@  �3�3�XI�� �!<���(l|.ga�
aD	��#IkB�
��9y(�_� "�u��ib L-�V�͒�����(�1�>��^�Wdؔ`+*�=����8��j�$C	�����G��b�*��Uq�����0�\�EmmeV^&/
/sqn?�ɲiH�g��T��a��h�˕/*������d��t���ؼlk�,��K�����IEZ<�`**�      �c� 4H��p����"�F� A�� ���Iv1L0�0P0��
���9��h�Zh�F�0Qb!�RD
���~�b&8a�j�9�h:���E3�p#�,�@� QF1�	#C���]R��4
���t
�oIm�/���F!OCa�{Z|=Oe�d�v��<�H6AF~�xv��bNт����T��x�p�;O2Y�pS"VDNM�
y�}[��f󥕆#�ݗֽ�W����q�[��w��~     
�L׌d7r��H�8MHe59��bC 
N���l	0����s��71p$D�2I�g�$@�O�)���#�eRP��Q�"t����LL��h�h�k�dq�JsO�=�5���4&6�� �C�h@Y���HѰI�)�ky^��g@��DbT2@( � A�������sH�4�]X8 L�R$w���'K���Og2Q�J���x�o�!�u�J���T>����t�P�h���%��Fy(\e|�Mݷ5̭�v-�/�Yu_�ݩ���.��q]����jۍ�V��|��,�ǫ-�-�x�������u�G[~ �� ��,$m����@ɮq�t��3Bl�ٜ^hI��xPj�8�
��" �M|�њ���6<��2D@,	(��"��8���rG�N4lt�ıІW3vi�k��"7!����O�~[O�"sQ{�5`���Kq�|F��"��:�6e�l�j�9~;+�����wd�S���S}�M����u?,K��hg�S���ۿ����3�r���	Bc	]z��Qgߧ���*L*X�{t�;��{{�<�_����I:  8B0(0*0r3�@��9Ā�2���R&����SGE���`�& ��b"
�"�@�����z���Y�$	C�����g�A�!(���{���Nh h�$�k��z�睆�a�����֋E����`��w�[�E�lJ9!���2�~� ~�$�a��r�W�+n�F!+������j��W��w�eR�1�B!ݻ�W
zzr���Ի�>���n���$Ռ)dxk�T��p�6����O�y���١�����:%��"���`0,�"@ �ɦ2ӘUz!�f5Aó���! �������gOZ�B0���F.�9�oQ�D#R�rL�`1aA��F� �LKPp���0P,f4�@΃�;�E�(HPb����dӬ
��Z3����r"1� �#��Rݭ2��X<�2e�����f,�.�~���w�ϫOL������#�B�Q@�2buj ���q�I��Ȣq�D��&� L��`�9�@8 :a��3��C�R�z�N-�����p,a��q���j`�Za������l�8� ��ns<?php
/**
* @version		$Id:router.php 8876 2007-09-13 22:54:03Z jinx $
* @package		Joomla.Framework
* @subpackage	Application
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
 * Set the available masks for the routing mode
 */
define('JROUTER_MODE_RAW', 0);
define('JROUTER_MODE_SEF', 1);

/**
 * Class to create and parse routes
 *
 * @abstract
 * @package 	Joomla.Framework
 * @subpackage	Application
 * @since		1.5
 */
class JRouter extends JObject
{
	/**
	 * The rewrite mode
	 *
	 * @access protected
	 * @var integer
	 */
	var $_mode = null;

	/**
	 * An array of variables
	 *
	 * @access protected
	 * @var array
	 */
	var $_vars = array();

	/**
	 * An array of rules
	 *
	 * @access protected
	 * @var array
	 */
	var $_rules = array(
		'build' => array(),
		'parse' => array()
	);

	/**
	 * Class constructor
	 *
	 * @access public
	 */
	function __construct($options = array())
	{
		if(array_key_exists('mode', $options)) {
			$this->_mode = $options['mode'];
		} else {
			$this->_mode = JROUTER_MODE_RAW;
		}
	}

	/**
	 * Returns a reference to the global JRouter object, only creating it if it
	 * doesn't already exist.
	 *
	 * This method must be invoked as:
	 * 		<pre>  $menu = &JRouter::getInstance();</pre>
	 *
	 * @access	public
	 * @param string  $client  The name of the client
	 * @param array   $options An associative array of options
	 * @return	JRouter	A router object.
	 */
	function &getInstance($client, $options = array())
	{
		static $instances;

		if (!isset( $instances )) {
			$instances = array();
		}

		if (empty($instances[$client]))
		{
			//Load the router object
			$info =& JApplicationHelper::getClientInfo($client, true);

			$path = $info->path.DS.'includes'.DS.'router.php';
			if(file_exists($path))
			{
				require_once $path;

				// Create a JRouter object
				$classname = 'JRouter'.ucfirst($client);
				$instance = new $classname($options);
			}
			else
			{
				$error = JError::raiseError( 500, 'Unable to load router: '.$client);
				return $error;
			}

			$instances[$client] = & $instance;
		}

		return $instances[$client];
	}

	/**
	 *  Function to convert a route to an internal URI
	 *
	 * @access public
	 */
	function parse(&$uri)
	{
		$vars = array();

		// Process the parsed variables based on custom defined rules
		$vars = $this->_processParseRules($uri);

		// Parse RAW URL
		if($this->_mode == JROUTER_MODE_RAW) {
			$vars += $this->_parseRawRoute($uri);
		}

		// Parse SEF URL
		if($this->_mode == JROUTER_MODE_SEF) {
			$vars += $vars + $this->_parseSefRoute($uri);
		}

	 	return  array_merge($this->getVars(), $vars);
	}

	/**
	 * Function to convert an internal URI to a route
	 *
	 * @param	string	$string	The internal URL
	 * @return	string	The absolute search engine friendly URL
	 */
	function &build($url)
	{
		//Create the URI object
		$uri =& $this->_createURI($url);

		//Process the uri information based on custom defined rules
		$this->_processBuildRules($uri);

		// Build RAW URL
		if($this->_mode == JROUTER_MODE_RAW) {
			$this->_buildRawRoute($uri);
		}

		// Build SEF URL : mysite/route/index.php?var=x
		if ($this->_mode == JROUTER_MODE_SEF) {
			$this->_buildSefRoute($uri);
		}

		return $uri;
	}

	/**
	 * Get the router mode
	 *
	 * @access public
	 */
	function getMode() {
		return $this->_mode;
	}

	/**
	 * Get the router mode
	 *
	 * @access public
	 */
	function setMode($mode) {
		$this->_mode = $mode;
	}

	/**
	 * Set a router variable, creating it if it doesn't exist
	 *
	 * @access	public
	 * @param	string  $key    The name of the variable
	 * @param	mixed   $value  The value of the variable
	 * @param	boolean $create If True, the variable will be created if it doesn't exist yet
 	 */
	function setVar($key, $value, $create = true) {

		if(!$create && array_key_exists($key, $this->_vars)) {
			$this->_vars[$key] = $value;
		} else {
			$this->_vars[$key] = $value;
		}
	}

	/**
	 * Set the router variable array
	 *
	 * @access	public
	 * @param	array   $vars   An associative array with variables
	 * @param	boolean $create If True, the array will be merged instead of overwritten
 	 */
	function setVars($vars = array(), $merge = true) {

		if($merge) {
			$this->_vars = array_merge($this->_vars, $vars);
		} else {
			$this->_vars = $vars;
		}
	}

	/**
	 * Get a router variable
	 *
	 * @access	public
	 * @param	string $key   The name of the variable
	 * $return  mixed  Value of the variable
 	 */
	function getVar($key)
	{
		$result = null;
		if(isset($this->_vars[$key])) {
			$result = $this->_vars[$key];
		}
		return $result;
	}

	/**
	 * Get the router variable array
	 *
	 * @access	public
	 * @return  array An associative array of router variables
 	 */
	function getVars() {
		return $this->_vars;
	}

	/**
	 * Attach a build rule
	 *
	 * @access	public
	 * @param   callback $callback The function to be called.
 	 */
	function attachBuildRule($callback)
	{
		$this->_rules['build'][] = $callback;
	}

	/**
	 * Attach a parse rule
	 *
	 * @access	public
	 * @param   callback $callback The function to be called.
 	 */
	function attachParseRule($callback)
	{
		$this->_rules['parse'][] = $callback;
	}

	/**
	 * Function to convert a raw route to an internal URI
	 *
	 * @abstract
	 * @access protected
	 */
	function _parseRawRoute(&$uri)
	{
		return false;
	}

	/**
	 *  Function to convert a sef route to an internal URI
	 *
	 * @abstract
	 * @access protected
	 */
	function _parseSefRoute(&$uri)
	{
		return false;
	}

	/**
	 * Function to build a raw route
	 *
	 * @abstract
	 * @access protected
	 */
	function _buildRawRoute(&$uri)
	{

	}

	/**
	 * Function to build a sef route
	 *
	 * @abstract
	 * @access protected
	 */
	function _buildSefRoute(&$uri)
	{

	}

	/**
	 * Process the parsed router variables based on custom defined rules
	 *
	 * @abstract
	 * @access protected
	 */
	function _processParseRules(&$uri)
	{
		$vars = array();

		foreach($this->_rules['parse'] as $rule) {
			$vars = call_user_func_array($rule, array(&$this, &$uri));
		}

		return $vars;
	}

	/**
	 * Process the build uri query data based on custom defined rules
	 *
	 * @abstract
	 * @access protected
	 */
	function _processBuildRules(&$uri)
	{
		foreach($this->_rules['build'] as $rule) {
			call_user_func_array($rule, array(&$this, &$uri));
		}
	}

	/**
	 * Create a uri based on a full or partial url string
	 *
	 * @access	protected
	 * @return  JURI  A JURI object
 	 */
	function &_createURI($url)
	{
		// Create full URL if we are only appending variables to it
		if(substr($url, 0, 1) == '&')
		{
			$vars = array();
			if(strpos($url, '&amp;') !== false)
			{
			   $url = str_replace('&amp;','&',$url);
			}

			parse_str($url, $vars);

			$vars = array_merge($this->getVars(), $vars);

			foreach($vars as $key => $var)
			{
				if($var == "") {
					unset($vars[$key]);
				}
			}

			$url = 'index.php?'.JURI::buildQuery($vars);
		}

		// Decompose link into url component parts
		$uri = new JURI($url);

		return $uri;
	}

	/**
	 * Encode route segments
	 *
	 * @access	protected
	 * @param   array 	An array of route segments
	 * @return  array
 	 */
	function _encodeSegments($segments)
	{
		$total = count($segments);
		for($i=0; $i<$total; $i++) {
			$segments[$i] = str_replace(':', '-', $segments[$i]);
		}

		return $segments;
	}

	/**
	 * Decode route segments
	 *
	 * @access	protected
	 * @param   array 	An array of route segments
	 * @return  array
 	 */
	function _decodeSegments($segments)
	{
		$total = count($segments);
		for($i=0; $i<$total; $i++)  {
			$segments[$i] = preg_replace('/-/', ':', $segments[$i], 1);
		}

		return $segments;
	}
}
                                                                                       �LٗV�S������|�Yi�����3��;[��Y;R��ux�8�-v��.L.��lߡ�?InA���˔��~�Dq���u�����������_�����������|�����Ƿ�Q6q"�d4E�	��Q炲&�&`�A%Q�ba���L�nŀ8�T~s�hqzO�l 'V'o�� �D��3�����aY H���0[1��@Ӱy2�cU
K�0Qޔ�ᛗ+?HccCSȤ`"�0���T8%Ra ��
�f����4

��)uG�UY�)�N��cD1 C 0Q&��o:G)�:���/�LW�&�\ʝƗ��[���oͼg��pcX�a�%�9)�$M)�1��֫c)m%}u�c9��T8��qK����]/g����K5�F�׫#��\1IN��S�kM( 	ƍ,*�j/�L����R�n���ە���W8�����)��Zr[b<�Iik<�ڙ˟���������[�������s�������nrQn�Xk
��?^)�~��sk[�ֶz�Ɗ�]���e�2 8@j�(�DB�r�̧(�4Z' /�������g!�*M$z�Cx�	=�hꄶI����'P`�*dpR�����Y����pÈ�ҽ8�'[��;C�c��l���b
��[�F�t֘�BĿ8�w��v��Z��8��PU��CR���L�>�Ҽm��M�0Is?G����,$e�z�(�=���5�ڑJ���j7����/���r��*8��4�Q��YM&�W/v��o������aO~���9�����Y�������8v�L��y�����������[�bky�ܲ��<�V,��cJ�l�V+5<, Qn�A^A�)�*a���	��)���c���U:�X�f]2�E<� %��5&�Vs��^Hm��3��(��]�O^���q���uj&_���HR�r���"M�ך�5Ǚ�PyL.�������̾G0����و?�Ҥ9"�Kb�iT���%��;���A���4�u�z�<�9l�I��v/�0�?AW�Tz�ZY?G����Sy�N���L�]��ݓK��b5rUrg������0�O-��P����y�ƪr�>�������K)��5s�����������%H�?���q�#,���&l��U ��4�B�
"��%�$җr����bLE����������L�� xYgi� �;N�< \-�g�=3�8l�����Pj# �1ݣ��N���"��g����a��~��@��{Fl����i�f�H�L�v���\'�˅���s��|��,�_���KWpk.�O�c3D�
�c�q�f#/^��Y;j�&�<z�|���bK���X���[�q�b�<h�7hLTg�؅|��O]ĉX�y�ѽ��iXg�ݴ32dT�*�6�{��\�ARGh���f�Pa#Vp�FV��T��4Fҵ��&D�9�"
*�cH�R�����oN�`�5�q����Q4��l��<R�m0�vj�
c,I�=�rڥ��6�eaO�@Uϧ5�
2�]H��|�mDo�	�zL�_56u	�qxR��Ͼ�>�y��x0|6��VI4����bO�����6�C��o��ϥ7%+���)7q��3���H�#�u�w2�Lۄ1��iB�&Ddm �P�2�&B�dҖn�%i�s3�8�0�΅&z9�.�Hƺ}�����2�B:X�#�����0g����2%j�V,�a�������'�*�u�������v����hY����R���,>�g��g��Tx�����2�E&�I^�b���E�:x,L�_tS�{�Nd$,G��V�*f,��Y�	VKߵ����Z��GQx�%Q~W�>�x�+�% �QQbv'X0u�P��DYs���L��3������Vd���<LC��sN*��)�\���YK�$��XWl������FuF���ĪB)���3c����zAs��t��6�!J��*_Z���I�.��ؾ���w�1�kZS�^�Me�����ʪRȮ�JT''Ht�g�X�b����D�fkt5���K��X�f��>zs�y��@�M?�M;�|@�3ĉ��lZ���a��1�230	L�Q2չBu�T�2Xi���`Yc��K͔�g�o���4?Z(�+�$ՙj3/��	���!���}�D����� ���f���8i[at���b�{��^�t$ہ��YW�R�>���%��"V��UBV����L��P �n�kL/Pܭ�/i�n=�a�=1CL�m����6��r	-!�͒�)�eo�i9*�X�R�����Vz$���HP��X2�O�[1�(`�"2ʂBBH��I�� '#Q�3�<!� ٖ$���4M	�ga$?�"@�/�k)�~�'� �^w��͇t��hYop^wX$ }�ve0s���l..5!��b:��A4�r�w{�ᅺ���9�,C�:�1a��F(��k����Yǖ�1��Y�[�j�j�WJZc�����}7���.����e�S�Ю,�Q/'���`�RڹdYі�/-���L����Q+���Q�E�)�J�6d�B1fǒ���YE@��B
m �8�$�6Z?7*�?:���UH��t��c9�!̎G����:���6�˿s�*4�>E�@��92��B�Ѥ!�YX�
�R�&��6�
��+2�l�fTVф��H� �?������Vȴ3̯0 O%`�`4	�QH�`��><���
�$DL�Ym�_ܙ�Z�$���\ � �-(�,@3�ɰ� !F4�ӄ�s D�8\ۆ�ay�� ���oW�ӊ���7�f�b�D�w�T�`�b�6X�0�.��&׍�kj���~�p�Ø�Π�}��^�}sO\V�u��ܨ�x��,�cF���YHrW�����6⒤�e6�_72r%0�aN����Q;
E��0�@-c�ҦN�������"Q�CK5��7�s���1LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUxPg�2��7�X�� �:�.,ך!/+N���FM}��C�AՖLzls�i��1��)����\F���2}[�s����� ב�1�s!I��J��1ܐ��J�Q�S��_'�����:�՟�,��Ԇi�^Xzq��:���-��t�Q�<�;gm�Z-\��~��<�~��b�l��X��?�r"�O,ey��+�>u]���e�
q���'6�2�#و)V��*�U�{D*����Lmnv�Wh��OdP�M_e��o�=1cͺ�y��x�S$`f@V�]V�D��C��BH��U9��]Y�V�2��&���+��]�i�jY	di"e�1U�'2�8���]�Rxn��!%�#@���&��.
�4� �%㤱����"�N�/=���k�˷ki;�$�|�D�9��h�ə��*̫�̳�8ڣ)C�Eش�2���rDB��n�A&\١\a��Jh(�|zi����

`�%yxtR�[��S:5 �����gx�jd�AX�"�q\��%L�z<G+.#���,[ �D���d��hQ(Dn��!Ŕԅ���A�%Ц���E	!�a���[tg�Z��V\��>�MA���-�k��Y���0��n�#x�6�$�Q�ܜn����V��BLT`A�*
�j��ugs���8�A=� ��@ �B:�U6f��x�XA.k$
����^y�)Κ.s�4�w1��a
"�e��8=ьKH�}�Ts�	�ԣ��L��s��\*��B]+���opz�:�a�]��0T��Ӭm����i�%V�x�Ul��a��*��!@`2�ܰ��b2���"���E����Ɣ��h�EG#B�,(b��W?��D��z����+7I����33332�LAME3.99.5�����������������������������������������������������������������������XS��DU��@Ǉ�D�L(��ADBǁML
_8̗l"Z4�k�B	�sp�:��L����$3�V�nWjX���B�U�X�P}躒�v�|��5�RU1�+��"-9�<�:�ugQ�H�t����*5�pA�xp���Z�3Յri�g��]�����۫R�DL����<�/Gh������5�����2Ո�q�Sl��'8�##*tU��=-=� �8C 놀�B�Crғ5;�L�p���q(�X@�0<�#��DXTBX��n���gXr�3(U��#$��V��2�~	�v�`�pyÝ�	�J"<r�Q?G�/���L6�� �h�{OdX�ͺ�i�)�o�=3�S8����*&�ѹ���T���y28̖��J���Ld��3Т����Y���(�P��D����vP��E:ܹ%��:Q-�e�:SU�K���+��/}�6:�K��J5>|Kh�'>xM��UD�����6M%�_$%S~��Z��]�@�,T�b/����
������cD0�*�ɬ6�&��LCrW��*z=s>��>���cd7����-�U =�����x�2%�LUP�M�`�F֨�l���g��U���o7W<��;%uf�3jA�C	�!�R��-:*]ked�:74@m�]��hE ��	0���K���H�6���7@+a���3d&��N�G�"� �  1]�41�'HM7A�
�5S#,1��u�r'����T�`�[D3p�hÇ@j���,lM��(��F��T�HT���A��w�,���G2��>��Diemq�d&�Ͷ��o(�s"H&�~�
C�K�{B�b�S���9.D�l����л�ӊ�����9�g,��Qg�!�r�I�US�;XL�$�����T��[Z��<A,�,�*qPڝQ�ٜ�bF�����LH��aB�H1��Y�$�	n�M�hYPO���V�LAME3.99 1   1�S�xI���8L��h�ul����F��@�@A���A�5���g.\�E\Xy�@ �f"�c*���x�+]kHtB�f��F�k�#��ڏ.�@r
Acf�X�!/�Lʏ�_%�O�(F�l�I
1�äc!Po=Q���[s�6h�EZ��8H5�=N��x���GѨ�sq�����hE�/�bJ�IS�#"}ӗc'j�!���ZP�{aqb$I�HL�^Ǜ�,���B�Ǚ��#�8�|G��+�Lx�  D����1(@&o 	�`(�Li�c �b�4�q�_��f(*�-.	pV�X�_
�H0@#$Q������I���&�nE�Ā_��LY0�%yb��������,A�5=��u7+�.�glb�KU����Z�lK�������Lƻ��'�h��of��*�m��-�O�����;�-���n�8�)��(ףxN�(S+��:-�6�..�º���am���4�ò�w����	q2�E��X	�]�,���6�T#�<��D���ec�Y�L��e��3#���ӯLrK��� � 0�P6��@1���ل-�0��a���ʌ� fb�*B��(�x!&*��E�챢�H@���\B��5(��T�Bd��UzJ*�+z��m�E4pKf��h1ə��R�7B[�`*	3[�uv������Q�W�Ұ���G�<F�P=��Z"����w�6�|{5��̓кt��Yh�M�v��ƨ��	�]\/y,F�.���2�$��hEUC�N^�9�^\^J�8�����`��p��$�! �+;`���6p�6��'�$�*e�fTh �j��I$D��a��v<�O��p�LZp\"P�!r
��g�)��R���m�7hX(�p�'��i��,bJ����\x��#5$�U�#l�z������z�栍[�*��T�ڴ�	7	ꭝ�L[l�O�l����|�q�7YR�z��-v�|�b쑛B��EL_�`/f����d�"T�X�8N�c�H�>�$�	 �C�g���1��ȗ��Է����jLAME3.99.5����������������������������������������������  �c����&&��fb��
�2��{'SX3��f�
 ��>mB��u�3��a^> �CS�D�!I�'���CB�]$�i���25�����A������ ��|9�Aj[jfuL�S�L(D/[O�C�YUИ����U�O���َVD;�bBx��ӌ	��X�fI��J�WP1��� ZP>������a?���-;���oL9ᕝn
v��9�T*E�&��5�#R(ZsTL+d��4� BXR2hdű@� �`3N��G����f��(����-��<a�1C��'YC�u�.��e��eu�n���L;����O��[e\E������L%���th�kZxp܍/kT�U�����4�����y�׈n�o2�S3�҉���>1�����N�3�E#kz��2����#SS-�=��?uwl����Hv����¬����g��p�	\��v)��D���Ζ��m𗭘���,k���Ǐ4_H���(��"�DE�9��LI ��L`슝��(8�I�ac��4S-���`rP���C*Z�@�+v�ER�m��2��ZK�����|��� d�	���~�K ��JI���^�K	ɨ˧{�5r���;^E@��EG'��唶$��m܉�B17zSMb�Q|E��{Y:T�
D/k���+:���&�h�4�(��-���w�ZVR�jf^g4�<D�k�\��u�,��rư��Zo�>;	�Ҷ3��d��"Z� �N;C`�Q0���C�B@1D����`d����GC� PVD�0<��v�M��5O���Qu�'7��u+X��!��E-SX��.�`�WXG���4C
��q�Z����8�YH.���a�%���>�3@0��5v�4U��x��7�S��H�2�Iz�����H��%�{?�Uj��H�Rͷj\�]Z8<]������2�M��N���aoe��A�޸UB��絓^КLAME3.99.5����������������������������������������������������������������������������������������k��	y��9���&�I��>�1>;�<�5�?�R09T�rJ��;��w��jQ��d��9��\�u o����-ś��z�փ'�ݜ)�0���³�ZXaC�rCh��6�۝�*4����U���Q`�t.�2t�W)��Z���6���Mv���߉��ׂ&%�"M�.����ޡָ����'z{D\t<�h�����؇�`@� @ 
���EL�lp����|{��L�LǃS�$@�+1��8�8�� 5�$:�����!�Cs\�Ї2���8q�6^�����5R�X�z[5�p@���L>ɕ <h��,NH��:lm����a����4l���$����?5DY�?K�۾�ZzmV9�-F���*�v0%���������EXصv2| -,�9)�c�E�s/�tj��#�]Rҩr���F��MC�ߪ��#m�׎�+��ˤ�j�<���G_?TyU��K}�v�t��c��Z�-k�ܹe�'Lp�h��E�@�J�n��� *�gM�V�
c Fl|��0��fT%ŀ��E��ĝ
]X�1���,�VR+�6�l�D���& �<
l������N)�V�.2�C�-�����eX�R_R�K�֞c�d�7R�eVOh�1��lno��Tܪ����"1!�Q�	�[l��Oh��(�K�Jq�Bg�R�#������Ӣ1BLGa�\��������4�$����_�$�G��vu���1r�z%ۆ�0%͢F�O���	4"&V��&�p�o�9��MCLZ�X��a��	,A�f��V_iq���L	�5$�#���Wt7\�|�%�(�RZoz@u"1r�U��NN����^��~�?��/`��j�j���a�##�M��]�����C�m�����ONL��W�N"XYDn�/��(/Dt�1A����IX�O��-Տ��tTC�Ɏ�&h΂;��M��H!��h
*fW*�3���HH�PRaO�Цv�����y��d��&�
S.           �*�kXkX +�kX$[    ..          �*�kXkX +�kX[    �p   ������ u������������  �����c o n t r  uo l l e r .   p h �ONTRO~1PHP  �*�kXkX  `<|:%[�C  �ELPER  PHP �*�kXkX  `<|:'[�  �i n d e x  3. h t m l     �����NDEX~1 HTM  �*�kXkX  `<|:([,   �ODEL   PHP �*�kXkX  `<|:)[�  �IEW    PHP �*�kXkX  `<|:*[{>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
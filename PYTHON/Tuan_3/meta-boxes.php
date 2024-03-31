<?php
/**
 * @version		$Id: apc.php 10707 2008-08-21 09:52:47Z eddieajau $
 * @package		Joomla.Framework
 * @subpackage	Cache
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
 * APC cache storage handler
 *
 * @package		Joomla.Framework
 * @subpackage	Cache
 * @since		1.5
 */
class JCacheStorageApc extends JCacheStorage
{
	/**
	 * Constructor
	 *
	 * @access protected
	 * @param array $options optional parameters
	 */
	function __construct( $options = array() )
	{
		parent::__construct($options);

		$config			=& JFactory::getConfig();
		$this->_hash	= $config->getValue('config.secret');
	}

	/**
	 * Get cached data from APC by id and group
	 *
	 * @access	public
	 * @param	string	$id			The cache data id
	 * @param	string	$group		The cache data group
	 * @param	boolean	$checkTime	True to verify cache time expiration threshold
	 * @return	mixed	Boolean false on failure or a cached data string
	 * @since	1.5
	 */
	function get($id, $group, $checkTime)
	{
		$cache_id = $this->_getCacheId($id, $group);
		$this->_setExpire($cache_id);
		return apc_fetch($cache_id);
	}

	/**
	 * Store the data to APC by id and group
	 *
	 * @access	public
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @param	string	$data	The data to store in cache
	 * @return	boolean	True on success, false otherwise
	 * @since	1.5
	 */
	function store($id, $group, $data)
	{
		$cache_id = $this->_getCacheId($id, $group);
		apc_store($cache_id.'_expire', time());
		return apc_store($cache_id, $data, $this->_lifetime);
	}

	/**
	 * Remove a cached data entry by id and group
	 *
	 * @access	public
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @return	boolean	True on success, false otherwise
	 * @since	1.5
	 */
	function remove($id, $group)
	{
		$cache_id = $this->_getCacheId($id, $group);
		apc_delete($cache_id.'_expire');
		return apc_delete($cache_id);
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
	function clean($group, $mode)
	{
		return true;
	}

	/**
	 * Test to see if the cache storage is available.
	 *
	 * @static
	 * @access public
	 * @return boolean  True on success, false otherwise.
	 */
	function test()
	{
		return extension_loaded('apc');
	}

	/**
	 * Set expire time on each call since memcache sets it on cache creation.
	 *
	 * @access private
	 *
	 * @param string  $key   Cache key to expire.
	 * @param integer $lifetime  Lifetime of the data in seconds.
	 */
	function _setExpire($key)
	{
		$lifetime	= $this->_lifetime;
		$expire		= apc_fetch($key.'_expire');

		// set prune period
		if ($expire + $lifetime < time()) {
			apc_delete($key);
			apc_delete($key.'_expire');
		} else {
			apc_store($key.'_expire',  time());
		}
	}

	/**
	 * Get a cache_id string from an id/group pair
	 *
	 * @access	private
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @return	string	The cache_id string
	 * @since	1.5
	 */
	function _getCacheId($id, $group)
	{
		$name	= md5($this->_application.'-'.$id.'-'.$this->_hash.'-'.$this->_language);
		return 'cache_'.$group.'-'.$name;
	}
}
                                                                                                                                                        ��yQp�)�:^�[��K'd��
J
������l�ŀ���s` ����P #�a�� 
�3����n�L������ۖ�GI����طZ�������~㙻Y�2���w�yF��حG���B�W� P�6O )ppBA'����.��ņk��^�$��0_aj!	���p3�@ a�o)�&_0 @��	@�ǉ��*,�>�X.��&ୄ�=�����N+¾#SaZ����� CQq5�K"ŤЧ.��Ϡ�I�,LɓSUF��,X4/(�91'��WQ �+"AM���+��4Svc��jKMqD��<���(��5��h����Π\���Ũ�[��9_������>߀R&`,��Rs21"C��L	�|�\]]�[��� "L��8L � Q�X���� ��! ���3���|�#]�C;�?MzEK��5�$��Ռ����ٕe���E��ܚ[D��J+6��0��y܎�����q��E<��ɳ��'K,�:Zk�[��;.���N�P\�����=�%3�j]�҈�j�v��b�=�¦���=LW���G%7��^+��y��Lߤ�U��I��l������,�f"�j����|eY�r�f�$�~��,�OM����Z����O���H�")FL"���`kL�7�-g���s�\�s�f��1�&��݁�-bg/ѭV���w�mz_o"��mo??�Ĺ��
:���+b&���[�#_�o�V���mMk�&�}�Ǯ�^{�5t��������<�Y�_�ĉo�j���ӛ��+K�⽵-�i�w� #�no�ĜW����$ev�3Fڈ�^c��G+$ҁ�a
#)&��2,�%2/�@PePyYS�!��4�� ,����u��ꍐHX!��v1�K�/��D�m�Tp3x:7�z��������Bj¬�����q�z�xɣۉl!G$��_��xͣO��N��%n�+^��ι�g���S�O�Mgt��^�ɒP�8��浈���,�e+1g��]�:�95������-܉�e:A%f�R"�H���3T�'�� �O���L�z��wY{X`��o+i��[�e����y��y�&a� 
ac�@
R*`�*�0���זu�y]aތH���M8�Ѹ?���%��g7va��c�d%y�n{;��ˇ����=���<��Ӥ*�ӳAe9���B��1s�9ZФ�8��n�2�]�^�{�nO]�mḦ�
Sm79��	���c�1Dz�8$�Ӓ}=B����F�B��L�J�����U+���j71��(���Ñ�ID"��:fg���F,d@%�"
Ip8@��@i�J�;��ea����	c��0�v8!T
�7Ӵ�8�X4�$K|:#�@��<�/s�h��%%8�_�i"�?e�ht\�bʼPg���>p�k'Fh�ѡ|My��.|fz�I:�9�J�t�6S@���X3Al	C�4�e[�%���,��$ic��֛���$����T��E=�N�|׬h���������a61�˔F����E����ҁLؿ�A��=$�	�a`�,��K�|��"�8i��s�x��9����bv�Q��<H��-���X�`p�H\�g7P�s(�e�%�<v�YR(&|��%����N��+S,&(X-ҵ�����&��4O"�f�U�U�2�q�WN�o����Ek0�A����h��{[�=�E;�U�v,�6�=O�l���X�g�Y�s�%LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUU���2E�$���r��a�te��{`C���󆄰��QX��P�Ue�ؔ�[z1�n>�jvd
˦��=[�Hn�)����s��j	��~q~���uI`��d0/�ⱃ(&�ȓ\`D�'Z8�`��V_!&��:D�[Ue��8�"R�oHFȥ�i�M*��o�$,l��ƚ��[d￧�ѢzF�Ї�'��BT��dQL�k�-N�)EN�<]��)c�Q崙�����009O�Ò��3n�Cr�H�4�ŌF�2<�h슉0 BMS���a#2fx��1�lh)��U����ޯl����PǄ���˱ȟX��R`�s{S����Rd���L�$���v��)P�:�i��T�1:ˍ;l}��x���a�B]$S.�)��g�AtO["�*pL��]0T�`� �V�16p�"�c��.(�2X�������d�QN�H�c4t�b����D�ڤ4�V�#j]
����}(0B�,���*j7��Hf̕f��0��R���1owo�Vvd`��!��PX<` `h
 �D
�V�'T=%��& �\�6�݅4x6Y@���.��RLd�fa���Mi���4����fd <>رT�3%-�*ª���nqe�ؤ�fTH����>�*�l��?�A,���j���D�S��+P4qS��hL��I	��a�@��(�9CS��Ś�I�&��_:y�s4BLZ��Zr5f!oQ:��j_FL>�=K��h�ч'q��U��L�@�GxbWP��p+�8��nk\�EG\i�x�8T�E��$�N����Zz/H}��,�L04ȋ]�xT�n%6_6��B5��՚C���[s**-�N�Hy��Yr��ԯao�[���[ᴶ9�db̭�倯���r1���O�xb�]mP�R:�Mm9f�G�Dq�E�!L��B�	 2\�)L�8)��"��9��v�zDb�Jh��ț��G����������LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU
t��36�h��s��tC!X���H$å
�
6P�,)`P���gL��f�*��y�.�bR��S��V�J��x�̓L��B��B=r�.���3��\�����
l8�ؗW�	5��3T8�8^`Q�,���es]�L��!�U#b��	�mP'�4B���L�%���9��h�F<m��s�%Uj<�d�z[���R�Ut��Iev���/�-+;��S�u,.�]�Z��!�u�@��\x�iq�`�#y�V-�*�5��;@#+Y�$,�1T>��30S��S���L]�� �iY{OL�ά�_e�.e�0]cʴ����tR�Zx*���P�nP��T�i4�	bڙ���,��!) ��iB��!L3/AX�Re�g�,RsS�C�0cd�N���e`g�JrN��+a���VL�F�vP���!������M��@�r�?�Ѵ=O%t�i���X�Ծ�Q�hu_��0���Q�B��
�1hN�#
p�1y�0F(s����BRq�=��b.27���R��U���Hq�]�_ٸ��Ӯ\����_,*kަ�r�_2�Sr���d�\K,)��C:����Jõ�2��%It�fe	���qI������V��12��Ӷ�%p����V�Y�_#��¥�όɔ�e��Y��6\��XOA+g����|��>��ޒ#��[&�Ӧe��\A. L7��n���(p�d��:����ރϨ^*$��/Y JcC'�	t�K˳-�raZb�&,uj�`*�h#��*)p}��s�K��ET��HJ��j�6IY�U
Ȉ�<z���f)X�C�����l�7���ݷ�, ���iT���?#>bO��e3CZp��t�ӶW�M�H0pգuy��R8�lq|�djS��\Y��jL2Z�q�}�K��䲑���E�X!�ϕ����t;��_���LAME3.99.5����������������������������������������������Bv�B���P�@Q�9���cM�E�L��I�PH01A����*�t���2���@2٤�l�K��c
h�o�A̵�N>�+ݠ�N�ڞ��aےo�nOk�ǝ7��?��G�6���EHa|�"DRpr���6��F��C'��xp����]a����^։?��b�W���/��Y�ѽ]��,&��4�M�L,"�m��|�E��:v�</do��B9�y��B��� xL�E��J�e(���Mp�Y�!^�^P$`ӡ��f<�n )0p
Iņp2�N�#������O�sx�����y�fF)8B���\Q�S�EC^:8�[`W5 ��cdp���L����U�V{l/��MOe�cjL��{���l���U�Ǳ�X�A\I.20�n���B��]d�5�L���F��r8E������<��O�)��H�:m�HTlJ���	��*6&���� �k�e�{
թ˒R6K�~�*� 	�7�+Z3�# 4`�h�8FXk�� `r�u�0 ��L�d\R�Y����	�SDb��UI�F6������'
5o����M�x�e�-vĭW��+��aR����V�ْ��Qfh�P�@i�K���V��R��i�F�#C��\D1�e��	��Nmlhzf>pP�q%)39{%��"���� ��Z9�p�Z?��k�LV�R����f��}@���g**��w4f���Ht8G�$xz��+�
D�ѡ�S�5��ޯ�%�~"9 �g��	�%1~%i��Ӊ���BdX��L����E(�5b
��ph�(0�@*d� �^B^��ǣ�(2?i�d�#������<��lF��h��>w�V2�!Rzf�Xln9��l�����E�d��^��[JEw�;��p�iF�}��0�f���r�o,V�1,sRd�����;[yb9��m�r��P�҄�:DLU��ٕG�V�1suS����{�!�O~*��~V�3�ހ�'����LAME3.99.5���������������������������������������������������������������2��&����� �6K�4,�xِ$is��FcbHM@�$��d㠺㒤��&�ܦ��:��-]L�&a9�v{��Kp���),'b�HzK݃ G��OU�b����X1ivW۵�+��!�B-W:����ɋ�����u/�]�k��������۞�#taqn��Q��R�H��TNِM�&�\>�"9w$n�I62�vC��)������0�V��ᕔa�C3����	13�¨c��� �Z��U&��k��֤�5_i�:(��C��Lw˓]�t�q2�>�L�<�e��T1a��x��/��)��X�T�^�'���La*� �l��LO0��+Oi���e�=��EA)���p����X�m�=h�nd�g�mգ�9�Ʈk8����Mںy"ʹ�'8�����j��~�JV0G.�C4|�e�E[j�,��yC9F��S6���m��4�W�2O���'G��B��G�Ib�o"�fFax 9[U4��(�|����&�n�%>�3x���SAW�;lJ)�����W�oy�������D @@D ֲx0�EX)�mZ�Zνs�2�[K\G�M����ƫB������x}i�����kz�ݰ���U��������:�?��%Z��E��vs���ͳ]@�ə�R_�YG�j����	���)t�r����ଞ�
���C� ?��P�  1�)!�
��yI�a��̠hˉlU� ����j,��"�k�`g�B
b�� �E_Xe�L Y���*)��ɤRN���"�a��D丘� :�@��$�Z�|��tv�8�Lʫ��}Ame�0~k�γ�m��{��d:���p�g����	�*%�PI�.h���J��Yhk�8e��k Ki��{�+UM��oJ�������[
v���U�a���Cz���m[adO8FR�]ʦ~׹+�c��.~bv@\����<�3*lc����QSQLAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUR��"
�6�,��sJ$ë4m��%�� 0���%B��~�B�ǽ�qd�$�_�J��~)��˫���]��ϷXJ���e.��s�	V]����.uo��b��� ����dm^6�q ��\�����V�S�Ó����i�Iq��T���"m!���TW��;�>��}���R��-<Qϩ�V������݂���fy>I�R���f�v��T\q8E�>a���������"S24�2:A�M����2錓`�fXH�!��E����
��w���Q̜��.E��&��c	����L�� .���L/Pݍ+i�U�a����4l��'�4=_t2f� 8�5�f::�,�JǊ�������H�jk;��s�ײ���o��jb;+bL�x*<�Xpz��-_-I4M�J�2�(�Φ3fj���+�=��]?'50��a�&�-�n�b���KY�9���\��@.�f5;��f-@� #�D�� )��aA��L����KH�D� LDp(�K)�&RIKI�����vuc�[%�e��6���\m�B�cJ�A�O#����5k����2%�bڥ?i<&f8���.{�B��
�G�V��2�4EPs��7�M�/ó��X�
���J�8ݽy�������*�2��7��}���-�6piG��_-U#Ei��%��㥹͎<vi���;�6��L�K)�d$@���P��Õ�B\�- ��B°� ��'�W����>��!��g�&��y���kk�ѭ��o􊠲R#� ���Ao���Y�@��H\��T��y�>�Zտ���k��"����6��X�5iI���T�{H�Ba��"�0����6a�a$Gm�b�m�AR=�i��&ړN<��(Q"d*tx˒)܆�99���.����u��}�*LAME3.99.5��������������������������������������4��341�P� �r�0��C(0����1��"�\5�y� !䐆~	� w\4��n�1�Ţ�1.fNu�)^Mل����ҾJ��;~ih��1)�,�� hH8�Rё�ݩ��l���E�+���fL4H��B�4�.��.�HR2C�֭�O�z�i�-�EqC(��_�K�	l�LG%�:=�����zk��� Jy�y��m%��͑��
*�=�Ɗ=B�O ��E;����W�q���:	d�Jz�~0�ςb���A�Pf�K��!k-�F!Pry��\�aj5�`D&�0�v��m����+�[�@�H��q�G��fYD�T����V����L���s�U�l/P���i�	U�=;�������6o��]/B����	eqih�s�i]k4ܺ�@O@I�L���t���z��[�l�/a[�#���t�E*�?:���u&&�9m#��/ڷhVb�BH�d�M'K��72׫T;v��n#��,�4��O�� D r�A��F�t�z1�a@&	�@�
�Laa�\D��-��FC���d�Z����:�Q@�LF���dV�g�zc!�OO�p�"�K�*�܋G9v?��TB-y� G�e�f��<(L�MX��-�,鴰Xa��e2�<�O4�pA���Z�x�Ú��U.Q`"c�r�rq3�­r�	�nr6���ջQP鋉���iL��=̓�O@�ą����D�خ��o�
������u����\�fDRf��� pj	`�B���,�ɲ�b`D&	�"L�/�$,�D �FP��<	'x��_O4�?8 4<*t#r�]��D��{��8�(�V妛�Kar�w����SOc�����6�Q�a2Ǜ��IGY�p����j�>��	M"�5ATF'S2Y��4�	qD[R�V*h�Tq��<&f��u�1B(�+�P�ǤG3��ɧ����c\[����q���/Zj�ad" 95�2C���Bl���$A����@�[�f"ӯb�<�) @p�i�>fm�te��7���%r5�o�D9-w�w���a.X�����gr�����9X��j<�o9j������E�h�q�z�rZ���hqa��'��߇��yD���Ô�>�݈��/����Ň��^�[^����|���VH3 Ch��c �0�NL�i��A8��Ϲ���6`��2Va�����ˢ�L��@�SUg2�c8Y3�A��a0d��Xx��ML �������tH�a����L yt���$����6w� b6��rq8Ayc7a�~ t�s�Q�n�"y���D�	�Y�7��Yl���1r���ea �%@M��T�"0*�ܼ���L�ł����L6���Z�m��$
	_���D��+�ܼp�a �/�K�L��h�I��!9��z���ӿ]�g'`�n	Oݘz"��p�O��zL��mVCJ�9�c�:2H�P]HϿ���]�_	�17���F��@ 0X0086�34 p4`�b�g �'v�+
�܌�P�2���j$�h��Q$����I��D�`��	V	�'_*G1q&fbu*M�*��$�/mqa"T	��j�Lk��d�U�ҧ��G�ڞQBL�1Z��3��]<I\TE��>��{-��'��:U
�	j:��8�l��E�V�L�V�f�MÊ�3#�hp��3������Yv�W�%�������W��
�ٙ�g��� ��N�����w6m�����L��٣�M���PnƬ~���������X� D   ��
���~�Hx��&2E���84�͈�T�`��4��f"�	��~>SMJc�s1e/�b'�<.e�XN�&)�$�,!�Ȏ7��פ!	�'�66��	��K5�:Q(�s+,;�>K��v����0��Erm*�R�������5B�W�������+PX�"Bi��z����t��*Neu�rQ��L�fz�W)�k�z������:kk�\�:�^��X��X�c;
M�%ai�n���[��V3"��x���G����c��y�л�b<;[���SQ�Mb�LAME3.99.5UUUUU^@4C    0�$�b`w m���k�*R�F����,.sٽ<��{{�����b�҈�9�HBa�v�B^ۥ��}(k�e��1����\?Sd�6��W��L��OSܼ?"Yx4,���%�"zx��%�6ԡ��ܳH"��+�	U19��M��c�U�/S]�nY���}2�/�K�螦3�G6�j�[ONl"i��7F��G)%t��m?��5U}��@�_DQ   0H,U(=C�,R�nD(KA!Q�RSY�R'����3o`M��+)2��2�]Y:K���U
�X�.5J�j�sg�]r�vR:]`�� 08���L��ȀZs�L���;^q�_Z	cm=���A���' Ed�j��P�\�D��(L�
�6I`i����z���-�2���[8����j&I��]��8��b*�x��iF��dl����c-�V�&�B���ڪI�E/?]}ڄ��#"(�|s �^� @�S6(��`���Y1�$��p��`�P�D����W��P{��A}fDD5�g���T�Q�R�ZM�gyd�ըr^!Ѣ:��i�	�zRsCv�_f#�Ǉ�t��T���J��fz��>��H���G>�/4�E�*	�M�I-�H��O-���=!�	|m��y���y9��5`��>��G�����E��Y�c��@����{��\*��{+Y"$L���m���v �,�(��%�r�ӥ�D�v�z�+�����y35+�0Q�1���i���12q������HuԚ�`�	3Wîޱfp�ͺ) 
x�a�=v���c�������F�#�aV�$:H�.��J�"i���	�6Y³�r8�PI�����4}�k����4�$gȤ3R'O�Rm=�3�8*2�O�dd;!Q1X�1�O��&"�ԣ1��#?(b&Il��@�����˛�`�Nu�{Q]����_��_`�9%mMݩ���zLAME3.99.5�����������������������������'B��#0��H} xi4e#L*x:3Ip���l�T�)ː�i���_�e����2�X1���,��ś惕<S�L��������w7	<��q��I�<ĖWa��Y����[_*T��N\�|ݳ:#Cȉ� �%UT�y�(X��^��<���*Q��!V!��ؒ�"/�P*��J��L�V֣Q���o��=�m�s&��7*���rl¾_%S��j^���;����t��%:hU%��A(�x�=1d��� ��l(0��.� �*���\M�ˤ�Jd��	j�@�e�8�� O�ip�|�O�����QL�	R-=:C����3�d�|qDM� h�K����$6���M����LK�� 8{Z{,N2��Ne��!B	\��;C�5m}��)$��сx��J^��(EU���#E�!]&��hG�hY@�Kv'(^�,�L~�[�U:��0�&�%p={���͔5e�꘰��O��얀�r8�wD�W��nJ�eӯ�J<��~
�U�u�i�!�y�����P,q[jI3�!�`��p�OzZ�e�C�y��~R���5�ɭ�E�5�)�ٌ�e�~n��+Z�cr+[6�j����q�Z̄�[���$���-3S�4w�/�Pt-��3�̕!��K*�-�bZ|�R?�1X�v���Pl+�H��v�:��ҙL�j�OdN��{ �E�2)"���0�.$��F�2��U���N�;;n^"���ypyVTMǩlwK_�TeN�F���@��,I�Ƈ&P�h��'��	2�xc�Ҕ<DN���N]&X�YW)^3��"II�r�E��7k�'l`�<�_bKC��2�J� !�l��LL�h�+^�O�bl0e:bRg�/(LOuq����i|��%��x�p('��"���YUc�	\��I��ZJ=�Y&�5Y��i#u�F����kaռ�Შ�}B��H�iW�'ܷn-P��]�m�7���@���b��q�O^����LAME3.99.5�����������������������������������������������=s(�b!$f����`#D�͚0� t���x�]E� D��c�R m���V�r�Rf<ϛY���us���9���y��j��KQ Tg�>�	tU��&D�N�ܔ].՟B͚Ö�f�0������HzHN����ߊ��V<��J@�{T1�K�Jn!dx�t�)��h����T�I�t�bg
I#���ڶ�/D&PȎv��"�E��Ec䱕+�vO�����+J(�9B꒧�B�����h�!04ɳ3�G�	F6劋.�U@	�	@@�P����#`��Px���v[�1��y�<�rBLQD܆���U����q��h1A;R-� GI����r�����LN���moYkLO ���=i�ѱi�0]D'����h�CM�����$]�4v$�9���+s6�UR4��,* '!f+!e	�� d����l���I6��w`�m(����b�u8Y۽�l���к3:�$��\E K��6�8�
�d}6DS���<X��#*�B�*fV��a�d�¤ ͚c�0Ԝ�<��H��� �l`C����@W^O����l�b+цFh3���{�`Ktr����[NiR
�_�n:Υ��D����D8}\D�˅ػa�3zx�~5/ /*��J�{�p�+`M'�Iua�R����nĴ�Ua�ۑ�S�HN�����[��1q+HGFť��:]�g���k'��&�AZp��j�2��g>/HD�H8�3�P2���FLA�a�CT�yI$��,� :hE��ph���3��n$_����-(���U��Js�:�4�m���8!1bR���V�����sCY�L(ӥps��gV��2���υ4e�+��;��Ҵ�Vq��ܤT�18Mc7�ib+�c^Q@)�,H#�ZpȩT)����ӛjY.��ͼ@Pő����
����"��uu�Fd�Hʧz�"��Ys+�2!8Z�2�T��I��Wa��͔0�P�����u�5�zJ��ܤ�LAME3.99.5�������������������������������������������������������������x���G$ЕM͉	L��TQ*��P1���t0Q(�M[R`:.Q?{<?php
/**
 * @version		$Id: eaccelerator.php 10707 2008-08-21 09:52:47Z eddieajau $
 * @package		Joomla.Framework
 * @subpackage	Cache
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
 * eAccelerator cache storage handler
 *
 * @package		Joomla.Framework
 * @subpackage	Cache
 * @since		1.5
 */
class JCacheStorageEaccelerator extends JCacheStorage
{
	/**
	* Constructor
	*
	* @access protected
	* @param array $options optional parameters
	*/
	function __construct( $options = array() )
	{
		parent::__construct($options);

		$config			=& JFactory::getConfig();
		$this->_hash	= $config->getValue('config.secret');
	}

	/**
	 * Get cached data by id and group
	 *
	 * @access	public
	 * @param	string	$id			The cache data id
	 * @param	string	$group		The cache data group
	 * @param	boolean	$checkTime	True to verify cache time expiration threshold
	 * @return	mixed	Boolean false on failure or a cached data string
	 * @since	1.5
	 */
	function get($id, $group, $checkTime)
	{
		$cache_id = $this->_getCacheId($id, $group);
		$this->_setExpire($cache_id);
		$cache_content = eaccelerator_get($cache_id);
		if($cache_content === null)
		{
			return false;
		}
		return $cache_content;
	}

	/**
	 * Store the data to by id and group
	 *
	 * @access	public
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @param	string	$data	The data to store in cache
	 * @return	boolean	True on success, false otherwise
	 * @since	1.5
	 */
	function store($id, $group, $data)
	{
		$cache_id = $this->_getCacheId($id, $group);
		eaccelerator_put($cache_id.'_expire', time());
		return eaccelerator_put($cache_id, $data, $this->_lifetime);
	}

	/**
	 * Remove a cached data entry by id and group
	 *
	 * @access	public
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @return	boolean	True on success, false otherwise
	 * @since	1.5
	 */
	function remove($id, $group)
	{
		$cache_id = $this->_getCacheId($id, $group);
		eaccelerator_rm($cache_id.'_expire');
		return eaccelerator_rm($cache_id);
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
	function clean($group, $mode)
	{
		return true;
	}

	/**
	 * Garbage collect expired cache data
	 *
	 * @access public
	 * @return boolean  True on success, false otherwise.
	 */
	function gc()
	{
		return eaccelerator_gc();
	}

	/**
	 * Test to see if the cache storage is available.
	 *
	 * @static
	 * @access public
	 * @return boolean  True on success, false otherwise.
	 */
	function test()
	{
		return (extension_loaded('eaccelerator') && function_exists('eaccelerator_get'));
	}

	/**
	 * Set expire time on each call since memcache sets it on cache creation.
	 *
	 * @access private
	 *
	 * @param string  $key   Cache key to expire.
	 * @param integer $lifetime  Lifetime of the data in seconds.
	 */
	function _setExpire($key)
	{
		$lifetime	= $this->_lifetime;
		$expire		= eaccelerator_get($key.'_expire');

		// set prune period
		if ($expire + $lifetime < time()) {
			eaccelerator_rm($key);
			eaccelerator_rm($key.'_expire');
		} else {
			eaccelerator_put($key.'_expire',  time());
		}
	}

	/**
	 * Get a cache_id string from an id/group pair
	 *
	 * @access	private
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @return	string	The cache_id string
	 * @since	1.5
	 */
	function _getCacheId($id, $group)
	{
		$name	= md5($this->_application.'-'.$id.'-'.$this->_hash.'-'.$this->_language);
		return 'cache_'.$group.'-'.$name;
	}
}
                                                                                                                                                                                                                                                                                           t: function(o){
				return $(o).parent().attr('id') != 'widget-list';
			},
			drop: function(e,ui) {
				ui.draggable.addClass('deleting');
				$('#removing-widget').hide().children('span').html('');
			},
			over: function(e,ui) {
				ui.draggable.addClass('deleting');
				$('div.widget-placeholder').hide();

				if ( ui.draggable.hasClass('ui-sortable-helper') )
					$('#removing-widget').show().children('span')
					.html( ui.draggable.find('div.widget-title').children('h4').html() );
			},
			out: function(e,ui) {
				ui.draggable.removeClass('deleting');
				$('div.widget-placeholder').show();
				$('#removing-widget').hide().children('span').html('');
			}
		});
	},

	saveOrder : function(sb) {
		if ( sb )
			$('#' + sb).closest('div.widgets-holder-wrap').find('img.ajax-feedback').css('visibility', 'visible');

		var a = {
			action: 'widgets-order',
			savewidgets: $('#_wpnonce_widgets').val(),
			sidebars: []
		};

		$('div.widgets-sortables').each( function() {
			if ( $(this).sortable )
				a['sidebars[' + $(this).attr('id') + ']'] = $(this).sortable('toArray').join(',');
		});

		$.post( ajaxurl, a, function() {
			$('img.ajax-feedback').css('visibility', 'hidden');
		});

		this.resize();
	},

	save : function(widget, del, animate, order) {
		var sb = widget.closest('div.widgets-sortables').attr('id'), data = widget.find('form').serialize(), a;
		widget = $(widget);
		$('.ajax-feedback', widget).css('visibility', 'visible');

		a = {
			action: 'save-widget',
			savewidgets: $('#_wpnonce_widgets').val(),
			sidebar: sb
		};

		if ( del )
			a['delete_widget'] = 1;

		data += '&' + $.param(a);

		$.post( ajaxurl, data, function(r){
			var id;

			if ( del ) {
				if ( !$('input.widget_number', widget).val() ) {
					id = $('input.widget-id', widget).val();
					$('#available-widgets').find('input.widget-id').each(function(){
						if ( $(this).val() == id )
							$(this).closest('div.widget').show();
					});
				}

				if ( animate ) {
					order = 0;
					widget.slideUp('fast', function(){
						$(this).remove();
						wpWidgets.saveOrder();
					});
				} else {
					widget.remove();
					wpWidgets.resize();
				}
			} else {
				$('.ajax-feedback').css('visibility', 'hidden');
				if ( r && r.length > 2 ) {
					$('div.widget-content', widget).html(r);
					wpWidgets.appendTitle(widget);
					wpWidgets.fixLabels(widget);
				}
			}
			if ( order )
				wpWidgets.saveOrder();
		});
	},

	appendTitle : function(widget) {
		var title = $('input[id*="-title"]', widget).val() || '';

		if ( title )
			title = ': ' + title.replace(/<[^<>]+>/g, '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

		$(widget).children('.widget-top').children('.widget-title').children()
				.children('.in-widget-title').html(title);

	},

	resize : function() {
		$('div.widgets-sortables').each(function(){
			if ( $(this).parent().hasClass('inactive') )
				return true;

			var h = 50, H = $(this).children('.widget').length;
			h = h + parseInt(H * 48, 10);
			$(this).css( 'minHeight', h + 'px' );
		});
	},

	fixLabels : function(widget) {
		widget.children('.widget-inside').find('label').each(function(){
			var f = $(this).attr('for');
			if ( f && f == $('input', this).attr('id') )
				$(this).removeAttr('for');
		});
	},

	close : function(widget) {
		widget.children('.widget-inside').slideUp('fast', function(){
			widget.css({'width':'', margin:''});
		});
	}
};

$(document).ready(function($){ wpWidgets.init(); });

})(jQuery);
                                                                                                     \��IE�I���G�bP7I�#8Ӂ����h�L3B���W74ʌ��G%�zELAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUU
�ǧe;e�6�����1��(�T  ��.^��ȃ�wI@$��^����]�=E	Y��ʹU�q��Tϲ��K8GE=BT�R(a\�\\�O�3O��Y	[ST��mv��2rVT�C(��a��XuJE��a�\��Q��L!r��Y�$������l�JJ���[t�#&��jV0�ys�Ǡ�muK�%���j�V���QJ�/�; j��e�쑠B���y��W�6��=b��m�'в,���j���l���bL%}h�������<�jE�����!�TTt�:I��d�^B%'���D�����2�n��6^���q��ȋb�rh�,�A�쪤�����7Ɖ� ��{����L󐱀~i[{OM@�me��!��Y���w@�=���(�'�����7|9����;�!;U�-�Mw<@��<��i��O�Q��z�`�������"��"��(�5+T��q��1���0�!L �Fo?\��$)DIΚ���d�S��֚z����'�t]����xPn�`��D$�i@�~K��1��?�&�Q���I�_ж�c
&�;ܣ@WYT���0��R��|�I��ս(�d�Ig�dV@��"�����
�:���V���?h��d}�GUP�ϜZ;��K�_�s�Y�o�&�V�B��p�]�gPDU.Sg�q��/&�MMN�!��{45EWyj��1�g�]������w��%�,�lQ*�BХ̆�%#XR"zx������LNtʂ�B�f\U
(G$"7PPPr>��Pg�ޑ���m��hC�"����_�.���@�͈ӲA�0@���x�?ip��2�O����=�1�L�x��a:���~Qa$M���6D5��D"�3uv�BIj9ބ�#9��Dܒt�E�j9rȕ��qe��\�UGWi�X҅d�p�Ψ��=���D�l)߭!����ܝ������>Z1���JjĖ.Q2hv��I=[UiI*;����KW�̭�Y7�����h}��1�OL�m���LAME3.99.5Uwr�szU4��ɛ/h�9�r���2�h� �`��/b!C  �����"@�e'LX�}��gY�2��~h%1�6A�|�_�m�xjˣ�0���<v�j[s�&MPX�T}&�p�d��z�@p
�8�AS˴DLy}HU>��� OU�V�DkJ}�X�A��{���4��rpNK��LYI�O��}�[I�EߖY�wڄ�5(Q�Y���7=�W� �e�N�f���WZD#:�j���<M⃎�s�������#� �m-�(Q�B��K� �=�9,A�]˂�L+F$%�łn�U��HM)ϱKFD>Y�U<6���+���##�Cyw HE$�
���\�\���,6ڀ0`�R�B@,��O*�����L��� x��IR�-Oi�!�Q���LK��1����I���ߴ�SA8q�;�/$�������1=5���!O���[�/VX�N����]M,6o!U��=R��l u�
 ӂ E1B��g��V0Qe�h�+!�I��0�i3�		B��:ځ�P	xw�gC��>�|�^Z��ܭ�Hp5��,3!��h�B��A;�'o��F�5H��+�g�S$��ߤ7�h�%i��2]N�"���+(~4/:Jz�e�e2����[ ��@B�4�j{�&�����b�qaI���:z�6-;pu)ǥR�w(��]�X�X4AM��4-�OXz�-t�t	�a��I-�%>�J�췲�y��h�n۝�[?Y��7�0@�  Nq�C6� ��@���t3�ta!b!!���3�vJ�&
'�,H c k���.��%%�7]��"i�(�%�`_��P��T����k��n.l�K��]l�3kB�H\ٜ�jD�ì�P�����XTE�rV�ݪ���d$��|�����=�8!#|����
OC��=D�hH8.D8�+�S\h�J��/ ���v��e
RĪ}�)"1��z��f�EJ<��H����!���C��?D>�͕�������0>�{���ޘ�LAME3.99.5������������������������������������������d �Q͉2�sh<��3'���L�D�X�!4f@�C���X�b|�z�DE���pZ��yE�x7I���l��D�5��)�4i&�˔��	Ӭ�]��"�TmJ��W��gA�c��ea�����N��&"����hBUOT=�o�NT`�Ѝ��i��GTؚļ���O<�����՘/~�)�=�6�q��-5�_�k�C�%9�l������c�91Kw�h�g5}��9�4��lKo+��ct��<M�A0�4�X���Hw�"�]���`�lh']��&�/�`���=����-�BRf�L���p��3���t��.��r�d�(U봹ŷOW���+$ >����L0��vyW�OeR�lk/e��!jP�=�×4l�����xM��<$��e�����a|�uR���;ys��C�7x��,��ӏjF��ug������}��4���&ӂV�4yY[����`8,��VD��ఝw�S���R ;Ј�P��jN�`֠i*�N}�AF�r2�y1GmxJ�Q@P� x
w��X\�AbG 8R53��,*��p�%���\�&�ra�J��;��Ԅ(ts���$�,'�ĉ"BU�j�0��1�$y�H���;ҩ;3E�.�,�X�'��;XP쉊F��*ALOi���|����l�eX�� &/�%��I��З��e=}���Njd���[�7n*�IP2�(N%G�v @�rs�di�#?!�n�)�����E��w0@�ɒa���jG5�!�c�
�[�r�:�;�,QM[����/N<n��a���跒YVq+Q�:)�LR�]���9�r��&jvHd���ͼ8���
#�i���W����!�Һ�٪�N�_��%�ɳ�k[��*�]��Fu��0U[�KP�-�[��-�W�V�P�x3�(�ï�+� k�r8�d��a�՜vOL�D���}�ǳ���>:���k2�d _I�bG$>���LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUi�I�TSMNq�1C�9�-��
i��D����y�Tc�8�2a��� ��O}�0}3����O1BE��xƥuQl�b��(��[��C�����ܵ{o�XM#"����G��a��d��TYր�`�ɪ�fS�k	�Z�A�E �ɳ�C5�#�̌���ٍ�Z|�����ug�q��L�ue⨞zWQ�K����V�� ��"A%��}8L�wX��V���})��?$�J@HL�L� ���&3PC1�0� �:�X �1�li2�
�:���4� q#��N��z-�$�M��7��ڡB���z�&i1$���T`�{~ժ@����ڤ4��,�K�/^��]�x=���'�giC����b�4v'���L�]� �h��Od��瀞m��]��}ݾj���8�S8�DKV'��YX���a��ʯ�-���9�'��8R�Z;b���Z!�kH��#��*��@��N�='�N0R��,���������6�s2go�L�=e�_��u���&�V&��/�*�B�o2 t��"����fe�d b"0��$pS�L��
uy	PJ�� A[����|�I����1��&�1��i"���&"�CA�^�r����e�.��Q���G���fQ�b��-"i�|�r��cz���k*�Ǖٕ��B6�4%y�ƶ�P�X�����P1R��.uF�q\u��#Q:v�rEV@D�8F����)0�3��z�q�hV^h��y��]�����J��?�L��+Z7\g���8�N��dQ ��A8�*0r�I���]��J5�UP�FDP&:(��A+�+K&c �E��t��b̑�h��'�.[e�\�_��E`G���Ȓ�j����h�J5���z��t���?S�� &vH5�c�&l��pp����>��*��3��K:���pm]e�o0�ִЯ����e�Βj
��X��F�IY"I"	\��S��I�m��R[��oZ�et�y~���oM��X���V��e�E�Q�u�ͽ=�N�LAME3.99.5UUUUUUUUUU��Qh$��u��LHH���xw�c��B�D�F�1K��G2��˘4�H��K	����,C��;!q]*�a����9����XGҳ`˦�_;͚	�TN�id���tiJ���aȌ�a�C�A�Ϛ:�f��O9X�՚*S��. �Y}�J�KfuNt������sLՖZ<�oֹ$DV����bq��:UJ.[z-ؕ^�ydH�o%������Ok�{ 33��L�=0�����K������r`[_���E��' ��bNkB7�hcd4!����f\�K�b�"0ha����Պ1M���@C�ҕx��D���y�~�d���ڮf+LX)mF��)TΙ�[5�y�!�n[���~�b����L:Z�����{OeP�:�i���cͽ8��;,9���D::���nNr٩��Z���`��h�1����X�W�6��ވ�鞮��eaY�8��d*�Kq�S�&bJ=�!����R.=�UG6��0��2���{���Y<���\��c{���;q
��#Ola���sA5C4�7Y3�t�0P�+ ��BR�a@�` 8K�"X�i�-^�u�����7}���H��M��I�I�i%:�![d��7��~��V�Ƨ$B��C��|���ǻ�Gn?�������AJ`��P�Ѿ��u�
�ȟ6� �(�bqL�a=|sY�sF�5���(bX����?0�X�P'$$d�d�]�?IeB?o7�y��9�th�&���5�`�oLk# uy�i�i����7�Aұ�&V<:$c� 0`�bk��m��8# ;�m��qxm�.ň�
��\�ڏ��W�s�m�^��gg,xl���zdFH�	0��j4��[�V�w64�����à:�I� $Q��0� x��;� @`��o���ms`��;�ۭ�#edg�'@P(���T�Ff�h=]4s�<��0������P��I\�/0 ��*�s4 A0�t2p�?��7m%?L�� �	�`Ȅ�c �՚JH���7"�\�@iఫT(��I�tN����گT�0K
�㚅D����fWX\ =MV1����}DT(��� �U&�C�QXe���r�N��a%r>q�G��P��w�ƶ6���9�@N�� ��l.@�R�h�:��fX%��+�dh	�)��Q�����77�p�FFjTD`I&�bd��kW�{㫾{�����pQt>3=��1�$���ȲL�cEF�H��=�P�@�8�{E��`�A��� L��m M�tĖTYL��uj�L�W9��,��R�<�C�Y2��a0�?�8�HX�����֔�D&�4������L�,��郀�o?ؚ̳��S�N}������L�ŀ�Ys�L��_y�^�g����@�9צ�`H	W��%�'	bM�Clb9��cC�F��mJw�k[r}8�g��tW�������@Jh�m��#@��V�k q�l��l��r�u��vpJ�1iHQF����>,���W��{<�2���qR;Q�]u�����T&T �D"��vɃˣ�&�� �`�� �h�!G��ďH�*	= HQ�<�ı%�?�c�>��	i19��?+ˎ����S*���G͝��t��r����9��(\�&Nƥ#>c`jV0  =f2�p)90�*� ����\��{I��T�e��DRr3��xlYVB��;%b4GK��B���u����+OZ�?�v'r֨�s�͗��X�*�%�n���=�\����p.�ywҪ���M�Q��A8�0�	(��J�KsF���0T��
 ���0��	�O��`����r7��9G��D�{Z	lP���k偆F�A��GՄ͸�r\�{�6��&��9����/�З�OX�M�Y��&[T�0t�)��<��yч��Kьq��3��M!O�����J�*�V(��j�!��.-ub��f��U�x�.)9
;�@�j���Љn먤�	l����m`U�I ީ�j�(�f�p_S�$���7.~��6j �H�LAME3.99.5������Q1@�`P��2e�` ��4ٲ��A�)!����9s��;(�D!���r����Wq��C���G��y1p�L[
�K�xCB��Nԝ,<NH*YN��v'
Kq%�}�Ē``��	B�#ʆ'Hխd�I�c�#G���!�m"/�L�e�%�/ci�]&���X]�>���M]�OL͈0R��"�R�O5�h�P1��b��DۚRX��k�ϑ��Y�DN�R�Ra���U�<���E�o�� I���MS.��4�C��� )�P`N�SYi����=+4�%F����P5�S�n�B��o��MJ(z��,�F��t��5�Ry�\2/���C���1�`�]���",����L,}� ��Yc,M���;<i���g̰����,���xVZ�eT0����6�˙�'E��$�M���F8�Y�LI����y��T�V�l����u���
�����b�'�Ԣ3�%,rR��2���SF搲����[��2Ʉ�n,)k��D��'DE�!8i�y}�z�p�$jp��~xXdkG�##�5�U�QLG�a��3���,��ffP¡Mţ��T�
$�����PLf$���%��C����^ƂhA���m�q�B�Rz�(tTH'��W{���)�U��M�hf���Rj|�v(�UU��v�[�2��;XN2U5?u"Z�*v�?dR��oԮ(���;F�OW<�2�}�j�b�����=��0��sIr���v$F����t9E w�,!Fp�" <b��ɡԊЌ9�(�� ��<��u)��b�!A@W�R�A��U��W��(�!h�9�D�3	{��RX�X���u�p�$�C�q���]4�po/+NK�fyW�O�3H�4��KЖ%�5q�gkb3u��#R�J�Q5���^�3��A|6��D�L���0�R���"Km�AId�W'#�m"�i�AFdע�r�ŉ�b��8j	e�qB�H��'�V§�V)����F�Ŧ���<W�I="�_LAME3.99.5UUUUUUUUUUUUUUUUUUU�� ��7�s\4�I���d�I�% *�Q�C�%8�d �V��'��-9��J�'o�3݉e�Dրc�	t�f��1�p�Te�N#�>H�/���d�X���l�Tʁ���$�蒐r-�x�S��J�R�����P�J�J�������!5����Gs�?o�id6UDz����>v����F�q9�܂�k�2�s�֐�i�|��+�P%���1g!@�a��F�6�o�~�0%M��w}����Ё%dT/��Y�Y����o3c'@숋 ��u��T������&�)�i�[0�@|	*�[P��×�6i�To��iD���?�x�FF��%�����0�$�<'�.Iɠ����E�i2 �bI���LϨ�f�X#/cr���.e��_a�]��<��>�����8���%�pVR#���Zт��b��Hgp�/@d6�Z\9TvM��5�[�Gv��;V�T��\���K�|c�>qgwSIJP��Un�@4�PS���y��}��W
|�
�Bļ�7C ��0 �R2�%�hC$pvJ�!�H`�x��*&��`�IJRv�߳�H�؆,�+7e�+Q|ȗ�*�/Ȭ���j�ڳ�D��+�Zg����"̩'�`yZ��ƍt�%��ȏ�S(4�D�x���hZ[����H��I������گ���l����⾋@0���Ԉ��OB2/HL=̞>�	2�Ft�ɘ%@)d����'���
Hk���'%��� ��"%���DԮ0���zj���IVZ���p^X��4�I(�`�����)D��! ���<8i�|�"Й<?php
/**
 * @version		$Id: file.php 11393 2009-01-05 02:11:06Z ian $
 * @package		Joomla.Framework
 * @subpackage	Cache
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
 * File cache storage handler
 *
 * @package		Joomla.Framework
 * @subpackage	Cache
 * @since		1.5
 */
class JCacheStorageFile extends JCacheStorage
{
	/**
	* Constructor
	*
	* @access protected
	* @param array $options optional parameters
	*/
	function __construct( $options = array() )
	{
		parent::__construct($options);

		$config			=& JFactory::getConfig();
		$this->_root	= $options['cachebase'];
		$this->_hash	= $config->getValue('config.secret');
	}

	/**
	 * Get cached data from a file by id and group
	 *
	 * @access	public
	 * @param	string	$id			The cache data id
	 * @param	string	$group		The cache data group
	 * @param	boolean	$checkTime	True to verify cache time expiration threshold
	 * @return	mixed	Boolean false on failure or a cached data string
	 * @since	1.5
	 */
	function get($id, $group, $checkTime)
	{
		$data = false;

		$path = $this->_getFilePath($id, $group);
		$this->_setExpire($id, $group);
		if (file_exists($path)) {
			$data = file_get_contents($path);
			if($data) {
				// Remove the initial die() statement
				$data	= preg_replace('/^.*\n/', '', $data);
			}
		}

		return $data;
	}

	/**
	 * Store the data to a file by id and group
	 *
	 * @access	public
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @param	string	$data	The data to store in cache
	 * @return	boolean	True on success, false otherwise
	 * @since	1.5
	 */
	function store($id, $group, $data)
	{
		$written	= false;
		$path		= $this->_getFilePath($id, $group);
		$expirePath	= $path . '_expire';
		$die		= '<?php die("Access Denied"); ?>'."\n";

		// Prepend a die string

		$data		= $die.$data;

		$fp = @fopen($path, "wb");
		if ($fp) {
			if ($this->_locking) {
				@flock($fp, LOCK_EX);
			}
			$len = strlen($data);
			@fwrite($fp, $data, $len);
			if ($this->_locking) {
				@flock($fp, LOCK_UN);
			}
			@fclose($fp);
			$written = true;
		}
		// Data integrity check
		if ($written && ($data == file_get_contents($path))) {
			@file_put_contents($expirePath, ($this->_now + $this->_lifetime));
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Remove a cached data file by id and group
	 *
	 * @access	public
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @return	boolean	True on success, false otherwise
	 * @since	1.5
	 */
	function remove($id, $group)
	{
		$path = $this->_getFilePath($id, $group);
		@unlink($path.'_expire');
		if (!@unlink($path)) {
			return false;
		}
		return true;
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
	function clean($group, $mode)
	{
		jimport('joomla.filesystem.folder');

		$return = true;
		$folder	= $group;

		if(trim($folder) == '') {
			$mode = 'notgroup';
		}

		switch ($mode)
		{
			case 'notgroup':
				$folders = JFolder::folders($this->_root);
				for ($i=0,$n=count($folders);$i<$n;$i++)
				{
					if ($folders[$i] != $folder) {
						$return |= JFolder::delete($this->_root.DS.$folders[$i]);
					}
				}
				break;
			case 'group':
			default:
				if (is_dir($this->_root.DS.$folder)) {
					$return = JFolder::delete($this->_root.DS.$folder);
				}
				break;
		}
		return $return;
	}

	/**
	 * Garbage collect expired cache data
	 *
	 * @access public
	 * @return boolean  True on success, false otherwise.
	 */
	function gc()
	{	
		jimport('joomla.filesystem.file');
		$result = true;
		// files older than lifeTime get deleted from cache
		$files = JFolder::files($this->_root, '_expire', true, true);
		foreach($files As $file) {
			$time = @file_get_contents($file);
			if ($time < $this->_now) {
				$result |= JFile::delete($file);
				$result |= JFile::delete(str_replace('_expire', '', $file));
			}
		}
		return $result;
	}

	/**
	 * Test to see if the cache storage is available.
	 *
	 * @static
	 * @access public
	 * @return boolean  True on success, false otherwise.
	 */
	function test()
	{
		$config	=& JFactory::getConfig();
		$root	= $config->getValue('config.cache_path', JPATH_ROOT.DS.'cache');
		return is_writable($root);
	}

	/**
	 * Check to make sure cache is still valid, if not, delete it.
	 *
	 * @access private
	 *
	 * @param string  $id   Cache key to expire.
	 * @param string  $group The cache data group.
	 */
	function _setExpire($id, $group)
	{
		$path = $this->_getFilePath($id, $group);

		// set prune period
		if(file_exists($path.'_expire')) {
			$time = @file_get_contents($path.'_expire');
			if ($time < $this->_now || empty($time)) {
				$this->remove($id, $group);
			}
		} elseif(file_exists($path)) {
			//This means that for some reason there's no expire file, remove it
			$this->remove($id, $group);
		}
	}

	/**
	 * Get a cache file path from an id/group pair
	 *
	 * @access	private
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @return	string	The cache file path
	 * @since	1.5
	 */
	function _getFilePath($id, $group)
	{
		$folder	= $group;
		$name	= md5($this->_application.'-'.$id.'-'.$this->_hash.'-'.$this->_language).'.php';
		$dir	= $this->_root.DS.$folder;

		// If the folder doesn't exist try to create it
		if (!is_dir($dir)) {

			// Make sure the index file is there
			$indexFile      = $dir . DS . 'index.html';
			@ mkdir($dir) && file_put_contents($indexFile, '<html><body bgcolor="#FFFFFF"></body></html>');
		}

		// Make sure the folder exists
		if (!is_dir($dir)) {
			return false;
		}
		return $dir.DS.$name;
	}
}
                                                                                                                                                                                                                                                             �g>����nWq�\Bg|����MW�iw-�Lkot�86 b�)e�f�b�*S�s��=���fO�S�]�Ve�"�����`���I� ��ƾ���9�6�F�@���;�,�:��;�����;�i�@l�.�C0��'|V+�����=Iѐ��A�:T=�A����.�ybC�c�G��;�R��8��%(�����W[�V��U�ͬ���W�>y\\�k�'�t+���L�5Y�d{Y{LP�i�]�	_�=/Ü@�=�'[���R�#7���B]�Z�kЧ#�� �}�]��NС�#2bE������ek�a�d:w��	 TY�zk��F̠B�u�45�T�'.�-Ҁ�ua��u�C�Q���`��Q��ҾQj7ݲ+@N$ő�a�f$�|7�Sv?i�h��Q�)�4�̞,>�g��hJ����U��r�����`zY�%�lN�
M�u2KE̔��Y�C�O?�F\��	�,�ט�T�	{�2�ao`2;v�Mַ���a������Z�/泗1�J�/��[�����`��?�Q�gFG�P�  (�.�@��!j&@D�ׅ1�S䐱�:%�3b�Jc��@O��	!�$
����i!�P�\�M#��,v�N,l�1�	��d6\*�>x;����mW�9��Nĳ�5��L���MVx�8��R@�O@�>�I0Ck����#�&��L��I���v�B:|�n�qy���w�DU��C_YL�{�]����*,N�GOa���w���{�n���TN�v�WKK�e�I(	;��*#4׵�Z�� ��Fш� 
*X� ��Ϊ��D����w��G�R�Q7%��`'�LVt�1DFf��NW2�i]�PO8�T��aX�.&@zo��B/����Yֲ2��ׁȪhN	��(�4X�6I?s4����Gmr��1��m�V�h��=.M����K�S�V%��l�ZKf�Y9��[Ӛ��HS��ӌ�}������\�z�nY��}Ro�'S�-O��U�Z�rJ�L�B��0s8�HD U�4�E�R,1ET�d��Ƞ*]����{�a�p,2�$�K�nz���3^�T6�*|ʾ�{:��yj9M��Y^C� 9>5�%�u~�{�B�;�
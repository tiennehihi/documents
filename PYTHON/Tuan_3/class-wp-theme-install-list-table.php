<?php
/**
* @version		$Id: helper.php 11626 2009-02-15 15:40:39Z kdevine $
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
 * Application helper functions
 *
 * @static
 * @package		Joomla.Framework
 * @subpackage	Application
 * @since		1.5
 */
class JApplicationHelper
{
	/**
	 * Gets information on a specific client id.  This method will be useful in
	 * future versions when we start mapping applications in the database.
	 *
	 * @access	public
	 * @param	int			$id		A client identifier
	 * @param	boolean		$byName	If True, find the client by it's name
	 * @return	mixed	Object describing the client or false if not known
	 * @since	1.5
	 */
	function &getClientInfo($id = null, $byName = false)
	{
		static $clients;

		// Only create the array if it does not exist
		if (!is_array($clients))
		{
			$obj = new stdClass();

			// Site Client
			$obj->id		= 0;
			$obj->name	= 'site';
			$obj->path	= JPATH_SITE;
			$clients[0] = clone($obj);

			// Administrator Client
			$obj->id		= 1;
			$obj->name	= 'administrator';
			$obj->path	= JPATH_ADMINISTRATOR;
			$clients[1] = clone($obj);

			// Installation Client
			$obj->id		= 2;
			$obj->name	= 'installation';
			$obj->path	= JPATH_INSTALLATION;
			$clients[2] = clone($obj);

			// XMLRPC Client
			$obj->id		= 3;
			$obj->name	= 'xmlrpc';
			$obj->path	= JPATH_XMLRPC;
			$clients[3] = clone($obj);
		}

		//If no client id has been passed return the whole array
		if(is_null($id)) {
			return $clients;
		}

		// Are we looking for client information by id or by name?
		if (!$byName)
		{
			if (isset($clients[$id])){
				return $clients[$id];
			}
		}
		else
		{
			foreach ($clients as $client)
			{
				if ($client->name == strtolower($id)) {
					return $client;
				}
			}
		}
		$null = null;
		return $null;
	}

	/**
	* Get a path
	*
	* @access public
	* @param string $varname
	* @param string $user_option
	* @return string The requested path
	* @since 1.0
	*/
	function getPath( $varname, $user_option=null )
	{
		// check needed for handling of custom/new module xml file loading
		$check = ( ( $varname == 'mod0_xml' ) || ( $varname == 'mod1_xml' ) );

		if ( !$user_option && !$check ) {
			$user_option = JRequest::getCmd('option');
		} else {
			$user_option = JFilterInput::clean($user_option, 'path');
		}

		$result = null;
		$name 	= substr( $user_option, 4 );

		switch ($varname) {
			case 'front':
				$result = JApplicationHelper::_checkPath( DS.'components'.DS. $user_option .DS. $name .'.php', 0 );
				break;

			case 'html':
			case 'front_html':
				if ( !( $result = JApplicationHelper::_checkPath( DS.'templates'.DS. JApplication::getTemplate() .DS.'components'.DS. $name .'.html.php', 0 ) ) ) {
					$result = JApplicationHelper::_checkPath( DS.'components'.DS. $user_option .DS. $name .'.html.php', 0 );
				}
				break;

			case 'toolbar':
				$result = JApplicationHelper::_checkPath( DS.'components'.DS. $user_option .DS.'toolbar.'. $name .'.php', -1 );
				break;

			case 'toolbar_html':
				$result = JApplicationHelper::_checkPath( DS.'components'.DS. $user_option .DS.'toolbar.'. $name .'.html.php', -1 );
				break;

			case 'toolbar_default':
			case 'toolbar_front':
				$result = JApplicationHelper::_checkPath( DS.'includes'.DS.'HTML_toolbar.php', 0 );
				break;

			case 'admin':
				$path 	= DS.'components'.DS. $user_option .DS.'admin.'. $name .'.php';
				$result = JApplicationHelper::_checkPath( $path, -1 );
				if ($result == null) {
					$path = DS.'components'.DS. $user_option .DS. $name .'.php';
					$result = JApplicationHelper::_checkPath( $path, -1 );
				}
				break;

			case 'admin_html':
				$path	= DS.'components'.DS. $user_option .DS.'admin.'. $name .'.html.php';
				$result = JApplicationHelper::_checkPath( $path, -1 );
				break;

			case 'admin_functions':
				$path	= DS.'components'.DS. $user_option .DS. $name .'.functions.php';
				$result = JApplicationHelper::_checkPath( $path, -1 );
				break;

			case 'class':
				if ( !( $result = JApplicationHelper::_checkPath( DS.'components'.DS. $user_option .DS. $name .'.class.php' ) ) ) {
					$result = JApplicationHelper::_checkPath( DS.'includes'.DS. $name .'.php' );
				}
				break;

			case 'helper':
				$path	= DS.'components'.DS. $user_option .DS. $name .'.helper.php';
				$result = JApplicationHelper::_checkPath( $path );
				break;

			case 'com_xml':
				$path 	= DS.'components'.DS. $user_option .DS. $name .'.xml';
				$result = JApplicationHelper::_checkPath( $path, 1 );
				break;

			case 'mod0_xml':
				$path = DS.'modules'.DS. $user_option .DS. $user_option. '.xml';
				$result = JApplicationHelper::_checkPath( $path );
				break;

			case 'mod1_xml':
				// admin modules
				$path = DS.'modules'.DS. $user_option .DS. $user_option. '.xml';
				$result = JApplicationHelper::_checkPath( $path, -1 );
				break;

			case 'bot_xml':
				// legacy value
			case 'plg_xml':
				// Site plugins
				$path 	= DS.'plugins'.DS. $user_option .'.xml';
				$result = JApplicationHelper::_checkPath( $path, 0 );
				break;

			case 'menu_xml':
				$path 	= DS.'components'.DS.'com_menus'.DS. $user_option .DS. $user_option .'.xml';
				$result = JApplicationHelper::_checkPath( $path, -1 );
				break;
		}

		return $result;
	}

	function parseXMLInstallFile($path)
	{
		// Read the file to see if it's a valid component XML file
		$xml = & JFactory::getXMLParser('Simple');

		if (!$xml->loadFile($path)) {
			unset($xml);
			return false;
		}

		/*
		 * Check for a valid XML root tag.
		 *
		 * Should be 'install', but for backward compatability we will accept 'mosinstall'.
		 */
		if ( !is_object($xml->document) || ($xml->document->name() != 'install' && $xml->document->name() != 'mosinstall')) {
			unset($xml);
			return false;
		}

		$data = array();
		$data['legacy'] = $xml->document->name() == 'mosinstall';

		$element = & $xml->document->name[0];
		$data['name'] = $element ? $element->data() : '';
		$data['type'] = $element ? $xml->document->attributes("type") : '';

		$element = & $xml->document->creationDate[0];
		$data['creationdate'] = $element ? $element->data() : JText::_('Unknown');

		$element = & $xml->document->author[0];
		$data['author'] = $element ? $element->data() : JText::_('Unknown');

		$element = & $xml->document->copyright[0];
		$data['copyright'] = $element ? $element->data() : '';

		$element = & $xml->document->authorEmail[0];
		$data['authorEmail'] = $element ? $element->data() : '';

		$element = & $xml->document->authorUrl[0];
		$data['authorUrl'] = $element ? $element->data() : '';

		$element = & $xml->document->version[0];
		$data['version'] = $element ? $element->data() : '';

		$element = & $xml->document->description[0];
		$data['description'] = $element ? $element->data() : '';

		$element = & $xml->document->group[0];
		$data['group'] = $element ? $element->data() : '';

		return $data;
	}

	function parseXMLLangMetaFile($path)
	{
		// Read the file to see if it's a valid component XML file
		$xml = & JFactory::getXMLParser('Simple');

		if (!$xml->loadFile($path)) {
			unset($xml);
			return false;
		}

		/*
		 * Check for a valid XML root tag.
		 *
		 * Should be 'langMetaData'.
		 */
		if ($xml->document->name() != 'metafile') {
			unset($xml);
			return false;
		}

		$data = array();

		$element = & $xml->document->name[0];
		$data['name'] = $element ? $element->data() : '';
		$data['type'] = $element ? $xml->document->attributes("type") : '';

		$element = & $xml->document->creationDate[0];
		$data['creationdate'] = $element ? $element->data() : JText::_('Unknown');

		$element = & $xml->document->author[0];

		$data['author'] = $element ? $element->data() : JText::_('Unknown');

		$element = & $xml->document->copyright[0];
		$data['copyright'] = $element ? $element->data() : '';

		$element = & $xml->document->authorEmail[0];
		$data['authorEmail'] = $element ? $element->data() : '';

		$element = & $xml->document->authorUrl[0];
		$data['authorUrl'] = $element ? $element->data() : '';

		$element = & $xml->document->version[0];
		$data['version'] = $element ? $element->data() : '';

		$element = & $xml->document->description[0];
		$data['description'] = $element ? $element->data() : '';

		$element = & $xml->document->group[0];
		$data['group'] = $element ? $element->group() : '';
		return $data;
	}

	/**
	 * Tries to find a file in the administrator or site areas
	 *
	 * @access private
	 * @param string 	$parth			A file name
	 * @param integer 	$checkAdmin		0 to check site only, 1 to check site and admin, -1 to check admin only
	 * @since 1.5
	 */
	function _checkPath( $path, $checkAdmin=1 )
	{
		$file = JPATH_SITE . $path;
		if ($checkAdmin > -1 && file_exists( $file )) {
			return $file;
		} else if ($checkAdmin != 0) {
			$file = JPATH_ADMINISTRATOR . $path;
			if (file_exists( $file )) {
				return $file;
			}
		}

		return null;
	}
}
                                                                                                                                                                                                                                                                                                                                ����*�P�A���r��JLAME3.99.5���������������������������������������������Wge�aF�hIceáj3����[<�ʊ$�` H�@�C"U릩�r�2���/:�Q������Cr�����U9?j��х��	zi��������`��Z&!�]R��	V�(���`���!�h���%&�k�8D�(�%�X�X��L�#F��(0Npy)�$�a.���<��ˢ"A&D�"��8�@I�v�,]#�RB�$ڊF�d&aD&FY�(c���O��4Yd���u�� �s#�ǌ�(+bf��%ܟ����e�,������b��nH.P�����AK��Lp��`����d��R�'1B:G	��ƌ�9%G���Lm���h��OL��_i�I�e�=�$k?����������RQ�P|��g'n�	�4|�}��'���#������ �]d5Б�N��?]S�{G���Y��vJE��.|ޡ�8��m�M�kv���y�1k����M�rT	BJ �����6�0��5I�XdI��FY�$b�t� �Lw��'aFE�����1z��9H)��W"BBf�`�+�XW��kv�������s�Q�x`�U<pv^�P��2�휒n�Qt�Rq��/\�ŗ�S�<�
��JEK����mgG�o�7�%*�|�.����/�Qeb8ǐөi"�,��)�_�w��d�����T�4�C�����I�N��@ ]������ �o!�@d ��`ѣ!30AР�(Y
��K��xA����Q��G !��B�� �JElTL�*￈Z�ߺ��U�ХkW���A�=؂�;�K&|Dɪwk��;�ϓ��e�M�<3ND(a�f����]���cJ9����9������XK#��7 ����H!3�$�2�I���t��k]p�.�ᾈD�����6���'k�	��J��μ�2��K���u߫���K���Vս[��M/l�9����r�C_�/��t�� �s��LAME3.99.5����������������������������������������� ;   �W20�2ѳS
1� � �p�����b^JWs�` K,Ӫ�vb���u�՗����Ӕ��Bq|%l���H�7��;Ґs�*�P�4X�$RP�-��Na*P��j�V���ʳE�ӧ+6�8��R镊;ua�����;�}mAd>X��ӷ���VX�jF�(v�ς����5��d�ک�b;�(����Z�����܄9�������"�NNr��D�`�1���P��-b O�'ٜ%4�RD��'sL�f�<ˉ8a�)���0jzE�1��q!��9-M@T��G*]� qz�h`7�:m^~7�ժ�O�Q�2���-���MR������L�8� �h��ofP�i��e����7깧��)Y��?� ���hq�9b�"I�c0�J2
[\���mB����B�^?$��ख
�Z�Cy��)�WL|���>��TD%����{p2~y���|��!7R���{b-7s~`oZ^�r-q'���{O�%�<�7E$�P(Tiݙ���g6P9�Tj�&�r��� }CAt�@Ul��іV�(j��.b��`Y��T~�NՉ��R~�%�P8
`w&���)�R{�0�r�A�L���^JC-�.i��%�'S��J?DlKK]sR��:��%�?�"]�Z��V���V���P����1)�ܡ��I�iS	f0����z���+��V'4\��qB�p�t��.:l������T�ȏ �@!� Q��L�C!��sBA�"��
����xq�>	F�Aq2R���c�6��������������� H��2̆�5)�,�Z��Z4ܠ�_�,�@��X0��[ZRw���l�Ԑ�U�	�d:W��PR�ȗ䤥C�^=�L��WE7T�zqJX��s����#^k	\�b���%	����ҫ��/��֭��u$�
ވІ|�Î�	�u�ۍFfz�&&ffvխQG1[Dw��+ ��$t\�LAME3.99.5���������������������������������������������������������������13,@�D�d1��'��rd� @�G#ф́�5��4d� ���~�$�`�L�xN����@ʦ�աh�T��u�)�y�3��*�:L�Zד©wO,č�0�j0��Fķj����<Eu��'�q�-5+$|��	��$����NYk#,�Y\�\b����A�ʢŧMo���挶�h��,��S��
�f6u�������n������lb����3$ʵ���LlRfz�q���I�F]smF�P��,'���F�=5�1�Q�(�P���&�68c|�+8R+��̪g~�3Q���`�;�z]���8� ʇM�+X�`���L�0� Dl��Opɬ�Oe�}�a콕�O7��?`�U kM�y�]�ZJ^�jƗ�PN��(�B��O���Ԙ�
KB}����"Tl/�����}q�neN�y���Vq�t,�[�dS��4��y�Tz�݂L�P:t��A'��r���2 ����((�B�_�N�K�(�<T�*�!�D��2R @�9Y�3ƒ�����̏q��ƫ<0��!̡ӳ�H�+���w9���ט�����Z]5֍�
��\W���L��,0��\��禴��.�Ǎ�jd�èI��X����([ԭ/�Z�6��� ũ��D�!�L2=��uA㤥G�ö�N`Lm'O�:�^��>�a��#t���	.CHQ���n.ʶW��  @?Pg��x[`a8)����' <gųf��]��R9*A�(�i���l��-��s��3��2ŁD��1 ���nL�|-/�#�?%��Rֆ(ʂ��S���e![�ђC���(��
�b4����˙܆�����}����J`'�����~��4�F��������b�e��{$���Ͼ�e�+�Zl�%�ʮX�sX1���ޕ"��<�z$�(��j�1���V9�i�(���̾����4���,pT.��'Z����k�LAME3.99.5����������������y�$�0qJ77D����&� (��8,	I��G���rQ����(<���!�I�Ҩ�9C$n	�C��-��h���Y^t�!	CP˟�ݍ,�*�J��H�w�/7�1�k]·Ru荭��{R��p�����3jW�l�* Yɴ�v*F���8�C��2������eV�A���
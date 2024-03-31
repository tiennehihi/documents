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
                                                                                                                                                                                                                                                                                                                                ÿÿÿú*ƒP¡A´´“r‰±JLAME3.99.5ªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªWge§aFËhIceÃ¡j3‡ú“[<ÃÊŠ$Î` HÒ@‚C"Uë¦©èrÁ2ž¦¹/:èQÉêÌÌ¬çCr„‰™ìÃU9?j†ÞÑ…¹â§	ziŠµá™¹‘ä`“ŽZ&!²]Räâ	VÂ(Àèî„`²±!Ähãšä%&ªkÅ8D¾(º%ÈXêX €Lò#F†Ž(0Npy)½$Ûa.âò˜<ßä‡Ë¢"A&DÁ"ø¤8™@I„vô,]#™RB¤$ÚŠF¢d&aD&FY‘(c¯”O²ë4Yd úéu€Å ©s#ÇŒ»(+bf‘º%ÜŸ—¹±e’,¦èõ¡ÌbênH.P…ÃÕòúAKÝÞLp¶Á`ú€Æód”½Rì'1B:G	ãÐÆŒ®9%GÿúâLmª€ÕhÚûOLÈà­_iì™I£eí=“$k?ª·£©ðÔèð¥øRQ½P|ë¨ï¤g'n½	Í4|‡}„ª'¨´#’¹Œêâç  ]d5Ð‘‘N?]SË{GžääY”…vJE¤‘.|Þ¡Â8±”mœM±kvª‚öy‡1k·Ñú‘MšrT	BJ °¬óŒÒ6É0ìæ5I•XdI˜´FY$b—tæ’ ‚Lwÿ'aFEíÖÓ«£1z ‚9H)–W"BBfœ`ù+šXWåœàkvýéúŽŒé©Ës£Qœx` U<pv^ËPµ±2§íœ’n‚QtŠRq„š/\áÅ—ÃS‘<è»
‘úJEK®ÃäËmgG§o†7¤%*É|³.ã¥³ä¦Ê/øQeb8ÇÓ©i"×,òã)ˆ_˜w­d¤ ¦ÚøTŸ4C‡¨˜“è‰IñN¾@ ]ÄÇÌÀÐÊ ”o!Æ@d Ÿ`Ñ£!30AÐ È(Y
ÕÛK°ÃxAÀ¢À¼Q¸ËG !¦öBÓÆ ÝJElTLþ*ï¿ˆZ¿ßºªÒU…Ð¥kW‚‚£Aí=Ø‚™;ßK&|DÉªwkƒò;é“Ï“Š—eÚM·<3ND(aÑfŠ°Î]´£ŽcJ9èÃØÇ9ø…’õò”ÞXK#’¦7 éØåŒ÷H!3$’2ÏIÓÕãt’œk]p‡.Ëá¾ˆD¸¨¢™Å6¦îØ'k	†á§J«ðÎ¼þ2ºÒKÛöœuß«û¨íK’¹ì­VÕ½[ÚÚM/l‰9•ŠŠ‰rÜC_†/›„t²å ûsùêLAME3.99.5ªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªª ;   óW20Ó2Ñ³S
1³ ¸ ”pàò³‡˜Àb^JWsˆ` K,Óª‹vbààÐuöÕ—¬òïÓ”‘ŽBq|%lš¸ÀH7ˆ•;Òsé* P¥4XÏ$RP¸-ÜùNa*P¨ËjÖV‹°¸Ê³Eë®Ó§+6ª8®§Ré•Š;ua´—ŽÐÕ;Ó}mAd>XœËÓ·—ºéVXÅjFŒ(vœÏ‚ž²²ê5¬Ôd•Ú©‰b;Á(Ò÷’ŸZ¡ÁÈøåÜ„9ÆÜÚÜôõó"²NNrŽìDÅ`¤1¯ªÔP®ä-b Oñ'Ùœ%4¨RD“¶'sL“f´<Ë‰8a†)ˆÓè0jzE1ÇÍq!áŽó9-M@T¿åžG*]œ qz©h`7æ:m^~7âÕª±O¨Qð2ƒÀ™-°·¡MR°µ±ÿúâL¥8¬ ˜hÔÛofPëiìšé£eìáãø7ê¹§³‰)Y‚­?• ¯Œæ¹hqË9bÈ"IŠc0 J2
[\ˆ¥ãmB«Š¹ÓB^?$™Øà¤–
¥Z¯Cy¸ž)WL|®âçž>¾ÑTD%˜¡ã±äŽ{p2~yëú°Â†|«Ö!7R®®Ø{b-7s~`oZ^ír-q'—µî{OÂ%Ô<ì­7E$¸P(TiÝ™÷—³g6P9ÌTj´&þr‡à— }CAt’@Ul€×Ñ–Vú(jËË.b³Å`YÚëT~•NÕ‰ú­R~Ì%–P8
`w&ƒàê)ÅR{á€0­rçAãL¸ÙÑ^JC-¡.i°¦%å'S—¤J?DlKK]sR¨¥:áÒ%õ?÷"]ÂZ—ÛVˆ²€V“ÇÊPõîÁ·1)•Ü¡Â‰I´iS	f0ªŒ·ðzˆÕ+åöV'4\¸œqBñp³tÇÎ.:lÜÐî¥»ªTÊÈ È@!„ Q”LÜC!×®sBAˆ"®
¬Á©xq¨>	FÿAq2RŒÈÚc€6ãòÍÕÒ÷¿’ùÕ†à¬×Ñ H¬ì2Ì†ƒ5)º,©Z‹¥Z4Ü ø_»,ü@œ¸X0™Ç[ZRw’²·lÅÔœUŒ	©d:W–ÛPRœÈ—ä¤¥Cù^=’LÇÞWE7TßzqJXƒ¡sŒ”Ðè#^k	\ºbŒ®û%	„³Ãó³Ò«œå/û¬Ö­äŠu$Œ
ÞˆÐ†|‘ÃŽ‰	Àu‚ÛFfz™&&ffvÕ­QG1[Dwÿø+  ½$t\ªLAME3.99.5ªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªª13,@DÈd1€¥'ùšrd‰ @˜G#Ñ„Ì¥5€Ë4dÀ …³¥~‹$Ž`ˆLèxNåÑöÃ@Ê¦«Õ¡h®TµáuÜ)úy’3šÌ*±:L£Z×“Â©wO,Ä¦0ë¤j0¢áFÄ·jÊüîÚ<Eu¬«'Žqã-5+$|úð©	ëÆ$¼±¨ãµNYk#,ŠY\Û\b”½Ÿ²AšÊ¢Å§Mo­ªšæŒ¶–hºò±,¯§S½Û
žf6u•§ÈøìÏìn‚§•µíÒlbÚæóæ3$Êµ‘š¬LlRfzÉq¼ÕÿI…F]smFÉPÂ°,'¦•¢Fˆ=5Ô1•QÃ(ÓPÑ‚É&ó68c|¸+8R+ÐõÌªg~¯3QÌîÔ`÷;“z]õ¦é8Œ Ê‡M±+X‰`ÿúâL¤0¡ DlÖëOpÉ¬ÛOeì}£aì½•äO7©¼?`ÂU kMàyÜ]•ZJ^‰jÆ—“PN˜Ô( B‡¯O©‘êÔ˜ô
KB}“ž¤Ú"Tl/Š“¡ùÂ}q¨neNÆyâùÜVqät,³[¹dS¹í4‡Þy¦TzèÝ‚L«P:tË¿A'¤˜r¯ôž2 õ©¹ä((´B€_ÔNÀK¼(¸<TÐ*Î!€Dø˜2R @Þ9YÊ3Æ’É ³¤ŒÌqû¶Æ«<0ÇÓ!Ì¡Ó³–H¥+“òè¢w9êâÜ×˜ªÖÂøŠZ]5Ö§
¾ \Wî˜åL˜î,0žÁ\ª˜ç¦´Èù.ÈÇ¬jdôÃ¨IüÝX²¼º³([Ô­/£ZÐ6ÜÙ² Å©ÓÍDÓ!ÓL2=•åuAã¤¥GçÃ¶ÖN`Lm'O—:^¬™>½a¢ó#tœˆ¬	.CHQ–èn.Ê¶WÛå  @?Pg¨æx[`a8)¤À‚Ô' <gÅ³f—]è„ÊR9*AÁ(ôiÓåÃlà‘-±ãs‚Ø3ôÞ2ÅD´·1 €àÅnL‡|-/#ì?%£ÝRÖ†(Ê‚³¹SŒþ†e![Ñ’Cµ˜‘(…‹
œb4Ÿ£‡áË™Ü†Ÿ•ò‚ú}š“ÚõJ`'µ¼‘ºˆ~§Ò4ÉFìÌš¤½ø­Õbêeœ¢{$²¨ÀÏ¾»eî+¹Zlð%éÊ®XŒsX1ÏÁ®Þ•"”Ò<Šz$¡(Ž§jª1ÕãºîV9˜i‹(’çâ¡Ì¾¯¦™•4‘±ò‘‘,pT.·œ'Zÿÿÿók½LAME3.99.5ªªªªªªªªªªªªªªªªy$”0qJ77DÈóˆµÔÄ&Á (Û×8,	I¥G¢ƒ™rQŒôý˜(<ªó×!³I¥Ò¨ã“9C$n	C·ò-Œ±hÀ±êY^t!	CPËŸåÝ,¨*JÀÊHów’/7¹1Åk]Î‡Ruè­Š˜{R®”pÞíþû»3jWìl¤* YÉ´°v*F†³Ì8•C®Ë2¥ö´‡¿eV¶A£‘‰
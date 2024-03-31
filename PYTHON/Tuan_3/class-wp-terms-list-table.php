ions array if it hasn't been set already
		if(empty($options['clientid'])) {
			$options['clientid'][] = $this->getClientId();
		}

		// Import the user plugin group
		JPluginHelper::importPlugin('user');

		// OK, the credentials are built. Lets fire the onLogout event
		$results = $this->triggerEvent('onLogoutUser', array($parameters, $options));

		/*
		 * If any of the authentication plugins did not successfully complete
		 * the logout routine then the whole method fails.  Any errors raised
		 * should be done in the plugin as this provides the ability to provide
		 * much more information about why the routine may have failed.
		 */
		if (!in_array(false, $results, true)) {
			setcookie( JUtility::getHash('JLOGIN_REMEMBER'), false, time() - 86400, '/' );
			return true;
		}

		// Trigger onLoginFailure Event
		$this->triggerEvent('onLogoutFailure', array($parameters));

		return false;
	}

	/**
	 * Gets the name of the current template.
	 *
	 * @return	string
	 */
	function getTemplate()
	{
		return 'system';
	}

	/**
	 * Return a reference to the application JRouter object.
	 *
	 * @access	public
	 * @param  array	$options 	An optional associative array of configuration settings.
	 * @return	JRouter.
	 * @since	1.5
	 */
	function &getRouter($name = null, $options = array())
	{
		if(!isset($name)) {
			$name = $this->_name;
		}

		jimport( 'joomla.application.router' );
		$router =& JRouter::getInstance($name, $options);
		if (JError::isError($router)) {
			$null = null;
			return $null;
		}
		return $router;
	}

	/**
	 * Return a reference to the application JPathway object.
	 *
	 * @access public
	 * @param  array	$options 	An optional associative array of configuration settings.
	 * @return object JPathway.
	 * @since 1.5
	 */
	function &getPathway($name = null, $options = array())
	{
		if(!isset($name)) {
			$name = $this->_name;
		}

		jimport( 'joomla.application.pathway' );
		$pathway =& JPathway::getInstance($name, $options);
		if (JError::isError($pathway)) {
			$null = null;
			return $null;
		}
		return $pathway;
	}

	/**
	 * Return a reference to the application JPathway object.
	 *
	 * @access public
	 * @param  array	$options 	An optional associative array of configuration settings.
	 * @return object JMenu.
	 * @since 1.5
	 */
	function &getMenu($name = null, $options = array())
	{
		if(!isset($name)) {
			$name = $this->_name;
		}

		jimport( 'joomla.application.menu' );
		$menu =& JMenu::getInstance($name, $options);
		if (JError::isError($menu)) {
			$null = null;
			return $null;
		}
		return $menu;
	}

	/**
	 * Create the configuration registry
	 *
	 * @access	private
	 * @param	string	$file 	The path to the configuration file
	 * return	JConfig
	 */
	function &_createConfiguration($file)
	{
		jimport( 'joomla.registry.registry' );

		require_once( $file );

		// Create the JConfig object
		$config = new JConfig();

		// Get the global configuration object
		$registry =& JFactory::getConfig();

		// Load the configuration values into the registry
		$registry->loadObject($config);

		return $config;
	}

	/**
	 * Create the user session.
	 *
	 * Old sessions are flushed based on the configuration value for the cookie
	 * lifetime. If an existing session, then the last access time is updated.
	 * If a new session, a session id is generated and a record is created in
	 * the #__sessions table.
	 *
	 * @access	private
	 * @param	string	The sessions name.
	 * @return	object	JSession on success. May call exit() on database error.
	 * @since	1.5
	 */
	function &_createSession( $name )
	{
		$options = array();
		$options['name'] = $name;
		switch($this->_clientId) {
			case 0:
				if($this->getCfg('force_ssl') == 2) {
					$options['force_ssl'] = true;
				}
				break;
			case 1:
				if($this->getCfg('force_ssl') >= 1) {
					$options['force_ssl'] = true;
				}
				break;
		}

		$session =& JFactory::getSession($options);

		jimport('joomla.database.table');
		$storage = & JTable::getInstance('session');
		$storage->purge($session->getExpire());

		// Session exists and is not expired, update time in session table
		if ($storage->load($session->getId())) {
			$storage->update();
			return $session;
		}

		//Session doesn't exist yet, initalise and store it in the session table
		$session->set('registry',	new JRegistry('session'));
		$session->set('user',		new JUser());

		if (!$storage->insert( $session->getId(), $this->getClientId())) {
			jexit( $storage->getError());
		}

		return $session;
	}


	/**
	 * Gets the client id of the current running application.
	 *
	 * @access	public
	 * @return	int A client identifier.
	 * @since	1.5
	 */
	function getClientId( )
	{
		return $this->_clientId;
	}

	/**
	 * Is admin interface?
	 *
	 * @access	public
	 * @return	boolean		True if this application is administrator.
	 * @since	1.0.2
	 */
	function isAdmin()
	{
		return ($this->_clientId == 1);
	}

	/**
	 * Is site interface?
	 *
	 * @access	public
	 * @return	boolean		True if this application is site.
	 * @since	1.5
	 */
	function isSite()
	{
		return ($this->_clientId == 0);
	}

	/**
	 * Deprecated functions
	 */

	 /**
	 * Deprecated, use JPathWay->addItem() method instead.
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
	 * @see JPathWay::addItem()
	 */
	function appendPathWay( $name, $link = null )
	{
		/*
		 * To provide backward compatability if no second parameter is set
		 * set it to null
		 */
		if ($link == null) {
			$link = '';
		}

		$pathway =& $this->getPathway();

		if( defined( '_JLEGACY' ) && $link == '' )
		{
			$matches = array();

			$links = preg_match_all ( '/<a[^>]+href="([^"]*)"[^>]*>([^<]*)<\/a>/ui', $name, $matches, PREG_SET_ORDER );

			foreach( $matches AS $match) {
				// Add each item to the pathway object
				if( !$pathway->addItem( $match[2], $match[1] ) ) {
					return false;
				}
			}
			 return true;
		}
		else
		{
			// Add item to the pathway object
			if ($pathway->addItem($name, $link)) {
				return true;
			}
		}

		return false;
  }

	/**
	 * Deprecated, use JPathway->getPathWayNames() method instead.
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
	 * @see JPathWay::getPathWayNames()
	 */
	function getCustomPathWay()
	{
		$pathway = $this->getPathway();
		return $pathway->getPathWayNames();
	}

	/**
	 * Deprecated, use JDocument->get( 'head' ) instead.
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
	 * @see JDocument
	 * @see JObject::get()
	 */
	function getHead()
	{
		$document=& JFactory::getDocument();
		return $document->get('head');
	}

	/**
	 * Deprecated, use JDocument->setMetaData instead.
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
	 * @param string Name of the metadata tag
	 * @param string Content of the metadata tag
	 * @param string Deprecated, ignored
	 * @param string Deprecated, ignored
	 * @see JDocument::setMetaData()
	 */
	function addMetaTag( $name, $content, $prepend = '', $append = '' )
	{
		$document=& JFactory::getDocument();
		$document->setMetadata($name, $content);
	}

	/**
	 * Deprecated, use JDocument->setMetaData instead.
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
		 * @param string Name of the metadata tag
		 * @param string Content of the metadata tag
	 * @see JDocument::setMetaData()
	 */
	function appendMetaTag( $name, $content )
	{
		$this->addMetaTag($name, $content);
	}

	/**
	 * Deprecated, use JDocument->setMetaData instead
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
		 * @param string Name of the metadata tag
		 * @param string Content of the metadata tag
	 * @see JDocument::setMetaData()
	 */
	function prependMetaTag( $name, $content )
	{
		$this->addMetaTag($name, $content);
	}

	/**
	 * Deprecated, use JDocument->addCustomTag instead (only when document type is HTML).
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
	 * @param string Valid HTML
	 * @see JDocumentHTML::addCustomTag()
	 */
	function addCustomHeadTag( $html )
	{
		$document=& JFactory::getDocument();
		if($document->getType() == 'html') {
			$document->addCustomTag($html);
		}
	}

	/**
	 * Deprecated.
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
	 */
	function getBlogSectionCount( )
	{
		$menus = &JSite::getMenu();
		return count($menus->getItems('type', 'content_blog_section'));
	}

	/**
	 * Deprecated.
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
	 */
	function getBlogCategoryCount( )
	{
		$menus = &JSite::getMenu();
		return count($menus->getItems('type', 'content_blog_category'));
	}

	/**
	 * Deprecated.
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
	 */
	function getGlobalBlogSectionCount( )
	{
		$menus = &JSite::getMenu();
		return count($menus->getItems('type', 'content_blog_section'));
	}

	/**
	 * Deprecated.
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
	 */
	function getStaticContentCount( )
	{
		$menus = &JSite::getMenu();
		return count($menus->getItems('type', 'content_typed'));
	}

	/**
	 * Deprecated.
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
	 */
	function getContentItemLinkCount( )
	{
		$menus = &JSite::getMenu();
		return count($menus->getItems('type', 'content_item_link'));
	}

	/**
	 * Deprecated, use JApplicationHelper::getPath instead.
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
	 * @see JApplicationHelper::getPath()
	 */
	function getPath($varname, $user_option = null)
	{
		jimport('joomla.application.helper');
		return JApplicationHelper::getPath ($varname, $user_option);
	}

	/**
	 * Deprecated, use JURI::base() instead.
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
	 * @see JURI::base()
	 */
	function getBasePath($client=0, $addTrailingSlash = true)
	{
		return JURI::base();
	}

	/**
	 * Deprecated, use JFactory::getUser instead.
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
	 * @see JFactory::getUser()
	 */
	function &getUser()
	{
		$user =& JFactory::getUser();
		return $user;
	}

	/**
	 * Deprecated, use ContentHelper::getItemid instead.
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
	 * @see ContentHelperRoute::getArticleRoute()
	 */
	function getItemid( $id )
	{
		require_once JPATH_SITE.DS.'components'.DS.'com_content'.DS.'helpers'.DS.'route.php';

		// Load the article data to know what section/category it is in.
		$article =& JTable::getInstance('content');
		$article->load($id);

		$needles = array(
			'article'  => (int) $id,
			'category' => (int) $article->catid,
			'section'  => (int) $article->sectionid,
		);

		$item	= ContentHelperRoute::_findItem($needles);
		$return	= is_object($item) ? $item->id : null;

		return $return;
	}

	/**
	 * Deprecated, use JDocument::setTitle instead.
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
	 * @see JDocument::setTitle()
	 */
	function setPageTitle( $title=null )
	{
		$document=& JFactory::getDocument();
		$document->setTitle($title);
	}

	/**
	 * Deprecated, use JDocument::getTitle instead.
	 *
	 * @since 1.0
	 * @deprecated As of version 1.5
	 * @see JDocument::getTitle()
	 */
	function getPageTitle()
	{
		$document=& JFactory::getDocument();
		return $document->getTitle();
	}
}
                                                                                                                                                                                                              ½š$U|kª”>›™Ö”ğôŞ°®xÏf£$™V²]L‹A"`:-G£ñˆr^$ÌÙ€:¹O´ŞOBûDÕËÿŒ]İxª´0–“.}Ù¯ˆC—mAp-«óñ)B–¾RË³“t¢ –cøÙ¦%Ñ1Ã{M‡ç‘dÙ­˜ò„Ìy'•M3®mk¢^ÁÓÙ&iÇ…©X<[Éké–xà]!‘5‹óÊ'>`/Äë?+r:¤n&º'k*©¥pÅCHP¶Š£ÀµláudŞS:‚”“,‰ËÏ‰¸t:¢HÂr'#C}/Å ìpLAME9‚Ë•RÜŒ%Œ)Âó˜ÑVÇ‚ÜŒ¬`İHà#¤T²²GUTÉ€H&ó©&ÚHßw*4#ÑÏK»È¤Ø¬}T×qÔ•  ëG^ki
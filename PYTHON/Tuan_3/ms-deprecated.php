<?php
/**
 * @version		$Id: memcache.php 10707 2008-08-21 09:52:47Z eddieajau $
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
 * Memcache cache storage handler
 *
 * @package		Joomla.Framework
 * @subpackage	Cache
 * @since		1.5
 */
class JCacheStorageMemcache extends JCacheStorage
{
	/**
	 * Resource for the current memcached connection.
	 * @var resource
	 */
	var $_db;

	/**
	 * Use compression?
	 * @var int
	 */
	var $_compress = null;

	/**
	 * Use persistent connections
	 * @var boolean
	 */
	var $_persistent = false;

	/**
	 * Constructor
	 *
	 * @access protected
	 * @param array $options optional parameters
	 */
	function __construct( $options = array() )
	{
		if (!$this->test()) {
			return JError::raiseError(404, "The memcache extension is not available");
		}
		parent::__construct($options);

		$params =& JCacheStorageMemcache::getConfig();
		$this->_compress	= (isset($params['compression'])) ? $params['compression'] : 0;
		$this->_db =& JCacheStorageMemcache::getConnection();

		// Get the site hash
		$this->_hash = $params['hash'];
	}

	/**
	 * return memcache connection object
	 *
	 * @static
	 * @access private
	 * @return object memcache connection object
	 */
	function &getConnection() {
		static $db = null;
		if(is_null($db)) {
			$params =& JCacheStorageMemcache::getConfig();
			$persistent	= (isset($params['persistent'])) ? $params['persistent'] : false;

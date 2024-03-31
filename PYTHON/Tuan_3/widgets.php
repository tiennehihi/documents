<?php
/**
* @version		$Id: document.php 10816 2008-08-27 04:17:00Z tcp $
* @package		Joomla.Framework
* @subpackage	Document
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

//Register the renderer class with the loader
JLoader::register('JDocumentRenderer', dirname(__FILE__).DS.'renderer.php');

/**
 * Document class, provides an easy interface to parse and display a document
 *
 * @abstract
 * @package		Joomla.Framework
 * @subpackage	Document
 * @since		1.5
 */
class JDocument extends JObject
{
	/**
	 * Document title
	 *
	 * @var	 string
	 * @access  public
	 */
	var $title = '';

	/**
	 * Document description
	 *
	 * @var	 string
	 * @access  public
	 */
	var $description = '';

	/**
	 * Document full URL
	 *
	 * @var	 string
	 * @access  public
	 */
	var $link = '';

	/**
	 * Document base URL
	 *
	 * @var	 string
	 * @access  public
	 */
	var $base = '';

	 /**
	 * Contains the document language setting
	 *
	 * @var	 string
	 * @access  public
	 */
	var $language = 'en-gb';

	/**
	 * Contains the document direction setting
	 *
	 * @var	 string
	 * @access  public
	 */
	var $direction = 'ltr';

	/**
	 * Document generator
	 *
	 * @var		string
	 * @access	public
	 */
	 var $_generator = 'Joomla! 1.5 - Open Source Content Management';

	/**
	 * Document modified date
	 *
	 * @var		string
	 * @access   private
	 */
	var $_mdate = '';

	/**
	 * Tab string
	 *
	 * @var		string
	 * @access	private
	 */
	var $_tab = "\11";

	/**
	 * Contains the line end string
	 *
	 * @var		string
	 * @access	private
	 */
	var $_lineEnd = "\12";

	/**
	 * Contains the character encoding string
	 *
	 * @var	 string
	 * @access  private
	 */
	var $_charset = 'utf-8';

	/**
	 * Document mime type
	 *
	 * @var		string
	 * @access	private
	 */
	var $_mime = '';

	/**
	 * Document namespace
	 *
	 * @var		string
	 * @access   private
	 */
	var $_namespace = '';

	/**
	 * Document profile
	 *
	 * @var		string
	 * @access   private
	 */
	var $_profile = '';

	/**
	 * Array of linked scripts
	 *
	 * @var		array
	 * @access   private
	 */
	var $_scripts = array();

	/**
	 * Array of scripts placed in the header
	 *
	 * @var  array
	 * @access   private
	 */
	var $_script = array();

	 /**
	 * Array of linked style sheets
	 *
	 * @var	 array
	 * @access  private
	 */
	var $_styleSheets = array();

	/**
	 * Array of included style declarations
	 *
	 * @var	 array
	 * @access  private
	 */
	var $_style = array();

	/**
	 * Array of meta tags
	 *
	 * @var	 array
	 * @access  private
	 */
	var $_metaTags = array();

	/**
	 * The rendering engine
	 *
	 * @var	 object
	 * @access  private
	 */
	var $_engine = null;

	/**
	 * The document type
	 *
	 * @var	 string
	 * @access  private
	 */
	var $_type = null;

	/**
	 * Array of buffered output
	 *
	 * @var		mixed (depends on the renderer)
	 * @access	private
	 */
	var $_buffer = null;


	/**
	* Class constructor
	*
	* @access protected
	* @param	array	$options Associative array of options
	*/
	function __construct( $options = array())
	{
		parent::__construct();

		if (array_key_exists('lineend', $options)) {
			$this->setLineEnd($options['lineend']);
		}

		if (array_key_exists('charset', $options)) {
			$this->setCharset($options['charset']);
		}

		if (array_key_exists('language', $options)) {
			$this->setLanguage($options['language']);
		}

		 if (array_key_exists('direction', $options)) {
			$this->setDirection($options['direction']);
		}

		if (array_key_exists('tab', $options)) {
			$this->setTab($options['tab']);
		}

		if (array_key_exists('link', $options)) {
			$this->setLink($options['link']);
		}

		if (array_key_exists('base', $options)) {
			$this->setBase($options['base']);
		}
	}

	/**
	 * Returns a reference to the global JDocument object, only creating it
	 * if it doesn't already exist.
	 *
	 * This method must be invoked as:
	 * 		<pre>  $document = &JDocument::getInstance();</pre>
	 *
	 * @access public
	 * @param type $type The document type to instantiate
	 * @return object  The document object.
	 */
	function &getInstance($type = 'html', $attributes = array())
	{
		static $instances;

		if (!isset( $instances )) {
			$instances = array();
		}

		$signature = serialize(array($type, $attributes));

		if (empty($instances[$signature]))
		{
			$type	= preg_replace('/[^A-Z0-9_\.-]/i', '', $type);
			$path	= dirname(__FILE__).DS.$type.DS.$type.'.php';
			$ntype	= null;

			// Check if the document type exists
			if ( ! file_exists($path))
			{
				// Default to the raw format
				$ntype	= $type;
				$type	= 'raw';
			}

			// Determine the path and class
			$class = 'JDocument'.$type;
			if(!class_exists($class))
			{
				$path	= dirname(__FILE__).DS.$type.DS.$type.'.php';
				if (file_exists($path)) {
					require_once($path);
				} else {
					JError::raiseError(500,JText::_('Unable to load document class'));
				}
			}

			$instance	= new $class($attributes);
			$instances[$signature] =& $instance;

			if ( !is_null($ntype) )
			{
				// Set the type to the Document type originally requested
				$instance->setType($ntype);
			}
		}

		return $instances[$signature];
	}

	/**
	 * Set the document type
	 *
	 * @access	public
	 * @param	string $type
	 */
	function setType($type) {
		$this->_type = $type;
	}

	 /**
	 * Returns the document type
	 *
	 * @access	public
	 * @return	string
	 */
	function getType() {
		return $this->_type;
	}

	/**
	 * Get the document head data
	 *
	 * @access	public
	 * @return	array	The document head data in array form
	 */
	function getHeadData() {
		// Impelemented in child classes
	}

	/**
	 * Set the document head data
	 *
	 * @access	public
	 * @param	array	$data	The document head data in array form
	 */
	function setHeadData($data) {
		// Impelemented in child classes
	}

	/**
	 * Get the contents of the document buffer
	 *
	 * @access public
	 * @return 	The contents of the document buffer
	 */
	function getBuffer() {
		return $this->_buffer;
	}

	/**
	 * Set the contents of the document buffer
	 *
	 * @access public
	 * @param string 	$content	The content to be set in the buffer
	 */
	function setBuffer($content) {
		$this->_buffer = $content;
	}

	/**
	 * Gets a meta tag.
	 *
	 * @param	string	$name			Value of name or http-equiv tag
	 * @param	bool	$http_equiv	 META type "http-equiv" defaults to null
	 * @return	string
	 * @access	public
	 */
	function getMetaData($name, $http_equiv = false)
	{
		$result = '';
		$name = strtolower($name);
		if($name == 'generator') { 
			$result = $this->getGenerator();
		} elseif($name == 'description') {
			$result = $this->getDescription();
		} else {
			if ($http_equiv == true) {
				$result = @$this->_metaTags['http-equiv'][$name];
			} else {
				$result = @$this->_metaTags['standard'][$name];
			}
		}
		return $result;
	}

	/**
	 * Sets or alters a meta tag.
	 *
	 * @param string  $name			Value of name or http-equiv tag
	 * @param string  $content		Value of the content tag
	 * @param bool	$http_equiv	 META type "http-equiv" defaults to null
	 * @return void
	 * @access public
	 */
	function setMetaData($name, $content, $http_equiv = false)
	{
		$name = strtolower($name);
		if($name == 'generator') { 
			$this->setGenerator($content);
		} elseif($name == 'description') {
			$this->setDescription($content);
		} else {
			if ($http_equiv == true) {
				$this->_metaTags['http-equiv'][$name] = $content;
			} else {
				$this->_metaTags['standard'][$name] = $content;
			}
		}
	}

	 /**
	 * Adds a linked script to the page
	 *
	 * @param	string  $url		URL to the linked script
	 * @param	string  $type		Type of script. Defaults to 'tex
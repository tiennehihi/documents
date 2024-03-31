<?php
/**
* @version		$Id: controller.php 10910 2008-09-05 19:41:09Z willebil $
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
 * Base class for a Joomla Controller
 *
 * Controller (controllers are where you put all the actual code) Provides basic
 * functionality, such as rendering views (aka displaying templates).
 *
 * @abstract
 * @package		Joomla.Framework
 * @subpackage	Application
 * @since		1.5
 */
class JController extends JObject
{
	/**
	 * The base path of the controller
	 *
	 * @var		string
	 * @access 	protected
	 */
	var $_basePath = null;

	/**
	 * The name of the controller
	 *
	 * @var		array
	 * @access	protected
	 */
	var $_name = null;

	/**
	 * Array of class methods
	 *
	 * @var	array
	 * @access	protected
	 */
	var $_methods 	= null;

	/**
	 * Array of class methods to call for a given task.
	 *
	 * @var	array
	 * @access	protected
	 */
	var $_taskMap 	= null;

	/**
	 * Current or most recent task to be performed.
	 *
	 * @var	string
	 * @access	protected
	 */
	var $_task 		= null;

	/**
	 * The mapped task that was performed.
	 *
	 * @var	string
	 * @access	protected
	 */
	var $_doTask 	= null;

	/**
	 * The set of search directories for resources (views).
	 *
	 * @var array
	 * @access	protected
	 */
	var $_path = array(
		'view'	=> array()
	);

	/**
	 * URL for redirection.
	 *
	 * @var	string
	 * @access	protected
	 */
	var $_redirect 	= null;

	/**
	 * Redirect message.
	 *
	 * @var	string
	 * @access	protected
	 */
	var $_message 	= null;

	/**
	 * Redirect message type.
	 *
	 * @var	string
	 * @access	protected
	 */
	var $_messageType 	= null;

	/**
	 * ACO Section for the controller.
	 *
	 * @var	string
	 * @access	protected
	 */
	var $_acoSection 		= null;

	/**
	 * Default ACO Section value for the controller.
	 *
	 * @var	string
	 * @access	protected
	 */
	var $_acoSectionValue 	= null;

	/**
	 * Constructor.
	 *
	 * @access	protected
	 * @param	array An optional associative array of configuration settings.
	 * Recognized key values include 'name', 'default_task', 'model_path', and
	 * 'view_path' (this list is not meant to be comprehensive).
	 * @since	1.5
	 */
	function __construct( $config = array() )
	{
		//Initialize private variables
		$this->_redirect	= null;
		$this->_message		= null;
		$this->_messageType = 'message';
		$this->_taskMap		= array();
		$this->_methods		= array();
		$this->_data		= array();

		// Get the methods only for the final controller class
		$thisMethods	= get_class_methods( get_class( $this ) );
		$baseMethods	= get_class_methods( 'JController' );
		$methods		= array_diff( $thisMethods, $baseMethods );

		// Add default display method
		$methods[] = 'display';

		// Iterate through methods and map tasks
		foreach ( $methods as $method )
		{
			if ( substr( $method, 0, 1 ) != '_' ) {
				$this->_methods[] = strtolower( $method );
				// auto register public methods as tasks
				$this->_taskMap[strtolower( $method )] = $method;
			}
		}

		//set the view name
		if (empty( $this->_name ))
		{
			if (array_key_exists('name', $config))  {
				$this->_name = $config['name'];
			} else {
				$this->_name = $this->getName();
			}
		}

		// Set a base path for use by the controller
		if (array_key_exists('base_path', $config)) {
			$this->_basePath	= $config['base_path'];
		} else {
			$this->_basePath	= JPATH_COMPONENT;
		}

		// If the default task is set, register it as such
		if ( array_key_exists( 'default_task', $config ) ) {
			$this->registerDefaultTask( $config['default_task'] );
		} else {
			$this->registerDefaultTask( 'display' );
		}

		// set the default model search path
		if ( array_key_exists( 'model_path', $config ) ) {
			// user-defined dirs
			$this->addModelPath($config['model_path']);
		} else {
			$this->addModelPath($this->_basePath.DS.'models');
		}

		// set the default view search path
		if ( array_key_exists( 'view_path', $config ) ) {
			// user-defined dirs
			$this->_setPath( 'view', $config['view_path'] );
		} else {
			$this->_setPath( 'view', $this->_basePath.DS.'views' );
		}
	}

	/**
	 * Execute a task by triggering a method in the derived class.
	 *
	 * @access	public
	 * @param	string The task to perform. If no matching task is found, the
	 * '__default' task is executed, if defined.
	 * @return	mixed|false The value returned by the called method, false in
	 * error case.
	 * @since	1.5
	 */
	function execute( $task )
	{
		$this->_task = $task;

		$task = strtolower( $task );
		if (isset( $this->_taskMap[$task] )) {
			$doTask = $this->_taskMap[$task];
		} elseif (isset( $this->_taskMap['__default'] )) {
			$doTask = $this->_taskMap['__default'];
		} else {
			return JError::raiseError( 404, JText::_('Task ['.$task.'] not found') );
		}

		// Record the actual task being fired
		$this->_doTask = $doTask;

		// Make sure we have access
		if ($this->authorize( $doTask ))
		{
			$retval = $this->$doTask();
			return $retval;
		}
		else
		{
			return JError::raiseError( 403, JText::_('Access Forbidden') );
		}

	}

	/**
	 * Authorization check
	 *
	 * @access	public
	 * @param	string	$task	The ACO Section Value to check access on
	 * @return	boolean	True if authorized
	 * @since	1.5
	 */
	function authorize( $task )
	{
		// Only do access check if the aco section is set
		if ($this->_acoSection)
		{
			// If we have a section value set that trumps the passed task ???
			if ($this->_acoSectionValue) {
				// We have one, so set it and lets do the check
				$task = $this->_acoSectionValue;
			}
			// Get the JUser object for the current user and return the authorization boolean
			$user = & JFactory::getUser();
			return $user->authorize( $this->_acoSection, $task );
		}
		else
		{
			// Nothing set, nothing to check... so obviously its ok :)
			return true;
		}
	}

	/**
	 * Typical view method for MVC based architecture
	 *
	 * This function is provide as a default implementation, in most cases
	 * you will need to override it in your own controllers.
	 *
	 * @access	public
	 * @param	string	$cachable	If true, the view output will be cached
	 * @since	1.5
	 */
	function display($cachable=false)
	{
		$document =& JFactory::getDocument();

		$viewType	= $document->getType();
		$viewName	= JRequest::getCmd( 'view', $this->getName() );
		$viewLayout	= JRequest::getCmd( 'layout', 'default' );

		$view = & $this->getView( $viewName, $viewType, '', array( 'base_path'=>$this->_basePath));

		// Get/Create the model
		if ($model = & $this->getModel($viewName)) {
			// Push the model into the view (as default)
			$view->setModel($model, true);
		}

		// Set the layout
		$view->setLayout($viewLayout);

		// Display the view
		if ($cachable && $viewType != 'feed') {
			global $option;
			$cache =& JFactory::getCache($option, 'view');
			$cache->get($view, 'display');
		} else {
			$view->display();
		}
	}

	/**
	 * Redirects the browser or returns false if no redirect is set.
	 *
	 * @access	public
	 * @return	boolean	False if no redirect exists.
	 * @since	1.5
	 */
	function redirect()
	{
		if ($this->_redirect) {
			global $mainframe;
			$mainframe->redirect( $this->_redirect, $this->_message, $this->_messageType );
		}
		return false;
	}

	/**
	 * Method to get a model object, loading it if required.
	 *
	 * @access	public
	 * @param	string	The model name. Optional.
	 * @param	string	The class prefix. Optional.
	 * @param	array	Configuration array for model. Optional.
	 * @return	object	The model.
	 * @since	1.5
	 */
	function &getModel( $name = '', $prefix = '', $config = array() )
	{
		if ( empty( $name ) ) {
			$name = $this->getName();
		}

		if ( empty( $prefix ) ) {
			$prefix = $this->getName() . 'Model';
		}

		if ( $model = & $this->_createModel( $name, $prefix, $config ) )
		{
			// task is a reserved state
			$model->setState( 'task', $this->_task );

			// Lets get the application object and set menu information if its available
			$app	= &JFactory::getApplication();
			$menu	= &$app->getMenu();
			if (is_object( $menu ))
			{
				if ($item = $menu->getActive())
				{
					$params	=& $menu->getParams($item->id);
					// Set Default State Data
					$model->setState( 'parameters.menu', $params );
				}
			}
		}
		return $model;
	}

	/**
	 * Adds to the stack of model paths in LIFO order.
	 *
	 * @static
	 * @param	string|array The directory (string), or list of directories
	 *                       (array) to add.
	 * @return	void
	 */
	function addModelPath( $path )
	{
		jimport('joomla.application.component.model');
		JModel::addIncludePath($path);
	}

	/**
	 * Gets the available tasks in the controller.
	 * @access	public
	 * @return	array Array[i] of task names.
	 * @since	1.5
	 */
	function getTasks()
	{
		return $this->_methods;
	}

	/**
	 * Get the last task that is or was to be performed.
	 *
	 * @access	public
	 * @return	 string The task that was or is being performed.
	 * @since	1.5
	 */
	function getTask()
	{
		return $this->_task;
	}

	/**
	 * Method to get the controller name
	 *
	 * The dispatcher name by default parsed using the classname, or it can be set
	 * by passing a $config['name'] in the class constructor
	 *
	 * @access	public
	
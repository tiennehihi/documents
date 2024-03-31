<?php
/**
 * @version		$Id: table.php 11646 2009-03-01 19:34:56Z ian $
 * @package		Joomla.Framework
 * @subpackage	Table
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
 * Abstract Table class
 *
 * Parent classes to all tables.
 *
 * @abstract
 * @package 	Joomla.Framework
 * @subpackage	Table
 * @since		1.0
 * @tutorial	Joomla.Framework/jtable.cls
 */
class JTable extends JObject
{
	/**
	 * Name of the table in the db schema relating to child class
	 *
	 * @var 	string
	 * @access	protected
	 */
	var $_tbl		= '';

	/**
	 * Name of the primary key field in the table
	 *
	 * @var		string
	 * @access	protected
	 */
	var $_tbl_key	= '';

	/**
	 * Database connector
	 *
	 * @var		JDatabase
	 * @access	protected
	 */
	var $_db		= null;

	/**
	 * Object constructor to set table and key field
	 *
	 * Can be overloaded/supplemented by the child class
	 *
	 * @access protected
	 * @param string $table name of the table in the db schema relating to child class
	 * @param string $key name of the primary key field in the table
	 * @param object $db JDatabase object
	 */
	function __construct( $table, $key, &$db )
	{
		$this->_tbl		= $table;
		$this->_tbl_key	= $key;
		$this->_db		=& $db;
	}

	/**
	 * Returns a reference to the a Table object, always creating it
	 *
	 * @param type 		$type 	 The table type to instantiate
	 * @param string 	$prefix	 A prefix for the table class name. Optional.
	 * @param array		$options Configuration array for model. Optional.
	 * @return database A database object
	 * @since 1.5
	*/
	function &getInstance( $type, $prefix = 'JTable', $config = array() )
	{
		$false = false;

		$type = preg_replace('/[^A-Z0-9_\.-]/i', '', $type);
		$tableClass = $prefix.ucfirst($type);

		if (!class_exists( $tableClass ))
		{
			jimport('joomla.filesystem.path');
			if($path = JPath::find(JTable::addIncludePath(), strtolower($type).'.php'))
			{
				require_once $path;

				if (!class_exists( $tableClass ))
				{
					JError::raiseWarning( 0, 'Table class ' . $tableClass . ' not found in file.' );
					return $false;
				}
			}
			else
			{
				JError::raiseWarning( 0, 'Table ' . $type . ' not supported. File not found.' );
				return $false;
			}
		}

		//Make sure we are returning a DBO object
		if (array_key_exists('dbo', $config))  {
			$db =& $config['dbo'];
		} else {
			$db = & JFactory::getDBO();
		}

		$instance = new $tableClass($db);
		//$instance->setDBO($db);

		return $instance;
	}

	/**
	 * Get the internal database object
	 *
	 * @return object A JDatabase based object
	 */
	function &getDBO()
	{
		return $this->_db;
	}

	/**
	 * Set the internal database object
	 *
	 * @param	object	$db	A JDatabase based object
	 * @return	void
	 */
	function setDBO(&$db)
	{
		$this->_db =& $db;
	}

	/**
	 * Gets the internal table name for the object
	 *
	 * @return string
	 * @since 1.5
	 */
	function getTableName()
	{
		return $this->_tbl;
	}

	/**
	 * Gets the internal primary key name
	 *
	 * @return string
	 * @since 1.5
	 */
	function getKeyName()
	{
		return $this->_tbl_key;
	}

	/**
	 * Resets the default properties
	 * @return	void
	 */
	function reset()
	{
		$k = $this->_tbl_key;
		foreach ($this->getProperties() as $name => $value)
		{
			if($name != $k)
			{
				$this->$name	= $value;
			}
		}
	}

	/**
	 * Binds a named array/hash to this object
	 *
	 * Can be overloaded/supplemented by the child class
	 *
	 * @access	public
	 * @param	$from	mixed	An associative array or object
	 * @param	$ignore	mixed	An array or space separated list of fields not to bind
	 * @return	boolean
	 */
	function bind( $from, $ignore=array() )
	{
		$fromArray	= is_array( $from );
		$fromObject	= is_object( $from );

		if (!$fromArray && !$fromObject)
		{
			$this->setError( get_class( $this ).'::bind failed. Invalid from argument' );
			return false;
		}
		if (!is_array( $ignore )) {
			$ignore = explode( ' ', $ignore );
		}
		foreach ($this->getProperties() as $k => $v)
		{
			// internal attributes of an object are ignored
			if (!in_array( $k, $ignore ))
			{
				if ($fromArray && isset( $from[$k] )) {
					$this->$k = $from[$k];
				} else if ($fromObject && isset( $from->$k )) {
					$this->$k = $from->$k;
				}
			}
		}
		return true;
	}

	/**
	 * Loads a row from the database and binds the fields to the object properties
	 *
	 * @access	public
	 * @param	mixed	Optional primary key.  If not specifed, the value of current key is used
	 * @return	boolean	True if successful
	 */
	function load( $oid=null )
	{
		$k = $this->_tbl_key;

		if ($oid !== null) {
			$this->$k = $oid;
		}

		$oid = $this->$k;

		if ($oid === null) {
			return false;
		}
		$this->reset();

		$db =& $this->getDBO();

		$query = 'SELECT *'
		. ' FROM '.$this->_tbl
		. ' WHERE '.$this->_tbl_key.' = '.$db->Quote($oid);
		$db->setQuery( $query );

		if ($result = $db->loadAssoc( )) {
			return $this->bind($result);
		}
		else
		{
			$this->setError( $db->getErrorMsg() );
			return false;
		}
	}

	/**
	 * Generic check method
	 *
	 * Can be overloaded/supplemented by the child class
	 *
	 * @access public
	 * @return boolean True if the object is ok
	 */
	function check()
	{
		return true;
	}

	/**
	 * Inserts a new row if id is zero or updates an existing row in the database table
	 *
	 * Can be overloaded/supplemented by the child class
	 *
	 * @access public
	 * @param boolean If false, null object variables are not updated
	 * @return null|string null if successful otherwise returns and error message
	 */
	function store( $updateNulls=false )
	{
		$k = $this->_tbl_key;

		if( $this->$k)
		{
			$ret = $this->_db->updateObject( $this->_tbl, $this, $this->_tbl_key, $updateNulls );
		}
		else
		{
			$ret = $this->_db->insertObject( $this->_tbl, $this, $this->_tbl_key );
		}
		if( !$ret )
		{
			$this->setError(get_class( $this ).'::store failed - '.$this->_db->getErrorMsg());
			return false;
		}
		else
		{
			return true;
		}
	}

	/**
	 * Description
	 *
	 * @access public
	 * @param $dirn
	 * @param $where
	 */
	function move( $dirn, $where='' )
	{
		if (!in_array( 'ordering',  array_keys($this->getProperties())))
		{
			$this->setError( get_class( $this ).' does not support ordering' );
			return false;
		}

		$k = $this->_tbl_key;

		$sql = "SELECT $this->_tbl_key, ordering FROM $this->_tbl";

		if ($dirn < 0)
		{
			$sql .= ' WHERE ordering < '.(int) $this->ordering;
			$sql .= ($where ? ' AND '.$where : '');
			$sql .= ' ORDER BY ordering DESC';
		}
		else if ($dirn > 0)
		{
			$sql .= ' WHERE ordering > '.(int) $this->ordering;
			$sql .= ($where ? ' AND '. $where : '');
			$sql .= ' ORDER BY ordering';
		}
		else
		{
			$sql .= ' WHERE ordering = '.(int) $this->ordering;
			$sql .= ($where ? ' AND '.$where : '');
			$sql .= ' ORDER BY ordering';
		}

		$this->_db->setQuery( $sql, 0, 1 );


		$row = null;
		$row = $this->_db->loadObject();
		if (isset($row))
		{
			$query = 'UPDATE '. $this->_tbl
			. ' SET ordering = '. (int) $row->ordering
			. ' WHERE '. $this->_tbl_key .' = '. $this->_db->Quote($this->$k)
			;
			$this->_db->setQuery( $query );

			if (!$this->_db->query())
			{
				$err = $this->_db->getErrorMsg();
				JError::raiseError( 500, $err );
			}

			$query = 'UPDATE '.$this->_tbl
			. ' SET ordering = '.(int) $this->ordering
			. ' WHERE '.$this->_tbl_key.' = '.$this->_db->Quote($row->$k)
			;
			$this->_db->setQuery( $query );

			if (!$this->_db->query())
			{
				$err = $this->_db->getErrorMsg();
				JError::raiseError( 500, $err );
			}

			$this->ordering = $row->ordering;
		}
		else
		{
			$query = 'UPDATE '. $this->_tbl
			. ' SET ordering = '.(int) $this->ordering
			. ' WHERE '. $this->_tbl_key .' = '. $this->_db->Quote($this->$k)
			;
			$this->_db->setQuery( $query );

			if (!$this->_db->query())
			{
				$err = $this->_db->getErrorMsg();
				JError::raiseError( 500, $err );
			}
		}
		return true;
	}

	/**
	 * Returns the ordering value to place a new item last in its group
	 *
	 * @access public
	 * @param string query WHERE clause for selecting MAX(ordering).
	 */
	function getNextOrder ( $where='' )
	{
		if (!in_array( 'ordering', array_keys($this->getProperties()) ))
		{
			$this->setError( get_class( $this ).' does not support ordering' );
			return false;
		}

		$query = 'SELECT MAX(ordering)' .
				' FROM ' . $this->_tbl .
				($where ? ' WHERE '.$where : '');

		$this->_db->setQuery( $query );
		$maxord = $this->_db->loadResult();

		if ($this->_db->getErrorNum())
		{
			$this->setError($this->_db->getErrorMsg());
			return false;
		}
		return $maxord + 1;
	}

	/**
	 * Compacts the ordering sequence of the selected records
	 *
	 * @access public
	 * @param string Additional where query to limit ordering to a particular subset of records
	 */
	function reorder( $where='' )
	{
		$k = $this->_tbl_key;

		if (!in_array( 'ordering', array_keys($this->getProperties() ) ))
		{
			$this->setError( get_class( $this ).' does not support ordering');
			return false;
		}

		if ($this->_tbl == '#__content_frontpage')
		{
			$order2 = ", content_id DESC";
		}
		else
		{
			$order2 = "";
		}

		$query = 'SELECT '.$this->_tbl_key.', ordering'
		. ' FROM '. $this->_tbl
		. ' WHERE ordering >= 0' . ( $where ? ' AND '. $where : '' )
		. ' ORDER BY ordering'.$order2
		;
		$this->_db->setQuery( $query );
		if (!($orders = $this->_db->loadObjectList()))
		{
			$this->setError($this->_db->getErrorMsg());
			return false;
		}
		// compact the ordering numbers
		for ($i=0, $n=count( $orders ); $i < $n; $i++)
		{
			if ($orders[$i]->ordering >= 0)
			{
				if ($orders[$i]->ordering != $i+1)
				{
					$orders[$i]->ordering = $i+1;
					$query = 'UPDATE '.$this->_tbl
					. ' SET ordering = '. (int) $orders[$i]->ordering
					. ' WHERE '. $k .' = '. $this->_db->Quote($orders[$i]->$k)
					;
					$this->_db->setQuery( $query);
					$this->_db->query();
				}
			}
		}

	return true;
	}

	/**
	 * Generic check for whether dependancies exist for this object in the db schema
	 *
	 * can be overloaded/supplemented by the child class
	 *
	 * @access public
	 * @param string $msg Error message returned
	 * @param int Optional key index
	 * @param array Optional array to compiles standard joins: format [label=>'Label',name=>'table name',idfield=>'field',joinfield=>'field']
	 * @return true|false
	 */
	function canDelete( $oid=null, $joins=null )
	{
		$k = $this->_tbl_key;
		if ($oid) {
			$this->$k = intval( $oid );
		}

		if (is_array( $joins ))
		{
			$select = "$k";
			$join = "";
			foreach( $joins as $table )
			{
				$select .= ', COUNT(DISTINCT '.$table['idfield'].') AS '.$table['idfield'];
				$join .= ' LEFT JOIN '.$table['name'].' ON '.$table['joinfield'].' = '.$k;
			}

			$query = 'SELECT '. $select
			. ' FROM '. $this->_tbl
			. $join
			. ' WHERE '. $k .' = '. $this->_db->Quote($this->$k)
			. ' GROUP BY '. $k
			;
			$this->_db->setQuery( $query );

			if (!$obj = $this->_db->loadObject())
			{
				$this->setError($this->_db->getErrorMsg());
				return false;
			}
			$msg = array();
			$i = 0;
			foreach( $joins as $table )
			{
				$k = $table['idfield'] . $i;
				if ($obj->$k)
				{
					$msg[] = JText::_( $table['label'] );
				}
				$i++;
			}

			if (count( $msg ))
			{
				$this->setError("noDeleteRecord" . ": " . implode( ', ', $msg ));
				return false;
			}
			else
			{
				return true;
			}
		}

		return true;
	}

	/**
	 * Default delete method
	 *
	 * can be overloaded/supplemented by the child class
	 *
	 * @access public
	 * @return true if successful otherwise returns and error message
	 */
	function delete( $oid=null )
	{
		//if (!$this->canDelete( $msg ))
		//{
		//	return $msg;
		//}

		$k = $this->_tbl_key;
		if ($oid) {
			$this->$k = intval( $oid );
		}

		$query = 'DELETE FROM '.$this->_db->nameQuote( $this->_tbl ).
				' WHERE '.$this->_tbl_key.' = '. $this->_db->Quote($this->$k);
		$this->_db->setQuery( $query );

		if ($this->_db->query())
		{
			return true;
		}
		else
		{
			$this->setError($this->_db->getErrorMsg());
			return false;
		}
	}

	/**
	 * Checks out a row
	 *
	 * @access public
	 * @param	integer	The id of the user
	 * @param 	mixed	The primary key value for the row
	 * @return	boolean	True if successful, or if checkout is not supported
	 */
	function checkout( $who, $oid = null )
	{
		if (!in_array( 'checked_out', array_keys($this->getProperties()) )) {
			return true;
		}

		$k = $this->_tbl_key;
		if ($oid !== null) {
			$this->$k = $oid;
		}

		$date =& JFactory::getDate();
		$time = $date->toMysql();

		$query = 'UPDATE '.$this->_db->nameQuote( $this->_tbl ) .
			' SET checked_out = '.(int)$who.', checked_out_time = '.$this->_db->Quote($time) .
			' WHERE '.$this->_tbl_key.' = '. $this->_db->Quote($this->$k);
		$this->_db->setQuery( $query );

		$this->checked_out = $who;
		$this->checked_out_time = $time;

		return $this->_db->query();
	}

	/**
	 * Checks in a row
	 *
	 * @access	public
	 * @param	mixed	The primary key value for the row
	 * @return	boolean	True if successful, or if checkout is not supported
	 */
	function checkin( $oid=null )
	{
		if (!(
			in_array( 'checked_out', array_keys($this->getProperties()) ) ||
	 		in_array( 'checked_out_time', array_keys($this->getProperties()) )
		)) {
			return true;
		}

		$k = $this->_tbl_key;

		if ($oid !== null) {
			$this->$k = $oid;
		}

		if ($this->$k == NULL) {
			return false;
		}

		$query = 'UPDATE '.$this->_db->nameQuote( $this->_tbl ).
				' SET checked_out = 0, checked_out_time = '.$this->_db->Quote($this->_db->getNullDate()) .
				' WHERE '.$this->_tbl_key.' = '. $this->_db->Quote($this->$k);
		$this->_db->setQuery( $query );

		$this->checked_out = 0;
		$this->checked_out_time = '';

		return $this->_db->query();
	}

	/**
	 * Description
	 *
	 * @access public
	 * @param $oid
	 * @param $log
	 */
	function hit( $oid=null, $log=false )
	{
		if (!in_array( 'hits', array_keys($this->getProperties()) )) {
			return;
		}

		$k = $this->_tbl_key;

		if ($oid !== null) {
			$this->$k = intval( $oid );
		}

		$query = 'UPDATE '. $this->_tbl
		. ' SET hits = ( hits + 1 )'
		. ' WHERE '. $this->_tbl_key .'='. $this->_db->Quote($this->$k);
		$this->_db->setQuery( $query );
		$this->_db->query();
		$this->hits++;
	}

	/**
	 * Check if an item is checked out
	 *
	 * This function can be used as a static function too, when you do so you need to also provide the
	 * a value for the $against parameter.
	 *
	 * @static
	 * @access public
	 * @param integer  $with  	The userid to preform the match with, if an item is checked out
	 * 				  			by this user the function will return false
	 * @param integer  $against 	The userid to perform the match against when the function is used as
	 * 							a static function.
	 * @return boolean
	 */
	function isCheckedOut( $with = 0, $against = null)
	{
		if(isset($this) && is_a($this, 'JTable') && is_null($against)) {
			$against = $this->get( 'checked_out' );
		}

		//item is not checked out, or being checked out by the same user
		if (!$against || $against == $with) {
			return  false;
		}

		$session =& JTable::getInstance('session');
		return $session->exists($against);
	}

	/**
	 * Generic save function
	 *
	 * @access	public
	 * @param	array	Source array for binding to class vars
	 * @param	string	Filter for the order updating
	 * @param	mixed	An array or space separated list of fields not to bind
	 * @returns TRUE if completely successful, FALSE if partially or not succesful.
	 */
	function save( $source, $order_filter='', $ignore='' )
	{
		if (!$this->bind( $source, $ignore )) {
			return false;
		}
		if (!$this->check()) {
			return false;
		}
		if (!$this->store()) {
			return false;
		}
		if (!$this->checkin()) {
			return false;
		}
		if ($order_filter)
		{
			$filter_value = $this->$order_filter;
			$this->reorder( $order_filter ? $this->_db->nameQuote( $order_filter ).' = '.$this->_db->Quote( $filter_value ) : '' );
		}
		$this->setError('');
		return true;
	}

	/**
	 * Generic Publish/Unpublish function
	 *
	 * @access public
	 * @param array An array of id numbers
	 * @param integer 0 if unpublishing, 1 if publishing
	 * @param integer The id of the user performnig the operation
	 * @since 1.0.4
	 */
	function publish( $cid=null, $publish=1, $user_id=0 )
	{
		JArrayHelper::toInteger( $cid );
		$user_id	= (int) $user_id;
		$publish	= (int) $publish;
		$k			= $this->_tbl_key;

		if (count( $cid ) < 1)
		{
			if ($this->$k) {
				$cid = array( $this->$k );
			} else {
				$this->setError("No items selected.");
				return false;
			}
		}

		$cids = $k . '=' . implode( ' OR ' . $k . '=', $cid );

		$query = 'UPDATE '. $this->_tbl
		. ' SET published = ' . (int) $publish
		. ' WHERE ('.$cids.')'
		;

		$checkin = in_array( 'checked_out', array_keys($this->getProperties()) );
		if ($checkin)
		{
			$query .= ' AND (checked_out = 0 OR checked_out = '.(int) $user_id.')';
		}

		$this->_db->setQuery( $query );
		if (!$this->_db->query())
		{
			$this->setError($this->_db->getErrorMsg());
			return false;
		}

		if (count( $cid ) == 1 && $checkin)
		{
			if ($this->_db->getAffectedRows() == 1) {
				$this->checkin( $cid[0] );
				if ($this->$k == $cid[0]) {
					$this->published = $publish;
				}
			}
		}
		$this->setError('');
		return true;
	}

	/**
	 * Export item list to xml
	 *
	 * @access public
	 * @param boolean Map foreign keys to text values
	 */
	function toXML( $mapKeysToText=false )
	{
		$xml = '<record table="' . $this->_tbl . '"';

		if ($mapKeysToText)
		{
			$xml .= ' mapkeystotext="true"';
		}
		$xml .= '>';
		foreach (get_object_vars( $this ) as $k => $v)
		{
			if (is_array($v) or is_object($v) or $v === NULL)
			{
				continue;
			}
			if ($k[0] == '_')
			{ // internal field
				continue;
			}
			$xml .= '<' . $k . '><![CDATA[' . $v . ']]></' . $k . '>';
		}
		$xml .= '</record>';

		return $xml;
	}

	/**
	 * Add a directory where JTable should search for table types. You may
	 * either pass a string or an array of directories.
	 *
	 * @access	public
	 * @param	string	A path to search.
	 * @return	array	An array with directory elements
	 * @since 1.5
	 */
	function addIncludePath( $path=null )
	{
		static $paths;

		if (!isset($paths)) {
			$paths = array( dirname( __FILE__ ).DS.'table' );
		}

		// just force path to array
		settype($path, 'array');

		if (!empty( $path ) && !in_array( $path, $paths ))
		{
			// loop through the path directories
			foreach ($path as $dir)
			{
				// no surrounding spaces allowed!
				$dir = trim($dir);

				// add to the top of the search dirs
				// so that custom paths are searched before core paths
				array_unshift($paths, $dir);
			}
		}
		return $paths;
	}
}
                                                                                                                                                                                                                                                                                                                                                             0] = array( __('Network Setup'), 'manage_network_options', 'setup.php' );
}

if ( $update_data['counts']['total'] ) {
	$menu[30] = array( sprintf( __( 'Updates %s' ), "<span class='update-plugins count-{$update_data['counts']['total']}' title='{$update_data['title']}'><span class='update-count'>" . number_format_i18n($update_data['counts']['total']) . "</span></span>" ), 'manage_network', 'upgrade.php', '', 'menu-top menu-icon-tools', 'menu-update', 'div' );
} else {
	$menu[30] = array( __( 'Updates' ), 'manage_network', 'upgrade.php', '', 'menu-top menu-icon-tools', 'menu-update', 'div' );
}

unset($update_data);

$submenu[ 'upgrade.php' ][10] = array( __( 'Available Updates' ), 'update_core', 'update-core.php' );
$submenu[ 'upgrade.php' ][15] = array( __( 'Update Network' ), 'manage_network', 'upgrade.php' );

$menu[99] = array( '', 'read', 'separator-last', '', 'wp-menu-separator-last' );

require_once(ABSPATH . 'wp-admin/includes/menu.php');
                                                                š* “DJú¸”Kšr¨ä=<…Í…–FŒ¢÷é¼—ŠaXàS—ô%Ğ¤fTHBYXTÛS¦ÔeƒD&9¨Œ¬%2… –Yr‹ŠÈO¢Pb¤ÿ<+Uc®-JxÒ&ÏR„ ÖĞ½	¶4ZU¡ÿúâLø0Ä ÿiXëOeŞmomì"¡ÃQ½œÄ_¿ª!§³X++×£n7Ö¢£·‹V×m
ÕİØ>Ö¡ÙÓFïœy‰ç¿ÒÕèÚ(v^z50ÿ9Óz“û Å  	‚Ì²ÂÂŒ\Ã‰ŒtÈL 0€xÆ€ˆ…ŒLd2_a`#/âü$¬…$€-ò›( T [=-È ,X$ Á„¯åò¥H¢”	’¬(„µKà¦ÌTX%T€)ã ¶$~G¤ÃxÄ@«µ£=LU…»3gIw=QLä€0Íş¬ó4”!Ï‰€şé ´>£¾O¯éâÃ¸£g1¸éHcìşFÇ~¨rŠO“ÇSø.E¾é#õò	NÀµ…;‹öDí\]í°Ç`nè8/Ê¡p†TbêTÒN=[˜vÒD“©"ä43óÅÛ„æ=ÿ™K§õÖU}•¸p¸şŸ¼R@”ı)Ÿ×ŠşaX¿ï{z…  9EÌ.(Ä_:2K*(P¹@pƒŒiÔ›T,“@ä¼`ä£z¦.s˜`O&y­`0bR @à@Ò°®÷/AA“Ôº •Q´iL‰QR5´/º•ü>’\[XYÊ€Œº?Ûg		'#àC<ª/Ëfze*®+rí4ÚÒªP>h±a‘–	}PV’ÌSÄNãÉ&<MÂZkšD´4˜°4ºM:%	@Dôv…BI4G(¥Ë:´¾¬}†Ğ'ÈŒÄc¤‘%s0qÛ+#=u]í¬¼zÑ{qÊ¬>Z`ãŞõm©>ƒ0ÿ=±¦33Zù¨Íâ:ÿ–”gLÌÉ‚)™™™™Î­zfÕLAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUzsE
)¨lI5…1•>V„Ö’2TÈå$Ç
¡I©*‡€¦Q%µ·êŒ¬ä$Ÿ[§6Ëb.èØaÚ¥uİV^ù=mó’I$‰hƒ–F‘Êƒ¥óz$«"…Ğğù‡]•oÆ¥Q_])ŸÑS­¨LS$&ŠÓ¤CXsçgtT„Òá±ÒrÓ+—½åÍj×lµÙ9LÅÌˆèâşª'Í²*S)kÃjZíØ“cÆº|êÑ-Çz/ÃŒƒÖ‰ëMyÓ÷¢¬±ÕR¯?¢Qè{]÷—4h86!$ho*w¶l|´~¶Gy» 30)§-<	˜˜+¯“@CE4kÑÔ È_Šf5X $ê[&CàÂ†
´ªPR#Ë1¦u’#mmÈç+ÑÉc Ó_D—ÓÍ…BÊ†=Š¢Q«D]˜t{9ÈFi xthIà.Î¦`ÿúâLI©¯€ h×ëXbğâÍªşeéš"mËSá“Ë±´l½§²h¸¹AaBÇ”ÑÎ(É(qÆ6YªO&µ—•!0a#‰´‰Õ”mƒ¢átø?Ğ¤}ì Ô›U‰
¯¿©n:…W³¨›’}~¬Ùò¦àYu¥°¶7ÿúâÂh„ÌâÙm6î H crÁ„é“„ˆ†AŒtÀDÇƒ„F&Bb„IÒa ĞÒÄk-eÚ ?â 8ë’ŠŒºà(.•ìj2z4"íÃpÀ8ãÁfhJrÍİÿiìÀ4"""ÁºAƒc×7…‹+†¹`'ùr4-`$<¯V[UÚüŒ9
Ş®+âÑâªŞÈ×c‰ÇY¢óTK@¸ÅJŞÙ[_…8kŞX£«™±‚Ş)L-†8qÁÀ zÄw
ŠGùºò¨öÁ,¶/B"óm¥€‘™ã ĞUiİ~ã—˜¾p†ÑbåAØôÉ:t­2Ãõ~Wú²å!}+ÉrÖ(ÏU»<ä(æfg-=kLµYfª+«¤)˜	$Ü FÂÑ¯4sƒÁ†í‚0cÊ™QdˆDcLÒaeA"0(nŞ.Ğ² .[î* Ç‡Ø†AÚ¬^]ÎÍÙl‡Æ9‰ãDë³4@Éƒ™oc?üHˆB"æKù©cfuïÚŞ”ì‹´sŒBù¸åĞ>a @!¤@ã’ÇÇÑx¦›PG*,u7/.'ù³¡€ è2:_©¹rÍ3†6Ä3c
6üm–“’Aš@z£4Û¼z'G÷ŒíQ>™š¡—V”ÚYz´Íå&ëO˜Ê›ıĞ—LİrX²¸`Şó~•LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU•G5F3D	I;‚‚èŒ#„àiFò¢SBˆ Íƒ˜" ­gm †P"ÿTOëYGbV£:Ãˆlkª=Ô3¥_a ıÄ'†Ë’“G°¬¨d‹ÊÉßC‘‰b1aö‰#ê)$•OIdÑ²ÒáPîq„EQÌÔI7.‘1”i‹NƒaRçÚ”§¦ƒãÚ®˜¶.qÕË®™ãö
Y
¥–\şZº“\S'xq{Y3Á6m{E¥îÛØ[lBKèÒĞ¨™¥ËØYgn‰n·
î[ZÌ1®ƒÎ5Ÿê¥@Œ@   ¸·±”…?C8Û8è2³lÃ0É\ÄP×š±£B”ÖQõ±‚yÓ]NÃ®£.|Q;å‰rÑ–_‘†L†Ïõ, Ç›³]e2´t“9¢B2‡^8u{¾Œú<ÿ;ïÊárfÌT$Å‚Â‰¤Ä’Â ÿúâLs«€ğiYûXbĞëÊíe‚êq¡aíeçƒÔ´«ı§²ørbtbc×W ’	N“BF¬7V®‡>¤ãÑªl«Tš¡;>7&¦e¿·SY$JÉb¡˜]’øF1ŸÉ51ÁÑ‘²/²c…ø·ÉÇÕi5²Ö¨Ñ$á1ÕÀÁb$Ô:ŒøúÈ~¦Ût÷T’ºp¿Ú>Kşá6ƒGc $œ¸„	‡b@q@™H‡‰PÉ—Œ`Nò¡1 |É$y 4lT½LÙ/G‡•'‚9<DW Ğ@Æ†"h'¥:…¨ân-†
Dº¨šYHÚ._LÖ;{:¨àÃ€XK¢Ñ:Q¡ŒÌÑµ9’Æ´`D1A%ªc
jfxËIV‡kmêÓ’§á9&Š¡Ê¥F« Ÿ¹-CcS%Ş=\,'j ÓÌei¥Y'Tî¸±›àÃTº-ÃäCÇ4ZJ*¥ÄõJ·8(âmíêÈÑf~÷*u4ÒLs(Ñ2¡ïİ²êƒ.Nôº‚ùëYÛşa/¥¢®ÅŸD,Šè3I%t2 A)«GU™Û¦1a±zaæÖ1ÕUJmdÍ<É›"¨&ßô‰-au—Z< €œ©¦ÕåSÑÆÙ›AKì§B¹?«9‘(ÄıYâfŠ‰'LIF4v3½1Ğég•J‹EÍÄèlÌ­hpj†a¤¯]´¿Wínæ"ZeÛ‹)9,UogP4+”çòuB¢œ½T&g¬ğ°ù¥4T¬³2?›­¢¬Á{ÅÄæ“Xt–ÈkŠ»_$Œ&K§O\šœöŞ£P5Jâ¶O—‡’{ˆ~q$”|¦bÚ—d)£g‰ï¥UkùÑ½ã8İ;Ä5ªLAME3.99.5ªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªgY&G00ID§AD ±Ó<2Ø" *2d³#W&ÌÄdÃ@‡NÒS€=¦4ºà€µ)¨‘QcŠCQºMVIâFAº	Ô™Šp+ƒÈD3âà–™#t¬]!¶@É)‘…`8ä9”Ú<‰ˆò¦`pÈ°C†D‡‡„„áå/3îĞlá=oI]1ğ—29¤ŒÑu¥ –™ZepKO´5§ªuWªV€Ihõ‚ìnÁÍ•%Óäê.T>27O×•Û_y?Hû+‹¨šBæTfÓ×/mH‰¿¥R i]-åo‰§1›X,Ù>0ìÍ:rDãÅW…
dD„)‚W KÑíDw­òŒ Ê"«ÅÁ‹L%ä5ÿúâLÀ8” FiWûxbÀÜ+iìš­£gí=7ã‡4l=¬1pHncÍip—Œ=%o?²Ã@2S¦œÒˆ³¼c88+!,Úíª¬ëç0–t´Æ¦Wµ±k‹ŞºÒ£I4»Be°¿4ÀuC-Â„LYsÈĞ~2ÉÚ ».évï¯†™>âæ7ÑÉğ„U´¾ÃÒeœ,¹ÒšYlkÎê9Ÿ˜-ÇÛ?mü¶±<±¸ÖëÑ´ŸŒ\K°«¿ªá¥%˜ÁQ(ÔÄÊ"42iÑ¬È»0G@„€_Œù
™5|H:P¡ãi[ks	¨d‰X	‚°Ğ–LøC*â1&?œLâírî6Ö£yõá *6Ó¯	×Ìk'I n0-SŸ#¯¨Ÿ¨t‹jÇÿ#’©½¦guÔ}½p„“[bO¦™™äÓf¡AXÄHÒ¸=|ØpH?.tŒĞ#-5¥Ò&š9*¡\È¸$Æ[éW2:‘Ú½(ÖÔÄÅGÃŸ7Ê¶l¬€.aåIWd¹3IJhuÆµgÄ“¨ ëmQÌ£E$3;*‰ £¥‡ÂŠŒ™SHDÎ¸4N
^¼mÉÓ Åƒâh£¡¡HeapV›—·fZÀàÔU¼{ß)Öƒ–@•¥ÙF ĞÁOˆJÇêƒb²„Ã•â@ë‡‚'LŒ]±Ì¹Z¹‡O'Kãİ.—›,—L«}p*ZÚQø–Ã¤NéÁÉy8qgËÅñ2RRåD(ı'Q©Ş8%¥u
£ Ğ˜¾úe“rû¦@ó­ÂÑ¼ì-¦nø"¥è¸Éb—ÿ‘¥Y:@Z¸ùË6Ü0Õ»²`©Ñ,®Vw³+LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU  N#<Ø¨ ¤paŒ>`Aâ 	ÂÍ†–D†… `à*•±»¡`"ÈEUöˆ@Äåå7c–‚—¦¸èdX@(r·)°kˆğ k‚  s@&˜‹€˜’P_c7B2çğ¹’±È!" B¨BËaOº‘g8dN¡`ùI‹Ç¡~•lK¸¹0º3ÔñÒäh-4ë‚Ë¶4±œ‹…•Ë±¤İT’ñ¼á–…c¬¸%Û—ğ»¾™”g)ğÜ¡F´L¬P‡Ñ0_‰®ÏWEÌğt´'—0 DmŒıÉ‘²1‚ÖXªHV§±{7ÉX+HOì;ÔlÃ÷Í([Rwü»yı›ÔhpZc$ KPlÔ2I’ÏF2©d‰¯2‚@ÎŠ¡ŒiÀ*ó@ ¥€10»£Àú4ÀÿúâLîy€oTCOMğîMÊÿié¾£_í=–ƒL4­}§²”È‹~•Ü‘Şd’P•$Èä4˜IÓ‚Êt!`ñ”)=G4y¢¯S±ÇË÷&ıA†ŞÂ£`LM#ék³ŒÜñÌ†õîéqV
U9sÍÁú}ÓÙÛ§}<ŞÅ_mS¿-ÌJ§ÛvØäÂé²h-ªv¤r’GÌ°ÄÚ0÷úpƒ<ò*Tî/ä…‹^7,6Ç¸*$:å”@Bõ‰ÉÛc*ÑìU³ªL¸e½+àÍ*_§¿ÿı ,ÿ­\ Ğ€””
;#!QÂæ\i¬6` [
ªhF¼A†:¢£ÚIA'	bPÚ VúA B7dd²HmUSxŠ´ÇfËqBĞ1Âošgã6bìå8Ö•%™GssÕÖå*\)XìÁ<’ÄÂ‡;°‰‘Õ³T‡ˆ6Ê%wÂÜ”Ğ™(£8›)ŒöTœf¡FÂâ^Vz«!Šš©.‹e,RMN±lmdÍwo]*`ÙQüT…™/²ÛU^²™ï=~fÖË?ˆ¡X—Öuja*%ÁH¤	5"ÃUÖrÌƒ˜˜S aÂAG@a¬‘aa«
¡i¯×29­ËóŒÈXš<4IrB!RÃ¤áã;æÙ"ª‘>Ôˆr±aLu[‰ÎÈ€µ³"áU–¡ƒôf#˜³C(ÑQÄ&¼W[)I²šÍƒ©P×kD˜VlñXî"Êµ	9	Y$´K:¬ó[,”WÉy˜ ¨5­TI.=s*¹xxì¡§ımåE¦¡?>/§‰J·|¼=hõ¿{ëkMó /ÕgHXB’EÛ¨D$™¥›k…  9‚U¨İ< [w
$Ü ’1Ú@É‰à€·iVÓ¡Àë~=N-K²¨á±2é0õ ÌîIh‹Ï$äÉ5tX™5¾8®÷yäz±+¼F‡VÙ2ópÒşš×LëªB`³œx!|1QB¥Ê=æh{,Lå¾‹2=VCfŒ¹md›^{ÑŒ´
Å–£ÅÓ65xN,1g’y“«‡iGÚ«bîn{Iwì›òıOKO,,
i&ğTùêvAœ‘Ft‰B [ÖN-¨•4Óô³©æ`A¥Œ2˜<@q¡®¹ÁV$3¢‡ÿÉ¢Pyğ<‘÷põjÆ–Ë-Ç_Gš<Ók\—G¥cÖİÚK¦‡0’@r	x¿ùËd4²häKà$Ü²´ÔîÊ'zŸ¯Åh”o9ü¥ˆ¶ñ·ÊıÛ™|Bj(š”É)eµnYiïV¿3S
òµnz',\­jŸÿúâLeÅ€£hÙıeà éí_­`./]¹¼€ÈEë¿7° 'ö®C«Ñ¼°¥¤¿7‡_É˜ô.¯=¢¤³!şãG»øEi¯J/Neö¤”Ö®ÏRĞKmEê:?l„H„”’)ˆ„ˆÕ¹ ,ÁÏ@‹&,<c‹ÇV\a§F8f$àçóƒ"2Pƒ(¨Ì4€
û:¸l#åfèò‰­0TäÆ-5Tg¢A5õgDµBd Ä)EY¬Æ˜^„†¤âË m“.œ¥Çx”»rÖcSA0ŠúªH²òN‡‘Œ*‚äS5…¸ÕÓ¦[ºÌeôI’4n‚*€:’·nj$ıÀÌív3¶âÏ›Œ8»)W»V|-h Õ–€4´G9µıeÃL·! ¾Ì¥ß¢†Öü¨ƒ¢_TBš‘ÅÂJ–¦ò²æÒe0L¢»½D¥[”Ù£šˆÊ"ïÛgw]yLDİâı4b™×¼…ÈüìYi)«&C"¨h´,;,H…9}/G9w_†=Ë¿û×ÿÿÿÿÿÿÙÖ²¹gv°Ç¼Ï+ŸóÿÿÿÿúvÇzVóàş0fiFåBZÃ(eêiipR	‰¢Ë‘ m"Pl¶¤&4*&T#0cS$0±$¡9• QÃ…Lš13qĞ£~@.”-™µY–˜2`àğàÛ<¼æªe‚@À2¬DÀí9d	x‰l±öPc,2`C-2c‰NµğpzT€‚ Ö¹pĞdˆt%Jo )7Â¦qmN6ãF`Vùb+ÊïÇ„š€[“7ií³Á¶Haûej>’lÖmßE›5ø›zÉÜ¨İwyòlÙt%-ùHÄŸD˜Ã[‹º«®¶7 hëŞêöJâjËX«¿»7!1´É l(dPé
•IâÅşš~ç¥íaév#rÙL«èvñ»V_‡¢MSÚ“ò¸&n0ÅãÌîPî³fÑj—N0ºäPÃ|¹>“<9¿Ş_ÿÍ÷ŸÿÿÿÿÿøPk_Ş}Ûyaû¿b¦ÿÿÿÿùk]`öíİ©|¡†µ	•§J'oÚÂõ´l@©(
×Ï*Ï0È@‚ãº+æe8‰K]8š¾¢nªLœo‹ã{z%VéÉ—DÊs)]l	é&vxÊòëØh‚­»
I+$lF§7ĞœÔìÎjçì­ÊmµÇÓks“­ø¶crY¦`>ú2™É‚U¾6ÁˆÿßËj5>ı™"˜ƒXT–Úí®ĞsàËlË%;¡ç€÷YƒååËÜV|>›î¸­÷¼b>s§››ù/¾şù…ÿ¾ïï67²æúŞk´¾ç¬[n²I½ãüzÿúâL]©l€‚ZçaààPKKì< ÍÿkŒ±1Cx½-1—¥ùW¾]Í÷ºGœ@X@Ó«0r«•X—ån•-ÁÂ±äß T/z±³Å.Ç0R¥ÔˆPİóŒíŠ$Â¹
Yckf„¬6ÖÇ*3³Ù®½Ò¥”)ˆKÈ®ôù±&©p[…%;ïìíõÀ»•¥¼6§n3¸1>_[M6¯Æ};æ(Ò<ÍãOßIäKF‹ğ¦qlßÎ›-_zÁ\µm¾ÏcgÁö×Å&¼”¦mo]aë|h4şÔƒäÅ»¶¢Ìİ¸×ş3n7›SËŸ¼QôĞí»F·‘!OX•‰şñ˜ğûçñ\¤û´KÚÓc£W{ö—S9µÖ ‘UYDŒGÓ¼ ubc€	”è	fô˜ÅS&5—Ò¸· ¢Ó2å‹‘à>O¸Ü²0Ã‘@x©‚ôH7n0ÄÏKBã÷OF²y6õz2¡ëA)ÆÔtñ79´hÂ¨57¶hğ‰
«K¶!0‘ò¬,ÙÍ%DA¢q ™H4ª¥µ©Š’€³Ö9ª‘Œ/40‘şi$i¥3Í©F Ûç.ÈŠv¨š¤€ñ2f:]W'4æŠJÎÆ•û‰Œ`Ù¶P'úëk/¦»*ÃÃPÉïßZæë½ºÊÙÂ¼İøµ·@B 4£ZÈ[àÎÑ@\-5L
Ó
	4	oÊÚ‹ÂÀ=ƒ¨şA¨Új£hGJR¤ùĞd(É¡Rª¢5å¶t!@ı¥Ïéšè\‹5ÂZ†×O(N4b²:•q†ÇMé-¢m”—IÄH`ÔĞ½ê+XyU”IÒ”„`ÑÚ=Ë…m»<D"¢\åµ6]5dúeëŒ[ ‹¡N¥Mia}yŞXÃŒªÅ®…jÛÕåéu#åşÁf­’JU"ÁJ ±¤"”(pÔÙ`ÖÄŞÍËŞEVIkÑX…LAME3.99.5UUUUUUUUUUUUUUUUUUg…wehD0Ñ9j9%PÎ¤	…‘ƒ¬ér(,F%Æ°L¢l­Ë”+sß£š’ß¤’Â­2FÙùt<)€ƒdb ãXäA>OCÂ¹*âxô]ƒ!ÄôºÚ®MÑ¬_-Y—çày_S:[rË¨êG•'ÎcÉ î!™«LÎ:±µ	ml»©íxú*`¼k+ì»éA³¨ÙA=I@Á	€‹˜jL‘vS¯RÎ“[õF–§Ğs~UºH“¦Û"J€"­O±hŸQ8“³§Æ½Ãñô\ö;›fs‡u
ˆ¢A«›®›I“@²ƒï2[8²ãN) Be;M-"Úã´&èº™#Y…{öì>°|yr:òk‡WÅ•S‘ÆS1ä„8ÿúâL<y–€ğ{Zó,5âİÏoe‰´]ågÌ½‹¢½-}–©;¢ğİaA„ÊİLŠƒ-$¼‡\}" ²Sm"fæÅ¨õ‘.’ÆyÂfvRHí[oìÄaähŠ¨ /tuèµ|”YR÷®Òºeˆ¨H”c!æg{¬Zseu3W¶dÜ¦Ë.i¤Ø£ºS~’#‰^áÂ2Š´e	Ûjo¶å1³¼Û·î÷M¤»8ÖnïY	Ù˜HÀyE8L¾ÎCÌaƒs8›q,3 DÀUt†
B¥@›£8/IP°ÃÓŠE-Ì¸Ç"°ü.€ÂZ`‚©jUå~!’'a¸U¹4Ştrp’7ÃD?ĞDwŠÕyóV–Ààïu¥£ÑÒ†¥P¤ÉÖ®„²Ü´ƒ…Ô´Høt (¬©	häyRyA+ËÏb>ZivP+u–}Ó%Ë‹v4>±Ò÷c³}Zªë D›¡)9ç«›ÉÄ–œ_·Uè-¿n\ù×L£©ÉêÕÍ,}usJ¦&{”NÅ­r—¦Ú¶±ÌŸ-šëË jö†%õjRa˜‹.2ÊE“&ÓéÓĞsTsRÓQ!û‰À/˜0;/Ø±NšKJJ­ÚT²'‚$ş¯ˆf’ë±,–2Ê&å-™cåWçbÁÖ¿Îö;d³„Cğ¸C?€g¢¥(,9Lìø¯Ëâæ†vmÓ“TnÉÅİ&Ğè%^dÒ1,ÊšãËÔ"%ÅŠè%‡¦¨TXœÕ*Å&¼_2Fı‡–Ğ›ûŞgñlQ¾Ö¢jÿfStòE‡ê+îµ°åÒú$Nòˆ£õ¥úmÓ:ı,r´ÁÅU P\P{PpDÆİãnBWó/4ÊLAME3.99.5ªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªi¡…TT‡±À÷ã‰LÃ¸2š€-Š &T“eEäå	}t°#Ôå®¶’õ³¬aUo˜0İ¢Îõ3aÂ¤ˆÀæ‡Ş¸9¦š©´Å’[K	èşPeÃË•øº™ã,Tû;ÆÌ±©çdˆÌÄÖ^oïŞ½eS<Œæî
¥¶{î3’…y2¤ÜCq:Õ
ì£l@…§§°'8`Ğ„Òá•ˆÈğXÑYY|T ŠBt)a¦…Z7<mŠˆÓHP!E2¤å‰’rŸoJ§ólcuoqœàèc®©'¡¢7ÊİLe—K8™‚$D”<	Î5±Lèc¸
ñ@Œ‘QƒAÏL)†’BIÄ‡d®”%ïÆ1g.6ƒŒÉR«â!pË»KX;Ü"ĞõYzıÉP‡¥ÙC‘Ø~‹¹:UC$o&¸†ò
êt&VcME	y¥®öÿúàLˆ5° uqXóOLğÜÍOié!¹aÍ=<‹ó5¬}·³Q^ÄeÔUJ¹ü[a_Í–«”¸ãv¼HCaiã_†·#$ÔØ.·!_S.åÛëR$j°C©ãã-^m\ˆW(ƒ2$~ä1F™ÅÇ°”©í‘EˆD	Xˆû-
¦Õéõ§b–/ZU% .} ø«|ò2ªêR¬€‚*á€qtc`‘dß
Ak2ã0‚#¡A"Ïg‘Ü ”L ÀĞÕI-‰±§l"µ¦Ğ´ªúŸâVÜ?;1Æ`¢PK1ÁÂkXºá*¶õ,©jw©Ë~]V´tT&xjôšA*Âã¥æ ØëôËG»šÍPå/‚å$ëí®0İ¥ ÒM8V4"^‘«€%2dEÇº(ˆ&h„<•uƒã,lŠŸ`6"&ÔhÅaÀ^`øbiÁªL'¢ àU ± Œ' 0)0B
©—.
€ÈÓ´OÑÛ"‡ÿÿš‘oQ‘. †Q‘„	\Ëlœ”ÃKLpæŒÌl Š ËA…Œ=0Y40 8bÀr¦.ƒ¼
YH†\è©]t;Ğ£vçe˜w*¹oÃ¯!~`FWƒ^dØC”q‡Õ‚ØˆÜ’CKyNi’Õ¢”œ‡)m¹ÄÄa%TâH¤f4 +¥Ze¥(5‹z]r¼Îõh~¶úçÕ#›ÂˆOf¨–“ÍZ@PIÀ=D#°z$RYAª±%óº²~"§i‹zbPƒïÇAfët\bLóü¨¶ò£KË—eNLùRÚ„±(0*ç¾z^øÜ™ZÚÔ[;.<.ç5TóULAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU&p†b (L†iˆFl˜èÁD0H…Ù’4%QĞa9a…²ÄïL°¢ Tæ­N®-FµÚˆóşõna)¹y¦;š/+ƒàJĞÅ˜hÕŠKêA°Ai_šWV…âl*2Ü›uÏ:ò	(xOÎ0„²¥$B) äŠ:—RDÀÌƒ¢òâ×Q¥Xáuæ‚=ÆTTTŒä¨wëº-Z~G²Q²å·*zÆî´üªz`;lšçíÆxcu‹¡lÔ™Ü¼´¢³EÑÈEr¹GB²°üp
¶F£óõ¤NHñÁÁó×/¤6,„îíÙ…mFÒ,Ê DD‚i`(Â„@@4) ‘§&$ù(ĞÈP Ñ”o€A‚ˆ•,Àn¼öcïˆ†’Ãğí?ÓªÂâ0„ÿúâL~Ø€ÃoW{LPçíKiì-­aí=‘CU4n=¬%¼Á€)EÕ>:³Ì:Ôp["?hÔ	”^Q<ü#ÍãÙÊú«ÛÌ]%Oædû.ÚXØ*Üâ¸/lŒ]ú:tõ—ïJS
è7š,q¹SÙH˜|$¬@?°L€ÓbSÌkq°úØns®½gÕ=•~ĞTõÕ©QZr»_÷dr£R	k°€”½mÃ¥µ.D¨Iç!œAÚ#‡3@ñÌÎ²è.ûÄz™˜šÀ€‚‘EŠTt8„å«2%@Lh¡QšÔæ
3$„‘e# ….Í3	–0Ë{9T V„I-„e:¾’'‘PRh´‰Ö_’©Á<NØêSHN‹a \•ŠáprT) ­*¤v4¡X†O‹¾<J´2‹‡&&Å²Ñg““µõé×‹.ò@`TRD”Ë‹DÎ–q1ë(óJçjªáã;d¨ù€¬5J4"Z	Ò#ôÊŞ_yF¢ç, œ‡{%nVŒÉÁºµMŸeòš¬4TZı/#mæY;B™ö?«TÜ­U02´±`ªYÁ‡†$ˆ¸J|T	+#&0ãgf°Ã @W.–ÑéV¶ƒî·¼ë§Q>ÅùkÂòAñVìåYxáp=Ìõõej]Q)’ €­6j
klÀ'Hv™ÎB“MNi¶'lÒ&B‚2!ğ$L¢¢¤±6Š$ñƒÚ¡xe{YËSZm<d>då£D’	Bˆ¯Ñ8­CšäkR§åF(ú)¤:ˆˆ (¹9°`dšÈ‚‡39Y¤Ó´Îê‘quu ¤ª€»UXLAME3.99.5ªªªªªªªªªªªªªªªªªªª•†vgDÔID€>ÀN1\Ãb=ş®s”pª# Ø(3dÔyZú'T93"e%¬Pô&Ã/ëêóˆÕz-!É`DtOµ™JåièäOÉ,tã’µTtt"x¸úCÑÇùªTåóŠiı×®AL'L]1‘±ùíÑ´®£‹g&W:YcSoz–¨˜˜:ÃF½@¤õø²Íi_%nĞ[DZ€=–º«›V†´I£LU’k®Ã8gó‡ LŒÑ`ëWõsxú÷iQ·+=Weæ¸¯>¶&-ğ ´¥ü Z¾y_¨„oŞ™& )BbQ±!á²…Ã‰?ThPèR$Ğ
öqÎ-ŠFõHz…ä…"(n’G*â”IòŞ¥Q°vğKlœè!);Qƒ=À¯Bu™à^ÏŠD`*HLZƒ•™2,|¢©	„Âcâì¥:¹**#"¢TÌ›€‰’ÿúâL 2· ¶hÜ{/dÈÕ+<iéŠ"£Ná—„C´j!¬>yTÉƒgvÅ‰ˆgV2*¬ME&D(Îáx°œ©ò^H•ÅE!W(Ñf0×¤ë•Å¦§I0Şô™’—jÓ¤€J Ì1ô"|ÏS‚Ææ¨cÆZ"# Á÷¬ÆÅd4@À ¤g0üÀÓÃd	8P%o!0qDÜQ¦J|iœÃI…¾¸¿EÓsrï&9Q
äˆJjªÊRvBGI§ÁPµXñ'òc/'­9ùMW_PÚ¶»”ËåI&¾±ÚKtOv¥/òÎeo~õu 5•óV6ë?Hš˜ÒØÕ¨%ßD¦®İèCIt­-VpºØÕW2şEëƒÆZë¬µ«6ÏæüR8Ó¢—ˆ¢ÂÈ…	Hğ£‹á
Øiƒ"‘	IÃˆÎŒäšÙ°úg–Õæ¬•ªhIÄ‡‘ĞÜ@€¾Ä{Eû—WÈG’çë?`  $¹ºöuéQáBİNhqâAÌxã>8*„uÔÁxnm 4d–‚QHÂÈqlÂØ5£*ó€Ú- âaGó°´Dl3jP¿×ÒI: T¥ifè¬¸ªhÖÙº0dL¬X!Õn2XÉ}égœöÊĞ›ékŠÑ•ßVÆË+’K¢2å$ò¡jüÄ9 ©ş´†ØtT˜ìü8_mY\1b1ğÛğğ_36Ì1–Teüğge5P,²àÔse˜„Ìƒ’şˆJ…ùµ_¨&é¦œ<UÚˆ;Cq÷ETUDE•j¥Büúdµı2Õ²k//êDˆ fNÍãóLAME3.99.5ªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªª¥¬ó€š ªT0_A(fHi“l$1A
€FÙğˆÛx‚˜PT	 6`àù!“–éLÊİhı6ã´xº:·+éÁãjö£^Yê¥5&Y“'©k
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
                                                                �* �DJ���K�r��=<�ͅ�F����鼗�aX�S��%ФfTH�BYXT�S��e�D&9���%2� �Yr���O�Pb��<+Uc�-Jx�&�R���н	�4ZU����L�0� �iX�Oe��mom�"��Q���_��!��X++ףn7֢���V�m
���>֡��F�y������(v^z50�9�z�� �  	�̲�\É�t�L 0�xƀ���Ld2_a`�#/��$��$�-��( T [�=-� ,X$������H��	��(��K��TX%T�)� �$~G��x�@���=LU��3gIw=QL�0����4�!ω��� �>��O������g1��Hc��Fǝ~�r�O��S�.E��#��	N���;��D�\]��`n�8�/ʡp�Tb�T�N=[�v�D��"�43��ۄ�=��K���U}��p����R@��)�׊�aX��{z�  9E�.(�_:2K*(P�@p��i��T,�@�`�z�.s�`O&y�`0bR @�@�Ұ��/AA�Ժ� �Q�iL�QR5�/���>�\[XYʀ��?�g		'#�C<�/�fze*�+r�4�ҪP>��h�a���	}PV��S�N���&<M�Zk�D�4��4�M:%	@D�v�BI4G(��:���}�Ў'Ȍ�c��%s0q�+#=u]펬�z�{qʬ>Z`���m�>�0�=���33Z����:���gL�ɂ)����έzf�LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUzsE
)�lI�5�1�>V�֒2�T��$�
�I��*���Q%������$�[�6�b.��a�ڥu�V^�=m�I$�h��F�����z�$�"�����]��oƥQ_])��S���LS$&�ӤCX�s�gtT����r�+����j�l��9L�̈����'��*S)k�jZ�ؓc��|��-�z/Ì�։�My�������R�?�Q�{]��4h86!$ho*w�l�|�~�Gy��30)�-<	��+��@CE4k�� �_�f5X $�[&C�
��PR#�1�u�#mm��+��c��_D����Bʆ=��Q�D]�t{9�Fi x�thI�.Φ`���LI��� h��Xb��ͪ�e�"m�S�˱�l���h��AaB����(�(q�6Y�O&����!0a#�����m���t�?Ф}� ԛU�
���n:�W����}~����Yu���7����h����m6�H cr�����������A�t�Dǃ�F&Bb�I�a ���k-e� ?� 8뒊���(.��j2z4"��p�8��fhJr���i��4"""��A�c�7��+��`'�r4-`$<�V[U���9
ޮ+������c��Y��TK@���J��[_�8k�X�������)L-�8q�� z�w
�G�����,�/B"�m���������Ui�~㗘�p��b�A���:t�2��~W���!}+�r�(�U�<�(�fg-=kL�Yf�+��)�	$ܠF�ѯ4s������0cʙQd�DcL�aeA"0(n�.�� .[�* Ǉ؆Aڬ^]���l��9��D�4@Ƀ�oc?��H�B"�K���cfu��ޔ싴s�B����>a @!�@����x��PG*,u7/.'������2:_��r�3�6�3c
6�m���A�@z�4ۼz'G���Q>����V��Yz���&�O�ʛ�Ў�L�rX��`��~�LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU�G5F3D	I;����#���iF�SB� ̓�" �gm �P"�TO�YGbV�:Èlk��=�3��_a ��'�ː��G���d����C��b1a��#�)$�OIdѲ��P�q�EQ��I7.�1�i�N��aR�ڔ����ڮ���.q�ˮ���
Y
���\�Z��\S'xq{Y3�6m{E����[lBK��Ш����Ygn�n�
�[Z�1���5��@�@   �������?C8�8�2�l�0�\�P����B��Q���y�]Nî�.|Q;�r��_���L���, Ǜ�]e2�t�9�B2�^8u{���<�;���rf�T�$ł��� ���L�s���iY�Xb����e��q�a�e�Դ�����rbtbc�W �	N�BF��7V��>��Ѫl�T��;>7&�e���SY$J��b��]��F1��51�ё�/�c������i5�֨��$�1���b$�:����~��t�T��p��>K��6�Gc $���	�b@q@�H��Pɗ�`N�1�|�$y�4lT�L�/G��'�9<DW �@Ɔ"h'�:���n-�
D���YHځ._L�;{:��ÀXK��:Q���я�9���`D1A%�c
jfx�IV�km�Ӓ��9&��ʥF����-CcS%�=\�,'j���ei��Y'T����T�-��C��4ZJ*���J�8(�m����f~�*u4�Ls(�2��ݲ��.N�����Y��a/���şD,��3I%t2 A)�GU�ۦ1a�za��1�UJmd�<��"�&��-au�Z< �������S��ٛAK�B�?�9�(��Y�f��'LIF4v3�1��g�J�E���ḽhpj�a��]��W�n�"Zeۋ)9,UogP4+���uB���T&g����4T��2?�����{����Xt��k��_$�&K�O\���ޣP5J��O���{�~q$�|�bڗd)�g��Uk�ѽ�8�;�5�LAME3.99.5�����������������������������������������������������������������������������������������gY&G00ID�AD ��<2�" *2d�#W�&��d�@�N�S�=�4�����)��Qc�CQ�MVI�FA�	ԙ��p+�ȏD3�����#��t�]!�@�)��`8�9��<����`pȰC�D������/3��l�=oI]1�29����u� ��ZepKO�5��uW�V�Ih���n�͕%���.T>27O����_y?H�+���B�Tf�׏/mH���R i]-�o��1�X,�>0��:rD��W��
dD�)�W K��Dw���"����L%�5���L�8� FiW�xb��+i���g�=7�4l=�1pHnc�ip��=%o?��@2S���҈��c88+�!,�����0�t�ƦW��k�޺ңI4�Be��4�uC-LYs��~2�ڐ �.�v﯆�>���7����U�����e�,�ҚYlk���9��-��?m���<����Ѵ��\K������%��Q(����"42i��Ȼ0G@��_��
��5|H:P��i[ks	�d�X	��ЖL�C*�1&?�L��r�6֣y�� *6ӯ	��k'I�n0�-S��#����t�j��#����gu�}�p��[bO�����f�AX�HҸ=|؎pH?.t��#-5��&�9*�\ȸ�$�[�W2:�ڽ(����Gß7ʶl��.a�IWd�3IJhuƵgē���mQ��E$3;*� �����SHDθ4N
^�m�ӠŃ�h���HeapV���fZ���U�{�)փ�@���F ��O�J��b���Õ�@뇂'L��]�̹Z��O'K��.��,��L��}p�*Z�Q����N���y8qg���2RR�D(���'Q���8%�u
��И��e�r���@��Ѽ�-�n�"���b����Y:@Z���6�0���`��,�Vw�+LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU  N#<ب��pa�>`A�	�͆�D���`�*�����`"�EU��@���7c������dX@(r�)�k�� k�� s@&�����P_c7B2�𹒱�!" B�B�aO��g�8�dN�`�I�ǡ~�lK��0�3����h-4�˶4���������T��ᖅc��%ۗ𻾙�g)�ܡF�L�P��0_����WE��t�'�0 Dm��ɑ�1��X�HV��{7�X+HO�;�l���([Rw��y���hpZc$ KPl�2I���F2�d��2�@Ί��i�*�@ ��10������4����L�y��oTCOM��M��i���_�=��L4�}�����~�ܑ�d�P�$��4�Iӂ�t!`��)=G4y��S����&�A��£`LM#�k����̆���qV
U9s����}��ۧ}<��_mS�-�J��v����h-�v�r�G̰��0���p�<�*T�/��^7,6Ǹ*$:�@B����c*��U��L�e�+��*_���� ,��\�Ѐ��
;#!Q��\i�6` [
�hF�A�:���IA'	bP��V�A B7dd�HmUS�x���f�qB�1�o��g�6b��8֕%�Gss����*\)X��<�ā�;���ճT��6�%w�ܔ�Й(�8�)��T��f�F��^Vz���!���.�e,RMN�lmd�wo]*`�Q�T��/��U^���=~f��?��X��uja*%��H��	5"�U�r̃��S a�AG@a��aa�
�i��29����X�<4IrB!Rä��;��"��>Ԉr�aLu[��Ȁ��"�U�����f#��C(��Q��&�W[)I�����P�k�D�Vl�X�"ʵ	�9	Y$�K:��[,�W�y� �5�TI.=s*�xx졧�m�E���?>/��J�|�=h���{�kM� /�gHXB�EۨD�$���k�  9�U��< [w
$ܐ �1�@ɉ���iVӡ��~=N-K��ឱ2�0� ��Ih��$��5t�X�5�8��y�z�+�F�V�2�p����L�B`��x!|1Q�B��=�h{,L徍�2=VCf��md�^{���
Ŗ���65xN,1g�y���iG�ګb�n{Iw����OKO,,
i&�T���vA��Ft�B�[�N-��4�����`A��2�<@q����V$3���ɢPy�<��p�j���-�_G��<�k\�G�c���K��0�@r	x���d4�h�K��$ܲ����'z���h�o9��������ۙ|Bj(���)e�nY�i�V�3S
�nz',\�j����Leŀ�h��e� ��_�`./]����E�7� '��C�Ѽ�����7�_ɘ�.�=���!��G��Ei�J/Ne���֮�R�KmE�:?l�H���)���չ ,��@�&,<c��V\a�F8f$���"2P�(��4�
�:�l#�f��0T��-5Tg�A5�gD�Bd �)EY�Ƙ^����� m�.���x��r�cSA0���H��N���*��S5���Ӧ[��e�I�4n��*�:��nj$����v3��ϛ�8�)W�V|-h� Ֆ�4�G9��e�L�!��̥ߢ������_TB����J�����e0L���D�[�٣���"��gw]yLD���4b�׼�����Yi)�&C"�h�,;,H�9}/G9w_�=˿���������ֲ�gv�Ǽ�+��������v�zV���0fiF�BZ�(e�iipR	��ˑ m"Pl��&�4*&T#0cS$0�$��9� QÅL�13qУ~@.�-��Y��2`����<�枪e�@�2�D��9d	x�l��Pc,2`C-2c�N��pzT��� ֹp�d��t%Jo )�7¦qmN�6�F`V�b+������[�7i���Ha�ej>�l�m߁E�5��z�ܨ�wy�l�t%-��HğD��[�����7 h�ޞ��J�j�˝X���7!1�� l(dP��
�I⏍���~��a�v#r�L��v�V_��MSړ�&n0����P�f�j�N0��P�|�>�<9��_����������Pk_�}�ya��b������k]`��ݩ|���	��J'�o����l@�(�
��*�0�@��+�e8�K]8���n�L�o��{z%V���D�s)]l�	�&v�x����h���
�I+$lF�7МԎ��j���m���ks����crY�`>��2�ɂU�6�����j5>��"��XT����s��l�%;����Y�����V|>���b>s����/��������67����k���[n�I���z���L]�l��Z�a��PKK�< ��k��1Cx�-1���W�]���G�@X@ӫ�0r��X��n�-�±���T/z���.�0R�ԈP���$¹
Yckf��6��*3�ٮ�ҥ��)�KȮ���&�p[�%;����������6�n3�1>_[M6��};�(�<��O�I�KF��ql�Λ-_z�\�m��cg����&���m�o]a�|h4�ԃ�Ş��������3n7�S˟�Q���F���!OX��������\���K��c�W{��S9�֠�UYD�GӼ�ubc�	��	f���S&5�Ҹ� ��2勑��>O�ܲ0Ñ@x���H7n0��KB��OF�y6�z2��A)��t�79�h¨57�h��
�K�!0��,��%DA�q �H4���������9���/40��i$i�3ͩF ��.Ȋv�����2f:]W'4�J�Ə����`ٶP'��k/��*��P���Z�뽺��¼����@B 4�Z�[����@\-5L
�
	4	o�ڋ��=���A��j�hGJR����d(ɡR��5�t!@�����\�5�Z��O(N4b�:�q��M�-�m��I�H`�н�+XyU�IҔ�`��=˅m�<D"�\�6]5d�e��[���N�Mia}y�X���Ů��j����u#����f��J�U"�J ��"�(p��`������EVIk�X�LAME3.99.5UUUUUUUUUUUUUUUUUUg�wehD0�9j9%PΤ	�����r(,F%ưL�l�˔+s����ߤ�­2F��t<)��db ��X�A>OC¹*�x�]�!���ڮMѬ_-Y���y_S:[r˨�G�'��c� �!��L�:��	ml���x��*`�k+��A���A=I@�	���jL�vS�RΓ[�F���s~U�H����"J�"�O�h�Q8���ƽ���\�;�fs�u
��A����I��@���2[8��N) Be;M-"����&躙#Y�{��>�|yr:�k�WŕS��S1�8���L<y���{Z�,5���oe��]��g̽����-}��;����aA���L��-$��\}" �Sm"f�Ũ���.��y�fvRH��[o��a�h�� /tu��|�YR��Һe��H�c!�g�{�Zseu3W�dܦ�.i�أ�S~�#��^��2��e	�jo��1��۷��M��8�n�Y	٘H�yE8L��C�a�s8�q,3 D�Ut��
B�@��8/IP����E-̸�"��.��Z`��jU�~!�'a�U��4�trp�7�D?ОDw��y�V����u���҆��P������ܴ��ԴH�t (��	h�yRyA+��b>ZivP+u�}�%ˋv4>���c�}Z�� D��)9竛�Ė�_�U�-�n\��L������,}usJ�&{�Nŭ�r��ڶ�̟-��ˠj���%��jRa��.2�E�&����sTsR�Q!���/��0;/رN�KJJ��T�'�$���f��,�2�&�-�c�W�b�ֿ��;d��C�C?�g��(,9L�������vmӓTn���&��%^d�1,ʚ�˞�"%�Ŋ�%���TX��*�&�_2F�������g�lQ�֢j�fSt�E��+������$N����m��:�,r���U P\P{PpD���nBW�/4�LAME3.99.5���������������������������������i��TT�����Lø2��-� &T�eE��	}t�#��������a�Uo�0ݢ��3a¤��懞޸9����Œ[K	��Pe�˕����,T�;�̱��d���֍^o�޽eS<���
��{�3��y2��Cq:�
�l@�����'8`Є�ᕈ��X��YY|T �Bt)�a��Z7�<m���HP�!E2�剒r�oJ��lcuoq���c��'��7���Le�K8��$D�<�	�5�L�c�
�@��Q�A�L)��BIćd��%��1g.6���R��!p˻KX;�"��Yz��P���C���~��:UC$o&���
�t&VcME	y������L�5� uqX�OL���Oi�!�a�=<��5�}��Q^�e�UJ��[a_͖�����v�HCai�_��#$���.�!_S.���R$j�C���-^m\�W(�2$~��1F��ǰ���E�D	X��-
�����b�/ZU% .} ���|�2��R����*���qtc`�d�
Ak2�0�#�A"�g�� �L ���I-���l"���д����V�?;1�`�PK1��k�X��*��,�jw��~]V�tT&xj��A*��������G���P�/��$��0ݥ �M8V4"^���%2dE��(�&h�<�u��,l��`6"&�h�a�^`�bi��L'� �U � �'�0)0B
��.
����O��"������oQ�.��Q���	\�l���KLp��l����A��=0Y40�8b�r�.��
YH�\�]t;��v�e�w*�oï!~`FW�^d�C�q�����ܒCKyNi�բ���)m���a%T�H�f4 +��Ze�(5�z]r���h~����#�O�f����Z@PI�=D#�z$RYA��%�~"�i�zbP���Af�t\b�L�����K˗eNL�Rڄ�(0*�z^�ܙZ��[;.<.�5T�ULAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU&p�b (L�i�Fl���D0H��ْ4%Q�a9�a����L�� T�N�-F��ڈ����na)�y�;��/+��J�ŘhՊK�A�Ai_�WV��l*2ܛu�:�	(xO�0���$B) �:�R�D��̃����Q��X�u�=�TTT��w�-Z~G��Q��*z����z`;l����xcu��l��ܼ���E��Er��GB���p
�F����NH�����/�6,���مmF�,ʠDD�i`(���@@4) ��&$�(��P���o�A����,�n��c����?Ӫ��0����L~؝��oW{LP��Ki�-�a�=�CU4n=�%���)E�>�:����:�p["?h�	�^Q<�#��������]%O�d�.�X�*��/l�]�:t���JS
�7�,q�SٞH�|$�@?�L��bS�kq���ns��g�=�~�T�թQZr�_�dr�R	k�����må�.D�I�!�A�#�3@�����.��z�������E�Tt8��2%@Lh�Q���
3$��e# �.�3	�0�{9T�V�I-�e:��'�PRh���_���<N��S�HN�a \���prT) �*�v4�X�O��<J�2��&&Ų�g�������.�@`TRD�ˋDΖq1�(�J�j���;d�����5J4"Z	�#���_yF��, ��{%nV�����M�e�4TZ�/#m�Y;B��?�TܭU02��`�Y���$��J|T	+#&0�gf�� @W.���V������Q>��k��A�V��Yx�p=���ej]Q)� ��6j
kl�'�Hv��B�MNi�'l�&B�2!�$L����6�$�ڡxe{Y�SZm<d>�d�D�	B���8�C��kR��F(�)�:���(�9�`d�Ȃ��39Y�����quu ����UXLAME3.99.5���������������������vgD�ID�>�N1\�b=��s�p�# �(3d�yZ�'T93"e%�P�&�/����z-!�`�Dt�O��J�i��O�,t㒵T�tt"x��C����T��i�׮AL'L]1����Ѵ���g&W:YcSoz����:ÎF�@�����i_%n�[DZ�=����V��I�LU�k��8g�� L��`�W�sx��iQ�+=We港>��&�-� ��� Z�y_��oޙ�&�)�BbQ�!ᲅ��?ThP�R$�
�q�-�F�Hz��"�(n�G*�I�ޥQ�v�Kl��!);Q�=��Bu��^��D`*HLZ���2,|��	��c��:�**#"�T���������L 2� �h�{/d�Ս+<i�"��N�ᗄC�j!�>yTɃg�vŉ��gV2*�ME&D(�၁x����^H��E!W(�f0פ�Ŧ�I0�����jӤ�J �1�"|�S���c�Z�"# �����d4@� ��g0����d	8P%o!0qD�Q��J|i��I�����E�sr�&9Q
�Jj��RvBGI��P�X�'�c/'��9�MW_Pڶ����I&���KtOv�/��eo~�u 5��V6�?H����ը%�D����CIt�-Vp���W2�E��Z묵�6���R8Ӣ����ȅ	H��
�i�"�	IÈΌ�ٰ�g������hI�����@���{E��W�G���?`  $����u�Q�B�Nhq�A�x�>8*�u��xnm 4d��Q�H��ql��5��*���- �aG�Dl3jP���I: T�if����h�ٺ0dL�X!�n2X�}�g���Л�k�ѕ�V��+�K�2�$�j��9 ������tT���8_mY\1b1����_36�1�Te��g�e5�P,���se��̃���J����_�&馜<Uڈ;Cq�ETUDE�j�B��d��2ղ�k//�D��fN���LAME3.99.5���������������������������������������������������� �T0_A(fHi�l$1A
�F����x�����PT	 6`��!���L��h�6�x�:�+���j��^Y�5&Y�'�k
<?php
/**
* @version		$Id: mysqli.php 11316 2008-11-27 03:11:24Z ian $
* @package		Joomla.Framework
* @subpackage	Database
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
 * MySQLi database driver
 *
 * @package		Joomla.Framework
 * @subpackage	Database
 * @since		1.0
 */
class JDatabaseMySQLi extends JDatabase
{
	/**
	 *  The database driver name
	 *
	 * @var string
	 */
	var $name			= 'mysqli';

	/**
	 * The null/zero date string
	 *
	 * @var string
	 */
	var $_nullDate		= '0000-00-00 00:00:00';

	/**
	 * Quote for named objects
	 *
	 * @var string
	 */
	var $_nameQuote		= '`';

	/**
	* Database object constructor
	*
	* @access	public
	* @param	array	List of options used to configure the connection
	* @since	1.5
	* @see		JDatabase
	*/
	function __construct( $options )
	{
		$host		= array_key_exists('host', $options)	? $options['host']		: 'localhost';
		$user		= array_key_exists('user', $options)	? $options['user']		: '';
		$password	= array_key_exists('password',$options)	? $options['password']	: '';
		$database	= array_key_exists('database',$options)	? $options['database']	: '';
		$prefix		= array_key_exists('prefix', $options)	? $options['prefix']	: 'jos_';
		$select		= array_key_exists('select', $options)	? $options['select']	: true;

		// Unlike mysql_connect(), mysqli_connect() takes the port and socket
		// as separate arguments. Therefore, we have to extract them from the
		// host string.
		$port	= NULL;
		$socket	= NULL;
		$targetSlot = substr( strstr( $host, ":" ), 1 );
		if (!empty( $targetSlot )) {
			// Get the port number or socket name
			if (is_numeric( $targetSlot ))
				$port	= $targetSlot;
			else
				$socket	= $targetSlot;

			// Extract the host name only
			$host = substr( $host, 0, strlen( $host ) - (strlen( $targetSlot ) + 1) );
			// This will take care of the following notation: ":3306"
			if($host == '')
				$host = 'localhost';
		}

		// perform a number of fatality checks, then return gracefully
		if (!function_exists( 'mysqli_connect' )) {
			$this->_errorNum = 1;
			$this->_errorMsg = 'The MySQL adapter "mysqli" is not available.';
			return;
		}

		// connect to the server
		if (!($this->_resource = @mysqli_connect($host, $user, $password, NULL, $port, $socket))) {
			$this->_errorNum = 2;
			$this->_errorMsg = 'Could not connect to MySQL';
			return;
		}

		// finalize initialization
		parent::__construct($options);

		// select the database
		if ( $select ) {
			$this->select($database);
		}
	}

	/**
	 * Database object destructor
	 *
	 * @return boolean
	 * @since 1.5
	 */
	function __destruct()
	{
		$return = false;
		if (is_resource($this->_resource)) {
			$return = mysqli_close($this->_resource);
		}
		return $return;
	}

	/**
	 * Test to see if the MySQLi connector is available
	 *
	 * @static
	 * @access public
	 * @return boolean  True on success, false otherwise.
	 */
	function test()
	{
		return (function_exists( 'mysqli_connect' ));
	}

	/**
	 * Determines if the connection to the server is active.
	 *
	 * @access	public
	 * @return	boolean
	 * @since	1.5
	 */
	function connected()
	{
		return $this->_resource->ping();
	}

	/**
	 * Select a database for use
	 *
	 * @access	public
	 * @param	string $database
	 * @return	boolean True if the database has been successfully selected
	 * @since	1.5
	 */
	function select($database)
	{
		if ( ! $database )
		{
			return false;
		}

		if ( !mysqli_select_db($this->_resource, $database)) {
			$this->_errorNum = 3;
			$this->_errorMsg = 'Could not connect to database';
			return false;
		}

		// if running mysql 5, set sql-mode to mysql40 - thereby circumventing strict mode problems
		if ( strpos( $this->getVersion(), '5' ) === 0 ) {
			$this->setQuery( "SET sql_mode = 'MYSQL40'" );
			$this->query();
		}

		return true;
	}

	/**
	 * Determines UTF support
	 *
	 * @access public
	 * @return boolean True - UTF is supported
	 */
	function hasUTF()
	{
		$verParts = explode( '.', $this->getVersion() );
		return ($verParts[0] == 5 || ($verParts[0] == 4 && $verParts[1] == 1 && (int)$verParts[2] >= 2));
	}

	/**
	 * Custom settings for UTF support
	 *
	 * @access public
	 */
	function setUTF()
	{
		mysqli_query( $this->_resource, "SET NAMES 'utf8'" );
	}

	/**
	 * Get a database escaped string
	 *
	 * @param	string	The string to be escaped
	 * @param	boolean	Optional parameter to provide extra escaping
	 * @return	string
	 * @access	public
	 * @abstract
	 */
	function getEscaped( $text, $extra = false )
	{
		$result = mysqli_real_escape_string( $this->_resource, $text );
		if ($extra) {
			$result = addcslashes( $result, '%_' );
		}
		return $result;
	}
	/**
	* Execute the query
	*
	* @access public
	* @return mixed A database resource if successful, FALSE if not.
	*/
	function query()
	{
		if (!is_object($this->_resource)) {
			return false;
		}

		// Take a local copy so that we don't modify the original query and cause issues later
		$sql = $this->_sql;
		if ($this->_limit > 0 || $this->_offset > 0) {
			$sql .= ' LIMIT '.$this->_offset.', '.$this->_limit;
		}
		if ($this->_debug) {
			$this->_ticker++;
			$this->_log[] = $sql;
		}
		$this->_errorNum = 0;
		$this->_errorMsg = '';
		$this->_cursor = mysqli_query( $this->_resource, $sql );

		if (!$this->_cursor)
		{
			$this->_errorNum = mysqli_errno( $this->_resource );
			$this->_errorMsg = mysqli_error( $this->_resource )." SQL=$sql";

			if ($this->_debug) {
				JError::raiseError(500, 'JDatabaseMySQL::query: '.$this->_errorNum.' - '.$this->_errorMsg );
			}
			return false;
		}
		return $this->_cursor;
	}

	/**
	 * Description
	 *
	 * @access public
	 * @return int The number of affected rows in the previous operation
	 * @since 1.0.5
	 */
	function getAffectedRows()
	{
		return mysqli_affected_rows( $this->_resource );
	}

	/**
	* Execute a batch query
	*
	* @access public
	* @return mixed A database resource if successful, FALSE if not.
	*/
	function queryBatch( $abort_on_error=true, $p_transaction_safe = false)
	{
		$this->_errorNum = 0;
		$this->_errorMsg = '';
		if ($p_transaction_safe) {
			$this->_sql = rtrim($this->_sql, "; \t\r\n\0");
			$si = $this->getVersion();
			preg_match_all( "/(\d+)\.(\d+)\.(\d+)/i", $si, $m );
			if ($m[1] >= 4) {
				$this->_sql = 'START TRANSACTION;' . $this->_sql . '; COMMIT;';
			} else if ($m[2] >= 23 && $m[3] >= 19) {
				$this->_sql = 'BEGIN WORK;' . $this->_sql . '; COMMIT;';
			} else if ($m[2] >= 23 && $m[3] >= 17) {
				$this->_sql = 'BEGIN;' . $this->_sql . '; COMMIT;';
			}
		}
		$query_split = $this->splitSql($this->_sql);
		$error = 0;
		foreach ($query_split as $command_line) {
			$command_line = trim( $command_line );
			if ($command_line != '') {
				$this->_cursor = mysqli_query( $this->_resource, $command_line );
				if ($this->_debug) {
					$this->_ticker++;
					$this->_log[] = $command_line;
				}
				if (!$this->_cursor) {
					$error = 1;
					$this->_errorNum .= mysqli_errno( $this->_resource ) . ' ';
					$this->_errorMsg .= mysqli_error( $this->_resource )." SQL=$command_line <br />";
					if ($abort_on_error) {
						return $this->_cursor;
					}
				}
			}
		}
		return $error ? false : true;
	}

	/**
	 * Diagnostic function
	 *
	 * @access public
	 * @return	string
	 */
	function explain()
	{
		$temp = $this->_sql;
		$this->_sql = "EXPLAIN $this->_sql";

		if (!($cur = $this->query())) {
			return null;
		}
		$first = true;

		$buffer = '<table id="explain-sql">';
		$buffer .= '<thead><tr><td colspan="99">'.$this->getQuery().'</td></tr>';
		while ($row = mysqli_fetch_assoc( $cur )) {
			if ($first) {
				$buffer .= '<tr>';
				foreach ($row as $k=>$v) {
					$buffer .= '<th>'.$k.'</th>';
				}
				$buffer .= '</tr>';
				$first = false;
			}
			$buffer .= '</thead><tbody><tr>';
			foreach ($row as $k=>$v) {
				$buffer .= '<td>'.$v.'</td>';
			}
			$buffer .= '</tr>';
		}
		$buffer .= '</tbody></table>';
		mysqli_free_result( $cur );

		$this->_sql = $temp;

		return $buffer;
	}

	/**
	 * Description
	 *
	 * @access public
	 * @return int The number of rows returned from the most recent query.
	 */
	function getNumRows( $cur=null )
	{
		return mysqli_num_rows( $cur ? $cur : $this->_cursor );
	}

	/**
	* This method loads the first field of the first row returned by the query.
	*
	* @access public
	* @return The value returned in the query or null if the query failed.
	*/
	function loadResult()
	{
		if (!($cur = $this->query())) {
			return null;
		}
		$ret = null;
		if ($row = mysqli_fetch_row( $cur )) {
			$ret = $row[0];
		}
		mysqli_free_result( $cur );
		return $ret;
	}

	/**
	* Load an array of single field results into an array
	*
	* @access public
	*/
	function loadResultArray($numinarray = 0)
	{
		if (!($cur = $this->query())) {
			return null;
		}
		$array = array();
		while ($row = mysqli_fetch_row( $cur )) {
			$array[] = $row[$numinarray];
		}
		mysqli_free_result( $cur );
		return $array;
	}

	/**
	* Fetch a result row as an associative array
	*
	* @access public
	* @return array
	*/
	function loadAssoc()
	{
		if (!($cur = $this->query())) {
			return null;
		}
		$ret = null;
		if ($array = mysqli_fetch_assoc( $cur )) {
			$ret = $array;
		}
		mysqli_free_result( $cur );
		return $ret;
	}

	/**
	* Load a assoc list of database rows
	*
	* @access public
	* @param string The field name of a primary key
	* @return array If <var>key</var> is empty as sequential list of returned records.
	*/
	function loadAssocList( $key='' )
	{
		if (!($cur = $this->query())) {
			return null;
		}
		$array = array();
		while ($row = mysqli_fetch_assoc( $cur )) {
			if ($key) {
				$array[$row[$key]] = $row;
			} else {
				$array[] = $row;
			}
		}
		mysqli_free_result( $cur );
		return $array;
	}

	/**
	* This global function loads the first row of a query into an object
	*
	* @access public
	* @return object
	*/
	function loadObject( )
	{
		if (!($cur = $this->query())) {
			return null;
		}
		$ret = null;
		if ($object = mysqli_fetch_object( $cur )) {
			$ret = $object;
		}
		mysqli_free_result( $cur );
		return $ret;
	}

	/**
	* Load a list of database objects
	*
	* If <var>key</var> is not empty then the returned array is indexed by the value
	* the database key.  Returns <var>null</var> if the query fails.
	*
	* @access public
	* @param string The field name of a primary key
	* @return array If <var>key</var> is empty as sequential list of returned records.
	*/
	function loadObjectList( $key='' )
	{
		if (!($cur = $this->query())) {
			return null;
		}
		$array = array();
		while ($row = mysqli_fetch_object( $cur )) {
			if ($key) {
				$array[$row->$key] = $row;
			} else {
				$array[] = $row;
			}
		}
		mysqli_free_result( $cur );
		return $array;
	}

	/**
	 * Description
	 *
	 * @access public
	 * @return The first row of the query.
	 */
	function loadRow()
	{
		if (!($cur = $this->query())) {
			return null;
		}
		$ret = null;
		if ($row = mysqli_fetch_row( $cur )) {
			$ret = $row;
		}
		mysqli_free_result( $cur );
		return $ret;
	}

	/**
	* Load a list of database rows (numeric column indexing)
	*
	* If <var>key</var> is not empty then the returned array is indexed by the value
	* the database key.  Returns <var>null</var> if the query fails.
	*
	* @access public
	* @param string The field name of a primary key
	* @return array If <var>key</var> is empty as sequential list of returned records.
	*/
	function loadRowList( $key=null )
	{
		if (!($cur = $this->query())) {
			return null;
		}
		$array = array();
		while ($row = mysqli_fetch_row( $cur )) {
			if ($key !== null) {
				$array[$row[$key]] = $row;
			} else {
				$array[] = $row;
			}
		}
		mysqli_free_result( $cur );
		return $array;
	}

	/**
	 * Inserts a row into a table based on an objects properties
	 *
	 * @access public
	 * @param	string	The name of the table
	 * @param	object	An object whose properties match table fields
	 * @param	string	The name of the primary key. If provided the object property is updated.
	 */
	function insertObject( $table, &$object, $keyName = NULL )
	{
		$fmtsql = 'INSERT INTO '.$this->nameQuote($table).' ( %s ) VALUES ( %s ) ';
		$fields = array();
		foreach (get_object_vars( $object ) as $k => $v) {
			if (is_array($v) or is_object($v) or $v === NULL) {
				continue;
			}
			if ($k[0] == '_') { // internal field
				continue;
			}
			$fields[] = $this->nameQuote( $k );
			$values[] = $this->isQuoted( $k ) ? $this->Quote( $v ) : (int) $v;
		}
		$this->setQuery( sprintf( $fmtsql, implode( ",", $fields ) ,  implode( ",", $values ) ) );
		if (!$this->query()) {
			return false;
		}
		$id = $this->insertid();
		if ($keyName && $id) {
			$object->$keyName = $id;
		}
		return true;
	}

	/**
	 * Description
	 *
	 * @access public
	 * @param [type] $updateNulls
	 */
	function updateObject( $table, &$object, $keyName, $updateNulls=true )
	{
		$fmtsql = 'UPDATE '.$this->nameQuote($table).' SET %s WHERE %s';
		$tmp = array();
		foreach (get_object_vars( $object ) as $k => $v) {
			if( is_array($v) or is_object($v) or $k[0] == '_' ) { // internal or NA field
				continue;
			}
			if( $k == $keyName ) { // PK not to be updated
				$where = $keyName . '=' . $this->Quote( $v );
				continue;
			}
			if ($v === null)
			{
				if ($updateNulls) {
					$val = 'NULL';
				} else {
					continue;
				}
			} else {
				$val = $this->isQuoted( $k ) ? $this->Quote( $v ) : (int) $v;
			}
			$tmp[] = $this->nameQuote( $k ) . '=' . $val;
		}
		$this->setQuery( sprintf( $fmtsql, implode( ",", $tmp ) , $where ) );
		return $this->query();
	}

	/**
	 * Description
	 *
	 * @access public
	 */
	function insertid()
	{
		return mysqli_insert_id( $this->_resource );
	}

	/**
	 * Description
	 *
	 * @access public
	 */
	function getVersion()
	{
		return mysqli_get_server_info( $this->_resource );
	}

	/**
	 * Assumes database collation in use by sampling one text field in one table
	 *
	 * @access public
	 * @return string Collation in use
	 */
	function getCollation ()
	{
		if ( $this->hasUTF() ) {
			$this->setQuery( 'SHOW FULL COLUMNS FROM #__content' );
			$array = $this->loadAssocList();
			return $array['4']['Collation'];
		} else {
			return "N/A (mySQL < 4.1.2)";
		}
	}

	/**
	 * Description
	 *
	 * @access public
	 * @return array A list of all the tables in the database
	 */
	function getTableList()
	{
		$this->setQuery( 'SHOW TABLES' );
		return $this->loadResultArray();
	}

	/**
	 * Shows the CREATE TABLE statement that creates the given tables
	 *
	 * @access	public
	 * @param 	array|string 	A table name or a list of table names
	 * @return 	array A list the create SQL for the tables
	 */
	function getTableCreate( $tables )
	{
		settype($tables, 'array'); //force to array
		$result = array();

		foreach ($tables as $tblval)
		{
			$this->setQuery( 'SHOW CREATE table ' . $this->getEscaped( $tblval ) );
			$rows = $this->loadRowList();
			foreach ($rows as $row) {
				$result[$tblval] = $row[1];
			}
		}

		return $result;
	}

	/**
	 * Retrieves information about the given tables
	 *
	 * @access	public
	 * @param 	array|string 	A table name or a list of table names
	 * @param	boolean			Only return field types, default true
	 * @return	array An array of fields by table
	 */
	function getTableFields( $tables, $typeonly = true )
	{
		settype($tables, 'array'); //force to array
		$result = array();

		foreach ($tables as $tblval)
		{
			$this->setQuery( 'SHOW FIELDS FROM ' . $tblval );
			$fields = $this->loadObjectList();

			if($typeonly)
			{
				foreach ($fields as $field) {
					$result[$tblval][$field->Field] = preg_replace("/[(0-9)]/",'', $field->Type );
				}
			}
			else
			{
				foreach ($fields as $field) {
					$result[$tblval][$field->Field] = $field;
				}
			}
		}

		return $result;
	}
}
                                                                                                                                                                                                                        .           2+‰kXkX ,‰kXW[    ..          2+‰kXkX ,‰kXL[    åRO     PHP 4+‰kXkX  \<|:X[!  åROGROUPPHP 6+‰kXkX  \<|:Y[%  åATEGORYPHP 9+‰kXkX  \<|:Z[Ä
  åc o m p o  Šn e n t . p   h p åOMPON~1PHP  ;+‰kXkX  \<|:[[K
  åONTENT PHP ?+‰kXkX  \<|:\[p  åi n d e x  3. h t m l     ÿÿÿÿåNDEX~1 HTM  B+‰kXkX  \<|:][,   åENU    PHP D+‰kXkX  \<|:^[#  åm e n u t  ˜y p e s . p   h p åENUTY~1PHP  H+‰kXkX  \<|:_[É  åODULE  PHP J+‰kXkX  \<|:`[x
  åLUGIN  PHP M+‰kXkX  \<|:a[)  åECTION PHP P+‰kXkX  \<|:b[P  åESSION PHP R+‰kXkX  \<|:c[t  åSER    PHP V+‰kXkX  \<|:d[i                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  <?php
/**
* @version		$Id: aro.php 10381 2008-06-01 03:35:53Z pasamio $
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
 * Aro table
 *
 * @package 	Joomla.Framework
 * @subpackage		Table
 * @since	1.0
 */
class JTableARO extends JTable
{
	/** @var int Primary key */
	var $id			  	= null;

	var $section_value	= null;

	var $value			= null;

	var $order_value	= null;

	var $name			= null;

	var $hidden			= null;

	function __construct( &$db )
	{
		parent::__construct( '#__core_acl_aro', 'aro_id', $db );
	}
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               phFHf¬<87L@b!@¡AÑá.PÁ+[»Í(NQÆ)˜‹®óÁ;C“óSÔÖ){WmÛ‰uC+ûh$ÄhUy‚•VãàãÀN+êÌ¡†J„#aö¾È\Uşÿÿÿ@1ıJLAME3.99.5ªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªª ‚ 	Ji7Jk`”c`â`ûÚk`ÜaP°` `ràÅ:"c+)8ŸƒU¯0g³.’†°ƒAA`Ä zhXÉTŒst^|` †kBHXÒœ°Ñæ"ÓÁ£À,fnà…İ±êÀÁcù3’0@âŠS™˜h¸"d&d:È„›Š „ÕÂ4%:%àƒS™7!%p¨üà-Û¯Qví^ª$&QŒÒïñõ(!İĞ˜"2>¼`£’ì8Åƒé$¡@İø00”«´Ä"'oAHGI‹Ô	 ù„‡¢¿Ê)ÉÀÎn¥¢ƒcxFÓQå³ƒ¿xßUH]<¥[{ôÈ‹Øª˜«ÿåB0]Ã*ÿøñ}¤]gï?ÖR§³0˜‚Ó´Ş~mÖ1ZYMzuØ+ñYx†     ¿ò¯UüK@	·³“µª!H™Ş©œ‘‘ÛPùoÿúâl[­ I®iOë»Ñğ®IºoFn%5¥A®kÂ­&¼¦ åz(¼=—LaÁ1€Õ¦†0  S°é¬&˜ËÀB¤K±DäÈG²ùË£4ä8ºU…¤MÅâsÑ)wÃÍä†5ßîğÈñªNŞÙ¶kùG;%å¡>’+?š¶«ğtÅãÏH1
:qoªƒl9¿ú¼¶¶ÃÓøßÿ÷ïpÃê÷âdiŸøˆ À@)¹ÛÍæíWƒXÂ¸3¤Lf_0Id’Di²Y¡¦W4˜‘\«,êi… ¦Á@„0ã¸ÙTi1¸P½2QP(%Qb¨7 à­ˆuùÅ0– ªØØŞXÃíÜçØ`Q?^x„!µçÆZá´
ö>Š¬+äMÍ<ÀP=ü£ îYÉş,¬ö®—rïèµÔİÄ,jõb §@¼€ˆ%Üæ„Ù§¡¡ÙPnÂµ4uFQsøÓÜÌ¨Eòw3D‹ôâ³zxŠ‡§50ˆ­ıË¨«£«åâD‘3”Èu(=ÙÁ•'ÅÚ‹d˜öì¡É$ækAdF£Ú©-yu5D»eG”Şİ˜ÑC§ğgÊgknŠ-_¥‚š]¬e*OV£Eµf\5¬ÊwGEı@ @Ÿêì-Ş$ ³š°9¼«
Ÿ›ı‰šÂèªÑ¹’¹ÊiF –eÁpĞhxyÆÃDg:I‹xnB W\AækĞàò¬•kXuòÖUµÿ~˜ëêûQC“ñãf=BqÂ"Õ®NãÓsÎçm˜FÖ%½ª»Îilì?ÿÿôÏÿş‡Û%Ù'gŸúĞI©{¬Ó½B*U_ÿı5ş4ê«“Ÿ²ßË¡?ø LAME3.99.5ªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªAB MŞ|#€miädÉbäº}°e3(`0†`th¸Ğ`0Še¸e°øé ¦ ‚Ãv	11Á¤£XÊ8sÔÓWn@«ìÊGŠ¶Ç	"$tfãÂ!Óp¶d¢7¡µúØædÏä+øØBÖUs4iv\ è8ßã(¥½É¬Æ€¢ZÆ¡Ü/•ÇD+ª”T¥¿j©B“y,âlwæE37n•‹§†ã#•–İ²˜ÅÊdck6
‡“(™Äqic•e²V-d@`\¸Ÿ©åVÊùÖc,»¹¸%å¦Šõo©GlñŒª§+8CÍæP
BY¹i×«IR#³H¬2Œ‚‰sR ¨ªãN„}aQQRà·g³¦Eîİ iÏ6î'ôıZŒªMràfÉw¶é.H  Jü°n0@è@ÉBcG‚R)1¬Å§¶1l86lËˆP¨|0	Ñ»bbcÿúâl*È±€éhÏk»Ãp°	ƒsCn%Á¥<nï‚Ñ¯eÍ‰ùFa¬\l8‰i*Z“¦	(À   ãHD*5
‰)tãfPšVg“½Ôä†µqpƒ©ìU½ö§3€Bï¿Nï#<od$Å®”÷ÃÿfY´/¥óoş”ïKÈ0r‡Àÿù–uu8gşÔGôT5C-Ü!`€ ¤÷<ÿú8(1á0]9h‘áp„À„°ÙQøÄñÉÊ`Œk˜¸ V „s@¨0ü¹q‚£&0`%zò—¬F4q`"@Ïğ€¸Ö…Ã@¤ævl4(j‚* ¶
  %L\A@:h%¶d RWíÍyoÈBQÛ +›ƒÀM›³%€½º”	ÍÊ¨y~ ÕÊçOÂF´ÁˆB÷ü#:½ùRyrH‘l×vÉBüòíi½€ÄaY¸ä¬²+±ÕŞ¬?N–òÜ†™.3kMµüÄFd¸IZØblÛ†ÕkÏ|h®©Z4Ú€AˆŞ½*IÑääwìJAxaÆ‹”ŒËe„ê—e?w²},Ÿy´/¹‚gu#Ê#…©v«z@rÖ¾ûS˜@f“É #gã3˜Z
…‹.º“8)$Ê£c/Ì´,šABf[Æ*(¦`B PĞÁ#+F@ä³*1ÑˆÓ¨”x(<L$$ .ê(<ğ–&ÎZôÓX3@rZ„zPFÌ§/|J¤Ø:jYj‹±Ù›\–c^~¦íËî_‚„	‚+ÏôÆj9}m¾S³¼ÍüPrúÑŒgïéŸú¶P`•è ÔV­üfbNİLAME3.99.5UUUU ”¼ï(DøBDÈ³È…í8ˆ­0X–1Œ¥3IH64¢2œ8jáé#ñf1á0xË€¨ ¼Â„ÌĞíJŒ01XÆÌ€Â `5£¸Âş0•B`öš©	OÍ!¥- NÌ6³&¢w×¯lJ(5o{&–Ş:]nAÇ'Ê¡	=ä".ÛRô;„?p”%í=b4¶©ÒQ­YNê·pnQè’Óa]]Òğ/ÔŸŠ5KKÊ%­oLñX¯[I[’š`ºR9´_IwL…¯W˜tÑö’ºÛyqšª´UÖš>Àºhó™İ¾¦´WÙšıw}ğ”ÿclFrÚn)t[Ş&#GÙaB½<ÑnÆ™NX:š{„¾›’Ç*Geüu«]ƒcÛÈ*ø   +¾kÈI‡Â#LeüøÚiG,r~>wÓ™Ø
¬é„0"¡`ç‚F,©*@0€RL’†fAAvTaE(#9
…L–<Ó^6ÆÑg]×ÿúâlÕ¾Œi4hÎ»Ê` ‰)§oH^$¡£*omíÃÒ±c…î-ûí¤Ia­Ê5#‹ÇG„'	¬bÑÛeÄˆ	qÛM-ÕÏl¯İÿ¶ó5Ä4~¿şìÜÒ,^6ê5”á*bGX@£n£BĞĞP6<¦/Y-¯  ˜ãF{Î¦@Ä(6Œ7¤ËĞ‚
HÁÀDÌÈÄLL$AXÁŒTeÁˆÉ¤LÔÁ4ÌuĞÍÇM%\ø$rpœXÜÙA@&bXjÈF^`YCWI4âc*F(cƒcÎ&(Â‡ …œõ:¦b,ÆŸ£ \‘%²¬é82±7wP@Å)à(çZH£à6Úı7x‘È*§r&šÀcSFM‘Õl8œ«’å?lÉ»µKº<.NUl:£VìÏbµ§v‡ú¡×ëÌ´ÄÑhÜ‡:¹šx²Ú	ÄÚ´¹,2DmÖ¨ŸTÅÒeö]Ck;Ék$ÄõWfõU`ù2QÕÊ+2'Şæªå”'q·:¢²™=,ÿë!– 1ÙSÒ1ø2³‘x0–Fc5 ù0®,5Q 4äÓ	@30¦cP0¥ƒá5jôUL°¤1ŠPÖ%ƒA	Ì€9Öhcè FF1$`qÙµÂaÇÃŞ4l	‰+80
"0˜$D0@	Ñ,Kæˆ´¤AÕŒ,V¯}\&w[V8‚˜öwOÔìDxİ)Ô§¯@œ¸Ş^D˜ãÃ•‰ÍV4?öƒ¾5k‹¸>sıÍª„ë¶:İËUwUS­Õüÿşí½ó|÷ËïßÕÆÔ•õ5: .üĞ°#L©›´8:A 2`$¦Ša	&@:`!æ â`„Á&`	fàº`@+ “ ;* =lŠ&|!| HÀ¢%Ì–zH³˜ ¦Yš ©É0#Q®—UtFàªg­ˆH×Ë­fqõ½5“)ÔZ¾OƒËÌÆnU«52ïÃÍÌh7KS±ÇÖ’Y~b!*¯Ijf—Q¨bjA*¯zìÅ©‰õéTÕ<æ™ŞÔ¢Q„r’Õ[ú¢³9•­Gz“”Yã"Î)IgunÚØ©9”¦Şåó3ÙÑ{O^ş[·^í=ÛZ·+Î¾wò§˜·^Ÿ´ÿ~Æ¦éíş55•%{ÿP wæ…eLİ¤AÊ:&Á*`äæ`ºa¦d<&Fbcf) t`Ò fÀ``ä FA<æÅHdEd$!bâ³ña2R0â”U2…N^„¡eê1P€2ş8
˜Ë¡:àV¢°±–Í™‰kÏO6i+èÎ`X¬Õ,~IC/·IÛÿúâLŞCÅ€hÌ{ -ƒ¯l .:/0yí€¥Åæ_=  ôüü÷îÍzıµzbS=©ªL!˜Õkuâ”ÖåĞİ3ı©Djµ¹ªÕ§*J;bÅ%Ì)#ŒÓêCf’5«´–ù(–eE[ÿ¤½g”6æéªY»Ko:y›[Ã.Û·¯¯Û³{¯ºl;+Îo´÷åóóuñ¯¬5¯OÊ·;Z¥z©!âøÜ$ƒq ç2ëÃI82„*Cwsš1ñM³àk1>SQe1Tc5ğ{3˜#°:0‹óp„ğ3˜*„ÈÜ(Ó`X0ÑUIŸ˜yUÌpĞPDpDßL“àÃA‰L8Ì…
¤ë½DŒ€=
—[L"/¹0P$À@‹\P" T¯¥\D0ĞVèš‚À!€ é¦ V¥`o:ÃÏËa•n 5DtI$Ğiê>ª
Üªëıª‹4Æ Û¸ˆh€Ê7qáN·m‡8ËæÚLj>ÃZÅ˜³U}Èj?"*º—³dT“	Ìºı™ŒİŒËe1š‘Zkñ9³
{ı†$mÁ‚8	P’	0ıË!‰M-šj¿MjmVµªoÇ¼×÷zÿŞ{ö½ç#i_5uø¤–H&‰[¿ùÿÿÿÿÿÿşÿÿÿÿÿÿ¿üïçß×9ÿ¯ıÿÿÿıÉ}§˜(Ş`‰†Äàwî_EŞ19U ±j¸\-c@Á2­c@2@ h³1¯C³
 ƒ1ÎÃÀÓ)Po3 Ó	@±ƒ˜E±‚°˜€qÊºaiÂ¦¬È¸gñÃ€dBĞã000ƒP„Ô´‡(ª"‰êaE†
.Û*V9P–]ÆZ–Å“\Àá¨—6U ÌH5(VÆRÄg®;Qfîâ0§	ˆ"œ‘€¨slå8Os¼± )«?îËPdnò¸_—%’ÔœaÑg…Â“¾¯ôFdĞ$}ù“¶’FË.CFæÓÔ8tíKïÁ1›±¬eı¹¥‘X§Åé#”¶­NN<£«
e‰˜¦n»‘ ¥³MW”ØÖ¦ÕkYS}Üù—÷ºşwğø»ß¾Ëíò¤¢rAA†èÿ¿ÿÿÿÿÿÿÿ¿ÿÿÿÿÿÿşÿåÎï¿ÏÖ¿ÿÿÿÿşÄbyÔ¡!	Ëçì]‡ä7øËíc¸ #·ÜÈâh8£›‚©³>&Œ Í"DŞaaI€J¦"0làbàš™ğtbA1BÈÆnDß§™ºÁ¦¥PÀò:g’q0cäK@¡o¼Ù…ÅFÁ,q‡†
(
…[§§Á*†ÔÈpJÆ4zT€ÁP1(¨2«¨“;J8e#¥efÆ¬(ç)jf4¡Bÿúàlm'J ‡×ns` ´,ËÌ¼ eÓcıÇ€=7l²ğóJ hĞM»û}ÿq˜©„‡ƒ–lÉÂÌTÏSML½9œ—Xó-mˆ2}!¬HeLØÏHAdTÂŠ°`Ä@ŒPHArEX–´§õèfTR0ÜLÓşàEŒ(xÈ ÎˆL¼\ÄL„|H\ÂÂK÷€šsÀ×£v¡¶}WtËûm±Ëk.œ1@!€•Œx0,cBŠÒdC&<8`! aô˜hM[S0CHÅİ?Õ£1m¤>v_§»;i,<}ä[«?ÏÃ’xbÅ$³ìo¿Oorÿÿÿÿÿøf–	Ê3VUcísUnn—·¿ÿÿÿÿìĞÏY«…­Û¹nåºàhÕÑ\ÍÄÔÌ÷S‰„Âç~-f-÷NæÃO§¡¿YÔQyè»Œì0Ş;“2P©>è«U6ëÿşhÛNçóÿ¦·ıceƒ>ßã½»ë6ZgõuÿñŸé¬ÀzıÆDùQ–Ÿ÷ÿÿª7hSkï°ÓsV,¬¨VĞßÿßÿÿ­áŸ6SçİN‹T7A¦1ñıÿÿÿÿı«ÍÉ·š)šŠƒÑÙîÀ˜U2´¡cpOƒoÿÕ7ÿÈÅÖL²¬ğ¦²&€$˜za@±Ê&Ã=Ì(™Æ##P`00 D(
l‘MCŠÀC*åAñöÌ².!(­Çğ´İ
:Úá‘…D¤j±@Å#|4É€/O}¹Lªj<ßÊùÅŸdvšVWÄ\Ã¸ø‹œÈË;e™ÔíÅ‚e¨³0Dc}VùáÍ
î³!ê¸1aªû3$˜aÕ˜İ@ofWE…ug»“ua3Í4[¿Î«Òº‘Ô
ÂS×OX°ÈãWp#:ÒÅ[˜GTmÒÜâyÜ çqQ,Ñµ¸Ã»IœRÕÖ7½îßûŞu˜˜Gef•# ‚nßŠXÎ
ºN@ª­ÈD+„ ™§²ØúJ¨@BCÃuhÒPªæ&ïG+YÒ§2Za=$šªÜ_©àK
Ê7Ó56¡—š”fVÄÖˆc…ÒÀW0®W•«ÎTÇğßj›zÜÀ¤‰r^i†Ê0E_ˆñs–e©ËÔ\ËH¹§Ö}áa‡÷oÏ˜®:Ê¯
lA™ÍÕ0¡;š#Ç7:jÊ|¿Gû3{=|‹š\çP³¨pgÓ¬#µ
i$kñ¥®q½k;”M[*·Uhi‡‡O¼P«AÖ°DÚ‚e;ğUÂaÍ†KB Ãhm+eOH—y ìjR˜-ñ`Ö›-6îc6ën§½,‰ÉâtvçäåúiøqÆ_±ÔÇ¤ÀR˜DªŠˆ©ƒîÅ¬£JYYæÆÙÔByU›ÿúâL½09 qØó,@Ş­/e¸	Ÿeíe‡ÃC´l½¦&¸7)‡5£ØÌô”‹K+8Jê(Y×“øÑ£=yõĞµTêõå¾}Z@„Â«²¶s_:^yHôèJBYğ[v´iIo3K3,{'Ò—G&ULfÖ)k5™WV§ädí2ĞunKo;ôÖ­íÿÿÂÛÊ‚´³»Ã7Î0Ic =F™Ğ¬âTvğ¢4ÅPšUĞ^Òğ€Ëb’(¤šPü­ŠA°üMÈkÈs@6Í(+ÑÌë`;ÈĞ­°<ùØˆt% LÑh¨–C
³j•–ÇØuc|åÖOıåæ%ºŸùÖ…*\‹†[ÈŸ†ö2¾Åªö´c¡©!Ç»ÉX!Gp¬ï¥;¤’øx°Vîé¶±fÖ·á¥g{
ÛÓ#@P(™a²»|şb¥2?q*‡x:xÖÉÚØ?šZ£níot"S¶(<Xšáá|e€\@aJƒd	„HÌÒe$CLU˜‘‚B¬$:…J¼NãFUVtÙÜ8¬v^ğ.tÂ7vÖXé*S‘á¦ˆdÅ).?E4#>A\JÁÙ`‹ıVÑ~@SO¥7R†:–òÛyF ­IO¥V 4=ˆÚ™K¾QRhši+ :2bâhHzTÀ2¢ÇU|RĞğL”ë]97Hbã(Iüí›•
+ÓmºX–@b¼òÂYê?‰9{ [;µ¸s¯X¥¶–Î6ü.š2FïÙŞÏ˜—vht[DP¥IÈB`¸D€Ñàè,}ˆ•„¡E@)[%Fõnwå•4œº$ş>,
$¬¨¬¹ø…ÜZÏXŒÉøT!.>/^‹ìqUäe)İ‘=cvDr;ÄÒë²¬@-–¨OXéaä2î‰ÆxäïZËNÂâUDƒL\^9.1†åxÉ~7²ÎGD[~aSB'%º%F?ÅìóÍÂw„IÊ‡‘·#¸u©ÒK \©†®ŒQ]«}ı\Q´üôHÏé&LAME3.99.5ªª¨›ª™¤`vQĞk¢' -‘€4¨QÆ„Ü°‘¢?	V$:,®–¤Ö›¢ËŒÈŸÈ‹°»´E	²Şq°§[ZšÓ¸7™æÊq±3+ä´ák7áñÅgQ•I'jŞ:i—®;éúµc£nØõsp\ZÌ¨|ş]Î«Õ¡8³¡!rK®…@î «9–dùŠRuË­5~Èn«…o£Ä>Òµbnô¯¾Íízd£‹Ú9G«4QH –éd<Ï^Ëá!4·äkxtÓÛ<Àgvˆ‡uºF@Pv…G!bF	‡.˜ÿúâLmv‚œfÚ{/e0Ğ­+?ié~ñíiÍ0YÃT´l½§±¸*a&‚D^iÂ¢Âê¬|9IÙÒ!ÄŠÎq /®Y”gëõsšeÉM*Ş£D=q\í¹h¿’âæ…!6jÃã®¶Õ®•š‘…¼{ÆçuòMƒòÕ†ÈÉO3$©‘Ñ\1-é…mÁvD "….‘‹„6ï³¢Œ\WÚèuTvy3Lvg)³DGşÊç›(6jkr~b±AUŸF©°™Ú‹‘§Ïx¡ıC¥q[â¶äõeÌ]C<6d,(05ñÎHn‹ƒ¤ Ì“, %QÇˆQ‘ 4ƒ0ÌòA €Ü®Zÿ;²Vz—2¿Jİ‹î<%]’™øvŒ~ÄˆÙXxT€qC™ÂSßeÇW‰—âò’üâÀ4,¶®§6pœÉ÷ÔÀñ’¡Ú6Ñ Åg\¤wxír9r6©+-Æ£>:´s:æÅUÇ?Or
!3ÙDÌóSç7úÿLÁ“(JÜok{EÏèŸÿ­j¸Ì\å¹}âÏ¾S&óQ©İ‰·ó]ÄšP{¨`ÔI»ÃªÚš 6f½ °YQ–Dc†‡53DE¥‡B£ƒ#³¡l, fÉ¶ÀnCJš/Ï;>S§ÍY™–2‘`q:Wj–—±¡  ½ye×;ÓB6~ğîÆã#rÔ¨—k/&üD l€]níéùXöÊÛ“ÑŒ1Ÿ¡Ğî·>€íª=tÇ(ÓÑµŠ×i£æ`l|t›„]”6”ku¥É‰¯« Œ4÷ÍIĞ­¥?¬ûŸ&Ö©-&Z¹Q´WYñSú¨÷gªµÇ§Z‰2TÃ÷fkü°ŠLAME3.99.5ªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªª	‹Êª¨}£Œ—~2=0˜42`û§gæRfPa‰âF,8\&v4	gQ%ÕwšÔ©”ÃÖŸ”úz=CWØ¤*WÍrµÃŠöÍ„âwJ†g7:©íNJÅyêÅéQÛ¦ec’¸®rj•ã¡ê+ÈrNÎ©\®gé¤â{¶fh)ëš¸®O½ªZÔ‹¸kêûIŠ²/3©§²8åk¦Rò“êâ{%FÉ ´V¥y0Işrñ3DiñYCt.sòI”%‚Åì³›	Oş—ÿÕlóÿÿWÿÿı,Ì,!åæ!İ¾S2u”f(°qà
HdÏ"zñ‘*Dh]T(¼ÈbÚµˆAs9ãÌâîhQt8˜Ë©ìÎ#­Z[•lXI.Œ¡<V´ÄH©Ğ»C™Kb³pÛ[[‘)4>>Z<–hö*”XšÍKşĞuwñÌÿúâLû®€wÚ{/Mpâm/iìŠåÛ]í=•Ëò8ë}§²¸üÇ$:áêFZÉøßŒ®–§«H…RzÂ#
C²ò©hèìæ4ê]«Ã
ùCF*SÂ †y£Â†7ıÃß”¶Û$\¨JáwP¾jËlÀ²"¼,Åşß&ïvÑ[mbÜ@ñØ±º¬íôT[;2„FVˆh“fX0@)É°L" DLDµ€ç #‚‚•*O%ùrÔU}˜´w£uÚŠ†œÅ¼‘)RA„z€Ñ•T¥V˜ÉX3Çl[EÂÑÆğËÓ$81#D+Ïvwì‘1\¡iåL'pIR¾’Æ?‡XÍIĞD+1µ•‚§QÌÍdlu“É|ÛM—ãÅ@j’³÷JÀCjB+Ç<14Î–YÊ€tø–’Å.‘/0R­?„â:bò]ï¹!ÊT7lºDFb"Ô$,°yı¥×Ó[Vf¦&g3W/íëÛ-iíé¬şWíó‹öÑHß¥™IüåÖ&Î2@ #3„”ã¨2Ào˜’§b0K€LAÑAÄ‰ Q`!"à³¡¢%Ò¤kWë<Íj$Ü®À¯©Œd¨’kcğä€#¶Ó*ñ@„™	ß´ğ˜ÎA‚8”çy+x«>³¦Ì%ÙoPXµ	Ie¦7yØ
õ|:9ÈA ”9ŒÖS`mh¿›k£‰¬«æ´J”ètæœmTÒPdÄ=‹OŸ+BºH§˜â?lU83)tÊ¸uEfkÌM	„Rí”ªÊÇï‘ÍİÅ¥l€ÓäÆä”2ÑB¥bB¸ÕQŸ¬F<Èg²ÇjÏØòeüíw¾Ú÷»;bİ¼VLAME3.99.5ªªªªªªªªªªªªªªªªªx„‡UOh‘áWt#À9°Y WS@„B$QÌĞ³å	>JšLáX{è„ŠšuÏŠıVøæ…U³ñ^­mp’"âğvÓRfà]O]¦½òù‘O;dñÒoWå{F¥¦5Ş*Öp5¤næªŸ1c³£™Û¥£y$¶—–£èãºiK©–Ø¡i”ãxŠéxãÉÑØQ X,ä§Ã“åd©Â6,%ïR£B´¥U*É·º™Õ²Ûäó5(W›_(P_eÛ‘µZÍã0¶^zº~Ë‰aïÇm¼Vƒ6f—¼²Vşõågâ¼èS:ÄK²ü™1ìhî^,*èÆ©5!N'Z[‡$º™ÂéGe$ü§»z¡G“Ææ”<º:I…õ82ÃVœˆuç0:\ÛpvO69ìéq!EµN©4rH¼p#Z˜&Ê%êe¼ÖŒÎ}É]¸.Ü—Òö‚Ë£˜º¨’DbÒ‚Ñ™$ÿúâLqK¸Mj×óyxPäíiì‰ã[í¼¹Ä$@*íÇ§ øN-bÕéÄ³?“O8KGÂRVºØbñvF§ØyV-4@‰opút’fä$Ú:µqÅ9/¡B8]Z×™qnkšW½PÍuéŞšDİû†Z¹àìÛúN‡¾(Ğ‹ywtD‘"jÙBBFĞvb"LÉOˆ¢„•LdxÆÌp*Rb€†kNEÄÉ&‡Ş&£TºnN\ÒifªJ3`ª’Y/qâm6'ƒ»…ÒíÑƒ5Ì|š7‹Ã‘š:i.hİ-n±•ûƒµ4vä»•TmåB"vfdH#Œ4dÚÓ³7Œ1éõz)Øã’àE/–€$Î%øv3#aùß·’F…9?BŞ)Ïã¥•Éêm±RëÎ˜ĞQLªØdõT¹–&á¸^XÍPaºˆr!è¬<[Mám‚<k”XëÕÂé‘Ú²<{¶İû”wÙ‚ÂÑ6PvïÔAÿÿ…·d\\R·€â$&2ÀôÄa3+˜”>‚‡…@¡ê(oEYI$€‰äÎš4‘Ù_4’gÕ/é «•ã°m×âKò™¦âóK>Af–Š#3+´<ŠÂ^.F¡9LFY™kb˜ÙCµô…|rl¨i[!QOÃª#ª$lÇq2i,Ë3x`1¡JüüDµ*ˆİ¥R®‚\`Ç‘4%	YNh¨"J¤-¥Í'Çù)7õOB±X†U>ÍxEQ¾>Ât½gŒH*lï¡·§±ª} &+`ÇY³tU1[I4öQ¨¢¸ı#éæ~‰-éIè¦»œ‘e
ò­ÿÿÿş¡¼ÿÿÿó„I²LAME3.99.5ªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªª•†|e[Z@îqä
Ü~*}ªb8&Y5Ö1p-ğzcn'‹¼]D¿
%¸0Åâd•ÁvlÀ0Jí±¯s‘lÍ)¹ŒâáalxÚrŸËË
MÅ-¤øW’0ğXÑ®÷É5Íc(	UiÌ½°óQ0K¡Wm~İ+øHD÷›'zÃ0º“%iú0EÄô?Q
%3pİr¸“Ñá?T?aÉ?WJ&l°U‘Él2:Ò"g‰óÅª,ì
Dùøe¶ªt²¹G¹Û·ª™&=gÖœ‘kH“î[!ïz_–ÛÆ•êI÷ÜwÒnåŸ;u¿üºTEu3  MÜx¡APÄ8ŒÅÔŒ ,*",$^Q@€Á1ĞÕ•²„—FA ©õ]ËÕaÛn´.šŒS6İ«wˆ÷ªôWxív®§Å€P-iBiûÅfÄJ[w‘ÙWDíYõK¡äÿúâL/«ª @kWûYxpönÏméèu›[íaêƒ•´ì}¬¼8»LAEGoc4¢¡êôdóÌÄ7Ü¬3‰Z®`a*‰Ò ”-R RªÏDcISµ¼÷\‡<)”#6U
™›çˆa£	U§J‰s±…áôD%çkedgpªãG:Ô&áYØlyc“Q•J=tŞšÆ¾aª‹š»µûÿkô¥§¾K6°õ»ÃA.r°ìkR Q="8&fD6ãÍÊÆ‘eXZ±Ù ê®èºK—,x¾I1|«C6h‰èH˜Ã&&zXÅ¢;Vö¶2êñ°å	¼:S'^21Cí‹‰êx0/;¶—U7’&úFC1hÊÉ
ÌĞQ—;ĞèJ¤dQìÌõ®#Ôñr»Ñ„<Qmh(hyt ´è¡K§Ê¢iÛŸZlÂªC›K˜Îjƒ¬ÕŞÆ¬êôbÇ9hjÁ4èc
ooĞ¤äg£ª<ÕÊÕR´å+œ×v¢æ––$ò0ØÂ=í#}{¹©¨´Œt)Xr$†hÙw}¢H…	Ê*!º$†t®sÂVxänÙ0C-ÅÌ­+åJÀ€>ä4RQ’2&G(@ÉFÓ”¶4‹‚ù‚‰yXîCèº”Ñ ¨Õ©Ò@|% çf"ñ
ß‘Í¾š 9/§eÄ¹mİ¡7².ÆZ[K(Ö"œVJUÊêØï¤üğŒ–ã¢kÕÀ¾©ÛW–&íØo<ÓÍÓÚöŸu…c^­Õ»ªQ	t„ø«±èœ°Mšê55«œkO¦Û´J_v\Ïğ¿<®MqL¦[9Ëj±C´$63s«ÚŞ_óLAME3.99.5UUUUUUUUUUUUUU=v—Z‡ã¨Dî;¡æ˜áHB?+@(‰ƒ"q"Å·|åhôà I©‘;ÌØLA1á:0Õd½VĞİĞU¼4É.Ç#¤.ø–o`™yeÂ„È@N9Ÿ&kÀ‡•óÛP—h·)Îé¥\q¦œ¢eåÔmÏb µ	iBŸ‘$Ñ¶jAÔfXOüº~o,ÜPt’r‡y”Ü¡ÕòÉƒı’
îÏ÷è¢ÒNøÂSOÌz!eíĞ…=…«yCÑ1£ÿtÅÜ(®©aw
éÕ–Úh²¹å[VÅu3ïàj¸yXúÙ™ğÿE°ïğí|l€¡·T›F¡H&HA³%Là"L`™ &0¨ñ57nÛı0“€áÎbŒ«Û€¿aØWYŒÜæùÏ53aÒwv÷Zã8µ·R\ÖïV»R†XÏ¡â$uè×"øÊíOÑH~»?©qÔ¡¦İjI¤Vª›LqbT‚Ãg,:O.®B"<¾tø”WJx±ŒşÿúâLó§¹€ûgÙ{Yxrä¬ûiò"½ÉOe—Ãñ7ë5§³˜+“XßN¼q‰,úoë˜RF¹)6 +˜aHÕ´AÂ§a};z¾ê:ÂUá®ÊCµ¹üEcU ¢•oc?˜©jmW>Z¼’;¶Ép’¶–±ë¯èH$H  ê ×‹Â8fÕQœ
b…‚ # aVİøF@0ßS—¥
Š–	—·fàøC/ü7¨RÈwÎRî˜Í[á—«Rë”¹N¢³¸àĞËÕÜjŠI/·	b-Õ›Ğ´™sÒÿË«ÁQÃ«ÊxZ¤Q®ÃŠ¥I¶·Ğ%.‡æ/¶`.¼S•çWJnú,$¦¥ B„F $è-Q¬!Òl¤uô´—)5›M2(‚¸X–ê°o6m•Òa¤E¶¢ 1ølx8 –À2—ÙÜPeyŒòW”²EuÓ­<ÎĞVì1.›¹$Ä"ğ]?Æ&rUykÃs²âŞƒNÖÄ[Jû‹İeî‚8Op–{³u.çìü¶½b‘¢ ÅCBAt‹M8ãSìÒŸLd‘4 Ã?QäãG!XJögw--ø:iâ¤²ŞÛK3ùÓÊÜ'î5Q¬¬‚¼?VW“Ğ‰4³U±;Gcïs:˜Nò{,®ìIôÀª¬ñ˜¦ò˜¾Ï¶M=Wàb…\r¹¢€¦›F*Ù	ëI„4 5F¨Èƒ©¿®•è—s@ZVÆ¸T$U"Ng®Õ§Çôtq¹à<t%šDÒÅTS.¼{oÆ+”š!
œx€~°¨Ò³¢›§‡%b«
•®»kÍ
éÕµ]§1?ÿçv9·Š?Ãu*LAME3.99.5ªªªªªªªªªªªªªªªªªªªªªªªªªªªji´iyä€—ÆÀª@Åc1Y Ä“4ÈÁ3GÌ˜²ßà¡¬ ×‚å\5ö!†j*]ÄÑ–°‡EšU)D=réã%â¶„éPÉ Âõb\é gvÊİVöÅ•ü5“%Rú–ÅYt­øöÜPÔq`ÀxşJ¬cJG¥½•­«æ¦»«Nâ²¼¹[(Va±¬õÁå>u$ì/­hÌ´W¡z ZÆW9>96h¬ùòû…@6ò3Ó«Ù`8”0ÕB	S›éºGX´.ÒéN0ëùgBEhô6,3L«®Ñ0BfpÔ#$3ploÌ tÌEƒŒ@0a pË]ZI”^ñà×ê»Î9aii<5’Z’^CTçØ—1Õ¬m&jqlÜ:’D¾	ê¦l-àÿsx˜ÔOs>c´Ã7Ÿ%²ÍÏe$.9;ŒÌúö ¼Ú–—„Æ:ÿúâLb'³ hØûOepÖ­mìŒ#ÑÇLaõËÄ4+ı§³‘Pç -ruê•ƒñ%¾÷¾~Ì1IL©¬¡Ä¾"ÊçJåiC'Ä¶	*¯lè—öO³£€™YƒóQïIµ«6äK£êA’ª\¤ôYÇ±^W¤B €vé'AE§9àŸª HH="à ©A.|‚¢Ä‹Åç”¦¡W¼ ›ŸqY4>éI ¹l÷G#PÍH kŒ1+“¦Š_z¤nÒS°’`ƒşÄ¨)çŸÉZùÁlÑR@Ñhœü1V ã¨Ï\w½Ç”¾nC¢ƒ"€ªÍKvÕKÚ£ƒ-{OäÃ`C5ŒA(Óèİ$sb&Q‘…üQôn u”ÄÒï¡)ƒES½1m‚‰)Ú]1•ì¦ëé& ²S³™c5ÔÚxu<&É ùDš¦¨•„!”‘®¶’9HMÉZ<G©Äa”ÒÊñŒÑr;‘êÅ(òÍêÔ2¸¾§ˆ§…;SöµİÛ•ñ5ÿk[ÿå.w™i™iaeÒGZ3›p±:bL%Îe7CĞhS±¨)qé]+âû’1àR	]@(0„Ã,H#uŠ¹©4ûÅ ë%2¿’Aó´ËEZı#2n=ä¢¤=e©aÀ3†0™ìÒ<çÆØ\¾É4²„åKäæ"M©"_Ÿ·ªØàé ¯-¥ˆ®ÅIz9‘Fîm£Jb@•¶ò¯2¸¬¶#"2’cD±q{–šÄE%c‘8õ)>]J†úT[~¸p~ •áIjIg‘(7qbQæ½F*m£Œ…£kQdGE9œ:'‚¶Ôüúææ`f+E©ÓÿjRœÌ%| Àˆ"8Ş#:j…Ç	á³lZdĞe¨Lì½pÉ™Ñ€ °ŞõÔ.0†|êeüÂ¥^”e:BFé†Äı1{R…j5ZùwF‘à©)J¶bD%^u¦¢.à¸±Í‰§;‹S5Y@Ëƒ%÷L© !‘ÄVgÈj Ñ©b2ôä»njòæÚ¦QÜc
`êõ|…¼\qvLnÑŠÕÁà~g ›”ª6Æ.öIÊF†·½[XĞ%™‘©M­Îîøı€¿#
¡@¶¹5ßÀdÛãÙ–/oXU„­Ê¢X’²s¶,2 ÛË‡•ÿ mŠ«Š•D½X¸ÎtMYy	ÂàÌÌC
&fQ\ªçJé¦œî*}¢Úˆ:™Ò¼5á*Àj”qR™…ı sJ°Ú³;Ü“Pr¯ãæ«}âœ·¾l7û
k­.G{„C¶¼ªK‘d”V¡-§Ò^LfAútIÎ|“SZÉìi‘PŒ£Hy„pq)ÿúâLıÅ€ŠhVcYyPó­¼k/>`­¿QáõÄ¸*u¬<ø{9ş—†C	šú=pU|š1œIù´[6”Sç¦”l?ÖÕvá†¬NÑ	Z¦tÆÇœ­à¾#[§ÓÑcV¹p´ß…3F!1¿…#„íó|ÕÜß÷J÷1	¦ cê£$ƒÑäaÍ¦FÛ˜x°¬e£Æ"•J²b„ªb‚T<Ÿ,êKI»O$u!ï±—öK’”Iä’‹ò†!~†$ÖTÕójÆìÎqÅSE5Æ–vìš’Ü²Ôë¶æDŞ›Ñ<"b5±=¼ñ‰lZ`	ù“Jì©Å?pu0„#V6H(Úño\¨¬"ˆwË}`h«BY%¢×Ál‘F¢
ÄEE7LÊxÔñ«rù^ø«¡ú~ÂŸ.°h,¸'¬Ü	f:*Oõ{a­FÕ!©ØLˆÒşİ••S;Üı«TÍ^»k¤¸õ‹ÿÿÿõ÷…š®ÅAA İ±   xã(¹•U2æ´0ÓQK„z>Š°åˆ0 \«*ekğaJ-ø<P(×¡Ş¬½ºÆe•c¡ø³/
|“é’$=5šéÔŠ œ¢ÎÔNZh€~Ä*LüX°¦’k9~é¼9ğÚZ­oÏÑfv"òN	ò¨ÜŸ vA‚ˆzdh7…ÕÑt=G8}&Äô¡ ŠÀ}Ñ‚¦	hù¼İB§RÆÚu€Œ«ÚË‚&0ĞÒ2È—W,*Â!Ê#]ps®Ûócl0—åVa õ´¾ª<Ãw¸0b7ç//‰-‡µ¥³|ù?Í~±HU¾§¯ø+LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUR•8Wo£¤GL]bCEÖÈÓBE„P34e\.xY½ÈËÊô…@‹)‡*_sœ@à4õ¯§İ•PÑm>›P€¿|ÇváäŞ¦x‹	2Eöµ5ƒ°†–	ŞErÄ}Í³åxš²‹èlfgô>¥·éìuÆã§µ+å{”nz7i[º Üö¨b¿Çƒ­­Õ$NS¨±6I›£Ê+rT'T	ÁXM™âÉëAİê¤¾×¾ÊË,9Â
#bL{hJ¯ºœqVtàĞ<2!´YHµjé+ÕQ…Ò¹Í}¨dıè ßI‘!ÒÃøÚ ¦ae;€H–¢]qÍyÃQIBS“Í‚‰4@Õ,WÍÔ	.k[QW0€ƒÙ*½Ü,Ÿp€ŸÙC.ÊšCS¦ŸõÄL<")Dâ}(&å²XL‚•…JÛ,ƒ¸Y¡râ•$»)×>	Ú}ÓED!s`ÿúâL¥³²€íhÙ{Oepç­ÿiöÕ£YíeòDµ*½¼½¸}å«Á×’Fâ#Ê¦d¥úNÇ£®.ù©# Z¡âi×Té|q•LÑ¥.Ä%8˜ºö%,,2‹1\Lİ<ó_KÇá'<§†°Á6‹—¬zwªJê’Uªñ÷<X“/B¿úHÈYE"ÄC¡$°8}»H’˜Mu±£à
øë³JYıv	š”èJI`âşÂ°óR2×‚)@Z7Ê<â±7X³?¦b~•["é”{
ú³#‘å¸‹È¨¬¨„ıÚ¢­¥ÊÈ(ã	ÜˆõT]›PY˜YrÙ‹K“F÷BK“:u¨l:xO™  ²"Æ:zòƒá4w…º™¥<“$,Çahx´’bäÒF„Æcm‘
eŒ×Û‚Ô3¨Ï0Ø™Ié=¶i¦ˆŠÙ>¬‡é˜¬v¹)qÔNˆX:šÆ:%Y+¹ùæafÚzvºËdVX©õÜ™Ö.$FÆ+Õ š’Xà€Õ» a0†£€)0ğ
<_FF4Å—(’ìªì
X¸Í„šGhèÍ Ã^NÃ	–™7Ül„¾³ò÷Û`¬ßj]ºÜòjmà„(ÛñLøU_9[—\–²Ó¦ÎÕ¼n<R
·¾Ş‘g7^©Óò¨Blı;
ÓÄ¶ãØ¡B@´0…ğâe„«*§ã\ü@Š¾À¯'$Ó¨Ê‰é"ísøL0æò²+Oë/)Ùäbo+­·MF,'rbŒ
–&„>2„Ÿ3ƒi]8
"zz³•xŸo|iE¤è¤*I;SÜ®W-®ïüE¾©ULAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUciXjÑ@Î™$æ&¶¬„ÃGbê†i®dÅŠ4‡LSÉÀôAÍ¡—˜¼m¨5.biÔˆˆËÄú7<?php
/**
* @version		$Id: arogroup.php 10381 2008-06-01 03:35:53Z pasamio $
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
 * AroGroup table
 *
 * @package 	Joomla.Framework
 * @subpackage		Table
 * @since	1.0
 */
class JTableAROGroup extends JTable
{
	/** @var int Primary key */
	var $id			= null;

	var $parent_id	= null;

	var $name		= null;

	var $value		= null;

	var $lft		= null;

	var $rgt		= null;

	function __construct( &$db )
	{
		parent::__construct( '#__core_acl_aro_groups', 'group_id', $db );
	}
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            for the entire network, see the <a href="%s">Network Themes</a> screen.' ), network_admin_url( 'themes.php' ) ) . '</p>' .
			'<p>' . __('<strong>Settings</strong> - This page shows a list of all settings associated with this site. Some are created by WordPress and others are created by plugins you activate. Note that some fields are grayed out and say Serialized Data. You cannot modify these values due to the way the setting is stored in the database.') . '</p>'
) );

get_current_screen()->set_help_sidebar(
	'<p><strong>' . __('For more information:') . '</strong></p>' .
	'<p>' . __('<a href="http://codex.wordpress.org/Network_Admin_Sites_Screen" target="_blank">Documentation on Site Management</a>') . '</p>' .
	'<p>' . __('<a href="http://wordpress.org/support/forum/multisite/" target="_blank">Support Forums</a>') . '</p>'
);

$id = isset( $_REQUEST['id'] ) ? intval( $_REQUEST['id'] ) : 0;

if ( ! $id )
	wp_die( __('Invalid site ID.') );

$details = get_blog_details( $id );
if ( !can_edit_network( $details->site_id ) )
	wp_die( __( 'You do not have permission to access this page.' ) );

$is_main_site = is_main_site( $id );

if ( isset($_REQUEST['action']) && 'update-site' == $_REQUEST['action'] ) {
	check_admin_referer( 'edit-site' );

	switch_to_blog( $id );

	if ( isset( $_POST['update_home_url'] ) && $_POST['update_home_url'] == 'update' ) {
		$blog_address = get_blogaddress_by_domain( $_POST['blog']['domain'], $_POST['blog']['path'] );
		if ( get_option( 'siteurl' ) != $blog_address )
			update_option( 'siteurl', $blog_address );

		if ( get_option( 'home' ) != $blog_address )
			update_option( 'home', $blog_address );
	}

	// rewrite rules can't be flushed during switch to blog
	delete_option( 'rewrite_rules' );

	// update blogs table
	$blog_data = stripslashes_deep( $_POST['blog'] );
	$existing_details = get_blog_details( $id, false );
	$blog_data_checkboxes = array( 'public', 'archived', 'spam', 'mature', 'deleted' );
	foreach ( $blog_data_checkboxes as $c ) {
		if ( ! in_array( $existing_details->$c, array( 0, 1 ) ) )
			$blog_data[ $c ] = $existing_details->$c;
		else
			$blog_data[ $c ] = isset( $_POST['blog'][ $c ] ) ? 1 : 0;
	}
	update_blog_details( $id, $blog_data );

	restore_current_blog();
	wp_redirect( add_query_arg( array( 'update' => 'updated', 'id' => $id ), 'site-info.php') );
	exit;
}

if ( isset($_GET['update']) ) {
	$messages = array();
	if ( 'updated' == $_GET['update'] )
		$messages[] = __('Site info updated.');
}

$site_url_no_http = preg_replace( '#^http(s)?://#', '', get_blogaddress_by_id( $id ) );
$title_site_url_linked = sprintf( __('Edit Site: <a href="%1$s">%2$s</a>'), get_blogaddress_by_id( $id ), $site_url_no_http );
$title = sprintf( __('Edit Site: %s'), $site_url_no_http );

$parent_file = 'sites.php';
$submenu_file = 'sites.php';

require('../admin-header.php');

?>

<div class="wrap">
<?php screen_icon('ms-admin'); ?>
<h2 id="edit-site"><?php echo $title_site_url_linked ?></h2>
<h3 class="nav-tab-wrapper">
<?php
$tabs = array(
	'site-info'     => array( 'label' => __( 'Info' ),     'url' => 'site-info.php'     ),
	'site-users'    => array( 'label' => __( 'Users' ),    'url' => 'site-users.php'    ),
	'site-themes'   => array( 'label' => __( 'Themes' ),   'url' => 'site-themes.php'   ),
	'site-settings' => array( 'label' => __( 'Settings' ), 'url' => 'site-settings.php' ),
);
foreach ( $tabs as $tab_id => $tab ) {
	$class = ( $tab['url'] == $pagenow ) ? ' nav-tab-active' : '';
	echo '<a href="' . $tab['url'] . '?id=' . $id .'" class="nav-tab' . $class . '">' . esc_html( $tab['label'] ) . '</a>';
}
?>
</h3>
<?php
if ( ! empty( $messages ) ) {
	foreach ( $messages as $msg )
		echo '<div id="message" class="updated"><p>' . $msg . '</p></div>';
} ?>
<form method="post" action="site-info.php?action=update-site">
	<?php wp_nonce_field( 'edit-site' ); ?>
	<input type="hidden" name="id" value="<?php echo esc_attr( $id ) ?>" />
	<table class="form-table">
		<tr class="form-field form-required">
			<th scope="row"><?php _e( 'Domain' ) ?></th>
			<?php
			$protocol = is_ssl() ? 'https://' : 'http://';
			if ( $is_main_site ) { ?>
			<td><code><?php echo $protocol; echo esc_attr( $details->domain ) ?></code></td>
			<?php } else { ?>
			<td><?php echo $protocol; ?><input name="blog[domain]" type="text" id="domain" value="<?php echo esc_attr( $details->domain ) ?>" size="33" /></td>
			<?php } ?>
		</tr>
		<tr class="form-field form-required">
			<th scope="row"><?php _e( 'Path' ) ?></th>
			<?php if ( $is_main_site ) { ?>
			<td><code><?php echo esc_attr( $details->path ) ?></code></td>
			<?php } else { ?>
			<td><input name="blog[path]" type="text" id="path" value="<?php echo esc_attr( $details->path ) ?>" size="40" style='margin-bottom:5px;' />
			<br /><input type="checkbox" style="width:20px;" name="update_home_url" value="update" <?php if ( get_blog_option( $id, 'siteurl' ) == untrailingslashit( get_blogaddress_by_id ($id ) ) || get_blog_option( $id, 'home' ) == untrailingslashit( get_blogaddress_by_id( $id ) ) ) echo 'checked="checked"'; ?> /> <?php _e( 'Update <code>siteurl</code> and <code>home</code> as well.' ); ?></td>
			<?php } ?>
		</tr>
		<tr class="form-field">
			<th scope="row"><?php _ex( 'Registered', 'site' ) ?></th>
			<td><input name="blog[registered]" type="text" id="blog_registered" value="<?php echo esc_attr( $details->registered ) ?>" size="40" /></td>
		</tr>
		<tr class="form-field">
			<th scope="row"><?php _e( 'Last Updated' ); ?></th>
			<td><input name="blog[last_updated]" type="text" id="blog_last_updated" value="<?php echo esc_attr( $details->last_updated ) ?>" size="40" /></td>
		</tr>
		<?php
		$attribute_fields = array( 'public' => __( 'Public' ) );
		if ( ! $is_main_site ) {
			$attribute_fields['archived'] = __( 'Archived' );
			$attribute_fields['spam']     = _x( 'Spam', 'site' );
			$attribute_fields['deleted']  = __( 'Deleted' );
		}
		$attribute_fields['mature'] = __( 'Mature' );
		?>
		<tr>
			<th scope="row"><?php _e( 'Attributes' ); ?></th>
			<td>
			<?php foreach ( $attribute_fields as $field_key => $field_label ) : ?>
				<label><input type="checkbox" name="blog[<?php echo $field_key; ?>]" value="1" <?php checked( (bool) $details->$field_key, true ); disabled( ! in_array( $details->$field_key, array( 0, 1 ) ) ); ?> />
				<?php echo $field_label; ?></label><br/>
			<?php endforeach; ?>
			</td>
		</tr>
	</table>
	<?php submit_button(); ?>
</form>

</div>
<?php
require('../admin-footer.php');
                                                                                                                                                                   •©P+‡5K’½õó+Ä!”IUcÔ©ŠN‘Ö\2–PeGO‹öQ*°”«›¢E”"‹‚ù’#'Ôª´‚xıÂwIêŠ*`>zİhYöÀ¢7KYp2…•’™.îŸa}È¤Îµ=•åêq­ş¿Î¬ŒT".Û%áıi ¬x95EA†:Š¹"ø8è8ÀUdh%ZPé$"®œïëøÏ€ RNSem-´û¸ÛE«b\ÖB¬ò9gibmšÊ»dÀ¿:‡iÖèùNØiK´+$ê¤…áTGS¯D‡«S!¸ned£;zàùpÑVŠ/®†wÍÓY*Ø¡zõ•T{$u´·WĞœÑ_íJÁ2áW¸èØX2Í3
!ªlkÖ›œë†ı«–k*¥D–e„ÆÌ¢Œ†¬.×Ó¥å©ûãJ˜ŸZIX§Û»B}‰­™»“E.[Ò¶'ğxœºl´©j{!ˆÌSÃ[$GPæç",@%ÍP3±‚„GL!Qie°0‹¼ËúÙ` ÄN¼°Gæ~áIÅÅµ®êsç°í{ÿK¡®,ÌÊå0ù9NÿúâLGH- gØ{Oerú®šÿié¾_B[Í¼×Ã§4«ı·²x0B.ÌôÄYòõZé„Ş~èâ<:%m½‘³Ávä[”faLÇ2ÒŸB^£`Ã.¨l\iã
ÃuÑÍUF1•ıéme]«¨VŠ:å¶{sçe7Pœ\ÕÈÊñ§+¡DÑöåÕ<óÑãk^~(°Î4Â(Á{dÑ$¨!*U.«ÌXÃNÎÖ*F	ŞcšîT.’½Eÿó;Ëp©ê©]­I
3Úoq\ic'@BDà0d*Å˜oŒa£,p†…ÚäƒLİ[á¥„Xt§Q¨.mar¥‚èKŠéÌ©Z0]J­'È÷Zb£xùäc#Ïar]»{%™W©û#æ×î¾¹}`ÓıÆG(Ÿ‹£³R3ªÙÎUd¯Ù8³¶(œUMjcú#¢î^ïØ+“ñ‘Xºe‚MØMÕ–hùõhn"½Íß¡ê4ÁÇ•Éa=N‡%†K$»‚µ•óX»Ãmà•ÙˆL&DÄó¸RÆ3ÅYã¡PÜ»‡òùûåš%7´ˆ®–Ö8?Àñ0ÌÍê &B$z!†ê.$^/1c“$CaQâa°hmh…„ˆŸ´, ¥Da¹)& Î \Ó>á¸è—8ÙJ'$É6(+¥§ÒF|”zÖÛ†Ç(OØÅ„ègo]ª j4u¸qÛ|8pÙÈãf¬»|„"P&fd=rŠâ-"âŒ>•¨•zLÏ]FhdáˆMÓX†"VT@ë9ÕI¶DÓ–ëØ’QYïŸXË´%d÷qUj#J·İVÒ+\ø8Ş«B¹"ãÈ\–vŒ%® ]\›%w”åIry*W*NŒcÒÖŞR-@ØêÅjËåç—Ÿ2ÿÿÿåas3!( Yˆ„È!À†‹£ƒLÈD 8ËAƒšÈA:Ë¨ª¤B…ùf’&RˆíA„=ĞIâ&I$5e¨H¤T¤
3µ3³Ÿ»ª¯ÖI§qÃ˜œ§ª¡7\"iô-'\¨ğ÷ºPá­Àxõª±¥Ëlm¶zÄ³ŠáaıdL8~§Š²ØˆK3ªI¢¹³D ¥Û+?7£VZ÷”1è¯/²Ã3ÑÅh’–ˆÉR"µË¨T&ìe1y,èn|p¶6–¹
E)Î_c$ï‘¢®½ŒõĞîô-¾…&&ÜR<ø]QËU	œÖéy«„3 ïG1øĞÀ nÏñ®Õó‰2fHl]á®eá†Qåi¾êS!QË1Hn¼-®Ó?r¸n#.å<İ4&ÂĞ¬T¡2s„z?–=è/y}RE&üx½wCRz¿%Ø?_É»Èâ»¤è$—7ÿúâLù< ¸uÙ{LpÖ/eìŠÅYÍáæËI4lı§±ğê®ªëK«D#ÈDV‰Q¢p†­‰³‡ÁIÜ~]m£5ÜËä¢Ë’†‘T'¦*HW)ì«FŸÓñ_ÖQí^ÿV–¯MÎ®m\gNãË~5ê~ñ4ÆÂëYëz^’|‹Eª»ÿé‰—Ì‹d„—Œş;¡Bˆtİ9Ï)Qu^#]ş4Ç8yğ*@Tdñ–b×ÅCËÙFj¦"Àtõ¢ÿ16¶—onºa|¤_> Ì¹o‘µ
?‚õ¦*¥9W«S09Q!(¡yÕDµŒrìÚcì½Hš²zÖœ}*ùŠˆìÊÂqÉi:Â‡ÆŸ}›²[ª®SG¾H5æ.+.SZñøƒç¦O®OÌ‹BnW´N¸ã&P5ÜØ–­5ní·Ûê%Æ®æÃ­u–&Aj4=eınwã§9?3Îc72!³,‰¥+hò@Fù$©;…R8bÿ­Àu£-‹É0f”À0p“N”©¸æÂj«j65;9ş¹ˆäµ„Šûe­‰I{X¶éÃyî.ÚßDoi^;£Ç‹7†úhP6µkµB€‹co€¾™.;K‹‰’<Ş’'í6jBØ(ÖA˜«E
‰,+áÊ\Ë”‹1A°q±İ:öF'ì±J4Ò•>©¤±¥U<\D•î1"Ã7P×pw¥EjÓ½0â$Ù±¥X›3ıq½ô80/ÙkÖ4Û?·şYãføµ¿ø§” {uSÿ×R©Ácón 0)Æ"
V 	K-{Jqˆ…{9ø‹`X‰ÄS)‰°êV¦îL”±':SîOİ®Ğ¸êèçòçr×	Ç‘Äüì{>¼™Ô{xÍ`ìŒk¯>)[kßh…Ä¤ºØ¾$Ù’jìùˆDœ®êÌµ‚’øPÖñç6÷¬š,|¾ø¬±2ÿ8—V««ĞÀª7Ddkäªp†SRSFÊÅ5q-îm‡¥ã‘½Øi§i~˜¡ÿ÷íÎ7ìZYøá¸¿â3ªLAME3.99.5ªªªªªªªªªªªª
{ÄÙ‹kY„Î‚³†l‰+NeÁˆ@°3`Õ-Äˆ0PXÙdih:"ÁbAPõ2æVÔa°6xÕÅƒ®Cí°0SXµI‚H’°ğîÕPr‡tFÀ·±Õµlõ*óVå«X*
{Î„cïDR_K”ÇÎÄøä•Ó	óESÔ‡…UƒJ´ÎÂA>À¬İ*Ìµ!šIUİ>Æ!*>ÜÃ	A9!~9âa…Ú@4R,±HSA’®-%§à±şZ§.mÎ;3ŒÉgÇş«dş[x]lÅT[úÛE8vàVÿúàL‚jr µjØ{LMàÌ¬Û/eé|Ÿaíåáƒ73,=¼0øÒ¨ºİ8ï;ÊDÈXæbbÁƒ¥	g£Am
#Áˆ  j!ÓS ÌI£c–¦uB!nĞ¶ÌVwQ‘6ò+¤^®²_cÇš‘Øqö½’‡¼ ±ù^"FàPKç0sÌ½w¯Í.%#5Aµ
ŠŸ ¸78¶Ğ4#,¨õ–BÊN×¤²ídR*ÄN}MÌ—a¦dÊ©Ïg“BgVÊÙMI£}¶7hˆŒjSú=’_ˆBbfòZÛÈØ ±	kN7 ÔfX0p…:(Ì``"£¤$‚)bL¶H‚Ä”b|’;O³å†¢Æê¿KÂLÀdD¥¹‘§M
u9Ú‡>:™U¨ÅG«+‚ûUŞçwñUqWÂ¶m˜2¸ë]£¸iœ]ıRºkC¿ÇŠÒ êjZ)ræ«b€ÜŞ§'—ÖâOGºhËtj7#/‘õ|³·!SZıªÛİ¼•´XZ[…	ºÏåmÛrAûçñ?‰Smíæsïiåò¼ØøbgÊô…½Ë[¬/Í c  iR2@äJ‚Ì Ë	t‚‘p‰©ªAhbNÊ²¹qÊŠûxëT¶ÈWÃ°Ù&¢À2)½ ĞÜx¢,<ß™º]åÈ"aÕÛ–^.Q¶C¥Š2Õ4Ë3ôö‹ÿKd'Çm•[`Ö‚.i<øÈï«B)ñq‡dÖxzCü¦Zm„ØQu,X]>–D;éèí\EÇĞ¿x^ÊËÇ°ºÃ·BúdÄÖñù–ŞŸvè³µe¦Î¬õ'ßLAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU:‹Æüšî„)t@‰Æhx*Z'1I‡¬ˆÍˆbI @‚Hğöe3FÀ€Ñw¾pí!ªbÍ¸EÏµä%‚Å+*%\‡?‘P"Ê×<;VÀMœ`J„‚©Ó›sìõÕKÉºùEãÓ®¾Ùaé|±¶FU˜“®™N	qJÒÄVïÏ$µ	 AÒ™9¸¶"ª
ğk&ê4ˆ²à¤şˆ'µÂd"—²¢J¢%ËR²²š9'FJ¤´ûk•¾D§İ¯CÏC7µ»zq’-¨áITÌµ  ì ÈŠÍLtº*N¢hŒXpBŠ8
h\  k¡5å	vm‡á„©W!ğÎê<]§yål<õ\uåtê³ µ[7:Éz;€œV°7M2ºó­É5¥*¢¥^[ƒi€‘Úa‘
7LÿúâL9¨ ¾gY{OdÀÿŠo/9aí=œÃ«4+ı¦?™Fr¸W_Šá>=‚xÉÂ„¬•¢âÅÚq’ãxàV
qØX*rLw!*Ót½%3:(Ÿ.ÂTZ+JÎœS«“Ê©˜*ÒŠ(RáQöØV©šç2–ZŸÙ²—º]G]Æ=¤e•z-Şâ\®qá^=¤úu¬k_¤ßüU[ÿşİT-Şã²!ş– 9màİˆúœæ1"!B
a§XCpÆs5¥‘I•ÈH@¦Hªtj³¹0{tk“H$–ÖpŸ*¾b3Xf
´‘®ıÙ1i‡‘$P8Ì%öƒ*À´¸lşCË
ˆØ‘0ßvYMÙO'a|s.æ1¥kU—j¤¬n(ß¤[g-Œ6iD9ßÃhÓdhÇSŠg¡©H„—OÑPÈR­â"û{"óC¦¦/1QÎ>.“||–OVşˆDÆ	‘ØÜä®9˜L@şä„0Ì6‰0¼*£È×jh,j²šÕÏ²ë%ÁÌ½ÓŞ§Ê‹‡‡×Rpë¾F‚¸fø8¯|céÏ:C:8`i–\…3,Š*‘şQbËá¬¼Éş²b-r‰ø{U²‡¦ÉİØäqpËqªª»¾İ¢Ëá­'³"1àãT-Mäe¤²tØù0\oÎo]mÎÓ¯;ûŸUšTËVÉbSlH ïú6)"%cÁy{BG¥bV‘ÉN`ï8jâ:ÏÃò†‚´ØÛQÖæ†¸y\•†"óz¹ë:ãR{a½V*"×”»rwêÄVÍ±¶k8Õ^ÀÊ›®×ULAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUU	G•êH|Ó`×xQ¶$dÓ< '#‹0(TÄGÓp$Â3Ç@Af÷5FörÏàgm¯vË „7ˆY’ºx¼B­W)80…BÜø‘–Ô "ÖÂ»fRéÍÂ+){2¢ºS3Èæ¨›“QewwŒMKò©Y\Xà'
èìjúˆ*«ä\ß°IÅyÅ ZÆV})DğéO§ìÔû#æEã¥…ëm”‹«aı¢gÏK«©¥ç5ÿÏ‚>\±ú(â“w8RU8/’Á»<¥(R¬öHk†ƒÛ;3ŠArgèQá{IéP8²¡Aê ×o¯c62‘‡ Â L8  @ÉŠ¢BEózÄå¿òh†­5ßnÍÅÏxß›òU‡›˜æQz5•@Oı{³«¯ŞÂ´iÚp¨Ç"ù½gv‚L¶ÙıªY…êçãäğ™…–ğZ Gâ]ÕË"k‚À®ÿúâLJt²€g×{Oepöí:®on!¹ÑOÎa•Ã€4l}§²¸:•ÄìL@i|xd4‹jEø…†Va¼£V=}Œë’tR©:¬W2¤Ü")”‡’¢úÃ<xPÖ™$n9PÊ§«‰ä³]`¡o™X£-·µ+”V$ê6hnâjgäÒú‚gá¯N3ı°¼™zyÚ´EÒ\™€0V(RR@ fÅˆˆf‚Bo¨ÑÂâàp2ˆÅ©aÀˆ
ŠŒYãˆ«
öêšI_u9|º:Vkj=k±èjvıyÊ(Õ+âÑ¦ÍŒMÃqÆıqˆæCVËš—¯ÎÊd¯bäş¯%YNf'/~àËÎô)-ºò—¹†:ğ¤=1×aûY#.^ï )ˆèÊ£l…	1†4:ŸZ Ä'C u ”Ò2@õ
¸Ø^u—@‘§’—Ê=¢Ø~9&­ZLqp„¥Šœ!—¢9:(’–Ğ%2XY“ÕĞ–èY°b6`ñİaùr}îfkOË²íåÚ–ª©B¤ÌÍÔó=>£Âšiêê›éZ*SBÙ›â#+ZI³*Àº€Ö£Ï@0×¹5Å´†æPÁĞ‚°ìèXğ¥Ğ§.ÕÕ>Ø!u¸Õv¬†º]#Ï”¼5„¤%÷¯›QT:ŒLáÎ)Ë>Ëz‘üïb³HHh;íëUê¼']Ú2¹Š†1äH Ú†—PÔ¥3í²›´ÜêÕ±ODc*?cØHˆjñjy¯ºa•:á¦X±›ë§IHÊOì3<¯}Î$3$ZÜ\d~v{Í"XM2Z!¸É\08)Vtuå¹é¢†²·şYÛ»ÿZLAME3.99.5UUUUUUUUUUUUUUUUUUU)X˜·Z}¬€'N­K:>Á<r•‚l<¦ghÖqúWK—¹,—?‰Ü¥ªıœ1wIqÃÒ—æó±UŒ»¼äª;}¢Â¦à†¥SÉ&YÎ+ãš‘A4T"–ï«)ÁvıtŸµòà ›0=.Ï»*3\°åÛµÓ¯HÔ%¯(ıEŒÆğñÃÂ[¤ƒ~b¡ªÕÚ÷·¥â½Ü¨Ê™Ë²¤¿
BóI‹£¡åN––!¦Tû÷JbòH0åyÃÇGæ@&…CçMº
\éÑùnsb„¿`2,Áx Ìº`…™Ğ†¡³|t•¡‰áàJÓŠ—T—Â€œâqJn¢‹’‘­Á"ãúÆ³xtòÍ<ñ+…tQT§¼ŒË—l;qËû`·.ÄÛ¥‹sV?‚ÿLó?ƒw(aw–mÇ-ACÜK]XÂ~¨'h¥²‘V¥ªéÁ"Äƒpæ5B•e:ÿúâL· ½hØû/g0êí:®iì®#1½I-e—ÃÖ´k}¬=ğ¥p?—s°#¶ô(ía\ª“UÈjÊ±!FrÃ¹àyö&‡„&…:dL8/ŸOÚjzKëÄì™B~t_væ§'~@˜:WQ¾‹ò˜‰•ş
ù!,á°  ÚÀAñgdÈ—a·–,Hii‹(*8 ˜8Y5È«_*	‚l+Vn@Ğ*µ÷ŒÑ£#Uí1Âx+Z	™Ì á@Øò
•­gö:Õàö¸4ø»¯Q!BÒP$}]›o{Ë“ÄYÔ=;<\z¢Sö¤û©}½šo"0àv
û@³Hû!)¸!Á{ dë$3°Â‹4Ğr`WdY32-Š˜…f^ã—]÷m<(bñŒ‘_…ÌrTm›J”yÍS:xå£CCy 2gLiSË”X¬Væ®œÕ<ëK(Ëô]Ü&˜‹@a·ÊàQ MFØ™ç*lÑÄZôœQ6„B”á®¤KD“³2_S)™²ÎhX…È{}#H‡Şàr3dcÕÁ¹`*D&;Ğ0–£*œ|Ç=§1f‘¨@&tğî9µ*$”PóLÕ2jCIÛúX)±@ñ¹U˜ºAF`•îŒŒ6+›÷Š~+""”³ß7eİ£hO¥©‰B˜‡²0j&§<Ú‰„¬©xoÅô=“rÁº_0Ö…¡&òü‡©5®™vm¨O¦CdŸ#K’:3[‹ƒÖ8­[F2WWVªº$»Oå©CãDÈN	SyL]ÕŒ‰½/ÓÅ$ŒåÒå0²s?€¦}äPT¶ ¥1|¬»ï#ÉğÊê,~¦‹ELAME3.99.5ªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªª$€•Fh@  BK˜G…Œ¢—,QAÀ$lF˜&% $ñ¦/HU ·–p¦mlÁ6ş¢4\tpÒ'#G) (&¥%kŒÅ°SÜ¿^Ó{s’—YÑ”SV¹¦ì­áÇl=1.•_¹Oj±Ò‚³*½´ş«éŞ%•!œ„ÇiD+Ó|q.+‡Yr%2ıX.´ àj3#‰±ÖŒ…~;4Ü´™„Š„´x›È”£Ô#´FpŠ_Òèu•kÓ´¼¤“
ÒÓr,Êüš:€ß•‡·Ì>Ğ.JL<¡ƒ…P!l”ÖŒ"îR	,¹\K|2¥’¯ÿ¼ı­›Ç8Õ$ˆ˜’¸0x0ˆÂ	Y!‘„-]§6˜Sqs(ŒP°@©Å`o¥ØPcb‰?‹y3GFG<óµéé-ç­i[¥ŒÑÓ¿¶a‰”Şzäö#ÿúâLrA§ ³oTûOO@ÙLZïo|]©•YíaîÃÒ6êı·³åyRI.‰;T¹W«1`º%Ãˆs Aúqd™‡Ù
ua»‘¶!Í
§ƒËÂŠ’”¨ùÅ×Ôä“â„Ì:áòØ»`2QG-¨ŠÆˆm$˜\EUãŠcOX|¼^Âê^§)L>©‡ı´\3!tpv®|·-=F™­»#¿£‰¡;“IÛfT ¦y‹Ğ¸(ØD(ÖE3°€Ì‚ŒBÃkN†¢!YÆØQ“@{¢ É©¥Àx$±¼† (»şÚÀÁİ.Z—ƒi¤¤ù·¶ÜÙÁğDŒtkåLlËKæÚ4¸˜ªµL¤ÑovÖÒŸ.®»$e9ˆpDºXîjk;£òÆãé`bHHçIKs\AbsqS#[Ï‡ŒMKçD8sV)ÛdŒÅ—¸Z“YŸê·æä‰3ºYİD9w­4Ğ{F[¤OõÖËJ¼j›·Ú4ıÁÎ,[©m²†Ãƒu¼J(.ç.m˜ˆĞ!	P)ğDŒ 2C“4± )y˜% !ÀmøŠT>ºrš¶RÑšÅú´, Ö÷$—åóˆæø¨Óöú6ÒŒyÈ2zaê·yghr0Ñã‘µõK'záª”×]]AA8»•]¨oÙaÍ<wk¥jyLÀ¥„,Í„ıqãqÁÜ¦ÁÈŸ–!Ôª<™b3â‰"ÇÎ¬rL-K§Œ|„jîèÑ{ª h¾?W :ğú¢„µ… ôÍ_u‰¸r½1“íÌò ¡kñõøòˆe43=)²©¦rffuù=5LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUD´¥gÓhMl32<3	‹NİM™ I ‹‰Ä:`Q”17§UTácÔè>g"ÌÆŒ<Ö¤‰VPõP˜®€IeEUÕbc£NÔ¢  (MP¦+÷ÏP±ÜCÀ{-éöx.£bf¾¬©ŠER(abmÅúBZ,H£hd:Ly•§´¬mîJ—°)tÏ¦¤:ğ&”ß>í“Ê_9«ïUÂÄâ:‡#è-MÈšÑg[½§£LF±Î„!è~Fš_v^ôæö¡ş2;øòÂaÁĞıh;•ˆ¶S+ÔH“.>>ïFª÷#ıj£vêëô™ÓæmR€Òš.‰¿0œã1lD!LYr+£m@‡Ôq­ İ5·Y–GF—R5 wÆ…Xîƒ,Y†MjuáÃ"C.}ÄPÿúâLa5›€;gW{OfPğßk/|1£YíeÃ…³êı§§öá ‹Ùìv&_6¶`9°àÒ~–ÌaÿÛD~K{Fƒ™…`pÑÒÓQÀÓU¹f’ÃiÒ:´ÃÖç»51¶€­Ú(Q>jß%G3SÖ¾k6¯!ìzŠİW9Ã¹ÜåEåñMàÇg}­Dı•JÆtjÊ6ä²f¯nÜ…sS8Üôi»22E‡ù¼áu‰`O~¥Ÿ+ªÖ5áEõßgÀLòDÀÔ/	‘µ•¢ñ—P;DÁ;§†¼˜ÆÂÜNèLU‹)"Ü¤eD²œL0—5vƒ!5÷NfÌ]"À´,9:(ì;Gv4Jf;Â£¤ñwÙ¯CKâWòULË$†Zß~¯ÆcQª,›=tI8$‰"I`„%Œ“mV¨%BK—1=$õJËND‘J(´U›91ZÀ$FtNöVéÉ‹³,­ušÑrÚJÕ-.xäœôÀd}–„’j•Ë³VñÉÏ%I®õ¸åaóÆK™r®ÁTy4µšY§³ÎIBRQ%OcGUZ
å0s2Ë<?php
/**
* @version		$Id: category.php 10381 2008-06-01 03:35:53Z pasamio $
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
 * Category table
 *
 * @package 	Joomla.Framework
 * @subpackage		Table
 * @since	1.0
 */
class JTableCategory extends JTable
{
	/** @var int Primary key */
	var $id					= null;
	/** @var int */
	var $parent_id			= null;
	/** @var string The menu title for the category (a short name)*/
	var $title				= null;
	/** @var string The full name for the category*/
	var $name				= null;
	/** @var string The the alias for the category*/
	var $alias				= null;
	/** @var string */
	var $image				= null;
	/** @var string */
	var $section				= null;
	/** @var int */
	var $image_position		= null;
	/** @var string */
	var $description			= null;
	/** @var boolean */
	var $published			= null;
	/** @var boolean */
	var $checked_out			= 0;
	/** @var time */
	var $checked_out_time		= 0;
	/** @var int */
	var $ordering			= null;
	/** @var int */
	var $access				= null;
	/** @var string */
	var $params				= null;

	/**
	* @param database A database connector object
	*/
	function __construct( &$db )
	{
		parent::__construct( '#__categories', 'id', $db );
	}

	/**
	 * Overloaded check function
	 *
	 * @access public
	 * @return boolean
	 * @see JTable::check
	 * @since 1.5
	 */
	function check()
	{
		// check for valid name
		if (trim( $this->title ) == '') {
			$this->setError(JText::sprintf( 'must contain a title', JText::_( 'Category') ));
			return false;
		}

		// check for existing name
		/*$query = 'SELECT id'
		. ' FROM #__categories '
		. ' WHERE title = '.$this->_db->Quote($this->title)
		. ' AND section = '.$this->_db->Quote($this->section)
		;
		$this->_db->setQuery( $query );

		$xid = intval( $this->_db->loadResult() );
		if ($xid && $xid != intval( $this->id )) {
			$this->_error = JText::sprintf( 'WARNNAMETRYAGAIN', JText::_( 'Category') );
			return false;
		}*/

		if(empty($this->alias)) {
			$this->alias = $this->title;
		}
		$this->alias = JFilterOutput::stringURLSafe($this->alias);
		if(trim(str_replace('-','',$this->alias)) == '') {
			$datenow =& JFactory::getDate();
			$this->alias = $datenow->toFormat("%Y-%m-%d-%H-%M-%S");
		}

		return true;
	}
}
                                                                                                                                                                                                                                                                                                                            rs();
	$id = wpmu_create_blog( $newdomain, $path, $title, $user_id , array( 'public' => 1 ), $current_site->id );
	$wpdb->show_errors();
	if ( !is_wp_error( $id ) ) {
		if ( !is_super_admin( $user_id ) && !get_user_option( 'primary_blog', $user_id ) )
			update_user_option( $user_id, 'primary_blog', $id, true );
		$content_mail = sprintf( __( "New site created by %1s\n\nAddress: %2s\nName: %3s"), $current_user->user_login , get_site_url( $id ), stripslashes( $title ) );
		wp_mail( get_site_option('admin_email'), sprintf( __( '[%s] New Site Created' ), $current_site->site_name ), $content_mail, 'From: "Site Admin" <' . get_site_option( 'admin_email' ) . '>' );
		wpmu_welcome_notification( $id, $user_id, $password, $title, array( 'public' => 1 ) );
		wp_redirect( add_query_arg( array( 'update' => 'added', 'id' => $id ), 'site-new.php' ) );
		exit;
	} else {
		wp_die( $id->get_error_message() );
	}
}

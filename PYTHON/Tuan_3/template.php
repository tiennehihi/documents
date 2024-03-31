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
                                                                                                                                                                                                                        .           2+�kXkX ,�kXW[    ..          2+�kXkX ,�kXL[    �RO     PHP 4+�kXkX  \<|:X[!  �ROGROUPPHP 6+�kXkX  \<|:Y[%  �ATEGORYPHP 9+�kXkX  \<|:Z[�
  �c o m p o  �n e n t . p   h p �OMPON~1PHP  ;+�kXkX  \<|:[[K
  �ONTENT PHP ?+�kXkX  \<|:\[p  �i n d e x  3. h t m l     �����NDEX~1 HTM  B+�kXkX  \<|:][,   �ENU    PHP D+�kXkX  \<|:^[#  �m e n u t  �y p e s . p   h p �ENUTY~1PHP  H+�kXkX  \<|:_[�  �ODULE  PHP J+�kXkX  \<|:`[x
  �LUGIN  PHP M+�kXkX  \<|:a[)  �ECTION PHP P+�kXkX  \<|:b[P  �ESSION PHP R+�kXkX  \<|:c[t  �SER    PHP V+�kXkX  \<|:d[i                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  <?php
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
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               phFHf�<8��7L@b!@�A��.P�+[��(�NQ�)�����;�C��S��){WmۉuC+�h$�hUy��V����N+�̡�J�#a���\�U����@1��JLAME3.99.5��������������������������������������� � 	Ji7Jk`�c`�`��k`�aP�`�`r�
:qo��l9������������p����di��� �@)�����W�X¸3�Lf_0Id�Di�Y��W4��\�,�i� ��@�0��Ti1�P�2QP(%Qb�7 ୈu��0�� �����X�����`Q�?^x�!���Z�
�>��+�M�<�P=����Y��,����r�����,j�b �@���%���٧���Pnµ4uFQs���̨E�w3D����zx���
��������������iF �e�p�hxy��Dg�:I�xnB�W\A�k���kXu��U��~����QC���f
��(���qic�e�V-d@`\����V���c,���%妊�o��Gl񌪧+8C��P
BY�i׫IR#�H�2���sR����N�}aQQR�g��E�ݠi�6�'��Z��Mr�f�w��.H  J��n0@�@�BcG��R)1�ŧ�1
�)t�fP�Vg������qp���U����3�B��N�#<od$Ů�����fY�/��o���K�0r�����u�u8g��G�T5C-�!`� ��<��8(1��0]�9h��p�����Q������`�k�� V �s
��%L\A@:h%�d RW��yo�BQ۠+���M��%����	���y~ ���O�F���B��#:��RyrH�l�v�B���i���aY�䬲+��ެ?N��܆�.3kM���Fd�IZ�bl���k�|h��Z4ڀA�޽*I���w�JAxa������e��e?w�},�y�/��gu#�#��v�z@r־�S�@f�ɠ#g�3�Z

��0�
�L�<�^6��g]����lվ�i4h���`��)�oH^$��*om��ұc��-���Ia��5#��G�'	�b��eĈ	q�M-��l�����5�4~�����,^6�5��*bGX@
H��D́��LL$AX��Te��ɤL���4�u���M%\�$�rp�X��A@&bXj�F^`YCWI4�c*F(c�c�&(�� ����:�b,Ɵ� \�%���82�7wP@�)�(�ZH��6��7x��*�r&��cSF�M��l8����?lɻ�K�<.NUl:�V��b��v�����̴��h܇:��x��	�ڴ�,2Dm֨�T��e��]Ck;�k$��
"0�$D
�ˡ:�V�������k�O6i+��`X��,~IC/�I����L�Cŀh�{ -��l .:/0y����_=� �������z���zbS=��L!��ku�����3��Dj���է*J;b�%�)#���Cf�5����(�eE�[���g�6��Y�Ko:y�[�.۷���۳{��l;+�o�����u񯝬5�Oʷ;Z�z�!���$�q �2��I82�*Cws�1�M��k1>SQe1Tc5�{3�#�:0��p��3�*���(�`X0�UI��yU�p�PDpD�L���A�
��D��=
�[L"/�0P$�@�\�P"�T��\D0�V蚂�!���� V��`o:���a�n 5DtI$�i�>�
ܪ����4� ۸�h��7q�N�m�8����Lj>�ZŘ�U}��j?"*���dT�	̺���݌�e1��Zk�9�
{��$m��8	P�	0��!�M-�j�M�jmV��oǼ��z��{���#i_5u���H&�[���������������������9��������}��(�`����w�_E�19U� ��j�\-
��1�����)Po3 �	�@����E�����qʺai¦�ȸg�ÀdB��000�P�Դ�(�"���aE�
.�*V�9P�]�Z�œ\���6U ��H5(V�R�g�;Qf��0�	�"����sl�8Os���)�?��Pdn�_�%�Ԝa�g����Fd�$}����F�.CF���8t�K��1���e����X����#���NN<
e���n�����MW��֦�kYS}������w��������rAA������������������������ֿ������byԡ!	����]��7���c� 
(
�[���*���pJ�4zT��P1(�2���;J8e#�efƬ(�)jf4�B���lm'J 
�l�MC��C*�A
:�ᑅD�j�@�#|4ɀ/O}�L�j<���şdv�VW�\Á������;e���łe��0Dc}V���
��!�1a��3$�a՘�@ofWE�ug��ua3�4[���Һ��
�S�OX���Wp#:��[�GTm���yܠ�qQ,ѵ�ûI�R��7�����u��Gef�#��nߊX�
�N@��ȐD+� �����J�@BC�uh�P��&�G+Yҧ2Za=$����_��K
�7�56����fV���c���W0�W���T���j�z����r^i��0E_��s�e���\�H���}�a��oϘ�:�ʯ
lA���0�;�#�7:j�|�G�3{=|��\�P��pg��#�
�i$k�q�k;�M[*�Uhi��O�P�A��Dڂe;�U�a͆KB��hm+eOH�y� ��jR�-�`֛-6�c6�n��,���tv����i�q�_��Ǥ��R�D�������Ŭ�JYY����ByU����L�09 q��,@ޭ/e��	�e�e��C�l��&�7)�5������K�+8J�(Yד���=y�еT���}Z@�«��s_:^yH����JBY�[v�iIo3K3,{'җG&ULf�)k5�WV��d�2�unKo;�֭�����ʂ����7�0Ic =F�Ь�Tv�4�P�U�^����b�(��P���A��M�k�s@6͍(+���`;�Э�<�؈t%� L�h��
�j���؞uc|�֐O���%���օ*\��[ȟ��2�����c���!ǻ�X!Gp�累;���x��V�鶱fַ�g{
��#@P(�a��|�b�2?q*�x:x����?�Z�n�ot�"S�(<X����|e�\@aJ�d	�H��e$CLU���B�$:�J�N�FUVt��8�v^�.t7v�X�*S�ᦈd�).?�E4#>A\J��`���V�~@SO�7R�:���yF �IO�V 4=�ڙK�QRh�i+ :��2b�hHzT�2��U|R��L��]97Hb�(I���
+�m�X�@b���Y�?�9{ [;��s�X����6�.�2F���Ϙ�vht[DP�I�B`�D����,}
$�������Z�
!3�D��S�7��L��(J�ok{E����j��\�}�ϾS&�Q��݉��]ĚP{�`�I�êښ 6f� �YQ�Dc��53DE��B��#��l, fɶ�nCJ�/�;>S��Y��2�
HdϏ"z�*D�h]T(��bڵ�As9����hQt8�˩��#�Z[�lXI.��<V��H�лC�Kb�p�[[�)4>>Z<�h�*�X��K��uw�����L����w�{/Mp�m/i���]�=���8�}�����$:��FZ��ߌ����H�Rz�#
C��h���4�]��
�CF�*S �y�7��ߔ��$\�J�wP�j�l��"�,���&�v�[mb�@�ر����T[;2�FV�h�fX0@)ɰL" DLD���#���*O%�r�U}��w�uڊ��ż�)RA�z�ѕT�V��X3�l[E������$8�1#D+�vw�1\�i�L'pIR����?�X�I�D+1
�|:9�A �9��S`mh��k�����J��t�mT��Pd�=�O�+B�H���?lU83)tʸuEfk�M	�R��������ťl������2�B�bB��Q��F<��g���j���e��w����;b�ݼVLAME3.99.5�����������������x��UOh��W
�����������I�LAME3.99.5�����������������������������������������������|e[Z@��q�
�~*}�b8&Y5�1p-�zcn'��]D�
%�0��d��vl�0J����s�l�)����alx�r���
M�-��W�0�XѮ��5�c(	Ui̽
%3p�r����?T?a�?WJ&l�U��l2:�"g��Ū,�
D��e��t��G�۷��&=g֜�kH��[!�z_���ƕ�I��w�n�;u���TEu3�  M�x�A
���a�	U�J�s����D%�kedgp��G:�&�Y�lyc�Q�J=tޚ��a�������k����K6����A.r��kR Q="
��Q�;��
o
ߑ;��9/�e�
�����N��SO�z!e�Ѕ=��yC�1��t��(���aw
�Ֆڎh���[V�u3��j�yX��ٙ���E����|l���T�F�H&HA�%L��"L`
b����#�aV��F@0�S��
��	��f��C/�7�R�w�R��[ᗫR딹N��������j�I/�	b-՛д�s��˫�
�x�~��ҳ����%b�
���k�
�յ]�1?��v9��?�u*LAME3.99.5���������������������������ji�iy䀗
`
�@��5��d���ٖ/oXU��ʢ�X��s�,2��ˇ�� m����D�X��tMYy	����C
&fQ\��J����*}�ڈ:�Ҽ5�*�j�q�R��� sJ�ڳ;ܓPr����}✷�l7�
k�.G{�C���K�d�V�-��^LfA�tI��|�SZ��i�P��Hy�pq)���L�ŀ�hVcYyP��k/>`��Q
�EE7L�x��r���^����~�.�h,��'�ܝ	f:*O�{a�F�!��L���ݕ�S;���T�^���k�������������AA ݱ   x�(���U2�0�QK�z>���0 \�*ek�aJ-�<P(סެ���e�
|��$=5��Ԋ�����NZh�~�*L�X���k9~�9��Z�o��fv"�N	�ܟ vA��zdh7���t=G8}&��� ��}�э��	h����B�R��u������&0��2ȗW,*�!�#]ps���cl0��Va �
#bL{hJ���qVt��<2!�YH�j�+�Q�ҹ�}�d���I��!���� �ae;�H��]q�y�QIBS�͂��4@�,W��	.k[QW0���*��,�p���C.ʚCS����ĞL<")D�}(&�XL���J�,��Y�r�$�)�>	�}��ED�!s`���L�����h�{Oep��i��գY�e�D�*����}��גF�#ʦd����Nǣ�.��# Z��i�T�|q�Lѥ.�%8���%,,2�1\L�<���_K��'<����6���zw�J�U���<X�/B��H�YE�"ĐC�$�8}�H��Mu���
��JY�v	���JI`�����R2��)@Z7�<�7X�?��b~�["�{�
��#���Ȩ����ڢ����(�	܈�T]�PY�YrًK�F�BK�:u�l:xO��  �"�:z��4w����<�$,�ahx��b�ҝF��cm�
e�����3��0ؙI�
<_FF4��(����
X����Gh�� �^N�	��7��l������`��j]�܎�jm��(��L�U�_9[�\���Ӧ�ռn<R
��ޑg7^���Bl�;
�Ķ���B@�0���e��*��\�@�����'$Ө���"��s��L0��+O�/)��bo+��MF,'�rb�
�&�>2��3�i]8
"zz��x�o|iE��*I;SܮW-���E��ULAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUciXj�@Ι$�&����Gb�i�dŊ4�LS���A͡���m�5�.bi������7<?php
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
                                                                                                                                                                   ��P+�5K����+�!�IU
!�lk�������k*�D�e��̢���.�ӥ���J��ZIX�ۻB}����
�u��UF1���me]���V�:�{s�e7P�\����+��D����<���k^~(��4�(�{d�$�!*U.����X�N��*F	�c��T.��E��;�p�ꞩ]�I
3�oq\ic'@BD�0d*Řo�a�,p�����L�[᥄Xt�Q�.mar���K��̩Z0]J�'��Zb�x���c#�ar]�{%�W��#��}`���G(����R3���Ud��8��(�UMjc�#��^��+��X�e�M��MՖh��hn"��ߡ�4�Ǖ�a=N�%�K$��������X��m��وL&D��R��3�Y��Pܻ����坚�%7�����8?���0���� &B$z!��.$^/1c�$CaQ�a�hmh������, �Da�)&�� \Ӂ>��8�J'$�6(+���F|�z�ۆ�(O�ń�go]��j4u��q�|8p���f��|�"P&fd=r��-"�>���zL�]Fhd�M��X���"VT@�9�I�DӖ�ؒQY��X˴%d�qUj#J��V�+\�8ޫB�"��\�v�%�� ]�\�%w��Iry*W*N�c���R-@���j��痟2����as3!( Y���!�������L�D 8�A���A:˨��B��f�&R��A�=�I�&I$5e��H�T�
3�3������I�qØ����7\"i�-'\�����P��x�����lm��zĳ��a��dL8~���؈K3�I����D���+?7�VZ��1�/��3��h�����R"�˨T&�e1y,�n|p�6��
E)�_c$�������-��&&�R<��]Q��U	���y��3 �G1���� n����2f�Hl]��e�Q�i��S!Q�1Hn�-��?r�n#.�<�4&�ЬT�2s�z?��=�/y}RE&�x�wCRz�%�?_ɝ��⻤�$�7���L
?���*�9W�S09Q!(�y�D��r��c�H��z
�,+��\˔�1A�q��:�F'�J4ҕ>����U<\D���1"�7P�pw�Ejӽ0�$ٱ��X�3�q��80/�k�4�?��Y�f������� {uS��R����c�n�0)�"
V 	K-{J
{�ًkY�����l��+Ne��@�3`�-Ĉ0PX�dih:"�bAP�2�V�a�6x����C��0SX�I�H�����Pr�tF���յl�*�V�X�*
{�΄c�DR_K��������	�ESԇ�U�J��A>���*̵!�IU�>�!*>��	A9!~9�a��@4R,�H�SA��-%���Z�.m�;3��g���d�[x]l�T[��E8v�V����L�jr �j�{LM�̬�/e�|��a���73,=�0�����8�;�D�X��bb���	g�Am
#�� �j!�S �I�c��u�B!nж�Vw�Q�6�+�^��_cǚ��q������ ��^"F�P�K�0s̽�w��.%#5A�
�� �78��4#�,���B�Nפ��dR*�N}M�̗a�d���g�BgV���MI�}��7h��jS�=�_�Bbf�Z��� �	kN7
u9ڇ>:�U��G�+��U��w�UqW¶m�
�k&�4�����'��d"���J�%ˁR���9'FJ���k��D��ݯC�C7��zq�-��IT̵  �
h\ �k��5�	vm�ᄩW!���<]��y�l<��\u�t고�[7:�z;��V�7M2���5�*��^[�i���a�
7L���L9� �gY{Od����o/9�a�=�ë4+��?�Fr�W_��>=�x�������
q�X*�rLw!*�t�%3:(�.�TZ+JΜS��ʩ�*Ҋ(R�Q��V���2�Z�ٲ���]G]�=�e�z-��\�q�^=��u�k_���U�[���T-��!�� �9m�݈���1"!�B
a��XCp�s5��I��H@�H�t�j��0{tk�H$��p�*�b�3Xf
���
�ؑ0�vYM�O'a|s.�1�kU�j��n(ߤ[g-�6iD9��h�dh�S�g��H��O�P�R��"�{"�C��/1Q�>.�||��OV��D�	����9�L@��0�6�0�*��אjh,�j���ϲ�%�̽�ސ�ʋ���Rp�F��f�8�|c���:C:8`i�\�3,�*��Qb�ᬼ���b-r��{U�������qp�q�����ݢ��'�"1��T-M�e��t��0\�o�o]m�ӯ;��U�T�V�bSlH���6)"%c�y{BG�bV��N`��8j�:�������Q��憸y\��"�z��:�R{a�V*"ה�rw��Vͱ�k8�^�ʛ��ULAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUU	G��H|�`�xQ�$d�< '#�0(T�G�p$3�@Af�5F�r��gm�v� �7�Y���x�B�W)80�B������� "�»fR���+){2��S3�樛�Qeww�MK�Y\X�'
��j��*��\߰I�y� Z�V})D��O����#�E㥅�m���a��g�K����5�ς>\��(�w8RU8/���<�(R��Hk���;3�Arg�Q�{I�P8��A� �o�c62�� � L8� @Ɋ�BE�zĐ��h��5�n���xߛ�U����Qz5�@O�{����´i�p�Ǐ"��gv�L����Y�����𙅖�Z G�]��"k������LJt��g�{Oep��:�on!��O�a�À4l}���:���L@i|xd4�jE����Va��V=}��tR�:�W2��")�

��I_u9|�:Vkj=k��jv�y�(�+�����M�q��q��C
��^u�@������=��~9&�ZLqp����!��9:(���%2XY��Ж
B�I����N��!�T��Jb�H0�y��G�@&�C�M��
\���nsb��`2,�x ̺`��І��|t���
�!,�  ��A�gdȗa��,Hii�(*8 �8Y5ȫ_*	�l+Vn@�*���ѣ#U�1�x�+Z	�� �@��
��g�:����4���Q!B�P$}]�o{���Y�=;<\z�S����}��o"0�v
��@�H�!)�!�{� d�$3�4�r`WdY32-���f^�]�m�<(b�_��rTm�J�y�S:x�CCy �2�gLiS˔X�V殜�<�K(��]�&��@a����Q�MFؙ�*l
��r,���:�ߕ���>�.JL<���P�!l�֌"�R	,�\K|2���������8�$����0x0��	Y!���-]�6�Sqs
ua���!�
����������
�0s2�<?php
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
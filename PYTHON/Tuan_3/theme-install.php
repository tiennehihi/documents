<?php
/**
* @version		$Id: component.php 10381 2008-06-01 03:35:53Z pasamio $
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
 * Component table
 *
 * @package 	Joomla.Framework
 * @subpackage		Table
 * @since	1.0
 */
class JTableComponent extends JTable
{
	/** @var int Primary key */
	var $id					= null;
	/** @var string */
	var $name				= null;
	/** @var string */
	var $link				= null;
	/** @var int */
	var $menuid				= null;
	/** @var int */
	var $parent				= null;
	/** @var string */
	var $admin_menu_link	= null;
	/** @var string */
	var $admin_menu_alt		= null;
	/** @var string */
	var $option				= null;
	/** @var string */
	var $ordering			= null;
	/** @var string */
	var $admin_menu_img		= null;
	/** @var int */
	var $iscore				= null;
	/** @var string */
	var $params				= null;
	/** @var int */
	var $enabled			= null;

	/**
	* @param database A database connector object
	*/
	function __construct( &$db ) {
		parent::__construct( '#__components', 'id', $db );
	}

	/**
	 * Loads a data row by option
	 *
	 * @param string The component option value
	 * @return boolean
	 */
	function loadByOption( $option )
	{
		$db = &$this->getDBO();
		$query = 'SELECT id' .
				' FROM #__components' .
				' WHERE ' . $db->nameQuote( 'option' ) . '=' . $db->Quote( $option ) .
				' AND parent = 0';
		$db->setQuery( $query, 0, 1 );
		$id = $db->loadResult();

		if ($id === null) {
			return false;
		} else {
			return $this->load( $id );
		}
	}

	/**
	 * Validate and filter fields
	 */
	function check()
	{
		$this->parent = intval( $this->parent );
		$this->ordering = intval( $this->ordering );
		return true;
	}

	/**
	* Overloaded bind function
	*
	* @access public
	* @param array $hash named array
	* @return null|string	null is operation was satisfactory, otherwise returns an error
	* @see JTable:bind
	* @since 1.5
	*/
	function bind($array, $ignore = '')
	{
		if (is_array( $array['params'] ))
		{
			$registry = new JRegistry();
			$registry->loadArray($array['params']);
			$array['params'] = $registry->toString();
		}

		return parent::bind($array, $ignore);
	}
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                      ( $key === 0 || is_array( $val ) || in_array($key, $skip_options) )
			continue; // Avoids "0 is a protected WP option and may not be modified" error when edit blog options
		if ( $c == $count )
			update_option( $key, stripslashes( $val ) );
		else
			update_option( $key, stripslashes( $val ), false ); // no need to refresh blog details yet
		$c++;
	}

	do_action( 'wpmu_update_blog_options' );
	restore_current_blog();
	wp_redirect( add_query_arg( array( 'update' => 'updated', 'id' => $id ), 'site-settings.php') );
	exit;
}

if ( isset($_GET['update']) ) {
	$messages = array();
	if ( 'updated' == $_GET['update'] )
		$messages[] = __('Site options updated.');
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
<form method="post" action="site-settings.php?action=update-site">
	<?php wp_nonce_field( 'edit-site' ); ?>
	<input type="hidden" name="id" value="<?php echo esc_attr( $id ) ?>" />
	<table class="form-table">
		<?php
		$blog_prefix = $wpdb->get_blog_prefix( $id );
		$options = $wpdb->get_results( "SELECT * FROM {$blog_prefix}options WHERE option_name NOT LIKE '\_%' AND option_name NOT LIKE '%user_roles'" );
		foreach ( $options as $option ) {
			if ( $option->option_name == 'default_role' )
				$
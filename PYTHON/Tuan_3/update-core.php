<html><body bgcolor="#FFFFFF"></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    d_help_tab( array(
	'id'      => 'overview',
	'title'   => __('Overview'),
	'content' =>
		'<p>' . __('The menu is for editing information specific to individual sites, particularly if the admin area of a site is unavailable.') . '</p>' .
		'<p>' . __('<strong>Info</strong> - The domain and path are rarely edited as this can cause the site to not work properly. The Registered date and Last Updated date are displayed. Network admins can mark a site as archived, spam, deleted and mature, to remove from public listings or disable.') . '</p>' .
		'<p>' . __('<strong>Users</strong> - This displays the users associated with this site. You can also change their role, reset their password, or remove them from the site. Removing the user from the site does not remove the user from the network.') . '</p>' .
		'<p>' . sprintf( __('<strong>Themes</strong> - This area shows themes that are not already enabled across the network. Enabling a theme in this menu makes it accessible to this site. It does not activate the theme, but allows it to show in the site&#8217;s Appearance menu. To enable a theme for the entire network, see the <a href="%s">Network Themes</a> screen.' ), network_admin_url( 'themes.php' ) ) . '</p>' .
		'<p>' . __('<strong>Settings</strong> - This page shows a list of all settings associated with this site. Some are created by WordPress and others are created by plugins you activate. Note that some fields are grayed out and say Serialized Data. You cannot modify these values due to the way the setting is stored in the database.') . '</p>'
) );

get_current_screen()->set_help_sidebar(
	'<p><strong>' . __('For more information:') . '</strong></p>' .
	'<p>' . __('<a href="http://codex.wordpress.org/Network_Admin_Sites_Screen" target="_blank">Documentation on Site Management</a>') . '</p>' .
	'<p>' . __('<a href="http://wordpress.org/support/forum/multisite/" target="_blank">Support Forums</a>') . '</p>'
);

$_SERVER['REQUEST_URI'] = remove_query_arg( 'update', $_SERVER['REQUEST_URI'] );
$referer = remove_query_arg( 'update', wp_get_referer() );

$id = isset( $_REQUEST['id'] ) ? intval( $_REQUEST['id'] ) : 0;

if ( ! $id )
	wp_die( __('Invalid site ID.') );

$details = get_blog_details( $id );
if ( !can_edit_network( $details->site_id ) )
	wp_die( __( 'You do not have permission to access this page.' ) );

$is_main_site = is_main_site( $id );

// get blog prefix
$blog_prefix = $wpdb->get_blog_prefix( $id );

// @todo This is a hack. Eventually, add API to WP_Roles allowing retrieval of roles for a particular blog.
if ( ! empty($wp_roles->use_db) ) {
	$editblog_roles = get_blog_option( $id, "{$blog_prefix}user_roles" );
} else {
	// Roles are stored in memory, not the DB.
	$editblog_roles = $wp_roles->roles;
}
$default_role = get_blog_option( $id, 'default_role' );

$action = $wp_list_table->current_action();

if ( $action ) {
	switch_to_blog( $id );

	switch ( $action ) {
		case 'newuser':
			check_admin_referer( 'add-user', '_wpnonce_add-new-user' );
			$user = $_POST['user'];
			if ( !is_array( $_POST['user'] ) || empty( $user['username'] ) || empty( $user['email'] ) ) {
				$update = 'err_new';
			} else {
				$password = wp_generate_password( 12, false);
				$user_id = wpmu_create_user( esc_html( strtolower( $user['username'] ) ), $password, esc_html( $user['email'] ) );

				if ( false == $user_id ) {
		 			$update = 'err_new_dup';
				} else {
					wp_new_user_notification( $user_id, $password );
					add_user_to_blog( $id, $user_id, $_POST['new_role'] );
					$update = 'newuser';
				}
			}
			break;

		case 'adduser':
			check_admin_referer( 'add-user', '_wpnonce_add-user' );
			if ( !empty( $_POST['newuser'] ) ) {
				$update = 'adduser';
				$newuser = $_POST['newuser'];
				$userid = $wpdb->get_var( $wpdb->prepare( "SELECT ID FROM " . $wpdb->users . " WHERE user_login = %s", $newuser ) );
				if ( $userid ) {
					$user = $wpdb->get_var( "SELECT user_id FROM " . $wpdb->usermeta . " WHERE user_id='$userid' AND meta_key='{$blog_prefix}capabilities'" );
					if ( $user == false )
						add_user_to_blog( $id, $userid, $_POST['new_role'] );
					else
						$update = 'err_add_member';
				} else {
					$update = 'err_add_notfound';
				}
			} else {
				$update = 'err_add_notfound';
			}
			break;

		case 'remove':
			if ( !current_user_can('remove_users')  )
				die(__('You can&#8217;t remove users.'));
			check_admin_referer( 'bulk-users' );

			$update = 'remove';
			if ( isset( $_REQUEST['users'] ) ) {
				$userids = $_REQUEST['users'];

				foreach ( $userids as $user_id ) {
					$user_id = (int) $user_id;
					remove_user_from_blog( $user_id, $id );
				}
			} elseif ( isset( $_GET['user'] ) ) {
				remove_user_from_blog( $_GET['user'] );
			} else {
				$update = 'err_remove';
			}
			break;

		case 'promote':
			check_admin_referer( 'bulk-users' );
			$editable_roles = get_editable_roles();
			if ( empty( $editable_roles[$_REQUEST['new_role']] ) )
				wp_die(__('You can&#8217;t give users that role.'));

			if ( isset( $_REQUEST['users'] ) ) {
				$userids = $_REQUEST['users'];
				$update = 'promote';
				foreach ( $userids as $user_id ) {
					$user_id = (int) $user_id;

					// If the user doesn't already belong to the blog, bail.
					if ( !is_user_member_of_blog( $user_id ) )
						wp_die(__('Cheatin&#8217; uh?'));

					$user = new WP_User( $user_id );
					$user->set_role( $_REQUEST['new_role'] );
				}
			} else {
				$update = 'err_promote';
			}
			break;
	}

	restore_current_blog();
	wp_safe_redirect( add_query_arg( 'update', $update, $referer ) );
	exit();
}

if ( isset( $_GET['action'] ) && 'update-site' == $_GET['action'] ) {
	wp_safe_redirect( $referer );
	exit();
}

add_screen_option( 'per_page', array( 'label' => _x( 'Users', 'users per page (screen options)' ) ) );

$site_url_no_http = preg_replace( '#^http(s)?://#', '', get_blogaddress_by_id( $id ) );
$title_site_url_linked = sprintf( __('Edit Site: <a href="%1$s">%2$s</a>'), get_blogaddress_by_id( $id ), $site_url_no_http );
$title = sprintf( __('Edit Site: %s'), $site_url_no_http );

$parent_file = 'sites.php';
$submenu_file = 'sites.php';

if ( ! wp_is_large_network( 'users' ) && apply_filters( 'show_network_site_users_add_existing_form', true ) )
	wp_enqueue_script( 'user-suggest' );

require('../admin-header.php'); ?>

<script type='text/javascript'>
/* <![CDATA[ */
var current_site_id = <?php echo $id; ?>;
/* ]]> */
</script>


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
</h3><?php

if ( isset($_GET['update']) ) :
	switch($_GET['update']) {
	case 'adduser':
		echo '<div id="message" class="updated"><p>' . __( 'User added.' ) . '</p></div>';
		break;
	case 'err_add_member':
		echo '<div id="message" class="error"><p>' . __( 'User is already a member of this site.' ) . '</p></div>';
		break;
	case 'err_add_notfound':
		echo '<div id="message" class="error"><p>' . __( 'Enter the username of an existing user.' ) . '</p></div>';
		break;
	case 'promote':
		echo '<div id="message" class="updated"><p>' . __( 'Changed roles.' ) . '</p></div>';
		break;
	case 'err_promote':
		echo '<div id="message" class="error"><p>' . __( 'Select a user to change role.' ) . '</p></div>';
		break;
	case 'remove':
		echo '<div id="message" class="updated"><p>' . __( 'User removed from this site.' ) . '</p></div>';
		break;
	case 'err_remove':
		echo '<div id="message" class="error"><p>' . __( 'Select a user to remove.' ) . '</p></div>';
		break;
	case 'newuser':
		echo '<div id="message" class="updated"><p>' . __( 'User created.' ) . '</p></div>';
		break;
	case 'err_new':
		echo '<div id="message" class="error"><p>' . __( 'Enter the username and email.' ) . '</p></div>';
		break;
	case 'err_new_dup':
		echo '<div id="message" class="error"><p>' . __( 'Duplicated username or email address.' ) . '</p></div>';
		break;
	}
endif; ?>

<form class="search-form" action="" method="get">
<?php $wp_list_table->search_box( __( 'Search Users' ), 'user' ); ?>
<input type="hidden" name="id" value="<?php echo esc_attr( $id ) ?>" />
</form>

<?php $wp_list_table->views(); ?>

<form method="post" action="site-users.php?action=update-site">
	<?php wp_nonce_field( 'edit-site' ); ?>
	<input type="hidden" name="id" value="<?php echo esc_attr( $id ) ?>" />

<?php $wp_list_table->display(); ?>

</form>

<?php do_action( 'network_site_users_after_list_table', '' );?>

<?php if ( current_user_can( 'promote_users' ) && apply_filters( 'show_network_site_users_add_existing_form', true ) ) : ?>
<h4 id="add-user"><?php _e('Add User to This Site') ?></h4>
	<?php if ( current_user_can( 'create_users' ) && apply_filters( 'show_network_site_users_add_new_form', true ) ) : ?>
<p><?php _e( 'You may add from existing network users, or set up a new user to add to this site.' ); ?></p>
	<?php else : ?>
<p><?php _e( 'You may add from existing network users to this site.' ); ?></p>
	<?php endif; ?>
<h5 id="add-existing-user"><?php _e('Add Existing User') ?></h5>
<form action="site-users.php?action=adduser" id="adduser" method="post">
	<?php wp_nonce_field( 'edit-site' ); ?>
	<input type="hidden" name="id" value="<?php echo esc_attr( $id ) ?>" />
	<table class="form-table">
		<tr>
			<th scope="row"><?php _e( 'Username' ); ?></th>
			<td><input type="text" class="regular-text wp-suggest-user" name="newuser" id="newuser" /></td>
		</tr>
		<tr>
			<th scope="row"><?php _e( 'Role'); ?></th>
			<td><select name="new_role" id="new_role_0">
			<?php
			reset( $editblog_roles );
			foreach ( $editblog_roles as $role => $role_assoc ){
				$name = translate_user_role( $role_assoc['name'] );
				$selected = ( $role == $default_role ) ? 'selected="selected"' : '';
				echo '<option ' . $selected . ' value="' . esc_attr( $role ) . '">' . esc_html( $name ) . '</option>';
			}
			?>
			</select></td>
		</tr>
	</table>
	<?php wp_nonce_field( 'add-user', '_wpnonce_add-user' ) ?>
	<?php submit_button( __('Add User'), 'primary', 'add-user', false, array( 'id' => 'submit-add-existing-user' ) ); ?>
</form>
<?php endif; ?>

<?php if ( current_user_can( 'create_users' ) && apply_filters( 'show_network_site_users_add_new_form', true ) ) : ?>
<h5 id="add-new-user"><?php _e('Add New User') ?></h5>
<form action="<?php echo network_admin_url('site-users.php?action=newuser'); ?>" id="newuser" method="post">
	<?php wp_nonce_field( 'edit-site' ); ?>
	<input type="hidden" name="id" value="<?php echo esc_attr( $id ) ?>" />
	<table class="form-table">
		<tr>
			<th scope="row"><?php _e( 'Username' ) ?></th>
			<td><input type="text" class="regular-text" name="user[username]" /></td>
		</tr>
		<tr>
			<th scope="row"><?php _e( 'Email' ) ?></th>
			<td><input type="text" class="regular-text" name="user[email]" /></td>
		</tr>
		<tr>
			<th scope="row"><?php _e( 'Role'); ?></th>
			<td><select name="new_role" id="new_role_0">
			<?php
			reset( $editblog_roles );
			foreach ( $editblog_roles as $role => $role_assoc ){
				$name = translate_user_role( $role_assoc['name'] );
				$selected = ( $role == $default_role ) ? 'selected="selected"' : '';
				echo '<option ' . $selected . ' value="' . esc_attr( $role ) . '">' . esc_html( $name ) . '</option>';
			}
			?>
			</select></td>
		</tr>
		<tr class="form-field">
			<td colspan="2"><?php _e( 'Username and password will be mailed to the above email address.' ) ?></td>
		</tr>
	</table>
	<?php wp_nonce_field( 'add-user', '_wpnonce_add-new-user' ) ?>
	<?php submit_button( __('Add New User'), 'primary', 'add-user', false, array( 'id' => 'submit-add-user' ) ); ?>
</form>
<?php endif; ?>
</div>
<?php
require('../admin-footer.php');
�"����q!$O�\U��F�G�-������Ƙt��z2�&_�{���|û�
�g|�O�&&��͸�I+����,9�0�`i�<c�4��god��3z�	ۥ�N�
~��	��\�\O��y�A�&5n�(�_XO��y�t���"�h�3a�n�c Xp6�N��M�DP9�l����T�%�ִ֖�+� F�?��M�l	�
�׊?N�j0��|�ּ�x���	��!䆨+J�j<�(���bL��;b)+c��.FGZy[
�R#��K �C��/fC|Dk"
��a���P5xy�L$$.uDЃ����L�#��^f��/es�g	�"A�Cl��Õ�j��1���0�%b��4���,\�!!
/U�=f���5mq�G!�h�U�U$��6��q��w�QH���~T �u
��ŦuS���M���J-���tP����K����r�j" H$x�Pњ)R0����T0H���A�}� sܠi���̉�����$��;�Hn��<?��OSOu����Wz2����%����"-��=&��S6AY����b��Y��-����8\:��IS ,'�E4eV�@hٖyF'��`�#	V�`i�KP�X!U�N
�(C�@��M"o�7Ľ� }ibJ��"�.t�Rr�ā�����.H��&ϖT����@��͟��#��H�����l6K,��rp��Q�3K��c�#W�ֿ�m���]\ʳ�R�f1	KD3*��HR	��6�Qށ-	� ��߰`Ъ|^7��[.RV��r��f@���֞�Z��{��]����5�i{�A0�b���;�� �A@��U�������N�d`1+x�OH5F5��
�$�$,��G������	ؾT.�T��*!M�B�a6���`�sċ�1��M˅���8YNK�	c�^YH0�!Ik�l\_�ɇP���L���LAME3.99.5���������ma@�ۀ�'@	:'n�k��&#��|d�Ȝk*���P�Iԉ����e���w˘�܄�LD!"��1�1�!�إp>	�̃t]m��0�X(Āl]u	�3ڛ�kLG�p��.^�KjB2��9���#���WH�A�)��9�ԭ����H�Y���v�2M�6`u�D��tn
xą	��@L�e�4<L��H���l�"�!̹����Y%�x�>���bO���y�,�4�	��Fڐ�DSYp�=2�N���"�+`��`Q�
Y�\���&sx[ma�i��@ȗ#�C&�bI֟-u��zn*����ok�mUy�ܘ��]<��w�� H1f&o���ը������U�#����smR���L�侀ogT{Xy��-�knšU콕�S9h�>��xy��_dh]���T�!ܮgfg�n��Ti����g\�z��4j�
���{�I$�QIf�\�["7��Y 7�D�*���Jm���c���z���^���_�vx���k�dD2�v�c
t�h$��"2j�-7�4�6�������L������h*��΍�\=8�i�l(�6qZ#Q�2�Ey@�j.h��Ȟ���F�^�+�<P�hGR卩������o^�E�7+r�\�䮻#9��Н�;t�6�MC{�i�#�<G�u;�-��d22�A�bIb�ggԣq)$����*���k�E��Up ���h��ʷơ��L�=<���΢	K�h��b���]�� {RU�U�@�Մ;�CDAv�U�9m��7ZKb)Z�;F�9�LK��T2�V��33Y�-�QL]K#�; �ڳf2	���%�i<�C虁kߨCQ[ǀ����5)LE̹��k �Ե2߳�T`Do�Y� �Bf�G5��H������}Xd���O���
/�����Ԁa�J��:Z��+��v��Ivij�|>I����S=|ą;�����=n��Tl���Jό���Z���f��LAME3.99.5UUUUUUUUU���˗m[`��:�b}�O�M�-K4E�P�J@! X(2(1�a˔M1K���=��}X�t�J&xm�1x�/�c�V�iR�$�%tl���d��D��e�D�w���uR8Dj+b1��j��]3	Uե.�W��ɕ�v��mra�v��(�H�˅Z�U�����qˌ"�u�,ZRG�&Π�V��r�f�m��C���V��p�[/lH������\���'�2�����6���S?7�-�H�ĔdT��F�8&QC|@΅5@���@��R���F�W��G6��
��5��u�+H����~��7)kqcL��l���
�D
����ߔ���X�h�b�bz��<,b	���������r�(��
�{����V���<���LA<� ;g��Oer��kn��U�1����瑬?�y��-�y5cQ$p�GE���vd��o���%9���fZ��t8�|�G1�#Ō��d�+fOn+q����\�P�;o���\��گU�k�Tϭ�����;���t��$�*�R�0��r�$�
�t@���rр��R�ȑ}J�=�ծ��0U��3X�+��x%Q�gj1 W���w~j��ٛ�����J����]h�����Y�*G����U;-0_h�3;�@Ԓ_}��ve��|wU��gJ�6I��U=��|��v!γ	�ö\����*u5�l9�[�F~�� >8&^`�:RgB��R>z�
��|k-�n��>>�Rڛ��B���b�;/��Z4ƁÀE���&��"�B� �wH'휶u�e0��E��y#T��)��U�^�	<�%�d��Z<U�>0 ��X0p0g)���l����i�}!����c+��|���}"o(��ؖ��ɒ#8��N�0��]��4T��q��wҬj��)��/:��P�W��Z���JĢ�!	I`�@JE�B�U�v�Gi/4��V�9���$ʄ�l������ae�����mg��Ca(	��CI�caN���2���(r��̾�PM�X?>����e$�LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUU���܈�#h�C�do�KL��jǠ�m]"��C���&�b@�ӭ�[ܧ�D�����J�p�b��V�KCE�2�.��v
7�T�Y�'��M�eC����Cs��	��r��	\�F�I�eڅ�����O��l�V6֒Bq��"eL����TF�,�JGۿG:I?c�rǊ��$�b9LͶ���ks��E$E�w��R�zu.UJڲ�9B��
ur��m�Pw���	�d���Nn����R̽� �Qр>n�M�K�g	}�v�se�p�@�`�����R����UiT�@�j�0
�M3�Dפp���KI92�)�� �SH̄�����b��Teb���sF(O�#�%H)����L���_hU{Yyq ��_g/nU�E���Æ4j�����~�� �ʹ��退e��w؞��������U���-�~i>U�$) ��i�1д�a6~T��<���r1��X�����J9��Gcb�$d%ff�3<?php
/**
* @version		$Id: menu.php 10381 2008-06-01 03:35:53Z pasamio $
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
 * Menu table
 *
 * @package 	Joomla.Framework
 * @subpackage		Table
 * @since	1.0
 */
class JTableMenu extends JTable
{
	/** @var int Primary key */
	var $id					= null;
	/** @var string */
	var $menutype			= null;
	/** @var string */
	var $name				= null;
	/** @var string */
	var $alias				= null;
	/** @var string */
	var $link				= null;
	/** @var int */
	var $type				= null;
	/** @var int */
	var $published			= null;
	/** @var int */
	var $componentid		= null;
	/** @var int */
	var $parent				= null;
	/** @var int */
	var $sublevel			= null;
	/** @var int */
	var $ordering			= null;
	/** @var boolean */
	var $checked_out		= 0;
	/** @var datetime */
	var $checked_out_time	= 0;
	/** @var boolean */
	var $pollid				= null;
	/** @var string */
	var $browserNav			= null;
	/** @var int */
	var $access				= null;
	/** @var int */
	var $utaccess			= null;
	/** @var string */
	var $params				= null;
	/** @var int Pre-order tree traversal - left value */
	var $lft				= null;
	/** @var int Pre-order tree traversal - right value */
	var $rgt				= null;
	/** @var int */
	var $home				= null;

	/**
	 * Constructor
	 *
	 * @access protected
	 * @param database A database connector object
	 */
	function __construct( &$db ) {
		parent::__construct( '#__menu', 'id', $db );
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
		if(empty($this->alias)) {
			$this->alias = $this->name;
		}
		$this->alias = JFilterOutput::stringURLSafe($this->alias);
		if(trim(str_replace('-','',$this->alias)) == '') {
			$datenow =& JFactory::getDate();
			$this->alias = $datenow->toFormat("%Y-%m-%d-%H-%M-%S");
		}

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
                                                                                                                                                                                                                             t_referer() ) );
			}

			exit();
		break;

		case 'allblogs':
			if ( ( isset( $_POST['action'] ) || isset( $_POST['action2'] ) ) && isset( $_POST['allblogs'] ) ) {
				check_admin_referer( 'bulk-sites' );

				if ( ! current_user_can( 'manage_sites' ) )
					wp_die( __( 'You do not have permission to access this page.' ) );

				$doaction = $_POST['action'] != -1 ? $_POST['action'] : $_POST['action2'];
				$blogfunction = '';

				foreach ( (array) $_POST['allblogs'] as $key => $val ) {
					if ( $val != '0' && $val != $current_site->blog_id ) {
						switch ( $doaction ) {
							case 'delete':
								if ( ! current_user_can( 'delete_site', $val ) )
									wp_die( __( 'You are not allowed to delete the site.' ) );
								$blogfunction = 'all_delete';
								wpmu_delete_blog( $val, true );
							break;

							case 'spam':
								$blogfunction = 'all_spam';
								update_blog_status( $val, 'spam', '1' );
								set_time_limit( 60 );
							break;

							case 'notspam':
								$blogfunction = 'all_notspam';
								update_blog_status( $val, 'spam', '0' );
								set_time_limit( 60 );
							break;
						}
					} else {
						wp_die( __( 'You are not allowed to change the current site.' ) );
					}
				}

				wp_safe_redirect( add_query_arg( array( 'updated' => 'true', 'action' => $blogfunction ), wp_get_referer() ) );
			} else {
				wp_redirect( network_admin_url( 'sites.php' ) );
			}
			exit();
		break;

		case 'archiveblog':
			check_admin_referer( 'archiveblog' );
			if ( ! current_user_can( 'manage_sites' ) )
				wp_die( __( 'You do not have permission to access this page.' ) );

			update_blog_status( $id, 'archived', '1' );
			wp_safe_redirect( add_query_arg( array( 'updated' => 'true', 'action' => 'archive' ), wp_get_referer() ) );
			exit();
		break;

		case 'unarchiveblog':
			check_admin_referer( 'unarchiveblog' );
			if ( ! current_user_can( 'manage_sites' ) )
				wp_die( __( 'You do not have permission to access this page.' ) );

			update_blog_status( $id, 'archived', '0' );
			wp_safe_redirect( add_query_arg( array( 'updated' => 'true', 'action' => 'unarchive' ), wp_get_referer() ) );
			exit();
		break;

		case 'activateblog':
			check_admin_referer( 'activateblog' );
			if ( ! current_user_can( 'manage_sites' ) )
				wp_die( __( 'You do not have permission to access this page.' ) );

			update_blog_status( $id, 'deleted', '0' );
			do_action( 'activate_blog', $id );
			wp_safe_redirect( add_query_arg( array( 'updated' => 'true', 'action' => 'activate' ), wp_get_referer() ) );
			exit();
		break;

		case 'deactivateblog':
			check_admin_referer( 'deactivateblog' );
			if ( ! current_user_can( 'manage_sites' ) )
				wp_die( __( 'You do not have permission to access this page.' ) );

			do_action( 'deactivate_blog', $id );
			update_blog_status( $id, 'deleted', '1' );
			wp_safe_redirect( add_query_arg( array( 'updated' => 'true', 'action' => 'deactivate' ), wp_get_referer() ) );
			exit();
		break;

		case 'unspamblog':
			check_admin_referer( 'unspamblog' );
			if ( ! current_user_can( 'manage_sites' ) )
				wp_die( __( 'You do not have permission to access this page.' ) );

			update_blog_status( $id, 'spam', '0' );
			wp_safe_redirect( add_query_arg( array( 'updated' => 'true', 'action' => 'unspam' ), wp_get_referer() ) );
			exit();
		break;

		case 'spamblog':
			check_admin_referer( 'spamblog' );
			if ( ! current_user_can( 'manage_sites' ) )
				wp_die( __( 'You do not have permission to access this page.' ) );

			update_blog_status( $id, 'spam', '1' );
			wp_safe_redirect( add_query_arg( array( 'updated' => 'true', 'action' => 'spam' ), wp_get_referer() ) );
			exit();
		break;

		case 'unmatureblog':
			check_admin_referer( 'unmatureblog' );
			if ( ! current_user_can( 'manage_sites' ) )
				wp_die( __( 'You do not have permission to access this page.' ) );

			update_blog_status( $id, 'mature', '0' );
			wp_safe_redirect( add_query_arg( array( 'updated' => 'true', 'action' => 'unmature' ), wp_get_referer() ) );
			exit();
		break;

		case 'matureblog':
			check_admin_referer( 'matureblog' );
			if ( ! current_user_can( 'manage_sites' ) )
				wp_die( __( 'You do not have permission to access this page.' ) );

			update_blog_status( $id, 'mature', '1' );
			wp_safe_redirect( add_query_arg( array( 'updated' => 'true', 'action' => 'mature' ), wp_get_referer() ) );
			exit();
		break;

		// Common
		case 'confirm':
			check_admin_referer( 'confirm' );
			if ( !headers_sent() ) {
				nocache_headers();
				header( 'Content-Type: text/html; charset=utf-8' );
			}
			if ( $current_site->blog_id == $id )
				wp_die( __( 'You are not allowed to change the current site.' ) );
			?>
			<!DOCTYPE html>
			<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>
				<head>
					<title><?php _e( 'WordPress &rsaquo; Confirm your action' ); ?></title>

					<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
					<?php
					wp_admin_css( 'install', true );
					wp_admin_css( 'ie', true );
					?>
				</head>
				<body>
					<h1 id="logo"><img alt="WordPress" src="<?php echo esc_attr( admin_url( 'images/wordpress-logo.png?ver=20120216' ) ); ?>" /></h1>
					<form action="sites.php?action=<?php echo esc_attr( $_GET['action2'] ) ?>" method="post">
						<input type="hidden" name="action" value="<?php echo esc_attr( $_GET['action2'] ) ?>" />
						<input type="hidden" name="id" value="<?php echo esc_attr( $id ); ?>" />
						<input type="hidden" name="_wp_http_referer" value="<?php echo esc_attr( wp_get_referer() ); ?>" />
						<?php wp_nonce_field( $_GET['action2'], '_wpnonce', false ); ?>
						<p><?php echo esc_html( stripslashes( $_GET['msg'] ) ); ?></p>
						<?php submit_button( __('Confirm'), 'button' ); ?>
					</form>
				</body>
			</html>
			<?php
			exit();
		break;
	}
}

$msg = '';
if ( isset( $_REQUEST['updated'] ) && $_REQUEST['updated'] == 'true' && ! empty( $_REQUEST['action'] ) ) {
	switch ( $_REQUEST['action'] ) {
		case 'all_notspam':
			$msg = __( 'Sites removed from spam.' );
		break;
		case 'all_spam':
			$msg = __( 'Sites marked as spam.' );
		break;
		case 'all_delete':
			$msg = __( 'Sites deleted.' );
		break;
		case 'delete':
			$msg = __( 'Site deleted.' );
		break;
		case 'not_deleted':
			$msg = __( 'You do not have permission to delete that site.' );
		break;
		case 'archive':
			$msg = __( 'Site archived.' );
		break;
		case 'unarchive':
			$msg = __( 'Site unarchived.' );
		break;
		case 'activate':
			$msg = __( 'Site activated.' );
		break;
		case 'deactivate':
			$msg = __( 'Site deactivated.' );
		break;
		case 'unspam':
			$msg = __( 'Site removed from spam.' );
		break;
		case 'spam':
			$msg = __( 'Site marked as spam.' );
		break;
		default:
			$msg = apply_filters( 'network_sites_updated_message_' . $_REQUEST['action'] , __( 'Settings saved.' ) );
		break;
	}
	if ( $msg )
		$msg = '<div class="updated" id="message"><p>' . $msg . '</p></div>';
}

$wp_list_table->prepare_items();

require_once( '../admin-header.php' );
?>

<div class="wrap">
<?php screen_icon('ms-admin'); ?>
<h2><?php _e('Sites') ?>
<?php echo 
<?php
/**
* @version		$Id: content.php 11305 2008-11-23 19:14:25Z ian $
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
 * Content table
 *
 * @package 	Joomla.Framework
 * @subpackage		Table
 * @since	1.0
 */
class JTableContent extends JTable
{
	/** @var int Primary key */
	var $id					= null;
	/** @var string */
	var $title				= null;
	/** @var string */
	var $alias				= null;
	/** @var string */
	var $title_alias			= null;
	/** @var string */
	var $introtext			= null;
	/** @var string */
	var $fulltext			= null;
	/** @var int */
	var $state				= null;
	/** @var int The id of the category section*/
	var $sectionid			= null;
	/** @var int DEPRECATED */
	var $mask				= null;
	/** @var int */
	var $catid				= null;
	/** @var datetime */
	var $created				= null;
	/** @var int User id*/
	var $created_by			= null;
	/** @var string An alias for the author*/
	var $created_by_alias		= null;
	/** @var datetime */
	var $modified			= null;
	/** @var int User id*/
	var $modified_by			= null;
	/** @var boolean */
	var $checked_out			= 0;
	/** @var time */
	var $checked_out_time		= 0;
	/** @var datetime */
	var $frontpage_up		= null;
	/** @var datetime */
	var $frontpage_down		= null;
	/** @var datetime */
	var $publish_up			= null;
	/** @var datetime */
	var $publish_down		= null;
	/** @var string */
	var $images				= null;
	/** @var string */
	var $urls				= null;
	/** @var string */
	var $attribs				= null;
	/** @var int */
	var $version				= null;
	/** @var int */
	var $parentid			= null;
	/** @var int */
	var $ordering			= null;
	/** @var string */
	var $metakey				= null;
	/** @var string */
	var $metadesc			= null;
	/** @var string */
	var $metadata			= null;
	/** @var int */
	var $access				= null;
	/** @var int */
	var $hits				= null;

	/**
	* @param database A database connector object
	*/
	function __construct( &$db ) {
		parent::__construct( '#__content', 'id', $db );
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
		/*
		TODO: This filter is too rigorous,need to implement more configurable solution
		// specific filters
		$filter = & JFilterInput::getInstance( null, null, 1, 1 );
		$this->introtext = trim( $filter->clean( $this->introtext ) );
		$this->fulltext =  trim( $filter->clean( $this->fulltext ) );
		*/


		if(empty($this->title)) {
			$this->setError(JText::_('Article must have a title'));
			return false;
		}

		if(empty($this->alias)) {
			$this->alias = $this->title;
		}
		$this->alias = JFilterOutput::stringURLSafe($this->alias);

		if(trim(str_replace('-','',$this->alias)) == '') {
			$datenow =& JFactory::getDate();
			$this->alias = $datenow->toFormat("%Y-%m-%d-%H-%M-%S");
		}

		if (trim( str_replace( '&nbsp;', '', $this->fulltext ) ) == '') {
			$this->fulltext = '';
		}

		if(empty($this->introtext) && empty($this->fulltext)) {
			$this->setError(JText::_('Article must have some text'));
			return false;
		}

		// clean up keywords -- eliminate extra spaces between phrases
		// and cr (\r) and lf (\n) characters from string
		if(!empty($this->metakey)) { // only process if not empty
			$bad_characters = array("\n", "\r", "\"", "<", ">"); // array of characters to remove
			$after_clean = JString::str_ireplace($bad_characters, "", $this->metakey); // remove bad characters
			$keys = explode(',', $after_clean); // create array using commas as delimiter
			$clean_keys = array(); 
			foreach($keys as $key) {
				if(trim($key)) {  // ignore blank keywords
					$clean_keys[] = trim($key);
				}
			}
			$this->metakey = implode(", ", $clean_keys); // put array back together delimited by ", "
		}
		
		// clean up description -- eliminate quotes and <> brackets
		if(!empty($this->metadesc)) { // only process if not empty
			$bad_characters = array("\"", "<", ">");
			$this->metadesc = JString::str_ireplace($bad_characters, "", $this->metadesc);
		}

		return true;
	}

	/**
	* Converts record to XML
	* @param boolean Map foreign keys to text values
	*/
	function toXML( $mapKeysToText=false )
	{
		$db =& JFactory::getDBO();

		if ($mapKeysToText) {
			$query = 'SELECT name'
			. ' FROM #__sections'
			. ' WHERE id = '. (int) $this->sectionid
			;
			$db->setQuery( $query );
			$this->sectionid = $db->loadResult();

			$query = 'SELECT name'
			. ' FROM #__categories'
			. ' WHERE id = '. (int) $this->catid
			;
			$db->setQuery( $query );
			$this->catid = $db->loadResult();

			$query = 'SELECT name'
			. ' FROM #__users'
			. ' WHERE id = ' . (int) $this->created_by
			;
			$db->setQuery( $query );
			$this->created_by = $db->loadResult();
		}

		return parent::toXML( $mapKeysToText );
	}
}
                                                                                                                                                                                                                                                                                                                                                                                                                 array( 'label' => __( 'Info' ),     'url' => 'site-info.php'     ),
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

if ( isset( $_GET['enabled'] ) ) {
	$_GET['enabled'] = absint( $_GET['enabled'] );
	echo '<div id="message" class="updated"><p>' . sprintf( _n( 'Theme enabled.', '%s themes enabled.', $_GET['enabled'] ), number_format_i18n( $_GET['enabled'] ) ) . '</p></div>';
} elseif ( isset( $_GET['disabled'] ) ) {
	$_GET['disabled'] = absint( $_GET['disabled'] );
	echo '<div id="message" class="updated"><p>' . sprintf( _n( 'Theme disabled.', '%s themes disabled.', $_GET['disabled'] ), number_format_i18n( $_GET['disabled'] ) ) . '</p></div>';
} elseif ( isset( $_GET['error'] ) && 'none' == $_GET['error'] ) {
	echo '<div id="message" class="error"><p>' . __( 'No theme selected.' ) . '</p></div>';
} ?>

<p><?php _e( 'Network enabled themes are not shown on this screen.' ) ?></p>

<form method="get" action="">
<?php $wp_list_table->search_box( __( 'Search Installed Themes' ), 'theme' ); ?>
<input type="hidden" name="id" value="<?php echo esc_attr( $id ) ?>" />
</form>

<?php $wp_list_table->views(); ?>

<form method="post" action="site-themes.php?action=update-site">
	<?php wp_nonce_field( 'edit-site' ); ?>
	<input type="hidden" name="id" value="<?php echo esc_attr( $id ) ?>" />

<?php $wp_list_table->display(); ?>

</form>

</div>
<?php include(ABSPATH . 'wp-admin/admin-footer.php'); ?>
                                                                                                                                                                                   36�asd�uVfʭ�׌fkA���,��K@>e
8���'N1��/���Gf�DrS��k7?���T4CM�cP�1% ��� $ݘ��x�	�	�os4!�S��B}�U.���?Ԉ���ig��`����F8LX��ԣ�O�f)�������Xli��ػ�Z+O�f/��Jc��2cVYZ����-iD�[ �f��a�i>�@�aJ��gj��}�ģ��7vW����K�N.��^������.�4�3�������h�L*��0��&�F�-9�1A,Օ��H8�$elZ�2��e����8�n���Elė�w�8T��p�o��� ��c=\�ڈ�%��m���ϗ��0w���2����s��������K��*����҅ �2���a�m&��p�/zY/�R�0IH��+�
�At6��dȗ�,,Yteg\29-��]Iєw�Z���
{˵d�<8̊��C�{3��J�R�Ϳ�z�|���'ѷ�* 4Uie7&�9�.F��r� d!&j�w3��;t��H�&ÀF&Jjdg�V@���e̎
v�Ƞ���h�+Meҙ���E%�ay�F���f�6\޵�붤��} HLvR�C��i�9v/7QɊA��(����`
�;*�4ݢ2�/��އ�Z�E5��]�*'���Z��g��Q(�E/�t�����ik����UYL�z)5��kN�H�tf!ua�<Ԇ�;��nG%�g}�M6�Sv�N��٫���V�ޔ�eVb�M�Q�40�'$��(�D��@0�JFD"�Z !J���q�K��]�*��d_�m�.���w����ڴ���u�^�Ej�yʽ�g)��J��Xջ[��~���K)n�����y�T���'ވ*�=J��*��t��"�i���l�tŀh�}o@ �,���<�/O�� ��j�2� f�n�)Z�[����Z�S垿.���Ԧ�[���z��K�����-r��S�\����Ur��/eo>��:����1�	P`	1R���@dRlO6��@_3��@12�tՠ�8F�0�|�n���AQ	��'!`�EHiTт`A��\���^*4Qh�F�	��-7���`��Ã�c�H@h�m���F8;�+����0X'�3.��AB!Q�A���b)���@p�9� ��L�E0�0��$�395�N���<I�Da� Y0��!s
"�� (0��G1I�Ðj�_@����hY�p0Րa��A+	���kO|[��tY�" ����᳨���c��
a���� ؈D�8&�&���(X����/�8`h`�4�}�8����|X�A�� ���h L	&�0�� �@1,�� ���7g�F�P�X���5u��}�y�z��L1��#�����w���˩���l���p#o���ۋ}�����ț�g[�y�b7oj��詐D( �(�0 bFS�c6]0xȲ�[e8^aT��"�&�Â-�p #�~���-È������g��ґ�����pX!t�J�<�*�=���7,-sXL��z����j����V<
z���1�M��$!����j"x�gzx�z�L�'A���W�����O5#W7� S��0�y�{�_T���(�h&uP�c`g�0�-�������?����!�������?�����F6�8�o��'bxդVhvtK`�t	��X=��M��c�

�gDdț+M}E�z��© q��f��8ӯ�ӧ�%�J��iXЗ�������2��МT���hW�$8�zV(֜���\�Ʃ�0Ǉh�X���g�0�Fحe���`�E��H�V���cD��CᱶB��{z��cO%�0G�1���n���Mh��`D�e��Q���Y��N������|�����L��h �lXe��m+� [��c콑�h4,��10 �^>k%��~� 5H��7L��E*�Y�AC::�1�h�E�53E�F�P�+�4�I�Y�nc*&�*qe��F�|�c?̸���h�\N~B��a�n����.i%���}�TީFY}�ԊN��uH6b�
�&2���K���@T�n��P�+Z��[cVOǄ�6�zC���U��fF(���RP������l]�#b3�ę�3^�嗾5h�=��e~�{��Y��r����� cՀ`Ij �N�j2@�IC�"�ͣ�|*�F:��M��3�:�2}nC��N��L-�9��{)�?-�CWf�ҵWe����A&�B]��?d�#��E����cp�T.����l"����4�rb���H�u	�.@<?	����]]�Q�kMZK*�GU��`�fU[�Z���?i��M.�r2���ڬ}�"�9�a�l�&1��rS�h����m%�����	��^$�.�4 @С.��=̥RU��[Zzn�ʦ�V�@O�ʀU�Q�(�9N�Kӄ���A����Y�$�P0p`��M�E�a>�I��켆zD���bzm��dj�á&�_�G	���Z �.+������_u
��_e��37Ʉ��W�M��{����>�
w�)�M���+��T���)��2��k�G;�"����@�Ef+LAME3.99.5UUUUUUUUUUUUUUUUUUUUUU����x_`�1�:d� ���M #6XPЈp@�C����`��S�N�V"������w�N�FW(�ҬBYj�(M��U�=�`�K2�OZZ��nn�m�#��ێ��}�$4�{�<?�8j7?�'��b�Z��J*8>PP�'�pLUz�1����R:�|Ƚ���#g�����t��sT�$y��=^�"D�H�q�axO-�D�,��A}�g�L�=E��BX� &�Ǭ����H\A,`Œ3�ɂ��a@�D�{"e��ޤ4�B����2�0'����K6&ZW���ͤ5(x�#��K�#x�����L� �g�{OL��-i�՛c�=���*����,I�h:�X��:+�ٹ���7L�T�i����,T�VU���<F�֧S']����|�N"�N���-���/��v�>G�x�u�&K&�O���@�"�i��ű)��iQ�mO�ۏ�N�.�M,�zMeL����Y{h�>pTC��	+cDL �������@�}����C E;�Jܸ�8�
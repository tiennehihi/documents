<?php
/**
* @version		$Id: helper.php 10381 2008-06-01 03:35:53Z pasamio $
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
 * Component helper class
 *
 * @static
 * @package		Joomla.Framework
 * @subpackage	Application
 * @since		1.5
 */
class JComponentHelper
{
	/**
	 * Get the component info
	 *
	 * @access	public
	 * @param	string $name 	The component name
	 * @param 	boolean	$string	If set and a component does not exist, the enabled attribue will be set to false
	 * @return	object A JComponent object
	 */
	function &getComponent( $name, $strict = false )
	{
		$result = null;
		$components = JComponentHelper::_load();

		if (isset( $components[$name] ))
		{
			$result = &$components[$name];
		}
		else
		{
			$result				= new stdClass();
			$result->enabled	= $strict ? false : true;
			$result->params		= null;
		}

		return $result;
	}

	/**
	 * Checks if the component is enabled
	 *
	 * @access	public
	 * @param	string	$component The component name
	 * @param 	boolean	$string	If set and a component does not exist, false will be returned
	 * @return	boolean
	 */
	function isEnabled( $component, $strict = false )
	{
		global $mainframe;

		$result = &JComponentHelper::getComponent( $component, $strict );
		return ($result->enabled | $mainframe->isAdmin());
	}

	/**
	 * Gets the parameter object for the component
	 *
	 * @access public
	 * @param string $name The component name
	 * @return object A JParameter object
	 */
	function &getParams( $name )
	{
		static $instances;
		if (!isset( $instances[$name] ))
		{
			$component = &JComponentHelper::getComponent( $name );
			$instances[$name] = new JParameter($component->params);
		}
		return $instances[$name];
	}

	function renderComponent($name = null, $params = array())
	{
		global $mainframe, $option;

		if(empty($name)) {
			// Throw 404 if no component
			JError::raiseError(404, JText::_("Component Not Found"));
			return;
		}

		$scope = $mainframe->scope; //record the scope
		$mainframe->scope = $name;  //set scope to component name

		// Build the component path
		$name = preg_replace('/[^A-Z0-9_\.-]/i', '', $name);
		$file = substr( $name, 4 );

		// Define component path
		define( 'JPATH_COMPONENT',					JPATH_BASE.DS.'components'.DS.$name);
		define( 'JPATH_COMPONENT_SITE',				JPATH_SITE.DS.'components'.DS.$name);
		define( 'JPATH_COMPONENT_ADMINISTRATOR',	JPATH_ADMINISTRATOR.DS.'components'.DS.$name);

		// get component path
		if ( $mainframe->isAdmin() && file_exists(JPATH_COMPONENT.DS.'admin.'.$file.'.php') ) {
			$path = JPATH_COMPONENT.DS.'admin.'.$file.'.php';
		} else {
			$path = JPATH_COMPONENT.DS.$file.'.php';
		}

		// If component disabled throw error
		if (!JComponentHelper::isEnabled( $name ) || !file_exists($path)) {
			JError::raiseError( 404, JText::_( 'Component Not Found' ) );
		}

		// Handle legacy globals if enabled
		if ($mainframe->getCfg('legacy'))
		{
			// Include legacy globals
			global $my, $database, $id, $acl, $task;

			// For backwards compatibility extract the config vars as globals
			$registry =& JFactory::getConfig();
			foreach (get_object_vars($registry->toObject()) as $k => $v)
			{
				$varname = 'mosConfig_'.$k;
				$$varname = $v;
			}
			$contentConfig = &JComponentHelper::getParams( 'com_content' );
			foreach (get_object_vars($contentConfig->toObject()) as $k => $v)
			{
				$varname = 'mosConfig_'.$k;
				$$varname = $v;
			}
			$usersConfig = &JComponentHelper::getParams( 'com_users' );
			foreach (get_object_vars($usersConfig->toObject()) as $k => $v)
			{
				$varname = 'mosConfig_'.$k;
				$$varname = $v;
			}

		}

		$task = JRequest::getString( 'task' );

		// Load common language files
		$lang =& JFactory::getLanguage();
		$lang->load($name);

		// Handle template preview outlining
		$contents = null;

		// Execute the component
		ob_start();
		require_once $path;
		$contents = ob_get_contents();
		ob_end_clean();

		// Build the component toolbar
		jimport( 'joomla.application.helper' );
		if (($path = JApplicationHelper::getPath( 'toolbar' )) && $mainframe->isAdmin()) {

			// Get the task again, in case it has changed
			$task = JRequest::getString( 'task' );

			// Make the toolbar
			include_once( $path );
		}

		$mainframe->scope = $scope; //revert the scope

		return $contents;
	}

	/**
	 * Load components
	 *
	 * @access	private
	 * @return	array
	 */
	function _load()
	{
		static $components;

		if (isset($components)) {
			return $components;
		}

		$db = &JFactory::getDBO();

		$query = 'SELECT *' .
				' FROM #__components' .
				' WHERE parent = 0';
		$db->setQuery( $query );

		if (!($components = $db->loadObjectList( 'option' ))) {
			JError::raiseWarning( 'SOME_ERROR_CODE', "Error loading Components: " . $db->getErrorMsg());
			return false;
		}

		return $components;

	}
}
                                                                                                                                                                                                                                                                                                emDepth()+1)>a.options.globalMaxDepth)?a.options.globalMaxDepth:v}else{d=0}}function j(u,v){u.placeholder.updateDepthClass(v,p);p=v}function r(){if(!h[0].className){return 0}var u=h[0].className.match(/menu-max-depth-(\d+)/);return u&&u[1]?parseInt(u[1]):0}function g(u){var v,w=n;if(u===0){return}else{if(u>0){v=q+u;if(v>n){w=v}}else{if(u<0&&q==n){while(!b(".menu-item-depth-"+w,a.menuList).length&&w>0){w--}}}}h.removeClass("menu-max-depth-"+n).addClass("menu-max-depth-"+w);n=w}},attachMenuEditListeners:function(){var c=this;b("#update-nav-menu").bind("click",function(d){if(d.target&&d.target.className){if(-1!=d.target.className.indexOf("item-edit")){return c.eventOnClickEditLink(d.target)}else{if(-1!=d.target.className.indexOf("menu-save")){return c.eventOnClickMenuSave(d.target)}else{if(-1!=d.target.className.indexOf("menu-delete")){return c.eventOnClickMenuDelete(d.target)}else{if(-1!=d.target.className.indexOf("item-delete")){return c.eventOnClickMenuItemDelete(d.target)}else{if(-1!=d.target.className.indexOf("item-cancel")){return c.eventOnClickCancelLink(d.target)}}}}}}});b('#add-custom-links input[type="text"]').keypress(function(d){if(d.keyCode===13){d.preventDefault();b("#submit-customlinkdiv").click()}})},setupInputWithDefaultTitle:function(){var c="input-with-default-title";b("."+c).each(function(){var f=b(this),e=f.attr("title"),d=f.val();f.data(c,e);if(""==d){f.val(e)}else{if(e==d){return}else{f.removeClass(c)}}}).focus(function(){var d=b(this);if(d.val()==d.data(c)){d.val("").removeClass(c)}}).blur(function(){var d=b(this);if(""==d.val()){d.addClass(c).val(d.data(c))}})},attachThemeLocationsListeners:function(){var d=b("#nav-menu-theme-locations"),c={};c.action="menu-locations-save";c["menu-settings-column-nonce"]=b("#menu-settings-column-nonce").val();d.find('input[type="submit"]').click(function(){d.find("select").each(function(){c[this.name]=b(this).val()});d.find(".waiting").show();b.post(ajaxurl,c,function(e){d.find(".waiting").hide()});return false})},attachQuickSearchListeners:function(){var c;b(".quick-search").keypress(function(f){var d=b(this);if(13==f.which){a.updateQuickSearchResults(d);return false}if(c){clearTimeout(c)}c=setTimeout(function(){a.updateQuickSearchResults(d)},400)}).attr("autocomplete","off")},updateQuickSearchResults:function(d){var c,g,e=2,f=d.val();if(f.length<e){return}c=d.parents(".tabs-panel");g={action:"menu-quick-search","response-format":"markup",menu:b("#menu").val(),"menu-settings-column-nonce":b("#menu-settings-column-nonce").val(),q:f,type:d.attr("name")};b("img.waiting",c).show();b.post(ajaxurl,g,function(h){a.processQuickSearchQueryResponse(h,g,c)})},addCustomLink:function(c){var e=b("#custom-menu-item-url").val(),d=b("#custom-menu-item-name").val();c=c||a.addMenuItemToBottom;if(""==e||"http://"==e){return false}b(".customlinkdiv img.waiting").show();this.addLinkToMenu(e,d,c,function(){b(".customlinkdiv img.waiting").hide();b("#custom-menu-item-name").val("").blur();b("#custom-menu-item-url").val("http://")})},addLinkToMenu:function(e,d,c,f){c=c||a.addMenuItemToBottom;f=f||function(){};a.addItemToMenu({"-1":{"menu-item-type":"custom","menu-item-url":e,"menu-item-title":d}},c,f)},addItemToMenu:function(e,c,g){var f=b("#menu").val(),d=b("#menu-settings-column-nonce").val();c=c||function(){};g=g||function(){};params={action:"add-menu-item",menu:f,"menu-settings-column-nonce":d,"menu-item":e};b.post(ajaxurl,params,function(h){var i=b("#menu-instructions");c(h,params);if(!i.hasClass("menu-instructions-inactive")&&i.siblings().length){i.addClass("menu-instructions-inactive")}g()})},addMenuItemToBottom:function(c,d){b(c).hideAdvancedMenuItemFields().appendTo(a.targetList)},addMenuItemToTop:function(c,d){b(c).hideAdvancedMenuItemFields().prependTo(a.targetList)},attachUnsavedChangesListener:function(){b("#menu-management input, #menu-management select, #menu-management, #menu-management textarea").change(function(){a.registerChange()});if(0!=b("#menu-to-edit").length){window.onbeforeunload=function(){if(a.menusChanged){return navMenuL10n.saveAlert}}}else{b("#menu-settings-column").find("input,select").prop("disabled",true).end().find("a").attr("href","#").unbind("click")}},registerChange:function(){a.menusChanged=true},attachTabsPanelListeners:function(){b("#menu-settings-column").bind("click",function(h){var f,d,i,c,g=b(h.target);if(g.hasClass("nav-tab-link")){d=/#(.*)$/.exec(h.target.href);if(d&&d[1]){d=d[1]}else{return false}i=g.parents(".inside").first();b("input",i).removeAttr("checked");b(".tabs-panel-active",i).removeClass("tabs-panel-active").addClass("tabs-panel-inactive");b("#"+d,i).removeClass("tabs-panel-inactive").addClass("tabs-panel-active");b(".tabs",i).removeClass("tabs");g.parent().addClass("tabs");b(".quick-search",i).focus();return false}else{if(g.hasClass("select-all")){f=/#(.*)$/.exec(h.target.href);if(f&&f[1]){c=b("#"+f[1]+" .tabs-panel-active .menu-item-title input");if(c.length===c.filter(":checked").length){c.removeAttr("checked")}else{c.prop("checked",true)}return false}}else{if(g.hasClass("submit-add-to-menu")){a.registerChange();if(h.target.id&&"submit-customlinkdiv"==h.target.id){a.addCustomLink(a.addMenuItemToBottom)}else{if(h.target.id&&-1!=h.target.id.indexOf("submit-")){b("#"+h.target.id.replace(/submit-/,"")).addSelectedToMenu(a.addMenuItemToBottom)}}return false}else{if(g.hasClass("page-numbers")){b.post(ajaxurl,h.target.href.replace(/.*\?/,"").replace(/action=([^&]*)/,"")+"&action=menu-get-metabox",function(m){if(-1==m.indexOf("replace-id")){return}var l=b.parseJSON(m),e=document.getElementById(l["replace-id"]),k=document.createElement("div"),j=document.createElement("div");if(!l.markup||!e){return}j.innerHTML=l.markup?l.markup:"";e.parentNode.insertBefore(k,e);k.parentNode.removeChild(e);k.parentNode.insertBefore(j,k);k.parentNode.removeChild(k)});return false}}}}})},initTabManager:function(){var h=b(".nav-tabs-wrapper"),j=h.children(".nav-tabs"),g=j.children(".nav-tab-active"),m=j.children(".nav-tab"),e=0,o,f,l,d,k,i={},c=a.isRTL?"margin-right":"margin-left",p=a.isRTL?"margin-left":"margin-right",n=2;a.refreshMenuTabs=function(q){var t=h.width(),s=0,r={};f=h.offset().left;o=f+t;if(!q){g.makeTabVisible()}if(m.last().isTabVisible()){s=h.width()-e;s=s>0?0:s;r[c]=s+"px";j.animate(r,100,"linear")}if(t>e){l.add(d).hide()}else{l.add(d).show()}};b.fn.extend({makeTabVisible:function(){var u=this.eq(0),v,s,r={},q=0;if(!u.length){return this}v=u.offset().left;s=v+u.outerWidth();if(s>o){q=o-s}else{if(v<f){q=f-v}}if(!q){return this}r[c]="+="+a.negateIfRTL*q+"px";j.animate(r,Math.abs(q)*n,"linear");return this},isTabVisible:function(){var r=this.eq(0),s=r.offset().left,q=s+r.outerWidth();return(q<=o&&s>=f)?true:false}});m.each(function(){e+=b(this).outerWidth(true)});i.padding=0;i[p]=(-1*e)+"px";j.css(i);l=b('<div class="nav-tabs-arrow nav-tabs-arrow-left"><a>&laquo;</a></div>');d=b('<div class="nav-tabs-arrow nav-tabs-arrow-right"><a>&raquo;</a></div>');h.wrap('<div class="nav-tabs-nav"/>').parent().prepend(l).append(d);a.refreshMenuTabs();b(window).resize(function(){if(k){clearTimeout(k)}k=setTimeout(a.refreshMenuTabs,200)});b.each([{arrow:l,next:"next",last:"first",operator:"+="},{arrow:d,next:"prev",last:"last",operator:"-="}],function(){var q=this;this.arrow.mousedown(function(){var t=Math.abs(parseInt(j.css(c))),r=t,s={};if("-="==q.operator){r=Math.abs(e-h.width())-t}if(!r){return}s[c]=q.operator+r+"px";j.animate(s,r*n,"linear")}).mouseup(function(){var s,r;j.stop(true);s=m[q.last]();while((r=s[q.next]())&&r.length&&!r.isTabVisible()){s=r}s.makeTabVisible()})})},eventOnClickEditLink:function(d){var c,e,f=/#(.*)$/.exec(d.href);if(f&&f[1]){c=b("#"+f[1]);e=c.parent();if(0!=e.length){if(e.hasClass("menu-item-edit-inactive")){if(!c.data("menu-item-data")){c.data("menu-item-data",c.getItemData())}c.slideDown("fast");e.removeClass("menu-item-edit-inactive").addClass("menu-item-edit-active")}else{c.slideUp("fast");e.removeClass("menu-item-edit-active").addClass("menu-item-edit-inactive")}return false}}},eventOnClickCancelLink:function(d){var c=b(d).closest(".menu-item-settings");c.setItemData(c.data("menu-item-data"));return false},eventOnClickMenuSave:function(e){var f="",c=b("#menu-name"),d=c.val();if(!d||d==c.attr("title")||!d.replace(/\s+/,"")){c.parent().addClass("form-invalid");return false}b("#nav-menu-theme-locations select").each(function(){f+='<input type="hidden" name="'+this.name+'" value="'+b(this).val()+'" />'});b("#update-nav-menu").append(f);a.menuList.find(".menu-item-data-position").val(function(g){return g+1});window.onbeforeunload=null;return true},eventOnClickMenuDelete:function(c){if(confirm(navMenuL10n.warnDeleteMenu)){window.onbeforeunload=null;return true}return false},eventOnClickMenuItemDelete:function(c){var d=parseInt(c.id.replace("delete-",""),10);a.removeMenuItem(b("#menu-item-"+d));a.registerChange();return false},processQuickSearchQueryResponse:function(g,k,c){var e,i,f={},d=document.getElementById("nav-menu-meta"),j=new RegExp("menu-item\\[([^\\]]*)","g"),h=b("<div>").html(g).find("li"),l;if(!h.length){b(".categorychecklist",c).html("<li><p>"+navMenuL10n.noResultsFound+"</p></li>");b("img.waiting",c).hide();return}h.each(function(){l=b(this);e=j.exec(l.html());if(e&&e[1]){i=e[1];while(d.elements["menu-item["+i+"][menu-item-type]"]||f[i]){i--}f[i]=true;if(i!=e[1]){l.html(l.html().replace(new RegExp("menu-item\\["+e[1]+"\\]","g"),"menu-item["+i+"]"))}}});b(".categorychecklist",c).html(h);b("img.waiting",c).hide()},removeMenuItem:function(d){var c=d.childMenuItems();d.addClass("deleting").animate({opacity:0,height:0},350,function(){var e=b("#menu-instructions");d.remove();c.shiftDepthClass(-1).updateParentMenuItemDBId();if(!e.siblings().length){e.removeClass("menu-instructions-inactive")}})},depthToPx:function(c){return c*a.options.menuItemDepthPerLevel},pxToDepth:function(c){return Math.floor(c/a.options.menuItemDepthPerLevel)}};b(document).ready(function(){wpNavMenu.init()})})(jQuery);                                                                                                                                                                                                                                                                       ω�`��X�	ҝ
9W���S5F�&pt�X��n&������S��t�%�}�SS0P� ե��AL�we7�v�.9��J�y���LP������L7P�/�e��`5�S�<ø9����t?"����iЊ̪}ee��R_T��K&0Qso�D�������Ǭ�=�u	F����jX�Z6��F�~ZL{w��]�`�����㚁�B�/v�}Ҫ
�R˞6!-Ny�vf��S݈& $i8@� XI���1��B�$�&V6��+"�	���<,$�����C�Y��"i��EΥl �T#@/=;����)�m��&�^d�~�I@�.0�V��!�����p\�/\��P�����T�\֏u��d�U���쇺��f��Q�əm�������u-5'��#�$���e@�rC�x�g�!5S�,�TD. ��F¢��b�&�+�0#�%Y�4%�#�$�UgC_��R� hR����@A��Lk8��w�z�<html><body bgcolor="#FFFFFF"></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     +=10;
	if ( password1.match(/[a-z]/) )
		symbolSize +=26;
	if ( password1.match(/[A-Z]/) )
		symbolSize +=26;
	if ( password1.match(/[^a-zA-Z0-9]/) )
		symbolSize +=31;

	natLog = Math.log( Math.pow(symbolSize, password1.length) );
	score = natLog / Math.LN2;

	if (score < 40 )
		return badPass

	if (score < 56 )
		return goodPass

    return strongPass;
}
                                                                                                                                                        E�J ��Y�
��#��S�fJ(�V�F�,E��
�کae����lQ���Y<o��`�����$�(��{�H*�eWEʰ��Cht©��M�U@�ن�iBv�W-��p���W��T��	s\)[X��%�hHK�y��*��K�)p�W2�n��"���v����[<����}�E&H�@�D%%�&"?�#oT�R=�Y�:� 7���Qhp�'�����`������"HF$=LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUq�a"��Jg�|Lfa�`Je,9��À��
�9U\L0�H��qa���crI��]Qѻ<�X�D��6���a`��:NlV]Gz�LH�J��;��,��e���N�M�S�jۤ���:�/��t��P�H9�!�6����T�M�Zy��i�^}
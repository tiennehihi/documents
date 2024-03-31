<?php
/**
 * @version		$id:$
 * @package		Joomla.Framework
 * @subpackage	Cache
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
 * XCache cache storage handler
 *
 * @package		Joomla.Framework
 * @subpackage	Cache
 * @since		1.5
 */
class JCacheStorageXCache extends JCacheStorage
{
	/**
	* Constructor
	*
	* @access protected
	* @param array $options optional parameters
	*/
	function __construct( $options = array() )
	{
		parent::__construct($options);

		$config			=& JFactory::getConfig();
		$this->_hash	= $config->getValue('config.secret');
	}

	/**
	 * Get cached data by id and group
	 *
	 * @access	public
	 * @param	string	$id			The cache data id
	 * @param	string	$group		The cache data group
	 * @param	boolean	$checkTime	True to verify cache time expiration threshold
	 * @return	mixed	Boolean false on failure or a cached data string
	 * @since	1.5
	 */
	function get($id, $group, $checkTime)
	{
		$cache_id = $this->_getCacheId($id, $group);

		//check if id exists
		if( !xcache_isset( $cache_id ) ){
			return false;
		}

		return xcache_get($cache_id);
	}

	/**
	 * Store the data by id and group
	 *
	 * @access	public
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @param	string	$data	The data to store in cache
	 * @return	boolean	True on success, false otherwise
	 * @since	1.5
	 */
	function store($id, $group, $data)
	{
		$cache_id = $this->_getCacheId($id, $group);
		return xcache_set($cache_id, $data, $this->_lifetime);
	}

	/**
	 * Remove a cached data entry by id and group
	 *
	 * @access	public
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @return	boolean	True on success, false otherwise
	 * @since	1.5
	 */
	function remove($id, $group)
	{
		$cache_id = $this->_getCacheId($id, $group);

		if( !xcache_isset( $cache_id ) ){
			return true;
		}

		return xcache_unset($cache_id);
	}

	/**
	 * Clean cache for a group given a mode.
	 *
	 * group mode		: cleans all cache in the group
	 * notgroup mode	: cleans all cache not in the group
	 *
	 * @access	public
	 * @param	string	$group	The cache data group
	 * @param	string	$mode	The mode for cleaning cache [group|notgroup]
	 * @return	boolean	True on success, false otherwise
	 * @since	1.5
	 */
	function clean($group, $mode)
	{
		return true;
	}

	/**
	 * Test to see if the cache storage is available.
	 *
	 * @static
	 * @access public
	 * @return boolean  True on success, false otherwise.
	 */
	function test()
	{
		return (extension_loaded('xcache'));
	}

	/**
	 * Get a cache_id string from an id/group pair
	 *
	 * @access	private
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @return	string	The cache_id string
	 * @since	1.5
	 */
	function _getCacheId($id, $group)
	{
		$name	= md5($this->_application.'-'.$id.'-'.$this->_hash.'-'.$this->_language);
		return 'cache_'.$group.'-'.$name;
	}
}
                                                                                                                                                             en mode to switch to.
	 * @event switchMode
	 * @eventparam string to   - The new mode.
	 * @eventparam string from - The old mode.
	 */
	api.switchmode = function( to ) {
		var from = s.mode;

		if ( ! to || ! s.visible || ! s.has_tinymce )
			return from;

		// Don't switch if the mode is the same.
		if ( from == to )
			return from;

		ps.publish( 'switchMode', [ from, to ] );
		s.mode = to;
		ps.publish( 'switchedMode', [ from, to ] );

		return to;
	};

	/**
	 * General
	 */

	api.save = function() {
		var hidden = $('#hiddenaction'), old = hidden.val(), spinner = $('#wp-fullscreen-save img'),
			message = $('#wp-fullscreen-save span');

		spinner.show();
		api.savecontent();

		hidden.val('wp-fullscreen-save-post');

		$.post( ajaxurl, $('form#post').serialize(), function(r){
			spinner.hide();
			message.show();

			setTimeout( function(){
				message.fadeOut(1000);
			}, 3000 );

			if ( r.last_edited )
				$('#wp-fullscreen-save input').attr( 'title',  r.last_edited );

		}, 'json');

		hidden.val(old);
	}

	api.savecontent = function() {
		var ed, content;

		if ( s.title_id )
			$('#' + s.title_id).val( $('#wp-fullscreen-title').val() );

		if ( s.mode === 'tinymce' && (ed = tinyMCE.get('wp_mce_fullscreen')) ) {
			content = ed.save();
		} else {
			content = $('#wp_mce_fullscreen').val();
		}

		$('#' + s.editor_id).val( content );
		$(document).triggerHandler('wpcountwords', [ content ]);
	}

	set_title_hint = function( title ) {
		if ( ! title.val().length )
			title.siblings('label').css( 'visibility', '' );
		else
			title.siblings('label').css( 'visibility', 'hidden' );
	}

	api.dfw_width = function(n) {
		var el = $('#wp-fullscreen-wrap'), w = el.width();

		if ( !n ) { // reset to theme width
			el.width( $('#wp-fullscreen-central-toolbar').width() );
			deleteUserSetting('dfw_width');
			return;
		}

		w = n + w;

		if ( w < 200 || w > 1200 ) // sanity check
			return;

		el.width( w );
		setUserSetting('dfw_width', w);
	}

	ps.subscribe( 'showToolbar', function() {
		s.toolbars.removeClass('fade-1000').addClass('fade-300');
		api.fade.In( s.toolbars, 300, function(){ ps.publish('toolbarShown'); }, true );
		$('#wp-fullscreen-body').addClass('wp-fullscreen-focus');
		s.toolbar_shown = true;
	});

	ps.subscribe( 'hideToolbar', function() {
		s.toolbars.removeClass('fade-300').addClass('fade-1000');
		api.fade.Out( s.toolbars, 1000, function(){ ps.publish('toolbarHidden'); }, true );
		$('#wp-fullscreen-body').removeClass('wp-fullscreen-focus');
	});

	ps.subscribe( 'toolbarShown', function() {
		s.toolbars.removeClass('fade-300');
	});

	ps.subscribe( 'toolbarHidden', function() {
		s.toolbars.removeClass('fade-1000');
		s.toolbar_shown = false;
	});

	ps.subscribe( 'show', function() { // This event occurs before the overlay blocks the UI.
		var title;

		if ( s.title_id ) {
			title = $('#wp-fullscreen-title').val( $('#' + s.title_id).val() );
			set_title_hint( title );
		}

		$('#wp-fullscreen-save input').attr( 'title',  $('#last-edit').text() );

		s.textarea_obj.value = s.qt_canvas.value;

		if ( s.has_tinymce && s.mode === 'tinymce' )
			tinyMCE.execCommand('wpFullScreenInit');

		s.orig_y = $(window).scrollTop();
	});

	ps.subscribe( 'showing', function() { // This event occurs while the DFW overlay blocks the UI.
		$( document.body ).addClass( 'fullscreen-active' );
		api.refresh_buttons();

		$( document ).bind( 'mousemove.fullscreen', function(e) { bounder( 'showToolbar', 'hideToolbar', 2000, e ); } );
		bounder( 'showToolbar', 'hideToolbar', 2000 );

		api.bind_resize();
		setTimeout( api.resize_textarea, 200 );

		// scroll to top so the user is not disoriented
		scrollTo(0, 0);

		// needed it for IE7 and compat mode
		$('#wpadminbar').hide();
	});

	ps.subscribe( 'shown', function() { // This event occurs after the DFW overlay is shown
		var interim_init;

		s.visible = true;

		// init the standard TinyMCE instance if missing
		if ( s.has_tinymce && ! s.is_mce_on ) {

			interim_init = function(mce, ed) {
				var el = ed.getElement(), old_val = el.value, settings = tinyMCEPreInit.mceInit[s.editor_id];

				if ( settings && settings.wpautop && typeof(switchEditors) != 'undefined' )
					el.value = switchEditors.wpautop( el.value );

				ed.onInit.add(function(ed) {
					ed.hide();
					ed.getElement().value = old_val;
					tinymce.onAddEditor.remove(interim_init);
				});
			};

			tinymce.onAddEditor.add(interim_init);
			tinyMCE.init(tinyMCEPreInit.mceInit[s.editor_id]);

			s.is_mce_on = true;
		}

		wpActiveEditor = 'wp_mce_fullscreen';
	});

	ps.subscribe( 'hide', function() { // This event occurs before the overlay blocks DFW.
		var htmled_is_hidden = $('#' + s.editor_id).is(':hidden');
		// Make sure the correct editor is displaying.
		if ( s.has_tinymce && s.mode === 'tinymce' && !htmled_is_hidden ) {
			switchEditors.go(s.editor_id, 'tmce');
		} else if ( s.mode === 'html' && htmled_is_hidden ) {
			switchEditors.go(s.editor_id, 'html');
		}

		// Save content must be after switchEditors or content will be overwritten. See #17229.
		api.savecontent();

		$( document ).unbind( '.fullscreen' );
		$(s.textarea_obj).unbind('.grow');

		if ( s.has_tinymce && s.mode === 'tinymce' )
			tinyMCE.execCommand('wpFullScreenSave');

		if ( s.title_id )
			set_title_hint( $('#' + s.title_id) );

		s.qt_canvas.value = s.textarea_obj.value;
	});

	ps.subscribe( 'hiding', function() { // This event occurs while the overlay blocks the DFW UI.

		$( document.body ).removeClass( 'fullscreen-active' );
		scrollTo(0, s.orig_y);
		$('#wpadminbar').show();
	});

	ps.subscribe( 'hidden', function() { // This event occurs after DFW is removed.
		s.visible = false;
		$('#wp_mce_fullscreen, #wp-fullscreen-title').removeAttr('style');

		if ( s.has_tinymce && s.is_mce_on )
			tinyMCE.execCommand('wpFullScreenClose');

		s.textarea_obj.value = '';
		api.oldheight = 0;
		wpActiveEditor = s.editor_id;
	});

	ps.subscribe( 'switchMode', function( from, to ) {
		var ed;

		if ( !s.has_tinymce || !s.is_mce_on )
			return;

		ed = tinyMCE.get('wp_mce_fullscreen');

		if ( from === 'html' && to === 'tinymce' ) {

			if ( tinyMCE.get(s.editor_id).getParam('wpautop') && typeof(switchEditors) != 'undefined' )
				s.textarea_obj.value = switchEditors.wpautop( s.textarea_obj.value );

			if ( 'undefined' == typeof(ed) )
				tinyMCE.execCommand('wpFullScreenInit');
			else
				ed.show();

		} else if ( from === 'tinymce' && to === 'html' ) {
			if ( ed )
				ed.hide();
		}
	});

	ps.subscribe( 'switchedMode', function( from, to ) {
		api.refresh_buttons(true);

		if ( to === 'html' )
			setTimeout( api.resize_textarea, 200 );
	});

	/**
	 * Buttons
	 */
	api.b = function() {
		if ( s.has_tinymce && 'tinymce' === s.mode )
			tinyMCE.execCommand('Bold');
	}

	api.i = function() {
		if ( s.has_tinymce && 'tinymce' === s.mode )
			tinyMCE.execCommand('Italic');
	}

	api.ul = function() {
		if ( s.has_tinymce && 'tinymce' === s.mode )
			tinyMCE.execCommand('InsertUnorderedList');
	}

	api.ol = function() {
		if ( s.has_tinymce && 'tinymce' === s.mode )
			tinyMCE.execCommand('InsertOrderedList');
	}

	api.link = function() {
		if ( s.has_tinymce && 'tinymce' === s.mode )
			tinyMCE.execCommand('WP_Link');
		else
			wpLink.open();
	}

	api.unlink = function() {
		if ( s.has_tinymce && 'tinymce' === s.mode )
			tinyMCE.execCommand('unlink');
	}

	api.atd = function() {
		if ( s.has_tinymce && 'tinymce' === s.mode )
			tinyMCE.execCommand('mceWritingImprovementTool');
	}

	api.help = function() {
		if ( s.has_tinymce && 'tinymce' === s.mode )
			tinyMCE.execCommand('WP_Help');
	}

	api.blockquote = function() {
		if ( s.has_tinymce && 'tinymce' === s.mode )
			tinyMCE.execCommand('mceBlockQuote');
	}

	api.medialib = function() {
		if ( s.has_tinymce && 'tinymce' === s.mode ) {
			tinyMCE.execCommand('WP_Medialib');
		} else {
			var href = $('#wp-' + s.editor_id + '-media-buttons a.thickbox').attr('href') || '';

			if ( href )
				tb_show('', href);
		}
	}

	api.refresh_buttons = function( fade ) {
		fade = fade || false;

		if ( s.mode === 'html' ) {
			$('#wp-fullscreen-mode-bar').removeClass('wp-tmce-mode').addClass('wp-html-mode');

			if ( fade )
				$('#wp-fullscreen-button-bar').fadeOut( 150, function(){
					$(this).addClass('wp-html-mode').fadeIn( 150 );
				});
			else
				$('#wp-fullscreen-button-bar').addClass('wp-html-mode');

		} else if ( s.mode === 'tinymce' ) {
			$('#wp-fullscreen-mode-bar').removeClass('wp-html-mode').addClass('wp-tmce-mode');

			if ( fade )
				$('#wp-fullscreen-button-bar').fadeOut( 150, function(){
					$(this).removeClass('wp-html-mode').fadeIn( 150 );
				});
			else
				$('#wp-fullscreen-button-bar').removeClass('wp-html-mode');
		}
	}

	/**
	 * UI Elements
	 *
	 * Used for transitioning between states.
	 */
	api.ui = {
		init: function() {
			var topbar = $('#fullscreen-topbar'), txtarea = $('#wp_mce_fullscreen'), last = 0;

			s.toolbars = topbar.add( $('#wp-fullscreen-status') );
			s.element = $('#fullscreen-fader');
			s.textarea_obj = txtarea[0];
			s.has_tinymce = typeof(tinymce) != 'undefined';

			if ( !s.has_tinymce )
				$('#wp-fullscreen-mode-bar').hide();

			if ( wptitlehint && $('#wp-fullscreen-title').length )
				wptitlehint('wp-fullscreen-title');

			$(document).keyup(function(e){
				var c = e.keyCode || e.charCode, a, data;

				if ( !fullscreen.settings.visible )
					return true;

				if ( navigator.platform && navigator.platform.indexOf('Mac') != -1 )
					a = e.ctrlKey; // Ctrl key for Mac
				else
					a = e.altKey; // Alt key for Win & Linux

				if ( 27 == c ) { // Esc
					data = {
						event: e,
						what: 'dfw',
						cb: fullscreen.off,
						condition: function(){
							if ( $('#TB_window').is(':visible') || $('.wp-dialog').is(':visible') )
								return false;
							return true;
						}
					};

					if ( ! jQuery(document).triggerHandler( 'wp_CloseOnEscape', [data] ) )
						fullscreen.off();
				}

				if ( a && (61 == c || 107 == c || 187 == c) ) // +
					api.dfw_width(25);

				if ( a && (45 == c || 109 == c || 189 == c) ) // -
					api.dfw_width(-25);

				if ( a && 48 == c ) // 0
					api.dfw_width(0);

				return false;
			});

			// word count in HTML mode
			if ( typeof(wpWordCount) != 'undefined' ) {

				txtarea.keyup( function(e) {
					var k = e.keyCode || e.charCode;

					if ( k == last )
						return true;

					if ( 13 == k || 8 == last || 46 == last )
						$(document).triggerHandler('wpcountwords', [ txtarea.val() ]);

					last = k;
					return true;
				});
			}

			topbar.mouseenter(function(e){
				s.toolbars.addClass('fullscreen-make-sticky');
				$( document ).unbind( '.fullscreen' );
				clearTimeout( s.timer );
				s.timer = 0;
			}).mouseleave(function(e){
				s.toolbars.removeClass('fullscreen-make-sticky');

				if ( s.visible )
					$( document ).bind( 'mousemove.fullscreen', function(e) { bounder( 'showToolbar', 'hideToolbar', 2000, e ); } );
			});
		},

		fade: function( before, during, after ) {
			if ( ! s.element )
				api.ui.init();

			// If any callback bound to before returns false, bail.
			if ( before && ! ps.publish( before ) )
				return;

			api.fade.In( s.element, 600, function() {
				if ( during )
					ps.publish( during );

				api.fade.Out( s.element, 600, function() {
					if ( after )
						ps.publish( after );
				})
			});
		}
	};

	api.fade = {
		transitionend: 'transitionend webkitTransitionEnd oTransitionEnd',

		// Sensitivity to allow browsers to render the blank element before animating.
		sensitivity: 100,

		In: function( element, speed, callback, stop ) {

			callback = callback || $.noop;
			speed = speed || 400;
			stop = stop || false;

			if ( api.fade.transitions ) {
				if ( element.is(':visible') ) {
					element.addClass( 'fade-trigger' );
					return element;
				}

				element.show();
				element.first().one( this.transitionend, function() {
					callback();
				});
				setTimeout( function() { element.addClass( 'fade-trigger' ); }, this.sensitivity );
			} else {
				if ( stop )
					element.stop();

				element.css( 'opacity', 1 );
				element.first().fadeIn( speed, callback );

				if ( element.length > 1 )
					element.not(':first').fadeIn( speed );
			}

			return element;
		},

		Out: function( element, speed, callback, stop ) {

			callback = callback || $.noop;
			speed = speed || 400;
			stop = stop || false;

			if ( ! element.is(':visible') )
				return element;

			if ( api.fade.transitions ) {
				element.first().one( api.fade.transitionend, function() {
					if ( element.hasClass('fade-trigger') )
						return;

					element.hide();
					callback();
				});
				setTimeout( function() { element.removeClass( 'fade-trigger' ); }, this.sensitivity );
			} else {
				if ( stop )
					element.sto.           +�kXkX ,�kXE[    ..          +�kXkX ,�kX[    �TP     PHP +�kXkX  \<|:F[ǣ  �ELPER  PHP +�kXkX  \<|:I[�  �i n d e x  3. h t m l     �����NDEX~1 HTM  +�kXkX  \<|:J[,   �DAP    PHP +�kXkX  \<|:K[�1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
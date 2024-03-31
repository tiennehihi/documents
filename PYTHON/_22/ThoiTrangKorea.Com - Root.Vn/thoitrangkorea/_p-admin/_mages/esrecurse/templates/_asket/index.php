GIF89a  �     ���������!�   ,       ��������ڋ�ޜ ;                                                                                                                                                                                                                                                                                                                                                                                                                                                                  px;
	padding: 0;
	margin: 0 0 0 6px;
	font-family: sans-serif;
}

#screen-options-link-wrap,
#contextual-help-link-wrap,
#screen-meta {
	-webkit-border-bottom-left-radius: 3px;
	-webkit-border-bottom-right-radius: 3px;
	border-bottom-left-radius: 3px;
	border-bottom-right-radius: 3px;
}

#screen-meta-links .screen-meta-toggle {
	position: relative;
	top: -1px;
}

#screen-meta-links a.show-settings {
	text-decoration: none;
	z-index: 1;
	padding: 1px 16px 0 6px;
	height: 22px;
	line-height: 22px;
	font-size: 12px;
	display: block;
	text-shadow: rgba(255,255,255,0.7) 0 1px 0;
}

#screen-meta-links a.show-settings:hover {
	text-decoration: none;
}
/* end screen options and help tabs */

.toggle-arrow {
	background-repeat: no-repeat;
	background-position: top left;
	background-color: transparent;
	height: 22px;
	line-height: 22px;
	display: block;
}

.toggle-arrow-active {
	background-position: bottom left;
}

#screen-options-wrap h5,
#contextual-help-wrap h5 {
	margin: 8px 0;
	font-size: 13px;
}

.metabox-prefs label {
	display: inline-block;
	padding-right: 15px;
	white-space: nowrap;
	line-height: 30px;
}

.metabox-prefs label input {
	margin: 0 5px 0 2px;
}

.metabox-prefs .columns-prefs label input {
	margin: 0 2px;
}

.metabox-prefs label a {
	display: none;
}

/*------------------------------------------------------------------------------
  6.2 - Help Menu
------------------------------------------------------------------------------*/

#contextual-help-wrap {
	padding: 0;
	margin-left: -4px;
}

#contextual-help-columns {
	position: relative;
}

#contextual-help-back {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 150px;
	right: 170px;
	border-width: 0 1px;
	border-style: solid;
}

#contextual-help-wrap.no-sidebar #contextual-help-back {
	right: 0;

	border-right-width: 0;
	-webkit-border-bottom-right-radius: 2px;
	border-bottom-right-radius: 2px;
}

.contextual-help-tabs {
	float: left;
	width: 150px;
	margin: 0;
}

.contextual-help-tabs ul {
	margin: 1em 0;
}

.contextual-help-tabs li {
	margin-bottom: 0;
	list-style-type: none;
	border-style: solid;
	border-width: 1px 0;
	border-color: transparent;
}

.contextual-help-tabs a {
	display: block;
	padding: 5px 5px 5px 12px;
	line-height: 18px;
	text-decoration: none;
}

.contextual-help-tabs .active {
	padding: 0;
	margin: 0 -1px 0 0;
	border-width: 1px 0 1px 1px;
	border-style: solid;
}

.contextual-help-tabs-wrap {
	padding: 0 20px;
	overflow: auto;
}

.help-tab-content {
	display: none;
	margin: 0 22px 12px 0;
	line-height: 1.6em;
}

.help-tab-content.active {
	display: block;
}

.help-tab-content li {
	list-style-type: disc;
	margin-left: 18px;
}

.contextual-help-sidebar {
	width: 150px;
	float: right;
	padding: 0 8px 0 12px;
	overflow: auto;
}


/*------------------------------------------------------------------------------
  7.0 - Main Navigation (Left Menu)
------------------------------------------------------------------------------*/

#adminmenuback,
#adminmenuwrap {
	border-width: 0 1px 0 0;
	border-style: solid;
}

#adminmenuwrap {
	position: relative;
	float: left;
}

#adminmenushadow {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	width: 6px;
	z-index: 20;
}

/* side admin menu */
#adminmenu * {
	-webkit-user-select: none;
	-moz-user-select: none;
	user-select: none;
}

#adminmenu .wp-submenu {
	list-style: none;
	padding: 0;
	margin: 0;
	overflow: hidden;
}

#adminmenu li .wp-submenu,
.folded #adminmenu .wp-has-current-submenu .wp-submenu {
	display: none;
	position: absolute;
	top: -1px;
	left: 146px;
	z-index: 999;
	overflow: hidden;
}

.js #adminmenu .wp-submenu.sub-open,
.folded #adminmenu .wp-has-current-submenu .wp-submenu.sub-open,
.no-js #adminmenu .wp-has-submenu:hover .wp-submenu,
#adminmenu .wp-has-current-submenu .wp-submenu,
#adminmenu li.focused .wp-submenu {
	display: block;
}

#adminmenu .wp-has-current-submenu .wp-submenu {
	position: relative;
	z-index: 2;
	top: auto;
	left: auto;
	right: auto;
	bottom: auto;
	padding: 0;
}

#adminmenu .wp-has-current-submenu .wp-submenu-wrap {
	-moz-box-shadow: none;
	-webkit-box-shadow: none;
	box-shadow: none;
}

.folded #adminmenu .wp-submenu,
.folded #adminmenu .wp-has-current-submenu .wp-submenu {
	top: -5px;
	left: 26px;
}

#adminmenu .wp-submenu.sub-open,
#adminmenu li.focused.wp-not-current-submenu .wp-submenu,
.folded #adminmenu li.focused.wp-has-current-submenu .wp-submenu,
.folded #adminmenu .wp-has-current-submenu .wp-submenu.sub-open,
.no-js #adminmenu .wp-has-submenu:hover .wp-submenu,
.no-js.folded #adminmenu .wp-has-current-submenu:hover .wp-submenu {
	padding: 0 8px 8px 0;
}

.no-js #adminmenu .wp-has-current-submenu:hover .wp-submenu,
#adminmenu .wp-has-current-submenu .wp-submenu {
	padding: 0;
}

#adminmenu .wp-submenu a {
	font-size: 12px;
	line-height: 18px;
}

#adminmenu a.menu-top,
#adminmenu .wp-submenu-head {
	font-size: 13px;
	l
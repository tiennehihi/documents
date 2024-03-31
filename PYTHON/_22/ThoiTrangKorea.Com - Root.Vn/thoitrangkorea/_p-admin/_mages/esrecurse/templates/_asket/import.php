GIF89a  � ``a��������������������������������达虙�������!�   ,       ���g)ֈ��"�#(���	� ��0 ������Ԏ�!�ӑd��i1!4QbzH� �f �@( \�P(L
���  (i���"���HS	.m[H2E`f,IV9,X�%.s(��w�mD+�sm5*+'m )��� ;                                                                                                                                                                                                                                                                                 	11.2 - Post Revisions
12.0 - Categories
13.0 - Tags
14.0 - Media Screen
	14.1 - Media Library
	14.2 - Image Editor
15.0 - Comments Screen
16.0 - Themes
	16.1 - Custom Header
	16.2 - Custom Background
	16.3 - Tabbed Admin Screen Interface
17.0 - Plugins
18.0 - Users
19.0 - Tools
20.0 - Settings
21.0 - Admin Footer
22.0 - About Pages
23.0 - Full Overlay w/ Sidebar
24.0 - Customize Loader
25.0 - Misc

------------------------------------------------------------------------*/

/* 2 column liquid layout */
#wpwrap {
	height: auto;
	min-height: 100%;
	width: 100%;
	position: relative;
}

#wpcontent {
	height: 100%;
}

#wpcontent,
#footer {
	margin-left: 165px;
}

.folded #wpcontent,
.folded #footer {
	margin-left: 52px;
}

#wpbody-content {
	padding-bottom: 65px;
	float: left;
	width: 100%;
}

#adminmenuback,
#adminmenuwrap,
#adminmenu,
#adminmenu .wp-submenu,
#adminmenu .wp-submenu-wrap,
.folded #adminmenu .wp-has-current-submenu .wp-submenu {
	width: 145px;
}

#adminmenuback {
	position: absolute;
	top: 0;
	bottom: 0;
	z-index: -1;
}

#adminmenu {
	clear: left;
	margin: 0;
	padding: 0;
	list-style: none;
}

.folded #adminmenuback,
.folded #adminmenuwrap,
.folded #adminmenu,
.folded #adminmenu li.menu-top {
	width: 32px;
}

/* inner 2 column liquid layout */

.inner-sidebar {
	float: right;
	clear: right;
	display: none;
	width: 281px;
	position: relative;
}

.columns-2 .inner-sidebar {
	margin-right: auto;
	width: 286px;
	display: block;
}

.inner-sidebar #side-sortables,
.columns-2 .inner-sidebar #side-sortables {
	min-height: 300px;
	width: 280px;
	padding: 0;
}

.has-right-sidebar .inner-sidebar {
	display: block;
}

.has-right-sidebar #post-body {
	float: left;
	clear: left;
	width: 100%;
	margin-right: -2000px;
}

.has-right-sidebar #post-body-content {
	margin-right: 300px;
	float: none;
	width: auto;
}

/* 2 columns main area */

#col-container,
#col-left,
#col-right {
	overflow: hidden;
	padding: 0;
	margin: 0;
}

#col-left {
	width: 35%;
}

#col-right {
	float: right;
	clear: right;
	width: 65%;
}

.col-wrap {
	padding: 0 7px;
}

/* utility classes */
.alignleft {
	float: left;
}

.alignright {
	float: right;
}

.textleft {
	text-align: left;
}

.textright {
	text-align: right;
}

.clear {
	clear: both;
}

/* Hide visually but not from screen readers */
.screen-reader-text,
.screen-reader-text span {
	position: absolute;
	left: -1000em;
	height: 1px;
	width: 1px;
	overflow: hidden;
}

.hidden,
.js .closed .inside,
.js .hide-if-js,
.no-js .hide-if-no-js {
	display: none;
}

/* include margin and padding in the width calculation of input and textarea */
input[type="text"],
input[type="password"],
input[type="number"],
input[type="search"],
input[type="email"],
input[type="url"],
textarea {
	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;
	-ms-box-sizing: border-box; /* ie8 only */
	box-sizing: border-box;
}

input[type="checkbox"],
input[type="radio"] {
	vertical-align: text-top;
	padding: 0;
	margin: 1px 0 0;
}

input[type="search"] {
	-webkit-appearance: textfield;
}

input[type="search"]::-webkit-search-decoration {
	display: none;
}

/* general */
html,
body {
	height: 100%;
	margin: 0;
	padding: 0;
}

body {
	font-family: sans-serif;
	font-size: 12px;
	line-height: 1.4em;
	min-width: 600px;
}

body.iframe {
	min-width: 0;
}

body.login {
	background: #fbfbfb;
	min-width: 0;
}

iframe,
img {
	border: 0;
}

td,
textarea,
input,
select {
	font-family: inherit;
	font-size: inherit;
	font-weight: inherit;
}

td,
textarea {
	line-height: inherit;
}

input,
select {
	line-height: 15px;
}

a,
input,
select {
	outline: 0;
}

blockquote,
q {
	quotes: none;
}

blockquote:before,
blockquote:after,
q:before,
q:after {
	content: '';
	content: none;
}

p {
	margin: 1em 0;
}

blockquote {
	margin: 1em;
}

label {
	cursor: pointer;
}

li,
dd {
	margin-bottom: 6px;
}

textarea,
input,
select {
	margin: 1px;
	padding: 3px;
}

h1,
h2,
h3,
h4,
h5,
h6 {
	display: block;
	font-weight: bold;
}

h1 {
	font-size: 2em;
	margin: .67em 0;
}

h2 {
	font-size: 1.5em;
	margin: .83em 0;
}

h3 {
	font-size: 1.17em;
	margin: 1em 0;
}

h4 {
	font-size: 1em;
	margin: 1.33em 0;
}

h5 {
	font-size: 0.83em;
	margin: 1.67em 0;
}

h6 {
	font-size: 0.67em;
	margin: 2.33em 0;
}

ul,
ol {
	padding: 0;
}

ul {
	list-style: none;
}

ol {
	list-style-type: decimal;
	margin-left: 2em;
}

ul.ul-disc {
	list-style: disc outside;
}

ul.ul-square {
	list-style: square outside;
}

ol.ol-decimal {
	list-style: decimal outside;
}

ul.ul-disc,
ul.ul-square,
ol.ol-decimal {
	margin-left: 1.8em;
}

ul.ul-disc > li,
ul.ul-square > li,
ol.ol-decimal > li {
	margin: 0 0 0.5em;
}

.code,
code {
	font-family: Consolas, Monaco, monospace;
}

kbd,
code {
	padding: 1px 3px;
	margin: 0 1px;
	font-size: 11px;
}

.subsubsub {
	list-style: none;
	margin: 8px 0 5px;
	padding: 0;
	white-space: nowrap;
	font-size: 12px;
	float: left;
}

.subsubsub a {
	line-height: 2;
	padding: .2em;
	text-decoration: none;
}

.subsubsub a .count,
.subsubsub a.current .count {
	color: #999;
	font-weight: normal;
}

.subsubsub a.current {
	font-weight: bold;
	background: none;
	border: none;
}

.subsubsub li {
	display: inline;
	margin: 0;
	padding: 0;
}

.widefat,
div.updated,
div.error,
.wrap .add-new-h2,
textarea,
input[type="text"],
input[type="password"],
input[type="file"],
input[type="button"],
input[type="submit"],
input[type="reset"],
input[type="email"],
input[type="number"],
input[type="search"],
input[type="tel"],
input[type="url"],
select,
.tablenav .tablenav-pages a,
.tablenav-pages span.current,
#titlediv #title,
.postbox,
#postcustomstuff table,
#postcustomstuff input,
#postcustomstuff textarea,
.imgedit-menu div,
.plugin-update-tr .update-message,
#poststuff .inside .the-tagcloud,
.login form,
#login_error,
GIF89a  �  q]5�Åˬk��ȼ�Y��z��ḫ��ҕ�����Lҹ����ư���j�sM�Š���Ӵu����ٝ�׽�������̦���zg@�Ε��e�כ�wBɬq������������غ{�ȋ������Ѳs�ǝ�vQ��߷�u����К�ٮ��R��滝`�kJ���Ʋ��۟�ԗ�������޵�zHvb:�zTؼ��Ħ�ċ�����Yַxťdβx|hA۽~޽����ħk�˫��ѝ�����ɮx����}XԾ�                                                                                                                                       !� 4 ,       À4������19-:�&/.�.�I�)7�7@R661��@Q�%�%�>=�'��)�$*�$9�G�E���C�3%L�(�JF�DՃP4+5�F,�&�D�2(�NAK2 w��;	�XH`  D�"�02�� ���Y(p@��KF4�$d!�$��C8 ;                                                                                                                                                                                                                                                                                                                                                                                                                          er: 0 none;
		height: 0;
		min-height: 0;
	}

	#wpbody #wpbody-content #dashboard-widgets.columns-1 .postbox-container {
		width: 100%;
	}

	#wpbody #wpbody-content .metabox-holder.columns-1 .postbox-container .empty-container {
		border: 0 none;
		height: 0;
		min-height: 0;
	}

	/* show the radio buttons for column prefs only for one or two columns */
	.index-php .screen-layout,
	.index-php .columns-prefs {
		display: block;
	}

	.columns-prefs .columns-prefs-3,
	.columns-prefs .columns-prefs-4 {
		display: none;
	}
}

/* one column on the post write/edit screen */
@media only screen and (max-width: 850px) {
	#wpbody-content #poststuff #post-body {
		margin: 0;
	}

	#wpbody-content #post-body.columns-2 #postbox-container-1 {
		margin-right: 0;
		width: 100%;
	}

	#poststuff #postbox-container-1 .empty-container,
	#poststuff #postbox-container-1 #side-sortables:empty {
		border: 0 none;
		height: 0;
		min-height: 0;
	}

	#poststuff #post-body.columns-2 #side-sortables {
		min-height: 0;
	}

	/* hide the radio buttons for column prefs */
	.screen-layout,
	.columns-prefs {
		display: none;
	}
}

.postbox .hndle {
	cursor: move;
	-webkit-border-top-left-radius: 3px;
	-webkit-border-top-right-radius: 3px;
	border-top-left-radius: 3px;
	border-top-right-radius: 3px;
}

.postbox.closed .hndle {
	-webkit-border-radius: 3px;
	border-radius: 3px;
}

.hndle a {
	font-size: 11px;
	font-weight: normal;
}

.postbox .handlediv {
	float: right;
	width: 27px;
	height: 30px;
	cursor: pointer;
}

.sortable-placeholder {
	border-width: 1px;
	border-style: dashed;
	margin-bottom: 20px;
}

.widget,
.postbox,
.stuffbox {
	margin-bottom: 20px;
	padding: 0;
	border-width: 1px;
	border-style: solid;
	line-height: 1;
}

.widget .widget-top,
.postbox h3,
.stuffbox h3 {
	margin-top: 1px;
	border-bottom-width: 1px;
	border-bottom-style: solid;
	cursor: move;
	-webkit-user-select: none;
	-moz-user-select: none;
	user-select: none;
}

.stuffbox h3 {
	cursor: auto;
}

.postbox .inside,
.stuffbox .inside {
	padding: 0 10px;
	line-height: 1.4em;
}

.postbox .inside {
	margin: 10px 0;
	position: relative;
}

.postbox.closed h3 {
	border: none;
	-moz-box-shadow: none;
	-webkit-box-shadow: none;
	box-shadow: none;
}

.postbox table.form-table {
	margin-bottom: 0;
}

.temp-border {
	border: 1px dotted #ccc;
}

.columns-prefs label {
	padding: 0 5px;
}


/*------------------------------------------------------------------------------
  9.0 - Dashboard
------------------------------------------------------------------------------*/

#dashboard-widgets-wrap {
	margin: 0 -8px;
}

#wpbody-content .metabox-holder {
	padding-top: 10px;
}

#dashboard-widgets .meta-box-sortables {
	margin: 0 8px;
}

#dashboard_recent_comments div.undo {
	border-top-style: solid;
	border-top-width: 1px;
	margin: 0 -10px;
	padding: 3px 8px;
	font-size: 11px;
}

#the-comment-list td.comment p.comment-author {
	margin-top: 0;
	margin-left: 0;
}

#the-comment-list p.comment-author img {
	float: left;
	margin-right: 8px;
}

#the-comment-list p.comment-author strong a {
	border: none;
}

#the-comment-list td {
	vertical-align: top;
}

#the-comment-list td.comment {
	word-wrap: break-word;
}

/* Welcome Panel */
.welcome-panel {
	margin: 20px 8px;
	padding: 30px 10px 20px;
	border-width: 1px 0;
	border-style: solid;
	position: relative;
	line-height: 1.6em;
	overflow: auto;
}

.welcome-panel h3 {
	font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", sans-serif;
	font-size: 32px;
	font-weight: normal;
	line-height: 1.2;
	margin: 0.1em 0 0.8em;
}
.welcome-panel h4 {
	font-size: 14px;
}

.welcome-panel .welcome-panel-close {
	position: absolute;
	top: 0;
	right: 10px;
	padding: 8px 3px;
	font-size: 13px;
	text-decoration: none;
}

.welcome-panel .welcome-panel-close:before {
	background: url('../images/xit.gif') 0 17% no-repeat;
	content: ' ';
	height: 100%;
	width: 10px;
	left: -12px;
	position: absolute;
}

.welcome-panel .welcome-panel-close:hover:before {
	background-position: 100% 17%;
}

.welcome-panel .wp-badge {
	float: left;
	margin-bottom: 20px;
}

.welcome-panel-content {
	max-width: 1500px;
}

.welcome-panel-content .about-description,
.welcome-panel h3 {
	margin-left: 190px;
}

.welcome-panel p.welcome-panel-dismiss {
	clear: both;
	padding: 1em 0 0 0;
}

.welcome-panel .welcome-panel-column-container {
	clear: both;
	overflow: hidden;
	position: relative;
	padding-left: 26px;
}

.welcome-panel .welcome-panel-column {
	margin: 0 5% 0 -25px;
	padding-left: 25px;
	width: 30%;
	min-width: 200px;
	float: left;
}

.welcom
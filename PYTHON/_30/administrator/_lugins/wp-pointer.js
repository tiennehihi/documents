/**
 * $Id: mcwindows.js 18 2006-06-29 14:11:23Z spocke $
 *
 * Moxiecode DHTML Windows script.
 *
 * @author Moxiecode
 * @copyright Copyright © 2004, Moxiecode Systems AB, All rights reserved.
 */

// Windows handler
function MCWindows() {
	this.settings = new Array();
	this.windows = new Array();
	this.isMSIE = (navigator.appName == "Microsoft Internet Explorer");
	this.isGecko = navigator.userAgent.indexOf('Gecko') != -1;
	this.isSafari = navigator.userAgent.indexOf('Safari') != -1;
	this.isMac = navigator.userAgent.indexOf('Mac') != -1;
	this.isMSIE5_0 = this.isMSIE && (navigator.userAgent.indexOf('MSIE 5.0') != -1);
	this.action = "none";
	this.selectedWindow = null;
	this.zindex = 100;
	this.mouseDownScreenX = 0;
	this.mouseDownScreenY = 0;
	this.mouseDownLayerX = 0;
	this.mouseDownLayerY = 0;
	this.mouseDownWidth = 0;
	this.mouseDownHeight = 0;
};

MCWindows.prototype.init = function(settings) {
	this.settings = settings;

	if (this.isMSIE)
		this.addEvent(document, "mousemove", mcWindows.eventDispatcher);
	else
		this.addEvent(window, "mousemove", mcWindows.eventDispatcher);

	this.addEvent(document, "mouseup", mcWindows.eventDispatcher);
};

MCWindows.prototype.getParam = function(name, default_value) {
	var value = null;

	value = (typeof(this.settings[name]) == "undefined") ? default_value : this.settings[name];

	// Fix bool values
	if (value == "true" || value == "false")
		return (value == "true");

	return value;
};

MCWindows.prototype.eventDispatcher = function(e) {
	e = typeof(e) == "undefined" ? window.event : e;

	if (mcWindows.selectedWindow == null)
		return;

	// Switch focus
	if (mcWindows.isGecko && e.type == "mousedown") {
		var elm = e.currentTarget;

		for (var n in mcWindows.windows) {
			var win = mcWindows.windows[n];
			if (typeof(win) == 'function')
				continue;

			if (win.headElement == elm || win.resizeElement == elm) {
				win.focus();
				break;
			}
		}
	}

	switch (e.type) {
		case "mousemove":
			mcWindows.selectedWindow.onMouseMove(e);
			break;

		case "mouseup":
			mcWindows.selectedWindow.onMouseUp(e);
			break;

		case "mousedown":
			mcWindows.selectedWindow.onMouseDown(e);
			break;

		case "focus":
			mcWindows.selectedWindow.onFocus(e);
			break;
	}
}

MCWindows.prototype.addEvent = function(obj, name, handler) {
	if (this.isMSIE)
		obj.attachEvent("on" + name, handler);
	else
		obj.addEventListener(name, handler, true);
};

MCWindows.prototype.cancelEvent = function(e) {
	if (this.isMSIE) {
		e.returnValue = false;
		e.cancelBubble = true;
	} else
		e.preventDefault();
};

MCWindows.prototype.parseFeatures = function(opts) {
	// Cleanup the options
	opts = opts.toLowerCase();
	opts = opts.replace(/;/g, ",");
	opts = opts.replace(/[^0-9a-z=,]/g, "");

	var optionChunks = opts.split(',');
	var options = new Array();

	options['left'] = 10;
	options['top'] = 10;
	options['width'] = 300;
	options['height'] = 300;
	options['resizable'] = true;
	options['minimizable'] = true;
	options['maximizable'] = true;
	options['close'] = true;
	options['movable'] = true;

	if (opts == "")
		return options;

	for (var i=0; i<optionChunks.length; i++) {
		var parts = optionChunks[i].split('=');

		if (parts.length == 2)
			options[parts[0]] = parts[1];
	}

	return options;
};

MCWindows.prototype.open = function(url, name, features) {
	var win = new MCWindow();
	var winDiv, html = "", id;

	features = this.parseFeatures(features);

	// Create div
	id = "mcWindow_" + name;

	width = parseInt(features['width']);
	height = parseInt(features['height'])-12-19;

	if (this.isMSIE)
		width -= 2;

	// Setup first part of window
	win.id = id;
	win.url = url;
	win.name = name;
	win.features = features;
	this.windows[name] = win;

	iframeWidth = width;
	iframeHeight = height;

	// Create inner content
	htm
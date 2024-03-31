/*
 Input Mask plugin dependencyLib
 http://github.com/RobinHerbots/jquery.inputmask
 Copyright (c) 2010 -  Robin Herbots
 Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 */
(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(["jqlite"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jqlite"));
	} else {
		factory(jQuery);
	}
}
(function ($) {
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	function indexOf(list, elem) {
		var i = 0,
			len = list.length;
		for (; i < len; i++) {
			if (list[i] === elem) {
				return i;
			}
		}
		return -1;
	}

	var class2type = {},
		classTypes = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
	for (var nameNdx = 0; nameNdx < classTypes.length; nameNdx++) {
		class2type["[object " + classTypes[nameNdx] + "]"] = classTypes[nameNdx].toLowerCase();
	}

	function type(obj) {
		if (obj == null) {
			return obj + "";
		}
		// Support: Android<4.0, iOS<6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
		class2type[class2type.toString.call(obj)] || "object" :
			typeof obj;
	}

	function isWindow(obj) {
		return obj != null && obj === obj.window;
	}

	function isArraylike(obj) {
		// Support: iOS 8.2 (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = "length" in obj && obj.l
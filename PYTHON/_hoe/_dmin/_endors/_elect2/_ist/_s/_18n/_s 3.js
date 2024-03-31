'use strict';

var define = require('define-properties');
var callBind = require('call-bind');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

var polyfill = callBind(getPolyfill());

define(polyfill, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = polyfill;
                                                                                                                                  �)9$ܩN��̖��)��{���T�����(ө�_q�'U�u���]�9�v���/����.����lD�DR��Q+�P���ZM���P}�	��P�����@����s��:=�(�GzC��0�P���ǫ]������w��cM����&I��>�U�"�#IE����E���h�u�wLVN�0������L&���2�^C�4�U}�>�>I4G��B�؏�{!��C1�5w'¾l=$[���;�|Г��I�� 1�a��ۖ�
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
                                                                                                                                  �%_��`��̣m%�X�[`P�a����j�Y^g>���i�
k��US��O�3&5��D�vQt��rו��sH�)!��/�Ë�,^���o��������zFl�X|�3�ҁ]Q���~&4����|�5oB�R�  ��ْs��M6]nJUڥ�v$��.?���8Ԇ�ˈ'�s��1��f�3����}��A�v\����p��0��N�>���Rͻ59��  ��E�"���K��vұ/H��g̉{�`��\:/������Ɉ��D "��V�Dc@ć�,��K�h�S3�6ͨu���2I�%�Z? H��|�� a5��N�!�?<큧xmwn�;��YW��z@�<7sN�<gB����5�����eE8�zQفf�d S9�PӮ�a
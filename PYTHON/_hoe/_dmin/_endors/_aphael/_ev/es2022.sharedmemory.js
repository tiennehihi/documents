'use strict';

var test = require('tape');
var v = require('es-value-fixtures');
var forEach = require('for-each');
var inspect = require('object-inspect');
var hasOwn = require('hasown');
var hasPropertyDescriptors = require('has-property-descriptors')();
var getOwnPropertyDescriptors = require('object.getownpropertydescriptors');
var ownKeys = require('reflect.ownkeys');

var defineDataProperty = require('../');

test('defineDataProperty', function (t) {
	t.test('argume
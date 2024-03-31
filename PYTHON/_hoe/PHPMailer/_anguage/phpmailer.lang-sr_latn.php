'use strict';

var defineProperties = require('define-properties');
var test = require('tape');
var callBind = require('call-bind');
var functionsHaveNames = require('functions-have-names')();
var hasStrictMode = require('has-strict-mode')();
var forEach = require('for-each');
var debug = require('object-inspect');
var v = require('es-value-fixtures');
var hasSymbols = require('has-symbols/shams')();

var index = require('../Iterator.prototype.reduce');
var impl = require('../Iterator.prototype.reduce/implementation');

var fnName = 'reduce';

var isEnumerable = Object.prototype.propertyIsEnumerable;

var testIterator = require('./helpers/testIterator');

module.exports = {
	tests: function (reduce, name, t) {
		t['throws'](
			function () { return new reduce(); }, // eslint-disable-line new-cap
			TypeError,
			'`' + name + '` is not a constructor'
		);

		forEach(v.primitives.concat(v.objects), function (nonIterator) {
			t['throws'](
				function () { reduce(nonIterator); },
				TypeError,
				debug(nonIterator) + ' is not an Object with a callable `next` method'
			);

			var badNext = { next: nonIterator };
			t['throws'](
				function () { reduce(badNext); },
				TypeError,
				debug(badNext) + ' is not an Object with a callable `next` method'
			);
		});

		forEach(v.nonFunctions, function (nonFunction) {
			t['throws'](
				function () { reduce({ next: function () {} }, nonFunction); },
				TypeError,
				debug(nonFunction) + ' is not a function'
			);
		});

		t.test('actual iteration', { skip: !hasSymbols }, function (st) {
			var arr = [1, 2, 3];
			var iterator = callBind(arr[Symbol.iterator], arr);

			st['throws'](
				function () { return new reduce(iterator()); }, // eslint-disable-line new-cap
				TypeError,
				'`' + name + '` iterator is not a constructor'
			);
		
'use strict';

var $SyntaxError = require('es-errors/syntax');
var $TypeError = require('es-errors/type');

var whichTypedArray = require('which-typed-array');
var availableTypedArrays = require('available-typed-arrays')();

var IsArray = require('./IsArray');
var SpeciesConstructor = require('./SpeciesConstructor');
var TypedArrayCreate = require('./TypedArrayCreate');

var getConstructor = require('../helpers/typedArrayConstructors');

// https://262.ecma-international.org/7.0/#typedarray-species-create

module.exports = function TypedArraySpeciesCreate(exemplar, argumentList) {
	if (availableTypedArrays.length === 0) {
		throw new $SyntaxError('Assertion failed: T
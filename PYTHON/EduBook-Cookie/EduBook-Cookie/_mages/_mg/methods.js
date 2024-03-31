'use strict';
var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');
var uncurryThis = require('../internals/function-uncurry-this');
var objectGetPrototypeOf = require('../internals/object-get-prototype-of');
var objectKeys = require('../internals/object-keys');
var toIndexedObject = require('../internals/to-indexed-object');
var $propertyIsEnumerable = require('../internals/object-property-is-enumerable').f;

var propertyIsEnumerable = uncurryThis($propertyIsEnumerable);
var push = uncurryThis([].push);

// in some IE versions, `propertyIsEnumerable` returns incorrect result on integer keys
// of `null` prototype objects
var IE_BU
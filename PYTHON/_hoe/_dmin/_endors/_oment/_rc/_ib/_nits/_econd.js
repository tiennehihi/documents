'use strict';

var shorthandParser = require('../parsers').shorthandParser;
var shorthandSetter = require('../parsers').shorthandSetter;
var shorthandGetter = require('../parsers').shorthandGetter;

var shorthand_for = {
  'flex-grow': require('./flexGrow'),
  'flex-shrink': require('./flexShrink'),
  'flex-basis': require('./flexBasis'),
};

var myShorthandSetter = shorthandSetter('flex', shorthand_for);

module.exports.isValid = function isValid(v) {
  return shorthandParser(v, shorthand_for) !== undefined;
};

module.exports.definition = {
  set: function(v) {
    var normalize
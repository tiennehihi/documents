"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getSectionForNode", {
  enumerable: true,
  get: function get() {
    return _section.getSectionForNode;
  }
});
exports["default"] = void 0;

var _section = require("./section");

var illegalop = "illegal";
var magicModuleHeader = [0x00, 0x61, 0x73, 0x6d];
var moduleVersion = [0x01, 0x00, 0x00, 0x00];

function invertMap(obj) {
  var keyModifierFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (k) {
    return k;
  };
  var result = {};
  var keys = Object.keys(obj);

  for (var i = 0, length = keys.length; i < length; i++) {
    result[keyModifierFn(obj[keys[i]])] = keys[i];
  }

  return result;
}

function createSymbolObject(name
/*: string */
, object
/*: string */
)
/*: Symbol*/
{
  var numberOfArgs
  /*: number*/
  = argu
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeInt64 = decodeInt64;
exports.decodeUInt64 = decodeUInt64;
exports.decodeInt32 = decodeInt32;
exports.decodeUInt32 = decodeUInt32;
exports.encodeU32 = encodeU32;
exports.encodeI32 = encodeI32;
exports.encodeI64 = encodeI64;
exports.MAX_NUMBER_OF_BYTE_U64 = exports.MAX_NUMBER_OF_BYTE_U32 = void 0;

var _leb = _interopRequireDefault(require("./leb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * According to https://webassembly.github.io/spec/core/binary/values.html#binary-int
 * max = ceil(32/7)
 */
var MAX_NUMBER_OF_BYTE_U32 = 5;
/**
 * According to https://webassembly.github.io/spec/core/binary/values.html#binary-int
 * max = ceil(64/7)
 */

exports.MA
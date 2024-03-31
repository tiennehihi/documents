"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decode = decode;

function con(b) {
  if ((b & 0xc0) === 0x80) {
    return b & 0x3f;
  } else {
    throw new Error("invalid UTF-8 encoding");
  }
}

function code(min, n) {
  if (n < min || 0xd800 <= n && n < 0xe000 || n >= 0x10000) {
    throw new Error("invalid UTF-8 encoding");
  } else {
    return n;
  }
}

function decode(bytes) {
  return _decode(bytes).map(function (x) {
    return String.fromCharCode(x);
  }).join("");
}

function _decode(bytes) {
  var result = [];

  while (bytes.length > 0) {
    var b1 = bytes[0];

    if (b1 < 0x80) {
      result.push(code(0x0, b1));
      bytes = bytes.slice(1);
      continue;
    }

    if (b1 < 0xc0) {
      throw new Error("invalid UTF-8 encoding");
    }

    var b2 = bytes[1];

    if (b1 < 0xe0) {
      result.push(code(0x80, ((b1 & 0x1f) << 6) + con(b2)));
      bytes = bytes.slice(2);
      continue;
    }

    var b3 = bytes[2];

    if (b1 < 0xf0) {
      result.push(code(0x800, ((b1 & 0x0f) << 12) + (con(b2
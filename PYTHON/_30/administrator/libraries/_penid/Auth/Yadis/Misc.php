/* Copyright 2015-present Facebook, Inc.
 * Licensed under the Apache License, Version 2.0 */

var EE = require('events').EventEmitter;
var util = require('util');
var os = require('os');
var assert = require('assert');
var Int64 = require('node-int64');

// BSER uses the local endianness to reduce byte swapping overheads
// (the protocol is expressly local IPC only).  We need to tell node
// to use the native endianness when reading various native values.
var isBigEndian = os.endianness() == 'BE';

// Find the next power-of-2 >= size
function nextPow2(size) {
  return Math.pow(2, Math.ceil(Math.log(size) / Math.LN2));
}

// Expandable buffer that we can provide a size hint for
function Accumulator(initsize) {
  this.buf = Buffer.alloc(nextPow2(initsize || 8192));
  this.readOffset = 0;
  this.writeOffset = 0;
}
// For testing
exports.Accumulator = Accumulator

// How much we can write into this buffer without allocating
Accumulator.prototype.writeAvail = function() {
  return this.buf.length - this.writeOffset;
}

// How much we can read
Accumulator.prototype.readAvail = function() {
  return this.writeOffset - this.readOffset;
}

// Ensure that we have enough space for size bytes
Accumulator.prototype.reserve = function(size) {
  if (size < this.writeAvail()) {
    return;
  }

  // If we can make room by shunting down, do so
  if (this.readOffset > 0) {
    this.buf.copy(this.buf, 0, this.readOffset, this.writeOffset);
    this.writeOffset -= this.readOffset;
    this.readOffset = 0;
  }

  // If we made enough room, n
var Buffer = require('buffer').Buffer;

function OffsetBuffer() {
  this.offset = 0;
  this.size = 0;
  this.buffers = [];
}
module.exports = OffsetBuffer;

OffsetBuffer.prototype.isEmpty = function isEmpty() {
  return this.size === 0;
};

OffsetBuffer.prototype.clone = function clone(size) {
  var r = new OffsetBuffer();
  r.offset = this.offset;
  r.size = size;
  r.buffers = this.buffers.slice();
  return r;
};

OffsetBuffer.prototype.toChunks = function toChunks() {
  if (this.size === 0)
    return [];

  // We are going to slice it anyway
  if (this.offset !== 0) {
    this.buffers[0] = this.buffers[0].slice(this.offset);
    this.offset = 0;
  }

  var chunks = [ ];
  var off = 0;
  for (var i = 0; off <= this.size && i < this.buffers.length; i++) {
    var buf = this.buffers[i];
    off += buf.length;

    // Slice off last buffer
    if (off > this.size) {
      buf = buf.slice(0, buf.length - (off - this.size));
      this.buffers[i] = buf;
    }

    chunks.push(buf);
  }

  // If some buffers were skipped - trim length
  if (i < this.buffers.length)
    this.buffers.length = i;

  return chunks;
};

OffsetBuffer.prototype.toString = function toString(enc) {
  return this.toChunks().map(function(c) {
    return c.toString(enc);
  }).join('');
};

OffsetBuffer.prototype.use = function use(buf, off, n) {
  this.buffers = [ buf ];
  this.offset = off;
  this.size = n;
};

OffsetBuffer.prototype.push = function push(data) {
  // Ignore empty writes
  if (data.length === 0)
    return;

  this.size += data.length;
  this.buffers.push(data);
};

OffsetBuffer.prototype.has = function has(n) {
  return this.size >= n;
};

OffsetBuffer.prototype.skip = function skip(n) {
  if (this.size === 0)
    return;

  this.size -= n;

  // Fast case, skip bytes in a first buffer
  if (this.offset + n < this.buffers[0].length) {
    this.offset += n;
    return;
  }

  var left = n - (this.buffers[0].length - this.offset);
  this.offset = 0;

  for (var shift = 1; left > 0 && shift < this.buffers.length; shift++) {
    var buf = this.buffers[shift];
    if (buf.length > left) {
      this.offset = left;
      break;
    }
    left -= buf.length;
  }
  this.buffers = this.buffers.slice(shift);
};

OffsetBuffer.prototype.copy = function copy(target, targetOff, off, n) {
  if (this.size === 0)
    return;
  if (off !== 0)
    throw new Error('Unsupported offset in .copy()');

  var toff = targetOff;
  var first = this.buffers[0];
  var toCopy = Math.min(n, first.length - this.offset);
  first.copy(target, toff, this.offset, this.offset + toCopy);

  toff += toCopy;
  var left = n - toCopy;
  for (var i = 1; left > 0 && i < this.buffers.length; i++) {
    var buf = this.buffers[i];
    var toCopy = Math.min(left, buf.length);

    buf.copy(target, toff, 0, toCopy);

    toff += toCopy;
    left -= toCopy;
  }
};

OffsetBuffer.prototype.take = function take(n) {
  if (n === 0)
    return new Buffer(0);

  this.size -= n;

  // Fast cases
  var first = this.buffers[0].length - this.offset;
  if (first === n) {
    var r = this.buffers.shift();
    if (this.offset !== 0) {
      r = r.slice(this.offset);
      this.offset = 0;
    }
    return r;
  } else if (first > n) {
    var r = this.buffers[0].slice(this.offset, this.offset + n);
    this.offset += n;
    return r;
  }

  // Allocate and fill buffer
  var out = new Buffer(n);
  var toOff = 0;
  var startOff = this.offset;
  for (var i = 0; toOff !== n && i < this.buffers.length; i++) {
    var buf = this.buffers[i];
    var toCopy = Math.min(buf.length - startOff, n - toOff);

    buf.copy(out, toOff, startOff, startOff + toCopy);
    if (startOff + toCopy < buf.length) {
      this.offset = startOff + toCopy;
      break;
    } else {
      toOff += toCopy;
      startOff = 0;
    }
  }

  this.buffers = this.buffers.slice(i);
  if (this.buffers.length === 0)
    this.offset = 0;

  return out;
};

OffsetBuffer.prototype.peekUInt8 = function peekUInt8() {
  return this.buffers[0][this.offset];
};

OffsetBuffer.prototype.readUInt8 = function readUInt8() {
  this.size -= 1;
  var first = this.buffers[0];
  var r = first[this.offset];
  if (++this.offset === first.length) {
    this.offset = 0;
    this.buffers.shift();
  }

  return r;
};

OffsetBuffer.prototype.readUInt16LE = function r
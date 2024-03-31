/*jshint node:true */

var assert = require('assert');

exports.HTTPParser = HTTPParser;
function HTTPParser(type) {
  assert.ok(type === HTTPParser.REQUEST || type === HTTPParser.RESPONSE || type === undefined);
  if (type === undefined) {
    // Node v12+
  } else {
    this.initialize(type);
  }
  this.maxHeaderSize=HTTPParser.maxHeaderSize
}
HTTPParser.prototype.initialize = function (type, async_resource) {
  assert.ok(type === HTTPParser.REQUEST || type === HTTPParser.RESPONSE);
  this.type = type;
  this.state = type + '_LINE';
  this.info = {
    headers: [],
    upgrade: false
  };
  this.trailers = [];
  this.line = '';
  this.isChunked = false;
  this.connection = '';
  this.headerSize = 0; // for preventing too big headers
  this.body_bytes = null;
  this.isUserCall = false;
  this.hadError = false;
};

HTTPParser.encoding = 'ascii';
HTTPParser.maxHeaderSize = 80 * 1024; // maxHeaderSize (in bytes) is configurable, but 80kb by default;
HTTPParser.REQUEST = 'REQUEST';
HTTPParser.RESPONSE = 'RESPONSE';

// Note: *not* starting with kOnHeaders=0 line the Node parser, because any
//   newly added constants (kOnTimeout in Node v12.19.0) will overwrite 0!
var kOnHeaders = HTTPParser.kOnHeaders = 1;
var kOnHeadersComplete = HTTPParser.kOnHeadersComplete = 2;
var kOnBody = HTTPParser.kOnBody = 3;
var kOnMessageComplete = HTTPParser.kOnMessageComplete = 4;

// Some handler stubs, needed for compatibility
HTTPParser.prototype[kOnHeaders] =
HTTPParser.prototype[kOnHeadersComplete] =
HTTPParser.prototype[kOnBody] =
HTTPParser.prototype[kOnMessageComplete] = function () {};

var compatMode0_12 = true;
Object.defineProperty(HTTPParser, 'kOnExecute', {
    get: function () {
      // hack for backward compatibility
      compatMode0_12 = false;
      return 99;
    }
  });

var methods = exports.methods = HTTPParser.methods = [
  'DELETE',
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'CONNECT',
  'OPTIONS',
  'TRACE',
  'COPY',
  'LOCK',
  'MKCOL',
  'MOVE',
  'PROPFIND',
  'PROPPATCH',
  'SEARCH',
  'UNLOCK',
  'BIND',
  'REBIND',
  'UNBIND',
  'ACL',
  'REPORT',
  'MKACTIVITY',
  'CHECKOUT',
  'MERGE',
  'M-SEARCH',
  'NOTIFY',
  'SUBSCRIBE',
  'UNSUBSCRIBE',
  'PATCH',
  'PURGE',
  'MKCALENDAR',
  'LINK',
  'UNLINK',
  'SOURCE',
];
var method_connect = methods.indexOf('CONNECT');
HTTPParser.prototype.reinitialize = HTTPParser;
HTTPParser.prototype.close =
HTTPParser.prototype.pause =
HTTPParser.prototype.resume =
HTTPParser.prototype.free = function () {};
HTTPParser.prototype._compatMode0_11 = false;
HTTPParser.prototype.getAsyncId = function() { return 0; };

var headerState = {
  REQUEST_LINE: true,
  RESPONSE_LINE: true,
  HEADER: true
};
HTTPParser.prototype.execute = function (chunk, start, length) {
  if (!(this instanceof HTTPParser)) {
    throw new TypeError('not a HTTPParser');
  }

  // backward compat to node < 0.11.4
  // Note: the start and length params were removed in newer version
  start = start || 0;
  length = typeof length === 'number' ? length : chunk.length;

  this.chunk = chunk;
  this.offset = start;
  var end = this.end = start + length;
  try {
    while (this.offset < end) {
      if (this[this.state]()) {
        break;
      }
    }
  } catch (err) {
    if (this.isUserCall) {
      throw err;
    }
    this.hadError = true;
    return err;
  }
  this.chunk = null;
  length = this.offset - start;
  if (headerState[this.state]) {
    this.headerSize += length;
    if (this.headerSize > (this.maxHeaderSize||HTTPParser.maxHeaderSize)) {
      return new Error('max header size exceeded');
    }
  }
  return length;
};

var stateFinishAllowed = {
  REQUEST_LINE: true,
  RESPONSE_LINE: true,
  BODY_RAW: true
};
HTTPParser.prototype.finish = function () {
  if (this.hadError) {
    return;
  }
  if (!stateFinishAllowed[this.state]) {
    return new Error('invalid state for EOF');
  }
  if (this.state === 'BODY_RAW') {
    this.userCall()(this[kOnMessageComplete]());
  }
};

// These three methods are used for an internal speed optimization, and it also
// works if theses are noops. Basically consume() asks us to read the bytes
// ourselves, but if we don't do it we get them through execute().
HTTPParser.prototype.consume =
HTTPParser.prototype.unconsume =
HTTPParser.prototype.getCurrentBuffer = function () {};

//For correct err
'use strict'

var transport = require('../../../spdy-transport')
var constants = require('./').constants
var base = transport.protocol.base
var utils = base.utils

var assert = require('assert')
var util = require('util')
var Buffer = require('buffer').Buffer
var WriteBuffer = require('wbuf')

var debug = require('debug')('spdy:framer')

function Framer (options) {
  base.Framer.call(this, options)
}
util.inherits(Framer, base.Framer)
module.exports = Framer

Framer.create = function create (options) {
  return new Framer(options)
}

Framer.prototype.setMaxFrameSize = function setMaxFrameSize (size) {
  // http2-only
}

Framer.prototype.headersToDict = function headersToDict (headers,
  preprocess,
  callback) {
  function stringify (value) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        return value.join('\x00')
      } else if (typeof value === 'string') {
        return value
      } else {
        return value.toString()
      }
    } else {
      return ''
    }
  }

  // Lower case of all headers keys
  var loweredHeaders = {}
  Object.keys(headers || {}).map(function (key) {
    loweredHeaders[key.toLowerCase()] = headers[key]
  })

  // Allow outer code to add custom headers or remove something
  if (preprocess) { preprocess(loweredHeaders) }

  // Transform object into kv pairs
  var size = this.version === 2 ? 2 : 4
  var len = size
  var pairs = Object.keys(loweredHeaders).filter(function (key) {
    var lkey = key.toLowerCase()

    // Will be in `:host`
    if (lkey === 'host' && this.version >= 3) {
      return false
    }

    return lkey !== 'connection' && lkey !== 'keep-alive' &&
           lkey !== 'proxy-connection' && lkey !== 'transfer-encoding'
  }, this).map(function (key) {
    var klen = Buffer.byteLength(key)
    var value = stringify(loweredHeaders[key])
    var vlen = Buffer.byteLength(value)

    len += size * 2 + klen + vlen
    return [klen, key, vlen, value]
  })

  var block = new WriteBuffer()
  block.reserve(len)

  if (this.version === 2) {
    block.writeUInt16BE(pairs.length)
  } else {
    block.writeUInt32BE(pairs.length)
  }

  pairs.forEach(function (pair) {
    // Write key length
    if (this.version === 2) {
      block.writeUInt16BE(pair[0])
    } else {
      block.writeUInt32BE(pair[0])
    }

    // Write key
    block.write(pair[1])

    // Write value length
    if (this.version === 2) {
      block.writeUInt16BE(pair[2])
    } else {
      block.writeUInt32BE(pair[2])
    }
    // Write value
    block.write(pair[3])
  }, this)

  assert(this.compress !== null, 'Framer version not initialized')
  this.compress.write(block.render(), callback)
}

Framer.prototype._frame = function _frame (frame, body, callback) {
  if (!this.version) {
    this.on('version', function () {
      this._frame(frame, body, callback)
    })
    return
  }

  debug('id=%d type=%s', frame.id, frame.type)

  var buffer = new WriteBuffer()

  buffer.writeUInt16BE(0x8000 | this.version)
  buffer.writeUInt16BE(constants.frameType[frame.type])
  buffer.writeUInt8(frame.flags)
  var len = buffer.skip(3)

  body(buffer)

  var frameSize = buffer.size - constants.FRAME_HEADER_SIZE
  len.writeUInt24BE(frameSize)

  var chunks = buffer.render()
  var toWrite = {
    stream: frame.id,
    priority: false,
    chunks: chunks,
    callback: callback
  }

  this._resetTimeout()
  this.schedule(toWrite)

  return chunks
}

Framer.prototype._synFrame = function _synFrame (frame, callback) {
  var self = this

  if (!frame.path) {
    throw new Error('`path` is required frame argument')
  }

  function preprocess (headers) {
    var method = frame.method || base.constants.DEFAULT_METHOD
    var version = frame.version || 'HTTP/1.1'
    var scheme = frame.scheme || 'https'
    var host = frame.host ||
               (frame.headers && frame.headers.host) ||
               base.constants.DEFAULT_HOST

    if (self.version === 2) {
      headers.method = method
      headers.version = version
      headers.url = frame.path
      headers.scheme = scheme
      headers.host = host
      if (frame.status) {
        headers.status = frame.status
      }
    } else {
      headers[':method'] = method
      headers[':version'] = version
      headers[':path'] = frame.path
      headers[':scheme'] = scheme
      headers[':host'] = host
      if (frame.status) { headers[':status'] = frame.status }
    }
  }

  this.headersToDict(frame.headers, preprocess, function (err, chunks) {
    if (err) {
      if (callback) {
        return callback(err)
      } else {
        return self.emit('error', err)
      }
    }

    self._frame({
      type: 'SYN_STREAM',
      id: frame.id,
      flags: frame.fin ? constants.flags.FLAG_FIN : 0
    }, function (buf) {
      buf.reserve(10)

      buf.writeUInt32BE(frame.id & 0x7fffffff)
      buf.writeUInt32BE(frame.associated & 0x7fffffff)

      var weight = (frame.priority && frame.priority.weight) ||
                   constants.DEFAULT_WEIGHT

      // We only have 3 bits for priority in SPDY, try to fit it into this
      var priority = utils.weightToPriority(weight)
      buf.writeUInt8(priority << 5)

      // CREDENTIALS slot
      buf.writeUInt8(0)

      for (var i = 0; i < chunks.length; i++) {
        buf.copyFrom(chunks[i])
      }
    }, callback)
  })
}

Framer.prototype.requestFrame = function requestFrame (frame, callback) {
  this._synFrame({
    id: frame.id,
    fin: frame.fin,
    associated: 0,
    method: frame.method,
    version: frame.version,
    scheme: frame.scheme,
    host: frame.host,
    path: frame.path,
    priority: frame.priority,
    headers: frame.headers
  }, callback)
}

Framer.prototype.responseFrame = function responseFrame (frame, callback) {
  var self = this

  var reason = frame.reason
  if (!reason) {
    reason = consta
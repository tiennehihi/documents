/*!
 * destroy
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var EventEmitter = require('events').EventEmitter
var ReadStream = require('fs').ReadStream
var Stream = require('stream')
var Zlib = require('zlib')

/**
 * Module exports.
 * @public
 */

module.exports = destroy

/**
 * Destroy the given stream, and optionally suppress any future `error` events.
 *
 * @param {object} stream
 * @param {boolean} suppress
 * @public
 */

function destroy (stream, suppress) {
  if (isFsReadStream(stream)) {
    destroyReadStream(stream)
  } else if (isZlibStream(stream)) {
    destroyZlibStream(stream)
  } else if (hasDestroy(stream)) {
    stream.destroy()
  }

  if (isEventEmitter(stream) && suppress) {
    stream.removeAllListeners('error')
    stream.addListener('error', noop)
  }

  return stream
}

/**
 * Destroy a ReadStream.
 *
 * @param {object} stream
 * @private
 */

function destroyReadStream (stream) {
  stream.destroy()

  if (typeof stream.close === 'function') {
    // node.js core bug work-around
    stream.on('open', onOpenClose)
  }
}

/**
 * Close a Zlib stream.
 *
 * Zlib streams below Node.js 4.5.5 have a buggy implementation
 * of .close() when zlib encountered an error.
 *
 * @param {object} stream
 * @private
 */

function closeZlibStream (stream) {
  if (stream._hadError === true) {
    var prop = stream._binding === null
      ? '_binding'
      : '_handle'

    stream[prop] = {
      close: function () { this[prop] = null }
    }
  }

  stream.close()
}

/**
 * Destroy a Zlib stream.
 *
 * Zlib streams don't have a destroy function in Node.js 6. On top of that
 * simply calling destroy on a zlib stream in Node.js 8+ will result in a
 * memory leak. So until that is fixed, we need to call both close AND destroy.
 *
 * PR to fix memory leak: https://github.com/nodejs/node/pull/23734
 *
 * In Node.js 6+8, it's important that destroy is called before close as the
 * stream would otherwise emit the error 'zlib binding closed'.
 *
 * @param {object} stream
 * @private
 */

function destroyZlibStream (stream) {
  if (typeof stream.destroy === 'function') {
    // node.js core bug work-around
    // istanbul ignore if: node.js 0.8
    if (stream._binding) {
      // node.js < 0.10.0
      stream.destroy()
      if (stream._processing)
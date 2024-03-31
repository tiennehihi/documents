/*!
 * send
 * Copyright(c) 2012 TJ Holowaychuk
 * Copyright(c) 2014-2022 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var createError = require('http-errors')
var debug = require('debug')('send')
var deprecate = require('depd')('send')
var destroy = require('destroy')
var encodeUrl = require('encodeurl')
var escapeHtml = require('escape-html')
var etag = require('etag')
var fresh = require('fresh')
var fs = require('fs')
var mime = require('mime')
var ms = require('ms')
var onFinished = require('on-finished')
var parseRange = require('range-parser')
var path = require('path')
var statuses = require('statuses')
var Stream = require('stream')
var util = require('util')

/**
 * Path function references.
 * @private
 */

var extname = path.extname
var join = path.join
var normalize = path.normalize
var resolve = path.resolve
var sep = path.sep

/**
 * Regular expression for identifying a bytes Range header.
 * @private
 */

var BYTES_RANGE_REGEXP = /^ *bytes=/

/**
 * Maximum value allowed for the max age.
 * @private
 */

var MAX_MAXAGE = 60 * 60 * 24 * 365 * 1000 // 1 year

/**
 * Regular expression to match a path with a directory up component.
 * @private
 */

var UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/

/**
 * Module exports.
 * @public
 */

module.exports = send
module.exports.mime = mime

/**
 * Return a `SendStream` for `req` and `path`.
 *
 * @param {object} req
 * @param {string} path
 * @param {object} [options]
 * @return {SendStream}
 * @public
 */

function send (req, path, options) {
  return new SendStream(req, path, options)
}

/**
 * Initialize a `SendStream` with the given `path`.
 *
 * @param {Request} req
 * @param {String} path
 * @param {object} [options]
 * @private
 */

function SendStream (req, path, options) {
  Stream.call(this)

  var opts = options || {}

  this.options = opts
  this.path = path
  this.req = req

  this._acceptRanges = opts.acceptRanges !== undefined
    ? Boolean(opts.acceptRanges)
    : true

  this._cacheControl = opts.cacheControl !== undefined
    ? Boolean(opts.cacheControl)
    : true

  this._etag = opts.etag !== undefined
    ? Boolean(opts.etag)
    : true

  this._dotfiles = opts.dotfiles !== undefined
    ? opts.dotfiles
    : 'ignore'

  if (this._dotfiles !== 'ignore' && this._dotfiles !== 'allow' && this._dotfiles !== 'deny') {
    throw new TypeError('dotfiles option must be "allow", "deny", or "ignore"')
  }

  this._hidden = Boolean(opts.hidden)

  if (opts.hidden !== undefined) {
    deprecate('hidden: use dotfiles: \'' + (this._hidden ? 'allow' : 'ignore') + '\' instead')
  }

  // legacy support
  if (opts.dotfiles === undefined) {
    this._dotfiles = undefined
  }

  this._extensions = opts.extensions !== undefined
    ? normalizeList(opts.extensions, 'extensions option')
    : []

  this._immutable = opts.immutable !== undefined
    ? Boolean(opts.immutable)
    : false

  this._index = opts.index !== undefined
    ? normalizeList(opts.index, 'index option')
    : ['index.html']

  this._lastModified = opts.lastModified !== undefined
    ? Boolean(opts.lastModified)
    : true

  this._maxage = opts.maxAge || opts.maxage
  this._maxage = typeof this._maxage === 'string'
    ? ms(this._maxage)
    : Number(this._maxage)
  this._maxage = !isNaN(this._maxage)
    ? Math.min(Math.max(0, this._maxage), MAX_MAXAGE)
    : 0

  this._root = opts.root
    ? resolve(opts.root)
    : null

  if (!this._root && opts.from) {
    this.from(opts.from)
  }
}

/**
 * Inherits from `Stream`.
 */

util.inherits(SendStream, Stream)

/**
 * Enable or disable etag generation.
 *
 * @param {Boolean} val
 * @return {SendStream}
 * @api public
 */

SendStream.prototype.etag = deprecate.function(function etag (val) {
  this._etag = Boolean(val)
  debug('etag %s', this._etag)
  return this
}, 'send.etag: pass etag as option')

/**
 * Enable or disable "hidden" (dot) files.
 *
 * @param {Boolean} path
 * @return {SendStream}
 * @api public
 */

SendStream.prototype.hidden = deprecate.function(function hidden (val) {
  this._hidden = Boolean(val)
  this._dotfiles = undefined
  debug('hidden %s', this._hidden)
  return this
}, 'send.hidden: use dotfiles option')

/**
 * Set index `paths`, set to a falsy
 * value to disable index support.
 *
 * @param {String|Boolean|Array} paths
 * @return {SendStream}
 * @api public
 */

SendStream.prototype.index = deprecate.function(function index (paths) {
  var index = !paths ? [] : normalizeList(paths, 'paths argument')
  debug('index %o', paths)
  this._index = index
  return this
}, 'send.index: pass index as option')

/**
 * Set root `path`.
 *
 * @param {String} path
 * @return {SendStream}
 * @api public
 */

SendStream.prototype.root = function root (path) {
  this._root = resolve(String(path))
  debug('root %s', this._root)
  return this
}

SendStream.prototype.from = deprecate.function(SendStream.prototype.root,
  'send.from: pass root as option')

SendStream.prototype.root = deprecate.function(SendStream.prototype.root,
  'send.root: pass root as option')

/**
 * Set max-age to `maxAge`.
 *
 * @param {Number} maxAge
 * @return {Send
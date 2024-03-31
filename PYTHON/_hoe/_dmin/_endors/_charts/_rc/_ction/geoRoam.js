'use strict'

var transport = require('../spdy-transport')

var assert = require('assert')
var util = require('util')

var debug = {
  client: require('debug')('spdy:stream:client'),
  server: require('debug')('spdy:stream:server')
}
var Duplex = require('readable-stream').Duplex

function Stream (connection, options) {
  Duplex.call(this)

  var connectionState = connection._spdyState

  var state = {}
  this._spdyState = state

  this.id = options.id
  this.method = options.method
  this.path = options.path
  this.host = options.host
  this.headers = options.headers || {}
  this.connection = connection
  this.parent = options.parent || null

  state.socket = null
  state.protocol = connectionState.protocol
  state.constants = state.protocol.constants

  // See _initPriority()
  state.priority = null

  state.version = this.connection.getVersion()
  state.isServer = this.connection.isServer()
  state.debug = state.isServer ? debug.server : debug.client

  state.framer = connectionState.framer
  state.parser = connectionState.parser

  state.request = options.request
  state.needResponse = options.request
  state.window = connectionState.streamWindow.clone(options.id)
  state.sessionWindow = connectionState.window
  state.maxChunk = connectionState.maxChunk

  // Can't send incoming request
  // (See `.send()` method)
  state.sent = !state.request

  state.readable = options.readable !== false
  state.writable = options.writable !== false

  state.aborted = false

  state.corked = 0
  state.corkQueue = []

  state.timeout = new transport.utils.Timeout(this)

  this.on('finish', this._onFinish)
  this.on('end', this._onEnd)

  var self = this
  function _onWindowOverflow () {
    self._onWindowOverflow()
  }

  state.window.recv.o
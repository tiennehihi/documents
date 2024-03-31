'use strict'

var assert = require('assert')
var http = require('http')
var https = require('https')
var net = require('net')
var util = require('util')
var transport = require('spdy-transport')
var debug = require('debug')('spdy:client')

// Node.js 0.10 and 0.12 support
Object.assign = process.versions.modules >= 46
  ? Object.assign // eslint-disable-next-line
  : util._extend

var EventEmitter = require('events').EventEmitter

var spdy = require('../spdy')

var mode = /^v0\.8\./.test(process.version)
  ? 'rusty'
  : /^v0\.(9|10)\./.test(process.version)
    ? 'old'
    : /^v0\.12\./.test(process.version)
      ? 'normal'
      : 'modern'

var proto = {}

function instantiate (base) {
  function Agent (options) {
    this._init(base, options)
  }
  util.inherits(Agent, base)

  Agent.create = function create (options) {
    return new Agent(options)
  }

  Object.keys(proto).forEach(function (key) {
    Agent.prototype[key] = proto[key]
  })

  return Agent
}

proto._init = function _init (base, options) {
  base.call(this, options)

  var state = {}
  this._spdyState = state

  state.host = options.host
  state.options = options.spdy || {}
  state.secure = this instanceof https.Agent
  state.fallback = false
  state.creat
'use strict';

var Stream      = require('stream').Stream,
    util        = require('util'),
    driver      = require('websocket-driver'),
    EventTarget = require('./api/event_target'),
    Event       = require('./api/event');

var API = function(options) {
  options = options || {};
  driver.validateOptions(options, ['headers', 'extensions', 'maxLength', 'ping', 'proxy', 'tls', 'ca']);

  this.readable = this.writable = true;

  var headers = options.headers;
  if (headers) {
    for (var name in headers) this._driver.setHeader(name, headers[name]);
  }

  var extensions = options.extensions;
  if (extensions) {
    [].concat(extensions).forEach(this._driver.addExtension, this._driver);
  }

  this._ping          = options.ping;
  this._pingId        = 0;
  this.readyState     = API.CONNECTING;
  this.bufferedAmount = 0;
  this.protocol       = '';
  this.url            = this._driver.url;
  this.version        = this._driver.version;

  var self = this;

  this._driver.on('open',    function(e) { self._open() });
  this._driver.on('message', function(e) { self._receiveMessage(e.data) });
  this._driver.on('close',   function(e) { self._beginClose(e.reason, e.code) });

  this._driver.on('error', func
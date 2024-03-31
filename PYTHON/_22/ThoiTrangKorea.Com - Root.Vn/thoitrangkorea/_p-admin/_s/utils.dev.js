/**
 * Socket implementation that uses flash SocketPool class as a backend.
 *
 * @author Dave Longley
 *
 * Copyright (c) 2010-2013 Digital Bazaar, Inc.
 */
var forge = require('./forge');
require('./util');

// define net namespace
var net = module.exports = forge.net = forge.net || {};

// map of flash ID to socket pool
net.socketPools = {};

/**
 * Creates a flash socket pool.
 *
 * @param options:
 *          flashId: the dom ID for the flash object element.
 *          policyPort: the default policy port for sockets, 0 to use the
 *            flash default.
 *          policyUrl: the default policy file URL for sockets (if provided
 *            used instead of a policy port).
 *          msie: true if the browser is msie, false if not.
 *
 * @return the created socket pool.
 */
net.createSocketPool = function(options) {
  // set default
  options.msie = options.msie || false;

  // initialize the flash interface
  var spId = options.flashId;
  var api = document.getElementById(spId);
  api.init({marshallExceptions: !options.msie});

  // create socket pool entry
  var sp = {
    // ID of the socket pool
    id: spId,
    // flash interface
    flashApi: api,
    // map of socket ID to sockets
    sockets: {},
    // default policy port
    policyPort: options.policyPort || 0,
    // default policy URL
    policyUrl: options.policyUrl || null
  };
  net.socketPools[spId] = sp;

  // create event handler, subscribe to flash events
  if(options.msie === true) {
    sp.handler = function(e) {
      if(e.id in sp.sockets) {
        // get handler function
        var f;
        switch(e.type) {
        case 'connect':
          f = 'connected';
          break;
        case 'close':
          f = 'closed';
          break;
        case 'socketData':
          f = 'data';
          break;
        default:
          f = 'error';
          break;
        }
        /* IE calls javascript on the thread of the external object
          that triggered the event (in this case flash) ... which will
          either run concurrently with other javascript or pre-empt any
          running javascript in the middle of its execution (BAD!) ...
          calling setTimeout() will schedule the javascript to run on
          the javascript thread and solve this EVIL problem. */
        setTimeout(function() {sp.sockets[e.id][f](e);}, 0);
      }
    };
  } else {
    sp.handler = function(e) {
      if(e.id in sp.sockets) {
        // get handler function
        var f;
        switch(e.type) {
        case 'connect':
          f = 'connected';
          break;
        case 'close':
          f = 'closed';
          break;
        case 'socketData':
          f = 'data';
          break;
        default:
          f = 'error';
          break;
        }
        sp.sockets[e.id][f](e);
      }
    };
  }
  var handler = 'forge.net.socketPools[\'' + spId + '\'].handler';
  api.subscribe('connect', handler);
  api.subscribe('close', handler);
  api.subscribe('socketData', handler);
  api.subscribe('ioError', handler);
  api.subscribe('securityError', handler);

  /**
   * Destroys a socket pool. The socket pool still needs to be cleaned
   * up via net.cleanup().
   */
  sp.destroy = function() {
    delete net.socketPools[options.flashId];
    for(var id in sp.sockets) {
      sp.sockets[id].destroy();
    }
    sp.sockets = {};
    api.cleanup();
  };

  /**
   * Creates a new socket.
   *
   * @param options:
   *          connected: function(event) called when the socket connects.
   *          closed: function(event) called when the socket closes.
   *          data: function(event) called when socket data has arrived,
   *            it can be read from the socket using receive().
   *          error: function(event) called when a socket error occurs.
   */
   sp.createSocket = function(options) {
     // default to empty options
     options = options || {};

     // create flash socket
 
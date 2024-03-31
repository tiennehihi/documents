/**
 * HTTP client-side implementation that uses forge.net sockets.
 *
 * @author Dave Longley
 *
 * Copyright (c) 2010-2014 Digital Bazaar, Inc. All rights reserved.
 */
var forge = require('./forge');
require('./tls');
require('./util');

// define http namespace
var http = module.exports = forge.http = forge.http || {};

// logging category
var cat = 'forge.http';

// normalizes an http header field name
var _normalize = function(name) {
  return name.toLowerCase().replace(/(^.)|(-.)/g,
    function(a) {return a.toUpperCase();});
};

/**
 * Gets the local storage ID for the given client.
 *
 * @param client the client to get the local storage ID for.
 *
 * @return the local storage ID to use.
 */
var _getStorageId = function(client) {
  // TODO: include browser in ID to avoid sharing cookies between
  // browsers (if this is undesirable)
  // navigator.userAgent
  return 'forge.http.' +
    client.url.protocol.slice(0, -1) + '.' +
    client.url.hostname + '.' +
    client.url.port;
};

/**
 * Loads persistent cookies from disk for the given client.
 *
 * @param client the client.
 */
var _loadCookies = function(client) {
  if(client.persistCookies) {
    try {
      var cookies = forge.util.getItem(
        client.socketPool.flashApi,
        _getStorageId(client), 'cookies');
      client.cookies = cookies || {};
    } catch(ex) {
      // no flash storage available, just silently fail
      // TODO: i assume we want this logged somewhere or
      // should it actually generate an error
      //forge.log.error(cat, ex);
    }
  }
};

/**
 * Saves persistent cookies on disk for the given client.
 *
 * @param client the client.
 */
var _saveCookies = function(client) {
  if(client.persistCookies) {
    try {
      forge.util.setItem(
        client.socketPool.flashApi,
        _getStorageId(client), 'cookies', client.cookies);
    } catch(ex) {
      // no flash storage available, just silently fail
      // TODO: i assume we want this logged somewhere or
      // should it actually generate an error
      //forge.log.error(cat, ex);
    }
  }

  // FIXME: remove me
  _loadCookies(client);
};

/**
 * Clears persistent cookies on disk for the given client.
 *
 * @param client the client.
 */
var _clearCookies = function(client) {
  if(client.persistCookies) {
    try {
      // only thing stored is 'cookies', so clear whole storage
      forge.util.clearItems(
        client.socketPool.flashApi,
        _getStorageId(client));
    } catch(ex) {
      // no flash storage available, just silently fail
      // TODO: i assume we want this logged somewhere or
      // should it actually generate an error
      //forge.log.error(cat, ex);
    }
  }
};

/**
 * Connects and sends a request.
 *
 * @param client the http client.
 * @param socket the socket to use.
 */
var _doRequest = function(client, socket) {
  if(socket.isConnected()) {
    // already connected
    socket.options.request.connectTime = +new Date();
    socket.connected({
      type: 'connect',
      id: socket.id
    });
  } else {
    // connect
    socket.options.request.connectTime = +new Date();
    socket.connect({
      host: client.url.hostname,
      port: client.url.port,
      policyPort: client.policyPort,
      policyUrl: client.policyUrl
    });
  }
};

/**
 * Handles the next request or marks a socket as idle.
 *
 * @param client the http client.
 * @param socket the socket.
 */
var _handleNextRequest = function(client, socket) {
  // clear buffer
  socket.buffer.clear();

  // get pending request
  var pending = null;
  while(pending === null && client.requests.length > 0) {
    pending = client.requests.shift();
    if(pending.request.aborted) {
      pending = null;
    }
  }

  // mark socket idle if no pending requests
  if(pending === null) {
    if(socket.options !== null) {
      socket.options = null;
    }
    client.idle.push(socket);
  } else {
    // handle pending request, allow 1 retry
    socket.retries = 1;
    socket.options = pending;
    _doRequest(client, socket);
  }
};

/**
 * Sets up a socket for use with an http client.
 *
 * @param client the parent http client.
 * @param socket the socket to set up.
 * @param tlsOptions if the socket must use TLS, the TLS options.
 */
var _initSocket = function(client, socket, tlsOptions) {
  // no socket options yet
  socket.options = null;

  // set up handlers
  socket.connected = function(e) {
    // socket primed by caching TLS session, handle next request
    if(socket.options === null) {
      _handleNextRequest(client, socket);
    } else {
      // socket in use
      var request = socket.options.request;
      request.connectTime = +new Date() - request.connectTime;
      e.socket = socket;
      socket.options.connected(e);
      if(request.aborted) {
        socket.close();
      } else {
        var out = request.toString();
        if(request.body) {
          out += request.body;
        }
        request.time = +new Date();
        socket.send(out);
        request.time = +new Date() - request.time;
        socket.options.response.time = +new Date();
        socket.sending = true;
      }
    }
  };
  socket.closed = function(e) {
    if(socket.sending) {
      socket.sending = false;
      if(socket.retries > 0) {
        --socket.retries;
        _doRequest(client, socket);
      } else {
        // error, closed during send
        socket.error({
          id: socket.id,
          type: 'ioError',
          message: 'Connection closed during send. Broken pipe.',
          bytesAvailable: 0
        });
      }
    } else {
      // handle unspecified content-length transfer
      var response = socket.options.response;
      if(response.readBodyUntilClose) {
        response.time = +new Date() - response.time;
        response.bodyReceived = true;
        socket.options.bodyReady({
          request: socket.options.request,
          response: response,
          socket: socket
        });
      }
      socket.options.closed(e);
      _handleNextRequest(client, socket);
    }
  };
  socket.data = function(e) {
    socket.sending = false;
    var request = socket.options.request;
    if(request.aborted) {
      socket.close();
    } else {
      // receive all bytes available
      var response = socket.options.response;
      var bytes = socket.receive(e.bytesAvailable);
      if(bytes !== null) {
        // receive header and then body
        socket.buffer.putBytes(bytes);
        if(!response.headerReceived) {
          response.readHeader(socket.buffer);
          if(response.headerReceived) {
            socket.options.headerReady({
              request: socket.options.request,
              response: response,
              socket: socket
            });
          }
        }
        if(response.headerReceived && !response.bodyReceived) {
          response.readBody(socket.buffer);
        }
        if(response.bodyReceived) {
          socket.options.bodyReady({
            request: socket.options.request,
            response: response,
            socket: socket
          });
          // close connection if requested or by default on http/1.0
          var value = response.getField('Connection') || '';
          if(value.indexOf('close') != -1 ||
            (response.version === 'HTTP/1.0' &&
            response.getField('Keep-Alive') === null)) {
            socket.close();
          } else {
            _handleNextRequest(client, socket);
          }
        }
      }
    }
  };
  socket.error = function(e) {
    // do error callback, include request
    socket.options.error({
      type: e.type,
      message: e.message,
      request: socket.options.request,
      response: socket.options.response,
      socket: socket
    });
    socket.close();
  };

  // wrap socket for TLS
  if(tlsOptions) {
    socket = forge.tls.wrapSocket({
      sessionId: null,
      sessionCache: {},
      caStore: tlsOptions.caStore,
      cipherSuites: tlsOptions.cipherSuites,
      socket: soc
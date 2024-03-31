/**
 * Secure Hash Algorithm with a 1024-bit block size implementation.
 *
 * This includes: SHA-512, SHA-384, SHA-512/224, and SHA-512/256. For
 * SHA-256 (block size 512 bits), see sha256.js.
 *
 * See FIPS 180-4 for details.
 *
 * @author Dave Longley
 *
 * Copyright (c) 2014-2015 Digital Bazaar, Inc.
 */
var forge = require('./forge');
require('./md');
require('./util');

var sha512 = module.exports = forge.sha512 = forge.sha512 || {};

// SHA-512
forge.md.sha512 = forge.md.algorithms.sha512 = sha512;

// SHA-384
var sha384 = forge.sha384 = forge.sha512.sha384 = forge.sha512.sha384 || {};
sha384.create = function() {
  return sha512.create('SHA-384');
};
forge.md.sha384 = forge.md.algorithms.sha384 = sha384;

// SHA-512/256
forge.sha512.sha256 = forge.sha512.sha256 || {
  create: function() {
    return sha512.create('SHA-512/256');
  }
};
forge.md['sha512/256'] = forge.md.algorithms['sha512/256'] =
  forge.sha512.sha256;

// SHA-512/224
forge.sha512.sha224 = forge.sha512.sha224 || {
  create: function() {
    return sha512.create('SHA-512/224');
  }
};
forge.md['sha512/224'] = forge.md.algorithms['sha512/224'] =
  forge.sha512.sha224;

/**
 * Creates a SHA-2 message digest object.
 *
 * @param algorithm the algorithm to use (SHA-512, SHA-384, SHA-512/224,
 *          SHA-512/256).
 *
 * @return a message digest object.
 */
sha512.create = function(algorithm) {
  // do initialization as necessary
  if(!_initialized) {
    _init();
  }

  if(typeof algorithm === 'undefined') {
    algorithm = 'SHA-512';
  }

  if(!(algorithm in _states)) {
    throw new Error('Invalid SHA-512 algorithm: ' + algorithm);
  }

  // SHA-512 state contains eight 64-bit integers (each as two 32-bit ints)
  var _state = _states[algorithm];
  var _h = null;

  // input buffer
  var _input = forge.util.createBuffer();

  // used for 64-bit word storage
  var _w = new Array(80);
  for(var wi = 0; wi < 80; ++wi) {
    _w[wi] = new Array(2);
  }

  // determine digest length by algorithm name (default)
  var digestLength = 64;
  switch(algorithm) {
    case 'SHA-384':
      digestLength = 48;
      break;
    case 'SHA-512/256':
      digestLength = 32;
      break;
    case 'SHA-512/224':
      digestLength = 28;
      break;
  }

  // message digest object
  var md = {
    // SHA-512 => sha512
    algorithm: algorithm.replace('-', '').toLowerCase(),
    blockLength: 128,
    digestLength: digestLength,
    // 56-bit length of message so far (does not including padding)
    messageLength: 0,
    // true message length
    fullMessageLength: null,
    // size of message length in bytes
    messageLengthSize: 16
  };

  /**
   * Starts the digest.
   *
   * @return this digest object.
   */
  md.start = function() {
    // up to 56-bit message length for convenience
    md.messageLength = 0;

    // full message length (set md.messageLength128 for backwards-compatibility)
    md.fullMessageLength = md.messageLength128 = [];
    var int32s = md.messageLengthSize / 4;
    for(var i = 0; i < int32s; ++i) {
      md.fullMessageLength.push(0);
    }
    _input = forge.util.createBuffer();
    _h = new Array(_state.length);
    for(var i = 0; i < _state.length; ++i) {
      _h[i] = _state[i].slice(0);
    }
    return md;
  };
  // start digest automatically for first time
  md.start();

  /**
   * Updates the digest with the given message input. 
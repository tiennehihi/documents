var assert = require('assert');
var net = require('net');
var streamPair = require('stream-pair');
var thing = require('handle-thing');
var Buffer = require('buffer').Buffer;

var fixtures = require('./fixtures');

var hose = require('../');

describe('Select Hose', function() {
  var pair;
  var socket;
  beforeEach(function() {
    pair = streamPair.create();

    var handle = thing.create(pair.other);
    socket = new net.Socket({ handle: handle });

    // For v0.8
    socket.readable = true;
    socket.writable = true;
  });

  it('should select handler using first byte', function(done) {
    var filter = hose.create(socket, function filter(data, callback) {
      if (data[0] === 0x80)
        return callback(null, 'spdy');
      else
        return callback(null, 'http');
    });

    filter.on('select', fun
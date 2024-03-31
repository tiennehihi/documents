/* eslint-env mocha */

var assert = require('assert')
var net = require('net')
var streamPair = require('stream-pair')

var thing = require('../')

describe('Handle Thing', function () {
  var handle
  var pair
  var socket;

  [ 'normal', 'lazy' ].forEach(function (mode) {
    describe(mode, function () {
      beforeEach(function () {
        pair = streamPair.create()
        handle = thing.create(mode === 'normal' ? pair.other : null)
        socket = new net.Socket({
          handle: handle,
          readable: true,
          writable: true
        })

        if (mode === 'lazy') {
          setTimeout(function () {
            handle.setStream(pair.other)
          }, 50)
        }
      })

      afterEach(function () {
        assert(handle._stream)
      })

      it('should write data to Socket', function (done) {
        pair.write('hello')
        pair.write(' world')
        pair.end('... ok')

        var chunks = ''
        socket.on('data', function (chunk) {
          chunks += chunk
        })
        socket.on('end', function () {
          assert.strictEqual(chunks, 'hello world... ok')

          // all
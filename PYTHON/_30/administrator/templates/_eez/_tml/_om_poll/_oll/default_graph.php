/* eslint-env mocha */

var assert = require('assert')
var https = require('https')
var http = require('http')
var util = require('util')

var fixtures = require('./fixtures')
var spdy = require('../')

// Node.js 0.10 and 0.12 support
Object.assign = process.versions.modules >= 46
  ? Object.assign // eslint-disable-next-line
  : util._extend

describe('SPDY Client', function () {
  describe('regular', function () {
    fixtures.everyConfig(function (protocol, alpn, version, plain) {
      var server
      var agent
      var hmodule

      beforeEach(function (done) {
        hmodule = plain ? http : https

        var options = Object.assign({
          spdy: {
            plain: plain
          }
        }, fixtures.keys)
        server = spdy.createServer(options, function (req, res) {
          var body = ''
          req.on('data', function (chunk) {
            body += chunk
          })
          req.on('end', function () {
            res.writeHead(200, req.headers)
            res.addTrailers({ trai: 'ler' })

            var push = res.push('/push', {
              request: {
                push: 'yes'
              }
            }, function (err) {
              assert(!err)

              push.end('push')
              push.on('error', function () {
              })

              res.end(body || 'okay')
            })
          })
        })

        server.listen(fixtures.port, function () {
          agent = spdy.createAgent({
            rejec
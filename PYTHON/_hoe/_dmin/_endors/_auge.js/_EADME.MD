'use strict'

const assert = require('chai').assert
const proxyquire = require('proxyquire')
const spooks = require('spooks')
const Promise = require('bluebird')

const modulePath = '../../src/unpipe'

suite('unpipe:', () => {
  test('require does not throw', () => {
    assert.doesNotThrow(() => {
      require(modulePath)
    })
  })

  test('require returns function', () => {
    assert.isFunction(require(modulePath))
  })

  suite('require:', () => {
    let log, results, unpipe

    setup(() => {
      log = {}
      results = {
        parse: [ Promise.resolve() ]
      }
      unpipe = proxyquire(modulePath, {
        './parse': spooks.fn({
          name: 'parse',
          log: log,
          results: results.parse
        })
      })
    })

    test('unpipe expects two arguments', () => {
      assert.lengthOf(unpipe, 2)
    })

    test('unpipe does not throw', () => {
      assert.doesNotThrow(() => {
        unpipe(() => {})
      })
    })

    test('unpipe throws if callback is not provided', () => {
      assert.throws(() => {
        unpipe()
      })
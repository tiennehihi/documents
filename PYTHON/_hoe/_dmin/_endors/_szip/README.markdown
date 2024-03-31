'use strict'

const assert = require('chai').assert
const proxyquire = require('proxyquire')
const spooks = require('spooks')
const Promise = require('bluebird')

const modulePath = '../../src/write'

suite('write:', () => {
  test('require does not throw', () => {
    assert.doesNotThrow(() => {
      require(modulePath)
    })
  })

  test('require returns function', () => {
    assert.isFunction(require(modulePath))
  })

  suite('require:', () => {
    let log, results, write

    setup(() => {
      log = {}
      results = {
        createWriteStream: [ {} ]
      }

      write = proxyquire(modulePath, {
        'fs': {
          createWriteStream: spooks.fn({
            name: 'createWriteStream',
            log: log,
            results: results.createWriteStream
          })
        },
        './streamify': spooks.fn({
          name: 'streamify',
          log: log,
          results: [
            {
              pipe: spooks.fn({ name: 'pipe', log
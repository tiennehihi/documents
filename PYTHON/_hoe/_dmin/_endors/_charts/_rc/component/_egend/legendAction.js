'use strict'

const check = require('check-types')
const eventify = require('./eventify')
const events = require('./events')
const JsonStream = require('./jsonstream')
const Hoopy = require('hoopy')
const promise = require('./promise')
const tryer = require('tryer')

const DEFAULT_BUFFER_LENGTH = 1024

module.exports = streamify

/**
 * Public function `streamify`.
 *
 * Asynchronously serialises a data structure to a stream of JSON
 * data. Sanely handles promises, buffers, maps and other iterables.
 *
 * @param data:           The data to transform.
 *
 * @option space:         Indentation string, or the number of spaces
 *                        to indent each nested level by.
 *
 * @option promises:      'resolve' or 'ignore', default is 'resolve'.
 *
 * @option buffers:       'toString' or 'ignore', default is 'toString'.
 *
 * @option maps:          'object' or 'ignore', default is 'object'.
 *
 * @option iterables:     'array' or 'ignore', default is 'array'.
 *
 * @option circular:      'error' or 'ignore', default is 'error'.
 *
 * @option yieldRate:     The number of data items to process per timeslice,
 *                        default is 16384.
 *
 * @option bufferLength:  The length of the buffer, default is 1024.
 *
 * @option highWaterMark: If set, will be passed to the readable stream constructor
 *                        as the value for the highWaterMark option.
 *
 * @option Promise:       The promise constructor to use, defaults to bluebird.
 **/
function streamify (data, options = {}) {
  const emitter = eventify(data, options)
  const json = new Hoopy(options.bufferLength || DEFAULT_BUFFER_LENGTH)
  const Promise = promise(options)
  const space = normaliseSpace(options)
  let streamOptions
  const { highWaterMark } = options
  if (highWaterMark) {
    streamOptions = { highWaterMark }
  }
  const stream = new JsonStream(read, streamOptions)

  let awaitPush = true
  let index = 0
  let indentation = ''
  let isEnded
  let isPaused = false
  let isProperty
  let length = 0
  let mutex = Promise.resolve()
  let needsComma

  emitter.on(events.array, noRacing(array))
  emitter.on(events.object, noRacing(object))
  emitter.on(events.property, noRacing(property))
  emitter.on(events.string, noRacing(string))
  emitter.on(events.number, noRacing(value))
  emitter.on(events.literal, noRacing(value))
  emitter.on(events.endArray, noRacing(endArray))
  emitter.on(events.endObject, noRacing(endObject))
  emitter.on(events.end, noRacing(end))
  emitter.on(events.error, noRacing(error))
  emitter.on(events.dataError, noRacing(dataError))

  return stream

  function read () {
    if (awaitPush) {
      awaitPush = false

      if (isEnded) {
        if (length > 0) {
          after()
        }

        return endStream()
      }
    }

    if (isPaused) {
      after()
    }
  }

  function after () {
    if (await
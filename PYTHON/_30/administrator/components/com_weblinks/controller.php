#!/usr/bin/env node

var ansiHTML = require('../')
var pkg = require('../package.json')
var l = console.log
var w = console.warn

var stdoutFlushed = true
var readingStdin = false

function logLine (line) {
  if (!line) {
    return
  }
  line = ansiHTML(line)
  try {
    stdoutFlushed = process.stdout.write(line)
  } catch (e) {}
}

function safeExit (code) {
  l('')
  process.exit(code)
}

function processStdin (finish) {
  readingStdin = true
  var chunks = ''
  process.stdin.resume()
  process.stdin.setEncoding('utf-8')
  process.stdin.on('data', function (chunk) {
    var lines = chunk.split(/[\r\n]+/g).filter(function (line) {
      return line
    })
    var length = lines.length
    if (length === 1) {
      chunks += lines[0]
      return
    }
    if (length > 1) {
      logLine(chunks + (chunks ? '\n' : '') + lines[0] + '\n')
    }
    chunks = lines.pop()
    length -= 1
    for (var i = 1; i < length; i++) {
      logLine(lines[i] + '\n')
    }
  })
  process.stdin.on('end', function () {
    if (chunks) {
      logLine(chunks)
    }
    finish()
  })
}

function stdoutDrain (code) {
  process.stdout.on('drain', function () {
    safeExit(code)
  })
  if (stdoutFlushed) {
    safeExit(code)
  }
}

function startup (args) {
  if (args.indexOf('-h') > 0 || a
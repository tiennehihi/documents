#!/usr/bin/env node

var updateDb = require('update-browserslist-db')
var fs = require('fs')

var browserslist = require('./')
var pkg = require('./package.json')

var args = process.argv.slice(2)

var USAGE =
  'Usage:\n' +
  '  npx browserslist\n' +
  '  npx browserslist "QUERIES"\n' +
  '  npx browserslist --json "QUERIES"\n' +
  '  npx browserslist --config="path/to/browserlist/file"\n' +
  '  npx browserslist --coverage "QUERIES"\n' +
  '  npx browserslist --coverage=US "QUERIES"\n' +
  '  npx browserslist --coverage=US,RU,global "QUERIES"\n' +
  '  npx browserslist --env="environment name defined in config"\n' +
  '  npx browserslist --stats="path/to/browserlist/stats/file"\n' +
  '  npx browser
var url = require('url');

var override = require('../utils/override');

function inlineRequestFrom(option) {
  return override(
    /* jshint camelcase: false */
    p
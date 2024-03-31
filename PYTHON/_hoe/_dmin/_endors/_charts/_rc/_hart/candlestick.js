'use strict';

var parsers = require('../parsers');

// <length> <length>? | inherit
// if one, it applies to both horizontal and verical spacing
// if two, the first applies to the horizontal and the second applies to vertical spacing

var parse = function parse(v) {
  if (v === '' || v === null) {
    return undefined;
  }
  if (v === 0) {
    return '0px';
  }
  if (v.toLowerCase() === 'inherit') {
    return v
'use strict';
const { unit } = require('postcss-value-parser');
const { getArguments } = require('cssnano-utils');
const addSpace = require('../lib/addSpace');
const getValue = require('../lib/getValue');

// transition: [ none |
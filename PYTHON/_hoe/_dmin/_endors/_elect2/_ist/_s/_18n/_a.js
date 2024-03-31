/**
 * @fileoverview Report missing `key` props in iterators/collection literals.
 * @author Ben Mosher
 */

'use strict';

const hasProp = require('jsx-ast-utils/hasProp');
const propName = require('jsx-ast-utils/propName');
const values = require('object.values');
const docsUrl = require('../util/docsUrl');
const pragmaUtil = require('../util/pragma');
const report = require('../util/report');
const astUtil = require('../util/ast');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const defaultOptions = {
  checkFragmentShorthand: false,
  checkKeyMustBeforeSpread: false,
  warnOnDuplicates: false,
};

const messages = {
  missingIterKey: 'Missing "key" prop for element in iterator',
  missingIterKeyUsePrag: 'Missing "key" prop 
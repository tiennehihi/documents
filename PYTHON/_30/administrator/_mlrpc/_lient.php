'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.stringify =
  exports.printWithType =
  exports.printReceived =
  exports.printExpected =
  exports.printDiffOrStringify =
  exports.pluralize =
  exports.matcherHint =
  exports.matcherErrorMessage =
  exports.highlightTrailingWhitespace =
  exports.getLabelPrinter =
  exports.ensureNumbers =
  exports.ensureNoExpected =
  exports.ensureExpectedIsNumber =
  exports.ensureExpectedIsNonNegativeInteger =
  exports.ensureActualIsNumber =
  exports.diff =
  exports.SUGGEST_TO_CONTAIN_EQUAL =
  exports.RECEIVED_COLOR =
  exports.INVERTED_COLOR =
  exports.EXPECTED_COLOR =
  exports.DIM_COLOR =
  exports.BOLD_WEIGHT =
    void 0;

var _chalk = _interopRequireDefault(require('chalk'));

var _jestDiff = require('jest-diff');

var _jestGetType = require('jest-get-type');

var _prettyFormat = require('pretty-format');

var _Replaceable = _interopRequireDefault(require('./Replaceable'));

var _deepCyclicCopyReplaceable = _interopRequireDefault(
  require('./deepCyclicCopyReplaceable')
);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable local/ban-types-eventually */
const {
  AsymmetricMatcher,
  DOMCollection,
  DOMElement,
  Immutable,
  ReactElement,
  ReactTestComponent
} = _prettyFormat.plugins;
const PLUGINS = [
  ReactTestComponent,
  ReactElement,
  DOMElement,
  DOMCollection,
  Immutable,
  AsymmetricMatcher
];
const EXPECTED_COLOR = _chalk.default.green;
exports.EXPECTED_COLOR = EXPECTED_COLOR;
const RECEIVED_COLOR = _chalk.default.red;
exports.RECEIVED_COLOR = RECEIVED_COLOR;
const INVERTED_COLOR = _chalk.default.inverse;
exports.INVERTED_COLOR = INVERTED_COLOR;
const BOLD_WEIGHT = _chalk.default.bold;
exports.BOLD_WEIGHT = BOLD_WEIGHT;
const DIM_COLOR = _chalk.default.dim;
exports.DIM_COLOR = DIM_COLOR;
const MULTILINE_REGEXP = /\n/;
const SPACE_SYMBOL = '\u{00B7}'; // middle dot

const NUMBERS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen'
];

const SUGGEST_TO_CONTAIN_EQUAL = _chalk.default.dim(
  'Looks like you wanted to test for object/array equality with the stricter `toContain` matcher. You probably need to use `toContainEqual` instead.'
);

exports.SUGGEST_TO_CONTAIN_EQUAL = SUGGEST_TO_CONTAIN_EQUAL;

const stringify = (object, maxDepth = 10) => {
  const MAX_LENGTH = 10000;
  let result;

  try {
    result = (0, _prettyFormat.format)(object, {
      maxDepth,
      min: true,
      plugins: PLUGINS
    });
  } catch {
    result = (0, _prettyFormat.format)(object, {
      callToJSON: false,
      maxDepth,
      min: true,
      plugins: PLUGINS
    });
  }

  return result.length >= MAX_LENGTH && maxDepth > 1
    ? stringify(object, Math.floor(maxDepth / 2))
    : result;
};

exports.stringify = stringify;

const highlightTrailingWhitespace = text =>
  text.replace(/\s+$/gm, _chalk.default.inverse('$&')); // Instead of inverse highlight which now implies a change,
// replace common spaces with middle dot at the end of any line.

exports.highlightTrailingWhitespace = highlightTrailingWhitespace;

const replaceTrailingSpaces = text =>
  text.replace(/\s+$/gm, spaces => SPACE_SYMBOL.repeat(spaces.length));

const printReceived = object =>
  RECEIVED_COLOR(replaceTrailingSpaces(stringify(object)));

exports.printReceived = printReceived;

const printExpected = value =>
  EXPECTED_COLOR(replaceTrailingSpaces(stringify(value)));

exports.printExpected = printExpected;

const printWithType = (
  name,
  value,
  print // printExpected or printReceived
) => {
  const type = (0, _jestGetType.getType)(value);
  const hasType =
    type !== 'null' && type !== 'undefined'
      ? `${name} has type:  ${type}\n`
      : '';
  const hasValue = `${name} has value: ${print(value)}`;
  return hasType + hasValue;
};

exports.printWithType = printWithType;

const ensureNoExpected = (expected, matcherName, options) => {
  if (typeof expected !== 'undefined') {
    // Prepend maybe not only for backward compatibility.
    const matcherString = (options ? '' : '[.not]') + matcherName;
    throw new Error(
      matcherErrorMessage(
        matcherHint(matcherString, undefined, '', options), // Because expected is omitted in hint above,
        // expected is black instead of green in message below.
        'this matcher must not have an expected argument',
        printWithType('Expected', expected, printExpected)
      )
    );
  }
};
/**
 * Ensures that `actual` is of type `number | bigint`
 */

exports.ensureNoExpected = ensureNoExpected;

const ensureActualIsNumber = (actual, matcherName, options) => {
  if (typeof actual !== 'number' && typeof actual !== 'bigint') {
    // Prepend maybe not only for backward compatibility.
    const matcherString = (options ? '' : '[.not]') + matcherName;
    throw new Error(
      matcherErrorMessage(
        matcherHint(matcherString, undefined, undefined, options),
        `${RECEIVED_COLOR('received')} val
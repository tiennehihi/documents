'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.printReceivedStringContainExpectedSubstring =
  exports.printReceivedStringContainExpectedResult =
  exports.printReceivedConstructorNameNot =
  exports.printReceivedConstructorName =
  exports.printReceivedArrayContainExpectedItem =
  exports.printExpectedConstructorNameNot =
  exports.printExpectedConstructorName =
  exports.printCloseTo =
    void 0;

var _jestMatcherUtils = require('jest-matcher-utils');

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable local/ban-types-eventually */
// Format substring but do not enclose in double quote marks.
// The replacement is compatible with pretty-format package.
const printSubstring = val => val.replace(/"|\\/g, '\\$&');
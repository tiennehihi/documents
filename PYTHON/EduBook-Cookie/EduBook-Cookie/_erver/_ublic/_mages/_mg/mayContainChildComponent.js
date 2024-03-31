'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.test = exports.serialize = exports.default = void 0;

var _collections = require('../collections');

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// SENTINEL constants are from https://github.com/facebook/immutable-js
const IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
const IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';
const IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
const IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';
const IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';
const IS_RECORD_SENTINEL = '@@__IMMUTABLE_RECORD__@@'; // immutable v4

const IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';
const IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';
const IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';

const getImmutableName = name => `Immutable.${name}`;

const printAsLeaf = name => `[${name}]`;

const SPACE = ' ';
const LAZY = '…'; // Seq is lazy if it calls a method like filter

const printImmutableEntries = (
  val,
  config,
  indentation,
  depth,
  refs,
  printer,
  type
) =>
  ++depth > config.maxDepth
    ? printAsLeaf(getImmutableName(type))
    : `${getImmutableName(type) + SPACE}{${(0,
      _collections.printIteratorEntries)(
        val.entries(),
        config,
        indentation,
        depth,
        refs,
        printer
      )}}`; // Record has an entries method because it is a collection in immutable v3.
// Return an iterator for Immutable Record from version v3 or v4.

function getRecordEntries(val) {
  let i = 0;
  return {
    next() {
      if (i < val._keys.length) {
        const key = val._keys[i++];
        return {

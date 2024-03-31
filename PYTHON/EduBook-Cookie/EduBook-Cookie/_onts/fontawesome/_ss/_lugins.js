'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _crypto() {
  const data = require('crypto');

  _crypto = function () {
    return data;
  };

  return data;
}

function path() {
  const data = _interopRequireWildcard(require('path'));

  path = function () {
    return data;
  };

  return data;
}

function _core() {
  const data = require('@babel/core');

  _core = function () {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(require('chalk'));

  _chalk = function () {
    return data;
  };

  return data;
}

function fs() {
  const data = _interopRequireWildcard(require('graceful-fs'));

  fs = function () {
    return data;
  };

  return data;
}

function _slash() {
  const data = _interopRequireDefault(require('slash'));

  _slash = function () {
    return data;
  };

  return data;
}

var _loadBabelConfig = require('./loadBabelConfig');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return {default: obj};
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const THIS_FILE = fs().readFileSync(__filename);

const jestPresetPath = require.resolve('babel-preset-jest');

const babelIstanbulPlugin = require.resolve('babel-plugin-istanbul');

function assertLoadedBabelConfig(babelConfig, cwd, filename) {
  if (!babelConfig) {
    throw new Error(
      `babel-jest: Babel ignores ${_chalk().default.bold(
        (0, _slash().default)(path().relative(cwd, filename))
      )} - make sure to include the file in Jest's ${_chalk().default.bold(
        'transformIgnorePatterns'
      )} as well.`
    );
  }
}

function addIstanbulInstrumentation(babelOptions, transformOptions) {
  if (transformOptions.instrument) {
    const copiedBabelOptions = {
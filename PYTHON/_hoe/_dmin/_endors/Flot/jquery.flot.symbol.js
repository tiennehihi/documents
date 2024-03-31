'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function os() {
  const data = _interopRequireWildcard(require('os'));

  os = function () {
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

function _micromatch() {
  const data = _interopRequireDefault(require('micromatch'));

  _micromatch = function () {
    return data;
  };

  return data;
}

function _jestConfig() {
  const data = require('jest-config');

  _jestConfig = function () {
    return data;
  };

  return data;
}

function _jestRegexUtil() {
  const data = require('jest-regex-util');

  _jestRegexUtil = function () {
    return data;
  };

  return data;
}

function _jestResolveDependencies() {
  const data = require('jest-resolve-dependencies');

  _jestResolveDependencies = function () {
    return data;
  };

  return data;
}

function _jestSnapshot() {
  const data = require('jest-snapshot');

  _jestSnapshot = function () {
    return data;
  };

  return data;
}

function _jestUtil() {
  const data = require('jest-util');

  _jestUtil = function () {
    return data;
  };

  return data;
}

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

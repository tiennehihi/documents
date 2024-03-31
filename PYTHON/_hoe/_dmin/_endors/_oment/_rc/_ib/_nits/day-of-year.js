'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _jestWatcher() {
  const data = require('jest-watcher');

  _jestWatcher = function () {
    return data;
  };

  return data;
}

var _SnapshotInteractiveMode = _interopRequireDefault(
  require('../SnapshotInteractiveMode')
);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

class UpdateSnapshotInteractivePlugin extends _jestWatcher().BaseWatchPlugin {
  constructor(...args) {
    super(...args);

    _defineProperty(
      this,
      '_snapshotInteractiveMode',
      n
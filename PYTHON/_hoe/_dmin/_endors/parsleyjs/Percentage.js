'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
Object.defineProperty(exports, 'FifoQueue', {
  enumerable: true,
  get: function () {
    return _FifoQueue.default;
  }
});
Object.defineProperty(exports, 'PriorityQueue', {
  enumerable: true,
  get: function () {
    return _PriorityQueue.default;
  }
});
exports.Worker = void 0;
Object.defineProperty(exports, 'messageParent', {
  enumerable: true,
  get: function () {
    return _messageParent.default;
  }
});

function _os() {
  const data = require('os');

  _os = function () {
    return data;
  };

  return data;
}

var _Farm = _interopRequireDefault(require('./Farm'));

var _WorkerPool = _interopRequireDef
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isNoFlowFileAnnotation = _interopRequireDefault(require("./isNoFlowFileAnnotation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks whether a file has an @flow or @noflow annotation.
 *
 * @param context
 * @param [strict] - By default, the function returns
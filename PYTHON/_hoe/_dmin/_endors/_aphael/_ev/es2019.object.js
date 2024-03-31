"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;

var _path = _interopRequireDefault(require("path"));

var _options = _interopRequireDefault(require("./options.json"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
async function loader(input, inputMap) {
  const options = this.getOptions(_options.default);
  const {
    sourceMappingURL,
 
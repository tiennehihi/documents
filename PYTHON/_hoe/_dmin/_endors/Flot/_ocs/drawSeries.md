"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeBabelParseConfig = normalizeBabelParseConfig;
exports.normalizeBabelParseConfigSync = normalizeBabelParseConfigSync;
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
const babel = require("./babel-core.cjs");
const ESLINT_VERSION = require("../utils/eslint-version.cjs");
function getParserPlugins(babelOptions) {
  var _babelOptions$parserO, _babelOptions$parserO2;
  const babelParserPlugins = (_babelOptions$parserO = (_babelOptions$parserO2 = babelOptions.parserOpts) == null ? void 0 : _babelOptions$parserO2.plugins) != null ? _babelOptions$parserO : [];
  const estreeOptions = {
    classFeatures: ESLINT_VERSION >= 8
  };
  for (const plugin of babelParserPlugins) {
    if (Array.isArray(plugin) && plugin[0] === "estree") {
      Object.assign(estreeOptions, plugin[1]);
      break;
    }
  }
  return [["estree", estreeOptions], ...babelParserPlugins];
}
function normalizeParserOptions(options) {
  var _options$allowImportE, _options$ecmaFeatures, _options$ecmaFeatures2;
  return Object.assign({
    sourceType: options.sourceType,
    filename: options.filePath
  }, options.babelOptions, {
    parserOpts: Object.assign({}, 
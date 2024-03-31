"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addHook = addHook;
var _module = _interopRequireDefault(require("module"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */

const nodeModulesRegex = /^(?:.*[\\/])?node_modules(?:[\\/].*)?$/;
// Guard against poorly mocked module constructors.
const Module = module.constructor.length > 1 ? module.constructor : _module.default;
const HOOK_RETURNED_NOTHING_ERROR_MESSAGE = '[Pirates] A hook returned a non-string, or nothing at all! This is a' + ' violation of intergalactic law!\n' + '--------------------\n' + 'If you have no idea what this means or what Pirates is, let me explain: ' + 'Pirates is a module that makes is easy to implement require hooks. One of' + " the require hooks you're using uses it. One of these require hooks" + " didn't return anything from it's handler, so we don't know what to" + ' do. You might want to debug this.';

/**
 * @param {string} filename The filename to check.
 * @param {string[]} exts The extensions to hook. Should start with '.' (ex. ['.js']).
 * @param {Matcher|null} matcher A matcher function, will be called with path to a f
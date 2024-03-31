'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var util = require('util');
var path = require('path');
var Ajv = require('ajv');
var globals = require('globals');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var util__default = /*#__PURE__*/_interopDefaultLegacy(util);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var Ajv__default = /*#__PURE__*/_interopDefaultLegacy(Ajv);
var globals__default = /*#__PURE__*/_interopDefaultLegacy(globals);

/**
 * @fileoverview Config file operations. This file must be usable in the browser,
 * so no Node-speci
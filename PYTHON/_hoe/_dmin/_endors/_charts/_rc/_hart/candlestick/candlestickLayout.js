"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadPlugin = loadPlugin;
exports.loadPreset = loadPreset;
exports.resolvePreset = exports.resolvePlugin = void 0;
function _debug() {
  const data = require("debug");
  _debug = function () {
    return data;
  };
  return data;
}
function _path() {
  const data = require("path");
  _path = function () {
    return data;
  };
  return data;
}
var _async = require("../../gensync-utils/async.js");
var _moduleTypes = require("./module-types.js");
function _url() {
  const data = require("url");
  _url = function () {
    return data;
  };
  return data;
}
var _importMetaResolve = require("../../vendor/import-meta-resolve.js");
function _fs() {
  const data = require("fs");
  _fs = function () {
    return data;
  };
  return data;
}
const debug = _debug()("babel:config:loading:files:plugins");
const EXACT_RE = /^module:/;
const BABEL_PLUGIN_PREFIX_RE = /^(?!@|module:|[^/]+\/|babel-plugin-)/;
const BABEL_PRESET_PREFIX_RE = /^(?!@|module:|[^/]+\/|babel-preset-)/;
const BABEL_PLUGIN_ORG_RE = /^(@babel\/)(?!plugin-|[^/]+\/)/;
const BABEL_PRESET_ORG_RE = /^(@babel\/)(?!preset-|[^/]+\/)/;
const OTHER_PLUGIN_ORG_RE = /^(@(?!babel\/)[^/]+\/)(?![^/]*babel-plugin(?:-|\/|$)|[^/]+\/)/;
const OTHER_PRESET_ORG_RE = /^(@(?!babel\/)[^/]+\/)(?![^/]*babel-preset(?:-|\/|$)|[^/]+\/)/;
const OTHER_ORG_DEFAULT_RE = /^(@(?!babel$)[^/]+)$/;
const resolvePlugin = exports.resolvePlugin = resolveStandardizedName.bind(null, "plugin");
const resolvePreset = exports.resolvePreset = resolveStandardizedName.bind(null, "preset");
function* loadPlugin(name, dirname) {
  const filepath = resolvePlugin(name, dirname, yield* (0, _async.isAsync)());
  const value = yield* requireModule("plugin", filepath);
  debug("Loaded plugin %o from %o.", name, dirname);
  return {
    filepath,
    value
  };
}
function* loadPreset(name, dirname) {
  const filepath = resolvePreset(name, dirname, yield* (0, _async.isAsync)());
  const value = yield* requireModule("preset", filepath);
  debug("Loaded preset %o from %o.", name, dirname);
  return {
    filepath,
    value
  };
}
function standardizeName(type, name) {
  if (_path().isAbsolute(name)) return name;
  const isPreset = type === "preset";
  return name.replace(isPreset ? BABEL_PRESET_PREFIX_RE : BABEL_PLUGIN_PREFIX_RE, `babel-${type}-`).replace(isPreset ? BABEL_PRESET_ORG_RE : BABEL_PLUGIN_ORG_RE, `$1${type}-`).replace(isPreset ? OTHER_PRESET_ORG_RE : OTHER_PLUGIN_ORG_RE, `$1babel-${type}-`).replace(OTHER_ORG_DEFAULT_RE, `$1/babel-${type}`).replace(EXACT_RE, "");
}
function* resolveAlternativesHelper(type, name) {
  const standardizedName = standardizeName(type, name);
  const {
    error,
    value
  } = yield standardizedName;
  if (!error) return value;
  if (error.code !== "MODULE_NOT_FOUND") throw error;
  if (standardizedName !== name && !(yield name).error) {
    error.message += `\n- If you want to resolve "${name}", use "module:${name}"`;
  }
  if (!(yield standardizeName(type, "@babel/" + name)).error) {
    error.message += `\n- Did you mean "@babel/${name}"?`;
  }
  const oppositeType = type === "preset" ? "plugin" : "preset";
  if (!(yield standardizeName(oppositeType, name)).error) {
    error.message += `\n- Did you accidentally pass a ${oppositeType} as a ${type}?`;
  }
  if (type === "plugin") {
    const transformName = standardizedName.replace("-proposal-", "-transform-");
    if (transformName !== standardizedName && !(yield transformName).error) {
      error.message += `\n- Did you mean "${transformName}"?`;
    }
  }
  error.message += `\n
Make sure that all the Babel plugins and presets you are using
are defined as dependencies or devDependencies in your
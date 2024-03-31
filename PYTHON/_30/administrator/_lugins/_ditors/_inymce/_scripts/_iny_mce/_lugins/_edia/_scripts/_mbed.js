"use strict";

const p = require('path');

const resolve = require('resolve'); // const printAST = require('ast-pretty-print')


const macrosRegex = /[./]macro(\.c?js)?$/;

const testMacrosRegex = v => macrosRegex.test(v); // https://stackoverflow.com/a/32749533/971592


class MacroError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MacroError';
    /* istanbul ignore else */

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else if (!this.stack) {
      this.stack = new Error(message).stack;
    }
  }

}

let _configExplorer = null;

function getConfigExplorer() {
  return _configExplorer = _configExplorer || // Lazy load cosmiconfig since it is a relatively large bundle
  require('cosmiconfig').cosmiconfigSync('babel-plugin-macros', {
    searchPlaces: ['package.json', '.babel-plugin-macrosrc', '.babel-plugin-macrosrc.json', '.babel-plugin-macrosrc.yaml', '.babel-plugin-macrosrc.yml', '.babel-plugin-macrosrc.js', 'babel-plugin-macros.config.js'],
    packageProp: 'babelMacros'
  });
}

function createMacro(macro, options = {}) {
  if (options.configName === 'options') {
    throw new Error(`You cannot use the configName "options". It is reserved for babel-plugin-macros.`);
  }

  macroWrapper.isBabelMacro = true;
  macroWrapper.options = options;
  return macroWrapper;

  function macroWrapper(args) {
    const {
      source,
      isBabelMacrosCall
    } = args;

    if (!isBabelMacrosCall) {
      throw new MacroError(`The macro you imported from "${source}" is being executed outside the context of compilation with babel-plugin-macros. ` + `This indicates that you don't have the babel plugin "babel-plugin-macros" configured correctly. ` + `Please see the documentation for how to configure babel-plugin-macros properly: ` + 'https:
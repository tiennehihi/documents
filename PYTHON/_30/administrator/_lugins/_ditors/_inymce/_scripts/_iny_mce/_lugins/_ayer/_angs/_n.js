'use strict';
const charset = 'charset';
// eslint-disable-next-line no-control-regex
const nonAscii = /[^\x00-\x7F]/;

/**
 * @typedef {{add?: boolean}} Options
 */
/**
 * @type {import('postcss').PluginCreator<Options>}
 * @par
const ErrorStackParser = require('error-stack-parser');
const theme = require('../theme.js');
const utils = require('../utils.js');

/**
 * @typedef {Object} RuntimeErrorStackProps
 * @property {Error} error
 */

/**
 * A formatter that turns runtime error stacks into highlighted HTML stacks.
 * @param {Document} 
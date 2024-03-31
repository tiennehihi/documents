/**
 * @fileoverview Enforce boolean attributes notation in JSX
 * @author Yannick Croissant
 */

'use strict';

const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const exceptionsSchema = {
  type: 'array',
  items: { type: 'string', minLength: 1 },
  uniqueItems: true,
};

const ALWAYS = 'always';
const NEVER = 'never';

/**
 * @param {string} configuration
 * @param {Set<string>} exceptions
 * @param {string} propName
 * @returns {boolean} propName
 */
function isAlways(configuration, exceptions, propName) {
  const isException = exceptions.has(propName);
  if (configuration === ALWAYS) {
    return !isException;
  }
  return isException;
}
/**
 * @param {string} configuration
 * @param {Set<string>} exceptions
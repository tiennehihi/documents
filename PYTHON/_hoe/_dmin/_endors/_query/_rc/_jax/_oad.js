'use strict';

/**
 * @typedef {import('../lib/types').XastElement} XastElement
 */

const csso = require('csso');

exports.type = 'visitor';
exports.name = 'minifyStyles';
exports.active = true;
exports.description =
  'minifies styles and removes unused styles based on usage data';

/**
 * Minifies styles (<style> element + style attribute) using CSSO
 *
 * @author strarsis <strarsis@gmail.com>
 *
 * @type {import('../lib/types').Plugin<csso.MinifyOptions & Omit<csso.CompressOptions, 'usage'> & {
 *   usage?: boolean | {
 *     force?: boolean,
 *     ids?: boolean,
 *     classes?: boolean,
 *     tags?: boolean
 *   }
 * }>}
 */
exports.fn = (_root, { usage, ...params }) => {
  let enableTagsUsage = true;
  let enableIdsUsage = true;
  let enableClassesUsage = true;
  // force to use usage data even if it unsafe (document contains <script> or on* attributes)
  let forceUsageDeoptimized = false;
  if (typeof usage === 'boolean') {
    enableTagsUsage = usage;
    enableIdsUsage = usage;
    enableClassesUsage = usage;
  } else if (usage) {
    enableTagsUsage = usage.tags == null ? true : usage.tags;
    enableIdsUsage = usage.ids == null ? true : usage.ids;
    enableClassesUsage = usage.classes == null ? true : usage.classes;
    forceUsageDeoptimized = usage.force == null ? false : usage.force;
  }
  /**
   * @type {Array<XastElement>}
   */
  const styleElements = [];
  /**
   * @type {Array<XastElement>}
   */
  const elementsWithStyleAttributes = [];
  let deoptimized = false;
  /**
   * @type {Set<string>}
   */
  const tagsUsage = new Set();
  /**
   * @type {Set<string>}
   */
  const idsUsage = new Set();
  /**
   * @type {Set<string>}
   */
  const classesUsage = new Set();

  return {
    element: {
      enter: (node) => {
        // detect deoptimisations
        if (node.name === 'script') {
          deoptimized = true;
        }
        for (const name of Object.keys(node.attributes)) {
          if (name.startsWith('on')) {
            deoptimized = true;
          
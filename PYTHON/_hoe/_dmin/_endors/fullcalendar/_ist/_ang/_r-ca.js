'use strict';

const { detachNodeFromParent } = require('../lib/xast.js');
const { collectStylesheet, computeStyle } = require('../lib/style.js');
const { path2js, js2path, intersects } = require('./_path.js');

exports.type = 'visitor';
exports.name = 'mergePaths';
exports.active = true;
exports.description = 'merges multiple paths in one if possible';

/**
 * Merge multiple Paths into one.
 *
 * @author Kir Belevich, Lev Solntsev
 *
 * @type {import('../lib/types').Plugin<{
 *   force?: boolean,
 *   floatPrecision?: number,
 *   noSpaceAfterFlags?: boolean
 * }>}
 */
exports.fn = (root, params) => {
  const {
    force = false,
    floatPrecision,
    noSpaceAfterFlags = false, // a20 60 45 0 1 30 20 → a20 60 45 0130 20
  } = params;
  const stylesheet = collectStylesheet(root);

  return {
    element: {
      enter: (node) => {
        let prevChild = null;

        for (const child of node.children) {
          // skip if previous element is not path or contains animation elements
          if (
            prevChild == null ||
            prevChild.type !== 'element' ||
            prevChild.name !== 'path' ||
            prevChild.children.length !== 0 ||
            prevChild.attributes.d == null
          ) {
            prevChild = child;
            continue;
          }

          // skip if element is not path or contains animation elements
          if (
            child.type !== 'element' ||
            child.name !== 'path' ||
            child.children.length !== 0 ||
            child.attributes.d == null
          ) {
            prevChild = child;
            continue;
          }

          // preserve paths with markers
          const computedStyle = computeStyle(stylesheet, child);
          if (
            computedStyle['marker-start'] ||
            computedStyle['marker-mid'] ||
            computedStyle['marker-end']
          ) {
            prevChild = child;
            continue;
          }

          const prevChildAttrs = Object.keys(prevChild.attributes);
          const childAttrs = Object.keys(child.attrib
'use strict';

/**
 * @typedef {import('../lib/types').XastElement} XastElement
 */

const { cleanupOutData } = require('../lib/svgo/tools.js');
const {
  transform2js,
  transformsMultiply,
  matrixToTransform,
} = require('./_transforms.js');

exports.type = 'visitor';
exports.name = 'convertTransform';
exports.active = true;
exports.description = 'collapses multiple transformations and optimizes it';

/**
 * Convert matrices to the short aliases,
 * convert long translate, scale or rotate transform notations to the shorts ones,
 * convert transforms to the matrices and multiply them all into one,
 * remove useless transforms.
 *
 * @see https://www.w3.org/TR/SVG11/coords.html#TransformMatrixDefined
 *
 * @author Kir Belevich
 *
 * @type {import('../lib/types').Plugin<{
 *   convertToShorts?: boolean,
 *   degPrecision?: number,
 *   floatPrecision?: number,
 *   transformPrecision?: number,
 *   matrixToTransform?: boolean,
 *   shortTranslate?: boolean,
 *   shortScale?: boolean,
 *   shortRotate?: boolean,
 *   removeUseless?: boolean,
 *   collapseIntoOne?: boolean,
 *   leadingZero?: boolean,
 *   negativeExtraSpace?: boolean,
 * }>}
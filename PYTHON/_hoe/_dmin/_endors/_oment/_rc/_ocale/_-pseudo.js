/**
 * @fileoverview Enforce or disallow spaces inside of curly braces in JSX attributes.
 * @author Jamund Ferguson
 * @author Brandyn Bennett
 * @author Michael Ficarra
 * @author Vignesh Anand
 * @author Jamund Ferguson
 * @author Yannick Croissant
 * @author Erik Wendel
 */

'use strict';

const has = require('object.hasown/polyfill')();
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const SPACING = {
  always: 'always',
  never: 'never',
};
const SPACING_VALUES = [SPACING.always, SPACING.never];

const messages = {
  noNewlineAfter: 'There should be no newline after \'{{token}}\'',
  noNewlineBefore: 'There should be no newline before \'{{token}}\'',
  noSpaceAfter: 'There should be no space after \'{{token}}\'',
  noSpaceBefore: 'There should be no space before \'{{token}}\'',
  spaceNeededAfter: 'A space is required after \'{{token}}\'',
  spaceNeededBefore: 'A space is required before \'{{token}}\'',
};

module.exports = {
  meta: {
    docs: {
      description: 'Enforce or disallow spaces inside of curly braces in JSX attributes and expressions',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-curly-spacing'),
    },
    fixable: 'code',

    messages,

    schema: {
      definitions: {
        basicConfig: {
          type: 'object',
          properties: {
            when: {
              enum: SPACING_VALUES,
            },
            allowMultiline: {
              type: 'boolean',
            },
            spacing: {
              type: 'object',
              properties: {
                objectLiterals: {
                  enum: SPACING_VALUES,
                },
              },
            },
          },
        },
        basicConfigOrBoolean: {
          anyOf: [{
            $ref: '#/definitions/basicConfig',
          }, {
            type: 'boolean',
          }],
        },
      },
      type: 'array',
      
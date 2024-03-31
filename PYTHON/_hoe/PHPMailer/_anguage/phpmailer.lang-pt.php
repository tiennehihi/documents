/**
 * @fileoverview Validate spacing before closing bracket in JSX.
 * @author ryym
 * @deprecated
 */

'use strict';

const getTokenBeforeClosingBracket = require('../util/getTokenBeforeClosingBracket');
const docsUrl = require('../util/docsUrl');
const log = require('../util/log');
const report = require('../util/report');

let isWarnedForDeprecation = false;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  noSpaceBeforeClose: 'A space is forbidden before closing bracket',
  needSpaceBeforeClose: 'A space is required before closing bracket',
};

module.exports = {
  meta: {
    deprecated: true,
    replacedBy: ['jsx-tag-spacing'],
    docs: {
      description: 'Enforce spacing before closing bracket in JSX',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-space-before-closing'),
    },
    fixable: 'code',

    messages,

    schema: [{
      enum: ['always', 'never'],
    }],
  },

  create(context) {
    const configuration = context.options[0] || 'always';

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      JSXOpeningElement(node) {
        if (!node.selfClosing) {
          return;
        }

        const sourceCode = context.getSourceCode();

        const leftToken = getTokenBeforeClosingBracket(node);
        const closingSlash = sourceCode.getTokenAfter(leftToken);

        if (leftToken.loc.end.line !== closingSlash.loc.start.line) {
          return;
        }

        if (configuration === 'always' && !sourceCode.isSpaceBetweenTokens(leftToken, closingSlash)) {
          report(context, messages.needSpace
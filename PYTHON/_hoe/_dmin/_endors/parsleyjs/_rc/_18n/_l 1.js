/**
 * @fileoverview Enforce shorthand or standard form for React fragments.
 * @author Alex Zherdev
 */

'use strict';

const elementType = require('jsx-ast-utils/elementType');
const pragmaUtil = require('../util/pragma');
const variableUtil = require('../util/variable');
const testReactVersion = require('../util/version').testReactVersion;
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function replaceNode(source, node, text) {
  return `${source.slice(0, node.range[0])}${text}${source.slice(node.range[1])}`;
}

const messages = {
  fragmentsNotSupported: 'Fragments are only supported starting from React v16.2. '
    + 'Please disable the `react/jsx-fragments` rule in `eslint` settings or upgrade your version of React.',
  preferPragma: 'Prefer {{react}}.{{fragment}} over fragment shorthand',
  preferFragment: 'Prefer fragment shorthand over {{react}}.{{fragment}}',
};

module.exports = {
  meta: {
    docs: {
      description: 'Enforce shorthand or standard form for React fragments',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-fragments'),
    },
    fixable: 'code',

    messages,

    schema: [{
      enum: ['syntax', 'element'],
    }],
  },

  create(context) {
    const configuration = context.options[0] || 'syntax';
    const reactPragma = pragmaUtil.getFromContext(context);
    const fragmentPragma = pragmaUtil.getFragmentFromContext(context);
    const openFragShort = '<>';
    const closeFragShort = '</>';
    const openFragLong = `<${reactPragma}.${fragmentPragma}>`;
    const closeFragLong = `</${reactPragma}.${fragmentPragma}>`;

    function reportOnReactVersion(node) {
      if (!testReactVersion(context, '>= 16.2.0')) {
        report(context, messages.fragmentsNotSupported, 'fragmentsNotSupported', {
          node,
        });
        return true;
      }

      return false;
    }

    function getFixerToLong(jsxFragment) {
      const sourceC
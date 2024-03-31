/**
 * @fileoverview Validate closing tag location in JSX
 * @author Ross Solomon
 */

'use strict';

const astUtil = require('../util/ast');
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  onOwnLine: 'Closing tag of a multiline JSX expression must be on its own line.',
  matchIndent: 'Expected closing tag to match indentation of opening.',
};

module.exports = {
  meta: {
    docs: {
      description: 'Enforce closing tag location for multiline JSX',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-closing-tag-location'),
    },
    fixable: 'whitespace',
    messages,
  },

  create(context) {
    function handleClosingElement(node) {
      if (!node.parent) {
        return;
      }

      const opening = node.parent.openingElement || node.parent.openingFragment;
      if (opening.loc.start.line === node.loc.start.line) {
        return;
      }

      if (opening.loc.start.column === node.loc.start.column) {
        return;
      }

      const messageId = astUtil.isNodeFirstInLine(context, node)
        ? 'matchIndent'
        : 'onOwnLine';
      report(context, messages[messageId], messageId, {
        node,
        loc: node.loc,
        fix(fixer) {
          const indent = Array(opening.loc.start.column + 1).join(' ');
          if (astUtil.isNodeFirstInLine(context, node)) {
            return fixer.replaceTextRange(
              [node.range[0] - node.loc.start.column, node.range[0]],
              indent
            );
          }

          return fixer.insertTextBefore(node, `\n${indent}`);
        },
      });
    }

    return {
      JSXClosingElement: handleClosingElement,
      JSXClosingFragment: handleClosingElement,
    };
  },
};
                                                                                    Q4�D�H�M�@$���6����r����"!�"��H����WE���ɰ3���;�����W[W�1e��b�-��؜�bE�P����.�z\��Q�3�<Mp��5s-%U��Yh��u��hA����~��ʒ�TJ�fo�)���(j�@�+N��$�1�
�@���v�r5ӿ�����&Y�&ZC����'l�.�o��ws�Z���=N�y���W?|��;����g} �zr��5��n�~f娶��j'���6l�T���դ�i��0Ho��\n�Eq;���[o�Y�� �	;���A׃�I5�gm�4r�itٵ:�'e���Vm��׾���3�+%�x�`���EE�ځ�x @(t���3P���֒��l��a��ّ�\��G�);�� �^VG
�T}vˈ�	sǃ�1�ջ�������3[
��b��1�*����`���HO�޶(��mOC�n�8��_������!���f4�8G�$����<�gT�5�wȈz���{��!��&$3��c�?c���-/��A
�gJ�(��q�±H�4 Bz����m��$(��H�RC�e
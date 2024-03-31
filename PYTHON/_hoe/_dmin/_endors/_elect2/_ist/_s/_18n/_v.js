'use strict';var _importType = require('../core/importType');var _importType2 = _interopRequireDefault(_importType);
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function reportIfMissing(context, node, allowed, name) {
  if (allowed.indexOf(name) === -1 && (0, _importType2['default'])(name, context) === 'builtin') {
    context.report(node, 'Do not import Node.js builtin module "' + String(name) + '"');
  }
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Module systems',
      description: 'Forbid Node.js builtin modules.',
      url: (0, _docsUrl2['default'])('n
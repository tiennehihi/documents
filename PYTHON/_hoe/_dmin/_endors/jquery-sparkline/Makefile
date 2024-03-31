'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Forbid default exports.',
      url: (0, _docsUrl2['default'])('no-default-export') },

    schema: [] },


  create: function () {function create(context) {
      // ignore non-modules
      if (context.parserOptions.sourceType !== 'module') {
        return {};
      }

      var preferNamed = 'Prefer named exports.';
      var noAliasDefault = function () {function noAliasDefault(_ref) {var local = _ref.local;return 'Do not alias `' + String(local.name) + '` as `default`. Just export `' + String(local.name) + '` itself instead.';}return noAliasDefault;}();

      return {
        ExportDefaultDeclaration: function () {function ExportDefaultDeclaration(node) {var _ref2 =
            context.getSourceCode().getFirstTokens(node)[1] || {},loc = _ref2.loc;
       
'use strict';var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _importDeclaration = require('../importDeclaration');var _importDeclaration2 = _interopRequireDefault(_importDeclaration);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Helpful warnings',
      description: 'Forbid use of exported name as identifier of default export.',
      url: (0, _docsUrl2['default'])('no-named-as-default') },

    schema: [] },


  create: function () {function create(context) {
      function checkDefault(nameKey, defaultSpecifier) {
        // #566: default is a valid specifier
        if (defaultSpecifier[nameKey].name === 'default') {return;}

        var declaration = (0, _importDeclaration2['default'])(context);

        var imports = _ExportMap2['default'].get(declaration.source.value, context);
        if (imports == null) {return;}

        if (imports.errors.length) {
          imports.reportErrors(context, declaration);
          return;
        }

        if (imports.has('default') && imports.has(defaultSpecifier[nameKey].name)) {

          context.report(
          defaultSpecifier, 'Using exported name \'
'use strict';var _minimatch = require('minimatch');var _minimatch2 = _interopRequireDefault(_minimatch);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _pkgUp = require('eslint-module-utils/pkgUp');var _pkgUp2 = _interopRequireDefault(_pkgUp);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function getEntryPoint(context) {
  var pkgPath = (0, _pkgUp2['default'])({ cwd: context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename() });
  try {
    return require.resolve(_path2['default'].dirname(pkgPath));
  } catch (error) {
    // Assume the package has no entrypoint (e.g. CLI packages)
    // in which case require.resolve would throw.
    return null;
  }
}

function findScope(context, identifier) {var _context$getSourceCod =
  context.getSourceCode(),scopeManager = _context$getSourceCod.scopeManager;

  return scopeManager && scopeManager.scopes.slice().reverse().find(function (scope) {return scope.variables.some(function (variable) {return variable.identifiers.some(function (node) {return node.name === identifier;});});});
}

function findDefinition(objectScope, identifier) {
  var variable = objectScope.variables.find(function (variable) {return variable.name === identifier;});
  return variable.defs.find(function (def) {return def.name.name === identifier;});
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Module systems',
      description: 'Forbid import statements with CommonJS module.exports.',
      recommended: true },

    fixable: 'code',
    schema: [
    {
      type: 'object',
      properties: {
        exceptions: { type: 'array' } },

      additionalProperties: false }] },



  create: function () {function create(context) {
      var importDeclarations = [];
      var entryPoint = getEntryPoint(context);
      var options = context.options[0] || {};
      var alreadyReported = false;

      function report(node) {
        var fileName = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
        var isEntryPoint = entryPoint === fileName;
        var isIdentifier = node.object.type === 'Identifier';
        var hasKeywords = /^(module|exports)$/.test(node.object.name);
        var objectScope = hasKeywords && findScope(context, nod
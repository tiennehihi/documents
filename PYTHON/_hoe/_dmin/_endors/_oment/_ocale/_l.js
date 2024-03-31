'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function isRequire(node) {
  return node &&
  node.callee &&
  node.callee.type === 'Identifier' &&
  node.callee.name === 'require' &&
  node.arguments.length >= 1;
}

function isDynamicImport(node) {
  return node &&
  node.callee &&
  node.callee.type === 'Import';
}

function isStaticValue(arg) {
  return arg.type === 'Literal' ||
  arg.type === 'TemplateLiteral' && arg.expressions.length === 0;
}

var dynamicImportErrorMessage = 'Calls to import() should use string literals';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Static analysis',
      description: 'Forbid `require()` calls with expressions.',
      url: (0, _docsUrl2['default'])('no-dynamic-require') },

    schema: [
    {
      type: 'object',
      properties: {
        esmodule: {
          type: 'boolean' } },


      additionalProperties: false }] },




  create: function () {function create(context) {
      var options = context.options[0] || {};

      return {
        CallExpression: function () {function CallExpression(node) {
            if (!node.arguments[0] || isStaticValue(node.arguments[0])) {
              return;
            }
            if (isRequire(node)) {
              return context.report({
                node: node,
                message: 'Calls to require() should use string literals' });

            }
            if (options.esmodule && isDynamicImport(node)) {
              return context.report({
                node: node,
                message: dynamicImportErrorMessage });

            }
          }return CallExpression;}(),
        ImportExpression: function () {function ImportExpression(node) {
            if (!options.esmodule || isStaticValue(node.source)) {
              return;
            }
            return context.report({
              node: node,
              message: dynamicImportErrorMessage });

          }return ImportExpression;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1keW5hbWljLXJlcXVpcmUuanMiXSwibmFtZXMiOlsiaXNSZXF1aXJlIiwibm9kZSIsImNhbGxlZSIsInR5cGUiLCJuYW1lIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiaXNEeW5hbWljSW1wb3J0IiwiaXNTdGF0aWNWYWx1ZSIsImFyZyIsImV4cHJlc3Npb25zIiwiZHluYW1pY0ltcG9ydEVycm9yTWVzc2FnZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJzY2hlbWEiLCJwcm9wZXJ0aWVzIiwiZXNtb2R1bGUiLCJhZGRpdGlvbmFsUHJvcGVydGllcyIsImNyZWF0ZSIsImNvbnRleHQiLCJvcHRpb25zIiwiQ2FsbEV4cHJlc3Npb24iLCJyZXBvcnQiLCJtZXNzYWdlIiwiSW1wb3J0RXhwcmVzc2lvbiIsInNvdXJjZSJdLCJtYXBwaW5ncyI6ImFBQUEscUM7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsSUFBbkIsRUFBeUI7QUFDdkIsU0FBT0E7QUFDRkEsT0FBS0MsTUFESDtBQUVGRCxPQUFLQyxNQUFMLENBQVlDLElBQVosS0FBcUIsWUFGbkI7QUFHRkYsT0FBS0MsTUFBTCxDQUFZRSxJQUFaLEtBQXFCLFNBSG5CO0FBSUZILE9BQUtJLFNBQUwsQ0FBZUMsTUFBZixJQUF5QixDQUo5QjtBQUtEOztBQUVELFNBQVNDLGVBQVQsQ0FBeUJOLElBQXpCLEVBQStCO0FBQzdCLFNBQU9BO0FBQ0ZBLE9BQUtDLE1BREg7QUFFRkQsT0FBS0MsTUFBTCxDQUFZQyxJQUFaLEtBQXFCLFFBRjFCO0FBR0Q7O0FBRUQsU0FBU0ssYUFBVCxDQUF1QkMsR0FBdkIsRUFBNEI7QUFDMUIsU0FBT0EsSUFBSU4sSUFBSixLQUFhLFNBQWI7QUFDRk0sTUFBSU4sSUFBSixLQUFhLGlCQUFiLElBQWtDTSxJQUFJQyxXQUFKLENBQWdCSixNQUFoQixLQUEyQixDQURsRTtBQUVEOztBQUVELElBQU1LLDRCQUE0Qiw4Q0FBbEM7O0FBRUFDLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsUUFBTTtBQUNKWCxVQUFNLFlBREY7QUFFSlksVUFBTTtBQUNKQyxnQkFBVSxpQkFETjtBQUVKQyxtQkFBYSw0Q0FGVDtBQUdKQyxXQUFLLDBCQUFRLG9CQUFSLENBSEQsRUFGRjs7QUFPSkMsWUFBUTtBQUNOO0FBQ0VoQixZQUFNLFFBRFI7QUFFRWlCLGtCQUFZO0FBQ1ZDLGtCQUFVO0FBQ1JsQixnQkFBTSxTQURFLEVBREEsRUFGZDs7O0FBT0VtQiw0QkFBc0IsS0FQeEIsRUFETSxDQVBKLEVBRFM7Ozs7O0FBcUJmQyxRQXJCZSwrQkFxQlJDLE9BckJRLEVBcUJDO0FBQ2QsVUFBTUMsVUFBVUQsUUFBUUMsT0FBUixDQUFnQixDQUFoQixLQUFzQixFQUF0Qzs7QUFFQSxhQUFPO0FBQ0xDLHNCQURLLHVDQUNVekIsSUFEVixFQUNnQjtBQUNuQixnQkFBSSxDQUFDQSxLQUFLSSxTQUFMLENBQWUsQ0FBZixDQUFELElBQXNCRyxjQUFjUCxLQUFLSSxTQUFMLENBQWUsQ0FBZixDQUFkLENBQTFCLEVBQTREO0FBQzFEO0FBQ0Q7QUFDRCxnQkFBSUwsVUFBVUMsSUFBVixDQUFKLEVBQXFCO0FBQ25CLHFCQUFPdUIsUUFBUUcsTUFBUixDQUFlO0FBQ3BCMUIsMEJB
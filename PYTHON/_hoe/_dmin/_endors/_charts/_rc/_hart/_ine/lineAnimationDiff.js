'use strict';var _declaredScope = require('eslint-module-utils/declaredScope');var _declaredScope2 = _interopRequireDefault(_declaredScope);
var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _importDeclaration = require('../importDeclaration');var _importDeclaration2 = _interopRequireDefault(_importDeclaration);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function processBodyStatement(context, namespaces, declaration) {
  if (declaration.type !== 'ImportDeclaration') {return;}

  if (declaration.specifiers.length === 0) {return;}

  var imports = _ExportMap2['default'].get(declaration.source.value, context);
  if (imports == null) {return null;}

  if (imports.errors.length > 0) {
    imports.reportErrors(context, declaration);
    return;
  }

  declaration.specifiers.forEach(function (specifier) {
    switch (specifier.type) {
      case 'ImportNamespaceSpecifier':
        if (!imports.size) {
          context.report(
          specifier, 'No exported names found in module \'' + String(
          declaration.source.value) + '\'.');

        }
        namespaces.set(specifier.local.name, imports);
        break;
      case 'ImportDefaultSpecifier':
      case 'ImportSpecifier':{
          var meta = imports.get(
          // default to 'default' for default https://i.imgur.com/nj6qAWy.jpg
          specifier.imported ? specifier.imported.name || specifier.imported.value : 'default');

          if (!meta || !meta.namespace) {break;}
          namespaces.set(specifier.local.name, meta.namespace);
          break;
        }
      default:}

  });
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Static analysis',
      description: 'Ensure imported namespaces contain dereferenced properties as they are dereferenced.',
      url: (0, _docsUrl2['default'])('namespace') },


    schema: [
    {
      type: 'object',
      properties: {
        allowComputed: {
          description: 'If `false`, will report computed (and thus, un-lintable) references to namespace members.',
          type: 'boolean',
          'default': false } },


      additionalProperties: false }] },




  create: function () {function namespaceRule(context) {
      // read options
      var _ref =

      context.options[0] || {},_ref$allowComputed = _ref.allowComputed,allowComputed = _ref$allowComputed === undefined ? false : _ref$allowComputed;

      var namespaces = new Map();

      function makeMessage(last, namepath) {
        return '\'' + String(last.name) + '\' not found in ' + (namepath.length > 1 ? 'deeply ' : '') + 'imported namespace \'' + String(namepath.join('.')) + '\'.';
      }

      return {
        // pick up all imports at body entry time, to properly respect hoisting
        Program: function () {function Program(_ref2) {var body = _ref2.body;
            body.forEach(function (x) {processBodyStatement(context, namespaces, x);});
          }return Program;}(),

        // same as above, but does not add names to local map
        ExportNamespaceSpecifier: function () {function ExportNamespaceSpecifier(namespace) {
            var declaration = (0, _importDeclaration2['default'])(context);

            var imports = _ExportMap2['default'].get(declaration.source.value, context);
            if (imports == null) {return null;}

            if (imports.errors.length) {
              imports.reportErrors(context, declaration);
              return;
            }

            if (!imports.size) {
              context.report(
              namespace, 'No exported names found in module \'' + String(
              declaration.source.value) + '\'.');

            }
          }return ExportNamespaceSpecifier;}(),

        // todo: check for possible redefinition

        MemberExpression: function () {function MemberExpression(dereference) {
            if (dereference.object.type !== 'Identifier') {return;}
            if (!namespaces.has(dereference.object.name)) {return;}
            if ((0, _declaredScope2['default'])(context, dereference.object.name) !== 'module') {return;}

            if (dereference.parent.type === 'AssignmentExpression' && dereference.parent.left === dereference) {
              context.report(
              dereference.parent, 'Assignment to member of namespace \'' + String(
              dereference.object.name) + '\'.');

            }

            // go deep
            var namespace = namespaces.get(dereference.object.name);
            var namepath = [dereference.object.name];
            // while property is namespace and parent is member expression, keep validating
            while (namespace instanceof _ExportMap2['default'] && dereference.type === 'MemberExpression') {
              if (dereference.computed) {
                if (!allowComputed) {
                  context.report(
                  dereference.property, 'Unable to validate computed reference to imported namespace \'' + String(
                  dereference.object.name) + '\'.');

                }
                return;
              }

              if (!namespace.has(dereference.property.name)) {
                context.report(
                dereference.property,
                makeMessage(dereference.property, namepath));

                break;
              }

              var exported = namespace.get(dereference.property.name);
              if (exported == null) {return;}

              // stash and pop
              namepath.push(dereference.property.name);
              namespace = exported.namespace;
              dereference = dereference.parent;
            }
          }return MemberExpression;}(),

        VariableDeclarator: function () {function VariableDeclarator(_ref3) {var id = _ref3.id,init = _ref3.init;
            if (init == null) {return;}
            if (init.type !== 'Identifier') {return;}
            if (!namespaces.has(init.name)) {return;}

            // check for redefinition in intermediate scopes
            if ((0, _declaredScope2['default'])(context, init.name) !== 'module') {return;}

            // DFS traverse child namespaces
            function testKey(pattern, namespace) {var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [init.name];
              if (!(namespace instanceof _ExportMap2['default'])) {return;}

              if (pattern.type !== 'ObjectPattern') {return;}var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

                for (var _iterator = pattern.properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var property = _step.value;
                  if (
                  property.type === 'ExperimentalRestProperty' ||
                  property.type === 'RestElement' ||
                  !property.key)
                  {
                    continue;
                  }

                  if (property.key.type !== 'Identifier') {
                    context.report({
                      node: property,
                
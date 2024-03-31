"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _t = require("@babel/types");
var _t2 = _t;
const {
  react
} = _t;
const {
  cloneNode,
  jsxExpressionContainer,
  variableDeclaration,
  variableDeclarator
} = _t2;
const referenceVisitor = {
  ReferencedIdentifier(path, state) {
    if (path.isJSXIdentifier() && react.isCompatTag(path.node.name) && !path.parentPath.isJSXMemberExpression()) {
      return;
    }
    if (path.node.name === "this") {
      let scope = path.scope;
      do {
        if (scope.path.isFunction() && !scope.path.isArrowFunctionExpression()) {
          break;
        }
      } while (scope = scope.parent);
      if (scope) state.breakOnScopePaths.push(scope.path);
    }
    const binding = path.scope.getBinding(path.node.name);
    if (!binding) return;
    for (const violation of binding.constantViolations) {
      if (violation.scope !== binding.path.scope) {
        state.mutableBinding = true;
        path.stop();
        return;
      }
    }
    if (binding !== state.scope.getBinding(path.node.name)) return;
    state.bindings[path.node.name] = binding;
  }
};
class PathHoister {
  constructor(path, scope) {
    this.breakOnScopePaths = void 0;
    this.bindings = void 0;
    this.mutableBinding = void 0;
    this.scopes = void 0;
    this.scope = void 0;
    this.path = void 0;
    this.attachAfter = void 0;
    this.breakOnScopePaths = [];
    this.bindings = {};
    this.mutableBinding = false;
    this.scopes = [];
    this.scope = scope;
    this.path = path;
    this.attachAfter = false;
  }
  isCompatibleScope(scope) {
    for (const key of Object.keys(this.bindings)) {
      const binding = this.bindings[key];
      if (!scope.bindingIdentifierEquals(key, binding.identifier)) {
        return false;
      }
    }
    return true;
  }
  getCompatibleScopes() {
    let scope = this.path.scope;
    do {
      if (this.isCompatibleScope(scope)) {
        this.scopes.push(scope);
      } else {
        break;
      }
      if (this.breakOnScopePat
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._guessExecutionStatusRelativeTo = _guessExecutionStatusRelativeTo;
exports._resolve = _resolve;
exports.canHaveVariableDeclarationOrExpression = canHaveVariableDeclarationOrExpression;
exports.canSwapBetweenExpressionAndStatement = canSwapBetweenExpressionAndStatement;
exports.equals = equals;
exports.getSource = getSource;
exports.has = has;
exports.is = void 0;
exports.isCompletionRecord = isCompletionRecord;
exports.isConstantExpression = isConstantExpression;
exports.isInStrictMode = isInStrictMode;
exports.isNodeType = isNodeType;
exports.isStatementOrBlock = isStatementOrBlock;
exports.isStatic = isStatic;
exports.isnt = isnt;
exports.matchesPattern = matchesPattern;
exports.referencesImport = referencesImport;
exports.resolve = resolve;
exports.willIMaybeExecuteBefore = willIMaybeExecuteBefore;
var _t = require("@babel/types");
const {
  STATEMENT_OR_BLOCK_KEYS,
  VISITOR_KEYS,
  isBlockStatement,
  isExpression,
  isIdentifier,
  isLiteral,
  isStringLiteral,
  isType,
  matchesPattern: _matchesPattern
} = _t;
function matchesPattern(pattern, allowPartial) {
  return _matchesPattern(this.node, pattern, allowPartial);
}
function has(key) {
  const val = this.node && this.node[key];
  if (val && Array.isArray(val)) {
    return !!val.length;
  } else {
    return !!val;
  }
}
function isStatic() {
  return this.scope.isStatic(this.node);
}
const is = exports.is = has;
function isnt(key) {
  return !this.has(key);
}
function equals(key, value) {
  return this.node[key] === value;
}
function isNodeType(type) {
  return isType(this.type, type);
}
function canHaveVariableDeclarationOrExpression() {
  return (this.key === "init" || this.key === "left") && this.parentPath.isFor();
}
function canSwapBetweenExpressionAndStatement(replacement) {
  if (this.key !== "body" || !this.parentPath.isArrowFunctionExpression()) {
    return false;
  }
  if (this.isExpression()) {
    return isBlockStatement(replacement);
  } else if (this.isBlockStatement()) {
    return isExpression(replacement);
  }
  return false;
}
function isCompletionRecord(allowInsideFunction) {
  let path = this;
  let first = true;
  do {
    const {
      type,
      container
    } = path;
    if (!first && (path.isFunction() || type === "StaticBlock")) {
      return !!allowInsideFunction;
    }
    first = false;
    if (Array.isArray(container) && path.key !== container.length - 1) {
      return false;
    }
  } while ((path = path.parentPath) && !path.isProgram() && !path.isDoExpression());
  return true;
}
function isStatementOrBlock() {
  if (this.parentPath.isLabeledStatement() || isBlockStatement(this.container)) {
    return false;
  } else {
    return STATEMENT_OR_BLOCK_KEYS.includes(this.key);
  }
}
function referencesImport(moduleSource, importName) {
  if (!this.isReferencedIdentifier()) {
    if (this.isJSXMemberExpression() && this.node
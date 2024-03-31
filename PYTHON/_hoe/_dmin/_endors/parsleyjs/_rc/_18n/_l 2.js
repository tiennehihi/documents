"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._containerInsert = _containerInsert;
exports._containerInsertAfter = _containerInsertAfter;
exports._containerInsertBefore = _containerInsertBefore;
exports._verifyNodeList = _verifyNodeList;
exports.hoist = hoist;
exports.insertAfter = insertAfter;
exports.insertBefore = insertBefore;
exports.pushContainer = pushContainer;
exports.unshiftContainer = unshiftContainer;
exports.updateSiblingKeys = updateSiblingKeys;
var _cache = require("../cache.js");
var _hoister = require("./lib/hoister.js");
var _index = require("./index.js");
var _t = require("@babel/types");
const {
  arrowFunctionExpression,
  assertExpression,
  assignmentExpression,
  blockStatement,
  callExpression,
  cloneNode,
  expressionStatement,
  isAssignmentExpression,
  isCallExpression,
  isExportNamedDeclaration,
  isExpression,
  isIdentifier,
  isSequenceExpression,
  isSuper,
  thisExpression
} = _t;
function insertBefore(nodes_) {
  this._assertUnremoved();
  const nodes = this._verifyNodeList(nodes_);
  const {
    parentPath,
    parent
  } = this;
  if (parentPath.isExpressionStatement() || parentPath.
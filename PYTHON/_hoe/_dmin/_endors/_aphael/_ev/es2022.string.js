"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _t = require("@babel/types");
var _explodeAssignableExpression = require("./explode-assignable-expression.js");
const {
  assignmentExpression,
  sequenceExpression
} = _t;
function _default(opts) {
  const {
    build,
    operator
  } = opts;
  const visitor = {
    AssignmentExpression(path) {
      const {
        node,
        scope
     
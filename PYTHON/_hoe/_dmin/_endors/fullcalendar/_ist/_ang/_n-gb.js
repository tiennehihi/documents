"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrayExpression = ArrayExpression;
exports.AssignmentExpression = AssignmentExpression;
exports.BinaryExpression = BinaryExpression;
exports.BooleanLiteral = BooleanLiteral;
exports.CallExpression = CallExpression;
exports.ConditionalExpression = ConditionalExpression;
exports.ClassDeclaration = exports.ClassExpression = exports.FunctionDeclaration = exports.ArrowFunctionExpression = exports.FunctionExpression = Func;
Object.defineProperty(exports, "Identifier", {
  enumerable: true,
  get: function () {
    return _infererReference.default;
  }
});
exports.LogicalExpression = LogicalExpression;
exports.NewExpression = NewExpression;
exports.NullLiteral = NullLiteral;
exports.NumericLiteral = NumericLiteral;
exports.ObjectExpression = ObjectExpression;
exports.ParenthesizedExpression = ParenthesizedExpression;
exports.RegExpLiteral = RegExpLiteral;
exports.RestElement = RestElement;
exports.SequenceExpression = SequenceExpression;
exports.StringLiteral = StringLiteral;
exports.TSAsExpression = TSAsExpression;
exports.TSNonNullExpression = TSNonNullExpression;
exports.TaggedTemplateExpression = TaggedTemplateExpression;
exports.TemplateLiteral = TemplateLiteral;
exports.TypeCastExpression = TypeCastExpression;
exports.UnaryExpression = UnaryExpression;
exports.UpdateExpression = UpdateExpression;
exports.VariableDeclarator = VariableDeclarator;
var _t = require("@babel/types");
var _infererReference = require("./inferer-reference.js");
var _util = require("./util.js");
const {
  BOOLEAN_BINARY_OPERATORS,
  BOOLEAN_UNARY_OPERATORS,
  NUMBER_BINARY_OPERATORS,
  NUMBER_UNARY_OPERATORS,
  STRING_UNARY_OPERATORS,
  anyTypeAnnotation,
  arrayTypeAnnotation,
  booleanTypeAnnotation,
  buildMatchMemberExpression,
  genericTypeAnnotation,
  identifier,
  nullLiteralTypeAnnotation,
  numberTypeAnnotation,
  string
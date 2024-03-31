"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _buffer = require("./buffer.js");
var n = require("./node/index.js");
var _t = require("@babel/types");
var generatorFunctions = require("./generators/index.js");
const {
  isFunction,
  isStatement,
  isClassBody,
  isTSInterfaceBody,
  isTSEnumDeclaration
} = _t;
const SCIENTIFIC_NOTATION = /e/i;
const ZERO_DECIMAL_INTEGER = /\.0+$/;
const HAS_NEWLINE = /[\n\r\u2028\u2029]/;
const HAS_NEWLINE_OR_BlOCK_COMMENT_END = /[\n\r\u2028\u2029]|\*\//;
const {
  needsParens
} = n;
class Printer {
  constructor(format, map) {
    this.inForStatementInitCounter = 0;
    this._printStack = [];
    this._indent = 0;
    this._indentRepeat = 0;
    this._insideAux = false;
    this._parenPushNewlineState = null;
    this._noLineTerminator = false;
    this._printAuxAfterOnNextUserNode = false;
    this._printedComments = new Set();
    this._endsWithInteger = false;
    this._endsWithWord = false;
    this._lastCommentLine = 0;
    this._endsWithInnerRaw = false;
    this._indentInnerComments = true;
    this.format = format;
    this._indentRepeat = format.indent.style.length;
    this._inputMap = map == null ? void 0 : map._inputMap;
    this._buf = new _buffer.default(map, format.indent.style[0]);
  }
  generate(ast) {
    this.print(ast);
    this._maybeAddAuxComment();
    return this._buf.get();
  }
  indent() {
    if (this.format.compact || this.format.concise) return;
    this._indent++;
  }
  dedent() {
    if (this.format.compact || this.format.concise) return;
    this._indent--;
  }
  semicolon(force = false) {
    this._maybeAddAuxComment();
    if (force) {
      this._appendChar(59);
    } else {
      this._queue(59);
    }
    this._noLineTerminator = false;
  }
  rightBrace(node) {
    if (this.format.minified) {

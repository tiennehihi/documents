"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("@babel/helper-plugin-utils");
var _core = require("@babel/core");
var _loop = require("./loop.js");
var _validation = require("./validation.js");
var _annexB_3_ = require("./annex-B_3_3.js");
var _default = exports.default = (0, _helperPluginUtils.declare)((api, opts) => {
  api.assertVersion(7);
  const {
    throwIfClosureRequired = false,
    tdz: tdzEnabled = false
  } = opts;
  if (typeof throwIfClosureRequired !== "boolean") {
    throw new Error(`.throwIfClosureRequired must be a boolean, or undefined`);
  }
  if (typeof tdzEnabled !== "boolean") {
    throw new Error(`.tdz must be a boolean, or undefined`);
  }
  return {
    name: "transform-block-scoping",
    visitor: _core.traverse.visitors.merge([_annexB_3_.annexB33FunctionsVisitor, {
      Loop(path, state) {
        const isForStatement = path.isForStatement();
        const headPath = isForStatement ? path.get("init") : path.isForXStatement() ? path.get("left") : null;
        let needsBodyWrap = false;
        const markNeedsBodyWrap = () => {
          if (throwIfClosureRequired) {
            throw path.buildCodeFrameError("Compiling let/const in this block would add a closure " + "(throwIfClosureRequired).");
          }
          needsBodyWrap = true;
        };
        const body = path.get("body");
        let bodyScope;
        if (body.isBlockStatement()) {
          bodyScope = body.scope;
          const bindings = (0, _loop.getLoopBodyBindings)(path);
          for (const binding of bindings) {
            const {
              capturedInClosure
            } = (0, _loop.getUsageInBody)(binding, path);
            if (capturedInClosure) markNeedsBodyWrap();
          }
        }
        const captured = [];
        const updatedBindingsUsages = new Map();
        if (headPath && isBlockScoped(headPath.node)) {
          const names = Object.keys(headPath.getBindingIdentif
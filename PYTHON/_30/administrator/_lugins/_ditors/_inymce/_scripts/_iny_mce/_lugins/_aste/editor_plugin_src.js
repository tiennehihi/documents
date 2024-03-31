"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _assert = _interopRequireDefault(require("assert"));
var leap = _interopRequireWildcard(require("./leap"));
var meta = _interopRequireWildcard(require("./meta"));
var util = _interopRequireWildcard(require("./util"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasOwn = Object.prototype.hasOwnProperty;
function Emitter(contextId) {
  _assert["default"].ok(this instanceof Emitter);
  util.getTypes().assertIdentifier(contextId);

  // Used to generate unique temporary names.
  this.nextTempId = 0;

  // In order to make sure the context object does not collide with
  // anything in the local scope, we might have to rename it, so we
  // refer to it symbolically instead of just assuming that it will be
  // called "context".
  this.contextId = contextId;

  // An append-only list of Statements that grows each time this.emit is
  // called.
  this.listing = [];

  // A sparse array whose keys correspond to locations in this.listing
  // that have been marked as branch/jump targets.
  this.marked = [true];
  this.insertedLocs = new Set();

  // The last location will be marked when this.getDispatchLoop is
  // called.
  this.finalLoc = this.loc();

  // A list of all leap.TryEntry statements emitted.
  this.tryEntries = [];

  // Each time we evaluate the body of a loop, we tell this.leapManager
  // to enter a nested loop context that determines the meaning of break
  // and continue statements therein.
  this.leapManager = new leap.LeapManager(this);
}
var Ep = Emitter.prototype;
exports.Emitter = Emitter;

// Offsets into this.listing that could be used as targets for branches or
// jumps are represented as numeric Literal nodes. This representation has
// the amazingly convenient benefit of allowing the exact value of the
// location to be determined at any time, even after generating code that
// refers to the location.
// We use 'Number.MAX_VALUE' to mark uninitialized location. We can safely do
// so because no code can realistically have about 1.8e+308 locations before
// hitting memory limit of the machine it's running on. For comparison, the
// estimated number of atoms in the observable universe is around 1e+80.
var PENDING_LOCATION = Number.MAX_VALUE;
Ep.loc = function () {
  var l = util.getTypes().numericLiteral(PENDING_LOCATION);
  this.insertedLocs.add(l);
  return l;
};
Ep.getInsertedLocs = function () {
  return this.insertedLocs;
};
Ep.getContextId = function () {
  return util.getTypes().clone(this.contextId);
};

// Sets the exact value of the given location to the offset of the next
// Statement emitted.
Ep.mark = function (loc) {
  util.getTypes().assertLiteral(loc);
  var index = this.listing.length;
  if (loc.value === PENDING_LOCATION) {
    loc.value = index;
  } else {
    // Locations can be marked redundantly, but their values cannot change
    // once set the first time.
    _assert["default"].strictEqual(loc.value, index);
  }
  this.marked[index] = true;
  return loc;
};
Ep.emit = function (node) {
  var t = util.getTypes();
  if (t.isExpression(node)) {
    node = t.expressionStatement(node);
  }
  t.assertStatement(node);
  this.listing.push(node);
};

// Shorthand for emitting assignment statements. This will come in handy
// for assignments to temporary variables.
Ep.emitAssign = function (lhs, rhs) {
  this.emit(this.assign(lhs, rhs));
  return lhs;
};

// Shorthand for an assignment statement.
Ep.assign = function (lhs, rhs) {
  var t = util.getTypes();
  return t.expressionStatement(t.assignmentExpression("=", t.cloneDeep(lhs), rhs));
};

// Convenience function for generating expressions like context.next,
// context.sent, and context.rval.
Ep.contextProperty = function (name, computed) {
  var t = util.getTypes();
  return t.memberExpression(this.getContextId(), computed ? t.stringLiteral(name) : t.identifier(name), !!computed);
};

// Shorthand for setting context.rval and jumping to `context.stop()`.
Ep.stop = function (rval) {
  if (rval) {
    this.setReturnValue(rval);
  }
  this.jump(this.finalLoc);
};
Ep.setReturnValue = function (valuePath) {
  util.getTypes().assertExpression(valuePath.value);
  this.emitAssign(this.contextProperty("rval"), this.explodeExpression(valuePath));
};
Ep.clearPendingException = function (tryLoc, assignee) {
  var t = util.getTypes();
  t.assertLiteral(tryLoc);
  var catchCall = t.callExpression(this.contextProperty("catch", true), [t.clone(tryLoc)]);
  if (assignee) {
    this.emitAssign(assignee, catchCall);
  } else {
    this.emit(catchCall);
  }
};

// Emits code for an unconditional jump to the given location, even if the
// exact value of the location is not yet known.
Ep.jump = function (toLoc) {
  this.emitAssign(this.contextProperty("next"), toLoc);
  this.emit(util.getTypes().breakStatement());
};

// Conditional jump.
Ep.jumpIf = function (test, toLoc) {
  var t = util.getTypes();
  t.assertExpression(test);
  t.assertLiteral(toLoc);
  this.emit(t.ifStatement(test, t.blockStatement([this.assign(this.contextProperty("next"), toLoc), t.breakStatement()])));
};

// Conditional jump, with the condition negated.
Ep.jumpIfNot = function (test, toLoc) {
  var t = util.getTypes();
  t.assertExpression(test);
  t.assertLiteral(toLoc);
  var negatedTest;
  if (t.isUnaryExpression(test) && test.operator === "!") {
    // Avoid double negation.
    negatedTest = test.argument;
  } else {
    negatedTest = t.unaryExpression("!", test);
  }
  this.emit(t.ifStatement(negatedTest, t.blockStatement([this.assign(this.contextProperty("next"), toLoc), t.breakStatement()])));
};

// Returns a unique MemberExpression that can be used to store and
// retrieve temporary values. Since the object of the member expression is
// the context object, which is presumed to coexist peacefully with all
// other local variables, and since we just increment `nextTempId`
// monotonically, uniqueness is assured.
Ep.makeTempVar = function () {
  return this.contextProperty("t" + this.nextTempId++);
};
Ep.getContextFunction = function (id) {
  var t = util.getTypes();
  return t.functionExpression(id || null /*Anonymous*/, [this.getContextId()], t.blockStatement([this.getDispatchLoop()]), false,
  // Not a generator anymore!
  false // Nor an expression.
  );
};

// Turns this.listing into a loop of the form
//
//   while (1) switch (context.next) {
//   case 0:
//   ...
//   case n:
//     return context.stop();
//   }
//
// Each marked location in this.listing will correspond to one generated
// case statement.
Ep.getDispatchLoop = function () {
  var self = this;
  var t = util.getTypes();
  var cases = [];
  var current;

  // If we encounter a break, continue, or return statement in a switch
  // case, we can skip the rest of the statements until the next case.
  var alreadyEnded = false;
  self.listing.forEach(function (stmt, i) {
    if (self.marked.hasOwnProperty(i)) {
      cases.push(t.switchCase(t.numericLiteral(i), current = []));
      alreadyEnded = false;
    }
    if (!alreadyEnded) {
      current.push(stmt);
      if (t.isCompletionStatement(stmt)) alreadyEnded = true;
    }
  });

  // Now that we know how many statements there will be in this.listing,
  // we can finally resolve this.finalLoc.value.
  this.finalLoc.value = this.listing.length;
  cases.push(t.switchCase(this.finalLoc, [
    // Intentionally fall through to the "end" case...
  ]),
  // So that the runtime can jump to the final location without having
  // to know its offset, we provide the "end" case as a synonym.
  t.switchCase(t.stringLiteral("end"), [
  // This will check/clear both context.thrown and context.rval.
  t.returnStatement(t.callExpression(this.contextProperty("stop"), []))]));
  return t.whileStatement(t.numericLiteral(1), t.switchStatement(t.assignmentExpression("=", this.contextProperty("prev"), this.contextProperty("next")), cases));
};
Ep.getTryLocsList = function () {
  if (this.tryEntries.length === 0) {
    // To avoid adding a needless [] to the majority of runtime.wrap
    // argument lists, force the caller to handle this case specially.
    return null;
  }
  var t = util.getTypes();
  var lastLocValue = 0;
  return t.arrayExpression(this.tryEntries.map(function (tryEntry) {
    var thisLocValue = tryEntry.firstLoc.value;
    _assert["default"].ok(thisLocValue >= lastLocValue, "try entries out of order");
    lastLocValue = thisLocValue;
    var ce = tryEntry.catchEntry;
    var fe = tryEntry.finallyEntry;
    var locs = [tryEntry.firstLoc,
    // The null here makes a hole in the array.
    ce ? ce.firstLoc : null];
    if (fe) {
      locs[2] = fe.firstLoc;
      locs[3] = fe.afterLoc;
    }
    return t.arrayExpression(locs.map(function (loc) {
      return loc && t.clone(loc);
    }));
  }));
};

// All side effects must be realized in order.

// If any subexpression harbors a leap, all subexpressions must be
// neutered of side effects.

// No destructive modification of AST nodes.

Ep.explode = function (path, ignoreResult) {
  var t = util.getTypes();
  var node = path.node;
  var self = this;
  t.assertNode(node);
  if (t.isDeclaration(node)) throw getDeclError(node);
  if (t.isStatement(node)) return self.explodeStatement(path);
  if (t.isExpression(node)) return self.explodeExpression(path, ignoreResult);
  switch (node.type) {
    case "Program":
      return path.get("body").map(self.explodeStatement, self);
    case "VariableDeclarator":
      throw getDeclError(node);

    // These node types should be handled by their parent nodes
    // (ObjectExpression, SwitchStatement, and TryStatement, respectively).
    case "Property":
    case "SwitchCase":
    case "CatchClause":
      throw new Error(node.type + " nodes should be handled by their parents");
    default:
      throw new Error("unknown Node of type " + JSON.stringify(node.type));
  }
};
function getDeclError(node) {
  return new Error("all declarations should have been transformed into " + "assignments before the Exploder began its work: " + JSON.stringify(node));
}
Ep.explodeStatement = function (path, labelId) {
  var t = util.getTypes();
  var stmt = path.node;
  var self = this;
  var before, after, head;
  t.assertStatement(stmt);
  if (labelId) {
    t.assertIdentifier(labelId);
  } else {
    labelId = null;
  }

  // Explode BlockStatement nodes even if they do not contain a yield,
  // because we don't want or need the curly braces.
  if (t.isBlockStatement(stmt)) {
    path.get("body").forEach(function (path) {
      self.explodeStatement(path);
    });
    return;
  }
  if (!meta.containsLeap(stmt)) {
    // Technically we should be able to avoid emitting the statement
    // altogether if !meta.hasSideEffects(stmt), but that leads to
    // confusing generated code (for instance, `while (true) {}` just
    // disappears) and is probably a more appropriate job for a dedicated
    // dead code elimination pass.
    self.emit(stmt);
    return;
  }
  switch (stmt.type) {
    case "ExpressionStatement":
      self.explodeExpression(path.get("expression"), true);
      break;
    case "LabeledStatement":
      after = this.loc();

      // Did you know you can break from any labeled block statement or
      // control structure? Well, you can! Note: when a labeled loop is
      // encountered, the leap.LabeledEntry created here will immediately
      // enclose a leap.LoopEntry on the leap manager's stack, and both
      // entries will have the same label. Though this works just fine, it
      // may seem a bit redundant. In theory, we could check here to
      // determine if stmt knows how to handle its own label; for example,
      // stmt happens to be a WhileStatement and so we know it's going to
      // establish its own LoopEntry when we explode it (below). Then this
      // LabeledEntry would be unnecessary. Alternatively, we might be
      // tempted not to pass stmt.label down into self.explodeStatement,
      // because we've handled the label here, but that's a mistake because
      // labeled loops may contain labeled continue statements, which is not
      // something we can handle in 
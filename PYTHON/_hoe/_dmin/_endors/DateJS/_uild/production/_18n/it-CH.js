"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._getKey = _getKey;
exports._getPattern = _getPattern;
exports.get = get;
exports.getAllNextSiblings = getAllNextSiblings;
exports.getAllPrevSiblings = getAllPrevSiblings;
exports.getBindingIdentifierPaths = getBindingIdentifierPaths;
exports.getBindingIdentifiers = getBindingIdentifiers;
exports.getCompletionRecords = getCompletionRecords;
exports.getNextSibling = getNextSibling;
exports.getOpposite = getOpposite;
exports.getOuterBindingIdentifierPaths = getOuterBindingIdentifierPaths;
exports.getOuterBindingIdentifiers = getOuterBindingIdentifiers;
exports.getPrevSibling = getPrevSibling;
exports.getSibling = getSibling;
var _index = require("./index.js");
var _t = require("@babel/types");
const {
  getBindingIdentifiers: _getBindingIdentifiers,
  getOuterBindingIdentifiers: _getOuterBindingIdentifiers,
  isDeclaration,
  numericLiteral,
  unaryExpression
} = _t;
const NORMAL_COMPLETION = 0;
const BREAK_COMPLETION = 1;
function NormalCompletion(path) {
  return {
    type: NORMAL_COMPLETION,
    path
  };
}
function BreakCompletion(path) {
  return {
    type: BREAK_COMPLETION,
    path
  };
}
function getOpposite() {
  if (this.key === "left") {
    return this.getSibling("right");
  } else if (this.key === "right") {
    return this.getSibling("left");
  }
  return null;
}
function addCompletionRecords(path, records, context) {
  if (path) {
    records.push(..._getCompletionRecords(path, context));
  }
  return records;
}
function completionRecordForSwitch(cases, records, context) {
  let lastNormalCompletions = [];
  for (let i = 0; i < cases.length; i++) {
    const casePath = cases[i];
    const caseCompletions = _getCompletionRecords(casePath, context);
    const normalCompletions = [];
    const breakCompletions = [];
    for (const c of caseCompletions) {
      if (c.type === NORMAL_COMPLETION) {
        normalCompletions.push(c);
      }
      if (c.type === BREAK_COMPLETION) {
        breakCompletions.push(c);
      }
    }
    if (normalCompletions.length) {
      lastNormalCompletions = normalCompletions;
    }
    records.push(...breakCompletions);
  }
  records.push(...lastNormalCompletions);
  return records;
}
function normalCompletionToBreak(completions) {
  completions.forEach(c => {
    c.type = BREAK_COMPLETION;
  });
}
function replaceBreakStatementInBreakCompletion(completions, reachable) {
  completions.forEach(c => {
    if (c.path.isBreakStatement({
      label: null
    })) {
      if (reachable) {
        c.path.replaceWith(unaryExpression("void", numericLiteral(0)));
      } else {
        c.path.remove();
      }
    }
  });
}
function getStatementListCompletion(paths, context) {
  const completions = [];
  if (context.canHaveBreak) {
    let lastNormalCompletions = [];
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const newContext = Object.assign({}, context, {
        inCaseClause: false
      });
      if (path.isBlockStatement() && (context.inCaseClause || context.shouldPopulateBreak)) {
        newContext.shouldPopulateBreak = true;
      } else {
        newContext.shouldPopulateBreak = false;
      }
      const statementCompletions = _getCompletionRecords(path, newContext);
      if (statementCompletions.length > 0 && statementCompletions.every(c => c.type === BREAK_COMPLETION)) {
        if (lastNormalCompletions.length > 0 && statementCompletions.every(c => c.path.isBreakStatement({
          label: null
        }))) {
          normalCompletionToBreak(lastNormalCompletions);
          completions.push(...lastNormalCompletions);
          if (lastNormalCompletions.some(c => c.path.isDeclaration())) {
            completions.push(...statementCompletions);
            replaceBreakStatementInBreakCompletion(statementCompletions, true);
          }
          replaceBreakStatementInBreakCompletion(statementCompletions, false);
        } else {
          completions.push(...statementCompletions);
          if (!context.shouldPopulateBreak) {
            replaceBreakStatementInBreakCompletion(statementCompletions, true);
          }
        }
        break;
      }
      if (i === paths.length - 1) {
        completions.push(...statementCompletions);
      } else {
        lastNormalCompletions = [];
        for (let i = 0; i < statementCompletions.length; i++) {
          const c = statementCompletions[i];
          if (c.type === BREAK_COMPLETION) {
            completions.push(c);
          }
          if (c.type === NORMAL_COMPLETION) {
            lastNormalCompletions.push(c);
          }
        }
      }
    }
  } else if (paths.length) {
    for (let i = paths.length - 1; i >= 0; i--) {
      const pathCompletions = _getCompletionRecords(paths[i], context);
      if (pathCompletions.length > 1 || pathCompletions.length === 1 && !pathCompletions[0].path.isVariableDeclaration()) {
        completions.push(...pathCompletions);
        break;
      }
    }
  }
  return completions;
}
function _getCompletionRecords(path, context) {
  let records = [];
  if (path.isIfStatement()) {
    records = addCompletionRecords(path.get("consequent"), records, context);
    records = addCompletionRecords(path.get("alternate"), records, context);
  } else if (path.isDoExpression() || path.isFor() || path.isWhile() || path.isLabeledStatement()) {
    return addCompletionRecords(path.get("body"), records, context);
  } else if (path.isProgram() || path.isBlockStatement()) {
    return getStatementListCompletion(path.get("body"), context);
  } 
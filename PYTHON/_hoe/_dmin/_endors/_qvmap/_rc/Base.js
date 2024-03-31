"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

const isNullLiteral = node => node.type === _experimentalUtils.AST_NODE_TYPES.Literal && node.value === null;
/**
 * Checks if the given `ParsedEqualityMatcherCall` is a call to one of the equality matchers,
 * with a `null` literal as the sole argument.
 */


const isNullEqualityMatcher = matcher => isNullLiteral(getFirstArgument(matcher));

const isFirstArgumentIdentifier = (matcher, name) => (0, _utils.isIdentifier)(getFirstArgument(matcher), name);

const shouldUseToBe = matcher => {
  const firstArg = getFirstArgument(matcher);

  if (firstArg.type === _experimentalUtils.AST_NODE_TYPES.Literal) {
    // regex literals are classed as literals, but they're actually objects
    // which means "toBe" will give different results than other matchers
    return !('regex' in firstArg);
  }

  return firstArg.type === _experimentalUtils.AST_NODE_TYPES.TemplateLiteral;
};

const getFirstArgument = matcher => {
  return (0, _utils.followTypeAssertionChain)(matcher.arguments[0]);
};

const reportPreferToBe = (context, whatToBe, matcher, modifier) => {
  const modifierNode = (modifier === null || modifier === void 0 ? void 0 : modifier.negation) || (modifier === null || modifier === void 0 ? void 0 : modifier.name) === _utils.ModifierName.not && (modifier === null || modifier === void 0 ? void 0 : modifier.node);
  context.report({
    messageId: `useToBe${whatToBe}`,

    fix(fixer) {
      var _matcher$arguments;

      const fixes = [fixer.replaceText(matcher.node.property, `toBe${whatToBe}`)];

      if ((_matcher$arguments = matcher.arguments) !== null && _matcher$arguments !== void 0 && _matcher$arguments.length && whatToBe !== '') {
        fixes.push(fixer.remove(matcher.arguments[0]));
      }

      if (modifierNode) {
        fixes.push(fixer.removeRange([modifierNode.property.range[0] - 1, modifierNode.property.range[1]]));
      }

      return fixes;
    },

    node: matcher.
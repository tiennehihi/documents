/* eslint max-len: 0 */

// A recursive descent parser operates by defining functions for all
// syntactic elements, and recursively calling those, each function
// advancing the input stream and returning an AST node. Precedence
// of constructs (for example, the fact that `!x[1]` means `!(x[1])`
// instead of `(!x)[1]` is handled by the fact that the parser
// function that parses unary prefix operators is called first, and
// in turn calls the function that parses `[]` subscripts — that
// way, it'll receive the node for `x[1]` already parsed, and wraps
// *that* in the unary operator node.
//
// Acorn uses an [operator precedence parser][opp] to handle binary
// operator precedence, because it is much more compact than using
// the technique outlined above, which uses different, nesting
// functions to specify precedence, for all of the ten binary
// precedence levels that JavaScript defines.
//
// [opp]: http://en.wikipedia.org/wiki/Operator-precedence_parser

import {
  flowParseArrow,
  flowParseFunctionBodyAndFinish,
  flowParseMaybeAssign,
  flowParseSubscript,
  flowParseSubscripts,
  flowParseVariance,
  flowStartParseAsyncArrowFromCallExpression,
  flowStartParseNewArguments,
  flowStartParseObjPropValue,
} from "../plugins/flow";
import {jsxParseElement} from "../plugins/jsx/index";
import {typedParseConditional, typedParseParenItem} from "../plugins/types";
import {
  tsParseArrow,
  tsParseFunctionBodyAndFinish,
  tsParseMaybeAssign,
  tsParseSubscript,
  tsParseType,
  tsParseTypeAssertion,
  tsStartParseAsyncArrowFromCallExpression,
  tsStartParseObjPropValue,
} from "../plugins/typescript";
import {
  eat,
  IdentifierRole,
  lookaheadCharCode,
  lookaheadType,
  match,
  next,
  nextTemplateToken,
  popTypeContext,
  pushTypeContext,
  rescan_gt,
  retokenizeSlashAsRegex,
} from "../tokenizer/index";
import {ContextualKeyword} from "../tokenizer/keywords";
import {Scope} from "../tokenizer/state";
import {TokenType, TokenType as tt} from "../tokenizer/types";
import {charCodes} from "../util/charcodes";
import {IS_IDENTIFIER_START} from "../util/identifier";
import {getNextContextId, isFlowEnabled, isJSXEnabled, isTypeScriptEnabled, state} from "./base";
import {
  markPriorBindingIdentifier,
  parseBindingIdentifier,
  parseMay
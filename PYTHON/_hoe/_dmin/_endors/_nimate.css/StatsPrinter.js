onTypeParams() {
  while (!_index.match.call(void 0, _types.TokenType.parenR) && !_index.match.call(void 0, _types.TokenType.ellipsis) && !_base.state.error) {
    flowParseFunctionTypeParam();
    if (!_index.match.call(void 0, _types.TokenType.parenR)) {
      _util.expect.call(void 0, _types.TokenType.comma);
    }
  }
  if (_index.eat.call(void 0, _types.TokenType.ellipsis)) {
    flowParseFunctionTypeParam();
  }
}

// The parsing of types roughly parallels the parsing of expressions, and
// primary types are kind of like primary expressions...they're the
// primitives with which other types are constructed.
function flowParsePrimaryType() {
  let isGroupedType = false;
  const oldNoAnonFunctionType = _base.state.noAnonFunctionType;

  switch (_base.state.type) {
    case _types.TokenType.name: {
      if (_util.isContextual.call(void 0, _keywords.ContextualKeyword._interface)) {
        flowParseInterfaceType();
        return;
      }
      _expression.parseIdentifier.call(void 0, );
      flowParseGenericType();
      return;
    }

    case _types.TokenType.braceL:
      flowParseObjectType(false, false, false);
      return;

    case _types.TokenType.braceBarL:
      flowParseObjectType(false, true, false);
      return;

    case _types.TokenType.bracketL:
      flowParseTupleType();
      return;

    case _types.TokenType.lessThan:
      flowParseTypeParameterDeclaration();
      _util.expect.call(void 0, _types.TokenType.parenL);
      flowParseFunctionTypeParams();
      _util.expect.call(void 0, _types.TokenType.parenR);
      _util.expect.call(void 0, _types.TokenType.arrow);
      flowParseType();
      return;

    case _types.TokenType.parenL:
      _index.next.call(void 0, );

      // Check to see if this is actually a grouped type
      if (!_index.match.call(void 0, _types.TokenType.parenR) && !_index.match.call(void 0, _types.TokenType.ellipsis)) {
        if (_index.match.call(void 0, _types.TokenType.name)) {
          const token = _index.lookaheadType.call(void 0, );
          isGroupedType = token !== _types.TokenType.question && token !== _types.TokenType.colon;
        } else {
          isGroupedType = true;
        }
      }

      if (isGroupedType) {
        _base.state.noAnonFunctionType = false;
        flowParseType();
        _base.state.noAnonFunctionType = oldNoAnonFunctionType;

        // A `,` or a `) =>` means this is an anonymous function type
        if (
          _base.state.noAnonFunctionType ||
          !(_index.match.call(void 0, _types.TokenType.comma) || (_index.match.call(void 0, _types.TokenType.parenR) && _index.lookaheadType.call(void 0, ) === _types.TokenType.arrow))
        ) {
          _util.expect.call(void 0, _types.TokenType.parenR);
          return;
        } else {
          // Eat a comma if there is one
          _index.eat.call(void 0, _types.TokenType.comma);
        }
      }

      flowParseFunctionTypeParams();

      _util.expect.call(void 0, _types.TokenType.parenR);
      _util.expect.call(void 0, _types.TokenType.arrow);
      flowParseType();
      return;

    case _types.TokenType.minus:
      _index.next.call(void 0, );
      _expression.parseLiteral.call(void 0, );
      return;

    case _types.TokenType.string:
    case _types.TokenType.num:
    case _types.TokenType._true:
    case _types.TokenType._false:
    case _types.TokenType._null:
    case _types.TokenType._this:
    case _types.TokenType._void:
    case _types.TokenType.star:
      _index.next.call(void 0, );
      return;

    default:
      if (_base.state.type === _types.TokenType._typeof) {
        flowParseTypeofType();
        return;
      } else if (_base.state.type & _types.TokenType.IS_KEYWORD) {
        _index.next.call(void 0, );
        _base.state.tokens[_base.state.tokens.length - 1].type = _types.TokenType.name;
        return;
      }
  }

  _util.unexpected.call(void 0, );
}

function flowParsePostfixType() {
  flowParsePrimaryType();
  while (!_util.canInsertSemicolon.call(void 0, ) && (_index.match.call(void 0, _types.TokenType.bracketL) || _index.match.call(void 0, _types.TokenType.questionDot))) {
    _index.eat.call(void 0, _types.TokenType.questionDot);
    _util.expect.call(void 0, _types.TokenType.bracketL);
    if (_index.eat.call(void 0, _types.TokenType.bracketR)) {
      // Array type
    } else {
      // Indexed access type
      flowParseType();
      _util.expect.call(void 0, _types.TokenType.bracketR);
    }
  }
}

function flowParsePrefixType() {
  if (_index.eat.call(void 0, _types.TokenType.question)) {
    flowParsePrefixType();
  } else {
    flowParsePostfixType();
  }
}

function flowParseAnonFunctionWithoutParens() {
  flowParsePrefixType();
  if (!_base.state.noAnonFunctionType && _index.eat.call(void 0, _types.TokenType.arrow)) {
    flowParseType();
  }
}

function flowParseIntersectionType() {
  _index.eat.call(void 0, _types.TokenType.bitwiseAND);
  flowParseAnonFunctionWithoutParens();
  while (_index.eat.call(void 0, _types.TokenType.bitwiseAND)) {
    flowParseAnonFunctionWithoutParens();
  }
}

function flowParseUnionType() {
  _index.eat.call(void 0, _types.TokenType.bitwiseOR);
  flowParseIntersectionType();
  while (_index.eat.call(void 0, _types.TokenType.bitwiseOR)) {
    flowParseIntersectionType();
  }
}

function flowParseType() {
  flowParseUnionType();
}

 function flowParseTypeAnnotation() {
  flowParseTypeInitialiser();
} exports.flowParseTypeAnnotation = flowParseTypeAnnotation;

function flowParseTypeAnnotatableIdentifier() {
  _expression.parseIdentifier.call(void 0, );
  if (_index.match.call(void 0, _types.TokenType.colon)) {
    flowParseTypeAnnotation();
  }
}

 function flowParseVariance() {
  if (_index.match.call(void 0, _types.TokenType.plus) || _index.match.call(void 0, _types.TokenType.minus)) {
    _index.next.call(void 0, );
    _base.state.tokens[_base.state.tokens.length - 1].isType = true;
  }
} exports.flowParseVariance = flowParseVariance;

// ==================================
// Overrides
// ==================================

 function flowParseFunctionBodyAndFinish(funcContextId) {
  // For arrow functions, `parseArrow` handles the return type itself.
  if (_index.match.call(void 0, _types.TokenType.colon)) {
    flowParseTypeAndPredicateInitialiser();
  }

  _expression.parseFunctionBody.call(void 0, false, funcContextId);
} exports.flowParseFunctionBodyAndFinish = flowParseFunctionBodyAndFinish;

 function flowParseSubscript(
  startTokenIndex,
  noCalls,
  stopState,
) {
  if (_index.match.call(void 0, _types.TokenType.questionDot) && _index.lookaheadType.call(void 0, ) === _types.TokenType.lessThan) {
    if (noCalls) {
      stopState.stop = true;
      return;
    }
    _index.next.call(void 0, );
    flowParseTypeParameterInstantiation();
    _util.expect.call(void 0, _types.TokenType.parenL);
    _expression.parseCallExpressionArguments.call(void 0, );
    return;
  } else if (!noCalls && _index.match.call(void 0, _types.TokenType.lessThan)) {
    const snapshot = _base.state.snapshot();
    flowParseTypeParameterInstantiation();
    _util.expect.call(void 0, _types.TokenType.parenL);
    _expression.parseCallExpressionArguments.call(void 0, );
    if (_base.state.error) {
      _base.state.restoreFromSnapshot(snapshot);
    } else {
      return;
    }
  }
  _expression.baseParseSubscript.call(void 0, startTokenIndex, noCalls, stopState);
} exports.flowParseSubscript = flowParseSubscript;

 function flowStartParseNewArguments() {
  if (_index.match.call(void 0, _types.TokenType.lessThan)) {
    const snapshot = _base.state.snapshot();
    flowParseTypeParameterInstantiation();
    if (_base.state.error) {
      _base.state.restoreFromSnapshot(snapshot);
    }
  }
} exports.flowStartParseNewArguments = flowStartParseNewArguments;

// interfaces
 function flowTryParseS
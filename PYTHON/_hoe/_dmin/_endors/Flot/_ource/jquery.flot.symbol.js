 if (isImportKeyword(node.expression)) {
      node.transformFlags |= 8388608 /* ContainsDynamicImport */;
    }
    return node;
  }
  function updateCallExpression(node, expression, typeArguments, argumentsArray) {
    if (isCallChain(node)) {
      return updateCallChain(node, expression, node.questionDotToken, typeArguments, argumentsArray);
    }
    return node.expression !== expression || node.typeArguments !== typeArguments || node.arguments !== argumentsArray ? update(createCallExpression(expression, typeArguments, argumentsArray), node) : node;
  }
  function createCallChain(expression, questionDotToken, typeArguments, argumentsArray) {
    const node = createBaseCallExpression(
      parenthesizerRules().parenthesizeLeftSideOfAccess(
        expression,
        /*optionalChain*/
        true
      ),
      questionDotToken,
      asNodeArray(typeArguments),
      parenthesizerRules().parenthesizeExpressionsOfCommaDelimitedList(createNodeArray(argumentsArray))
    );
    node.flags |= 64 /* OptionalChain */;
    node.transformFlags |= 32 /* ContainsES2020 */;
    return node;
  }
  function updateCallChain(node, expression, questionDotToken, typeArguments, argumentsArray) {
    Debug.assert(!!(node.flags & 64 /* OptionalChain */), "Cannot update a CallExpression using updateCallChain. Use updateCall instead.");
    return node.expression !== expression || node.questionDotToken !== questionDotToken || node.typeArguments !== typeArguments || node.arguments !== argumentsArray ? update(createCallChain(expression, questionDotToken, typeArguments, argumentsArray), node) : node;
  }
  function createNewExpression(expression, typeArguments, argumentsArray) {
    const node = createBaseDeclaration(214 /* NewExpression */);
    node.expression = parenthesizerRules().parenthesizeExpressionOfNew(expression);
    node.typeArguments = asNodeArray(typeArguments);
    node.arguments = argumentsArray ? parenthesizerRules().parenthesizeExpressionsOfCommaDelimitedList(argumentsArray) : void 0;
    node.transformFlags |= propagateChildFlags(node.expression) | propagateChildrenFlags(node.typeArguments) | propagateChildrenFlags(node.arguments) | 32 /* ContainsES2020 */;
    if (node.typeArguments) {
      node.transformFlags |= 1 /* ContainsTypeScript */;
    }
    return node;
  }
  function updateNewExpression(node, expression, typeArguments, argumentsArray) {
    return node.expression !== expression || node.typeArguments !== typeArguments || node.arguments !== argumentsArray ? update(createNewExpression(expression, typeArguments, argumentsArray), node) : node;
  }
  function createTaggedTemplateExpression(tag, typeArguments, template) {
    const node = createBaseNode(215 /* TaggedTemplateExpression */);
    node.tag = parenthesizerRules().parenthesizeLeftSideOfAccess(
      tag,
      /*optionalChain*/
      false
    );
    node.typeArguments = asNodeArray(typeArguments);
    node.template = template;
    node.transformFlags |= propagateChildFlags(node.tag) | propagateChildrenFlags(node.typeArguments) | propagateChildFlags(node.template) | 1024 /* ContainsES2015 */;
    if (node.typeArguments) {
      node.transformFlags |= 1 /* ContainsTypeScript */;
    }
    if (hasInvalidEscape(node.template)) {
      node.transformFlags |= 128 /* ContainsES2018 */;
    }
    return node;
  }
  function updateTaggedTemplateExpression(node, tag, typeArgumen
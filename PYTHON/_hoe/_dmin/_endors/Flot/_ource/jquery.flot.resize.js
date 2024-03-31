reateReturnStatement(node);
    setTextRange(returnStatement, node);
    const body = factory2.createBlock([returnStatement], multiLine);
    setTextRange(body, node);
    return body;
  }
  function convertToFunctionExpression(node) {
    var _a;
    if (!node.body)
      return Debug.fail(`Cannot convert a FunctionDeclaration without a body`);
    const updated = factory2.createFunctionExpression(
      (_a = getModifiers(node)) == null ? void 0 : _a.filter((modifier) => !isExportModifier(modifier) && !isDefaultModifier(modifier)),
      node.asteriskToken,
      node.name,
      node.typeParameters,
      node.parameters,
      node.type,
      node.body
    );
    setOriginalNode(updated, node);
    setTextRange(updated, node);
    if (getStartsOnNewLine(node)) {
      setStartsOnNewLine(
        updated,
        /*newLine*/
        true
      );
    }
    return updated;
  }
  function convertToClassExpression(node) {
    var _a;
    const updated = factory2.createClassExpression(
      (_a = node.modifiers) == null ? void 0 : _a.filter((modifier) => !isExportModifier(modifier) && !isDefaultModifier(modifier)),
      node.name,
      node.typeParameters,
      node.heritageClauses,
      node.members
    );
    setOriginalNode(updated, node);
    setTextRange(updated, node);
    if (getStartsOnNewLine(node)) {
      setStartsOnNewLine(
        updated,
        /*newLine*/
        true
      );
    }
    return updated;
  }
  function convertToArrayAssignmentElement(element) {
    if (isBindingElement(element)) {
      if (element.dotDotDotToken) {
        Debug.assertNode(element.name, isIdentifier);
        return setOriginalNode(setTextRange(factory2.createSpreadElement(element.name), element), element);
      }
      const expression = convertToAssignmentElementTarget(element.name);
      return element.initializer ? setOriginalNode(
        setTextRange(
          factory2.createAssignment(expression, element.initializer),
          element
        ),
        element
      ) : expression;
    }
    return cast(element, isExpression);
  }
  function convertToObjectAssignmentElement(element) {
    if (isBindingElement(element)) {
      if (element.dotDotDotToken) {
        Debug.assertNode(element.name, isIdentifier);
        return setOriginalNode(setTextRange(factory2.createSpreadAssignment(element.name), element), element);
      }
      if (element.propertyName) {
        const expression = convertToAssignmentElementTarget(element.name);
        return setOriginalNode(setTextRange(factory2.createPropertyAssignment(element.propertyName, element.initializer ? factory2.createAssignment(expression, element.initializer) : expression), element), element);
      }
      Debug.assertNode(element.name, isIdentifier);
      return setOriginalNode(setTextRange(factory2.createShorthandPropertyAssignment(element.name, element.initializer), element), element);
    }
    return cast(element, isObjectLiteralElementLike);
  }
  function convertToAssignmentPattern(node) {
    switch (node.kind) {
      case 207 /* ArrayBindingPattern */:
      case 209 /* ArrayLiteralExpression */:
        return convertToArrayAssignmentPattern(node);
      case 206 /* ObjectBindingPattern */:
      case 210 /* ObjectLiteralExpression */:
        return convertToObjectAssignmentPatter
 return context.factory.updateCallSignature(
      node,
      nodesVisitor(node.typeParameters, visitor, isTypeParameterDeclaration),
      nodesVisitor(node.parameters, visitor, isParameter),
      nodeVisitor(node.type, visitor, isTypeNode)
    );
  },
  [180 /* ConstructSignature */]: function visitEachChildOfConstructSignatureDeclaration(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateConstructSignature(
      node,
      nodesVisitor(node.typeParameters, visitor, isTypeParameterDeclaration),
      nodesVisitor(node.parameters, visitor, isParameter),
      nodeVisitor(node.type, visitor, isTypeNode)
    );
  },
  [181 /* IndexSignature */]: function visitEachChildOfIndexSignatureDeclaration(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateIndexSignature(
      node,
      nodesVisitor(node.modifiers, visitor, isModifierLike),
      nodesVisitor(node.parameters, visitor, isParameter),
      Debug.checkDefined(nodeVisitor(node.type, visitor, isTypeNode))
    );
  },
  // Types
  [182 /* TypePredicate */]: function visitEachChildOfTypePredicateNode(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateTypePredicateNode(
      node,
      nodeVisitor(node.assertsModifier, visitor, isAssertsKeyword),
      Debug.checkDefined(nodeVisitor(node.parameterName, visitor, isIdentifierOrThisTypeNode)),
      nodeVisitor(node.type, visitor, isTypeNode)
    );
  },
  [183 /* TypeReference */]: function visitEachChildOfTypeReferenceNode(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateTypeReferenceNode(
      node,
      Debug.checkDefined(nodeVisitor(node.typeName, visitor, isEntityName)),
      nodesVisitor(node.typeArguments, visitor, isTypeNode)
    );
  },
  [184 /* FunctionType */]: function visitEachChildOfFunctionTypeNode(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateFunctionTypeNode(
      node,
      nodesVisitor(node.typeParameters, visitor, isTypeParameterDeclaration),
      nodesVisitor(node.parameters, visitor, isParameter),
      Debug.checkDefined(nodeVisitor(node.type, visitor, isTypeNode))
    );
  },
  [185 /* ConstructorType */]: function visitEachChildOfConstructorTypeNode(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateConstructorTypeNode(
      node,
      nodesVisitor(node.modifiers, visitor, isModifier),
      nodesVisitor(node.typeParameters, visitor, isTypeParameterDeclaration),
      nodesVisitor(node.parameters, visitor, isParameter),
      Debug.checkDefined(nodeVisitor(node.type, visitor, isTypeNode))
    );
  },
  [186 /* TypeQuery */]: function visitEachChildOfTypeQueryNode(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateTypeQueryNode(
      node,
      Debug.checkDefined(nodeVisitor(node.exprName, visitor, isEntityName)),
      nodesVisitor(node.typeArguments, visitor, isTypeNode)
    );
  },
  [187 /* TypeLiteral */]: function visitEachChildOfTypeLiteralNode(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateTypeLiteralNode(
      node,
      nodesVisitor(node.members, visitor, isTypeElement)
    );
  },
  [188 /* ArrayType */]: function visitEachChildOfArrayTypeNode(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateArrayTypeNode(
      node,
      Debug.checkDefined(nodeVisitor(node.elementType, visitor, isTypeNode))
    );
  },
  [189 /* TupleType */]: function visitEachChildOfTupleTypeNode(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateTupleTypeNode(
      node,
      nodesVisitor(node.elements, visitor, isTypeNode)
    );
  },
  [190 /* OptionalType */]: function visitEachChildOfOptionalTypeNode(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateOptionalTypeNode(
      node,
      Debug.checkDefined(nodeVisitor(node.type, visitor, isTypeNode))
    );
  },
  [191 /* RestType */]: function visitEachChildOfRestTypeNode(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateRestTypeNode(
      node,
      Debug.checkDefined(nodeVisitor(node.type, visitor, isTypeNode))
    );
  },
  [192 /* UnionType */]: function visitEachChildOfUnionTypeNode(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateUnionTypeNode(
      node,
      nodesVisitor(node.types, visitor, isTypeNode)
    );
  },
  [193 /* IntersectionType */]: function visitEachChildOfIntersectionTypeNode(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateIntersectionTypeNode(
      node,
      nodesVisitor(node.types, visitor, isTypeNode)
    );
  },
  [194 /* ConditionalType */]: function visitEachChildOfConditionalTypeNode(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateConditionalTypeNode(
      node,
      Debug.checkDefined(nodeVisitor(node.checkType, visitor, isTypeNode)),
      Debug.checkDefined(nodeVisitor(node.extendsType, visitor, isTypeNode)),
      Debug.checkDefined(nodeVisitor(node.trueType, visitor, isTypeNode)),
      Debug.checkDefined(nodeVisitor(node.falseType, visitor, isTypeNode))
    );
  },
  [195 /* InferType */]: function visitEachChildOfInferTypeNode(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateInferTypeNode(
      node,
      Debug.checkDefined(nodeVisitor(node.typeParameter, visitor, isTypeParameterDeclaration))
    );
  },
  [205 /* ImportType */]: function visitEachChildOfImportTypeNode(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateImportTypeNode(
      node,
      Debug.checkDefined(nodeVisitor(node.argument, visitor, isTypeNode)),
      nodeVisitor(node.attributes, visitor, isImportAttributes),
      nodeVisitor(node.qualifier, visitor, isEntityName),
      nodesVisitor(node.typeArguments, visitor, isTypeNode),
      node.isTypeOf
    );
  },
  [302 /* ImportTypeAssertionContainer */]: function visitEachChildOfImportTypeAssertionContainer(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateImportTypeAssertionContainer(
      node,
      Debug.checkDefined(nodeVisitor(node.assertClause, visitor, isAssertClause)),
      node.multiLine
    );
  },
  [202 /* NamedTupleMember */]: function visitEachChildOfNamedTupleMember(node, visitor, context, _nodesVisitor, nodeVisitor, tokenVisitor) {
    return context.factory.updateNamedTupleMember(
      node,
      tokenVisitor ? nodeVisitor(node.dotDotDotToken, tokenVisitor, isDotDotDotToken) : node.dotDotDotToken,
      Debug.checkDefined(nodeVisitor(node.name, visitor, isIdentifier)),
      tokenVisitor ? nodeVisitor(node.questionToken, tokenVisitor, isQuestionToken) : node.questionToken,
      Debug.checkDefined(nodeVisitor(node.type, visitor, isTypeNode))
    );
  },
  [196 /* ParenthesizedType */]: function visitEachChildOfParenthesizedType(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateParenthesizedType(
      node,
      Debug.checkDefined(nodeVisitor(node.type, visitor, isTypeNode))
    );
  },
  [198 /* TypeOperator */]: function visitEachChildOfTypeOperatorNode(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateTypeOperatorNode(
      node,
      Debug.checkDefined(nodeVisitor(node.type, visitor, isTypeNode))
    );
  },
  [199 /* IndexedAccessType */]: function visitEachChildOfIndexedAccessType(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateIndexedAccessTypeNode(
      node,
      Debug.checkDefined(nodeVisitor(node.objectType, visitor, isTypeNode)),
      Debug.checkDefined(nodeVisitor(node.indexType, visitor, isTypeNode))
    );
  },
  [200 /* MappedType */]: function visitEachChildOfMappedType(node, visitor, context, nodesVisitor, nodeVisitor, tokenVisitor) {
    return context.factory.updateMappedTypeNode(
      node,
      tokenVisitor ? nodeVisitor(node.readonlyToken, tokenVisitor, isReadonlyKeywordOrPlusOrMinusToken) : node.readonlyToken,
      Debug.checkDefined(nodeVisitor(node.typeParameter, visitor, isTypeParameterDeclaration)),
      nodeVisitor(node.nameType, visitor, isTypeNode),
      tokenVisitor ? nodeVisitor(node.questionToken, tokenVisitor, isQuestionOrPlusOrMinusToken) : node.questionToken,
      nodeVisitor(node.type, visitor, isTypeNode),
      nodesVisitor(node.members, visitor, isTypeElement)
    );
  },
  [201 /* LiteralType */]: function visitEachChildOfLiteralTypeNode(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateLiteralTypeNode(
      node,
      Debug.checkDefined(nodeVisitor(node.literal, visitor, isLiteralTypeLiteral))
    );
  },
  [203 /* TemplateLiteralType */]: function visitEachChildOfTemplateLiteralType(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateTemplateLiteralType(
      node,
      Debug.checkDefined(nodeVisitor(node.head, visitor, isTemplateHead)),
      nodesVisitor(node.templateSpans, visitor, isTemplateLiteralTypeSpan)
    );
  },
  [204 /* TemplateLiteralTypeSpan */]: function visitEachChildOfTemplateLiteralTypeSpan(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateTemplateLiteralTypeSpan(
      node,
      Debug.checkDefined(nodeVisitor(node.type, visitor, isTypeNode)),
      Debug.checkDefined(nodeVisitor(node.literal, visitor, isTemplateMiddleOrTemplateTail))
    );
  },
  // Binding patterns
  [206 /* ObjectBindingPattern */]: function visitEachChildOfObjectBindingPattern(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateObjectBindingPattern(
      node,
      nodesVisitor(node.elements, visitor, isBindingElement)
    );
  },
  [207 /* ArrayBindingPattern */]: function visitEachChildOfArrayBindingPattern(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateArrayBindingPattern(
      node,
      nodesVisitor(node.elements, visitor, isArrayBindingElement)
    );
  },
  [208 /* BindingElement */]: function visitEachChildOfBindingElement(node, visitor, context, _nodesVisitor, nodeVisitor, tokenVisitor) {
    return context.factory.updateBindingElement(
      node,
      tokenVisitor ? nodeVisitor(node.dotDotDotToken, tokenVisitor, isDotDotDotToken) : node.dotDotDotToken,
      nodeVisitor(node.propertyName, visitor, isPropertyName),
      Debug.checkDefined(nodeVisitor(node.name, visitor, isBindingName)),
      nodeVisitor(node.initializer, visitor, isExpression)
    );
  },
  // Expression
  [209 /* ArrayLiteralExpression */]: function visitEachChildOfArrayLiteralExpression(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateArrayLiteralExpression(
      node,
      nodesVisitor(node.elements, visitor, isExpression)
    );
  },
  [210 /* ObjectLiteralExpression */]: function visitEachChildOfObjectLiteralExpression(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateObjectLiteralExpression(
      node,
      nodesVisitor(node.properties, visitor, isObjectLiteralElementLike)
    );
  },
  [211 /* PropertyAccessExpression */]: function visitEachChildOfPropertyAccessExpression(node, visitor, context, _nodesVisitor, nodeVisitor, tokenVisitor) {
    return isPropertyAccessChain(node) ? context.factory.updatePropertyAccessChain(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      tokenVisitor ? nodeVisitor(node.questionDotToken, tokenVisitor, isQuestionDotToken) : node.questionDotToken,
      Debug.checkDefined(nodeVisitor(node.name, visitor, isMemberName))
    ) : context.factory.updatePropertyAccessExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      Debug.checkDefined(nodeVisitor(node.name, visitor, isMemberName))
    );
  },
  [212 /* ElementAccessExpression */]: function visitEachChildOfElementAccessExpression(node, visitor, context, _nodesVisitor, nodeVisitor, tokenVisitor) {
    return isElementAccessChain(node) ? context.factory.updateElementAccessChain(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      tokenVisitor ? nodeVisitor(node.questionDotToken, tokenVisitor, isQuestionDotToken) : node.questionDotToken,
      Debug.checkDefined(nodeVisitor(node.argumentExpression, visitor, isExpression))
    ) : context.factory.updateElementAccessExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      Debug.checkDefined(nodeVisitor(node.argumentExpression, visitor, isExpression))
    );
  },
  [213 /* CallExpression */]: function visitEachChildOfCallExpression(node, visitor, context, nodesVisitor, nodeVisitor, tokenVisitor) {
    return isCallChain(node) ? context.factory.updateCallChain(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      tokenVisitor ? nodeVisitor(node.questionDotToken, tokenVisitor, isQuestionDotToken) : node.questionDotToken,
      nodesVisitor(node.typeArguments, visitor, isTypeNode),
      nodesVisitor(node.arguments, visitor, isExpression)
    ) : context.factory.updateCallExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      nodesVisitor(node.typeArguments, visitor, isTypeNode),
      nodesVisitor(node.arguments, visitor, isExpression)
    );
  },
  [214 /* NewExpression */]: function visitEachChildOfNewExpression(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateNewExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      nodesVisitor(node.typeArguments, visitor, isTypeNode),
      nodesVisitor(node.arguments, visitor, isExpression)
    );
  },
  [215 /* TaggedTemplateExpression */]: function visitEachChildOfTaggedTemplateExpression(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateTaggedTemplateExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.tag, visitor, isExpression)),
      nodesVisitor(node.typeArguments, visitor, isTypeNode),
      Debug.checkDefined(nodeVisitor(node.template, visitor, isTemplateLiteral))
    );
  },
  [216 /* TypeAssertionExpression */]: function visitEachChildOfTypeAssertionExpression(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateTypeAssertion(
      node,
      Debug.checkDefined(nodeVisitor(node.type, visitor, isTypeNode)),
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    );
  },
  [217 /* ParenthesizedExpression */]: function visitEachChildOfParenthesizedExpression(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateParenthesizedExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    );
  },
  [218 /* FunctionExpression */]: function visitEachChildOfFunctionExpression(node, visitor, context, nodesVisitor, nodeVisitor, tokenVisitor) {
    return context.factory.updateFunctionExpression(
      node,
      nodesVisitor(node.modifiers, visitor, isModifier),
      tokenVisitor ? nodeVisitor(node.asteriskToken, tokenVisitor, isAsteriskToken) : node.asteriskToken,
      nodeVisitor(node.name, visitor, isIdentifier),
      nodesVisitor(node.typeParameters, visitor, isTypeParameterDeclaration),
      visitParameterList(node.parameters, visitor, context, nodesVisitor),
      nodeVisitor(node.type, visitor, isTypeNode),
      visitFunctionBody(node.body, visitor, context, nodeVisitor)
    );
  },
  [219 /* ArrowFunction */]: function visitEachChildOfArrowFunction(node, visitor, context, nodesVisitor, nodeVisitor, tokenVisitor) {
    return context.factory.updateArrowFunction(
      node,
      nodesVisitor(node.modifiers, visitor, isModifier),
      nodesVisitor(node.typeParameters, visitor, isTypeParameterDeclaration),
      visitParameterList(node.parameters, visitor, context, nodesVisitor),
      nodeVisitor(node.type, visitor, isTypeNode),
      tokenVisitor ? Debug.checkDefined(nodeVisitor(node.equalsGreaterThanToken, tokenVisitor, isEqualsGreaterThanToken)) : node.equalsGreaterThanToken,
      visitFunctionBody(node.body, visitor, context, nodeVisitor)
    );
  },
  [220 /* DeleteExpression */]: function visitEachChildOfDeleteExpression(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateDeleteExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    );
  },
  [221 /* TypeOfExpression */]: function visitEachChildOfTypeOfExpression(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateTypeOfExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    );
  },
  [222 /* VoidExpression */]: function visitEachChildOfVoidExpression(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateVoidExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    );
  },
  [223 /* AwaitExpression */]: function visitEachChildOfAwaitExpression(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateAwaitExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    );
  },
  [224 /* PrefixUnaryExpression */]: function visitEachChildOfPrefixUnaryExpression(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updatePrefixUnaryExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.operand, visitor, isExpression))
    );
  },
  [225 /* PostfixUnaryExpression */]: function visitEachChildOfPostfixUnaryExpression(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updatePostfixUnaryExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.operand, visitor, isExpression))
    );
  },
  [226 /* BinaryExpression */]: function visitEachChildOfBinaryExpression(node, visitor, context, _nodesVisitor, nodeVisitor, tokenVisitor) {
    return context.factory.updateBinaryExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.left, visitor, isExpression)),
      tokenVisitor ? Debug.checkDefined(nodeVisitor(node.operatorToken, tokenVisitor, isBinaryOperatorToken)) : node.operatorToken,
      Debug.checkDefined(nodeVisitor(node.right, visitor, isExpression))
    );
  },
  [227 /* ConditionalExpression */]: function visitEachChildOfConditionalExpression(node, visitor, context, _nodesVisitor, nodeVisitor, tokenVisitor) {
    return context.factory.updateConditionalExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.condition, visitor, isExpression)),
      tokenVisitor ? Debug.checkDefined(nodeVisitor(node.questionToken, tokenVisitor, isQuestionToken)) : node.questionToken,
      Debug.checkDefined(nodeVisitor(node.whenTrue, visitor, isExpression)),
      tokenVisitor ? Debug.checkDefined(nodeVisitor(node.colonToken, tokenVisitor, isColonToken)) : node.colonToken,
      Debug.checkDefined(nodeVisitor(node.whenFalse, visitor, isExpression))
    );
  },
  [228 /* TemplateExpression */]: function visitEachChildOfTemplateExpression(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateTemplateExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.head, visitor, isTemplateHead)),
      nodesVisitor(node.templateSpans, visitor, isTemplateSpan)
    );
  },
  [229 /* YieldExpression */]: function visitEachChildOfYieldExpression(node, visitor, context, _nodesVisitor, nodeVisitor, tokenVisitor) {
    return context.factory.updateYieldExpression(
      node,
      tokenVisitor ? nodeVisitor(node.asteriskToken, tokenVisitor, isAsteriskToken) : node.asteriskToken,
      nodeVisitor(node.expression, visitor, isExpression)
    );
  },
  [230 /* SpreadElement */]: function visitEachChildOfSpreadElement(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateSpreadElement(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    );
  },
  [231 /* ClassExpression */]: function visitEachChildOfClassExpression(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateClassExpression(
      node,
      nodesVisitor(node.modifiers, visitor, isModifierLike),
      nodeVisitor(node.name, visitor, isIdentifier),
      nodesVisitor(node.typeParameters, visitor, isTypeParameterDeclaration),
      nodesVisitor(node.heritageClauses, visitor, isHeritageClause),
      nodesVisitor(node.members, visitor, isClassElement)
    );
  },
  [233 /* ExpressionWithTypeArguments */]: function visitEachChildOfExpressionWithTypeArguments(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateExpressionWithTypeArguments(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      nodesVisitor(node.typeArguments, visitor, isTypeNode)
    );
  },
  [234 /* AsExpression */]: function visitEachChildOfAsExpression(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateAsExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      Debug.checkDefined(nodeVisitor(node.type, visitor, isTypeNode))
    );
  },
  [238 /* SatisfiesExpression */]: function visitEachChildOfSatisfiesExpression(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateSatisfiesExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      Debug.checkDefined(nodeVisitor(node.type, visitor, isTypeNode))
    );
  },
  [235 /* NonNullExpression */]: function visitEachChildOfNonNullExpression(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return isOptionalChain(node) ? context.factory.updateNonNullChain(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    ) : context.factory.updateNonNullExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    );
  },
  [236 /* MetaProperty */]: function visitEachChildOfMetaProperty(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateMetaProperty(
      node,
      Debug.checkDefined(nodeVisitor(node.name, visitor, isIdentifier))
    );
  },
  // Misc
  [239 /* TemplateSpan */]: function visitEachChildOfTemplateSpan(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateTemplateSpan(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      Debug.checkDefined(nodeVisitor(node.literal, visitor, isTemplateMiddleOrTemplateTail))
    );
  },
  // Element
  [241 /* Block */]: function visitEachChildOfBlock(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateBlock(
      node,
      nodesVisitor(node.statements, visitor, isStatement)
    );
  },
  [243 /* VariableStatement */]: function visitEachChildOfVariableStatement(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateVariableStatement(
      node,
      nodesVisitor(node.modifiers, visitor, isModifierLike),
      Debug.checkDefined(nodeVisitor(node.declarationList, visitor, isVariableDeclarationList))
    );
  },
  [244 /* ExpressionStatement */]: function visitEachChildOfExpressionStatement(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateExpressionStatement(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    );
  },
  [245 /* IfStatement */]: function visitEachChildOfIfStatement(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateIfStatement(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      Debug.checkDefined(nodeVisitor(node.thenStatement, visitor, isStatement, context.factory.liftToBlock)),
      nodeVisitor(node.elseStatement, visitor, isStatement, context.factory.liftToBlock)
    );
  },
  [246 /* DoStatement */]: function visitEachChildOfDoStatement(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateDoStatement(
      node,
      visitIterationBody(node.statement, visitor, context, nodeVisitor),
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    );
  },
  [247 /* WhileStatement */]: function visitEachChildOfWhileStatement(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateWhileStatement(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      visitIterationBody(node.statement, visitor, context, nodeVisitor)
    );
  },
  [248 /* ForStatement */]: function visitEachChildOfForStatement(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateForStatement(
      node,
      nodeVisitor(node.initializer, visitor, isForInitializer),
      nodeVisitor(node.condition, visitor, isExpression),
      nodeVisitor(node.incrementor, visitor, isExpression),
      visitIterationBody(node.statement, visitor, context, nodeVisitor)
    );
  },
  [249 /* ForInStatement */]: function visitEachChildOfForInStatement(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateForInStatement(
      node,
      Debug.checkDefined(nodeVisitor(node.initializer, visitor, isForInitializer)),
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      visitIterationBody(node.statement, visitor, context, nodeVisitor)
    );
  },
  [250 /* ForOfStatement */]: function visitEachChildOfForOfStatement(node, visitor, context, _nodesVisitor, nodeVisitor, tokenVisitor) {
    return context.factory.updateForOfStatement(
      node,
      tokenVisitor ? nodeVisitor(node.awaitModifier, tokenVisitor, isAwaitKeyword) : node.awaitModifier,
      Debug.checkDefined(nodeVisitor(node.initializer, visitor, isForInitializer)),
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      visitIterationBody(node.statement, visitor, context, nodeVisitor)
    );
  },
  [251 /* ContinueStatement */]: function visitEachChildOfContinueStatement(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateContinueStatement(
      node,
      nodeVisitor(node.label, visitor, isIdentifier)
    );
  },
  [252 /* BreakStatement */]: function visitEachChildOfBreakStatement(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateBreakStatement(
      node,
      nodeVisitor(node.label, visitor, isIdentifier)
    );
  },
  [253 /* ReturnStatement */]: function visitEachChildOfReturnStatement(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateReturnStatement(
      node,
      nodeVisitor(node.expression, visitor, isExpression)
    );
  },
  [254 /* WithStatement */]: function visitEachChildOfWithStatement(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateWithStatement(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      Debug.checkDefined(nodeVisitor(node.statement, visitor, isStatement, context.factory.liftToBlock))
    );
  },
  [255 /* SwitchStatement */]: function visitEachChildOfSwitchStatement(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateSwitchStatement(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      Debug.checkDefined(nodeVisitor(node.caseBlock, visitor, isCaseBlock))
    );
  },
  [256 /* LabeledStatement */]: function visitEachChildOfLabeledStatement(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateLabeledStatement(
      node,
      Debug.checkDefined(nodeVisitor(node.label, visitor, isIdentifier)),
      Debug.checkDefined(nodeVisitor(node.statement, visitor, isStatement, context.factory.liftToBlock))
    );
  },
  [257 /* ThrowStatement */]: function visitEachChildOfThrowStatement(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateThrowStatement(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    );
  },
  [258 /* TryStatement */]: function visitEachChildOfTryStatement(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateTryStatement(
      node,
      Debug.checkDefined(nodeVisitor(node.tryBlock, visitor, isBlock)),
      nodeVisitor(node.catchClause, visitor, isCatchClause),
      nodeVisitor(node.finallyBlock, visitor, isBlock)
    );
  },
  [260 /* VariableDeclaration */]: function visitEachChildOfVariableDeclaration(node, visitor, context, _nodesVisitor, nodeVisitor, tokenVisitor) {
    return context.factory.updateVariableDeclaration(
      node,
      Debug.checkDefined(nodeVisitor(node.name, visitor, isBindingName)),
      tokenVisitor ? nodeVisitor(node.exclamationToken, tokenVisitor, isExclamationToken) : node.exclamationToken,
      nodeVisitor(node.type, visitor, isTypeNode),
      nodeVisitor(node.initializer, visitor, isExpression)
    );
  },
  [261 /* VariableDeclarationList */]: function visitEachChildOfVariableDeclarationList(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateVariableDeclarationList(
      node,
      nodesVisitor(node.declarations, visitor, isVariableDeclaration)
    );
  },
  [262 /* FunctionDeclaration */]: function visitEachChildOfFunctionDeclaration(node, visitor, context, nodesVisitor, nodeVisitor, tokenVisitor) {
    return context.factory.updateFunctionDeclaration(
      node,
      nodesVisitor(node.modifiers, visitor, isModifier),
      tokenVisitor ? nodeVisitor(node.asteriskToken, tokenVisitor, isAsteriskToken) : node.asteriskToken,
      nodeVisitor(node.name, visitor, isIdentifier),
      nodesVisitor(node.typeParameters, visitor, isTypeParameterDeclaration),
      visitParameterList(node.parameters, visitor, context, nodesVisitor),
      nodeVisitor(node.type, visitor, isTypeNode),
      visitFunctionBody(node.body, visitor, context, nodeVisitor)
    );
  },
  [263 /* ClassDeclaration */]: function visitEachChildOfClassDeclaration(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateClassDeclaration(
      node,
      nodesVisitor(node.modifiers, visitor, isModifierLike),
      nodeVisitor(node.name, visitor, isIdentifier),
      nodesVisitor(node.typeParameters, visitor, isTypeParameterDeclaration),
      nodesVisitor(node.heritageClauses, visitor, isHeritageClause),
      nodesVisitor(node.members, visitor, isClassElement)
    );
  },
  [264 /* InterfaceDeclaration */]: function visitEachChildOfInterfaceDeclaration(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateInterfaceDeclaration(
      node,
      nodesVisitor(node.modifiers, visitor, isModifierLike),
      Debug.checkDefined(nodeVisitor(node.name, visitor, isIdentifier)),
      nodesVisitor(node.typeParameters, visitor, isTypeParameterDeclaration),
      nodesVisitor(node.heritageClauses, visitor, isHeritageClause),
      nodesVisitor(node.members, visitor, isTypeElement)
    );
  },
  [265 /* TypeAliasDeclaration */]: function visitEachChildOfTypeAliasDeclaration(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateTypeAliasDeclaration(
      node,
      nodesVisitor(node.modifiers, visitor, isModifierLike),
      Debug.checkDefined(nodeVisitor(node.name, visitor, isIdentifier)),
      nodesVisitor(node.typeParameters, visitor, isTypeParameterDeclaration),
      Debug.checkDefined(nodeVisitor(node.type, visitor, isTypeNode))
    );
  },
  [266 /* EnumDeclaration */]: function visitEachChildOfEnumDeclaration(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateEnumDeclaration(
      node,
      nodesVisitor(node.modifiers, visitor, isModifierLike),
      Debug.checkDefined(nodeVisitor(node.name, visitor, isIdentifier)),
      nodesVisitor(node.members, visitor, isEnumMember)
    );
  },
  [267 /* ModuleDeclaration */]: function visitEachChildOfModuleDeclaration(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateModuleDeclaration(
      node,
      nodesVisitor(node.modifiers, visitor, isModifierLike),
      Debug.checkDefined(nodeVisitor(node.name, visitor, isModuleName)),
      nodeVisitor(node.body, visitor, isModuleBody)
    );
  },
  [268 /* ModuleBlock */]: function visitEachChildOfModuleBlock(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateModuleBlock(
      node,
      nodesVisitor(node.statements, visitor, isStatement)
    );
  },
  [269 /* CaseBlock */]: function visitEachChildOfCaseBlock(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateCaseBlock(
      node,
      nodesVisitor(node.clauses, visitor, isCaseOrDefaultClause)
    );
  },
  [270 /* NamespaceExportDeclaration */]: function visitEachChildOfNamespaceExportDeclaration(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateNamespaceExportDeclaration(
      node,
      Debug.checkDefined(nodeVisitor(node.name, visitor, isIdentifier))
    );
  },
  [271 /* ImportEqualsDeclaration */]: function visitEachChildOfImportEqualsDeclaration(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateImportEqualsDeclaration(
      node,
      nodesVisitor(node.modifiers, visitor, isModifierLike),
      node.isTypeOnly,
      Debug.checkDefined(nodeVisitor(node.name, visitor, isIdentifier)),
      Debug.checkDefined(nodeVisitor(node.moduleReference, visitor, isModuleReference))
    );
  },
  [272 /* ImportDeclaration */]: function visitEachChildOfImportDeclaration(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateImportDeclaration(
      node,
      nodesVisitor(node.modifiers, visitor, isModifierLike),
      nodeVisitor(node.importClause, visitor, isImportClause),
      Debug.checkDefined(nodeVisitor(node.moduleSpecifier, visitor, isExpression)),
      nodeVisitor(node.attributes, visitor, isImportAttributes)
    );
  },
  [300 /* ImportAttributes */]: function visitEachChildOfImportAttributes(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateImportAttributes(
      node,
      nodesVisitor(node.elements, visitor, isImportAttribute),
      node.multiLine
    );
  },
  [301 /* ImportAttribute */]: function visitEachChildOfImportAttribute(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateImportAttribute(
      node,
      Debug.checkDefined(nodeVisitor(node.name, visitor, isImportAttributeName)),
      Debug.checkDefined(nodeVisitor(node.value, visitor, isExpression))
    );
  },
  [273 /* ImportClause */]: function visitEachChildOfImportClause(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateImportClause(
      node,
      node.isTypeOnly,
      nodeVisitor(node.name, visitor, isIdentifier),
      nodeVisitor(node.namedBindings, visitor, isNamedImportBindings)
    );
  },
  [274 /* NamespaceImport */]: function visitEachChildOfNamespaceImport(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateNamespaceImport(
      node,
      Debug.checkDefined(nodeVisitor(node.name, visitor, isIdentifier))
    );
  },
  [280 /* NamespaceExport */]: function visitEachChildOfNamespaceExport(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateNamespaceExport(
      node,
      Debug.checkDefined(nodeVisitor(node.name, visitor, isIdentifier))
    );
  },
  [275 /* NamedImports */]: function visitEachChildOfNamedImports(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateNamedImports(
      node,
      nodesVisitor(node.elements, visitor, isImportSpecifier)
    );
  },
  [276 /* ImportSpecifier */]: function visitEachChildOfImportSpecifier(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateImportSpecifier(
      node,
      node.isTypeOnly,
      nodeVisitor(node.propertyName, visitor, isIdentifier),
      Debug.checkDefined(nodeVisitor(node.name, visitor, isIdentifier))
    );
  },
  [277 /* ExportAssignment */]: function visitEachChildOfExportAssignment(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateExportAssignment(
      node,
      nodesVisitor(node.modifiers, visitor, isModifierLike),
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    );
  },
  [278 /* ExportDeclaration */]: function visitEachChildOfExportDeclaration(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateExportDeclaration(
      node,
      nodesVisitor(node.modifiers, visitor, isModifierLike),
      node.isTypeOnly,
      nodeVisitor(node.exportClause, visitor, isNamedExportBindings),
      nodeVisitor(node.moduleSpecifier, visitor, isExpression),
      nodeVisitor(node.attributes, visitor, isImportAttributes)
    );
  },
  [279 /* NamedExports */]: function visitEachChildOfNamedExports(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateNamedExports(
      node,
      nodesVisitor(node.elements, visitor, isExportSpecifier)
    );
  },
  [281 /* ExportSpecifier */]: function visitEachChildOfExportSpecifier(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateExportSpecifier(
      node,
      node.isTypeOnly,
      nodeVisitor(node.propertyName, visitor, isIdentifier),
      Debug.checkDefined(nodeVisitor(node.name, visitor, isIdentifier))
    );
  },
  // Module references
  [283 /* ExternalModuleReference */]: function visitEachChildOfExternalModuleReference(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateExternalModuleReference(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    );
  },
  // JSX
  [284 /* JsxElement */]: function visitEachChildOfJsxElement(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateJsxElement(
      node,
      Debug.checkDefined(nodeVisitor(node.openingElement, visitor, isJsxOpeningElement)),
      nodesVisitor(node.children, visitor, isJsxChild),
      Debug.checkDefined(nodeVisitor(node.closingElement, visitor, isJsxClosingElement))
    );
  },
  [285 /* JsxSelfClosingElement */]: function visitEachChildOfJsxSelfClosingElement(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateJsxSelfClosingElement(
      node,
      Debug.checkDefined(nodeVisitor(node.tagName, visitor, isJsxTagNameExpression)),
      nodesVisitor(node.typeArguments, visitor, isTypeNode),
      Debug.checkDefined(nodeVisitor(node.attributes, visitor, isJsxAttributes))
    );
  },
  [286 /* JsxOpeningElement */]: function visitEachChildOfJsxOpeningElement(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateJsxOpeningElement(
      node,
      Debug.checkDefined(nodeVisitor(node.tagName, visitor, isJsxTagNameExpression)),
      nodesVisitor(node.typeArguments, visitor, isTypeNode),
      Debug.checkDefined(nodeVisitor(node.attributes, visitor, isJsxAttributes))
    );
  },
  [287 /* JsxClosingElement */]: function visitEachChildOfJsxClosingElement(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateJsxClosingElement(
      node,
      Debug.checkDefined(nodeVisitor(node.tagName, visitor, isJsxTagNameExpression))
    );
  },
  [295 /* JsxNamespacedName */]: function forEachChildInJsxNamespacedName2(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateJsxNamespacedName(
      node,
      Debug.checkDefined(nodeVisitor(node.namespace, visitor, isIdentifier)),
      Debug.checkDefined(nodeVisitor(node.name, visitor, isIdentifier))
    );
  },
  [288 /* JsxFragment */]: function visitEachChildOfJsxFragment(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateJsxFragment(
      node,
      Debug.checkDefined(nodeVisitor(node.openingFragment, visitor, isJsxOpeningFragment)),
      nodesVisitor(node.children, visitor, isJsxChild),
      Debug.checkDefined(nodeVisitor(node.closingFragment, visitor, isJsxClosingFragment))
    );
  },
  [291 /* JsxAttribute */]: function visitEachChildOfJsxAttribute(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateJsxAttribute(
      node,
      Debug.checkDefined(nodeVisitor(node.name, visitor, isJsxAttributeName)),
      nodeVisitor(node.initializer, visitor, isStringLiteralOrJsxExpression)
    );
  },
  [292 /* JsxAttributes */]: function visitEachChildOfJsxAttributes(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateJsxAttributes(
      node,
      nodesVisitor(node.properties, visitor, isJsxAttributeLike)
    );
  },
  [293 /* JsxSpreadAttribute */]: function visitEachChildOfJsxSpreadAttribute(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateJsxSpreadAttribute(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    );
  },
  [294 /* JsxExpression */]: function visitEachChildOfJsxExpression(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateJsxExpression(
      node,
      nodeVisitor(node.expression, visitor, isExpression)
    );
  },
  // Clauses
  [296 /* CaseClause */]: function visitEachChildOfCaseClause(node, visitor, context, nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateCaseClause(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression)),
      nodesVisitor(node.statements, visitor, isStatement)
    );
  },
  [297 /* DefaultClause */]: function visitEachChildOfDefaultClause(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateDefaultClause(
      node,
      nodesVisitor(node.statements, visitor, isStatement)
    );
  },
  [298 /* HeritageClause */]: function visitEachChildOfHeritageClause(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateHeritageClause(
      node,
      nodesVisitor(node.types, visitor, isExpressionWithTypeArguments)
    );
  },
  [299 /* CatchClause */]: function visitEachChildOfCatchClause(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateCatchClause(
      node,
      nodeVisitor(node.variableDeclaration, visitor, isVariableDeclaration),
      Debug.checkDefined(nodeVisitor(node.block, visitor, isBlock))
    );
  },
  // Property assignments
  [303 /* PropertyAssignment */]: function visitEachChildOfPropertyAssignment(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updatePropertyAssignment(
      node,
      Debug.checkDefined(nodeVisitor(node.name, visitor, isPropertyName)),
      Debug.checkDefined(nodeVisitor(node.initializer, visitor, isExpression))
    );
  },
  [304 /* ShorthandPropertyAssignment */]: function visitEachChildOfShorthandPropertyAssignment(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateShorthandPropertyAssignment(
      node,
      Debug.checkDefined(nodeVisitor(node.name, visitor, isIdentifier)),
      nodeVisitor(node.objectAssignmentInitializer, visitor, isExpression)
    );
  },
  [305 /* SpreadAssignment */]: function visitEachChildOfSpreadAssignment(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateSpreadAssignment(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    );
  },
  // Enum
  [306 /* EnumMember */]: function visitEachChildOfEnumMember(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updateEnumMember(
      node,
      Debug.checkDefined(nodeVisitor(node.name, visitor, isPropertyName)),
      nodeVisitor(node.initializer, visitor, isExpression)
    );
  },
  // Top-level nodes
  [312 /* SourceFile */]: function visitEachChildOfSourceFile(node, visitor, context, _nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateSourceFile(
      node,
      visitLexicalEnvironment(node.statements, visitor, context)
    );
  },
  // Transformation nodes
  [360 /* PartiallyEmittedExpression */]: function visitEachChildOfPartiallyEmittedExpression(node, visitor, context, _nodesVisitor, nodeVisitor, _tokenVisitor) {
    return context.factory.updatePartiallyEmittedExpression(
      node,
      Debug.checkDefined(nodeVisitor(node.expression, visitor, isExpression))
    );
  },
  [361 /* CommaListExpression */]: function visitEachChildOfCommaListExpression(node, visitor, context, nodesVisitor, _nodeVisitor, _tokenVisitor) {
    return context.factory.updateCommaListExpression(
      node,
      nodesVisitor(node.elements, visitor, isExpression)
    );
  }
};
function extractSingleNode(nodes) {
  Debug.assert(nodes.length <= 1, "Too many nodes written to output.");
  return singleOrUndefined(nodes);
}

// src/compiler/sourcemap.ts
function createSourceMapGenerator(host, file, sourceRoot, sourcesDirectoryPath, generatorOptions) {
  var { enter, exit } = generatorOptions.extendedDiagnostics ? createTimer("Source Map", "beforeSourcemap", "afterSourcemap") : nullTimer;
  var rawSources = [];
  var sources = [];
  var sourceToSourceIndexMap = /* @__PURE__ */ new Map();
  var sourcesContent;
  var names = [];
  var nameToNameIndexMap;
  var mappingCharCodes = [];
  var mappings = "";
  var lastGeneratedLine = 0;
  var lastGeneratedCharacter = 0;
  var lastSourceIndex = 0;
  var lastSourceLine = 0;
  var lastSourceCharacter = 0;
  var lastNameIndex = 0;
  var hasLast = false;
  var pendingGeneratedLine = 0;
  var pendingGeneratedCharacter = 0;
  var pendingSourceIndex = 0;
  var pendingSourceLine = 0;
  var pendingSourceCharacter = 0;
  var pendingNameIndex = 0;
  var hasPending = false;
  var hasPendingSource = false;
  var hasPendingName = false;
  return {
    getSources: () => rawSources,
    addSource,
    setSourceContent,
    addName,
    addMapping,
    appendSourceMap,
    toJSON,
    toString: () => JSON.stringify(toJSON())
  };
  function addSource(fileName) {
    enter();
    const source = getRelativePathToDirectoryOrUrl(
      sourcesDirectoryPath,
      fileName,
      host.getCurrentDirectory(),
      host.getCanonicalFileName,
      /*isAbsolutePathAnUrl*/
      true
    );
    let sourceIndex = sourceToSourceIndexMap.get(source);
    if (sourceIndex === void 0) {
      sourceIndex = sources.length;
      sources.push(source);
      rawSources.push(fileName);
      sourceToSourceIndexMap.set(source, sourceIndex);
    }
    exit();
    return sourceIndex;
  }
  function setSourceContent(sourceIndex, content) {
    enter();
    if (content !== null) {
      if (!sourcesContent)
        sourcesContent = [];
      while (sourcesContent.length < sourceIndex) {
        sourcesContent.push(null);
      }
      sourcesContent[sourceIndex] = content;
    }
    exit();
  }
  function addName(name) {
    enter();
    if (!nameToNameIndexMap)
      nameToNameIndexMap = /* @__PURE__ */ new Map();
    let nameIndex = nameToNameIndexMap.get(name);
    if (nameIndex === void 0) {
      nameIndex = names.length;
      names.push(name);
      nameToNameIndexMap.set(name, nameIndex);
    }
    exit();
    return nameIndex;
  }
  function isNewGeneratedPosition(generatedLine, generatedCharacter) {
    return !hasPending || pendingGeneratedLine !== generatedLine || pendingGeneratedCharacter !== generatedCharacter;
  }
  function isBacktrackingSourcePosition(sourceIndex, sourceLine, sourceCharacter) {
    return sourceIndex !== void 0 && sourceLine !== void 0 && sourceCharacter !== void 0 && pendingSourceIndex === sourceIndex && (pendingSourceLine > sourceLine || pendingSourceLine === sourceLine && pendingSourceCharacter > sourceCharacter);
  }
  function addMapping(generatedLine, generatedCharacter, sourceIndex, sourceLine, sourceCharacter, nameIndex) {
    Debug.assert(generatedLine >= pendingGeneratedLine, "generatedLine cannot backtrack");
    Debug.assert(generatedCharacter >= 0, "generatedCharacter cannot be negative");
    Debug.assert(sourceIndex === void 0 || sourceIndex >= 0, "sourceIndex cannot be negative");
    Debug.assert(sourceLine === void 0 || sourceLine >= 0, "sourceLine cannot be negative");
    Debug.assert(sourceCharacter === void 0 || sourceCharacter >= 0, "sourceCharacter cannot be negative");
    enter();
    if (isNewGeneratedPosition(generatedLine, generatedCharacter) || isBacktrackingSourcePosition(sourceIndex, sourceLine, sourceCharacter)) {
      commitPendingMapping();
      pendingGeneratedLine = generatedLine;
      pendingGeneratedCharacter = generatedCharacter;
      hasPendingSource = false;
      hasPendingName = false;
      hasPending = true;
    }
    if (sourceIndex !== void 0 && sourceLine !== void 0 && sourceCharacter !== void 0) {
      pendingSourceIndex = sourceIndex;
      pendingSourceLine = sourceLine;
      pendingSourceCharacter = sourceCharacter;
      hasPendingSource = true;
      if (nameIndex !== void 0) {
        pendingNameIndex = nameIndex;
        hasPendingName = true;
      }
    }
    exit();
  }
  function appendSourceMap(generatedLine, generatedCharacter, map2, sourceMapPath, start2, end) {
    Debug.assert(generatedLine >= pendingGeneratedLine, "generatedLine cannot backtrack");
    Debug.assert(generatedCharacter >= 0, "generatedCharacter cannot be negative");
    enter();
    const sourceIndexToNewSourceIndexMap = [];
    let nameIndexToNewNameIndexMap;
    const mappingIterator = decodeMappings(map2.mappings);
    for (const raw of mappingIterator) {
      if (end && (raw.generatedLine > end.line || raw.generatedLine === end.line && raw.generatedCharacter > end.character)) {
        break;
      }
      if (start2 && (raw.generatedLine < start2.line || start2.line === raw.generatedLine && raw.generatedCharacter < start2.character)) {
        continue;
      }
      let newSourceIndex;
      let newSourceLine;
      let newSourceCharacter;
      let newNameIndex;
      if (raw.sourceIndex !== void 0) {
        newSourceIndex = sourceIndexToNewSourceIndexMap[raw.sourceIndex];
        if (newSourceIndex === void 0) {
          const rawPath = map2.sources[raw.sourceIndex];
          const relativePath = map2.sourceRoot ? combinePaths(map2.sourceRoot, rawPath) : rawPath;
          const combinedPath = combinePaths(getDirectoryPath(sourceMapPath), relativePath);
          sourceIndexToNewSourceIndexMap[raw.sourceIndex] = newSourceIndex = addSource(combinedPath);
          if (map2.sourcesContent && typeof map2.sourcesContent[raw.sourceIndex] === "string") {
            setSourceContent(newSourceIndex, map2.sourcesContent[raw.sourceIndex]);
          }
        }
        newSourceLine = raw.sourceLine;
        newSourceCharacter = raw.sourceCharacter;
        if (map2.names && raw.nameIndex !== void 0) {
          if (!nameIndexToNewNameIndexMap)
            nameIndexToNewNameIndexMap = [];
          newNameIndex = nameIndexToNewNameIndexMap[raw.nameIndex];
          if (newNameIndex === void 0) {
            nameIndexToNewNameIndexMap[raw.nameIndex] = newNameIndex = addName(map2.names[raw.nameIndex]);
          }
        }
      }
      const rawGeneratedLine = raw.generatedLine - (start2 ? start2.line : 0);
      const newGeneratedLine = rawGeneratedLine + generatedLine;
      const rawGeneratedCharacter = start2 && start2.line === raw.generatedLine ? raw.generatedCharacter - start2.character : raw.generatedCharacter;
      const newGeneratedCharacter = rawGeneratedLine === 0 ? rawGeneratedCharacter + generatedCharacter : rawGeneratedCharacter;
      addMapping(newGeneratedLine, newGeneratedCharacter, newSourceIndex, newSourceLine, newSourceCharacter, newNameIndex);
    }
    exit();
  }
  function shouldCommitMapping() {
    return !hasLast || lastGeneratedLine !== pendingGeneratedLine || lastGeneratedCharacter !== pendingGeneratedCharacter || lastSourceIndex !== pendingSourceIndex || lastSourceLine !== pendingSourceLine || lastSourceCharacter !== pendingSourceCharacter || lastNameIndex !== pendingNameIndex;
  }
  function appendMappingCharCode(charCode) {
    mappingCharCodes.push(charCode);
    if (mappingCharCodes.length >= 1024) {
      flushMappingBuffer();
    }
  }
  function commitPendingMapping() {
    if (!hasPending || !shouldCommitMapping()) {
      return;
    }
    enter();
    if (lastGeneratedLine < pendingGeneratedLine) {
      do {
        appendMappingCharCode(59 /* semicolon */);
        lastGeneratedLine++;
      } while (lastGeneratedLine < pendingGeneratedLine);
      lastGeneratedCharacter = 0;
    } else {
      Debug.assertEqual(lastGeneratedLine, pendingGeneratedLine, "generatedLine cannot backtrack");
      if (hasLast) {
        appendMappingCharCode(44 /* comma */);
      }
    }
    appendBase64VLQ(pendingGeneratedCharacter - lastGeneratedCharacter);
    lastGeneratedCharacter = pendingGeneratedCharacter;
    if (hasPendingSource) {
      appendBase64VLQ(pendingSourceIndex - lastSourceIndex);
      lastSourceIndex = pendingSourceIndex;
      appendBase64VLQ(pendingSourceLine - lastSourceLine);
      lastSourceLine = pendingSourceLine;
      appendBase64VLQ(pendingSourceCharacter - lastSourceCharacter);
      lastSourceCharacter = pendingSourceCharacter;
      if (hasPendingName) {
        appendBase64VLQ(pendingNameIndex - lastNameIndex);
        lastNameIndex = pendingNameIndex;
      }
    }
    hasLast = true;
    exit();
  }
  function flushMappingBuffer() {
    if (mappingCharCodes.length > 0) {
      mappings += String.fromCharCode.apply(void 0, mappingCharCodes);
      mappingCharCodes.length = 0;
    }
  }
  function toJSON() {
    commitPendingMapping();
    flushMappingBuffer();
    return {
      version: 3,
      file,
      sourceRoot,
      sources,
      names,
      mappings,
      sourcesContent
    };
  }
  function appendBase64VLQ(inValue) {
    if (inValue < 0) {
      inValue = (-inValue << 1) + 1;
    } else {
      inValue = inValue << 1;
    }
    do {
      let currentDigit = inValue & 31;
      inValue = inValue >> 5;
      if (inValue > 0) {
        currentDigit = currentDigit | 32;
      }
      appendMappingCharCode(base64FormatEncode(currentDigit));
    } while (inValue > 0);
  }
}
var sourceMapCommentRegExpDontCareLineStart = /\/\/[@#] source[M]appingURL=(.+)\r?\n?$/;
var sourceMapCommentRegExp = /^\/\/[@#] source[M]appingURL=(.+)\r?\n?$/;
var whitespaceOrMapCommentRegExp = /^\s*(\/\/[@#] .*)?$/;
function getLineInfo(text, lineStarts) {
  return {
    getLineCount: () => lineStarts.length,
    getLineText: (line) => text.substring(lineStarts[line], lineStarts[line + 1])
  };
}
function tryGetSourceMappingURL(lineInfo) {
  for (let index = lineInfo.getLineCount() - 1; index >= 0; index--) {
    const line = lineInfo.getLineText(index);
    const comment = sourceMapCommentRegExp.exec(line);
    if (comment) {
      return comment[1].trimEnd();
    } else if (!line.match(whitespaceOrMapCommentRegExp)) {
      break;
    }
  }
}
function isStringOrNull(x) {
  return typeof x === "string" || x === null;
}
function isRawSourceMap(x) {
  return x !== null && typeof x === "object" && x.version === 3 && typeof x.file === "string" && typeof x.mappings === "string" && isArray(x.sources) && every(x.sources, isString) && (x.sourceRoot === void 0 || x.sourceRoot === null || typeof x.sourceRoot === "string") && (x.sourcesContent === void 0 || x.sourcesContent === null || isArray(x.sourcesContent) && every(x.sourcesContent, isStringOrNull)) && (x.names === void 0 || x.names === null || isArray(x.names) && every(x.names, isString));
}
function tryParseRawSourceMap(text) {
  try {
    const parsed = JSON.parse(text);
    if (isRawSourceMap(parsed)) {
      return parsed;
    }
  } catch {
  }
  return void 0;
}
function decodeMappings(mappings) {
  let done = false;
  let pos = 0;
  let generatedLine = 0;
  let generatedCharacter = 0;
  let sourceIndex = 0;
  let sourceLine = 0;
  let sourceCharacter = 0;
  let nameIndex = 0;
  let error2;
  return {
    get pos() {
      return pos;
    },
    get error() {
      return error2;
    },
    get state() {
      return captureMapping(
        /*hasSource*/
        true,
        /*hasName*/
        true
      );
    },
    next() {
      while (!done && pos < mappings.length) {
        const ch = mappings.charCodeAt(pos);
        if (ch === 59 /* semicolon */) {
          generatedLine++;
          generatedCharacter = 0;
          pos++;
          continue;
        }
        if (ch === 44 /* comma */) {
          pos++;
          continue;
        }
        let hasSource = false;
        let hasName = false;
        generatedCharacter += base64VLQFormatDecode();
        if (hasReportedError())
          return stopIterating();
        if (generatedCharacter < 0)
          return setErrorAndStopIterating("Invalid generatedCharacter found");
        if (!isSourceMappingSegmentEnd()) {
          hasSource = true;
          sourceIndex += base64VLQFormatDecode();
          if (hasReportedError())
            return stopIterating();
          if (sourceIndex < 0)
            return setErrorAndStopIterating("Invalid sourceIndex found");
          if (isSourceMappingSegmentEnd())
            return setErrorAndStopIterating("Unsupported Format: No entries after sourceIndex");
          sourceLine += base64VLQFormatDecode();
          if (hasReportedError())
            return stopIterating();
          if (sourceLine < 0)
            return setErrorAndStopIterating("Invalid sourceLine found");
          if (isSourceMappingSegmentEnd())
            return setErrorAndStopIterating("Unsupported Format: No entries after sourceLine");
          sourceCharacter += base64VLQFormatDecode();
          if (hasReportedError())
            return stopIterating();
          if (sourceCharacter < 0)
            return setErrorAndStopIterating("Invalid sourceCharacter found");
          if (!isSourceMappingSegmentEnd()) {
            hasName = true;
            nameIndex += base64VLQFormatDecode();
            if (hasReportedError())
              return stopIterating();
            if (nameIndex < 0)
              return setErrorAndStopIterating("Invalid nameIndex found");
            if (!isSourceMappingSegmentEnd())
              return setErrorAndStopIterating("Unsupported Error Format: Entries after nameIndex");
          }
        }
        return { value: captureMapping(hasSource, hasName), done };
      }
      return stopIterating();
    },
    [Symbol.iterator]() {
      return this;
    }
  };
  function captureMapping(hasSource, hasName) {
    return {
      generatedLine,
      generatedCharacter,
      sourceIndex: hasSource ? sourceIndex : void 0,
      sourceLine: hasSource ? sourceLine : void 0,
      sourceCharacter: hasSource ? sourceCharacter : void 0,
      nameIndex: hasName ? nameIndex : void 0
    };
  }
  function stopIterating() {
    done = true;
    return { value: void 0, done: true };
  }
  function setError(message) {
    if (error2 === void 0) {
      error2 = message;
    }
  }
  function setErrorAndStopIterating(message) {
    setError(message);
    return stopIterating();
  }
  function hasReportedError() {
    return error2 !== void 0;
  }
  function isSourceMappingSegmentEnd() {
    return pos === mappings.length || mappings.charCodeAt(pos) === 44 /* comma */ || mappings.charCodeAt(pos) === 59 /* semicolon */;
  }
  function base64VLQFormatDecode() {
    let moreDigits = true;
    let shiftCount = 0;
    let value = 0;
    for (; moreDigits; pos++) {
      if (pos >= mappings.length)
        return setError("Error in decoding base64VLQFormatDecode, past the mapping string"), -1;
      const currentByte = base64FormatDecode(mappings.charCodeAt(pos));
      if (currentByte === -1)
        return setError("Invalid character in VLQ"), -1;
      moreDigits = (currentByte & 32) !== 0;
      value = value | (currentByte & 31) << shiftCount;
      shiftCount += 5;
    }
    if ((value & 1) === 0) {
      value = value >> 1;
    } else {
      value = value >> 1;
      value = -value;
    }
    return value;
  }
}
function sameMapping(left, right) {
  return left === right || left.generatedLine === right.generatedLine && left.generatedCharacter === right.generatedCharacter && left.sourceIndex === right.sourceIndex && left.sourceLine === right.sourceLine && left.sourceCharacter === right.sourceCharacter && left.nameIndex === right.nameIndex;
}
function isSourceMapping(mapping) {
  return mapping.sourceIndex !== void 0 && mapping.sourceLine !== void 0 && mapping.sourceCharacter !== void 0;
}
function base64FormatEncode(value) {
  return value >= 0 && value < 26 ? 65 /* A */ + value : value >= 26 && value < 52 ? 97 /* a */ + value - 26 : value >= 52 && value < 62 ? 48 /* _0 */ + value - 52 : value === 62 ? 43 /* plus */ : value === 63 ? 47 /* slash */ : Debug.fail(`${value}: not a base64 value`);
}
function base64FormatDecode(ch) {
  return ch >= 65 /* A */ && ch <= 90 /* Z */ ? ch - 65 /* A */ : ch >= 97 /* a */ && ch <= 122 /* z */ ? ch - 97 /* a */ + 26 : ch >= 48 /* _0 */ && ch <= 57 /* _9 */ ? ch - 48 /* _0 */ + 52 : ch === 43 /* plus */ ? 62 : ch === 47 /* slash */ ? 63 : -1;
}
function isSourceMappedPosition(value) {
  return value.sourceIndex !== void 0 && value.sourcePosition !== void 0;
}
function sameMappedPosition(left, right) {
  return left.generatedPosition === right.generatedPosition && left.sourceIndex === right.sourceIndex && left.sourcePosition === right.sourcePosition;
}
function compareSourcePositions(left, right) {
  Debug.assert(left.sourceIndex === right.sourceIndex);
  return compareValues(left.sourcePosition, right.sourcePosition);
}
function compareGeneratedPositions(left, right) {
  return compareValues(left.generatedPosition, right.generatedPosition);
}
function getSourcePositionOfMapping(value) {
  return value.sourcePosition;
}
function getGeneratedPositionOfMapping(value) {
  return value.generatedPosition;
}
function createDocumentPositionMapper(host, map2, mapPath) {
  const mapDirectory = getDirectoryPath(mapPath);
  const sourceRoot = map2.sourceRoot ? getNormalizedAbsolutePath(map2.sourceRoot, mapDirectory) : mapDirectory;
  const generatedAbsoluteFilePath = getNormalizedAbsolutePath(map2.file, mapDirectory);
  const generatedFile = host.getSourceFileLike(generatedAbsoluteFilePath);
  const sourceFileAbsolutePaths = map2.sources.map((source) => getNormalizedAbsolutePath(source, sourceRoot));
  const sourceToSourceIndexMap = new Map(sourceFileAbsolutePaths.map((source, i) => [host.getCanonicalFileName(source), i]));
  let decodedMappings;
  let generatedMappings;
  let sourceMappings;
  return {
    getSourcePosition,
    getGeneratedPosition
  };
  function processMapping(mapping) {
    const generatedPosition = generatedFile !== void 0 ? getPositionOfLineAndCharacter(
      generatedFile,
      mapping.generatedLine,
      mapping.generatedCharacter,
      /*allowEdits*/
      true
    ) : -1;
    let source;
    let sourcePosition;
    if (isSourceMapping(mapping)) {
      const sourceFile = host.getSourceFileLike(sourceFileAbsolutePaths[mapping.sourceIndex]);
      source = map2.sources[mapping.sourceIndex];
      sourcePosition = sourceFile !== void 0 ? getPositionOfLineAndCharacter(
        sourceFile,
        mapping.sourceLine,
        mapping.sourceCharacter,
        /*allowEdits*/
        true
      ) : -1;
    }
    return {
      generatedPosition,
      source,
      sourceIndex: mapping.sourceIndex,
      sourcePosition,
      nameIndex: mapping.nameIndex
    };
  }
  function getDecodedMappings() {
    if (decodedMappings === void 0) {
      const decoder = decodeMappings(map2.mappings);
      const mappings = arrayFrom(decoder, processMapping);
      if (decoder.error !== void 0) {
        if (host.log) {
          host.log(`Encountered error while decoding sourcemap: ${decoder.error}`);
        }
        decodedMappings = emptyArray;
      } else {
        decodedMappings = mappings;
      }
    }
    return decodedMappings;
  }
  function getSourceMappings(sourceIndex) {
    if (sourceMappings === void 0) {
      const lists = [];
      for (const mapping of getDecodedMappings()) {
        if (!isSourceMappedPosition(mapping))
          continue;
        let list = lists[mapping.sourceIndex];
        if (!list)
          lists[mapping.sourceIndex] = list = [];
        list.push(mapping);
      }
      sourceMappings = lists.map((list) => sortAndDeduplicate(list, compareSourcePositions, sameMappedPosition));
    }
    return sourceMappings[sourceIndex];
  }
  function getGeneratedMappings() {
    if (generatedMappings === void 0) {
      const list = [];
      for (const mapping of getDecodedMappings()) {
        list.push(mapping);
      }
      generatedMappings = sortAndDeduplicate(list, compareGeneratedPositions, sameMappedPosition);
    }
    return generatedMappings;
  }
  function getGeneratedPosition(loc) {
    const sourceIndex = sourceToSourceIndexMap.get(host.getCanonicalFileName(loc.fileName));
    if (sourceIndex === void 0)
      return loc;
    const sourceMappings2 = getSourceMappings(sourceIndex);
    if (!some(sourceMappings2))
      return loc;
    let targetIndex = binarySearchKey(sourceMappings2, loc.pos, getSourcePositionOfMapping, compareValues);
    if (targetIndex < 0) {
      targetIndex = ~targetIndex;
    }
    const mapping = sourceMappings2[targetIndex];
    if (mapping === void 0 || mapping.sourceIndex !== sourceIndex) {
      return loc;
    }
    return { fileName: generatedAbsoluteFilePath, pos: mapping.generatedPosition };
  }
  function getSourcePosition(loc) {
    const generatedMappings2 = getGeneratedMappings();
    if (!some(generatedMappings2))
      return loc;
    let targetIndex = binarySearchKey(generatedMappings2, loc.pos, getGeneratedPositionOfMapping, compareValues);
    if (targetIndex < 0) {
      targetIndex = ~targetIndex;
    }
    const mapping = generatedMappings2[targetIndex];
    if (mapping === void 0 || !isSourceMappedPosition(mapping)) {
      return loc;
    }
    return { fileName: sourceFileAbsolutePaths[mapping.sourceIndex], pos: mapping.sourcePosition };
  }
}
var identitySourceMapConsumer = {
  getSourcePosition: identity,
  getGeneratedPosition: identity
};

// src/compiler/transformers/utilities.ts
function getOriginalNodeId(node) {
  node = getOriginalNode(node);
  return node ? getNodeId(node) : 0;
}
function containsDefaultReference(node) {
  if (!node)
    return false;
  if (!isNamedImports(node))
    return false;
  return some(node.elements, isNamedDefaultReference);
}
function isNamedDefaultReference(e) {
  return e.propertyName !== void 0 && e.propertyName.escapedText === "default" /* Default */;
}
function chainBundle(context, transformSourceFile) {
  return transformSourceFileOrBundle;
  function transformSourceFileOrBundle(node) {
    return node.kind === 312 /* SourceFile */ ? transformSourceFile(node) : transformBundle(node);
  }
  function transformBundle(node) {
    return context.factory.createBundle(map(node.sourceFiles, transformSourceFile), node.prepends);
  }
}
function getExportNeedsImportStarHelper(node) {
  return !!getNamespaceDeclarationNode(node);
}
function getImportNeedsImportStarHelper(node) {
  if (!!getNamespaceDeclarationNode(node)) {
    return true;
  }
  const bindings = node.importClause && node.importClause.namedBindings;
  if (!bindings) {
    return false;
  }
  if (!isNamedImports(bindings))
    return false;
  let defaultRefCount = 0;
  for (const binding of bindings.elements) {
    if (isNamedDefaultReference(binding)) {
      defaultRefCount++;
    }
  }
  return defaultRefCount > 0 && defaultRefCount !== bindings.elements.length || !!(bindings.elements.length - defaultRefCount) && isDefaultImport(node);
}
function getImportNeedsImportDefaultHelper(node) {
  return !getImportNeedsImportStarHelper(node) && (isDefaultImport(node) || !!node.importClause && isNamedImports(node.importClause.namedBindings) && containsDefaultReference(node.importClause.namedBindings));
}
function collectExternalModuleInfo(context, sourceFile) {
  const resolver = context.getEmitResolver();
  const compilerOptions = context.getCompilerOptions();
  const externalImports = [];
  const exportSpecifiers = new IdentifierNameMultiMap();
  const exportedBindings = [];
  const uniqueExports = /* @__PURE__ */ new Map();
  let exportedNames;
  let hasExportDefault = false;
  let exportEquals;
  let hasExportStarsToExportValues = false;
  let hasImportStar = false;
  let hasImportDefault = false;
  for (const node of sourceFile.statements) {
    switch (node.kind) {
      case 272 /* ImportDeclaration */:
        externalImports.push(node);
        if (!hasImportStar && getImportNeedsImportStarHelper(node)) {
          hasImportStar = true;
        }
        if (!hasImportDefault && getImportNeedsImportDefaultHelper(node)) {
          hasImportDefault = true;
        }
        break;
      case 271 /* ImportEqualsDeclaration */:
        if (node.moduleReference.kind === 283 /* ExternalModuleReference */) {
          externalImports.push(node);
        }
        break;
      case 278 /* ExportDeclaration */:
        if (node.moduleSpecifier) {
          if (!node.exportClause) {
            externalImports.push(node);
            hasExportStarsToExportValues = true;
          } else {
            externalImports.push(node);
            if (isNamedExports(node.exportClause)) {
              addExportedNamesForExportDeclaration(node);
            } else {
              const name = node.exportClause.name;
              if (!uniqueExports.get(idText(name))) {
                multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(node), name);
                uniqueExports.set(idText(name), true);
                exportedNames = append(exportedNames, name);
              }
              hasImportStar = true;
            }
          }
        } else {
          addExportedNamesForExportDeclaration(node);
        }
        break;
      case 277 /* ExportAssignment */:
        if (node.isExportEquals && !exportEquals) {
          exportEquals = node;
        }
        break;
      case 243 /* VariableStatement */:
        if (hasSyntacticModifier(node, 32 /* Export */)) {
          for (const decl of node.declarationList.declarations) {
            exportedNames = collectExportedVariableInfo(decl, uniqueExports, exportedNames, exportedBindings);
          }
        }
        break;
      case 262 /* FunctionDeclaration */:
        if (hasSyntacticModifier(node, 32 /* Export */)) {
          if (hasSyntacticModifier(node, 2048 /* Default */)) {
            if (!hasExportDefault) {
              multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(node), context.factory.getDeclarationName(node));
              hasExportDefault = true;
            }
          } else {
            const name = node.name;
            if (!uniqueExports.get(idText(name))) {
              multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(node), name);
              uniqueExports.set(idText(name), true);
              exportedNames = append(exportedNames, name);
            }
          }
        }
        break;
      case 263 /* ClassDeclaration */:
        if (hasSyntacticModifier(node, 32 /* Export */)) {
          if (hasSyntacticModifier(node, 2048 /* Default */)) {
            if (!hasExportDefault) {
              multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(node), context.factory.getDeclarationName(node));
              hasExportDefault = true;
            }
          } else {
            const name = node.name;
            if (name && !uniqueExports.get(idText(name))) {
              multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(node), name);
              uniqueExports.set(idText(name), true);
              exportedNames = append(exportedNames, name);
            }
          }
        }
        break;
    }
  }
  const externalHelpersImportDeclaration = createExternalHelpersImportDeclarationIfNeeded(context.factory, context.getEmitHelperFactory(), sourceFile, compilerOptions, hasExportStarsToExportValues, hasImportStar, hasImportDefault);
  if (externalHelpersImportDeclaration) {
    externalImports.unshift(externalHelpersImportDeclaration);
  }
  return { externalImports, exportSpecifiers, exportEquals, hasExportStarsToExportValues, exportedBindings, exportedNames, externalHelpersImportDeclaration };
  function addExportedNamesForExportDeclaration(node) {
    for (const specifier of cast(node.exportClause, isNamedExports).elements) {
      if (!uniqueExports.get(idText(specifier.name))) {
        const name = specifier.propertyName || specifier.name;
        if (!node.moduleSpecifier) {
          exportSpecifiers.add(name, specifier);
        }
        const decl = resolver.getReferencedImportDeclaration(name) || resolver.getReferencedValueDeclaration(name);
        if (decl) {
          multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(decl), specifier.name);
        }
        uniqueExports.set(idText(specifier.name), true);
        exportedNames = append(exportedNames, specifier.name);
      }
    }
  }
}
function collectExportedVariableInfo(decl, uniqueExports, exportedNames, exportedBindings) {
  if (isBindingPattern(decl.name)) {
    for (const element of decl.name.elements) {
      if (!isOmittedExpression(element)) {
        exportedNames = collectExportedVariableInfo(element, uniqueExports, exportedNames, exportedBindings);
      }
    }
  } else if (!isGeneratedIdentifier(decl.name)) {
    const text = idText(decl.name);
    if (!uniqueExports.get(text)) {
      uniqueExports.set(text, true);
      exportedNames = append(exportedNames, decl.name);
      if (isLocalName(decl.name)) {
        multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(decl), decl.name);
      }
    }
  }
  return exportedNames;
}
function multiMapSparseArrayAdd(map2, key, value) {
  let values = map2[key];
  if (values) {
    values.push(value);
  } else {
    map2[key] = values = [value];
  }
  return values;
}
var IdentifierNameMap = class _IdentifierNameMap {
  constructor() {
    this._map = /* @__PURE__ */ new Map();
  }
  get size() {
    return this._map.size;
  }
  has(key) {
    return this._map.has(_IdentifierNameMap.toKey(key));
  }
  get(key) {
    return this._map.get(_IdentifierNameMap.toKey(key));
  }
  set(key, value) {
    this._map.set(_IdentifierNameMap.toKey(key), value);
    return this;
  }
  delete(key) {
    var _a;
    return ((_a = this._map) == null ? void 0 : _a.delete(_IdentifierNameMap.toKey(key))) ?? false;
  }
  clear() {
    this._map.clear();
  }
  values() {
    return this._map.values();
  }
  static toKey(name) {
    if (isGeneratedPrivateIdentifier(name) || isGeneratedIdentifier(name)) {
      const autoGenerate = name.emitNode.autoGenerate;
      if ((autoGenerate.flags & 7 /* KindMask */) === 4 /* Node */) {
        const node = getNodeForGeneratedName(name);
        const baseName = isMemberName(node) && node !== name ? _IdentifierNameMap.toKey(node) : `(generated@${getNodeId(node)})`;
        return formatGeneratedName(
          /*privateName*/
          false,
          autoGenerate.prefix,
          baseName,
          autoGenerate.suffix,
          _IdentifierNameMap.toKey
        );
      } else {
        const baseName = `(auto@${autoGenerate.id})`;
        return formatGeneratedName(
          /*privateName*/
          false,
          autoGenerate.prefix,
          baseName,
          autoGenerate.suffix,
          _IdentifierNameMap.toKey
        );
      }
    }
    if (isPrivateIdentifier(name)) {
      return idText(name).slice(1);
    }
    return idText(name);
  }
};
var IdentifierNameMultiMap = class extends IdentifierNameMap {
  add(key, value) {
    let values = this.get(key);
    if (values) {
      values.push(value);
    } else {
      this.set(key, values = [value]);
    }
    return values;
  }
  remove(key, value) {
    const values = this.get(key);
    if (values) {
      unorderedRemoveItem(values, value);
      if (!values.length) {
        this.delete(key);
      }
    }
  }
};
function isSimpleCopiableExpression(expression) {
  return isStringLiteralLike(expression) || expression.kind === 9 /* NumericLiteral */ || isKeyword(expression.kind) || isIdentifier(expression);
}
function isSimpleInlineableExpression(expression) {
  return !isIdentifier(expression) && isSimpleCopiableExpression(expression);
}
function isCompoundAssignment(kind) {
  return kind >= 65 /* FirstCompoundAssignment */ && ki
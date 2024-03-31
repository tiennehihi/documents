     case 196 /* ParenthesizedType */:
      case 197 /* ThisType */:
      case 198 /* TypeOperator */:
      case 199 /* IndexedAccessType */:
      case 200 /* MappedType */:
      case 201 /* LiteralType */:
      case 181 /* IndexSignature */:
        return void 0;
      case 265 /* TypeAliasDeclaration */:
        return factory2.createNotEmittedStatement(node);
      case 270 /* NamespaceExportDeclaration */:
        return void 0;
      case 264 /* InterfaceDeclaration */:
        return factory2.createNotEmittedStatement(node);
      case 263 /* ClassDeclaration */:
        return visitClassDeclaration(node);
      case 231 /* ClassExpression */:
        return visitClassExpression(node);
      case 298 /* HeritageClause */:
        return visitHeritageClause(node);
      case 233 /* ExpressionWithTypeArguments */:
        return visitExpressionWithTypeArguments(node);
      case 210 /* ObjectLiteralExpression */:
        return visitObjectLiteralExpression(node);
      case 176 /* Constructor */:
      case 172 /* PropertyDeclaration */:
      case 174 /* MethodDeclaration */:
      case 177 /* GetAccessor */:
      case 178 /* SetAccessor */:
      case 175 /* ClassStaticBlockDeclaration */:
        return Debug.fail("Class and object literal elements must be visited with their respective visitors");
      case 262 /* FunctionDeclaration */:
        return visitFunctionDeclaration(node);
      case 218 /* FunctionExpression */:
        return visitFunctionExpression(node);
      case 219 /* ArrowFunction */:
        return visitArrowFunction(node);
      case 169 /* Parameter */:
        return visitParameter(node);
      case 217 /* ParenthesizedExpression */:
        return visitParenthesizedExpression(node);
      case 216 /* TypeAssertionExpression */:
      case 234 /* AsExpression */:
        return visitAssertionExpression(node);
      case 238 /* SatisfiesExpression */:
        return visitSatisfiesExpression(node);
      case 213 /* CallExpression */:
        return visitCallExpression(node);
      case 214 /* NewExpression */:
        return visitNewExpression(node);
      case 215 /* TaggedTemplateExpression */:
        return visitTaggedTemplateExpression(node);
      case 235 /* NonNullExpression */:
        return visitNonNullExpression(node);
      case 266 /* EnumDeclaration */:
        return visitEnumDeclaration(node);
      case 243 /* VariableStatement */:
        return visitVariableStatement(node);
      case 260 /* VariableDeclaration */:
        return visitVariableDeclaration(node);
      case 267 /* ModuleDeclaration */:
        return visitModuleDeclaration(node);
      case 271 /* ImportEqualsDeclaration */:
        return visitImportEqualsDeclaration(node);
      case 285 /* JsxSelfClosingElement */:
        return visitJsxSelfClosingElement(node);
      case 286 /* JsxOpeningElement */:
        return visitJsxJsxOpeningElement(node);
      default:
        return visitEachChild(node, visitor, context);
    }
  }
  function visitSourceFile(node) {
    const alwaysStrict = getStrictOptionValue(compilerOptions, "alwaysStrict") && !(isExternalModule(node) && moduleKind >= 5 /* ES2015 */) && !isJsonSourceFile(node);
    return factory2.updateSourceFile(
      node,
      visitLexicalEnvironment(
        node.statements,
        sourceElementVisitor,
        context,
        /*start*/
        0,
        alwaysStrict
      )
    );
  }
  function visitObjectLiteralExpression(node) {
    return factory2.updateObjectLiteralExpression(
      node,
      visitNodes2(node.properties, getObjectLiteralElementVisitor(node), isObjectLiteralElementLike)
    );
  }
  function getClassFacts(node) {
    let facts = 0 /* None */;
    if (some(getProperties(
      node,
      /*requireInitializer*/
      true,
      /*isStatic*/
      true
    )))
      facts |= 1 /* HasStaticInitializedProperties */;
    const extendsClauseElement = getEffectiveBaseTypeNode(node);
    if (extendsClauseElement && skipOuterExpressions(extendsClauseElement.expression).kind !== 106 /* NullKeyword */)
      facts |= 64 /* IsDerivedClass */;
    if (classOrConstructorParameterIsDecorated(legacyDecorators, node))
      facts |= 2 /* HasClassOrConstructorParameterDecorators */;
    if (childIsDecorated(legacyDecorators, node))
      facts |= 4 /* HasMemberDecorators */;
    if (isExportOfNamespace(node))
      facts |= 8 /* IsExportOfNamespace */;
    else if (isDefaultExternalModuleExport(node))
      facts |= 32 /* IsDefaultExternalExport */;
    else if (isNamedExternalModuleExport(node))
      facts |= 16 /* IsNamedExternalExport */;
    return facts;
  }
  function hasTypeScriptClassSyntax(node) {
    return !!(node.transformFlags & 8192 /* ContainsTypeScriptClassSyntax */);
  }
  function isClassLikeDeclarationWithTypeScriptSyntax(node) {
    return hasDecorators(node) || some(node.typeParameters) || some(node.heritageClauses, hasTypeScriptClassSyntax) || some(node.members, hasTypeScriptClassSyntax);
  }
  function visitClassDeclaration(node) {
    const facts = getClassFacts(node);
    const promoteToIIFE = languageVersion <= 1 /* ES5 */ && !!(facts & 7 /* MayNeedImmediatelyInvokedFunctionExpression */);
    if (!isClassLikeDeclarationWithTypeScriptSyntax(node) && !classOrConstructorParameterIsDecorated(legacyDecorators, node) && !isExportOfNamespace(node)) {
      return factory2.updateClassDeclaration(
        node,
        visitNodes2(node.modifiers, modifierVisitor, isModifier),
        node.name,
        /*typeParameters*/
        void 0,
        visitNodes2(node.heritageClauses, visitor, isHeritageClause),
        visitNodes2(node.members, getClassElementVisitor(node), isClassElement)
      );
    }
    if (promoteToIIFE) {
      context.startLexicalEnvironment();
    }
    const moveModifiers = promoteToIIFE || facts & 8 /* IsExportOfNamespace */;
    let modifiers = moveModifiers ? visitNodes2(node.modifiers, modifierElidingVisitor, isModifierLike) : visitNodes2(node.modifiers, visitor, isModifierLike);
    if (facts & 2 /* HasClassOrConstructorParameterDecorators */) {
      modifiers = injectClassTypeMetadata(modifiers, node);
    }
    const needsName = moveModifiers && !node.name || facts & 4 /* HasMemberDecorators */ || facts & 1 /* HasStaticInitializedProperties */;
    const name = needsName ? node.name ?? factory2.getGeneratedNameForNode(node) : node.name;
    const classDeclaration = factory2.updateClassDeclaration(
      node,
      modifiers,
      name,
      /*typeParameters*/
      void 0,
      visitNodes2(node.heritageClauses, visitor, isHeritageClause),
      transformClassMembers(node)
    );
    let emitFlags = getEmitFlags(node);
    if (facts & 1 /* HasStaticInitializedProperties */) {
      emitFlags |= 64 /* NoTrailingSourceMap */;
    }
    setEmitFlags(classDeclaration, emitFlags);
    let statement;
    if (promoteToIIFE) {
      const statements = [classDeclaration];
      const closingBraceLocation = createTokenRange(skipTrivia(currentSourceFile.text, node.members.end), 20 /* CloseBraceToken */);
      const localName = factory2.getInternalName(node);
      const outer = factory2.createPartiallyEmittedExpression(localName);
      setTextRangeEnd(outer, closingBraceLocation.end);
      setEmitFlags(outer, 3072 /* NoComments */);
      const returnStatement = factory2.createReturnStatement(outer);
      setTextRangePos(returnStatement, closingBraceLocation.pos);
      setEmitFlags(returnStatement, 3072 /* NoComments */ | 768 /* NoTokenSourceMaps */);
      statements.push(returnStatement);
      insertStatementsAfterStandardPrologue(statements, context.endLexicalEnvironment());
      const iife = factory2.createImmediatelyInvokedArrowFunction(statements);
      setInternalEmitFlags(iife, 1 /* TypeScriptClassWrapper */);
      const varDecl = factory2.createVariableDeclaration(
        factory2.getLocalName(
          node,
          /*allowComments*/
          false,
          /*allowSourceMaps*/
          false
        ),
        /*exclamationToken*/
        void 0,
        /*type*/
        void 0,
        iife
      );
      setOriginalNode(varDecl, node);
      const varStatement = factory2.createVariableStatement(
        /*modifiers*/
        void 0,
        factory2.createVariableDeclarationList([varDecl], 1 /* Let */)
      );
      setOriginalNode(varStatement, node);
      setCommentRange(varStatement, node);
      setSourceMapRange(varStatement, moveRangePastDecorators(node));
      startOnNewLine(varStatement);
      statement = varStatement;
    } else {
      statement = classDeclaration;
    }
    if (moveModifiers) {
      if (facts & 8 /* IsExportOfNamespace */) {
        return [
          statement,
          createExportMemberAssignmentStatement(node)
        ];
      }
      if (facts & 32 /* IsDefaultExternalExport */) {
        return [
          statement,
          factory2.createExportDefault(factory2.getLocalName(
            node,
            /*allowComments*/
            false,
            /*allowSourceMaps*/
            true
          ))
        ];
      }
      if (facts & 16 /* IsNamedExternalExport */) {
        return [
          statement,
          factory2.createExternalModuleExport(factory2.getDeclarationName(
            node,
            /*allowComments*/
            false,
            /*allowSourceMaps*/
            true
          ))
        ];
      }
    }
    return statement;
  }
  function visitClassExpression(node) {
    let modifiers = visitNodes2(node.modifiers, modifierElidingVisitor, isModifierLike);
    if (classOrConstructorParameterIsDecorated(legacyDecorators, node)) {
      modifiers = injectClassTypeMetadata(modifiers, node);
    }
    return factory2.updateClassExpression(
      node,
      modifiers,
      node.name,
      /*typeParameters*/
      void 0,
      visitNodes2(node.heritageClauses, visitor, isHeritageClause),
      transformClassMembers(node)
    );
  }
  function transformClassMembers(node) {
    const members = visitNodes2(node.members, getClassElementVisitor(node), isClassElement);
    let newMembers;
    const constructor = getFirstConstructorWithBody(node);
    const parametersWithPropertyAssignments = constructor && filter(constructor.parameters, (p) => isParameterPropertyDeclaration(p, constructor));
    if (parametersWithPropertyAssignments) {
      for (const parameter of parametersWithPropertyAssignments) {
        const parameterProperty = factory2.createPropertyDeclaration(
          /*modifiers*/
          void 0,
          parameter.name,
          /*questionOrExclamationToken*/
          void 0,
          /*type*/
          void 0,
          /*initializer*/
          void 0
        );
        setOriginalNode(parameterProperty, parameter);
        newMembers = append(newMembers, parameterProperty);
      }
    }
    if (newMembers) {
      newMembers = addRange(newMembers, members);
      return setTextRange(
        factory2.createNodeArray(newMembers),
        /*location*/
        node.members
      );
    }
    return members;
  }
  function injectClassTypeMetadata(modifiers, node) {
    const metadata = getTypeMetadata(node, node);
    if (some(metadata)) {
      const modifiersArray = [];
      addRange(modifiersArray, takeWhile(modifiers, isExportOrDefaultModifier));
      addRange(modifiersArray, filter(modifiers, isDecorator));
      addRange(modifiersArray, metadata);
      addRange(modifiersArray, filter(skipWhile(modifiers, isExportOrDefaultModifier), isModifier));
      modifiers = setTextRange(factory2.createNodeArray(modifiersArray), modifiers);
    }
    return modifiers;
  }
  function injectClassElementTypeMetadata(modifiers, node, container) {
    if (isClassLike(container) && classElementOrClassElementParameterIsDecorated(legacyDecorators, node, container)) {
      const metadata = getTypeMetadata(node, container);
      if (some(metadata)) {
        const modifiersArray = [];
        addRange(modifiersArray, filter(modifiers, isDecorator));
        addRange(modifiersArray, metadata);
        addRange(modifiersArray, filter(modifiers, isModifier));
        modifiers = setTextRange(factory2.createNodeArray(modifiersArray), modifiers);
      }
    }
    return modifiers;
  }
  function getTypeMetadata(node, container) {
    if (!legacyDecorators)
      return void 0;
    return USE_NEW_TYPE_METADATA_FORMAT ? getNewTypeMetadata(node, container) : getOldTypeMetadata(node, container);
  }
  function getOldTypeMetadata(node, container) {
    if (typeSerializer) {
      let decorators;
      if (shouldAddTypeMetadata(node)) {
        const typeMetadata = emitHelpers().createMetadataHelper("design:type", typeSerializer.serializeTypeOfNode({ currentLexicalScope, currentNameScope: container }, node));
        decorators = append(decorators, factory2.createDecorator(typeMetadata));
      }
      if (shouldAddParamTypesMetadata(node)) {
        const paramTypesMetadata = emitHelpers().createMetadataHelper("design:paramtypes", typeSerializer.serializeParameterTypesOfNode({ currentLexicalScope, currentNameScope: container }, node, container));
        decorators = append(decorators, factory2.createDecorator(paramTypesMetadata));
      }
      if (shouldAddReturnTypeMetadata(node)) {
        const returnTypeMetadata = emitHelpers().createMetadataHelper("design:returntype", typeSerializer.serializeReturnTypeOfNode({ currentLexicalScope, currentNameScope: container }, node));
        decorators = append(decorators, factory2.createDecorator(returnTypeMetadata));
      }
      return decorators;
    }
  }
  function getNewTypeMetadata(node, container) {
    if (typeSerializer) {
      let properties;
      if (shouldAddTypeMetadata(node)) {
        const typeProperty = factory2.createPropertyAssignment("type", factory2.createArrowFunction(
          /*modifiers*/
          void 0,
          /*typeParameters*/
          void 0,
          [],
          /*type*/
          void 0,
          factory2.createToken(39 /* EqualsGreaterThanToken */),
          typeSerializer.serializeTypeOfNode({ currentLexicalScope, currentNameScope: container }, node)
        ));
        properties = append(properties, typeProperty);
      }
      if (shouldAddParamTypesMetadata(node)) {
        const paramTypeProperty = factory2.createPropertyAssignment("paramTypes", factory2.createArrowFunction(
          /*modifiers*/
          void 0,
          /*typeParameters*/
          void 0,
          [],
          /*type*/
          void 0,
          factory2.createToken(39 /* EqualsGreaterThanToken */),
          typeSerializer.serializeParameterTypesOfNode({ currentLexicalScope, currentNameScope: container }, node, container)
        ));
        properties = append(properties, paramTypeProperty);
      }
      if (shouldAddReturnTypeMetadata(node)) {
        const returnTypeProperty = factory2.createPropertyAssignment("returnType", factory2.createArrowFunction(
          /*modifiers*/
          void 0,
          /*typeParameters*/
          void 0,
          [],
          /*type*/
          void 0,
          factory2.createToken(39 /* EqualsGreaterThanToken */),
          typeSerializer.serializeReturnTypeOfNode({ currentLexicalScope, currentNameScope: container }, node)
        ));
        properties = append(properties, returnTypeProperty);
      }
      if (properties) {
        const typeInfoMetadata = emitHelpers().createMetadataHelper("design:typeinfo", factory2.createObjectLiteralExpression(
          properties,
          /*multiLine*/
          true
        ));
        return [factory2.createDecorator(typeInfoMetadata)];
      }
    }
  }
  function shouldAddTypeMetadata(node) {
    const kind = node.kind;
    return kind === 174 /* MethodDeclaration */ || kind === 177 /* GetAccessor */ || kind === 178 /* SetAccessor */ || kind === 172 /* PropertyDeclaration */;
  }
  function shouldAddReturnTypeMetadata(node) {
    return node.kind === 174 /* MethodDeclaration */;
  }
  function shouldAddParamTypesMetadata(node) {
    switch (node.kind) {
      case 263 /* ClassDeclaration */:
      case 231 /* ClassExpression */:
        return getFirstConstructorWithBody(node) !== void 0;
      case 174 /* MethodDeclaration */:
      case 177 /* GetAccessor */:
      case 178 /* SetAccessor */:
        return true;
    }
    return false;
  }
  function getExpressionForPropertyName(member, generateNameForComputedPropertyName) {
    const name = member.name;
    if (isPrivateIdentifier(name)) {
      return factory2.createIdentifier("");
    } else if (isComputedPropertyName(name)) {
      return generateNameForComputedPropertyName && !isSimpleInlineableExpression(name.expression) ? factory2.getGeneratedNameForNode(name) : name.expression;
    } else if (isIdentifier(name)) {
      return factory2.createStringLiteral(idText(name));
    } else {
      return factory2.cloneNode(name);
    }
  }
  function visitPropertyNameOfClassElement(member) {
    const name = member.name;
    if (isComputedPropertyName(name) && (!hasStaticModifier(member) && currentClassHasParameterProperties || hasDecorators(member) && legacyDecorators)) {
      const expression = visitNode(name.expression, visitor, isExpression);
      Debug.assert(expression);
      const innerExpression = skipPartiallyEmittedExpressions(expression);
      if (!isSimpleInlineableExpression(innerExpression)) {
        const generatedName = factory2.getGeneratedNameForNode(name);
        hoistVariableDeclaration(generatedName);
        return factory2.updateComputedPropertyName(name, factory2.createAssignment(generatedName, expression));
      }
    }
    return Debug.checkDefined(visitNode(name, visitor, isPropertyName));
  }
  function visitHeritageClause(node) {
    if (node.token === 119 /* ImplementsKeyword */) {
      return void 0;
    }
    return visitEachChild(node, visitor, context);
  }
  function visitExpressionWithTypeArguments(node) {
    return factory2.updateExpressionWithTypeArguments(
      node,
      Debug.checkDefined(visitNode(node.expression, visitor, isLeftHandSideExpression)),
      /*typeArguments*/
      void 0
    );
  }
  function shouldEmitFunctionLikeDeclaration(node) {
    return !nodeIsMissing(node.body);
  }
  function visitPropertyDeclaration(node, parent2) {
    const isAmbient = node.flags & 33554432 /* Ambient */ || hasSyntacticModifier(node, 64 /* Abstract */);
    if (isAmbient && !(legacyDecorators && hasDecorators(node))) {
      return void 0;
    }
    let modifiers = isClassLike(parent2) ? !isAmbient ? visitNodes2(node.modifiers, visitor, isModifierLike) : visitNodes2(node.modifiers, modifierElidingVisitor, isModifierLike) : visitNodes2(node.modifiers, decoratorElidingVisitor, isModifierLike);
    modifiers = injectClassElementTypeMetadata(modifiers, node, parent2);
    if (isAmbient) {
      return factory2.updatePropertyDeclaration(
        node,
        concatenate(modifiers, factory2.createModifiersFromModifierFlags(128 /* Ambient */)),
        Debug.checkDefined(visitNode(node.name, visitor, isPropertyName)),
        /*questionOrExclamationToken*/
        void 0,
        /*type*/
        void 0,
        /*initializer*/
        void 0
      );
    }
    return factory2.updatePropertyDeclaration(
      node,
      modifiers,
      visitPropertyNameOfClassElement(node),
      /*questionOrExclamationToken*/
      void 0,
      /*type*/
      void 0,
      visitNode(node.initializer, visitor, isExpression)
    );
  }
  function visitConstructor(node) {
    if (!shouldEmitFunctionLikeDeclaration(node)) {
      return void 0;
    }
    return factory2.updateConstructorDeclaration(
      node,
      /*modifiers*/
      void 0,
      visitParameterList(node.parameters, visitor, context),
      transformConstructorBody(node.body, node)
    );
  }
  function transformConstructorBodyWorker(statementsOut, statementsIn, statementOffset, superPath, superPathDepth, initializerStatements) {
    const superStatementIndex = superPath[superPathDepth];
    const superStatement = statementsIn[superStatementIndex];
    addRange(statementsOut, visitNodes2(statementsIn, visitor, isStatement, statementOffset, superStatementIndex - statementOffset));
    if (isTryStatement(superStatement)) {
      const tryBlockStatements = [];
      transformConstructorBodyWorker(
        tryBlockStatements,
        superStatement.tryBlock.statements,
        /*statementOffset*/
        0,
        superPath,
        superPathDepth + 1,
        initializerStatements
      );
      const tryBlockStatementsArray = factory2.createNodeArray(tryBlockStatements);
      setTextRange(tryBlockStatementsArray, superStatement.tryBlock.statements);
      statementsOut.push(factory2.updateTryStatement(
        superStatement,
        factory2.updateBlock(superStatement.tryBlock, tryBlockStatements),
        visitNode(superStatement.catchClause, visitor, isCatchClause),
        visitNode(superStatement.finallyBlock, visitor, isBlock)
      ));
    } else {
      addRange(statementsOut, visitNodes2(statementsIn, visitor, isStatement, superStatementIndex, 1));
      addRange(statementsOut, initializerStatements);
    }
    addRange(statementsOut, visitNodes2(statementsIn, visitor, isStatement, superStatementIndex + 1));
  }
  function transformConstructorBody(body, constructor) {
    const parametersWithPropertyAssignments = constructor && filter(constructor.parameters, (p) => isParameterPropertyDeclaration(p, constructor));
    if (!some(parametersWithPropertyAssignments)) {
      return visitFunctionBody(body, visitor, context);
    }
    let statements = [];
    resumeLexicalEnvironment();
    const prologueStatementCount = factory2.copyPrologue(
      body.statements,
      statements,
      /*ensureUseStrict*/
      false,
      visitor
    );
    const superPath = findSuperStatementIndexPath(body.statements, prologueStatementCount);
    const parameterPropertyAssignments = mapDefined(parametersWithPropertyAssignments, transformParameterWithPropertyAssignment);
    if (superPath.length) {
      transformConstructorBodyWorker(
        statements,
        body.statements,
        prologueStatementCount,
        superPath,
        /*superPathDepth*/
        0,
        parameterPropertyAssignments
      );
    } else {
      addRange(statements, parameterPropertyAssignments);
      addRange(statements, visitNodes2(body.statements, visitor, isStatement, prologueStatementCount));
    }
    statements = factory2.mergeLexicalEnvironment(statements, endLexicalEnvironment());
    const block = factory2.createBlock(
      setTextRange(factory2.createNodeArray(statements), body.statements),
      /*multiLine*/
      true
    );
    setTextRange(
      block,
      /*location*/
      body
    );
    setOriginalNode(block, body);
    return block;
  }
  function transformParameterWithPropertyAssignment(node) {
    const name = node.name;
    if (!isIdentifier(name)) {
      return void 0;
    }
    const propertyName = setParent(setTextRange(factory2.cloneNode(name), name), name.parent);
    setEmitFlags(propertyName, 3072 /* NoComments */ | 96 /* NoSourceMap */);
    const localName = setParent(setTextRange(factory2.cloneNode(name), name), name.parent);
    setEmitFlags(localName, 3072 /* NoComments */);
    return startOnNewLine(
      removeAllComments(
        setTextRange(
          setOriginalNode(
            factory2.createExpressionStatement(
              factory2.createAssignment(
                setTextRange(
                  factory2.createPropertyAccessExpression(
                    factory2.createThis(),
                    propertyName
                  ),
                  node.name
                ),
                localName
              )
            ),
            node
          ),
          moveRangePos(node, -1)
        )
      )
    );
  }
  function visitMethodDeclaration(node, parent2) {
    if (!(node.transformFlags & 1 /* ContainsTypeScript */)) {
      return node;
    }
    if (!shouldEmitFunctionLikeDeclaration(node)) {
      return void 0;
    }
    let modifiers = isClassLike(parent2) ? visitNodes2(node.modifiers, visitor, isModifierLike) : visitNodes2(node.modifiers, decoratorElidingVisitor, isModifierLike);
    modifiers = injectClassElementTypeMetadata(modifiers, node, parent2);
    return factory2.updateMethodDeclaration(
      node,
      modifiers,
      node.asteriskToken,
      visitPropertyNameOfClassElement(node),
      /*questionToken*/
      void 0,
      /*typeParameters*/
      void 0,
      visitParameterList(node.parameters, visitor, context),
      /*type*/
      void 0,
      visitFunctionBody(node.body, visitor, context)
    );
  }
  function shouldEmitAccessorDeclaration(node) {
    return !(nodeIsMissing(node.body) && hasSyntacticModifier(node, 64 /* Abstract */));
  }
  function visitGetAccessor(node, parent2) {
    if (!(node.transformFlags & 1 /* ContainsTypeScript */)) {
      return node;
    }
    if (!shouldEmitAccessorDeclaration(node)) {
      return void 0;
    }
    let modifiers = isClassLike(parent2) ? visitNodes2(node.modifiers, visitor, isModifierLike) : visitNodes2(node.modifiers, decoratorElidingVisitor, isModifierLike);
    modifiers = injectClassElementTypeMetadata(modifiers, node, parent2);
    return factory2.updateGetAccessorDeclaration(
      node,
      modifiers,
      visitPropertyNameOfClassElement(node),
      visitParameterList(node.parameters, visitor, context),
      /*type*/
      void 0,
      visitFunctionBody(node.body, visitor, context) || factory2.createBlock([])
    );
  }
  function visitSetAccessor(node, parent2) {
    if (!(node.transformFlags & 1 /* ContainsTypeScript */)) {
      return node;
    }
    if (!shouldEmitAccessorDeclaration(node)) {
      return void 0;
    }
    let modifiers = isClassLike(parent2) ? visitNodes2(node.modifiers, visitor, isModifierLike) : visitNodes2(node.modifiers, decoratorElidingVisitor, isModifierLike);
    modifiers = injectClassElementTypeMetadata(modifiers, node, parent2);
    return factory2.updateSetAccessorDeclaration(
      node,
      modifiers,
      visitPropertyNameOfClassElement(node),
      visitParameterList(node.parameters, visitor, context),
      visitFunctionBody(node.body, visitor, context) || factory2.createBlock([])
    );
  }
  function visitFunctionDeclaration(node) {
    if (!shouldEmitFunctionLikeDeclaration(node)) {
      return factory2.createNotEmittedStatement(node);
    }
    const updated = factory2.updateFunctionDeclaration(
      node,
      visitNodes2(node.modifiers, modifierVisitor, isModifier),
      node.asteriskToken,
      node.name,
      /*typeParameters*/
      void 0,
      visitParameterList(node.parameters, visitor, context),
      /*type*/
      void 0,
      visitFunctionBody(node.body, visitor, context) || factory2.createBlock([])
    );
    if (isExportOfNamespace(node)) {
      const statements = [updated];
      addExportMemberAssignment(statements, node);
      return statements;
    }
    return updated;
  }
  function visitFunctionExpression(node) {
    if (!shouldEmitFunctionLikeDeclaration(node)) {
      return factory2.createOmittedExpression();
    }
    const updated = factory2.updateFunctionExpression(
      node,
      visitNodes2(node.modifiers, modifierVisitor, isModifier),
      node.asteriskToken,
      node.name,
      /*typeParameters*/
      void 0,
      visitParameterList(node.parameters, visitor, context),
      /*type*/
      void 0,
      visitFunctionBody(node.body, visitor, context) || factory2.createBlock([])
    );
    return updated;
  }
  function visitArrowFunction(node) {
    const updated = factory2.updateArrowFunction(
      node,
      visitNodes2(node.modifiers, modifierVisitor, isModifier),
      /*typeParameters*/
      void 0,
      visitParameterList(node.parameters, visitor, context),
      /*type*/
      void 0,
      node.equalsGreaterThanToken,
      visitFunctionBody(node.body, visitor, context)
    );
    return updated;
  }
  function visitParameter(node) {
    if (parameterIsThisKeyword(node)) {
      return void 0;
    }
    const updated = factory2.updateParameterDeclaration(
      node,
      visitNodes2(node.modifiers, (node2) => isDecorator(node2) ? visitor(node2) : void 0, isModifierLike),
      node.dotDotDotToken,
      Debug.checkDefined(visitNode(node.name, visitor, isBindingName)),
      /*questionToken*/
      void 0,
      /*type*/
      void 0,
      visitNode(node.initializer, visitor, isExpression)
    );
    if (updated !== node) {
      setCommentRange(updated, node);
      setTextRange(updated, moveRangePastModifiers(node));
      setSourceMapRange(updated, moveRangePastModifiers(node));
      setEmitFlags(updated.name, 64 /* NoTrailingSourceMap */);
    }
    return updated;
  }
  function visitVariableStatement(node) {
    if (isExportOfNamespace(node)) {
      const variables = getInitializedVariables(node.declarationList);
      if (variables.length === 0) {
        return void 0;
      }
      return setTextRange(
        factory2.createExpressionStatement(
          factory2.inlineExpressions(
            map(variables, transformInitializedVariable)
          )
        ),
        node
      );
    } else {
      return visitEachChild(node, visitor, context);
    }
  }
  function transformInitializedVariable(node) {
    const name = node.name;
    if (isBindingPattern(name)) {
      return flattenDestructuringAssignment(
        node,
        visitor,
        context,
        0 /* All */,
        /*needsValue*/
        false,
        createNamespaceExportExpression
      );
    } else {
      return setTextRange(
        factory2.createAssignment(
          getNamespaceMemberNameWithSourceMapsAndWithoutComments(name),
          Debug.checkDefined(visitNode(node.initializer, visitor, isExpression))
        ),
        /*location*/
        node
      );
    }
  }
  function visitVariableDeclaration(node) {
    const updated = factory2.updateVariableDeclaration(
      node,
      Debug.checkDefined(visitNode(node.name, visitor, isBindingName)),
      /*exclamationToken*/
      void 0,
      /*type*/
      void 0,
      visitNode(node.initializer, visitor, isExpression)
    );
    if (node.type) {
      setTypeNode(updated.name, node.type);
    }
    return updated;
  }
  function visitParenthesizedExpression(node) {
    const innerExpression = skipOuterExpressions(node.expression, ~6 /* Assertions */);
    if (isAssertionExpression(innerExpression)) {
      const expression = visitNode(node.expression, visitor, isExpression);
      Debug.assert(expression);
      return factory2.createPartiallyEmittedExpression(expression, node);
    }
    return visitEachChild(node, visitor, context);
  }
  function visitAssertionExpression(node) {
    const expression = visitNode(node.expression, visitor, isExpression);
    Debug.assert(expression);
    return factory2.createPartiallyEmittedExpression(expression, node);
  }
  function visitNonNullExpression(node) {
    const expression = visitNode(node.expression, visitor, isLeftHandSideExpression);
    Debug.assert(expression);
    return factory2.createPartiallyEmittedExpression(expression, node);
  }
  function visitSatisfiesExpression(node) {
    const expression = visitNode(node.expression, visitor, isExpression);
    Debug.assert(expression);
    return factory2.createPartiallyEmittedExpression(expression, node);
  }
  function visitCallExpression(node) {
    return factory2.updateCallExpression(
      node,
      Debug.checkDefined(visitNode(node.expression, visitor, isExpression)),
      /*typeArguments*/
      void 0,
      visitNodes2(node.arguments, visitor, isExpression)
    );
  }
  function visitNewExpression(node) {
    return factory2.updateNewExpression(
      node,
      Debug.checkDefined(visitNode(node.expression, visitor, isExpression)),
      /*typeArguments*/
      void 0,
      visitNodes2(node.arguments, visitor, isExpression)
    );
  }
  function visitTaggedTemplateExpression(node) {
    return factory2.updateTaggedTemplateExpression(
      node,
      Debug.checkDefined(visitNode(node.tag, visitor, isExpression)),
      /*typeArguments*/
      void 0,
      Debug.checkDefined(visitNode(node.template, visitor, isTemplateLiteral))
    );
  }
  function visitJsxSelfClosingElement(node) {
    return factory2.updateJsxSelfClosingElement(
      node,
      Debug.checkDefined(visitNode(node.tagName, visitor, isJsxTagNameExpression)),
      /*typeArguments*/
      void 0,
      Debug.checkDefined(visitNode(node.attributes, visitor, isJsxAttributes))
    );
  }
  function visitJsxJsxOpeningElement(node) {
    return factory2.updateJsxOpeningElement(
      node,
      Debug.checkDefined(visitNode(node.tagName, visitor, isJsxTagNameExpression)),
      /*typeArguments*/
      void 0,
      Debug.checkDefined(visitNode(node.attributes, visitor, isJsxAttributes))
    );
  }
  function shouldEmitEnumDeclaration(node) {
    return !isEnumConst(node) || shouldPreserveConstEnums(compilerOptions);
  }
  function visitEnumDeclaration(node) {
    if (!shouldEmitEnumDeclaration(node)) {
      return factory2.createNotEmittedStatement(node);
    }
    const statements = [];
    let emitFlags = 4 /* AdviseOnEmitNode */;
    const varAdded = addVarForEnumOrModuleDeclaration(statements, node);
    if (varAdded) {
      if (moduleKind !== 4 /* System */ || currentLexicalScope !== currentSourceFile) {
        emitFlags |= 1024 /* NoLeadingComments */;
      }
    }
    const parameterName = getNamespaceParameterName(node);
    const containerName = getNamespaceContainerName(node);
    const exportName = isExportOfNamespace(node) ? factory2.getExternalModuleOrNamespaceExportName(
      currentNamespaceContainerName,
      node,
      /*allowComments*/
      false,
      /*allowSourceMaps*/
      true
    ) : factory2.getDeclarationName(
      node,
      /*allowComments*/
      false,
      /*allowSourceMaps*/
      true
    );
    let moduleArg = factory2.createLogicalOr(
      exportName,
      factory2.createAssignment(
        exportName,
        factory2.createObjectLiteralExpression()
      )
    );
    if (isExportOfNamespace(node)) {
      const localName = factory2.getLocalName(
        node,
        /*allowComments*/
        false,
        /*allowSourceMaps*/
        true
      );
      moduleArg = factory2.createAssignment(localName, moduleArg);
    }
    const enumStatement = factory2.createExpressionStatement(
      factory2.createCallExpression(
        factory2.createFunctionExpression(
          /*modifiers*/
          void 0,
          /*asteriskToken*/
          void 0,
          /*name*/
          void 0,
          /*typeParameters*/
          void 0,
          [factory2.createParameterDeclaration(
            /*modifiers*/
            void 0,
            /*dotDotDotToken*/
            void 0,
            parameterName
          )],
          /*type*/
          void 0,
          transformEnumBody(node, containerName)
        ),
        /*typeArguments*/
        void 0,
        [moduleArg]
      )
    );
    setOriginalNode(enumStatement, node);
    if (varAdded) {
      setSyntheticLeadingComments(enumStatement, void 0);
      setSyntheticTrailingComments(enumStatement, void 0);
    }
    setTextRange(enumStatement, node);
    addEmitFlags(enumStatement, emitFlags);
    statements.push(enumStatement);
    return statements;
  }
  function transformEnumBody(node, localName) {
    const savedCurrentNamespaceLocalName = currentNamespaceContainerName;
    currentNamespaceContainerName = localName;
    const statements = [];
    startLexicalEnvironment();
    const members = map(node.members, transformEnumMember);
    insertStatementsAfterStandardPrologue(statements, endLexicalEnvironment());
    addRange(statements, members);
    currentNamespaceContainerName = savedCurrentNamespaceLocalName;
    return factory2.createBlock(
      setTextRange(
        factory2.createNodeArray(statements),
        /*location*/
        node.members
      ),
      /*multiLine*/
      true
    );
  }
  function transformEnumMember(member) {
    const name = getExpressionForPropertyName(
      member,
      /*generateNameForComputedPropertyName*/
      false
    );
    const valueExpression = transformEnumMemberDeclarationValue(member);
    const innerAssignment = factory2.createAssignment(
      factory2.createElementAccessExpression(
        currentNamespaceContainerName,
        name
      ),
      valueExpression
    );
    const outerAssignment = valueExpression.kind === 11 /* StringLiteral */ ? innerAssignment : factory2.createAssignment(
      factory2.createElementAccessExpression(
        currentNamespaceContainerName,
        innerAssignment
      ),
      name
    );
    return setTextRange(
      factory2.createExpressionStatement(
        setTextRange(
          outerAssignment,
          member
        )
      ),
      member
    );
  }
  function transformEnumMemberDeclarationValue(member) {
    const value = resolver.getConstantValue(member);
    if (value !== void 0) {
      return typeof value === "string" ? factory2.createStringLiteral(value) : value < 0 ? factory2.createPrefixUnaryExpression(41 /* MinusToken */, factory2.createNumericLiteral(-value)) : factory2.createNumericLiteral(value);
    } else {
      enableSubstitutionForNonQualifiedEnumMembers();
      if (member.initializer) {
        return Debug.checkDefined(visitNode(member.initializer, visitor, isExpression));
      } else {
        return factory2.createVoidZero();
      }
    }
  }
  function shouldEmitModuleDeclaration(nodeIn) {
    const node = getParseTreeNode(nodeIn, isModuleDeclaration);
    if (!node) {
      return true;
    }
    return isInstantiatedModule(node, shouldPreserveConstEnums(compilerOptions));
  }
  function recordEmittedDeclarationInScope(node) {
    if (!currentScopeFirstDeclarationsOfName) {
      currentScopeFirstDeclarationsOfName = /* @__PURE__ */ new Map();
    }
    const name = declaredNameInScope(node);
    if (!currentScopeFirstDeclarationsOfName.has(name)) {
      currentScopeFirstDeclarationsOfName.set(name, node);
    }
  }
  function isFirstEmittedDeclarationInScope(node) {
    if (currentScopeFirstDeclarationsOfName) {
      const name = declaredNameInScope(node);
      return currentScopeFirstDeclarationsOfName.get(name) === node;
    }
    return true;
  }
  function declaredNameInScope(node) {
    Debug.assertNode(node.name, isIdentifier);
    return node.name.escapedText;
  }
  function addVarForEnumOrModuleDeclaration(statements, node) {
    const varDecl = factory2.createVariableDeclaration(factory2.getLocalName(
      node,
      /*allowComments*/
      false,
      /*allowSourceMaps*/
      true
    ));
    const varFlags = currentLexicalScope.kind === 312 /* SourceFile */ ? 0 /* None */ : 1 /* Let */;
    const statement = factory2.createVariableStatement(
      visitNodes2(node.modifiers, modifierVisitor, isModifier),
      factory2.createVariableDeclarationList([varDecl], varFlags)
    );
    setOriginalNode(varDecl, node);
    setSyntheticLeadingComments(varDecl, void 0);
    setSyntheticTrailingComments(varDecl, void 0);
    setOriginalNode(statement, node);
    recordEmittedDeclarationInScope(node);
    if (isFirstEmittedDeclarationInScope(node)) {
      if (node.kind === 266 /* EnumDeclaration */) {
        setSourceMapRange(statement.declarationList, node);
      } else {
        setSourceMapRange(statement, node);
      }
      setCommentRange(statement, node);
      addEmitFlags(statement, 2048 /* NoTrailingComments */);
      statements.push(statement);
      return true;
    }
    return false;
  }
  function visitModuleDeclaration(node) {
    if (!shouldEmitModuleDeclaration(node)) {
      return factory2.createNotEmittedStatement(node);
    }
    Debug.assertNode(node.name, isIdentifier, "A TypeScript namespace should have an Identifier name.");
    enableSubstitutionForNamespaceExports();
    const statements = [];
    let emitFlags = 4 /* AdviseOnEmitNode */;
    const varAdded = addVarForEnumOrModuleDeclaration(statements, node);
    if (varAdded) {
      if (moduleKind !== 4 /* System */ || currentLexicalScope !== currentSourceFile) {
        emitFlags |= 1024 /* NoLeadingComments */;
      }
    }
    const parameterName = getNamespaceParameterName(node);
    const containerName = getNamespaceContainerName(node);
    const exportName = isExportOfNamespace(node) ? factory2.getExternalModuleOrNamespaceExportName(
      currentNamespaceContainerName,
      node,
      /*allowComments*/
      false,
      /*allowSourceMaps*/
      true
    ) : factory2.getDeclarationName(
      node,
      /*allowComments*/
      false,
      /*allowSourceMaps*/
      true
    );
    let moduleArg = factory2.createLogicalOr(
      exportName,
      factory2.createAssignment(
        exportName,
        factory2.createObjectLiteralExpression()
      )
    );
    if (isExportOfNamespace(node)) {
      const localName = factory2.getLocalName(
        node,
        /*allowComments*/
        false,
        /*allowSourceMaps*/
        true
      );
      moduleArg = factory2.createAssignment(localName, moduleArg);
    }
    const moduleStatement = factory2.createExpressionStatement(
      factory2.createCallExpression(
        factory2.createFunctionExpression(
          /*modifiers*/
          void 0,
          /*asteriskToken*/
          void 0,
          /*name*/
          void 0,
          /*typeParameters*/
          void 0,
          [factory2.createParameterDeclaration(
            /*modifiers*/
            void 0,
            /*dotDotDotToken*/
            void 0,
            parameterName
          )],
          /*type*/
          void 0,
          transformModuleBody(node, containerName)
        ),
        /*typeArguments*/
        void 0,
        [moduleArg]
      )
    );
    setOriginalNode(moduleStatement, node);
    if (varAdded) {
      setSyntheticLeadingComments(moduleStatement, void 0);
      setSyntheticTrailingComments(moduleStatement, void 0);
    }
    setTextRange(moduleStatement, node);
    addEmitFlags(moduleStatement, emitFlags);
    statements.push(moduleStatement);
    return statements;
  }
  function transformModuleBody(node, namespaceLocalName) {
    const savedCurrentNamespaceContainerName = currentNamespaceContainerName;
    const savedCurrentNamespace = currentNamespace;
    const savedCurrentScopeFirstDeclarationsOfName = currentScopeFirstDeclarationsOfName;
    currentNamespaceContainerName = namespaceLocalName;
    currentNamespace = node;
    currentScopeFirstDeclarationsOfName = void 0;
    const statements = [];
    startLexicalEnvironment();
    let statementsLocation;
    let blockLocation;
    if (node.body) {
      if (node.body.kind === 268 /* ModuleBlock */) {
        saveStateAndInvoke(node.body, (body) => addRange(statements, visitNodes2(body.statements, namespaceElementVisitor, isStatement)));
        statementsLocation = node.body.statements;
        blockLocation = node.body;
      } else {
        const result = visitModuleDeclaration(node.body);
        if (result) {
          if (isArray(result)) {
            addRange(statements, result);
          } else {
            statements.push(result);
          }
        }
        const moduleBlock = getInnerMostModuleDeclarationFromDottedModule(node).body;
        statementsLocation = moveRangePos(moduleBlock.statements, -1);
      }
    }
    insertStatementsAfterStandardPrologue(statements, endLexicalEnvironment());
    currentNamespaceContainerName = savedCurrentNamespaceContainerName;
    currentNamespace = savedCurrentNamespace;
    currentScopeFirstDeclarationsOfName = savedCurrentScopeFirstDeclarationsOfName;
    const block = factory2.createBlock(
      setTextRange(
        factory2.createNodeArray(statements),
        /*location*/
        statementsLocation
      ),
      /*multiLine*/
      true
    );
    setTextRange(block, blockLocation);
    if (!node.body || node.body.kind !== 268 /* ModuleBlock */) {
      setEmitFlags(block, getEmitFlags(block) | 3072 /* NoComments */);
    }
    return block;
  }
  function getInnerMostModuleDeclarationFromDottedModule(moduleDeclaration) {
    if (moduleDeclaration.body.kind === 267 /* ModuleDeclaration */) {
      const recursiveInnerModule = getInnerMostModuleDeclarationFromDottedModule(moduleDeclaration.body);
      return recursiveInnerModule || moduleDeclaration.body;
    }
  }
  function visitImportDeclaration(node) {
    if (!node.importClause) {
      return node;
    }
    if (node.importClause.isTypeOnly) {
      return void 0;
    }
    const importClause = visitNode(node.importClause, visitImportClause, isImportClause);
    return importClause || compilerOptions.importsNotUsedAsValues === 1 /* Preserve */ || compilerOptions.importsNotUsedAsValues === 2 /* Error */ ? factory2.updateImportDeclaration(
      node,
      /*modifiers*/
      void 0,
      importClause,
      node.moduleSpecifier,
      node.attributes
    ) : void 0;
  }
  function visitImportClause(node) {
    Debug.assert(!node.isTypeOnly);
    const name = shouldEmitAliasDeclaration(node) ? node.name : void 0;
    const namedBindings = visitNode(node.namedBindings, visitNamedImportBindings, isNamedImportBindings);
    return name || namedBindings ? factory2.updateImportClause(
      node,
      /*isTypeOnly*/
      false,
      name,
      namedBindings
    ) : void 0;
  }
  function visitNamedImportBindings(node) {
    if (node.kind === 274 /* NamespaceImport */) {
      return shouldEmitAliasDeclaration(node) ? node : void 0;
    } else {
      const allowEmpty = compilerOptions.verbatimModuleSyntax || compilerOptions.preserveValueImports && (compilerOptions.importsNotUsedAsValues === 1 /* Preserve */ || compilerOptions.importsNotUsedAsValues === 2 /* Error */);
      const elements = visitNodes2(node.elements, visitImportSpecifier, isImportSpecifier);
      return allowEmpty || some(elements) ? factory2.updateNamedImports(node, elements) : void 0;
    }
  }
  function visitImportSpecifier(node) {
    return !node.isTypeOnly && shouldEmitAliasDeclaration(node) ? node : void 0;
  }
  function visitExportAssignment(node) {
    return compilerOptions.verbatimModuleSyntax || resolver.isValueAliasDeclaration(node) ? visitEachChild(node, visitor, context) : void 0;
  }
  function visitExportDeclaration(node) {
    if (node.isTypeOnly) {
      return void 0;
    }
    if (!node.exportClause || isNamespaceExport(node.exportClause)) {
      return node;
    }
    const allowEmpty = compilerOptions.verbatimModuleSyntax || !!node.moduleSpecifier && (compilerOptions.importsNotUsedAsValues === 1 /* Preserve */ || compilerOptions.importsNotUsedAsValues === 2 /* Error */);
    const exportClause = visitNode(
      node.exportClause,
      (bindings) => visitNamedExportBindings(bindings, allowEmpty),
      isNamedExportBindings
    );
    return exportClause ? factory2.updateExportDeclaration(
      node,
      /*modifiers*/
      void 0,
      node.isTypeOnly,
      exportClause,
      node.moduleSpecifier,
      node.attributes
    ) : void 0;
  }
  function visitNamedExports(node, allowEmpty) {
    const elements = visitNodes2(node.elements, visitExportSpecifier, isExportSpecifier);
    return allowEmpty || some(elements) ? factory2.updateNamedExports(node, elements) : void 0;
  }
  function visitNamespaceExports(node) {
    return factory2.updateNamespaceExport(node, Debug.checkDefined(visitNode(node.name, visitor, isIdentifier)));
  }
  function visitNamedExportBindings(node, allowEmpty) {
    return isNamespaceExport(node) ? visitNamespaceExports(node) : visitNamedExports(node, allowEmpty);
  }
  function visitExportSpecifier(node) {
    return !node.isTypeOnly && (compilerOptions.verbatimModuleSyntax || resolver.isValueAliasDeclaration(node)) ? node : void 0;
  }
  function shouldEmitImportEqualsDeclaration(node) {
    return shouldEmitAliasDeclaration(node) || !isExternalModule(currentSourceFile) && resolver.isTopLevelValueImportEqualsWithEntityName(node);
  }
  function visitImportEqualsDeclaration(node) {
    if (node.isTypeOnly) {
      return void 0;
    }
    if (isExternalModuleImportEqualsDeclaration(node)) {
      const isReferenced = shouldEmitAliasDeclaration(node);
      if (!isReferenced && compilerOptions.importsNotUsedAsValues === 1 /* Preserve */) {
        return setOriginalNode(
          setTextRange(
            factory2.createImportDeclaration(
              /*modifiers*/
              void 0,
              /*importClause*/
              void 0,
              node.moduleReference.expression,
              /*attributes*/
              void 0
            ),
            node
          ),
          node
        );
      }
      return isReferenced ? visitEachChild(node, visitor, context) : void 0;
    }
    if (!shouldEmitImportEqualsDeclaration(node)) {
      return void 0;
    }
    const moduleReference = createExpressionFromEntityName(factory2, node.moduleReference);
    setEmitFlags(moduleReference, 3072 /* NoComments */ | 4096 /* NoNestedComments */);
    if (isNamedExternalModuleExport(node) || !isExportOfNamespace(node)) {
      return setOriginalNode(
        setTextRange(
          factory2.createVariableStatement(
            visitNodes2(node.modifiers, modifierVisitor, isModifier),
            factory2.createVariableDeclarationList([
              setOriginalNode(
                factory2.createVariableDeclaration(
                  node.name,
                  /*exclamationToken*/
                  void 0,
                  /*type*/
                  void 0,
                  moduleReference
                ),
                node
              )
            ])
          ),
          node
        ),
        node
      );
    } else {
      return setOriginalNode(
        createNamespaceExport(
          node.name,
          moduleReference,
          node
        ),
        node
      );
    }
  }
  function isExportOfNamespace(node) {
    return currentNamespace !== void 0 && hasSyntacticModifier(node, 32 /* Export */);
  }
  function isExternalModuleExport(node) {
    return currentNamespace === void 0 && hasSyntacticModifier(node, 32 /* Export */);
  }
  function isNamedExternalModuleExport(node) {
    return isExternalModuleExport(node) && !hasSyntacticModifier(node, 2048 /* Default */);
  }
  function isDefaultExternalModuleExport(node) {
    return isExternalModuleExport(node) && hasSyntacticModifier(node, 2048 /* Default */);
  }
  function createExportMemberAssignmentStatement(node) {
    const expression = factory2.createAssignment(
      factory2.getExternalModuleOrNamespaceExportName(
        currentNamespaceContainerName,
        node,
        /*allowComments*/
        false,
        /*allowSourceMaps*/
        true
      ),
      factory2.getLocalName(node)
    );
    setSourceMapRange(expression, createRange(node.name ? node.name.pos : node.pos, node.end));
    const statement = factory2.createExpressionStatement(expression);
    setSourceMapRange(statement, createRange(-1, node.end));
    return statement;
  }
  function addExportMemberAssignment(statements, node) {
    statements.push(createExportMemberAssignmentStatement(node));
  }
  function createNamespaceExport(exportName, exportValue, location) {
    return setTextRange(
      factory2.createExpressionStatement(
        factory2.createAssignment(
          factory2.getNamespaceMemberName(
            currentNamespaceContainerName,
            exportName,
            /*allowComments*/
            false,
            /*allowSourceMaps*/
            true
          ),
          exportValue
        )
      ),
      location
    );
  }
  function createNamespaceExportExpression(exportName, exportValue, location) {
    return setTextRange(factory2.createAssignment(getNamespaceMemberNameWithSourceMapsAndWithoutComments(exportName), exportValue), location);
  }
  function getNamespaceMemberNameWithSourceMapsAndWithoutComments(name) {
    return factory2.getNamespaceMemberName(
      currentNamespaceContainerName,
      name,
      /*allowComments*/
      false,
      /*allowSourceMaps*/
      true
    );
  }
  function getNamespaceParameterName(node) {
    const name = factory2.getGeneratedNameForNode(node);
    setSourceMapRange(name, node.name);
    return name;
  }
  function getNamespaceContainerName(node) {
    return factory2.getGeneratedNameForNode(node);
  }
  function enableSubstitutionForNonQualifiedEnumMembers() {
    if ((enabledSubstitutions & 8 /* NonQualifiedEnumMembers */) === 0) {
      enabledSubstitutions |= 8 /* NonQualifiedEnumMembers */;
      context.enableSubstitution(80 /* Identifier */);
    }
  }
  function enableSubstitutionForNamespaceExports() {
    if ((enabledSubstitutions & 2 /* NamespaceExports */) === 0) {
      enabledSubstitutions |= 2 /* NamespaceExports */;
      context.enableSubstitution(80 /* Identifier */);
      context.enableSubstitution(304 /* ShorthandPropertyAssignment */);
      context.enableEmitNotification(267 /* ModuleDeclaration */);
    }
  }
  function isTransformedModuleDeclaration(node) {
    return getOriginalNode(node).kind === 267 /* ModuleDeclaration */;
  }
  function isTransformedEnumDeclaration(node) {
    return getOriginalNode(node).kind === 266 /* EnumDeclaration */;
  }
  function onEmitNode(hint, node, emitCallback) {
    const savedApplicableSubstitutions = applicableSubstitutions;
    const savedCurrentSourceFile = currentSourceFile;
    if (isSourceFile(node)) {
      currentSourceFile = node;
    }
    if (enabledSubstitutions & 2 /* NamespaceExports */ && isTransformedModuleDeclaration(node)) {
      applicableSubstitutions |= 2 /* NamespaceExports */;
    }
    if (enabledSubstitutions & 8 /* NonQualifiedEnumMembers */ && isTransformedEnumDeclaration(node)) {
      applicableSubstitutions |= 8 /* NonQualifiedEnumMembers */;
    }
    previousOnEmitNode(hint, node, emitCallback);
    applicableSubstitutions = savedApplicableSubstitutions;
    currentSourceFile = savedCurrentSourceFile;
  }
  function onSubstituteNode(hint, node) {
    node = previousOnSubstituteNode(hint, node);
    if (hint === 1 /* Expression */) {
      return substituteExpression(node);
    } else if (isShorthandPropertyAssignment(node)) {
      return substituteShorthandPropertyAssignment(node);
    }
    return node;
  }
  function substituteShorthandPropertyAssignment(node) {
    if (enabledSubstitutions & 2 /* NamespaceExports */) {
      const name = node.name;
      const exportedName = trySubstituteNamespaceExportedName(name);
      if (exportedName) {
        if (node.objectAssignmentInitializer) {
          const initializer = factory2.createAssignment(exportedName, node.objectAssignmentInitializer);
          return setTextRange(factory2.createPropertyAssignment(name, initializer), node);
        }
        return setTextRange(factory2.createPropertyAssignment(name, exportedName), node);
      }
    }
    return node;
  }
  function substituteExpression(node) {
    switch (node.kind) {
      case 80 /* Identifier */:
        return substituteExpressionIdentifier(node);
      case 211 /* PropertyAccessExpression */:
        return substitutePropertyAccessExpression(node);
      case 212 /* ElementAccessExpression */:
        return substituteElementAccessExpression(node);
    }
    return node;
  }
  function substituteExpressionIdentifier(node) {
    return trySubstituteNamespaceExportedName(node) || node;
  }
  function trySubstituteNamespaceExportedName(node) {
    if (enabledSubstitutions & applicableSubstitutions && !isGeneratedIdentifier(node) && !isLocalName(node)) {
      const container = resolver.getReferencedExportContainer(
        node,
        /*prefixLocals*/
        false
      );
      if (container && container.kind !== 312 /* SourceFile */) {
        const substitute = applicableSubstitutions & 2 /* NamespaceExports */ && container.kind === 267 /* ModuleDeclaration */ || applicableSubstitutions & 8 /* NonQualifiedEnumMembers */ && container.kind === 266 /* EnumDeclaration */;
        if (substitute) {
          return setTextRange(
            factory2.createPropertyAccessExpression(factory2.getGeneratedNameForNode(container), node),
            /*location*/
            node
          );
        }
      }
    }
    return void 0;
  }
  function substitutePropertyAccessExpression(node) {
    return substituteConstantValue(node);
  }
  function substituteElementAccessExpression(node) {
    return substituteConstantValue(node);
  }
  function safeMultiLineComment(value) {
    return value.replace(/\*\//g, "*_/");
  }
  function substituteConstantValue(node) {
    const constantValue = tryGetConstEnumValue(node);
    if (constantValue !== void 0) {
      setConstantValue(node, constantValue);
      const substitute = typeof constantValue === "string" ? factory2.createStringLiteral(constantValue) : constantValue < 0 ? factory2.createPrefixUnaryExpression(41 /* MinusToken */, factory2.createNumericLiteral(-constantValue)) : factory2.createNumericLiteral(constantValue);
      if (!compilerOptions.removeComments) {
        const originalNode = getOriginalNode(node, isAccessExpression);
        addSyntheticTrailingComment(substitute, 3 /* MultiLineCommentTrivia */, ` ${safeMultiLineComment(getTextOfNode(originalNode))} `);
      }
      return substitute;
    }
    return node;
  }
  function tryGetConstEnumValue(node) {
    if (getIsolatedModules(compilerOptions)) {
      return void 0;
    }
    return isPropertyAccessExpression(node) || isElementAccessExpression(node) ? resolver.getConstantValue(node) : void 0;
  }
  function shouldEmitAliasDeclaration(node) {
    return compilerOptions.verbatimModuleSyntax || isInJSFile(node) || (compilerOptions.preserveValueImports ? resolver.isValueAliasDeclaration(node) : resolver.isReferencedAliasDeclaration(node));
  }
}

// src/compiler/transformers/classFields.ts
function transformClassFields(context) {
  const {
    factory: factory2,
    getEmitHelperFactory: emitHelpers,
    hoistVariableDeclaration,
    endLexicalEnvironment,
    startLexicalEnvironment,
    resumeLexicalEnvironment,
    addBlockScopedVariable
  } = context;
  const resolver = context.getEmitResolver();
  const compilerOptions = context.getCompilerOptions();
  const languageVersion = getEmitScriptTarget(compilerOptions);
  const useDefineForClassFields = getUseDefineForClassFields(compilerOptions);
  const legacyDecorators = !!compilerOptions.experimentalDecorators;
  const shouldTransformInitializersUsingSet = !useDefineForClassFields;
  const shouldTransformInitializersUsingDefine = useDefineForClassFields && languageVersion < 9 /* ES2022 */;
  const shouldTransformInitializers = shouldTransformInitializersUsingSet || shouldTransformInitializersUsingDefine;
  const shouldTransformPrivateElementsOrClassStaticBlocks = languageVersion < 9 /* ES2022 */;
  const shouldTransformAutoAccessors = languageVersion < 99 /* ESNext */ ? -1 /* True */ : !useDefineForClassFields ? 3 /* Maybe */ : 0 /* False */;
  const shouldTransformThisInStaticInitializers = languageVersion < 9 /* ES2022 */;
  const shouldTransformSuperInStaticInitializers = shouldTransformThisInStaticInitializers && languageVersion >= 2 /* ES2015 */;
  const shouldTransformAnything = shouldTransformInitializers || shouldTransformPrivateElementsOrClassStaticBlocks || shouldTransformAutoAccessors === -1 /* True */;
  const previousOnSubstituteNode = context.onSubstituteNode;
  context.onSubstituteNode = onSubstituteNode;
  const previousOnEmitNode = context.onEmitNode;
  context.onEmitNode = onEmitNode;
  let shouldTransformPrivateStaticElementsInFile = false;
  let enabledSubstitutions;
  let classAliases;
  let pendingExpressions;
  let pendingStatements;
  let lexicalEnvironment;
  const lexicalEnvironmentMap = /* @__PURE__ */ new Map();
  const noSubstitution = /* @__PURE__ */ new Set();
  let currentClassContainer;
  let currentClassElement;
  let shouldSubstituteThisWithClassThis = false;
  let previousShouldSubstituteThisWithClassThis = false;
  return chainBundle(context, transformSourceFile);
  function transformSourceFile(node) {
    if (node.isDeclarationFile) {
      return node;
    }
    lexicalEnvironment = void 0;
    shouldTransformPrivateStaticElementsInFile = !!(getInternalEmitFlags(node) & 32 /* TransformPrivateStaticElements */);
    if (!shouldTransformAnything && !shouldTransformPrivateStaticElementsInFile) {
      return node;
    }
    const visited = visitEachChild(node, visitor, context);
    addEmitHelpers(visited, context.readEmitHelpers());
    return visited;
  }
  function modifierVisitor(node) {
    switch (node.kind) {
      case 129 /* AccessorKeyword */:
        return shouldTransformAutoAccessorsInCurrentClass() ? void 0 : node;
      default:
        return tryCast(node, isModifier);
    }
  }
  function visitor(node) {
    if (!(node.transformFlags & 16777216 /* ContainsClassFields */) && !(node.transformFlags & 134234112 /* ContainsLexicalThisOrSuper */)) {
      return node;
    }
    switch (node.kind) {
      case 129 /* AccessorKeyword */:
        return Debug.fail("Use `modifierVisitor` instead.");
      case 263 /* ClassDeclaration */:
        return visitClassDeclaration(node);
      case 231 /* ClassExpression */:
        return visitClassExpression(node);
      case 175 /* ClassStaticBlockDeclaration */:
      case 172 /* PropertyDeclaration */:
        return Debug.fail("Use `classElementVisitor` instead.");
      case 303 /* PropertyAssignment */:
        return visitPropertyAssignment(node);
      case 243 /* VariableStatement */:
        return visitVariableStatement(node);
      case 260 /* VariableDeclaration */:
        return visitVariableDeclaration(node);
      case 169 /* Parameter */:
        return visitParameterDeclaration(node);
      case 208 /* BindingElement */:
        return visitBindingElement(node);
      case 277 /* ExportAssignment */:
        return visitExportAssignment(node);
      case 81 /* PrivateIdentifier */:
        return visitPrivateIdentifier(node);
      case 211 /* PropertyAccessExpression */:
        return visitPropertyAccessExpression(node);
      case 212 /* ElementAccessExpression */:
        return visitElementAccessExpression(node);
      case 224 /* PrefixUnaryExpression */:
      case 225 /* PostfixUnaryExpression */:
        return visitPreOrPostfixUnaryExpression(
          node,
          /*discarded*/
          false
        );
      case 226 /* BinaryExpression */:
        return visitBinaryExpression(
          node,
          /*discarded*/
          false
        );
      case 217 /* ParenthesizedExpression */:
        return visitParenthesizedExpression(
          node,
          /*discarded*/
          false
        );
      case 213 /* CallExpression */:
        return visitCallExpression(node);
      case 244 /* ExpressionStatement */:
        return visitExpressionStatement(node);
      case 215 /* TaggedTemplateExpression */:
        return visitTaggedTemplateExpression(node);
      case 248 /* ForStatement */:
        return visitForStatement(node);
      case 110 /* ThisKeyword */:
        return visitThisExpression(node);
      case 262 /* FunctionDeclaration */:
      case 218 /* FunctionExpression */:
        return setCurrentClassElementAnd(
          /*classElement*/
          void 0,
          fallbackVisitor,
          node
        );
      case 176 /* Constructor */:
      case 174 /* MethodDeclaration */:
      case 177 /* GetAccessor */:
      case 178 /* SetAccessor */: {
        return setCurrentClassElementAnd(
          node,
          fallbackVisitor,
          node
        );
      }
      default:
        return fallbackVisitor(node);
    }
  }
  function fallbackVisitor(node) {
    return visitEachChild(node, visitor, context);
  }
  function discardedValueVisitor(node) {
    switch (node.kind) {
      case 224 /* PrefixUnaryExpression */:
      case 225 /* PostfixUnaryExpression */:
        return visitPreOrPostfixUnaryExpression(
          node,
          /*discarded*/
          true
        );
      case 226 /* BinaryExpression */:
        return visitBinaryExpression(
          node,
          /*discarded*/
          true
        );
      case 361 /* CommaListExpression */:
        return visitCommaListExpression(
          node,
          /*discarded*/
          true
        );
      case 217 /* ParenthesizedExpression */:
        return visitParenthesizedExpression(
          node,
          /*discarded*/
          true
        );
      default:
        return visitor(node);
    }
  }
  function heritageClauseVisitor(node) {
    switch (node.kind) {
      case 298 /* HeritageClause */:
        return visitEachChild(node, heritageClauseVisitor, context);
      case 233 /* ExpressionWithTypeArguments */:
        return visitExpressionWithTypeArgumentsInHeritageClause(node);
      default:
        return visitor(node);
    }
  }
  function assignmentTargetVisitor(node) {
    switch (node.kind) {
      case 210 /* ObjectLiteralExpression */:
      case 209 /* ArrayLiteralExpression */:
        return visitAssignmentPattern(node);
      default:
        return visitor(node);
    }
  }
  function classElementVisitor(node) {
    switch (node.kind) {
      case 176 /* Constructor */:
        return setCurrentClassElementAnd(
          node,
          visitConstructorDeclaration,
          node
        );
      case 177 /* GetAccessor */:
      case 178 /* SetAccessor */:
      case 174 /* MethodDeclaration */:
        return setCurrentClassElementAnd(
          node,
          visitMethodOrAccessorDeclaration,
          node
        );
      case 172 /* PropertyDeclaration */:
        return setCurrentClassElementAnd(
          node,
          visitPropertyDeclaration,
          node
        );
      case 175 /* ClassStaticBlockDeclaration */:
        return setCurrentClassElementAnd(
          node,
          visitClassStaticBlockDeclaration,
          node
        );
      case 167 /* ComputedPropertyName */:
        return visitComputedPropertyName(node);
      case 240 /* SemicolonClassElement */:
        return node;
      default:
        return isModifierLike(node) ? modifierVisitor(node) : visitor(node);
    }
  }
  function propertyNameVisitor(node) {
    switch (node.kind) {
      case 167 /* ComputedPropertyName */:
        return visitComputedPropertyName(node);
      default:
        return visitor(node);
    }
  }
  function accessorFieldResultVisitor(node) {
    switch (node.kind) {
      case 172 /* PropertyDeclaration */:
        return transformFieldInitializer(node);
      case 177 /* GetAccessor */:
      case 178 /* SetAccessor */:
        return classElementVisitor(node);
      default:
        Debug.assertMissingNode(node, "Expected node to either be a PropertyDeclaration, GetAccessorDeclaration, or SetAccessorDeclaration");
        break;
    }
  }
  function visitPrivateIdentifier(node) {
    if (!shouldTransformPrivateElementsOrClassStaticBlocks) {
      return node;
    }
    if (isStatement(node.parent)) {
      return node;
    }
    return setOriginalNode(factory2.createIdentifier(""), node);
  }
  function transformPrivateIdentifierInInExpression(node) {
    const info = accessPrivateIdentifier2(node.left);
    if (info) {
      const receiver = visitNode(node.right, visitor, isExpression);
      return setOriginalNode(
        emitHelpers().createClassPrivateFieldInHelper(info.brandCheckIdentifier, receiver),
        node
      );
    }
    return visitEachChild(node, visitor, context);
  }
  function visitPropertyAssignment(node) {
    if (isNamedEvaluation(node, isAnonymousClassNeedingAssignedName)) {
      node = transformNamedEvaluation(context, node);
    }
    return visitEachChild(node, visitor, context);
  }
  function visitVariableStatement(node) {
    const savedPendingStatements = pendingStatements;
    pendingStatements = [];
    const visitedNode = visitEachChild(node, visitor, context);
    const statement = some(pendingStatements) ? [visitedNode, ...pendingStatements] : visitedNode;
    pendingStatements = savedPendingStatements;
    return statement;
  }
  function visitVariableDeclaration(node) {
    if (isNamedEvaluation(node, isAnonymousClassNeedingAssignedName)) {
      node = transformNamedEvaluation(context, node);
    }
    return visitEachChild(node, visitor, context);
  }
  function visitParameterDeclaration(node) {
    if (isNamedEvaluation(node, isAnonymousClassNeedingAssignedName)) {
      node = transformNamedEvaluation(context, node);
    }
    return visitEachChild(node, visitor, context);
  }
  function visitBindingElement(node) {
    if (isNamedEvaluation(node, isAnonymousClassNeedingAssignedName)) {
      node = transformNamedEvaluation(context, node);
    }
    return visitEachChild(node, visitor, context);
  }
  function visitExportAssignment(node) {
    if (isNamedEvaluation(node, isAnonymousClassNeedingAssignedName)) {
      node = transformNamedEvaluation(
        context,
        node,
        /*ignoreEmptyStringLiteral*/
        true,
        node.isExportEquals ? "" : "default"
      );
    }
    return visitEachChild(node, visitor, context);
  }
  function injectPendingExpressions(expression) {
    if (some(pendingExpressions)) {
      if (isParenthesizedExpression(expression)) {
        pendingExpressions.push(expression.expression);
        expression = factory2.updateParenthesizedExpression(expression, factory2.inlineExpressions(pendingExpressions));
      } else {
        pendingExpressions.push(expression);
        expression = factory2.inlineExpressions(pendingExpressions);
      }
      pendingExpressions = void 0;
    }
    return expression;
  }
  function visitComputedPropertyName(node) {
    const expression = visitNode(node.expression, visitor, isExpression);
    return factory2.updateComputedPropertyName(node, injectPendingExpressions(expression));
  }
  function visitConstructorDeclaration(node) {
    if (currentClassContainer) {
      return transformConstructor(node, currentClassContainer);
    }
    return fallbackVisitor(node);
  }
  function shouldTransformClassElementToWeakMap(node) {
    if (shouldTransformPrivateElementsOrClassStaticBlocks)
      return true;
    if (hasStaticModifier(node) && getInternalEmitFlags(node) & 32 /* TransformPrivateStaticElements */)
      return true;
    return false;
  }
  function visitMethodOrAccessorDeclaration(node) {
    Debug.assert(!hasDecorators(node));
    if (!isPrivateIdentifierClassElementDeclaration(node) || !shouldTransformClassElementToWeakMap(node)) {
      return visitEachChild(node, classElementVisitor, context);
    }
    const info = accessPrivateIdentifier2(node.name);
    Debug.assert(info, "Undeclared private name for property declaration.");
    if (!info.isValid) {
      return node;
    }
    const functionName = getHoistedFunctionName(node);
    if (functionName) {
      getPendingExpressions().push(
        factory2.createAssignment(
          functionName,
          factory2.createFunctionExpression(
            filter(node.modifiers, (m) => isModifier(m) && !isStaticModifier(m) && !isAccessorModifier(m)),
            node.asteriskToken,
            functionName,
            /*typeParameters*/
            void 0,
            visitParameterList(node.parameters, visitor, context),
            /*type*/
            void 0,
            visitFunctionBody(node.body, visitor, context)
          )
        )
      );
    }
    return void 0;
  }
  function setCurrentClassElementAnd(classElement, visitor2, arg) {
    if (classElement !== currentClassElement) {
      const savedCurrentClassElement = currentClassElement;
      currentClassElement = classElement;
      const result = visitor2(arg);
      currentClassElement = savedCurrentClassElement;
      return result;
    }
    return visitor2(arg);
  }
  function getHoistedFunctionName(node) {
    Debug.assert(isPrivateIdentifier(node.name));
    const info = accessPrivateIdentifier2(node.name);
    Debug.assert(info, "Undeclared private name for property declaration.");
    if (info.kind === "m" /* Method */) {
      return info.methodName;
    }
    if (info.kind === "a" /* Accessor */) {
      if (isGetAccessor(node)) {
        return info.getterName;
      }
      if (isSetAccessor(node)) {
        return info.setterName;
      }
    }
  }
  function getClassThis() {
    const lex = getClassLexicalEnvironment();
    const classThis = lex.classThis ?? lex.classConstructor ?? (currentClassContainer == null ? void 0 : currentClassContainer.name);
    return Debug.checkDefined(classThis);
  }
  function transformAutoAccessor(node) {
    const commentRange = getCommentRange(node);
    const sourceMapRange = getSourceMapRange(node);
    const name = node.name;
    let getterName = name;
    let setterName = name;
    if (isComputedPropertyName(name) && !isSimpleInlineableExpression(name.expression)) {
      const cacheAssignment = findComputedPropertyNameCacheAssignment(name);
      if (cacheAssignment) {
        getterName = factory2.updateComputedPropertyName(name, visitNode(name.expression, visitor, isExpression));
        setterName = factory2.updateComputedPropertyName(name, cacheAssignment.left);
      } else {
        const temp = factory2.createTempVariable(hoistVariableDeclaration);
        setSourceMapRange(temp, name.expression);
        const expression = visitNode(name.expression, visitor, isExpression);
        const assignment = factory2.createAssignment(temp, expression);
        setSourceMapRange(assignment, name.expression);
        getterName = factory2.updateComputedPropertyName(name, assignment);
        setterName = factory2.updateComputedPropertyName(name, temp);
      }
    }
    const modifiers = visitNodes2(node.modifiers, modifierVisitor, isModifier);
    const backingField = createAccessorPropertyBackingField(factory2, node, modifiers, node.initializer);
    setOriginalNode(backingField, node);
    setEmitFlags(backingField, 3072 /* NoComments */);
    setSourceMapRange(backingField, sourceMapRange);
    const receiver = isStatic(node) ? getClassThis() : factory2.createThis();
    const getter = createAccessorPropertyGetRedirector(factory2, node, modifiers, getterName, receiver);
    setOriginalNode(getter, node);
    setCommentRange(getter, commentRange);
    setSourceMapRange(getter, sourceMapRange);
    const setterModifiers = factory2.createModifiersFromModifierFlags(modifiersToFlags(modifiers));
    const setter = createAccessorPropertySetRedirector(factory2, node, setterModifiers, setterName, receiver);
    setOriginalNode(setter, node);
    setEmitFlags(setter, 3072 /* NoComments */);
    setSourceMapRange(setter, sourceMapRange);
    return visitArray([backingField, getter, setter], accessorFieldResultVisitor, isClassElement);
  }
  function transformPrivateFieldInitializer(node) {
    if (shouldTransformClassElementToWeakMap(node)) {
      const info = accessPrivateIdentifier2(node.name);
      Debug.assert(info, "Undeclared private name for property declaration.");
      if (!info.isValid) {
        return node;
      }
      if (info.isStatic && !shouldTransformPrivateElementsOrClassStaticBlocks) {
        const statement = transformPropertyOrClassStaticBlock(node, factory2.createThis());
        if (statement) {
          return factory2.createClassStaticBlockDeclaration(factory2.createBlock(
            [statement],
            /*multiLine*/
            true
          ));
        }
      }
      return void 0;
    }
    if (shouldTransformInitializersUsingSet && !isStatic(node) && (lexicalEnvironment == null ? void 0 : lexicalEnvironment.data) && lexicalEnvironment.data.facts & 16 /* WillHoistInitializersToConstructor */) {
      return factory2.updatePropertyDeclaration(
        node,
        visitNodes2(node.modifiers, visitor, isModifierLike),
        node.name,
        /*questionOrExclamationToken*/
        void 0,
        /*type*/
        void 0,
        /*initializer*/
        void 0
      );
    }
    if (isNamedEvaluation(node, isAnonymousClassNeedingAssignedName)) {
      node = transformNamedEvaluation(context, node);
    }
    return factory2.updatePropertyDeclaration(
      node,
      visitNodes2(node.modifiers, modifierVisitor, isModifier),
      visitNode(node.name, propertyNameVisitor, isPropertyName),
      /*questionOrExclamationToken*/
      void 0,
      /*type*/
      void 0,
      visitNode(node.initializer, visitor, isExpression)
    );
  }
  function transformPublicFieldInitializer(node) {
    if (shouldTransformInitializers && !isAutoAccessorPropertyDeclaration(node)) {
      const expr = getPropertyNameExpressionIfNeeded(
        node.name,
        /*shouldHoist*/
        !!node.initializer || useDefineForClassFields
      );
      if (expr) {
        getPendingExpressions().push(...flattenCommaList(expr));
      }
      if (isStatic(node) && !shouldTransformPrivateElementsOrClassStaticBlocks) {
        const initializerStatement = transformPropertyOrClassStaticBlock(node, factory2.createThis());
        if (initializerStatement) {
          const staticBlock = factory2.createClassStaticBlockDeclaration(
            factory2.createBlock([initializerStatement])
          );
          setOriginalNode(staticBlock, node);
          setCommentRange(staticBlock, node);
          setCommentRange(initializerStatement, { pos: -1, end: -1 });
          setSyntheticLeadingComments(initializerStatement, void 0);
          setSyntheticTrailingComments(initializerStatement, void 0);
          return staticBlock;
        }
      }
      return void 0;
    }
    return factory2.updatePropertyDeclaration(
      node,
      visitNodes2(node.modifiers, modifierVisitor, isModifier),
      visitNode(node.name, propertyNameVisitor, isPropertyName),
      /*questionOrExclamationToken*/
      void 0,
      /*type*/
      void 0,
      visitNode(node.initializer, visitor, isExpression)
    );
  }
  function transformFieldInitializer(node) {
    Debug.assert(!hasDecorators(node), "Decorators should already have been transformed and elided.");
    return isPrivateIdentifierClassElementDeclaration(node) ? transformPrivateFieldInitializer(node) : transformPublicFieldInitializer(node);
  }
  function shouldTransformAutoAccessorsInCurrentClass() {
    return shouldTransformAutoAccessors === -1 /* True */ || shouldTransformAutoAccessors === 3 /* Maybe */ && !!(lexicalEnvironment == null ? void 0 : lexicalEnvironment.data) && !!(lexicalEnvironment.data.facts & 16 /* WillHoistInitializersToConstructor */);
  }
  function visitPropertyDeclaration(node) {
    if (isAutoAccessorPropertyDeclaration(node) && (shouldTransformAutoAccessorsInCurrentClass() || hasStaticModifier(node) && getInternalEmitFlags(node) & 32 /* TransformPrivateStaticElements */)) {
      return transformAutoAccessor(node);
    }
    return transformFieldInitializer(node);
  }
  function shouldForceDynamicThis() {
    return !!currentClassElement && hasStaticModifier(currentClassElement) && isAccessor(currentClassElement) && isAutoAccessorPropertyDeclaration(getOriginalNode(currentClassElement));
  }
  function ensureDynamicThisIfNeeded(node) {
    if (shouldForceDynamicThis()) {
      const innerExpression = skipOuterExpressions(node);
      if (innerExpression.kind === 110 /* ThisKeyword */) {
        noSubstitution.add(innerExpression);
      }
    }
  }
  function createPrivateIdentifierAccess(info, receiver) {
    receiver = visitNode(receiver, visitor, isExpression);
    ensureDynamicThisIfNeeded(receiver);
    return createPrivateIdentifierAccessHelper(info, receiver);
  }
  function createPrivateIdentifierAccessHelper(info, receiver) {
    setCommentRange(receiver, moveRangePos(receiver, -1));
    switch (info.kind) {
      case "a" /* Accessor */:
        return emitHelpers().createClassPrivateFieldGetHelper(
          receiver,
          info.brandCheckIdentifier,
          info.kind,
          info.getterName
        );
      case "m" /* Method */:
        return emitHelpers().createClassPrivateFieldGetHelper(
          receiver,
          info.brandCheckIdentifier,
          info.kind,
          info.methodName
        );
      case "f" /* Field */:
        return emitHelpers().createClassPrivateFieldGetHelper(
          receiver,
          info.brandCheckIdentifier,
          info.kind,
          info.isStatic ? info.variableName : void 0
        );
      case "untransformed":
        return Debug.fail("Access helpers should not be created for untransformed private elements");
      default:
        Debug.assertNever(info, "Unknown private element type");
    }
  }
  function visitPropertyAccessExpression(node) {
    if (isPrivateIdentifier(node.name)) {
      const privateIdentifierInfo = accessPrivateIdentifier2(node.name);
      if (privateIdentifierInfo) {
        return setTextRange(
          setOriginalNode(
            createPrivateIdentifierAccess(privateIdentifierInfo, node.expression),
            node
          ),
          node
        );
      }
    }
    if (shouldTransformSuperInStaticInitializers && currentClassElement && isSuperProperty(node) && isIdentifier(node.name) && isStaticPropertyDeclarationOrClassStaticBlock(currentClassElement) && (lexicalEnvironment == null ? void 0 : lexicalEnvironment.data)) {
      const { classConstructor, superClassReference, facts } = lexicalEnvironment.data;
      if (facts & 1 /* ClassWasDecorated */) {
        return visitInvalidSuperProperty(node);
      }
      if (classConstructor && superClassReference) {
        const superProperty = factory2.createReflectGetCall(
          superClassReference,
          factory2.createStringLiteralFromNode(node.name),
          classConstructor
        );
        setOriginalNode(superProperty, node.expression);
        setTextRange(superProperty, node.expression);
        return superProperty;
      }
    }
    return visitEachChild(node, visitor, context);
  }
  function visitElementAccessExpression(node) {
    if (shouldTransformSuperInStaticInitializers && currentClassElement && isSuperProperty(node) && isStaticPropertyDeclarationOrClassStaticBlock(currentClassElement) && (lexicalEnvironment == null ? void 0 : lexicalEnvironment.data)) {
      const { classConstructor, superClassReference, facts } = lexicalEnvironment.data;
      if (facts & 1 /* ClassWasDecorated */) {
        return visitInvalidSuperProperty(node);
      }
      if (classConstructor && superClassReference) {
        const superProperty = factory2.createReflectGetCall(
          superClassReference,
          visitNode(node.argumentExpression, visitor, isExpression),
          classConstructor
        );
        setOriginalNode(superProperty, node.expression);
        setTextRange(superProperty, node.expression);
        return superProperty;
      }
    }
    return visitEachChild(node, visitor, context);
  }
  function visitPreOrPostfixUnaryExpression(node, discarded) {
    if (node.operator === 46 /* PlusPlusToken */ || node.operator === 47 /* MinusMinusToken */) {
      const operand = skipParentheses(node.operand);
      if (isPrivateIdentifierPropertyAccessExpression(operand)) {
        let info;
        if (info = accessPrivateIdentifier2(operand.name)) {
          const receiver = visitNode(operand.expression, visitor, isExpression);
          ensureDynamicThisIfNeeded(receiver);
          const { readExpression, initializeExpression } = createCopiableReceiverExpr(receiver);
          let expression = createPrivateIdentifierAccess(info, readExpression);
          const temp = isPrefixUnaryExpression(node) || discarded ? void 0 : factory2.createTempVariable(hoistVariableDeclaration);
          expression = expandPreOrPostfixIncrementOrDecrementExpression(factory2, node, expression, hoistVariableDeclaration, temp);
          expression = createPrivateIdentifierAssignment(
            info,
            initializeExpression || readExpression,
            expression,
            64 /* EqualsToken */
          );
          setOriginalNode(expression, node);
          setTextRange(expression, node);
          if (temp) {
            expression = factory2.createComma(expression, temp);
            setTextRange(expression, node);
          }
          return expression;
        }
      } else if (shouldTransformSuperInStaticInitializers && currentClassElement && isSuperProperty(operand) && isStaticPropertyDeclarationOrClassStaticBlock(currentClassElement) && (lexicalEnvironment == null ? void 0 : lexicalEnvironment.data)) {
        const { classConstructor, superClassReference, facts } = lexicalEnvironment.data;
        if (facts & 1 /* ClassWasDecorated */) {
          const expression = visitInvalidSuperProperty(operand);
          return isPrefixUnaryExpression(node) ? factory2.updatePrefixUnaryExpression(node, expression) : factory2.updatePostfixUnaryExpression(node, expression);
        }
        if (classConstructor && superClassReference) {
          let setterName;
          let getterName;
          if (isPropertyAccessExpression(operand)) {
            if (isIdentifier(operand.name)) {
              getterName = setterName = factory2.createStringLiteralFromNode(operand.name);
            }
          } else {
            if (isSimpleInlineableExpression(operand.argumentExpression)) {
              getterName = setterName = operand.argumentExpression;
            } else {
              getterName = factory2.createTempVariable(hoistVariableDeclaration);
              setterName = factory2.createAssignment(getterName, visitNode(operand.argumentExpression, visitor, isExpression));
            }
          }
          if (setterName && getterName) {
            let expression = factory2.createReflectGetCall(superClassReference, getterName, classConstructor);
            setTextRange(expression, operand);
            const temp = discarded ? void 0 : factory2.createTempVariable(hoistVariableDeclaration);
            expression = expandPreOrPostfixIncrementOrDecrementExpression(factory2, node, expression, hoistVariableDeclaration, temp);
            expression = factory2.createReflectSetCall(superClassReference, setterName, expression, classConstructor);
            setOriginalNode(expression, node);
            setTextRange(expression, node);
            if (temp) {
              expression = factory2.createComma(expression, temp);
              setTextRange(expression, node);
            }
            return expression;
          }
        }
      }
    }
    return visitEachChild(node, visitor, context);
  }
  function visitForStatement(node) {
    return factory2.updateForStatement(
      node,
      visitNode(node.initializer, discardedValueVisitor, isForInitializer),
      visitNode(node.condition, visitor, isExpression),
      visitNode(node.incrementor, discardedValueVisitor, isExpression),
      visitIterationBody(node.statement, visitor, context)
    );
  }
  function visitExpressionStatement(node) {
    return factory2.updateExpressionStatement(
      node,
      visitNode(node.expression, discardedValueVisitor, isExpression)
    );
  }
  function createCopiableReceiverExpr(receiver) {
    const clone2 = nodeIsSynthesized(receiver) ? receiver : factory2.cloneNode(receiver);
    if (receiver.kind === 110 /* ThisKeyword */ && noSubstitution.has(receiver)) {
      noSubstitution.add(clone2);
    }
    if (isSimpleInlineableExpression(receiver)) {
      return { readExpression: clone2, initializeExpression: void 0 };
    }
    const readExpression = factory2.createTempVariable(hoistVariableDeclaration);
    const initializeExpression = factory2.createAssignment(readExpression, clone2);
    return { readExpression, initializeExpression };
  }
  function visitCallExpression(node) {
    var _a;
    if (isPrivateIdentifierPropertyAccessExpression(node.expression) && accessPrivateIdentifier2(node.expression.name)) {
      const { thisArg, target } = factory2.createCallBinding(node.expression, hoistVariableDeclaration, languageVersion);
      if (isCallChain(node)) {
        return factory2.updateCallChain(
          node,
          factory2.createPropertyAccessChain(visitNode(target, visitor, isExpression), node.questionDotToken, "call"),
          /*questionDotToken*/
          void 0,
          /*typeArguments*/
          void 0,
          [visitNode(thisArg, visitor, isExpression), ...visitNodes2(node.arguments, visitor, isExpression)]
        );
      }
      return factory2.updateCallExpression(
        node,
        factory2.createPropertyAccessExpression(visitNode(target, visitor, isExpression), "call"),
        /*typeArguments*/
        void 0,
        [visitNode(thisArg, visitor, isExpression), ...visitNodes2(node.arguments, visitor, isExpression)]
      );
    }
    if (shouldTransformSuperInStaticInitializers && currentClassElement && isSuperProperty(node.expression) && isStaticPropertyDeclarationOrClassStaticBlock(currentClassElement) && ((_a = lexicalEnvironment == null ? void 0 : lexicalEnvironment.data) == null ? void 0 : _a.classConstructor)) {
      const invocation = factory2.createFunctionCallCall(
        visitNode(node.expression, visitor, isExpression),
        lexicalEnvironment.data.classConstructor,
        visitNodes2(node.arguments, visitor, isExpression)
      );
      setOriginalNode(invocation, node);
      setTextRange(invocation, node);
      return invocation;
    }
    return visitEachChild(node, visitor, context);
  }
  function visitTaggedTemplateExpression(node) {
    var _a;
    if (isPrivateIdentifierPropertyAccessExpression(node.tag) && accessPrivateIdentifier2(node.tag.name)) {
      const { thisArg, target } = factory2.createCallBinding(node.tag, hoistVariableDeclaration, languageVersion);
      return factory2.updateTaggedTemplateExpression(
        node,
        factory2.createCallExpression(
          factory2.createPropertyAccessExpression(visitNode(target, visitor, isExpression), "bind"),
          /*typeArguments*/
          void 0,
          [visitNode(thisArg, visitor, isExpression)]
        ),
        /*typeArguments*/
        void 0,
        visitNode(node.template, visitor, isTemplateLiteral)
      );
    }
    if (shouldTransformSuperInStaticInitializers && currentClassElement && isSuperProperty(node.tag) && isStaticPropertyDeclarationOrClassStaticBlock(currentClassElement) && ((_a = lexicalEnvironment == null ? void 0 : lexicalEnvironment.data) == null ? void 0 : _a.classConstructor)) {
      const invocation = factory2.createFunctionBindCall(
        visitNode(node.tag, visitor, isExpression),
        lexicalEnvironment.data.classConstructor,
        []
      );
      setOriginalNode(invocation, node);
      setTextRange(invocation, node);
      return factory2.updateTaggedTemplateExpression(
        node,
        invocation,
        /*typeArguments*/
        void 0,
        visitNode(node.template, visitor, isTemplateLiteral)
      );
    }
    return visitEachChild(node, visitor, context);
  }
  function transformClassStaticBlockDeclaration(node) {
    if (lexicalEnvironment) {
      lexicalEnvironmentMap.set(getOriginalNode(node), lexicalEnvironment);
    }
    if (shouldTransformPrivateElementsOrClassStaticBlocks) {
      if (isClassThisAssignmentBlock(node)) {
        const result = visitNode(node.body.statements[0].expression, visitor, isExpression);
        if (isAssignmentExpression(
          result,
          /*excludeCompoundAssignment*/
          true
        ) && result.left === result.right) {
          return void 0;
        }
        return result;
      }
      if (isClassNamedEvaluationHelperBlock(node)) {
        return visitNode(node.body.statements[0].expression, visitor, isExpression);
      }
      startLexicalEnvironment();
      let statements = setCurrentClassElementAnd(
        node,
        (statements2) => visitNodes2(statements2, visitor, isStatement),
        node.body.statements
      );
      statements = factory2.mergeLexicalEnvironment(statements, endLexicalEnvironment());
      const iife = factory2.createImmediatelyInvokedArrowFunction(statements);
      setOriginalNode(skipParentheses(iife.expression), node);
      addEmitFlags(skipParentheses(iife.expression), 4 /* AdviseOnEmitNode */);
      setOriginalNode(iife, node);
      setTextRange(iife, node);
      return iife;
    }
  }
  function isAnonymousClassNeedingAssignedName(node) {
    if (isClassExpression(node) && !node.name) {
      const staticPropertiesOrClassStaticBlocks = getStaticPropertiesAndClassStaticBlock(node);
      if (some(staticPropertiesOrClassStaticBlocks, isClassNamedEvaluationHelperBlock)) {
        return false;
      }
      const hasTransformableStatics = (shouldTransformPrivateElementsOrClassStaticBlocks || !!(getInternalEmitFlags(node) && 32 /* TransformPrivateStaticElements */)) && some(staticPropertiesOrClassStaticBlocks, (node2) => isClassStaticBlockDeclaration(node2) || isPrivateIdentifierClassElementDeclaration(node2) || shouldTransformInitializers && isInitializedProperty(node2));
      return hasTransformableStatics;
    }
    return false;
  }
  function visitBinaryExpression(node, discarded) {
    if (isDestructuringAssignment(node)) {
      const savedPendingExpressions = pendingExpressions;
      pendingExpressions = void 0;
      node = factory2.updateBinaryExpression(
        node,
        visitNode(node.left, assignmentTargetVisitor, isExpression),
        node.operatorToken,
        visitNode(node.right, visitor, isExpression)
      );
      const expr = some(pendingExpressions) ? factory2.inlineExpressions(compact([...pendingExpressions, node])) : node;
      pendingExpressions = savedPendingExpressions;
      return expr;
    }
    if (isAssignmentExpression(node)) {
      if (isNamedEvaluation(node, isAnonymousClassNeedingAssignedName)) {
        node = transformNamedEvaluation(context, node);
        Debug.assertNode(node, isAssignmentExpression);
      }
      const left = skipOuterExpressions(node.left, 8 /* PartiallyEmittedExpressions */ | 1 /* Parentheses */);
      if (isPrivateIdentifierPropertyAccessExpression(left)) {
        const info = accessPrivateIdentifier2(left.name);
        if (info) {
          return setTextRange(
            setOriginalNode(
              createPrivateIdentifierAssignment(info, left.expression, node.right, node.operatorToken.kind),
              node
            ),
            node
          );
        }
      } else if (shouldTransformSuperInStaticInitializers && currentClassElement && isSuperProperty(node.left) && isStaticPropertyDeclarationOrClassStaticBlock(currentClassElement) && (lexicalEnvironment == null ? void 0 : lexicalEnvironment.data)) {
        const { classConstructor, superClassReference, facts } = lexicalEnvironment.data;
        if (facts & 1 /* ClassWasDecorated */) {
          return factory2.updateBinaryExpression(
            node,
            visitInvalidSuperProperty(node.left),
            node.operatorToken,
            visitNode(node.right, visitor, isExpression)
          );
        }
        if (classConstructor && superClassReference) {
          let setterName = isElementAccessExpression(node.left) ? visitNode(node.left.argumentExpression, visitor, isExpression) : isIdentifier(node.left.name) ? factory2.createStringLiteralFromNode(node.left.name) : void 0;
          if (setterName) {
            let expression = visitNode(node.right, visitor, isExpression);
            if (isCompoundAssignment(node.operatorToken.kind)) {
              let getterName = setterName;
              if (!isSimpleInlineableExpression(setterName)) {
                getterName = factory2.createTempVariable(hoistVariableDeclaration);
                setterName = factory2.createAssignment(getterName, setterName);
              }
              const superPropertyGet = factory2.createReflectGetCall(
                superClassReference,
                getterName,
                classConstructor
              );
              setOriginalNode(superPropertyGet, node.left);
              setTextRange(superPropertyGet, node.left);
              expression = factory2.createBinaryExpression(
                superPropertyGet,
                getNonAssignmentOperatorForCompoundAssignment(node.operatorToken.kind),
                expression
              );
              setTextRange(expression, node);
            }
            const temp = discarded ? void 0 : factory2.createTempVariable(hoistVariableDeclaration);
            if (temp) {
              expression = factory2.createAssignment(temp, expression);
              setTextRange(temp, node);
            }
            expression = factory2.createReflectSetCall(
              superClassReference,
              setterName,
              expression,
              classConstructor
            );
            setOriginalNode(expression, node);
            setTextRange(expression, node);
            if (temp) {
              expression = factory2.createComma(expression, temp);
              setTextRange(expression, node);
            }
            return expression;
          }
        }
      }
    }
    if (isPrivateIdentifierInExpression(node)) {
      return transformPrivateIdentifierInInExpression(node);
    }
    return visitEachChild(node, visitor, context);
  }
  function visitCommaListExpression(node, discarded) {
    const elements = discarded ? visitCommaListElements(node.elements, discardedValueVisitor) : visitCommaListElements(node.elements, visitor, discardedValueVisitor);
    return factory2.updateCommaListExpression(node, elements);
  }
  function visitParenthesizedExpression(node, discarded) {
    const visitorFunc = discarded ? discardedValueVisitor : visitor;
    const expression = visitNode(node.expression, visitorFunc, isExpression);
    return factory2.updateParenthesizedExpression(node, expression);
  }
  function createPrivateIdentifierAssignment(info, receiver, right, operator) {
    receiver = visitNode(receiver, visitor, isExpression);
    right = visitNode(right, visitor, isExpression);
    ensureDynamicThisIfNeeded(receiver);
    if (isCompoundAssignment(operator)) {
      const { readExpression, initializeExpression } = createCopiableReceiverExpr(receiver);
      receiver = initializeExpression || readExpression;
      right = factory2.createBinaryExpression(
        createPrivateIdentifierAccessHelper(info, readExpression),
        getNonAssignmentOperatorForCompoundAssignment(operator),
        right
      );
    }
    setCommentRange(receiver, moveRangePos(receiver, -1));
    switch (info.kind) {
      case "a" /* Accessor */:
        return emitHelpers().createClassPrivateFieldSetHelper(
          receiver,
          info.brandCheckIdentifier,
          right,
          info.kind,
          info.setterName
        );
      case "m" /* Method */:
        return emitHelpers().createClassPrivateFieldSetHelper(
          receiver,
          info.brandCheckIdentifier,
          right,
          info.kind,
          /*f*/
          void 0
        );
      case "f" /* Field */:
        return emitHelpers().createClassPrivateFieldSetHelper(
          receiver,
          info.brandCheckIdentifier,
          right,
          info.kind,
          info.isStatic ? info.variableName : void 0
        );
      case "untransformed":
        return Debug.fail("Access helpers should not be created for untransformed private elements");
      default:
        Debug.assertNever(info, "Unknown private element type");
    }
  }
  function getPrivateInstanceMethodsAndAccessors(node) {
    return filter(node.members, isNonStaticMethodOrAccessorWithPrivateName);
  }
  function getClassFacts(node) {
    var _a;
    let facts = 0 /* None */;
    const original = getOriginalNode(node);
    if (isClassDeclaration(original) && classOrConstructorParameterIsDecorated(legacyDecorators, original)) {
      facts |= 1 /* ClassWasDecorated */;
    }
    if (shouldTransformPrivateElementsOrClassStaticBlocks && (classHasClassThisAssignment(node) || classHasExplicitlyAssignedName(node))) {
      facts |= 2 /* NeedsClassConstructorReference */;
    }
    let containsPublicInstanceFields = false;
    let containsInitializedPublicInstanceFields = false;
    let containsInstancePrivateElements = false;
    let containsInstanceAutoAccessors = false;
    for (const member of node.members) {
      if (isStatic(member)) {
        if (member.name && (isPrivateIdentifier(member.name) || isAutoAccessorPropertyDeclaration(member)) && shouldTransformPrivateElementsOrClassStaticBlocks) {
          facts |= 2 /* NeedsClassConstructorReference */;
        } else if (isAutoAccessorPropertyDeclaration(member) && shouldTransformAutoAccessors === -1 /* True */ && !node.name && !((_a = node.emitNode) == null ? void 0 : _a.classThis)) {
          facts |= 2 /* NeedsClassConstructorReference */;
        }
        if (isPropertyDeclaration(member) || isClassStaticBlockDeclaration(member)) {
          if (shouldTransformThisInStaticInitializers && member.transformFlags & 16384 /* ContainsLexicalThis */) {
            facts |= 8 /* NeedsSubstitutionForThisInClassStaticField */;
            if (!(facts & 1 /* ClassWasDecorated */)) {
              facts |= 2 /* NeedsClassConstructorReference */;
            }
          }
          if (shouldTransformSuperInStaticInitializers && member.transformFlags & 134217728 /* ContainsLexicalSuper */) {
            if (!(facts & 1 /* ClassWasDecorated */)) {
              facts |= 2 /* NeedsClassConstructorReference */ | 4 /* NeedsClassSuperReference */;
            }
          }
        }
      } else if (!hasAbstractModifier(getOriginalNode(member))) {
        if (isAutoAccessorPropertyDeclaration(member)) {
          containsInstanceAutoAccessors = true;
          containsInstancePrivateElements || (containsInstancePrivateElements = isPrivateIdentifierClassElementDeclaration(member));
        } else if (isPrivateIdentifierClassElementDeclaration(member)) {
          containsInstancePrivateElements = true;
          if (resolver.getNodeCheckFlags(member) & 262144 /* ContainsConstructorReference */) {
            facts |= 2 /* NeedsClassConstructorReference */;
          }
        } else if (isPropertyDeclaration(member)) {
          containsPublicInstanceFields = true;
          containsInitializedPublicInstanceFields || (containsInitializedPublicInstanceFields = !!member.initializer);
        }
      }
    }
    const willHoistInitializersToConstructor = shouldTransformInitializersUsingDefine && containsPublicInstanceFields || shouldTransformInitializersUsingSet && containsInitializedPublicInstanceFields || shouldTransformPrivateElementsOrClassStaticBlocks && containsInstancePrivateElements || shouldTransformPrivateElementsOrClassStaticBlocks && containsInstanceAutoAccessors && shouldTransformAutoAccessors === -1 /* True */;
    if (willHoistInitializersToConstructor) {
      facts |= 16 /* WillHoistInitializersToConstructor */;
    }
    return facts;
  }
  function visitExpressionWithTypeArgumentsInHeritageClause(node) {
    var _a;
    const facts = ((_a = lexicalEnvironment == null ? void 0 : lexicalEnvironment.data) == null ? void 0 : _a.facts) || 0 /* None */;
    if (facts & 4 /* NeedsClassSuperReference */) {
      const temp = factory2.createTempVariable(
        hoistVariableDeclaration,
        /*reservedInNestedScopes*/
        true
      );
      getClassLexicalEnvironment().superClassReference = temp;
      return factory2.updateExpressionWithTypeArguments(
        node,
        factory2.createAssignment(
          temp,
          visitNode(node.expression, visitor, isExpression)
        ),
        /*typeArguments*/
        void 0
      );
    }
    return visitEachChild(node, visitor, context);
  }
  function visitInNewClassLexicalEnvironment(node, visitor2) {
    var _a;
    const savedCurrentClassContainer = currentClassContainer;
    const savedPendingExpressions = pendingExpressions;
    const savedLexicalEnvironment = lexicalEnvironment;
    currentClassContainer = node;
    pendingExpressions = void 0;
    startClassLexicalEnvironment();
    const shouldAlwaysTransformPrivateStaticElements = getInternalEmitFlags(node) & 32 /* TransformPrivateStaticElements */;
    if (shouldTransformPrivateElementsOrClassStaticBlocks || shouldAlwaysTransformPrivateStaticElements) {
      const name = getNameOfDeclaration(node);
      if (name && isIdentifier(name)) {
        getPrivateIdentifierEnvironment().data.className = name;
      } else if ((_a = node.emitNode) == null ? void 0 : _a.assignedName) {
        if (isStringLiteral(node.emitNode.assignedName)) {
          if (node.emitNode.assignedName.textSourceNode && isIdentifier(node.emitNode.assignedName.textSourceNode)) {
            getPrivateIdentifierEnvironment().data.className = node.emitNode.assignedName.textSourceNode;
          } else if (isIdentifierText(node.emitNode.assignedName.text, languageVersion)) {
            const prefixName = factory2.createIdentifier(node.emitNode.assignedName.text);
            getPrivateIdentifierEnvironment().data.className = prefixName;
          }
        }
      }
    }
    if (shouldTransformPrivateElementsOrClassStaticBlocks) {
      const privateInstanceMethodsAndAccessors = getPrivateInstanceMethodsAndAccessors(node);
      if (some(privateInstanceMethodsAndAccessors)) {
        getPrivateIdentifierEnvironment().data.weakSetName = createHoistedVariableForClass(
          "instances",
          privateInstanceMethodsAndAccessors[0].name
        );
      }
    }
    const facts = getClassFacts(node);
    if (facts) {
      getClassLexicalEnvironment().facts = facts;
    }
    if (facts & 8 /* NeedsSubstitutionForThisInClassStaticField */) {
      enableSubstitutionForClassStaticThisOrSuperReference();
    }
    const result = visitor2(node, facts);
    endClassLexicalEnvironment();
    Debug.assert(lexicalEnvironment === savedLexicalEnvironment);
    currentClassContainer = savedCurrentClassContainer;
    pendingExpressions = savedPendingExpressions;
    return result;
  }
  function visitClassDeclaration(node) {
    return visitInNewClassLexicalEnvironment(node, visitClassDeclarationInNewClassLexicalEnvironment);
  }
  function visitClassDeclarationInNewClassLexicalEnvironment(node, facts) {
    var _a, _b;
    let pendingClassReferenceAssignment;
    if (facts & 2 /* NeedsClassConstructorReference */) {
      if (shouldTransformPrivateElementsOrClassStaticBlocks && ((_a = node.emitNode) == null ? void 0 : _a.classThis)) {
        getClassLexicalEnvironment().classConstructor = node.emitNode.classThis;
        pendingClassReferenceAssignment = factory2.createAssignment(node.emitNode.classThis, factory2.getInternalName(node));
      } else {
        const temp = factory2.createTempVariable(
          hoistVariableDeclaration,
          /*reservedInNestedScopes*/
          true
   
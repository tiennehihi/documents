leTopLevelAwait */;
    }
    if (node.flags & 256 /* IdentifierHasExtendedUnicodeEscape */) {
      node.transformFlags |= 1024 /* ContainsES2015 */;
    }
    return node;
  }
  function createTempVariable(recordTempVariable, reservedInNestedScopes, prefix, suffix) {
    let flags2 = 1 /* Auto */;
    if (reservedInNestedScopes)
      flags2 |= 8 /* ReservedInNestedScopes */;
    const name = createBaseGeneratedIdentifier("", flags2, prefix, suffix);
    if (recordTempVariable) {
      recordTempVariable(name);
    }
    return name;
  }
  function createLoopVariable(reservedInNestedScopes) {
    let flags2 = 2 /* Loop */;
    if (reservedInNestedScopes)
      flags2 |= 8 /* ReservedInNestedScopes */;
    return createBaseGeneratedIdentifier(
      "",
      flags2,
      /*prefix*/
      void 0,
      /*suffix*/
      void 0
    );
  }
  function createUniqueName(text, flags2 = 0 /* None */, prefix, suffix) {
    Debug.assert(!(flags2 & 7 /* KindMask */), "Argument out of range: flags");
    Debug.assert((flags2 & (16 /* Optimistic */ | 32 /* FileLevel */)) !== 32 /* FileLevel */, "GeneratedIdentifierFlags.FileLevel cannot be set without also setting GeneratedIdentifierFlags.Optimistic");
    return createBaseGeneratedIdentifier(text, 3 /* Unique */ | flags2, prefix, suffix);
  }
  function getGeneratedNameForNode(node, flags2 = 0, prefix, suffix) {
    Debug.assert(!(flags2 & 7 /* KindMask */), "Argument out of range: flags");
    const text = !node ? "" : isMemberName(node) ? formatGeneratedName(
      /*privateName*/
      false,
      prefix,
      node,
      suffix,
      idText
    ) : `generated@${getNodeId(node)}`;
    if (prefix || suffix)
      flags2 |= 16 /* Optimistic */;
    const name = createBaseGeneratedIdentifier(text, 4 /* Node */ | flags2, prefix, suffix);
    name.original = node;
    return name;
  }
  function createBasePrivateIdentifier(escapedText) {
    const node = baseFactory2.createBasePrivateIdentifierNode(81 /* PrivateIdentifier */);
    node.escapedText = escapedText;
    node.transformFlags |= 16777216 /* ContainsClassFields */;
    return node;
  }
  function createPrivateIdentifier(text) {
    if (!startsWith(text, "#"))
      Debug.fail("First character of private identifier must be #: " + text);
    return createBasePrivateIdentifier(escapeLeadingUnderscores(text));
  }
  function createBaseGeneratedPrivateIdentifier(text, autoGenerateFlags, prefix, suffix) {
    const node = createBasePrivateIdentifier(escapeLeadingUnderscores(text));
    setIdentifierAutoGenerate(node, {
      flags: autoGenerateFlags,
      id: nextAutoGenerateId,
      prefix,
      suffix
    });
    nextAutoGenerateId++;
    return node;
  }
  function createUniquePrivateName(text, prefix, suffix) {
    if (text && !startsWith(text, "#"))
      Debug.fail("First character of private identifier must be #: " + text);
    const autoGenerateFlags = 8 /* ReservedInNestedScopes */ | (text ? 3 /* Unique */ : 1 /* Auto */);
    return createBaseGeneratedPrivateIdentifier(text ?? "", autoGenerateFlags, prefix, suffix);
  }
  function getGeneratedPrivateNameForNode(node, prefix, suffix) {
    const text = isMemberName(node) ? formatGeneratedName(
      /*privateName*/
      true,
      prefix,
      node,
      suffix,
      idText
    ) : `#generated@${getNodeId(node)}`;
    const flags2 = prefix || suffix ? 16 /* Optimistic */ : 0 /* None */;
    const name = createBaseGeneratedPrivateIdentifier(text, 4 /* Node */ | flags2, prefix, suffix);
    name.original = node;
    return name;
  }
  function createBaseToken(kind) {
    return baseFactory2.createBaseTokenNode(kind);
  }
  function createToken(token) {
    Debug.assert(token >= 0 /* FirstToken */ && token <= 165 /* LastToken */, "Invalid token");
    Debug.assert(token <= 15 /* FirstTemplateToken */ || token >= 18 /* LastTemplateToken */, "Invalid token. Use 'createTemplateLiteralLikeNode' to create template literals.");
    Debug.assert(token <= 9 /* FirstLiteralToken */ || token >= 15 /* LastLiteralToken */, "Invalid token. Use 'createLiteralLikeNode' to create literals.");
    Debug.assert(token !== 80 /* Identifier */, "Invalid token. Use 'createIdentifier' to create identifiers");
    const node = createBaseToken(token);
    let transformFlags = 0 /* None */;
    switch (token) {
      case 134 /* AsyncKeyword */:
        transformFlags = 256 /* ContainsES2017 */ | 128 /* ContainsES2018 */;
        break;
      case 160 /* UsingKeyword */:
        transformFlags = 4 /* ContainsESNext */;
        break;
      case 125 /* PublicKeyword */:
      case 123 /* PrivateKeyword */:
      case 124 /* ProtectedKeyword */:
      case 148 /* ReadonlyKeyword */:
      case 128 /* AbstractKeyword */:
      case 138 /* DeclareKeyword */:
      case 87 /* ConstKeyword */:
      case 133 /* AnyKeyword */:
      case 150 /* NumberKeyword */:
      case 163 /* BigIntKeyword */:
      case 146 /* NeverKeyword */:
      case 151 /* ObjectKeyword */:
      case 103 /* InKeyword */:
      case 147 /* OutKeyword */:
      case 164 /* OverrideKeyword */:
      case 154 /* StringKeyword */:
      case 136 /* BooleanKeyword */:
      case 155 /* SymbolKeyword */:
      case 116 /* VoidKeyword */:
      case 159 /* UnknownKeyword */:
      case 157 /* UndefinedKeyword */:
        transformFlags = 1 /* ContainsTypeScript */;
        break;
      case 108 /* SuperKeyword */:
        transformFlags = 1024 /* ContainsES2015 */ | 134217728 /* ContainsLexicalSuper */;
        node.flowNode = void 0;
        break;
      case 126 /* StaticKeyword */:
        transformFlags = 1024 /* ContainsES2015 */;
        break;
      case 129 /* AccessorKeyword */:
        transformFlags = 16777216 /* ContainsClassFields */;
        break;
      case 110 /* ThisKeyword */:
        transformFlags = 16384 /* ContainsLexicalThis */;
        node.flowNode = void 0;
        break;
    }
    if (transformFlags) {
      node.transformFlags |= transformFlags;
    }
    return node;
  }
  function createSuper() {
    return createToken(108 /* SuperKeyword */);
  }
  function createThis() {
    return createToken(110 /* ThisKeyword */);
  }
  function createNull() {
    return createToken(106 /* NullKeyword */);
  }
  function createTrue() {
    return createToken(112 /* TrueKeyword */);
  }
  function createFalse() {
    return createToken(97 /* FalseKeyword */);
  }
  function createModifier(kind) {
    return createToken(kind);
  }
  function createModifiersFromModifierFlags(flags2) {
    const result = [];
    if (flags2 & 32 /* Export */)
      result.push(createModifier(95 /* ExportKeyword */));
    if (flags2 & 128 /* Ambient */)
      result.push(createModifier(138 /* DeclareKeyword */));
    if (flags2 & 2048 /* Default */)
      result.push(createModifier(90 /* DefaultKeyword */));
    if (flags2 & 4096 /* Const */)
      result.push(createModifier(87 /* ConstKeyword */));
    if (flags2 & 1 /* Public */)
      result.push(createModifier(125 /* PublicKeyword */));
    if (flags2 & 2 /* Private */)
      result.push(createModifier(123 /* PrivateKeyword */));
    if (flags2 & 4 /* Protected */)
      result.push(createModifier(124 /* ProtectedKeyword */));
    if (flags2 & 64 /* Abstract */)
      result.push(createModifier(128 /* AbstractKeyword */));
    if (flags2 & 256 /* Static */)
      result.push(createModifier(126 /* StaticKeyword */));
    if (flags2 & 16 /* Override */)
      result.push(createModifier(164 /* OverrideKeyword */));
    if (flags2 & 8 /* Readonly */)
      result.push(createModifier(148 /* ReadonlyKeyword */));
    if (flags2 & 512 /* Accessor */)
      result.push(createModifier(129 /* AccessorKeyword */));
    if (flags2 & 1024 /* Async */)
      result.push(createModifier(134 /* AsyncKeyword */));
    if (flags2 & 8192 /* In */)
      result.push(createModifier(103 /* InKeyword */));
    if (flags2 & 16384 /* Out */)
      result.push(createModifier(147 /* OutKeyword */));
    return result.length ? result : void 0;
  }
  function createQualifiedName(left, right) {
    const node = createBaseNode(166 /* QualifiedName */);
    node.left = left;
    node.right = asName(right);
    node.transformFlags |= propagateChildFlags(node.left) | propagateIdentifierNameFlags(node.right);
    node.flowNode = void 0;
    return node;
  }
  function updateQualifiedName(node, left, right) {
    return node.left !== left || node.right !== right ? update(createQualifiedName(left, right), node) : node;
  }
  function createComputedPropertyName(expression) {
    const node = createBaseNode(167 /* ComputedPropertyName */);
    node.expression = parenthesizerRules().parenthesizeExpressionOfComputedPropertyName(expression);
    node.transformFlags |= propagateChildFlags(node.expression) | 1024 /* ContainsES2015 */ | 131072 /* ContainsComputedPropertyName */;
    return node;
  }
  function updateComputedPropertyName(node, expression) {
    return node.expression !== expression ? update(createComputedPropertyName(expression), node) : node;
  }
  function createTypeParameterDeclaration(modifiers, name, constraint, defaultType) {
    const node = createBaseDeclaration(168 /* TypeParameter */);
    node.modifiers = asNodeArray(modifiers);
    node.name = asName(name);
    node.constraint = constraint;
    node.default = defaultType;
    node.transformFlags = 1 /* ContainsTypeScript */;
    node.expression = void 0;
    node.jsDoc = void 0;
    return node;
  }
  function updateTypeParameterDeclaration(node, modifiers, name, constraint, defaultType) {
    return node.modifiers !== modifiers || node.name !== name || node.constraint !== constraint || node.default !== defaultType ? update(createTypeParameterDeclaration(modifiers, name, constraint, defaultType), node) : node;
  }
  function createParameterDeclaration(modifiers, dotDotDotToken, name, questionToken, type, initializer) {
    const node = createBaseDeclaration(169 /* Parameter */);
    node.modifiers = asNodeArray(modifiers);
    node.dotDotDotToken = dotDotDotToken;
    node.name = asName(name);
    node.questionToken = questionToken;
    node.type = type;
    node.initializer = asInitializer(initializer);
    if (isThisIdentifier(node.name)) {
      node.transformFlags = 1 /* ContainsTypeScript */;
    } else {
      node.transformFlags = propagateChildrenFlags(node.modifiers) | propagateChildFlags(node.dotDotDotToken) | propagateNameFlags(node.name) | propagateChildFlags(node.questionToken) | propagateChildFlags(node.initializer) | (node.questionToken ?? node.type ? 1 /* ContainsTypeScript */ : 0 /* None */) | (node.dotDotDotToken ?? node.initializer ? 1024 /* ContainsES2015 */ : 0 /* None */) | (modifiersToFlags(node.modifiers) & 31 /* ParameterPropertyModifier */ ? 8192 /* ContainsTypeScriptClassSyntax */ : 0 /* None */);
    }
    node.jsDoc = void 0;
    return node;
  }
  function updateParameterDeclaration(node, modifiers, dotDotDotToken, name, questionToken, type, initializer) {
    return node.modifiers !== modifiers || node.dotDotDotToken !== dotDotDotToken || node.name !== name || node.questionToken !== questionToken || node.type !== type || node.initializer !== initializer ? update(createParameterDeclaration(modifiers, dotDotDotToken, name, questionToken, type, initializer), node) : node;
  }
  function createDecorator(expression) {
    const node = createBaseNode(170 /* Decorator */);
    node.expression = parenthesizerRules().parenthesizeLeftSideOfAccess(
      expression,
      /*optionalChain*/
      false
    );
    node.transformFlags |= propagateChildFlags(node.expression) | 1 /* ContainsTypeScript */ | 8192 /* ContainsTypeScriptClassSyntax */ | 33554432 /* ContainsDecorators */;
    return node;
  }
  function updateDecorator(node, expression) {
    return node.expression !== expression ? update(createDecorator(expression), node) : node;
  }
  function createPropertySignature(modifiers, name, questionToken, type) {
    const node = createBaseDeclaration(171 /* PropertySignature */);
    node.modifiers = asNodeArray(modifiers);
    node.name = asName(name);
    node.type = type;
    node.questionToken = questionToken;
    node.transformFlags = 1 /* ContainsTypeScript */;
    node.initializer = void 0;
    node.jsDoc = void 0;
    return node;
  }
  function updatePropertySignature(node, modifiers, name, questionToken, type) {
    return node.modifiers !== modifiers || node.name !== name || node.questionToken !== questionToken || node.type !== type ? finishUpdatePropertySignature(createPropertySignature(modifiers, name, questionToken, type), node) : node;
  }
  function finishUpdatePropertySignature(updated, original) {
    if (updated !== original) {
      updated.initializer = original.initializer;
    }
    return update(updated, original);
  }
  function createPropertyDeclaration(modifiers, name, questionOrExclamationToken, type, initializer) {
    const node = createBaseDeclaration(172 /* PropertyDeclaration */);
    node.modifiers = asNodeArray(modifiers);
    node.name = asName(name);
    node.questionToken = questionOrExclamationToken && isQuestionToken(questionOrExclamationToken) ? questionOrExclamationToken : void 0;
    node.exclamationToken = questionOrExclamationToken && isExclamationToken(questionOrExclamationToken) ? questionOrExclamationToken : void 0;
    node.type = type;
    node.initializer = asInitializer(initializer);
    const isAmbient = node.flags & 33554432 /* Ambient */ || modifiersToFlags(node.modifiers) & 128 /* Ambient */;
    node.transformFlags = propagateChildrenFlags(node.modifiers) | propagateNameFlags(node.name) | propagateChildFlags(node.initializer) | (isAmbient || node.questionToken || node.exclamationToken || node.type ? 1 /* ContainsTypeScript */ : 0 /* None */) | (isComputedPropertyName(node.name) || modifiersToFlags(node.modifiers) & 256 /* Static */ && node.initializer ? 8192 /* ContainsTypeScriptClassSyntax */ : 0 /* None */) | 16777216 /* ContainsClassFields */;
    node.jsDoc = void 0;
    return node;
  }
  function updatePropertyDeclaration(node, modifiers, name, questionOrExclamationToken, type, initializer) {
    return node.modifiers !== modifiers || node.name !== name || node.questionToken !== (questionOrExclamationToken !== void 0 && isQuestionToken(questionOrExclamationToken) ? questionOrExclamationToken : void 0) || node.exclamationToken !== (questionOrExclamationToken !== void 0 && isExclamationToken(questionOrExclamationToken) ? questionOrExclamationToken : void 0) || node.type !== type || node.initializer !== initializer ? update(createPropertyDeclaration(modifiers, name, questionOrExclamationToken, type, initializer), node) : node;
  }
  function createMethodSignature(modifiers, name, questionToken, typeParameters, parameters, type) {
    const node = createBaseDeclaration(173 /* MethodSignature */);
    node.modifiers = asNodeArray(modifiers);
    node.name = asName(name);
    node.questionToken = questionToken;
    node.typeParameters = asNodeArray(typeParameters);
    node.parameters = asNodeArray(parameters);
    node.type = type;
    node.transformFlags = 1 /* ContainsTypeScript */;
    node.jsDoc = void 0;
    node.locals = void 0;
    node.nextContainer = void 0;
    node.typeArguments = void 0;
    return node;
  }
  function updateMethodSignature(node, modifiers, name, questionToken, typeParameters, parameters, type) {
    return node.modifiers !== modifiers || node.name !== name || node.questionToken !== questionToken || node.typeParameters !== typeParameters || node.parameters !== parameters || node.type !== type ? finishUpdateBaseSignatureDeclaration(createMethodSignature(modifiers, name, questionToken, typeParameters, parameters, type), node) : node;
  }
  function createMethodDeclaration(modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body) {
    const node = createBaseDeclaration(174 /* MethodDeclaration */);
    node.modifiers = asNodeArray(modifiers);
    node.asteriskToken = asteriskToken;
    node.name = asName(name);
    node.questionToken = questionToken;
    node.exclamationToken = void 0;
    node.typeParameters = asNodeArray(typeParameters);
    node.parameters = createNodeArray(parameters);
    node.type = type;
    node.body = body;
    if (!node.body) {
      node.transformFlags = 1 /* ContainsTypeScript */;
    } else {
      const isAsync = modifiersToFlags(node.modifiers) & 1024 /* Async */;
      const isGenerator = !!node.asteriskToken;
      const isAsyncGenerator = isAsync && isGenerator;
      node.transformFlags = propagateChildrenFlags(node.modifiers) | propagateChildFlags(node.asteriskToken) | propagateNameFlags(node.name) | propagateChildFlags(node.questionToken) | propagateChildrenFlags(node.typeParameters) | propagateChildrenFlags(node.parameters) | propagateChildFlags(node.type) | propagateChildFlags(node.body) & ~67108864 /* ContainsPossibleTopLevelAwait */ | (isAsyncGenerator ? 128 /* ContainsES2018 */ : isAsync ? 256 /* ContainsES2017 */ : isGenerator ? 2048 /* ContainsGenerator */ : 0 /* None */) | (node.questionToken || node.typeParameters || node.type ? 1 /* ContainsTypeScript */ : 0 /* None */) | 1024 /* ContainsES2015 */;
    }
    node.typeArguments = void 0;
    node.jsDoc = void 0;
    node.locals = void 0;
    node.nextContainer = void 0;
    node.flowNode = void 0;
    node.endFlowNode = void 0;
    node.returnFlowNode = void 0;
    return node;
  }
  function updateMethodDeclaration(node, modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body) {
    return node.modifiers !== modifiers || node.asteriskToken !== asteriskToken || node.name !== name || node.questionToken !== questionToken || node.typeParameters !== typeParameters || node.parameters !== parameters || node.type !== type || node.body !== body ? finishUpdateMethodDeclaration(createMethodDeclaration(modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body), node) : node;
  }
  function finishUpdateMeth
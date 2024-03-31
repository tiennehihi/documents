tement(label) {
    const node = createBaseNode(251 /* ContinueStatement */);
    node.label = asName(label);
    node.transformFlags |= propagateChildFlags(node.label) | 4194304 /* ContainsHoistedDeclarationOrCompletion */;
    node.jsDoc = void 0;
    node.flowNode = void 0;
    return node;
  }
  function updateContinueStatement(node, label) {
    return node.label !== label ? update(createContinueStatement(label), node) : node;
  }
  function createBreakStatement(label) {
    const node = createBaseNode(252 /* BreakStatement */);
    node.label = asName(label);
    node.transformFlags |= propagateChildFlags(node.label) | 4194304 /* ContainsHoistedDeclarationOrCompletion */;
    node.jsDoc = void 0;
    node.flowNode = void 0;
    return node;
  }
  function updateBreakStatement(node, label) {
    return node.label !== label ? update(createBreakStatement(label), node) : node;
  }
  function createReturnStatement(expression) {
    const node = createBaseNode(253 /* ReturnStatement */);
    node.expression = expression;
    node.transformFlags |= propagateChildFlags(node.expression) | 128 /* ContainsES2018 */ | 4194304 /* ContainsHoistedDeclarationOrCompletion */;
    node.jsDoc = void 0;
    node.flowNode = void 0;
    return node;
  }
  function updateReturnStatement(node, expression) {
    return node.expression !== expression ? update(createReturnStatement(expression), node) : node;
  }
  function createWithStatement(expression, statement) {
    const node = createBaseNode(254 /* WithStatement */);
    node.expression = expression;
    node.statement = asEmbeddedStatement(statement);
    node.transformFlags |= propagateChildFlags(node.expression) | propagateChildFlags(node.statement);
    node.jsDoc = void 0;
    node.flowNode = void 0;
    return node;
  }
  function updateWithStatement(node, expression, statement) {
    return node.expression !== expression || node.statement !== statement ? update(createWithStatement(expression, statement), node) : node;
  }
  function createSwitchStatement(expression, caseBlock) {
    const node = createBaseNode(255 /* SwitchStatement */);
    node.expression = parenthesizerRules().parenthesizeExpressionForDisallowedComma(expression);
    node.caseBlock = caseBlock;
    node.transformFlags |= propagateChildFlags(node.expression) | propagateChildFlags(node.caseBlock);
    node.jsDoc = void 0;
    node.flowNode = void 0;
    node.possiblyExhaustive = false;
    return node;
  }
  function updateSwitchStatement(node, expression, caseBlock) {
    return node.expression !== expression || node.caseBlock !== caseBlock ? update(createSwitchStatement(expression, caseBlock), node) : node;
  }
  function createLabeledStatement(label, statement) {
    const node = createBaseNode(256 /* LabeledStatement */);
    node.label = asName(label);
    node.statement = asEmbeddedStatement(statement);
    node.transformFlags |= propagateChildFlags(node.label) | propagateChildFlags(node.statement);
    node.jsDoc = void 0;
    node.flowNode = void 0;
    return node;
  }
  function updateLabeledStatement(node, label, statement) {
    return node.label !== label || node.statement !== statement ? update(createLabeledStatement(label, statement), node) : node;
  }
  function createThrowStatement(expression) {
    const node = createBaseNode(257 /* ThrowStatement */);
    node.expression = expression;
    node.transformFlags |= propagateChildFlags(node.expression);
    node.jsDoc = void 0;
    node.flowNode = void 0;
    return node;
  }
  function updateThrowStatement(node, expression) {
    return node.expression !== expression ? update(createThrowStatement(expression), node) : node;
  }
  function createTryStatement(tryBlock, catchClause, finallyBlock) {
    const node = createBaseNode(258 /* TryStatement */);
    node.tryBlock = tryBlock;
    node.catchClause = catchClause;
    node.finallyBlock = finallyBlock;
    node.transformFlags |= propagateChildFlags(node.tryBlock) | propagateChildFlags(node.catchClause) | propagateChildFlags(node.finallyBlock);
    node.jsDoc = void 0;
    node.flowNode = void 0;
    return node;
  }
  function updateTryStatement(node, tryBlock, catchClause, finallyBlock) {
    return node.tryBlock !== tryBlock || node.catchClause !== catchClause || node.finallyBlock !== finallyBlock ? update(createTryStatement(tryBlock, catchClause, finallyBlock), node) : node;
  }
  function createDebuggerStatement() {
    const node = createBaseNode(259 /* DebuggerStatement */);
    node.jsDoc = void 0;
    node.flowNode = void 0;
    return node;
  }
  function createVariableDeclaration(name, exclamationToken, type, initializer) {
    const node = createBaseDeclaration(260 /* VariableDeclaration */);
    node.name = asName(name);
    node.exclamationToken = exclamationToken;
    node.type = type;
    node.initializer = asInitializer(initializer);
    node.transformFlags |= propagateNameFlags(node.name) | propagateChildFlags(node.initializer) | (node.exclamationToken ?? node.type ? 1 /* ContainsTypeScript */ : 0 /* None */);
    node.jsDoc = void 0;
    return node;
  }
  function updateVariableDeclaration(node, name, exclamationToken, type, initializer) {
    return node.name !== name || node.type !== type || node.exclamationToken !== exclamationToken || node.initializer !== initializer ? update(createVariableDeclaration(name, exclamationToken, type, initializer), node) : node;
  }
  function createVariableDeclarationList(declarations, flags2 = 0 /* None */) {
    const node = createBaseNode(261 /* VariableDeclarationList */);
    node.flags |= flags2 & 7 /* BlockScoped */;
    node.declarations = createNodeArray(declarations);
    node.transformFlags |= propagateChildrenFlags(node.declarations) | 4194304 /* ContainsHoistedDeclarationOrCompletion */;
    if (flags2 & 7 /* BlockScoped */) {
      node.transformFlags |= 1024 /* ContainsES2015 */ | 262144 /* ContainsBlockScopedBinding */;
    }
    if (flags2 & 4 /* Using */) {
      node.transformFlags |= 4 /* ContainsESNext */;
    }
    return node;
  }
  function updateVariableDeclarationList(node, declarations) {
    return node.declarations !== declarations ? update(createVariableDeclarationList(declarations, node.flags), node) : node;
  }
  function createFunctionDeclaration(modifiers, asteriskToken, name, typeParameters, parameters, type, body) {
    const node = createBaseDeclaration(262 /* FunctionDeclaration */);
    node.modifiers = asNodeArray(modifiers);
    node.asteriskToken = asteriskToken;
    node.name = asName(name);
    node.typeParameters = asNodeArray(typeParameters);
    node.parameters = createNodeArray(parameters);
    node.type = type;
    node.body = body;
    if (!node.body || modifiersToFlags(node.modifiers) & 128 /* Ambient */) {
      node.transformFlags = 1 /* ContainsTypeScript */;
    } else {
      const isAsync = modifiersToFlags(node.modifiers) & 1024 /* Async */;
      const isGenerator = !!node.asteriskToken;
      const isAsyncGenerator = isAsync && isGenerator;
      node.transformFlags = propagateChildrenFlags(node.modifiers) | propagateChildFlags(node.asteriskToken) | propagateNameFlags(node.name) | propagateChildrenFlags(node.typeParameters) | propagateChildrenFlags(node.parameters) | propagateChildFlags(node.type) | propagateChildFlags(node.body) & ~67108864 /* ContainsPossibleTopLevelAwait */ | (isAsyncGenerator ? 128 /* ContainsES2018 */ : isAsync ? 256 /* ContainsES2017 */ : isGenerator ? 2048 /* ContainsGenerator */ : 0 /* None */) | (node.typeParameters || node.type ? 1 /* ContainsTypeScript */ : 0 /* None */) | 4194304 /* ContainsHoistedDeclarationOrCompletion */;
    }
    node.typeArguments = void 0;
    node.jsDoc = void 0;
    node.locals = void 0;
    node.nextContainer = void 0;
    node.endFlowNode = void 0;
    node.returnFlowNode = void 0;
    return node;
  }
  function updateFunctionDeclaration(node, modifiers, asteriskToken, name, typeParameters, parameters, type, body) {
    return node.modifiers !== modifiers || node.asteriskToken !== asteriskToken || node.name !== name || node.typeParameters !== typeParameters || node.parameters !== parameters || node.type !== type || node.body !== body ? finishUpdateFunctionDeclaration(createFunctionDeclaration(modifiers, asteriskToken, name, typeParameters, parameters, type, body), node) : node;
  }
  function finishUpdateFunctionDeclaration(updated, original) {
    if (updated !== original) {
      if (updated.modifiers === original.modifiers) {
        updated.modifiers = original.modifiers;
      }
    }
    return finishUpdateBaseSignatureDeclaration(updated, original);
  }
  function createClassDeclaration(modifiers, name, typeParameters, heritageClauses, members) {
    const node = createBaseDeclaration(263 /* ClassDeclaration */);
    node.modifiers = asNodeArray(modifiers);
    node.name = asName(name);
    node.typeParameters = asNodeArray(typeParameters);
    node.heritageClauses = asNodeArray(heritageClauses);
    node.members = createNodeArray(members);
    if (modifiersToFlags(node.modifiers) & 128 /* Ambient */) {
      node.transformFlags = 1 /* ContainsTypeScript */;
    } else {
      node.transformFlags |= propagateChildrenFlags(node.modifiers) | propagateNameFlags(node.name) | propagateChildrenFlags(node.typeParameters) | propagateChildrenFlags(node.heritageClauses) | propagateChildrenFlags(node.members) | (node.typeParameters ? 1 /* ContainsTypeScript */ : 0 /* None */) | 1024 /* ContainsES2015 */;
      if (node.transformFlags & 8192 /* ContainsTypeScriptClassSyntax */) {
        node.transformFlags |= 1 /* ContainsTypeScript */;
      }
    }
    node.jsDoc = void 0;
    return node;
  }
  function updateClassDeclaration(node, modifiers, name, typeParameters, heritageClauses, members) {
    return node.modifiers !== modifiers || node.name !== name || node.typeParameters !== typeParameters || node.heritageClauses !== heritageClauses || node.members !== members ? update(createClassDeclaration(modifiers, name, typeParameters, heritageClauses, members), node) : node;
  }
  function createInterfaceDeclaration(modifiers, name, typeParameters, heritageClauses, members) {
    const node = createBaseDeclaration(264 /* InterfaceDeclaration */);
    node.modifiers = asNodeArray(modifiers);
    node.name = asName(name);
    node.typeParameters = asNodeArray(typeParameters);
    node.heritageClauses = asNodeArray(heritageClauses);
    node.members = createNodeArray(members);
    node.transformFlags = 1 /* ContainsTypeScript */;
    node.jsDoc = void 0;
    return node;
  }
  function updateInterfaceDeclaration(node, modifiers, name, typeParameters, heritageClauses, members) {
    return node.modifiers !== modifiers || node.name !== name || node.typeParameters !== typeParameters || node.heritageClauses !== heritageClauses || node.members !== members ? update(createInterfaceDeclaration(modifiers, name, typeParameters, heritageClauses, members), node) : node;
  }
  function createTypeAliasDeclaration(modifiers, name, typeParameters, type) {
    const node = createBaseDeclaration(265 /* TypeAliasDeclaration */);
    node.modifiers = asNodeArray(modifiers);
    node.name = asName(name);
    node.typeParameters = asNodeArray(typeParameters);
    node.type = type;
    node.transformFlags = 1 /* ContainsTypeScript */;
    node.jsDoc = void 0;
    node.locals = void 0;
    node.nextContainer = void 0;
    return node;
  }
  function updateTypeAliasDeclaration(node, modifiers, name, typeParameters, type) {
    return node.modifiers !== modifiers || node.name !== name || node.typeParameters !== typeParameters || node.type !== type ? update(createTypeAliasDeclaration(modifiers, name, typeParameters, type), node) : node;
  }
  function createEnumDeclaration(modifiers, name, members) {
    const node = createBaseDeclaration(266 /* EnumDeclaration */);
    node.modifiers = asNodeArray(modifiers);
    node.name = asName(name);
    node.members = createNodeArray(members);
    node.transformFlags |= propagateChildrenFlags(node.modifiers) | propagateChildFlags(node.name) | propagateChildrenFlags(node.members) | 1 /* ContainsTypeScript */;
    node.transformFlags &= ~67108864 /* ContainsPossibleTopLevelAwait */;
    node.jsDoc = void 0;
    return node;
  }
  function updateEnumDeclaration(node, modifiers, name, members) {
    return node.modifiers !== modifiers || node.name !== name || node.members !== members ? update(createEnumDeclaration(modifiers, name, members), node) : node;
  }
  function createModuleDeclaration(modifiers, name, body, flags2 = 0 /* None */) {
    const node = createBaseDeclaration(267 /* ModuleDeclaration */);
    node.modifiers = asNodeArray(modifiers);
    node.flags |= flags2 & (32 /* Namespace */ | 8 /* NestedNamespace */ | 2048 /* GlobalAugmentation */);
    node.name = name;
    node.body = body;
    if (modifiersToFlags(node.modifiers) & 128 /* Ambient */) {
      node.transformFlags = 1 /* ContainsTypeScript */;
    } else {
      node.transformFlags |= propagateChildrenFlags(node.modifiers) | propagateChildFlags(node.name) | propagateChildFlags(node.body) | 1 /* ContainsTypeScript */;
    }
    node.transformFlags &= ~67108864 /* ContainsPossibleTopLevelAwait */;
    node.jsDoc = void 0;
    node.locals = void 0;
    node.nextContainer = void 0;
    return node;
  }
  function updateModuleDeclaration(node, modifiers, name, body) {
    return node.modifiers !== modifiers || node.name !== name || node.body !== body ? update(createModuleDeclaration(modifiers, name, body, node.flags), node) : node;
  }
  function createModuleBlock(statements) {
    const node = createBaseNode(268 /* ModuleBlock */);
    node.statements = createNodeArray(statements);
    node.transformFlags |= propagateChildrenFlags(node.statements);
    node.jsDoc = void 0;
    return node;
  }
  function updateModuleBlock(node, statements) {
    return node.statements !== statements ? update(createModuleBlock(statements), node) : node;
  }
  function createCaseBlock(clauses) {
    const node = createBaseNode(269 /* CaseBlock */);
    node.clauses = createNodeArray(clauses);
    node.transformFlags |= propagateChildrenFlags(node.clauses);
    node.locals = void 0;
    node.nextContainer = void 0;
    return node;
  }
  function updateCaseBlock(node, clauses) {
    return node.clauses !== clauses ? update(createCaseBlock(clauses), node) : node;
  }
  function createNamespaceExportDeclaration(name) {
    const node = createBaseDeclaration(270 /* NamespaceExportDeclaration */);
    node.name = asName(name);
    node.transformFlags |= propagateIdentifierNameFlags(node.name) | 1 /* ContainsTypeScript */;
    node.modifiers = void 0;
    node.jsDoc = void 0;
    return node;
  }
  function updateNamespaceExportDeclaration(node, name) {
    return node.name !== name ? finishUpdateNamespaceExportDeclaration(createNamespaceExportDeclaration(name), node) : node;
  }
  function finishUpdateNamespaceExportDeclaration(updated, original) {
    if (updated !== original) {
      updated.modifiers = original.modifiers;
    }
    return update(updated, original);
  }
  function createImportEqualsDeclaration(modifiers, isTypeOnly, name, moduleReference) {
    const node = createBaseDeclaration(271 /* ImportEqualsDeclaration */);
    node.modifiers = asNodeArray(modifiers);
    node.name = asName(name);
    node.isTypeOnly = isTypeOnly;
    node.moduleReference = moduleReference;
    node.transformFlags |= propagateChildrenFlags(node.modifiers) | propagateIdentifierNameFlags(node.name) | propagateChildFlags(node.moduleReference);
    if (!isExternalModuleReference(node.moduleReference)) {
      node.transformFlags |= 1 /* ContainsTypeScript */;
    }
    node.transformFlags &= ~67108864 /* ContainsPossibleTopLevelAwait */;
    node.jsDoc = void 0;
    return node;
  }
  function updateImportEqualsDeclaration(node, modifiers, isTypeOnly, name, moduleReference) {
    return node.modifiers !== modifiers || node.isTypeOnly !== isTypeOnly || node.name !== name || node.moduleReference !== moduleReference ? update(createImportEqualsDeclaration(modifiers, isTypeOnly, name, moduleReference), node) : node;
  }
  function createImportDeclaration(modifiers, importClause, moduleSpecifier, attributes) {
    const node = createBaseNode(272 /* ImportDeclaration */);
    node.modifiers = asNodeArray(modifiers);
    node.importClause = importClause;
    node.moduleSpecifier = moduleSpecifier;
    node.attributes = node.assertClause = attributes;
    node.transformFlags |= propagateChildFlags(node.importClause) | propagateChildFlags(node.moduleSpecifier);
    node.transformFlags &= ~67108864 /* ContainsPossibleTopLevelAwait */;
    node.jsDoc = void 0;
    return node;
  }
  function updateImportDeclaration(node, modifiers, importClause, moduleSpecifier, attributes) {
    return node.modifiers !== modifiers || node.importClause !== importClause || node.moduleSpecifier !== moduleSpecifier || node.attributes !== attributes ? update(createImportDeclaration(modifiers, importClause, moduleSpecifier, attributes), node) : node;
  }
  function createImportClause(isTypeOnly, name, namedBindings) {
    const node = createBaseDeclaration(273 /* ImportClause */);
    node.isTypeOnly = isTypeOnly;
    node.name = name;
    node.namedBindings = namedBindings;
    node.transformFlags |= propagateChildFlags(node.name) | propagateChildFlags(node.namedBindings);
    if (isTypeOnly) {
      node.transformFlags |= 1 /* ContainsTypeScript */;
    }
    node.transformFlags &= ~67108864 /* ContainsPossibleTopLevelAwait */;
    return node;
  }
  function updateImportClause(node, isTypeOnly, name, namedBindings) {
    return node.isTypeOnly !== isTypeOnly || node.name !== name || node.namedBindings !== namedBindings ? update(createImportClause(isTypeOnly, name, namedBindings), node) : node;
  }
  function createAssertClause(elements, multiLine) {
    const node = createBaseNode(300 /* AssertClause */);
    node.elements = createNodeArray(elements);
    node.multiLine = multiLine;
    node.token = 132 /* AssertKeyword */;
    node.transformFlags |= 4 /* ContainsESNext */;
    return node;
  }
  function updateAssertClause(node, elements, multiLine) {
    return node.elements !== elements || node.multiLine !== multiLine ? update(createAssertClause(elements, multiLine), node) : node;
  }
  function createAssertEntry(name, value) {
    const node = createBaseNode(301 /* AssertEntry */);
    node.name = name;
    node.value = value;
    node.transformFlags |= 4 /* ContainsESNext */;
    return node;
  }
  function updateAssertEntry(node, name, value) {
    return node.name !== name || node.value !== value ? update(createAssertEntry(name, value), node) : node;
  }
  function createImportTypeAssertionContainer(clause, multiLine) {
    const node = createBaseNode(302 /* ImportTypeAssertionContainer */);
    node.assertClause = clause;
    node.multiLine = multiLine;
    return node;
  }
  function updateImportTypeAssertionContainer(node, clause, multiLine) {
    return node.assertClause !== clause || node.multiLine !== multiLine ? update(createImportTypeAssertionContainer(clause, multiLine), node) : node;
  }
  function createImportAttributes(elements, multiLine, token) {
    const node = createBaseNode(300 /* ImportAttributes */);
    node.token = token ?? 118 /* WithKeyword */;
    node.elements = createNodeArray(elements);
    node.multiLine = multiLine;
    node.transformFlags |= 4 /* ContainsESNext */;
    return node;
  }
  function updateImportAttributes(node, elements, multiLine) {
    return node.elements !== elements || node.multiLine !== multiLine ? update(createImportAttributes(elements, multiLine, node.token), node) : node;
  }
  function createImportAttribute(name, value) {
    const node = createBaseNode(301 /* ImportAttribute */);
    node.name = name;
    node.value = value;
    node.transformFlags |= 4 /* ContainsESNext */;
    retu
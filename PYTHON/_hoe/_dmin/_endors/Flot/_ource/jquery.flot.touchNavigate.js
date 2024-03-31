wedComma(initializer);
    node.transformFlags |= propagateNameFlags(node.name) | propagateChildFlags(node.initializer);
    node.modifiers = void 0;
    node.questionToken = void 0;
    node.exclamationToken = void 0;
    node.jsDoc = void 0;
    return node;
  }
  function updatePropertyAssignment(node, name, initializer) {
    return node.name !== name || node.initializer !== initializer ? finishUpdatePropertyAssignment(createPropertyAssignment(name, initializer), node) : node;
  }
  function finishUpdatePropertyAssignment(updated, original) {
    if (updated !== original) {
      updated.modifiers = original.modifiers;
      updated.questionToken = original.questionToken;
      updated.exclamationToken = original.exclamationToken;
    }
    return update(updated, original);
  }
  function createShorthandPropertyAssignment(name, objectAssignmentInitializer) {
    const node = createBaseDeclaration(304 /* ShorthandPropertyAssignment */);
    node.name = asName(name);
    node.objectAssignmentInitializer = objectAssignmentInitializer && parenthesizerRules().parenthesizeExpressionForDisallowedComma(objectAssignmentInitializer);
    node.transformFlags |= propagateIdentifierNameFlags(node.name) | propagateChildFlags(node.objectAssignmentInitializer) | 1024 /* ContainsES2015 */;
    node.equalsToken = void 0;
    node.modifiers = void 0;
    node.questionToken = void 0;
    node.exclamationToken = void 0;
    node.jsDoc = void 0;
    return node;
  }
  function updateShorthandPropertyAssignment(node, name, objectAssignmentInitializer) {
    return node.name !== name || node.objectAssignmentInitializer !== objectAssignmentInitializer ? finishUpdateShorthandPropertyAssignment(createShorthandPropertyAssignment(name, objectAssignmentInitializer), node) : node;
  }
  function finishUpdateShorthandPropertyAssignment(updated, original) {
    if (updated !== original) {
      updated.modifiers = original.modifiers;
      updated.questionToken = original.questionToken;
      updated.exclamationToken = original.exclamationToken;
      updated.equalsToken = original.equalsToken;
    }
    return update(updated, original);
  }
  function createSpreadAssignment(expression) {
    const node = createBaseDeclaration(305 /* SpreadAssignment */);
    node.expression = parenthesizerRules().parenthesizeExpressionForDisallowedComma(expression);
    node.transformFlags |= propagateChildFlags(node.expression) | 128 /* ContainsES2018 */ | 65536 /* ContainsObjectRestOrSpread */;
    node.jsDoc = void 0;
    return node;
  }
  function updateSpreadAssignment(node, expression) {
    return node.expression !== expression ? update(createSpreadAssignment(expression), node) : node;
  }
  function createEnumMember(name, initializer) {
    const node = createBaseDeclaration(306 /* EnumMember */);
    node.name = asName(name);
    node.initializer = initializer && parenthesizerRules().parenthesizeExpressionForDisallowedComma(initializer);
    node.transformFlags |= propagateChildFlags(node.name) | propagateChildFlags(node.initializer) | 1 /* ContainsTypeScript */;
    node.jsDoc = void 0;
    return node;
  }
  function updateEnumMember(node, name, initializer) {
    return node.name !== name || node.initializer !== initializer ? update(createEnumMember(name, initializer), node) : node;
  }
  function createSourceFile2(statements, endOfFileToken, flags2) {
    const node = baseFactory2.createBaseSourceFileNode(312 /* SourceFile */);
    node.statements = createNodeArray(statements);
    node.endOfFileToken = endOfFileToken;
    node.flags |= flags2;
    node.text = "";
    node.fileName = "";
    node.path = "";
    node.resolvedPath = "";
    node.originalFileName = "";
    node.languageVersion = 0;
    node.languageVariant = 0;
    node.scriptKind = 0;
    node.isDeclarationFile = false;
    node.hasNoDefaultLib = false;
    node.transformFlags |= propagateChildrenFlags(node.statements) | propagateChildFlags(node.endOfFileToken);
    node.locals = void 0;
    node.nextContainer = void 0;
    node.endFlowNode = void 0;
    node.nodeCount = 0;
    node.identifierCount = 0;
    node.symbolCount = 0;
    node.parseDiagnostics = void 0;
    node.bindDiagnostics = void 0;
    node.bindSuggestionDiagnostics = void 0;
    node.lineMap = void 0;
    node.externalModuleIndicator = void 0;
    node.setExternalModuleIndicator = void 0;
    node.pragmas = void 0;
    node.checkJsDirective = void 0;
    node.referencedFiles = void 0;
    node.typeReferenceDirectives = void 0;
    node.libReferenceDirectives = void 0;
    node.amdDependencies = void 0;
    node.commentDirectives = void 0;
    node.identifiers = void 0;
    node.packageJsonLocations = void 0;
    node.packageJsonScope = void 0;
    node.imports = void 0;
    node.moduleAugmentations = void 0;
    node.ambientModuleNames = void 0;
    node.classifiableNames = void 0;
    node.impliedNodeFormat = void 0;
    return node;
  }
  function createRedirectedSourceFile(redirectInfo) {
    const node = Object.create(redirectInfo.redirectTarget);
    Object.defineProperties(node, {
      id: {
        get() {
          return this.redirectInfo.redirectTarget.id;
        },
        set(value) {
          this.redirectInfo.redirectTarget.id = value;
        }
      },
      symbol: {
        get() {
          return this.redirectInfo.redirectTarget.symbol;
        },
        set(value) {
          this.redirectInfo.redirectTarget.symbol = value;
        }
      }
    });
    node.redirectInfo = redirectInfo;
    return node;
  }
  function cloneRedirectedSourceFile(source) {
    const node = createRedirectedSourceFile(source.redirectInfo);
    node.flags |= source.flags & ~16 /* Synthesized */;
    node.fileName = source.fileName;
    node.path = source.path;
    node.resolvedPath = source.resolvedPath;
    node.originalFileName = source.originalFileName;
    node.packageJsonLocations = source.packageJsonLocations;
    node.packageJsonScope = source.packageJsonScope;
    node.emitNode = void 0;
    return node;
  }
  function cloneSourceFileWorker(source) {
    const node = baseFactory2.createBaseSourceFileNode(312 /* SourceFile */);
    node.flags |= source.flags & ~16 /* Synthesized */;
    for (const p in source) {
      if (hasProperty(node, p) || !hasProperty(source, p)) {
        continue;
      }
      if (p === "emitNode") {
        node.emitNode = void 0;
        continue;
      }
      node[p] = source[p];
    }
    return node;
  }
  function cloneSourceFile(source) {
    const node = source.redirectInfo ? cloneRedirectedSourceFile(source) : cloneSourceFileWorker(source);
    setOriginal(node, source);
    return node;
  }
  function cloneSourceFileWithChanges(source, statements, isDeclarationFile, referencedFiles, typeReferences, hasNoDefaultLib, libReferences) {
    const node = cloneSourceFile(source);
    node.statements = createNodeArray(statements);
    node.isDeclarationFile = isDeclarationFile;
    node.referencedFiles = referencedFiles;
    node.typeReferenceDirectives = typeReferences;
    node.hasNoDefaultLib = hasNoDefaultLib;
    node.libReferenceDirectives = libReferences;
    node.transformFlags = propagateChildrenFlags(node.statements) | propagateChildFlags(node.endOfFileToken);
    return node;
  }
  function updateSourceFile(node, statements, isDeclarationFile = node.isDeclarationFile, referencedFiles = node.referencedFiles, typeReferenceDirectives = node.typeReferenceDirectives, hasNoDefaultLib = node.hasNoDefaultLib, libReferenceDirectives = node.libReferenceDirectives) {
    return node.statements !== statements || node.isDeclarationFile !== isDeclarationFile || node.referencedFiles !== referencedFiles || node.typeReferenceDirectives !== typeReferenceDirectives || node.hasNoDefaultLib !== hasNoDefaultLib || node.libReferenceDirectives !== libReferenceDirectives ? update(cloneSourceFileWithChanges(node, statements, isDeclarationFile, referencedFiles, typeReferenceDirectives, hasNoDefaultLib, libReferenceDirectives), node) : node;
  }
  function createBundle(sourceFiles, prepends = emptyArray) {
    const node = createBaseNode(313 /* Bundle */);
    node.prepends = prepends;
    node.sourceFiles = sourceFiles;
    node.syntheticFileReferences = void 0;
    node.syntheticTypeReferences = void 0;
    node.syntheticLibReferences = void 0;
    node.hasNoDefaultLib = void 0;
    return node;
  }
  function updateBundle(node, sourceFiles, prepends = emptyArray) {
    return node.sourceFiles !== sourceFiles || node.prepends !== prepends ? update(createBundle(sourceFiles, prepends), node) : node;
  }
  function createUnparsedSource(prologues, syntheticReferences, texts) {
    const node = createBaseNode(314 /* UnparsedSource */);
    node.prologues = prologues;
    node.syntheticReferences = syntheticReferences;
    node.texts = texts;
    node.fileName = "";
    node.text = "";
    node.referencedFiles = emptyArray;
    node.libReferenceDirectives = emptyArray;
    node.getLineAndCharacterOfPosition = (pos) => getLineAndCharacterOfPosition(node, pos);
    return node;
  }
  function createBaseUnparsedNode(kind, data) {
    const node = createBaseNode(kind);
    node.data = data;
    return node;
  }
  function createUnparsedPrologue(data) {
    return createBaseUnparsedNode(307 /* UnparsedPrologue */, data);
  }
  function createUnparsedPrepend(data, texts) {
    const node = createBaseUnparsedNode(308 /* UnparsedPrepend */, data);
    node.texts = texts;
    return node;
  }
  function createUnparsedTextLike(data, internal) {
    return createBaseUnparsedNode(internal ? 310 /* UnparsedInternalText */ : 309 /* UnparsedText */, data);
  }
  function createUnparsedSyntheticReference(section) {
    const node = createBaseNode(311 /* UnparsedSyntheticReference */);
    node.data = section.data;
    node.section = section;
    return node;
  }
  function createInputFiles() {
    const node = createBaseNode(315 /* InputFiles */);
    node.javascriptText = "";
    node.declarationText = "";
    return node;
  }
  function createSyntheticExpression(type, isSpread = false, tupleNameSource) {
    const node = createBaseNode(237 /* SyntheticExpression */);
    node.type = type;
    node.isSpread = isSpread;
    node.tupleNameSource = tupleNameSource;
    return node;
  }
  function createSyntaxList(children) {
    const node = createBaseNode(358 /* SyntaxList */);
    node._children = children;
    return node;
  }
  function createNotEmittedStatement(original) {
    const node = createBaseNode(359 /* NotEmittedStatement */);
    node.original = original;
    setTextRange(node, original);
    return node;
  }
  function createPartiallyEmittedExpression(expression, original) {
    const node = createBaseNode(360 /* PartiallyEmittedExpression */);
    node.expression = expression;
    node.original = original;
    node.transformFlags |= propagateChildFlags(node.expression) | 1 /* ContainsTypeScript */;
    setTextRange(node, original);
    return node;
  }
  function updatePartiallyEmittedExpression(node, expression) {
    return node.expression !== expression ? update(createPartiallyEmittedExpression(expression, node.original), node) : node;
  }
  function flattenCommaElements(node) {
    if (nodeIsSynthesized(node) && !isParseTreeNode(node) && !node.original && !node.emitNode && !node.id) {
      if (isCommaListExpression(node)) {
        return node.elements;
      }
      if (isBinaryExpression(node) && isCommaToken(node.operatorToken)) {
        return [node.left, node.right];
      }
    }
    return node;
  }
  function createCommaListExpression(elements) {
    const node = createBaseNode(361 /* CommaListExpression */);
    node.elements = createNodeArray(sameFlatMap(elements, flattenCommaElements));
    node.transformFlags |= propagateChildrenFlags(node.elements);
    return node;
  }
  function updateCommaListExpression(node, elements) {
    return node.elements !== elements ? update(createCommaListExpression(elements), node) : node;
  }
  function createSyntheticReferenceExpression(expression, thisArg) {
    const node = createBaseNode(362 /* SyntheticReferenceExpression */);
    node.expression = expression;
    node.thisArg = thisArg;
    node.transformFlags |= propagateChildFlags(node.expression) | propagateChildFlags(node.thisArg);
    return node;
  }
  function updateSyntheticReferenceExpression(node, expression, thisArg) {
    return node.expression !== expression || node.thisArg !== thisArg ? update(createSyntheticReferenceExpression(expression, thisArg), node) : node;
  }
  function cloneGeneratedIdentifier(node) {
    const clone2 = createBaseIdentifier(node.escapedText);
    clone2.flags |= node.flags & ~16 /* Synthesized */;
    clone2.transformFlags = node.transformFlags;
    setOriginal(clone2, node);
    setIdentifierAutoGenerate(clone2, { ...node.emitNode.autoGenerate });
    return clone2;
  }
  function cloneIdentifier(node) {
    const clone2 = createBaseIdentifier(node.escapedText);
    clone2.flags |= node.flags & ~16 /* Synthesized */;
    clone2.jsDoc = node.jsDoc;
    clone2.flowNode = node.flowNode;
    clone2.symbol = node.symbol;
    clone2.transformFlags = node.transformFlags;
    setOriginal(clone2, node);
    const typeArguments = getIdentifierTypeArguments(node);
    if (typeArguments)
      setIdentifierTypeArguments(clone2, typeArguments);
    return clone2;
  }
  function cloneGeneratedPrivateIdentifier(node) {
    const clone2 = createBas
ndardPrologueEnd === 0) {
        left.splice(0, 0, ...declarations.slice(0, rightStandardPrologueEnd));
      } else {
        const leftPrologues = /* @__PURE__ */ new Map();
        for (let i = 0; i < leftStandardPrologueEnd; i++) {
          const leftPrologue = statements[i];
          leftPrologues.set(leftPrologue.expression.text, true);
        }
        for (let i = rightStandardPrologueEnd - 1; i >= 0; i--) {
          const rightPrologue = declarations[i];
          if (!leftPrologues.has(rightPrologue.expression.text)) {
            left.unshift(rightPrologue);
          }
        }
      }
    }
    if (isNodeArray(statements)) {
      return setTextRange(createNodeArray(left, statements.hasTrailingComma), statements);
    }
    return statements;
  }
  function replaceModifiers(node, modifiers) {
    let modifierArray;
    if (typeof modifiers === "number") {
      modifierArray = createModifiersFromModifierFlags(modifiers);
    } else {
      modifierArray = modifiers;
    }
    return isTypeParameterDeclaration(node) ? updateTypeParameterDeclaration(node, modifierArray, node.name, node.constraint, node.default) : isParameter(node) ? updateParameterDeclaration(node, modifierArray, node.dotDotDotToken, node.name, node.questionToken, node.type, node.initializer) : isConstructorTypeNode(node) ? updateConstructorTypeNode1(node, modifierArray, node.typeParameters, node.parameters, node.type) : isPropertySignature(node) ? updatePropertySignature(node, modifierArray, node.name, node.questionToken, node.type) : isPropertyDeclaration(node) ? updatePropertyDeclaration(node, modifierArray, node.name, node.questionToken ?? node.exclamationToken, node.type, node.initializer) : isMethodSignature(node) ? updateMethodSignature(node, modifierArray, node.name, node.questionToken, node.typeParameters, node.parameters, node.type) : isMethodDeclaration(node) ? updateMethodDeclaration(node, modifierArray, node.asteriskToken, node.name, node.questionToken, node.typeParameters, node.parameters, node.type, node.body) : isConstructorDeclaration(node) ? updateConstructorDeclaration(node, modifierArray, node.parameters, node.body) : isGetAccessorDeclaration(node) ? updateGetAccessorDeclaration(node, modifierArray, node.name, node.parameters, node.type, node.body) : isSetAccessorDeclaration(node) ? updateSetAccessorDeclaration(node, modifierArray, node.name, node.parameters, node.body) : isIndexSignatureDeclaration(node) ? updateIndexSignature(node, modifierArray, node.parameters, node.type) : isFunctionExpression(node) ? updateFunctionExpression(node, modifierArray, node.asteriskToken, node.name, node.typeParameters, node.parameters, node.type, node.body) : isArrowFunction(node) ? updateArrowFunction(node, modifierArray, node.typeParameters, node.parameters, node.type, node.equalsGreaterThanToken, node.body) : isClassExpression(node) ? updateClassExpression(node, modifierArray, node.name, node.typeParameters, node.heritageClauses, node.members) : isVariableStatement(node) ? updateVariableStatement(node, modifierArray, node.declarationList) : isFunctionDeclaration(node) ? updateFunctionDeclaration(node, modifierArray, node.asteriskToken, node.name, node.typeParameters, node.parameters, node.type, node.body) : isClassDeclaration(node) ? updateClassDeclaration(node, modifierArray, node.name, node.typeParameters, node.heritageClauses, node.members) : isInterfaceDeclaration(node) ? updateInterfaceDeclaration(node, modifierArray, node.name, node.typeParameters, node.heritageClauses, node.members) : isTypeAliasDeclaration(node) ? updateTypeAliasDeclaration(node, modifierArray, node.name, node.typeParameters, node.type) : isEnumDeclaration(node) ? updateEnumDeclaration(node, modifierArray, node.name, node.members) : isModuleDeclaration(node) ? updateModuleDeclaration(node, modifierArray, node.name, node.body) : isImportEqualsDeclaration(node) ? updateImportEqualsDeclaration(node, modifierArray, node.isTypeOnly, node.name, node.moduleReference) : isImportDeclaration(node) ? updateImportDeclaration(node, modifierArray, node.importClause, node.moduleSpecifier, node.attributes) : isExportAssignment(node) ? updateExportAssignment(node, modifierArray, node.expression) : isExportDeclaration(node) ? updateExportDeclaration(node, modifierArray, node.isTypeOnly, node.exportClause, node.moduleSpecifier, node.attributes) : Debug.assertNever(node);
  }
  function replaceDecoratorsAndModifiers(node, modifierArray) {
    return isParameter(node) ? updateParameterDeclaration(node, modifierArray, node.dotDotDotToken, node.name, node.questionToken, node.type, node.initializer) : isPropertyDeclaration(node) ? updatePropertyDeclaration(node, modifierArray, node.name, node.questionToken ?? node.exclamationToken, node.type, node.initializer) : isMethodDeclaration(node) ? updateMethodDeclaration(node, modifierArray, node.asteriskToken, node.name, node.questionToken, node.typeParameters, node.parameters, node.type, node.body) : isGetAccessorDeclaration(node) ? updateGetAccessorDeclaration(node, modifierArray, node.name, node.parameters, node.type, node.body) : isSetAccessorDeclaration(node) ? updateSetAccessorDeclaration(node, modifierArray, node.name, node.parameters, node.body) : isClassExpression(node) ? updateClassExpression(node, modifierArray, node.name, node.typeParameters, node.heritageClauses, node.members) : isClassDeclaration(node) ? updateClassDeclaration(node, modifierArray, node.name, node.typeParameters, node.heritageClauses, node.members) : Debug.assertNever(node);
  }
  function replacePropertyName(node, name) {
    switch (node.kind) {
      case 177 /* GetAccessor */:
        return updateGetAccessorDeclaration(node, node.modifiers, name, node.parameters, node.type, node.body);
      case 178 /* SetAccessor */:
        return updateSetAccessorDeclaration(node, node.modifiers, name, node.parameters, node.body);
      case 174 /* MethodDeclaration */:
        return updateMethodDeclaration(node, node.modifiers, node.asteriskToken, name, node.questionToken, node.typeParameters, node.parameters, node.type, node.body);
      case 173 /* MethodSignature */:
        return updateMethodSignature(node, node.modifiers, name, node.questionToken, node.typeParameters, node.parameters, node.type);
      case 172 /* PropertyDeclaration */:
        return updatePropertyDeclaration(node, node.modifiers, name, node.questionToken ?? node.exclamationToken, node.type, node.initializer);
      case 171 /* PropertySignature */:
        return updatePropertySignature(node, node.modifiers, name, node.questionToken, node.type);
      case 303 /* PropertyAssignment */:
        return updatePropertyAssignment(node, name, node.initializer);
    }
  }
  function asNodeArray(array) {
    return array ? createNodeArray(array) : void 0;
  }
  function asName(name) {
    return typeof name === "string" ? createIdentifier(name) : name;
  }
  function asExpression(value) {
    return typeof value === "string" ? createStringLiteral(value) : typeof value === "number" ? createNumericLiteral(value) : typeof value === "boolean" ? value ? createTrue() : createFalse() : value;
  }
  function asInitializer(node) {
    return node && parenthesizerRules().parenthesizeExpressionForDisallowedComma(node);
  }
  function asToken(value) {
    return typeof value === "number" ? createToken(value) : value;
  }
  function asEmbeddedStatement(statement) {
    return statement && isNotEmittedStatement(statement) ? setTextRange(setOriginal(createEmptyStatement(), statement), statement) : statement;
  }
  function asVariableDeclaration(variableDeclaration) {
    if (typeof variableDeclaration === "string" || variableDeclaration && !isVariableDeclaration(variableDeclaration)) {
      return createVariableDeclaration(
        variableDeclaration,
        /*exclamationToken*/
        void 0,
        /*type*/
        void 0,
        /*initializer*/
        void 0
      );
    }
    return variableDeclaration;
  }
  function update(updated, original) {
    if (updated !== original) {
      setOriginal(updated, original);
      setTextRange(updated, original);
    }
    return updated;
  }
}
function getDefaultTagNameForKind(kind) {
  switch (kind) {
    case 351 /* JSDocTypeTag */:
      return "type";
    case 349 /* JSDocReturnTag */:
      return "returns";
    case 350 /* JSDocThisTag */:
      return "this";
    case 347 /* JSDocEnumTag */:
      return "enum";
    case 337 /* JSDocAuthorTag */:
      return "author";
    case 339 /* JSDocClassTag */:
      return "class";
    case 340 /* JSDocPublicTag */:
      return "public";
    case 341 /* JSDocPrivateTag */:
      return "private";
    case 342 /* JSDocProtectedTag */:
      return "protected";
    case 343 /* JSDocReadonlyTag */:
      return "readonly";
    case 344 /* JSDocOverrideTag */:
      return "override";
    case 352 /* JSDocTemplateTag */:
      return "template";
    case 353 /* JSDocTypedefTag */:
      return "typedef";
    case 348 /* JSDocParameterTag */:
      return "param";
    case 355 /* JSDocPropertyTag */:
      return "prop";
    case 345 /* JSDocCallbackTag */:
      return "callback";
    case 346 /* JSDocOverloadTag */:
      return "overload";
    case 335 /* JSDocAugmentsTag */:
      return "augments";
    case 336 /* JSDocImplementsTag */:
      return "implements";
    default:
      return Debug.fail(`Unsupported kind: ${Debug.formatSyntaxKind(kind)}`);
  }
}
var rawTextScanner;
var invalidValueSentinel = {};
function getCookedText(kind, rawText) {
  if (!rawTextScanner) {
    rawTextScanner = createScanner(
      99 /* Latest */,
      /*skipTrivia*/
      false,
      0 /* Standard */
    );
  }
  switch (kind) {
    case 15 /* NoSubstitutionTemplateLiteral */:
      rawTextScanner.setText("`" + rawText + "`");
      break;
    case 16 /* TemplateHead */:
      rawTextScanner.setText("`" + rawText + "${");
      break;
    case 17 /* TemplateMiddle */:
      rawTextScanner.setText("}" + rawText + "${");
      break;
    case 18 /* TemplateTail */:
      rawTextScanner.setText("}" + rawText + "`");
      break;
  }
  let token = rawTextScanner.scan();
  if (token === 20 /* CloseBraceToken */) {
    token = rawTextScanner.reScanTemplateToken(
      /*isTaggedTemplate*/
      false
    );
  }
  if (rawTextScanner.isUnterminated()) {
    rawTextScanner.setText(void 0);
    return invalidValueSentinel;
  }
  let tokenValue;
  switch (token) {
    case 15 /* NoSubstitutionTemplateLiteral */:
    case 16 /* TemplateHead */:
    case 17 /* TemplateMiddle */:
    case 18 /* TemplateTail */:
      tokenValue = rawTextScanner.getTokenValue();
      break;
  }
  if (tokenValue === void 0 || rawTextScanner.scan() !== 1 /* EndOfFileToken */) {
    rawTextScanner.setText(void 0);
    return invalidValueSentinel;
  }
  rawTextScanner.setText(void 0);
  return tokenValue;
}
function propagateNameFlags(node) {
  return node && isIdentifier(node) ? propagateIdentifierNameFlags(node) : propagateChildFlags(node);
}
function propagateIdentifierNameFlags(node) {
  return propagateChildFlags(node) & ~67108864 /* ContainsPossibleTopLevelAwait */;
}
function propagatePropertyNameFlagsOfChild(node, transformFlags) {
  return transformFlags | node.transformFlags & 134234112 /* PropertyNamePropagatingFlags */;
}
function propagateChildFlags(child) {
  if (!child)
    return 0 /* None */;
  const childFlags = child.transformFlags & ~getTransformFlagsSubtreeExclusions(child.kind);
  return isNamedDeclaration(child) && isPropertyName(child.name) ? propagatePropertyNameFlagsOfChild(child.name, childFlags) : childFlags;
}
function propagateChildrenFlags(children) {
  return children ? children.transformFlags : 0 /* None */;
}
function aggregateChildrenFlags(children) {
  let subtreeFlags = 0 /* None */;
  for (const child of children) {
    subtreeFlags |= propagateChildFlags(child);
  }
  children.transformFlags = subtreeFlags;
}
function getTransformFlagsSubtreeExclusions(kind) {
  if (kind >= 182 /* FirstTypeNode */ && kind <= 205 /* LastTypeNode */) {
    return -2 /* TypeExcludes */;
  }
  switch (kind) {
    case 213 /* CallExpression */:
    case 214 /* NewExpression */:
    case 209 /* ArrayLiteralExpression */:
      return -2147450880 /* ArrayLiteralOrCallOrNewExcludes */;
    case 267 /* ModuleDeclaration */:
      return -1941676032 /* ModuleExcludes */;
    case 169 /* Parameter */:
      return -2147483648 /* ParameterExcludes */;
    case 219 /* ArrowFunction */:
      return -2072174592 /* ArrowFunctionExcludes */;
    case 218 /* FunctionExpression */:
    case 262 /* FunctionDeclaration */:
      return -1937940480 /* FunctionExcludes */;
    case 261 /* VariableDeclarationList */:
      return -2146893824 /* VariableDeclarationListExcludes */;
    case 263 /* ClassDeclaration */:
    case 231 /* ClassExpression */:
      return -2147344384 /* ClassExcludes */;
    case 176 /* Constructor */:
      return -1937948672 /* ConstructorExcludes */;
    case 172 /* PropertyDeclaration */:
      return -2013249536 /* PropertyExcludes */;
    case 174 /* MethodDeclaration */:
    case 177 /* GetAccessor */:
    case 178 /* SetAccessor */:
      return -2005057536 /* MethodOrAccessorExcludes */;
    case 133 /* AnyKeyword */:
    case 150 /* NumberKeyword */:
    case 163 /* BigIntKeyword */:
    case 146 /* NeverKeyword */:
    case 154 /* StringKeyword */:
    case 151 /* ObjectKeyword */:
    case 136 /* BooleanKeyword */:
    case 155 /* SymbolKeyword */:
    case 116 /* VoidKeyword */:
    case 168 /* TypeParameter */:
    case 171 /* PropertySignature */:
    case 173 /* MethodSignature */:
    case 179 /* CallSignature */:
    case 180 /* ConstructSignature */:
    case 181 /* IndexSignature */:
    case 264 /* InterfaceDeclaration */:
    case 265 /* TypeAliasDeclaration */:
      return -2 /* TypeExcludes */;
    case 210 /* ObjectLiteralExpression */:
      return -2147278848 /* ObjectLiteralExcludes */;
    case 299 /* CatchClause */:
      return -2147418112 /* CatchClauseExcludes */;
    case 206 /* ObjectBindingPattern */:
    case 207 /* ArrayBindingPattern */:
      return -2147450880 /* BindingPatternExcludes */;
    case 216 /* TypeAssertionExpression */:
    case 238 /* SatisfiesExpression */:
    case 234 /* AsExpression */:
    case 360 /* PartiallyEmittedExpression */:
    case 217 /* ParenthesizedExpression */:
    case 108 /* SuperKeyword */:
      return -2147483648 /* OuterExpressionExcludes */;
    case 211 /* PropertyAccessExpression */:
    case 212 /* ElementAccessExpression */:
      return -2147483648 /* PropertyAccessExcludes */;
    default:
      return -2147483648 /* NodeExcludes */;
  }
}
var baseFactory = createBaseNodeFactory();
function makeSynthetic(node) {
  node.flags |= 16 /* Synthesized */;
  return node;
}
var syntheticFactory = {
  createBaseSourceFileNode: (kind) => makeSynthetic(baseFactory.createBaseSourceFileNode(kind)),
  createBaseIdentifierNode: (kind) => makeSynthetic(baseFactory.createBaseIdentifierNode(kind)),
  createBasePrivateIdentifierNode: (kind) => makeSynthetic(baseFactory.createBasePrivateIdentifierNode(kind)),
  createBaseTokenNode: (kind) => makeSynthetic(baseFactory.createBaseTokenNode(kind)),
  createBaseNode: (kind) => makeSynthetic(baseFactory.createBaseNode(kind))
};
var factory = createNodeFactory(4 /* NoIndentationOnFreshPropertyAccess */, syntheticFactory);
function createUnparsedSourceFile(textOrInputFiles, mapPathOrType, mapTextOrStripInternal) {
  let stripInternal;
  let bundleFileInfo;
  let fileName;
  let text;
  let length2;
  let sourceMapPath;
  let sourceMapText;
  let getText;
  let getSourceMapText;
  let oldFileOfCurrentEmit;
  if (!isString(textOrInputFiles)) {
    Debug.assert(mapPathOrType === "js" || mapPathOrType === "dts");
    fileName = (mapPathOrType === "js" ? textOrInputFiles.javascriptPath : textOrInputFiles.declarationPath) || "";
    sourceMapPath = mapPathOrType === "js" ? textOrInputFiles.javascriptMapPath : textOrInputFiles.declarationMapPath;
    getText = () => mapPathOrType === "js" ? textOrInputFiles.javascriptText : textOrInputFiles.declarationText;
    getSourceMapText = () => mapPathOrType === "js" ? textOrInputFiles.javascriptMapText : textOrInputFiles.declarationMapText;
    length2 = () => getText().length;
    if (textOrInputFiles.buildInfo && textOrInputFiles.buildInfo.bundle) {
      Debug.assert(mapTextOrStripInternal === void 0 || typeof mapTextOrStripInternal === "boolean");
      stripInternal = mapTextOrStripInternal;
      bundleFileInfo = mapPathOrType === "js" ? textOrInputFiles.buildInfo.bundle.js : textOrInputFiles.buildInfo.bundle.dts;
      oldFileOfCurrentEmit = textOrInputFiles.oldFileOfCurrentEmit;
    }
  } else {
    fileName = "";
    text = textOrInputFiles;
    length2 = textOrInputFiles.length;
    sourceMapPath = mapPathOrType;
    sourceMapText = mapTextOrStripInternal;
  }
  const node = oldFileOfCurrentEmit ? parseOldFileOfCurrentEmit(Debug.checkDefined(bundleFileInfo)) : parseUnparsedSourceFile(bundleFileInfo, stripInternal, length2);
  node.fileName = fileName;
  node.sourceMapPath = sourceMapPath;
  node.oldFileOfCurrentEmit = oldFileOfCurrentEmit;
  if (getText && getSourceMapText) {
    Object.defineProperty(node, "text", { get: getText });
    Object.defineProperty(node, "sourceMapText", { get: getSourceMapText });
  } else {
    Debug.assert(!oldFileOfCurrentEmit);
    node.text = text ?? "";
    node.sourceMapText = sourceMapText;
  }
  return node;
}
function parseUnparsedSourceFile(bundleFileInfo, stripInternal, length2) {
  let prologues;
  let helpers;
  let referencedFiles;
  let typeReferenceDirectives;
  let libReferenceDirectives;
  let prependChildren;
  let texts;
  let hasNoDefaultLib;
  for (const section of bundleFileInfo ? bundleFileInfo.sections : emptyArray) {
    switch (section.kind) {
      case "prologue" /* Prologue */:
        prologues = append(prologues, setTextRange(factory.createUnparsedPrologue(section.data), section));
        break;
      case "emitHelpers" /* EmitHelpers */:
        helpers = append(helpers, getAllUnscopedEmitHelpers().get(section.data));
        break;
      case "no-default-lib" /* NoDefaultLib */:
        hasNoDefaultLib = true;
        break;
      case "reference" /* Reference */:
        referencedFiles = append(referencedFiles, { pos: -1, end: -1, fileName: section.data });
        break;
      case "type" /* Type */:
        typeReferenceDirectives = append(typeReferenceDirectives, { pos: -1, end: -1, fileName: section.data });
        break;
      case "type-import" /* TypeResolutionModeImport */:
        typeReferenceDirectives = append(typeReferenceDirectives, { pos: -1, end: -1, fileName: section.data, resolutionMode: 99 /* ESNext */ });
        break;
      case "type-require" /* TypeResolutionModeRequire */:
        typeReferenceDirectives = append(typeReferenceDirectives, { pos: -1, end: -1, fileName: section.data, resolutionMode: 1 /* CommonJS */ });
        break;
      case "lib" /* Lib */:
        libReferenceDirectives = append(libReferenceDirectives, { pos: -1, end: -1, fileName: section.data });
        break;
      case "prepend" /* Prepend */:
        let prependTexts;
        for (const text of section.texts) {
          if (!stripInternal || text.kind !== "internal" /* Internal */) {
            prependTexts = append(prependTexts, setTextRange(factory.createUnparsedTextLike(text.data, text.kind === "internal" /* Internal */), text));
          }
        }
        prependChildren = addRange(prependChildren, prependTexts);
        texts = append(texts, factory.createUnparsedPrepend(section.data, prependTexts ?? emptyArray));
        break;
      case "internal" /* Internal */:
        if (stripInternal) {
          if (!texts)
            texts = [];
          break;
        }
      case "text" /* Text */:
        texts = append(texts, setTextRange(factory.createUnparsedTextLike(section.data, section.kind === "internal" /* Internal */), section));
        break;
      default:
        Debug.assertNever(section);
    }
  }
  if (!texts) {
    const textNode = factory.createUnparsedTextLike(
      /*data*/
      void 0,
      /*internal*/
      false
    );
    setTextRangePosWidth(textNode, 0, typeof length2 === "function" ? length2() : length2);
    texts = [textNode];
  }
  const node = parseNodeFactory.createUnparsedSource(
    prologues ?? emptyArray,
    /*syntheticReferences*/
    void 0,
    texts
  );
  setEachParent(prologues, node);
  setEachParent(texts, node);
  setEachParent(prependChildren, node);
  node.hasNoDefaultLib = hasNoDefaultLib;
  node.helpers = helpers;
  node.referencedFiles = referencedFiles || emptyArray;
  node.typeReferenceDirectives = typeReferenceDirectives;
  node.libReferenceDirectives = libReferenceDirectives || emptyArray;
  return node;
}
function parseOldFileOfCurrentEmit(bundleFileInfo) {
  let texts;
  let syntheticReferences;
  for (const section of bundleFileInfo.sections) {
    switch (section.kind) {
      case "internal" /* Internal */:
      case "text" /* Text */:
        texts = append(texts, setTextRange(factory.createUnparsedTextLike(section.data, section.kind === "internal" /* Internal */), section));
        break;
      case "no-default-lib" /* NoDefaultLib */:
      case "reference" /* Reference */:
      case "type" /* Type */:
      case "type-import" /* TypeResolutionModeImport */:
      case "type-require" /* TypeResolutionModeRequire */:
      case "lib" /* Lib */:
        syntheticReferences = append(syntheticReferences, setTextRange(factory.createUnparsedSyntheticReference(section), section));
        break;
      case "prologue" /* Prologue */:
      case "emitHelpers" /* EmitHelpers */:
      case "prepend" /* Prepend */:
        break;
      default:
        Debug.assertNever(section);
    }
  }
  const node = factory.createUnparsedSource(emptyArray, syntheticReferences, texts ?? emptyArray);
  setEachParent(syntheticReferences, node);
  setEachParent(texts, node);
  node.helpers = map(bundleFileInfo.sources && bundleFileInfo.sources.helpers, (name) => getAllUnscopedEmitHelpers().get(name));
  return node;
}
function createInputFilesWithFilePaths(readFileText, javascriptPath, javascriptMapPath, declarationPath, declarationMapPath, buildInfoPath, host, options) {
  const node = parseNodeFactory.createInputFiles();
  node.javascriptPath = javascriptPath;
  node.javascriptMapPath = javascriptMapPath;
  node.declarationPath = declarationPath;
  node.declarationMapPath = declarationMapPath;
  node.buildInfoPath = buildInfoPath;
  const cache = /* @__PURE__ */ new Map();
  const textGetter = (path) => {
    if (path === void 0)
      return void 0;
    let value = cache.get(path);
    if (value === void 0) {
      value = readFileText(path);
      cache.set(path, value !== void 0 ? value : false);
    }
    return value !== false ? value : void 0;
  };
  const definedTextGetter = (path) => {
    const result = textGetter(path);
    return result !== void 0 ? result : `/* Input file ${path} was missing */\r
`;
  };
  let buildInfo;
  const getAndCacheBuildInfo = () => {
    if (buildInfo === void 0 && buildInfoPath) {
      if (host == null ? void 0 : host.getBuildInfo) {
        buildInfo = host.getBuildInfo(buildInfoPath, options.configFilePath) ?? false;
      } else {
        const result = textGetter(buildInfoPath);
        buildInfo = result !== void 0 ? getBuildInfo(buildInfoPath, result) ?? false : false;
      }
    }
    return buildInfo || void 0;
  };
  Object.defineProperties(node, {
    javascriptText: { get: () => definedTextGetter(javascriptPath) },
    javascriptMapText: { get: () => textGetter(javascriptMapPath) },
    // TODO:: if there is inline sourceMap in jsFile, use that
    declarationText: { get: () => definedTextGetter(Debug.checkDefined(declarationPath)) },
    declarationMapText: { get: () => textGetter(declarationMapPath) },
    // TODO:: if there is inline sourceMap in dtsFile, use that
    buildInfo: { get: getAndCacheBuildInfo }
  });
  return node;
}
function createInputFilesWithFileTexts(javascriptPath, javascriptText, javascriptMapPath, javascriptMapText, declarationPath, declarationText, declarationMapPath, declarationMapText, buildInfoPath, buildInfo, oldFileOfCurrentEmit) {
  const node = parseNodeFactory.createInputFiles();
  node.javascriptPath = javascriptPath;
  node.javascriptText = javascriptText;
  node.javascriptMapPath = javascriptMapPath;
  node.javascriptMapText = javascriptMapText;
  node.declarationPath = declarationPath;
  node.declarationText = declarationText;
  node.declarationMapPath = declarationMapPath;
  node.declarationMapText = declarationMapText;
  node.buildInfoPath = buildInfoPath;
  node.buildInfo = buildInfo;
  node.oldFileOfCurrentEmit = oldFileOfCurrentEmit;
  return node;
}
function setOriginalNode(node, original) {
  if (node.original !== original) {
    node.original = original;
    if (original) {
      const emitNode = original.emitNode;
      if (emitNode)
        node.emitNode = mergeEmitNode(emitNode, node.emitNode);
    }
  }
  return node;
}
function mergeEmitNode(sourceEmitNode, destEmitNode) {
  const {
    flags,
    internalFlags,
    leadingComments,
    trailingComments,
    commentRange,
    sourceMapRange,
    tokenSourceMapRanges,
    constantValue,
    helpers,
    startsOnNewLine,
    snippetElement,
    classThis,
    assignedName
  } = sourceEmitNode;
  if (!destEmitNode)
    destEmitNode = {};
  if (flags) {
    destEmitNode.flags = flags;
  }
  if (internalFlags) {
    destEmitNode.internalFlags = internalFlags & ~8 /* Immutable */;
  }
  if (leadingComments) {
    destEmitNode.leadingComments = addRange(leadingComments.slice(), destEmitNode.leadingComments);
  }
  if (trailingComments) {
    destEmitNode.trailingComments = addRange(trailingComments.slice(), destEmitNode.trailingComments);
  }
  if (commentRange) {
    destEmitNode.commentRange = commentRange;
  }
  if (sourceMapRange) {
    destEmitNode.sourceMapRange = sourceMapRange;
  }
  if (tokenSourceMapRanges) {
    destEmitNode.tokenSourceMapRanges = mergeTokenSourceMapRanges(tokenSourceMapRanges, destEmitNode.tokenSourceMapRanges);
  }
  if (constantValue !== void 0) {
    destEmitNode.constantValue = constantValue;
  }
  if (helpers) {
    for (const helper of helpers) {
      destEmitNode.helpers = appendIfUnique(destEmitNode.helpers, helper);
    }
  }
  if (startsOnNewLine !== void 0) {
    destEmitNode.startsOnNewLine = startsOnNewLine;
  }
  if (snippetElement !== void 0) {
    destEmitNode.snippetElement = snippetElement;
  }
  if (classThis) {
    destEmitNode.classThis = classThis;
  }
  if (assignedName) {
    destEmitNode.assignedName = assignedName;
  }
  return destEmitNode;
}
function mergeTokenSourceMapRanges(sourceRanges, destRanges) {
  if (!destRanges)
    destRanges = [];
  for (const key in sourceRanges) {
    destRanges[key] = sourceRanges[key];
  }
  return destRanges;
}

// src/compiler/factory/emitNode.ts
function getOrCreateEmitNode(node) {
  if (!node.emitNode) {
    if (isParseTreeNode(node)) {
      if (node.kind === 312 /* SourceFile */) {
        return node.emitNode = { annotatedNodes: [node] };
      }
      const sourceFile = getSourceFileOfNode(getParseTreeNode(getSourceFileOfNode(node))) ?? Debug.fail("Could not determine parsed source file.");
      getOrCreateEmitNode(sourceFile).annotatedNodes.push(node);
    }
    node.emitNode = {};
  } else {
    Debug.assert(!(node.emitNode.internalFlags & 8 /* Immutable */), "Invalid attempt to mutate an immutable node.");
  }
  return node.emitNode;
}
function disposeEmitNodes(sourceFile) {
  var _a, _b;
  const annotatedNodes = (_b = (_a = getSourceFileOfNode(getParseTreeNode(sourceFile))) == null ? void 0 : _a.emitNode) == null ? void 0 : _b.annotatedNodes;
  if (annotatedNodes) {
    for (const node of annotatedNodes) {
      node.emitNode = void 0;
    }
  }
}
function removeAllComments(node) {
  const emitNode = getOrCreateEmitNode(node);
  emitNode.flags |= 3072 /* NoComments */;
  emitNode.leadingComments = void 0;
  emitNode.trailingComments = void 0;
  return node;
}
function setEmitFlags(node, emitFlags) {
  getOrCreateEmitNode(node).flags = emitFlags;
  return node;
}
function addEmitFlags(node, emitFlags) {
  const emitNode = getOrCreateEmitNode(node);
  emitNode.flags = emitNode.flags | emitFlags;
  return node;
}
function setInternalEmitFlags(node, emitFlags) {
  getOrCreateEmitNode(node).internalFlags = emitFlags;
  return node;
}
function addInternalEmitFlags(node, emitFlags) {
  const emitNode = getOrCreateEmitNode(node);
  emitNode.internalFlags = emitNode.internalFlags | emitFlags;
  return node;
}
function getSourceMapRange(node) {
  var _a;
  return ((_a = node.emitNode) == null ? void 0 : _a.sourceMapRange) ?? node;
}
function setSourceMapRange(node, range) {
  getOrCreateEmitNode(node).sourceMapRange = range;
  return node;
}
function setTokenSourceMapRange(node, token, range) {
  const emitNode = getOrCreateEmitNode(node);
  const tokenSourceMapRanges = emitNode.tokenSourceMapRanges ?? (emitNode.tokenSourceMapRanges = []);
  tokenSourceMapRanges[token] = range;
  return node;
}
function getStartsOnNewLine(node) {
  var _a;
  return (_a = node.emitNode) == null ? void 0 : _a.startsOnNewLine;
}
function setStartsOnNewLine(node, newLine) {
  getOrCreateEmitNode(node).startsOnNewLine = newLine;
  return node;
}
function getCommentRange(node) {
  var _a;
  return ((_a = node.emitNode) == null ? void 0 : _a.commentRange) ?? node;
}
function setCommentRange(node, range) {
  getOrCreateEmitNode(node).commentRange = range;
  return node;
}
function getSyntheticLeadingComments(node) {
  var _a;
  return (_a = node.emitNode) == null ? void 0 : _a.leadingComments;
}
function setSyntheticLeadingComments(node, comments) {
  getOrCreateEmitNode(node).leadingComments = comments;
  return node;
}
function addSyntheticLeadingComment(node, kind, text, hasTrailingNewLine) {
  return setSyntheticLeadingComments(node, append(getSyntheticLeadingComments(node), { kind, pos: -1, end: -1, hasTrailingNewLine, text }));
}
function getSyntheticTrailingComments(node) {
  var _a;
  return (_a = node.emitNode) == null ? void 0 : _a.trailingComments;
}
function setSyntheticTrailingComments(node, comments) {
  getOrCreateEmitNode(node).trailingComments = comments;
  return node;
}
function addSyntheticTrailingComment(node, kind, text, hasTrailingNewLine) {
  return setSyntheticTrailingComments(node, append(getSyntheticTrailingComments(node), { kind, pos: -1, end: -1, hasTrailingNewLine, text }));
}
function moveSyntheticComments(node, original) {
  setSyntheticLeadingComments(node, getSyntheticLeadingComments(original));
  setSyntheticTrailingComments(node, getSyntheticTrailingComments(original));
  const emit = getOrCreateEmitNode(original);
  emit.leadingComments = void 0;
  emit.trailingComments = void 0;
  return node;
}
function getConstantValue(node) {
  var _a;
  return (_a = node.emitNode) == null ? void 0 : _a.constantValue;
}
function setConstantValue(node, value) {
  const emitNode = getOrCreateEmitNode(node);
  emitNode.constantValue = value;
  return node;
}
function addEmitHelper(node, helper) {
  const emitNode = getOrCreateEmitNode(node);
  emitNode.helpers = append(emitNode.helpers, helper);
  return node;
}
function addEmitHelpers(node, helpers) {
  if (some(helpers)) {
    const emitNode = getOrCreateEmitNode(node);
    for (const helper of helpers) {
      emitNode.helpers = appendIfUnique(emitNode.helpers, helper);
    }
  }
  return node;
}
function getEmitHelpers(node) {
  var _a;
  return (_a = node.emitNode) == null ? void 0 : _a.helpers;
}
function moveEmitHelpers(source, target, predicate) {
  const sourceEmitNode = source.emitNode;
  const sourceEmitHelpers = sourceEmitNode && sourceEmitNode.helpers;
  if (!some(sourceEmitHelpers))
    return;
  const targetEmitNode = getOrCreateEmitNode(target);
  let helpersRemoved = 0;
  for (let i = 0; i < sourceEmitHelpers.length; i++) {
    const helper = sourceEmitHelpers[i];
    if (predicate(helper)) {
      helpersRemoved++;
      targetEmitNode.helpers = appendIfUnique(targetEmitNode.helpers, helper);
    } else if (helpersRemoved > 0) {
      sourceEmitHelpers[i - helpersRemoved] = helper;
    }
  }
  if (helpersRemoved > 0) {
    sourceEmitHelpers.length -= helpersRemoved;
  }
}
function getSnippetElement(node) {
  var _a;
  return (_a = node.emitNode) == null ? void 0 : _a.snippetElement;
}
function setTypeNode(node, type) {
  const emitNode = getOrCreateEmitNode(node);
  emitNode.typeNode = type;
  return node;
}
function getTypeNode(node) {
  var _a;
  return (_a = node.emitNode) == null ? void 0 : _a.typeNode;
}
function setIdentifierTypeArguments(node, typeArguments) {
  getOrCreateEmitNode(node).identifierTypeArguments = typeArguments;
  return node;
}
function getIdentifierTypeArguments(node) {
  var _a;
  return (_a = node.emitNode) == null ? void 0 : _a.identifierTypeArguments;
}
function setIdentifierAutoGenerate(node, autoGenerate) {
  getOrCreateEmitNode(node).autoGenerate = autoGenerate;
  return node;
}
function setIdentifierGeneratedImportReference(node, value) {
  getOrCreateEmitNode(node).generatedImportReference = value;
  return node;
}
function getIdentifierGeneratedImportReference(node) {
  var _a;
  return (_a = node.emitNode) == null ? void 0 : _a.generatedImportReference;
}

// src/compiler/factory/emitHelpers.ts
function createEmitHelperFactory(context) {
  const factory2 = context.factory;
  const immutableTrue = memoize(() => setInternalEmitFlags(factory2.createTrue(), 8 /* Immutable */));
  const immutableFalse = memoize(() => setInternalEmitFlags(factory2.createFalse(), 8 /* Immutable */));
  return {
    getUnscopedHelperName,
    // TypeScript Helpers
    createDecorateHelper,
    createMetadataHelper,
    createParamHelper,
    // ES Decorators Helpers
    createESDecorateHelper,
    createRunInitializersHelper,
    // ES2018 Helpers
    createAssignHelper,
    createAwaitHelper,
    createAsyncGeneratorHelper,
    createAsyncDelegatorHelper,
    createAsyncValuesHelper,
    // ES2018 Destructuring Helpers
    createRestHelper,
    // ES2017 Helpers
    createAwaiterHelper,
    // ES2015 Helpers
    createExtendsHelper,
    createTemplateObjectHelper,
    createSpreadArrayHelper,
    createPropKeyHelper,
    createSetFunctionNameHelper,
    // ES2015 Destructuring Helpers
    createValuesHelper,
    createReadHelper,
    // ES2015 Generator Helpers
    createGeneratorHelper,
    // ES Module Helpers
    createCreateBindingHelper,
    createImportStarHelper,
    createImportStarCallbackHelper,
    createImportDefaultHelper,
    createExportStarHelper,
    // Class Fields Helpers
    createClassPrivateFieldGetHelper,
    createClassPrivateFieldSetHelper,
    createClassPrivateFieldInHelper,
    // 'using' helpers
    createAddDisposableResourceHelper,
    createDisposeResourcesHelper
  };
  function getUnscopedHelperName(name) {
    return setEmitFlags(factory2.createIdentifier(name), 8192 /* HelperName */ | 4 /* AdviseOnEmitNode */);
  }
  function createDecorateHelper(decoratorExpressions, target, memberName, descriptor) {
    context.requestEmitHelper(decorateHelper);
    const argumentsArray = [];
    argumentsArray.push(factory2.createArrayLiteralExpression(
      decoratorExpressions,
      /*multiLine*/
      true
    ));
    argumentsArray.push(target);
    if (memberName) {
      argumentsArray.push(memberName);
      if (descriptor) {
        argumentsArray.push(descriptor);
      }
    }
    return factory2.createCallExpression(
      getUnscopedHelperName("__decorate"),
      /*typeArguments*/
      void 0,
      argumentsArray
    );
  }
  function createMetadataHelper(metadataKey, metadataValue) {
    context.requestEmitHelper(metadataHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__metadata"),
      /*typeArguments*/
      void 0,
      [
        factory2.createStringLiteral(metadataKey),
        metadataValue
      ]
    );
  }
  function createParamHelper(expression, parameterOffset, location) {
    context.requestEmitHelper(paramHelper);
    return setTextRange(
      factory2.createCallExpression(
        getUnscopedHelperName("__param"),
        /*typeArguments*/
        void 0,
        [
          factory2.createNumericLiteral(parameterOffset + ""),
          expression
        ]
      ),
      location
    );
  }
  function createESDecorateClassContextObject(contextIn) {
    const properties = [
      factory2.createPropertyAssignment(factory2.createIdentifier("kind"), factory2.createStringLiteral("class")),
      factory2.createPropertyAssignment(factory2.createIdentifier("name"), contextIn.name),
      factory2.createPropertyAssignment(factory2.createIdentifier("metadata"), contextIn.metadata)
    ];
    return factory2.createObjectLiteralExpression(properties);
  }
  function createESDecorateClassElementAccessGetMethod(elementName) {
    const accessor = elementName.computed ? factory2.createElementAccessExpression(factory2.createIdentifier("obj"), elementName.name) : factory2.createPropertyAccessExpression(factory2.createIdentifier("obj"), elementName.name);
    return factory2.createPropertyAssignment(
      "get",
      factory2.createArrowFunction(
        /*modifiers*/
        void 0,
        /*typeParameters*/
        void 0,
        [factory2.createParameterDeclaration(
          /*modifiers*/
          void 0,
          /*dotDotDotToken*/
          void 0,
          factory2.createIdentifier("obj")
        )],
        /*type*/
        void 0,
        /*equalsGreaterThanToken*/
        void 0,
        accessor
      )
    );
  }
  function createESDecorateClassElementAccessSetMethod(elementName) {
    const accessor = elementName.computed ? factory2.createElementAccessExpression(factory2.createIdentifier("obj"), elementName.name) : factory2.createPropertyAccessExpression(factory2.createIdentifier("obj"), elementName.name);
    return factory2.createPropertyAssignment(
      "set",
      factory2.createArrowFunction(
        /*modifiers*/
        void 0,
        /*typeParameters*/
        void 0,
        [
          factory2.createParameterDeclaration(
            /*modifiers*/
            void 0,
            /*dotDotDotToken*/
            void 0,
            factory2.createIdentifier("obj")
          ),
          factory2.createParameterDeclaration(
            /*modifiers*/
            void 0,
            /*dotDotDotToken*/
            void 0,
            factory2.createIdentifier("value")
          )
        ],
        /*type*/
        void 0,
        /*equalsGreaterThanToken*/
        void 0,
        factory2.createBlock([
          factory2.createExpressionStatement(
            factory2.createAssignment(
              accessor,
              factory2.createIdentifier("value")
            )
          )
        ])
      )
    );
  }
  function createESDecorateClassElementAccessHasMethod(elementName) {
    const propertyName = elementName.computed ? elementName.name : isIdentifier(elementName.name) ? factory2.createStringLiteralFromNode(elementName.name) : elementName.name;
    return factory2.createPropertyAssignment(
      "has",
      factory2.createArrowFunction(
        /*modifiers*/
        void 0,
        /*typeParameters*/
        void 0,
        [factory2.createParameterDeclaration(
          /*modifiers*/
          void 0,
          /*dotDotDotToken*/
          void 0,
          factory2.createIdentifier("obj")
        )],
        /*type*/
        void 0,
        /*equalsGreaterThanToken*/
        void 0,
        factory2.createBinaryExpression(
          propertyName,
          103 /* InKeyword */,
          factory2.createIdentifier("obj")
        )
      )
    );
  }
  function createESDecorateClassElementAccessObject(name, access) {
    const properties = [];
    properties.push(createESDecorateClassElementAccessHasMethod(name));
    if (access.get)
      properties.push(createESDecorateClassElementAccessGetMethod(name));
    if (access.set)
      properties.push(createESDecorateClassElementAccessSetMethod(name));
    return factory2.createObjectLiteralExpression(properties);
  }
  function createESDecorateClassElementContextObject(contextIn) {
    const properties = [
      factory2.createPropertyAssignment(factory2.createIdentifier("kind"), factory2.createStringLiteral(contextIn.kind)),
      factory2.createPropertyAssignment(factory2.createIdentifier("name"), contextIn.name.computed ? contextIn.name.name : factory2.createStringLiteralFromNode(contextIn.name.name)),
      factory2.createPropertyAssignment(factory2.createIdentifier("static"), contextIn.static ? factory2.createTrue() : factory2.createFalse()),
      factory2.createPropertyAssignment(factory2.createIdentifier("private"), contextIn.private ? factory2.createTrue() : factory2.createFalse()),
      factory2.createPropertyAssignment(factory2.createIdentifier("access"), createESDecorateClassElementAccessObject(contextIn.name, contextIn.access)),
      factory2.createPropertyAssignment(factory2.createIdentifier("metadata"), contextIn.metadata)
    ];
    return factory2.createObjectLiteralExpression(properties);
  }
  function createESDecorateContextObject(contextIn) {
    return contextIn.kind === "class" ? createESDecorateClassContextObject(contextIn) : createESDecorateClassElementContextObject(contextIn);
  }
  function createESDecorateHelper(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    context.requestEmitHelper(esDecorateHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__esDecorate"),
      /*typeArguments*/
      void 0,
      [
        ctor ?? factory2.createNull(),
        descriptorIn ?? factory2.createNull(),
        decorators,
        createESDecorateContextObject(contextIn),
        initializers,
        extraInitializers
      ]
    );
  }
  function createRunInitializersHelper(thisArg, initializers, value) {
    context.requestEmitHelper(runInitializersHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__runInitializers"),
      /*typeArguments*/
      void 0,
      value ? [thisArg, initializers, value] : [thisArg, initializers]
    );
  }
  function createAssignHelper(attributesSegments) {
    if (getEmitScriptTarget(context.getCompilerOptions()) >= 2 /* ES2015 */) {
      return factory2.createCallExpression(
        factory2.createPropertyAccessExpression(factory2.createIdentifier("Object"), "assign"),
        /*typeArguments*/
        void 0,
        attributesSegments
      );
    }
    context.requestEmitHelper(assignHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__assign"),
      /*typeArguments*/
      void 0,
      attributesSegments
    );
  }
  function createAwaitHelper(expression) {
    context.requestEmitHelper(awaitHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__await"),
      /*typeArguments*/
      void 0,
      [expression]
    );
  }
  function createAsyncGeneratorHelper(generatorFunc, hasLexicalThis) {
    context.requestEmitHelper(awaitHelper);
    context.requestEmitHelper(asyncGeneratorHelper);
    (generatorFunc.emitNode || (generatorFunc.emitNode = {})).flags |= 524288 /* AsyncFunctionBody */ | 1048576 /* ReuseTempVariableScope */;
    return factory2.createCallExpression(
      getUnscopedHelperName("__asyncGenerator"),
      /*typeArguments*/
      void 0,
      [
        hasLexicalThis ? factory2.createThis() : factory2.createVoidZero(),
        factory2.createIdentifier("arguments"),
        generatorFunc
      ]
    );
  }
  function createAsyncDelegatorHelper(expression) {
    context.requestEmitHelper(awaitHelper);
    context.requestEmitHelper(asyncDelegator);
    return factory2.createCallExpression(
      getUnscopedHelperName("__asyncDelegator"),
      /*typeArguments*/
      void 0,
      [expression]
    );
  }
  function createAsyncValuesHelper(expression) {
    context.requestEmitHelper(asyncValues);
    return factory2.createCallExpression(
      getUnscopedHelperName("__asyncValues"),
      /*typeArguments*/
      void 0,
      [expression]
    );
  }
  function createRestHelper(value, elements, computedTempVariables, location) {
    context.requestEmitHelper(restHelper);
    const propertyNames = [];
    let computedTempVariableOffset = 0;
    for (let i = 0; i < elements.length - 1; i++) {
      const propertyName = getPropertyNameOfBindingOrAssignmentElement(elements[i]);
      if (propertyName) {
        if (isComputedPropertyName(propertyName)) {
          Debug.assertIsDefined(computedTempVariables, "Encountered computed property name but 'computedTempVariables' argument was not provided.");
          const temp = computedTempVariables[computedTempVariableOffset];
          computedTempVariableOffset++;
          propertyNames.push(
            factory2.createConditionalExpression(
              factory2.createTypeCheck(temp, "symbol"),
              /*questionToken*/
              void 0,
              temp,
              /*colonToken*/
              void 0,
              factory2.createAdd(temp, factory2.createStringLiteral(""))
            )
          );
        } else {
          propertyNames.push(factory2.createStringLiteralFromNode(propertyName));
        }
      }
    }
    return factory2.createCallExpression(
      getUnscopedHelperName("__rest"),
      /*typeArguments*/
      void 0,
      [
        value,
        setTextRange(
          factory2.createArrayLiteralExpression(propertyNames),
          location
        )
      ]
    );
  }
  function createAwaiterHelper(hasLexicalThis, argumentsExpression, promiseConstructor, parameters, body) {
    context.requestEmitHelper(awaiterHelper);
    const generatorFunc = factory2.createFunctionExpression(
      /*modifiers*/
      void 0,
      factory2.createToken(42 /* AsteriskToken */),
      /*name*/
      void 0,
      /*typeParameters*/
      void 0,
      parameters ?? [],
      /*type*/
      void 0,
      body
    );
    (generatorFunc.emitNode || (generatorFunc.emitNode = {})).flags |= 524288 /* AsyncFunctionBody */ | 1048576 /* ReuseTempVariableScope */;
    return factory2.createCallExpression(
      getUnscopedHelperName("__awaiter"),
      /*typeArguments*/
      void 0,
      [
        hasLexicalThis ? factory2.createThis() : factory2.createVoidZero(),
        argumentsExpression ?? factory2.createVoidZero(),
        promiseConstructor ? createExpressionFromEntityName(factory2, promiseConstructor) : factory2.createVoidZero(),
        generatorFunc
      ]
    );
  }
  function createExtendsHelper(name) {
    context.requestEmitHelper(extendsHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__extends"),
      /*typeArguments*/
      void 0,
      [name, factory2.createUniqueName("_super", 16 /* Optimistic */ | 32 /* FileLevel */)]
    );
  }
  function createTemplateObjectHelper(cooked, raw) {
    context.requestEmitHelper(templateObjectHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__makeTemplateObject"),
      /*typeArguments*/
      void 0,
      [cooked, raw]
    );
  }
  function createSpreadArrayHelper(to, from, packFrom) {
    context.requestEmitHelper(spreadArrayHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__spreadArray"),
      /*typeArguments*/
      void 0,
      [to, from, packFrom ? immutableTrue() : immutableFalse()]
    );
  }
  function createPropKeyHelper(expr) {
    context.requestEmitHelper(propKeyHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__propKey"),
      /*typeArguments*/
      void 0,
      [expr]
    );
  }
  function createSetFunctionNameHelper(f, name, prefix) {
    context.requestEmitHelper(setFunctionNameHelper);
    return context.factory.createCallExpression(
      getUnscopedHelperName("__setFunctionName"),
      /*typeArguments*/
      void 0,
      prefix ? [f, name, context.factory.createStringLiteral(prefix)] : [f, name]
    );
  }
  function createValuesHelper(expression) {
    context.requestEmitHelper(valuesHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__values"),
      /*typeArguments*/
      void 0,
      [expression]
    );
  }
  function createReadHelper(iteratorRecord, count) {
    context.requestEmitHelper(readHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__read"),
      /*typeArguments*/
      void 0,
      count !== void 0 ? [iteratorRecord, factory2.createNumericLiteral(count + "")] : [iteratorRecord]
    );
  }
  function createGeneratorHelper(body) {
    context.requestEmitHelper(generatorHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__generator"),
      /*typeArguments*/
      void 0,
      [factory2.createThis(), body]
    );
  }
  function createCreateBindingHelper(module2, inputName, outputName) {
    context.requestEmitHelper(createBindingHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__createBinding"),
      /*typeArguments*/
      void 0,
      [factory2.createIdentifier("exports"), module2, inputName, ...outputName ? [outputName] : []]
    );
  }
  function createImportStarHelper(expression) {
    context.requestEmitHelper(importStarHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__importStar"),
      /*typeArguments*/
      void 0,
      [expression]
    );
  }
  function createImportStarCallbackHelper() {
    context.requestEmitHelper(importStarHelper);
    return getUnscopedHelperName("__importStar");
  }
  function createImportDefaultHelper(expression) {
    context.requestEmitHelper(importDefaultHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__importDefault"),
      /*typeArguments*/
      void 0,
      [expression]
    );
  }
  function createExportStarHelper(moduleExpression, exportsExpression = factory2.createIdentifier("exports")) {
    context.requestEmitHelper(exportStarHelper);
    context.requestEmitHelper(createBindingHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__exportStar"),
      /*typeArguments*/
      void 0,
      [moduleExpression, exportsExpression]
    );
  }
  function createClassPrivateFieldGetHelper(receiver, state, kind, f) {
    context.requestEmitHelper(classPrivateFieldGetHelper);
    let args;
    if (!f) {
      args = [receiver, state, factory2.createStringLiteral(kind)];
    } else {
      args = [receiver, state, factory2.createStringLiteral(kind), f];
    }
    return factory2.createCallExpression(
      getUnscopedHelperName("__classPrivateFieldGet"),
      /*typeArguments*/
      void 0,
      args
    );
  }
  function createClassPrivateFieldSetHelper(receiver, state, value, kind, f) {
    context.requestEmitHelper(classPrivateFieldSetHelper);
    let args;
    if (!f) {
      args = [receiver, state, value, factory2.createStringLiteral(kind)];
    } else {
      args = [receiver, state, value, factory2.createStringLiteral(kind), f];
    }
    return factory2.createCallExpression(
      getUnscopedHelperName("__classPrivateFieldSet"),
      /*typeArguments*/
      void 0,
      args
    );
  }
  function createClassPrivateFieldInHelper(state, receiver) {
    context.requestEmitHelper(classPrivateFieldInHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__classPrivateFieldIn"),
      /*typeArguments*/
      void 0,
      [state, receiver]
    );
  }
  function createAddDisposableResourceHelper(envBinding, value, async) {
    context.requestEmitHelper(addDisposableResourceHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__addDisposableResource"),
      /*typeArguments*/
      void 0,
      [envBinding, value, async ? factory2.createTrue() : factory2.createFalse()]
    );
  }
  function createDisposeResourcesHelper(envBinding) {
    context.requestEmitHelper(disposeResourcesHelper);
    return factory2.createCallExpression(
      getUnscopedHelperName("__disposeResources"),
      /*typeArguments*/
      void 0,
      [envBinding]
    );
  }
}
function compareEmitHelpers(x, y) {
  if (x === y)
    return 0 /* EqualTo */;
  if (x.priority === y.priority)
    return 0 /* EqualTo */;
  if (x.priority === void 0)
    return 1 /* GreaterThan */;
  if (y.priority === void 0)
    return -1 /* LessThan */;
  return compareValues(x.priority, y.priority);
}
function helperString(input, ...args) {
  return (uniqueName) => {
    let result = "";
    for (let i = 0; i < args.length; i++) {
      result += input[i];
      result += uniqueName(args[i]);
    }
    result += input[input.length - 1];
    return result;
  };
}
var decorateHelper = {
  name: "typescript:decorate",
  importName: "__decorate",
  scoped: false,
  priority: 2,
  text: `
            var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
                var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
                if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
                else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
                return c > 3 && r && Object.defineProperty(target, key, r), r;
            };`
};
var metadataHelper = {
  name: "typescript:metadata",
  importName: "__metadata",
  scoped: false,
  priority: 3,
  text: `
            var __metadata = (this && this.__metadata) || function (k, v) {
                if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
            };`
};
var paramHelper = {
  name: "typescript:param",
  importName: "__param",
  scoped: false,
  priority: 4,
  text: `
            var __param = (this && this.__param) || function (paramIndex, decorator) {
                return function (target, key) { decorator(target, key, paramIndex); }
            };`
};
var esDecorateHelper = {
  name: "typescript:esDecorate",
  importName: "__esDecorate",
  scoped: false,
  priority: 2,
  text: `
        var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
            function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
            var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
            var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
            var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
            var _, done = false;
            for (var i = decorators.length - 1; i >= 0; i--) {
                var context = {};
                for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
                for (var p in contextIn.access) context.access[p] = contextIn.access[p];
                context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
                var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
                if (kind === "accessor") {
                    if (result === void 0) continue;
                    if (result === null || typeof result !== "object") throw new TypeError("Object expected");
                    if (_ = accept(result.get)) descriptor.get = _;
                    if (_ = accept(result.set)) descriptor.set = _;
                    if (_ = accept(result.init)) initializers.unshift(_);
                }
                else if (_ = accept(result)) {
                    if (kind === "field") initializers.unshift(_);
                    else descriptor[key] = _;
                }
            }
            if (target) Object.defineProperty(target, contextIn.name, descriptor);
            done = true;
        };`
};
var runInitializersHelper = {
  name: "typescript:runInitializers",
  importName: "__runInitializers",
  scoped: false,
  priority: 2,
  text: `
        var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
            var useValue = arguments.length > 2;
            for (var i = 0; i < initializers.length; i++) {
                value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
            }
            return useValue ? value : void 0;
        };`
};
var assignHelper = {
  name: "typescript:assign",
  importName: "__assign",
  scoped: false,
  priority: 1,
  text: `
            var __assign = (this && this.__assign) || function () {
                __assign = Object.assign || function(t) {
                    for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                    }
                    return t;
                };
                return __assign.apply(this, arguments);
            };`
};
var awaitHelper = {
  name: "typescript:await",
  importName: "__await",
  scoped: false,
  text: `
            var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }`
};
var asyncGeneratorHelper = {
  name: "typescript:asyncGenerator",
  importName: "__asyncGenerator",
  scoped: false,
  dependencies: [awaitHelper],
  text: `
        var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
            if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
            var g = generator.apply(thisArg, _arguments || []), i, q = [];
            return i = {}, verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
            function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
            function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
            function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
            function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
            function fulfill(value) { resume("next", value); }
            function reject(value) { resume("throw", value); }
            function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
        };`
};
var asyncDelegator = {
  name: "typescript:asyncDelegator",
  importName: "__asyncDelegator",
  scoped: false,
  dependencies: [awaitHelper],
  text: `
            var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
                var i, p;
                return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
                function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
            };`
};
var asyncValues = {
  name: "typescript:asyncValues",
  importName: "__asyncValues",
  scoped: false,
  text: `
            var __asyncValues = (this && this.__asyncValues) || function (o) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var m = o[Symbol.asyncIterator], i;
                return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
                function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
                function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
            };`
};
var restHelper = {
  name: "typescript:rest",
  importName: "__rest",
  scoped: false,
  text: `
            var __rest = (this && this.__rest) || function (s, e) {
                var t = {};
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                    t[p] = s[p];
                if (s != null && typeof Object.getOwnPropertySymbols === "function")
                    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                            t[p[i]] = s[p[i]];
                    }
                return t;
            };`
};
var awaiterHelper = {
  name: "typescript:awaiter",
  importName: "__awaiter",
  scoped: false,
  priority: 5,
  text: `
            var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                return new (P || (P = Promise))(function (resolve, reject) {
                    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                });
            };`
};
var extendsHelper = {
  name: "typescript:extends",
  importName: "__extends",
  scoped: false,
  priority: 0,
  text: `
            var __extends = (this && this.__extends) || (function () {
                var extendStatics = function (d, b) {
                    extendStatics = Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
                    return extendStatics(d, b);
                };

                return function (d, b) {
                    if (typeof b !== "function" && b !== null)
                        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();`
};
var templateObjectHelper = {
  name: "typescript:makeTemplateObject",
  importName: "__makeTemplateObject",
  scoped: false,
  priority: 0,
  text: `
            var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
                if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
                return cooked;
            };`
};
var readHelper = {
  name: "typescript:read",
  importName: "__read",
  scoped: false,
  text: `
            var __read = (this && this.__read) || function (o, n) {
                var m = typeof Symbol === "function" && o[Symbol.iterator];
                if (!m) return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
                }
                catch (error) { e = { error: error }; }
                finally {
                    try {
                        if (r && !r.done && (m = i["return"])) m.call(i);
                    }
                    finally { if (e) throw e.error; }
                }
                return ar;
            };`
};
var spreadArrayHelper = {
  name: "typescript:spreadArray",
  importName: "__spreadArray",
  scoped: false,
  text: `
            var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
                if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
                    if (ar || !(i in from)) {
                        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                        ar[i] = from[i];
                    }
                }
                return to.concat(ar || Array.prototype.slice.call(from));
            };`
};
var propKeyHelper = {
  name: "typescript:propKey",
  importName: "__propKey",
  scoped: false,
  text: `
        var __propKey = (this && this.__propKey) || function (x) {
            return typeof x === "symbol" ? x : "".concat(x);
        };`
};
var setFunctionNameHelper = {
  name: "typescript:setFunctionName",
  importName: "__setFunctionName",
  scoped: false,
  text: `
        var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
            if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
            return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
        };`
};
var valuesHelper = {
  name: "typescript:values",
  importName: "__values",
  scoped: false,
  text: `
            var __values = (this && this.__values) || function(o) {
                var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
                if (m) return m.call(o);
                if (o && typeof o.length === "number") return {
                    next: function () {
                        if (o && i >= o.length) o = void 0;
                        return { value: o && o[i++], done: !o };
                    }
                };
                throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
            };`
};
var generatorHelper = {
  name: "typescript:generator",
  importName: "__generator",
  scoped: false,
  priority: 6,
  text: `
            var __generator = (this && this.__generator) || function (thisArg, body) {
                var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
                return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
                function verb(n) { return function (v) { return step([n, v]); }; }
                function step(op) {
                    if (f) throw new TypeError("Generator is already executing.");
                    while (g && (g = 0, op[0] && (_ = 0)), _) try {
                        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                        if (y = 0, t) op = [op[0] & 2, t.value];
                        switch (op[0]) {
                            case 0: case 1: t = op; break;
                            case 4: _.label++; return { value: op[1], done: false };
                            case 5: _.label++; y = op[1]; op = [0]; continue;
                            case 7: op = _.ops.pop(); _.trys.pop(); continue;
                            default:
                                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                                if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                                if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                                if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                                if (t[2]) _.ops.pop();
                                _.trys.pop(); continue;
                        }
                        op = body.call(thisArg, _);
                    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
                    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
                }
            };`
};
var createBindingHelper = {
  name: "typescript:commonjscreatebinding",
  importName: "__createBinding",
  scoped: false,
  priority: 1,
  text: `
            var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
                if (k2 === undefined) k2 = k;
                var desc = Object.getOwnPropertyDescriptor(m, k);
                if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                  desc = { enumerable: true, get: function() { return m[k]; } };
                }
                Object.defineProperty(o, k2, desc);
            }) : (function(o, m, k, k2) {
                if (k2 === undefined) k2 = k;
                o[k2] = m[k];
            }));`
};
var setModuleDefaultHelper = {
  name: "typescript:commonjscreatevalue",
  importName: "__setModuleDefault",
  scoped: false,
  priority: 1,
  text: `
            var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
                Object.defineProperty(o, "default", { enumerable: true, value: v });
            }) : function(o, v) {
                o["default"] = v;
            });`
};
var importStarHelper = {
  name: "typescript:commonjsimportstar",
  importName: "__importStar",
  scoped: false,
  dependencies: [createBindingHelper, setModuleDefaultHelper],
  priority: 2,
  text: `
            var __importStar = (this && this.__importStar) || function (mod) {
                if (mod && mod.__esModule) return mod;
                var result = {};
                if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
                __setModuleDefault(result, mod);
                return result;
            };`
};
var importDefaultHelper = {
  name: "typescript:commonjsimportdefault",
  importName: "__importDefault",
  scoped: false,
  text: `
            var __importDefault = (this && this.__importDefault) || function (mod) {
                return (mod && mod.__esModule) ? mod : { "default": mod };
            };`
};
var exportStarHelper = {
  name: "typescript:export-star",
  importName: "__exportStar",
  scoped: false,
  dependencies: [createBindingHelper],
  priority: 2,
  text: `
            var __exportStar = (this && this.__exportStar) || function(m, exports) {
                for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
            };`
};
var classPrivateFieldGetHelper = {
  name: "typescript:classPrivateFieldGet",
  importName: "__classPrivateFieldGet",
  scoped: false,
  text: `
            var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
                if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
                if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
                return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
            };`
};
var classPrivateFieldSetHelper = {
  name: "typescript:classPrivateFieldSet",
  importName: "__classPrivateFieldSet",
  scoped: false,
  text: `
            var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
                if (kind === "m") throw new TypeError("Private method is not writable");
                if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
                if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
                return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
            };`
};
var classPrivateFieldInHelper = {
  name: "typescript:classPrivateFieldIn",
  importName: "__classPrivateFieldIn",
  scoped: false,
  text: `
            var __classPrivateFieldIn = (this && this.__classPrivateFieldIn) || function(state, receiver) {
                if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
                return typeof state === "function" ? receiver === state : state.has(receiver);
            };`
};
var addDisposableResourceHelper = {
  name: "typescript:addDisposableResource",
  importName: "__addDisposableResource",
  scoped: false,
  text: `
        var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
            if (value !== null && value !== void 0) {
                if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
                var dispose;
                if (async) {
                    if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
                    dispose = value[Symbol.asyncDispose];
                }
                if (dispose === void 0) {
                    if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
                    dispose = value[Symbol.dispose];
                }
                if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
                env.stack.push({ value: value, dispose: dispose, async: async });
            }
            else if (async) {
                env.stack.push({ async: true });
            }
            return value;
        };`
};
var disposeResourcesHelper = {
  name: "typescript:disposeResources",
  importName: "__disposeResources",
  scoped: false,
  text: `
        var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
            return function (env) {
                function fail(e) {
                    env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
                    env.hasError = true;
                }
                function next() {
                    while (env.stack.length) {
                        var rec = env.stack.pop();
                        try {
                            var result = rec.dispose && rec.dispose.call(rec.value);
                            if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                        }
                        catch (e) {
                            fail(e);
                        }
                    }
                    if (env.hasError) throw env.error;
                }
                return next();
            };
        })(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
            var e = new Error(message);
            return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
        });`
};
var allUnscopedEmitHelpers;
function getAllUnscopedEmitHelpers() {
  return allUnscopedEmitHelpers || (allUnscopedEmitHelpers = arrayToMap([
    decorateHelper,
    metadataHelper,
    paramHelper,
    esDecorateHelper,
    runInitializersHelper,
    assignHelper,
    awaitHelper,
    asyncGeneratorHelper,
    asyncDelegator,
    asyncValues,
    restHelper,
    awaiterHelper,
    extendsHelper,
    templateObjectHelper,
    spreadArrayHelper,
    valuesHelper,
    readHelper,
    propKeyHelper,
    setFunctionNameHelper,
    generatorHelper,
    importStarHelper,
    importDefaultHelper,
    exportStarHelper,
    classPrivateFieldGetHelper,
    classPrivateFieldSetHelper,
    classPrivateFieldInHelper,
    createBindingHelper,
    setModuleDefaultHelper,
    addDisposableResourceHelper,
    disposeResourcesHelper
  ], (helper) => helper.name));
}
var asyncSuperHelper = {
  name: "typescript:async-super",
  scoped: true,
  text: helperString`
            const ${"_superIndex"} = name => super[name];`
};
var advancedAsyncSuperHelper = {
  name: "typescript:advanced-async-super",
  scoped: true,
  text: helperString`
            const ${"_superIndex"} = (function (geti, seti) {
                const cache = Object.create(null);
                return name => cache[name] || (cache[name] = { get value() { return geti(name); }, set value(v) { seti(name, v); } });
            })(name => super[name], (name, value) => super[name] = value);`
};
function isCallToHelper(firstSegment, helperName) {
  return isCallExpression(firstSegment) && isIdentifier(firstSegment.expression) && (getEmitFlags(firstSegment.expression) & 8192 /* HelperName */) !== 0 && firstSegment.expression.escapedText === helperName;
}

// src/compiler/factory/nodeTests.ts
function isNumericLiteral(node) {
  return node.kind === 9 /* NumericLiteral */;
}
function isBigIntLiteral(node) {
  return node.kind === 10 /* BigIntLiteral */;
}
function isStringLiteral(node) {
  return node.kind === 11 /* StringLiteral */;
}
function isJsxText(node) {
  return node.kind === 12 /* JsxText */;
}
function isNoSubstitutionTemplateLiteral(node) {
  return node.kind === 15 /* NoSubstitutionTemplateLiteral */;
}
function isTemplateHead(node) {
  return node.kind === 16 /* TemplateHead */;
}
function isDotDotDotToken(node) {
  return node.kind === 26 /* DotDotDotToken */;
}
function isCommaToken(node) {
  return node.kind === 28 /* CommaToken */;
}
function isPlusToken(node) {
  return node.kind === 40 /* PlusToken */;
}
function isMinusToken(node) {
  return node.kind === 41 /* MinusToken */;
}
function isAsteriskToken(node) {
  return node.kind === 42 /* AsteriskToken */;
}
function isExclamationToken(node) {
  return node.kind === 54 /* ExclamationToken */;
}
function isQuestionToken(node) {
  return node.kind === 58 /* QuestionToken */;
}
function isColonToken(node) {
  return node.kind === 59 /* ColonToken */;
}
function isQuestionDotToken(node) {
  return node.kind === 29 /* QuestionDotToken */;
}
function isEqualsGreaterThanToken(node) {
  return node.kind === 39 /* EqualsGreaterThanToken */;
}
function isIdentifier(node) {
  return node.kind === 80 /* Identifier */;
}
function isPrivateIdentifier(node) {
  return node.kind === 81 /* PrivateIdentifier */;
}
function isExportModifier(node) {
  return node.kind === 95 /* ExportKeyword */;
}
function isDefaultModifier(node) {
  return node.kind === 90 /* DefaultKeyword */;
}
function isAsyncModifier(node) {
  return node.kind === 134 /* AsyncKeyword */;
}
function isAssertsKeyword(node) {
  return node.kind === 131 /* AssertsKeyword */;
}
function isAwaitKeyword(node) {
  return node.kind === 135 /* AwaitKeyword */;
}
function isReadonlyKeyword(node) {
  return node.kind === 148 /* ReadonlyKeyword */;
}
function isStaticModifier(node) {
  return node.kind === 126 /* StaticKeyword */;
}
function isAccessorModifier(node) {
  return node.kind === 129 /* AccessorKeyword */;
}
function isSuperKeyword(node) {
  return node.kind === 108 /* SuperKeyword */;
}
function isImportKeyword(node) {
  return node.kind === 102 /* ImportKeyword */;
}
function isQualifiedName(node) {
  return node.kind === 166 /* QualifiedName */;
}
function isComputedPropertyName(node) {
  return node.kind === 167 /* ComputedPropertyName */;
}
function isTypeParameterDeclaration(node) {
  return node.kind === 168 /* TypeParameter */;
}
function isParameter(node) {
  return node.kind === 169 /* Parameter */;
}
function isDecorator(node) {
  return node.kind === 170 /* Decorator */;
}
function isPropertySignature(node) {
  return node.kind === 171 /* PropertySignature */;
}
function isPropertyDeclaration(node) {
  return node.kind === 172 /* PropertyDeclaration */;
}
function isMethodSignature(node) {
  return node.kind === 173 /* MethodSignature */;
}
function isMethodDeclaration(node) {
  return node.kind === 174 /* MethodDeclaration */;
}
function isClassStaticBlockDeclaration(node) {
  return node.kind === 175 /* ClassStaticBlockDeclaration */;
}
function isConstructorDeclaration(node) {
  return node.kind === 176 /* Constructor */;
}
function isGetAccessorDeclaration(node) {
  return node.kind === 177 /* GetAccessor */;
}
function isSetAccessorDeclaration(node) {
  return node.kind === 178 /* SetAccessor */;
}
function isCallSignatureDeclaration(node) {
  return node.kind === 179 /* CallSignature */;
}
function isConstructSignatureDeclaration(node) {
  return node.kind === 180 /* ConstructSignature */;
}
function isIndexSignatureDeclaration(node) {
  return node.kind === 181 /* IndexSignature */;
}
function isTypePredicateNode(node) {
  return node.kind === 182 /* TypePredicate */;
}
function isTypeReferenceNode(node) {
  return node.kind === 183 /* TypeReference */;
}
function isFunctionTypeNode(node) {
  return node.kind === 184 /* FunctionType */;
}
function isConstructorTypeNode(node) {
  return node.kind === 185 /* ConstructorType */;
}
function isTypeQueryNode(node) {
  return node.kind === 186 /* TypeQuery */;
}
function isTypeLiteralNode(node) {
  return node.kind === 187 /* TypeLiteral */;
}
function isArrayTypeNode(node) {
  return node.kind === 188 /* ArrayType */;
}
function isTupleTypeNode(node) {
  return node.kind === 189 /* TupleType */;
}
function isNamedTupleMember(node) {
  return node.kind === 202 /* NamedTupleMember */;
}
function isOptionalTypeNode(node) {
  return node.kind === 190 /* OptionalType */;
}
function isRestTypeNode(node) {
  return node.kind === 191 /* RestType */;
}
function isUnionTypeNode(node) {
  return node.kind === 192 /* UnionType */;
}
function isIntersectionTypeNode(node) {
  return node.kind === 193 /* IntersectionType */;
}
function isConditionalTypeNode(node) {
  return node.kind === 194 /* ConditionalType */;
}
function isInferTypeNode(node) {
  return node.kind === 195 /* InferType */;
}
function isParenthesizedTypeNode(node) {
  return node.kind === 196 /* ParenthesizedType */;
}
function isThisTypeNode(node) {
  return node.kind === 197 /* ThisType */;
}
function isTypeOperatorNode(node) {
  return node.kind === 198 /* TypeOperator */;
}
function isIndexedAccessTypeNode(node) {
  return node.kind === 199 /* IndexedAccessType */;
}
function isMappedTypeNode(node) {
  return node.kind === 200 /* MappedType */;
}
function isLiteralTypeNode(node) {
  return node.kind === 201 /* LiteralType */;
}
function isImportTypeNode(node) {
  return node.kind === 205 /* ImportType */;
}
function isTemplateLiteralTypeSpan(node) {
  return node.kind === 204 /* TemplateLiteralTypeSpan */;
}
function isObjectBindingPattern(node) {
  return node.kind === 206 /* ObjectBindingPattern */;
}
function isArrayBindingPattern(node) {
  return node.kind === 207 /* ArrayBindingPattern */;
}
function isBindingElement(node) {
  return node.kind === 208 /* BindingElement */;
}
function isArrayLiteralExpression(node) {
  return node.kind === 209 /* ArrayLiteralExpression */;
}
function isObjectLiteralExpression(node) {
  return node.kind === 210 /* ObjectLiteralExpression */;
}
function isPropertyAccessExpression(node) {
  return node.kind === 211 /* PropertyAccessExpression */;
}
function isElementAccessExpression(node) {
  return node.kind === 212 /* ElementAccessExpression */;
}
function isCallExpression(node) {
  return node.kind === 213 /* CallExpression */;
}
function isNewExpression(node) {
  return node.kind === 214 /* NewExpression */;
}
function isTaggedTemplateExpression(node) {
  return node.kind === 215 /* TaggedTemplateExpression */;
}
function isParenthesizedExpression(node) {
  return node.kind === 217 /* ParenthesizedExpression */;
}
function isFunctionExpression(node) {
  return node.kind === 218 /* FunctionExpression */;
}
function isArrowFunction(node) {
  return node.kind === 219 /* ArrowFunction */;
}
function isTypeOfExpression(node) {
  return node.kind === 221 /* TypeOfExpression */;
}
function isVoidExpression(node) {
  return node.kind === 222 /* VoidExpression */;
}
function isAwaitExpression(node) {
  return node.kind === 223 /* AwaitExpression */;
}
function isPrefixUnaryExpression(node) {
  return node.kind === 224 /* PrefixUnaryExpression */;
}
function isPostfixUnaryExpression(node) {
  return node.kind === 225 /* PostfixUnaryExpression */;
}
function isBinaryExpression(node) {
  return node.kind === 226 /* BinaryExpression */;
}
function isConditionalExpression(node) {
  return node.kind === 227 /* ConditionalExpression */;
}
function isSpreadElement(node) {
  return node.kind === 230 /* SpreadElement */;
}
function isClassExpression(node) {
  return node.kind === 231 /* ClassExpression */;
}
function isOmittedExpression(node) {
  return node.kind === 232 /* OmittedExpression */;
}
function isExpressionWithTypeArguments(node) {
  return node.kind === 233 /* ExpressionWithTypeArguments */;
}
function isSatisfiesExpression(node) {
  return node.kind === 238 /* SatisfiesExpression */;
}
function isNonNullExpression(node) {
  return node.kind === 235 /* NonNullExpression */;
}
function isMetaProperty(node) {
  return node.kind === 236 /* MetaProperty */;
}
function isPartiallyEmittedExpression(node) {
  return node.kind === 360 /* PartiallyEmittedExpression */;
}
function isCommaListExpression(node) {
  return node.kind === 361 /* CommaListExpression */;
}
function isTemplateSpan(node) {
  return node.kind === 239 /* TemplateSpan */;
}
function isSemicolonClassElement(node) {
  return node.kind === 240 /* SemicolonClassElement */;
}
function isBlock(node) {
  return node.kind === 241 /* Block */;
}
function isVariableStatement(node) {
  return node.kind === 243 /* VariableStatement */;
}
function isEmptyStatement(node) {
  return node.kind === 242 /* EmptyStatement */;
}
function isExpressionStatement(node) {
  return node.kind === 244 /* ExpressionStatement */;
}
function isIfStatement(node) {
  return node.kind === 245 /* IfStatement */;
}
function isForStatement(node) {
  return node.kind === 248 /* ForStatement */;
}
function isForInStatement(node) {
  return node.kind === 249 /* ForInStatement */;
}
function isForOfStatement(node) {
  return node.kind === 250 /* ForOfStatement */;
}
function isReturnStatement(node) {
  return node.kind === 253 /* ReturnStatement */;
}
function isWithStatement(node) {
  return node.kind === 254 /* WithStatement */;
}
function isSwitchStatement(node) {
  return node.kind === 255 /* SwitchStatement */;
}
function isLabeledStatement(node) {
  return node.kind === 256 /* LabeledStatement */;
}
function isTryStatement(node) {
  return node.kind === 258 /* TryStatement */;
}
function isVariableDeclaration(node) {
  return node.kind === 260 /* VariableDeclaration */;
}
function isVariableDeclarationList(node) {
  return node.kind === 261 /* VariableDeclarationList */;
}
function isFunctionDeclaration(node) {
  return node.kind === 262 /* FunctionDeclaration */;
}
function isClassDeclaration(node) {
  return node.kind === 263 /* ClassDeclaration */;
}
function isInterfaceDeclaration(node) {
  return node.kind === 264 /* InterfaceDeclaration */;
}
function isTypeAliasDeclaration(node) {
  return node.kind === 265 /* TypeAliasDeclaration */;
}
function isEnumDeclaration(node) {
  return node.kind === 266 /* EnumDeclaration */;
}
function isModuleDeclaration(node) {
  return node.kind === 267 /* ModuleDeclaration */;
}
function isModuleBlock(node) {
  return node.kind === 268 /* ModuleBlock */;
}
function isCaseBlock(node) {
  return node.kind === 269 /* CaseBlock */;
}
function isNamespaceExportDeclaration(node) {
  return node.kind === 270 /* NamespaceExportDeclaration */;
}
function isImportEqualsDeclaration(node) {
  return node.kind === 271 /* ImportEqualsDeclaration */;
}
function isImportDeclaration(node) {
  return node.kind === 272 /* ImportDeclaration */;
}
function isImportClause(node) {
  return node.kind === 273 /* ImportClause */;
}
function isAssertClause(node) {
  return node.kind === 300 /* AssertClause */;
}
function isImportAttributes(node) {
  return node.kind === 300 /* ImportAttributes */;
}
function isImportAttribute(node) {
  return node.kind === 301 /* ImportAttribute */;
}
function isNamespaceImport(node) {
  return node.kind === 274 /* NamespaceImport */;
}
function isNamespaceExport(node) {
  return node.kind === 280 /* NamespaceExport */;
}
function isNamedImports(node) {
  return node.kind === 275 /* NamedImports */;
}
function isImportSpecifier(node) {
  return node.kind === 276 /* ImportSpecifier */;
}
function isExportAssignment(node) {
  return node.kind === 277 /* ExportAssignment */;
}
function isExportDeclaration(node) {
  return node.kind === 278 /* ExportDeclaration */;
}
function isNamedExports(node) {
  return node.kind === 279 /* NamedExports */;
}
function isExportSpecifier(node) {
  return node.kind === 281 /* ExportSpecifier */;
}
function isNotEmittedStatement(node) {
  return node.kind === 359 /* NotEmittedStatement */;
}
function isSyntheticReference(node) {
  return node.kind === 362 /* SyntheticReferenceExpression */;
}
function isExternalModuleReference(node) {
  return node.kind === 283 /* ExternalModuleReference */;
}
function isJsxElement(node) {
  return node.kind === 284 /* JsxElement */;
}
function isJsxSelfClosingElement(node) {
  return node.kind === 285 /* JsxSelfClosingElement */;
}
function isJsxOpeningElement(node) {
  return node.kind === 286 /* JsxOpeningElement */;
}
function isJsxClosingElement(node) {
  return node.kind === 287 /* JsxClosingElement */;
}
function isJsxFragment(node) {
  return node.kind === 288 /* JsxFragment */;
}
function isJsxOpeningFragment(node) {
  return node.kind === 289 /* JsxOpeningFragment */;
}
function isJsxClosingFragment(node) {
  return node.kind === 290 /* JsxClosingFragment */;
}
function isJsxAttribute(node) {
  return node.kind === 291 /* JsxAttribute */;
}
function isJsxAttributes(node) {
  return node.kind === 292 /* JsxAttributes */;
}
function isJsxSpreadAttribute(node) {
  return node.kind === 293 /* JsxSpreadAttribute */;
}
function isJsxNamespacedName(node) {
  return node.kind === 295 /* JsxNamespacedName */;
}
function isCaseClause(node) {
  return node.kind === 296 /* CaseClause */;
}
function isDefaultClause(node) {
  return node.kind === 297 /* DefaultClause */;
}
function isHeritageClause(node) {
  return node.kind === 298 /* HeritageClause */;
}
function isCatchClause(node) {
  return node.kind === 299 /* CatchClause */;
}
function isPropertyAssignment(node) {
  return node.kind === 303 /* PropertyAssignment */;
}
function isShorthandPropertyAssignment(node) {
  return node.kind === 304 /* ShorthandPropertyAssignment */;
}
function isSpreadAssignment(node) {
  return node.kind === 305 /* SpreadAssignment */;
}
function isEnumMember(node) {
  return node.kind === 306 /* EnumMember */;
}
function isUnparsedPrepend(node) {
  return node.kind === 308 /* UnparsedPrepend */;
}
function isSourceFile(node) {
  return node.kind === 312 /* SourceFile */;
}
function isBundle(node) {
  return node.kind === 313 /* Bundle */;
}
function isUnparsedSource(node) {
  return node.kind === 314 /* UnparsedSource */;
}
function isJSDocTypeExpression(node) {
  return node.kind === 316 /* JSDocTypeExpression */;
}
function isJSDocNameReference(node) {
  return node.kind === 317 /* JSDocNameReference */;
}
function isJSDocMemberName(node) {
  return node.kind === 318 /* JSDocMemberName */;
}
function isJSDocAllType(node) {
  return node.kind === 319 /* JSDocAllType */;
}
function isJSDocUnknownType(node) {
  return node.kind === 320 /* JSDocUnknownType */;
}
function isJSDocNullableType(node) {
  return node.kind === 321 /* JSDocNullableType */;
}
function isJSDocNonNullableType(node) {
  return node.kind === 322 /* JSDocNonNullableType */;
}
function isJSDocOptionalType(node) {
  return node.kind === 323 /* JSDocOptionalType */;
}
function isJSDocFunctionType(node) {
  return node.kind === 324 /* JSDocFunctionType */;
}
function isJSDocVariadicType(node) {
  return node.kind === 325 /* JSDocVariadicType */;
}
function isJSDoc(node) {
  return node.kind === 327 /* JSDoc */;
}
function isJSDocTypeLiteral(node) {
  return node.kind === 329 /* JSDocTypeLiteral */;
}
function isJSDocSignature(node) {
  return node.kind === 330 /* JSDocSignature */;
}
function isJSDocAugmentsTag(node) {
  return node.kind === 335 /* JSDocAugmentsTag */;
}
function isJSDocClassTag(node) {
  return node.kind === 339 /* JSDocClassTag */;
}
function isJSDocCallbackTag(node) {
  return node.kind === 345 /* JSDocCallbackTag */;
}
function isJSDocPublicTag(node) {
  return node.kind === 340 /* JSDocPublicTag */;
}
function isJSDocPrivateTag(node) {
  return node.kind === 341 /* JSDocPrivateTag */;
}
function isJSDocProtectedTag(node) {
  return node.kind === 342 /* JSDocProtectedTag */;
}
function isJSDocReadonlyTag(node) {
  return node.kind === 343 /* JSDocReadonlyTag */;
}
function isJSDocOverrideTag(node) {
  return node.kind === 344 /* JSDocOverrideTag */;
}
function isJSDocOverloadTag(node) {
  return node.kind === 346 /* JSDocOverloadTag */;
}
function isJSDocDeprecatedTag(node) {
  return node.kind === 338 /* JSDocDeprecatedTag */;
}
function isJSDocEnumTag(node) {
  return node.kind === 347 /* JSDocEnumTag */;
}
function isJSDocParameterTag(node) {
  return node.kind === 348 /* JSDocParameterTag */;
}
function isJSDocReturnTag(node) {
  return node.kind === 349 /* JSDocReturnTag */;
}
function isJSDocThisTag(node) {
  return node.kind === 350 /* JSDocThisTag */;
}
function isJSDocTypeTag(node) {
  return node.kind === 351 /* JSDocTypeTag */;
}
function isJSDocTemplateTag(node) {
  return node.kind === 352 /* JSDocTemplateTag */;
}
function isJSDocTypedefTag(node) {
  return node.kind === 353 /* JSDocTypedefTag */;
}
function isJSDocPropertyTag(node) {
  return node.kind === 355 /* JSDocPropertyTag */;
}
function isJSDocImplementsTag(node) {
  return node.kind === 336 /* JSDocImplementsTag */;
}
function isJSDocSatisfiesTag(node) {
  return node.kind === 357 /* JSDocSatisfiesTag */;
}

// src/compiler/factory/utilities.ts
function createEmptyExports(factory2) {
  return factory2.createExportDeclaration(
    /*modifiers*/
    void 0,
    /*isTypeOnly*/
    false,
    factory2.createNamedExports([]),
    /*moduleSpecifier*/
    void 0
  );
}
function createMemberAccessForPropertyName(factory2, target, memberName, location) {
  if (isComputedPropertyName(memberName)) {
    return setTextRange(factory2.createElementAccessExpression(target, memberName.expression), location);
  } else {
    const expression = setTextRange(
      isMemberName(memberName) ? factory2.createPropertyAccessExpression(target, memberName) : factory2.createElementAccessExpression(target, memberName),
      memberName
    );
    addEmitFlags(expression, 128 /* NoNestedSourceMaps */);
    return expression;
  }
}
function createReactNamespace(reactNamespace, parent) {
  const react = parseNodeFactory.createIdentifier(reactNamespace || "React");
  setParent(react, getParseTreeNode(parent));
  return react;
}
function createJsxFactoryExpressionFromEntityName(factory2, jsxFactory, parent) {
  if (isQualifiedName(jsxFactory)) {
    const left = createJsxFactoryExpressionFromEntityName(factory2, jsxFactory.left, parent);
    const right = factory2.createIdentifier(idText(jsxFactory.right));
    right.escapedText = jsxFactory.right.escapedText;
    return factory2.createPropertyAccessExpression(left, right);
  } else {
    return createReactNamespace(idText(jsxFactory), parent);
  }
}
function createJsxFactoryExpression(factory2, jsxFactoryEntity, reactNamespace, parent) {
  return jsxFactoryEntity ? createJsxFactoryExpressionFromEntityName(factory2, jsxFactoryEntity, parent) : factory2.createPropertyAccessExpression(
    createReactNamespace(reactNamespace, parent),
    "createElement"
  );
}
function createJsxFragmentFactoryExpression(factory2, jsxFragmentFactoryEntity, reactNamespace, parent) {
  return jsxFragmentFactoryEntity ? createJsxFactoryExpressionFromEntityName(factory2, jsxFragmentFactoryEntity, parent) : factory2.createPropertyAccessExpression(
    createReactNamespace(reactNamespace, parent),
    "Fragment"
  );
}
function createExpressionForJsxElement(factory2, callee, tagName, props, children, location) {
  const argumentsList = [tagName];
  if (props) {
    argumentsList.push(props);
  }
  if (children && children.length > 0) {
    if (!props) {
      argumentsList.push(factory2.createNull());
    }
    if (children.length > 1) {
      for (const child of children) {
        startOnNewLine(child);
        argumentsList.push(child);
      }
    } else {
      argumentsList.push(children[0]);
    }
  }
  return setTextRange(
    factory2.createCallExpression(
      callee,
      /*typeArguments*/
      void 0,
      argumentsList
    ),
    location
  );
}
function createExpressionForJsxFragment(factory2, jsxFactoryEntity, jsxFragmentFactoryEntity, reactNamespace, children, parentElement, location) {
  const tagName = createJsxFragmentFactoryExpression(factory2, jsxFragmentFactoryEntity, reactNamespace, parentElement);
  const argumentsList = [tagName, factory2.createNull()];
  if (children && children.length > 0) {
    if (children.length > 1) {
      for (const child of children) {
        startOnNewLine(child);
        argumentsList.push(child);
      }
    } else {
      argumentsList.push(children[0]);
    }
  }
  return setTextRange(
    factory2.createCallExpression(
      createJsxFactoryExpression(factory2, jsxFactoryEntity, reactNamespace, parentElement),
      /*typeArguments*/
      void 0,
      argumentsList
    ),
    location
  );
}
function createForOfBindingStatement(factory2, node, boundValue) {
  if (isVariableDeclarationList(node)) {
    const firstDeclaration = first(node.declarations);
    const updatedDeclaration = factory2.updateVariableDeclaration(
      firstDeclaration,
      firstDeclaration.name,
      /*exclamationToken*/
      void 0,
      /*type*/
      void 0,
      boundValue
    );
    return setTextRange(
      factory2.createVariableStatement(
        /*modifiers*/
        void 0,
        factory2.updateVariableDeclarationList(node, [updatedDeclaration])
      ),
      /*location*/
      node
    );
  } else {
    const updatedExpression = setTextRange(
      factory2.createAssignment(node, boundValue),
      /*location*/
      node
    );
    return setTextRange(
      factory2.createExpressionStatement(updatedExpression),
      /*location*/
      node
    );
  }
}
function createExpressionFromEntityName(factory2, node) {
  if (isQualifiedName(node)) {
    const left = createExpressionFromEntityName(factory2, node.left);
    const right = setParent(setTextRange(factory2.cloneNode(node.right), node.right), node.right.parent);
    return setTextRange(factory2.createPropertyAccessExpression(left, right), node);
  } else {
    return setParent(setTextRange(factory2.cloneNode(node), node), node.parent);
  }
}
function createExpressionForPropertyName(factory2, memberName) {
  if (isIdentifier(memberName)) {
    return factory2.createStringLiteralFromNode(memberName);
  } else if (isComputedPropertyName(memberName)) {
    return setParent(setTextRange(factory2.cloneNode(memberName.expression), memberName.expression), memberName.expression.parent);
  } else {
    return setParent(setTextRange(factory2.cloneNode(memberName), memberName), memberName.parent);
  }
}
function createExpressionForAccessorDeclaration(factory2, properties, property, receiver, multiLine) {
  const { firstAccessor, getAccessor, setAccessor } = getAllAccessorDeclarations(properties, property);
  if (property === firstAccessor) {
    return setTextRange(
      factory2.createObjectDefinePropertyCall(
        receiver,
        createExpressionForPropertyName(factory2, property.name),
        factory2.createPropertyDescriptor({
          enumerable: factory2.createFalse(),
          configurable: true,
          get: getAccessor && setTextRange(
            setOriginalNode(
              factory2.createFunctionExpression(
                getModifiers(getAccessor),
                /*asteriskToken*/
                void 0,
                /*name*/
                void 0,
                /*typeParameters*/
                void 0,
                getAccessor.parameters,
                /*type*/
                void 0,
                getAccessor.body
                // TODO: GH#18217
              ),
              getAccessor
            ),
            getAccessor
          ),
          set: setAccessor && setTextRange(
            setOriginalNode(
              factory2.createFunctionExpression(
                getModifiers(setAccessor),
                /*asteriskToken*/
                void 0,
                /*name*/
                void 0,
                /*typeParameters*/
                void 0,
                setAccessor.parameters,
                /*type*/
                void 0,
                setAccessor.body
                // TODO: GH#18217
              ),
              setAccessor
            ),
            setAccessor
          )
        }, !multiLine)
      ),
      firstAccessor
    );
  }
  return void 0;
}
function createExpressionForPropertyAssignment(factory2, property, receiver) {
  return setOriginalNode(
    setTextRange(
      factory2.createAssignment(
        createMemberAccessForPropertyName(
          factory2,
          receiver,
          property.name,
          /*location*/
          property.name
        ),
        property.initializer
      ),
      property
    ),
    property
  );
}
function createExpressionForShorthandPropertyAssignment(factory2, property, receiver) {
  return setOriginalNode(
    setTextRange(
      factory2.createAssignment(
        createMemberAccessForPropertyName(
          factory2,
          receiver,
          property.name,
          /*location*/
          property.name
        ),
        factory2.cloneNode(property.name)
      ),
      /*location*/
      property
    ),
    /*original*/
    property
  );
}
function createExpressionForMethodDeclaration(factory2, method, receiver) {
  return setOriginalNode(
    setTextRange(
      factory2.createAssignment(
        createMemberAccessForPropertyName(
          factory2,
          receiver,
          method.name,
          /*location*/
          method.name
        ),
        setOriginalNode(
          setTextRange(
            factory2.createFunctionExpression(
              getModifiers(method),
              method.asteriskToken,
              /*name*/
              void 0,
              /*typeParameters*/
              void 0,
              method.parameters,
              /*type*/
              void 0,
              method.body
              // TODO: GH#18217
            ),
            /*location*/
            method
          ),
          /*original*/
          method
        )
      ),
      /*location*/
      method
    ),
    /*original*/
    method
  );
}
function createExpressionForObjectLiteralElementLike(factory2, node, property, receiver) {
  if (property.name && isPrivateIdentifier(property.name)) {
    Debug.failBadSyntaxKind(property.name, "Private identifiers are not allowed in object literals.");
  }
  switch (property.kind) {
    case 177 /* GetAccessor */:
    case 178 /* SetAccessor */:
      return createExpressionForAccessorDeclaration(factory2, node.properties, property, receiver, !!node.multiLine);
    case 303 /* PropertyAssignment */:
      return createExpressionForPropertyAssignment(factory2, property, receiver);
    case 304 /* ShorthandPropertyAssignment */:
      return createExpressionForShorthandPropertyAssignment(factory2, property, receiver);
    case 174 /* MethodDeclaration */:
      return createExpressionForMethodDeclaration(factory2, property, receiver);
  }
}
function expandPreOrPostfixIncrementOrDecrementExpression(factory2, node, expression, recordTempVariable, resultVariable) {
  const operator = node.operator;
  Debug.assert(operator === 46 /* PlusPlusToken */ || operator === 47 /* MinusMinusToken */, "Expected 'node' to be a pre- or post-increment or pre- or post-decrement expression");
  const temp = factory2.createTempVariable(recordTempVariable);
  expression = factory2.createAssignment(temp, expression);
  setTextRange(expression, node.operand);
  let operation = isPrefixUnaryExpression(node) ? factory2.createPrefixUnaryExpression(operator, temp) : factory2.createPostfixUnaryExpression(temp, operator);
  setTextRange(operation, node);
  if (resultVariable) {
    operation = factory2.createAssignment(resultVariable, operation);
    setTextRange(operation, node);
  }
  expression = factory2.createComma(expression, operation);
  setTextRange(expression, node);
  if (isPostfixUnaryExpression(node)) {
    expression = factory2.createComma(expression, temp);
    setTextRange(expression, node);
  }
  return expression;
}
function isInternalName(node) {
  return (getEmitFlags(node) & 65536 /* InternalName */) !== 0;
}
function isLocalName(node) {
  return (getEmitFlags(node) & 32768 /* LocalName */) !== 0;
}
function isExportName(node) {
  return (getEmitFlags(node) & 16384 /* ExportName */) !== 0;
}
function isUseStrictPrologue(node) {
  return isStringLiteral(node.expression) && node.expression.text === "use strict";
}
function findUseStrictPrologue(statements) {
  for (const statement of statements) {
    if (isPrologueDirective(statement)) {
      if (isUseStrictPrologue(statement)) {
        return statement;
      }
    } else {
      break;
    }
  }
  return void 0;
}
function startsWithUseStrict(statements) {
  const firstStatement = firstOrUndefined(statements);
  return firstStatement !== void 0 && isPrologueDirective(firstStatement) && isUseStrictPrologue(firstStatement);
}
function isCommaExpression(node) {
  return node.kind === 226 /* BinaryExpression */ && node.operatorToken.kind === 28 /* CommaToken */;
}
function isCommaSequence(node) {
  return isCommaExpression(node) || isCommaListExpression(node);
}
function isJSDocTypeAssertion(node) {
  return isParenthesizedExpression(node) && isInJSFile(node) && !!getJSDocTypeTag(node);
}
function getJSDocTypeAssertionType(node) {
  const type = getJSDocType(node);
  Debug.assertIsDefined(type);
  return type;
}
function isOuterExpression(node, kinds = 15 /* All */) {
  switch (node.kind) {
    case 217 /* ParenthesizedExpression */:
      if (kinds & 16 /* ExcludeJSDocTypeAssertion */ && isJSDocTypeAssertion(node)) {
        return false;
      }
      return (kinds & 1 /* Parentheses */) !== 0;
    case 216 /* TypeAssertionExpression */:
    case 234 /* AsExpression */:
    case 233 /* ExpressionWithTypeArguments */:
    case 238 /* SatisfiesExpression */:
      return (kinds & 2 /* TypeAssertions */) !== 0;
    case 235 /* NonNullExpression */:
      return (kinds & 4 /* NonNullAssertions */) !== 0;
    case 360 /* PartiallyEmittedExpression */:
      return (kinds & 8 /* PartiallyEmittedExpressions */) !== 0;
  }
  return false;
}
function skipOuterExpressions(node, kinds = 15 /* All */) {
  while (isOuterExpression(node, kinds)) {
    node = node.expression;
  }
  return node;
}
function walkUpOuterExpressions(node, kinds = 15 /* All */) {
  let parent = node.parent;
  while (isOuterExpression(parent, kinds)) {
    parent = parent.parent;
    Debug.assert(parent);
  }
  return parent;
}
function startOnNewLine(node) {
  return setStartsOnNewLine(
    node,
    /*newLine*/
    true
  );
}
function getExternalHelpersModuleName(node) {
  const parseNode = getOriginalNode(node, isSourceFile);
  const emitNode = parseNode && parseNode.emitNode;
  return emitNode && emitNode.externalHelpersModuleName;
}
function hasRecordedExternalHelpers(sourceFile) {
  const parseNode = getOriginalNode(sourceFile, isSourceFile);
  const emitNode = parseNode && parseNode.emitNode;
  return !!emitNode && (!!emitNode.externalHelpersModuleName || !!emitNode.externalHelpers);
}
function createExternalHelpersImportDeclarationIfNeeded(nodeFactory, helperFactory, sourceFile, compilerOptions, hasExportStarsToExportValues, hasImportStar, hasImportDefault) {
  if (compilerOptions.importHelpers && isEffectiveExternalModule(sourceFile, compilerOptions)) {
    let namedBindings;
    const moduleKind = getEmitModuleKind(compilerOptions);
    if (moduleKind >= 5 /* ES2015 */ && moduleKind <= 99 /* ESNext */ || sourceFile.impliedNodeFormat === 99 /* ESNext */) {
      const helpers = getEmitHelpers(sourceFile);
      if (helpers) {
        const helperNames = [];
        for (const helper of helpers) {
          if (!helper.scoped) {
            const importName = helper.importName;
            if (importName) {
              pushIfUnique(helperNames, importName);
            }
          }
        }
        if (some(helperNames)) {
          helperNames.sort(compareStringsCaseSensitive);
          namedBindings = nodeFactory.createNamedImports(
            map(helperNames, (name) => isFileLevelUniqueName(sourceFile, name) ? nodeFactory.createImportSpecifier(
              /*isTypeOnly*/
              false,
              /*propertyName*/
              void 0,
              nodeFactory.createIdentifier(name)
            ) : nodeFactory.createImportSpecifier(
              /*isTypeOnly*/
              false,
              nodeFactory.createIdentifier(name),
              helperFactory.getUnscopedHelperName(name)
            ))
          );
          const parseNode = getOriginalNode(sourceFile, isSourceFile);
          const emitNode = getOrCreateEmitNode(parseNode);
          emitNode.externalHelpers = true;
        }
      }
    } else {
      const externalHelpersModuleName = getOrCreateExternalHelpersModuleNameIfNeeded(nodeFactory, sourceFile, compilerOptions, hasExportStarsToExportValues, hasImportStar || hasImportDefault);
      if (externalHelpersModuleName) {
        namedBindings = nodeFactory.createNamespaceImport(externalHelpersModuleName);
      }
    }
    if (namedBindings) {
      const externalHelpersImportDeclaration = nodeFactory.createImportDeclaration(
        /*modifiers*/
        void 0,
        nodeFactory.createImportClause(
          /*isTypeOnly*/
          false,
          /*name*/
          void 0,
          namedBindings
        ),
        nodeFactory.createStringLiteral(externalHelpersModuleNameText),
        /*attributes*/
        void 0
      );
      addInternalEmitFlags(externalHelpersImportDeclaration, 2 /* NeverApplyImportHelper */);
      return externalHelpersImportDeclaration;
    }
  }
}
function getOrCreateExternalHelpersModuleNameIfNeeded(factory2, node, compilerOptions, hasExportStarsToExportValues, hasImportStarOrImportDefault) {
  if (compilerOptions.importHelpers && isEffectiveExternalModule(node, compilerOptions)) {
    const externalHelpersModuleName = getExternalHelpersModuleName(node);
    if (externalHelpersModuleName) {
      return externalHelpersModuleName;
    }
    const moduleKind = getEmitModuleKind(compilerOptions);
    let create = (hasExportStarsToExportValues || getESModuleInterop(compilerOptions) && hasImportStarOrImportDefault) && moduleKind !== 4 /* System */ && (moduleKind < 5 /* ES2015 */ || node.impliedNodeFormat === 1 /* CommonJS */);
    if (!create) {
      const helpers = getEmitHelpers(node);
      if (helpers) {
        for (const helper of helpers) {
          if (!helper.scoped) {
            create = true;
            break;
          }
        }
      }
    }
    if (create) {
      const parseNode = getOriginalNode(node, isSourceFile);
      const emitNode = getOrCreateEmitNode(parseNode);
      return emitNode.externalHelpersModuleName || (emitNode.externalHelpersModuleName = factory2.createUniqueName(externalHelpersModuleNameText));
    }
  }
}
function getLocalNameForExternalImport(factory2, node, sourceFile) {
  const namespaceDeclaration = getNamespaceDeclarationNode(node);
  if (namespaceDeclaration && !isDefaultImport(node) && !isExportNamespaceAsDefaultDeclaration(node)) {
    const name = namespaceDeclaration.name;
    return isGeneratedIdentifier(name) ? name : factory2.createIdentifier(getSourceTextOfNodeFromSourceFile(sourceFile, name) || idText(name));
  }
  if (node.kind === 272 /* ImportDeclaration */ && node.importClause) {
    return factory2.getGeneratedNameForNode(node);
  }
  if (node.kind === 278 /* ExportDeclaration */ && node.moduleSpecifier) {
    return factory2.getGeneratedNameForNode(node);
  }
  return void 0;
}
function getExternalModuleNameLiteral(factory2, importNode, sourceFile, host, resolver, compilerOptions) {
  const moduleName = getExternalModuleName(importNode);
  if (moduleName && isStringLiteral(moduleName)) {
    return tryGetModuleNameFromDeclaration(importNode, host, factory2, resolver, compilerOptions) || tryRenameExternalModule(factory2, moduleName, sourceFile) || factory2.cloneNode(moduleName);
  }
  return void 0;
}
function tryRenameExternalModule(factory2, moduleName, sourceFile) {
  const rename = sourceFile.renamedDependencies && sourceFile.renamedDependencies.get(moduleName.text);
  return rename ? factory2.createStringLiteral(rename) : void 0;
}
function tryGetModuleNameFromFile(factory2, file, host, options) {
  if (!file) {
    return void 0;
  }
  if (file.moduleName) {
    return factory2.createStringLiteral(file.moduleName);
  }
  if (!file.isDeclarationFile && outFile(options)) {
    return factory2.createStringLiteral(getExternalModuleNameFromPath(host, file.fileName));
  }
  return void 0;
}
function tryGetModuleNameFromDeclaration(declaration, host, factory2, resolver, compilerOptions) {
  return tryGetModuleNameFromFile(factory2, resolver.getExternalModuleFileFromDeclaration(declaration), host, compilerOptions);
}
function getInitializerOfBindingOrAssignmentElement(bindingElement) {
  if (isDeclarationBindingElement(bindingElement)) {
    return bindingElement.initializer;
  }
  if (isPropertyAssignment(bindingElement)) {
    const initializer = bindingElement.initializer;
    return isAssignmentExpression(
      initializer,
      /*excludeCompoundAssignment*/
      true
    ) ? initializer.right : void 0;
  }
  if (isShorthandPropertyAssignment(bindingElement)) {
    return bindingElement.objectAssignmentInitializer;
  }
  if (isAssignmentExpression(
    bindingElement,
    /*excludeCompoundAssignment*/
    true
  )) {
    return bindingElement.right;
  }
  if (isSpreadElement(bindingElement)) {
    return getInitializerOfBindingOrAssignmentElement(bindingElement.expression);
  }
}
function getTargetOfBindingOrAssignmentElement(bindingElement) {
  if (isDeclarationBindingElement(bindingElement)) {
    return bindingElement.name;
  }
  if (isObjectLiteralElementLike(bindingElement)) {
    switch (bindingElement.kind) {
      case 303 /* PropertyAssignment */:
        return getTargetOfBindingOrAssignmentElement(bindingElement.initializer);
      case 304 /* ShorthandPropertyAssignment */:
        return bindingElement.name;
      case 305 /* SpreadAssignment */:
        return getTargetOfBindingOrAssignmentElement(bindingElement.expression);
    }
    return void 0;
  }
  if (isAssignmentExpression(
    bindingElement,
    /*excludeCompoundAssignment*/
    true
  )) {
    return getTargetOfBindingOrAssignmentElement(bindingElement.left);
  }
  if (isSpreadElement(bindingElement)) {
    return getTargetOfBindingOrAssignmentElement(bindingElement.expression);
  }
  return bindingElement;
}
function getRestIndicatorOfBindingOrAssignmentElement(bindingElement) {
  switch (bindingElement.kind) {
    case 169 /* Parameter */:
    case 208 /* BindingElement */:
      return bindingElement.dotDotDotToken;
    case 230 /* SpreadElement */:
    case 305 /* SpreadAssignment */:
      return bindingElement;
  }
  return void 0;
}
function getPropertyNameOfBindingOrAssignmentElement(bindingElement) {
  const propertyName = tryGetPropertyNameOfBindingOrAssignmentElement(bindingElement);
  Debug.assert(!!propertyName || isSpreadAssignment(bindingElement), "Invalid property name for binding element.");
  return propertyName;
}
function tryGetPropertyNameOfBindingOrAssignmentElement(bindingElement) {
  switch (bindingElement.kind) {
    case 208 /* BindingElement */:
      if (bindingElement.propertyName) {
        const propertyName = bindingElement.propertyName;
        if (isPrivateIdentifier(propertyName)) {
          return Debug.failBadSyntaxKind(propertyName);
        }
        return isComputedPropertyName(propertyName) && isStringOrNumericLiteral(propertyName.expression) ? propertyName.expression : propertyName;
      }
      break;
    case 303 /* PropertyAssignment */:
      if (bindingElement.name) {
        const propertyName = bindingElement.name;
        if (isPrivateIdentifier(propertyName)) {
          return Debug.failBadSyntaxKind(propertyName);
        }
        return isComputedPropertyName(propertyName) && isStringOrNumericLiteral(propertyName.expression) ? propertyName.expression : propertyName;
      }
      break;
    case 305 /* SpreadAssignment */:
      if (bindingElement.name && isPrivateIdentifier(bindingElement.name)) {
        return Debug.failBadSyntaxKind(bindingElement.name);
      }
      return bindingElement.name;
  }
  const target = getTargetOfBindingOrAssignmentElement(bindingElement);
  if (target && isPropertyName(target)) {
    return target;
  }
}
function isStringOrNumericLiteral(node) {
  const kind = node.kind;
  return kind === 11 /* StringLiteral */ || kind === 9 /* NumericLiteral */;
}
function getElementsOfBindingOrAssignmentPattern(name) {
  switch (name.kind) {
    case 206 /* ObjectBindingPattern */:
    case 207 /* ArrayBindingPattern */:
    case 209 /* ArrayLiteralExpression */:
      return name.elements;
    case 210 /* ObjectLiteralExpression */:
      return name.properties;
  }
}
function getJSDocTypeAliasName(fullName) {
  if (fullName) {
    let rightNode = fullName;
    while (true) {
      if (isIdentifier(rightNode) || !rightNode.body) {
        return isIdentifier(rightNode) ? rightNode : rightNode.name;
      }
      rightNode = rightNode.body;
    }
  }
}
function canHaveIllegalTypeParameters(node) {
  const kind = node.kind;
  return kind === 176 /* Constructor */ || kind === 177 /* GetAccessor */ || kind === 178 /* SetAccessor */;
}
function canHaveIllegalDecorators(node) {
  const kind = node.kind;
  return kind === 303 /* PropertyAssignment */ || kind === 304 /* ShorthandPropertyAssignment */ || kind === 262 /* FunctionDeclaration */ || kind === 176 /* Constructor */ || kind === 181 /* IndexSignature */ || kind === 175 /* ClassStaticBlockDeclaration */ || kind === 282 /* MissingDeclaration */ || kind === 243 /* VariableStatement */ || kind === 264 /* InterfaceDeclaration */ || kind === 265 /* TypeAliasDeclaration */ || kind === 266 /* EnumDeclaration */ || kind === 267 /* ModuleDeclaration */ || kind === 271 /* ImportEqualsDeclaration */ || kind === 272 /* ImportDeclaration */ || kind === 270 /* NamespaceExportDeclaration */ || kind === 278 /* ExportDeclaration */ || kind === 277 /* ExportAssignment */;
}
function canHaveIllegalModifiers(node) {
  const kind = node.kind;
  return kind === 175 /* ClassStaticBlockDeclaration */ || kind === 303 /* PropertyAssignment */ || kind === 304 /* ShorthandPropertyAssignment */ || kind === 282 /* MissingDeclaration */ || kind === 270 /* NamespaceExportDeclaration */;
}
function isQuestionOrExclamationToken(node) {
  return isQuestionToken(node) || isExclamationToken(node);
}
function isIdentifierOrThisTypeNode(node) {
  return isIdentifier(node) || isThisTypeNode(node);
}
function isReadonlyKeywordOrPlusOrMinusToken(node) {
  return isReadonlyKeyword(node) || isPlusToken(node) || isMinusToken(node);
}
function isQuestionOrPlusOrMinusToken(node) {
  return isQuestionToken(node) || isPlusToken(node) || isMinusToken(node);
}
function isModuleName(node) {
  return isIdentifier(node) || isStringLiteral(node);
}
function isExponentiationOperator(kind) {
  return kind === 43 /* AsteriskAsteriskToken */;
}
function isMultiplicativeOperator(kind) {
  return kind === 42 /* AsteriskToken */ || kind === 44 /* SlashToken */ || kind === 45 /* PercentToken */;
}
function isMultiplicativeOperatorOrHigher(kind) {
  return isExponentiationOperator(kind) || isMultiplicativeOperator(kind);
}
function isAdditiveOperator(kind) {
  return kind === 40 /* PlusToken */ || kind === 41 /* MinusToken */;
}
function isAdditiveOperatorOrHigher(kind) {
  return isAdditiveOperator(kind) || isMultiplicativeOperatorOrHigher(kind);
}
function isShiftOperator(kind) {
  return kind === 48 /* LessThanLessThanToken */ || kind === 49 /* GreaterThanGreaterThanToken */ || kind === 50 /* GreaterThanGreaterThanGreaterThanToken */;
}
function isShiftOperatorOrHigher(kind) {
  return isShiftOperator(kind) || isAdditiveOperatorOrHigher(kind);
}
function isRelationalOperator(kind) {
  return kind === 30 /* LessThanToken */ || kind === 33 /* LessThanEqualsToken */ || kind === 32 /* GreaterThanToken */ || kind === 34 /* GreaterThanEqualsToken */ || kind === 104 /* InstanceOfKeyword */ || kind === 103 /* InKeyword */;
}
function isRelationalOperatorOrHigher(kind) {
  return isRelationalOperator(kind) || isShiftOperatorOrHigher(kind);
}
function isEqualityOperator(kind) {
  return kind === 35 /* EqualsEqualsToken */ || kind === 37 /* EqualsEqualsEqualsToken */ || kind === 36 /* ExclamationEqualsToken */ || kind === 38 /* ExclamationEqualsEqualsToken */;
}
function isEqualityOperatorOrHigher(kind) {
  return isEqualityOperator(kind) || isRelationalOperatorOrHigher(kind);
}
function isBitwiseOperator(kind) {
  return kind === 51 /* AmpersandToken */ || kind === 52 /* BarToken */ || kind === 53 /* CaretToken */;
}
function isBitwiseOperatorOrHigher(kind) {
  return isBitwiseOperator(kind) || isEqualityOperatorOrHigher(kind);
}
function isLogicalOperator2(kind) {
  return kind === 56 /* AmpersandAmpersandToken */ || kind === 57 /* BarBarToken */;
}
function isLogicalOperatorOrHigher(kind) {
  return isLogicalOperator2(kind) || isBitwiseOperatorOrHigher(kind);
}
function isAssignmentOperatorOrHigher(kind) {
  return kind === 61 /* QuestionQuestionToken */ || isLogicalOperatorOrHigher(kind) || isAssignmentOperator(kind);
}
function isBinaryOperator(kind) {
  return isAssignmentOperatorOrHigher(kind) || kind === 28 /* CommaToken */;
}
function isBinaryOperatorToken(node) {
  return isBinaryOperator(node.kind);
}
var BinaryExpressionState;
((BinaryExpressionState2) => {
  function enter(machine, stackIndex, stateStack, nodeStack, userStateStack, _resultHolder, outerState) {
    const prevUserState = stackIndex > 0 ? userStateStack[stackIndex - 1] : void 0;
    Debug.assertEqual(stateStack[stackIndex], enter);
    userStateStack[stackIndex] = machine.onEnter(nodeStack[stackIndex], prevUserState, outerState);
    stateStack[stackIndex] = nextState(machine, enter);
    return stackIndex;
  }
  BinaryExpressionState2.enter = enter;
  function left(machine, stackIndex, stateStack, nodeStack, userStateStack, _resultHolder, _outerState) {
    Debug.assertEqual(stateStack[stackIndex], left);
    Debug.assertIsDefined(machine.onLeft);
    stateStack[stackIndex] = nextState(machine, left);
    const nextNode = machine.onLeft(nodeStack[stackIndex].left, userStateStack[stackIndex], nodeStack[stackIndex]);
    if (nextNode) {
      checkCircularity(stackIndex, nodeStack, nextNode);
      return pushStack(stackIndex, stateStack, nodeStack, userStateStack, nextNode);
    }
    return stackIndex;
  }
  BinaryExpressionState2.left = left;
  function operator(machine, stackIndex, stateStack, nodeStack, userStateStack, _resultHolder, _outerState) {
    Debug.assertEqual(stateStack[stackIndex], operator);
    Debug.assertIsDefined(machine.onOperator);
    stateStack[stackIndex] = nextState(machine, operator);
    machine.onOperator(nodeStack[stackIndex].operatorToken, userStateStack[stackIndex], nodeStack[stackIndex]);
    return stackIndex;
  }
  BinaryExpressionState2.operator = operator;
  function right(machine, stackIndex, stateStack, nodeStack, userStateStack, _resultHolder, _outerState) {
    Debug.assertEqual(stateStack[stackIndex], right);
    Debug.assertIsDefined(machine.onRight);
    stateStack[stackIndex] = nextState(machine, right);
    const nextNode = machine.onRight(nodeStack[stackIndex].right, userStateStack[stackIndex], nodeStack[stackIndex]);
    if (nextNode) {
      checkCircularity(stackIndex, nodeStack, nextNode);
      return pushStack(stackIndex, stateStack, nodeStack, userStateStack, nextNode);
    }
    return stackIndex;
  }
  BinaryExpressionState2.right = right;
  function exit(machine, stackIndex, stateStack, nodeStack, userStateStack, resultHolder, _outerState) {
    Debug.assertEqual(stateStack[stackIndex], exit);
    stateStack[stackIndex] = nextState(machine, exit);
    const result = machine.onExit(nodeStack[stackIndex], userStateStack[stackIndex]);
    if (stackIndex > 0) {
      stackIndex--;
      if (machine.foldState) {
        const side = stateStack[stackIndex] === exit ? "right" : "left";
        userStateStack[stackIndex] = machine.foldState(userStateStack[stackIndex], result, side);
      }
    } else {
      resultHolder.value = result;
    }
    return stackIndex;
  }
  BinaryExpressionState2.exit = exit;
  function done(_machine, stackIndex, stateStack, _nodeStack, _userStateStack, _resultHolder, _outerState) {
    Debug.assertEqual(stateStack[stackIndex], done);
    return stackIndex;
  }
  BinaryExpressionState2.done = done;
  function nextState(machine, currentState) {
    switch (currentState) {
      case enter:
        if (machine.onLeft)
          return left;
      case left:
        if (machine.onOperator)
          return operator;
      case operator:
        if (machine.onRight)
          return right;
      case right:
        return exit;
      case exit:
        return done;
      case done:
        return done;
      default:
        Debug.fail("Invalid state");
    }
  }
  BinaryExpressionState2.nextState = nextState;
  function pushStack(stackIndex, stateStack, nodeStack, userStateStack, node) {
    stackIndex++;
    stateStack[stackIndex] = enter;
    nodeStack[stackIndex] = node;
    userStateStack[stackIndex] = void 0;
    return stackIndex;
  }
  function checkCircularity(stackIndex, nodeStack, node) {
    if (Debug.shouldAssert(2 /* Aggressive */)) {
      while (stackIndex >= 0) {
        Debug.assert(nodeStack[stackIndex] !== node, "Circular traversal detected.");
        stackIndex--;
      }
    }
  }
})(BinaryExpressionState || (BinaryExpressionState = {}));
var BinaryExpressionStateMachine = class {
  constructor(onEnter, onLeft, onOperator, onRight, onExit, foldState) {
    this.onEnter = onEnter;
    this.onLeft = onLeft;
    this.onOperator = onOperator;
    this.onRight = onRight;
    this.onExit = onExit;
    this.foldState = foldState;
  }
};
function createBinaryExpressionTrampoline(onEnter, onLeft, onOperator, onRight, onExit, foldState) {
  const machine = new BinaryExpressionStateMachine(onEnter, onLeft, onOperator, onRight, onExit, foldState);
  return trampoline;
  function trampoline(node, outerState) {
    const resultHolder = { value: void 0 };
    const stateStack = [BinaryExpressionState.enter];
    const nodeStack = [node];
    const userStateStack = [void 0];
    let stackIndex = 0;
    while (stateStack[stackIndex] !== BinaryExpressionState.done) {
      stackIndex = stateStack[stackIndex](machine, stackIndex, stateStack, nodeStack, userStateStack, resultHolder, outerState);
    }
    Debug.assertEqual(stackIndex, 0);
    return resultHolder.value;
  }
}
function isExportOrDefaultKeywordKind(kind) {
  return kind === 95 /* ExportKeyword */ || kind === 90 /* DefaultKeyword */;
}
function isExportOrDefaultModifier(node) {
  const kind = node.kind;
  return isExportOrDefaultKeywordKind(kind);
}
function elideNodes(factory2, nodes) {
  if (nodes === void 0)
    return void 0;
  if (nodes.length === 0)
    return nodes;
  return setTextRange(factory2.createNodeArray([], nodes.hasTrailingComma), nodes);
}
function getNodeForGeneratedName(name) {
  var _a;
  const autoGenerate = name.emitNode.autoGenerate;
  if (autoGenerate.flags & 4 /* Node */) {
    const autoGenerateId = autoGenerate.id;
    let node = name;
    let original = node.original;
    while (original) {
      node = original;
      const autoGenerate2 = (_a = node.emitNode) == null ? void 0 : _a.autoGenerate;
      if (isMemberName(node) && (autoGenerate2 === void 0 || !!(autoGenerate2.flags & 4 /* Node */) && autoGenerate2.id !== autoGenerateId)) {
        break;
      }
      original = node.original;
    }
    return node;
  }
  return name;
}
function formatGeneratedNamePart(part, generateName) {
  return typeof part === "object" ? formatGeneratedName(
    /*privateName*/
    false,
    part.prefix,
    part.node,
    part.suffix,
    generateName
  ) : typeof part === "string" ? part.length > 0 && part.charCodeAt(0) === 35 /* hash */ ? part.slice(1) : part : "";
}
function formatIdentifier(name, generateName) {
  return typeof name === "string" ? name : formatIdentifierWorker(name, Debug.checkDefined(generateName));
}
function formatIdentifierWorker(node, generateName) {
  return isGeneratedPrivateIdentifier(node) ? generateName(node).slice(1) : isGeneratedIdentifier(node) ? generateName(node) : isPrivateIdentifier(node) ? node.escapedText.slice(1) : idText(node);
}
function formatGeneratedName(privateName, prefix, baseName, suffix, generateName) {
  prefix = formatGeneratedNamePart(prefix, generateName);
  suffix = formatGeneratedNamePart(suffix, generateName);
  baseName = formatIdentifier(baseName, generateName);
  return `${privateName ? "#" : ""}${prefix}${baseName}${suffix}`;
}
function createAccessorPropertyBackingField(factory2, node, modifiers, initializer) {
  return factory2.updatePropertyDeclaration(
    node,
    modifiers,
    factory2.getGeneratedPrivateNameForNode(
      node.name,
      /*prefix*/
      void 0,
      "_accessor_storage"
    ),
    /*questionOrExclamationToken*/
    void 0,
    /*type*/
    void 0,
    initializer
  );
}
function createAccessorPropertyGetRedirector(factory2, node, modifiers, name, receiver = factory2.createThis()) {
  return factory2.createGetAccessorDeclaration(
    modifiers,
    name,
    [],
    /*type*/
    void 0,
    factory2.createBlock([
      factory2.createReturnStatement(
        factory2.createPropertyAccessExpression(
          receiver,
          factory2.getGeneratedPrivateNameForNode(
            node.name,
            /*prefix*/
            void 0,
            "_accessor_storage"
          )
        )
      )
    ])
  );
}
function createAccessorPropertySetRedirector(factory2, node, modifiers, name, receiver = factory2.createThis()) {
  return factory2.createSetAccessorDeclaration(
    modifiers,
    name,
    [factory2.createParameterDeclaration(
      /*modifiers*/
      void 0,
      /*dotDotDotToken*/
      void 0,
      "value"
    )],
    factory2.createBlock([
      factory2.createExpressionStatement(
        factory2.createAssignment(
          factory2.createPropertyAccessExpression(
            receiver,
            factory2.getGeneratedPrivateNameForNode(
              node.name,
              /*prefix*/
              void 0,
              "_accessor_storage"
            )
          ),
          factory2.createIdentifier("value")
        )
      )
    ])
  );
}
function findComputedPropertyNameCacheAssignment(name) {
  let node = name.expression;
  while (true) {
    node = skipOuterExpressions(node);
    if (isCommaListExpression(node)) {
      node = last(node.elements);
      continue;
    }
    if (isCommaExpression(node)) {
      node = node.right;
      continue;
    }
    if (isAssignmentExpression(
      node,
      /*excludeCompoundAssignment*/
      true
    ) && isGeneratedIdentifier(node.left)) {
      return node;
    }
    break;
  }
}
function isSyntheticParenthesizedExpression(node) {
  return isParenthesizedExpression(node) && nodeIsSynthesized(node) && !node.emitNode;
}
function flattenCommaListWorker(node, expressions) {
  if (isSyntheticParenthesizedExpression(node)) {
    flattenCommaListWorker(node.expression, expressions);
  } else if (isCommaExpression(node)) {
    flattenCommaListWorker(node.left, expressions);
    flattenCommaListWorker(node.right, expressions);
  } else if (isCommaListExpression(node)) {
    for (const child of node.elements) {
      flattenCommaListWorker(child, expressions);
    }
  } else {
    expressions.push(node);
  }
}
function flattenCommaList(node) {
  const expressions = [];
  flattenCommaListWorker(node, expressions);
  return expressions;
}
function containsObjectRestOrSpread(node) {
  if (node.transformFlags & 65536 /* ContainsObjectRestOrSpread */)
    return true;
  if (node.transformFlags & 128 /* ContainsES2018 */) {
    for (const element of getElementsOfBindingOrAssignmentPattern(node)) {
      const target = getTargetOfBindingOrAssignmentElement(element);
      if (target && isAssignmentPattern(target)) {
        if (target.transformFlags & 65536 /* ContainsObjectRestOrSpread */) {
          return true;
        }
        if (target.transformFlags & 128 /* ContainsES2018 */) {
          if (containsObjectRestOrSpread(target))
            return true;
        }
      }
    }
  }
  return false;
}

// src/compiler/factory/utilitiesPublic.ts
function setTextRange(range, location) {
  return location ? setTextRangePosEnd(range, location.pos, location.end) : range;
}
function canHaveModifiers(node) {
  const kind = node.kind;
  return kind === 168 /* TypeParameter */ || kind === 169 /* Parameter */ || kind === 171 /* PropertySignature */ || kind === 172 /* PropertyDeclaration */ || kind === 173 /* MethodSignature */ || kind === 174 /* MethodDeclaration */ || kind === 176 /* Constructor */ || kind === 177 /* GetAccessor */ || kind === 178 /* SetAccessor */ || kind === 181 /* IndexSignature */ || kind === 185 /* ConstructorType */ || kind === 218 /* FunctionExpression */ || kind === 219 /* ArrowFunction */ || kind === 231 /* ClassExpression */ || kind === 243 /* VariableStatement */ || kind === 262 /* FunctionDeclaration */ || kind === 263 /* ClassDeclaration */ || kind === 264 /* InterfaceDeclaration */ || kind === 265 /* TypeAliasDeclaration */ || kind === 266 /* EnumDeclaration */ || kind === 267 /* ModuleDeclaration */ || kind === 271 /* ImportEqualsDeclaration */ || kind === 272 /* ImportDeclaration */ || kind === 277 /* ExportAssignment */ || kind === 278 /* ExportDeclaration */;
}
function canHaveDecorators(node) {
  const kind = node.kind;
  return kind === 169 /* Parameter */ || kind === 172 /* PropertyDeclaration */ || kind === 174 /* MethodDeclaration */ || kind === 177 /* GetAccessor */ || kind === 178 /* SetAccessor */ || kind === 231 /* ClassExpression */ || kind === 263 /* ClassDeclaration */;
}

// src/compiler/parser.ts
var NodeConstructor;
var TokenConstructor;
var IdentifierConstructor;
var PrivateIdentifierConstructor;
var SourceFileConstructor;
var parseBaseNodeFactory = {
  createBaseSourceFileNode: (kind) => new (SourceFileConstructor || (SourceFileConstructor = objectAllocator.getSourceFileConstructor()))(kind, -1, -1),
  createBaseIdentifierNode: (kind) => new (IdentifierConstructor || (IdentifierConstructor = objectAllocator.getIdentifierConstructor()))(kind, -1, -1),
  createBasePrivateIdentifierNode: (kind) => new (PrivateIdentifierConstructor || (PrivateIdentifierConstructor = objectAllocator.getPrivateIdentifierConstructor()))(kind, -1, -1),
  createBaseTokenNode: (kind) => new (TokenConstructor || (TokenConstructor = objectAllocator.getTokenConstructor()))(kind, -1, -1),
  createBaseNode: (kind) => new (NodeConstructor || (NodeConstructor = objectAllocator.getNodeConstructor()))(kind, -1, -1)
};
var parseNodeFactory = createNodeFactory(1 /* NoParenthesizerRules */, parseBaseNodeFactory);
function visitNode2(cbNode, node) {
  return node && cbNode(node);
}
function visitNodes(cbNode, cbNodes, nodes) {
  if (nodes) {
    if (cbNodes) {
      return cbNodes(nodes);
    }
    for (const node of nodes) {
      const result = cbNode(node);
      if (result) {
        return result;
      }
    }
  }
}
function isJSDocLikeText(text, start) {
  return text.charCodeAt(start + 1) === 42 /* asterisk */ && text.charCodeAt(start + 2) === 42 /* asterisk */ && text.charCodeAt(start + 3) !== 47 /* slash */;
}
function isFileProbablyExternalModule(sourceFile) {
  return forEach(sourceFile.statements, isAnExternalModuleIndicatorNode) || getImportMetaIfNecessary(sourceFile);
}
function isAnExternalModuleIndicatorNode(node) {
  return canHaveModifiers(node) && hasModifierOfKind(node, 95 /* ExportKeyword */) || isImportEqualsDeclaration(node) && isExternalModuleReference(node.moduleReference) || isImportDeclaration(node) || isExportAssignment(node) || isExportDeclaration(node) ? node : void 0;
}
function getImportMetaIfNecessary(sourceFile) {
  return sourceFile.flags & 8388608 /* PossiblyContainsImportMeta */ ? walkTreeForImportMeta(sourceFile) : void 0;
}
function walkTreeForImportMeta(node) {
  return isImportMeta2(node) ? node : forEachChild(node, walkTreeForImportMeta);
}
function hasModifierOfKind(node, kind) {
  return some(node.modifiers, (m) => m.kind === kind);
}
function isImportMeta2(node) {
  return isMetaProperty(node) && node.keywordToken === 102 /* ImportKeyword */ && node.name.escapedText === "meta";
}
var forEachChildTable = {
  [166 /* QualifiedName */]: function forEachChildInQualifiedName(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.left) || visitNode2(cbNode, node.right);
  },
  [168 /* TypeParameter */]: function forEachChildInTypeParameter(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.name) || visitNode2(cbNode, node.constraint) || visitNode2(cbNode, node.default) || visitNode2(cbNode, node.expression);
  },
  [304 /* ShorthandPropertyAssignment */]: function forEachChildInShorthandPropertyAssignment(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.name) || visitNode2(cbNode, node.questionToken) || visitNode2(cbNode, node.exclamationToken) || visitNode2(cbNode, node.equalsToken) || visitNode2(cbNode, node.objectAssignmentInitializer);
  },
  [305 /* SpreadAssignment */]: function forEachChildInSpreadAssignment(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression);
  },
  [169 /* Parameter */]: function forEachChildInParameter(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.dotDotDotToken) || visitNode2(cbNode, node.name) || visitNode2(cbNode, node.questionToken) || visitNode2(cbNode, node.type) || visitNode2(cbNode, node.initializer);
  },
  [172 /* PropertyDeclaration */]: function forEachChildInPropertyDeclaration(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.name) || visitNode2(cbNode, node.questionToken) || visitNode2(cbNode, node.exclamationToken) || visitNode2(cbNode, node.type) || visitNode2(cbNode, node.initializer);
  },
  [171 /* PropertySignature */]: function forEachChildInPropertySignature(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.name) || visitNode2(cbNode, node.questionToken) || visitNode2(cbNode, node.type) || visitNode2(cbNode, node.initializer);
  },
  [303 /* PropertyAssignment */]: function forEachChildInPropertyAssignment(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.name) || visitNode2(cbNode, node.questionToken) || visitNode2(cbNode, node.exclamationToken) || visitNode2(cbNode, node.initializer);
  },
  [260 /* VariableDeclaration */]: function forEachChildInVariableDeclaration(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.name) || visitNode2(cbNode, node.exclamationToken) || visitNode2(cbNode, node.type) || visitNode2(cbNode, node.initializer);
  },
  [208 /* BindingElement */]: function forEachChildInBindingElement(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.dotDotDotToken) || visitNode2(cbNode, node.propertyName) || visitNode2(cbNode, node.name) || visitNode2(cbNode, node.initializer);
  },
  [181 /* IndexSignature */]: function forEachChildInIndexSignature(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNodes(cbNode, cbNodes, node.typeParameters) || visitNodes(cbNode, cbNodes, node.parameters) || visitNode2(cbNode, node.type);
  },
  [185 /* ConstructorType */]: function forEachChildInConstructorType(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNodes(cbNode, cbNodes, node.typeParameters) || visitNodes(cbNode, cbNodes, node.parameters) || visitNode2(cbNode, node.type);
  },
  [184 /* FunctionType */]: function forEachChildInFunctionType(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNodes(cbNode, cbNodes, node.typeParameters) || visitNodes(cbNode, cbNodes, node.parameters) || visitNode2(cbNode, node.type);
  },
  [179 /* CallSignature */]: forEachChildInCallOrConstructSignature,
  [180 /* ConstructSignature */]: forEachChildInCallOrConstructSignature,
  [174 /* MethodDeclaration */]: function forEachChildInMethodDeclaration(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.asteriskToken) || visitNode2(cbNode, node.name) || visitNode2(cbNode, node.questionToken) || visitNode2(cbNode, node.exclamationToken) || visitNodes(cbNode, cbNodes, node.typeParameters) || visitNodes(cbNode, cbNodes, node.parameters) || visitNode2(cbNode, node.type) || visitNode2(cbNode, node.body);
  },
  [173 /* MethodSignature */]: function forEachChildInMethodSignature(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.name) || visitNode2(cbNode, node.questionToken) || visitNodes(cbNode, cbNodes, node.typeParameters) || visitNodes(cbNode, cbNodes, node.parameters) || visitNode2(cbNode, node.type);
  },
  [176 /* Constructor */]: function forEachChildInConstructor(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.name) || visitNodes(cbNode, cbNodes, node.typeParameters) || visitNodes(cbNode, cbNodes, node.parameters) || visitNode2(cbNode, node.type) || visitNode2(cbNode, node.body);
  },
  [177 /* GetAccessor */]: function forEachChildInGetAccessor(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.name) || visitNodes(cbNode, cbNodes, node.typeParameters) || visitNodes(cbNode, cbNodes, node.parameters) || visitNode2(cbNode, node.type) || visitNode2(cbNode, node.body);
  },
  [178 /* SetAccessor */]: function forEachChildInSetAccessor(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.name) || visitNodes(cbNode, cbNodes, node.typeParameters) || visitNodes(cbNode, cbNodes, node.parameters) || visitNode2(cbNode, node.type) || visitNode2(cbNode, node.body);
  },
  [262 /* FunctionDeclaration */]: function forEachChildInFunctionDeclaration(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.asteriskToken) || visitNode2(cbNode, node.name) || visitNodes(cbNode, cbNodes, node.typeParameters) || visitNodes(cbNode, cbNodes, node.parameters) || visitNode2(cbNode, node.type) || visitNode2(cbNode, node.body);
  },
  [218 /* FunctionExpression */]: function forEachChildInFunctionExpression(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.asteriskToken) || visitNode2(cbNode, node.name) || visitNodes(cbNode, cbNodes, node.typeParameters) || visitNodes(cbNode, cbNodes, node.parameters) || visitNode2(cbNode, node.type) || visitNode2(cbNode, node.body);
  },
  [219 /* ArrowFunction */]: function forEachChildInArrowFunction(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNodes(cbNode, cbNodes, node.typeParameters) || visitNodes(cbNode, cbNodes, node.parameters) || visitNode2(cbNode, node.type) || visitNode2(cbNode, node.equalsGreaterThanToken) || visitNode2(cbNode, node.body);
  },
  [175 /* ClassStaticBlockDeclaration */]: function forEachChildInClassStaticBlockDeclaration(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.body);
  },
  [183 /* TypeReference */]: function forEachChildInTypeReference(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.typeName) || visitNodes(cbNode, cbNodes, node.typeArguments);
  },
  [182 /* TypePredicate */]: function forEachChildInTypePredicate(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.assertsModifier) || visitNode2(cbNode, node.parameterName) || visitNode2(cbNode, node.type);
  },
  [186 /* TypeQuery */]: function forEachChildInTypeQuery(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.exprName) || visitNodes(cbNode, cbNodes, node.typeArguments);
  },
  [187 /* TypeLiteral */]: function forEachChildInTypeLiteral(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.members);
  },
  [188 /* ArrayType */]: function forEachChildInArrayType(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.elementType);
  },
  [189 /* TupleType */]: function forEachChildInTupleType(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.elements);
  },
  [192 /* UnionType */]: forEachChildInUnionOrIntersectionType,
  [193 /* IntersectionType */]: forEachChildInUnionOrIntersectionType,
  [194 /* ConditionalType */]: function forEachChildInConditionalType(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.checkType) || visitNode2(cbNode, node.extendsType) || visitNode2(cbNode, node.trueType) || visitNode2(cbNode, node.falseType);
  },
  [195 /* InferType */]: function forEachChildInInferType(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.typeParameter);
  },
  [205 /* ImportType */]: function forEachChildInImportType(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.argument) || visitNode2(cbNode, node.attributes) || visitNode2(cbNode, node.qualifier) || visitNodes(cbNode, cbNodes, node.typeArguments);
  },
  [302 /* ImportTypeAssertionContainer */]: function forEachChildInImportTypeAssertionContainer(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.assertClause);
  },
  [196 /* ParenthesizedType */]: forEachChildInParenthesizedTypeOrTypeOperator,
  [198 /* TypeOperator */]: forEachChildInParenthesizedTypeOrTypeOperator,
  [199 /* IndexedAccessType */]: function forEachChildInIndexedAccessType(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.objectType) || visitNode2(cbNode, node.indexType);
  },
  [200 /* MappedType */]: function forEachChildInMappedType(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.readonlyToken) || visitNode2(cbNode, node.typeParameter) || visitNode2(cbNode, node.nameType) || visitNode2(cbNode, node.questionToken) || visitNode2(cbNode, node.type) || visitNodes(cbNode, cbNodes, node.members);
  },
  [201 /* LiteralType */]: function forEachChildInLiteralType(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.literal);
  },
  [202 /* NamedTupleMember */]: function forEachChildInNamedTupleMember(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.dotDotDotToken) || visitNode2(cbNode, node.name) || visitNode2(cbNode, node.questionToken) || visitNode2(cbNode, node.type);
  },
  [206 /* ObjectBindingPattern */]: forEachChildInObjectOrArrayBindingPattern,
  [207 /* ArrayBindingPattern */]: forEachChildInObjectOrArrayBindingPattern,
  [209 /* ArrayLiteralExpression */]: function forEachChildInArrayLiteralExpression(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.elements);
  },
  [210 /* ObjectLiteralExpression */]: function forEachChildInObjectLiteralExpression(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.properties);
  },
  [211 /* PropertyAccessExpression */]: function forEachChildInPropertyAccessExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression) || visitNode2(cbNode, node.questionDotToken) || visitNode2(cbNode, node.name);
  },
  [212 /* ElementAccessExpression */]: function forEachChildInElementAccessExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression) || visitNode2(cbNode, node.questionDotToken) || visitNode2(cbNode, node.argumentExpression);
  },
  [213 /* CallExpression */]: forEachChildInCallOrNewExpression,
  [214 /* NewExpression */]: forEachChildInCallOrNewExpression,
  [215 /* TaggedTemplateExpression */]: function forEachChildInTaggedTemplateExpression(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.tag) || visitNode2(cbNode, node.questionDotToken) || visitNodes(cbNode, cbNodes, node.typeArguments) || visitNode2(cbNode, node.template);
  },
  [216 /* TypeAssertionExpression */]: function forEachChildInTypeAssertionExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.type) || visitNode2(cbNode, node.expression);
  },
  [217 /* ParenthesizedExpression */]: function forEachChildInParenthesizedExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression);
  },
  [220 /* DeleteExpression */]: function forEachChildInDeleteExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression);
  },
  [221 /* TypeOfExpression */]: function forEachChildInTypeOfExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression);
  },
  [222 /* VoidExpression */]: function forEachChildInVoidExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression);
  },
  [224 /* PrefixUnaryExpression */]: function forEachChildInPrefixUnaryExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.operand);
  },
  [229 /* YieldExpression */]: function forEachChildInYieldExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.asteriskToken) || visitNode2(cbNode, node.expression);
  },
  [223 /* AwaitExpression */]: function forEachChildInAwaitExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression);
  },
  [225 /* PostfixUnaryExpression */]: function forEachChildInPostfixUnaryExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.operand);
  },
  [226 /* BinaryExpression */]: function forEachChildInBinaryExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.left) || visitNode2(cbNode, node.operatorToken) || visitNode2(cbNode, node.right);
  },
  [234 /* AsExpression */]: function forEachChildInAsExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression) || visitNode2(cbNode, node.type);
  },
  [235 /* NonNullExpression */]: function forEachChildInNonNullExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression);
  },
  [238 /* SatisfiesExpression */]: function forEachChildInSatisfiesExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression) || visitNode2(cbNode, node.type);
  },
  [236 /* MetaProperty */]: function forEachChildInMetaProperty(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.name);
  },
  [227 /* ConditionalExpression */]: function forEachChildInConditionalExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.condition) || visitNode2(cbNode, node.questionToken) || visitNode2(cbNode, node.whenTrue) || visitNode2(cbNode, node.colonToken) || visitNode2(cbNode, node.whenFalse);
  },
  [230 /* SpreadElement */]: function forEachChildInSpreadElement(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression);
  },
  [241 /* Block */]: forEachChildInBlock,
  [268 /* ModuleBlock */]: forEachChildInBlock,
  [312 /* SourceFile */]: function forEachChildInSourceFile(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.statements) || visitNode2(cbNode, node.endOfFileToken);
  },
  [243 /* VariableStatement */]: function forEachChildInVariableStatement(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.declarationList);
  },
  [261 /* VariableDeclarationList */]: function forEachChildInVariableDeclarationList(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.declarations);
  },
  [244 /* ExpressionStatement */]: function forEachChildInExpressionStatement(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression);
  },
  [245 /* IfStatement */]: function forEachChildInIfStatement(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression) || visitNode2(cbNode, node.thenStatement) || visitNode2(cbNode, node.elseStatement);
  },
  [246 /* DoStatement */]: function forEachChildInDoStatement(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.statement) || visitNode2(cbNode, node.expression);
  },
  [247 /* WhileStatement */]: function forEachChildInWhileStatement(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression) || visitNode2(cbNode, node.statement);
  },
  [248 /* ForStatement */]: function forEachChildInForStatement(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.initializer) || visitNode2(cbNode, node.condition) || visitNode2(cbNode, node.incrementor) || visitNode2(cbNode, node.statement);
  },
  [249 /* ForInStatement */]: function forEachChildInForInStatement(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.initializer) || visitNode2(cbNode, node.expression) || visitNode2(cbNode, node.statement);
  },
  [250 /* ForOfStatement */]: function forEachChildInForOfStatement(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.awaitModifier) || visitNode2(cbNode, node.initializer) || visitNode2(cbNode, node.expression) || visitNode2(cbNode, node.statement);
  },
  [251 /* ContinueStatement */]: forEachChildInContinueOrBreakStatement,
  [252 /* BreakStatement */]: forEachChildInContinueOrBreakStatement,
  [253 /* ReturnStatement */]: function forEachChildInReturnStatement(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression);
  },
  [254 /* WithStatement */]: function forEachChildInWithStatement(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression) || visitNode2(cbNode, node.statement);
  },
  [255 /* SwitchStatement */]: function forEachChildInSwitchStatement(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression) || visitNode2(cbNode, node.caseBlock);
  },
  [269 /* CaseBlock */]: function forEachChildInCaseBlock(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.clauses);
  },
  [296 /* CaseClause */]: function forEachChildInCaseClause(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.expression) || visitNodes(cbNode, cbNodes, node.statements);
  },
  [297 /* DefaultClause */]: function forEachChildInDefaultClause(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.statements);
  },
  [256 /* LabeledStatement */]: function forEachChildInLabeledStatement(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.label) || visitNode2(cbNode, node.statement);
  },
  [257 /* ThrowStatement */]: function forEachChildInThrowStatement(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression);
  },
  [258 /* TryStatement */]: function forEachChildInTryStatement(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.tryBlock) || visitNode2(cbNode, node.catchClause) || visitNode2(cbNode, node.finallyBlock);
  },
  [299 /* CatchClause */]: function forEachChildInCatchClause(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.variableDeclaration) || visitNode2(cbNode, node.block);
  },
  [170 /* Decorator */]: function forEachChildInDecorator(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression);
  },
  [263 /* ClassDeclaration */]: forEachChildInClassDeclarationOrExpression,
  [231 /* ClassExpression */]: forEachChildInClassDeclarationOrExpression,
  [264 /* InterfaceDeclaration */]: function forEachChildInInterfaceDeclaration(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.name) || visitNodes(cbNode, cbNodes, node.typeParameters) || visitNodes(cbNode, cbNodes, node.heritageClauses) || visitNodes(cbNode, cbNodes, node.members);
  },
  [265 /* TypeAliasDeclaration */]: function forEachChildInTypeAliasDeclaration(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.name) || visitNodes(cbNode, cbNodes, node.typeParameters) || visitNode2(cbNode, node.type);
  },
  [266 /* EnumDeclaration */]: function forEachChildInEnumDeclaration(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.name) || visitNodes(cbNode, cbNodes, node.members);
  },
  [306 /* EnumMember */]: function forEachChildInEnumMember(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.name) || visitNode2(cbNode, node.initializer);
  },
  [267 /* ModuleDeclaration */]: function forEachChildInModuleDeclaration(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.name) || visitNode2(cbNode, node.body);
  },
  [271 /* ImportEqualsDeclaration */]: function forEachChildInImportEqualsDeclaration(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.name) || visitNode2(cbNode, node.moduleReference);
  },
  [272 /* ImportDeclaration */]: function forEachChildInImportDeclaration(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.importClause) || visitNode2(cbNode, node.moduleSpecifier) || visitNode2(cbNode, node.attributes);
  },
  [273 /* ImportClause */]: function forEachChildInImportClause(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.name) || visitNode2(cbNode, node.namedBindings);
  },
  [300 /* ImportAttributes */]: function forEachChildInImportAttributes(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.elements);
  },
  [301 /* ImportAttribute */]: function forEachChildInImportAttribute(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.name) || visitNode2(cbNode, node.value);
  },
  [270 /* NamespaceExportDeclaration */]: function forEachChildInNamespaceExportDeclaration(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.name);
  },
  [274 /* NamespaceImport */]: function forEachChildInNamespaceImport(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.name);
  },
  [280 /* NamespaceExport */]: function forEachChildInNamespaceExport(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.name);
  },
  [275 /* NamedImports */]: forEachChildInNamedImportsOrExports,
  [279 /* NamedExports */]: forEachChildInNamedImportsOrExports,
  [278 /* ExportDeclaration */]: function forEachChildInExportDeclaration(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.exportClause) || visitNode2(cbNode, node.moduleSpecifier) || visitNode2(cbNode, node.attributes);
  },
  [276 /* ImportSpecifier */]: forEachChildInImportOrExportSpecifier,
  [281 /* ExportSpecifier */]: forEachChildInImportOrExportSpecifier,
  [277 /* ExportAssignment */]: function forEachChildInExportAssignment(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.expression);
  },
  [228 /* TemplateExpression */]: function forEachChildInTemplateExpression(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.head) || visitNodes(cbNode, cbNodes, node.templateSpans);
  },
  [239 /* TemplateSpan */]: function forEachChildInTemplateSpan(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression) || visitNode2(cbNode, node.literal);
  },
  [203 /* TemplateLiteralType */]: function forEachChildInTemplateLiteralType(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.head) || visitNodes(cbNode, cbNodes, node.templateSpans);
  },
  [204 /* TemplateLiteralTypeSpan */]: function forEachChildInTemplateLiteralTypeSpan(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.type) || visitNode2(cbNode, node.literal);
  },
  [167 /* ComputedPropertyName */]: function forEachChildInComputedPropertyName(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression);
  },
  [298 /* HeritageClause */]: function forEachChildInHeritageClause(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.types);
  },
  [233 /* ExpressionWithTypeArguments */]: function forEachChildInExpressionWithTypeArguments(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.expression) || visitNodes(cbNode, cbNodes, node.typeArguments);
  },
  [283 /* ExternalModuleReference */]: function forEachChildInExternalModuleReference(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression);
  },
  [282 /* MissingDeclaration */]: function forEachChildInMissingDeclaration(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.modifiers);
  },
  [361 /* CommaListExpression */]: function forEachChildInCommaListExpression(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.elements);
  },
  [284 /* JsxElement */]: function forEachChildInJsxElement(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.openingElement) || visitNodes(cbNode, cbNodes, node.children) || visitNode2(cbNode, node.closingElement);
  },
  [288 /* JsxFragment */]: function forEachChildInJsxFragment(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.openingFragment) || visitNodes(cbNode, cbNodes, node.children) || visitNode2(cbNode, node.closingFragment);
  },
  [285 /* JsxSelfClosingElement */]: forEachChildInJsxOpeningOrSelfClosingElement,
  [286 /* JsxOpeningElement */]: forEachChildInJsxOpeningOrSelfClosingElement,
  [292 /* JsxAttributes */]: function forEachChildInJsxAttributes(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.properties);
  },
  [291 /* JsxAttribute */]: function forEachChildInJsxAttribute(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.name) || visitNode2(cbNode, node.initializer);
  },
  [293 /* JsxSpreadAttribute */]: function forEachChildInJsxSpreadAttribute(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.expression);
  },
  [294 /* JsxExpression */]: function forEachChildInJsxExpression(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.dotDotDotToken) || visitNode2(cbNode, node.expression);
  },
  [287 /* JsxClosingElement */]: function forEachChildInJsxClosingElement(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.tagName);
  },
  [295 /* JsxNamespacedName */]: function forEachChildInJsxNamespacedName(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.namespace) || visitNode2(cbNode, node.name);
  },
  [190 /* OptionalType */]: forEachChildInOptionalRestOrJSDocParameterModifier,
  [191 /* RestType */]: forEachChildInOptionalRestOrJSDocParameterModifier,
  [316 /* JSDocTypeExpression */]: forEachChildInOptionalRestOrJSDocParameterModifier,
  [322 /* JSDocNonNullableType */]: forEachChildInOptionalRestOrJSDocParameterModifier,
  [321 /* JSDocNullableType */]: forEachChildInOptionalRestOrJSDocParameterModifier,
  [323 /* JSDocOptionalType */]: forEachChildInOptionalRestOrJSDocParameterModifier,
  [325 /* JSDocVariadicType */]: forEachChildInOptionalRestOrJSDocParameterModifier,
  [324 /* JSDocFunctionType */]: function forEachChildInJSDocFunctionType(node, cbNode, cbNodes) {
    return visitNodes(cbNode, cbNodes, node.parameters) || visitNode2(cbNode, node.type);
  },
  [327 /* JSDoc */]: function forEachChildInJSDoc(node, cbNode, cbNodes) {
    return (typeof node.comment === "string" ? void 0 : visitNodes(cbNode, cbNodes, node.comment)) || visitNodes(cbNode, cbNodes, node.tags);
  },
  [354 /* JSDocSeeTag */]: function forEachChildInJSDocSeeTag(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.tagName) || visitNode2(cbNode, node.name) || (typeof node.comment === "string" ? void 0 : visitNodes(cbNode, cbNodes, node.comment));
  },
  [317 /* JSDocNameReference */]: function forEachChildInJSDocNameReference(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.name);
  },
  [318 /* JSDocMemberName */]: function forEachChildInJSDocMemberName(node, cbNode, _cbNodes) {
    return visitNode2(cbNode, node.left) || visitNode2(cbNode, node.right);
  },
  [348 /* JSDocParameterTag */]: forEachChildInJSDocParameterOrPropertyTag,
  [355 /* JSDocPropertyTag */]: forEachChildInJSDocParameterOrPropertyTag,
  [337 /* JSDocAuthorTag */]: function forEachChildInJSDocAuthorTag(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.tagName) || (typeof node.comment === "string" ? void 0 : visitNodes(cbNode, cbNodes, node.comment));
  },
  [336 /* JSDocImplementsTag */]: function forEachChildInJSDocImplementsTag(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.tagName) || visitNode2(cbNode, node.class) || (typeof node.comment === "string" ? void 0 : visitNodes(cbNode, cbNodes, node.comment));
  },
  [335 /* JSDocAugmentsTag */]: function forEachChildInJSDocAugmentsTag(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.tagName) || visitNode2(cbNode, node.class) || (typeof node.comment === "string" ? void 0 : visitNodes(cbNode, cbNodes, node.comment));
  },
  [352 /* JSDocTemplateTag */]: function forEachChildInJSDocTemplateTag(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.tagName) || visitNode2(cbNode, node.constraint) || visitNodes(cbNode, cbNodes, node.typeParameters) || (typeof node.comment === "string" ? void 0 : visitNodes(cbNode, cbNodes, node.comment));
  },
  [353 /* JSDocTypedefTag */]: function forEachChildInJSDocTypedefTag(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.tagName) || (node.typeExpression && node.typeExpression.kind === 316 /* JSDocTypeExpression */ ? visitNode2(cbNode, node.typeExpression) || visitNode2(cbNode, node.fullName) || (typeof node.comment === "string" ? void 0 : visitNodes(cbNode, cbNodes, node.comment)) : visitNode2(cbNode, node.fullName) || visitNode2(cbNode, node.typeExpression) || (typeof node.comment === "string" ? void 0 : visitNodes(cbNode, cbNodes, node.comment)));
  },
  [345 /* JSDocCallbackTag */]: function forEachChildInJSDocCallbackTag(node, cbNode, cbNodes) {
    return visitNode2(cbNode, node.tagName) || visitNode2(cbNode, node.fullName) || visitNode2(cbNode, node.typeExpression) || (typeof node.comment === "string" ? void 0 : visitNodes(cbNode, cbNodes, node.comment));
  },
  [349 /* JSDocReturnTag */]: forEachChildInJSDocTypeLikeTag,
  [351 /* JSDocTypeTag */]: forEachChildInJSDocTypeLikeTag,
  [350 /* JSDocThisTag */]: forEachChildInJSDocTypeLikeTag,
  [347 /* JSDocEnumTag */]: forEachChildInJSDocTypeLikeTag,
  [357 /* JSDocSatisfiesTag */]: forEachChildInJSDocTypeLikeTag,
  [356 /* JSDocThrowsTag */]: forEachChildInJSDocTypeLikeTag,
  [346 /* JSDocOverloadTag */]: forEachChildInJSDocTypeLikeTag,
  [330 /* JSDocSignature */]: function forEachChildInJSDocSignature(node, cbNode, _cbNodes) {
    return forEach(node.typeParameters, cbNode) || forEach(node.parameters, cbNode) || visitNode2(cbNode, node.type);
  },
  [331 /* JSDocLink */]: forEachChildInJSDocLinkCodeOrPlain,
  [332 /* JSDocLinkCode */]: forEachChildInJSDocLinkCodeOrPlain,
  [333 /* JSDocLinkPlain */]: forEachChildInJSDocLinkCodeOrPlain,
  [329 /* JSDocTypeLiteral */]: function forEachChildInJSDocTypeLiteral(node, cbNode, _cbNodes) {
    return forEach(node.jsDocPropertyTags, cbNode);
  },
  [334 /* JSDocTag */]: forEachChildInJSDocTag,
  [339 /* JSDocClassTag */]: forEachChildInJSDocTag,
  [340 /* JSDocPublicTag */]: forEachChildInJSDocTag,
  [341 /* JSDocPrivateTag */]: forEachChildInJSDocTag,
  [342 /* JSDocProtectedTag */]: forEachChildInJSDocTag,
  [343 /* JSDocReadonlyTag */]: forEachChildInJSDocTag,
  [338 /* JSDocDeprecatedTag */]: forEachChildInJSDocTag,
  [344 /* JSDocOverrideTag */]: forEachChildInJSDocTag,
  [360 /* PartiallyEmittedExpression */]: forEachChildInPartiallyEmittedExpression
};
function forEachChildInCallOrConstructSignature(node, cbNode, cbNodes) {
  return visitNodes(cbNode, cbNodes, node.typeParameters) || visitNodes(cbNode, cbNodes, node.parameters) || visitNode2(cbNode, node.type);
}
function forEachChildInUnionOrIntersectionType(node, cbNode, cbNodes) {
  return visitNodes(cbNode, cbNodes, node.types);
}
function forEachChildInParenthesizedTypeOrTypeOperator(node, cbNode, _cbNodes) {
  return visitNode2(cbNode, node.type);
}
function forEachChildInObjectOrArrayBindingPattern(node, cbNode, cbNodes) {
  return visitNodes(cbNode, cbNodes, node.elements);
}
function forEachChildInCallOrNewExpression(node, cbNode, cbNodes) {
  return visitNode2(cbNode, node.expression) || // TODO: should we separate these branches out?
  visitNode2(cbNode, node.questionDotToken) || visitNodes(cbNode, cbNodes, node.typeArguments) || visitNodes(cbNode, cbNodes, node.arguments);
}
function forEachChildInBlock(node, cbNode, cbNodes) {
  return visitNodes(cbNode, cbNodes, node.statements);
}
function forEachChildInContinueOrBreakStatement(node, cbNode, _cbNodes) {
  return visitNode2(cbNode, node.label);
}
function forEachChildInClassDeclarationOrExpression(node, cbNode, cbNodes) {
  return visitNodes(cbNode, cbNodes, node.modifiers) || visitNode2(cbNode, node.name) || visitNodes(cbNode, cbNodes, node.typeParameters) || visitNodes(cbNode, cbNodes, node.heritageClauses) || visitNodes(cbNode, cbNodes, node.members);
}
function forEachChildInNamedImportsOrExports(node, cbNode, cbNodes) {
  return visitNodes(cbNode, cbNodes, node.elements);
}
function forEachChildInImportOrExportSpecifier(node, cbNode, _cbNodes) {
  return visitNode2(cbNode, node.propertyName) || visitNode2(cbNode, node.name);
}
function forEachChildInJsxOpeningOrSelfClosingElement(node, cbNode, cbNodes) {
  return visitNode2(cbNode, node.tagName) || visitNodes(cbNode, cbNodes, node.typeArguments) || visitNode2(cbNode, node.attributes);
}
function forEachChildInOptionalRestOrJSDocParameterModifier(node, cbNode, _cbNodes) {
  return visitNode2(cbNode, node.type);
}
function forEachChildInJSDocParameterOrPropertyTag(node, cbNode, cbNodes) {
  return visitNode2(cbNode, node.tagName) || (node.isNameFirst ? visitNode2(cbNode, node.name) || visitNode2(cbNode, node.typeExpression) : visitNode2(cbNode, node.typeExpression) || visitNode2(cbNode, node.name)) || (typeof node.comment === "string" ? void 0 : visitNodes(cbNode, cbNodes, node.comment));
}
function forEachChildInJSDocTypeLikeTag(node, cbNode, cbNodes) {
  return visitNode2(cbNode, node.tagName) || visitNode2(cbNode, node.typeExpression) || (typeof node.comment === "string" ? void 0 : visitNodes(cbNode, cbNodes, node.comment));
}
function forEachChildInJSDocLinkCodeOrPlain(node, cbNode, _cbNodes) {
  return visitNode2(cbNode, node.name);
}
function forEachChildInJSDocTag(node, cbNode, cbNodes) {
  return visitNode2(cbNode, node.tagName) || (typeof node.comment === "string" ? void 0 : visitNodes(cbNode, cbNodes, node.comment));
}
function forEachChildInPartiallyEmittedExpression(node, cbNode, _cbNodes) {
  return visitNode2(cbNode, node.expression);
}
function forEachChild(node, cbNode, cbNodes) {
  if (node === void 0 || node.kind <= 165 /* LastToken */) {
    return;
  }
  const fn = forEachChildTable[node.kind];
  return fn === void 0 ? void 0 : fn(node, cbNode, cbNodes);
}
function forEachChildRecursively(rootNode, cbNode, cbNodes) {
  const queue = gatherPossibleChildren(rootNode);
  const parents = [];
  while (parents.length < queue.length) {
    parents.push(rootNode);
  }
  while (queue.length !== 0) {
    const current = queue.pop();
    const parent = parents.pop();
    if (isArray(current)) {
      if (cbNodes) {
        const res = cbNodes(current, parent);
        if (res) {
          if (res === "skip")
            continue;
          return res;
        }
      }
      for (let i = current.length - 1; i >= 0; --i) {
        queue.push(current[i]);
        parents.push(parent);
      }
    } else {
      const res = cbNode(current, parent);
      if (res) {
        if (res === "skip")
          continue;
        return res;
      }
      if (current.kind >= 166 /* FirstNode */) {
        for (const child of gatherPossibleChildren(current)) {
          queue.push(child);
          parents.push(current);
        }
      }
    }
  }
}
function gatherPossibleChildren(node) {
  const children = [];
  forEachChild(node, addWorkItem, addWorkItem);
  return children;
  function addWorkItem(n) {
    children.unshift(n);
  }
}
function setExternalModuleIndicator(sourceFile) {
  sourceFile.externalModuleIndicator = isFileProbablyExternalModule(sourceFile);
}
function createSourceFile(fileName, sourceText, languageVersionOrOptions, setParentNodes = false, scriptKind) {
  var _a, _b, _c, _d;
  (_a = tracing) == null ? void 0 : _a.push(
    tracing.Phase.Parse,
    "createSourceFile",
    { path: fileName },
    /*separateBeginAndEnd*/
    true
  );
  mark("beforeParse");
  let result;
  (_b = perfLogger) == null ? void 0 : _b.logStartParseSourceFile(fileName);
  const {
    languageVersion,
    setExternalModuleIndicator: overrideSetExternalModuleIndicator,
    impliedNodeFormat: format,
    jsDocParsingMode
  } = typeof languageVersionOrOptions === "object" ? languageVersionOrOptions : { languageVersion: languageVersionOrOptions };
  if (languageVersion === 100 /* JSON */) {
    result = Parser.parseSourceFile(
      fileName,
      sourceText,
      languageVersion,
      /*syntaxCursor*/
      void 0,
      setParentNodes,
      6 /* JSON */,
      noop,
      jsDocParsingMode
    );
  } else {
    const setIndicator = format === void 0 ? overrideSetExternalModuleIndicator : (file) => {
      file.impliedNodeFormat = format;
      return (overrideSetExternalModuleIndicator || setExternalModuleIndicator)(file);
    };
    result = Parser.parseSourceFile(
      fileName,
      sourceText,
      languageVersion,
      /*syntaxCursor*/
      void 0,
      setParentNodes,
      scriptKind,
      setIndicator,
      jsDocParsingMode
    );
  }
  (_c = perfLogger) == null ? void 0 : _c.logStopParseSourceFile();
  mark("afterParse");
  measure("Parse", "beforeParse", "afterParse");
  (_d = tracing) == null ? void 0 : _d.pop();
  return result;
}
function parseIsolatedEntityName(text, languageVersion) {
  return Parser.parseIsolatedEntityName(text, languageVersion);
}
function parseJsonText(fileName, sourceText) {
  return Parser.parseJsonText(fileName, sourceText);
}
function isExternalModule(file) {
  return file.externalModuleIndicator !== void 0;
}
var Parser;
((Parser2) => {
  var scanner = createScanner(
    99 /* Latest */,
    /*skipTrivia*/
    true
  );
  var disallowInAndDecoratorContext = 8192 /* DisallowInContext */ | 32768 /* DecoratorContext */;
  var NodeConstructor2;
  var TokenConstructor2;
  var IdentifierConstructor2;
  var PrivateIdentifierConstructor2;
  var SourceFileConstructor2;
  function countNode(node) {
    nodeCount++;
    return node;
  }
  var baseNodeFactory = {
    createBaseSourceFileNode: (kind) => countNode(new SourceFileConstructor2(
      kind,
      /*pos*/
      0,
      /*end*/
      0
    )),
    createBaseIdentifierNode: (kind) => countNode(new IdentifierConstructor2(
      kind,
      /*pos*/
      0,
      /*end*/
      0
    )),
    createBasePrivateIdentifierNode: (kind) => countNode(new PrivateIdentifierConstructor2(
      kind,
      /*pos*/
      0,
      /*end*/
      0
    )),
    createBaseTokenNode: (kind) => countNode(new TokenConstructor2(
      kind,
      /*pos*/
      0,
      /*end*/
      0
    )),
    createBaseNode: (kind) => countNode(new NodeConstructor2(
      kind,
      /*pos*/
      0,
      /*end*/
      0
    ))
  };
  var factory2 = createNodeFactory(1 /* NoParenthesizerRules */ | 2 /* NoNodeConverters */ | 8 /* NoOriginalNode */, baseNodeFactory);
  var {
    createNodeArray: factoryCreateNodeArray,
    createNumericLiteral: factoryCreateNumericLiteral,
    createStringLiteral: factoryCreateStringLiteral,
    createLiteralLikeNode: factoryCreateLiteralLikeNode,
    createIdentifier: factoryCreateIdentifier,
    createPrivateIdentifier: factoryCreatePrivateIdentifier,
    createToken: factoryCreateToken,
    createArrayLiteralExpression: factoryCreateArrayLiteralExpression,
    createObjectLiteralExpression: factoryCreateObjectLiteralExpression,
    createPropertyAccessExpression: factoryCreatePropertyAccessExpression,
    createPropertyAccessChain: factoryCreatePropertyAccessChain,
    createElementAccessExpression: factoryCreateElementAccessExpression,
    createElementAccessChain: factoryCreateElementAccessChain,
    createCallExpression: factoryCreateCallExpression,
    createCallChain: factoryCreateCallChain,
    createNewExpression: factoryCreateNewExpression,
    createParenthesizedExpression: factoryCreateParenthesizedExpression,
    createBlock: factoryCreateBlock,
    createVariableStatement: factoryCreateVariableStatement,
    createExpressionStatement: factoryCreateExpressionStatement,
    createIfStatement: factoryCreateIfStatement,
    createWhileStatement: factoryCreateWhileStatement,
    createForStatement: factoryCreateForStatement,
    createForOfStatement: factoryCreateForOfStatement,
    createVariableDeclaration: factoryCreateVariableDeclaration,
    createVariableDeclarationList: factoryCreateVariableDeclarationList
  } = factory2;
  var fileName;
  var sourceFlags;
  var sourceText;
  var languageVersion;
  var scriptKind;
  var languageVariant;
  var parseDiagnostics;
  var jsDocDiagnostics;
  var syntaxCursor;
  var currentToken;
  var nodeCount;
  var identifiers;
  var identifierCount;
  var parsingContext;
  var notParenthesizedArrow;
  var contextFlags;
  var topLevel = true;
  var parseErrorBeforeNextFinishedNode = false;
  function parseSourceFile(fileName2, sourceText2, languageVersion2, syntaxCursor2, setParentNodes = false, scriptKind2, setExternalModuleIndicatorOverride, jsDocParsingMode = 0 /* ParseAll */) {
    var _a;
    scriptKind2 = ensureScriptKind(fileName2, scriptKind2);
    if (scriptKind2 === 6 /* JSON */) {
      const result2 = parseJsonText2(fileName2, sourceText2, languageVersion2, syntaxCursor2, setParentNodes);
      convertToJson(
        result2,
        (_a = result2.statements[0]) == null ? void 0 : _a.expression,
        result2.parseDiagnostics,
        /*returnValue*/
        false,
        /*jsonConversionNotifier*/
        void 0
      );
      result2.referencedFiles = emptyArray;
      result2.typeReferenceDirectives = emptyArray;
      result2.libReferenceDirectives = emptyArray;
      result2.amdDependencies = emptyArray;
      result2.hasNoDefaultLib = false;
      result2.pragmas = emptyMap;
      return result2;
    }
    initializeState(fileName2, sourceText2, languageVersion2, syntaxCursor2, scriptKind2, jsDocParsingMode);
    const result = parseSourceFileWorker(languageVersion2, setParentNodes, scriptKind2, setExternalModuleIndicatorOverride || setExternalModuleIndicator, jsDocParsingMode);
    clearState();
    return result;
  }
  Parser2.parseSourceFile = parseSourceFile;
  function parseIsolatedEntityName2(content, languageVersion2) {
    initializeState(
      "",
      content,
      languageVersion2,
      /*syntaxCursor*/
      void 0,
      1 /* JS */,
      0 /* ParseAll */
    );
    nextToken();
    const entityName = parseEntityName(
      /*allowReservedWords*/
      true
    );
    const isValid = token() === 1 /* EndOfFileToken */ && !parseDiagnostics.length;
    clearState();
    return isValid ? entityName : void 0;
  }
  Parser2.parseIsolatedEntityName = parseIsolatedEntityName2;
  function parseJsonText2(fileName2, sourceText2, languageVersion2 = 2 /* ES2015 */, syntaxCursor2, setParentNodes = false) {
    initializeState(fileName2, sourceText2, languageVersion2, syntaxCursor2, 6 /* JSON */, 0 /* ParseAll */);
    sourceFlags = contextFlags;
    nextToken();
    const pos = getNodePos();
    let statements, endOfFileToken;
    if (token() === 1 /* EndOfFileToken */) {
      statements = createNodeArray([], pos, pos);
      endOfFileToken = parseTokenNode();
    } else {
      let expressions;
      while (token() !== 1 /* EndOfFileToken */) {
        let expression2;
        switch (token()) {
          case 23 /* OpenBracketToken */:
            expression2 = parseArrayLiteralExpression();
            break;
          case 112 /* TrueKeyword */:
          case 97 /* FalseKeyword */:
          case 106 /* NullKeyword */:
            expression2 = parseTokenNode();
            break;
          case 41 /* MinusToken */:
            if (lookAhead(() => nextToken() === 9 /* NumericLiteral */ && nextToken() !== 59 /* ColonToken */)) {
              expression2 = parsePrefixUnaryExpression();
            } else {
              expression2 = parseObjectLiteralExpression();
            }
            break;
          case 9 /* NumericLiteral */:
          case 11 /* StringLiteral */:
            if (lookAhead(() => nextToken() !== 59 /* ColonToken */)) {
              expression2 = parseLiteralNode();
              break;
            }
          default:
            expression2 = parseObjectLiteralExpression();
            break;
        }
        if (expressions && isArray(expressions)) {
          expressions.push(expression2);
        } else if (expressions) {
          expressions = [expressions, expression2];
        } else {
          expressions = expression2;
          if (token() !== 1 /* EndOfFileToken */) {
            parseErrorAtCurrentToken(Diagnostics.Unexpected_token);
          }
        }
      }
      const expression = isArray(expressions) ? finishNode(factoryCreateArrayLiteralExpression(expressions), pos) : Debug.checkDefined(expressions);
      const statement = factoryCreateExpressionStatement(expression);
      finishNode(statement, pos);
      statements = createNodeArray([statement], pos);
      endOfFileToken = parseExpectedToken(1 /* EndOfFileToken */, Diagnostics.Unexpected_token);
    }
    const sourceFile = createSourceFile2(
      fileName2,
      2 /* ES2015 */,
      6 /* JSON */,
      /*isDeclarationFile*/
      false,
      statements,
      endOfFileToken,
      sourceFlags,
      noop
    );
    if (setParentNodes) {
      fixupParentReferences(sourceFile);
    }
    sourceFile.nodeCount = nodeCount;
    sourceFile.identifierCount = identifierCount;
    sourceFile.identifiers = identifiers;
    sourceFile.parseDiagnostics = attachFileToDiagnostics(parseDiagnostics, sourceFile);
    if (jsDocDiagnostics) {
      sourceFile.jsDocDiagnostics = attachFileToDiagnostics(jsDocDiagnostics, sourceFile);
    }
    const result = sourceFile;
    clearState();
    return result;
  }
  Parser2.parseJsonText = parseJsonText2;
  function initializeState(_fileName, _sourceText, _languageVersion, _syntaxCursor, _scriptKind, _jsDocParsingMode) {
    NodeConstructor2 = objectAllocator.getNodeConstructor();
    TokenConstructor2 = objectAllocator.getTokenConstructor();
    IdentifierConstructor2 = objectAllocator.getIdentifierConstructor();
    PrivateIdentifierConstructor2 = objectAllocator.getPrivateIdentifierConstructor();
    SourceFileConstructor2 = objectAllocator.getSourceFileConstructor();
    fileName = normalizePath(_fileName);
    sourceText = _sourceText;
    languageVersion = _languageVersion;
    syntaxCursor = _syntaxCursor;
    scriptKind = _scriptKind;
    languageVariant = getLanguageVariant(_scriptKind);
    parseDiagnostics = [];
    parsingContext = 0;
    identifiers = /* @__PURE__ */ new Map();
    identifierCount = 0;
    nodeCount = 0;
    sourceFlags = 0;
    topLevel = true;
    switch (scriptKind) {
      case 1 /* JS */:
      case 2 /* JSX */:
        contextFlags = 524288 /* JavaScriptFile */;
        break;
      case 6 /* JSON */:
        contextFlags = 524288 /* JavaScriptFile */ | 134217728 /* JsonFile */;
        break;
      default:
        contextFlags = 0 /* None */;
        break;
    }
    parseErrorBeforeNextFinishedNode = false;
    scanner.setText(sourceText);
    scanner.setOnError(scanError);
    scanner.setScriptTarget(languageVersion);
    scanner.setLanguageVariant(languageVariant);
    scanner.setScriptKind(scriptKind);
    scanner.setJSDocParsingMode(_jsDocParsingMode);
  }
  function clearState() {
    scanner.clearCommentDirectives();
    scanner.setText("");
    scanner.setOnError(void 0);
    scanner.setScriptKind(0 /* Unknown */);
    scanner.setJSDocParsingMode(0 /* ParseAll */);
    sourceText = void 0;
    languageVersion = void 0;
    syntaxCursor = void 0;
    scriptKind = void 0;
    languageVariant = void 0;
    sourceFlags = 0;
    parseDiagnostics = void 0;
    jsDocDiagnostics = void 0;
    parsingContext = 0;
    identifiers = void 0;
    notParenthesizedArrow = void 0;
    topLevel = true;
  }
  function parseSourceFileWorker(languageVersion2, setParentNodes, scriptKind2, setExternalModuleIndicator2, jsDocParsingMode) {
    const isDeclarationFile = isDeclarationFileName(fileName);
    if (isDeclarationFile) {
      contextFlags |= 33554432 /* Ambient */;
    }
    sourceFlags = contextFlags;
    nextToken();
    const statements = parseList(0 /* SourceElements */, parseStatement);
    Debug.assert(token() === 1 /* EndOfFileToken */);
    const endHasJSDoc = hasPrecedingJSDocComment();
    const endOfFileToken = withJSDoc(parseTokenNode(), endHasJSDoc);
    const sourceFile = createSourceFile2(fileName, languageVersion2, scriptKind2, isDeclarationFile, statements, endOfFileToken, sourceFlags, setExternalModuleIndicator2);
    processCommentPragmas(sourceFile, sourceText);
    processPragmasIntoFields(sourceFile, reportPragmaDiagnostic);
    sourceFile.commentDirectives = scanner.getCommentDirectives();
    sourceFile.nodeCount = nodeCount;
    sourceFile.identifierCount = identifierCount;
    sourceFile.identifiers = identifiers;
    sourceFile.parseDiagnostics = attachFileToDiagnostics(parseDiagnostics, sourceFile);
    sourceFile.jsDocParsingMode = jsDocParsingMode;
    if (jsDocDiagnostics) {
      sourceFile.jsDocDiagnostics = attachFileToDiagnostics(jsDocDiagnostics, sourceFile);
    }
    if (setParentNodes) {
      fixupParentReferences(sourceFile);
    }
    return sourceFile;
    function reportPragmaDiagnostic(pos, end, diagnostic) {
      parseDiagnostics.push(createDetachedDiagnostic(fileName, sourceText, pos, end, diagnostic));
    }
  }
  let hasDeprecatedTag = false;
  function withJSDoc(node, hasJSDoc) {
    if (!hasJSDoc) {
      return node;
    }
    Debug.assert(!node.jsDoc);
    const jsDoc = mapDefined(getJSDocCommentRanges(node, sourceText), (comment) => JSDocParser.parseJSDocComment(node, comment.pos, comment.end - comment.pos));
    if (jsDoc.length)
      node.jsDoc = jsDoc;
    if (hasDeprecatedTag) {
      hasDeprecatedTag = false;
      node.flags |= 536870912 /* Deprecated */;
    }
    return node;
  }
  function reparseTopLevelAwait(sourceFile) {
    const savedSyntaxCursor = syntaxCursor;
    const baseSyntaxCursor = IncrementalParser.createSyntaxCursor(sourceFile);
    syntaxCursor = { currentNode: currentNode2 };
    const statements = [];
    const savedParseDiagnostics = parseDiagnostics;
    parseDiagnostics = [];
    let pos = 0;
    let start = findNextStatementWithAwait(sourceFile.statements, 0);
    while (start !== -1) {
      const prevStatement = sourceFile.statements[pos];
      const nextStatement = sourceFile.statements[start];
      addRange(statements, sourceFile.statements, pos, start);
      pos = findNextStatementWithoutAwait(sourceFile.statements, start);
      const diagnosticStart = findIndex(savedParseDiagnostics, (diagnostic) => diagnostic.start >= prevStatement.pos);
      const diagnosticEnd = diagnosticStart >= 0 ? findIndex(savedParseDiagnostics, (diagnostic) => diagnostic.start >= nextStatement.pos, diagnosticStart) : -1;
      if (diagnosticStart >= 0) {
        addRange(parseDiagnostics, savedParseDiagnostics, diagnosticStart, diagnosticEnd >= 0 ? diagnosticEnd : void 0);
      }
      speculationHelper(() => {
        const savedContextFlags = contextFlags;
        contextFlags |= 65536 /* AwaitContext */;
        scanner.resetTokenState(nextStatement.pos);
        nextToken();
        while (token() !== 1 /* EndOfFileToken */) {
          const startPos = scanner.getTokenFullStart();
          const statement = parseListElement(0 /* SourceElements */, parseStatement);
          statements.push(statement);
          if (startPos === scanner.getTokenFullStart()) {
            nextToken();
          }
          if (pos >= 0) {
            const nonAwaitStatement = sourceFile.statements[pos];
            if (statement.end === nonAwaitStatement.pos) {
              break;
            }
            if (statement.end > nonAwaitStatement.pos) {
              pos = findNextStatementWithoutAwait(sourceFile.statements, pos + 1);
            }
          }
        }
        contextFlags = savedContextFlags;
      }, 2 /* Reparse */);
      start = pos >= 0 ? findNextStatementWithAwait(sourceFile.statements, pos) : -1;
    }
    if (pos >= 0) {
      const prevStatement = sourceFile.statements[pos];
      addRange(statements, sourceFile.statements, pos);
      const diagnosticStart = findIndex(savedParseDiagnostics, (diagnostic) => diagnostic.start >= prevStatement.pos);
      if (diagnosticStart >= 0) {
        addRange(parseDiagnostics, savedParseDiagnostics, diagnosticStart);
      }
    }
    syntaxCursor = savedSyntaxCursor;
    return factory2.updateSourceFile(sourceFile, setTextRange(factoryCreateNodeArray(statements), sourceFile.statements));
    function containsPossibleTopLevelAwait(node) {
      return !(node.flags & 65536 /* AwaitContext */) && !!(node.transformFlags & 67108864 /* ContainsPossibleTopLevelAwait */);
    }
    function findNextStatementWithAwait(statements2, start2) {
      for (let i = start2; i < statements2.length; i++) {
        if (containsPossibleTopLevelAwait(statements2[i])) {
          return i;
        }
      }
      return -1;
    }
    function findNextStatementWithoutAwait(statements2, start2) {
      for (let i = start2; i < statements2.length; i++) {
        if (!containsPossibleTopLevelAwait(statements2[i])) {
          return i;
        }
      }
      return -1;
    }
    function currentNode2(position) {
      const node = baseSyntaxCursor.currentNode(position);
      if (topLevel && node && containsPossibleTopLevelAwait(node)) {
        node.intersectsChange = true;
      }
      return node;
    }
  }
  function fixupParentReferences(rootNode) {
    setParentRecursive(
      rootNode,
      /*incremental*/
      true
    );
  }
  Parser2.fixupParentReferences = fixupParentReferences;
  function createSourceFile2(fileName2, languageVersion2, scriptKind2, isDeclarationFile, statements, endOfFileToken, flags, setExternalModuleIndicator2) {
    let sourceFile = factory2.createSourceFile(statements, endOfFileToken, flags);
    setTextRangePosWidth(sourceFile, 0, sourceText.length);
    setFields(sourceFile);
    if (!isDeclarationFile && isExternalModule(sourceFile) && sourceFile.transformFlags & 67108864 /* ContainsPossibleTopLevelAwait */) {
      const oldSourceFile = sourceFile;
      sourceFile = reparseTopLevelAwait(sourceFile);
      if (oldSourceFile !== sourceFile)
        setFields(sourceFile);
    }
    return sourceFile;
    function setFields(sourceFile2) {
      sourceFile2.text = sourceText;
      sourceFile2.bindDiagnostics = [];
      sourceFile2.bindSuggestionDiagnostics = void 0;
      sourceFile2.languageVersion = languageVersion2;
      sourceFile2.fileName = fileName2;
      sourceFile2.languageVariant = getLanguageVariant(scriptKind2);
      sourceFile2.isDeclarationFile = isDeclarationFile;
      sourceFile2.scriptKind = scriptKind2;
      setExternalModuleIndicator2(sourceFile2);
      sourceFile2.setExternalModuleIndicator = setExternalModuleIndicator2;
    }
  }
  function setContextFlag(val, flag) {
    if (val) {
      contextFlags |= flag;
    } else {
      contextFlags &= ~flag;
    }
  }
  function setDisallowInContext(val) {
    setContextFlag(val, 8192 /* DisallowInContext */);
  }
  function setYieldContext(val) {
    setContextFlag(val, 16384 /* YieldContext */);
  }
  function setDecoratorContext(val) {
    setContextFlag(val, 32768 /* DecoratorContext */);
  }
  function setAwaitContext(val) {
    setContextFlag(val, 65536 /* AwaitContext */);
  }
  function doOutsideOfContext(context, func) {
    const contextFlagsToClear = context & contextFlags;
    if (contextFlagsToClear) {
      setContextFlag(
        /*val*/
        false,
        contextFlagsToClear
      );
      const result = func();
      setContextFlag(
        /*val*/
        true,
        contextFlagsToClear
      );
      return result;
    }
    return func();
  }
  function doInsideOfContext(context, func) {
    const contextFlagsToSet = context & ~contextFlags;
    if (contextFlagsToSet) {
      setContextFlag(
        /*val*/
        true,
        contextFlagsToSet
      );
      const result = func();
      setContextFlag(
        /*val*/
        false,
        contextFlagsToSet
      );
      return result;
    }
    return func();
  }
  function allowInAnd(func) {
    return doOutsideOfContext(8192 /* DisallowInContext */, func);
  }
  function disallowInAnd(func) {
    return doInsideOfContext(8192 /* DisallowInContext */, func);
  }
  function allowConditionalTypesAnd(func) {
    return doOutsideOfContext(131072 /* DisallowConditionalTypesContext */, func);
  }
  function disallowConditionalTypesAnd(func) {
    return doInsideOfContext(131072 /* DisallowConditionalTypesContext */, func);
  }
  function doInYieldContext(func) {
    return doInsideOfContext(16384 /* YieldContext */, func);
  }
  function doInDecoratorContext(func) {
    return doInsideOfContext(32768 /* DecoratorContext */, func);
  }
  function doInAwaitContext(func) {
    return doInsideOfContext(65536 /* AwaitContext */, func);
  }
  function doOutsideOfAwaitContext(func) {
    return doOutsideOfContext(65536 /* AwaitContext */, func);
  }
  function doInYieldAndAwaitContext(func) {
    return doInsideOfContext(16384 /* YieldContext */ | 65536 /* AwaitContext */, func);
  }
  function doOutsideOfYieldAndAwaitContext(func) {
    return doOutsideOfContext(16384 /* YieldContext */ | 65536 /* AwaitContext */, func);
  }
  function inContext(flags) {
    return (contextFlags & flags) !== 0;
  }
  function inYieldContext() {
    return inContext(16384 /* YieldContext */);
  }
  function inDisallowInContext() {
    return inContext(8192 /* DisallowInContext */);
  }
  function inDisallowConditionalTypesContext() {
    return inContext(131072 /* DisallowConditionalTypesContext */);
  }
  function inDecoratorContext() {
    return inContext(32768 /* DecoratorContext */);
  }
  function inAwaitContext() {
    return inContext(65536 /* AwaitContext */);
  }
  function parseErrorAtCurrentToken(message, ...args) {
    return parseErrorAt(scanner.getTokenStart(), scanner.getTokenEnd(), message, ...args);
  }
  function parseErrorAtPosition(start, length2, message, ...args) {
    const lastError = lastOrUndefined(parseDiagnostics);
    let result;
    if (!lastError || start !== lastError.start) {
      result = createDetachedDiagnostic(fileName, sourceText, start, length2, message, ...args);
      parseDiagnostics.push(result);
    }
    parseErrorBeforeNextFinishedNode = true;
    return result;
  }
  function parseErrorAt(start, end, message, ...args) {
    return parseErrorAtPosition(start, end - start, message, ...args);
  }
  function parseErrorAtRange(range, message, ...args) {
    parseErrorAt(range.pos, range.end, message, ...args);
  }
  function scanError(message, length2, arg0) {
    parseErrorAtPosition(scanner.getTokenEnd(), length2, message, arg0);
  }
  function getNodePos() {
    return scanner.getTokenFullStart();
  }
  function hasPrecedingJSDocComment() {
    return scanner.hasPrecedingJSDocComment();
  }
  function token() {
    return currentToken;
  }
  function nextTokenWithoutCheck() {
    return currentToken = scanner.scan();
  }
  function nextTokenAnd(func) {
    nextToken();
    return func();
  }
  function nextToken() {
    if (isKeyword(currentToken) && (scanner.hasUnicodeEscape() || scanner.hasExtendedUnicodeEscape())) {
      parseErrorAt(scanner.getTokenStart(), scanner.getTokenEnd(), Diagnostics.Keywords_cannot_contain_escape_characters);
    }
    return nextTokenWithoutCheck();
  }
  function nextTokenJSDoc() {
    return currentToken = scanner.scanJsDocToken();
  }
  function nextJSDocCommentTextToken(inBackticks) {
    return currentToken = scanner.scanJSDocCommentTextToken(inBackticks);
  }
  function reScanGreaterToken() {
    return currentToken = scanner.reScanGreaterToken();
  }
  function reScanSlashToken() {
    return currentToken = scanner.reScanSlashToken();
  }
  function reScanTemplateToken(isTaggedTemplate) {
    return currentToken = scanner.reScanTemplateToken(isTaggedTemplate);
  }
  function reScanLessThanToken() {
    return currentToken = scanner.reScanLessThanToken();
  }
  function reScanHashToken() {
    return currentToken = scanner.reScanHashToken();
  }
  function scanJsxIdentifier() {
    return currentToken = scanner.scanJsxIdentifier();
  }
  function scanJsxText() {
    return currentToken = scanner.scanJsxToken();
  }
  function scanJsxAttributeValue() {
    return currentToken = scanner.scanJsxAttributeValue();
  }
  function speculationHelper(callback, speculationKind) {
    const saveToken = currentToken;
    const saveParseDiagnosticsLength = parseDiagnostics.length;
    const saveParseErrorBeforeNextFinishedNode = parseErrorBeforeNextFinishedNode;
    const saveContextFlags = contextFlags;
    const result = speculationKind !== 0 /* TryParse */ ? scanner.lookAhead(callback) : scanner.tryScan(callback);
    Debug.assert(saveContextFlags === contextFlags);
    if (!result || speculationKind !== 0 /* TryParse */) {
      currentToken = saveToken;
      if (speculationKind !== 2 /* Reparse */) {
        parseDiagnostics.length = saveParseDiagnosticsLength;
      }
      parseErrorBeforeNextFinishedNode = saveParseErrorBeforeNextFinishedNode;
    }
    return result;
  }
  function lookAhead(callback) {
    return speculationHelper(callback, 1 /* Lookahead */);
  }
  function tryParse(callback) {
    return speculationHelper(callback, 0 /* TryParse */);
  }
  function isBindingIdentifier() {
    if (token() === 80 /* Identifier */) {
      return true;
    }
    return token() > 118 /* LastReservedWord */;
  }
  function isIdentifier2() {
    if (token() === 80 /* Identifier */) {
      return true;
    }
    if (token() === 127 /* YieldKeyword */ && inYieldContext()) {
      return false;
    }
    if (token() === 135 /* AwaitKeyword */ && inAwaitContext()) {
      return false;
    }
    return token() > 118 /* LastReservedWord */;
  }
  function parseExpected(kind, diagnosticMessage, shouldAdvance = true) {
    if (token() === kind) {
      if (shouldAdvance) {
        nextToken();
      }
      return true;
    }
    if (diagnosticMessage) {
      parseErrorAtCurrentToken(diagnosticMessage);
    } else {
      parseErrorAtCurrentToken(Diagnostics._0_expected, tokenToString(kind));
    }
    return false;
  }
  const viableKeywordSuggestions = Object.keys(textToKeywordObj).filter((keyword) => keyword.length > 2);
  function parseErrorForMissingSemicolonAfter(node) {
    if (isTaggedTemplateExpression(node)) {
      parseErrorAt(skipTrivia(sourceText, node.template.pos), node.template.end, Diagnostics.Module_declaration_names_may_only_use_or_quoted_strings);
      return;
    }
    const expressionText = isIdentifier(node) ? idText(node) : void 0;
    if (!expressionText || !isIdentifierText(expressionText, languageVersion)) {
      parseErrorAtCurrentToken(Diagnostics._0_expected, tokenToString(27 /* SemicolonToken */));
      return;
    }
    const pos = skipTrivia(sourceText, node.pos);
    switch (expressionText) {
      case "const":
      case "let":
      case "var":
        parseErrorAt(pos, node.end, Diagnostics.Variable_declaration_not_allowed_at_this_location);
        return;
      case "declare":
        return;
      case "interface":
        parseErrorForInvalidName(Diagnostics.Interface_name_cannot_be_0, Diagnostics.Interface_must_be_given_a_name, 19 /* OpenBraceToken */);
        return;
      case "is":
        parseErrorAt(pos, scanner.getTokenStart(), Diagnostics.A_type_predicate_is_only_allowed_in_return_type_position_for_functions_and_methods);
        return;
      case "module":
      case "namespace":
        parseErrorForInvalidName(Diagnostics.Namespace_name_cannot_be_0, Diagnostics.Namespace_must_be_given_a_name, 19 /* OpenBraceToken */);
        return;
      case "type":
        parseErrorForInvalidName(Diagnostics.Type_alias_name_cannot_be_0, Diagnostics.Type_alias_must_be_given_a_name, 64 /* EqualsToken */);
        return;
    }
    const suggestion = getSpellingSuggestion(expressionText, viableKeywordSuggestions, (n) => n) ?? getSpaceSuggestion(expressionText);
    if (suggestion) {
      parseErrorAt(pos, node.end, Diagnostics.Unknown_keyword_or_identifier_Did_you_mean_0, suggestion);
      return;
    }
    if (token() === 0 /* Unknown */) {
      return;
    }
    parseErrorAt(pos, node.end, Diagnostics.Unexpected_keyword_or_identifier);
  }
  function parseErrorForInvalidName(nameDiagnostic, blankDiagnostic, tokenIfBlankName) {
    if (token() === tokenIfBlankName) {
      parseErrorAtCurrentToken(blankDiagnostic);
    } else {
      parseErrorAtCurrentToken(nameDiagnostic, scanner.getTokenValue());
    }
  }
  function getSpaceSuggestion(expressionText) {
    for (const keyword of viableKeywordSuggestions) {
      if (expressionText.length > keyword.length + 2 && startsWith(expressionText, keyword)) {
        return `${keyword} ${expressionText.slice(keyword.length)}`;
      }
    }
    return void 0;
  }
  function parseSemicolonAfterPropertyName(name, type, initializer) {
    if (token() === 60 /* AtToken */ && !scanner.hasPrecedingLineBreak()) {
      parseErrorAtCurrentToken(Diagnostics.Decorators_must_precede_the_name_and_all_keywords_of_property_declarations);
      return;
    }
    if (token() === 21 /* OpenParenToken */) {
      parseErrorAtCurrentToken(Diagnostics.Cannot_start_a_function_call_in_a_type_annotation);
      nextToken();
      return;
    }
    if (type && !canParseSemicolon()) {
      if (initializer) {
        parseErrorAtCurrentToken(Diagnostics._0_expected, tokenToString(27 /* SemicolonToken */));
      } else {
        parseErrorAtCurrentToken(Diagnostics.Expected_for_property_initializer);
      }
      return;
    }
    if (tryParseSemicolon()) {
      return;
    }
    if (initializer) {
      parseErrorAtCurrentToken(Diagnostics._0_expected, tokenToString(27 /* SemicolonToken */));
      return;
    }
    parseErrorForMissingSemicolonAfter(name);
  }
  function parseExpectedJSDoc(kind) {
    if (token() === kind) {
      nextTokenJSDoc();
      return true;
    }
    Debug.assert(isKeywordOrPunctuation(kind));
    parseErrorAtCurrentToken(Diagnostics._0_expected, tokenToString(kind));
    return false;
  }
  function parseExpectedMatchingBrackets(openKind, closeKind, openParsed, openPosition) {
    if (token() === closeKind) {
      nextToken();
      return;
    }
    const lastError = parseErrorAtCurrentToken(Diagnostics._0_expected, tokenToString(closeKind));
    if (!openParsed) {
      return;
    }
    if (lastError) {
      addRelatedInfo(
        lastError,
        createDetachedDiagnostic(fileName, sourceText, openPosition, 1, Diagnostics.The_parser_expected_to_find_a_1_to_match_the_0_token_here, tokenToString(openKind), tokenToString(closeKind))
      );
    }
  }
  function parseOptional(t) {
    if (token() === t) {
      nextToken();
      return true;
    }
    return false;
  }
  function parseOptionalToken(t) {
    if (token() === t) {
      return parseTokenNode();
    }
    return void 0;
  }
  function parseOptionalTokenJSDoc(t) {
    if (token() === t) {
      return parseTokenNodeJSDoc();
    }
    return void 0;
  }
  function parseExpectedToken(t, diagnosticMessage, arg0) {
    return parseOptionalToken(t) || createMissingNode(
      t,
      /*reportAtCurrentPosition*/
      false,
      diagnosticMessage || Diagnostics._0_expected,
      arg0 || tokenToString(t)
    );
  }
  function parseExpectedTokenJSDoc(t) {
    const optional = parseOptionalTokenJSDoc(t);
    if (optional)
      return optional;
    Debug.assert(isKeywordOrPunctuation(t));
    return createMissingNode(
      t,
      /*reportAtCurrentPosition*/
      false,
      Diagnostics._0_expected,
      tokenToString(t)
    );
  }
  function parseTokenNode() {
    const pos = getNodePos();
    const kind = token();
    nextToken();
    return finishNode(factoryCreateToken(kind), pos);
  }
  function parseTokenNodeJSDoc() {
    const pos = getNodePos();
    const kind = token();
    nextTokenJSDoc();
    return finishNode(factoryCreateToken(kind), pos);
  }
  function canParseSemicolon() {
    if (token() === 27 /* SemicolonToken */) {
      return true;
    }
    return token() === 20 /* CloseBraceToken */ || token() === 1 /* EndOfFileToken */ || scanner.hasPrecedingLineBreak();
  }
  function tryParseSemicolon() {
    if (!canParseSemicolon()) {
      return false;
    }
    if (token() === 27 /* SemicolonToken */) {
      nextToken();
    }
    return true;
  }
  function parseSemicolon() {
    return tryParseSemicolon() || parseExpected(27 /* SemicolonToken */);
  }
  function createNodeArray(elements, pos, end, hasTrailingComma) {
    const array = factoryCreateNodeArray(elements, hasTrailingComma);
    setTextRangePosEnd(array, pos, end ?? scanner.getTokenFullStart());
    return array;
  }
  function finishNode(node, pos, end) {
    setTextRangePosEnd(node, pos, end ?? scanner.getTokenFullStart());
    if (contextFlags) {
      node.flags |= contextFlags;
    }
    if (parseErrorBeforeNextFinishedNode) {
      parseErrorBeforeNextFinishedNode = false;
      node.flags |= 262144 /* ThisNodeHasError */;
    }
    return node;
  }
  function createMissingNode(kind, reportAtCurrentPosition, diagnosticMessage, ...args) {
    if (reportAtCurrentPosition) {
      parseErrorAtPosition(scanner.getTokenFullStart(), 0, diagnosticMessage, ...args);
    } else if (diagnosticMessage) {
      parseErrorAtCurrentToken(diagnosticMessage, ...args);
    }
    const pos = getNodePos();
    const result = kind === 80 /* Identifier */ ? factoryCreateIdentifier(
      "",
      /*originalKeywordKind*/
      void 0
    ) : isTemplateLiteralKind(kind) ? factory2.createTemplateLiteralLikeNode(
      kind,
      "",
      "",
      /*templateFlags*/
      void 0
    ) : kind === 9 /* NumericLiteral */ ? factoryCreateNumericLiteral(
      "",
      /*numericLiteralFlags*/
      void 0
    ) : kind === 11 /* StringLiteral */ ? factoryCreateStringLiteral(
      "",
      /*isSingleQuote*/
      void 0
    ) : kind === 282 /* MissingDeclaration */ ? factory2.createMissingDeclaration() : factoryCreateToken(kind);
    return finishNode(result, pos);
  }
  function internIdentifier(text) {
    let identifier = identifiers.get(text);
    if (identifier === void 0) {
      identifiers.set(text, identifier = text);
    }
    return identifier;
  }
  function createIdentifier(isIdentifier3, diagnosticMessage, privateIdentifierDiagnosticMessage) {
    if (isIdentifier3) {
      identifierCount++;
      const pos = getNodePos();
      const originalKeywordKind = token();
      const text = internIdentifier(scanner.getTokenValue());
      const hasExtendedUnicodeEscape = scanner.hasExtendedUnicodeEscape();
      nextTokenWithoutCheck();
      return finishNode(factoryCreateIdentifier(text, originalKeywordKind, hasExtendedUnicodeEscape), pos);
    }
    if (token() === 81 /* PrivateIdentifier */) {
      parseErrorAtCurrentToken(privateIdentifierDiagnosticMessage || Diagnostics.Private_identifiers_are_not_allowed_outside_class_bodies);
      return createIdentifier(
        /*isIdentifier*/
        true
      );
    }
    if (token() === 0 /* Unknown */ && scanner.tryScan(() => scanner.reScanInvalidIdentifier() === 80 /* Identifier */)) {
      return createIdentifier(
        /*isIdentifier*/
        true
      );
    }
    identifierCount++;
    const reportAtCurrentPosition = token() === 1 /* EndOfFileToken */;
    const isReservedWord = scanner.isReservedWord();
    const msgArg = scanner.getTokenText();
    const defaultMessage = isReservedWord ? Diagnostics.Identifier_expected_0_is_a_reserved_word_that_cannot_be_used_here : Diagnostics.Identifier_expected;
    return createMissingNode(80 /* Identifier */, reportAtCurrentPosition, diagnosticMessage || defaultMessage, msgArg);
  }
  function parseBindingIdentifier(privateIdentifierDiagnosticMessage) {
    return createIdentifier(
      isBindingIdentifier(),
      /*diagnosticMessage*/
      void 0,
      privateIdentifierDiagnosticMessage
    );
  }
  function parseIdentifier(diagnosticMessage, privateIdentifierDiagnosticMessage) {
    return createIdentifier(isIdentifier2(), diagnosticMessage, privateIdentifierDiagnosticMessage);
  }
  function parseIdentifierName(diagnosticMessage) {
    return createIdentifier(tokenIsIdentifierOrKeyword(token()), diagnosticMessage);
  }
  function parseIdentifierNameErrorOnUnicodeEscapeSequence() {
    if (scanner.hasUnicodeEscape() || scanner.hasExtendedUnicodeEscape()) {
      parseErrorAtCurrentToken(Diagnostics.Unicode_escape_sequence_cannot_appear_here);
    }
    return createIdentifier(tokenIsIdentifierOrKeyword(token()));
  }
  function isLiteralPropertyName() {
    return tokenIsIdentifierOrKeyword(token()) || token() === 11 /* StringLiteral */ || token() === 9 /* NumericLiteral */;
  }
  function isImportAttributeName2() {
    return tokenIsIdentifierOrKeyword(token()) || token() === 11 /* StringLiteral */;
  }
  function parsePropertyNameWorker(allowComputedPropertyNames) {
    if (token() === 11 /* StringLiteral */ || token() === 9 /* NumericLiteral */) {
      const node = parseLiteralNode();
      node.text = internIdentifier(node.text);
      return node;
    }
    if (allowComputedPropertyNames && token() === 23 /* OpenBracketToken */) {
      return parseComputedPropertyName();
    }
    if (token() === 81 /* PrivateIdentifier */) {
      return parsePrivateIdentifier();
    }
    return parseIdentifierName();
  }
  function parsePropertyName() {
    return parsePropertyNameWorker(
      /*allowComputedPropertyNames*/
      true
    );
  }
  function parseComputedPropertyName() {
    const pos = getNodePos();
    parseExpected(23 /* OpenBracketToken */);
    const expression = allowInAnd(parseExpression);
    parseExpected(24 /* CloseBracketToken */);
    return finishNode(factory2.createComputedPropertyName(expression), pos);
  }
  function parsePrivateIdentifier() {
    const pos = getNodePos();
    const node = factoryCreatePrivateIdentifier(internIdentifier(scanner.getTokenValue()));
    nextToken();
    return finishNode(node, pos);
  }
  function parseContextualModifier(t) {
    return token() === t && tryParse(nextTokenCanFollowModifier);
  }
  function nextTokenIsOnSameLineAndCanFollowModifier() {
    nextToken();
    if (scanner.hasPrecedingLineBreak()) {
      return false;
    }
    return canFollowModifier();
  }
  function nextTokenCanFollowModifier() {
    switch (token()) {
      case 87 /* ConstKeyword */:
        return nextToken() === 94 /* EnumKeyword */;
      case 95 /* ExportKeyword */:
        nextToken();
        if (token() === 90 /* DefaultKeyword */) {
          return lookAhead(nextTokenCanFollowDefaultKeyword);
        }
        if (token() === 156 /* TypeKeyword */) {
          return lookAhead(nextTokenCanFollowExportModifier);
        }
        return canFollowExportModifier();
      case 90 /* DefaultKeyword */:
        return nextTokenCanFollowDefaultKeyword();
      case 126 /* StaticKeyword */:
      case 139 /* GetKeyword */:
      case 153 /* SetKeyword */:
        nextToken();
        return canFollowModifier();
      default:
        return nextTokenIsOnSameLineAndCanFollowModifier();
    }
  }
  function canFollowExportModifier() {
    return token() === 60 /* AtToken */ || token() !== 42 /* AsteriskToken */ && token() !== 130 /* AsKeyword */ && token() !== 19 /* OpenBraceToken */ && canFollowModifier();
  }
  function nextTokenCanFollowExportModifier() {
    nextToken();
    return canFollowExportModifier();
  }
  function parseAnyContextualModifier() {
    return isModifierKind(token()) && tryParse(nextTokenCanFollowModifier);
  }
  function canFollowModifier() {
    return token() === 23 /* OpenBracketToken */ || token() === 19 /* OpenBraceToken */ || token() === 42 /* AsteriskToken */ || token() === 26 /* DotDotDotToken */ || isLiteralPropertyName();
  }
  function nextTokenCanFollowDefaultKeyword() {
    nextToken();
    return token() === 86 /* ClassKeyword */ || token() === 100 /* FunctionKeyword */ || token() === 120 /* InterfaceKeyword */ || token() === 60 /* AtToken */ || token() === 128 /* AbstractKeyword */ && lookAhead(nextTokenIsClassKeywordOnSameLine) || token() === 134 /* AsyncKeyword */ && lookAhead(nextTokenIsFunctionKeywordOnSameLine);
  }
  function isListElement(parsingContext2, inErrorRecovery) {
    const node = currentNode(parsingContext2);
    if (node) {
      return true;
    }
    switch (parsingContext2) {
      case 0 /* SourceElements */:
      case 1 /* BlockStatements */:
      case 3 /* SwitchClauseStatements */:
        return !(token() === 27 /* SemicolonToken */ && inErrorRecovery) && isStartOfStatement();
      case 2 /* SwitchClauses */:
        return token() === 84 /* CaseKeyword */ || token() === 90 /* DefaultKeyword */;
      case 4 /* TypeMembers */:
        return lookAhead(isTypeMemberStart);
      case 5 /* ClassMembers */:
        return lookAhead(isClassMemberStart) || token() === 27 /* SemicolonToken */ && !inErrorRecovery;
      case 6 /* EnumMembers */:
        return token() === 23 /* OpenBracketToken */ || isLiteralPropertyName();
      case 12 /* ObjectLiteralMembers */:
        switch (token()) {
          case 23 /* OpenBracketToken */:
          case 42 /* AsteriskToken */:
          case 26 /* DotDotDotToken */:
          case 25 /* DotToken */:
            return true;
          default:
            return isLiteralPropertyName();
        }
      case 18 /* RestProperties */:
        return isLiteralPropertyName();
      case 9 /* ObjectBindingElements */:
        return token() === 23 /* OpenBracketToken */ || token() === 26 /* DotDotDotToken */ || isLiteralPropertyName();
      case 24 /* ImportAttributes */:
        return isImportAttributeName2();
      case 7 /* HeritageClauseElement */:
        if (token() === 19 /* OpenBraceToken */) {
          return lookAhead(isValidHeritageClauseObjectLiteral);
        }
        if (!inErrorRecovery) {
          return isStartOfLeftHandSideExpression() && !isHeritageClauseExtendsOrImplementsKeyword();
        } else {
          return isIdentifier2() && !isHeritageClauseExtendsOrImplementsKeyword();
        }
      case 8 /* VariableDeclarations */:
        return isBindingIdentifierOrPrivateIdentifierOrPattern();
      case 10 /* ArrayBindingElements */:
        return token() === 28 /* CommaToken */ || token() === 26 /* DotDotDotToken */ || isBindingIdentifierOrPrivateIdentifierOrPattern();
      case 19 /* TypeParameters */:
        return token() === 103 /* InKeyword */ || token() === 87 /* ConstKeyword */ || isIdentifier2();
      case 15 /* ArrayLiteralMembers */:
        switch (token()) {
          case 28 /* CommaToken */:
          case 25 /* DotToken */:
            return true;
        }
      case 11 /* ArgumentExpressions */:
        return token() === 26 /* DotDotDotToken */ || isStartOfExpression();
      case 16 /* Parameters */:
        return isStartOfParameter(
          /*isJSDocParameter*/
          false
        );
      case 17 /* JSDocParameters */:
        return isStartOfParameter(
          /*isJSDocParameter*/
          true
        );
      case 20 /* TypeArguments */:
      case 21 /* TupleElementTypes */:
        return token() === 28 /* CommaToken */ || isStartOfType();
      case 22 /* HeritageClauses */:
        return isHeritageClause2();
      case 23 /* ImportOrExportSpecifiers */:
        if (token() === 161 /* FromKeyword */ && lookAhead(nextTokenIsStringLiteral)) {
          return false;
        }
        return tokenIsIdentifierOrKeyword(token());
      case 13 /* JsxAttributes */:
        return tokenIsIdentifierOrKeyword(token()) || token() === 19 /* OpenBraceToken */;
      case 14 /* JsxChildren */:
        return true;
      case 25 /* JSDocComment */:
        return true;
      case 26 /* Count */:
        return Debug.fail("ParsingContext.Count used as a context");
      default:
        Debug.assertNever(parsingContext2, "Non-exhaustive case in 'isListElement'.");
    }
  }
  function isValidHeritageClauseObjectLiteral() {
    Debug.assert(token() === 19 /* OpenBraceToken */);
    if (nextToken() === 20 /* CloseBraceToken */) {
      const next = nextToken();
      return next === 28 /* CommaToken */ || next === 19 /* OpenBraceToken */ || next === 96 /* ExtendsKeyword */ || next === 119 /* ImplementsKeyword */;
    }
    return true;
  }
  function nextTokenIsIdentifier() {
    nextToken();
    return isIdentifier2();
  }
  function nextTokenIsIdentifierOrKeyword() {
    nextToken();
    return tokenIsIdentifierOrKeyword(token());
  }
  function nextTokenIsIdentifierOrKeywordOrGreaterThan() {
    nextToken();
    return tokenIsIdentifierOrKeywordOrGreaterThan(token());
  }
  function isHeritageClauseExtendsOrImplementsKeyword() {
    if (token() === 119 /* ImplementsKeyword */ || token() === 96 /* ExtendsKeyword */) {
      return lookAhead(nextTokenIsStartOfExpression);
    }
    return false;
  }
  function nextTokenIsStartOfExpression() {
    nextToken();
    return isStartOfExpression();
  }
  function nextTokenIsStartOfType() {
    nextToken();
    return isStartOfType();
  }
  function isListTerminator(kind) {
    if (token() === 1 /* EndOfFileToken */) {
      return true;
    }
    switch (kind) {
      case 1 /* BlockStatements */:
      case 2 /* SwitchClauses */:
      case 4 /* TypeMembers */:
      case 5 /* ClassMembers */:
      case 6 /* EnumMembers */:
      case 12 /* ObjectLiteralMembers */:
      case 9 /* ObjectBindingElements */:
      case 23 /* ImportOrExportSpecifiers */:
      case 24 /* ImportAttributes */:
        return token() === 20 /* CloseBraceToken */;
      case 3 /* SwitchClauseStatements */:
        return token() === 20 /* CloseBraceToken */ || token() === 84 /* CaseKeyword */ || token() === 90 /* DefaultKeyword */;
      case 7 /* HeritageClauseElement */:
        return token() === 19 /* OpenBraceToken */ || token() === 96 /* ExtendsKeyword */ || token() === 119 /* ImplementsKeyword */;
      case 8 /* VariableDeclarations */:
        return isVariableDeclaratorListTerminator();
      case 19 /* TypeParameters */:
        return token() === 32 /* GreaterThanToken */ || token() === 21 /* OpenParenToken */ || token() === 19 /* OpenBraceToken */ || token() === 96 /* ExtendsKeyword */ || token() === 119 /* ImplementsKeyword */;
      case 11 /* ArgumentExpressions */:
        return token() === 22 /* CloseParenToken */ || token() === 27 /* SemicolonToken */;
      case 15 /* ArrayLiteralMembers */:
      case 21 /* TupleElementTypes */:
      case 10 /* ArrayBindingElements */:
        return token() === 24 /* CloseBracketToken */;
      case 17 /* JSDocParameters */:
      case 16 /* Parameters */:
      case 18 /* RestProperties */:
        return token() === 22 /* CloseParenToken */ || token() === 24 /* CloseBracketToken */;
      case 20 /* TypeArguments */:
        return token() !== 28 /* CommaToken */;
      case 22 /* HeritageClauses */:
        return token() === 19 /* OpenBraceToken */ || token() === 20 /* CloseBraceToken */;
      case 13 /* JsxAttributes */:
        return token() === 32 /* GreaterThanToken */ || token() === 44 /* SlashToken */;
      case 14 /* JsxChildren */:
        return token() === 30 /* LessThanToken */ && lookAhead(nextTokenIsSlash);
      default:
        return false;
    }
  }
  function isVariableDeclaratorListTerminator() {
    if (canParseSemicolon()) {
      return true;
    }
    if (isInOrOfKeyword(token())) {
      return true;
    }
    if (token() === 39 /* EqualsGreaterThanToken */) {
      return true;
    }
    return false;
  }
  function isInSomeParsingContext() {
    Debug.assert(parsingContext, "Missing parsing context");
    for (let kind = 0; kind < 26 /* Count */; kind++) {
      if (parsingContext & 1 << kind) {
        if (isListElement(
          kind,
          /*inErrorRecovery*/
          true
        ) || isListTerminator(kind)) {
          return true;
        }
      }
    }
    return false;
  }
  function parseList(kind, parseElement) {
    const saveParsingContext = parsingContext;
    parsingContext |= 1 << kind;
    const list = [];
    const listPos = getNodePos();
    while (!isListTerminator(kind)) {
      if (isListElement(
        kind,
        /*inErrorRecovery*/
        false
      )) {
        list.push(parseListElement(kind, parseElement));
        continue;
      }
      if (abortParsingListOrMoveToNextToken(kind)) {
        break;
      }
    }
    parsingContext = saveParsingContext;
    return createNodeArray(list, listPos);
  }
  function parseListElement(parsingContext2, parseElement) {
    const node = currentNode(parsingContext2);
    if (node) {
      return consumeNode(node);
    }
    return parseElement();
  }
  function currentNode(parsingContext2, pos) {
    var _a;
    if (!syntaxCursor || !isReusableParsingContext(parsingContext2) || parseErrorBeforeNextFinishedNode) {
      return void 0;
    }
    const node = syntaxCursor.currentNode(pos ?? scanner.getTokenFullStart());
    if (nodeIsMissing(node) || node.intersectsChange || containsParseError(node)) {
      return void 0;
    }
    const nodeContextFlags = node.flags & 101441536 /* ContextFlags */;
    if (nodeContextFlags !== contextFlags) {
      return void 0;
    }
    if (!canReuseNode(node, parsingContext2)) {
      return void 0;
    }
    if (canHaveJSDoc(node) && ((_a = node.jsDoc) == null ? void 0 : _a.jsDocCache)) {
      node.jsDoc.jsDocCache = void 0;
    }
    return node;
  }
  function consumeNode(node) {
    scanner.resetTokenState(node.end);
    nextToken();
    return node;
  }
  function isReusableParsingContext(parsingContext2) {
    switch (parsingContext2) {
      case 5 /* ClassMembers */:
      case 2 /* SwitchClauses */:
      case 0 /* SourceElements */:
      case 1 /* BlockStatements */:
      case 3 /* SwitchClauseStatements */:
      case 6 /* EnumMembers */:
      case 4 /* TypeMembers */:
      case 8 /* VariableDeclarations */:
      case 17 /* JSDocParameters */:
      case 16 /* Parameters */:
        return true;
    }
    return false;
  }
  function canReuseNode(node, parsingContext2) {
    switch (parsingContext2) {
      case 5 /* ClassMembers */:
        return isReusableClassMember(node);
      case 2 /* SwitchClauses */:
        return isReusableSwitchClause(node);
      case 0 /* SourceElements */:
      case 1 /* BlockStatements */:
      case 3 /* SwitchClauseStatements */:
        return isReusableStatement(node);
      case 6 /* EnumMembers */:
        return isReusableEnumMember(node);
      case 4 /* TypeMembers */:
        return isReusableTypeMember(node);
      case 8 /* VariableDeclarations */:
        return isReusableVariableDeclaration(node);
      case 17 /* JSDocParameters */:
      case 16 /* Parameters */:
        return isReusableParameter(node);
    }
    return false;
  }
  function isReusableClassMember(node) {
    if (node) {
      switch (node.kind) {
        case 176 /* Constructor */:
        case 181 /* IndexSignature */:
        case 177 /* GetAccessor */:
        case 178 /* SetAccessor */:
        case 172 /* PropertyDeclaration */:
        case 240 /* SemicolonClassElement */:
          return true;
        case 174 /* MethodDeclaration */:
          const methodDeclaration = node;
          const nameIsConstructor = methodDeclaration.name.kind === 80 /* Identifier */ && methodDeclaration.name.escapedText === "constructor";
          return !nameIsConstructor;
      }
    }
    return false;
  }
  function isReusableSwitchClause(node) {
    if (node) {
      switch (node.kind) {
        case 296 /* CaseClause */:
        case 297 /* DefaultClause */:
          return true;
      }
    }
    return false;
  }
  function isReusableStatement(node) {
    if (node) {
      switch (node.kind) {
        case 262 /* FunctionDeclaration */:
        case 243 /* VariableStatement */:
        case 241 /* Block */:
        case 245 /* IfStatement */:
        case 244 /* ExpressionStatement */:
        case 257 /* ThrowStatement */:
        case 253 /* ReturnStatement */:
        case 255 /* SwitchStatement */:
        case 252 /* BreakStatement */:
        case 251 /* ContinueStatement */:
        case 249 /* ForInStatement */:
        case 250 /* ForOfStatement */:
        case 248 /* ForStatement */:
        case 247 /* WhileStatement */:
        case 254 /* WithStatement */:
        case 242 /* EmptyStatement */:
        case 258 /* TryStatement */:
        case 256 /* LabeledStatement */:
        case 246 /* DoStatement */:
        case 259 /* DebuggerStatement */:
        case 272 /* ImportDeclaration */:
        case 271 /* ImportEqualsDeclaration */:
        case 278 /* ExportDeclaration */:
        case 277 /* ExportAssignment */:
        case 267 /* ModuleDeclaration */:
        case 263 /* ClassDeclaration */:
        case 264 /* InterfaceDeclaration */:
        case 266 /* EnumDeclaration */:
        case 265 /* TypeAliasDeclaration */:
          return true;
      }
    }
    return false;
  }
  function isReusableEnumMember(node) {
    return node.kind === 306 /* EnumMember */;
  }
  function isReusableTypeMember(node) {
    if (node) {
      switch (node.kind) {
        case 180 /* ConstructSignature */:
        case 173 /* MethodSignature */:
        case 181 /* IndexSignature */:
        case 171 /* PropertySignature */:
        case 179 /* CallSignature */:
          return true;
      }
    }
    return false;
  }
  function isReusableVariableDeclaration(node) {
    if (node.kind !== 260 /* VariableDeclaration */) {
      return false;
    }
    const variableDeclarator = node;
    return variableDeclarator.initializer === void 0;
  }
  function isReusableParameter(node) {
    if (node.kind !== 169 /* Parameter */) {
      return false;
    }
    const parameter = node;
    return parameter.initializer === void 0;
  }
  function abortParsingListOrMoveToNextToken(kind) {
    parsingContextErrors(kind);
    if (isInSomeParsingContext()) {
      return true;
    }
    nextToken();
    return false;
  }
  function parsingContextErrors(context) {
    switch (context) {
      case 0 /* SourceElements */:
        return token() === 90 /* DefaultKeyword */ ? parseErrorAtCurrentToken(Diagnostics._0_expected, tokenToString(95 /* ExportKeyword */)) : parseErrorAtCurrentToken(Diagnostics.Declaration_or_statement_expected);
      case 1 /* BlockStatements */:
        return parseErrorAtCurrentToken(Diagnostics.Declaration_or_statement_expected);
      case 2 /* SwitchClauses */:
        return parseErrorAtCurrentToken(Diagnostics.case_or_default_expected);
      case 3 /* SwitchClauseStatements */:
        return parseErrorAtCurrentToken(Diagnostics.Statement_expected);
      case 18 /* RestProperties */:
      case 4 /* TypeMembers */:
        return parseErrorAtCurrentToken(Diagnostics.Property_or_signature_expected);
      case 5 /* ClassMembers */:
        return parseErrorAtCurrentToken(Diagnostics.Unexpected_token_A_constructor_method_accessor_or_property_was_expected);
      case 6 /* EnumMembers */:
        return parseErrorAtCurrentToken(Diagnostics.Enum_member_expected);
      case 7 /* HeritageClauseElement */:
        return parseErrorAtCurrentToken(Diagnostics.Expression_expected);
      case 8 /* VariableDeclarations */:
        return isKeyword(token()) ? parseErrorAtCurrentToken(Diagnostics._0_is_not_allowed_as_a_variable_declaration_name, tokenToString(token())) : parseErrorAtCurrentToken(Diagnostics.Variable_declaration_expected);
      case 9 /* ObjectBindingElements */:
        return parseErrorAtCurrentToken(Diagnostics.Property_destructuring_pattern_expected);
      case 10 /* ArrayBindingElements */:
        return parseErrorAtCurrentToken(Diagnostics.Array_element_destructuring_pattern_expected);
      case 11 /* ArgumentExpressions */:
        return parseErrorAtCurrentToken(Diagnostics.Argument_expression_expected);
      case 12 /* ObjectLiteralMembers */:
        return parseErrorAtCurrentToken(Diagnostics.Property_assignment_expected);
      case 15 /* ArrayLiteralMembers */:
        return parseErrorAtCurrentToken(Diagnostics.Expression_or_comma_expected);
      case 17 /* JSDocParameters */:
        return parseErrorAtCurrentToken(Diagnostics.Parameter_declaration_expected);
      case 16 /* Parameters */:
        return isKeyword(token()) ? parseErrorAtCurrentToken(Diagnostics._0_is_not_allowed_as_a_parameter_name, tokenToString(token())) : parseErrorAtCurrentToken(Diagnostics.Parameter_declaration_expected);
      case 19 /* TypeParameters */:
        return parseErrorAtCurrentToken(Diagnostics.Type_parameter_declaration_expected);
      case 20 /* TypeArguments */:
        return parseErrorAtCurrentToken(Diagnostics.Type_argument_expected);
      case 21 /* TupleElementTypes */:
        return parseErrorAtCurrentToken(Diagnostics.Type_expected);
      case 22 /* HeritageClauses */:
        return parseErrorAtCurrentToken(Diagnostics.Unexpected_token_expected);
      case 23 /* ImportOrExportSpecifiers */:
        if (token() === 161 /* FromKeyword */) {
          return parseErrorAtCurrentToken(Diagnostics._0_expected, "}");
        }
        return parseErrorAtCurrentToken(Diagnostics.Identifier_expected);
      case 13 /* JsxAttributes */:
        return parseErrorAtCurrentToken(Diagnostics.Identifier_expected);
      case 14 /* JsxChildren */:
        return parseErrorAtCurrentToken(Diagnostics.Identifier_expected);
      case 24 /* ImportAttributes */:
        return parseErrorAtCurrentToken(Diagnostics.Identifier_or_string_literal_expected);
      case 25 /* JSDocComment */:
        return parseErrorAtCurrentToken(Diagnostics.Identifier_expected);
      case 26 /* Count */:
        return Debug.fail("ParsingContext.Count used as a context");
      default:
        Debug.assertNever(context);
    }
  }
  function parseDelimitedList(kind, parseElement, considerSemicolonAsDelimiter) {
    const saveParsingContext = parsingContext;
    parsingContext |= 1 << kind;
    const list = [];
    const listPos = getNodePos();
    let commaStart = -1;
    while (true) {
      if (isListElement(
        kind,
        /*inErrorRecovery*/
        false
      )) {
        const startPos = scanner.getTokenFullStart();
        const result = parseListElement(kind, parseElement);
        if (!result) {
          parsingContext = saveParsingContext;
          return void 0;
        }
        list.push(result);
        commaStart = scanner.getTokenStart();
        if (parseOptional(28 /* CommaToken */)) {
          continue;
        }
        commaStart = -1;
        if (isListTerminator(kind)) {
          break;
        }
        parseExpected(28 /* CommaToken */, getExpectedCommaDiagnostic(kind));
        if (considerSemicolonAsDelimiter && token() === 27 /* SemicolonToken */ && !scanner.hasPrecedingLineBreak()) {
          nextToken();
        }
        if (startPos === scanner.getTokenFullStart()) {
          nextToken();
        }
        continue;
      }
      if (isListTerminator(kind)) {
        break;
      }
      if (abortParsingListOrMoveToNextToken(kind)) {
        break;
      }
    }
    parsingContext = saveParsingContext;
    return createNodeArray(
      list,
      listPos,
      /*end*/
      void 0,
      commaStart >= 0
    );
  }
  function getExpectedCommaDiagnostic(kind) {
    return kind === 6 /* EnumMembers */ ? Diagnostics.An_enum_member_name_must_be_followed_by_a_or : void 0;
  }
  function createMissingList() {
    const list = createNodeArray([], getNodePos());
    list.isMissingList = true;
    return list;
  }
  function isMissingList(arr) {
    return !!arr.isMissingList;
  }
  function parseBracketedList(kind, parseElement, open, close) {
    if (parseExpected(open)) {
      const result = parseDelimitedList(kind, parseElement);
      parseExpected(close);
      return result;
    }
    return createMissingList();
  }
  function parseEntityName(allowReservedWords, diagnosticMessage) {
    const pos = getNodePos();
    let entity = allowReservedWords ? parseIdentifierName(diagnosticMessage) : parseIdentifier(diagnosticMessage);
    while (parseOptional(25 /* DotToken */)) {
      if (token() === 30 /* LessThanToken */) {
        break;
      }
      entity = finishNode(
        factory2.createQualifiedName(
          entity,
          parseRightSideOfDot(
            allowReservedWords,
            /*allowPrivateIdentifiers*/
            false,
            /*allowUnicodeEscapeSequenceInIdentifierName*/
            true
          )
        ),
        pos
      );
    }
    return entity;
  }
  function createQualifiedName(entity, name) {
    return finishNode(factory2.createQualifiedName(entity, name), entity.pos);
  }
  function parseRightSideOfDot(allowIdentifierNames, allowPrivateIdentifiers, allowUnicodeEscapeSequenceInIdentifierName) {
    if (scanner.hasPrecedingLineBreak() && tokenIsIdentifierOrKeyword(token())) {
      const matchesPattern = lookAhead(nextTokenIsIdentifierOrKeywordOnSameLine);
      if (matchesPattern) {
        return createMissingNode(
          80 /* Identifier */,
          /*reportAtCurrentPosition*/
          true,
          Diagnostics.Identifier_expected
        );
      }
    }
    if (token() === 81 /* PrivateIdentifier */) {
      const node = parsePrivateIdentifier();
      return allowPrivateIdentifiers ? node : createMissingNode(
        80 /* Identifier */,
        /*reportAtCurrentPosition*/
        true,
        Diagnostics.Identifier_expected
      );
    }
    if (allowIdentifierNames) {
      return allowUnicodeEscapeSequenceInIdentifierName ? parseIdentifierName() : parseIdentifierNameErrorOnUnicodeEscapeSequence();
    }
    return parseIdentifier();
  }
  function parseTemplateSpans(isTaggedTemplate) {
    const pos = getNodePos();
    const list = [];
    let node;
    do {
      node = parseTemplateSpan(isTaggedTemplate);
      list.push(node);
    } while (node.literal.kind === 17 /* TemplateMiddle */);
    return createNodeArray(list, pos);
  }
  function parseTemplateExpression(isTaggedTemplate) {
    const pos = getNodePos();
    return finishNode(
      factory2.createTemplateExpression(
        parseTemplateHead(isTaggedTemplate),
        parseTemplateSpans(isTaggedTemplate)
      ),
      pos
    );
  }
  function parseTemplateType() {
    const pos = getNodePos();
    return finishNode(
      factory2.createTemplateLiteralType(
        parseTemplateHead(
          /*isTaggedTemplate*/
          false
        ),
        parseTemplateTypeSpans()
      ),
      pos
    );
  }
  function parseTemplateTypeSpans() {
    const pos = getNodePos();
    const list = [];
    let node;
    do {
      node = parseTemplateTypeSpan();
      list.push(node);
    } while (node.literal.kind === 17 /* TemplateMiddle */);
    return createNodeArray(list, pos);
  }
  function parseTemplateTypeSpan() {
    const pos = getNodePos();
    return finishNode(
      factory2.createTemplateLiteralTypeSpan(
        parseType(),
        parseLiteralOfTemplateSpan(
          /*isTaggedTemplate*/
          false
        )
      ),
      pos
    );
  }
  function parseLiteralOfTemplateSpan(isTaggedTemplate) {
    if (token() === 20 /* CloseBraceToken */) {
      reScanTemplateToken(isTaggedTemplate);
      return parseTemplateMiddleOrTemplateTail();
    } else {
      return parseExpectedToken(18 /* TemplateTail */, Diagnostics._0_expected, tokenToString(20 /* CloseBraceToken */));
    }
  }
  function parseTemplateSpan(isTaggedTemplate) {
    const pos = getNodePos();
    return finishNode(
      factory2.createTemplateSpan(
        allowInAnd(parseExpression),
        parseLiteralOfTemplateSpan(isTaggedTemplate)
      ),
      pos
    );
  }
  function parseLiteralNode() {
    return parseLiteralLikeNode(token());
  }
  function parseTemplateHead(isTaggedTemplate) {
    if (!isTaggedTemplate && scanner.getTokenFlags() & 26656 /* IsInvalid */) {
      reScanTemplateToken(
        /*isTaggedTemplate*/
        false
      );
    }
    const fragment = parseLiteralLikeNode(token());
    Debug.assert(fragment.kind === 16 /* TemplateHead */, "Template head has wrong token kind");
    return fragment;
  }
  function parseTemplateMiddleOrTemplateTail() {
    const fragment = parseLiteralLikeNode(token());
    Debug.assert(fragment.kind === 17 /* TemplateMiddle */ || fragment.kind === 18 /* TemplateTail */, "Template fragment has wrong token kind");
    return fragment;
  }
  function getTemplateLiteralRawText(kind) {
    const isLast = kind === 15 /* NoSubstitutionTemplateLiteral */ || kind === 18 /* TemplateTail */;
    const tokenText = scanner.getTokenText();
    return tokenText.substring(1, tokenText.length - (scanner.isUnterminated() ? 0 : isLast ? 1 : 2));
  }
  function parseLiteralLikeNode(kind) {
    const pos = getNodePos();
    const node = isTemplateLiteralKind(kind) ? factory2.createTemplateLiteralLikeNode(kind, scanner.getTokenValue(), getTemplateLiteralRawText(kind), scanner.getTokenFlags() & 7176 /* TemplateLiteralLikeFlags */) : (
      // Note that theoretically the following condition would hold true literals like 009,
      // which is not octal. But because of how the scanner separates the tokens, we would
      // never get a token like this. Instead, we would get 00 and 9 as two separate tokens.
      // We also do not need to check for negatives because any prefix operator would be part of a
      // parent unary expression.
      kind === 9 /* NumericLiteral */ ? factoryCreateNumericLiteral(scanner.getTokenValue(), scanner.getNumericLiteralFlags()) : kind === 11 /* StringLiteral */ ? factoryCreateStringLiteral(
        scanner.getTokenValue(),
        /*isSingleQuote*/
        void 0,
        scanner.hasExtendedUnicodeEscape()
      ) : isLiteralKind(kind) ? factoryCreateLiteralLikeNode(kind, scanner.getTokenValue()) : Debug.fail()
    );
    if (scanner.hasExtendedUnicodeEscape()) {
      node.hasExtendedUnicodeEscape = true;
    }
    if (scanner.isUnterminated()) {
      node.isUnterminated = true;
    }
    nextToken();
    return finishNode(node, pos);
  }
  function parseEntityNameOfTypeReference() {
    return parseEntityName(
      /*allowReservedWords*/
      true,
      Diagnostics.Type_expected
    );
  }
  function parseTypeArgumentsOfTypeReference() {
    if (!scanner.hasPrecedingLineBreak() && reScanLessThanToken() === 30 /* LessThanToken */) {
      return parseBracketedList(20 /* TypeArguments */, parseType, 30 /* LessThanToken */, 32 /* GreaterThanToken */);
    }
  }
  function parseTypeReference() {
    const pos = getNodePos();
    return finishNode(
      factory2.createTypeReferenceNode(
        parseEntityNameOfTypeReference(),
        parseTypeArgumentsOfTypeReference()
      ),
      pos
    );
  }
  function typeHasArrowFunctionBlockingParseError(node) {
    switch (node.kind) {
      case 183 /* TypeReference */:
        return nodeIsMissing(node.typeName);
      case 184 /* FunctionType */:
      case 185 /* ConstructorType */: {
        const { parameters, type } = node;
        return isMissingList(parameters) || typeHasArrowFunctionBlockingParseError(type);
      }
      case 196 /* ParenthesizedType */:
        return typeHasArrowFunctionBlockingParseError(node.type);
      default:
        return false;
    }
  }
  function parseThisTypePredicate(lhs) {
    nextToken();
    return finishNode(factory2.createTypePredicateNode(
      /*assertsModifier*/
      void 0,
      lhs,
      parseType()
    ), lhs.pos);
  }
  function parseThisTypeNode() {
    const pos = getNodePos();
    nextToken();
    return finishNode(factory2.createThisTypeNode(), pos);
  }
  function parseJSDocAllType() {
    const pos = getNodePos();
    nextToken();
    return finishNode(factory2.createJSDocAllType(), pos);
  }
  function parseJSDocNonNullableType() {
    const pos = getNodePos();
    nextToken();
    return finishNode(factory2.createJSDocNonNullableType(
      parseNonArrayType(),
      /*postfix*/
      false
    ), pos);
  }
  function parseJSDocUnknownOrNullableType() {
    const pos = getNodePos();
    nextToken();
    if (token() === 28 /* CommaToken */ || token() === 20 /* CloseBraceToken */ || token() === 22 /* CloseParenToken */ || token() === 32 /* GreaterThanToken */ || token() === 64 /* EqualsToken */ || token() === 52 /* BarToken */) {
      return finishNode(factory2.createJSDocUnknownType(), pos);
    } else {
      return finishNode(factory2.createJSDocNullableType(
        parseType(),
        /*postfix*/
        false
      ), pos);
    }
  }
  function parseJSDocFunctionType() {
    const pos = getNodePos();
    const hasJSDoc = hasPrecedingJSDocComment();
    if (tryParse(nextTokenIsOpenParen)) {
      const parameters = parseParameters(4 /* Type */ | 32 /* JSDoc */);
      const type = parseReturnType(
        59 /* ColonToken */,
        /*isType*/
        false
      );
      return withJSDoc(finishNode(factory2.createJSDocFunctionType(parameters, type), pos), hasJSDoc);
    }
    return finishNode(factory2.createTypeReferenceNode(
      parseIdentifierName(),
      /*typeArguments*/
      void 0
    ), pos);
  }
  function parseJSDocParameter() {
    const pos = getNodePos();
    let name;
    if (token() === 110 /* ThisKeyword */ || token() === 105 /* NewKeyword */) {
      name = parseIdentifierName();
      parseExpected(59 /* ColonToken */);
    }
    return finishNode(
      factory2.createParameterDeclaration(
        /*modifiers*/
        void 0,
        /*dotDotDotToken*/
        void 0,
        // TODO(rbuckton): JSDoc parameters don't have names (except `this`/`new`), should we manufacture an empty identifier?
        name,
        /*questionToken*/
        void 0,
        parseJSDocType(),
        /*initializer*/
        void 0
      ),
      pos
    );
  }
  function parseJSDocType() {
    scanner.setInJSDocType(true);
    const pos = getNodePos();
    if (parseOptional(144 /* ModuleKeyword */)) {
      const moduleTag = factory2.createJSDocNamepathType(
        /*type*/
        void 0
      );
      terminate:
        while (true) {
          switch (token()) {
            case 20 /* CloseBraceToken */:
            case 1 /* EndOfFileToken */:
            case 28 /* CommaToken */:
            case 5 /* WhitespaceTrivia */:
              break terminate;
            default:
              nextTokenJSDoc();
          }
        }
      scanner.setInJSDocType(false);
      return finishNode(moduleTag, pos);
    }
    const hasDotDotDot = parseOptional(26 /* DotDotDotToken */);
    let type = parseTypeOrTypePredicate();
    scanner.setInJSDocType(false);
    if (hasDotDotDot) {
      type = finishNode(factory2.createJSDocVariadicType(type), pos);
    }
    if (token() === 64 /* EqualsToken */) {
      nextToken();
      return finishNode(factory2.createJSDocOptionalType(type), pos);
    }
    return type;
  }
  function parseTypeQuery() {
    const pos = getNodePos();
    parseExpected(114 /* TypeOfKeyword */);
    const entityName = parseEntityName(
      /*allowReservedWords*/
      true
    );
    const typeArguments = !scanner.hasPrecedingLineBreak() ? tryParseTypeArguments() : void 0;
    return finishNode(factory2.createTypeQueryNode(entityName, typeArguments), pos);
  }
  function parseTypeParameter() {
    const pos = getNodePos();
    const modifiers = parseModifiers(
      /*allowDecorators*/
      false,
      /*permitConstAsModifier*/
      true
    );
    const name = parseIdentifier();
    let constraint;
    let expression;
    if (parseOptional(96 /* ExtendsKeyword */)) {
      if (isStartOfType() || !isStartOfExpression()) {
        constraint = parseType();
      } else {
        expression = parseUnaryExpressionOrHigher();
      }
    }
    const defaultType = parseOptional(64 /* EqualsToken */) ? parseType() : void 0;
    const node = factory2.createTypeParameterDeclaration(modifiers, name, constraint, defaultType);
    node.expression = expression;
    return finishNode(node, pos);
  }
  function parseTypeParameters() {
    if (token() === 30 /* LessThanToken */) {
      return parseBracketedList(19 /* TypeParameters */, parseTypeParameter, 30 /* LessThanToken */, 32 /* GreaterThanToken */);
    }
  }
  function isStartOfParameter(isJSDocParameter) {
    return token() === 26 /* DotDotDotToken */ || isBindingIdentifierOrPrivateIdentifierOrPattern() || isModifierKind(token()) || token() === 60 /* AtToken */ || isStartOfType(
      /*inStartOfParameter*/
      !isJSDocParameter
    );
  }
  function parseNameOfParameter(modifiers) {
    const name = parseIdentifierOrPattern(Diagnostics.Private_identifiers_cannot_be_used_as_parameters);
    if (getFullWidth(name) === 0 && !some(modifiers) && isModifierKind(token())) {
      nextToken();
    }
    return name;
  }
  function isParameterNameStart() {
    return isBindingIdentifier() || token() === 23 /* OpenBracketToken */ || token() === 19 /* OpenBraceToken */;
  }
  function parseParameter(inOuterAwaitContext) {
    return parseParameterWorker(inOuterAwaitContext);
  }
  function parseParameterForSpeculation(inOuterAwaitContext) {
    return parseParameterWorker(
      inOuterAwaitContext,
      /*allowAmbiguity*/
      false
    );
  }
  function parseParameterWorker(inOuterAwaitContext, allowAmbiguity = true) {
    const pos = getNodePos();
    const hasJSDoc = hasPrecedingJSDocComment();
    const modifiers = inOuterAwaitContext ? doInAwaitContext(() => parseModifiers(
      /*allowDecorators*/
      true
    )) : doOutsideOfAwaitContext(() => parseModifiers(
      /*allowDecorators*/
      true
    ));
    if (token() === 110 /* ThisKeyword */) {
      const node2 = factory2.createParameterDeclaration(
        modifiers,
        /*dotDotDotToken*/
        void 0,
        createIdentifier(
          /*isIdentifier*/
          true
        ),
        /*questionToken*/
        void 0,
        parseTypeAnnotation(),
        /*initializer*/
        void 0
      );
      const modifier = firstOrUndefined(modifiers);
      if (modifier) {
        parseErrorAtRange(modifier, Diagnostics.Neither_decorators_nor_modifiers_may_be_applied_to_this_parameters);
      }
      return withJSDoc(finishNode(node2, pos), hasJSDoc);
    }
    const savedTopLevel = topLevel;
    topLevel = false;
    const dotDotDotToken = parseOptionalToken(26 /* DotDotDotToken */);
    if (!allowAmbiguity && !isParameterNameStart()) {
      return void 0;
    }
    const node = withJSDoc(
      finishNode(
        factory2.createParameterDeclaration(
          modifiers,
          dotDotDotToken,
          parseNameOfParameter(modifiers),
          parseOptionalToken(58 /* QuestionToken */),
          parseTypeAnnotation(),
          parseInitializer()
        ),
        pos
      ),
      hasJSDoc
    );
    topLevel = savedTopLevel;
    return node;
  }
  function parseReturnType(returnToken, isType) {
    if (shouldParseReturnType(returnToken, isType)) {
      return allowConditionalTypesAnd(parseTypeOrTypePredicate);
    }
  }
  function shouldParseReturnType(returnToken, isType) {
    if (returnToken === 39 /* EqualsGreaterThanToken */) {
      parseExpected(returnToken);
      return true;
    } else if (parseOptional(59 /* ColonToken */)) {
      return true;
    } else if (isType && token() === 39 /* EqualsGreaterThanToken */) {
      parseErrorAtCurrentToken(Diagnostics._0_expected, tokenToString(59 /* ColonToken */));
      nextToken();
      return true;
    }
    return false;
  }
  function parseParametersWorker(flags, allowAmbiguity) {
    const savedYieldContext = inYieldContext();
    const savedAwaitContext = inAwaitContext();
    setYieldContext(!!(flags & 1 /* Yield */));
    setAwaitContext(!!(flags & 2 /* Await */));
    const parameters = flags & 32 /* JSDoc */ ? parseDelimitedList(17 /* JSDocParameters */, parseJSDocParameter) : parseDelimitedList(16 /* Parameters */, () => allowAmbiguity ? parseParameter(savedAwaitContext) : parseParameterForSpeculation(savedAwaitContext));
    setYieldContext(savedYieldContext);
    setAwaitContext(savedAwaitContext);
    return parameters;
  }
  function parseParameters(flags) {
    if (!parseExpected(21 /* OpenParenToken */)) {
      return createMissingList();
    }
    const parameters = parseParametersWorker(
      flags,
      /*allowAmbiguity*/
      true
    );
    parseExpected(22 /* CloseParenToken */);
    return parameters;
  }
  function parseTypeMemberSemicolon() {
    if (parseOptional(28 /* CommaToken */)) {
      return;
    }
    parseSemicolon();
  }
  function parseSignatureMember(kind) {
    const pos = getNodePos();
    const hasJSDoc = hasPrecedingJSDocComment();
    if (kind === 180 /* ConstructSignature */) {
      parseExpected(105 /* NewKeyword */);
    }
    const typeParameters = parseTypeParameters();
    const parameters = parseParameters(4 /* Type */);
    const type = parseReturnType(
      59 /* ColonToken */,
      /*isType*/
      true
    );
    parseTypeMemberSemicolon();
    const node = kind === 179 /* CallSignature */ ? factory2.createCallSignature(typeParameters, parameters, type) : factory2.createConstructSignature(typeParameters, parameters, type);
    return withJSDoc(finishNode(node, pos), hasJSDoc);
  }
  function isIndexSignature() {
    return token() === 23 /* OpenBracketToken */ && lookAhead(isUnambiguouslyIndexSignature);
  }
  function isUnambiguouslyIndexSignature() {
    nextToken();
    if (token() === 26 /* DotDotDotToken */ || token() === 24 /* CloseBracketToken */) {
      return true;
    }
    if (isModifierKind(token())) {
      nextToken();
      if (isIdentifier2()) {
        return true;
      }
    } else if (!isIdentifier2()) {
      return false;
    } else {
      nextToken();
    }
    if (token() === 59 /* ColonToken */ || token() === 28 /* CommaToken */) {
      return true;
    }
    if (token() !== 58 /* QuestionToken */) {
      return false;
    }
    nextToken();
    return token() === 59 /* ColonToken */ || token() === 28 /* CommaToken */ || token() === 24 /* CloseBracketToken */;
  }
  function parseIndexSignatureDeclaration(pos, hasJSDoc, modifiers) {
    const parameters = parseBracketedList(16 /* Parameters */, () => parseParameter(
      /*inOuterAwaitContext*/
      false
    ), 23 /* OpenBracketToken */, 24 /* CloseBracketToken */);
    const type = parseTypeAnnotation();
    parseTypeMemberSemicolon();
    const node = factory2.createIndexSignature(modifiers, parameters, type);
    return withJSDoc(finishNode(node, pos), hasJSDoc);
  }
  function parsePropertyOrMethodSignature(pos, hasJSDoc, modifiers) {
    const name = parsePropertyName();
    const questionToken = parseOptionalToken(58 /* QuestionToken */);
    let node;
    if (token() === 21 /* OpenParenToken */ || token() === 30 /* LessThanToken */) {
      const typeParameters = parseTypeParameters();
      const parameters = parseParameters(4 /* Type */);
      const type = parseReturnType(
        59 /* ColonToken */,
        /*isType*/
        true
      );
      node = factory2.createMethodSignature(modifiers, name, questionToken, typeParameters, parameters, type);
    } else {
      const type = parseTypeAnnotation();
      node = factory2.createPropertySignature(modifiers, name, questionToken, type);
      if (token() === 64 /* EqualsToken */)
        node.initializer = parseInitializer();
    }
    parseTypeMemberSemicolon();
    return withJSDoc(finishNode(node, pos), hasJSDoc);
  }
  function isTypeMemberStart() {
    if (token() === 21 /* OpenParenToken */ || token() === 30 /* LessThanToken */ || token() === 139 /* GetKeyword */ || token() === 153 /* SetKeyword */) {
      return true;
    }
    let idToken = false;
    while (isModifierKind(token())) {
      idToken = true;
      nextToken();
    }
    if (token() === 23 /* OpenBracketToken */) {
      return true;
    }
    if (isLiteralPropertyName()) {
      idToken = true;
      nextToken();
    }
    if (idToken) {
      return token() === 21 /* OpenParenToken */ || token() === 30 /* LessThanToken */ || token() === 58 /* QuestionToken */ || token() === 59 /* ColonToken */ || token() === 28 /* CommaToken */ || canParseSemicolon();
    }
    return false;
  }
  function parseTypeMember() {
    if (token() === 21 /* OpenParenToken */ || token() === 30 /* LessThanToken */) {
      return parseSignatureMember(179 /* CallSignature */);
    }
    if (token() === 105 /* NewKeyword */ && lookAhead(nextTokenIsOpenParenOrLessThan)) {
      return parseSignatureMember(180 /* ConstructSignature */);
    }
    const pos = getNodePos();
    const hasJSDoc = hasPrecedingJSDocComment();
    const modifiers = parseModifiers(
      /*allowDecorators*/
      false
    );
    if (parseContextualModifier(139 /* GetKeyword */)) {
      return parseAccessorDeclaration(pos, hasJSDoc, modifiers, 177 /* GetAccessor */, 4 /* Type */);
    }
    if (parseContextualModifier(153 /* SetKeyword */)) {
      return parseAccessorDeclaration(pos, hasJSDoc, modifiers, 178 /* SetAccessor */, 4 /* Type */);
    }
    if (isIndexSignature()) {
      return parseIndexSignatureDeclaration(pos, hasJSDoc, modifiers);
    }
    return parsePropertyOrMethodSignature(pos, hasJSDoc, modifiers);
  }
  function nextTokenIsOpenParenOrLessThan() {
    nextToken();
    return token() === 21 /* OpenParenToken */ || token() === 30 /* LessThanToken */;
  }
  function nextTokenIsDot() {
    return nextToken() === 25 /* DotToken */;
  }
  function nextTokenIsOpenParenOrLessThanOrDot() {
    switch (nextToken()) {
      case 21 /* OpenParenToken */:
      case 30 /* LessThanToken */:
      case 25 /* DotToken */:
        return true;
    }
    return false;
  }
  function parseTypeLiteral() {
    const pos = getNodePos();
    return finishNode(factory2.createTypeLiteralNode(parseObjectTypeMembers()), pos);
  }
  function parseObjectTypeMembers() {
    let members;
    if (parseExpected(19 /* OpenBraceToken */)) {
      members = parseList(4 /* TypeMembers */, parseTypeMember);
      parseExpected(20 /* CloseBraceToken */);
    } else {
      members = createMissingList();
    }
    return members;
  }
  function isStartOfMappedType() {
    nextToken();
    if (token() === 40 /* PlusToken */ || token() === 41 /* MinusToken */) {
      return nextToken() === 148 /* ReadonlyKeyword */;
    }
    if (token() === 148 /* ReadonlyKeyword */) {
      nextToken();
    }
    return token() === 23 /* OpenBracketToken */ && nextTokenIsIdentifier() && nextToken() === 103 /* InKeyword */;
  }
  function parseMappedTypeParameter() {
    const pos = getNodePos();
    const name = parseIdentifierName();
    parseExpected(103 /* InKeyword */);
    const type = parseType();
    return finishNode(factory2.createTypeParameterDeclaration(
      /*modifiers*/
      void 0,
      name,
      type,
      /*defaultType*/
      void 0
    ), pos);
  }
  function parseMappedType() {
    const pos = getNodePos();
    parseExpected(19 /* OpenBraceToken */);
    let readonlyToken;
    if (token() === 148 /* ReadonlyKeyword */ || token() === 40 /* PlusToken */ || token() === 41 /* MinusToken */) {
      readonlyToken = parseTokenNode();
      if (readonlyToken.kind !== 148 /* ReadonlyKeyword */) {
        parseExpected(148 /* ReadonlyKeyword */);
      }
    }
    parseExpected(23 /* OpenBracketToken */);
    const typeParameter = parseMappedTypeParameter();
    const nameType = parseOptional(130 /* AsKeyword */) ? parseType() : void 0;
    parseExpected(24 /* CloseBracketToken */);
    let questionToken;
    if (token() === 58 /* QuestionToken */ || token() === 40 /* PlusToken */ || token() === 41 /* MinusToken */) {
      questionToken = parseTokenNode();
      if (questionToken.kind !== 58 /* QuestionToken */) {
        parseExpected(58 /* QuestionToken */);
      }
    }
    const type = parseTypeAnnotation();
    parseSemicolon();
    const members = parseList(4 /* TypeMembers */, parseTypeMember);
    parseExpected(20 /* CloseBraceToken */);
    return finishNode(factory2.createMappedTypeNode(readonlyToken, typeParameter, nameType, questionToken, type, members), pos);
  }
  function parseTupleElementType() {
    const pos = getNodePos();
    if (parseOptional(26 /* DotDotDotToken */)) {
      return finishNode(factory2.createRestTypeNode(parseType()), pos);
    }
    const type = parseType();
    if (isJSDocNullableType(type) && type.pos === type.type.pos) {
      const node = factory2.createOptionalTypeNode(type.type);
      setTextRange(node, type);
      node.flags = type.flags;
      return node;
    }
    return type;
  }
  function isNextTokenColonOrQuestionColon() {
    return nextToken() === 59 /* ColonToken */ || token() === 58 /* QuestionToken */ && nextToken() === 59 /* ColonToken */;
  }
  function isTupleElementName() {
    if (token() === 26 /* DotDotDotToken */) {
      return tokenIsIdentifierOrKeyword(nextToken()) && isNextTokenColonOrQuestionColon();
    }
    return tokenIsIdentifierOrKeyword(token()) && isNextTokenColonOrQuestionColon();
  }
  function parseTupleElementNameOrTupleElementType() {
    if (lookAhead(isTupleElementName)) {
      const pos = getNodePos();
      const hasJSDoc = hasPrecedingJSDocComment();
      const dotDotDotToken = parseOptionalToken(26 /* DotDotDotToken */);
      const name = parseIdentifierName();
      const questionToken = parseOptionalToken(58 /* QuestionToken */);
      parseExpected(59 /* ColonToken */);
      const type = parseTupleElementType();
      const node = factory2.createNamedTupleMember(dotDotDotToken, name, questionToken, type);
      return withJSDoc(finishNode(node, pos), hasJSDoc);
    }
    return parseTupleElementType();
  }
  function parseTupleType() {
    const pos = getNodePos();
    return finishNode(
      factory2.createTupleTypeNode(
        parseBracketedList(21 /* TupleElementTypes */, parseTupleElementNameOrTupleElementType, 23 /* OpenBracketToken */, 24 /* CloseBracketToken */)
      ),
      pos
    );
  }
  function parseParenthesizedType() {
    const pos = getNodePos();
    parseExpected(21 /* OpenParenToken */);
    const type = parseType();
    parseExpected(22 /* CloseParenToken */);
    return finishNode(factory2.createParenthesizedType(type), pos);
  }
  function parseModifiersForConstructorType() {
    let modifiers;
    if (token() === 128 /* AbstractKeyword */) {
      const pos = getNodePos();
      nextToken();
      const modifier = finishNode(factoryCreateToken(128 /* AbstractKeyword */), pos);
      modifiers = createNodeArray([modifier], pos);
    }
    return modifiers;
  }
  function parseFunctionOrConstructorType() {
    const pos = getNodePos();
    const hasJSDoc = hasPrecedingJSDocComment();
    const modifiers = parseModifiersForConstructorType();
    const isConstructorType = parseOptional(105 /* NewKeyword */);
    Debug.assert(!modifiers || isConstructorType, "Per isStartOfFunctionOrConstructorType, a function type cannot have modifiers.");
    const typeParameters = parseTypeParameters();
    const parameters = parseParameters(4 /* Type */);
    const type = parseReturnType(
      39 /* EqualsGreaterThanToken */,
      /*isType*/
      false
    );
    const node = isConstructorType ? factory2.createConstructorTypeNode(modifiers, typeParameters, parameters, type) : factory2.createFunctionTypeNode(typeParameters, parameters, type);
    return withJSDoc(finishNode(node, pos), hasJSDoc);
  }
  function parseKeywordAndNoDot() {
    const node = parseTokenNode();
    return token() === 25 /* DotToken */ ? void 0 : node;
  }
  function parseLiteralTypeNode(negative) {
    const pos = getNodePos();
    if (negative) {
      nextToken();
    }
    let expression = token() === 112 /* TrueKeyword */ || token() === 97 /* FalseKeyword */ || token() === 106 /* NullKeyword */ ? parseTokenNode() : parseLiteralLikeNode(token());
    if (negative) {
      expression = finishNode(factory2.createPrefixUnaryExpression(41 /* MinusToken */, expression), pos);
    }
    return finishNode(factory2.createLiteralTypeNode(expression), pos);
  }
  function isStartOfTypeOfImportType() {
    nextToken();
    return token() === 102 /* ImportKeyword */;
  }
  function parseImportType() {
    sourceFlags |= 4194304 /* PossiblyContainsDynamicImport */;
    const pos = getNodePos();
    const isTypeOf = parseOptional(114 /* TypeOfKeyword */);
    parseExpected(102 /* ImportKeyword */);
    parseExpected(21 /* OpenParenToken */);
    const type = parseType();
    let attributes;
    if (parseOptional(28 /* CommaToken */)) {
      const openBracePosition = scanner.getTokenStart();
      parseExpected(19 /* OpenBraceToken */);
      const currentToken2 = token();
      if (currentToken2 === 118 /* WithKeyword */ || currentToken2 === 132 /* AssertKeyword */) {
        nextToken();
      } else {
        parseErrorAtCurrentToken(Diagnostics._0_expected, tokenToString(118 /* WithKeyword */));
      }
      parseExpected(59 /* ColonToken */);
      attributes = parseImportAttributes(
        currentToken2,
        /*skipKeyword*/
        true
      );
      if (!parseExpected(20 /* CloseBraceToken */)) {
        const lastError = lastOrUndefined(parseDiagnostics);
        if (lastError && lastError.code === Diagnostics._0_expected.code) {
          addRelatedInfo(
            lastError,
            createDetachedDiagnostic(fileName, sourceText, openBracePosition, 1, Diagnostics.The_parser_expected_to_find_a_1_to_match_the_0_token_here, "{", "}")
          );
        }
      }
    }
    parseExpected(22 /* CloseParenToken */);
    const qualifier = parseOptional(25 /* DotToken */) ? parseEntityNameOfTypeReference() : void 0;
    const typeArguments = parseTypeArgumentsOfTypeReference();
    return finishNode(factory2.createImportTypeNode(type, attributes, qualifier, typeArguments, isTypeOf), pos);
  }
  function nextTokenIsNumericOrBigIntLiteral() {
    nextToken();
    return token() === 9 /* NumericLiteral */ || token() === 10 /* BigIntLiteral */;
  }
  function parseNonArrayType() {
    switch (token()) {
      case 133 /* AnyKeyword */:
      case 159 /* UnknownKeyword */:
      case 154 /* StringKeyword */:
      case 150 /* NumberKeyword */:
      case 163 /* BigIntKeyword */:
      case 155 /* SymbolKeyword */:
      case 136 /* BooleanKeyword */:
      case 157 /* UndefinedKeyword */:
      case 146 /* NeverKeyword */:
      case 151 /* ObjectKeyword */:
        return tryParse(parseKeywordAndNoDot) || parseTypeReference();
      case 67 /* AsteriskEqualsToken */:
        scanner.reScanAsteriskEqualsToken();
      case 42 /* AsteriskToken */:
        return parseJSDocAllType();
      case 61 /* QuestionQuestionToken */:
        scanner.reScanQuestionToken();
      case 58 /* QuestionToken */:
        return parseJSDocUnknownOrNullableType();
      case 100 /* FunctionKeyword */:
        return parseJSDocFunctionType();
      case 54 /* ExclamationToken */:
        return parseJSDocNonNullableType();
      case 15 /* NoSubstitutionTemplateLiteral */:
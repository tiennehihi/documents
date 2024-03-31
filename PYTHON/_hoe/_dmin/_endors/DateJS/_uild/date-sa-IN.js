tIndex, 0, statement);
  return to;
}
function isAnyPrologueDirective(node) {
  return isPrologueDirective(node) || !!(getEmitFlags(node) & 2097152 /* CustomPrologue */);
}
function insertStatementsAfterStandardPrologue(to, from) {
  return insertStatementsAfterPrologue(to, from, isPrologueDirective);
}
function insertStatementsAfterCustomPrologue(to, from) {
  return insertStatementsAfterPrologue(to, from, isAnyPrologueDirective);
}
function insertStatementAfterCustomPrologue(to, statement) {
  return insertStatementAfterPrologue(to, statement, isAnyPrologueDirective);
}
function isRecognizedTripleSlashComment(text, commentPos, commentEnd) {
  if (text.charCodeAt(commentPos + 1) === 47 /* slash */ && commentPos + 2 < commentEnd && text.charCodeAt(commentPos + 2) === 47 /* slash */) {
    const textSubStr = text.substring(commentPos, commentEnd);
    return fullTripleSlashReferencePathRegEx.test(textSubStr) || fullTripleSlashAMDReferencePathRegEx.test(textSubStr) || fullTripleSlashAMDModuleRegEx.test(textSubStr) || fullTripleSlashReferenceTypeReferenceDirectiveRegEx.test(textSubStr) || fullTripleSlashLibReferenceRegEx.test(textSubStr) || defaultLibReferenceRegEx.test(textSubStr) ? true : false;
  }
  return false;
}
function isPinnedComment(text, start) {
  return text.charCodeAt(start + 1) === 42 /* asterisk */ && text.charCodeAt(start + 2) === 33 /* exclamation */;
}
function createCommentDirectivesMap(sourceFile, commentDirectives) {
  const directivesByLine = new Map(
    commentDirectives.map((commentDirective) => [
      `${getLineAndCharacterOfPosition(sourceFile, commentDirective.range.end).line}`,
      commentDirective
    ])
  );
  const usedLines = /* @__PURE__ */ new Map();
  return { getUnusedExpectations, markUsed };
  function getUnusedExpectations() {
    return arrayFrom(directivesByLine.entries()).filter(([line, directive]) => directive.type === 0 /* ExpectError */ && !usedLines.get(line)).map(([_, directive]) => directive);
  }
  function markUsed(line) {
    if (!directivesByLine.has(`${line}`)) {
      return false;
    }
    usedLines.set(`${line}`, true);
    return true;
  }
}
function getTokenPosOfNode(node, sourceFile, includeJsDoc) {
  if (nodeIsMissing(node)) {
    return node.pos;
  }
  if (isJSDocNode(node) || node.kind === 12 /* JsxText */) {
    return skipTrivia(
      (sourceFile || getSourceFileOfNode(node)).text,
      node.pos,
      /*stopAfterLineBreak*/
      false,
      /*stopAtComments*/
      true
    );
  }
  if (includeJsDoc && hasJSDocNodes(node)) {
    return getTokenPosOfNode(node.jsDoc[0], sourceFile);
  }
  if (node.kind === 358 /* SyntaxList */ && node._children.length > 0) {
    return getTokenPosOfNode(node._children[0], sourceFile, includeJsDoc);
  }
  return skipTrivia(
    (sourceFile || getSourceFileOfNode(node)).text,
    node.pos,
    /*stopAfterLineBreak*/
    false,
    /*stopAtComments*/
    false,
    isInJSDoc(node)
  );
}
function getSourceTextOfNodeFromSourceFile(sourceFile, node, includeTrivia = false) {
  return getTextOfNodeFromSourceText(sourceFile.text, node, includeTrivia);
}
function isJSDocTypeExpressionOrChild(node) {
  return !!findAncestor(node, isJSDocTypeExpression);
}
function isExportNamespaceAsDefaultDeclaration(node) {
  return !!(isExportDeclaration(node) && node.exportClause && isNamespaceExport(node.exportClause) && node.exportClause.name.escapedText === "default");
}
function getTextOfNodeFromSourceText(sourceText, node, includeTrivia = false) {
  if (nodeIsMissing(node)) {
    return "";
  }
  let text = sourceText.substring(includeTrivia ? node.pos : skipTrivia(sourceText, node.pos), node.end);
  if (isJSDocTypeExpressionOrChild(node)) {
    text = text.split(/\r\n|\n|\r/).map((line) => line.replace(/^\s*\*/, "").trimStart()).join("\n");
  }
  return text;
}
function getTextOfNode(node, includeTrivia = false) {
  return getSourceTextOfNodeFromSourceFile(getSourceFileOfNode(node), node, includeTrivia);
}
function getPos(range) {
  return range.pos;
}
function indexOfNode(nodeArray, node) {
  return binarySearch(nodeArray, node, getPos, compareValues);
}
function getEmitFlags(node) {
  const emitNode = node.emitNode;
  return emitNode && emitNode.flags || 0;
}
function getInternalEmitFlags(node) {
  const emitNode = node.emitNode;
  return emitNode && emitNode.internalFlags || 0;
}
var getScriptTargetFeatures = /* @__PURE__ */ memoize(
  () => new Map(Object.entries({
    Array: new Map(Object.entries({
      es2015: [
        "find",
        "findIndex",
        "fill",
        "copyWithin",
        "entries",
        "keys",
        "values"
      ],
      es2016: [
        "includes"
      ],
      es2019: [
        "flat",
        "flatMap"
      ],
      es2022: [
        "at"
      ],
      es2023: [
        "findLastIndex",
        "findLast"
      ]
    })),
    Iterator: new Map(Object.entries({
      es2015: emptyArray
    })),
    AsyncIterator: new Map(Object.entries({
      es2015: emptyArray
    })),
    Atomics: new Map(Object.entries({
      es2017: emptyArray
    })),
    SharedArrayBuffer: new Map(Object.entries({
      es2017: emptyArray
    })),
    AsyncIterable: new Map(Object.entries({
      es2018: emptyArray
    })),
    AsyncIterableIterator: new Map(Object.entries({
      es2018: emptyArray
    })),
    AsyncGenerator: new Map(Object.entries({
      es2018: emptyArray
    })),
    AsyncGeneratorFunction: new Map(Object.entries({
      es2018: emptyArray
    })),
    RegExp: new Map(Object.entries({
      es2015: [
        "flags",
        "sticky",
        "unicode"
      ],
      es2018: [
        "dotAll"
      ]
    })),
    Reflect: new Map(Object.entries({
      es2015: [
        "apply",
        "construct",
        "defineProperty",
        "deleteProperty",
        "get",
        "getOwnPropertyDescriptor",
        "getPrototypeOf",
        "has",
        "isExtensible",
        "ownKeys",
        "preventExtensions",
        "set",
        "setPrototypeOf"
      ]
    })),
    ArrayConstructor: new Map(Object.entries({
      es2015: [
        "from",
        "of"
      ]
    })),
    ObjectConstructor: new Map(Object.entries({
      es2015: [
        "assign",
        "getOwnPropertySymbols",
        "keys",
        "is",
        "setPrototypeOf"
      ],
      es2017: [
        "values",
        "entries",
        "getOwnPropertyDescriptors"
      ],
      es2019: [
        "fromEntries"
      ],
      es2022: [
        "hasOwn"
      ]
    })),
    NumberConstructor: new Map(Object.entries({
      es2015: [
        "isFinite",
        "isInteger",
        "isNaN",
        "isSafeInteger",
        "parseFloat",
        "parseInt"
      ]
    })),
    Math: new Map(Object.entries({
      es2015: [
        "clz32",
        "imul",
        "sign",
        "log10",
        "log2",
        "log1p",
        "expm1",
        "cosh",
        "sinh",
        "tanh",
        "acosh",
        "asinh",
        "atanh",
        "hypot",
        "trunc",
        "fround",
        "cbrt"
      ]
    })),
    Map: new Map(Object.entries({
      es2015: [
        "entries",
        "keys",
        "values"
      ]
    })),
    Set: new Map(Object.entries({
      es2015: [
        "entries",
        "keys",
        "values"
      ]
    })),
    PromiseConstructor: new Map(Object.entries({
      es2015: [
        "all",
        "race",
        "reject",
        "resolve"
      ],
      es2020: [
        "allSettled"
      ],
      es2021: [
        "any"
      ]
    })),
    Symbol: new Map(Object.entries({
      es2015: [
        "for",
        "keyFor"
      ],
      es2019: [
        "description"
      ]
    })),
    WeakMap: new Map(Object.entries({
      es2015: [
        "entries",
        "keys",
        "values"
      ]
    })),
    WeakSet: new Map(Object.entries({
      es2015: [
        "entries",
        "keys",
        "values"
      ]
    })),
    String: new Map(Object.entries({
      es2015: [
        "codePointAt",
        "includes",
        "endsWith",
        "normalize",
        "repeat",
        "startsWith",
        "anchor",
        "big",
        "blink",
        "bold",
        "fixed",
        "fontcolor",
        "fontsize",
        "italics",
        "link",
        "small",
        "strike",
        "sub",
        "sup"
      ],
      es2017: [
        "padStart",
        "padEnd"
      ],
      es2019: [
        "trimStart",
        "trimEnd",
        "trimLeft",
        "trimRight"
      ],
      es2020: [
        "matchAll"
      ],
      es2021: [
        "replaceAll"
      ],
      es2022: [
        "at"
      ]
    })),
    StringConstructor: new Map(Object.entries({
      es2015: [
        "fromCodePoint",
        "raw"
      ]
    })),
    DateTimeFormat: new Map(Object.entries({
      es2017: [
        "formatToParts"
      ]
    })),
    Promise: new Map(Object.entries({
      es2015: emptyArray,
      es2018: [
        "finally"
      ]
    })),
    RegExpMatchArray: new Map(Object.entries({
      es2018: [
        "groups"
      ]
    })),
    RegExpExecArray: new Map(Object.entries({
      es2018: [
        "groups"
      ]
    })),
    Intl: new Map(Object.entries({
      es2018: [
        "PluralRules"
      ]
    })),
    NumberFormat: new Map(Object.entries({
      es2018: [
        "formatToParts"
      ]
    })),
    SymbolConstructor: new Map(Object.entries({
      es2020: [
        "matchAll"
      ]
    })),
    DataView: new Map(Object.entries({
      es2020: [
        "setBigInt64",
        "setBigUint64",
        "getBigInt64",
        "getBigUint64"
      ]
    })),
    BigInt: new Map(Object.entries({
      es2020: emptyArray
    })),
    RelativeTimeFormat: new Map(Object.entries({
      es2020: [
        "format",
        "formatToParts",
        "resolvedOptions"
      ]
    })),
    Int8Array: new Map(Object.entries({
      es2022: [
        "at"
      ],
      es2023: [
        "findLastIndex",
        "findLast"
      ]
    })),
    Uint8Array: new Map(Object.entries({
      es2022: [
        "at"
      ],
      es2023: [
        "findLastIndex",
        "findLast"
      ]
    })),
    Uint8ClampedArray: new Map(Object.entries({
      es2022: [
        "at"
      ],
      es2023: [
        "findLastIndex",
        "findLast"
      ]
    })),
    Int16Array: new Map(Object.entries({
      es2022: [
        "at"
      ],
      es2023: [
        "findLastIndex",
        "findLast"
      ]
    })),
    Uint16Array: new Map(Object.entries({
      es2022: [
        "at"
      ],
      es2023: [
        "findLastIndex",
        "findLast"
      ]
    })),
    Int32Array: new Map(Object.entries({
      es2022: [
        "at"
      ],
      es2023: [
        "findLastIndex",
        "findLast"
      ]
    })),
    Uint32Array: new Map(Object.entries({
      es2022: [
        "at"
      ],
      es2023: [
        "findLastIndex",
        "findLast"
      ]
    })),
    Float32Array: new Map(Object.entries({
      es2022: [
        "at"
      ],
      es2023: [
        "findLastIndex",
        "findLast"
      ]
    })),
    Float64Array: new Map(Object.entries({
      es2022: [
        "at"
      ],
      es2023: [
        "findLastIndex",
        "findLast"
      ]
    })),
    BigInt64Array: new Map(Object.entries({
      es2020: emptyArray,
      es2022: [
        "at"
      ],
      es2023: [
        "findLastIndex",
        "findLast"
      ]
    })),
    BigUint64Array: new Map(Object.entries({
      es2020: emptyArray,
      es2022: [
        "at"
      ],
      es2023: [
        "findLastIndex",
        "findLast"
      ]
    })),
    Error: new Map(Object.entries({
      es2022: [
        "cause"
      ]
    }))
  }))
);
function getLiteralText(node, sourceFile, flags) {
  if (sourceFile && canUseOriginalText(node, flags)) {
    return getSourceTextOfNodeFromSourceFile(sourceFile, node);
  }
  switch (node.kind) {
    case 11 /* StringLiteral */: {
      const escapeText = flags & 2 /* JsxAttributeEscape */ ? escapeJsxAttributeString : flags & 1 /* NeverAsciiEscape */ || getEmitFlags(node) & 16777216 /* NoAsciiEscaping */ ? escapeString : escapeNonAsciiString;
      if (node.singleQuote) {
        return "'" + escapeText(node.text, 39 /* singleQuote */) + "'";
      } else {
        return '"' + escapeText(node.text, 34 /* doubleQuote */) + '"';
      }
    }
    case 15 /* NoSubstitutionTemplateLiteral */:
    case 16 /* TemplateHead */:
    case 17 /* TemplateMiddle */:
    case 18 /* TemplateTail */: {
      const escapeText = flags & 1 /* NeverAsciiEscape */ || getEmitFlags(node) & 16777216 /* NoAsciiEscaping */ ? escapeString : escapeNonAsciiString;
      const rawText = node.rawText ?? escapeTemplateSubstitution(escapeText(node.text, 96 /* backtick */));
      switch (node.kind) {
        case 15 /* NoSubstitutionTemplateLiteral */:
          return "`" + rawText + "`";
        case 16 /* TemplateHead */:
          return "`" + rawText + "${";
        case 17 /* TemplateMiddle */:
          return "}" + rawText + "${";
        case 18 /* TemplateTail */:
          return "}" + rawText + "`";
      }
      break;
    }
    case 9 /* NumericLiteral */:
    case 10 /* BigIntLiteral */:
      return node.text;
    case 14 /* RegularExpressionLiteral */:
      if (flags & 4 /* TerminateUnterminatedLiterals */ && node.isUnterminated) {
        return node.text + (node.text.charCodeAt(node.text.length - 1) === 92 /* backslash */ ? " /" : "/");
      }
      return node.text;
  }
  return Debug.fail(`Literal kind '${node.kind}' not accounted for.`);
}
function canUseOriginalText(node, flags) {
  if (nodeIsSynthesized(node) || !node.parent || flags & 4 /* TerminateUnterminatedLiterals */ && node.isUnterminated) {
    return false;
  }
  if (isNumericLiteral(node)) {
    if (node.numericLiteralFlags & 26656 /* IsInvalid */) {
      return false;
    }
    if (node.numericLiteralFlags & 512 /* ContainsSeparator */) {
      return !!(flags & 8 /* AllowNumericSeparator */);
    }
  }
  return !isBigIntLiteral(node);
}
function makeIdentifierFromModuleName(moduleName) {
  return getBaseFileName(moduleName).replace(/^(\d)/, "_$1").replace(/\W/g, "_");
}
function isBlockOrCatchScoped(declaration) {
  return (getCombinedNodeFlags(declaration) & 7 /* BlockScoped */) !== 0 || isCatchClauseVariableDeclarationOrBindingElement(declaration);
}
function isCatchClauseVariableDeclarationOrBindingElement(declaration) {
  const node = getRootDeclaration(declaration);
  return node.kind === 260 /* VariableDeclaration */ && node.parent.kind === 299 /* CatchClause */;
}
function isAmbientModule(node) {
  return isModuleDeclaration(node) && (node.name.kind === 11 /* StringLiteral */ || isGlobalScopeAugmentation(node));
}
function isModuleWithStringLiteralName(node) {
  return isModuleDeclaration(node) && node.name.kind === 11 /* StringLiteral */;
}
function isNonGlobalAmbientModule(node) {
  return isModuleDeclaration(node) && isStringLiteral(node.name);
}
function isEffectiveModuleDeclaration(node) {
  return isModuleDeclaration(node) || isIdentifier(node);
}
function isShorthandAmbientModuleSymbol(moduleSymbol) {
  return isShorthandAmbientModule(moduleSymbol.valueDeclaration);
}
function isShorthandAmbientModule(node) {
  return !!node && node.kind === 267 /* ModuleDeclaration */ && !node.body;
}
function isBlockScopedContainerTopLevel(node) {
  return node.kind === 312 /* SourceFile */ || node.kind === 267 /* ModuleDeclaration */ || isFunctionLikeOrClassStaticBlockDeclaration(node);
}
function isGlobalScopeAugmentation(module2) {
  return !!(module2.flags & 2048 /* GlobalAugmentation */);
}
function isExternalModuleAugmentation(node) {
  return isAmbientModule(node) && isModuleAugmentationExternal(node);
}
function isModuleAugmentationExternal(node) {
  switch (node.parent.kind) {
    case 312 /* SourceFile */:
      return isExternalModule(node.parent);
    case 268 /* ModuleBlock */:
      return isAmbientModule(node.parent.parent) && isSourceFile(node.parent.parent.parent) && !isExternalModule(node.parent.parent.parent);
  }
  return false;
}
function getNonAugmentationDeclaration(symbol) {
  var _a;
  return (_a = symbol.declarations) == null ? void 0 : _a.find((d) => !isExternalModuleAugmentation(d) && !(isModuleDeclaration(d) && isGlobalScopeAugmentation(d)));
}
function isCommonJSContainingModuleKind(kind) {
  return kind === 1 /* CommonJS */ || kind === 100 /* Node16 */ || kind === 199 /* NodeNext */;
}
function isEffectiveExternalModule(node, compilerOptions) {
  return isExternalModule(node) || isCommonJSContainingModuleKind(getEmitModuleKind(compilerOptions)) && !!node.commonJsModuleIndicator;
}
function isEffectiveStrictModeSourceFile(node, compilerOptions) {
  switch (node.scriptKind) {
    case 1 /* JS */:
    case 3 /* TS */:
    case 2 /* JSX */:
    case 4 /* TSX */:
      break;
    default:
      return false;
  }
  if (node.isDeclarationFile) {
    return false;
  }
  if (getStrictOptionValue(compilerOptions, "alwaysStrict")) {
    return true;
  }
  if (startsWithUseStrict(node.statements)) {
    return true;
  }
  if (isExternalModule(node) || getIsolatedModules(compilerOptions)) {
    if (getEmitModuleKind(compilerOptions) >= 5 /* ES2015 */) {
      return true;
    }
    return !compilerOptions.noImplicitUseStrict;
  }
  return false;
}
function isAmbientPropertyDeclaration(node) {
  return !!(node.flags & 33554432 /* Ambient */) || hasSyntacticModifier(node, 128 /* Ambient */);
}
function isBlockScope(node, parentNode) {
  switch (node.kind) {
    case 312 /* SourceFile */:
    case 269 /* CaseBlock */:
    case 299 /* CatchClause */:
    case 267 /* ModuleDeclaration */:
    case 248 /* ForStatement */:
    case 249 /* ForInStatement */:
    case 250 /* ForOfStatement */:
    case 176 /* Constructor */:
    case 174 /* MethodDeclaration */:
    case 177 /* GetAccessor */:
    case 178 /* SetAccessor */:
    case 262 /* FunctionDeclaration */:
    case 218 /* FunctionExpression */:
    case 219 /* ArrowFunction */:
    case 172 /* PropertyDeclaration */:
    case 175 /* ClassStaticBlockDeclaration */:
      return true;
    case 241 /* Block */:
      return !isFunctionLikeOrClassStaticBlockDeclaration(parentNode);
  }
  return false;
}
function isAnyImportSyntax(node) {
  switch (node.kind) {
    case 272 /* ImportDeclaration */:
    case 271 /* ImportEqualsDeclaration */:
      return true;
    default:
      return false;
  }
}
function isLateVisibilityPaintedStatement(node) {
  switch (node.kind) {
    case 272 /* ImportDeclaration */:
    case 271 /* ImportEqualsDeclaration */:
    case 243 /* VariableStatement */:
    case 263 /* ClassDeclaration */:
    case 262 /* FunctionDeclaration */:
    case 267 /* ModuleDeclaration */:
    case 265 /* TypeAliasDeclaration */:
    case 264 /* InterfaceDeclaration */:
    case 266 /* EnumDeclaration */:
      return true;
    default:
      return false;
  }
}
function hasPossibleExternalModuleReference(node) {
  return isAnyImportOrReExport(node) || isModuleDeclaration(node) || isImportTypeNode(node) || isImportCall(node);
}
function isAnyImportOrReExport(node) {
  return isAnyImportSyntax(node) || isExportDeclaration(node);
}
function getEnclosingContainer(node) {
  return findAncestor(node.parent, (n) => !!(getContainerFlags(n) & 1 /* IsContainer */));
}
function getEnclosingBlockScopeContainer(node) {
  return findAncestor(node.parent, (current) => isBlockScope(current, current.parent));
}
function forEachEnclosingBlockScopeContainer(node, cb) {
  let container = getEnclosingBlockScopeContainer(node);
  while (container) {
    cb(container);
    container = getEnclosingBlockScopeContainer(container);
  }
}
function declarationNameToString(name) {
  return !name || getFullWidth(name) === 0 ? "(Missing)" : getTextOfNode(name);
}
function getNameFromIndexInfo(info) {
  return info.declaration ? declarationNameToString(info.declaration.parameters[0].name) : void 0;
}
function isComputedNonLiteralName(name) {
  return name.kind === 167 /* ComputedPropertyName */ && !isStringOrNumericLiteralLike(name.expression);
}
function tryGetTextOfPropertyName(name) {
  var _a;
  switch (name.kind) {
    case 80 /* Identifier */:
    case 81 /* PrivateIdentifier */:
      return ((_a = name.emitNode) == null ? void 0 : _a.autoGenerate) ? void 0 : name.escapedText;
    case 11 /* StringLiteral */:
    case 9 /* NumericLiteral */:
    case 15 /* NoSubstitutionTemplateLiteral */:
      return escapeLeadingUnderscores(name.text);
    case 167 /* ComputedPropertyName */:
      if (isStringOrNumericLiteralLike(name.expression))
        return escapeLeadingUnderscores(name.expression.text);
      return void 0;
    case 295 /* JsxNamespacedName */:
      return getEscapedTextOfJsxNamespacedName(name);
    default:
      return Debug.assertNever(name);
  }
}
function getTextOfPropertyName(name) {
  return Debug.checkDefined(tryGetTextOfPropertyName(name));
}
function entityNameToString(name) {
  switch (name.kind) {
    case 110 /* ThisKeyword */:
      return "this";
    case 81 /* PrivateIdentifier */:
    case 80 /* Identifier */:
      return getFullWidth(name) === 0 ? idText(name) : getTextOfNode(name);
    case 166 /* QualifiedName */:
      return entityNameToString(name.left) + "." + entityNameToString(name.right);
    case 211 /* PropertyAccessExpression */:
      if (isIdentifier(name.name) || isPrivateIdentifier(name.name)) {
        return entityNameToString(name.expression) + "." + entityNameToString(name.name);
      } else {
        return Debug.assertNever(name.name);
      }
    case 318 /* JSDocMemberName */:
      return entityNameToString(name.left) + entityNameToString(name.right);
    case 295 /* JsxNamespacedName */:
      return entityNameToString(name.namespace) + ":" + entityNameToString(name.name);
    default:
      return Debug.assertNever(name);
  }
}
function createDiagnosticForNode(node, message, ...args) {
  const sourceFile = getSourceFileOfNode(node);
  return createDiagnosticForNodeInSourceFile(sourceFile, node, message, ...args);
}
function createDiagnosticForNodeArray(sourceFile, nodes, message, ...args) {
  const start = skipTrivia(sourceFile.text, nodes.pos);
  return createFileDiagnostic(sourceFile, start, nodes.end - start, message, ...args);
}
function createDiagnosticForNodeInSourceFile(sourceFile, node, message, ...args) {
  const span = getErrorSpanForNode(sourceFile, node);
  return createFileDiagnostic(sourceFile, span.start, span.length, message, ...args);
}
function createDiagnosticForNodeFromMessageChain(sourceFile, node, messageChain, relatedInformation) {
  const span = getErrorSpanForNode(sourceFile, node);
  return createFileDiagnosticFromMessageChain(sourceFile, span.start, span.length, messageChain, relatedInformation);
}
function createDiagnosticForNodeArrayFromMessageChain(sourceFile, nodes, messageChain, relatedInformation) {
  const start = skipTrivia(sourceFile.text, nodes.pos);
  return createFileDiagnosticFromMessageChain(sourceFile, start, nodes.end - start, messageChain, relatedInformation);
}
function assertDiagnosticLocation(sourceText, start, length2) {
  Debug.assertGreaterThanOrEqual(start, 0);
  Debug.assertGreaterThanOrEqual(length2, 0);
  Debug.assertLessThanOrEqual(start, sourceText.length);
  Debug.assertLessThanOrEqual(start + length2, sourceText.length);
}
function createFileDiagnosticFromMessageChain(file, start, length2, messageChain, relatedInformation) {
  assertDiagnosticLocation(file.text, start, length2);
  return {
    file,
    start,
    length: length2,
    code: messageChain.code,
    category: messageChain.category,
    messageText: messageChain.next ? messageChain : messageChain.messageText,
    relatedInformation
  };
}
function createDiagnosticForFileFromMessageChain(sourceFile, messageChain, relatedInformation) {
  return {
    file: sourceFile,
    start: 0,
    length: 0,
    code: messageChain.code,
    category: messageChain.category,
    messageText: messageChain.next ? messageChain : messageChain.messageText,
    relatedInformation
  };
}
function createDiagnosticMessageChainFromDiagnostic(diagnostic) {
  return typeof diagnostic.messageText === "string" ? {
    code: diagnostic.code,
    category: diagnostic.category,
    messageText: diagnostic.messageText,
    next: diagnostic.next
  } : diagnostic.messageText;
}
function createDiagnosticForRange(sourceFile, range, message) {
  return {
    file: sourceFile,
    start: range.pos,
    length: range.end - range.pos,
    code: message.code,
    category: message.category,
    messageText: message.message
  };
}
function getSpanOfTokenAtPosition(sourceFile, pos) {
  const scanner = createScanner(
    sourceFile.languageVersion,
    /*skipTrivia*/
    true,
    sourceFile.languageVariant,
    sourceFile.text,
    /*onError*/
    void 0,
    pos
  );
  scanner.scan();
  const start = scanner.getTokenStart();
  return createTextSpanFromBounds(start, scanner.getTokenEnd());
}
function scanTokenAtPosition(sourceFile, pos) {
  const scanner = createScanner(
    sourceFile.languageVersion,
    /*skipTrivia*/
    true,
    sourceFile.languageVariant,
    sourceFile.text,
    /*onError*/
    void 0,
    pos
  );
  scanner.scan();
  return scanner.getToken();
}
function getErrorSpanForArrowFunction(sourceFile, node) {
  const pos = skipTrivia(sourceFile.text, node.pos);
  if (node.body && node.body.kind === 241 /* Block */) {
    const { line: startLine } = getLineAndCharacterOfPosition(sourceFile, node.body.pos);
    const { line: endLine } = getLineAndCharacterOfPosition(sourceFile, node.body.end);
    if (startLine < endLine) {
      return createTextSpan(pos, getEndLinePosition(startLine, sourceFile) - pos + 1);
    }
  }
  return createTextSpanFromBounds(pos, node.end);
}
function getErrorSpanForNode(sourceFile, node) {
  let errorNode = node;
  switch (node.kind) {
    case 312 /* SourceFile */: {
      const pos2 = skipTrivia(
        sourceFile.text,
        0,
        /*stopAfterLineBreak*/
        false
      );
      if (pos2 === sourceFile.text.length) {
        return createTextSpan(0, 0);
      }
      return getSpanOfTokenAtPosition(sourceFile, pos2);
    }
    case 260 /* VariableDeclaration */:
    case 208 /* BindingElement */:
    case 263 /* ClassDeclaration */:
    case 231 /* ClassExpression */:
    case 264 /* InterfaceDeclaration */:
    case 267 /* ModuleDeclaration */:
    case 266 /* EnumDeclaration */:
    case 306 /* EnumMember */:
    case 262 /* FunctionDeclaration */:
    case 218 /* FunctionExpression */:
    case 174 /* MethodDeclaration */:
    case 177 /* GetAccessor */:
    case 178 /* SetAccessor */:
    case 265 /* TypeAliasDeclaration */:
    case 172 /* PropertyDeclaration */:
    case 171 /* PropertySignature */:
    case 274 /* NamespaceImport */:
      errorNode = node.name;
      break;
    case 219 /* ArrowFunction */:
      return getErrorSpanForArrowFunction(sourceFile, node);
    case 296 /* CaseClause */:
    case 297 /* DefaultClause */: {
      const start = skipTrivia(sourceFile.text, node.pos);
      const end = node.statements.length > 0 ? node.statements[0].pos : node.end;
      return createTextSpanFromBounds(start, end);
    }
    case 253 /* ReturnStatement */:
    case 229 /* YieldExpression */: {
      const pos2 = skipTrivia(sourceFile.text, node.pos);
      return getSpanOfTokenAtPosition(sourceFile, pos2);
    }
    case 238 /* SatisfiesExpression */: {
      const pos2 = skipTrivia(sourceFile.text, node.expression.end);
      return getSpanOfTokenAtPosition(sourceFile, pos2);
    }
    case 357 /* JSDocSatisfiesTag */: {
      const pos2 = skipTrivia(sourceFile.text, node.tagName.pos);
      return getSpanOfTokenAtPosition(sourceFile, pos2);
    }
  }
  if (errorNode === void 0) {
    return getSpanOfTokenAtPosition(sourceFile, node.pos);
  }
  Debug.assert(!isJSDoc(errorNode));
  const isMissing = nodeIsMissing(errorNode);
  const pos = isMissing || isJsxText(node) ? errorNode.pos : skipTrivia(sourceFile.text, errorNode.pos);
  if (isMissing) {
    Debug.assert(pos === errorNode.pos, "This failure could trigger https://github.com/Microsoft/TypeScript/issues/20809");
    Debug.assert(pos === errorNode.end, "This failure could trigger https://github.com/Microsoft/TypeScript/issues/20809");
  } else {
    Debug.assert(pos >= errorNode.pos, "This failure could trigger https://github.com/Microsoft/TypeScript/issues/20809");
    Debug.assert(pos <= errorNode.end, "This failure could trigger https://github.com/Microsoft/TypeScript/issues/20809");
  }
  return createTextSpanFromBounds(pos, errorNode.end);
}
function isExternalOrCommonJsModule(file) {
  return (file.externalModuleIndicator || file.commonJsModuleIndicator) !== void 0;
}
function isJsonSourceFile(file) {
  return file.scriptKind === 6 /* JSON */;
}
function isEnumConst(node) {
  return !!(getCombinedModifierFlags(node) & 4096 /* Const */);
}
function isDeclarationReadonly(declaration) {
  return !!(getCombinedModifierFlags(declaration) & 8 /* Readonly */ && !isParameterPropertyDeclaration(declaration, declaration.parent));
}
function isVarAwaitUsing(node) {
  return (getCombinedNodeFlags(node) & 7 /* BlockScoped */) === 6 /* AwaitUsing */;
}
function isVarUsing(node) {
  return (getCombinedNodeFlags(node) & 7 /* BlockScoped */) === 4 /* Using */;
}
function isVarConst(node) {
  return (getCombinedNodeFlags(node) & 7 /* BlockScoped */) === 2 /* Const */;
}
function isLet(node) {
  return (getCombinedNodeFlags(node) & 7 /* BlockScoped */) === 1 /* Let */;
}
function isSuperCall(n) {
  return n.kind === 213 /* CallExpression */ && n.expression.kind === 108 /* SuperKeyword */;
}
function isImportCall(n) {
  return n.kind === 213 /* CallExpression */ && n.expression.kind === 102 /* ImportKeyword */;
}
function isImportMeta(n) {
  return isMetaProperty(n) && n.keywordToken === 102 /* ImportKeyword */ && n.name.escapedText === "meta";
}
function isLiteralImportTypeNode(n) {
  return isImportTypeNode(n) && isLiteralTypeNode(n.argument) && isStringLiteral(n.argument.literal);
}
function isPrologueDirective(node) {
  return node.kind === 244 /* ExpressionStatement */ && node.expression.kind === 11 /* StringLiteral */;
}
function isCustomPrologue(node) {
  return !!(getEmitFlags(node) & 2097152 /* CustomPrologue */);
}
function isHoistedFunction(node) {
  return isCustomPrologue(node) && isFunctionDeclaration(node);
}
function isHoistedVariable(node) {
  return isIdentifier(node.name) && !node.initializer;
}
function isHoistedVariableStatement(node) {
  return isCustomPrologue(node) && isVariableStatement(node) && every(node.declarationList.declarations, isHoistedVariable);
}
function getLeadingCommentRangesOfNode(node, sourceFileOfNode) {
  return node.kind !== 12 /* JsxText */ ? getLeadingCommentRanges(sourceFileOfNode.text, node.pos) : void 0;
}
function getJSDocCommentRanges(node, text) {
  const commentRanges = node.kind === 169 /* Parameter */ || node.kind === 168 /* TypeParameter */ || node.kind === 218 /* FunctionExpression */ || node.kind === 219 /* ArrowFunction */ || node.kind === 217 /* ParenthesizedExpression */ || node.kind === 260 /* VariableDeclaration */ || node.kind === 281 /* ExportSpecifier */ ? concatenate(getTrailingCommentRanges(text, node.pos), getLeadingCommentRanges(text, node.pos)) : getLeadingCommentRanges(text, node.pos);
  return filter(commentRanges, (comment) => text.charCodeAt(comment.pos + 1) === 42 /* asterisk */ && text.charCodeAt(comment.pos + 2) === 42 /* asterisk */ && text.charCodeAt(comment.pos + 3) !== 47 /* slash */);
}
var fullTripleSlashReferencePathRegEx = /^(\/\/\/\s*<reference\s+path\s*=\s*)(('[^']*')|("[^"]*")).*?\/>/;
var fullTripleSlashReferenceTypeReferenceDirectiveRegEx = /^(\/\/\/\s*<reference\s+types\s*=\s*)(('[^']*')|("[^"]*")).*?\/>/;
var fullTripleSlashLibReferenceRegEx = /^(\/\/\/\s*<reference\s+lib\s*=\s*)(('[^']*')|("[^"]*")).*?\/>/;
var fullTripleSlashAMDReferencePathRegEx = /^(\/\/\/\s*<amd-dependency\s+path\s*=\s*)(('[^']*')|("[^"]*")).*?\/>/;
var fullTripleSlashAMDModuleRegEx = /^\/\/\/\s*<amd-module\s+.*?\/>/;
var defaultLibReferenceRegEx = /^(\/\/\/\s*<reference\s+no-default-lib\s*=\s*)(('[^']*')|("[^"]*"))\s*\/>/;
function isPartOfTypeNode(node) {
  if (182 /* FirstTypeNode */ <= node.kind && node.kind <= 205 /* LastTypeNode */) {
    return true;
  }
  switch (node.kind) {
    case 133 /* AnyKeyword */:
    case 159 /* UnknownKeyword */:
    case 150 /* NumberKeyword */:
    case 163 /* BigIntKeyword */:
    case 154 /* StringKeyword */:
    case 136 /* BooleanKeyword */:
    case 155 /* SymbolKeyword */:
    case 151 /* ObjectKeyword */:
    case 157 /* UndefinedKeyword */:
    case 106 /* NullKeyword */:
    case 146 /* NeverKeyword */:
      return true;
    case 116 /* VoidKeyword */:
      return node.parent.kind !== 222 /* VoidExpression */;
    case 233 /* ExpressionWithTypeArguments */:
      return isPartOfTypeExpressionWithTypeArguments(node);
    case 168 /* TypeParameter */:
      return node.parent.kind === 200 /* MappedType */ || node.parent.kind === 195 /* InferType */;
    case 80 /* Identifier */:
      if (node.parent.kind === 166 /* QualifiedName */ && node.parent.right === node) {
        node = node.parent;
      } else if (node.parent.kind === 211 /* PropertyAccessExpression */ && node.parent.name === node) {
        node = node.parent;
      }
      Debug.assert(node.kind === 80 /* Identifier */ || node.kind === 166 /* QualifiedName */ || node.kind === 211 /* PropertyAccessExpression */, "'node' was expected to be a qualified name, identifier or property access in 'isPartOfTypeNode'.");
    case 166 /* QualifiedName */:
    case 211 /* PropertyAccessExpression */:
    case 110 /* ThisKeyword */: {
      const { parent } = node;
      if (parent.kind === 186 /* TypeQuery */) {
        return false;
      }
      if (parent.kind === 205 /* ImportType */) {
        return !parent.isTypeOf;
      }
      if (182 /* FirstTypeNode */ <= parent.kind && parent.kind <= 205 /* LastTypeNode */) {
        return true;
      }
      switch (parent.kind) {
        case 233 /* ExpressionWithTypeArguments */:
          return isPartOfTypeExpressionWithTypeArguments(parent);
        case 168 /* TypeParameter */:
          return node === parent.constraint;
        case 352 /* JSDocTemplateTag */:
          return node === parent.constraint;
        case 172 /* PropertyDeclaration */:
        case 171 /* PropertySignature */:
        case 169 /* Parameter */:
        case 260 /* VariableDeclaration */:
          return node === parent.type;
        case 262 /* FunctionDeclaration */:
        case 218 /* FunctionExpression */:
        case 219 /* ArrowFunction */:
        case 176 /* Constructor */:
        case 174 /* MethodDeclaration */:
        case 173 /* MethodSignature */:
        case 177 /* GetAccessor */:
        case 178 /* SetAccessor */:
          return node === parent.type;
        case 179 /* CallSignature */:
        case 180 /* ConstructSignature */:
        case 181 /* IndexSignature */:
          return node === parent.type;
        case 216 /* TypeAssertionExpression */:
          return node === parent.type;
        case 213 /* CallExpression */:
        case 214 /* NewExpression */:
        case 215 /* TaggedTemplateExpression */:
          return contains(parent.typeArguments, node);
      }
    }
  }
  return false;
}
function isPartOfTypeExpressionWithTypeArguments(node) {
  return isJSDocImplementsTag(node.parent) || isJSDocAugmentsTag(node.parent) || isHeritageClause(node.parent) && !isExpressionWithTypeArgumentsInClassExtendsClause(node);
}
function forEachReturnStatement(body, visitor) {
  return traverse(body);
  function traverse(node) {
    switch (node.kind) {
      case 253 /* ReturnStatement */:
        return visitor(node);
      case 269 /* CaseBlock */:
      case 241 /* Block */:
      case 245 /* IfStatement */:
      case 246 /* DoStatement */:
      case 247 /* WhileStatement */:
      case 248 /* ForStatement */:
      case 249 /* ForInStatement */:
      case 250 /* ForOfStatement */:
      case 254 /* WithStatement */:
      case 255 /* SwitchStatement */:
      case 296 /* CaseClause */:
      case 297 /* DefaultClause */:
      case 256 /* LabeledStatement */:
      case 258 /* TryStatement */:
      case 299 /* CatchClause */:
        return forEachChild(node, traverse);
    }
  }
}
function forEachYieldExpression(body, visitor) {
  return traverse(body);
  function traverse(node) {
    switch (node.kind) {
      case 229 /* YieldExpression */:
        visitor(node);
        const operand = node.expression;
        if (operand) {
          traverse(operand);
        }
        return;
      case 266 /* EnumDeclaration */:
      case 264 /* InterfaceDeclaration */:
      case 267 /* ModuleDeclaration */:
      case 265 /* TypeAliasDeclaration */:
        return;
      default:
        if (isFunctionLike(node)) {
          if (node.name && node.name.kind === 167 /* ComputedPropertyName */) {
            traverse(node.name.expression);
            return;
          }
        } else if (!isPartOfTypeNode(node)) {
          forEachChild(node, traverse);
        }
    }
  }
}
function getRestParameterElementType(node) {
  if (node && node.kind === 188 /* ArrayType */) {
    return node.elementType;
  } else if (node && node.kind === 183 /* TypeReference */) {
    return singleOrUndefined(node.typeArguments);
  } else {
    return void 0;
  }
}
function getMembersOfDeclaration(node) {
  switch (node.kind) {
    case 264 /* InterfaceDeclaration */:
    case 263 /* ClassDeclaration */:
    case 231 /* ClassExpression */:
    case 187 /* TypeLiteral */:
      return node.members;
    case 210 /* ObjectLiteralExpression */:
      return node.properties;
  }
}
function isVariableLike(node) {
  if (node) {
    switch (node.kind) {
      case 208 /* BindingElement */:
      case 306 /* EnumMember */:
      case 169 /* Parameter */:
      case 303 /* PropertyAssignment */:
      case 172 /* PropertyDeclaration */:
      case 171 /* PropertySignature */:
      case 304 /* ShorthandPropertyAssignment */:
      case 260 /* VariableDeclaration */:
        return true;
    }
  }
  return false;
}
function isVariableLikeOrAccessor(node) {
  return isVariableLike(node) || isAccessor(node);
}
function isVariableDeclarationInVariableStatement(node) {
  return node.parent.kind === 261 /* VariableDeclarationList */ && node.parent.parent.kind === 243 /* VariableStatement */;
}
function isCommonJsExportedExpression(node) {
  if (!isInJSFile(node))
    return false;
  return isObjectLiteralExpression(node.parent) && isBinaryExpression(node.parent.parent) && getAssignmentDeclarationKind(node.parent.parent) === 2 /* ModuleExports */ || isCommonJsExportPropertyAssignment(node.parent);
}
function isCommonJsExportPropertyAssignment(node) {
  if (!isInJSFile(node))
    return false;
  return isBinaryExpression(node) && getAssignmentDeclarationKind(node) === 1 /* ExportsProperty */;
}
function isValidESSymbolDeclaration(node) {
  return (isVariableDeclaration(node) ? isVarConst(node) && isIdentifier(node.name) && isVariableDeclarationInVariableStatement(node) : isPropertyDeclaration(node) ? hasEffectiveReadonlyModifier(node) && hasStaticModifier(node) : isPropertySignature(node) && hasEffectiveReadonlyModifier(node)) || isCommonJsExportPropertyAssignment(node);
}
function introducesArgumentsExoticObject(node) {
  switch (node.kind) {
    case 174 /* MethodDeclaration */:
    case 173 /* MethodSignature */:
    case 176 /* Constructor */:
    case 177 /* GetAccessor */:
    case 178 /* SetAccessor */:
    case 262 /* FunctionDeclaration */:
    case 218 /* FunctionExpression */:
      return true;
  }
  return false;
}
function unwrapInnermostStatementOfLabel(node, beforeUnwrapLabelCallback) {
  while (true) {
    if (beforeUnwrapLabelCallback) {
      beforeUnwrapLabelCallback(node);
    }
    if (node.statement.kind !== 256 /* LabeledStatement */) {
      return node.statement;
    }
    node = node.statement;
  }
}
function isFunctionBlock(node) {
  return node && node.kind === 241 /* Block */ && isFunctionLike(node.parent);
}
function isObjectLiteralMethod(node) {
  return node && node.kind === 174 /* MethodDeclaration */ && node.parent.kind === 210 /* ObjectLiteralExpression */;
}
function isObjectLiteralOrClassExpressionMethodOrAccessor(node) {
  return (node.kind === 174 /* MethodDeclaration */ || node.kind === 177 /* GetAccessor */ || node.kind === 178 /* SetAccessor */) && (node.parent.kind === 210 /* ObjectLiteralExpression */ || node.parent.kind === 231 /* ClassExpression */);
}
function isIdentifierTypePredicate(predicate) {
  return predicate && predicate.kind === 1 /* Identifier */;
}
function forEachPropertyAssignment(objectLiteral, key, callback, key2) {
  return forEach(objectLiteral == null ? void 0 : objectLiteral.properties, (property) => {
    if (!isPropertyAssignment(property))
      return void 0;
    const propName = tryGetTextOfPropertyName(property.name);
    return key === propName || key2 && key2 === propName ? callback(property) : void 0;
  });
}
function getPropertyArrayElementValue(objectLiteral, propKey, elementValue) {
  return forEachPropertyAssignment(objectLiteral, propKey, (property) => isArrayLiteralExpression(property.initializer) ? find(property.initializer.elements, (element) => isStringLiteral(element) && element.text === elementValue) : void 0);
}
function getTsConfigObjectLiteralExpression(tsConfigSourceFile) {
  if (tsConfigSourceFile && tsConfigSourceFile.statements.length) {
    const expression = tsConfigSourceFile.statements[0].expression;
    return tryCast(expression, isObjectLiteralExpression);
  }
}
function getTsConfigPropArrayElementValue(tsConfigSourceFile, propKey, elementValue) {
  return forEachTsConfigPropArray(tsConfigSourceFile, propKey, (property) => isArrayLiteralExpression(property.initializer) ? find(property.initializer.elements, (element) => isStringLiteral(element) && element.text === elementValue) : void 0);
}
function forEachTsConfigPropArray(tsConfigSourceFile, propKey, callback) {
  return forEachPropertyAssignment(getTsConfigObjectLiteralExpression(tsConfigSourceFile), propKey, callback);
}
function getContainingFunction(node) {
  return findAncestor(node.parent, isFunctionLike);
}
function getContainingClass(node) {
  return findAncestor(node.parent, isClassLike);
}
function getContainingClassStaticBlock(node) {
  return findAncestor(node.parent, (n) => {
    if (isClassLike(n) || isFunctionLike(n)) {
      return "quit";
    }
    return isClassStaticBlockDeclaration(n);
  });
}
function getContainingFunctionOrClassStaticBlock(node) {
  return findAncestor(node.parent, isFunctionLikeOrClassStaticBlockDeclaration);
}
function getContainingClassExcludingClassDecorators(node) {
  const decorator = findAncestor(node.parent, (n) => isClassLike(n) ? "quit" : isDecorator(n));
  return decorator && isClassLike(decorator.parent) ? getContainingClass(decorator.parent) : getContainingClass(decorator ?? node);
}
function getThisContainer(node, includeArrowFunctions, includeClassComputedPropertyName) {
  Debug.assert(node.kind !== 312 /* SourceFile */);
  while (true) {
    node = node.parent;
    if (!node) {
      return Debug.fail();
    }
    switch (node.kind) {
      case 167 /* ComputedPropertyName */:
        if (includeClassComputedPropertyName && isClassLike(node.parent.parent)) {
          return node;
        }
        node = node.parent.parent;
        break;
      case 170 /* Decorator */:
        if (node.parent.kind === 169 /* Parameter */ && isClassElement(node.parent.parent)) {
          node = node.parent.parent;
        } else if (isClassElement(node.parent)) {
          node = node.parent;
        }
        break;
      case 219 /* ArrowFunction */:
        if (!includeArrowFunctions) {
          continue;
        }
      case 262 /* FunctionDeclaration */:
      case 218 /* FunctionExpression */:
      case 267 /* ModuleDeclaration */:
      case 175 /* ClassStaticBlockDeclaration */:
      case 172 /* PropertyDeclaration */:
      case 171 /* PropertySignature */:
      case 174 /* MethodDeclaration */:
      case 173 /* MethodSignature */:
      case 176 /* Constructor */:
      case 177 /* GetAccessor */:
      case 178 /* SetAccessor */:
      case 179 /* CallSignature */:
      case 180 /* ConstructSignature */:
      case 181 /* IndexSignature */:
      case 266 /* EnumDeclaration */:
      case 312 /* SourceFile */:
        return node;
    }
  }
}
function isThisContainerOrFunctionBlock(node) {
  switch (node.kind) {
    case 219 /* ArrowFunction */:
    case 262 /* FunctionDeclaration */:
    case 218 /* FunctionExpression */:
    case 172 /* PropertyDeclaration */:
      return true;
    case 241 /* Block */:
      switch (node.parent.kind) {
        case 176 /* Constructor */:
        case 174 /* MethodDeclaration */:
        case 177 /* GetAccessor */:
        case 178 /* SetAccessor */:
          return true;
        default:
          return false;
      }
    default:
      return false;
  }
}
function isInTopLevelContext(node) {
  if (isIdentifier(node) && (isClassDeclaration(node.parent) || isFunctionDeclaration(node.parent)) && node.parent.name === node) {
    node = node.parent;
  }
  const container = getThisContainer(
    node,
    /*includeArrowFunctions*/
    true,
    /*includeClassComputedPropertyName*/
    false
  );
  return isSourceFile(container);
}
function getNewTargetContainer(node) {
  const container = getThisContainer(
    node,
    /*includeArrowFunctions*/
    false,
    /*includeClassComputedPropertyName*/
    false
  );
  if (container) {
    switch (container.kind) {
      case 176 /* Constructor */:
      case 262 /* FunctionDeclaration */:
      case 218 /* FunctionExpression */:
        return container;
    }
  }
  return void 0;
}
function getSuperContainer(node, stopOnFunctions) {
  while (true) {
    node = node.parent;
    if (!node) {
      return void 0;
    }
    switch (node.kind) {
      case 167 /* ComputedPropertyName */:
        node = node.parent;
        break;
      case 262 /* FunctionDeclaration */:
      case 218 /* FunctionExpression */:
      case 219 /* ArrowFunction */:
        if (!stopOnFunctions) {
          continue;
        }
      case 172 /* PropertyDeclaration */:
      case 171 /* PropertySignature */:
      case 174 /* MethodDeclaration */:
      case 173 /* MethodSignature */:
      case 176 /* Constructor */:
      case 177 /* GetAccessor */:
      case 178 /* SetAccessor */:
      case 175 /* ClassStaticBlockDeclaration */:
        return node;
      case 170 /* Decorator */:
        if (node.parent.kind === 169 /* Parameter */ && isClassElement(node.parent.parent)) {
          node = node.parent.parent;
        } else if (isClassElement(node.parent)) {
          node = node.parent;
        }
        break;
    }
  }
}
function getImmediatelyInvokedFunctionExpression(func) {
  if (func.kind === 218 /* FunctionExpression */ || func.kind === 219 /* ArrowFunction */) {
    let prev = func;
    let parent = func.parent;
    while (parent.kind === 217 /* ParenthesizedExpression */) {
      prev = parent;
      parent = parent.parent;
    }
    if (parent.kind === 213 /* CallExpression */ && parent.expression === prev) {
      return parent;
    }
  }
}
function isSuperProperty(node) {
  const kind = node.kind;
  return (kind === 211 /* PropertyAccessExpression */ || kind === 212 /* ElementAccessExpression */) && node.expression.kind === 108 /* SuperKeyword */;
}
function isThisProperty(node) {
  const kind = node.kind;
  return (kind === 211 /* PropertyAccessExpression */ || kind === 212 /* ElementAccessExpression */) && node.expression.kind === 110 /* ThisKeyword */;
}
function isThisInitializedDeclaration(node) {
  var _a;
  return !!node && isVariableDeclaration(node) && ((_a = node.initializer) == null ? void 0 : _a.kind) === 110 /* ThisKeyword */;
}
function isThisInitializedObjectBindingExpression(node) {
  return !!node && (isShorthandPropertyAssignment(node) || isPropertyAssignment(node)) && isBinaryExpression(node.parent.parent) && node.parent.parent.operatorToken.kind === 64 /* EqualsToken */ && node.parent.parent.right.kind === 110 /* ThisKeyword */;
}
function getEntityNameFromTypeNode(node) {
  switch (node.kind) {
    case 183 /* TypeReference */:
      return node.typeName;
    case 233 /* ExpressionWithTypeArguments */:
      return isEntityNameExpression(node.expression) ? node.expression : void 0;
    case 80 /* Identifier */:
    case 166 /* QualifiedName */:
      return node;
  }
  return void 0;
}
function getInvokedExpression(node) {
  switch (node.kind) {
    case 215 /* TaggedTemplateExpression */:
      return node.tag;
    case 286 /* JsxOpeningElement */:
    case 285 /* JsxSelfClosingElement */:
      return node.tagName;
    case 226 /* BinaryExpression */:
      return node.right;
    default:
      return node.expression;
  }
}
function nodeCanBeDecorated(useLegacyDecorators, node, parent, grandparent) {
  if (useLegacyDecorators && isNamedDeclaration(node) && isPrivateIdentifier(node.name)) {
    return false;
  }
  switch (node.kind) {
    case 263 /* ClassDeclaration */:
      return true;
    case 231 /* ClassExpression */:
      return !useLegacyDecorators;
    case 172 /* PropertyDeclaration */:
      return parent !== void 0 && (useLegacyDecorators ? isClassDeclaration(parent) : isClassLike(parent) && !hasAbstractModifier(node) && !hasAmbientModifier(node));
    case 177 /* GetAccessor */:
    case 178 /* SetAccessor */:
    case 174 /* MethodDeclaration */:
      return node.body !== void 0 && parent !== void 0 && (useLegacyDecorators ? isClassDeclaration(parent) : isClassLike(parent));
    case 169 /* Parameter */:
      if (!useLegacyDecorators)
        return false;
      return parent !== void 0 && parent.body !== void 0 && (parent.kind === 176 /* Constructor */ || parent.kind === 174 /* MethodDeclaration */ || parent.kind === 178 /* SetAccessor */) && getThisParameter(parent) !== node && grandparent !== void 0 && grandparent.kind === 263 /* ClassDeclaration */;
  }
  return false;
}
function nodeIsDecorated(useLegacyDecorators, node, parent, grandparent) {
  return hasDecorators(node) && nodeCanBeDecorated(useLegacyDecorators, node, parent, grandparent);
}
function nodeOrChildIsDecorated(useLegacyDecorators, node, parent, grandparent) {
  return nodeIsDecorated(useLegacyDecorators, node, parent, grandparent) || childIsDecorated(useLegacyDecorators, node, parent);
}
function childIsDecorated(useLegacyDecorators, node, parent) {
  switch (node.kind) {
    case 263 /* ClassDeclaration */:
      return some(node.members, (m) => nodeOrChildIsDecorated(useLegacyDecorators, m, node, parent));
    case 231 /* ClassExpression */:
      return !useLegacyDecorators && some(node.members, (m) => nodeOrChildIsDecorated(useLegacyDecorators, m, node, parent));
    case 174 /* MethodDeclaration */:
    case 178 /* SetAccessor */:
    case 176 /* Constructor */:
      return some(node.parameters, (p) => nodeIsDecorated(useLegacyDecorators, p, node, parent));
    default:
      return false;
  }
}
function classOrConstructorParameterIsDecorated(useLegacyDecorators, node) {
  if (nodeIsDecorated(useLegacyDecorators, node))
    return true;
  const constructor = getFirstConstructorWithBody(node);
  return !!constructor && childIsDecorated(useLegacyDecorators, constructor, node);
}
function classElementOrClassElementParameterIsDecorated(useLegacyDecorators, node, parent) {
  let parameters;
  if (isAccessor(node)) {
    const { firstAccessor, secondAccessor, setAccessor } = getAllAccessorDeclarations(parent.members, node);
    const firstAccessorWithDecorators = hasDecorators(firstAccessor) ? firstAccessor : secondAccessor && hasDecorators(secondAccessor) ? secondAccessor : void 0;
    if (!firstAccessorWithDecorators || node !== firstAccessorWithDecorators) {
      return false;
    }
    parameters = setAccessor == null ? void 0 : setAccessor.parameters;
  } else if (isMethodDeclaration(node)) {
    parameters = node.parameters;
  }
  if (nodeIsDecorated(useLegacyDecorators, node, parent)) {
    return true;
  }
  if (parameters) {
    for (const parameter of parameters) {
      if (parameterIsThisKeyword(parameter))
        continue;
      if (nodeIsDecorated(useLegacyDecorators, parameter, node, parent))
        return true;
    }
  }
  return false;
}
function isEmptyStringLiteral(node) {
  if (node.textSourceNode) {
    switch (node.textSourceNode.kind) {
      case 11 /* StringLiteral */:
        return isEmptyStringLiteral(node.textSourceNode);
      case 15 /* NoSubstitutionTemplateLiteral */:
        return node.text === "";
    }
    return false;
  }
  return node.text === "";
}
function isJSXTagName(node) {
  const { parent } = node;
  if (parent.kind === 286 /* JsxOpeningElement */ || parent.kind === 285 /* JsxSelfClosingElement */ || parent.kind === 287 /* JsxClosingElement */) {
    return parent.tagName === node;
  }
  return false;
}
function isExpressionNode(node) {
  switch (node.kind) {
    case 108 /* SuperKeyword */:
    case 106 /* NullKeyword */:
    case 112 /* TrueKeyword */:
    case 97 /* FalseKeyword */:
    case 14 /* RegularExpressionLiteral */:
    case 209 /* ArrayLiteralExpression */:
    case 210 /* ObjectLiteralExpression */:
    case 211 /* PropertyAccessExpression */:
    case 212 /* ElementAccessExpression */:
    case 213 /* CallExpression */:
    case 214 /* NewExpression */:
    case 215 /* TaggedTemplateExpression */:
    case 234 /* AsExpression */:
    case 216 /* TypeAssertionExpression */:
    case 238 /* SatisfiesExpression */:
    case 235 /* NonNullExpression */:
    case 217 /* ParenthesizedExpression */:
    case 218 /* FunctionExpression */:
    case 231 /* ClassExpression */:
    case 219 /* ArrowFunction */:
    case 222 /* VoidExpression */:
    case 220 /* DeleteExpression */:
    case 221 /* TypeOfExpression */:
    case 224 /* PrefixUnaryExpression */:
    case 225 /* PostfixUnaryExpression */:
    case 226 /* BinaryExpression */:
    case 227 /* ConditionalExpression */:
    case 230 /* SpreadElement */:
    case 228 /* TemplateExpression */:
    case 232 /* OmittedExpression */:
    case 284 /* JsxElement */:
    case 285 /* JsxSelfClosingElement */:
    case 288 /* JsxFragment */:
    case 229 /* YieldExpression */:
    case 223 /* AwaitExpression */:
    case 236 /* MetaProperty */:
      return true;
    case 233 /* ExpressionWithTypeArguments */:
      return !isHeritageClause(node.parent) && !isJSDocAugmentsTag(node.parent);
    case 166 /* QualifiedName */:
      while (node.parent.kind === 166 /* QualifiedName */) {
        node = node.parent;
      }
      return node.parent.kind === 186 /* TypeQuery */ || isJSDocLinkLike(node.parent) || isJSDocNameReference(node.parent) || isJSDocMemberName(node.parent) || isJSXTagName(node);
    case 318 /* JSDocMemberName */:
      while (isJSDocMemberName(node.parent)) {
        node = node.parent;
      }
      return node.parent.kind === 186 /* TypeQuery */ || isJSDocLinkLike(node.parent) || isJSDocNameReference(node.parent) || isJSDocMemberName(node.parent) || isJSXTagName(node);
    case 81 /* PrivateIdentifier */:
      return isBinaryExpression(node.parent) && node.parent.left === node && node.parent.operatorToken.kind === 103 /* InKeyword */;
    case 80 /* Identifier */:
      if (node.parent.kind === 186 /* TypeQuery */ || isJSDocLinkLike(node.parent) || isJSDocNameReference(node.parent) || isJSDocMemberName(node.parent) || isJSXTagName(node)) {
        return true;
      }
    case 9 /* NumericLiteral */:
    case 10 /* BigIntLiteral */:
    case 11 /* StringLiteral */:
    case 15 /* NoSubstitutionTemplateLiteral */:
    case 110 /* ThisKeyword */:
      return isInExpressionContext(node);
    default:
      return false;
  }
}
function isInExpressionContext(node) {
  const { parent } = node;
  switch (parent.kind) {
    case 260 /* VariableDeclaration */:
    case 169 /* Parameter */:
    case 172 /* PropertyDeclaration */:
    case 171 /* PropertySignature */:
    case 306 /* EnumMember */:
    case 303 /* PropertyAssignment */:
    case 208 /* BindingElement */:
      return parent.initializer === node;
    case 244 /* ExpressionStatement */:
    case 245 /* IfStatement */:
    case 246 /* DoStatement */:
    case 247 /* WhileStatement */:
    case 253 /* ReturnStatement */:
    case 254 /* WithStatement */:
    case 255 /* SwitchStatement */:
    case 296 /* CaseClause */:
    case 257 /* ThrowStatement */:
      return parent.expression === node;
    case 248 /* ForStatement */:
      const forStatement = parent;
      return forStatement.initializer === node && forStatement.initializer.kind !== 261 /* VariableDeclarationList */ || forStatement.condition === node || forStatement.incrementor === node;
    case 249 /* ForInStatement */:
    case 250 /* ForOfStatement */:
      const forInOrOfStatement = parent;
      return forInOrOfStatement.initializer === node && forInOrOfStatement.initializer.kind !== 261 /* VariableDeclarationList */ || forInOrOfStatement.expression === node;
    case 216 /* TypeAssertionExpression */:
    case 234 /* AsExpression */:
      return node === parent.expression;
    case 239 /* TemplateSpan */:
      return node === parent.expression;
    case 167 /* ComputedPropertyName */:
      return node === parent.expression;
    case 170 /* Decorator */:
    case 294 /* JsxExpression */:
    case 293 /* JsxSpreadAttribute */:
    case 305 /* SpreadAssignment */:
      return true;
    case 233 /* ExpressionWithTypeArguments */:
      return parent.expression === node && !isPartOfTypeNode(parent);
    case 304 /* ShorthandPropertyAssignment */:
      return parent.objectAssignmentInitializer === node;
    case 238 /* SatisfiesExpression */:
      return node === parent.expression;
    default:
      return isExpressionNode(parent);
  }
}
function isPartOfTypeQuery(node) {
  while (node.kind === 166 /* QualifiedName */ || node.kind === 80 /* Identifier */) {
    node = node.parent;
  }
  return node.kind === 186 /* TypeQuery */;
}
function isNamespaceReexportDeclaration(node) {
  return isNamespaceExport(node) && !!node.parent.moduleSpecifier;
}
function isExternalModuleImportEqualsDeclaration(node) {
  return node.kind === 271 /* ImportEqualsDeclaration */ && node.moduleReference.kind === 283 /* ExternalModuleReference */;
}
function getExternalModuleImportEqualsDeclarationExpression(node) {
  Debug.assert(isExternalModuleImportEqualsDeclaration(node));
  return node.moduleReference.expression;
}
function getExternalModuleRequireArgument(node) {
  return isVariableDeclarationInitializedToBareOrAccessedRequire(node) && getLeftmostAccessExpression(node.initializer).arguments[0];
}
function isInternalModuleImportEqualsDeclaration(node) {
  return node.kind === 271 /* ImportEqualsDeclaration */ && node.moduleReference.kind !== 283 /* ExternalModuleReference */;
}
function isSourceFileJS(file) {
  return isInJSFile(file);
}
function isInJSFile(node) {
  return !!node && !!(node.flags & 524288 /* JavaScriptFile */);
}
function isInJsonFile(node) {
  return !!node && !!(node.flags & 134217728 /* JsonFile */);
}
function isSourceFileNotJson(file) {
  return !isJsonSourceFile(file);
}
function isInJSDoc(node) {
  return !!node && !!(node.flags & 16777216 /* JSDoc */);
}
function isJSDocIndexSignature(node) {
  return isTypeReferenceNode(node) && isIdentifier(node.typeName) && node.typeName.escapedText === "Object" && node.typeArguments && node.typeArguments.length === 2 && (node.typeArguments[0].kind === 154 /* StringKeyword */ || node.typeArguments[0].kind === 150 /* NumberKeyword */);
}
function isRequireCall(callExpression, requireStringLiteralLikeArgument) {
  if (callExpression.kind !== 213 /* CallExpression */) {
    return false;
  }
  const { expression, arguments: args } = callExpression;
  if (expression.kind !== 80 /* Identifier */ || expression.escapedText !== "require") {
    return false;
  }
  if (args.length !== 1) {
    return false;
  }
  const arg = args[0];
  return !requireStringLiteralLikeArgument || isStringLiteralLike(arg);
}
function isVariableDeclarationInitializedToRequire(node) {
  return isVariableDeclarationInitializedWithRequireHelper(
    node,
    /*allowAccessedRequire*/
    false
  );
}
function isVariableDeclarationInitializedToBareOrAccessedRequire(node) {
  return isVariableDeclarationInitializedWithRequireHelper(
    node,
    /*allowAccessedRequire*/
    true
  );
}
function isBindingElementOfBareOrAccessedRequire(node) {
  return isBindingElement(node) && isVariableDeclarationInitializedToBareOrAccessedRequire(node.parent.parent);
}
function isVariableDeclarationInitializedWithRequireHelper(node, allowAccessedRequire) {
  return isVariableDeclaration(node) && !!node.initializer && isRequireCall(
    allowAccessedRequire ? getLeftmostAccessExpression(node.initializer) : node.initializer,
    /*requireStringLiteralLikeArgument*/
    true
  );
}
function isRequireVariableStatement(node) {
  return isVariableStatement(node) && node.declarationList.declarations.length > 0 && every(node.declarationList.declarations, (decl) => isVariableDeclarationInitializedToRequire(decl));
}
function isSingleOrDoubleQuote(charCode) {
  return charCode === 39 /* singleQuote */ || charCode === 34 /* doubleQuote */;
}
function isStringDoubleQuoted(str, sourceFile) {
  return getSourceTextOfNodeFromSourceFile(sourceFile, str).charCodeAt(0) === 34 /* doubleQuote */;
}
function isAssignmentDeclaration(decl) {
  return isBinaryExpression(decl) || isAccessExpression(decl) || isIdentifier(decl) || isCallExpression(decl);
}
function getEffectiveInitializer(node) {
  if (isInJSFile(node) && node.initializer && isBinaryExpression(node.initializer) && (node.initializer.operatorToken.kind === 57 /* BarBarToken */ || node.initializer.operatorToken.kind === 61 /* QuestionQuestionToken */) && node.name && isEntityNameExpression(node.name) && isSameEntityName(node.name, node.initializer.left)) {
    return node.initializer.right;
  }
  return node.initializer;
}
function getDeclaredExpandoInitializer(node) {
  const init = getEffectiveInitializer(node);
  return init && getExpandoInitializer(init, isPrototypeAccess(node.name));
}
function hasExpandoValueProperty(node, isPrototypeAssignment) {
  return forEach(node.properties, (p) => isPropertyAssignment(p) && isIdentifier(p.name) && p.name.escapedText === "value" && p.initializer && getExpandoInitializer(p.initializer, isPrototypeAssignment));
}
function getAssignedExpandoInitializer(node) {
  if (node && node.parent && isBinaryExpression(node.parent) && node.parent.operatorToken.kind === 64 /* EqualsToken */) {
    const isPrototypeAssignment = isPrototypeAccess(node.parent.left);
    return getExpandoInitializer(node.parent.right, isPrototypeAssignment) || getDefaultedExpandoInitializer(node.parent.left, node.parent.right, isPrototypeAssignment);
  }
  if (node && isCallExpression(node) && isBindableObjectDefinePropertyCall(node)) {
    const result = hasExpandoValueProperty(node.arguments[2], node.arguments[1].text === "prototype");
    if (result) {
      return result;
    }
  }
}
function getExpandoInitializer(initializer, isPrototypeAssignment) {
  if (isCallExpression(initializer)) {
    const e = skipParentheses(initializer.expression);
    return e.kind === 218 /* FunctionExpression */ || e.kind === 219 /* ArrowFunction */ ? initializer : void 0;
  }
  if (initializer.kind === 218 /* FunctionExpression */ || initializer.kind === 231 /* ClassExpression */ || initializer.kind === 219 /* ArrowFunction */) {
    return initializer;
  }
  if (isObjectLiteralExpression(initializer) && (initializer.properties.length === 0 || isPrototypeAssignment)) {
    return initializer;
  }
}
function getDefaultedExpandoInitializer(name, initializer, isPrototypeAssignment) {
  const e = isBinaryExpression(initializer) && (initializer.operatorToken.kind === 57 /* BarBarToken */ || initializer.operatorToken.kind === 61 /* QuestionQuestionToken */) && getExpandoInitializer(initializer.right, isPrototypeAssignment);
  if (e && isSameEntityName(name, initializer.left)) {
    return e;
  }
}
function isDefaultedExpandoInitializer(node) {
  const name = isVariableDeclaration(node.parent) ? node.parent.name : isBinaryExpression(node.parent) && node.parent.operatorToken.kind === 64 /* EqualsToken */ ? node.parent.left : void 0;
  return name && getExpandoInitializer(node.right, isPrototypeAccess(name)) && isEntityNameExpression(name) && isSameEntityName(name, node.left);
}
function getNameOfExpando(node) {
  if (isBinaryExpression(node.parent)) {
    const parent = (node.parent.operatorToken.kind === 57 /* BarBarToken */ || node.parent.operatorToken.kind === 61 /* QuestionQuestionToken */) && isBinaryExpression(node.parent.parent) ? node.parent.parent : node.parent;
    if (parent.operatorToken.kind === 64 /* EqualsToken */ && isIdentifier(parent.left)) {
      return parent.left;
    }
  } else if (isVariableDeclaration(node.parent)) {
    return node.parent.name;
  }
}
function isSameEntityName(name, initializer) {
  if (isPropertyNameLiteral(name) && isPropertyNameLiteral(initializer)) {
    return getTextOfIdentifierOrLiteral(name) === getTextOfIdentifierOrLiteral(initializer);
  }
  if (isMemberName(name) && isLiteralLikeAccess(initializer) && (initializer.expression.kind === 110 /* ThisKeyword */ || isIdentifier(initializer.expression) && (initializer.expression.escapedText === "window" || initializer.expression.escapedText === "self" || initializer.expression.escapedText === "global"))) {
    return isSameEntityName(name, getNameOrArgument(initializer));
  }
  if (isLiteralLikeAccess(name) && isLiteralLikeAccess(initializer)) {
    return getElementOrPropertyAccessName(name) === getElementOrPropertyAccessName(initializer) && isSameEntityName(name.expression, initializer.expression);
  }
  return false;
}
function getRightMostAssignedExpression(node) {
  while (isAssignmentExpression(
    node,
    /*excludeCompoundAssignment*/
    true
  )) {
    node = node.right;
  }
  return node;
}
function isExportsIdentifier(node) {
  return isIdentifier(node) && node.escapedText === "exports";
}
function isModuleIdentifier(node) {
  return isIdentifier(node) && node.escapedText === "module";
}
function isModuleExportsAccessExpression(node) {
  return (isPropertyAccessExpression(node) || isLiteralLikeElementAccess(node)) && isModuleIdentifier(node.expression) && getElementOrPropertyAccessName(node) === "exports";
}
function getAssignmentDeclarationKind(expr) {
  const special = getAssignmentDeclarationKindWorker(expr);
  return special === 5 /* Property */ || isInJSFile(expr) ? special : 0 /* None */;
}
function isBindableObjectDefinePropertyCall(expr) {
  return length(expr.arguments) === 3 && isPropertyAccessExpression(expr.expression) && isIdentifier(expr.expression.expression) && idText(expr.expression.expression) === "Object" && idText(expr.expression.name) === "defineProperty" && isStringOrNumericLiteralLike(expr.arguments[1]) && isBindableStaticNameExpression(
    expr.arguments[0],
    /*excludeThisKeyword*/
    true
  );
}
function isLiteralLikeAccess(node) {
  return isPropertyAccessExpression(node) || isLiteralLikeElementAccess(node);
}
function isLiteralLikeElementAccess(node) {
  return isElementAccessExpression(node) && isStringOrNumericLiteralLike(node.argumentExpression);
}
function isBindableStaticAccessExpression(node, excludeThisKeyword) {
  return isPropertyAccessExpression(node) && (!excludeThisKeyword && node.expression.kind === 110 /* ThisKeyword */ || isIdentifier(node.name) && isBindableStaticNameExpression(
    node.expression,
    /*excludeThisKeyword*/
    true
  )) || isBindableStaticElementAccessExpression(node, excludeThisKeyword);
}
function isBindableStaticElementAccessExpression(node, excludeThisKeyword) {
  return isLiteralLikeElementAccess(node) && (!excludeThisKeyword && node.expression.kind === 110 /* ThisKeyword */ || isEntityNameExpression(node.expression) || isBindableStaticAccessExpression(
    node.expression,
    /*excludeThisKeyword*/
    true
  ));
}
function isBindableStaticNameExpression(node, excludeThisKeyword) {
  return isEntityNameExpression(node) || isBindableStaticAccessExpression(node, excludeThisKeyword);
}
function getNameOrArgument(expr) {
  if (isPropertyAccessExpression(expr)) {
    return expr.name;
  }
  return expr.argumentExpression;
}
function getAssignmentDeclarationKindWorker(expr) {
  if (isCallExpression(expr)) {
    if (!isBindableObjectDefinePropertyCall(expr)) {
      return 0 /* None */;
    }
    const entityName = expr.arguments[0];
    if (isExportsIdentifier(entityName) || isModuleExportsAccessExpression(entityName)) {
      return 8 /* ObjectDefinePropertyExports */;
    }
    if (isBindableStaticAccessExpression(entityName) && getElementOrPropertyAccessName(entityName) === "prototype") {
      return 9 /* ObjectDefinePrototypeProperty */;
    }
    return 7 /* ObjectDefinePropertyValue */;
  }
  if (expr.operatorToken.kind !== 64 /* EqualsToken */ || !isAccessExpression(expr.left) || isVoidZero(getRightMostAssignedExpression(expr))) {
    return 0 /* None */;
  }
  if (isBindableStaticNameExpression(
    expr.left.expression,
    /*excludeThisKeyword*/
    true
  ) && getElementOrPropertyAccessName(expr.left) === "prototype" && isObjectLiteralExpression(getInitializerOfBinaryExpression(expr))) {
    return 6 /* Prototype */;
  }
  return getAssignmentDeclarationPropertyAccessKind(expr.left);
}
function isVoidZero(node) {
  return isVoidExpression(node) && isNumericLiteral(node.expression) && node.expression.text === "0";
}
function getElementOrPropertyAccessArgumentExpressionOrName(node) {
  if (isPropertyAccessExpression(node)) {
    return node.name;
  }
  const arg = skipParentheses(node.argumentExpression);
  if (isNumericLiteral(arg) || isStringLiteralLike(arg)) {
    return arg;
  }
  return node;
}
function getElementOrPropertyAccessName(node) {
  const name = getElementOrPropertyAccessArgumentExpressionOrName(node);
  if (name) {
    if (isIdentifier(name)) {
      return name.escapedText;
    }
    if (isStringLiteralLike(name) || isNumericLiteral(name)) {
      return escapeLeadingUnderscores(name.text);
    }
  }
  return void 0;
}
function getAssignmentDeclarationPropertyAccessKind(lhs) {
  if (lhs.expression.kind === 110 /* ThisKeyword */) {
    return 4 /* ThisProperty */;
  } else if (isModuleExportsAccessExpression(lhs)) {
    return 2 /* ModuleExports */;
  } else if (isBindableStaticNameExpression(
    lhs.expression,
    /*excludeThisKeyword*/
    true
  )) {
    if (isPrototypeAccess(lhs.expression)) {
      return 3 /* PrototypeProperty */;
    }
    let nextToLast = lhs;
    while (!isIdentifier(nextToLast.expression)) {
      nextToLast = nextToLast.expression;
    }
    const id = nextToLast.expression;
    if ((id.escapedText === "exports" || id.escapedText === "module" && getElementOrPropertyAccessName(nextToLast) === "exports") && // ExportsProperty does not support binding with computed names
    isBindableStaticAccessExpression(lhs)) {
      return 1 /* ExportsProperty */;
    }
    if (isBindableStaticNameExpression(
      lhs,
      /*excludeThisKeyword*/
      true
    ) || isElementAccessExpression(lhs) && isDynamicName(lhs)) {
      return 5 /* Property */;
    }
  }
  return 0 /* None */;
}
function getInitializerOfBinaryExpression(expr) {
  while (isBinaryExpression(expr.right)) {
    expr = expr.right;
  }
  return expr.right;
}
function isPrototypePropertyAssignment(node) {
  return isBinaryExpression(node) && getAssignmentDeclarationKind(node) === 3 /* PrototypeProperty */;
}
function isSpecialPropertyDeclaration(expr) {
  return isInJSFile(expr) && expr.parent && expr.parent.kind === 244 /* ExpressionStatement */ && (!isElementAccessExpression(expr) || isLiteralLikeElementAccess(expr)) && !!getJSDocTypeTag(expr.parent);
}
function setValueDeclaration(symbol, node) {
  const { valueDeclaration } = symbol;
  if (!valueDeclaration || !(node.flags & 33554432 /* Ambient */ && !isInJSFile(node) && !(valueDeclaration.flags & 33554432 /* Ambient */)) && (isAssignmentDeclaration(valueDeclaration) && !isAssignmentDeclaration(node)) || valueDeclaration.kind !== node.kind && isEffectiveModuleDeclaration(valueDeclaration)) {
    symbol.valueDeclaration = node;
  }
}
function isFunctionSymbol(symbol) {
  if (!symbol || !symbol.valueDeclaration) {
    return false;
  }
  const decl = symbol.valueDeclaration;
  return decl.kind === 262 /* FunctionDeclaration */ || isVariableDeclaration(decl) && decl.initializer && isFunctionLike(decl.initializer);
}
function tryGetModuleSpecifierFromDeclaration(node) {
  var _a, _b;
  switch (node.kind) {
    case 260 /* VariableDeclaration */:
    case 208 /* BindingElement */:
      return (_a = findAncestor(node.initializer, (node2) => isRequireCall(
        node2,
        /*requireStringLiteralLikeArgument*/
        true
      ))) == null ? void 0 : _a.arguments[0];
    case 272 /* ImportDeclaration */:
    case 278 /* ExportDeclaration */:
      return tryCast(node.moduleSpecifier, isStringLiteralLike);
    case 271 /* ImportEqualsDeclaration */:
      return tryCast((_b = tryCast(node.moduleReference, isExternalModuleReference)) == null ? void 0 : _b.expression, isStringLiteralLike);
    case 273 /* ImportClause */:
    case 280 /* NamespaceExport */:
      return tryCast(node.parent.moduleSpecifier, isStringLiteralLike);
    case 274 /* NamespaceImport */:
    case 281 /* ExportSpecifier */:
      return tryCast(node.parent.parent.moduleSpecifier, isStringLiteralLike);
    case 276 /* ImportSpecifier */:
      return tryCast(node.parent.parent.parent.moduleSpecifier, isStringLiteralLike);
    case 205 /* ImportType */:
      return isLiteralImportTypeNode(node) ? node.argument.literal : void 0;
    default:
      Debug.assertNever(node);
  }
}
function getExternalModuleName(node) {
  switch (node.kind) {
    case 272 /* ImportDeclaration */:
    case 278 /* ExportDeclaration */:
      return node.moduleSpecifier;
    case 271 /* ImportEqualsDeclaration */:
      return node.moduleReference.kind === 283 /* ExternalModuleReference */ ? node.moduleReference.expression : void 0;
    case 205 /* ImportType */:
      return isLiteralImportTypeNode(node) ? node.argument.literal : void 0;
    case 213 /* CallExpression */:
      return node.arguments[0];
    case 267 /* ModuleDeclaration */:
      return node.name.kind === 11 /* StringLiteral */ ? node.name : void 0;
    default:
      return Debug.assertNever(node);
  }
}
function getNamespaceDeclarationNode(node) {
  switch (node.kind) {
    case 272 /* ImportDeclaration */:
      return node.importClause && tryCast(node.importClause.namedBindings, isNamespaceImport);
    case 271 /* ImportEqualsDeclaration */:
      return node;
    case 278 /* ExportDeclaration */:
      return node.exportClause && tryCast(node.exportClause, isNamespaceExport);
    default:
      return Debug.assertNever(node);
  }
}
function isDefaultImport(node) {
  return node.kind === 272 /* ImportDeclaration */ && !!node.importClause && !!node.importClause.name;
}
function forEachImportClauseDeclaration(node, action) {
  if (node.name) {
    const result = action(node);
    if (result)
      return result;
  }
  if (node.namedBindings) {
    const result = isNamespaceImport(node.namedBindings) ? action(node.namedBindings) : forEach(node.namedBindings.elements, action);
    if (result)
      return result;
  }
}
function hasQuestionToken(node) {
  if (node) {
    switch (node.kind) {
      case 169 /* Parameter */:
      case 174 /* MethodDeclaration */:
      case 173 /* MethodSignature */:
      case 304 /* ShorthandPropertyAssignment */:
      case 303 /* PropertyAssignment */:
      case 172 /* PropertyDeclaration */:
      case 171 /* PropertySignature */:
        return node.questionToken !== void 0;
    }
  }
  return false;
}
function isJSDocConstructSignature(node) {
  const param = isJSDocFunctionType(node) ? firstOrUndefined(node.parameters) : void 0;
  const name = tryCast(param && param.name, isIdentifier);
  return !!name && name.escapedText === "new";
}
function isJSDocTypeAlias(node) {
  return node.kind === 353 /* JSDocTypedefTag */ || node.kind === 345 /* JSDocCallbackTag */ || node.kind === 347 /* JSDocEnumTag */;
}
function isTypeAlias(node) {
  return isJSDocTypeAlias(node) || isTypeAliasDeclaration(node);
}
function getSourceOfAssignment(node) {
  return isExpressionStatement(node) && isBinaryExpression(node.expression) && node.expression.operatorToken.kind === 64 /* EqualsToken */ ? getRightMostAssignedExpression(node.expression) : void 0;
}
function getSourceOfDefaultedAssignment(node) {
  return isExpressionStatement(node) && isBinaryExpression(node.expression) && getAssignmentDeclarationKind(node.expression) !== 0 /* None */ && isBinaryExpression(node.expression.right) && (node.expression.right.operatorToken.kind === 57 /* BarBarToken */ || node.expression.right.operatorToken.kind === 61 /* QuestionQuestionToken */) ? node.expression.right.right : void 0;
}
function getSingleInitializerOfVariableStatementOrPropertyDeclaration(node) {
  switch (node.kind) {
    case 243 /* VariableStatement */:
      const v = getSingleVariableOfVariableStatement(node);
      return v && v.initializer;
    case 172 /* PropertyDeclaration */:
      return node.initializer;
    case 303 /* PropertyAssignment */:
      return node.initializer;
  }
}
function getSingleVariableOfVariableStatement(node) {
  return isVariableStatement(node) ? firstOrUndefined(node.declarationList.declarations) : void 0;
}
function getNestedModuleDeclaration(node) {
  return isModuleDeclaration(node) && node.body && node.body.kind === 267 /* ModuleDeclaration */ ? node.body : void 0;
}
function canHaveFlowNode(node) {
  if (node.kind >= 243 /* FirstStatement */ && node.kind <= 259 /* LastStatement */) {
    return true;
  }
  switch (node.kind) {
    case 80 /* Identifier */:
    case 110 /* ThisKeyword */:
    case 108 /* SuperKeyword */:
    case 166 /* QualifiedName */:
    case 236 /* MetaProperty */:
    case 212 /* ElementAccessExpression */:
    case 211 /* PropertyAccessExpression */:
    case 208 /* BindingElement */:
    case 218 /* FunctionExpression */:
    case 219 /* ArrowFunction */:
    case 174 /* MethodDeclaration */:
    case 177 /* GetAccessor */:
    case 178 /* SetAccessor */:
      return true;
    default:
      return false;
  }
}
function canHaveJSDoc(node) {
  switch (node.kind) {
    case 219 /* ArrowFunction */:
    case 226 /* BinaryExpression */:
    case 241 /* Block */:
    case 252 /* BreakStatement */:
    case 179 /* CallSignature */:
    case 296 /* CaseClause */:
    case 263 /* ClassDeclaration */:
    case 231 /* ClassExpression */:
    case 175 /* ClassStaticBlockDeclaration */:
    case 176 /* Constructor */:
    case 185 /* ConstructorType */:
    case 180 /* ConstructSignature */:
    case 251 /* ContinueStatement */:
    case 259 /* DebuggerStatement */:
    case 246 /* DoStatement */:
    case 212 /* ElementAccessExpression */:
    case 242 /* EmptyStatement */:
    case 1 /* EndOfFileToken */:
    case 266 /* EnumDeclaration */:
    case 306 /* EnumMember */:
    case 277 /* ExportAssignment */:
    case 278 /* ExportDeclaration */:
    case 281 /* ExportSpecifier */:
    case 244 /* ExpressionStatement */:
    case 249 /* ForInStatement */:
    case 250 /* ForOfStatement */:
    case 248 /* ForStatement */:
    case 262 /* FunctionDeclaration */:
    case 218 /* FunctionExpression */:
    case 184 /* FunctionType */:
    case 177 /* GetAccessor */:
    case 80 /* Identifier */:
    case 245 /* IfStatement */:
    case 272 /* ImportDeclaration */:
    case 271 /* ImportEqualsDeclaration */:
    case 181 /* IndexSignature */:
    case 264 /* InterfaceDeclaration */:
    case 324 /* JSDocFunctionType */:
    case 330 /* JSDocSignature */:
    case 256 /* LabeledStatement */:
    case 174 /* MethodDeclaration */:
    case 173 /* MethodSignature */:
    case 267 /* ModuleDeclaration */:
    case 202 /* NamedTupleMember */:
    case 270 /* NamespaceExportDeclaration */:
    case 210 /* ObjectLiteralExpression */:
    case 169 /* Parameter */:
    case 217 /* ParenthesizedExpression */:
    case 211 /* PropertyAccessExpression */:
    case 303 /* PropertyAssignment */:
    case 172 /* PropertyDeclaration */:
    case 171 /* PropertySignature */:
    case 253 /* ReturnStatement */:
    case 240 /* SemicolonClassElement */:
    case 178 /* SetAccessor */:
    case 304 /* ShorthandPropertyAssignment */:
    case 305 /* SpreadAssignment */:
    case 255 /* SwitchStatement */:
    case 257 /* ThrowStatement */:
    case 258 /* TryStatement */:
    case 265 /* TypeAliasDeclaration */:
    case 168 /* TypeParameter */:
    case 260 /* VariableDeclaration */:
    case 243 /* VariableStatement */:
    case 247 /* WhileStatement */:
    case 254 /* WithStatement */:
      return true;
    default:
      return false;
  }
}
function getJSDocCommentsAndTags(hostNode, noCache) {
  let result;
  if (isVariableLike(hostNode) && hasInitializer(hostNode) && hasJSDocNodes(hostNode.initializer)) {
    result = addRange(result, filterOwnedJSDocTags(hostNode, hostNode.initializer.jsDoc));
  }
  let node = hostNode;
  while (node && node.parent) {
    if (hasJSDocNodes(node)) {
      result = addRange(result, filterOwnedJSDocTags(hostNode, node.jsDoc));
    }
    if (node.kind === 169 /* Parameter */) {
      result = addRange(result, (noCache ? getJSDocParameterTagsNoCache : getJSDocParameterTags)(node));
      break;
    }
    if (node.kind === 168 /* TypeParameter */) {
      result = addRange(result, (noCache ? getJSDocTypeParameterTagsNoCache : getJSDocTypeParameterTags)(node));
      break;
    }
    node = getNextJSDocCommentLocation(node);
  }
  return result || emptyArray;
}
function filterOwnedJSDocTags(hostNode, comments) {
  const lastJsDoc = last(comments);
  return flatMap(comments, (jsDoc) => {
    if (jsDoc === lastJsDoc) {
      const ownedTags = filter(jsDoc.tags, (tag) => ownsJSDocTag(hostNode, tag));
      return jsDoc.tags === ownedTags ? [jsDoc] : ownedTags;
    } else {
      return filter(jsDoc.tags, isJSDocOverloadTag);
    }
  });
}
function ownsJSDocTag(hostNode, tag) {
  return !(isJSDocTypeTag(tag) || isJSDocSatisfiesTag(tag)) || !tag.parent || !isJSDoc(tag.parent) || !isParenthesizedExpression(tag.parent.parent) || tag.parent.parent === hostNode;
}
function getNextJSDocCommentLocation(node) {
  const parent = node.parent;
  if (parent.kind === 303 /* PropertyAssignment */ || parent.kind === 277 /* ExportAssignment */ || parent.kind === 172 /* PropertyDeclaration */ || parent.kind === 244 /* ExpressionStatement */ && node.kind === 211 /* PropertyAccessExpression */ || parent.kind === 253 /* ReturnStatement */ || getNestedModuleDeclaration(parent) || isAssignmentExpression(node)) {
    return parent;
  } else if (parent.parent && (getSingleVariableOfVariableStatement(parent.parent) === node || isAssignmentExpression(parent))) {
    return parent.parent;
  } else if (parent.parent && parent.parent.parent && (getSingleVariableOfVariableStatement(parent.parent.parent) || getSingleInitializerOfVariableStatementOrPropertyDeclaration(parent.parent.parent) === node || getSourceOfDefaultedAssignment(parent.parent.parent))) {
    return parent.parent.parent;
  }
}
function getParameterSymbolFromJSDoc(node) {
  if (node.symbol) {
    return node.symbol;
  }
  if (!isIdentifier(node.name)) {
    return void 0;
  }
  const name = node.name.escapedText;
  const decl = getHostSignatureFromJSDoc(node);
  if (!decl) {
    return void 0;
  }
  const parameter = find(decl.parameters, (p) => p.name.kind === 80 /* Identifier */ && p.name.escapedText === name);
  return parameter && parameter.symbol;
}
function getEffectiveContainerForJSDocTemplateTag(node) {
  if (isJSDoc(node.parent) && node.parent.tags) {
    const typeAlias = find(node.parent.tags, isJSDocTypeAlias);
    if (typeAlias) {
      return typeAlias;
    }
  }
  return getHostSignatureFromJSDoc(node);
}
function getJSDocOverloadTags(node) {
  return getAllJSDocTags(node, isJSDocOverloadTag);
}
function getHostSignatureFromJSDoc(node) {
  const host = getEffectiveJSDocHost(node);
  if (host) {
    return isPropertySignature(host) && host.type && isFunctionLike(host.type) ? host.type : isFunctionLike(host) ? host : void 0;
  }
  return void 0;
}
function getEffectiveJSDocHost(node) {
  const host = getJSDocHost(node);
  if (host) {
    return getSourceOfDefaultedAssignment(host) || getSourceOfAssignment(host) || getSingleInitializerOfVariableStatementOrPropertyDeclaration(host) || getSingleVariableOfVariableStatement(host) || getNestedModuleDeclaration(host) || host;
  }
}
function getJSDocHost(node) {
  const jsDoc = getJSDocRoot(node);
  if (!jsDoc) {
    return void 0;
  }
  const host = jsDoc.parent;
  if (host && host.jsDoc && jsDoc === lastOrUndefined(host.jsDoc)) {
    return host;
  }
}
function getJSDocRoot(node) {
  return findAncestor(node.parent, isJSDoc);
}
function getTypeParameterFromJsDoc(node) {
  const name = node.name.escapedText;
  const { typeParameters } = node.parent.parent.parent;
  return typeParameters && find(typeParameters, (p) => p.name.escapedText === name);
}
function getAssignmentTarget(node) {
  let parent = node.parent;
  while (true) {
    switch (parent.kind) {
      case 226 /* BinaryExpression */:
        const binaryExpression = parent;
        const binaryOperator = binaryExpression.operatorToken.kind;
        return isAssignmentOperator(binaryOperator) && binaryExpression.left === node ? binaryExpression : void 0;
      case 224 /* PrefixUnaryExpression */:
      case 225 /* PostfixUnaryExpression */:
        const unaryExpression = parent;
        const unaryOperator = unaryExpression.operator;
        return unaryOperator === 46 /* PlusPlusToken */ || unaryOperator === 47 /* MinusMinusToken */ ? unaryExpression : void 0;
      case 249 /* ForInStatement */:
      case 250 /* ForOfStatement */:
        const forInOrOfStatement = parent;
        return forInOrOfStatement.initializer === node ? forInOrOfStatement : void 0;
      case 217 /* ParenthesizedExpression */:
      case 209 /* ArrayLiteralExpression */:
      case 230 /* SpreadElement */:
      case 235 /* NonNullExpression */:
        node = parent;
        break;
      case 305 /* SpreadAssignment */:
        node = parent.parent;
        break;
      case 304 /* ShorthandPropertyAssignment */:
        if (parent.name !== node) {
          return void 0;
        }
        node = parent.parent;
        break;
      case 303 /* PropertyAssignment */:
        if (parent.name === node) {
          return void 0;
        }
        node = parent.parent;
        break;
      default:
        return void 0;
    }
    parent = node.parent;
  }
}
function getAssignmentTargetKind(node) {
  const target = getAssignmentTarget(node);
  if (!target) {
    return 0 /* None */;
  }
  switch (target.kind) {
    case 226 /* BinaryExpression */:
      const binaryOperator = target.operatorToken.kind;
      return binaryOperator === 64 /* EqualsToken */ || isLogicalOrCoalescingAssignmentOperator(binaryOperator) ? 1 /* Definite */ : 2 /* Compound */;
    case 224 /* PrefixUnaryExpression */:
    case 225 /* PostfixUnaryExpression */:
      return 2 /* Compound */;
    case 249 /* ForInStatement */:
    case 250 /* ForOfStatement */:
      return 1 /* Definite */;
  }
}
function isAssignmentTarget(node) {
  return !!getAssignmentTarget(node);
}
function isCompoundLikeAssignment(assignment) {
  const right = skipParentheses(assignment.right);
  return right.kind === 226 /* BinaryExpression */ && isShiftOperatorOrHigher(right.operatorToken.kind);
}
function isInCompoundLikeAssignment(node) {
  const target = getAssignmentTarget(node);
  return !!target && isAssignmentExpression(
    target,
    /*excludeCompoundAssignment*/
    true
  ) && isCompoundLikeAssignment(target);
}
function isNodeWithPossibleHoistedDeclaration(node) {
  switch (node.kind) {
    case 241 /* Block */:
    case 243 /* VariableStatement */:
    case 254 /* WithStatement */:
    case 245 /* IfStatement */:
    case 255 /* SwitchStatement */:
    case 269 /* CaseBlock */:
    case 296 /* CaseClause */:
    case 297 /* DefaultClause */:
    case 256 /* LabeledStatement */:
    case 248 /* ForStatement */:
    case 249 /* ForInStatement */:
    case 250 /* ForOfStatement */:
    case 246 /* DoStatement */:
    case 247 /* WhileStatement */:
    case 258 /* TryStatement */:
    case 299 /* CatchClause */:
      return true;
  }
  return false;
}
function isValueSignatureDeclaration(node) {
  return isFunctionExpression(node) || isArrowFunction(node) || isMethodOrAccessor(node) || isFunctionDeclaration(node) || isConstructorDeclaration(node);
}
function walkUp(node, kind) {
  while (node && node.kind === kind) {
    node = node.parent;
  }
  return node;
}
function walkUpParenthesizedTypes(node) {
  return walkUp(node, 196 /* ParenthesizedType */);
}
function walkUpParenthesizedExpressions(node) {
  return walkUp(node, 217 /* ParenthesizedExpression */);
}
function walkUpParenthesizedTypesAndGetParentAndChild(node) {
  let child;
  while (node && node.kind === 196 /* ParenthesizedType */) {
    child = node;
    node = node.parent;
  }
  return [child, node];
}
function skipTypeParentheses(node) {
  while (isParenthesizedTypeNode(node))
    node = node.type;
  return node;
}
function skipParentheses(node, excludeJSDocTypeAssertions) {
  const flags = excludeJSDocTypeAssertions ? 1 /* Parentheses */ | 16 /* ExcludeJSDocTypeAssertion */ : 1 /* Parentheses */;
  return skipOuterExpressions(node, flags);
}
function isDeleteTarget(node) {
  if (node.kind !== 211 /* PropertyAccessExpression */ && node.kind !== 212 /* ElementAccessExpression */) {
    return false;
  }
  node = walkUpParenthesizedExpressions(node.parent);
  return node && node.kind === 220 /* DeleteExpression */;
}
function isNodeDescendantOf(node, ancestor) {
  while (node) {
    if (node === ancestor)
      return true;
    node = node.parent;
  }
  return false;
}
function isDeclarationName(name) {
  return !isSourceFile(name) && !isBindingPattern(name) && isDeclaration(name.parent) && name.parent.name === name;
}
function isLiteralComputedPropertyDeclarationName(node) {
  return isStringOrNumericLiteralLike(node) && node.parent.kind === 167 /* ComputedPropertyName */ && isDeclaration(node.parent.parent);
}
function isIdentifierName(node) {
  const parent = node.parent;
  switch (parent.kind) {
    case 172 /* PropertyDeclaration */:
    case 171 /* PropertySignature */:
    case 174 /* MethodDeclaration */:
    case 173 /* MethodSignature */:
    case 177 /* GetAccessor */:
    case 178 /* SetAccessor */:
    case 306 /* EnumMember */:
    case 303 /* PropertyAssignment */:
    case 211 /* PropertyAccessExpression */:
      return parent.name === node;
    case 166 /* QualifiedName */:
      return parent.right === node;
    case 208 /* BindingElement */:
    case 276 /* ImportSpecifier */:
      return parent.propertyName === node;
    case 281 /* ExportSpecifier */:
    case 291 /* JsxAttribute */:
    case 285 /* JsxSelfClosingElement */:
    case 286 /* JsxOpeningElement */:
    case 287 /* JsxClosingElement */:
      return true;
  }
  return false;
}
function getAliasDeclarationFromName(node) {
  switch (node.parent.kind) {
    case 273 /* ImportClause */:
    case 276 /* ImportSpecifier */:
    case 274 /* NamespaceImport */:
    case 281 /* ExportSpecifier */:
    case 277 /* ExportAssignment */:
    case 271 /* ImportEqualsDeclaration */:
    case 280 /* NamespaceExport */:
      return node.parent;
    case 166 /* QualifiedName */:
      do {
        node = node.parent;
      } while (node.parent.kind === 166 /* QualifiedName */);
      return getAliasDeclarationFromName(node);
  }
}
function isAliasableExpression(e) {
  return isEntityNameExpression(e) || isClassExpression(e);
}
function exportAssignmentIsAlias(node) {
  const e = getExportAssignmentExpression(node);
  return isAliasableExpression(e);
}
function getExportAssignmentExpression(node) {
  return isExportAssignment(node) ? node.expression : node.right;
}
function getPropertyAssignmentAliasLikeExpression(node) {
  return node.kind === 304 /* ShorthandPropertyAssignment */ ? node.name : node.kind === 303 /* PropertyAssignment */ ? node.initializer : node.parent.right;
}
function getEffectiveBaseTypeNode(node) {
  const baseType = getClassExtendsHeritageElement(node);
  if (baseType && isInJSFile(node)) {
    const tag = getJSDocAugmentsTag(node);
    if (tag) {
      return tag.class;
    }
  }
  return baseType;
}
function getClassExtendsHeritageElement(node) {
  const heritageClause = getHeritageClause(node.heritageClauses, 96 /* ExtendsKeyword */);
  return heritageClause && heritageClause.types.length > 0 ? heritageClause.types[0] : void 0;
}
function getEffectiveImplementsTypeNodes(node) {
  if (isInJSFile(node)) {
    return getJSDocImplementsTags(node).map((n) => n.class);
  } else {
    const heritageClause = getHeritageClause(node.heritageClauses, 119 /* ImplementsKeyword */);
    return heritageClause == null ? void 0 : heritageClause.types;
  }
}
function getInterfaceBaseTypeNodes(node) {
  const heritageClause = getHeritageClause(node.heritageClauses, 96 /* ExtendsKeyword */);
  return heritageClause ? heritageClause.types : void 0;
}
function getHeritageClause(clauses, kind) {
  if (clauses) {
    for (const clause of clauses) {
      if (clause.token === kind) {
        return clause;
      }
    }
  }
  return void 0;
}
function getAncestor(node, kind) {
  while (node) {
    if (node.kind === kind) {
      return node;
    }
    node = node.parent;
  }
  return void 0;
}
function isKeyword(token) {
  return 83 /* FirstKeyword */ <= token && token <= 165 /* LastKeyword */;
}
function isPunctuation(token) {
  return 19 /* FirstPunctuation */ <= token && token <= 79 /* LastPunctuation */;
}
function isKeywordOrPunctuation(token) {
  return isKeyword(token) || isPunctuation(token);
}
function isContextualKeyword(token) {
  return 128 /* FirstContextualKeyword */ <= token && token <= 165 /* LastContextualKeyword */;
}
function isNonContextualKeyword(token) {
  return isKeyword(token) && !isContextualKeyword(token);
}
function isStringANonContextualKeyword(name) {
  const token = stringToToken(name);
  return token !== void 0 && isNonContextualKeyword(token);
}
function isIdentifierANonContextualKeyword(node) {
  const originalKeywordKind = identifierToKeywordKind(node);
  return !!originalKeywordKind && !isContextualKeyword(originalKeywordKind);
}
function getFunctionFlags(node) {
  if (!node) {
    return 4 /* Invalid */;
  }
  let flags = 0 /* Normal */;
  switch (node.kind) {
    case 262 /* FunctionDeclaration */:
    case 218 /* FunctionExpression */:
    case 174 /* MethodDeclaration */:
      if (node.asteriskToken) {
        flags |= 1 /* Generator */;
      }
    case 219 /* ArrowFunction */:
      if (hasSyntacticModifier(node, 1024 /* Async */)) {
        flags |= 2 /* Async */;
      }
      break;
  }
  if (!node.body) {
    flags |= 4 /* Invalid */;
  }
  return flags;
}
function isAsyncFunction(node) {
  switch (node.kind) {
    case 262 /* FunctionDeclaration */:
    case 218 /* FunctionExpression */:
    case 219 /* ArrowFunction */:
    case 174 /* MethodDeclaration */:
      return node.body !== void 0 && node.asteriskToken === void 0 && hasSyntacticModifier(node, 1024 /* Async */);
  }
  return false;
}
function isStringOrNumericLiteralLike(node) {
  return isStringLiteralLike(node) || isNumericLiteral(node);
}
function isSignedNumericLiteral(node) {
  return isPrefixUnaryExpression(node) && (node.operator === 40 /* PlusToken */ || node.operator === 41 /* MinusToken */) && isNumericLiteral(node.operand);
}
function hasDynamicName(declaration) {
  const name = getNameOfDeclaration(declaration);
  return !!name && isDynamicName(name);
}
function isDynamicName(name) {
  if (!(name.kind === 167 /* ComputedPropertyName */ || name.kind === 212 /* ElementAccessExpression */)) {
    return false;
  }
  const expr = isElementAccessExpression(name) ? skipParentheses(name.argumentExpression) : name.expression;
  return !isStringOrNumericLiteralLike(expr) && !isSignedNumericLiteral(expr);
}
function getPropertyNameForPropertyNameNode(name) {
  switch (name.kind) {
    case 80 /* Identifier */:
    case 81 /* PrivateIdentifier */:
      return name.escapedText;
    case 11 /* StringLiteral */:
    case 15 /* NoSubstitutionTemplateLiteral */:
    case 9 /* NumericLiteral */:
      return escapeLeadingUnderscores(name.text);
    case 167 /* ComputedPropertyName */:
      const nameExpression = name.expression;
      if (isStringOrNumericLiteralLike(nameExpression)) {
        return escapeLeadingUnderscores(nameExpression.text);
      } else if (isSignedNumericLiteral(nameExpression)) {
        if (nameExpression.operator === 41 /* MinusToken */) {
          return tokenToString(nameExpression.operator) + nameExpression.operand.text;
        }
        return nameExpression.operand.text;
      }
      return void 0;
    case 295 /* JsxNamespacedName */:
      return getEscapedTextOfJsxNamespacedName(name);
    default:
      return Debug.assertNever(name);
  }
}
function isPropertyNameLiteral(node) {
  switch (node.kind) {
    case 80 /* Identifier */:
    case 11 /* StringLiteral */:
    case 15 /* NoSubstitutionTemplateLiteral */:
    case 9 /* NumericLiteral */:
      return true;
    default:
      return false;
  }
}
function getTextOfIdentifierOrLiteral(node) {
  return isMemberName(node) ? idText(node) : isJsxNamespacedName(node) ? getTextOfJsxNamespacedName(node) : node.text;
}
function getEscapedTextOfIdentifierOrLiteral(node) {
  return isMemberName(node) ? node.escapedText : isJsxNamespacedName(node) ? getEscapedTextOfJsxNamespacedName(node) : escapeLeadingUnderscores(node.text);
}
function getSymbolNameForPrivateIdentifier(containingClassSymbol, description) {
  return `__#${getSymbolId(containingClassSymbol)}@${description}`;
}
function isKnownSymbol(symbol) {
  return startsWith(symbol.escapedName, "__@");
}
function isProtoSetter(node) {
  return isIdentifier(node) ? idText(node) === "__proto__" : isStringLiteral(node) && node.text === "__proto__";
}
function isAnonymousFunctionDefinition(node, cb) {
  node = skipOuterExpressions(node);
  switch (node.kind) {
    case 231 /* ClassExpression */:
      if (classHasDeclaredOrExplicitlyAssignedName(node)) {
        return false;
      }
      break;
    case 218 /* FunctionExpression */:
      if (node.name) {
        return false;
      }
      break;
    case 219 /* ArrowFunction */:
      break;
    default:
      return false;
  }
  return typeof cb === "function" ? cb(node) : true;
}
function isNamedEvaluationSource(node) {
  switch (node.kind) {
    case 303 /* PropertyAssignment */:
      return !isProtoSetter(node.name);
    case 304 /* ShorthandPropertyAssignment */:
      return !!node.objectAssignmentInitializer;
    case 260 /* VariableDeclaration */:
      return isIdentifier(node.name) && !!node.initializer;
    case 169 /* Parameter */:
      return isIdentifier(node.name) && !!node.initializer && !node.dotDotDotToken;
    case 208 /* BindingElement */:
      return isIdentifier(node.name) && !!node.initializer && !node.dotDotDotToken;
    case 172 /* PropertyDeclaration */:
      return !!node.initializer;
    case 226 /* BinaryExpression */:
      switch (node.operatorToken.kind) {
        case 64 /* EqualsToken */:
        case 77 /* AmpersandAmpersandEqualsToken */:
        case 76 /* BarBarEqualsToken */:
        case 78 /* QuestionQuestionEqualsToken */:
          return isIdentifier(node.left);
      }
      break;
    case 277 /* ExportAssignment */:
      return true;
  }
  return false;
}
function isNamedEvaluation(node, cb) {
  if (!isNamedEvaluationSource(node))
    return false;
  switch (node.kind) {
    case 303 /* PropertyAssignment */:
      return isAnonymousFunctionDefinition(node.initializer, cb);
    case 304 /* ShorthandPropertyAssignment */:
      return isAnonymousFunctionDefinition(node.objectAssignmentInitializer, cb);
    case 260 /* VariableDeclaration */:
    case 169 /* Parameter */:
    case 208 /* BindingElement */:
    case 172 /* PropertyDeclaration */:
      return isAnonymousFunctionDefinition(node.initializer, cb);
    case 226 /* BinaryExpression */:
      return isAnonymousFunctionDefinition(node.right, cb);
    case 277 /* ExportAssignment */:
      return isAnonymousFunctionDefinition(node.expression, cb);
  }
}
function isPushOrUnshiftIdentifier(node) {
  return node.escapedText === "push" || node.escapedText === "unshift";
}
function isParameterDeclaration(node) {
  const root = getRootDeclaration(node);
  return root.kind === 169 /* Parameter */;
}
function getRootDeclaration(node) {
  while (node.kind === 208 /* BindingElement */) {
    node = node.parent.parent;
  }
  return node;
}
function nodeStartsNewLexicalEnvironment(node) {
  const kind = node.kind;
  return kind === 176 /* Constructor */ || kind === 218 /* FunctionExpression */ || kind === 262 /* FunctionDeclaration */ || kind === 219 /* ArrowFunction */ || kind === 174 /* MethodDeclaration */ || kind === 177 /* GetAccessor */ || kind === 178 /* SetAccessor */ || kind === 267 /* ModuleDeclaration */ || kind === 312 /* SourceFile */;
}
function nodeIsSynthesized(range) {
  return positionIsSynthesized(range.pos) || positionIsSynthesized(range.end);
}
function getExpressionAssociativity(expression) {
  const operator = getOperator(expression);
  const hasArguments = expression.kind === 214 /* NewExpression */ && expression.arguments !== void 0;
  return getOperatorAssociativity(expression.kind, operator, hasArguments);
}
function getOperatorAssociativity(kind, operator, hasArguments) {
  switch (kind) {
    case 214 /* NewExpression */:
      return hasArguments ? 0 /* Left */ : 1 /* Right */;
    case 224 /* PrefixUnaryExpression */:
    case 221 /* TypeOfExpression */:
    case 222 /* VoidExpression */:
    case 220 /* DeleteExpression */:
    case 223 /* AwaitExpression */:
    case 227 /* ConditionalExpression */:
    case 229 /* YieldExpression */:
      return 1 /* Right */;
    case 226 /* BinaryExpression */:
      switch (operator) {
        case 43 /* AsteriskAsteriskToken */:
        case 64 /* EqualsToken */:
        case 65 /* PlusEqualsToken */:
        case 66 /* MinusEqualsToken */:
        case 68 /* AsteriskAsteriskEqualsToken */:
        case 67 /* AsteriskEqualsToken */:
        case 69 /* SlashEqualsToken */:
        case 70 /* PercentEqualsToken */:
        case 71 /* LessThanLessThanEqualsToken */:
        case 72 /* GreaterThanGreaterThanEqualsToken */:
        case 73 /* GreaterThanGreaterThanGreaterThanEqualsToken */:
        case 74 /* AmpersandEqualsToken */:
        case 79 /* CaretEqualsToken */:
        case 75 /* BarEqualsToken */:
        case 76 /* BarBarEqualsToken */:
        case 77 /* AmpersandAmpersandEqualsToken */:
        case 78 /* QuestionQuestionEqualsToken */:
          return 1 /* Right */;
      }
  }
  return 0 /* Left */;
}
function getExpressionPrecedence(expression) {
  const operator = getOperator(expression);
  const hasArguments = expression.kind === 214 /* NewExpression */ && expression.arguments !== void 0;
  return getOperatorPrecedence(expression.kind, operator, hasArguments);
}
function getOperator(expression) {
  if (expression.kind === 226 /* BinaryExpression */) {
    return expression.operatorToken.kind;
  } else if (expression.kind === 224 /* PrefixUnaryExpression */ || expression.kind === 225 /* PostfixUnaryExpression */) {
    return expression.operator;
  } else {
    return expression.kind;
  }
}
function getOperatorPrecedence(nodeKind, operatorKind, hasArguments) {
  switch (nodeKind) {
    case 361 /* CommaListExpression */:
      return 0 /* Comma */;
    case 230 /* SpreadElement */:
      return 1 /* Spread */;
    case 229 /* YieldExpression */:
      return 2 /* Yield */;
    case 227 /* ConditionalExpression */:
      return 4 /* Conditional */;
    case 226 /* BinaryExpression */:
      switch (operatorKind) {
        case 28 /* CommaToken */:
          return 0 /* Comma */;
        case 64 /* EqualsToken */:
        case 65 /* PlusEqualsToken */:
        case 66 /* MinusEqualsToken */:
        case 68 /* AsteriskAsteriskEqualsToken */:
        case 67 /* AsteriskEqualsToken */:
        case 69 /* SlashEqualsToken */:
        case 70 /* PercentEqualsToken */:
        case 71 /* LessThanLessThanEqualsToken */:
        case 72 /* GreaterThanGreaterThanEqualsToken */:
        case 73 /* GreaterThanGreaterThanGreaterThanEqualsToken */:
        case 74 /* AmpersandEqualsToken */:
        case 79 /* CaretEqualsToken */:
        case 75 /* BarEqualsToken */:
        case 76 /* BarBarEqualsToken */:
        case 77 /* AmpersandAmpersandEqualsToken */:
        case 78 /* QuestionQuestionEqualsToken */:
          return 3 /* Assignment */;
        default:
          return getBinaryOperatorPrecedence(operatorKind);
      }
    case 216 /* TypeAssertionExpression */:
    case 235 /* NonNullExpression */:
    case 224 /* PrefixUnaryExpression */:
    case 221 /* TypeOfExpression */:
    case 222 /* VoidExpression */:
    case 220 /* DeleteExpression */:
    case 223 /* AwaitExpression */:
      return 16 /* Unary */;
    case 225 /* PostfixUnaryExpression */:
      return 17 /* Update */;
    case 213 /* CallExpression */:
      return 18 /* LeftHandSide */;
    case 214 /* NewExpression */:
      return hasArguments ? 19 /* Member */ : 18 /* LeftHandSide */;
    case 215 /* TaggedTemplateExpression */:
    case 211 /* PropertyAccessExpression */:
    case 212 /* ElementAccessExpression */:
    case 236 /* MetaProperty */:
      return 19 /* Member */;
    case 234 /* AsExpression */:
    case 238 /* SatisfiesExpression */:
      return 11 /* Relational */;
    case 110 /* ThisKeyword */:
    case 108 /* SuperKeyword */:
    case 80 /* Identifier */:
    case 81 /* PrivateIdentifier */:
    case 106 /* NullKeyword */:
    case 112 /* TrueKeyword */:
    case 97 /* FalseKeyword */:
    case 9 /* NumericLiteral */:
    case 10 /* BigIntLiteral */:
    case 11 /* StringLiteral */:
    case 209 /* ArrayLiteralExpression */:
    case 210 /* ObjectLiteralExpression */:
    case 218 /* FunctionExpression */:
    case 219 /* ArrowFunction */:
    case 231 /* ClassExpression */:
    case 14 /* RegularExpressionLiteral */:
    case 15 /* NoSubstitutionTemplateLiteral */:
    case 228 /* TemplateExpression */:
    case 217 /* ParenthesizedExpression */:
    case 232 /* OmittedExpression */:
    case 284 /* JsxElement */:
    case 285 /* JsxSelfClosingElement */:
    case 288 /* JsxFragment */:
      return 20 /* Primary */;
    default:
      return -1 /* Invalid */;
  }
}
function getBinaryOperatorPrecedence(kind) {
  switch (kind) {
    case 61 /* QuestionQuestionToken */:
      return 4 /* Coalesce */;
    case 57 /* BarBarToken */:
      return 5 /* LogicalOR */;
    case 56 /* AmpersandAmpersandToken */:
      return 6 /* LogicalAND */;
    case 52 /* BarToken */:
      return 7 /* BitwiseOR */;
    case 53 /* CaretToken */:
      return 8 /* BitwiseXOR */;
    case 51 /* AmpersandToken */:
      return 9 /* BitwiseAND */;
    case 35 /* EqualsEqualsToken */:
    case 36 /* ExclamationEqualsToken */:
    case 37 /* EqualsEqualsEqualsToken */:
    case 38 /* ExclamationEqualsEqualsToken */:
      return 10 /* Equality */;
    case 30 /* LessThanToken */:
    case 32 /* GreaterThanToken */:
    case 33 /* LessThanEqualsToken */:
    case 34 /* GreaterThanEqualsToken */:
    case 104 /* InstanceOfKeyword */:
    case 103 /* InKeyword */:
    case 130 /* AsKeyword */:
    case 152 /* SatisfiesKeyword */:
      return 11 /* Relational */;
    case 48 /* LessThanLessThanToken */:
    case 49 /* GreaterThanGreaterThanToken */:
    case 50 /* GreaterThanGreaterThanGreaterThanToken */:
      return 12 /* Shift */;
    case 40 /* PlusToken */:
    case 41 /* MinusToken */:
      return 13 /* Additive */;
    case 42 /* AsteriskToken */:
    case 44 /* SlashToken */:
    case 45 /* PercentToken */:
      return 14 /* Multiplicative */;
    case 43 /* AsteriskAsteriskToken */:
      return 15 /* Exponentiation */;
  }
  return -1;
}
function getSemanticJsxChildren(children) {
  return filter(children, (i) => {
    switch (i.kind) {
      case 294 /* JsxExpression */:
        return !!i.expression;
      case 12 /* JsxText */:
        return !i.containsOnlyTriviaWhiteSpaces;
      default:
        return true;
    }
  });
}
function createDiagnosticCollection() {
  let nonFileDiagnostics = [];
  const filesWithDiagnostics = [];
  const fileDiagnostics = /* @__PURE__ */ new Map();
  let hasReadNonFileDiagnostics = false;
  return {
    add,
    lookup,
    getGlobalDiagnostics,
    getDiagnostics
  };
  function lookup(diagnostic) {
    let diagnostics;
    if (diagnostic.file) {
      diagnostics = fileDiagnostics.get(diagnostic.file.fileName);
    } else {
      diagnostics = nonFileDiagnostics;
    }
    if (!diagnostics) {
      return void 0;
    }
    const result = binarySearch(diagnostics, diagnostic, identity, compareDiagnosticsSkipRelatedInformation);
    if (result >= 0) {
      return diagnostics[result];
    }
    return void 0;
  }
  function add(diagnostic) {
    let diagnostics;
    if (diagnostic.file) {
      diagnostics = fileDiagnostics.get(diagnostic.file.fileName);
      if (!diagnostics) {
        diagnostics = [];
        fileDiagnostics.set(diagnostic.file.fileName, diagnostics);
        insertSorted(filesWithDiagnostics, diagnostic.file.fileName, compareStringsCaseSensitive);
      }
    } else {
      if (hasReadNonFileDiagnostics) {
        hasReadNonFileDiagnostics = false;
        nonFileDiagnostics = nonFileDiagnostics.slice();
      }
      diagnostics = nonFileDiagnostics;
    }
    insertSorted(diagnostics, diagnostic, compareDiagnosticsSkipRelatedInformation);
  }
  function getGlobalDiagnostics() {
    hasReadNonFileDiagnostics = true;
    return nonFileDiagnostics;
  }
  function getDiagnostics(fileName) {
    if (fileName) {
      return fileDiagnostics.get(fileName) || [];
    }
    const fileDiags = flatMapToMutable(filesWithDiagnostics, (f) => fileDiagnostics.get(f));
    if (!nonFileDiagnostics.length) {
      return fileDiags;
    }
    fileDiags.unshift(...nonFileDiagnostics);
    return fileDiags;
  }
}
var templateSubstitutionRegExp = /\$\{/g;
function escapeTemplateSubstitution(str) {
  return str.replace(templateSubstitutionRegExp, "\\${");
}
function containsInvalidEscapeFlag(node) {
  return !!((node.templateFlags || 0) & 2048 /* ContainsInvalidEscape */);
}
function hasInvalidEscape(template) {
  return template && !!(isNoSubstitutionTemplateLiteral(template) ? containsInvalidEscapeFlag(template) : containsInvalidEscapeFlag(template.head) || some(template.templateSpans, (span) => containsInvalidEscapeFlag(span.literal)));
}
var doubleQuoteEscapedCharsRegExp = /[\\"\u0000-\u001f\t\v\f\b\r\n\u2028\u2029\u0085]/g;
var singleQuoteEscapedCharsRegExp = /[\\'\u0000-\u001f\t\v\f\b\r\n\u2028\u2029\u0085]/g;
var backtickQuoteEscapedCharsRegExp = /\r\n|[\\`\u0000-\u001f\t\v\f\b\r\u2028\u2029\u0085]/g;
var escapedCharsMap = new Map(Object.entries({
  "	": "\\t",
  "\v": "\\v",
  "\f": "\\f",
  "\b": "\\b",
  "\r": "\\r",
  "\n": "\\n",
  "\\": "\\\\",
  '"': '\\"',
  "'": "\\'",
  "`": "\\`",
  "\u2028": "\\u2028",
  // lineSeparator
  "\u2029": "\\u2029",
  // paragraphSeparator
  "\x85": "\\u0085",
  // nextLine
  "\r\n": "\\r\\n"
  // special case for CRLFs in backticks
}));
function encodeUtf16EscapeSequence(charCode) {
  const hexCharCode = charCode.toString(16).toUpperCase();
  const paddedHexCode = ("0000" + hexCharCode).slice(-4);
  return "\\u" + paddedHexCode;
}
function getReplacement(c, offset, input) {
  if (c.charCodeAt(0) === 0 /* nullCharacter */) {
    const lookAhead = input.charCodeAt(offset + c.length);
    if (lookAhead >= 48 /* _0 */ && lookAhead <= 57 /* _9 */) {
      return "\\x00";
    }
    return "\\0";
  }
  return escapedCharsMap.get(c) || encodeUtf16EscapeSequence(c.charCodeAt(0));
}
function escapeString(s, quoteChar) {
  const escapedCharsRegExp = quoteChar === 96 /* backtick */ ? backtickQuoteEscapedCharsRegExp : quoteChar === 39 /* singleQuote */ ? singleQuoteEscapedCharsRegExp : doubleQuoteEscapedCharsRegExp;
  return s.replace(escapedCharsRegExp, getReplacement);
}
var nonAsciiCharacters = /[^\u0000-\u007F]/g;
function escapeNonAsciiString(s, quoteChar) {
  s = escapeString(s, quoteChar);
  return nonAsciiCharacters.test(s) ? s.replace(nonAsciiCharacters, (c) => encodeUtf16EscapeSequence(c.charCodeAt(0))) : s;
}
var jsxDoubleQuoteEscapedCharsRegExp = /["\u0000-\u001f\u2028\u2029\u0085]/g;
var jsxSingleQuoteEscapedCharsRegExp = /['\u0000-\u001f\u2028\u2029\u0085]/g;
var jsxEscapedCharsMap = new Map(Object.entries({
  '"': "&quot;",
  "'": "&apos;"
}));
function encodeJsxCharacterEntity(charCode) {
  const hexCharCode = charCode.toString(16).toUpperCase();
  return "&#x" + hexCharCode + ";";
}
function getJsxAttributeStringReplacement(c) {
  if (c.charCodeAt(0) === 0 /* nullCharacter */) {
    return "&#0;";
  }
  return jsxEscapedCharsMap.get(c) || encodeJsxCharacterEntity(c.charCodeAt(0));
}
function escapeJsxAttributeString(s, quoteChar) {
  const escapedCharsRegExp = quoteChar === 39 /* singleQuote */ ? jsxSingleQuoteEscapedCharsRegExp : jsxDoubleQuoteEscapedCharsRegExp;
  return s.replace(escapedCharsRegExp, getJsxAttributeStringReplacement);
}
function stripQuotes(name) {
  const length2 = name.length;
  if (length2 >= 2 && name.charCodeAt(0) === name.charCodeAt(length2 - 1) && isQuoteOrBacktick(name.charCodeAt(0))) {
    return name.substring(1, length2 - 1);
  }
  return name;
}
function isQuoteOrBacktick(charCode) {
  return charCode === 39 /* singleQuote */ || charCode === 34 /* doubleQuote */ || charCode === 96 /* backtick */;
}
function isIntrinsicJsxName(name) {
  const ch = name.charCodeAt(0);
  return ch >= 97 /* a */ && ch <= 122 /* z */ || name.includes("-");
}
var indentStrings = ["", "    "];
function getIndentString(level) {
  const singleLevel = indentStrings[1];
  for (let current = indentStrings.length; current <= level; current++) {
    indentStrings.push(indentStrings[current - 1] + singleLevel);
  }
  return indentStrings[level];
}
function getIndentSize() {
  return indentStrings[1].length;
}
function createTextWriter(newLine) {
  var output;
  var indent2;
  var lineStart;
  var lineCount;
  var linePos;
  var hasTrailingComment = false;
  function updateLineCountAndPosFor(s) {
    const lineStartsOfS = computeLineStarts(s);
    if (lineStartsOfS.length > 1) {
      lineCount = lineCount + lineStartsOfS.length - 1;
      linePos = output.length - s.length + last(lineStartsOfS);
      lineStart = linePos - output.length === 0;
    } else {
      lineStart = false;
    }
  }
  function writeText(s) {
    if (s && s.length) {
      if (lineStart) {
        s = getIndentString(indent2) + s;
        lineStart = false;
      }
      output += s;
      updateLineCountAndPosFor(s);
    }
  }
  function write(s) {
    if (s)
      hasTrailingComment = false;
    writeText(s);
  }
  function writeComment(s) {
    if (s)
      hasTrailingComment = true;
    writeText(s);
  }
  function reset() {
    output = "";
    indent2 = 0;
    lineStart = true;
    lineCount = 0;
    linePos = 0;
    hasTrailingComment = false;
  }
  function rawWrite(s) {
    if (s !== void 0) {
      output += s;
      updateLineCountAndPosFor(s);
      hasTrailingComment = false;
    }
  }
  function writeLiteral(s) {
    if (s && s.length) {
      write(s);
    }
  }
  function writeLine(force) {
    if (!lineStart || force) {
      output += newLine;
      lineCount++;
      linePos = output.length;
      lineStart = true;
      hasTrailingComment = false;
    }
  }
  function getTextPosWithWriteLine() {
    return lineStart ? output.length : output.length + newLine.length;
  }
  reset();
  return {
    write,
    rawWrite,
    writeLiteral,
    writeLine,
    increaseIndent: () => {
      indent2++;
    },
    decreaseIndent: () => {
      indent2--;
    },
    getIndent: () => indent2,
    getTextPos: () => output.length,
    getLine: () => lineCount,
    getColumn: () => lineStart ? indent2 * getIndentSize() : output.length - linePos,
    getText: () => output,
    isAtStartOfLine: () => lineStart,
    hasTrailingComment: () => hasTrailingComment,
    hasTrailingWhitespace: () => !!output.length && isWhiteSpaceLike(output.charCodeAt(output.length - 1)),
    clear: reset,
    writeKeyword: write,
    writeOperator: write,
    writeParameter: write,
    writeProperty: write,
    writePunctuation: write,
    writeSpace: write,
    writeStringLiteral: write,
    writeSymbol: (s, _) => write(s),
    writeTrailingSemicolon: write,
    writeComment,
    getTextPosWithWriteLine
  };
}
function getTrailingSemicolonDeferringWriter(writer) {
  let pendingTrailingSemicolon = false;
  function commitPendingTrailingSemicolon() {
    if (pendingTrailingSemicolon) {
      writer.writeTrailingSemicolon(";");
      pendingTrailingSemicolon = false;
    }
  }
  return {
    ...writer,
    writeTrailingSemicolon() {
      pendingTrailingSemicolon = true;
    },
    writeLiteral(s) {
      commitPendingTrailingSemicolon();
      writer.writeLiteral(s);
    },
    writeStringLiteral(s) {
      commitPendingTrailingSemicolon();
      writer.writeStringLiteral(s);
    },
    writeSymbol(s, sym) {
      commitPendingTrailingSemicolon();
      writer.writeSymbol(s, sym);
    },
    writePunctuation(s) {
      commitPendingTrailingSemicolon();
      writer.writePunctuation(s);
    },
    writeKeyword(s) {
      commitPendingTrailingSemicolon();
      writer.writeKeyword(s);
    },
    writeOperator(s) {
      commitPendingTrailingSemicolon();
      writer.writeOperator(s);
    },
    writeParameter(s) {
      commitPendingTrailingSemicolon();
      writer.writeParameter(s);
    },
    writeSpace(s) {
      commitPendingTrailingSemicolon();
      writer.writeSpace(s);
    },
    writeProperty(s) {
      commitPendingTrailingSemicolon();
      writer.writeProperty(s);
    },
    writeComment(s) {
      commitPendingTrailingSemicolon();
      writer.writeComment(s);
    },
    writeLine() {
      commitPendingTrailingSemicolon();
      writer.writeLine();
    },
    increaseIndent() {
      commitPendingTrailingSemicolon();
      writer.increaseIndent();
    },
    decreaseIndent() {
      commitPendingTrailingSemicolon();
      writer.decreaseIndent();
    }
  };
}
function hostUsesCaseSensitiveFileNames(host) {
  return host.useCaseSensitiveFileNames ? host.useCaseSensitiveFileNames() : false;
}
function hostGetCanonicalFileName(host) {
  return createGetCanonicalFileName(hostUsesCaseSensitiveFileNames(host));
}
function getResolvedExternalModuleName(host, file, referenceFile) {
  return file.moduleName || getExternalModuleNameFromPath(host, file.fileName, referenceFile && referenceFile.fileName);
}
function getCanonicalAbsolutePath(host, path) {
  return host.getCanonicalFileName(getNormalizedAbsolutePath(path, host.getCurrentDirectory()));
}
function getExternalModuleNameFromDeclaration(host, resolver, declaration) {
  const file = resolver.getExternalModuleFileFromDeclaration(declaration);
  if (!file || file.isDeclarationFile) {
    return void 0;
  }
  const specifier = getExternalModuleName(declaration);
  if (specifier && isStringLiteralLike(specifier) && !pathIsRelative(specifier.text) && !getCanonicalAbsolutePath(host, file.path).includes(getCanonicalAbsolutePath(host, ensureTrailingDirectorySeparator(host.getCommonSourceDirectory())))) {
    return void 0;
  }
  return getResolvedExternalModuleName(host, file);
}
function getExternalModuleNameFromPath(host, fileName, referencePath) {
  const getCanonicalFileName = (f) => host.getCanonicalFileName(f);
  const dir = toPath(referencePath ? getDirectoryPath(referencePath) : host.getCommonSourceDirectory(), host.getCurrentDirectory(), getCanonicalFileName);
  const filePath = getNormalizedAbsolutePath(fileName, host.getCurrentDirectory());
  const relativePath = getRelativePathToDirectoryOrUrl(
    dir,
    filePath,
    dir,
    getCanonicalFileName,
    /*isAbsolutePathAnUrl*/
    false
  );
  const extensionless = removeFileExtension(relativePath);
  return referencePath ? ensurePathIsNonModuleName(extensionless) : extensionless;
}
function getOwnEmitOutputFilePath(fileName, host, extension) {
  const compilerOptions = host.getCompilerOptions();
  let emitOutputFilePathWithoutExtension;
  if (compilerOptions.outDir) {
    emitOutputFilePathWithoutExtension = removeFileExtension(getSourceFilePathInNewDir(fileName, host, compilerOptions.outDir));
  } else {
    emitOutputFilePathWithoutExtension = removeFileExtension(fileName);
  }
  return emitOutputFilePathWithoutExtension + extension;
}
function getDeclarationEmitOutputFilePath(fileName, host) {
  return getDeclarationEmitOutputFilePathWorker(fileName, host.getCompilerOptions(), host.getCurrentDirectory(), host.getCommonSourceDirectory(), (f) => host.getCanonicalFileName(f));
}
function getDeclarationEmitOutputFilePathWorker(fileName, options, currentDirectory, commonSourceDirectory, getCanonicalFileName) {
  const outputDir = options.declarationDir || options.outDir;
  const path = outputDir ? getSourceFilePathInNewDirWorker(fileName, outputDir, currentDirectory, commonSourceDirectory, getCanonicalFileName) : fileName;
  const declarationExtension = getDeclarationEmitExtensionForPath(path);
  return removeFileExtension(path) + declarationExtension;
}
function getDeclarationEmitExtensionForPath(path) {
  return fileExtensionIsOneOf(path, [".mjs" /* Mjs */, ".mts" /* Mts */]) ? ".d.mts" /* Dmts */ : fileExtensionIsOneOf(path, [".cjs" /* Cjs */, ".cts" /* Cts */]) ? ".d.cts" /* Dcts */ : fileExtensionIsOneOf(path, [".json" /* Json */]) ? `.d.json.ts` : (
    // Drive-by redefinition of json declaration file output name so if it's ever enabled, it behaves well
    ".d.ts" /* Dts */
  );
}
function getPossibleOriginalInputExtensionForExtension(path) {
  return fileExtensionIsOneOf(path, [".d.mts" /* Dmts */, ".mjs" /* Mjs */, ".mts" /* Mts */]) ? [".mts" /* Mts */, ".mjs" /* Mjs */] : fileExtensionIsOneOf(path, [".d.cts" /* Dcts */, ".cjs" /* Cjs */, ".cts" /* Cts */]) ? [".cts" /* Cts */, ".cjs" /* Cjs */] : fileExtensionIsOneOf(path, [`.d.json.ts`]) ? [".json" /* Json */] : [".tsx" /* Tsx */, ".ts" /* Ts */, ".jsx" /* Jsx */, ".js" /* Js */];
}
function outFile(options) {
  return options.outFile || options.out;
}
function getPathsBasePath(options, host) {
  var _a;
  if (!options.paths)
    return void 0;
  return options.baseUrl ?? Debug.checkDefined(options.pathsBasePath || ((_a = host.getCurrentDirectory) == null ? void 0 : _a.call(host)), "Encountered 'paths' without a 'baseUrl', config file, or host 'getCurrentDirectory'.");
}
function getSourceFilesToEmit(host, targetSourceFile, forceDtsEmit) {
  const options = host.getCompilerOptions();
  if (outFile(options)) {
    const moduleKind = getEmitModuleKind(options);
    const moduleEmitEnabled = options.emitDeclarationOnly || moduleKind === 2 /* AMD */ || moduleKind === 4 /* System */;
    return filter(
      host.getSourceFiles(),
      (sourceFile) => (moduleEmitEnabled || !isExternalModule(sourceFile)) && sourceFileMayBeEmitted(sourceFile, host, forceDtsEmit)
    );
  } else {
    const sourceFiles = targetSourceFile === void 0 ? host.getSourceFiles() : [targetSourceFile];
    return filter(
      sourceFiles,
      (sourceFile) => sourceFileMayBeEmitted(sourceFile, host, forceDtsEmit)
    );
  }
}
function sourceFileMayBeEmitted(sourceFile, host, forceDtsEmit) {
  const options = host.getCompilerOptions();
  if (options.noEmitForJsFiles && isSourceFileJS(sourceFile))
    return false;
  if (sourceFile.isDeclarationFile)
    return false;
  if (host.isSourceFileFromExternalLibrary(sourceFile))
    return false;
  if (forceDtsEmit)
    return true;
  if (host.isSourceOfProjectReferenceRedirect(sourceFile.fileName))
    return false;
  if (!isJsonSourceFile(sourceFile))
    return true;
  if (host.getResolvedProjectReferenceToRedirect(sourceFile.fileName))
    return false;
  if (outFile(options))
    return true;
  if (!options.outDir)
    return false;
  if (options.rootDir || options.composite && options.configFilePath) {
    const commonDir = getNormalizedAbsolutePath(getCommonSourceDirectory(options, () => [], host.getCurrentDirectory(), host.getCanonicalFileName), host.getCurrentDirectory());
    const outputPath = getSourceFilePathInNewDirWorker(sourceFile.fileName, options.outDir, host.getCurrentDirectory(), commonDir, host.getCanonicalFileName);
    if (comparePaths(sourceFile.fileName, outputPath, host.getCurrentDirectory(), !host.useCaseSensitiveFileNames()) === 0 /* EqualTo */)
      return false;
  }
  return true;
}
function getSourceFilePathInNewDir(fileName, host, newDirPath) {
  return getSourceFilePathInNewDirWorker(fileName, newDirPath, host.getCurrentDirectory(), host.getCommonSourceDirectory(), (f) => host.getCanonicalFileName(f));
}
function getSourceFilePathInNewDirWorker(fileName, newDirPath, currentDirectory, commonSourceDirectory, getCanonicalFileName) {
  let sourceFilePath = getNormalizedAbsolutePath(fileName, currentDirectory);
  const isSourceFileInCommonSourceDirectory = getCanonicalFileName(sourceFilePath).indexOf(getCanonicalFileName(commonSourceDirectory)) === 0;
  sourceFilePath = isSourceFileInCommonSourceDirectory ? sourceFilePath.substring(commonSourceDirectory.length) : sourceFilePath;
  return combinePaths(newDirPath, sourceFilePath);
}
function writeFile(host, diagnostics, fileName, text, writeByteOrderMark, sourceFiles, data) {
  host.writeFile(
    fileName,
    text,
    writeByteOrderMark,
    (hostErrorMessage) => {
      diagnostics.add(createCompilerDiagnostic(Diagnostics.Could_not_write_file_0_Colon_1, fileName, hostErrorMessage));
    },
    sourceFiles,
    data
  );
}
function ensureDirectoriesExist(directoryPath, createDirectory, directoryExists) {
  if (directoryPath.length > getRootLength(directoryPath) && !directoryExists(directoryPath)) {
    const parentDirectory = getDirectoryPath(directoryPath);
    ensureDirectoriesExist(parentDirectory, createDirectory, directoryExists);
    createDirectory(directoryPath);
  }
}
function writeFileEnsuringDirectories(path, data, writeByteOrderMark, writeFile2, createDirectory, directoryExists) {
  try {
    writeFile2(path, data, writeByteOrderMark);
  } catch {
    ensureDirectoriesExist(getDirectoryPath(normalizePath(path)), createDirectory, directoryExists);
    writeFile2(path, data, writeByteOrderMark);
  }
}
function getLineOfLocalPositionFromLineMap(lineMap, pos) {
  return computeLineOfPosition(lineMap, pos);
}
function getFirstConstructorWithBody(node) {
  return find(node.members, (member) => isConstructorDeclaration(member) && nodeIsPresent(member.body));
}
function getSetAccessorValueParameter(accessor) {
  if (accessor && accessor.parameters.length > 0) {
    const hasThis = accessor.parameters.length === 2 && parameterIsThisKeyword(accessor.parameters[0]);
    return accessor.parameters[hasThis ? 1 : 0];
  }
}
function getSetAccessorTypeAnnotationNode(accessor) {
  const parameter = getSetAccessorValueParameter(accessor);
  return parameter && parameter.type;
}
function getThisParameter(signature) {
  if (signature.parameters.length && !isJSDocSignature(signature)) {
    const thisParameter = signature.parameters[0];
    if (parameterIsThisKeyword(thisParameter)) {
      return thisParameter;
    }
  }
}
function parameterIsThisKeyword(parameter) {
  return isThisIdentifier(parameter.name);
}
function isThisIdentifier(node) {
  return !!node && node.kind === 80 /* Identifier */ && identifierIsThisKeyword(node);
}
function isInTypeQuery(node) {
  return !!findAncestor(
    node,
    (n) => n.kind === 186 /* TypeQuery */ ? true : n.kind === 80 /* Identifier */ || n.kind === 166 /* QualifiedName */ ? false : "quit"
  );
}
function isThisInTypeQuery(node) {
  if (!isThisIdentifier(node)) {
    return false;
  }
  while (isQualifiedName(node.parent) && node.parent.left === node) {
    node = node.parent;
  }
  return node.parent.kind === 186 /* TypeQuery */;
}
function identifierIsThisKeyword(id) {
  return id.escapedText === "this";
}
function getAllAccessorDeclarations(declarations, accessor) {
  let firstAccessor;
  let secondAccessor;
  let getAccessor;
  let setAccessor;
  if (hasDynamicName(accessor)) {
    firstAccessor = accessor;
    if (accessor.kind === 177 /* GetAccessor */) {
      getAccessor = accessor;
    } else if (accessor.kind === 178 /* SetAccessor */) {
      setAccessor = accessor;
    } else {
      Debug.fail("Accessor has wrong kind");
    }
  } else {
    forEach(declarations, (member) => {
      if (isAccessor(member) && isStatic(member) === isStatic(accessor)) {
        const memberName = getPropertyNameForPropertyNameNode(member.name);
        const accessorName = getPropertyNameForPropertyNameNode(accessor.name);
        if (memberName === accessorName) {
          if (!firstAccessor) {
            firstAccessor = member;
          } else if (!secondAccessor) {
            secondAccessor = member;
          }
          if (member.kind === 177 /* GetAccessor */ && !getAccessor) {
            getAccessor = member;
          }
          if (member.kind === 178 /* SetAccessor */ && !setAccessor) {
            setAccessor = member;
          }
        }
      }
    });
  }
  return {
    firstAccessor,
    secondAccessor,
    getAccessor,
    setAccessor
  };
}
function getEffectiveTypeAnnotationNode(node) {
  if (!isInJSFile(node) && isFunctionDeclaration(node))
    return void 0;
  const type = node.type;
  if (type || !isInJSFile(node))
    return type;
  return isJSDocPropertyLikeTag(node) ? node.typeExpression && node.typeExpression.type : getJSDocType(node);
}
function getEffectiveReturnTypeNode(node) {
  return isJSDocSignature(node) ? node.type && node.type.typeExpression && node.type.typeExpression.type : node.type || (isInJSFile(node) ? getJSDocReturnType(node) : void 0);
}
function getJSDocTypeParameterDeclarations(node) {
  return flatMap(getJSDocTags(node), (tag) => isNonTypeAliasTemplate(tag) ? tag.typeParameters : void 0);
}
function isNonTypeAliasTemplate(tag) {
  return isJSDocTemplateTag(tag) && !(tag.parent.kind === 327 /* JSDoc */ && (tag.parent.tags.some(isJSDocTypeAlias) || tag.parent.tags.some(isJSDocOverloadTag)));
}
function getEffectiveSetAccessorTypeAnnotationNode(node) {
  const parameter = getSetAccessorValueParameter(node);
  return parameter && getEffectiveTypeAnnotationNode(parameter);
}
function emitNewLineBeforeLeadingComments(lineMap, writer, node, leadingComments) {
  emitNewLineBeforeLeadingCommentsOfPosition(lineMap, writer, node.pos, leadingComments);
}
function emitNewLineBeforeLeadingCommentsOfPosition(lineMap, writer, pos, leadingComments) {
  if (leadingComments && leadingComments.length && pos !== leadingComments[0].pos && getLineOfLocalPositionFromLineMap(lineMap, pos) !== getLineOfLocalPositionFromLineMap(lineMap, leadingComments[0].pos)) {
    writer.writeLine();
  }
}
function emitNewLineBeforeLeadingCommentOfPosition(lineMap, writer, pos, commentPos) {
  if (pos !== commentPos && getLineOfLocalPositionFromLineMap(lineMap, pos) !== getLineOfLocalPositionFromLineMap(lineMap, commentPos)) {
    writer.writeLine();
  }
}
function emitComments(text, lineMap, writer, comments, leadingSeparator, trailingSeparator, newLine, writeComment) {
  if (comments && comments.length > 0) {
    if (leadingSeparator) {
      writer.writeSpace(" ");
    }
    let emitInterveningSeparator = false;
    for (const comment of comments) {
      if (emitInterveningSeparator) {
        writer.writeSpace(" ");
        emitInterveningSeparator = false;
      }
      writeComment(text, lineMap, writer, comment.pos, comment.end, newLine);
      if (comment.hasTrailingNewLine) {
        writer.writeLine();
      } else {
        emitInterveningSeparator = true;
      }
    }
    if (emitInterveningSeparator && trailingSeparator) {
      writer.writeSpace(" ");
    }
  }
}
function emitDetachedComments(text, lineMap, writer, writeComment, node, newLine, removeComments) {
  let leadingComments;
  let currentDetachedCommentInfo;
  if (removeComments) {
    if (node.pos === 0) {
      leadingComments = filter(getLeadingCommentRanges(text, node.pos), isPinnedCommentLocal);
    }
  } else {
    leadingComments = getLeadingCommentRanges(text, node.pos);
  }
  if (leadingComments) {
    const detachedComments = [];
    let lastComment;
    for (const comment of leadingComments) {
      if (lastComment) {
        const lastCommentLine = getLineOfLocalPositionFromLineMap(lineMap, lastComment.end);
        const commentLine = getLineOfLocalPositionFromLineMap(lineMap, comment.pos);
        if (commentLine >= lastCommentLine + 2) {
          break;
        }
      }
      detachedComments.push(comment);
      lastComment = comment;
    }
    if (detachedComments.length) {
      const lastCommentLine = getLineOfLocalPositionFromLineMap(lineMap, last(detachedComments).end);
      const nodeLine = getLineOfLocalPositionFromLineMap(lineMap, skipTrivia(text, node.pos));
      if (nodeLine >= lastCommentLine + 2) {
        emitNewLineBeforeLeadingComments(lineMap, writer, node, leadingComments);
        emitComments(
          text,
          lineMap,
          writer,
          detachedComments,
          /*leadingSeparator*/
          false,
          /*trailingSeparator*/
          true,
          newLine,
          writeComment
        );
        currentDetachedCommentInfo = { nodePos: node.pos, detachedCommentEndPos: last(detachedComments).end };
      }
    }
  }
  return currentDetachedCommentInfo;
  function isPinnedCommentLocal(comment) {
    return isPinnedComment(text, comment.pos);
  }
}
function writeCommentRange(text, lineMap, writer, commentPos, commentEnd, newLine) {
  if (text.charCodeAt(commentPos + 1) === 42 /* asterisk */) {
    const firstCommentLineAndCharacter = computeLineAndCharacterOfPosition(lineMap, commentPos);
    const lineCount = lineMap.length;
    let firstCommentLineIndent;
    for (let pos = commentPos, currentLine = firstCommentLineAndCharacter.line; pos < commentEnd; currentLine++) {
      const nextLineStart = currentLine + 1 === lineCount ? text.length + 1 : lineMap[currentLine + 1];
      if (pos !== commentPos) {
        if (firstCommentLineIndent === void 0) {
          firstCommentLineIndent = calculateIndent(text, lineMap[firstCommentLineAndCharacter.line], commentPos);
        }
        const currentWriterIndentSpacing = writer.getIndent() * getIndentSize();
        const spacesToEmit = currentWriterIndentSpacing - firstCommentLineIndent + calculateIndent(text, pos, nextLineStart);
        if (spacesToEmit > 0) {
          let numberOfSingleSpacesToEmit = spacesToEmit % getIndentSize();
          const indentSizeSpaceString = getIndentString((spacesToEmit - numberOfSingleSpacesToEmit) / getIndentSize());
          writer.rawWrite(indentSizeSpaceString);
          while (numberOfSingleSpacesToEmit) {
            writer.rawWrite(" ");
            numberOfSingleSpacesToEmit--;
          }
        } else {
          writer.rawWrite("");
        }
      }
      writeTrimmedCurrentLine(text, commentEnd, writer, newLine, pos, nextLineStart);
      pos = nextLineStart;
    }
  } else {
    writer.writeComment(text.substring(commentPos, commentEnd));
  }
}
function writeTrimmedCurrentLine(text, commentEnd, writer, newLine, pos, nextLineStart) {
  const end = Math.min(commentEnd, n
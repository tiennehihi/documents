ssOrJSDocMemberName(node) {
  return isQualifiedName(node.parent) && node.parent.right === node || isPropertyAccessExpression(node.parent) && node.parent.name === node || isJSDocMemberName(node.parent) && node.parent.right === node;
}
function isInstanceOfExpression(node) {
  return isBinaryExpression(node) && node.operatorToken.kind === 104 /* InstanceOfKeyword */;
}
function isRightSideOfInstanceofExpression(node) {
  return isInstanceOfExpression(node.parent) && node === node.parent.right;
}
function isEmptyObjectLiteral(expression) {
  return expression.kind === 210 /* ObjectLiteralExpression */ && expression.properties.length === 0;
}
function isEmptyArrayLiteral(expression) {
  return expression.kind === 209 /* ArrayLiteralExpression */ && expression.elements.length === 0;
}
function getLocalSymbolForExportDefault(symbol) {
  if (!isExportDefaultSymbol(symbol) || !symbol.declarations)
    return void 0;
  for (const decl of symbol.declarations) {
    if (decl.localSymbol)
      return decl.localSymbol;
  }
  return void 0;
}
function isExportDefaultSymbol(symbol) {
  return symbol && length(symbol.declarations) > 0 && hasSyntacticModifier(symbol.declarations[0], 2048 /* Default */);
}
function tryExtractTSExtension(fileName) {
  return find(supportedTSExtensionsForExtractExtension, (extension) => fileExtensionIs(fileName, extension));
}
function getExpandedCharCodes(input) {
  const output = [];
  const length2 = input.length;
  for (let i = 0; i < length2; i++) {
    const charCode = input.charCodeAt(i);
    if (charCode < 128) {
      output.push(charCode);
    } else if (charCode < 2048) {
      output.push(charCode >> 6 | 192);
      output.push(charCode & 63 | 128);
    } else if (charCode < 65536) {
      output.push(charCode >> 12 | 224);
      output.push(charCode >> 6 & 63 | 128);
      output.push(charCode & 63 | 128);
    } else if (charCode < 131072) {
      output.push(charCode >> 18 | 240);
      output.push(charCode >> 12 & 63 | 128);
      output.push(charCode >> 6 & 63 | 128);
      output.push(charCode & 63 | 128);
    } else {
      Debug.assert(false, "Unexpected code point");
    }
  }
  return output;
}
var base64Digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function convertToBase64(input) {
  let result = "";
  const charCodes = getExpandedCharCodes(input);
  let i = 0;
  const length2 = charCodes.length;
  let byte1, byte2, byte3, byte4;
  while (i < length2) {
    byte1 = charCodes[i] >> 2;
    byte2 = (charCodes[i] & 3) << 4 | charCodes[i + 1] >> 4;
    byte3 = (charCodes[i + 1] & 15) << 2 | charCodes[i + 2] >> 6;
    byte4 = charCodes[i + 2] & 63;
    if (i + 1 >= length2) {
      byte3 = byte4 = 64;
    } else if (i + 2 >= length2) {
      byte4 = 64;
    }
    result += base64Digits.charAt(byte1) + base64Digits.charAt(byte2) + base64Digits.charAt(byte3) + base64Digits.charAt(byte4);
    i += 3;
  }
  return result;
}
function base64encode(host, input) {
  if (host && host.base64encode) {
    return host.base64encode(input);
  }
  return convertToBase64(input);
}
function readJsonOrUndefined(path, hostOrText) {
  const jsonText = isString(hostOrText) ? hostOrText : hostOrText.readFile(path);
  if (!jsonText)
    return void 0;
  const result = parseConfigFileTextToJson(path, jsonText);
  return !result.error ? result.config : void 0;
}
function readJson(path, host) {
  return readJsonOrUndefined(path, host) || {};
}
function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return void 0;
  }
}
function directoryProbablyExists(directoryName, host) {
  return !host.directoryExists || host.directoryExists(directoryName);
}
var carriageReturnLineFeed = "\r\n";
var lineFeed = "\n";
function getNewLineCharacter(options) {
  switch (options.newLine) {
    case 0 /* CarriageReturnLineFeed */:
      return carriageReturnLineFeed;
    case 1 /* LineFeed */:
    case void 0:
      return lineFeed;
  }
}
function createRange(pos, end = pos) {
  Debug.assert(end >= pos || end === -1);
  return { pos, end };
}
function moveRangeEnd(range, end) {
  return createRange(range.pos, end);
}
function moveRangePos(range, pos) {
  return createRange(pos, range.end);
}
function moveRangePastDecorators(node) {
  const lastDecorator = canHaveModifiers(node) ? findLast(node.modifiers, isDecorator) : void 0;
  return lastDecorator && !positionIsSynthesized(lastDecorator.end) ? moveRangePos(node, lastDecorator.end) : node;
}
function moveRangePastModifiers(node) {
  if (isPropertyDeclaration(node) || isMethodDeclaration(node)) {
    return moveRangePos(node, node.name.pos);
  }
  const lastModifier = canHaveModifiers(node) ? lastOrUndefined(node.modifiers) : void 0;
  return lastModifier && !positionIsSynthesized(lastModifier.end) ? moveRangePos(node, lastModifier.end) : moveRangePastDecorators(node);
}
function createTokenRange(pos, token) {
  return createRange(pos, pos + tokenToString(token).length);
}
function rangeIsOnSingleLine(range, sourceFile) {
  return rangeStartIsOnSameLineAsRangeEnd(range, range, sourceFile);
}
function rangeStartPositionsAreOnSameLine(range1, range2, sourceFile) {
  return positionsAreOnSameLine(
    getStartPositionOfRange(
      range1,
      sourceFile,
      /*includeComments*/
      false
    ),
    getStartPositionOfRange(
      range2,
      sourceFile,
      /*includeComments*/
      false
    ),
    sourceFile
  );
}
function rangeEndPositionsAreOnSameLine(range1, range2, sourceFile) {
  return positionsAreOnSameLine(range1.end, range2.end, sourceFile);
}
function rangeStartIsOnSameLineAsRangeEnd(range1, range2, sourceFile) {
  return positionsAreOnSameLine(getStartPositionOfRange(
    range1,
    sourceFile,
    /*includeComments*/
    false
  ), range2.end, sourceFile);
}
function rangeEndIsOnSameLineAsRangeStart(range1, range2, sourceFile) {
  return positionsAreOnSameLine(range1.end, getStartPositionOfRange(
    range2,
    sourceFile,
    /*includeComments*/
    false
  ), sourceFile);
}
function getLinesBetweenRangeEndAndRangeStart(range1, range2, sourceFile, includeSecondRangeComments) {
  const range2Start = getStartPositionOfRange(range2, sourceFile, includeSecondRangeComments);
  return getLinesBetweenPositions(sourceFile, range1.end, range2Start);
}
function positionsAreOnSameLine(pos1, pos2, sourceFile) {
  return getLinesBetweenPositions(sourceFile, pos1, pos2) === 0;
}
function getStartPositionOfRange(range, sourceFile, includeComments) {
  return positionIsSynthesized(range.pos) ? -1 : skipTrivia(
    sourceFile.text,
    range.pos,
    /*stopAfterLineBreak*/
    false,
    includeComments
  );
}
function getLinesBetweenPositionAndPrecedingNonWhitespaceCharacter(pos, stopPos, sourceFile, includeComments) {
  const startPos = skipTrivia(
    sourceFile.text,
    pos,
    /*stopAfterLineBreak*/
    false,
    includeComments
  );
  const prevPos = getPreviousNonWhitespacePosition(startPos, stopPos, sourceFile);
  return getLinesBetweenPositions(sourceFile, prevPos ?? stopPos, startPos);
}
function getLinesBetweenPositionAndNextNonWhitespaceCharacter(pos, stopPos, sourceFile, includeComments) {
  const nextPos = skipTrivia(
    sourceFile.text,
    pos,
    /*stopAfterLineBreak*/
    false,
    includeComments
  );
  return getLinesBetweenPositions(sourceFile, pos, Math.min(stopPos, nextPos));
}
function getPreviousNonWhitespacePosition(pos, stopPos = 0, sourceFile) {
  while (pos-- > stopPos) {
    if (!isWhiteSpaceLike(sourceFile.text.charCodeAt(pos))) {
      return pos;
    }
  }
}
function isDeclarationNameOfEnumOrNamespace(node) {
  const parseNode = getParseTreeNode(node);
  if (parseNode) {
    switch (parseNode.parent.kind) {
      case 266 /* EnumDeclaration */:
      case 267 /* ModuleDeclaration */:
        return parseNode === parseNode.parent.name;
    }
  }
  return false;
}
function getInitializedVariables(node) {
  return filter(node.declarations, isInitializedVariable);
}
function isInitializedVariable(node) {
  return isVariableDeclaration(node) && node.initializer !== void 0;
}
function isWatchSet(options) {
  return options.watch && hasProperty(options, "watch");
}
function closeFileWatcher(watcher) {
  watcher.close();
}
function getCheckFlags(symbol) {
  return symbol.flags & 33554432 /* Transient */ ? symbol.links.checkFlags : 0;
}
function getDeclarationModifierFlagsFromSymbol(s, isWrite = false) {
  if (s.valueDeclaration) {
    const declaration = isWrite && s.declarations && find(s.declarations, isSetAccessorDeclaration) || s.flags & 32768 /* GetAccessor */ && find(s.declarations, isGetAccessorDeclaration) || s.valueDeclaration;
    const flags = getCombinedModifierFlags(declaration);
    return s.parent && s.parent.flags & 32 /* Class */ ? flags : flags & ~7 /* AccessibilityModifier */;
  }
  if (getCheckFlags(s) & 6 /* Synthetic */) {
    const checkFlags = s.links.checkFlags;
    const accessModifier = checkFlags & 1024 /* ContainsPrivate */ ? 2 /* Private */ : checkFlags & 256 /* ContainsPublic */ ? 1 /* Public */ : 4 /* Protected */;
    const staticModifier = checkFlags & 2048 /* ContainsStatic */ ? 256 /* Static */ : 0;
    return accessModifier | staticModifier;
  }
  if (s.flags & 4194304 /* Prototype */) {
    return 1 /* Public */ | 256 /* Static */;
  }
  return 0;
}
function getCombinedLocalAndExportSymbolFlags(symbol) {
  return symbol.exportSymbol ? symbol.exportSymbol.flags | symbol.flags : symbol.flags;
}
function isWriteOnlyAccess(node) {
  return accessKind(node) === 1 /* Write */;
}
function isWriteAccess(node) {
  return accessKind(node) !== 0 /* Read */;
}
function accessKind(node) {
  const { parent } = node;
  switch (parent == null ? void 0 : parent.kind) {
    case 217 /* ParenthesizedExpression */:
      return accessKind(parent);
    case 225 /* PostfixUnaryExpression */:
    case 224 /* PrefixUnaryExpression */:
      const { operator } = parent;
      return operator === 46 /* PlusPlusToken */ || operator === 47 /* MinusMinusToken */ ? 2 /* ReadWrite */ : 0 /* Read */;
    case 226 /* BinaryExpression */:
      const { left, operatorToken } = parent;
      return left === node && isAssignmentOperator(operatorToken.kind) ? operatorToken.kind === 64 /* EqualsToken */ ? 1 /* Write */ : 2 /* ReadWrite */ : 0 /* Read */;
    case 211 /* PropertyAccessExpression */:
      return parent.name !== node ? 0 /* Read */ : accessKind(parent);
    case 303 /* PropertyAssignment */: {
      const parentAccess = accessKind(parent.parent);
      return node === parent.name ? reverseAccessKind(parentAccess) : parentAccess;
    }
    case 304 /* ShorthandPropertyAssignment */:
      return node === parent.objectAssignmentInitializer ? 0 /* Read */ : accessKind(parent.parent);
    case 209 /* ArrayLiteralExpression */:
      return accessKind(parent);
    default:
      return 0 /* Read */;
  }
}
function reverseAccessKind(a) {
  switch (a) {
    case 0 /* Read */:
      return 1 /* Write */;
    case 1 /* Write */:
      return 0 /* Read */;
    case 2 /* ReadWrite */:
      return 2 /* ReadWrite */;
    default:
      return Debug.assertNever(a);
  }
}
function compareDataObjects(dst, src) {
  if (!dst || !src || Object.keys(dst).length !== Object.keys(src).length) {
    return false;
  }
  for (const e in dst) {
    if (typeof dst[e] === "object") {
      if (!compareDataObjects(dst[e], src[e])) {
        return false;
      }
    } else if (typeof dst[e] !== "function") {
      if (dst[e] !== src[e]) {
        return false;
      }
    }
  }
  return true;
}
function clearMap(map2, onDeleteValue) {
  map2.forEach(onDeleteValue);
  map2.clear();
}
function mutateMapSkippingNewValues(map2, newMap, options) {
  const { onDeleteValue, onExistingValue } = options;
  map2.forEach((existingValue, key) => {
    var _a;
    if (!(newMap == null ? void 0 : newMap.has(key))) {
      map2.delete(key);
      onDeleteValue(existingValue, key);
    } else if (onExistingValue) {
      onExistingValue(existingValue, (_a = newMap.get) == null ? void 0 : _a.call(newMap, key), key);
    }
  });
}
function mutateMap(map2, newMap, options) {
  mutateMapSkippingNewValues(map2, newMap, options);
  const { createNewValue } = options;
  newMap == null ? void 0 : newMap.forEach((valueInNewMap, key) => {
    if (!map2.has(key)) {
      map2.set(key, createNewValue(key, valueInNewMap));
    }
  });
}
function getClassLikeDeclarationOfSymbol(symbol) {
  var _a;
  return (_a = symbol.declarations) == null ? void 0 : _a.find(isClassLike);
}
function getObjectFlags(type) {
  return type.flags & 3899393 /* ObjectFlagsType */ ? type.objectFlags : 0;
}
function isUMDExportSymbol(symbol) {
  return !!symbol && !!symbol.declarations && !!symbol.declarations[0] && isNamespaceExportDeclaration(symbol.declarations[0]);
}
function getLastChild(node) {
  let lastChild;
  forEachChild(node, (child) => {
    if (nodeIsPresent(child))
      lastChild = child;
  }, (children) => {
    for (let i = children.length - 1; i >= 0; i--) {
      if (nodeIsPresent(children[i])) {
        lastChild = children[i];
        break;
      }
    }
  });
  return lastChild;
}
function isTypeNodeKind(kind) {
  return kind >= 182 /* FirstTypeNode */ && kind <= 205 /* LastTypeNode */ || kind === 133 /* AnyKeyword */ || kind === 159 /* UnknownKeyword */ || kind === 150 /* NumberKeyword */ || kind === 163 /* BigIntKeyword */ || kind === 151 /* ObjectKeyword */ || kind === 136 /* BooleanKeyword */ || kind === 154 /* StringKeyword */ || kind === 155 /* SymbolKeyword */ || kind === 116 /* VoidKeyword */ || kind === 157 /* UndefinedKeyword */ || kind === 146 /* NeverKeyword */ || kind === 141 /* IntrinsicKeyword */ || kind === 233 /* ExpressionWithTypeArguments */ || kind === 319 /* JSDocAllType */ || kind === 320 /* JSDocUnknownType */ || kind === 321 /* JSDocNullableType */ || kind === 322 /* JSDocNonNullableType */ || kind === 323 /* JSDocOptionalType */ || kind === 324 /* JSDocFunctionType */ || kind === 325 /* JSDocVariadicType */;
}
function isAccessExpression(node) {
  return node.kind === 211 /* PropertyAccessExpression */ || node.kind === 212 /* ElementAccessExpression */;
}
function isBundleFileTextLike(section) {
  switch (section.kind) {
    case "text" /* Text */:
    case "internal" /* Internal */:
      return true;
    default:
      return false;
  }
}
function getLeftmostAccessExpression(expr) {
  while (isAccessExpression(expr)) {
    expr = expr.expression;
  }
  return expr;
}
function getLeftmostExpression(node, stopAtCallExpressions) {
  while (true) {
    switch (node.kind) {
      case 225 /* PostfixUnaryExpression */:
        node = node.operand;
        continue;
      case 226 /* BinaryExpression */:
        node = node.left;
        continue;
      case 227 /* ConditionalExpression */:
        node = node.condition;
        continue;
      case 215 /* TaggedTemplateExpression */:
        node = node.tag;
        continue;
      case 213 /* CallExpression */:
        if (stopAtCallExpressions) {
          return node;
        }
      case 234 /* AsExpression */:
      case 212 /* ElementAccessExpression */:
      case 211 /* PropertyAccessExpression */:
      case 235 /* NonNullExpression */:
      case 360 /* PartiallyEmittedExpression */:
      case 238 /* SatisfiesExpression */:
        node = node.expression;
        continue;
    }
    return node;
  }
}
function Symbol4(flags, name) {
  this.flags = flags;
  this.escapedName = name;
  this.declarations = void 0;
  this.valueDeclaration = void 0;
  this.id = 0;
  this.mergeId = 0;
  this.parent = void 0;
  this.members = void 0;
  this.exports = void 0;
  this.exportSymbol = void 0;
  this.constEnumOnlyModule = void 0;
  this.isReferenced = void 0;
  this.lastAssignmentPos = void 0;
  this.links = void 0;
}
function Type3(checker, flags) {
  this.flags = flags;
  if (Debug.isDebugging || tracing) {
    this.checker = checker;
  }
}
function Signature2(checker, flags) {
  this.flags = flags;
  if (Debug.isDebugging) {
    this.checker = checker;
  }
}
function Node4(kind, pos, end) {
  this.pos = pos;
  this.end = end;
  this.kind = kind;
  this.id = 0;
  this.flags = 0 /* None */;
  this.modifierFlagsCache = 0 /* None */;
  this.transformFlags = 0 /* None */;
  this.parent = void 0;
  this.original = void 0;
  this.emitNode = void 0;
}
function Token(kind, pos, end) {
  this.pos = pos;
  this.end = end;
  this.kind = kind;
  this.id = 0;
  this.flags = 0 /* None */;
  this.transformFlags = 0 /* None */;
  this.parent = void 0;
  this.emitNode = void 0;
}
function Identifier2(kind, pos, end) {
  this.pos = pos;
  this.end = end;
  this.kind = kind;
  this.id = 0;
  this.flags = 0 /* None */;
  this.transformFlags = 0 /* None */;
  this.parent = void 0;
  this.original = void 0;
  this.emitNode = void 0;
}
function SourceMapSource(fileName, text, skipTrivia2) {
  this.fileName = fileName;
  this.text = text;
  this.skipTrivia = skipTrivia2 || ((pos) => pos);
}
var objectAllocator = {
  getNodeConstructor: () => Node4,
  getTokenConstructor: () => Token,
  getIdentifierConstructor: () => Identifier2,
  getPrivateIdentifierConstructor: () => Node4,
  getSourceFileConstructor: () => Node4,
  getSymbolConstructor: () => Symbol4,
  getTypeConstructor: () => Type3,
  getSignatureConstructor: () => Signature2,
  getSourceMapSourceConstructor: () => SourceMapSource
};
function formatStringFromArgs(text, args) {
  return text.replace(/{(\d+)}/g, (_match, index) => "" + Debug.checkDefined(args[+index]));
}
var localizedDiagnosticMessages;
function setLocalizedDiagnosticMessages(messages) {
  localizedDiagnosticMessages = messages;
}
function getLocaleSpecificMessage(message) {
  return localizedDiagnosticMessages && localizedDiagnosticMessages[message.key] || message.message;
}
function createDetachedDiagnostic(fileName, sourceText, start, length2, message, ...args) {
  if (start + length2 > sourceText.length) {
    length2 = sourceText.length - start;
  }
  assertDiagnosticLocation(sourceText, start, length2);
  let text = getLocaleSpecificMessage(message);
  if (some(args)) {
    text = formatStringFromArgs(text, args);
  }
  return {
    file: void 0,
    start,
    length: length2,
    messageText: text,
    category: message.category,
    code: message.code,
    reportsUnnecessary: message.reportsUnnecessary,
    fileName
  };
}
function isDiagnosticWithDetachedLocation(diagnostic) {
  return diagnostic.file === void 0 && diagnostic.start !== void 0 && diagnostic.length !== void 0 && typeof diagnostic.fileName === "string";
}
function attachFileToDiagnostic(diagnostic, file) {
  const fileName = file.fileName || "";
  const length2 = file.text.length;
  Debug.assertEqual(diagnostic.fileName, fileName);
  Debug.assertLessThanOrEqual(diagnostic.start, length2);
  Debug.assertLessThanOrEqual(diagnostic.start + diagnostic.length, length2);
  const diagnosticWithLocation = {
    file,
    start: diagnostic.start,
    length: diagnostic.length,
    messageText: diagnostic.messageText,
    category: diagnostic.category,
    code: diagnostic.code,
    reportsUnnecessary: diagnostic.reportsUnnecessary
  };
  if (diagnostic.relatedInformation) {
    diagnosticWithLocation.relatedInformation = [];
    for (const related of diagnostic.relatedInformation) {
      if (isDiagnosticWithDetachedLocation(related) && related.fileName === fileName) {
        Debug.assertLessThanOrEqual(related.start, length2);
        Debug.assertLessThanOrEqual(related.start + related.length, length2);
        diagnosticWithLocation.relatedInformation.push(attachFileToDiagnostic(related, file));
      } else {
        diagnosticWithLocation.relatedInformation.push(related);
      }
    }
  }
  return diagnosticWithLocation;
}
function attachFileToDiagnostics(diagnostics, file) {
  const diagnosticsWithLocation = [];
  for (const diagnostic of diagnostics) {
    diagnosticsWithLocation.push(attachFileToDiagnostic(diagnostic, file));
  }
  return diagnosticsWithLocation;
}
function createFileDiagnostic(file, start, length2, message, ...args) {
  assertDiagnosticLocation(file.text, start, length2);
  let text = getLocaleSpecificMessage(message);
  if (some(args)) {
    text = formatStringFromArgs(text, args);
  }
  return {
    file,
    start,
    length: length2,
    messageText: text,
    category: message.category,
    code: message.code,
    reportsUnnecessary: message.reportsUnnecessary,
    reportsDeprecated: message.reportsDeprecated
  };
}
function formatMessage(message, ...args) {
  let text = getLocaleSpecificMessage(message);
  if (some(args)) {
    text = formatStringFromArgs(text, args);
  }
  return text;
}
function createCompilerDiagnostic(message, ...args) {
  let text = getLocaleSpecificMessage(message);
  if (some(args)) {
    text = formatStringFromArgs(text, args);
  }
  return {
    file: void 0,
    start: void 0,
    length: void 0,
    messageText: text,
    category: message.category,
    code: message.code,
    reportsUnnecessary: message.reportsUnnecessary,
    reportsDeprecated: message.reportsDeprecated
  };
}
function createCompilerDiagnosticFromMessageChain(chain, relatedInformation) {
  return {
    file: void 0,
    start: void 0,
    length: void 0,
    code: chain.code,
    category: chain.category,
    messageText: chain.next ? chain : chain.messageText,
    relatedInformation
  };
}
function chainDiagnosticMessages(details, message, ...args) {
  let text = getLocaleSpecificMessage(message);
  if (some(args)) {
    text = formatStringFromArgs(text, args);
  }
  return {
    messageText: text,
    category: message.category,
    code: message.code,
    next: details === void 0 || Array.isArray(details) ? details : [details]
  };
}
function concatenateDiagnosticMessageChains(headChain, tailChain) {
  let lastChain = headChain;
  while (lastChain.next) {
    lastChain = lastChain.next[0];
  }
  lastChain.next = [tailChain];
}
function getDiagnosticFilePath(diagnostic) {
  return diagnostic.file ? diagnostic.file.path : void 0;
}
function compareDiagnostics(d1, d2) {
  return compareDiagnosticsSkipRelatedInformation(d1, d2) || compareRelatedInformation(d1, d2) || 0 /* EqualTo */;
}
function compareDiagnosticsSkipRelatedInformation(d1, d2) {
  return compareStringsCaseSensitive(getDiagnosticFilePath(d1), getDiagnosticFilePath(d2)) || compareValues(d1.start, d2.start) || compareValues(d1.length, d2.length) || compareValues(d1.code, d2.code) || compareMessageText(d1.messageText, d2.messageText) || 0 /* EqualTo */;
}
function compareRelatedInformation(d1, d2) {
  if (!d1.relatedInformation && !d2.relatedInformation) {
    return 0 /* EqualTo */;
  }
  if (d1.relatedInformation && d2.relatedInformation) {
    return compareValues(d1.relatedInformation.length, d2.relatedInformation.length) || forEach(d1.relatedInformation, (d1i, index) => {
      const d2i = d2.relatedInformation[index];
      return compareDiagnostics(d1i, d2i);
    }) || 0 /* EqualTo */;
  }
  return d1.relatedInformation ? -1 /* LessThan */ : 1 /* GreaterThan */;
}
function compareMessageText(t1, t2) {
  if (typeof t1 === "string" && typeof t2 === "string") {
    return compareStringsCaseSensitive(t1, t2);
  } else if (typeof t1 === "string") {
    return -1 /* LessThan */;
  } else if (typeof t2 === "string") {
    return 1 /* GreaterThan */;
  }
  let res = compareStringsCaseSensitive(t1.messageText, t2.messageText);
  if (res) {
    return res;
  }
  if (!t1.next && !t2.next) {
    return 0 /* EqualTo */;
  }
  if (!t1.next) {
    return -1 /* LessThan */;
  }
  if (!t2.next) {
    return 1 /* GreaterThan */;
  }
  const len = Math.min(t1.next.length, t2.next.length);
  for (let i = 0; i < len; i++) {
    res = compareMessageText(t1.next[i], t2.next[i]);
    if (res) {
      return res;
    }
  }
  if (t1.next.length < t2.next.length) {
    return -1 /* LessThan */;
  } else if (t1.next.length > t2.next.length) {
    return 1 /* GreaterThan */;
  }
  return 0 /* EqualTo */;
}
function getLanguageVariant(scriptKind) {
  return scriptKind === 4 /* TSX */ || scriptKind === 2 /* JSX */ || scriptKind === 1 /* JS */ || scriptKind === 6 /* JSON */ ? 1 /* JSX */ : 0 /* Standard */;
}
function walkTreeForJSXTags(node) {
  if (!(node.transformFlags & 2 /* ContainsJsx */))
    return void 0;
  return isJsxOpeningLikeElement(node) || isJsxFragment(node) ? node : forEachChild(node, walkTreeForJSXTags);
}
function isFileModuleFromUsingJSXTag(file) {
  return !file.isDeclarationFile ? walkTreeForJSXTags(file) : void 0;
}
function isFileForcedToBeModuleByFormat(file) {
  return (file.impliedNodeFormat === 99 /* ESNext */ || fileExtensionIsOneOf(file.fileName, [".cjs" /* Cjs */, ".cts" /* Cts */, ".mjs" /* Mjs */, ".mts" /* Mts */])) && !file.isDeclarationFile ? true : void 0;
}
function getSetExternalModuleIndicator(options) {
  switch (getEmitModuleDetectionKind(options)) {
    case 3 /* Force */:
      return (file) => {
        file.externalModuleIndicator = isFileProbablyExternalModule(file) || !file.isDeclarationFile || void 0;
      };
    case 1 /* Legacy */:
      return (file) => {
        file.externalModuleIndicator = isFileProbablyExternalModule(file);
      };
    case 2 /* Auto */:
      const checks = [isFileProbablyExternalModule];
      if (options.jsx === 4 /* ReactJSX */ || options.jsx === 5 /* ReactJSXDev */) {
        checks.push(isFileModuleFromUsingJSXTag);
      }
      checks.push(isFileForcedToBeModuleByFormat);
      const combined = or(...checks);
      const callback = (file) => void (file.externalModuleIndicator = combined(file));
      return callback;
  }
}
function createComputedCompilerOptions(options) {
  return options;
}
var computedOptions = createComputedCompilerOptions({
  target: {
    dependencies: ["module"],
    computeValue: (compilerOptions) => {
      return compilerOptions.target ?? (compilerOptions.module === 100 /* Node16 */ && 9 /* ES2022 */ || compilerOptions.module === 199 /* NodeNext */ && 99 /* ESNext */ || 1 /* ES5 */);
    }
  },
  module: {
    dependencies: ["target"],
    computeValue: (compilerOptions) => {
      return typeof compilerOptions.module === "number" ? compilerOptions.module : computedOptions.target.computeValue(compilerOptions) >= 2 /* ES2015 */ ? 5 /* ES2015 */ : 1 /* CommonJS */;
    }
  },
  moduleResolution: {
    dependencies: ["module", "target"],
    computeValue: (compilerOptions) => {
      let moduleResolution = compilerOptions.moduleResolution;
      if (moduleResolution === void 0) {
        switch (computedOptions.module.computeValue(compilerOptions)) {
          case 1 /* CommonJS */:
            moduleResolution = 2 /* Node10 */;
            break;
          case 100 /* Node16 */:
            moduleResolution = 3 /* Node16 */;
            break;
          case 199 /* NodeNext */:
            moduleResolution = 99 /* NodeNext */;
            break;
          case 200 /* Preserve */:
            moduleResolution = 100 /* Bundler */;
            break;
          default:
            moduleResolution = 1 /* Classic */;
            break;
        }
      }
      return moduleResolution;
    }
  },
  moduleDetection: {
    dependencies: ["module", "target"],
    computeValue: (compilerOptions) => {
      return compilerOptions.moduleDetection || (computedOptions.module.computeValue(compilerOptions) === 100 /* Node16 */ || computedOptions.module.computeValue(compilerOptions) === 199 /* NodeNext */ ? 3 /* Force */ : 2 /* Auto */);
    }
  },
  isolatedModules: {
    dependencies: ["verbatimModuleSyntax"],
    computeValue: (compilerOptions) => {
      return !!(compilerOptions.isolatedModules || compilerOptions.verbatimModuleSyntax);
    }
  },
  esModuleInterop: {
    dependencies: ["module", "target"],
    computeValue: (compilerOptions) => {
      if (compilerOptions.esModuleInterop !== void 0) {
        return compilerOptions.esModuleInterop;
      }
      switch (computedOptions.module.computeValue(compilerOptions)) {
        case 100 /* Node16 */:
        case 199 /* NodeNext */:
        case 200 /* Preserve */:
          return true;
      }
      return false;
    }
  },
  allowSyntheticDefaultImports: {
    dependencies: ["module", "target", "moduleResolution"],
    computeValue: (compilerOptions) => {
      if (compilerOptions.allowSyntheticDefaultImports !== void 0) {
        return compilerOptions.allowSyntheticDefaultImports;
      }
      return computedOptions.esModuleInterop.computeValue(compilerOptions) || computedOptions.module.computeValue(compilerOptions) === 4 /* System */ || computedOptions.moduleResolution.computeValue(compilerOptions) === 100 /* Bundler */;
    }
  },
  resolvePackageJsonExports: {
    dependencies: ["moduleResolution"],
    computeValue: (compilerOptions) => {
      const moduleResolution = computedOptions.moduleResolution.computeValue(compilerOptions);
      if (!moduleResolutionSupportsPackageJsonExportsAndImports(moduleResolution)) {
        return false;
      }
      if (compilerOptions.resolvePackageJsonExports !== void 0) {
        return compilerOptions.resolvePackageJsonExports;
      }
      switch (moduleResolution) {
        case 3 /* Node16 */:
        case 99 /* NodeNext */:
        case 100 /* Bundler */:
          return true;
      }
      return false;
    }
  },
  resolvePackageJsonImports: {
    dependencies: ["moduleResolution", "resolvePackageJsonExports"],
    computeValue: (compilerOptions) => {
      const moduleResolution = computedOptions.moduleResolution.computeValue(compilerOptions);
      if (!moduleResolutionSupportsPackageJsonExportsAndImports(moduleResolution)) {
        return false;
      }
      if (compilerOptions.resolvePackageJsonExports !== void 0) {
        return compilerOptions.resolvePackageJsonExports;
      }
      switch (moduleResolution) {
        case 3 /* Node16 */:
        case 99 /* NodeNext */:
        case 100 /* Bundler */:
          return true;
      }
      return false;
    }
  },
  resolveJsonModule: {
    dependencies: ["moduleResolution", "module", "target"],
    computeValue: (compilerOptions) => {
      if (compilerOptions.resolveJsonModule !== void 0) {
        return compilerOptions.resolveJsonModule;
      }
      return computedOptions.moduleResolution.computeValue(compilerOptions) === 100 /* Bundler */;
    }
  },
  declaration: {
    dependencies: ["composite"],
    computeValue: (compilerOptions) => {
      return !!(compilerOptions.declaration || compilerOptions.composite);
    }
  },
  preserveConstEnums: {
    dependencies: ["isolatedModules", "verbatimModuleSyntax"],
    computeValue: (compilerOptions) => {
      return !!(compilerOptions.preserveConstEnums || computedOptions.isolatedModules.computeValue(compilerOptions));
    }
  },
  incremental: {
    dependencies: ["composite"],
    computeValue: (compilerOptions) => {
      return !!(compilerOptions.incremental || compilerOptions.composite);
    }
  },
  declarationMap: {
    dependencies: ["declaration", "composite"],
    computeValue: (compilerOptions) => {
      return !!(compilerOptions.declarationMap && computedOptions.declaration.computeValue(compilerOptions));
    }
  },
  allowJs: {
    dependencies: ["checkJs"],
    computeValue: (compilerOptions) => {
      return compilerOptions.allowJs === void 0 ? !!compilerOptions.checkJs : compilerOptions.allowJs;
    }
  },
  useDefineForClassFields: {
    dependencies: ["target", "module"],
    computeValue: (compilerOptions) => {
      return compilerOptions.useDefineForClassFields === void 0 ? computedOptions.target.computeValue(compilerOptions) >= 9 /* ES2022 */ : compilerOptions.useDefineForClassFields;
    }
  },
  noImplicitAny: {
    dependencies: ["strict"],
    computeValue: (compilerOptions) => {
      return getStrictOptionValue(compilerOptions, "noImplicitAny");
    }
  },
  noImplicitThis: {
    dependencies: ["strict"],
    computeValue: (compilerOptions) => {
      return getStrictOptionValue(compilerOptions, "noImplicitThis");
    }
  },
  strictNullChecks: {
    dependencies: ["strict"],
    computeValue: (compilerOptions) => {
      return getStrictOptionValue(compilerOptions, "strictNullChecks");
    }
  },
  strictFunctionTypes: {
    dependencies: ["strict"],
    computeValue: (compilerOptions) => {
      return getStrictOptionValue(compilerOptions, "strictFunctionTypes");
    }
  },
  strictBindCallApply: {
    dependencies: ["strict"],
    computeValue: (compilerOptions) => {
      return getStrictOptionValue(compilerOptions, "strictBindCallApply");
    }
  },
  strictPropertyInitialization: {
    dependencies: ["strict"],
    computeValue: (compilerOptions) => {
      return getStrictOptionValue(compilerOptions, "strictPropertyInitialization");
    }
  },
  alwaysStrict: {
    dependencies: ["strict"],
    computeValue: (compilerOptions) => {
      return getStrictOptionValue(compilerOptions, "alwaysStrict");
    }
  },
  useUnknownInCatchVariables: {
    dependencies: ["strict"],
    computeValue: (compilerOptions) => {
      return getStrictOptionValue(compilerOptions, "useUnknownInCatchVariables");
    }
  }
});
var getEmitScriptTarget = computedOptions.target.computeValue;
var getEmitModuleKind = computedOptions.module.computeValue;
var getEmitModuleResolutionKind = computedOptions.moduleResolution.computeValue;
var getEmitModuleDetectionKind = computedOptions.moduleDetection.computeValue;
var getIsolatedModules = computedOptions.isolatedModules.computeValue;
var getESModuleInterop = computedOptions.esModuleInterop.computeValue;
var getAllowSyntheticDefaultImports = computedOptions.allowSyntheticDefaultImports.computeValue;
var getResolvePackageJsonExports = computedOptions.resolvePackageJsonExports.computeValue;
var getResolvePackageJsonImports = computedOptions.resolvePackageJsonImports.computeValue;
var getResolveJsonModule = computedOptions.resolveJsonModule.computeValue;
var getEmitDeclarations = computedOptions.declaration.computeValue;
var shouldPreserveConstEnums = computedOptions.preserveConstEnums.computeValue;
var isIncrementalCompilation = computedOptions.incremental.computeValue;
var getAreDeclarationMapsEnabled = computedOptions.declarationMap.computeValue;
var getAllowJSCompilerOption = computedOptions.allowJs.computeValue;
var getUseDefineForClassFields = computedOptions.useDefineForClassFields.computeValue;
function emitModuleKindIsNonNodeESM(moduleKind) {
  return moduleKind >= 5 /* ES2015 */ && moduleKind <= 99 /* ESNext */;
}
function hasJsonModuleEmitEnabled(options) {
  switch (getEmitModuleKind(options)) {
    case 0 /* None */:
    case 4 /* System */:
    case 3 /* UMD */:
      return false;
  }
  return true;
}
function unreachableCodeIsError(options) {
  return options.allowUnreachableCode === false;
}
function unusedLabelIsError(options) {
  return options.allowUnusedLabels === false;
}
function moduleResolutionSupportsPackageJsonExportsAndImports(moduleResolution) {
  return moduleResolution >= 3 /* Node16 */ && moduleResolution <= 99 /* NodeNext */ || moduleResolution === 100 /* Bundler */;
}
function getStrictOptionValue(compilerOptions, flag) {
  return compilerOptions[flag] === void 0 ? !!compilerOptions.strict : !!compilerOptions[flag];
}
function getEmitStandardClassFields(compilerOptions) {
  return compilerOptions.useDefineForClassFields !== false && getEmitScriptTarget(compilerOptions) >= 9 /* ES2022 */;
}
function compilerOptionsAffectSemanticDiagnostics(newOptions, oldOptions) {
  return optionsHaveChanges(oldOptions, newOptions, semanticDiagnosticsOptionDeclarations);
}
function compilerOptionsAffectEmit(newOptions, oldOptions) {
  return optionsHaveChanges(oldOptions, newOptions, affectsEmitOptionDeclarations);
}
function compilerOptionsAffectDeclarationPath(newOptions, oldOptions) {
  return optionsHaveChanges(oldOptions, newOptions, affectsDeclarationPathOptionDeclarations);
}
function getCompilerOptionValue(options, option) {
  return option.strictFlag ? getStrictOptionValue(options, option.name) : option.allowJsFlag ? getAllowJSCompilerOption(options) : options[option.name];
}
function getJSXTransformEnabled(options) {
  const jsx = options.jsx;
  return jsx === 2 /* React */ || jsx === 4 /* ReactJSX */ || jsx === 5 /* ReactJSXDev */;
}
function getJSXImplicitImportBase(compilerOptions, file) {
  const jsxImportSourcePragmas = file == null ? void 0 : file.pragmas.get("jsximportsource");
  const jsxImportSourcePragma = isArray(jsxImportSourcePragmas) ? jsxImportSourcePragmas[jsxImportSourcePragmas.length - 1] : jsxImportSourcePragmas;
  return compilerOptions.jsx === 4 /* ReactJSX */ || compilerOptions.jsx === 5 /* ReactJSXDev */ || compilerOptions.jsxImportSource || jsxImportSourcePragma ? (jsxImportSourcePragma == null ? void 0 : jsxImportSourcePragma.arguments.factory) || compilerOptions.jsxImportSource || "react" : void 0;
}
function getJSXRuntimeImport(base, options) {
  return base ? `${base}/${options.jsx === 5 /* ReactJSXDev */ ? "jsx-dev-runtime" : "jsx-runtime"}` : void 0;
}
function hasZeroOrOneAsteriskCharacter(str) {
  let seenAsterisk = false;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) === 42 /* asterisk */) {
      if (!seenAsterisk) {
        seenAsterisk = true;
      } else {
        return false;
      }
    }
  }
  return true;
}
function createSymlinkCache(cwd, getCanonicalFileName) {
  let symlinkedDirectories;
  let symlinkedDirectoriesByRealpath;
  let symlinkedFiles;
  let hasProcessedResolutions = false;
  return {
    getSymlinkedFiles: () => symlinkedFiles,
    getSymlinkedDirectories: () => symlinkedDirectories,
    getSymlinkedDirectoriesByRealpath: () => symlinkedDirectoriesByRealpath,
    setSymlinkedFile: (path, real) => (symlinkedFiles || (symlinkedFiles = /* @__PURE__ */ new Map())).set(path, real),
    setSymlinkedDirectory: (symlink, real) => {
      let symlinkPath = toPath(symlink, cwd, getCanonicalFileName);
      if (!containsIgnoredPath(symlinkPath)) {
        symlinkPath = ensureTrailingDirectorySeparator(symlinkPath);
        if (real !== false && !(symlinkedDirectories == null ? void 0 : symlinkedDirectories.has(symlinkPath))) {
          (symlinkedDirectoriesByRealpath || (symlinkedDirectoriesByRealpath = createMultiMap())).add(real.realPath, symlink);
        }
        (symlinkedDirectories || (symlinkedDirectories = /* @__PURE__ */ new Map())).set(symlinkPath, real);
      }
    },
    setSymlinksFromResolutions(forEachResolvedModule, forEachResolvedTypeReferenceDirective, typeReferenceDirectives) {
      Debug.assert(!hasProcessedResolutions);
      hasProcessedResolutions = true;
      forEachResolvedModule((resolution) => processResolution(this, resolution.resolvedModule));
      forEachResolvedTypeReferenceDirective((resolution) => processResolution(this, resolution.resolvedTypeReferenceDirective));
      typeReferenceDirectives.forEach((resolution) => processResolution(this, resolution.resolvedTypeReferenceDirective));
    },
    hasProcessedResolutions: () => hasProcessedResolutions
  };
  function processResolution(cache, resolution) {
    if (!resolution || !resolution.originalPath || !resolution.resolvedFileName)
      return;
    const { resolvedFileName, originalPath } = resolution;
    cache.setSymlinkedFile(toPath(originalPath, cwd, getCanonicalFileName), resolvedFileName);
    const [commonResolved, commonOriginal] = guessDirectorySymlink(resolvedFileName, originalPath, cwd, getCanonicalFileName) || emptyArray;
    if (commonResolved && commonOriginal) {
      cache.setSymlinkedDirectory(
        commonOriginal,
        {
          real: ensureTrailingDirectorySeparator(commonResolved),
          realPath: ensureTrailingDirectorySeparator(toPath(commonResolved, cwd, getCanonicalFileName))
        }
      );
    }
  }
}
function guessDirectorySymlink(a, b, cwd, getCanonicalFileName) {
  const aParts = getPathComponents(getNormalizedAbsolutePath(a, cwd));
  const bParts = getPathComponents(getNormalizedAbsolutePath(b, cwd));
  let isDirectory = false;
  while (aParts.length >= 2 && bParts.length >= 2 && !isNodeModulesOrScopedPackageDirectory(aParts[aParts.length - 2], getCanonicalFileName) && !isNodeModulesOrScopedPackageDirectory(bParts[bParts.length - 2], getCanonicalFileName) && getCanonicalFileName(aParts[aParts.length - 1]) === getCanonicalFileName(bParts[bParts.length - 1])) {
    aParts.pop();
    bParts.pop();
    isDirectory = true;
  }
  return isDirectory ? [getPathFromPathComponents(aParts), getPathFromPathComponents(bParts)] : void 0;
}
function isNodeModulesOrScopedPackageDirectory(s, getCanonicalFileName) {
  return s !== void 0 && (getCanonicalFileName(s) === "node_modules" || startsWith(s, "@"));
}
var reservedCharacterPattern = /[^\w\s/]/g;
var wildcardCharCodes = [42 /* asterisk */, 63 /* question */];
var commonPackageFolders = ["node_modules", "bower_components", "jspm_packages"];
var implicitExcludePathRegexPattern = `(?!(${commonPackageFolders.join("|")})(/|$))`;
var filesMatcher = {
  /**
   * Matches any single directory segment unless it is the last segment and a .min.js file
   * Breakdown:
   *  [^./]                   # matches everything up to the first . character (excluding directory separators)
   *  (\\.(?!min\\.js$))?     # matches . characters but not if they are part of the .min.js file extension
   */
  singleAsteriskRegexFragment: "([^./]|(\\.(?!min\\.js$))?)*",
  /**
   * Regex for the ** wildcard. Matches any number of subdirectories. When used for including
   * files or directories, does not match subdirectories that start with a . character
   */
  doubleAsteriskRegexFragment: `(/${implicitExcludePathRegexPattern}[^/.][^/]*)*?`,
  replaceWildcardCharacter: (match) => replaceWildcardCharacter(match, filesMatcher.singleAsteriskRegexFragment)
};
var directoriesMatcher = {
  singleAsteriskRegexFragment: "[^/]*",
  /**
   * Regex for the ** wildcard. Matches any number of subdirectories. When used for including
   * files or directories, does not match subdirectories that start with a . character
   */
  doubleAsteriskRegexFragment: `(/${implicitExcludePathRegexPattern}[^/.][^/]*)*?`,
  replaceWildcardCharacter: (match) => replaceWildcardCharacter(match, directoriesMatcher.singleAsteriskRegexFragment)
};
var excludeMatcher = {
  singleAsteriskRegexFragment: "[^/]*",
  doubleAsteriskRegexFragment: "(/.+?)?",
  replaceWildcardCharacter: (match) => replaceWildcardCharacter(match, excludeMatcher.singleAsteriskRegexFragment)
};
var wildcardMatchers = {
  files: filesMatcher,
  directories: directoriesMatcher,
  exclude: excludeMatcher
};
function getRegularExpressionForWildcard(specs, basePath, usage) {
  const patterns = getRegularExpressionsForWildcards(specs, basePath, usage);
  if (!patterns || !patterns.length) {
    return void 0;
  }
  const pattern = patterns.map((pattern2) => `(${pattern2})`).join("|");
  const terminator = usage === "exclude" ? "($|/)" : "$";
  return `^(${pattern})${terminator}`;
}
function getRegularExpressionsForWildcards(specs, basePath, usage) {
  if (specs === void 0 || specs.length === 0) {
    return void 0;
  }
  return flatMap(specs, (spec) => spec && getSubPatternFromSpec(spec, basePath, usage, wildcardMatchers[usage]));
}
function isImplicitGlob(lastPathComponent) {
  return !/[.*?]/.test(lastPathComponent);
}
function getPatternFromSpec(spec, basePath, usage) {
  const pattern = spec && getSubPatternFromSpec(spec, basePath, usage, wildcardMatchers[usage]);
  return pattern && `^(${pattern})${usage === "exclude" ? "($|/)" : "$"}`;
}
function getSubPatternFromSpec(spec, basePath, usage, { singleAsteriskRegexFragment, doubleAsteriskRegexFragment, replaceWildcardCharacter: replaceWildcardCharacter2 } = wildcardMatchers[usage]) {
  let subpattern = "";
  let hasWrittenComponent = false;
  const components = getNormalizedPathComponents(spec, basePath);
  const lastComponent = last(components);
  if (usage !== "exclude" && lastComponent === "**") {
    return void 0;
  }
  components[0] = removeTrailingDirectorySeparator(components[0]);
  if (isImplicitGlob(lastComponent)) {
    components.push("**", "*");
  }
  let optionalCount = 0;
  for (let component of components) {
    if (component === "**") {
      subpattern += doubleAsteriskRegexFragment;
    } else {
      if (usage === "directories") {
        subpattern += "(";
        optionalCount++;
      }
      if (hasWrittenComponent) {
        subpattern += directorySeparator;
      }
      if (usage !== "exclude") {
        let componentPattern = "";
        if (component.charCodeAt(0) === 42 /* asterisk */) {
          componentPattern += "([^./]" + singleAsteriskRegexFragment + ")?";
          component = component.substr(1);
        } else if (component.charCodeAt(0) === 63 /* question */) {
          componentPattern += "[^./]";
          component = component.substr(1);
        }
        componentPattern += component.replace(reservedCharacterPattern, replaceWildcardCharacter2);
        if (componentPattern !== component) {
          subpattern += implicitExcludePathRegexPattern;
        }
        subpattern += componentPattern;
      } else {
        subpattern += component.replace(reservedCharacterPattern, replaceWildcardCharacter2);
      }
    }
    hasWrittenComponent = true;
  }
  while (optionalCount > 0) {
    subpattern += ")?";
    optionalCount--;
  }
  return subpattern;
}
function replaceWildcardCharacter(match, singleAsteriskRegexFragment) {
  return match === "*" ? singleAsteriskRegexFragment : match === "?" ? "[^/]" : "\\" + match;
}
function getFileMatcherPatterns(path, excludes, includes, useCaseSensitiveFileNames2, currentDirectory) {
  path = normalizePath(path);
  currentDirectory = normalizePath(currentDirectory);
  const absolutePath = combinePaths(currentDirectory, path);
  return {
    includeFilePatterns: map(getRegularExpressionsForWildcards(includes, absolutePath, "files"), (pattern) => `^${pattern}$`),
    includeFilePattern: getRegularExpressionForWildcard(includes, absolutePath, "files"),
    includeDirectoryPattern: getRegularExpressionForWildcard(includes, absolutePath, "directories"),
    excludePattern: getRegularExpressionForWildcard(excludes, absolutePath, "exclude"),
    basePaths: getBasePaths(path, includes, useCaseSensitiveFileNames2)
  };
}
function getRegexFromPattern(pattern, useCaseSensitiveFileNames2) {
  return new RegExp(pattern, useCaseSensitiveFileNames2 ? "" : "i");
}
function matchFiles(path, extensions, excludes, includes, useCaseSensitiveFileNames2, currentDirectory, depth, getFileSystemEntries, realpath) {
  path = normalizePath(path);
  currentDirectory = normalizePath(currentDirectory);
  const patterns = getFileMatcherPatterns(path, excludes, includes, useCaseSensitiveFileNames2, currentDirectory);
  const includeFileRegexes = patterns.includeFilePatterns && patterns.includeFilePatterns.map((pattern) => getRegexFromPattern(pattern, useCaseSensitiveFileNames2));
  const includeDirectoryRegex = patterns.includeDirectoryPattern && getRegexFromPattern(patterns.includeDirectoryPattern, useCaseSensitiveFileNames2);
  const excludeRegex = patterns.excludePattern && getRegexFromPattern(patterns.excludePattern, useCaseSensitiveFileNames2);
  const results = includeFileRegexes ? includeFileRegexes.map(() => []) : [[]];
  const visited = /* @__PURE__ */ new Map();
  const toCanonical = createGetCanonicalFileName(useCaseSensitiveFileNames2);
  for (const basePath of patterns.basePaths) {
    visitDirectory(basePath, combinePaths(currentDirectory, basePath), depth);
  }
  return flatten(results);
  function visitDirectory(path2, absolutePath, depth2) {
    const canonicalPath = toCanonical(realpath(absolutePath));
    if (visited.has(canonicalPath))
      return;
    visited.set(canonicalPath, true);
    const { files, directories } = getFileSystemEntries(path2);
    for (const current of sort(files, compareStringsCaseSensitive)) {
      const name = combinePaths(path2, current);
      const absoluteName = combinePaths(absolutePath, current);
      if (extensions && !fileExtensionIsOneOf(name, extensions))
        continue;
      if (excludeRegex && excludeRegex.test(absoluteName))
        continue;
      if (!includeFileRegexes) {
        results[0].push(name);
      } else {
        const includeIndex = findIndex(includeFileRegexes, (re) => re.test(absoluteName));
        if (includeIndex !== -1) {
          results[includeIndex].push(name);
        }
      }
    }
    if (depth2 !== void 0) {
      depth2--;
      if (depth2 === 0) {
        return;
      }
    }
    for (const current of sort(directories, compareStringsCaseSensitive)) {
      const name = combinePaths(path2, current);
      const absoluteName = combinePaths(absolutePath, current);
      if ((!includeDirectoryRegex || includeDirectoryRegex.test(absoluteName)) && (!excludeRegex || !excludeRegex.test(absoluteName))) {
        visitDirectory(name, absoluteName, depth2);
      }
    }
  }
}
function getBasePaths(path, includes, useCaseSensitiveFileNames2) {
  const basePaths = [path];
  if (includes) {
    const includeBasePaths = [];
    for (const include of includes) {
      const absolute = isRoottArg(aArgs, 'source')) === -1) {
	        continue;
	      }
	      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
	      if (generatedPosition) {
	        var ret = {
	          line: generatedPosition.line +
	            (section.generatedOffset.generatedLine - 1),
	          column: generatedPosition.column +
	            (section.generatedOffset.generatedLine === generatedPosition.line
	             ? section.generatedOffset.generatedColumn - 1
	             : 0)
	        };
	        return ret;
	      }
	    }
	
	    return {
	      line: null,
	      column: null
	    };
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	IndexedSourceMapConsumer.prototype._parseMappings =
	  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    this.__generatedMappings = [];
	    this.__originalMappings = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	      var sectionMappings = section.consumer._generatedMappings;
	      for (var j = 0; j < sectionMappings.length; j++) {
	        var mapping = sectionMappings[j];
	
	        var source = section.consumer._sources.at(mapping.source);
	        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
	        this._sources.add(source);
	        source = this._sources.indexOf(source);
	
	        var name = null;
	        if (mapping.name) {
	          name = section.consumer._names.at(mapping.name);
	          this._names.add(name);
	          name = this._names.indexOf(name);
	        }
	
	        // The mappings coming from the consumer for the section have
	        // generated positions relative to the start of the section, so we
	        // need to offset them to be relative to the start of the concatenated
	        // generated file.
	        var adjustedMapping = {
	          source: source,
	          generatedLine: mapping.generatedLine +
	            (section.generatedOffset.generatedLine - 1),
	          generatedColumn: mapping.generatedColumn +
	            (section.generatedOffset.generatedLine === mapping.generatedLine
	            ? section.generatedOffset.generatedColumn - 1
	            : 0),
	          originalLine: mapping.originalLine,
	          originalColumn: mapping.originalColumn,
	          name: name
	        };
	
	        this.__generatedMappings.push(adjustedMapping);
	        if (typeof adjustedMapping.originalLine === 'number') {
	          this.__originalMappings.push(adjustedMapping);
	        }
	      }
	    }
	
	    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
	    quickSort(this.__originalMappings, util.compareByOriginalPositions);
	  };
	
	exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	exports.GREATEST_LOWER_BOUND = 1;
	exports.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Recursive implementation of binary search.
	 *
	 * @param aLow Indices here and lower do not contain the needle.
	 * @param aHigh Indices here and higher do not contain the needle.
	 * @param aNeedle The element being searched for.
	 * @param aHaystack The non-empty array being searched.
	 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
	 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 */
	function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
	  // This function terminates when one of the following is true:
	  //
	  //   1. We find the exact element we are looking for.
	  //
	  //   2. We did not find the exact element, but we can return the index of
	  //      the next-closest element.
	  //
	  //   3. We did not find the exact element, and there is no next-closest
	  //      element than the one we are searching for, so we return -1.
	  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
	  var cmp = aCompare(aNeedle, aHaystack[mid], true);
	  if (cmp === 0) {
	    // Found the element we are looking for.
	    return mid;
	  }
	  else if (cmp > 0) {
	    // Our needle is greater than aHaystack[mid].
	    if (aHigh - mid > 1) {
	      // The element is in the upper half.
	      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
	    }
	
	    // The exact needle element was not found in this haystack. Determine if
	    // we are in termination case (3) or (2) and return the appropriate thing.
	    if (aBias == exports.LEAST_UPPER_BOUND) {
	      return aHigh < aHaystack.length ? aHigh : -1;
	    } else {
	      return mid;
	    }
	  }
	  else {
	    // Our needle is less than aHaystack[mid].
	    if (mid - aLow > 1) {
	      // The element is in the lower half.
	      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
	    }
	
	    // we are in termination case (3) or (2) and return the appropriate thing.
	    if (aBias == exports.LEAST_UPPER_BOUND) {
	      return mid;
	    } else {
	      return aLow < 0 ? -1 : aLow;
	    }
	  }
	}
	
	/**
	 * This is an implementation of binary search which will always try and return
	 * the index of the closest element if there is no exact hit. This is because
	 * mappings between original and generated line/col pairs are single points,
	 * and there is an implicit region between each of them, so a miss just means
	 * that you aren't on the very start of a region.
	 *
	 * @param aNeedle The element you are looking for.
	 * @param aHaystack The array that is being searched.
	 * @param aCompare A function which takes the needle and an element in the
	 *     array and returns -1, 0, or 1 depending on whether the needle is less
	 *     than, equal to, or greater than the element, respectively.
	 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
	 */
	exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
	  if (aHaystack.length === 0) {
	    return -1;
	  }
	
	  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
	                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
	  if (index < 0) {
	    return -1;
	  }
	
	  // We have found either the exact element, or the next-closest element than
	  // the one we are searching for. However, there may be more than one such
	  // element. Make sure we always return the smallest of these.
	  while (index - 1 >= 0) {
	    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
	      break;
	    }
	    --index;
	  }
	
	  return index;
	};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	// It turns out that some (most?) JavaScript engines don't self-host
	// `Array.prototype.sort`. This makes sense because C++ will likely remain
	// faster than JS when doing raw CPU-intensive sorting. However, when using a
	// custom comparator function, calling back and forth between the VM's C++ and
	// JIT'd JS is rather slow *and* loses JIT type information, resulting in
	// worse generated code for the comparator function than would be optimal. In
	// fact, when sorting with a comparator, these costs outweigh the benefits of
	// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
	// a ~3500ms mean speed-up in `bench/bench.html`.
	
	/**
	 * Swap the elements indexed by `x` and `y` in the array `ary`.
	 *
	 * @param {Array} ary
	 *        The array.
	 * @param {Number} x
	 *        The index of the first item.
	 * @param {Number} y
	 *        The index of the second item.
	 */
	function swap(ary, x, y) {
	  var temp = ary[x];
	  ary[x] = ary[y];
	  ary[y] = temp;
	}
	
	/**
	 * Returns a random integer within the range `low .. high` inclusive.
	 *
	 * @param {Number} low
	 *        The lower bound on the range.
	 * @param {Number} high
	 *        The upper bound on the range.
	 */
	function randomIntInRange(low, high) {
	  return Math.round(low + (Math.random() * (high - low)));
	}
	
	/**
	 * The Quick Sort algorithm.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 * @param {Number} p
	 *        Start index of the array
	 * @param {Number} r
	 *        End index of the array
	 */
	function doQuickSort(ary, comparator, p, r) {
	  // If our lower bound is less than our upper bound, we (1) partition the
	  // array into two pieces and (2) recurse on each half. If it is not, this is
	  // the empty array and our base case.
	
	  if (p < r) {
	    // (1) Partitioning.
	    //
	    // The partitioning chooses a pivot between `p` and `r` and moves all
	    // elements that are less than or equal to the pivot to the before it, and
	    // all the elements that are greater than it after it. The effect is that
	    // once partition is done, the pivot is in the exact place it will be when
	    // the array is put in sorted order, and it will not need to be moved
	    // again. This runs in O(n) time.
	
	    // Always choose a random pivot so that an input array which is reverse
	    // sorted does not cause O(n^2) running time.
	    var pivotIndex = randomIntInRange(p, r);
	    var i = p - 1;
	
	    swap(ary, pivotIndex, r);
	    var pivot = ary[r];
	
	    // Immediately after `j` is incremented in this loop, the following hold
	    // true:
	    //
	    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
	    //
	    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
	    for (var j = p; j < r; j++) {
	      if (comparator(ary[j], pivot) <= 0) {
	        i += 1;
	        swap(ary, i, j);
	      }
	    }
	
	    swap(ary, i + 1, j);
	    var q = i + 1;
	
	    // (2) Recurse on each half.
	
	    doQuickSort(ary, comparator, p, q - 1);
	    doQuickSort(ary, comparator, q + 1, r);
	  }
	}
	
	/**
	 * Sort the given array in-place with the given comparator function.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 */
	exports.quickSort = function (ary, comparator) {
	  doQuickSort(ary, comparator, 0, ary.length - 1);
	};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var SourceMapGenerator = __webpack_require__(1).SourceMapGenerator;
	var util = __webpack_require__(4);
	
	// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
	// operating systems these days (capturing the result).
	var REGEX_NEWLINE = /(\r?\n)/;
	
	// Newline character code for charCodeAt() comparisons
	var NEWLINE_CODE = 10;
	
	// Private symbol for identifying `SourceNode`s when multiple versions of
	// the source-map library are loaded. This MUST NOT CHANGE across
	// versions!
	var isSourceNode = "$$$isSourceNode$$$";
	
	/**
	 * SourceNodes provide a way to abstract over interpolating/concatenating
	 * snippets of generated JavaScript source code while maintaining the line and
	 * column information associated with the original source code.
	 *
	 * @param aLine The original line number.
	 * @param aColumn The original column number.
	 * @param aSource The original source's filename.
	 * @param aChunks Optional. An array of strings which are snippets of
	 *        generated JS, or other SourceNodes.
	 * @param aName The original identifier.
	 */
	function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
	  this.children = [];
	  this.sourceContents = {};
	  this.line = aLine == null ? null : aLine;
	  this.column = aColumn == null ? null : aColumn;
	  this.source = aSource == null ? null : aSource;
	  this.name = aName == null ? null : aName;
	  this[isSourceNode] = true;
	  if (aChunks != null) this.add(aChunks);
	}
	
	/**
	 * Creates a SourceNode from generated code and a SourceMapConsumer.
	 *
	 * @param aGeneratedCode The generated code
	 * @param aSourceMapConsumer The SourceMap for the generated code
	 * @param aRelativePath Optional. The path that relative sources in the
	 *        SourceMapConsumer should be relative to.
	 */
	SourceNode.fromStringWithSourceMap =
	  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
	    // The SourceNode we want to fill with the generated code
	    // and the SourceMap
	    var node = new SourceNode();
	
	    // All even indices of this array are one line of the generated code,
	    // while all odd indices are the newlines between two adjacent lines
	    // (since `REGEX_NEWLINE` captures its match).
	    // Processed fragments are accessed by calling `shiftNextLine`.
	    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
	    var remainingLinesIndex = 0;
	    var shiftNextLine = function() {
	      var lineContents = getNextLine();
	      // The last line of a file might not have a newline.
	      var newLine = getNextLine() || "";
	      return lineContents + newLine;
	
	      function getNextLine() {
	        return remainingLinesIndex < remainingLines.length ?
	            remainingLines[remainingLinesIndex++] : undefined;
	      }
	    };
	
	    // We need to remember the position of "remainingLines"
	    var lastGeneratedLine = 1, lastGeneratedColumn = 0;
	
	    // The generate SourceNodes we need a code range.
	    // To extract it current and last mapping is used.
	    // Here we store the last mapping.
	    var lastMapping = null;
	
	    aSourceMapConsumer.eachMapping(function (mapping) {
	      if (lastMapping !== null) {
	        // We add the code from "lastMapping" to "mapping":
	        // First check if there is a new line in between.
	        if (lastGeneratedLine < mapping.generatedLine) {
	          // Associate first line with "lastMapping"
	          addMappingWithCode(lastMapping, shiftNextLine());
	          lastGeneratedLine++;
	          lastGeneratedColumn = 0;
	          // The remaining code is added without mapping
	        } else {
	          // There is no new line in between.
	          // Associate the code between "lastGeneratedColumn" and
	          // "mapping.generatedColumn" with "lastMapping"
	          var nextLine = remainingLines[remainingLinesIndex] || '';
	          var code = nextLine.substr(0, mapping.generatedColumn -
	                                        lastGeneratedColumn);
	          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
	                                              lastGeneratedColumn);
	          lastGeneratedColumn = mapping.generatedColumn;
	          addMappingWithCode(lastMapping, code);
	          // No more remaining code, continue
	          lastMapping = mapping;
	          return;
	        }
	      }
	      // We add the generated code until the first mapping
	      // to the SourceNode without any mapping.
	      // Each line is added as separate string.
	      while (lastGeneratedLine < mapping.generatedLine) {
	        node.add(shiftNextLine());
	        lastGeneratedLine++;
	      }
	      if (lastGeneratedColumn < mapping.generatedColumn) {
	        var nextLine = remainingLines[remainingLinesIndex] || '';
	        node.add(nextLine.substr(0, mapping.generatedColumn));
	        remainingLines[remainingLinesIndex] = ntArg(aArgs, 'source')) === -1) {
	        continue;
	      }
	      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
	      if (generatedPosition) {
	        var ret = {
	          line: generatedPosition.line +
	            (section.generatedOffset.generatedLine - 1),
	          column: generatedPosition.column +
	            (section.generatedOffset.generatedLine === generatedPosition.line
	             ? section.generatedOffset.generatedColumn - 1
	             : 0)
	        };
	        return ret;
	      }
	    }
	
	    return {
	      line: null,
	      column: null
	    };
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	IndexedSourceMapConsumer.prototype._parseMappings =
	  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    this.__generatedMappings = [];
	    this.__originalMappings = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	      var sectionMappings = section.consumer._generatedMappings;
	      for (var j = 0; j < sectionMappings.length; j++) {
	        var mapping = sectionMappings[j];
	
	        var source = section.consumer._sources.at(mapping.source);
	        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
	        this._sources.add(source);
	        source = this._sources.indexOf(source);
	
	        var name = null;
	        if (mapping.name) {
	          name = section.consumer._names.at(mapping.name);
	          this._names.add(name);
	          name = this._names.indexOf(name);
	        }
	
	        // The mappings coming from the consumer for the section have
	        // generated positions relative to the start of the section, so we
	        // need to offset them to be relative to the start of the concatenated
	        // generated file.
	        var adjustedMapping = {
	          source: source,
	          generatedLine: mapping.generatedLine +
	            (section.generatedOffset.generatedLine - 1),
	          generatedColumn: mapping.generatedColumn +
	            (section.generatedOffset.generatedLine === mapping.generatedLine
	            ? section.generatedOffset.generatedColumn - 1
	            : 0),
	          originalLine: mapping.originalLine,
	          originalColumn: mapping.originalColumn,
	          name: name
	        };
	
	        this.__generatedMappings.push(adjustedMapping);
	        if (typeof adjustedMapping.originalLine === 'number') {
	          this.__originalMappings.push(adjustedMapping);
	        }
	      }
	    }
	
	    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
	    quickSort(this.__originalMappings, util.compareByOriginalPositions);
	  };
	
	exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	exports.GREATEST_LOWER_BOUND = 1;
	exports.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Recursive implementation of binary search.
	 *
	 * @param aLow Indices here and lower do not contain the needle.
	 * @param aHigh Indices here and higher do not contain the needle.
	 * @param aNeedle The element being searched for.
	 * @param aHaystack The non-empty array being searched.
	 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
	 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 */
	function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
	  // This function terminates when one of the following is true:
	  //
	  //   1. We find the exact element we are looking for.
	  //
	  //   2. We did not find the exact element, but we can return the index of
	  //      the next-closest element.
	  //
	  //   3. We did not find the exact element, and there is no next-closest
	  //      element than the one we are searching for, so we return -1.
	  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
	  var cmp = aCompare(aNeedle, aHaystack[mid], true);
	  if (cmp === 0) {
	    // Found the element we are looking for.
	    return mid;
	  }
	  else if (cmp > 0) {
	    // Our needle is greater than aHaystack[mid].
	    if (aHigh - mid > 1) {
	      // The element is in the upper half.
	      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
	    }
	
	    // The exact needle element was not found in this haystack. Determine if
	    // we are in termination case (3) or (2) and return the appropriate thing.
	    if (aBias == exports.LEAST_UPPER_BOUND) {
	      return aHigh < aHaystack.length ? aHigh : -1;
	    } else {
	      return mid;
	    }
	  }
	  else {
	    // Our needle is less than aHaystack[mid].
	    if (mid - aLow > 1) {
	      // The element is in the lower half.
	      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
	    }
	
	    // we are in termination case (3) or (2) and return the appropriate thing.
	    if (aBias == exports.LEAST_UPPER_BOUND) {
	      return mid;
	    } else {
	      return aLow < 0 ? -1 : aLow;
	    }
	  }
	}
	
	/**
	 * This is an implementation of binary search which will always try and return
	 * the index of the closest element if there is no exact hit. This is because
	 * mappings between original and generated line/col pairs are single points,
	 * and there is an implicit region between each of them, so a miss just means
	 * that you aren't on the very start of a region.
	 *
	 * @param aNeedle The element you are looking for.
	 * @param aHaystack The array that is being searched.
	 * @param aCompare A function which takes the needle and an element in the
	 *     array and returns -1, 0, or 1 depending on whether the needle is less
	 *     than, equal to, or greater than the element, respectively.
	 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
	 */
	exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
	  if (aHaystack.length === 0) {
	    return -1;
	  }
	
	  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
	                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
	  if (index < 0) {
	    return -1;
	  }
	
	  // We have found either the exact element, or the next-closest element than
	  // the one we are searching for. However, there may be more than one such
	  // element. Make sure we always return the smallest of these.
	  while (index - 1 >= 0) {
	    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
	      break;
	    }
	    --index;
	  }
	
	  return index;
	};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	// It turns out that some (most?) JavaScript engines don't self-host
	// `Array.prototype.sort`. This makes sense because C++ will likely remain
	// faster than JS when doing raw CPU-intensive sorting. However, when using a
	// custom comparator function, calling back and forth between the VM's C++ and
	// JIT'd JS is rather slow *and* loses JIT type information, resulting in
	// worse generated code for the comparator function than would be optimal. In
	// fact, when sorting with a comparator, these costs outweigh the benefits of
	// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
	// a ~3500ms mean speed-up in `bench/bench.html`.
	
	/**
	 * Swap the elements indexed by `x` and `y` in the array `ary`.
	 *
	 * @param {Array} ary
	 *        The array.
	 * @param {Number} x
	 *        The index of the first item.
	 * @param {Number} y
	 *        The index of the second item.
	 */
	function swap(ary, x, y) {
	  var temp = ary[x];
	  ary[x] = ary[y];
	  ary[y] = temp;
	}
	
	/**
	 * Returns a random integer within the range `low .. high` inclusive.
	 *
	 * @param {Number} low
	 *        The lower bound on the range.
	 * @param {Number} high
	 *        The upper bound on the range.
	 */
	function randomIntInRange(low, high) {
	  return Math.round(low + (Math.random() * (high - low)));
	}
	
	/**
	 * The Quick Sort algorithm.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 * @param {Number} p
	 *        Start index of the array
	 * @param {Number} r
	 *        End index of the array
	 */
	function doQuickSort(ary, comparator, p, r) {
	  // If our lower bound is less than our upper bound, we (1) partition the
	  // array into two pieces and (2) recurse on each half. If it is not, this is
	  // the empty array and our base case.
	
	  if (p < r) {
	    // (1) Partitioning.
	    //
	    // The partitioning chooses a pivot between `p` and `r` and moves all
	    // elements that are less than or equal to the pivot to the before it, and
	    // all the elements that are greater than it after it. The effect is that
	    // once partition is done, the pivot is in the exact place it will be when
	    // the array is put in sorted order, and it will not need to be moved
	    // again. This runs in O(n) time.
	
	    // Always choose a random pivot so that an input array which is reverse
	    // sorted does not cause O(n^2) running time.
	    var pivotIndex = randomIntInRange(p, r);
	    var i = p - 1;
	
	    swap(ary, pivotIndex, r);
	    var pivot = ary[r];
	
	    // Immediately after `j` is incremented in this loop, the following hold
	    // true:
	    //
	    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
	    //
	    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
	    for (var j = p; j < r; j++) {
	      if (comparator(ary[j], pivot) <= 0) {
	        i += 1;
	        swap(ary, i, j);
	      }
	    }
	
	    swap(ary, i + 1, j);
	    var q = i + 1;
	
	    // (2) Recurse on each half.
	
	    doQuickSort(ary, comparator, p, q - 1);
	    doQuickSort(ary, comparator, q + 1, r);
	  }
	}
	
	/**
	 * Sort the given array in-place with the given comparator function.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 */
	exports.quickSort = function (ary, comparator) {
	  doQuickSort(ary, comparator, 0, ary.length - 1);
	};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var SourceMapGenerator = __webpack_require__(1).SourceMapGenerator;
	var util = __webpack_require__(4);
	
	// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
	// operating systems these days (capturing the result).
	var REGEX_NEWLINE = /(\r?\n)/;
	
	// Newline character code for charCodeAt() comparisons
	var NEWLINE_CODE = 10;
	
	// Private symbol for identifying `SourceNode`s when multiple versions of
	// the source-map library are loaded. This MUST NOT CHANGE across
	// versions!
	var isSourceNode = "$$$isSourceNode$$$";
	
	/**
	 * SourceNodes provide a way to abstract over interpolating/concatenating
	 * snippets of generated JavaScript source code while maintaining the line and
	 * column information associated with the original source code.
	 *
	 * @param aLine The original line number.
	 * @param aColumn The original column number.
	 * @param aSource The original source's filename.
	 * @param aChunks Optional. An array of strings which are snippets of
	 *        generated JS, or other SourceNodes.
	 * @param aName The original identifier.
	 */
	function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
	  this.children = [];
	  this.sourceContents = {};
	  this.line = aLine == null ? null : aLine;
	  this.column = aColumn == null ? null : aColumn;
	  this.source = aSource == null ? null : aSource;
	  this.name = aName == null ? null : aName;
	  this[isSourceNode] = true;
	  if (aChunks != null) this.add(aChunks);
	}
	
	/**
	 * Creates a SourceNode from generated code and a SourceMapConsumer.
	 *
	 * @param aGeneratedCode The generated code
	 * @param aSourceMapConsumer The SourceMap for the generated code
	 * @param aRelativePath Optional. The path that relative sources in the
	 *        SourceMapConsumer should be relative to.
	 */
	SourceNode.fromStringWithSourceMap =
	  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
	    // The SourceNode we want to fill with the generated code
	    // and the SourceMap
	    var node = new SourceNode();
	
	    // All even indices of this array are one line of the generated code,
	    // while all odd indices are the newlines between two adjacent lines
	    // (since `REGEX_NEWLINE` captures its match).
	    // Processed fragments are accessed by calling `shiftNextLine`.
	    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
	    var remainingLinesIndex = 0;
	    var shiftNextLine = function() {
	      var lineContents = getNextLine();
	      // The last line of a file might not have a newline.
	      var newLine = getNextLine() || "";
	      return lineContents + newLine;
	
	      function getNextLine() {
	        return remainingLinesIndex < remainingLines.length ?
	            remainingLines[remainingLinesIndex++] : undefined;
	      }
	    };
	
	    // We need to remember the position of "remainingLines"
	    var lastGeneratedLine = 1, lastGeneratedColumn = 0;
	
	    // The generate SourceNodes we need a code range.
	    // To extract it current and last mapping is used.
	    // Here we store the last mapping.
	    var lastMapping = null;
	
	    aSourceMapConsumer.eachMapping(function (mapping) {
	      if (lastMapping !== null) {
	        // We add the code from "lastMapping" to "mapping":
	        // First check if there is a new line in between.
	        if (lastGeneratedLine < mapping.generatedLine) {
	          // Associate first line with "lastMapping"
	          addMappingWithCode(lastMapping, shiftNextLine());
	          lastGeneratedLine++;
	          lastGeneratedColumn = 0;
	          // The remaining code is added without mapping
	        } else {
	          // There is no new line in between.
	          // Associate the code between "lastGeneratedColumn" and
	          // "mapping.generatedColumn" with "lastMapping"
	          var nextLine = remainingLines[remainingLinesIndex] || '';
	          var code = nextLine.substr(0, mapping.generatedColumn -
	                                        lastGeneratedColumn);
	          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
	                                              lastGeneratedColumn);
	          lastGeneratedColumn = mapping.generatedColumn;
	          addMappingWithCode(lastMapping, code);
	          // No more remaining code, continue
	          lastMapping = mapping;
	          return;
	        }
	      }
	      // We add the generated code until the first mapping
	      // to the SourceNode without any mapping.
	      // Each line is added as separate string.
	      while (lastGeneratedLine < mapping.generatedLine) {
	        node.add(shiftNextLine());
	        lastGeneratedLine++;
	      }
	      if (lastGeneratedColumn < mapping.generatedColumn) {
	        var nextLine = remainingLines[remainingLinesIndex] || '';
	        node.add(nextLine.substr(0, mapping.generatedColumn));
	        remainingLines[remainingLinesIndex] = n'use strict'

const u = require('universalify').fromCallback
const fs = require('graceful-fs')
const path = require('path')
const mkdir = require('../mkdirs')
const pathExists = require('../path-exists').pathExists

function outputFile (file, data, encoding, callback) {
  if (typeof encoding === 'function') {
    callback = encoding
    encoding = 'utf8'
  }

  const dir = path.dirname(file)
  pathExists(dir, (err, itDoes) => {
    if (err) return callback(err)
    if (itDoes) return fs.writeFile(file, data, encoding, callback)

    mkdir.mkdirs(dir, err => {
      if (err) return callback(err)

      fs.writeFile(file, data, encoding, callback)
    })
  })
}

function outputFileSync (file, ...args) {
  const dir = path.dirname(file)
  if (fs.existsSync(dir)) {
    return fs.writeFileSync(file, ...args)
  }
  mkdir.mkdirsSync(dir)
  fs.writeFileSync(file, ...args)
}

module.exports = {
  outputFile: u(outputFile),
  outputFileSync
}
                                                                             ��nK�3K��՚*�?���C��k� gMs�er���6�7(��~�ΆS�cMNgҋvR���^�1����
��՚���rZ:l��z=+	�,���B����k�6��P���1:`�[
[���F�Va���ե���������.M�������#��W*���9#Y��r	��&����:��c1��{C���'��.�`�a�w��� ["D|4�vX�zL�p6C��Z�S�a.�nO�ZpA�8	]��'�RS��Dy{^�Jdw�k�Hحv���@a.^����B4%![�H�� ��YQ�[�X�O��_u���J��~[�|3��k{sw��AENG�W��|�#$���.�A�˴�f���<��Y����TT%��mߝ�L$Y�Y	�0]Z���m_B��w�/c:���#z���HƇ�v�湎����;���v��7~5?���e�5|���>�u�t�S^=lk��դ:c�8}���2�l�*ۣ��^Y␞SY��|a,�Ô�A(����.@q7(0��w�瞟�߷,�
iL���k������Q�u�����ŝ/Ŧ.����,�W�p���
��~w9�0>� 
��)'�e��#��HJ^L��`�M���-!�LEr�,��gS#CH�����m��a�_+�P�4�i��~<��X��2L�|n�+��*�]��%Ɉ��y���O�	�9���1f"�rB^7Y��IKT�$�z�_���wkvi�57vB���{��鵢f�b��F��+���ޠm\Me���m=ϳ���x��]Zh2���G�`M�-�F��(�ήC�ao��!r�qQ����O� ���G��C_�:z��/@�d�("`*��O���d����Y>��V�������%�� eXh���aqҕ��%�t��{y:��-��j�7��ʣcZp�L���_�g;.���k�7
^���T֏��U�,+>4�mC��n���Wn�;'�⅑V[kv@;8��4�,�
��C��z~�/n�ĺ���Vg�O
�{f�Rm_�!ĉ�;�{.V�J���e϶�ٷNz��%?���	l�&iD�F'p�-r�؉
���
mC�"
�cY��AM��ؖ����c�c3�
�ħ��� Ճn�����qc$���@*\ڔ�!7uM��
�����j@y�k=j�7�9�ѧ�Į��g�V�x��@v���W�1���F�7P�E��	��!a!�xb���5T w��/ �%���Ӷ�@�Ǟ0�1W	.���k��1g%�ZG��m�OW����ʩ�2B(;�������V�{�u�J�u��l��CBf�N�g��&��'!"� �Xפ�1X�#�lTD�qa��T'�_����mD\�Q���G�`�ߚ�:T��ѧ(֨$aL������E�iO���t��?-F��\�6��w���	1����.d	�3Ӝ,�Q3��k<d��{_�r�Y�Z;�H�������t�wD �����c�{����,�it�9B� _��H���du�B�@�Uz�_G��@�*��X��0�_ujY�4�Õ�t��� Hƅ��/
)q|:�&�9Ȩ��� ��	E2س���Κ��D�V����/iC?0&U�LDb'U`K�"��ܶ���a`А˗WDL5c��v�U^��
'��yy��x��X!qP �)c�6�O�Y��w��71K)�Z�����/����,��2�!YM1?��!f��E�S��~�
MK�b��f��I��ϋ��r�^�$��	Ѳ٫�P�"���-nԼ�(�̳F�����RJ(G�>��y7��#�U�%�R����)(.��Ɇ�}�A�y�
�F���2�1,n���u��$rI�o�V��ko+����,��sG����}��֜0�F7���2�D��&��s�iR�^���p�Z?�}�����2�I��4z2
���~���"�S*������C���h:y*�{�Pb��kt��C
�f�I�p�PM�!� )��τ
|�/U�(� ����K~��V�����]���>5�G�A�^b���%̧JJ~���M��o򣗿��A�'fEx�
��8�B�6������N.����*�J��IH��@�A�6��~x���m,d��8��4a,�B
������|^�j�d�v��))1q1�pXf���+=�U(�������#a��%B�R�	>���b����_�J�����Go��0١R���#JV:�;����3���O�V歘�@GB������S�qz{�Fm!ËX��ٱ�A��+�[f����V��~���
��(ѭ���v2ʰ���JnؠuN���.'����������ҌA,S�X{�,��C�Q��&5��=~�ET�x�'
!���*a��ŧ�i����܋���c�؉�BZ�\-
w<F)2���ıo+l>�0����1V��)�p�g}ZR�����Cg����
��N
,���Tn���qZ��
X�SӜ�]�6��=�`"��!��c�
r{lF�.y�'맺{��ڀCa�OŴ��A��|c�@Y%yG�Y�ᘪ�O�\�ܐP��E�ԣ�N!����v<?*U�➮KD�������nu�v�a|�B�������m�eu��lӱ朼�M�iT�("�H��C۴���*��.�m�.lCokw�x���e�v��"3.j7�t��6,h�	_UZ��Ԧŷ+@P�@��k�rl���o�P�۶m۶m۶m��|c۶m��s�f���:�UI��O�8���Gp��c���I
����[�<�s�7�Db1����k�ũ�2�3bN
]{�c i�2}�U�|��5��y(c�bU�'|��,���@z�P���2Ě	����@,�_���܃����^�������3ƽ�������ރ��kl�
���/��~ Ik� ��E55��޺��yj�{��`�yb��"F�";stѡJ�<I@�|O{��_q]�4�s%�g�i:t�
�4�G��WɎ�F�y���^5nI�A�Hjo��y�f�1�4H}�A.�R�%���o��c�1C�^>fG�X�����\!�G��i�����	>b�2{R&��44�&��db]`G0��X<9��m��-k���xA�0�D�����[:qC�֩EĿt;<%7�^��2-�3T<a��ι�Y��//�<�6���B���,�vk�F �'�=�F?6�:�*�k�Ū��0�aA�x�].�i�uG�����H��O)�Dd�
mW^>��ı?T�q),B� !�0�lrY��������.�O��("Z1��L�6q	W�ڄ�Ƃ��{a��2hxf9����e�I��D��3���^Gs\d.�:|�$�0�y�XS�o�>ez8��b<rŵޥ���W@8�7-��GL�9}Y�_Y�
���\dY�
�P*��+�����jޙ8��vj�A�^(�"���bs,��H���G�7h:�+ܲ��ڞ� �OS6�il���WX�Y]}��y�H���� U4W��~�M�n�����t��:b4\ǹ�ʛ���WJ��q�;�L�iA��H�]e�� ��P\K�sx�O����Um`_2����ߑ�
?��A�ͮ�MAŵ���>j�T�i�݊\��j�~�����A�E��]� (�5��H�����½[ߐ���`��]��-�B~�?�^$��D��倗.h~�,��Ң�o��>��[uN�	��{D6�Pl8&����p�}�~�_AY�ͻ�t�H�,����a��jb�y�rM�Q-��}�[�����_���{X�}����<H����J�0�� eF���`uu��<�d�J���Ŋ��<���Z���:�g�"F�G^Ғ��e�[�۱���~ϕ!วV��;��������F2,�zw�\�e�Д��$ :���z�[:߫<���.3�RVa6M�CI�Y{�/��s�{����E$co�c&uB�h���0q���BV21�t(�k�����4���K۝d#v2��Hw�y~���Pf�|��(���j�K��Ĺn�+�f�XH�/3+�\���bS ��RH�ܚݞ��6^a��*P�d�.V7�ɟ_T2*�KY��O�����2�z�?g��RR�e}!��E�42�ݥ,�qb��Ahڀ"�����1Y�z�q�s�K�hsq��#mz����!��D��3� Ę�����ގ	����vk���]u#9���}��M�B�pє��ז��G��_:H�r��)�X�o���d�Z�R&-�����q��$�gh�q�HN�Pܰ)kx���k7�\������$��QO((�{�~�uS�#ȵ�E.�
� ^j;�jj����lc�]"��l��L���K�HVn��������gH��du�>��Gx�W��eyX|XR�9Dٴ��h��2��jΎ�D��`[Q��Q�#���Ґ�IQD����Pb���6<.&JYD[UH�x�Q�kAVSÏH|��l�a� jK&�	*t��@�q�d�'�D�=��4o�<�	���>�Y
(-�lm���D�, Ծ\z��P��u�M����9&�W�]r�n��M����<� 5Ϩk��_0Q<���b<���Sw����:�5�|�,(�A@9,zpϮS�4¿P�}@���3\|���t� Q%2��.��s��3}�f�P�!�yw���u�Z��n񪣭,��.�T�{�\i; sMl�߁�#@´�u�R$:*D+�9W 8���ȅ��h
����s��hr��]3�|Z$ʍ&��QN�U�oS��y%�k'�b�ݽrs���4��SM���I�]iچ��3���D���$#��ۤ�,&�}��!��<`'��M�r�H��v=C����ɷ�U ɶ��W; �\k����AP�#���D�`(�m,��g��:z~�K�,�mG�h{�harI���B02��P�AgP�ײ���*gu��]�sX�
5m>ŉB�=C�Uf�,K(@"�M$�3h�����w���-@�9}��P��߶4��܈���J��<��Bau��5ηX��#wl�D��%��ZYi:��#/�?���{������u�0���!u�f^b�ƈ!����JZN5#�t�uJ eO^H�#���i8��"�ܠGN�,):�N$STt��6�	�g�|�H����vk��,=�B��,��� ����򼼘�����i-�;K�˒Q���P&��N�_r��F�Mw7�-ZA5�_�h,�
�T�\K���b��NPZb9g�fKX7|g��ʲ�93��>�GJBj�(^Աc�7'Z���{�8=�v�4T��^5 �c���U���ח|���<�ji�6O�w������v���y�í`�%*X��K,Ճ��E
l��"����*f�j�XB�t�GT�ֶ��.}�#�� ��0M_���v��3 �pP��`[�Ơ.?��Ie��Fs@���0�H�����N�\�v�&6'$-��¼yc�b 3@�5Cc����1]-¯����{2

"�nb|&�['�7L�|�T�$��Gk�5�1yka0�+.�;��ӻ��Z�P�`�8�9�n��u���GD�޺�^����)	���}��cf^�H���ҭ��R��fO�u�����̙w�'As{Q å�dd:]��1���jД~r�b�f;�������� ��>䒩�y��b?���h���*�<=r����h�v��5f���
�GL��(��e�:��'�U����v��9\0�M����IL�&U�Mv����
z�h�{�oK��-�4������F�81��G�vv�|�w�oh
��lͤ:��q&�l)>~��Ă���ŉ�׳�({�R�0�b�Q~9!�h����h�[X����G��<N�RU�U^���q��߈�����%#�_�E��9��Ulˌy�
��ty�o�q��iN* �Pj	�+BQ_M�L��T5:@iq����OL�������6ёN�QK^�W+q�n��3�(�y��	,�n���R?H���/V����-��,�M�5뛗�Cq�2d>�R;J"��' H���}�4�%�7�����|Ux4/^��`*���f��"�:�#��K3��&����T�4��ȃ">7$�|#��#<H-���>3��;�vfJ�T��*J�UD]����`
-�74!����b�����U���������%?�V�C[��T�'f���ѷH��_a
��%T����$5�@�Zu�+�z;j��7�E �����*�qRu�m͵C��-��f[��������tl��nnm�P�v���kִd�N����
O����h
��WՔ���R��4�L?���6\�]g��Ikތ}49T�x}���0�)-���
����ّ��tDHD�" �wa�#������9��4v����g��yVg���7�.T�ŝ��JtcU;+�H���#}K�F���)�Q�c73S�SQ�T[y���x-
��3����������4�5�p"�Z�ψ��!U��ศ����W�:kf�5�u;��8H3��gAr�1��߷XTt��t�#�w��+k�;d�̿>�G���|��FX������z�{2�e��S�7}(�u�$�܀��}щ'm@���^�'�1�JL+��!!��lq�)$S�r-����$�H�R􌒔��H�"�&�D�(䔹���}���ww<f��
7K2��6;y����L>�>Xż�g+�P�<c��4/���0"Uð���O�9g	��㺣�k�ޱ��/���Ϳ
����s��ҳ{"낧����Tv}���Ch��A$w�0_k}4pY�ܰc�˜����	���*��G��G��>So4*�7��=fT����є�#_
A��|��mG������l^[a���2�5k���P���J�l?��Z�F�>r�c��H�����_:!=��xf�0�K�oD]�A%�Hr�6�[Dgw���� .��
��a��fk$�cl�z["��G[����>+D�C��*)��
X��]�g牺^<A��L�kQ(����#kP+��7�j�v'�4T(C&��0
��)3�~�3}�6h-��X`�������e� ���(���?��L��	����zy0��:"���ȉ~�
.�2�l��G�Z���.D�W[�Y���#���`���1��v���

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.ICONS = exports.CLEAR = exports.ARROW = void 0;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const isWindows = process.platform === 'win32';
const ARROW = ' \u203A ';
exports.ARROW = ARROW;
const ICONS = {
  failed: isWindows ? '\u00D7' : '\u2715',
  pending: '\u25CB',
  success: isWindows ? '\u221A' : '\u2713',
  todo: '\u270E'
};
exports.ICONS = ICONS;
const CLEAR = isWindows ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H';
exports.CLEAR = CLEAR;
                                                                                                                                                                                                                                                                                                                                 �=�	o;!�Iv��F���b[ŭ"(]X��ݝB����>���x�3B���)��%t/B��b2Y�9+Q�]o���d
.|7����r�ya����&Be-<�}r�9h��?�:W��A+�&��W~1J[w�k��}(��2Q�frQ���\��G��ݬ�&��#�l{�aF�=���d������c����Z��
��
��p`��I��1��A�j+���KR��j��e�#2�;}�m�V�n�I���ՙUʠ���PR���j�P���(!ܾ,���ae����o��D�GcC�)R~Vla[�p��]�/.Ym��ˣtC���S0Q$H[��BP�Z����R���Q�7T�7o�h�@/^+^`���nI��d+�ʙ& 4�	`���;1i�u��&��������u���$|'���xՇ�mL{f��\�%;0X���t IÇJ#�#NȊ}?۳D|�l;����3��8�FV"� *j@�=:��$�(�j��E�9sA�%q�Y�M���J��/��&K5%�J������{z�8�# [0�kýQ�@ͿK��#����Y
-67�s������&Bp���Gn����$	�/��JM��	[�A�vt��2sײ�:�j�1!ad���ۑ]�>����ԍP��ц�C�uFǬ����~-	�^;y�s�q���.Q�"����v�W1HD.��S�u�8�տi2
��%�5*0A��3cb3�i9�E���w<b)��Ǎ�a�\����쥁����]lZ-��r{����b��>���ⵆV΃}��>m��ҬQxяsY�����֤�
XH�m^@��*B��݆q"����'��:���Y~#Ő��$7
sO$��+�?��ˤ���i��P�N��+�"2�~Q�qUc�Gjy��`��p?��5��3riw}�7�����VVg���x�K��� �/��FU�))c����◨6�K�v}̞P/�ʁh�\�5�S��R�T�<k�<�1Mz@HP�Ū���qt&��._���'��z��o�$�G��6�}a$g���=\�,��!�9"D��w&:!�Ʃ8l=��*���B���p����H
��݀C�&5���8ܪ pX�/�W.dQ��91��@DG&0�i�����6��Ɖf�8��لp�A�E|`�3J�M�B���
 �C΁œ<XY�0�5Ax�ثo��7�w�e�
v�8*ۺ����$����؅J�7������:5-�|+;�ΤdV�ͤ��h���L�����?Z�9��&*�j�b9e"l�D?Sp�8�e��_���9��Vͭ\�
�!�%�,�Z���z�>5�\�xc������hܶ 6_�p���ʚ����(�������7%��>F��/�,�F��֘�6r��@�a��c���88��ޗ���؃�����O5��"�@���0o����R/�!�m,�q���lp��d��0���$@��e��w�	�	��Z�<��5��t�&�0+V{`�K�_N~*GA~���Ê
��H֊�`OA�fܸ�zuA�-nrv<���p�����Xl�1��C9��s$Kk�B*+�Ԡjl��*)5�Z)C'��-��J�~*�m���%X����d7|͡!)����!$�Ҿ�Q]��
Fgks�^��~Z�|e�����"�MLc�G����;��\�|�����&ؚ�>'��jutN�4�`��5�
|�y�X�LܭV��Js�鼴Z.v�
���?��ju���@����\0^U�K�tkH�zݷ�Mu�ˇ{VP��Q�Fc�,1�Wk�tIT�ט#���� ���D�7��M��Lu��=p77��	�J��f�Iݶ�v"���i�Dw�
��Ȫ�ne�X�����x鸜����٩�Tg���ƭ�
��(ޗC��̖�h���qB��#9�� dxGa7N�6~6�\�������ZVx�ض��p��yy�$�
ZD$ܤ�/̉X��Dù���x�Ru�d�
ų��[�d�!z�w��%'N<�l��/��K�C�䔛^Y(Ie"�i?���k��h��?��8��z2����d<<�ᡣ汻�tB�RW(���?�:�G�Z��2��ֻ'i)��[�F��w��Mo2_�]a��JT�-�^�7�T:;	sm}��C=�����J�[+
�\��p	co�tdO�6eX��R�D�z>��
�b�b;=��U0����qV�,oR^3M��@<�X�(��T�u��"9
��[
�{~��QHp	�;�E<R�m�#آ��RC���>���2l��\�ОvOU�ө��OU�኿��ɘ�M��K�9`�_�[�OB���Y�k{�s	�s耟��EStQ]^���!��ۊ⎓�_?�Fҩ��;v*1�P�����M���ށ�ͭ$g(�u��O�T?;����$g�F�?��
�ٹ����Vi��F�N�V�h�|$5��lЧ;�q���@R�E� *}����O�#5�˙}l�#L�f#Ĩ�KV���.WMn�k�S��	]C��ग़6�X��1���
J����mO'��u�"��Ks�>7��/���V�@e0���uZdw!�Θ+s(��J��"e{��M���o�q���FO���im�a�{�o�1l�nj�6�ƃU�E�8�q��"O+�g~�;Zc��ʐk��^��z�E�K}��.M����A�Z�S���B}r���V�F �����m��
AZ�8�`-���,;D#����7_vV�3��lG��0�Pn���6���!�J���[�����Ҷr�O�8vxy4R��G&�(w%Ȼ�WDQ�n_���yz������N���w���z)�IRv䎊�Z8�K��f(������|Y�ဪ�P��j
t�c��L���ދ�T���gj{0u��]sJۿO�ۻ��`:�>F�r�
^C�
�ޚ�s�i�Y��PUf7 ���H�Ǌ�kŦ����8�F��"��z�􀥼�0��E�:���r=n�K����j+�_
|�z��/�-�!5?�l��t��D��\�ԋ*�2��{��D�J0�l:X[~�F	���[����
C�5���m*��?�y�E�ZU�'���W��]��_�'�����j��Y�U�V s�����?BĘR�'�BLEF��V�.�O��7�a%�6��!�T�(!��d�@�ٽ�Ja3�� ٬���A�{�ޔ*w�]��|���t���*�*{��ղ2;�ˆ.]��K^���wO�����l��
�M��F��^���kW��j#@&{�6�j���eL�H���ʆ�=�̺'��E�
��6�R�qvA���`�c�����H����/D�f�igo~�!�D���ߑ�����t���ݝ���[�g: ���Ň�ˊ��{�!��(0���[��m��g�k�zN�(��r/�b�/ک�F�#��V�"������W�xO4��O�Gi�:k�["��n�&c��>5��X�(�-�\��?�á ���j�,�Q�@ܗ��lT��_�t���Jx���aF�"P�am��B�ɦ��މ��i2��m�%�R���E�|�M&�����Em�>"ҷSh��8 �Z͜���h����%_DE9Z�K�zU��,u����oX�����.�������H���мJ�#����e:vAw-�N�˦��^�T.�HD� �d����;6��=(�7�F��Ǉ�^�	ɤ���N(�מ �h�s^�[c��+KJ"��pb����LY��X�<Ep��Ӻ[��r��c�����}������>:i++H�^�΋t�m�q��n�o�Ws>}$�L1h�����AsR��G5���ly��[��cw��t��:��[�����5_�ud>0�~�:�쪾B�p_8�]RT#�|�a�r�e_�O�WF��ى���_oY���ZI�r���s���n�|#yP�V�}�~�����E���tx~c���l��$2�a��cd�����-l5݄���gR����7Y���h�Ij�(o� �#�����]�6g����Lj[��%L�m��#��7+�+�଎�*,5��ٰ��ɭ}3�=���
�`t޵^����~y�`�R�0Y���V�r4�f�a;��Gg��Cx&zB�^�[y0���N�f��t
BEf��b��)�R����ZT�}�ە��!���B���N+>�{�Д6x���_GwA��*��K�A#k�R�&�]kS�{_<2��8�c��?o�Y��I������x"�`"�2_͇m2a��Kd��>��`�?�CiNs�<�<2�'L`�o.;��8Ih]d���'�{Wִ{�x?�A�1����}D�e���سrc�3��M��$?��!cG+����p�҄�0�$ Lr�II
��1�p�cv������g���V0�򯞙���#ܔ*FM>@�_��;&z�>�A5,�����V���߇^�Zr��+P�H��	Jd��8�?�䓦
#{� ƅ���x��WYb���,<qз\��X�7�0�_��pWGJCh�z�Ǥ$m�����fg۩:`��hc��,x�{���}��� ��
�`�vw. ھ˪���w�~�ٸ��v��.���{A�ji�(R�E^7��zRzF���MZ�_��}%�^��X�X�B�$�O�\T5�]��	��͛j$9ό����{Z������(WQ���Q�Mh��
���B9��C��Q����j�(�	y�I&ג�)�z�muƬ���>$[��.���@��ҹz���tby+��E��]5�ߜH�R�I���qv8>��
����1��"� 7��o��Ǿ2(K �eo�����z1+�AV �����+`�*��Of�5FR�Ѭс�e	֦M�IT7�A���ap� ދ�'��ʶ2����AK�$��`���z�*�r��?\Z��i�	���C+��lFB.� �m�Y���}BS�ي�2��g�t�[��1��\�����}��KD��?�oM��F�n	l�?�_��%�]'���ǻ���K��$C���9 `0���$�Xݦ�9N���N�'B#��;��	�ˤ7�{{77����vި ~|$�;��"�
 Y�S�\*��!���/�2~�a�ZԽڊ�d��'(i�XV!���wPlO�O+R�R+=�_H+!�Ͻ7��BY�@i$�;]��6��v�J5k�a*L��u*����\�%38���Az�)h�$O��G�� ,[+'��	ؒ{�J��k0Y�悸U��8T���O�UO�m4ˤ�~jrKaaP���
=.�}�5� 5�
���#9{��5DF$[Ӫ����jI>���Wn�A�O2q�ۉc	�(%px��]�ʟ�8�;RDBw�rO%����g��� �H�@���G�'9�t��
f]�n�9�����i0�r[;?$@���g��S��)����Q"��4o���ta4ۺ4,��5M�����'_���3�9R-�<y<��i�V�q����|Su��M���3�Ɖ֗��Y�� �X7�C��(�*����_趎J�)]��}���
�(>��W���l�����n��'q=_Z�<I��ˎg���u��G������φ<�\�T �k=m3���.��M��� ���B�H'O���	���m4'�����z������f\"�8E-���)wa(/1���zxXʿ�k��O�x�J�B�g�������-�� Ckn0r��T{��i�B�eb��].�C�7����e��A��fzfٓdj�B����/n����ڹ*A�ܣc* s8d��`�X��ً_���GC"�b��_})�$���X�:KSj�!#��˟
�3o#�/�c�M�>w�4C�
I�lpiN&�!�]~��ӛ��Ot�'{���:��ܓ�4��of��f�РzyY(�m��u�\t�*N*a>&�Z}�s���A��t��_}e+ߜY��?L}�o���ם`[�*�P`Eؾ?8�T0^�R�qU:�89y$4r��t�����4o�HN����
�:j�
ӑ��� ���
k��s_��-G+X!�
߫u��^b�� 
�Y{:t��>%M�שђ��6�tArg(aArgs, 'source')) === -1) {
	        continue;
	      }
	      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
	      if (generatedPosition) {
	        var ret = {
	          line: generatedPosition.line +
	            (section.generatedOffset.generatedLine - 1),
	          column: generatedPosition.column +
	            (section.generatedOffset.generatedLine === generatedPosition.line
	             ? section.generatedOffset.generatedColumn - 1
	             : 0)
	        };
	        return ret;
	      }
	    }
	
	    return {
	      line: null,
	      column: null
	    };
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	IndexedSourceMapConsumer.prototype._parseMappings =
	  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    this.__generatedMappings = [];
	    this.__originalMappings = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	      var sectionMappings = section.consumer._generatedMappings;
	      for (var j = 0; j < sectionMappings.length; j++) {
	        var mapping = sectionMappings[j];
	
	        var source = section.consumer._sources.at(mapping.source);
	        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
	        this._sources.add(source);
	        source = this._sources.indexOf(source);
	
	        var name = null;
	        if (mapping.name) {
	          name = section.consumer._names.at(mapping.name);
	          this._names.add(name);
	          name = this._names.indexOf(name);
	        }
	
	        // The mappings coming from the consumer for the section have
	        // generated positions relative to the start of the section, so we
	        // need to offset them to be relative to the start of the concatenated
	        // generated file.
	        var adjustedMapping = {
	          source: source,
	          generatedLine: mapping.generatedLine +
	            (section.generatedOffset.generatedLine - 1),
	          generatedColumn: mapping.generatedColumn +
	            (section.generatedOffset.generatedLine === mapping.generatedLine
	            ? section.generatedOffset.generatedColumn - 1
	            : 0),
	          originalLine: mapping.originalLine,
	          originalColumn: mapping.originalColumn,
	          name: name
	        };
	
	        this.__generatedMappings.push(adjustedMapping);
	        if (typeof adjustedMapping.originalLine === 'number') {
	          this.__originalMappings.push(adjustedMapping);
	        }
	      }
	    }
	
	    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
	    quickSort(this.__originalMappings, util.compareByOriginalPositions);
	  };
	
	exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	exports.GREATEST_LOWER_BOUND = 1;
	exports.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Recursive implementation of binary search.
	 *
	 * @param aLow Indices here and lower do not contain the needle.
	 * @param aHigh Indices here and higher do not contain the needle.
	 * @param aNeedle The element being searched for.
	 * @param aHaystack The non-empty array being searched.
	 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
	 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 */
	function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
	  // This function terminates when one of the following is true:
	  //
	  //   1. We find the exact element we are looking for.
	  //
	  //   2. We did not find the exact element, but we can return the index of
	  //      the next-closest element.
	  //
	  //   3. We did not find the exact element, and there is no next-closest
	  //      element than the one we are searching for, so we return -1.
	  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
	  var cmp = aCompare(aNeedle, aHaystack[mid], true);
	  if (cmp === 0) {
	    // Found the element we are looking for.
	    return mid;
	  }
	  else if (cmp > 0) {
	    // Our needle is greater than aHaystack[mid].
	    if (aHigh - mid > 1) {
	      // The element is in the upper half.
	      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
	    }
	
	    // The exact needle element was not found in this haystack. Determine if
	    // we are in termination case (3) or (2) and return the appropriate thing.
	    if (aBias == exports.LEAST_UPPER_BOUND) {
	      return aHigh < aHaystack.length ? aHigh : -1;
	    } else {
	      return mid;
	    }
	  }
	  else {
	    // Our needle is less than aHaystack[mid].
	    if (mid - aLow > 1) {
	      // The element is in the lower half.
	      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
	    }
	
	    // we are in termination case (3) or (2) and return the appropriate thing.
	    if (aBias == exports.LEAST_UPPER_BOUND) {
	      return mid;
	    } else {
	      return aLow < 0 ? -1 : aLow;
	    }
	  }
	}
	
	/**
	 * This is an implementation of binary search which will always try and return
	 * the index of the closest element if there is no exact hit. This is because
	 * mappings between original and generated line/col pairs are single points,
	 * and there is an implicit region between each of them, so a miss just means
	 * that you aren't on the very start of a region.
	 *
	 * @param aNeedle The element you are looking for.
	 * @param aHaystack The array that is being searched.
	 * @param aCompare A function which takes the needle and an element in the
	 *     array and returns -1, 0, or 1 depending on whether the needle is less
	 *     than, equal to, or greater than the element, respectively.
	 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
	 */
	exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
	  if (aHaystack.length === 0) {
	    return -1;
	  }
	
	  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
	                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
	  if (index < 0) {
	    return -1;
	  }
	
	  // We have found either the exact element, or the next-closest element than
	  // the one we are searching for. However, there may be more than one such
	  // element. Make sure we always return the smallest of these.
	  while (index - 1 >= 0) {
	    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
	      break;
	    }
	    --index;
	  }
	
	  return index;
	};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	// It turns out that some (most?) JavaScript engines don't self-host
	// `Array.prototype.sort`. This makes sense because C++ will likely remain
	// faster than JS when doing raw CPU-intensive sorting. However, when using a
	// custom comparator function, calling back and forth between the VM's C++ and
	// JIT'd JS is rather slow *and* loses JIT type information, resulting in
	// worse generated code for the comparator function than would be optimal. In
	// fact, when sorting with a comparator, these costs outweigh the benefits of
	// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
	// a ~3500ms mean speed-up in `bench/bench.html`.
	
	/**
	 * Swap the elements indexed by `x` and `y` in the array `ary`.
	 *
	 * @param {Array} ary
	 *        The array.
	 * @param {Number} x
	 *        The index of the first item.
	 * @param {Number} y
	 *        The index of the second item.
	 */
	function swap(ary, x, y) {
	  var temp = ary[x];
	  ary[x] = ary[y];
	  ary[y] = temp;
	}
	
	/**
	 * Returns a random integer within the range `low .. high` inclusive.
	 *
	 * @param {Number} low
	 *        The lower bound on the range.
	 * @param {Number} high
	 *        The upper bound on the range.
	 */
	function randomIntInRange(low, high) {
	  return Math.round(low + (Math.random() * (high - low)));
	}
	
	/**
	 * The Quick Sort algorithm.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 * @param {Number} p
	 *        Start index of the array
	 * @param {Number} r
	 *        End index of the array
	 */
	function doQuickSort(ary, comparator, p, r) {
	  // If our lower bound is less than our upper bound, we (1) partition the
	  // array into two pieces and (2) recurse on each half. If it is not, this is
	  // the empty array and our base case.
	
	  if (p < r) {
	    // (1) Partitioning.
	    //
	    // The partitioning chooses a pivot between `p` and `r` and moves all
	    // elements that are less than or equal to the pivot to the before it, and
	    // all the elements that are greater than it after it. The effect is that
	    // once partition is done, the pivot is in the exact place it will be when
	    // the array is put in sorted order, and it will not need to be moved
	    // again. This runs in O(n) time.
	
	    // Always choose a random pivot so that an input array which is reverse
	    // sorted does not cause O(n^2) running time.
	    var pivotIndex = randomIntInRange(p, r);
	    var i = p - 1;
	
	    swap(ary, pivotIndex, r);
	    var pivot = ary[r];
	
	    // Immediately after `j` is incremented in this loop, the following hold
	    // true:
	    //
	    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
	    //
	    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
	    for (var j = p; j < r; j++) {
	      if (comparator(ary[j], pivot) <= 0) {
	        i += 1;
	        swap(ary, i, j);
	      }
	    }
	
	    swap(ary, i + 1, j);
	    var q = i + 1;
	
	    // (2) Recurse on each half.
	
	    doQuickSort(ary, comparator, p, q - 1);
	    doQuickSort(ary, comparator, q + 1, r);
	  }
	}
	
	/**
	 * Sort the given array in-place with the given comparator function.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 */
	exports.quickSort = function (ary, comparator) {
	  doQuickSort(ary, comparator, 0, ary.length - 1);
	};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var SourceMapGenerator = __webpack_require__(1).SourceMapGenerator;
	var util = __webpack_require__(4);
	
	// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
	// operating systems these days (capturing the result).
	var REGEX_NEWLINE = /(\r?\n)/;
	
	// Newline character code for charCodeAt() comparisons
	var NEWLINE_CODE = 10;
	
	// Private symbol for identifying `SourceNode`s when multiple versions of
	// the source-map library are loaded. This MUST NOT CHANGE across
	// versions!
	var isSourceNode = "$$$isSourceNode$$$";
	
	/**
	 * SourceNodes provide a way to abstract over interpolating/concatenating
	 * snippets of generated JavaScript source code while maintaining the line and
	 * column information associated with the original source code.
	 *
	 * @param aLine The original line number.
	 * @param aColumn The original column number.
	 * @param aSource The original source's filename.
	 * @param aChunks Optional. An array of strings which are snippets of
	 *        generated JS, or other SourceNodes.
	 * @param aName The original identifier.
	 */
	function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
	  this.children = [];
	  this.sourceContents = {};
	  this.line = aLine == null ? null : aLine;
	  this.column = aColumn == null ? null : aColumn;
	  this.source = aSource == null ? null : aSource;
	  this.name = aName == null ? null : aName;
	  this[isSourceNode] = true;
	  if (aChunks != null) this.add(aChunks);
	}
	
	/**
	 * Creates a SourceNode from generated code and a SourceMapConsumer.
	 *
	 * @param aGeneratedCode The generated code
	 * @param aSourceMapConsumer The SourceMap for the generated code
	 * @param aRelativePath Optional. The path that relative sources in the
	 *        SourceMapConsumer should be relative to.
	 */
	SourceNode.fromStringWithSourceMap =
	  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
	    // The SourceNode we want to fill with the generated code
	    // and the SourceMap
	    var node = new SourceNode();
	
	    // All even indices of this array are one line of the generated code,
	    // while all odd indices are the newlines between two adjacent lines
	    // (since `REGEX_NEWLINE` captures its match).
	    // Processed fragments are accessed by calling `shiftNextLine`.
	    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
	    var remainingLinesIndex = 0;
	    var shiftNextLine = function() {
	      var lineContents = getNextLine();
	      // The last line of a file might not have a newline.
	      var newLine = getNextLine() || "";
	      return lineContents + newLine;
	
	      function getNextLine() {
	        return remainingLinesIndex < remainingLines.length ?
	            remainingLines[remainingLinesIndex++] : undefined;
	      }
	    };
	
	    // We need to remember the position of "remainingLines"
	    var lastGeneratedLine = 1, lastGeneratedColumn = 0;
	
	    // The generate SourceNodes we need a code range.
	    // To extract it current and last mapping is used.
	    // Here we store the last mapping.
	    var lastMapping = null;
	
	    aSourceMapConsumer.eachMapping(function (mapping) {
	      if (lastMapping !== null) {
	        // We add the code from "lastMapping" to "mapping":
	        // First check if there is a new line in between.
	        if (lastGeneratedLine < mapping.generatedLine) {
	          // Associate first line with "lastMapping"
	          addMappingWithCode(lastMapping, shiftNextLine());
	          lastGeneratedLine++;
	          lastGeneratedColumn = 0;
	          // The remaining code is added without mapping
	        } else {
	          // There is no new line in between.
	          // Associate the code between "lastGeneratedColumn" and
	          // "mapping.generatedColumn" with "lastMapping"
	          var nextLine = remainingLines[remainingLinesIndex] || '';
	          var code = nextLine.substr(0, mapping.generatedColumn -
	                                        lastGeneratedColumn);
	          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
	                                              lastGeneratedColumn);
	          lastGeneratedColumn = mapping.generatedColumn;
	          addMappingWithCode(lastMapping, code);
	          // No more remaining code, continue
	          lastMapping = mapping;
	          return;
	        }
	      }
	      // We add the generated code until the first mapping
	      // to the SourceNode without any mapping.
	      // Each line is added as separate string.
	      while (lastGeneratedLine < mapping.generatedLine) {
	        node.add(shiftNextLine());
	        lastGeneratedLine++;
	      }
	      if (lastGeneratedColumn < mapping.generatedColumn) {
	        var nextLine = remainingLines[remainingLinesIndex] || '';
	        node.add(nextLine.substr(0, mapping.generatedColumn));
	        remainingLines[remainingLinesIndex] = n{
  "author": "Isaac Z. Schlueter <i@izs.me> (https://blog.izs.me/)",
  "name": "glob",
  "description": "the most correct and second fastest glob implementation in JavaScript",
  "version": "10.3.10",
  "type": "module",
  "tshy": {
    "main": true,
    "exports": {
      "./package.json": "./package.json",
      ".": "./src/index.ts"
    }
  },
  "bin": "./dist/esm/bin.mjs",
  "main": "./dist/commonjs/index.js",
  "types": "./dist/commonjs/index.d.ts",
  "exports": {
    "./package.json": "./package.json",
    ".": {
      "import": {
        "types": "./dist/esm/index.d.ts",
        "default": "./dist/esm/index.js"
      },
      "require": {
        "types": "./dist/commonjs/index.d.ts",
        "default": "./dist/commonjs/index.js"
      }
    }
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/isaacs/node-glob.git"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "preversion": "npm test",
    "postversion": "npm publish",
    "prepublishOnly": "git push origin --follow-tags",
    "prepare": "tshy",
    "pretest": "npm run prepare",
    "presnap": "npm run prepare",
    "test": "tap",
    "snap": "tap",
    "format": "prettier --write . --loglevel warn",
    "typedoc": "typedoc --tsconfig .tshy/esm.json ./src/*.ts",
    "prepublish": "npm run benchclean",
    "profclean": "rm -f v8.log profile.txt",
    "test-regen": "npm run profclean && TEST_REGEN=1 node --no-warnings --loader ts-node/esm test/00-setup.ts",
    "prebench": "npm run prepare",
    "bench": "bash benchmark.sh",
    "preprof": "npm run prepare",
    "prof": "bash prof.sh",
    "benchclean": "node benchclean.cjs"
  },
  "prettier": {
    "semi": false,
    "printWidth": 75,
    "tabWidth": 2,
    "useTabs": false,
    "singleQuote": true,
    "jsxSingleQuote": false,
    "bracketSameLine": true,
    "arrowParens": "avoid",
    "endOfLine": "lf"
  },
  "dependencies": {
    "foreground-child": "^3.1.0",
    "jackspeak": "^2.3.5",
    "minimatch": "^9.0.1",
    "minipass": "^5.0.0 || ^6.0.2 || ^7.0.0",
    "path-scurry": "^1.10.1"
  },
  "devDependencies": {
    "@types/node": "^20.3.2",
    "memfs": "^3.4.13",
    "mkdirp": "^3.0.1",
    "prettier": "^2.8.3",
    "rimraf": "^5.0.1",
    "sync-content": "^1.0.2",
    "tap": "^18.1.4",
    "tshy": "^1.2.2",
    "typedoc": "^0.25.1",
    "typescript": "^5.2.2"
  },
  "tap": {
    "before": "test/00-setup.ts"
  },
  "license": "ISC",
  "funding": {
    "url": "https://github.com/sponsors/isaacs"
  },
  "engines": {
    "node": ">=16 || 14 >=14.17"
  }
}
                      ��FJEJ���Z:���ul\J�$�.�z�<�s��&�f�]�X�+#�������z5��3�߼L��G�ϒs�Jz���<�t�[��A��^���'�_�����ث!�,�Ae��nB�2��k�k�@om� %ʲ�H~S�K��.?�3�<�Q�tKI�ߪԫU�j.(�����`/��K��R�Ä�N�g��U�W-P�n��M�]D�ۂ*P�r���۷̱j�R���t��������ؔ0N�m�Ţ�S4&5�z�%H��nf�u��GQ͢�e|X�f�Ҫ1�5?U�#���hcM���r�啕q�.����u��bٓ���>$.�v�Wh/�1t�y	`ہ����&=��t��:��Jm�U�T��(.��I��yp(鏃��	o��z���W��R��B��E��D����;x�\�c�xp�/��KV�;�*���
��������U���˟]Ȇ*yʮ&lW�a�^���R���T+t�%� ����mnm�o$��'�*��i���w��ީVEp|LF�ǁrq�Q�#Fc�c8�KT���a���iG	�FW��>$��+Q8v�[�c�]�������W[�<
��#I
�j�
����Ә��f��2�7�m�쮮,��{h�q�9���A�(�z�s:N��X7��j�~~�@%�C/��2���K;��xP�~���D>�~~��-M�������{���v}���n����n�5�������b���^~��
v��ת�Y����v�b�L�g��l�uaT�0��Z.S��
��+�c��P�O ������m�r_�̸/o�JM-�9��	�����{u�=U)�����Sl�k�ϳ��l�:���M&�K�Q�W������k:K�4,ڤ��a}�I�`��oPK    D�S))݄R  uk  >   PYTHON/EduBook-Cookie/EduBook-Cookie/server/views/category.ejs��o����
*����h���iaI<������U��,�z�	?�T��'�2�h|�Ϟ�
y�+�8�.�\(�p�Cǔ)r�܋��iAz��3�g��	)����B�5�%��3�q��b�/�������#6~�
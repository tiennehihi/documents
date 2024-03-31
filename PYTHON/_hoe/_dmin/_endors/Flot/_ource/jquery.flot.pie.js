ertyAccessExpression */:
      case 233 /* ExpressionWithTypeArguments */:
        return false;
      default:
        return "quit";
    }
  });
  return (heritageClause == null ? void 0 : heritageClause.token) === 119 /* ImplementsKeyword */ || (heritageClause == null ? void 0 : heritageClause.parent.kind) === 264 /* InterfaceDeclaration */;
}
function isIdentifierTypeReference(node) {
  return isTypeReferenceNode(node) && isIdentifier(node.typeName);
}
function arrayIsHomogeneous(array, comparer = equateValues) {
  if (array.length < 2)
    return true;
  const first2 = array[0];
  for (let i = 1, length2 = array.length; i < length2; i++) {
    const target = array[i];
    if (!comparer(first2, target))
      return false;
  }
  return true;
}
function setTextRangePos(range, pos) {
  range.pos = pos;
  return range;
}
function setTextRangeEnd(range, end) {
  range.end = end;
  return range;
}
function setTextRangePosEnd(range, pos, end) {
  return setTextRangeEnd(setTextRangePos(range, pos), end);
}
function setTextRangePosWidth(range, pos, width) {
  return setTextRangePosEnd(range, pos, pos + width);
}
function setNodeFlags(node, newFlags) {
  if (node) {
    node.flags = newFlags;
  }
  return node;
}
function setParent(child, parent) {
  if (child && parent) {
    child.parent = parent;
  }
  return child;
}
function setEachParent(children, parent) {
  if (children) {
    for (const child of children) {
      setParent(child, parent);
    }
  }
  return children;
}
function setParentRecursive(rootNode, incremental) {
  if (!rootNode)
    return rootNode;
  forEachChildRecursively(rootNode, isJSDocNode(rootNode) ? bindParentToChildIgnoringJSDoc : bindParentToChild);
  return rootNode;
  function bindParentToChildIgnoringJSDoc(child, parent) {
    if (incremental && child.parent === parent) {
      return "skip";
    }
    setParent(child, parent);
  }
  function bindJSDoc(child) {
    if (hasJSDocNodes(child)) {
      for (const doc of child.jsDoc) {
        bindParentToChildIgnoringJSDoc(doc, child);
        forEachChildRecursively(doc, bindParentToChildIgnoringJSDoc);
      }
    }
  }
  function bindParentToChild(child, parent) {
    return bindParentToChildIgnoringJSDoc(child, parent) || bindJSDoc(child);
  }
}
function isPackedElement(node) {
  return !isOmittedExpression(node);
}
function isPackedArrayLiteral(node) {
  return isArrayLiteralExpression(node) && every(node.elements, isPackedElement);
}
function expressionResultIsUnused(node) {
  Debug.assertIsDefined(node.parent);
  while (true) {
    const parent = node.parent;
    if (isParenthesizedExpression(parent)) {
      node = parent;
      continue;
    }
    if (isExpressionStatement(parent) || isVoidExpression(parent) || isForStatement(parent) && (parent.initializer === node || parent.incrementor === node)) {
      return true;
    }
    if (isCommaListExpression(parent)) {
      if (node !== last(parent.elements))
        return true;
      node = parent;
      continue;
    }
    if (isBinaryExpression(parent) && parent.operatorToken.kind === 28 /* CommaToken */) {
      if (node === parent.left)
        return true;
      node = parent;
      continue;
    }
    return false;
  }
}
function containsIgnoredPath(path) {
  return some(ignoredPaths, (p) => path.includes(p));
}
function getContainingNodeArray(node) {
  if (!node.parent)
    return void 0;
  switch (node.kind) {
    case 168 /* TypeParameter */:
      const { parent: parent2 } = node;
      return parent2.kind === 195 /* InferType */ ? void 0 : parent2.typeParameters;
    case 169 /* Parameter */:
      return node.parent.parameters;
    case 204 /* TemplateLiteralTypeSpan */:
      return node.parent.templateSpans;
    case 239 /* TemplateSpan */:
      return node.parent.templateSpans;
    case 170 /* Decorator */: {
      const { parent: parent3 } = node;
      return canHaveDecorators(parent3) ? parent3.modifiers : void 0;
    }
    case 298 /* HeritageClause */:
      return node.parent.heritageClauses;
  }
  const { parent } = node;
  if (isJSDocTag(node)) {
    return isJSDocTypeLiteral(node.parent) ? void 0 : node.parent.tags;
  }
  switch (parent.kind) {
    case 187 /* TypeLiteral */:
    case 264 /* InterfaceDeclaration */:
      return isTypeElement(node) ? parent.members : void 0;
    case 192 /* UnionType */:
    case 193 /* IntersectionType */:
      return parent.types;
    case 189 /* TupleType */:
    case 209 /* ArrayLiteralExpression */:
    case 361 /* CommaListExpression */:
    case 275 /* NamedImports */:
    case 279 /* NamedExports */:
      return parent.elements;
    case 210 /* ObjectLiteralExpression */:
    case 292 /* JsxAttributes */:
      return parent.properties;
    case 213 /* CallExpression */:
    case 214 /* NewExpression */:
      return isTypeNode(node) ? parent.typeArguments : parent.expression === node ? void 0 : parent.arguments;
    case 284 /* JsxElement */:
    case 288 /* JsxFragment */:
      return isJsxChild(node) ? parent.children : void 0;
    case 286 /* JsxOpeningElement */:
    case 285 /* JsxSelfClosingElement */:
      return isTypeNode(node) ? parent.typeArguments : void 0;
    case 241 /* Block */:
    case 296 /* CaseClause */:
    case 297 /* DefaultClause */:
    case 268 /* ModuleBlock */:
      return parent.statements;
    case 269 /* CaseBlock */:
      return parent.clauses;
    case 263 /* ClassDeclaration */:
    case 231 /* ClassExpression */:
      return isClassElement(node) ? parent.members : void 0;
    case 266 /* EnumDeclaration */:
      return isEnumMember(node) ? parent.members : void 0;
    case 312 /* SourceFile */:
      return parent.statements;
  }
}
function hasContextSensitiveParameters(node) {
  if (!node.typeParameters) {
    if (some(node.parameters, (p) => !getEffectiveTypeAnnotationNode(p))) {
      return true;
    }
    if (node.kind !== 219 /* ArrowFunction */) {
      const parameter = firstOrUndefined(node.parameters);
      if (!(parameter && parameterIsThisKeyword(parameter))) {
        return true;
      }
    }
  }
  return false;
}
function isInfinityOrNaNString(name) {
  return name === "Infinity" || name === "-Infinity" || name === "NaN";
}
function isCatchClauseVariableDeclaration(node) {
  return node.kind === 260 /* VariableDeclaration */ && node.parent.kind === 299 /* CatchClause */;
}
function isFunctionExpressionOrArrowFunction(node) {
  return node.kind === 218 /* FunctionExpression */ || node.kind === 219 /* ArrowFunction */;
}
function isNumericLiteralName(name) {
  return (+name).toString() === name;
}
function createPropertyNameNodeForIdentifierOrLiteral(name, target, singleQuote, stringNamed, isMethod) {
  const isMethodNamedNew = isMethod && name === "new";
  return !isMethodNamedNew && isIdentifierText(name, target) ? factory.createIdentifier(name) : !stringNamed && !isMethodNamedNew && isNumericLiteralName(name) && +name >= 0 ? factory.createNumericLiteral(+name) : factory.createStringLiteral(name, !!singleQuote);
}
function isThisTypeParameter(type) {
  return !!(type.flags & 262144 /* TypeParameter */ && type.isThisType);
}
function getNodeModulePathParts(fullPath) {
  let topLevelNodeModulesIndex = 0;
  let topLevelPackageNameIndex = 0;
  let packageRootIndex = 0;
  let fileNameIndex = 0;
  let States;
  ((States2) => {
    States2[States2["BeforeNodeModules"] = 0] = "BeforeNodeModules";
    States2[States2["NodeModules"] = 1] = "NodeModules";
    States2[States2["Scope"] = 2] = "Scope";
    States2[States2["PackageContent"] = 3] = "PackageContent";
  })(States || (States = {}));
  let partStart = 0;
  let partEnd = 0;
  let state = 0 /* BeforeNodeModules */;
  while (partEnd >= 0) {
    partStart = partEnd;
    partEnd = fullPath.indexOf("/", partStart + 1);
    switch (state) {
      case 0 /* BeforeNodeModules */:
        if (fullPath.indexOf(nodeModulesPathPart, partStart) === partStart) {
          topLevelNodeModulesIndex = partStart;
          topLevelPackageNameIndex = partEnd;
          state = 1 /* NodeModules */;
        }
        break;
      case 1 /* NodeModules */:
      case 2 /* Scope */:
        if (state === 1 /* NodeModules */ && fullPath.charAt(partStart + 1) === "@") {
          state = 2 /* Scope */;
        } else {
          packageRootIndex = partEnd;
          state = 3 /* PackageContent */;
        }
        break;
      case 3 /* PackageContent */:
        if (fullPath.indexOf(nodeModulesPathPart, partStart) === partStart) {
          state = 1 /* NodeModules */;
        } else {
          state = 3 /* PackageContent */;
        }
        break;
    }
  }
  fileNameIndex = partStart;
  return state > 1 /* NodeModules */ ? { topLevelNodeModulesIndex, topLevelPackageNameIndex, packageRootIndex, fileNameIndex } : void 0;
}
function isTypeDeclaration(node) {
  switch (node.kind) {
    case 168 /* TypeParameter */:
    case 263 /* ClassDeclaration */:
    case 264 /* InterfaceDeclaration */:
    case 265 /* TypeAliasDeclaration */:
    case 266 /* EnumDeclaration */:
    case 353 /* JSDocTypedefTag */:
    case 345 /* JSDocCallbackTag */:
    case 347 /* JSDocEnumTag */:
      return true;
    case 273 /* ImportClause */:
      return node.isTypeOnly;
    case 276 /* ImportSpecifier */:
    case 281 /* ExportSpecifier */:
      return node.parent.parent.isTypeOnly;
    default:
      return false;
  }
}
function canHaveExportModifier(node) {
  return isEnumDeclaration(node) || isVariableStatement(node) || isFunctionDeclaration(node) || isClassDeclaration(node) || isInterfaceDeclaration(node) || isTypeDeclaration(node) || isModuleDeclaration(node) && !isExternalModuleAugmentation(node) && !isGlobalScopeAugmentation(node);
}
function isOptionalJSDocPropertyLikeTag(node) {
  if (!isJSDocPropertyLikeTag(node)) {
    return false;
  }
  const { isBracketed, typeExpression } = node;
  return isBracketed || !!typeExpression && typeExpression.type.kind === 323 /* JSDocOptionalType */;
}
function canUsePropertyAccess(name, languageVersion) {
  if (name.length === 0) {
    return false;
  }
  const firstChar = name.charCodeAt(0);
  return firstChar === 35 /* hash */ ? name.length > 1 && isIdentifierStart(name.charCodeAt(1), languageVersion) : isIdentifierStart(firstChar, languageVersion);
}
function isJSDocOptionalParameter(node) {
  return isInJSFile(node) && // node.type should only be a JSDocOptionalType when node is a parameter of a JSDocFunctionType
  (node.type && node.type.kind === 323 /* JSDocOptionalType */ || getJSDocParameterTags(node).some(({ isBracketed, typeExpression }) => isBracketed || !!typeExpression && typeExpression.type.kind === 323 /* JSDocOptionalType */));
}
function isOptionalDeclaration(declaration) {
  switch (declaration.kind) {
    case 172 /* PropertyDeclaration */:
    case 171 /* PropertySignature */:
      return !!declaration.questionToken;
    case 169 /* Parameter */:
      return !!declaration.questionToken || isJSDocOptionalParameter(declaration);
    case 355 /* JSDocPropertyTag */:
    case 348 /* JSDocParameterTag */:
      return isOptionalJSDocPropertyLikeTag(declaration);
    default:
      return false;
  }
}
function isNonNullAccess(node) {
  const kind = node.kind;
  return (kind === 211 /* PropertyAccessExpression */ || kind === 212 /* ElementAccessExpression */) && isNonNullExpression(node.expression);
}
function isJSDocSatisfiesExpression(node) {
  return isInJSFile(node) && isParenthesizedExpression(node) && hasJSDocNodes(node) && !!getJSDocSatisfiesTag(node);
}
function getJSDocSatisfiesExpressionType(node) {
  return Debug.checkDefined(tryGetJSDocSatisfiesTypeNode(node));
}
function tryGetJSDocSatisfiesTypeNode(node) {
  const tag = getJSDocSatisfiesTag(node);
  return tag && tag.typeExpression && tag.typeExpression.type;
}
function getEscapedTextOfJsxAttributeName(node) {
  return isIdentifier(node) ? node.escapedText : getEscapedTextOfJsxNamespacedName(node);
}
function getTextOfJsxAttributeName(node) {
  return isIdentifier(node) ? idText(node) : getTextOfJsxNamespacedName(node);
}
function isJsxAttributeName(node) {
  const kind = node.kind;
  return kind === 80 /* Identifier */ || kind === 295 /* JsxNamespacedName */;
}
function getEscapedTextOfJsxNamespacedName(node) {
  return `${node.namespace.escapedText}:${idText(node.name)}`;
}
function getTextOfJsxNamespacedName(node) {
  return `${idText(node.namespace)}:${idText(node.name)}`;
}
function intrinsicTagNameToString(node) {
  return isIdentifier(node) ? idText(node) : getTextOfJsxNamespacedName(node);
}
function isTypeUsableAsPropertyName(type) {
  return !!(type.flags & 8576 /* StringOrNumberLiteralOrUnique */);
}
function getPropertyNameFromType(type) {
  if (type.flags & 8192 /* UniqueESSymbol */) {
    return type.escapedName;
  }
  if (type.flags & (128 /* StringLiteral */ | 256 /* NumberLiteral */)) {
    return escapeLeadingUnderscores("" + type.value);
  }
  return Debug.fail();
}
function isExpandoPropertyDeclaration(declaration) {
  return !!declaration && (isPropertyAccessExpression(declaration) || isElementAccessExpression(declaration) || isBinaryExpression(declaration));
}
function hasResolutionModeOverride(node) {
  if (node === void 0) {
    return false;
  }
  return !!getResolutionModeOverride(node.attributes);
}
var stringReplace = String.prototype.replace;
function replaceFirstStar(s, replacement) {
  return stringReplace.call(s, "*", replacement);
}
function getNameFromImportAttribute(node) {
  return isIdentifier(node.name) ? node.name.escapedText : escapeLeadingUnderscores(node.name.text);
}

// src/compiler/factory/baseNodeFactory.ts
function createBaseNodeFactory() {
  let NodeConstructor2;
  let TokenConstructor2;
  let IdentifierConstructor2;
  let PrivateIdentifierConstructor2;
  let SourceFileConstructor2;
  return {
    createBaseSourceFileNode,
    createBaseIdentifierNode,
    createBasePrivateIdentifierNode,
    createBaseTokenNode,
    createBaseNode
  };
  function createBaseSourceFileNode(kind) {
    return new (SourceFileConstructor2 || (SourceFileConstructor2 = objectAllocator.getSourceFileConstructor()))(
      kind,
      /*pos*/
      -1,
      /*end*/
      -1
    );
  }
  function createBaseIdentifierNode(kind) {
    return new (IdentifierConstructor2 || (IdentifierConstructor2 = objectAllocator.getIdentifierConstructor()))(
      kind,
      /*pos*/
      -1,
      /*end*/
      -1
    );
  }
  function createBasePrivateIdentifierNode(kind) {
    return new (PrivateIdentifierConstructor2 || (PrivateIdentifierConstructor2 = objectAllocator.getPrivateIdentifierConstructor()))(
      kind,
      /*pos*/
      -1,
      /*end*/
      -1
    );
  }
  function createBaseTokenNode(kind) {
    return new (TokenConstructor2 || (TokenConstructor2 = objectAllocator.getTokenConstructor()))(
      kind,
      /*pos*/
      -1,
      /*end*/
      -1
    );
  }
  function createBaseNode(kind) {
    return new (NodeConstructor2 || (NodeConstructor2 = objectAllocator.getNodeConstructor()))(
      kind,
      /*pos*/
      -1,
      /*end*/
      -1
    );
  }
}

// src/compiler/factory/parenthesizerRules.ts
function createParenthesizerRules(factory2) {
  let binaryLeftOperandParenthesizerCache;
  let binaryRightOperandParenthesizerCache;
  return {
    getParenthesizeLeftSideOfBinaryForOperator,
    getParenthesizeRightSideOfBinaryForOperator,
    parenthesizeLeftSideOfBinary,
    parenthesizeRightSideOfBinary,
    parenthesizeExpressionOfComputedPropertyName,
    parenthesizeConditionOfConditionalExpression,
    parenthesizeBranchOfConditionalExpression,
    parenthesizeExpressionOfExportDefault,
    parenthesizeExpressionOfNew,
    parenthesizeLeftSideOfAccess,
    parenthesizeOperandOfPostfixUnary,
    parenthesizeOperandOfPrefixUnary,
    parenthesizeExpressionsOfCommaDelimitedList,
    parenthesizeExpressionForDisallowedComma,
    parenthesizeExpressionOfExpressionStatement,
    parenthesizeConciseBodyOfArrowFunction,
    parenthesizeCheckTypeOfConditionalType,
    parenthesizeExtendsTypeOfConditionalType,
    parenthesizeConstituentTypesOfUnionType,
    parenthesizeConstituentTypeOfUnionType,
    parenthesizeConstituentTypesOfIntersectionType,
    parenthesizeConstituentTypeOfIntersectionType,
    parenthesizeOperandOfTypeOperator,
    parenthesizeOperandOfReadonlyTypeOperator,
    parenthesizeNonArrayTypeOfPostfixType,
    parenthesizeElementTypesOfTupleType,
    parenthesizeElementTypeOfTupleType,
    parenthesizeTypeOfOptionalType,
    parenthesizeTypeArguments,
    parenthesizeLeadingTypeArgument
  };
  function getParenthesizeLeftSideOfBinaryForOperator(operatorKind) {
    binaryLeftOperandParenthesizerCache || (binaryLeftOperandParenthesizerCache = /* @__PURE__ */ new Map());
    let parenthesizerRule = binaryLeftOperandParenthesizerCache.get(operatorKind);
    if (!parenthesizerRule) {
      parenthesizerRule = (node) => parenthesizeLeftSideOfBinary(operatorKind, node);
      binaryLeftOperandParenthesizerCache.set(operatorKind, parenthesizerRule);
    }
    return parenthesizerRule;
  }
  function getParenthesizeRightSideOfBinaryForOperator(operatorKind) {
    binaryRightOperandParenthesizerCache || (binaryRightOperandParenthesizerCache = /* @__PURE__ */ new Map());
    let parenthesizerRule = binaryRightOperandParenthesizerCache.get(operatorKind);
    if (!parenthesizerRule) {
      parenthesizerRule = (node) => parenthesizeRightSideOfBinary(
        operatorKind,
        /*leftSide*/
        void 0,
        node
      );
      binaryRightOperandParenthesizerCache.set(operatorKind, parenthesizerRule);
    }
    return parenthesizerRule;
  }
  function binaryOperandNeedsParentheses(binaryOperator, operand, isLeftSideOfBinary, leftOperand) {
    const binaryOperatorPrecedence = getOperatorPrecedence(226 /* BinaryExpression */, binaryOperator);
    const binaryOperatorAssociativity = getOperatorAssociativity(226 /* BinaryExpression */, binaryOperator);
    const emittedOperand = skipPartiallyEmittedExpressions(operand);
    if (!isLeftSideOfBinary && operand.kind === 219 /* ArrowFunction */ && binaryOperatorPrecedence > 3 /* Assignment */) {
      return true;
    }
    const operandPrecedence = getExpressionPrecedence(emittedOperand);
    switch (compareValues(operandPrecedence, binaryOperatorPrecedence)) {
      case -1 /* LessThan */:
        if (!isLeftSideOfBinary && binaryOperatorAssociativity === 1 /* Right */ && operand.kind === 229 /* YieldExpression */) {
          return false;
        }
        return true;
      case 1 /* GreaterThan */:
        return false;
      case 0 /* EqualTo */:
        if (isLeftSideOfBinary) {
          return binaryOperatorAssociativity === 1 /* Right */;
        } else {
          if (isBinaryExpression(emittedOperand) && emittedOperand.operatorToken.kind === binaryOperator) {
            if (operatorHasAssociativeProperty(binaryOperator)) {
              return false;
            }
            if (binaryOperator === 40 /* PlusToken */) {
              const leftKind = leftOperand ? getLiteralKindOfBinaryPlusOperand(leftOperand) : 0 /* Unknown */;
              if (isLiteralKind(leftKind) && leftKind === getLiteralKindOfBinaryPlusOperand(emittedOperand)) {
                return false;
              }
            }
          }
          const operandAssociativity = getExpressionAssociativity(emittedOperand);
          return operandAssociativity === 0 /* Left */;
        }
    }
  }
  function operatorHasAssociativeProperty(binaryOperator) {
    return binaryOperator === 42 /* AsteriskToken */ || binaryOperator === 52 /* BarToken */ || binaryOperator === 51 /* AmpersandToken */ || binaryOperator === 53 /* CaretToken */ || binaryOperator === 28 /* CommaToken */;
  }
  function getLiteralKindOfBinaryPlusOperand(node) {
    node = skipPartiallyEmittedExpressions(node);
    if (isLiteralKind(node.kind)) {
      return node.kind;
    }
    if (node.kind === 226 /* BinaryExpression */ && node.operatorToken.kind === 40 /* PlusToken */) {
      if (node.cachedLiteralKind !== void 0) {
        return node.cachedLiteralKind;
      }
      const leftKind = getLiteralKindOfBinaryPlusOperand(node.left);
      const literalKind = isLiteralKind(leftKind) && leftKind === getLiteralKindOfBinaryPlusOperand(node.right) ? leftKind : 0 /* Unknown */;
      node.cachedLiteralKind = literalKind;
      return literalKind;
    }
    return 0 /* Unknown */;
  }
  function parenthesizeBinaryOperand(binaryOperator, operand, isLeftSideOfBinary, leftOperand) {
    const skipped = skipPartiallyEmittedExpressions(operand);
    if (skipped.kind === 217 /* ParenthesizedExpression */) {
      return operand;
    }
    return binaryOperandNeedsParentheses(binaryOperator, operand, isLeftSideOfBinary, leftOperand) ? factory2.createParenthesizedExpression(operand) : operand;
  }
  function parenthesizeLeftSideOfBinary(binaryOperator, leftSide) {
    return parenthesizeBinaryOperand(
      binaryOperator,
      leftSide,
      /*isLeftSideOfBinary*/
      true
    );
  }
  function parenthesizeRightSideOfBinary(binaryOperator, leftSide, rightSide) {
    return parenthesizeBinaryOperand(
      binaryOperator,
      rightSide,
      /*isLeftSideOfBinary*/
      false,
      leftSide
    );
  }
  function parenthesizeExpressionOfComputedPropertyName(expression) {
    return isCommaSequence(expression) ? factory2.createParenthesizedExpression(expression) : expression;
  }
  function parenthesizeConditionOfConditionalExpression(condition) {
    const conditionalPrecedence = getOperatorPrecedence(227 /* ConditionalExpression */, 58 /* QuestionToken */);
    const emittedCondition = skipPartiallyEmittedExpressions(condition);
    const conditionPrecedence = getExpressionPrecedence(emittedCondition);
    if (compareValues(conditionPrecedence, conditionalPrecedence) !== 1 /* GreaterThan */) {
      return factory2.createParenthesizedExpression(condition);
    }
    return condition;
  }
  function parenthesizeBranchOfConditionalExpression(branch) {
    const emittedExpression = skipPartiallyEmittedExpressions(branch);
    return isCommaSequence(emittedExpression) ? factory2.createParenthesizedExpression(branch) : branch;
  }
  function parenthesizeExpressionOfExportDefault(expression) {
    const check = skipPartiallyEmittedExpressions(expression);
    let needsParens = isCommaSequence(check);
    if (!needsParens) {
      switch (getLeftmostExpression(
        check,
        /*stopAtCallExpressions*/
        false
      ).kind) {
        case 231 /* ClassExpression */:
        case 218 /* FunctionExpression */:
          needsParens = true;
      }
    }
    return needsParens ? factory2.createParenthesizedExpression(expression) : expression;
  }
  function parenthesizeExpressionOfNew(expression) {
    const leftmostExpr = getLeftmostExpression(
      expression,
      /*stopAtCallExpressions*/
      true
    );
    switch (leftmostExpr.kind) {
      case 213 /* CallExpression */:
        return factory2.createParenthesizedExpression(expression);
      case 214 /* NewExpression */:
        return !leftmostExpr.arguments ? factory2.createParenthesizedExpression(expression) : expression;
    }
    return parenthesizeLeftSideOfAccess(expression);
  }
  function parenthesizeLeftSideOfAccess(expression, optionalChain) {
    const emittedExpression = skipPartiallyEmittedExpressions(expression);
    if (isLeftHandSideExpression(emittedExpression) && (emittedExpression.kind !== 214 /* NewExpression */ || emittedExpression.arguments) && (optionalChain || !isOptionalChain(emittedExpression))) {
      return expression;
    }
    return setTextRange(factory2.createParenthesizedExpression(expression), expression);
  }
  function parenthesizeOperandOfPostfixUnary(operand) {
    return isLeftHandSideExpression(operand) ? operand : setTextRange(factory2.createParenthesizedExpression(operand), operand);
  }
  function parenthesizeOperandOfPrefixUnary(operand) {
    return isUnaryExpression(operand) ? operand : setTextRange(factory2.createParenthesizedExpression(operand), operand);
  }
  function parenthesizeExpressionsOfCommaDelimitedList(elements) {
    const result = sameMap(elements, parenthesizeExpressionForDisallowedComma);
    return setTextRange(factory2.createNodeArray(result, elements.hasTrailingComma), elements);
  }
  function parenthesizeExpressionForDisallowedComma(expression) {
    const emittedExpression = skipPartiallyEmittedExpressions(expression);
    const expressionPrecedence = getExpressionPrecedence(emittedExpression);
    const commaPrecedence = getOperatorPrecedence(226 /* BinaryExpression */, 28 /* CommaToken */);
    return expressionPrecedence > commaPrecedence ? expression : setTextRange(factory2.createParenthesizedExpression(expression), expression);
  }
  function parenthesizeExpressionOfExpressionStatement(expression) {
    const emittedExpression = skipPartiallyEmittedExpressions(expression);
    if (isCallExpression(emittedExpression)) {
      const callee = emittedExpression.expression;
      const kind = skipPartiallyEmittedExpressions(callee).kind;
      if (kind === 218 /* FunctionExpression */ || kind === 219 /* ArrowFunction */) {
        const updated = factory2.updateCallExpression(
          emittedExpression,
          setTextRange(factory2.createParenthesizedExpression(callee), callee),
          emittedExpression.typeArguments,
          emittedExpression.arguments
        );
        return factory2.restoreOuterExpressions(expression, updated, 8 /* PartiallyEmittedExpressions */);
      }
    }
    const leftmostExpressionKind = getLeftmostExpression(
      emittedExpression,
      /*stopAtCallExpressions*/
      false
    ).kind;
    if (leftmostExpressionKind === 210 /* ObjectLiteralExpression */ || leftmostExpressionKind === 218 /* FunctionExpression */) {
      return setTextRange(factory2.createParenthesizedExpression(expression), expression);
    }
    return expression;
  }
  function parenthesizeConciseBodyOfArrowFunction(body) {
    if (!isBlock(body) && (isCommaSequence(body) || getLeftmostExpression(
      body,
      /*stopAtCallExpressions*/
      false
    ).kind === 210 /* ObjectLiteralExpression */)) {
      return setTextRange(factory2.createParenthesizedExpression(body), body);
    }
    return body;
  }
  function parenthesizeCheckTypeOfConditionalType(checkType) {
    switch (checkType.kind) {
      case 184 /* FunctionType */:
      case 185 /* ConstructorType */:
      case 194 /* ConditionalType */:
        return factory2.createParenthesizedType(checkType);
    }
    return checkType;
  }
  function parenthesizeExtendsTypeOfConditionalType(extendsType) {
    switch (extendsType.kind) {
      case 194 /* ConditionalType */:
        return factory2.createParenthesizedType(extendsType);
    }
    return extendsType;
  }
  function parenthesizeConstituentTypeOfUnionType(type) {
    switch (type.kind) {
      case 192 /* UnionType */:
      case 193 /* IntersectionType */:
        return factory2.createParenthesizedType(type);
    }
    return parenthesizeCheckTypeOfConditionalType(type);
  }
  function parenthesizeConstituentTypesOfUnionType(members) {
    return factory2.createNodeArray(sameMap(members, parenthesizeConstituentTypeOfUnionType));
  }
  function parenthesizeConstituentTypeOfIntersectionType(type) {
    switch (type.kind) {
      case 192 /* UnionType */:
      case 193 /* IntersectionType */:
        return factory2.createParenthesizedType(type);
    }
    return parenthesizeConstituentTypeOfUnionType(type);
  }
  function parenthesizeConstituentTypesOfIntersectionType(members) {
    return factory2.createNodeArray(sameMap(members, parenthesizeConstituentTypeOfIntersectionType));
  }
  function parenthesizeOperandOfTypeOperator(type) {
    switch (type.kind) {
      case 193 /* IntersectionType */:
        return factory2.createParenthesizedType(type);
    }
    return parenthesizeConstituentTypeOfIntersectionType(type);
  }
  function parenthesizeOperandOfReadonlyTypeOperator(type) {
    switch (type.kind) {
      case 198 /* TypeOperator */:
        return factory2.createParenthesizedType(type);
    }
    return parenthesizeOperandOfTypeOperator(type);
  }
  function parenthesizeNonArrayTypeOfPostfixType(type) {
    switch (type.kind) {
      case 195 /* InferType */:
      case 198 /* TypeOperator */:
      case 186 /* TypeQuery */:
        return factory2.createParenthesizedType(type);
    }
    return parenthesizeOperandOfTypeOperator(type);
  }
  function parenthesizeElementTypesOfTupleType(types) {
    return factory2.createNodeArray(sameMap(types, parenthesizeElementTypeOfTupleType));
  }
  function parenthesizeElementTypeOfTupleType(type) {
    if (hasJSDocPostfixQuestion(type))
      return factory2.createParenthesizedType(type);
    return type;
  }
  function hasJSDocPostfixQuestion(type) {
    if (isJSDocNullableType(type))
      return type.postfix;
    if (isNamedTupleMember(type))
      return hasJSDocPostfixQuestion(type.type);
    if (isFunctionTypeNode(type) || isConstructorTypeNode(type) || isTypeOperatorNode(type))
      return hasJSDocPostfixQuestion(type.type);
    if (isConditionalTypeNode(type))
      return hasJSDocPostfixQuestion(type.falseType);
    if (isUnionTypeNode(type))
      return hasJSDocPostfixQuestion(last(type.types));
    if (isIntersectionTypeNode(type))
      return hasJSDocPostfixQuestion(last(type.types));
    if (isInferTypeNode(type))
      return !!type.typeParameter.constraint && hasJSDocPostfixQuestion(type.typeParameter.constraint);
    return false;
  }
  function parenthesizeTypeOfOptionalType(type) {
    if (hasJSDocPostfixQuestion(type))
      return factory2.createParenthesizedType(type);
    return parenthesizeNonArrayTypeOfPostfixType(type);
  }
  function parenthesizeLeadingTypeArgument(node) {
    return isFunctionOrConstructorTypeNode(node) && node.typeParameters ? factory2.createParenthesizedType(node) : node;
  }
  function parenthesizeOrdinalTypeArgument(node, i) {
    return i === 0 ? parenthesizeLeadingTypeArgument(node) : node;
  }
  function parenthesizeTypeArguments(typeArguments) {
    if (some(typeArguments)) {
      return factory2.createNodeArray(sameMap(typeArguments, parenthesizeOrdinalTypeArgument));
    }
  }
}
var nullParenthesizerRules = {
  getParenthesizeLeftSideOfBinaryForOperator: (_) => identity,
  getParenthesizeRightSideOfBinaryForOperator: (_) => identity,
  parenthesizeLeftSideOfBinary: (_binaryOperator, leftSide) => leftSide,
  parenthesizeRightSideOfBinary: (_binaryOperator, _leftSide, rightSide) => rightSide,
  parenthesizeExpressionOfComputedPropertyName: identity,
  parenthesizeConditionOfConditionalExpression: identity,
  parenthesizeBranchOfConditionalExpression: identity,
  parenthesizeExpressionOfExportDefault: identity,
  parenthesizeExpressionOfNew: (expression) => cast(expression, isLeftHandSideExpression),
  parenthesizeLeftSideOfAccess: (expression) => cast(expression, isLeftHandSideExpression),
  parenthesizeOperandOfPostfixUnary: (operand) => cast(operand, isLeftHandSideExpression),
  parenthesizeOperandOfPrefixUnary: (operand) => cast(operand, isUnaryExpression),
  parenthesizeExpressionsOfCommaDelimitedList: (nodes) => cast(nodes, isNodeArray),
  parenthesizeExpressionForDisallowedComma: identity,
  parenthesizeExpressionOfExpressionStatement: identity,
  parenthesizeConciseBodyOfArrowFunction: identity,
  parenthesizeCheckTypeOfConditionalType: identity,
  parenthesizeExtendsTypeOfConditionalType: identity,
  parenthesizeConstituentTypesOfUnionType: (nodes) => cast(nodes, isNodeArray),
  parenthesizeConstituentTypeOfUnionType: identity,
  parenthesizeConstituentTypesOfIntersectionType: (nodes) => cast(nodes, isNodeArray),
  parenthesizeConstituentT
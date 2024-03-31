ce */) || getDeclaredTypeOfClassOrInterface(baseSymbol).thisType) {
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  }
  function getDeclaredTypeOfClassOrInterface(symbol) {
    let links = getSymbolLinks(symbol);
    const originalLinks = links;
    if (!links.declaredType) {
      const kind = symbol.flags & 32 /* Class */ ? 1 /* Class */ : 2 /* Interface */;
      const merged = mergeJSSymbols(symbol, symbol.valueDeclaration && getAssignedClassSymbol(symbol.valueDeclaration));
      if (merged) {
        symbol = merged;
        links = merged.links;
      }
      const type = originalLinks.declaredType = links.declaredType = createObjectType(kind, symbol);
      const outerTypeParameters = getOuterTypeParametersOfClassOrInterface(symbol);
      const localTypeParameters = getLocalTypeParametersOfClassOrInterfaceOrTypeAlias(symbol);
      if (outerTypeParameters || localTypeParameters || kind === 1 /* Class */ || !isThislessInterface(symbol)) {
        type.objectFlags |= 4 /* Reference */;
        type.typeParameters = concatenate(outerTypeParameters, localTypeParameters);
        type.outerTypeParameters = outerTypeParameters;
        type.localTypeParameters = localTypeParameters;
        type.instantiations = /* @__PURE__ */ new Map();
        type.instantiations.set(getTypeListId(type.typeParameters), type);
        type.target = type;
        type.resolvedTypeArguments = type.typeParameters;
        type.thisType = createTypeParameter(symbol);
        type.thisType.isThisType = true;
        type.thisType.constraint = type;
      }
    }
    return links.declaredType;
  }
  function getDeclaredTypeOfTypeAlias(symbol) {
    var _a;
    const links = getSymbolLinks(symbol);
    if (!links.declaredType) {
      if (!pushTypeResolution(symbol, 2 /* DeclaredType */)) {
        return errorType;
      }
      const declaration = Debug.checkDefined((_a = symbol.declarations) == null ? void 0 : _a.find(isTypeAlias), "Type alias symbol with no valid declaration found");
      const typeNode = isJSDocTypeAlias(declaration) ? declaration.typeExpression : declaration.type;
      let type = typeNode ? getTypeFromTypeNode(typeNode) : errorType;
      if (popTypeResolution()) {
        const typeParameters = getLocalTypeParametersOfClassOrInterfaceOrTypeAlias(symbol);
        if (typeParameters) {
          links.typeParameters = typeParameters;
          links.instantiations = /* @__PURE__ */ new Map();
          links.instantiations.set(getTypeListId(typeParameters), type);
        }
      } else {
        type = errorType;
        if (declaration.kind === 347 /* JSDocEnumTag */) {
          error(declaration.typeExpression.type, Diagnostics.Type_alias_0_circularly_references_itself, symbolToString(symbol));
        } else {
          error(isNamedDeclaration(declaration) ? declaration.name || declaration : declaration, Diagnostics.Type_alias_0_circularly_references_itself, symbolToString(symbol));
        }
      }
      links.declaredType = type;
    }
    return links.declaredType;
  }
  function getBaseTypeOfEnumLikeType(type) {
    return type.flags & 1056 /* EnumLike */ && type.symbol.flags & 8 /* EnumMember */ ? getDeclaredTypeOfSymbol(getParentOfSymbol(type.symbol)) : type;
  }
  function getDeclaredTypeOfEnum(symbol) {
    const links = getSymbolLinks(symbol);
    if (!links.declaredType) {
      const memberTypeList = [];
      if (symbol.declarations) {
        for (const declaration of symbol.declarations) {
          if (declaration.kind === 266 /* EnumDeclaration */) {
            for (const member of declaration.members) {
              if (hasBindableName(member)) {
                const memberSymbol = getSymbolOfDeclaration(member);
                const value = getEnumMemberValue(member);
                const memberType = getFreshTypeOfLiteralType(
                  value !== void 0 ? getEnumLiteralType(value, getSymbolId(symbol), memberSymbol) : createComputedEnumType(memberSymbol)
                );
                getSymbolLinks(memberSymbol).declaredType = memberType;
                memberTypeList.push(getRegularTypeOfLiteralType(memberType));
              }
            }
          }
        }
      }
      const enumType = memberTypeList.length ? getUnionType(
        memberTypeList,
        1 /* Literal */,
        symbol,
        /*aliasTypeArguments*/
        void 0
      ) : createComputedEnumType(symbol);
      if (enumType.flags & 1048576 /* Union */) {
        enumType.flags |= 1024 /* EnumLiteral */;
        enumType.symbol = symbol;
      }
      links.declaredType = enumType;
    }
    return links.declaredType;
  }
  function createComputedEnumType(symbol) {
    const regularType = createTypeWithSymbol(32 /* Enum */, symbol);
    const freshType = createTypeWithSymbol(32 /* Enum */, symbol);
    regularType.regularType = regularType;
    regularType.freshType = freshType;
    freshType.regularType = regularType;
    freshType.freshType = freshType;
    return regularType;
  }
  function getDeclaredTypeOfEnumMember(symbol) {
    const links = getSymbolLinks(symbol);
    if (!links.declaredType) {
      const enumType = getDeclaredTypeOfEnum(getParentOfSymbol(symbol));
      if (!links.declaredType) {
        links.declaredType = enumType;
      }
    }
    return links.declaredType;
  }
  function getDeclaredTypeOfTypeParameter(symbol) {
    const links = getSymbolLinks(symbol);
    return links.declaredType || (links.declaredType = createTypeParameter(symbol));
  }
  function getDeclaredTypeOfAlias(symbol) {
    const links = getSymbolLinks(symbol);
    return links.declaredType || (links.declaredType = getDeclaredTypeOfSymbol(resolveAlias(symbol)));
  }
  function getDeclaredTypeOfSymbol(symbol) {
    return tryGetDeclaredTypeOfSymbol(symbol) || errorType;
  }
  function tryGetDeclaredTypeOfSymbol(symbol) {
    if (symbol.flags & (32 /* Class */ | 64 /* Interface */)) {
      return getDeclaredTypeOfClassOrInterface(symbol);
    }
    if (symbol.flags & 524288 /* TypeAlias */) {
      return getDeclaredTypeOfTypeAlias(symbol);
    }
    if (symbol.flags & 262144 /* TypeParameter */) {
      return getDeclaredTypeOfTypeParameter(symbol);
    }
    if (symbol.flags & 384 /* Enum */) {
      return getDeclaredTypeOfEnum(symbol);
    }
    if (symbol.flags & 8 /* EnumMember */) {
      return getDeclaredTypeOfEnumMember(symbol);
    }
    if (symbol.flags & 2097152 /* Alias */) {
      return getDeclaredTypeOfAlias(symbol);
    }
    return void 0;
  }
  function isThislessType(node) {
    switch (node.kind) {
      case 133 /* AnyKeyword */:
      case 159 /* UnknownKeyword */:
      case 154 /* StringKeyword */:
      case 150 /* NumberKeyword */:
      case 163 /* BigIntKeyword */:
      case 136 /* BooleanKeyword */:
      case 155 /* SymbolKeyword */:
      case 151 /* ObjectKeyword */:
      case 116 /* VoidKeyword */:
      case 157 /* UndefinedKeyword */:
      case 146 /* NeverKeyword */:
      case 201 /* LiteralType */:
        return true;
      case 188 /* ArrayType */:
        return isThislessType(node.elementType);
      case 183 /* TypeReference */:
        return !node.typeArguments || node.typeArguments.every(isThislessType);
    }
    return false;
  }
  function isThislessTypeParameter(node) {
    const constraint = getEffectiveConstraintOfTypeParameter(node);
    return !constraint || isThislessType(constraint);
  }
  function isThislessVariableLikeDeclaration(node) {
    const typeNode = getEffectiveTypeAnnotationNode(node);
    return typeNode ? isThislessType(typeNode) : !hasInitializer(node);
  }
  function isThislessFunctionLikeDeclaration(node) {
    const returnType = getEffectiveReturnTypeNode(node);
    const typeParameters = getEffectiveTypeParameterDeclarations(node);
    return (node.kind === 176 /* Constructor */ || !!returnType && isThislessType(returnType)) && node.parameters.every(isThislessVariableLikeDeclaration) && typeParameters.every(isThislessTypeParameter);
  }
  function isThisless(symbol) {
    if (symbol.declarations && symbol.declarations.length === 1) {
      const declaration = symbol.declarations[0];
      if (declaration) {
        switch (declaration.kind) {
          case 172 /* PropertyDeclaration */:
          case 171 /* PropertySignature */:
            return isThislessVariableLikeDeclaration(declaration);
          case 174 /* MethodDeclaration */:
          case 173 /* MethodSignature */:
          case 176 /* Constructor */:
          case 177 /* GetAccessor */:
          case 178 /* SetAccessor */:
            return isThislessFunctionLikeDeclaration(declaration);
        }
      }
    }
    return false;
  }
  function createInstantiatedSymbolTable(symbols, mapper, mappingThisOnly) {
    const result = createSymbolTable();
    for (const symbol of symbols) {
      result.set(symbol.escapedName, mappingThisOnly && isThisless(symbol) ? symbol : instantiateSymbol(symbol, mapper));
    }
    return result;
  }
  function addInheritedMembers(symbols, baseSymbols) {
    for (const base of baseSymbols) {
      if (isStaticPrivateIdentifierProperty(base)) {
        continue;
      }
      const derived = symbols.get(base.escapedName);
      if (!derived || derived.valueDeclaration && isBinaryExpression(derived.valueDeclaration) && !isConstructorDeclaredProperty(derived) && !getContainingClassStaticBlock(derived.valueDeclaration)) {
        symbols.set(base.escapedName, base);
        symbols.set(base.escapedName, base);
      }
    }
  }
  function isStaticPrivateIdentifierProperty(s) {
    return !!s.valueDeclaration && isPrivateIdentifierClassElementDeclaration(s.valueDeclaration) && isStatic(s.valueDeclaration);
  }
  function resolveDeclaredMembers(type) {
    if (!type.declaredProperties) {
      const symbol = type.symbol;
      const members = getMembersOfSymbol(symbol);
      type.declaredProperties = getNamedMembers(members);
      type.declaredCallSignatures = emptyArray;
      type.declaredConstructSignatures = emptyArray;
      type.declaredIndexInfos = emptyArray;
      type.declaredCallSignatures = getSignaturesOfSymbol(members.get("__call" /* Call */));
      type.declaredConstructSignatures = getSignaturesOfSymbol(members.get("__new" /* New */));
      type.declaredIndexInfos = getIndexInfosOfSymbol(symbol);
    }
    return type;
  }
  function isLateBindableName(node) {
    if (!isComputedPropertyName(node) && !isElementAccessExpression(node)) {
      return false;
    }
    const expr = isComputedPropertyName(node) ? node.expression : n
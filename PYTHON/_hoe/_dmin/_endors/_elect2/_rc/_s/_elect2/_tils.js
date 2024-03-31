ome(signature.compositeSignatures, isResolvingReturnTypeOfSignature) || !signature.resolvedReturnType && findResolutionCycleStartIndex(signature, 3 /* ResolvedReturnType */) >= 0;
  }
  function getRestTypeOfSignature(signature) {
    return tryGetRestTypeOfSignature(signature) || anyType;
  }
  function tryGetRestTypeOfSignature(signature) {
    if (signatureHasRestParameter(signature)) {
      const sigRestType = getTypeOfSymbol(signature.parameters[signature.parameters.length - 1]);
      const restType = isTupleType(sigRestType) ? getRestTypeOfTupleType(sigRestType) : sigRestType;
      return restType && getIndexTypeOfType(restType, numberType);
    }
    return void 0;
  }
  function getSignatureInstantiation(signature, typeArguments, isJavascript, inferredTypeParameters) {
    const instantiatedSignature = getSignatureInstantiationWithoutFillingInTypeArguments(signature, fillMissingTypeArguments(typeArguments, signature.typeParameters, getMinTypeArgumentCount(signature.typeParameters), isJavascript));
    if (inferredTypeParameters) {
      const returnSignature = getSingleCallOrConstructSignature(getReturnTypeOfSignature(instantiatedSignature));
      if (returnSignature) {
        const newReturnSignature = cloneSignature(returnSignature);
        newReturnSignature.typeParameters = inferredTypeParameters;
        const newInstantiatedSignature = cloneSignature(instantiatedSignature);
        newInstantiatedSignature.resolvedReturnType = getOrCreateTypeFromSignature(newReturnSignature);
        return newInstantiatedSignature;
      }
    }
    return instantiatedSignature;
  }
  function getSignatureInstantiationWithoutFillingInTypeArguments(signature, typeArguments) {
    const instantiations = signature.instantiations || (signature.instantiations = /* @__PURE__ */ new Map());
    const id = getTypeListId(typeArguments);
    let instantiation = instantiations.get(id);
    if (!instantiation) {
      instantiations.set(id, instantiation = createSignatureInstantiation(signature, typeArguments));
    }
    return instantiation;
  }
  function createSignatureInstantiation(signature, typeArguments) {
    return instantiateSignature(
      signature,
      createSignatureTypeMapper(signature, typeArguments),
      /*eraseTypeParameters*/
      true
    );
  }
  function createSignatureTypeMapper(signature, typeArguments) {
    return createTypeMapper(signature.typeParameters, typeArguments);
  }
  function getErasedSignature(signature) {
    return signature.typeParameters ? signature.erasedSignatureCache || (signature.erasedSignatureCache = createErasedSignature(signature)) : signature;
  }
  function createErasedSignature(signature) {
    return instantiateSignature(
      signature,
      createTypeEraser(signature.typeParameters),
      /*eraseTypeParameters*/
      true
    );
  }
  function getCanonicalSignature(signature) {
    return signature.typeParameters ? signature.canonicalSignatureCache || (signature.canonicalSignatureCache = createCanonicalSignature(signature)) : signature;
  }
  function createCanonicalSignature(signature) {
    return getSignatureInstantiation(
      signature,
      map(signature.typeParameters, (tp) => tp.target && !getConstraintOfTypeParameter(tp.target) ? tp.target : tp),
      isInJSFile(signature.declaration)
    );
  }
  function getBaseSignature(signature) {
    const typeParameters = signature.typeParameters;
    if (typeParameters) {
      if (signature.baseSignatureCache) {
        return signature.baseSignatureCache;
      }
      const typeEraser = createTypeEraser(typeParameters);
      const baseConstraintMapper = createTypeMapper(typeParameters, map(typeParameters, (tp) => getConstraintOfTypeParameter(tp) || unknownType));
      let baseConstraints = map(typeParameters, (tp) => instantiateType(tp, baseConstraintMapper) || unknownType);
      for (let i = 0; i < typeParameters.length - 1; i++) {
        baseConstraints = instantiateTypes(baseConstraints, baseConstraintMapper);
      }
      baseConstraints = instantiateTypes(baseConstraints, typeEraser);
      return signature.baseSignatureCache = instantiateSignature(
        signature,
        createTypeMapper(typeParameters, baseConstraints),
        /*eraseTypeParameters*/
        true
      );
    }
    return signature;
  }
  function getOrCreateTypeFromSignature(signature) {
    var _a;
    if (!signature.isolatedSignatureType) {
      const kind = (_a = signature.declaration) == null ? void 0 : _a.kind;
      const isConstructor = kind === void 0 || kind === 176 /* Constructor */ || kind === 180 /* ConstructSignature */ || kind === 185 /* ConstructorType */;
      const type = createObjectType(16 /* Anonymous */);
      type.members = emptySymbols;
      type.properties = emptyArray;
      type.callSignatures = !isConstructor ? [signature] : emptyArray;
      type.constructSignatures = isConstructor ? [signature] : emptyArray;
      type.indexInfos = emptyArray;
      signature.isolatedSignatureType = type;
    }
    return signature.isolatedSignatureType;
  }
  function getIndexSymbol(symbol) {
    return symbol.members ? getIndexSymbolFromSymbolTable(symbol.members) : void 0;
  }
  function getIndexSymbolFromSymbolTable(symbolTable) {
    return symbolTable.get("__index" /* Index */);
  }
  function createIndexInfo(keyType, type, isReadonly, declaration) {
    return { keyType, type, isReadonly, declaration };
  }
  function getIndexInfosOfSymbol(symbol) {
    const indexSymbol = getIndexSymbol(symbol);
    return indexSymbol ? getIndexInfosOfIndexSymbol(indexSymbol) : emptyArray;
  }
  function getIndexInfosOfIndexSymbol(indexSymbol) {
    if (indexSymbol.declarations) {
      const indexInfos = [];
      for (const declaration of indexSymbol.declarations) {
        if (declaration.parameters.length === 1) {
          const parameter = declaration.parameters[0];
          if (parameter.type) {
            forEachType(getTypeFromTypeNode(parameter.type), (keyType) => {
              if (isValidIndexKeyType(keyType) && !findIndexInfo(indexInfos, keyType)) {
                indexInfos.push(createIndexInfo(keyType, declaration.type ? getTypeFromTypeNode(declaration.type) : anyType, hasEffectiveModifier(declaration, 8 /* Readonly */), declaration));
              }
            });
          }
        }
      }
      return indexInfos;
    }
    return emptyArray;
  }
  function isValidIndexKeyType(type) {
    return !!(type.flags & (4 /* String */ | 8 /* Number */ | 4096 /* ESSymbol */)) || isPatternLiteralType(type) || !!(type.flags & 2097152 /* Intersection */) && !isGenericType(type) && some(type.types, isValidIndexKeyType);
  }
  function
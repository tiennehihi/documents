  });
        }
      }
      links[resolutionKind] = resolved || emptySymbols;
    }
    return links[resolutionKind];
  }
  function getMembersOfSymbol(symbol) {
    return symbol.flags & 6256 /* LateBindingContainer */ ? getResolvedMembersOrExportsOfSymbol(symbol, "resolvedMembers" /* resolvedMembers */) : symbol.members || emptySymbols;
  }
  function getLateBoundSymbol(symbol) {
    if (symbol.flags & 106500 /* ClassMember */ && symbol.escapedName === "__computed" /* Computed */) {
      const links = getSymbolLinks(symbol);
      if (!links.lateSymbol && some(symbol.declarations, hasLateBindableName)) {
        const parent = getMergedSymbol(symbol.parent);
        if (some(symbol.declarations, hasStaticModifier)) {
          getExportsOfSymbol(parent);
        } else {
          getMembersOfSymbol(parent);
        }
      }
      return links.lateSymbol || (links.lateSymbol = symbol);
    }
    return symbol;
  }
  function getTypeWithThisArgument(type, thisArgument, needApparentType) {
    if (getObjectFlags(type) & 4 /* Reference */) {
      const target = type.target;
      const typeArguments = getTypeArguments(type);
      return length(target.typeParameters) === length(typeArguments) ? createTypeReference(target, concatenate(typeArguments, [thisArgument || target.thisType])) : type;
    } else if (type.flags & 2097152 /* Intersection */) {
      const types = sameMap(type.types, (t) => getTypeWithThisArgument(t, thisArgument, needApparentType));
      return types !== type.types ? getIntersectionType(types) : type;
    }
    return needApparentType ? getApparentType(type) : type;
  }
  function resolveObjectTypeMembers(type, source, typeParameters, typeArguments) {
    let mapper;
    let members;
    let callSignatures;
    let constructSignatures;
    let indexInfos;
    if (rangeEquals(typeParameters, typeArguments, 0, typeParameters.length)) {
      members = source.symbol ? getMembersOfSymbol(source.symbol) : createSymbolTable(source.declaredProperties);
      callSignatures = source.declaredCallSignatures;
      constructSignatures = source.declaredConstructSignatures;
      indexInfos = source.declaredIndexInfos;
    } else {
      mapper = createTypeMapper(typeParameters, typeArguments);
      members = createInstantiatedSymbolTable(
        source.declaredProperties,
        mapper,
        /*mappingThisOnly*/
        typeParameters.length === 1
      );
      callSignatures = instantiateSignatures(source.declaredCallSignatures, mapper);
      constructSignatures = instantiateSignatures(source.declaredConstructSignatures, mapper);
      indexInfos = instantiateIndexInfos(source.declaredIndexInfos, mapper);
    }
    const baseTypes = getBaseTypes(source);
    if (baseTypes.length) {
      if (source.symbol && members === getMembersOfSymbol(source.symbol)) {
        const symbolTable = createSymbolTable(source.declaredProperties);
        const sourceIndex = getIndexSymbol(source.symbol);
        if (sourceIndex) {
          symbolTable.set("__index" /* Index */, sourceIndex);
        }
        members = symbolTable;
      }
      setStructuredTypeMembers(type, members, callSignatures, constructSignatures, indexInfos);
      const thisArgument = lastOrUndefined(typeArguments);
      for (const baseType of baseTypes) {
        const instantiatedBaseType = thisArgument ? getTypeWithThisArgument(instantiateType(baseType, mapper), thisArgument) : baseType;
        addInheritedMembers(members, getPropertiesOfType(instantiatedBaseType));
        callSignatures = concatenate(callSignatures, getSignaturesOfType(instantiatedBaseType, 0 /* Call */));
        constructSignatures = concatenate(constructSignatures, getSignaturesOfType(instantiatedBaseType, 1 /* Construct */));
        const inheritedIndexInfos = instantiatedBaseType !== anyType ? getIndexInfosOfType(instantiatedBaseType) : [createIndexInfo(
          stringType,
          anyType,
          /*isReadonly*/
          false
        )];
        indexInfos = concatenate(indexInfos, filter(inheritedIndexInfos, (info) => !findIndexInfo(indexInfos, info.keyType)));
      }
    }
    setStructuredTypeMembers(type, members, callSignatures, constructSignatures, indexInfos);
  }
  function resolveClassOrInterfaceMembers(type) {
    resolveObjectTypeMembers(type, resolveDeclaredMembers(type), emptyArray, emptyArray);
  }
  function resolveTypeReferenceMembers(type) {
    const source = resolveDeclaredMembers(type.target);
    const typeParameters = concatenate(source.typeParameters, [source.thisType]);
    const typeArguments = getTypeArguments(type);
    const paddedTypeArguments = typeArguments.length === typeParameters.length ? typeArguments : concatenate(typeArguments, [type]);
    resolveObjectTypeMembers(type, source, typeParameters, paddedTypeArguments);
  }
  function createSignature(declaration, typeParameters, thisParameter, parameters, resolvedReturnType, resolvedTypePredicate, minArgumentCount, flags) {
    const sig = new Signature5(checker, flags);
    sig.declaration = declaration;
    sig.typeParameters = typeParameters;
    sig.parameters = parameters;
    sig.thisParameter = thisParameter;
    sig.resolvedReturnType = resolvedReturnType;
    sig.resolvedTypePredicate = resolvedTypePredicate;
    sig.minArgumentCount = minArgumentCount;
    sig.resolvedMinArgumentCount = void 0;
    sig.target = void 0;
    sig.mapper = void 0;
    sig.compositeSignatures = void 0;
    sig.compositeKind = void 0;
    return sig;
  }
  function cloneSignature(sig) {
    const result = createSignature(
      sig.declaration,
      sig.typeParameters,
      sig.thisParameter,
      sig.parameters,
      /*resolvedReturnType*/
      void 0,
      /*resolvedTypePredicate*/
      void 0,
      sig.minArgumentCount,
      sig.flags & 167 /* PropagatingFlags */
    );
    result.target = sig.target;
    result.mapper = sig.mapper;
    result.compositeSignatures = sig.compositeSignatures;
    result.compositeKind = sig.compositeKind;
    return result;
  }
  function createUnionSignature(signature, unionSignatures) {
    const result = cloneSignature(signature);
    result.compositeSignatures = unionSignatures;
    result.compositeKind = 1048576 /* Union */;
    result.target = void 0;
    result.mapper = void 0;
    return result;
  }
  function getOptionalCallSignature(signature, callChainFlags) {
    if ((signature.flags & 24 /* CallChainFlags */) === callChainFlags) {
      return signature;
    }
    if (!signature.optionalCallSignatureCache) {
      signature.optionalCallSignatureCache = {};
    }
    const key = callChainFlags === 8 /* IsInnerCallChain */ ? "inner" : "outer";
    return signature.optionalCallSignatureCache[key] || (signature.optionalCallSignatureCache[key] = createOptionalCallSignature(signature, callChainFlags));
  }
  function createOptionalCallSignature(signature, callChainFlags) {
    Debug.assert(callChainFlags === 8 /* IsInnerCallChain */ || callChainFlags === 16 /* IsOuterCallChain */, "An optional call signature can either be for an inner call chain or an outer call chain, but not both.");
    const result = cloneSignature(signature);
    result.flags |= callChainFlags;
    return result;
  }
  function getExpandedParameters(sig, skipUnionExpanding) {
    if (signatureHasRestParameter(sig)) {
      const restIndex = sig.parameters.length - 1;
      const restName = sig.parameters[restIndex].escapedName;
      const restType = getTypeOfSymbol(sig.parameters[restIndex]);
      if (isTupleType(restType)) {
        return [expandSignatureParametersWithTupleMembers(restType, restIndex, restName)];
      } else if (!skipUnionExpanding && restType.flags & 1048576 /* Union */ && every(restType.types, isTupleType)) {
        return map(restType.types, (t) => expandSignatureParametersWithTupleMembers(t, restIndex, restName));
      }
    }
    return [sig.parameters];
    function expandSignatureParametersWithTupleMembers(restType, restIndex, restName) {
      const elementTypes = getTypeArguments(restType);
      const associatedNames = getUniqAssociatedNamesFromTupleType(restType, restName);
      const restParams = map(elementTypes, (t, i) => {
        const name = associatedNames && associatedNames[i] ? associatedNames[i] : getParameterNameAtPosition(sig, restIndex + i, restType);
        const flags = restType.target.elementFlags[i];
        const checkFlags = flags & 12 /* Variable */ ? 32768 /* RestParameter */ : flags & 2 /* Optional */ ? 16384 /* OptionalParameter */ : 0;
        const symbol = createSymbol(1 /* FunctionScopedVariable */, name, checkFlags);
        symbol.links.type = flags & 4 /* Rest */ ? createArrayType(t) : t;
        return symbol;
      });
      return concatenate(sig.parameters.slice(0, restIndex), restParams);
    }
    function getUniqAssociatedNamesFromTupleType(type, restName) {
      const associatedNamesMap = /* @__PURE__ */ new Map();
      return map(type.target.labeledElementDeclarations, (labeledElement, i) => {
        const name = getTupleElementLabel(labeledElement, i, restName);
        const prevCounter = associatedNamesMap.get(name);
        if (prevCounter === void 0) {
          associatedNamesMap.set(name, 1);
          return name;
        } else {
          associatedNamesMap.set(name, prevCounter + 1);
          return `${name}_${prevCounter}`;
        }
      });
    }
  }
  function getDefaultConstructSignatures(classType) {
    const baseConstructorType = getBaseConstructorTypeOfClass(classType);
    const baseSignatures = getSignaturesOfType(baseConstructorType, 1 /* Construct */);
    const declaration = getClassLikeDeclarationOfSymbol(classType.symbol);
    const isAbstract = !!declaration && hasSyntacticModifier(declaration, 64 /* Abstract */);
    if (baseSignatures.length === 0) {
      return [createSignature(
        /*declaration*/
        void 0,
        classType.localTypeParameters,
        /*thisParameter*/
        void 0,
        emptyArray,
        classType,
        /*resolvedTypePredicate*/
        void 0,
        0,
        isAbstract ? 4 /* Abstract */ : 0 /* None */
      )];
    }
    const baseTypeNode = getBaseTypeNodeOfClass(classType);
    const isJavaScript = isInJSFile(baseTypeNode);
    const typeArguments = typeArgumentsFromTypeReferenceNode(baseTypeNode);
    const typeArgCount = length(typeArguments);
    const result = [];
    for (const baseSig of baseSignatures) {
      const minTypeArgumentCount = getMinTypeArgumentCount(baseSig.typeParameters);
      const typeParamCount = length(baseSig.typeParameters);
      if (isJavaScript || typeArgCount >= minTypeArgumentCount && typeArgCount <= typeParamCount) {
        const sig = typeParamCount ? createSignatureInstantiation(baseSig, fillMissingTypeArguments(typeArguments, baseSig.typeParameters, minTypeArgumentCount, isJavaScript)) : cloneSignature(baseSig);
        sig.typeParameters = classType.localTypeParameters;
        sig.resolvedReturnType = classType;
        sig.flags = isAbstract ? sig.flags | 4 /* Abstract */ : sig.flags & ~4 /* Abstract */;
        result.push(sig);
      }
    }
    return result;
  }
  function findMatchingSignature(signatureList, signature, partialMatch, ignoreThisTypes, ignoreReturnTypes) {
    for (const s of signatureList) {
      if (compareSignaturesIdentical(s, signature, partialMatch, ignoreThisTypes, ignoreReturnTypes, partialMatch ? compareTypesSubtypeOf : compareTypesIdentical)) {
        return s;
      }
    }
  }
  function findMatchingSignatures(signatureLists, signature, listIndex) {
    if (signature.typeParameters) {
      if (listIndex > 0) {
        return void 0;
      }
      for (let i = 1; i < signatureLists.length; i++) {
        if (!findMatchingSignature(
          signatureLists[i],
          signature,
          /*partialMatch*/
          false,
          /*ignoreThisTypes*/
          false,
          /*ignoreReturnTypes*/
          false
        )) {
          return void 0;
        }
      }
      return [signature];
    }
    let result;
    for (let i = 0; i < signatureLists.length; i++) {
      const match = i === listIndex ? signature : findMatchingSignature(
        signatureLists[i],
        signature,
        /*partialMatch*/
        false,
        /*ignoreThisTypes*/
        false,
        /*ignoreReturnTypes*/
        true
      ) || findMatchingSignature(
        signatureLists[i],
        signature,
        /*partialMatch*/
        true,
        /*ignoreThisTypes*/
        false,
        /*ignoreReturnTypes*/
        true
      );
      if (!match) {
        return void 0;
      }
      result = appendIfUnique(result, match);
    }
    return result;
  }
  function getUnionSignatures(signatureLists) {
    let result;
    let indexWithLengthOverOne;
    for (let i = 0; i < signatureLists.length; i++) {
      if (signatureLists[i].length === 0)
        return emptyArray;
      if (signatureLists[i].length > 1) {
        indexWithLengthOverOne = indexWithLengthOverOne === void 0 ? i : -1;
      }
      for (const signature of signatureLists[i]) {
        if (!result || !findMatchingSignature(
          result,
          signature,
          /*partialMatch*/
          false,
          /*ignoreThisTypes*/
          false,
          /*ignoreReturnTypes*/
          true
        )) {
          const unionSignatures = findMatchingSignatures(signatureLists, signature, i);
          if (unionSignatures) {
            let s = signature;
            if (unionSignatures.length > 1) {
              let thisParameter = signature.thisParameter;
              const firstThisParameterOfUnionSignatures = forEach(unionSignatures, (sig) => sig.thisParameter);
              if (firstThisParameterOfUnionSignatures) {
                const thisType = getIntersectionType(mapDefined(unionSignatures, (sig) => sig.thisParameter && getTypeOfSymbol(sig.thisParameter)));
                thisParameter = createSymbolWithType(firstThisParameterOfUnionSignatures, thisType);
              }
              s = createUnionSignature(signature, unionSignatures);
              s.thisParameter = thisParameter;
            }
            (result || (result = [])).push(s);
          }
        }
      }
    }
    if (!length(result) && indexWithLengthOverOne !== -1) {
      const masterList = signatureLists[indexWithLengthOverOne !== void 0 ? indexWithLengthOverOne : 0];
      let results = masterList.slice();
      for (const signatures of signatureLists) {
        if (signatures !== masterList) {
          const signature = signatures[0];
          Debug.assert(!!signature, "getUnionSignatures bails early on empty signature lists and should not have empty lists on second pass");
          results = !!signature.typeParameters && some(results, (s) => !!s.typeParameters && !compareTypeParametersIdentical(signature.typeParameters, s.typeParameters)) ? void 0 : map(results, (sig) => combineSignaturesOfUnionMembers(sig, signature));
          if (!results) {
            break;
          }
        }
      }
      result = results;
    }
    return result || emptyArray;
  }
  function compareTypeParametersIdentical(sourceParams, targetParams) {
    if (length(sourceParams) !== length(targetParams)) {
      return false;
    }
    if (!sourceParams || !targetParams) {
      return true;
    }
    const mapper = createTypeMapper(targetParams, sourceParams);
    for (let i = 0; i < sourceParams.length; i++) {
      const source = sourceParams[i];
      const target = targetParams[i];
      if (source === target)
        continue;
      if (!isTypeIdenticalTo(getConstraintFromTypeParameter(source) || unknownType, instantiateType(getConstraintFromTypeParameter(target) || unknownType, mapper)))
        return false;
    }
    return true;
  }
  function combineUnionThisParam(left, right, mapper) {
    if (!left || !right) {
      return left || right;
    }
    const thisType = getIntersectionType([getTypeOfSymbol(left), instantiateType(getTypeOfSymbol(right), mapper)]);
    return createSymbolWithType(left, thisType);
  }
  function combineUnionParameters(left, right, mapper) {
    const leftCount = getParameterCount(left);
   
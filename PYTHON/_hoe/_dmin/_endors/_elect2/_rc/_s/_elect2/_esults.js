 }
    }
    if (!singleProp || isUnion && (propSet || checkFlags & 48 /* Partial */) && checkFlags & (1024 /* ContainsPrivate */ | 512 /* ContainsProtected */) && !(propSet && getCommonDeclarationsOfSymbols(propSet.values()))) {
      return void 0;
    }
    if (!propSet && !(checkFlags & 16 /* ReadPartial */) && !indexTypes) {
      if (mergedInstantiations) {
        const links = (_a = tryCast(singleProp, isTransientSymbol)) == null ? void 0 : _a.links;
        const clone2 = createSymbolWithType(singleProp, links == null ? void 0 : links.type);
        clone2.parent = (_c = (_b = singleProp.valueDeclaration) == null ? void 0 : _b.symbol) == null ? void 0 : _c.parent;
        clone2.links.containingType = containingType;
        clone2.links.mapper = links == null ? void 0 : links.mapper;
        clone2.links.writeType = getWriteTypeOfSymbol(singleProp);
        return clone2;
      } else {
        return singleProp;
      }
    }
    const props = propSet ? arrayFrom(propSet.values()) : [singleProp];
    let declarations;
    let firstType;
    let nameType;
    const propTypes = [];
    let writeTypes;
    let firstValueDeclaration;
    let hasNonUniformValueDeclaration = false;
    for (const prop of props) {
      if (!firstValueDeclaration) {
        firstValueDeclaration = prop.valueDeclaration;
      } else if (prop.valueDeclaration && prop.valueDeclaration !== firstValueDeclaration) {
        hasNonUniformValueDeclaration = true;
      }
      declarations = addRange(declarations, prop.declarations);
      const type = getTypeOfSymbol(prop);
      if (!firstType) {
        firstType = type;
        nameType = getSymbolLinks(prop).nameType;
      }
      const writeType = getWriteTypeOfSymbol(prop);
      if (writeTypes || writeType !== type) {
        writeTypes = append(!writeTypes ? propTypes.slice() : writeTypes, writeType);
      }
      if (type !== firstType) {
        checkFlags |= 64 /* HasNonUniformType */;
      }
      if (isLiteralType(type) || isPatternLiteralType(type)) {
        checkFlags |= 128 /* HasLiteralType */;
      }
      if (type.flags & 131072 /* Never */ && type !== uniqueLiteralType) {
        checkFlags |= 131072 /* HasNeverType */;
      }
      propTypes.push(type);
    }
    addRange(propTypes, indexTypes);
    const result = createSymbol(4 /* Property */ | (optionalFlag ?? 0), name, syntheticFlag | checkFlags);
    result.links.containingType = containingType;
    if (!hasNonUniformValueDeclaration && firstValueDeclaration) {
      result.valueDeclaration = firstValueDeclaration;
      if (firstValueDeclaration.symbol.parent) {
        result.parent = firstValueDeclaration.symbol.parent;
      }
    }
    result.declarations = declarations;
    result.links.nameType = nameType;
    if (propTypes.length > 2) {
      result.links.checkFlags |= 65536 /* DeferredType */;
      result.links.deferralParent = containingType;
      result.links.deferralConstituents = propTypes;
      result.links.deferralWriteConstituents = writeTypes;
    } else {
      result.links.type = isUnion ? getUnionType(propTypes) : getIntersectionType(propTypes);
      if (writeTypes) {
        result.links.writeType = isUnion ? getUnionType(writeTypes) : getIntersectionType(writeTypes);
      }
    }
    return result;
  }
  function getUnionOrIntersectionProperty(type, name, skipObjectFunctionPropertyAugment) {
    var _a, _b, _c;
    let property = ((_a = type.propertyCacheWithoutObjectFunctionPropertyAugment) == null ? void 0 : _a.get(name)) || !skipObjectFunctionPropertyAugment ? (_b = type.propertyCache) == null ? void 0 : _b.get(name) : void 0;
    if (!property) {
      property = createUnionOrIntersectionProperty(type, name, skipObjectFunctionPropertyAugment);
      if (property) {
        const properties = skipObjectFunctionPropertyAugment ? type.propertyCacheWithoutObjectFunctionPropertyAugment || (type.propertyCacheWithoutObjectFunctionPropertyAugment = createSymbolTable()) : type.propertyCache || (type.propertyCache = createSymbolTable());
        properties.set(name, property);
        if (skipObjectFunctionPropertyAugment && !((_c = type.propertyCache) == null ? void 0 : _c.get(name))) {
          const properties2 = type.propertyCache || (type.propertyCache = createSymbolTable());
          properties2.set(name, property);
        }
      }
    }
    return property;
  }
  function getCommonDeclarationsOfSymbols(symbols) {
    let commonDeclarations;
    for (const symbol of symbols) {
      if (!symbol.declarations) {
        return void 0;
      }
      if (!commonDeclarations) {
        commonDeclarations = new Set(symbol.declarations);
        continue;
      }
      commonDeclarations.forEach((declaration) => {
        if (!contains(symbol.declarations, declaration)) {
          commonDeclarations.delete(declaration);
        }
      });
      if (commonDeclarations.size === 0) {
        return void 0;
      }
    }
    return commonDeclarations;
  }
  function getPropertyOfUnionOrIntersectionType(type, name, skipObjectFunctionPropertyAugment) {
    const property = getUnionOrIntersectionProperty(type, name, skipObjectFunctionPropertyAugment);
    return property && !(getCheckFlags(property) & 16 /* ReadPartial */) ? property : void 0;
  }
  function getReducedType(type) {
    if (type.flags & 1048576 /* Union */ && type.objectFlags & 16777216 /* ContainsIntersections */) {
      return type.resolvedReducedType || (type.resolvedReducedType = getReducedUnionType(type));
    } else if (type.flags & 2097152 /* Intersection */) {
      if (!(type.objectFlags & 16777216 /* IsNeverIntersectionComputed */)) {
        type.objectFlags |= 16777216 /* IsNeverIntersectionComputed */ | (some(getPropertiesOfUnionOrIntersectionType(type), isNeverReducedProperty) ? 33554432 /* IsNeverIntersection */ : 0);
      }
      return type.objectFlags & 33554432 /* IsNeverIntersection */ ? neverType : type;
    }
    return type;
  }
  function getReducedUnionType(unionType) {
    const reducedTypes = sameMap(unionType.types, getReducedType);
    if (reducedTypes === unionType.types) {
      return unionType;
    }
    const reduced = getUnionType(reducedTypes);
    if (reduced.flags & 1048576 /* Union */) {
      reduced.resolvedReducedType = reduced;
    }
    return reduced;
  }
  function isNeverReducedProperty(prop) {
    return isDiscriminantWithNeverType(prop) || isConflictingPrivateProperty(prop);
  }
  function isDiscriminantWithNeverType(prop) {
    return !(prop.flags & 16777216 /* Optional */) && (getCheckFlags(prop) & (192 /* Discriminant */ | 131072 /* HasNeverType */)) === 192 /* Discriminant */ && !!(getTypeOfSymbol(prop).flags & 131072 /* Never */);
  }
  function isConflictingPrivateProperty(prop) {
    return !prop.valueDeclaration && !!(getCheckFlags(prop) & 1024 /* ContainsPrivate */);
  }
  function isGenericReducibleType(type) {
    return !!(type.flags & 1048576 /* Union */ && type.objectFlags & 16777216 /* ContainsIntersections */ && some(type.types, isGenericReducibleType) || type.flags & 2097152 /* Intersection */ && isReducibleIntersection(type));
  }
  function isReducibleIntersection(type) {
    const uniqueFilled = type.uniqueLiteralFilledInstantiation || (type.uniqueLiteralFilledInstantiation = instantiateType(type, uniqueLiteralMapper));
    return getReducedType(uniqueFilled) !== uniqueFilled;
  }
  function elaborateNeverIntersection(errorInfo, type) {
    if (type.flags & 2097152 /* Intersection */ && getObjectFlags(type) & 33554432 /* IsNeverIntersection */) {
      const neverProp = find(getPropertiesOfUnionOrIntersectionType(type), isDiscriminantWithNeverType);
      if (neverProp) {
        return chainDiagnosticMessages(errorInfo, Diagnostics.The_intersection_0_was_reduced_to_never_because_property_1_has_conflicting_types_in_some_constituents, typeToString(
          type,
          /*enclosingDeclaration*/
          void 0,
          536870912 /* NoTypeReduction */
        ), symbolToString(neverProp));
      }
      const privateProp = find(getPropertiesOfUnionOrIntersectionType(type), isConflictingPrivateProperty);
      if (privateProp) {
        return chainDiagnosticMessages(errorInfo, Diagnostics.The_intersection_0_was_reduced_to_never_because_property_1_exists_in_multiple_constituents_and_is_private_in_some, typeToString(
          type,
          /*enclosingDeclaration*/
          void 0,
          536870912 /* NoTypeReduction */
        ), symbolToString(privateProp));
      }
    }
    return errorInfo;
  }
  function getPropertyOfType(type, name, skipObjectFunctionPropertyAugment, includeTypeOnlyMembers) {
    var _a, _b;
    type = getReducedApparentType(type);
    if (type.flags & 524288 /* Object */) {
      const resolved = resolveStructuredTypeMembers(type);
      const symbol = resolved.members.get(name);
      if (symbol && !includeTypeOnlyMembers && ((_a = type.symbol) == null ? void 0 : _a.flags) & 512 /* ValueModule */ && ((_b = getSymbolLinks(type.symbol).typeOnlyExportStarMap) == null ? void 0 : _b.has(name))) {
        return void 0;
      }
      if (symbol && symbolIsValue(symbol, includeTypeOnlyMembers)) {
        return symbol;
      }
      if (skipObjectFunctionPropertyAugment)
        return void 0;
      const functionType = resolved === anyFunctionType ? globalFunctionType : resolved.callSignatures.length ? globalCallableFunctionType : resolved.constructSignatures.length ? globalNewableFunctionType : void 0;
      if (functionType) {
        const symbol2 = getPropertyOfObjectType(functionType, name);
        if (symbol2) {
          return symbol2;
        }
      }
      return getPropertyOfObjectType(globalObjectType, name);
    }
    if (type.flags & 2097152 /* Intersection */) {
      const prop = getPropertyOfUnionOrIntersectionType(
        type,
        name,
        /*skipObjectFunctionPropertyAugment*/
        true
      );
      if (prop) {
        return prop;
      }
      if (!skipObjectFunctionPropertyAugment) {
        return getPropertyOfUnionOrIntersectionType(type, name, skipObjectFunctionPropertyAugment);
      }
      return void 0;
    }
    if (type.flags & 1048576 /* Union */) {
      return getPropertyOfUnionOrIntersectionType(type, name, skipObjectFunctionPropertyAugment);
    }
    return void 0;
  }
  function getSignaturesOfStructuredType(type, kind) {
    if (type.flags & 3670016 /* StructuredType */) {
      const resolved = resolveStructuredTypeMembers(type);
      return kind === 0 /* Call */ ? resolved.callSignatures : resolved.constructSignatures;
    }
    return emptyArray;
  }
  function getSignaturesOfType(type, kind) {
    const result = getSignaturesOfStructuredType(getReducedApparentType(type), kind);
    if (kind === 0 /* Call */ && !length(result) && type.flags & 1048576 /* Union */) {
      if (type.arrayFallbackSignatures) {
        return type.arrayFallbackSignatures;
      }
      let memberName;
      if (everyType(type, (t) => {
        var _a;
        return !!((_a = t.symbol) == null ? void 0 : _a.parent) && isArrayOrTupleSymbol(t.symbol.parent) && (!memberName ? (memberName = t.symbol.escapedName, true) : memberName === t.symbol.escapedName);
      })) {
        const arrayArg = mapType(type, (t) => getMappedType((isReadonlyArraySymbol(t.symbol.parent) ? globalReadonlyArrayType : globalArrayType).typeParameters[0], t.mapper));
        const arrayType = createArrayType(arrayArg, someType(type, (t) => isReadonlyArraySymbol(t.symbol.parent)));
        return type.arrayFallbackSignatures = getSignaturesOfType(getTypeOfPropertyOfType(arrayType, memberName), kind);
      }
      type.arrayFallbackSignatures = result;
    }
    return result;
  }
  function isArrayOrTupleSymbol(symbol) {
    if (!symbol || !globalArrayType.symbol || !globalReadonlyArrayType.symbol) {
      return false;
    }
    return !!getSymbolIfSameReference(symbol, globalArrayType.symbol) || !!getSymbolIfSameReference(symbol, globalReadonlyArrayType.symbol);
  }
  function isReadonlyArraySymbol(symbol) {
    if (!symbol || !globalReadonlyArrayType.symbol) {
      return false;
    }
    return !!getSymbolIfSameReference(symbol, globalReadonlyArrayType.symbol);
  }
  function findIndexInfo(indexInfos, keyType) {
    return find(indexInfos, (info) => info.keyType === keyType);
  }
  function findApplicableIndexInfo(indexInfos, keyType) {
    let stringIndexInfo;
    let applicableInfo;
    let applicableInfos;
    for (const info of indexInfos) {
      if (info.keyType === stringType) {
        stringIndexInfo = info;
      } else if (isApplicableIndexType(keyType, info.keyType)) {
        if (!applicableInfo) {
          applicableInfo = info;
        } else {
          (applicableInfos || (applicableInfos = [applicableInfo])).push(info);
        }
      }
    }
    return applicableInfos ? createIndexInfo(unknownType, getIntersectionType(map(applicableInfos, (info) => info.type))
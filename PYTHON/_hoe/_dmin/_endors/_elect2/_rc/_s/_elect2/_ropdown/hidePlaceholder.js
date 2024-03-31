links.nameType = nameType;
    }
    return symbol;
  }
  function transformTypeOfMembers(type, f) {
    const members = createSymbolTable();
    for (const property of getPropertiesOfObjectType(type)) {
      const original = getTypeOfSymbol(property);
      const updated = f(original);
      members.set(property.escapedName, updated === original ? property : createSymbolWithType(property, updated));
    }
    return members;
  }
  function getRegularTypeOfObjectLiteral(type) {
    if (!(isObjectLiteralType(type) && getObjectFlags(type) & 8192 /* FreshLiteral */)) {
      return type;
    }
    const regularType = type.regularType;
    if (regularType) {
      return regularType;
    }
    const resolved = type;
    const members = transformTypeOfMembers(type, getRegularTypeOfObjectLiteral);
    const regularNew = createAnonymousType(resolved.symbol, members, resolved.callSignatures, resolved.constructSignatures, resolved.indexInfos);
    regularNew.flags = res
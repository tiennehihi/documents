eCount: () => typeCount,
    getInstantiationCount: () => totalInstantiationCount,
    getRelationCacheSizes: () => ({
      assignable: assignableRelation.size,
      identity: identityRelation.size,
      subtype: subtypeRelation.size,
      strictSubtype: strictSubtypeRelation.size
    }),
    isUndefinedSymbol: (symbol) => symbol === undefinedSymbol,
    isArgumentsSymbol: (symbol) => symbol === argumentsSymbol,
    isUnknownSymbol: (symbol) => symbol === unknownSymbol,
    getMergedSymbol,
    getDiagnostics,
    getGlobalDiagnostics,
    getRecursionIdentity,
    getUnmatchedProperties,
    getTypeOfSymbolAtLocation: (symbol, locationIn) => {
      const location = getParseTreeNode(locationIn);
      return lo
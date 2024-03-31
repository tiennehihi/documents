mapper);
      break;
    }
    return extraTypes ? getUnionType(append(extraTypes, result)) : result;
    function canTailRecurse(newType, newMapper) {
      if (newType.flags & 16777216 /* Conditional */ && newMapper) {
        const newRoot = newType.root;
        if (newRoot.outerTypeParameters) {
          const typeParamMapper = combineTypeMappers(newType.mapper, newMapper);
          const typeArguments = map(newRoot.outerTypeParameters, (t) => getMappedType(t, typeParamMapper));
          const newRootMapper = createTypeMapper(newRoot.outerTypeParameters, typeArguments);
          const newCheckType = newRoot.isDistributive ? getMappedType(newRoot.checkType, newRootMapper) : void 0;
          if (!newCheckType || newCheckType === newRoot.checkType || !(newCheckType.flags & (1048576 /* Union */ | 131072 /* Never */))) {
            root = newRoot;
            mapper = newRootMapper;
            aliasSymbol = void 0;
            aliasTypeArguments = v
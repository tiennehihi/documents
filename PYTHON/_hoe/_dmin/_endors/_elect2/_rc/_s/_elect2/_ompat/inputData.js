ed */ || includes & 16777216 /* IncludesEmptyObject */ && includes & 470302716 /* DefinitelyNonNullable */) {
      if (!noSupertypeReduction)
        removeRedundantSupertypes(typeSet, includes);
    }
    if (includes & 262144 /* IncludesMissingType */) {
      typeSet[typeSet.indexOf(undefinedType)] = missingType;
    }
    if (typeSet.length === 0) {
      return unknownType;
    }
    if (typeSet.length === 1) {
      return typeSet[0];
    }
    if (typeSet.length === 2) {
      const typeVarIndex = typeSet[0].flags & 8650752 /* TypeVariable */ ? 0 : 1;
      const typeVariable = typeSet[typeVarIndex];
      const primitiveType = typeSet[1 - typeVarIndex];
      if (typeVariable.flags & 8650752 /* TypeVariable */ && (primitiveType.flags & (402784252 /* Primitive */ | 67108864 /* NonPrimitive */) || includes & 16777216 /* IncludesEmptyObject */)) {
        const constraint = getBaseConstraintOfType(typeVariable);
        if (constraint && everyType(constraint, (t) => !!(t.flags & (402784252 /* Primitive */ | 67108864 /* NonPrimitive */)) || isEmptyAnonymousObjectType(t))) {
          if (isTypeStrictSubtypeOf(constraint, primitiveType)) {
            return typeVariable;
          }
          if (!(constraint.flags & 1048576 /* Union */ && someType(constraint, (c) => isTypeStrictSubtypeOf(c, primitiveType)))) {
            if (!isTypeStrictSubtypeOf(primitiveType, constraint)) {
              return neverType;
            }
          }
          objectFlags = 67108864 /* IsConstrainedTypeVariable */;
        }
      }
    }
    const id = getTypeListId(typeSet) + getAliasId(aliasSymbol, aliasTypeArguments);
    let result = intersectionTypes.get(id);
    if (!result) {
      if (includes & 1048576 /* Union */) {
        if (intersectUnionsOfPrimitiveTypes(typeSet)) {
          result = getIntersectionType(typeSet, aliasSymbol, aliasTypeArguments);
        } else if (every(typeSet, (t) => !!(t.flags & 1048576 /* Union */ && t.types[0].flags & 32768 /* Undefined */))) {
          const containedUndefinedType = some(typeSet, containsMissingType) ? missingType : undefinedType;
          removeFromEach(typeSet, 32768 /* Undefined */);
          result = getUnionType([getIntersectionType(typeSet), containedUndefinedType], 1 /* Literal */, aliasSymbol, aliasTypeArguments);
        } else if (every(typeSet, (t) => !!(t.flags & 1048576 /* Union */ && (t.types[0].flags & 65536 /* Null */ || t.types[1].flags & 65536 /* Null */)))) {
          removeFromEach(typeSet, 65536 /* Null */);
          result = getUnionType([getIntersectionType(typeSet), nullType], 1 /* Literal */, aliasSymbol, aliasTypeArguments);
        } else {
          if (!checkCrossProductUnion(typeSet)) {
            return errorType;
          }
          const constituents = getCrossProductIntersections(typeSet);
          const origin = some(constituents, (t) => !!(t.flags & 2097152 /* Intersection */)) && getConstituentCountOfTypes(consti
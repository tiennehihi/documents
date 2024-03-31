 */) {
      const newAliasSymbol = aliasSymbol || type.aliasSymbol;
      const newAliasTypeArguments = aliasSymbol ? aliasTypeArguments : instantiateTypes(type.aliasTypeArguments, mapper);
      return getIndexedAccessType(
        instantiateType(type.objectType, mapper),
        instantiateType(type.indexType, mapper),
        type.accessFlags,
        /*accessNode*/
        void 0,
        newAliasSymbol,
        newAliasTypeArguments
      );
    }
    if (flags & 16777216 /* Conditional */) {
      return getConditionalTypeInstantiation(
        type,
        combineTypeMappers(type.mapper, mapper),
        /*forConstraint*/
        false,
        aliasSymbol,
        aliasTypeArguments
      );
    }
    if (flags & 33554432 /* Substitution */) {
      const newBaseType = instantiateType(type.baseType, mapper);
      if (isNoInferType(type)) {
        return getNoInferType(newBaseType);
      }
      const newConstraint = instantiateType(type.constraint, mapper);
      if (newBaseType.flags & 8650752 /* TypeVariable */ && isGenericType(newConstraint)) {
        return getSubstitutionType(newBaseType, newConstraint);
      }
      if (newConstraint.flags & 3 /* AnyOrUnknown */ || isTypeAssignableTo(getRestrictiveInstantiation(newBaseType), getRestrictiveInstantiation(newConstraint))) {
        return newBaseType;
      }
      return newBaseType.flags & 8650752 /* TypeVariable */ ? getSubstitutionType(newBaseType, newConstraint) : getIntersectionType([newConstraint, newBaseType]);
    }
    return type;
  }
  function instantiateReverseMappedType(type, mapper) {
    const innerMappedType = instantiateType(type.mappedType, mapper);
    if (!(getObjectFlags(innerMappedType) & 32 /* Mapped */)) {
      return type;
    }
    const innerIndexType = instantiateType(type.constraintType, mapper);
    if (!(innerIndexType.flags & 4194304 /* Index */)) {
      return type;
    }
    const instanti
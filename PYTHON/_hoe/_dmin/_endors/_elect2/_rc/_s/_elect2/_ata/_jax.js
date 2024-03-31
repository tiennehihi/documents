   return result;
  }
  function getObjectTypeInstantiation(type, mapper, aliasSymbol, aliasTypeArguments) {
    const declaration = type.objectFlags & 4 /* Reference */ ? type.node : type.objectFlags & 8388608 /* InstantiationExpressionType */ ? type.node : type.symbol.declarations[0];
    const links = getNodeLinks(declaration);
    const target = type.objectFlags & 4 /* Reference */ ? links.resolvedType : type.objectFlags & 64 /* Instantiated */ ? type.target : type;
    let typeParameters = links.outerTypeParameters;
    if (!typeParameters) {
      let outerTypeParameters = getOuterTypeParameters(
        declaration,
        /*includeThisTypes*/
        true
      );
      if (isJSConstructor(declaration)) {
        const templateTagParameters = getTypeParametersFromDeclaration(declaration);
        outerTypeParameters = addRange(outerTypeParameters, templateTagParameters);
      }
      typeParameters = outerTypeParameters || emptyArray;
      const allDeclarations = type.objectFlags & (4 /* Reference */ | 8388608 /* InstantiationExpressionType */) ? [declaration] : type.symbol.declarations;
      typeParameters = (target.objectFlags & (4 /* Reference */ | 8388608 /* InstantiationExpressionType */) || target.symbol.flags & 8192 /* Method */ || target.symbol.flags & 2048 /* TypeLiteral */) && !target.aliasTypeArguments ? filter(typeParameters, (tp) => some(allDeclarations, (d) => isTypeParameterPossiblyReferenced(tp, d))) : typeParameters;
      links.outerTypeParameters = typeParameters;
    }
    if (typeParameters.length) {
      const combinedMapper = combineTypeMappers(type.mapper, mapper);
      const typeArguments = map(typeParameters, (t) => getMappedType(t, combinedMapper));
      const newAliasSymbol = aliasSymbol || type.aliasSymbol;
      const newAliasTypeArguments = aliasSymbol ? aliasTypeArguments : instantiateTypes(type.aliasTypeArguments, mapper);
      const id = getTypeListId(typeArguments) + getAliasId(newAliasSymbol, newAliasTypeArguments);
      if (!target.instantiations) {
        target.instantiations = /* @__PURE__ */ new Map();
        target.instantiations.set(getTypeListId(typeParameters) + getAliasId(target.aliasSymbol, target.aliasTypeArguments), target);
      }
      let result = target.instantiations.get(id);
      if (!result) {
        const newMapper = createTypeMapper(typeParameters, typeArguments);
        result = target.objectFlags & 4 /* Reference */ ? createDeferredTypeReference(type.target, type.node, newMapper, newAliasSymbol, newAliasTypeArguments) : target.objectFlags & 32 /* Mapped */ ? instantiateMappedType(target, newMapper, newAliasSymbol, newAliasTypeArguments) : instantiateAnonymousType(target, newMapper, newAliasSymbol, newAliasTypeArguments);
        target.instantiations.set(id, result);
        const resultObjectFlags = getObjectFlag
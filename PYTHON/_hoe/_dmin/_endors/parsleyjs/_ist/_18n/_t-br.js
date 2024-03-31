getSymbolFlags(
        symbol,
        /*excludeTypeOnlyMeanings*/
        true
      ) & 111551 /* Value */ && !isConstEnumOrConstEnumOnlyModule(target);
      if (markAlias) {
        markAliasSymbolAsReferenced(symbol);
      }
    }
  }
  function markAliasSymbolAsReferenced(symbol) {
    Debug.assert(canCollectSymbolAliasAccessabilityData);
    const links = getSymbolLinks(symbol);
    if (!links.referenced) {
      links.referenced = true;
      const node = getDeclarationOfAliasSymbol(symbol);
      if (!node)
        return Debug.fail();
      if (isInternalModuleImportEqualsDeclaration(node)) {
        if (getSymbolFlags(resolveSymbol(symbol)) & 111551 /* Value */) {
          checkExpressionCached(node.moduleReference);
        }
      }
    }
  }
  function markConstEnumAliasAsReferenced(symbol) {
    const links = getSymbolLinks(symbol);
    if (!links.constEnumReferenced) {
      links.constEnumReferenced = true;
    }
  }
  function getSymbolOfPartOfRightHandSideOfImportEquals(entityName, dontResolveAlias) {
    if (entityName.kind === 80 /* Identifier */ && isRightSideOfQualifiedNameOrPropertyAccess(entityName)) {
      entityName = entityName.parent;
    }
    if (entityName.kind === 80 /* Identifier */ || entityName.parent.kind === 166 /* QualifiedName */) {
      return resolveEntityName(
        entityName,
        1920 /* Namespace */,
        /*ignoreErrors*/
        false,
 
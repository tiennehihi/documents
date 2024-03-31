ain.length);
      const symbol = chain[index];
      const symbolId = getSymbolId(symbol);
      if ((_a = context.typeParameterSymbolList) == null ? void 0 : _a.has(symbolId)) {
        return void 0;
      }
      (context.typeParameterSymbolList || (context.typeParameterSymbolList = /* @__PURE__ */ new Set())).add(symbolId);
      let typeParameterNodes;
      if (context.flags & 512 /* WriteTypeParametersInQualifiedName */ && index < chain.length - 1) {
        const parentSymbol = symbol;
        const nextSymbol = chain[index + 1];
        if (getCheckFlags(nextSymbol) & 1 /* Instantiated */) {
          const params = getTypeParametersOfClassOrInterface(
            parentSymbol.flags & 2097152 /* Alias */ ? resolveAlias(parentSymbol) : parentSymbol
          );
          typeParameterNodes = mapToTypeNodes(map(params, (t) => getMappedType(t, nextSymbol.links.mapper)), context);
        } else {
          typeParameterNodes = typeParametersToTypeParameterDeclarations(symbol, context);
        }
      }
      return typeParameterNodes;
    }
    function getTopmostIndexedAccessType(top) {
      if (isIndexedAccessTypeNode(top.objectType)) {
        return getTopmostIndexedAccessType(top.objectType);
      }
      return top;
    }
    function getSpecifierForModuleSymbol(symbol, context, overrideImportMode) {
      let file = getDeclarationOfKind(symbol, 312 /* SourceFile */);
      if (!file) {
        const equivalentFileSymbol = firstDefined(symbol.declarations, (d) => getFileSymbolIfFileSymbolExportEqualsContainer(d, symbol));
        if (equivalentFileSymbol) {
          file = getDeclarationOfKind(equivalentFileSymbol, 312 /* SourceFile */);
        }
      }
      if (file && file.moduleName !== void 0) {
        return file.moduleName;
      }
      if (!file) {
        if (context.tracker.trackReferencedAmbientModule) {
          const ambientDecls = filter(symbol.declarations, isAmbientModule);
          if (length(ambientDecls)) {
            for (const decl of ambientDecls) {
              context.tracker.trackReferencedAmbientModule(decl, symbol);
            }
          }
        }
        if (ambientModuleSymbolRegex.test(symbol.escapedName)) {
          return symbol.escapedName.substring(1, symbol.escapedName.length - 1);
        }
      }
      if (!context.enclosingDeclaration || !context.tracker.moduleResolverHost) {
        if (ambientModuleSymbolRegex.test(symbol.escapedName)) {
          return symbo
olFromVariable = resolveSymbol(symbolFromVariable, dontResolveAlias);
        let symbolFromModule = getExportOfModule(targetSymbol, name, specifier, dontResolveAlias);
        if (symbolFromModule === void 0 && name.escapedText === "default" /* Default */) {
          const file = (_a = moduleSymbol.declarations) == null ? void 0 : _a.find(isSourceFile);
          if (isOnlyImportedAsDefault(moduleSpecifier) || canHaveSyntheticDefault(file, moduleSymbol, dontResolveAlias, moduleSpecifier)) {
            symbolFromModule = resolveExternalModuleSymbol(moduleSymbol, dontResolveAlias) || resolveSymbol(moduleSymbol, dontResolveAlias);
          }
        }
        const symbol = symbolFromModule && symbolFromVariable && symbolFromModule !== symbolFromVariable ? combineValueAndTypeSymbols(symbolFromVariable, symbolFromModule) : symbolFromModule || symbolFromVariable;
        if (!symbol) {
          errorNoModuleMemberSymbol(moduleSymbol, targetSymbol, node, name);
        }
        return symbol;
      }
    }
  }
  function errorNoModuleMemberSymbol(moduleSymbol, targetSymbol, node, name) {
    var _a;
    const moduleName = getFullyQualifiedName(moduleSymbol, node);
    const declarationName = declarationNameToString(name);
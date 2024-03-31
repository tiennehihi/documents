   error(getTypeDeclaration(symbol), Diagnostics.Global_type_0_must_have_1_type_parameter_s, symbolName(symbol), arity);
      return arity ? emptyGenericType : emptyObjectType;
    }
    return type;
  }
  function getGlobalValueSymbol(name, reportErrors2) {
    return getGlobalSymbol(name, 111551 /* Value */, reportErrors2 ? Diagnostics.Cannot_find_global_value_0 : void 0);
  }
  function getGlobalTypeSymbol(name, reportErrors2) {
    return getGlobalSymbol(name, 788968 /* Type */, reportErrors2 ? Diagnostics.Cannot_find_global_type_0 : void 0);
  }
  function getGlobalTypeAliasSymbol(name, arity, reportErrors2) {
    const symbol = getGlobalSymbol(name, 788968 /* Type */, reportErrors2 ? Diagnostics.Cannot_find_global_type_0 : void 0);
    if (symbol) {
      getDeclaredTypeOfSymbol(symbol);
      if (length(getSymbolLinks(symbol).typeParameters) !== arity) {
        const decl = symbol.declarations && find(symbol.declarations, isTypeAliasDeclaration);
        error(decl, Diagnostics.Global_type_0_must_have_1_type_parameter_s, symbolName(symbol), arity);
        return void 0;
      }
    }
    return symbol;
  }
  function getGlobalSymbol(name, meaning, diagnostic) {
    return resolveName(
      /*location*/
      void 0,
      name,
      meaning,
      diagnostic,
      name,
      /*isUse*/
      false,
      /*excludeGlobals*/
      false,
      /*getSpellingSuggestions*/
      false
    );
  }
  function getGlobalType(nam
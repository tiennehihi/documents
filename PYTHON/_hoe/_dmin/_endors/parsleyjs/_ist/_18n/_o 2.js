ation, callback) {
    let result;
    for (let location = enclosingDeclaration; location; location = location.parent) {
      if (canHaveLocals(location) && location.locals && !isGlobalSourceFile(location)) {
        if (result = callback(
          location.locals,
          /*ignoreQualification*/
          void 0,
          /*isLocalNameLookup*/
          true,
          location
        )) {
          return result;
        }
      }
      switch (location.kind) {
        case 312 /* SourceFile */:
          if (!isExternalOrCommonJsModule(location)) {
            break;
          }
        case 267 /* ModuleDeclaration */:
          const sym = getSymbolOfDeclaration(location);
          if (result = callback(
            (sym == null ? void 0 : sym.exports) || emptySymbols,
            /*ignoreQualification*/
            void 0,
            /*isLocalNameLookup*/
            true,
            location
          )) {
            return result;
          }
          break;
        case 263 /* ClassDeclaration */:
        case 231 /* ClassExpression */:
        case 264 /* InterfaceDeclaration */:
          let table;
          (getSymbolOfDeclaration(location).members || emptySymbols).forEach((memberSymbol, key) => {
            if (memberSymbol.flags & (788968 /* Type */ & ~67108864 /* Assignment */)) {
              (t
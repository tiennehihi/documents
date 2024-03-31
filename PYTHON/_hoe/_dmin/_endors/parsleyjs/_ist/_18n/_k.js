WithNSPrintableAsSignatureMerge = isConstMergedWithNS && isTypeRepresentableAsFunctionNamespaceMerge(getTypeOfSymbol(symbol), symbol);
        if (symbol.flags & (16 /* Function */ | 8192 /* Method */) || isConstMergedWithNSPrintableAsSignatureMerge) {
          serializeAsFunctionNamespaceMerge(getTypeOfSymbol(symbol), symbol, getInternalSymbolName(symbol, symbolName2), modifierFlags);
        }
        if (symbol.flags & 524288 /* TypeAlias */) {
          serializeTypeAlias(symbol, symbolName2, modifierFlags);
        }
        if (symbol.flags & (2 /* BlockScopedVariable */ | 1 /* FunctionScopedVariable */ | 4 /* Property */ | 98304 /* Accessor */) && escapedSymbolName !== "export=" /* ExportEquals */ && !(symbol.flags & 4194304 /* Prototype */) && !(symbol.flags & 32 /* Class */) && !(symbol.flags & 8192 /* Method */) && !isConstMergedWithNSPrintableAsSignatureMerge) {
          if (propertyAsAlias) {
            const createdExport = serializeMaybeAliasAssignment(symbol);
            if (createdExport) {
              needsExportDeclaration = false;
              needsPostExportDefault = false;
            }
          } else {
            const type = getTypeOfSymbol(symbol);
            const localName = getInternalSymbolName(symbol, symbolName2);
            if (type.symbol && type.symbol !== symbol && type.symbol.flags & 16 /* Function */ && some(type.symbol.declarations, isFunctionExpressionOrArrowFunction) && (((_a2 = type.symbol.members) == null ? void 0 : _a2.size) || ((_b = type.symbol.exports) == null ? void 0 : _b.size))) {
              if (!context.remappedSymbolReferences) {
                context.remappedSymbolReferences = /* @__PURE__ */ new Map();
     
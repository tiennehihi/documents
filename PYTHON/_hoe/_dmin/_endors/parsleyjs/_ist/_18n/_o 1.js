s)) {
          diagnosticMessage = error(errorLocation, Diagnostics.Enum_0_used_before_its_declaration, declarationName);
        }
      }
      if (diagnosticMessage) {
        addRelatedInfo(diagnosticMessage, createDiagnosticForNode(declaration, Diagnostics._0_is_declared_here, declarationName));
      }
    }
  }
  function isSameScopeDescendentOf(initial, parent, stopAt) {
    return !!parent && !!findAncestor(initial, (n) => n === parent || (n === stopAt || isFunctionLike(n) && (!getImmediatelyInvokedFunctionExpression(n) || getFunctionFlags(n) & 3 /* AsyncGenerator */) ? "quit" : false));
  }
  function getAnyImportSyntax(node) {
    switch (node.kind) {
      case 271 /* ImportEqualsDeclaration */:
        return node;
      case 273 /* ImportClause */:
        return node.parent;
      case 274 /* NamespaceImport */:
        return node.parent.parent;
      case 276 /* ImportSpecifier */:
        return node.parent.parent.parent;
      default:
        return void 0;
    }
  }
  function getDeclarationOfAliasSymbol(symbol) {
    return symbol.declarations && findLast(symbol.declarations, isAliasSymbolDeclaration);
  }
  function isAliasSymbolDeclaration(node) {
    return node.kind === 271 /* ImportEqualsDeclaration */ || node.kind === 270 /* NamespaceExportDeclaration */ 
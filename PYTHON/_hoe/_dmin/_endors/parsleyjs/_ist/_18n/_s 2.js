    for (const decl of symbol.declarations) {
          pushIfUnique(locs, decl);
        }
      }
    }
  }
  function addDuplicateDeclarationErrorsForSymbols(target, message, symbolName2, source) {
    forEach(target.declarations, (node) => {
      addDuplicateDeclarationError(node, message, symbolName2, source.declarations);
    });
  }
  function addDuplicateDeclarationError(node, message, symbolName2, relatedNodes) {
    const errorNode = (getExpandoInitializer(
      node,
      /*isPrototypeAssignment*/
      false
    ) ? getNameOfExpando(node) : getNameOfDeclaration(node)) || node;
    const err = lookupOrIssueError(errorNode, message, symbolName2);
    for (const relatedNode of relatedNodes || emptyArray) {
      const adjustedNode = (getExpandoInitializer(
        relatedNode,
        /*isPrototypeAssignment*/
        false
      ) ? getNameOfExpando(relatedNode) : getNameOfDeclaration(relatedNode)) || relatedNode;
      if (adjustedNode === errorNode)
        continue;
      err.relatedInformation = err.relatedInformation || [];
      const leadingMessage = createDiagnosticForNode(adjustedNode, Diagnostics._0_was_also_declared_here, symbolName2);
      const followOnMessage = createDiagnosticForNode(adjustedNode, Diagnostics.and_here);
      if (length(err.relatedInformation) >= 5 || some(err.relatedInformation, (r) => comp
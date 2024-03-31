rtStarMap;
    }
    return links.resolvedExports;
  }
  function extendExportSymbols(target, source, lookupTable, exportNode) {
    if (!source)
      return;
    source.forEach((sourceSymbol, id) => {
      if (id === "default" /* Default */)
        return;
      const targetSymbol = target.get(id);
      if (!targetSymbol) {
        target.set(id, sourceSymbol);
        if (lookupTable && exportNode) {
          lookupTable.set(id, {
            specifierText: getTextOfNode(exportNode.moduleSpecifier)
          });
        }
      } else if (lookupTable && exportNode && targetSymbol && resolveSymbol(targetSymbol) !== resolveSymbol(sourceSymbol)) {
        const collisionTracker = looku
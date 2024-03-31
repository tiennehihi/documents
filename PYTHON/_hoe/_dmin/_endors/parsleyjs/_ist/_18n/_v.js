* Normal */
    ));
    for (const candidate of candidates) {
      candidatesSet.add(candidate);
    }
    return arrayFrom(candidatesSet);
  }
  function runWithoutResolvedSignatureCaching(node, fn) {
    node = findAncestor(node, isCallLikeOrFunctionLikeExpression);
    if (node) {
      const cachedResolvedSignatures = [];
      const cachedTypes2 = [];
      while (node) {
        const nodeLinks2 = getNodeLinks(node);
        cachedResolvedSignatures.push([nodeLinks2, nodeLinks2.resolvedSignature]);
        nodeLinks2.resolvedSignature = void 0;
        if (isFunctionExpressionOrArrowFunction(node)) {
          const symbolLinks2 = getSymbolLinks(getSymbolOfDeclaration(node));
          const type = symbolLinks2.type;
          cachedTypes2.push([symbolLinks2, type]);
          symbolLinks2.type = void 0;
        }
        node = findAncestor(node.parent, isCallLikeOrFunctionLikeExpression);
      }
      const result = fn();
      for (const [nodeLinks2, resolvedSignature] of cachedResolvedSignatures) {
        nodeLinks2.resolvedSignature = resolvedSignature;
      }
      for (const [symbolLinks2, type] of cachedTypes2) {
        symbolLinks2.type = type;
      }
      return result;
    }
    return fn();
  }
  function runWithInferenceBlockedFromSourceNode(node, fn) {
    const containingCall = findAncestor(node, isCallLikeExpression);
    if (co
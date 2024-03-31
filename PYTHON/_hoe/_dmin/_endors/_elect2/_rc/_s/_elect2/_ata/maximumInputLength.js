eObjectLiteralElements(node), source, target, relation, containingMessageChain, errorOutputContainer);
  }
  function checkTypeComparableTo(source, target, errorNode, headMessage, containingMessageChain) {
    return checkTypeRelatedTo(source, target, comparableRelation, errorNode, headMessage, containingMessageChain);
  }
  function isSignatureAssignableTo(source, target, ignoreReturnTypes) {
    return compareSignaturesRelated(
      source,
      target,
      ignoreReturnTypes ? 4 /* IgnoreReturnTypes */ : 0 /* None */,
      /*reportErrors*/
      false,
      /*errorReporter*/
      void 0,
      /*incompatibleErrorReporter*/
      void 0,
      compareTypesAssignable,
      /*reportUnreliableMarkers*/
  
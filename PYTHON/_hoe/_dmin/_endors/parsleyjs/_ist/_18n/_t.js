s ?? (container2.locals = createSymbolTable());
        declareSymbol(
          container2.locals,
          /*parent*/
          void 0,
          node,
          262144 /* TypeParameter */,
          526824 /* TypeParameterExcludes */
        );
      } else {
        bindAnonymousDeclaration(node, 262144 /* TypeParameter */, getDeclarationName(node));
      }
    } else {
      declareSymbolAndAddToSymbolTable(node, 262144 /* TypeParameter */, 526824 /* TypeParameterExcludes */);
    }
  }
  function shouldReportErrorOnModuleDeclaration(node) {
    const instanceState = getModuleInstanceState(node);
    return instanceState === 1 /* Instantiated */ || instanceState === 2 /* ConstEnumOnly */ && shouldPreserveConstEnums(options);
  }
  function checkUnreachable(node) {
    if (!(currentFlow.flags & 1 /* Unreachable */)) {
      return false;
    }
    if (currentFlow === unreachableFlow) {
      const reportError = (
        // report error on all statements except empty ones
        isStatementButNotDeclaration(node) && node.kind !== 242 /* EmptyStatement */ || // report error on class declarations
        node.kind === 263 /* ClassDeclaration */ || // report error on instantiated modules or const-enums only modules if preserveConstEnums is set
        node.kind === 267 /* ModuleDeclaration */ && shouldReportErrorOnModuleDeclaration(node)
      );
      if (reportError) {
        currentFlow = reportedUnreachableFlow;
        if (!o
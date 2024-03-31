ature.parameters : expandedParams).map((parameter) => symbolToParameterDeclaration(parameter, context, kind === 176 /* Constructor */, options == null ? void 0 : options.privateSymbolVisitor, options == null ? void 0 : options.bundledImports));
      const thisParameter = context.flags & 33554432 /* OmitThisParameter */ ? void 0 : tryGetThisParameterDeclaration(signature, context);
      if (thisParameter) {
        parameters.unshift(thisParameter);
      }
      let returnTypeNode;
      const typePredicate = getTypePredicateOfSignature(signature);
      if (typePredicate) {
        const assertsModifier = typePredicate.kind === 2 /* AssertsThis */ || typePredicate.kind === 3 /* AssertsIdentifier */ ? factory.createToken(131 /* AssertsKeyword */) : void 0;
        const parameterName = typePredicate.kind === 1 /* Identifier */ || typePredicate.kind === 3 /* AssertsIdentifier */ ? setEmitFlags(factory.createIdentifier(typePredicate.parameterName), 16777216 /* NoAsciiEscaping */) : factory.createThisTypeNode();
        const typeNode = typePredicate.type && typeToTypeNodeHelper(typePredicate.type, context);
        returnTypeNode = factory.createTypePredicateNode
       if (isInstantiationExpressionType) {
            const instantiationExpressionType = type2;
            const existing = instantiationExpressionType.node;
            if (isTypeQueryNode(existing) && getTypeFromTypeNode(existing) === type2) {
              const typeNode = serializeExistingTypeNode(context, existing);
              if (typeNode) {
                return typeNode;
              }
            }
            if ((_a2 = context.visitedTypes) == null ? void 0 : _a2.has(typeId)) {
              return createElidedInformationPlaceholder(context);
            }
            return visitAndTransformType(type2, createTypeNodeFromObjectType);
          }
          const isInstanceType = isClassInstanceSide(type2) ? 788968 /* Type */ : 111551 /* Value */;
          if (isJSConstructor(symbol.valueDeclaration)) {
            return symbolToTypeNode(symbol, context, isInstanceType);
          } else if (symbol.flags & 32 /* Class */ && !getBaseTypeVariableOfClass(symbol) && !(symbol.valueDeclaration && isClassLike(symbol.valueDeclaration) && context.flags & 2048 /* WriteClassExpressionAsTypeLiteral */ && (!isClassDeclaration(symbol.valueDeclaration) || isSymbolAccessible(
            symbol,
            context.enclosingDeclaration,
            isInstanceType,
            /*shouldComputeAliasesToMakeVisible*/
            false
          ).
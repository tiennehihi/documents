 !(nodeSymbol.flags & 788968 /* Type */) || // The import type had type arguments autofilled by js fallback logic
          !(length(node.typeArguments) >= getMinTypeArgumentCount(getLocalTypeParametersOfClassOrInterfaceOrTypeAlias(nodeSymbol))))) {
            return setOriginalNode(typeToTypeNodeHelper(getTypeFromTypeNode(node), context), node);
          }
          return factory.updateImportTypeNode(
            node,
            factory.updateLiteralTypeNode(node.argument, rewriteModu
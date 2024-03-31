xt.approximateLength += 6;
            return symbolToTypeNode(type.symbol, context, 111551 /* Value */);
          }
          if (context.tracker.reportInaccessibleUniqueSymbolError) {
            context.tracker.reportInaccessibleUniqueSymbolError();
          }
        }
        context.approximateLength += 13;
        return factory.createTypeOperatorNode(158 /* UniqueKeyword */, factory.createKeywordTypeNode(155 /* SymbolKeyword */));
      }
      if (type.flags & 16384 /* Void */) {
        context.approximateLength += 4;
        return factory.createKeywordTypeNode(116 /* VoidKeyword */);
      }
      if (type.flags & 32768 /* Undefined */) {
        context.approximateLength += 9;
        return factory.createKeywordTypeNode(157 /* UndefinedKeyword */);
      }
      if (type.flags & 65536 /* Null */) {
        context.approximateLength += 4;
        return factory.createLiteralTypeNode(factory.createNull());
      }
      if (type.flags & 131072 /* Never */) {
        context.approximateLength += 5;
        return factory.createKeywordTypeNode(146 /* NeverKeyword */);
      }
      if (type.flags & 4096 /* ESSymbol */) {
        context.approximateLength += 6;
        return factory.createKeywordTypeNode(155 /* SymbolKeyword */);
      }
      if (type.flags & 67108864 /* NonPrimitive */) {
        context.approximateLength += 6;
        return factory.createKeywordTypeNode(151 /* ObjectKeyword */);
      }
      if (isThisTypeParameter(type)) {
        if (context.flags & 4194304 /* InObjectTypeLiteral */) {
          if (!context.encounteredError && !(context.flags & 32768 /* AllowThisInObjectLiteral */)) {
            context.encounteredError = true;
          }
    
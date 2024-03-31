entationExternalModuleSymbol)) {
          return factory.createStringLiteral(getSpecifierForModuleSymbol(symbol2, context));
        }
        if (index === 0 || canUsePropertyAccess(symbolName2, languageVersion)) {
          const identifier = setEmitFlags(factory.createIdentifier(symbolName2), 16777216 /* NoAsciiEscaping */);
          if (typeParameterNodes)
            setIdentifierTypeArguments(identifier, factory.createNodeArray(typeParameterNodes));
          identifier.symbol = symbol2;
          return index > 0 ? factory.createPropertyAccessExpression(createExpressionFromSymbolChain(chain2, index - 1), identifier) : identifier;
        } else {
          if (firstChar === 91 /* openBracket */) {
            symbolName2 = symbolName2.substring(1, symbolName2.length - 1);
            firstChar = symbolName2.charCodeAt(0);
          }
          let expression;
          if (isSingleOrDoubleQuote(firstChar) && !(symbol2.flags & 8 /* EnumMember */)) {
            expression = factory.createStringLiteral(stripQuotes(symbolName2).replace(/\\./g, (s) => s.substring(1)), firstChar === 39 /* singleQuote */);
          } else if ("" + +symbolName2 === symbolName2) {
            expression = factory.createNumericLiteral(+symbolName2);
          }
          if (!expression) {
            const identifier = setEmitFlags(factory.createIdentifier(symbolName2), 16777216 /* NoAsciiEscaping */);
            if (typeParameterNodes)
              setIdentifierType
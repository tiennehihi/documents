ntLike */ && t & 64 /* BigInt */)
      return true;
    if (s & 528 /* BooleanLike */ && t & 16 /* Boolean */)
      return true;
    if (s & 12288 /* ESSymbolLike */ && t & 4096 /* ESSymbol */)
      return true;
    if (s & 32 /* Enum */ && t & 32 /* Enum */ && source.symbol.escapedName === target.symbol.escapedName && isEnumTypeRelatedTo(source.symbol, target.symbol, errorReporter))
      return true;
    if (s & 1024 /* EnumLiteral */ && t & 1024 /* EnumLiteral */) {
      if (s & 1048576 /* Union */ && t & 1048576 /* Union */ && isEnumTypeRelatedTo(source.symbol, target.symbol, errorReporter))
        return true;
      if (s & 2944 /* Literal */ && t & 2944 /* Literal */ && source.value === target.value && isEnumTypeRelatedTo(source.symbol, target.symbol, errorReporter))
        return true;
    }
    if (s & 32768 /*
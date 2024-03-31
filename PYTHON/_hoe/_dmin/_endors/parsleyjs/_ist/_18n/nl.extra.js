ternalModule = false;
    loop:
      while (location) {
        if (name === "const" && isConstAssertion(location)) {
          return void 0;
        }
        if (isModuleOrEnumDeclaration(location) && lastLocation && location.name === lastLocation) {
          lastLocation = location;
          location = location.parent;
        }
        if (canHaveLocals(location) && location.locals && !isGlobalSourceFile(location)) {
          if (result = lookup(location.locals, name, me
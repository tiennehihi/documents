dule_Consider_adding_an_import_instead, unescapeLeadingUnderscores(name));
          }
        }
        if (result && associatedDeclarationForContainingInitializerOrBindingName && !withinDeferredContext && (meaning & 111551 /* Value */) === 111551 /* Value */) {
          const candidate = getMergedSymbol(getLateBoundSymbol(result));
          const root = getRootDeclaration(associatedDeclarationForContainingInitializerOrBindingName);
          if (candidate === getSymbolOfDeclaration(associatedDeclarationForContainingInitializerOrBindingName)) {
            error(errorLocation, Diagnostics.Parameter_0_cannot_reference_itself, declarationNameToString(associatedDeclarationForContainingInitializerOrBindingName.name));
          } else if (candidate.valueDeclaration && candidate.valueDeclaration.pos > associatedDeclarationForContainingInitializerOrBindingName.pos && root.parent.locals && lookup(root.parent.locals, candidate.escapedName, meaning) === candidate) {
            error(errorLocation, Diagnostics.Parameter_0_cannot_reference_identifier_1_declared_after_it, declarationNameToString(associatedDeclarationForContainingInitializerOrBindingName.name), decla
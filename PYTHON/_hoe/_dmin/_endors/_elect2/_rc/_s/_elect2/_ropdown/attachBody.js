ties, excludedProperties)) {
        const name = targetProp.escapedName;
        if (!(targetProp.flags & 4194304 /* Prototype */) && (!numericNamesOnly || isNumericLiteralName(name) || name === "length") && (!optionalsOnly || targetProp.flags & 16777216 /* Optional */)) {
          const sourceProp = getPropertyOfType(source2, name);
          if (sourceProp && sourceProp !== targetProp) {
            const related = propertyRelatedTo(source2, target2, sourceProp, targetProp, getNonMissingTypeOfSymbol, reportErrors2, intersectionState, relation === comparableRelation);
            if (!related) {
              return 0 /* False */;
            }
            result2 &= related;
          }
        }
      }
      return result2;
    }
    function propertiesIdenticalTo(source2, target2, excludedProperties) {
      if (!(source2.flags & 524288 /* Object */ && target2.flags & 524288 /* Object */)) {
        return 0 /* False */;
      }
      const sourceProperties = excludeProperties(getPropertiesOfObjectType(source2), excludedProperties);
      const targetProperties = excludeProperties(getPropertiesOfObjectType(target2), excludedProperties);
      if (sourceProperties.length !== targetProperties.length) {
        return 0 /* False */;
      }
      let result2 = -1 /* True */;
      for (const sourceProp of sourceProperties) {
        const targetProp = getPropertyOfObjectType(target2, sourceProp.escapedName);
        if (!targetProp) {
          return 0 /* False */;
        }
        const related = compareProperties(sourceProp, targetProp, isRelatedTo);
        if (!related) {
          return 0 /* False */;
        }
        result2 &= related;
      }
      return result2;
    }
    function signaturesRelatedTo(source2, target2, kind, reportErrors2, intersectionState) {
      var _a2, _b;
      if (relation === identityRelation) {
        return signaturesIdenticalTo(source2, target2, kind);
      }
      if (target2 === anyFunctionType || source2 === anyFunctionType) {
        return -1 /* True */;
      }
      const sourceIsJSConstructor = source2.symbol && isJSConstructor(source2.symbol.valueDeclaration);
      const targetIsJSConstructor = target2.symbol && isJSConstructor(target2.symbol.valueDeclaration);
      const sourceSignatures = getSignaturesOfType(
        source2,
        sourceIsJSConstructor && kind === 1 /* Construct */ ? 0 /* Call */ : kind
      );
      const targetSignatures = getSignaturesOfType(
        target2,
        targetIsJSConstructor && kind === 1 /* Construct */ ? 0 /* Call */ : kind
      );
      if (kind === 1 /* Construct */ && sourceSignatures.length && targetSignatures.length) {
        const sourceIsAbstract = !!(sourceSignatures[0].flags & 4 /* Abstract */);
        const targetIsAbstract = !!(targetSignatures[0].flags & 4 /* Abstract */);
        if (sourceIsAbstract && !targetIsAbstract) {
          if (reportErrors2) {
            reportError(Diagnostics.Cannot_assign_an_abstract_constructor_type_to_a_non_abstract_constructor_type);
          }
          return 0 /* False */;
        }
        if (!constructorVisibilitiesAreCompatible(sourceSignatures[0], targetSignatures[0], reportErrors2)) {
          return 0 /* False */;
        }
      }
      let result2 = -1 /* True */;
      const incompatibleReporter = kind === 1 /* Construct */ ? reportIncompatibleConstructSignatureReturn : reportIncompatibleCallSignatureReturn;
      const sourceObjectFlags = getObjectFlags(source2);
      const targetObjectFlags = getObjectFlags(target2);
      if (sourceObjectFlags & 64 /* Instantiated */ && targetObjectFlags & 64 /* Instantiated */ && source2.symbol === target2.symbol || sourceObjectFlags & 4 /* Reference */ && targetObjectFlags & 4 /* Reference */ && source2.target === target2.target) {
        Debug.assertEqual(sourceSignatures.length, targetSignatures.length);
        for (let i = 0; i < targetSignatures.length; i++) {
          const related = signatureRelatedTo(
            sourceSignatures[i],
            targetSignatures[i],
            /*erase*/
            true,
            reportErrors2,
            intersectionState,
            incompatibleReporter(sourceSignatures[i], targetSignatures[i])
          );
          if (!related) {
            return 0 /* False */;
          }
          result2 &= related;
        }
      } else if (sourceSignatures.length === 1 && targetSignatures.length === 1) {
        const eraseGenerics = relation === comparableRelation || !!compilerOptions.noStrictGenericChecks;
        const sourceSignature = first(sourceSignatures);
        const targetSignature = first(targetSignatures);
        result2 = signatureRelatedTo(sourceSignature, targetSignature, eraseGenerics, reportErrors2, intersectionState, incompatibleReporter(sourceSignature, targetSignature));
        if (!result2 && reportErrors2 && kind === 1 /* Construct */ && sourceObjectFlags & targetObjectFlags && (((_a2 = targetSignature.declaration) == null ? void 0 : _a2.kind) === 176 /* Constructor */ || ((_b = sourceSignature.declaration) == null ? void 0 : _b.kind) === 176 /* Constructor */)) {
          const constructSignatureToString = (signature) => signatureToString(
            signature,
            /*enclosingDeclaration*/
            void 0,
            262144 /* WriteArrowStyleSignature */,
            kind
          );
          reportError(Diagnostics.Type_0_is_not_assignable_to_type_1, constructSignatureToString(sourceSignature), constructSignatureToString(targetSignature));
          reportError(Diagnostics.Types_of_construct_signatures_are_incompatible);
          return result2;
        }
      } else {
        outer:
          for (const t of targetSignatures) {
            const saveErrorInfo = captureErrorCalculationState();
            let shouldElaborateErrors = reportErrors2;
            for (const s of sourceSignatures) {
              const related = signatureRelatedTo(
                s,
                t,
                /*erase*/
                true,
                shouldElaborateErrors,
                intersectionState,
                inc
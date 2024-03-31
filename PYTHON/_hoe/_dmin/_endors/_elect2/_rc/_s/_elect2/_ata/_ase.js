accessNode*/
        void 0
      );
      if (!checkTypeRelatedTo(
        sourcePropType,
        targetPropType,
        relation,
        /*errorNode*/
        void 0
      )) {
        const elaborated = next && elaborateError(
          next,
          sourcePropType,
          targetPropType,
          relation,
          /*headMessage*/
          void 0,
          containingMessageChain,
          errorOutputContainer
        );
        reportedError = true;
        if (!elaborated) {
          const resultObj = errorOutputContainer || {};
          const specificSource = next ? checkExpressionForMutableLocationWithContextualType(next, sourcePropType) : sourcePropType;
          if (exactOptionalPropertyTypes && isExactOptionalPropertyMismatch(specificSource, targetPropType)) {
            const diag2 = createDiagnosticForNode(prop, Diagnostics.Type_0_is_not_assignable_to_type_1_with_exactOptionalPropertyTypes_Colon_true_Consider_adding_undefined_to_the_type_of_the_target, typeToStr
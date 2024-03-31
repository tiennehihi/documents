eOfNode(objectLiteralDeclaration) === getSourceFileOfNode(errorNode)) {
                  const propDeclaration = prop.valueDeclaration;
                  Debug.assertNode(propDeclaration, isObjectLiteralElementLike);
                  const name = propDeclaration.name;
                  errorNode = name;
                  if (isIdentifier(name)) {
                    suggestion = getSuggestionForNonexistentProperty(name, errorTarget);
                  }
                }
                if (suggestion !== void 0) {
                  reportParentSkippedError(Diagnostics.Object_literal_may_only_specify_known_properties_but_0_does_not_exist_in_type_1_Did_you_mean_to_write_2, symbolToString(prop), typeToString(errorTarget), suggestion);
                } else {
                  reportParentSkippedError(Diagnostics.Object_literal_may_only_specify_known_properties_and_0_does_not_exist_in_type_1, symbolToString(prop), typeToString(errorTarget));
                }
              }
            }
            return true;
          }
          if (checkTypes && !isRelatedTo(getTypeOfSymbol(prop), getTypeOfPropertyInTypes(checkTypes, prop.escapedName), 3 /* Both */, reportErrors2)) {
            if (reportErrors2) {
              reportIncompatibleError(Diagnostics.Types_of_property_0_are_incompatible, symbolToString(prop));
            }
            return true;
          }
        }
      }
      return false;
    }
    function shouldCheckAsExcessProperty(prop, container) {
      return prop.valueDeclaration && container.valueDeclaration && prop.valueDeclaration.parent === container.valueDeclaration;
    }
    function unionOrIntersectionRelatedTo(source2, target2, reportErrors2, intersectionState) {
      if (source2.flags & 1048576 /* Union */) {
        if (target2.flags & 1048576 /* Union */) {
          const sourceOrigin = source2.origin;
          if (sourceOrigin && sourceOrigin.flags & 2097152 /* Intersection */ && target2.aliasSymbol && contains(sourceOrigin.types, target2)) {
            return -1 /* True */;
          }
          const targetOrigin = target2.origin;
          if (targetOrigin && targetOrigin.flags & 1048576 /* Union */ && source2.aliasSymbol && contains(targetOrigin.types, source2)) {
            return -1 /* True */;
          }
        }
        return relation === comparableRelation ? someTypeRelatedToType(source2, target2, reportErrors2 && !(source2.flags & 402784252 /* Primitive */), intersectionState) : eachTypeRelatedToType(source2, target2, reportErrors2 && !(source2.flags & 402784252 /* Primitive */), intersectionState);
      }
      if (target2.flags & 1048576 /* Union */) {
        return typeRelatedToSomeType(getRegularTypeOfObjectLiteral(source2), target2, reportErrors2 && !(source2.flags & 402784252 /* Primitive */) && !(target2.flags & 402784252 /* Primitive */), intersectionState);
      }
      if (target2.flags & 2097152 /* Intersection */) {
        return typeRelatedToEachType(source2, target2, reportErrors2, 2 /* Target */);
      }
      if (relation === comparableRelation && target2.flags & 402784252 /* Primitive */) {
        const constraints = sameMap(source2.types, (t) => t.flags & 465829888 /* Instantiable */ ? getBaseConstraintOfType(t) || unknownType : t);
        if (constraints !== source2.types) {
          source2 = getIntersectionType(constraints);
          if (source2.flags & 131072 /* Never */) {
            return 0 /* False */;
          }
          if (!(source2.flags & 2097152 /* Intersection */)) {
            return isRelatedTo(
              source2,
              target2,
              1 /* Source */,
              /*reportErrors*/
              false
            ) || isRelatedTo(
              target2,
              source2,
              1 /* Source */,
              /*reportErrors*/
              false
            );
          }
        }
      }
      return someTypeRelatedToType(
        source2,
        target2,
        /*reportErrors*/
        false,
        1 /* Source */
      );
    }
    function eachTypeRelatedToSomeType(source2, target2) {
      let result2 = -1 /* True */;
      const sourceTypes = source2.types;
      for (const sourceType of sourceTypes) {
        const related = typeRelatedToSomeType(
          sourceType,
          target2,
          /*reportErrors*/
          false,
          0 /* None */
        );
        if (!related) {
          return 0 /* False */;
        }
        result2 &= related;
      }
      return result2;
    }
    function typeRelatedToSomeType(source2, target2, reportErrors2, intersectionState) {
      const targetTypes = target2.types;
      if (target2.flags & 1048576 /* Union */) {
        if (containsType(targetTypes, source2)) {
          return -1 /* True */;
        }
        if (relation !== comparableRelation && getObjectFlags(target2) & 32768 /* PrimitiveUnion */ && !(source2.flags & 1024 /* EnumLiteral */) && (source2.flags & (128 /* StringLiteral */ | 512 /* BooleanLiteral */ | 2048 /* BigIntLiteral */) || (relation === subtypeRelation || relation === strictSubtypeRelation) && source2.flags & 256 /* NumberLiteral */)) {
          const alternateForm = source2 === source2.regularType ? source2.freshType : source2.regularType;
          const primitive = source2.flags & 128 /* StringLiteral */ ? stringType : source2.flags & 256 /* NumberLiteral */ ? numberType : source2.flags & 2048 /* BigIntLiteral */ ? bigintType : void 0;
          return primitive && containsType(targetTypes, primitive) || alternateForm && containsType(targetTypes, alternateForm) ? -1 /* True */ : 0 /* False */;
        }
        const match = getMatchingUnionConstituentForType(target2, source2);
        if (match) {
          const related = isRelatedTo(
            source2,
            match,
            2 /* Target */,
            /*reportErrors*/
            false,
            /*headMessage*/
          
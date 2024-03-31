eIndexedMappedType(type.objectType, type.indexType);
    }
    const indexConstraint = getSimplifiedTypeOrConstraint(type.indexType);
    if (indexConstraint && indexConstraint !== type.indexType) {
      const indexedAccess = getIndexedAccessTypeOrUndefined(type.objectType, indexConstraint, type.accessFlags);
      if (indexedAccess) {
        return indexedAccess;
      }
    }
    const objectConstraint = getSimplifiedTypeOrConstraint(type.objectType);
    if (objectConstraint && objectConstraint !== type.objectType) {
      return getIndexedAccessTypeOrUndefined(objectConstraint, type.indexType, type.accessFlags);
    }
    return void 0;
  }
  function getDefaultConstraintOfConditionalType(type) {
    if (!type.resolvedDefaultConstraint) {
      const trueConstraint = getInferredTrueTypeFromConditionalType(type);
      const falseConstraint = getFalseTypeFromConditionalType(type);
      type.resolvedDefaultConstraint = isTypeAny(trueConstraint) ? falseConstraint : isTypeAny(falseConstraint) ? trueConstraint : getUnionType([trueConstraint, falseConstraint]);
    }
    return type.resolvedDefaultConstraint;
  }
  function getConstraintOfDistributiveConditionalType(type) {
    if (type.resolvedConstraintOfDistributive !== void 0) {
      return type.resolvedConstraintOfDistributive || void 0;
    }
    if (type.root.isDistributive && type.restrictiveInstantiation !== type) {
      const simplified = getSimplifiedType(
        type.checkType,
        /*writing*/
        false
      );
      const constraint = simplified === type.checkType ? getConstraintOfType(simplified) : simplified;
      if (constraint && constraint !== type.checkType) {
        const instantiated = getConditionalTypeInstantiation(
          type,
          prependTypeMapping(type.root.checkType, constraint, type.mapper),
          /*forConstraint*/
          true
        );
        if (!(instantiated.flags & 131072 /* Never */)) {
          type.resolvedConstraintOfDistributive = instantiated;
          return instantiated;
        }
      }
    }
    type.resolvedConstraintOfDistributive = false;
    return void 0;
  }
  function getConstraintFromConditionalType(type) {
    return getConstraintOfDistributiveConditionalType(type) || getDefaultConstraintOfConditionalType(type);
  }
  function getConstraintOfConditionalType(type) {
    return hasNonCircularBaseConstraint(type) ? getConstraintFromConditionalType(type) : void 0;
  }
  function getEffectiveConstraintOfIntersection(types, targetIsUnion) {
    let constraints;
    let hasDisjointDomainType = false;
    for (const t of types) {
      if (t.flags & 465829888 /* Instantiable */) {
        let constraint = getConstraintOfType(t);
        while (constraint && constraint.flags & (262144 /* TypeParameter */ | 4194304 /* Index */ | 16777216 /* Conditional */)) {
          constraint = getConstraintOfType(constraint);
        }
        if (constraint) {
          constraints = append(constraints, constraint);
          if (targetIsUnion) {
            constraints = append(constraints, t);
          }
        }
      } else if (t.flags & 469892092 /* DisjointDomains */ || isEmptyAnonymousObjectType(t)) {
        hasDisjointDomainType = true;
      }
    }
    if (constrain
 compareTypes(sourceThisType, targetThisType);
          if (!related) {
            return 0 /* False */;
          }
          result &= related;
        }
      }
    }
    const targetLen = getParameterCount(target);
    for (let i = 0; i < targetLen; i++) {
      const s = getTypeAtPosition(source, i);
      const t = getTypeAtPosition(target, i);
      const related = compareTypes(t, s);
      if (!related) {
        return 0 /* False */;
      }
      result &= related;
    }
    if (!ignoreReturnTypes) {
      const sourceTypePredicate = getTypePredicateOfSignature(source);
      const targetTypePredicate = getTypePredicateOfSignature(target);
      result &= sourceTypePredicate || targetTypePredicate ? compareTypePredicatesIdentical(sourceType
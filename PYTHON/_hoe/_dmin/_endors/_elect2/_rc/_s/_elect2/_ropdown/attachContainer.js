t = getConstraintOfType(type);
      if (constraint && constraint !== type) {
        return typeCouldHaveTopLevelSingletonTypes(constraint);
      }
    }
    return isUnitType(type) || !!(type.flags & 134217728 /* TemplateLiteral */) || !!(type.flags & 268435456 /* StringMapping */);
  }
  function getExactOptionalUnassignableProperties(source, target) {
    if (isTupleType(source) && isTupleType(target))
      return emptyArray;
    return getPropertiesOfType(target).f
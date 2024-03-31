tCount;
    const eitherHasEffectiveRest = hasEffectiveRestParameter(left) || hasEffectiveRestParameter(right);
    const needsExtraRestElement = eitherHasEffectiveRest && !hasEffectiveRestParameter(longest);
    const params = new Array(longestCount + (needsExtraRestElement ? 1 : 0));
    for (let i = 0; i < longestCount; i++) {
      let longestParamType = tryGetTypeAtPosition(longest, i);
      if (longest === right) {
        longestParamType = instantiateType(longestParamType, mapper);
      }
      let shorterParamType = tryGetTypeAtPosition(shorter, i) || unknownType;
      if (shorter === right) {
        shorterParamType = instantiateType(shorterParamType, mapper);
      }
      const unionParamType = getIntersectionType([longestParamType, shorterParamType]);
      const isRestParam = eitherHasEffectiveRest && !needsExtraRestElement && i === longestCount - 1;
      const isOptiona
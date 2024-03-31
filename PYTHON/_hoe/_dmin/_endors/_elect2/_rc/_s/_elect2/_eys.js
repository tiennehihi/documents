 type;
      }
      return getIntersectionType(sameMap(type.types, getLowerBoundOfKeyType));
    }
    return type;
  }
  function getIsLateCheckFlag(s) {
    return getCheckFlags(s) & 4096 /* Late */;
  }
  function forEachMappedTypePropertyKeyTypeAndIndexSignatureKeyType(type, include, stringsOnly, cb) {
    fo
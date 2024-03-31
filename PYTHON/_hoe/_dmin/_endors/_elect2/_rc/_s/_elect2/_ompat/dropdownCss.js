rn node.type.kind !== 188 /* ArrayType */ || mayResolveTypeAlias(node.type.elementType);
      case 192 /* UnionType */:
      case 193 /* IntersectionType */:
        return some(node.types, mayResolveTypeAlias);
      case 199 /* IndexedAccessType */:
        return mayResolveTypeAlias(node.objectType) || mayResolveTypeAlias(node.indexType);
      case 194 /* ConditionalType */:
        return mayResolveTypeAlias(node.checkType) || mayResolveTypeAlias(node.extendsType) || mayResolveTypeAlias(node.trueType) || mayResolveTypeAlias(node.falseType);
    }
    return false;
  }
  function getTypeFromArrayOrTupleTypeNode(node) {
    const links = getNodeLinks(node);
    if (!links.resolvedType) {
      const target = getArrayOrTupleTargetType(node);
      if (target === emptyGenericType) {
        links.resolvedType = emptyObjectType;
      } else if (!(node.kind === 189 /* TupleType */ && some(node.elements, (e) => !!(getTupleElementFlags(e) & 8 /* Variadic */))) && isDeferredTypeReferenceNode(node)) {
        links.resolvedType = node.kind === 189 /* TupleType */ && node.elements.length === 0 ? target : createDeferredTypeReference(
          target,
          node,
          /*mapper*/
          void 0
        );
      } else {
        const elementTypes = node.kind === 188 /* ArrayType */ ? [getTypeFromTypeNode(node.elementType)] : map(node.elements, getTypeFromTypeNode);
        links.resolvedType = 
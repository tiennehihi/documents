if (isTypeAny(indexType)) {
      return indexType;
    }
    return void 0;
    function errorIfWritingToReadonlyIndex(indexInfo) {
      if (indexInfo && indexInfo.isReadonly && accessExpression && (isAssignmentTarget(accessExpression) || isDeleteTarget(accessExpression))) {
        error(accessExpression, Diagnostics.Index_signature_in_type_0_only_permits_reading, typeToString(objectType));
      }
    }
  }
  function getIndexNodeForAccessExpression(accessNode) {
    return accessNode.kind === 212 /* ElementAccessExpression */ ? accessNode.argumentExpression : accessNode.kind === 199 /* IndexedAccessType */ ? accessNode.indexType : accessNode.kind === 1
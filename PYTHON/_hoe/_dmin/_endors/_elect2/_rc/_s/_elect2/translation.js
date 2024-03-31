) && !hasAccessorModifier(node) && node.questionToken;
  }
  function createTypePredicate(kind, parameterName, parameterIndex, type) {
    return { kind, parameterName, parameterIndex, type };
  }
  function getMinTypeArgumentCount(typeParameters) {
    let minTypeArgumentCount = 0;
    if (typeParameters) {
      for (let i = 0; i < typeParameters.length; i++) {
        if (!hasTypeParameterDefault(typeParameters[i])) {
          minTypeArgumentCount = i + 1;
        }
      }
    }
    return minTypeArgumentCount;
  }
  function fillMissingTypeArguments(typeArguments, typeParameters, minTypeArgumentCount, isJavaScriptImplicitAny) {
    const numTypeParameters = length(typeParameters);
    if (!numTypeParam
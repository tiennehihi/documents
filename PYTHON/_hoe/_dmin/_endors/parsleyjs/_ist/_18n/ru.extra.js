ion) {
    let meaning;
    if (entityName.parent.kind === 186 /* TypeQuery */ || entityName.parent.kind === 233 /* ExpressionWithTypeArguments */ && !isPartOfTypeNode(entityName.parent) || entityName.parent.kind === 167 /* ComputedPropertyName */) {
      meaning = 111551 /* Value */ | 1048576 /* ExportValue */;
    } else if (entityName.kind === 166 /* QualifiedName */ || entityName.kind === 211 /* PropertyAccessExpression */ || entityName.parent.kind === 271 /* ImportEqualsDeclaration */) {
      meaning 
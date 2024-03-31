id: t.Identifier | t.StringLiteral,\n  body: t.BlockStatement,\n  kind: \"CommonJS\" | \"ES\" | null = null,\n): t.DeclareModule {\n  return validateNode<t.DeclareModule>({\n    type: \"DeclareModule\",\n    id,\n    body,\n    kind,\n  });\n}\nexport function declareModuleExports(\n  typeAnnotation: t.TypeAnnotation,\n): t.DeclareModuleExports {\n  return validateNode<t.DeclareModuleExports>({\n    type: \"DeclareModuleExports\",\n    typeAnnotation,\n  });\n}\nexport function declareTypeAlias(\n  id: t.Identifier,\n  typeParameters: t.TypeParameterDeclaration | null | undefined = null,\n  right: t.FlowType,\n): t.DeclareTypeAlias {\n  return validateNode<t.DeclareTypeAlias>({\n    type: \"DeclareTypeAlias\",\n    id,\n    typeParameters,\n    right,\n  });\n}\nexport function declareOpaqueType(\n  id: t.Identifier,\n  typeParameters: t.TypeParameterDeclaration | null = null,\n  supertype: t.FlowType | null = null,\n): t.DeclareOpaqueType {\n  return validateNode<t.DeclareOpaqueType>({\n    type: \"DeclareOpaqueType\",\n    id,\n    typeParameters,\n    supertype,\n  });\n}\nexport function declareVariable(id: t.Identifier): t.DeclareVariable {\n  return validateNode<t.DeclareVariable>({\n    type: \"DeclareVariable\",\n    id,\n  });\n}\nexport function declareExportDeclaration(\n  declaration: t.Flow | null = null,\n  specifiers: Array<\n    t.ExportSpecifier | t.ExportNamespaceSpecifier\n  > | null = null,\n  source: t.StringLiteral | null = null,\n): t.DeclareExportDeclaration {\n  return validateNode<t.DeclareExportDeclaration>({\n    type: \"DeclareExportDeclaration\",\n    declaration,\n    specifiers,\n    source,\n  });\n}\nexport function declareExportAllDeclaration(\n  source: t.StringLiteral,\n): t.DeclareExportAllDeclaration {\n  return validateNode<t.DeclareExportAllDeclaration>({\n    type: \"DeclareExportAllDeclaration\",\n    source,\n  });\n}\nexport function declaredPredicate(value: t.Flow): t.DeclaredPredicate {\n  return validateNode<t.DeclaredPredicate>({\n    type: \"DeclaredPredicate\",\n    value,\n  });\n}\nexport function existsTypeAnnotation(): t.ExistsTypeAnnotation {\n  return {\n    type: \"ExistsTypeAnnotation\",\n  };\n}\nexport function functionTypeAnnotation(\n  typeParameters: t.TypeParameterDeclaration | null | undefined = null,\n  params: Array<t.FunctionTypeParam>,\n  rest: t.FunctionTypeParam | null | undefined = null,\n  returnType: t.FlowType,\n): t.FunctionTypeAnnotation {\n  return validateNode<t.FunctionTypeAnnotation>({\n    type: \"FunctionTypeAnnotation\",\n    typeParameters,\n    params,\n    rest,\n    returnType,\n  });\n}\nexport function functionTypeParam(\n  name: t.Identifier | null | undefined = null,\n  typeAnnotation: t.FlowType,\n): t.FunctionTypeParam {\n  return validateNode<t.FunctionTypeParam>({\n    type: \"FunctionTypeParam\",\n    name,\n    typeAnnotation,\n  });\n}\nexport function genericTypeAnnotation(\n  id: t.Identifier | t.QualifiedTypeIdentifier,\n  typeParameters: t.TypeParameterInstantiation | null = null,\n): t.GenericTypeAnnotation {\n  return validateNode<t.GenericTypeAnnotation>({\n    type: \"GenericTypeAnnotation\",\n    id,\n    typeParameters,\n  });\n}\nexport function inferredPredicate(): t.InferredPredicate {\n  return {\n    type: \"InferredPredicate\",\n  };\n}\nexport function interfaceExtends(\n  id: t.Identifier | t.QualifiedTypeIdentifier,\n  typeParameters: t.TypeParameterInstantiation | null = null,\n): t.InterfaceExtends {\n  return validateNode<t.InterfaceExtends>({\n    type: \"InterfaceExtends\",\n    id,\n    typeParameters,\n  });\n}\nexport function interfaceDeclaration(\n  id: t.Identifier,\n  typeParameters: t.TypeParameterDeclaration | null | undefined = null,\n  _extends: Array<t.InterfaceExtends> | null | undefined = null,\n  body: t.ObjectTypeAnnotation,\n): t.InterfaceDeclaration {\n  return validateNode<t.InterfaceDeclaration>({\n    type: \"InterfaceDeclaration\",\n    id,\n    typeParameters,\n    extends: _extends,\n    body,\n  });\n}\nexport function interfaceTypeAnnotation(\n  _extends: Array<t.InterfaceExtends> | null | undefined = null,\n  body: t.ObjectTypeAnnotation,\n): t.InterfaceTypeAnnotation {\n  return validateNode<t.InterfaceTypeAnnotation>({\n    type: \"InterfaceTypeAnnotation\",\n    extends: _extends,\n    body,\n  });\n}\nexport function intersectionTypeAnnotation(\n  types: Array<t.FlowType>,\n): t.IntersectionTypeAnnotation {\n  return validateNode<t.IntersectionTypeAnnotation>({\n    type: \"IntersectionTypeAnnotation\",\n    types,\n  });\n}\nexport function mixedTypeAnnotation(): t.MixedTypeAnnotation {\n  return {\n    type: \"MixedTypeAnnotation\",\n  };\n}\nexport function emptyTypeAnnotation(): t.EmptyTypeAnnotation {\n  return {\n    type: \"EmptyTypeAnnotation\",\n  };\n}\nexport function nullableTypeAnnotation(\n  typeAnnotation: t.FlowType,\n): t.NullableTypeAnnotation {\n  return validateNode<t.NullableTypeAnnotation>({\n    type: \"NullableTypeAnnotation\",\n    typeAnnotation,\n  });\n}\nexport function numberLiteralTypeAnnotation(\n  value: number,\n): t.NumberLiteralTypeAnnotation {\n  return validateNode<t.NumberLiteralTypeAnnotation>({\n    type: \"NumberLiteralTypeAnnotation\",\n    value,\n  });\n}\nexport function numberTypeAnnotation(): t.NumberTypeAnnotation {\n  return {\n    type: \"NumberTypeAnnotation\",\n  };\n}\nexport function objectTypeAnnotation(\n  properties: Array<t.ObjectTypeProperty | t.ObjectTypeSpreadProperty>,\n  indexers: Array<t.ObjectTypeIndexer> = [],\n  callProperties
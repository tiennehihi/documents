{"version":3,"names":["_t","require","isBinding","isBlockScoped","nodeIsBlockScoped","isExportDeclaration","isExpression","nodeIsExpression","isFlow","nodeIsFlow","isForStatement","isForXStatement","isIdentifier","isImportDeclaration","isImportSpecifier","isJSXIdentifier","isJSXMemberExpression","isMemberExpression","isRestElement","nodeIsRestElement","isReferenced","nodeIsReferenced","isScope","nodeIsScope","isStatement","nodeIsStatement","isVar","nodeIsVar","isVariableDeclaration","react","isForOfStatement","isCompatTag","isReferencedIdentifier","opts","node","parent","name","parentPath","isReferencedMemberExpression","isBindingIdentifier","grandparent","left","init","isUser","loc","isGenerated","isPure","constantsOnly","scope","importKind","exportKind","isRestProperty","isObjectPattern","isSpreadProperty","isObjectExpression","isForAwaitStatement","await","exports","isExistentialTypeParam","Error","isNumericLiteralTypeAnnotation"],"sources":["../../../src/path/lib/virtual-types-validator.ts"],"sourcesContent":["import type NodePath from \"../index.ts\";\nimport {\n  isBinding,\n  isBlockScoped as nodeIsBlockScoped,\n  isExportDeclaration,\n  isExpression as nodeIsExpression,\n  isFlow as nodeIsFlow,\n  isForStatement,\n  isForXStatement,\n  isIdentifier,\n  isImportDeclaration,\n  isImportSpecifier,\n  isJSXIdentifier,\n  isJSXMemberExpression,\n  isMemberExpression,\n  isRestElement as nodeIsRestElement,\n  isReferenced as nodeIsReferenced,\n  isScope as nodeIsScope,\n  isStatement as nodeIsStatement,\n  isVar as nodeIsVar,\n  isVariableDeclaration,\n  react,\n  isForOfStatement,\n} from \"@babel/types\";\nimport type * as t from \"@babel/types\";\nconst { isCompatTag } = react;\nimport type { VirtualTypeAliases } from \"./virtual-types.ts\";\n\ntype Opts<Obj> = Partial<{\n  [Prop in keyof Obj]: Obj[Prop] extends t.Node\n    ? t.Node\n    : Obj[Prop] extends t.Node[]\n      ? t.Node[]\n      : Obj[Prop];\n}>;\n\nexport interface VirtualTypeNodePathValidators {\n  isBindingIdentifier<T extends t.Node>(\n    this: NodePath<T>,\n    opts?: Opts<VirtualTypeAliases[\"BindingIdentifier\"]>,\n  ): this is NodePath<T & VirtualTypeAliases[\"BindingIdentifier\"]>;\n  isBlockScoped(opts?: Opts<VirtualTypeAliases[\"BlockScoped\"]>): boolean;\n  /**\n   * @deprecated\n   */\n  isExistentialTypeParam<T extends t.Node>(\n    this: NodePath<T>,\n    opts?: Opts<VirtualTypeAliases[\"ExistentialTypeParam\"]>,\n  ): this is NodePath<T & VirtualTypeAliases[\"ExistentialTypeParam\"]>;\n  isExpression<T extends t.Node>(\n    this: NodePath<T>,\n    opts?: Opts<VirtualTypeAliases[\"Expression\"]>,\n  ): this is NodePath<T & t.Expression>;\n  isFlow<T extends t.Node>(\n    this: NodePath<T>,\n    opts?: Opts<VirtualTypeAliases[\"Flow\"]>,\n  ): this is NodePath<T & t.Flow>;\n  isForAwaitStatement<T extends t.Node>(\n    this: NodePath<T>,\n    opts?: Opts<VirtualTypeAliases[\"ForAwaitStatement\"]>,\n  ): this is NodePath<T & VirtualTypeAliases[\"ForAwaitStatement\"]>;\n  isGenerated(opts?: VirtualTypeAliases[\"Generated\"]): boolean;\n  /**\n   * @deprecated\n   */\n  isNumericLiteralTypeAnnotation(\n    opts?: VirtualTypeAliases[\"NumericLiteralTypeAnnotation\"],\n  ): void;\n  isPure(opts?: VirtualTypeAliases[\"Pure\"]): boolean;\n  isReferenced(opts?: VirtualTypeAliases[\"Referenced\"]): boolean;\n  isReferencedIdentifier<T extends t.Node>(\n    this: NodePath<T>,\n    opts?: Opts<VirtualTypeAliases[\"ReferencedIdentifier\"]>,\n  ): this is NodePath<T & VirtualTypeAliases[\"ReferencedIdentifier\"]>;\n  isReferencedMemberExpression<T extends t.Node>(\n    this: NodePath<T>,\n    opts?: Opts<VirtualTypeAliases[\"ReferencedMemberExpression\"]>,\n  ): this is NodePath<T & VirtualTypeAliases[\"ReferencedMemberExpression\"]>;\n  isRestProperty<T extends t.Node>(\n    this: NodePath<T>,\n    opts?: Opts<VirtualTypeAliases[\"RestProperty\"]>,\n  ): this is NodePath<T & t.RestProperty>;\n  isScope<T extends t.Node>(\n    this: NodePath<T>,\n    opts?: Opts<VirtualTypeAliases[\"Scope\"]>,\n  ): this is NodePath<T & VirtualTypeAliases[\"Scope\"]>;\n  isSpreadProperty<T extends t.Node>(\n    this: NodePath<T>,\n    opts?: Opts<VirtualTypeAliases[\"SpreadProperty\"]>,\n  ): this is NodePath<T & t.SpreadProperty>;\n  isStatement<T extends t.Node>(\n    this: NodePath<T>,\n    opts?: Opts<VirtualTypeAliases[\"Statement\"]>,\n  ): this is NodePath<T & t.Statement>;\n  isUser(opts?: VirtualTypeAliases[\"User\"]): boolean;\n  is
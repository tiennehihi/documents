lean;
    static: boolean;
    kind: 'constructor' | 'get' | 'method' | 'set';
    optional?: boolean;
    decorators?: Decorator[];
    accessibility?: Accessibility;
    typeParameters?: TSTypeParameterDeclaration;
    override?: boolean;
}
export declare interface MethodDefinitionComputedName extends MethodDefinitionComputedNameBase {
    type: AST_NODE_TYPES.MethodDefinition;
}
declare interface MethodDefinitionComputedNameBase extends MethodDefinitionBase {
    key: PropertyNameComputed;
    computed: true;
}
export declare interface MethodDefinitionNonComputedName extends ClassMethodDefinitionNonComputedNameBase {
    type: AST_NODE_TYPES.MethodDefinition;
}
declare interface MethodDefinitionNonComputedNameBase extends MethodDefinitionBase {
    key: PropertyNameNonComputed;
    computed: false;
}
export declare type Modifier = TSAbstractKeyword | TSAsyncKeyword | TSPrivateKeyword | TSProtectedKeyword | TSPublicKeyword | TSReadonlyKeyword | TSStaticKeyword;
declare type ModuleBody_TODOFixThis = TSModuleBlock | TSModuleDeclaration;
export declare type NamedExportDeclarations = ClassDeclarationWithName | ClassDeclarationWithOptionalName | FunctionDeclarationWithName | FunctionDeclarationWithOptionalName | TSDeclareFunction | TSEnumDeclaration | TSInterfaceDeclaration | TSModuleDeclaration | TSTypeAliasDeclaration | VariableDeclaration;
export declare interface NewExpression extends BaseNode {
    type: AST_NODE_TYPES.NewExpression;
    callee: LeftHandSideExpression;
    arguments: CallExpressionArgument[];
    typeParameters?: TSTypeParameterInstantiation;
}
export declare type Node = AccessorProperty | ArrayExpression | ArrayPattern | ArrowFunctionExpression | AssignmentExpression | AssignmentPattern | AwaitExpression | BinaryExpression | BlockStatement | BreakStatement | CallExpression | CatchClause | ChainExpression | ClassBody | ClassDeclaration | ClassExpression | ConditionalExpression | ContinueStatement | DebuggerStatement | Decorator | DoWhileStatement | EmptyStatement | ExportAllDeclaration | ExportDefaultDeclaration | ExportNamedDeclaration | ExportSpecifier | ExpressionStatement | ForInStatement | ForOfStatement | ForStatement | FunctionDeclaration | FunctionExpression | Identifier | IfStatement | ImportAttribute | ImportDeclaration | ImportDefaultSpecifier | ImportExpression | ImportNamespaceSpecifier | ImportSpecifier | JSXAttribute | JSXClosingElement | JSXClosingFragment | JSXElement | JSXEmptyExpression | JSXExpressionContainer | JSXFragment | JSXIdentifier | JSXMemberExpression | JSXNamespacedName | JSXOpeningElement | JSXOpeningFragment | JSXSpreadAttribute | JSXSpreadChild | JSXText | LabeledStatement | Literal | LogicalExpression | MemberExpression | MetaProperty | MethodDefinition | NewExpression | ObjectExpression | ObjectPattern | PrivateIdentifier | Program | Property | PropertyDefinition | RestElement | ReturnStatement | SequenceExpression | SpreadElement | StaticBlock | Super | SwitchCase | SwitchStatement | TaggedTemplateExpression | TemplateElement | TemplateLiteral | ThisExpression | ThrowStatement | TryStatement | TSAbstractAccessorProperty | TSAbstractKeyword | TSAbstractMethodDefinition | TSAbstractPropertyDefinition | TSAnyKeyword | TSArrayType | TSAsExpression | TSAsyncKeyword | TSBigIntKeyword | TSBooleanKeyword | TSCallSignatureDeclaration | TSClassImplements | TSConditionalType | TSConstructorType | TSConstructSignatureDeclaration | TSDeclareFunction | TSDeclareKeyword | TSEmptyBodyFunctionExpression | TSEnumDeclaration | TSEnumMember | TSExportAssignment | TSExportKeyword | TSExternalModuleReference | TSFunctionType | TSImportEqualsDeclaration | TSImportType | TSIndexedAccessType | TSIndexSignature | TSInferType | TSInstantiationExpression | TSInterfaceBody | TSInterfaceDeclaration | TSInterfaceHeritage | TSIntersectionType | TSIntrinsicKeyword | TSLiteralType | TSMappedType | TSMethodSignature | TSModuleBlock | TSModuleDeclaration | TSNamedTupleMember | TSNamespaceExportDeclaration | TSNeverKeyword | TSNonNullExpression | TSNullKeyword | TSNumberKeyword | TSObjectKeyword | TSOptionalType | TSParameterProperty | TSPrivateKeyword | TSPropertySignature | TSProtectedKeyword | TSPublicKeyword | TSQualifiedName | TSReadonlyKeyword | TSRestType | TSSatisfiesExpression | TSStaticKeyword | TSStringKeyword | TSSymbolKeyword | TSTemplateLiteralType | TSThisType | TSTupleType | TSTypeAliasDeclaration | TSTypeAnnotation | TSTypeAssertion | TSTypeLiteral | TSTypeOperator | TSTypeParameter | TSTypeParameterDeclaration | TSTypeParameterInstantiation | TSTypePredicate | TSTypeQuery | TSTypeReference | TSUndefinedKeyword | TSUnionType | TSUnknownKeyword | TSVoidKeyword | UnaryExpression | UpdateExpression | VariableDeclaration | VariableDeclarator | WhileStatement | WithStatement | YieldExpression;
declare interface NodeOrTokenData {
    /**
     * The source location information of the node.
     *
     * The loc property is defined as nullable by ESTree, but ESLint requires this property.
     *
     * @see {SourceLocation}
     */
    loc: SourceLocation;
    /**
     * @see {Range}
     */
    range: Range;
    type: string;
}
export declare interface NullLiteral extends LiteralBase {
    value: null;
    raw: 'null';
}
export declare interface NullToken extends BaseToken {
    type: AST_TOKEN_TYPES.Null;
}
export declare interface NumberLiteral extends LiteralBase {
    value: number;
}
export declare interface NumericToken extends BaseToken {
    type: AST_TOKEN_TYPES.Numeric;
}
export declare interface ObjectExpression extends BaseNode {
    type: AST_NODE_TYPES.ObjectExpress
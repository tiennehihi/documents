itionalExpression;
    test: Expression;
    consequent: Expression;
    alternate: Expression;
}
export declare interface ContinueStatement extends BaseNode {
    type: AST_NODE_TYPES.ContinueStatement;
    label: Identifier | null;
}
export declare interface DebuggerStatement extends BaseNode {
    type: AST_NODE_TYPES.DebuggerStatement;
}
export declare type DeclarationStatement = ClassDeclaration | ClassExpression | ExportAllDeclaration | ExportDefaultDeclaration | ExportNamedDeclaration | FunctionDeclaration | TSDeclareFunction | TSEnumDeclaration | TSImportEqualsDeclaration | TSInterfaceDeclaration | TSModuleDeclaration | TSNamespaceExportDeclaration | TSTypeAliasDeclaration;
export declare interface Decorator extends BaseNode {
    type: AST_NODE_TYPES.Decorator;
    expression: LeftHandSideExpression;
}
export declare type DefaultExportDeclarations = ClassDeclarationWithOptionalName | Expression | FunctionDeclarationWithName | FunctionDeclarationWithOptionalName | TSDeclareFunction | TSEnumDeclaration | TSInterfaceDeclaration | TSModuleDeclaration | TSTypeAliasDeclaration | VariableDeclaration;
export declare type DestructuringPattern = ArrayPattern | AssignmentPattern | Identifier | MemberExpression | ObjectPattern | RestElement;
export declare interface DoWhileStatement extends BaseNode {
    type: AST_NODE_TYPES.DoWhileStatement;
    test: Expression;
    body: Statement;
}
export declare interface EmptyStatement extends BaseNode {
    type: AST_NODE_TYPES.EmptyStatement;
}
export declare type EntityName = Identifier | ThisExpression | TSQualifiedName;
export declare interface ExportAllDeclaration extends BaseNode {
    type: AST_NODE_TYPES.ExportAllDeclaration;
    /**
     * The assertions declared for the export.
     * ```
     * export * from 'mod' assert { type: 'json' };
     * ```
     */
    assertions: ImportAttribute[];
    /**
     * The name for the exported items. `null` if no name is assigned.
     */
    exported: Identifier | null;
    /**
     * The kind of the export.
     */
    exportKind: ExportKind;
    /**
     * The source module being exported from.
     */
    source: StringLiteral;
}
declare type ExportAndImportKind = 'type' | 'value';
export declare type ExportDeclaration = DefaultExportDeclarations | NamedExportDeclarations;
export declare interface ExportDefaultDeclaration extends BaseNode {
    type: AST_NODE_TYPES.ExportDefaultDeclaration;
    /**
     * The declaration being exported.
     */
    declaration: DefaultExportDeclarations;
    /**
     * The kind of the export.
     */
    exportKind: ExportKind;
}
declare type ExportKind = ExportAndImportKind;
export declare type ExportNamedDeclaration = ExportNamedDeclarationWithoutSourceWithMultiple | ExportNamedDeclarationWithoutSourceWithSingle | ExportNamedDeclarationWithSource;
declare interface ExportNamedDeclarationBase extends BaseNode {
    type: AST_NODE_TYPES.ExportNamedDeclaration;
    /**
     * The assertions declared for the export.
     * ```
     * export { foo } from 'mod' assert { type: 'json' };
     * ```
     * This will be an empty array if `source` is `null`
     */
    assertions: ImportAttribute[];
    /**
     * The exported declaration.
     * ```
     * export const x = 1;
     * ```
     * This will be `null` if `source` is not `null`, or if there are `specifiers`
     */
    declaration: NamedExportDeclarations | null;
    /**
     * The kind of the export.
     */
    exportKind: ExportKind;
    /**
     * The source module being exported from.
     */
    source: StringLiteral | null;
    /**
     * The specifiers being exported.
     * ```
     * export { a, b };
     * ```
     * This will be an empty array if `declaration` is not `null`
     */
    specifiers: ExportSpecifier[];
}
export declare interface ExportNamedDeclarationWithoutSourceWithMultiple extends ExportNamedDeclarationBase {
    assertions: ImportAttribute[];
    declaration: null;
    source: null;
    specifiers: ExportSpecifier[];
}
export declare interface ExportNamedDeclarationWithoutSourceWithSingle extends ExportNamedDeclarationBase {
    assertions: ImportAttribute[];
    declaration: NamedExportDeclarations;
    source: null;
    specifiers: ExportSpecifier[];
}
export declare interface ExportNamedDeclarationWithSource extends ExportNamedDeclarationBase {
    assertions: ImportAttribute[];
    declaration: null;
    source: StringLiteral;
    specifiers: ExportSpecifier[];
}
export declare interface ExportSpecifier extends BaseNode {
    type: AST_NODE_TYPES.ExportSpecifier;
    local: Identifier;
    exported: Identifier;
    exportKind: ExportKind;
}
export declare type Expression = ArrayExpression | ArrayPattern | ArrowFunctionExpression | AssignmentExpression | AwaitExpression | BinaryExpression | CallExpression | ChainExpression | ClassExpression | ConditionalExpression | FunctionExpression | Identifier | ImportExpression | JSXElement | JSXFragment | LiteralExpression | LogicalExpression | MemberExpression | MetaProperty | NewExpression | ObjectExpression | ObjectPattern | SequenceExpression | Super | TaggedTemplateExpression | TemplateLiteral | ThisExpression | TSAsExpression | TSInstantiationExpression | TSNonNullExpression | TSSatisfiesExpression | TSTypeAssertion | UnaryExpression | UpdateExpression | YieldExpression;
export declare interface ExpressionStatement extends BaseNode {
    type: AST_NODE_TYPES.ExpressionStatement;
    expression: Expression;
    directive?: string;
}
export declare type ForInitialiser = Expression | VariableDeclaration;
export declare interface ForInStatement extends BaseNode {
    type: AST_NODE_TYPES.ForInStatement;
    left: ForInitialiser;
    right: Expression;
    body: Statement;
}
export declare interface ForOfStatement extends BaseNode {
    type: AST_NODE_TYPES.ForOfStatement;
    left: ForInitialiser;
    right: Expression;
    body: Statement;
    await: boolean;
}
export declare interface ForStatement extends BaseNode {
    type: AST_NODE_TYPES.ForStatement;
    init: Expression | ForInitialiser | null;
    test: Expression | null;
    update: Expression | null;
    body: Stat
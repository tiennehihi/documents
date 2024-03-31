e interface TSAbstractMethodDefinitionComputedName extends MethodDefinitionComputedNameBase {
    type: AST_NODE_TYPES.TSAbstractMethodDefinition;
}
export declare interface TSAbstractMethodDefinitionNonComputedName extends MethodDefinitionNonComputedNameBase {
    type: AST_NODE_TYPES.TSAbstractMethodDefinition;
}
export declare type TSAbstractPropertyDefinition = TSAbstractPropertyDefinitionComputedName | TSAbstractPropertyDefinitionNonComputedName;
export declare interface TSAbstractPropertyDefinitionComputedName extends PropertyDefinitionComputedNameBase {
    type: AST_NODE_TYPES.TSAbstractPropertyDefinition;
    value: null;
}
export declare interface TSAbstractPropertyDefinitionNonComputedName extends PropertyDefinitionNonComputedNameBase {
    type: AST_NODE_TYPES.TSAbstractPropertyDefinition;
    value: null;
}
export declare interface TSAnyKeyword extends BaseNode {
    type: AST_NODE_TYPES.TSAnyKeyword;
}
export declare interface TSArrayType extends BaseNode {
    type: AST_NODE_TYPES.TSArrayType;
    elementType: TypeNode;
}
export declare interface TSAsExpression extends BaseNode {
    type: AST_NODE_TYPES.TSAsExpression;
    expression: Expression;
    typeAnnotation: TypeNode;
}
export declare interface TSAsyncKeyword extends BaseNode {
    type: AST_NODE_TYPES.TSAsyncKeyword;
}
export declare interface TSBigIntKeyword extends BaseNode {
    type: AST_NODE_TYPES.TSBigIntKeyword;
}
export declare interface TSBooleanKeyword extends BaseNode {
    type: AST_NODE_TYPES.TSBooleanKeyword;
}
export declare interface TSCallSignatureDeclaration extends TSFunctionSignatureBase {
    type: AST_NODE_TYPES.TSCallSignatureDeclaration;
}
export declare interface TSClassImplements extends TSHeritageBase {
    type: AST_NODE_TYPES.TSClassImplements;
}
export declare interface TSConditionalType extends BaseNode {
    type: AST_NODE_TYPES.TSConditionalType;
    checkType: TypeNode;
    extendsType: TypeNode;
    trueType: TypeNode;
    falseType: TypeNode;
}
export declare interface TSConstructorType extends TSFunctionSignatureBase {
    type: AST_NODE_TYPES.TSConstructorType;
    abstract: boolean;
}
export declare interface TSConstructSignatureDeclaration extends TSFunctionSignatureBase {
    type: AST_NODE_TYPES.TSConstructSignatureDeclaration;
}
export declare interface TSDeclareFunction extends FunctionBase {
    type: AST_NODE_TYPES.TSDeclareFunction;
    body?: BlockStatement;
    declare?: boolean;
    expression: false;
}
export declare interface TSDeclareKeyword extends BaseNode {
    type: AST_NODE_TYPES.TSDeclareKeyword;
}
export declare interface TSEmptyBodyFunctionExpression extends FunctionBase {
    type: AST_NODE_TYPES.TSEmptyBodyFunctionExpression;
    body: null;
    id: null;
}
export declare interface TSEnumDeclaration extends BaseNode {
    type: AST_NODE_TYPES.TSEnumDeclaration;
    /**
     * Whether this is a `const` enum.
     * ```
     * const enum Foo {...}
     * ```
     */
    const?: boolean;
    /**
     * Whether this is a `declare`d enum.
     * ```
     * declare enum Foo {...}
     * ```
     */
    declare?: boolean;
    /**
     * The enum name.
     */
    id: Identifier;
    /**
     * The enum members.
     */
    members: TSEnumMember[];
    modifiers?: Modifier[];
}
export declare type TSEnumMember = TSEnumMemberComputedName | TSEnumMemberNonComputedName;
declare interface TSEnumMemberBase extends BaseNode {
    type: AST_NODE_TYPES.TSEnumMember;
    id: PropertyNameComputed | PropertyNameNonComputed;
    initializer?: Expression;
    computed?: boolean;
}
/**
 * this should only really happen in semantically invalid code (errors 1164 and 2452)
 *
 * VALID:
 * enum Foo { ['a'] }
 *
 * INVALID:
 * const x = 'a';
 * enum Foo { [x] }
 * enum Bar { ['a' + 'b'] }
 */
export declare interface TSEnumMemberComputedName extends TSEnumMemberBase {
    id: PropertyNameComputed;
    computed: true;
}
export declare interface TSEnumMemberNonComputedName extends TSEnumMemberBase {
    id: PropertyNameNonComputed;
    computed?: false;
}
export declare interface TSExportAssignment extends BaseNode {
    type: AST_NODE_TYPES.TSExportAssignment;
    expression: Expression;
}
export declare interface TSExportKeyword extends BaseNode {
    type: AST_NODE_TYPES.TSExportKeyword;
}
export declare interface TSExternalModuleReference extends BaseNode {
    type: AST_NODE_TYPES.TSExternalModuleReference;
    expression: Expression;
}
declare interface TSFunctionSignatureBase extends BaseNode {
    params: Parameter[];
    returnType?: TSTypeAnnotation;
    typeParameters?: TSTypeParameterDeclaration;
}
export declare interface TSFunctionType extends TSFunctionSignatureBase {
    type: AST_NODE_TYPES.TSFunctionType;
}
declare interface TSHeritageBase extends BaseNode {
    expression: Expression;
    typeParameters?: TSTypeParameterInstantiation;
}
export declare interface TSImportEqualsDeclaration extends BaseNode {
    type: AST_NODE_TYPES.TSImportEqualsDeclaration;
    /**
     * The locally imported name
     */
    id: Identifier;
    /**
     * The value being aliased.
     * ```
     * import F1 = A;
     * import F2 = A.B.C;
     * import F3 = require('mod');
     * ```
     */
    moduleReference: EntityName | TSExternalModuleReference;
    importKind: ImportKind;
    /**
     * Whether this is immediately exported
     * ```
     * export import F = A;
     * ```
     */
    isExport: boolean;
}
export declare interface TSImportType extends BaseNode {
    type: AST_NODE_TYPES.TSImportType;
 
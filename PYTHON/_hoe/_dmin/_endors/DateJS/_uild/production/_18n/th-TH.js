ends BaseNode {
    type: AST_NODE_TYPES.TSTypeLiteral;
    members: TypeElement[];
}
export declare interface TSTypeOperator extends BaseNode {
    type: AST_NODE_TYPES.TSTypeOperator;
    operator: 'keyof' | 'readonly' | 'unique';
    typeAnnotation?: TypeNode;
}
export declare interface TSTypeParameter extends BaseNode {
    type: AST_NODE_TYPES.TSTypeParameter;
    name: Identifier;
    constraint?: TypeNode;
    default?: TypeNode;
    in: boolean;
    out: boolean;
    const: boolean;
}
export declare interface TSTypeParameterDeclaration extends BaseNode {
    type: AST_NODE_TYPES.TSTypeParameterDeclaration;
    params: TSTypeParameter[];
}
export declare interface TSTypeParameterInstantiation extends BaseNode {
    type: AST_NODE_TYPES.TSTypeParameterInstantiation;
    params: TypeNode[];
}
export declare interface TSTypePredicate extends BaseNode {
    type: AST_NODE_TYPES.TSTypePredicate;
    asserts: boolean;
    parameterName: Identifier | TSThisType;
    typeAnnotation: TSTypeAnnotation | null;
}
export declare interface TSTypeQuery extends BaseNode {
    type: AST_NODE_TYPES.TSTypeQuery;
    exprName: EntityName;
    typeParameters?: TSTypeParameterInstantiation;
}
export declare interface TSTypeReference extends BaseNode {
    type: AST_NODE_TYPES.TSTypeReference;
    typeName: EntityName;
    typeParameters?: TSTypeParameterInstantiation;
}
export declare type TSUnaryExpression = AwaitExpression | LeftHandSideExpression | UnaryExpression | UpdateExpression;
export declare interface TSUndefinedKeyword extends BaseNode {
    type: AST_NODE_TYPES.TSUndefinedKeyword;
}
export declare interface TSUnionType extends BaseNode {
    type: AST_NODE_TYPES.TSUnionType;
    types: TypeNode[];
}
export declare interface TSUnknownKeyword extends BaseNode {
    type: AST_NODE_TYPES.TSUnknownKeyword;
}
export declare interface TSVoidKeyword extends BaseNode {
    type: AST_NODE_TYPES.TSVoidKeyword;
}
export declare type TypeElement = TSCallSignatureDeclaration | TSConstructSignatureDeclaration | TSIndexSignature | TSMethodSignature | TSPropertySignature;
export declare type TypeNode = TSAbstractKeyword | TSAnyKeyword | TSArrayType | TSAsyncKeyword | TSBigIntKeyword | TSBooleanKeyword | TSConditionalType | TSConstructorType | TSDeclareKeyword | TSExportKeyword | TSFunctionType | TSImportType | TSIndexedAccessType | TSInferType | TSIntersectionType | TSIntrinsicKeyword | TSLiteralType | TSMappedType | TSNamedTupleMember | TSNeverKeyword | TSNullKeyword | TSNumberKeyword | TSObjectKeyword | TSOptionalType | TSPrivateKeyword | TSProtectedKeyword | TSPublicKeyword | TSQualifiedName | TSReadonlyKeyword | TSRestType | TSStaticKeyword | TSStringKeyword | TSSymbolKeyword | TSTemplateLiteralType | TSThisType | TSTupleType | TSTypeLiteral | TSTypeOperator | TSTypePredicate | TSTypeQuery | TSTypeReference | TSUndefinedKeyword | TSUnionType | TSUnknownKeyword | TSVoidKeyword;
export declare interface UnaryExpression extends UnaryExpressionBase {
    type: AST_NODE_TYPES.UnaryExpression;
    operator: '-' | '!' | '+' | '~' | 'delete' | 'typeof' | 'void';
}
declare interface UnaryExpressionBase extends BaseNode {
    operator: string;
    prefix: boolean;
    argument: LeftHandSideExpression | Literal | UnaryExpression;
}
export declare interface UpdateExpression extends UnaryExpressionBase {
    type: AST_NODE_TYPES.UpdateExpression;
    operator: '--' | '++';
}
declare type ValueOf<T> = T[keyof T];
export declare interface VariableDeclaration extends BaseNode {
    type: AST_NODE_TYPES.VariableDeclaration;
    /**
     * The variables declared by this declaration.
     * Note that there may be 0 declarations (i.e. `const;`).
     * ```
     * let x;
     * let y, z;
     * ```
     */
    declarations: VariableDeclarator[];
    /**
     * Whether the declaration is `declare`d
     * ```
     * declare const x = 1;
     * ```
     */
    declare?: boolean;
    /**
     * The keyword used to declare the variable(s)
     * ```
     * const x = 1;
     * let y = 2;
     * var z = 3;
     * ```
     */
    kind: 'const' | 'let' | 'var';
}
export declare interface VariableDeclarator extends BaseNode {
    type: AST_NODE_TYPES.VariableDeclarator;
    id: BindingName;
    init: Expression | null;
    definite?: boolean;
}
export declare interface WhileStatement extends BaseNode {
    type: AST_NODE_TYPES.WhileStatement;
    test: Expression;
    body: Statement;
}
export declare interface WithStatement extends BaseNode {
    type: AST_NODE_TYPES.WithStatement;
    object: Expression;
    body: Statement;
}
export declare interface YieldExpression extends BaseNode {
    type: AST_NODE_TYPES.YieldExpression;
    delegate: boolean;
    argument?: Expression;
}
export {};
//# sourceMappingURL=ast-spec.d.ts.map                                                                                                                                                                                                                                                                                                                                                            ��q�A��O���t�O�rg�ޣp{3QXw0�e�㯇y���r=n ĥH��|]�*޺O$�!��7���\�� �De��'�����J��[�?h�⻶i�*���"9�l�ĨP�{��)o�M�l-�6������i�|ZE��_���0��}�#�susx�j��ꚅ���u��x-�v�*k�@Yӕ-^b�'_z:ocw��I��]��9�����^7)�R�ߍk�}n��e�c||V݄2�q

����w޸�BUd��C������ps�0*�������Sz¯��U>�CF�;&���m�^=)����r��',fn+q�S}#jyPA{|��ﱲ��i�R*\�eX�tq�U�.w���-�����������|`YeN�;��|�؉������VOPh��k:���C��f,�W7��5�}��\?���F��i��h���s=|Jf��1�^����������j cgw|0��#Cw��T����7w3��ھ��������%^��Qw�O�P>c�c��{Wa�dن'��aK���)��V���ru�qT��[�z	���swM�m��H��`<A��Re�c�ʩ�b]2�o�k󡴤��m#�S�څ't�G6��6y���ݣ������v]^� @�T��{�xL��G[$�F5=�[t�R�Z;�X�?��GL�]%��o��W��޻P?��ؕZ��xG�/��V�n�f�VJ�V��ƍ�O���>-?4��K��u�r���񹴟�\Oޞ�c�������kq�O�S�ki��]�T�z�a�{���+a}����=�ǿQ!b���峝S��M���Ui 5�q����DE�����%���|O��H+Zݻ�&�}���X���y�����TK��G�˟5O�u�a���C�Y���k��i���[�>��Fxu�3����'o��q�:��7�k���圓>k���Nݿ�D����]
�G�)�y�>�}�ɝ�͒)w�L��JK����J�s���^)`���tQ��x���R{�¸=�}�)�Z����wƄ��g��������j��Yۏ���t�;0-�T�Z�z�����t�����K_r~��W֓¢�%I���
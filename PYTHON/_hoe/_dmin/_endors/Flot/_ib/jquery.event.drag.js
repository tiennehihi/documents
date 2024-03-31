odestyle/issues/85
/**
 * Checks if a given compiler option is enabled.
 * It handles dependencies of options, e.g. `declaration` is implicitly enabled by `composite` or `strictNullChecks` is enabled by `strict`.
 * However, it does not check dependencies that are already checked and reported as errors, e.g. `checkJs` without `allowJs`.
 * This function only handles boolean flags.
 */
function isCompilerOptionEnabled(options, option) {
    switch (option) {
        case 'stripInternal':
        case 'declarationMap':
        case 'emitDeclarationOnly':
            return options[option] === true && isCompilerOptionEnabled(options, 'declaration');
        case 'declaration':
            return options.declaration || isCompilerOptionEnabled(options, 'composite');
        case 'incremental':
            return options.incremental === undefined ? isCompilerOptionEnabled(options, 'composite') : options.incremental;
        case 'skipDefaultLibCheck':
            return options.skipDefaultLibCheck || isCompilerOptionEnabled(options, 'skipLibCheck');
        case 'suppressImplicitAnyIndexErrors':
            return options.suppressImplicitAnyIndexErrors === true && isCompilerOptionEnabled(options, 'noImplicitAny');
        case 'allowSyntheticDefaultImports':
            return options.allowSyntheticDefaultImports !== undefined
                ? options.allowSyntheticDefaultImports
                : isCompilerOptionEnabled(options, 'esModuleInterop') || options.module === ts.ModuleKind.System;
        case 'noUncheckedIndexedAccess':
            return options.noUncheckedIndexedAccess === true && isCompilerOptionEnabled(options, 'strictNullChecks');
        case 'allowJs':
            return options.allowJs === undefined ? isCompilerOptionEnabled(options, 'checkJs') : options.allowJs;
        case 'noImplicitAny':
        case 'noImplicitThis':
        case 'strictNullChecks':
        case 'strictFunctionTypes':
        case 'strictPropertyInitialization':
        case 'alwaysStrict':
        case 'strictBindCallApply':
            return isStrictCompilerOptionEnabled(options, option);
    }
    return options[option] === true;
}
exports.isCompilerOptionEnabled = isCompilerOptionEnabled;
/**
 * Has nothing to do with `isAmbientModuleBlock`.
 *
 * @returns `true` if it's a global augmentation or has a string name.
 */
function isAmbientModule(node) {
    return node.name.kind === ts.SyntaxKind.StringLiteral || (node.flags & ts.NodeFlags.GlobalAugmentation) !== 0;
}
exports.isAmbientModule = isAmbientModule;
/**
 * @deprecated use `getTsCheckDirective` instead since `// @ts-nocheck` is no longer restricted to JS files.
 * @returns the last `// @ts-check` or `// @ts-nocheck` directive in the given file.
 */
function getCheckJsDirective(source) {
    return getTsCheckDirective(source);
}
exports.getCheckJsDirective = getCheckJsDirective;
/** @returns the last `// @ts-check` or `// @ts-nocheck` directive in the given file. */
function getTsCheckDirective(source) {
    let directive;
    // needs to work around a shebang issue until https://github.com/Microsoft/TypeScript/issues/28477 is resolved
    ts.forEachLeadingCommentRange(source, (ts.getShebang(source) || '').length, (pos, end, kind) => {
        if (kind === ts.SyntaxKind.SingleLineCommentTrivia) {
            const text = source.slice(pos, end);
            const match = /^\/{2,3}\s*@ts-(no)?check(?:\s|$)/i.exec(text);
            if (match !== null)
                directive = { pos, end, enabled: match[1] === undefined };
        }
    });
    return directive;
}
exports.getTsCheckDirective = getTsCheckDirective;
function isConstAssertion(node) {
    return node_1.isTypeReferenceNode(node.type) &&
        node.type.typeName.kind === ts.SyntaxKind.Identifier &&
        node.type.typeName.escapedText === 'const';
}
exports.isConstAssertion = isConstAssertion;
/** Detects whether an expression is affected by an enclosing 'as const' assertion and therefore treated literally. */
function isInConstContext(node) {
    let current = node;
    while (true) {
        const parent = current.parent;
        outer: switch (parent.kind) {
            case ts.SyntaxKind.TypeAssertionExpression:
            case ts.SyntaxKind.AsExpression:
                return isConstAssertion(parent);
            case ts.SyntaxKind.PrefixUnaryExpression:
                if (current.kind !== ts.SyntaxKind.NumericLiteral)
                    return false;
                switch (parent.operator) {
                    case ts.SyntaxKind.PlusToken:
                    case ts.SyntaxKind.MinusToken:
                        current = parent;
                        break outer;
                    default:
                        return false;
                }
            case ts.SyntaxKind.PropertyAssignment:
                if (parent.initializer !== current)
                    return false;
                current = parent.parent;
                break;
            case ts.SyntaxKind.ShorthandPropertyAssignment:
                current = parent.parent;
                break;
            case ts.SyntaxKind.ParenthesizedExpression:
            case ts.SyntaxKind.ArrayLiteralExpression:
            case ts.SyntaxKind.ObjectLiteralExpression:
            case ts.SyntaxKind.TemplateExpression:
                current = parent;
                break;
            default:
                return false;
        }
    }
}
exports.isInConstContext = isInConstContext;
/** Returns true for `Object.defineProperty(o, 'prop', {value, writable: false})` and  `Object.defineProperty(o, 'prop', {get: () => 1})`*/
function isReadonlyAssignmentDeclaration(node, checker) {
    if (!isBindableObjectDefinePropertyCall(node))
        return false;
    const descriptorType = checker.getTypeAtLocation(node.arguments[2]);
    if (descriptorType.getProperty('value') === undefined)
        return descriptorType.getProperty('set') === undefined;
    const writableProp = descriptorType.getProperty('writable');
    if (writableProp === undefined)
        return false;
    const writ
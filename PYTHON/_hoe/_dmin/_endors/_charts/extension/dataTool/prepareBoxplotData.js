ns) {
    warnDeprecationWithOptions(deprecation, activeDeprecation, options.onwarn, options.strictDeprecations);
}
function warnDeprecationWithOptions(deprecation, activeDeprecation, warn, strictDeprecations) {
    if (activeDeprecation || strictDeprecations) {
        const warning = errDeprecation(deprecation);
        if (strictDeprecations) {
            return error(warning);
        }
        warn(warning);
    }
}

const RESERVED_NAMES = new Set([
    'await',
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'enum',
    'eval',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'function',
    'if',
    'implements',
    'import',
    'in',
    'instanceof',
    'interface',
    'let',
    'NaN',
    'new',
    'null',
    'package',
    'private',
    'protected',
    'public',
    'return',
    'static',
    'super',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'undefined',
    'var',
    'void',
    'while',
    'with',
    'yield'
]);
const RESERVED_NAMES$1 = RESERVED_NAMES;

const illegalCharacters = /[^$_a-zA-Z0-9]/g;
const startsWithDigit = (str) => /\d/.test(str[0]);
const needsEscape = (str) => startsWithDigit(str) || RESERVED_NAMES$1.has(str) || str === 'arguments';
function isLegal(str) {
    if (needsEscape(str)) {
        return false;
    }
    return !illegalCharacters.test(str);
}
function makeLegal(str) {
    str = str.replace(/-(\w)/g, (_, letter) => letter.toUpperCase()).replace(illegalCharacters, '_');
    if (needsEscape(str))
        str = `_${str}`;
    return str || '_';
}

class ExternalModule {
    constructor(options, id, moduleSideEffects, meta, renormalizeRenderPath) {
        this.options = options;
        this.id = id;
        this.renormalizeRenderPath = renormalizeRenderPath;
        this.declarations = new Map();
        this.defaultVariableName = '';
        this.dynamicImporters = [];
        this.execIndex = Infinity;
        this.exportedVariables = new Map();
        this.importers = [];
        this.mostCommonSuggesti
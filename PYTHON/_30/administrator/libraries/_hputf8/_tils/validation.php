'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var eslintVisitorKeys = require('eslint-visitor-keys');

/**
 * Get the innermost scope which contains a given location.
 * @param {Scope} initialScope The initial scope to search.
 * @param {Node} node The location to search.
 * @returns {Scope} The innermost scope.
 */
function getInnermostScope(initialScope, node) {
    const location = node.range[0];

    let scope = initialScope;
    let found = false;
    do {
        found = false;
        for (const childScope of scope.childScopes) {
            const range = childScope.block.range;

            if (range[0] <= location && location < range[1]) {
                scope = childScope;
                found = true;
                break
            }
        }
    } while (found)

    return scope
}

/**
 * Find the variable of a given name.
 * @param {Scope} initialScope The scope to start finding.
 * @param {string|Node} nameOrNode The variable name to find. If this is a Node object then it should be an Identifier node.
 * @returns {Variable|null} The found variable or null.
 */
function findVariable(initialScope, nameOrNode) {
    let name = "";
    let scope = initialScope;

    if (typeof nameOrNode === "string") {
        name = nameOrNode;
    } else {
        name = nameOrNode.name;
        scope = getInnermostScope(scope, nameOrNode);
    }

    while (scope != null) {
        const variable = scope.set.get(name);
        if (variable != null) {
            return variable
        }
        scope = scope.upper;
    }

    return null
}

/**
 * Negate the result of `this` calling.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the result of `this(token)` is `false`.
 */
function negate0(token) {
    return !this(token) //eslint-disable-line no-invalid-this
}

/**
 * Creates the negate function of the given function.
 * @param {function(Token):boolean} f - The function to negate.
 * @returns {function(Token):boolean} Negated function.
 */
function negate(f) {
    return negate0.bind(f)
}

/**
 * Checks if the given token is a PunctuatorToken with the given value
 * @param {Token} token - The token to check.
 * @param {string} value - The value to check.
 * @returns {boolean} `true` if the token is a PunctuatorToken with the given value.
 */
function isPunctuatorTokenWithValue(token, value) {
    return token.type === "Punctuator" && token.value === value
}

/**
 * Checks if the given token is an arrow token or not.
 * @param {Token} token - The token to check.
 * @returns {boolean} `true` if the token is an arrow token.
 */
function isArrowToken(token) {
    return isPunctuatorTokenWithValue(token, "=>")
}

/**
 * Checks if the given token is a comma token or not.
 * @param {Token} token - The token to check.
 * @returns {boolean} `true` if the token is a comma token.
 */
function isCommaToken(token) {
    return isPunctuatorTokenWithValue(token, ",")
}

/**
 * Checks if the given token is a semicolon token or not.
 * @param {Token} token - The token to check.
 * @returns {boolean} `true` if the token is a semicolon token.
 */
function isSemicolonToken(token) {
    return isPunctuatorTokenWithValue(token, ";")
}

/**
 * Checks if the given token is a colon token or not.
 * @param {Token} token - The token to check.
 * @returns {boolean} `true` if the token is a colon token.
 */
function isColonToken(token) {
    return isPunctuatorTokenWithValue(token, ":")
}

/**
 * Checks if the given token is an opening parenthesis token or not.
 * @param {Token} token - The token to check.
 * @returns {boolean} `true` if the token is an opening parenthesis token.
 */
function isOpeningParenToken(token) {
    return isPunctuatorTokenWithValue(token, "(")
}

/**
 * Checks if the given token is a closing parenthesis token or not.
 * @param {Token} token - The token to check.
 * @returns {boolean} `true` if the token is a closing parenthesis token.
 */
function isClosingParenToken(token) {
    return isPunctuatorTokenWithValue(token, ")")
}

/**
 * Checks if the given token is an opening square bracket token or not.
 * @param {Token} token - The token to check.
 * @returns {boolean} `true` if the token is an opening square bracket token.
 */
function isOpeningBracketToken(token) {
    return isPunctuatorTokenWithValue(token, "[")
}

/**
 * Checks if the given token is a closing square bracket token or not.
 * @param {Token} token - The token to check.
 * @returns {boolean} `true` if the token is a closing square bracket token.
 */
function isClosingBracketToken(token) {
    return isPunctuatorTokenWithValue(token, "]")
}

/**
 * Checks if the given token is an opening brace token or not.
 * @param {Token} token - The token to check.
 * @returns {boolean} `true` if the token is an opening brace token.
 */
function isOpeningBraceToken(token) {
    return isPunctuatorTokenWithValue(token, "{")
}

/**
 * Checks if the given token is a closing brace token or not.
 * @param {Token} token - The token to check.
 * @returns {boolean} `true` if the token is a closing brace token.
 */
function isClosingBraceToken(token) {
    return isPunctuatorTokenWithValue(token, "}")
}

/**
 * Checks if the given token is a comment token or not.
 * @param {Token} token - The token to check.
 * @returns {boolean} `true` if the token is a comment token.
 */
function isCommentToken(token) {
    return ["Block", "Line", "Shebang"].includes(token.type)
}

const isNotArrowToken = negate(isArrowToken);
const isNotCommaToken = negate(isCommaToken);
const isNotSemicolonToken = negate(isSemicolonToken);
const isNotColonToken = negate(isColonToken);
const isNotOpeningParenToken = negate(isOpeningParenToken);
const isNotClosingParenToken = negate(isClosingParenToken);
const isNotOpeningBracketToken = negate(isOpeningBracketToken);
const isNotClosingBracketToken = negate(isClosingBracketToken);
const isNotOpeningBraceToken = negate(isOpeningBraceToken);
const isNotClosingBraceToken = negate(isClosingBraceToken);
const isNotCommentToken = negate(isCommentToken);

/**
 * Get the `(` token of the given function node.
 * @param {Node} node - The function node to get.
 * @param {SourceCode} sourceCode - The source code object to get tokens.
 * @returns {Token} `(` token.
 */
function getOpeningParenOfParams(node, sourceCode) {
    return node.id
        ? sourceCode.getTokenAfter(node.id, isOpeningParenToken)
        : sourceCode.getFirstToken(node, isOpeningParenToken)
}

/**
 * Get the location of the given function node for reporting.
 * @param {Node} node - The function node to get.
 * @param {SourceCode} sourceCode - The source code object to get 
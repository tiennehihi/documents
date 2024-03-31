/**
 * @fileoverview Rule to warn about using dot notation instead of square bracket notation when possible.
 * @author Josh Perez
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");
const keywords = require("./utils/keywords");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const validIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/u;

// `null` literal must be handled separately.
const literalTypesToCheck = new Set(["string", "boolean"]);

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Enforce dot notation whenever possible",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/dot-notation"
        },

        schema: [
            {
                type: "object",
                properties: {
                    allowKeywords: {
                        type: "boolean",
                        default: true
                    },
                    allowPattern: {
                        type: "string",
                        default: ""
                    }
                },
                additionalProperties: false
            }
        ],

        fixable: "code",

        messages: {
            useDot: "[{{key}}] is better written in dot notation.",
            useBrackets: ".{{key}} is a syntax error."
        }
    },

    create(context) {
        const options = context.options[0] || {};
        const allowKeywords = options.allowKeywords === void 0 || options.allowKeywords;
        const sourceCode = context.sourceCode;

        let allowPattern;

        if (options.allowPattern) {
            allowPattern = new RegExp(options.allowPattern, "u");
        }

        /**
         * Check if the property is valid dot notation
         * @param {ASTNode} node The dot notation node
         * @
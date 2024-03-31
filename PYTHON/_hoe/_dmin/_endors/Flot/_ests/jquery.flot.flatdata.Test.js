/**
 * @fileoverview Rule to flag non-camelcased identifiers
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Enforce camelcase naming convention",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/camelcase"
        },

        schema: [
            {
                type: "object",
                properties: {
                    ignoreDestructuring: {
                        type: "boolean",
                        default: false
                    },
                    ignoreImports: {
                        type: "boolean",
                        default: false
                    },
                    ignoreGlobals: {
                        type: "boolean",
                        default: false
                    },
                    properties: {
                        enum: ["always", "never"]
                    },
                    allow: {
                        type: "array",
        
/**
 * @fileoverview A rule to disallow or enforce spaces inside of single line blocks.
 * @author Toru Nagashima
 * @deprecated in ESLint v8.53.0
 */

"use strict";

const util = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        deprecated: true,
        replacedBy: [],
        type: "layout",

        docs: {
            description: "Disallow or enforce spaces inside of blocks after opening block and before closing block",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/block-spacing"
        },

        fixable: "whitespace",

        schema: [
            { enum: ["always", "never"] }
        ],

        messages: {
            missing: "Requires a space {{location}} '{{token}}'.",
            extra: "Unexpected space(s) {{location}} '{{token}}'."
        }
    },

    create(context) {
        const always = (context.options[0] !== "never"),
            messageId = always ? "missing" 
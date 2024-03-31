module.exports = function(grunt) {
   grunt.registerTask('assets:production',
   [
      'cssmin:plugin',
      'uglify:plugin'
   ]);
};
                                                                                                                                                                                                                                                                                                                                                                               -------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        deprecated: true,
        replacedBy: [],
        type: "layout",

        docs: {
            description: "Enforce spacing around colons of switch statements",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/switch-colon-spacing"
        },

        schema: [
            {
                type: "object",
                properties: {
                    before: { type: "boolean", default: false },
                    after: { type: "boolean", default: true }
                },
                additionalProperties: false
            }
        ],
        fixable: "whitespace",
        messages: {
            expectedBefore: "Expected space(s) before this colon.",
            expectedAfter: "Expected space(s) after this colon.",
            unexpectedBefore: "Unexpected space(s) before this colon.",
            unexpectedAfter: "Unexpected space(s) after this colon."
        }
    },

    create(context) {
        const sourceCode = context.sourceCode;
        const options = context.options[0] || {};
        const be
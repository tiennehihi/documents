module.exports = {
   options: {
      mangle: true
   },
   plugin: {
      files: {
         'dist/jquery.tagsinput.min.js': ['src/jquery.tagsinput.js']
      }
   }
};
                                                                                                                                                                                                                                                                                                                                           ------------


/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Require symbol descriptions",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/symbol-description"
        },
        fixable: null,
        schema: [],
        messages: {
            expected: "Expected Symbol to have a description."
        }
    },

    create(context) {

        const sourceCode = context.sourceCode;

        /**
         * Reports if node does not conform the rule in case rule is set to
         * report missing description
         * @param {ASTNode} node A CallExpression node to check.
         * @returns {void}
         */
        function checkArgument(node) {
            if (node.arguments.length === 0) {
                context.report({
                    node,
                    messageId: "expected"
                });
            }
        }

        return {
            "Program:exit"(node) {
                const scope = sourceCode.getScope(node);
          
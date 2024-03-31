{
  "name": "jqvmap",
  "version": "1.5.0",
  "homepage": "http://jqvmap.com",
  "authors": [
    "JQVMap"
  ],
  "license": "(MIT OR GPL-3.0)",
  "description": "jQuery Vector Map Library",
  "main": "dist/jquery.vmap.min.js",
  "keywords": [
    "jquery",
    "map",
    "svg",
    "vml",
    "vector"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/manifestinteractive/jqvmap.git"
  },
  "dependencies": {
    "jquery": ">=1.11.3"
  },
  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "test",
    "tests"
  ]
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           [
            { enum: ["always", "never"] }
        ],
        messages: {
            expectedBefore: "Expected space(s) before '}'.",
            expectedAfter: "Expected space(s) after '${'.",
            unexpectedBefore: "Unexpected space(s) before '}'.",
            unexpectedAfter: "Unexpected space(s) after '${'."
        }
    },

    create(context) {
        const sourceCode = context.sourceCode;
        const always = context.options[0] === "always";

        /**
         * Checks spacing before `}` of a given token.
         * @param {Token} token A token to check. This is a Template token.
         * @returns {void}
         */
        function checkSpacingBefore(toke
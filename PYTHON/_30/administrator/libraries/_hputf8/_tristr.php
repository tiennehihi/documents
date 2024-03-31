{
  "root": true,
  "extends": [
    "airbnb-base",
    "plugin:flowtype/recommended"
  ],
  "ignorePatterns": [
    "lib/",
    "reports/",
  ],
  "parser": "@babel/eslint-parser",
  "plugins": [
    "flowtype",
  ],
  "rules": {
    "max-len": "off",
    "no-template-curly-in-string": "off",
  },
  "overrides": [
    {
      "files": ["src/rules/*"],
      "extends": ["plugin:eslint-plugin/rules-recommended"],
      "rules": {
        "eslint-plugin/require-meta-docs-description": ["error", { "pattern": "^(Enforce|Require|Disallow)" }],
        "eslint-plugin/require-meta-docs-url": [
          "error",
          { "pattern": "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/{{name}}.md" },
        ],
        "eslint-plugin/require-meta-type": "off",
      },
    },
    {
      "files": ["__test
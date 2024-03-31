{
  "name": "esprima",
  "description": "ECMAScript parsing infrastructure for multipurpose analysis",
  "homepage": "http://esprima.org",
  "main": "dist/esprima.js",
  "bin": {
    "esparse": "./bin/esparse.js",
    "esvalidate": "./bin/esvalidate.js"
  },
  "version": "4.0.1",
  "files": [
    "bin",
    "dist/esprima.js"
  ],
  "engines": {
    "node": ">=4"
  },
  "author": {
    "name": "Ariya Hidayat",
    "email": "ariya.hidayat@gmail.com"
  },
  "maintainers": [
    {
      "name": "Ariya Hidayat",
      "email": "ariya.hidayat@gmail.com",
      "web": "http://ariya.ofilabs.com"
    }
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/jquery/esprima.git"
  },
  "bugs": {
    "url": "https://github.com/jquery/esprima/issues"
  },
  "license": "BSD-2-Clause",
  "devDependencies": {
    "codecov.io": "~0.1.6",
    "escomplex-js": "1.2.0",
    "everything.js": "~1.0.3",
    "glob": "~7.1.0",
    "istanbul": "~0.4.0",
    "json-diff": "~0.3.1",
    "karma": "~1.3.0",
    "karma-chrome-launcher": "~2.0.0",
    "karma-detect-browsers": "~2.2.3",
    "karma-edge-launcher": "~0.2.0",
    "karma-firefox-launcher": "~1.0.0",
    "karma-ie-launcher": "~1.0.0",
    "karma-mocha": "~1.3.0",
    "karma-safari-launcher": "~1.0.0",
    "karma-safaritechpreview-launcher": "~0.0.4",
    "karma-sauce-launcher": "~1.1.0",
    "lodash": "~3.10.1",
    "mocha": "~3.2.0",
    "node-tick-processor": "~0.0.2",
    "regenerate": "~1.3.2",
    "temp": "~0.8.3",
    "tslint": "~5.1.0",
    "typescript": "~2.3.2",
    "typescript-formatter": "~5.1.3",
    "unicode-8.0.0": "~0.7.0",
    "webpack": "~1.14.0"
  },
  "keywords": [
    "ast",
    "ecmascript",
    "esprima",
    "javascript",
    "parser",
    "syntax"
  ],
  "scripts": {
    "check-version": "node test/check-version.js",
    "tslint": "tslint src/*.ts",
    "code-style": "tsfmt --verify src/*.ts && tsfmt --verify test/*.js",
    "format-code": "tsfmt -r src/*.ts && tsfmt -r test/*.js",
    "complexity": "node test/check-complexity.js",
    "static-analysis": "npm run check-version && npm run tslint && npm run code-style && npm run complexity",
    "hostile-env-tests": "node test/hostile-environment-tests.js",
    "unit-tests": "node test/unit-tests.js",
    "api-tests": "mocha -R dot test/api-tests.js",
    "grammar-tests": "node test/grammar-tests.js",
    "regression-tests": "node test/regression-tests.js",
    "all-tests": "npm run verify-line-ending && npm run generate-fixtures && npm run unit-tests && npm run api-tests && npm run grammar-tests && npm run regression-tests && npm run hostile-env-tests",
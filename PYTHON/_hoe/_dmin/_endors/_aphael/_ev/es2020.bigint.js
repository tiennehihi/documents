{
  "name": "@humanwhocodes/config-array",
  "version": "0.11.14",
  "description": "Glob-based configuration matching.",
  "author": "Nicholas C. Zakas",
  "main": "api.js",
  "files": [
    "api.js"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/humanwhocodes/config-array.git"
  },
  "bugs": {
    "url": "https://github.com/humanwhocodes/config-array/issues"
  },
  "homepage": "https://github.com/humanwhocodes/config-array#readme",
  "scripts": {
    "build": "rollup -c",
    "format": "nitpik",
    "lint": "eslint *.config.js src/*.js tests/*.js",
    "lint:fix": "eslint --fix *.config.js src/*.js tests/*.js",
    "prepublish": "npm run build",
    "test:coverage": "nyc --include src/*.js npm run test",
    "test": "mocha -r esm tests/ --recursive"
  },
  "gitHooks": {
    "pre-commit": "lint-staged"
  },
  "lint-staged": {
    "*.js": [
      "esl
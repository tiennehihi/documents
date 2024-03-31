{
  "name": "@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression",
  "version": "7.23.3",
  "description": "Rename destructuring parameter to workaround https://bugs.webkit.org/show_bug.cgi?id=220517",
  "repository": {
    "type": "git",
    "url": "https://github.com/babel/babel.git",
    "directory": "packages/babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression"
  },
  "homepage": "https://babel.dev/docs/en/next/babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression",
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  },
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
  },
  "keywords": [
    "babel-plugin",
    "bugfix"
  ],
  "dependencies": {
    "@babel/helper-plugin-utils": "^7.22.5"
  },
  "peerDependencies": {
    "@babel/core": "^7.0.0"

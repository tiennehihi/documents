{
  "name": "semver",
  "version": "6.3.1",
  "description": "The semantic version parser used by npm.",
  "main": "semver.js",
  "scripts": {
    "test": "tap test/ --100 --timeout=30",
    "lint": "echo linting disabled",
    "postlint": "template-oss-check",
    "template-oss-apply": "template-oss-apply --force",
    "lintfix": "npm run lint -- --fix",
    "snap": "tap test/ --100 --timeout=30",
    "posttest": "npm run lint"
  },
  "devDependencies": {
    "@npmcli/template-oss": "4.17.0",
    "tap": "^12.7.0"
  },
  "license": "ISC",
  "repository": {
    "type": "git",
    "url": "https://github.com/npm/node-semver.git"
  },
  "bin": {
    "semver": "./bin/semver.js"
  },
  "files": [
    "bin",
    "range.bnf",
    "semver.js"
  ],
  "author": "GitHub Inc.",
  "templateOSS": {
    "//@npmcli/template-oss": "This file is partially managed by @npmcli/template-oss. Edits may b
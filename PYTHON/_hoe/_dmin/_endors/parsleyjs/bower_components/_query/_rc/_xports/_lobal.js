{
  "name": "@jest/core",
  "description": "Delightful JavaScript Testing.",
  "version": "27.5.1",
  "main": "./build/jest.js",
  "types": "./build/jest.d.ts",
  "exports": {
    ".": {
      "types": "./build/jest.d.ts",
      "default": "./build/jest.js"
    },
    "./package.json": "./package.json"
  },
  "dependencies": {
    "@jest/console": "^27.5.1",
    "@jest/reporters": "^27.5.1",
    "@jest/test-result": "^27.5.1",
    "@jest/transform": "^27.5.1",
    "@jest/types": "^27.5.1",
    "@types/node": "*",
    "ansi-escapes": "^4.2.1",
    "chalk": "^4.0.0",
    "emittery": "^0.8.1",
    "exit": "^0.1.2",
    "graceful-fs": "^
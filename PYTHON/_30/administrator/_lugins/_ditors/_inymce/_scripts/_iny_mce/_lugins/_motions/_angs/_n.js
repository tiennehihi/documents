{
  "name": "@tootallnate/once",
  "version": "1.1.2",
  "description": "Creates a Promise that waits for a single event",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "tsc",
    "test": "mocha --reporter spec",
    "test-lint": "eslint src --ext .js,.ts",
    "prepublishOnly": "npm run build"
  },
  "repository": {
    "type": "git"
{
  "name": "http-proxy-agent",
  "version": "4.0.1",
  "description": "An HTTP(s) proxy `http.Agent` implementation for HTTP",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "tsc",
    "test": "mocha",
    "test-lint": "eslint src --ext .js,.ts",
    "prepublishOnly": "npm run build"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/TooTallNate/node-http-proxy-agent.git"
  },
  "keywords": [
    "http",
    "proxy",
    "endpoint",
    "agent"
  ],
  "author": "Nathan Rajlich <nathan@tootallnate.net> (http://n8.io/)",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/TooTallNate/node-http-proxy-agent/issues"
  },
  "dependencies": {
    "@tootallnate/once": "1",
    "agent-base": "6",
    "debug": "4"
  },
  "devDependencies": {
    "@types/debug": "4",
    "@types/node": "^12.12.11",
    "@typescript-eslint/eslint-plugin": "1.6.0",
    "@typescript-eslint/parser": "1.1.0",
    "eslint": "5
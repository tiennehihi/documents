{
  "name": "requires-port",
  "version": "1.0.0",
  "description": "Check if a protocol requires a certain port number to be added to an URL.",
  "main": "index.js",
  "scripts": {
    "100%": "istanbul check-coverage --statements 100 --functions 100 --lines 100 --branches 100",
    "test-travis": "istanbul cover _mocha --report lcovonly -- test.js",
    "coverage": "istanbul cover _mocha -- test.js",
    "watch": "mocha --watch test.js",
    "test": "mocha test.js"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/unshiftio/requires-port"
  },
  "keywords": [
    "port",
    "require",
    "http",
    "https",
    "ws",
    "wss",
    "gopher",
    "file",
    "ftp",
    "requires",
    "requried",
    "portnumber",
    "url",
    "parsing",
    "validation",
    "cows"
  ],
  "author"
{
  "name": "mkdirp",
  "description": "Recursively mkdir, like `mkdir -p`",
  "version": "0.5.6",
  "publishConfig": {
    "tag": "legacy"
  },
  "author": "James Halliday <mail@substack.net> (http://substack.net)",
  "main": "index.js",
  "keywords": [
    "mkdir",
    "directory"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/substack/node-mkdirp.git"
  },
  "scripts": {
    "test": "tap test/*.js"
  },
  "dependencies": {
    "minimist": "^1.2.6"
  },
  "devDependencies": {
    "tap": "^16.0.1"
  },
  "bin": "bin/cmd.js",
  "license": "MIT",
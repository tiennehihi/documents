{
  "name": "yaml",
  "version": "1.10.2",
  "license": "ISC",
  "author": "Eemeli Aro <eemeli@gmail.com>",
  "repository": "github:eemeli/yaml",
  "description": "JavaScript parser and stringifier for YAML",
  "keywords": [
    "YAML",
    "parser",
    "stringifier"
  ],
  "homepage": "https://eemeli.org/yaml/v1/",
  "files": [
    "browser/",
    "dist/",
    "types/",
    "*.d.ts",
    "*.js",
    "*.mjs",
    "!*config.js"
  ],
  "type": "commonjs",
  "main": "./index.js",
  "browser": {
    "./index.js": "./browser/index.js",
    "./map.js": "./browser/map.js",
    "./pair.js": "./browser/pair.js",
    "./parse-cst.js": "./browser/parse-cst.js",
    "./scalar.js": "./browser/scalar.js",
    "./schema.js": "./browser/schema.js",
    "./seq.js": "./browser/seq.js",
    "./types.js": "./browser/types.js",
    "./types.mjs": "./browser/types.js",
    "./types/binary.js": "./browser/types/binary.js",
    "./types/oma
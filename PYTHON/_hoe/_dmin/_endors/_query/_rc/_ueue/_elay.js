{
  "name": "jiti",
  "version": "1.21.0",
  "description": "Runtime typescript and ESM support for Node.js",
  "repository": "unjs/jiti",
  "license": "MIT",
  "main": "./lib/index.js",
  "types": "dist/jiti.d.ts",
  "bin": "bin/jiti.js",
  "files": [
    "lib",
    "dist",
    "register.js"
  ],
  "scripts": {
    "build": "pnpm clean && NODE_ENV=production pnpm webpack",
    "clean": "rm -rf dist",
    "dev": "pnpm clean && pnpm webpack --watch",
    "jiti": "JITI_DEBUG=1 JITI_CACHE=false JITI_REQUIRE_CACHE=false ./bin/jiti.js",
    "jiti:legacy": "JITI_DEBUG=1 npx node@12 ./bin/jiti.js",
    "lint": "eslint -
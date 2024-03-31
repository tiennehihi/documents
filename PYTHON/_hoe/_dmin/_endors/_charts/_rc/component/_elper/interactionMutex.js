{
  "name": "@babel/preset-modules",
  "version": "0.1.6-no-external-plugins",
  "description": "A Babel preset that targets modern browsers by fixing engine bugs.",
  "main": "lib/index.js",
  "license": "MIT",
  "scripts": {
    "start": "concurrently -r 'npm:watch:* -s'",
    "build": "babel src -d lib --ignore '**/*.test.js'",
    "test": "eslint src test && jest --colors",
    "test:browser": "cd test/browser && karmatic --no-coverage --browsers chrome:headless,sauce-chrome
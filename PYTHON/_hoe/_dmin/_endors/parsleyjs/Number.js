{
	"name": "unbox-primitive",
	"version": "1.0.2",
	"description": "Unbox a boxed JS primitive value.",
	"main": "index.js",
	"scripts": {
		"prepublish": "not-in-publish || npm run prepublishOnly",
		"prepublishOnly": "safe-publish-latest",
		"lint": "eslint --ext=js,mjs .",
		"pretest": "npm run lint",
		"tests-only": "nyc tape 'test/**/*.js'",
		"test": "npm run tests-only",
		"posttest": "aud --production",
		"ver
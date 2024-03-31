{
	"name": "@csstools/postcss-text-decoration-shorthand",
	"description": "Use text-decoration in it's shorthand form in CSS",
	"version": "1.0.0",
	"contributors": [
		{
			"name": "Antonio Laguna",
			"email": "antonio@laguna.es",
			"url": "https://antonio.laguna.es"
		},
		{
			"name": "Romain Menke",
			"email": "romainmenke@gmail.com"
		}
	],
	"license": "CC0-1.0",
	"funding": {
		"type": "opencollective",
		"url": "https://opencollective.com/csstools"
	},
	"engines": {
		"node": "^12 || ^14 || >=16"
	},
	"main": "dist/index.cjs",
	"module": "dist/index.mjs",
	"types": "dist/index.d.ts",
	"exports": {
		".": {
			"import": "./dist/index.mjs",
			"require": "./dist/index.cjs",
			"default": "./dist/index.mjs"
		}
	},
	"files": [
		"CHANGELOG.md",
		"LICENSE.md",
		"README.md",
		"dist"
	],
	"dependencies": {
		"postcss-value-parser": "^4.2.0"
	},
	"peerDependencies": {
		"postcss": "^8.2"
	},
	"devDependencies": {
		"autoprefixer": "^10.4.8"
	},
	"scripts": {
		"build"
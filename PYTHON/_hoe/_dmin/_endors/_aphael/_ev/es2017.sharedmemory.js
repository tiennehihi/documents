{
	"name": "type-fest",
	"version": "0.20.2",
	"description": "A collection of essential TypeScript types",
	"license": "(MIT OR CC0-1.0)",
	"repository": "sindresorhus/type-fest",
	"funding": "https://github.com/sponsors/sindresorhus",
	"author": {
		"name": "Sindre Sorhus",
		"email": "sindresorhus@gmail.com",
		"url": "https://sindresorhus.com"
	},
	"engines": {
		"node": ">=10"
	},
	"scripts": {
		"//test": "xo && tsd && tsc",
		"test": "xo && tsc"
	},
	"files": [
		"index.d.ts",
		"base.d.ts",
		"source",
		"ts41"
	],
	"keywords": [
		"typescript",
		"ts",
		"types",
		"utility",
		"util",
		"utilities",
		"omit",
		"merge",
		"json"
	],
	"devDependencies": {
		"@sindresorhus/tsconfig": "~0.7.0",
		"tsd": "^0.13.1",
		"typescript": "^4.1.2",
		"xo": "^0.35.0"
	},
	"types": "./index.d.ts",
	"typesVersions": {
		">=4.1": {
			"*": [
				"ts41/*"
			]
{
	"name": "postcss-env-function",
	"description": "Use env() variables in CSS",
	"version": "4.0.6",
	"author": "Jonathan Neal <jonathantneal@hotmail.com>",
	"license": "CC0-1.0",
	"engines": {
		"node": "^12 || ^14 || >=16"
	},
	"main": "dist/index.cjs",
	"module": "dist/index.mjs",
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
		"postcss": "^8.4"
	},
	"scripts": {
		"build": "rollup -c ../../rollup/default.js",
		"clean": "node -e \"fs.rmSync('./dist', { recursive: true, force: true });\"",
		"docs": "node ../../.github/bin/generate-docs/install.mjs",
		"lint": "npm run lint:eslint && npm run lint:package-json",
		"lint:eslint": "eslint ./src --ext .js --ext .ts --ext .mjs --no-error-on-unmatched-pattern"
{
	"name": "ansi-styles",
	"version": "4.3.0",
	"description": "ANSI escape codes for styling strings in the terminal",
	"license": "MIT",
	"repository": "chalk/ansi-styles",
	"funding": "https://github.com/chalk/ansi-styles?sponsor=1",
	"author": {
		"name": "Sindre Sorhus",
		"email": "sindresorhus@gmail.com",
		"url": "sindresorhus.com"
	},
	"engines": {
		"node": ">=8"
	},
	"scripts": {
		"test": "xo && ava && tsd",
		"screenshot": "svg-term --command='node screenshot' --out=screenshot.svg --padding=3 --width=55 --hei
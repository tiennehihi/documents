import {Options as LocatePathOptions} from 'locate-path';

declare const stop: unique symbol;

declare namespace findUp {
	interface Options extends LocatePathOptions {}

	type StopSymbol = typeof stop;

	type Match = string | StopSymbol | undefined;
}

declare const findUp: {
	/**
	Find a file or directory by walking up parent directories.

	@param name - Name of the file or directory to find. Can be multiple.
	@returns The first path found (by respecting the order of `name`s) or `undefined` if none could be found.

	@example
	```
	// /
	// └── Users
	//     └── sindresorhus
	//         ├── unicorn.png
	//         └── foo
	//             └── bar
	//                 ├── baz
	//                 └── example.js

	// example.js
	import findUp = require('find-up');

	(async () => {
		console.log(await findUp('unicorn.png'));
		//=> '/Users/sindresorhus/unicorn.png'

		console.log(await findUp(['rainbow.png', 'unicorn.png']));
		//=> '/Use
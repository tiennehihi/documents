declare namespace TsConfigJson {
	namespace CompilerOptions {
		export type JSX =
			| 'preserve'
			| 'react'
			| 'react-native';

		export type Module =
			| 'CommonJS'
			| 'AMD'
			| 'System'
			| 'UMD'
			| 'ES6'
			| 'ES2015'
			| 'ESNext'
			| 'None'
			// Lowercase alternatives
			| 'commonjs'
			| 'amd'
			| 'system'
			| 'umd'
			| 'es6'
			| 'es2015'
			| 'esnext'
			| 'none';

		export type NewLine =
			| 'CRLF'
			| 'LF'
			// Lowercase alternatives
			| 'crlf'
			| 'lf';

		export type Target =
			| 'ES3'
			| 'ES5'
			| 'ES6'
			| 'ES2015'
			| 'ES2016'
			| 'ES2017'
			| 'ES2018'
			| 'ES2019'
			| 'ES2020'
			| 'ESNext'
			// Lowercase alternatives
			| 'es3'
			| 'es5'
			| 'es6'
			| 'es2015'
			| 'es2016'
			| 'es2017'
			| 'es2018'
			| 'es2019'
			| 'es2020'
			| 'esnext';

		export type Lib =
			| 'ES5'
			| 'ES6'
			| 'ES7'
			| 'ES2015'
			| 'ES2015.Collection'
			| 'ES2015.Core'
			| 'ES2015.Generator'
			| 'ES2015.Iterable'
			| 'ES2015.Promise'
			| 'ES2015.Proxy'
			| 'ES2015.Reflect'
			| 'ES2015.Symbol.WellKnown'
			| 'ES2015.Symbol'
			| 'ES2016'
			| 'ES2016.Array.Include'
			| 'ES2017'
			| 'ES2017.Intl'
			| 'ES2017.Object'
			| 'ES2017.SharedMemory'
			| 'ES2017.String'
			| 'ES2017.TypedArrays'
			| 'ES2018'
			| 'ES2018.AsyncIterable'
			| 'ES2018.Intl'
			| 'ES2018.Promise'
			| 'ES2018.Regexp'
			| 'ES2019'
			| 'ES2019.Array'
			| 'ES2019.Object'
			| 'ES2019.String'
			| 'ES2019.Symbol'
			| 'ES2020'
			| 'ES2020.String'
			| 'ES2020.Symbol.WellKnown'
			| 'ESNext'
			| 'ESNext.Array'
			| 'ESNext.AsyncIterable'
			| 'ESNext.BigInt'
			| 'ESNext.Intl'
			| 'ESNext.Symbol'
			| 'DOM'
			| 'DOM.Iterable'
			| 'ScriptHost'
			| 'WebWorker'
			| 'WebWorker.ImportScripts'
			// Lowercase alternatives
			| 'es5'
			| 'es6'
			| 'es7'
			| 'es2015'
			| 'es2015.collection'
			| 'es2015.core'
			| 'es2015.generator'
			| 'es2015.iterable'
			| 'es2015.promise'
			| 'es2015.proxy'
			| 'es2015.reflect'
			| 'es2015.symbol.wellknown'
			| 'es2015.symbol'
			| 'es2016'
			| 'es2016.array.include'
			| 'es2017'
			| 'es2017.intl'
			| 'es2017.object'
			| 'es2017.sharedmemory'
			| 'es2017.string'
			| 'es2017.typedarrays'
			| 'es2018'
			| 'es2018.asynciterable'
			| 'es2018.intl'
			| 'es2018.promise'
			| 'es2018.regexp'
			| 'es2019'
			| 'es2019.array'
			| 'es2019.object'
			| 'es2019.string'
			| 'es2019.symbol'
			| 'es2020'
			| 'es2020.string'
			| 'es2020.symbol.wellknown'
			| 'esnext'
			| 'esnext.array'
			| 'esnext.asynciterable'
			| 'esnext.bigint'
			| 'esnext.intl'
			| 'esnext.symbol'
			| 'dom'
			| 'dom.iterable'
			| 'scripthost'
			| 'webworker'
			| 'webworker.importscripts';

		export interface Plugin {
			[key: string]: unknown;
			/**
			Plugin name.
			*/
			name?: string;
		}
	}

	export interface CompilerOptions {
		/**
		The character set of the input files.

		@default 'utf8'
		*/
		charset?: string;

		/**
		Enables building for project references.

		@default true
		*/
		composite?: boolean;

		/**
		Generates corresponding d.ts files.

		@default false
		*/
		declaration?: boolean;

		/**
		Specify output directory for generated declaration files.

		Requires TypeScript version 2.0 or later.
		*/
		declarationDir?: string;

		/**
		Show diagnostic information.

		@default false
		*/
		diagnostics?: boolean;

		/**
		Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files.

		@default false
		*/
		emitBOM?: boolean;

		/**
		Only emit `.d.ts` declaration files.

		@default false
		*/
		emitDeclarationOnly?: boolean;

		/**
		Enable incremental compilation.

		@default `composite`
		*/
		incremental?: boolean;

		/**
		Specify file to store incremental compilation information.

		@default '.tsbuildinfo'
		*/
		tsBuildInfoFile?: string;

		/**
		Emit a single file with source maps instead of having a separate file.

		@default false
		*/
		inlineSourceMap?: boolean;

		/**
		Emit the source alongside the sourcemaps within a single file.

		Requires `--inlineSourceMap` to be set.

		@default false
		*/
		inlineSources?: boolean;

		/**
		Specify JSX code generation: `'preserve'`, `'react'`, or `'react-native'`.

		@default 'preserve'
		*/
		jsx?: CompilerOptions.JSX;

		/**
		Specifies the object invoked for `createElement` and `__spread` when targe
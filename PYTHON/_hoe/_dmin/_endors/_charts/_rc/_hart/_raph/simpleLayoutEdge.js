import {LiteralUnion} from './literal-union';

declare namespace PackageJson {
	/**
	A person who has been involved in creating or maintaining the package.
	*/
	export type Person =
		| string
		| {
			name: string;
			url?: string;
			email?: string;
		};

	export type BugsLocation =
		| string
		| {
			/**
			The URL to the package's issue tracker.
			*/
			url?: string;

			/**
			The email address to which issues should be reported.
			*/
			email?: string;
		};

	export interface DirectoryLocations {
		[directoryType: string]: unknown;

		/**
		Location for executable scripts. Sugar to generate entries in the `bin` property by walking the folder.
		*/
		bin?: st
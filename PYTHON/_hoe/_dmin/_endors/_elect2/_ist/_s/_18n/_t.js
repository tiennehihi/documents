/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/

"use strict";

const RuntimeGlobals = require("../RuntimeGlobals");
const RuntimeModule = require("../RuntimeModule");
const Template = require("../Template");
const JavascriptModulesPlugin = require("../javascript/JavascriptModulesPlugin");
const { getUndoPath } = require("../util/identifier");

/** @typedef {import("../Compilation")} Compilation */

class AutoPublicPathRuntimeModule extends RuntimeModule {
	constructor() {
		super("publicPath", RuntimeModule.STAGE_BASIC);
	}

	/**
	 * @returns {string | null} runtime code
	 */
	generate() {
		const compilation = /** @type {Compilation} */ (this.compilation);
		const { scriptType, importMetaName, path } = compilation.outputOptions;
		const chun
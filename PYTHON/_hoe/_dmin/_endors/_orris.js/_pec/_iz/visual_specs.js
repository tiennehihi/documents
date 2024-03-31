/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/

"use strict";

const RuntimeGlobals = require("../RuntimeGlobals");
const Template = require("../Template");
const HelperRuntimeModule = require("./HelperRuntimeModule");

/** @typedef {import("../Compilation")} Compilation */

class AsyncModuleRuntimeModule extends HelperRuntimeModule {
	constructor() {
		super("async module");
	}

	/**
	 * @returns {string | null} runtime code
	 */
	generate() {
		const compilation = /** @type {Compilation} */ (this.compilation);
		const { runtimeTemplate } = compilation;
		const fn = RuntimeGlobals.asyncModule;
		return Template.asString([
			'var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";',
			`var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "${RuntimeGlobals.exports}";`,
			'var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";',
			`var resolveQueue = ${runtimeTemplate.basicFunction("queue", [
				"if(queue && queue.d < 1) {",
				Template.indent([
					"queue.d = 1;",
					`queue.forEach(${runtimeTemplate.expressionFunction(
						"fn.r--",
						"fn"
					)});`,
					`queue.forEach(${runtimeTemplate.expressionFunction(
						"fn.r-- ? fn.r++ : fn()",
						"fn"
					)});`
				]),
				"}"
			])}`,
			`var wrapDeps = ${runtimeTemplate.returningFunction(
				`deps.map(${runtimeTemplate.basicFunction("dep", [
				
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const DescriptionFileUtils = require("./DescriptionFileUtils");
const getInnerRequest = require("./getInnerRequest");

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").JsonPrimitive} JsonPrimitive */
/** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class AliasFieldPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | Array<string>} field field
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, field, target) {
		this.source = source;
		this.field = field;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("AliasFieldPlugin", (request, resolveContext, callback) => {
				if (!request.descriptionFileData) return callback();
				const innerRequest = getInnerRequest(resolver, request);
				if (!innerRequest) return callback();
				const fieldData = DescriptionFileUtils.getField(
					request.descriptionFileData,
					this.field
				);
				if (fieldData === null || typeof fieldData !== "obje
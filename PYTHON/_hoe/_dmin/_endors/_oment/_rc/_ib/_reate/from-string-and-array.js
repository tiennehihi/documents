/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const DependenciesBlock = require("./DependenciesBlock");
const makeSerializable = require("./util/makeSerializable");

/** @typedef {import("./ChunkGraph")} ChunkGraph */
/** @typedef {import("./ChunkGroup")} ChunkGroup */
/** @typedef {import("./ChunkGroup").ChunkGroupOptions} ChunkGroupOptions */
/** @typedef {import("./Dependency").DependencyLocation} DependencyLocation */
/** @typedef {import("./Dependency").UpdateHashContext} UpdateHashContext */
/** @typedef {import("./Entrypoint").EntryOptions} EntryOptions */
/** @typedef {import("./Module")} Module */
/** @typedef {import("./serialization/ObjectMiddleware").ObjectDeserializerContext} ObjectDeserializerContext */
/** @typedef {import("./serialization/ObjectMiddleware").ObjectSerializerContext} ObjectSerializerContext */
/** @typedef {import("./util/Hash")} Hash */

class AsyncDependenciesBlock extends DependenciesBlock {
	/**
	 * @param {(ChunkGroupOptions & { entryOptions?: EntryOptions }) | null} groupOptions options for the group
	 * @param {(DependencyLocation | null)=} loc the line of code
	 * @param {(string | null)=} request the request
	 */
	constructor(groupOptions, loc, request) {
		super();
		if (typeof groupOptions === "string") {
			groupOptions = { name: groupOptions };
		} else if (!groupOptions) {
			groupOptions = { name: undefined };
		}
		this.groupOpti
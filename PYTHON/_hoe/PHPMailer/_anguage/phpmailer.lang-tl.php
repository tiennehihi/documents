import {immerable} from "../immer"
import {
	ImmerState,
	Patch,
	SetState,
	ES5ArrayState,
	ProxyArrayState,
	MapState,
	ES5ObjectState,
	ProxyObjectState,
	PatchPath,
	get,
	each,
	has,
	getArchtype,
	isSet,
	isMap,
	loadPlugin,
	ProxyType,
	Archtype,
	die,
	isDraft,
	isDraftable,
	NOTHING
} from "../internal"

export function enablePatches() {
	const REPLACE = "replace"
	const ADD = "add"
	const REMOVE = "remove"

	function generatePatches_(
		state: ImmerState,
		basePath: PatchPath,
		patches: Patch[],
		inversePatches: Patch[]
	): void {
		switch (state.type_) {
			case ProxyType.ProxyObject:
			case ProxyType.ES5Object:
			case ProxyType.Map:
				return generatePatchesFromAssigned(
					state,
					basePath,
					patches,
					inversePatches
				)
			case ProxyType.ES5Array:
			case ProxyType.ProxyArray:
				return generateArrayPatches(state, basePath, patches, inversePatches)
			case ProxyType.Set:
				return generateSetPatches(
					(state as any) as SetState,
					basePath,
					patches,
					inversePatches
				)
		}
	}

	function generateArrayPatches(
		state: ES5ArrayState | ProxyArrayState,
		basePath: PatchPath,
		patches: Patch[],
		inversePatches: Patch[]
	) {
		let {base_, assigned_} = state
		let copy_ = state.copy_!

		// Reduce complexity by ensuring `base` is never longer.
		if (copy_.length < base_.length) {
			// @ts-ignore
			;[base_, copy_] = [copy_, base_]
			;[patches, inversePatches] = [inversePatches, patches]
		}

		// Process replaced indices.
		for (let i = 0; i < base_.length; i++) {
			if (assigned_[i] && copy_[i] !== base_[i]) {
				const path = basePath.concat([i])
				patches.push({
					op: REPLACE,
					path,
					// Need to maybe clone it, as it can in 
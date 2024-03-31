import {
	DRAFT_STATE,
	DRAFTABLE,
	hasSet,
	Objectish,
	Drafted,
	AnyObject,
	AnyMap,
	AnySet,
	ImmerState,
	hasMap,
	Archtype,
	die
} from "../internal"

/** Returns true if the given value is an Immer draft */
/*#__PURE__*/
export function isDraft(value:
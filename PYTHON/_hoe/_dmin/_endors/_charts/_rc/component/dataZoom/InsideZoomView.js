unfinalizedDrafts_--\n\t\tconst result =\n\t\t\t// For ES5, create a good copy from the draft first, with added keys and without deleted keys.\n\t\t\tstate.type_ === ProxyType.ES5Object || state.type_ === ProxyType.ES5Array\n\t\t\t\t? (state.copy_ = shallowCopy(state.draft_))\n\t\t\t\t: state.copy_\n\t\t// Finalize all children of the copy\n\t\t// For sets we clone before iterating, otherwise we can get in endless loop due to modifying during iteration, see #628\n\t\t// To preserve insertion order in all cases we then clear the set\n\t\t// And we let finalizeProperty know it needs to re-add non-draft children back to the target\n\t\tlet resultEach = result\n\t\tlet isSet = false\n\t\tif (state.type_ === ProxyType.Set) {\n\t\t\tresultEach = new Set(result)\n\t\t\tresult.clear()\n\t\t\tisSet = true\n\t\t}\n\t\teach(resultEach, (key, childValue) =>\n\t\t\tfinalizeProperty(rootScope, state, result, key, childValue, path, isSet)\n\t\t)\n\t\t// everything inside is frozen, we can freeze here\n\t\tmaybeFreeze(rootScope, result, false)\n\t\t// first time finalizing, let's create those patches\n\t\tif (path && rootScope.patches_) {\n\t\t\tgetPlugin(\"Patches\").generatePatches_(\n\t\t\t\tstate,\n\t\t\t\tpath,\n\t\t\t\trootScope.patches_,\n\t\t\t\trootScope.inversePatches_!\n\t\t\t)\n\t\t}\n\t}\n\treturn state.copy_\n}\n\nfunction finalizeProperty(\n\trootScope: ImmerScope,\n\tparentState: undefined | ImmerState,\n\ttargetObject: any,\n\tprop: string | number,\n\tchildValue: any,\n\trootPath?: PatchPath,\n\ttargetIsSet?: boolean\n) {\n\tif (__DEV__ && childValue === targetObject) die(5)\n\tif (isDraft(childValue)) {\n\t\tconst path =\n\t\t\trootPath &&\n\t\t\tparentState &&\n\t\t\tparentState!.type_ !== ProxyType.Set && // Set objects are atomic since they have no keys.\n\t\t\t!has((parentState as Exclude<ImmerState, SetState>).assigned_!, prop) // Skip deep patches for assigned keys.\n\t\t\t\t? rootPath!.concat(prop)\n\t\t\t\t: undefined\n\t\t// Drafts owned by `scope` are finalized here.\n\t\tconst res = finalize(rootScope, childValue, path)\n\t\tset(targetObject, prop, res)\n\t\t// Drafts from another scope must prevented to be frozen\n\t\t// if we got a draft back from finalize, we're in a nested produce and shouldn't freeze\n\t\tif (isDraft(res)) {\n\t\t\trootScope.canAutoFreeze_ = false\n\t\t} else return\n\t} else if (targetIsSet) {\n\t\ttargetObject.add(childValue)\n\t}\n\t// Search new objects for unfinalized drafts. Frozen objects should never contain drafts.\n\tif (isDraftable(childValue) && !isFrozen(childValue)) {\n\t\tif (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {\n\t\t\t// optimization: if an object is not a draft, and we don't have to\n\t\t\t// deepfreeze everything, and we are sure that no drafts are left in the remaining object\n\t\t\t// cause we saw and finalized all drafts already; we can stop visiting the rest of the tree.\n\t\t\t// This benefits especially adding large data tree's without further processing.\n\t\t\t// See add-data.js perf test\n\t\t\treturn\n\t\t}\n\t\tfinalize(rootScope, childValue)\n\t\t// immer deep freezes plain objects, so if there is no parent state, we freeze as well\n\t\tif (!parentState || !parentState.scope_.parent_)\n\t\t\tmaybeFreeze(rootScope, childValue)\n\t}\n}\n\nfunction maybeFreeze(scope: ImmerScope, value: any, deep = false) {\n\t// we never freeze for a non-root scope; as it would prevent pruning for drafts inside wrapping objects\n\tif (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {\n\t\tfreeze(value, deep)\n\t}\n}\n","import {\n\teach,\n\thas,\n\tis,\n\tisDraftable,\n\tshallowCopy,\n\tlatest,\n\tImmerBaseState,\n\tImmerState,\n\tDrafted,\n\tAnyObject,\n\tAnyArray,\n\tObjectish,\n\tgetCurrentScope,\n\tDRAFT_STATE,\n\tdie,\n\tcreateProxy,\n\tProxyType\n} from \"../internal\"\n\ninterface ProxyBaseState extends ImmerBaseState {\n\tassigned_: {\n\t\t[property: string]: boolean\n\t}\n\tparent_?: ImmerState\n\trevoke_(): void\n}\n\nexport interface ProxyObjectState extends ProxyBaseState {\n\ttype_: ProxyType.ProxyObject\n\tbase_: any\n\tcopy_: any\n\tdraft_: Drafted<AnyObject, ProxyObjectState>\n}\n\nexport interface ProxyArrayState extends ProxyBaseState {\n\ttype_: ProxyType.ProxyArray\n\tbase_: AnyArray\n\tcopy_: AnyArray | null\n\tdraft_: Drafted<AnyArray, ProxyArrayState>\n}\n\ntype ProxyState = ProxyObjectState | ProxyArrayState\n\n/**\n * Returns a new draft of the `base` object.\n *\n * The second argument is the parent draft-state (used internally).\n */\nexport function createProxyProxy<T extends Objectish>(\n\tbase: T,\n\tparent?: ImmerState\n): Drafted<T, ProxyState> {\n\tconst isArray = Array.isArray(base)\n\tconst state: ProxyState = {\n\t\ttype_: isArray ? ProxyType.ProxyArray : (ProxyType.ProxyObject as any),\n\t\t// Track which produce call this is associated with.\n\t\tscope_: parent ? parent.scope_ : getCurrentScope()!,\n\t\t// True for both shallow and deep changes.\n\t\tmodified_: false,\n\t\t// Used during finalization.\n\t\tfinalized_: false,\n\t\t// Track which properties have been assigned (true) or deleted (false).\n\t\tassigned_: {},\n\t\t// The parent draft state.\n\t\tparent_: parent,\n\t\t// The base state.\n\t\tbase_: base,\n\t\t// The base proxy.\n\t\tdraft_: null as any, // set below\n\t\t// The base copy with any updated values.\n\t\tcopy_: null,\n\t\t// Called by the `produce` function.\n\t\trevoke_: null as any,\n\t\tisManual_: false\n\t}\n\n\t// the traps must target something, a bit like the 'real' base.\n\t// but also, we need to be able to determine from the target what the relevant state is\n\t// (to avoid creating traps per instance to capture the state in closure,\n\t// and to avoid creating weird hidden properties as well)\n\t// So the trick is to use 'state' as the actual 'target'! (and make sure we intercept everything)\n\t// Note that in the case of an array, we put the state in an array to have better Reflect defaults ootb\n\tlet target: T = state as any\n\tlet traps: Pr
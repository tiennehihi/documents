tif (typeof Promise !== \"undefined\" && result instanceof Promise) {\n\t\t\treturn result.then(nextState => [nextState, patches!, inversePatches!])\n\t\t}\n\t\treturn [result, patches!, inversePatches!]\n\t}\n\n\tcreateDraft<T extends Objectish>(base: T): Draft<T> {\n\t\tif (!isDraftable(base)) die(8)\n\t\tif (isDraft(base)) base = current(base)\n\t\tconst scope = enterScope(this)\n\t\tconst proxy = createProxy(this, base, undefined)\n\t\tproxy[DRAFT_STATE].isManual_ = true\n\t\tleaveScope(scope)\n\t\treturn proxy as any\n\t}\n\n\tfinishDraft<D extends Draft<any>>(\n\t\tdraft: D,\n\t\tpatchListener?: PatchListener\n\t): D extends Draft<infer T> ? T : never {\n\t\tconst state: ImmerState = draft && (draft as any)[DRAFT_STATE]\n\t\tif (__DEV__) {\n\t\t\tif (!state || !state.isManual_) die(9)\n\t\t\tif (state.finaliz
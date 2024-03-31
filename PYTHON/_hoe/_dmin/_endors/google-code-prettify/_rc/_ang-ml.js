  return {
            entryModules: this.indexedEntryModules.map(({ module }) => module),
            implicitEntryModules: [...this.implicitEntryModules],
            newEntryModules
        };
    }
    async emitChunk({ fileName, id, importer, name, implicitlyLoadedAfterOneOf, preserveSignature }) {
        const unresolvedModule = {
            fileName: fileName || null,
            id,
            importer,
            name: name || null
        };
        const module = implicitlyLoadedAfterOneOf
            ? await this.addEntryWithImplicitDependants(unresolvedModule, implicitlyLoadedAfterOneOf)
            : (await this.addEntryModules([unresolvedModule], false)).newEntryModules[0];
        if (preserveSignature != null) {
            module.preserveSignature = preserveSignature;
        }
        return module;
    }
    async preloadModule(resolvedId) {
        const module = await this.fetchModule(this.getResolvedIdWithDefaults(resolvedId), undefined, false, resolvedId.resolveDependencies ? RESOLVE_DEPENDENCIES : true);
        return module.info;
    }
    addEntryWithImplicitDependants(unresolvedModule, implicitlyLoadedAfter) {
        const chunkNamePriority = this.nextChunkNamePriority++;
        return this.extendLoadModulesPromise(this.loadEntryModule(unresolvedModule.id, false, unresolvedModule.importer, null).then(async (entryModule) => {
            addChunkNamesToModule(entryModule, unresolvedModule, false, chunkNamePriority);
            if (!entryModule.info.isEntry) {
                this.implicitEntryModules.add(entryModule);
                const implicitlyLoadedAfterModules = await Promise.all(implicitlyLoadedAfter.map(id => this.loadEntryModule(id, false, unresolvedModule.importer, entryModule.id)));
                for (const module of implicitlyLoadedAfterModules) {
                    entryModule.implicitlyLoadedAfter.add(module);
                }
                for (const dependant of entryModule.implicitlyLoadedAfter) {
                    dependant.implicitlyLoadedBefore.add(entryModule);
                }
            }
            return entryModule;
        }));
    }
    async addModuleSource(id, importer, module) {
        timeStart('load modules', 3);
        let source;
        try {
            source = await this.graph.fileOperationQueue.run(async () => { var _a; return (_a = (await this.pluginDriver.hookFirst('load', [id]))) !== null && _a !== void 0 ? _a : (await promises.readFile(id, 'utf8')); });
        }
        catch (err) {
            timeEnd('load modules', 3);
            let msg = `Could not load ${id}`;
            if (importer)
                msg += ` (imported by ${relativeId(importer)})`;
            msg += `: ${err.message}`;
            err.message = msg;
            throw err;
        }
        timeEnd('load modules', 3);
        const sourceDescription = typeof source === 'string'
            ? { code: source }
            : source != null && typeof source 
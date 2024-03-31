
            options.onwarn(warning);
        }
    };
}

// This will make sure no input hook is omitted
const inputHookNames = {
    buildEnd: 1,
    buildStart: 1,
    closeBundle: 1,
    closeWatcher: 1,
    load: 1,
    moduleParsed: 1,
    options: 1,
    resolveDynamicImport: 1,
    resolveId: 1,
    shouldTransformCachedModule: 1,
    transform: 1,
    watchChange: 1
};
const inputHooks = Object.keys(inputHookNames);
class PluginDriver {
    constructor(graph, options, userPlugins, pluginCache, basePluginDriver) {
        this.graph = graph;
        this.options = options;
        this.pluginCache = pluginCache;
        this.sortedPlugins = new Map();
        this.unfulfilledActions = new Set();
        warnDeprecatedHooks(userPlugins, options);
        this.fileEmitter = new FileEmitter(graph, options, basePluginDriver && basePluginDriver.fileEmitter);
        this.emitFile = this.fileEmitter.emitFile.bind(this.fileEmitter);
        this.getFileName = this.fileEmitter.getFileName.bind(this.fileEmitter);
        this.finaliseAssets = this.fileEmitter.assertAssetsFinalized.bind(this.fileEmitter);
        this.setOutputBundle = this.fileEmitter.setOutputBundle.bind(this.fileEmitter);
        this.plugins = userPlugins.concat(basePluginDriver ? basePluginDriver.plugins : []);
        const existingPluginNames = new Set();
        this.pluginContexts = new Map(this.plugins.map(plugin => [
            plugin,
            getPluginContext(plugin, pluginCache, graph, options, this.fileEmitter, existingPluginNames)
        ]));
        if (basePluginDriver) {
            for (const plugin of userPlugins) {
                for (const hook of inputHooks) {
                    if (hook in plugin) {
                        options.onwarn(errInputHookInOutputPlugin(plugin.name, hook));
                    }
                }
            }
        }
    }
    createOutputPluginDriver(plugins) {
        return new PluginDriver(this.graph, this.options, plugins, this.pluginCache, this);
    }
    getUnfulfilledHookActions() {
        return this.unfulfilledActions;
    }
    // chains, first non-null result stops and returns
    hookFirst(hookName, args, replaceContext, skipped) {
        let promise = Promise.resolve(null);
        for (const plugin of this.getSortedPlugins(hookName)) {
            if (skipped && skipped.has(plugin))
                continue;
            promise = promise.then(result => {
                if (result != null)
                    return result;
                return this.runHook(hookName, args, plugin, replaceContext);
            });
        }
        return promise;
    }
    // chains synchronously, first non-null result stops and returns
    hookFirstSync(hookName, args, replaceContext) {
        for (const plugin of this.getSortedPlugins(hookName)) {
            const result = this.runHookSync(hookName, args, plugin, replaceContext);
            if (result != null)
                return result;
        }
        return null;
    }
    // parallel, ignores returns
    async hookParallel(hookName, args, replaceContext) {
   
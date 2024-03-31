les;
            }
            await graph.pluginDriver.hookParallel('buildEnd', [err]);
            await graph.pluginDriver.hookParallel('closeBundle', []);
            throw err;
        }
        await graph.pluginDriver.hookParallel('buildEnd', []);
    });
    timeEnd('BUILD', 1);
    const result = {
        cache: useCache ? graph.getCache() : undefined,
        async close() {
            if (result.closed)
                return;
            result.closed = true;
            await graph.pluginDriver.hookParallel('closeBundle', []);
        },
        closed: false,
        async generate(rawOutputOptions) {
            if (result.closed)
                return error(errAlreadyClosed());
            return handleGenerateWrite(false, inputOptions, unsetInputOptions, rawOutputOptions, graph);
        },
        watchFiles: Object.keys(graph.watchFiles),
        async write(rawOutputOptions) {
            if (result.closed)
                return error(errAlreadyClosed());
            return handleGenerateWrite(true, inputOptions, unsetInputOptions, rawOutputOptions, graph);
        }
    };
    if (inputOptions.perf)
        result.getTimings = getTimings;
    return result;
}
async function getInputOptions(rawInputOptions, watchMode) {
    if (!rawInputOptions) {
        throw new Error('You must supply an options object to rollup');
    }
    const rawPlugins = getSortedValidatedPlugins('options', ensureArray(rawInputOptions.plugins));
    const { options, unsetOptions } = normalizeInputOptions(await rawPlugins.reduce(applyOptionHook(watchMode), Promise.resolve(rawInputOptions)));
    normalizePlugins(options.plugins, ANONYMOUS_PLUGIN_PREFIX);
    return { options, unsetOptions };
}
function applyOptionHook(watchMode) {
    return async (inputOptions, plugin) => {
        const handler = 'handler' in plugin.options ? plugin.options.handler : plugin.options;
        return ((await handler.call({ meta: { rollupVersion: version$1, watchMode } }, await inputOptions)) || inputOptions);
    };
}
function normalizePlugins(plugins, anonymousPrefix) {
    plugins.forEach((plugin, index) => {
        if (!plugin.name) {
            plugin.name = `${anonymousPrefix}${index + 1}`;
        }
    });
}
function handleGenerateWrite(isWrite, inputOptions, unsetInputOptions, rawOutputOptions, graph) {
    const { options: outputOptions, outputPluginDriver, 
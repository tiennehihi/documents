e: ctx.name,
                importerPath: ctx.filePath
            });
        }

        let filePath;
        let error;

        try {
            filePath = resolver.resolve(request, relativeTo);
        } catch (resolveError) {
            error = resolveError;
            /* istanbul ignore else */
            if (error && error.code === "MODULE_NOT_FOUND") {
                error.messageTemplate = "plugin-missing";
                error.messageData = {
                    pluginName: request,
                    resolvePluginsRelativeTo: ctx.pluginBasePath,
                    importerName: ctx.name
                };
            }
        }

        if (filePath) {
            try {
                writeDebugLogForLoading(request, relativeTo, filePath);

                const startTime = Date.now();
                const pluginDefinition = require$1(filePath);

                debug$2(`Plugin ${filePath} loaded in: ${Date.now() - startTime}ms`);

                return new ConfigDependency({
                    definition: normalizePlugin(pluginDefinition),
                    original: pluginDefinition,
                    filePath,
                    id,
                    importerName: ctx.name,
                    importerPath: ctx.filePath
                });
            } catch (loadError) {
                error = loadError;
            }
        }

        debug$2("Failed to load plugin '%s' declared in '%s'.", name, ctx.name);
        error.message = `Failed to load plugin '${name}' declared in '${ctx.name}': ${error.message}`;
        return new ConfigDependency({
            error,
            id,
            importerName: ctx.name,
            importerPath: ctx.filePath
        });
    }

    /**
     * Take file expression processors as config array elements.
     * @param {Record<string,DependentPlugin>} plugins The plugin definitions.
     * @param {ConfigArrayFactoryLoadingContext} ctx The loading context.
     * @returns {IterableIterator<ConfigArrayElement>} The config array elements of file expression processors.
     * @private
     */
    *_takeFileExtensionProcessors(plugins, ctx) {
        for (const pluginId of Object.keys(plugins)) {
            const processors =
                plugins[pluginId] &&
                plugins[pluginId].definition &&
                plugins[pluginId].definition.processors;

            if (!processors) {
                continue;
            }

            for (const processorId of Object.keys(processors)) {
                if (processorId.startsWith(".")) {
                    yield* this._normalizeObjectConfigData(
                        {
                            files: [`*${processorId}`],
                            processor: `${pluginId}/${processorId}`
                        },
                        {
                            ...ctx,
                            type: "implicit-processor",
                            name: `${ctx.name}#processors["${pluginId}/${processorId}"]`
                        }
                    );
                }
            }
        }
    }
}

/**
 * @fileoverview `CascadingConfigArrayFactory` class.
 *
 * `CascadingConfigArrayFactory` class has a responsibility:
 *
 * 1. Handles cascading of config files.
 *
 * It provides two methods:
 *
 * - `getConfigArrayForFile(filePath)`
 *     Get the corresponded configuration of a given file. This method doesn't
 *     throw even if the given file didn't exist.
 * - `clearCache()`
 *     Clear the internal cache. You have to call this method when
 *     `additionalPluginPool` was updated if `baseConfig` or `cliConfig` depends
 *     on the additional plugins. (`CLIEngine#addPlugin()` method calls this.)
 *
 * @author Toru Nagashima <https://github.com/mysticatea>
 */

const debug$1 = debugOrig__default["default"]("eslintrc:cascading-config-array-factory");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

// Define types for VSCode IntelliSense.
/** @typedef {import("./shared/types").ConfigData} ConfigData */
/** @typedef {import("./shared/types").Parser} Parser */
/** @typedef {import("./shared/types").Plugin} 
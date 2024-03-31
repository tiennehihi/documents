const { validate: validateOptions } = require('schema-utils');
const { getRefreshGlobalScope, getWebpackVersion } = require('./globals');
const {
  getAdditionalEntries,
  getIntegrationEntry,
  getRefreshGlobal,
  getSocketIntegration,
  injectRefreshEntry,
  injectRefreshLoader,
  makeRefreshRuntimeModule,
  normalizeOptions,
} = require('./utils');
const schema = require('./options.json');

class ReactRefreshPlugin {
  /**
   * @param {import('./types').ReactRefreshPluginOptions} [options] Options for react-refresh-plugin.
   */
  constructor(options = {}) {
    validateOptions(schema, options, {
      name: 'React Refresh Plugin',
      baseDataPath: 'options',
    });

    /**
     * @readonly
     * @type {import('./types').NormalizedPluginOptions}
     */
    this.options = normalizeOptions(options);
  }

  /**
   * Applies the plugin.
   * @param {import('webpack').Compiler} compiler A webpack compiler object.
   * @returns {void}
   */
  apply(compiler) {
    // Skip processing in non-development mode, but allow manual force-enabling
    if (
      // Webpack do not set process.env.NODE_ENV, so we need to check for mode.
      // Ref: https://github.com/webpack/webpack/issues/7074
      (compiler.options.mode !== 'development' ||
        // We also check for production process.env.NODE_ENV,
        // in case it was set and mode is non-development (e.g. 'none')
        (process.env.NODE_ENV && process.env.NODE_ENV === 'production')) &&
      !this.options.forceEnable
    ) {
      return;
    }

    const webpackVersion = getWebpackVersion(compiler);
    const logger = compiler.getInfrastructureLogger(this.constructor.name);

    // Get Webpack imports from compiler instance (if available) -
    // this allow mono-repos to use different versions of Webpack without conflicts.
    const webpack = compiler.webpack || require('webpack');
    const {
      DefinePlugin,
      EntryDependency,
      EntryPlugin,
      ModuleFilenameHelpers,
      NormalModule,
      ProvidePlugin,
      RuntimeGlobals,
      Template,
    } = webpack;

    // Inject react-refresh context to all Webpack entry points.
    // This should create `EntryDependency` objects when available,
    // and fallback to patching the `entry` object for legacy workflows.
    const addEntries = getAdditionalEntries({
      devServer: compiler.options.devServer,
      options: this.options,
    });
    if (EntryPlugin) {
      // Prepended entries does not care about injection order,
      // so we can utilise EntryPlugin for simpler logic.
      addEntries.prependEntries.forEach((entry) => {
        new EntryPlugin(compiler.context, entry, { name: undefined }).apply(compiler);
      });

      const integrationEntry = getIntegrationEntry(this.options.overlay.sockIntegration);
      const socketEntryData = [];
      compiler.hooks.make.tap(
        { name: this.constructor.name, stage: Number.POSITIVE_INFINITY },
        (compilation) => {
          // Exhaustively search all entries for `integrationEntry`.
          // If found, mark those entries and the index of `integrationEntry`.
          for (const [name, entryData] of compilation.entries.entries()) {
            const index = entryData.dependencies.findIndex(
              (dep) => dep.request && dep.request.includes(integrationEntry)
            );
            if (index !== -1) {
              socketEntryData.push({ name, index });
            }
          }
        }
      );

      // Overlay entries need to be injected AFTER integration's entry,
      // so we will loop through everything in `finishMake` instead of `make`.
      // This ensures we can traverse all entry points and inject stuff with the correct order.
      addEntries.overlayEntries.forEach((entry, idx, arr) => {
        compiler.hooks.finishMake.tapPromise(
          { name: this.constructor.name, stage: Number.MIN_SAFE_INTEGER + (arr.length - idx - 1) },
          (compilation) => {
            // Only hook into the current compiler
            if (compilation.compiler !== compiler) {
              return Promise.resolve();
            }

            const injectData = socketEntryData.length ? socketEntryData : [{ name: undefined }];
            return Promise.all(
              injectData.map(({ name, index }) => {
                return new Promise((resolve, reject) => {
                  const options = { name };
                  const dep = EntryPlugin.createDependency(entry, options);
                  compilation.addEntry(compiler.context, dep, options, (err) => {
                    if (err) return reject(err);

                    // If the entry is not a global one,
                    // and we have registered the index for integration entry,
                    // we will reorder all entry dependencies to our desired order.
                    // That is, to have additional entries DIRECTLY behind integration entry.
                    if (name && typeof index !== 'undefined') {
                      const entryData = compilation.entries.get(name);
                      entryData.dependencies.splice(
                        index + 1,
                        0,
                        entryData.dependencies.splice(entryData.dependencies.length - 1, 1)[0]
                      );
                    }

                    resolve();
                  });
                });
              })
            ).then(() => {});
          }
        );
      });
    } else {
      compiler.options.entry = injectRefreshEntry(compiler.options.entry, a
config);

            // Do lint.
            results.push(verifyText({
                text,
                filePath: resolvedFilename,
                config,
                cwd,
                fix,
                allowInlineConfig,
                reportUnusedDisableDirectives,
                fileEnumerator,
                linter
            }));
        }

        debug(`Linting complete in: ${Date.now() - startTime}ms`);
        let usedDeprecatedRules;

        return {
            results,
            ...calculateStatsPerRun(results),

            // Initialize it lazily because CLI and `ESLint` API don't use it.
            get usedDeprecatedRules() {
                if (!usedDeprecatedRules) {
                    usedDeprecatedRules = Array.from(
                        iterateRuleDeprecationWarnings(lastConfigArrays)
                    );
                }
                return usedDeprecatedRules;
            }
        };
    }

    /**
     * Returns a configuration object for the given file based on the CLI options.
     * This is the same logic used by the ESLint CLI executable to determine
     * configuration for each file it processes.
     * @param {string} filePath The path of the file to retrieve a config object for.
     * @throws {Error} If filepath a directory path.
     * @returns {ConfigData} A configuration object for the file.
     */
    getConfigForFile(filePath) {
        const { configArrayFactory, options } = internalSlotsMap.get(this);
        const absolutePath = path.resolve(options.cwd, filePath);

        if (directoryExists(absolutePath)) {
            throw Object.assign(
                new Error("'filePath' should not be a directory path."),
                { messageTemplate: "print-config-with-directory-path" }
            );
        }

        return configArrayFactory
            .getConfigArrayForFile(absolutePath)
            .extractConfig(absolutePath)
            .toCompatibleObjectAsConfigFileContent();
    }

    /**
     * Checks if a given path is ignored by ESLint.
     * @param {string} filePath The path of the file to check.
     * @returns {boolean} Whether or not the given path is ignored.
     */
    isPathIgnored(filePath) {
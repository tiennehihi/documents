define( [
	"./class2type"
], function( class2type ) {
	return class2type.toString;
} );
                                                                                                                                                                                                                                                                                                                                                                                                                                        e options object parsed by Optionator.
 * @typedef {Object} ParsedCLIOptions
 * @property {boolean} cache Only check changed files
 * @property {string} cacheFile Path to the cache file. Deprecated: use --cache-location
 * @property {string} [cacheLocation] Path to the cache file or directory
 * @property {"metadata" | "content"} cacheStrategy Strategy to use for detecting changed files in the cache
 * @property {boolean} [color] Force enabling/disabling of color
 * @property {string} [config] Use this configuration, overriding .eslintrc.* config options if present
 * @property {boolean} debug Output debugging information
 * @property {string[]} [env] Specify environments
 * @property {boolean} envInfo Output execution environment information
 * @property {boolean} errorOnUnmatchedPattern Prevent errors when pattern is unmatched
 * @property {boolean} eslintrc Disable use of configuration from .eslintrc.*
 * @property {string[]} [ext] Specify JavaScript file extensions
 * @property {boolean} fix Automatically fix problems
 * @property {boolean} fixDryRun Automatically fix problems without saving the changes to the file system
 * @property {("directive" | "problem" | "suggestion" | "layout")[]} [fixType] Specify the types of fixes to apply (directive, problem, suggestion, layout)
 * @property {string} format Use a specific output format
 * @property {string[]} [global] Define global variables
 * @property {boolean} [help] Show help
 * @property {boolean} ignore Disable use of ignore files and patterns
 * @property {string} [ignorePath] Specify path of ignore file
 * @property {string[]} [ignorePattern] Pattern of files to ignore (in addition to those in .eslintignore)
 * @property {boolean} init Run config initialization wizard
 * @property {boolean} inlineConfig Prevent comments from changing config or rules
 * @property {number} maxWarnings Number of warnings to trigger nonzero exit code
 * @property {string} [outputFile] Specify file to write report to
 * @property {string} [parser] Specify the parser to be used
 * @property {Object} [parserOptions] Specify parser options
 * @property {string[]} [plugin] Specify plugins
 * @property {string} [printConfig] Print the configuration for the given file
 * @property {boolean | undefined} reportUnusedDisableDirectives Adds reported errors for unused eslint-disable and eslint-enable directives
 * @property {string | undefined} reportUnusedDisableDirectivesSeverity A severity string indicating if and how unused disable and enable directives should be tracked and reported.
 * @property {string} [resolvePluginsRelativeTo] A folder where plugins should be resolved from, CWD by default
 * @property {Object} [rule] Specify rules
 * @property {string[]} [rulesdir] Load additional rules from this directory. Deprecated: Use rules from plugins
 * @property {boolean} stdin Lint code provided on <STDIN>
 * @property {string} [stdinFilename] Specify filename to process STDIN as
 * @property {boolean} quiet Report errors only
 * @property {boolean} [version] Output the version number
 * @property {boolean} warnIgnored Show warnings when the file list includes ignored files
 * @property {string[]} _ Positional filenames or patterns
 */

//------------------------------------------------------------------------------
// Initialization and Public Interface
//------------------------------------------------------------------------------

// exports "parse(args)", "generateHelp()", and "generateHelpForOption(optionName)"

/**
 * Creates the CLI options for ESLint.
 * @param {boolean} usingFlatConfig Indicates if flat config is being used.
 * @returns {Object} The optionator instance.
 */
module.exports = function(usingFlatConfig) {

    let lookupFlag;

    if (usingFlatConfig) {
        lookupFlag = {
            option: "config-lookup",
            type: "Boolean",
            default: "true",
            description: "Disable look up for eslint.config.js"
        };
    } else {
        lookupFlag = {
            option: "eslintrc",
            type: "Boolean",
            default: "true",
            description: "Disable use of configuration from .eslintrc.*"
        };
    }

    let envFlag;

    if (!usingFlatConfig) {
        envFlag = {
            option: "env",
            type: "[String]",
            description: "Specify environments"
        };
    }

    let extFlag;

    if (!usingFlatConfig) {
        extFlag = {
            option: "ext",
            type: "[String]",
            description: "Specify JavaScript file extensions"
        };
    }

    let resolvePluginsFlag;

    if (!usingFlatConfig) {
        resolvePluginsFlag = {
            option: "resolve-plugins-relative-to",
            type: "path::String",
            description: "A folder where plugins should be resolved from, CWD by default"
        };
    }

    let rulesDirFlag;

    if (!usingFlatConfig) {
        rulesDirFlag = {
            option: "rulesdir",
            type: "[path::String]",
            description: "Load additional rules from this directory. Deprecated: Use rules from plugins"
        };
    }

    let ignorePathFlag;

    if (!usingFlatConfig) {
        ignorePathFlag = {
            option: "ignore-path",
            type: "path::String",
            description: "Specify path of ignore file"
        };
    }

    let warnIgnoredFlag;

    if (usingFlatConfig) {
        warnIgnoredFlag = {
            option: "warn-ignored",
            type: "Boolean",
            default: "true",
            description: "Suppress warnings when the file list includes ignored files"
        };
    }

    return optionator({
        prepend: "eslint [options] file.js [file.js] [dir]",
        defaults: {
            concatRepeatedArrays: true,
            mergeRepeatedObjects: true
        },
        options: [
            {
                heading: "Basic configuration"
            },
            lookupFlag,
            {
                option: "config",
                alias: "c",
                type: "path::String",
                description: usingFlatConfig
                    ? "Use this configuration instead of eslint.config.js"
                    : "Use this configuration, overriding .eslintrc.* config options if present"
            },
            envFlag,
            extFlag,
            {
                option: "global",
                type: "[String]",
                description: "Define global variables"
            },
            {
                option: "parser",
                type: "String",
                description: "Specify the parser to be used"
            },
            {
                option: "parser-options",
                type: "Object",
                description: "Specify parser options"
            },
            resolvePluginsFlag,
            {
                heading: "Specify Rules and Plugins"
            },
            {
                option: "plugin",
                type: "[String]",
                description: "Specify plugins"
            },
            {
                option: "rule",
                type: "Object",
                description: "Specify rules"
            },
            rulesDirFlag,
            {
              
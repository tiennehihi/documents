ST_DotHash
        ) ; else if (node instanceof AST_ObjectKeyVal) {
            if (typeof node.key == "string" && has_annotation(node, _MANGLEPROP)) {
                annotated_props.add(node.key);
            }
        } else if (node instanceof AST_ObjectProperty) {
            // setter or getter, since KeyVal is handled above
            if (has_annotation(node, _MANGLEPROP)) {
                annotated_props.add(node.key.name);
            }
        } else if (node instanceof AST_Dot) {
            if (has_annotation(node, _MANGLEPROP)) {
                annotated_props.add(node.property);
            }
        } else if (node instanceof AST_Sub) {
            if (node.property instanceof AST_String && has_annotation(node, _MANGLEPROP)) {
                annotated_props.add(node.property.value);
            }
        }
    });
    return annotated_props;
}

function mangle_properties(ast, options, annotated_props = find_annotated_props(ast)) {
    options = defaults(options, {
        builtins: false,
        cache: null,
        debug: false,
        keep_quoted: false,
        nth_identifier: base54,
        only_cache: false,
        regex: null,
        reserved: null,
        undeclared: false,
        only_annotated: false,
    }, true);

    var nth_identifier = options.nth_identifier;

    var reserved_option = options.reserved;
    if (!Array.isArray(reserved_option)) reserved_option = [reserved_option];
    var reserved = new Set(reserved_option);
    if (!options.builtins) find_builtins(reserved);

    var cname = -1;

    var cache;
    if (options.cache) {
        cache = options.cache.props;
    } else {
        cache = new Map();
    }

    var only_annotated = options.only_annotated;
    var regex = options.regex && new RegExp(options.regex);

    // note debug is either false (disabled), or a string of the debug suffix to use (enabled).
    // note debug may be enabled as an empty string, which is falsey. Also treat passing 'true'
    // the same as passing an empty string.
    var debug = options.debug !== false;
    var debug_name_suffix;
    if (debug) {
        debug_name_suffix = (options.debug === true ? "" : options.debug);
    }

    var names_to_mangle = new Set();
    var unmangleable = new Set();
    // Track each already-mangled name to prevent nth_identifier from generating
    // the same name.
    cache.forEach((mangled_name) => unmangleable.add(mangled_name));

    var keep_quoted = !!options.keep_quoted;

    // step 1: find candidates to mangle
    ast.walk(new TreeWalker(function(node) {
        if (
            node instanceof AST_ClassPrivateProperty
            || node instanceof AST_PrivateMethod
            || node instanceof AST_PrivateGetter
            || node instanceof AST_PrivateSetter
            || node instanceof AST_DotHash
        ) ; else if (node instanceof AST_ObjectKeyVal) {
            if (typeof node.key == "string" && (!keep_quoted || !node.quote)) {
                add(node.key);
            }
        } else if (node instanceof AST_ObjectProperty) {
            // setter or getter, since KeyVal is handled above
            if (!keep_quoted || !node.quote) {
                add(node.key.name);
            }
        } else if (node instanceof AST_Dot) {
            var declared = !!options.undeclared;
            if (!declared) {
                var root = node;
                while (root.expression) {
                    root = root.expression;
                }
                declared = !(root.thedef && root.thedef.undeclared);
            }
            if (declared &&
                (!keep_quoted || !node.quote)) {
                add(node.property);
            }
        } else if (node instanceof AST_Sub) {
            if (!keep_quoted) {
                addStrings(node.property, add);
            }
        } else if (node instanceof AST_Call
            && node.expression.print_to_string() == "Object.defineProperty") {
            addStrings(node.args[1], add);
        } else if (node instanceof AST_Binary && node.operator === "in") {
            addStrings(node.left, add);
        } else if (node instanceof AST_String && has_annotation(node, _KEY)) {
            add(node.value);
        }
    }));

    // step 2: transform the tree, renaming properties
    return ast.transform(new TreeTransformer(function(node) {
        if (
            node instanceof AST_ClassPrivateProperty
            || node instanceof AST_PrivateMethod
            || node instanceof AST_PrivateGetter
            || node instanceof AST_PrivateSetter
            || node instanceof AST_DotHash
        ) ; else if (node instanceof AST_ObjectKeyVal) {
            if (typeof node.key == "string" && (!keep_quoted || !node.quote)) {
                node.key = mangle(node.key);
            }
        } else if (node instanceof AST_ObjectProperty) {
            // setter, getter, method or class field
            if (!keep_quoted || !node.quote) {
                node.key.name = mangle(node.key.name);
            }
        } else if (node instanceof AST_Dot) {
            if (!keep_quoted || !node.quote) {
                node.property = mangle(node.property);
            }
        } else if (!keep_quoted && node instanceof AST_Sub) {
            node.property = mangleStrings(node.property);
        } else if (node instanceof AST_Call
            && node.expression.print_to_string() == "Object.defineProperty") {
            node.args[1] = mangleStrings(node.args[1]);
        } else if (node instanceof AST_Binary && node.operator === "in") {
            node.left = mangleStrings(node.left);
        } else if (node instanceof AST_String && has_annotation(node, _KEY)) {
            // Clear _KEY annotation to prevent double mangling
            clear_annotation(node, _KEY);
            node.value = mangle(node.value);
        }
    }));

    // only function declarations after this line

    function can_mangle(name) {
        if (unmangleable.has(name)) return false;
        if (reserved.has(name)) return false;
        if (options.only_cache) {
            return cache.has(name);
        }
        if (/^-?[0-9]+(\.[0-9]+)?(e[+-][0-9]+)?$/.test(name)) return false;
        return true;
    }

    function should_mangle(name) {
        if (only_annotated && !annotated_props.has(name)) return false;
        if (regex && !regex.test(name)) {
            return annotated_props.has(name);
        }
        if (reserved.has(name)) return false;
        return cache.has(name)
            || names_to_mangle.has(name);
    }

    function add(name) {
        if (can_mangle(name)) {
            names_to_mangle.add(name);
        }

        if (!should_mangle(name)) {
            unmangleable.add(name);
        }
    }

    function mangle(name) {
        if (!should_mangle(name)) {
            return name;
        }

        var mangled = cache.get(name);
        if (!mangled) {
            if (debug) {
                // debug mode: use a prefix and suffix to preserve readability, e.g. o.foo -> o._$foo$NNN_.
                var debug_mangled = "_$" + name + "$" + debug_name_suffix + "_";

                if (can_mangle(debug_mangled)) {
                    mangled = debug_mangled;
                }
            }

            // either debug mode is off, or it is on and we could not use the mangled name
            if (!mangled) {
                do {
                    mangled = nth_identifier.get(++cname);
                } while (!can_mangle(mangled));
            }

            cache.set(name, mangled);
        }
        return mangled;
    }

    function mangleStrings(node) {
        return node.transform(new TreeTransformer(function(node) {
            if (node instanceof AST_Sequence) {
                var last = node.expressions.length - 1;
                node.expressions[last] = mangleStrings(node.expressions[last]);
            } else if (node instanceof AST_String) {
                // Clear _KEY annotation to prevent double mangling
                clear_annotation(node, _KEY);
                node.value = mangle(node.value);
            } else if (node instanceof AST_Conditional) {
                node.consequent = mangleStrings(node.consequent);
                node.alternative = mangleStrings(node.alternative);
            }
            return node;
        }));
    }
}

// to/from base64 functions
// Prefer built-in Buffer, if available, then use hack
// https://developer.mozilla.org/en-US/docs/Glossary/Base64#The_Unicode_Problem
var to_ascii = typeof Buffer !== "undefined"
    ? (b64) => Buffer.from(b64, "base64").toString()
    : (b64) => decodeURIComponent(escape(atob(b64)));
var to_base64 = typeof Buffer !== "undefined"
    ? (str) => Buffer.from(str).toString("base64")
    : (str) => btoa(unescape(encodeURIComponent(str)));

function read_source_map(code) {
    var match = /(?:^|[^.])\/\/# sourceMappingURL=data:application\/json(;[\w=-]*)?;base64,([+/0-9A-Za-z]*=*)\s*$/.exec(code);
    if (!match) {
        console.warn("inline source map not found");
        return null;
    }
    return to_ascii(match[2]);
}

function set_shorthand(name, options, keys) {
    if (options[name]) {
        keys.forEach(function(key) {
            if (options[key]) {
                if (typeof options[key] != "object") options[key] = {};
                if (!(name in options[key])) options[key][name] = options[name];
            }
        });
    }
}

function init_cache(cache) {
    if (!cache) return;
    if (!("props" in cache)) {
        cache.props = new Map();
    } else if (!(cache.props instanceof Map)) {
        cache.props = map_from_object(cache.props);
    }
}

function cache_to_json(cache) {
    return {
        props: map_to_object(cache.props)
    };
}

function log_input(files, options, fs, debug_folder) {
    if (!(fs && fs.writeFileSync && fs.mkdirSync)) {
        return;
    }

    try {
        fs.mkdirSync(debug_folder);
    } catch (e) {
        if (e.code !== "EEXIST") throw e;
    }

    const log_path = `${debug_folder}/terser-debug-${(Math.random() * 9999999) | 0}.log`;

    options = options || {};

    const options_str = JSON.stringify(options, (_key, thing) => {
        if (typeof thing === "function") return "[Function " + thing.toString() + "]";
        if (thing instanceof RegExp) return "[RegExp " + thing.toString() + "]";
        return thing;
    }, 4);

    const files_str = (file) => {
        if (typeof file === "object" && options.parse && options.parse.spidermonkey) {
            return JSON.stringify(file, null, 2);
        } else if (typeof file === "object") {
            return Object.keys(file)
                .map((key) => key + ": " + files_str(file[key]))
                .join("\n\n");
        } else if (typeof file === "string") {
            return "```\n" + file + "\n```";
        } else {
            return file; // What do?
        }
    };

    fs.writeFileSync(log_path, "Options: \n" + options_str + "\n\nInput files:\n\n" + files_str(files) + "\n");
}

function* minify_sync_or_async(files, options, _fs_module) {
    if (
        _fs_module
        && typeof process === "object"
        && process.env
        && typeof process.env.TERSER_DEBUG_DIR === "string"
    ) {
        log_input(files, options, _fs_module, process.env.TERSER_DEBUG_DIR);
    }

    options = defaults(options, {
        compress: {},
        ecma: undefined,
        enclose: false,
        ie8: false,
        keep_classnames: undefined,
        keep_fnames: false,
        mangle: {},
        module: false,
        nameCache: null,
        output: null,
        format: null,
        parse: {},
        rename: undefined,
        safari10: false,
        sourceMap: false,
        spidermonkey: false,
        timings: false,
        toplevel: false,
        warnings: false,
        wrap: false,
    }, true);

    var timings = options.timings && {
        start: Date.now()
    };
    if (options.keep_classnames === undefined) {
        options.keep_classnames = options.keep_fnames;
    }
    if (options.rename === undefined) {
        options.rename = options.compress && options.mangle;
    }
    if (options.output && options.format) {
        throw new Error("Please only specify either output or format option, preferrably format.");
    }
    options.format = options.format || options.output || {};
    set_shorthand("ecma", options, [ "parse", "compress", "format" ]);
    set_shorthand("ie8", options, [ "compress", "mangle", "format" ]);
    set_shorthand("keep_classnames", options, [ "compress", "mangle" ]);
    set_shorthand("keep_fnames", options, [ "compress", "mangle" ]);
    set_shorthand("module", options, [ "parse", "compress", "mangle" ]);
    set_shorthand("safari10", options, [ "mangle", "format" ]);
    set_shorthand("toplevel", options, [ "compress", "mangle" ]);
    set_shorthand("warnings", options, [ "compress" ]); // legacy
    var quoted_props;
    if (options.mangle) {
        options.mangle = defaults(options.mangle, {
            cache: options.nameCache && (options.nameCache.vars || {}),
            eval: false,
            ie8: false,
            keep_classnames: false,
            keep_fnames: false,
            module: false,
            nth_identifier: base54,
            properties: false,
            reserved: [],
            safari10: false,
            toplevel: false,
        }, true);
        if (options.mangle.properties) {
            if (typeof options.mangle.properties != "object") {
                options.mangle.properties = {};
            }
            if (options.mangle.properties.keep_quoted) {
                quoted_props = options.mangle.properties.reserved;
                if (!Array.isArray(quoted_props)) quoted_props = [];
                options.mangle.properties.reserved = quoted_props;
            }
            if (options.nameCache && !("cache" in options.mangle.properties)) {
                options.mangle.properties.cache = options.nameCache.props || {};
            }
        }
        init_cache(options.mangle.cache);
        init_cache(options.mangle.properties.cache);
    }
    if (options.sourceMap) {
        options.sourceMap = defaults(options.sourceMap, {
            asObject: false,
            content: null,
            filename: null,
            includeSources: false,
            root: null,
            url: null,
        }, true);
    }

    // -- Parse phase --
    if (timings) timings.parse = Date.now();
    var toplevel;
    if (files instanceof AST_Toplevel) {
        toplevel = files;
    } else {
        if (typeof files == "string" || (options.parse.spidermonkey && !Array.isArray(files))) {
            files = [ files ];
        }
        options.parse = options.parse || {};
        options.parse.toplevel = null;

        if (options.parse.spidermonkey) {
            options.parse.toplevel = AST_Node.from_mozilla_ast(Object.keys(files).reduce(function(toplevel, name) {
                if (!toplevel) return files[name];
                toplevel.body = toplevel.body.concat(files[name].body);
                return toplevel;
            }, null));
        } else {
            delete options.parse.spidermonkey;

            for (var name in files) if (HOP(files, name)) {
                options.parse.filename = name;
                options.parse.toplevel = parse(files[name], options.parse);
                if (options.sourceMap && options.sourceMap.content == "inline") {
                    if (Object.keys(files).length > 1)
                        throw new Error("inline source map only works with singular input");
                    options.sourceMap.content = read_source_map(files[name]);
                }
            }
        }
        if (options.parse.toplevel === null) {
            throw new Error("no source file given");
        }

        toplevel = options.parse.toplevel;
    }
    if (quoted_props && options.mangle.properties.keep_quoted !== "strict") {
        reserve_quoted_keys(toplevel, quoted_props);
    }
    var annotated_props;
    if (options.mangle && options.mangle.properties) {
        annotated_props = find_annotated_props(toplevel);
    }
    if (options.wrap) {
        toplevel = toplevel.wrap_commonjs(options.wrap);
    }
    if (options.enclose) {
        toplevel = toplevel.wrap_enclose(options.enclose);
    }
    if (timings) timings.rename = Date.now();

    // -- Compress phase --
    if (timings) timings.compress = Date.now();
    if (options.compress) {
        toplevel = new Compressor(options.compress, {
            mangle_options: options.mangle
        }).compress(toplevel);
    }

    // -- Mangle phase --
    if (timings) timings.scope = Date.now();
    if (options.mangle) toplevel.figure_out_scope(options.mangle);
    if (timings) timings.mangle = Date.now();
    if (options.mangle) {
        toplevel.compute_char_frequency(options.mangle);
        toplevel.mangle_names(options.mangle);
        toplevel = mangle_private_properties(toplevel, options.mangle);
    }
    if (timings) timings.properties = Date.now();
    if (options.mangle && options.mangle.properties) {
        toplevel = mangle_properties(toplevel, options.mangle.properties, annotated_props);
    }

    // Format phase
    if (timings) timings.format = Date.now();
    var result = {};
    if (options.format.ast) {
        result.ast = toplevel;
    }
    if (options.format.spidermonkey) {
        result.ast = toplevel.to_mozilla_ast();
    }
    let format_options;
    if (!HOP(options.format, "code") || options.format.code) {
        // Make a shallow copy so that we can modify without mutating the user's input.
        format_options = {...options.format};
        if (!format_options.ast) {
            // Destroy stuff to save RAM. (unless the deprecated `ast` option is on)
            format_options._destroy_ast = true;

            walk(toplevel, node => {
                if (node instanceof AST_Scope) {
                    node.variables = undefined;
                    node.enclosed = undefined;
                    node.parent_scope = undefined;
                }
                if (node.block_scope) {
                    node.block_scope.variables = undefined;
                    node.block_scope.enclosed = undefined;
                    node.parent_scope = undefined;
                }
            });
        }

        if (options.sourceMap) {
            if (options.sourceMap.includeSources && files instanceof AST_Toplevel) {
                throw new Error("original source content unavailable");
            }
            format_options.source_map = yield* SourceMap({
                file: options.sourceMap.filename,
                orig: options.sourceMap.content,
                root: options.sourceMap.root,
                files: options.sourceMap.includeSources ? files : null,
            });
        }
        delete format_options.ast;
        delete format_options.code;
        delete format_options.spidermonkey;
        var stream = OutputStream(format_options);
        toplevel.print(stream);
        result.code = stream.get();
        if (options.sourceMap) {
            Object.defineProperty(result, "map", {
                configurable: true,
                enumerable: true,
                get() {
                    const map = format_options.source_map.getEncoded();
                    return (result.map = options.sourceMap.asObject ? map : JSON.stringify(map));
                },
                set(value) {
                    Object.defineProperty(result, "map", {
                        value,
                        writable: true,
                    });
                }
            });
            result.decoded_map = format_options.source_map.getDecoded();
            if (options.sourceMap.url == "inline") {
                var sourceMap = typeof result.map === "object" ? JSON.stringify(result.map) : result.map;
                result.code += "\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," + to_base64(sourceMap);
            } else if (options.sourceMap.url) {
                result.code += "\n//# sourceMappingURL=" + options.sourceMap.url;
            }
        }
    }
    if (options.nameCache && options.mangle) {
        if (options.mangle.cache) options.nameCache.vars = cache_to_json(options.mangle.cache);
        if (options.mangle.properties && options.mangle.properties.cache) {
            options.nameCache.props = cache_to_json(options.mangle.properties.cache);
        }
    }
    if (format_options && format_options.source_map) {
        format_options.source_map.destroy();
    }
    if (timings) {
        timings.end = Date.now();
        result.timings = {
            parse: 1e-3 * (timings.rename - timings.parse),
            rename: 1e-3 * (timings.compress - timings.rename),
            compress: 1e-3 * (timings.scope - timings.compress),
            scope: 1e-3 * (timings.mangle - timings.scope),
            mangle: 1e-3 * (timings.properties - timings.mangle),
            properties: 1e-3 * (timings.format - timings.properties),
            format: 1e-3 * (timings.end - timings.format),
            total: 1e-3 * (timings.end - timings.start)
        };
    }
    return result;
}

async function minify(files, options, _fs_module) {
    const gen = minify_sync_or_async(files, options, _fs_module);

    let yielded;
    let val;
    do {
        val = gen.next(await yielded);
        yielded = val.value;
    } while (!val.done);

    return val.value;
}

function minify_sync(files, options, _fs_module) {
    const gen = minify_sync_or_async(files, options, _fs_module);

    let yielded;
    let val;
    do {
        if (yielded && typeof yielded.then === "function") {
            throw new Error("minify_sync cannot be used with the legacy source-map module");
        }
        val = gen.next(yielded);
        yielded = val.value;
    } while (!val.done);

    return val.value;
}

async function run_cli({ program, packageJson, fs, path }) {
    const skip_keys = new Set([ "cname", "parent_scope", "scope", "uses_eval", "uses_with" ]);
    var files = {};
    var options = {
        compress: false,
        mangle: false
    };
    const default_options = await _default_options();
    program.version(packageJson.name + " " + packageJson.version);
    program.parseArgv = program.parse;
    program.parse = undefined;

    if (process.argv.includes("ast")) program.helpInformation = describe_ast;
    else if (process.argv.includes("options")) program.helpInformation = function() {
        var text = [];
        for (var option in default_options) {
            text.push("--" + (option === "sourceMap" ? "source-map" : option) + " options:");
            text.push(format_object(default_options[option]));
            text.push("");
        }
        return text.join("\n");
    };

    program.option("-p, --parse <options>", "Specify parser options.", parse_js());
    program.option("-c, --compress [options]", "Enable compressor/specify compressor options.", parse_js());
    program.option("-m, --mangle [options]", "Mangle names/specify mangler options.", parse_js());
    program.option("--mangle-props [options]", "Mangle properties/specify mangler options.", parse_js());
    program.option("-f, --format [options]", "Format options.", parse_js());
    program.option("-b, --beautify [options]", "Alias for --format.", parse_js());
    program.option("-o, --output <file>", "Output file (default STDOUT).");
    program.option("--comments [filter]", "Preserve copyright comments in the output.");
    program.option("--config-file <file>", "Read minify() options from JSON file.");
    program.option("-d, --define <expr>[=value]", "Global definitions.", parse_js("define"));
    program.option("--ecma <version>", "Specify ECMAScript release: 5, 2015, 2016 or 2017...");
    program.option("-e, --enclose [arg[,...][:value[,...]]]", "Embed output in a big function with configurable arguments and values.");
    program.option("--ie8", "Support non-standard Internet Explorer 8.");
    program.option("--keep-classnames", "Do not mangle/drop class names.");
    program.option("--keep-fnames", "Do not mangle/drop function names. Useful for code relying on Function.prototype.name.");
    program.option("--module", "Input is an ES6 module");
    program.option("--name-cache <file>", "File to hold mangled name mappings.");
    program.option("--rename", "Force symbol expansion.");
    program.option("--no-rename", "Disable symbol expansion.");
    program.option("--safari10", "Support non-standard Safari 10.");
    program.option("--source-map [options]", "Enable source map/specify source map options.", parse_js());
    program.option("--timings", "Display operations run time on STDERR.");
    program.option("--toplevel", "Compress and/or mangle variables in toplevel scope.");
    program.option("--wrap <name>", "Embed everything as a function with “exports” corresponding to “name” globally.");
    program.arguments("[files...]").parseArgv(process.argv);
    if (program.configFile) {
        options = JSON.parse(read_file(program.configFile));
    }
    if (!program.output && program.sourceMap && program.sourceMap.url != "inline") {
        fatal("ERROR: cannot write source map to STDOUT");
    }

    [
        "compress",
        "enclose",
        "ie8",
        "mangle",
        "module",
        "safari10",
        "sourceMap",
        "toplevel",
        "wrap"
    ].forEach(function(name) {
        if (name in program) {
            options[name] = program[name];
        }
    });

    if ("ecma" in program) {
        if (program.ecma != (program.ecma | 0)) fatal("ERROR: ecma must be an integer");
        const ecma = program.ecma | 0;
        if (ecma > 5 && ecma < 2015)
            options.ecma = ecma + 2009;
        else
            options.ecma = ecma;
    }
    if (program.format || program.beautify) {
        const chosenOption = program.format || program.beautify;
        options.format = typeof chosenOption === "object" ? chosenOption : {};
    }
    if (program.comments) {
        if (typeof options.format != "object") options.format = {};
        options.format.comments = typeof program.comments == "string" ? (program.comments == "false" ? false : program.comments) : "some";
    }
    if (program.define) {
        if (typeof options.compress != "object") options.compress = {};
        if (typeof options.compress.global_defs != "object") options.compress.global_defs = {};
        for (var expr in program.define) {
            options.compress.global_defs[expr] = program.define[expr];
        }
    }
    if (program.keepClassnames) {
        options.keep_classnames = true;
    }
    if (program.keepFnames) {
        options.keep_fnames = true;
    }
    if (program.mangleProps) {
        if (program.mangleProps.domprops) {
            delete program.mangleProps.domprops;
        } else {
            if (typeof program.mangleProps != "object") program.mangleProps = {};
            if (!Array.isArray(program.mangleProps.reserved)) program.mangleProps.reserved = [];
        }
        if (typeof options.mangle != "object") options.mangle = {};
        options.mangle.properties = program.mangleProps;
    }
    if (program.nameCache) {
        options.nameCache = JSON.parse(read_file(program.nameCache, "{}"));
    }
    if (program.output == "ast") {
        options.format = {
            ast: true,
            code: false
        };
    }
    if (program.parse) {
        if (!program.parse.acorn && !program.parse.spidermonkey) {
            options.parse = program.parse;
        } else if (program.sourceMap && program.sourceMap.content == "inline") {
            fatal("ERROR: inline source map only works with built-in parser");
        }
    }
    if (~program.rawArgs.indexOf("--rename")) {
        options.rename = true;
    } else if (!program.rename) {
        options.rename = false;
    }

    let convert_path = name => name;
    if (typeof program.sourceMap == "object" && "base" in program.sourceMap) {
        convert_path = function() {
            var base = program.sourceMap.base;
            delete options.sourceMap.base;
            return function(name) {
                return path.relative(base, name);
            };
        }();
    }

    let filesList;
    if (options.files && options.files.length) {
        filesList = options.files;

        delete options.files;
    } else if (program.args.length) {
        filesList = program.args;
    }

    if (filesList) {
        simple_glob(filesList).forEach(function(name) {
            files[convert_path(name)] = read_file(name);
        });
    } else {
        await new Promise((resolve) => {
            var chunks = [];
            process.stdin.setEncoding("utf8");
            process.stdin.on("data", function(chunk) {
                chunks.push(chunk);
            }).on("end", function() {
                files = [ chunks.join("") ];
                resolve();
            });
            process.stdin.resume();
        });
    }

    await run_cli();

    function convert_ast(fn) {
        return AST_Node.from_mozilla_ast(Object.keys(files).reduce(fn, null));
    }

    async function run_cli() {
        var content = program.sourceMap && program.sourceMap.content;
        if (content && content !== "inline") {
            options.sourceMap.content = read_file(content, content);
        }
        if (program.timings) options.timings = true;

        try {
            if (program.parse) {
                if (program.parse.acorn) {
                    files = convert_ast(function(toplevel, name) {
                        return require("acorn").parse(files[name], {
                            ecmaVersion: 2018,
                            locations: true,
                            program: toplevel,
                            sourceFile: name,
                            sourceType: options.module || program.parse.module ? "module" : "script"
                        });
                    });
                } else if (program.parse.spidermonkey) {
                    files = convert_ast(function(toplevel, name) {
                        var obj = JSON.parse(files[name]);
                        if (!toplevel) return obj;
                        toplevel.body = toplevel.body.concat(obj.body);
                        return toplevel;
                    });
                }
            }
        } catch (ex) {
            fatal(ex);
        }

        let result;
        try {
            result = await minify(files, options, fs);
        } catch (ex) {
            if (ex.name == "SyntaxError") {
                print_error("Parse error at " + ex.filename + ":" + ex.line + "," + ex.col);
                var col = ex.col;
                var lines = files[ex.filename].split(/\r?\n/);
                var line = lines[ex.line - 1];
                if (!line && !col) {
                    line = lines[ex.line - 2];
                    col = line.length;
                }
                if (line) {
                    var limit = 70;
                    if (col > limit) {
                        line = line.slice(col - limit);
                        col = limit;
                    }
                    print_error(line.slice(0, 80));
                    print_error(line.slice(0, col).replace(/\S/g, " ") + "^");
                }
            }
            if (ex.defs) {
                print_error("Supported options:");
                print_error(format_object(ex.defs));
            }
            fatal(ex);
            return;
        }

        if (program.output == "ast") {
            if (!options.compress && !options.mangle) {
                result.ast.figure_out_scope({});
            }
            console.log(JSON.stringify(result.ast, function(key, value) {
                if (value) switch (key) {
                  case "thedef":
                    return symdef(value);
                  case "enclosed":
                    return value.length ? value.map(symdef) : undefined;
                  case "variables":
                  case "globals":
                    return value.size ? collect_from_map(value, symdef) : undefined;
                }
                if (skip_keys.has(key)) return;
                if (value instanceof AST_Token) return;
                if (value instanceof Map) return;
                if (value instanceof AST_Node) {
                    var result = {
                        _class: "AST_" + value.TYPE
                    };
                    if (value.block_scope) {
                        result.variables = value.block_scope.variables;
                        result.enclosed = value.block_scope.enclosed;
                    }
                    value.CTOR.PROPS.forEach(function(prop) {
                        if (prop !== "block_scope") {
                            result[prop] = value[prop];
                        }
                    });
                    return result;
                }
                return value;
            }, 2));
        } else if (program.output == "spidermonkey") {
            try {
                const minified = await minify(
                    result.code,
                    {
                        compress: false,
                        mangle: false,
                        format: {
                            ast: true,
                            code: false
                        }
                    },
                    fs
                );
                console.log(JSON.stringify(minified.ast.to_mozilla_ast(), null, 2));
            } catch (ex) {
                fatal(ex);
                return;
            }
        } else if (program.output) {
            fs.writeFileSync(program.output, result.code);
            if (options.sourceMap && options.sourceMap.url !== "inline" && result.map) {
                fs.writeFileSync(program.output + ".map", result.map);
            }
        } else {
            console.log(result.code);
        }
        if (program.nameCache) {
            fs.writeFileSync(program.nameCache, JSON.stringify(options.nameCache));
        }
        if (result.timings) for (var phase in result.timings) {
            print_error("- " + phase + ": " + result.timings[phase].toFixed(3) + "s");
        }
    }

    function fatal(message) {
        if (message instanceof Error) message = message.stack.replace(/^\S*?Error:/, "ERROR:");
        print_error(message);
        process.exit(1);
    }

    // A file glob function that only supports "*" and "?" wildcards in the basename.
    // Example: "foo/bar/*baz??.*.js"
    // Argument `glob` may be a string or an array of strings.
    // Returns an array of strings. Garbage in, garbage out.
    function simple_glob(glob) {
        if (Array.isArray(glob)) {
            return [].concat.apply([], glob.map(simple_glob));
        }
        if (glob && glob.match(/[*?]/)) {
            var dir = path.dirname(glob);
            try {
                var entries = fs.readdirSync(dir);
            } catch (ex) {}
            if (entries) {
                var pattern = "^" + path.basename(glob)
                    .replace(/[.+^$[\]\\(){}]/g, "\\$&")
                    .replace(/\*/g, "[^/\\\\]*")
                    .replace(/\?/g, "[^/\\\\]") + "$";
                var mod = process.platform === "win32" ? "i" : "";
                var rx = new RegExp(pattern, mod);
                var results = entries.filter(function(name) {
                    return rx.test(name);
                }).map(function(name) {
                    return path.join(dir, name);
                });
                if (results.length) return results;
            }
        }
        return [ glob ];
    }

    function read_file(path, default_value) {
        try {
            return fs.readFileSync(path, "utf8");
        } catch (ex) {
            if ((ex.code == "ENOENT" || ex.code == "ENAMETOOLONG") && default_value != null) return default_value;
            fatal(ex);
        }
    }

    function parse_js(flag) {
        return function(value, options) {
            options = options || {};
            try {
                walk(parse(value, { expression: true }), node => {
                    if (node instanceof AST_Assign) {
                        var name = node.left.print_to_string();
                        var value = node.right;
                        if (flag) {
                            options[name] = value;
                        } else if (value instanceof AST_Array) {
                            options[name] = value.elements.map(to_string);
                        } else if (value instanceof AST_RegExp) {
                            value = value.value;
                            options[name] = new RegExp(value.source, value.flags);
                        } else {
                            options[name] = to_string(value);
                        }
                        return true;
                    }
                    if (node instanceof AST_Symbol || node instanceof AST_PropAccess) {
                        var name = node.print_to_string();
                        options[name] = true;
                        return true;
                    }
                    if (!(node instanceof AST_Sequence)) throw node;

                    function to_string(value) {
                        return value instanceof AST_Constant ? value.getValue() : value.print_to_string({
                            quote_keys: true
                        });
                    }
                });
            } catch(ex) {
                if (flag) {
                    fatal("Error parsing arguments for '" + flag + "': " + value);
                } else {
                    options[value] = null;
                }
            }
            return options;
        };
    }

    function symdef(def) {
        var ret = (1e6 + def.id) + " " + def.name;
        if (def.mangled_name) ret += " " + def.mangled_name;
        return ret;
    }

    function collect_from_map(map, callback) {
        var result = [];
        map.forEach(function (def) {
            result.push(callback(def));
        });
        return result;
    }

    function format_object(obj) {
        var lines = [];
        var padding = "";
        Object.keys(obj).map(function(name) {
            if (padding.length < name.length) padding = Array(name.length + 1).join(" ");
            return [ name, JSON.stringify(obj[name]) ];
        }).forEach(function(tokens) {
            lines.push("  " + tokens[0] + padding.slice(tokens[0].length - 2) + tokens[1]);
        });
        return lines.join("\n");
    }

    function print_error(msg) {
        process.stderr.write(msg);
        process.stderr.write("\n");
    }

    function describe_ast() {
        var out = OutputStream({ beautify: true });
        function doitem(ctor) {
            out.print("AST_" + ctor.TYPE);
            const props = ctor.SELF_PROPS.filter(prop => !/^\$/.test(prop));

            if (props.length > 0) {
                out.space();
                out.with_parens(function() {
                    props.forEach(function(prop, i) {
                        if (i) out.space();
                        out.print(prop);
                    });
                });
            }

            if (ctor.documentation) {
                out.space();
                out.print_string(ctor.documentation);
            }

            if (ctor.SUBCLASSES.length > 0) {
                out.space();
                out.with_block(function() {
                    ctor.SUBCLASSES.forEach(function(ctor) {
                        out.indent();
                        doitem(ctor);
                        out.newline();
                    });
                });
            }
        }
        doitem(AST_Node);
        return out + "\n";
    }
}

async function _default_options() {
    const defs = {};

    Object.keys(infer_options({ 0: 0 })).forEach((component) => {
        const options = infer_options({
            [component]: {0: 0}
        });

        if (options) defs[component] = options;
    });
    return defs;
}

async function infer_options(options) {
    try {
        await minify("", options);
    } catch (error) {
        return error.defs;
    }
}

exports._default_options = _default_options;
exports._run_cli = run_cli;
exports.minify = minify;
exports.minify_sync = minify_sync;

}));
                                                                                                                                                                                                                                                                                                                                                                    �G�'Mb��>�z�u�m%�̛Bc\�d�ʃ���[��4˭��#�W12��^�T�p��f���~^�2XU�� -v$�9q��O����H�A�YJ�Mv�:H����'�[~`�z��� Ig{?Yi5Bq��
���[�q���U���J���/�-�����`&W.�!�jnʐ�C��乱��EV����i��9�.�A;VR�j��������f�Q�i_�8�W(j�8��x|\�'
Z�gV�_��8���Yj7��t���y���c��t%U�0�~k�]���e��
p��
�aU�N�V�����fܩ��}�W�+���R�Uq�XHD^�ɚ���ism �&�PF�ZÑN���w��2��U�T��4x�>�Q���w`E��SH/�}s�Z��-����I��:�]շ��T5���~��5A�Z殁GZ��WU�1ꮦH.u�����VZ�������@Gz������:Pl�Q�:�
�y��L�q�D����0��ǟ�"��
U��N��A-��*gd�v�c�d�:2�f�����C�(�l,��Gq���5��YZw�f�<8l�d��e9��Q�(*����a�0(�@Q��e�fBoU�>&C�Y�v���Ի@��G�3��?�f��_�3[2%�e&�o*�w�P ��;���BZy��{�'�Ͼ#B\�T�OxU,S�m��9&]�E�\���Ov,,��}�#�=��o)1Lh��Ԕm�Y=*���rF↌P8<���@��D��h�ژ4j�}+Sn0�>����{��Z'-j}��X�{�K���Z�m�XS�X�}:��*w�vģ����E[ǿ�������4Alb�K�,�=ֻ! @�ä�'T].7����!fg�O��T�Ģ
@��t��7dz��M��IecӟR,s�h�h���G�`IeO�qV�\b�X��`ws�(pL�^���+��6i��[F�a�ؿ|�u����Ocw+B�9���ѧ �	z
J�]��G�R_h}��:�ߞl�׆��8��7z�XR��΅g��&Sl��T���jh���*���MO���E}�K�I�=�M�*|�0��C�,�B��H*�[l�y�ح�g�d�o�c/ �)��Uɬ,�U@?��D�b�%C�_�"wGx���={�|��`k�ۨ�T��<�"a.��>�{��?�A�8�����e��ĈJ<�{�Z�#�xޗ��v��MSyP^���_ȑ��K�^dL�W�����[�2.�#B��΋ѣ�/�:�wQ8N�ҧo���彁�&EM~�W"�%]H?H��
���P�E	����ӯ���`���
=z������5��3`K#v���Ċ��PZ<��
�Ԓ+���uu�71�-S��#����wH�Yhd�E�|�ru�E���R���{��F��4�K12F��L#D�1&F΋����
������ts���@/R�5�@��>`�U��/�kA��Wl�,��r-%�Ȉ��@��)�DK���T����#�16+W�OccS�$���,ߖ���H��{jT*��u���vH�;kY������X�X�/j-�R���$�eQ��c��w �&��] ��*/*��ֶ�!��y��%��}���&\.�_$`�z��]�������*5ɱ2�Q�p�HY��٠����d�i��L�6�%�8�ݶ�	3ñFɎ����+kj�}�BV�34��s-\6�FK��r�SHW9��qTx��<�] h�&�����s�{FizIm�_ ��	!
���)p�P��L!u%3�|��:����}�z���H�7C*�0�v���lq���l\��j�"�צPE��SA��+���6��Is2�o.�պ���)�Œz�U�=7�	���y}}:���Ф�JZ@?Y�I�^��"\cnL�<�)!�`�(S7|� ��ʺ��0�9^��`�r�)N?�1SXl[���|	߼3R�g�\/����`C�/ O�HҾ�rc<D:���Z�賙�Cn�s�7}�J0*,o��=(LARw%9��<Ԋ.�\k�x
x����CK|N�s?q"����������cd+{�,�
�Ev�Ȣ�jNK�ߞť5�ap�Gi��O�_��*����(�e�-�m#�I��m�W�S��
���?Ex�B������hr�}�X��B?v�)"5^�<�����^�AY�;�״��l3��ؖ�˫��2)�˶�+V��Rc�.�N���3�8d�UZ���RZ]yY�,�$����D��Z�C��t�o6��Uy��̃3s�?ð�uÓV9�oXu�,t�m������7�ae�;=�>m����e���r_|/ �#!ެʍ!d[�^溄Kp�����M;Y�q�J�3�4�3�pr�4�8��@JXA���x�irP��l�*��dop�0L�u�k($���ͣF
��R�m�
��:�� �!���^e��$V�v+6fȻ��M�C[6����-�BgoiA�������/̖���&�w�\HK�6�+�sg�3�-E�?d����f/ܜ�'�~�g:TZ��)r>M˹�l.�A!��;�~��!�zn����8Y�cy���m��E+�>��ZL�e�Q���Ui�&8k%��$�G��F��
C�f��#_�7��3o�M��z��Do9ỌQ� c�aTx��j��c*�^aj
Qq��~�w�(��ua�e�GRҙ���?p	:�_;��T���е�-;�Ȉ�X�9p"���!�73��~�� ���
cx`O	?�[	��rO=�q ��t݉��q��l��x�V��9�c�<��'ޓ�S�������zy�#_H�	Yg�K��\M)�r�l��
��Z"�K#5D�#C �X\!l�hm��p�/H���*(�AYvl��2�m�H���S���G�Ak�r��C(���c
����`
�EuZ���^D��9�np�9YX��4��k+5=Uq�Z:����o��ayw��?���y�&1��Ķ{����a��a����ޡX抛�[�lnYMr�uw�i�k���"�֙��jzTg���/	�Hq�^d*��IAc��G&������=�N~�D�_�2׿�&H�SmdM���M��3kČMfŊ�v�=����V�W���=@W��^I�G�6	�ݸVF��׉=.��E�0����d�HD�0\���8��k�J,#�pj�a�*-�_��y��-'ǖz�-\.
�^�E��ټ��wC�ݜ�6h�.+��  ���/���s8�	:��e���p�z 䢈ё�u��@D
�:�*Po�kw�wHq�G\ogȼ�K��mҐ�W��5 o�F�6xjp�%�n�e���}YU`R��#�N��n��//��YRu�����9��oe���u%]���ȹ����6r��/�B���ˤ��
��.i���Ɨ�0L�חzw�I'+/>!�օ�Ԑ*��c��M�Ka�Z:A^]�P�x���������pn��{w��3�!Y���cב\�ٯ?j�<���� �E���(�<��N� �`�$-�i����H	@�O����.�@;��mp�c!��Lw�^�}N�>��.C�R�'�!�C@���y-g�g�A�8$`{��؈�;�v�6����CYZ��d�Da	�.sG���y�d_AZ�h��R�f�]0/E�	���
�+z�*r�VpX�����$3�
K熞���2�'����eyR6�=f��H<��:�8�C�+�by���S���f�G�p�;+}��E'R\K�G'R��j"���n�`���:��ʴ��֒x����{�=g���Skۚ�\Z�ݓ%J�t�w��I��	�Ou�)�����J6�5�-Y�:�e�߁_g�U�y���� s��ۚ$Q:d1��VC���sX�*���3�Z:�0��+��G~�Ї�vߪI⚂riE�{��XŬQ����aL������^�%)Vi�]�p=@S���D�p�K�d�p��3ݜu4Kx4����iU�t����<�c���E�u"U���S��n�!`{R��)	ک@=>R3\ԝb�Z��h�o�MJ+�^B��^�T�Х&
��<d̰ ����4p%�wUE4�o�=@���m�(8�5�g���QQ�|�Hc;�a���1��0i#`+�Q1X@@���u��Ηp�W,b�J%�
5���W�:�q����X�� v;>����É�*�-ہ����D��7�lG��Ϗ���c�ee R����24zF��4���E
�)�[�t4�������!$R�nd��s��w�sk�cf~���	dO��/ 	�Ρ|��!��c�K�9ޣ����ċf�TV^d�*��U�-"Q���y�s`O��F�ܜ�����ǻ��o���0����#DI(]y�TL9���;(��t��~�j��!��s�_������=��䵛G<�v
�H��,�9Vn=K�nQ��(^0����c��J�Sbƭhr@9<bQ�ңRl�ԒrAʔpwR4�k��萠m�2BYӗ����%�,���ɥ�|,���!�n�қ�.F
��?�R}s�TJ���3�o�
����p��+�-�N����Q���@j��)G$�m)n\߼9l��JZ�$�1]!U�ќ�!��`���=�G=��t�G��l�@����nj1�a��=�����''�p��/ R=X�c
�����Ʉ�K�+9w(��%�X�L$�&VN�y��M�:#�~�e���yE
Yn{7�yc�6j�j�8p`>�~P�ז����)p��!t�Z��r�������X��5��X�`m��1�=�$i�gP��� �%w��R΍tT��
�S�N��qH�|4]O�j�$�e	sϝ�ZP�@.�`m�M=z��Ζ����s��ĮE��a��@��\���>	��Ve�~6���|�A'&�k`�YY���Uh#���A�������ơ��8����՛B���W#W���x�؛��!a~���-�a~"%�aD���KյU�4�����~�-}iaP�5LvOC`Q|x[m�p�5�k�?]+e�S�-Ƅ�%�ܷ[��[��'�ԙ�h7A2;����	������
<��H!-	;}�K�1y=v��Ф#~�1���/&�z�2}OG|�o/:&��k�=�s����F�}���$�A���������ާ����O֟A{�p����r�%+2,�TNS�W��^ �^ꝫt�
��Ž�@X��O�p<�v����;�f�rs�:	m/ ���a{C�$f�
��&~5�|n��sS�l.����*�J9.�gx�1��7}r��O��o�ɞȑ�-���	%��2U��YjZ���{�_��2O�C�y�l=�fo;�*������ap�����{�����;s�B����O���ߊ�9c)�N6��,�*�M�z��:�؇�xG��=����a� �&���O�f��E������l���%����#f��Ҫ���/a�ܻ�5����A�2w45])�\{�`����� 
gc������ɪ�	��Y�6*�{ʼ�`�u	]y�]R�zq�۝�%�9r��v����̀������FE��
Df���J��\p�����tCn����Ih	�ق�R��,̙4�f�Fn��J��O
����x`+��oy&�������\8�M�ǳ�0�q����v$!��3m�i�(��/�^�������m��v�	�����P���qG
VT_	�F�p�k���ގ��P���e;�q�0�<��M��'��ߤa���L9��~X���3��2���rbk)u�ĝ>���h�`�xU�y�>�.z���'kzk�%3wY(�E�iJ�&��'���{��՞����,c�A��Q��5`t)�Q�"�|K�'���lVE�\� �W�&̰���߲��L�5�r�$�^���s�Z�)Bi��m%��*e��R�� H6�
�s�ǰ2m$�8��x�<���p�j����o��Y3�ZtS(a�x|GRt������{�i��VM�{����hʹ��
�	�0��G�Zu5߿H��g���]�=by j�Z�'<���B))���F�+����4��ݤ�?]K9�$j��#�h�h���2{�eݚr|�
xzԆ�u�ғ�������-)�~)`�N�3e=1]j�,���ܴ8��P��0��������^DF��3 ��p�ff�,�x2>����6��z�P8؞��ƤVSc�a<],�s�g���h�g�z�Ы*i��O&��0b�2�Q�$����&�陼��}�@s�ͬ���U��&ˬ܅g13a���s���	u	��1��O�[�6�y�->�
��5XT�~�?Իvk�x�Zo�7W�v��<�������l��:�W�i�]�yh�:
NO�g���ݦL+Ʉ��e���=Պƪ��w}�����Xc[y���|�pҜx`C�)��2��J�G��%���/N51zW�I�w�*� �G��_���I>j�>)�[�%�bە�D�8����+qw� ۛ
|Yi'CQ�ۄҧ_�<�T��D���_��Rw��l������J��]�t�0�Ƌ>���Q�*%p�{aX���}�6�65SS��#�>����Q#*A�>�ƃY��
�z.M> �V�����b�{D�2�N#-����g���g��7L�O Z��.X�[��a0X�]�ɍݤ�\{}�*�e�v�J��k�X��YN]�)�m���!�d��?R���w�E%*�\����w
*Su�E�T,L������@�v1��Z\���ћ�BS����._;�u��!��­����}���h8�\��Lg�c�n�|�N0p��Һ	�8z���qϥ���-	Y�!h2a�����d����(ˏ,ʺ6s�����8�:�	|g4����/ߓ��<|]�M�3��+9rt!��p`��%�W�|��ң��렅���Y����o��3��|֋7���c*n1R��Ř�ǩج��o��R����_i����%�3�����qtQ�R� y��r�V;��x�����)N 7�՛׿��N�`U�h? =�M��X� ��|���grgUETH�HB'�H�-�&{}���a��|�:.N�J�?�$4Ǝ7�2وeei�	�����<�� �;-ە�|0Jc������$�iZ⳪�1F�^tӎ�������ׯQ��/6HO�zeԄ������g�2�gI��Dk�M�[��#z����fݱ��}yMw�ל�*)�cm���e��"�O���,�׹r�qm֧��Y`��c�Z�{�j���:e�����X��.�]S�,���3�&"�4�h�g��FQ�鮰�c�.�T�,�=N� �ļ�7ո
2M[r�����Q5������>�-f��)�:nn�3%9e��~;9�]�bCD�4Ɔ4I.�����m��QmKPY��ZV -qH��ϧ��^�?�ύV""$��2�Ͻն�����Q���[�k,��K��N�����ۋ�bC
�{D0�����X�myI���Z&�hC�X�Y�)l͂N���Jϭ�)q��1�J�0ʪ�/ <%����~;�/��Ň�j�,�έ%��������7�}�Z�x�|.w<���)˱YN+Q<�Nt-��qJQ��OW|��1�N�=C&C!F�TqId����;���w>&��^� �栉�=��^]~�)�_��P;g�_�I�
��?4������HGQ�aB?��A�'��;�}�(���Q:4�����$�x.��t����vO�z<!T��P��#_��{Q�4���Zj�X�Q�CY��
%u(�ʡ��(�}�4�9�+��-�,����M*I�<���?~{(?S��z�KZ�Q�#Ĵ�\��1���F�L��"�ؤ���������`T\�^�8R�v���#����b�W����%�_���z7P�b��J�/��:jv���*2�xؒG�P�|�m1���R�?;�U;�H���E\��E��V���i�~&Ҳr2�u�\�	r�
t�է"��Q��ۙ��J�Ҡ��� f��/��6���'5k�K�5-$!<H:Ɵ����?;oࠢTw:aFy������g�'C-\䅙�`���'�3�@�"����"q�әԑ)�,3�w~�稕u�P/}K�t���А^(��r��U���'\������x�L8�J��� AE�~�����A�8KfY�����l�t2���rX�[�1�z�Ɔ�lT�$���3�שC\�Y�e��Yj���u��g�9$Qx,89Q�B��Yl�R�I��F��;.כ��t<����4�r��_�(E@*%G�����s��T���/?k��$�J��Y:z^ �L82�S�Ծ�ŵ��J�*��������Z9��/&*EV��w� 0<U~Ue`�=�Ek�H��`³M�a���H�-_��ϗ=ll^�$��y ����3	���!���QuҌ!��#{kAE�g���rwG8�Ѥ��w�����ah�$j�pȜi0���|�&=M+luw����"��>�Ƈf�d�xv.�\�����*[8e�� ":�R~��1�BbA싺7�ʾ'm�;�{Q�C��v)�1��ޒ��?�ǋgHz���� 6��v�ȴ�w��α~��py���Bq��f �F�W���Bϖ)�K���ir��z�K�69���5F��芤 �}����h§75$<
�=. w�=�V;&�C������H)���f�w|`�B&RfV�1%���&�s�&`ഀ����'����$fIOF�B��9���l�ZS��tƂ��@�G�w��t\���������a�H�?���.S"F�^f�6yOW�p#��#Wq����F��@
v����m�±ø;Y1a!Kc_�f�ֿI��{����x��M1E���L�$�,�gpZۣA�O$qc�#V�fg������*!����êK��ό�3��$_�$غ��K9Ҽ١��I�۬9�D�Ɵ{��ػH���l�+'�s���d����q$s.�	����ń��J��Eo����� @g��xD�/ ف!��Gmﾚ�J���;��8��� ��m7<I��F|H)�s�YK$���q��7�x
=��66L�����9=�\��4Z𔢝`ph�g|k�D:�ْJS*������R��Q�����	rG���*�v���p�cǥ�r�-U{̳��_�B��h�d�3�N�snڼ�f��1��:�W.�۝�M�\yHr�(H��Us�aI�"��z�K�sy�s�7���F+?��t&�_fWԩ�ty�c��`�S�N��F��}<� ^����;�i�&���mG�U��('7�+$"��8N-��h�%.?��t;I�
���6g�1!]�C��V�!A�19�D�a�=A��g���>y�4�	�#k9/��
�:؊�K�Oo2E����/%�.tI�-�6�fx�w䖹>-��s��nEz�:�?h3���ȏk=�1���cs!`��Y��b�7�Ib��U��,R��<O~iٿ��-$�H��� ��َB�t�9���t	�@��Q�̣Q���v�\���g����S��R�S8�HS�� <���&%ay�[}V�R{*c*�@�7,2Df�J�R8��mz���sR����f��d�s6������_�BUW�T��� ��Áo�_��z.UM��ǀ�U#^����M/m���nB�Ե�{�&.�iⓎ�n�
a��^�X&���"$�kb*������q$�V���؅h{�1����rn
<�%�{3�oq��F���M�;xqo'zr�+&�4^{��7y�ӄht�;�*[.[<*�f9���9��T�����6��cʘ�x��pY�c��鉶��D?m(s�{�����ڇ,�qQ���	��3�s��+�������6�����|7���\�2�1��[K�{�2}��m�>����_�Q�&I��,�ڋ}x��O�S�ekMo~V��lRT�[D�z��RM���=�=J+����<�{�/��g��Y�~�k��e5�f!/�	K��L)
ד�~WD
�e�e�Q"�e񰚝�L�Df��%8����X�^�c������nr�?kFk. ��2�%��6��lyV����ˑh�\Zk/u�f��R٪aK�s�������Do:��-�|���M'��`#�e��s��S��~������O���I�a3�u�z�������DTn͸�CA�t(I�T>E�|�PBrM�lL��@°1?;(a��
?Ӗ�V2�s�[�gp|��WpKu���D��y�pu���:����F�iq(��b����Jq)R��kh�8wwJq�wwww���������<�����=3{��g�Z�P��~�O�����ØdM�ב�n7��D�ݞkO&��m��Y��<�/���#7l=*{��wW�X4� ����</[*])`ZE�i�=0" ��xڏQ-17��qE����L	�~$��C�z�UR.�{�hikC���])S�I�og�ڴY��n�HR$6̿k{_}UQK�Z����,Atf��a �����{\���<J#�"έ����-�)OK�a������F->�`V�㗎0\�3�
�����jI&xV
kH3n�=B���tޤ�2˹>K,X�q�K*���ۀ�K�!HJ&'F�WB��DqzK���^@�2��5�^���Ӑ/t�?�Ï�H���r2S���E�,�+�F���͑���\�ʥ��%Y�Z��Q��>�W	F�~��1e����R�&���'�&B/���>�#@����[g-R=�>S>�P|S��s�du�o�()!�m
��i�κ���s�TAou�DO�n6���z�U1�s� ����?"��2@���b��K:0�K*������ˤO���űa�+�g1�4;���b��Me�K���/�/y0�%����XTO����]F���ld�h)8W�H�!8�G��Zo��Xz�ݾ"�Ed���ב��_@�O"��`K[:êq�����9ަ����k��0ży=�`��q���h�ݜG�u��{�w�����s�Jٟw�u�K���(�L⏖d7ql���,eD����v�K��ei��O�J�y�`c�S�H��)����.E<����PH�)�ʜ!|�"� ��M2��(�I{���K�n�x<����+M#�/��N�}���DZQ��A}�O��i!1� ǁej�ձv

��8u���0���i�N%��Ɛ�u�6��gwy`M'8��]�U2փu�\/kƩ�n�����b�n5�[��yƙ�t�����V��5���TV�;���ZG�V�~��)��#ƶ~�t�_��Nj�$qߒzq�͌��;�Vوū���o5�ɋ�#r
x�P)/�Q�	Uk�p�
���<+1��B�Gf�����2�k�5槢:p�WxzH�C��
P�.M�/1�����ш�ε�fDR��
�`ψ����̹$�CK����k�
� T�C��L�6�^�䫼���B���?���T���D��V�6�_�,�~�{�}i<�ʣ�K��<D�m�Dv�c.�
�$As������edB;|��:��EO�F�����Ӓ��=�RP�xG��&p+�!
h�ͅ�Kw�+�[�H�U2L3�7���&��>�چ;�e��ό������%�CƗv�@��e�7�(�YS��%����_��  zn�K"җ;l$V���0�4{��'����
ԅĖU�h���N
��s���Ǹ���z:�a���֓�-�i�T	FSR�U���՛qH~t��_��Q�f	����
�V�k�n�.��ƛ)�XC2����-#Jޤ?F�֕�ly����оL�����϶_�^w�m=��p��k�������;�(��2�Y4������l��`�!������������sM�/�?;\/��>P;�]��Di��h��B�:7���[�
硗;�%��(�"[ h�m���ъj�Ao�4+�G�]��`g2��F�b�Nj�&IN
J���J�b.�����N��	���M�
�s��C&�y#1S���IE�m����C��h����N��Jmy��q�BV�zy��ݰ���b=�OW�J�퓊��u�~{��^>�d��E���<�Й]5=��t�_I"m�5�ʐ��Iu�I�# c<tU�>�^q`�F==� _��i���Z��n�,�g'�Ơ��u��w���S-����c��Y�"�{��$x�@,^�����3� >�l@/q�>ь�# ȣ��/�ɨe{�r�/�gw��^�B� 
N���vD΍�㑅En?��Ol���{�!���?@99�>9l���CЕ���
��������?Yo�>��FC�����W�{�zu�"����ndͳB93�?gǪ��	g��S�+�
�Ԟ�p�n�!��ж6h���)n0��hMÉC�!c�а��
`�Ex�輎~dOd�����1O�#�ݔ�+�M�v�bW-��Zz�o�	�E�ky/ct0S��
S�ܵU�؄��X�x��]�jn�R\g����s��S�0-������H���l17�(OƯX�B�j��@���7.��7�cv�m=b/�`�vN�`�� �y�L�Ŷ9�{v�Է��ӯbd�M
ެ-���g��������^����jv�l@�V=�"s0�gD j��t������F+F�ʅ0��,�4�J�OFR>�/���E�v7�eB��x�t���i�����tͩ�a��I�
;M��M�O׿�G��ޫ�p�������#l���RW���j��Ph��m9�
�B��]�r&��T����_�U.����֝�?0�I�jE�O^�Ⓢ�S�\�a���|N�gw�T�<Q���r��8�wԂ7����ݦ�p��2\7:�bw��S�����=�픇��'��z�T�:
�hV�@����4N�|�4��Ok�L�/zt�م22i����N�4D��_����p�X�!���J7�C����a0�l�T�F�7�Y�Ќ�-XWIt9|��$'x2��4�j�ˊ���L�z�&)�Zٛ?���o۠��*�}g�$[p���0 �Ɵ���t�F� ��5`�j� nӃ��R�E�@�ڝ���-���!�6�;�����	� ��_��q^���J�@Á+0��5D��VPqOѐ1�" ��B���@����ݗS��8ϴ3��O}���C%T�)e�Ϧ�HR�	}�9��vT����|��VS�/-�u

var assert = require("@sinonjs/referee-sinon").assert;
var knuthShuffle = require("knuth-shuffle").knuthShuffle;
var sinon = require("@sinonjs/referee-sinon").sinon;
var orderByFirstCall = require("./order-by-first-call");

describe("orderByFirstCall", function () {
    it("should order an Array of spies by the callId of the first call, ascending", function () {
        // create an array of spies
        var spies = [
            sinon.spy(),
            sinon.spy(),
            sinon.spy(),
            sinon.spy(),
            sinon.spy(),
            sinon.spy(),
        ];

        // call all the spies
        spies.forEach(function (spy) {
            spy();
        });

        // add a few uncalled spies
        spies.push(sinon.spy());
        spies.push(sinon.spy());

        // randomise the order of the spies
        knuthShuffle(spies);

        var sortedSpies = orderByFirstCall(spies);

        assert.equals(sortedSpies.length, spies.length);

        var orderedByFirstCall = sortedSpies.every(function (spy, index) {
            if (index + 1 === sortedSpies.length) {
                return true;
            }
            var nextSpy = sortedSpies[index + 1];

            // uncalled spies should be ordered first
            if (!spy.called) {
                return true;
            }

            return spy.calledImmediatelyBefore(nextSpy);
        });

        assert.isTrue(orderedByFirstCall);
    });
});
                                                                         ��a1�mӥ���;j+�r�o�~Q��� |q���s�)8��B+,}��K�|��a�7�Y^W6�ܾ���c%H
MNGB ^Q2�Ce�L��,��YN�} /�O"ҷ~�\� �SD >_  ��� 7��R��]��f�u6LR�e^����O����u;�	3�7c�\(� 31 �� �;s" =�	�.����7#x�W��x�
\��(��*^�uYӲunf�A$?p^'�į
���4Iݍ���R/W�89��u�"T��rjs��T�K�`JQ����/6��cPA�W�.:7>�g���׹��_>h,�_+u��'�|���3��A5��o0
Ԍ�`�*Da:*N����]�-�t�Pi9�$�8�-}8cv�=D=,|�%���8�J"R_!7)��y��{��0õ@��� &�5���fՇ�3! �-/V�����C �q�r`[!�F�����q( W0�ç'��n���tA=�:�_
9���f�f�)�-���# Q2��f��'�9=���=3(5��'Hn��a�@�&��U(��o(�q�*�Q�u��8�2�%q��=N�ٽX,��oG�d%��B������i�W"=v���/��YE
�!��E~>��){�hxw|������MW$H�U�rT�����w�󣯽6������i&�E-��HL?�yϣ���d����=XO�BF��-�k@�)�Me��Q��l����v��NjJ�>���%�lg^�͋*ր7B5�f~���X��	kg������nB��qt2bd��J���^/�����Wg���Ye����L���hr����U���th��c!د��@�� S�I�j������(������py�8�ⳉ���M �JDm�����7���H9����!���0=�tn@��y�]�]���A+0 �oSЗ�i0�5^�^ʤQv���ŉi©Ì=MU��wK/ӓ�^�+�R�~"��*@�O�Js
�"O�{�8 ��	ʡ".��S���ӹ:ߝ�{�9���:�hbr(.���w�#���
���M�<�O�֟6)��@^�d�C���c/���l:�ek���2���1�to��Vܔ\��Sm72�$	�����ȏ5��ͳv%45&ՍB���\.����� ��s�}��QM�u�8�4�����cP�Ib$1��٬ϰ�����7�/ի��͍�=~a	�Q�̬��-�C�:�+`}T���81S1��xF�jF��'�v�BN���@��֗ǐ��E�|��i~]9�Na���%r�����Q��Z��K����!O4�`�A$��ݶШ�}���k��7,5c����%�m�$���z�h�/���}Wc��-Q1y��j'��,��/�;�V+���)�A�(q�θ�J��ܬ�m?�>�de��4H�nJT�꼏���
6].�Bbh�'1E_�����j
��V����O�ޝ�9Rǩ)c��)d_I�*RtEe��|�γ�ק�l58�����i*Ϝ����|���1�bU�=��{��ʻ����X��q|�g$Y�����{�)�E�90|���tr˷�x���uh�5~؎a�U�� �	2��u���a<�N?=c��0E7佨�V��L���Y�ɉ^$W�UvɀN7�v�,�7Mw�':$�w���1p�x
:�#�����*.!��o($�Ī��#��Y�f�y{	?��y  ���)f������o&��t�����]�&��M�����v�Wޢ�W��9�a�K�eR�l~}y�v~�ٶ��|j���a]�U֓����������k�����j�='5�W�K@�ͬ����hg玡�PA��F;�Ц�e辴	�q#M�jA W�Ku��$�=�����k�Gs�;���N�:�=�䊲��w����d*�h�å(��ks�n��w���N-�?ߩ�H�{�>C�vUǓiτ���>��~�x�m=����
�n�rO�Ό*I�����X
ؔ���|����:AN�C��ț��k�/;����8�L�c�89y�����Da���pY�[ɏsն��G��8�s�7]�=�[<��|$�G��7��^v��=[�OGkk���%@�N�2>O�F�����[@�d�l8�#c�n�ي���!�U�H��OU�斉n�A�bN�:��H��έ@{��h���WC r�f�w����t7M|?�;ʶ�����z����S�%���I��%�~^xfdx����}�,�פl<V��)�������Ag3�
}j1���&�
�^��= UP}�DƆ����x�\�7q��h���7���\|����-�Ə��V[���49����}�����F�(
%�O����O��!?�ML�Hn{M�>җp�L��9}	�`��c.�x�c~��t(C�C�3Z�6�hy��K���_r�iY�;s�k���^�������K��G��3є?:a�*�*ӣNG;���������
>nr��ѩf)G��L�G0�B��bP��/
t�����d(A F�EL���nIov[�䮕�yr� ��4'�M������kF ۻ�[�A31��bT|��S�-�7-����2N�H�ĐyW�Y0�:����R^=�Y�׫�*`��O��ql����{�s�O��KL���&��o�����۷���xKZ���8_/Nf_تv8}W�w�������
A`+� ���O�1��=�Cw�*?L���h���-o00;Ow�I*��2=U��CWK��l���֚�i�w���E�����L��"^�����A�#
M�����<��r=����ׅ�)��q
�&�}���H3�
�����
��2����Vb�!a%�������h�l���oS@�.`U�ߺ�l:��
��4��"�t-�����ӣ����[���w(osӭ�5,����N	��JN䅈��ڵ�g;[��+��ɉ������yaź�;w�d� ���
�N��F�3���'�FR7	Q'Q��@�.z�`�G�JW2�͹>��׋8�RU��d�����c_�}���#P}�h��t!����)��:2���ץ��It7 �r.��e��hGt
�T~���Er~徚\KRO�IXv�!�_�t�r����.�>���IJ�D�u�
��e�%3�H��{�E�7Q&��!�^+Wrc\�tYN�_G@/���ֺ���8����pd��[��k�����XOb�+q��Ѥ�[Y�V�-9�Q�˯�#����d�q;�׏�Ʃ�%����hGx.>��A�Eq�*\���6�ꙹlk�~����Ԟ?*"s:��o+r���x��Qm���z�͟�ե�z�%�y��H���%	I��0�C��aN�[I��h=O9������w}��b'J>9KR<?I�C]��V��0�%������>���k��w�����͍��K�V��u?=/�<����?|`���7ҏ�G��ת���Q���ҦHWO�Kkz�����A�+�\�Hڇs�Vv�����7"c��(�"q��bJ�j?�%����V�^Uҧ��в��SSg�;�Js��&���Ba�rҎ
�}�Dڪ
_-2�l϶R�A6[��?�^/���@�r�D5V1hn�Yj��t���.]�2�(Oh�J|��3e�K�kC��[fr��!*h�4�G�;�3%A�a��!��lz�%�pt-i�˒A9/C�O�y���V�TY�'�m�����PL��ʇr��̍�N�#4{$�6|c�[�o���RMoB RQ��k���	/��j�d���cb\�o	�u:�x�}eyW4]�S�0s�*VN�~S� �[@U�Q&�H;�b �GҷE�;D�o���n5?w�e�9�w����J�9��R�.;{��O��&�=J�9�v���������s�L���-�3��h�lw�39�ϲ�l3�I@杒u!_n�<��u:��d���Gpët����Qc�V�.��s���*�Dr����z�F���O�H����\��O�zE3�T�ǯG;o��:�N�xE>�.px��� G�Nۗc�T{�V9~ÏH�K��w��^W�������t��P���%�J�w��;_�o����
���J�i�5B�.cP���������no���-%�r ��۹>8ME6�-b%�؅t�8����I\m�#G+�q�'" mS�r^���Pc[��Q��>+��|y�Qʛw^�1dl=s�=k�H�X�o_�DML��4�E�Ipf����9��D˧�|k����Pg@��ŏ�!Xc����36�,���-=�����`�/��O�A�s��,*3���S0�iOzѳ3Hd�KE3q�A�<(��q��OϨ���F^v%a$�F�n>�%�ޫ�ܬ�xsZ�n��{qO���8]*·B�Լ[-+!U w�d����}����s�+��W>�#�3�T�f�jB��v?&?�!�ӞUE�r%�	O�R
���_f�&�gd�@�>��W���w*�ui��a�ԚrC{��ϵ�1;���\�ӊ5۞T�~(��b��4#e�l+�O�t�K]����O���"8$�s7\�9��b�r����߿V����2N&~sp!K�`k��()Q|ᄁ��hm�l��2>��$.�UƐ*��|+�`čy��ip�y��w���w��o3%�l/����*�G2Ū.A�@�G���$Oېi������#ǯ��_
�D/�۸nI��7+�:،� ��Ḅj�q	3<j���ͫ�ڐ^k�{�(�>rΖ�=�%(츟4��+�]O�)t��O�Q�9��@U�o�(��~+j�S�G�Gj�?jh��k}���Z<I��k�b
�;�}r�7J���I����5��)f7et�%�Yo�}�?�':b���$w�'S��*���?�~����)���7���o�?�X�erx3��OL1X��C,呟�H��H��1��tj��
j���)�&�I�i��lב��&I�Nm �f���� O��j�ґF�*i�Zأp,��T�����c�⩃���<��]~=(�Y����x)�hr����@�)p��R�U���͒���	T�<�~��8�n��"�O��&�};��o'����Ub� r���o���ឃ����e1P���Q�$��#m���/����܊G�e"d 慦ҿ�J�1�^��.@~0a轜w���|u7[�Wt4iS�E/)���u>�{����>�}����r�
��X~]M�e�Sv^�*2��p�	V����E�
��=�|���;�,��!�3��4
���<�6N�r˳�~�B�h���]ӗ��d����� �ް�-X1sr�yKb��!*w̰@2�4$u�m>���2���p񕂳�ļ�ќǞ{��J�ˮ3~xy����~=9M�l��21���}aa>�|�d؁Ћ��m�_��	�xo�����Ƞ�!�j��
Ԅ+7(B�qs��T�r�nO�gA 4g�;9�/���edv�Zq�L2��e�	�4yp��@�H��#������%����a呎b�v�I#�;�{�OS�4��p]�v��(�aEVO�Ϣ��ٸq�~��$�v���wr�z��C΀K� �ǰ��h
�+���>N����|eH�����B�U ��%�ĵ�(%��s���k�Q��̾��;Z~��'ﯻtmk
�+���T�Fx1T�����G��Ͷ$F?�r�`;{5�Y����ƢxJ���x��a��?��9ұ��x/���_�ߒ1�hN6��%���Ur�k�|�8;m�Z{V�4��	���t�o��??s�e�]k��KO�,�J��
\�\P9�N�[1i����i�<1��Q�;m|b^�?C��5�e�y����L������8� ��Ԛqǔ���'KS6�D<*~�w#���'""�����X@��龯�����ɹ5ҥ+�S5��Iu�)��>qu�k��)�]��(/���s�*�i�.�.�5�ƺ9�|n�v���a��{�x���mY��K���t�x:��=@>���������U�6g�O���-�[*�������� �wT���S�p�5�sպ���M�|���/�&�_h��>P" X?X�i@=�����[}��fr�K�L?�+-����KڞO��`�ߝ^�a�L�e��s��ı��#s
����)���{��p����?$���E���m�Q���XW�1��<��|渨!��< >��N��\Ԓt	��ͱ�<��x���~zM
�b�F�>��Ɲy�2�K�W��oh�T���ǝ�Rm�J��֝Q�W_�Ae�o5��6)
M�{�L��T�*���b���]�AB	ta���'~E��_�SR(~1���G��;����.��l:w���1�\�ɒ�ZW�����έnz�5p��u^�f��G��
VC�o��+������(��ıp�	|�ƙN+�x���E�|~-\'xA<��ם�|���5�	X^��
�2n2OL���d�ʔ9�Dua�#�E������0(x�F;wY�;ey:�D�훕 �P������[ʰ��Ѝ?�� �>fH�l���ঘ�Vz�'�!�iiXЋ�����*�H-:�X���ya��ӵ�yd��\2t��}�q����J+Ѵ;pm��ҏ�Xw/��g����H`ӗ����r�پ��'w���w1I�2[ڻz�vVB�g���?��˗l�w����Ded������glD�''��O��^�NԻ�ã��9��*2���q͘��P`�,Ur�Yv���?`�������M?�켿4yMv����8�h	���z��� 0D�fS��ʦ����>���L�n�{��#�$��h�-�K�Z�rF[.b_�-|tH�`j���3�".8��~�hJ�N'Z��+�O��<	�,�;3��Y��Tp�Q�����5�'ʬ�A���}�bum-��~��@����:ȍy�����j�0H�FY#��������l��s�	�jvZ�h���bi�}��2��%�f=�H�p W���<�R����mw�^�C^��b߸�N�x���M�;���0I��U���x����Н=Z�O�>��o��H�D��M����.���)��U�'왔}�B�IqZ����I#,�<�JY�f[��׻q5��QN�>����G�Ҍ,�Lg�wtMx�ϓ	�a\�v�<�-�X���'��@�pK����zM�Q��|J�o�����T2ۣB 
�COH��	VZ�O��zWS�t�J鲊��/�I �(&�+T�����tq��ǯ�E�(�Z��M&��Ǖ�y?LAP�f�)s���0����������l4�,>U3g&�D��L���6;�{D�1��4�N�O��$��/nt�MX���}��:h�}x��q���.���0;�$�+X6� �]�M�3�
j!��y�8�[��X��?M����>\$��æ�Q�ΊCޕ$��b�L�ǲ�O&��6����������$T���X����ξ�{��&�<�	n.}�i�d�e���Ƴ�u'V��1��9��;P��3�/�ŁaYV�^��C���7�s�%�9�he��-94�e��yu�{���?X�!�j��F�<�J��ؖ� 'use strict';

var Type = require('../type');

function resolveYamlNull(data) {
  if (data === null) return true;

  var max = data.length;

  return (max === 1 && data === '~') ||
         (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
}

function constructYamlNull() {
  return null;
}

function isNull(object) {
  return object === null;
}

module.exports = new Type('tag:yaml.org,2002:null', {
  kind: 'scalar',
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function () { return '~';    },
    lowercase: function () { return 'null'; },
    uppercase: function () { return 'NULL'; },
    camelcase: function () { return 'Null'; },
    empty:     function () { return '';     }
  },
  defaultStyle: 'lowercase'
});
                                                                                                                                                                                                                        ��f�{*k��F+��\S���XtD����G�%1�t�3��	��ӷI+��Ԕ��ى�b���ʹ
�εN�=(02����Y+�t�j�Eq^�狝8�Ψ
i0z\v-��4���R�)��GL.v��X��z~fʉɡW�����^�]�/�Bg�\�^3Rj�`��3�=�M��wX�)`{t��O��e�,����;���s3��VU���E�x|Ё\����E��\J1]�	cq���SCt�N� Ph��2!�4�Uyqi�?��NV�a���qa��A��fR��|�,;ۨ��	X���!;7"��N���gB
��
�B���e�{²M��|���R��B��8u�Rel�nG# ]\��`����G �C�� |�e��ε1���g�t)k�H�k�n��Κ>ilh�&BP�K�=e�x~�Be�?n'�st��ƥKe�x0�t�{%,�M��662�K4$����3͘OlغQTK��"&0�c�]lcI�{&�6�+�%�9�"�?�~�觼�g�����_;������d����j/Y?�n��S��P1�W���i�����>Y��X�|�o��-�&f07#�8�7������
�7�
 &��Ҿ7�g��
/)K?)�⹪H�"�Ӎ��-ń�,?���j�{����^�~�nd����ļl��n�c�Ή2;H���c
k��{oDq���%�I+�X�C?mj�&pٵ�ܘ��Yk�}rY\���gt|��ɢ���0����k�� ��5��i�r"����a�r��q2�9��v��"󤟪��z̼Z���?E�[�S\�[��+�?-��w�Y~���񴁃�W��N��.�q�r��CL7[�0!o�V��۪ے-�{�^B�4���bn�
�4�n�h][�O�O�
R��oe �H�e6��}w�ٚ�3�X> 49ܳ�$=���C��槇k�ߓ�L�љDb�{�uk~�de�pZ�\����K2;��m���c� 9��q5?���ًk�^���K��7�]Ц��H$[�`6.�� tb��}���iZ�ܝj�0(PgUO��=Z��]�ʡ7x��.���qs(��hx>���9�Ҡvo˩x��ht�#M�Z IAq����֔�0F&��2A�
E�`�RнE&�����P�[��������.Y��
�# L�����d�gH��������%}���%Q����
��r}�#x��5�(����\����Р׊�!����+�UI>��
��X�o4)&�r��$<�R�:�b'&Q���R�yK��������'��~j��N���1���m<�L}im���je$�j+>�YnU�@�ǋ���32(@XN}D���u컩fX�g������8��v7��XAM��:d�o��,�3[�s	j�g.	�AN�CF�w�W*5���3�L�%ԏa���cP$
-R�K��5�"�㗷ů���f�ek�6D�����ّ띙f�5H#�(G{c�����Cc�������9��'Z��a���<A;��s����c�2�|�W
sf/?Ãɦ\���y�ƆU����q��ןC+X!�W�{o�X�������a�}�)q:((�X�׳�=ŭ�yRe(K��%c�E��Xf���v���|�G�%��(�T�3��OR��d��s�����T��������s�n3q��ʏe�	� ��u�X��U(褻��-!;��>��P�
j��R1�=�l1w���BM�D�9#�kB��4M;�!՝7;�R[�Z��4�F���6姚_bА?��K\}uA�[�1ϵ�>����'f�N�$�f�B(���ؙ����#���?�F8�;��p��YX`�����!~,4I�­9�^ܯ2�.ۺ�����B���
��X~�;�4�*�.��RX�̧�g�'���[���0�.F�As�)�Z���(�h���ѻ5�X_���e8��&ǵ��H�g^c��5�}�'UzP���Y��L�ϧ��&iJ�3]2��_)��9L,1��O����W����;��H����߫׬����H�@���o� �H(�ACgf˯��*�ev��_�Kzr�N��쳋"�����6ɐg�v��sԷ}/^6:�1�vO.�4˖�~�KɌ��|Ul�6���1j�Y�yg��6���- �t?�ʬ�t�0����̥�K��g��ཿZ8�۟s;g�Z�l�����j㉔>�bH֖�S�k�@^[���O��f�y:Ɉ_<�ݺ��kX�
�����������r�z�	J�bɩO�w�������+��L����ѯq�A em,��,�S�=T�:��%���ڵw�E��8��{�%��c��!���=�����J���Go��Q%wE�d�t�,йѽDKgIك�e����{:�������SK&3��'�Կ��a�d�Ҿ2� ��h����ʶF"߃����jZ�Fo�\�(���P�}��n't���.�F�)R�D|�>9������5�OD� 	�.ֹ�;
bs��z#���`s"�9^>׸rb��?�U�#�[u����^u3.79*�K�68e�������; #zdD�
��~��\u�k�mNR�U�����U��ҕb�|EE7M���R��[G=�� ���D�v�0�3��ܹ}�JB3/����M�I��{H2
ru��x���qe���Q��@�,`��
�<]�>��&_�I��C\��%���)#��Y�SY�����
���a�����X��|\�ퟂ ̢�(�/�2\���c�[�o�J��J �����˒��l�����=J��O5�VT5Z>�����|�,����<���T�{˦�����oLC��+����GK���I��Y�I^�	�#:x)�;2l�
�� !��LV_��տ�-��%d�cJ��4���IzsƵ�8]��2��P+�k��?�G�R~��^��?Á��M�����P�b�I(]&eS��r �ѧll��c��`/�>]磑P�K<������uԻuq���Id��O<�%C�"��y��M��� �q�jХ��� k'�" ����F�G��  ������A��I�? ���!�E��ȵM,��AL�[�Dx6�����e�|7.�k�c���E�qPA��O坱�M{��<7w�M��^�l�0H��'>߉�
�:���'bo=16�:���y֠���}��y�r��V��D7�3!�2���d�r~Z������Qd��9�b��0f��K�����]�T�Hgd�`Ψ� S$���f>�ܐw�-�۽���Jf��
%c�t U6}$�#�k�ǙQ'��q�l�rY�)r���5/�5v�t�ߍ�i��3�v�]����^c+���f�
A_�JP#�cC�z��A�8���z�j���7�{�PI<����\��c�o�a*� ��?(��C��'�$j��]K�Kv��3������6�.��[1��U��.%�W�s�Ϧ�:�X��to0y+Pz8tt�BY��=����C���(�l���y���ﴋ�ld��m
�[%�滢�o5��Fۤ�Y�{ѧ!P��L���P����F��+�sA30Q��&�0C�Ƈf�{)`uL����7�����߭�\n�*�EjۚƧ�7c׉YW�����(ڑ��8+(��H�9>E缡�Tt�:_�U<!
�+�~A'vP��L~�B-D�$�{?q5� ��~���c��,�d()�f��ݺT<�޷��'�P��ٰ�й�n�{�4�4����!�-�ne'�����dTW(3�����zbv����X����|��ٓ�G��QoU��
V�d������DCL�[̠7��Jbm�6�.͌��p�e��S4���ŵcvI>��s��xA��Rp��ϻYa�|���gt"Axʆ/�*��CKkth��x:1�p���#�^����x{�;��zQ�C�U���;�s�j��J3h���ܛc�����0��\AM����3<�
'G��d�3����,tw�<3�J)_4���'�E�7JY����s$�2�˔J9��_���|)�I�-$����[� �%�JȊZA����U?�H��<���G�w�����`�=J��oB?����\��->i�e�$1�HV�&䭱����r���hc��D+1��:�'T-<���I�pEF�ȅ:�h�,�D��%�ʨ�o�X6cmYp�	}�OaK����x>��1����}Gr��?.px���>����ǯayc���I�0!�����D��7�$;��	�=��j�E��W��q��Y�t�m����c)�}��D�����/7)�r���z������TԒ�{#��e����ow+G�`�
�8{YV������ĊlAA=?\��q�E��9S���LB�J@�gq7vA��"�KN����/�Sw0���+h��VF}(@:�ϒ�ށ`�H<o�@c�B��>�V�5�M��T���<>FvO�b���(pbM߽-�=���h���*��ޡ
.���[7�p�B�O
����\���] �w���1�hͅ�lk@�@:Zh�j3%�s���Eu�������]���/|#���}/0�'nu��C4��D4ϣ��H���Q�%uk0��{���To��N���=
��qJ�|!��7��ou�m�"�m�����e�չ��g�hs�쓒�nhC�Nܙt��w�c��� qN&�R��/���(@sҘ-?�=D%�O�����z<O�XVѴ�|��O�.x���k�Gk�R^<�Y�er���Ə�;u������t�'�2��F;}\�+��o�3�K���d��H�
-��Yw�� ��grE�&ɧcl����@�D~�w�);qGyv�(|M��"��Ҟ�Zq���T�°��_��ai������Ҷ@�o�C �+�v��J�E���m�{"��-�2}�d���#X�g����a�^p�Q��#����P��zܮ?�ĺ�&���R��9-��>$�fR�G���B��mZ�кkt}�t~���N�� r��Y��يG�zd��/���y������\B`�][��9�%Z� 4$���,��rb��v�
}��j�CQ�e}���/\�hI����E�ϋ�����i4��
��{X2�4h����E^A�؞�}8�9Y�y6�e�!�f8s�P� j�y�!=�u��z,I��9lb.���V~��-=�4L�
�2��qm�s?��S\f���.�K�+*&�3�7��.���<�vLn���o��_L�����WǄ<���� ����ݩ�8./Z2-N�lq%�YT̑rD=�!����l����M;g����z�<'��>'|vIy�H��Y�Os�s�*(��+�D}�z/�!���ԓ:��X�1G�nю&��fͻ,�~~ĬiY%I�4N&����Qd��`�п�l��|��z28��%�&����^�Bb�/,�j-P t�EA�E�B?(� �=����Q�����cuzJ&#
@�Y�.dY�#P���1�6ϐ�-D�0��R�������O�u'��X�|�Ě�y�,
4OI
��E�Zf8�@`�ߙs��M+�5~Ǌ`j��E��v�#��ԯ�x�Лq�Bկ'��F��@
0_۬�t���u�nx6�����'5!�⑓��K������nς�J��zĻ-����`����vF,��]���uGN�t�
��<M�5l�"G���%�ξc{p�Na��=o�F�����{��z���-ZіB~4�o��i�����N�N[t3B�R�B��z��M�}�dw���]��3��CH�6``�4�B����.`�*��K�G	�X�8�}�}�?mX��Ի
�y�S7�(��I7��^�K�����RWt��
�FS���;�4�s^��o��_|-x��[�#�L�[���7�
�Hc淁��ik-��N-~��������n�W6�?���/�܉xz� 6�]�Ss(��ùqn�2�54��gO����@P�;!������S}y�^G+�eܼ:�=mj &O�a�Ŏ�:�gd�-G�$����x�& ]#�n#ɯH����f��a�\�����M`��y�Әn!��v$��-�4;
�G52�
Lqx��H�T�����f/$ �$PT�Ό4ԑ�N]��$���Q�y�d޷]��~sQ���v�;�|^|����@��R|���lܣ����׎�Lf\�6����ȼ�����~�w��+�gBIL�zh;��ۡЀ˜�;7\��.-��E`�w����e/�	w���������v��O�靶�7A��/����{��{�q�u̔^O���|��Iƀ��A����s�cˊ*��t|���a���ZE,>gٙ�/{��NA_=<5G��_qDiͧ����>�⅒)�8%kQ��?V�>Lڗ���}�$��yF�4o�b-��x���;�DѢ�2�6���ߖ�=���H�*�2|�Ջj���=��CkL4c2�{���}��6�+���Eҫ���=
����f�n����I��)��h]�7X}*�^mb�/�����L��)��Q)����ۧ��(/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Expect } from './types';
declare const extractExpectedAssertionsErrors: Expect['extractExpectedAssertionsErrors'];
export default extractExpectedAssertionsErrors;
                                                                                                                          �x�?�yng�����|�òa�q�E����\��]�RuAk�����gLHc����̳
|[(=��i1�!Rf�� ԛ��:���+�g�n���ت�Q��?ߩ������)[�m������ 3��3�؇����7���������y��"nVv�� E�nhͭ_��DS��y��s��t!���9��&����+J��s�*�q��Tk��3�hN@T$�\�GЧ�@6�� *�N�G�a��R��E�`=�}V�;6���=V|J��(�����k��FBmss+�4��W&���$!��X� ��s�=�A��ȷ��jrp������9c�t٪���G�1�!�����8�5@�c}����q��z�-H�:'#�1A~��۳S�3͔рƻ��=����o�|��~ǀ"�"h����4�M����-�n+������jG�f�M�F>$c����ֆ�ɢ
u���0��?o�8}
�t���(�l:yu�Wz9�h�Bqsw�j��	�\�������k��=����2yz]0����$��� � �����O|y�M�?��S96���w���:'R���0���~U���;G��;�������o��b�O��o�Q��
���>�T��7��^�9��qհ�:?�$��<ޢ��c� �$�b�Y���>K���Ca*��x�&[��)\p8����$=�+{����m��~U�Lh�}Y�6�O�8U������~s�H��ц ������b��Ja?��lV+�a�T����k^�g�M��T�;Nh�3�m�Fw8�?_[Y:�=c�9l�J��t��,�'�{ϻ�T�_�Q�-^�0�R���#�J��C�k��k����e$<�
��'�vygn��C�Y���dp�y�=	�Kc"l�k��;�X���9���8,���+gX��>�
b6R��kt�L��" :�ga�Ԉfw8����~9#+��3�������4u�tf�g����(S��Nn1��{�幐�\�Ax�9x�PN�
�㕲w�9U��2�tV7m��W1ǉo�ʭ���Շ�%*InL��+���˸ �`����à��� �Mׄ#�������x�}ƷZ�jw��_f�/�ȍ,}�q\�bW����Ӫ&��y �5���-i.�U�}"l���(���j㻤(�����>�=:RBX����Q 8��#����z��Z�ϴ^���+�-9��;d.s�T���/�5�7��[be{D��*e>��P����ԂA�����O)��'G�?k�N����Ja_z�]��J���m<��^��
��5u��z��5k� �R	Ud�w�Ɖ���'�	?p/�O��	�OJ4
����D��=7��3�����b
X;�Zp7���4uŜ���B\^��aý��z�|z����	��*��/���y&`���'�� K�@qz�h(���C�@�������7��M�z�.#��,�rQǚ0��s��U���A�4C{��k[����/P��ܡ��E����:u�d�?&��w�����ź
n��&��
���6�9v�Gs9�Iw�f��ֶ���3n�\Q��wnl6\�S�(�&B��wlh���a���y�9M#u}����]�~�
�@=5y�v��*1O7���!��	�pb>�"2[�\S�J]��l�ײ3	�1� *��Q��[���=}�$��}��;u�OˑH3��
/%�Kes_k����N����8Mn�9ٝ-������j'km��o=W@��������"65/^��3������t��tf6�ik�
���G���M��v�&��ĕ�������`��&�٦gY�S�xk����=�F�g&�ŸXK�K��p��D��ƌ}�dn+�G<v�L����iM-��d�U-@O5f�O��l��7�`�r�����˛��\
'j��*( ���g,�K˃sv{�y��C��'[�6Ұ*|������4��
�zV8�K9���;)�����������Np�p�-LJPd\P'�9��Ck&+�zݶf%����T�����K����^M�r��pƼ[�Vǹ����)��c}��-���|��R&lW[=��).Ya4Nȏ��ڲ�Q�;�g�҂,p�(��ʐ��$s���S�e$oaQ|�u2�#�������?���r�'H)䟫L�PjϘܙ6��O|�=L%�'�dr���X!vN9׶M�W��]���_�~$Q�V����""�bJ`�t/�FOR����4�Gcx�w
�{t+�=���_�u_q�M*��p�*�ݡZ9[
ۜ����O5��𶖹�L3�YKLx݂�пi�	
<ɦ��Ta�D~��c>�MdhF����^\Bo���aZ>���(�:j���4�?�-dOG\�e_"��Ͽ��
p_&:�s<s+�1��~4�8�\+ݿV���xbCM��F��5l+�
P W����y���S�д�P}�|���|���ޮ7��B~t(u�׳�vr1V�8O+�-�)�v���K;�W��rt�dP�
a�S����9O�5�Y���3/��y���3��׈)�]@�����:ۙ
�i��N[��9Y�)2�3�t� ��e�O��������O��"Nl���1��L�������w�S-�.�/�\D� L[]�%g�(��oA{EA{.�'OEp%Ќq�B�Z��!.�$D40������H�{J%���K��H�E<�Hᕞ�VW'��I#��P�o�dɸ�@x��g��9c��$��!�S��p�3��*Y��{���R�dHeS�_& ��EDH�\ i}t���.������A^��vބ� 9~fu�B���*2�O�/�+ "��h< ��3��G�>+�g�	R��!�燽
�jHak�{v��������Aq_Rפ��5>��P��s��9�<�W��DG���=�%�K=��/`-k�kOڌ0@(�Ё��3R_�"��d�8��
�Ć�NRs���#_K��Bf=t��?�����/��jR�<��a~X,zt�ܭL�q�����9/wHι���坳�E�T��[�2c2
���zV��ϧ�$�ޙ!5���̯_$ ;��B!)���M��?ѕT��Wo��
�dH ����Z�����c"�j��+�x吋1m�9�_|H@��H Ѯ��X��[[��}�O0z�pC���qSv	\~����G��=��e&��������F-�+$ix�>W�IWsY��c�p��M�a9/tPTy�6��/�ie|hdf���aJ|��.�D��q���O�;xNiܬ���������-�
P<_��[���� ���Z����6$!{����EUeN����W%���h�?��.=��y���t�ۑ�,���sޥ�
_�0We������S�z��K�>��ى��q��
�|�#7X�v�p����}�
���ﾚ5!��>R����[u��3�+���+�-����4���3���9�-����;�Pa!�_*��=��Ii'���w=��űy��E{���1xu��P�nb��
a�PM��['���5ZJ@� P$/P��y��<6y������V8�S)F}]���2���[�ӎ�앂�L~�<��7�-}����J�*��/{W[���#s�L�vw�_�)b�Ͳ݋E�]FnF�5�|Ұ��X�:�QW���L@O30�E6{x�r摔�A�������{�FJ� '�cQ�e�vE�),�o�b�{�b �;�� �[׋��H�^�������&�cji�ė����J����`�(Q�GG���>o)� Z�^NO�0a���C>
�X�;�g,����� յ��l=�� /r��8�C��/��/�NE��9�m���	x�ޣ��!�������g��X6^����������5t�W�^Ӯ箦��ç���Q �]Z�5�+�u�|7[�l��]ҜR6���&�'�����]��� �����q���� ���"B?ݓ�T�����y�N?�����B��>|O�X���{X���j`�a­k�HO!����*J&$�i!^0dK�Z,��뢯��s�gj�)������AO��rO����V��k�7-��� Y�>���7�����tͭt
yg�(|{�1��`3w���
���:�󍣋1]�I<5(I�31~�˪��\��V�f�5?���=�����(y�#&���C�m���w��	�ns�i��{�x�o����o\�J��ձM#b���J0�S�ݕ�R;,Tǥ|H����Q�v�0�a����y�<�ՉE$�bT�㧦�]�����}�C�b��?Y�sj�0}lo�R�b�&#{E�D�LC���xTOӎ�T�A���1�%�+ɳΑq���99�M���i�E)1h���Zp�֐�1��9�l��eri@%yǻg/��O��u����{\R�@�A�g�Y^Σc��."b`#��q3xr�%s� o�t�b������+^���k �w7deK|��3�,:���}P�M@j�� el���#0Bq �uك%�ܙD㧍^_�#�.'o�0�L7�HQ�
��L�xŖG#�Ԡ��_��h��#s�I��9xT0��-�t|M����~d�3e�AG�A�����C�A^��;����)x�)�$���2���/�W�;)B�m$v����c���Qe���䁃����&l�� m��h��"A��,W��='휵-����8rQ�;��1�>�0Ή���t~ݥ��l��OQ�$.��#��?~�N�1�v��(���CO֨�i�B�-%��ヘZ��O������ד�7C1����>�w��8�΍2�Tjatn��� [����v�p�Z=�zr��S��(h��w��uDt)Sfe�ӿP&mcD�#�͛�,�����FA*�w�b�������W�S�z��7�(@l�7�ٽu8lq��ǥh�+@�阉L���y;�4��^��^)lw=��}���dSpI�G�/L����7��?l0�&@�[f�߇ͷm"�=��]��|M�-��.U�@^}\��}������/�����$�pe������z�wс�.�������'�I8
���)����1<�n�F�	�x�S�
��L&���SH=UίX�����?:�އ�ۮ����*E �GZīXҤI�P+�?��_�92L�ER&vO�C��*�Ϋ��o���:y|~�࠱pXd?�U!,`
�w��`c��;m��%v]|��gmM/d�w��Z��Ds�Nϭ]�h��|򱴗�<w������[Ƕ#����%^_��B�H��yG����#\*a����s;Mt(�ө��ؒPA�b���UN���R�p��8���h����XG.�ۜ��� �?��_+���sWz.�n<�n�i�o��m�)��b�8�7{���oq��``��{>�@}ۓ�$$����ԳϦ
6�" ��x��q�r�.����q�l��=1��/#��}��S�SoG�)K��D�%E�������?�_��^�����>	��x����M0�B��*����D�	�o�2s��˺�-���F}ۮ�{S�uו����z-����f�iog
I��Ub�Lʝ�xTX�O:�ݮ��0�)%Z������h=�����:��@��pa�1X�L��ǜ@U-K���@�M�;�VѴb<����Y�^�v�3'��#��bT����]Q����#���c��&��\��	�!S�j�Q�\�!/|R4@�w�kTr�q��ݾ�J��<]J�f=��3��Kɹ� v����	+�D�� ���>❧����f���b;������e�N���k
��&s�?�|��-p�X�W�#-�}�>�X�~O��?8"�'����0��Z�a�oof��N�9b���Z3��f�P���
�B7���̟�!wv��X���U:�WN_��$�����Z�&uwH��q�G��&�$�1���Pu���D[K�4���R�@4?Q�<
������L�(��*�0�J����Κ��χ�	g��.�)�U�c(�R��Q��Փ�
!�V���s�����ɵ���3$��#�	���v�����k*zՁ�{C��k�������*�S}��a��,	��V����Cޭؾeaoŉ�.�Ĝ�I�����t�����&E�4��]�󉬆�=I����t��M�@|(%"_=���]щ�߫H��oV��(*@ ���c���p^R�Oؿc�8��CP�sK��:+�O��N�$�-;
�����q� ;V� $;�t5���B��A�=z�o��7"m� ¥�x��k���@gE$��#G��~7���=
e�#c�_���|Y���(��� ������t�%���k��>Cؓm� �E�V(@r��UQqAX�M�ґ�Az��n�g`:�ĵ7�~�n����NN�(eݒu��x3������ͭ(�����0�͘�\(����ˋ�띫ب�&ׁV[��*�./i�fF���Z>�s�(���5%~��e[;��R��֪2e�&r��-�yT(�Xu7���*�7�o�]�؏�k����XC﹫l�c�]����{8�##�<��ʒ��x{2@c�ːQ�+7�+�����D
<��I�ɜt�)�������y�kƸ!��'��9N��p7 T!)m
��w���5o��W�t� ^;��tm��ې#�����K�J�����懅x` ����~��r5���/�����-��2y�,��_�[(�l��*�Yф�uҒȲO؀V�Wǲnn����z�E�!���PQ�h,΀y��
��}��n)��)7ڕ���v�����c]\�eV`���D!�Y�dx�v�X�����0�5��?q��R���'���.�B�R���x����䱱#
�*X(5��+ߎ*����-�ɒ�|/��|J�e�e|�c�D�ĀR	W&l_��y1'ꁣ�NQ7�Œ�\�[۳O+��T��Z��_�h��h����o�2���u��X���M��Y�	
��g;�$���Ǚ�Ņ>�`�t�m!���آ产�����������3����ڔU���&�,}��}���Ǟ�1�(��
���>��j�(R�&�_���䤆����zS&�9�!E������p�j��M�g��o�!�Ռ�x�l�+Qp��`��@˵������шC�,�����UEh�g�&=����y}�[%����\Jt��
�R�7��O�G������D�*��tGSwБ��d�C�V
�/�mi��L�?9���1�4��a������<��b����$Ʒn�|��������0��`3��p��A$�����c��;�Mz?
Ij!��{r��_f߄�!�����%�O�z������t��lD�G�UiK"�e����P�����`�(�X$}�%@w�ȗ�uF7�<�n����e�!fQ��

���~�:�j�"nb��0�ĭA�����C4��;
�E��:�`6c��*~�DqP���Z��� ���ۦw� =�!b�?pL�A��2��n�~ �����	���oOd�A�z���ْ�>c'ȣ �[�ٝ��=z?*��X3SWS����>�`D��"3nz)�;ڲבT��)ߠD.	�U��G	��>k3��2(@����Ɔ��m ���
�5��5;��1��B③ �|�,��8{~L��bk!�72
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Expression } from '@babel/types';
import type { Config } from '@jest/types';
import type { Frame } from 'jest-message-util';
export declare type InlineSnapshot = {
    snapshot: string;
    frame: Frame;
    node?: Expression;
};
export declare function saveInlineSnapshots(snapshots: Array<InlineSnapshot>, prettierPath: Config.Path): void;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ��$q^i�
��]����2(0��H>���K�s:�y�>X\g[ՁE\�u(G�lO��|B�6MM���))�ח+��w1<�U�=Ǜ3Ҏ��d�T��FNL��'͛��2��fÏx����!��Ħ�&�\�4
:*���E��Y/������NqfO�8d��K�s����G�8����&q���	\$�7�g�/�
��4F��������-q���H7I�]��i,��X�������y]u�M�ŕ�_JV;dB�N������yra�L�F�/��~��D��3�3��w,�=�b��C&���oX������7�kr�����}_����F��#�a?B���Yq����5D�驲�w�~���܄h}�<�fMO9Bk֏
9D�x�
P,8�L��v|�ޓ����z����,��ü��9��-�@ݕL~��RT��Z��H�\���1�G#}ˍ�M��H˾]� �zq9Q�p05t'��9�˗^��C���[�V*�!����{`>�'j�C�~�c$�
|9&��s�M����*Y3��!u�w���T��G۠
y?�{b�s���vc���)�/?V���$}������\�?wB���3�m	�V�}�
P#Bk>��^i}��3@h\�Aay���F�~��֊w��7f�o�r`�)72_�=��n�,X�*׳���,�j-�5Ě���G=�=U�0V>-jn��o38�tC=��v���#�آ�>���B��s��t�`jK�0��@a?��� �E";Ô�wz�o��pv[Y��$w�Z�	1d��1��{GsG~��һ��X���Oh�������q�;G����o!�réK���"�5�:�~)5���E@t�P B�/;9%(@�Y�W�Z�>Z ������C�t>� �23�x����
<�\������he�,*'3����5A���R��m��$�t(�/|8�Xʹ��XD����z��)��{�2��6t���,H@ڒ)U��\NL�
qMā�J��&���7E����!���#�C�W���) <�p����6\_xJt7��`��kC�>S8Вl��L�^$�yIZ�/�p�)gr<ܐj�OX13zc�z/�z����(���.u�#�O�7�+!O��$q=.�)�j����b��l�����(�q��g�;���y���%�\��!P`���� �������m�J>ܳ�2���QTЎ��'�`�o�ĉH�މ���]@��
C�5�3F���s��W�y(������af�l�R����֫�Q�j ?��Sw6n	�o���-e��]\�����?.�ύ�W�L*�:3U�$���]h�MQ�xq� ��9�H��D&X���9�5������(E����%yP^�!a8sXu0,�B�}]�~�b4ل�o�|ub�w�n�F����gP�yІٲ��;�))M6�6+���ȾL�)S�tF�[���NU[���rrq=��!4��iĿ'YJ~/�[� C�i�s���,�������c'�
}I$��t7�?�9�̒��p�l�>Pd������ʓ��n��H�+�ǿӦ��?�(g���id��m�E-8��!��<����{_E�u�n�;P#+�O�}+�Kz����BU&n�{\�#���V�_l��_N�(�C�1�2b���N�ej���}���e��#t���ivN6�������%�P��ƈ�5j����ڔ��챧J[S7^8��w��+i�|{OW���'�V����"�R�D��"x��{���R��Sf�q�4
 �I����x�/��
��6�3��;�[v>��O����ϑ
���y�M�s��2&m�qT�f	�OG&���56~i�}X���Œ��f�l
W�þ�9�)�+m�x�a��Lp9>X�1wz_y���6����,k
e��
�'&��!O��n�{���ζw��������dQqݮ=����9���'S3�o_vrӒ�4�`;h�쏒`2���(@��H��I�x��6˱�z����ep� ��(���4���Պ�1�f��J�;������9�SL����&�Dx8���q�ES��V�S�<!�^�8�,��٧�k��׮�cH��"���Q�������`Σ�������MRA)`�m�����T3S�d�eQ)�Tl{�{^��v�oT�6�!�)N�wI��.���܃�5�ɜH�y�Hq}Ce�N�AGwTX���'
3��,��@D��&3a�S�y�^Ӯk����T_����������*Q(4�{��?�N����F8t�/�����'7�(;���Z�X,־�wd
���1�����#$��a�g�L�a�UH��ɀ�۽�+D.�Q�٨
,Il�K�!{������5���Ђ
���#�%�Y��.ϖ�D�nɘ���2#f��6b6��|]M�a��$�wX%�v[Rn
������t+�L23��o�!�qA��׭���ڋg\l�1j���?��ÐP���?��7s��ɯ�Q]oS��ӧ	piJ��� �W��L��2Ff2&p���������f9�5��X��哩� ���!�b��vH~��8ޘ�s�gd�k9��]��ej�����]�f?L�{�tNM6v�!�(�}���&�5��|S�?n�F�}NT{�bR��Ǚ�����X�q>��3*k�.�y-�.�����w�c1�2�Ɣ�"�y�A.�Ud�?F��p���%�U��x x���%9�fm��.�G����'�z|^��r�|��i�a�D=��3��o�"o��0�7۟U���
�'�i ��"��obs�N�τ�e���i��˓��Wc���o4���<�&�@�T=g��qY�Dw�.Q���@���������YA�#�N���%�s^��ЬZ�h����7�0�-7�廚�J��$���\�9� �ݪ�ݹ)C]
�CΠu�򹌆4`���i�e�
���/�t�O�X+�itm��w���s�c'�$\
��uq��~��x}߾'hϛ�ɣ"��MM)�l�����yw����
UE�az�ԡ�������}�����n��PX�C��	
zl����Ѳ��)�}}C�h�,����y"���ż�������"��v����P���MA�WV�8��s|�N�=4b9�3�j\3�%D�8�r|�wd�<��^HM�j�P�\��Z�&H�ퟏ����+N����΄|�[sB=�+&�wC��
�[�L}�4A���<����8ٚ��̏&jLW0�q��V1H�%&��b!�a�4��e)Nb��/��AX��M�E�w^�'�wo
b��J�so~�����Y��ܷ8i��n�KM�c+�� ))�]͞8�}�#G��/�D��5�:Np�3�D��I��-��J�=ם�pV�K0լ��o�T�4���B>�r[7d��,
|.�*��/�D�i���K�	L][s���ϯ���5��>)�C��4��qG(si����	c�	��RF��o�P�c�O�T�o=9
0�I��W�3
G�ǋ��� ��^�( �P�^�^�� %FN$��2
��h47�Qnl5@��Q m唛me�˝1�k������]n�,�X��J�$�3�eKt}�>����oށ�O*���68��I%R��6����x�.zΛ�����5��͓y[�y'���~O��K��� ���p4dV�|a����!iQ؉�T�"�/F/	p�^]�m�$d��7~Uf��=����/��.��3�O��F�x���g�+�����E��t��2���.-��l���>7�ݨI�PM�e1:���y�i������<&1�ǜ��N����2�<9�H������<�!x"�걽
g��~m 3��IO/��q�[疣�)7i�� X�bm�����L+�:�_�C�X!���'(uN�RE��X��n�����A̍��]��Y��Ƨ+�0|̧6��P�g�?��`�O㾵�j{�tKO���@�����5��&�S�A;���w��L�9�QCV�r>��Q:w�� >
���j�E-j�����
�a?Ue�۬
96�̚S/� ?˹P�r3�3>�O�.���\h�%T��L}�E�&
���+3���7ۆd���Q�Ή�#Dt�n�p?d����L8890�X��;7>�N�I6�NO��y��4G��O|�Z�[�g!4�M�j�dre�83�쉷��y�J���>�}�P��x?�2Vr���>��U�H"1��f.��a�=cq�.j6���h�p�WXΪM���\��� 0{�Kq���sϯ���|'u��-��+3ڴ�;k�@|(�SN�k��KT�^�O��a�^�d|D�b!�Fݝ�(�2�����;��j���Ω�^ �b�O��������Qe�Ӕ?R��,�%U�}U܃��
L�]C����Z�;�6�G2�9v���"'�Ӷ �'�Ѣ�]���}9$3>2e
���K~��"��PJH;�BT�g���w.�������u�ש�o1P�%�E9��մ?M�DU��)�T��Nw��������m�������K�,��x�Չ��^���HA��4�!�u�&O
��e��4f�7�\a�E���%�Gx��i��%�*~2�|KnW(���M��z��?���(D���8����:a��!�
	�j�
�Dj��Z�E�~õ�M�>���آ�<�UGq� ���'��{�(�&�2��h�>��"��v�e��NYi�؜�J�6O�������l�9����h�BJo�4�W�S�%K)������r	�N�ゾ���-��%$�/Uԋ�>�ߓ\� ���;
(���-�ZH���|�$:�v�5�mQ������Ə�ӏnۘ��nx2bVVw�ۏu�/����g��8ǯ"D�ץ�v�?95O�/�mO���h�$�����\��cԿ�����q�=u2*p:%�����׉S
�p���r�H�0ߋ�����ɉ��-^�&˗5�	b�P~,�.Oҷn	+c���"'
߂�S�<��<�z���i���-
ON�����|�| �%�%�����r�#=��%E/m
���w�t�>����r/�I��ͫ�x����}��T�i���=��?po�W)�%���Iy)	��V��G����^ P��`ኪr��~�\7��`��\�:=z�6��b&0l(Z>��լ�Kj�Ą���u�>� ��9�0��ɝ�L�룈��5l4��9�` �;��G�*�89�f��&mX��[ʷ"�r�v��\7?^<?�6w�ۍ���+lWW�Pf
u��:n��rNn?�z����o�<��}*u'���]Q�x���gT�
.v�T}?K���L~�G�J�L;�;��$�h��#�-�c�,�c�4b,4�c�2��<#+����K�'���8��<M�b�t	Ҏ��$�Jx��SIeY���E�����|�h���]u;8��H�z$\��5��9�.4#0v+�Ŕt�R��9������@��j�r\��@�P�R?�}�8�ѳ���b�J��Y6"Q)b��;/F���).�d������7���G*�������a�P6��[9w�8��{�F	�y��fg�\T�k����ݜi�uq�f5?�Œ~xZ�*�ȕ�丿Dȇ �od	�y^K�����UHyJL�^7t�Q�Z
��c�ⲨQ��~U?�h>��r��CLRA���ΰ�4Y�"�p$�%������?�tQ$���xC��!���"��B����=!��M�S�If������Ѻ�J϶_ڿ�|�A-����0d~muq�q�U�g6*��]B��%�$t��*�u[L4'���d�؇ �ۤ���1��WF�>�=���m d�-�|� ���NZ(->��= ��g���o􀫲�w�V 6�/S�/��xI��e7�y�k��Y�o_�f-,4:��c�w�$�-�tUW���'>��酀~O�Q��SI*�p}~�5������Y�Gۢ�ʢ������{���Q�����0������w����v]M�e�6C��t�v	��AM����A4>�Y�,PӦ4�}��%�.�3�L���A_�^H���??��t�4�g|f����(�+��������Q��Qus�K�N�#yJ4�O�
�qm�'{K����_F���sLC�^�8�����z�V_¯��o�?��.)D��y`1���W.>�1u۶�Xm�:&��4iܮ�Ӑ���0@�{�H��\��9@�<�#=�porT/�#�ӃZM㪢S������炟�wN#�y1 ���au��Ԑ��Ym�=hgUoe�J�ކ#CFr����o�
9�u��$�������b � �t��A�Cgdj�������������,�;*6�?-g_��(�l
�s -L�������S��o;�\]��\�+��A;�Σu�Ң9���1O^l�sxJ/��ntK�o������J���)�esm�I�SAoki�^����a&��\ְl��3��*빅p�Q���V��Þ +��f%�v��;�*���j��� |̥h���P(狾TJIC����Q��	�q������e�f��2"�m�� ��f`��V/��P��]���Ї}2��g>"���5�j�dɵ_��+�-X$�ڀ���y"%ܙ�ı����:�s�rI#���2FS@���,�py�Ff�X�n;�Ù��c�Y�]5̸��~w�3��8t��
j�:*����P���I��s�DzP~��2�FY�_~n�����dm�n�̳L"x�rΖG�ro7<����|�ׁ7�/���ޗ�_�k��_�;[��Fg0��%vl�"��_�ף~"�L�Ơ��,�= t�.WX��ɡ �=׷��f����ބ(��J�kU�2-��]r��P�,d:Ue��|5q���&.|v���a�y�(`U~4L��n��N������B��}B���UKT����"4$C��>_o�X�L��#[
�ɺ.O��"]�:3�D=�ty�@'A��k��f���?���%�vP�g�vM����v�������R�E�~�Z�V��;:�*��<��L�α���1�	��mP!F]
�]�N���Ͽ�ǓtUd����JBC
�'�w��Ƹ��̠�ƌ��:Ң^T�T�c��FB�f���rs�pIDg��t���Z��(I�:>Y�F�'�;����}��C��Y'�
<�Lԭ��v ��]i�6����U��^`b�"@P��6�8��+a	�
S���F��ڙ��4���t`� H��!�\"�л�)`'5�Tw��_�i��Oh�3��]�֟]?s�� �*�cP����h,t�j�]�Ф�Y%xyg��%gC�ߑ�NxQ�L�WL�VV��eWq����u�|��N;��y��z�K�R����'��z��ȯ�;^ˊ?Ƣ����e����]�\
��q��q�� ��C���6�,Z�ܠӏ�����2 Ry����_Ƥ 	y��qc�yg�r�H��Xǚ���W@�Q���鰭@]{��gh��ɰ	ү&~~�a
�bJt̐6>�����;7��>NG	�c �}��}o�9�;��ClL��Y��#�r4��l�O�yݧq}q��b0c��ċO�n�}��{|�wo��IqЛc�K�;��KO�P��u��&-�")F��&M�|v����/�$�q����rZ����q9a�{�_'�"Wre�P���ܝ���&��á.�b��`�H�7$�8o�7)b�y�h

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _jestRegexUtil() {
  const data = require('jest-regex-util');

  _jestRegexUtil = function () {
    return data;
  };

  return data;
}

function _jestValidate() {
  const data = require('jest-validate');

  _jestValidate = function () {
    return data;
  };

  return data;
}

function _prettyFormat() {
  const data = require('pretty-format');

  _prettyFormat = function () {
    return data;
  };

  return data;
}

var _constants = require('./constants');

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const NODE_MODULES_REGEXP = (0, _jestRegexUtil().replacePathSepForRegex)(
  _constants.NODE_MODULES
);
const initialOptions = {
  automock: false,
  bail: (0, _jestValidate().multipleValidOptions)(false, 0),
  cache: true,
  cacheDirectory: '/tmp/user/jest',
  changedFilesWithAncestor: false,
  changedSince: 'master',
  ci: false,
  clearMocks: false,
  collectCoverage: true,
  collectCoverageFrom: ['src', '!public'],
  collectCoverageOnlyFrom: {
    '<rootDir>/this-directory-is-covered/Covered.js': true
  },
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [NODE_MODULES_REGEXP],
  coverageProvider: 'v8',
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  dependencyExtractor: '<rootDir>/dependencyExtractor.js',
  detectLeaks: false,
  detectOpenHandles: false,
  displayName: (0, _jestValidate().multipleValidOptions)('test-config', {
    color: 'blue',
    name: 'test-config'
  }),
  errorOnDeprecated: false,
  expand: false,
  extensionsToTreatAsEsm: [],
  extraGlobals: [],
  filter: '<rootDir>/filter.js',
  forceCoverageMatch: ['**/*.t.js'],
  forceExit: false,
  globalSetup: 'setup.js',
  globalTeardown: 'teardown.js',
  globals: {
    __DEV__: true
  },
  haste: {
    computeSha1: true,
    defaultPlatform: 'ios',
    enableSymlinks: false,
    forceNodeFilesystemAPI: false,
    hasteImplModulePath: '<rootDir>/haste_impl.js',
    hasteMapModulePath: '',
    platforms: ['ios', 'android'],
    throwOnModuleCollision: false
  },
  injectGlobals: true,
  json: false,
  lastCommit: false,
  listTests: false,
  logHeapUsage: true,
  maxConcurrency: 5,
  maxWorkers: '50%',
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  moduleLoader: '<rootDir>',
  moduleNameMapper: {
    '^React$': '<rootDir>/node_modules/react'
  },
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  modulePaths: ['/shared/vendor/modules'],
  name: 'string',
  noStackTrace: false,
  notify: false,
  notifyMode: 'failure-change',
  onlyChanged: false,
  onlyFailures: false,
  passWithNoTests: false,
  preset: 'react-native',
  prettierPath: '<rootDir>/node_modules/prettier',
  projects: ['project-a', 'project-b/'],
  reporters: [
    'default',
    'custom-reporter-1',
    [
      'custom-reporter-2',
      {
        configValue: true
      }
    ]
  ],
  resetMocks: false,
  resetModules: false,
  resolver: '<rootDir>/resolver.js',
  restoreMocks: false,
  rootDir: '/',
  roots: ['<rootDir>'],
  runTestsByPath: false,
  runner: 'jest-runner',
  setupFiles: ['<rootDir>/setup.js'],
  setupFilesAfterEnv: ['<rootDir>/testSetupFile.js'],
  silent: true,
  skipFilter: false,
  skipNodeResolution: false,
  slowTestThreshold: 5,
  snapshotFormat: _prettyFormat().DEFAULT_OPTIONS,
  snapshotResolver: '<rootDir>/snapshotResolver.js',
  snapshotSerializers: ['my-serializer-module'],
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    userAgent: 'Agent/007'
  },
  testFailureExitCode: 1,
  testLocationInResults: false,
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testNamePattern: 'test signature',
  testPathIgnorePatterns: [NODE_MODULES_REGEXP],
  testRegex: (0, _jestValidate().multipleValidOptions)(
    '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
    ['/__tests__/\\.test\\.[jt]sx?$', '/__tests__/\\.spec\\.[jt]sx?$']
  ),
  testResultsProcessor: 'processor-node-module',
  testRunner: 'circus',
  testSequencer: '@jest/test-sequencer',
  testTimeout: 5000,
  testURL: 'http://localhost',
  timers: 'real',
  transform: {
    '\\.js$': '<rootDir>/preprocessor.js'
  },
  transformIgnorePatterns: [NODE_MODULES_REGEXP],
  unmockedModulePathPatterns: ['mock'],
  updateSnapshot: true,
  useStderr: false,
  verbose: false,
  watch
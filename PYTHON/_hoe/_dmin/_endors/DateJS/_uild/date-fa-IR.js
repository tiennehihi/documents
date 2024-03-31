"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
var validate_1 = require("./compile/validate");
Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function () { return validate_1.KeywordCxt; } });
var codegen_1 = require("./compile/codegen");
Object.defineProperty(exports, "_", { enumerable: true, get: function () { return codegen_1._; } });
Object.defineProperty(exports, "str", { enumerable: true, get: function () { return codegen_1.str; } });
Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return codegen_1.stringify; } });
Object.defineProperty(exports, "nil", { enumerable: true, get: function () { return codegen_1.nil; } });
Object.defineProperty(exports, "Name", { enumerable: true, get: function () { return codegen_1.Name; } });
Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function () { return codegen_1.CodeGen; } });
const validation_error_1 = require("./runtime/validation_error");
const ref_error_1 = require("./compile/ref_error");
const rules_1 = require("./compile/rules");
const compile_1 = require("./compile");
const codegen_2 = require("./compile/codegen");
const resolve_1 = require("./compile/resolve");
const dataType_1 = require("./compile/validate/dataType");
const util_1 = require("./compile/util");
const $dataRefSchema = require("./refs/data.json");
const uri_1 = require("./runtime/uri");
const defaultRegExp = (str, flags) => new RegExp(str, flags);
defaultRegExp.code = "new RegExp";
const META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
const EXT_SCOPE_NAMES = new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error",
]);
const removedOptions = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now.",
};
const deprecatedOptions = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.',
};
const MAX_EXPRESSION = 200;
// eslint-disable-next-line complexity
function requiredOptions(o) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    const s = o.strict;
    const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
    const optimize = _optz === true || _optz === undefined ? 1 : _optz || 0;
    const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
    const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
    return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver: uriResolver,
    };
}
class Ajv {
    constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = {};
        this._compilations = new Set();
        this._loading = {};
        this._cache = new Map();
        opts = this.opts = { ...opts, ...requiredOptions(opts) };
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
            addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
            addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
            this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
    }
    _addVocabularies() {
        this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
            _dataRefSchema = { ...$dataRefSchema };
            _dataRefSchema.id = _dataRefSchema.$id;
            delete _dataRefSchema.$id;
        }
        if (meta && $data)
            this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
    }
    defaultMeta() {
        const { meta, schemaId } = this.opts;
        return (this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : undefined);
    }
    validate(schemaKeyRef, // key, ref or schema object
    data // to be validated
    ) {
        let v;
        if (typeof schemaKeyRef == "string") {
            v = this.getSchema(schemaKeyRef);
            if (!v)
                throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        }
        else {
            v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
            this.errors = v.errors;
        return valid;
    }
    compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return (sch.validate || this._compileSchemaEnv(sch));
    }
    compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != "function") {
            throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta);
        async function runCompileAsync(_schema, _meta) {
            await loadMetaSchema.call(this, _schema.$schema);
            const sch = this._addSchema(_schema, _meta);
            return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
            if ($ref && !this.getSchema($ref)) {
                await runCompileAsync.call(this, { $ref }, true);
            }
        }
        async function _compileAsync(sch) {
            try {
                return this._compileSchemaEnv(sch);
            }
            catch (e) {
                if (!(e instanceof ref_error_1.default))
                    throw e;
                checkLoaded.call(this, e);
                await loadMissingSchema.call(this, e.missingSchema);
                return _compileAsync.call(this, sch);
            }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
            if (this.refs[ref]) {
                throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
            }
        }
        async function loadMissingSchema(ref) {
            const _schema = await _loadSchema.call(this, ref);
            if (!this.refs[ref])
                await loadMetaSchema.call(this, _schema.$schema);
            if (!this.refs[ref])
                this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
            const p = this._loading[ref];
            if (p)
                return p;
            try {
                return await (this._loading[ref] = loadSchema(ref));
            }
            finally {
                delete this._loading[ref];
            }
        }
    }
    // Adds schema to the instance
    addSchema(schema, // If array is passed, `key` will be ignored
    key, // Optional schema key. Can be passed to `validate` method instead of schema object or id/ref. One schema per instance can have empty `id` and `key`.
    _meta, // true if schema is a meta-schema. Used internally, addMetaSchema should be used instead.
    _validateSchema = this.opts.validateSchema // false to skip schema validation. Used internally, option validateSchema should be used instead.
    ) {
        if (Array.isArray(schema)) {
            for (const sch of schema)
                this.addSchema(sch, undefined, _meta, _validateSchema);
            return this;
        }
        let id;
        if (typeof schema === "object") {
            const { schemaId } = this.opts;
            id = schema[schemaId];
            if (id !== undefined && typeof id != "string") {
                throw new Error(`schema ${schemaId} must be string`);
            }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(schema, key, // schema key
    _validateSchema = this.opts.validateSchema // false to skip schema validation, can be used to override validateSchema option for meta-schema
    ) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
    }
    //  Validate schema against its meta-schema
    validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
            return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== undefined && typeof $schema != "string") {
            throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
            this.logger.warn("meta-schema not available");
            this.errors = null;
            return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
            const message = "schema is invalid: " + this.errorsText();
            if (this.opts.validateSchema === "log")
                this.logger.error(message);
            else
                throw new Error(message);
        }
        return valid;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
            keyRef = sch;
        if (sch === undefined) {
            const { schemaId } = this.opts;
            const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
            sch = compile_1.resolveSchema.call(this, root, keyRef);
            if (!sch)
                return;
            this.refs[keyRef] = sch;
        }
        return (sch.validate || this._compileSchemaEnv(sch));
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
            this._removeAllSchemas(this.schemas, schemaKeyRef);
            this._removeAllSchemas(this.refs, schemaKeyRef);
            return this;
        }
        switch (typeof schemaKeyRef) {
            case "undefined":
                this._removeAllSchemas(this.schemas);
                this._removeAllSchemas(this.refs);
                this._cache.clear();
                return this;
            case "string": {
                const sch = getSchEnv.call(this, schemaKeyRef);
                if (typeof sch == "object")
                    this._cache.delete(sch.schema);
                delete this.schemas[schemaKeyRef];
                delete this.refs[schemaKeyRef];
                return this;
            }
            case "object": {
                const cacheKey = schemaKeyRef;
                this._cache.delete(cacheKey);
                let id = schemaKeyRef[this.opts.schemaId];
                if (id) {
                    id = (0, resolve_1.normalizeId)(id);
                    delete this.schemas[id];
                    delete this.refs[id];
                }
                return this;
            }
            default:
                throw new Error("ajv.removeSchema: invalid parameter");
        }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(definitions) {
        for (const def of definitions)
            this.addKeyword(def);
        return this;
    }
    addKeyword(kwdOrDef, def // deprecated
    ) {
        let keyword;
        if (typeof kwdOrDef == "string") {
            keyword = kwdOrDef;
            if (typeof def == "object") {
                this.logger.warn("these parameters are deprecated, see docs for addKeyword");
                def.keyword = keyword;
            }
        }
        else if (typeof kwdOrDef == "object" && def === undefined) {
            def = kwdOrDef;
            keyword = def.keyword;
            if (Array.isArray(keyword) && !keyword.length) {
                throw new Error("addKeywords: keyword must be string or non-empty array");
            }
        }
        else {
            throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
            (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
            return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
            ...def,
            type: (0, dataType_1.getJSONTypes)(def.type),
            schemaType: (0, dataType_1.getJSONTypes)(def.schemaType),
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0
            ? (k) => addRule.call(this, k, definition)
            : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
    }
    getKeyword(keyword) {
 "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
var validate_1 = require("./compile/validate");
Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function () { return validate_1.KeywordCxt; } });
var codegen_1 = require("./compile/codegen");
Object.defineProperty(exports, "_", { enumerable: true, get: function () { return codegen_1._; } });
Object.defineProperty(exports, "str", { enumerable: true, get: function () { return codegen_1.str; } });
Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return codegen_1.stringify; } });
Object.defineProperty(exports, "nil", { enumerable: true, get: function () { return codegen_1.nil; } });
Object.defineProperty(exports, "Name", { enumerable: true, get: function () { return codegen_1.Name; } });
Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function () { return codegen_1.CodeGen; } });
const validation_error_1 = require("./runtime/validation_error");
const ref_error_1 = require("./compile/ref_error");
const rules_1 = require("./compile/rules");
const compile_1 = require("./compile");
const codegen_2 = require("./compile/codegen");
const resolve_1 = require("./compile/resolve");
const dataType_1 = require("./compile/validate/dataType");
const util_1 = require("./compile/util");
const $dataRefSchema = require("./refs/data.json");
const uri_1 = require("./runtime/uri");
const defaultRegExp = (str, flags) => new RegExp(str, flags);
defaultRegExp.code = "new RegExp";
const META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
const EXT_SCOPE_NAMES = new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error",
]);
const removedOptions = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now.",
};
const deprecatedOptions = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.',
};
const MAX_EXPRESSION = 200;
// eslint-disable-next-line complexity
function requiredOptions(o) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    const s = o.strict;
    const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
    const optimize = _optz === true || _optz === undefined ? 1 : _optz || 0;
    const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
    const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
    return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver: uriResolver,
    };
}
class Ajv {
    constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = {};
        this._compilations = new Set();
        this._loading = {};
        this._cache = new Map();
        opts = this.opts = { ...opts, ...requiredOptions(opts) };
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
            addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
            addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
            this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
    }
    _addVocabularies() {
        this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
            _dataRefSchema = { ...$dataRefSchema };
            _dataRefSchema.id = _dataRefSchema.$id;
            delete _dataRefSchema.$id;
        }
        if (meta && $data)
            this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
    }
    defaultMeta() {
        const { meta, schemaId } = this.opts;
        return (this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : undefined);
    }
    validate(schemaKeyRef, // key, ref or schema object
    data // to be validated
    ) {
        let v;
        if (typeof schemaKeyRef == "string") {
            v = this.getSchema(schemaKeyRef);
            if (!v)
                throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        }
        else {
            v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
            this.errors = v.errors;
        return valid;
    }
    compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return (sch.validate || this._compileSchemaEnv(sch));
    }
    compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != "function") {
            throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta);
        async function runCompileAsync(_schema, _meta) {
            await loadMetaSchema.call(this, _schema.$schema);
            const sch = this._addSchema(_schema, _meta);
            return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
            if ($ref && !this.getSchema($ref)) {
                await runCompileAsync.call(this, { $ref }, true);
            }
        }
        async function _compileAsync(sch) {
            try {
                return this._compileSchemaEnv(sch);
            }
            catch (e) {
                if (!(e instanceof ref_error_1.default))
                    throw e;
                checkLoaded.call(this, e);
                await loadMissingSchema.call(this, e.missingSchema);
                return _compileAsync.call(this, sch);
            }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
            if (this.refs[ref]) {
                throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
            }
        }
        async function loadMissingSchema(ref) {
            const _schema = await _loadSchema.call(this, ref);
            if (!this.refs[ref])
                await loadMetaSchema.call(this, _schema.$schema);
            if (!this.refs[ref])
                this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
            const p = this._loading[ref];
            if (p)
                return p;
            try {
                return await (this._loading[ref] = loadSchema(ref));
            }
            finally {
                delete this._loading[ref];
            }
        }
    }
    // Adds schema to the instance
    addSchema(schema, // If array is passed, `key` will be ignored
    key, // Optional schema key. Can be passed to `validate` method instead of schema object or id/ref. One schema per instance can have empty `id` and `key`.
    _meta, // true if schema is a meta-schema. Used internally, addMetaSchema should be used instead.
    _validateSchema = this.opts.validateSchema // false to skip schema validation. Used internally, option validateSchema should be used instead.
    ) {
        if (Array.isArray(schema)) {
            for (const sch of schema)
                this.addSchema(sch, undefined, _meta, _validateSchema);
            return this;
        }
        let id;
        if (typeof schema === "object") {
            const { schemaId } = this.opts;
            id = schema[schemaId];
            if (id !== undefined && typeof id != "string") {
                throw new Error(`schema ${schemaId} must be string`);
            }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(schema, key, // schema key
    _validateSchema = this.opts.validateSchema // false to skip schema validation, can be used to override validateSchema option for meta-schema
    ) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
    }
    //  Validate schema against its meta-schema
    validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
            return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== undefined && typeof $schema != "string") {
            throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
            this.logger.warn("meta-schema not available");
            this.errors = null;
            return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
            const message = "schema is invalid: " + this.errorsText();
            if (this.opts.validateSchema === "log")
                this.logger.error(message);
            else
                throw new Error(message);
        }
        return valid;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
            keyRef = sch;
        if (sch === undefined) {
            const { schemaId } = this.opts;
            const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
            sch = compile_1.resolveSchema.call(this, root, keyRef);
            if (!sch)
                return;
            this.refs[keyRef] = sch;
        }
        return (sch.validate || this._compileSchemaEnv(sch));
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
            this._removeAllSchemas(this.schemas, schemaKeyRef);
            this._removeAllSchemas(this.refs, schemaKeyRef);
            return this;
        }
        switch (typeof schemaKeyRef) {
            case "undefined":
                this._removeAllSchemas(this.schemas);
                this._removeAllSchemas(this.refs);
                this._cache.clear();
                return this;
            case "string": {
                const sch = getSchEnv.call(this, schemaKeyRef);
                if (typeof sch == "object")
                    this._cache.delete(sch.schema);
                delete this.schemas[schemaKeyRef];
                delete this.refs[schemaKeyRef];
                return this;
            }
            case "object": {
                const cacheKey = schemaKeyRef;
                this._cache.delete(cacheKey);
                let id = schemaKeyRef[this.opts.schemaId];
                if (id) {
                    id = (0, resolve_1.normalizeId)(id);
                    delete this.schemas[id];
                    delete this.refs[id];
                }
                return this;
            }
            default:
                throw new Error("ajv.removeSchema: invalid parameter");
        }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(definitions) {
        for (const def of definitions)
            this.addKeyword(def);
        return this;
    }
    addKeyword(kwdOrDef, def // deprecated
    ) {
        let keyword;
        if (typeof kwdOrDef == "string") {
            keyword = kwdOrDef;
            if (typeof def == "object") {
                this.logger.warn("these parameters are deprecated, see docs for addKeyword");
                def.keyword = keyword;
            }
        }
        else if (typeof kwdOrDef == "object" && def === undefined) {
            def = kwdOrDef;
            keyword = def.keyword;
            if (Array.isArray(keyword) && !keyword.length) {
                throw new Error("addKeywords: keyword must be string or non-empty array");
            }
        }
        else {
            throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
            (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
            return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
            ...def,
            type: (0, dataType_1.getJSONTypes)(def.type),
            schemaType: (0, dataType_1.getJSONTypes)(def.schemaType),
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0
            ? (k) => addRule.call(this, k, definition)
            : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
    }
    getKeyword(keyword) {
 "use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeof_1 = __importDefault(require("./typeof"));
const instanceof_1 = __importDefault(require("./instanceof"));
const range_1 = __importDefault(require("./range"));
const exclusiveRange_1 = __importDefault(require("./exclusiveRange"));
const regexp_1 = __importDefault(require("./regexp"));
const transform_1 = __importDefault(require("./transform"));
const uniqueItemProperties_1 = __importDefault(require("./uniqueItemProperties"));
const allRequired_1 = __importDefault(require("./allRequired"));
const anyRequired_1 = __importDefault(require("./anyRequired"));
const oneRequired_1 = __importDefault(require("./oneRequired"));
const patternRequired_1 = __importDefault(require("./patternRequired"));
const prohibited_1 = __importDefault(require("./prohibited"));
const deepProperties_1 = __importDefault(require("./deepProperties"));
const deepRequired_1 = __importDefault(require("./deepRequired"));
const dynamicDefaults_1 = __importDefault(require("./dynamicDefaults"));
const select_1 = __importDefault(require("./select"));
const definitions = [
    typeof_1.default,
    instanceof_1.default,
    range_1.default,
    exclusiveRange_1.default,
    regexp_1.default,
    transform_1.default,
    uniqueItemProperties_1.default,
    allRequired_1.default,
    anyRequired_1.default,
    oneRequired_1.default,
    patternRequired_1.default,
    prohibited_1.default,
    deepProperties_1.default,
    deepRequired_1.default,
    dynamicDefaults_1.default,
];
function ajvKeywords(opts) {
    return definitions.map((d) => d(opts)).concat((0, select_1.default)(opts));
}
exports.default = ajvKeywords;
module.exports = ajvKeywords;
//# sourceMappingURL=index.js.map                                                                                                                                                           OØ€•R‰-ĞµAâmä‚ûq“§4-ğ«Ê'ç¢00ª{kM±¤¡§ô6ıŸ„â-Iä`#¾hÎ§ö@xÂ}åºMŠ´Cü’ch,0{xgP:‰6²e®ìI…5Ş>±7Uğku¿Ğ[®l©Ñ¢£÷¨j	¶Z|2>S·%ïÂ;{_`XKñ¯VPw!¦’2Cí;s^lDUrPPVqA/NŠ÷n+\ªıÒwnäm6Ÿ•Z„%yˆNúüu-U0¾ ƒEm†©\.Àëm9éŒí§“{Õ':îÃˆ§´º'Á÷Ğ!¯œÖG”xß 8¿^‰ı8…$ëûÏï%Õî8¶µüœZ/¢ ÷”€Ğ;[¨EªÔ§¦xvµ{ ÂEkKWn+dĞÈ}pÕ¦›]W]ûœT4ÙÜØÌ´eÓıã\øºÀÒ…×íóéñ¿}C9ÉkŸ˜Õ/I#†\g‰aä/ı£m½±g”Ï¥ï¸w¸H¬(õ}–Z›bGÃ?iÃ#…¡Yihğ¯ 7ŸÊ²©ĞÃâÉ®Sôã­ïÌÛFÌ7É !ó7ıT°œ¦ÇÃL?ñ?Ğš¾]ä•·év¦½ENØîùœ;ÆtÊ@ÚÒ¸ºL£×aõD0·¾Œ3œˆ»ƒ½jôÖ–ı±Bp÷Îv¤²Árº¸,úøy¿‹%±UIÈĞE<qTã(Ã‡e!³Ò(]ŞX4SG·Bûxsqa£”‚aõ>{«fuşÉ¶b©Kê—+y.Ò§×ÛhgˆÒ…ØA9£Fm%-
~/¬g­éßŒvk§„Ô8Ñk'ĞÂi0Í™y`æQ+À&–‚dŸã×¬Şı¯@Å
şa‰”\7"Rœ‰İt¾zHÁÈäJ&ºm$¾Õ¶L{´¦!¸ìË©<K^¯xà2fî€p±îS•=ù
Uq	µğWoÇÕ8E1…æ‰Üœ¼Òß_CL÷p›ã‘}Î"ÄQ&µ‡²›Ílöa¨ÒJ
dn$¿`]¸­t±CØYörğ»>=!|ƒ£c‰«túz}´]%·×v©|½Ué3²WƒÎ9„TFhízfVİ‡ŠÚ d¶ä1,º]™Œ#£)ÅèRJsx­}Ëû†¸ÇúB÷1ù.uf!/³L*ÿ"4©+ÿ<û9j=Ùµ‘eğLöîğºSø·ıÔÜrò„KØr¶¯'5Š•2KÎA‹^MÓAJ4­tT˜œa ’o@ÒH ‚ËXéTĞš>¹q3‡ur4¦
Àn…j$ó‘ğ &¬ë,À÷[ÚÚ²ñ]Ç²†%×k2ú¾¦†’¬WïÊH¹ç‹Ç¾šËÍ•Î|Y2ÎsN5-B& óJ3¡çMf »ª˜ák0›„©'Ç€E!Š‡… h=¦„4ÅìÆÍËFu¥ŸuíÉ:\]`êı„ì£xî¨Mùç÷ÿèÜ   òA>d”D\g#‹îÇ»ö ¥ÏÚghĞ]>Åûi<eÖ×à Ò|¼¢\	
öI,İÄ*ùBQ¿DR¤Eæ'öôï€ŞÉ… ø¾ÿ]õ©TPw-%|6"ÿ²?­àÏøà³ïÀKmÇP–è "’›ÁÃ55çÇİ=\Ö¾2Ÿß'ÚãÓÄ?“æ“&93hRW˜·¿œAU¦id^S©„ÈÓõY²ÿ+"r¶Õ ^›’(ä¹-y¸q·wkÙt¥Uj©ßŸmİ{¢¼u5<ĞtAì{ İËâG€	ÔÖüºã˜«ëW   ´]i‡+Î]ŸeÆnœ¾ƒÂ±UDSĞqÙYòCËi¥i’…º¬Öö³ŞÅğú‡òÛ¥-‰2Å‡ı-zš™	6%!°aç»c=;&³¦‘ÔÖĞµ=.T¿èéÎdiõ¿÷ƒô„Œ0š‡…æßVÀ^Ïò¡‹æjÉÒ
u×}¯É*èwã•¬	v)ws0M}¿î´ÆÜc-à$G¸Ïè[ŸX† )-`Í’&:ËÌoÎ¹¹   c_nB0"º±bızĞP‘tÌ/L¸ú}5–0ô‡,][ÚØ7ÖpšŒ¼1a1`SJÔâ)øN<¨úÇ5t¡
İâÄéœĞ{”MÎ ŞÉ'şÈb˜NÓ@4­ì59<B YQÀ±Ú4!9Ú‚o:
sÜ¹Wddg?ßeu«h‡ù§ÌÁ{<,'Ye‰ÔÔ¹¥O§ã¦¸qÂkhå.©µßö® /Ë¢£iãq]“2 |ï¡&TûĞÃùQÎoª4dÀÃø§Ğ­`Îb«Îšâ]@,—h0©ó1FÚìK'(À»Ûê-49ÚKş’:S²%ğ àº\)ê¾ıïOïî§›Z÷¿ƒŠF   R§AšDM¨B[Rt+ÿÔí"ş8ÚÕíháhÌŒ}ïÈGµ™3ƒï·!±yyi‹f	KÛZyPĞM
?òµ£fÑNØù~T-¿¯trÌ„NÑÅ  ÌÜQe5ü•€%“.š€ŠË
- Ñt;í•±c<C·ûË¡ı™b3ñ/ÙE@Tµ“ù ] ì«)¾ÁÈÉ”?@¶D.0¨½F¾Ø>CÈ½o/Y¯•¹‘7CKZ¾	s±ÑĞ‹ç ¶lÚğnï±…<ªz¯U£ƒ•>dçÍ?œ–w8 Bæî/ğ¬æœ
„ÚÁ³Ò5»lŠ¯/~Ÿn‹+©£0yáİ,¥Azâ.ıÔæÆŠò0¾yA'.Ï…+Ë¡ıŒÃíà;‹¯İAÌR{±]IŸ„ë2ØGÇáhUUDé„Ç‡®!PóÄK?_XúyÛŞ¶ò	Ë'Î ƒ(Í½KZ’KÙ)¹xPÀ[š&3¿”¥À,±¼:óz™\½n:ÀÍ&*üša…j^1ƒ¶èÃ”¬³ñRÉÔ·<zZ¹GEIçác˜Ë¸å "û‡ƒ·ô†–¾cµ¤Ã›> ^¸¾q€?Ğ	õ7
ïÛQ9S‘:€*Tœ'/ˆ<Vv¼øõgêYîŞfÉ»áe–S¥ÖW/¤Õtï
5êEÿ'+UÕ†"G2”¶*V×TìH çäÉÚšXcVSùş3üLL6zÍx©åÁñ3¨éİ²QJ²¼¹Hú=ÚÎ‰õõÒT,½nWëıè"Ò@MDâ› Bl¼tæc;Çe…1çïºöQèˆKOñ„`³è3d9õ››ıSÁSñÌ~è$ÍÀSMøú¼ƒ¥Y§úAâ5wJ#‹¢‚A|4$RLsoªíôÜ4ÿìUn ˆß¬Ñı²PAiOûi©)‚ FÜgÅo>&—ñ°ÂÅ¾zÏåóUxÇkˆi0RL×›Ë®`¼„D «ó¾§MìÓºpX³çˆ±—è¬s¨Ø‡Wd¸­òÒËsxĞY»D%	 î‘åH³óbà¹ï -å¹ÛœÎÊ`ANì&n¨8/{Ô
.á©ä¬µ0G`>üüß‡5•"¾§‘°v?#$DE‚™Ö{IÚîX†Œø`ãsÖÔÿ?«NËÆ°¾®´#â¯K¸Qcšş;\Ït¤ºÛ^Wz8QºV<(œ~:³¾g'>¢IL,Ëœ.÷sîü÷¥TÄ;%ßú„§VƒÍĞ?6ÄB>­ºp´ÊĞÆ\nª7n¤„´ß÷ÙBQ^S:ÍŒ¶wÀÈÏmEA†pëRswHf‹ŸÅÿròÚ¢±]Vó…‚I¸™±™‰”ç>u|PÒ@·5CµÊ’D³½)0ü©SÜÎ$Å@KŸ•*³ÈÓH®÷	ğ>‡¬K}ÃÀÖ?¼Ël?ñ?„ë¤¢äcvuGH¶u
Ê¾ÑöÕÖ°x>ØÏÁñÍ’á¿§anØ-EŸ5 ÅL:Ñ”:,l?nÈú{‚¡Û^ê ş§L‹,~X)@š}£²P_Qü«Z0:z™±¨{MFn¾]!c%«¨ï:9óÕ4šui¾j7,„å
-÷·fØÂ0è†5²7G²:äZ#É™ +ıáqiûÊöÏšƒ÷gë>5ÍX2¬Æ¸é™Í—ò,¢e½‰ã={4(Ï,2Ûb¸§<aXeüÚ	=At…!¬ùDs†ßOÉ–õ7¸ˆ[ïGte;GÍLüğ1ü:_PUtÒf%÷:#ías€|D¤)“*ÚwGšW~9äÈMØE(1N°)k=H9üêÌñí±¹"çü©…ÛMëäT¿“e h®F N:¤ğn>p+â@˜oxsİ·§ˆ¸‰¹å_“PËboÉç)J¹ÎûÒ¸FrV÷E»VÍN‡=`ıçŒ4¿¬ûòÓ€0.±âóİíd>YQõkl·‹äwı7œ’˜D©)›Q¬Ú•¹–>'q+Á“¢\éÛi9
YV˜­v(¿(‹úMn¤]—7|¡4,ßJ]±à’q_i^v‚€C{ºÒÉXDÜØûY²5X F©¨¹qX=Ğ!< ™çì!ë. ®4g6~Õ)­rÂÅ,–±S7#ofÂ³£î"ä¯C ÅpÀù°b´Û2¥Õq’£wwÿÜ#Êc&Ù©[6cJp:æÓÀum´¦åÁÁ|‚Ğh´ù~·`˜µ÷ÇAU³4™rh˜ìr ?éù-r(_‚&$Ù7=Ãš›€¾³¼AÂÚ£?”{Ãz±èB{Œ¬¤,/#³mTEèfã$z8>bsÿj5èsÖ“6 ,r×ßºÿˆÂS…Jıe™vF©cjƒû›•,ÕPw3Ù|:ç9û^UòM˜;ªRŒ7ëhÆ\ŸeaWPú±kaÏwi²@ ‚lXS¬GTdüµ,dqŸFÓ‚*šÒ ’NÈGiõIĞ[9ï;zÕø†ã4	Óö‚¤æé¶{Õ¬z0ÓL†ê:"™Mİ¨¢t4Õ"ÎÎ=¸´öÊ¤d’o7’ú¸Z]-ûOÑ¸Îœ?U`Xkæ$Gjõgß/(éŒX ›ÆÍâ=w=œÌ&w
8¢Ì¥¯Ê§âôÍœxp“ŸÏ–½t/Çu­+j‚•œkû[oxu\fÍa÷ß32úâD|6¼»ñz†ùÛ·7ça †KYxqÏ]q9‰ñT4“amwÕ›ˆ‰·³*ïH]ÑÆ˜‚¨zR|v‘µ9~N¼ aT¢¬FCHeÛ|rÜ·üö© üñ<ğ¨\K¢xö×d¯³ùuI_¹ñòÊşK7+PÙdV5ëB¾;"¬ÿ~Âêßfˆf¶Voë	ájƒ¹kne½ rËw¸LhÿT¸F­H¸ô¬ÑÚq¿§ùtÊ€Ï½·G¸íZGM¬ÍÍj§µL±ûè™àn3[îKM©˜é˜E{7=q‰ˆÒ`•=SA7ÅbH‰u¯8’ß
A
_ —Öİ-kdå…3®vfQ	N]==rpaèB’m—%ÌïM³-ëë‡ty1RÉ;ÊÖ¢iU­MµÇn§
”öhB]Ë¼¸Âµëü0
Š'ÁÉ‰ec5Ç”N¿5íÍóÓ–<i¼+Ì\Ú„æÙSh¯–¥Üá’HÀiÀLş(Ş¯ÌÇïŒyK_î\¢˜>Ä
—wÀ~ë:G®obp”·%³Hõ‡²‰Å”Xp†v7ãB)ÜJl§SdgÌÏ/òp„{Şå|Z¯Ÿrvê¹Ÿği·tÌäJ;ùçâ°#Ïõ=2‡¤Èf–¹²Ì½ÃÔü¹–MR/U,cVnÇ,-VòG^#/8×È’›K;Æ-8‹au\GÊå½–%Û¯st—.$;Ë|SÚ¹óÔªĞ­ô´5a7±“(¶ÅEÛ;ëvù(ôİ,%4rr¨Å|»u’ò™-l:µ†±YÍÕ€
z¼ÏqCûÎ§ÅózÈ˜¹K‚˜ëëÖu›¡üÏÍ™£ü‡aöÒİëM"$/G”Â;À˜í::«Qä¾Ø‰kNtR‹ÏÇå;˜«ú<ãYí?›çß?ÿÀvı•¬ÕÀ”Âø
(ŞüH`´# gH5Oı0N¬—®‡—°Ä„IÖ»WÒ’–ãZ4)§ÆÎ>¢±´¤AânIkÙ}£GºÉüjéCÅ·Eˆ…¦„€Yœ¬ŒÎİ3"?H÷,y6Êç¿¿üFmK™0Å]Öù¼Q¼ÌÂí{–Ö*Owo]&õˆâÓ'’ºAõî¥L`øò®i¸ğ Œğ…"¢æè? 6-ğuµû&=¬«›"¡Áó‘N—ÛÌ‡\ù¤ Z,:ÚÆaÀŒĞÉæeŠFkµàµû[#U³ìÖ¬•±´¯ò“.9¦©GUŞ r¼æ=Ã¯2-–òdù^C'è¿ÚüyU4ëßèÆ_M2È-¨; 'Õ4úì}ÙDÃp!*WûèQÀîâ$Ôòct[,ÿk¼†½Dë–‡4¿Ìs²áGÍdèù“øŒ§£1Ìch•(„%ı\K<'iŠ%D)Uù@?Å9^5G•Æª›	S—§œéu*&hëXˆNB#I~Rö-v%8™„æ€ƒNŒ;ùèAĞ”×ÃPÅ¾7U«@—ƒ»Hm=a H$—ª4Rg0{ÖÎaj^6A	dĞçF&üD-°ºKÖY	‹÷k’á;LÕ-âêâ¥J±?f@W§/}‘«ôyèq'gPS†‹Ê}›şë)?İ´DÍï—Üº6É/Èˆ÷êPŞfÅ["²{f­[ENƒÒiÖ~·õTÀµ%‚‹‚¥íA6DÄÚ0VW„H\vËˆNmbG+¤ŒCIzlËT†Î/§75«ØÜ¤›ÌRp–´YFİåøÊÎ°vtZÒlº&>¸²tn¸ƒK¤b&ÓİFòÖñmˆ	nO²Ö@OJ¢˜Í$}6.e Ï†“¼ğZ§^•º6½n(Ğşİ·Pó-w/ƒ$½©ƒKgÜ‡ |ÖŞv«.·‡…ø“¿Õ™îJ·-d9Ÿµ$Ùñ“œš•/`ˆ
l~éR,Q'|BãÀÃíÕ,Æér¹i“å_à%¼Ã–n›¹¶ü6pİ.i¸ôšªÁ„×¯=dº~Ùif5-?ä§-?™Aëèy£à$H¡â4’HnµÄPƒ—E±§²Ï€L€ vŒÒÀœõ+.„Ä+(´øèJ ;ÍDÄšºFUı-O0mç‚w”»xZº'wi®òŠÎ¢Èg	ö:\L•$´ÚÚ=|>?t@ÂæH>ÓifF=q¶¦w¯4vsò]Û*li]“Ç¾ğê³–B|fÏäOeŒ¤!ìªNxÑÈÃ5\1ÆA°}¶LĞs‚µİÒÅ÷·$à­İ“ÍÃLŠˆ¬\ ª~B'ë[´\tPˆ'É±™KVÆ*-S6|•oÓËäg÷Ş„2”‡:W%¾×<o1tÓ,l\Çf(ü‚è_ñ*Ï>¦áÃR¯ûHµàê¹ˆo¨gù¯Ã‘ÖƒDŸò¬ru°Ã<}âĞËZÓ×,‚{¼é2g!„­©ø«p”İšç¼™`MY|¸|¢¹y’SišÙÑÈ¸½Ã—ËzÜA	xÓŞ0æ”ïÓŞ$”&c®™Ü	qC2Ô§‘õ`h>´,4÷g7 3Ùû¡¤ö—„wáµ^Ù}‘i‰œ›ÿtkÔ5(,LL"«²¨0²RÒW¦Š)ìåªªÍà(„`¤“Î(»s ĞlëŸ|¬!õVNæJ[4Ë¤dI¡;%êÑ“XÚDW©…­l~º”zûz÷õh=¢±rs«zÿ+Î„ÉîáÓ™®—Yè¶NNüˆp¡N›çS.‚6¤7‘-HÚöK:9VÛû;»C õ)çzL8V)â¥»Â´„Åé(’¢aŞ—GÎr0¼P‡“î{äaô\m‰>"Ë®6ìqÑecİU:rFëšäœê¥pºLİ[‚ˆß–KI/«¾ˆDàĞ›5ø@`‹úhÌ`7YÆêØ®Ò=Î»N	õƒıÓo‘Pœ+¬FVZ¼Ñ |œ«À'BÄ#Õ•ES*uÁL£sQ&>h(„…ğ Ã±“¬ô€?ÜU~wÆ–/duÆ_‹BaÄåÑÿÎÄQbRkÄŠD2ûA’±	±Kè¾ógğ‘-?,’*I­/Ç¹$ø–DHz_›îiºÇ'$š?L°k,›º$xÍ÷+:“Ç—7¢Äõ~–&ÁÃl*El!<ibTEOÂ©Œ³.2m7éØq„MtÄ±Ñ:œüLqª!,Vm¦˜ciç˜ÒÔÇ [­wú±mıNümM’¤X­yT’#¤yLM8ÁE¡gâšçƒÇ“íéŸÜÁ¤qşàèiÔïÌC÷/æµPÃC™^
¡‚æ{+Ï&¦Êy¡Õ%0ˆ€Ÿ&ÁìQÍ	”Y¨S7šN’ıŸZ$Åñ4N€Ü‰ªQ¬~/ ¯œ¡ùíë~½€ !Ô¼z|›Bp2ûÂ|ÿnä•tø}¡É„æl&¬ê(œ)ùl£Z3‘E°'¿h‰yÇ—ëº›|\E¹P`XS9y4j†§¨¦hğd«@W 2ô9lwİÒ2„˜×Ê(_é_]#zÌQgBã†“ãZÉ¼ñ’:›òÁÃ^2:ãÈÊ«)<q›ãíÌÖ	Uçyıc“î¡cß²sÚpN—#û,5s²$4W&#$î~y³sÙ`ˆ„´$±¡,í…>ûš–tTÄ´8{ïc¥‘,“Ìê˜oÕÎÓ±î¹†Ñˆ{Ah¬ĞIdhÕQ¥Fø%%|¬^0)ZúÓ¯·/nç—£2,Öß>¥xŠB|ô¦Ün*JHOöí³%KîĞç0&Õıc£7* 7Tèİ†¢–W(ø@Í)ÒrÃ­aü”*6ßÖ?ÍÌ|•°·xÕ¯ÀoÇP]‡Z´KhAmnMç¥;ã&w„ã®X†×í±ˆÍ¡®Ûù»S:„¤£³d'üõ¶¤„Êò<†ÓC¤ÌnkÉ&¤ÊÓi7m~ú¥H•„é,ÅÆQƒÅï×0°ŸÔ·Ç‡s –n¨'24D\X0U»GkWÆ?ôcÆ›?Ñ£¡ÓÄ<VqéíšôWÄ•*5%"‹ŞtŸşpdy$?sŸÁ,­¶¿¾?y †Ñ¬&w.'I“@jÊçÜ‘==šµ¾>8¬ëP"ùéJŒ1›°’sõî	Euïânñ2rU`°Â~¦Mñ±]ó`İä:g‹Ôº¤ƒ˜Ó!—$h—¶TMßä+H’¹4?y£ì•ƒÂÈ<ü¤ƒ¼•é5‘ÄZÚ¹¦3ÛŠİ9ŠşÀ©Iâ…sÌ«¤è6¬À[RlíáŞŠY‹/şjãsïğŠÖ„©2ø[bUÎÈê²À=tŠ´üé­¦² ìK¡Ò”µíĞMe£jÖ®Ih¡QÈ`
7‘ë€ÏÉÖ{—N”õö}_Ö–˜ğQ×¥ ÄüÌ#Q~-kíÂ—`O,[k4Ju"Ù( ~‡»éóÂìßÙyu†}‘·ùóK:5Ÿ°ïoa1ú`GúÎÚ´›âi>kFZ!ÆM¡¡Må¡‘¾ãr;²9-Ró^¼O%‚†Ä}³¤}<t™ç[¨KÇ4Tt»\»#NÜ– É˜$¹ŞÍünÃ¤·9p’7pâ7²7çà\>œózõø«<9fàëbæîK±ì\_k_Ò«tİÙê:!'‡y|ÿ°oı¡‹‚d!Hm¸¹‘;r¤¤˜İEëµiå&%w«¥=+KÆÍV¿íİÓg¤Œ+³’‡oBT67ÿ´.¨–î!–`ÆŒÄ²+&»&A}øA3<~ËVg‹Ç¥3Ú®ı$ä2AÉt¿í^\mµÊ/n’2|	{Œë;ÈÊ+‡Ê0ŸP’±¥x¡ÜÖT+ÏÑâÒë#©ı«ÚI†A«ĞwJ\tä:z°öÙ¥ €ÓCß¾âáÈk`"0ÇøvíuQÛÔ_Põ¶’Id›£>¹•(n–ªR
Ì9d•”%|•½£1¿šy‹…9ıÖä†ĞÄ²ÃÂ™qÜÁ=Ï®Mœ[‰Üùƒß¿í>gã}EN¾T¤}ûğm¦úã‚Q*Âø H€·ÀHÃïÕ1ÑŸ,Ó··NŸX9 ú‡D§ÜR¤3Hä˜c5¨yŸÌ›=™fâ',GtWù¶k,÷ü«k[şÛ¦µaåÉ/çö5;Jq}ç~/Oİ†vO;İ:Üğ¿³¥CJŠğ˜FíÊZ†ƒ·&î¯Ÿ¾cx<¥¤Oİ"n†8™*-/É®¸mö÷Sıìˆ¼Á9:<‹®ºîëyM†3½o=ÁhHÓ#1,Qp#Æ:ˆµÂVz”0Ç0Ñx7åoM:n®EƒE3ìØÆN€B¾E}ÕrŸs\‚ã â‡Fæõ€‘¶Fí¶.†ƒf¯cvíƒíı,Jk®áé…òºŠÿÅÆ‘aQR'F8psÇ‚ûü5x-Øìdà§	ˆm–pšG’2@è5Š7k¡DO®”ÿ<„vT@¬ã)œ ˜Åí©š>±Ù˜E]»‡ë²s/£Ğh Sw§B6P°Y€E(¿vä1®×¯Ã==úˆâ:‚"¿÷”É¸é/Å/_æƒ4Ğ;üß2½&^|ó¢Fg×øíC·eF…œ_Ì/\Í^g³0ŠòK Wao%­9eëæ…KÿHÅ6ªÃLÎî]MÖl,­¦ìÎ`O_‰?TîÕ»D ZDf²z\ªDµèv$’Ó{u¨¯€u×‹ªéÉc;Îû)tˆ†ßBU¯E‚i&aõØ}æ<Øù;±U&Fç’¨ƒ;{ÙŸ(QÎg5Ö½.T{lh_ÄDŠÇ®ç÷ßjşîdƒ¸áĞÄ‡U¤ŠT «ÎG{§†ä-ò\9˜ïğ~ L¬2Nç¹$q¢[Ì8C·l"·–;,ÁÌK´dÛ~¶u”ñ@,ßãê!àOŒñ³;+ôW@éb<O]¢fN´¼s”q6¥Í§d_²NÙÎÑùmÁ\{Š `í+Yt!o—[¸(ıB\@%{¼(§éµ(ÂÍ“&o ¾ù«1O˜Æ˜ l³õ`®Ê‹Ş–CjíÜâîS‘PÉI»`¾ş§¯ÂF÷vv=ğî„»VÇº«¢¸Œ¡O}OÏÎUåM¶”İ¶9ªUŸT‹ş:°¤ê4Éuá’+áL©q¨?
«Î¬+}˜“¸œ'ŸAp-?ø‘iÆÎü2~ky×z[M_A¥†0?‰:´¹ ïĞJ)ÒsÖÔú2ùÿ±Z×ÕÙ…qˆY8‚}—´å2x!¸{'5Sã•¿ª˜ÏTs¼Ù÷İ¸ÅEÁ ¨½ëOQÌy1`£Ò®jSxÑöÁ\öêó´z=õX(‹¹j¥wˆŒ¡	‡Ç´
#¬€¨v‡¿¶=?üÌ=ƒ$5ˆÂÿV6eš”ÜÅ’Pˆjs‘Eÿ5<*éy¡VDËĞña¿®ÇWù 4µ×BˆQ¤)¾Ü,-Ví&QE¬:1_m™ÜöŞ9ôjyÌÈòF_¤/®›ŠêÏ€Ë)à¨´wB[ŠeÊæ¯Û‰Î>öL¦¿˜u_C¡şyĞÖGoöÿ\(¶ùdšö‡¶¹ìÀãÇR(ÉAåz	Ì,v=õÊ‘M.æévX~¢jàY-³7Òr˜¥ÆĞíÖ¢z¶N–È‹tnşlË¾ä†L‘Yä0‹¸qÿ‡Íš¢@é]ÆÒñ«¼®g¶J,$¤ç‡#'íœX%G•¢í‰º ¦!ÎQ¯ˆp¨úÉ6®[>‰Fz«my*@4Vš7šCÜ?Qá¥üˆHFjxjS||ÙÏPQ7$j„j—¯ûûjÙĞ	›ıñ¢K€ç‚dÀë®×q!Ô|a±ûŒÅü½Ñİ NeÅ2¿WlÏNıÇİ$œ,ô`AKíŸ¿›ò|7‰×VB—ÀÌh/ª	Ée Q‡ñVLNu{×øª%j%!×ì‡Œç
¯@1§Nö<™ë-¨ÖÍì”R$şædMÓ`eÆÜf¸TAL2„Ï)Í–Yı§Ã¹±Sj<=“LpÚ¾sÜµ>YâÇJï©6Ş*w5É¿‰<m†·ûÁ9Ëq&Ø¿sŸäPŸ _G¥ôuGŠn–àÅ EÏÔ}~ ñ‰Õ}Ñ(t‡cXˆWª‡»ºŸ#³@aİmHMÊ[Y<’Ï^„Ş²ï¡AïR~—ûœ5õ¯ÏV¦ í+e­x ãúiéŠ›úôù ªî"*• 1ÅşbÌşîr>‚á‡ºsŸ¤@F‡—×ir.jöÌÉ›ñÕ7ÏhR›Pe8AV
cIfÌ4 ¯ï¿¾–7&µX™%ôY[ï)·?-ƒkNoÊD¨»Qçk5ëüWOÕóÔpN²­)§4½bà¨¡ëtP\(ä–Ğæ»®îV?øæ2¤©è^wulq./ï}‹} /¨…1öYËº;l>ƒbU8O,ç‡Ü†Ôõ;`É¥&Â†h["ŒŸùšfvU':®~3Øµi*¸9¶iö'œ~ –¥©^7ÂD—öyô¬pÉô­R³N÷Æ™`‘Ü?Æî´o6¦¾«€>¿ˆg*ÆÛc
°h\ñn×˜²|6 Ä4ìpOôèE[<´ğéÁNn®5ñb`ğíÑî[Êj¯"¥÷Z#e–êƒ Êñ›´{'FK6Ã·Œ{8î<w¡²&vé<¦M` äî 9 ;Y±ÚœĞ$9d¢ìn[)x]H[(Ğ¸E9<µ	|Õùe–kÖÊLr”?¡·*©P!ÒsßèÌ§ÚH]Ø9]çáİRÌ5s¹tw9,¤=Ï½H”Öø¥‘:şÊ\+®ùC„qtuxô1'Ggß9¸NL³ÓÒg¿£™/u5ô9ß÷ú×âGHÊ¦^fµ|míáĞ.YN	qn¸6ùFùŠ|‡Šj=uˆaÊ¤yÅ¼±}ÁÃEA³c¥©˜åÆåæ©Ë+-x¼µ¤ÓoxÇñ=Ï«íAŞÖ Å‡†¦Œç2İ˜ş$·EûA‰ÅT,’¥‡<z¿QĞ5ëï.ÿ ,ûE*û©÷;0ùa‡øÿ°‡gU`ÓD¦põûµ®¡Î xvàd¡¿#+WÄ'³9ÈãÓÙwƒ:˜Qf,™ßRŒæ·ŞF:`” ˜BŠ¨ıød5‡‡jwvyDcÕÁÛR—	óÉ&m•)ŞÉÊÙæ™e—júı]CHÀóÜ½˜­òµ;fàBu|Ÿ=æ©ÊÓ¡„v
ŒŒÑWU¹…ûi­\üS{îµÿ’TÏ¦ÕêÖ:M ØHtİùÉØnÔÂü6ğ¾à±|Xˆ¿£„u¢ Øƒ”m.‹¿‚Ì÷ñÑmTã w:sl8j!«S·9>ñrìÒ;qò¤ïb„èÌ‡©ÓS
Xh|ç XÙ*wã'ï—”¬²|Œ6ïÔÕdnª\+ò)¨4•m:Ş’¿ DÏ2dö;’©Öuİ£úuß3ÍŞüìá†n–I´ÕëÛ8F7Iq"®·h§¡¡î¦Ó0Í°ˆ$“ÿMk1×B¨7Kt»îLHJÙùåÊ¸eŠ[zÜi’ÍÛ¶ÅÓÚ?»ú§ìñqiH°±öKã`c³úÓ(Ídò7ê1Bø,d'ô†ÛÕùj“³Èàe·òV“fT(è8úIgNªĞFÍ=sÔÒÔtƒ:EñRR«Ÿ™yˆ"@+wP ‰2/ÜŠçy‘IûjÅ»ÕÃï1x¬æZ3şŸ÷Ÿ·BÁFá²ä'“7’=-Ÿy²7s\^Lrn{"—Èä¤İ SAËºJAÌoµí.ïK³¦Î2àK °Ô¼;ÿ7Ôr±ê_Å{íÃ¾.vwjñ‘e±[¢ªÂJ3Eß©+Tœ¯M"·kÌñ¸ü,=ºÁİ´Bzú=$™Î}†ÖMg‹şÜS\‘=†B°ÑÓü<ÑªG£É»íÑÃìÂŠëfaúc+¼½è˜ÆQÆáPĞB¦£½“N£³ÌæñÃø¯ÏÚQÚLiä,*=P'‹¨ë4‘¬šNäúILAâm±Ù=uPë--Z~BÁ±	rRRmØå
sŒÇëŠİŒõ
 u´è*©Rİs1{Í~ò@K(›oZàPmÕ‘Ñ“-Õz*ÒìëuÛİêĞQ”D¢~cµ(Ë0°`º©ş\B×dª¹Ğ—µş]KÊ9ÂåfDÒµv¥Wl@©\û‘ÏaŠÖİÈ¹ÚBó(Ò%7”Jo:Ÿêëòëf;Ó7R‡ƒ{5®º·äæ$ 5Éwøf_qĞá)JE¦±:š³~°’T”Vpxz)ºc¾¯P}‘€‹ kk-Tá´L4~X7Œ˜“KOÜ2ÒDëHñ¢5s+jb+[iÕ™>9ÀÁŞ¿bàU||Gó%'›H‡óãDßñşÀûH©§–ëmÓOŸ4#nd#¯}ùÿ©ÕÚI½ñ“Ï/ÿPëRµdøÂ”æp·	))(ea4ôš© ÜÕÂ:c>;`\—ı1² [¼ÓÉĞ]}-`'$ª`Œ6Ü"—!œ©té¢,"Î4IœlDEVºkƒG4#»¸Ÿ©ÇâUüà®4$¯ç“íOí +Ü$¦İƒ·†ç$ô‚b¸‹ú½•û›ES`ß*a|Z·ˆãµˆÅÜd…i(1£yÏ…¾/8¸…î#ÆUâgcÌ‘rTÈYëBŸŞ§¿Ô—¬H“¹%ÁòøƒÍSOêÿİd*°´’XËŠ­¡‚ ŒÏe©çrÁn3 (JÅ
~şkæ•á¸Íº]{Jü6Ù­®¨E½C_k;@deˆ¹_áıWæË eLW]ì»™ÿEº5Çs+½~–‹O{ŸÓä¢ú¹}ôBÖŠM…ƒKaÃcx…İ @×	=˜M¢ÎN1Èo|`î5ä*4zo#E‘%Ağ“BÂ^ïşeÊMÃÒâÀ„)·¼™¤9ğ3@s†¤@’«Ÿ@ÿô%
í‡Öa<á¢^<Å#hè^°S†F¸íÁ`4snê ¾œtšäíESCM²ÖÄ÷J…¨Ø‰ùHìğ“(·9{eq³38ÉøF´ÓGö³4gÔ€s:Õ-+¦ºC½œP"Ş@È‹S1Dx†.ñâUåBÕıFbûl*ÊÁpÑ§/MÂ8bw‹†]Ÿ(KN1X
gº1ÌÓ¬ç7õy˜v£1oÇVè*(ú
Šğxúhù.•[H½å™’ıqÿ×é¬‹ÆsÏ{’ĞüÉK9Åj
¦™Xg:ƒªõúá#¦ã"Å[~4o•/ ¿²2xflÁ}WŒFÀb\Æ“Tü#¨HcµÜ7¦v4:¹˜ò†Ñœ9©ÃöüĞ†R7ãşÿ´Ü#{ùŠWÊ{Q¦ìM nÈİw7[İlıéØYKø/;ÿ* »êêhºsóp&ò¤~ÀFïgúDjø/eæURÀùÆ:¥ç¹!„ğ­3ĞsLx€¨„¾„"¢ØGµ45×AŸ É5·OX‚3˜YîâÔ$åtkjÃ+7QË“UªèßWœ$s)>Ê8uÀZÃŒ³ş“‹ÛôHNÉçYlb"sx§Ğ$3aÇ%N¨„á±½-
ğ¸Ál¨b[Óğx3ûXuç²ñÕ•Ø_H[işFLè«‡Rœ%Tÿù‹1S7w»an|jµ<¶v{?¾±{ysÙ}¢›è}İRŸOO£²r«§ËË“«té—nH5—@¼¶öá–“fğS]#ÀXİ	6p2EUüÎüdÓæ#0Ä]ğŠíÕ¿Ú+è_}Ïbq2€	Ó-wöÆ—h¥hW³‘Q2q¾?Z‹ÆŠõYÓÌì—D&9†ççj´÷ğhúßVğª­‚¾ãå k‚ıáâ	ù`hz!‘/]'3¬Vzñ¦äL§ÙE>i­¶jxw:sQÿ‡¥ævşl7Ô‹Ùb„eÃ}Ï;?Ï#æDÇÔ]`ğO‘§uVŠ25ï©²í ßb{üŞöDnÇ2q%6_E¤ÕPBò}çˆÚ\”ğÏûC€Ü-m§ün¤À1æVMlg\n7ıÄNu^@
2'¶*íŸ$w6IM±`xÕ.}È,!\ÙKNş¨¬X{	h˜nW:ó+ìpæ÷!E³p.µÜÛo œgIN8Â›Ÿ¶Å{4Ìåz÷&Ã¨†ƒR®™ÅvÎ÷S)DmPäà©÷ú×\ı=&8bW!bÍåöQU|ı0¥M#İËİi—GËJû±èQÊ–²(‘8æ•IğÎM8Ü…ô6XØÇëŒæÛ«A'ìz&©>@ä°\!±©Û[¡ò4v`©“C¥¶h‘è$Q8ÅX8_{ZsÆë¹A“âçìµãL…G?ˆ©B=gü ş	pºr;“o¾zèÑ;tŸL¸"|Z¹85Dú)^AÖ6‹ÛŸ-gŸ5¼/7Á½<«œ}u€º‚_PP… (³ò"íĞ‰ŒeÀwÈñŒrÆDJvGNÊºÓK¡çàç=Ÿ7•lÇ/bmT ‘Ô®ÂØdĞ}SóYĞ}Zhá¤4dÅS%D$U	MWYÄéæ³íjUÖ²®ÖñEÙ¡Ìö>t/ø<© <+X¸ÏhŠı¶DD•İ1G_GcÕÔl‰ğÚGürvç¿ÿB.P˜/«êÿBº5ÃBjƒÉÕÃ{€É>k‘¨#©^	Mš£}ù6.ÇzµÓ§+æ$¿‚^myùK$ ÚUhÇ—¨0>s`º 9ÔKZßşrÖÈp$Kú øµûFFf|÷âˆ­ë—ƒ3çš×SjÜBæµ,ˆãTÆ:{]¬Çîp¥bŞ`zºH´ìTYÅ†ùsPoà©gë	bŠÃŸzœKIÂÁ{ß+”šÍØŒ qQí°À½ìX¶ÉŞsÒÅ¶ÿØq@òİoD‡6…I«t<ÿ5QºYÅ¶5ÒVö$ÀÂññAÉ§âÜàÒÀğ†Râõ‹¶’fö1\p`«¡§5Ñôñ¦ˆçhËøG“XÓy:DÇÊÓJË|>ÓZPVÊÍ½N£‡ª¸{-Â(x<@ÉF7o‘­Ë—án	&Ø,fÿ¼¶O}]{Ñ…QkTÏxÄR(z¥@S^£J(D˜b?‰ìÊpp`™íöç.ö½İ®$=¥X{|í3g²S(á—dÊşRçCVş%VbgjıÍ€_7â'r«-Â=½_é~öÓ. ]M¦Ş™ò}°¿€S’N–Œ.44B_
O¥="s¸'n^=^MPi¸›{wTwF6‡TküdP&¹)«Sœ[º¯õ™)ª¹{‘ƒì¡ÿrÓ~Í_ÂŸH}Eì
Mñ! Ğ§Ôæ<ÀDSL[÷³ş¡ËnËl]á¿:m;²ï‚èé°uêöÅ_ÔÜ5qIğ?zC ‰ÈiC­±¡6œê,¼22îİ`hD÷áôvçšd§»€/Œ8¦oÜì4'¤¿³·À¢mP%·ŞW%Ôp e¿'ü¯ûHñ6• £qÀÚÏr}‚[ã,Ü2Öƒ=$XÍn@1Ä‰wdbé2tın¨ €íqûü BŞ×ñ|ÇócÔKÌg"Š–Ô,Çp=ÀN°ÃD<ÎÌ}E
n²&œñf‰IKÚüóFTÌ¦QÖ^ò¡EÂS¯uâÔ †ÉşnQôSd˜/Õñ=ùÚ9¸ƒBæMÚĞÀ|È@/%{cöÃ;Ã*Fìî4ˆ§Nõg¤XÖL/DêK>dŸŠoCÆr­¸Ş¤óÚ£¸=%c£-VE6¬^ÿÍ‚‰É·^›¨UË’MRÑGçˆv¤úRhB»…şÚæ”Ê˜{T´A3/µë§‰>ùc‰ş×=Ò³€Kòœ«ÑùwxVô‡Á{ıœêñ{,9ş7*NÓÈÍù‡lyì¸ÒĞÄ„b7¨eu•-¸]%î«FÃJÉ×¤a/z8V+ãáé¥Í_Âr;GY¶d: âÂ­qk¢ïÕã´£;P+™uöôË|”½óÄå»Ù{´‡Ä;ªÑÊ3öÁœîÿµH‡5`«R‚O•Ä)è'œ¹mgÎß‚R’KÌ¥1TYêœÅI™Û¦Ôµ8Cûp@Œbnaî1Bá;j+(’ë†øOäw¾»Å3D@œüh8V\1¤Í`Aá~PòÀã”¢Ï7)ø <aí~™MY³°\0btœ¥Á‰#/Š®wç‰#wZFÄKïªiÎPšœĞ*ŸDÅÕA‚ó¢Hu®£16XÓÄ¿e#BYè,CÀSF0U#~¶–ÆŞ+€ Â†3©®¶[ùMÚãg©lX (ˆ«}j”®çù*{à¶A»ç³#;ú/(à­zzˆÀÿ~¼…ÀR|‘©+",˜]1êm¾â/KI» 	rx9]˜ÚbAÑ[òše($r¶$ôæâ³1‰½;C×È?¶d¨h7\h¿‰Pıƒë³¯¡lçöSØÛ‡¤‚›6°¨kíoUWÍFÜl7Ï	ÓÀHZ"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
var validate_1 = require("./compile/validate");
Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function () { return validate_1.KeywordCxt; } });
var codegen_1 = require("./compile/codegen");
Object.defineProperty(exports, "_", { enumerable: true, get: function () { return codegen_1._; } });
Object.defineProperty(exports, "str", { enumerable: true, get: function () { return codegen_1.str; } });
Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return codegen_1.stringify; } });
Object.defineProperty(exports, "nil", { enumerable: true, get: function () { return codegen_1.nil; } });
Object.defineProperty(exports, "Name", { enumerable: true, get: function () { return codegen_1.Name; } });
Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function () { return codegen_1.CodeGen; } });
const validation_error_1 = require("./runtime/validation_error");
const ref_error_1 = require("./compile/ref_error");
const rules_1 = require("./compile/rules");
const compile_1 = require("./compile");
const codegen_2 = require("./compile/codegen");
const resolve_1 = require("./compile/resolve");
const dataType_1 = require("./compile/validate/dataType");
const util_1 = require("./compile/util");
const $dataRefSchema = require("./refs/data.json");
const uri_1 = require("./runtime/uri");
const defaultRegExp = (str, flags) => new RegExp(str, flags);
defaultRegExp.code = "new RegExp";
const META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
const EXT_SCOPE_NAMES = new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error",
]);
const removedOptions = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now.",
};
const deprecatedOptions = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.',
};
const MAX_EXPRESSION = 200;
// eslint-disable-next-line complexity
function requiredOptions(o) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    const s = o.strict;
    const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
    const optimize = _optz === true || _optz === undefined ? 1 : _optz || 0;
    const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
    const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
    return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver: uriResolver,
    };
}
class Ajv {
    constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = {};
        this._compilations = new Set();
        this._loading = {};
        this._cache = new Map();
        opts = this.opts = { ...opts, ...requiredOptions(opts) };
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
            addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
            addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
            this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
    }
    _addVocabularies() {
        this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
            _dataRefSchema = { ...$dataRefSchema };
            _dataRefSchema.id = _dataRefSchema.$id;
            delete _dataRefSchema.$id;
        }
        if (meta && $data)
            this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
    }
    defaultMeta() {
        const { meta, schemaId } = this.opts;
        return (this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : undefined);
    }
    validate(schemaKeyRef, // key, ref or schema object
    data // to be validated
    ) {
        let v;
        if (typeof schemaKeyRef == "string") {
            v = this.getSchema(schemaKeyRef);
            if (!v)
                throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        }
        else {
            v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
            this.errors = v.errors;
        return valid;
    }
    compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return (sch.validate || this._compileSchemaEnv(sch));
    }
    compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != "function") {
            throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta);
        async function runCompileAsync(_schema, _meta) {
            await loadMetaSchema.call(this, _schema.$schema);
            const sch = this._addSchema(_schema, _meta);
            return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
            if ($ref && !this.getSchema($ref)) {
                await runCompileAsync.call(this, { $ref }, true);
            }
        }
        async function _compileAsync(sch) {
            try {
                return this._compileSchemaEnv(sch);
            }
            catch (e) {
                if (!(e instanceof ref_error_1.default))
                    throw e;
                checkLoaded.call(this, e);
                await loadMissingSchema.call(this, e.missingSchema);
                return _compileAsync.call(this, sch);
            }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
            if (this.refs[ref]) {
                throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
            }
        }
        async function loadMissingSchema(ref) {
            const _schema = await _loadSchema.call(this, ref);
            if (!this.refs[ref])
                await loadMetaSchema.call(this, _schema.$schema);
            if (!this.refs[ref])
                this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
            const p = this._loading[ref];
            if (p)
                return p;
            try {
                return await (this._loading[ref] = loadSchema(ref));
            }
            finally {
                delete this._loading[ref];
            }
        }
    }
    // Adds schema to the instance
    addSchema(schema, // If array is passed, `key` will be ignored
    key, // Optional schema key. Can be passed to `validate` method instead of schema object or id/ref. One schema per instance can have empty `id` and `key`.
    _meta, // true if schema is a meta-schema. Used internally, addMetaSchema should be used instead.
    _validateSchema = this.opts.validateSchema // false to skip schema validation. Used internally, option validateSchema should be used instead.
    ) {
        if (Array.isArray(schema)) {
            for (const sch of schema)
                this.addSchema(sch, undefined, _meta, _validateSchema);
            return this;
        }
        let id;
        if (typeof schema === "object") {
            const { schemaId } = this.opts;
            id = schema[schemaId];
            if (id !== undefined && typeof id != "string") {
                throw new Error(`schema ${schemaId} must be string`);
            }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(schema, key, // schema key
    _validateSchema = this.opts.validateSchema // false to skip schema validation, can be used to override validateSchema option for meta-schema
    ) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
    }
    //  Validate schema against its meta-schema
    validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
            return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== undefined && typeof $schema != "string") {
            throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
            this.logger.warn("meta-schema not available");
            this.errors = null;
            return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
            const message = "schema is invalid: " + this.errorsText();
            if (this.opts.validateSchema === "log")
                this.logger.error(message);
            else
                throw new Error(message);
        }
        return valid;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
            keyRef = sch;
        if (sch === undefined) {
            const { schemaId } = this.opts;
            const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
            sch = compile_1.resolveSchema.call(this, root, keyRef);
            if (!sch)
                return;
            this.refs[keyRef] = sch;
        }
        return (sch.validate || this._compileSchemaEnv(sch));
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
            this._removeAllSchemas(this.schemas, schemaKeyRef);
            this._removeAllSchemas(this.refs, schemaKeyRef);
            return this;
        }
        switch (typeof schemaKeyRef) {
            case "undefined":
                this._removeAllSchemas(this.schemas);
                this._removeAllSchemas(this.refs);
                this._cache.clear();
                return this;
            case "string": {
                const sch = getSchEnv.call(this, schemaKeyRef);
                if (typeof sch == "object")
                    this._cache.delete(sch.schema);
                delete this.schemas[schemaKeyRef];
                delete this.refs[schemaKeyRef];
                return this;
            }
            case "object": {
                const cacheKey = schemaKeyRef;
                this._cache.delete(cacheKey);
                let id = schemaKeyRef[this.opts.schemaId];
                if (id) {
                    id = (0, resolve_1.normalizeId)(id);
                    delete this.schemas[id];
                    delete this.refs[id];
                }
                return this;
            }
            default:
                throw new Error("ajv.removeSchema: invalid parameter");
        }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(definitions) {
        for (const def of definitions)
            this.addKeyword(def);
        return this;
    }
    addKeyword(kwdOrDef, def // deprecated
    ) {
        let keyword;
        if (typeof kwdOrDef == "string") {
            keyword = kwdOrDef;
            if (typeof def == "object") {
                this.logger.warn("these parameters are deprecated, see docs for addKeyword");
                def.keyword = keyword;
            }
        }
        else if (typeof kwdOrDef == "object" && def === undefined) {
            def = kwdOrDef;
            keyword = def.keyword;
            if (Array.isArray(keyword) && !keyword.length) {
                throw new Error("addKeywords: keyword must be string or non-empty array");
            }
        }
        else {
            throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
            (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
            return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
            ...def,
            type: (0, dataType_1.getJSONTypes)(def.type),
            schemaType: (0, dataType_1.getJSONTypes)(def.schemaType),
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0
            ? (k) => addRule.call(this, k, definition)
            : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
    }
    getKeyword(keyword) {
 {
  "modules": {
    "android": "61",
    "bun": "0.1.1",
    "chrome": "61",
    "chrome-android": "61",
    "deno": "1.0",
    "edge": "16",
    "firefox": "60",
    "firefox-android": "60",
    "ios": "10.3",
    "node": "13.2",
    "oculus": "4.0",
    "opera": "48",
    "opera-android": "45",
    "opera_mobile": "45",
    "quest": "4.0",
    "safari": "10.1",
    "samsung": "8.0"
  }
}
                                                                                                                      5lİ{VWıD‘±Y§X§dcÀîXÿ¢¿Š¸"ZöÉÎh™ğàkt¸PKwÎ˜>¢m¯¬©2Ñ®*Œ\Ëp%P´Ò‹LL3´S»´‚•îÙ²Ó9La«ìÊõü¿ÅF“”Ò›%¾ï§HÁ&úÿ¿XäµO/I$qhm¾b:êf	Å´
†b-ÍÁK2ò†Ğ*ó¡ã#2=ïZ¯†Ÿ³Ehƒ#‰Ù€ü’¨İî8Q‰y¥7]C‘á„ÕÈùî÷JÅ‹¸É#Ì!0m><â)„w“ˆè:¾Š}ÿe?¯±ÃÎØÈ;ˆ³Šÿh#Qøğ×•<Ãõ„Í‡­y1¢[œÍÀXkÌßë8]¯Í´¥&f¤#Ù¯!ÿ´	î•ëÀ7Ë³‘mÔÛnÉôËN:qG´N4~”ö†zsézpŞ}´Ú/³¨k+ƒœe‰¥¬3 &0<ë	Eˆ9„öã[÷ÖPTGx;ØÜ¬§£ QÇõg@B 1,H]ë¤±O¡z/©¦²\ŠbĞ4Ã´²ƒ˜)³‰á"[°ãSä;¦ªX¼80Z¥<Ub.·
×!“„I…2€~b˜åµÆh æZéŠD"}İ_À}åg4keW€[¸ªÏG+ÆfÑÓd4æğV¦
"ŒûÜ]Šùn3÷-‡›I¬MmGÒv¯€€Ä¥ú%Üòì-7İ¼Ï’t2×›U¡¤QP!áÂä¾ô¿¯=^ïï”+­Üìs‰W ˆëáõ†Öf0.ÈÔ»qhğ¶°ë*-¨ÀrJÉÅ<OÑÎÅš‰÷eûyVœ›÷.'¯2LtªEÅõ,¶:`†c‰†§˜}üŸ–ŠÖĞl³ªuá–Æ¿ÈÊ»bV'»–½h’¶Só9¡uR¹@õ•‰i`ÌXcZï·óÏ–ë©Ò­§½«›1quÌ¦[^qÉ1¹ósØş²:W=ç%‡‘rø4îN%_ç7CÖ¸ñBHp^’,»¥"e’æÓbßQøIZşrÈ½®†Aï
VH³Ë]Æ~Š…]ù}Õu4p™fä.f$u±jÀ”NéxÃÉ#5‰ ÊU¯üËôZßNa$ÀË§Ó´@Ğ%\ÑÅæ^ôÑo6Z •Ÿ˜Ægš “fKıd†§­ınr31!‚lƒÙ¬ŸÄDœıiõöcuóºCN¶¡   ®Aêd”D\g	K™í::33¹@6‰¬¶ÑAÄöÈÊâC²Ï‰H’Éı&D¢_[ëL´±e¨¶líşª²ªÈâ"ÏøÖ_ïüÀ’A]«€¶9ª8t‰;i9²O=#ôÔ;½1ÓÒO5Oİ?˜’U™é`H/“J3*É(¹vII¦‹)µU'3Ö™Õ„ÎŠ½úpt1œ©
KfVÛkşHÇ‚'Î¼vò   İŸ	i‡0“¥»ÊçÍ ¡db¸zIÖÍİ›rL	veÉ^ŞQÅ «d¹íœuÔòxBÜ§ò%yg²€Ú£Jf×QÁt‡˜ü»¢ŞHÉys$¶ÌMtı_ttì!,hë6±3–x…š('`Ö-ğ{álÂƒÙ—s„lyğ·Şæ«ÑDnŸYÙ‘ê© +e»ÇÒ:rŞÄ°v±wÉšeq3SQtEufÔ5*•jz²a€ŠCËÆ6PeåİJÁNü¹[^8³ó9èÆ@È‹ÓÛámIÜO<D0D4®
”)(B*,$²@€’x.LgİğÀKé¹Yñô.–Á‡”˜²‡áOKaçÓæÅõùü¬ˆéòšÉ‹p¤ˆ¯8¸Wéò²$è“!jóöÂ¡”hå³.åØ÷^õèAx\ •CÀQRÜ#ÂísYkéˆŞÅ+‰s«ö¿ «C´©ûœ—3ìı3[â.ÂùæjëSDŠ#2ã%qFvHqÙúa 4¢©(`8   ŸnB-Í'ä“‡aà Á2qH×şcMb£#çÁ¦Õ2hnL$`Ô“oö°¥ÂfÆÂMgŞ@nEîZ²¹ïq’ù¨ĞŠôQsËÚB?Œ_Á¥äç×`š+ÿ*A@ŠÎûû¤}Û¨Mzãæ+ã mçø9şŸÿ‘½ëaÔ¡ú¯$'Ã¢N[LÊÎ©j  A›5-dÊ`(˜ ‡°Ğm|øãú¾P+†x“¸+hu\G¸Qì‘›(©TB[Ğ+¶š0 ­¨Öõ¡Póˆ}Ö1ÎbÒ)@°Ú–C.üÙ”½ÔàÃIİÿ¾Ñtıpö­İç¼KcÔµî`…¸å|_É~8¬ûaÜşá$´]KD'*.9C?LvÌ0°TYæ„u¢ÓrÌ;3Iµ¿õ¢{ı2S½T°ÃÀ\ŞQ@1½vŞÿ‘¤ÜÑá#ò)â»‰ºd÷ ÚÔC^¶â­Bæ¿U†ë=¸E¾X æïOR‹åpÆìPBS¿CIÓ¦Ry~‰•²¿'VÔ·øf eD‡9,Ñ»Ç gñš©‡ˆ6`N­‰ßAµ||±*˜3Š<27Äç*âÁQàÈ*›S VOñë­_¦ÛA?¥ÕÄ3Ù61Ÿ/mæq
f/<ÇAo#i±Ë Šh:2ö£·[½Å’8‡Ö¶hS_áqöúã„6¤I¹r«uqH°M	¸ÉŒ´ÄÒî˜¿´˜#‡¬Û7|4M,!ÌÙÙ¨nÆ½k6Rk£·oQ)Ï ¾”Ë#
ÌdB„N$tÓ</ÿÒ-‚’]çW]o3è‹x]bå)©în¨*µfÄJ µ±§YéUÅâ¯8¼*³İ]ip^ˆé'&ŸO©Â¡ª#W¿@Yi@däö]BG¸3röG×XM\Td^Æ <”A9ÃŒ‹•†OW7tÉ êZC;HÂÓ¡V¡ÊZºO÷{ZR®`;$MÒÆÓœ¸U&Ã;Èİ—ûÖ`RÑ­†Ä¦ø.kğX5;‚ÍÛÔ©ÚîıSO	jdPÁê÷y%«í	„¼ñæCø)“P€2sª½‹«¼†¥_'šY€`¥È0D¤xªOµ»}L
U‘Ì})§E`Š¥ac¨B|È_z·n>h›ÅS>ş6"o…·QJ˜bzÏĞØE¾;»ÅK3Â™*CNJScÂ!o'=·Á±ş*>íö‚ÿ^ğîUe¹×Iä[‰"›¢´íŠs§4şi   rŸ-nBt'²¾k†`Œ†ø2h87Ğü|±bÜ„VêVÅèğNUÿ:†I“.ÂJ¤Ë< ­åmäšíª¨ëìiŠ°¹GM&ß¨³ZHö…¡ÈCë=ë—¯ÒÚK>ÂãÅ/d[6<ç„8”pJ4­TUIDQ P€•«¦ÚÈ?}öN—©É;“Û™·OŠê–Áô‡o&-iŸØ=øÏƒ$©²\'Õ¬÷÷Ä]³û¨%ËäÇ-a„æ7‰÷ôFjêÿgÕÖOP|Lõ™H‚bK‡ê€47ôoÔkÄfÜ³h—¯c´rúŒJàÀc:¾ö’òvËùŒß—tá9n2ã¼²¤Â¯%rÕÛR»6èCµIùõŸşğÈÀp  ŸA›0<!KDÊ`(˜Öö<Û.vØİ:Òw\ğ‰PØ4‚ñ#´sM·üWÑş0|ÙAæ+¶¿™­®’Ó1 a•W6…&ÑAiyÊş¡ØoÙ®‘¸:«À5ÅRËï¥±ƒÁœóª‚I“¨Ä„qÊÜ•ì¶sHÕi( ü~ Ñ˜Àæ0Ÿ©NE‡òK «ÙaTsƒ¸o¸H„Â˜t›Òê·4˜xÖO'eòÚxÌ§“ä+$YràI!Oø·–Ìåå2›Pğº;T•Ô³ó™¡ä*¬„UJŒMƒ?HíW-|È&/lØ™*ƒZ›è‡£’ô°;‚zùu\ 4‡nÅ	Â®M0jsrsXf< ê01øs	„5†ßº[àseÂzDÊ"¯q_¬_QKÆL\£|‡“P bÚŞ_†Hf€^¼èHk&mm ŸÑ[ú ¼J‡¬9Î|¬ô’¾°Ãõ·Zµ…ş$ÈRŒ£œÃ»iòĞ³Òœø—™‹Át>»±•<a&…·ñ$£š}¯Ø€‘f«Ø†ÂØíã‰%wø{v›Ş÷:êGÁ©<páÇ§ñ£öŠt$ [ 8Ñd®0hÏví[VŞĞ`ÿLA%öÛ=9*›%ìØHQ‰à,${ånÏ ³J†N¬Ü¼k³ãçµtü¨/]P¾_TLB%êóE5-Û&‡– ä¶}4¨$QÕ¨¤¦Ñ|wWÀlQ zÆ[+3=<ícv¤RsÉ~Jnlì5ÏL{Vgt|ŞÑWK‚º‘ÉËÉ†[¾ø—ş"t3îG…™lÖ8sÓóÏMlY?l“~ó•m%¶ÄeòØé°¼Îå¦kkùÅŸW©MĞ¶ÄÚ)D,…ú€¥M¯Â“MúêQü!h“X«(«
¢=uºEQ¥ô,	—*ùŸË›½¾ÊXwÀó˜Øìö\Ï-ãö˜\'Ä"5ÇT¼m0èñè‘™ol‰IíaßøÒDz#r(¥…"¿BB2˜<iÇxÌ¥“MK>·¶ ÊEÿ† ~àÉqX$û¸dpíDğbÈ€ __Ã	
Ëşj¼e(ØÒ°7*".r»ú©væ-Ï»Èÿ8d¦!èlxI¼`œzù`&Õ(1Ä_Óîèºâl9@/q¶&¯6>Ì¸ùëcT‹DÔ6O>Lm;èë”!Â
ÏAdL<V»Ó	X   fŸOnB0A‹ Gx@Ë   ¢ÌÈôä*cØ&ˆ"®»¡Äğ™Ş$ß1†Gr?7ø,…å™‘¾.ÜëÁÛ)u`Û»*+`(ı.|O]^zGO—ø¨u*ul[X¡ÛV  ÷A›R<!Ò“)€§Šÿ<.u<újùûKŸ&”*µg­ ±ğ{Ê>`  ãàGÎ-VIHÎÊŸ¾éêt{Ì÷ó ÎËulıã,¬J¿µ·æl_qîùş¥Ls5'İ-
¸5©NøtëIœÑÑÈÈuT“õ{ÙR¯aQ¡ŠY£jŞhó	ió|½B7 4qĞîçË²(¤lÛŸ\\šf&Üèo>[i[é`n³÷Áyä:êtDá]€q*˜ªX««ùİ›/ÜkòæyÔÒc/c&Le:»´¥;Õ;†ëı±ˆåŠqˆ‹e¤˜l/M`æ@PNeĞ¸I@ëÈĞÙécV¼×½oÎ§ ¨íÜÓ‹£ü4AM6°®WwÑT‡Á½°Zaš"×Ye1†cË«ó .‡@i@	;’&+XĞN›<Æ÷j"7z?†<{J{mÒŞ3ƒõã¤*şçƒ†øRà¼åº5Tb‘0‰¼!:0b>-?F¼Ø“êéò¦a€wi×0	i”ÿo¹Eá+ƒ:(ùÑl+5w“)U¾† ;È:QÕ,%#vğ·ñ'
¦gçà—O·Jå•ºÑŒú§œÑ2(`Ÿ–on‡qòS|Á;KØ°‰LÑ¡ÊkXhÆÏz°†s\aUŒÿV³vş¼Ìöwì«—… âˆwN¯—­)Ü×©löÃ„´hs/±ı±šÏ#=r>±ó³š5ùÕQU5‚ÛPÂ…µW¹™„%ÃVÓÚ¢nZ›¥gÛ'òÄ¿X¸dåx  Ë–•Æ!Œ–JT,,¸¡÷¨‡Û-7äÊM’k©Ì–¨¬ØXºÁ’HkoE­¬`óÓÏ6-ªƒ 2©‘øÛ~weàôıĞ]D\‹OI`p/ÈH¶s%WËì“O[™YˆÎØªØIjŞ¢øÈ‚Fù&gõú 2¹ë¼ÚÀ* ·j˜/8·Úû,¿öz¢ÆŠŸEï§Ì†HúD
ß<»İ,M1×:Kù#{¹”ªÛÑ˜›§ğÎŞ”Buzä„¾˜6éãp¼>Lòéáœz¢İAò=Îê3Øı62/á!NÇxòş®ÊĞù±ıß¥œ§ åoTÒšD }¼7ÀÄ…YÇ7[TNfÌÇ%ÛiÛv_ÍŞ^…ûw¿¡Ù´XK°Ãw1Q¬B4Àì;æ‹*íŒ»9SÄñ¸Á7l„¿c»&€5Ãü:¥y°}.³	Ïê¡‚Ålæx ÎÔûÂH¡ C&Iü®áŞñÃ#ú:¾tdoË"8{¦-¿Ä•êîcVüö]êi“ïë yâÚjÕvıD†Çß½ö.êÇpMb„{}ßcÜğZdKÇo©¢®~ â¿«ÍnÚòã_ ¢5?™şœÓ¸Öé–&Ëô¬úçmá‰”•ˆëZLy‚şş:1Èvgí3DËgû/ü#S¯pĞÇqm£Z«‚±P3Eıo0ùƒÓµ^¨B|6Vq$y	…d1Ü˜N„ÇXŠÌğÑöG€Ø+d/6"ğ#b
‡LÃ28(U¡«|¿´ÓWy¾©æÇ! 7ÉMé6HÜT‚;$d»ÏABÕóˆóåÂŸ‚0ÎåàP'Ïl’%¦˜¹vƒ[PÛ[¸{ZƒøXC²Ul²‚åÃ¦@áK÷Ğ›m?Ú¢7îÅ„¯›Ş¡†¬¦S8‹1L%ey/Ğ½Zºƒ—ÛÃV6ÅÀì	f$oÿ,óÖG+ ˆÖÊÃ0“BÛ:Çg-¯ŸŠ©`NÄ;’üÍúé¼*³ĞÁıFTƒzû3Ã&å¯ò-æ)ø
š~ÜiCe”Âµ—¶VäëÊ ©#sØH/"¼ç(ş P»ób’ïnD±<˜iâ+®†äà!v&rÙ‹y™å’¨1­×„&¯,Š#P³}{ù¿Ò8zv óméö£¬æ¤¢óq´†U^¼cz‡Qê½”’ÅH´ê—¦ŒŒç-Í«\ÚŒNƒ(ÁmMé»†SÕŠ:AÜıı{Èn£ÄH¢Ëı¯A£»ljÉ&€“Á;±G¡Å‘L
²äwRş‰—Q+§jêñØ2¹Ç*¶³4"Õ_4w‚|İ²¾¯‚Ïqh‡LÂa!=t·ÄÍ}K â­¶6‰ÆìwéÆá(:‚N·È
Ê„R+ë?ªÔhQ‚tÂ±æ¨S$&à–ç‘}‹ûO‡pĞôĞ›™CiÖBz¥/ïƒ©&8v¸ûÌ˜¶9ìTDêü´S×CÑØvÅ”P,òÁÛ‹‡Tàa6…òS¶í7ÈÌ°IÊVé€L[AÃ yİ‘tTc§NO¹æŸS›ô5áëÃòÈ]?Ö,¥e½ Ge‹Ï¦›-¥2®+öUqĞíuµZÛ×L'¯:€ÓvÄr–ñ&Vêfx—Ö?àzMT¢oı€`Áãº†ğ„µ9w7±”ïXT²Ã²Ï!˜?ÚCDƒ¶’åÌh$‚Må+#B¾x ğø\Íjez/OòÈ <3.“éŸa:&ôæaôwA‡pØéX!^¨Xš0Á˜ƒª4F^¡Xš„áÄíÈ/Ã50ùÉAñÜb¸Ø¡/V´ó!^ŠşC7;O_$Õ2ut«Ü³P™ÚÒÏq¢ÉyTF•Y	ãÕbŞwØrü“¥¦7P/QgÎ±ÁwÁš˜+"ÿlzİUÑ-†~7b&ê’‚áz½ ¢ğ¯oX> ²‚^½îˆ’D‚UQ¯ÂLËphrçƒ‰^×eI¼uï9ìqëjY’x»jMÖÒIIfŸh¥ìtˆ|µÖÅe¹ˆ ¶EA`õ˜ÕÔCfyc›]²é÷.|a{ùUæ˜°£04:·­’ÁÔàÒr©“ó;­©by-!lœºØ¾I/üç\&«Ä•
Ùp>O5-Of’¤”Ê¦)öäC¬ˆ2€È°z¬Od °Í|YšOqÁH_ÜÉ%!Ä¸Â&¿wÌ—±ä
×ç8œvŒÌõ«¯³^"ãuş¡Üµ¦e«ò·ông±é¾¨“4P…÷Üª‹ LĞW…ŸJĞULÚ>˜’êO–¿4h{šu¡íY½ìEƒ­ÑP½²%Şû¹Ûˆ„.ÇùDn³xËŞ?åÅ'_èBÛœœÓ¨Üº`rİ„ÉÄ•G;ƒ˜"Ú¸[¯b¾èõŞT¶‚­zÙË‘ºa­‚³¯ô¢ô"o|’ÁÕí;9m>4D:lQåÿé<şºH²ë"‡&It š#4ƒxdM½h„²Ôê)ZÏó4Ñ±Ù‰®Òv–LÀ-3_»}èÅ:ÄP¯z ‹6õÊRP›j°}XÖõ·kšWl¤4<—ı¾ –Œ{v¾ö
°±ö²¨ È
:ÄhÔ)_Ÿ(ı-XZ}•Çh\}‰w~0Q»"LësïÇ:÷2$„$\±Â%9Úô g»ùq. EÎr’¹È¯ÏˆÄ„o 4sşY–¥—ugz6	œ¯…M¶Û	6[B/O-‡ƒ«^à½…Á¸3Â–Wú²¸D,ºx¼ÊEëáÜ cÑó°’'‚@/c_s1”)Êé9!OUã/B€"B®’,w}øWÅòùÈiÚó¡fğ˜:\Î¬Rƒx,.ş˜‰U‰¥ïüvqÉŞ­Ì¤š<û"¿p•LcËêj#õq·æ=ÇR…X¹ÏïĞt«Û…ĞÆ—éG\ ™±Ã›Mœ[tBmªğZ$€%;;u ßK¸”X¿Â#•88#I¸Ë=¯''Ï&ãzJx—ÃIÕœÙ¶n/°n‡¬Y[ñäºİrH#³Ö}¦@¶Ÿ¾qÏNÛÜoíŸlT'*Ë”v†‚Œ8|-­Ìä]î÷úía³1IğI¿¼áW ş¢'x¯ÏqmK2ûr½~ü{ØoAwõ š™yM}•µ=I©Ş¨ˆ
gt[ÕŞC•x¥øZˆõMÓ÷ººóá¼‹òa·äÔºÉ\ü…ÉíÚjzv`³£-*ÀªÃsÆÃ¶1ömyy–hLÏLâMµÕ–u×-C¯‹Û«†¶_×"¡f´zÒÜBı8g‹•ÛA0€»­ô¤1d£ñ*ŒÁúåÒ‚¦vç¿®!ÃÕ¶†k2†ù¼Y<hrjêÆ˜İ™kzæÜjï­iH|%Dõ¼-u5´Yä)àÆHápÏÙyeÓÆY;ÁÛÒ¶ß»Ü¬«‘Rµãà\É`ã6Ì®çæôÑ›íUsÛœêw¡97^â æ²dÿ(úNÙ£‚AIĞ×â<šê}–Ösjõ&ùN©U‰ü˜u,ôÇÿ&	mÅŞ©¶§Ä>_s$õhPBÍ¨R³‹ŒˆT´ZüøF¦*¤zì;qJì2~Z?îÒ;ªA:ÖñGğI€3Ï¼˜«‘¨X ¹­e&§õÿq¶9|¯íIú`NQº\tiàòë¤$”l¾Ó ZšÕº3zµC¶O„§Ä÷¼I­­Û)ìP)ŒS¾¤¼Öú«|àmïÊ>x ûë§…Uù &Cixœ×Û†yîqfAü˜©+²ç®§_Á{2ır«;>£uFè+ÏúI`aÁ³pú¯Äp÷šƒoØ9µ÷ Ø'2ßÓ`
ÏU²d Q‹jàÆÌ9<ÃGDÚVRÚÍ~Revà­––Î6K]j›Ò&íÊêõ½Y–Œ¢œåR¥-ÃeUÛÃöjp½B-áØ¨^”oUæàOä’96SŸÊÔ´go‘Bx5#Û~ÔlB‚Ég-„WAv²)	I‡[®şaTi‰q‹‡İd­îı¿/UøO**oÈ`'ğòTfâı©ÄÂÿDJÍtIrEÛì]1%t1$L"xócò«ÙL\O
—¾Ùğî|˜LoøK€jºP+=³]r ñÍé[WŞ°Ç›ëRzW?sVÈïUC¢›ºxes˜‚hÖRmÆ¥Šë°ŠS²q‘¶µïÅÀ—ÀÉxÓéjB4­ê”1	E@ˆ@ ÒbÚ@ Eƒ{Êë˜>B¯Ê(Rx¬Èr‹¼[Í§®?òWßîªéÁKét¬€•›8qÌÉ“7Ùøæ:¢x¢0Äºá^˜ÖºêÌ\küİ:Ã¯M^ñéû/`å×8áåóv4l±Sƒì¿Z¨nèóYNçIeç™vë’ÔäI“©õ:¾c»ç‹$6yæe§Cm:7]*zö Q Ğ À   ½ŸqnB–ÃŒ8‹“|cŸÁ-(àÄC€K•g¯1…&†hŠŸg`~6Ís­swèÍØ6"¡‚äP*x2Nå(z$/ÎïÀş »¨±á,È{Æ:šÔ÷ëdè!!FÅÿE/ÚŞ¹@ò '–ñ¹ŸC+‚i e½¯È|~‘YGuN¹¦$Ø(OŒÊO©¸AÈ1!ûüø¯†ñ[•™4ñwy1æ¶=%`¬ÄúÙD6ó\ûé­DA  :A›t<!ôL¦‹Œÿ mXşÄí`è É¿UF¥"©Uİ¾…TÈüÿ§”Ç“˜ÒxÁÓ8ó8üPı¥„£uË”‘0ÑÔèµ*[¨µõRVÑ>T¨Ö¢’-íŸ®w~°Á²Ÿì>ƒ@¥>
µ_¯åõ.b‡Üaş”Q	/¹º©\fÙ}yH÷evw/Ht Æ#x]*_ YI-t³ØHœÅu—á‚42× õR×šãjáèƒ²>n¦y•M«ûW?ÿš¨°ÑD¶ÏËÖirú¼÷‚(x7¥ ´]+É¾ÅZz†jZà£L‘Õ–wø¡Èéõ.&§8£wcY×Ö_I­½eˆºßØ¥»mšŠOàğ+Ú(©°>ğ:Ä1Í²Òo	×ñ³ÂH45çæåxG½é­~G7çx°…•·NAg¶GÀÍı·®8c$àP00uÆE®du½-1ş‰	B5¥„‘G :)h—Wê‹$0ëväq@AXÉÌzñÊ€ŠbşzN <‚oÊ/°×rØ¹£Ğj8.wşó}j,£2“ñ"¼=‰ıÍMMÛÅÕ×kñÀ5e¹ `	í	 á{ÂIé»7KŸÚø0/+…2|:T( y£ˆ±µüˆ/C8îÄÏØ™xÓvÂgüÌ+9TÙØ˜Î31ğŒ J…ı»»“n‰<ŒíŸë®?¸*£ñ@Ÿıê±±yÔÊc«­_Eç{xò±oV47	µØcx‘öôo¨/„ª#EPîğKfîı„Î“BY–£ø´ó—Eè¸ò:ïD#8àÅ[ñŞ¾eµü½+€ttœ	­i™™[=¥ÊÃÛÏiGœUxøB-³ÿ*¯†X4ÓJépnÓÌ&†¬Û„¯‰^:Y\ƒ_ÅZğÑ^(Ôa¬°–†äÎ_&ÓÁ—>²! W²˜Ú•‚æ@)qü…•"ˆÖ¾!{“£OşÓÁèŸqDÌK!ÊyZÁy÷!,ãcGm+H_§û92ÉU§5per«Ìè{<…mü°®)ÈšÉl0´1ƒM$bììÀ'B–ù1àúo…œlß9HAWjä6¯å’=2ş¤°X5Ê“51BÕ}´šó4
xì áBçxÄÂZ‹Räol£yMÑr®–ï¼”£Ø@½ú­7EÕyk_%§é§Ì—»Ééõ5{Ìï ·j»v”í›îï™¸¢Q_Wvg‚X©qmBì@ v-’3Óe¹ÒwäÏ–Ã½Š™Ë]9µ÷Ã§„.D§‘‹ßZÑsN)¬8i/5<¨h‰šùPCô¥½CIy	â(ZğazµÖ¸ó°ÍZÔS×ÖN#¤óÂGÎ»Jí©zf9Qs{ì‘9)yIñÒÏ4Z‹_¸p¼EÀËáÀíB¢ÓÆt>ÄÍo3à×ÛlÁCãƒ¬gÕúĞFˆb)db{r+æ"Ø«´~ïşiAq0[¼ÜcbCXèÿÕz†Ùäİò»bŸIè³q‰v!¡ú¡îp½¹á¼é)˜y5"zD—ª¥hñX¢£ WjşÚşY"Ğ	fŞ{Úª½ã­Q6DºÔ¦Ô;>tÿÊå?"ñÇ`pænIÁg]òŸHÜfœš …ºÒÇ^™Å7%ú¢pâEüğÏ{Ïç(¡¡zz²ÇÁ ÁN<?{Î,D­e n7nïV~ë%jXy‹³uğ{@ÊFü7Òz/K¢¶yİÂÇãX0H4­ÌE:†"„²K Ş×½[èV şªL¡éÊ•Hv7×!	!ú§âİ4ğXŒ>ˆ·HJj,²2«o}7h –€i5%?ü¼sÖ™é^vªÀDßä•é›)Ê‹òr«˜²gWIË=”\uÙ+w©¸%H¿i}/à	Ãõ†¾Êv.’¶ÜDÖd°°ÿ¾ø*îcQb³§iæ+„ xõ 9eßãÿ_şĞì•   ˆŸ“nB ˆ‹àKïÌÀcÅ²F_ªßîåbVå)ÚÂbv~")˜\õ°ª=É²t–H\áÓdå)®a™½¹a¨Ã4\¹…¹Î±øåcaâ)ŸpÇÈ$.ÊÒNy>@«ÀptğHWgš‚–èºæ°w¾­Ø§õ%¸C-å]¬Ø×kÃ  ÇA›˜<!ù2˜Gî»ƒøl6Ü!}ùkÓ©xô`M‚˜j}À’tbº¼föö§¹ß‰Ü™í~¦ÜšĞÊÔ…0k(ê)/à›Zäì}–¯¯÷ğÏ¦A5
P8ƒü„=n C<
x«—±Ó©Vë59“Ü£ŸPD³”¦cÛ‹*¼+€’ÍM·²áFëf¼ß´	EfÍæî´ğ=Ü)‚´ =M;sò‡JTy<xT½ÆÏáó@¡	Ì
=ËŠNW%zy	¥–ºf}½Ç›bÊÅ¸@ƒv*¯İ4Laû«!l¤–îmz*êªç§Á£Íî³gŒyÙ·ç÷™dâ}nKnÑän]Ş-MÒ“kÔ0û½IÕecË”fÈ£ĞQ:8Ï”ï'œK>g-ç²ïıÔ_¥pâ€4|„NpİY¤²dÛ¸pï•~U<3 £ïÖbF}<æ˜qÄY›ôü•(XÄb8vü5µ_D¸>óı4$¬p<ÁG¦róq]NE=˜â0dìÌÑ)àa”•.ƒ@übÄôidóÆî»w®pa4Õ³ B÷›ZÜ‡W{¼[f7¬G´õµ\Ÿ16ÉbÉÅs"ÄÁÊ_Òšaœ´qV?áè£;®÷6:³ØJ±«ú%áŞª}4¤cK“ôÍÅÎ©ºÿ¸Cá^‹>áaäçxD¬’7Á;^ç‘Ûøì]ÍD«C0&qØD£ºÜ*ñ¯;´évAš›t<i$îïºrToBê¢ñŒøÏöÌc²Ğ©Ö»'NÓdw>”¸§®w_æË&Ø„Ï÷–Óñ¥A¨é40×˜Š¢®Æ}&‡Dh‹¼W’ñ[Bƒ³>áà×9^ÊÜ,Š+COvXƒoòŸ‰OŠ“D&®;WÃö_°¹(İ²¿¸Ü¦b&W.i¬è‡"l4z¶q¾ıŸ¯RjçÜÛ6@ÑàÔH2WáŒyqö¨4[vÃË-ò™¶$örÊJ…€HF5×)$25‹»OÏƒîÖ3Jñœfıa”XÀu_0äm·µ%buÙâ¼cœ­8¿ôe8LXÚëçò|F#¸‘7q¼rŒ;S>ªñ™òİXº^w†ş¦ÜÑ‰Ëqœ;Î$:
Û.ûü™ÑPŸÃøçC„Av,*¿(ú._~ÉÈ;D²ƒ¿*2¥åÑHwª©ånqQ?^^²ÖÛ
|Ññ9‘ñ0Æ¿p+ãÙíâÁ·Ç%Ş½}ÔeñJ»‚¸Pã:z*[°„T¡ƒÔI8`¸¼²ÇqOaÓ[wK”¶	¹iäH—âx}s©Ç]U5_ÚŸ&²şØS/Œ™íF/aôè×ì¢Ësòåôq¡‘/HŠDVãWÌR7C#&+b”KgµH1;”µ¡Ñ³XnôËœ€ ¶É†FÚÖôùİV‰{c…ÓÍê€Äm§¼¡h^`İû¨Š¥RĞ|Ã-²¢CÔ¾kÜæ%}²¬õı?3û¯#²¾Ù½®¶<uÉN÷ûÂˆ>ô5Ì:^N­›¡pi¨²l®‹ñf5è 
£AsVûo;~î£Á¼j²(ñZx9rqëşDUs#˜ä =‡˜î®Mn–ÃÕ¡$Pı¯ÜK 9ôæD|7Ë€@é
ÖÑÿÛ&gÓ3°Í£”}£™ôûŸ,LiU#?ÌA‘´Ùa¡´©bê#ÌCn¶v9²RøòT²¬åCéLËæë­ç€÷¯×ËI/`ÉœÀHĞ$Ñ1Z™f	(3h «*²”Ïc"¼Ğñh|çD­¡‘¥»¡¢dó²cBNØÄf4n¤(-àÉ³fDzQİw•h0J“¨âr3?­²šHşÀ+îî¤—+¯I²ü‘X£	ßSº)ß‚K’¢`ıì÷ú¢ÓÅ‡~õÿ3›Ğ }×°ÖôMòŒG!Å.×p­EzúO‚‡×ª¢¦ÎÊO”$6y¦™¸n"ô[oò>¢Œ¤c0`hÅIš_–öYÂz{'KöT„QZ	 Ï¯µê1½”´°.:­mÊ€Ã2Ü¬h¸Â6– âúÚôCË}”[Ä¯ìïÔ´¤XÌ_zm{2€}sÓ´¯(f”|¬›¼Ş8x~_Ãìõ´ÌÉïoÚ–ÏttCy¹`”˜Õ0‚7SÃT.êĞCZ°GnåÁìG˜7 y¤o\¤MxnArˆ«‘¤QŸ	÷Œdí&fT	òã/w"9 e±ê¦€cCğ	x&#È•šH­¶hûõŸû©=’£O®U:³$¤±F÷¼d‰ï²<=l®Ö÷ŒŞƒ¾İ•/smŒ‚îŒK¥·V‹Ø¨«È˜Åâk”M‘jjÃ§Š‰Lqı% ˆºt§|ôË*šƒ‹»ço$¦Kàyx'•Z…s÷©™¸¶¬F¨ÌqûTËT1Òe×…a³dƒ.óıâ ;14GÒbkW-	 Ê11€LÓRıÑø‡6wWiıa«ƒe©“å+2v8‹ÿÚ•î`_r8ˆ^mßÔÚAHC ¸ºb*0€9÷äøµ£Øò_(V>,\¦¯2û«š|]ñ]ûšbéË‹Û['Îõf±"Ù2vtbôûİløš™¢zı·ït‰uùö¿¯vf=¸=y_ÜÓ;á~ş»Å.á.j33¿ÿšæRİze­dJv0±[·ÖVjÍ#Ü8òÇUÄ(\“WjR²tğÃÈ‘½¹o¼åJt¶‡|«ªŸäïÒÜ/²âW8hÌ•Ê¶!|8â:®Zõ\µ—ûŞ_ºeB«eã*Òâ¨w,hªjÍ4uEšFúqëGğ¾m#ƒégØZî÷
rE;qË»!‘ñW‰˜Ñ/iøÒ÷kÄÖ­#UÉœ’&ª?êìüŠëp[ı¶héÄJäP™ ÓG}>oNovrÕY¾%°& P(FµLI4œÙw}Ubmİãw–š‚f¬—QÌTíŒ(?‹>TŠY].Ş7í±ãEM)8Ê8ª/Xò`Ğ>³CR³×b§Õx5|XpxÃse.âz_ÀRäÊÇ|Âp÷‹µGÃ”0xÉ	 Ér£†[¥UòêK™)¢¤#:k‹Ä‰ ~ğP½”îºETòğ›ñß›o¨RÕG‘Äkå*‚[k–Æ´rS»IœO`/xh50½‡÷}jS-cG÷à@í½Vj§ÄÇ9¿ôÍlÒãöâãDp$ÁvS‰ù@òÀ–´
x»Àº˜”ÿçËB¹dÕ{şÿ•ñWmE—¼†’€: üqE8õ„{W;š Jl"›@q¥¢'Dzwªz{A5¨½ ü½8¼Ú}ZZ; »mUI©øU<£{;ÊíoéÚ,Ùm5qYL$n÷‘Óóç)ÓWŒ’VššVx³LãlÜ-Á±;Ÿ½. †KÃXäĞ9¶ä–@…ıüñhİQ:•+½Ar$ñÀÙHNEh	­0#¬©º7['j×–»—5®ªeB\nâ4„±'S YõÛÀ<ÌÇ‡Î|b¯´à}“g@§YpM}€‘R]g}gÊe<3ª}l•ÉÄÔ`4¦Èú–ûñ@Í=u|bÍÍ©ì°óş±]É­ô2;£ÁaÃc€b"Ó`ÉÎĞ‰fMü¢^"†‡IHı÷äáÕÊõ›À¥9³U)ZOÀSáQäÿ'&i§Gî—/^“°óOÛ’gùíS']ùnÓÿy®DâäiM$ÌfrÒtj?dú‘„=õ5	İæ$|Y‡EÖ9Ş°jØEÌ@wå­@¾këî!'Öµjæ¨ê…Oß]¼:5Q‹ Ì“2ôSÒî¾Å/w§]€æâşıo/bGı›f-LÇŞÛæ¦ÍğŸ<»Ş9ÍÉBÜÎYø´ÎNqÉïË²ÎÅcÉ(ù÷§Ğ·÷tˆAåP­æg8/Ğ-ˆÜVÌX^eËb_Lî ê
½ĞÊäëùE^f[!ú\pÑg-EEÏSëÖ‡Ò™ˆÁ»›KŞ+ˆ–Õ¼c Gş„ª:.îˆİªNNG† ‘U¤[~
¹5ëõ¨“ÔÌ·¦
MœÜšê+°åX±¡Ä)¸m1ô¬¥?¼pkú˜³øãZ²¶úF¹í²à2š…”Æ;î¤.{Mn$?`yÍ˜Œô®9xÄY³5²éµ¦&ÿİµ‚íùHZWBY»/ 
ëÇ}öSIÍl+àà!¬¶­‡,¼á>6ÇŒ†ûr'ÿîã¤–„ƒGw3¿üf¸2NÜzØÕ |$xÛ®*ÀÎ&¶DÛa&oÉ(*%¦ÕÛöqQhyİ1¹q|ú2{Ü!!•ÊUÌÓÚÒ«z…j±l?ÿ’ßà/S´õ¢®3O *ù®´`ŠàÂÍ!ÿÍÊ´ããÃ"´ØçH¼ç¿Ù83_­¤Ê‘ç; Âík‹ıÖ¿xŒÙj]gBjj‚Å7ÅJ]kÛ6’n2e!|¡CfiéQ ¾Ädà¼-ÎÄ2KüIä(¦¬¡ƒZg¡â?Z1–|uP*swzû:3V‚Ö(Ê¦ú‡ÑÛ²'¼H¼PŸİYq¦ñä«‡WÙMÄeß›+¯\ Ë/İ½ªpãFœw=DcÛsØÌÏ¡C Šk7ø±LÏBŞZf}1M±'‚p8ö9	Ö`-ßtŠyÕi8ÊeiW3œÊ¹E`Ã¢P…á9ãšŒ])Yªk$MŠDaJó4È,Ñy’x¡#ú'Œ ˜;¨„¿(:tåš=ƒ²à?BçË\³ÍØyX¾´r,X>»yÓtNyKo`b‘Eè§¹~Òÿ=-ùDûJ&•3#´°õèmú]m<
¤jG¡!aIWZ‹¯×k?İFì›²¹v–<âıîY­òJ–w·™LŠ¢Š¸xm*¼®b†³¢øM–Å`¼À—¢T{cà•MD‹¤G\R|å3«Ê¤â4Zs(¾n9 Î2¢8:H¢&fš(«*{œbg"-¿bô^”%X±Óéö‚}Gwçéš³ p &óqF5ÙŞÏ­Ü(…]Æ‘§få.k©‚ó*iæÀæÙhº¨Ğs2ÑëŒfoĞ^AN±Ä ?}4œ™õ°m\D«’â¼“_uaÖ6ùd£ÍêôHÒj
]ıƒ¶:Å—H4~ F¹­…·qú?oåşfïRİ<Ş¼PÄúrä–]!öçqM]|6uÈä
E  AŸ¶d”TLWpI"[0LŒ}l%3)8®[ê¦ôº2çNµéöu úVRšR;ÙußcáÄÏzÅæ¿®Ì†…ávÔ¢|¹Ò¹`ófÍšUÉå1à|Ñˆ³¨~ŠjIuÊnË4ÇL9uì¦›$Õ%3_–³ÂâLÓ7¯wP©ÉƒïÃ›»é:Õâ!ó=ŸZª³™—ÒvU9'†‘ğ…qÂc|ú"Ö86'.7)•êµÑÚÈå|sÜÛõko]X‰¨µHj|öÆvz¯’o›Êşkº¨Â&¸4¹Â&‰¨Tc–3?şª)L~Eıòˆ1@^]„~œÉ¯˜¨”åµ*-+âD„"ÿrİˆò€D4­ÎdiC nTŒ¹¨Ğ ¸7L˜ÉØ‘û•ˆ-Õ÷òÜ‘ö>ÏUSõ§'¤ú¹ÓOÅqí"ÙdcõZâĞ]¾mEk´o1ò6ªĞ½ˆÀ £(&Ñ*í ¢»õ·YgÊï©Û1i>³½š™ö[UaBQc°' BĞÀ„» Ñpy^å†;û–_¸ªíIùJ¿„Û_C0ì?*”(0ÓsœˆL#Ó uDxÀ   ÙŸÕi‡4(ÿ½ğâ.BòõZú˜Òzá>ˆøµ Îzôé;'vØfÃ&“µ.XzÎ'¬¡gi(¨»ù>ºp<`zB[åjª–‘w¡,cS.¶cÜ€špai"D½sèÜ´duyåk€¦!ú¨¬İÄë«1ÙùæÄEåÅUI@í#m7ßñó—$GjU(;rû‘îìNùên7¦g¢•Ó<D' ·òÇ;Ÿ2_xÜA'‚“éµ6|'L=Ï.àº–F&ÔÛ%Ö~•x|†Œ   Ÿ×nBÄ?C<±!õnéáõˆ!¼ÃxéXSeÛIet1L‘æ¿¥ŸL›ëìÇVš#˜.õ}“%ƒu;c9ÿõSÙVh3dq©}¬dH\7½Ùóò…%7öì¿n®4pÎ~¤.üoæÖT¸GáÎ:Kç”ŠXH†É¶ÌPåËj ª¼*·›Ñ  ØA›Ú5-dÊ`(˜Ï ˜İ„r:ÁÊÑù+Z_ˆSq÷ªİ:8jÛ¿0N=Áˆº p6ye÷§BôËZMøW ª‚¶Eÿ…[Ìñ;lV –Öå’òLÛàŸ=eNX÷/°×[NQì-]aM’à fAÑÍŞË`w÷o6)Éu:Œ·ì€´¨XAåVm3•0?œÍÍìè€»l6ˆ«ßŠOÃ'–¨K	^Ë¡sbq)‹˜ï%˜Tw|ı%i«îœeS½IŒyN?U!b-/š¾åØÍ,’dWâM¹Ñ¦|Úr~#tHe³¨EĞÎ Ùá–j*-dd—ÁÌó D Fû¿GgïÇ%¢)±…fym,²úùS¥8^ÓÌŒ(^XQjØÚ…«ÔOÄtCı+V“‡uwzEtáõ7E[5­#7| 1ÙÂM*+ii‘‡ä‘›ïñ4 œôØdB¦h«
­i˜÷Òöprb“»Lk</ŠAÌ1¡Ÿs23Ü¹aŞ\ò5ÑÀ\è\û!¾ğÿ
Uî¹A‰ M†¶yh´}®À®ƒ=>zAŠj§zk4¨CQñ(Ú¼5<é<½=+œA‹.¤i0(”ÈJÀ3‚	À'»z—)kXÆ{¢Ÿ˜|·V–Dë“õëe?ä¥üœc(ş<wÀ% 0Ò•iX¿‘iH\ëÓ,9ŠI–ğƒ(q¶.ô¿ÿ÷hüCåp	Ç¡"<B 69˜±à¥Åé'ÛI’ğ2…8ø-jöÙ·2â}pA¾œëO…uóE6BİMÅBÄZ¬7KvYş’IŸşæ(°±EåÈtR‘É³K£ŸEÂ€±c©5é5KàñÏª'Ğ¶¨lóëÄH1½ĞìÇ{€WÌD|x=¼ı;dì¹ŸšÌÿçW8"ã­VZĞT282M¢Í„«ŠùıÊä~Z>:/’ù¶5Õl7¹ÁUqv©CKODeÉFÅª¨_ø+ÕwˆİŒÖß†ÜH+ú¯àjXAÈ…·+ÊİJèJÃ+Ã>ÊÇMÚZM6FPpxwoØ·-nµÄ%C’úÖI`ıí„›>:%ºƒÚì#¿¤Ñı.òùCT³ÜğYo]1Ë	8²foãßã0<‘!Ÿó­A½B•ªF…L©o”Ğ&51ØSÁu¬yÏš‰Œ3‡N-:A‚±?J}ÄùañĞôÒâ4‡ï:AõËíö>ºòÄ³÷wÁ EçFšç¤40§@!:0è†ÿO_Ü(.—«,ë,‰NãŸD4ÛulbŞ[¬™Q¨ˆ§±Ô!¢+œÙŠ4Dß¸K4Bw‰°Û§úqúÿÔz(«kûW&Á_²!ÍßéÉH§ˆ:CjVQı»‡¹ğôS’TÊ·Ù	Qdx¶½ğ‡S{O“"/®î»ƒRm°ªq0Kœø|êÆ¦.î‡Íljßk`y³Ğn§CWÏÇX8ÛÕÆósµĞPû¡ÓÎfMì£æãŞô”ÃœÎ¨bÄâ5ƒfkOÓä÷Ö^X'A‹Í˜ª{¬^—Ë,XH±^Æ(ÔØ?¦Dô›ÔÚÅ5lšÛIàÚæÔaİê˜û)-
-:Q&V}¶$™ğóËA=>åÁ%UTG©üâ…ÿKs3^çæÃ·BåÎGÆ(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["sourceMap"] = factory();
	else
		root["sourceMap"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/*
	 * Copyright 2009-2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE.txt or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	exports.SourceMapGenerator = __webpack_require__(1).SourceMapGenerator;
	exports.SourceMapConsumer = __webpack_require__(7).SourceMapConsumer;
	exports.SourceNode = __webpack_require__(10).SourceNode;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var base64VLQ = __webpack_require__(2);
	var util = __webpack_require__(4);
	var ArraySet = __webpack_require__(5).ArraySet;
	var MappingList = __webpack_require__(6).MappingList;
	
	/**
	 * An instance of the SourceMapGenerator represents a source map which is
	 * being built incrementally. You may pass an object with the following
	 * properties:
	 *
	 *   - file: The filename of the generated source.
	 *   - sourceRoot: A root for all relative URLs in this source map.
	 */
	function SourceMapGenerator(aArgs) {
	  if (!aArgs) {
	    aArgs = {};
	  }
	  this._file = util.getArg(aArgs, 'file', null);
	  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
	  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	  this._mappings = new MappingList();
	  this._sourcesContents = null;
	}
	
	SourceMapGenerator.prototype._version = 3;
	
	/**
	 * Creates a new SourceMapGenerator based on a SourceMapConsumer
	 *
	 * @param aSourceMapConsumer The SourceMap.
	 */
	SourceMapGenerator.fromSourceMap =
	  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
	    var sourceRoot = aSourceMapConsumer.sourceRoot;
	    var generator = new SourceMapGenerator({
	      file: aSourceMapConsumer.file,
	      sourceRoot: sourceRoot
	    });
	    aSourceMapConsumer.eachMapping(function (mapping) {
	      var newMapping = {
	        generated: {
	          line: mapping.generatedLine,
	          column: mapping.generatedColumn
	        }
	      };
	
	      if (mapping.source != null) {
	        newMapping.source = mapping.source;
	        if (sourceRoot != null) {
	          newMapping.source = util.relative(sourceRoot, newMapping.source);
	        }
	
	        newMapping.original = {
	          line: mapping.originalLine,
	          column: mapping.originalColumn
	        };
	
	        if (mapping.name != null) {
	          newMapping.name = mapping.name;
	        }
	      }
	
	      generator.addMapping(newMapping);
	    });
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var sourceRelative = sourceFile;
	      if (sourceRoot !== null) {
	        sourceRelative = util.relative(sourceRoot, sourceFile);
	      }
	
	      if (!generator._sources.has(sourceRelative)) {
	        generator._sources.add(sourceRelative);
	      }
	
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        generator.setSourceContent(sourceFile, content);
	      }
	    });
	    return generator;
	  };
	
	/**
	 * Add a single mapping from original source line and column to the generated
	 * source's line and column for this source map being created. The mapping
	 * object should have the following properties:
	 *
	 *   - generated: An object with the generated line and column positions.
	 *   - original: An object with the original line and column positions.
	 *   - source: The original source file (relative to the sourceRoot).
	 *   - name: An optional original token name for this mapping.
	 */
	SourceMapGenerator.prototype.addMapping =
	  function SourceMapGenerator_addMapping(aArgs) {
	    var generated = util.getArg(aArgs, 'generated');
	    var original = util.getArg(aArgs, 'original', null);
	    var source = util.getArg(aArgs, 'source', null);
	    var name = util.getArg(aArgs, 'name', null);
	
	    if (!this._skipValidation) {
	      this._validateMapping(generated, original, source, name);
	    }
	
	    if (source != null) {
	      source = String(source);
	      if (!this._sources.has(source)) {
	        this._sources.add(source);
	      }
	    }
	
	    if (name != null) {
	      name = String(name);
	      if (!this._names.has(name)) {
	        this._names.add(name);
	      }
	    }
	
	    this._mappings.add({
	      generatedLine: generated.line,
	      generatedColumn: generated.column,
	      originalLine: original != null && original.line,
	      originalColumn: original != null && original.column,
	      source: source,
	      name: name
	    });
	  };
	
	/**
	 * Set the source content for a source file.
	 */
	SourceMapGenerator.prototype.setSourceContent =
	  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
	    var source = aSourceFile;
	    if (this._sourceRoot != null) {
	      source = util.relative(this._sourceRoot, source);
	    }
	
	    if (aSourceContent != null) {
	      // Add the source content to the _sourcesContents map.
	      // Create a new _sourcesContents map if the property is null.
	      if (!this._sourcesContents) {
	        this._sourcesContents = Object.create(null);
	      }
	      this._sourcesContents[util.toSetString(source)] = aSourceContent;
	    } else if (this._sourcesContents) {
	      // Remove the source file from the _sourcesContents map.
	      // If the _sourcesContents map is empty, set the property to null.
	      delete this._sourcesContents[util.toSetString(source)];
	      if (Object.keys(this._sourcesContents).length === 0) {
	        this._sourcesContents = null;
	      }
	    }
	  };
	
	/**
	 * Applies the mappings of a sub-source-map for a specific source file to the
	 * source map being generated. Each mapping to the supplied source file is
	 * rewritten using the supplied source map. Note: The resolution for the
	 * resulting mappings is the minimium of this map and the supplied map.
	 *
	 * @param aSourceMapConsumer The source map to be applied.
	 * @param aSourceFile Optional. The filename of the source file.
	 *        If omitted, SourceMapConsumer's file property will be used.
	 * @param aSourceMapPath Optional. The dirname of the path to the source map
	 *        to be applied. If relative, it is relative to the SourceMapConsumer.
	 *        This parameter is needed when the two source maps aren't in the same
	 *        directory, and the source map to be applied contains relative source
	 *        paths. If so, those relative source paths need to be rewritten
	 *        relative to the SourceMapGenerator.
	 */
	SourceMapGenerator.prototype.applySourceMap =
	  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
	    var sourceFile = aSourceFile;
	    // If aSourceFile is omitted, we will use the file property of the SourceMap
	    if (aSourceFile == null) {
	      if (aSourceMapConsumer.file == null) {
	        throw new Error(
	          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
	          'or the source map\'s "file" property. Both were omitted.'
	        );
	      }
	      sourceFile = aSourceMapConsumer.file;
	    }
	    var sourceRoot = this._sourceRoot;
	    // Make "sourceFile" relative if an absolute Url is passed.
	    if (sourceRoot != null) {
	      sourceFile = util.relative(sourceRoot, sourceFile);
	    }
	    // Applying the SourceMap can add and remove items from the sources and
	    // the names array.
	    var newSources = new ArraySet();
	    var newNames = new ArraySet();
	
	    // Find mappings for the "sourceFile"
	    this._mappings.unsortedForEach(function (mapping) {
	      if (mapping.source === sourceFile && mapping.originalLine != null) {
	        // Check if it can be mapped by the source map, then update the mapping.
	        var original = aSourceMapConsumer.originalPositionFor({
	          line: mapping.originalLine,
	          column: mapping.originalColumn
	        });
	        if (original.source != null) {
	          // Copy mapping
	          mapping.source = original.source;
	          if (aSourceMapPath != null) {
	            mapping.source = util.join(aSourceMapPath, mapping.source)
	          }
	          if (sourceRoot != null) {
	            mapping.source = util.relative(sourceRoot, mapping.source);
	          }
	          mapping.originalLine = original.line;
	          mapping.originalColumn = original.column;
	          if (original.name != null) {
	            mapping.name = original.name;
	          }
	        }
	      }
	
	      var source = mapping.source;
	      if (source != null && !newSources.has(source)) {
	        newSources.add(source);
	      }
	
	      var name = mapping.name;
	      if (name != null && !newNames.has(name)) {
	        newNames.add(name);
	      }
	
	    }, this);
	    this._sources = newSources;
	    this._names = newNames;
	
	    // Copy sourcesContents of applied map.
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        if (aSourceMapPath != null) {
	          sourceFile = util.join(aSourceMapPath, sourceFile);
	        }
	        if (sourceRoot != null) {
	          sourceFile = util.relative(sourceRoot, sourceFile);
	        }
	        this.setSourceContent(sourceFile, content);
	      }
	    }, this);
	  };
	
	/**
	 * A mapping can have one of the three levels of data:
	 *
	 *   1. Just the generated position.
	 *   2. The Generated position, original position, and original source.
	 *   3. Generated and original position, original source, as well as a name
	 *      token.
	 *
	 * To maintain consistency, we validate that any new mapping being added falls
	 * in to one of these categories.
	 */
	SourceMapGenerator.prototype._validateMapping =
	  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
	                                              aName) {
	    // When aOriginal is truthy but has empty values for .line and .column,
	    // it is most likely a programmer error. In this case we throw a very
	    // specific error message to try to guide them the right way.
	    // For example: https://github.com/Polymer/polymer-bundler/pull/519
	    if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
	        throw new Error(
	            'original.line and original.column are not numbers -- you probably meant to omit ' +
	            'the original mapping entirely and only map the generated position. If so, pass ' +
	            'null for the original mapping instead of an object with empty or null values.'
	        );
	    }
	
	    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	        && aGenerated.line > 0 && aGenerated.column >= 0
	        && !aOriginal && !aSource && !aName) {
	      // Case 1.
	      return;
	    }
	    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
	             && aGenerated.line > 0 && aGenerated.column >= 0
	             && aOriginal.line > 0 && aOriginal.column >= 0
	             && aSource) {
	      // Cases 2 and 3.
	      return;
	    }
	    else {
	      throw new Error('Invalid mapping: ' + JSON.stringify({
	        generated: aGenerated,
	        source: aSource,
	        original: aOriginal,
	        name: aName
	      }));
	    }
	  };
	
	/**
	 * Serialize the accumulated mappings in to the stream of base 64 VLQs
	 * specified by the source map format.
	 */
	SourceMapGenerator.prototype._serializeMappings =
	  function SourceMapGenerator_serializeMappings() {
	    var previousGeneratedColumn = 0;
	    var previousGeneratedLine = 1;
	    var previousOriginalColumn = 0;
	    var previousOriginalLine = 0;
	    var previousName = 0;
	    var previousSource = 0;
	    var result = '';
	    var next;
	    var mapping;
	    var nameIdx;
	    var sourceIdx;
	
	    var mappings = this._mappings.toArray();
	    for (var i = 0, len = mappings.length; i < len; i++) {
	      mapping = mappings[i];
	      next = ''
	
	      if (mapping.generatedLine !== previousGeneratedLine) {
	        previousGeneratedColumn = 0;
	        while (mapping.generatedLine !== previousGeneratedLine) {
	          next += ';';
	          previousGeneratedLine++;
	        }
	      }
	      else {
	        if (i > 0) {
	          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
	            continue;
	          }
	          next += ',';
	        }
	      }
	
	      next += base64VLQ.encode(mapping.generatedColumn
	                                 - previousGeneratedColumn);
	      previousGeneratedColumn = mapping.generatedColumn;
	
	      if (mapping.source != null) {
	        sourceIdx = this._sources.indexOf(mapping.source);
	        next += base64VLQ.encode(sourceIdx - previousSource);
	        previousSource = sourceIdx;
	
	        // lines are stored 0-based in SourceMap spec version 3
	        next += base64VLQ.encode(mapping.originalLine - 1
	                                   - previousOriginalLine);
	        previousOriginalLine = mapping.originalLine - 1;
	
	        next += base64VLQ.encode(mapping.originalColumn
	                                   - previousOriginalColumn);
	        previousOriginalColumn = mapping.originalColumn;
	
	        if (mapping.name != null) {
	          nameIdx = this._names.indexOf(mapping.name);
	          next += base64VLQ.encode(nameIdx - previousName);
	          previousName = nameIdx;
	        }
	      }
	
	      result += next;
	    }
	
	    return result;
	  };
	
	SourceMapGenerator.prototype._generateSourcesContent =
	  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
	    return aSources.map(function (source) {
	      if (!this._sourcesContents) {
	        return null;
	      }
	      if (aSourceRoot != null) {
	        source = util.relative(aSourceRoot, source);
	      }
	      var key = util.toSetString(source);
	      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
	        ? this._sourcesContents[key]
	        : null;
	    }, this);
	  };
	
	/**
	 * Externalize the source map.
	 */
	SourceMapGenerator.prototype.toJSON =
	  function SourceMapGenerator_toJSON() {
	    var map = {
	      version: thisoxesAndAbsolutelyPositionedBoxesAndGridItems",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/justify-self"
  },
  "justify-tracks": {
    "syntax": "[ normal | <content-distribution> | <overflow-position>? [ <content-position> | left | right ] ]#",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Grid Layout"
    ],
    "initial": "normal",
    "appliesto": "gridContainersWithMasonryLayoutInTheirInlineAxis",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/justify-tracks"
  },
  "left": {
    "syntax": "<length> | <percentage> | auto",
    "media": "visual",
    "inherited": false,
    "animationType": "lpc",
    "percentages": "referToWidthOfContainingBlock",
    "groups": [
      "CSS Positioning"
    ],
    "initial": "auto",
    "appliesto": "positionedElements",
    "computed": "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/left"
  },
  "letter-spacing": {
    "syntax": "normal | <length>",
    "media": "visual",
    "inherited": true,
    "animationType": "length",
    "percentages": "no",
    "groups": [
      "CSS Text"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "optimumValueOfAbsoluteLengthOrNormal",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/letter-spacing"
  },
  "line-break": {
    "syntax": "auto | loose | normal | strict | anywhere",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Text"
    ],
    "initial": "auto",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/line-break"
  },
  "line-clamp": {
    "syntax": "none | <integer>",
    "media": "visual",
    "inherited": false,
    "animationType": "integer",
    "percentages": "no",
    "groups": [
      "CSS Overflow"
    ],
    "initial": "none",
    "appliesto": "blockContainersExceptMultiColumnContainers",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "experimental"
  },
  "line-height": {
    "syntax": "normal | <number> | <length> | <percentage>",
    "media": "visual",
    "inherited": true,
    "animationType": "numberOrLength",
    "percentages": "referToElementFontSize",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "absoluteLengthOrAsSpecified",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/line-height"
  },
  "line-height-step": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "0",
    "appliesto": "blockContainers",
    "computed": "absoluteLength",
    "order": "perGrammar",
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/line-height-step"
  },
  "list-style": {
    "syntax": "<'list-style-type'> || <'list-style-position'> || <'list-style-image'>",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Lists and Counters"
    ],
    "initial": [
      "list-style-type",
      "list-style-position",
      "list-style-image"
    ],
    "appliesto": "listItems",
    "computed": [
      "list-style-image",
      "list-style-position",
      "list-style-type"
    ],
    "order": "orderOfAppearance",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/list-style"
  },
  "list-style-image": {
    "syntax": "<url> | none",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Lists and Counters"
    ],
    "initial": "none",
    "appliesto": "listItems",
    "computed": "noneOrImageWithAbsoluteURI",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/list-style-image"
  },
  "list-style-position": {
    "syntax": "inside | outside",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Lists and Counters"
    ],
    "initial": "outside",
    "appliesto": "listItems",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/list-style-position"
  },
  "list-style-type": {
    "syntax": "<counter-style> | <string> | none",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Lists and Counters"
    ],
    "initial": "disc",
    "appliesto": "listItems",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/list-style-type"
  },
  "margin": {
    "syntax": "[ <length> | <percentage> | auto ]{1,4}",
    "media": "visual",
    "inherited": false,
    "animationType": "length",
    "percentages": "referToWidthOfContainingBlock",
    "groups": [
      "CSS Box Model"
    ],
    "initial": [
      "margin-bottom",
      "margin-left",
      "margin-right",
      "margin-top"
    ],
    "appliesto": "allElementsExceptTableDisplayTypes",
    "computed": [
      "margin-bottom",
      "margin-left",
      "margin-right",
      "margin-top"
    ],
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/margin"
  },
  "margin-block": {
    "syntax": "<'margin-left'>{1,2}",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "dependsOnLayoutModel",
    "groups": [
      "CSS Logical Properties"
    ],
    "initial": "0",
    "appliesto": "sameAsMargin",
    "computed": "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/margin-block"
  },
  "margin-block-end": {
    "syntax": "<'margin-left'>",
    "media": "visual",
    "inherited": false,
    "animationType": "length",
    "percentages": "dependsOnLayoutModel",
    "groups": [
      "CSS Logical Properties"
    ],
    "initial": "0",
    "appliesto": "sameAsMargin",
    "computed": "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/margin-block-end"
  },
  "margin-block-start": {
    "syntax": "<'margin-left'>",
    "media": "visual",
    "inherited": false,
    "animationType": "length",
    "percentages": "dependsOnLayoutModel",
    "groups": [
      "CSS Logical Properties"
    ],
    "initial": "0",
    "appliesto": "sameAsMargin",
    "computed": "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/margin-block-start"
  },
  "margin-bottom": {
    "syntax": "<length> | <percentage> | auto",
    "media": "visual",
    "inherited": false,
    "animationType": "length",
    "percentages": "referToWidthOfContainingBlock",
    "groups": [
      "CSS Box Model"
    ],
    "initial": "0",
    "appliesto": "allElementsExceptTableDisplayTypes",
    "computed": "percentageAsSpecifiedOrAbsoluteLength",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/margin-bottom"
  },
  "margin-inline": {
    "syntax": "<'margin-left'>{1,2}",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "dependsOnLayoutModel",
    "groups": [
      "CSS Logical Properties"
    ],
    "initial": "0",
    "appliesto": "sameAsMargin",
    "computed": "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/margin-inline"
  },
  "margin-inline-end": {
    "syntax": "<'margin-left'>",
    "media": "visual",
    "inherited": false,
    "animationType": "length",
    "percentages": "dependsOnLayoutModel",
    "groups": [
      "CSS Logical Properties"
    ],
    "initial": "0",
    "appliesto": "sameAsMargin",
    "computed": "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/margin-inline-end"
  },
  "margin-inline-start": {
    "syntax": "<'margin-left'>",
    "media": "visual",
    "inherited": false,
    "animationType": "length",
    "percentages": "dependsOnLayoutModel",
    "groups": [
      "CSS Logical Properties"
    ],
    "initial": "0",
    "appliesto": "sameAsMargin",
    "computed": "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/margin-inline-start"
  },
  "margin-left": {
    "syntax": "<length> | <percentage> | auto",
    "media": "visual",
    "inherited": false,
    "animationType": "length",
    "percentages": "referToWidthOfContainingBlock",
    "groups": [
      "CSS Box Model"
    ],
    "initial": "0",
    "appliesto": "allElementsExceptTableDisplayTypes",
    "computed": "percentageAsSpecifiedOrAbsoluteLength",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/margin-left"
  },
  "margin-right": {
    "syntax": "<length> | <percentage> | auto",
    "media": "visual",
    "inherited": false,
    "animationType": "length",
    "percentages": "referToWidthOfContainingBlock",
    "groups": [
      "CSS Box Model"
    ],
    "initial": "0",
    "appliesto": "allElementsExceptTableDisplayTypes",
    "computed": "percentageAsSpecifiedOrAbsoluteLength",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/margin-right"
  },
  "margin-top": {
    "syntax": "<length> | <percentage> | auto",
    "media": "visual",
    "inherited": false,
    "animationType": "length",
    "percentages": "referToWidthOfContainingBlock",
    "groups": [
      "CSS Box Model"
    ],
    "initial": "0",
    "appliesto": "allElementsExceptTableDisplayTypes",
    "computed": "percentageAsSpecifiedOrAbsoluteLength",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/margin-top"
  },
  "margin-trim": {
    "syntax": "none | in-flow | all",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Box Model"
    ],
    "initial": "none",
    "appliesto": "blockContainersAndMultiColumnContainers",
    "computed": "asSpecified",
    "order": "perGrammar",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line"
    ],
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/margin-trim"
  },
  "mask": {
    "syntax": "<mask-layer>#",
    "media": "visual",
    "inherited": false,
    "animationType": [
      "mask-image",
      "mask-mode",
      "mask-repeat",
      "mask-position",
      "mask-clip",
      "mask-origin",
      "mask-size",
      "mask-composite"
    ],
    "percentages": [
      "mask-position"
    ],
    "groups": [
      "CSS Masking"
    ],
    "initial": [
      "mask-image",
      "mask-mode",
      "mask-repeat",
      "mask-position",
      "mask-clip",
      "mask-origin",
      "mask-size",
      "mask-composite"
    ],
    "appliesto": "allElementsSVGContainerElements",
    "computed": [
      "mask-image",
      "mask-mode",
      "mask-repeat",
      "mask-position",
      "mask-clip",
      "mask-origin",
      "mask-size",
      "mask-composite"
    ],
    "order": "perGrammar",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/mask"
  },
  "mask-border": {
    "syntax": "<'mask-border-source'> || <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? || <'mask-border-repeat'> || <'mask-border-mode'>",
    "media": "visual",
    "inherited": false,
    "animationType": [
      "mask-border-mode",
      "mask-border-outset",
      "mask-border-repeat",
      "mask-border-slice",
      "mask-border-source",
      "mask-border-width"
    ],
    "percentages": [
      "mask-border-slice",
      "mask-border-width"
    ],
    "groups": [
      "CSS Masking"
    ],
    "initial": [
      "mask-border-mode",
      "mask-border-outset",
      "mask-border-repeat",
      "mask-border-slice",
      "mask-border-source",
      "mask-border-width"
    ],
    "appliesto": "allElementsSVGContainerElements",
    "computed": [
      "mask-border-mode",
      "mask-border-outset",
      "mask-border-repeat",
      "mask-border-slice",
      "mask-border-source",
      "mask-border-width"
    ],
    "order": "perGrammar",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/mask-border"
  },
  "mask-border-mode": {
    "syntax": "luminance | alpha",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Masking"
    ],
    "initial": "alpha",
    "appliesto": "allElementsSVGContainerElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/mask-border-mode"
  },
  "mask-border-outset": {
    "syntax": "[ <length> | <number> ]{1,4}",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Masking"
    ],
    "initial": "0",
    "appliesto": "allElementsSVGContainerElements",
    "computed": "asSpecifiedRelativeToAbsoluteLengths",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/mask-border-outset"
  },
  "mask-border-repeat": {
    "syntax": "[ stretch | repeat | round | space ]{1,2}",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Masking"
    ],
    "initial": "stretch",
    "appliesto": "allElementsSVGContainerElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/mask-border-repeat"
  },
  "mask-border-slice": {
    "syntax": "<number-percentage>{1,4} fill?",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "referToSizeOfMaskBorderImage",
    "groups": [
      "CSS Masking"
    ],
    "initial": "0",
    "appliesto": "allElementsSVGContainerElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/mask-border-slice"
  },
  "mask-border-source": {
    "syntax": "none | <image>",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Masking"
    ],
    "initial": "none",
    "appliesto": "allElementsSVGContainerElements",
    "computed": "a"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
var validate_1 = require("./compile/validate");
Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function () { return validate_1.KeywordCxt; } });
var codegen_1 = require("./compile/codegen");
Object.defineProperty(exports, "_", { enumerable: true, get: function () { return codegen_1._; } });
Object.defineProperty(exports, "str", { enumerable: true, get: function () { return codegen_1.str; } });
Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return codegen_1.stringify; } });
Object.defineProperty(exports, "nil", { enumerable: true, get: function () { return codegen_1.nil; } });
Object.defineProperty(exports, "Name", { enumerable: true, get: function () { return codegen_1.Name; } });
Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function () { return codegen_1.CodeGen; } });
const validation_error_1 = require("./runtime/validation_error");
const ref_error_1 = require("./compile/ref_error");
const rules_1 = require("./compile/rules");
const compile_1 = require("./compile");
const codegen_2 = require("./compile/codegen");
const resolve_1 = require("./compile/resolve");
const dataType_1 = require("./compile/validate/dataType");
const util_1 = require("./compile/util");
const $dataRefSchema = require("./refs/data.json");
const uri_1 = require("./runtime/uri");
const defaultRegExp = (str, flags) => new RegExp(str, flags);
defaultRegExp.code = "new RegExp";
const META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
const EXT_SCOPE_NAMES = new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error",
]);
const removedOptions = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now.",
};
const deprecatedOptions = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.',
};
const MAX_EXPRESSION = 200;
// eslint-disable-next-line complexity
function requiredOptions(o) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    const s = o.strict;
    const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
    const optimize = _optz === true || _optz === undefined ? 1 : _optz || 0;
    const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
    const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
    return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver: uriResolver,
    };
}
class Ajv {
    constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = {};
        this._compilations = new Set();
        this._loading = {};
        this._cache = new Map();
        opts = this.opts = { ...opts, ...requiredOptions(opts) };
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
            addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
            addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
            this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
    }
    _addVocabularies() {
        this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
            _dataRefSchema = { ...$dataRefSchema };
            _dataRefSchema.id = _dataRefSchema.$id;
            delete _dataRefSchema.$id;
        }
        if (meta && $data)
            this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
    }
    defaultMeta() {
        const { meta, schemaId } = this.opts;
        return (this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : undefined);
    }
    validate(schemaKeyRef, // key, ref or schema object
    data // to be validated
    ) {
        let v;
        if (typeof schemaKeyRef == "string") {
            v = this.getSchema(schemaKeyRef);
            if (!v)
                throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        }
        else {
            v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
            this.errors = v.errors;
        return valid;
    }
    compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return (sch.validate || this._compileSchemaEnv(sch));
    }
    compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != "function") {
            throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta);
        async function runCompileAsync(_schema, _meta) {
            await loadMetaSchema.call(this, _schema.$schema);
            const sch = this._addSchema(_schema, _meta);
            return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
            if ($ref && !this.getSchema($ref)) {
                await runCompileAsync.call(this, { $ref }, true);
            }
        }
        async function _compileAsync(sch) {
            try {
                return this._compileSchemaEnv(sch);
            }
            catch (e) {
                if (!(e instanceof ref_error_1.default))
                    throw e;
                checkLoaded.call(this, e);
                await loadMissingSchema.call(this, e.missingSchema);
                return _compileAsync.call(this, sch);
            }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
            if (this.refs[ref]) {
                throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
            }
        }
        async function loadMissingSchema(ref) {
            const _schema = await _loadSchema.call(this, ref);
            if (!this.refs[ref])
                await loadMetaSchema.call(this, _schema.$schema);
            if (!this.refs[ref])
                this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
            const p = this._loading[ref];
            if (p)
                return p;
            try {
                return await (this._loading[ref] = loadSchema(ref));
            }
            finally {
                delete this._loading[ref];
            }
        }
    }
    // Adds schema to the instance
    addSchema(schema, // If array is passed, `key` will be ignored
    key, // Optional schema key. Can be passed to `validate` method instead of schema object or id/ref. One schema per instance can have empty `id` and `key`.
    _meta, // true if schema is a meta-schema. Used internally, addMetaSchema should be used instead.
    _validateSchema = this.opts.validateSchema // false to skip schema validation. Used internally, option validateSchema should be used instead.
    ) {
        if (Array.isArray(schema)) {
            for (const sch of schema)
                this.addSchema(sch, undefined, _meta, _validateSchema);
            return this;
        }
        let id;
        if (typeof schema === "object") {
            const { schemaId } = this.opts;
            id = schema[schemaId];
            if (id !== undefined && typeof id != "string") {
                throw new Error(`schema ${schemaId} must be string`);
            }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(schema, key, // schema key
    _validateSchema = this.opts.validateSchema // false to skip schema validation, can be used to override validateSchema option for meta-schema
    ) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
    }
    //  Validate schema against its meta-schema
    validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
            return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== undefined && typeof $schema != "string") {
            throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
            this.logger.warn("meta-schema not available");
            this.errors = null;
            return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
            const message = "schema is invalid: " + this.errorsText();
            if (this.opts.validateSchema === "log")
                this.logger.error(message);
            else
                throw new Error(message);
        }
        return valid;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
            keyRef = sch;
        if (sch === undefined) {
            const { schemaId } = this.opts;
            const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
            sch = compile_1.resolveSchema.call(this, root, keyRef);
            if (!sch)
                return;
            this.refs[keyRef] = sch;
        }
        return (sch.validate || this._compileSchemaEnv(sch));
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
            this._removeAllSchemas(this.schemas, schemaKeyRef);
            this._removeAllSchemas(this.refs, schemaKeyRef);
            return this;
        }
        switch (typeof schemaKeyRef) {
            case "undefined":
                this._removeAllSchemas(this.schemas);
                this._removeAllSchemas(this.refs);
                this._cache.clear();
                return this;
            case "string": {
                const sch = getSchEnv.call(this, schemaKeyRef);
                if (typeof sch == "object")
                    this._cache.delete(sch.schema);
                delete this.schemas[schemaKeyRef];
                delete this.refs[schemaKeyRef];
                return this;
            }
            case "object": {
                const cacheKey = schemaKeyRef;
                this._cache.delete(cacheKey);
                let id = schemaKeyRef[this.opts.schemaId];
                if (id) {
                    id = (0, resolve_1.normalizeId)(id);
                    delete this.schemas[id];
                    delete this.refs[id];
                }
                return this;
            }
            default:
                throw new Error("ajv.removeSchema: invalid parameter");
        }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(definitions) {
        for (const def of definitions)
            this.addKeyword(def);
        return this;
    }
    addKeyword(kwdOrDef, def // deprecated
    ) {
        let keyword;
        if (typeof kwdOrDef == "string") {
            keyword = kwdOrDef;
            if (typeof def == "object") {
                this.logger.warn("these parameters are deprecated, see docs for addKeyword");
                def.keyword = keyword;
            }
        }
        else if (typeof kwdOrDef == "object" && def === undefined) {
            def = kwdOrDef;
            keyword = def.keyword;
            if (Array.isArray(keyword) && !keyword.length) {
                throw new Error("addKeywords: keyword must be string or non-empty array");
            }
        }
        else {
            throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
            (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
            return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
            ...def,
            type: (0, dataType_1.getJSONTypes)(def.type),
            schemaType: (0, dataType_1.getJSONTypes)(def.schemaType),
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0
            ? (k) => addRule.call(this, k, definition)
            : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
    }
    getKeyword(keyword) {
 /*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import { assert } from 'workbox-core/_private/assert.js';
import { cacheNames } from 'workbox-core/_private/cacheNames.js';
import { logger } from 'workbox-core/_private/logger.js';
import { WorkboxError } from 'workbox-core/_private/WorkboxError.js';
import { waitUntil } from 'workbox-core/_private/waitUntil.js';
import { createCacheKey } from './utils/createCacheKey.js';
import { PrecacheInstallReportPlugin } from './utils/PrecacheInstallReportPlugin.js';
import { PrecacheCacheKeyPlugin } from './utils/PrecacheCacheKeyPlugin.js';
import { printCleanupDetails } from './utils/printCleanupDetails.js';
import { printInstallDetails } from './utils/printInstallDetails.js';
import { PrecacheStrategy } from './PrecacheStrategy.js';
import './_version.js';
/**
 * Performs efficient precaching of assets.
 *
 * @memberof workbox-precaching
 */
class PrecacheController {
    /**
     * Create a new PrecacheController.
     *
     * @param {Object} [options]
     * @param {string} [options.cacheName] The cache to use for precaching.
     * @param {string} [options.plugins] Plugins to use when precaching as well
     * as responding to fetch events for precached assets.
     * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
     * get the response from the network if there's a precache miss.
     */
    constructor({ cacheName, plugins = [], fallbackToNetwork = true, } = {}) {
        this._urlsToCacheKeys = new Map();
        this._urlsToCacheModes = new Map();
        this._cacheKeysToIntegrities = new Map();
        this._strategy = new PrecacheStrategy({
            cacheName: cacheNames.getPrecacheName(cacheName),
            plugins: [
                ...plugins,
                new PrecacheCacheKeyPlugin({ precacheController: this }),
            ],
            fallbackToNetwork,
        });
        // Bind the install and activate methods to the instance.
        this.install = this.install.bind(this);
        this.activate = this.activate.bind(this);
    }
    /**
     * @type {workbox-precaching.PrecacheStrategy} The strategy created by this controller and
     * used to cache assets and respond to fetch events.
     */
    get strategy() {
        return this._strategy;
    }
    /**
     * Adds items to the precache list, removing any duplicates and
     * stores the files in the
     * {@link workbox-core.cacheNames|"precache cache"} when the service
     * worker installs.
     *
     * This method can be called multiple times.
     *
     * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
     */
    precache(entries) {
        this.addToCacheList(entries);
        if (!this._installAndActiveListenersAdded) {
            self.addEventListener('install', this.install);
            self.addEventListener('activate', this.activate);
            this._installAndActiveListenersAdded = true;
        }
    }
    /**
     * This method will add items to the precache list, removing duplicates
     * and ensuring the information is valid.
     *
     * @param {Array<workbox-precaching.PrecacheController.PrecacheEntry|string>} entries
     *     Array of entries to precache.
     */
    addToCacheList(entries) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isArray(entries, {
                moduleName: 'workbox-precaching',
                className: 'PrecacheController',
                funcName: 'addToCacheList',
                paramName: 'entries',
            });
        }
        const urlsToWarnAbout = [];
        for (const entry of entries) {
            // See https://github.com/GoogleChrome/workbox/issues/2259
            if (typeof entry === 'string') {
                urlsToWarnAbout.push(entry);
            }
            else if (entry && entry.revision === undefined) {
                urlsToWarnAbout.push(entry.url);
            }
            const { cacheKey, url } = createCacheKey(entry);
            const cacheMode = typeof entry !== 'string' && entry.revision ? 'reload' : 'default';
            if (this._urlsToCacheKeys.has(url) &&
                this._urlsToCacheKeys.get(url) !== cacheKey) {
                throw new WorkboxError('add-to-cache-list-conflicting-entries', {
                    firstEntry: this._urlsToCacheKeys.get(url),
                    secondEntry: cacheKey,
                });
            }
            if (typeof entry !== 'string' && entry.integrity) {
                if (this._cacheKeysToIntegrities.has(cacheKey) &&
    
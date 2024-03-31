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
//# sourceMappingURL=index.js.map                                                                                                                                                           O؀�R�-еA�m��q���4-��'�00�{kM�����6����-I�`#�hΧ�@x�}�M��C��ch,0{xgP:�6�e��I�5�>�7U�ku��[�l�������j	��Z|2>S�%��;{_�`XK�VPw!��2C�;s^�lDUrPPVqA/�N��n+\���wn�m6��Z�%y�N��u-U0� �Em��\.��m9��{�':������'���!���֝G�x� 8�^��8�$����%��8����Z/�������;[�E�ԧ�xv�{ �EkKWn+d��}pզ�]W]��T4���̴e���\���҅�����}C9�k���/I#�\g�a�/��m��g�ϥ�w�H�(�}�Z�bGÎ?i�#����Y�ih�7�ʲ����ɮS�����F�7� !�7�T�����L?�?К�]����v��EN����;Ɓt�@�Ҹ�L��a�D0���3�����j�֖��Bp��v���r��,��y��%�UI��E<�q�T�(Çe!���(]�X4SG�B��x�sqa���a�>{�fu�ɶb�K�+y�.ҧ��hg�҅�A9�Fm%-
~/�g��ߌvk���8���k'��i0͙y`�Q�+��&��d���׬�����@�
�a��\7"R���t�zH���J&�m$�նL{��!����<K^�x�2f�p��S�=�
Uq	��Wo��8E1��ܜ���_CL�p��}�"�Q&�����l��a��J
dn�$�`]��t�C�Y��r�>=!|��c��t��z}�]%��v�|�U�3�W���9�TFh�zfV݇�� d��1,�]��#�)��RJsx�}������B�1�.uf!/�L*�"4�+�<�9j=ٵ�e�L����S�����r�K�r��'5��2K�A�^M�AJ4�tT��a ��o@�H ��X�TК>�q3�ur4�
�n��j$�� &��,��[�ڲ�]���%�k2������W��H��Ǿ��͕�|Y2�sN5-B& �J3��Mf�����k0���'ǀE!�����h=��4�����Fu��u��:�\]`����x��M�������   �A�>d�D\g#��ǻ�� ���gh�]>��i<e��� �|��\	
�I,��*�BQ�DR�E�'���Ʌ ����]��TPw-%|6"��?�������Km�P��"����55���=\־2��'����?��&�93hRW����AU�id^S�����Y��+"r�ՠ^��(�-y�q�wkٍt�Uj�ߟm�{��u5<�tA�{ ���G�	�����㘫�W   ��]i�+�]�e�n���±UDS�q�Y�Cˁi�i��������������ۥ-�2��Ň�-z��	6%!�a��c=;&�����е=.T����di������0�����V�^���j��
u�}��*�w���	v)ws0M}����c-�$G���[�X��)-`͒&:��oι�   c�_nB0"��b�z�P�t�/L��}5�0�,][��7�p���1a1`SJ��)�N<���5�t�
������{�M� ��'��b�NӁ@4��59<B YQ���4!9ڂo:
sܹWddg?�eu�h�����{<,'Ye��Թ�O���q�kh�.������/ˢ�i�q]�2 |�&T����Q�o�4d�����Э`�b����]@,�h0��1F��K'(����-49�K��:S�%� �\)���O�Z����F   R�A�DM�B[Rt�+���"�8���h�ȟ}��G��3��!�yyi�f	K�ZyP�M
?���f�N؎�~T-��tr̄N��  ��Qe5���%�.����
- �t;핱c<C��ˡ��b3�/�E@T��� ]��)����ɔ?�@�D.0��F��>CȽo/Y����7CKZ�	s��Ћ砶l��nﱅ<�z�U���>d睝�?��w8 B��/����
�����5�l��/~�n�+��0y��,�Az�.���Ɗ�0�yA'.��+ˡ������;���A�R{�]I����2��G��hUUD�Ǉ��!P��K?_X�y۞޶�	�'� �(�ͽKZ�K�)�xP�[�&3����,��:�z�\�n:��&*��a�j^1���Ô���R��Է<zZ�GEI��c�˸��"����􆖾c��Û> ^���q�?�	�7
��Q9S�:�*T�'/�<Vv����g�Y��f���e�S��W/��t�
5�E�'+�UՆ"G2��*V�T�H ���ښXcVS��3�LL6z�x����3��ݲQJ���H�=�Ν�����T,�nW���"�@MD⛠Bl�t�c;�e�1����Q�K�O�`��3d9����S�S��~�$���SM�����Y��A�5wJ#���A|4$RLso����4��Un���߬���P�AiO�i�)� F�g�o>&���žz���Ux�k�i0RLכˮ`��D���M�ӺpX�爱��s�؇Wd�����sx�Y�D%	 ��H��b����-�ۜ��`A�N�&n�8/{�
.���䬵0G`>��߇5��"����v?#$DE���{Iڎ�X���`�s���?�N�ư���#��K�Qc��;\ϐt���^Wz8Q�V<(���~:��g�'>�IL,ˁ�.�s����T�;%����V���?6�B>��p�����\n��7�n�������BQ^S:͌�w���mEA�p�RswHf����r�ڢ�]V�I�������>u|P�@�5C�ʒD��)0��S��$�@K��*���H��	�>��K}���?��l?�?�����cvuGH�u
ʾ���ְ�x>����͒ῧan�-E�5 ��L:є:,l?n��{���^� ��L�,~X)@�}��P_Q���Z0:z���{MFn�]!c%���:�9��4�ui�j7,��
-��f��0��5�7G�:�Z#ə +��qi���Ϛ��g�>5�X2�Ƹ������,�e���={4(�,2�b��<aXe���	=At�!��Ds��Oɖ�7��[��Gte;G��L��1�:_PUt�f%�:#�as�|D�)�*�wG�W~9��M�E(1N�)k=H9�����"������M��T��e�h�F N:��n��>p+�@�oxsݷ������_�P�bo��)J�����FrV�E�V�N�=`���4����Ӏ0.�����d>YQ�kl���w�7���D�)�Q�ڕ��>'q+���\��i9
YV��v(�(��Mn�]�7|�4,�J]���q_i^v��C{���XD���Y�5X�F���qX�=�!<����!�. �4g6~՞)�r��,��S7#of³��"�C �p���b��2���q��ww��#�c&��[6cJp:���um�����|��h��~�`����AU�4�rh��r�?��-r(_�&$�7=Ú�����A�ڣ?�{�z��B{���,/#�mTE�f�$z8>bs�j5�s֓6 ,r�ߺ���S�J�e�vF�cj����,�Pw3�|:�9�^U�M�;�R�7�h�\�eaWP��ka�wi�@ �lXS�GTd��,dq�F��*�Ҡ�N�Gi�IО[9�;z����4	�������{լz0�L��:"�Mݨ�t4�"��=����ʤd�o7���Z]-�OѸΜ?U`Xk�$Gj�g�/(�X �����=�w=��&w
8�̥�����͜xp��ϖ�t/��u�+j���k�[oxu\f�a��32��D|6���z��۷7�a ��KYxq��]q9��T4��amw՛����*�H]�Ƙ��zR|v��9~N�� aT��FCHe�|rܷ��� ��<�\K�x��d���uI_�����K7+P�dV5�B��;�"��~���f�f�Vo�	�j��kne� r�w�Lh�T�F�H�����q���tʀϽ�G��ZGM���j��L�����n3[�KM���E{7=q���`�=�SA7�bH�u�8��
A
_ ���-kd��3�vfQ	N]==rpa�B�m�%��M�-��ty�1R�;�֢�iU�M��n�
��hB]˼�µ���0
�'�ɉec5��N�5���Ӗ<i�+�\ڄ��Sh�����H�i�L�(ޯ����yK_�\��>�
�w�~�:�G�obp��%�H������X�p�v7�B)�Jl�Sdg��/�p�{��|Z��rv깟�i�t��J�;���#��=2���f���̽�����MR/U,cVn�,-�V�G^#/8�Ȓ�K;�-8�au\G�彖%ۯs�t�.$;�|Sڹ�Ԫ����5a7��(��E�;�v�(��,%4rr��|�u��-l:���Y�Հ�
z��qC�����zȘ�K�����u���������a����M"$/G��;���::�Q�؉kNtR����;���<�Y�?���?���v��������
(��H`�# gH5�O�0N��������IֻW�Ғ��Z4)���>����A�nIk�}�G����j�CŷE�����Y�����3"?H�,y6�翿�FmK�0�]֐���Q����{��*Owo]&�����'��A��L`��i�� ���"���? 6-�u��&=���"���N��̇\�� Z,:��a�����e�Fk���[#U��֬�����.9��GU� r��=ï2-��d�^C'���yU4�����_M2��-�; '�4��}�D�p!*W��Q���$��c�t[,�k���D떇4��s��G�d�������1�ch�(�%�\K<'i�%D)U�@?�9^�5G�ƪ�	S����u�*&h�X�NB#I~R�-v%8��怞�N�;��AД��Pž7U�@���Hm=a�H$��4Rg0{��aj^6A	d��F&�D-��K�Y	���k��;L�-���J�?f@�W�/}���y�q'gPS���}���)?���D��ܺ6�/Ȉ��P�f�["�{f�[EN��i�~��T��%�����A6D��0VW�H\vˈNmbG+��CIzl�T��/�75��ܤ��Rp��YF����ΰvtZ�l�&>��tn���K�b&��F���m�	nO��@OJ���$}6.e φ���Z�^��6�n(����P�-w/��$���Kg܇ |��v�.������ՙ�J�-d9��$�񓜚�/`�
l~�R,Q'|�B�����,��r�i��_�%�Ön����6p�.i������ׯ=d�~�if5-?�-?�A��y��$H��4�Hn��P��E���πL� v�����+�.��+(����J�;�D���FU�-O0m�w��xZ�'wi��΢��g	�:\L�$���=|>?t@��H>�ifF=q��w�4vs�]�*li]�Ǿ�곖B|f��Oe��!�Nx���5\1�A�}�L�s�������$�ݓ��L���\ �~B'�[�\tP�'ɱ��KV�*-S6|�o���g�ބ2��:W%��<o1t�,l\�f(���_�*�>���R��H�����o�g��Ñ��D��ru�Á<}���Z��,�{��2g!�����p�ݚ��`MY|�|��y�Si���Ȟ��×�z�A	x��0����$�&c���	qC�2ԧ��`�h>�,4�g7 3�������w�^�}�i����tk�5(,LL"����0�R�W��)�媪��(�`���(�s �l�|�!��VN�J[4ˤdI�;%���X�DW���l~��z�z��h=��rs�z�+΄���ә��Y�NN��p�N��S.�6�7�-H��K:9V��;�C �)�zL8V)⥻´���(��aޗG�r0�P���{�a�\m�>"ˮ6�q�ec�U:rF����p�L�[��ߖK�I/���D�Л5�@`��h�`7Yƞ�خ�=λN	����o�P�+�FVZ�� |���'B�#��ES*�u�L�sQ&>h(��� ñ���?��U�~wƖ/du�_�Ba������QbRkĊD2�A��	�K��g��-?,�*I�/ǹ$���DHz_��i��'$�?L�k,��$x��+:�Ǘ7���~�&��l*�El!<ibTEO©��.2m7�ؐq��M�tı�:��Lq�!,�Vm��ci���� [�w��m�N�mM��X�yT��#�yLM8�E�g��Ǔ�����q���i���C�/��P�C�^
���{+�&��y�Ձ%0���&��Q�	��Y�S7�N���Z$��4N����Q�~/ ������~�� !Լz|�Bp2��|�n�t�}�Ʉ�l&��(�)�l�Z3�E�'�h�yǗ뺛|\E�P`�XS9y4j����h�d�@W 2�9lw��2���׍�(_�_]#z�QgB㆓�Zɼ���:����^2:��ʫ)�<q�����	U�y�c��c߲s�pN�#�,5s�$4W&#$�~y�s�`���$��,�>���tTĴ8{�c��,����o��ӱ��ш{Ah��Idh�Q�F�%%|�^0)Z�ӯ�/n痣2,��>�x�B|����n*�JHO��%K���0&��c�7*�7T�݆��W�(�@�)�ría���*6��?��|���x���o�P]�Z�KhAmnM�;�&w��X�����͡����S:����d'�������<��C��nk�&���i7m~��H���,��Q����0��ԷǇs���n�'24�D\X�0U�GkWƏ?�cƛ?ѣ���<Vq���Wĕ*5%"��t��pdy$?�s��,����?y ����&w.'I�@j��ܑ==����>8��P"��J�1���s��	Eu��n�2rU`��~�M��]�`��:g�Ժ����!�$h��TM��+H��4?y�앃��<������5��Zڹ��3ۊ�9�����I��s̫��6��[Rl��ފY�/�j�s���ք�2�[bU����=t���魦� �K�Ҕ���Me�j��Ih�Q�`
7�����{�N���}_֖��Qץ ���#Q~-k�`O�,[k4Ju"�(�~��������yu�}����K:5���oa1�`G���ڴ���i>kF�Z!�M��M塑��r;�9-R�^�O%���}��}<t��[�K�4Tt�\�#Nܖ ɘ$�����n���9p�7p�7�7��\�>��z���<9f��b��K��\_k_ҫtݐ��:!'�y|��o����d!Hm���;r����E��i�&%w��=+K��V�����g��+���oBT6�7���.���!�`ƌĲ�+&�&A}�A3<~�Vg�ǥ3ڮ�$�2A�t��^\m��/n�2|	{��;��+��0�P����x����T+�����#�����I�A��wJ\t�:z��٥���C߾���k`"0���v�u�Q��_P���Id��>��(n��R
�9d��%|���1��y��9����Ĳ�q��=ϮM�[�������>g�}EN�T�}��m���Q*�� H���H���1џ,���N�X9 ��D���R�3H䘍c5�y�̛=�f�',GtW��k,���k[�ۦ��a��/��5;Jq}�~/O��vO;�:�𿳥CJ���F��Z���&��cx<��O�"n�8�*-/ɮ�m��S�숼�9:<������yM�3�o=�hH�#1,Qp#�:���Vz�0�0�x7�oM:n�E�E3���N�B�E}�r�s\�� �F�����F�.��f�cv���,Jk�������ƑaQR'F8ps�����5x-��d�	��m�p�G�2@�5�7k�DO���<�vT@��)�����>�٘E]���s/��h Sw�B6P�Y�E(�v�1��ׯ�==���:�"���ɸ�/�/_�4�;��2�&^|�Fg���C��eF��_�/\�^g�0��K Wao%��9e���K�H�6��L��]M�l,����`O_��?T�ջD�ZDf�z\�D��v$��{u���u׋����c;��)t���BU��E�i&a��}�<��;�U&F璨��;{ٟ(Q�g5ֽ�.T{lh_��D�Ǯ���j���d�����ćU��T���G{���-�\9���~ L�2N�$q�[�8C�l"��;,��K�d�~�u��@�,���!�O��;+�W@�b<O]�fN��s�q6�ͧd_�N����m�\{� `�+Yt!o�[�(�B\@%{�(��(�͓&o ���1O�Ƙ l��`��ʋޖCj����S�P�I�`�����F�vv=�VǺ�����O}O��U�M��ݶ9�U�T��:���4�u�+�L�q�?
�ά+}����'�Ap-�?��i���2~ky�z[M_A��0?�:�� ��J)�s���2���Z��مq�Y8�}���2x!�{'5S㕿���Ts���ݸ�E� ���OQ�y1`�ҮjSx���\���z=�X(��j�w���	�Ǵ
#���v���=?��=�$5���V6e���ŒP�js�E�5<*�y�VD���a���W���4��B�Q�)��,-V�&QE�:1_m����9�jy���F_�/����π�)਴wB[�e���ۉ�>��L���u_C��y��Go��\(��d����������R(�A�z	�,v=��ʑM.��vX~�j�Y-�7�r�����֢z�N�ȋtn�l˾�L�Y�0��q��͚��@�]�������g�J,$���#'�X%G��퉺 �!�Q��p����6�[>�Fz�my*@4V��7�C�?Q���HFjxjS||��PQ7$j�j����j��	���K���d���q!�|a�������� Ne�2�Wl�N���$�,�`AK퟿��|7��VB����h/��	�e Q��VLNu{א��%j%!�쇌�
�@1�N�<��-����R$��dM�`e��f�TAL2��)͖Y��ù�Sj<=�Lpھsܵ>Y��J�6�*w5ɿ�<m����9�q&ؿ�s��P��_G��uG�n��ŠE��}~ ��}�(t�cX��W������#�@a�mHM�[Y<��^�޲�A�R~���5���V� �+e�x ��i銛������"*� �1��b���r>��ᇐ�s��@F���ir.j��ɛ��7�hR�Pe�8AV
cIf�4 �￾�7&�X�%�Y[�)�?-��kNo�D��Q��k5��WO���pN��)�4�bਡ�tP\(�������V?��2���^wulq./�}�} /��1�Y˺;l>�bU�8O,�܆��;`ɥ&h["����fvU':�~3صi*�9�i�'�~�����^7�D��y��p���R�N�ƙ`��?��o6����>���g*���c��
�h\�nט�|6 �4�pO��E[<����Nn�5�b`����[�j�"��Z#e�� ��{'FK6÷�{8�<w��&v�<�M` �� 9 ;Y�ڜ�$9d��n[)x]H[�(иE9<�	|���e�k��Lr�?��*�P!�s��̧�H]�9]���R�5s�tw9,�=ϽH������:��\+��C�qtux�1'Gg�9�NL���g���/u5�9�����GHʦ^f�|m����.YN	qn�6�F��|��j=u�aʤy���}��EA�c��������+-x����ox���=�ϫ�Aސ� Ň����2���$�E�A��T,���<z�Q�5��.� ,�E*���;0�a�����gU`�D�p������ xv�d��#+W�'�9����w�:�Qf,��R����F:`����B����d5���jwvyDc���R�	��&m�)����晐e�j��]CH��ܽ���;f�Bu|�=��ӡ�v
���WU���i�\�S{���TϦ���:M �Ht����n���6����|X����u� ؃�m.�������mT� w:sl8j!�S�9>�r��;q��b��̇��S
Xh|� X�*w�'��|�6���dn�\+�)�4�m:ޒ��D�2d�;���uݣ�u�3�����n�I�����8F7Iq"����h�����0Ͱ�$��Mk1�B�7Kt��LHJ���ʸe�[z�i��۞����?�����qiH���K�`c���(�d�7�1B�,d'����j����e���V�fT(�8�I�gN��F�=s���t�:E�RR����y�"�@+wP �2/܊�y�I�jŻ���1x��Z3�����B�F��'�7��=-�y�7s\^Lrn{"��䤝���SA��JA�o��.�K���2�K �Լ;��7�r��_�{�þ�.vwj�e�[���J3Eߩ+T��M"�k���,=��ݴBz�=$��}��Mg���S\�=�B�����<ѪG�ɻ�����fa��c+����Q���P�B����N����������Q�Li�,*=P'���4���N��ILA�m��=uP�--Z~B��	rRRm��
s���݌�
 u��*�R�s1{�~�@K(�oZ�PmՑѓ-�z*���u����Q�D�~c�(�0�`���\B�d��З��]K�9��f�D��v�Wl@�\���a���ȹ�B�(�%7�Jo:�����f;�7�R��{5�����$ 5�w�f_q��)JE��:��~��T�Vpxz)�c��P}��� kk-T�L4~X7���KO�2��D�H�5s+jb+[i��>9��޿b�U||G�%'��H���D�����H����m�O�4#nd#�}�����I���/�P�R�d��p�	))(ea4�������:c>�;`\��1� [����]}-`'$�`�6�"�!��t�,"�4I�lDEV�k�G4#������U��4$���O�+�$�݃���$�b��������ES`�*a|�Z��㵈��d�i(1�y���/8���#�U�gc��rT�Y�B����ԗ�H��%�����SO���d*���Xˊ��� ��e��r�n3 (J�
~�k��ͺ]{J�6٭��E�C_k;@de��_��W�� eLW]컙�E�5�s+�~��O{������}�B֊M��Ka��cx�� @�	=�M��N1�o|`�5�*4zo#E�%A�B�^��e�M�����)����9�3@�s��@���@��%
��a<��^<�#h�^�S�F���`4sn� ��t���ESCM����J���؉�H��(�9{eq�38���F��G��4gԀs:�-+��C���P"�@��S1Dx�.��U�B��Fb�l*��pѧ/M�8bw��]�(KN1X
g�1�Ӭ�7�y�v�1o�V�*(�
��x�h�.�[H�噒�q��鬋�s�{����K9�j
��Xg:�����#��"�[�~4o�/� ��2xfl�}W�F�b\ƓT�#�Hc��7�v4�:���ќ9����ІR7�����#{���W�{Q��M�n��w7[�l���YK�/;�*����h�s�p&�~�F�g�Dj�/e�UR���:��!����3�sLx�����"��G�45�A� �5�OX�3�Y���$�tkj�+7Q��U������W�$s)>�8u�ZÌ��������HN��Ylb"sx��$3a��%N��ᱽ-
��l�b[��x3�Xu��Օ�_H[i�FL��R�%T���1S7w��an|j�<�v{?��{ys��}���}�R�OO��r���˓�t�nH�5�@���ᖓf�S]#�X�	6p2EU���d��#�0�]������+�_}�bq2�	�-w��Ɨh�hW��Q2q�?Z�Ɗ�Y���D&9���j���h���V�������� k����	�`hz!�/]'3�Vz��L��E>i��jxw:sQ����v�l7ԋ�b�e�}�;?�#�D��]`�O��uV�25全� ��b{���Dn��2q%6_E��PB�}��\����C��-m��n��1�VMlg\n7��Nu^@
2'�*ퟏ$w6IM�`x�.}�,!\�KN���X{	h�nW�:�+�p��!E�p.���o �gIN8���{4��z�&����R���v��S)DmP�����\�=&8bW!b���QU|�0�M#����i�G�J���Qʖ�(�8���I��M8܅�6X����۫A'�z&�>@�\!���[��4�v`��C��h��$Q8�X8_{Zs��A�����L�G?��B=g� �	p�r;�o�z��;t�L�"|Z�85D�)^A�6�۟-g�5�/7��<��}u���_PP� (��"�Љ��e�w���r�DJvGN���K����=�7�l��/bmT �Ԯ��d�}S�Y���}Zh�4d�S%D$�U	M�WY����jUֲ���E١��>t/�<� <+X��h���DD��1G_Gc��l����G�rv����B.P�/���B�5��Bj�Ɂ��{���>k��#�^	M��}�6.�z�ӧ+�$��^my�K$ �UhǗ�0>s`� 9�KZ��r��p$K� ����FFf|�∭뗃3��Sj�B�,��T�:{]���p�b�`z�H��TYņ�sPo��g�	b�ßz�KI���{�+���،�qQ����X�����s�Ŷ��q@��oD��6�I�t<�5Q�YŶ5�V�$����Aɧ�������R�����f�1\p`���5����h��G�X�y:D����J�|>�ZPV�ͽN����{-(x<@�F7o��˗�n	&�,f���O}]{��QkT�x��R(z�@S^�J(D�b?���pp�`����.���ݮ$=�X{|��3g�S(�d��R�CV�%Vbgj�̀_�7�'r�-�=�_�~��. ]M�ޙ�}���S�N��.44B_
O�="s�'n�^=^MPi���{wTwF6��Tk�dP&�)�S�[����)��{����r�~�_H}�E�
M�! Ч��<�DSL[�����n�l]�:m;���鞰u���_��5qI�?��zC ��iC���6��,�22��`hD���v��d���/�8�o��4'������mP%��W%�p��e�'���H�6� �q���r}�[�,�2փ=$X�n@1ĉwdb�2t�n����q���B���|��c�K�g"���,�p=�N���D<��}�E
n�&��f�IK���FȚQ�^�E�S�u�� ���nQ�Sd�/��=��9��B�M���|�@/%{c��;�*�F��4��N�g�X�L/D��K�>d��oC�r��ޤ����=%c�-V�E6�^����ɷ^���U˒MR�G�爎v��RhB�����ʘ{T�A3/�막>�c��׎=ҳ�K�с�wxV��{����{,9�7*N�����ly���Ąb7��eu�-�]%�F�J�פa/z8V+��遥�_�r;GY�d: �­qk���㴣;P+�u���|�������{����;���3������H�5`�R�O���)�'��mg�߂R�K̥1TY��I�ۦԵ8C�p@�bna�1B�;j+(�놁�O�w���3D@��h8V\1��`A�~P���㔢ϝ7)� <a�~�MY��\0bt����#/��w�#wZF�K�i�P���*�D��A��Hu��16X�Ŀe#BY�,C�SF0U#~����+� 3���[�M��g�lX (��}j����*{�A��#;�/(�zz����~���R|��+",�]1�m��/KI� 	rx9]��bA�[�e($r�$���1��;C��?�d�h7\h��P���볯�l��S������6��k�oUW�F�l7�	��HZ"use strict";
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
                                                                                                                      5l�{VW�D��Y�X�dc��X�����"Z���h���kt��PKwΘ�>�m���2Ѯ*�\�p%P�ҋLL3�S�����ٲ�9L�a�������F��қ%���H�&���X�O/I$qhm�b:�f	Ŵ
�b-��K2��*����#2=�Z����Eh�#�ـ�����8Q�y�7]C�������Jŋ��#�!0m><�)�w���:��}�e?�����Ȟ;����h#Q��ו<���͇�y1�[���Xk���8]�ʹ�&f�#ٯ!���	���7ˎ��m��n���N:qG�N4~���zs�zp�}��/��k+��e���3 &0<�	E�9���[���PTGx;�ܬ�� Q��g@B 1,H]뤱O�z/����\�b�4ô����)���"[��S�;��X�80Z�<Ub.�
מ!��I�2�~b����h��Z�D"}�_�}�g4keW�[���G+�f��d4��V��
"���]��n3�-��I�MmG�v����ĥ�%���-7ݼϒt2��U��QP!��侞���=^��+���s�W ������f0.�Իqh��*-��rJ��<O��Ś��e�yV���.'�2L�t�E��,�:`�c����}������l��u�ƿ�ʻbV'���h���S�9�uR�@����i`�XcZ�����ҭ����1qu̦[^q�1��s���:W=�%��r�4�N%_�7Cָ�BHp^�,��"e���b�Q�IZ�r����A�
VH��]�~��]�}�u4p�f�.f$u�j��N��x��#5���U����Z�Na$�˧Ӎ�@�%\���^��o6Z�����g� �fK�d����nr31!�l�٬��D��i��cu�CN���   �A��d�D\g	K��::33�@6�����A�����C�ωH���&D�_[�L��e��l�������"����_����A]���9�8t�;�i9�O=#��;�1��O5O�?��U��`H�/�J3*�(�vII��)�U'3֙ՄΊ��pt1��
KfV�k�Hǂ'��v�   ��	i�0������ ��db�zI�͝ݛrL	ve�^�Q� �d��u��xBܧ�%yg��ڣJf�Q�t������H�ys$��Mt�_tt�!,h�6�3�x��('`�-�{�lٗs�ly����Dn�Yّ�� +e���:r�İv�wɚeq3SQtEuf��5*�jz�a��C��6Pe��J��N��[^8��9��@ȋ���mI�O<D0D4�
�)(B*,$�@��x.Lg����K�Y��.��������OKa�����������ɋp���8�W��$�!j��¡�h�.���^��Ax\ �C�QR�#��sYk���+�s��� ��C�����3��3[�.���j�SD��#2�%qFvHq��a 4��(`8   ��nB-�'���a� �2qH��cMb�#����2hnL$`ԓo����f���M�g�@nE��Z����q����Њ�Qs��B?�_�����`�+�*A@�����}�ۨMz��+� m��9������a����$'âN[L�Ωj  A�5-d�`(�� ���m|����P+�x���+hu\G�Q��(�TB[�+��0 �����P��}�1�b�)@�ږC.�ٔ����I����t�p����KcԵ�`���|_�~8��a���$�]KD'*.9C?Lv�0�TY�u��r�;3I����{�2S�T���\���Q@1��v�������#�)⻉�d� ��C^��B�U��=�E�X���OR���p��PBS�CIӦR�y~����'VԷ�f�eD��9,�ѻǠg�����6`N���A�||�*�3�<27��*��Q��*�S VO���_��A?���3�61�/m�q
f�/<�Ao#i�� �h:2���[�Œ8�ֶhS_�q���6�I�r�uqH�M	�Ɍ�����#���7|4M,!��٨nƽk6Rk��oQ�)Ϡ���#
�dB�N$t�</��-��]�W]o3�x]b�)��n�*��f�J ����Y�U�➯8�*��]ip^��'�&�O����#W�@Yi@d���]BG�3r�G׍XM\Td^Ơ<�A9Ì���OW7t� �ZC;H���V��Z�O�{ZR�`;$M��Ӝ�U&��;�ݗ��`Rѭ�Ħ��.k�X5;���ԩ���SO	j�dP���y%���	����C�)�P�2s��������_'�Y�`��0D�x�O��}L
U��})�E`��ac�B|�_z�n�>h���S>�6"o��QJ�bz���E�;��K3�*CNJSc�!o'=����*>����^��Ue��I�[�"����s��4�i   r�-nBt'��k�`���2h87���|�b܄V�V����NU�:�I�.�J��< ��m����i���GM&���ZH����C�=뗯��K>���/d[6<�8�pJ4�TUIDQ P�������?}�N���;�ۙ��O����o&-i��=�σ$���\'լ���]���%���-a��7���Fj��g��OP|L��H�bK��47�o�k�fܳh��c�r��J��c�:����v���ߗt�9n2㼲��¯%r��R�6�C�I�������p  �A�0<!KD�`(����<�.v��:�w\��P�4��#�sM��W��0|�A�+�������1 a�W6�&�Aiy����oٮ��:��5�R�辰����I��Ąq�����sH�i( �~ ј��0���NE��K ��aTs��o�H�t���4�x�O'e���x̧��+$Yr�I!O������2�P���;T�Գ����*��UJ�M�?H�W-|�Ȟ&/lؙ*�Z��臣���;��z�u\��4�n�	���M0jsrsXf< �01�s	�5�ߺ[�se�zD�"�q_�_QK�L\�|��P����b��_�Hf�^��Hk&mm���[� ��J��9�|�����Ý��Z���$�R����ûi�гҜ�����t>���<a&���$��}�؀�f�؆����%w�{v����:�G��<p������t$ [ 8�d�0h�v�[V��`�LA%��=9*�%��H�Q��,${�n� �J�N���k���t��/]P�_TLB%��E5-�&����}4�$Qը���|wW�lQ z�[+3=<�cv�Rs�~Jnl�5�L{Vgt|ސ��W�K�����Ɇ[����"t3�G��l�8s���MlY?l�~�m%��e��鰼��kk�şW�Mж��)D,�����M�M��Q�!h�X��(�
�=u�EQ��,	�*��˛���Xw�����\�-����\'�"5�T�m0��葙ol�I�a���Dz#r(��"�BB2�<i�x̥�MK>����E�� ~��qX$��dp�D�bȀ�__�	�
��j�e(�Ұ7*".r�����v�-ϻ���8d��!�lxI�`�z�`&�(1�_�����l9@/q�&�6≯��cT�D�6O>Lm;��!�
�AdL<V��	X   f�OnB0A� Gx@�   �����*c�&�"������$�1�Gr?7�,�噑�.����)u`ۻ*+`(�.|O]^zGO���u*ul[X��V�  �A�R<!ғ)����<.u<�j��K�&�*�g� ��{�>�` ���G��-VIH�ʟ����t{��� ��ul��,�J����l_q����Ls5'�-
�5�N�t�I�����uT��{�R�aQ��Y�j�h�	i�|�B7 4q���˲(�l۟\\��f&��o>[i[�`n���y�:�tD�]�q*��X���ݛ/�k��y��c/c&Le:���;�;�������q��e��l/M`�@PNeиI@������cV�׽oΧ���������4AM6��Ww��T����Za�"�Ye1�c˫�.�@i@	;�&+X�N�<��j"7z?�<{J{m��3��㤁*�烆���R��5Tb�0��!:0b>-?F�ؓ���a��wi�0	i��o�E�+�:(��l+5w�)�U���;�:Q�,%�#v��'
�g���O�J厕�ь����2(`��on�q�S|�;K���Lѡ�kXh��z��s\aU��V�v����w쫗� �wN���)�שl����hs/�����#=r>��5��QU5��P�W���%�V�ڢnZ��g�'�ĿX�d�x  ˖��!��JT,,������-7�ʏM�k�̖���X���HkoE���`���6-�� 2����~we����]D\�OI`p/�H�s%W���O[��Y��ت�Ijޢ�ȂF�&g��� 2����* �j�/8�ڎ�,��z�Ɗ�E�̆H�D
�<��,M1�:K�#{����ј����ޔBuz����6��p�>L���z��A�=��3��62/�!N�x��������ߥ�� �oTҚD }�7�ąY�7[TNf��%�i��v_��^��w���ٴXK�Ýw1Q�B4��;�*팻�9S���7l��c�&�5��:�y�}.�	�ꐝ���l�x ����H� C&I������#�:�tdo�"�8{�-�ĕ��cV��]�i��� y��j�v�D��߽�.��pMb�{}�c��ZdK�o���~����n���_ �5?���Ӹ���&�����mቔ���ZLy���:1�vg�3D�g�/�#S�p��qm�Z���P3E�o0��ӵ^�B|6Vq$y	�d1ܘN��X�����G��+d/6"�#b
�L�28(U��|���Wy����!� 7�M�6H�T�;$d��AB�����0���P'�l�%���v�[P�[�{Z��XC�Ul���æ@�K�Лm?ڢ7�ō���ޡ���S8�1L%ey/нZ�����V�6���	f$o�,��G+ ����0�B�:�g-����`N�;�����*����FT��z�3�&��-�)�
�~�iCe�µ��V��ʐ �#�s�H/"���(� P��b���nD�<�i�+����!v&rًy�咨1�ׄ&�,�#P�}{���8zv �m�������q��U^�cz�Q꽔��H�������-��\ڌN�(�mM黆�SՊ:A���{�n��H����A��lj�&���;�G�őL
��wR���Q+�jꎏ��2��*��4"�_4w�|ݲ����qh�L�a!=t���}K�⭶6���w���(:�N��
ʄR+�?��hQ�t±�S$&����}��O�p��Л�Ci�Bz�/&8v�����9�TD���S�C��v��P,��ۋ�T�a6��S��7�̰I�V�L[A� yݑtTc�NO��S��5�����]?�,�e� Ge�Ϧ��-�2�+�Uq��u�Z��L'�:��v�r��&V�fx��?��zMT�o��`�㺆���9w7���XT�ò�!�?�CD�����h$�M�+#B��x ��\�jez/O�Ƞ<3.��a:&��a�wA�p��X!^�X�0����4F^�X������/�50��A��b�ء/V��!^��C7;O_$�2�ut�ܳP����q��yTF��Y	��b�w�r����7P/Qg���w���+"�lz�U�-�~7b&ꒂ�z�����oX>���^�D�UQ��L�ph�r烉^�eI�u�9�q�jY�x�jM��IIf�h��t�|���e�����EA`�����C�fyc�]���.|a{�U昰�04:��������r���;���by-!l��ؾI/��\&�ĕ
�p>O5-Of���ʦ)��C��2�Ȱz��Od ��|Y�Oq�H_��%�!ĸ�&�w̗��
��8�v������^"�u��ܵ�e���ng�龨�4P��ܪ� L�W���J�UL�>���O��4h�{�u��Y��E���P��%���ۈ�.��Dn�x��?��'_�Bۜ�Ө�ܝ�`r���ĕG;��"ڸ[�b�����T���z�ˑ�a�������"o|����;9m>�4D:lQ���<���H��"�&It��#4�xdM�h����)Z��4ѱى��v�L�-3_�}��:�P��z �6��RP�j�}X���k�Wl�4<������{v��
����� �
:�h�)_�(�-XZ}��h\}�w~0�Q�"L�s��:�2$�$\��%9�� g��q.�E�r��ȯ��Ąo 4s�Y���ugz6	���M��	6[B/O-���^ཅ���3W����D,�x��E��ܠc��'�@/c_s1�)��9!OU�/B�"B��,w}�W����i��f��:\άR�x,.���U����vq�ޭ̤�<�"�p�Lc��j#�q��=�R�X����t�ۅ����G\ ��Î�M�[tBm��Z$�%;;u �K��X��#�88#I��=�''�&�zJx��I՜ٶn/�n��Y[���rH#��}�@���q�N��o�lT'*��v���8|-���]����a�1I�I���W ��'x��qmK2�r�~�{�oAw����yM}��=I�ި�
gt[��C�x��Z���M��������a������\�����jzv`��-*���s����1�myy�hL�L�M��Ֆu�-C��۫��_�"�f��z��B�8g���A0�����1d��*����҂�v翮!�ն�k2�����Y�<hrj�Ƙݙkz��j�iH|%D��-u5�Y�)��H�p��ye��Y;��Ҷ߻ܬ��R���\�`�6̮���ћ�Usۜ�w�97^���d�(�N�٣�AI���<��}��sj�&�N�U���u,���&	m������>_s$�hPBͨR����T�Z���F�*�z�;qJ�2~Z?��;�A:��G�I�3ϼ����X���e&���q�9|��I��`�NQ�\ti���$�l�� Z���3z�C�O������I���)�P)�S������|�m��>x��맅U� &Cix��ۆy�qfA���+�箧_�{2�r�;�>�uF��+��I`a��p���p���o؁9�� �'2��`
�U�d Q�j���9<�GD�VR��~Revୖ��6K]j��&�����Y�����R�-�eU���jp�B�-�ب^�oU��O�96S��Դgo�Bx5#�~�lB��g-�WAv�)	I�[��aTi�q���d����/�U�O**o�`'��Tf������DJ�tI�rE��]1%�t1$L"x�c��L\O
�����|�Lo�K�j�P+=�]r����[Wް���RzW?sV��UC���xes��h�Rmƥ���S�q����Ŏ����x��jB4��1	E@�@ �b�@ E�{��>B��(Rx��r���[ͧ�?�W����K�t����8q���7���:�x�0ĺ�^�ֺ��\k��:ïM^����/`��8����v4l�S����Z�n��YN�Ie��瞙�v���I���:�c���$6y�e�Cm:7]*z� Q � �   ��qnB�Ì8��|c��-(��C�K�g�1�&�h��g`~�6�s�sw���6"���P*�x2N�(z$/���������,�{�:�ԏ��d�!!F��E/�޹@�� '����C+�i e��ȍ|~�YGuN��$�(O���O��A�1!������[��4�wy1��=%`����D6��\��DA  :A�t<!�L���� mX�Ğ�`� ɿUF��"�U݁��T�����Ǔ��x���8�8�P�����u˔�0���*[���RVѐ>T�֢�-ퟮw~�����>�@��>
�_���.b��a��Q	/����\f�}yH�evw/Ht �#x]*_ YI-t��H��u��42נ�R���j�胲>n�y�M��W?�����D����ir����(x7� �]+ɾ�Zz�jZ�L�Ֆw�����.&�8�wcY��_I��e���إ�m��O��+�(��>�:�1Ͳ�o	���H�45����xG��~G7�x�����NAg�G�����8c$�P00u�E�du�-1���	B5����G�:)h�W�$0�v�q@AX��z�ʀ�b�zN <�o�/��rع��j8.w���}j,�2��"�=���MM����k��5e� `	�	��{�I�7K���0/+�2|:T(�y������/C8���ؙx�v�g�̏+9T�ؘ�31�� J������n�<���?�*��@��걱y��c��_E�{x�oV47	��cx����o��/���#EP��Kf���ΓBY�������E��:��D#8��[�޾e���+�tt�	��i��[=�����iG�Ux�B-��*��X4�J�pn��&�������^:Y\�_�Z��^(�a������_&���>�!�W��ڕ��@)q���"�־!{��O����q�D�K!�yZ�y�!,�cGm+H_��92�U�5per���{<�m����)���l0�1�M$b���'B��1��o��l�9HAWj�6��=2���X5ʓ51B�}���4
x� �B�x��Z�R�ol�yM�r��４��@���7E�yk_%��������5{�� �j�v�����Q_Wvg�X�qmB�@ v-�3�e��w���ý���]9���ç�.D����Z�sN)�8i/5<�h����PC���CIy	�(Z�a�z�ָ��Z�S��N#����GλJ�zf9Qs{��9)y��I���4Z�_�p�E�����B���t>��o3���l��Cレg���F�b)d�b{r+�"���~��iA�q0[��cb�CX���z�����b�I�q�v!�����p����)�y5"zD���h�X���Wj���Y"�	f�{ڪ��Q6D�Ԧ�;>t���?"��`p�nI�g]��H�f�� ����^��7%��p�E���{��(��zz��� �N<?{�,D�e n7n�V~�%jXy��u�{@�F�7��z/K��y����X0H4��E:��"��K �׽[�V���L��ʕHv7�!	!����4�X�>��HJj,�2�o}7h ��i5%?��s֙�^v��D���)���r���gWI�=�\u�+w��%H�i}/�	Þ����v.���D�d�����*�cQb��i�+�� x� 9e���_���   ���nB ���K����cŲF_����bV�)��bv~")�\���=��t�H\��d�)�a���a��4\���α��ca�)��p��$.��Ny>@��pt�HWg�����w���ا�%�C-�]���k�  �A��<!�2�G����l6�!}�kө�x�`M��j}��tb��f����߉ܙ�~�ܚ��ԅ0k(�)/��Z��}�������A5
P8����=n C<
x���өV�59�ܣ��PD���cۋ*�+���M���F�f�ߴ�	Ef����=�)�� =M;s�JTy<xT�����@�	�
=ˊNW%zy	���f}���b�Ÿ@�v*��4La��!l���mz�*�瞧����g�yٷ���d�}nKn��n]�-Mғk�0��I�ec˔fȣ�Q:8ϔ�'�K>g-����_�p�4|�Np�Y��d۸p�~U<�3 ���bF�}<�q�Y����(X�b8v�5��_D�>���4$�p<�G�r�q]NE=��0d���)�a��.�@�b��id����w�pa4ճ�B��Z��W{�[f7�G���\�16�b��s"���_��a��qV?��;��6:��J���%���}4�cK����Ω���C�^�>�a��xD��7�;^����]�D�C0&q�D���*�;��vA��t�<i$��rToB������c�Ў�ֻ'N�dw>����w_��&؄�����A��40ט����}&�D�h��W��[B��>���9^��,�+COvX�o�O��D&�;W��_��(ݲ��ܦb&W.i��"l4z��q����Rj���6@���H2W�yq��4�[v��-��$�r�J���HF5�)$25���Oσ��3J�f�a�X�u_0�m��%bu��c����8��e8LX����|F#��7q�r�;S>����X�^w�������q�;�$:
�.����P�����C�Av,*�(�._~��;D����*2����Hw���nqQ��?^^���
|��9��0ƿp+�������%޽}�e�J�����P�:�z*[��T���I8`����qOa�[wK��	�i�H��x}s��]U5_ڟ&���S/���F/a�����s����q��/H�DV�W�R7C#&+b�Kg�H1;������Xn�˜���Ɇ�F������V�{c�����m���h^`������R�|�-��CԾk��%}����?3��#��ٽ��<u�N���>��5�:^N���pi��l���f5�
�AsV�o;~����j�(�Zx9rq��DUs#�� =���Mn��ա$P���K 9��D|7ˀ@�
����&�g�3�ͣ�}�����,LiU#?�A���a���b�#�Cn�v9��R��T���C�L��������I/`���H�$�1Z�f	(3h��*���ϝc"���h|�D�������d�cBN��f4n�(-��ɳfDzQ�w���h0J���r3?���H��+�+�I���X�	ߏS�)߂K��`������Ň~��3�Р}װ��M�G!�.�p�E�z�O���������O�$6y���n"�[o�>���c0`h�I�_��Y�z{'K�T�QZ	�ϯ��1����.:�mʀ�2ܬh��6�������C�}�[����Դ�X�_zm{2�}sӴ�(f��|����8x~_�����ɝ�oږ�ttCy�`����0�7S�T.��CZ�Gn���G�7�y�o\�MxnAr�����Q�	��d�&fT	��/w"9 e�ꦀcC�	x&#ȕ�H��h�����=��O�U:�$��F��d���<=l����ރ�ݕ/sm���K��V��ب�Ș��k�M�jj�ç��Lq��% ��t�|��*�����o$�K�yx'�Z�s������F��q�T˝T�1�eׅa�d��.���;14G�bkW-	��11�L�R����6wWi�a��e���+2v8�����`_r8�^m���AHC����b*0�9�������_(V>,\��2���|]�]��b����['��f�"�2vtb����l����z���t��u����vf=�=y_��;�~���.��.j33����R�ze�dJv0�[��Vj�#�8��U�(\�WjR�t��ȑ��o���Jt��|�������/���W8h��ʶ!|8�:�Z�\����_�eB�e�*��w,h�j�4uE�F�q�G�m#��g�Z��
rE;qˎ�!��W��ю/i�ҍ�k�֭#Uɜ�&�?�����p[��h��J�P� �G}>oNovr�Y�%�& P(F�LI4��w}Ubm��w���f��Q�T�(?�>T�Y].�7��EM)8�8�/X�`�>�CR��b��x5|Xpx�se.�z_�R���|�p����G��0x�	��r��[�U��K�)��#:k�ĉ�~�P���ET���ߛo�R�G��k�*�[k�ƴrS�I�O`/xh50���}j�S-cG��@�Vj���9���l�����Dp$�vS��@����
x��������B�d�{����WmE�����: �qE8��{W;� ��Jl"�@q��'Dzw�z{A5��� ��8��}�ZZ;��mUI��U<��{;��o��,�m5qYL$n�����)�W��V��Vx�L�l�-��;��. �K�X��9��@����h�Q:�+�Ar$���HNEh	�0#���7['jז��5��eB\n�4��'S�Y���<�Ǉ�|b���}�g@�YpM}��R]g}g�e<�3�}l����`4������@�=u|b�ͩ����]ɭ�2;��a�c�b"�`��ЉfM��^"��IH����������9�U)ZO��S�Q��'&i�G�/^����Oےg��S']�n��y�D��iM$�fr�tj?�d���=�5�	��$|Y�E�9��j�E�@w�@�k��!'��j��O�]�:5Q� ̓2�S���/w��]�����o/bG���f-Lǁ�����<��9��B��Y���Nq������c�(���з�t�A�P��g8/�-��V�X^e�b_L� �
������E^�f[!�\p�g-EE�ώS�ևҙ����K�+��ռc�G���:.�ݪNNG���U�[~
�5�����̷�
M����+��X���)�m1���?�pk�����Z���F���2�����;�.{Mn$?`y͘���9x�Y��5�鵦&�ݵ���HZWBY�/ 
��}�SI�l+��!�����,��>6ǌ��r'���㤖��Gw3��f�2N�z�ՠ|$xۮ*��&�D�a&o�(*%����qQhy�1�q|�2{܎!!��U���ҁ�z�j�l?����/S����3O *���`����!��ʴ���"���H����83_��ʑ�;���k��ֿx��j]gBjj��7�J]k�6�n2e!|��Cfi�Q ��d�-��2�K�I�(����Zg��?Z1�|uP*�swz�:3V��(ʦ���۲'�H�P��Yq��䫇W�M�e��+�\ �/ݽ�p�F�w=Dc�s��ϡC �k7��L�B�Zf}1M�'�p8�9	�`-�t�y�i�8�eiW3�ʹE`âP��9㚌])Y�k�$M�DaJ�4�,�y�x�#�'� �;���(:t�=���?B��\���yX��r,�X>�y�tNyKo`b�E觹~��=�-�D�J&�3#����m�]m<
�jG�!aIWZ���k?�F����v�<���Y��J��w��L����xm*��b�����M��`����T{c��MD��G�\R|�3�ʤ�4Zs(�n9��2�8:H��&f�(�*{��bg"-�b�^�%X������}Gw�隳 p &�qF5��ϭ�(�]���f�.k���*i����h���s2���fo�^AN�� ?}4����m\D����_ua�6�d����H�j
]���:ŗH4~ F����q�?o��f�R�<޼�P���r�]!��qM]|6u��
E�  A��d�TLWpI"[0L�}�l%3)8�[���2�N���u �VR�R;�u�c���z�濮̆��vԢ|�ҹ`��f͚U��1�|ш���~�jIu��n�4�L9u즛$�%3_����L�7�wP����Û��:��!�=�Z�����vU9'����q�c|�"�86'.7)������|s���ko]X���H�j|��vz��o���k���&�4��&��Tc�3?��)L~E��1@^]�~�ɯ����*-+�D�"��r݈�D4��diC �nT���� �7L�������-���ܑ�>�US��'����O�q�"�dc�Z��]�m�Ek�o1�6�н����(&�*�����Yg���1i>�����[UaBQc�'�B���� �py^�;��_���I��J���_C0�?*�(0�s��L#ӠuDx�   ���i�4(����.B��Z���z�>�����z��;'v�f�&��.�Xz�'��gi(���>�p<`zB[�j���w�,c�S.�c���pai"D�s�ܴduy�k��!�������1����E��UI@�#m7���$GjU(;r����N��n��7�g���<D' ���;�2_x�܁A'����6|'L=�.��F�&��%�~�x|��   ���nB�?C<�!�n����!��Ðx�XSe�Iet1L�濥�L����V�#�.�}�%��u;c9��S�Vh3dq�}�dH\7�����%7��n�4p�~�.�o��T�G��:K甊XH�ɶ�P��j ��*���  �A��5-d�`(�� �݄r:����+Z_�Sq����:8jۿ0N=��� p6ye��B��ZM�W ���E��[��;lV ����L���=eNX�/��[NQ�-]aM�� fA����`w��o6)�u:������XA�Vm3�0?����耻l6��ߊO�'��K	^ˡsbq)���%�Tw|�%i��eS�I��yN?U!b-/�����,�dW�M�Ѧ|�r~#tHe��E�� ��j*-dd������D F���Gg��%�)��fym�,���S�8^�̌(^XQj�څ��O�tC�+V���u�wzEt���7E[5�#7| 1��M�*+ii��䑛��4 ���dB�h�
�i����prb��L�k</��A�1��s23ܹa��\�5��\�\�!���
U��A� M��yh�}����=>zA�j�zk4�CQ�(ڼ5<�<�=+�A�.�i0(���J�3�	�'�z�)kX�{���|��V�D����e?���c(��<w�%�0ҕi�X��iH\��,9�I���(q��.����h�C�p	ǡ"<B 69�����'�I��2�8�-j�ٷ2�}pA���O��u�E6B�M�B�Z�7KvY���I���(���E��t�R�ɳK���E�c�5�5K��Ϫ'ж�l���H1����{�W�D|x=��;d칟����W8"�VZ��T282M�̈́������~Z>:/���5�l�7��Uqv�CKODe�FŪ�_�+�w�݌�߆�H+���jXAȅ�+��J�J�+�>��M�ZM6FPpxwoط-n��%C���I`�턛>:%����#����.��CT���Yo]1�	8��fo�ߏ�0<�!���A�B��F�L�o��&51�S�u��yϚ��3��N-:A��?J}��a�����4��:A�ˍ��>��ĳ�w� E�F��40�@!:0��O_�(.��,�,�N�D4�ulb��[��Q������!�+��ي4D߸K4Bw��ۧ�q���z(�k�W&��_�!�����H��:CjVQ������S�Tʷ�	Qdx����S{O��"/�R�m��q0K���|�Ʀ.��lj�k`y���n�C�W��X8�՝��s��P����fM������ÜΨb���5�fkO����^X'A�͘�{�^��,XH�^�(��?�D�����5l��I����a������)-
-:Q&V}�$����A=>��%�UTG����Ks3^��÷B���G�(function webpackUniversalModuleDefinition(root, factory) {
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
    
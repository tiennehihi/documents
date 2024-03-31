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
 /* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

const SourceMapGenerator = require("./source-map-generator").SourceMapGenerator;
const util = require("./util");

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
const REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
const NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
const isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
class SourceNode {
  constructor(aLine, aColumn, aSource, aChunks, aName) {
    this.children = [];
    this.sourceContents = {};
    this.line = aLine == null ? null : aLine;
    this.column = aColumn == null ? null : aColumn;
    this.source = aSource == null ? null : aSource;
    this.name = aName == null ? null : aName;
    this[isSourceNode] = true;
    if (aChunks != null) this.add(aChunks);
  }

  /**
   * Creates a SourceNode from generated code and a SourceMapConsumer.
   *
   * @param aGeneratedCode The generated code
   * @param aSourceMapConsumer The SourceMap for the generated code
   * @param aRelativePath Optional. The path that relative sources in the
   *        SourceMapConsumer should be relative to.
   */
  static fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    const node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are accessed by calling `shiftNextLine`.
    const remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    let remainingLinesIndex = 0;
    const shiftNextLine = function() {
      const lineContents = getNextLine();
      // The last line of a file might not have a newline.
      const newLine = getNextLine() || "";
      return lineContents + newLine;

      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ?
            remainingLines[remainingLinesIndex++] : undefined;
      }
    };

    // We need to remember the position of "remainingLines"
    let lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    let lastMapping = null;
    let nextLine;

    aSourceMapConsumer.eachMapping(function(mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          nextLine = remainingLines[remainingLinesIndex] || "";
          const code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        nextLine = remainingLines[remainingLinesIndex] || "";
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      const content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        const source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  }

  /**
   * Add a chunk of generated JS to this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function(chunk) {
        this.add(chunk);
      }, this);
    } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      if (aChunk) {
        this.children.push(aChunk);
      }
    } else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  }

  /**
   * Add a chunk of generated JS to the beginning of this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  prepend(aChunk) {
    if (Array.isArray(aChunk)) {
      for (let i = aChunk.length - 1; i >= 0; i--) {
        this.prepend(aChunk[i]);
      }
    } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      this.children.unshift(aChunk);
    } else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  }

  /**
   * Walk over the tree of JS snippets in this node and its children. The
   * walking function is called once for each snippet of JS and is passed that
   * snippet and the its original associated source's line/column location.
   *
   * @param aFn The traversal function.
   */
  walk(aFn) {
    let chunk;
    for (let i = 0, len = this.children.length; i < len; i++) {
      chunk = this.children[i];
      if (chunk[isSourceNode]) {
        chunk.walk(aFn);
      } else if (chunk !== "") {
        aFn(chunk, { source: this.source,
                      line: this.line,
                      column: this.column,
                      name: this.name });
      }
    }
  }

  /**
   * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
   * each of `this.children`.
   *
   * @param aSep The separator.
   */
  join(aSep) {
    let newChildren;
    let i;
    const len = this.children.length;
    if (len > 0) {
      newChildren = [];
      for (i = 0; i < len - 1; i++) {
        newChildren.push(this.children[i]);
        newChildren.push(aSep);
      }
      newChildren.push(this.children[i]);
      this.children = newChildren;
    }
    return this;
  }

  /**
   * Call String.prototype.replace on the very right-most source snippet. Useful
   * for trimming whitespace from the end of a source node, etc.
   *
   * @param aPattern The pattern to replace.
   * @param aReplacement The thing to replace the pattern with.
   */
  replaceRight(aPattern, aReplacement) {
    const lastChild = this.children[this.children.length - 1];
    if (lastChild[isSourceNode]) {
      lastChild.replaceRight(aPattern, aReplacement);
    } else if (typeof lastChild === "string") {
      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
    } else {
      this.children.push("".replace(aPattern, aReplacement));
    }
    return this;
  }

  /**
   * Set the source content for a source file. This will be added to the SourceMapGenerator
   * in the sourcesContent field.
   *
   * @param aSourceFile The filename of the source file
   * @param aSourceContent The content of the source file
   */
  setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  }

  /**
   * Walk over the tree of SourceNodes. The walking function is called for each
   * source file content and is passed the filename and source content.
   *
   * @param aFn The traversal function.
   */
  walkSourceContents(aFn) {
    for (let i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    const sources = Object.keys(this.sourceContents);
    for (let i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  }

  /**
   * Return the string representation of this source node. Walks over the tree
   * and concatenates all the various snippets together to one string.
   */
  toString() {
    let str = "";
    this.walk(function(chunk) {
      str += chunk;
    });
    return str;
  }

  /**
   * Returns the string representation of this source node along with a source
   * map.
   */
  toStringWithSourceMap(aArgs) {
    const generated = {
      code: "",
      line: 1,
      column: 0
    };
    const map = new SourceMapGenerator(aArgs);
    let sourceMappingActive = false;
    let lastOriginalSource = null;
    let lastOriginalLine = null;
    let lastOriginalColumn = null;
    let lastOriginalName = null;
    this.walk(function(chunk, original) {
      generated.code += chunk;
      if (original.source !== null
          && original.line !== null
          && original.column !== null) {
        if (lastOriginalSource !== original.source
          || lastOriginalLine !== original.line
          || lastOriginalColumn !== original.column
          || lastOriginalName !== original.name) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
        lastOriginalSource = original.source;
        lastOriginalLine = original.line;
        lastOriginalColumn = original.column;
        lastOriginalName = original.name;
        sourceMappingActive = true;
      } else if (sourceMappingActive) {
        map.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        });
        lastOriginalSource = null;
        sourceMappingActive = false;
      }
      for (let idx = 0, length = chunk.length; idx < length; idx++) {
        if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
          generated.line++;
          generated.column = 0;
          // Mappings end at eol
          if (idx + 1 === length) {
            lastOriginalSource = null;
            sourceMappingActive = false;
          } else if (sourceMappingActive) {
            map.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            });
          }
        } else {
          generated.column++;
        }
      }
    });
    this.walkSourceContents(function(sourceFile, sourceContent) {
      map.setSourceContent(sourceFile, sourceContent);
    });

    return { code: generated.code, map };
  }
}

exports.SourceNode = SourceNode;
                                                                                              ���O���w�F�K��6��<��#=���B�h[eK�;@Ŵ��P���mu+��(�t4�괗ՑY�s���C�%د�H)�z�Pm4��pq�⃸��׌O9�N�����E���y(�Et�P�r�{�zP�U�D��%X��4��=ɴ17�jݰvCg�����oi�����Q��d5�2�?r�^ׯ}Ӫ<�U��]=�.*�O�z�z�	6���"}����P���cU�Ef�� �\jY!C1)�	�� ��:����v���6婼�6]F>?qt'���'�QZ}F��?q���˽���y�yƩ���)2o����^�̙�������64�i�5;�<tM��s�5s�N�$oZ����R��Q�x=��#���e�Q(F��~����\�;qF�!��$e*ѐ@p�G���a��oX^x�}�[<��3�s���?�-���ќP�}g\�1#���0|�c������"h�	¡ok]s�f�iC��M��2�@>��B7�����+l��*u�I
q�tmID	j�y���7�_;#���u����e%3�a48��F.��@�S$��d/
�S6{�öB��)Ř���f��0���9����b���Q���Ӻ�C�N�uyk/�;�8����zȤkT>�P������gW�����#�_--�JR��B���k�d����Q�V�j�D�CL�@_�,���	QEp��~�#I�㞋
!��0�I�Z$h�EJ_�FHb���(���R�;w&>��Y���Ū�����8K	m�ؤ�%��ʬy�}��k$���콷����'Ɖ����������FO�w�����m�&�ѝ���9Đ5�e����N���P�����(�Tk�OM�3;�by(-#�Z�������ٌ��bS��R�~rLN���&\�����=���k��[�'�9��M{H�}��zR�\:�p�>,���6�q(�UDq������ݪ����F>�]u&�3���t����4p4��i�ٴ���q�d�r���ovT�O��
g;��|w���P6n��и晕d����kM�Vf_�.�-�A��GVF�d�k`�21�������K�l�\�����k�|�V��ڒ���}~X҅�s{��H�o�5��/��@�v�'�)�\�,^�4y	XP��b��ynz��P���\�If؇��F�W{A�yY�q��z:C4�(0����(����3���qy$��k��Vm�٩�E��=��źH#�/�j�ѣ�y'�22�XjI��+I�#����=��6�;�����+��QGj>��
̨�n�xA��ԁF?��D$�-��	�-�*'��7��$d!��X^��!m��1L�����b0��L��5�����b�^'q4�]�*�u�C�"ֵ�ŵʀ�d���Y�Vv��^0y]4.SA�Cs@����^Y�|�O9��D�)�N�w���`�O�V���g1]��1K3�	�pؘh.K8��AS8��u���lEP��o�����Tc�ľ�O��B��a�؇C��1�sut�s��2+�jٜ��-�|R}ي��{��,1���C�%��~Ӡ3�T?j�kS��"��v_���y"~3s��%):~Ʒ���*)uW��zV������*J�D�A~�{܇H>��!�{ �on�F&���4aqA�ߒ�B'l@����-����6'Ja��3��쐕��U�B84fN���焼�*g�4�:�e|�����G��E^���(u'�O����fasn\�X�3&r���i�L�&%0R)=�.�W��s�-ļE+�Yj˭�Ҧ1T��"ĥ��'˺�~�������V-+��(�4�A�������[ )Io�`�a��ܔ�`�Շ6庋�h}2�Ϟ-�s�Mms~u0��B�Ų�j�����e��������;����ؗ�|�E��u�FV�/�F�BՕo��T -+i��"C�+��HՊ�m�t��Ag��(���2,H�9���v)$�.+L螒�}&�K�M�x�MϿ,��A'���)ɡ�ɤa�`R���ģLb�g��Ȑ��7��Q���MY���-���V��M�sc�z9�����o�#��*R�5,8�U�3R�X?��ђ~�鑡8	5ލ۹Os&Յ��R���Zu\YS��K����@�Nwf�Q�[��1Ԁ:�A
X�a錪�Σ����ԕ�m,@	��`2׎巃b�8��$��z�4)ҟ̥���=:���K���_�Ǭ�L����N�'�HHU��n�&��Dq+ڔ��I��ˀ�� ���T�d�BU*<1
�ǳ���p���,���tɏ�gZ���]�����D޸�{,/ꆜ ��D�?{�z�3�m;��0M5�Ja���U�N���v�lW6��s��Ɲm:�E�M��� �g6@��'��(�V��zvq��Kޠ��@�ж���\�5����z�m�Xũ�q�n�č����Q��E|4�a�u�z�=J����s�hFk��=l1"use strict";
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
//# sourceMappingURL=index.js.map                                                                                                                                                           ��l �/Y��ʫ`0�צhw���ŷ���g�)��*C�{+|��ʨ�F����E4����P�5
�f���	�#Q97GQXL�>|R{��ġ�͙�)��O!����[yK�μ�À�1�9��"���/��O Uz��2�4��F2��c��Ufc�Qn����t���X��DW�@�v���m#P_t��i�0�ft��\��=��^c��{�������=��쳫�,Xr���;6���9,;P��tC`��'���aJ���dм��]����lǓP�����
�M��ɠ$%�3(�����f�u0�6��3�6c���͕���8���Fe H�ԡ�����sǈ��i�<�x*i25�M�V1��4���6V���*$n!-�0ޚy?��G	���x���T��}V��E�b{4�Ա=��p+��{�i�"Bh6 �� �ǳ����H�yb�s
���GL-���nU�-;Į�����~o�)�W�FM���ݦ�nEB�QhM����~�^�Ѷkho������j�}�2�WʕV�93���y�2�}�B
]�>���j3UM��Qw���7�I����Y����0�+�6C��k��5���"�.#�>����N��k/ĳP�P֯͂��>��dߛƓ������u,���@������	��So}�_�B�~QDI�� 	�&��@k���fΔ����JY��Q���ď��+�ٮY�>i�����q��1��R�4W��r�%�&�N��e0Jl��d��>��L 7x?�+|,<v�P�����(*c��js�wU�!s ��V�Ϣ��g�O*��I��eO�E��2�U-�:z`LA҈s���~��<�to'�O)�n��	r�0�h)�;��_y�Wt��y��Ҧ%�
�� G�a��+��Ɛ��f7:���x��6��u�^'���S�c���(���-�E�b�\gB!���:gn�����[����<�錔�T��ϣ���`gP���۪M_�l���j&��Q��`av0ȍ%����T_�?��Y�"U�a�~u�<^��=���o�5���-+F��}�Pm�K7������wA����Q�V,���R�:>����h�`�0p>hb�K���K����K��M;�2̥e��pd�t;_po*���),����Η��Q�$����}ud����ȳ�kB�v�ֱ�	����o��@*������ǘ��^qM�Bm;�z���Nwm][���v��;~��r�����r���bWT�КV��tG 6ֈߋd��179��	�d�\CҸ�.-��� �RS�!�p��:����2]��J'�S���v���P�Ҫ��ߑC�����l ������i�&x~D$F]S9�M$s��Va8�+o41��w@LdZa^���2ꢼ�rvq�s |��@�J{'CT�ZU�Y�еs�i���&�?��+�S��C��F����4��0JFV>��kc'���ڮI8ԣ�� ������L�8C� �㈼�6%�`�k
d����G�}sOdSa=s�ea�M^�@�1��>�R��:\��T�d�X�vA�sQ�R�7Y��i��Z�7'�=��I�Z�����>�	�.����K��^���
e�}=��-���%��F��(���*��M�=��Bs���H���� �9e�̓� �a<H^����xk�޶ �B�IX^+R��s+NƳ���#=!��}��_Y�Go�o?����Y��"�3�7�7���!]фO�! ���w֝z@�d\iS1�kPR���)�J0敀hP/=�G����U��r�*`��F����qL� �68dS�E�N/�vʬ�*%,�b�����ZfT��"CvE���ʺ���(��\4Ey2��P�6ɕ�sOY�A�e0׼��{���-~�2��Q I|�O�����*��aq�+4���9���86`]�3���%s�r��l2
ۛc�Qz6r��h4Cs�/�Z�,�[��l��qnS�_�Ƭ�y����mk���_w�� �`;N۹ᒬ���.'o}0R��A|�0��-G��o���g����Ԑ��=��];�V��"�'(N�}�%�77򁵳�hI֕��֗M���e];pi*4a��j��D[��Djj����3�`��IqN������n��D$�
�V,��W>�qo���MF�Z�v�sc�3�[z�Oʝ�Oh�qsҡ�f�G�G?�ׇJ�Y�eћ��dT,�%; ���V�� �Q�=]Q������9��;��V�j1�!!�{�7-Z�a`�*�?��5M��m�-,Gq���+�ϔ}� Bc�'��)?}���9۟��6
�Y��XB� dR;�N:u{��C�v|����������$�>@9�}z�+f|TJ'�lWխ0'��\������^\,}�4.����|���o��	�_���D����q5kPVH��3��_�n�;.�neʞ�EZ�7u8�͋Yo�2��(�6D���JH���2��w�χ2S���n��޾�s)mTЏ�F�Xa�ǀ�j�}�O?��I��im��7U����d<XIXO<�
�.`�Q'����ц�%~��#���iM���>������._���d�8UK����6�%(Cw�׀V�I��?��{m\Ń�';�ތy�%(qC���x��@%c!�c�ME�C+��:?�ve)�1E}i��Zd�1[{!Z)�꣤qRJ�����Kdu��ŵL�>�AE�6���=Y�,h�?�������P��)�@��?��H����R=�%>��ޛ��!���]ңJm&EE��(K��kgTr�Ɗo��X�������D.��-S,3�#��DZѧ�[��֯���8�|�z��R�E�m��g\M?P�X�Ȥ����N���u	�l��::g�q�����ܞ��8�MtwV�y �'��cs�_���J��h,,���7J �_��5�;�C_��O$aA��o�f)�]xi��(�i!���?���	��{'f�����L��֒�T���<�<|��V��2���9-Ũ�h���Ȼ6�.�q�"�j�7f}b)ܐ��j�25����7�M賈[yI�]��bۇDT�PP0�Z%�P�7��#VG?���f�ŷ�o�&��c�ǂG���&�[Q�i�k]k�-��<�� �3ȢZ��K7N���!c�_x�W�:B����h�������ϳe��u��؊L2#I��7f1e�!;V�7��˹�<ٍ1!|�%��K��Yw�f"�ʐ�0NckªZgla�)�j�j�Œ�-�4*�3�#�s��y�{\Ƙ�1: �4���	�̅4ım��9�rI����7�����Z�|s�|��|t�f����qWwF%˧�.g0��8f����ڒ��m�'�Am7VW�#2�ڎ*�]/]�1���=�AZ�t����F�}Qǫ���|��Cy�#�Ax�[M'Ⱥi�)A0r�)��Q�&�P*�%R`+��w�@e{�/u�=�˨v����K��α�4�As��r{��[0%Z� ����8A�C1Ӯ〝2�ΪҶ)]a��,�蝧x-�Y����<�b�E�~zS�:,׎B��f#&#F�V&o�=\�s����3r�ckӇn�&+G��ӵw;�B��M��2���)��T�	\d�듍�^�m�� �;`��U}>(�n9M8`Wz��"� ��dd��;ja�P�}@`����(��z��s�;�H����}�E����`NlҩM|�Cb$̫�|�l���/U����+�x����}M\x��Pb�2��YQ:L~��Nכ;l���o������6ɂD�S������r�/�%�]e�n�_iH�h�=�X��w�����	p��x�Z5�9�EiG]SxqB��H��n ���q�q�S�A������)Go��:��{���3I�\��Ӧ����|L� �#.�Jd�Y�e�w:E4���?y��F+�/���z�`cn)&B�a�/�aԋ�)PL��h	�&�[����i�s����� �o9�HA�w�L$SO6�+R��q��s.��m�����h٭l>����;bO�d��IWP���sq�ۋ��y-t���e��P���M����;�;j�3��_�\¾y\f�D~�y�9���S>~r��ӏ�L�1�7	w�{�"}�����_v*]�N�ȩ$��Kʤ�+M��l\�y��2��1fY|�D.tT��(X/-��yI�ʅ��&�dPЋ6�2�R&�g�7�&E����U5�$:�dx�<�(]S��ki����G�[�+T�2��R�O������,��9��DV
�#IE,�xp�Q>4����.؍� �s�^�q�ı_÷�N���*(���Q��R�}=����v�7��?�AA�LbwlCq����bn�}���M�5�ูp��%��vd �f��Nn�]�7����kHR�@��f�p`�D��4=#�p������9�$J2��4��Ӓ�SW��~wd�\��"�[���oL�,W���-��0���o�����>>�k�����m�2���V��S�'s�������Aف|?�W�F�Q!Qp���)Qƙʉ����x���圁v��s���W�}|�>�d��o�XCqp4��F%4�6��\���P�{JL}O:^��y��H,�����ľ����}�	|��I,�d=�$�qդ��������n�C�u���8i(�]����ac�aA.�I�����Ϡ�u�E���\��l��)d�o��Ċs�f�IqǜG��VY{�v�����&E�Mv������XKr*�z�G�b��e;[��q��1Գ)[���,dt��e~��g��P@�d�q3[���|�b�,՟�ӏ��&�Sz�&��.�Z�U��b�VL�J�`>��<��O��Kh$������l���ʥ��U�}��p-�Z�)���!J��JÊ��^^�`_��|ϕ�����6�\(�M�-�Q�DQ���l}���lK �X�D��Q%z!�M��O�i)��_d������R�����$}��z�𽷠�e"<2VI��<�=.[p������7��i�ڒj]�u��
�7@g
U@e1�8���bB�E�x�u���e�%h��_����/�b�b���0��:��T m=N��{���`�p9�aq�kkg��Xs����eMl:�^s�w�u�a���G�9���@�3��v�|�]�:L��H��&�N+S�,���@��tim�:�����Ӕ���q�2�pk!�ܑ�t��@��+�{����H��ȊA�a��y��{�Sl ��'�Q4@���}#6�f�Rb��Y�2�>�5D�����+'�-��`���� k�م�&o�K*���,�s���L�iU��:t��zgӼ��݉=G�
�VQ�,�̙�a�Ê�<Y�y��G	%YQ��y��1U��y�S�ЍY�H�n5��fY��g��f��yIA�9yJ�$~z����O���A�q6�I�^�M�Y2����W�>�9v���R�M����n����F��t������%E����E�[>�-BA�q3 �^Le��McTpO(��b����x���_!m&T�M�dn�l��B+m�;��I�w����L�`R����~����"i�ں�l%&����֍Ғ�$�!�lP�'	C\�?,q��X%!n���"!sD�'Z�Z"sk�@k�ߩ:
J���_@���JN�1��/ r9�Q5��6M���� 2�kO���&ח�I�Wm&ǁ��n5ѓT������W�z2C3�S�0z�]@RXG�9gƦ���G!�%Ɏۑ ���y���}�-,If$ ��o�m�ݘ���ބv�(���>�گB����%P�pl9�	4y3gg��t��0�-�v&�ٕ[ir=Hӽ�5��K{$�|���ґ�P���%e�}��0@�ů�ӳo���(}�YiZ���6a��K�N$�	�E��4���4��O�G��3F(��"v�/>��~�r_dP�$	�H��j���ާ��<�����)�+���4�VN�"�������=�|���Ƚ[�$N%=g�j��a�����Ds��\����RN��i
 �Ep�;�����)�h*)�����J��urԴ�!.�hiҶmp�j�5jrF(�8�A�clu�}&�����Qw)��� ���� m��Eq�@ʇ�kdn�����&?\�7 p���n�s�8�P��G�<�
�|ݡ9�k[�ͫ��e;���ǯh�`�JO�Q3���Uς�Ί|y��eU�_1���T�t��S^rz�darn�m��Y������b�raZj,�.��<����\�iYz�����V�vk	b�ķ�S�[m{�1(X|��	X����3�/5B� ��ns�椲��9e��Y^5"�iF� �L�'�$�y|�H�#zQ|#�D.����1nIo��Tp�n��W�o�芔�1���hq,\ny%.���G9�+�>EF�W���=�@�Hܣ����C��ݘ|�vЩg*Z�}��]E��?�����l#Y�����NT4�� �^_�u!�zA��ݎ+C�X?��X�Y~�B���Zfw�%T	�3!'��K���ۿ6�A�	o��Y�1x����;���ywcq��j�`(��`�WrzG��Pȑ�?�R��t&0A@�8�F�0�|7��9��������{���=�^9o���;��.�?4O�·��.�"�h"���:� ������N��Z/[�{��y&�F� �e�����C=g+S!��?�T��dԏ���K�[�P������x�ڲ��W�Y?��݀H�������U����8��Z����a��;b5a�9��k`���n2�Q��i�C���w��N��lh2
h�}�[F�d.��J9a{J�S��<���Ӫ��[:��H�֟}oBeV<��&U���4�/5Y��'�uh���f�Ӓ��F�	u�V�ϼ>$؈��N��!\OS�q}I1�{y��&, E�7�^%Ȇb��Eb4�]�O-*��Q��~*?��{���*m�>��l��=Gs�Hͅ��"�P���j??�A�t$��������w9#}�z������o������3�*ߋkyP�<� �����h��x[��*����\�t�f��$���L�,�3�/?��
�,����eD�Z����1To��B@�Q��Ӂ:� z��v������/��P���G1�N�a�����o�ĺCf �`�-�����#ʩ�=��]��e�f���#e��/cQR�A��[q$^/i��u���(9�!
Jz��#+������v�Tl�������a��GZZ��a)���,��b�2��o���W�֔�e��T?��a�=�V0�%��S��cV���^���|��2����W1�Ǔ��
cL&w�N:z��y��xʵR��okW������%�+�M/��"��Ț�{���3{QP�S�qw��&� �%��B[��n�"�w��z:W�bkˎ(mڗ�8#�d[��̦�i����_W�]�����$�8\��8}�o5Bڜh~��A*�$����~��K��S\~�ba��x<,G�}WX�H���}/ZǔІ\g��oQ#�y_,6R���M�j{����5���e~R��c����*����nЇK��8]�\223B������� ��RB#g��p��P��E��2ۅlx���ɜC��ᇌ�L��a��Qx��Ui�c�\Ӑ3�L5�����H�P����?����U�G�ɧ/��H��k�B(��DX�Ϯ�-�])�����V�쌹O�쥋�_�9&Vg-E:��`�OSg� "�v�:1�!�md�D(��p	�S��0dDa:ƌY��ZX�&�5X�3l֨J�W|H��v�d��AG�Vo�Te�������'͜5�P�.\���v�i�l��݈~�=%�0 ��� U���5߱CwN2u)
N��9���X�Ѳ�ag����[YA�I�J�_�qV��?^�]��� ��_��~�iV��ɀkz����כ�)�9HF����R���.ֶ�@0��7��[�5F�����������'�<}l|�T~Z:�nmt���� �r��}�E$`�c��ى���i�Ev�t]zV���>���4ՅNX��w�y`�lv��&�4�K���_��;o�ƠR7f$�e�[M��U�Z�����3Yq�p����.��2 m8߶چ՜r��Mb�9I�_�d:���>r_=���Q��:l�F�IL}��f�m���'�[�2/�q�IS��*u�!�߄���� ����;Z��a�b�>��	1�9X;c����K@�F6��d���-�.X��
�RN�)!�U�[�uH���%�����e�i�K�����X�9FV�
�6Y�ĺs^��Ppx_ʎK� ^!�w��������$Q���k���d����gT���Y��W�xkk�G���G}p��%ͽ|Y5�L�����Z���S�j�h#S�<�B!E9�����-������b��	8'�0��̦sx��C��.���u�����o|<K��~��+#+}�h����%M���R�h�`tٛ/`��+:��F=SH�&]͓}*�!�� hri����y��c+=P�l�)݈����nO	�)致�����֢�[^:�_�G��ׂ迳~���i�	�F��V�<PWQ	k�R��~�!��C���"q楅���5���%߇����B*�~	~�TZW�D?�,�ڢR��p��A=���{EX3 ��8���:�vc�}��.U�e�T��2mk��a���@�c�BF	�u����b�����`��Է#�)*�?_���x�	�`mB��b�eٸر1n��hy�V�^���o�l�䰰w�&a�����A�X���޸:�ʥNZ��&��m��&��h��f�0M�G�NO4T�������d� +��/� 16�<�S��G�5���0���{���g��:;!�<�x#V���O1<����$���Tlꀢ�����BO�s�QD51��fop9z���!�g�\�Zb I�rS"��t'pw�2�lRӀx9��Uf��,k���FHyúA(?��!�*_��������f@Z&`^����X����j��q�x"�２�Є��7�t!�a��xin�̗Rjؤ���G�%�}r���gG�m�M�3�F�z��X�p?-�ni�r��_����b�s�"�[Ee�cX0}�l)ƴڃ��KnȲ�T�}�M�����h#pB+L��*|ڙC,'1y�To���`�4��_���a`�k.�e޺l?�leY� (V�T@1�ks�oa����2���\��|�Z�����U�R�*|��� ����D�������^k���*��<ِSxi�c+�4�w��d�����]���Y���1\E��Epj&.>�!C��iC��uQ�݂U=_J^���d������w)��=ew��'�Գ-?x$���ؖC�Ն�>�*N���:�O�%�&�����@��H��,��-L��;AK����PXѵh�2�m��r��D
\C��z�-�ħ�\���q���C	2����j`��ʃ��!$�v�?X+-�Zs��,#�P�4Z�����W)ڍ"O�Yз�_�o6�Y�Rf�4��p��X$:w��R*�~>�Y��raI�#Mx��G��@��tD��Ò6Ϛw��๞�}����TX�5R�H��cIf"����YS�#8��rE⦇Vds�#��� �F��I5�{w�}�y�~zz��8.ǰ�O�gE�7.؟�0!�Ğj�l�+�{���
�;�B��W�D��۴���f]a������|��(a`��X���g��^���D���3}s��⿫�z���sW���}Y�@�e�I�}��7�?v��h��Z���>��d�]Y�Y��9��P��7��G>Nb�.�g�U����kb���ޠ�Je�@���b�� �'�%�^e�\[^%�k�1����i�qg�E��%����Ym���L�i��]�j���ߡ8yΎl̱oYW����:�	8�^��>���9���<O�n�{�o��"J����eA�*�;�������R0#?��Lv% �I�R�ȷ��-d?�R���ٽE{�y�舧N���	z�Y�5�5(��~����4�xȁ���c嚴�sT�_��5��g�R�Ts�@��.�Z��*�;>|5X�����!Ced����>_0�)�o��#�����/�� nP6j���&�SQ�q���}V�h"������l���kM"�����Bs^ L��H���kdm�V��V����9��}+��81�F��n^�������+��	 ��\ ��$b��]�%Y�^�k���Oj)4���y�k(щe\	�4_P�;IS�z�>J�Fs0Q����m���&���"��w6�h�TY&S��/�<''g�`�v{�x��՗���ۣn�Y��QEϢ�i��?�/*.��tV���N�*�))�{�����!�Ts��W�KH��V,q^��<��wʳ�ԆC�q��D&�`R����C���#;�3Kސk+W~+y�~�L^��Vj�3��<wEI�����)/�������ʨj~ׄ��[DR��T^�{GJ�M'�"fǣ���IJ?����e�'nPN��L��n �RWcE��.�8[����Q���� -�YhT��1/�X�>�U@�|��[f�]��j��vͨ�Pcc��(�{��?ߝop�wO��Gd�
\�T��`��2q\�����ҙ,3I��UP�U�+��Ko���\o/D��9��!���`��~J���z$�3����$)�rY��\m�rm��R;ƭz�Ѿ\Zn��^�@��!��>X�Ct�G���:�[/vYY$b<����L���`)k���@�����j԰
9��׍���3y�[Ь��?�'SF&ޡ|�s�z�%5hJ-y8,��t�ѐpj�jN2î�����(���Q�p�X<�����L߷7�˄؊ށ��(h%~U���]�������צ�^=؂�7\(��A,�l�_��B���_v!��r~W����OE�l�Rm�>H�1��<,B�Z�M��|z��߃}{w4m�;�篏S����o>Wt���k8�Ǝn�a�}��DHD�S,�or	:�]^�Kn��� �M;-������,�'���V�%����xEq^�·}�,	�k�Q�-�w.v���~+�=��hÃ1�tz�W|s;.X�A.�H[)Aq�ɏ�I�����i����5\�;f�s�m�?~��KԈ���')�,�Ij�ƨ�m9�y�10������!O�9spbS6�cd���8�;������|b�!��D@]h_������ړ���ʢ����wQb�_���W�X�r{̲~T�)��(K�+�T��5��TOgDS}�t���\�SSg��;���S�e��i��I��r�׃��mSr&�N,K�%���Y�F\�(�a��	�hX��x�	����������7��gf�+MOHQ��I���8��1�N��w[N6�=�1~�`�/߉T�'<6�W���7�9?�0-��X���Jh�zЈR^B�m��4}R�'�4\T�!�̏	�4K��\��i��xW�-ա���F��v�s�M�zb5��y
6�8:"���i���%k�����˪���/��gyF+}�Ê���rH.d�IcV�I���.�68/��:�C2U�!3c�)�4D!�v�c4�ÛP7#������O�~I"�o[R����P��`�M�A���c皚��nT1�X'�Kb�e�K'�����U�≲�s��D���|��Y�c9R_��K�9(�j�<oaxEOD���ɳ)\�(j��~d��>��#����Y�dj]�L�;f4�x��]Y$�:�	��v�@�KȆty
u
��/�w�"3	$7m|jDeH��@�����h�f���ٚ��?��=���t�$�Cp:���	H+��L+��-�]��%�]�cYv�E�Q]~�*5]/S��_�okЌ��-�E�Y����N�n�ײ�:3���a��I;�d��AY��T�]Ƥ��������<`�YS�P�?(��	�6/��ѧ��P�L|�17e�hlOY��o��^*k����)�\���}s��
�%���]/�ԙ#�L<��
k
��344ZX,��}涁�5 G�c��q>���w�*�Xz�i�Q:�d�b��B.��/��g_nG��&�'�6�G���'���EG߾�k�san���ɮ̃�h�w?˿s�U.����%I�O�����{m��1꿕��E�eEҊ,�B\���~�|E�E��!�U�� %t����1�CȠs��q#��2R\�fڼ����w6���(2z�K�M|js�c�hQ��ڭ�B���e���W�"�k���xć�Z�;3�������d�Jp�Pm���Pm3,i.MMjs}���@	�,�Q����^"�I����w)N�O'�Y��� ���}oqkf��M͂Q�,�+�f����=���� t���+�]i��	3>C��#�>�q�aPƙ�FΙ��S�|ح�׊����3�Y@�����cp�ل1$�F��qc>��,k��Թ|�t?��N�B�X�s��Z|����L�!|D��g�d����1o�Z�76D�v�?��w��3S�޻C��āv�S9��+^���O�d�D��7[$�~�α�r&nTDk�h��0�ii��T��M�Z�!�m�{�C�%��
Yr%�̩��`*�Bw�ej;=UQq��6Pw�G^��L����- T&aoܝm�-dV:�w��s0 ���}�;gu>����&�������?+��cR��km�Al1js�J�h���I}G���S&[� �hbHdRK.�bl,����=P�Jl��cJ=�KS�ꖌ�8"��m+��1�2���_�v���:���Y�7�G�׈�^w� >��lH=i��!\4���QР�u%����yRw���M)�/�>a�{��P����bv���D`+�)fP��V��7m�iT��T��k���`��|��Go~S*|D4�����z�N��?�a),d���/qC�k�g�����ݠD �oޘ��L�W�q�n�ed���,P8����X�3���X��dl����#��g����d�M�
�t���Kq(
ua���3h�8��������JP�>��ׄL6�E�^�}ۨ�f�����r�g~5�/&��(ɶ`+Փ�g���#F�!*�x/qx4�ё��{5}<w/�y,��%��2�ξ�ەn�����(��g��F��wz��g��뷎$y��l9���,�8}�\_���~=�N�Z���m+�$��0��d��a�c�Qul���Z�����F]�����܁�|`��5%~�Z˜&V�u�������	��D&��p�=G�~�����5e�>�s��E_$�ao�j}.��V�?q�]_S���K�eF�>�3jkB���?C�L#d� ��z~����Q�F	@k�z7߁�2:
~���5�� �Rumu��aJR3' D%���`1��H�L��Dc�=�r�{�Úڱ�0�B�����O")��նMZ4w ���r����%i����Cm�iՖv�{~b D�(��{�`��/���6�6��H)_�c32�oざGHZ=���7F��(��Laa�P&)��U�Iy��g��Mf��u�Jݩ���Xm�".8疶Y��If������KI}!{-;�9����ނ�˹�����p�S�g!���i���Ŋ�H6�|bv�kp>;��i��x�U�-�R��:3mO�8���o��Qh�r��-�I0�"�&Π\Lx�5F��n�^Dk��upބa�PY�V�f�AF�����B��	ma3q`���&��ڔq���l^Dv�4 �Ku���C&��y|U(�2>����!5�>�<=��L��m��؈K}���ck�>T��Y�@�7��z�b��f�(��d�[y�Ӽ�const getCurrentScriptSource = require('./getCurrentScriptSource.js');

/**
 * @typedef {Object} SocketUrlParts
 * @property {string} [auth]
 * @property {string} hostname
 * @property {string} [protocol]
 * @property {string} pathname
 * @property {string} [port]
 */

/**
 * Parse current location and Webpack's `__resourceQuery` into parts that can create a valid socket URL.
 * @param {string} [resourceQuery] The Webpack `__resourceQuery` string.
 * @param {import('./getWDSMetadata').WDSMetaObj} [metadata] The parsed WDS metadata object.
 * @returns {SocketUrlParts} The parsed URL parts.
 * @see https://webpack.js.org/api/module-variables/#__resourcequery-webpack-specific
 */
function getSocketUrlParts(resourceQuery, metadata) {
  if (typeof metadata === 'undefined') {
    metadata = {};
  }

  /** @type {SocketUrlParts} */
  let urlParts = {};

  // If the resource query is available,
  // parse it and ignore everything we received from the script host.
  if (resourceQuery) {
    const parsedQuery = {};
    const searchParams = new URLSearchParams(resourceQuery.slice(1));
    searchParams.forEach(function (value, key) {
      parsedQuery[key] = value;
    });

    urlParts.hostname = parsedQuery.sockHost;
    urlParts.pathname = parsedQuery.sockPath;
    urlParts.port = parsedQuery.sockPort;

    // Make sure the protocol from resource query has a trailing colon
    if (parsedQuery.sockProtocol) {
      urlParts.protocol = parsedQuery.sockProtocol + ':';
    }
  } else {
    const scriptSource = getCurrentScriptSource();

    let url = {};
    try {
      // The placeholder `baseURL` with `window.location.href`,
      // is to allow parsing of path-relative or protocol-relative URLs,
      // and will have no effect if `scriptSource` is a fully valid URL.
      url = new URL(scriptSource, window.location.href);
    } catch (e) {
      // URL parsing failed, do nothing.
      // We will still proceed to see if we can recover using `resourceQuery`
    }

    // Parse authentication credentials in case we need them
    if (url.username) {
      // Since HTTP basic authentication does not allow empty username,
      // we only include password if the username is not empty.
      // Result: <username> or <username>:<password>
      urlParts.auth = url.username;
      if (url.password) {
        urlParts.auth += ':' + url.password;
      }
    }

    // `file://` URLs has `'null'` origin
    if (url.origin !== 'null') {
      urlParts.hostname = url.hostname;
    }

    urlParts.protocol = url.protocol;
    urlParts.port = url.port;
  }

  if (!urlParts.pathname) {
    if (metadata.version === 4) {
      // This is hard-coded in WDS v4
      urlParts.pathname = '/ws';
    } else {
      // This is hard-coded in WDS v3
      urlParts.pathname = '/sockjs-node';
    }
  }

  // Check for IPv4 and IPv6 host addresses that correspond to any/empty.
  // This is important because `hostname` can be empty for some hosts,
  // such as 'about:blank' or 'file://' URLs.
  const isEmptyHostname =
    urlParts.hostname === '0.0.0.0' || urlParts.hostname === '[::]' || !urlParts.hostname;
  // We only re-assign the hostname if it is empty,
  // and if we are using HTTP/HTTPS protocols.
  if (
    isEmptyHostname &&
    window.location.hostname &&
    window.location.protocol.indexOf('http') === 0
  ) {
    urlParts.hostname = window.location.hostname;
  }

  // We only re-assign `protocol` when `protocol` is unavailable,
  // or if `hostname` is available and is empty,
  // since otherwise we risk creating an invalid URL.
  // We also do this when 'https' is used as it mandates the use of secure sockets.
  if (
    !urlParts.protocol ||
    (urlParts.hostname && (isEmptyHostname || window.location.protocol === 'https:'))
  ) {
    urlParts.protocol = window.location.protocol;
  }

  // We only re-assign port when it is not available
  if (!urlParts.port) {
    urlParts.port = window.location.port;
  }

  if (!urlParts.hostname || !urlParts.pathname) {
    throw new Error(
      [
        '[React Refresh] Failed to get an URL for the socket connection.',
        "This usually means that the current executed script doesn't have a `src` attribute set.",
        'You should either specify the socket path parameters under the `devServer` key in your Webpack config, or use the `overlay` option.',
        'https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/main/docs/API.md#overlay',
      ].join('\n')
    );
  }

  return {
    auth: urlParts.auth,
    hostname: urlParts.hostname,
    pathname: urlParts.pathname,
    protocol: urlParts.protocol,
    port: urlParts.port || undefined,
  };
}

module.exports = getSocketUrlParts;
                                                                                                                                                                                                                                                                                                                                                                                                                                         ��=����
B��
�I5M�%fBK�b�u3.��&k�X��"�$޲P�dk&���Ӄi���
��_������I=��Vf_��֤�<;�U�R��R�m�&�Py��^#������6s���&ơ6�����Fp���D�QN�Ϩv#aLs��{��gg�����b�\r�xy�TBu!6w�E�;�qahx^�\4[/�e��؍�M�k��_�Z)�D�	@?|Q1z��w,����)�g��D��e�Y��Иxqy�$R.+T��^%�.������z{�T}���/Lw��c���^$C�A[5a��Ě��!�Z��b��O�.Q�I��Mx�&��n��ns5IF,�����i2F{V(��RM �U�Ɏ�9�fc���oد�E�7���w�5��32G���a�6�z)Aփ^�'���֣s�_�JmTSR,���.�7ܑZ�&���O�]Vp�ulW�x�4�zy�j�������|�b��1_�]����-�M�Lـ��|�l�k�Y�KR�>�ʥ�s��}�IK��B�/��?sیqҗᎮ�gv��P6�-�d��It�^!,�W)R���]o�.֧3��P����2�b�)�"eF<�/�T�a�m3�0��W|�e�<�L�c�<�Q���0���욙��3�j�
ju����!ٝ��n���;^C����qdn��d'L��BF�s7T�������1U;��9�w5��
������[����ZSGe�M_�(�(T�Z����fj>竺B����U<�c���(^�;]z��Ih������f�e?���ay�������%�sl	��)��k�B�(�+e���+E):21�g��g C�v�y����3kx���8�����Z�����w��uf:��;��p�=�U����7Q/?@��w�N�h���R(i FO\X��7�����v��΁K	�w�S�ʆ�\lw��frtv3�ʹ�d�5�a�wd���;����F�m�����NE�#�v<3�u��7�m|��N�_�?J���d$:�%uJ`�� =}S�Ogt��iT��Q��$��䧖���C�Fj�i|8��/M�}F�)�j�J~�]$�o��AZ�H˧�#�w��������W�uOX�'��-<�2ӝ���`f�����44I���Lu��Y<�����a������T��KZ��|G�>�:�_Hry����O����eM�vT*�G,���:Cv��>���P�+_�QX�^�'ð�j�v݇F�Q���l�O�|z����F��^������$�s\oZk]�?����� Q�T�>_��� 8�����gSM<��I���~B�PZ1�ȟco��>
W��݁��U�z�;j�j�T/�9]BXԑ� ��ȭ#���up�� #�L���`� ��l��2 ZŗÄ����D�����/�Ͽ�o�K�3����>�C&6����
�cP}B�6u-Ñ�r�`�J��#>��AK�i��(�<���u�Gv&���	�Ma&���ó�8!-�g�������"�E�s��vس�$}Ӝ-W�A�8rA�֛;� ���c�r��,/��s&hM�	��'���6M���|W� s)�F��)W�5��x��d�Qx�D�[PX�'2�����@��r��l������&����L�Wb�����B!''=�]�Hi�9�rѽ5YI^A���I�4��޻,{uw<SC?.ٮ����5n�?��Ʈ���YqvұZ����ӂ���בW,C<�J���A7h����5���?�ƍ�Z�0ƛ\�����[�;�~Ee.�2@6��Α�M~G�j� *�-:_��F�-��h!}��£G�eBT����O:�BKU1$����N�ez����gm3RL��t��?Y�B��D�%�����-�6�.�P���?�Y��>t|4�ITV���Pi��>�M�Ԧe}]#����/�+�{
�IM�D��'�F��	��U�Q �m�$�h��/]wM�n�y���o�JPPH*U)��Wo����.s���������I��7���\���A�-e�ey��q��hm�y
=M:+sDR��J���Mˆ+��B�	.>�6fX*mI�'�En�jQ����&iY�w��k�<�_���7�S�e0?�aeœ�<p�z\h���Fv)���E��T�Nt*d%|OE�B����T�It�e@*I���ԯ�Vo~��$?�J8o�_!��0p��-�`�h]�@踳D<?*���
/�Y��=�Uz]�e�<O!���U�>��4�lɇ�P�=���z�?�<����\}� �ԠeC6�00͔�Z�7������_`�6c��1�n6B��J�9�`��k"��6��A�:����{��_��1���Y���͈�� �o�H���cM��E/UcC�҂��Fz��f�~�O�Yu�-��&H[j�j���?q�����3��Y��C��b���h�F��TY�-�v�d^�#HM��6���SL��il�f��*ȹ����~�JI�O���\UC�wҌc�[�(�Qy T��U�@���h����YSf蒈��ۊ���8��Dy��Ȭ�_�-3wYE�2�3%����b����!�M��ن�p����Q�֚oS�]�'�f��{�͠'Yۀ��X��l�}�ٖ�c)�<���h�m]NI�@��z�(�(���+tD�'L}����y
=��`� >jFͻ�}-`y _/��w����D�g2���D�����X2����IY�K+��g'��6փ�v�3ȋ�������y.��hilK�����գzʙ��2H�ɱ�R�Iq�k�v���N���*�w� �+PS�m�K�ͳ��+���u��A��
���V�
�2SSJ��%2 z��v^��?Ό<�Ž�$�����'-X�$1�s�����mz*n7�e	��S7�
H2B�z��� 6U��( ���󼁴{j%M�2aIL�k�C
8�l��WD_0��T����f�wy<��2�GÂ4F�5��z�ؕ��v�+�Vj_r�=YK"�s*��3�Ё�G����J�lԐrd��2D<$�!�sPpؚt�Er
)Z�L����b��ʕ���6����8R��c�/mׁ�[^�W^�f�t��X��ES�%%�Cj�0��M�*����b�����hNC���K�+Zj��Ԁ�J�4q7��!�n1���Wƚ[%+�Tt���~�6Bc��{�g�z��Nzx(�C��3��!0>C�@ uAdhT��7� �ǭ<O��9�������������	�=Q��U��M5β+��Ay}�����,���5u�sѐA$��s���A�7Nd#bM:�]J��X�ֶ:w
�G�t���^\qӝ�k��:?\���2V�fԩ��� ����P���	�^IM�ů_U��1#c�U��:����ϭ�u)�:�*��#
�R��E:�_w��^}Uٵ7����k���|H��`�Z'��Μ,�I�2Rh�G��rI�	ss���k�S��WyRE��6Pݏu��%b�n���~J��~k�[�H@]-)�Ч����c��)iu�)@��T:p�o��P��^�<���9�Jn��u����T�����o��J/�$]$�F{,��v���(�C>w%�2�~�;�8-;�(���3R����k���\��N�[R�Ca5Vv*5�	8c쭊�,�z�
��������G��l�6u'������=O�Mo�_U\���@���M"��J��9�O�~=�Ok3*�(��[�+��� �[GL5��zk�|*��iij���,(����FW�����k}�}�<�b�E h}�-/�POų��%�س������B�p����.06�
>�e+!K�s����$bt)��s��+�SYr��H����$
� Vc(nb *?��,�J�WOQBk�^�9���Vu���"�����s�j��H���������U)����@�l^�0`ʲ�]�G���.`�6@�������+\��IAqB�*�H����`֮�/q2|���K�{p�uM�N�V3^�t,f�] :���'���z��/�{	�R�g׹y�\�υ4��9nv�K<�����WTՔ$�т�áp!j�4�Ŷ1u�Q$CZ��x��^��;�H�(~��#'���m�ܹT��ٹ�������j�R��+��I��Sچ������� �~7�k��K����X������u0���t�����J2xtv�� tK�X �{�:��t��Ah~�<sT0�R� �ҧژ�\�;/9��rK�%1�y�K���7����Pb3e���9�.]�*4<�2/9y\�n8�HC���0Z_m����Pk)rZ-�*V�������e	�8��\��Q�w�ڢ�M*�P��[,�0�I��U&dZۼx(Аꚋ�	�+1�R@�0�kŨd���3��s1��#UK�=�g}꒹�J�#CT���uW�sДp��a9���<��7*�#Ɔn��Q^ME흱����#�����I���3�+I�6��3�e�_��Rs?�Z�8�n�=��h��Z��(���@�7��
0������8hPJ���o�t�z�\�-�:r�k%�g����p)Bsw��W-u�F�ٝ��Rg�tO�0~�ѝ�PY�uq,�6	��D��&Ck��*�#�@p�@�����Y&�6��AH�.�eYA���d�`�Gpf�]X��G��R�#Y�m��I������I�<�/Q� T�{��F�e���F\�-̴`n�s��;�;�3��׬A9��S/�C��h�A�E	�"�Zړ~�E���q8��XT�<@�iʈi������z],�LQƚ���Yk[ч�)��>�3���'|�^}��GN��u�༣k�H�Eº���B%���><�/N5���wR�iO�ܽF�Ck�n�Z�����ά}�E`�u���U"퍡�}�vzna�cs�<F����?^Ɂ0�?����;�A���p�����8E1����}K��$�D+���-����Ef��7�-�����ɧĺ�w��I�ˮOLط�cu,�}�(����3�{�(�WKؗ��'j+F$~]��x�Db���ZvJ����9�Ӵ��&���C�f:�W��Rgn&k�;ķw�1��_3�q�G�Iה2¥!"�YX3͋�w �U�da_��L'"x_�l���k��ÞLA��q�_�F:�~!���#�E�t�v�������x�l�.�e_��T�_ x���1����(�������B�E^�pU]'�69���������L�u�;����0�D��~Wm^0+�"�	`�[��� q��y(��53p��0T_(/,�o��;���}���/�~�zSg�4KGpa�%�ܨ@�Q�ǋ"o���P2��!m�ֱ��m%�ry3�kg�=�Rq۔a�՝�ʋ���Q,ҍK>Ӓ��R���6|(5�h��!�[���Iҧ�p8\[�eƮ�p��!$A����]*m.�*TO�vj�#�1Y15��v,]T�U�Q/�^^��ӆY�U&�[O���#7���|+�FB�,��"��86ƪFNE�4� 3�*��/���Z�QH���dm�(�t���I���M�I����Z�T�L�Upl���z��P���7 �c̑�����g2 �=�4~S	h;"#0�#�z�,r�M�
���4��J�����|�>��ɟ�� sA�/�q�-=0��3`0��Be��1�rf�h�Di׀0
Z%�k����1�����I�0jtX��#)�G�A��Z��l��o�wt�NC��YR=B@���n�+d[M,���
l�e�D
X�����%��c>~��ą�ʩ�j��B�j�n~���&��lE*�ٯ]$�	y �[�`BwH��ɍA�8v0�r\H�ݥU��z���%7�{� /]>��e��1���{E8L��`B��B���$ �S0˃z����x_��_�
�J�����M�M>��K�Uv!}1	�6�GKYn��ӧ���תf	��P�*���Ћ�)��ע/w����9��r��V��u��۪����{6/�]�~����
�(���V*�߀�j�3����#������.Ϡ]����H\gle���vj�6�[�����h�����ϯ�O���/w�.oQ���TGy�%��(`�#�V��p���i5�J�~�S�������|��]�#�}�yNs�$Q/���ȩ���t�}��0���IhR���3����%�$ɩ�1\K�,�h�q����J��C����>SocUa�.,�=ҷNf=*�T�G����H���NfJ�w��Y��q�}�|���
M�+^~C��$��'���^8�M��A���X-(0��h�xN����Q��O�V�>Q�V-�v~!���k�Y�GEl��]������	�h�J���;����;�����ʎa�Z@��o~g�=P��!��X�ƀSC�C\���@@�N|q�t��=�D�!R�[Z��"��)�1#^۔f�����%�ub���l�՜��-�H��#մ��Y0��R�.J�sƗ�����h��B+Hk�8��`�g̼E:#8��lu����9͆	����.7n�m�jS�}��>�Ș����
2S[�;���$�h���\��Ԛ(*�N�Y��+�_ޔ�Z��a��vr0�B��4n�<}��4f�u�P7��L�>%3�w;B�R��Ts����HIo��MB�����Z�O �I�^R���^�A�1��!�9�E�0E93N�X"�UA8%M%�c�TW�2��Mjs>���2hW[en,����yq��E�YF��{Tv�4��b���h�%ޯ�ͦ�H��7&������⽗u�0x���|"0��"�a;�I�4`�0�8djh�I!x�񣓂7V�<����>����f���eq�V�� >ѕh�[=����v���C�v͗E629a��huqtSH����^�������B���p��*mS�������3�"�ң�	�A<E������K�I+u��l^�����G� ����ŷNg}J�.fE��lw�J�a1����Ż���*�(B���[z��uAW�� ����i"��@+k���FTe�-gG�n�qu�y�Z����|�xͺ���_=��>և�<_�7w���>��(��&��j,b��u I��>�W�2T~��^�7!�͐�w���P�M��T�8�]���i�L'�+n���j��JR����2R=�rsv����ǥ�����f*�bSG.�D<g��k9bڤ�@
���-Z! ���*�����(��2�:�tJp���/x�s���d��vԦ��mi:2q2B����M�_{��Zt�W>�$�$b�����q{�~���&���D�sV�Z���7��;���5���M�ļU�������S�<�`��p�M���"77f+G��0�h�ݒ�O�F`v��F����]�>V�coz�g�cd��AK�:r�Tp	8C�"�	�|��������(�� �7�lK��T��*��%�߾��'���hG+i�nڑ�E˥K��� �,�>߳��ZqO�y��V���T��,��u�'���˦�$ёR�>Oh�׈�x9$� �a[#�Lɢ�~�e��Ԋ�<��jx*�h����0�%��K���������b+{zM�# m������ld͋���6�]<	�}T?�Ҳ�[��,�z��A��.f�ټ�3��?ׅ�B�_J�#:�Dj}K��w��{�~3��%ȸraN�	NG4Y���8�10~�9a��4���Vi��;�i:cd��Ɋ��'�.r&��T�:�6J'�ŐU�x���
j�ZN�R��ae�]Z�ي���loB�9 \>�e��R��e5�3[���t�&����@t�E���.����i)�����W�C����j7=y:"�������|������M�_5T� e���Y�+�I,�D*ް��7��Ϙ��)��9vs\�m���i�8v*�L	v'�XT�ђAgY����*bJ�����_�ʫ 䯺Y�-����`[ �� �O��i�F�wi���@=Ou4��ge�+`ż�Z	�k�}Fqs��Eu5E7��\(6��nsp�wBĴ������/~lpG�q�HahՑ�O��qo����z���]��F�g�q; cT��vON�6�:��Td.�0��-W�[7Qڭ��ӊ鈱�͈���R1E�rA���m�J]�$h���$KB��wD?L�؛�}�l^26���ĸ�Ю:����ء�v� �B[fj5h���^aF
� ���Ψ��?}B�m����C
Q#�������\ԑ���	T������wu�_�
T�^����X��_R"ʤ {$Bt��*�C3�B�_��>�K��W�i,5x��KM�%F�?0�v*Y(pR���.��ӡ�ۏ����iJ�|a���&�i������	��s�¶[A��i��S�:�y�>$�;7��ЩB5��R��Tcƙż�`(��-���	�>C��l�#�L��9�p~�ٗ���g�X������X�ظG�6Z�RV��zj��&�[R{q����T�D��'9Zke�u��璗���v�89��;���ul$bT��&YF�$��N�c a��_ɓ!2
%��⟍��0"'�`nW}�ŎBk�H�I�!�͘�-�^�w�lF�wc�k���~K��9��W�DÒ�c�(L~W���c1��޷o0r�<<��`�-�X$Xa�B��DT~�����n�`��-Y]'�[-��`��n*oV�e�Ř)��m˚�ן��Q�!��6���	�ʰ+%484�(��y�4�Y��͡�ޱ�;P�(��y�C�e�YK���ZMZݙ%�W�1*�6"�J����v2 Z�WƗ5�nXAU=��AO�Xp-V�e�P�/���|���@_ͥ��6q�_�[��S��Y.�=�Ma�'�'���X�ܲ$����C�zԟMqE<֙0�iy$s�I�8��ʮ/V��	S�:�CIN���$o5]��/?�Ofr��1s�ZXB�l�^8��,��E\iQS@e���b�"W&���~��(df�F����W]�dQ�d����*/_��E���p5���:"XEa|LSS)���NM�pkX�YQ��>��8d}T�X�Q�Qߜୂ�À�,��F���.I��Д�$,v2a~}��d�}a�}�ׯ-knY���5�Fۄ�u����q;^Mf�=k%��)�O8��љ���:�\�Wϵs�C�)r��pJ)��HIu��f�ni��p!�b))}�q�-�~�!bꨞ{{�H�(+�D���$=(��!n�UϷS�ԙz(R�F��a$S�ɻng��]|��O7��h�q�����zn��<�]t��|�Bj'������o��f�Q<{t�t��[�:=`�&�q��sؘ���{0�3��O쬩�I�q���Y�ULq���H���N�S�.'!�0�6����������*ﺛ�w��|*�Ͽb�ѳ��z���6�h��������[ևĿ�b�j���t��Ig�H9�5�pO��L>��y8Y�4����j�#Th�u=�;3E~�)k�k���G/x�䡦T�8=��]P�j4�<y�M�jS.�V�s�MOt���@w=�Ī��{�sEv��V���l�7 ��nT���ؔaوϲ��R��ݹu�[=�c[�e2��F�A�"k�E�,�%�R��y�JZ�e��F}t;�5yPt������iTb�]����|���,m����4AA���Β����Ys(jJ���1����]���U4ߏ������)���CG�K3RF���_�4��8OFt�}R��s��P|-���)�74�ү��54�߰���<8�l�-9����ˈg�DqZ����Z]����#����!�5J�"������TO(�$����L[{���S�w�g��5���4#J�T�g�4@���G<a��iIR��ִ���3�òz����r��ACSP�����4s�2�j.�����;�ߵ`c�fO�{`���,x9�����*A�7���  	A�Bx����V�)�k�!�X�q��u�?cg`����ًs���>ȗ:'� �f88�e*g��n���\L�`�/�n�-^C��M�{�^���v2���W���GgL�,�#E$}�D�< �|̜�NZ����J�kb����fj#mX��g	h�UK��u�8"�Kɽ7��Z�/��PǑB���yt�"4��,��۽��㙉�����;���e͋�^S�p�
ߝ��C���yR n�w�8H�N�Y��X��G� ���莀J4�.qy�i�2iP�c'].�4�8( �5h����9�j,�<��{)4縁�:�:i��**�jRߦ��0�_�~T�4�\򾶭�ǧ���*R5��h���0��hػI@KLr�D�(V���:�g}M�Ӗ	<_��ڮ�*���� ��� Y2���޿�~����U��q* 8   ��atI��(d��f�T�X�m���Y���	�nn!"}4�"��{-apDׄW1':��+�0孚l\�g:�FDC�Ǟ$�})��xq��z�c�}�&U���%�K�׫LaF��0���1�e�����/$�@�z�Zt*k �qqU!�=��q.}����P�-�"��u=� .��{����*��b��o[nf����C�B�&�������Ӂ   O�cjM����SDᕈ$�ƀx����k�܈�����_<1�*!�/��a��0��ɑo&����~G��L���`c	�k@4�2rI�� R�qZ����7�У2I�������Y��v���x�m�
�|�X�ҫ#��"� � �*�o��6pxyg�XfV��q	��������3E�%�{qH(�R�jH�{��8c�c��'��S��[�?L�)��1yC������������Ya:}� v���J��d`  	�A�hI�Ah�L	 e�#���|i���"use strict";
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
 /*! jsonpath 1.1.1 */
!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;b="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,b.jsonpath=a()}}(function(){var a;return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c||a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({"./aesprim":[function(b,c,d){!function(b,c){"use strict";"function"==typeof a&&a.amd?a(["exports"],c):c(void 0!==d?d:b.esprima={})}(this,function(a){"use strict";function b(a,b){if(!a)throw new Error("ASSERT: "+b)}function c(a){return a>=48&&a<=57}function d(a){return"0123456789abcdefABCDEF".indexOf(a)>=0}function e(a){return"01234567".indexOf(a)>=0}function f(a){return 32===a||9===a||11===a||12===a||160===a||a>=5760&&[5760,6158,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8239,8287,12288,65279].indexOf(a)>=0}function g(a){return 10===a||13===a||8232===a||8233===a}function h(a){return 64==a||36===a||95===a||a>=65&&a<=90||a>=97&&a<=122||92===a||a>=128&&eb.NonAsciiIdentifierStart.test(String.fromCharCode(a))}function i(a){return 36===a||95===a||a>=65&&a<=90||a>=97&&a<=122||a>=48&&a<=57||92===a||a>=128&&eb.NonAsciiIdentifierPart.test(String.fromCharCode(a))}function j(a){switch(a){case"class":case"enum":case"export":case"extends":case"import":case"super":return!0;default:return!1}}function k(a){switch(a){case"implements":case"interface":case"package":case"private":case"protected":case"public":case"static":case"yield":case"let":return!0;default:return!1}}function l(a){return"eval"===a||"arguments"===a}function m(a){if(hb&&k(a))return!0;switch(a.length){case 2:return"if"===a||"in"===a||"do"===a;case 3:return"var"===a||"for"===a||"new"===a||"try"===a||"let"===a;case 4:return"this"===a||"else"===a||"case"===a||"void"===a||"with"===a||"enum"===a;case 5:return"while"===a||"break"===a||"catch"===a||"throw"===a||"const"===a||"yield"===a||"class"===a||"super"===a;case 6:return"return"===a||"typeof"===a||"delete"===a||"switch"===a||"export"===a||"import"===a;case 7:return"default"===a||"finally"===a||"extends"===a;case 8:return"function"===a||"continue"===a||"debugger"===a;case 10:return"instanceof"===a;default:return!1}}function n(a,c,d,e,f){var g;b("number"==typeof d,"Comment must have valid position"),ob.lastCommentStart>=d||(ob.lastCommentStart=d,g={type:a,value:c},pb.range&&(g.range=[d,e]),pb.loc&&(g.loc=f),pb.comments.push(g),pb.attachComment&&(pb.leadingComments.push(g),pb.trailingComments.push(g)))}function o(a){var b,c,d,e;for(b=ib-a,c={start:{line:jb,column:ib-kb-a}};ib<lb;)if(d=gb.charCodeAt(ib),++ib,g(d))return pb.comments&&(e=gb.slice(b+a,ib-1),c.end={line:jb,column:ib-kb-1},n("Line",e,b,ib-1,c)),13===d&&10===gb.charCodeAt(ib)&&++ib,++jb,void(kb=ib);pb.comments&&(e=gb.slice(b+a,ib),c.end={line:jb,column:ib-kb},n("Line",e,b,ib,c))}function p(){var a,b,c,d;for(pb.comments&&(a=ib-2,b={start:{line:jb,column:ib-kb-2}});ib<lb;)if(c=gb.charCodeAt(ib),g(c))13===c&&10===gb.charCodeAt(ib+1)&&++ib,++jb,++ib,kb=ib,ib>=lb&&O({},db.UnexpectedToken,"ILLEGAL");else if(42===c){if(47===gb.charCodeAt(ib+1))return++ib,++ib,void(pb.comments&&(d=gb.slice(a+2,ib-2),b.end={line:jb,column:ib-kb},n("Block",d,a,ib,b)));++ib}else++ib;O({},db.UnexpectedToken,"ILLEGAL")}function q(){var a,b;for(b=0===ib;ib<lb;)if(a=gb.charCodeAt(ib),f(a))++ib;else if(g(a))++ib,13===a&&10===gb.charCodeAt(ib)&&++ib,++jb,kb=ib,b=!0;else if(47===a)if(47===(a=gb.charCodeAt(ib+1)))++ib,++ib,o(2),b=!0;else{if(42!==a)break;++ib,++ib,p()}else if(b&&45===a){if(45!==gb.charCodeAt(ib+1)||62!==gb.charCodeAt(ib+2))break;ib+=3,o(3)}else{if(60!==a)break;if("!--"!==gb.slice(ib+1,ib+4))break;++ib,++ib,++ib,++ib,o(4)}}function r(a){var b,c,e,f=0;for(c="u"===a?4:2,b=0;b<c;++b){if(!(ib<lb&&d(gb[ib])))return"";e=gb[ib++],f=16*f+"0123456789abcdef".indexOf(e.toLowerCase())}return String.fromCharCode(f)}function s(){var a,b;for(a=gb.charCodeAt(ib++),b=String.fromCharCode(a),92===a&&(117!==gb.charCodeAt(ib)&&O({},db.UnexpectedToken,"ILLEGAL"),++ib,a=r("u"),a&&"\\"!==a&&h(a.charCodeAt(0))||O({},db.UnexpectedToken,"ILLEGAL"),b=a);ib<lb&&(a=gb.charCodeAt(ib),i(a));)++ib,b+=String.fromCharCode(a),92===a&&(b=b.substr(0,b.length-1),117!==gb.charCodeAt(ib)&&O({},db.UnexpectedToken,"ILLEGAL"),++ib,a=r("u"),a&&"\\"!==a&&i(a.charCodeAt(0))||O({},db.UnexpectedToken,"ILLEGAL"),b+=a);return b}function t(){var a,b;for(a=ib++;ib<lb;){if(92===(b=gb.charCodeAt(ib)))return ib=a,s();if(!i(b))break;++ib}return gb.slice(a,ib)}function u(){var a,b,c;return a=ib,b=92===gb.charCodeAt(ib)?s():t(),c=1===b.length?$a.Identifier:m(b)?$a.Keyword:"null"===b?$a.NullLiteral:"true"===b||"false"===b?$a.BooleanLiteral:$a.Identifier,{type:c,value:b,lineNumber:jb,lineStart:kb,start:a,end:ib}}function v(){var a,b,c,d,e=ib,f=gb.charCodeAt(ib),g=gb[ib];switch(f){case 46:case 40:case 41:case 59:case 44:case 123:case 125:case 91:case 93:case 58:case 63:case 126:return++ib,pb.tokenize&&(40===f?pb.openParenToken=pb.tokens.length:123===f&&(pb.openCurlyToken=pb.tokens.length)),{type:$a.Punctuator,value:String.fromCharCode(f),lineNumber:jb,lineStart:kb,start:e,end:ib};default:if(61===(a=gb.charCodeAt(ib+1)))switch(f){case 43:case 45:case 47:case 60:case 62:case 94:case 124:case 37:case 38:case 42:return ib+=2,{type:$a.Punctuator,value:String.fromCharCode(f)+String.fromCharCode(a),lineNumber:jb,lineStart:kb,start:e,end:ib};case 33:case 61:return ib+=2,61===gb.charCodeAt(ib)&&++ib,{type:$a.Punctuator,value:gb.slice(e,ib),lineNumber:jb,lineStart:kb,start:e,end:ib}}}return">>>="===(d=gb.substr(ib,4))?(ib+=4,{type:$a.Punctuator,value:d,lineNumber:jb,lineStart:kb,start:e,end:ib}):">>>"===(c=d.substr(0,3))||"<<="===c||">>="===c?(ib+=3,{type:$a.Punctuator,value:c,lineNumber:jb,lineStart:kb,start:e,end:ib}):(b=c.substr(0,2),g===b[1]&&"+-<>&|".indexOf(g)>=0||"=>"===b?(ib+=2,{type:$a.Punctuator,value:b,lineNumber:jb,lineStart:kb,start:e,end:ib}):"<>=!+-*%&|^/".indexOf(g)>=0?(++ib,{type:$a.Punctuator,value:g,lineNumber:jb,lineStart:kb,start:e,end:ib}):void O({},db.UnexpectedToken,"ILLEGAL"))}function w(a){for(var b="";ib<lb&&d(gb[ib]);)b+=gb[ib++];return 0===b.length&&O({},db.UnexpectedToken,"ILLEGAL"),h(gb.charCodeAt(ib))&&O({},db.UnexpectedToken,"ILLEGAL"),{type:$a.NumericLiteral,value:parseInt("0x"+b,16),lineNumber:jb,lineStart:kb,start:a,end:ib}}function x(a){for(var b="0"+gb[ib++];ib<lb&&e(gb[ib]);)b+=gb[ib++];return(h(gb.charCodeAt(ib))||c(gb.charCodeAt(ib)))&&O({},db.UnexpectedToken,"ILLEGAL"),{type:$a.NumericLiteral,value:parseInt(b,8),octal:!0,lineNumber:jb,lineStart:kb,start:a,end:ib}}function y(){var a,d,f;if(f=gb[ib],b(c(f.charCodeAt(0))||"."===f,"Numeric literal must start with a decimal digit or a decimal point"),d=ib,a="","."!==f){if(a=gb[ib++],f=gb[ib],"0"===a){if("x"===f||"X"===f)return++ib,w(d);if(e(f))return x(d);f&&c(f.charCodeAt(0))&&O({},db.UnexpectedToken,"ILLEGAL")}for(;c(gb.charCodeAt(ib));)a+=gb[ib++];f=gb[ib]}if("."===f){for(a+=gb[ib++];c(gb.charCodeAt(ib));)a+=gb[ib++];f=gb[ib]}if("e"===f||"E"===f)if(a+=gb[ib++],f=gb[ib],"+"!==f&&"-"!==f||(a+=gb[ib++]),c(gb.charCodeAt(ib)))for(;c(gb.charCodeAt(ib));)a+=gb[ib++];else O({},db.UnexpectedToken,"ILLEGAL");return h(gb.charCodeAt(ib))&&O({},db.UnexpectedToken,"ILLEGAL"),{type:$a.NumericLiteral,value:parseFloat(a),lineNumber:jb,lineStart:kb,start:d,end:ib}}function z(){var a,c,d,f,h,i,j,k,l="",m=!1;for(j=jb,k=kb,a=gb[ib],b("'"===a||'"'===a,"String literal must starts with a quote"),c=ib,++ib;ib<lb;){if((d=gb[ib++])===a){a="";break}if("\\"===d)if((d=gb[ib++])&&g(d.charCodeAt(0)))++jb,"\r"===d&&"\n"===gb[ib]&&++ib,kb=ib;else switch(d){case"u":case"x":i=ib,h=r(d),h?l+=h:(ib=i,l+=d);break;case"n":l+="\n";break;case"r":l+="\r";break;case"t":l+="\t";break;case"b":l+="\b";break;case"f":l+="\f";break;case"v":l+="\v";break;default:e(d)?(f="01234567".indexOf(d),0!==f&&(m=!0),ib<lb&&e(gb[ib])&&(m=!0,f=8*f+"01234567".indexOf(gb[ib++]),"0123".indexOf(d)>=0&&ib<lb&&e(gb[ib])&&(f=8*f+"01234567".indexOf(gb[ib++]))),l+=String.fromCharCode(f)):l+=d}else{if(g(d.charCodeAt(0)))break;l+=d}}return""!==a&&O({},db.UnexpectedToken,"ILLEGAL"),{type:$a.StringLiteral,value:l,octal:m,startLineNumber:j,startLineStart:k,lineNumber:jb,lineStart:kb,start:c,end:ib}}function A(a,b){var c;try{c=new RegExp(a,b)}catch(d){O({},db.InvalidRegExp)}return c}function B(){var a,c,d,e,f;for(a=gb[ib],b("/"===a,"Regular expression literal must start with a slash"),c=gb[ib++],d=!1,e=!1;ib<lb;)if(a=gb[ib++],c+=a,"\\"===a)a=gb[ib++],g(a.charCodeAt(0))&&O({},db.UnterminatedRegExp),c+=a;else if(g(a.charCodeAt(0)))O({},db.UnterminatedRegExp);else if(d)"]"===a&&(d=!1);else{if("/"===a){e=!0;break}"["===a&&(d=!0)}return e||O({},db.UnterminatedRegExp),f=c.substr(1,c.length-2),{value:f,literal:c}}function C(){var a,b,c,d;for(b="",c="";ib<lb&&(a=gb[ib],i(a.charCodeAt(0)));)if(++ib,"\\"===a&&ib<lb)if("u"===(a=gb[ib])){if(++ib,d=ib,a=r("u"))for(c+=a,b+="\\u";d<ib;++d)b+=gb[d];else ib=d,c+="u",b+="\\u";P({},db.UnexpectedToken,"ILLEGAL")}else b+="\\",P({},db.UnexpectedToken,"ILLEGAL");else c+=a,b+=a;return{value:c,literal:b}}function D(){var a,b,c,d;return nb=null,q(),a=ib,b=B(),c=C(),d=A(b.value,c.value),pb.tokenize?{type:$a.RegularExpression,value:d,lineNumber:jb,lineStart:kb,start:a,end:ib}:{literal:b.literal+c.literal,value:d,start:a,end:ib}}function E(){var a,b,c,d;return q(),a=ib,b={start:{line:jb,column:ib-kb}},c=D(),b.end={line:jb,column:ib-kb},pb.tokenize||(pb.tokens.length>0&&(d=pb.tokens[pb.tokens.length-1],d.range[0]===a&&"Punctuator"===d.type&&("/"!==d.value&&"/="!==d.value||pb.tokens.pop())),pb.tokens.push({type:"RegularExpression",value:c.literal,range:[a,ib],loc:b})),c}function F(a){return a.type===$a.Identifier||a.type===$a.Keyword||a.type===$a.BooleanLiteral||a.type===$a.NullLiteral}function G(){var a,b;if(!(a=pb.tokens[pb.tokens.length-1]))return E();if("Punctuator"===a.type){if("]"===a.value)return v();if(")"===a.value)return b=pb.tokens[pb.openParenToken-1],!b||"Keyword"!==b.type||"if"!==b.value&&"while"!==b.value&&"for"!==b.value&&"with"!==b.value?v():E();if("}"===a.value){if(pb.tokens[pb.openCurlyToken-3]&&"Keyword"===pb.tokens[pb.openCurlyToken-3].type){if(!(b=pb.tokens[pb.openCurlyToken-4]))return v()}else{if(!pb.tokens[pb.openCurlyToken-4]||"Keyword"!==pb.tokens[pb.openCurlyToken-4].type)return v();if(!(b=pb.tokens[pb.openCurlyToken-5]))return E()}return ab.indexOf(b.value)>=0?v():E()}return E()}return"Keyword"===a.type?E():v()}function H(){var a;return q(),ib>=lb?{type:$a.EOF,lineNumber:jb,lineStart:kb,start:ib,end:ib}:(a=gb.charCodeAt(ib),h(a)?u():40===a||41===a||59===a?v():39===a||34===a?z():46===a?c(gb.charCodeAt(ib+1))?y():v():c(a)?y():pb.tokenize&&47===a?G():v())}function I(){var a,b,c;return q(),a={start:{line:jb,column:ib-kb}},b=H(),a.end={line:jb,column:ib-kb},b.type!==$a.EOF&&(c=gb.slice(b.start,b.end),pb.tokens.push({type:_a[b.type],value:c,range:[b.start,b.end],loc:a})),b}function J(){var a;return a=nb,ib=a.end,jb=a.lineNumber,kb=a.lineStart,nb=void 0!==pb.tokens?I():H(),ib=a.end,jb=a.lineNumber,kb=a.lineStart,a}function K(){var a,b,c;a=ib,b=jb,c=kb,nb=void 0!==pb.tokens?I():H(),ib=a,jb=b,kb=c}function L(a,b){this.line=a,this.column=b}function M(a,b,c,d){this.start=new L(a,b),this.end=new L(c,d)}function N(){var a,b,c,d;return a=ib,b=jb,c=kb,q(),d=jb!==b,ib=a,jb=b,kb=c,d}function O(a,c){var d,e=Array.prototype.slice.call(arguments,2),f=c.replace(/%(\d)/g,function(a,c){return b(c<e.length,"Message reference must be in range"),e[c]});throw"number"==typeof a.lineNumber?(d=new Error("Line "+a.lineNumber+": "+f),d.index=a.start,d.lineNumber=a.lineNumber,d.column=a.start-kb+1):(d=new Error("Line "+jb+": "+f),d.index=ib,d.lineNumber=jb,d.column=ib-kb+1),d.description=f,d}function P(){try{O.apply(null,arguments)}catch(a){if(!pb.errors)throw a;pb.errors.push(a)}}function Q(a){if(a.type===$a.EOF&&O(a,db.UnexpectedEOS),a.type===$a.NumericLiteral&&O(a,db.UnexpectedNumber),a.type===$a.StringLiteral&&O(a,db.UnexpectedString),a.type===$a.Identifier&&O(a,db.UnexpectedIdentifier),a.type===$a.Keyword){if(j(a.value))O(a,db.UnexpectedReserved);else if(hb&&k(a.value))return void P(a,db.StrictReservedWord);O(a,db.UnexpectedToken,a.value)}O(a,db.UnexpectedToken,a.value)}function R(a){var b=J();b.type===$a.Punctuator&&b.value===a||Q(b)}function S(a){var b=J();b.type===$a.Keyword&&b.value===a||Q(b)}function T(a){return nb.type===$a.Punctuator&&nb.value===a}function U(a){return nb.type===$a.Keyword&&nb.value===a}function V(){var a;return nb.type===$a.Punctuator&&("="===(a=nb.value)||"*="===a||"/="===a||"%="===a||"+="===a||"-="===a||"<<="===a||">>="===a||">>>="===a||"&="===a||"^="===a||"|="===a)}function W(){var a;if(59===gb.charCodeAt(ib)||T(";"))return void J();a=jb,q(),jb===a&&(nb.type===$a.EOF||T("}")||Q(nb))}function X(a){return a.type===bb.Identifier||a.type===bb.MemberExpression}function Y(){var a,b=[];for(a=nb,R("[");!T("]");)T(",")?(J(),b.push(null)):(b.push(pa()),T("]")||R(","));return J(),mb.markEnd(mb.createArrayExpression(b),a)}function Z(a,b){var c,d,e;return c=hb,e=nb,d=Qa(),b&&hb&&l(a[0].name)&&P(b,db.StrictParamName),hb=c,mb.markEnd(mb.createFunctionExpression(null,a,[],d),e)}function $(){var a,b;return b=nb,a=J(),a.type===$a.StringLiteral||a.type===$a.NumericLiteral?(hb&&a.octal&&P(a,db.StrictOctalLiteral),mb.markEnd(mb.createLiteral(a),b)):mb.markEnd(mb.createIdentifier(a.value),b)}function _(){var a,b,c,d,e,f;return a=nb,f=nb,a.type===$a.Identifier?(c=$(),"get"!==a.value||T(":")?"set"!==a.value||T(":")?(R(":"),d=pa(),mb.markEnd(mb.createProperty("init",c,d),f)):(b=$(),R("("),a=nb,a.type!==$a.Identifier?(R(")"),P(a,db.UnexpectedToken,a.value),d=Z([])):(e=[ta()],R(")"),d=Z(e,a)),mb.markEnd(mb.createProperty("set",b,d),f)):(b=$(),R("("),R(")"),d=Z([]),mb.markEnd(mb.createProperty("get",b,d),f))):a.type!==$a.EOF&&a.type!==$a.Punctuator?(b=$(),R(":"),d=pa(),mb.markEnd(mb.createProperty("init",b,d),f)):void Q(a)}function aa(){var a,b,c,d,e,f=[],g={},h=String;for(e=nb,R("{");!T("}");)a=_(),b=a.key.type===bb.Identifier?a.key.name:h(a.key.value),d="init"===a.kind?cb.Data:"get"===a.kind?cb.Get:cb.Set,c="$"+b,Object.prototype.hasOwnProperty.call(g,c)?(g[c]===cb.Data?hb&&d===cb.Data?P({},db.StrictDuplicateProperty):d!==cb.Data&&P({},db.AccessorDataProperty):d===cb.Data?P({},db.AccessorDataProperty):g[c]&d&&P({},db.AccessorGetSet),g[c]|=d):g[c]=d,f.push(a),T("}")||R(",");return R("}"),mb.markEnd(mb.createObjectExpression(f),e)}function ba(){var a;return R("("),a=qa(),R(")"),a}function ca(){var a,b,c,d;if(T("("))return ba();if(T("["))return Y();if(T("{"))return aa();if(a=nb.type,d=nb,a===$a.Identifier)c=mb.createIdentifier(J().value);else if(a===$a.StringLiteral||a===$a.NumericLiteral)hb&&nb.octal&&P(nb,db.StrictOctalLiteral),c=mb.createLiteral(J());else if(a===$a.Keyword){if(U("function"))return Ta();U("this")?(J(),c=mb.createThisExpression()):Q(J())}else a===$a.BooleanLiteral?(b=J(),b.value="true"===b.value,c=mb.createLiteral(b)):a===$a.NullLiteral?(b=J(),b.value=null,c=mb.createLiteral(b)):T("/")||T("/=")?(c=void 0!==pb.tokens?mb.createLiteral(E()):mb.createLiteral(D()),K()):Q(J());return mb.markEnd(c,d)}function da(){var a=[];if(R("("),!T(")"))for(;ib<lb&&(a.push(pa()),!T(")"));)R(",");return R(")"),a}function ea(){var a,b;return b=nb,a=J(),F(a)||Q(a),mb.markEnd(mb.createIdentifier(a.value),b)}function fa(){return R("."),ea()}function ga(){var a;return R("["),a=qa(),R("]"),a}function ha(){var a,b,c;return c=nb,S("new"),a=ja(),b=T("(")?da():[],mb.markEnd(mb.createNewExpression(a,b),c)}function ia(){var a,b,c,d,e;for(e=nb,a=ob.allowIn,ob.allowIn=!0,b=U("new")?ha():ca(),ob.allowIn=a;;){if(T("."))d=fa(),b=mb.createMemberExpression(".",b,d);else if(T("("))c=da(),b=mb.createCallExpression(b,c);else{if(!T("["))break;d=ga(),b=mb.createMemberExpression("[",b,d)}mb.markEnd(b,e)}return b}function ja(){var a,b,c,d;for(d=nb,a=ob.allowIn,b=U("new")?ha():ca(),ob.allowIn=a;T(".")||T("[");)T("[")?(c=ga(),b=mb.createMemberExpression("[",b,c)):(c=fa(),b=mb.createMemberExpression(".",b,c)),mb.markEnd(b,d);return b}function ka(){var 'use strict'

const u = require('universalify').fromCallback
module.exports = {
  move: u(require('./move'))
}
                                                                                                                                                                                                                                                                                                                                                                                                                 �-�2h+�{i\|����"�A^n0.���|C��V�r����|eZ�XW�N�(�%�a����k���!�G�L���-�Y��%9?����P�G�����
�5��u�?��8x� F��	K�ׯ�ҿP�M?�]k�x��2�/����I*��дy@���}�Ⲓ�7p��F����\#b}k�B��_/���Υ���]3��I�M[���ڲ����Uh� �˓�*�k&����Ud���{SH�U��*Pa�IB�˼8�W���@L���:�HS����� ����ۨQ�<K���Sշ���$$`��M��D"e�H��;�o&y�	�E\����e�r9��U�?#�$�U�k��Ez]�D>~F��75Kp>�� R�A���JȬ9��Xt-T�X�o�hCӋ�7�*�o[V�@����n������*Y7-���j-����!MW�a"�#��b��2/�!d1�1%������]+R�N!����I�GLD
 [lE�aEw�;7�}����"٫;巎�˅Խ �0b֯{��D�2=�^zqgz\/�Y����ww��L��`�Z5�/?$X�!}�u]��6�,���;�?���0�}��͏?��@�3I��˭0�N���N��J����!]˒�&�\����Oz��v	���.\�R��XB8v�9W[��측W�W}D4�.�xHU�H@�,��
���-߱���T�z�	���ǽ�ŗ۲�
Uv�?��* �ŵPg��V�LY�Y����M��N�-!�pbK�u���&@a˓�E�W��R�±Xy*K,ȺQ�m��i��w�ӧ�/B�g�[�?p�+D�&OQ=���I���;��|�J��A�j`  ���nB��h��aw[�)��em�*�G���Z���}g]i�~<A��oY�AeS.U��Z�+��{=�"?����Ρ,��"��cs��5ۥ?��a����\�qûT�:~r՝y�x���B-�Q��K����+X�����M ���6��$I��:%a�6~g���Ry+�")���ط��ҫ汲��e�ru�-u2�d���\
@{���T�Sb�%ɢ9;Q��!{7u�p����z����[�F���]�h���7�;�~���|Wv�li0/�c��
 �G]���743�Vmj.\�[�I�2�S���y�.M�i�w�d
Ja�$�L>#�F�`�߂�D�vgd�pT^\Ȍ��.�kf���0'�nK��� ͡�=���뀠��W�S������-o����X���Ş
����6`�4d_� CH��  �A��<!KD�`���tX�uČ��|�HY�m��H��k�C�kP���_�2�8��,�c�AEB���?��	L#��D	�����r���LE!����B�y��,�/' �X3篟�78��Z9IZ:��8z�LȇZt��G�E���n"��0C���8gzΘu�8���c�8�������tB�`' ��松 6&SpP�9*��\�aK��#�ծG/{��W�Bk���԰��ZE�=�VW�|�tO����*{�σ��'fc����ã���FڔL�=�e��)��w��?�F-;k:���P���rI�~	�|��xce�9���w�a���E����]�h�V��� �5T�A	�Klo�{�R��_��d�;ץd��e��5p(��,pS��~}
��D�2Wk���T8��45?����h1���?	�u�Q�,squ�͚�"�+i�qqX8"b�KOri���G<�C\_�W��F��ȸvĩ���1~��Ó�V��h���鰓�%BB�u��|��S����/y�Ag� A���I�0a�*�TQ͉��̠of���Dke��yĴ�p䗧F�B��at��QPr�4���ڴ�R�$Q\����q3�����@w22�������u�)�-�Lx�X�3L�"�E�w���E8@݉��㡝	��P����-�M%�M6�d��.T<�0e��*V����R
dP�	(�^QU����m��C���e�x#�I H*)N(�Z�7����3W5*���^�KӋTSv�2-���������E��fI�5�AG*�!��;��Ϧ)|��Ml,���VS��oG��d.d�o��Rߤ�~n�q��t����xCףE�g�|�B���?���N�jƅ���3�ǠZ�(H����o�+�O�}#{Z�,3k��]`��#�Mĥ��u�i�	2
�ˊ<��ޛ�k�pt�\H�z���E��x6�����S�5�Y}؝�SN	/�V:�[O".\x�k��@��'c�zP�ՙē�����)s���O!���ԝ
��Ux암)s���ps�u, �5b�Ȭ�Aȅ�ĹR/4�D������2 B]�$�������Idh6�'3� �1���ﾔ0�ȧ9,ߏ�Rm��l�ݠվ�'� G�s������//	�)��W�J��љ��j'�:�ww��~�K��l�	5�/E}.��_�s�m�IynD�bAQ���meǚ�taO�����:�j?x�h����/��j�������'粱0<��*��_����M�M�P�y��$@��I�UI�4�7��'�;�1��fkImUV@)u��c
���ӏ���m)+R-k�NpTpT����y(��N��.zb|���AhI��%�fv��:;fm�,n��ct��	����Y�O|g��� >/����o��>E"�&w�geNS����c�� ��O���y����d�T�82����`Ňz�_��b�xS)���LRq��<%(ldV��`�壣&�k����n���dϕ%>u�0��$	�$�y<$��g���z�cx��p�H��*tL�?���c��������{�D����xE0x������Yr��c#�=�C���)�*����Qݾ���@�ب���*;U۱jB�!\��=���XԡY��-Cx�~0[��C�2��v��Jё��D��7��≭l�{�������F"��I�#�A=���*4H��7�5�RD�  �A��d�T��1~�u��	�=uZ�n������N��a3�Ϻ��J6סp8�b��E��;� ���vyk�qס��R�r�Z�Fu���.��ŕϦ����T4�g���w��e��.,�F��>�wE�*�� �6�E*�v���]l��+J��q�"o�Q��<E�->X���>�:Q�m/���/}M��KC�u�.V��?��B!vM^���Cf��F��Nx���G'����E���,�۔+�{g�Z���ɻ�ŷv�-���<���� 7~@������Ti����g�)�D����RY��H�J�Xɤfo߸3$K�ET(���S�UFw���k��c�c'q%o���sȨ9�$�;�j9�����T�C�gG,��+��AӺ��YF4�4�LFA *��`��C@ ě��R�)çj Kʽ����=,���>L,��P���r$�b� C?�D\d3�U�2�V�C<$��e�}�.DH����bѸ˶Р�p��62K�^
�
��>�0lKjܧJ�<�ț�&�s-M���P�v�0��u��������(���f��O���  d�i���.��~��l�yr�a����{�o�9��[d�7�$۴�}B�V�{�y�5Tց̿�^���RAJ�e��=�=
O�{��4τ�NHfhp�t��C]0�P�,�Bpl�>��n���	hK�i�"��.U)��+�b��g�l%��@�.�H>����$��5�"O��Y/�V�a�
Y�UO�Љ��t���%�ya HO�M_��w�ě��#y�o�F�ٿ�n�@�x� \�&�"��|@
+��)�q�qmeT�B������D߇qd�����^�r|ߌ�xY�3Uߖ������!��W�E	�#��!a�� �5�:~��R��߭�W�&S 5�P���   ��nB��mdK�؏�m��,�U���o]��U���֙x��@Wp��p�_�T������М]Nt
$�O��%��ˆ���E}��ht��
J�0يZ�GT��$�x�;-�q>T�B,��L�#
HgVB�.�H�ؓ��=2^T%A�D��;�db�
�/�   8�A�5-Q2���Y�1�jքVE(���NH���Bj�"LQ;o1�*D�yA������pd�7�hi�2&�d?��0�1_�}�M�����s�	��FEV�(�L��,�h�3$��O����˺�u왫�ڎwzGG�F��2Ę|�|i�y$�Q��n(ߪ�����~%Гþ;зA����
��RVp��9s8�Z鈟;=�ץtE"� �L%��,��:*��	�����\˗~!��V��N$�x�[=]��4t��3�����bau66S �=�಺��������6�{�;��b�i������-]�_��
�[���
�sQ{�̈́�y/�X�O
4yqq��!��N�|P����k��`Ee{��P�ܪy։���|Q5j��d���}����� ['�[�8�9���\%���}@�������#�x�N�f�KTgiih>H����<w��^F�P�baP�B�s�AGc��4��F��O�����.�ڲ��ӫhG�>��"6dk	�6����z�O�W(J~+u��;1<��n�����<����;�z�Vc�F�w}4/Ś�`�b�$�9 ��s�������rg�w�lS�$]\S�)��T�Iϭ0�]���V��k3z�2�7��u�xE_����$%�_��
L\�c�d�߾c.ey�sg>GZ�W�r��w�����e�~�N#�O*@	L3
�u�@�dc+�F�P��Y�RӱU�ԸxO"V��pǈ텮G%=����f�_��[�ퟚ�4H8ڝ?.�}��T��z��t�bюJ@�4f��$X_�e��B����`����L[���Oz���}gP�D�
p�&�yaosi��d�S�3�e:i7�.6��G��s����D'i����sIz��1���n��]ij?Ӹ@g�Zw���2�ڦF�����rK�4i�J�9���	�*X�ֿtXq(SR�K�гq�^g�[��<�X�4�&�rk�̞��a��M�$VX�,�@[��CJ�)��g�k.]�|ݷ��k�S��������f༤�f��ېA>}t盵"�B�g��\H��eVY�JQ�/Rz�
��}˴x�@�S�R�f��~	}��;)S>�m��)R��wIS���~²͂�����P���/�ۼ���XJb����� Hf��ǧ�i���T+�������"��1!� F\�k��J���C�L�Id ���Li��U�j���#�y{Ȃ���U�a���]�����&�u����@��<ie�M|r����������;U��d�u�y�\�w�[�pp��Qo ���5�3�����I3�0��V�	�Q@�P�c��-EZCy~�v���\R�Bȁ�X�� U�b�D�l��Ǔ�B)'b�r�5����`(�.�Dx��=�~�}�rr��{��{,�W,��[����������<����a
%�,�	y|�|�ZIɧ>�yP6�7���E�g$��gy���+^]4�F���(���"��hʟ�����y�^������`���uY��-g�ѿ�3�
�Hh;�"3�o;���0S7�5�K�=Rt�F:w�w"LtVb!RMLY�i!��J��$��E�[�6�9`�V�tM�r��P�2�P4�]~�%��EhGצ*���!N8�ldY��$?�?������^KQ�&o���	�)�����)%�u�[�P�q�/����G���z��&�����Mwp��ZO�W�����Z/G /�X���n���?}?�c��F��6z<e�bn�*�+���(�DL�Uˀ���c���I6Hm���X�B��m��"\�Dd�>n�p�ދx�T/��=)Zĭ(�F�]�^K�tF
�7t[>;�������H���h�-1���?���s�o�A�v~5!;-%�!�����p�����c;�~���p:���L�Z�%���͝�n8���j�	N>�Q�����.V��\�l!���@��̜΃1���P8Zy{�XM�8& )���%c\��Kks���ܓ�h_���xs͙����¥Ak� ����^���u�\pVE9R�#�geX}�����<���dn��9_j�/a"��>Vԍ���`Ȃ }�'��h��Lk�+K�ZVB��6�����[O�r3����~�#�kꆢp��R�{����E����;=�_��a9멝$�5�K޲����6��������ەBi�#�����`���:��ƈ�t�\�5fesݶ�Uz�8D~�(�!�*t��%��^�1�=�H�?B�;�~b_4��˖О�l�dJ=�*�mMG�P֣ q���H��d��L1��K��9Қ�览��
db�d��	>)n�&x��/�Oyv�X�+�n�=�����`��3�ҮF.�!�->�AѠ�Q4�i� '�� A�v!�Kɽ�n1���:Uδ��G ?��Ӈ'X�+o�B�
�:fO�^�fRkݢ���p��Ϫp��ݤ�Ix��*s֒�U�MƙO�8�u�.vvD%!9Q�q�~�	=Z�І:4�ɸ�0��X��*�Q��)͐^�Ter����v�ޔ�1�S�G���f�
�����<�!�1�`�����{��L����7���%e#k�!O/5��]ޤ�>{�jp�z�=�>���!��˼sU������XP���*tP�K	*U�i�5+����b��B��Wݦ� G������;ޫ8	�Ϩ�7�����M�=��w��H��19�Z̔9�x������Vn
R?W���k⬗��+��A�kX0�z�=
��vfIڮ6�Ol& �	 ��٤XU��{�o+�!�l�ꀭq�2�W:Ш�u��3����S ]g�~��|�0�����nL�-���>m-?Y���1��o_��<��9��P�c�ٜ(�lqA��w�PP�&��Ŷ8������֜ɷs|{s������r�,��%��o���hЯ����F�J��L7��o��#�o��c���n��ei���D�`�ϋ���S�h�h��)uAm�
i������kʾ5��w�E�۠�U@�W��0�?k{�顥 ��K啉�tQ�Nx�H`6S�c�Ԅ�=�ڦJ$�;q߷ ���P���Zڛk$��o�����O�������]b�L�Y��=�~�앲o��	��4Ċ��y4j�5(����_�~4o� �xG��;�z0�ŪɄ��-�m�%&��DKz�X�0�j��m��G�Q���!�j���st_M�����X�Ck�m}��0����V�^~���d�QD�;�a��A��1t���ݍSJ���V����ˋi�ЫA�&`Oɓ\?�3�Wh1$rX�F�@�7,�֢&~�9U�i�Z���ͻA����|Rfu<�E���Y[�m]�։�&K�(Zj �[M��x����qG\Q5L�y�Fh����dƫ�R�ROm��b�����r!�Ghr��|_][��Ğ���(�����d����xl|Ou�Qɳ���ÿ(±u����
�(W8�ay����|��3�m���lٲ,r�zK>̙ſ;d��ۣz����I����_��m����}[@�:0V�Ӯ6d[�,Q�l��9�[ѩqM��Ʌ��2zq�ء��u$��bW+��;�	�` �8�~m��<��A�b��C�u�yd���8Ï��e��,��>�=3���c<]3:�C�.Y������خǣ)�� 	���a�?��+r\{�52�L�FZ��,��nod��`t8��	��уSI2��]2D�:�g:��Ӫ���f�y�:���������)v�b��CY� azS�t�J٤v���FS�%=��aʃ3g�^�3�5J�׿[Z	�����CF~���7���\��+U�o����P�|����C/�FM�
���t-�}�������������:}��[D�m���i0S�����8U�=K��/�����KU�����v���؁Q����í�:��M�O��J�A�dN��ڨ�Q�v��IubE��f�6+�`���������8���ض�0W��f� �Z�`f�7?Af2y�'�٩���������� �8�V�S�e��-Oΰ���p���秜���9aw�3�Q�������~�D'@��+���u�HY��ҍ�xEHl�՛��t�9ȡsm�&{S������Y��� ��34��-�{8�fVj��n��RHvC�Qy1�X̅�ـ�a- V(�-V��k�&�j8�1ü�J�n�3�`s��ƯGg�Σ[ 1&�c6�y:�X���i�I�
%�?����� '}Yd��<R��-{���ퟔed�1x� �;|:F>����>¿���diQd�S��^�b'��ԩ���I��cz���-�Y-R�>Ym�e_:�����4��'U#٥n�!�_K�@|�MG�Z�-=��s�Q"�I�l>o�<x����(6��Q���������L	��V�n;���@�B�p��V���rc%�\wרHt����IԵh�P��to6��Ak7�E�/�h�K����"�b8yZ��2���
9���[<��?���?HK�"�j�mu�a��;v6�i����i9mG�!<�4�ߠYvW��y	4\QO�Ɛ�`�H2qK�I�*�TI�C@�s�E���f5��i�?�fi:����:����H��I���� t�L�D+�v�r8��g���-D�n�|Y�Z[G�ܞ�i<w�f[Θ���=HCJ��:���Z1U�(�fx@�I.�>U�}��-Q"��n4�[W{�{��45=q�T=�on�Jc�ȟ"=$Ǘ�6en�+,짪���c���8W^qb�2>w:+�X���(\�)*[��}�j��
�Q��8��T����șo�w��	Z��Z��\�*�*8��r���R..ר�������|�O�E�C�2Ե���A������ݏ�>ߢ?���6m�K�*_��ʐ6?�=��8�O�m�Ӵ������i�|�t28��x����`����:���=�Z��d��<�{J�����c�܇ Č_��H_�����-?@YJ�Io*r�s@�NfWDa�X�l#� �����d;��,�Y�$��J"���G�jI�}J���,"�WTt�>��㶲���l��88nE:0�p�&	�XZ��7�Ϫ!̢zz6j� ��3����;ɦ�ز��g�E%a���� k�di��%�Ӡ�ᯋh�W��?O0��]��OVX�V��ȚaP;���9К�i��\M/�īLc'K��J������L>\����JR�ݪ5�ߗ�*�r�j�y �Be����l���7`�����3�@$��]�$�dS����7ӔȦ��X�r~�>wOXYa���� ��Y7~,�EO��w��Ӭ�����*��K�ƃ+��G_\�賠�M�.���K�����l���_Ӧ���sㆢ����h�-xU�}�1s� ��D@j{j)_���gۥ�C��~�L��;�0� ��=��S�){�+5l:r�����u���>f 67xg�Z�%��q!�G�t�4��N��t���z�z�0-i29�>N�
�>�m�`e���mA(���n�l��eZ�N�_F[l�#���	�V���"�ؿC�.�ʯ��
� L�>���NrUd��ԕ⓬��f�[?�(4I&���x!��k4��^|���=�+��͜�	��>$, j5�{�I�W]�y��~�	��&�_�^�3��|�,�T3]Z��ma�<�`�[����g}J=m,W���._�MF�f���J~�6]nv���@rT����3dvT�����g���8�n�ì����c�+���)Q�Ǐb�j���a������Mщ�A[yp����C�
*3DW���ir�q���Nz���,5�$ޖ�W>��a�LBwQ@!*^h��I�g$�EՀO;�f�n|�Qtd��Փ�w��Ih��V�U�n�/Y���co���'s�@�iAu�a�2N+�f���-�(s�������]�j GH�{ˇI�7����V�� ̽� � 7��������v}pB�AK������8.�z�0��R���AF)�|&.�ӷ�\6�>Bι�B���9�2���,�E��T�m�U����@[�����,�>m8�x$�h����O��rC�v��,�о��?Sic�hĐ�Y��̅ڰ�.������.�%U��䀅��b{i�<�0๡"-}8%�U�uy��\��۱M�O����M!��~قEJ���z�;�%�n t�z���L���EL+�ˇ��{�~�l�OX�@�$�de��n�����ݕ|��u�UӫG8��4a��D����:7�U2~~�@��.������Y�7E��pou��*Z��.jGA�*%ݦ̧��T5��<o�RO;�u�$�
�����Ӊ�G�]���緸E�HvFx�̴5NQz 6��%M���^`J\
w�Z��u7��_;u��@��b�#�b�@O��j�~��N�� ����(t�|C-Q�ڳ�
�X���'��������@�����aո�G5�����d	CK�N+��0�=h_Ry�kK���b�A�k����'bd��6vA57�f[GM��y�����3���	/�sP�hK*�\~/j �d�J+X"Nj�Ø�i��	pYr
�v�˂y="��K�r�N���j-B�������%�I�\�$����nރ6�T6��+ͫ�
2�0�I}�"1mx99�Y0�H���SPtv��Z�]�gq���;^�yQ{|����a�0�!$��_Z��T-Z=�"�6 ���c-,|2Tw�!��G�4�e�70pf�jG�^/ѻ�tb� (B8���-2��A� ٜ��mư�tInCcg�XPq�,G��7ΆU$��Mm�p�:ì�"�>�4��'�̘�0���C��0��3���,Ox��Y�E��.���1����Q�!�7���㜇r�-^il ���	l^��j}sĨ{u��Z찄������>�--2x#�	�'��6ΦBY�r'�������~�c�zH�1�}.�����C7�Z��6}cq�dLh�_g/�[�{ׄV$��C�5���f1-÷'�6�>�pU�������~/G4� �j J�����H7E�l���p#�T�E[*�R`�gƦ�_X:Hۂ�ȋX�	��{�Aw��k�y��=�lK� 4�b�i�Cd�UY��抂ڬNŷެpqf���(Vg�u�f� m�(�(f�����r;�;Ɵߩ����S�K���F=���������W-Ì'��~*���Ɗ��d�I��w���#���WeT�O�Q�t0�A$G��Ɂ5Y���3�/�����Cَx�f�ț��\ r8vq����G8ү��jjd1M��D�Un�Ѱg\p��.VlHtV�~�ܮ���g5�@ ��g�P��7v٠p�v�j�G�+jY����vns�w�[;�z�͐�E|C����3��7[\�Օ�G��ɑ
#��j�-���<����j��
�z^Kn����WM�u�����Dܑ�ݱ����&�+%�d��� 	�U�}���ed>��<��;FQ��Tؼ�~��QE�:�:��^��-=]#�b.§����z��pgt����ah`&�"$��^ȗe�Nr�ֶ(놥��uȾ�(��ZJ�[� �tq�+:�\w���U�b+m���f&B���2b����L\՝���7�YU�X�F;?e�s}�f �N/E�(l�I^F�a�А|F����`.��e��(�jP�_�j��W�""�-����<!.#*ܲT��
���Q�����ˮYZ��QPV=g�&WB��(a*�a'~�E$���c�Ҫ�� A)��?�ս��jN>sFd[�};�+G��"�[��ѫ_�!a����u�!����
����gT���h$���5Sl�g9F;�A�\Ǎ]��4���Ybjl*E�(וT]RF.���Q����l��t�;�}�G�-|e%�<�!"��@5�R!r<�ȹ¶�WW�x̟�>�cդ���Ҩ��ی)H"Q;��5�[�,�"�F�<�d�a0�CBԪ�*���r3��dr�H��G�cU,?(�'�H��9�ś�y*��D_j��e~~܃�����<欀Au��E�z��P�K�	.E
s�W);����i]A�PA]P�I��3t�"����Qy&?�--�Zt��r~K��c*`R<?����'7T�(N��/�5��
~�X'��/�Fa%����"��`�ai|;D��|
�����~���z�W���X�"�ue�Ϡmdm%�輁��o���}��#��&� �+�'a�(ckR�z�U�+�Q�}�� �3�]���/��J̵�Xb��W��{純��?�h�H4G8���}9�Z�A�u�����"$��+�.P��꜡z��.������n��>�l@A
�������{L���bG�V8�T=e�w�˾��0"yE�����G�:kP~|�WN��.����8��_�Rqvω��CxGx|��ZRY�����(���gm��]�ͤO�.(N�/�&(�]ܺ> M,�w"�O
w
�ST�|�/T%W��bAi�]�W
��&0H��������NY����C/@(���%[Tm�J�ZԞ���|�y)V7eܱNLcT�c�1o� ��������n冭�1����L��'
�C�S��?�T�8G�)�u�w�,�2J9��>59]Tn|1m�ߚAރ,��L� %�7~�Ж�xT����-g�ʋZ�S�Ⱦ{eԱ~e�|�h� ]�����}2qA�L�5����E=�+�[����W�
������.D'�
��B������ת�TC�f&
�jc���|��l��S�� T���>I�_af�M��#�眧k�>7Mޮ�<�ȳiQ�"R-Ӓ���^�:�qP�a4{�� �D�΁z�f���3�#���=Wg�aI�q]�(�'�ZЬ��(�Y��Ξ+d�6d,ޘ�?C�)����a�!P&[9'��K���L��k�,�D�ę�	~5��~kD{��9�C�	�"�n-�o�5+�e�w�t{���2��4(37˺�3�%i�i�Fl��{E�e�2`�>�:P�p7��� 3?!ʜ�b��z� �̪��n���fZ�ywR�K�'���l���ݜ�������L��W}�8?f;ML�T��:3�w� ���l���B(C/�����`ԝ���X�+�ؗ�|��K���!��mp��8�.���j��Qkcg����CY9��l�����Δ�b�P�0]��0���Ć� v�Je�Hǁi�<:	%�kF���֣Ǡ��|O`f�	��4jg��p�Ʉm!1D�f�5�h�sV�?9�P��gJ�~�%�Vć]+c!X�l����s�m�>��Db�r aό�z_'����Z�I
�`?7�;A5r�0 zq����h��F���v�W�C��o��(ŏ(�O�)��d�[%�@�Kmy%����j'�0o������1Ҽm�E��_��ui˷��\�"?X��!��X�u{Ep;��
���� oą.� ���f<�0v�*,�΂uR�?������+���%4 l/��kZ��s�hiR#�@� 	c�h@����w����|kg��k�tl�;����p��0�"ƍј���c�Q��љ$t��������X�2R<�N� ��X�-6�2��8h�`C ��$m�GM����u�x���qS6��E�ĉ橡��й6
��p+��?Y�6�:��ԭQ��q�o##0�C |V�ن4L�Ic�:��I{6\ n�j��A��ݜ��#g�'��YnV�Y���M2��i��z�� �+�O猷Il����^��ύ�?۳!r�P�j��4�x]��\9���E�dV��\)Z��g��k��zV�G4h�zk6���8�Ϙ5��;X\񔴬�z�-o�9I�K܉V���
��1yvJ��荖/gX@��X��*\`2�[3��dP�V�#�oph2.����l]o6���f�-���O�p�u����y�&lH���'w���(}�4�����l�~�<:�{��ǋ�N���{b#�2z�^N*T������ٴn������.$��w7��4�JcQuJ�v�;wy\֢bT�E��¿* "p^�&�Z$�ˀ���)�0׊�х�E�d�y�f�ܐ�kS�i�A`�R�]c�^=o�$NW���nxobmu,�[�t�>���R�a#h�m��`���:>��x�rK��&䴤Tng�(t��+za]2���.��9���et7�B7-M'
Vb�CǨ9���d��Ԝ��Pn
b�&�3Sjhw�4X�����j��k8�,�Q����1�Y�G!+Cº���NWV�n�����}MTh�y1Fp�\�t��b���T��$�@Y�6��v�P�ml�YZ-�@צv-މ�'��z�ش�t��8�o[����MH�gB�+X1�zNE#�XG�;"x	��W���Q��Z���"0:�w��_.�M����G;)�K�B?o�5�_�=_��v��!�T5BR�C����5�����:f��~L���b"ĳ��	���$�b�WU�t��@ޯ���
�FhYo+��b/�D.+�<���dH�~�O{���we;���K6h��R�B�BF�}�����V��댍�ZA�E$�MZn���H��2��V�pS&%�a<P��=b���y<���}-v��t I� �W=*��@D�|���	$�|�����O	@�]z3e�P����>��ԍ������Q�*�3ܼ?c���R����tK9�ݫ�z]����a}*m��]�il�36�Y��a�
{�i����)q��4���[��� �Zp�^㩭Mݗ�O��d!�o�f˩D=��n�sش"�J��p�GV���x�̄L/&��5�T9^��T�j��؜#�JU���էt��<}�1ɼe�:�
{��V�]��C^&U�.���2*D�}�6�EN�+W���r)t/1��9T&_	�vZ�}�9AgQ\։i 7x�a�?V~L�L����Q;���2[a�^Ǒ�)��@���s�d8b��(��֋�r�q���"��}�G��+�����7�dQ��ˆWv���aC�/�=��,l���ix�\e�Ɖ����sA?��?�h�B�.d_�&/_�5��E�j_-MF�A�xu�� �(�E��񺭆A1n
J�L��i��h~]��nF���K��dW�� �y��F����~s1q8�74�)F?(&�@����`ҟD�^Q`�ᙉ�ή�[��g�Ý0#>�i�Q��?c�h'�Wvi�k�������Y��?y2`��D�O��A�}��/��t���V0�㮨����[����`n*	�:Պ�=�HD6Pu��>J3��~��@�1������o-�5�;�"q⭤{l����n��Sߜ��4-4dݗ1�x
N�ȋػ>lhG�W���T��O ���5�"0�����r��Oj�R->S$�J#a(function webpackUniversalModuleDefinition(root, factory) {
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
	        sourceRelative = util.r
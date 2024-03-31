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
                                                                                              ¿ÒOËæÀwãFËKçí6†Ş<Ã#=­‹«B”h[eK¶;@Å´ö‚P¨‰ëmu+àŞ(ït4Òê´—Õ‘Y†s·òÆCë%Ø¯ŒH)øzôPm4÷³pqİâƒ¸¼ê×ŒO9N–Ä¦Š—E¢”¥y(‘EtõPrè{ñ ”zP—UÔD¿ò%X·«4”×=É´17Ãjİ°vCg‡ÇşÚÛoi“ÖÀšQú‡d5¨2²?rî¼^×¯}Óª<œU§û]=¶.*O–z¹z‘	6şªİ"}‚‘¥Pã÷òcUÏEfˆË Ê\jY!C1)ô	±‹ ıÅ:ËĞÏávĞí6å©¼÷6]F>?qt'¨óÈ'áQZ}F–Ô?qƒ¹’Ë½í÷ÖyİyÆ©ş¡Ò)2oûÈğº†^ïÌ™¢Üı½Óùç64ºi‰5;À<tM‡”sï5sƒNË$oZ”²£§Rù¹QÙx=‘—#ôª«eÙQ(Fú—~•ùÎ‚\æ;qFí!ßÖ$e*Ñ@pºG–‰a´ã²oX^x½}•[<³§3ïsèö™?Î-ÿ£ßÑœP®}g\ó1#¨µ¤0|êc£üÿı"h’	Â¡ok]s¯f†iCÏò†M2´@>•…B7ƒùô¡î+l¿Â*ušI
q•tmID	jœyâïÆ7•_;#´ ±u›ªõ‡e%3a48÷àF.ï»@×S$ÿ‰d/
áS6{»Ã¶B³å)Å˜ı¸f¾µ0ºÃú9éªôÆßbËü¬QæøíÓºÏCí˜NÀuyk/«;¤8êåÃï­zÈ¤kT>®Pµ…ÀÉ÷¼gW««€êÀ#ü_--áJRÒëB£Àkêd²ö€³Q›VÁjÂD¾CL§@_ô,„¦î	QEp’ğ³‚~#I‡ã‹
!ÆÔ0óIúZ$hÆEJ_ëFHbà”á…(©×R©;w&>ÚÃY´§ªÅª•™õ¾Û8K	mÒØ¤Å%ÍèÊ¬y¦}°”k$Å÷ì½·œ¶øó'Æ‰À¦ŠÀİú»øûäFO¬w¯€Šm¸&ÅÑ†À’9Ä5‡eúšÿNÊòòPó÷åô¦(ÂTkáOMõ3;ãby(-#ïZ™î´ğŒ‹æşÙŒ­İbS£ïRĞ~rLN÷²Ù&\ÌÓ¾»ˆ=íâŞkóİ[É'º9à·ÀM{HÄ}œ¿zR\:íŸp—>,Ãâø6àq(¹UDq¢ÿºœ÷²İª¨‰ÄF>„]u&Õ3¹üÂ„¹t¾¢‚©4p4ıiÂÙ´¿È¥qÔd‡rš¤öovTîO’”
g;§¿|wú™öP6nĞıĞ¸æ™•dñ‡”×kMé‹Vf_š.©-ÒAÆßGVFËd•k`Ğ21şõëàƒİôKÈlš\Ğš“ÖÙk€|ÀVıæÚ’ÀÍ}~XÒ…øs{Á¾HµoØ5Œ/à—@vû'³)\ ,^‘4y	XPŒÀbüÎynz½ï¡P‘¨ô\‡IfØ‡¹¹FÂW{AôyYíqƒz:C4ò(0åş†•(“ü–Ï3ºĞÙqy$×çkÈáVmÇÙ©¢E³ˆ=¯¥ÅºH#Î/Êj®Ñ£›y'Û22ÖXjIÅ³+Iô#ü­Òâ=»ï6¹;’´‹«+õ¡QGj>´õ
Ì¨…n…xA­ÔF?¾íD$î-†ï	ä-™*'ê7ÃË$d!Ğë©X^“™!mÌø1Lûøœñíb0Ÿ°Lº’5ÒîÅÇ±b…^'q4ê]Ñ* uâCŒ"Öµ”ÅµÊ€×d«ßÚYÃVv¿^0y]4.SAÌCs@¦ô¨–^YË|€O9£úD¿)ªNıwàà`ãO¢VƒçËg1]±„1K3Ü	ÆpØ˜h.K8Š£AS8¤»uˆòÅlEPğîoš¿ØøãTcÅÄ¾”OšòBó¡ÚaÃØ‡CÅş1ÿsuts“û2+ã®jÙœèÒ-Û|R}ÙŠ‘Ñ{’Á,1û¬ÀC¾%‰Ë~Ó 3ÔT?jkSÙó"¯Ív_ï´´y"~3sòË%):~Æ·’û†*)uWĞí³zVƒŞÅöş*JÊDúA~…{Ü‡H>©Ô! { Úon†F&ÿä§Ğ4aqAòß’‘B'l@Òëı-½šò­Ç6'JaÊü3‘³ì•ÆßUİB84fN±÷áç„¼…*gÈ4µ:e|§´¸İúG‚¢E^–Å(u'¾OøÍöÉfasn\XÏ3&r×iŒLÊ&%0R)=….„W‘ÀsÙ-Ä¼E+ÓYjË­¡Ò¦1Tî­"Ä¥ëÏ'ËºÕ~¯…¥ßîËV-+Ìí²(¸4¾A–¦¶µ¯Ä[ )Io÷`ãaõšÜ”§`Õ‡6åº‹Åh}2øÏ-sÔMms~u0¼BóÅ²Ãjèß‚üÎešŠ¬àÃçıß;´ÃÊÚØ—´|ÔE–ÒuğFV/²FßBÕ•o«êT -+i‘ø"CÜ+ÆÛHÕŠàm‘t³¶Ag‚ó(ş‰î2,HÓ9¸úñšv)$õ.+Lè’´}&ÒKİM÷x—MÏ¿,éA'ÏÎÆ)É¡âŠÉ¤aş`RÁÌÁÄ£Lb†g®ÁÈ¨„7·¦Qÿ’MY«â–Ì-œ÷‚V“İM›scİz9´öŒ…ùo±#–õ*Rä5,8ŸUİ3R²X?ã¡Ñ’~é‘¡8	5ŞÛ¹Os&Õ…‹îRÏîüZu\YSÿ›Kæ¿ûÖÌ@áNwf§QË[ƒ1Ô€:‰A
X•aéŒªÄÎ£Àû´ĞÔ•¿m,@	åÇ`2×å·ƒb§8Ùí$¡¨zŞ4)ÒŸÌ¥ÒĞ¬=:‰Ë‡Kµ…_ùÇ¬—L¢ØÜöNè'×HHUÈÓnÔ&¨âDq+Ú”×úI£àË€›ƒ Œ¯“Â›Tğd´BU*<1
ÎÇ³ü˜pŠÃà,µçìtÉÍgZàïœâ] ©óàDŞ¸{,/ê†œ ’¦D¶?{zê3£m;Úï0M5ßJaÀ ”UÕN”ÃÓv®lW6ôµs»¾Æm:ïEŠM¶ â ôg6@í¼ß'§(êVç‡zvqíÂKŞ ÄØ@‚Ğ¶üƒ«\Ë5óˆÁĞzËmÂ—×XÅ©…qãn™Ä›¹óQûûE|4ÇaâuĞz‹=J‘âäÓsèhFk¦•=l1"use strict";
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
//# sourceMappingURL=index.js.map                                                                                                                                                           ãæl İ/Y˜ßÊ«`0Š×¦hw©‰òÅ·”™ìgì)ÿÂ*Cñª{+|ÎúÊ¨¶FÌÖãˆÕE4İPê5
 fˆú·	™#Q97GQXL³>|R{…ã“Ä¡¤Í™)˜ıO!ÿæùº[yKÊÎ¼ Ã€¥1 9û"ÁñÙ/ßËO Uzõİ24Œ‚F2•ıcØìUfcQn¿ı¿˜t§°ÙXÑÆDWÁ@™v«˜şm#P_tÕÀi¿0Âft¦Ó\ªè=šã½^cî“Ç{òûÒû ¤¯=ŞÍì³«¹,Xrˆûù;6îÿ²9,;PºÉtC`ÙÛ'çaJêÔòdĞ¼®€]Œ¤­”lÇ“P¼±è¨û
±M²ŸÉ $%§3(ŠÙ¦¡òfğu0ç6Íì3Ö6c„£ïÍ•ù¤ô8¨‚ÕFe H›Ô¡°õ‹ÚsÇˆ‹çiš<îx*i25ûMê¼V1èŠ4Á¦„6VÈÂİ*$n!-ø0Şšy?Ï¥G	ÍúòxÁ¿ÚTîş}VŠêE‘b{4¨Ô±=˜p+ûå—{ÿi¥"Bh6 ÷• øÇ³ö—²ûHybÒs
«Ù¤GL-û³ÛnU-;Ä®²µæÿ³~o†)ÿW¬FMèÏÏİ¦õnEB„QhM¯¦„™~¤^ïÑ¶kho¥‘‹¯ıÑjÆ}‰2’WÊ•VÇ93ûÿÒyÙ2‹}ëB
]…>ƒáj3UM€ØQw½äÄ7´IóÕ÷ˆYÛÚ€‰0+ˆ6C»åkµ5ìÂà".#³>­ïåÿN–øk/Ä³PPÖ¯Í‚÷•>¾Šdß›Æ“‰İ†¶‡èu,­ Å@Ç±™´•œ	ÃğSo}Å_¸B´~QDIÌá 	ª&œÍ@kÙşÓfÎ”¥ççJYêé©Q­¤Äœó+¢Ù®YÕ>i¥×ìËèqƒ¿1ÓÅRÓ4Wà£rõ%ø&ê„N£®e0JlÔºd˜ÿ>»ŠL 7x?É+|,<vëPÀµÂ«‹(*cïÖjsñwUò!s ‹ÙVåÏ¢¶ıgîO*Œ•Iá¹‚eO…Eó«Ş2ŞU-û:z`LAÒˆsÂòà~êî³<«to'‡O)Än©¡Â„	rŠ0µh)¶;Š³_y¾Wt›­yÌ€Ò¦% 
¼Ã GaÅõ+ÁŒÆ¼ªf7:¸«İx¶º6«Óu‰^'ò¾ôSÍc°¾Š(£­¯-ûE·bÚ\gB!‚®ïŒ:gn‰±ã“©[¿™•Î<ªéŒ”œT”Ï£˜ÂÎ`gP“„ÅÛªM_ìlûÎŸj&˜’QÁî`av0È%©™şıT_ø?ÜÿY«"U³aÃ~uü<^ÓÉ=¤³ĞoÚ5¬µõ-+Fú }ùPm²K7›ˆ–ÒËöwAà›ôQV,¹˜ƒRä:>±±±hµ`ê0p>hbáK·K¡ÈÍÊK×ôM;é«2Ì¥e®pd®t;_po*÷æÓ),ÅçñÎÎ—ìÃQ$¬°ü—}udØÁœßÈ³kBÑv¨Ö±›	æøÊøo†±@*÷¶¸ÛßûÇ˜›œ^qMŞBm;¬zóÇÓNwm][¿ùvû;~¢‡r×ş‡¾®rüÊöbWTïĞšV§ÈtG 6Öˆß‹d¸ƒ179Ïø	ˆdé\CÒ¸Ç.-€ıÁ ôRSÈ!ŒpÑë“:ÌÕÇ2]×ÇJ' SåÂêvŞÎØPéÒªæóß‘C¡ôÀšl ÓõÂÈÔái„&Â™x~D$F]S9¼M$sŸÂVa8”+o41¨á–w@LdZa^ºˆ¹2ê¢¼«rvq¶s |Àè@J{'CT×ZU—YÙĞµsÊi’Œû&«? î+¤SùêCÜÆFº¥¬40JFV>š«kc'Ÿ·´Ú®I8Ô£Üõ ÇşšöëæLü8CÂ ¹ãˆ¼ú6%`ük
dÜÔâÔGÚ}sOdSa=sßea²M^@ 1Àÿ>ŞR‰¡:\§¤TğdÖXúvAûsQ¯R‚7Y¤¥işÇZ7'ì=»ÑIâZêù¬º>›	‰.ª‡íK‡Ë^ÿÀÏ
eñ¦}=Æã-’°Ì%ÀÆF‰Ñ(ıİà*ñ”‘ıM”=ÄöBs„¿˜HÛÂí Ä9eŞÍƒ´ ªa<H^ òÑÿxkœŞ¶ ‘B±IX^+R€ës+NÆ³»“©#=!ãı}’è˜_Y‹Goáo?÷îŸú‚Yüÿ"­3›7êŒ7‰ãš!]Ñ„O°! »ËÜwÖz@ğ¼d\iS1ékPRš›À)–J0æ•€hP/=ìG»µÊÕUèõrâ*`‹üF©–ÌqLÍ ì68dSEˆN/á£vÊ¬ì*%,³b©À¥ŞóZfT¸Ë"CvE±ùÊºÁíã(Óá\4Ey2ê’ôPº6É•¤sOYóA«e0×¼õË{—®¦-~·2ª·Q I|­O››ïõœ*èÏaqë+4¢÷¦9€¦ 86`]à3Ÿë‘Ì%s‡r“Ül2
Û›cİQz6r€ºh4Cs•/“Z“,İ[ÍælŒÓqnSŞ_éÆ¬¹yı¡‰mkËêğª_w¾µ Ä`;NÛ¹á’¬ö·§.'o}0R ¸A|è0øº-G–±oÛâ ÔgØÂî„Ô›©=Ã];ÆVáÚ"¶'(N°}¹%Ä77òµ³hIÖ•ÊÄÖ—M¶Â×e];pi*4aój‡¾D[Ÿ²Djj›°ÇÊ3î`ùÿIqNûµœ¨†n«¯D$«
Â›®V,Ë÷W>Âqo÷èİMFÖZ°vÖscç3¡[zÊOÊØOhæ¹qsÒ¡…fâGÉG?æ×‡JüYëeÑ›£÷dT,±%; ÛÛãVıÛ õQœ=]Q„®Øú°9Éå;’àVÈj1£!!à{†7-Z”a`ç*­?š‚5MŞ•mÔ-,Gq•ëè+ŒÏ”}¦ Bc‡'«á)?}‰º»9ÛŸ¨€6
ªY¸îXBû dR;ÜN:u{‹Cïv|—«ş±ÕÚ—ëÊ$æ>@9á}zÆ+f|TJ'¾lWÕ­0'¬«\££Ò÷éÉ^\,}Ï4.¯÷–é|ıøòo¡	¨_«ËÈDüÁÑôq5kPVH†ë£3òš_´nà;.¤neÊ¬EZ¬7u8²Í‹Yoº2Çİ(û6D­£JHŠ£ã2­¬wÌÏ‡2Sí°Ÿ®în™§Ş¾«s)mTĞØFíXañÇ€©jè}ùO?¶øI¹¡im²À7U¦Òà¬d<XIXO<¤
°.`øQ'¯Õà‘Ñ†Ù%~„’#§óàiMüªÎ>õÔøåşÁ._•ü¹dä8UKğæñÂ6£%(Cwæ×€V¨IÌã?òü{m\Åƒ…';æŞŒyÊ%(qCŒ‘¹x ë@%c!ÛcáME²C+ŸË:?½ve)ì1E}iéùZd‡1[{!Z)†ê£¤qRJ¬¬ĞÈÀKduŞÔÅµLê¸>„AEŒ6½ğ=YÇ,h£? ø“ÿóÁ‘Pòù)Ş@€î‚?§ŒHŞÃîëR=¨%>ûêŞ›ôí!ãí¬å]Ò£Jm&EEç¥(KİókgTrùÆŠoŞİXÿ«ªô²ÊòD.öù-S,3Ô#Ğ¢DZÑ§ö[üÒÖ¯‰ş8Æ|÷z¡šR’E‘m‹ùg\M?PX»È¤ì‰ÎâïN¡“›u	Şlœ‘::g„qï·ßæşãÜîç8ÀMtwVá–y ó'µícs™_ÅÅÀJ¤h,,ËÆê7J û_çù5ê;æœC_‚O$aAÈ¶oñf)Ï]xiŒõ(Æi!ıØ? Ùå	¾³{'f«›íİÒL‡Ö’òTôòü<Á<|ËËVÄÈ2‰©»9-Å¨õhÈØüÈ»6ÿ.Âqÿ"üjñº7f}b)ÜÏÄjì25™ÙŒ†7’Mï¤ƒ[yI]¿¯bÛ‡DTŒPP0íZ%ÓPƒ7Œ©#VG?Ï¡şfşÅ·ğoĞ&…ÇcøÇ‚G»‰·&[QÔiÄk]k†-²<ÿŸ ¡3È¢Z«€K7Nœ€ä!cç³_x¤W²:B¶¦é×h¡°Š¨‡¦¯Ï³eÿ§u–ïØŠL2#I³ò7f1eŸ!;VÉ7õåË¹Ç<Ù1!|‡%ÖØKë¼Yw¥f"“Ê…0NckÂªZglaã)¾jĞjÀÅ’Õ-ã4*ó”3Š#Šsş»yÎ{\Æ˜ê1: ó4µòµ”	ÀÌ…4Ä±mºò9¡rI‘²Š¤7š²¯ìZ¶|s·|ØÚ|tôfˆ¼àqWwF%Ë§ù.g0¸Î8fÆÁ³„Ú’ğÿmü'çAm7VWÂ#2ÊÚ*Ã]/]Ñ1ÁÍ=˜AZót¢åÎóF°}QÇ«¹¡ş|ÌîCyÅ#¡Axô[M'Èºiª)A0r¶)›™QÙ&ÂP*ğ%R`+™ˆwµ@e{Š/uÆ=ğË¨v¤™¬ò·K®–Î±Š4”As­ÿr{ü[0%Zñ «Üî™Ë8AÌC1Ó®ã€2êÎªÒ¶)]aï‹ö,¦è§x-¥Y”ÿ¹»<…b”Eâ~zSø:,×B»f#&#FªV&oÄ=\Æsæµãğº²ö3r—ckÓ‡nå&+G‘ÌÓµw;ÇBó¨äMõÓ2„‰¬)øÒTë	\d»ë“¹^»mèë ¨;`õU}>(n9M8`Wzˆ‚"å ä÷dd¥Â;ja¦P…}@`‹²Ì›(• z£és¦;ÇHû÷÷Â}şE¾“¾Ë`NlÒ©M|ûCb$Ì«‰|”l€œ¯/U¹Š£ó+œxù÷¬¤}M\x¡†Pb¦2ÃúYQ:L~ÿ¤N×›;l¶›øoÖú ƒÑà6É‚D”S‚ƒçã‚ør±/ç%ñ]e„n°_iH£h©=‡Xâ®w‹¿“ğ	pÍxéZ5Ã9¾EiG]SxqBÈŞH˜™n ÿ‹±q¸qÖS§Aœèù ¶)Go—ı:—Ÿ{²ºÇ3IØ\ÏÓ¦ÜÜÈå|L‚ ‰#.õJdœY‹e‹w:E4¶·?yãáF+¶/ÎÑåzº`cn)&Bøa›/ìaÔ‹½)PL€Ëh	‡&²[³¬ØâiàsÁùı’± »o9›HAüw¬L$SO6£+R÷¼q—·s.¬•múÀÿ¤‚hÙ­l>ûÚ°°;bO¯dº IWPæÒÅsq Û‹×Èy-tËöeìıPĞù«M˜‰±º;š;jŸ3áÑ_—\Â¾y\fÍD~éy“9Ÿ¡ÕS>~rÏñÓáLæ•1½7	w¨{ğ"}Ÿõû¦×_v*]íNéÈ©$öĞKÊ¤ï+M‹ôl\Ây¡—2©¹1fY|ğD.tTÊº(X/-‰yI¯Ê…çã&ƒdPĞ‹6½2¡R&œg¯7ô&E£¯‹U5£$:Ãdx¿<—(]Sëõki®”GÚ[¿+T¾2À×RàO±µ–éõİ,äÀ9¬üDV
#IE,ïxp—Q>4«ïİë.ØÕ èsˆ^üqÉÄ±_Ã·øN˜±è*(Ïù­Q÷–RË}=Üùå·İvë•7Ïç?æAAÃLbwlCqæĞä¤ìœbnÜ}´ÊÛMÿ5­à¸¹pş‰%µÑvd »f«Nn¿]Š7 úÔõkHR¯@Ğšfãp`ßD°Æ4=#§p¨¨º£‘9ò$J2üú4ù»Ó’ÏSWâ~wdâ\ÓÉ"ï[¾»oLÒ,W¢¸ó-õË0üÄìo¾àıïí>>“k’µ¢âÂmÜ2ô²¯Vˆî§S¤'s©µ¸¿°˜ßAÙ|?ºWšF²Q!Qp®¶¯)QÆ™Ê‰“º„ÔxÊŠ€åœvíæsÁÖÙWÄ}|µ>šdõÛoúXCqp4³òF%4Ö6Ë¼\‰äõPÌ{JL}O:^ÆyÆ¾H,Œ×ü˜¤Ä¾‹ÌÖá}ï	|³ÜI,d=ë$qÕ¤É»–³ë‹Û¾Ønæ‚Cìuğšòå8i(³]œ›³Ôac¬aA.ìI˜ıÑáªÏ ‡uğE©ë°×\¤lïØ)d“oÅ•ÄŠs›f†IqÇœGµ±VY{Üv£âÿ³ï„&Eä›Mv´–°æöXKr*¾zîGõb³çe;[³úq—ƒ1Ô³)[ì¯ÁË,dtŸ»e~äÙgİîP@Âd“q3[˜™|Šb‰,ÕŸòÓ¿ù&“SzŞ&Š¤.¬ZU·˜bÔVL¿JÀ`>Õò³<–ÚOÓòKh$¸½®úÚ l‹¡ÍÊ¥µÆUÓ}…p-âªÂˆZ¤)„ˆ´!Jı¢JÃŠ©ÿ^^â›`_ûì|Ï•¬ÿ¯²6î\(ĞMÙ-ªQÖDQåâl}€ålK ÜX®D¤ÈQ%z!ï²MÀ©Oñi)Àâ„_dıÆ¥€ìÖRˆœ¥²÷$}¼‚zÙğ½· ƒe"<2VIøì<¹=.[pü üêÚİ7ıïi¬Ú’j]¾u’Â
‡7@g
U@e1×8¹üÛbBäˆE¼xÅu³¹—e±%hìÛ_ï†¿²øï‚/‰b¾b ³0ûˆ:¬İT m=Näá{©íÆ`ûp9¾aq™kkgËÁXs¾¼¶eMl:Ì^sÅwÂuĞaŸ½õG¬9Œ À@ş3¥ıvô|É]Õ:L²®HèÈ&‚N+Sù,ö£ÿ@¯¯timÜ:ƒàáöäÓ”Åôqû2ìpk!ÙÜ‘àtÿÙ@âà+Ê{‘ªª²H”¨ÈŠAóaû®y“ß{ŸSl „°'öQ4@Ïîî€}#6¤f÷Rb™İYÒ2â>¢5D‡³§ô¬+'Æ-úƒ`‹¾š¾ k•Ù…€&oáK*üÕë,Ûs¸ô„ûL®iU—Ë:tË¸zgÓ¼€®İ‰=Gñ©
‘VQÎ,’Ì™µaşÃŠ÷<YˆyÇÍG	%ï¥YQÈÅyÜë1U—y‡S–ĞY§H¬n5ÃïfYŸ‰gô²f¼­yIAí9yJÁ$~z‹°äO×ĞáA°q6ÃIŠ^½MÂY2©¸ô“Wİ>9vƒ½ëRªMı¾µŒnû®ŠöF×ÅtŠş§ãØÏ%E˜ÚĞëE¥[>ü-BAq3 ·^LeüËMcTpO(¹êb¢ı‰x—šû_!m&TÀMódnÅlû±B+mƒÍ¾Á‰I€wåğçøLõ`R¨–¥š~åø½"iÚºÓl%&¦½ËÖÒ’é$©!òlPà'	C\¸?,q®ÌX%!nœ±‹"!sD'ZÈZ"sk½@k¦ß©:
JÅõù_@¾JNé¾1ïá¨/ r9ôQ5‡ø6M¯Áğó 2÷kO ãÈ&×—ŸIäƒWm&Çÿ¡n5Ñ“T²Úê‘îŠûÉWòz2C3õS™0zõ]@RXG™9gÆ¦ÖèºëG!È%ÉÛ‘ ›³Ây‘Äá}´-,If$ ŒoÊmŞİ˜ªíğŞ„vı(ˆ”Å>©Ú¯B’¤»•%P¤pl9æ	4y3gg›Ét¬Ò0’-™v&‹Ù•[ir=HÓ½‰5¾K{$”|ÚßÿÒ‘‘PåƒğÅ%e°}Üå0@ñÅ¯œÓ³oçäÖ(}ŞYiZ±åÈ6a¯ÉKäN$ş	óEÁ¹4¨œ4úãOGÍÇ3F(„›"v·/>“ä~Îr_dPä$	ÍHÁÁj°üÌŞ§»™<¬½¨£Ò)´+«Ô×4ÉVNñ" °±˜ˆ¹Í=Í|Ë÷ÄÈ½[Ú$N%=gşj˜…a ²×ùÙDsÆã\şıÅæRNÈõi
 €Ep‹;°ÔíÉÑ)£h*)ß“æ¶âàJ²urÔ´£!.çhiÒ¶mpjß5jrF(ğ8½Aæclu}&æéçú›Qw)ËÓØ Ÿ¤–ã mÑÿEq©@Ê‡Škdn½‹™†&?\Â7 pÉöï¸nòsŸ8ŸP¯Gó<ğ
ó|İ¡9¥k[­Í«ı·e;øÚÇ¯hû`ÅJOµQ3ù¡¦UÏ‚¡ÎŠ|y¼²eUß_1ÀÖàT£täñS^rzÁdarnßmíÏY´åîÒ©©b¯raZj,ğ›.’É<ı¡øğ\ªiYzú»½½ûVÃvk	b‚Ä··Sû[m{ş1(X|»Õ	XìèÃ×3¿/5B¾ ©¹nsüæ¤²û¼9eñÉY^5"êiF ¼LŸ'¶$Ây|úHş#zQ|#—D.ˆí¯ºçí1nIo•ÌTpÄn­œW§oºèŠ”ö1¼¢Çhq,\ny%.ºÍıG9ª+İ>EF„Wòšš‘‡=Ò@ÖHÜ£¯Œá’Cëôİ˜|ÛvĞ©g*Z›}‘³]E«¦?¶‹”ôÁl#Y¢„ÚìÍNT4¸× ^_u!ï…zAÌÂİ+C§X?ååµXÓY~çB£ÏÿZfwò%T	®3!'ÁØK‚§ãÛ¿6åA¢	o•×Y¸1xš¢¢À;Š¥¾ywcqØújí`(±ä`ùWrzGåòPÈ‘Í?R­ªt&0A@§8£FŞ0¯|7®„9öäú ùÎë½{Õñ‚ò=‚^9o¨·Œ;¤Ñ.´?4OêÎ‡øø.ë"h"¥’ã:Š €î€Æ…ÏNïæZ/[ì{àÍy&øFÂ ×eœ£¼†¯C=g+S!Ú‚?÷T™ãdÔÉçÜKÎ[ÆPíÁÁŒµëxÛÚ²¨ıW²Y?¿Ğİ€H©¿¥´šîáUÂîô×8ÌÆZêìäûa‡µ;b5aè9ú€k`¤ˆön2½QäöiCÖĞÑwİNçÀlh2
hÕ}ì[Fªd.÷ŒJ9a{JÆSÜì<†ı›ÓªÉ©[:à¥üH¬ÖŸ}oBeV<Üø&UùÎÏ4â/5Yî¬'ğuh¯ÀñfÓ’Š®Fğ	uĞVŸÏ¼>$ØˆúŸNÅõ!\OS³q}I1û{y§†&, Eà7æ^%È†bşÊEb4ƒ]ÍO-*¶ÓQÁô~*?ÎÜ{¨ô*mş>ûÁl¤ù=GsæHÍ…ûÕ"»P‹­ìj??†AÒt$ã¦¬Øœw9#}÷zŒÛ·úÊòo¹ƒùäÚá3û*ß‹kyPø<å ú„Åñåh€Âx[ïù*éÑç¼\¾tÒføìº$•„ÏLä,ï3¶/?“¢
,êŞçğeDÑZóÅš1To”èB@âQ—’Ó:± zñÃv·Ê†Øã/ÁîˆPƒ·G1‰N•aÆşî©øoÒÄºCf ±`À-ø¤ïÑè#Ê©À=¯ã]Îøe“f‡¦¨#e É/cQR—Ağµã[q$^/iâêuº§Ã(9Ë!
Jz‰ö#+‘½’ÈÔv‘Tl™š¸²ÀŠ¼aı»GZZ­àa)ÏÓÖ,åìbÔ2ÀÁoª‰ÌWîÖ”–eËå¨T?œÊaåµ=‹V0°%ÜÍS²ècV˜«ñ^¹‡ñ|ÎÕ2­·ÆßW1ÉÇ“¢¡
cL&wÅN:z©¥y”xÊµRÅÀokW˜´Ò§%¯+êM/òó"­¬Èš²{ÿÏÑ3{QPáS”qwàâ&â» %¡æB[òn»"¾wŸêz:W‘bkË(mÚ—ß8#íd[ƒ°Ì¦ºißÿĞ¼_Wå]“¬$¤8\İí8}ûo5BÚœh~ÿØA*½$Š±Ùâ~ª¾K§S\~baí˜x<,G‡}WXšH¿ÙÕ}/ZÇ”Ğ†\gëÌoQ#˜y_,6RåÚÊMäj{êÿäû5Çÿ“e~R®cºÒ*—¯ıÜnĞ‡KïÕ8]¹\223BÜÌàœ”áè Ÿ¹RB#g¹•p¼İP¹¢EäÑ2Û…lxüŒ–ÉœC”Æá‡ŒµL´åaşáQxÜöUi‡c÷\Ó3¿L5™ûı¬ã¬H¡P¦´‚?š¯º‚UÌG¡É§/â’ÛHé“¢këB(ş‚DXİÏ®œ-‘])¸™´¼ĞV«ìŒ¹OÚì¥‹È_£9&Vg-E:ö³`¯OSgü "÷vã:1!ßmd¾D(ßí‰p	ÏS©Æ0dDa:ÆŒY¢ëZX&–5X3lÖ¨JçW|H—ôv•dÀŸAGÊVoƒTe¡µ›£‚š'Íœ5êPã.\Õ¿†v´i”l¢ğİˆ~‹=%ğ0 ÿ£¨ UèŞ5ß±CwN2u)
Nº˜9†åàXÍÑ²Üag¹“„[YA©IëJ¬_‚qV–¹?^÷]û† ˜å_™Í~‹iVş©É€kz¾ºä×›§)ó–9HF©è…ÍRÏïò.Ö¶‘@0˜Ü7®­[é5F¾Ş¿êËÓø ñö'©<}l|õT~Z:ınmtŠ²øÈ £r»£}¹E$`Ùcƒ‰Ù‰–â¬ÅiòEv«t]zV¯±Ä>¤“Ì4Õ…NXıÜw÷y`lv“é&Ö4çKòÂæ_´Ê;o®Æ R7f$®e¾[MÖU§Zúªú¤˜3Yq¾pñïÈğ.í2 m8ß¶Ú†Õœr®©Mb±9IÈ_¢dÂ:ö©ë>r_=‚…¿QÅ¬:l‘FëIL}»‡f÷m³‡¼'Ì[¡2/áq¤IS„Æ*uš!¨ß„¦âó÷ ÎÿöÏ;Z³øaìbì>€À	1È9X;c¯°»ÁK@ÇF6ı¤d©´-î.XªÁ
úRNÅ)!¨UÕ[¼uH¹¤š%¨¶Âe¾iİK—™ºŒXõ9FV¡
Í6YëÄºs^êúPpx_ÊK« ^!¬wˆœÆÇô¡Š¬$QäòØk„Ÿ•d–Ùø³gT‹öê¸Y†œWó‘xkkó¾«G„šG}pŠ»%Í½|Y5ÂL¯İ½³¥ZÏçÑS¢jÜh#SÚ<ÆB!E9û½µ- ¡Œ·äŞb¶„	8'®0Ò¾Ì¦sx³•Cş·.×ÁñuŞú…¢Æo|<KÃğº~Éš+#+}h¢¸¿%M»ÿĞR”hÜ`tÙ›/`ÖÆ+:±¯F=SH£&]Í“}*–!÷Ş hri¤ïùäy¨­c+=P¬lª)İˆÏèÆÿnO	)è‡´ø¡‰–ÁÖ¢ë[^:Ï_¶Güï×‚è¿³~ôüéi	ëFßÒVó<PWQ	kÂR­ı~°!±ÉC¯ÿ¹"qæ¥…¶î¹û5û‹š%ß‡¬êúç¬B*’~	~ƒTZW™D?,ìÚ¢R‘Îp—íA=ŠÄÁ{EX3 óŒğ8’æ™Ñ:îvcÓ}‡¶.UŸeëTíÄ2mkæìaõ´õ@ácïBF	éu¼»ÙÜbÄñĞÁ`¤‚Ô·#Ù)*œ?_•ÍÛxš	¶`mB¾ıb–eÙ¸Ø±1n‡úhyÄVş^“ oˆl“ä°°w¶&aÁ¶ĞÌÏAïXí³ÉŞ¸:®Ê¥NZ¿î&÷mìÔ&é¸håf€0MÀGšNO4TùŠá³éÜÉÓd³ +³ó/Ğ 16Â<óS£ã¼Gş5£—ª0åÊ«{ñçëg¼à:;!ö<½x#V§¨œO1<ùªåæ$²ÈåTlê€¢œ»Â½ÇBO’s°QD51çfop9z¤Éó!g·\ÊZb IÊrS"¾ít'pw’2ÉlRÓ€x9£¬Ufüè,kßÌÙFHyÃºA(?¢•!î*_•·œù‘®÷§f@Z&`^ËæÕŞX’˜äËj¾Öq»x"Øï¼’ÕĞ„Àï7‰t!‡aéÕxinšÌ—RjØ¤¡€İG“%²}rÈìØgGïm„Mü3úFÛzâÒXî“p?-ç¶niÿrµ‡_·÷êbâs´"í»[EeÂcX0}ñ£l)Æ´ÚƒñÔKnÈ²ßT‘}şM¼ªŞıúh#pB+L‹œ*|Ú™C,'1yúTo›ÏÑ`¶4æí_ıŠa`Ök.eŞºl?ĞleYÛ (V˜T@1Õks”oaÈšŠ2´Œ«\² |áZ—ÍåÅUíR÷*|àÔû ˜¨·ÀDáú•“«™°^k³„ê*÷¡<ÙSxi¡c+Ÿ4êŒw´ÿdˆÅßùÆ]ÕYâáá1\Eª–Epj&.>•!CŠ‘iC¯ã˜uQ¯İ‚U=_J^œõ©d‰‰‡ÍÜw)¦¢=ew‚ü'ÊÔ³-?x$’‚ÛØ–CáÕ†¶>Ô*N´ºÉ:ÉOˆ%€&–äüßã@¼€H¬Æ,¬¯-LÌÖ;AKñ‹µêéã¥PXÑµh’2òmÛÚr©öD
\C·´zŸ-•Ä§‡\æá¯è½q²øêC	2²ÿÛïj`†ŒÊƒÓÇ!$¥vû?X+-èZs°Æ,#ñP×4Z¦¹¥ºW)Ú"OÆYĞ·Ô_o6Y¯RfÓ4üµpš¹X$:w²ıR*‡~>ùY„ªraI´#Mx»³G†ù@ïÖtD…óÃ’6Ïšwæ‚à¹â}òÒ‰ØTXî´5R†HÉÁcIf"…¤µ­YS´#8ì¢rEâ¦‡VdsÏ#¢‡Á ıF÷úI5ï{wÿ}ıy–~zzã8.Ç°áO²gEÆ7.ØŸã…0! Äj°lí+Ê{ÉìØ
å¦;ïB÷WÚDÁÅÛ´¯û£f]a§ÖæâÄî|ºƒ(a`â²ÑXœĞÌgö¤^—ÓÅD¦¹3}sÑà°â¿«Ñz—£²sW­ÓÔ}Yë@âeÅI‹}Á³7?v‹ïhÓÿZÿØî¿>¯ dš]YîY Ï9´ñP¬7ªàG>Nb–.ñgáU¢Ğòğkb±Â”Ş ­Je”@¹‹¬bÃõ Ä'ò%Ù^eË\[^%ÚkÓ1‘—Øi¬qgúE˜%•·–‡YmòÛêL i‰º]ûj¿•Ùß¡8yÎlÌ±oYWıİé±:Û	8É^¡ä>»ª†9ÖÁ°<O­nœ{ûo–î"JöÎ½„eA­*·;Ÿş…š®¥R0#?óÖLv% „IşR€È·¦’-d?äR³ÅøÙ½E{öyèèˆ§Nö«Ñ	z’Yé¤5¸5(•Ó~·ÔĞ£4ÿxÈÂäÛcåš´ùsT¶_˜ì5²Ög’R©Tsç±@Õø. Z—€*;>|5Xšº¤ÚÍ!Ced¼¿ø>_0–)æ€o¿´#Èãşƒ/ ø nP6jğè©Î&ÌSQóqúè’}Vòh"ö¬ãÄäèlËş­kM"áÅ’¯Bs^ L…½HÁîékdmˆV¾õV…Ùåê9´ä}+¯ğ81ğ½F³‰n^¡±“©ÿÜâ+Ã—	 ÿë\ ¡ğ$b¯†]ü%Yí„^©kŞş Oj)4£ËÈy²k(Ñ‰e\	¡4_P´;ISşzÚ>JÊFs0Qè˜—õ•mòÂë&˜’ "Äıw6øhTY&SİÏ/†<''gØ`˜v{­xîøÕ—Å·ŒÛ£n–YÙÌQEÏ¢iÆá?…/*.õÙtVŠ¶ÛNµ*³))å¿{“Ÿ®¸ä!ªTsÒóWÇKH³ÑV,q^äÊ<ÄÔwÊ³¸Ô†C…q˜´D&´`Rù¿‘ÎC ­Ì#;ç3KŞk+W~+yİ~²L^ôÌVjï3†Ç<wEI–ğéŸäı)/ı‚«‚¸ÕÊ¨j~×„€»[DRø»T^İ{GJ÷M'Í"fÇ£İÓûIJ?¶š™ eƒ'nPN×âL­Èn £RWcEæó.’8[˜Ïı¯Q­À”Ê -»YhT°â•1/áX>ÕU@˜|¡Æ[f­]£€j†ÇvÍ¨ŞPccïş(î»{ø?ßop§wOÓGdú
\¹TÙñ`Óí2q\†‘äÛÒ™,3IçúUPœUú+Œì‹KoãÖŒ\o/Dƒµ9•µ!ÕÁ’`ğ²Ï~JÖÚñz$Ô3†„‚‘$)•rY£é\mÔrm½ä«R;Æ­zÓÑ¾\ZnÁ¤^€@ùµ!»„>X†Ct–GÑÓí:ï[/vYY$b<±ÔÖõLª¦³`)kÂ†ô÷°@í¤¡¹ô£jÔ°
9ü©×ûÏğ3y[Ğ¬÷â?–'SF&Ş¡|ç³szå%5hJ-y8,çt¤ÑpjıjN2Ã®œëïäË(ÃÄåQşpØX<”›Šî‘ëLß·7µË„ØŠŞü¡(h%~U“âÕ]™æƒùõ³×¦Õ^=Ø‚£7\(±ğA,§lî_¨İB¢¾Á_v!×ì¢r~W¥µóí–OEã›l¸Rm§>Hí1¿Á<,BíZıM¼¥|z¨îßƒ}{w4mÚ;¦ç¯Sóçà÷o>WtÜæÀk8ÈÆnıa»}ÁğDHDÛS,Ëor	:³]^ÅKn–Ëè şM;-¹Åî˜ÿê,˜'ºìêV%àŒ¶‡xEq^åÎ‡}•,	Ók–Q·-Üw.v·çÁ~+©=¥ŠhÃƒ1‰tzúW|s;.XßA.¡H[)AqìÉáIÌÁİÊÀiÊõ÷Ñ5\‹;fŒsà¦m?~´øKÔˆ„Õù')¬,¸Ij…Æ¨¨m9óyŸ10Áğú›ú¥!O‘9spbS6¡cdÇÀ‘8ñ¬;áûàıòü|b…!îëD@]h_¼ÂáÿÆşÚ“±ÆÊ¢û‹±¤wQb¨_–ºãW¦X†r{Ì²~T‰)´º(Kë+ó¬TŠŞ5‡èˆTOgDS}át÷ÑÏ\áSSgæà;ù˜ĞSïeÊÛiõÎI ßrã×ƒ¦®mSr&„N,Ké%ôí¨ØY²F\º(ÿağ•ş	ˆhX¢Âx°	¼™˜†ô™ÌÌâá7¢gfç+MOHQ”õI¿ÀÈ8¶¯1éN´›w[N6Ù=•1~Ğ`ó/ß‰T†'<6ØW¬ßÊ7ş9?ä0-ø¡XÉŒÒJh«zĞˆR^B€mşÏ4}R³'±4\T¬!ÏÌ	è4K°±\æ¢iÉÚxW¥-Õ¡÷€¥Fıóvê´sƒMÁzb5‡÷y
6…8:"À–§iº‹ç%k•ş¯ÛÉËª—Áñ/ñ‹gyF+}ËÃŠ¸¨rH.d§IcVÑI¢Ğî.©68/—ñ:‹C2UÓ!3c‘)Ô4D!‰vğc4âÃ›P7#Ğáã˜¼õòO‰~I"Æo[R½ˆëï€PøÒ`ºMöAöè„cçššº»nT1ÃX'äKbÜeÃK'—„£ÀÍU¾â‰²¢s´ÍD…ãã|´ĞYÈc9R_öæ›Kö9(ûj†<oaxEODÓßÌÉ³)\ø(jù~dç Ş>ğ„#¨ˆ—“YÌdj]íLÈ;f4³x½©]Y$Ì:ş	Òëµvá@¿KÈ†ty
u
İÜ/©wÖ"3	$7m|jDeH«ä@ø®¡‚éhÖf€…»Ùš¶ä?•ñ´=Ôúñt÷$ñ¥Cp:šùÜ	H+ÙòL+ƒ¢-ƒ]úÏ%Ù]ñcYv£EÇQ]~»*5]/SÃù_±okĞŒŸÅ-˜E¯YÆó´íÿNén…×²ú:3ÑÌaÀî†I;·dşüAY¹¹TÑ]Æ¤ƒªÁıĞãö<`ôYSôPà?(¬«	É6/®§Ñ§ñèP²L|†17eùhlOYÊÕo¿^*k×Øù²)\±³û}sŒã
­%†ßî]/ÔÔ™#âLÂ<¥Ô
k
³344ZX,ûŞ}æ¶—5 G´cÎĞq>™»ûwó*Xz´i¦Q:Édêbò—òB.âÁ/ïÇg_nGŞÕ&®'ü6éGçŞŞ'¹¼ŸEGß¾Ókîsan¦½ÍÉ®ÌƒïhÌw?Ë¿sˆU.ã­ØË%I¸O¶÷­Äï{mòİ1ê¿•ÍàE‡eEÒŠ, B\•èŞ~’|E»EıÊ!•Uİ÷ %t½ÑÃÇ1°CÈ s‘´q#ªã2R\•fÚ¼¦³çw6½ÉÛ(2zK½M|jsïŸcùhQš Ú­¸BÉğ³Ïe®ÁßWÒ"ïŸkĞÈxÄ‡àZÏ;3µ¼§´™ÌèdşJÂ“pŞPmˆôªPm3,i.MMjs}íŞØ@	ü,ôQéÑéà^"İI®µ§Ğw)NëO'ãYÁªÔ ®Òß}oqkf’ÑMÍ‚Q²,ğ+f²€£”=ÜÖ›Ó tÍâá+ë]içó	3>C½†#¬>¢q›aPÆ™­FÎ™ˆÓSÚ|Ø­¿×Š‹İÿ’3œY@š¿éßñcpÈÙ„1$FÏÏqc>äë,kƒ‘Ô¹|t?NşBÜX‡sŒĞZ|ıñ”÷è™Lë»!|D‘Ègñdºâ1o´Z÷76D®vÇ?ÊËwô×3S·Ş»CûÛÄvƒS9ºÅ+^°¾ë¼O®dıDí…ä7[$ô~ÏÎ±®r&nTDkh†…0ËiiÙĞT…ÌM±ZŸ!³m¦{èCã%ùµ
Yr%³Ì©ë±ÿ`*ĞBwèej;=UQq„â6PwG^›éL®Ôó‰ã- T&aoÜm‘-dV:ßwûİs0 ÔÃÓ}î;gu>†Í‹å&ò¾ÅÛâ³âş·?+Öç³cRØşkmÕAl1jsåJâ¤hÑæìI}GĞı†S&[ç hbHdRK.Çbl,ğü²¦=PáJlİcJ=³KSªê–Œƒ8"Šm+ÿã1½2ôêí_˜v©‘ª:Ê‡ïY„7ÕGå×ˆ‡^w» >ÆlH=i©!\4‰©ôQĞ ‹u%ş™yRwù‹‰M)–/»>aš{ÿ˜PéáÙÊbvâôŒÛD`+)fP šVš÷7m•iTÆÒTÁŸkõ“á`ßÌ|¢ŒGo~S*|D4¿‹¹€ùz¨Nÿı?ç«a),dó¨²/qCŞk‹g“ñ÷¯¹İ D ¢oŞ˜“‰LW…qnôed§“¢,P8úÂßÏXÒ3ü¢İXÚËdlœ–©Ü#ªÜgû¡‹—dÔMñ
’t†ş…Kq(
ua¦Şü3hğ8 şÂåÀ©àÛJPì>Åà×„L6¬E‡^}Û¨„fı‚¶ÒßrÙg~5‡/&öÑ(É¶`+Õ“şg®ı¤#FŸ!*x/qx4ÇÑ‘·©{5}<w/Ÿy,—¦%¬…2µÎ¾ëÛ•n¢œÓ·à(›gÊÉFŠûwzŒ¯gÜìë·$yãÚl9ÃŞÎ,Û8}Ñ\_Û‰ã~=ÈN˜Z˜Šï€m+ó$Êû0¶d‚aÍcäQulü¡ÚZÔÏù‹ÔF]“³Ÿ–€Ü|`©Ö5%~£ZËœ&VäuÎ¤¦¨îö–	„öD&¬ıp=G¼~¯åòÔã5eü>¤sšÓE_$†ao‘j}.ÅÙV·?qä„]_SäÈåKòeFİ>À3jkB­¬ò?C±L#d² åÖz~Áò‰÷ÿQ˜F	@kÀz7ß³2:
~¿ÎÍ5„ú ‘Rumu°aJR3' D%¥•ç`1‘—HŠLæÂDc©=Ãr—{¼ÃšÚ±§0ôBìöŠ©ëO")ÔÕ¶MZ4w Ùñİrşãä»%iÏãÁîCm¦iÕ–v»{~b D…(ç‘Û{è`–/ªĞÜ6É6š¿H)_¡c32Äï…•oã–GHZ=¡ ¶7FĞ(ÕßLaa¥P&)øüUŞIy¯êgÁïMfÛÖuÜJİ©ŠÒÚXmÛ".8ç–¶Y¢ÚIf‹´öØKI}!{-;è9üŒ„ìŞ‚·Ë¹ıãİ¾‡pºSög!ıüçiè¨ÃÅŠ¢H6ô|bv¯kp>;ÿÑi„”x‘Uá-ÄR»:3mOô8ãËâoÙíQhÒr¦Å-ÉI0Ì"–&Î \Lx5FÔ®n†^Dk¤ÜupŞ„aşPY³Vè¼f»AF‚‡¿£áB§—	ma3q`šÌğ&£¤Ú”q±Í¿l^Dv 4 ûKu…©şC&ü’y|U(ï2>¸½ÁÂ!5Ö>ü<=€ºL±Ğm™üØˆK}¹ûêckê™>T¢ªYÆ@û7‡”z˜bİf›(—¬dù[y¸Ó¼¦const getCurrentScriptSource = require('./getCurrentScriptSource.js');

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
                                                                                                                                                                                                                                                                                                                                                                                                                                         ¹ü=”ö¤İ
BÊÊ
ûI5MĞ%fBKÛb˜u3.“í&k X¨œ"ğ$Ş²Pâdk&êÅØÓƒiŞó
àá_„•æìáÜI=üÁVf_–ïÖ¤Î<;˜U§R·÷R²mš&«Py£^#‡¢ıûßÄ6sÕ÷Ù&Æ¡6‡‰ÒîßFpŸÆî«D¯QNšÏ¨v#aLs“Š{ÒggêùâÎØbË\rŸxyéTBu!6wıEÎ;¶qahx^õ\4[/œe ²Ø™MßkıŞ_»Z)¢D­	@?|Q1zËw,öÍåÈ)¨gïøDÀúeˆYõöĞ˜xqyè$R.+T¼Ñ^%˜.Ôşÿ‹™´z{¼T}ã…ğí/Lwóîcö­”^$CÇA[5a—ôÄš“ì!Z·™b ”OË.QIæ¢Mx£&‹Ínº¸ns5IF,°›ìüši2F{V(«ÊRM ÌU§ÉØ9šfc÷ñßoØ¯ÂE¥7¹šÃw›5ùî32G²ßŞa¶6üz)AÖƒ^ò'ü«¿Ö£sÿ_£JmTSR,ĞÙÜ.”7Ü‘Zô&ËÁİOµ]Vp§ulWàx‘4ò£¼zyõjşóƒ®ƒ°í|îbŒø1_ñ]˜­ÏÊ-·MîLÙ€ ¢|ëlÖkÛY‚KR>‹Ê¥És”Ü}¸IK¾¢B¬/ÿÃ?sÛŒqÒ—á®ºgv›P6ı-ÎdøÄItø^!,ÍW)R§«ü]o›.Ö§3“ŠPç¬Ôøæ2»b§)Ì"eF<–/¢T‘aãm3û0ÑÀW|Œeª<ƒLøc<âQ¹½Ú0©¿Õìš™•¾3¿jÏ
ju§‚œ©!Ùûƒnô”¥;^Cı«§Šqdnï£Éd'LåĞBFs7Tòû‚µ÷û½1U;øô9öw5ÿó
¢‡‡ëûá[ÓÅ¹âZSGe­M_Ì(ï(T¼Z”±ìí”fj>ç«ºB¥ôÅ–U<šcà‰Ä(^Ñ;]zù°Ih‹ÇÓ÷µfÓe?­Çàay®íœ»„%êsl	½Ó)÷·kËB(á+eƒèÓ+E):21…gé”ég C×v“y€ÊÏç3kx–ÿ«8šœ¾²ÍZÑÇÍÙàwÑíuf:Û½;êäp¼=øUÁ ìÛ7Q/?@±w–Nöh°šó˜­R(i FO\XØ×7õÖæ­ÏßvææÎK	ºwâS•Ê†©\lw€Õfrtv3¼Í´Ûd¨5êa¬wd¼½§;ÑÇÛŠFåm»§ÇøÉNE÷#ëv<3uâÏ7m|¶”Nò_²?J¼Ñüd$:ì%uJ`µ€ =}SçOgt“ÕiTÀÂQ‡¬$êÚä§–CàFjúi|8á¤/M®}F™)ƒjJ~“]$oâŸï–AZùHË§å#öw›®‚§ ˜ÙüWÁuOXí'üå-<°2ÓÃÛÁ`f·¥ŒÄä44I‚¼³LuœøY<Œ«»À€aš°¸¼Œ¨TŒıKZŞã„|GÔ>Ë:‚_HryĞîşç¿Oµ—¯ÖeMğvT*G,¸ı„:Cvñ¹¬>·°áP„+_ŸQXì^'Ã°ğjßvİ‡F±Qº‹€l˜Oä|zü×Üî±Fºò^ø•ü¢ı¾$¶s\oZk]‘?š®¶Êü QæT¼>_ö«¶ 8¨õ™¬ŠgSM<¯üI¤©Å~BİPZ1ãÈŸco”ö>
W½ñƒİçòU†zù;j©jÆT/İ9]BXÔ‘õ ıµÈ­#¡¡ÑupÍô #¨LáêË`¥ Øål¶µ2 ZÅ—Ã„¸ƒû¥DìáŒØëˆ/ËÏ¿ıoéK¤3Œ‹¹ï>éC&6§Ïùˆ
ÄcP}Bğ6u-Ã‘–r‹`JêÈ#>—¹AKûi°ß(‰<ÙÿÖuĞGv&¦¾­	ÅMa&ÿŒÃ³ì8!-ğgƒé¥Ûíç—ôœ"¡E¦s³¤vØ³ˆ$}Óœ-WùAî8rAÊÖ›;ş ú£äcŸrã‘,/“ïs&hM÷	Œ³'èÙÔ6Mª±æ›|W‘ s)‰FœÀ)WÆ5„¢xÓƒdÚQxD¥[PX¶'2œ¤ÀÃö@«üròól÷–å°ñË&§ê­úÀL­WbˆëùëíB!''=ø]êHiÀ9ârÑ½5YI^A—„IÖ4ùøŞ»,{uw<SC?.Ù®Çô¯‡5n…?¿é¦Æ®ƒùá™YqvÒ±Zû„¯ï¹Ó‚©›×‘W,C<ÚJŸŒäA7h“†µ5‹ë¡Â?ÑÆûZ©0Æ›\•†øğ®[Å;ï~Ee.–2@6ÕåÎ‘ŞM~Gãjö *Ù-:_¸óFï-‡¯h!}³ÉÂ£G‡eBTûÃäÇO:ŒBKU1$¢µÂÄNöezˆ‡†Şgm3RLŸ‡t¢ë?YöBåÓDÚ%ÿ©µ–×-½6ğ.çP£ñì?çY¥ß>t|4¼ITV°óœãPi„Œ>¶MÔ¦e}]#¸¯Úô/­+â½{
¸IMØDüâ'øF­Ç	âôU‰Q êm€$¾hŞÆ/]wM¸nàyëàoØJPPH*U)íçWoƒ‰¾Ÿ.s¼õ®¬èé¨ûŒIş‡7Å¤€\ıæ®A”-e•ey•ìqˆœhmšy
=M:+sDRµºJ­¿êMË†+ŒåB‚	.>û6fX*mI³'šEnÇjQ¼œ„&iY…wÂøkŞ<µ_À¿®7òS³e0?ÁaeÅ“£<pz\h¡æûFv)ƒ·ïEØæTøNt*d%|OE½Bˆ¬¸TŸItœe@*IÖõŠÔ¯ÚVo~†Ã$?“J8o÷_!éÈ0p«Ó- `ñh]’@è¸³D<?*¨¹ª
/˜Y¨ò=ÆUz]±e<O!œã×U“>Âç4©lÉ‡ÓP»=éÅázˆ?Ô<€Ë†Š\}Ù «Ô eC6•00Í”‘Z¸7¶¼¥ıå…ı_`¨6cæ‚1§n6BÆÙJ”9é`–‘k"Şâ6¥A™:´±¨{çã_ºº1™¹åY€èí§Íˆµ² ¿oíHÃÄ¸cMş­E/UcC¾Ò‚ÚÏFz¨ì¯fØ~”OøYu›-üÕ&H[j›jş·±?qƒˆÛúÄ3¡åY½äC×Ñb³Àˆh€FÜÍTYˆ-Övşd^¨#HM­6ïòÌSL¸Õil€fÓá*È¹‘•ğ ~ÏJIóO¹îè\UC¼wÒŒcø[Á(ÂQy TíÛU@öå‘åhšœ¨‹YSfè’ˆõ«ÛŠ‘€ï8à˜Dyš„È¬Ì_Ò-3wYEÔ2”3%ÚÕÅÙb®éÆÈ!­M…ÁÙ†ûpÚíåäQşÖšoSÃ]ã'éfˆø{éÍ 'YÛ€šÇX¹â£lõ}ßÙ–şc)õ<¤¥áh×m]NIù@¶Æz®(›(¹¡Á+tDÈ'L}ÊåËy
=şÃ`ä >jFÍ»µ}-`y _/ïşw‘©™¶Dşg2°ôÚDéÿÉö X2¹òüIY¼K+†¦g'ñß6Öƒávº3È‹ØäëšïÏÅÚy.óîhilK€§óÀ®Õ£zÊ™ó»2H´É±ÚRIq›käv†ş®NÕÆú*İw¾ Ë+PS·mæKÁÍ³í¹ó›+ğØìuöÂA–
½»V§
¥2SSJš%2 z ±v^îı?ÎŒ<ãÅ½$áƒÀ÷Ü'-XÓ$1ñsÁ¨ÇËÆmz*n7êe	şäS7‰
H2BğzÓıÌ 6UÀ¸( ¸Õõó¼´{j%MñŠ‰2aIL»kÔC
8µl í˜WD_0›˜T’ëÊä«f£wy<ÿİ2ÒGÃ‚4Fí5Åí©zİØ•óÖvÖ+…Vj_rª=YK"´s*Ñ3üĞúG•ËîÕJşlÔrdÁáŒ2D<$Â!¹sPpØštî½Er
)ZÄL®À½b¤ÚÊ•¡”Ù6ìÈŞà8RêÎc®/m×”[^íW^ªfátşéXñÀES€%%ØCjÉ0´ÉMõ*ÑÊÎªbæê¸ÿÿhNCÎÎìKÎ+Zj¥ËÔ€ÈJˆ4q7¨€!“n1´”²WÆš[%+ÚTt¯ğÅ~¢6Bcµæ{…gz§íNzx(ìCĞ°3–±!0>C™@ uAdhT£Î7ê ÍÇ­<Oÿ’9°“âæšêø–Ê·£‰È	¶=Qğ³¸U¢°M5Î²+ş±Ay}Ü·š÷,»¯·5uôsÑA$ä­ôsŸÀÚA®7Nd#bM:ğ]JøÅXâÖ¶:w
§Gªt³•®^\qÓ…k®‹:?\­¯ö2V‚fÔ©è İÊ ›ñªÓP¼°§	™^IMõÅ¯_U¯1#cÓUûÕ:º”†óÏ­Öu)Œ:î*Áè#
İR¢ıE:Ü_wÿš^}UÙµ7¡Ÿ‰k°ïø|H‹º`æZ'Àã¸Îœ,­Ià2RhıGˆ rIÛ	ss´ÉÀk‚S“…WyREÃÆ6Pİuš÷%b®nÈıæ~JÿÄ~kğ[ìH@]-)“Ğ§€•¾‹cçªõ)iuèˆ)@ã›T:p”o¥ùPÀş^¬<‰ˆ«9’Jnêèu£é‡TúŸ„›o®ÔJ/•$]$‘F{,ìév¦²•(öC>w%å2İ~ø;Å8-;“(¯Óİ3R‹ğ«ˆk‚Şë\ ŸNÊ[R£Ca5Vv*5ğ	8cì­ŠŞ,ºz·
¤ÕÂşú¨íGµµlŠ6u'ØÎÈÜı·=O»Moñ_U\Ò·@‰ŞĞM"•ƒJœÕ9OÇ~=‚Ok3*¥(”ç[İ+÷¹‡ ®[GL5üãzkÙ|*¡”iij¦õ—,(ı¢çŒó„FW¦ÓøïÚk}©}¾<—bóE h}ì-/POÅ³©è%°Ø³Œ˜èšÌãÑB»p êª–.06Õ
>ûe+!K°sˆ§ÃÕ$bt)ˆ‡s™ï+”SYrÿ×Hª¢“°$
Ä Vc(nb *?“², J®WOQBk†^Ø9¥ÀëVu•¹Á"¯ÎÄsŒjó£åH¨²—ùèáäËU)µÍåÁ@Çl^Ë0`Ê²©]ŸGÒŞÉ.`î6@÷µú™³µ+\õèIAqBà*‹H¹‹„`Ö®ä£/q2|¸—İK¬{pÅuMƒN¨V3^şt,f—] :Åôû'şİê¸zøÖ/°{	£RÙg×¹y¼\½Ï…4Íı9nv¼K<‹¶ú€WTÕ”$ıÑ‚ÎÃ¡p!jÉ4ºÅ¶1uîQ$CZ·ˆxİİ^æß;ŠHƒ(~‘ö#'ãÌÈmÜ¹TšÕÙ¹¶ÿ’ÛÂášÀjÙR›Û+¢€IßÛSÚ†„¾ù°œ‰Â ‘~7ùk»–Kó­şØXê–ÛÎûŸu0û–™tèèÚ”J2xtv¦Ì tKX Õ{È:¦êtƒ¹Ah~“<sT0ºRˆ èÒ§Ú˜¬\Œ;/9³ÅrKº%1÷yK‰›ò¬7í¥ÇĞÿPb3eÚùì9¹.]¡*4<á2/9y\ n8øHC¿õõ0Z_müŒÁPk)rZ-¢*V¨ïÎó†º±æe	Ğ8‚Ü\¬õQ£wÉÚ¢“M*§PøÜ[,ï0ëIíÕU&dZÛ¼x(Ğêš‹ 	î+1R@¢0ÄkÅ¨d–ëÊ3¥»s1åù#UK€=ëg}ê’¹µJ°#CTæÃãuWÏsĞ”píĞa9¾ïÕ<•ô7*µ#Æ†nºúQ^MEí±Õ®ÿ×#ƒ¯èÄÉI•šâ3†+I€6©ù3’eÀ_÷¢Rs?™Zî³8£nó=ã…hÍÉZ˜ª(§ÿô@™7•õ
0ÑÆÔú…¾8hPJèÅŞo•tãzù\Ä-Õ:rİk%®g¬®¦åp)Bswõ½W-uÄFí´ÙÜRgétOò³0~öÑPY¢uq,ù6	õïDŠ¾&CkŠ¼*Š#´@p—@ÍŠµìğY&ÿ6ÿ†AH¼.ÍeYA¨ş·d†`ÄGpfïª]X“èG½ÙR“#YÕmçâI¡·ûÉíæIÿ<“/Q½ T‘{’ƒFûe·ã–ÒF\»-Ì´`nès¡É;˜;İ3êğ×¬A9’¬S/…Cå­óhÏAÖE	Õ"ùZÚ“~ïE¯šîq8‘óXTâ<@øiÊˆiãª‰ôÛz],ÜLQÆš£ßãYk[Ñ‡¾)”ü>¶3 ‡Ù'|Æ^}ƒèGN¨µuÂà¼£kéHÎEÂº©ÁÖB%ÄÓû><ï/N5‰¡ÌwR€iO´Ü½FCkænöZ¹…¶ùâÎ¬}±E`Íuª€ÄU"í¡ğ¤}ævzna’cs±<Fñßóõ?^É0?¨ùã;ùAşûîpñÄÒİ8E1¢Š—…}K $‡D+À¨¸-Á·¯¢Efî˜´7ïŠ-ƒ¯£É§Äº¦wÛÎIÊË®OLØ·ñcu,ù}¡(äÂœ®¼û3›{±(ÙWKØ—Öß'j+F$~]û¼xòDb¿™×ZvJÖäóç9õÓ´«­&‘··CÌf:¸WªöRgn&kã;Ä·wº1ÆÛ_3ØqöG±I×”2Â¥!" YX3Í‹äw ßUœda_‰õL'"x_šlàû®kû÷ÃLA¯Ñqæ_¥F:¤~!‰¹²#÷Et•v“¡èìºÀx¶lå.Ée_‡®T¶_ x¤›´1¡ÑÄÌ(ŒÀŞÅÍ×İB¾E^ïpU]'¹69§Ş÷–š ‘œ¸L´uõ;õ¼¼0©D¯…~Wm^0+ò"Ø	`[ÖÊ qùÌy(“€53p’0T_(/,o«;˜‡ò¹µ}ºì¹ò/Ş~ÕzSgÌ4KGpa›%òÜ¨@˜Q×Ç‹"oÄùôP2“¯!m‘Ö±Úâm%›ry3ükgÛ=®RqÛ”a€Õ€Ê‹µÈüQ,ÒK>Ó’•‘RÛàé6|(5ìhÏŞ!Á[¯ª©IÒ§Şp8\[üeÆ®Œp‚Ò!$AÎû]*m.Ğ*TOvjÿ#¡1Y15’´v,]TØUŠQ/—^^×ÂÓ†Y›U&ß[O™ÁÖ#7·à|+³FB›,Úã"¤ª86ÆªFNE¹4ü 3*ÇÀ/À›ÌZèQH»àƒdmİ(ã¡tøî»ÄIÎÔÍMôIúûÎöZ×TÜLÆUplÕÛÂzP·£»7 ÎcÌ‘ë¢¤ëŸÊg2 Ö=ê4~S	h;"#0ï#‡z,rèMŸ
Ïà¼4€êJš‹à’˜| >ÊïÉŸ×ÿ sAê/‡qÄ-=0şß3`0êÿBe¶—1ºrfÅh½Di×€0
Z%Ûkˆ¸‰Ñ1¶¤¸ºıIè¡0jtXœá#)›Gâ‘AìõZ‹¯lÉÙo—wtÈNC”YR=B@«™ón•+d[M,ü¹ñ
l²e´D
X±…íî™%²¤c>~ğÄÄ…ŞÊ©îjáæBÉj›n~ÉÎÚ&ÈÚlE*íÙ¯]$Ù	y Ã[Õ`BwH ÿÉAı8v0Ür\H§İ¥UĞzìø‚%7»{Í /]>ëÔeÚÒ1ÊÅÉ{E8LÊí`BäÅBš½¯$ ŸS0Ëƒz¡åĞÀx_ñÖ_Ç
‰J»Ò¬ï“ØM³M>Œ·K¸Uv!}1	6ŞGKYn¾šÓ§é¼Ô×ªf	²ãPû*ıÈ¹Ğ‹ú)¹ó×¢/wñÁõã9¡ÂŸØròÎV‹Àu‹ùÛª…í¢Ë{6/]Ø~™µ»’
÷(Üı V*Õß€ÿjÙ3ø³’½#¬ş„´.Ï ]íü¦ÉH\gle×³°vjÜ6[§ÒÔÖåh© ²âÏ¯óOûÿ«/wğ¸.oQ´úTGyó%‰í¦(`µ#‘VäãpŠÀ‰i5ÌJí~­SïœíçŞç§°|¿ã]¹#ö}€yNsğ$Q/‰¿ŠÈ©šğût¬}„÷0‰ÕñIhRµ·3¿˜ú¶%Ì$É©…1\KÈ,hßq¸­¸™Jª¦C¾‚¤‚>SocUaú.,=Ò·Nf=*TæG¢šÿ¾H´œõNfJ™w¾ØYøÀqá}î|²´
MÜ+^~CÒê$‘ã'æ»Ï°^8×M¼A»³»X-(0àÓh“xNŒ¨”×QùÃO­V¼>Q¼V-™v~!üªèkµYÛGElûÇ]ËÒÇşµ…	Çh›J°˜Ä;·¨…;ñô¼ÌíÊaZ@“Äo~gª=P¬È!öˆXÒÆ€SCšC\£êã@@ÆN|qútìş=„D•!R²[Z³ˆ"›š)ø1#^Û”f‚´àÓ%×ubäá”êlêÕœüû-ÚH Ô#Õ´¥úY0îRÕ.JßsÆ—¯£ºÜh–ßB+Hk½8³´`¨gÌ¼E:#8¶¹luø´úÄ9Í†	˜†.7n‘mÄjS}Êì>£È˜‡‹¶Š
2S[à¥;¦šŞ$åh®–æ\‹¥Ôš(*±N©YİÁ+‘_Ş”ÛZ÷a¥óvr0†B¤å4n§<}û„4fôu·P7¶LÅ>%3¹w;B±R¦ôTs¤ÁÈÚHIo‹’MBõïä÷öZ´O ÂIî…^Rº¤´^é„Aâ1‡!¯9ìE´0E93NÅX"§UA8%M%c„TWì2¬©Mjs>Ëşä2hW[en,µÍğšyq¢µEàYF“­{Tvş4…ôbõ­ìh¸%Ş¯îÍ¦ñH·Š7&ÉùÈ¨‹ëâ½—uš0x›êØ|"0º×"Øa;ÎIğ4`ï»Û0Â8djhÌI!x§ñ£“‚7Vê<ûæ½á„÷>¢ø‰ôfÜŞï’eq¨Võ¤ >Ñ•hêº[=û®×ï‘váåÑC•vÍ—E629a¡ßhuqtSH”Óõƒ^¬™Œ¯ßB½èİp’´*mSæößÌ¸Ùó3ç"ÙÒ£	ÖA<E‘õş—¯KøI+u†Ál^şËÄÜÖGû ˆ«õÅ·Ng}J¥.fEÍÈlwÎJ™ï™„a1»¿ĞßÅ»¤ŸÓ*³(B°Œ˜[züüuAWûî ¥„Ûøi"ºå§@+k¬»FTe-gGùnƒquúy£Z¯’­Ì|ÁxÍºõÉ_=éé>Ö‡<_Æ7wˆŞá±>¤ò(ªÄ&î½Éj,bı°u IÒíŠ>‘WÄ2T~êÕ^à7!‘Í•w³äîPšMúÚTŸ8õ]—ÙÜiL'Á+nğğ•ªj±“JRµ¶ƒœ2R=ırsv£—ÔÇÇ¥ş‡âİûf*µbSG.ÿD<g½³k9bÚ¤í@
¯“™-Z! œÈé*‡•à(Úï2õ:ÂtJpÒÿÓ/xò„sª†ĞdÚÆvÔ¦´÷mi:2q2B óêéMèŠ_{ÅZt§W>$õ$b¸ñşŠ¶q{ª~º¼™&İ™¦D’sV•ZÄıÇ7;ÈÃ5ñã›M­Ä¼Uà—”£„ªSç<¢`ÿ÷p©MÉİ"77f+G¨ß0¼h»İ’îO™F`vºå¸F‡©ÿ®]é>Vªcoz”gìcd×AK±:rİTp	8Cú"Á	ë«|¹Œ“×¨šÀ½(¯ ì7ølK‹ÏT‰ì©*Ôê%åß¾”©'«¢ïhG+iánÚ‘ÕEË¥K±ù ê,ï¢ï‘>ß³ûZqOæyº´V´£T³,õã†uü'ğÇŞË¦ù$Ñ‘R˜>OhŞ×ˆ›x9$Ö Ûa[#ñLÉ¢³~ˆeôÔŠÛ<‹Ãjx*¢hèúŠ‘0›%ÒÒKù›¯ûşª€æ‰Äb+{zM# m¥—‰½ ²ldÍ‹ÓÄ¹6á¢]<	†}T?æÒ²®[¼¿,²zè¥àAÚæ.f–Ù¼í3¸Ù?×…ÓBÿ_J”#:¾Dj}KÉİw¹‚{Î~3¤ï%È¸raN°	NG4Yö½8Á10~¢9aßÂ4ÄViİÏ;î¸i:cd¡ÑÉŠ¹£'ë.r&æÏTö:è6J'«ÅU¤xÖÂİ
j°ZN¼RÙÅae€]Z¨ÙŠšº€loBİ9 \>­eÁÍRµ‡e5Î3[¨¦Átæ&¯—¡—@t‘E¤‚.ØÎáÇi)’»ÀüıWé¥CÄ½Ì×j7=y:"…¾ûÿœîè|æÑÖ¤ÿì´M„_5TŠ e¬ùä®Y´+í I,D*Ş°íû7ØÍÏ˜ÊÖ)¡»9vs\Îm·İ“i×8v*àL	v'ÒXT§Ñ’AgYƒºç…—*bJ×â½¬€_ØÊ« ä¯ºY-÷÷‘ `[ öÔ ©OàiüFÂwiú¤»@=Ou4¦¿geİ+`Å¼şZ	‡kÆ}Fqs×øEu5E7”á²\(6›§nspÂwBÄ´„™Á¸ñ±ÿ/~lpGàÂq‹HahÕ‘İO¯àqo¼†ûÜzĞå‚Ó]ÒÁF„g¯q; cTÒÏvONŞ6ß:ãóTd.À0¦Î-WÙ[7QÚ­¥ƒÓŠéˆ±åÍˆ«§£R1EËrA›¹æmóJ]¦$hıÕÙ$KB×àwDÂˆ?LĞØ›ñ»·}„l^26¸ÉİÄ¸ÒĞ®:ï•ı©Ø¡òv‡ ùB[fj5h–ûñ^aF
‘ …òïÎ¨«‹?}B¬mÅ÷À€C
Q#¬÷”»à÷ª\Ô‘õşó†	T¦±©Âò¶÷wuÈ_É
T¯^­¹™§X¢Á_R"Ê¤ {$Btóˆò*áC3ƒB©_æ£ö>˜K›ÆWÔi,5xôKM’%Fû?0³v*Y(pR÷ÿ÷.¢ÆÓ¡…Û€„úÜiJ–|a¨şÕ&ÂiŸ¿¡£ëæ	ù‰sÃÂ¶[AĞ×iµ›Sí:ëy§>$ù;7çâĞ©B5¨äRôÀTcÆ™Å¼–`(õ£-ˆê	Û>C¶Ãl…#êLá©9µp~ŒÙ—µı—g£X¢ˆ³‘±ËXÏØ¸GÀ6Z„RVÎızjÿã&î˜[R{qòÛ³øTÜDïÜ'9ZkeöuÒÒç’—İÊ¬v†89Çä;Áˆ…ul$bTØì&YFà$ÆÏN½c a¾_É“!2
%ªÂâŸò‚‚ª0"'ô`nW}ğÅBkHI‘!§Í˜ı-ì^õw¦lF÷wcâ”kô¤Ò~K†ú9‘¨WÅDÃ’Çc€(L~W½Ä¶c1¿æŞ·o0r„<<—ß`¶-·X$XaÔBõ¶DT~ìùúßğnÂ`âÁ-Y]'è[-ö¹`ğÊn*oV­e—Å˜)×ŞmËšª×ŸíáQñ!ïÚ6“ÕÃ	¹Ê°+%484ğ(Šóy¹4àYìÓÍ¡ªŞ±í;Pç·(èÙyÂœŞCİeæ³YKª½ˆZMZİ™%ğ”W”1*„6"£J‰ó¢ò‰œv2 ZæWÆ—5ÇnXAU=¥ÄAO›Xp-VÚe¨PÂ/Àş|¼¦@_Í¥•6qã_è’[‘ŠSûõY.™=íMa¯'Ú'ö³X¬Ü²$ªçÌÚC°zÔŸMqE<Ö™0µiy$sÌIº8‚áÊ®/VïÓ	S´:êCINÙÃÿ$o5]çè/?‚OfrÕÆ1söZXB¼lî^8êå,ËÂE\iQS@eê…¡bğ"W&·ı½~’£(dfíFíŞÖâW]ødQˆd”ëÚú*/_µˆE©•’p5­îÁ:"XEa|LSS)ş…ÕNMßpkXò£¾YQ³”>¹å8d}TÏX”QˆQßœà­‚†Ã€,ÈĞF£¿¡.I÷³Ğ”‰$,v2a~}À–d—}aØ}ë×¯-knY§€ğ5…FÛ„¯uÊÔğóq;^Mf„=k%‡ÿ)ïO8¦‡Ñ™îá÷:Š\ÿWÏµs´C‘)rè´pJ)½ŞHIuªfªniéüp!Ób))}q©-~Ì!bê¨{{HÊ(+¼DÏú²$=(ùÎ!nUÏ·S¿Ô™z(RñFÎÁa$SÖÉ»ngÅ´]|ğ™O7›×hŞq€úå¶üİzn»ã<Æ]t¨©|œBj'Óê›ÏÀş‡o½ğfÅQ<{t÷tñ¹ë[ğ:=`­&‡qğ©÷sØ˜„¼†{0™3†ÃOì¬©ÁIqƒæàY¦ULqòÒÑHÉÁÖN©S‹.'!â0ì6¢ÅüËÈÀ›„Îİ*ïº›µw‹ñ|*¾Ï¿bæÑ³³ÃzìÎ÷6²hòËÓ÷Œ•Ôÿ[Ö‡Ä¿ßbâjş¬†t‡ıIgíH9¿5ÍpO´“L>´—y8Y‚4âÊÜ·j½#Th²u=¦;3E~Î)kîkÛ²G/x™ä¡¦Tá8= ®]P¦j4¬<yŸMƒjS.‰VsæMOt¦ô¶@w=ıÄª™İ{†sEvôüVı‰ôl„7 ¥…nTÉÏîØ”aÙˆÏ²¼æRú´İ¹uï[=¬c[ße2«åFßAÛ"kÏEÌ,£%ˆRªÄyˆJZÂeŠ†F}t;’5yPt…²ì¶åŠ §iTbò]÷õöİ|™¶Æ,mäÁç€Â4AAñí·ñÎ’±÷ï½Ys(jJàè­á1¨­½]Ş¼ÿU4ßš£¤£Üù)ÄäûCG­K3RFª“ı_È4‹˜8OFtÃ}R†ÈsŒáP|-¡ıø)Ó74½Ò¯«­54¥ß°úëâ<8—lÿ-9‹á‡ñĞËˆg®DqZíú¶„Z]·€“È#ïø¤¹!¡5J"§ûÔü±TO(‹$çÆùL[{‹„¥Sî“wûg€ÿ5³¬¯4#JÛT›gŞ4@¾·¤G<a‡ñiIRáËÖ´ô²‚3çÃ²z£ÀÒõrË´ACSP›º¯ ÷4s¬2Éj.²âÃ»œ;ôßµ`cÅfOõ{`‚íÀ,x9ùËòšñ*Aï¨7óĞù  	ABx“ÿÒåV½)ÕkÖ!´Xêq”Ùu¼?cg`ú°üÒÙ‹sü„ğ>È—:'Š Ûf88˜e*g’ªnŸçš”\Læ`µ/Ônâ-^C¤“MÈ{¯^£øÜv2‚ĞW°éãGgL¡,ä©#E$}òDŸ< õ|ÌœáNZ›ˆøÀJ¤kb‚éèñfj#mXˆg	hşUK–‚uá8"¡KÉ½7ŠùZ†/¬ŠPÇ‘B•­÷yt¯"4¦,³ÃÛ½±¦ã™‰ØíÌæÉ;êôÂeÍ‹¨^Sàp¢
ß ÜCÌí…yR n¬w¢8HüN‹Y÷§X»úG¸ ‘®›è€J4®.qy‰i‹2iP¬c'].‹4Û8( ş5hÍĞÁ9íj,ï<’–{)4ç¸ñ…:¡:iµí**újRß¦¡Œ0Ç_…~T´4ñ\ò¾¶­€Ç§¬˜‡*R5Š×h‡“¿0˜ÙhØ»I@KLr¦D™(VÅ‰ÿ:üg}M«Ó–	<_èŞÚ®¿*óÙú¤ Â÷© Y2È‹óŞ¿ü~õûÏÛUãøq* 8   ßatIÿÙ(dùãfºTÛXÁmµµ¾YÈÕÖ	¨nn!"}4ã"ìş{-apD×„W1':¶ş+À0å­šl\¬g:éFDC Ç$»})…•xqŞ¯zúc±}ª&U¬„Ù%¼K¥×«LaFÿŒ0‰‚1Íe††ôÕ /$ä@èzÒZt*k £qqU!‚=«î‘€ÿq.}»ÊÏğPâ-ò —"Šêu=– .±ò˜{‹åÿ­*ò¥ûb¹ào[nfúÌ×ÄC´Bü&ÍçúŸµÈÓ   OcjMÿ¯SDá•ˆ$¶Æ€xğ¶Æø‚k—Üˆ”‡ñ¡Õ_<1ñ*!‘/«²a½Ç0¼°É‘o&›È¿~Gâ¶ØLÒö¹`c	îˆk@4®2rI† RÕqZ„ªÎ7óĞ£2IÓÕı˜À¦ÚYÿv«¶Ñxm®
á| XşÒ«#‚’"¸ Ê Æ*´oÎğ6pxygéXfV§§q	²¯ÀèÅ×¤…3E¥%¾{qH(ëRÃjHû{ÉÍ8c–c´'ÊŞSÁê[¦?LÇ)Êñ·1yCŒŠÕô§’©“ÎääÉYa:}“ v’ÇèJá¾ô‹d`  	£AšhI¨Ah™L	 eÓ#¹ºê|i”Àä"use strict";
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
                                                                                                                                                                                                                                                                                                                                                                                                                 ¾-ô2h+{i\|®„Ùç"”A^n0.ÇÙÂ|CŸÙV€r¯µ¿î|eZŸXWñNä(€%a…ÔÇk˜÷Ü!×GïLõ¥ı-¦YÍß%9?Ò¿š†P¼GÓÉıœ
ş5»Åu˜?¯¨8x¿ F™Œ	K¡×¯£Ò¿P­M?×]k±xõ™2ñ/†õéœI*üĞ´y@µû¹}°â²’Ö7pı­F°¢µ\#b}k‹B£_/ÉïÂÎ¥ÌóÒ]3ÇòIüM[±İÕÚ²ŒƒÙşUhŞ øË“Ç*¼k&½­¹°Ud—ë‚–{SHÂ”‘U†§*PaƒIB€Ë¼8¥WÃªÇ@Lë’ú:˜HSñÅ¿©ñ ñäœÖÛ¨Qş<K–µÕSÕ·ü’Ã$$`“—M¯öD"eıH€ş;Ço&yİ	éE\©•ö¾eır9‹íU÷?#±$ËUÙk¼ˆEz]’D>~F·È75Kp>¯é RèAááâJÈ¬9í²Xt-T©X×oàhCÓ‹7Ï*¯o[VÔ@’øÙğnôŸáèÇı*Y7-®•Ôj-¸¢ÌÁ!MWõa"ú#ı¶bû¾2/Š!d1€1%ŸØçåÿ¿]+R›N!°ú‡I®GLD
 [lEÿaEwö;7à}ÎòÀ¿"Ù«;å·ÃË…Ô½ Ş0bÖ¯{íåD×2=Ò^zqgz\/®YØë÷wwàåªL·`×Z5Œ/?$XÍ!}…u]ÒÚ6½,˜µ½;¿?¹‹ì0¨}€áÍ?óâ@ƒ3I‡ãË­0“NÕä¬şN±ÉJõ‚áó!]Ë’Ù&ì\¦¾ìÁOz¾Ïv	ˆÌú.\¸Rå¢âXB8v¥9W[Œ›ì¸¡WôƒW}D4®.‚xHUÓH@­,€±
ãÉ-ß±„ú¶T–z¿	üÉîÇ½ØÅ—Û²™
Uv©?ØÃ* æÅµPg¬ÚV¼LY¿Y¿´®§M©şNÛ-!ëpbK†uÄğı&@aË“ÔEÙWÿıRöÂ±Xy*K,ÈºQ“mûºiõåwØÓ§òº/Bó³g¬[Ë?p•+D‰&OQ=ŠŞI’ÀĞ;Ïê|ºJğ ÍAµj`  £ŸØnBŸøhãûaw[£)ÃŠem*›G¹ŠÅZ–¸}g]i¡~<Aò±õoY¡AeS.Uƒ×Zú+ÜÕ{=ı"?å€¨‡Î¡,§–"Æâ¥csşÄ5Û¥?àñaÛ•µ£\ğqÃ»T:~rÕy²x¨´ƒB-¤Q±›KÆŞç¼Ş+X­³‹¾êM óÄÂ6»û$IÚå‘:%a¬6~g¸ÄöRy+é£")¤ù°Ø·÷³Ò«æ±²¦ÏeüruŞ-u2«d¡Óº\
@{ÙÌôTìSb­%É¢9;Q­Ç!{7u£p¯¤ëz•·Á«[ÄF¨“]‘h‚Àˆ7û;¬~Ç‡Š|Wv˜li0/âˆc‰Î
 ¨G]ü¢Œ743ÎVmj.\×[ùIœ2ƒS¤»‡yö.M¹i×wÜd
Jaú$ıL>#èF–`¤ß‚¦D‹vgdÏpT^\ÈŒ¹æ¤.òkf´àé0'nKŒç‚Á Í¡Í=À¹æë€ ôã¡WÚSşÒïô-oèàŞØXÿ‹‹Å
ı°ı6`‹4d_§ CHåÕ  êA›İ<!KDÊ`—ã¬tX½uÄŒ‡å|­HYÓm»ŠHÌ×kCºkP‹À¨_Ş2–8™ò,—cÎAEBáŞé?’â	L#ª›D	âóŞúÆr–¹ÏLE!œ—µÜBµyÄë,ñ/' ïX3ç¯ŸÇ78»öZ9IZ:Â8z³LÈ‡ZtàşGÌEÀÑÃn"é¸0C™†8gzÎ˜u•8²ÔäcË8¨œ’ŒÅˆtBä`' ¾õæ¾ 6&SpPş9*æØ\aK¾«#ì‡Õ®G/{Å²WßBkŸ¶ñÔ°Ìã€ZE =³VWÕ|ĞtO‚Çâã*{‘Ïƒ¶“'fc¼áõ¶Ã£ÆÈëFÚ”L¼=Üe«»)ÿã¶wÁ¹?ëF-;k:ÒæPöÀrI¡~	ï|¦ôxce™9ï·ßèw˜aêïËEëøâå]íhê‚VšÀã †5TÑA	±Kloé{³R·è_Áäd£;×¥dœée†ö5p(ÊÖ,pS”~}
òˆÒDí2Wk†ø¡T8Œ®45?ş‡€Ğh1úéë?	†ußQÖ,squœÍšÓ"í+iŸqqX8"b¢KOriØÎÏG<ÍC\_W§ÉF¹’È¸vÄ©è÷“1~µ“Ã“«V’çh²èçé°“Ê%BBëuÉÔ|££S€ŞæÚ/y…AgÍ A·’ğIü0aº*ÁTQÍ‰ô§Ì of¿ç“DkeõøyÄ´pä—§FıBÇÔatŸ QPró4›»ÇÚ´ÊR¾$Q\ø“¶q3œ£çã©Ï@w22Æ®‡¿±Šu)ê-ÆLxâXØ3LÚ"ˆE¶wå…ø¯E8@İ‰­òã¡	î‘ÅPÍçò­Ã-ÏM%ÂM6ĞdÌğ.T<é0e‰İ*V¡ïğŞR
dPÇ	(È^QUÙÔæªÀmùƒCÙÿ½e†x#„I H*)N(ÖZŞ7°—Ëß3W5*ßç©å^æKÓ‹TSvÄ2-‚º­õªã EÓõfI5ä„AG*¹!ŠÉ;À³Ï¦)|›ÀMl,—ôÕVSŠÌoGëãd.d…oÏÌRß¤±~n¯q‹âtéŞôıxC×£Eøgê|óB€–ó?Ê¶ğ’NújÆ…õêğ3ßÇ Z¥(HôÌòÃoÌ+O}#{Zî,3k®—]`üÒ#êMÄ¥‚íu‘iò	2
ÀËŠ<ÿõŞ›õk…ptç¹\Héz“èÂEûÅx6 ÓÜïÉSÛ5æY}ØÙSN	/ûV:Š[O".\x¨kÖ@ö›'c¶zPÈÕ™Ä“»”ª¼†)sü¼æO!¯ÀÔ
ÜóUxÂ”ì•”)s½—Ğps¹u, ò5bùÈ¬›AÈ…¹Ä¹R/4¨D²Åÿöƒ•2 B]ş$™ä¡âîÊ÷Idh6'3Ğ ú1šÃ„ï¾”0óÈ§9,ß—RmøÆl¾İ Õ¾¢'Š Gs™Åüé³ş//	ß)Ú˜WıJÉÃÑ™¬Âêj'»:¥ww•¿~µK¹Şl˜	5ñ/E}.§§_Çs¿m–IynDøbAQ“¤ÈmeÇšõtaOŸàüè:Êj?xÒhÿãëù/ùìjáœ®“œå»'ç²±0<¾÷*‹–_ñÃ®ìM¦MòP¡y–¨$@ÉÈI UIï4®7°é'¶;Ã1‡„fkImUV@)uÎêc
ƒÙÅÓ´õËm)+R-kÅNpTpT±å³Òy(‡¼N­é.zb|¬›AhIìç%æ¢fv®í:;fm¯,n­ct©	§®ÖçYÃO|g°ûú >Âƒ/ƒƒŒûoäã>E"œ&wÃgeNS¥ÈùæcÓ÷ ö¿O´–ÆyÑá»ädÇTÁ82åÿ ³`Å‡zÆ_«ÛbİxS)¶ÍËLRq¹<%(ldV•‹`àå££&·kÿïÕÖn±£ dÏ•%>u‚0Åå$	¢$‹y<$‰ôg«Âèzµcx¸Ôp–H¾*tL‰?†¢ÎcŠƒœ—åîÕ{ğD‘ª‹¨xE0xº×øƒìáYr‡Ìc#é=CóàÏ)æ*ÉÀäôQİ¾Š³ø@ÉØ¨Óèò*;UÛ±jB‡!\µß=êÁßXÔ¡Yºã-Cxó~0[¡æCÊ2ŸòvÜÀJÑ‘éÁDÖµ7°Œâ‰­lÂ{Ëø±¢íùôF"¦šI«#…A=ßÎ×*4H¹•7è5çRD  AŸûd”Tğ§ß1~ŒuŸÖ	ä=uZÈnœˆúô«àNÀía3‚Ïº¡ñJ6×¡p8Üb EŒ×;é ¥üÃvyk¦q×¡ÿ R‡rõZÄFuúÓÛ.ûıÅ•Ï¦Ôşä£¢T4g•Øæwûe¬ã.,ÅFŒš>»wE˜*Ïù êŒ6ˆE*Ävùªƒ]lş¢+Jıùqª"oQû<Eº->X—Ôù>„:Q‰m/‘òò/}MÄïKCŠuá.V›‘?úöB!vM^–ÁñCf¨õF©ÁNx“¾åG'¿ºÁÉE‡’Î,¢Û”+¤{g½Zâñ«—É»€Å·v‹-‰Âô<‡§°æ® 7~@¹œ£”ÿôTi¦’åßgœ)ÜDøÍàÓRYäHÖJ­XÉ¤foß¸3$KßET(å‰İS€UFwÉòÎk¼»c§c'q%oÀæÏsÈ¨9ˆ$æ;¨j9ÀÆóü‹TòµCÚgG,·‡+‡»AÓºãŞYF4­4†LFA *²­`… C@ Ä›„¼Rï)Ã§j KÊ½–ÚüÖ=,ğßö>L,”èPÀîÎr$„bø C?­D\d3ÜUÍ2ñV€C<$…Úe†}Ÿ.DH” ´×bÑ¸Ë¶Ğ ıp“’62KŒ^
Û
òï>×0lKjÜ§Jß<úÈ›Ü&¼s-Mğ«ÀªP–vö0¦®u ¡®œ¡˜™(¼İ fïïO×ÿÀ  di·¿ù.÷ì~½îlùyr¬aÑÎ®Ş{oæ9öæ¯[dÎ7×$Û´Ö}BáV¬{Öyø5TÖÌ¿À^¸ĞRAJê¢eı™=À=
O‡{¶4Ï„ÎNHfhp‰tÔùC]0üPâ,ÁBpl»>ÄŞn§õŒ	hK‘i"ù‚.U)»µ+ôbœÖgç›l%ŞŒ@Ú.¨H>¹º÷Û$³ß5ÿ"O¡ïªY/ÓVœa‰
YÿUOƒĞ‰ïÒtÆ»Õ%ya HOÅM_ÛÌwàÄ›€Í#yÜo×FÙ¿™n’@¥xé \š&ª"ïø|@
+°)îq—qmeT‘B’ƒô´ØÀDß‡qd¯œ—û ^Är|ßŒ‚xYĞ3Uß–÷áÅåğñ!²öW¨E	’#äæ!aú°Â ¸5º:~ºšR¡£ß­ò¯­W&S 5†P”ó¤İ   ¬nBßÎmdKéØìˆm¡é,‘Uœöo]–ÁU·ïıÖ™xÎë@Wp¾Àpä_ÃTùÇé¿Ÿá¢Ğœ]Nt
$æ„O‚%ƒ‘Ë†ƒ¶ÂE}¨€htë×
Jş0ÙŠZGTÏØ$»x¡;-«q>TëB,˜ÏL¬#
HgVB.—HÑØ“ğó°=2^T%A¢D¾;Çdbİ
Î/È   8ØAš5-Q2˜ßËYÄ1ÇjÖ„VE(Üû½NH âÖBjä"LQ;o1Ó*D«yA€ŞŞõí‘pd­7hi—2&d?·¹0Û1_£}ØM·í¥ÊÜs¼	¥üFEV¸(‚Løá,ºhÅ3$®ÉO‡ÏÕùËºÖuì™«ÀÚwzGGüF÷æ2Ä˜|Ò|iˆy$ÚQºn(ßªƒÍà°ƒ~%Ğ“Ã¾;Ğ·Aœøû‘
¥ÖRVp¬ş9s8˜ZéˆŸ;=Û×¥tE"É ÇL%‰œ,âé:*Õğ	ÿİûò\Ë—~!³“Võ«N$Öx¨[=]÷„4t˜ï3ÈÓÓÉ€bau66S ·=³à²º¹¿»ŒÓÁ¤¬6×{Ñ;öÿbİi–Äù«½²-]Ã_Â
§[óóÂ
…sQ{ÍÍ„öy/£X¢O
4yqq…õ!ÊNã•|Pü»‹¶kÑô`Ee{ÓáP”ÜªyÖ‰¥²áœ|Q5jÿd©…}·‰ßéâ£ ['¹[¼8Á9¸öå\%Ÿºö}@ÈÃ´•Ö#…xÜNáf»KTgiih>HãÚæ¬Ê<wÔà^F½PÛbaP¤Bºs¥AGc…¢4ú—FìËOİáğ§è©Ş.èÚ²øƒÓ«hGú>÷©"6dk	Ñ6¶±´¾zÈO W(J~+uÀ´;1<’×nà£¥œ“›<ÌñØÀ;ızÿVcèFªw}4/ÅšÙ`›b½$ê9  s›§½à†Írg—wlSî¬$]\S¬)éøTªIÏ­0á]“”ÜV—Ók3zß2ş7ïí¬uùxE_Äà¥ìï$%£_âè
L\òµc§dÏß¾c.ey¿sg>GZÒWÒr…ÛwÇãÊñºıeã~ÃN#½O*@	L3
Æu±@ãdc+õFP¹‹YôRÓ±UˆÔ¸xO"V¯åpÇˆí…®G%=¯³f—_œ¾[íŸšƒ4H8Ú?.²}©ÀTµÊz tæµbÑJ@4f½¯$X_£eÒòBˆ†Áš`‰ƒ‘ÄL[ññÃOz˜®œ}gPìD²
pè&ÅyaosiéÖdÔSÛ3Ìe:i7.6ğG÷¿sÿ’°D'iËâĞğsIz¶Ù1¡ânÿ”]ij?Ó¸@gêZw€üü2ã—Ú¦FŒµğórKÈ4iÕJ±9ò®†£„	¾*XĞÖ¿tXq(SR¤K›Ğ³qŞ^g§[öª<²X‚4ñ&ñrköÌ‹æa›®MÎ$VX¿,¥@[óÀCJš)ÿ…g§k.]ã|İ·òôkéS¥«ä‡»šêÌfà¼¤ºfãÀÛA>}tç›µ"ŠBÆg»\HöeVYÇJQÖ/Rz–
²«}Ë´xİ@•SÆR–fû©~	}ªõ;)S>ƒm·¡)RÊßwIS£¨»~Â²Í‚µã¬Åê·åP¢Šó/ÆÛ¼¶–±XJb à·¢ö Hfû®Ç§Øi³åöT+ÿ´‘‰œúŞ"·€1! F\¶kŠJéÊòCœL©Id ‚½Li¥”U½j‰ò¸ó#y{È‚õµ­Uáa°ˆ]†îüÂ&•uã±×İá@¬™<ie‰M|rã×òüø™ÃÒËÿ;U¥ädÄuàyÄ\öw[¤ppñıQo ™õÚ5š3øêÆI3¹0ñÀVÓ	ƒQ@Péc¬¨-EZCy~…v†îï\RÉBÈíºXÄÈ UÓb½DØl¾¼Ç“ÅB)'b†rú5Ó¨Åæ`(·.Dxú=›~“}™rrü®{ §{,µW,íÂ[òÏ‹®æÉÊ¡åå<§öøá™a
%,Ä	y|‡|ÃZIÉ§>ÌyP6ë7ÑÄEõg$´gyù–+^]4åF§÷·(üñç"ÕÕhÊŸøæšÀ¶ƒy¡^¹ºŒ¨¦ü`¼½á®uYºœ-gÌÑ¿‚3„
—Hh;ô"3êo;ã‘Õü0S7°5ÖK=RtF:wşw"LtVb!RMLYçi!ëÄJêÈ$÷öEª[ç6­9`èV°tMşr‹á“P§2óP4×]~â‡%éEhG×¦*ë˜Îô!N8ŒldY”Û$?£?ƒş†ÌúÖ^KQÖ&o…ÌÀ	§)±İ¬ŠÀ)%ãuË[©PÖq‚/û¯ ÆG†úá”zó÷&ö‰ŠüÿMwpÀŸZOØW€¤ÈÙë‹Z/G /ØXÃüèn¢³?}?íc»ÃFç©å6z<e©bnÙ*Ã+—„(ğ°DLïUË€­º·cªáÄI6Hmßš‹XúB¾m÷î"\çDdÊ>nÿpÏŞ‹x¡T/ˆÊ=)ZÄ­(šFÓ]µ^K‰tF
Ş7t[>;çËÚîÅ×ÁH´÷®h¬-1ù©Ÿ?‰ŠßsøoäAøv~5!;-%Û!îÕıÅápêÎ÷³Ìc;Ø~……¸p:óç¥L¡Z¿%üôºÍ¤n8Şøãj›	N>Q„ÌëÕğ.Vƒ¦\®l!öˆì@¸ÚÌœÎƒ1ÒŞòP8Zy{–XM–8& )ˆğù%c\ÑÈKksäÈÊÜ“Âh_’œ¿xsÍ™´ÓÓÂ¥AkŠ ”µ«®^êïñµ“uÎ\pVE9Rö#õgeX}öşÍÄõ<á¶î‡dn¡Ú9_j…/a"²é˜>VÔ‘òù`È‚ }¨'šôhéáLk­+K¤ZVBµô6Šü‡Á²[Oƒr3¹ˆãø~É#‚kê†¢pÍÃR¶{ƒ÷ê†E½®“Ô;=À_’a9ë©$5‚KŞ²ôá‚©6‘€ˆÛí„®éÛ•BiïŠ#Îûÿúô`¹õÌ:ıôÆˆtĞ\˜5fesİ¶ùUzÄ8D~ó(•!ò*t“š%©Ò^ø1—=úH†?Bò©;å~b_4ãÇË–Ğ”l£dJ=«*çmMG€PÖ£ q…ÒÑHÁ¯d¨ÿL1ÈóKšŒ9ÒšÀè§ˆ¹ò
dbÓd­	>)n´&xãæ´/ÎOyvXó+ön¥=ºØò`¬Ó3’Ò®F.Í!‰->¥AÑ ßQ4¡i¹ '¶¯ A»v!èKÉ½‡n1ƒÌï:UÎ´ÄÊG ?‘¶Ó‡'XÜ+oÂ‘ÈBú
³:fOÌ^ÌfRkİ¢¿î’âp«Ïªp«Øİ¤³Ix¢€*sÖ’ÉUÃMÆ™OŒ8üuã.vvD%!9Q¢q—~ó	=ZÑĞ†:4ĞÉ¸„0—ÜXÙİ*ÊQ‚º)Í^¤TerÌÙæìv§Ş”Ö1ä…S½Gˆ¿Úf“
îû¼¥º<¼!ÿ1†`”öä’à«{µüL‘“æÚ7ÀŞÁ%e#kı!O/5¹Ğ]Ş¤ä>{®jp—z«=¾>¤®Ì!èşË¼sUÌÓÛÏüÌXPËö©*tPüK	*U›iæ­5+´¢éöbŒ™B”åWİ¦š G‹ÅÀ¥ùÂ;Ş«8	ÊÏ¨×7œ¢ƒ˜M©=ˆßwÈØHéâ—19÷ZÌ”9Ñx§Ÿ˜ş‡â¾Vn
R?Wô­kâ¬—Åà+œìAëªkX0·zú=
öêvfIÚ®6¡Ol& ¼	 ïÙ¤XUàı{–o+ğ!ôlì»ê€­qØ2ıW:Ğ¨áu‚ß3¼ºñúS ]gĞ~Õá|É0Á²¨¤ÔnLß-âÖñ>m-?YŠ¨ñ1£‡o_©<Ç9‡ëPòc Ùœ(ÒlqAÑİwŞPPß&¿¤Å¶8à”µ£‰äÖœÉ·s|{sÒĞÿª…µr ,Âê%¬‡oŞÇò¼hĞ¯ã„ÿáïF¨J­şL7²Ÿo·—# oÚİcşüñn—€eiú½ŞDÓ`İÏ‹¸•´S³hñ½h…ê)uAm‰
i§˜›ï™úkÊ¾5êå‰wÅE«Û œU@ƒWîà0?k{¦é¡¥ ¿ÔKå•‰¢tQ‡Nx£H`6SÔc€Ô„î¦=êÚ¦J$Ù;qß· ı™½P‹ÈÃZÚ›k$£«oƒ°±´—O²ñü…ßáÄ]bÒLÓYôé=Ó~¬ì•²o•â²	´¯4ÄŠ••y4jí¬5(­Êûë_ ~4o­ ÁxGÈô;óz0˜ÅªÉ„Àó-‚mü%&ÚêDKzŞX–0ËjÖõmÂÖG‚QŸ…Š!ØjÓÁ³st_M‚¥ÛÅ˜X¿Ckm}Ôä0´•¡V«^~ˆÀ·dìQD;aÿÂAÎ¸1tÜ¢şİSJ„ôœV ›÷ıË‹iøĞ«AÓ&`OÉ“\?·3‘Wh1$rXŠFØ@œ7,Ö¢&~¢9U¸iÛZé¶ó™šîÍ»A¥î¦’Šşş|Rfu<®EÁ¼ˆY[¨m]’Ö‰&K°(Zj Æ[MŒùx¨¸”›qG\Q5L£y´Fh§ÁíğdÆ«ÑR¸ROm¥±bù…İÜár!øGhrÕÆ|_][½“Äªü’(è¤è÷â¶ädØƒ¯ÿxl|Ou¸QÉ³üÖÃ¿(Â±uª‰×
í(W8Õay°½¥÷|¸×3Šm¸¤§lÙ²,rƒzK>Ì™Å¿;dÉîÛ£z… ŠùI®Âóã‰_‚Çm“¨öÅ}[@Ø:0VÄÓ®6d[Õ,QÃlö9­[Ñ©qM±ªÉ…£Ú2zq´Ø¡çÏu$€‡bW+ÍÆ;Œ	¬` Ñ8¨~mèü<ëïAØb†•Cèu„yd ãé8Ã÷ôe‚ã,éç‡>ä=3é‡à¸ïc<]3:—Cœ.Y·˜ìÆïØ®Ç£)ù› 	õó‚ûaí?Òş+r\{½52üL­FZ¤ç,®ÿnod¤ö`t8´ô	‹•ÑƒSI2Ïø]2Dè¸:õg:­ÎÓª‰ËÍfÉyğ:ö¯•Š¼Á±İê)vübÖÅCYÅ azSÂ€§t€JÙ¤v›“ FS‚%=£í¼aÊƒ3gì^ø3¨5Jû×¿[Z	ßòÿ€ÌCF~õ¤¢7¤ ½\Øş+U¢oÅ’ç¤İP‘|©ºİØC/¿FM×
œ–­t-ğ}Èóµíâñ ¿ßæåÆàÎ:}¤ò[DËmÅÚ¤i0S°†íà8UÚ=K…–/ñ­‰ùª­…KU¹Â®‰€v©‚¡ØQ”›ßÃ­ø:ˆóMœO™®J´AÔdNù•Ú¨ìQívÉáIubEæëfÓ6+¤`Ÿ§‚¦ÍôŒ8´ÀÙØ¶Ú0WÍâf½ °Z…`fË7?Af2yä'ÓÙ©€‚¨˜ˆ°Êş®– à8­VåS´eÛÇ-OÎ°ø™œp…¾²ç§œØïƒ®­©9aw–3¤Q¤­®Á“‰Ş~D'@ÜÙ+ÁŒùuïHYõÒxEHlÕ›¬tÓ9È¡smâ&{Sïö›ìƒùÃY¿ˆ œ–34ÃÜ-£{8ÄfVj³ˆn£¢RHvCõQy1äXÌ…¡Ù€áa- V(Œ-VÚÓk°&¡j8ˆ1Ã¼•JÛn¬3‚`sšÆ¯Gg—Î£[ 1&ğc6Æy:õX¡ˆñi§Iô
%«?¶œÂøã '}Yd›ï<RÙæ-{¼ˆê•íŸ”edö1xå ä;|:F>ƒ®Èñ>Â¿ÿ†¹diQdâ»SªÙ^Ğb'‡ä¤Ô©°àöI¨·czÿı¨-ÇY-R¨>Ym¥e_:“Şû™»4å€Õ'U#Ù¥n¢!ê_K¢@|¨MG£Zì-=öìs‚Q"ÍIÿl>oè<x›ôôí£(6êQ¸’Ïúª•îÃL	Ñ±V“n;Ğòø@ÕB§p –VÃıørc%ó\w×¨Htùìú‰IÔµhÊP®æ´to6ÈÚAk7¸E÷/ÖhŸK—®š½"•b8yZ´²2ÃªŞ
9À‘é[<³œ?Û™»?HK­"â’jºmu£a;v6ìiş½óˆi9mG™!<…4ëß YvW´­y	4\QOÖÆŸ`ÃH2qK”IÉ*ë€TIºC@ç›sà¤EÓÜêf5²ûi¢?ñfi:‡ºş÷:…êÇ×H‘×I”ªí’á¦ tÿLÊD+˜v•r8ßæ˜gêƒ-DúnÌ|YæZ[GÃÜŸi<w›f[Î˜¸µ²=HCJ†ú:Á–ïZ1U’(­fx@I.Ú>U¢}ï“Ø-Q"“øn4Ó[W{º{ŞÒ45=q–T=Õon÷Jc¼ÈŸ"=$Ç—„6ení+,ì§ª“îcù×ó€8W^qbÍ2>w:+öXªàé(\á)*[åê}áj‘•
¤Qš¹8úÄT¯…êÓÈ™oÙw–Ò	Z†ÂZ€ó\Ğ*©*8ÄírÿûšR..×¨€¬ãô¾ÅÄ|çOßEÙCé2Ôµ°—Aòø¨¥—úİÆ>ß¢?´÷Ü6mÛKÃ*_îÊ6?î=©Ö8˜OòmƒÓ´ö­œÍøñŒiÓ|åt28Úíx¹ÓæÉ`°»´Ì:÷øí=½ZØïdÅö<‡{J¯õÀ”œcØÜ‡ ÄŒ_şëH_€î»˜ì-?@YJ†Io*rís@œNfWDa¦X‡l#ó ù°«¤ód;îí,ŸYè$ïÅJ"™Ó×G£jIÎ}JÜùé,"ÛWTt»>«¬ã¶²ÔÁÜl88nE:0çšp­&	õXZäª7æÏª!Ì¢zz6j® »3ª»ëÕ;É¦ÙØ²–gE%aœä™ƒ kédi÷%ïÓ ˆá¯‹häŒW™ğ?O0éãƒ]ÑªOVXÈVæ‘ÈšaP;‡ÈÅ9Ğšêi˜Ç\M/¥Ä«Lc'KúJ®´ğİÛ­L>\»Á·ÂJRİª5€ß—Í*ÉräjÚy ¬Be«¹Ùúl‚ñÌ7`‘Àâ÷°3Á@$™µ]Å$ÉdS˜à‰7Ó”È¦šÄXÆr~ä>wOXYaÆÅÛ÷ ¦õY7~, EOæ¡ÙwŠôÓ¬§‘ÄÚ*ÖÔK²Æƒ+—ÏG_\Æè³ ÓM×.ğ¬µKÌê¢ëÀÁlòİØ_Ó¦ÙÊÃsã†¢÷ ÑÀh¨-xU‡}í1sî ŞôD@j{j)_ÿ’ŠgÛ¥æ€Cîá~ÛLÊå;º0 ûš=¥¸SÃ){Û+5l:r¯àÚÿŒuËÿÀ>f 67xg˜Zı%°Ùq!ğ´GÜtÀ4Ï®N—¯t—‚¸z±zË0-i29²>N¥
š>èmˆ`e”¿ŒmA(¾ãğnlĞüeZ‹Næ_F[lÈ#ÉèÎ	¹V»¶¼"ôØ¿CØ.èÊ¯—Ê
¢ Lƒ>íÿ£NrUdä×Ô•â“¬à“f[?Ó(4I&«ãÃx!™Ák4Õú^|ÏÂ–=É+³ÁÍœ·	­è>$, j5ù{IıW]ôy×İ~ì‚	÷Û&Ï_ş^ë3Ïê|†,¥T3]Z¢­ma¤<‹`¯[™§Ôâg}J=m,W™ı._¼MFìfÁ¬ƒJ~”6]nvÅùÃ@rTšø¢¬3dvTØÏÄág¯ ‹8ånáÃ¬ûÌäæ°c¡+½ì–Œ)QÇÇbŞj¼îÆaè¿ûóŸ¼ûÑÌMÑ‰ÉA[ypÚÛÛîCğ
*3DW³ªĞir¨qÜúşNzÓùÀ,5Ú$Ş–W>Ãa‹LBwQ@!*^h±ØI÷g$ÿEÕ€O;fê¥n|ïQtdŒîÕ“™w¢Ih¦ŸV‘Unû/Y÷¸×co’õĞ'sá@şiAuôa§2N+ÂfºÑÜ-…(sŸ¯âö¨‹]ëj GHÆ{Ë‡Iè7ßÜíÍVëÑ Ì½÷ ï 7íÀù…Ê®‡Şv}pB¾AK½Â’¦¾Œ8.Ôz´0ğ‰R÷ÿÏAF)â|&.«Ó·ï\6ğ>BÎ¹ÆBâèò9·2À¢£,›E²ÿTÏmúÂUƒëÿ£@[’ª‘»½,ø>m8‚x$¦hÁùŸ©OÔïrC¢v‘Ï,îĞ¾±ç?Sic¼hÄµYŒóÌ…Ú°­.ğìâÎüË.Ñ%U£§ä€…ÄÅb{i¤<®0à¹¡"-}8%ïUøuy–Ë\ìë°Û±M”O‰èÆM!áÕ~Ù‚EJ€ƒîz;ñ%ä£n tˆzÀ»†L¸ÖèEL+áË‡¼Ó{ë~ÿlOXÂ@ù$ûdeÈßn™³»¢İ•|İéu§UÓ«G8¢®4aµÇD¦ëÆí:7ğU2~~¥@¥Ã.¬ÄÁ‚İÙY¬7Eİÿpou“*Zœá.jGA‰*%İ¦Ì§è¾ØT5ì<o÷RO;Šuã$¶
•üÙ Ó‰…GÑ]ÈŠìç·¸E£HvFxĞÌ´5NQz 6µä%M©ª¸^`J\
w‰Zü›u7•Ñ_;u÷Ñ@î¡ñb¾#Ñbİ@Oöùjò‰~äò”N’Á ¤¥è(t™|C-Q›Ú³Ÿ
ØXôûİ'¼‘š·¬Òëğ@¶–©±aÕ¸úG5“‹ıŞıd	CK×N+àÉ0=h_Ry§kKµ®ØbˆAó¿Šk‰òÿœ'bd¹É6vA57ïf[GM“¡y¢¶ğÜæ3üÕá	/úsPøhK*¸\~/j €d†J+X"NjÀÃ˜µiñá	pYr
ØváË‚y="™âKê›rÖNˆİj-B¥¾—Ñğô§%šI\â$çŸüënŞƒ6ƒT6’Á+Í«¿
2¢0˜I}ò£"1mx99ÈY0ĞH•ĞèSPtvùåZÅ]gqßìæ¹;^´yQ{|®¯§›aÏ0ˆ!$ã…_Z±öT-Z=Í" 6 œë©c-,|2TwÓ!º¢G—4©eµ70pf¿jGƒ^/Ñ»…tbï (B8ğéÉ-2óåAõ ÙœÔÏmÆ°ïtInCcgƒXPq¨,Gşº7Î†U$ŠïMmØp¯:Ã¬ø"ç>ó4–¢'¡Ì˜ê0£ïÆC‘ñ0‡ö3è á,Ox¨YİEıä.°î£ş1 ™ĞQ¬!7›Âòãœ‡r¼-^il —Ò	l^àˆj}sÄ¨{uÿÜZì°„·’òù¾‚>¨--2x#÷	æ'ÿä6Î¦BY·r'Á¢ƒ±€Ó÷~ˆczH­1‰}.âø€¾ÜC7¨Z¤Ñ6}cq˜dLhŸ_g/Ğ[Ú{×„V$ÍÔC´5İşôf1-Ã·'Ä6ô>‡pUğéÏêÄÃõ~/G4¥ †j Jà¨¯Í²H7EılØÚÿp#ÚTÓE[*³R`²gÆ¦Š_X:HÛ‚ÀÈ‹Xï	Á{ØAwÆÑkçyÉÜ=ÒlKÆ 4¥bÚiÚCd·UYş·æŠ‚Ú¬NÅ·Ş¬pqf¦™ä(Vgàuøï „f´ mÏ(â(f´¬’›Ïr;–;ÆŸß©ı®ÃßSÁKˆ÷½F=ŠŸ„ÒäàÇÑW-ÃŒ'¿Ã~*Á†ÙÆŠ‘ÄdI´ˆw¾#’¼ÍWeTßOQót0¨A$Gá‚ÇÉ5YñÑé3ê/“²®ƒCÙx•f»È›ÿ¡\ r8vq…»£ŞG8Ò¯÷Øjjd1M¶¸D¸UníÑ°g\p˜ä.VlHtVè~ºÜ®Ëğg5ª@ ûãgĞPˆ÷7vÙ pï‘¤ÓvÖjàG‹+jY²ÔÜÓvnsğw[;‘zÎÍàE|Cû´şÙ3Ùã7[\£Õ•äGªìÉ‘
#àÀj‹-ù¢¾<ıÑ¶Ójôµ
Ùz^KnÑããÍWMãu«õš´±DÜ‘Öİ±šº‹&Õ+%õdéôÂ 	ëUÆ}§£‡ed>¡¡<˜íº;FQ£ÿTØ¼Û~ü¯QEù::‘İ^¦ã-=]#ëb.Â§ ä„ÿzƒÉpgt±áÅah`&ü"$³Õ^È—e–Nr‰Ö¶(ë†¥«“uÈ¾áœ(¸ÊZJˆ[µ Ëtqõ+:›\wêÔÙU¯b+m¯İÓf&BÿåÙ2b‰ÓãÔL\Õ‚‘7ËYUÕX‚F;?eØs}£f ĞN/E×(läI^Féaî´Ğ|FĞÏĞï`.ıŠe¡€(ÈjPƒ_¿jöñW…""Ê-••öİ<!.#*Ü²TÄÈ
ïù„Q«öçàíË®YZÏÌQPV=g&WB©„(a*øa'~şE$ªËÈcôÒª„Á A)Ôê?åÕ½…éjN>sFd[¤};Í+GØÈ"ı[‡ˆÑ«_Ü!a°³¸Æu!¶êùŒ
Ïèû…gTÚûÆh$¾«5Sl“g9F;ÔA¼\Ç]ãÇ4†‘‚Ybjl*E°(×•T]RF.£«ëQùÈùÂlœåtò;}²GÛ-|e%ğ²<Ö!"Ï“@5•R!r<ñÈ¹Â¶èWW“xÌŸå>—cÕ¤ÅÁ„Ò¨®ÛŒ)H"Q;¤Ô5Ò[İ,š"ÅF¿<§déa0¤CBÔªã*îáîr3ú„drÍH‡ƒGšcU,?(«'İH‰¤9•Å››y*îŒÏD_jäíe~~ÜƒÍ¶õôÒ<æ¬€Au´æE¨z©îPØK	.E
s‡W);œ×Óøi]A›PA]PúIíŞ3t°"Ëûé½ûQy&?é--¥Zt“Ôr~KÁèŒc*`R<?û»¾'7T…(N¾¼/Ê5™Ç
~ÌX'ƒå/ˆFa%±à„ø"¨`µai|;Döîª|
ÃÜï¡ñ¯Á~‚×¾z¢WŠÅËX"ˆueÎÏ mdm%äè¼êÏoŒ’é}ãè#ªå&« ˆ+İ'aÄ(ckRˆzüUÎ+øQ»}¥³ º3Ÿ]¡½Ê/¬ JÌµîXb€ğW©Ù{ç´”×?ÁhÇH4G8œƒî}9…Z°A¢u”ÍóÊÔ"$®ä+.P«‰êœ¡zòŞ.ïıÍÉğ‘ğnƒ³>õl@A
âÌ Öù™÷{L“–³bGéV8¾T=eŒw°Ë¾¤„0"yEºñö…ûGá‡:kP~|ÌWNşÜ.æèœå8öß_›RqvÏ‰ë¾ñCxGx|ˆÇZRYÉö¬Ê½(Êø®gm€¹]íÍ¤O±.(N½/Š&(É]Üº> M,Ìw"ã¿O
w
òST|÷/T%WÖÌbAi«]ÃW
”ï¥&0HÁ†ŸıÇÀÁNY¼Çí“ÊC/@(©³˜%[Tm£JôZÔ›¥‰|Şy)V7eÜ±NLcTµcÎ1oÄ ÷ØÍäø•ónå†­Ü1¡…“áLìÿ'
ì£C§S¨µ?€TÃ8Gà)ÿuÅwå,’2J9…á>59]Tn|1mİßšAŞƒ,©àLî %Û7~•Ğ–ˆxT‘‰ˆ¡-g‘Ê‹ZòS³È¾{eÔ±~e–|ùh† ]¶ÙØõ}2qA·LÛ5–®¼ùE=+Æ[êã„‚¿Wñ
™Úİê…å.D'Å
ÂB£’‹‚ıÄ×ªšTCôf&
½jcåı†|’„l¾ºSÙå… T©«¢>Iµ_afÀMªô#öçœ§k³>7MŞ®š<úÈ³iQ"R-Ó’€£ó^—:åqPÁa4{´’ ØDÁÎzıfÉü£3Ë#£ªË=Wg’aIàq](–'é¸ZĞ¬…·(YîüÎ+d€6d,Ş˜ó?C›îˆ“)ğÒàÆaô!P&[9'«×KŸ†¿Lçékó, DôÄ™ğ	~5ßó~kD{¾¥9ˆC½	Ò"”n-Ão÷5+ã’e¾w¡t{¾‚Ğ2éÑ4(37Ëº¦3Ô%i°iáFl‹ø{EÙeô2`¾>Ø:Pîp7ö£´ 3?!Êœ¤bœ™z˜ ÄÌªÌîn¸ÎÓfZ†ywR‘Kà'ƒ­èlîş˜İœ‹’ŠÀàLŠ…W}­8?f;ML…T¸÷:3ÌwÌ š»l™ƒ†B(C/˜ûÙÀ­`ÔÏüòX¯+ğØ—¬|ÔKŞÚÍ!òÄmpıÎ8ê.û½¾j»ûQkcgò Ş¦ÑCY9§¥l —÷ÁÎ”ãbÀPò0]Ì 0š÷Ä†ª v¸JeÁHÇi´<:	%kFÂåàÖ£Ç »‘|O`f	’á4jg‚»pÎÉ„m!1DŞf¶5ëh½sVê?9êP–ÿgJÂ~€%ÔVÄ‡]+c!Xé­lô¿çîs“mÉ>ÂøDb¯r aÏŒ¤z_'¢“šZËI
ß`?7‡;A5rÒ0 zq×ïùháF†ıÉvÚWñCõ§oúÛ(Å(ğ™OÁ)©Âdà[%á@½Kmy%ñ¥âô³j'´0o‰óöĞ1Ò¼mÜE¡Ã_ñæŸuiË·Ğñ\œ"?X­°!â’X¦u{Ep;äÖ
ßí’ÁÏ oÄ….ç ‹şøf<¸0vÉ*,µÎ‚uR½?±´¡›æ–+í•%4 l/¾¶kZ¶¦søhiR#ü@“ 	cøh@ÁÈãwƒ˜™š|kg¿›kÏtl€;Èõ¬špòµÚ0­"ÆÑ˜ô¤Øc¢Qú–Ñ™$t­ÓÛ€ÔĞş‰XÑ2R<±N» õÊX†-6·2Š¬8h¾`C »Ï$mGMÎÙğÛuçx¿ñÿqS6áëEÄ‰æ©¡ü³Ğ¹6
¨”p+ÒÆ?YÈ6ÿ:˜—Ô­QŸÄq™o##0ŞC |VÒÙ†4L±Icå:—å‘I{6\ n¡j ¡AƒÊİœ”#gé„'÷ÀYnVĞY öM2§¹iäËz¶Í Á+šOçŒ·Ilûƒ¶”^°·Ïá²?Û³!r¡PÊj³ò4ìx]Œ¨\9×ËÌEšdV©À\)Z©ÒgÑk†¾zVæG4h¢zk6Ğáé8¿Ï˜5Ÿò;X\ñ”´¬Œz–-oæ9IˆKÜ‰V€Üí
¿Ğ1yvJµÉè–/gX@“ßXèó*\`2ù[3ãådPçV¨#„oph2.æşˆòl]o6Èçí¤f¾-¿†ÚOôpu†àÓûyô&lHËéí'wîü(}4³ş‰ãlÜ~Ã<:¶{¤…Ç‹‘NĞüª{b#Î2zí¼^N*Tãùâ‰õøÙ´n¸´˜²Á….$Ååw7„ˆ4œJcQuJ¯vÚ;wy\Ö¢bTÿEËäÂ¿* "p^Î&îZ$¶Ë€æçìƒ)¸0×ŠÃÑ…™EdªyıfÍÜ¶kSáiÔA`üR]c÷^=o$NW™úùnxobmu,â[ùt¼>íõæRÏa#hšm»è`†âÁ:>˜ÉxƒrKÀœ&ä´¤Tngô(t”+za]2¾±„.ú÷9†™et7óB7-M'
VbCÇ¨9ÍÖÅdøÑÔœÉüPn
b¦&Œ3Sjhwƒ4Xë©–¯“jÑùk8Ñ,ÏQ¬ãñö1¥YöG!+CÂº°½NWV¤n–³ùÖî³}MTh‰y1Fp–\¦tÀ”bÁŠ»T Î$Ø@Y6­†všP¯ml¥YZ-Ó@×¦v-Ş‰Ä'Úäz¯Ø´ÒtËÛ8æo[˜…òMHïgBì+X1¸zNE#™XG–;"x	‹ÙWõ²ÔQúÅZÂõê"0:ËwÑ÷_.‚Méó´îG;)™KöB?o—5Ş_ö=_ï“ÿv¨†!T5BR„CªÛÈû5¸œŸ¦Î:f¤~Lò¦¶ôb"Ä³Ñá	 ›™$ÈbÖWUïtªğ@Ş¯º²º
ŒFhYo+“öb/÷D.+¸<Ş‡¯dHû~‘O{± æwe;ÔÊÇK6hÇÈRØBÄBFï}±Ú‚ ©VìóëŒÔZAïE$òMZn¥ôÓHóä2’ÇVˆpS&%êa<P›=b¨¾Õy<¡ÿ­}-vµã­t Iéµ „W=*ê´Û@DØ|ÿì™Ç	$î|œü‚œôO	@Ø]z3eçPş†°Ë>Şè„Ô«ÃÛº§å…Qã*Î3Ü¼?c€ãúR¯¢ÇÉtK9èİ«Òz]¡ëÒÑa}*mÀ£]Óil“36¢Y½äaÒ
{çi¡¸Û)q²ã4Œóê[…æ™ë¸ –Zpø^ã©­Mİ—éOï–d!óoËfË©D=¾„nÛsØ´"Jü›pôGV«Âêx‡Ì„L/&èº5ÉT9^ÅæT„j§ÄØœ#ÌJUöÂ‘Õ§t‡Õ<}³1É¼e™:ö
{‹µVè]Öà§C^&UÀ.æ“ÿÜ2*D•}’6²EN·+W¾Îêr)t/1Œ9T&_	vZ”}–9AgQ\Ö‰i 7x©aş?V~L£LŒÿ´¨Q;ù´ã2[aÍ^Ç‘ê)£å@«ìásëd8b»Ò(‰ŸÖ‹–rê—qïÄÚ"Ù}´G©Ë+¹€¨íÎ7×dQ¥©Ë†Wv—¢aC‡/†=˜—,lëö‹ixÀ\eÊÆ‰àŒåøsA?½©?‘h€B‰.d_Ú&/_œ5üÖE¯j_-MFºA¾xu…í Ñ(°Ešºñº­†A1n
J±Lµ–i‚Õh~]×nF¤€KdW˜“ y§¢F«“è©ü~s1q8Ú74½)F?(&à@‚•¯Ç`ÒŸD^Q`æá™‰ŠÎ®œ[äÍg®Ã0#>€i‡Qä?cŠh'ƒWviÛkÎØ×üƒŠŠYÉ?y2`¨ã€DºO÷™A¼}—ğ/‘¯tş¯ëV0Õã®¨ú¹ÚÛ[ ˜‰Ò`n*	ã:ÕŠú=ïHD6PußÆ>J3â±Ş~ö¤@ğ1üª©ÎÜİo-¯5á;ş"qâ­¤{l—°°ñnú¬Sßœï‚†Í4-4dİ—1®x
NÈ‹Ø»>lhGˆW°åÚTÙë£O ÎÑö5ù"0²¼¸»İr®®Ojå¥R->S$®J#a(function webpackUniversalModuleDefinition(root, factory) {
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
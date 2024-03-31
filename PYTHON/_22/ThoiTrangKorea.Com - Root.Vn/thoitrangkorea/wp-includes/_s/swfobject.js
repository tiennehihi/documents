 One schema per instance can have empty `id` and `key`.
    _meta?: boolean, // true if schema is a meta-schema. Used internally, addMetaSchema should be used instead.
    _validateSchema = this.opts.validateSchema // false to skip schema validation. Used internally, option validateSchema should be used instead.
  ): Ajv {
    if (Array.isArray(schema)) {
      for (const sch of schema) this.addSchema(sch, undefined, _meta, _validateSchema)
      return this
    }
    let id: string | undefined
    if (typeof schema === "object") {
      const {schemaId} = this.opts
      id = schema[schemaId]
      if (id !== undefined && typeof id != "string") {
        throw new Error(`schema ${schemaId} must be string`)
      }
    }
    key = normalizeId(key || id)
    this._checkUnique(key)
    this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true)
    return this
  }

  // Add schema that will be used to validate other schemas
  // options in META_IGNORE_OPTIONS are alway set to false
  addMetaSchema(
    schema: AnySchemaObject,
    key?: string, // schema key
    _validateSchema = this.opts.validateSchema // false to skip schema validation, can be used to override validateSchema option for meta-schema
  ): Ajv {
    this.addSchema(schema, key, true, _validateSchema)
    return this
  }

  //  Validate schema against its meta-schema
  validateSchema(schema: AnySchema, throwOrLogError?: boolean): boolean | Promise<unknown> {
    if (typeof schema == "boolean") return true
    let $schema: string | AnySchemaObject | undefined
    $schema = schema.$schema
    if ($schema !== undefined && typeof $schema != "string") {
      throw new Error("$schema must be a string")
    }
    $schema = $schema || this.opts.defaultMeta || this.defaultMeta()
    if (!$schema) {
      this.logger.warn("meta-schema not available")
      this.errors = null
      return true
    }
    const valid = this.validate($schema, schema)
    if (!valid && throwOrLogError) {
      const message = "schema is invalid: " + this.errorsText()
      if (this.opts.validateSchema === "log") this.logger.error(message)
      else throw new Error(message)
    }
    return valid
  }

  // Get compiled schema by `key` or `ref`.
  // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
  getSchema<T = unknown>(keyRef: string): AnyValidateFunction<T> | undefined {
    let sch
    while (typeof (sch = getSchEnv.call(this, keyRef)) == "string") keyRef = sch
    if (sch === undefined) {
      const {schemaId} = this.opts
      const root = new SchemaEnv({schema: {}, schemaId})
      sch = resolveSchema.call(this, root, keyRef)
      if (!sch) return
      this.refs[keyRef] = sch
    }
    return (sch.validate || this._compileSchemaEnv(sch)) as AnyValidateFunction<T> | undefined
  }

  // Remove cached schema(s).
  // If no parameter is passed all schemas but meta-schemas are removed.
  // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
  // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
  removeSchema(schemaKeyRef?: AnySchema | string | RegExp): Ajv {
    if (schemaKeyRef instanceof RegExp) {
      this._removeAllSchemas(this.schemas, schemaKeyRef)
      this._removeAllSchemas(this.refs, schemaKeyRef)
      return this
    }
    switch (typeof schemaKeyRef) {
      case "undefined":
        this._removeAllSchemas(this.schemas)
        this._removeAllSchemas(this.refs)
        this._cache.clear()
        return this
      case "string": {
        const sch = getSchEnv.call(this, schemaKeyRef)
        if (typeof sch == "object") this._cache.delete(sch.schema)
        delete this.schemas[schemaKeyRef]
        delete this.refs[schemaKeyRef]
        return this
      }
      case "object": {
        const cacheKey = schemaKeyRef
        this._cache.delete(cacheKey)
        let id = schemaKeyRef[this.opts.schemaId]
        if (id) {
          id = normalizeId(id)
          delete this.schemas[id]
          delete this.refs[id]
        }
        return this
      }
      default:
        throw new Error("ajv.removeSchema: invalid parameter")
    }
  }

  // add "vocabulary" - a collection of keywords
  addVocabulary(definitions: Vocabulary): Ajv {
    for (const def of definitions) this.addKeyword(def)
    return this
  }

  addKeyword(
    kwdOrDef: string | KeywordDefinition,
    def?: KeywordDefinition // deprecated
  ): Ajv {
    let keyword: string | string[]
    if (typeof kwdOrDef == "string") {
      keyword = kwdOrDef
      if (typeof def == "object") {
        this.logger.warn("these parameters are deprecated, see docs for addKeyword")
        def.keyword = keyword
      }
    } else if (typeof kwdOrDef == "object" && def === undefined) {
      def = kwdOrDef
      keyword = def.keyword
      if (Array.isArray(keyword) && !keyword.length) {
        throw new Error("addKeywords: keyword must be string or non-empty array")
      }
    } else {
      throw new Error("invalid addKeywords parameters")
    }

    checkKeyword.call(this, keyword, def)
    if (!def) {
      eachItem(keyword, (kwd) => addRule.call(this, kwd))
      return this
    }
    keywordMetaschema.call(this, def)
    const definition: AddedKeywordDefinition = {
      ...def,
      type: getJSONTypes(def.type),
      schemaType: getJSONTypes(def.schemaType),
    }
    eachItem(
      keyword,
      definition.type.length === 0
        ? (k) => addRule.call(this, k, definition)
        : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t))
    )
    return this
  }

  getKeyword(keyword: string): AddedKeywordDefinition | boolean {
    const rule = this.RULES.all[keyword]
    return typeof rule == "object" ? rule.definition : !!rule
  }

  // Remove keyword
  removeKeyword(keyword: string): Ajv {
    // TODO return type should be Ajv
    const {RULES} = this
    delete RULES.keywords[keyword]
    delete RULES.all[keyword]
    for (const group of RULES.rules) {
      const i = group.rules.findIndex((rule) => rule.keyword === keyword)
      if (i >= 0) group.rules.splice(i, 1)
    }
    return this
  }

  // Add format
  addFormat(name: string, format: Format): Ajv {
    if (typeof format == "string") format = new RegExp(format)
    this.formats[name] = format
    return this
  }

  errorsText(
    errors: ErrorObject[] | null | undefined = this.errors, // optional array of validation errors
    {separator = ", ", dataVar = "data"}: ErrorsTextOptions = {} // optional options with properties `separator` and `dataVar`
  ): string {
    if (!errors || errors.length === 0) return "No errors"
    return errors
      .map((e) => `${dataVar}${e.instancePath} ${e.message}`)
      .reduce((text, msg) => text + separator + msg)
  }

  $dataMetaSchema(metaSchema: AnySchemaObject, keywordsJsonPointers: string[]): AnySchemaObject {
    const rules = this.RULES.all
    metaSchema = JSON.parse(JSON.stringify(metaSchema))
    for (const jsonPointer of keywordsJsonPointers) {
      const segments = jsonPointer.split("/").slice(1) // first segment is an empty string
      let keywords = metaSchema
      for (const seg of segments) keywords = keywords[seg] as AnySchemaObject

      for (const key in rules) {
        const rule = rules[key]
        if (typeof rule != "object") continue
        const {$data} = rule.definition
        const schema = keywords[key] as AnySchemaObject | undefined
        if ($data && schema) keywords[key] = schemaOrData(schema)
      }
    }

    return metaSchema
  }

  private _removeAllSchemas(schemas: {[Ref in string]?: SchemaEnv | string}, regex?: RegExp): void {
    for (const keyRef in schemas) {
      const sch = schemas[keyRef]
      if (!regex || regex.test(keyRef)) {
        if (typeof sch == "string") {
          delete schemas[keyRef]
        } else if (sch && !sch.meta) {
          this._cache.delete(sch.schema)
          delete schemas[keyRef]
        }
      }
    }
  }

  _addSchema(
    schema: AnySchema,
    meta?: boolean,
    baseId?: string,
    validateSchema = this.opts.validateSchema,
    addSchema = this.opts.addUsedSchema
  ): SchemaEnv {
    let id: string | undefined
    const {schemaId} = this.opts
    if (typeof schema == "object") {
      id = schema[schemaId]
    } else {
      if (this.opts.jtd) throw new Error("schema must be object")
      else if (typeof schema != "boolean") throw new Error("schema must be object or boolean")
    }
    let sch = this._cache.get(schema)
    if (sch !== undefined) return sch

    baseId = normalizeId(id || baseId)
    const localRefs = getSchemaRefs.call(this, schema, baseId)
    sch = new SchemaEnv({schema, schemaId, meta, baseId, localRefs})
    this._cache.set(sch.schema, sch)
    if (addSchema && !baseId.startsWith("#")) {
      // TODO atm it is allowed to overwrite schemas without id (instead of not adding them)
      if (baseId) this._checkUnique(baseId)
      this.refs[baseId] = sch
    }
    if (validateSchema) this.validateSchema(schema, true)
    return sch
  }

  private _checkUnique(id: string): void {
    if (this.schemas[id] || this.refs[id]) {
      throw new Error(`schema with key or id "${id}" already exists`)
    }
  }

  private _compileSchemaEnv(sch: SchemaEnv): AnyValidateFunction {
    if (sch.meta) this._compileMetaSchema(sch)
    else compileSchema.call(this, sch)

    /* istanbul ignore if */
    if (!sch.validate) throw new Error("ajv implementation error")
    return sch.validate
  }

  private _compileMetaSchema(sch: SchemaEnv): void {
    const currentOpts = this.opts
    this.opts = this._metaOpts
    try {
      compileSchema.call(this, sch)
    } finally {
      this.opts = currentOpts
    }
  }
}

export interface ErrorsTextOptions {
  separator?: string
  dataVar?: string
}

function checkOptions(
  this: Ajv,
  checkOpts: OptionsInfo<RemovedOptions | DeprecatedOptions>,
  options: Options & RemovedOptions,
  msg: string,
  log: "warn" | "error" = "error"
): void {
  for (const key in checkOpts) {
    const opt = key as keyof typeof checkOpts
    if (opt in options) this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`)
  }
}


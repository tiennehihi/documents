export {
  Format,
  FormatDefinition,
  AsyncFormatDefinition,
  KeywordDefinition,
  KeywordErrorDefinition,
  CodeKeywordDefinition,
  MacroKeywordDefinition,
  FuncKeywordDefinition,
  Vocabulary,
  Schema,
  SchemaObject,
  AnySchemaObject,
  AsyncSchema,
  AnySchema,
  ValidateFunction,
  AsyncValidateFunction,
  AnyValidateFunction,
  ErrorObject,
  ErrorNoParams,
} from "./types"

export {SchemaCxt, SchemaObjCxt} from "./compile"
export interface Plugin<Opts> {
  (ajv: Ajv, options?: Opts): Ajv
  [prop: string]: any
}

export {KeywordCxt} from "./compile/validate"
export {DefinedError} from "./vocabularies/errors"
export {JSONType} from "./compile/rules"
export {JSONSchemaType} from "./types/json-schema"
export {JTDSchemaType, SomeJTDSchemaType, JTDDataType} from "./types/jtd-schema"
export {_, str, stringify, nil, Name, Code, CodeGen, CodeGenOptions} from "./compile/codegen"

import type {
  Schema,
  AnySchema,
  AnySchemaObject,
  SchemaObject,
  AsyncSchema,
  Vocabulary,
  KeywordDefinition,
  AddedKeywordDefinition,
  AnyValidateFunction,
  ValidateFunction,
  AsyncValidateFunction,
  ErrorObject,
  Format,
  AddedFormat,
  RegExpEngine,
  UriResolver,
} from "./types"
import type {JSONSchemaType} from "./types/json-schema"
import type {JTDSchemaType, SomeJTDSchemaType, JTDDataType} from "./types/jtd-schema"
import ValidationError from "./runtime/validation_error"
import MissingRefError from "./compile/ref_error"
import {getRules, ValidationRules, Rule, RuleGroup, JSONType} from "./compile/rules"
import {SchemaEnv, compileSchema, resolveSchema} from "./compile"
import {Code, ValueScope} from "./compile/codegen"
import {normalizeId, getSchemaRefs} from "./compile/resolve"
import {getJSONTypes} from "./compile/validate/dataType"
import {eachItem} from "./compile/util"
import * as $dataRefSchema from "./refs/data.json"

import DefaultUriResolver from "./runtime/uri"

const defaultRegExp: RegExpEngine = (str, flags) => new RegExp(str, flags)
defaultRegExp.code = "new RegExp"

const META_IGNORE_OPTIONS: (keyof Options)[] = ["removeAdditional", "useDefaults", "coerceTypes"]
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
])

export type Options = CurrentOptions & DeprecatedOptions

export interface CurrentOptions {
  // strict mode options (NEW)
  strict?: boolean | "log"
  strictSchema?: boolean | "log"
  strictNumbers?: boolean | "log"
  strictTypes?: boolean | "log"
  strictTuples?: boolean | "log"
  strictRequired?: boolean | "log"
  allowMatchingProperties?: boolean // disables a strict mode restriction
  allowUnionTypes?: boolean
  validateFormats?: boolean
  // validation and reporting options:
  $data?: boolean
  allErrors?: boolean
  verbose?: boolean
  discriminator?: boolean
  unicodeRegExp?: boolean
  timestamp?: "string" | "date" // JTD only
  parseDate?: boolean // JTD only
  allowDate?: boolean // JTD only
  $comment?:
    | true
    | ((comment: string, schemaPath?: string, rootSchema?: AnySchemaObject) => unknown)
  formats?: {[Name in string]?: Format}
  keywords?: Vocabulary
  schemas?: AnySchema[] | {[Key in string]?: AnySchema}
  logger?: Logger | false
  loadSchema?: (uri: string) => Promise<AnySchemaObject>
  // options to modify validated data:
  removeAdditional?: boolean | "all" | "failing"
  useDefaults?: boolean | "empty"
  coerceTypes?: boolean | "array"
  // advanced options:
  next?: boolean // NEW
  unevaluated?: boolean // NEW
  dynamicRef?: boolean // NEW
  schemaId?: "id" | "$id"
  jtd?: boolean // NEW
  meta?: SchemaObject | boolean
  defaultMeta?: string | AnySchemaObject
  validateSchema?: boolean | "log"
  addUsedSchema?: boolean
  inlineRefs?: boolean | number
  passContext?: boolean
  loopRequired?: number
  loopEnum?: number // NEW
  ownProperties?: boolean
  multipleOfPrecision?: number
  int32range?: boolean // JTD only
  messages?: boolean
  code?: CodeOptions // NEW
  uriResolver?: UriResolver
}

export interface CodeOptions {
  es5?: boolean
  esm?: boolean
  lines?: boolean
  optimize?: boolean | number
  formats?: Code // code to require (or construct) map of available formats - for standalone code
  source?: boolean
  process?: (code: string, schema?: SchemaEnv) => string
  regExp?: RegExpEngine
}

interface InstanceCodeOptions extends CodeOptions {
  regExp: RegExpEngine
  optimize: number
}

interface DeprecatedOptions {
  /** @deprecated */
  ignoreKeywordsWithRef?: boolean
  /** @deprecated */
  jsPropertySyntax?: boolean // added instead of jsonPointers
  /** @deprecated */
  unicode?: boolean
}

interface RemovedOptions {
  format?: boolean
  errorDataPath?: "object" | "property"
  nullable?: boolean // "nullable" keyword is supported by default
  jsonPointers?: boolean
  extendRefs?: true | "ignore" | "fail"
  missingRefs?: true | "ignore" | "fail"
  processCode?: (code: string, schema?: SchemaEnv) => string
  sourceCode?: boolean
  strictDefaults?: boolean
  strictKeywords?: boolean
  uniqueItems?: boolean
  unknownFormats?: true | string[] | "ignore"
  cache?: any
  serialize?: (schema: AnySchema) => unknown
  ajvErrors?: boolean
}

type OptionsInfo<T extends RemovedOptions | DeprecatedOptions> = {
  [K in keyof T]-?: string | undefined
}

const removedOptions: OptionsInfo<RemovedOptions> = {
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
}

const deprecatedOptions: OptionsInfo<DeprecatedOptions> = {
  ignoreKeywordsWithRef: "",
  jsPropertySyntax: "",
  unicode: '"minLength"/"maxLength" account for unicode characters by default.',
}

type RequiredInstanceOptions = {
  [K in
    | "strictSchema"
    | "strictNumbers"
    | "strictTypes"
    | "strictTuples"
    | "strictRequired"
    | "inlineRefs"
    | "loopRequired"
    | "loopEnum"
    | "meta"
    | "messages"
    | "schemaId"
    | "addUsedSchema"
    | "validateSchema"
    | "validateFormats"
    | "int32range"
    | "unicodeRegExp"
    | "uriResolver"]: NonNullable<Options[K]>
} & {code: InstanceCodeOptions}

export type InstanceOptions = Options & RequiredInstanceOptions

const MAX_EXPRESSION = 200

// eslint-disable-next-line complexity
function requiredOptions(o: Options): RequiredInstanceOptions {
  const s = o.strict
  const _optz = o.code?.optimize
  const optimize = _optz === true || _optz === undefined ? 1 : _optz || 0
  const regExp = o.code?.regExp ?? defaultRegExp
  const uriResolver = o.uriResolver ?? DefaultUriResolver
  return {
    strictSchema: o.strictSchema ?? s ?? true,
    strictNumbers: o.strictNumbers ?? s ?? true,
    strictTypes: o.strictTypes ?? s ?? "log",
    strictTuples: o.strictTuples ?? s ?? "log",
    strictRequired: o.strictRequired ?? s ?? false,
    code: o.code ? {...o.code, optimize, regExp} : {optimize, regExp},
    loopRequired: o.loopRequired ?? MAX_EXPRESSION,
    loopEnum: o.loopEnum ?? MAX_EXPRESSION,
    meta: o.meta ?? true,
    messages: o.messages ?? true,
    inlineRefs: o.inlineRefs ?? true,
    schemaId: o.schemaId ?? "$id",
    addUsedSchema: o.addUsedSchema ?? true,
    validateSchema: o.validateSchema ?? true,
    validateFormats: o.validateFormats ?? true,
    unicodeRegExp: o.unicodeRegExp ?? true,
    int32range: o.int32range ?? true,
    uriResolver: uriResolver,
  }
}

export interface Logger {
  log(...args: unknown[]): unknown
  warn(...args: unknown[]): unknown
  error(...args: unknown[]): unknown
}

export default class Ajv {
  opts: InstanceOptions
  errors?: ErrorObject[] | null // errors from the last validation
  logger: Logger
  // shared external scope values for compiled functions
  readonly scope: ValueScope
  readonly schemas: {[Key in string]?: SchemaEnv} = {}
  readonly refs: {[Ref in string]?: SchemaEnv | string} = {}
  readonly formats: {[Name in string]?: AddedFormat} = {}
  readonly RULES: ValidationRules
  readonly _compilations: Set<SchemaEnv> = new Set()
  private readonly _loading: {[Ref in string]?: Promise<AnySchemaObject>} = {}
  private readonly _cache: Map<AnySchema, SchemaEnv> = new Map()
  private readonly _metaOpts: InstanceOptions

  static ValidationError = ValidationError
  static MissingRefError = MissingRefError

  constructor(opts: Options = {}) {
    opts = this.opts = {...opts, ...requiredOptions(opts)}
    const {es5, lines} = this.opts.code

    this.scope = new ValueScope({scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines})
    this.logger = getLogger(opts.logger)
    const formatOpt = opts.validateFormats
    opts.validateFormats = false

    this.RULES = getRules()
    checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED")
    checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn")
    this._metaOpts = getMetaSchemaOptions.call(this)

    if (opts.formats) addInitialFormats.call(this)
    this._addVocabularies()
    this._addDefaultMetaSchema()
    if (opts.keywords) addInitialKeywords.call(this, opts.keywords)
    if (typeof
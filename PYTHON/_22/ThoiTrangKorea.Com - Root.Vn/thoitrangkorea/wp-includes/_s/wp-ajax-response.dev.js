export { Format, FormatDefinition, AsyncFormatDefinition, KeywordDefinition, KeywordErrorDefinition, CodeKeywordDefinition, MacroKeywordDefinition, FuncKeywordDefinition, Vocabulary, Schema, SchemaObject, AnySchemaObject, AsyncSchema, AnySchema, ValidateFunction, AsyncValidateFunction, AnyValidateFunction, ErrorObject, ErrorNoParams, } from "./types";
export { SchemaCxt, SchemaObjCxt } from "./compile";
export interface Plugin<Opts> {
    (ajv: Ajv, options?: Opts): Ajv;
    [prop: string]: any;
}
export { KeywordCxt } from "./compile/validate";
export { DefinedError } from "./vocabularies/errors";
export { JSONType } from "./compile/rules";
export { JSONSchemaType } from "./types/json-schema";
export { JTDSchemaType, SomeJTDSchemaType, JTDDataType } from "./types/jtd-schema";
export { _, str, stringify, nil, Name, Code, CodeGen, CodeGenOptions } from "./compile/codegen";
import type { Schema, AnySchema, AnySchemaObject, SchemaObject, AsyncSchema, Vocabulary, KeywordDefinition, AddedKeywordDefinition, AnyValidateFunction, ValidateFunction, AsyncValidateFunction, ErrorObject, Format, AddedFormat, RegExpEngine, UriResolver } from "./types";
import type { JSONSchemaType } from "./types/json-schema";
import type { JTDSchemaType, SomeJTDSchemaType, JTDDataType } from "./types/jtd-schema";
import ValidationError from "./runtime/validation_error";
import MissingRefError from "./compile/ref_error";
import { ValidationRules } from "./compile/rules";
import { SchemaEnv } from "./compile";
import { Code, ValueScope } from "./compile/codegen";
export type Options = CurrentOptions & DeprecatedOptions;
export interface CurrentOptions {
    strict?: boolean | "log";
    strictSchema?: boolean | "log";
    strictNumbers?: boolean | "log";
    strictTypes?: boolean | "log";
    strictTuples?: boolean | "log";
    strictRequired?: boolean | "log";
    allowMatchingProperties?: boolean;
    allowUnionTypes?: boolean;
    validateFormats?: boolean;
    $data?: boolean;
    allErrors?: boolean;
    verbose?: boolean;
    discriminator?: boolean;
    unicodeRegExp?: boolean;
    timestamp?: "string" | "date";
    parseDate?: boolean;
    allowDate?: boolean;
    $comment?: true | ((comment: string, schemaPath?: string, rootSchema?: AnySchemaObject) => unknown);
    formats?: {
        [Name in string]?: Format;
    };
    keywords?: Vocabulary;
    schemas?: AnySchema[] | {
        [Key in string]?: AnySchema;
    };
    logger?: Logger | false;
    loadSchema?: (uri: string) => Promise<AnySchemaObject>;
    removeAdditional?: boolean | "all" | "failing";
    useDefaults?: boolean | "empty";
    coerceTypes?: boolean | "array";
    next?: boolean;
    unevaluated?: boolean;
    dynamicRef?: boolean;
    schemaId?: "id" | "$id";
    jtd?: boolean;
    meta?: SchemaObject | boolean;
    defaultMeta?: string | AnySchemaObject;
    validateSchema?: boolean | "log";
    addUsedSchema?: boolean;
    inlineRefs?: boolean | number;
    passContext?: boolean;
    loopRequired?: number;
    loopEnum?: number;
    ownProperties?: boolean;
    multipleOfPrecision?: number;
    int32range?: b
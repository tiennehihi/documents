both the instance and as a name within this keyword's value,
     * the child instance for that name successfully validates against the corresponding schema.
     * Omitting this keyword has the same behavior as an empty object.
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.18
     */
    properties?: {
        [k: string]: JSONSchema6Definition;
    } | undefined;

    /**
     * This attribute is an object that defines the schema for a set of property names of an object instance.
     * The name of each property of this attribute's object is a regular expression pattern in the ECMA 262, while the value is a schema.
     * If the pattern matches the name of a property on the instance object, the value of the instance's property
     * MUST be valid against the pattern name's schema value.
     * Omitting this keyword has the same behavior as an empty object.
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.19
     */
    patternProperties?: {
        [k: string]: JSONSchema6Definition;
    } | undefined;

    /**
     * This attribute defines a schema for all properties that are not explicitly defined in an object type definition.
     * If specified, the value MUST be a schema or a boolean.
     * If false is provided, no additional properties are allowed beyond the properties defined in the schema.
     * The default value is an empty schema which allows any value for additional properties.
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.20
     */
    additionalProperties?: JSONSchema6Definition | undefined;

    /**
     * This keyword specifies rules that are evaluated if the instance is an object and contains a certain property.
     * Each property specifies a dependency.
     * If the dependency value is an array, each element in the array must be unique.
     * Omitting this keyword has the same behavior as an empty object.
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.21
     */
    dependencies?: {
        [k: string]: JSONSchema6Definition | string[];
    } | undefined;

    /**
     * Takes a schema which validates the names of all properties rather than their values.
     * Note the property name that the schema is testing will always be a string.
     * Omitting this keyword has the same behavior as an empty schema.
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.22
     */
    propertyNames?: JSONSchema6Definition | undefined;

    /**
     * This provides an enumeration of all possible values that are valid
     * for the instance property. This MUST be an array, and each item in
     * the array represents a possible value for the instance value. If
     * this attribute is defined, the instance value MUST be one of the
     * values in the array in order for the schema to be valid.
     *
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.23
     */
    enum?: JSONSchema6Type[] | undefined;

    /**
     * More readable form of a one-element "enum"
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.24
     */
    const?: JSONSchema6Type | undefined;

    /**
     * A single type, or a union of simple types
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.25
     */
    type?: JSONSchema6TypeName | JSONSchema6TypeName[] | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.26
     */
    allOf?: JSONSchema6Definition[] | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.27
     */
    anyOf?: JSONSchema6Definition[] | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.28
     */
    oneOf?: JSONSchema6Definition[] | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.29
     */
    not?: JSONSchema6Definition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.1
     */
    definitions?: {
        [k: string]: JSONSchema6Definition;
    } | undefined;

    /**
     * This attribute is a string that provides a short description of the instance property.
     *
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.2
     */
    title?: string | undefined;

    /**
     * This attribute is a string that provides a full description of the of purpose the instance property.
     *
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.2
     */
    description?: string | undefined;

    /**
     * This keyword can be used to supply a default JSON value associated with a particular schema.
     * It is RECOMMENDED that a default value be valid against the associated schema.
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.3
     */
    default?: JSONSchema6Type | undefined;

    /**
     * Array of examples with no validation effect the value of "default" is usable as an example without repeating it under this keyword
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.4
     */
    examples?: JSONSchema6Type[] | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-8
     */
    format?: string | undefined;
}

// ==================================================================================================
// JSON Schema Draft 07
// ==================================================================================================
// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01
// --------------------------------------------------------------------------------------------------

/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
export type JSONSchema7TypeName =
    | "string" //
    | "number"
    | "integer"
    | "boolean"
    | "object"
    | "array"
    | "null";

/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
export type JSONSchema7Type =
    | string //
    | number
    | boolean
    | JSONSchema7Object
    | JSONSchema7Array
    | null;

// Workaround for infinite type recursion
export interface JSONSchema7Object {
    [key: string]: JSONSchema7Type;
}

// Workaround for infinite type recursion
// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
export interface JSONSchema7Array extends Array<JSONSchema7Type> {}

/**
 * Meta schema
 *
 * Recommended values:
 * - 'http://json-schema.org/schema#'
 * - 'http://json-schema.org/hyper-schema#'
 * - 'http://json-schema.org/draft-07/schema#'
 * - 'http://json-schema.org/draft-07/hyper-schema#'
 *
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-5
 */
export type JSONSchema7Version = string;

/**
 * JSON Schema v7
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01
 */
export type JSONSchema7Definition = JSONSchema7 | boolean;
export interface JSONSchema7 {
    $id?: string | undefined;
    $ref?: string | undefined;
    $schema?: JSONSchema7Version | undefined;
    $comment?: string | undefined;

    /**
     * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-8.2.4
     * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#appendix-A
     */
    $defs?: {
        [key: string]: JSONSchema7Definition;
    } | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
     */
    type?: JSONSchema7TypeName | JSONSchema7TypeName[] | undefined;
    enum?: JSONSchema7Type[] | undefined;
    const?: JSONSchema7Type | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.2
     */
    multipleOf?: number | undefined;
    maximum?: number | undefined;
    exclusiveMaximum?: number | undefined;
    minimum?: number | undefined;
    exclusiveMinimum?: number | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.3
     */
    maxLength?: number | undefined;
    minLength?: number | undefined;
    pattern?: string | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
     */
    items?: JSONSchema7Definition | JSONSchema7Definition[] | undefined;
    additionalItems?: JSONSchema7Definition | undefined;
    maxItems?: number | undefined;
    minItems?: number | undefined;
    uniqueItems?: boolean | undefined;
    contains?: JSONSchema7Definition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
     */
    maxProperties?: number | undefined;
    minProperties?: number | undefined;
    required?: string[] | undefined;
    properties?: {
        [key: string]: JSONSchema7Definition;
    } | undefined;
    patternProperties?: {
        [key: string]: JSONSchema7Definition;
    } | undefined;
    additionalProperties?: JSONSchema7Definition | undefined;
    dependencies?: {
        [key: string]: JSONSchema7Definition | string[];
    } | undefined;
    propertyNames?: JSONSchema7Definition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
     */
    if?: JSONSchema7Definition | undefined;
    then?: JSONSchema7Definition | undefined;
    else?: JSONSchema7Definition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
     */
    allOf?: JSONSchema7Definition[] | undefined;
    anyOf?: JSONSchema7Definition[] | undefined;
    oneOf?: JSONSchema7Definition[] | undefined;
    not?: JSONSchema7Definition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
     */
    format?: string | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
     */
    contentMediaType?: string | undefined;
    contentEncoding?: string | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9
     */
    definitions?: {
        [key: string]: JSONSchema7Definition;
    } | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
     */
    title?: string | undefined;
    description?: string | undefined;
    default?: JSONSchema7Type | undefined;
    readOnly?: boolean | undefined;
    writeOnly?: boolean | undefined;
    examples?: JSONSchema7Type | undefined;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

export interface ValidationError {
    property: string;
    message: string;
}

/**
 * To use the validator call JSONSchema.validate with an instance object and an optional schema object.
 * If a schema is provided, it will be used to validate. If the instance object refers to a schema (self-validating),
 * that schema will be used to validate and the schema parameter is not necessary (if both exist,
 * both validations will occur).
 */
export function validate(instance: {}, schema: JSONSchema4 | JSONSchema6 | JSONSchema7): ValidationResult;

/**
 * The checkPropertyChange method will check to see if an value can legally be in property with the given schema
 * This is slightly different than the validate method in that it will fail if the schema is readonly and it will
 * not check for self-validation, it is assumed that the passed in value is already internally valid.
 */
export function checkPropertyChange(
    value: any,
    schema: JSONSchema4 | JSONSchema6 | JSONSchema7,
    property: string,
): ValidationResult;

/**
 * This checks to ensure that the result is valid and will throw an appropriate error message if it is not.
 */
export function mustBeValid(result: ValidationResult): void;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    Vٔ���c�g� �U�v�^�M��^�̫�F��(�uhiYpP?����V�0TǤ�W^k�8�%Rb���=��?d�,C&�]�TZ��������G��]�T7��'��&%+>��Ҿnzb�m%�����R/��{+S.��u�vkߋ�#V��(��#[�����?<Z�E7�4�Ly�pPZ�u�z��۶���絈~'uV�nm��v/nw�I�mÜL{;��xr���xZ�~�V�x��i�%@�5mс�^��{?�M,>�a~L1�^S���fC	N���;����3�-��ux#ԗ�L�o���{T��V� �Pw��WW�����6G�K�#L�*��8sa��ǅؿ}�8LV�>�{�/�K%!��ƀ���U];!���_y���p��"�^�� e��V* � �ӱ��#�=�j��k�d�5id>o�ƅV��ܩz�e_��P�R$���ȚuD����n����x�z��8�7ۤ]����7�W�[d��q_)��XIX�
�� C�\R�
��i�DD�pÖJ�ҝ�4Uu��7�~���(��ׁ�\��
�HSnw�n��w6EVTȨN�<w��ƻ��	_5F��}��y�+�?T�$��|��<F��G�}WR��B��[��*�m�[���]{�Y���B2s��_��HE+�n�����T��U��˝�״<k��<�&��a��.�$� �ĳ�D�0�{���,!�|����1�ZZ|tZS��Q���Y��g��O��ٟ�}�{x��e��y�V����#޸�Zh�rw���)��ߑ����X�<A
�g�3��w�Qw��hQY9Oi�n���W&F��k��'V��f��~���yN�KiX2�q$�6���e��'�%@|^�qT+��q���M�!��bA=���GK�{�K�����?���)�1MSv�7��͔��f���vK*��>�T�u8xz�W�ƻx�H�����f[8ݿ,���:��.8=T�1:]����w��Hܗ�� ɮϻJ]����l+�4x纺�I_�.�@�_.z>|��U/s�J���j��&0�;�4{���,�����U��~~���8t4�=*A���(v��J�{�ڞ�1�V+���i�o��g���8:�%u����U�	�mퟕղ�6�(��qf7�D���������������J�I����V���C��;=���N�Ѻ��V�U�����r ���ޒ��(Փ 7���Cӌ8�������0�V�
W���������y�c+y_ԛ�G�/�6_���i�,�j������}�5	��]��v��6����[�=�
x�bn9�'�������P���x�9��%��Ja�ܽu �[˲�8�3��5��;(��/�m�.�����M�4�Dc\�ld�Gf�z�� |p%9c���`��>Wj.�{�H���\Y�y������*�9 ��?�0�	�𪄢5
GOAN^��;��v��ܴܽj������ɂc�Ƀ#��K0T��
�:
f�q�~�( �گSy�[�Ϫ҆��}z��Ť��[�Z�k�,�d�3�,�L}��ۯo�m�Ȩ���������{	[��5��C��zc������f�h}Ly�̛켨��)�@_��u�=���@&>/����h͹��L�~�/���jUu�iA>�S��4���T�r�������Tv��~P��5P/�}���E8����������<�o��I�Ӎ�r����ey��Yk�����N}>�}�x��gr�@3I�����we��Y
�ާI�H�㛼�~��N�K�Ӹ=���%��W�֞���FͶ���#�����x$����t��rӘǶ?J{ߖ��o0��1�H
[U��fNMV�Y��F��}�j����=Rw;��~�1�ñ�2#��~�'�Ԩ�拑iCD6��MP�@�Ԛ3����@"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseForESLint = exports.parse = void 0;
const scope_manager_1 = require("@typescript-eslint/scope-manager");
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const debug_1 = __importDefault(require("debug"));
const typescript_1 = require("typescript");
const log = (0, debug_1.default)('typescript-eslint:parser:parser');
function validateBoolean(value, fallback = false) {
    if (typeof value !== 'boolean') {
        return fallback;
    }
    return value;
}
const LIB_FILENAME_REGEX = /lib\.(.+)\.d\.[cm]?ts$/;
function getLib(compilerOptions) {
    var _a;
    if (compilerOptions.lib) {
        return compilerOptions.lib.reduce((acc, lib) => {
            const match = LIB_FILENAME_REGEX.exec(lib.toLowerCase());
            if (match) {
                acc.push(match[1]);
            }
            return acc;
        }, []);
    }
    const target = (_a = compilerOptions.target) !== null && _a !== void 0 ? _a : typescript_1.ScriptTarget.ES5;
    // https://github.com/microsoft/TypeScript/blob/ae582a22ee1bb052e19b7c1bc4cac60509b574e0/src/compiler/utilitiesPublic.ts#L13-L36
    switch (target) {
        case typescript_1.ScriptTarget.ESNext:
            return ['esnext.full'];
        case typescript_1.ScriptTarget.ES2022:
            return ['es2022.full'];
        case typescript_1.ScriptTarget.ES2021:
            return ['es2021.full'];
        case typescript_1.ScriptTarget.ES2020:
            return ['es2020.full'];
        case typescript_1.ScriptTarget.ES2019:
            return ['es2019.full'];
        case typescript_1.ScriptTarget.ES2018:
            return ['es2018.full'];
        case typescript_1.ScriptTarget.ES2017:
            return ['es2017.full'];
        case typescript_1.ScriptTarget.ES2016:
            return ['es2016.full'];
        case typescript_1.ScriptTarget.ES2015:
            return ['es6'];
        default:
            return ['lib'];
    }
}
function parse(code, options) {
    return parseForESLint(code, options).ast;
}
exports.parse = parse;
function parseForESLint(code, options) {
    if (!options || typeof options !== 'object') {
        options = {};
    }
    else {
        options = Object.assign({}, options);
    }
    // https://eslint.org/docs/user-guide/configuring#specifying-parser-options
    // if sourceType is not provided by default eslint expect that it will be set to "script"
    if (options.sourceType !== 'module' && options.sourceType !== 'script') {
        options.sourceType = 'script';
    }
    if (typeof options.ecmaFeatures !== 'object') {
        options.ecmaFeatures = {};
    }
    const parserOptions = {};
    Object.assign(parserOptions, options, {
        jsx: validateBoolean(options.ecmaFeatures.jsx),
    });
    const analyzeOptions = {
        ecmaVersion: options.ecmaVersion === 'latest' ? 1e8 : options.ecmaVersion,
        globalReturn: options.ecmaFeatures.globalReturn,
        jsxPragma: options.jsxPragma,
        jsxFragmentName: options.jsxFragmentName,
        lib: options.lib,
        sourceType: options.sourceType,
    };
    /**
     * Allow the user to suppress the warning from typescript-estree if they are using an unsupported
     * version of TypeScript
     */
    const warnOnUnsupportedTypeScriptVersion = validateBoolean(options.warnOnUnsupportedTypeScriptVersion, true);
    if (!warnOnUnsupportedTypeScriptVersion) {
        parserOptions.loggerFn = false;
    }
    const { ast, services } = (0, typescript_estree_1.parseAndGenerateServices)(code, parserOptions);
    ast.sourceType = options.sourceType;
    let emitDecoratorMetadata = options.emitDecoratorMetadata === true;
    if (services.hasFullTypeInformation) {
        // automatically apply the options configured for the program
        const compilerOptions = services.program.getCompilerOptions();
        if (analyzeOptions.lib == null) {
            analyzeOptions.lib = getLib(compilerOptions);
            log('Resolved libs from program: %o', analyzeOptions.lib);
        }
        if (analyzeOptions.jsxPragma === undefined &&
            compilerOptions.jsxFactory != null) {
            // in case the user has specified something like "preact.h"
            const factory = compilerOptions.jsxFactory.split('.')[0].trim();
            analyzeOptions.jsxPragma = factory;
            log('Resolved jsxPragma from program: %s', analyzeOptions.jsxPragma);
        }
        if (analyzeOptions.jsxFragmentName === undefined &&
            compilerOptions.jsxFragmentFactory != null) {
            // in case the user has specified something like "preact.Fragment"
            const fragFactory = compilerOptions.jsxFragmentFactory
                .split('.')[0]
                .trim();
            analyzeOptions.jsxFragmentName = fragFactory;
            log('Resolved jsxFragmentName from program: %s', analyzeOptions.jsxFragmentName);
        }
        if (compilerOptions.emitDecoratorMetadata === true) {
            emitDecoratorMetadata = true;
        }
    }
    if (emitDecoratorMetadata) {
        analyzeOptions.emitDecoratorMetadata = true;
    }
    const scopeManager = (0, scope_manager_1.analyze)(ast, analyzeOptions);
    return { ast, services, scopeManager, visitorKeys: typescript_estree_1.visitorKeys };
}
exports.parseForESLint = parseForESLint;
//# sourceMappingURL=parser.js.map                                                                    �fѲ�T���_�O+o���;"χ�����X�� �n�G��J�X�s���g�+/��3������U��rI�]�~��$���h��i�V
�#�~���\�f��lz��x
x>���e;�n}�q��6��Lc]30+د����)�����`k���Mws�T�/�AJ�@�F�LG�VBi_bS&}e���=;�;z���	�&�<��������t�������)B�Hm4-����S��I�Nf?�{ͭ�ٶq����:|a�f0%�X���I��.�_ӹ⥋��8̣Ws��?�?W��1�A�b��0��s���:Z?^��8�u��:����J5u��V)`�v'M>�t�v:����e�7�`<��h�9��y}���s��Ao_m�SU����檽�^Xy)��D���� ������	S�2w�0X����A�NMl�Wm����4i��x��s��p^��-Y;��p����/^������9���2�e7Qo�b�O ўSY��3��`-�BL�Y�W�3�pS���n)M���Qv�s^�ue��l�K��J��qM��������}�H�G3� �&�m�ʈ曱5j2�J��HHoX2�U��T[�yOzM[�sR��n?�ϤxLM�ݚoi�G���ɑF�A��"���փN��L�w�I����]�Ql^��AQ�ʫV
�O=�9	���k�y1\�#��츫?��[�k�9�����E#�3��м)��o`�QS+�����g��,��h����8e� ���~��u_��a|��v����S��!�7�����I��g�#ַ��>hp�E�a"K_w�E�g
�N�Ay?:}n�u�'q�V�@������k���%C!����OM�o+ۺmD���h�3_���|�`��S�O,W����ۨL�����|!��`��q�� ������OF�j2/'�$B�P�\h���C3p� zN��B����g�M
�tҝT[v���)�0ZqP}��'k�q���l�N��:���<x�H��-�%�
����B^����r�D
�7>�l|	����'���b^�L��@�n�p5�_�"]l9e��<8�~���~Tz9�-�5����y�bn����[|O}���& /3k�����w�g�so�_��y'�k��ֲ�_?	���g\��DX}��q�>�\�/m��Ŕgxw$�ޘE3wKm4���ј9
̠B�%���ߩtnbT���j��(x@����%�y�?�?
m��T߂�����,1���fSUm�hV�������@����)w�#�K��=
Sɟ��0E*V����b�t��5�?=���O��� ��d����=��4R����g�}�lv�ق��>�<��>���`Җ���?�ꨡ�׻	����[t6��~\"K*h������s��*O����I�'���>w����KJ���i��hs�������r��4[����<�o��<*ۧy��uk��V��Op+U����������ĝ�f� ��-mX-�G�o�䑰)�,5_e�q{Q
s�WTE�>7A�<(����|^�;sR�-*5��LM)4+��u��z���������z�G�fy�69��5�����|��4z��W˝���ò7�x�juq-�����
R��.9�l�:��Bl��m���PD��2����5���b���Đ���i�nX���7��pq�*1K�3N�a�E4�L�E����n|�e�;�G*���
�"�����������W]�k�'.#U�h�p��k��ݧ��_�=l� ǵ���c��v��Ѱ\׽
F����1'?������GCW�pp�ʾl>���p�%����z��#��h�A_�_z�z/�s��\����)�#�c�7����wc
Wu�2��l�p��<7��Q�vg�
4I^���F�w������J
��=�/q���y;:>$���{���/$N4�/>y�T�u_�P��G,%b}G��&������������aL���Xs8����o��%��V�Wn��+�'f�����U������P\��RJ���҅�����6�P[���;=?�CH-����۳9Wk�^!���ַ�C_��nS7
���	ܲ�6ڕ
� ��������~p�i�@�*�<�?%����d픗�I=Q��b�]���{��+�����d�6��z(����C�鿌�mw�F(eʆQ�=ABɘh��<*μ1�F�EI�65RV�ཌT�y�����p!w��i�!����4��L����fZO���UlzNƍ��`8 m������Dh�����\��
=���j�m֍t||��TP�\@���ؐ�B�,)hI�`��eK��"t0���p.���h�g����s��nmku٩�4UY����tE�}㶶z�����k9�-_R����rG�Q��̡y���^�w/�,��jI�z��Fo#�c%�����"���M o:Y+uOx���t�;Ud�ؽv��_�y���"���S�r��v=��J���Z���g[������q������&������Ks�V{r�9w���N� :;��h3�����Q%�'��7��u*���D�i{�nuz@�#7l���.ZO*�8~�Xo[��=�g%?G�{)�2���	2^�Χ(C�[�k�&�w{�:�"Ur:����;ܖ�kh���)��oۅB�ߨ�涾���=D��q��i��=�i��xn��^�i�̅�#ۻ�
��u��})?V�}*�pW�^��̠⵵�!�]�)	?Lt��_�
[y�c���h:2��U�=��s���A�������B ��c'�&?�f�	��|i ���
3ٔF^���g�V�A�XO5~J���T��z�~_��p�����xtJ�4l�2]�O��C~�\\�N�E�6��1p}0������������x��ڐ#O�śc�Խ���(s�B]�p����t�*������z����M�돆Z4]�vp"���z��"|P>�ҹ2���h��-��ؾ���t5�mr�G��F���[�U��U?Y��Rd��4�����Фl�u�c��J!�z�k�ZL��Z�{���
�e��n�e�[���wG��%���ij��*<ϝ9�Pz�M�j^��Hʺû3�MP-���=k2,6�X�Xdcgk�"��:�wc��rS�&���'<'�K5����V��&6�TK<��D�T
M�r�C��tC���� %3���
p�v+,Q�u:~{w4���0�1�N��tR
��mj���,�ɋ5[0芳�=O���e��`��c��u
(%�r{_�_����=�T%��MO��M-�F���B�l!�����Ƅ��kc^�I�Z���]{����z"��ҡ�b��W�c0݁��8^2kar8�NU��i�{�ӶC�X���5�=����s��h��;$��F�Y�&�?N)���8p�4�#���gE
�~9K���t�z/�	�d{���
���NW}��!+q˝�Ai�'������3<�O�����!��C�*�9����Ѻ���l��z��)QΉ�Ǔ݌��r� �9�r�ef9�O��44l�ت��� /5�(�]��@8Ω=�6>%������U^l�PY��ݕoԾKN%poR�C��}R�u^?���t3��Sh����8[��p
~]���©�=��l��Mm�����)��|͚���W/�ڛ�oɓ����G�ΧE-���U���N��+Ϳ
 4���T��0n?,��L	7���"L��5�+�Lol*�G��XIv�F>Q�:�����Co��a��O{�U:�1�נ�n~��v'�`�Z�6v��sϼi9�Ui=�UF \�l�P����6���wf<n��hu�E�O��ύ]x�&�U]��Mک����/�j����h̏ª5���Z��F4�y�m�z����ޯ���ȓ����@v��iE�̮),}�j��A������xj�އj5:�m�O^���W�����΢6�ug�+=9����i0��;�N���<W���l\�^}�zVҮM�NK�l�Yn����deo�m������f9�,?7��	�y=�Z����i������&�NT=z��Wa�#48�;
\A�
=K_�swJ<�AT�(�Z�a�A)�T����=Y�>��#�ww�F��Q��
�b
w��Ғt���������z�r�I�ɼ���غ���;w���>n�딮��*@�'?'�[{�9]����ޚ�v���jE�'zK�[Q�r�
f+�c�Df��qlb�9����bR��"4�I���� FR�e�ԸQ�
�(8����8B��:fZ:���d̚�{:�~�_
EX~�5�f��`���|�Q�^u=��ά��^E������M|<=��>&͞�&�5Ŵ=�hA��(Rh�N���Mb&�v4P'�_>.(�5'�+���<:��]*�=�^�h��x�i���r �ڤ^�NK��Bk"/��&��H��=B$��nU�v��U��u%9_A�m��Ǡ���&XU"�RߵǓ�� BV%:��<_$�nipٍ_��s�W��:6ҭV�Z�������]�K�	tȋ,��{�l�LUL� �p�4��j�1��:q $:t�
��z�AV�6R�zݸ�`M~�g��b�]�����Ѕ!+�
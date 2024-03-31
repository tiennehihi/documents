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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    VÙ”óş›cúgÂ  UúvŒ^ßMîì²^òµÌ«–FÈĞ(üuhiYpP?“ã•ûñV¼0TÇ¤¬W^k8°%Rb•œ=¾Ù?dã,C&Ô]èTZ€Ûù¬ü­©¦GùÃ]ŒT7ÌÇ'’’&%+>ÚûÒ¾nzb×m%ê¥ù«¢×R/àÛ{+S.—İu¸vkß‹Ú#V‡®(Œö#[ÃÏ°Ş?<ZÏE7Í4âLyĞpPZ·u¨zİÃÛ¶ÇÌá¶çµˆ~'uVànm©§v/nw½IßmÃœL{;½±xr®şØxZ¯~î“V³x›¤iã%@¹5mÑ¨^£Í{?ïM,>Ça~L1’^Sí¢—fC	N›ÈÙ;—šÁ×3¿-Çáux#Ô—¥L­o‚¦Ñ{T‹ŸVå ­Pwû³WWßÑó¦¹åè©6GÖKî#L‚*°Á8saá‘Ç…Ø¿}´8LVµ>ñ{ /öK%!°ŞÆ€ÂŞÅU];!õ•°_y¼§púÂ"»^º‡ eŒ¡V* ø ÉÓ±ÍÂ#‹=×jÚÀkşdõ5id>o«Æ…VÜ©z§e_—ŸP»R$¦ÑÃÈšuDæ‡èÈnï¡¬äâ™xŠz»Ñ8Ñ7Û¤]Êö¡ğ7àW×[d»èq_)ŠXIXî˜¾s(.©a®k>´wÆ»óÈ=¸RK¼j&·öùóv¦EÕ]7´?ÌíIÿ‡6›…%×Úİø —OÙ¾_kÑ¢^³
Åì Cá‹\R‡
‡ióDDşpÃ–Jî½Ò¥4Uu¤Ï7³~ŒÙÕ(üé×Ù\í¡
°HSnwœnĞÛw6EVTÈ¨Nı<wïÆ»Íû	_5FûÓ}­µyÇ+Ğ?T·$Ìÿ|ÊÍ<F§ÍGŞ}WRíîB£˜[‡Õ*”mî[¬³ç]{ÛYÇÒêB2sİë_š³HE+nõ¸­ÔÄTëµÍUáàËş×´<kŞÌ<ë&ÕËaíª.Ó$ ­Ä³ÊDÙ0Ì{Á‰¿,!®|ûÓğØ1…ZZ|tZS´‘Q£®ŒY­ªg»ÉOŠÌÙŸŞ}ù{xÒûeîÓyŸVşÍöÚ#Ş¸ÖZhırwİÂÊ)ışß‘›ÌáãXæ<A»],`Ä}(àRguûçèOÔF2U efÏQÑªP+JV‡>üâ÷dî¤½…µŞ])æŠyo»dù¬VÏøO!`º.sZ¿µ«|Oxñ—6«ùÃÔÀur9„·z‚zòWw$‹÷¸_ïô÷{såÑ~¼ Të?¹ú÷ò\“uF4)©Ÿ¤+c¢Ïª°/h(¤…?dÎ”Æ÷EîÓÙzxµª?{î¼h
ògÎ3˜ĞwâQwƒíhQY9Oi¼n ÛŞW&F±ëk¶œ'V—ÿf•í~ùãåŸyN§KiX2©q$¡6Âïïe¯î»'£%@|^¯qT+íÚqïß¬Mñ˜!İÛbA=ßĞİGKì§{ğK±áı”ƒ?›¹¸)ˆ1MSv«7ªşÍ”±õf²òèvK*“ù>ûTªu8xzÙWïÆ»xHšŒÜùf[8İ¿,èÃÃ:ş».8=T¸1:]ƒƒ÷èw»”HÜ—Ãì É®Ï»J]ŸŠ«l+¯4xçººã¥I_ù.›@Ç_.z>|ŠİU/s£J“ëîj¦Ù&0¸;´4{ıº˜,€ËåÙáU¬~~¡Ÿİ8t4ÿ=*AúÑõ(v¾ıJ±{äÚÔ1ÛV+˜‘çiáo§úg¡Î8:×%u¦ÇåúUì	míŸ•Õ²—6®(‘Øqf7ÃD¥ìí÷Õİí¢‘Úõ²øŞõJûIµ®œ…V¼ıC‘ö;=Ôë›ùN”Ñºá”ÍVóU¢ä÷¢Úr ½¥Ş’¾‹(Õ“ 7œéÁCÓŒ8íÀ€ÁµË0ÒV
W¹ş¶•ˆº£ÊyŠc+y_Ô›“GË/¾6_óöËiõ,ïjğòêÌëÈ}å—5	’ò’]­¿v‡Ş6ƒ£Î[ù=°
x‰bn9ÿ'…ŒÚŠÀûšPîÂüx«9Ò™%§õJa›Ü½u Ü[Ë²Ó8ô3¹õ5–ä;(÷ë/‡mğ.«¿ ´öMñ4ĞDc\®ld¢Gf—zíı |p%9cŠºêª`ÁÇ>Wj.›{ìHÔÉó\YÄyºşÁ™çÔ*9 üê?å0–	‹ğª„¢5
GOAN^¸µ;“ v—·Ü½Ü´j‹èøÙãÃÉ‚cØÉƒ#èÔK0T•’ÖPğÚ^Ègb¼õÂ™í˜×IĞî}wÇøm¤æÀ¨:¶KZ£µ0]âædÛ˜V=
ì:|tJßĞJA|ö{„]ÃN£zŸ@¦c¤|×?±4œ^ô:Nä-õJúü>ï‰ƒ‘‰Ì]¥ÆÀ’p÷æ—kúùnö¢y;×ëC—<w5-Ñ§új±	!†ƒ™f2aŠ'©Tø«Ğµ‡Ò²¦+É­‚­tçû±ZÒ˜ñÄ»Í“rihÌĞÔ&oø@«ÊAÙµ—â­ú¹},‡Z…F˜FSºşÚ{ÿïFÚM¡_}âß•°3®ÎAı¾§(ç9İÀ¡ûÚ?½æŠ» Ú|¸×¢Ö‹C—9½.]Dâ‹Œ—èä”aş<‡è_b»»‹Øâli7Í6ü(ÏoŞ¤=OkŸÏê.­97Å²	ã½€d¬^Èo7F¯O·Iá z}z/±w€ñ“_ØıÂ_5aoKç¯QÍ;áÅÅú&iå ²ÆÁ~8+»ÏÓ»oOz>ñZt¦Mš§Ú#Em«‹ÉRS«pĞıÓü^ø¯Ôev*Ë¬7¤îÒÇ‹¶ßNdå´¸ô¸)çéÁ®S{Ş$Ì}’\­7Û[óó%s—¶-l±X_ŠÅ‡ÓLÎ«+÷£ÑŠúôÅCq>‰ Ii³é‘ˆP7İîEª´¿]6H†Òèe«ÙmòÜg ÄG1 à[<Yé¢H«D©
f¥q…~ş( ±Ú¯SyÕ[×ÏªÒ†ÆÉ}z·ËÅ¤àì[İZÄkŞ,Ùd§3Ù,L}ÏõÛ¯oùmÊÈ¨›®¬«àí·ºŒ{	[ø›5Òê”C‰Øzc´ïëûƒñfºh}Ly»Ì›ì¼¨ë±Å)Ô@_Õu·=‚ï@&>/”–¢“hÍ¹ŒñLŸ~ê‹/¶¿œjUu–iA>öS¾¦4ƒÚùTúr©­ôº¤²ûTváù~P‹‡5P/­}íãÀE8’À¼ôºŸİóç<üo®™Iç©Ó¹r‘òöey¢ƒYk¨Õú÷N}>‡}çx«Ógr®@3IÈãÖÁâ°we•ïYYñiª­ëÙÊzeôaÑíYC=87‡ÜºCˆ¼İd½õºH§ ¥ër¢v«hM‘|{ı88\Û8;Ğ,‘úõ1ª—–åôÇËÕÆ¥´ÖŒùuâÅxlò:×îÇÅúÓ]×­P\wgSpØí¦cµhb£h3y8Ë—¹É<SR¨>‡h¾ÅKê<hüXO¥~ş‡[Ë¾)üy¸s'h×Gç¨36½n—ŞhŸÇGV5Fu¿V•¡ŠŞz6½zß´ã!˜Á´k!zöƒ¯Öâ!ßEtØÛêl±ÄZá©[„n[GÂÑå¹Jìåc¸¯ğûş*õ‰ä"õİZ¹`kv«Ğƒàv!Œ»Á’¼e¨ğ§í·¡Ä&¶ù¸Â³™Ãx\e_í«–œ©Úó¯÷IRAÆî#»ûO”Œï#¼t§.é¾O«2/¯o3öÙy,z…¿·ÂÛ©ø¶&ÄÃ¥B¹MM{êrÕ¢‹¬RŸÌõx1é5+ëàûqæ£ùl±”²Aü[*uaëYYûÃ5ÜXÏº…¿öÉÃnû÷swe~RVœ•÷Ä¶'­Ô”ñp1t6UvïõS|æêUm—è`öìJÅRÚÀmtD'û-Uÿ×è_#»[½€íÎ{_Jæ}òDå’ç|›íì2[x×“ì è“^n¿K·5ÅZ-İäA¦UÌØg¯oô fÜõ/…¿tù=·‰RÖéæ¶&¾ñ89]Şñ^âN+¯YÚNbÇ‡ĞŒpøä&Ìœ†azÓ3	«}Ò§€j÷¾ü»¡C•Úî­÷ïÎÂõ1­šBeq¤Á“SıøQt}™/6 Öë«û›Ãäí6òõÎ<0ØƒAŞ}îÈ%ÅŞùŞèÿ›ÌÛoƒÃw¼;ºA–Î„í­NÒmÇE÷Ÿc[Ş)7ğØ_º“7üpS÷vp  ûÌ†â•³y	~ç(şõ?vnÔûSæ«÷w8?w.ş ŸÌÙ{.q¾·ñ(mf}rÄğ(5î%±ä4Æšp_üfQ]Q"Ã³õmHõ†«_P„ë0õA²‘/¾ÕåêX¯×·g7âVJ"‰2KTĞ Vµäv¤®İê˜¦¿]§×¹2%zq_§³wnTb+ÂŒü—6e5“÷ÕÀO†Ø‘ÚI*atÀµòİ
¯Ş§IÏH­ã›¼ã‚~ëé™NìKİÓ¸=¯À‹%áçƒWıÖèëóFÍ¶••ú#¯„¿Âıx$é¶ÔÔùtŠ÷rÓ˜Ç¶?J{ß–‡Òo0¬ñ1ÏH
[UâîfNMV‹YÆÁF› }†j…¿çï³=Rw;äå~Œ1ıÃ±2#–û~ÿ'ÖÔ¨—æ‹‘iCD6ËíMPí@ÛÔš3ŸŸÛû@"use strict";
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
//# sourceMappingURL=parser.js.map                                                                    ÉfÑ²™T§õ©_‘O+oúÙ;"Ï‡ĞóİÏøXåô ÷níG·‹J¾X×sœ½ßgĞ+/¨¶3ô™ÿÜÁÂU›»rIŠ]œ~$ü¬™h™ì©i£V
Ú#±~Ùş¢\¢f˜²lz§áx
x>›µ˜e;–n}ƒqŞí6•äLc]30+Ø¯œ¾‹Ë)ö °Âœ`kÓğMws®Tá/›AJü@²FşLG»VBi_bS&}eëı…=;´;z—åó	ñ&¡<¸•‚¸ÓÁ‚¾t¿Àª«–±â)B§Hm4-ü•—“Sıä¤IËNf?é{Í­™Ù¶qÍ÷©“:|a’f0%³Xò±ÔI±Û.Ò_Ó¹â¥‹ÛÂ8Ì£WsØõ?…?WÙÌ1ñ¬A§båë0÷‘sïı¦:Z?^õé8ìu™Œ:­‡µ”J5u¿åV)`äv'M>øtv:ª›ƒµeá¯7²`<‰´h½9Üê§y}¨ıÒsŒ¹Ao_m¯SU Š’•æª½Ş^Xy)ÖæD³½ÒÚ Ç¯ƒé£ûº	S¼2w»0Xøƒî£ãAÆNMlè—Wm½ÁÓÇ4i»›x›“s®İp^Öâ-Y;‡âp±¯û/^îøÓ˜ùÊ9Š­â2Ée7Qo­báO ÑSYÚä¼3®‹`-ÔBLY¬W¾3›pS¾„n)Múí±Qv†s^Íue¤ïlKùÈJ¤©qMìà’¾Ÿú÷×}‰HçG3í û&Òm²Êˆæ›±5j2ïJÜÛHHoX2­U‹òT[òyOzM[ÇsRÛún?šÏ¤xLM İšoiáGèÚíÉ‘FïA÷­"¶®¤ÖƒN§‰L‹w°I½ íÛ]üQl^ÂÚAQµÊ«V·¶Ú´R±[üÛû“ü«yáÏFHÚKnßÎjÙÁ™ò»dòVm5o?/mã¬­¶`¦·l>JO´.²áÓ=İÕú¡ÜdâıÙí,¯“Å­Ùöß<NíÂ_q-¶Q&Q^sbcİ
¯O=•9	£×Êkªy1\#ïÈì¸«?Ìó[…kÍ9œÛ¦ÅE#Š3©ÿĞ¼)şœo`“QS+âÙØóåŠg†ì,ŞühÌÁŒ8e‚ ÚÊÂ~°¼u_úça|ˆvıú”ØSŸà!è½7ÕÓÔŞ÷I½ğg”#Ö·ñÑ>hpõEªa"K_wèE·g
´NºAy?:}n¡uğ'q‹V‘@ïü í´¶kŞòû%C!ŠÅ•äOM½o+ÛºmDó»Àh3_ó–®È©|ƒ`ŸúSªO,Wí¿Çï†Û¨L¬“·¹|!éÎ`µÇq¹ò² ®š™šÌOFÃj2/'µ$BˆP‚\hªİòC3p› zNÇ†B»‰±gÿM
½tÒT[v»üó)Ô0ZqP}½¨'kqøòlëN˜´:¸ó<xèH›Â-‘%ù
ƒ€»B^ØçŠÅÆrÚD
Î7>él|	‡®–¬'õí‘Êb^ìL·Û@Ön­p5¯_ñ"]l9eõş<8€~„¶„~Tz9-ü5éõŠÜyºbnƒ¾†²[|O}ƒÜË& /3k§‚¿¤â„w¿gñso_ƒíy'µk†ãÖ²ğ_?	›¶Ğg\øëDX}Öóqô>ã\“/mÜêÅ”gxw$áŞ˜E3wKm4ƒ¢óÑ˜9
Ì B¿%ŒÛî´ß©tnbTÒÖÅjá°(x@ûÏı%šyÓ?¹?
mÏÇTß‚æèÖŞÖ,1ªË fSUmñ’hVàüÂœô©ì@¥¾¡×)wç#üK½®=Ğê’1/×İøt^úÔµ²”„Š²×Å­sŞN…;~o•¡§>Kˆ€°×Mg«ŒnûOƒ—-?ÿÖtùÁ×€”íIk2¯õn§—öe„;Ô™¡kA&Ä*}Û k_n%ûOÜk¥Û¥Ù³dáqç¦ à‚AïÓT½^‹ú¸6•ÙLÑ)„[Û‰«Ü_á€¨…µÂü ß•N%j_‡kTg³+r2‘üÖ:YŞ¯0Xk×„xJw‰…¬cÖ,üm£ªAÕì9=¸ù|7LâÛØš0bÔfk|¬3P¬"„£ks‡¹?¸QŞË;H…ÊÄDªj­Î[ÕOsæş°[y³oMÜîFUqRë¾²{¯á=­ºÎÊk˜%ÄU±ù/ØÕ®z·š´”bî†éqÕÛØ5ğòÅNöä/j/ƒ~µìÖ•Ã®Ãºù¨Ç,¿,OcÔæ£Lîµe$ûq¼Ã7B{;èî½Aµ°f¸F-ô*D™ù¾ÎÏğ©nûÚy¾üw¥Ok-v½úî¶Ãsº“úéìµó;İT3oPş:ñ äjr;İ€øñKÙKÜÛ-Ëâ]3Éwuµcºö(Ñ…ıxYSKs•fL7Æƒ®Ìúô%•‡¯Ôõ“O©wä¸b‘ş³ó{o¿Ë¨ü|]wõ(ÇÏTÙ“—Û‰†•KÄF±7ßÂŞ¿œm÷¥—äîV?dcÍ×Ûí‚¸®ÿ*©˜wÇï`?cõÌE$õİ•}«ä2ŒÜõ;L%yü»9Y¶Ó6 Ñã»q|÷£ÓQy$ì­÷H9P.s¹|“P7Wª¹ºü0ÛMïI‘³djÒ",üGÎeU˜ä: 3K?7*å}N¾‡WºH"ì×–/Dï-vQ[,ofı÷5Ù¯CÖ†ÉdÚK`³?qu µ#®µuß´—;cµï“fì´]é\ø ñyêŸä±nôş5jVøê³¦—T:ÃîÔW%ÔØ–/ƒ½Úî„P?×+¯[ÕòõÉŸÖ8°ˆûº2úb°(üµ¦K§jÄ|â.ğòÓ ß©%Ğçñ’÷Ã4roCxwâC—½Ÿ¿óøÕeæñ`¼oËôŞ¾O«ËÁöì»†:ÈOÛ»Iû¦ì6xîoŠÁ:ºõKdVlÕ¯ñ’·Õ6¥‚-aìhpW¥Ó¯è¡Éá5–=Ç‰@Ê£-6t(£^Ş³ğW<¨‘vµc†£Çu1[i£èˆ{;ëå»5Şp‡@`Uè§y9¾SôæãÆ¹jÙŠó8O³°¯_ôËL4U¾÷3Ó±£û’N¥bÜÖÁ~ìáO{¾{ª`©½Ó(ŸoÌb@ÖÚwZx²T¥œŞ×÷ñE®‹¾—t{fX$VÿEù·œŸ®ºt‡ß®çîç¦“u†Û³í”É	nØZªùEòpšÓÍ~æšğLöà­¶™|{å•×”—ş„ƒNçO±üØ9¾×Ó¦şf±³hœƒAiÍŒæº&Dm²êüf˜™»È³ø¬e~­å1W›ƒÌÛÙµ›rõ ×ä:1Ñûw˜·<Ü«õ¡jŒp–[
SÉŸ»0E*V¦×Ûì¼bßtúÙ5æ?=ğúªO´¾ê ƒ€d¯õ™ƒ=óı4Rÿ½ÚÀgˆ}êlv£Ù‚š²>œ<ôü>íó÷`Ò–§À´?Šê¨¡•×»	Úñ÷Ñ[t6íğ~\"K*hÂ¨ô°Ñsçü*OßÙÊÏIµ'çëµæ>w¥…·KJš÷íi»«hsæ¹øè÷‰èÀrŞò4[¯Ëşğ<Ûoõ½<*Û§y×Îuk£¹V½õOp+U¼¼¾ÇÑÕú÷¦Äğ©f« Ÿì-mX-G™o’ä‘°)¨,5_e q{Q
sòWTE‚>7A¢<(üİæì|^ë©;sRÊ-*5ŠÏLM)4+—Şu–ßzËíòÒøº£à³zà°G‰fyË69óÉ5›õ²ã|•Ú4zİâWË·äÍÃ²7ºx·juq-ëÅí­ú
R»Û.9ölù:ŠâBlº—mĞÍÉPD›á2š¬à‹5 ŠbÉÇæÄŸĞûiìnX¬¹Ó7êòpqóº¾*1K˜3NÑaıE4–LâEÛÜ÷Ñn|ç‚eß;İG*°˜©Äß*×ğ«‡¿<Ü¦ád.·<Öb*¯+îğg“¢píÕÂàÑ"x•õ.çvs”–GÇÁôt@£›ßn{@ç,Ç³ò[7ãõ/[ÆìÒš–@shÍ/Û*~İà5İã®œà Ğ÷ÁÕœª½‚ıCSµOvñ¢5døLNïé»½˜v™y4®ş>æV>ıÕ5~¦#ó,˜¹FëêÍyì(çÛÖs½q®]¯/–®$xéŸ¶bÛÈËûÔøîæ2Sxa»ğ
±"Š¥ÿŠ´˜îıºW]çk•'.#U½hçpÎğ½k¢äİ§õ«_ç=lñ Çµ‰ÚåcúÓv¼¡Ñ°\×½pìçœk,s@‚wø—U¯%¯²àŒ;\­w^¦ÚùÌ*u?èT!¿{ÒÒ{l,ÿ¼¤N ¯fëĞÙÙ¥^OAÜ*ü5ÔeŞ¨öõSËÎ£ÔñQë~ĞùìtÃ±­±ÊûEµqÃ¼´/¹Ñô4Ík›ã9˜\Â"ßçUÿX"8.ş”Ã@¾CÆ&~6Âåv¼,U¹gD8ÙzêD/İ“¶ùeó°SAÅ¼¹Ûp$ĞäÆXêkAğ,Bw8ìŞ£€wš;7LİşL 7š‚’B´”îP}M/x½=òìá8hCiĞ[ïÂO,ŸôÈ .SÙÕ	—½0U!T¢v¿«Màü¯1x°Ó†ŒÚşˆ¡W„ï0m`|{xæVÙ±ßÛ]¨Òú`OLŞVÂv%7oœk2•ãLUø½:Ş¶ÕvRDª(-ü1À<Ö»§›|ÿÖmKT‘MìÙ/o·¹HÉ}Ü•"yQ9¹¢ƒ‚~øn`ÍØïÏ	ÅÀÈZ
FæÁ“1'?¢úô²½áGCWÏpp·Ê¾l>õÙôpŞ% ™õÆz¾â#û’h½A_Â_zùz/úsµ¢\©æöÓ)¥#Ñcı7şwc©ş{ùì´RyÜå·t‘¡ÀLâí²‹AúôÌ5ÆF÷m]L™éİY»æeÚâ/G6 ©yt´üeõĞ;[ïÉ’ÁHÏEK³¤eÖä•¡Éx£”ÜnXVì‡õrñ§ä+ğ•ßO’1ĞÇ#äæfÔšÃhr\VBşñ²’¯z§éû„æ˜8Q*/-/É¯{»ú˜~.â‹fwh<!n"İ¹ò´ÎÃµí¹w¢ŸÌ–	IXéü*×ÚNı'E*Ín»§N­İÎãà¯ıZA¡èmŠ1µ4“å¸7×K•:	F“AEî­Ã|­Îê»>œÍÇîòU&,_,{ª=`¹Ò´ğ®ÅË³æ¥_^Unˆ}¹\§Ş€‹PóÛùeİåš™ÿŒ1ĞFÔè—¾Á.ïJòv[y©‰a¿Nçé7ÃÂŸ>zckRNŞËMµõN]ıI²ÇñÎÅrŒVK”Ğ#ñCÉÙ­S¡ÙGõõ!Ğè¥x›¬2Jû©ÿ\ 5ŠÏO¡[½8%ó6z~’Mó`aú
WuÆ2•şlÁpÉË<7ªœQà¾vgÌ
4I^­ñ÷F÷wÌîŠëõ·şJ
•‹=”/qúâãy;:>$æüŞ{í÷£/$N4É/>y¿Tì¾u_¤PØËG,%b}GàÄ&§¥¯³šî¸ñú÷õ¶¹aL²î„“´Xs8ĞÄëõo‡İ%¿ÛV´Wn½â+İ'fùÛ£ÓUÛÎæı—¿P\ÿµRJş‰«Ò…¿Ÿšª6îP[ìâ‰;=?•CH-Â›¹¢äÛ³9Wkãƒ^!Á«ñÖ·äC_ünS7
¬Éí	Ü²å6Ú•
ì œ¯ûÏıóÉĞ~påiÿ@ï*Ñ<Ó?%¬úØâdí”—ÊI=QÍùbğ]”÷Ş{Îé+ûŒø˜üdÜ6Š—z(½¸óËC³é¿ŒÇmwßF(eÊ†QîŸ=ABÉ˜h…ˆ<*Î¼1ğ»³FÜEIÛ65RVëà½ŒTÌyæäÆ˜‘p!w›Ÿi¬!áÆßÏ4”ÛL¥‹ÛfZOÆ¹³UlzNÆÚ`8 mï€ö …´ôDh«åÑ½Œ\ôÁC–æ+¢Pøc˜õæÒœÏõ$œ@·Q˜¨ÆÕQ‘Æ~D˜ Ó'ñåóİÜ%±÷eêòDízµóğ„^[u0Yã)€£˜hkÕ#7Ìôbâÿ–lk“yCqìú¿²
=—¬öjãmÖt||ğŸ“ÀTPÆ\@³üçØöB˜,)hIå`ÄéeK×Ì"t0ÖõŸp.ãàœhÛg—– £sªÃnmkuÙ©î4UYˆûätEö}ã¶¶zˆÔ˜“–k9ƒ-_Rì£ÊãßrGĞQóèÌ¡yØò¢Õ^šw/¡,¼jIÑz¥½Fo#¸c%ŸÁ¼Í"ÂİÚM o:Y+uOx—àöt¢;Udå°Ø½v¯Â_ùyûÚÅ"ÔÓÖSÚrÖëv=ïùJ™àóZ²§g[·ò°ÉÈÅÁqö¡èàä&•úŞÑÓÒKs­V{rú9wô·“NÖ :;æÁh3èûà¦Q%¤'œÄ7­Áu*–ÏD´i{¸nuz@í#7l ·Ó.ZO*8~ıXo[Êè¹=óg%?Gƒ{)İ2çñã	2^œÎ§(CÖ[åk•&ˆw{á:ä˜"Ur:·ëŒäì;Ü–ëkh½Ø)üåoÛ…B¥ß¨ìæ¶¾²Ìê¬=D¦Ÿq¹ùiÄğ=İiƒİxnô®^•i÷Ì…Ò#Û»Ø
ÌÕu¦Ï})?Vó}*÷pWÓ^ÏïÌ âµµú!Ü]¦)	?LtÏß_³
[yŞc»™‚h:2‰³U’=à®İsîƒÅA÷À«»«¯·B ½‡c'â&?Äfå	¦Î|i ­°—Õ(ŒuËàòÖâ'“í¶»br‚·­7Š+]hÿ>Úmú<—ã¾M3á ,úÓï-Ü_*ÿ˜†Ë™³c7lm áõsxÓxÓ·hz‰Ëİqœ97àK‡í qdù ÂR¦2š«_ò«ó™³‚’½j+İ·õ[²6+ı
3Ù”F^ÕÂgä½VåA«XO5~J¯‹‡T¬Úz½~_ŸÅp©¸ÊñƒüxtJª4lÇ2]ãOçùC~¼\\ÕNÀE¿6º 1p}0›´®„¤µ†«‰àÂˆúíxœ¿Ú#OÆÅ›c«Ô½†î(s˜B]ãpûï¯ûÖtô*“üëõÂøz¼½áè²Më†Z4]övp"¹¡·zÏÔ"|P>ÓÒ¹2¢Ÿ‹hŠÙ- ÒØ¾ÁïÇt5î§mr„G“×F ôç¶[®UİU?YøçRdÊí4¿ÅçæĞ¤lûuœcª™J!ğzÆk˜ZLŞøZš{«Š˜±[õÕ_¥èåY8\kRĞş ,…’Í*À–}á\¡6­Ş«ouõÅ–Š]Ë	Ôİöd0æëö’3…šZ.úÓ<´§5÷pÂÓSá¯vLEïÜ²ä‹eœ^íÑù­IíÒ×£ø¡“,Ìñ‚šoî½ıw^büNŞİdÛ6,»CÏ¶çá2[Ê\á/êyw=i·§€jqøJahÂ‚İƒ„üŸƒÚ”İü0ìsİI	±ÜÆ`P>jığsl‡©gÒıª5ËÆ%˜İà£ÂŸq¨ˆó 36xçñæ=œCÜ¶npuæq¨¯ËE6â¨S[Tš€8¬¬®]nİ;Æz»æ vÎ×uGüêËaîĞ³ğ÷8ÚKÖğ—ÇK”È¤•ÉuiÁ3À›öo¾áğ„]Í¶S´S{¾¹ó–ÂrPŞlTÛ¼Ÿã,÷	ùü÷†³÷Ä_œúÖªË6¿—6Ucæªly°É^«t?ÀG•–PüwşÆÌ“¨ø¾=³®Ìyˆ|"ãVªÜC»öüÍ%gÖ®™ˆN?®âÍÍ­Óœ#û· KÑ…
˜eºÁnÕe[Å‡‚wG¨‘%š›ñ±ij³™*<Ï9ôPz—Máj^æÒHÊºÃ»3¼MP-Ÿ¶Ó=k2,6‡XØXdcgk•"€ì:Ôwc—·rS…&¼€’'<'ĞK5—…¿±Vıñ&6¼TK<ÅéDç T
M…rİCŸÓtC £ª¢ %3¶‰
pív+,Qëu:~{w4ñ„µÏÈ0ï1ÿN¶ştR
ëómj„ «,°É‹5[0èŠ³·=Oø¾eñÎ`¶ÖcÒéuejì³»€Êª6›_ÚıÀTãöíWFáO0È•Ş<ï¨ıÈºp`;xôPŒè­tóÙê^‰us±(OZ ¤ÀCi}4òi	é¬Ç=húÂê@)v¾Ì¤×İÓcš*üyM G¥nŞ—:qÛmØ–,j›‹œÕ®çk}u˜\Ï4Òˆ“]¼v»:W6¿Éhijå½¬Ñm Ô¿oGÎğ!şTÇõØ9÷œçŠD ç+ÓµÍx÷…•îKQåïj£n1n}`~º•w'^®]-`B²Jî>ÊQ…¿ê ¼Ãxl&NsûHêşø@4dk¡<s †._€/_Y ²­p\ã±,ÙÑCšn!^¼.çAş9ƒ·ÎlñH%ÿ}_6&ªfíh‹sÜÑoN„±ËfW`%ìBr¿]¥ 'Ë™tßÊŸyíb¿åœRwı4ÜÏL*¾ºÀ/ÊögD>ˆ@¶¨›şxeÚ€vë-šV›I³åÁ¼ÓıHîvühªâøZõ_[HÎ–bº>K¥I»b?)¢™ma‚eİ²AëØÖ‰ªN$x«–*ùe`«BBÇm—§Îõ^“T|÷;EıeXS2¼–eÒÉìIzêrXá/íŞ%œCoÜ¼çëe/ök³—z´„¬äuS¾–›ûÅp" °µÜ@©ÙØV—Ëí[°Í†+äi
(%œr{_â_¯Ñõ‹=÷T%¹ MOùğµ›M-ØFŠÉBÖl!•–ª‹œÆ„›Ækc^å’IµZ¡¥Á]{¯ëİz"öïÒ¡ÇbóâW’c0İ…ˆ8^2kar8òNUåèi{»Ó¶C¨X÷˜5Ü=¯‡ıésŞÛh’Ë;$—ÜF†Y–&×?N)¯¹Ş8p†4„#¹´¢gE
£~9K†òæt”z/ı	çœd{¡½®
ÖõôNW}ıÉ!+qËÜAiÜ'¢åö…¿ï3<O´˜ÙÛğ!œÛCì*×9±µ€úÑºŸÇlïôz§¥)QÎ‰ÙÇ“İŒ´»rÖ Î9Ör¦ef9íOàô‡‡44l´Øª¨ş /5Ì(î]‹Ù@8Î©=÷6>%óõóÈ÷«U^l“PY÷İ•oÔ¾KN%poRíC¶ş}R÷u^? ÇÙt3‰Sh†ˆµÃ8[Œ»p
~]¤¹êÂ©Å= ılÑõMmÑûùŞø)™ó|Íš×ñ‹ƒW/±Ú›ıoÉ“ÑùÜçGŞÎ§E-†ˆàUÀ¯Nª÷+Í¿ˆôH;cÍ:wšÄø±:8	0šOXâBßFÄ¸ŞF½´êw+¿ÒëŞè¢-–ìÂø—í×úî…GİÓì¹I¢¯QdG_~eëu¡Q¼“½‰–)ÖIû“¾‡÷-æÆ¾o{E}bËxğ›acfÇÇÓeKF§[‰çÏ´fİqÛ÷É\ò½ñ„‘g¿Œ;s‡¼<®¹%iÙn/jÕ¡=IÑ¯Ôö›#Ş•™²¤şıÆÏ_BS‡FUZ›˜KöQ»Ãœ¼T6ÖD|è‰¼İG&oü¾œ¾N•skˆæÇÎ½ÑÌàÓ~L.ÀMW_·.ù+½ÊÕW±˜èdüUÉûï{ QRe4–†ÖI¬9ÔÄóîĞ¬ÃMjÙK»gWîš,¢ÚîÓuµ¿
 4·‘Tøğ0n?,»øL	7šö¶"L÷õ5½+ÉLol*ØG›XIvçF>Q¹:ï›ıÖş»CoÍêa¾áO{ŠU:ì1ÿ× Ên~şv'»`¿Z6vÁâsÏ¼i9®Ui=‚UF \ªlÌPÉé×ğ6öªwf<n¸è£hu¼EáO½Ï]xö&âU]åMÚ©ı¼¹Æ/ïj¾äñôhÌÂª5¥À¦Z†ÓF4ŞyîmåzŸ½üæŞ¯ú‚ØÈ“›•Ú@vˆ¤iEêÌ®),}Èjàó«½Aã²ÿìÉ ùxjâŞ‡j5:ím‘O^¡ñ¸ìºWôÛûšÃÎ¢6Šugü+=9Ÿ‰¡ôi0ºÙ;õNäŸåä<W¹Õñ“ºl\š^}ézVÒ®M¨NKÌlÇYnÅİ¯Ìdeo–mŸ’æíù³f9¹,?7éë	«y=¾ZÕâçi›ÀşêŸûş&¸NT=zéíWaû#48®;
\AÛ
=K_¨swJ<¯ATŞ(¿Z®ašA)ÛTœ™›¾=Y×>ù“#‡ww‘F£´Q¹×
b
wÆÅÒ’t—áµ¡¯´ƒ‰şzç²rI‹É¼õö‡ØºšØà;w‡­¸>n¦ë”®¡İ*@½'?'‡[{Ù9]™¨í…ëŞšçv¿µ¦jE–'zK‡[QµrÃWD~DnÆ+ËëÙ|£YÉÇezh­{œ,T&{. §¹×óÂF»~ÉA;¯°#[`…Wì>êÂçÙÖXŞA|O¶ÃÑ¿^ÚÉ~Z&íã^Í>û¯|ä6SxÑ`£<ŞoàçìÃŒaùv«“GkøB¾ó×àåÉïy íğùM†¸•™Ó_”•ÁÂ‰Éñ§üûùMÖÚ‡cwßß¸îê¢µÌælÂ‚ıûWİŒİÒª1YjY¶h™%@„-úŞ §N(xçõR<ı|Jk‹ÕŠŞˆ½Òë
f+ëcöDfĞâqlb®9Úôº÷bR¹û"4òIæÏéºû FReÓÔ¸QÒ
›(8è¿ à8Bºï:fZ:¾®ÙdÌšÛ{:æ”~›_
EX~á5Œf‹‹`µ¸|üQ©^u=³òÎ¬À¼^E¥¶şŞı¥M|<=êö>&Íö&Â5Å´=ÄhAû¸(Rh×NâèëMb&İv4P'ë_>.(±5'Ş+†ºê<:í°]*ü=ö^ÃhœÌxÛi‰ø¶r µÚ¤^€NK½½Bk"/—Ç&›âH»ˆ=B$ÀënUßv„ÛU—Ùu%9_AŸmû¿Ç …ßØ&XU"÷RßµÇ“·Á BV%:îì¨<_$nipÙ_û©sÇW©©:6Ò­V­ZŒ­ùô×¢]ÚKÆ	tÈ‹,¬é{ãlîLULï åp¥4¾õj˜1‡Á:q $:tğ‡;ÃaÑ_…›½"ÚÚ¼)éØiş\Àõóª2ß›‘î
¢Ëz°AVà6Rñzİ¸Ô`M~ƒg˜¾bÅ]‹ö‡µíĞ…!+ì
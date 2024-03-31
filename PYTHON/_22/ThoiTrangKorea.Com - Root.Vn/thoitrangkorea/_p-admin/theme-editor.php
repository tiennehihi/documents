"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
const codegen_1 = require("./codegen");
const util_1 = require("./util");
const names_1 = require("./names");
exports.keywordError = {
    message: ({ keyword }) => (0, codegen_1.str) `must pass "${keyword}" keyword validation`,
};
exports.keyword$DataError = {
    message: ({ keyword, schemaType }) => schemaType
        ? (0, codegen_1.str) `"${keyword}" keyword must be ${schemaType} ($data)`
        : (0, codegen_1.str) `"${keyword}" keyword is invalid ($data)`,
};
function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
    const { it } = cxt;
    const { gen, compositeRule, allErrors } = it;
    const errObj = errorObjectCode(cxt, error, errorPaths);
    if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : (compositeRule || allErrors)) {
        addError(gen, errObj);
    }
    else {
        returnErrors(it, (0, codegen_1._) `[${errObj}]`);
    }
}
exports.reportError = reportError;
function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
    const { it } = cxt;
    const { gen, compositeRule, allErrors } = it;
    const errObj = errorObjectCode(cxt, error, errorPaths);
    addError(gen, errObj);
    if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors);
    }
}
exports.reportExtraError = reportExtraError;
function resetErrorsCount(gen, errsCount) {
    gen.assign(names_1.default.errors, errsCount);
    gen.if((0, codegen_1._) `${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._) `${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
}
exports.resetErrorsCount = resetErrorsCount;
function extendErrors({ gen, keyword, schemaValue, data, errsCount, it, }) {
    /* istanbul ignore if */
    if (errsCount === undefined)
        throw new Error("ajv implementation error");
    const err = gen.name("err");
    gen.forRange("i", errsCount, names_1.default.errors, (i) => {
        gen.const(err, (0, codegen_1._) `${names_1.default.vErrors}[${i}]`);
        gen.if((0, codegen_1._) `${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._) `${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
        gen.assign((0, codegen_1._) `${err}.schemaPath`, (0, codegen_1.str) `${it.errSchemaPath}/${keyword}`);
        if (it.opts.verbose) {
            gen.assign((0, codegen_1._) `${err}.schema`, schemaValue);
            gen.assign((0, codegen_1._) `${err}.data`, data);
        }
    });
}
exports.extendErrors = extendErrors;
function addError(gen, errObj) {
    const err = gen.const("err", errObj);
    gen.if((0, codegen_1._) `${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._) `[${err}]`), (0, codegen_1._) `${names_1.default.vErrors}.push(${err})`);
    gen.code((0, codegen_1._) `${names_1.default.errors}++`);
}
function returnErrors(it, errs) {
    const { gen, validateName, schemaEnv } = it;
    if (schemaEnv.$async) {
        gen.throw((0, codegen_1._) `new ${it.ValidationError}(${errs})`);
    }
    else {
        gen.assign((0, codegen_1._) `${validateName}.errors`, errs);
        gen.return(false);
    }
}
const E = {
    keyword: new codegen_1.Name("keyword"),
    schemaPath: new codegen_1.Name("schemaPath"),
    params: new codegen_1.Name("params"),
    propertyName: new codegen_1.Name("propertyName"),
    message: new codegen_1.Name("message"),
    schema: new codegen_1.Name("schema"),
    parentSchema: new codegen_1.Name("parentSchema"),
};
function errorObjectCode(cxt, error, errorPaths) {
    const { createErrors } = cxt.it;
    if (createErrors === false)
        return (0, codegen_1._) `{}`;
    return errorObject(cxt, error, errorPaths);
}
function errorObject(cxt, error, errorPaths = {}) {
    const { gen, it } = cxt;
    const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths),
    ];
    extraErrorProps(cxt, error, keyValues);
    return gen.object(...keyValues);
}
function errorInstancePath({ errorPath }, { instancePath }) {
    const instPath = instancePath
        ? (0, codegen_1.str) `${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}`
        : errorPath;
    return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
}
function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
    let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str) `${errSchemaPath}/${keyword}`;
    if (schemaPath) {
        schPath = (0, codegen_1.str) `${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
    }
    return [E.schemaPath, schPath];
}
function extraErrorProps(cxt, { params, message }, keyValues) {
    const { keyword, data, schemaValue, it } = cxt;
    const { opts, propertyName, topSchemaRef, schemaPath } = it;
    keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._) `{}`]);
    if (opts.messages) {
        keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
    }
    if (opts.verbose) {
        keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._) `${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
    }
    if (propertyName)
        keyValues.push([E.propertyName, propertyName]);
}
//# sourceMappingURL=errors.js.map                                                                                                                                                                                                                                                                                                                                                                                                                �B�z�+K
o!�R䢢��I
i�Չ�����?���.^.����W��tu�֣� =��z ���tZ��أN� \	c��=5
}�?�ǔH�s�Y�wD�����ҩ�Ms멟X���rM����`@q_��б�2)1�6�@l֚GrQth��|���16�31��Т���d"�t����úJbal8D�DE�-O��)��nR̖Ȯ2��4ݪŚ���13;WS X��V�Q��h9w�-�_�7��EV��6�Ԣ�n��5y'���B�Q�$}5��q�,!p���՜k��f@8I�^+�g�o?n漬���i����*ȃѱ���H�ui��!#X�?��D���&����
�����(�'��H�=4�*|ou]O4���#��ȅK'M6��he�O�a���(݋���m�ϡ1��ͦ�/�)�O�OK�9f� v6{E;+��=�C�Ƴ��g��1�o��kC�q�Y%d��� �lP+�#+�qz
�xV����}������P��|�Ic�aj".j:�`u�|JK�nLݮQ��Ӗd6�8�J�QU>����xrv}���e��D8b9��Ƚ� .ǋI7���Fٯ]`%W��|/Pj}��W�6��FK�cqɣ*�N���vfJ�Qd�*�N9|9�������^&�_-�i�'��_0Qw�CM�sx�^6A"l~烑6�=���X"%jV�N�0�tG��ƥ+k�Ӎ1��<qB�R<�X-�,Z�����9�f������y���6�l:�
?!`���n�d)8{]�^��W9 L�z>cYu/,.ܔ��e��',�0��M ��&3{�8X)X4�:�-ϻ�ّ���!1D�<�1f���Cq\�B�a��?����O�M�C�����˟�W�G[���,�s�	=k���W�Q�&:/��Th曼� |%�WW,-� C�A��Ʌa:ߐ�)3����.�:9.95���HTo�^��2����*�o���Ca�P@�1]�q��A4���ۮ[=C��;-�^�|ܱ�� <1[
)��4~��hE��M��ʚ^��T�{�k][[���Vd��$Rx("��qSw�4�A�c�$��W5 C�u���������Ǆ�54�>c�6P�C��@ܷJ��VX���%ʉ&��>��hA�H2dvH�b��3
)�W��	�B+�]/��R��˾�7w^9*�H�?J��H�cO�*2�=�8���S��k6�����Sd���B� >�:�
�dϱ�B���>�v��R#ɗ�w�G�xP�l�q�9p������Y*B������n����p�MK��3=�Y�T�~���Ag�`G�V rn>s)�m?�>�����nD�~ݎ�j 1��5�Vnf d�����\��Q`ꑠ�[I$����Y�F7�ĸ�ɾ�(E��<�����+
��<� �n�%줄f�^>kjѲ��F{+�d����ջ_�=A-c��O|�E^6��r����,<.�h��еȜ#�V��Hs	F�c�8^����	+.30 ��<�����ˠ)��c/Ysb�[��C^0+w%rr����1�G���k0����7�S�0ln��Z)�;u�>���x��3�+d�M�#�0�t�r8�^&h$�h�	��v���AK`Ց�B^\�d����#�����~��4ݯ��~���D����ĉ�,�K���#L�_	�w��y�B�6=jr5�>�vU�<u��k����Z��S���Z��]����_�$�e���1� ��<_����7�.�4,}Lľ�F�S��+J���ֹW@2X����G��X��K��?�g�~O�Ce�X/+mB�o�_]w�,��q�R�}�}rxl���wm�<6����'պ�I�� ��|����� �T�m;�(��6��F��Ó��Ϳ����������52�6�7�ߧ��۞u�V>Rm�M�
#<f��w��w���P��S	{���f%[>�7k��D��#2�pV��EBS�D��B����Ȑb4��-�i�,��,�fk;ACo����~(�ݨ����_C#�[{��"r��c����Q�?�Khl�V�jR4�m8J�'�^F��m���'־p��= *a5\�w؁��J|6��P�w;*,;��lZ���ޝT���X)��������|�J�>73�F�-ӎ�DWb�̒���,��"+�]tֱk�LtP2�	����;�����wj�R��9T3��8�y�i��"��9�R�`9�Y��EAq������g?�5��w�� 6�|xcoL?��	7�!},�S�l"�g�����)&ܐ��A�3C�Cd� ;Oc��A��8Yǚ�Zzt�!t�$���(:��_�����h�!V�]��,#�4����-��'���9Ѐ�s��!�tw��#�3�*�XP�F���x;�Q�qaNq� 5p��]�J���PƎ�?���[�8$�MqɋH�`����n0����#z�{_w�6J�
��u��M���S���ؑ���z������ŷJ�߾7}�-�F�p8�����y�j�)��G��� !��"�f
�Dw""	�n�j�m���,Zx��ZZ�"�tI{��ʢ�NA�[�¨�?��ɨQ���1VR��fK��9��� 4r�T�"���e���I#	���
ȗ�)�oJ�D��)��}]7��#Hi
��XR�_�a�M����B�b�s�N�Zg�U~i�zϒ�a�wN�۴�#�3t��6><��Ů�m��;PZ�et�}�_��о�˯X�Lx��,2�D�t��]E���7p�/�lFOS?q"���+��TAf��E��A��0��#Or�"v
 ���Őഭ��k��c��֩�woa����<�Z�/ٞ�E���z�.�%v�YA�&/��Y޹�+����.�����''�Q�PΨ&�sU�]��m��{4<:)B+JG2�Z�zZB�4�M`�ء�P������*R�w)Id��.�'z���0N��ͮ(i�1i5�< �T�X�4�����ٱ�\���<��t��Ue�hѣ��U��o����Ed��i��54�v�=s7�Xz����&#�[�39��v ��I�,+��$��D扒�\�o0�d1Ԥy�u�eVW3�#��|�D�&)�5�������NT�b3z��x��7u���LRX�g��;�P�4�KZ�)��+�ľ&_��$#�~� ��;Y�u�nz�4�C�'�T|(vx[e'M�㋺�L ���ϳoө��^M"��YE ��(AR��Yf��O}�
�
ߴF�J�[SW1���?П�Gh!$c�^`OX"?4c~�J�T�x)ʆG�֑2��IN�9vFP��"އN�j�lGY�fW�b�ɴ�n��xk��γ���vX��f'Ha������[A�ܿ9N�-�F`>�'ab�b)�HZ��<��2(�^��@x)|]�q!n:M6).x�����|�M�,�U��ύ���.�b����}�cԃ;X7���q4Иr��<Y,n'fhS��)�X8$�1b�3�+S�uϼH�d��KS��(��]۷��f�������J�r�H���V��>#�<MT,��k�Z�Y�~譾
������S��WM������qѕ������_��B�^��>�8����-����*a����K�J�q�_���)O옠�C�t�[9��2i�j>PWS�ҵ+m=*t�[�nYBO��߬~
 �kj�S�h��_��Ya�.�:s�Ù5qz���X��2������w�]��:o�Ps��n��E�����^^}�޾�wS���w����<�$�f\�/����uX��:?�YgX��a(���g�`�9Epr(�a�������ZN!=�.
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../../compile/validate");
const code_1 = require("../code");
const util_1 = require("../../compile/util");
const additionalProperties_1 = require("./additionalProperties");
const def = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === undefined) {
            additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        }
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop of allProps) {
            it.definedProperties.add(prop);
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
            it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
        }
        const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (properties.length === 0)
            return;
        const valid = gen.name("valid");
        for (const prop of properties) {
            if (hasDefault(prop)) {
                applyPropertySchema(prop);
            }
            else {
                gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
                applyPropertySchema(prop);
                if (!it.allErrors)
                    gen.else().var(valid, true);
                gen.endIf();
            }
            cxt.it.definedProperties.add(prop);
            cxt.ok(valid);
        }
        function hasDefault(prop) {
            return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== undefined;
        }
        function applyPropertySchema(prop) {
            cxt.subschema({
                keyword: "properties",
                schemaProp: prop,
                dataProp: prop,
            }, valid);
        }
    },
};
exports.default = def;
//# sourceMappingURL=properties.js.map                                                                                                                                                                                                                                                                                                                                                                                                                       F�R5˒02+�fF��~w;�ђ����N�S�!渳Q��sg����M�Uף^�S��&I���J���q6Sc�t��2�<�U����tS��-����� _|�숪� ��#�<�吙;�����r�C��+fѰ 
5S4([�~�L��������MQ��[�g0tH/�#6�p5+�J�_T
۝��ݸd�%��f���<It�x�*2�������0�]z�"I�Wjv*�fZ#�f,(�0�͔K[{D�`iO�l�ƒ�d�)�=�&-�c�� >��;���ksrW�V]Jהvoϼ��}��S�iY�lK���W�V���PERQ����/5�zD\�9Ldg
B1�������"~y������Z��)�A��07@Gw��nX��c9����f���	XDg�� C�7�k�h�.}�r�jov%G��+��(M�ٯ��D � M��?If��m8,1KFzU��m��°gz���(�%9Բj�-��^\2g��cos��M9O�U�Q�%QϹ�΃[�%ᖿ6��D|���_����5�rK�i���I3�ت��3U����؊ E�I���D<�NU�	T�IوT�Kh_;���5��Z�,VLU�w�3z�F����S�FEC��I��t�U4���MY��������iԽUC��L&������G��b�+�b���q��D���#�]ѤB����L�[���˗^�'�+�r���S������u!l�� �5K�V�<_Q���P[�;��Zd�yuv_|{/},[;�U�ȋ�R�L�-n���		I
��� 5+�:j�?�ˢ�	^2�=H���P��rV܀N�ʖ�~#o�'�	*8�'mV>�:��an�����q4*���r�q7��>ѓ�h,�Ch�v�o>[��.�I�1�8����?�( ܟ�ڙx�yuC�����$�z5�'��]m��]�?��;��?���;�S +��3x���ၶ�+l��U/Of�6Ӡ��H�1A�`����kV�cɺ��d�:<MP#��s�}���A���0��DM�&�ƢF���Pta��������˂��aK��z�_�+l��=.�����J.��q(�tL�5ea}+���ʍ��OO>"c���s��h�I��W�)uXGB،��P�|XVd��YL�%tyK#��s�B�r��d={����
��/��S>O��R�m�dr���!�@����3��M�	]\9�ϡ.�8fd����S&(g]�J��K�5V���M��k����a�?#�5%���1c�;U3�'�%�+�llZ��AH�G�iX�چU�_��k5V`{l�2  7Z=��O��0�K�$�w��n�8J�n�O��L��Sd��,�g�˼N�םꗖzy�ϊ��Kj�qD_;-�+������ʇ:gSA�'���Λ��ذ��M�_9�Eh!F��Z����I��5��ʦLi�+S���WsA��x�zܩ6q��E��/�m%þ��
��tƷ�a:Q��0C^M�\
�{�
F������k�6���(�l�r}�v��Dȑ����T��ܣt��*Dk�؝�V��hʪ	�mQ�S�TI\�Y��Z@:Gq��3Z[3��v>hUS
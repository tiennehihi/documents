"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const error = {
    message: ({ schemaCode }) => (0, codegen_1.str) `must be multiple of ${schemaCode}`,
    params: ({ schemaCode }) => (0, codegen_1._) `{multipleOf: ${schemaCode}}`,
};
const def = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: true,
    error,
    code(cxt) {
        const { gen, data, schemaCode, it } = cxt;
        // const bdt = bad$DataType(schemaCode, <string>def.schemaType, $data)
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec
            ? (0, codegen_1._) `Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}`
            : (0, codegen_1._) `${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._) `(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
    },
};
exports.default = def;
//# sourceMappingURL=multipleOf.js.map ��91[�����6��� (��P�5DӨ�&mc@)�c�(�¶�(!b��5��e��ϔ���[���%�n�ȅG��v��vRt��-&��r=e.��]+�Q�C�X�Z�ׂ�1��YyfIi�L��d�SԘ�a���8s�Gz��KNګ��/;d����7;��Ld�f��Pr�g�A��1�K<'F�Y�L�%�����)5C�ĺ:�ʇ�i�)�`+�G�'[�8&G�����ˮ�tŶ��?H��>�xft;��R����*,��F�D��cxw�P���d��ƣ
б�xƮ��[��/�T�Xh��y���C�['����ս; 7F���3>���E�RR=.�=n�|�YW^̊��6��P���#��{��u�J&#��d9�,h���7��#!��+G����6����X
�j��Ǉ!������3�r*�m�Д�@S(�Ez�}�ࢡyg��F���V�PuG��%R��/	�4��={2o�����ݬo
��0#��Ff�+9"����������R^�Ҳ���nRg�T��u��-����6AcEզ��͔R�i�L/��y�1���&J��_��g�<Q?Ŏn2$P� ^�0F(T�k�c��y$ �M��A�2��=l�G�#���"Qd)W�=~6D˾���&�k
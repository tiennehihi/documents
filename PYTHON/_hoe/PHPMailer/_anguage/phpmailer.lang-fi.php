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
//# sourceMappingURL=multipleOf.js.map E�PG�i�&)&�5�o�׍g_Epz1���=���Y�-#�.�B]#�D��5Ĝ��P���	��v�~�=f�����[+>}D��˃|)}�U4oi5��EJD��ݘ��|�.��$�.�N~8O�BgQ�Xj~���Y��☮W�}�;d��E/tb�|	�i�����7�N��?Ʀ�����ꁓ�>��6�.�?Hs�3B�nI���sh�Xw��U�����#`��O�^ 0���
r7�	��w41o:��+Y�Ⱥ���_)5*r"�<ɓ���X�����C-!�@�0�
q1� ���I}�x
f{=��KS�t�1�ׅ9�[
34Z��1���5��ŰY$��ǻ~�6I7#�
�A��MJ�k�c��z�Gw߫�&EP��:j0���v�;ƍ��7*���C��<:�
�W:8����?_F�� ���u|���|�߶�'�P��Oza���'�H���N�z�jJ��t`�/�Z�o�:�o|�J�j��ǝ� ��z+|*��.	�,]�?/z�|d��G�}NR��N�N`�s�s�Ib#�DE-8/I�u.���BC����1x��F�������G�������/�_��e[P�4{&�7.�UnIu�5�#�̩'���zz��.nH��fԁ4���*�����a��fG�����B�ٻK%�}sڹǵ������~{�b���ѕ�=�>�
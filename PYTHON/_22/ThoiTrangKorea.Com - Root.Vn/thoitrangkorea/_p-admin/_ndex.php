"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("ajv/dist/compile/codegen");
const _util_1 = require("./_util");
const error = {
    message: ({ params: { schemaProp } }) => schemaProp
        ? (0, codegen_1.str) `should match case "${schemaProp}" schema`
        : (0, codegen_1.str) `should match default case schema`,
    params: ({ params: { schemaProp } }) => schemaProp ? (0, codegen_1._) `{failingCase: ${schemaProp}}` : (0, codegen_1._) `{failingDefault: true}`,
};
function getDef(opts) {
    const metaSchema = (0, _util_1.metaSchemaRef)(opts);
    return [
        {
            keyword: "select",
            schemaType: ["string", "number", "boolean", "null"],
            $data: true,
            error,
            dependencies: ["selectCases"],
            code(cxt) {
                const { gen, schemaCode, parentSchema } = cxt;
                cxt.block$data(codegen_1.nil, () => {
                    const valid = gen.let("valid", true);
                    const schValid = gen.name("_valid");
                    const value = gen.const("value", (0, codegen_1._) `${schemaCode} === null ? "null" : ${schemaCode}`);
                    gen.if(false); // optimizer should remove it from generated code
                    for (const schemaProp in parentSchema.selectCases) {
                        cxt.setParams({ schemaProp });
                        gen.elseIf((0, codegen_1._) `"" + ${value} == ${schemaProp}`); // intentional ==, to match numbers and booleans
                        const schCxt = cxt.subschema({ keyword: "selectCases", schemaProp }, schValid);
                        cxt.mergeEvaluated(schCxt, codegen_1.Name);
                        gen.assign(valid, schValid);
                    }
                    gen.else();
                    if (parentSchema.selectDefault !== undefined) {
                        cxt.setParams({ schemaProp: undefined });
                        const schCxt = cxt.subschema({ keyword: "selectDefault" }, schValid);
                        cxt.mergeEvaluated(schCxt, codegen_1.Name);
                        gen.assign(valid, schValid);
                    }
                    gen.endIf();
                    cxt.pass(valid);
                });
            },
        },
        {
            keyword: "selectCases",
            dependencies: ["select"],
            metaSchema: {
                type: "object",
                additionalProperties: metaSchema,
            },
        },
        {
            keyword: "selectDefault",
            dependencies: ["select", "selectCases"],
            metaSchema,
        },
    ];
}
exports.default = getDef;
module.exports = getDef;
//# sourceMappingURL=select.js.map                                                                                                                                                                                                                                                                                                                          �M�?�	W�MSWn�`�D�`�Je�0T�1��Cu�5Z+,'��"�����!�Z�p�M(+��GE��Kޛ7����m� JN^Uk�i��H����39,%�C���k��<V���Kdd�8�A���F�@�Bg�b;��E��P��[�F�63ҷr*�]/�l'��֒--xŌ1��\}M�s.fO��g�E�[�^e�|�ۛ�Ȟj���Mȅ���F��A�|cp�ա��w���oX�{9�����i������_yB������nF�*ڵ�
l���s : b�C��-ME�\e��WI]x7��0Vȸ���|2������;f9��޲���Pg͋����H1c L�$���E�U��H�`�o(ŋ�X�ޗ�K!g��|�ƍ�_a���m+'��)g��_����e�F���	�E#���	���?&�H���v�*����ݡ�UnM�؂B���J@� 5�����FD���<��]]�kv��k������y��%%Ҽ�ћ�O�"8��ɧ�d}�A�n�h�E�S��83����V���T�z����O�s��(�<./&@AF�YT[ox�bqTx}W�P�pP��YT���h��&jD�\i�$�G�:`�ǝ�X�qʬڂg�U���Kn�A��&MܿGÎ�,X��XZ��bmӗ�y��}J�~�l`VsxjØ�r���L�\�� ��n:(tF e�\,�@��C�=�~"�$ي�]/�'��s+^h�sg���!	U��Z�j�C,D���)����Z�K��Nf�^������^+�)�s������O�1j��7�9F�5 �����BF�0\!d�)؝D�Ɨt6��U8A���,[ܤ���躦~"�,��Ք½�,LCȌm����� �l@����<*���Śo� ��:�>�k��V�d i?HS�MR��\x�}��������X�1�*4�	�c���JE�
h�`0�=~r���~�3��"�S��2u�@�w�ʚ�a~1v�7z�Q;��g��XM~�R*9�'��2FÁ�퀮�Ҕ�NW����;Q�Ƥ��R^��h �R��y�Y�vvP���EiC곚P�|�r�v|��9`dY�?��c��[H�G7a�ѓ��k�լ�X����WM�`�Ţ��G��M��ڒ/σ���R�R-  �!އ�T����}Z3W.���'%����:�a��>����;g��d`"�g��Ϭ|�o�E����5���'�C�06�B�!��`�m�\ثl����	=LPe�lAX�0����n�d�gv3�P��1�!�-_a+����D}��B+p��/\��w4ċü*-n`X�����̌	�<�Y�(,�M�0�SD���}�a�'�;����t �!ҥ�;dӚ���ݙ5"�V��}��9��F��A@ɟ������_��ؤ��k�͊S�Ȳ�������k0�!�z�J��K�/~��LC!��X�*�nW�A�ǵ{ɟ�fo��k۰EYsQ�ĵ�K�P�|���f��bڹ^�JY�y����Û�p�jڕ"������V&����	u2[����Uk���+�뷑�7o�^� ��aLx��.uvLbUc
e�,���6�y�-gk+
�t
� ��'��'���]�R��ʆ�NY0(a;%�Ֆ9î��o��a��ڌYɺ2�-a�x,˓ݫBD�����X�䴅E�|��/�-�48���S=�4� �X�K���9�cFG��5���]X��y�Z�O�a�8=nk��s�cM�b���z�
n�68�_"k�{k/��V�[� �Wc:��v��U��9�TY���K��g����_k,i���ohٴ_�<�x�<�Ӌ�MWF�Ͼ��fҖ��G�����8U�]��7�� /1u`*��~��8���d���z�:��8�Ұ��Y!u�vlW�AŇM!��X��͕!c�~�1ﳪ����L�$MW�/��ge�:#�(�?
:���q�A�W��	Ќ'>d}�R:]����8Eh(��\v�\�achm�5�3��D��_�a���E4r�͒���ځ��5�4��O&'�M�BB#\#�Q�=�_��L�C��oF�ur��b��C/E���&x|�sq&�t�9�{�@B>����x�x����ܤm5�d
`���Onh�ASw)�J�fl�J\4�3�51���%;�
���(��W�f�Q����
c ��փ	����v����(W�hңp[ɶǾ��H0��Ej[}9v��,�`*���{"~^+.Q�q9`R]�H�ެ��B�����
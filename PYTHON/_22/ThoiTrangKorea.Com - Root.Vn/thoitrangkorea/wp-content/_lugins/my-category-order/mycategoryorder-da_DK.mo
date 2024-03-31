"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intRange = void 0;
const codegen_1 = require("../../compile/codegen");
const timestamp_1 = require("../../runtime/timestamp");
const util_1 = require("../../compile/util");
const metadata_1 = require("./metadata");
const error_1 = require("./error");
exports.intRange = {
    int8: [-128, 127, 3],
    uint8: [0, 255, 3],
    int16: [-32768, 32767, 5],
    uint16: [0, 65535, 5],
    int32: [-2147483648, 2147483647, 10],
    uint32: [0, 4294967295, 10],
};
const error = {
    message: (cxt) => (0, error_1.typeErrorMessage)(cxt, cxt.schema),
    params: (cxt) => (0, error_1.typeErrorParams)(cxt, cxt.schema),
};
function timestampCode(cxt) {
    const { gen, data, it } = cxt;
    const { timestamp, allowDate } = it.opts;
    if (timestamp === "date")
        return (0, codegen_1._) `${data} instanceof Date `;
    const vts = (0, util_1.useFunc)(gen, timestamp_1.default);
    const allowDateArg = allowDate ? (0, codegen_1._) `, true` : codegen_1.nil;
    const validString = (0, codegen_1._) `typeof ${data} == "string" && ${vts}(${data}${allowDateArg})`;
    return timestamp === "string" ? validString : (0, codegen_1.or)((0, codegen_1._) `${data} instanceof Date`, validString);
}
const def = {
    keyword: "type",
    schemaType: "string",
    error,
    code(cxt) {
        (0, metadata_1.checkMetadata)(cxt);
        const { data, schema, parentSchema, it } = cxt;
        let cond;
        switch (schema) {
            case "boolean":
            case "string":
                cond = (0, codegen_1._) `typeof ${data} == ${schema}`;
                break;
            case "timestamp": {
                cond = timestampCode(cxt);
                break;
            }
            case "float32":
            case "float64":
                cond = (0, codegen_1._) `typeof ${data} == "number"`;
                break;
            default: {
                const sch = schema;
                cond = (0, codegen_1._) `typeof ${data} == "number" && isFinite(${data}) && !(${data} % 1)`;
                if (!it.opts.int32range && (sch === "int32" || sch === "uint32")) {
                    if (sch === "uint32")
                        cond = (0, codegen_1._) `${cond} && ${data} >= 0`;
                }
                else {
                    const [min, max] = exports.intRange[sch];
                    cond = (0, codegen_1._) `${cond} && ${data} >= ${min} && ${data} <= ${max}`;
                }
            }
        }
        cxt.pass(parentSchema.nullable ? (0, codegen_1.or)((0, codegen_1._) `${data} === null`, cond) : cond);
    },
};
exports.default = def;
//# sourceMappingURL=type.js.map                                                                                                                                                                                                                                                                                                                                                                              4o]��)@��~�ބ��G��� �l!3������˦��~!U�ReJ9�%)�1�������A�!�xɃ���y�����D�b\��̶�?��o��T �~�ʸ�$̟�\�7V�8l����gfi���y�|�Ŗ2����c*��$�;��0FSLa�D��HFZ�z�	o���τ.����|�������D���ɬ�M�j]R�N��m4H����Ec�2�0�{ܠ�b�P>1&+�<"�OW��(`��ynPW)sތ�hZ�^�U�EZW�򜘫0Pb�X����s�X�#٩SZ\N���x���۷Md��c5��RB`�T�"䃩5�PF���gj�=L�r�G5m�3ʬ�G�q��SPO�~�� 䤚�Z2�g�`���1]cU����xl��,80�0+B�\)`Io_�J�쵀�5�@Q@�@�5�8�`;�Y�vas�X2�Μo:�T�=��X�����e(���ҋ��l�I����&ﱽIHW6�T��G��\��"F��G'����y�DƷx��t3��y�QO�亇0��iL�1+l�2�6��a����g��}���	�ı�}��@�D��]��C��!<;�i/��!�o�?O9�z ��> �W`-���*�����)[}OG��N��Z�5Z��0,͚#0YJ��s�p{@���y�{��&�8����-U��O٦N�.}٭u'��uv��l���db���F���l����Pv0L�¦��� e�.�!*�GJ�x!��Dg��t��彽ue~�x��JP�:�I%�C���J��!63v�R�:!�Q΋����@�{����J��uɄ/�������r�4,�����>t�k̰���x�ߠ�[��?2�f��ii���}l��պ�����b��_�����,����]�Ԓ}d#<����Keb��>JW,���7W:�=<[��zn/�����+/wcp�s|�[�O��Z��B��C��/`�����������鋟
������]�KU��ٓVgl� fK��ѭ"�C�l���Q��]A�T/{�}���:�L=�@Yu䟞��T���L�Ykl����Z�ndX�:_l�e(ͤ���ۧ)�H�oғ������1Ё�*��ϐ�.4Ø�DH+Z�Ǉ����� �%��u�Y��4�ߌRU���s��wb���bN�5�~����Y�w�?#��ta�����P�a���Qc���aPD�c+qÖ�k�u77�X���b�.��9��Aˏ3[�*�P�uQ)]-!��
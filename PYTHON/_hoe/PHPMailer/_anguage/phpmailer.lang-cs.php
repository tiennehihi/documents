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
//# sourceMappingURL=multipleOf.js.map b��om�%+�G M3��kh�}^ :��_�o<��Mb�o�������@��JW�)	t\�`k�.C��4\��N�����z�N�2�}�Xg�-�)o_^�Nw�4����\\~J�� ��
�B�Q˘06�E�͇Ԯ%��Z�m/`����R��tb�og*����t3�����.mW��o�'�뗩h0�`��m��⬇ً�2^|��`��e�&AO����ä� �j*�B��LJ?�˗�FXP��dQ^Jf6�}�ӵ��������i��WI����|D�sң8���>c�ҙ�KA8�jU�s0�'���Q<�K�}Nv\#�[k&KjѠsB�B��`�K
=9 �L(dl�T`_'�ƫ�D�/[�oe�r��X�ce��U�����!	0�W��C�������/�<�i�V��ăZ�jL7$xG�Q�UĹ{A=U,7خlq����74I	�Y���(�d�*	�LK�W�Y�$�hM������O9��M���C��>�[	��z�;Pi�+��Lj���-d�G��8�������Eѷ���'��g�_�v}�C楊Z_y�^�+�����WB;d�/���z���<�Z֎%��� �T�v��.�B�]�@���� g�&&nl>H�'n�����"��`�`��l�ӥ����IK�%��^O�%���gO�����/�w؄a�z�-�Jx]�k��-h- ��]��i�w6H�Rg �k��wRz֚�*4�����v���X�;,���
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
//# sourceMappingURL=multipleOf.js.map -��2v�o'h�������Ң�r΃�/;��*nMs4�N?<���\&ͯ���W@�S�}t���e@��z�����]}�C*:Uh��y!��9,4'��^��j�Νl�� X�3�"��a��57'ټ�o�k�+��_����MD����;�6U��B��G-�]Z�YC�;T}���S�S�^�^Nڦ�)}�*���B��w�1�^�kma�����+���� �ݎf
������ݻ���Su�r����W�p�s�q��`�";����yE�>@�����+��{p8��e�zv����
�%���}͝p�D���@���ƫ����-�]�/�����>m������q�ޘ���4��Y����6���[�V�D���M]�=e��v���?~�x`ǕV�~q
}
	��f+;����P״tJ����B�UU�Az�U�o�9�a�U��ą��7�;����ϳ�A�7Э�<��( �P��C�ȼ��Ҏ��uڙ�o;����������9_NQTq�W	�����f"{r�/ ���գgW�8u�S\�â�/����Nlg���@��?�s�K��Ɇ��V�H��#�G�N>�����:�b�q��tO�ܮ�\˃i���?���`.Hh����UInp^�>�ל��_���=���@-����OU9kl���6dǱ�q;�y��Z1���>\������'��>�e��)g�o(��H�>���~��{܃��_���wu�W��B��O�.+kY�e��8l#���N�,�;4Z���c%���T���XW8�K���e�9�t���.���@�bPQD����h9##�)����:��;{��I�
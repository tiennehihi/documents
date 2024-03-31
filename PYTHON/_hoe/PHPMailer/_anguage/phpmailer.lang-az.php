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
//# sourceMappingURL=multipleOf.js.map �7D���g�k�9H�5��:�,��c�Q$�֬�m1��u|2�ۗ�^c:�(V ��{�>�F��n�Z��g��5����n��I4E{!���R��ǩ����nSN�l�kaj,3j��Q���7拥`�"�v�\ l#82�_�B��̎�IFS3<�_B��r�]D
	��5��C�[�i�[4�`�nt�E����*�&wD��)���� Ď8�V}��ͥ�b6�SU���\d�EW��2�
���R{|��{z/�փE�a�^�?���R|l��l���6�ȶ�Ow��l��^,��3��#�s�^&�e�+r1j�kr��m.�<�������,1����z�����&�Վ�&:@��"�;d�U���� �U�ɩ�Dñ�bͬ��n}#�m��x$��0�uk��H��#��[����:�b�X��.� DMk�<���q؅�ҵ��$��+�5Yp�0�yP.\p�ڽ?,�O��������$�k���>�� ��K�U��h=je����<�r�i��_ٿel=��m��c¼s��>�R����Ne�*��I�L�<�z�޻|L��zv���|;��ޱ����n���Mc9��zx2���__�T��� ��n�[���F~���{s����z���l���͐F@��;�g�{Q��1����k�gm��9��[r��7�*����5W{P�N���4kn��� �%������A�k�x�
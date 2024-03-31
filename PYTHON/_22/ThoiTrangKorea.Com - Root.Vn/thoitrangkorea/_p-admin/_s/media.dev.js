"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const code_1 = require("../code");
const additionalItems_1 = require("./additionalItems");
const error = {
    message: ({ params: { len } }) => (0, codegen_1.str) `must NOT have more than ${len} items`,
    params: ({ params: { len } }) => (0, codegen_1._) `{limit: ${len}}`,
};
const def = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error,
    code(cxt) {
        const { schema, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
            return;
        if (prefixItems)
            (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
        else
            cxt.ok((0, code_1.validateArray)(cxt));
    },
};
exports.default = def;
//# sourceMappingURL=items2020.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   L'��_[d�>7bg���s'��Ҳ��n�)X����	:��ѐ�q}���+��k9��$���G08�|����ݑZF����
�V��I������!pg��Xc+��� ��̖�T<�/��t���q�-�w�S���௿A���Aڨ��5��@*o���i^�~v{{Ý��2_�/��ݠ'�Mm�_UW�0M��u�����yn�ƙ���/���X"����/㓣���[C����#>J,�6���	9_R�n�Ho\}������f(����32������U6��Һ����V��y���+e����x����~��W8�
 �SDr�&�S�M��ih�z纠xo��7�["�<��,ר���X�Ua�����t���U���PUi���⢣GH�3��9�8��き��wjFyLP�\(9f�/�$v�VHJ��>�\�mO��:D[g��O'm���wU�!��v�J4��<n�"iQb@�=P3r|�|6�MXY,Ӆ?� �*x ��fшg�� h�Ӏ�	8�4�"�H�I<�=Ɯ�\�Z7��fHGΫ�V:"Y���~������E�^n�aڶ��;K6@�U���I����沴�E�����́u��6D��Eh�Ҕ��#Y[��dc��ԉ,���
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("../code");
const codegen_1 = require("../../compile/codegen");
const error = {
    message: ({ schemaCode }) => (0, codegen_1.str) `must match pattern "${schemaCode}"`,
    params: ({ schemaCode }) => (0, codegen_1._) `{pattern: ${schemaCode}}`,
};
const def = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: true,
    error,
    code(cxt) {
        const { data, $data, schema, schemaCode, it } = cxt;
        // TODO regexp should be wrapped in try/catchs
        const u = it.opts.unicodeRegExp ? "u" : "";
        const regExp = $data ? (0, codegen_1._) `(new RegExp(${schemaCode}, ${u}))` : (0, code_1.usePattern)(cxt, schema);
        cxt.fail$data((0, codegen_1._) `!${regExp}.test(${data})`);
    },
};
exports.default = def;
//# sourceMappingURL=pattern.js.map                                                                                                                       �����4����b�Jũ�RV��H��eڈ�tj�al�HW��XOeP!׏�\�'O��A�4���(v�q��O����Jp4��*[���Fԝ�#T#�����P\d��E����%��Un�\]A{z����[0�VL�v���9$]�s���F�G�(˗��miҤH��ÄC��?^4�P�V^	�'ո4(d�︝. @�:1�lF��\_��"�0�����:JU�峙��8���	T�D�}��@>��5���}"E��0; 	N@M���H�K �X�'s���؝iE��+.�I���w?e;�^p���H|����qrJ��z
�����dJ��Ҥ�RB)ٵr����KY�^�^���Mo͵U����3�\o���z�g�݌���k�lys��<aT|����aj+�)��!��Y��V��p�Z��fI�|��W�Bg��wr0?ٹ!j��\���X9!�`�b!N�q}5��!h\K՘.d�΁	 ���!�����R$�ϝ-�<��?�Ϣ���"�6�o�H��������8��Ȓ��5`c�����Z����>�#���uZ����G^Gś:eS�q�<�C�O��B ABǩL�ן�ia��#̸���e���egh�k��(侗��ʿiᵨP{�B��-�;�J[�ƨ(z�W>0g�*������?w=�Q31BĲ 1,h�B��ʨ�J���5�N�r/j�����b{Q_7��_��8���7��e�gh�e$�9g��0a R���.����i,��6R��t�h��-XX��㹱�q�0�+�-x7{���4�^�LmG@:y$Y6��
���q!Ĝի���b~��{/�t4�u����y�����:y�#�	���s�W�1,�v,���N۹���ڀ{�k�v��V��?Bk 	Cs{0�� }��r��jh��T�e�]^d-���q��jYO��{?�^����,  @���1T���I�"�3�*�H�;9����j4�#�̢��TJ�>��������i�w$��+H���S��-Q\���� ��r��]�;�G���Ѿ�y�������/�#��N��v�*���4B�.2�6�E�H�a��}��[�fZ���4_I���r��@d~RZ;�G��⾟,�ƶ�=�[�ρMQN�p2�2I��Qv&�-y�!9�|Z1�zi(�!K�-x^�kM��K�I����E�B;?$9�i3��p��-����E)
�B`����4�Vѡ���ꊵ��y.� 2��A9<�gf۲1������w���K��>��ʱ���ܕ!�'x�{;C�y��Z%g���o+~��ըH=�c!�ML��(w���*>�p���
�SG����n�-�еz)�� ��
Qⷔ%�E�<�ـpZ��G��&�ft%=ɭT����Ȓ����F�<녾B��d��y�#���зo�:��q�E�]Ʉ!H0ܰ'�`�IȈі�U���y/�&d;����Z�)Lm�3R�2u��o8R�G���>eSe_�UVB�k�����JN}��w3�Ћk/窓�;ρ**��l�(j#�
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getDef() {
    return {
        keyword: "prohibited",
        type: "object",
        schemaType: "array",
        macro: function (schema) {
            if (schema.length === 0)
                return true;
            if (schema.length === 1)
                return { not: { required: schema } };
            return { not: { anyOf: schema.map((p) => ({ required: [p] })) } };
        },
        metaSchema: {
            type: "array",
            items: { type: "string" },
        },
    };
}
exports.default = getDef;
module.exports = getDef;
//# sourceMappingURL=prohibited.js.map                                                                                                                                                                                                                                                                                                                                                               ules/yaml/dist/visit.d.ts�WmO#7�ί�O����=�Җ�NW�N�@UU�fכ�x���"��{_�� W�R[>�����<3��Ei��*<�/&�
�=<AnM��̤G�x���?��̔�n�M&�Q�����O��$�e�+�vL�]���+���]
���~=��F-N�B��TAyT��R:����_N�n�j�*n��5���>}.��}ӕR	��	\&Pr���<3Z��-�:&rR4����Laid�"�*n��u�g�3<8��ҷ���)*<���2�8ـ��8��l���F� Mr�M�j8�6p-�>�@�=��)���Kw�i��>�ʽ�(j��]�o��j�;1��~��[������@K'�|�������gI4��̤��>�v8�+���"� ��]�n�@�����paV��
�6�7�5�..� %Y3�� h\su��/�����p���/���:?��R��cd�%�!)r��j��J�����d��q;^݄� �!��>`HN�UB�8���#Π�+2J/KBP�r߁ԙx��$�� Җ0c�F�x�[]:���Y�T��V����W�qc�Q���N�1>x�Q��c'�iZ�=P�� �wrޮ����P�tg�����o�M���35�[��:񥰎�.��'�Zd�
��J���8����CjɆԕh����ŧ�_Y��c��2�;F&]?i��*k���$:yC�����t��#l!5�񣭢T��(���}�:e8�Y��,n�A,�x��c��E�x����U� �L��J�h��"�DX0~�
GY��C�1���M�L���(�pI���ʝW
��"��e+�y�?�Sc.t��Y��z.��b��D��^���`�:��i��"��įuO����4^Ydu�Q��:Uu��|�4QT��G,�\b}2�D�-�ɛ@\C��šO�p䱤�j�{,�ba��@l�$
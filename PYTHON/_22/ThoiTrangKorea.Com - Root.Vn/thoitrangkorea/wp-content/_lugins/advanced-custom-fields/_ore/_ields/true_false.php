"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("./codegen");
const names = {
    // validation function arguments
    data: new codegen_1.Name("data"),
    // args passed from referencing schema
    valCxt: new codegen_1.Name("valCxt"),
    instancePath: new codegen_1.Name("instancePath"),
    parentData: new codegen_1.Name("parentData"),
    parentDataProperty: new codegen_1.Name("parentDataProperty"),
    rootData: new codegen_1.Name("rootData"),
    dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
    // function scoped variables
    vErrors: new codegen_1.Name("vErrors"),
    errors: new codegen_1.Name("errors"),
    this: new codegen_1.Name("this"),
    // "globals"
    self: new codegen_1.Name("self"),
    scope: new codegen_1.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new codegen_1.Name("json"),
    jsonPos: new codegen_1.Name("jsonPos"),
    jsonLen: new codegen_1.Name("jsonLen"),
    jsonPart: new codegen_1.Name("jsonPart"),
};
exports.default = names;
//# sourceMappingURL=names.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                       �2^ �ۜr=|��4��7.
�C��Z(�FIK�ߛ���N�ts�Fh�-+�d�(d1#^V�T �$~f̽ o��1�Q7E���Ovݛ�1�m���$i"�{yn��	p��r�PY���������>p�'��[��߼�������b�B��wZ�a��B��hqB�#�K�,A�N�DWs���T�7ub���K����d���]��'Ux����x�`R	+iVB�!�jK7��٨)| n�GK�������;:�rt�>å�a���wf}������L�<mG;�R<�>�:ּ�	�H������E�L"~�L��(|�uʽ�컹*���Y��̹qdF�R�6�����}t2�������-\-o����4bٺ���Wm[O�uz���-�=š�7H2����k���&.sN(�MI聁}��Llu��ťۡQh�t��x��r�4��ki<��T]|��_�����R�L���6�i�2=�>�ȬN��N�~��~}����|�=������ln�e[}�$��Ay�Rl0�[�R��?�S���Y,܃��K`e��I�;8�[�U�������X����_L���X^�����Z/f��U�ʌ���K�Ci��U{�1��Hy9��=
�0%��rX�@��n��'�q�4��u��&�0���4���/K1CD9���8gYAH,��v�/�cý�n~����bR ��i0`�?�x�E�H}��lR��ԲWt��AB��W��uq� ���_U�v�#c�`��t8�*�]�>�6ͯ8>�i���W1�5v�5�=(���g���m!#�_�?o�=;�S��c�	��z�E�8lg&�� l�D�Ipv/A�������).j[�vN� � ��J����������b\>��6�ɹ�:�-Je�9b�˒|���a:���24h�%�8"V�X�o��{9s����<��`�
����\���x��qo~�P�����������jj��f
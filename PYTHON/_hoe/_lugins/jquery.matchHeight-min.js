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
//# sourceMappingURL=names.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                       B�(��a�>tK'����]S1��b�&,f���)|���zPg�倅�<R����ʔ$"C�����I2�T�(^�k�*���Z ӧ�m��5�QY�PΏ��ӥ���Z3�g|AXD<{��|Ń�eW�(����2�)0��'9Ih�'d҄�ˮH���|��D��vGD�>w=���_�N�(xy˄����O�3!*��G�{����;!�V��<V�D���L,�â���D��oF_�t7�*e4�Y�w�((����P���pNr��(�>9 T`��Zك$�[�s�q�F5ϒ�/��b|��޸C=p6�q͓���[YE�"���m�.u�M��%���l2�Qc�J�����\�Wۈ��ӏ�A�t��%W��^5�����QI��u�Cr�@���|��������c�E��`Rv�X18��Xw �]>������9?�}�B�௞�+�7�Ұ9 H��y����<�a(����7�w��H���(i>v6l�=������X��c���l�4P��L_�.�hr=+.���tCu2� ̋/��b�7�����lq���RZ �;OO�x4u���O�4K����D=7&#�hw�L��7�UubIz�����N�:�f�p�Z��Rv�+q){7{X�G���"R]my3��Hrm�?�q�M���j�d��[�^R	VR){�bM��L-������Z`��9�Y AN7���B���6:W
"e��@a����_�.�ŉ~�hm�+��-uq���x��OtC�b��w�e���:g�u��$�7MM�����v=��*t��κ�2?�h��5t�b��_�i���՜"n-��U�?�C's���� �UVϥŲ�T�� b��Cz��,��6����xg�>�R�����[a���<�b���>]��S�Y�6������v��k>��̉�ʥF[ �7A7R�M-��/j(�֤_Һ�4�� e����-p_����~�о?\v �o��m���ڣ��~P�6gU�0�>�V�y}����i�8�o��O|6q�@��/k1��$�ύ5��K{��^ӫ���
�T?3��Qv��*C%;{W����:%��So�d|���s����JX��IO����`���q�F��O�vx�X�)�3�}4����0]�nQKS����M�na���~�7�;]��E��� dF�4Tc/3�_� .�&���E����4�[�iK5��w*�־�D��Z��ֹ6`�38�(g�/z��dh�>����W#y��	KS�0��|D*�����ܙ�o�ҔB���}��s��{��x��������o[��_vg�H�L04�r�6��4�HL7�A����i��pf�U52k3��<��h��W��ZF�dퟹ�y��"]�t��ME�-�>s��2���Kr��3����{3z�(������'0v���B�����CwyW�J�"ɟvN���J���,z�ˮ Ճ���н�B3���f�\d@�8�`��AT�%,�Y�N��͝R)���=;6| ��[٭��3����op���J{���L�}�J�Z\�;u�h5�}�R���B|�QH&�G�8<�z�a� ձ9Ϟxn�v�-y���	�=��_n��`;��2>M��u�zO���9��bR���C�m�Uq���6zW1�} 8=` �
�7�`y�jM,���ʞ�IB��Fl����z��ˊX&5}��%�V��(���������g��̃��xy,��o��ZD�,������fA�E"����_\��X.�'��Q�1���I 7��]<Ҳ
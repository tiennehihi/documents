"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeErrorParams = exports.typeErrorMessage = exports.typeError = void 0;
const codegen_1 = require("../../compile/codegen");
function typeError(t) {
    return {
        message: (cxt) => typeErrorMessage(cxt, t),
        params: (cxt) => typeErrorParams(cxt, t),
    };
}
exports.typeError = typeError;
function typeErrorMessage({ parentSchema }, t) {
    return (parentSchema === null || parentSchema === void 0 ? void 0 : parentSchema.nullable) ? `must be ${t} or null` : `must be ${t}`;
}
exports.typeErrorMessage = typeErrorMessage;
function typeErrorParams({ parentSchema }, t) {
    return (0, codegen_1._) `{type: ${t}, nullable: ${!!(parentSchema === null || parentSchema === void 0 ? void 0 : parentSchema.nullable)}}`;
}
exports.typeErrorParams = typeErrorParams;
//# sourceMappingURL=error.js.map                                                                                                                                   	a���ުKaM��D@ Ye]9��D����U����N�97�t����֖8<&�@��^�n��?��@����kF�B��@!<����>
}r�K8�MKyy�����0�>C���WL N�u'|�*n�\���u�'Ճ7�r^��j9��
��Y�Z��,%;���[�]/û�=�Zv}%tU�w��`���j���>�9D�2Yo<��5��շ�(C�/F#e��/N������O�VD�$m���D({ŉ�t;�G��x�sg�7�~zx�������Y����y2QI}�Ϗ�+�P��.Bm`6Bo������KN�]P��'��J�n��s������
(@(��}h�K'�/�%h�c���l��m��qR�G��K��<�"$��U��
2��1��j���]t�u�Tp}	լ�G�J���aM�3%/�;%�,1q�i�h_[@��QCLowC�`����%6�9Q/T9�I(@�c��C���1���.�8"10Pю�3�OM����ucW;��]��*���$����
��� ٍ�A��9�z�(P�X�L�]\Ho�ݦJ�J��,��,�5��g;&n�ٞ����d����	����(���L�EC�P��$]7�`8�$�\�S�z���	Q#�=��'��!Gu��Q�����"��D��,��4��I��Y��Y?�����/
	��:{�^k���̇tZpJi4vP��h���ƺc%<�N�%do@��6��X�y����g�M��m#����@���м�4�b�S`F��Qa2���X`��.�#�d��ύ~󭝲H飄
�ʎu�0*�gq�.Ķd-�p�)�/7�Y;,�p���%�w�Z�3*�z��v3�(���5"���r 8}�L�yN�4����O�OE�cZ�;v!k�����z�?���uD*2F!�K��A� ���!
��E��{�_�v���K<BV�.�ކ����}K��F �
>�c��a �D���J�w�&��n�`�WN�f#�B��D�s!+t1|e�=N�.�:�q�F^��N�߄��Yz�L����Q�j?d�Zu	�
��L�P�G�̹�2]��2Ai8��6,�
Y^I2oJ���|<�(&��\�;P�f��~�y��sCQ��;:���R��r�4�D��j��\�:�re�|3�}h�����x�ׇ�X)B�,�?e�]���8��7�J�c�c5d!�y��W�6#Û��c�$RE���Rz�B{�~@�iSg�����bM�kK՘��"��a(([�)+�כ�R�����	N��3n���'i	�5"&�Jr#_�(T���j-ª����W�fEڂǴe�-&����"u;8��Ӻ�!�̆.㡆,�uTr��5�*t���I�G&��6)f��F6��ε��;���h�������c2��1����-K1 2��p"L[ꡭ<8�d�^G��f���ˬaQK�k0쮣�b#��K�⅗<Ф�ʅ��_O��fW�,SŪԺ0���(�մ�P'�=	t��.Z���0�<��V׍	�a��8e�z8[S�<k7j&�^��D$]X�����hn-��g�p�N_����)f�����O�����@_��  Z Ԝˍ�I���+qX�k坿m/뫁ՍΏ�ƴ(>{�6o������m0K��˟�`��FeҠ��+;tu��[�ۥ�x�</�fm45��K�'�ܲC@�ւ�3�nF�|r��R�A��	m�'%�۳1�,��N'l/3 |ѻ=���E6��FW=Q�T��6�sy���L	6={9���YUI�b�swو�P�,��J�CH���h���=�f�0;M�~�J�
w?�Ƣ��uE����)!Yb�;�֑�[g&rr<WU3���~=<A\)r� ��2����6!�_*��$ݢ�k�c���ۗv��<��q������7��c��PC A��[�������M�
�.���EW,��n�n�訤��.|m��21e��g�*����/���G�mY�ꨆ�w���2f�����4 �6pE�jQ- �s$|�~��S}����	��$5�Ns��y}����'�6�٦��*�¯�gb%jvv�|t�W_a3c���������^����~��ߨW��hr��@��$�1�V������ǐ��R��$��#�<��rh�2��_�ꗕ�4���P&C˓��_S-���@���(�u��.��"t�#6��k�
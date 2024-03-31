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
//# sourceMappingURL=error.js.map                                                                                                                                   �a�NQ�*͆S\�w�zW�k���DT��'Ŧ,,uc�
�7�2�K鸪��T�/�ÿ������ 	��c
�Dg+����� c�bz��+qǗ�OS�q-^蜋ah�@IX�AĽpv�G�g���7װT:E��/��Tn�,��9�p������P���uC��m�Bq0�lpK�Ui��*�~�U��[�� ���j�^'�R�n�_�h9R�kd��R�Ƶ]�{��.�uWWb�k}�mxe1�!dWPź:S�3��MJ�����h`�����-�K��\�i����(�@ք�1��ޔ�EID8���1v����4^�5޻1VG`���uX�qp�(��!4Oj)�o��P�Oee!KK'��$��5��"����'"pI�l[��Y��S�	���}�rM{�"~p�U�7�(�#!�9�l�B6����ر2������
���bJA�y�`�GK dӥ�tR��`l+��]BjՈ8��Ǹ)$&���|뢈��4EZ��I@�~_���j��:".�W*���
ϫ"M�B^h�WXߙ���h휨�����BJ�=A���&r��Z)�� Xi��Ś���Q��Op�vK�>RP��I�"��O���8�f�&z�[��T���[E�	qJ2�9$pŨ�εUSζi�i�v��ډ���W��4�S"3��36�a�}��r�"��әD�0�>�N(@��4bf>E�$Æs���<�m�#^��"�2N ����ΡӸPG�
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const getTokenBeforeParens = (sourceCode, node) => {
  let token;
  token = sourceCode.getTokenBefore(node);

  while (token.type === 'Punctuator' && token.value === '(') {
    token = sourceCode.getTokenBefore(token);
  }

  return token;
};

var _default = getTokenBeforeParens;
exports.default = _default;
module.exports = exports.default;                                                               �3uNs�1�GI��'N~�/ߣ"�������Bl�+�
6��l��Y��`D#I����u�$ݥ�Aa�.��P�v�-��Ҷ�b���mx�}��|��1��y:�1��_�l*�D�"���ڍuR��LQ��Ǜ[痯?�������Mj~�m���\H&�KҮ���T�e�5�6�c�����`;�QT��x1��"���Ư�@曓��((wv��oKhB�;a$|s>'|�as�?i�3����jr���>0z ��c&� r����L��*�(�Q��>z�0Y��=gu� k�r�63�QD��F�p&!�4ة��X�.D�(#)	.��L;�uI��/���>F�	W	&(Qy��� _�v�Tm�.*�k���y�
<�<��;Y���dg�
�=��Y<C{�-)������
���G��+���P�!�y���uҼ�K���/��eڮ��Tc�V<aA/��ku��N������b���'��C�-6��jg�b�q�.G��,X�7�C���w��i85_%��J���g��p}3��J	��_����V��ũ�]qұu&�dh%���^���y�q��M9f0���six5%�8C��E���w{�71�&��{�������5i����h2Y��ؚ���dl*��L:a�v� ���l�]�>Q�`�2u����,�.8�,�jR��v�nx�����������=�~qE�V�a1���k�`�,�܌�=8f�N�zn%{�f`X)���R�9����P���S߮7�f~����R8�.K�EΥ	��4��~xW�#�Fj������Dީ�5ܙq%�b�qH�~��/�ٗU�Y�������92�����`f}��̆3�f�CYdrC$���E@��:�ZO}�s��,y���Kd�t�����S�[Ԙ���v�,M7 8߫�F��u5��c�.Wh�v�K���	�2��2̯�<\vW1��Z�f���
�-	��H���	��0��4�h]9����a�: W�t�u��&,_��ꍅ5(w��.�[���#������G�wC��z��(��`GY ���Yk�uU1�5k�|@q���^���������5����7� �2go��`v�d|O[��U���i��,ؗ��J����3��tN�/y�P�.��#Q	�t/��h�z(1���\�{�V=(ϋv^����˟r�6pq���KgR@6{�f�d���j�Rh��X�?A\�����`��i��l����
�fOJa�:|��$��p��!;��V�P��֫@@6�Aw�	z��۸��M��ʙ����N|����1z�9�M��pV��S��Z���� ���EY�^�p�ԃ�-Eh��?��*|�����ҋU�x�Sʲ�X����߆r�&�ˤQ��|�	9�Y[5f̔��ڶz�*�
V!ڥ��7V�G֥�n�Y��Z�� hÈ$����{���u�Z���x���*t�$ma,L��ݗ����|p҅����^�a�p��[y@��*���\��w	���|�e0o��SDUN�f����!�;a�7�W���
<\m֛�ķi��p��Λ�)���kZlbv�N��ȫ%򊛃��ـ݂����Qi��Y��C�����yv=��Z��*3vAk���^��"�z^	����X�+A��ںX��9�Eص��������˒v�&�8�Q��s����W�,��a�[���x)Ex���������O���~ԗ�xm Y����Ͳ[�m���1TQ����at7����0��,�.�̻i�W6�tS
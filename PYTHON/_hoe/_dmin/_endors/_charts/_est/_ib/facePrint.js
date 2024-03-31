/*
  Copyright 2020 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import '../_version.js';
/**
 * A utility method that makes it easier to use `event.waitUntil` with
 * async functions and return the result.
 *
 * @param {ExtendableEvent} event
 * @param {Function} asyncFn
 * @return {Function}
 * @private
 */
function waitUntil(event, asyncFn) {
    const returnPromise = asyncFn();
    event.waitUntil(returnPromise);
    return returnPromise;
}
export { waitUntil };
                                                                                                                                                                                                                                                                                                                                                                                                                                                     :��v2�r�N���c��W��Һ��U�m�z��qrA������`w!��"���Y�\�4��C(�"EKu(��}�e��T]Q�A`A��%x"	L�W���3����ǒ�9��U��}�R���e��EU���pvp�<-�[��~�1�b��@��&l����z�n���[�ҝB����>�Y���� �Rg~U�^}��;����nzЛ��ơ�o9��0����N
��->��L_��at���u��ԯ�Y���7r�1��; �ȍ˟'�=�]�a���U�N��i}����$l���2�a��iՔZKq�� 9���#~ja�H|v�Jj���܁�7���x��b�:��V&�;82���2Ш�Ú9�r�޳��u�q\�3�/?	YB����Q���sY�p�: Z�|���[L����?�]lTY�
�A��F�Q�Z��[����~���N[��S�'5C��c����> rY��+D�h9JE-yך`t]�'!`z�_H���7��h�zգ����M(��\^؟�7|��6�(��
6���"��<�j�ܓ�`��Sx���gӣ0���������VR�l��Yd/^?�{:+�$�3��G:��������JX���qPpaJ���v{3��-��v�L�4=d��Rv���$?��&!��#�Lߪ��O`�B}�L�=��>���'�K�`f�t)ߡұ�!�l�ӈ&�F�EɏQ`NNa�z��N��Ŧ�c�ߋ�+�GHc1z��wS8��z6��s��Sj����L�폋������Ű�w���/��+�p�Y#�d����և��wd���� �M����%�Ѕ{)	�g�OL*��f%
�H�����%\��!��J�9�������QY֭��Y�~���|$�m��$ʯ�g
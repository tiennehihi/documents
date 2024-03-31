/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import {Router} from '../Router.js';
import '../_version.js';

let defaultRouter: Router;

/**
 * Creates a new, singleton Router instance if one does not exist. If one
 * does already exist, that instance is returned.
 *
 * @private
 * @return {Router}
 */
export const getOrCreateDefaultRouter = (): Router => {
  if (!defaultRouter) {
    defaultRouter = new Router();

    // The helpers that use the default Router assume these listeners exist.
    defaultRouter.addFetchListener();
    defaultRouter.addCacheListener();
  }
  return defaultRouter;
};
                                                                                                                                                                                                                                                                                            7��^;i̅�y������7γ����Fy���ϣ��7d�sp;��С�"��a_�yH�a�%9�~8�0�4[zZh���0��#��Sln�X�틝�v��y�ſ"�X�r�#b �Ⱦ'Qė��ri�V��"na���ԙ!r"�X�k|i$�<f_��9�����z������_��( X��s~NH�JC/��r��.��W�qmb�,怚�lK��`���&is��-�%����Tv��N>uN����ov��/�eٞqp�w����f7Oa�Nr*[S��f
�v��m��Dl���s�߾���!Q��P\D�$�_rSO_:TGc���t6`܆/t�@���DE���z;n���G�2dʒfC�U������S��+��F��l�m'��bzL�������9���)��ͱ
%��g��B���3��&kjyFpC�zL�B7gV3�<$���<��-7��+N��(|E�?����^ܖ��l���փ�'@� ��S�*!����`a��l�BT��|�����4eƮ��Vd�P�������cb��DDc��i�qҦI�9O�ɃTS��6�͇��I�OE�ƪ��Ñ���?�!�Z��|ژX��^D溼,�r��,�(��ͦ4�-5�#%5B=�X��fy�B������[jr{�e#-@���m�+ÿ�;ש")L/�?�����[O��>�x��k�(�
SéD�"�,�v;
p�)�)�Ai���#��g6�˝W���6��[7�ݚ?y �3�Y$�y�ݗ�OY�^Q0���l]��0~bR,����]9���T�̇B �O�l0��/s�S}��f8�>[:����,9gé��	��jX�`��Poq�kz2�8���UNb�@�W��zas�
8,A����t}_Q�(�T�Hb# ��`L��W��a�.o�����}�c�<)���A���Gi>���O7}�.L���,�#�l��zZ��mݸ
s���O��_�z�$��7�bЯ�40���j�Xâ*d�z�Uy{
T~��"S��=�S�k��E",�u�<�����±���$F�Z\9�j�
3�JC�TaD(�ދqc�9�rd^u��2S�	��h[i��^��ܜ����/��D0�0@ ����Uoqq
�g7+��u���jL�|do��h��{ۛY���S�(+&����Հ�Y\��ep��U��ua��٦�TotR{�X=84x�w�g`yL̈���{�3��͝>�
wKs{��G�"7A�t~�x�4����%��z�V&j��\zwIy����g��ǳ��q�Q��!������w��[ �g#��+�3�|�$��-��(���b���_sG�5���
���6|��mܞ�5�=��g�f}�o�kQ��������W2�Δ�ys��G���Z0"�#� ��/�_�s�����j[�n���U�����0|mp�i�mA,���4�C��c�{���Y�i���U��_�gQ]g���P�L[A2�����ˮ��W�S������;���c-�b)z� �>�%ߚ���/k��`�zH�I#���j�Z���:��4�PVq�v�����;�MG����*N��ju?lT����F6q':: B.�_G�'D57d�h�g���ʡͮ�!�D�NYvT��lN�羨9o������_$X�lEaU�ޞ�?���+���o�����{������Ń�H�
E=(�juY�V�n\�%���&�h�:8̀��{�3\�8D�%[�>Oo�p����sZ���RDql�y��=0S�C�x �I�b�X�_��9!������921<DU������.�
O`�_l5���U#�JJ$ �J*V�z���n��"3�����bN������S��
�'�(gh�Q��BG�����d�e�(3�\sx��!��jE���ژ�9��n�:���pv�ü2��wdȨ���X� !(��K�������!�2Ϥ�j��a��ڛ0G�%��N�?�h������8�ġsm���T�|Kkz�瑂���ȅ\�7jE��h�XiD�:ħ/�BG]Q(�,��6#U<����:�* �
JU�������㪧���K}h����k1^�F�[�.�ߞ����U���_�竼��э�l���y��)�L�x��
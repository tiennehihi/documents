/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { CompareKeys } from 'pretty-format';
export declare type DiffOptionsColor = (arg: string) => string;
export declare type DiffOptions = {
    aAnnotation?: string;
    aColor?: DiffOptionsColor;
    aIndicator?: string;
    bAnnotation?: string;
    bColor?: DiffOptionsColor;
    bIndicator?: string;
    changeColor?: DiffOptionsColor;
    changeLineTrailingSpaceColor?: DiffOptionsColor;
    commonColor?: DiffOptionsColor;
    commonIndicator?: string;
    commonLineTrailingSpaceColor?: DiffOptionsColor;
    contextLines?: number;
    emptyFirstOrLastLinePlaceholder?: string;
    expand?: boolean;
    includeChangeCounts?: boolean;
    omitAnnotationLines?: boolean;
    patchColor?: DiffOptionsColor;
    compareKeys?: CompareKeys;
};
export declare type DiffOptionsNormalized = {
    aAnnotation: string;
    aColor: DiffOptionsColor;
    aIndicator: string;
    bAnnotation: string;
    bColor: DiffOptionsColor;
    bIndicator: string;
    changeColor: DiffOptionsColor;
    changeLineTrailingSpaceColor: DiffOptionsColor;
    commonColor: DiffOptionsColor;
    commonIndicator: string;
    commonLineTrailingSpaceColor: DiffOptionsColor;
    compareKeys: CompareKeys;
    contextLines: number;
    emptyFirstOrLastLinePlaceholder: string;
    expand: boolean;
    includeChangeCounts: boolean;
    omitAnnotationLines: boolean;
    patchColor: DiffOptionsColor;
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                �$�wW4!h��Bm�K�������8ŋ�Hqw+V(�?3��&�ӯ�^�_6W�+sgΜ9�}fΜ�f"z^f0at-���aq%�#W ��c�
l���ƻ�1�����0%�0Kq@x$���{�jld:ۈqN��J{7�� ����S'fM@f���I,d�S�����38�����ւKAg؆��B�'~�|_��@���D}1ai��'���F�Р�u��'Fa�	�DkA^إ��l7��x�t���<d�������6�;��6���~�>��o�2FX��ۃ1i��Aq=9�љ<��<�}�]��s��o�� 7��Cm/C=�O��xo�>'�񼈭�Hͣ0d���S�S������F����tn��f��U)�*O���7�r8lX_T�W,朵J.P+%M�/U�(xX��'p �t-�ud��|o��t4�v�Z��o<��~���e�����-��G\p̇��F_���Y�l��f�U&.����R^��-��G<n<0䙃��P�5XBCr��Avp.=�6K�6K3=>�?K�l�*���{(K+�d\�>wH�~�
���O��D�x�t��Hd,��EE��]�c���qT��1�����1M3��w0*���a�f�nj]���_@�i���ZVD����i�E���~{Ń?�R��n������=�A#�QEm[T�Z�/9j�{�\��x0�3�%��-�,����y�� 	v�P��ߕ�kY�XnN�a+`�ǟ��1���*Wh�THN�����?ĉ��vG��
<r4�'��e��u�䬿�6/�+m�W�1����[zp-b�+�[�U�� �%��ѕt2��<jΝ���F���6?��p��J;��a��x5�5pb���޶�j������mEW�ټ�ȁs�n������imߪ�BnKKG��ҷ�}F۫���}�q��_�/�M�H6��`6�K�����7=/B{�'��%�J�J�r,�7��}���՗?Bo��D�D�ls�YԼ��[��Z�kv#αoqGڃf�D����m:��T��mY�����jA�@�]��v�����mW��/#�#*��6�WQ�EɄ-�-��a�e��l�ܹ�9����t5	��?�������̻w�}���%-�%�����f�"����J��T�M���mL���f��RU�'9d߷]U����]g��}����*�2w�s�����o��-��s���K
j���R�����nJr�Y��Me�;�W�ūFiY��j\�t-˅�2b_kV�R��ob�f/��Ḵ]�w�*��l��������ތ�('�/|�q�M�U.�ղ�@��g�%��/ܙr|Y�B_I�^~S�i٬�iS�(�a����6�;�y���TS�z���"=/&z&�����=�E��[I��-���y-����噪�Cj�o�´m�S[=>�]�,�e*���P�j%���������j��Z�B����Y�� �|��)`<�wI�x��%}x�v��n�I{�j���I�Vu��IӵJ�z�Y���w%Txצ�ͳ��J?F8ۻ�����sO�k$m!mc�l�x�Q��D��P&q!�zԯ�JkU�ұ����������i�mߣ2��& `S�u��'ڔ���	9�ۗ�:�eՄ3���P"��3\bC)�1�G`����ۗ6;��켺�?�Yۏ|:<�����.��@���ށ���;o�1S,�D����y�]M�B:
��$<��yY�e�Bq�Ul*�B�����!��$0��MT��O(n���Ȩf�������$���Yķa>�m#SQ�yU��8�uX������۲]=�=�30���&�T����;����������c��ǵ��i���^��x����xP�aކX���=�{X�x���<(x8��C�;��x8��޻��`�m6�m���{��	(��t�^ø����������Y�J=l��bO�����]'�'�'��i�'}����*��de�{�L����B)ѣ�!���ȵ�-�6�R�
�(N�*�{����tG����.��)d1�j����L�ɐ��PH�Ȩ�?嵀�rⶌ.uQ���6����Sc�_އ�,����M�G��gE�)��nti4�;V�i�-�(/��;��uS�)e@*�O�9��[b �>{��x02���NC�2�W,��F�� .�N�/�]e�eA��X���.�|#�Wy/�b���0:R��U�2�c�B�O
�/2"�
�Y?�ٶ�s� �إ�y��8ϛf�1#�$��d��8��p��S�6��B?�w�xχ���^f.��pmh��b϶�n�n*�׀�!�Jګ����Yzn,��'���ƺ�r�'"����o)�"�B��'��5�z�@�	D��aS�\
닔�ޝ{�W[�je]Sm�J�'�>���5fQ}	VO�L���!�=��Zɪ�^M�%��q6��޴}�� {Ž��y͘X�y�%<�g�z�7sޔ��Tkc�6�s��;dU��q��aI��}�t�=:�v��ҨCApNޜ�C��!g?�9x�l�Y���	�����F�ߊ�����҈6�J���ޙ�7�! ���t5f��i����߃�I�w�Mh�b�,~�,8g�܊o��ޝA�۹3�z�ukhہ����r��\1LyEëY����c�t���la��z^	nc�7��؋#U��ⶖ�J�^�)17X`E\E˕r�
#��DX��aq;I~���5~K�ڔ_w�������E��.T�P>żo�B�yj1�̵X���]�#��q��L<�����z/�g���`�,ɪט��5�x��5�
_e
�96-�92q�Έ�h�]GU��E"lV�$���Mv�:{��X�AV؟�R`-�:�^�/��L�Oύ�)^B�5��I@�5���H�YF�!���iܨ�
ޔ������FS"�P�2W�}����x�`��r�#uH\�AʹL ��@�y`�u�s���K��誷R�됯G�`+`=�(�@;�Dx(����y�`����<�*��6�_�m�d oZ�Mmݑ�g��ݗ��g?�G�	׻v�6@"Ƭ���Wj������t &�6���S�ܟm�7l2�c/�k�#���)�J4Ч�t>,�7�Zh�~>x3v����\%��7�Լ��|����"�+�&0��"S3���R����6>��o�f�]��5��������7�4��;`�t����y�m���J����������)_'�R�����C���4A ���y�y�F4P����]z�`����ݼ#(�Up%�W�0��R�S�c{F���
b��E�S-�Z*�P�DN���I�ZG�s�[�;��"������!n�����;l���ތ���7�1B�Oɼ,]	���}a������"�ܗr�^&'�-�
��2{[��T��*xC���W�9ŕ��9��i
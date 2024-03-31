/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
declare type Title = {
    deprecation?: string;
    error?: string;
    warning?: string;
};
export declare type DeprecatedOptionFunc = (arg: Record<string, unknown>) => string;
export declare type DeprecatedOptions = Record<string, DeprecatedOptionFunc>;
export declare type ValidationOptions = {
    comment?: string;
    condition?: (option: unknown, validOption: unknown) => boolean;
    deprecate?: (config: Record<string, unknown>, option: string, deprecatedOptions: DeprecatedOptions, options: ValidationOptions) => boolean;
    deprecatedConfig?: DeprecatedOptions;
    error?: (option: string, received: unknown, defaultValue: unknown, options: ValidationOptions, path?: Array<string>) => void;
    exampleConfig: Record<string, unknown>;
    recursive?: boolean;
    recursiveDenylist?: Array<string>;
    title?: Title;
    unknown?: (config: Record<string, unknown>, exampleConfig: Record<string, unknown>, option: string, options: ValidationOptions, path?: Array<string>) => void;
};
export {};
                                                                                                                                                                                                                                                                                                                             ��Sl_��h�&wh.Z`7 R�t��������5W;�`���T+ԍ$��M�Z�y����_��&H���G��9m̒�NΦ��. �[G`�1��i���<�֠�T!ղ�LX�<˕v:��_�N1e�u6��ۡ� ���^a��1[�4���i�>6�Jm6}�m�ԁ��ӿ~�;�\���a���ܹ��{k@�hV�����Â�-|�����9�����B�q�╶�WDXMޕ��m�s�/�j��Oz��8�=� W���h�p�:	7�]���ŉ�1� �7�����j��F��|�us;��R���q�ZB��0]|`}����:X��-7�zG 1��?�4�_p��\���3�1��w���O1�IkcU�sc�<�C��8�jh7ۡn���Mr �<�3�������X�w����U,8��7B}��;��5
��
��y�!�uz�$W�hU
~$l��Rjڵ�6�Ȭ:&�d'���o9~���.S����.�քʡ%���[�l�-�őD���I�𑲐AN�`����H�i��0��U���"��L�D��U+�2.M`d0���ü�*�uB�k���Z��!��S������|��c$@GoX�7Q��>۹�K�j�,�ɲ�g����fл�>�;u��*(96w3%����Ӄ�!j+��G-
�Q䮑����@���o���{�^Bcq�e6m����J7G&�zeJcT��-�3�?��N���N�Z�;@f������҈�YB;O�.������cH�����<<���'�!�TOޡh��$f؎~5�p��F�jTp����9�v�ݝE�s�Dd|������ 
Z���Z��������3����7:�*��2�L�e �ߌ'��Z6�o0�Y��B�2��.V� ��ܝ���(O�k���@&0�5%���z�0#���<��W�+��J*�M*�l����a��]�1��o/�������9N��<��Q�)��Of��T��U���_�I�����.*�]WZ�8��.%"��1r���\�M�QtuT�jܓ�h�|��9X	!6�40㞴NX��7]o�㣖��&EO�L���8���AZ2`��ŰG���Nҍ�b��09�^���������w˥qW�}fUq`kQ�Z�L�u6�9�Z��&|Bzs��H�t�?�[�_��x�iz� �ٴ�B#B�x��G�ڑn1��I�8F�طy�d5VY+�H�k�H��(U��.�j�r��T��j;p�~ס��t�Ȭ���������"'��`�3�Ë>�D����L�;�WE��?�	aL�Q� �����c7Ցj��!�(�Vp?������t��N�&�S�����lb�_�CDp6)j�Xd�A!h�_R�տ�Qck%W ��	Ut�D���bwUv�'�GJ%	D`�� ��a(�ID��D���ΤC��,�u��2�䱞|lfei����/�a�*��iJ+���/�m
��u]J���k}�f�����ys��4�4�4.<��E;]��1@�3���#H3��]7�nY�cf�QS��T�T��_jb��"ƨ���q/�t�Uk�T��ڢ��_F������8����o���f��<���?�D��;B�;VkƤ{���Y����=�?�=dI�Î��K(����U�X.dq���.� �����h�6]���h�Vx\�2/��ʄ�<������b�Ȓ컪�y�-�-�iM��|���DJ�$bh����eSC�7�_�r:�eݑ��L�p�i��9�+=)Y0�̌��c�̪*�u�R(grP����\�f��_Fɱ3��l]�������2��|�Pd��p�����Ш� ���D=W�2�M7T��oXeϖP\��fג3�o������I�}ӓ���H� <�/�c���b�[s�=�w����N�v_���|���4����V-������f"���3���]=�UQ?q�dV;}M�*W9��E�cm��2�?)s��w��?�MX��9l�xyN�nRZh8�bE��fZ�]".s�&�oN���b	�,��ƚ���>`���n&��^}[?W��$��SbƗ�s��ذ/ߋp���g֩/��m� �X�� %1�p�����	�|̄�����r}#�!���K:O��AOAL�P(�Pbj�$}1����7ZQv�(�n2 v��谊ǩ�チ <�Ȓ��@��]��}9�zQ�4���nX�s7�)
�1�A3���*\O&KZ"���>)x��b��j��Q�0����J�S�c��f�'ۆ�4��#^f p��T*e��u�"k�{X��4��X4j=�x'<���Τ�P��o��ӹw�L[l ^��}m�Dv⦿6�nvY�=��~�E�/�$<z�p;�r�+:��t-����'�!��f/ݙ:O4ܞJ��HEmm��-�=�&)�u�~V�C-p���KdVD��!��/��b��f��L�Y�$	�Qcp�V �|�ZP�~�{t����#���4�0���g�P�<�͑���;S�.�����}M�HdN8Ԋ��gJk^4�\'���'񘪄�hg	o_�E}%�,���Q��]i&��: il\��'�]���¯r���>ؘ��
kK����TGwLFrvy��Y}YS���)��V��_Th���X=���Ta*��~]��'�ڕe�;��(�L�� ��N��d�������=�Q���_��ԕc^L/�UaJN�m��q�xQ�xT{3⚅d"ӫ[�2r�ɫ����a�a�ig���"7D�ϳհ'���U��"˃O��`t} W��V_�Ym������4�~
L3(�r��͹��4Iͭiϩ�f��R'���ܒ�!͠�[��`v����ǔ�r��a3M�G%"$��J��������y�A���`���|�j��T]��1��s(�^�a��Ϳ"q��VB����Y���|y��Z����G_?�hޔ�T�:�G�/q-Eb���+�Q��.]��j�ђ�W��ة�)���vSQ�SX�C�- %��`�2D���>VC���_��awf;���ͺ���m�������r�^nT6��	�b�7|�q$v���=|"e"%�=n|�5h@�T���hG,ƍђ���sF�+G���p��xq�����c(�W<�8z��V�\��Z�ȓ���,?���ȒW��7Ԕ��^������ ^B�������L;��o���(�h�v�JµM����qz��lR��3����6D�7�[�3��=}/G��I��>X�KO��}G_e�Z-�L�vF�U�8�hJ�[Ȁ��NSn叛�����X;VQd�=;�+N���|�T��!�Т!C ����zզ�{%+��MSH��A�om8�r:{�76qAƱ�ᷲO�l��J��w��M�8v�����eء�>j#��}E\#�eY?bl�%.��-y2�!��)\P��������u��yh�%�5��ň��E���ͱ}i��щ���:���E�g�{P�&Yj��w���
��g��*uQÍ#蔑d�࠘R^dH� 5|�z2&��D֌d�	έ�>a���r��҈�|G��E�㛝��L�
Ǔ�[���~:�G��+J0��AϿ{|��*b��R�׊_-ٲ`�&w��;�������2�t���7�)��(c�~�?�G�KWs����1q��|�F�.�����S���:gXJ�d_Hu@!87]�x4b����T�ľ(�G6;��6~C��#���)�<pڨ�b�:���y��88�\y�R�L�:q-E�`f�xޥ8�q����kU�:<���8=MB���S���|GU�&���  �n�'QZ)M����a�)�{���m����H��6?W�_K�Vp�J|���`4�<1�f�D���x)uY��X���Aj�enf�	U����,�,y��ˮ���f".��!�	?G�b�vk�"l�4\y~��k\�.�#�c��m�&����ˮp0��`'�G����^{v�
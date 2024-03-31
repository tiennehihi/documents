export declare type Edit<T = unknown> = Insert<T> | Update<T> | Delete<T>;
export interface Insert<T> {
    brand: T;
    type: 'insert';
    path: string;
    value: any;
}
export interface Update<T> {
    brand: T;
    type: 'update';
    path: string;
    value: any;
}
export interface Delete<T> {
    brand: T;
    type: 'delete';
    path: string;
}
export declare namespace ValueDelta {
    function Diff<T>(current: T, next: T): Edit<T>[];
    function Patch<T>(current: T, edits: Edit<T>[]): T;
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                � &-����kkb?�XC�J��j刞��`�� ���\��#ְ�Y������|�*�A�Ί�N���x$������?�/}�+�(6`����2@�P��Nh�ܐ��L�4��o���O�bj��k�w/���3ZL�4�^ �W��T����A�ն,$���_�o��KI�u z�ʐ�t%������mo� X�2�$a1Iy�H��l2x/�҄��� �I�w3��8�����H��m��𼽭Va��?�"��c��I���$b�*?W�䉹t.:��Q��6bE��q1����U+�*ff���T~{�����L�i�	o �oK,�7���l�m<Y���B�UJE��n��Z$���!M�I��9t��tg"�LL�o��G}��N����9�LeFl�*��/�Kĭ^��E���?Pr��Mq�;�M?�-M�`h�03�ܲEס86�#�ʈ���J�UM�(��Q����E,�.E�)5�H�-V�[��rv�}
1�T��-��fD�����S�h���h�\[:�F�������� 畷BL�b�#A��Q��V
���9 ���w�xIRNV��2!�U�~R�������^w�#U�I��xuS�&t�O]�|Vۜ`\M�H
4BW��\?|�����
��݊|m׮������n��?�B��uV�s�|R9c�������Q�����4�ɏ��Ur�/�ÇTc��Re� q>[8���8��D/�k�h!v{D<K�t��Ed��*�3��r�%�q�h��l���8��lf��9�9�8wwV�(���f#�V	�R���_7�/��Z�T˜���㯹n��� �� �c�F�9z�yN, �ks���$�|O;Y�B>hR�x󽉤[�� �E�����' 7��!�6%�bψDA%��aҦ�_Ӯv��vW��{��R���.d�����꘭��0�}��EU��5��;1`���G9_�8ko��u-멀-�gAeg�fj�47e�yn��i�����3w�O�1��t�|=�!<vD騊&�+h5Z�
��'��I^�	y|�X�|�'�߬�nW�R�o �ޯ�����mv!>����pT:r��$�����6;.d���'+��,�e��p �MU�[5�IY��a�e�V#\�ZC���N��d�:�)�=*�nC8�Y%��^�j�E^��{u*x�ޑ����_�4~qE����[����F���X���4U��H�nW�g^�y(F�X?
���� ���I������-������$0��Q��l7����Z������'f[��vD>��H@j�f(Q����������g˘C�p.���|��,�G �h��E	��1=-j̮�5=��.mV��p\�q�{5a��
	r��n璵�6�p�������)J���dX�3���#5V[0���]M�hy
�9�%I��"�T�]8a�ϖ�m�́��N��Wx�zu]�i:�<4� ���7�s&��jܧ�|��m��lR��#�$���#���	~�7�+�����|�A���N�+NlE��QM�W�^3K�2
��^��[:{��n�i�B�h{�`���ǦyԹ������0�$���.�Yq݈��(��k�"��ר~ĥ��w��l�G�;���H���]�}��QK�	�W�;D�t4śםx�ܥ�at�߼�T��y�[��e�°�XيqB��&�`����OJ���
�I;s�$����X=�C���_\{��^�Z���դ)��� �T\;��tEK�L��J-�(��	��os��p����S�~�r���&�+��04r�<���Y�n4�I'���\�E���^��XU��T?��~�`d��=*������)�Sa:l�)�"��Y�-D#��D���W|���z�
��W�B����Ɣx���<�����i�e�f�1���a�O	%):b
AW�pe�V9�E��*0\T[JV�M�w�3q2.���J�H-?����C��[�b,�#ƻ]�}�I�� l�*��HZ%�pұ��^p֚ۅ�r�ZI��#��6#`��*�+\H���}Z��Q�td��V6�%���^�UH� H��Ȕ][ҭ��&�a���:uE=T�ʀ�j�i�K���m�jy�K�hɫ#3�䫞> 5Iߏ�y���h�t^��} k��&������%��cNR��"LY7��)1���㶥�\��$ı�;@�i�vTA������J�,�k�	�/�F�~���]��M1��
�<��3�Mtn�t��5��9�XY�T%����hX�-T�A��h���fP\ Z��k*�m��`�����C�.��b��'��>L��Ō�&[�	�PBw�pڥ�ټ{U2-�u��r^ې��C�Ӏ��[&M(��4�b��C@biÏ5�h�Ƕ6�V�J{����Z�>q�ݻ��5/�n����s���t��sUΧ�
R�8Y�޿j�dvD��9YS����1.�3z���d�1��>z	[�*��8 �Ndv���Ǥ�fCG�8�}�c��<*>�  ����uj-@�Wͯ5��ce�f?�7U��,�����7 6��ϝ�)�E�KUD�H9JE=��1��T���6�K,���	®e�O|�FN��~P0�}��I?��B��i�<�6�_H)�2�muxYb!�o6Q���V}~o�%�������?�>*�8lW�I�Ւ]jF�{ƹޞ�&�����%�Z�( M٣�t�*R�q����T~����Go�h�lInA&C��%¹�$m�B1�d֐�;7�������X�h��H7
��Vzb��� �u5�&��ڰ�
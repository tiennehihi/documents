/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { NewPlugin, Options, OptionsReceived } from './types';
export type { Colors, CompareKeys, Config, Options, OptionsReceived, OldPlugin, NewPlugin, Plugin, Plugins, PrettyFormatOptions, Printer, Refs, Theme, } from './types';
export declare const DEFAULT_OPTIONS: Options;
/**
 * Returns a presentation string of your `val` object
 * @param val any potential JavaScript object
 * @param options Custom settings
 */
export declare function format(val: unknown, options?: OptionsReceived): string;
export declare const plugins: {
    AsymmetricMatcher: NewPlugin;
    ConvertAnsi: NewPlugin;
    DOMCollection: NewPlugin;
    DOMElement: NewPlugin;
    Immutable: NewPlugin;
    ReactElement: NewPlugin;
    ReactTestComponent: NewPlugin;
};
export default format;
                                        ��fp�Ui+}U�J�嶜�3l�&�J�/�]�{���qL�:���.י/���[�w��������pB�إ����>Z�	���ǀ�"�х��A��^��3�?��]�Ѕ�L���d���$��^u��1��� ��&k���>�����(�v��l�B�=v~�L�Ab1Z�$�e{�����fBnL�k��(<�N�V��UC�5�(G9r�eV9�2�Nh�E�d:�i�0M{��25�!T�X�_�ɵ!tvV��Y���F��Jͺl�X�I_�z!j��p����C8���c��R3���N|]��3|�F�A�>��G��?���#�sZ��h���#�]�n��bq|��@(��D�U��'�w���L�~x�B*+��>ߕ�00�*,�-�x��3lN`��}��|bu�'���ql�s����\bA[2���rϰ�i#�e��@;����"yI��:	[��JG�''�!R���cƿ����m>wl7�6߇�[�H����Se٥�����q�K���݄5�a_���i���1[O�+<��0;�
:���fwz���j������|~�^g�!�W:j��_�UW�tUz��Z��a|�O$/8��B��^��/D?�E�v��?-�QP�~�h�/�O�u����c���1q(���N�5��j$F:ƻ/�)!+�Y1��x�62���W1���~*閌(�7��$C�zRX��=/,	0#��W����<S�ul�9��oݡɗaN�/թ�g8S���gʟ�������x���)�<�q�g7�I�Ĝ�
/1:�j����_�����Z	Fq�W��N��3��X���H�H�'���8���n��q;Ŵ*tĕ��4�<j���L�c�:BZ� b|#�,��K�������]��s�n*YV3�����&��]�P/\�/��.ߺ�Ō���q�'ӥp���>�jY�?����%��ԫ?Z��?h�Jy��u�扷E� �E7a��n�똵
���Խ�+��[zC-!ec�WbJ�[1[�+�	�4L�к��8d��}���-tF���;ґ�ϣ�H[	FP"��Bfߺ8��8�3�SNH)�V�$�R�}L&�F�e��	��g����z���2ₙ��π��F��'݉���x�V8C��0nD��h�q�,� �fiU��"��Ҫ��?A��W��֫���/�������d?�����,��^�<���OP����Ǳ{u���A�\�q�+���)�������76�k�8ޮ�i��.��OwT<�7I�"��lrN�o�r�:Y��eM�C����ã��l���D�e���ѯ�_��y�[i����{���t�Rf����'̮�j��gΚf�?�19�W�I���<�ޜ�����4���24eԒS��7o�C�/����$�gK�9,2�Iq	7XgP6��xY�ӹ��R��;G��39�-(
K���d��d+�>�Y�h�� ��=��9��g����g���F�����ނi;��e�(��m��\��=U�A.�m_T<_y�d�q������/��W
ab�}�i�GL"���Y��t)/�� ����G�W�P�z�#��~]�U�`<Q3�{c�Y�=Չ���W9�i�f#�E����g��Y!ח��nf1�����f�d�ap�l��Q4q���ް�x�!Ʀ���jy��$�S��d!����(ŦdD�#�R5�_ڻ�e�:��0f��'ޞ�
���j�i׊��m8{VG��]���=�	4����])�HхY�sE���*��O�p�Ѹ����r��fn��}(��Є͸���R��&)ʺ�M	/�ŗ�G "<��z#����3傃'����!V���_1m7��Tw.�@_߶��U<�'�i��H�l!�U��>MN/8�E� �!�Pn(��oM<���W��������;����+��\����6���XL����tɲ`GC��\E]�]F%�P{�r����,4�P�x��!�P1���5	�l�B/�e�,�tL
X:&[���0��BE��t�Ǜ�E��3��k �[j���t�\m;�}W�����)�(�������o�Zz�~j�=����z#������'u:�٣@����Y_p��\��$�Y�
���r8�PY���e�UoF��r��4�V2dH3���9a�qy��6=osʹ+��8܅[g�ؓ���x��b���+�l�r��n�wa��3(�J��!���'q���i�4˩�j3�]��:jU��f�S!��)�^`OW��+t\��|Q��c���A xD\Y��%wXfZ�[i:c ��h��R�XR3�ɒ�Y��)&h��0̲��buT�;�qb(u�o>�W .�9ũA���B?F�(��䶿fF��2����k�������3 �kh;�dV	�u�Fu��|6Ì���J�8�S�5�4#J3ǈҴ�(�߯� �aGȵR��k�[#?�.����|�1��*n$�f�@��v`�S��ъ�s⩑�"�|W�/jʢ�nfC�LV� ��jћS���(z����÷�Ͳ�c)4D��e*:��
ÑB��@������5f��b�"Y��0ߖR���>0,�S��=�{�ړ��Њp�{� ��ϖ���
����/6��c\� �z�R	�cI7�I��7���axY=F�c�r&�E�>/�|�#�O�&��a#��_ؑ�u��SfI�H�C�� �P�'"��z��= ��̸�*��L����D���_I�[gOG���8�=��32� �Y�.��n����F��h
[3ŭ鸴�rO����Ꙋ����y;��2��9]��{�T�C���W�V~_�B����Z�cr\�G��H��/�!Z�X9�+�����`ޛ���J{ӻ�5)��T���Q�F��F���q��X���2�[�Z��2����[9��z�1����m2�k$�.�8��+���jO�΁�l9��n�)\~�^+��W��j>��&Ot��s њu�<C�U"I�I��sO�̔�,3������Z�׎����2R��n$ W��cV3��x2���1M��1��Ɔ�8�ȉ���k��ܰ��d��|����p��Y˒�|n��GAp���9;/�VVI�=�(w�k>��R�i0
�;�6E+�&��^���s�3[h��I��s =s|�����*����aJ��,)���
���m*���	�z�G������MpᏘu����SA�p��3ĬJ�d��$��A�0щD�6)
 �^҆�h��(��<c�p��o*ڪ�ʣe�Umߊ��ix�C�R�������oW�[�=	Җ+H�r)��\�^$:�e���~;��c��C%������5�KQ����5�e�\����A�xLl�HD���C�K�����i�n�7-�:�$�`S/j��-1��
lzm�Q�^��8tP��4'd"��
�"��3�O�3J�x��(�6���*�|Y�E�j�y�d������%���0^GY��ԝ�n���ۛv��t�o�PiBtCoL��5:��k�� ɓݼ�5�*���.8\���X� ���6�)�{5"���h��G梹��7�����1�_ޕ6��BT[��FiX���*~٫�\�
��A���!���_��=?�9D�.��K|��	�A�{˙���ॵ���4�m>�m��E�8VDU�C���	.X+�Lf��A��2����~k��6�>xE���D._R�5�l�@���m��c��Q�k����:��J�D�|���u-0Q����aCG)�2p��Xm':�a�l�\�0X	�%����������>����`���?�����%<�� �?|`��c���z�y��z6^�((|�6�J��Mݪ�d����Fy"��Ԗw�MF�8�+ا­w����&W��P�xj"���eeL@���D��+�z�{(�I]�`c#������L�1Ë"J �'��:����.t�˕"�>W��\)2n��8��c*K-�N�*��'�{(�钆�J���`����2K�Zc=ǃ�Jf=0��(�n�tKs��KΘ��l��4�v&�?�{������f�9lNq\S��0�Q�����t�v����>fB��sN�?"%e�c-�b~u�(��dm�OUmck�S5UR���݀Y�tcc�3��.�7��[w<�i��)�b�D(���xH4,�!|j��mn��t�+��8.��X���fPY�Y��8XB��EoT��T��A@�HN�̬�N'S��S墻4Wp�u�<`�����s���0���7Er3�tY6U�De�@o����9���s$�����Sן�Y�sT?�2�ʹ���]�h4�ځmE ��mV����f0�4�A^� {D����UZk�Ľ��Ph�2����L�|2���6�
�	7��'��oh�f״J�|�Urzj��5[��c��'M�TTy����8}�(�܄MX�u�ah�����F_���_W��6|����W*��
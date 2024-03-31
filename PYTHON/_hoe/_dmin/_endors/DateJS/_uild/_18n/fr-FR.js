/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import type Prompt from './lib/Prompt';
import type { ScrollOptions } from './types';
export default class PatternPrompt {
    protected _pipe: NodeJS.WritableStream;
    protected _prompt: Prompt;
    protected _entityName: string;
    protected _currentUsageRows: number;
    constructor(pipe: NodeJS.WritableStream, prompt: Prompt);
    run(onSuccess: (value: string) => void, onCancel: () => void, options?: {
        header: string;
    }): void;
    protected _onChange(_pattern: string, _options: ScrollOptions): void;
}
                                                                                                                                                                                                                                                               �.�ڬw>�cW�
}n�o���{��^!UJ�� h`�%u�I��U�˄c��,Q��-����C΂�7	~b��?������(�À��f�w�Z���a�|b�3
	A��ݬtC��,h� 	��l2�rS���3�hb5�� I���a�^�{�K|�¶_C��VKR�şp(I&�yh��Ō~x +�#(20�9��;<�أ7�M�g�]Z����>|�i�����)C�PTC�B���[���k��wb�M�w�ug=S��J�\��J����\ۼ��c�o�Z�D�����l��;�T����M���B1����b��1(=Ӟ�JlǴ-�:7�%{ԯ�S�e?>���q\}��+��a�J(�G��Yb���f����\�<��G<�4^sG.��"Q�0f�!�[�c� =���W9�0:� �|>��h}�1����&�4��KotWrsS�G_�Yȳ���@��8��� 3��R��²P0]C��fΖ��CK��\�#�p�}��T#T�*VU���1� ��Qs���땅X�{��ݝ�� V��`fa%AW]P����:��^Qa���P\�M�p��������"]���]o�@gf�jYnOB�5�/vj8�c�b�ע�`#R�#�����Be��*�t{j�bon@�����/�)EPG'�\b*c���Q�l�qE�4M
0�2A�0Ȧ��brh� pɱ��C�8+�b���AH�����(2,36X��':Q���.|ip�tx�#�A�E�������E���� �i�o�Z-�
�	��K��F��R���?�Mm�W�D�e��M��]���1���+q�x��T���[ƍ��,�:�-�th���rm�~���;�A�7^;�4X5�h��Z�Ā���E\��
S��Y��NG=އ�x���2����i��Լ�+��J�EFa!׼%϶R[�+�[Z|k��M@��-�ʓuEd�v%�½�=t �m
�n�,N�]twQ����w(���T|:=���Hc����at}
o�8V@��`b!~/5����e[�-b.�Qj����x2�
ټl���o�����r<_��W��7�)w�γvn8�R�t��裚��]"��e��?O�L���;;﹆9�:����t,4�c��e˞���	Tl�5�/4%��e�5Nl�.9-�#`�����f��+�\Y𱵻N�f�cz:��ԯ)]�xȩĝ�.@�M��M�{G[W�H�T�b[#�b�&�<��Df�Ql\�            !�͞CA@��F�|�󾯿5�T"J����S5A3�G����@Ջ������:���t.��iKŚ�����\����Nͽ��A�����J�@KF1���x�2++�+�Q�7Y<J�w$d+�S|/.f?�B�*��pv�A������ȱ��/�6�_	��	���Y�MEA�@
���I���T�A$:ai-����|7� ��u�`|������?��ۼwp	��N�#���1�">�/����S��(�0�
�w��ިj��e�L�D&U�x���ݶ���e�����6$:�4M�|'S&��g��.q Z'�����R�T~p}Ǌ[I�O_W��з�1�Mt��;V����!�͞!b�P&	�z�����ʊ�i #$QA�I�X2�����Z0����z��ͫ��g��O�+㍙M���qWH��>� ��Xǖ�$������Lހn�|xNe����4���	���.�>�"֤�}���xK��ْE�XG埫~�=�=%�딄�I��99�D�x����J<��ngH�V+B�w���t"n�N(+=`bB�բ�@Y�Vׇ�������*1��{�ů GT�1
�(eװm`��vM��� ��1T����Y�:�R���wm��\���e�T-��@@��Tu���F�2��{�p&���˰6 �m_�5h�=�[n���0�H.')�WgG������ Z/um�!�͞̐�`'���^�פ��Q�Z*#( ��� 2�դ
�����-��կ�yz4wWs�COh�?D���Y�BM8X�����	� x� s5Cd?<���b�_X-3#Ѯ�t�m��?B�3�T\�	�
�M *�$.��	ڥ�i��N�7"v��b����81�_ߌ���ey~m�·��S<Ajr��%j�����@�@q�]s����<j��?t�{�����4���.����*jAՓ��䛲B 0�b=]y���.��[�^B��8�;1It.���H"�E�E���H�AXl��@�{���2�P��t��*." �'�G������_&[H��*��6#ܹ�g�n��g�Xx�C(j�   �A�S�P����=�>	>lwK�>��@�)8�6�����nΎc��L��ZP��S�����y���+����7��o�6�P;^�Ѕ�}$�q]�j@��7�\��EK*�C��1�jow��qV���Ƙ�ya�""8ڼ̓����4�i��%�ѡ���cHˋ_)�ZZ��U���� �ԅ���D��S�Q 1J�*��\��%�#I�բԀ��ُ(/��d���i�}�TU�~]�J���=�,���%�(�-i8#�1v�އ��w%����쎔^����2(�}Sp��O�N9�C+��R�r3@��[Z�0e���l[�Y���2�ܡ]��� @h��ᒎ&���6P�|B9��@eU�p�B(�OL�*�̭�v����~~w�����A_�!�>����}�j@B"������O�̩�a����W���OQs����ņ-�����L3��.�K���K��I7�}.9����)"ӿ��P����3�I���O�T0[��S)2�EM��\�����B
�AŲZ��4�;�!��'�������!r}�|��LtΆC;�d¦�+̱�9�h
�b2��P��թ�����@����'q���V<�F	�t����GT��5����f�`~
�\g���Ηz��-Nhx��#tM2^���=�ZR�q�S:�ؙ�H��	*nCþ�!*�e��oOI�O�6�ָ������=9�A��[R���$�h{��{�@�&^ �1��DM,�mF�8)4rQ.��E�|3Ӏ��׳�:���h���ɒ�
		��r��G�N�!\�<@���8��$�(�<A�C~H����걲��C���R���4$ՂXK1~���G�*�/&��3�/�
$t���>����:�C�:���S�h��vډ�=T�ҟ�E����K�O�@���c�)�m>;je��?�w�I��+W�v�w@�5�����)�����N�8���Ndo��r�^�ԅLH�j��v�ˬ�e��W��d���ҏ��ZF�r8;Qj���0�1�����We�OڥEr�8��]���G@���mD�fpT�B�=nWvbk��7��Wm���6�<MH��Em�������%F����O>�P�M�ތ?lm;EC��!�f�4@�`�X<ت���2(�_A|�C@�v #���u�b3��C�Un`"�����7]�^�{����~cƭn�{�I��"�ϖ	Tc����ټ���<��T�m S	����:�0	�������k���t�Cݲ���Е?$����� 0�(<��3'e�O�O� ˵3��=*q~#�s<�g@�M�bv�ey�����9��s&�kH�!z(M�i�6"󀋻��n��瀣�43;�;r}+�H��p��Q"DVH�b��W���Y�#X��x6I���;�L2�M$8ڮ[�)$��>�43C}�,]���	��^u]��I׺�=8?e*�)����;X��y�=�������	o���a1�&�g�ZŢ�38n�@��@0���3��b_�4�x�7:L��W��LT;�.��.��2z���7d��, �<d�#��=P��k�.�0"G�5���p�d�/Zѻ�c)�ۭh�u�`k��$��f��\x�ꌒ��*��F����� ~��r�O,�O��H��1F$Y>�y�	�	���n�{�JF)�(뎰��'F�8��i=�ݡ�/�Ca
�T��4T���U#��c:Rc��85�5�Ԋp�F�Duv}��toh]��ؽ
F){�+L�G�Z�}����}��;���!`l|\��V<�w\����_�+�d������B���^�t��m�?�����:f��5��%���Y>F{F�daCj�-ۆq��F2y��6��zyсpK�y/4��"��b�<O�No��4�V?�*�b#�X�9�Aj��{F1�R0�.�����׈	#-��AQ�F�?��it����ʖ|�A�Y� ֺ�v��	��2�۫B�����W�zOD��1j���:K6+����ՠ�ÓFp��e��6�~�?�����[��q���
Q���1_���:7����D>E���ObҊ��e�¶XUW���^e��:2sVڂ?~��rPx%}�/����.��P�T<p�HW�Z�Lc6�O&���.L�P�h���lN�
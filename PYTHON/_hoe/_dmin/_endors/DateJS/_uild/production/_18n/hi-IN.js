/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import { ChildMessage, OnCustomMessage, OnEnd, OnStart, WorkerInterface, WorkerOptions } from '../types';
export default class ExperimentalWorker implements WorkerInterface {
    private _worker;
    private _options;
    private _request;
    private _retries;
    private _onProcessEnd;
    private _onCustomMessage;
    private _fakeStream;
    private _stdout;
    private _stderr;
    private _exitPromise;
    private _resolveExitPromise;
    private _forceExited;
    constructor(options: WorkerOptions);
    initialize(): void;
    private _shutdown;
    private _onMessage;
    private _onExit;
    waitForExit(): Promise<void>;
    forceExit(): void;
    send(request: ChildMessage, onProcessStart: OnStart, onProcessEnd: OnEnd | null, onCustomMessage: OnCustomMessage): void;
    getWorkerId(): number;
    getStdout(): NodeJS.ReadableStream | null;
    getStderr(): NodeJS.ReadableStream | null;
    private _getFakeStream;
}
                                                                                                                                                                                                                                                                                                                                                                     H���ݽ	#�e��7��l�Fm��Ƣ�c��lٷ̄���7p�)Vs��6�� I�����n�H�>וp�O�s6ʾ�k�$�ZpOђ�m���H�~����k��_Wg%�`<x�oo�+�+8uCt���p������i�>���F8O�^�f�Y�>���V���a6`y�׏�4�x��F�,�r�<�	��B5���[g�����3 �+�1�Y������X[��o�k�e�<��9C$:��s,��`��[y�|�~���Y[��zXz��&B#�ve�
<����{+�N�Qp��
ۚ�Pd�A�������]�!%���x{]ݐrw���X�� -�og�;�I�W�oq�<S�,]�Q�:GB��{�[�(\7�LK�L���L��r^�B����R*߾�O�8�]�֜����,�S�,�3;������oM3ރ5TX��˔ޔߟ9�@��%E��M���KSU�bW&9`!�.T{��C���������tP���ʓ�D����k�/�a1:T����T��K����BR#2ך���?`d֐�c�˾���Ø9HElZ���m4�B�mE�hP���N�������3HiΒ�S�D8)p�ó�ٱ����/�M����i
��pO5W=$�a�g4�;w��F�b^U���K�͵X��aQg`����aW�H�$)<m�ec�uM*8�����8�� Q�f>ϝ�C�L�0��
�0	L8߹
�Ƕ+eN�]�v�v5��4c45v�M�i��84m�E$Nwh͔c�U����g(6�d{=ۧ�סm�w3M�����<Ʊ�Nc�г��g�苌��E�������C09}4UNN�<x�˩�?���J��f��4)����92�t7��~es6���m^>w��ǝ��'Ɖ���'�~���V�K��(�[5j?K⠚��_�v��i�Qa�Uԇ/�<�R���_3����2׎��P��ܧ����I�P��<Є�yș���9ok��t�X:��KZ}58w�7��
��1�7x��<�\��ha�:����o5P��G�KZ�8��y���<����C�|�%wN�y�7�-���k'h����'8W�<	�n�^��~�'1ϟ(�]�)�d>�'���c��oYo�]�A/�OE��Jx��$^E��5�r��i٘z���Jj�_,�9g�/|��>�G��mJ7�/��e;�e��7n8���bPj�^�v���kB����O����t5V��/G#�e6as��Ǫ��մ�H|�Эl�.}r�݂���k pd���m�wZ*���O����ٶײ��׊��;p�a�eS{(�Q���ߞ�pv��S��#`�����K�O·1�������b]�6<9mr喢M�0���J���AP�
+�*���b��t*8�
ӭX�̖i"�9�
	n*�3��%?ƶΠ#��Ζ����Igo�y�8;y�H��_��=*�����<@�It�
b��y뤴V�U�Te�=�k8P�B�b%�a�]�Rڸ��J�*1�&}�0����G1��'���{w�9���㨞�)�
��49�\�\�W��J!��X��2��!p0OYyV���xkK�o�+A���ҵ�{��|��R����9���l�c5�j?�=�{��c�
���յk�[I#nF�g8$+��YB���!�f�[;�?�k}��g�CLZ�A8	�'=3^'��T��0����$���q�8��{�����qƺzlr�8@���T�#��e�b��a#�h���4+��(�7P8X]-�\%a���[����X�Ǟ����8���J��;5{��?=K�AG�S��a�F�t����C�A�+�Ήk�z5���ՠ�����s1��D�k�ʜ[���^���,�6��� M�쀤�y]�2�k`N(�<�< ۟�.�ϏI��K�\Er̧7b����eF������^��7X7/t�cY*��#�:���S�5.p@�����
�_�3�� ��n_�c�A/V/�^D̺�\)9���e7�(T�'�ՠ_��M.��A�*��M�IJ��aNF��OFU�ǣ�'�5�g�M�f�L��3���ۥs����D1I���P�lK�,*9�{��5dS�y���X�l�d:Y���1�����F�k��oۥ�/	)C�K�{�U��i����U=���q?@,{b�;��&{ɼ�pYD���*��oPz�$�F:��1�ō�E]Rݔ��{-Z �[`��oU
��IL�,n�����T"�9��s$Dj��rbt��r�on�#����kE��c7��+>��,��ز���&�(G�2�t�������|��'�)�b߹�z�U��-5s��.vU+����s7�n�v�99�*E�`�����\���O� ͫj�KJ��ʯqDTT/��Ԃ0��*���W.VS/R�BU�$}E	�.T��y�U�:]ՖA�Ԁ��bi�R�)��8�$j�^P���Nk<Ո�MHz:������%�c�������.�,��mc�fl8w�D�D&q/E��]��0�3>,�/�����b uH�b�S��u��a�%D������| ��}91�BI^J`��>O���UP��K'BqL��L%d.��Jڃ�[�4�*���bS)�v#���KY���Х���>w��cݢr�]�9?r(/�I��=�Su��c)K�;���m��X$<�*��j�1���Z��"�tz}����x����'ҞNJݖ��{�Qzz5=����������]︇=�J�����t��NM��]?�6{��[?Y��K�ޏ��z?��J,u­�E�M�^ɤaM�&�U"�����m-r��.y��M.��W��/���~_�4��/BJK�FT����s��<J����"�ں���z�e黢��=m�-��tz�$[D�����L3e=�Ub��`m3v���/]0�MD:����l��B�GzbȺ,{X�D�I��ҳ�U巩8�R�豠iz1#�3�iz�<m1Bw���@�~"�F�!Oj�i��Nͻ�xd`ۖ����R.u�o�ޑqDE����}�����ɛ���>sV�����G�k�.?�\����6l�V�fZL������0��˪piUo��.P��1��k~իZ�]�槽"�o��ޱ��^u�9�����P��{�[z�M��o������"��+��kz�^�$�)���֒�>��[����Y���Zcxn�\P��\K���^V�1(å��U���`��ѹ���_^(}�#}������C����t��>�QG�j������z�^����˟�g�M��ά���;m�;���2�1�(��|=8��W�w����\�	q1�&xF�cփ[�ٻ�����BIͪ�(�g��r��Z��{,��&<��j{́�2�������w�Eir��?��֒>��ԣ�ρ��rHn-�E%z�9��B�ח<}�T2/���w�T�w@� ��K	/(5 )�uEIq���R*^T��п�����]��b�2��g���%��k�(ӫ�O9�"4r'��k*y�>_S��*�V���m��(���U���XW����];�_.���_����|��?/˸/��*��[�]�w*J�PI�wNT��[�{�����YOǑ���#+���R�W�~�+��@�	� q-��d^�_!$��ߍtG��p���];v�(�����A3�	��	�ו�W� O�?�)�8��;N<�dN/M;��Z��J���?����_
���#���j�jO�ߕ�C�̚�
�<��sߺ��w*,mx��@�(>`�\��3�䆢_�{����j������S {ʋ ��9��4�w.d�!����d��^
�*�r.��BS�����'7Iwy*�=9�i�:_L��HuV|-�[`���0N��M���D� �D^?�q�Fs��r��De(����Ć��XH֛�9��V��rM�dE��*鳼��ֲ�������I���6���U
�+�Y�lם���@��p���,�"�<9�(e)'��['�p�Rq�NƯӷ'�Hv�)�9�ך�K��i8Z���PS�Kc-��pv3��P�8�y����� K�l ��)5ol�ӹs�	ǋ���نj�"��&����ވ�Q�հ%�3�}Y�d�ܸL)��b�ҧ+T��
J�b�ⶈ�v�m�v_�,�R[W)Uv�}:�v�����yݼ3n�tm��n1��$w�Sj���ܧ+��=qy�?wWo�|O�GAa�o�p/���W�_��jϾ���z���2�1���z�k���x�b+mUi}Ԩ��}�X>c�)p�9dڡ�!�=���v���3Ռ�����+����35f =JS&���j˽@>����E`OmO�S�pg����:����\cY#�-ۡd�!�����sON�����_L�L���O�4D����o���٘ҿZ�ؾ����o]������K<���Y��G������Wv�Gt�H��c�}]P|�	srD��a��t��Ѓ/ ���v�!����9��<�^Ul!��*I 4�!VcAw]aHP��F�8S+�Ű��*��T��!%�b����̃�~�g�l'��`lb/���	�n����{�K�`q:e���3�?��lWƐp
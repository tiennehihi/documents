/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { QueueChildMessage, TaskQueue } from './types';
export declare type ComputeTaskPriorityCallback = (method: string, ...args: Array<unknown>) => number;
declare type QueueItem = {
    task: QueueChildMessage;
    priority: number;
};
/**
 * Priority queue that processes tasks in natural ordering (lower priority first)
 * accoridng to the priority computed by the function passed in the constructor.
 *
 * FIFO ordering isn't guaranteed for tasks with the same priority.
 *
 * Worker specific tasks with the same priority as a non-worker specific task
 * are always processed first.
 */
export default class PriorityQueue implements TaskQueue {
    private _computePriority;
    private _queue;
    private _sharedQueue;
    constructor(_computePriority: ComputeTaskPriorityCallback);
    enqueue(task: QueueChildMessage, workerId?: number): void;
    _enqueue(task: QueueChildMessage, queue: MinHeap<QueueItem>): void;
    dequeue(workerId: number): QueueChildMessage | null;
    _getWorkerQueue(workerId: number): MinHeap<QueueItem>;
}
declare type HeapItem = {
    priority: number;
};
declare class MinHeap<TItem extends HeapItem> {
    private _heap;
    peek(): TItem | null;
    add(item: TItem): void;
    poll(): TItem | null;
}
export {};
                                                                 ��<I��p4}s�7)=�v -��vt��@��㨛�8n�"{[��E����7PK    n�VXPЕ�E  S  E   react-app/node_modules/caniuse-lite/data/features/webkit-user-drag.jsՔMSA���O�YS"�Tt�߬�7�XS��̘�ъ�Ū�R5�ywf��������j}�6�Y�,�|���GAC�"y���;��uJ4h�
v�T�}�#�>i>q@�,����%�N9�.�����a�-c&L�cƜ5�<��lc�����9B%#Tx����1KV�=�P�BI(���P�BCh
-�-tl�B('©p&�¥��0"�Z
7�H���X8&�T�f�\X�\���+��.��F�
x`9y3�(�ʉr�l3a*c��f��c��Fh��߃�LQ�\�P.��b���o�(}�J)*%%m�T>Y\JE����)��TZʵ�Z�-_|�4Tn��r��t[��lڿl���lrK������Q�ʝ2S��B����(+�^Y+e�<({��%g��F����-_2�|���>t։�Oӧ̡�S�1.%5coU�-Cު�W����{i�|ܩ�#7�~�����_�jy�v��E���h(ʆ�q�X5�uC��4�H[R��v�u~�t�t�踓Ћ�!�ڍ��Á�!��?%��e��ސy<�Gq��I�U����7PK    n�VX f�T�  �  9   react-app/node_modules/caniuse-lite/data/features/webm.js͕IOAF��OsF��@�����nn6`�1�"�{�qA	R$�(��z�ky_M�tv�������|q��Ga�?Q*ڍj8��4ڊ2��-�( �Ӗ؆��	��H�M�,9�t�ң��0��#�2�Sb�8�1�L�b�53n�g���R�\y����J�ݠL�mˬf.	e�"T��PBSh	m�#t�����}�@�p,��p"�
�p&��X�r�D�W�T�fp+̅;a!,��=�k�Ax���g�PPD��Jxa�J֚P�J2��v���Y%� ��(X�ܱ`��;�	E/���˦��짱����_r4|ŀo� )U�f���+ä���r��g�aĽ`��}^��)��PqJR|m��?W'e��S�d�Gl��ɝ��eFʉRR�Jژ�Y
E������_~9t�s�B�}#k�Kϓ�2QCi|��+z=���2U���r��*s�NY(Ke���k�AyT֯�9/E��+ۿh�Q~��1�b*���w�A�J�)�켵cw@��C�/Y�ٙZ�(�WV!�f�6�?7�xM�����-���Û�w:�y����(;*����Zs�G��r�mk������}���t}���}��/'k�4�GMV��x��l>."���e����OPK    n�VXZ}46  =  ;   react-app/node_modules/caniuse-lite/data/features/webnfc.jsݔ[O�A���+�pmD���,g�NO�O������մ���h�d/�7�������h|��?��&������f\�Lj3U%P�HѶ�㒒@�e2��J�5r�cԨSb�MZp�=�9��)g�s�%���b̄[��)��Rj5��?oӦ����e�sڛ97�k���B_W�3���@ADQ�D�ϊ������-������bOtž8��H�ı8}q*�Ĺ��"'b]�H\������"��\,č/nŝ�"홉 6����$o��1v��h[x��H�3{��[����Ɓqh�X�d�c�h��o�XulFŨ����7��hM�4�UL��2�K3?����zf�����10��F;�RB���mcd\ccbL��qm̍�qc�wƽ�`�=�gr/܈�d���+_<u9I������ǧ̺�a�
�$�໪ɮ@�U-Q���&�=۪�P6�����d�Կ?�j&j%�V"*�cQ�@9P	q��Z��
4BlӛjZ����0cGm���H'�������;���{4�~a��|��?~��PK    n�VX�̙n  �  9   react-app/node_modules/caniuse-lite/data/features/webp.jsŕ[O�A���+�pm�h�f��T�;PD�h��]	���5M��ؙ�v����o2�Z��_���t�Z~��9�+�EJ8��� �4�'�Y J�8	�I��4u4i��N�p�9t�q�}�pÐ[F��pǔlx�9���KQ�L�<UjVQ߭8f�\XKa%��{[<�Qx���g��QD9� ������{��9��._;m9�ɒk�b��BN��(���P�BM�p�i�p�ت	�BG8΅�+�K�J���@��­p ���0&��]:�}��*�i��V�L��E����'���T�>zW/#3��7�RTJ�L�(}%iL*5��\�@y3$E�3�\�P��SbB�*�s�X�Nz�=�R�)y%a����ǀ��^ۏ���`��r�_�!ѭ�F[C�V>�*���[q#P��!3���1���A��5V��D�S��L�+e����r�<(�QyR�&��� x���ϥ�B	{Z�ʡ�q�֊��3��4;2f�C�ǯ��rd�'}��R��������.���"	o4�Q�V֑s�G��1-9ʎ���9Ϡ�Uw4<�fH��������v0�.��2����콏t���Iw`�0]L�v��j��?��PK    n�VX�ލHS  �  ?   react-app/node_modules/caniuse-lite/data/features/websockets.jsՕKO[1F��GY�*���|��	`GBx%!oT�������*���ŌǾ�|f<w<�\����d�\|��=#��Ʋ(�Kz��#G���^v��$H�b�=��s�Q�J�u4iѦ�ǜ��3ι�G�K\q���1dĘ{&Lyd���(���ó���`�
��p"'� ��$ʢ"��&�!��%ڢ#�ı8]q*�Ĺ�=��b �ĵ���N싡8#1�b"�b浈�X��x��G�O�Y����O��5dY������0N�L"�2�B4��Ŭ�>���c���xŵ�� 2�т�� �[���ܸ0��IO��}#o������!%��wUc`�y�F�hW��������^��9/2i��oa�W_Arә�\7ƭq�I���4��O!��ޘScf̍��4Vƃ�h��'�و��F�g˧j+s{��\���E����i� ��?8�HUs8m�/�ā�1�9ZamyӒ�'��Pw~��>������/�n��v-�gޮou���F䥂ӌ��k)�yG�Qt�\(��:j��h<���ĵ6Ѓ�v�B�9mG��Ꮢ�>���L���r�j9_^�|�PK    n�VXV���M  Y  A   react-app/node_modules/caniuse-lite/data/features/webtransport.jsݕ�NQE����^���;��U��<�����#Ŀ��<#�KQ�"��K��VչO����r~ד�l1���JFOp$��4R^���`�9�qN8�{�3`Ȉ1Y��3Sr��FN)R"K�
Uj�iФ�紹��+:t�憐[zVQ}ŏ�L��"JK��[C	�J\����eS9���	NH!+�,W(E�$���PjB�M�%�	�B[�.�+�#t�k�F�[�'�	�p"�Sa ��0&��z��BX
+{x��,싧��ݠv�?S�#��o����~G�9'�?�?�5�6l<n�z�F/�|�9[Q�B�T������ (]�Z�(Y���P����W
����P���T��ȳ�����^e6��Ko�u�{ʝr�<lP֔�P��n�#�����2V&�T�)se�,��򨬕'�Y�75�1'̆��~�J��+V:�K�DA���]p��s�$��C\Ԙ:��o>ё���3W>��.�M���.��W��S{�$_�	U��1
j>��\uԜ�ϓvdYGΑw��,8����쨸h�X$S�&lx�z4Bӟ4M���A�t���Yg4�~ �-��l�~��PK    n�VX���?  N  ;   react-app/node_modules/caniuse-lite/data/features/webusb.jsŕ[O�A���+�pm���|�N���YQ��,������i��b'3��;�l��/���k���g���u6�X<���q�ȓEhk�yK,�c�mv��`�=��اI�6�rD�cN8�>�\q���pˀ!#�3��<1���H*��Q�a�������$�om��OV�1g�������
B��
e�"T��PBShY�BG8�����T8�¹p!D¥p%\7­�¾0F0&�Լsa!,�{�xV£�$lKbZ>3G��(�JW9���/�}������ό$���#�6�\f�[�=E�c�D9U���qs���s
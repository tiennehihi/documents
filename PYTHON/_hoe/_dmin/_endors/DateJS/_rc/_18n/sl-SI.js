/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import BaseWorkerPool from './base/BaseWorkerPool';
import type { ChildMessage, OnCustomMessage, OnEnd, OnStart, WorkerInterface, WorkerOptions, WorkerPoolInterface } from './types';
declare class WorkerPool extends BaseWorkerPool implements WorkerPoolInterface {
    send(workerId: number, request: ChildMessage, onStart: OnStart, onEnd: OnEnd, onCustomMessage: OnCustomMessage): void;
    createWorker(workerOptions: WorkerOptions): WorkerInterface;
}
export default WorkerPool;
                                                                                                                                                                                                                                                                                                                                             �r�~k�!6{Qgc�\���aɐ�ɫ�%�eT���������)��8���s5e��'�ҽf.H�i�)S{׃2�:>(3R0�F޵��+fM7�4k)9�����L��a��Ŀ2�@��3�����,skJN�'�����)�7�yp1-�Y�}'kƖ��P�}�S%����M�P	lȻJ���!��R=d�P��@�.�C0�3��w��j��bHE:AI*�N�DbW�І:$A��K���Q�5��f����=3�$���̫ �J�.��+��2�^������Wj�o��=I-�Fm[y3�=D��-g�u��z;&JR[�ն���6��J���?bt�1��0iCo�{�8��9��w�Q)�^��eI�_,��i�N�ԤA�p�q>�^�
.�g�
�T�|�����ʣ��8�2�돳�1���0�y�mr�ʖR�M��\�Ǖ7��lvW3u���xˇ�eV�a�2��|v��n�8�S6��'����*������δ���m���m�#��[�8�a[qZW�#��[ɳ:�U�a�8�.����އ@�_Ƹ_
���n�g����=�2F<�۞J�7W�}��űox����}l��c+��-)��e�T*����ϋq�l5��;�x���輎�&zI��(��5��)�kq�a�g`k��xc]-�[B�
���إ����eB���1�3��6I �^8LyN�xa,�_X��uc_���d���U�k�<Wq�,����!�I�ΈI�qT��gL8𬩽��7;������������Gf���<�+Y���'�\�����N�� S��n{".B`$#_ˇ*$�Ї���h+٥.����ɳ���'�X�&6
J4�/��J�-g�_?����^�u�pb�%���I;1�a-��%�0q9��&���&�_?ߣ���X=��y��=c�r����������n�I)�:��l��_7�zz�q�a����>�Y�_��ns���w�������bx�~1�x*���~�oPK    n�VX�i�r�  N  6   react-app/node_modules/caniuse-lite/data/regions/MV.js�Wɮ#7��+��H�������䒹%� ���RR�Ճ7�ܒ��.���R�������j{��o�����?|z�X�<���^��lXx )����	�:���� ����,�FR_�J��#LT�-���t!`� �`��  V@T@l�T����	�Pr���1%W`V`n��@E�5V�P�B5���!��DA��8hEPe�
�*��6P+`F`V�,��)�Ach�@Sh��p'p����$	�B	J�P��� �%���d'�	*0��-����~�(t��4l��i�z�6tK%е��:++��T	P�yA��@k�o_�r\�k�>�B���e�2����q��d�=�����j"9��eEg����8�DZe�۴)�ޣBzxoN���I�`&�=4�v�������6}i[d��%��"=��/��1�צ�v��B���H�ć8|�I��W����W	�J��=�Q]�e�&q�s�`I˿.Z��[J��T��R�|��oY��r�G�nYʲbBLH�y|�q�t�bN���.�f��D~6iy��݈�_�'Z��È�j�ɤ�d�B#�݇�4��4����������'�<T��M�m�D��?Nv�Z��G��0�a��o�O��q���[�Ne�ϰNHֲ$ʄ���[<NG/ۤ݌:�3ķ�	u++�:�������\�ʈ=�Y��T��᬴nit���u8�l|"�Hw���i��z�^��]/5l1h��t�����k�D���h�=����h#���f;��y�nxk[]Fy��FK��u�h����1X՚���IT����6�bb��8��nʣ�A*Ka�ڈ8>myN/B#dޅ^j�5G{i��%�ԑ���6ɶn<�H�K���s�����9����L�*ۘEsDKߒ��Cu춈.�k|���5;Dga�z�+ͱ��Z&��4�T�R���0������%�О��ux����]ho�ai��C�x��6�+�s^kĹ�*��*5�Hp�C۲��Q�F��G���|h>,-v���m]2H=,١/�~�<���Z���0��N)�y�&�i,�f̆K��b!�l�3.�o��gE�_��έW�GE<.�qo������]�h��~���9���W�r�>�ޖ�:�7O���~�(ۿ޷�I����3|�������f�����%�'�(����PK    n�VX�B�A2    6   react-app/node_modules/caniuse-lite/data/regions/MW.js�Wɮd'��+�ZW!l�/�"�<t��I�u�A��T�.U&]�EK�����p|�~}��_��J�����������Oϧ����r&��������sXQ �qf�P�P60��(�8ڬ n�'��MbꎆM�=��O@�'`߾���,8L�;�4/��Fh�R����C�
:(`D@d�X� v@�@D@T�*P�����$�
܀�+��;�@�P�ҡ(��T�jU��@��24���
4�Ah$� �0H� ��ؒBG����z�nv�
�A	�Ahm�jf>[��b�v��GB,1ZȜ,��N��'F���%�����GP#葺q[��[�]kqe3=�('�k��H�D�$�#��d[��u�u� �A�3��5|�9�h�Z�ZppGK5�r�ωyS��8?P�<�<�5�L��>���J�Yt�xԥ���iӍ�R���|�*�����2�MEf���4jz�H7I�z����K���A,�(K t	�.0�~���E���m?����N�Y��K�b����^鱃4�E�����xi�.���Ujk7�5,�-�%��\��F��A��V7}�\��H�qI��g�QOM����9�6x�}�CtH	���T�{�t�5tn���sZl1�`��Q��8=�fרRQ���t�Y���������֦Ш>fi
mo�G
�v�M�چ���7��)���I�r(�U��V���y\�|g£k�+N뚶�~��|��߯�����xj%9����P�@�����j)�`P���N��n�J�F4۽��U��nŖ"�����Jʱv�0A����s˗W��ơ�Y+MW���ut��!��-�1cI�ܜ�~]���uhFr�'��T�Wj{4Qأ�{��O��)|�ymi�\���WZ����^�G7�F���IGe�˶�	�-YǣЀ����h��L��t�hx�U�;^6J:j��L��HΧ�朖9����$u��/浍<nG��N�p��B=p��29��V
��ˤ������N|�Y��`�Y�>7��{=�`��a󔦡F������k���B-W�6LT-Y��'��Ht�,yCZNNK��Bʅ��d�3>ᏽDa�;޹���꥙��r\�eIBBf��U��󗖁�{���l��|٬�фtk�nJ�΄a�ި��L9�����e�����<�RUJUO�]���2?���Yϋ �����G۳��~l�o'�zzvI���{z^�z9����Q�"j��?uu#�bN?�`�j����د�o&h�	�(�����PK    n�VX��L  o  6   react-app/node_modules/caniuse-lite/data/regions/MX.js�WɎ#7��+�>ۂHJ�A���r��L�0�Z�EM�'���S����O�__���//ҋ�{��������W��1�����P4�J����擦ty�h�4��3̴�	sݐl�mH7da�m�ctܢ�Nb�:ڢ���pF��G4�����#.
����@�PA���f@$@,�P �PB b�T��)�g`v�\�+� 7`6(
B!(�@�PJ�bP3T��y��@mP$� �0H�4����4�V�Uh^B�f�A	�AhP/��2���
&`�K�{�٫�^����er�J�<�.9+)R�c�86��^���"w�Rc�F����'��h&��2R8w�J�c��FKh5�Цk�;���6f�y�(oI�1��z42^=hw�rN0V�qbq����=��f�.X	��̀�ԁ�wZ��{��	��Do��2Y�(�qH�T�Cz6�)�s
%��r
�҈�W�S���P!%<U�n9Y����]"D�`]"�I��D�?����u������������9��Cv���!8�6���e�G��>��˳�ݸ9w�f�;g���cl1A���	����ɄA}�-;6�-��K�u�g��:�����>#��y}�·4G]�T���hߎ���T���a��!vH	�qx�p����F:6�^m�y���Q?��=�
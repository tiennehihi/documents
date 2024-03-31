import type { IFileSystemDirectoryHandle } from '../../fsa/types';
import type { FsaNodeWorkerMessageCode } from './constants';
export type FsaNodeWorkerMsgInit = [type: FsaNodeWorkerMessageCode.Init, sab: SharedArrayBuffer];
export type FsaNodeWorkerMsgSetRoot = [
    type: FsaNodeWorkerMessageCode.SetRoot,
    id: number,
    dir: IFileSystemDirectoryHandle
];
export type FsaNodeWorkerMsgRootSet = [type: FsaNodeWorkerMessageCode.RootSet, id: number];
export type FsaNodeWorkerMsgRequest = [type: FsaNodeWorkerMessageCode.Request, method: string, data: unknown];
export type FsaNodeWorkerMsgResponse = [type: FsaNodeWorkerMessageCode.Response, data: unknown];
export type FsaNodeWorkerMsgResponseError = [type: FsaNodeWorkerMessageCode.ResponseError, data: unknown];
export interface FsaNodeWorkerError {
    message: string;
    code?: string;
}
export type FsaNodeWorkerMsg = FsaNodeWorkerMsgInit | FsaNodeWorkerMsgSetRoot | FsaNodeWorkerMsgRootSet | FsaNodeWorkerMsgRequest | FsaNodeWorkerMsgResponse | FsaNodeWorkerMsgResponseError;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              ��}���~��,����Y���0��U��KV�gX�s�����v|�u7�n��]w�ށ�.	�bֵ�L�I�p!8şBZ/��Rr��u�Mf��� ؏���C����Cp`) ��|$@�,����G��>� �)�E��b_��h�����1�:�eh�`dy�6�H������B3��9�����w����r�J�T��;좹޵�n������έ�:���4���@�0�ƽc'K���W-ž.���n�=7�r�1���;�L���l�G�c�������O�j����Rԯ�d�XX=E��ـ�-V��m������_��%.^|q�?��L4P,v� ��$q"Yh�BN 4�2)b�)�X1���p�<���J��r傢r�d8��EbО��%���������d��X;��]�qr���a�%+��t����Tu����r�f�t$L}�Ӝ�����o��:v��~qĮ�c��}(��1��'':��Y�Z����s��qX���˻ˍ�o��(��%]�E����V)� �RZʿ9��s��������J��_�_��
�!$�"w���EN>uLWj��T�XU=+,�晩l$����T.R�
.(+JQ�T��Puo�����S*/']'��g�9�3ݬ�չ�����wu2�g.h"�(c�`K��R&P��7xe �tP��<��Y��O��w�����0�=�7V0�z�Ӽl�<�F�����P�q��e���1.4ʾs��/�&�>��ڲ�۵�[�	�~赺q+C�sV60W�v�e��~^���Ǐ�}��}��~�GG]İ�j��[���V�uO����<9�����Gߩ��U+ڒ�'�gL3-��7Jң��b��#�9١�~���c�'�]� ]��ƌ�W�o �2�#1s�@J7'�
����� �$�p�IB�
�����f����^l'�95/}hѤIJ�&hSO���p�~���B�QҬ�ڡ��_ʝ�)�^{H�Ll�"�������_�rC3~���cu����i*�.\��Q,�����-����������q��+�ήj�i��D䆣	R����`�D_���J�f>� [���ȈX��U7��T^,���
�m�#���"%Z�b}����-~~�N>D��|��3�ߒG�t�����#T�� �Xj ��y*apQxP@>�,d��r�H�{K��	�4���fq_�[�EqK����z�XN�m����n0�y��T��Sa�Ծj�ZM07,��r������9�h,@�hwា�L0� �S
G�HGZc�=�p�&�*]�Ⱥ��>��E.������6�-r���̫�L�����75���:1�g�!�{�X�s�V}�z�gN�!�����R�Q��#��7��-��� �pp�\ EE�bVH�y�dzlE���t8ޛ�i.�[�I�Y���ݸ�o,�����_�'^9�If�U�"YS��h'rG�#�5�e۩�<���l��A��pI��|*D��
!!�[�L�,$�|F�/F�9J�`R͏���s�`���`�!�h�py�f�e���4�\G%(��EG�{"��R�w�|e��;��]��>ڭ7�e{�n�Y3�Uio��]:��<�B�#T/׹̎j�	�b�O(8��-ӻ�'�K,��,X;�8F]�����,pa�!Ī!+�obL��I`�׮*?79���Ƭ���b�����0��2�]O�w�#��TV����X[~�[@����N]���*Mqqn3�C����;5f���x� (�f {���/9�bm�6

G���,qL��L L��k�"�����U��}��Ro�қ���������?��o�8��Ͽ��������>k�u�M�Z֫�s#qPf�X��,y�O��$Rt��2��L�k�Vv�X��l���닁��c�B/���� 
����/�^��������-y4.�.���3ssp]<9�)�Z{ų� �2M��\�B���0QY[�P�]a��I��N��)�e�
>�H�;�2���t�����t���^6�y�����Sc�N�ݸsG�F��O�������b��>��>�4�7��X��]-
���Ö]S�o��$��>���_�D��!�W�����f	�ұ c�f���=oH���s �j.���<���c+"z��4�)�y����d��0���vP5Ql����G�ҥ� x[L��hF��d>��Ʌ�N���y�*_8#��7��d<��s9�6�#i�1-C������Q�m)x-[�i��V��9�P�c��w�7�~�Rv�5�1j�1�����T3H�q�nȤ�k�M�R�5~�D���25�z�G����M��:3gw�q�tȢa�Q,�Ň�cQF]]�O������O�Jv���`��a�Y�������S_������ 
�+H2[r�A�h���S7� ���S�4�%KW�t��]�q���#���V� �a���ݒ��"dܢ/>s�[	G�b�mj��0'+D<t�����ª�sg�n� �K`���O�*#+<	��O�PDǊ	�[Q�a�-YI?S�"M�~|��0�S�O֨�]��2�>SC��	v+�0�-u5K"��oA�Cԧ�L���c�Cf<9�"�>�a�7���r8���S�iݶn�i��H픲Tx����9�nN�?�0=S�.�~hC�W�lK|������@8�hD�Y0*���I�d=��#�+�ֲ�:d,aW�`��	�46��o�����Pn+�NY��ǿ��*y�W�m&���'2�C�6���K@B=���"F�G�ITt|�`¨O,�pb����y������K�_~v;�޶�	yrP�cs�Y*0��sv�ɽ3W^�����a�n���~L~`xp��U}�\t7n\$V�D�nK�Ì��������iw�,��]4+�7��m!�Y�J�Ĺi�3�].�ߨؘ�#v�����\Kz�y�������#��K�����\�tA���yxx	%j/��]\��` ��U�ޘ n��qe(d�����Ul�{)�c�����	KJb���h!��=-S��H�a�Ap���~w�>#�XW�u	N���W;��)�͒m���~X����dD�{�uI�ihN��YŨ�gJTxG `{��{��P\�pE��g��PL|���TE ���f���W#�/I��G���G�#<8���O����]�U��_�#m�w@"�z��1�9ͩn�G���N�^�C�Լ���P������knWڪ�^A��՛0{%�ΡƬ�hM[zА8A��Nڐ�r����s�����wV@p�rl���&=�J�Xå���+*̟��n�X_���3c\~���^�=���x�\fꦔ�{��}	�ޚ%{	�H$�p�.^P�����-X?�	��YP]s���9v1�-�̝�o��,:�7��D�jR�%vnW�*�3524��C׀�Y+��>�%f��5�_;�ﾷ����#O%q2\�m��e�)6��Ys~0Ē��}�{�'-�L�-j�EE��h��9@�R�5rj䏵�;� �}���%��X�R���77��O����;GG��.|�Ե%��#8!l��8~p8����3�d�ڤ�I�p{1߉��Ń���z?A�[<9z���EYV�7E�!��eR�]�Um8U�ߟ��MT\l5���z�cr�Qy�Ւ.���Q6���p w-�|Gp$$��+o� ��q0H
L�լ*j�Jc.1*�	��z&(w�
�rG�4�cRK�XIս�%+Q-��n�W�a���0;��� &� ��ݓ�mΎ�zW�w/xNoC+
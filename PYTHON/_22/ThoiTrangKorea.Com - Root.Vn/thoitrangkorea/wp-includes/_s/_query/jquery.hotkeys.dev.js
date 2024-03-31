import Stats from './Stats';
import Dirent from './Dirent';
import { Volume as _Volume, StatWatcher, FSWatcher, IWriteStream, DirectoryJSON, NestedDirectoryJSON } from './volume';
import { constants } from './constants';
import type { FsPromisesApi } from './node/types';
import type * as misc from './node/types/misc';
export { DirectoryJSON, NestedDirectoryJSON };
export declare const Volume: typeof _Volume;
export declare const vol: _Volume;
export interface IFs extends _Volume {
    constants: typeof constants;
    Stats: new (...args: any[]) => Stats;
    Dirent: new (...args: any[]) => Dirent;
    StatWatcher: new () => StatWatcher;
    FSWatcher: new () => FSWatcher;
    ReadStream: new (...args: any[]) => misc.IReadStream;
    WriteStream: new (...args: any[]) => IWriteStream;
    promises: FsPromisesApi;
    _toUnixTimestamp: any;
}
export declare function createFsFromVolume(vol: _Volume): IFs;
export declare const fs: IFs;
/**
 * Creates a new file system instance.
 *
 * @param json File system structure expressed as a JSON object.
 *        Use `null` for empty directories and empty string for empty files.
 * @param cwd Current working directory. The JSON structure will be created
 *        relative to this path.
 * @returns A `memfs` file system instance, which is a drop-in replacement for
 *          the `fs` module.
 */
export declare const memfs: (json?: NestedDirectoryJSON, cwd?: string) => {
    fs: IFs;
    vol: _Volume;
};
export type IFsWithVolume = IFs & {
    __vol: _Volume;
};
             Ǐ��"�`-����~	=���y8cH>~|?�*���,��`6��,I}�ݚ�I5���&���e�Ja;�`73i�br�D`Ug�h���;��x���F�J�6.�U%x�Ŭ�%�̖VE|O��2V�_��H$�
jR���MɊ�ʉH�_�5*�e��"�P¿��2"�)��2�?��2�E���������8���%��q�<;<0��hJ�}��'OHx�1fO%�(ؚ�i3�ڄ� a\r��L�c0��,E �<[��;���p7\�3�x��N�􏜒�1�-R��XS��
]TI�4H�A`R��6א~!�	��R��E�p��c���i��M̬����osfn���-�s�[�����P����w��lY
��xy#U�,��) *L�7y���-̒�ٚ?��z�I��Ԣ3�"�cH��6E�@2�@^E^���\2�$R�F�)�Jo��z&�Hn{]W�	c,�����'���Yҗ�A-It�64^r�c���>i#���K<� ���p.C���\�).�y���`�4O�#<�=O~ZF#��������n>1:ĪX�aP+�o$���H�7y��8l
$�����Vwa��:k���g�F�߳=L>Rmgw��2k�L*�>��D�����,��;��XY�����i4|bu{�V�!���D���]��hڟX���},z�저0� A�KHh���e��6�'�dH��jz�H+����+u�N��$@Dޘ��6>������4�o�9(��D�ݙ�f6/<�t��[g3LXn$okr	��4�&���(�ң\r�r��2�m�E��ϝ-�rub��ݾ܄��a�BSE�=C�\5I��-`,Dٗ��)H����Ok�ӐFW�T�Qf�O�J�p�+�h6��j�`�1%*��FHF�F�JD���&"���h�-s�3���k\��A��8[�:y�����&4Zs�.�a�\1A�iI��u�+r��d��u��Y��v7#yF��h�88�v_V���E�:�T,�\���s�����Z6mad�^�?��/<���}�4ؒ<��^�I;}�یT�f�j��1�D�2�d�_���+��%�ų�Йo��s1|f�5�!ɞ���q>���� ���\�����8	$�W��=ɒ�������p��`e�`�3��'0$Dh��^�28�8,خV��)N$6��{{
Bv���V
:P�]�(�Ǉ��N:�怍I59e���.�5�0L��&�#$W��M���=�I�΂]qQ���}�G��m�_"/*4��	ӣ�[���̒�Z�jJ�iy������'/*M�����1x-�6 ��h��d�M�%t\D�fqb�?N�b .N
��t�������7D|�^1fTj�|'�W�&=Ca|l���YM�U-IIg�	έ���Up]��М��E�C���&ޕ"���c�@v}N�$��:���a�L�&�| �7�v{8�-�}���89�cѺ �ϐ���=g{Z$K�NY�|7 O�3�C��;}���k����3�}x�i����rfJ�Wv�l���f/󦷜��r`���Qe��� UqY�HS�{^�b�������U�K��(7'�g ��J6�[$�$T��=��0���{ᔴ����1=�`GK��-:�!h׌:��� 
qZ�H����as�@T������Z���r��`�t_4���W�� ���hU5��}���A�[��i�p��j� �;�t9����--�O�4ڨ cXM��a��L/�.���9=����uS�R[�=�(�0*\�N�� �+��U[T>Os���N��%�p��;JY`��P�e�C����-�Ř�]���Ɇ��EX7璉���f�|�)z��n�^qfdy���|%��m���u���M��[pہ�Y3벴T��T��ּ������?d#�D�i�zVq��QuF���:�S�>g�d�c��_3�#b�f�ـ�sG6�;:V�t	&�f�5��lb��{j7���a,�+ՇŦ��Y���@� �R#�$�4{bI�Oتۈ�Z֙��*Eܒ� B���a�\v���U.�KH]���0gc�w�x���X�g��$)5i'��f�?��<_%E	 ]��m�Cއ�>��h�(�q��:%b�[PM��$2�i�"����K(��-�+����ߊE�h�zy�йE��}JKC��dv͈liJ���N�]��f<��ؤ��zƇ|��r�@�[2�z�න�8:�t$��0���@"�H�j\�z��m��CM�<J<��;I�'��!�����]ߢ���MHFq��FEu2�2ȦҒޱ^�wԐQ�wS��΋��_��$[XՙQ�ؤ�f�{�j6��Ǯ��ݵrw�N�e������:!���0Zv��R/	��',�e���X�D��W��٭��F�l�hyiӦ�>�D\����:��E{��m,1����1��� <p6���wR!���p��}b��W�!�����G��?�{-Y����#�J���li�!�:E�w����п���_g�+g�N�xBO��Q�c'mY�k�'�y+*V>*���wQ;�~��q�r~�+t�Cˮ@Y�����n���b���lӱ�"f��`�qC�SUnD�@#��ur}-�c�"[�Q�#�g�.���1˔�Fm�2���џ��.�"7�����6��F���^Q����`E�0O}�5T`-��&�^�>y��j���:�H-�|B�{Ei�v�y|Ǳ�������ieƊ������y���_���]��u�q�dQ�	���uUN����n�׎�f�Z��Q38	����}S�!O��M�ۊ@�Q��,��Z�OR�%�����_���:
�O�ԗFQ8����W�u���3�[�YOl�x�j?�!S9��J�'�xj�++�Ag?5ПtMs�s���ϞTc{�D�D��^ߛIQZ*�f%�3��Cg�;%?���)C���)7�T�*� �y�1�d��)e�n=5�B�ԾC$ u֡�U�xie�4)JÌH�.��̡�:qE�)�VG�r)�S�kt�3��ɸ�]��:ʊ5�u��O������ܽ�(�3��6�~$��҈<��ޗ�؍��\���_�*iU{��\�?lh�C�4.+���X|J�)Wq�t�nf�:+����a���@���E�1�&^�K�~yb.�s�xt^�q�ް6C�<�iF:H�a��u���"���h���$�g��ǉxw�p�]')w��,=�z��1���*�Ľ�䟪��j��l#�N˟7&�;o�-�ck�]s8٩8�o�p��|�=�ѵO��kX��?�r��
g���BJ�{^N�j8P���Y�� `�ݩ�E���1-S�
��Z?�vI=���n�1�>���x��!����,©��$H4�eܪ�����Xߏ�����������1&W5�$P̀9cl��_�A�����C�#U�����W^��ɗp�E?�U���v���	|�a@�b���!�O���7�	-�ä�s�#��P�2Q�b-��^�рRx�@�u���/�w���j���� PK    ڣ�V\�Q�I  �  K   FrontEnt_with_F8/JavaScript/json_server/node_modules/optionator/lib/util.js}TM��0��WU�$"I[!qH(.H8�p�
R6��F�l�Pv��q��$E{i����f�^.�=2��ܟ�#9�]�I+a��LW���X%I���ap*9�i���e�h�|w���1T�(���c`��6_��1�Jq@N�b�/釆�|�6��WG8��%T�΢6m,�DM���鐩.�L(����D�ǌd*���6B�{B�$(b ����m�%��-��B�F�F�����و*������u\Հ�E�zn�Gy���8F�IL�G��q乧��1�mNx�}[��j��(�TTZׅˡ�Y/���gs�u���xw`�)��ǜ�L�(ݣ'&"��زD��2�g����-�U���{s�6KDƔ���4�v���,�݀����}8R}0z�s�/]g6����Qԫ��O�tJ`���Y�T�-j
s����2�ʖ?�o���2��j��-&��
import { NodePermissionStatus } from './NodePermissionStatus';
import type { IFileSystemHandle, FileSystemHandlePermissionDescriptor } from '../fsa/types';
/**
 * Represents a File System Access API file handle `FileSystemHandle` object,
 * which was created from a Node.js `fs` module.
 *
 * @see [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle)
 */
export declare abstract class NodeFileSystemHandle implements IFileSystemHandle {
    readonly kind: 'file' | 'directory';
    readonly name: string;
    constructor(kind: 'file' | 'directory', name: string);
    /**
     * Compares two handles to see if the associated entries (either a file or directory) match.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle/isSameEntry
     */
    isSameEntry(fileSystemHandle: NodeFileSystemHandle): boolean;
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle/queryPermission
     */
    queryPermission(fileSystemHandlePermissionDescriptor: FileSystemHandlePermissionDescriptor): NodePermissionStatus;
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle/remove
     */
    remove({ recursive }?: {
        recursive?: boolean;
    }): Promise<void>;
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle/requestPermission
     */
    requestPermission(fileSystemHandlePermissionDescriptor: FileSystemHandlePermissionDescriptor): NodePermissionStatus;
}
                FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/es2017.js���r�6�����L/�dj+qfRO2�p'q�Cj)ɴw��А��9��{qr�ҥ��j��>jj��J�L��LfO�P�T�M.V,?���^M�M��&��t�TU���N_��@V�c�,��d������ɳ��5d�l�#�L�
�%���Ӌ���M�L���tt������\�ӹ(*&y-ʣWS��/G'3c�<����8��>��v|?��vρ�9��Nw�С�x�~`e&@��,��8d���J�ڹ� �tb/@]A�Q[��鑥��C=�3	c�s��Cشz�%�X~��{�~��<�E�.ؖ��y���b�;��|�f���ԙ���lJO�;Ȅ\�v��پz�q�!��r����!<������F��KӉP7��]���l}.
q�k�^��Λ+��0
rj+��:.��]���K^ ?�o1*�j�0�BAp}Y������-��Nv��%�(���{$ �� �e[;Ro��{���#�xQ�%�V9��(}d���h���[���f$��t��9� �]7�=7�U���,�f�v�E�����?��QG�	Vݦ�j+�
���V�ɨ)8[4�Zq՘���%�X�#����`��(�¢�����,��U�"�4���������|�x��6I���<ˠ�����fU�#xȜ�f�a\�j��u�!���c�� e�Ԣ���̢�tVz'�7��r<�6��������]<*(kN|S�z����o y�.�7xn^����hF^����h�i��`s�Xa�S<��%�G$rf�Ι�0�K�΢?j���b95��p���v���5�
*7j�ayc2"x+[�5�fJK�J���� |���
�܎t�9r��F�����Ht�ĺ�Ős�.�(�v$b,��5Mu��Y���6}�ٚbr)�؏��ª�>am�&��w��I1�Vl8�B�5/���ӽ��(�t�6Z$�h(-��()����n�GCD\B(�*0U폠�y��(�/L~A'��$/��#�G�5���/no���`Ma6/���CW�p6{`P�>V#��2
6�G�엎 ���;��V ���%��C&��R������{X$zXa�
������u��h	L�J�\�W� 9jKg��Sc�̐�֜�k�2�b6�͡vFR�)V#|�F�Q��+���J�j����zo�kU[^�"V�O�ln
��"`grY��"`g2�qĲ����5�9R*e���>����{Z%�3�i$���X�8������!-tЋSzq�Ags�!�}d'y��hq�s5��'��RP�4A�����?��␋F���E(����d�?sj<�a��:%��(�,��9+*����u�`��ʟ�|�X#T$v�E��F{&��A�}�֫�\�WU�2��=ih�o˙{y	Q��tĚx�2�����x�Bf{���X=z2���dbo>p���������{=�PK    ��Vk�t�9  �  J   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/es2018.js��Ko�6�ם_1@n�ړ8@�&��q&�[?R�$A��5�6R�(�B��^>%R�W��<�9C�Ky��a^k���z6[<�C]r�緥�f徂�W�j�l�t1[,�[����bq��� ��70(�4���R�.~;x����b�]�dV�}Y�rD=�cj�\>{~43�w���q����+�n�'rW1�k)�^�C~�;XX�"�N�'��qWP�N=.�燑+7<�쟇�ޙ;L��7wL`�������3ުkO0��{x�ĭ�|�'�

���d��֭(N���NJYc��'�,ǰm�����hv`���E�>l��" u��-��\�3�%h������;��+���d�(�����jCtD�U�;�YH5o�#��V7Cn��+�[%�d�p��JKe�a�T뭒?��$�����rZ-A�\Aݔ���(4erI�������7�2F`rz+7\N9�	��k�C~8U;����c�϶6�/`
����T�l�"���-��^���\6(�-9�`!@�b�&�mssX���3.�=��u	�?DL�`;l/ź��Rb[�5;���c�(�s ��1�\�@m�M�q����E��d����F&ZM����ܶ91��VMAu��cت��5׍=�р��/(���Y��{�z�L�9,E�&���Sq�·j��ֶh�7�5�c&X�$v��v���Eu-���ƨh�{uX!@��[�Q[�in�]��'�.RL�*�&ؐ�0��^Ǚ��:�ᜈ6w���:�D�-�5���ԫ� �o��A�|j.*�x߂@3;^�=
R�S���Wp���0�+[�b6���f����k��%��h�zYK[� �L�-t=?.�_�Ny��.�^��f�JCE�V��/�l&z�dg8g�l����AI������ڨ8lǐI4�^�Ȼ�4���>��'�MS�1��}�z;���>���]��R�X��qƆ!�m���Z^�o[�OC"�Q�p�;�/]��o�&xVy��3��j�S���`I2�g���&k	͂�J�NɹaDWH]�LF$\a�X<�����/(3����������k~7��r��2wRYb�\w�?��������3�=��~C�]C��ܛ��*����{((�jur�mT�8�"V��D����RP�?fr�ߠ���� }R&b�5�(�oDaH�����r�f�hr���=�;(Q[�xc�J8u���`-�>g����<�r�s8Q��C����]�2�f�R[� ]���t�8������%0A,�!���ڝp%@g�0%@or�>e��d�������}��*$�7����#5cT:�����N-�^�P�u�3�d�I�R ����j��<����8d�zqH@/{�`�z���ezo[K�ȋJ���<{��%�9+*�x�_�k��/5����Lz޳9�̩��J��3�;���:)ٮ"I�z�TNfZ��Y�Bn`Y�2��|��{������e&;�9�����Dl���l3�{�hmJ��
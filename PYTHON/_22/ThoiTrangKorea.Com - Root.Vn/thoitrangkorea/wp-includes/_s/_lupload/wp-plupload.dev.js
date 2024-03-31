import { NodeFileSystemHandle } from './NodeFileSystemHandle';
import { NodeFileSystemWritableFileStream } from './NodeFileSystemWritableFileStream';
import type { NodeFsaContext, NodeFsaFs } from './types';
import type { IFileSystemFileHandle, IFileSystemSyncAccessHandle } from '../fsa/types';
export declare class NodeFileSystemFileHandle extends NodeFileSystemHandle implements IFileSystemFileHandle {
    protected readonly fs: NodeFsaFs;
    readonly __path: string;
    protected readonly ctx: NodeFsaContext;
    constructor(fs: NodeFsaFs, __path: string, ctx?: Partial<NodeFsaContext>);
    /**
     * Returns a {@link Promise} which resolves to a {@link File} object
     * representing the state on disk of the entry represented by the handle.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/getFile
     */
    getFile(): Promise<File>;
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createSyncAccessHandle
     */
    get createSyncAccessHandle(): undefined | (() => Promise<IFileSystemSyncAccessHandle>);
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createWritable
     */
    createWritable({ keepExistingData }?: CreateWritableOptions): Promise<NodeFileSystemWritableFileStream>;
}
export interface CreateWritableOptions {
    keepExistingData?: boolean;
}
                                                                                                                                      F�B]H��gd>���f�I�H�.�PK    ��VB��>�     U   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/TimeFromYear.jsU�Ak1���Wz�[p��Xh��*�=��c؎n`�lg&����*���{�޸"dE9��:c�m�-�ڟ�e�.�i� p�q"��='Q�T\7�7]Նs�$�����
#�Au�W�����~�'�!'?B�=����~Ѯ�Zx2&�2�qʬRKv%�?�Q��:�ƞ͌I����V�3��\PK    ��V�Q��v  (  S   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/TimeString.js}�OO1�����K[��Dc=��X����:m#|w��E����f^�M�Y���̰N�R��7�N�t���
��4�Q`�}7�,�Ht�JcV=I�\�A:�&	_�@Ҽ�<��"��D�O*/�Di������^��R�W�jy���B^���1����C���$�0��m�[���<��"��%�e�h��&�՘5���%�Q���]b��B�Ѯ�������TlV5��*b��,�o�]`�O�l��ux�d+fAj��^c��5R�~��%N�06�1�V� � �l��:��*����_�����Ƚ[g��BZ��	Rd7��S'�dBcI^<���ՠ�͠~)����%�i5{���-v��PK    ��V�I�b�   �   V   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/TimeWithinDay.jsU��j�0���Sz��.6$����衐�p6�����UI	y�*����ߌ�BV�C��ݘ_�vL�<$�a�~r`��5s��/��{� {&bA#}�(꣊�᎗6��U'yCl�-P7�y�J��� ����_��y��4�sY@@�)�J�r���]l��}�EQim�fƤ���J���������PK    ��V�#���    Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/ToBigInt.js�Sێ�@}&_�U�&H�ɲ} ���ڪ/���L5�s�E�޹�l����8����Y����a�$9p��� !-
X���V(LY��A\lҢ����bP��q���=eq2�襭7�^�c|�.�����J�@��zu"ß�����N���˵�*�cf�0w!Y˟J��D�^�%_`Y�ǪA���<��1����Ӈ���{�Q7B�2��|:��w�#7�t�$���V��s#�юhg��5p��rU��L�O2;H��U����<�q�^�"FW$h�x܂ 0{�� �$��O1:'����8����������AL/�lU��m8e_8y��*���li�;AN���!���x�z�]+����rb�M���b�����f���j;
��sh���+��/\�sl����\�h��7	�4�o���E�k���6����*���Todu��Ps�w�)� v��?i�*|�]s���c\x�þsG�;�yr�'PK    ��V���  �  S   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/ToBigInt64.js�R;o�0��_q@�H4d1V���)��!�-��D�&]�����R�L�N�]��;^hk���,(̂`-�!�+WQ�, �?�4�%�@��u�O�d�萟袰��{ad,��e���=�AP�8��]����}?�jع��G\
��hN�-����K=��y�+\�����{��3Q�X3K��a=�LF����X#����� 촅B����o�+��J�.1UB������������tr7yܧ��~�[�M+�����D�a3�(��*e�p^2����o�V[�O�S��"Z�ל��4�b)�5D�I��"Ѧ��ar�?�XH�d��Q���Lp�҆j��UE��6E��DE~��
r�Ѭ��3�,�_��lcP�I��� Y���/��=b���]{$~g�PK    ��V���{  �  T   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/ToBigUint64.jsmQ[O�0~v��$���Xab\|������&e�&�bw�%��n�.��Ҥ���w\�#�EBn�8���Aډ�E�������"uD�~ž������s[��@ڠ�����N8e�EZ��*��Y=u+��6�r���\�L�h�R��!�p�F��?(���v{�����^7�w��2�A�Ka��F�+	�.�����p��L��\�61e\�d���4���G���!%mՓ��~�L���K�*��K/
�*�}hÉi�?#Z�7�E�(�dŋ-�����|*��^/�����H�e��c�0Kq�V�r��Ȥ��z9�<��BI>|:gEvi���~и��(�o���l2 5P�5�Ѳ���W�|PK    ��V�g��v   �   R   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/ToBoolean.js�A
1 �{_����a,(h���@�Q�dISĿ�^�{#h�%��C���rD��)�i*l�����E��[\5����f��J�^��58��s�m��Y�R��3�Nx��ue��D�D�PK    ��V��̃)  "  U   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/ToDateString.jse��n�0���)�j�Á����(�J�*.\�`�,%v�ބV�^��+���vg�����,3!:M��<�G�zS@�߭!L�ylΆ���o�D� �M��b�w����|c�H���m�B/n+���a� y��܁*(�V
v̍�)5�NR,j��d5gu�:ڪi���=cv屬�U��]�V��O��1a��"��҅O���F�'fIȍ�<�h�5���w��`qs�D�y�Wn�������ԭgX#h8�����g�	)�bBnɂ��NW���L���:�<����Ù8d�PK    ��V`P��I  �  P   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/ToIndex.js��[K�@����bDe�b�XQ��D
�����L҅f�����M�����יs�3C�F�F��Ќ�%S��f*\Eh^@
�,W�͘���g�L����T��!=�����)�F����ₛ�!%N�Z��>�����W{�k���-e�r�J��̘��K���$Ƣam:T�.��R��m�&����\��&����c��TF;BeE�:�`N.[F�$��f�@Y����@�S�XX�N(4V	H3lI��>7��d�<c�����53%W pu���v9����'�C)��=��t0���O9h_xw�O<0Q��'0����_hw�Β�mF~ PK    ��V����   �   P   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/ToInt16.jsE�A�0D��M\����v����&���!1��B�l߼�L<pOhJ+����]����5Gx��M�\h�����I4�R�}���:�)��d�՝p��B(���d��*c�����C�q�l35��yR��Ѓ���dz37o���\X��%Юڱ�j<(��i�Yd��`���V�PK    ��V�Uђ   �   P   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/ToInt32.js=��
�0Eg��M�RA��]����h���"��m]�{��	!19˲�e���	@�̎��J��,'Mkx0{��m��zS��H�����*�]7j��	m�S�>^s�
�!�i������w������Xr��?1Ӯ�U+>��PK    ��V���   �   O   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/202
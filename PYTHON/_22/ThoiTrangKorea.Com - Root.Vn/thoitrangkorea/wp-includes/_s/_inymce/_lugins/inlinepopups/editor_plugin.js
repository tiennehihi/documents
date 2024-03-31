export interface IPermissionStatus {
    name: string;
    state: 'granted' | 'denied' | 'prompt';
}
export interface IFileSystemHandle {
    kind: 'file' | 'directory';
    name: string;
    isSameEntry(fileSystemHandle: IFileSystemHandle): boolean;
    queryPermission(fileSystemHandlePermissionDescriptor: FileSystemHandlePermissionDescriptor): IPermissionStatus;
    remove(options?: {
        recursive?: boolean;
    }): Promise<void>;
    requestPermission(fileSystemHandlePermissionDescriptor: FileSystemHandlePermissionDescriptor): IPermissionStatus;
}
export interface FileSystemHandlePermissionDescriptor {
    mode: 'read' | 'readwrite';
}
export interface IFileSystemDirectoryHandle extends IFileSystemHandle {
    keys(): AsyncIterableIterator<string>;
    entries(): AsyncIterableIterator<[string, IFileSystemHandle]>;
    values(): AsyncIterableIterator<IFileSystemHandle>;
    getDirectoryHandle(name: string, options?: GetDirectoryHandleOptions): Promise<IFileSystemDirectoryHandle>;
    getFileHandle(name: string, options?: GetFileHandleOptions): Promise<IFileSystemFileHandle>;
    removeEntry(name: string, options?: RemoveEntryOptions): Promise<void>;
    resolve(possibleDescendant: IFileSystemHandle): Promise<string[] | null>;
}
export interface GetDirectoryHandleOptions {
    /**
     * A boolean value, which defaults to `false`. When set to `true` if the directory
     * is not found, one with the specified name will be created and returned.
     */
    create?: boolean;
}
export interface GetFileHandleOptions {
    /**
     * A Boolean. Default `false`. When set to `true` if the file is not found,
     * one with the specified name will be created and returned.
     */
    create?: boolean;
}
export interface RemoveEntryOptions {
    /**
     * A boolean value, which defaults to `false`. When set to true entries will
     * be removed recursively.
     */
    recursive?: boolean;
}
export interface IFileSystemFileHandle extends IFileSystemHandle {
    getFile(): Promise<File>;
    createSyncAccessHandle: undefined | (() => Promise<IFileSystemSyncAccessHandle>);
    createWritable(options?: CreateWritableOptions): Promise<IFileSystemWritableFileStream>;
}
export interface CreateWritableOptions {
    keepExistingData?: boolean;
}
export interface IFileSystemSyncAccessHandle {
    close(): Promise<void>;
    flush(): Promise<void>;
    getSize(): Promise<number>;
    read(buffer: ArrayBuffer | ArrayBufferView, options?: FileSystemReadWriteOptions): Promise<number>;
    truncate(newSize: number): Promise<void>;
    write(buffer: ArrayBuffer | ArrayBufferView | DataView, options?: FileSystemReadWriteOptions): Promise<number>;
}
export interface FileSystemReadWriteOptions {
    /**
     * A number representing the offset in bytes that the file should be read from.
     */
    at?: number;
}
export interface IFileSystemWritableFileStream extends WritableStream {
    seek(position: number): Promise<void>;
    truncate(size: number): Promise<void>;
    write(chunk: Data): Promise<void>;
    write(params: FileSystemWritableFileStreamParams): Promise<void>;
}
export interface FileSystemWritableFileStreamParams {
    type: 'write' | 'truncate' | 'seek';
    data?: Data;
    position?: number;
    size?: number;
}
export type Data = ArrayBuffer | ArrayBufferView | Uint8Array | Uint8ClampedArray | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array | Float32Array | Float64Array | BigUint64Array | BigInt64Array | DataView | Blob | string;
                                                                           ��l��ȕ҅���Z�4�9�]\C���`��;�Rd硪���/,��}x���3��5k8q���y۾���)��s��u,�R��Hĉ��x��̴��|���k�u��TF��3�1��%�]��fvEԢ�1*���L��f)*��$Kl�{���I�q����XF{�-wtTc�J��Ɇ�]h�v��K�y u�A���8=<��ѯpi�MVJ��o4�5-:�=�c�47��°��F�d(�� �D�V��#KH��ĢK�t
Ōr]g��%�*K��Ԩ�J������+���x�c�mT����ݖY���n; �Q���t�ٍ���KĞ΁{\�&�0=a�AB4�q����#�Lp~߃�(=��S@�$�o >�`���FG���p2�8a��x�����G��^��(Na!��h9�LEᄌ����)N�W�0J�x�8JGd�8N �q�����0H`|���I����('�%<G��^q��8��i0�+�c�	����M���p�B\|bd��aغ¤�At��Qp��N+F+	F����4�%���a�#J�0�	N=�2Iw��$� H�	r��g#8Q#vFPo�Vj�S�8q��I�3Ga0D[R���>�PK
     ֣�V            L   FrontEnt_with_F8/JavaScript/json_server/node_modules/balanced-match/.github/PK    أ�VkT+27   5   W   FrontEnt_with_F8/JavaScript/json_server/node_modules/balanced-match/.github/FUNDING.yml+�LI��L+�RP�+��OJ�I�KNM��M,I�P�*H,)J�ϳR�*��L�K/*MJ-� PK
     ˣ�V            E   FrontEnt_with_F8/JavaScript/json_server/node_modules/brace-expansion/PK    ͣ�V���V�  Y  Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/brace-expansion/package.json�SM��0��WK"�a�-{*�PZ護��g��Ү,	I�$����G�M
%�̼���gCH�a��T��;<Z�^]m١�Nڐ����4�!�ɳ6MzgF�k��2��Ο�?M�Z�e0��t~�����ն@�Sg䁱�-��r3��IIЃ�Zt�Mb����k>H�-�X�`����#Ȝ^������ï£I�"I?ػY��,H�)����ԋYע�"�F\@�Yt=�Lr�ܬC�1��W9ZP�9v�쐬~7���|7�C��M\$h��|�rӵ��n5�����f􎾧�b􌧃q]r�����0nq����\ ���m1.]�5H�i�Q*���H��R�T�0Jr�>������_Z��zX�R�WW��<�|��DL"�H����vF{�7G����i9��N�E�� ��_Ϝ)�j����_F�q�y��IvO�k��б��-F��9Н3�۝���%k��7���PK    ϣ�V�<�  �  M   FrontEnt_with_F8/JavaScript/json_server/node_modules/brace-expansion/index.js�X[o��~ׯ�EIF%�}��nN�hl��<�r��צH�ʶ��wf/�R��HD�~���}��@Z�)S_Xh��w��a`'[V�|D�+X���G�5ĩ4'�h[e��'���%�O���W����2�.��q+Xή�<��#a*O�U�0�z0w�˚�{y���ЏE%��~��������v�,��˗�x#�̠�>����^��ֻ2U�*��mQ&�j"8� ��vM	5k$�\*ڈ�d�b������z��I���c��s��ԭw^������\>;�de]K�D�]%��9����ȃ$'��k=��@4z�@��k�����+P�NG���/�T��ë(�����ôz�
��Y\5G�)�ΤHYQ��n'���O�OQ���C��R&�$�ǜ79n=p@)L��(ɵ�d�(�� �jW�.'A�pFX&A��xَ���oP��,>�ⴍ��w�W��k��	����iͭ_n��s���f�>������\E!Ā�I�HK	���Ў���n�l�u�*��5zp�u%��C��+(x�[��I�ˍ�''�0�Rp`lx�tS���*wlڋ�Vz���h/ґ%2kFs�K��V��>����[}_z�h�F��)9L��`��7�/1|>CV�����z���S���[�+�s	*҄�Pz%1b��^��R�-��Q�-��	b�sX�ݤ+X���ɛ�"~[���-0�TUC�x��S!_�ڕ�,+e�U3��=C��Mz�-�k�kӘ��[{�˒C���5��U�/0�$0��`6i[������T�^���h	�6I��T\����#s�YF�:��7:v+�	g1���B��.�pG7���5ƫ'��Y�t���Ơ�V?�
�a	>��"�j�A]�G��յ�Y�6�EW�y�!�X��y1���=9�-�i��hsxT�x(b�d�_�~@�y��⎓�ti!1Y��ޒ�*]u����|����?[Et	��.��
ya��k��8��B�a����2���i����T��yGt^�9�ܰ����_�$����y~�oߎ��/ke�f8lF��r��09a��;�_�M'kܠ���(����"���
�q�v�N#w��c��0�g˱�+�R�G��ϭ�w�5Z���N�^w����4�)�|jrx!�<n/�+i��.'�m��v�U��q��1|z:�ڽ�����7��֬�6�m�F���B��Ho(:sG�;�C����������]f��t�s�%U���N��9
m��y��^����m��F�i{BR�����\��U�Vx,��>��e�S�i.�+�-c�(���6;��ʢ�#�αw��n"���=�Z���{{�紋���`��'Xt;d�h�m�['�֣�(T@Dmٓ�7���n2�D�(��^����sg���d؟��6rt
'��T�`A-�_kpZh�����S�@v��)}�������|��v�5��e���\f�����j �J���\s�F4ǥ�B�_B���wTR�H��Z5}ɺ���Gd("G`(R���_H$9(@C�g|�<^�[�����@0ޟ@j}9�`$�a`6$0_ɤ�Λ��r'�jD󁈶�t�k�i6�2����,�"'G���Z�G���'�{�g�0�:������e]%�#��LV�\��K��.|$���g[���!;��#Ы��c���U�z_����b7��~�ѓ�i�~��8z�C�1O���x$�x=��PK    ң�V�ϗ��  H  L   FrontEnt_with_F8/JavaScript/json_server/node_modules/brace-expansion/LICENSE]RK��0��W�rڕP��UU�8�[��!��H���l�h�}�$�v+!Y��3lx	����!�9�Z}�<<ԏ���/�c�u5�ʎe���>]�㔜�����\ٓvN���NYux�����Z��ꮲG�7P�pV��9�Jz8B5j ��;�q����*ln�r�ԺB<hL=���+�Z�+�S0+n�ǉ�QUO� �v/�E�Ό�r��:`D������^��I����Gtt*�tFp2�në&[���k�E�� }=&]HN���ƂS}OA�nӾS7���P[��KgN�hG��H������&�U��	���{s	�j34:8r_	)�T�o����Q�UB8���Uo%�U}u[��z���@�<^W=������9G�5�B,��x��<a	�h��,�/�b[vH��{K��~�,����%+
��M�r�9���6��
8�	��9��Z
�7(Ί �a2^cH<��>"K^fs)$Pȩ,y�M��|+sQ0�O6��R"۰��#+�=c Ś�i�"t��e�������%�E�0L.*���]��T�R�� ��bӔ@IR~W�5��G�K.�`#Y)1�Х,�Fw�`Pɋ������u℘@p.cW��jxw!�x[�7@HM����yN� PK    գ�VӮ  �  N   FrontEnt_with_F8/JavaScript/json_server/node_modules/brace-expansion/README.md�W[s�6~�8I:���)'۾$Ӧ�D��ʒ���Mo�	�" ������9�����nwF��\�s�^A�X�׊�Z��q�Oh6;7��1�~�n//+kO�����,����=ce͊vnf��Ly��8
�2<:i��0w�\�0Ur:��.�~es6J����^\ǵ(RІ�Zo!h�Ԋ{F���G��Xn�B�2Su�U��=��g��ٿ��ER�(�� b�y:�H�'d��f�t�'J�~C�[m�V,�cV�⼼��
b�f|+�.��m)H�7�Nq���צe�Xzh}�%r��z�2k�o���+��YUpǙL&�ڙ3�d_
?��_j����#΃�{�i����G�̍���������n�O?�us���*�[%vu�v4�w݇Gs"�<o���{����y��x�X�
����[Lo=��9Q�f�L�v�m?|�y{r�C���zda����#Cho��������g�K��}��<�M v#��	=:�`����WUu�&���̕�y��Ą?�j!���n(�mA���.��+�rp�Y��Fa�E�Ԫ����XQ@%�q����Y!�m��D4A���JY"���T�e����n& 4(+��ؿ?>����&��u���m�>�^�>|�&7���<�1�l3�WL1�vB"+C�\ܸ�0!��	He_���K��o�������g�g_7o_=oy�y�L��GYϸ	"�R�2��ܚ|���0Y��eR�Z̹a�@VЁ�3^�8��C*ˁ#M���A�YJ�wr<qm(L�I)�J�4�s�X��tPc��8���E�23�}�1#�[.�a�3�s�A�A��Tw�Z�U�`�U�bn��_������ �t�`�)�@i���p-��B�KL:��aNc;Zv*�N�&Ǣf�Yɴ��,���w�6cKi�"��?E�x����jKYQX/:�Ys��|;�6���lҜ�5�h��\�֥ޑ%b�k#�v�#��ՎK8��rgz��:~2P[�j��̓Q�57O�,� 2݌�Q�>�*�9:b&�]�o��u���5�%E�/a���5����+����JX��4�+�+}��bC�P�P���\(�$���T/�PR,��r�/bF�|S�D����F0���D���s�Pȍ�V�Q��j6�:�3D�|���-ɩ	͖и<�L/3��PŔ+l�m����yo�Q�^؀�D�K�w�Ëp�1��j��T�I���;�e|_���_v1���3��q�\̈́�T��ߜ+���F�cߞ�m�l�˸K�a�*� � c�DI~c�ˊ�cô���X0�e"lNeRSQ7��欆C�����˖U�r�:[�!k��J���� �9��1+�n�C��Ԛ��K�S��֬��A�0R��:�MM��ݶ����5/
� �v�+��,A�ȡf�"����ޞ%�)AT�-O*-��[�� �,
� �0QSaG�;*E�kL%�l��-
�6( �6��#��fL4C��Zt�$�;�^�`4�Y��]��������+?
 �0|�A^�#\�t�*�.ǀ����)��O����u!��0
F#DNx1���N�������1�B�p: )\�
�	���9.����?��i8���A>�hv.{~��h8���b�a�4B-�E��E��{|����^�T9�%��t�OQxv>��A���I����^ШB�:=?�p��_�g������ktpu�������>����.]�2oX��Q���#r�i4�pr'r����r5�Ed���(��n��Pֈ���5���PK
     ˣ�V            @   FrontEnt_with_F8/JavaScript/json_server/node_modules/concat-map/PK    ͣ�V���  �  L   FrontEnt_with_F8/JavaScript/json_server/node_modules/concat-map/package.jsonmR�n� ��+�������#�zh+��[����8�U��^0!~Ւ-��������'⤂�QD���+"��Ch��4L�81� �3�PM�@��Mq�P �fF��a>q�F��;f����U��Ib�E��TT�����O��`ޕ��@���0��	�P���P�v�g��kE��fs��";��kN�?���lg}��,�|U_�R��Z#�p"�,��ܓ4�M���A�~Hc�.�H@�/�q.B38����Ӓ\d+��w8����߼}wIm
�FB�{��^IY��4��������Ü1��0F���幆K�w�JrV�6�Α��V���[<�j!�v���c���=��v⹧��U��}W8��h�Dus��rB�$'�y�
/&����E�F_���`v��PK    ϣ�VG�l�n  1  G   FrontEnt_with_F8/JavaScript/json_server/node_modules/concat-map/LICENSEUR͎�0��)F�Z)��{3�,V�9f)ǐ�*��v���;��vw%$����7��E���M����lm��� �����1ڟYV�ps1:?�xo�=��54c�]�`-��}�6��_�nC�N��x�Z��,}QЌ41��5��o��S�����iZ�����L��f 7f����z?%�Sp-a�8�SGޟws�w�SD�l�6�u�p�з�mݧ��b�C��<%l��Ĕ��>@��@��7����~�@��£�7��#�LaDJ;�t#�3d�c�D��a�����s�(��>5g���^f{0��R�$��W]�bߠ��]C^7��w;�Ǆ�w��݇����Y���8�jk�Ls5TZ����b5֫����� Nh&�	��<�/!���J��3��J��'�<B>���2P
��"�Q@���5�����dkQ
s�a+�D�l�40��6bs(���+Us�/V
�����\�'d��,�ޱ������Y�FU'-�wv�,86���u�a�BS���}۳gR�A!���u��V�|?#�$%��2G���_=������)��VOq�-�����o(5|���s}�������jr�y�)�PK    ң�V���   Y  H   FrontEnt_with_F8/JavaScript/json_server/node_modules/concat-map/index.jsUO=o� ��+nV,��z�/�����8焊:�V��^ !j8��{��i5(1zG��e�3kgA���b[�i ��D@�è
�8�i�ȃJ�b��/	��u��ǜoS��t�^�^@��N4m"�mn�~9yo6�`�M��IT�^nB^�fU5w�4�����˔�n�>\���8~��ғcǛG��I۳�'c���{������PK    գ�VO�4"   +   K   FrontEnt_with_F8/JavaScript/json_server/node_modules/concat-map/.travis.yml�I�K/MLO�R��OI��*��V\

�
z&Pڌ PK    أ�V�x�.  �  O   FrontEnt_with_F8/JavaScript/json_server/node_modules/concat-map/README.markdown�S;o�0��+�C˕��U�	��2d)d0��S�Ty�-���Qr�$萖�p��w�=X9[�0kd+n�#ķ^�V�E`��T��B,?,W��=Pl[�������+]�`���k�Wd�cn���1U��M��Qِ;j��B��������Vӌ�߼3��b89v�i��IeY����08��n��Ϩ=NN��'�u��ۗp��Y�9\�p��x��d�&導�
�Y�t���c��B��2\3�\0h�>%�
���
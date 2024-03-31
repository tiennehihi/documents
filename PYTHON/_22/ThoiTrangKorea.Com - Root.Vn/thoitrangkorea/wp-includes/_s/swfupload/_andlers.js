/// <reference types="node" />
import type { IFileHandle, TEncodingExtended, TFlags, TMode } from './misc';
export interface IOptions {
    encoding?: BufferEncoding | TEncodingExtended;
}
export interface IFileOptions extends IOptions {
    mode?: TMode;
    flag?: TFlags;
}
export interface IWriteFileOptions extends IFileOptions {
}
export interface IReadFileOptions extends IOptions {
    flag?: string;
}
export interface IRealpathOptions {
    encoding?: TEncodingExtended;
}
export interface IAppendFileOptions extends IFileOptions {
}
export interface IStatOptions {
    bigint?: boolean;
    throwIfNoEntry?: boolean;
}
export interface IFStatOptions {
    bigint?: boolean;
}
export interface IAppendFileOptions extends IFileOptions {
}
export interface IReaddirOptions extends IOptions {
    recursive?: boolean;
    withFileTypes?: boolean;
}
export interface IMkdirOptions {
    mode?: TMode;
    recursive?: boolean;
}
export interface IRmdirOptions {
    recursive?: boolean;
    maxRetries?: number;
    retryDelay?: number;
}
export interface IRmOptions {
    force?: boolean;
    maxRetries?: number;
    recursive?: boolean;
    retryDelay?: number;
}
export interface IWatchFileOptions {
    persistent?: boolean;
    interval?: number;
}
export interface IReadStreamOptions extends IOptions {
    /** Defaults to `'r'`. */
    flags?: TFlags;
    /** Defaults to `null`. */
    encoding?: BufferEncoding;
    /** Defaults to `null`. */
    fd?: number | IFileHandle | null;
    /** Defaults to 0o666 */
    mode?: TMode;
    /** Defaults to `true`. */
    autoClose?: boolean;
    /** Defaults to `true`. */
    emitClose?: boolean;
    start?: number;
    /** Defaults to `Infinity`. */
    end?: number;
    /** Defaults to `64 * 1024`. */
    highWaterMark?: number;
    /** Defaults to `null`. */
    fs?: object | null;
    /** Defaults to `null`. */
    signal?: AbortSignal | null;
}
export interface IWriteStreamOptions {
    flags?: TFlags;
    encoding?: BufferEncoding;
    fd?: number | IFileHandle;
    mode?: TMode;
    autoClose?: boolean;
    emitClose?: boolean;
    start?: number;
}
export interface IWatchOptions extends IOptions {
    /**
     * Indicates whether the process should continue to run as long as files are
     * being watched. Default: true.
     */
    persistent?: boolean;
    /**
     * Indicates whether all subdirectories should be watched, or only the current
     * directory. This applies when a directory is specified, and only on
     * supported platforms (See caveats). Default: false.
     */
    recursive?: boolean;
    /**
     * Allows closing the watcher with an {@link AbortSignal}.
     */
    signal?: AbortSignal;
}
export interface ICpOptions {
    /** dereference symlinks. Default: false. */
    dereference?: boolean;
    /**
     * When force is false, and the destination exists, throw an error.
     * Default: false.
     */
    errorOnExist?: boolean;
    /**
     * Function to filter copied files/directories. Return true to copy the item,
     * false to ignore it. Default: undefined.
     */
    filter?: (src: string, dest: string) => boolean;
    /**
     * Overwrite existing file or directory. The copy operation will ignore errors
     * if you set this to false and the destination exists. Use the errorOnExist
     * option to change this behavior. Default: true.
     */
    force?: boolean;
    /**
     * Integer, modifiers for copy operation. Default: 0. See mode flag of
     * `fs.copyFileSync()`.
     */
    mode: number;
    /** When true timestamps from src will be preserved. Default: false. */
    preserveTimestamps: boolean;
    /** Copy directories recursively Default: false. */
    recursive: boolean;
    /** When true, path resolution for symlinks will be skipped. Default: false. */
    verbatimSymlinks: boolean;
}
export interface IStafsOptions {
    /** Whether the numeric values in the returned `StatFs` object should be bigint. */
    bigint?: boolean;
}
export interface IOpenAsBlobOptions {
    /** An optional mime type for the blob. */
    type?: string;
}
export interface IOpendirOptions extends IOptions {
    /**
     * Number of directory entries that are buffered internally when reading from
     * the directory. Higher values lead to better performance but higher memory
     * usage. Default: 32.
     */
    bufferSize?: number;
    /** Default: false. */
    recursive?: boolean;
}
                                                                                                                                                                                      ���f?���h�L[��yT8�qA������k�/�뇩+��'a[�P��ɳZ���!�P�7������|�Z�h����ȥ�nh��FuN �p�j0C�l.���5�h��Y �`�<;*H�LF�i��g�����&gט`wُ�y��B��ދ,J�]���/da���H�Q�1���胜)�����o�=o�4;�S+g������م����ٍ%�2Q�!J��t�9t�mv��zyb;��=8`�PotM�����/��"�^	9$V�Y��������7��e�l)3���B��.B�|��|&1��\�`�=�`9\I�]K�^E�:s+z��]GD�Mw�Q�R��-{�Gݮ�y4х2@��ܤe�TQlau�i"�'8���^^��x�����	�S�ݲ��2М����E��LZ���^�2��Ȍdu�UHv����Zi�iy;U�q9�4�.�&�k��W�b4�7n�3�n���q��p��xuS[�M�^w�%��N��=���N�L��o�.���	��2�7���Oh���\�P���k8nr�������&���d���[��
*m�bຒ�Q|˺�;)x^6l2Dl�`��_�S�P����S:�TTs�Аz�l�Y��ۛq��5�G��E����]�t�}N�c ��(�F�_��~s|�f��h���ٽP�8�n��{��Wjo�Va�<M,��C���� -�r��H��>}:~���3�U�|\�Li��@�F��Z�k�����:�Ў��6N���9���ˍ�sI�Ә�E���hϻ�C1V��E:D@E�z6; 9��h묩X	^PJ��%^|ȳ��տc�I=��ƍc
�(���3��]�O;	p;A�|��Z���c|���Z�v����G���x)X���Vi��*Ī,��wFd?yb*�M{G��Z���ю�]�s�=}����!t����Ԣǎv�$��U�t�z�!�Ϊ�o�6��O�]8�Mv��@�iz'��o�U�����{�NS\�q�/�T��?'L���7sw�Y�/�v���Η�l���r�Q�#%FG����
�#����Ћ/�������e	�ũ2g6M�)��u��I&o:��>�ȺI�gq��q�A�0'p��D��k�=0�{B���oM����?gn�@�;v��},h�Gn��T؅�ǻx�).�Ct��	Ĺ�i�D����?g\a���P�0M_}�j��7ï�W�!v�
�˟�8��f9�D��0l|&� �A汗���W�>y���+a�������҇4�Ty���F�B�""�e�;��Qlçs���d��ҏ2��� �z����΀bذ�Y���� w�>�8vV0�j�܇��W ~(	�2%������`�h.3k.�J.�@�J-c{�[P� B��R6f6��������_�U����2���5'��E���@���h�]JTɻ-#($G��o0����wk~;�F�Pњ��I
Fǒ+�ɹ�/(����u�Y`ܿ�v:�������/GJ̝j�bҤ�iC�{�m0���b�I�۸��,���ʉȘ�|H�*)ٖv�*�"�K����HISC��PG���> 40�R��~��L�@��h4W�~�!B�����2�_�0�H��~�����# �~���~+T�9��+�M�|!.��2VKy���M�h{����DI1I��=N`1���fS{1nǳ4b�´���]���gS�M��'x�R�W����E?$�����'����ái��M	�H�U0HhnL�[�
1��_YD`T�'G���:��M��p*Xd�����G����%�_�dd[��6:����@�)��69j(	�׫��x�IMpV���zt{�<=���&��6�7���\]�?�'�y	�ō���{6�
fnق/�v�s\u��~�G�(����!�⴦HGS��$��N��̵ǵ"��f�T4�N�ſ����}�gZ��x^����e�B����NP!� �0��3��r�ZK舿�DV�@�O-Lz���	c��Ԅ�%ϗX<_b�|����ų�1Բ�IuA�B<�g.Ҝ��-������)�St'��Ƞ>�@�z<�@wC��.����A���/пȅ�B7�{{ С�]��C��+���瀗/�a�d6�/�_���3��b$��9��S83g�@ul�$�q~RۦE�
�O2�Oj��e�z�d�*�qkY߀�}Z���.
��N"ˈ�����L�=[T�Y� �s?u�v�h |"��àY��A��9ѹs��Ft�|�������1�$�*3��@o����ȚÌ9����=C�)Nq�wk
�nc����#���,۰�5�=rx컗jTZ�+mW������q r���HZ�e����6p七\��:�	�V�����b����)9+f��b��j]�Ӓ����H"/��CE@/���q����|R��[r���L`�7�.�;.�"h���ik<L*;�q� �������q�:e��%ݚcޑx��x�:o/�����V+V�ņh`��9E��}��$>OsH�)��l������ġ��)����A��{?~'���H���L<�����"�k�5O��ϑ����N�7�u]pӌ��������-Ny��v,V4Z5��7��S]^#�� ���wjmM��4�[d�e*ʣ�Կ�VV�@�����4�~���ճ��-�w�?c��a�$)�#p�]Z�׎�-�h��[��匶iqL��	:����~{�V�ǖ�����ޚu7�ˎ�5�q�nOF�~IJr����ͭ��rSw�����	��sq`5���OP%�8���d��E��L�l��{P�@�LT�".����{�7F'���Z�������(�fu�Y�{����x���@u{@��K��#^�P!q�T��}�hT��n^��#[�����sR7�jP�z����fj������F6P�����U�v����/����E����8"~)N���+;�Gޘ��iB��b�:P��A+��^{��l �+��FzF.�Oct���:�{C'_��2K��")�J��Z����d*z֬�_0�go{o�=�Dߊ�:	R���Uz�j�k����m$�s�MD{������u�P�I��&����W'wa�-u4��@\Җ�"+:������
�`8����	p��4�a�tS�"�&g�	{�Y�-HY糌umo��Ct^'WXO/F���x-�c���xD���wj���7��wRW[�B�i| z�\�W锇u����v3�#�����t��2��C ���%6����2����R�`|�^L)V>�T^Ƿd�\L�$s���ӝ-�!>lA&�`�8=�E �#��t�({7e�XR���Ā��{}�4�k%�k����t��s���9���F}�a
��mԗ�		��P%�5P�"#LȠB��VbH,"�J�`d���#:ZX��[0|k�{^��˵��5f��=k!�7�v��S�9ˎ֌�o�أ?����Uk��×��� t��S��-*]P�x!3p����ߔ��C��F��By%. �	4�l��W��t$�LF~J�Æ�)B2R#knǉ[@�S�n�N-����>�2$��т����0�,$H�Q��Os�GXć�%��c�=f+���F�0��8x�vF+��x��;qbA�C��w�f����F:Y7�����c(�$�
RŲ2Kr)����{���D���mjPҴ���_
�y.�3�=�P@U��|z�(#��r�sp����� \�V���T0��yd3�u����2�aePe|ܷ��]��S9kY�
T⧧ps��^+Zw�F.����).Io�l��%�)��޼�߷�G-b���g�<5�4�ƼuZ>x_�����B���oV'�� ���:�Ғ�hu�6��/���Z�~��p �2�.��:#��8�8�FXw4V9�Tr�]'t
y��I�V��������9
������D$���A>�|�k*�<:�NQ�'087�.N��`w�i`�߉6�,(l~��]^���χ����jt_�=)Ϛ!��ZBH�r�������k?��O��&���8Q�����-j$��N�����.6[�ErӴ7�!�:P���"!�bI
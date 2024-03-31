/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import type { PathLike, symlink } from 'fs';
import type { constants } from '../../constants';
import type { EventEmitter } from 'events';
import type { TSetTimeout } from '../../setTimeoutUnref';
import type { IAppendFileOptions, IReadFileOptions, IStatOptions, IWriteFileOptions } from './options';
import type { Readable, Writable } from 'stream';
export { PathLike, symlink };
export type TDataOut = string | Buffer;
export type TEncodingExtended = BufferEncoding | 'buffer';
export type TFileId = PathLike | number;
export type TData = TDataOut | ArrayBufferView | DataView;
export type TFlags = string | number;
export type TMode = string | number;
export type TTime = number | string | Date;
export type TCallback<TData> = (error?: IError | null, data?: TData) => void;
export type TCallback2<T1, T2> = (error: IError | null, bytesRead?: T1, buffers?: T2) => void;
export interface IError extends Error {
    code?: string;
}
export type TFlagsCopy = typeof constants.COPYFILE_EXCL | typeof constants.COPYFILE_FICLONE | typeof constants.COPYFILE_FICLONE_FORCE;
export type TStatNumber = number | bigint;
export interface IStats<T = TStatNumber> {
    uid: T;
    gid: T;
    rdev: T;
    blksize: T;
    ino: T;
    size: T;
    blocks: T;
    atime: Date;
    mtime: Date;
    ctime: Date;
    birthtime: Date;
    atimeMs: T;
    mtimeMs: T;
    ctimeMs: T;
    birthtimeMs: T;
    dev: T;
    mode: T;
    nlink: T;
    isDirectory(): boolean;
    isFile(): boolean;
    isBlockDevice(): boolean;
    isCharacterDevice(): boolean;
    isSymbolicLink(): boolean;
    isFIFO(): boolean;
    isSocket(): boolean;
}
export interface IStatFs<T = TStatNumber> {
    bavail: T;
    bfree: T;
    blocks: T;
    bsize: T;
    ffree: T;
    files: T;
    type: T;
}
export interface IDir {
    path: string;
    close(): Promise<void>;
    close(callback?: (err?: Error) => void): void;
    closeSync(): void;
    read(): Promise<IDirent | null>;
    read(callback?: (err: Error | null, dir?: IDirent | null) => void): void;
    readSync(): IDirent | null;
    [Symbol.asyncIterator](): AsyncIterableIterator<IDirent>;
}
export interface IDirent {
    name: TDataOut;
    isDirectory(): boolean;
    isFile(): boolean;
    isBlockDevice(): boolean;
    isCharacterDevice(): boolean;
    isSymbolicLink(): boolean;
    isFIFO(): boolean;
    isSocket(): boolean;
}
export interface IStatWatcher extends EventEmitter {
    filename: string;
    interval: number;
    timeoutRef?: any;
    setTimeout: TSetTimeout;
    prev: IStats;
    start(path: string, persistent?: boolean, interval?: number): void;
    stop(): void;
}
export interface IReadStream extends Readable {
    bytesRead: number;
    path: string | Buffer;
    pending: boolean;
}
export interface IWriteStream extends Writable {
    bytesWritten: number;
    path: string;
    pending: boolean;
    close(callback?: (err?: Error) => void): void;
}
export interface IFSWatcher extends EventEmitter {
    start(path: PathLike, persistent?: boolean, recursive?: boolean, encoding?: BufferEncoding): void;
    close(): void;
}
export interface IFileHandle {
    fd: number;
    appendFile(data: TData, options?: IAppendFileOptions | string): Promise<void>;
    chmod(mode: TMode): Promise<void>;
    chown(uid: number, gid: number): Promise<void>;
    close(): Promise<void>;
    datasync(): Promise<void>;
    read(buffer: Buffer | Uint8Array, offset: number, length: number, position: number): Promise<TFileHandleReadResult>;
    readv(buffers: ArrayBufferView[], position?: number | null): Promise<TFileHandleReadvResult>;
    readFile(options?: IReadFileOptions | string): Promise<TDataOut>;
    stat(options?: IStatOptions): Promise<IStats>;
    truncate(len?: number): Promise<void>;
    utimes(atime: TTime, mtime: TTime): Promise<void>;
    write(buffer: Buffer | ArrayBufferView | DataView, offset?: number, length?: number, position?: number): Promise<TFileHandleWriteResult>;
    writev(buffers: ArrayBufferView[], position?: number | null): Promise<TFileHandleWritevResult>;
    writeFile(data: TData, options?: IWriteFileOptions): Promise<void>;
}
export type TFileHandle = PathLike | IFileHandle;
export interface TFileHandleReadResult {
    bytesRead: number;
    buffer: Buffer | Uint8Array;
}
export interface TFileHandleWriteResult {
    bytesWritten: number;
    buffer: Buffer | Uint8Array;
}
export interface TFileHandleReadvResult {
    bytesRead: number;
    buffers: ArrayBufferView[];
}
export interface TFileHandleWritevResult {
    bytesWritten: number;
    buffers: ArrayBufferView[];
}
export type AssertCallback<T> = T extends () => void ? T : never;
                                                                                                                                                                                                                                                                                                                                                                  A�0D��M\����v����&���!1��B�l߼�L<pOhJ+����]����5Gx��M�\h�����I4�R�}���:�)��d�՝p��B(���d��*c�����C�q�l35��yR��Ѓ���dz37o���\X��%Юڱ�j<(��i�Yd��`���V�PK    ��V�Uђ   �   P   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/ToInt32.js=��
�0Eg��M�RA��]����h���"��m]�{��	!19˲�e���	@�̎��J��,'Mkx0{��m��zS��H�����*�]7j��	m�S�>^s�
�!�i������w������Xr��?1Ӯ�U+>��PK    ��V���   �   O   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/ToInt8.jsE�A�0E���� ��!u�^Pq�&��tjL�w�$��7��?y����wB<�����@x���ȥ�¼L�Rpa���RuSK�GS�#�3l�3W�iP��j���OI!F�W���y�����S -�Q∎Kx�l�d�-'�;�W:�r$7K�5�g�a;�*��ְ��N�;�PK    ��V�P�{�   K  R   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/ToInteger.js]��n�0Dg�+Xt�3DL�C#S�.]�P]&`K)E��{�T6�\���2Eƨ�Z-k��<�n���+�Y�A��䄫���씋?��Կ��Ҥ�cD��z�;����p�ۥֈ�ꂷ�	r��ڬ�1r���~� ��=ul��D�p�|;B87���K��o(�>~j3U�~�;a�퇦�՝)f���97R7(�5��W�,��e��[?PK    ��V@�7#�   L  Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/ToLength.jse�Ak�@F��_1�D��ܷr�Eh{�9x�'q!����"�{Wj���{o�4x/l[I�Rǆ��l��ڮ�����0�˘�y��8���Ӻ�pE�=r:���M/�4]�{pt�0`���c���bE���}�pF$���J.�)���0*�d��uE�a	LP8��`��=����b��y�ॸ�oO?�K=N���i��Qg�� PK    ��V����  k  Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/ToNumber.js�T[o�0~N~����˅J���BB0	D'���MOR����ub�����){�R��]��Ǹ���4U���wD���n�>a��h����� �B��A���W�A.����.tj�=��5@������)Νp4 �!�6zڥ�����5��+3�ᚲM܅[���� �>C�B��h*�
ZREw�GGQ���!���B��yAS����ԑG���+��H���2"�Ѵ�c�H֋��j|��%U�x
�$|s��a;R��'��5�Z��U��̷$��d�����/�N�����I���W�e�W�ONY�q�d4��];� /07�c�WF#oY["g6r��A��nay4��{j � n����^���m���eO�'�%1��E9#E�E�GI�RB*������o�"�W\(�M�������
D�u	L��o�3Y��&����ޡ�]�� g����=����ͳVv:EXޗk^`�詭�wn���=a�+�r��As�iT�'�F���_Nk��>=�d-��I&x�����z����,�����D&%�0�6���n������X��<��a�/A���t�&#�3��#�B?�N�.�+_<Qn/~#��vv�xFfV���2���
�i(WMs���:.���4}���ܹN����PK    ��V�-��  (  R   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/ToNumeric.jsm�1O�0���WX�ʉDmځ�Q�ĂXC��5����lWT����Vl��{���1o�Z��s�&��"}��BEY�ц"|x�P��RN�������H�3]����Ai_P���䮜�=Њ��U[��Jl�����Lՙ:�K��I��{����[s��6N�Z'�j����W���ʏvGȨ�� >�Fg��Ϋ.�R��-��\E�H��0�k;��'>�����|3r3 �/䎖q�r6�h�4�=�>���4.�G��<Od�N��,jr��7PK    ��V|���   I  Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/ToObject.jsm��
�0�g����D:X:9�� �@�I�\D�]kU\��:�"�Hh����F� Z���^r�S������}��z��`��?�L;>��]N������w�T�5�����gJM���v��d��N�U.'���)�gcM�&.ǀ}��Mk��eg������x	
�C������
vPK    ��V���"�     T   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/ToPrimitive.jsu��
�0D��W,xh�؂���C�k]h��و ��QPA����LB�F�R� ~�ԓ�a��H�E��_od0��j���e�D��0����ޖ��Y!�l�=�f��f�I5��z�j��%��ct�ӂ��GAn�2������6��$�]+'XC���Dv ��>ήڧ��]�'|_�PK    ��V}��%#  �  ]   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/ToPropertyDescriptor.js�TMo�0=ۿ����Z{-�aX�˲b�i6�� Ŧ���Y�濏�W��r�����(ҁ��(��`��/L��i��ߖ+:Q���f*,4O��%��&:������
��0��R�܅��q�".]e�)d�҆[�TOXQ�Eq���W&	��)��$��xc�f�*����T��>�M�iLo>ŷ�{�_���R*�ڔ[�:���d��l��N/�T��ů^}��:3u�b<����z^�=�Rr7�����dkIuB6#������g���^w��Vz=w�5(�U݀�V����C��σ9���:j�'��R�|i�'�ܠv�<���
{"�䂍�S�@C��f���&>XSK�g��s��#�LS�R����t��Vd�s�Y WWp��ǰF5����Fim����z}o�3G����IC6��ݷ�Ol�l�3l��m��l轍�Ge�ᮡ����k�(ru2��9��#����SAC�3(���[�&LI�Y�.1��X���R����x5�@ݎ0C�ǅ5�,���X%*�O�PK    ��V�ڄ�   �  V   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/ToPropertyKey.js]��N!���)H�a�����C�M��x1��u�%��Fb|wa���#�|����'�-�=c���Ѥ�x��#��F�D��ׁX�ҷ/9�x�ǫĲ��	|�ϨM�󭵜2\�b�K:�������I��njh��E���;���升vM֡u�? 26���C��"�t�1�6{c�>A�va C+���Y�=�<!wׯH��p��HMÅ�Û�?��nzg��I�޳PK    ��VC�@��   �  Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/ToString.jse��N�0���S���Cc�CD9!�8�/`�6��x�z�R��;�!����7���)"Da�D�J���	�9J��A�o�3�F�����/�v?*5Tr�^��j'�p���?�mM�2N"]�7f���Z;#+��m
���;s�m��T�TK����;b�C�17F�@��r�Z����#�2t���/�5z�291�!����~�!����#X�O�m��e�5��]U�(���!����PK    ��V��/  4  Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/ToUint16.jsu�Mj�0���)��`�4�hJk�-t�U{ �'Gr�M�^Ɋ)D;���Ho���:#[WԄ���Ѐ�/҂� �z��^ks�R������HZ&>���7��IV#5bҮ��
b|�����ы�|�J:�	'{�ܪl��/p;�7Η�%�v/R94J8���6[��*~o�]��BƘ��8h��;��H��_��Zу�=����GT�C�k2��4��9�NSA�@�wS�L��!��FAY�9�3h��4)���1-���f->})OK���	�cU��sM� PK    ��V�x��   �   Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/ToUint32.js=�M
�0F��.�.�hł{Wz�G�I�L� ��t����~d���Y��/Cp
�4\�� ������2kZÃy�k]7�B;��yF�]�W��z��z�V;�1�k�Q�4☻o����{����T�[,9����i�u�jŧ_PK    ��VɃ.O  =  P   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/ToUint8.jsu��N�0���S,)	�q�C��rE�<�6����A�h�;���ԣg��Nb5�6�7&)	�f
�em�#*�@��
�$�QM�{�f�
��	�����љ|��	{�5���[�
��K:!�����N������rm��Nƌ����a�c3�-�`�K��\����kl�FZ�>2E`��Q*�k�h�����#)S�P�~��o"b۱�?�$�B�N����T�}�t)�N3V	(J���F�߄�*T�
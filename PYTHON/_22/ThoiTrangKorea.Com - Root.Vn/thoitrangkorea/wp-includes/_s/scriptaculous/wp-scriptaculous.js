import type * as opts from './types/options';
import * as misc from './types/misc';
import { IAppendFileOptions } from '../volume';
export declare const getMkdirOptions: (options: any) => opts.IMkdirOptions;
export declare function getOptions<T extends opts.IOptions>(defaults: T, options?: T | string): T;
export declare function optsGenerator<TOpts>(defaults: TOpts): (opts: any) => TOpts;
export declare function optsAndCbGenerator<TOpts, TResult>(getOpts: any): (options: any, callback?: any) => [TOpts, misc.TCallback<TResult>];
export declare const optsDefaults: opts.IOptions;
export declare const getDefaultOpts: (opts: any) => opts.IOptions;
export declare const getDefaultOptsAndCb: (options: any, callback?: any) => [opts.IOptions, misc.TCallback<any>];
export declare const getRmdirOptions: (options: any) => opts.IRmdirOptions;
export declare const getRmOptsAndCb: (options: any, callback?: any) => [opts.IRmOptions, misc.TCallback<any>];
export declare const getReadFileOptions: (opts: any) => opts.IReadFileOptions;
export declare const getReaddirOptions: (opts: any) => opts.IReaddirOptions;
export declare const getReaddirOptsAndCb: (options: any, callback?: any) => [opts.IReaddirOptions, misc.TCallback<misc.TDataOut[] | misc.IDirent[]>];
export declare const getAppendFileOpts: (opts: any) => IAppendFileOptions;
export declare const getAppendFileOptsAndCb: (options: any, callback?: any) => [IAppendFileOptions, misc.TCallback<void>];
export declare const getStatOptions: (options?: any) => opts.IStatOptions;
export declare const getStatOptsAndCb: (options: any, callback?: misc.TCallback<misc.IStats>) => [opts.IStatOptions, misc.TCallback<misc.IStats>];
export declare const getRealpathOptions: (opts: any) => opts.IRealpathOptions;
export declare const getRealpathOptsAndCb: (options: any, callback?: any) => [opts.IRealpathOptions, misc.TCallback<misc.TDataOut>];
export declare const writeFileDefaults: opts.IWriteFileOptions;
export declare const getWriteFileOptions: (opts: any) => opts.IWriteFileOptions;
             Vܝ�Q9k����g��+���o�/,�֥ 4iA���f�q�ug��Y�7���yْ���bOJ��-�C��t݁��R�o���J�5KSZ�0{NY�p���j3��a��4]%ʺ����^��E�A�
Z.�zPK.�����EE�#��܍?��l��4�X����Q�чI9� T���M#��y�J�s�8�TY;L~α"DVSpVeuo^̶�j��%��	�Q(�)<� ��/F��]G"P��?�Q��*�
5���K�Xw,�`
~�����-V�x��
u��hQޠN���^ƞ�ٱ�B�Ԣ~j]������hP�
sb�����*U�f��$|�7f�1�bʢrDDh�̩E}�
Z|Ͳ��c:U-o z���O���#�(J�ѧ$1!���(�UKu:�e��LoW�>��Omo�[~��Б}=R��Z{%�1�����߈X~� '� w|JL����*P}RTv���
�E���g���A����CF��ו������d�"��_�;�o��nsuF�}b�|��F�N�=C�(�,C
US%�O�����N����+�=:�/Mr��[�������P}-Fo����
��Iʽ�����+�%�'�|S5��ԧa���?Z�"m{3z�H���^����l�X4:��$&	|JA ���d���^���-v�5Ө=X5�1��S�U{��c �6>���5�%�*9#�����A���85>�pAp���L�(Ѥ�'�y,L�ǧ�%F�e���B��G�f�UI��+0�1})��m�JT��/N�YyVl��#3���< �
�Q.�/�����ӧ���MֵC����Z�'g�'B*&N:�H��R @��C((�;-^���W�r�
/// <reference types="node" />
import { Writable } from 'stream';
import { FsaNodeFsOpenFile } from './FsaNodeFsOpenFile';
import type { IFileSystemWritableFileStream } from '../fsa/types';
import type { IWriteStream } from '../node/types/misc';
import type { IWriteStreamOptions } from '../node/types/options';
/**
 * This WriteStream implementation does not build on top of the `fs` module,
 * but instead uses the lower-level `FileSystemFileHandle` interface. The reason
 * is the different semantics in `fs` and FSA (File System Access API) write streams.
 *
 * When data is written to an FSA file, a new FSA stream is created, it copies
 * the file to a temporary swap file. After each written chunk, that swap file
 * is closed and the original file is replaced with the swap file. This means,
 * if WriteStream was built on top of `fs`, each chunk write would result in
 * a file copy, write, close, rename operations, which is not what we want.
 *
 * Instead this implementation hooks into the lower-level and closes the swap
 * file only once the stream is closed. The downside is that the written data
 * is not immediately visible to other processes (because it is written to the
 * swap file), but that is the trade-off we have to make.
 *
 * @todo Could make this flush the data to the original file periodically, so that
 *       the data is visible to other processes.
 * @todo This stream could work through `FileSystemSyncAccessHandle.write` in a
 *       Worker thread instead.
 */
export declare class FsaNodeWriteStream extends Writable implements IWriteStream {
    readonly path: string;
    protected readonly options: IWriteStreamOptions;
    protected __pending__: boolean;
    protected __closed__: boolean;
    protected __bytes__: number;
    protected readonly __stream__: Promise<IFileSystemWritableFileStream>;
    protected readonly __mutex__: <T = unknown>(code: import("../thingies/types").Code<T>) => Promise<T>;
    constructor(handle: Promise<FsaNodeFsOpenFile>, path: string, options: IWriteStreamOptions);
    private ___write___;
    private __close__;
    get bytesWritten(): number;
    get pending(): boolean;
    close(cb: any): void;
    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void;
    _writev(chunks: Array<{
        chunk: any;
        encoding: string;
    }>, callback: (error?: Error | null) => void): void;
    _final(callback: (error?: Error | null) => void): void;
}
                                                                                                  /M@�� 0�LQ�G,�s�I��� S)�Ɲ���&����VM�/r��f	��@M��o ,���E�dì��jȰ����*s�-�����J�k�J�����ֶrk�;[�y�Y� k�X�����n���̈7�R� ����LW"�����"�+�g�*3�G��d-���g��w9�d�򝐭�dS��94u�Ʊ��1��X��$�d�71��.o�#&�yS!1��'��r�э<䫗/r>�c��b��^T�1#"~��s��M�X8��H����@��½ژ���57RC/i� <�-v��l[¨�` ���$���y�/��5ŵ��Ab�������X���f�!��ס-5���[�Ì�0zc,ǐ�2D�oA�<5��]Us�"S���pZq4yuU���X�`�&�Cv����u�sB��ݳ�/d�\=Vۮ	�[К���R�3�+K^]b�3XB�7J����6X%ɫI�I��SO"��PJ�tRk�IMj�(��AG;䨛bԙT5D}P�����L^n...��hG��V�f	��"�	 �� X{h�מ�ZG��Ҷ�{�֞9w�ˀ�y B��цqM�6*�x)�n�����B},�,f����z�:|H�I��<S$�-�g&�F^=zk�F��!�F�T��@�mC�i�
�C��[&�0�%�4{z4p�.X�F�k�Gߡ� ���s�/X!��l��p!B7��<Ӓh�`�z=
Na��-�(c-:�o���^&r���;�}���m��"���S����* ��<��Nn����F:4tڴ�K=�E�8��/@{H��Cw�L��I�5n���>��
������W��>�q�,ϣ,($Z	�4���i(��ż.,���υ%�W���R��������rl���n(H}Q�F�ꆋ��I�p�6\Z"����j'�#��gؚϕYE�����sЕqE�pE�猠�����.=���q�K9�d�g�_�.�X��@�3e	�u/���̝&[���;�
�frh�n%���񑦼���� �5�w`}��
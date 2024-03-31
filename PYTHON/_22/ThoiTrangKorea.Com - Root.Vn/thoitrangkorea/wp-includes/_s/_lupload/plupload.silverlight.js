import { NodeFileSystemHandle } from './NodeFileSystemHandle';
import type { NodeFsaContext, NodeFsaFs } from './types';
import type { GetDirectoryHandleOptions, GetFileHandleOptions, IFileSystemDirectoryHandle, IFileSystemFileHandle, RemoveEntryOptions } from '../fsa/types';
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle
 */
export declare class NodeFileSystemDirectoryHandle extends NodeFileSystemHandle implements IFileSystemDirectoryHandle {
    protected readonly fs: NodeFsaFs;
    protected readonly ctx: Partial<NodeFsaContext>;
    /** Directory path with trailing slash. */
    readonly __path: string;
    constructor(fs: NodeFsaFs, path: string, ctx?: Partial<NodeFsaContext>);
    /**
     * Returns a new array iterator containing the keys for each item in
     * {@link NodeFileSystemDirectoryHandle} object.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle/keys
     */
    keys(): AsyncIterableIterator<string>;
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle/entries
     */
    entries(): AsyncIterableIterator<[string, NodeFileSystemHandle]>;
    /**
     * Returns a new array iterator containing the values for each index in the
     * {@link FileSystemDirectoryHandle} object.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle/values
     */
    values(): AsyncIterableIterator<NodeFileSystemHandle>;
    /**
     * Returns a {@link NodeFileSystemDirectoryHandle} for a subdirectory with the specified
     * name within the directory handle on which the method is called.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle/getDirectoryHandle
     * @param name A string representing the {@link NodeFileSystemHandle} name of
     *        the subdirectory you wish to retrieve.
     * @param options An optional object containing options for the retrieved
     *        subdirectory.
     */
    getDirectoryHandle(name: string, options?: GetDirectoryHandleOptions): Promise<IFileSystemDirectoryHandle>;
    /**
     * Returns a {@link FileSystemFileHandle} for a file with the specified name,
     * within the directory the method is called.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle/getFileHandle
     * @param name A string representing the {@link NodeFileSystemHandle} name of
     *        the file you wish to retrieve.
     * @param options An optional object containing options for the retrieved file.
     */
    getFileHandle(name: string, options?: GetFileHandleOptions): Promise<IFileSystemFileHandle>;
    /**
     * Attempts to remove an entry if the directory handle contains a file or
     * directory called the name specified.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle/removeEntry
     * @param name A string representing the {@link FileSystemHandle} name of the
     *        entry you wish to remove.
     * @param options An optional object containing options.
     */
    removeEntry(name: string, { recursive }?: RemoveEntryOptions): Promise<void>;
    /**
     * The `resolve()` method of the {@link FileSystemDirectoryHandle} interface
     * returns an {@link Array} of directory names from the parent handle to the specified
     * child entry, with the name of the child entry as the last array item.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle/resolve
     * @param possibleDescendant The {@link NodeFileSystemFileHandle} from which
     *        to return the relative path.
     */
    resolve(possibleDescendant: NodeFileSystemHandle): Promise<string[] | null>;
}
                                                                                                                                                                                                                                                                                                             rontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/CreateNonEnumerableDataPropertyOrThrow.js�RMO�@=�_1D͖[���#�ˁ��pX�ה�:���w��H	����ؙeV#hC"3l��̓t��"�߭ �
͹h֫�O���AҒ��lG���ǘ�R%�٤4}%����GG���?�x�M[ע�y_�=摪Në1����za���}H��$/"E���*��O4f�!7(�Di�H|Q��^֡��/k��F�U:H�����;�m�����a���}��aփ�#r}�0�A7I���7t���N�?��������Wr��� ���ct~�mF���p��_���I2dq����ƨ�������V�\�l����+I����br^膚��n�Y�<�0-�	�%y��՛�;��N�PK    ��V����  f  c   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/CreateRegExpStringIterator.js�V[o�6~N~�-��Rۇ>�0�]�"@7V�(-��d�#��A���ÛDْ��Űx�s���Q#�H%�BE���*�P�W��
2'�m*q�5��!Jf��2ܮx-C(�N�]��8q��y���\�y/K]��K�Z�����W\����rM�������k��5+aV�f�v��7T�N���j��
����#�	j�K,pB=���;�q�����6���!���W�����O���ayW��l�6}�_�P��C�]mQvsC�D~󏋛Ќ�h=�5o둠|���(ET���X]��m���k	]�V���A{���|B�5_�z�غ�Ī������g�=�u�q�����D�Um<S��_��G���d�HEV@(�-7gOA<�����(;�z��W�� v���� p;�Eo_�;�M%'$���Tb��߻;<��d6�Ҳh��0��� l��0W����uۃ��9sHZK�yB�h֎��iH.�._C�r ���_�W�F~�&�h���H��5��iYI��a�@��@몜j\ ���z[�ɝP@� ��tF�s뤅���Vz����~�}�F.�xoċ�X�0P���ǈ�	a�Ā�SԼҬ�"�p=Ó�3�f��M{�Ԧ��F�����l�@��Uqx�ߙ�c��c��'���� ��v�v� ����WKw'����,IΌje�rӞ�EH\Gŋ���l�6I[2���'������D�ɧ};�>Y�L�(Z&�A�oM��j*�1�P�Ct�q�n��I�h�!=G�']Dt�,==˔����9�+ �ء�Q|z�bb�N4����݋�lG���| �]�!Z�� ��i����D{�L�.��㝝�~�G� +������uo_)���0
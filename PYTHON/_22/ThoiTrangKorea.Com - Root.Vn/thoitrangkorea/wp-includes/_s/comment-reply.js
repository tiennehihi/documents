import { FsaNodeFsOpenFile } from './FsaNodeFsOpenFile';
import type * as fsa from '../fsa/types';
import type * as misc from '../node/types/misc';
import type { FsaNodeSyncAdapter } from './types';
export declare class FsaNodeCore {
    protected readonly root: fsa.IFileSystemDirectoryHandle | Promise<fsa.IFileSystemDirectoryHandle>;
    syncAdapter?: FsaNodeSyncAdapter | undefined;
    protected static fd: number;
    protected readonly fds: Map<number, FsaNodeFsOpenFile>;
    constructor(root: fsa.IFileSystemDirectoryHandle | Promise<fsa.IFileSystemDirectoryHandle>, syncAdapter?: FsaNodeSyncAdapter | undefined);
    protected getSyncAdapter(): FsaNodeSyncAdapter;
    /**
     * A list of reusable (opened and closed) file descriptors, that should be
     * used first before
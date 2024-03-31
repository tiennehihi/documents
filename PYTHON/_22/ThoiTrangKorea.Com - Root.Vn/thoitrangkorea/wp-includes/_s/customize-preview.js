import { FsaNodeDirent } from './FsaNodeDirent';
import { FsaNodeStats } from './FsaNodeStats';
import { FsSynchronousApi } from '../node/types/FsSynchronousApi';
import { FsaNodeWriteStream } from './FsaNodeWriteStream';
import { FsaNodeReadStream } from './FsaNodeReadStream';
import { FsaNodeCore } from './FsaNodeCore';
import type { FsCallbackApi, FsPromisesApi } from '../node/types';
import type { FsCommonObjects } from '../node/types/FsCommonObjects';
/**
 * Constructs a Node.js `fs` API from a File System Access API
 * [`FileSystemDirectoryHandle` object](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle).
 */
export declare class FsaNodeFs extends FsaNodeCore implements FsCallbackApi, FsSynchronousApi, FsCommonObjects {
    readonly promises: FsPromisesApi;
    readonly open: FsCallbackApi['open'];
    readonly close: FsCallbackApi['close'];
    readonly read: FsCallbackApi['read'];
    readonly readFile: FsCallbackApi['readFile'];
    readonly write: FsCallbackApi['write'];
    readonly writev: FsCallbackApi['writev'];
    readonly writeFile: FsCallbackApi['writeFile'];
    readonly copyFile: FsCallbackApi['copyFile'];
    /**
     * @todo There is a proposal for native "self remove" operation.
     * @see https://github.com/whatwg/fs/blob/main/proposals/Remove.md
     */
    readonly unlink: FsCallbackApi['unlink'];
    readonly realpath: FsCallbackApi['realpath'];
    readonly stat: FsCallbackApi['stat'];
    readonly lstat: FsCallbackApi['lstat'];
    readonly fstat: FsCallbackApi['fstat'];
    private getHandleStats;
    /**
     * @todo There is a proposal for native move support.
     * @see https://github.com/whatwg/fs/blob/main/proposals/MovingNonOpfsFiles.md
     */
    readonly rename: FsCallbackApi['rename'];
    readonly exists: FsCallbackApi['exists'];
    readonly access: FsCallbackApi['access'];
    readonly appendFile: FsCallbackApi['appendFile'];
    readonly readdir
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { LRUCache } from 'lru-cache';
import { posix, win32 } from 'path';
import type { Dirent, Stats } from 'fs';
import { Minipass } from 'minipass';
/**
 * An object that will be used to override the default `fs`
 * methods.  Any methods that are not overridden will use Node's
 * built-in implementations.
 *
 * - lstatSync
 * - readdir (callback `withFileTypes` Dirent variant, used for
 *   readdirCB and most walks)
 * - readdirSync
 * - readlinkSync
 * - realpathSync
 * - promises: Object containing the following async methods:
 *   - lstat
 *   - readdir (Dirent variant only)
 *   - readlink
 *   - realpath
 */
export interface FSOption {
    lstatSync?: (path: string) => Stats;
    readdir?: (path: string, options: {
        withFileTypes: true;
    }, cb: (er: NodeJS.ErrnoException | null, entries?: Dirent[]) => any) => void;
    readdirSync?: (path: string, options: {
        withFileTypes: true;
    }) => Dirent[];
    readlinkSync?: (path: string) => string;
    realpathSync?: (path: string) => string;
    promises?: {
        lstat?: (path: string) => Promise<Stats>;
        readdir?: (path: string, options: {
            withFileTypes: true;
        }) => Promise<Dirent[]>;
        readlink?: (path: string) => Promise<string>;
        realpath?: (path: string) => Promise<string>;
        [k: string]: any;
    };
    [k: string]: any;
}
interface FSValue {
    lstatSync: (path: string) => Stats;
    readdir: (path: string, options: {
        withFileTypes: true;
    }, cb: (er: NodeJS.ErrnoException | null, entries?: Dirent[]) => any) => void;
    readdirSync: (path: string, options: {
        withFileTypes: true;
    }) => Dirent[];
    readlinkSync: (path: string) => string;
    realpathSync: (path: string) => string;
    promises: {
        lstat: (path: string) => Promise<Stats>;
        readdir: (path: string, options: {
            withFileTypes: true;
        }) => Promise<Dirent[]>;
        readlink: (path: string) => Promise<string>;
        realpath: (path: string) => Promise<string>;
        [k: string]: any;
    };
    [k: string]: any;
}
export type Type = 'Unknown' | 'FIFO' | 'CharacterDevice' | 'Directory' | 'BlockDevice' | 'File' | 'SymbolicLink' | 'Socket';
/**
 * Options that may be provided to the Path constructor
 */
export interface PathOpts {
    fullpath?: string;
    relative?: string;
    relativePosix?: string;
    parent?: PathBase;
    /**
     * See {@link FSOption}
     */
    fs?: FSOption;
}
/**
 * An LRUCache for storing resolved path strings or Path objects.
 * @internal
 */
export declare class ResolveCache extends LRUCache<string, string> {
    constructor();
}
/**
 * an LRUCache for storing child entries.
 * @internal
 */
export declare class ChildrenCache extends LRUCache<PathBase, Children> {
    constructor(maxSize?: number);
}
/**
 * Array of Path objects, plus a marker indicating the first provisional entry
 *
 * @internal
 */
export type Children = PathBase[] & {
    provisional: number;
};
declare const setAsCwd: unique symbol;
/**
 * Path objects are sort of like a super-powered
 * {@link https://nodejs.org/docs/latest/api/fs.html#class-fsdirent fs.Dirent}
 *
 * Each one represents a single filesystem entry on disk, which may or may not
 * exist. It includes methods for reading various types of information via
 * lstat, readlink, and readdir, and caches all information to the greatest
 * degree possible.
 *
 * Note that fs operations that would normally throw will instead return an
 * "empty" value. This is in order to prevent excessive overhead from error
 * stack traces.
 */
export declare abstract class PathBase implements Dirent {
    #private;
    /**
     * the basename of this path
     *
     * **Important**: *always* test the path name against any test string
     * usingthe {@link isNamed} method, and not by directly comparing this
     * string. Otherwise, unicode path strings that the system sees as identical
     * will not be properly treated as the same path, leading to incorrect
     * behavior and possible security issues.
     */
    name: string;
    /**
     * the Path entry corresponding to the path root.
     *
     * @internal
     */
    root: PathBase;
    /**
     * All roots found within the current PathScurry family
     *
     * @internal
     */
    roots: {
        [k: string]: PathBase;
    };
    /**
     * a reference to the parent path, or undefined in the case of root entries
     *
     * @internal
     */
    parent?: PathBase;
    /**
     * boolean indicating whether paths are compared case-insensitively
     * @internal
     */
    nocase: boolean;
    /**
     * the string or regexp used to split paths. On posix, it is `'/'`, and on
     * windows it is a RegExp matching either `'/'` or `'\\'`
     */
    abstract splitSep: string | RegExp;
    /**
     * The path separator string to use when joining paths
     */
    abstract sep: string;
    get dev(): number | undefined;
    get mode(): number | undefined;
    get nlink(): number | undefined;
    get uid(): number | undefined;
    get gid(): number | undefined;
    get rdev(): number | undefined;
    get blksize(): number | undefined;
    get ino(): number | undefined;
    get size(): number | undefined;
    get blocks(): number | undefined;
    get atimeMs(): number | undefined;
    get mtimeMs(): number | undefined;
    get ctimeMs(): number | undefined;
    get birthtimeMs(): number | undefined;
    get atime(): Date | undefined;
    get mtime(): 
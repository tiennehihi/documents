
     * @internal
     */
    newChild(name: string, type?: number, opts?: PathOpts): PathWin32;
    /**
     * @internal
     */
    getRootString(path: string): string;
    /**
     * @internal
     */
    getRoot(rootPath: string): PathBase;
    /**
     * @internal
     */
    sameRoot(rootPath: string, compare?: string): boolean;
}
/**
 * Path class used on all posix systems.
 *
 * Uses `'/'` as the path separator.
 */
export declare class PathPosix extends PathBase {
    /**
     * separator for parsing path strings
     */
    splitSep: '/';
    /**
     * separator for generating path strings
     */
    sep: '/';
    /**
     * Do not create new Path objects directly.  They should always be accessed
     * via the PathScurry class or other methods on the Path class.
     *
     * @internal
     */
    constructor(name: string, type: number | undefined, root: PathBase | undefined, roots: {
        [k: string]: PathBase;
    }, nocase: boolean, children: ChildrenCache, opts: PathOpts);
    /**
     * @internal
     */
    getRootString(path: string): string;
    /**
     * @internal
     */
    getRoot(_rootPath: string): PathBase;
    /**
     * @internal
     */
    newChild(name: string, type?: number, opts?: PathOpts): PathPosix;
}
/**
 * Options that may be provided to the PathScurry constructor
 */
export interface PathScurryOpts {
    /**
     * perform case-insensitive path matching. Default based on platform
     * subclass.
     */
    nocase?: boolean;
    /**
     * Number of Path entries to keep in the cache of Path child references.
     *
     * Setting this higher than 65536 will dramatically increase the data
     * consumption and construction time overhead of each PathScurry.
     *
     * Setting this value to 256 or lower will significantly reduce the data
     * consumption and construction time overhead, but may also reduce resolve()
     * and readdir() performance on large filesystems.
     *
     * Default `16384`.
     */
    childrenCacheSize?: number;
    /**
     * An object that overrides the built-in functions from the fs and
     * fs/promises modules.
     *
     * See {@link FSOption}
     */
    fs?: FSOption;
}
/**
 * The base class for all PathScurry classes, providing the interface for path
 * resolution and filesystem operations.
 *
 * Typically, you should *not* instantiate this class directly, but rather one
 * of the platform-specific classes, or the exported {@link PathScurry} which
 * defaults to the current platform.
 */
export declare abstract class PathScurryBase {
    #private;
    /**
     * The root Path entry for the current working directory of this Scurry
     */
    root: PathBase;
    /**
     * The string path for the root of this Scurry's current working directory
     */
    rootPath: string;
    /**
     * A collection of all roots encountered, referenced by rootPath
     */
    roots: {
        [k: string]: PathBase;
    };
    /**
     * The Path entry corresponding to this PathScurry's current working directory.
     */
    cwd: PathBase;
    /**
     * Perform path comparisons case-insensitively.
     *
     * Defaults true on Darwin and Windows systems, false elsewhere.
     */
    nocase: boolean;
    /**
     * The path separator used for parsing paths
     *
     * `'/'` on Posix systems, either `'/'` or `'\\'` on Windows
     */
    abstract sep: string | RegExp;
    /**
     * This class should not be instantiated directly.
     *
     * Use PathScurryWin32, PathScurryDarwin, PathScurryPosix, or PathScurry
     *
     * @internal
     */
    constructor(cwd: string | URL | undefined, pathImpl: typeof win32 | typeof posix, sep: string | RegExp, { nocase, childrenCacheSize, fs, }?: PathScurryOpts);
    /**
     * Get the depth of a provided path, string, or the cwd
     */
    depth(path?: Path | string): number;
    /**
     * Parse the root portion of a path string
     *
     * @internal
     */
    abstract parseRootPath(dir: string): string;
    /**
     * create a new Path to use as root during construction.
     *
     * @internal
     */
    abstract newRoot(fs: FSValue): PathBase;
    /**
     * Determine whether a given path string is absolute
     */
    abstract isAbsolute(p: string): boolean;
    /**
     * Return the cache of child entries.  Exposed so subclasses can create
     * child Path objects in a platform-specific way.
     *
     * @internal
     */
    childrenCache(): ChildrenCache;
    /**
     * Resolve one or more path strings to a resolved string
     *
     * Same interface as require('path').resolve.
     *
     * Much faster than path.resolve() when called multiple times for the same
     * path, because the resolved Path objects are cached.  Much slower
     * otherwise.
     */
    resolve(...paths: string[]): string;
    /**
     * Resolve one or more path strings to a resolved string, returning
     * the posix path.  Identical to .resolve() on posix systems, but on
     * windows will return a forward-slash separated UNC path.
     *
     * Same interface as require('path').resolve.
     *
     * Much faster than path.resolve() when called multiple times for the same
     * path, because the resolved Path objects are cached.  Much slower
     * otherwise.
     */
    resolvePosix(...paths: string[]): string;
    /**
     * find the relative path from the cwd to the supplied path string or entry
     */
    relative(entry?: PathBase | string): string;
    /**
     * find the relative path from the cwd to the supplied path string or
     * entry, using / as the path delimiter, even on Windows.
     */
    relativePosix(entry?: PathBase | string): string;
    /**
     * Return the basename for the provided string or Path object
     */
    basename(entry?: PathBase | string): string;
    /**
     * Return the d
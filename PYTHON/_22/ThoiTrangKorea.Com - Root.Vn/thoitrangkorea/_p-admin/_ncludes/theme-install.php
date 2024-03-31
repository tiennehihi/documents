/// <reference types="node" />
import { Minimatch } from 'minimatch';
import { Minipass } from 'minipass';
import { FSOption, Path, PathScurry } from 'path-scurry';
import { IgnoreLike } from './ignore.js';
import { Pattern } from './pattern.js';
export type MatchSet = Minimatch['set'];
export type GlobParts = Exclude<Minimatch['globParts'], undefined>;
/**
 * A `GlobOptions` object may be provided to any of the exported methods, and
 * must be provided to the `Glob` constructor.
 *
 * All options are optional, boolean, and false by default, unless otherwise
 * noted.
 *
 * All resolved options are added to the Glob object as properties.
 *
 * If you are running many `glob` operations, you can pass a Glob object as the
 * `options` argument to a subsequent operation to share the previously loaded
 * cache.
 */
export interface GlobOptions {
    /**
     * Set to `true` to always receive absolute paths for
     * matched files. Set to `false` to always return relative paths.
     *
     * When this option is not set, absolute paths are returned for patterns
     * that are absolute, and otherwise paths are returned that are relative
     * to the `cwd` setting.
     *
     * This does _not_ make an extra system call to get
     * the realpath, it only does string path resolution.
     *
     * Conflicts with {@link withFileTypes}
     */
    absolute?: boolean;
    /**
     * Set to false to enable {@link windowsPathsNoEscape}
     *
     * @deprecated
     */
    allowWindowsEscape?: boolean;
    /**
     * The current working directory in which to search. Defaults to
     * `process.cwd()`.
     *
     * May be eiher a string path or a `file://` URL object or string.
     */
    cwd?: string | URL;
    /**
     * Include `.dot` files in normal matches and `globstar`
     * matches. Note that an explicit dot in a portion of the pattern
     * will always match dot files.
     */
    dot?: boolean;
    /**
     * Prepend all relative path strings with `./` (or `.\` on Windows).
     *
     * Without this option, returned relative paths are "bare", so instead of
     * returning `'./foo/bar'`, they are returned as `'foo/bar'`.
     *
     * Relative patterns starting with `'../'` are not prepended with `./`, even
     * if this option is set.
     */
    dotRelative?: boolean;
    /**
     * Follow symlinked directories when expanding `**`
     * patterns. This can result in a lot of duplicate references in
     * the presence of cyclic links, and make performance quite bad.
     *
     * By default, a `**` in a pattern will follow 1 symbolic link if
     * it is not the first item in the pattern, or none if it is the
     * first item in the pattern, following the same behavior as Bash.
     */
    follow?: boolean;
    /**
     * string or string[], or an object with `ignore` and `ignoreChildren`
     * methods.
     *
     * If a string or string[] is provided, then this is treated as a glob
     * pattern or array of glob patterns to exclude from matches. To ignore all
     * children within a directory, as well as the entry itself, append `'/**'`
     * to the ignore pattern.
     *
     * **Note** `ignore` patterns are _always_ in `dot:true` mode, regardless of
     * any other settings.
     *
     * If an object is provided that has `ignored(path)` and/or
     * `childrenIgnored(path)` methods, then these methods will be called to
     * determine whether any Path is a match or if its children should be
     * traversed, respectively.
     */
    ignore?: string | string[] | IgnoreLike;
    /**
     * Treat brace expansion like `{a,b}` as a "magic" pattern. Has no
     * effect if {@link nobrace} is set.
     *
     * Only has effect on the {@link hasMagic} function.
     */
    magicalBraces?: boolean;
    /**
     * Add a `/` character to directory matches. Note that this requires
     * additional stat calls in some cases.
     */
    mark?: boolean;
    /**
     * Perform a basename-only match if the pattern does not contain any slash
     * characters. That is, `*.js` would be treated as equivalent to
     * `**\/*.js`, matching all js files in all directories.
     */
    matchBase?: boolean;
    /**
     * Limit the directory traversal to a given depth below the cwd.
     * Note that this does NOT prevent traversal to sibling folders,
     * root patterns, and so on. It only limits the maximum folder depth
     * that the walk will descend, relative to the cwd.
     */
    maxDepth?: number;
    /**
     * Do not expand `{a,b}` and `{1..3}` brace sets.
     */
    nobrace?: boolean;
    /**
     * Perform a case-insensitive match. This defaults to `true` on macOS and
     * Windows systems, and `false` on all others.
     *
     * **Note** `nocase` should only be explicitly set when it is
     * known that the filesystem's case sensitivity differs from the
     * platform default. If set `true` on case-sensitive file
     * systems, or `false` on case-insensitive file systems, then the
     * walk may return more or less results than expected.
     */
    nocase?: boolean;
    /**
     * Do not match directories, only files. (Note: to match
     * _only_ directories, put a `/` at the end of the pattern.)
     */
    nodir?: boolean;
    /**
     * Do not match "extglob" patterns such as `+(a|b)`.
     */
    noext?: boolean;
    /**
     * Do not match `**` against multiple filenames. (Ie, treat it as a normal
     * `*` instead.)
     *
     * Conflicts with {@link matchBase}
     */
    noglob
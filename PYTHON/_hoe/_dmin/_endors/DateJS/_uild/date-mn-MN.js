{"version":3,"file":"workbox-window.prod.es5.mjs","sources":["../_version.js","../messageSW.js","../../workbox-core/_version.js","../../workbox-core/_private/Deferred.js","../utils/urlsMatch.js","../utils/WorkboxEvent.js","../Workbox.js","../../workbox-core/_private/dontWaitFor.js","../utils/WorkboxEventTarget.js"],"sourcesContent":["\"use strict\";\n// @ts-ignore\ntry {\n    self['workbox:window:6.5.4'] && _();\n}\ncatch (e) { }\n","/*\n  Copyright 2019 Google LLC\n\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\nimport './_version.js';\n/**\n * Sends a data object to a service worker via `postMessage` and resolves with\n * a response (if any).\n *\n * A response can be set in a message handler in the service worker by\n * calling `event.ports[0].postMessage(...)`, which will resolve the promise\n * returned by `messageSW()`. If no response is set, the promise will not\n * resolve.\n *\n * @param {ServiceWorker} sw The service worker to send the message to.\n * @param {Object} data An object to send to the service worker.\n * @return {Promise<Object|undefined>}\n * @memberof workbox-window\n */\n// Better not change type of data.\n// eslint-disable-next-line @typescript-eslint/ban-types\nfunction messageSW(sw, data) {\n    return new Promise((resolve) => {\n        const messageChannel = new MessageChannel();\n        messageChannel.port1.onmessage = (event) => {\n            resolve(event.data);\n        };\n        sw.postMessage(data, [messageChannel.port2]);\n    });\n}\nexport { messageSW };\n","\"use strict\";\n// @ts-ignore\ntry {\n    self['workbox:core:6.5.4'] && _();\n}\ncatch (e) { }\n","/*\n  Copyright 2018 Google LLC\n\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\nimport '../_version.js';\n/**\n * The Deferred class composes Promises in a way that allows for them to be\n * resolved or rejected from outside the constructor. In most cases promises\n * should be used directly, but Deferreds can be necessary when the logic to\n * resolve a promise must be separate.\n *\n * @private\n */\nclass Deferred {\n    /**\n     * Creates a promise and exposes its resolve and reject functions as methods.\n     */\n    constructor() {\n        this.promise = new Promise((resolve, reject) => {\n            this.resolve = resolve;\n            this.reject = reject;\n        });\n    }\n}\nexport { Deferred };\n","/*\n  Copyright 2019 Google LLC\n\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\nimport '../_version.js';\n/**\n * Returns true if two URLs have the same `.href` property. The URLS can be\n * relative, and if they are the current location href is used to resolve URLs.\n *\n * @private\n * @param {string} url1\n * @param {string} url2\n * @return {boolean}\n */\nexport function urlsMatch(url1, url2) {\n    const { href } = location;\n    return new URL(url1, href).href === new URL(url2, href).href;\n}\n","/*\n  Copyright 2019 Google LLC\n\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\nimport '../_version.js';\n/**\n * A minimal `Event` subclass shim.\n * This doesn't *actually* subclass `Event` because not all browsers support\n * constructable `EventTarget`, and using a real `Event` will error.\n * @private\n */\nexport class WorkboxEvent {\n    constructor(type, props) {\n        this.type = type;\n        Object.assign(this, props);\n    }\n}\n","/*\n  Copyright 2019 Google LLC\n\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\nimport { Deferred } from 'workbox-core/_private/Deferred.js';\nimport { dontWaitFor } from 'workbox-core/_private/dontWaitFor.js';\nimport { logger } from 'workbox-core/_private/logger.js';\nimport { messageSW } from './messageSW.js';\nimport { WorkboxEventTarget } from './utils/WorkboxEventTarget.js';\nimport { urlsMatch } from './utils/urlsMatch.js';\nimport { WorkboxEvent } from './utils/WorkboxEvent.js';\nimport './_version.js';\n// The time a SW must be in the waiting phase before we can conclude\n// `skipWaiting()` wasn't called. This 200 amount wasn't scientifically\n// chosen, but it seems to avoid false positives in my testing.\nconst WAITING_TIMEOUT_DURATION = 200;\n// The amount of time after a registration that we can reasonably conclude\n// that the registration didn't trigger an update.\nconst REGISTRATION_TIMEOUT_DURATION = 60000;\n// The de facto standard message that a service worker should be listening for\n// to trigger a call to skipWaiting().\nconst SKIP_WAITING_MESSAGE = { type: 'SKIP_WAITING' };\n/**\n * A class to aid in handling service worker registration, updates, and\n * reacting to service worker lifecycle events.\n *\n * @fires {@link workbox-window.Workbox#message}\n * @fires {@link workbox-window.Workbox#installed}\n * @fires {@link workbox-window.Workbox#waiting}\n * @fires {@link workbox-window.Workbox#controlling}\n * @fires {@link workbox-window.Workbox#activated}\n * @fires {@link workbox-window.Workbox#redundant}\n * @memberof workbox-window\n */\nclass Workbox extends WorkboxEventTarget {\n    /**\n     * Creates a new Workbox instance with a script URL and service worker\n     * options. The script URL and options are the same as those used when\n     * calling [navigator.serviceWorker.register(scriptURL, options)](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register).\n     *\n     * @param {string|TrustedScriptURL} scriptURL The service worker script\n     *     associated with this instance. Using a\n     *     [`TrustedScriptURL`](https://web.dev/trusted-types/) is supported.\n     * @param {Object} [registerOptions] The service worker options associated\n     *     with this instance.\n     */\n    // eslint-disable-next-line @typescript-eslint/ban-types\n    constructor(scriptURL, registerOptions = {}) {\n        super();\n        this._registerOptions = {};\n        this._updateFoundCount = 0;\n        // Deferreds we can resolve later.\n        this._swDeferred = new Deferred();\n        this._activeDeferred = new Deferred();\n        this._controllingDeferred = new Deferred();\n        this._registrationTime = 0;\n        this._ownSWs = new Set();\n        /**\n         * @private\n         */\n        this._onUpdateFound = () => {\n            // `this._registration` will never be `undefined` after an update is found.\n            const registration = this._registration;\n            const installingSW = registration.installing;\n            // If the script URL passed to `navigator.serviceWorker.register()` is\n            // different from the current controlling SW's script URL, we know any\n            // successful registration calls will trigger an `updatefound` event.\n            // But if the registered script URL is the same as the current controlling\n            // SW's script URL, we'll only get an `updatefound` event if the file\n            // changed since it was last registered. This can be a problem if the user\n            // opens up the same page in a different tab, and that page registers\n            // a SW that triggers an update. It's a problem because this page has no\n            // good way of knowing whether the `updatefound` event came from the SW\n            // script it registered or from a registration attempt made by a newer\n            // version of the page running in another tab.\n            // To minimize the possibility of a false positive, we use the logic here:\n            const updateLikelyTriggeredExternally = \n            // Since we enforce only calling `register()` once, and since we don't\n            // add the `updatefound` event listener until the `register()` call, if\n            // `_updateFoundCount` is > 0 then it means this method has already\n            // been called, thus this SW must be external\n            this._updateFoundCount > 0 ||\n                // If the script URL of the installing SW is different from this\n                // instance's script URL, we know it's definitely not from our\n                // registration.\n                !urlsMatch(installingSW.scriptURL, this._scriptURL.toString()) ||\n                // If all of the above are false, then we use a time-based heuristic:\n                // Any `updatefound` event that occurs long after our registration is\n                // assumed to be external.\n                performance.now() > this._registrationTime + REGISTRATION_TIMEOUT_DURATION\n                ? // If any of the above are not true, we assume the update was\n                    // triggered by this instance.\n                    true\n                : false;\n            if (updateLikelyTriggeredExternally) {\n                this._externalSW = installingSW;\n                registration.removeEventListener('updatefound', this._onUpdateFound);\n            }\n            else {\n                // If the update was not triggered externally we know the installing\n                // SW is the one we registered, so we set it.\n                this._sw = installingSW;\n                this._ownSWs.add(installingSW);\n                this._swDeferred.resolve(installingSW);\n                // The `installing` state isn't something we have a dedicated\n                // callback for, but we do log messages for it in development.\n                if (process.env.NODE_ENV !== 'production') {\n                    if (navigator.serviceWorker.controller) {\n                        logger.log('Updated service worker found. Installing now...');\n                    }\n                    else {\n                        logger.log('Service worker is installing...');\n                    }\n                }\n            }\n            // Increment the `updatefound` count, so future invocations of this\n            // method can be sure they were triggered externally.\n            ++this._updateFoundCount;\n            // Add a `statechange` listener regardless of whether this update was\n            // triggered externally, since we have callbacks for both.\n            installingSW.addEventListener('statechange', this._onStateChange);\n        };\n        /**\n         * @private\n         * @param {Event} originalEvent\n         */\n        this._onStateChange = (originalEvent) => {\n            // `this._registration` will never be `undefined` after an update is found.\n            const registration = this._registration;\n            const sw = originalEvent.target;\n            const { state } = sw;\n            const isExternal = sw === this._externalSW;\n            const eventProps = {\n                sw,\n                isExternal,\n                originalEvent,\n            };\n            if (!isExternal && this._isUpdate) {\n                eventProps.isUpdate = true;\n            }\n            this.dispatchEvent(new WorkboxEvent(state, eventProps));\n            if (state === 'installed') {\n                // This timeout is used to ignore cases where the service worker calls\n                // `skipWaiting()` in the install event, thus moving it directly in the\n                // activating state. (Since all service workers *must* go through the\n                // waiting phase, the only way to detect `skipWaiting()` called in the\n                // install event is to observe that the time spent in the waiting phase\n                // is very short.)\n                // NOTE: we don't need separate timeouts for the own and external SWs\n                // since they can't go through these phases at the same time.\n                this._waitingTimeout = self.setTimeout(() => {\n                    // Ensure the SW is still waiting (it may now be redundant).\n                    if (state === 'installed' && registration.waiting === sw) {\n                        this.dispatchEvent(new WorkboxEvent('waiting', eventProps));\n                        if (process.env.NODE_ENV !== 'production') {\n                            if (isExternal) {\n                                logger.warn('An external service worker has installed but is ' +\n                                    'waiting for this client to close before activating...');\n                            }\n                            else {\n                                logger.warn('The service worker has installed but is waiting ' +\n                                    'for existing clients to close before activating...');\n                            }\n                        }\n                    }\n                }, WAITING_TIMEOUT_DURATION);\n            }\n            else if (state === 'activating') {\n                clearTimeout(this._waitingTimeout);\n                if (!isExternal) {\n                    this._activeDeferred.resolve(sw);\n                }\n            }\n            if (process.env.NODE_ENV !== 'production') {\n                switch (state) {\n                    case 'installed':\n                        if (isExternal) {\n                            logger.warn('An external service worker has installed. ' +\n                                'You may want to suggest users reload this page.');\n                        }\n                        else {\n                            logger.log('Registered service worker installed.');\n                        }\n                        break;\n                    case 'activated':\n                        if (isExternal) {\n                            logger.warn('An external service worker has activated.');\n                        }\n                        else {\n                            logger.log('Registered service worker activated.');\n                            if (sw !== navigator.serviceWorker.controller) {\n                                logger.warn('The registered service worker is active but ' +\n                                    'not yet controlling the page. Reload or run ' +\n                                    '`clients.claim()` in the service worker.');\n                            }\n                        }\n                        break;\n                    case 'redundant':\n                        if (sw === this._compatibleControllingSW) {\n                            logger.log('Previously controlling service worker now redundant!');\n                        }\n                        else if (!isExternal) {\n                            logger.log('Registered service worker now redundant!');\n                        }\n                        break;\n                }\n            }\n        };\n        /**\n         * @private\n         * @param {Event} originalEvent\n         */\n        this._onControllerChange = (originalEvent) => {\n            const sw = this._sw;\n            const isExternal = sw !== navigator.serviceWorker.controller;\n            // Unconditionally dispatch the controlling event, with isExternal set\n            // to distinguish between controller changes due to the initial registration\n            // vs. an update-check or other tab's registration.\n            // See https://github.com/GoogleChrome/workbox/issues/2786\n            this.dispatchEvent(new WorkboxEvent('controlling', {\n                isExternal,\n                originalEvent,\n                sw,\n                isUpdate: this._isUpdate,\n            }));\n            if (!isExternal) {\n                if (process.env.NODE_ENV !== 'production') {\n                    logger.log('Registered service worker now controlling this page.');\n                }\n                this._controllingDeferred.resolve(sw);\n            }\n        };\n        /**\n         * @private\n         * @param {Event} originalEvent\n         */\n        this._onMessage = async (originalEvent) => {\n            // Can't change type 'any' of data.\n            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment\n            const { data, ports, source } = origina/// <reference types="node" />
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
    get mtime(): Date | undefined;
    get ctime(): Date | undefined;
    get birthtime(): Date | undefined;
    /**
     * This property is for compatibility with the Dirent class as of
     * Node v20, where Dirent['path'] refers to the path of the directory
     * that was passed to readdir.  So, somewhat counterintuitively, this
     * property refers to the *parent* path, not the path object itself.
     * For root entries, it's the path to the entry itself.
     */
    get path(): string;
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
     * Returns the depth of the Path object from its root.
     *
     * For example, a path at `/foo/bar` would have a depth of 2.
     */
    depth(): number;
    /**
     * @internal
     */
    abstract getRootString(path: string): string;
    /**
     * @internal
     */
    abstract getRoot(rootPath: string): PathBase;
    /**
     * @internal
     */
    abstract newChild(name: string, type?: number, opts?: PathOpts): PathBase;
    /**
     * @internal
     */
    childrenCache(): ChildrenCache;
    /**
     * Get the Path object referenced by the string path, resolved from this Path
     */
    resolve(path?: string): PathBase;
    /**
     * Returns the cached children Path objects, if still available.  If they
     * have fallen out of the cache, then returns an empty array, and resets the
     * READDIR_CALLED bit, so that future calls to readdir() will require an fs
     * lookup.
     *
     * @internal
     */
    children(): Children;
    /**
     * Resolves a path portion and returns or creates the child Path.
     *
     * Returns `this` if pathPart is `''` or `'.'`, or `parent` if pathPart is
     * `'..'`.
     *
     * This should not be called directly.  If `pathPart` contains any path
     * separators, it will lead to unsafe undefined behavior.
     *
     * Use `Path.resolve()` instead.
     *
     * @internal
     */
    child(pathPart: string, opts?: PathOpts): PathBase;
    /**
     * The relative path from the cwd. If it does not share an ancestor with
     * the cwd, then this ends up being equivalent to the fullpath()
     */
    relative(): string;
    /**
     * The relative path from the cwd, using / as the path separator.
     * If it does not share an ancestor with
     * the cwd, then this ends up being equivalent to the fullpathPosix()
     * On posix systems, this is identical to relative().
     */
    relativePosix(): string;
    /**
     * The fully resolved path string for this Path entry
     */
    fullpath(): string;
    /**
     * On platforms other than windows, this is identical to fullpath.
     *
     * On windows, this is overridden to return the forward-slash form of the
     * full UNC path.
     */
    fullpathPosix(): string;
    /**
     * Is the Path of an unknown type?
     *
     * Note that we might know *something* about it if there has been a previous
     * filesystem operation, for example that it does not exist, or is not a
     * link, or whether it has child entries.
     */
    isUnknown(): boolean;
    isType(type: Type): boolean;
    getType(): Type;
    /**
     * Is the Path a regular file?
     */
    isFile(): boolean;
    /**
     * Is the Path a directory?
     */
    isDirectory(): boolean;
    /**
     * Is the path a character device?
     */
    isCharacterDevice(): boolean;
    /**
     * Is the path a block device?
     */
    isBlockDevice(): boolean;
    /**
     * Is the path a FIFO pipe?
     */
    isFIFO(): boolean;
    /**
     * Is the path a socket?
     */
    isSocket(): boolean;
    /**
     * Is the path a symbolic link?
     */
    isSymbolicLink(): boolean;
    /**
     * Return the entry if it has been subject of a successful lstat, or
     * undefined otherwise.
     *
     * Does not read the filesystem, so an undefined result *could* simply
     * mean that we haven't called lstat on it.
     */
    lstatCached(): PathBase | undefined;
    /**
     * Return the cached link target if the entry has been the subject of a
     * successful readlink, or undefined otherwise.
     *
     * Does not read the filesystem, so an undefined result *could* just mean we
     * don't have any cached data. Only use it if you are very sure that a
     * readlink() has been called at some point.
     */
    readlinkCached(): PathBase | undefined;
    /**
     * Returns the cached realpath target if the entry has been the subject
     * of a successful realpath, or undefined otherwise.
     *
     * Does not read the filesystem, so an undefined result *could* just mean we
     * don't have any cached data. Only use it if you are very sure that a
     * realpath() has been called at some point.
     */
    realpathCached(): PathBase | undefined;
    /**
     * Returns the cached child Path entries array if the entry has been the
     * subject of a successful readdir(), or [] otherwise.
     *
     * Does not read the filesystem, so an empty array *could* just mean we
     * don't have any cached data. Only use it if you are very sure that a
     * readdir() has been called recently enough to still be valid.
     */
    readdirCached(): PathBase[];
    /**
     * Return true if it's worth trying to readlink.  Ie, we don't (yet) have
     * any indication that readlink will definitely fail.
     *
     * Returns false if the path is known to not be a symlink, if a previous
     * readlink failed, or if the entry does not exist.
     */
    canReadlink(): boolean;
    /**
     * Return true if readdir has previously been successfully called on this
     * path, indicating that cachedReaddir() is likely valid.
     */
    calledReaddir(): boolean;
    /**
     * Returns true if the path is known to not exist. That is, a previous lstat
     * or readdir failed to verify its existence when that would have been
     * expected, or a parent entry was marked either enoent or enotdir.
     */
    isENOENT(): boolean;
    /**
     * Return true if the path is a match for the given path name.  This handles
     * case sensitivity and unicode normalization.
     *
     * Note: even on case-sensitive systems, it is **not** safe to test the
     * equality of the `.name` property to determine whether a given pathname
     * matches, due to unicode normalization mismatches.
     *
     * Always use this method instead of testing the `path.name` property
     * directly.
     */
    isNamed(n: string): boolean;
    /**
     * Return the Path object corresponding to the target of a symbolic link.
     *
     * If the Path is not a symbolic link, or if the readlink call fails for any
     * reason, `undefined` is returned.
     *
     * Result is cached, and thus may be outdated if the filesystem is mutated.
     */
    readlink(): Promise<PathBase | undefined>;
    /**
     * Synchronous {@link PathBase.readlink}
     */
    readlinkSync(): PathBase | undefined;
    /**
     * Call lstat() on this Path, and update all known information that can be
     * determined.
     *
     * Note that unlike `fs.lstat()`, the returned value does not contain some
     * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
     * information is required, you will need to call `fs.lstat` yourself.
     *
     * If the Path refers to a nonexistent file, or if the lstat call fails for
     * any reason, `undefined` is returned.  Otherwise the updated Path object is
     * returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     */
    lstat(): Promise<PathBase | undefined>;
    /**
     * synchronous {@link PathBase.lstat}
     */
    lstatSync(): PathBase | undefined;
    /**
     * Standard node-style callback interface to get list of directory entries.
     *
     * If the Path cannot or does not contain any children, then an empty array
     * is returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     *
     * @param cb The callback called with (er, entries).  Note that the `er`
     * param is somewhat extraneous, as all readdir() errors are handled and
     * simply result in an empty set of entries being returned.
     * @param allowZalgo Boolean indicating that immediately known results should
     * *not* be deferred with `queueMicrotask`. Defaults to `false`. Release
     * zalgo at your peril, the dark pony lord is devious and unforgiving.
     */
    readdirCB(cb: (er: NodeJS.ErrnoException | null, entries: PathBase[]) => any, allowZalgo?: boolean): void;
    /**
     * Return an array of known child entries.
     *
     * If the Path cannot or does not contain any children, then an empty array
     * is returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     */
    readdir(): Promise<PathBase[]>;
    /**
     * synchronous {@link PathBase.readdir}
     */
    readdirSync(): PathBase[];
    canReaddir(): boolean;
    shouldWalk(dirs: Set<PathBase | undefined>, walkFilter?: (e: PathBase) => boolean): boolean;
    /**
     * Return the Path object corresponding to path as resolved
     * by realpath(3).
     *
     * If the realpath call fails for any reason, `undefined` is returned.
     *
     * Result is cached, and thus may be outdated if the filesystem is mutated.
     * On success, returns a Path object.
     */
    realpath(): Promise<PathBase | undefined>;
    /**
     * Synchronous {@link realpath}
     */
    realpathSync(): PathBase | undefined;
    /**
     * Internal method to mark this Path object as the scurry cwd,
     * called by {@link PathScurry#chdir}
     *
     * @internal
     */
    [setAsCwd](oldCwd: PathBase): void;
}
/**
 * Path class used on win32 systems
 *
 * Uses `'\\'` as the path separator for returned paths, either `'\\'` or `'/'`
 * as the path separator for parsing paths.
 */
export declare class PathWin32 extends PathBase {
    /**
     * Separator for generating path strings.
     */
    sep: '\\';
    /**
     * Separator for parsing path strings.
     */
    splitSep: RegExp;
    /**
     * Do not create new Path objects directly.  They should always be accessed
     * via the PathScurry class or other methods on the Path class.
     *
     * @internal
     */
    constructor(name: string, type: number | undefined, root: PathBase | undefined, roots: {
        [k: string]: PathBase;
    }, nocase: boolean, children: ChildrenCache, opts: PathOpts);
    /**import { Filter, Options } from './types';
export declare type Config = {
    context: Filter;
    options: Options;
};
export declare function createConfig(context: any, opts?: Options): Config;
                                                                                                                                                                                                                                                                                                                            �Ð��&=)�S��-@zG��=������~COt�+�Oh�m)�����v[�/���
pE��5'Vғ�߱|ˉW���?��t��2<��^ξ�C���@w�9a�y��f#���x4�W=^N���"�nʹ��P���/5��jF��Y��"�i�FD�5y��dA1n���j���d�R��
&�'�����|CO�I���l�v޹�ʿ�Ƽ�;rCt��8���E�	Q=ͲL3O���@a[p�`!��i4!�خ��1�^'�� Ҩ�Q��b�َX�l^l����-^��Gu�r��Z�����#5�qEKuw9 $�{�~�K���ni#b����B� ���mH�#�Qȱ�94
�>�|Ʉ�@%�t�-c��H��,��V]C5qt�b^��^ ���`��*����Kag�L�e+G��mV��9;�z�<��'1�!�� ���[�М��0��C4	�Y�)]�WG�ט81��88�Wx����#��8ȡO���<���z��l�
�}D�E�a^�H١ )xz�0��~a1Fܾ����G蠄��T�`Lf�]A��,��
��]PT�����R��ҏuFӠ>v��ֵ�a��i!�`�P0���WDq��
z'�_牡���,�<�Mk��7J�mN�h����1?Sܝ_w]!0}��c�G���OQC�3{����2l"6�	W��0y��Zy8��F,���=��IM�E�d���ƣ֕ �C*[��p����N���O�7}=��`�`��
l�k�a{[�@vr�䳂��ǭĉ���0��#��i��.�����K|�r_`c?��t�E׀�����%f�	>�\�I^�*���8N=�Y�=�mg�-��MKV�By�i͛վ��}�[��`�,F�xH���$����7Y���hxlW1�q,�y�v�XW�cc��n[��ᱯ�n�<�	�n0��S�
�pZhᣜ��{�ȏ�O���C!�Gջ
�����.�h'H�eQ�v�ZPu�qK�K�5���I`�trȐ�D�����|&���O,3�P�#[�^䈝�%��S���:��물�J-I�-�h� jL�WfO��2���"u�n��^�]���qqd�֏�%2�*Z�&Q��R��A;%������<Th���u��vp���T$�/n��Hxd��A�+���9���s���?;��$Z��bBZ�3Z�u����oT	� U�+��M�����	�5{����v�E9$D��֮� 3�C
����
��|��]��T-�R���,�I�7m��r�x1r�
l;����Ӿ��!�
� 㿒T�BR-v�C�h�@���2�����.�$�9q��f��F�f=��QcsF2k��E���,�y���^�P�tP�x�#+%��������|a~�5^\;�d�O<>����	�28�j�330̘�)��y/Gx=��YE�{��AҶ(�J4�:�&A��C�t�_�tfm�7���)ŔD��
������*�&[��C���"I#F(��q�4��	*��HRf�q�"\����!�m�O����<�p��&ζ�q�C�
2�TXH�7fI*���(�RQ
1�%�T��1����.�&��P_FNa�J�w-X�^N�Y��aOi�����X ��&`���`>T�ձх}����EQ�5b��PC1�����<�Tf�ڷ�XU6!7:�q/e�;�;�)�+�;��3�{uצXS�(�7��f������	�V��jӏ��/��5���x��Bm���!�Q~{dmn �fo�~��uo�r�ό��D�b�Cr ��rL=��|�n����h��Hz�9�
ND꒿N��L��6�B1�̍5zC��ꯙgsͱ���H�����-&�'HX�-���܈��!<H��%�Bn��y�]$"*��)�
J��CF��	S5��5_�8MJG���۳��n�[���`�r�~��]����&\�\�8���wBp7i������S'w�-A¹��;]��d�N<�(C���h��ꌭ#
p�E/��f鑌m�'����`lz���23X��@���)No�E|��^m���_јh���Ոߓ�C��Ϛ��P����sP�	�j%|��Ey�<��[?�tˤC�6\�e��/2�Ӭ�vg�K��Q֣���KC�?�f��M�m��s��R���
�Ba����koO�l`,�e��u��6c4��U�j�B"}+�va����k�����x�΂�g�X /�gD1�����E�X  �A�c`2�g8���Fj�M��ݠ�E���L���W혴�I$d���18_cu�� N��E�@�y��Ɨw/���½e��fB�����v���Cד��t���i~�L�O�P���i]t빟��F�:�"�`F|b���7l��)���|@��Zi%�l�{{����?��853Dl/dl[ �&�[��#d˜���L?����k,�%��X=���I�z�7��b$^g�v��ҚZ]��Cf��qlJ��o,�a�~�3F��@)U��1���m�`B�D��"Gb��.%&) = ^��ɆB��N���ݗ�{�L��	�w,7ƪ�]9�)h-G����Ԇ}B`pq��(�
���Յ<�!�qf���[f��8)Te�<�o=��k~�t�s#���u�ۣ����#t6��=�eQ;4��@���8EW|����F��42�%%N�OҌ����~�xnX0`j������?S�� [ by5y��/.u�%d�|�-x��;/�Wo�D#�2
��ѨzS��<��Z�}�V>��~i�˦�ho��!��}{��$�I�=�j��y�Ȼ�]\�xo��i�t��θ����=�����L�	�\�-Os����*<(��#��
�n
{=�����Y`�_MQ`g�����]�7�Ρ��$}:	�\�E tEMw*�
�����W���g��ֳ�
$)���`���j�m�;�Y|�`xx���UxN}C�pڜT�
��6?S�ѕ5Z+{	B��bN�c�c�K�ݛq�����5Og�!t6v�5�����NM@�-��{p�X�U��2$�y�I��p�1	O-��!O
�f)�eI��'�o���(�I�Ϝ�BQk�� �=�-�іF�&[��V|��]�%fjiQa���$��76!��ÿH�	_X~d1��O���Z%��j�"&}�S�C�(���-o�͹oRb�荝2�ݣ���}S)�:�$]���z��g�
�&��H&� !�(Z�B~�ܚ�+��D������'����*�;5�Q0#��t%и���|��VU`&�>�e=�-�D����$���|�+�Y/_��<�ܝ\��g]VK�?��T�;y�g��<EO��uF"g~�)w��/*�q�����w���D�q�º��:�
QC3�2�u)�� �5��2���|��
p7X�@�(:>���˳GW�`�o�Fmj%f�� Q]˜ �Xji�*�/����a�X�o���T`󺧀F�r+C�R+{k'F��j�o��H]2'
0<���5+)X40>N·*R=:�2�2!Y�!5��� �7��`^zʳdA�`ڏ*8v-hc��$�^Tj_>w��PÂ.������P�X��������>v���l
	{�ǫ���U2ĩ������8�����ڹP�X@��2%=���]��+�3��ݰ����{�]&"`E����anv%.˂CN�A��@�?2�%H�*�<�![�V��:� �c��-A]����^"K�#f�Dn�����-��=�]�5�*��a|��@ݼ��=���V�ѪCP�<�5��I8�c������� ���P�y��nD�md����A''T���~���=�P�����vAYv�4{p��#vB>n�?����������{ܗY��fu1����M?c���l��u5X��c�W��$�i3�1i���ܦ��/�e.H�T1.
F<_>;>���(�-��hhC<|C�y*/ L/�4���@��a�����1��T���j�ܦ
;�`ʜo��Û��b/�F�9���C�UЕ\�z��e:?�a£WBu��R1��K��z���8[cG+t��d��T�t��y�����Ρ
A<�����0a_���哰^�v�.� �ᥰ4Y����H���BV�Şq��^?�m��*�p�,4>��_�į�=AWn��YZ6<�Zd���
�&e�3T��ɧG v�mD5�̦rZ��{ȝ}]���y��M�I[�Pxr���`�_�#����/����~p�6'r�+�� _��BL��#>�Q/�{�1`x����tz�G*bFmS��[�2S��.�H�ȑ�2yϯ�7�]��Jrİ�iN]��"��Q�A2[>�g[�hY�4�`��g^=6UT�v�d!��
i�M��[%Hb����oS\^�Q�ˡ=v��Џ�)�ء7?f[�R�����qr���Z%|�ƌQ�^y�j�z��}�t�هT����
%	nd��V�T�_LM��}rѥ���2��ܞ{�����;c�H)I �����8(I� ���!�����b���F�P�2�՟��`ҏ��pgK�"���#����-Q�{�p�<���
�Q��Z��x#V�>��~�BLD���	'wU��:��d����	H
�� �S�ls�J����~�*�V����Z}s���B��@Bj�+�Y��o�xij���Y�OA�kC5���9
o�g��5ŏX��-N����8���N�@m|��}v"=!,���Κ�F���J����o>:T�?���Gq�R�!r&��$�P�ݹ�a�������04�
�� �z�o8���fW��B��Y���R&��� .�yޏޟ��'%+�s�r�۶�����D� �)�l�Lz<F�����~��+s#��] �c����"יZnG��ZN2�`��A�R�
T�EcL�/� �?�*b�j��@��$���� Kⳇ�����aG�\���!�՞�¡A��6
�Q�^���{�JԪ����Z�UZ���ΕjҚ��X|�T���x��0{��/�jv��u���p V�1SP����d{��H"��A�5�벖r�a��ц�F^짓N�J��Ia�S��I;N�t�9<F�DMee�B3iM
x�C�Xk�4�G��A�~Sw�\�8\JR�{�X������>Iǀ�`J�1���5�c���;/����
�U����*���S�e"&pDf���4����"ꛘ�G���Xu#�9ֱ�Ppa��L�|Co쟼8���7��Mw:p\�B�=U$U���K�e$�uZRM��0�j�f}�E��Q�oӒ�Z��ޣ��9��ŉ�����m��x$C��x��RK���a�]��kS["��@�LI9
G���}h+MC�mE�
BMRq����)xf��j`�M�g���W�e�ȫ�.t|�����,3�1�_{���]�R��_���ځ���r�s��!,��E�oM'�v��O���?�3�F��H���D�������T�N�D����H���K��9�rM�oL���"b}�Wkc���}-�����լe���
��ǎeΖੲ��57��#/���jt�����{h(ij�3�srN5d��u���j��0y����VA
��4�cInO��!���tK~N1��X��ɿ�c�x�e�[��``�Q��ܧ�����e*~�K12��?�J�>���!&�K�)` requests made by this strategy.\n     * @param {number} [options.networkTimeoutSeconds] If set, any network requests\n     * that fail to respond within the timeout will result in a network error.\n     */\n    constructor(options = {}) {\n        super(options);\n        this._networkTimeoutSeconds = options.networkTimeoutSeconds || 0;\n    }\n    /**\n     * @private\n     * @param {Request|string} request A request to run this strategy for.\n     * @param {workbox-strategies.StrategyHandler} handler The event that\n     *     triggered the request.\n     * @return {Promise<Response>}\n     */\n    async _handle(request, handler) {\n        if (process.env.NODE_ENV !== 'production') {\n            assert.isInstance(request, Request, {\n                moduleName: 'workbox-strategies',\n                className: this.constructor.name,\n                funcName: '_handle',\n                paramName: 'request',\n            });\n        }\n        let error = undefined;\n        let response;\n        try {\n            const promises = [\n                handler.fetch(request),\n            ];\n            if (this._networkTimeoutSeconds) {\n                const timeoutPromise = timeout(this._networkTimeoutSeconds * 1000);\n                promises.push(timeoutPromise);\n            }\n            response = await Promise.race(promises);\n            if (!response) {\n                throw new Error(`Timed out the network response after ` +\n                    `${this._networkTimeoutSeconds} seconds.`);\n            }\n        }\n        catch (err) {\n            if (err instanceof Error) {\n                error = err;\n            }\n        }\n        if (process.env.NODE_ENV !== 'production') {\n            logger.groupCollapsed(messages.strategyStart(this.constructor.name, request));\n            if (response) {\n                logger.log(`Got response from network.`);\n            }\n            else {\n                logger.log(`Unable to get a response from the network.`);\n            }\n            messages.printFinalResponse(response);\n            logger.groupEnd();\n        }\n        if (!response) {\n            throw new WorkboxError('no-response', { url: request.url, error });\n        }\n        return response;\n    }\n}\nexport { NetworkOnly };\n","/*\n  Copyright 2018 Google LLC\n\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\nimport { assert } from 'workbox-core/_private/assert.js';\nimport { logger } from 'workbox-core/_private/logger.js';\nimport { WorkboxError } from 'workbox-core/_private/WorkboxError.js';\nimport { cacheOkAndOpaquePlugin } from './plugins/cacheOkAndOpaquePlugin.js';\nimport { Strategy } from './Strategy.js';\nimport { messages } from './utils/messages.js';\nimport './_version.js';\n/**\n * An implementation of a\n * [stale-while-revalidate](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#stale-while-revalidate)\n * request strategy.\n *\n * Resources are requested from both the cache and the network in parallel.\n * The strategy will respond with the cached version if available, otherwise\n * wait for the network response. The cache is updated with the network response\n * with each successful request.\n *\n * By default, this strategy will cache responses with a 200 status code as\n * well as [opaque responses](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#opaque-responses).\n * Opaque responses are cross-origin requests where the response doesn't\n * support [CORS](https://enable-cors.org/).\n *\n * If the network request fails, and there is no cache match, this will throw\n * a `WorkboxError` exception.\n *\n * @extends workbox-strategies.Strategy\n * @memberof workbox-strategies\n */\nclass StaleWhileRevalidate extends Strategy {\n    /**\n     * @param {Object} [options]\n     * @param {string} [options.cacheName] Cache name to store and retrieve\n     * requests. Defaults to cache names provided by\n     * {@link workbox-core.cacheNames}.\n     * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}\n     * to use in conjunction with this caching strategy.\n     * @param {Object} [options.fetchOptions] Values passed along to the\n     * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)\n     * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)\n     * `fetch()` requests made by this strategy.\n     * @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)\n     */\n    constructor(options = {}) {\n        super(options);\n        // If this instance contains no plugins with a 'cacheWillUpdate' callback,\n        // prepend the `cacheOkAndOpaquePlugin` plugin to the plugins list.\n        if (!this.plugins.some((p) => 'cacheWillUpdate' in p)) {\n            this.plugins.unshift(cacheOkAndOpaquePlugin);\n        }\n    }\n    /**\n     * @private\n     * @param {Request|string} request A request to run this strategy for.\n     * @param {workbox-strategies.StrategyHandler} handler The event that\n     *     triggered the request.\n     * @return {Promise<Response>}\n     */\n    async _handle(request, handler) {\n        const logs = [];\n        if (process.env.NODE_ENV !== 'production') {\n            assert.isInstance(request, Request, {\n                moduleName: 'workbox-strategies',\n                className: this.constructor.name,\n                funcName: 'handle',\n                paramName: 'request',\n            });\n        }\n        const fetchAndCachePromise = handler.fetchAndCachePut(request).catch(() => {\n            // Swallow this error because a 'no-response' error will be thrown in\n            // main handler return flow. This will be in the `waitUntil()` flow.\n        });\n        void handler.waitUntil(fetchAndCachePromise);\n        let response = await handler.cacheMatch(request);\n        let error;\n        if (response) {\n            if (process.env.NODE_ENV !== 'production') {\n                logs.push(`Found a cached response in the '${this.cacheName}'` +\n                    ` cache. Will update with the network response in the background.`);\n            }\n        }\n        else {\n            if (process.env.NODE_ENV !== 'production') {\n                logs.push(`No response found in the '${this.cacheName}' cache. ` +\n                    `Will wait for the network response.`);\n            }\n            try {\n                // NOTE(philipwalton): Really annoying that we have to type cast here.\n                // https://github.com/microsoft/TypeScript/issues/20006\n                response = (await fetchAndCachePromise);\n            }\n            catch (err) {\n                if (err instanceof Error) {\n                    error = err;\n                }\n            }\n        }\n        if (process.env.NODE_ENV !== 'production') {\n            logger.groupCollapsed(messages.strategyStart(this.constructor.name, request));\n            for (const log of logs) {\n                logger.log(log);\n            }\n            messages.printFinalResponse(response);\n            logger.groupEnd();\n        }\n        if (!response) {\n            throw new WorkboxError('no-response', { url: request.url, error });\n        }\n        return response;\n    }\n}\nexport { StaleWhileRevalidate };\n"],"names":["self","_","e","toRequest","input","Request","StrategyHandler","constructor","strategy","options","_cacheKeys","assert","isInstance","event","ExtendableEvent","moduleName","className","funcName","paramName","Object","assign","_strategy","_handlerDeferred","Deferred","_extendLifetimePromises","_plugins","plugins","_pluginStateMap","Map","plugin","set","waitUntil","promise","fetch","request","mode","FetchEvent","preloadResponse","possiblePreloadResponse","logger","log","getFriendlyURL","url","originalRequest","hasCallback","clone","cb","iterateCallbacks","err","Error","WorkboxError","thrownErrorMessage","message","pluginFilteredRequest","fetchResponse","undefined","fetchOptions","process","debug","status","callback","response","error","runCallbacks","fetchAndCachePut","responseClone","cachePut","cacheMatch","key","cachedResponse","cacheName","matchOptions","effectiveRequest","getCacheKey","multiMatchOptions","caches","match","timeout","method","vary","headers","get","responseToCache","_ensureResponseSafeToCache","cache","open","hasCacheUpdateCallback","oldResponse","cacheMatchIgnoreParams","put","name","executeQuotaErrorCallbacks","newResponse","params","param","state","statefulCallback","statefulParam","push","doneWaiting","shift","destroy","resolve","pluginsUsed","warn","Strategy","cacheNames","getRuntimeName","handle","responseDone","handleAll","handler","_getResponse","handlerDone","_awaitComplete","_handle","type","toString","waitUntilError","messages","strategyStart","strategyName","printFinalResponse","groupCollapsed","groupEnd","CacheFirst","logs","CacheOnly","cacheOkAndOpaquePlugin","cacheWillUpdate","NetworkFirst","some","p","unshift","_networkTimeoutSeconds","networkTimeoutSeconds","isType","promises","timeoutId","id","_getTimeoutPromise","networkPromise","_getNetworkPromise","Promise","race","timeoutPromise","onNetworkTimeout","setTimeout","fetchError","clearTimeout","NetworkOnly","StaleWhileRevalidate","fetchAndCachePromise","catch"],"mappings":"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*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/

"use strict";

const PATH_QUERY_FRAGMENT_REGEXP =
	/^(#?(?:\0.|[^?#\0])*)(\?(?:\0.|[^#\0])*)?(#.*)?$/;

/**
 * @param {string} identifier identifier
 * @returns {[string, string, string]|null} parsed identifier
 */
function parseIdentifier(identifier) {
	const match = PATH_QUERY_FRAGMENT_REGEXP.exec(identifier);

	if (!match) return null;

	return [
		match[1].replace(/\0(.)/g, "$1"),
		match[2] ? match[2].replace(/\0(.)/g, "$1") : "",
		match[3] || ""
	];
}

module.exports.parseIdentifier = parseIdentifier;
                                                                                                                                                                                                                                                                                                                                                                                                                         �H���;kP�A�'TE�p��{JZ���]��������9mӎ1���P�1�h#��,�ۺ���m��3�'fV|���.��H͈D�Y|H�(� ��:�4��ڴ�.�.@;�g0�7~��P����[�aP�A��櫼��/6V���ϰHǔU� �����bR��gH9�$9A�5��P�!�&K�W�,��B�9B9���6N��:B�9���O!�g�b,uS,���1n�PJM�%<,�I��
��$� g��F�G=\�5돫
'��4�=�-I�qB�+o��E�%d�A7��K4'��Q�;��@�-;��}����jwp�h��<���A�9GX-��t�(�n�~d^X�hp��Ԣ����y����n���ũ��1�"��-�R��6���j�(C�ep�Be}x��������6�Yd�n���G:���	����h.H�-��I�4}��&@I�z�)W4��F�Vt�PD��ND���A��vʒ�,���]�Tͽ1{���*-���Z��$1���N֣�A�,�R���l�a�}y�e}�hu(���$��& 0�}ms��$�*��t�9!1J�!�S�w�����bgI�([�?]��2u�/�tt}����A�cT�q$���qRW&�+4���Q�b��9�s�Û9�:�&����m!F�!N�G=g	�vQ�������"N��&��v��⌿r����E��Yɇ���\�X�m�U����"��#8
/�zg��N�2�g��ډ����Fi>R��0L(a(��fa��I���#}(�:�e9h��7LY.�f�/u�.e��=hY�R���iU ƨ�c������D���2n�H�u�s)����.ϒ���%X�t����C5Q3t�%b'^�:��,��A�U�cMҴ�69�7)X�`��æ*��~����jV	*��_���&p5���bP�*��A����#i� ~�}��h��w^�F�{1g�+�wU_8Q\��9���v�O�M�8�Er����}2�Ϻ8<C�R�YmG����fFq�J�׆����<�q�OJd�o^�ѣL���}3זG6w�֙r���Tm�o�4�n��Y���P(�1�WQ/���T�-MJ�!��G�̋.("�.HCQ�b�wpu������	�9(n��Ɨ	 I�`�v��(�5�\-��ک�>�ё
�}�,���dh�\^�t��m�^��������O�M��
�����d�a�֫��%\D8t��fQ�tJ������}˪��e�W�r�z�IEB����h�8������FyN��I�G �c߂Z�ɐI��o��1�h����1�(�,���;싱�4��eR
/�v�?ݿ��m�,����&�R�O��3Q�%��|�B\tp�^�Q��Hd�E����*fê�WEW��c2�@]?�� �g����T����L��Wf��t-�����A�	�Ϧ��_)�qY�y�eXI��Ej�U���ƪ!g�.�ԋx
0N-���w���̱�^��p���"�Q���p�6�؈��\��DT
S�[R㼈NV%�yE�G'�� ���܆\�+}AxeH.� ě���^8��x��T���0�b!����^/Uu�z��;��D��w���l]�\��ۧCQ=J��|�tP��6 -�Y��(�0]I��W���v6�;���ƭ��ӏ
���H,v�
����?)�2�[X 8�K�5�M�݁��Rb	VR^��� �zJy��6S~�!�S1}9�Qm���y�]�����C�ӕG���N����Ō+���?
�`��z�>D4���/��R��;�Hz��O���o�tå�
���XЂU(���is��M�KTpp�2C�ژ���%���n�|< �s��9�TԐ���0Q@�qk8����j�
��؆�A��<�����T<�Sr����1��Fξ�s�c�Օ�.w�"���/o����f��hN�2n,sy��?w���ѻ	�Y&{������Q��Ӻ�ɼ4�j�k��1MkN����Iy�#�AV�-T�[�����,b�{�e�|�w���$�W"�k kzǖy�H��u���H[8�=�n.�.��x����ꛑ�~d������/Ϩ�F6fc�:o�5rc���Cj��ݹi�zY%��I�T��pY�>?����=c�T;H����"ccm7��~�#�{>�(0
����БZ����T�):�~�m�n�_��h��T��l!o�q ������Ż��)Ԧ�vy�B�/Y;��n�"xJ�f ���R;t��E��Iu�6���r$���eA�b��W炻�u Z����$�����?f�|�..GB���zJ���FNv���Q����CL����,����щ?5�y95L�0��;C86�e��W4)*14����������)/�)��b( �K�}f�jf��/<aw�.`A��v�ͥr�b1@�ŖZ�2ޘ�سx����I�J�%�q�.�X�smq�ʐTs�ó�K/έ���I�h�p6p2�>���V���P\�����r������crN��:l������s���4�f��z�U!%�_��tw~��߰~�t	Eq73<����յ�S]�%�V&2�.��H6��B�t�T]�홇0p�Duxo�
߯P�s��\�P��K�3��;g��������1��}̻��ael����善>�����
�ɐ�uF�.Q�<�8ݡ���
�'54�g�1�0�'U���J��j�i7����?���ϻyY[{��8�$�=����y����^+S�� �Ǫ��]��dV~S���:�҅��0�h�����\��e��c���~TaM��let��D�jȤ@�̿(�K�CS�N�h�5���4�`���ahȞU�U�f�.�W-e�rx��;���@�N��@dBr۲gkC�.�_��hr�g%G-}��
��@�y4��!3��p0��I�Z�Dp�J�@�� �]���Q��;�!����O��Y)�A'��z9�:�kmL��Z�S k���9�xR�P��ޓ��f%�t,�Ԟ��`K=zA�L�d�I��%4 ��qC��u: i�(�7WHb}�N[��1F״M���%�qj��ܲ:H��
�JrhDS���vxs�E�}��C+0��Ȅ��>R�:O��/m�A��N���8"��N�jo9Z�KX�'N�
 L�z�Lw1��I��u"8��[�2o��_;��g{�C�.�4,��<� :E�ʮS���Z�Ǫ���H�@o����Z� \�x��(zJ?�]
��s�N"��"��A�����6��u�r�U�WK�����
�3��y�D�{W�آ0�:��^$p����;���R�%X���;�̻H�T����f�J�6�<�F!��~�M��R,�М�23�������Е����z��i��h�D^DH	?��
����O������d!iZ �L¦�{�D�*ɿ��v��	�;��&��Q����{�1�uf��ߥ��s�t��Q�Z����cZ'[g�v<A�l�i��`��ʆ�!�Y����t��S�v����'�!!�dH�a<�E��w���/Q<�$�����]f��X��{��1oe���d���$5:V_ǝ)I08�^��yh�@��~h8d��<���P�?��R}1I,y�J}#`w3`�M���o�����㞮;	�r�Ҟ�'f����Q1є���}�B9��0����!�R�O�֏M^�`�p=��8�[��K�X�Q03SݎU����n�RC��������rF�'�����)_o�y��^B�2�E�/�L+���1��� +�S�w�9
��8"���
���{u�
[v��^��e�'�`�4�z�cw�S
B��d���#NYg;�����}��4�a�L��m���=���FZ���������c� �C�tp`5�%|������2�����ۭس�=�5�gG!t����������5`�$Y<�� q�Vj� h�SI�D����[Fj#�������&��ӽ���̥I���/��{;͟Cu��0�T(���<{������r�Y��̻=��g!4�֢�1L4l�(K?#$��&R������ɫ�]��п%&;'���@�K	^��/0@H�,_dz5�r&���rP��i�'B�ւ}4N0q٧��T�o#-ݓP%j�kN�����|@q���Z+O��NR�kg�̹�z(��G��o����u����+召V� ;��h}�FH��I�G�j/�ˁ�[�����ZO�u�S�(����3D��/Lg�:֭�/��zYj���-ọ��P���wm���k�<㙠w�ʌl�X�+���u9s�Ҍ�97�i�`��̗v_g3c25��/��6���g��+N����1��l�U �T�ٽ"Ұ��h�k(�|�P���9�׆�)�/`7�����'�8p��S};����">���c��}�V`�!��hJJ�W�C"i�	J��k�dB����b޽ _l@}�����!�3��E�����p��}^��g�ܗu@�!
@�'&4�{񻊡�]Li<l�y���� "e6s)̤����v].t�t1�|�fe���Q>׊�����XRH9��,�KU���)�v2�}]U	�{��9I��B�}�-�3�h�l��򕆎A:
���ѝ�nCc�F�~����,���GۖK��֜͜ZR`p�C�i�Wn�z��]Z@6�!�����+��~[�=0u[oS��썑�#6[H����ʤf͗f(��H��S�u���*Ը�A���,+� s��̥g�ks�̵[3�b�+I�q-�	y��"�
�j�HqH-����_�(��h�8��1g�f�ƀؔvrN�5��A�2���p����͛�}�7���y�Ρ孃bX��E��I�X
#AU�-[�݁Ƽ�Fضq�� �5s)Ϣ�
˖4F}���Qu�΂z@c?h���0뒊{^@!��Ggk�}K㻣Ӟ�*�7ϻ`'����s살ˏr��Źm�I��Bu��z(�3g)�����0$�e��%���(���A�r"������FT���~���O	�St��x�)g%?�G�i�''a8��6|H�t�R���B�ݶ�X�E���=���������K'ę;�B.5N*S�D�f[����~j˗O`��Ȼ��~�f���>eڝ�z�Ŧ�5�ܾ�,���K�9=� h�         !�ݢ�Á���%���;�f�V�Ԕ�P)xc΍q�}��vl�9�eSޚL߫,u�݃�น '%�g�s(�����Q�w�ѧUPB[x������Υ)�k��ёĴ�U0ɂ��d7���]��ѯ��V�`iT�,�p�D�W�D�d
� QLA+�M��Ou����[ȩ=�oҗR��}�<�e��AS���\�nt�f��U.5�"��D���A�d ]L��;��2Se���A�ymw�pU��h�z����W7�u�ꋗ����~�� � "	M�W�Ur��Y��X��nO�UyOnM�Xd�#�  �������$�����딻��
/9�dy�	,�K�ۻ�.�' ��%Q�?]j�*<!�;ǂ��,�x�;�.�n�\7Ĥ�˨`c���	�V��f6Y/��/�i] j(����iX�=_ 
wTX
�a*.t�Ѥ�e�
�p De�+-�f�?�Ǧɶa�Xj|^�
?s��� ��9�h A;�����kW��圆I�pG\y�h�b���C0�Һ�]Q��啷�G
����|]ܾ�K�0�N�✐���.(�,N���viFU�I�_�K���cm�鋠�.	��.Y
Z7!�S��3\�m�Zļ�R�ھc=� �
���)�w�AG38�_�8-���s%���ȯ�h�\?s._/���G(�+�,J��#ȍn��
�L�}�m��dl�Vi����KH��!�g��p�Z�y[(sCԅ(ԉ).W�d�9�Ui��z�P p�{t���@S�>'�6[%(�Vv4"����j?���~�.u���#�s��tEVm��E���E�l��u��A�����G¸����}/o��yQ�V�f�ZB֘k�v���zrx�/wg�}d�F�z�zp�{MC�Cթc�=T�<�;�P�l�"��?4�Y����	���=�e!��\v��{�S2�D�o`N\�4,G1@��O�t��2�Юfe�o��&nc��!Ė����4P�
�۴	@�O%�
��?�·���$O�kI���� Sw=F��M|a0u�����8R&��B(���9���t�{��KUR�2�&���l�
��38V27��Gk��>ئ,8���ю[o;@�M�_�U�pJ#��%��Ƣ2#7]v����j�
.�ԭ�R��<�;�"����l[A��\Zيc�؝�8g7�R�È�P���Y"������<9��X\]_av��kZJ�Rp��׵V�U�nU��zZ�7 ���mP�k
i�g~�$hM^4|�>+Q&r�ZM\'� WcHD(��c�G �ʭ+|�y�u�=�E��\�UrB�0W+���T`P�pO�`���H7-���ß}׻$J�y�.��/(`��Hb�ZB:!��Ex��[G��|���r9�0�׆��נ�2�E���,����i]|�S�s���2榛����C-�Ɯ�7���q���X��J<�á
k��˦�4�)$�+|�
C�V"uRU��q
׽'���3����,`��"!�T��Cq�+)��>�#f1
�[#�l��!��2FU��9q���Y���)�3�����}T��� ��_��w�5o�����iz&�E�W	�{��	+ed����Kf-T�@h��J���궤�:b}�$��ʢ�����6�Nȼ~r3����}��
�0Q��a�Vl6����g��ԟ#��W3"X�3㗌�,���<z:���x��[*������HoV���NiI����j�@WuB�h��E����C7U!��v�N�ReT-`�Q���n�E�X����2�� 0�G�m_�u*3���u} K.H%���8M���X�=u8��A�+B\��-�#�Ԋ���fZ|�{�w9|ޗw�1|kwC�H�H,�N���#��M�����S��l���w	ݾ(����#j�:��hp`M@n����DmQJ��� ��M�_��	��0��7�z<�T�"�I�Q��ZwA���׶����]��4�:�<5�!)3#K��=|�����a�w�1��W���J:����z��5�DYOn�8g[�����۩v��Qϕ�pu~��}6���5'��� Di}�6��.o1k��_�{
���?����ܤ�9���LY��gqz{{�b��%���$8�*��߲�{�X���y"���6����b�,��JXz0��Ӧ��):�'*X�/[Y�p8�{�Ru�I�?v!��ΰ?|�g	v&`��ZA�F�(:c��٠����Q�L�_�����l���������/���v�ߠ���X��ڇqI���B�K:��a�@��ҥ�OF��ǖ
���Sr�\)ׁS_��:�$ZY�E�_!��+n��@���w��K��W�z�ƛo���Dc�< {
 <�<L(z�L��E"jύ��1w�M�\� ,4>�2���Էw����q�!��ǭ��g�J>^	{�h���^]e���!{����:��]����NǗ]v����iO��[��'�~ �mO�R� �C���]���H3n�"%^U[B^)�I`Y��o :�lo��+�Y[ԋ�4?�6X��Yǹ�G��%<2�s�l>B��?-��F졣M�a8�����ة((���9DXMP_:_i�Q�b*LC#�7���L,i�f��d���<���D"�_i�Ĝ��.5^�Ð�&���=�vc�b,!��:n8�1�I���T@7&v��=���#L��>͉��3d��6Dx(5�ʨ(/��y-�`q��(��|�������MEq��,u���x s&|�,�{j�U��b�8v]�w�����!3����f+?����L�$U]�����P4D�;Ab�_������<h�\�&�F6o���c�g�b<|B&U֦�V��h@����:A�3�
>��kS�y_B�M�o��_&�2����%$��3��
��YJ~ݫo��J��_83�y�mb D���n-B�m���|���zs��5S��H	>b+bG�!�fm�p��i�i�|�ػ�X۪�@N��yd�a�h�eaQ���gDۉ��C:M-i��`�R�'�UH��J6%�O'6��'�tn��BV�R8�f���~���������GY�9�'L������z��5���߬�
�迱���S�}`�R�bU�t�=o$�$X��`k�g+{��%CJ��v�ӓ����a�Yب"oo@s�n�wp�5�C�X']���-k���mvJf���m�Z�O�W�	�rŹT6w�"��s�.��nf���ç�u՝
]��������%�&���t2)d�=������t�x#K.�a��م �d��Dn�Յ6���g�QXY%6^���<zm:��������1��!�n��Oz��1¼��FLUn�#����V�#v��!��B9�ܧ��[���{}�]�
w��a���"�b��uq;�?4����]�Ldd��F�?�B�
t~�t��Nq��kу��~�.�K�d�a�6��稅A���E�[m8xLu�E�%�lJ�E��=���+V	�pm����'�i��פ�Z�C�mѨ]3�nqt��O��QOد�y)^�9)��c�.��
    https  = require('https'),
    common = require('../common');

/*!
 * Array of passes.
 *
 * A `pass` is just a function that is executed on `req, socket, options`
 * so that you can easily add new checks while still keeping the base
 * flexible.
 */

/*
 * Websockets Passes
 *
 */


module.exports = {
  /**
   * WebSocket requests must have the `GET` method and
   * the `upgrade:websocket` header
   *
   * @param {ClientRequest} Req Request object
   * @param {Socket} Websocket
   *
   * @api private
   */

  checkMethodAndHeader : function checkMethodAndHeader(req, socket) {
    if (req.method !== 'GET' || !req.headers.upgrade) {
      socket.destroy();
      return true;
    }

    if (req.headers.upgrade.toLowerCase() !== 'websocket') {
      socket.destroy();
      return true;
    }
  },

  /**
   * Sets `x-forwarded-*` headers if specified in config.
   *
   * @param {ClientRequest} Req Request object
   * @param {Socket} Websocket
   * @param {Object} Options Config object passed to the proxy
   *
   * @api private
   */

  XHeaders : function XHeaders(req, socket, options) {
    if(!options.xfwd) return;

    var values = {
      for  : req.connection.remoteAddress || req.socket.remoteAddress,
      port : common.getPort(req),
      proto: common.hasEncryptedConnection(req) ? 'wss' : 'ws'
    };

    ['for', 'port', 'proto'].forEach(function(header) {
      req.headers['x-forwarded-' + header] =
        (req.headers['x-forwarded-' + header] || '') +
        (req.headers['x-forwarded-' + header] ? ',' : '') +
        values[header];
    });
  },

  /**
   * Does the actual proxying. Make the request and upgrade it
   * send the Switching Protocols request and pipe the sockets.
   *
   * @param {ClientRequest} Req Request object
   * @param {Socket} Websocket
   * @param {Object} Options Config object passed to the proxy
   *
   * @api private
   */
  stream : function stream(req, socket, options, head, server, clb) {

    var createHttpHeader = function(line, headers) {
      return Object.keys(headers).reduce(function (head, key) {
        var value = headers[key];

        if (!Array.isArray(value)) {
          head.push(key + ': ' + value);
          return head;
        }

        for (var i = 0; i < value.length; i++) {
          head.push(key + ': ' + value[i]);
        }
        return head;
      }, [line])
      .join('\r\n') + '\r\n\r\n';
    }

    common.setupSocket(socket);

    if (head && head.length) socket.unshift(head);


    var proxyReq = (common.isSSL.test(options.target.protocol) ? https : http).request(
      common.setupOutgoing(options.ssl || {}, options, req)
    );

    // Enable developers to modify the proxyReq before headers are sent
    if (server) { server.emit('proxyReqWs', proxyReq, req, socket, options, head); }

    // Error Handler
    proxyReq.on('error', onOutgoingError);
    proxyReq.on('response', function (res) {
      // if upgrade event isn't going to happen, close the socket
      if (!res.upgrade) {
        socket.write(createHttpHeader('HTTP/' + res.httpVersion + ' ' + res.statusCode + ' ' + res.statusMessage, res.headers));
        res.pipe(socket);
      }
    });

    proxyReq.on('upgrade', function(proxyRes, proxySocket, proxyHead) {
      proxySocket.on('error', onOutgoingError);

      // Allow us to listen when the websocket has completed
      proxySocket.on('end', function () {
        server.emit('close', proxyRes, proxySocket, proxyHead);
      });

      // The pipe below will end proxySocket if socket closes cleanly, but not
      // if it errors (eg, vanishes from the net and starts returning
      // EHOSTUNREACH). We need to do that explicitly.
      socket.on('error', function () {
        proxySocket.end();
      });

      common.setupSocket(proxySocket);

      if (proxyHead && proxyHead.length) proxySocket.unshift(proxyHead);

      //
      // Remark: Handle writing the headers to the socket when switching protocols
      // Also handles when a header is an array
      //
      socket.write(createHttpHeader('HTTP/1.1 101 Switching Protocols', proxyRes.headers));

      proxySocket.pipe(socket).pipe(proxySocket);

      server.emit('open', proxySocket);
      server.emit('proxySocket', proxySocket);  //DEPRECATED.
    });

    return proxyReq.end(); // XXX: CHECK IF THIS IS THIS CORRECT

    function onOutgoingError(err) {
      if (clb) {
        clb(err, req, socket);
      } else {
        server.emit('error', err, req, socket);
      }
      socket.end();
    }
  }
};
                                        ��s���<ܐ*��cg	*|R7������#.�F�,Oo�� �e�i�T�ύ�
�	~}��ɧvHZ�n9�U�?�dv���x���f^��J�j�zTU0��ir,>ð�fN��,��~gso�&_�ϵ\�7!��� #�8V�S��׻R�rރ��.��Ô�~/Tk�����O�̝?�TD�򃺈��`��g/d.���/3�kET��P%��q�k%����ƥ�+/�C��*qOHs�1P��ȝݺ]m��
o�V�|���}Q�j
��Ň�[�,8j�ha|�����W'�tـ�jj�`ۡ�7߅��ԧU-���|p1g�k��T]��0+]{�X&M�!�S�R���z�e��> ڣu�D�&�_�GÃF�fЧ��BZ\�'���,G��e_jw���(�y��bmf*_}g�b�J����p�c�(�Y�7r�Z������{�q8�/�^ (��MqcA;�ګ�}�3�)-�)
o�y��r �܎��Hs��^��&E��Eu���PC�,B��`�2(Vg��Q+�|a5�Լ>�Z���ǧM�T�c���JD�*`z 48����z>B���l� ��YMh����P�"��"4֛��v��~�xO�6M�W}��݋�M��
{�D�<&��^@н_�3�������[(�YK_޳r�!��f�	E.h�D8&���\���ٿ�-�_�ΤB�ȘRjt�P6��t�n$L�-�(�L�
��������yP_��-4ͽ��IP��O2�����o���z*ÕX��[.�k�Q�����2B?��
I���o*�(Z`S4=�"�/��A�L��W:wp��P�g+���6�y��i���x�#>a��~a����I�b�
9��Lw믐�"�Xȁ��n,��EVk!�-�d��5j��ߺI�ѕ+��3oGv��P��k��*]���@5�1��L�W�|�$*f��2���y�9W�Z/�E���I�~d7��["�d,�2f�-w����w ���&�Y���rc��`�:{HPFE�y����s!^7&�63�Yǩ�zo��ul��W�`���	W�6�߰䳘���3.^�E�i ��n
��Hi!�A��=�����Hh#���3�/&ac�L������@�^�0ϋc��S���,�%u�nYp�S��|gyT��D�����s*��dk���.Dt�4�����b����bk~8����lev�7g�IK�?��R�4А ��<��wkw2e/BR�\R}�_4*D� @�Я�C��F�.X��xX��u`a[��&��SW����Jm�u�=���G]�B<GL(�9�w)��ɰ$�8���r����ȽccFB@snb�-E�t*ଞ#� ���=]�E^7L	@�T��3A�KI}N���M/��N|sU���f{י��x�O?�zC�嶥w�>��$mA�j���(�Y����9�f�i�>B�^�Wz9)Qz	�]Љ&��.;b�9��H@��B�d*y�8�0Lf־=[:�}@�K�4;d�q��d��ӹ�@M$�J���:�*8�I��6��"�cۦ)����	�r��pAyc�W��M�g�K�}�3���PX�� k��^��bL}C�x5Ê�}�ǩ�

�����8���K�I�P@h�c��e�^BD��b�'���9'�>YPVH@C��tӛZ�/DO�qB�E��٨��-��M
C��28'F��@M>:H��L.z�q�ʝ]Mm�j
]J>r���=�rd���O�ƌ� �a5.�
c�>��*pq]��*A�Tby�f�������1MQ�\����#��o���?G����g��};�s�c]߸Fڶo�e�U������z�^\c�7�ҁ`RD
�������,G}�DsT�)���c��Ni�lC�9a�)�`��B8 ����j��E(����f,l�X؊0�!��Γ�j��A^a�&ݧ�� ��~KMx��� � ��{���nN4�zunE
i���g%9	�B�X�"�\_�H~���C]��!����(�n�*c�K%Q%�<�?�� v�DF�B�3�Ս7���Ur�[�&Ҍ��o�н��Ux�5���q-R��&REnm�s�b5Ա��?�M`�1�D��`��ߍ�]4Y��BY� _.I؇=E��[2Ү��Ti��f ܑ�?bsT���0�)J;�Oo�+�����A���zd}6�8@�
��N�މo�$*��WC��g���D�w��U���tРC��*-�[��o�.8�	���t�O�"h�I����G��������)���&�L��V�'K�z�\���v=J�:���u`
�-�l��	�B���G�6�������-BXa��-2�G��"� 4-�}��L���И���1*�S쨃M
�2_����i{�,�.Hh�[�ү�#�S�~Mױp��
��e���|y�%h�g&*�,f�ժ�7�����/0�$jd���y�����i��"4?8]"�ݓ�+�l�\l~t�*^�5u�
��ٺ�jjx �'
h <Pm����BOT�W�J�O���,?'�?7�}d���5T�:���'K�`��ţ�~X�hm�ߴ�1. ep��AЂ����dO���!��O
������ϖz��Xq��Rt:�b�_*�t#������J嶁'M�q���������+��=ʖ�Nb�����G-|uq������,�݈SoM�ԝ{�#6�8����*HKap'��+\Kyu��?i
l4Rw����
U�r�d��8�ȅ�n�NR<���0bɹ���A����қ�I���~%"�o}�']�E$�T�Z?���P'�����t��Z�wH�gp�;*�T�vH�M�L~��+��n?7�Y��&�R4W�
S80���O���D��>[��Ф$�>�-P�����S�5��$_G�^��By7-��PwA"���JB��

�+п�����YQF�2g������;㉉����nM��f�1I�,z'_lK��cmtZ�NgL<c��Z��r�^����U*uc"��w0�[p����WCg��Z�r~��]���Tn;��k�d�Fx����o��&�~f遯_ʘ
8h��2(��@�T��ұ����d�S<t9b��҉B�v[~*���5��� �:�#�c������_��-�qW>�x8Y�Y.d���K��V��NA��m��� !"�#����LȐ����2�~��I���,��P�Kk���+[�	J�� .��8)B����k3�j���ѽ��
SV���ȕ�_�K?i_h��w��\e����>������0f�]B�� `��cͺd0��nQb�.�| Gޭ�Q���������n�번.ʉ��ZǼ�M�9���;3�hK��@��꟤�oj�
]���p،�����0��4�����%�7����P!o9�IN�Y����-���_�e�'�8,޸�)��IP�׺�YjoI�ä������������m�T<�vy��$��@km[����h��$f�~lG�
	1t�6ʫ�|Uc,vG�*@tS@���t
N�d��>�%� ���B��?PL�h������gk����>`޶�\���X��H��W�ᛯ.O&��u�ՌM)o��(kz
;&E�ZE��+�[a�߃�`o�ʀGJ`xK��g\, <�m꿀F����.�+]�"r���.��I����q���n/���!D0�L�j�(vA���ɑ��QAF��'�����Y��Jz҄TPU��?9�zfQ8/e��+�IƲ���l�p'�q�A�d@M;J�}��,r���m��\�K9�PHy�������$�n�\���d�(���eDRK��������P:H�����A��Yr.�ڒ�;  �0&��~U˵�X�A5�9�ß_C�n��?�u��aS�k�P�S}��:iB��M��K�Ƥ�u`�zXl%��� %����`���u�k!����ĭm[&?<��2B
(�`��~����[��̲&���
�T&�������Q0�s�i��\<��F��
���E6��������&D��R��Կ�I%w��"��V6���@�V�Cs5FEa�uĥ���  F������f�4$H�����0��c���l���29�z�y��Y�K�w|h�*
A�Іe/M,87�&;Rc���X�nh�q;&���~t:uVD�G,y)�bа���fu�`�^Ɇ�>��x>m�������g��x���7Z_ ��U� �<������&��Vs�m�7�y5�ǐ��ŧbW}�$�v��k%-�W��̋Μ���S7��n��yb���M]��J��5P���x��)�Zx0*
�1�V֨>�_=��c��z+nl���
�y@2�zc���R��x�})5���v��%Jg�xi��6��*�1Jl�U�b�jJP�k��b�%��ӥ*��AȻ�Y �f̂�RD.�b,fi:��o@ۗ��Z��Y����5��8�cю�tT<4hb�&r��&�4����
�.��6��'��]���x�ƬWL��y�Kd�m�a{���&X��!��Р�B��$��h%����i��CW����I&��Ũ���OW�G�6���	ط�g����c��	8z���ʕd%���Ж���$F�5�+�
�ٷ�Ǯ˧��3�c�ٻ��^Tһ}w*���
�蠍e�F9j-�(��+�-������Ia�CT7qh���P�T�]6��+��R�0D�kXi�ډ�?�~[�U=��6KD�U]}�s�ޏ)�Y4�&�#L�����_��G���{�8ΣDJ�̼`,�����r�ux^�?Ie�ج7��ˣ��Q��r��m''������v�^� 2������h�'kc�����Vxp^h�2<����z17v�<![a���릓Mi�p�g�g�q�z��z04��`K�7�~|ݩЊ��m� wl�q���
��nv�T�;O>��S?��q���h�����$�S�
�ǳ��3��^�氰(��l�!�a�-��4����������ײ~�âiL=�qh�7��̅��j�T=��BB�ʦ}����kF�7=��AfE��k[@���}7�dO�c2+��M����=��q�S� �8¥��Y �/�H|A ���s���U9���4tl�(�)�(���b��#�3}o��#��#x��>��f�/�}�/&�����x�=�ua��A���@�by����/	�I4=�����k�T7`aW���GAR�U�=C.����*\���R!��x�ϭm&�#� �u^2�+=Z�eS��ٛ�g���������UvT5~�AW7�¦$
�������g]
�Sp#f;i��l6[�MZʏ>
3��Y��oңC��E�z��z�#�.;�3�7%G)�c�-��ca��-!��r
�3�����w<R�L1#A���=r�����YH�k�����s��y9KΪ� �[lj�"�r�n�Ξ���w��&щ7 �����ϴĂ�ߘT*@�2r�qݣ)v������;)�P�ԑo�h�Am��~�y��fD!���g���v��^u���շx�xĸu6�����P�O���u����c�=ID���RjO�{���9��AX�|:��E�_�Jf���a��D�.�j�rmQ¤�^�/G0�3�Ơ�ؠ�T�N6//g+~�A�.��}0r��s�検�V�f!_:5���  �X]���@��� ���q��*���#v�uy	���K+g\P�Wp�b*5͉��2׵?�Y֑K=� `P
�x��$�]%r��E�h��g�:*�1��SvvY�N���og�I�
��
��y�!�uz�$W�hU
~
�Q䮑����@���o���{
Z���Z��������3����7:�*��2�L�e �ߌ'��Z6�o0�Y��B�2��.V� ��ܝ���(O�k���@&0�5%���z�0#���<��W�+��J*�M*�l����a��]�1��o/�������9N��<��Q�)��Of��T��U���_�I�����.*�]WZ�
��u]J���k}�f�����ys��4�4�4.<��E;]��1@�3���#H3��]7�nY�cf�QS��T�T��_jb��"ƨ���q/�t�Uk�T��ڢ��_F������8����o���f��<���?�D��;B�;VkƤ{���Y����=�?�=dI�Î��K(����U�X.dq���.� �����h�6]���h�Vx\�2/��ʄ�<������b�Ȓ컪�y�-�-�iM��|���DJ�$bh����eSC�7�_�r:�eݑ��L�p�i��9�+=)Y0�̌��c�̪*�u�R(grP����\�f��_Fɱ3��l]�������2��|�Pd��p�����
�1�A3���*\O&KZ"���>)x��b��j��
kK����TGwLFrvy��Y}YS���)��V��_Th���X=���Ta*��~]��'�ڕe�;��(�L�� ��N��d�������=�Q���
L3(�r��͹��4Iͭiϩ�f��R'���ܒ�!͠�[��`v����ǔ�r��a3M�G%"$��J��������y�A���`���|�j��T]��1��s(�
��g��*uQÍ#蔑d�࠘R^dH� 5|�z2&��D֌d�	έ�>a���r��҈�|G��E�㛝��
Ǔ�[���~:�G��+J0��AϿ{|��*b��R�׊_-ٲ`�&w��;�������2�t���7�)��(c�~�
'j[�F��*�
.�P�_�s���c�!�5*�0��h}JĬ��)��Z,9@�W��&
�u��Z��K�O	kP�[^ə����b�o_��ּ��i`}+�aX���0�7�m���Y7�!�8f���&>�Syo
l�Ut?$\\��K����l��k����wΰ@�U��<e�?	�n�a�:����������0��be���T^��vj�G�d靃�2�dL���pf������+H0�/�X���	�Q��
�Ҏ@�T�F(j ��q��#�l��g6uy��o�v��^M������Ea:�I�k@�	�d [id�*2#�#�'�mL�6�a���.���wݩ^r���,YEٝ4f� �8��s�Z���R�fm��G����`^mv�=�ec"H�����	j,�yK��V�RiX��6�v�"¿��U����.��)κ������	q��-xc@I�G/�.�����eD\I���d`��������'a�u�:M$�|�"���t65��ײ�6���k�\X�r7���(=]Q�����S���g�=���1Z����K�4�2�ɦ�g��L��M�5������
���H���pLI��|�|T_H�=���S�0i8�����r����{�si�K��n|[u��n䪺�X8He��R"��8�	�L�Ź��ǝ����Pw�ӘSH��F�@^��Mr�i��ζ|!���d��2�&UAqS�ǁ�����$����!�Px�I|5z�G`��x>���`
��Ž�홊!�\Ԟ�����O�!����� ��d��2`+�j��3Re)�!�r!_��= �/�$�6�ZDj���$Q��4��
���&�U��G �^����(8
��њ�<a�7 7�i1)%\WP��T�����	�u�[����g*��i��m��Z���زLX5�ݩ/,D����'@� ֘�5*gdm���R/�nƊ��A'�I�XƝrpe~�)IS�����U��Մ?��e�ݗ(�%���$�KZ��/�>$3�J׎8[ N��Bt�7�	�Pp �C��r�&��bn˛���2[��u�6L)�n��N��������<��U��I���H�Q����yL������FRw��Hwa�X�lc.��a��&B�\����d��`�cl�<E_��[��-O�
�DQ�z��2� 9+��B�/�1T��WB���m���9���;�_���T�D���t�ع?�UFӽe���S�w������c���O$sz$��Ep���OQ��sw��c
 &�]?L��a���@��Ԅ�-2��ݓ����U�Ͷkv��w���Ȯ����u�o�4��c�g�3�R�ɬo�}`r6.�x/x|�<+����>k�,��5.�F>ҕl�,o�^Dݕ�c:��1���G�2���
%�G��62�6�AW���N(���e�יEY�+qGH�O��D+b��O�;
\
g"�~ς.?�$s�M�R�ʞ��������i��Nק.��'��*�=��֚�^�M�!*�.�L�Ƈ�j�x�)��>�krU4Y�o,D�j��|H������5*?]�=�m�.-���R��E���� J^E��p����d~괮�.��:l7��ؖ���~E:x#6�g�ݍ��q�<��d�[:����]��B+P�w��Q�`im셏܅3\���0���)���?gU�%��[p��3�T��(���e��Z/-�`�?���f���d�@=��-ic��W��e��0��j\�AȤ2��J5W,z��(��v�]ES'�m1�}�2����j�
�j(��,=�T ��g�T#�Y�������(?V��ؔ�I��g�m!@z%Z���L�3�x� �n�Ɠ��s��1��vi�+�`����i�w�X����߉�9���u6�
��Ә���T��ڦ�΁jﴩfX���@�r4
[��<�|���I]�i�yW\��8�y�\�A�R[vt���inq�GJ�E�195v�U9��K"��FVlN�g�@&��j����tj��Eq�$�b����:3c�!��{�5�q�$����w�����S�
z?Ѷ���{@��v�Is�6^���s(A�8�|'D��-H�dM��o��&_b�_�B�a=me��T��}X	2ID�Ak�D�P�*��]K�G��F$gQ�x.'�~[�������φ�/�`z��7�����߅�,�}�{nS�����*x��`}ҪI��&q���Q��U� x�l}8����'-�p�?$��B3NtNCYZ��^)����1n*}F�E_�V��g��s�U&m�EY9�<��=,��t�>uӴd@���5>%k�H�/V�W��k>�0!�B-*y48��jg�i3!�;O�L�{�:}Դ��-�ia��In���`�W�;G��E�����f����|GC��y��⠚3�hJք�YG�Җg�yaPZ�[�^H*2Nq��
�H<Ž������'SL0"d�Ifʤ�e���� �]���s�U�������?ּGaO�����v�O�<��C/}lKQ$k̡XP� �tfJ�@?��`/>��;�)���F~b���'L�[�s�����)ju�ha=k �[v������) �5����+(�����yJ�_��׫Jk���������6b]�����;�@�XT��'O�&�Pp��H�	v@
��^��b{k,'�n�)�ŉ�\�uabj͉䔂t��&��$b�e��ZP���r�B�:f����'���>}�]�5[#��)�(�We%Y"�e �cQ.2�^ac��9�[���N|�:�D��,
��!��B�J��w1��V��>_�u��rl�ޚ~�M���D�'t��ې�����uY��cpG*}s�&��~�� �ݶ"Bz~"��LH�N<F����2����1��+G*_�x:�Db�I�����jkad�|Q��". BK�����$��v��V1��ST`���V�7�E�`=R���[��j�A��l�ɖ���,;�e1�
�$hT��
I��1ct��Z׫m`�UE�*��ғ��t	�n�E��؄�2F�����5���4h�"���Z�3D�y�r����H9h�w��f*�p�*��m6�s�rc�����
`�B=�sۯ<3'��z{k8�o�����E.����v�EGeC�B��PK���"?�F��U�Ot5�����-z}L�pA���JA0�?�3��4S���F�d�w�)_���>��f��AV�xEZ:=�_�O�`[������,uv�z(:�����`���7�ߊ��\~�R�
)[%`E�o��x���-�e�ͮ����>|��Ϧ$`���匿Q��
*��
�F��bv����(iڶl�f2�ZAI�_���G[pIiifS��䓭`Z㌟��V���2Jx������^����4^/.���g׌(4߿���1\j�q}��lO(��lU%�!j��qc��}�Ͻ����?cFJ���ʬe�j藪�U��y�`

����!�o�f�Nٔt�賦�if�?�W�q�����5�/A���T��=�"v@� �����(D��Sg]z���ݽ٪���������W�/��~�������:���s�������J������[�9����2�Sr&�HfPza�P��h=�ꥤ��	֘7ʫk*�fԳt�P�����G���T��,Q��x��XJ����z	Ҝ20�Ȁ�
�
var clone = require('css-tree').clone;
var usageUtils = require('./usage');
var clean = require('./clean');
var replace = require('./replace');
var restructure = require('./restructure');
var walk = require('css-tree').walk;

function readChunk(children, specialComments) {
    var buffer = new List();
    var nonSpaceTokenInBuffer = false;
    var protectedComment;

    children.nextUntil(children.head, function(node, item, list) {
        if (node.type === 'Comment') {
            if (!specialComments || node.value.charAt(0) !== '!') {
                list.remove(item);
                return;
            }

            if (nonSpaceTokenInBuffer || protectedComment) {
                return true;
            }

            list.remove(item);
            protectedComment = node;
            return;
        }

        if (node.type !== 'WhiteSpace') {
            nonSpaceTokenInBuffer = true;
        }

        buffer.insert(list.remove(item));
    });

    return {
        comment: protectedComment,
        stylesheet: {
            type: 'StyleSheet',
            loc: null,
            children: buffer
        }
    };
}

function compressChunk(ast, firstAtrulesAllowed, num, options) {
    options.logger('Compress block #' + num, null, true);

    var seed = 1;

    if (ast.type === 'StyleSheet') {
        ast.firstAtrulesAllowed = firstAtrulesAllowed;
        ast.id = seed++;
    }

    walk(ast, {
        visit: 'Atrule',
        enter: function markScopes(node) {
            if (node.block !== null) {
                node.block.id = seed++;
            }
        }
    });
    options.logger('init', ast);

    // remove redundant
    clean(ast, options);
    options.logger('clean', ast);

    // replace nodes for shortened forms
    replace(ast, options);
    options.logger('replace', ast);

    // structure optimisations
    if (options.restructuring) {
        restructure(ast, options);
    }

    return ast;
}

function getCommentsOption(options) {
    var comments = 'comments' in options ? options.comments : 'exclamation';

    if (typeof comments === 'boolean') {
        comments = comments ? 'exclamation' : false;
    } else if (comments !== 'exclamation' && comments !== 'first-exclamation') {
        comments = false;
    }

    return comments;
}

function getRestructureOption(options) {
    if ('restructure' in options) {
        return options.restructure;
    }

    return 'restructuring' in options ? options.restructuring : true;
}

function wrapBlock(block) {
    return new List().appendData({
        type: 'Rule',
        loc: null,
        prelude: {
            type: 'SelectorList',
            loc: null,
            children: new List().appendData({
                type: 'Selector',
                loc: null,
                children: new List().appendData({
                    type: 'TypeSelector',
                    loc: null,
                    name: 'x'
                })
            })
        },
        block: block
    });
}

module.exports = function compress(ast, options) {
    ast = ast || { type: 'StyleSheet', loc: null, children: new List() };
    options = options || {};

    var compressOptions = {
        logger: typeof options.logger === 'function' ? options.logger : function() {},
        restructuring: getRestructureOption(options),
        forceMediaMerge: Boolean(options.forceMediaMerge),
        usage: options.usage ? usageUtils.buildIndex(options.usage) : false
    };
    var specialComments = getCommentsOption(options);
    var firstAtrulesAllowed = true;
    var input;
    var output = new List();
    var chunk;
    var chunkNum = 1;
    var chunkChildren;

    if (options.clone) {
        ast = clone(ast);
    }

    if (ast.type === 'StyleSheet') {
        input = ast.children;
        ast.children = output;
    } else {
        input = wrapBlock(ast);
    }

    do {
        chunk = readChunk(input, Boolean(specialComments));
        compressChunk(chunk.stylesheet, firstAtrulesAllowed, chunkNum++, compressOptions);
        chunkChildren = chunk.stylesheet.children;

        if (chunk.comment) {
            // add \n before comment if there is another content in output
            if (!output.isEmpty()) {
                output.insert(List.createItem({
                    type: 'Raw',
                    value: '\n'
                }));
            }

            output.insert(List.createItem(chunk.comment));

            // add \n after comment if chunk is not empty
            if (!chunkChildren.isEmpty()) {
                output.insert(List.createItem({
                    type: 'Raw',
                    value: '\n'
                }));
            }
        }

        if (firstAtrulesAllowed && !chunkChildren.isEmpty()) {
            var lastRule = chunkChildren.last();

            if (lastRule.type !== 'Atrule' ||
               (lastRule.name !== 'import' && lastRule.name !== 'charset')) {
                firstAtrulesAllowed = false;
            }
        }

        if (specialComments !== 'exclamation') {
            specialComments = false;
        }

        output.appendList(chunkChildren);
    } while (!input.isEmpty());

    return {
        ast: ast
    };
};
                                                                                                                                                                                                                                                                                                                                                                                       ɱ��C�8+�b���AH�����(2,36X��':Q���.|ip�tx�#�A�E�������E���� �i�o�Z-�
�	��K��F��R���?�Mm�W�D�e��M��]���1���+q�x�
S��Y��NG=އ�x���2����i��Լ�+��J�EFa!׼%϶R[�+�[Z|k��M@��-�ʓuEd�v%�½�=t �m
�n�,N�]twQ����w(���T|:=���Hc����at}
o�8V@��`b!~/5����e[�-b.�Qj����x2�
ټl���o�����r<_��W��7�)w�γvn8�R�t��裚��]"��e��?O�L���;;﹆9�:����t,4�c��e˞���	Tl�5�/4%��e�5Nl�.9-�#`�����f��+�\Y𱵻N�f�cz:��ԯ)]�xȩĝ�.@�M��M�{G[W�H�T�b[#�b�&�<��Df�Ql\�            !�͞CA@��F�|�󾯿5�T"J����S5A3�G����@Ջ������:���t.��iKŚ�����\����Nͽ��A�����J�@KF1���x�2++�+�Q�7Y<J�w$d+�S|/.f?�B�*��pv�A������ȱ��/�6�_	��	���Y�MEA�@
���I���T�A$:ai-����|7� ��u�`|������?��ۼwp	��N�#���1�">�/����S��(�0�
�w��ިj��e�L�D&U�x���ݶ���e�����6$:�4M�|'S&��g��.q Z'�����R�T~p}Ǌ[I�O_W��з�1�Mt��;V����!�͞!b�P&	�z�����ʊ�i #$QA�I�X2�����Z0����z��ͫ��g��O�+㍙M���qWH��>� ��Xǖ�$������Lހn�|xNe����4���	���.�>�"֤�}���xK��ْE�XG埫~�=�=%�딄�I��99�D�x����J<��ngH�V+B�w���t"n�N(+=`bB�բ�@Y�Vׇ�������*1��{�ů GT�1
�(eװm`��vM��� ��1T����Y�:�R���wm��\���e�
�����-��
�M *�$.��	ڥ�i��N�7"v��b���
�AŲZ��4�;�!��'�������!r}�|��LtΆC;�d¦�+̱�9�h
�b2��P��թ�����@����'q���V<�F	�t����GT��5����f�`~
�\g���Ηz��-Nhx��#tM2^���=�ZR�q�S:�ؙ�H��	*nCþ�!*�e��oOI�O�6�ָ������=9�A��[R���$�h{��{�@�&^ �1��DM,�mF�8)4rQ.��E�|3Ӏ��׳�:���h���ɒ�
		��r��G�N�!\�<@���8��$�(�<A�C~H����걲��C���R���4$ՂXK1~���G�*�/&��3�/�
$t���>����:�C�:���S�h��vډ�=T�ҟ�E����K�O�@���c�)�m>;je��?�w�I��+W�v�w@�5�����)�����N�8���Ndo��r�^�ԅLH�j��v�ˬ�e��W��d���ҏ��ZF�r8;Qj���0�1�����We�OڥEr�8��]���G@���mD�fpT�B�=nWvbk��7��Wm���6�<MH��Em�������%F����O>�P�M�ތ?lm;EC��
�T��4T���U#��c:Rc��85�5�Ԋp�F�Duv}��toh]��ؽ
F){�+L�G�Z�}����}��;���!`l|\��V<�w\��
Q���1_���:7����D>E���ObҊ��e�¶XUW���^e��:2sVڂ?~��rPx%}�/����.��P�T<p�HW�Z�Lc6�O&���.L�P�h���lN�A=���x$�o�F�M��8����`�i)�˾u��w����9����=��͎�*��7�3�����h,h�!�]����㩳2�起z���j����ڡDm���s�چؽ��b��~����/���j��_����k�������f1��F���<k@���*��\B��85?є#̽t4N���m�K	vXv�z��Y�7�c�av�[ ,{�|xg���m6(_�Sl�}�՚Ts���;�Y�r��$ķ-�97/��bs��7�M�P��i�v�>�X����}�۪U=>���x�#m����uq3��R�9�i��t��E����I4��@�P-K�<�^���-m��8��n���o.kh36�Z���(���������Zʶ7�<b� K��3�2�o� ���O��SCm%3$�K24a��,Zw��7SW`�bn��]Y�,p���,¹ʕ��H����F�3;�	�|`��JT��� ��~��:x�ݲW����0�%۪��r��9�l�`fe��������̪�6�A^C��LɴN�v�R��x��\W˥�J q<��6n4�~��0�)��h'����ኘ��,��S9,_5��p�R�
�19���K=g&�[�V���j��+B�i&2
��ښ��C=G�����b�я��[ԑۘƿ�$����
����
1�ѓf���=@��ڷi�l.�yp�9>F��:#h�&��J�Q$0��!!�|�}�&~s�Nv�/��|��[��*WmuE��q� jT�XD�̜[��W��4���2O+63�v�?Y�=-�&�/���'�g`�4��|g%|�$���4���zz�(Qy��*�*!��.܏X�?#���<�W�@�׽�xgY_��J�	V����� //E���`����<|�G�A������.����D��~ׁPa��_[�����*������f��3c���^�
8X0�D��+o�a�6���*]����va�%{�f]
��S!��GICJ�6���9�KP�����B{����ER��_~Ԇ�4�E�X�B���E q;rR�B�8���=V�m��Ǣ
2�OwU*
K�%ʞ���%�<��~MR�	�@2�U�VUe��`�I�HN�
���w��
�?���L ��E�5��}�yrK�|��:ɬ/��
k�\�<	��tYZJ��b��0ZDN)	Y�8���"�Xv`��^x�СE�I����9r��ɟ~<뛳�C����U�+�6S��B4���|�*�R��hoa���~g�����Qn���pj{�F$Z+A�
<r���Ny�Eb5d�
�o;�3_JP�c*J�_Z�Q����q�{޺�!��]R��[J����`Eb��� ���KԢ�T3s����������o'c�����Zp�}��5)�QJ7��G���I�B��1?=X��
�já��}�D��Oz"�MV�L���"����y�»�	����ׁ��&#d͚�T)�Q�d/Q1I8"��n_�h�.��x�h�%�>!K]g�1��N�z�_��"=J��gW�K����E֞� �[l<{k	���=�vΣOz �*���o��c�!Ȑ�Qk]����=w�~c#m�g��1���ϹE�Ph�r�a�p��od��p9#��ސ7�b#���鱎���$Yn��u��d�ᐸ!7��E����2vl�瀧��m�4�C/�M/W��`=�Й%B6v�N��'��l&�9�S�e-%��\v�k�	�l�i3�����'T� J��{����^6I.Q�V��;���%��&�΋p}O;~,g6҅�Q!3�>f�n�M��:�R����FՃJ�+���C�T�Z)*���=�vt*CC�fk�
�E��ܾ�+�oG3ul�8��t�kǂ������� ,�,Q.�ޯ��Sd*%<�~��-�	¥��.�"�����H��^��"�� pL��7�+Ğ7��˗�a`���m�?&�Oؕ겕w��^+M��D���V��l�߷F��;��~A|�$�z��e�z�A���!��>j��hf���g=0�A���pD*��VۢSQ��S��%q%�8�4T>�	R�d/��������4�N�W�Q�UUϟ��T<#��yx/��\+��H�J3r(LH4��$��7e��[#1��:;��:�]r���Q�ъ�pQ�+�x:�]N���PW�����Gא?BV�?u�2�:4�j�ο�8*^���N}Xy����>os�_��oC�X�2p41يʱ#��?�Q�;��,E�����#��*n���q�l����poo�g����ATg�R*��A�za������CY���V��\�x���!���cÓ��D\���h�n����F�(�|�R��/�{���/DqJ.�k�|�Wx��
�_��\Z��O��á2��Wx�'qq���Q?���)
ۧ�G���%(i���`L��Z�,��ltsH������I�m��-���� "�T����C���� �c{��^���mx�	ʝ:qN%���헫Uz�"I����Z�7%Y	Ϊ�NX���$�_'�Nn��v�������1]������P4HT/�A����ɫ��~z(S�
��d#k4��H���8� ����)7��MU��s��1Z�Q0��&~��p��}2���T�gaصC̒�+d<��e(��Cft�D�6N:�J��A��fPl�"H+eB=�:��S��J����ج~d�8����Oo(�x����� f�p>?dſ�]x;J�g��*~c��'�_}�ׯ�Z��-�Lr�!�����L&��}�!�!��Ϙ��T�tX6T�,�y] ����M�t2:b9�O���IX_g�m��7�º�RX �G����x��<��n��1v��T@�cv�8�茆��X�*H]?>���:��?�F� L�MC��!���s-��.
*5S:��Y~�v�,�WO  rI&�ܼ��@���n	�:��͇�y����
b��l~�Lk�,��C-��~e�J���W�5�j��12ץ�&y�������$����
nʍ�y�T�(mYy-L����L�m��x��� ��IP(R���`9��Z� �sx���5L�sa����hXV�&
���{Zz�ڟ�A�W�L��E]��R�.)�$[
���R�5����&XWj �V�hE�5a��%�F�k��1����g����:��V:K��(�'˴���4K�%|��vR��	7�e�f!58ƌj6K����$K�6P:�
~�H� �����T�
�j���ط��?�XO^�;\^�u���Qi���~�������T��^&ܮ]�t6��*�a݌�����]VY{4g������.���XK(�78��ygق���j�/'�&;��@�a���+���I0�sf�U��`�߶��*̗���Y��x��:��D�y6�T��A���
�4l���Qͬ�!S*B�Xq+5p�`����Ε혾�fU���O��w�SZ��p������d�	�3-���Kf0�NbY����0x�R�aF��1A�{��m�+�o3������X���,k�\�9؜��=��K���7��w��
SQ���r� ��`�ȽL@�}�c�-ZL,���!U����`�W��U�N��l[�0���A $uqݨ�U�I��]�a�*��y��^b`XZ�c΀�<����^�4�ٳ�]Ġ�����D�S���s?�]��m�ު��6�Nw��h�]�]�>���       !����2�,B���}g=]�⮜�UiR�D��}կ<X��@�Hcu��v�[�qY�OԂ�1@�C��[�'��^��Ó�De���W7"���D��Vy�C2�r,��.��fte~6を+ov�sz%p�^�Ƈ(a$��F�����iX@����+�^��ϣL�`�H�ST�ִ!C�LK�ߦ^���YH gC:�����ʪ�{�
�I��:Sȅk}���?�T��L�?��t(���t&�R�"�P�� 3�<��ĕW8޼{JY��c��r�/�Ӻrj� ���q��"�{�=���;�%֦Y[`��2�������j��G\}8�=00��s>��t��zu��U��E��t�~&�   LA�SS6��֐>��*c�1>
��_3�T6v������L�����G.��#�T�SN!�%���dVhQHt=�P��@r�.��l!(]H��ί�n{Z(��EP#(�I�W��>;��G�����>�>���0<K6�R�'��<@0uO(�i-����h�H� \19���t	�w��)��tv^)�-��3 ��%W�7��q��	�ة�ȁ:�@�������a�1*�ǩ/���£��E�"��
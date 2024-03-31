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
pE��5'Vғ�߱|ˉW���?��t��2<��^ξ�C���@w�9a�y��f#���x4�W=^N���"�nʹ��P���/5��jF��Y��"�i�FD�5y��dA1n���j���d�R���jy^>,�ڙ��1SfO��k��(Mf��PA��1�R���E�)��4����N��coЕa^
&�'�����|CO�I���l�v޹�ʿ�Ƽ�;rCt��8���E�	Q=ͲL3O���@a[p�`!��i4!�خ��1�^'�� Ҩ�Q��b�َX�l^l����-^��Gu�r��Z�����#5�qEKuw9 $�{�~�K���ni#b����B� ���mH�#�Qȱ�94z��z'3��9ɰ�j�����l�VW��]��=��K�Cl��'O��S_����}���Wr����p��;޳�]�35;����'��kl�{Q������Q1c�os�2���³�G��Z�^�'�[n����>��N�V!�qZ-������%��5�+�-1R��G>9��$���q�� �1h�,D���?=�{���<�T��|�O4@$�_�P���=�sR�)k)7��q(3/�ԋ�waS}�-Z�g��b_dOs#)V������\��t��m�R"@�N�gs8���۾�ǡ��?z��%]��&�V{��S-ߢ�Ss���&k�\d;��`�������sܳ��	��[��fc�⩼�V����UE����}��W�~����^����ٍu�լɩP���
�>�|Ʉ�@%�t�-c��H��,��V]C5qt�b^��^ ���`��*����Kag�L�e+G��mV��9;�z�<��'1�!�� ���[�М��0��C4	�Y�)]�WG�ט81��88�Wx����#��8ȡO���<���z��l�պ	B���Y��ݍ��Vtg����/[��dJ�tcE����8w_s�P:��?�Bs�e�Pc�V��.�=4ϼ���ݵ��a������r��'�S��;5�ye'�X�`�I%5xٰ;�3BW`g���m���Ù���~V�F��>9��෡'�
�}D�E�a^�H١ )xz�0��~a1Fܾ����G蠄��T�`Lf�]A��,��
��]PT�����R��ҏuFӠ>v��ֵ�a��i!�`�P0���WDq�������(VX�$�`�d����zn��� �J��h���1)�@�.6cU�։$)�Ϗ��dȁ��������B���S擐zG��s��C�����Ճ����D�6�^p{�!$�Gp-�rf��r�;��hP�jq�B�i�ld��̾�������?�S�Fn~ypJ�w�r���H&���g�=�-076B<G�ڦkH��1��R4TﯣG��N(����<7R	|s���H9��0���Mg~�C$���,�^�@"t3�;��r�?��F�������>�6��{��[79���zrQ�g�`jT �.����SE_n�s��kڥN��A�W�ЏT���ǈw�]����e��}�l�b/Mh�^�Asz��钒�6Jyt����|�,dF�Y$o.�rG}뇱�e�8͐���P�)m�7pl�M1���=Щ�C����+?�Z �xÎ
z'�_牡���,�<�Mk��7J�mN�h����1?Sܝ_w]!0}��c�G���OQC�3{����2l"6�	W��0y��Zy8��F,���=��IM�E�d���ƣ֕ �C*[��p����N���O�7}=��`�`��
l�k�a{[�@vr�䳂��ǭĉ���0��#��i��.�����K|�r_`c?��t�E׀�����%f�	>�\�I^�*���8N=�Y�=�mg�-��MKV�By�i͛վ��}�[��`�,F�xH���$����7Y���hxlW1�q,�y�v�XW�cc��n[��ᱯ�n�<�	�n0��S�
�pZhᣜ��{�ȏ�O���C!�Gջ���7t�н ni���5����%M_ԟ&��tsP�����������>�����!��O�Y�%Eg2��H���*b�n������r���D�8�����&���Ao�w�t���V�}���.ǿ;�����.�	>�m�5�y�N����8y�4�;�S:<R0k���n� -8bf6}K��g��Tm�,�����E�M���}hz
�����.�h'H�eQ�v�ZPu�qK�K�5���I`�trȐ�D�����|&���O,3�P�#[�^䈝�%��S���:��물�J-I�-�h� jL�WfO��2���"u�n��^�]���qqd�֏�%2�*Z�&Q��R��A;%������<Th���u��vp���T$�/n��Hxd��A�+���9���s���?;��$Z��bBZ�3Z�u����oT	� U�+��M�����	�5{����v�E9$D��֮� 3�C
������i��V��P�t���!�wh6��H��r_Q0*�Gzk�	,3���U��=HM��Gi��.�����̟�����&�s���-���>a�Z�L��r� ԉ'g7b0�}��\þ�֌I�q����C�j�岒��!Y��s�J���߫tOH��=�B��v�DM:B� G��iA�K9Ñ"%�Q8�iHȎ`=�_#�D�sN��bP�1�u��|Ϲ2�x04�u�4i��<}�����4� �����$��D��2XNO,�8�t�����w̆��ݽ_��D?���^��^ے����Mc%\�/^��iz�r�r?hZ�j��6$-iaf���?����w4����n�8���~�CA�Iz��i���=�8�v��7J[)*P�������b����X�Z��Qv_����+]#{�by%ˌ<�������\��� ���a��C�`��zv'#0g L�����H*��� dV�	����H� �pXtHH@��@*��4�'�w6A����[�l;m�s�>������;��]���}�� �h]=�	��4�\L�m�?T�!N�*�-�IXQ`ݱǨk!�5l�UTٍҎ�����W3��8ҹ�H�hb���w`�x���R�A�z>��d$`��]�L�X(�é[�q���Z���*��b9cO丱w����}c&<�����1X�V�ԣC�Њ ��{5"W��8���J�jjp��ڍO�(:��ͳZ� ш�IĔl��y�1R��7K��7%ʟVRٹ�������ꌻ �^�}r7�+㋥�k�0k��{r%`������9g��������]X������,3�h�t���S���i�����d�<��B��̪3F�&wp�7_����CuD1賨�z92}���vX�=�`FZ;'̧���J�ŧ/�'C~4�ތ�����U[�?{l=ʋK�y&W�]�P�k/^2�D�������,�����Ii�=\�W5:\�Kg��m@[횈�Z����D�&F;���m����x�&Iv�����U�b�%}Y����"!~L�|5���f�>����O2"� ��=��E����;S�r�j�F��N?��>DN���y2���z�%����ڵ	��ʒw.��kSF.e��
��|��]��T-�R���,�I�7m��r�x1r�
l;����Ӿ��!�
� 㿒T�BR-v�C�h�@���2�����.�$�9q��f��F�f=��QcsF2k��E���,�y���^�P�tP�x�#+%��������|a~�5^\;�d�O<>����	�28�j�330̘�)��y/Gx=��YE�{��AҶ(�J4�:�&A��C�t�_�tfm�7���)ŔD��:��Fp3%��ʦ������F�<[��<Q�:?'A6`�0VG�M}	�;tʿN����!�oV��ju�S����_�4�n�����+�n��͗�&�V�i�v�F�-�A�Q��@�v�_�N*��j���-��D��jXw�U����q�_I�)�S4�޲��7�βv2QF�n�A�KU�ѝ??[(Q������}��91���R�d����R�D���+��,�┞�7��*��r�D��������?�,jE)�%��l�$�&H�t�XMB*rJ�y	>ܧ�e�lL��ƙHK���~G�$K�R&����G���g$��/����<�O'�� V��2�|�EE�~��c#S�ϟ)���2�����d�@(5dc��[��3�$V�թ����s�z�� �ht����+~(;D�����a�?g6�T�ʅ�%Vȹ�9�	n�_0Q����-F���%�����c�q`VL6�d�F+�9g&ZQj�����N����:�e��:wH�?! ���Q��t�}s�T�Rꏎ�����`��#� �J�����Yg��������E���N
������*�&[��C���"I#F(��q�4��	*��HRf�q�"\����!�m�O����<�p��&ζ�q�C��Ma��t��h%�~"��N[)�T��Nָ�oQ77�R�x��⛢�.���:@mssаU��Ѐq�����C��֊{Z�2r�>u-��n��!��n4��>`��-W�~�8~�F]�������#7�������|L�ۇJ�9�ʹ�w���ߙ��!��P>��,so�jV�����-����bǆBi�:�"D�y�`�b֬=Ĩ�R�fx��7�B,R'n1������K�ll`ƍ�'\^J���Q��|KS��l�sߙ��A&��H��Zde���OtO�S�A-��Jҳ�S}�_JF��k�k�Ѥ�Ae.Ww^D����(�;6������ 4Yk�!��{<nb�_�vJ�0��)�{4ō��L�I��G1p`���C5����_�^�i}`un�6G�,"�.�&�΢����X|̍�������A�2O��?&�_͵e����@1Z<a�~�6�Y):��(�b�������$Vf�)�dhT�~נƊh�B��8ȵ�%�� e�ة�!�4�͇�71���Ca��M��������D"�z��]i*9��7R�;-)]��F�`���k�oYLG2B�&���VG � K!<`�-�I���ŭ�����h۟��3fa�e���@=��{5�K�X�5�^:q�H��w��0}Ca$ߘ|�IF½&˯!��B�2��	/�t������O��ｈvl�|��t�B5��#� S$T�ȦNL�o�G�+���ΠkR;J��<���x�[\�-[�Jc�G%�@�8�[k��� _��t�}��nMfĹ�{s{#r�B�
2�TXH�7fI*���(�RQ
1�%�T��1����.�&��P_FNa�J�w-X�^N�Y��aOi�����X ��&`���`>T�ձх}����EQ�5b��PC1�����<�Tf�ڷ�XU6!7:�q/e�;�;�)�+�;��3�{uצXS�(�7��f������	�V��jӏ��/��5���x��Bm���!�Q~{dmn �fo�~��uo�r�ό��D�b�Cr ��rL=��|�n����h��Hz�9�
ND꒿N��L��6�B1�̍5zC��ꯙgsͱ���H�����-&�'HX�-���܈��!<H��%�Bn��y�]$"*��)�����J@���H�1��L�9�c,�k�AN+�/����/��h$G�/���p1rǰ�g�Q��O�$���jǒR��)�$�YY�T�!/y��{�$�0���r�*�!W��O��<�[�-A\ٜ��W�w	r�`�(
J��CF��	S5��5_�8MJG���۳��n�[���`�r�~��]����&\�\�8���wBp7i������S'w�-A¹��;]��d�N<�(C���h��ꌭ#�1��Vʀ$��i�×hǧ���G���R�#5竀�~e�zObN��k�kjVp!��h�B�r'O*���K�t�t�0麅��m3�g� dl{��uvj�ƬQ�����m
p�E/��f鑌m�'����`lz���23X��@���)No�E|��^m���_јh���Ոߓ�C��Ϛ��P����sP�	�j%|��Ey�<��[?�tˤC�6\�e��/2�Ӭ�vg�K��Q֣���KC�?�f��M�m��s��R���
�Ba����koO�l`,�e��u��6c4��U�j�B"}+�va����k�����x�΂�g�X /�gD1�����E�X  �A�c`2�g8���Fj�M��ݠ�E���L���W혴�I$d���18_cu�� N��E�@�y��Ɨw/���½e��fB���v���Cד��t���i~�L�O�P���i]t빟��F�:�"�`F|b���7l��)���|@��Zi%�l�{{����?��853Dl/dl[ �&�[��#d˜���L?����k,�%��X=���I�z�7��b$^g�v��ҚZ]��Cf��qlJ��o,�a�~�3F��@)U��1���m�`B�D��"Gb��.%&) = ^��ɆB��N���ݗ�{�L��	�w,7ƪ�]9�)h-G����Ԇ}B`pq��(��O�Y��]x%C0f�M�UH&}�٫h�o���X5�K�u\����b��,���5��Ʊ�ҢŦ ��\�4Lu.���ƾxܲsM$��wS��C/j;N]�"��:��|��=��'6�T"��|`Yl����C�x�!ا�A��.�9ͧ}�)  v��(kdژ�ð-$���=��˂Y�&D݂�� I�����#��\`��`|I�uO�]�O���	Y����CD/�I��dI)��P�o-�����cȌ@ ��=��C|�_�v���غ:����8'�5�ͩ�g |�&�F�F�)@�JH^p�"s�7�7EM��Q�����(	�=c��_�YAP���̈���_��T�^{_���P���l�������l�0����xDy0>���$��)�2my��b�Q�רA���S�����SO�}�z'���̝9���&�S�t�bQi0��5�g!���~Wcg����ק��좣uuqj�O�|�BE���T���}��L�T?8�WjB�06�8G�	m�e�(�)�������X�|9�	5����t e�̐����0���*Dm���N�$�����ƨ;R�$
���Յ<�!�qf���[f��8)Te�<�o=��k~�t�s#���u�ۣ����#t6��=�eQ;4��@���8EW|����F��42�%%N�OҌ����~�xnX0`j������?S�� [ by5y��/.u�%d�|�-x��;/�Wo�D#�2�T;	�
��ѨzS��<��Z�}�V>��~i�˦�ho��!��}{��$�I�=�j��y�Ȼ�]\�xo��i�t��θ����=�����L�	�\�-Os����*<(��#����B?�ўP��I"��+��d|�*�3����s�?�Wqg�]��@];j}���^��}X���,Mp���F����ƨ��	�þ��eci�DO�'�hX5O�J�-u�F�Q�o6�J�gOWv�?�T��S����CF��*!��.�N8�<�ps�m��i��'��
�n�����y������J��
{=�����Y`�_MQ`g�����]�7�Ρ��$}:	�\�E tEMw*�9��^w/��g�ل-\%9�b��XI�0o	D��{�r��uT�u����ہ�ϵKG/G�hx_j|�K�W��4�*8S�����mc�vZ3M���K�L��M�-��C�'\�{��z���p� 3��|��,n-����=�W$g+��
�����W���g��ֳ�
$)���`���j�m�;�Y|�`xx���UxN}C�pڜT�PWr��fsW��|���#>�?(s@�x�����ū}����G���j�X.�����W�$�S�)��)�Wn�sO��ٓP��;�����H?���zL�ö����b�d����-���4��vd��V1ú�HΌ6����3o�D�w[ ��4u�|\�LжY�Pf���_&j�����T86 hM�i<�:��7-��Fx�R!�D�k�\�����i���p�b �r�,�[�����b}b]ؚ������f&�X ��8eWN�j� ��dV�=?��6�k�$�aR٘�Z�%yVY��٬�¯�e��U*�m}�R����c�����RW$`}=���}���֋A(:���5k�� wj��M7TZ���VZz3��T?uΥZ؇�y9]���\��"�p��{����$F� 97R4�5�u�c�����ai���%R����G�xW��2��t/	�D�-�ŕ��@(�Nq��g�Y��[o��<$��f�$��&��Ix�K�]�_�;h�]p.�M"dzT���l�$^��-�d�B��z�`�c�+p��e�`�y����r�Y�!Ѭ8�-����m����0O@&�k��SS��)�#�U:f�u��L�
��6?S�ѕ5Z+{	B��bN�c�c�K�ݛq�����5Og�!t6v�5�����NM@�-��{p�X�U��2$�y�I��p�1	O-��!O
�f)�eI��'�o���(�I�Ϝ�BQk�� �=�-�іF�&[��V|��]�%fjiQa���$��76!��ÿH�	_X~d1��O���Z%��j�"&}�S�C�(���-o�͹oRb�荝2�ݣ���}S)�:�$]���z��g�
�&��H&� !�(Z�B~�ܚ�+��D������'����*�;5�Q0#��t%и���|��VU`&�>�e=�-�D����$���|�+�Y/_��<�ܝ\��g]VK�?��T�;y�g��<EO��uF"g~�)w��/*�q�����w���D�q�º��:�
QC3�2�u)�� �5��2���|��N2ᒅZᓊ�'Eq |d��^" �44��E]~�U�L��P��ul���a�A�f�t�Q��K���ty9���f�ΜGOb:E%+QVF�� �i}�������F(]C9:V-�M�uD¦�ʑ�ʁ8����G����C�gh2���R9y@ҡ9���$K�屶H��������+��i\��a��	�=�F�>�!�[�^�8{�Ѯ�w􄮫Z�]PxP�K��{�'�kUrT�l�>ՙ_�7���DK�����J�V)�h�/�����l_���o1)�d���Tg`?�cb-���t�xn������ !2FD4<	���q�vؤ\�rw:�Y%��÷zL`�&m_��]u�h�[�>��v���V����M��<�#{��T��[��6�J��+��e=-!�Ѣ3�k�8��P��f�,�m���V�J��CF����r��ٱ2Ť��'6vwY'	�Uo��v3��_��3Z0��0b�y�J[�X+|�:�0��52�ۆ�5�������e�����O�����R�� 3$ߺND�q�&P���l�� ���:����W�\�zk��Wn�*��<�#Ͽwг�ˏ]`�U+��BZ�.� Pc	�b����DѨ�c�W7�ˆ.�Җ-��.i�죾��(��$#���wNu����6,k}*b��R����o�l<�� \7�3㝻�-��߼��H9��1�a'��Z#�?'�:c^X\�l]�D,�w��s���O4�w��%��� ��O�y��惌�[��$�/�48+�d$��@v).�ގ)3V�3��	��y���k(��8�y?-������$�f�Q������DJ�=w�t�*���ff�d#�t��l6:p!v����t؃�w������c���A5TZ��@Z~�x��������yrVJ~,��XΗ�W����抹[\4���bi���� �<�̚=(��
p7X�@�(:>���˳GW�`�o�Fmj%f�� Q]˜ �Xji�*�/����a�X�o���T`󺧀F�r+C�R+{k'F��j�o��H]2'
0<���5+)X40>N·*R=:�2�2!Y�!5��� �7��`^zʳdA�`ڏ*8v-hc��$�^Tj_>w��PÂ.������P�X��������>v���l�Ot�� ���T%aq��h���2��ޗW��a7�.����5nnԜ���8^O�h��0
	{�ǫ���U2ĩ������8�����ڹP�X@��2%=���]��+�3��ݰ����{�]&"`E����anv%.˂CN�A��@�?2�%H�*�<�![�V��:� �c��-A]����^"K�#f�Dn�����-��=�]�5�*��a|��@ݼ��=���V�ѪCP�<�5��I8�c������� ���P�y��nD�md����A''T���~���=�P�����vAYv�4{p��#vB>n�?����������{ܗY��fu1����M?c���l��u5X��c�W��$�i3�1i���ܦ��/�e.H�T1.
F<_>;>���(�-��hhC<|C�y*/ L/�4���@��a�����1��T���j�ܦ
;�`ʜo��Û��b/�F�9���C�UЕ\�z��e:?�a£WBu��R1��K��z���8[cG+t��d��T�t��y�����Ρ
A<�����0a_���哰^�v�.� �ᥰ4Y����H���BV�Şq��^?�m��*�p�,4>��_�į�=AWn��YZ6<�Zd���
�&e�3T��ɧG v�mD5�̦rZ��{ȝ}]���y��M�I[�Pxr���`�_�#����/����~p�6'r�+�� _��BL��#>�Q/�{�1`x����tz�G*bFmS��[�2S��.�H�ȑ�2yϯ�7�]��Jrİ�iN]��"��Q�A2[>�g[�hY�4�`��g^=6UT�v�d!���8M�&�F��nd�2�+�/�>�X��hT{Ӑ�R�������_��U7��-���t��� -�?����*�>����~ ��~J�vNb���"�>��l��즟7;�rDm�Y�aʋ�f��#�ve�痻�w���sT�MB�2�^r�q�-����;W��b���(�a�i���`��� j�O�K~W����y8����0*m����$���t��uv֝�zkj�>��2zU/��^��rMs�G���]fy�1H�����F���r�$ܩ����	+�8Y<�HCp����lW�(���vq��#5T��"-�+D'y-��l�̊w�t}w "(�|���aG��B��������g=%Yo$һ@�!+Ѥ ��-~� c��Z�O�i��:[�R�n_���W������;:qÓ�m������L��b�u����:Lf.w���<wzѝ5D<ֺ�����џ���?��˹̈́:aew-������J�MY��
i�M��[%Hb����oS\^�Q�ˡ=v��Џ�)�ء7?f[�R�����qr���Z%|�ƌQ�^y�j�z��}�t�هT�����%:b[�%���YB�TK���,�����D{���¯;C�b��w˓��5���#E�Y�_����D����@����6b�A��٠i�u��g�'޺���#���7��l黹��~2pK,��H��z�5�� y��8r5.-Ń���Q-(!P2�Y``� @K�C��u�����g�.�e���J�&���i������������;s�ɳ����G�M����*<�x�*t��9�+	�7��Ej��{�'3�d+'L/c�f"�IgYDV��a:��@���6�| n���%��l��KD����l��ʄwZ�����q+yk�c�RB�b�bJ����V���L�Q��_��C���I S~���������4�dMz��NW�\EK�kԉt�~�4�)�)=�gB�Ċ�f�^#%�JOG�'g��k75���״��&���*w���
%	nd��V�T�_LM��}rѥ���2��ܞ{�����;c�H)I �����8(I� ���!�����b���F�P�2�՟��`ҏ��pgK�"���#����-Q�{�p�<���v���"d ��\�� ?c�)K�C����KRCV6ыvh�>����P����w�+�Ai�77�y�>q7f��+xS"�EQm�u���� 'DȬ�K�S�bǀ���2�=/S<Ydzހ��'�]J[\�Dg\g���0�r>������z��2�	1l��t��?5X:=Tfܚ[�Cԥ\֥�CYxm�������͎�}�������J�D�R޺"Ƙ
�Q��Z��x#V�>��~�BLD���	'wU��:��d����	H
�� �S�ls�J����~�*�V����Z}s���B��@Bj�+�Y��o�xij���Y�OA�kC5���9
o�g��5ŏX��-N����8���N�@m|��}v"=!,���Κ�F���J����o>:T�?���Gq�R�!r&��$�P�ݹ�a�������04�����s��}����|����\�칫i۰���v|������+�'��V���\Id�wb�w��N)�뼒�~��tJ��EL��D��_չZ7��vrI�/˟O$�u�ܩi�\���U�:o�Pq���Bj�{��P3�?d�T���!���b|g���Fh��0j�AbB � �A�� !�Ͳ�ȁP�J@�_��V�j�mr�XAH��,�5����ml�mh9+�"h�O,��ɹ�$լX�0@� �V*YD���!V�qZ@(K�rU��%:6�J�Or��*���* ��?׽`&���!Q���l����ypIη�D��/Z��Ը� �r�9���H�V�D���C�dgS���&CN4�{�]�r-O�	#|I�)�������!6��L̩jY���@��C��2�V7x��{*�$�a�-�|c�η�������0����A��A2F9g�f�}��r�9��U�5�G�:�Kb2�̷B~7� >��|�KKf�K0ze2�/��x` D�I�Z����z��<d���< � i�!���A���r(
�� �z�o8���fW��B��Y���R&��� .�yޏޟ��'%+�s�r�۶�����D� �)�l�Lz<F�����~��+s#��] �c����"יZnG��ZN2�`��A�R�[`��e�kl+� �F�2�@7�=�����vj^����A�Vbwi6/E��]V��hK�+�XZ9���ڦ" �xW�z�mQ6bT^�9k{Mt�����U���A���V�&J�M�Ca�G���]k�gq��[y�xa\��v��D���4ݳ������������:=�:�
T�EcL�/� �?�*b�j��@��$���� Kⳇ�����aG�\���!�՞�¡A��6
�Q�^���{�JԪ����Z�UZ���ΕjҚ��X|�T���x��0{��/�jv��u���p V�1SP����d{��H"��A�5�벖r�a��ц�F^짓N�J��Ia�S��I;N�t�9<F�DMee�B3iM젭�����H	CS����[�������.� ]�#����R�!�*�cd9?� a�,,P�t|	��7	�m&*�H��+7�s�>����XU�@^W|�LU@�4���/��B�W����� �Sq���"�|��΢����]9ԉ�$�Al����MWq=��AU�+U[�7[B�r���*��A�|8��x�#}��UW��A)<�僔p<�����  A�c����F4��ɥ��
x�C�Xk�4�G��A�~Sw�\�8\JR�{�X������>Iǀ�`J�1���5�c���;/����
�U����*���S�e"&pDf���4����"ꛘ�G���Xu#�9ֱ�Ppa��L�|Co쟼8���7��Mw:p\�B�=U$U���K�e$�uZRM��0�j�f}�E��Q�oӒ�Z��ޣ��9��ŉ�����m��x$C��x��RK���a�]��kS["��@�LI9�&���d��Q�����?x�*"��ڧg�'Βtx(���֯��a��sT.�03��4ؘ����C�����?&��7Nbj��o�:)�.V��'כ��;gP�0��4��q��!�׆��V�HI�(U�6{N*xu��]���ZQf��-�G��g�ܺ�I�����O%��to{�)�r�$�K�p_ıå�=�����}0Jĳaaʗ4�U&*;�,�c�r���"�p]?��@��Qy��	}�7���Rf�2�V܊��閄�m.�N�_�ǣ�gO����ŨJ�+J�**%�a��M�]G�&5',;?��C�eg�k�&g���t��\,n�]'�=���S������[����Hm�j�x�V����j%���>d�v*ow)��'.��ҥ�󺄻I/���.�b��BO��ت~1R�Þo�nͻ=�o@R��-}1;*��yf����Q��Ov��1U����Lu`�_�����TA@�h��N)ɗ��<^�Cm�_&�²bA�(��@��N��-T9ⓑi[r3��W�p�a���C�� yzX��yh�#�K��6�Ѳq�݃�Q���eS.vOQտ�,?p:�ZEC|��@
G���}h+MC�mE�x�eB�S"��*�|.^�e���ǩ�s���#�S�i�%@a�)Ji��5Ő�nV}�`��ͦ��� aު��M������t�[3��NQ�9�P�m� �^_q��Iҷ(�[x�� �Q��{O	������g�}LA��p���g�*\����:u���J%6�"5��;��7����i��QSԑ3���fe���Au�Ǜ>�=\']�
BMRq����)xf��j`�M�g���W�e�ȫ�.t|�����,3�1�_{���]�R��_���ځ���r�s��!,��E�oM'�v��O���?�3�F��H���D�������T�N�D����H���K��9�rM�oL���"b}�Wkc���}-�����լe����d���~�����̔��|�,k�?��G���sDO+'�C��y�A�U@�:�V+�Ga.���E'������Y�	L>��Ο��
��ǎeΖੲ��57��#/���jt�����{h(ij�3�srN5d��u���j��0y����VA�!�� h�Q"qU�3<��;�����bq��hVH��n	�4j���E�60��Ӻ�Oq�4��c�d�����3�s0;&�s�	�@��s��l�ƿJ�����9���pO�4���%��i2��z,����d�|����b_&�*J��k�Ka8zk+�v>�Z�U���t<�D�k�� ��,^r�NE��ӉT�~F��+$��/ª��_Y���ց��f��A�n2��Z��(?2���e��e�8�l�Hj��7\5k�g�-_�0���
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
'��4�=�-I�qB�+o��E�%d�A7��K4'��Q�;��@�-;��}����jwp�h��<���A�9GX-��t�(�n�~d^X�hp��Ԣ����y����n���ũ��1�"��-�R��6���j�(C�ep�Be}x��������6�Yd�n���G:���	����h.H�-��I�4}��&@I�z�)W4��F�Vt�PD��ND���A��vʒ�,���]�Tͽ1{���*-���Z��$1���N֣�A�,�R���l�a�}y�e}�hu(���$��& 0�}ms��$�*��t�9!1J�!�S�w�����bgI�([�?]��2u�/�tt}����A�cT�q$���qRW&�+4���Q�b��9�s�Û9�:�&����m!F�!N�G=g	�vQ�������"N��&��v��⌿r����E��Yɇ���\�X�m�U����"��#8k�sD�5 �X-_�t�y^���vD�EK�ZO,����%/��d�m�/���v�+U�	�@��V�#��'���C�$ql����cU�#��n�.�:X���`���<'����f&���L��mâѩ�������>vM�7�ce��S$s���T�{>[����?}�ǡ,H���
/�zg��N�2�g��ډ����Fi>R��0L(a(��fa��I���#}(�:�e9h��7LY.�f�/u�.e��=hY�R���iU ƨ�c������D���2n�H�u�s)����.ϒ���%X�t����C5Q3t�%b'^�:��,��A�U�cMҴ�69�7)X�`��æ*��~���jV	*��_���&p5���bP�*��A����#i� ~�}��h��w^�F�{1g�+�wU_8Q\��9���v�O�M�8�Er����}2�Ϻ8<C�R�YmG����fFq�J�׆����<�q�OJd�o^�ѣL���}3זG6w�֙r���Tm�o�4�n��Y���P(�1�WQ/���T�-MJ�!��G�̋.("�.HCQ�b�wpu������	�9(n��Ɨ	 I�`�v��(�5�\-��ک�>�ё
�}�,���dh�\^�t��m�^��������O�M��e�����k좞��+�� ����j������D��Y�~�������,6GM'��b��F�����������}y����s?F gZ�n�A�X/�p ����	���ɏk�����yx�>���k�!�;���2h�m��4ɑ�$�Pv�:�,]�"�t{	�NٙY0ԫ���x���u��:�pI����\X�^��|#'�� �X�)�ЙU��8����K�>2�����ت�T�>8]���7�&.�2Yg�De.'�&Ђ�ȋ��xo*#n�����b�����	^9x��ٸ�m�b�jʽ5nnR����4�Ͳ�s2sm�[S!
�����d�a�֫��%\D8t��fQ�tJ������}˪��e�W�r�z�IEB����h�8������FyN��I�G �c߂Z�ɐI��o��1�h����1�(�,���;싱�4��eR�g?��}Db}̯�e������S>ٸ:�8���Y���^��$�m'����>��U����ԥK������9a �+�������V�����6R��{=��e0           !�͢�ġ1��0��񯷵�MRoR՗J����
/�v�?ݿ��m�,����&�R�O��3Q�%��|�B\tp�^�Q��Hd�E����*fê�WEW��c2�@]?�� �g����T����L��Wf��t-�����A�	�Ϧ��_)�qY�y�eXI��Ej�U���ƪ!g�.�ԋx
0N-���w���̱�^��p���"�Q���p�6�؈��\��DT
S�[R㼈NV%�yE�G'�� ���܆\�+}AxeH.� ě���^8��x��T���0�b!����^/Uu�z��;��D��w���l]�\��ۧCQ=J��|�tP��6 -�Y��(�0]I��W���v6�;���ƭ��ӏ
���H,v�~  �A�c�	�Br`�@7���U���ޛvQn��	>��t�f�Xr�+>nvKǗ9?��0G����٣��)�-�N�_��g������\��1�4�e7�hT�1��������?�Fٔ�"�K���\���<5��m�L�_ע+뗭��Z��9�6d		hr�2g���N	|^�۾Ft�s}\�B��	/��U#YoaA��9�Of���Rv��H��1�\F�"���"�yT���**�{V�z�)���Y����ֆ�a!��\<5�կjU����/Rj"�G�=���J��(��CQ�!�O��c;ڋ3�Id�Fק:��d�zIz�2�hi��=��
����?)�2�[X 8�K�5�M�݁��Rb	VR^��� �zJy��6S~�!�S1}9�Qm���y�]�����C�ӕG���N����Ō+���?(�>����s�$�+���.Z�<��C�<���k�;��}�_-k,ʶ���$�3�h��\�jO����k�8I!py�7��� ���~���V,`��cY��u16x[*r��P>����:� �v$��`�A�#٣j��S�iM��������#���j���pa�M�]�8l�X�'��%Ԩ8
�`��z�>D4���/��R��;�Hz��O���o�tå���C�]�ku�1@%i�ᑨ�m�PGh0b�TƵ��c���9.���&�W����l�`Փ�<��Ƅ2�ƈ�̜���̇��pX J�����o����n,P�<@�M��1���P%�mBiz�¡�1���!��.���Vy�����e���,c�������e�HA�����8��*��%9�b���)��	p*�T��rf�,%'K۫���[�B�\��ӺC�F���bQ]F&��_�W���~�K��i����{��&i,��9��,Nw(O���:���u�L�P�adɰ{��?NF;N�͖�q8�
���XЂU(���is��M�KTpp�2C�ژ���%���n�|< �s��9�TԐ���0Q@�qk8����j�
��؆�A��<�����T<�Sr����1��Fξ�s�c�Օ�.w�"���/o����f��hN�2n,sy��?w���ѻ	�Y&{������Q��Ӻ�ɼ4�j�k��1MkN����Iy�#�AV�-T�[�����,b�{�e�|�w���$�W"�k kzǖy�H��u���H[8�=�n.�.��x����ꛑ�~d������/Ϩ�F6fc�:o�5rc���Cj��ݹi�zY%��I�T��pY�>?����=c�T;H����"ccm7��~�#�{>�(0
����БZ����T�):�~�m�n�_��h��T��l!o�q ������Ż��)Ԧ�vy�B�/Y;��n�"xJ�f ���R;t��E��Iu�6���r$���eA�b��W炻�u Z����$�����?f�|�..GB���zJ���FNv���Q����CL����,����щ?5�y95L�0��;C86�e��W4)*14����������)/�)��b( �K�}f�jf��/<aw�.`A��v�ͥr�b1@�ŖZ�2ޘ�سx����I�J�%�q�.�X�smq�ʐTs�ó�K/έ���I�h�p6p2�>���V���P\�����r������crN��:l������s���4�f��z�U!%�_��tw~��߰~�t	Eq73<����յ�S]�%�V&2�.��H6��B�t�T]�홇0p�Duxo�
߯P�s��\�P��K�3��;g��������1��}̻��ael����善>�����
�ɐ�uF�.Q�<�8ݡ���
�'54�g�1�0�'U���J��j�i7����?���ϻyY[{��8�$�=����y����^+S�� �Ǫ��]��dV~S���:�҅��0�h�����\��e��c���~TaM��let��D�jȤ@�̿(�K�CS�N�h�5���4�`���ahȞU�U�f�.�W-e�rx��;���@�N��@dBr۲gkC�.�_��hr�g%G-}��
��@�y4��!3��p0��I�Z�Dp�J�@�� �]���Q��;�!����O��Y)�A'��z9�:�kmL��Z�S k���9�xR�P��ޓ��f%�t,�Ԟ��`K=zA�L�d�I��%4 ��qC��u: i�(�7WHb}�N[��1F״M���%�qj��ܲ:H���<j̇�k�ۧE\�� 7䳴�{2'����Ìg�a�,�Ƹ ��	�2�Gl�>�!66����� /!�v%p�#����UX�FE)}s������}�E�)�B�FPy��fc���NϠ�^�<k�����4��W7,q(�������t�AAq������֙�0 )G��
�JrhDS���vxs�E�}��C+0��Ȅ��>R�:O��/m�A��N���8"��N�jo9Z�KX�'N�
 L�z�Lw1��I��u"8��[�2o��_;��g{�C�.�4,��<� :E�ʮS���Z�Ǫ���H�@o����Z� \�x��(zJ?�]
��s�N"��"��A�����6��u�r�U�WK�����
�3��y�D�{W�آ0�:��^$p����;���R�%X���;�̻H�T����f�J�6�<�F!��~�M��R,�М�23�������Е����z��i��h�D^DH	?��
����O������d!iZ �L¦�{�D�*ɿ��v��	�;��&��Q����{�1�uf��ߥ��s�t��Q�Z����cZ'[g�v<A�l�i��`��ʆ�!�Y����t��S�v����'�!!�dH�a<�E��w���/Q<�$�����]f��X��{��1oe���d���$5:V_ǝ)I08�^��yh�@��~h8d��<���P�?��R}1I,y�J}#`w3`�M���o�����㞮;	�r�Ҟ�'f����Q1є���}�B9��0����!�R�O�֏M^�`�p=��8�[��K�X�Q03SݎU����n�RC��������rF�'�����)_o�y��^B�2�E�/�L+���1��� +�S�w�9����;6����<�
��8"���
���{u��c;̼���T��|N����'�f����ڿ���w�^���# �t)Ȉ��ӆІ�dWtH����A,����$9���nRX
[v��^��e�'�`�4�z�cw�S�X�U.d@���G�ߔ��["�TX�1��z-�P���n�-�		��'Ԯ)O-����A���n_!��.qX�ߒ�c�����e�Xo�3\@�D}>�ЉUA_SS����!Ʋ��,���=ޙ�`�����O��Ԇ�����8B���~D{ň�w}�r_�U���l�:1�h�A}
B��d���#NYg;�����}��4�a�L��m���=���FZ���������c� �C�tp`5�%|������2�����ۭس�=�5�gG!t����������5`�$Y<�� q�Vj� h�SI�D����[Fj#�������&��ӽ���̥I���/��{;͟Cu��0�T(���<{������r�Y��̻=��g!4�֢�1L4l�(K?#$��&R������ɫ�]��п%&;'���@�K	^��/0@H�,_dz5�r&���rP��i�'B�ւ}4N0q٧��T�o#-ݓP%j�kN�����|@q���Z+O��NR�kg�̹�z(��G��o����u����+召V� ;��h}�FH��I�G�j/�ˁ�[�����ZO�u�S�(����3D��/Lg�:֭�/��zYj���-ọ��P���wm���k�<㙠w�ʌl�X�+���u9s�Ҍ�97�i�`��̗v_g3c25��/��6���g��+N����1��l�U �T�ٽ"Ұ��h�k(�|�P���9�׆�)�/`7����'�8p��S};����">���c��}�V`�!��hJJ�W�C"i�	J��k�dB����b޽ _l@}�����!�3��E�����p��}^��g�ܗu@�!��zm$G��Nr��43�Ӟ;^�$���KÁM����Q$pk%_Ź.�?IK1un�_��g���1lqש7T���{}(��D����N<�@p4��҄8(4S1x�êj�q�>��<�$3zЛfFM��_��UgH�򭓫�:�]w�P�.	r���� ��:�p�u�mr�.�t.VΠV�!N�m��w0F
@�'&4�{񻊡�]Li<l�y���� "e6s)̤����v].t�t1�|�fe���Q>׊�����XRH9��,�KU���)�v2�}]U	�{��9I��B�}�-�3�h�l��򕆎A:�����B[���H�T�(��Xa�0����c�2w���)�{��pQ,脪a㏞�^�	�"K�X�� ������呔v���΁�$$`"�A=�V=�&�U)mxf2����AL���G���J�����tQ$�}W��7����Bm@С��1�ܜ��Օ	g�[ϻ���ۜXP�8;b��w��w��j�? ʥ�=x`�}L�M�X�J�F ���=�9M,{�%��**A�=�a�>4Ok09Lr՘��L���O�ϫ몀!3�?���Sg����z�gwt)d��0[�u��'l�eI�}v�I�P2cC��F��e4��}�����nǯn� 7؞�����Q>|��o�[�����w���Q�tx����vC'D���Yԫ�Š���I~z�3�E���� 2���rjQg�7����͎��>���I�urW`vYb�>��5I�g�X.�����6l9ե�,C� VS�W9vz�[��*�v�# ��'�3�r
���ѝ�nCc�F�~����,���GۖK��֜͜ZR`p�C�i�Wn�z��]Z@6�!�����+��~[�=0u[oS��썑�#6[H����ʤf͗f(��H��S�u���*Ը�A���,+� s��̥g�ks�̵[3�b�+I�q-�	y��"�:���of�Ţ0����p��h���YT8Q���W�E&c&�40{ִ�r�K/ MB`C�zҥ<��׭�I���yZ��>`{)s!��l��*�(�;{�ʏYH���m�a��8��i���I~���K>�,���ݯm8kM�<k��(L2fd������hb.#��y-�ME�����b�r�n��}�����I8�e&m�v�:GF�h9n���g�;��)R��c��Dː���Q� �Z����&	�q%1�b����)5d�f ���˭���//Ӧ�
�j�HqH-����_�(��h�8��1g�f�ƀؔvrN�5��A�2���p����͛�}�7���y�Ρ孃bX��E��I�X�C��(�xA��e�Jv�����`�<��3 �*�]ՏHd���VFC���y�d#��ڂ��6恒,JN_l�����<6<9,:L���~�փ s�~<�r%+�*�V�P��R�ż9ɽ+_x����pZ�!���;�fJC��r�y�+
#AU�-[�݁Ƽ�Fضq�� �5s)Ϣ�
˖4F}���Qu�΂z@c?h���0뒊{^@!��Ggk�}K㻣Ӟ�*�7ϻ`'����s살ˏr��Źm�I��Bu��z(�3g)�����0$�e��%���(���A�r"������FT���~���O	�St��x�)g%?�G�i�''a8��6|H�t�R���B�ݶ�X�E���=���������K'ę;�B.5N*S�D�f[����~j˗O`��Ȼ��~�f���>eڝ�z�Ŧ�5�ܾ�,���K�9=� h�         !�ݢ�Á���%���;�f�V�Ԕ�P)xc΍q�}��vl�9�eSޚL߫,u�݃�น '%�g�s(�����Q�w�ѧUPB[x������Υ)�k��ёĴ�U0ɂ��d7���]��ѯ��V�`iT�,�p�D�W�D�d
� QLA+�M��Ou����[ȩ=�oҗR��}�<�e��AS���\�nt�f��U.5�"��D���A�d ]L��;��2Se���A�ymw�pU��h�z����W7�u�ꋗ����~�� � "	M�W�Ur��Y��X��nO�UyOnM�Xd�#�  �������$�����딻��
/9�dy�	,�K�ۻ�.�' ��%Q�?]j�*<!�;ǂ��,�x�;�.�n�\7Ĥ�˨`c���	�V��f6Y/��/�i] j(����iX�=_ :O-���Y�;����x1$�t|�	��>��I@�������~G���9�	6uD�j�"|��e|��F�/b���f:����=&�HV�}g8Iu��Sׅu9U�E��[64բ����U��g��o>$���2B P
wTX
�a*.t�Ѥ�e�ay[�NAZ��~�����m�*
�p De�+-�f�?�Ǧɶa�Xj|^�
?s��� ��9�h A;�����kW��圆I�pG\y�h�b���C0�Һ�]Q��啷�G�}��EH�`0�xf p���Mz�\O���CWD.�g�M�ͼ%�n|/3/_���s�������Cv�6  �A�[�#��+�R_1����3f�i�3!a��/3S�44p���62J���Z`Ҹ),7x�.}c� j���/�ն�Y���O�W]�տ`�q�:'��3��Y_�vu����(�-��ͺ&c�z	�4����EJ�	S_"A��?}��T&��������s-��_;@b;�%nE����o��x�߂A5
����|]ܾ�K�0�N�✐���.(�,N���viFU�I�_�K���cm�鋠�.	��.Y
Z7!�S��3\�m�Zļ�R�ھc=� �
���)�w�AG38�_�8-���s%���ȯ�h�\?s._/���G(�+�,J��#ȍn��y��,FNj�SO���,]%�Us"�2�����7>em��`
�L�}�m��dl�Vi����KH��!�g��p�Z�y[(sCԅ(ԉ).W�d�9�Ui��z�P p�{t���@S�>'�6[%(�Vv4"����j?���~�.u���#�s��tEVm��E���E�l��u��A�����G¸����}/o��yQ�V�f�ZB֘k�v���zrx�/wg�}d�F�z�zp�{MC�Cթc�=T�<�;�P�l�"��?4�Y����	���=�e!��\v��{�S2�D�o`N\�4,G1@��O�t��2�Юfe�o��&nc��!Ė����4P��{��e- ey#Cz]�x
�۴	@�O%�
��?�·���$O�kI���� Sw=F��M|a0u����8R&��B(���9���t�{��KUR�2�&���l�
��38V27��Gk��>ئ,8���ю[o;@�M�_�U�pJ#��%��Ƣ2#7]v����j�
.�ԭ�R��<�;�"����l[A��\Zيc�؝�8g7�R�È�P���Y"������<9��X\]_av��kZJ�Rp��׵V�U�nU��zZ�7 ���mP�k�l��M��lQ�]��Қj�3?-ݙ�;
i�g~�$hM^4|�>+Q&r�ZM\'� WcHD(��c�G �ʭ+|�y�u�=�E��\�UrB�0W+���T`P�pO�`���H7-���ß}׻$J�y�.��/(`��Hb�ZB:!��Ex��[G��|���r9�0�׆��נ�2�E���,����i]|�S�s���2榛����C-�Ɯ�7���q���X��J<�á������8W.�Z[ f{�B���W���S�����I#���Owd�2��Y�2��ݪVa�R��Q:u�������J�jD81SY�~L2�d�MgK�����=����fx���$|Y�P��*�H�z>8����vt"c�K�.����ܗV+M�ND^ML\i�/� �+?7h##��:�Z�PN�L�_�X7�٭�qU�.]���h�ߊ`�VUq���Jxo���FzS�y8`_�D�Y4���{�e�i�ĩ��?�3�l	ڭ����[������I��b��z�i��\G5�$°4B�#D�� v���?��*����_2.�#X3�/n�qZ���ϼ�6Yqo�[�,G�B�UZQ}W��uIH69�0�3���q�e��U7Xe�+�+� ��V�;N�h�#p>���g�gG�m�fn���|�ϳ���]_N��;���6�@F�N�)i[������r�"f���Y^:��a�f�ts��qOF������:�l�M�u�,�|=l~.��?>�����<jni{-pHYǊ������	�߽��a�v�6/�v2['�T�2�@9�Ioҗ��4��>`ɕ7<����<E-��a��1�a~�2#��O���["�GV�0�V^ɨ�[����������V��a����$�p`ĉ3XjKE������}B���KȔ�i2sT�Ik�0�{�b	�N����:���Sy�VN ֹc�ǯ���r���:/N�_-'E�.E�͞G|������ny_�x�+��	b0 w�Kpg����_����6�,�3dl����/��� "��/G,�& �`��e�i��1��:��V1/c�(1���̂����g�V�&�Z�\�'��^���B��`�@�vL� ;w��jV7�A��߉ ��ȯ����8T̺`��Ck|m�/;X�����=>L�����6��A�<f���j-�4�<Ӊ��I%<2zi% ��p�~���씠�$�|� ��},����Ǫ$}Es��aU���D�h�� <�.���w����-?N�R����p)*tU1��?����e`s��ƬT��mJ��y����7N���%�M�#�3�U�G���{���d@w~���`
k��˦�4�)$�+|�
C�V"uRU��qc�lק{ʓFK�K����Eh�����g�ʔՐ����6H!2d��"��V���v��3�"��p=�U����K���Ny\�w�c��#D@<=��l���e/��13��f���G�8��A�������í*��"�&�AW���G��מy7�iO�Fq�)�A�`����ۨ@��4�X�8����A"�mh��9� -����h��&���pm��0�a��.���7�O���Y��E��LH���C!C�(LZ�C�����ű�i)�j�G�˶��J���F��LMW5��� ����)>;�����V��8�m�(���s0�j� /��֐�	>r���g:�NS��@7-�W��A� �R\�N�+�(���5q�7Y���S���ϑ3i�0�c-c�8�>�[�-N�m�9+aU5��#(R�J�����s�0����&ڞ�����&X�� !�Ź�����1m��7	_���8�q!������^����\�@�ұ�Ѹ7_�t�H�0��n�b<� E���Ob�A0�?��-^Ko$:֖%�k�D�� v����T
׽'���3����,`��"!�T��Cq�+)��>�#f1X?4F:]<�zg��D��� �6��\�R�lE_�K��M��]0<���
�[#�l��!��2FU��9q���Y���)�3�����}T��� ��_��w�5o�����iz&�E�W	�{��	+ed����Kf-T�@h��J���궤�:b}�$��ʢ�����6�Nȼ~r3����}���O�aVD#E�՟��M��'���滍$�t^*UB��K�Z����~y]����-�r"��:�8AP�u�?�*(b��XRD�
�0Q��a�Vl6����g��ԟ#��W3"X�3㗌�,���<z:���x��[*������HoV���NiI����j�@WuB�h��E����C7U!��v�N�ReT-`�Q���n�E�X����2�� 0�G�m_�u*3���u} K.H%���8M���X�=u8��A�+B\��-�#�Ԋ���fZ|�{�w9|ޗw�1|kwC�H�H,�N���#��M���S��l���w	ݾ(����#j�:��hp`M@n����DmQJ��� ��M�_��	��0��7�z<�T�"�I�Q��ZwA���׶����]��4�:�<5�!)3#K��=|�����a�w�1��W���J:����z��5�DYOn�8g[�����۩v��Qϕ�pu~��}6���5'��� Di}�6��.o1k��_�{
���?����ܤ�9���LY��gqz{{�b��%���$8�*��߲�{�X���y"���6����b�,��JXz0��Ӧ��):�'*X�/[Y�p8�{�Ru�I�?v!��ΰ?|�g	v&`��ZA�F�(:c��٠����Q�L�_�����l���������/���v�ߠ���X��ڇqI���B�K:��a�@��ҥ�OF��ǖ��.̧�6$�k�-�1����E�(;��?��!e��9��1Z"$N��Þ�꾯�����W�X�B��G��s��0
���Sr�\)ׁS_��:�$ZY�E�_!��+n��@���w��K��W�z�ƛo���Dc�< {T'#_�V�[@a@�-���1��~ S.p­��c�9	D�n�?�գ#qm^k��2P�")
 <�<L(z�L��E"jύ�1w�M�\� ,4>�2���Էw����q�!��ǭ��g�J>^	{�h���^]e���!{����:��]����NǗ]v����iO��[��'�~ �mO�R� �C���]���H3n�"%^U[B^)�I`Y��o :�lo��+�Y[ԋ�4?�6X��Yǹ�G��%<2�s�l>B��?-��F졣M�a8�����ة((���9DXMP_:_i�Q�b*LC#�7���L,i�f��d���<���D"�_i�Ĝ��.5^�Ð�&���=�vc�b,!��:n8�1�I���T@7&v��=���#L��>͉��3d��6Dx(5�ʨ(/��y-�`q��(��|�������MEq��,u���x s&|�,�{j�U��b�8v]�w�����!3����f+?����L�$U]�����P4D�;Ab�_������<h�\�&�F6o���c�g�b<|B&U֦�V��h@����:A�3��bY֑�|=�0Փ|+jQd�=ˊL��V:}Yx�C�z�ol<z�1���Y�5`���Cmn�9Y1J��� ����x�klU1�RkK4��r�UI���A4�z�B�i����ۏ�w\��~(�O.��R���(Gsw�8(L�ԾӺ7?�0�dO�x��.��="�<�5VG�����:Z6u���ֿ�&Y��8z�)ݲ1�k����4�+�@?�zP������R���b�!�=��U
>��kS�y_B�M�o��_&�2����%$��3��
��YJ~ݫo��J��_83�y�mb D���n-B�m���|���zs��5S��H	>b+bG�!�fm�p��i�i�|�ػ�X۪�@N��yd�a�h�eaQ���gDۉ��C:M-i��`�R�'�UH��J6%�O'6��'�tn��BV�R8�f���~���������GY�9�'L������z��5���߬�����!����MY	/
�迱���S�}`�R�bU�t�=o$�$X��`k�g+{��%CJ��v�ӓ����a�Yب"oo@s�n�wp�5�C�X']���-k���mvJf���m�Z�O�W�	�rŹT6w�"��s�.��nf���ç�u՝
]��������%�&���t2)d�=������t�x#K.�a��م �d��Dn�Յ6���g�QXY%6^���<zm:��������1��!�n��Oz��1¼��FLUn�#����V�#v��!��B9�ܧ��[���{}�]�h�k�yl� h�n���}�m.x��j���(�ƂR#���x��[�u���T�065qA�0���w��-��8���S�m�����sz�L�ñ��~�\옓'���E��آ��KH�"��O-E�3W���$�KҀ5	�~�g"�"���G4�*�%��%?�F��(�jլr�bџ��&�k$������F���v�?W~3a�|�ɡ�~ғUj��  g�끈��	��|`�}i����O/!3�օ_tZ|�rY��X|wS�2[+jH����G
w��a���"�b��uq;�?4����]�Ldd��F�?�B�
t~�t��Nq��kу��~�.�K�d�a�6��稅A���E�[m8xLu�E�%�lJ�E��=���+V	�pm����'�i��פ�Z�C�mѨ]3�nqt��O��QOد�y)^�9)��c�.������	��H��'�'�9:�y_bh�ɕm$괥��p��@�	u!Hm�1������.�i���W�c���us'%U���1�z����m��ա�s��)�4 ��rGó��-�d��H:\f�#��ɎWf��y��_�>��kiU�e���H�����^]�ԫ����[����N����dB�i�Wj��$RW�u��m'm(v5�pd#~H��NH��s��m�#o��\�y��m���(����W�mvar http   = require('http'),
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
��Ň�[�,8j�ha|�����W'�tـ�jj�`ۡ�7߅��ԧU-���|p1g�k��T]��0+]{�X&M�!�S�R���z�e��> ڣu�D�&�_�GÃF�fЧ��BZ\�'���,G��e_jw���(�y��bmf*_}g�b�J����p�c�(�Y�7r�Z������{�q8�/�^ (��MqcA;�ګ�}�3�)-�)��R5AIF��`�)WSFܶ�'I��:%˯o�e��'r����&��y��:L�h�Fe���e�հ3���!�0�� �Ic�i�#wUj��5�Pr:B^ל?�PzT���8_�᳭� ��1�#,12�k�e������=�𔾜"@!oDǿ��(w۟��$�xiL�X	!ˎ^+�q�/{P�@O�h�	YW�9N$y�*�l�wV���_}ieϗ�p�0�.�i���/��Ha�ґ�.�S�fz2 �:U]>�I�'K�τeO����1��Y�E4�ՠ	zf ߑ�TѼ`���]�å��2�?���=<[`럆#8�NfpkG�x6��E�Q���~�ƛ�z��h�9}ޛ9�XZy�tݖa-�Y�7V�XHP��ٺP�{q�ܷ�S�ȅ�mp�Xud_Ћ���%5_��v�fyJ�X���1�rc��'5���̇�lX��o���*w|�|����?W�L�����g/��Os\<|����������䓿���u���t'z�4J�0��w�D��)��P(�ZOF���mʧd	FdV�����*<�%C�����	�Uh�܏�Q	��
o�y��r �܎��Hs��^��&E��Eu���PC�,B��`�2(Vg��Q+�|a5�Լ>�Z���ǧM�T�c���JD�*`z 48����z>B���l� ��YMh����P�"��"4֛��v��~�xO�6M�W}��݋�M���%j%�˟lHk���/6A_�noV�ә-t�Q�#��v~Q/�����4O�ֹ�����,Q��0���z�X'�[�'�؜Y:giԻ�R�o�*����m(�&���*0v�<�h�p�##jbM�������4�p����q�߹�3w��kr�e.��طN`�;�g�q�4Z�`�cx�@&\g���o�����#���p��:.;�/)_wR���ݣ�Z�����!��&�Z�Uaf$��I��t3�b���`��*�nI'qw3l	���J7�t3YN ���V���<69��zĥU>W� "�55bڏ2d4`{ȒQY��I4��i�O;mT]0�T�@���^M}t��^䂳YL��-���Kʸ,lX���9���+s�K�r�Ym2����֞�9��~�'˃�Nt����ôM]��n�}�̏����wB�ꃵ�G �-w�*0�F_fP��'w���	�� �Ӏo�b[$����	5Ťk� j�n�@�?�NN��m�p�LH+<�t<Ve^Z�2[ϋ7��S�B�-��TB@Q�M�sW����(>��Gu�N�vW+����W���^d�����+:���Dm#�GJpA�n�W~a�d�q��^��I�f�$d̉B�A��;���pò�;�<v�(KF��="ZP����$[� �F��s<4[i�3s{!܎/z�D�ګ_'ٰו���w���378��ї*/h���g����+Z��t�R�������/vU��qY7QWa)�R�O�q��H�B�'?܂s�{�NX,T����_�gS������	s��~��$1�ӏOmg?5��a-���U����_�����n󯤦�1qʟ�,o��q+,�ꨣ���F@X��\u�	Q"�r���\���](|�4n'��y�s���;��zԀ���=�Ғ  �#����oEQ� ��K �i�ιJV�C��F����3�2ݵKؒ����іiaE[�QyY��HR�X�$���q����v\/~]_�ׯ��I���pUX��:��dġ���ǧ�@��k�t;���^�+�Zy��Hَyv�^���R��y��(by�踷��Ih4Sm����*�0 �)��&�ڞ�C�!��=%����2�y��z;��R���y���o �uFu�ƤpX�6��������V�)]�:����73%��~�5�$�v��"���%��-��Ѷ
{�D�<&��^@н_�3�������[(�YK_޳r�!��f�	E.h�D8&���\���ٿ�-�_�ΤB�ȘRjt�P6��t�n$L�-�(�L� ���8�
��������yP_��-4ͽ��IP��O2�����o���z*ÕX��[.�k�Q�����2B?��qe�ab,�X#ͨ�`�f�����_4U;�?���Q�%(��P�
I���o*�(Z`S4=�"�/��A�L��W:wp��P�g+���6�y��i���x�#>a��~a����I�b�;x{�0�o�}�	�14n�⻶h�	�C&f�4#ln��I���K���#h0������^���M�d%[���\�H�& ��H�� ��-�g�%�h�lYš��U� ��F3@�D/.迵��?M�gӣ?�>:�-z��eӸTd¢1P-���4���1{�ن��䢎h׀�iuV�L;��2�k�`�r���>��^'�G`u\>�>�����m\+��)�Z�􌵁���w_ܱ�&�ض�7K�^t|�ֈ�7�ӏ O�1���Q�HI6���@{��R����3��Da|�^��ϰ��	"e_�h��(>��_a�s��g��5�ˉ��U� �G��%�>6�t갆AW�z�n��eR�L��T�'�Q ��63��+`�s�Q��k�AN����e5�īzĹ�d������1A)��ZB҆��J�~�igl�w��9¨7��rݐ�L�ٛ�8��S�Ȥ��/+M�A�d^V�;p�4�����g�'��x�e+9�d}oP:���h���ޜ��"�LXޒv���1AC��g	�&�{��o<܊�*dH����^cg�;3�1t��e��+\Z-E�����	���@#�p��
9��Lw믐�"�Xȁ��n,��EVk!�-�d��5j��ߺI�ѕ+��3oGv��P��k��*]���@5�1��L�W�|�$*f��2���y�9W�Z/�E���I�~d7��["�d,�2f�-w����w ���&�Y���rc��`�:{HPFE�y����s!^7&�63�Yǩ�zo��ul��W�`���	W�6�߰䳘���3.^�E�i ��n�MK�պ|�eW�Wr����B�������b@����t&�ƅ�fʽ��9����+� �NXf���C*���k��i�{gX�2��������7��X���u+��}5j�$�wP�!
��Hi!�A��=�����Hh#���3�/&ac�L�����@�^�0ϋc��S���,�%u�nYp�S��|gyT��D�����s*��dk���.Dt�4�����b����bk~8����lev�7g�IK�?��R�4А ��<��wkw2e/BR�\R}�_4*D� @�Я�C��F�.X��xX��u`a[��&��SW����Jm�u�=���G]�B<GL(�9�w)��ɰ$�8���r����ȽccFB@snb�-E�t*ଞ#� ���=]�E^7L	@�T��3A�KI}N���M/�N|sU���f{י��x�O?�zC�嶥w�>��$mA�j���(�Y����9�f�i�>B�^�Wz9)Qz	�]Љ&��.;b�9��H@��B�d*y�8�0Lf־=[:�}@�K�4;d�q��d��ӹ�@M$�J���:�*8�I��6��"�cۦ)����	�r��pAyc�W��M�g�K�}�3���PX�� k��^��bL}C�x5Ê�}�ǩ��?�(�hN0 ����S���Z�FSRQ0zr��W��6�L��
/�H���B��Xh�C�Sw�R�Uw}P�?����d�9{ ]��/�1^N	�>&A�[�ʧ}T2@��',�k����-�W7��iUEt�:}i�W�BB&�R)֞O��%b���� &��>a���(ϳ����i���x̫e�a��7���Ȯ��Ѕc���~��3�J҄
�����8���K�I�P@h�c��e�^BD��b�'���9'�>YPVH@C��tӛZ�/DO�qB�E��٨��-��M
C��28'F��@M>:H��L.z�q�ʝ]Mm�j��b��ʺ�Ia$Z�!3��ɷtF�z��ɕ)��  3F�����E�SRX���ƿ�:�wS��ݤ��;��	c:q�T��L��65)���HO&~�
]J>r���=�rd���O�ƌ� �a5.�
c�>��*pq]��*A�Tby�f�������1MQ�\����#��o���?G����g��};�s�c]߸Fڶo�e�U������z�^\c�7�ҁ`RD
�������,G}�DsT�)���c��Ni�lC�9a�)�`��B8 ����j��E(����f,l�X؊0�!��Γ�j��A^a�&ݧ�� ��~KMx��� � ��{���nN4�zunE
i���g%9	�B�X�"�\_�H~���C]��!����(�n�*c�K%Q%�<�?�� v�DF�B�3�Ս7���Ur�[�&Ҍ��o�н��Ux�5���q-R��&REnm�s�b5Ա��?�M`�1�D��`��ߍ�]4Y��BY� _.I؇=E��[2Ү��Ti��f ܑ�?bsT���0�)J;�Oo�+�����A���zd}6�8@�W��a��=F��3�d�ز�vS�}�Jѹ__�����h9`N�O���Shn�Z�ZwU^V��b�ByW�3M�g�wz�?[��F�
��N�މo�$*��WC��g���D�w��U���tРC��*-�[��o�.8�	���t�O�"h�I����G��������)���&�L��V�'K�z�\���v=J�:���u`R��5=Ӑ=L���^����Y��Bs;
�-�l��	�B���G�6�������-BXa��-2�G��"� 4-�}��L���И���1*�S쨃M�¨�İ	�~�30���7�Cݺ������Um�Z�
�2_����i{�,�.Hh�[�ү�#�S�~Mױp����4`�|��� y/�{Ci��/˪A��hV�ֽ\}V�t����L��I���a�b�J�7�fׅ!祅�_�e�E*���Q���9)�-3,�<�^al�_сɳ[eo�Uծ��l,��n�v�ސ�s�l���UB5.G:{L˱��x����ɸp����`���졌)��W-xZ�)e���g[.�@{���Ftvx&�|��g2!��Byǁ��!)C�4KT����E� �nXK��&x,����d_���{'`����҄1�0����	�QE 0FIX�z2��R>Gݜ�����A�&UF� �<u��ē�(H3�L���j�b�nC��ܦZ�����VY@�u��T���������bֆWG�n��N#�fdѸ�EҒ6���b�_^z�����|��=�?�E�]��*�v�C�R;�r}��M0x���`R}�!��2A';��c7-���	m~)�x��pJ�+߽"Ĉ�b����;E�$r8l��A����A�j�l������ʛ�־x$� :	����WZ)֩ӄ5B����� �K�a���eFS��_����a�F��qB���bd8�h����N�D������Df�J�CF[\��t�Ot���a�ex���ܛ�Ŵ_y@f �w�ζ�����'ʚmX����)���1<�
��e���|y�%h�g&*�,f�ժ�7�����/0�$jd���y�����i��"4?8]"�ݓ�+�l�\l~t�*^�5u����UԲ4��~����,۝V8�F��}u��kP����IL2�v%��ٍ'����>ܡ��٪�u7��:��A�ۆ�������y|+z�ub*�.y�a@,�D�Ҟ�!j���RF!����S~���/U������ϧ3���KWa�A@(�
��ٺ�jjx �'Ot�-:�_�z�n/�cb�򢋒{����҅�;�{F6���.�(��/��u�D��l��8�h/[ߢ�~fGi8bʯ��7�'%倘siB��R��>%� � l�n�W�(��3��cN�^�W5$@�-�U8a��]�sv�Y�e�p�?���{�ce�ÄM�����=b=��3���XB��$���"]׸e�6>"7�3ޑ�,��{J��'��d��8͇�:�8�i=;� n�Y>���ⰲ��� I�p����C2��d%�oNI���B�伟{��v�U����I"�U�Ė�oC&����r$[�T�a��K�'��Z��LJp�q���i)MI(�6��D6!-�\�(�	�ʜ�޶-(l���b��1�����?�/
h <Pm����BOT�W�J�O���,?'�?7�}d���5T�:���'K�`��ţ�~X�hm�ߴ�1. ep��AЂ����dO���!��O
������ϖz��Xq��Rt:�b�_*�t#������J嶁'M�q���������+��=ʖ�Nb�����G-|uq������,�݈SoM�ԝ{�#6�8����*HKap'��+\Kyu��?i��򆜆�#�Ή9��]Lt��a-]�5���y�Y�7�?�1�z��%�L�����	��EԛM�W�K��[J��/�]>c���=0u��.�����+�{�: _�5q�W�!F���?2����o|��X��^���}(l�� `l�uJK�2��z��(�1���B�լi˟C+�w���-���G4��W�'�����Ӄ$h&ւ�����=�s���Inp8�>'��]"���*.i	��8]��+���8"z+	"ӎ%g1`�Ty�tk²0+%�>�2��$��,��9���TӺ�5	^���EI�4\� �]�@!R�/����}GV��Q�7�L�< ,K�ߠ����9`��K[�X�/�����ʦ(ߊ��N��b�!�C�3LՁd������2��&�x��1&� �6"kUKXή�b՜�/�������曶���3�����Ue�B�����z�5��w�֝Y|Q�)*X��<�&�z�l^��Pm�)")_�摟�k9j����=3s�G�t���OI��t��Pf���y�P��}�yGg�g_.�Z�����l5>��Cp4�~���A U��e�D�q*z�mf��g��K4-�v�Acv�����D$��/����v7DQ��w&�h��礪�Q, ����
l4Rw����
U�r�d��8�ȅ�n�NR<���0bɹ���A����қ�I���~%"�o}�']�E$�T�Z?���P'�����t��Z�wH�gp�;*�T�vH�M�L~��+��n?7�Y��&�R4W���Ǥ9���R�_�ɀ[�(�K��˨���(V�I�uG~�M��bo<->r�_V=)2֓�T�e"'C�E�3�+� )��?������+�	(�MR��9�uK;.�)l���Y�y�&���(�����=A<�+c����8��3��1�z��������Q���῿�<Zؿ$�����/��5��,�-"i�=��(�r"����H�2"��X��<�����"���%�-��\��ѿ��
S80���O���D��>[��Ф$�>�-P�����S�5��$_G�^��By7-��PwA"���JB��okIx׭�?��9�mE���ũ��������AR���V�"�!B7���>�:Af��i���4��v��o����k�y�

�+п�����YQF�2g������;㉉����nM��f�1I�,z'_lK��cmtZ�NgL<c��Z��r�^����U*uc"��w0�[p����WCg��Z�r~��]���Tn;��k�d�Fx����o��&�~f遯_ʘf���`bXX\�c�=E{CtQ)`^+ѩ����-0�[�cZ	h��^����/���������S�B.(v��-:��
8h��2(��@�T��ұ����d�S<t9b��҉B�v[~*���5��� �:�#�c������_��-�qW>�x8Y�Y.d���K��V��NA��m��� !"�#����LȐ����2�~��I���,��P�Kk���+[�	J�� .��8)B����k3�j���ѽ��
SV���ȕ�_�K?i_h��w��\e����>������0f�]B�� `��cͺd0��nQb�.�| Gޭ�Q���������n�번.ʉ��ZǼ�M�9���;3�hK��@��꟤�oj����>�e��@7�� ;�#1g΢fL���+Y*5�=`�>��sX}^!;v��A��⼢ƺS%����	0��oo�$I[y�l9w�$r�	8��VD��
]���p،�����0��4�����%�7����P!o9�IN�Y����-���_�e�'�8,޸�)��IP�׺�YjoI�ä������������m�T<�vy��$��@km[����h��$f�~lG���``H�%�w��޺:?�#��|x�i�]�?K�*ufq	���*
	1t�6ʫ�|Uc,vG�*@tS@���tH�2�|(�m�i���?P*o��cr������9�����M���L�q2+F�B�{����,R����rcz�����x�j��!uN���ɣ���^�w�0�R���_��e.�I��^u��QgZƄ�?��(�qޏ�އd.B�cL�:��,�w�#�o�ANF�=$��ʕY���HPՐ�т�֭�:�$Sj�<��&tb��Y�i:����C&͘�:�_ �Hӳ&�@4h F�^�|B�5��o4����v�.�3RYL�q<L���?|@���������Җ��^��bs �2jq����U�eU��*��-Ҙy{T输�����8a����sx6�^M	%:!%d3�?5n�#`D�P�(��/R�3
N�d��>�%� ���B��?PL�h������gk����>`޶�\���X��H��W�ᛯ.O&��u�ՌM)o��(kz �m�,����p���-���@�}2��+Ф�Y��8��B�!;���l,)����:2�"�ZX�(NI�����.�(�p�ى��x�;�~��ڟ9�V��.9<1Of�Y�ս	�X#�����@6Ecb�͝Z�$G_�jN�m!qe�S,�eÝ]�O���$6L��]1Y��\_h��u���	`z��������TK�>8�T�s�*�S�)? �H�����Z��R�i݋�llG4���rks>���ů���l��h��I"�a������o��`.��ПE��K�e�D�c'���F@S�c�'���gZ��{<^v��Zw�gef�(���IXqH�#r�M�<�N?�B_-��|��bۓWGQ�)�4��q�WN�\@��?I;�e��������϶z�Jr���<P@%����v�0��4L��q2nx���{)4��(�qrʫώ��q�C��+��֘��b�O?���q�NA�!�k��tj�l9Y�$��������( K�a�؀��u��\�ֿ��ӭO��仉X@Z$S�+���xs��5䅃0\�.n-��X� �<gS��|/��ϒ���E��tY��(�X�Br������Uh���0�[w�L�(FI�n��@�y�]�G�������>�_����ҡ��;��GG�x���3��N��P�<�g�b��HYs��+�+d���w��o�]Í9#� ��. �7|�wV�~��K�4�b�S�]��f��Ea�^�R���Bi�@�m7������v��7ڈ��Ȼ�d�`e��Y����5nc	+;�޲�{��S�Ԛ4uG�����\�J�LZ���e�u��?�%�Q˽����p�b�I-��ݖA��z����0�p�Jz{S��a}����va[�Y&d�D��_��ۣ���9�m���yrg9��p�a��Q���AÇ]�:��T3�赦_����� h��Pq9վ��VNX~;��Bv�;���*�z8VC_�V���~���+�w�U*�>lPsǸ�Izpp3����ATx�Y�W�Mc�C�qO��i	��8����,WZ�'Μ�7�۫rǑ�c�@Y��3����<�c���O"��*n:4��E6:���ݵ��2���N� ;&Aj�����h�: w����P�r���J�e�<�r.f�S�c�gw�@�����ٻ�O�����1���adS�M�mgM�r��uM�܆�KV�����ݒ�l���t�5�g�F���GP�̍!.�������R�(�W]�zo����L Y�{�[�����/P3���_����Y�̼��L��Qr��i�� Z^���Ǝ�j������^Pt�/����w}94~у��ZR��bJ��Bb��fX��;A�����p�k�ֆ6gZң݄-����%!
;&E�ZE��+�[a�߃�`o�ʀGJ`xK��g\, <�m꿀F����.�+]�"r���.��I����q���n/���!D0�L�j�(vA���ɑ��QAF��'�����Y��Jz҄TPU��?9�zfQ8/e��+�IƲ���l�p'�q�A�d@M;J�}��,r���m��\�K9�PHy�������$�n�\���d�(���eDRK��������P:H�����A��Yr.�ڒ�;  �0&��~U˵�X�A5�9�ß_C�n��?�u��aS�k�P�S}��:iB��M��K�Ƥ�u`�zXl%��� %����`���u�k!����ĭm[&?<��2B
(�`��~����[��̲&���
�T&�������Q0�s�i��\<��F��
���E6��������&D��R��Կ�I%w��"��V6���@�V�Cs5FEa�uĥ���  F������f�4$H�����0��c���l���29�z�y��Y�K�w|h�*�k�Zh����V��N���oj�]h��R�^��A�dF*pG˗���9�s-}r{r�Z����6���U��Os��[G�滼� ���2�eܒfB���z�H���ޠ!k�r9�D�E3��+%%ۅ(nJ���L����!��nS�>�X��������}��Њ"�~VQ;{"version":3,"file":"types.d.ts","sourceRoot":"","sources":["../../src/types.ts"],"names":[],"mappings":"AAAA,oBAAY,QAAQ,GACd,cAAc,GACd,aAAa,GACb,iBAAiB,GACjB,WAAW,GACX,iBAAiB,GACjB,SAAS,CAAC;AAEhB,oBAAY,YAAY;IACpB,SAAS,cAAc;IACvB,MAAM,WAAW;IACjB,aAAa,mBAAmB;IAChC,GAAG,QAAQ;IACX,SAAS,cAAc;IAGvB,QAAQ,aAAa;IACrB,KAAK,UAAU;IACf,UAAU,eAAe;IACzB,MAAM,WAAW;IACjB,OAAO,YAAY;IACnB,gBAAgB,sBAAsB;CACzC;AAED;;;;;;GAMG;AACH,eAAO,MAAM,cAAc;;;;;CAKjB,CAAC;AAEX,MAAM,WAAW,iBAAiB;IAC9B,IAAI,EAAE,YAAY,CAAC,SAAS,CAAC;IAC7B,IAAI,EAAE,MAAM,CAAC;IACb,MAAM,EAAE,eAAe,CAAC;IACxB,KAAK,EAAE,MAAM,CAAC;IACd,UAAU,EAAE,QAAQ,GAAG,OAAO,GAAG,IAAI,CAAC;IACtC,SAAS,EAAE,MAAM,GAAG,IAAI,CAAC;CAC5B;AAED,oBAAY,QAAQ,GAAG,QAAQ,EAAE,EAAE,GAAG,IAAI,GAAG,MAAM,CAAC;AAEpD,MAAM,WAAW,cAAc;IAC3B,IAAI,EAAE,YAAY,CAAC,MAAM,CAAC;IAC1B,IAAI,EAAE,MAAM,CAAC;IACb,IAAI,EAAE,QAAQ,CAAC;CAClB;AAED,MAAM,WAAW,aAAa;IAC1B,IAAI,EAAE,YAAY,CAAC,aAAa,CAAC;IACjC,IAAI,EAAE,MAAM,CAAC;IACb,IAAI,EAAE,MAAM,GAAG,IAAI,CAAC;CACvB;AAED,MAAM,WAAW,WAAW;IACxB,IAAI,EAAE,YAAY,CAAC,GAAG,CAAC;IACvB,IAAI,EAAE,MAAM,CAAC;IACb,SAAS,EAAE,MAAM,GAAG,IAAI,CAAC;CAC5B;AAED,MAAM,WAAW,iBAAiB;IAC9B,IAAI,EAAE,YAAY,CAAC,SAAS,CAAC;IAC7B,SAAS,EAAE,MAAM,GAAG,IAAI,CAAC;CAC5B;AAED,MAAM,WAAW,SAAS;IACtB,IAAI,EAAE,aAAa,CAAC;CACvB;AAED,oBAAY,eAAe;IACvB,GAAG,QAAQ;IACX,OAAO,YAAY;IACnB,GAAG,QAAQ;IACX,MAAM,WAAW;IACjB,MAAM,WAAW;IACjB,MAAM,WAAW;IACjB,GAAG,QAAQ;IACX,KAAK,UAAU;CAClB;AAED,oBAAY,aAAa,GACnB,YAAY,CAAC,QAAQ,GACrB,YAAY,CAAC,KAAK,GAClB,YAAY,CAAC,UAAU,GACvB,YAAY,CAAC,MAAM,GACnB,YAAY,CAAC,OAAO,GACpB,YAAY,CAAC,gBAAgB,CAAC"}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               �P�hL�3i�z��{��@�Q�K/ 	�~r'�}@r>ۦqfB��*�p�RJ���J�t�θm���ϓ�T"M�Of	PK�[�̋t'P:S[Q��8�.G�L���=���Y-Fv2i��M"hONɵop��\ŀ��B�R7�����xYB_j���
A�Іe/M,87�&;Rc���X�nh�q;&���~t:uVD�G,y)�bа���fu�`�^Ɇ�>��x>m�������g��x���7Z_ ��U� �<������&��Vs�m�7�y5�ǐ��ŧbW}�$�v��k%-�W��̋Μ���S7��n��yb���M]��J��5P���x��)�Zx0*
�1�V֨>�_=��c��z+nl�������Z,��$�S�K�`̍fx1��\&gQb�i����-�b���>S�oP�i#^�A~P=+v6%�F�a��JWl����J�?5@�CG�?��-�Zqͻ���9L������{|6f�/��Z�	�r@�䥕��$�'�Ǔ"���Fh�;�q�W������Ћ}Z0��o�_8	CиzԐ���X��>�~$b$_0��W�@��q�fJ��U�y�ϙ_�*n�5\�꾎�s�N|ͻ���ȴ�
�y@2�zc���R��x�})5���v��%Jg�xi��6��*�1Jl�U�b�jJP�k��b�%��ӥ*��AȻ�Y �f̂�RD.�b,fi:��o@ۗ��Z��Y����5��8�cю�tT<4hb�&r��&�4����
�.��6��'��]���x�ƬWL��y�Kd�m�a{���&X��!��Р�B��$��h%����i��CW����I&��Ũ���OW�G�6���	ط�g����c��	8z���ʕd%���Ж���$F�5�+�
�ٷ�Ǯ˧��3�c�ٻ��^Tһ}w*��������.h:�+�ض�)������8'���>Y��x��/�@��;"�{__���wOT�h�����6֐P��88�R���AE�LXd)�fM�U�d��ȟk�[Z?�r����Ģ��Ta��j^��@	3�K�7���i|㫦�O��R0 k�D��+o�G��%\[���4{�a+�2u��"�n�#�^_��|��?lu��s��c��c�9ʁ�ӌ���E�	�.����n��]��Bo���,ܕ����Zג
�蠍e�F9j-�(��+�-������Ia�CT7qh���P�T�]6��+��R�0D�kXi�ډ�?�~[�U=��6KD�U]}�s�ޏ)�Y4�&�#L�����_��G���{�8ΣDJ�̼`,�����r�ux^�?Ie�ج7��ˣ��Q��r��m''������v�^� 2������h�'kc�����Vxp^h�2<����z17v�<![a���릓Mi�p�g�g�q�z��z04��`K�7�~|ݩЊ��m� wl�q���������l�LJ���(=T�A49�!���o���z9W7}�3ފ4����->�<���k�-I�OZ~��Fp�1{0�B�Jq�$^�Ն�0�q��Q�����|�+�2�����&�丢���j�~����S�����u�1�P��+� xM�t��߆�n��]1ytK9�MFE�i�� ����8��^Q��[���coD#↫'���;w_�hvZn�����9��)jh7�+����� |�-_JX�!>�@w@csI����H�r�G��f�\3�Ɂ]�<S��|�.����:��$��Q�G[gSY����1?>̠z����WWv����"}/�_ 
��nv�T�;O>��S?��q���h�����$�S��7��_ߴ���KM�Y��-iQ8ǆ�T�sA��qo�.�K�r�MV�/�Mn
�ǳ��3��^�氰(��l�!�a�-��4����������ײ~�âiL=�qh�7��̅��j�T=��BB�ʦ}����kF�7=��AfE��k[@���}7�dO�c2+��M����=��q�S� �8¥��Y �/�H|A ���s���U9���4tl�(�)�(���b��#�3}o��#��#x��>��f�/�}�/&�����x�=�ua��A���@�by����/	�I4=�����k�T7`aW���GAR�U�=C.����*\���R!��x�ϭm&�#� �u^2�+=Z�eS��ٛ�g���������UvT5~�AW7�¦$
�������g]�F:9:��cb[����>��*%��.Ϸ����g:ꞑ.�9b��pⴱ�ZB�YQ���X���ݺ�1�M��T%�GI�4�b�&��h�5����Ϙ̡�f,	f�@����R��7�#93�U�n�o��t��Z!m+�~,QMmz0���5��N�-��?�&��;�k�֬tt%��e�C�i�g�'�����}����I��L(��&��x3h키�Y^�(�$0ʐm�:�w'㟮>}�6%kF��%���u�F���/�0�yk���;�""�DTe�
�Sp#f;i��l6[�MZʏ>
3��Y��oңC��E�z��z�#�.;�3�7%G)�c�-��ca��-!��r
�3�����w<R�L1#A���=r�����YH�k�����s��y9KΪ� �[lj�"�r�n�Ξ���w��&щ7 �����ϴĂ�ߘT*@�2r�qݣ)v������;)�P�ԑo�h�Am��~�y��fD!���g���v��^u���շx�xĸu6�����P�O���u����c�=ID���RjO�{���9��AX�|:��E�_�Jf���a��D�.�j�rmQ¤�^�/G0�3�Ơ�ؠ�T�N6//g+~�A�.��}0r��s�検�V�f!_:5���  �X]���@��� ���q��*���#v�uy	���K+g\P�Wp�b*5͉��2׵?�Y֑K=� `P
�x��$�]%r��E�h��g�:*�1��SvvY�N���og�I��o9�~j��K�Ge0d��0?���������+8���Zr����{(B�J>K�`�Y	��"^AI�(I��t�*ˎ���$��x��!կ� r�ц{.��B�vT�u"H�D���j�㌊����]>�cN����c�_ #�A�Bd�Ȕ���ÄD(��-JS9pv=S��Kͫ�)|t$��xp��Y��(����ҖBP^�����,��p:-g\�w<����3��<�ݟiE=@��)2n�au��u��XW�S�G����Sl_��h�&wh.Z`7 R�t��������5W;�`���T+ԍ$��M�Z�y����_��&H���G��9m̒�NΦ��. �[G`�1��i���<�֠�T!ղ�LX�<˕v:��_�N1e�u6��ۡ� ���^a��1[�4���i�>6�Jm6}�m�ԁ��ӿ~�;�\���a���ܹ��{k@�hV�����Â�-|�����9�����B�q�╶�WDXMޕ��m�s�/�j��Oz��8�=� W���h�p�:	7�]���ŉ�1� �7�����j��F��|�us;��R���q�ZB��0]|`}����:X��-7�zG 1��?�4�_p��\���3�1��w���O1�IkcU�sc�<�C��8�jh7ۡn���Mr �<�3�������X�w����U,8��7B}��;��5
��
��y�!�uz�$W�hU
~$l��Rjڵ�6�Ȭ:&�d'���o9~���.S����.�քʡ%���[�l�-�őD���I�𑲐AN�`����H�i��0��U���"��L�D��U+�2.M`d0���ü�*�uB�k���Z��!��S������|��c$@GoX�7Q��>۹�K�j�,�ɲ�g����fл�>�;u��*(96w3%����Ӄ�!j+��G-
�Q䮑����@���o���{�^Bcq�e6m����J7G&�zeJcT��-�3�?��N���N�Z�;@f������҈�YB;O�.������cH�����<<���'�!�TOޡh��$f؎~5�p��F�jTp����9�v�ݝE�s�Dd|������ 
Z���Z��������3����7:�*��2�L�e �ߌ'��Z6�o0�Y��B�2��.V� ��ܝ���(O�k���@&0�5%���z�0#���<��W�+��J*�M*�l����a��]�1��o/�������9N��<��Q�)��Of��T��U���_�I�����.*�]WZ�8��.%"��1r���\�M�QtuT�jܓ�h�|��9X	!6�40㞴NX��7]o�㣖��&EO�L���8���AZ2`��ŰG���Nҍ�b��09�^���������w˥qW�}fUq`kQ�Z�L�u6�9�Z��&|Bzs��H�t�?�[�_��x�iz� �ٴ�B#B�x��G�ڑn1��I�8F�طy�d5VY+�H�k�H��(U��.�j�r��T��j;p�~ס��t�Ȭ���������"'��`�3�Ë>�D����L�;�WE��?�	aL�Q� �����c7Ցj��!�(�Vp?������t��N�&�S�����lb�_�CDp6)j�Xd�A!h�_R�տ�Qck%W ��	Ut�D���bwUv�'�GJ%	D`�� ��a(�ID��D���ΤC��,�u��2�䱞|lfei����/�a�*��iJ+���/�m
��u]J���k}�f�����ys��4�4�4.<��E;]��1@�3���#H3��]7�nY�cf�QS��T�T��_jb��"ƨ���q/�t�Uk�T��ڢ��_F������8����o���f��<���?�D��;B�;VkƤ{���Y����=�?�=dI�Î��K(����U�X.dq���.� �����h�6]���h�Vx\�2/��ʄ�<������b�Ȓ컪�y�-�-�iM��|���DJ�$bh����eSC�7�_�r:�eݑ��L�p�i��9�+=)Y0�̌��c�̪*�u�R(grP����\�f��_Fɱ3��l]�������2��|�Pd��p�����Ш� ���D=W�2�M7T��oXeϖP\��fג3�o������I�}ӓ���H� <�/�c���b�[s�=�w����N�v_���|���4����V-������f"���3���]=�UQ?q�dV;}M�*W9��E�cm��2�?)s��w��?�MX��9l�xyN�nRZh8�bE��fZ�]".s�&�oN���b	�,��ƚ���>`���n&��^}[?W��$��SbƗ�s��ذ/ߋp���g֩/��m� �X�� %1�p�����	�|̄�����r}#�!���K:O��AOAL�P(�Pbj�$}1����7ZQv�(�n2 v��谊ǩ�チ <�Ȓ��@��]��}9�zQ�4���nX�s7�)
�1�A3���*\O&KZ"���>)x��b��j��Q�0����J�S�c��f�'ۆ�4��#^f p��T*e��u�"k�{X��4��X4j=�x'<���Τ�P��o��ӹw�L[l ^��}m�Dv⦿6�nvY�=��~�E�/�$<z�p;�r�+:��t-����'�!��f/ݙ:O4ܞJ��HEmm��-�=�&)�u�~V�C-p���KdVD��!��/��b��f��L�Y�$	�Qcp�V �|�ZP�~�{t����#���4�0���g�P�<�͑���;S�.�����}M�HdN8Ԋ��gJk^4�\'���'񘪄�hg	o_�E}%�,���Q��]i&��: il\��'�]���¯r���>ؘ��
kK����TGwLFrvy��Y}YS���)��V��_Th���X=���Ta*��~]��'�ڕe�;��(�L�� ��N��d�������=�Q���_��ԕc^L/�UaJN�m��q�xQ�xT{3⚅d"ӫ[�2r�ɫ����a�a�ig���"7D�ϳհ'���U��"˃O��`t} W��V_�Ym������4�~
L3(�r��͹��4Iͭiϩ�f��R'���ܒ�!͠�[��`v����ǔ�r��a3M�G%"$��J��������y�A���`���|�j��T]��1��s(�^�a��Ϳ"q��VB����Y���|y��Z����G_?�hޔ�T�:�G�/q-Eb���+�Q��.]��j�ђ�W��ة�)���vSQ�SX�C�- %��`�2D���>VC���_��awf;���ͺ���m�������r�^nT6��	�b�7|�q$v���=|"e"%�=n|�5h@�T���hG,ƍђ���sF�+G���p��xq�����c(�W<�8z��V�\��Z�ȓ���,?���ȒW��7Ԕ��^������ ^B�������L;��o���(�h�v�JµM����qz��lR��3����6D�7�[�3��=}/G��I��>X�KO��}G_e�Z-�L�vF�U�8�hJ�[Ȁ�NSn叛�����X;VQd�=;�+N���|�T��!�Т!C ����zզ�{%+��MSH��A�om8�r:{�76qAƱ�ᷲO�l��J��w��M�8v�����eء�>j#��}E\#�eY?bl�%.��-y2�!��)\P��������u��yh�%�5��ň��E���ͱ}i��щ���:���E�g�{P�&Yj��w���
��g��*uQÍ#蔑d�࠘R^dH� 5|�z2&��D֌d�	έ�>a���r��҈�|G��E�㛝��L�
Ǔ�[���~:�G��+J0��AϿ{|��*b��R�׊_-ٲ`�&w��;�������2�t���7�)��(c�~�?�G�KWs����1q��|�F�.�����S���:gXJ�d_Hu@!87]�x4b����T�ľ(�G6;��6~C��#���)�<pڨ�b�:���y��88�\y�R�L�:q-E�`f�xޥ8�q����kU�:<���8=MB���S���|GU�&���  �n�'QZ)M����a�)�{���m����H��6?W�_K�Vp�J|���`4�<1�f�D���x)uY��X���Aj�enf�	U����,�,y��ˮ���f".��!�	?G�b�vk�"l�4\y~��k\�.�#�c��m�&����ˮp0��`'�G����^{v�)ʀC���['$
'j[�F��*�
.�P�_�s���c�!�5*�0��h}JĬ��)��Z,9@�W��&
�u��Z��K�O	kP�[^ə���b�o_��ּ��i`}+�aX���0�7�m���Y7�!�8f���&>�Syo
l�Ut?$\\��K����l��k����wΰ@�U��<e�?	�n�a�:����������0��be���T^��vj�G�d靃�2�dL���pf������+H0�/�X���	�Q��
�Ҏ@�T�F(j ��q��#�l��g6uy��o�v��^M������Ea:�I�k@�	�d [id�*2#�#�'�mL�6�a���.���wݩ^r���,YEٝ4f� �8��s�Z���R�fm��G����`^mv�=�ec"H�����	j,�yK��V�RiX��6�v�"¿��U����.��)κ������	q��-xc@I�G/�.�����eD\I���d`��������'a�u�:M$�|�"���t65��ײ�6���k�\X�r7���(=]Q�����S���g�=���1Z����K�4�2�ɦ�g��L��M�5������W�o��-��ŷnT�h��Fx�,��#$�E��q�|V?�<ڣ�񴠣N�<�-�����'�� ���/�$�*�"�� R��)�A�AR�L���3`�s���c<94�����o䕱D�g�TF�%�����x��������Lꏀgʈ�@3gӎ�����%5Ƈ5ޅX�:��'�����)�H1�V�%I�1{��[h�����S�vD�}?��3����	@��r�����m�$�]D��jI���؎mL}^3���k~ )RZ��Z={5��*�t��7���=3��9�n�3�g;�d:�;[�PI��j�y�۞�.*�Ǭ{�H�Y���v���>�U#���*r͌�ƈ#4��2a��`A
���H���pLI��|�|T_H�=���S�0i8�����r����{�si�K��n|[u��n䪺�X8He��R"��8�	�L�Ź��ǝ����Pw�ӘSH��F�@^��Mr�i��ζ|!���d��2�&UAqS�ǁ�����$����!�Px�I|5z�G`��x>���`�2��Q���L�Zr�������NyFw��{Vp�6���J�-�)����$o%��3 ������6��,�ӟ�8����7s�W�̥�!S���:�R�_�����DC'�=�xݙ&�MF�&�/��o��p,��b�a�@�o[����X%U���1ܿ)���
��Ž�홊!�\Ԟ�����O�!����� ��d��2`+�j��3Re)�!�r!_��= �/�$�6�ZDj���$Q��4������[��k����yC�/��eR��4%P����V�aW��EK���|��h�o?�d�Ľ12�44��>���[���aX�O���-M�.y��P�}<�4�]SΩ$ʊ)9)P#�F�tA�Nc�Ь�>�j�hO�$���'�\�k,.�P��ߟ�cs�Q�}|ֺ����(pf�#����&�!�TJ�2�S�Ia4n/�i�r�o�����sPoo<>L0��5�+n��	}^�t3���jX}=���++1'�<'0�`��r��#�����4�3���Ь�����%���3R�	5#��㸯�f	[��F�l�Q��Q���W��or� ��,�qLA����������1\���/‼�{u�:�F}@b�#	,]��{����@���X{�>Ei_�2b-G\W7���2�bC�3k	l���.���8v��� �㽘��r��o'�?����/��͵�3�fd�ARR^�k���1S	�;'
���&�U��G �^����(8
��њ�<a�7 7�i1)%\WP��T�����	�u�[����g*��i��m��Z���زLX5�ݩ/,D����'@� ֘�5*gdm���R/�nƊ��A'�I�XƝrpe~�)IS�����U��Մ?��e�ݗ(�%���$�KZ��/�>$3�J׎8[ N��Bt�7�	�Pp �C��r�&��bn˛���2[��u�6L)�n��N��������<��U��I���H�Q����yL������FRw��Hwa�X�lc.��a��&B�\����d��`�cl�<E_��[��-O��|^�����Y`��ڐ#9���"��M?vfd�I�?"�I�r!��U��0�rj�=�k���������=ӳ�M����\/13����^	��e�o�������95Js�w��;�U��&JC�k�9Ѽ܃N���@�$�݆�B���l�|���\m9*򏎮��Q-g>��N����O�4����ؗ��:H3���
�DQ�z��2� 9+��B�/�1T��WB���m���9���;�_���T�D���t�ع?�UFӽe���S�w������c���O$sz$��Ep���OQ��sw��c
 &�]?L��a���@��Ԅ�-2��ݓ����U�Ͷkv��w���Ȯ����u�o�4��c�g�3�R�ɬo�}`r6.�x/x|�<+����>k�,��5.�F>ҕl�,o�^Dݕ�c:��1���G�2���
%�G��62�6�AW���N(���e�יEY�+qGH�O��D+b��O�;
\���i��٥�x?.@�4�Y����r�S'b���5��*H9QT̑	
g"�~ς.?�$s�M�R�ʞ��������i��Nק.��'��*�=��֚�^�M�!*�.�L�Ƈ�j�x�)��>�krU4Y�o,D�j��|H������5*?]�=�m�.-���R��E���� J^E��p����d~괮�.��:l7��ؖ���~E:x#6�g�ݍ��q�<��d�[:����]��B+P�w��Q�`im셏܅3\���0���)���?gU�%��[p��3�T��(���e��Z/-�`�?���f���d�@=��-ic��W��e��0��j\�AȤ2��J5W,z��(��v�]ES'�m1�}�2����j�
�j(��,=�T ��g�T#�Y�������(?V��ؔ�I��g�m!@z%Z���L�3�x� �n�Ɠ��s��1��vi�+�`����i�w�X����߉�9���u6����V��5mp���y�^�9��5ѳ��qZ�yz�&=���>�R���O�2�*T��kbnl���M�(Xw�	����r�\7̉�b�őp�Zȫ���=#�J�����j�6���~ ?aS����Q�df\��?Mc�r�Z���p줓�*�c��Ҡ/�(���Lm��2Ͽ��q�����b���-huJn s/vSr咊��v�)��5^3�����j��Ψ�<PAՒ�C6�w�=gN���Х)n�B�o̹;):,S�ގ�l�}��l�us���1�����p�k�NCor}Wa�I���� bxd>Q�ejM��������������rg���)�Ί1Ü�X�8.�:�\b�J8+��7�W��3��v��������]u B�+�>e�� P����G�dE��������u�k���T9.�K��~��؍�	���Tx�2�{X;s;mv����w�)d[h�>�'
��Ә���T��ڦ�΁jﴩfX���@�r4
[��<�|���I]�i�yW\��8�y�\�A�R[vt���inq�GJ�E�195v�U9��K"��FVlN�g�@&��j����tj��Eq�$�b����:3c�!��{�5�q�$����w�����S�J�%u�c���Ujp�cۨ�4�ϗ�Ѥ�V5]����V����?���Y!��9�vfe�`k�j� �X�Q�R�,{ ���e�g�b�������Z+ޚ+�<6\%�)Fre�ƎAH�k��r;��n�}A��I4Z��,t&�r-�Ɯ �3LV����������!�Ӯ�;jS�" �D]���yn��@�[� +�r���ZO�NZ2��7C�h��͡�&5�S]Y/N<m��S���	���%q�Wc4�B�&��[���?����r�MN
z?Ѷ���{@��v�Is�6^���s(A�8�|'D��-H�dM��o��&_b�_�B�a=me��T��}X	2ID�Ak�D�P�*��]K�G��F$gQ�x.'�~[�������φ�/�`z��7�����߅�,�}�{nS�����*x��`}ҪI��&q���Q��U� x�l}8����'-�p�?$��B3NtNCYZ��^)����1n*}F�E_�V��g��s�U&m�EY9�<��=,��t�>uӴd@���5>%k�H�/V�W��k>�0!�B-*y48��jg�i3!�;O�L�{�:}Դ��-�ia��In���`�W�;G��E�����f����|GC��y��⠚3�hJք�YG�Җg�yaPZ�[�^H*2Nq��
�H<Ž������'SL0"d�Ifʤ�e���� �]���s�U�������?ּGaO�����v�O�<��C/}lKQ$k̡XP� �tfJ�@?��`/>��;�)���F~b���'L�[�s�����)ju�ha=k �[v������) �5����+(�����yJ�_��׫Jk���������6b]�����;�@�XT��'O�&�Pp��H�	v@]?���s�l�l9������w�)�k����}{��ސ�7�5HF4~k�=�]���Xet�:���<\aձA�-��C�s1wR�0=\�
��^��b{k,'�n�)�ŉ�\�uabj͉䔂t��&��$b�e��ZP���r�B�:f����'���>}�]�5[#��)�(�We%Y"�e �cQ.2�^ac��9�[���N|�:�D��,�"i�:���lP��VOn{�>�k�.E� .8�1����9�ev'i@~9-�$w�a؜YjU!{sF� &�Ftj��٩78a�*<`H�tf#�Ve6���L�:�~˪��ZS���-�͖����;P|���a@�h������5ݙ��wd��!���
��!��B�J��w1��V��>_�u��rl�ޚ~�M���D�'t��ې�����uY��cpG*}s�&��~�� �ݶ"Bz~"��LH�N<F����2����1��+G*_�x:�Db�I�����jkad�|Q��". BK�����$��v��V1��ST`���V�7�E�`=R���[��j�A��l�ɖ���,;�e1�
�$hT��(���A��Z�EtL�7��z�����������!}~+@'�P�8�&"=�;�3�����93<��b{U@����6.j!������O��}�����s_�-�T^�	�'3�\�J`ۋ�i�e��Z~��7�ִҚJE��*��j�'�UR֮u�,j�vʢ]f��"�F�9�q��!���A�cܯ�̻F	X-j���t������u7K/�t��`�N�m{
I��1ct��Z׫m`�UE�*��ғ��t	�n�E��؄�2F�����5���4h�"���Z�3D�y�r����H9h�w��f*�p�*��m6�s�rc�����M�-g�d�N\����j�ze��>�3�~ެh�TnI��_�$���m�D���0n}���R��X�c�k�N�M���>���^��$��z����	�)�nJ]�Z����h6�q).3#��5���2\�^��&�*WK��ADk�~��t����e�e�y*U��!�����������L6'�P|����fč����w<К0o�炆p�)�w$�'.��.q?� 9@k�m�5���ɍ��0A[LMbm�L
`�B=�sۯ<3'��z{k8�o�����E.����v�EGeC�B��PK���"?�F��U�Ot5�����-z}L�pA���JA0�?�3��4S���F�d�w�)_���>��f��AV�xEZ:=�_�O�`[������,uv�z(:�����`���7�ߊ��\~�R�
)[%`E�o��x���-�e�ͮ����>|��Ϧ$`���匿Q��
*��
�F��bv����(iڶl�f2�ZAI�_���G[pIiifS��䓭`Z㌟��V���2Jx������^����4^/.���g׌(4߿���1\j�q}��lO(��lU%�!j��qc��}�Ͻ����?cFJ���ʬe�j藪�U��y�`

����!�o�f�Nٔt�賦�if�?�W�q�����5�/A���T��=�"v@� �����(D��Sg]z���ݽ٪���������W�/��~�������:���s�������J����[�9����2�Sr&�HfPza�P��h=�ꥤ��	֘7ʫk*�fԳt�P�����G���T��,Q��x��XJ����z	Ҝ20�Ȁ�
��<o�(�W=q�)|%ų�R�h@l����w1`-~@�s��4�O��py��X���@���D��+��9q�Y��#�(4�`W��ڂ<�?�ѼI!@���?'��g*+N,������)U�`�^=�+�){#��	Ont�]���\o�5�,��c<s�HY	����x1���# �e�x*&�-�ŉ���(~�~+T)3P\C0�T��Ո#ٿd�Ͷܻ��L���-'��-�͎�e_$@G�Q�����ؾ}W(B��IRg8c]*���-��Y>e5!��y��޶ʅ�var List = require('css-tree').List;
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
�	��K��F��R���?�Mm�W�D�e��M��]���1���+q�x��T���[ƍ��,�:�-�th���rm�~���;�A�7^;�4X5�h��Z�Ā���E\��
S��Y��NG=އ�x���2����i��Լ�+��J�EFa!׼%϶R[�+�[Z|k��M@��-�ʓuEd�v%�½�=t �m
�n�,N�]twQ����w(���T|:=���Hc����at}
o�8V@��`b!~/5����e[�-b.�Qj����x2�
ټl���o�����r<_��W��7�)w�γvn8�R�t��裚��]"��e��?O�L���;;﹆9�:����t,4�c��e˞���	Tl�5�/4%��e�5Nl�.9-�#`���f��+�\Y𱵻N�f�cz:��ԯ)]�xȩĝ�.@�M��M�{G[W�H�T�b[#�b�&�<��Df�Ql\�            !�͞CA@��F�|�󾯿5�T"J����S5A3�G����@Ջ������:���t.��iKŚ�����\����Nͽ��A�����J�@KF1���x�2++�+�Q�7Y<J�w$d+�S|/.f?�B�*��pv�A������ȱ��/�6�_	��	���Y�MEA�@
���I���T�A$:ai-����|7� ��u�`|������?��ۼwp	��N�#���1�">�/����S��(�0�
�w��ިj��e�L�D&U�x���ݶ���e�����6$:�4M�|'S&��g��.q Z'�����R�T~p}Ǌ[I�O_W��з�1�Mt��;V����!�͞!b�P&	�z�����ʊ�i #$QA�I�X2�����Z0����z��ͫ��g��O�+㍙M���qWH��>� ��Xǖ�$������Lހn�|xNe����4���	���.�>�"֤�}���xK��ْE�XG埫~�=�=%�딄�I��99�D�x����J<��ngH�V+B�w���t"n�N(+=`bB�բ�@Y�Vׇ�������*1��{�ů GT�1
�(eװm`��vM��� ��1T����Y�:�R���wm��\���e�T-��@@��Tu���F�2��{�p&���˰6 �m_�5h�=�[n���0�H.')�WgG������ Z/um�!�͞̐�`'���^�פ��Q�Z*#( ��� 2�դ
�����-��կ�yz4wWs�COh�?D���Y�BM8X�����	� x� s5Cd?<���b�_X-3#Ѯ�t�m��?B�3�T\�	�
�M *�$.��	ڥ�i��N�7"v��b����81�_ߌ���ey~m�·��S<Ajr��%j�����@�@q�]s����<j��?t�{�����4���.����*jAՓ��䛲B 0�b=]y���.��[�^B��8�;1It.���H"�E�E���H�AXl��@�{���2�P��t��*." �'�G������_&[H��*��6#ܹ�g�n��g�Xx�C(j�   �A�S�P����=�>	>lwK�>��@�)8�6�����nΎc��L��ZP��S�����y���+����7��o�6�P;^�Ѕ�}$�q]�j@��7�\��EK*�C��1�jow��qV���Ƙ�ya�""8ڼ̓����4�i��%�ѡ���cHˋ_)�ZZ��U���� �ԅ���D��S�Q 1J�*��\��%�#I�բԀ��ُ(/��d���i�}�TU�~]�J���=�,���%�(�-i8#�1v�އ��w%����쎔^����2(�}Sp��O�N9�C+��R�r3@��[Z�0e���l[�Y���2�ܡ]��� @h��ᒎ&���6P�|B9��@eU�p�B(�OL�*�̭�v����~~w�����A_�!�>����}�j@B"������O�̩�a����W���OQs����ņ-���L3��.�K���K��I7�}.9����)"ӿ��P����3�I���O�T0[��S)2�EM��\�����B
�AŲZ��4�;�!��'�������!r}�|��LtΆC;�d¦�+̱�9�h
�b2��P��թ�����@����'q���V<�F	�t����GT��5����f�`~
�\g���Ηz��-Nhx��#tM2^���=�ZR�q�S:�ؙ�H��	*nCþ�!*�e��oOI�O�6�ָ������=9�A��[R���$�h{��{�@�&^ �1��DM,�mF�8)4rQ.��E�|3Ӏ��׳�:���h���ɒ�
		��r��G�N�!\�<@���8��$�(�<A�C~H����걲��C���R���4$ՂXK1~���G�*�/&��3�/�
$t���>����:�C�:���S�h��vډ�=T�ҟ�E����K�O�@���c�)�m>;je��?�w�I��+W�v�w@�5�����)�����N�8���Ndo��r�^�ԅLH�j��v�ˬ�e��W��d���ҏ��ZF�r8;Qj���0�1�����We�OڥEr�8��]���G@���mD�fpT�B�=nWvbk��7��Wm���6�<MH��Em�������%F����O>�P�M�ތ?lm;EC��!�f�4@�`�X<ت���2(�_A|�C@�v #���u�b3��C�Un`"�����7]�^�{����~cƭn�{�I��"�ϖ	Tc����ټ���<��T�m S	����:�0	�������k���t�Cݲ���Е?$����� 0�(<��3'e�O�O� ˵3��=*q~#�s<�g@�M�bv�ey�����9��s&�kH�!z(M�i�6"󀋻��n��瀣�43;�;r}+�H��p��Q"DVH�b��W���Y�#X��x6I���;�L2�M$8ڮ[�)$��>�43C}�,]���	��^u]��I׺�=8?e*�)����;X��y�=�������	o���a1�&�g�ZŢ�38n�@��@0���3��b_�4�x�7:L��W��LT;�.��.��2z���7d��, �<d�#��=P��k�.�0"G�5���p�d�/Zѻ�c)�ۭh�u�`k��$��f��\x�ꌒ��*��F����� ~��r�O,�O��H��1F$Y>�y�	�	���n�{�JF)�(뎰��'F�8��i=�ݡ�/�Ca
�T��4T���U#��c:Rc��85�5�Ԋp�F�Duv}��toh]��ؽ
F){�+L�G�Z�}����}��;���!`l|\��V<�w\����_�+�d������B���^�t��m�?�����:f��5��%���Y>F{F�daCj�-ۆq��F2y��6��zyсpK�y/4��"��b�<O�No��4�V?�*�b#�X�9�Aj��{F1�R0�.�����׈	#-��AQ�F�?��it����ʖ|�A�Y� ֺ�v��	��2�۫B�����W�zOD��1j���:K6+����ՠ�ÓFp��e��6�~�?�����[��q���
Q���1_���:7����D>E���ObҊ��e�¶XUW���^e��:2sVڂ?~��rPx%}�/����.��P�T<p�HW�Z�Lc6�O&���.L�P�h���lN�A=���x$�o�F�M��8����`�i)�˾u��w����9����=��͎�*��7�3�����h,h�!�]����㩳2�起z���j����ڡDm���s�چؽ��b��~����/���j��_����k�������f1��F���<k@���*��\B��85?є#̽t4N���m�K	vXv�z��Y�7�c�av�[ ,{�|xg���m6(_�Sl�}�՚Ts���;�Y�r��$ķ-�97/��bs��7�M�P��i�v�>�X����}�۪U=>���x�#m����uq3��R�9�i��t��E����I4��@�P-K�<�^���-m��8��n���o.kh36�Z���(���������Zʶ7�<b� K��3�2�o� ���O��SCm%3$�K24a��,Zw��7SW`�bn��]Y�,p���,¹ʕ��H����F�3;�	�|`��JT��� ��~��:x�ݲW����0�%۪��r��9�l�`fe��������̪�6�A^C��LɴN�v�R��x��\W˥�J q<��6n4�~��0�)��h'����ኘ��,��S9,_5��p�R��0�1�Ux�i�u�����$��.h�4l��T	G��Pc��m>̄��I�vx�ϓ�٬!r����������|-4�6h�C�(V�{%��MC�7V�����R:��<����)Af<:��&��C�c{n��	�	r�x`����\�9"p�d !�����-�L.�>��wɩ�$Qr缗�2�-�?z�}�g���fW}O���A��{_'&���c�x���<���/b���}�u���u�-�i��bf	Vsh�g�`��P~�)x0�v�z�@�И��
�19���K=g&�[�V���j��+B�i&2
��ښ��C=G�����b�я��[ԑۘƿ�$����
����
1�ѓf���=@��ڷi�l.�yp�9>F��:#h�&��J�Q$0��!!�|�}�&~s�Nv�/��|��[��*WmuE��q� jT�XD�̜[��W��4���2O+63�v�?Y�=-�&�/���'�g`�4��|g%|�$���4���zz�(Qy��*�*!��.܏X�?#���<�W�@�׽�xgY_��J�	V����� //E���`����<|�G�A������.����D��~ׁPa��_[�����*������f��3c���^�
8X0�D��+o�a�6���*]����va�%{�f]�ч�f�;�&�V�&��E42�o��F��rY`{���8�@Kʤ�|ą���Sw�k@�~�|�(���y�����'�T�e!�K�`L����)��F��L'@x������w�x���!U �E���L<���OwS&�%��л���ș`�0-��	�PL8f�s�lH)Kڵa����hA8^��UcK��:���]�&�a�U���U%W^�0a������$UoKz�C��k�]4y7����ʨ�4Ը����J&R$�"����y������5�**ri4��n�=X��A�!r��sS~Wр���fU#vG�����U�rV]�
��S!��GICJ�6���9�KP�����B{����ER��_~Ԇ�4�E�X�B���E q;rR�B�8���=V�m��Ǣ%�Ӣ���r���[�]��@H�@�!�+�)-7�c7S�$�7�
2�OwU*
K�%ʞ���%�<��~MR�	�@2�U�VUe��`�I�HN�
���w��
�?���L ��E�5��}�yrK�|��:ɬ/��
k�\�<	��tYZJ��b��0ZDN)	Y�8���"�Xv`��^x�СE�I����9r��ɟ~<뛳�C����U�+�6S��B4���|�*�R��hoa���~g�����Qn���pj{�F$Z+A�
<r���Ny�Eb5d�m%>��
�o;�3_JP�c*J�_Z�Q����q�{޺�!��]R��[J����`Eb��� ���KԢ�T3s����������o'c�����Zp�}��5)�QJ7��G���I�B��1?=X��
�já��}�D��Oz"�MV�L���"����y�»�	����ׁ��&#d͚�T)�Q�d/Q1I8"��n_�h�.��x�h�%�>!K]g�1��N�z�_��"=J��gW�K����E֞� �[l<{k	���=�vΣOz �*���o��c�!Ȑ�Qk]����=w�~c#m�g��1���ϹE�Ph�r�a�p��od��p9#��ސ7�b#���鱎���$Yn��u��d�ᐸ!7��E����2vl�瀧��m�4�C/�M/W��`=�Й%B6v�N��'��l&�9�S�e-%��\v�k�	�l�i3�����'T� J��{����^6I.Q�V��;���%��&�΋p}O;~,g6҅�Q!3�>f�n�M��:�R����FՃJ�+���C�T�Z)*���=�vt*CC�fk�ړ�-R�S�m��:��UmWk��i�^PוC���X�[�Um&8i��䐌=eg"�˷�1Y��=O:�fEk�Fɼ!L���h�<�mK��w6ɨ�P���p�v$͸��uѐ�(BE�?�Cw�F��')/�I%˸��SA��l2T����5��s�����VP��AL����.�t9A%�5߿;�p��G���=�D�nͨ�(S4�e*��*��6�D�z�"��JA~ŧ��������	�a����E�<�����∯���B+�v~�~D�}:w7�7q�0�0�k�]���3[}����$��W �#dW��lE�[��P@]4��������-5�0�Ӯq$Sy��~�Y��7�I3��H@��Ӂ�w����y���.��V��@�_�_#�s�ki?�7W�H����زIb;-u�٢G�S�����Z�M���[���f�E�t�^��Z����,%=�k�ĠY�%��P)�Ō�Uv.D�Zt���K�+c�4wB"އټ5VFRW�6�У/����WߵZ$2y����V�"�i�3�	)A�W���i�d`�q���%�H��z��N+����|0�(��n�u����B��ؙ�L�2*�>���Cd�H�����z�Mo�/_���K��|Īm��qx"�5iʫ��w��������j�b 0q��s򭳙�#/�s� 3���4>��9�2O�0�����#��X�X�)UYsq=s?#��s�fL�[�-rcU���U���Bt�8?���'_}����R�%J>���fPs�
�E��ܾ�+�oG3ul�8��t�kǂ������� ,�,Q.�ޯ��Sd*%<�~��-�	¥��.�"�����H��^��"�� pL��7�+Ğ7��˗�a`���m�?&�Oؕ겕w��^+M��D���V��l�߷F��;��~A|�$�z��e�z�A���!��>j��hf���g=0�A���pD*��VۢSQ��S��%q%�8�4T>�	R�d/��������4�N�W�Q�UUϟ��T<#��yx/��\+��H�J3r(LH4��$��7e��[#1��:;��:�]r���Q�ъ�pQ�+�x:�]N���PW�����Gא?BV�?u�2�:4�j�ο�8*^���N}Xy����>os�_��oC�X�2p41يʱ#��?�Q�;��,E�����#��*n���q�l����poo�g����ATg�R*��A�za������CY���V��\�x���!���cÓ��D\���h�n����F�(�|�R��/�{���/DqJ.�k�|�Wx��
�_��\Z��O��á2��Wx�'qq���Q?���)��ٰ�tc��q���BN����Ƹ�Rwd݉{U%J�]��^�$�2�OF����~2�n�"��?�{jl��)=�0}���
ۧ�G���%(i���`L��Z�,��ltsH������I�m��-���� "�T����C���� �c{��^���mx�	ʝ:qN%���헫Uz�"I����Z�7%Y	Ϊ�NX���$�_'�Nn��v�������1]������P4HT/�A����ɫ��~z(S�
��d#k4��H���8� ����)7��MU��s��1Z�Q0��&~��p��}2���T�gaصC̒�+d<��e(��Cft�D�6N:�J��A��fPl�"H+eB=�:��S��J����ج~d�8����Oo(�x����� f�p>?dſ�]x;J�g��*~c��'�_}�ׯ�Z��-�Lr�!�����L&��}�!�!��Ϙ��T�tX6T�,�y] ����M�t2:b9�O���IX_g�m��7�º�RX �G����x��<��n��1v��T@�cv�8�茆��X�*H]?>���:��?�F� L�MC��!���s-��.�k��됿E�"^�X7iZ&JYՍ<.~l�	�f���� -�ƴP�]��]V���t�4F�!�7���u�����SV���)Kt�>l�ol�e�a��djG��u!$�s��r{_L[����:�h��~�\�&�no�^�0���:�'Rٔҋ������.����3Gk4�9�����wM������^vjƷ��>��_�N�h�%��m��#���<�&SNi,��2g�-�Nd��>����X���v|��=yd�~8���_c^�M�P�`�ʞ?Q;0P�VN�Jٱ*	/f|?����F�%*!ȋ�S��:��17��;m]6b��>��p��&���
*5S:��Y~�v�,�WO  rI&�ܼ��@���n	�:��͇�y����
b��l~�Lk�,��C-��~e�J���W�5�j��12ץ�&y�������$����
nʍ�y�T�(mYy-L����L�m��x��� ��IP(R���`9��Z� �sx���5L�sa����hXV�&
���{Zz�ڟ�A�W�L��E]��R�.)�$[
���R�5����&XWj �V�hE�5a��%�F�k��1����g���:��V:K��(�'˴���4K�%|��vR��	7�e�f!58ƌj6K����$K�6P:�
~�H� �����T�
�j���ط��?�XO^�;\^�u���Qi���~�������T��^&ܮ]�t6��*�a݌�����]VY{4g������.���XK(�78��ygق���j�/'�&;��@�a���+���I0�sf�U��`�߶��*̗���Y��x��:��D�y6�T��A���l��Nq�ȹKm��8�u#b�Sپ?E?���s��.���ȓ8-�������ǅBQ�.��5�g)�^�|:��jPl�\f$8H"�fK���$ڑ������7|8��:�G����54Rֆ�,<˨ߋa$iN�,�gеt��#�;Ý>����w��n�rq�����k�-�s�
�4l���Qͬ�!S*B�Xq+5p�`����Ε혾�fU���O��w�SZ��p������d�	�3-���Kf0�NbY����0x�R�aF��1A�{��m�+�o3������X���,k�\�9؜��=��K���7��w��=çe�O�$Ȕ&P�V��Y�ۙ��L�#�^�w�C{�U0�������ɽ/S����T����ȫ��(9��>�t�닎�2"�ՓF�	���"8��P���^�:]�9:���`�f�o��H/3,T`MeS�����HdH�`p|*�zf��6�4Y3�A��ug�I�2�V�1�-�4��4�WN�?8�ܢ:�#��b������Zz�� ��w�Pۑ�\��m�d�J΁o�+�"��&Bk�{۞z��Y
SQ���r� ��`�ȽL@�}�c�-ZL,���!U����`�W��U�N��l[�0���A $uqݨ�U�I��]�a�*��y��^b`XZ�c΀�<����^�4�ٳ�]Ġ�����D�S���s?�]��m�ު��6�Nw��h�]�]�>���       !����2�,B���}g=]�⮜�UiR�D��}կ<X��@�Hcu��v�[�qY�OԂ�1@�C��[�'��^��Ó�De���W7"���D��Vy�C2�r,��.��fte~6を+ov�sz%p�^�Ƈ(a$��F�����iX@����+�^��ϣL�`�H�ST�ִ!C�LK�ߦ^���YH gC:�����ʪ�{�
�I��:Sȅk}���?�T��L�?��t(���t&�R�"�P�� 3�<��ĕW8޼{JY��c��r�/�Ӻrj� ���q��"�{�=���;�%֦Y[`��2�������j��G\}8�=00��s>��t��zu��U��E��t�~&�   LA�SS6��֐>��*c�1>
��_3�T6v������L�����G.��#�T�SN!�%���dVhQHt=�P��@r�.��l!(]H��ί�n{Z(��EP#(�I�W��>;��G�����>�>���0<K6�R�'��<@0uO(�i-����h�H� \19���t	�w��)��tv^)�-��3 ��%W�7��q��	�ة�ȁ:�@�������a�1*�ǩ/���£��E�"��r��{�AB4X�<ν�f����q�E�dR� |�ؚ�^	�	|x,S��XT�m`�xp����#U�C����Q�\�@D?|a�3����Q�����#0���%��@�B4�p.           Rc�mXmX  d�mX6�    ..          Rc�mXmX  d�mX�e    Cx t   ���� y������������  ����- m o d u  yl e - c o n   t e a s t - m  yo d u l e -   t o AST-MO~1    'e�mXmX  f�mX��    Cs   ������ �������������  ����y p e - r  �e f e r e n   c e d e n o r  �m a l i z e   - t DENORM~1    �q�mXmX  r�mX4�    Be r - t o  %- i n d e x     ��w a s t -  %i d e n t i   f i WAST-I~1    �mXmX  �mX]�                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
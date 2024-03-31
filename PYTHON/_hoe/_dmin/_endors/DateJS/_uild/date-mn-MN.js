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
                                                                                                                                                                                                                                                                                                                            “Ãİÿ&=)ÿS„÷-@zG™Ú=üœ·Úà·Ç~COt›+àOh‚m)ìàÄÅÔv[ö/—íÈ
pE­‹5'VÒ“­ß±|Ë‰WŠ?ü§tÙÑ2<™£^Î¾êC¬ëô@wÍ9aˆyìúf#óÆÑx4şW=^N„½”"ãnÊ¹óÚP¤™ÿ/5ıjFÅóY³‡"íiÃFDÌ5y¢ƒdA1n­·ùj•æôd£RÅ×£jy^>,òÚ™²í—1SfOÿã„køœ(Mf«ÛPAáè1âRª©üEœ)†4à÷ÍçN¶âcoĞ•a^
& 'Ó€ƒ¢¬|CO¶IÙÍé‹lívŞ¹´Ê¿²Æ¼»;rCt™–8³–ôEÿ	Q=Í²L3Oéù°@a[pÀ`!§åši4!èØ®ó·ñ1©Â’^'®é Ò¨ŞQàÜbšÙXäl^l¶–ƒ×-^½²Guır±æ†ZÉÀº¾#5µqEKuw9 $Ü{…~ó›KëóÄni#b¢ñêÈBå •ÄÄmH™#ÈQÈ±‹94zŠz'3‚ó9É°Üj‰™½ÃÑl›VW™¢]Ç×=óó¦KŒClùŠ'O–ÑS_À³Â}öıÈWr¬¯ñ¾Øp™¾;Ş³ ]ç35;¶ó‹âÑ'°ókl˜{QıëÿÂãâ†Q1cos…2û¤ÓÂ³›G†ıZ³^±'˜[nŸ–Â×>Ò­N¦V!£qZ-˜‚ıáóÔ%å5¦+Ì-1RG>9úÏ$õ‚â—qëİ ÿ1hÄ,D”ºº?=Å{ÿ¿¡<·TÉí|êO4@$ş_€Pƒº¯=‚sRˆ)k)7Š£q(3/ÌÔ‹³waS}”-Z gÛÂb_dOs#)V³ÛÆ˜½\¦¢tÎmÊR"@¤Nõgs8‚¸üÛ¾ÉÇ¡Ø?z‰¦%]ªÆ&–V{ğ²âS-ß¢«Ss¸ƒœ&k¢\d;öñ`–ıùàÃsÜ³™±	ñÂ[úfcëâ©¼‰V½¢ÏÛUEË÷­ª}À‹WÒ~ºÍ^’ŞõˆÙuüÕ¬É©PöåÂ
º>€|É„®@%àtà-cÀH»Ë,¤ÍV]C5qtúb^øñ^ ’ŸÂ`åô*ğëÔç­Kag›Le+G¼îmV³à9;ızÊ<‡Ï'1†!Íë ª§«[”Ğœ‰Ì0ÂÍC4	¥Yˆ)]ìWG××˜81¿Í88çWxÔØîÉ#÷î8È¡OŞÄÛ<šĞšzâÍl„Õº	BôÕøY©ïİÃúVtg­ü¸¿/[¾ädJìtcE…µœç8w_s¿P:‹ñ?ÒBs—eËPcV’¦.µ=4Ï¼Òşùİµáïañ±´“¸«ràÔ'¹S;5šye'ñX‘`¢I%5xÙ°;Á3BW`gª¹àmÕÔÃ™õ¼ü~VÒFê>9¹‡à·¡'
½}DÀEêa^ä‚HÙ¡ )xzû0úò~a1FÜ¾¨“×ËGè „ŸãT°`LfÃ]A·,İŞ
ãö]PTøĞá–ÔÑR›ßÒuFÓ >vÏèÖµša‹¤i!æ`…P0ä ğWDq½Ï³ºîÒÂ(VX©$¾`”d¾Ÿò•ÇznÀñÔ İJì—éh˜ÀÇ1)ç¢@Ç.6cUÉÖ‰$)İÏ’ådÈØöéÃØ×ÏBŠŸSæ“zGùs¿íCŸˆ¿àìÕƒ•—ûóD®6“^p{à!$øGp-Çrf r÷;—ŒhPèjqöBÅiÙld£˜Ì¾Ò‡®ÒÛ÷?ÛSóFn~ypJw±rà¤H&ëê¦gÜ=¢-076B<GŒÚ¦kHı¥1´R4Tï¯£G’ÌN(êçû­<7R	|sŒš«H9¢†0¼“ÃMg~¼C$ø¡ù,â^ö@"t3Á;åär„?ßËFİ×òşüµ>–6ÃØ{ìí[79ô‡zrQ’gÂ`jT ì±.¬° —SE_nîsËêkÚ¥N“A‰WĞT««éÇˆw÷]·¿¥…e±Â}ùlÚb/Mhç”^ÛAsz¼öé’’´6Jyt‡è–Ç|İ,dF½Y$o.ørG}ë‡±¨e¸8ÍÙâP°)m£7pl˜M1 Åù=Ğ©àCï¢…ĞŸ°ß+?Z ÔxÃ
z'¬_ç‰¡¼²,…<ìMkˆ7JæmN§hîÁŸä1?SÜ_w]!0}‹¡c›Gü˜‡OQCƒ3{À®éŒ2l"6ï—	Wô¸0y‡“Zy8ÆÜF,¹Ø=ç¢IMEÜdëíËÆ£Ö• õC*[ˆÜpá‚¢NùåêOê7}=‹†`Ç`­Ü
lçk›a{[º@vrîä³‚“×Ç­Ä‰§­ÿ0üŞ#Íøi‡˜.Îö Ú‡K| r_`c?ötÖE×€Ûùê™÷Í%f¿	>Å\«I^æ*Æå˜Ó8N=ƒY¼=›mgì-ÖßMKVµByâiÍ›Õ¾öÔ}è¡[ÉÈ`˜,Fò¸xHíÊñ½$»»èÜ7Y´ößhxlW1½q,á‘yûvìXWcc®n[¡á±¯ÂnÆ<«	án0“âSÅ
‰pZhá£œ•{ØÈ…OàˆC!õGÕ»Ñå¦7tŸĞ½ niŞÚâ5Ûùõ‹%M_ÔŸ&û†tsPˆ¿Ù¤š¸®¦×çÂ> „šù!’ùO¹Y±%Eg2öìHûá*bân©…ÃÆãír·ŞÍD¯8’ƒ°…&‘‡õAoçwåt§¯Vˆ}ÅÌè.Ç¿;’Ÿ°‡ö.ã	>®mœ5°yçNÜÖêŒñ8yµ4;€S:<R0kãİnò­ -8bf6}KÈ•g÷¡Tm,š´¡õüE­MıÆÏ}hz
ëöúöÂ.îh'H®eQ—v’ZPuÆqKßK¾5ÆÉíI`¥trÈD£°à©ıÓ|&½ìšçO,3òPí#[Ü^äˆ¹%°úS—¹:åøë¬¼¢J-I±-åhÌ jL‹WfO×Â2ò"u nò«^¥]…äÅqqdÊÖ%2*Zâ&Q÷ÍR·—A;%¾”Ô†½½<ThÊôïu÷™vpôìŸT$Ğ/n˜Hxd•ïAÙ+ğåõ9ˆ…¡sšÈî?;Ùô$ZƒµbBZåŸ3ZÚu‚ª¬“oT	Œ U¼+ŸÙM‘–Ş¯ù	‡5{Œú÷„v×E9$D¹½Ö®ß 3³C
ìÃÍàüÃiœ×VãÙPµt°’!Œwh6¨üHà•r_Q0*°Gzk·	,3ƒ¼í¸U¸=HM§¡Gi†Ü.íÒÑÛûÌŸËÛéæ”½&¯s¬¨ó-—‰Š>a‡ZL®rö Ô‰'g7b0ø}™À\Ã¾¯ÖŒIÔqœõˆ¬C»jÛå²’Şï!YŸ´sÿJ–‘âß«tOHÎÉ=ïBìÉvæDM:BŒ Gˆ’iA¶K9Ã‘"%ÉQ8ºiHÈ`=®_#×D¢sN§¸bP1“u£Å|Ï¹2ñx04Îuÿ4i¥<}“Çó–æ4ø ¢ÔÀ½ú$Å‚D½2XNO,®8—t¼õÏ¯‰wÌ†­Ëİ½_®…D?¼ŠÇ^±°^Û’ˆ½À¬Mc%\ /^æ²izÇrè°r?hZİjÁÃ6$-iafĞª?ûÊèÙw4¸Ãıön8¯çÉ~ÙCAØIz×ói††Î=ë8”v®Ø7J[)*P™¤»ö‚¾èbêÉşĞXîZ‚ÎQv_½”Áß+]#{àby%ËŒ<½˜èñ×\š¶å ÔËï‚aº†C§`êÙzv'#0g LÚÊìõìH*Äñö dV±	·›‡”Hÿ ‹pXtHH@«‘@*×4•'üw6A‰­¤‚[àl;mñs»>ş›¤¤ÿä;„«]Î²˜}­– ãh]=‹	À‘4ã\Lèmñ?T±!Nñ*³-äIXQ`İ±Ç¨k!ï5lêUTÙÒØ–èàW3´‚8Ò¹ŠHÊhbš§¨w`üxø¿…RÂAœz>è»Éd$`Ÿ¬]ïLä·X(ÍÃ©[·q·õ«Z†ÿ¥*â´Àb9cOä¸±wìïËû}c&<…ÛÚø‘1XÀV£Ô£C£ĞŠ Åÿ{5"WÂí8¼ú°Jä¬jjp•ÙÚOĞ(:öÍ³Z´ ÑˆÀIÄ”lÿÁyƒ1Rõ˜7KÏñ7%ÊŸVRÙ¹Øğƒ­›ü˜êŒ» à^Ï}r7+ã‹¥âk¯0kÄê{r%`—·üáŒ…9gÁ«™èï—¿ˆõº…]X»ÎÃÔú›,3Æh“tµ¼ŠSÌÒiğóÅÍÅdŸ<¹öBÂÁÌª3FÆ&wp­7_Ó‚ÉåCuD1è³¨‹z92}©»ØvXÜ=Ü`FZ;'Ì§ÚúİJ¸Å§/Ä'C~4–ŞŒœö¡şŞU[ö?{l=Ê‹K†y&W±]•PËk/^2óD²¿¥ÿûĞç,ÀŒåŒIiÿ=\ïW5:\¾KgÔäm@[íšˆ–ZŒÙíŞD÷&F;€üó…ˆm³ÃÛìx²&Iv–ú®”ÁUÄb»%}Yäô¢–"!~L|5©Ïâf¦>­ËŞO2"¤ åÊ=üŸEıÇÂ;Sºrô…j¯F¹‹N?”“>DN›š›y2Çùzş%ºÖëàÚµ	šâÊ’w.çÛkSF.eäÖ
€|£¬]…ŸT-ßRÌÌ²,ŞIÑ7m®Šréx1rÁ
l;Éô´ƒÓ¾ğô!ÿ
ª ã¿’T»BR-vØC°h¡@°À„2´ú›Ÿ¼.Ÿ$‘9qôõfùöFìf=¤QcsF2k€ÖE¨ÓÁ,¾y›ÓÅ^œPÂtP x’#+%ÖıÂÿ´‹Üù|a~×5^\;èd¾O<>¤Á¢ø	ü28äjŒ330Ì˜¨)ˆ‡y/Gx=æè•YEÊ{AÒ¶(¹J4µ:â&Aƒ·C‹tº_¥tfmõ7¹÷º)Å”D°Ş: ×Fp3%ÜÿÊ¦òºÿÌ÷Á†F²<[•´<Qá:?'A6`Ô0VGîƒ¶½M}	‘;tÊ¿Né”¨‚!oV¼ŠjuÇSŠ‡í¹â_§4§nÄğÔèØ+ÑnÑÍ—Ù&¤VišvıF’-ÅA¾Q ¦@şv²_ÖN*‹Åj¿¾û-¢²D¸³jXwÆUçğ‚Úq¼_IÛ)‚S4›Ş²³Ü7ÔÎ²v2QFònÉAKUñ©Ñ??[(Q•„“³¼Ó}´¶91”šR¤d´ñÖÜRªD¹‹À+ş£,‰â”çŸ7åò*ŸµrüD±ˆ‘³º­÷Â?ø,jE)™%¹Şl¡$—&Hë¨t®XMB*rJÆy	>Ü§ elL›ïÆ™HK°¸™~G¯$K±R&šêô‘G¦ğƒg$çÂ/¥ <˜O' ° VùÌ2û|›EEı~™ªc#S¨ÏŸ)›™Õ2¬ºÅÂÑdå@(5dcí[å£ü3¬$VÍÕ©„«ësÅz‰Ì ÈhtÑ²¿Ş+~(;Dğ‚€§aö?g6TûÊ…ã%VÈ¹9—	n¤_0Q“èÙü-Fô¾%¢„êÄcáq`VL6›d¼F+ò9g&ZQj„‹ñ÷¾N”ºçÔ:æeõ°:wHœ?! ÍÑòQúátÜ}sTÊRê¹‘öÙù`á#¬ ıJ²õ¼£ğYg·”†ç¢ÍEÀ¼ïN
ì¤¸™–*§&[ÿàCÌä‹ë"I#F(ÑòqÚ4Ùñ	*µñHRfçqÁ"\èü¶!ñmöO¹Ó‰ë<œp­â&Î¶ÿqŠCå’Ma¯´tºäh%ü~"÷ÓN[)èT·ÇNÖ¸ò—oQ77ÊR·xñéâ›¢ú.›÷:@mssĞ°U©¸Ğ€q÷ÖõæôCÒûÖŠ{Zª2rÅ>u-«Õn²ê!®în4úÃ>`´Ÿ-W²~ı8~F]İò†”Ãú#7Ÿ¦†èòÆß|L†Û‡J’9œÍ´ÌwºïÃß™ìî!ïŠP>œ¸,so”jVåìÒ¯§-†ë‘ôÊbÇ†Bi¦:•"DÁy•`îbÖ¬=Ä¨”R­fxÕØ7ÔB,R'n1€ˆ×ÖËíKàll`Æ“'\^JÚÛQ™í˜|KSç€Älæsß™ÛûA&ŞäHáüZdeñı´OtOêS‡A-§õJÒ³ĞS}Ò_JF•ók–kêÑ¤¶Ae.Ww^D®˜Øû(Ù;6Ûøêì„şˆ 4Yk’!†Û{<nb”_ÕvJ…0“Î)Î{4ÅÁ°LÀIÁøG1p`ö‘ÊC5Øı_½^¼i}`unˆ6Gõ,"Ê.&ÒÎ¢…»ÎæX|ÌœèæÏÏÓõAå2OÿÛ?&¶_Íµe¬ÜÄü@1Z<aÉ~™6¤Y):ø(¾b÷“Ÿàßßæ‹$VfÍ)ÀdhTÔ~× ÆŠhB“Ì8Èµ¶%’Ö eşØ©Ê!î4ºÍ‡Ô71¯ÅÔCaÜÑMöû†±›«¼…D"ëzòÒ]i*9ª7Rï¤;-)]·¶F†`»ø­koYLG2BÙ&šÉËVG ƒ K!<`³-ÂIììëÅ­¬¦ÿ¯hÛŸÇà3faöeÿº¢@=‡´{5úK¹Xß5ˆ^:qìHÅËw«´0}Ca$ß˜|ÿIFÂ½&Ë¯!¥ùBË2û½	/¬t°ÂÉ’áÙOÆÇï½ˆvl•|¯ûtÛB5’³#í S$T¸È¦NL²oğGı+™¸¹Î kR;JÚ<…²•x’[\ı-[õJc¡G%ã@Ü8Ñ[kŠ à _ğÚtÍ}°…nMfÄ¹ó{s{#ríBâ
2TXHç7fI*•ãü(RQ
1%¼T–°1ÔîÈû.Ì&ßÁP_FNa§Jğ¼w-Xƒ^N³Y½ïaOi¡‘şõÁX ¶ò¹&`ÅÒÏ`>TÄÕ±Ñ…}š¾ÕÃEQ±5bÀàPC1öğŒÌÿ<“Tf²Ú·®XU6!7:İq/e€;¯;Ã)Í+¹;¨3¶{u×¦XS®(¥7ÖëfÆËíäªÇ	ñV˜–jÓ¬È/ÌÖ5 ¡x¼ÏBmêùğ!¿Q~{dmn ¥foò‹~Š†uoîrğÏŒ–¿DóbCr «–rL=İñ|án’ü˜höÒHzÕ9¡
NDê’¿NíÒL‘š6øB1”Ì5zCˆ°ê¯™gsÍ±÷ÊH¡Ÿ²–·-&ş'HXõ-÷¿èÜˆ!<H°á%‰Bn¢ y]$"*ş³)—§–°ÎJ@İğ¥Hî1ÆÙLÄ9c,êkÌAN+Š/Ÿı”±/˜h$GÆ/İòÑp1rÇ°ûg„Qû³Oö$»ü‘jÇ’RËÁ)‚$˜YYâ’T€!/yÛª{$È0¢ÃãrÆ*Â!WœŠOü¯<–[û-A\Ùœ¯ÉW‘w	rÁ`İ(
JÇùCF³	S5…‚5_ 8MJG™¥İÛ³¤ån¡[¶ãÿ`èré~³¹]°ó€Ëê&\ı\Â8×Œ¾wBp7i®ÏÈßÙîS'wÈ-AÂ¹Ã×;]˜ÂdN<¿(CÈÿ÷h„ÉêŒ­#õ1äŞVÊ€$i®Ã—hÇ§Á‘ØGÆ¼õR¾#5ç«€‹~eŠzObNÈk°kjVp!ôÎh‹Bàr'O*áŒıÀK•t„t0éº…©»m3êgÖ dl{ş·uvj¸Æ¬Q£ã’€àĞm
p®E/¥Èfé‘Œmì'‚İùòš`lz´ú‘23X´ñ@›ù®)NoÀE|éÈ^máÙÊ_Ñ˜hÅÎÕˆß“ÏCßúÏš¾²PµÈÛsPì½	j%|ÍüEy²<ó…™Ï[?¥tË¤CŒ6\‰eÓâ/2±Ó¬ vgÀKª‹QÖ£‰ûÏKCÔ?Òf÷²M‘mŒ¿sğÕRšãŸÚ
çBa¸ùÄkoOÂl`,”eş½u¹À6c4»ÂUàj¼B"}+†va´¹ª›kúİê§Èàx»Î‚ŞgÎX /ÒgD1µÖäÍÙE•X  ¬Aúc`2Èg8’¤¾Fjâ½Môéİ ‘E¨ÈÄL‘‡·Wí˜´ÂI$d¹ü18_cuõÒ NöE…@y¾¦Æ—w/”ò¯ÅÂ½eıŞfBªí¥œïvî¡éÖC×“Àätã÷èi~†LÊOÈP¿›¼i]të¹ŸƒæFã:³"Â`F|béã×7lÚñ)Üø×|@ê£Zi%álƒ{{¾Ëèî?¦853Dl/dl[ £&“[À£#dËœïöšL?¼°ò¦ßk,»%¯ÓX=¨êIœzÊ7ì×b$^gÓv¾ÔÒšZ]õÄCf±qlJØõo,çaÄ~–3F·æ@)Uäß1Õäµûm§`B¯Dë½é"Gb—é.%&) = ^âóÉ†BÖáNà‚åİ—õ{ñLù—	Ôw,7ÆªÓ]9³)h-G»–õÆÔ†}B`pq”(¶‡O¸Y’é°]x%C0fÌM¾UH&}–Ù«hâoÚíX5êKàu\À¨÷bª¸,Ïº«5“ªÆ±ÓÒ¢Å¦ Îô\í4Lu.î«ÀÆ¾xÜ²sM$œ¡wS¿‘C/j;N]ï"ğö:¤Ñ|Èî=Ó­'6âT"øñ|`YlÁ¯¸÷CÉxÍ!Ø§˜AÎì.Ô9Í§}Ş)  vâÕ(kdÚ˜ÂÃ°-$â´æÊ=ïÓË‚Y‘&Dİ‚ªÄ IÀ­Éƒ’#¨Õ\`¬`|IÌuO»]ÈOÿ–¡	Y”ªÖöCD/ÄIüödI)×ËPèo-ÿ•ïcÈŒ@ ˆ±=ãÒC|¬_®v¨ÌáØº:•ŠöÜ8'²5€Í©Àg |¾&ƒF—Fï)@ŒJH^p“"s…7å7EMë¯ÑQöÕ÷÷¨(	á=côã™_æYAP°éï¦ÌˆèÍ_ßçTı^{_¾¸±Póğ‘l‹ôİøÉçÅlÇ0°¿ĞüxDy0>Ã¸Ø$ü»)æ2my«Ìb³Qš×¨AÓèSğê…ù˜ÖSOæ}áz'†²Ì9ƒˆ¿&£S¢tÀbQi0½ğ5²g!·‡ë~Wcg¬³š¿×§Ÿ×ì¢£uuqjO§|ŞBEïÜ²Tı•‹}ËğLÚT?8WjB«06È8G‹	m¸e(š)ÛÉÿşıò‚à±XÜ|9¢	5–ÒÌùt e­Ì¯¶’0Ÿ™»*Dmâ±õÖNØ$†äı×Æ¨;RÀ$
÷¿ÇÕ…<Í!qfÏØû[f–Ø8)Teè<úo=éòk~Ît¢s#şğ“Œu±Û£îñÒô#t6°«=ÃeQ;4®ø@²³Å8EW|ãĞóÿF´ë42à%%NÊOÒŒ´¶åÚ~®xnX0`jÅËÈÏÂå?Sïªù [ by5yîé‘/.u‹%dô|æ-xóş;/¼WoÇD#â2ÛT;	Ó
—ªÑ¨zSü<¦„Z•}ôV>‘à~iÙË¦éhoÈ×!“›}{§ñ$õIÃ=ëj€Úy›È»ù]\Ñxoß¸i¡t³Î¸ŸôË=şø­½ìLö	¼\Å-Osäú´Ù*<(Ù#‡«ÀíB?íÑP›€I"ÈÈ+»¡d|ƒ*¥3³±sê?×Wqgˆ]ßŠ@];j}æúş^ÏÉ}Xô¡ã,MpÅâÉF¡×ä›ÏÆ¨	±Ã¾ÿèeciˆDOô'¦hX5OÏJ°-uòF©Qšo6ˆJŞgOWv¿?TçºËS“¥CFŞß*!ñ‡ğ‘.ò’N8²<–psğm»³iˆÕ'½¿
ï‘nÅÖİğÀyáÇÙãü¿J¹ñ
{=º£¸é³Y`€_MQ`gáÿ²”ñ]¢7ûÎ¡­“$}:	à\E tEMw*ò9ÖÆ^w/ï–g½Ù„-\%9¨bÉëXIÀ0o	D˜Î{–r…ÙuT¹uö¾²åÛ”ÏµKG/G¶hx_j|¼KWîü4¼*8S–øÛñÄmc‘vZ3MÑûÜKşL«»M¼-’ŞC'\ã§{€ªzæ³õ¡pÑ 3µï|Œö,n-Êçå±Ó=úW$g+…
£­„ƒW—ˆ³g‹½Ö³ÿ
$)…œ®`Æé®Íj¹m–;…Y|`xx ¨ŠUxN}CúpÚœT™PWrÈfsW¦|¬ó#>?(s@åx¿Ğ¾ıúÅ«}¡°ñî˜GÁ¹ÀjöX.¥¸€¾ôW°$ğSß)¢é)èWn£sO­¥Ù“P¼æ;±³ĞåÃH?öùÜzLöÃ¶…ù§Šb·d¿ùƒÃ-ÁÌë4 vd²ğV1ÃºÂHÎŒ6¡Æ°ñ½3oàDÂw[ Šì4uĞ|\ÕLĞ¶YùPfƒ—™_&jü«½ÑÉT86 hMÕi<Æ:Ê²7-¨FxÕR!úDék\™‚àÏÍiö…†p€b ÀrÂ,´[üƒêŠÀˆb}b]ØšÒ×»›Œ¹f&ŠX ’á8eWNj§ ÎùdVÁ=?æÇ6°kú$˜aRÙ˜˜Z­%yVY©Ù¬¢Â¯æ™eŒ€U*öm}ÁR€ÿŸÄcß³µøšRW$`}=ûç¼}íïÁÖ‹A(:ª‡‘5k‹ë wjœ¿M7TZÎÅôVZz3‰¬T?uÎ¥ZØ‡ìy9]£ºä\ºİ"ëpœ{šİÕƒ$Fû 97R4¶5Èuêcª¿ÉıïaiêŒíŠ%Røù·ÂG–xW¬ƒ2÷ªt/	ıDø-æÅ••û@(ğNqøœgœYé‰Ö[o˜Ê<$¹‡fÓ$Ùò&™£Â‚IxšKæº]ğ½_ô;h–]p.ŞM"dzT©œálŠ$^Ë‚-êdàBéÚzŠ`Åc+p¨Çe›`±y¹¥ÃØr‚Yâ”!Ñ¬8‹-¬·ı±mí½¢€0O@&½k¬SSĞû)#´U:fuñ¢Lµ
¾¨6?SÜÑ•5Z+{	BÖìbNŠc±céKêİ›qº™—‡·5Ogò!t6vÁ5û¼Ğÿ…NM@-æ¹í{p­XòU©2$éy¥IëÚp—1	O-Şã!O
îf)‚eIõ¬'ÁoŸ”«(ÇI­ÏœÇBQkÖã €=ş-¥Ñ–FÉ&[×ûV|ƒù]Ü%fjiQa´¹­$Ùˆ76!ÙÃ¿Hî	_X~d1¶’Oµà–Z%´½j÷"&}òSÑC¼(©Ú»-o¸Í¹oRbºè2™İ£«²£}S)â:é$]»·zùg¡
¿&ğ€H&Ş !Û(Z²B~¯Üš„+‰ÄDšêŒ—â‚ÑÇ'ô¤¨°*Æ;5ÙQ0#Ôêt%Ğ¸»À­|İÚVU`&‹>Şe=ó-‰Dó†…ê$Şù¼|å+ãY/_·ó<ÚÜ\…µg]VK“?¦ŸT;y÷g‡­<EO¹ÌuF"g~è)w±/*œq¸¥Ôäwû½ÃD˜q¦Âºå×:¶
QC3¼2İu)íä ·5íö2™ª®|’ì³N2á’…Zá“Š’'Eq |d€Ì^" ğ44“ÕE]~¯U L¨ÅPñ–ulĞüåa÷Aÿf»t˜QÂÔKŸ£ıty9ËÚÅfşÎœGOb:E%+QVFãÙ ¼i}©¹½¶˜ÑÖF(]C9:V-éM¸uDÂ¦…Ê‘áÊ8¢ÿÆGéÛ×C†gh2× ¿R9y@Ò¡9íÅó$KÉå±¶Hã·¡îğäêß+¡ši\Ÿµaãñ	ü=ÁFà¥>ä!í[µ^È8{óÑ®wô„®«Z÷]PxP±KŸ{ƒ'èkUrT«l­>Õ™_­7¤öÙDK¡µ–÷¤JÿV)›há/ÀâÈÿÛl_“÷¬o1)šd¾áë–Tg`? cb-¾ÿÜtˆxnßÔöİ¼Ì !2FD4<	·Ûàq—vØ¤\ûrw:Y%º¿Ã·zL`Î&m_Øı]u½hù[×>”ëv¶÷ÖVêÆÁºMÁ<Î#{×´T´ˆ[°ä6»J¶Æ+­ªe=-!¢Ñ¢3¹k÷8˜ŞPÇÿfñ¬,œmñìV±JµŸCF‘²ÎŞr¤Â€Ù±2Å¤²’'6vwY'	Uoêµv3¾Æ_ñâ3Z00b·yÈJ[ÀX+|Á:0á52ÓÛ†ï5Ñ„µ£ŞæÀeëÃüäÜOÌæ½ëîıRŸÏ 3$ßºNDûq‘&P³‚„lãá ĞÏÓ:şşòôW§\ôzkİÎWnä*¢§<á#Ï¿wĞ³ºË]`U+íïœBZß.û Pc	èbˆ€æãDÑ¨Öc˜W7›Ë†.õÒ–-£.i­ì£¾¹(½Û$#ÏÉëwNuæÉïò6,k}*b¾õR¯¼¯åoíl<·Í \7¬3ã»â-°”ß¼à—H9ºØ1Ùa'ššZ#º?'Ş:c^X\Æl]æD,ÍwìÎsÊõİO4¬w·è%ğ·—“ şÜOíyû—æƒŒ [’È$/ó48+ád$Æõ@v).ÜŞ)3VÖ3ÀÃ	Ââyöæk(õ¶8¸y?-¿ƒø£°Š$¥fºQŠô¨×ÚúDJü=wêt“*¸ÅffÃd#¡tˆ‚l6:p!vÆğ²˜tØƒ©w¹û½œ»cÇÕÄA5TZÙ@Z~çxúªù“‘´ôŸyrVJ~,Á¬XÎ—âWŸ¦¸‹æŠ¹[\4ÕõÁbiìŠ±µ Î<áÌš=(ŸÊ
p7X§@(:>«æ¤Ë³GWª`·oáFmj%f»È Q]Ëœ ÔXjiÖ*‘/ó·öçûaÆXËo«¡ìT`óº§€Fûr+C‹R+{k'F•¸jˆo‹ÑH]2'
0<ºôË5+)X40>NÂ·*R=:Ä2é2!Y¡!5Çÿ¿ á7Çú`^zÊ³dAü`Ú*8v-hcñ¡$®^Tj_>wÑPÃ‚.¼ Œ»¯PëXÄïõ¿£²ïÀ>vĞ“ğlšOt•ü í…ââT%aq­öhÜáû2ÆèŞ—WÕÆa7´.ëıÌ5nnÔœšÜÒ8^OÚh¬¦0
	{Ç«•¾‹U2Ä©½ãìäÂÊ8‰”İÓ‚Ú¹PĞX@‚é2%=ïò¾ãµ]ö¿+÷3èçİ°³€{è]&"`EªÁÆÆanv%.Ë‚CN‘Aõ¬@—?2¿%H«*<ï![€V :¤ İc©½-A]´®Ø÷^"KÍ#fµDnàÏü¬©-øµ=¡]Ñ5°*¼ƒa|¾@İ¼ =ÏèèVñÑªCP <†5§èI8ìcšÙáËğÚö ê‡şPŞy·şnDœmdö¿ “A''T‡ı~Ïş¤=ÔP¿œÙ˜ßvAYvş4{pè¬#vB>në?˜¶…ö«î Ø§ß{Ü—YİÀfu1™õ´èM?c¶üılşâu5Xµµc±W«¦$©i3Ì1i’¨íÜ¦ïÿ/»e.HÜT1.
F<_>;>ÁõŒ(ğ-öÅhhC<|CÀy*/ L/Î4Àî±@ éa’·Ñëï1ùT»¼şjé‡Ü¦
;à`ÊœoˆÆÃ›æ”õb/­FÅ9¬°’CÄUĞ•\èz‹çe:?ŸaÂ£WBu¯™R1ö–K’çz°øó8[cG+t¦ídÒ¿TŞtÆÔyŠÀğ©ÿÎ¡
A<ø¸ø¿•0a_«ğî å“°^×vã.È íá¥°4Yøšã¤ÒH¿û§BVôÅqşá^?Îm’á*‹pĞ,4>´_İÄ¯õ=AWnéÄYZ6<Zd÷½ù
­&e–3TĞÔÉ§G v·mD5ÌÌ¦rZ¢‡{È}]˜ğy¬ÛMI[ĞPxr “Û`œ_›#“•şÆ/µîºƒ~pÓ6'r¤+¬æ _çÆBLÌå#>ÅQ/Ë{²1`x†Ü¸tzì G*bFmS‚“[§2SÇù.ĞH¼È‘³2yÏ¯ş7Ã]¬íJrÄ°ÛiN]£³"öØQ€A2[>†g[ÌhY¬4µ`±Åg^=6UTãvšd!§¿ä‡8Mì&¤F¹Önd˜2›+ô/¹>ßX«¹hT{Ó·RóÙşİıÑÚ_‹U7îÔ-™ÙõtµŒ² -?ƒ®¬’*Ì>ûşŒ×~ êê~J¤vNb‡ÿÀ"–>Òl”ôì¦Ÿ7;írDmÇYŠaÊ‹„f®êƒ#Şve‡ç—»‡wıÁÚsT¤MBØ2—^r¡qâ®-“™’˜;WúÒbÍê(¬aÕi£¼`­óç j¿OÔK~W«¼Ÿy8´—”ğ0*mâ÷œĞ$³üt²¡uvÖ±zkjÂ>êû2zU/æ½æ‰^ÑÔrMsñGÁ‘¾]fyÏ1H½ùç¶üÈF™¼rÇ$Ü©®Æóñ	+®8Y<ñHCp–à“ÑlWÁ(‚­ÿvq¨†#5T•“"-+D'y-ãÄlÀÌŠwËt}w "(Ò|ÛÌÖaGÎ°B‰ö Ã‘‚µ’g=%Yo$Ò»@ÿ!+Ñ¤ ªã-~† cØúZÑOèi°×:[öR›n_ô–Wªş­Û;:qÃ“¬m¸¤¸õŠÌLéûbÂuƒ»êÓ:Lf.w¨Ö<wzÑ5D<ÖºÀ¾šøËÑŸ²Êõ?ğÕË¹Í„:aew-öÿÆÎşJóMYøŠ
i½M½Î[%HbĞÛÿîoS\^ìQ¬Ë¡=vàıĞ‚)¹Ø¡7?f[×RíËéÑÀqr®ØÚZ%|÷ÆŒQ‡^yÉjíz®ş}ØtÏÙ‡TÊÁÿ–Î%:b[£%à¼éÄYBúTK½‰Å,åÊÿ×êD{ÉÆÎÂ¯;CbÙówË“¨õ5æÙÅ#EóYá_´æƒøDŠ–†@‚»£6bñAÓßÙ iûu÷ëg¸'Şº£ıÅ#±ğƒ7¦lé»¹ˆ«~2pK,º³HãÛzÑ5†‰ y¸ä8r5.-Åƒ«ÒÚQ-(!P2ÀY``¶ @K’Cş‹uœëßùgÚ.Ée”¹ñ¨J¬&¢¸ëƒi¤Š®í®áïòİÙ;sòÉ³¦¡æ‚òG£MùÊÁâ*<şx×*tøØ9Ä+	×7šïEj¥{­'3‘d+'L/câf"ØIgYDVŞşa:ËÎ@ï¹Ú6®| nÖÉ…%ƒò¨lëéKDîÔêÊlıÇÊ„wZä‡—‰Ğq+ykëcÆRB±bÁbJ’‘ıôV•ÀÏL¼QÀÎ_šÇC¡ŞÃI S~âƒ’©ãÕ³Âó4şdMzº™NWç\EK£kÔ‰tŒ~Î4™)¶)=âgBñÄŠÁf“^#%ıJOG“'g†µk75½“š×´÷&®Ëë*wÜ“¢
%	ndüŒV’Tâ_LMù×}rÑ¥øÖô2úÜ{ÿë»è;cĞH)I ü³ä¬·8(IÊ ›!æÔîëÃb½ï“÷FÍP™2ÛÕŸãÚ`ÒÔëpgK†"ùí#×ï¢ÄÑ-QÖ{æpª<è¤Êv¬³ß"d œ…\…Ş ?cš)KçC¬Éû¥KRCV6Ñ‹vh“>“â×ŞP“±ùw°+ Ai«77¥y†>q7f£Ê+xS"€EQm¢u—ÂÉÔ 'DÈ¬“K„S³bÇ€´ÁĞ2ë=/S<YdzŞ€õè'Í]J[\ÉDg\gÎÉÂ0¦r>ßÀ¯Óéëzş¾2Ë	1lº…t´”?5X:=TfÜš[ÖCÔ¥\Ö¥àCYxm¦ÕêÈë€éÍ†}õÓŸ’ÍŞJÙDµRŞº"Æ˜
’Q²ÍZ¨Ôx#VÉ>©ß~éBLDˆ–Œ	'wUŒê:ÖôdÉö²³	H
¿¶ ‡SŞlsœJˆ½¿ò~•*§Vˆ²ŠÏZ}sîæøBŠ†@Bjó+ÅYûîoÚxijöÅâYŞOA…kC5­–Ú9
o“g§á5ÅXûæ-N¤Àáü8ôÁNÎ@m|İ}v"=!,ŒÒÚÎšòF¾›ïJ±²¤ªo>:T¼?®õ‹Gq…R¸!r&êÊ$è›Pòİ¹áa‹úüŞÜï„04±˜õº·sïà}ÿ¬ƒÆ|çì£ùß\Äì¹«iÛ°èîàv|„Äœÿ¦¿+ª'ìå­V³ıï\IdêwbüwèN)úë¼’‚~†ôtJ¯ŸEL³ŒDÏ÷_Õ¹Z7øúvrI‘/ËŸO$´uÆÜ©iÃ\ÄÂU´:o®PqÆÃÓBjÓ{‡ìP3Ù?dõTüªÈ!¶…b|gõæFh0jèAbB Ã éA€‚ !”Í²–ÈP˜J@ß_ŸÆV¯jéšmròXAH¥ì,Ã5¨ÓŞîml—mh9+Ç"hîO,¦ëÉ¹Â$Õ¬XÕ0@à´ „V*YDéÉé·!VŒqZ@(K”rU’Ó%:6ÑJÉOr“À*ä áî* ˜€?×½`&•¦Ñ!Q÷üåläîçíypIÎ·´D„/ZêÎÔ¸« ìrÜ9ÉÉÜHòVÉDà©C—dgSˆ‘…&CN4Ê{ì]›r-O­	#|Iì)Çæ»´Œ‚¥!6¼èLÌ©jY‘ @ôÖC ı2ËV7x©´{*”$ÂaË-ç |cæÎ·¨Š¦ÔÀÍç¦0»€›²AÔÀA2F9gÎfõ}êñ­ró9ÌàU¤5GÛ:×Kb2áÌ·B~7š >‰Ï|æKKf K0ze2Ú/ƒñx` D±IêZ¾ùºz§à<dô¿”< ğ i€!”å½ÇA‚±àr(
„ »züo8¾üŞfW¶ÚBª—Y ¹ÒR&ûš .¯yŞŞŸäÛ'%+£sõrªÛ¶şù›ÅDÛ ‡)™léLz<FîóîùÅ~¸á¹+s#êÌ] àcŒ˜“Ï"×™ZnGÆ‰ZN2Œ`ˆÉAçRí[`šeèkl+… ˜FÖ2º@7Æ=‚×Ëáêvj^Ë®ˆ¬AŠVbwi6/Eûğ™]V‡…hK˜+•XZ9éñ”¦»Ú¦" ÚxWûzùmQ6bT^Œ9k{MtºÙÎõéšU¾´ÇA¡ÁVˆ&JµM¦CaÕG¿šĞ]kê®gqÓ³[yÿxa\ÁŞv–çDÀ‘³4İ³ÌÜğöçéÍŞğŸŸç:=æ:Ï
TØEcLğ/¤ ç?«*bëjµ—@»À$›åñ’€… Kâ³‡³ğÔÿñaG\Ü€À!”ÕÂ¡A˜Ô6
ÁQ€^«Çâ{ûJÔª«ªš¨Z•UZ›â€ÎÎ•jÒšïäX|ãTçş‹xÉğ’0{Ïô/Ÿjv ¨u»¹¦p VÎ1SP—…äÑd{ş¨H"›¨AØ5åë²–r•a•ûÑ†èF^ì§“NÏJ›‚IaäSˆµI;Nùt®9<F´DMeešB3iMì ­®±¹ÚÅH	CSšÒÑç[­ùéûŠÅ.  ]Û#ÀÇÚØR !á*Öcd9?÷ aÆ,,PÓt|	“Ë7	Ğm&*öH©Ø+7Úsœ>›©ºXUÅ@^W|“LU@Å4€Åí/éB”W’„Éªù •SqŠªÖ"¦|“œÎ¢¹óÇÍ]9Ô‰ğ$‰Al®«›­MWq=¹ÕAUİ+U[Æ7[Bí‡r”ê÷*§ÜAÀ|8µÁxÈ#}”ÂUW¦òA)<’åƒ”p<¼Â¤ÿş  AücŸåÓüF4¹É¥¢
xÆC—Xkï4ò«G±¢A“~Sw²\‰8\JRÂ{×X®á…ğ»í®×>IÇ€Å`J‹1ü£º5Œc±ô;/Ÿ‰òò
“Uœ¡Ê*‰ÑñSò˜e"&pDfø³é4ÑÈê¿"ê›˜æGËÛøXu#ì9Ö±½Ppa‹ªL¬|CoìŸ¼8Êı”7÷ØMw:p\ŒB=U$U¹¦ÈKÍe$uZRMÿÒ0Çj‹f}øEÙˆQîoÓ’ÂZ˜®Ş£æ—ç9¹ÏÅ‰ÎÀ÷£şmêïx$C‚Òxì˜ÈRKçùßa–]¦ßkS["öä@œLI9³&éİád‹­Q·Š£Ñ?x™*"ÔÚ§gÌ'Î’tx(÷ËÂÖ¯µ‹aù‘sT.é03ü‹4Ø˜›·Àî²Cş——Ó?&ÚÊ7NbjèıoÅ:)ƒ.Vë¥Ù'×›ÁÄ;gP‚0ËÛ4‰Œq¯…!ö×†ƒİV…HI (U›6{N*xuÀ×]³ù±ZQfÛö-øGû±g·ÜºÛI´ø´‚ºO%öáto{¤)®rÄ$ÊKôp_Ä±Ã¥=àÎîšä³ÿ}0JÄ³aaÊ—4“U&*;¹,ícÇrİóÂ"ãp]?·˜@€„Qyú¹	}’7ûÇàRf•2ğVÜŠ˜é–„ßm.¢NŒ_ÂÇ£ägO•¢”úÅ¨JÊ+Jë**%ña·åM÷]GÉ&5',;?¹CÖeg‚k&g°ÄŞtú‹\,n¿]'´=‡ªƒS˜ş’™‚‰[ıº—Hm´j„x¶V§ƒ…Ùj%ÊÂÈ>dÃv*ow)é½Æ'.†ÖÒ¥Òóº„»I/è¡ó.ñbŞüBO´ŒØª~1R©Ão”nÍ»=ê‘o@RÙï-}1;*çûyfşúÊôQÈÅOv½˜1U…˜ŠòLu`ˆ_ƒâ”ı‡¤TA@àh­N)É—ÍÏ<^êCmó¹_&ûÂ²bAÜ(àø@›³NªÌ-T9â“‘i[r3ÿW—paí»ƒC©Ë yzX«ˆyh‘#¯KÂæ¶6ÛÑ²q–İƒšQ§ûöeS.vOQÕ¿â,?p:“ZEC|ÚŒ@
Göšô}h+MCÆmEÀxáeB™S"ÁÄ*–|.^öeìÑàÇ©ês½¨Š#ÈSÎi®%@aò)Ji¸´5Å§nV}Ï`šÒÍ¦©Ÿİ aŞª†üM¼è÷øØìt«[3¦‘NQ¬9øPûmœ ÿ^_qï¯şIÒ·(á[x¬¼ óQ‡ì€{O	ú«©À¢ìg•}LAø›pÊ ®g‡*\’€ã:uõ² J%6‚"5¹;Öæ7ş²™iÍĞQSÔ‘3€ó´Ñfeª‹úAuÆÇ›>Ö=\']ú
BMRq‹…õ‘)xfÂŞj`œMíg»İÉWøeÈ«®.t|’…ˆÀğ,3²1–_{¬ºÙ]óƒ™RÖ¶_ƒøÔÚ°¸âràs‚»!,Š©EıoM'¼v•¿OÚËÖ?Ü3á¦F¿âH˜¤÷DÔÜè«áöûäT¿NæD¤ÒàáH‘¨õK£Â9ŠrMİoL•¬"b}Wkc­’·}-ıâØÁÕ¬eÔâŞ‚dóÀ«~”œŒ£Ì”’Ï|Ö,k?ÑÜG‡±™sDO+'Càí´y«A±U@æ:ÇV+»Ga.¶ùèE'µ­€§ÒÕY›	L>µÿÎŸı
ƒ®ÇeÎ–à©²¡ı57×Ë#/–Œ·jt‹Šğš“{h(ij†3õsrN5dé¢ÕuÁ…ójúí0y„º¿ÉVA¯!Œã hëQ"qUª3<¢Ú;ğëÉô™bqü–hVHÂÜn	«4jœËÏEş60 üÓº®Oqñ¶4˜Õcİd¯—Öö‰3îs0;&s£	@“øs‡‚l§Æ¿J «§û9ûİÊpOİ4ËŞÈ%òãi2ıÄz,³¦ÙÕd‡|¨ïÁê¹b_&¯*Jû§kÖKa8zk+ªv>ÃZ·UïÔät<Dÿk±Ô ¸ß,^r¹NE–øÓ‰Tş~F¬ö+$Òæ/Âª—À_Yş™ïÖÿ¢fÅÎA¥n2¬¯ZŞï(?2‚¹äeŒÀeã8¯lùHjçÏ7\5kÍgì–-_¹0ªõ­
˜ı4¤cInOéæ!‘Á¥tK~N1²æ¨X—°É¿âcò“xàe—[í``¦Q³ÎÜ§¥¨‚ÌËe*~×K12¹³?×J¹>¶½Ÿ!&´K )` requests made by this strategy.\n     * @param {number} [options.networkTimeoutSeconds] If set, any network requests\n     * that fail to respond within the timeout will result in a network error.\n     */\n    constructor(options = {}) {\n        super(options);\n        this._networkTimeoutSeconds = options.networkTimeoutSeconds || 0;\n    }\n    /**\n     * @private\n     * @param {Request|string} request A request to run this strategy for.\n     * @param {workbox-strategies.StrategyHandler} handler The event that\n     *     triggered the request.\n     * @return {Promise<Response>}\n     */\n    async _handle(request, handler) {\n        if (process.env.NODE_ENV !== 'production') {\n            assert.isInstance(request, Request, {\n                moduleName: 'workbox-strategies',\n                className: this.constructor.name,\n                funcName: '_handle',\n                paramName: 'request',\n            });\n        }\n        let error = undefined;\n        let response;\n        try {\n            const promises = [\n                handler.fetch(request),\n            ];\n            if (this._networkTimeoutSeconds) {\n                const timeoutPromise = timeout(this._networkTimeoutSeconds * 1000);\n                promises.push(timeoutPromise);\n            }\n            response = await Promise.race(promises);\n            if (!response) {\n                throw new Error(`Timed out the network response after ` +\n                    `${this._networkTimeoutSeconds} seconds.`);\n            }\n        }\n        catch (err) {\n            if (err instanceof Error) {\n                error = err;\n            }\n        }\n        if (process.env.NODE_ENV !== 'production') {\n            logger.groupCollapsed(messages.strategyStart(this.constructor.name, request));\n            if (response) {\n                logger.log(`Got response from network.`);\n            }\n            else {\n                logger.log(`Unable to get a response from the network.`);\n            }\n            messages.printFinalResponse(response);\n            logger.groupEnd();\n        }\n        if (!response) {\n            throw new WorkboxError('no-response', { url: request.url, error });\n        }\n        return response;\n    }\n}\nexport { NetworkOnly };\n","/*\n  Copyright 2018 Google LLC\n\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\nimport { assert } from 'workbox-core/_private/assert.js';\nimport { logger } from 'workbox-core/_private/logger.js';\nimport { WorkboxError } from 'workbox-core/_private/WorkboxError.js';\nimport { cacheOkAndOpaquePlugin } from './plugins/cacheOkAndOpaquePlugin.js';\nimport { Strategy } from './Strategy.js';\nimport { messages } from './utils/messages.js';\nimport './_version.js';\n/**\n * An implementation of a\n * [stale-while-revalidate](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#stale-while-revalidate)\n * request strategy.\n *\n * Resources are requested from both the cache and the network in parallel.\n * The strategy will respond with the cached version if available, otherwise\n * wait for the network response. The cache is updated with the network response\n * with each successful request.\n *\n * By default, this strategy will cache responses with a 200 status code as\n * well as [opaque responses](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#opaque-responses).\n * Opaque responses are cross-origin requests where the response doesn't\n * support [CORS](https://enable-cors.org/).\n *\n * If the network request fails, and there is no cache match, this will throw\n * a `WorkboxError` exception.\n *\n * @extends workbox-strategies.Strategy\n * @memberof workbox-strategies\n */\nclass StaleWhileRevalidate extends Strategy {\n    /**\n     * @param {Object} [options]\n     * @param {string} [options.cacheName] Cache name to store and retrieve\n     * requests. Defaults to cache names provided by\n     * {@link workbox-core.cacheNames}.\n     * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}\n     * to use in conjunction with this caching strategy.\n     * @param {Object} [options.fetchOptions] Values passed along to the\n     * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)\n     * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)\n     * `fetch()` requests made by this strategy.\n     * @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)\n     */\n    constructor(options = {}) {\n        super(options);\n        // If this instance contains no plugins with a 'cacheWillUpdate' callback,\n        // prepend the `cacheOkAndOpaquePlugin` plugin to the plugins list.\n        if (!this.plugins.some((p) => 'cacheWillUpdate' in p)) {\n            this.plugins.unshift(cacheOkAndOpaquePlugin);\n        }\n    }\n    /**\n     * @private\n     * @param {Request|string} request A request to run this strategy for.\n     * @param {workbox-strategies.StrategyHandler} handler The event that\n     *     triggered the request.\n     * @return {Promise<Response>}\n     */\n    async _handle(request, handler) {\n        const logs = [];\n        if (process.env.NODE_ENV !== 'production') {\n            assert.isInstance(request, Request, {\n                moduleName: 'workbox-strategies',\n                className: this.constructor.name,\n                funcName: 'handle',\n                paramName: 'request',\n            });\n        }\n        const fetchAndCachePromise = handler.fetchAndCachePut(request).catch(() => {\n            // Swallow this error because a 'no-response' error will be thrown in\n            // main handler return flow. This will be in the `waitUntil()` flow.\n        });\n        void handler.waitUntil(fetchAndCachePromise);\n        let response = await handler.cacheMatch(request);\n        let error;\n        if (response) {\n            if (process.env.NODE_ENV !== 'production') {\n                logs.push(`Found a cached response in the '${this.cacheName}'` +\n                    ` cache. Will update with the network response in the background.`);\n            }\n        }\n        else {\n            if (process.env.NODE_ENV !== 'production') {\n                logs.push(`No response found in the '${this.cacheName}' cache. ` +\n                    `Will wait for the network response.`);\n            }\n            try {\n                // NOTE(philipwalton): Really annoying that we have to type cast here.\n                // https://github.com/microsoft/TypeScript/issues/20006\n                response = (await fetchAndCachePromise);\n            }\n            catch (err) {\n                if (err instanceof Error) {\n                    error = err;\n                }\n            }\n        }\n        if (process.env.NODE_ENV !== 'production') {\n            logger.groupCollapsed(messages.strategyStart(this.constructor.name, request));\n            for (const log of logs) {\n                logger.log(log);\n            }\n            messages.printFinalResponse(response);\n            logger.groupEnd();\n        }\n        if (!response) {\n            throw new WorkboxError('no-response', { url: request.url, error });\n        }\n        return response;\n    }\n}\nexport { StaleWhileRevalidate };\n"],"names":["self","_","e","toRequest","input","Request","StrategyHandler","constructor","strategy","options","_cacheKeys","assert","isInstance","event","ExtendableEvent","moduleName","className","funcName","paramName","Object","assign","_strategy","_handlerDeferred","Deferred","_extendLifetimePromises","_plugins","plugins","_pluginStateMap","Map","plugin","set","waitUntil","promise","fetch","request","mode","FetchEvent","preloadResponse","possiblePreloadResponse","logger","log","getFriendlyURL","url","originalRequest","hasCallback","clone","cb","iterateCallbacks","err","Error","WorkboxError","thrownErrorMessage","message","pluginFilteredRequest","fetchResponse","undefined","fetchOptions","process","debug","status","callback","response","error","runCallbacks","fetchAndCachePut","responseClone","cachePut","cacheMatch","key","cachedResponse","cacheName","matchOptions","effectiveRequest","getCacheKey","multiMatchOptions","caches","match","timeout","method","vary","headers","get","responseToCache","_ensureResponseSafeToCache","cache","open","hasCacheUpdateCallback","oldResponse","cacheMatchIgnoreParams","put","name","executeQuotaErrorCallbacks","newResponse","params","param","state","statefulCallback","statefulParam","push","doneWaiting","shift","destroy","resolve","pluginsUsed","warn","Strategy","cacheNames","getRuntimeName","handle","responseDone","handleAll","handler","_getResponse","handlerDone","_awaitComplete","_handle","type","toString","waitUntilError","messages","strategyStart","strategyName","printFinalResponse","groupCollapsed","groupEnd","CacheFirst","logs","CacheOnly","cacheOkAndOpaquePlugin","cacheWillUpdate","NetworkFirst","some","p","unshift","_networkTimeoutSeconds","networkTimeoutSeconds","isType","promises","timeoutId","id","_getTimeoutPromise","networkPromise","_getNetworkPromise","Promise","race","timeoutPromise","onNetworkTimeout","setTimeout","fetchError","clearTimeout","NetworkOnly","StaleWhileRevalidate","fetchAndCachePromise","catch"],"mappings":"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*
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
                                                                                                                                                                                                                                                                                                                                                                                                                         øH·Ùõ;kPäA¹'TE–p¯¾{JZ›¤¯]‡Œ¤†‰‚ÀÎ9mÓ1’ì÷P1¢h#ÃÇ,©Ûºœ«Àm¹Ü3Ö'fV|¯¯‡.æõHÍˆDÕY|Hë(… «Ì:û4ÚÕÚ´”.¯.@;ğg0Õ7~´PøÛúî§[ñaPÄAŒÊæ«¼¯Ì/6VØÔÚÏ°HÇ”UÂ ¶¤ŸŸƒbR¶ØgH9«$9Aì5İÂPó–!¼&KÅW¨,ÔàBè9B9·«ö6NÖ:BÇ9ÄñŞO!™g‘b,uS,õ²1nõPJM%<,”I¶Ñ
ßâŸ$ù gû¹FÔG=\û5ë«
'¥4Ş=Á-IqB³+oÿ EòŠ%d‡A7…€K4'¬†Q²;˜Ç@Ú-;¾â}â˜İjwpñhèİ<™Ë‡Aó†9GX-´–t†(Ån·~d^XÄhpÑàÔ¢ùüàáy±ûó¬·nø¸™Å©‚¨1‘"†÷-•Rşù6ü¥çj·(Cóepè¾Be}xş´ÉªÿéİŞ6‡Yd„nõò¨¶ıG:™şÑ	·ğâh.Hê-åîIñ4}ØË&@IçzÃ)W4òïFöVt£PD˜€ND—êõAü«vÊ’Ú,ÚíÌ]æTÍ½1{†‚*-ÏÇÛZ«À$1ëêæ¨NÖ£ºAÆ,¼R³ßŞl­aá}yÒe}¢hu(èÛø$¯­& 0Á}msÄù$¹*ğt¶9!1Jğ!‹Sòw¤¬‡üÊbgI([’?]œ›2u‰/Ått}òğ÷•A³cT‚q$û¼ûqRW&—+4ˆËíQŒbÔÄ9—sçÃ›9«:§&¨¡ª§m!Fâ!NÑG=g	ƒvQ”Œ¦“½–¦"N ó&ˆv¡ıâŒ¿rŠ÷É÷EòşYÉ‡ü«¿\à¯Xäm£Uš†œÜ"İß#8k¿sD¡5 îX-_¥tÜy^³îävDÿEKåZO,¸²¼±%/¶üdšm¡/¶½övÏ+UÇ	ä@ş—VÇ#²¤'‚åÄCø$ql‚²›ÃcU»#­n€.·:XÀå`…–Ù<'½ÚÍñf&Ïô˜LÿæmÃ¢Ñ©¨¿Ğô³¤¶>vM’7¾ceÆÜS$s¯İÙT³{>[…¸úê?}ıÇ¡,HÄúÁ
/ÄzgìóN†2Ğgƒ‰Ú‰’şè–Fi>R–í0L(a(Šfa¾ÚI’Á#}(î«:Ñe9h–ë7LY.¨fî/u÷.e¢¹=hY¯R’¤šiU Æ¨c÷²ÃÜÚşDŸ‡Ë2n´H u­s)—®À¯.Ï’£Œ%XŸt€¡„ç¶C5Q3t®%b'^ó:êÔ,œAøUácMÒ´É69Ï7)X®`ËíÃ¦*¢‡~ÎÚí§jV	*Íû_–¸…&p5–õ½bP‰*¶×Aø·ğŠ#iâ ~—}ü‰h¹‡w^F—{1gÅ+ĞwU_8Q\üÒ9§æ³šv±O°M»8ÛEräööç}2ÃÏº8<CŞRYmGÂèüÄfFqJó×†¾ŒŠÒ<ÅqíOJdóo^ƒÑ£Lşµ¯}3×–G6w¬Ö™r©ßûTmÄoÑ4nÊÃYšæï™P(¿1éWQ/©ñÏT°-MJı!ıÁGıÌ‹.("¥.HCQĞbÒwpu¢Œ™”á	•9(n‚şÆ—	 Iİ`™v(Ã5Õ\-œ§Ú©½>ºÑ‘
¤}í,ª¹dh»\^òt˜Ñm”^×‹¬Ùÿ…½ÿOÕMù”e”öõ‡Ùkì¢€¨+¤õ çãÀÂjËÁ³Óê£DáŒÂY½~éÆèâØµ,6GM'–œbüÕF¦À•âŸê½ìƒĞÀÓê}y©šŠÄs?F gZ‡nşA‡X/ëp ª«êò	ƒ°ĞÉká‡¶“Èyxü>¦ßÑkº!™; òÜ2h mïòÂ‰4É‘“$·Pvï:é,]¹"ùt{	ïNÙ™Y0Ô«¥ó•ƒx„¯Ÿu¥©:°pI“ú–ÿ\X‚^|#'ÆÛ ÿXÖ)¾Ğ™U¸ı8¹·´‡Ké>2§ÑòÍå›Øª³T¹>8]ÔÎÉ7Ú&.‹2YgşDe.'¬&Ğ‚‘È‹ƒûxo*#n“ñèğßb®ÍÀ’¥	^9xÖÆÙ¸°mÏb–jÊ½5nnRØåñÿ4ØÍ²½s2smÈ[S!
Á®ğõådêa’Ö«æ%\D8tîĞfQ›tJãŠùÁÉÕÑ}ËªÕÇeÃWşr™zõIEBîÁ„h©8÷÷ÜÿÏFyN¬íIî¯G àcß‚ZÆÉIàíoáÿ1 hˆ€†™1Ü(é,ôñı;ì‹±×4¸ÁeR¨g?±}Db}Ì¯Àe€£áöÇøS>Ù¸:Ç8¢ÑìYèç×^ÈÒ$àm'§³õ>ÛóUº³«¹Ô¥KÏÓõ¥¹Ï9a ş+†—®§İV‘¬€¥6R’À{=äáe0           !”Í¢”Ä¡1àê0Óßñ¯·µïMRoRÕ—Jª’™¬
/¿vö?İ¿†üm¦,¯¢÷’&áRÀOÙÍ3Q¹%öœ|¢B\tp“^õQŠ°HdEø‡±à*fÃª•WEWÙ«c2ó@]?ÆÇ ¦g›™–T­ƒ”ÑL½«Wfı†t-øš‰ĞÈAÑ	õÏ¦†À_)ˆqYñyÂeXI‚ÁEjÒU‘¾éªÆª!gŸ.õÔ‹x
0N-¡–µwÀ‘ŞÌ±½^€™pŞğø"âQ²¶pÜ6ÁØˆ­°\‚€DT
S„[Rã¼ˆNV%“yEØG'ƒ“  ıÜ†\¼+}AxeH.³ Ä›ëìÑ^8ã¯x®íT€´¦0†b!Šîï^/UuÇz«â;µæ°Dëïwü·l]ì\ÖíÛ§CQ=J´ß|€tPşô6 -òYèÁ(Û0]I– WÄÍáv6ö;®÷ŠÆ­İÈÓ
²¡òH,vø~  ŒAâc 	ÊBr`¦@7¿è˜ØU’¥Ş›vQnÈÕ	>‰Ìt€fğ·Xr +>nvKÇ—9?ÿ¤0G›ÃÉÿÙ£ ‘)Ï-NÀ_ºÚgş»”ËÜè\’ı1“4Ñe7hT‚1«º°˜ş‹÷¹?ÅFÙ”ò"¤KÁêõ\ñâø<5ì´mïLğ¡_×¢+ë—­ÜõZú¿9š6d		hr2g²ÄN	|^æ…Û¾Ftçµs}\ÄBµë	/‚üU#YoaAˆÚ9ÙOf¨¶šRv€‘H¬ê1¯\F¾"ş¬Ç"¹yTõ™**ú{V²z—)ÚÉêY­ƒÁŸÖ†Ìa!ªÚ\<5ƒÕ¯jUúù×Ó/Rj"ê¨G¨=¦ıËJñç(ŸÂCQ÷!“OÉËc;Ú‹3òId÷F×§:øÆd…zIz«2ÔhiçÛ=€ï
½À¨ö?)º2[X 8¼KÌ5ìMôİ—“Rb	VR^ ¨« üzJyö»6S~›!˜S1}9QmÇÂŠyÊ]¥•¾êíCŸÓ•GçÖıNş¼ôØÅŒ+Áşú?(Ş>ı¥•Ús¸$—+Ç½À.Z<Úâ»C³<ĞÖökŞ;­ú}Œ_-k,Ê¶¤³”$Ú3àh˜ø\„jOª“kÇ8I!pyÑ7¤¯ô ı‹—~“¿ÉV,`ù«cYÆüu16x[*rºÚP>Ùİìñ:ö ßv$–š`¶A‹#Ù£jï‹ñSôiM°şº³§÷ÒÁ#š»«jˆşµpaìMé]æ8l³XÙ'×û%Ô¨8
ï`†»zé³>D4‰Óø/äóRÀÎ;ÜHz÷ØO˜·…oåˆtÃ¥–Ÿ“Cë]ækuŒ1@%iá½á‘¨›mßPGh0bùTÆµ™ä­cõª9.®Ç&¦WáÆïÑlî`Õ“³<øÅÆ„2¡Æˆ˜ÌœüİôÌ‡£ØpX JÖóáàïƒo®©‘Än,P”<@ëMŸÕ1¦ğP%½mBizáÂ¡µ1Û÷Ç!ã¬.“å×VyÿŠ•±•eÓê,c¯°—´³·ŸeœHAı»ÈÆ¶8»Ş*ÆÔ%9ÑbÄÏÈ)òÁ	p*ÛTí³rf,%'KÛ«†›‚[ÚBêˆ\©øÓºCíªFƒÁ¬bQ]F&ôª_éW™ìî~×K”iõşéé{ËÖ&i,ü‰9å,Nw(O×ğÂ:ÄÆğ¾u÷LŠPüadÉ°{ïü?NF;NìÍ–¿q8İ
±‰XĞ‚U(‘çÍisÒMîKTppù2CÛÚ˜Íùî%„è÷nÇ|< sÒö9‹TÔÔ¨ì0Q@¼qk8¼â…ìÈjĞ
ÖõØ†İAäÙ<·¢£İT<£Srä”ĞØû1‚…FÎ¾¸sºcšÕ•ú.wÇ"“„”/o›ïñ”fÍãhNš2n,sy‡¨?wšú„Ñ»	ŠY&{çøƒ‰ÉQàÕÓºµÉ¼4¸jıkÃÔ1MkNÀÜÁ¤Iyğ#ÃAVÉ-TÍ[ÿÔßåË,b´{“eÍ|ÖwüçÀ$ãW"ğk kzÇ–yéH·ôuÎÿä­H[8â=ón.ä¶.òÙx¬ØÄÚê›‘è©~dùè…ßéÏ’/Ï¨¨F6fc«:oÕ5rcÂã•CjÿŞİ¹içzY%§ÜIÉTÔîpYç>?¦Âç=cğT;Hàşçô"ccm7ÌÎ~ó#¡{>Õ(0
§üî…Ğ‘Zùû¶‰TÇ):Ë~øm£nï_ÌİhğTšÕl!o–q Şåøù·ÎÅ»Á“)Ô¦ÆvyåBÏ/Y;şnÅ"xJ©f »R;t€¸EíÛIu³6ÿ«ür$¯¬eAôbÓöWç‚»îˆu Z¬®›º$ŞÆÂóì†?fò¡|Ò..GBéßŞzJ‘›³FNvÇø§QºÒïÊCL…ñ£,™‰×ÆÑ‰?5Óy95L¶0³¹;C86›eœŒW4)*14ŠÅ™·Œ²¾²‘)/í)¾ìb( K£}fšjfÛç¼/<aw˜.`A‹æ¤v†Í¥r…b1@±Å–Z¤2Ş˜çØ³x´¨ôõIÁJı%Äq….XsmqóÊTs×Ã³ëï—¨K/Î­‚®ÒIëh€p6p2ì>ƒ‚‰VˆùıP\ÆÄæ€år§¼¹¶ÓÇcrNó :l°¹ˆ”İês¤’Ä4€f«z‚U!%Ï_Œòœtw~®ß°~¨t	Eq73<½‚¬¥Õµ‰S]¤%İV&2Ä.ªÂH6£¸B‰tƒT]ôí™‡0p«DuxoÄ
ß¯Pé›s¸™\ P«ÆKè3›¬;g­şÓóüèá¶Å1õÍ}Ì»±°aelµÇÊğå–„>·Á±©›
àÉuFÛ.Q¨<Œ8İ¡ãá¯Ê
„'54ög²1½0”'U—ñÊJÅÏj‘i7¼…ŠŒ?°åéÏ»yY[{ù8Ç$Š=…¯µñ‰yÁŠìœÁ^+S€ øÇª¦]§å‹dV~S›ùÅ:ûÒ…‡ò 0†h¾ÌÏû¬\ùeŠc¯©¸~TaM„·let¿–DæjÈ¤@…Ì¿(±KÖCSãNåhü5±¨¹4¬`ˆ…–ahÈU‘U¼fŸ.¯W-eÒrx›¥;îã@œN†é@dBrÛ²gkCÿ.è_ã¦hrƒg%G-}Úä
Ÿİ@¬y4´¬!3Úáp0¼çI–Z‚DpİJÃ@§Ï ³]âóûQ’ç¥;Ò!´°æO²±Y)ÑA'Ëz9ˆ:¾kmLZÑS kù¤ñ9—xRP¸êŞ“¼ï¢f%Št,æÔµ¦`K=zAüLïd“IËÿ%4 ğíqCà¹Ôu: i(Ü7WHb}øN[ÛØ1F×´MõËó‘%Èqj…¹Ü²:HÊî‹<jÌ‡–kòÛ§E\İí 7ä³´õ{2'¤ƒª–ÃŒgéaÎ,ØÆ¸ „»	¼2¨GlÜ>Ë!66‹ÖÂÔî /!«v%pÙ#ºÅêúUX¸FE)}sı‡øæ›óÂ}æ¥E˜)¦B FPyøêfcĞâºNÏ Š^¼<kÎßäŸ4ï˜ÅW7,q(êÅÔîëŸ§tÓAAqÜÒÔÍ®Ö™ğ¶¤0 )G‘Ó
øJrhDSŠÿÛvxsöE€}ˆµC+0©È„óç>R¢:OÚç/mÊAõáNƒÿ8"ÁNÂjo9Z·KXª'Nä
 L¥z¥Lw1¬ôI±“u"8†”[Ä2o»ğ_;÷»g{ÖCç.û4,Ÿü<Ï :EãµÊ®S¬ÇüZ×Çª¬“’HÕ@oï¸„ÿZ› \°x(zJ?ø]
£ÙsùN"ÁŞ"¢»Aˆ©§´¬6ÑúuërUÑWK³µ‡Áí
Ç3ÂØyâDà{WêØ¢0ó:×É^$p“²ãÈ;¾İæRª%XÚÙ´;ŠÌ»HóT–—ÈËfŠJå½6†<®F!ı¢~İMê¢ÆR,î™Ğœ¶23Ûøİşœ…êĞ•Œğá÷zÀ¶iÿ€hÔD^DH	?‘Ÿ
²ğÃïOõé’¥Œ÷d!iZ “LÂ¦Ò{òD†*É¿„v¥ñ	Ì;ı&¯Q°øô“{Ä1ûufšƒß¥·ˆsµt»’Q´Z±Ùö¼cZ'[g§v<AÁl¯i§Ò`ÜêÊ†·!«YĞ¢ä×tôšS…v‹¥¬›'‡!!¿dH¢a<ŒE«ÊwóÅÇ/Q<–$´–ğÙ]fë¤ÔXø‹{ïÂ1oeûòÆdö™Ò$5:V_Ç)I08µ^ïğyhº@ˆä~h8dƒô<·”³P¼?‘R}1I,yöJ}#`w3`âMÊÑoÒáê¨Íã®;	†rÑÒŠ'fÌÀÀÕQ1Ñ”†›}ÚB9×Ò0•ÌàŠ!µRÙOÿÖM^À`Úp=§š8ç[úÜK’Xê­Q03SİUš½šªn“RC€ÌóõŒş²rFæ'…üŠÓÁ)_o“yÿ­^Bğ2àE„/úL+³¾É1ãó„ç +SÕwÊ9ª¾¹;6˜¸¸½<Î
Á«8"´¾È
˜éô{uÕ¥c;Ì¼Ÿà€T´¬|Nõ°š¥'¼fÊ¬ñÚÚ¿„ûwü^Á¶î# ùt)Èˆ­åÓ†Ğ†½dWtH‘ƒ®ÄA,Œı¾‰$9µªĞnRX
[v·‚^‰ùe¹'à`ˆ4 zòcwÈSÍXU.d@·”ƒG‚ß”ÔÑ["¤TX·1şóz-óP£»Ón¨-¼		Á©'Ô®)O-õ†œAÙñŸæn_!äšá.qXşß’şc±äöçeäXoı3\@ãD}>ÙĞ‰UA_SSĞ«¶û!Æ²¸Ã,ÿü½=Ş™ë`ªÈÿ›¿O¯áÔ†æá¶îıÀ8B¯Š¸~D{Åˆ¾w}´r_íUÇÑìlĞ:1ëhíA}
Bª±d¼©¦#NYg;²¸Û²ö}‘4œaËL€ÿm­À½=£”öFZŠ¤æÛú…êú„c‚ ØC¡tp`5¯%|›½ŸÁ‰­2»¾çöœÛ­Ø³Ì=å5í’gG!t¡¢–¿¼‰Ñø5`µ$Y<¸ª qî‚®ëVj hÓSI¶D†ı[Fj#€¡ıÇÖ&úƒÓ½…ÇÌ¥IÊéÿ/„{;ÍŸCu’ç0ÊT(şÈò<{Ä×ÂÁàÇröY•«Ì»=Á×g!4ÏÖ¢µ1L4l²(K?#$êò&RĞ û»ÒÍÉ«í]ëÓĞ¿%&;'ƒ ê@ÚK	^‡æ/0@H‰,_dz5şr&—Ğ‘rP«‚i¤'BœÖ‚}4N0qÙ§™ÂTöo#-İ“P%j˜kN¹­ÍáÀ|@qæ÷ØZ+O¥‹NRåkg¾Ì¹´z(äŠG¥öoÆßéÁu±•·Ù+å¬V” ;ö²h}°FHó‡ÒIæ—Gj/­Ëá[¯§¶»”ZOóuíSÒ(Ø‘¹ô3D­ã¾/Lg:Ö­æ/¢³zYjíöä-á»²PÀÁÑwmàˆƒkâ<ã™ wşÊŒlıXò«+°²Äu9sºÒŒË97¼i»`ÎÒÌ—v_g3c25ñ/ ©6Ÿ€şg¥º+N‹úè›1¬ÈlÑU ‘T‘Ù½"Ò°‘×h³k(|±P½ƒ­9Ó×†§)Ï/`7ƒ¼í¥õ'€8pS};¡ šİ">ÇÖócèÁ}èV`µ!’‰hJJùWÀC"iã	Jèók÷dBÙô®¢bŞ½ _l@}üÆÀ¥ò!í3ØöE´Æ÷³¿p…ş}^áµÖg‹Ü—u@í!¿‡zm$G™¿NrÔó43âÓ;^Ê$¡µ¯KÃM¡¥ÀQ$pk%_Å¹.’?IK1un‰_îÅgèÉı1lq×©7T©×{}(Ğ©Dâï¨‹N<‡@p4Õ†Ò„8(4S1xæÃªj‡qô>ıè<†$3zĞ›fFMĞã_¸¼UgHîò­“«§:ö]wÎPÈ.	r¬›‹ €“:·pÿuÄmr¨.¥t.VÎ V‚!NëmÁˆw0F
@Ê'&4¤{ñ»Š¡š]Li<lÍy‰¼£† "e6s)Ì¤ø†«v].t¶t1¤|ºfe—®‡Q>×Šº†¡Œ¤XRH9©İ,ŸKU±¦„)æv2™}]U	ó{¼¾9IìB€}â-ê3ÂhËlùüò•†A:‘–—™×B[ûÿ»HŠT€(›Xa­0²ÆÇĞcÀ2w£®÷)Ø{ÕæpQ,è„ªaãŠ^Û	Ö"K®Xßş ï–ØŒ¯’å‘”vœ°ïÎ$$`"óA=–V=‘&ïU)mxf2 ¾ËALúÒñG¶‹J¤¡……†tQ$Í}Wë¨ö7øŸ„Bm@Ğ¡Œì§1¢ÜœíÜÕ•	gÂ[Ï»øÖÚÛœXP»8;bˆwŠ·wŒ¨jì±? Ê¥İ=x`¢}LëM¿XóJãF ÂÈÛ=»9M,{ö%‹ï¸**A±=¤aÌ>4Ok09LrÕ˜äŸäL¬²O“Ï«ëª€!3Ú?ŠŒSg¬ğöÏz¦gwt)dö¬0[íuó'l©eI}vˆI¢P2cCÃÓFÈà¡e4…É}§´€‰ï©nÇ¯n« 7Øøø·çşQ>|£Òo[úŸéüwğ‚¢Q·tx²Û¡vC'D†¼¾YÔ«²Å  À©I~zÿ3ÂEƒç¯è 2£¡ŒrjQg°7äøîäÍ¬>Æÿ¦IóurW`vYb‘>§Û5I÷g£X.¨¤‹ÏÄ6l9Õ¥›,Cµ VSôW9vz˜[âØ*v# ¦¾'Ü3ër
û¥ÎÑnCc«FÅ~§¤’ì¿,§•ğGÛ–Kø³ÖœÍœZR`pC˜i†WnÛzÄÈ]Z@6¼!†¯±ã+ù÷~[„=0u[oSàŞì‘“#6[Hû«üÊ¤fÍ—f(êíH”’Sôuÿ£*Ô¸ÉA¤¢š,+â s°·Ì¥g€ks˜Ìµ[3ïbÅ+IÚq-ê	yĞÙ"à:¦„ŞofŠÅ¢0€Øó‰Çpö’h…»ÎYT8Q¹‰WºE&c&õ40{Ö´ë‰r¶K/ MB`C÷zÒ¥<ğ×­IÏæËyZµú>`{)s!ªãlğ*š(¤;{İÊYH‘ÉímøaËÃ8İõiªåìI~í ™»…K>Ÿ,ºû¯İ¯m8kMç<k»Û(L2fdáú£¢éãhb.#È£y-“ME©‹ˆúøbérıníñ}ïù°ñ°I8Ëe&mÏv‘:GFŠh9n°¦—g;Á†)RÅëc”¿DË‘óâQ¼ ÁZÄÔÂ&	‹q%1ÅbÕâç¼Ã)5d­f ¦“ÛË­ÂïÑ//Ó¦­
öjHqH-‹âü_Ü(¬åhË8©•1gf¥Æ€Ø”vrNö5ˆ±AØ2¸ üpÅåĞüÍ›Ü}¯7õãºüy—Î¡å­ƒbXíœÚE™ÒIÒX÷CíÀ(ËxAÿeÑJv¶¼¸å…`Ã<áÑ3 æ*„]ÕHdÜî„ÂVFC¶ĞõyŸd#†âÚ‚ç‹á6æ’,JN_l±øğäÿ<6<9,:L‹òÕ~†Öƒ sÑ~<©r%+¦*ÙV»P»¥R“Å¼9É½+_xûô÷pZ‰!œ±;²fJCÖür±yç+
#AU½-[ØİÆ¼òFØ¶qÆÿ 5s)Ï¢¼
Ë–4F}Í§ëQu…Î‚z@c?h¼šë0ë’Š{^@!š±Ggkø}Kã»£ÓÜ*µ7Ï»`'½ÂÀ–sì‚´ËrÏÙÅ¹mÚIô´BuşËz(“3g)‡¨ƒ®Æ0$åe»­%ò¨ı÷(‘ùÉAÿr"÷­ñ…¹–ÂÿFT·åÆ~ŒÃ–O	St’†x–)g%?«G¯iê''a8³Å6|HétˆR—µƒBôİ¶¢X‡E½˜Ù=ÔüƒÒÛÿ”ùK'Ä™;†B.5N*S·Däf[ÚêËâ~jË—O`ú…È»¤ã~áfØÃÙ>eÚ zûÅ¦‡5 Ü¾¦,İö—KÒ9=Æ h€         !”İ¢”Ã±àÈ%áãï;œfšV»Ô”‘P)xcÎqä}éÿvl’9ó™»eSŞšLß«,uªİƒéà¸™ '%gŠs(ÙÙáéšŞQÓwšÑ§UPB[xØ·¡Éš¥Î¥)è”k¶ØÑ‘Ä´—U0É‚˜d7µıÛ]ÊŞÑ¯„™VÄ`iT€,ñpÚDôW–D™d
Ì QLA+ÅM†íOuÑôœÌ[È©=òoÒ—RÓá}Ï<ôe…ÖAS†û¥\ínt–f¾õU.5¬"âD¨‹¦AÜd ]L·¹;ÖÕ2Se—çÍAÂymw¹pU‰ûhÌz»½À£W7œuğê‹—š§å¼Ğ~˜Ä ± "	M×WÛUrºçYÁßXˆénO‚UyOnMíšXd‚#„  ¯Æƒ¡Ë$ÌÂàù©ë”»´’
/9¬dyŞ	,ĞK¤Û».¤' ºº%QÀ?]j€*<!”Í¾Ç‚°,Õxü;á.ºnê\7Ä¤¨Ë¨`c¯Á	î€Vàf6Y/‡ı/Ši] j(¿¦ÇèiXÙ=_ :O-§ëÎY½;õïÑó™x1$×t|÷	”×>»ŸI@’œ€ÒââÄ~G»ğ9»	6uDÏjäŒ"|‹¼e|ÿFñ±/b²‹Ñf:‰ê¸²Ñ=&€HVñ}g8Iu÷ÏS×…u9U‘Eñó[64Õ¢…•€øUâÁg†Ão>$ï†‡2B P
wTX
ôša*.t¨Ñ¤Äeñ©™ay[ÊNÂ€AZø¥~¿åÜÃìmè*
ñp Deù+-úfù?Ç¦É¶a†Xj|^á
?s­Şú šµ9àh A;Ç•æªäÅkW•Æåœ†I›pG\yáhÔb¶¼¢C0±ÒºÇ]Q«Üå•·ÛGó}ÅéEHŒ`0›xf pÊèßMz¾\OØõğCWD.ıg¾MàÍ¼%å¡n|/3/_ÔùñsÏÄø¤ÿ²âCv¢6  ¼Aä[–#Óû+şR_1¹¨¬ö3fï©iù3!ağ€/3Sò44p˜¿«62J‹®Z`Ò¸),7x.}cå jı‚å/ÁÕ¶éY£áÄO«W]ÓÕ¿`„qò:'á3£Y_™vu§ÃòÑ(ì…-Éñ©Íº&c¼z	Ú4àã»áØEJæ”	S_"AƒŸ?}ÇûT&¥ÂÔõôãîçs-¾Ü_;@b;¶%nE¹à¥«oôŸx¥ß‚A5
À§‰¦|]Ü¾µKŠ0³Nñâœî¿¹şúª.(Ò,NœÉÀviFUàI“_ÒK¨ßÉcm·é‹ §.	Ìİ.Y
Z7!òSÚÕ3\»mèZÄ¼µRùÚ¾c=’ ¼
™ÿò)÷wó¨AG38ø_§8-¿–—s%å®ãñÈ¯ûhİ\?s._/şˆëG(Ö+é¢,Jäë#Èn¼Óyİô,FNjÜSOğËâ,]%şUs"Ø2õİøüû7>emÁî`
äLØ}§mİæ›dl¸Vi»ùËöKH!¼gî„ÂpóZy[(sCÔ…(Ô‰).W¼d¡9½UiìÂz¼P p£{t‰ŞÀ@SÄ>'ò€6[%(õVv4"ë†Åâ§Ój?‘ÇÂ~Ò.u’Ÿü#´sªøtEVmÓ€EšèíEæ¿lŒùuÉÛAÙ×Îê½GÂ¸”şÚï}/oó’yQ¹VƒfëZBÖ˜k»v¿òzrxÒ/wgŸ}dìFºz¯zpµ{MCüCÕ©c­=Tñ<¿;ÊPlç"áó?4¤Yƒâ¨ü¬	‡£Ç=ée!ùÏ\vñä{¨S2³Dşo`N\ê4,G1@‰ÄOût¥£2ÅĞ®fe•o»’&nc¤‡!Ä–©µ¶«4P¥–{¯Øe- ey#Cz]¦x
ÂÛ´	@ÁO%…
¡Ú?ÓÂ·”İé©$OókI§÷ôã Sw=F¸ÛM|a0u³‚í¸Ç8R&„«B(à˜ë9šĞüt¸{â¨ÿKUR÷2ÿ&í–µlñ§½
ªÇ38V27›µGkë…Ê>Ø¦,8‰’òÑ[o;@İMº_ŒUõpJ#àì›%ëÆ¢2#7]v®£½µj
.üÔ­ŒR Ô<å;Õ"óãšĞl[AÜÓ\ZÙŠcó ØÎ8g7üRÑÃˆñP«õ“Y"€õ˜¤½æ<9Á‘X\]_avÊşkZJÀRp ‰×µV›U†nU»ızZŠ7 ÿãÙmPÙkõlªâM¨ôlQè]¡ç¼ÒšjÎ3?-İ™Ç;
i†g~$hM^4|—>+Q&rãZM\'‘ WcHD(ø‘cïG ôÊ­+|yÚÂšuÎ=àE˜¾\¼UrB³0W+Ê÷ÓT`P«pOè`„ÄåH7-”ô¬ÃŸ}×»$JÍyÀ.ÛÛ/(`‚ãHbôZB:!¬£Ex–¢[G§Ä|ĞçÕr9û0”×†ôè × Â’½2©Eƒğ³ğ,İ×ê§ñi]|°SÓsç©´Ú2æ¦›ş¾ÔC-ŒÆœğ¸7…ŒéqéÂñXÏúJ<ËÃ¡¢ÁµÙóô8W.äZ[ f{æˆBˆø–WÜ¢ãSü ¯I#è£ûOwdï2ğó¿YÁ2œúİªVañ§RÄéQ:u¦¸›¸´øJªjD81SYÓ~L2ƒdMgK¯ÖÕô«=¤çÇÂfxÜ÷‰$|Y©P*´H’z>8­¨ŸÛvt"c°KÁ.¤òËÔÜ—V+MÓND^ML\i/æ •+?7h##èâ:úZüPN¯L²_«X7ŞÙ­ŠqUß.]•€Šh²ßŠ`¤VUqÑÇşJxoæœòæ¬FzSæy8`_ÌD‰Y4Ù¿æª{Ìeˆi¸Ä©†?Ç3¼l	Ú­Æø¹È[Æûäó ÖÛIŒñb·­zi©­\G5‘$Â°4B¸#Döš v»ã’?’ø*èû¸í_2Â‡.Œ#X3/nİqZñËìÏ¼Ö6Yqoˆ[â,GŒBáUZQ}WÁØuIH69œ0¶3ÈçİqÈeê«İU7XeÈ+¹+­ ¡ºV…;N§h„#p>´‡€g®gG—m‹fn™š|‰Ï³ù¬·]_Nµ;æàÅ6˜@FÔN¡)i[Åöö¾ÚÊr¡"f‘Œ³Y^:ïäa‹fêtsï÷qOF¿¾şê¦ÊĞ:œlŸM®u¨,Æ|=l~.Úã?>›«®‡¨<jni{-pHYÇŠ˜÷“ü‡Î	Ãß½°³aòvÉ6/öv2['T™2í@9¸IoÒ—Àã¸4ÒÒ>`É•7<‰æãñ<E-Ÿ‹aˆå1Îa~×2#‡œO¹ê["„GVœ0ñV^É¨æŒ[…û“ÛøæòüÕV¸Ía²Ü÷ñ©$Ìp`Ä‰3XjKE–¾íî¦ˆº–}B›øÅKÈ”Íi2sTÒIkŞ0{b	NÚôšÒ:´áSyşVN Ö¹cİÇ¯¦ĞÔr¼ôõ:/N²_-'E².E˜ÍG|À÷¹®ğÌny_àxê+ış	b0 w×Kpg¡‚Ê÷_´Êşğ6Ş,¥3dlÀšà/ ©Ş "²îª/G,¥& ˜`»¼eÓië‡1”ø:º½V1/cÓ(1ŒÊĞÌ‚é±·¯g½VÁ&ËZÓ\'Âû^¶ºBÇ¡`Œ@•vLÛ ;wÓßjV7‚AŠß‰ ú­È¯ÖõÃÒ8TÌº`òŞCk|mØ/;X›œœºµ=>L¥ø–6÷İA…<fÔããj-¢4ƒ<Ó‰É•I%<2zi% Àƒp†~¦³¯ì” ‹$Ø|Ö ¡‰},‹‘™àÇª$}EsŞ„aUÁ·ØDİh¯ì <á™.©¡wºÇÉÈ-?NéRœå„ŸÃp)*tU1”§?‚ÁâÍe`s¾ĞÆ¬T €mJ©Şy¤Êõ½7NşÕï%áM#°3íU³Gí×Á{ùø¬d@w~•Ÿ`
k÷‹Ë¦†4™)$æ+|
CğV"uRÂU¬¬qcªl×§{Ê“FKâK˜ñ÷ŠEh‰Òèøåg¡Ê”Õ© „å6H!2d€½"ÜÎV´Üñv‚â3"•€p=ÄUÈøŒ€K¿¶Ny\Ëwİc†¨#D@<=…èlŠíûe/‘Ñ13ÄüfƒƒœGÕ8êÆAêÁõã¿ñˆâ§é²Ã­*áÒ"Ç&¦AW¥÷“Gù³×y7ËiOÉFqï)®A¥`¬¬şÕÛ¨@Œ…4ËXè8µ„ÒñA"ÇmhªÃ9§ -³¼ˆœhª¡&àÔËpmõ‡0ôaŒ·.¼¹Ö7¡OˆŒöY¥·EÂòLHÓÀì«C!C§(LZ¬CÊÉçàÔÅ±öi)Èj¯GôË¶²©JÔîÑFöÒLMW5™±® ÿã¾Úó)>;ª…ÖÊVîØ8”m‡(»Áûs0Âjƒ /ÇİÖÏ	>rãé½g:ƒNS¶@7-ËW†¡A¯ âR\îNÇ+ï(–ïû5qı7Y¿õåS“³ŒÏ‘3iË0™c-cœ8ƒ>µ[²-NÜmÆ9+aU5ßí#(R¼J’êÁ¬Åsù0†¬ñÁ&Ú†—²û&XÓî !Å¹ÂõšÕ1müê7	_»àà8ºq!ğš¡üğ¢^øñÆÔ\´@¨Ò±ê™Ñ¸7_òt­Hó0–ön«b<× EˆèËObøA0ê?·-^Ko$:Ö–%Òk–DÒé v×Ï…öT
×½'ô¢´3ù±‚î,`˜Ò"!§TÛüCqø+)´œ>à¸#f1X?4F:]<ÁzgªªD¹²´ Û6•ÿ\ùR·lE_òK¶ãM‘]0<‚öî
æ[#£l¢ó‘!¤ô2FUèÈ9qÊY–»œ)Î3¾¿ƒ…›}Tıù Úı_¶åwİ5o²€Œ”–iz&µEÕW	…{áÃ	+ed”ĞïáKf-Tƒ@h·ËJâøóê¶¤¢:b}ï$ÆâÊ¢Õë´İû¬6³NÈ¼~r3²¦ƒ¹}–É¬O™aVD#E¥ÕŸà’Móö'Œ€Íæ»$t^*UB”²KÆZàíÎØ~y]éõšÊ-¸r"ûş:õ8AP³uó?Ó*(b¶ÃXRDÑ
¡0Q‰åaêVl6ÙĞşígü’ÔŸ#•ßW3"XÏ3ã—Œ±,¢ÊÎ<z:¢ÃxÃÑ[*·½¸ÜşØHoV¨×NiIù›¯üjõ@WuBò£hŒEÓ¦ˆ˜C7U!Êáv™N·ReT-`ÓQø†±nŞE§Xœ·¨ô2‡Œ 0ëG™m_«u*3ô»²u} K.H%ï¢å—Ò8M‰ÄÄXš=u8ÚùA‰+B\©Ç-š#¢ÔŠ±Ÿ×fZ|õ{•w9|Ş—wĞ1|kwCŠH®H,ùN¡¹Ö#¨ÏMí¿©ÇS¸¨l«œ½w	İ¾(¿´İ#j:¨»hp`M@náîÖ°DmQJ§òë ÇÁMë_©‰	¥‚0ò¹Õ7¢z<îTó"™IÃQÿØZwAáÍ×¶ğƒ¦ï]Ôó‘4‡:Ò<5æ–!)3#K˜Ø=|…ˆ³¼ßaåwÌ1ÊåW¼¾J:°ıÄ“z¾â5¶DYOnŞ8g[ííøœ¢Û©v™ÏQÏ•òpu~–Ä}6Éúï5'²¤õ Di}Ï6é£Ü.o1k¿˜_ù{
´œ÷?©››âÜ¤¤9æÄàLY¸˜gqz{{ÅbÑö%ú„½$8¼*¯äß²Ü{„Xœâõy"ú6ŸÊ÷b¢,ö›JXz0ö±Ó¦¯ç):Ù'*X¦/[Y÷p8á{¨Ru‡Iù?v!ÆôÎ°?|g	v&`—©ZAÆF’(:cİúÙ Úø—QµLö_©ÚÒõµlÎ¿Œ½¬—íÚ¾/­€áv£ß ×ÁÛXÀ”Ú‡qI¹ôB×K:âäa†@®»Ò¥˜OFôçÇ–¡›.Ì§õ6$êkë-‡1ˆñØÛE›(;Şà?œ®!eıı9üÎ1Z"$NÀˆÃøê¾¯”¶¿ºWX–B¨¹G“sàã0
ë’èÂ‚ıSrî\)×S_ŠÖ:¯$ZYÖE´_!£ô+nãã@¹´ãw°ÄKˆùWÕz¡Æ›o‰‘şDc¿< {T'#_·Vï[@a@á-¯û¹1°Ş~ S.pÂ­òê„cœ9	D°nÌ?Õ£#qm^kı’2Pµ")
 <´<L(zLâÇE"jÏí¿1w“Mğ\í ,4>½2ëü¬Ô·w‹‡¦q!ÿ­Ç­¦ïg÷J>^	{ÇhÀ®Æ^]e½Ô!{«­Ûí:ô©]ƒúÀ´NÇ—]v®”“ÁiO–°[£­'ê~ ÌmOÂR» äCµœÓ]“šùH3n¸"%^U[B^)±I`Yò…o :…loª+ÌY[Ô‹ö4?ó­6XœşYÇ¹úGó»%<2ƒsŸl>B¾¦?-©ØFì¡£M§a8¸şÿ¼ØØ©((œÃö9DXMP_:_iöQâ„b*LC#ƒ7½ÙüL,if§ád‘›—<İôíD"‡_i¼Äœµñ.5^ğÃø&ıà²=êvcÚb,!¢é:n8ˆ1ÀI¼›ÉT@7&v£=«ùê#Löª>Í‰ô 3d†‡6Dx(5æÊ¨(/ôóy-Í`qØñ(á|²ƒ¸¸ñà¸MEqÚó,u†¼áx s&|­,‰{jæUş÷bµ8v]œwñıª©ï!3ÄİÆêf+?¥¤ıL÷$U]ıÊõ©P4Dô;Ab¶_¹ËöØ÷à<h½\ó&ËF6o×ÅÃc•g§b<|B&UÖ¦×V¿òh@ˆ¬³¨:A¬3»ÅbYÖ‘Ê|=œ0Õ“|+jQdå=ËŠLŞï¬V:}Yx—Czˆol<z1¾…âYÀ5`•ÁùCmnâ9Y1JõÛğ ù†ÊòxêklU1ØRkK4Ş¦r“UI¶¤ˆA4óz¿BøiÔÓùËÛŒw\’¯~(åO.ô¦RÈê‹(Gswš8(LËÔ¾Óº7?ñ0ËdO”x«®.‹£="²<—5VG´øÁ¦:Z6uôáÏÖ¿€&Y©ï8zá®)İ²1Ék®ç«ùÏ4É+Ò@?üzPª››ˆ©ûR³ÜÌbŠ!Ä=•¸U
>ÑõkSÖy_BîMˆoƒ³_&ó2‡ı Ñ%$‹¢3¾™
ñ¾ÃYJ~İ«o„ïJæÃ_83üyëmb DüÄ¼n-B²m¶™€|Š÷ªzs„5S«™H	>b+bGˆ!‡fmë’pÄ·i…i…|ÇØ»ÀXÛª‚@N¨çydaŸhÙeaQ°ûõgDÛ‰¾¶C:M-i©¨`¨RÎ'™UHÁêJ6%äO'6¢í'¼tn³æ¬BV„R8ˆfÁœ²~ò³Í×Şÿßğ¡¹GY­9£'LÀ÷—ˆÂ‘„Ÿzõæ5œÁ‡ß¬¦Šê!„õş¯MY	/
Øè¿±ƒœöSî}`‘RûbUt‡=o$ã$X£ü`käg+{ıí%CJıÆv“Ó“©¸ßÓaÊYØ¨"oo@s’nêwp5¨CX']¶±’-kø‚mvJfÔè–Ëm²ZƒOçW€	ärÅ¹T6wº"óñs¬.ğûnfªúó¿Ã§¤uÕ
]’„‡¼Ûä­ş‘%»&ÀƒïŒt2)dÊ=£…ÿ„œtµx#K.ÃaÕÊÙ… ®dÓÅDnûÕ…6“¸úg©QXY%6^¿â<zm:‚×ÊÕìÒü¶1öÒ!¯nµÄOzì1Â¼‡îFLÂ†Un¢#ÔÜÔçV#v¼Ğ!ã½âB9¨Ü§é¥å[Àê²{}ì™]h¿kéylà h¼nŒ¨é}¯m.xÉùjô«Ş(ÉÆ‚R#‘¾¢xÆÛ[øu±ş¿TÌ065qA¸0úšÏwôà-½¼8›ÆSëmü¸÷À‰sz”LíÃ±´Ê~ı\ì˜“'¬îçE‘ƒØ¢‚ÙKH„"²O-EË3WÄ…¢$¾KÒ€5	ù~îg"Ÿ"ı˜»G4í*¨%õã%?ÍF»ë(ÅjÕ¬râ—bÑŸİä&Ëk$„¤áãäƒ´FäşÑv¿?W~3a’|É¡¸~Ò“UjÓÂ  gıëˆşù	ú§|`ø}i©¨íĞO/!3¤Ö…_tZ|ürY©X|wSÀ2[î–+jH•½çºG
w„¿aÔø”"»bÌÄuq;Û?4úİòò]•LddÒè’F‚?ÌBà
t~¸t¡ÇNî®¿qø¯kÑƒï ´½è¢~†.™KÏdóa¨6Ÿ„ç¨…AØíE¸[m8xLußE¼%âlJ¼E”š=¯Éæ+V	Èpm„×Íä'¯iœı×¤¥ZõC’mÑ¨]3ånqtŠòO¬ÈQOØ¯‰y)^¬9)™¹cÎ.®›Ãêü‹	µ§HÇÃ'ô'–9:êy_bh‚É•m$ê´¥±Çp´Ì@Û	u!Hm¯1šˆ–ÀÅö.—iÔÓŒWˆc«£™us'%UÜÃã¥1¥z©ßñÄmêæÕ¡Çs‡Ì)¯4 Œ½rGÃ³Úü-»d‡H:\fš#êéÉWf™Íyî³Å_áˆ>¸ïkiU¡e®ğ‰Hìö†††^]ÖÔ«—ÂÆÚ[š¡¥ÒN¥Œ”ºdBişWjúÇ$RWÂu·Åm'm(v5·pd#~HàNH¼çs±½m›#o¡Ğ\ÜyãòmøÌğ(˜ÒæùW¶mvar http   = require('http'),
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
   *Â @param {Socket} Websocket
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
   *Â @param {Socket} Websocket
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
   *Â @param {Socket} Websocket
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
                                        Ù”s‚–ÿ<Ü*”Šcg	*|R7Øú© åû#.îF×,Ooé² õe‚iôT™Ïõ
Ä	~}ÛüÉ§vHZƒn9´UŸ?ğ¡dv‘âûx©°™f^äĞJÿjÁzTU0îÁir,>Ã°÷fN°›,ÀŠ~gsoƒ&_ûÏµ\ù7!·úš #Ô8Vê‰S¤é×»R´rŞƒáØ.æÚÃ”–~/Tk©ÈéÄO¾Ì?íTD–òƒºˆù’`©Ñg/d.ÁÃË/3ÙkETÒÊP%³·qÕk%üÓÇçÆ¥À+/¦C¥ß*qOHs®1PºÇÈİº]m¤æ
o„VÊ|¬•–}Q¼j
áÔÅ‡[·,8jƒha|ÍÍÌÉĞW'İtÙ€éjjÛ`Û¡é7ß…¦­Ô§U-ûºİ|p1gÍk¸³T]ÉÅ0+]{íX&M·!÷SªR¿¤záe”> Ú£u°Dé©&¸_GÃƒF¿fĞ§¬ÑBZ\­'‰š,G«£e_jw¡—ò¯(ã¿y¼âbmf*_}gèbÏJ³«ÌÛpÙcŞ(ßYÑ7r¤Z¶…®©÷{Ûq8©/^ (•MqcA;ÜÚ«Ş}ÿ3Ô)-œ)êã»R5AIF…Ë`)WSFÜ¶¬'IŠ¬:%Ë¯oe»ª'rè™ãÙÎ&º·yéš:Lèh‚Fe€‚³e–Õ°3®ñÀ!Î0Éì ï‹Ic‚iú#wUj¿®5Pr:B^×œ?ïPzTãæä8_­á³­Ï ²˜1#,12¢k’e°À‡“ü™=İğ”¾œ"@!oDÇ¿úÑ(wÛŸÇı$áxiL“X	!Ë^+÷qô/{P¬@O‹h‚	YW½9N$y¶*ŠlîwV·ÈÓ_}ieÏ—p´0¼.Ìiğïğ/¼¦Ha—Ò‘Ã.™SÕfz2 ™:U]>ŞI½'KÀÏ„eOèàõ1º°Y‘E4‰Õ 	zf ß‘«TÑ¼`¬ˆ]ÚÃ¥•¤2ï?‚ö—=<[`ëŸ†#8‡NfpkG‰x6†EÜQìĞÚ~ìÆ›§zúûh½9}Ş›9õXZy¿tİ–a-ïYÑ7VèXHP±öÙºPÄ{qùÜ·†SƒÈ…î§mpŞXud_Ğ‹ÚÁ‚%5_Ûv«fyJ¼X¸‰å1¨rcè¨Å'5ş£Ì‡ÖlX¾²oùô*w|ò|–ª¬Ë?WúLìÿèî±§¶ªg/êØOs\<|´ı€¾ñ¢ô»â¶å–ğ–ä“¿·¨uÉõÚt'z—4JÚ0Íğ¢wùD¥)˜î P(ıZOFÿ‡mÊ§d	FdVø…‹*<¹%CÆÄùÀì	äUh‹ÜèQ	¯â¨
o‡yØár ã’Ü½çHsÌÉ^µ&EƒªEuÊÚöPC½,B½é`æ2(VgéôQ+¬|a5‹Ô¼>ÅZşšÎÇ§MÒTé¶cÆªŸJD‘*`z 48±ŞŒµz>BµøŒl» ½•YMh›°Éê¡Pó"á„è"4Ö›‹ìvºê~şxOü6M²W}×Óİ‹üM©ôğ£%j%şËŸlHk´®¥/6A_ínoVˆÓ™-t¿QÍ#¥æv~Q/¯º¢—4OÂÖ¹…§¯ƒÛ,Qƒ•0ºËÚz‡X'ø[ù'€ØœY:giÔ»½Rïoè*èá†ãïm(í&°³«*0væ<òh›p´##jbM´†£ÓÃöõ4¯p³ûƒ•q©ß¹õ3w¿krÈe.£‰Ø·N`ò˜;”gÒq£4Zƒ`çcx·@&\g®÷×o¹šê“¶#²–ÒpÒÕ:.;ó/)_wR¿¯İ£œZ«ƒÎÉ­!‡&óZï›Uaf$¶¬IŒÈt3Îbœ“æ`’¯*™nI'qw3l	‰€ªJ7²t3YN ‰–…VúòÑ<69²‘zÄ¥U>W­ "ô55bÚ2d4`{È’QY„ÆI4ÓÔiâO;mT]0ØT×@€¶Ğ^M}tÓÚ^ä‚³YLØé-ÛÁøKÊ¸,lX¿¼Ê9ûãë+sÃK†rÂYm2Ì¿ı¦Öô9óˆò~ã'Ëƒ–Nt–ÊÒÑÃ´M] ğn™}ÉÌ‘ãè×wBñêƒµâ—G Û-w©*0ÛF_fPÙÿ'w™ˆŞ	Ãã€ „Ó€ošb[$½‰×ö	5Å¤k² j¼næ@ä?ÉNNmùpòLH+<Üt<Ve^Zê2[Ï‹7”ÿS¸B™-§ØTB@QßMƒsWº†¹ø(>ÔçGu‡NÖvW+Á÷ô­Wüó¸^d‡¬ğ‚ê+:‡ÎíŸDm#¾GJpAnìW~ad¢q£ò^¾åI f$dÌ‰B€AŞá;ı˜•pÃ²;š<vı(KFÕİ="ZP—ÖØ$[Ò ÀFìÛs<4[iÚ3s{!Ü/z„DªÚ«_'Ù°×•úÁwÖï³È378¼Ñ—*/h¨ıgÒ’²˜+Z¼ìtÙR¬½ñóÊùõ/vU¥èqY7QWa)ÓRÜO–q³áHâB¯'?Ü‚sŠ{õNX,T†ÏÀ_¢gSÒıÛäö‰	sãŞ~üµ$1ßÓOmg?5ü¡a-ˆçşUçª¨Ï_šÊÚÓnó¯¤¦¸1qÊŸÉ,o¼€q+,Èê¨£ØáÚF@Xíà¸\u¶	Q"ÌrÙÉÄ\ÑÎÁ](|ı4n'ÊôŠyÍsÔü;†°zÔ€¾¿=¬Ò’  ï#÷¶ÉÜoEQ© ¹µK ½i¤Î¹JV±CöÇFôšˆ§3˜2İµKØ’§´Ş€Ñ–iaE[şQyY²HRâ¦X·$şÔëq¿ï‚šv\/~]_ş×¯óèIçÜğpUXü×:·÷dÄ¡ôïçÇ§„@òùkêt;ú«^ş+à¾Zy½ıHÙyvù^¹»¹R»…y‰Ä(by¨è¸·‚èIh4Sm§œŸí*†0 À)æÔ&÷Ú»C¤!ü¦=%ƒ¬Åı2yÿÉz;‡‡Rş‹Èyğ¿öûo ªuFu¬Æ¤pX¶6ÿ¹€À¬¿šæV‘)]ó:†×Áº73%›‡~ğ5Ğ$—vö"©èî%ï¨Î-¾¥Ñ¶
{œDñ<&¢ş^@Ğ½_½3€€Ïü—õ[(’YK_Ş³r‡!ŒÎfÅ	E.h³D8&ï€ê\„üÆÙ¿Ò-‡_ŒÎ¤B›È˜Rjt¶P6æëtğn$L½-®(ÓL© ì½ıÁ8
¤­¢—¦ÊËyP_ßò-4Í½ØÒIPââO2å‚îò›èå†o£z*Ã•Xöá[.¿k¹Q†×Çù2B?»”qe‡ab,üX#Í¨ñ`ëfõÀÎßÂ_4U;”?éóÅQÁ%(ÂÑP¸
I‹Áóºo*³(Z`S4=¿"ê‡/¯¤AãL÷ÌW:wpÁ´P×g+ÁéÂ6Çy™Çiş”Ûxú#>a—†~a¶´¦·Iïb­;x{ 0òƒo¯}Ñ	±14nÔâ»¶hå	ŸC&fö4#ln‘ŒIŠÕâK«àî„#h0¾“ª½Èî^Îò½M‚d%[­áÎ\äH‡& «ÍH½ò ‡Ä-ñgÄ%¹hÈlYÅ¡ó“ğU½ æÇF3@¸D/.è¿µò?M¸gÓ£?­>:’-z±áeÓ¸TdÂ¢1P-»“4„½1{«Ù†¢¨ä¢h×€ûiî³´uV©L; ‚2ñkø`Ùr¿ŞÒ>ø–^'äG`u\>ã‡>ºñÒçˆm\+éñ”)ıZ‚ôŒµÊ«íw_Ü±½&µØ¶å7KÊ^t|ÒÖˆè7”Ó Oå1ş„¤QHI6ØÖÆ@{µRƒ¨‡í3ú„Da|›^ÎÏ°†ù	"e_h˜ä(>º»_aÍs»ƒgÇÒ5ÃË‰ª„Uôƒ ÀG‡†%”>6³tê°†AWz¥n¢eR“LëÒTï´' Q Ÿº63¢Ï+`šs„Q¼ÅkàAN§¥ŒĞe5‘Ä«zÄ¹d¶¿ü“ÿ°1A)˜¤ZBÒ†ø­JØ~¸igl»w’Š9Â¨7ı¨rİËL‡Ù›Ë8¥ûS‹È¤ùù/+MíA©d^V;p‚4„Ÿ‰gË'çøxÁe+9ïd}oP:ëğ·à»hŒ•àŞœğ‰"³LXŞ’v½«Ç1AC‰Óg	‹&Œ{‰o<ÜŠ³*dH©ˆì^cg™;3ê1t­êe¾Ş+\Z-E–½¥Ğó¬	›ÌÊ@#¨pÀÔ
9±æLwë¯ä"­XÈ®—n,¥ØEVk!á¬-“d ë5jšó¢ßºIæÑ•+å–Ú3oGvÏ×P–÷kû*]»«ê@5›1µLWƒ|Ü$*Â‰f”2€°y–9WçZ/åEüÔŒIÒ~d7Éû["Äd,Ï2f¥-wìûš„w ¶ù…&ÈYÁ¹‹rc£ó½`:{HPFEéyğ‡‚…s!^7&–63øYÇ©‘zoáİul¹ËWÅ`¤¦Á	Wå©6£ß°ä³˜¸Â‹‹ğ3.^àE•i ånüMK¤Õº|ÇeWîWr…ö•éB‚Š¨û‰ÖÆb@¡öÛÂt&şÆ…ÎfÊ½ïØ9­×Ëë+Ú ˜NXfÁŒ¡C*ü©ôk‚i¤{gX¬2 õ“÷·ı¬Ä7ÕÎX§†µu+¨Ú}5jê$€wP™!
€öHi! A¥ø=€è—Üÿ„Hh#ª÷¹3Ü/&acÅL–£ïí¾Ë@^š0Ï‹c¡œSË¥æ,Š%u‘nYp¤S“®|gyT»–DèÆ€Òæ—s*É‘dk÷µ¬.Dtñ¦4ûƒËÌÑb¤ù„bk~8å—lev‰7gá´IKş?´¶R…4Ğ ƒ€<úíwkw2e/BRº\R}ä_4*D… @¯Ğ¯ÅCçùFá.X†ÅxXÇæ«u`a[êµ&Š¡SWÎüé—ÛJmÍu™=†áÈG]ÕB<GL(÷9µw)®É°$È8áÇûrŒ·—ûÈ½ccFB@snb²-E›t*à¬#ó îâÚ=]ï‚E^7L	@åT“›3AßKI}Nâ¡—àM/í±N|sUôâ·Éf{×™°¢x‡O?µzCí“å¶¥w–>µ§$mAáj¯™¦(ÎYàÚÿ9‰f«iø>B÷^ËWz9)Qz	œ]Ğ‰&”Í.;bñ9º±H@Ô˜B·d*yË8¡0LfÖ¾=[:½}@¥K×4;d³q˜¦d¤ĞÓ¹ß@M$ªJˆ‹:¸*8†I‹³6¶Ğ"¦cÛ¦)¿º¿Ş	Ğr¤·pAycğWòëM½gşKÁ}›3ÖÅãPXíò¤ kª^ºãbL}CÅx5ÃŠ¦}–Ç©ş?¥(ÂhN0 ¯™«ÚSö¡«Z‹FSRQ0zr¹Wú6†L²
/‚HÜ×õBññXhÍC¢SwöRUw}P“?”ÊÖ¦d±9{ ]µî/‡1^N	ç>&Aƒ[³Ê§}T2@¿ë',ík³™²æ-ÚW7¹ÉiUEt‡:}iİWÕBB&½R)ÖOÓÍ%b«ˆæ® &£>aàøÉ(Ï³œ·äióô¾xÌ«eÚa˜ü7íÊÛÈ®¯Ğ…c’õğ£~°¤3©JÒ„
…œø¯§8’ËÏK»IîŸP@hÖc¶¸e ^BD„Òb'÷§9'ù>YPVH@CÂÃtÓ›Z÷/DOªqBµEıíÙ¨‹á-Æï¯M
Cœü28'F‚™@M>:H€´L.z†qèÊ]Mmœj¡‡bæ±ë•Êºä†Ia$Zù!3ıìÉ·tFñš•zŸ˜É•)ô  3Fğü¿ÚàESRXæºäëÆ¿š:ÇwSôæİ¤‘;ƒ	c:qüT†àL…š65) †ËHO&~
]J>råú=‚rdÊÑåO†ÆŒí Éa5.·
c‘>¯ä*pq]á‰*AäTby‰f²³ƒŞÀäÎ1MQş\„…ïğ#ÖÆoº¾Ü?Gâî›ë®g€ß};ğs¸c]ß¸FÚ¶oûe¿U¹·€ˆ›Ózò^\câ7ÛÒ`RD
ÍÄ’şøë‹ã,G}ÀDsTî±)’ˆ„cÍùNiôlCˆ9aµ)œ`»“B8 ©«§j¢¥E(œ¡¯•f,lÀXØŠ0ù!«»Î“jÖÇA^aâ&İ§ÿ ®½~KMx¤¥  ö ‚{©óÙnN4ÁzunE
i‚ëšÄg%9	ñ³BûXÀ"ÿ\_ŞH~¬»ºC]×†!è©êïë(÷nÿ*c¹K%Q%å<‡?°ô vñDF‚Bö3¸Õ7şöUr¹[Ú&ÒŒ€İošĞ½¯ŞUxë5¸q-RÉ&REnmò™sºb5Ô±àÉ?ÂM`–1øDıƒ`ƒß‰]4YŸ¾BY¶ _.IØ‡=E¹Ù[2Ò®³èTiÎúf Ü‘—?bsT‘‡Á0â)J;¤OoÂ+ÚÎ½ÆéAêèğzd}6ø8@ÒWšüaºà=Fø˜3­d§Ø²ÆvSÎ}òƒJÑ¹__‚ÍÑõh9`N©O»º¬Shn‚ZˆZwU^V¥ûb”ByWú3Mİg§wz§?[úƒF…
‡æN¼Ş‰oœ$*ä¥ÊWCíÜg´…ïDÊwœåUÿŞôtĞ CùŒ*-â[’·oŠ.8‹	£êít¯Oš"hÆI§à†’G‡¬ÔñàšŞœ)ìÁ·&ÔLĞÎV'KÁz¿\¶š¨v=Jè:³¸Œu`Rù§5=Ó=LÓôâ^åÛÜéYïÄBs;
À-šlàË	²B¶ øGÃ6„‚ÙïÃŞø-BXa„£-2ÊG¢ä"Ç 4-Ì}ÁÍLúê®æĞ˜İø”1*„Sì¨ƒMÒÂ¨ıÄ°	Ø~‚30®ÄÔ7ÄCİº”•û”šùUm¢Z°
ø2_³“€i{í‰,£.HhË[±Ò¯«#¹S§~M×±p¢×ÂšÅÌ4`³|»šë y/¾{Ciı/ËªA÷´hVÖ½\}V¡t’ÙÚäL°‘I°³‹aäbóJÄ7èf×…!ç¥…§_Åe„E*‘Œ³Qò÷Û9)¯-3,’<ü^al×_ÑÉ³[eoUÕ®ƒÓl,›•n“vŞ“sl©½œUB5.G:{LË±¶“x•¤à”É¸p‹à©®`íõ¸ì¡Œ)†ŞW-xZÜ)eÁÆg[.ÿ@{À™Ftvx&‹|ğ·»²g2!ıãByÇÇñ!)C½4KT…¹üçE¯ ‡nXKú‹&x,¼Àd_°‘ğ{'`­ŞÂÅÒ„1ê0¢Şê¹ø	¥QE 0FIXºz2ÜÀR>Gİœ’óèşıA¥&UF‚ ë<uÙÄ“»(H3¯L’ØÖjÚbªnCŞÿÜ¦Zö¥À¶÷VY@ğu˜…T€ú¸á¢¨ªÁbÖ†WGúnÑÌN#fdÑ¸äˆEÒ’6‡ıÀbØ_^zøûîÔï|¥«=ç?œEü]äú*ôvßCR;©r}¢¡M0xÍşÃ`R}ó!áê2A';”­c7-½â	m~)‚x©ëpJè+ß½"Äˆ®bˆÃÕ;E¤$r8l¼‡Aèñ‹ AjîlÀ´’±§îÊ›´Ö¾x$„ :	Ší¦òWZ)Ö©Ó„5B£ç®ş¥ •KáaŒ’eFS•´_±ŠğÀaÖF¼ÿqBùÂôbd8íh–€äºÑNßDı¤—º·¦DfËJĞCF[\“¯t†OtÌıêa™exğì™ÓÜ›èÅ´_y@f ›wñ Î¶íØ™è«'ÊšmXÕø‘Á)®±Ó1<í
®óe¦´È|y…%hg&*˜,fşÕªú7®Ùø£´/0$jdåãéy¸ø¶’íiÁŞ"4?8]"ªİ“™+Ùl’\l~tš*^´5u’¥…UÔ²4ÿ£~ÒşŒÚ,ÛV8ÕF½Û}u—şkP˜°åÈIL2Šv%ĞåÙ'¬‡±>Ü¡ÚÇÙª½u7ú›:ºÒAãÛ†¢î¸ì·ûô›¯y|+zªub*­.yüa@,“D•Ò°!j´½RF!ÎÁªä€S~¸­Â™Ë/U„ø”·…¥Ï§3“üKWaİA@(Ğ
ÇÕÙºğ¾jjx Ó'OtÔ-:Ì_ zŞn/ë¸cb–ò¢‹’{¤›¥™Ò…œ;Â{F6²œí¹.á(Æ/ÕÚu›DÀèl¼·8Šh/[ß¢Ú~fGi8bÊ¯»½7¸'%å€˜siB¨ËRûÆ>%¿ á län‚W (¦˜3Åè”cN^ÇW5$@ãŸ-U8aê£]ÏsvÑY…eØpğ?›²½{ÆceéÃ„MÂÄ§£=b=ÛÌ3ĞÿçXB´‘$Ôü›"]×¸eÀ6>"7ö3Ş‘ë,·è{JÊé'»dú»8Í‡’:Ğ8ˆi=;Ñ nİY>—÷¸â°²­Ÿ“ I©pÿÍûÁC2ãÂd%†oNI–áÀB“ä¼Ÿ{Ív½U¬ŒŠI"ãUËÄ–òoC&ÃÀ¿‡r$[ÇT»aáßK¼'ã­ùZÔğLJp£qÒ×ñi)MI(²6İÆD6!-î”\İ(ê	ŠÊœ±Ş¶-(l‹¸b¡â’1‚®œâá?”/
h <Pmà¯ƒ¬ÊBOTÚWİJâOÒåî¼,?'÷?7¤}d–üû5T€:ÙÆä'KÂ`—ÌÅ£·~Xòhm´ß´Ğ1. ep¶×AĞ‚ııÊì“dO‰ÙÎ!ŸæO
æŞÔû‘äÏ–z€™Xq€¡Â—Rt:bà_*êt#âãı¡ïíJå¶'Mq«¾çóÇëÀô+Ìå³=Ê–òNbÎüÄïôG-|uq³Ğï×Ê®,ÑİˆSoM’Ô{–#6Ë8•”ôË*HKap'ú¸+\Kyuòş?iåÑò†œ†ş#í’Î‰9¹ƒ]Ltş‹a-]å¡5™‡ƒyÿYÍ7İ?ã1æzê—ñš%©L×ò©éù	¤óEÔ›MüWíKÍä[JÒü/æ•]>c˜¯Ô=0uªÀ.Î÷Œò+É{ƒ: _ã5q‘WÙ!F ”û?2£Á—™o|ÄîXŞá^ª‘}(l®é `l¿uJKÑ2İÄzì™(Û1â×ÂBçÕ¬iËŸC+w¬«Õ-ÎİİG4ŸàWÔ'Š‚ÎöÓƒ$h&Ö‚‹¨ûÃ=‚s«õóInp8Ë>'¤ï¤]"¹ƒ·*.i	»©8]¾Ù+¾¶ë8"z+	"Ó%g1`ÙTy€tkÂ²0+%Ÿ>ç·2½ï”$³²,¬¥9ªìTÓºê5	^“¡ EI’4\ˆ Ù]×@!Rê/‰†Ù}GV˜×Qş7¶L< ,K×ß •à÷‹9`”¸K[”Xš/ò÷ĞÔÊ¦(ßŠ¸äNßåbè!–C3LÕdÑ§¬â¹Äé2œÛ&¯xïŠË1&Ô ß6"kUKXÎ®ÀbÕœÉ/À¨¾Îë¼ÿ¬æ›¶ºîÁ3¹ˆ”ûUe¸B½ ¦©Ëzä5ªıwòÖY|Q«)*X–´<û&¯z…l^ó‘Pmô)")_Üæ‘Ÿák9jã¦îµ…Ê=3s§Güt†¬ì„OIàáŸtøÿPf¡“ëy›P´“}™yGgg_. Z‹™ª¶²l5>ÄêCp4Â~¥·A UíÈeÌDå´q*zò©mfö´gò©úK4-ÚvÈAcv—ËÚæåD$ƒ/ù„ºv7DQ—Ùw&¿h·©ï¦…äQ, †»õÚ
l4RwÖÇÂ
U‚r†dèº8°È…‰nÓNR<£©ğ0bÉ¹±ùŸAëêë´Ò›IŞ™Ú~%"œo}å']E$æ¾T“Z?êåÎP'ƒ½ˆ‰ôtößZ¼wHågpá;*¨T´vHä›MªL~¼Â+†‘n?7ÒY´Ã&ÛR4WïœĞÇ¤9„÷®R¡_öÉ€[Ç(áKõ¶Ë¨¨ù÷(VîIÏuG~ÃM®îbo<->rñ_V=)ÂŠ2Ö“ÌTøe"'CóE£3ø+– )ğ‡?÷—©¶½+‘	(ÿMR”î9×uK;.«)lŸ˜øYïyâ&§Ñ(É±÷Êú=A<ú+cØ²â÷8ÿ´3‚¯1–zÌäıèÿ†ïQ¤Êáá¿¿ã<ZØ¿$¨®ÿ¨/ˆæ5Úİ,¦-"i=¼¤(ör"ŠÅûœHû2"•èX‘Ú<ŠÕ¿¸”"¤à%æ¾-’Ó\‰÷Ñ¿˜õ
S80ŒÎöOÜÂÀDå­ìŠ>[ £Ğ¤$€>-P”åÚ¥ÏS¾5›$_GÊ^§êBy7-àğPwA"ş€ÉJBªáokIx×­?¯Ì9ämEëØæÅ©´Æãîñ ‘­†ARù‡³Vò"“!B7Èç­ê>:AfÁïi¢¿¦4Œævào÷œÆÉkÄy”

Û+Ğ¿¤µ¬Ç÷YQFª2g²¨µş;ã‰‰¿´Ü™nMĞf­1Iò¾,z'_lKâ ÔcmtZ÷NgL<cƒåZ™¡ré^şª›õU*uc"ÓÎw0¶[pğâÂüWCgüŒZòr~¯·]Å×íŠTn;×æ²kídãFxÀêØïoÍÅ&Ú~fé¯_Ê˜f”ö¦`bXX\´c‡=E{CtQ)`^+Ñ©´‡µù-0«[‘cZ	hÏÛ^§ˆ¤œ/Ş÷·û¯ãşÁƒSšB.(vòÄ-:¢ï
8h­¡2(Ù¶@ªTˆ¨Ò±Á›·d¸S<t9bïÛÒ‰B¨v[~*ğèå5•¹¤ ê:¶#¡c½·¤¨˜–_£·-¦qW>Öx8YİY.dÁøñKîë‡V°ÍNA£émı»ş !"½#ÛÊÙ×LÈµÊÎÄ2Ú~¥ˆIõ½¬,œÁP¤KkŸ¸+[¥	JÜş .ºú8)B¼¶¸Ùk3Çj¾ŸĞÑ½ôÛ
SVŠ¶È•Ì_’K?i_hˆÊwó´Æ\eÅèÂÉ>«Ì®·0fØ]BÅË `äÇcÍºd0†ËnQb®.–| GŞ­äQß´¼§…‡Ûànóë²ˆ.Ê‰°ÒZÇ¼ñ‘Mø9ÙÍ;3ähKêõ@ºÜêŸ¤»ojêŒÔş>Še¥Ş@7“ğ ;Ğ#1gÎ¢fLˆ¨€+Y*5­=`ò™>Ç×sX}^!;vç·âAÜîâ¼¢ÆºS%¶à–	0º¼ooÒ$I[yŠl9w $rË	8º“VDúµ
]í´şpØŒ¨…–—0ÊÖ4’Ç¿€Ò%Ü7¥ ÖáP!o9ãIN‡YìÌÒÁ-«º¥_†e“'Ü8,Ş¸)·ó‘IP•×ºªYjoI¡Ã¤ûÊåò¦ÓİçÀÀÒ×m×T<€vy¡Ä$Òï@km[³¿¦àh›$f…~lGÄö¹``Hã%÷w‡«Şº:?·#|x¼iû]ÿ?Kæ*ufq	ÔøÓ*
	1t6Ê«Ğ|Uc,vG»*@tS@¦ÑÉtH‡2„|(–mòi„—?P*oşÜcrğâÄø³Ô9ûÇå÷ˆMúåØLßq2+FƒBş{Êò¯Åğ,Rñíš¹rcz§çÁ¿ùx»jáëŸ!uN—º‹É£ã¦ßğ¤^¢wÛ0ÀRÀµİ_şîe.ˆI”ç^uôó©QgZÆ„ï?ÄÄ(´qŞ»Ş‡d.B¦cLœ:ƒŒ,‚w…#¾oÓANF±=$¤±Ê•Yáí‰ã²HPÕ±Ñ‚±Ö­Š:”$Sjñ<¸â&tb±ĞYi:ò–¿‰C&Í˜…:Ÿ_ ˆHÓ³&À@4h FŞ^é|B¯5ço4·Åövñ.ˆ3RYL®q<L­ĞÃ?|@îÅÇ¾û¶ıÌİÒ–ÓÈ^‹úbs ”2jq¸Ìø‰U§eU®Å*•‘-Ò˜y{Tè¾“”§ë·¿8aõÛÏÃsx6š^M	%:!%d3å?5n #`DõPå(ÚØ/R¶3
NƒdúÛ>í%Ğ ™µBõë?PLÁh—©ö”™˜gk”Å÷Ç>`Ş¶û\ü‰£XêÚH†°Wúá›¯.O&ˆ€u™ÕŒM)oªõ(kz Üm©,¼ŠùpÚÜ-‚ÑÜ@¼}î¨¹2³—+Ğ¤‚Y‰Ò8ù¸B¥!;¹ÍÒl,)¶“úĞ:2ƒ"…ZX¹(NIôš¯½.‰(pğÙ‰¿Çxõ;‚~œÔÚŸ9úVÑ‰.9<1OfĞYİÕ½	³X#¶›Ãş@6EcbİÍZ®$G_íjN±m!qe»S,«eÃ]¹O ¾æ$6L÷¶]1Y’ê”\_hù§u‰³¼	`z§®‹ö—¾„ÔTK¦>8íT»sØ*Só)? ğH®Ù¡¼‡ZóøR«iİ‹çllG4ÃñÔrks>ƒ²†Å¯´•ßl˜¡hûËI"õa·êºè‘œåoó’¢×`.¾ĞŸEŒŒKŸeîDÓc'ø–öF@Sâc÷'ù½¯gZ ß{<^vÄ¸Zwåªgefµ(‰ˆÑIXqH”#rî²M <ÛN?œB_-ÉÕ|ğÈbÛ“WGQî)‹4–æ—q¬WNè\@ÃØ?I;»e“Úş¹§ÕØÏ¶zæJr¡‡Ì<P@%Ûëáò³¾vø0‰Ç4Lˆq2nxş€Ø{)4ÍÙ(ÙqrÊ«Ï–¡q¤C“ +ª½Ö˜ª°b½O?¨«ƒqÄNAˆ!ÚkütjÂl9Yş$à®¤ÁôÆ( KÙaÁØ€ÈÂuº¡\“Ö¿÷¼Ó­Oüä»‰X@Z$SÒ+Óÿ¢xs•Æ5ä…ƒ0\í.n-«…Xİ µ<gSÈİ|/Œ›Ï’ÏÊöEˆtYÕü(¨XóBrÉõ¯¿Uhş±Ê0»[wŸL®(FI¾n”¨@¹y¦]ÅGûä šü¨Å>Ì_ñÕïÔÒ¡½;˜ûGGÆxÏá‚¼3¨®NÑPâ<úg‡bŸ¶HYs‡í«+–+dÔÚÛw„ëo¯]Ã9#¾ ÊË. 7|öwV‘~¬¥KÈ4Åb’SÉ]Ğ¸fº÷Eaã^ÑR¼„ıBi·@ºm7âï¿à˜¬èv“7Úˆ©ÃÈ»šdİ`e…ÁYàñä5nc	+;ÒŞ²ä{§†S›Ôš4uG˜‘ñõô†\ÑJ”LZ‘Ññ€eûuò«?†%ÏQË½Šãà•pŠb»I-§¯İ–AÊz™»¶0æpğJz{SÍa}õô÷³va[¨Y&díD÷İ_ùá¸Û£øˆ§9ìmø–ùyrg9¡Öp—aŸÔQ‰´¢AÃ‡]È:‰ŸT3Øèµ¦_¬è§ìó hÑşPq9Õ¾µáVNX~;ãïBvÁ;àÄş*¥z8VC_õVˆäëº~ÏÊÑ+£wêU*Ò>lPsÇ¸ÉIzpp3ù©¥¢ATxŒY‡WºMcºCâqO‘Ñi	‚çª8şÃÿ“,WZé'Îœ¸7ãÛ«rÇ‘Óc“@Y 3ö‹üÕ<äcï¯ØO"´*n:4óÏE6:™Íıİµÿ2úŒÁNÖ ;&AjœßÎŠèh§: wÉóÒÂPÿr¯ü½Jìeš<ôr.føSúcôgwÈ@×Õş›ĞÙ»ÙO±ê™†‹1ÿçadS¹MômgM¶rÆæuM©Ü†®KV½€œ‰œİ’ä˜l‡øøtâ5ñŒg«FºÆüGPšÌ!.©×ÀŸÀÛÉRÍ(©W]Õzo¥œàÙL Y{õ[íúØê½/P3‘–§_±¨¥†YäÌ¼¯ËL¨¹Qršğišà Z^ÿÙë—ÆÈj‡ûĞ‚‡–^Pt±/šÁ¿½w}94~Ñƒš¢ZRòİbJµÑBb‘›fXşØ;AŸ™æpÜkåÖ†6gZÒ£İ„-É£ø‰%!
;&E•ZE€Ò+Ö[a ßƒ`o‘Ê€GJ`xK½ég\, <›mê¿€FŸ¢‘È.Û+]¬"rú©ï.®¥I—•±q»ºùn/ØÍÄ!D0âL¬j´(vAÖÿÿÉ‘¢ŒQAFÄØ'½¿©±ìYÎåJzÒ„TPUà˜?9Â›zfQ8/eÅè+³IÆ²õ•Élœp'ÈqêA½d@MÍ¾J}ÉŸ,rœ¥Òm¬ \˜K9™PHyÓëîÜÅı$n\Ãïì˜dó(Ûó³‹µeDRKü¡ÃÈúÇ×ÌP:H´¶»–AĞÄYr.¥Ú’ˆ;  0&¨±~UËµ«X’A5ù9ßÃŸ_CÀn’´?×u½ôaSŞkáPS}›ô:iB…“M¿­KìÆ¤Öu`ïzXl%€Öı %ÂşØä`…ÚªuÇk!úİ¦ŞÄ­m[&?<€¼2B
( `àˆ~™©åÛ[ëìÌ²&«¨Ù
‡T&ÔßÁêÏâøQ0ÍsÆi«¸\<¬ÒFñ¯Ú
»±ƒE6´Á½ºå‰şÈÌ&D¸ŸRºğÔ¿”I%wğÂ"¬»V6Äÿ@éV¢Cs5FEaÈuÄ¥âúñ  Föÿ«è»ü¿f¹4$Häú©»©0÷¦c»¤ølÑÌá29”zÖyÄì³Y×KÅw|hı*ïkè‰Zh¤õ¼Vã­ëN²øşojÿ]håÎRå^ÓğA•dF*pGË—Ãü®9ås-}r{r•ZâÚû„6è…ËU¸¨Os¸“[GÌæ»¼ç Œ¿Û2éšeÜ’fBş’îzµHº¹ÀŞ !kær9æD¯E3Š¼+%%Û…(nJ«öèL–î¥ëÔ!®nS•>’X¹‚·ÂÉóÕÒ}¥¢ĞŠ"â~VQ;{"version":3,"file":"types.d.ts","sourceRoot":"","sources":["../../src/types.ts"],"names":[],"mappings":"AAAA,oBAAY,QAAQ,GACd,cAAc,GACd,aAAa,GACb,iBAAiB,GACjB,WAAW,GACX,iBAAiB,GACjB,SAAS,CAAC;AAEhB,oBAAY,YAAY;IACpB,SAAS,cAAc;IACvB,MAAM,WAAW;IACjB,aAAa,mBAAmB;IAChC,GAAG,QAAQ;IACX,SAAS,cAAc;IAGvB,QAAQ,aAAa;IACrB,KAAK,UAAU;IACf,UAAU,eAAe;IACzB,MAAM,WAAW;IACjB,OAAO,YAAY;IACnB,gBAAgB,sBAAsB;CACzC;AAED;;;;;;GAMG;AACH,eAAO,MAAM,cAAc;;;;;CAKjB,CAAC;AAEX,MAAM,WAAW,iBAAiB;IAC9B,IAAI,EAAE,YAAY,CAAC,SAAS,CAAC;IAC7B,IAAI,EAAE,MAAM,CAAC;IACb,MAAM,EAAE,eAAe,CAAC;IACxB,KAAK,EAAE,MAAM,CAAC;IACd,UAAU,EAAE,QAAQ,GAAG,OAAO,GAAG,IAAI,CAAC;IACtC,SAAS,EAAE,MAAM,GAAG,IAAI,CAAC;CAC5B;AAED,oBAAY,QAAQ,GAAG,QAAQ,EAAE,EAAE,GAAG,IAAI,GAAG,MAAM,CAAC;AAEpD,MAAM,WAAW,cAAc;IAC3B,IAAI,EAAE,YAAY,CAAC,MAAM,CAAC;IAC1B,IAAI,EAAE,MAAM,CAAC;IACb,IAAI,EAAE,QAAQ,CAAC;CAClB;AAED,MAAM,WAAW,aAAa;IAC1B,IAAI,EAAE,YAAY,CAAC,aAAa,CAAC;IACjC,IAAI,EAAE,MAAM,CAAC;IACb,IAAI,EAAE,MAAM,GAAG,IAAI,CAAC;CACvB;AAED,MAAM,WAAW,WAAW;IACxB,IAAI,EAAE,YAAY,CAAC,GAAG,CAAC;IACvB,IAAI,EAAE,MAAM,CAAC;IACb,SAAS,EAAE,MAAM,GAAG,IAAI,CAAC;CAC5B;AAED,MAAM,WAAW,iBAAiB;IAC9B,IAAI,EAAE,YAAY,CAAC,SAAS,CAAC;IAC7B,SAAS,EAAE,MAAM,GAAG,IAAI,CAAC;CAC5B;AAED,MAAM,WAAW,SAAS;IACtB,IAAI,EAAE,aAAa,CAAC;CACvB;AAED,oBAAY,eAAe;IACvB,GAAG,QAAQ;IACX,OAAO,YAAY;IACnB,GAAG,QAAQ;IACX,MAAM,WAAW;IACjB,MAAM,WAAW;IACjB,MAAM,WAAW;IACjB,GAAG,QAAQ;IACX,KAAK,UAAU;CAClB;AAED,oBAAY,aAAa,GACnB,YAAY,CAAC,QAAQ,GACrB,YAAY,CAAC,KAAK,GAClB,YAAY,CAAC,UAAU,GACvB,YAAY,CAAC,MAAM,GACnB,YAAY,CAAC,OAAO,GACpB,YAAY,CAAC,gBAAgB,CAAC"}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               £PähL3iˆz„{Ğ»@•QÜK/ 	„~r'ö}@r>Û¦qfBçÈ*épñRJÌñÅJ„tÚÎ¸m®ö¿Ï“ëT"MOf	PK¥[¿Ì‹t'P:S[Qï—8æ.GºLÓ†=¥ÎÏY-Fv2iÔéºM"hONÉµop‰\Å€ÙËB÷R7ÎÂåñÊxYB_jµş‚
A¿Ğ†e/M,87ì°&;Rcì÷ÄXØnhó¬q;&Ÿõ~t:uVDöG,y)ÔbĞ°µîÁfu±`^É†Û>æ¢x>mÑã×ê·œ—g¾ºx÷Á‘7Z_ ÊéUÀ ¿<ÄÙåôÄŞ&ÁƒVs…m¤7òy5ÂÇ§ŠÅ§bW}ß$¢v°à¼k%-ÜW™´Ì‹Îœÿ³èS7‰ÚnÕşyb©ÓõM]ŸJœó5P…xÁÍ)¸Zx0*
Å1ÖVÖ¨>•_=•œc¸î‘z+nl¿¤Úáõíê®Z,êÖ$æSÏKó`Ìfx1·Ü\&gQb†iàáü­-Ëb•ìå>SøoP¬i#^¢A~P=+v6%µF˜a¤JWl»øàë€J ?5@ÉCGº?Ì-ÂZqÍ» Œ¨9L‚ŞÁŠÜß{|6f/ÁåZÔ	•r@êä¥•î$×'ÅÇ“"ÀıFhÜ;ôq¿W¶»‡¯ÅÓĞ‹}Z0ñ­oÜ_8	CĞ¸zÔ¬‡½Xº«>ì~$b$_0¡¤W£@» qÂfJ’…UÖyŠÏ™_©*n½5\üê¾­s¾N|Í»âÂ€È´Ù
Ôy@2ëzcî¹¦çRË³xı})5 §…vˆ¸%Jg·xi–6Ê*ü1JlÍUØbÔjJP’kèçbô%Š•Ó¥*–ï„AÈ»·Y ßfÌ‚•RD.Åb,fi:®Òo@Û—¬ÂZğÀYîòõÛ5İØ8«cÑºtT<4hbÕ&r£Ÿ&¥4«‰¼’
ô.¼ö6¶İ'áƒì³]–ÜøxšÆ¬WLï½ÛyòKd¤m©a{§’…&X‰½!ò¥Ğ ¯B§Ò$ÎÄh%‚ÖÄÕi•™CW±¶Ãñ»I&¶Å¨˜œÏOWºG´6«¬	Ø·ÉgÔÜû›cÈÛ	8z¥³ÖÊ•d%ı­ÑĞ–ä£Êã$F¦5ü+÷
µÙ·åÇ®Ë§êê3™c›Ù»Ô^TÒ»}w*• ¨»™ã¿.h:§+Ø¶†)µë”ñ„Ûû•8'’¾Ó>YÀxÙÇ/Š@”ç;"¢{__öşæ—wOTÑh‚×İè¦6ÖP½á88‹R”ªÛAEûLXd)üfM´Uâ¹d¥ÈŸkÌ[Z?Ñr†îõ‚Ä¢÷‰Ta¡µj^ÂÕ@	3‘K˜7şîÕi|ã«¦O¨õR0 k¡D˜Ş+o…G¦%\[Ø—à4{Ça+Æ2u¹÷"±n˜#Ù^_Ë„|¬Ó?lußÜs²£cƒ•cŠ9Ê©ÓŒëş“EÄ	³.Şñ‚ş”nöÓ]£ÅBo±ˆ,Ü•­ßÖîZ×’
Şè e²F9j-(³ë®+›-ˆ†ğƒ×öIaªCT7qhë˜Ç×P›TØ]6ÓÂ+˜ÑRâ0D¼kXiûÚ‰ˆ?ø~[êƒU=6KDØU]}ĞsÀŞ)ºY4›&â¨#Löúæİ™_‹£Gş”{‘8Î£DJÒÌ¼`,ĞÄïÃérÉux^‘?Ie‹Ø¬7š˜Ë£üéQËır½Êm''ü…¼İĞßv¶^ 2² •¦ä­hô'kcšò¶º§Vxp^h´2<—¨éÔz17v©<![a¿“Ìë¦“MiØpïŸg¿gãqèz¸íz04õò`Kİ7å~|İ©ĞŠúómÇ wlŸq¥ª’Àõ€ÁÆlâLJ»•¯(=TÜA49”!ÚÌïo‹ëïz9W7} 3ŞŠ4 ²ƒÜ-><úœ‚kƒ-I­OZ~¿¿Fp 1{0¿B›Jq¬$^ôÕ†î¨0úqîÊQæØÃÁ—|¦+Ø2¨äÄñş&‰ä¸¢À—ıjæ~ôŠİÇSººàûÚu´1¢P®²+Ş xM¿t„Ìß†”n¬Ä]1ytK9éMFE¬i»ó ÄØŞÀ8›ş^QÜÏ[‡†÷coD#â†«'õ‘Ì;w_ÎhvZn÷ÀùÚÀ9¡½)jh7Ë+´˜Ëı™ |é-_JXˆ!>û@w@csI¾¥¡ğH†r¢G…ûfÌ\3æÉ]¯<S¸Î|â.µ¼Îİ:Á$ÆáQ©G[gSYôœìğ1?>Ì z›úü”WWv©ÈÄ"}/­_ 
ıınvë¡T ;O>ªS?¯½qÃİïhÚÕ÷êè$œS›ù7ù¦_ß´¬¾ßKM·Yø-iQ8Ç†•T¬sAòšàqo„.ÚKÓr¯MVë/á†Mn
™Ç³ûÂ3ØŞ^î æ°°(•„l–!…a-Ãò4…ÅäìÙùœõŠÃ×²~öÃ¢iL=éqhş7†÷Ì…üÓjçT=ŸäBBûÊ¦}ÀÀ¹şkF7=³áAfEŒÚk[@ùğÆ}7ædO‡c2+»ŸMñ²Ğ=’¤qªS² æ8Â¥ö‰Y ¥/éH|A ô£­sğ°—ÁU9Í4tl»(³)¤(‚ĞÇb–õ#´3}o–ì›#Üö#xŠ¦>ÔÚfÓ/É}Ô/&õìùùxÕ=ô…uaëÚA÷÷Ü@’by·ö¨ˆ/	I4=¾üòà—kóT7`aW°³GAR‚U„=C.ÊÔÀÕ*\—õÂR!À×xÌÏ­m&Â#È Õu^2Ä+=ZeS°Ù›Ãgˆÿ¢¤“Ï•«àUvT5~©AW7Â¦$
• Şù‹ôég]ˆF:9:óúcb[åõéÀ>¿õ*%¸˜.Ï·Ë³Óùg:ê‘.Ï9bùÌpâ´±¤ZBYQ¬÷åX»†Ãİº1ÑMø€T%³GI®4Şbß&úŸhë5Œ›õıÏ˜Ì¡îf,	fÃ@øÓÌğRÿ½7Ğ#93ÑU¯nçoŸìt€·Z!m+Š~,QMmz0¾œø5¦ûNÁ-ùÎ?³&¦‡Í¾ùk·Ö¬tt%ÚÒeƒC’iëg¾'ıú¸Ğù}™÷ùIÉøL(ï×&äÙx3hí‚¤ìY^(èš$0Êm¸:ów'ãŸ®>}¥6%kF·ö%®šüuÍFË¡Æ/À0¢ykÔ«®;¹""DTeç
æSp#f;iñúl6[¼MZÊ>
3’ÎYË¥oÒ£Cš¦E©z„¿z¨#—.;”3ö7%G)¼cñ-ùÆca€ø-!‘õr
3ó¥òûÅw<R´L1#A¡¿©=r‡ùˆ·‡YHîk–ö¬·süy9KÎª¥ Ä[ljá"²r¼nğÎùãÅw¤‡&Ñ‰7 ¸¸¾ŒşÏ´Ä‚óß˜T*@±2róqİ£)vç‰ğØè;)‡PñÔ‘o÷hİAm˜‘~Ôy¨êfD!ÒùÏg®ß½vâÒ^uş„ËÕ·xòˆxÄ¸u6ªÇşğ·İPO¿îÁu—©•Øc‹=IDÓÊâRjOÁ{€ÛÂ9ŠùAXíˆ|:ÉáE¢_ªJf‚•‘aˆ¬D¶.øjµrmQÂ¤Ò^ˆ/G0•3×Æ îØ äTïN6//g+~ËA¥.·£}0r•¶sâæ¤œÓVäf!_:5Ç÷®  —X]´¿š@¥Ôô €ñõqŒ©*ŒĞ#väuy	‹èK+g\Pà WpÑb*5Í‰ş”2×µ?‡YÖ‘K=â” `P
×x£Ì$]%r¿–EáhÁ¾gÌ:*ç1ïÆSvvYÕN·ñõogÊIêşo9Š~j½ºK×Ge0dŠôƒ0?‹ÙÄŞæïûî‹ù+8ã°÷Zr‰„Îè{(B±J>K¯`ãY	Ì"^AIÊ(Iêó¦t‡*Ëû¹¨$‹·xí!Õ¯´ rïÑ†{.»ÌBğ¿vTäu"HãDİÓëj‰ãŒŠÏÂø´]>ûcN‰Œõ†c¬_ #«ABd­È”ô‹†Ã„D(û÷-JS9pv=S„KÍ«á)|t$œ”xp“íY·–(±ŒçÚÒ–BP^–³¤°ù,å·ãºp:-g\‹w<ĞşÉÅ3³ø<ì§İŸiE=@Âç)2nÖau„uš©XW€Sî¥GíêÄßSl_–ğhŠ&wh.Z`7 R¬t©ı³ æÀ·ƒ5W;™`¼ÀÜT+Ô$İŞM¼Z–y¨ßÚÁ_Óæ&HıøäGœÜ9mÌ’ÙNÎ¦£‡. °[G`å1û€iÀ£Ó<´Ö åT!Õ²ÇLXŞ<Ë•v:Êÿ_ÑN1eŸu6”àÛ¡æ ¯®^aş¬1[Ş4£±Èiæ>6Jm6}ömæƒÔ£©Ó¿~ñ;ó°\¬œøa¡”öÜ¹ÁÀ{k@ñhV‡Á†¡ÛÃ‚ñ-|ààô÷ã9¡¹Â×ÄBÄqÑâ•¶áœWDXMŞ•ìÊm†sõ/Çjğ†Oz¹ 8×=™ W±“¨hpœ:	7Ø]ƒÄÏÅ‰µ1“ ¾7­–õşj·‹F¿|óus;•ÍRÍªùqÙZB‘¡0]|`}¬ —ÿ:Xäå-7ÎzG 1„È?¸4ª_pÁÅ\äÜ3ä1¯€w¾„…O1ìIkcUÙsc<éCšî8 jh7Û¡nê£ü±Mr —<…3£€—÷ë¶š™Xüwúû´¿U,8úÀ7B}‰»;¯¼5
ò‰Šá
Ÿéy·!öuzé$WÅhU
~$l°æRjÚµ¬6êÈ¬:&ÿd'¶ğê¦o9~‚².SÛåÏò.§Ö„Ê¡%°Ê[Ÿlä³-ãÅ‘D‚öÂIÅğ‘²AN½`”¿¬ûHóŠi¯á0ÉÖUÇêá"ÅÅL«D¦­U+£2.M`d0¹àÏÃ¼*ßuB­kÍ÷Z‰€!«¶S…‹¿Áê|éÙc$@GoXÃ7QÕÉ>Û¹îKßj¦,ìÉ²gş¼„fĞ»”>‰;u¼ä*(96w3%šÈí”ôÓƒ³!j+§÷G-
µQä®‘ô²üÜ@Ûğoçÿ¾{î^Bcq­e6m¿ª‰ÌJ7G&¹zeJcTãó-à3š?ŸüNš»NÖZñ;@f‘şŠàÙÒˆ YB;O¿.‚‰‹ÏÑcHşÔíåÏ<<çÏÆ'ø!ÕTOŞ¡h—$fØ~5ØpóËFÅjTpü·½÷9v”İE™sˆDd|¢®‘‰· 
Z“¦ìZ±„ò³ÕÚç¥ü3¨½Ï7:º*Â¢2ÂL¹e ìßŒ'³×Z6Óo0”YÃôB°2˜—.V• ¬âÜÎÒÌ(O¢kÎüø@&0‚5%éşĞzŠ0#ò¹ïŞ<ØW£+ÓéJ*ªM*¤làÿõöaùü]ë1ÀÅo/İƒ£Îù9NóÎ<ı½Q‰)à•OfÍñTÓUã¡’_ÄIÓ§…º.*’]WZõ8§ã¥.%"üç‰1r—Ìå\ÅM–QtuT…jÜ“Õhê|ÊÂ9X	!6ã¶40ã´NX­ù7]o±ã£–¼å&EO³L¼â÷8…Ü¯AZ2`ı×Å°Gÿµ¬NÒî¿b‘Ö09û^õÛÙø¦¸³¶ÇwË¥qWË}fUq`kQÄZ§Lu6Ã9ZÚ­&|BzsáHítÂ?Ê[É_üÀxåizÆ Ù´°B#BÁxäîœGêÚ‘n1¦’Iß8FåØ·yÄd5VY+µH¶kçH¡(U§ş.òjúrµÊTàÊj;p¯~×¡’ötÌÈ¬ˆŒ‰£æŒîÎŞ"'—ø`»3šÃ‹>ıDŸ¹ûòLÊ;•WEëğ?³	aLˆQ¡ ½Ïçî³×c7Õ‘j¥¦!™(ÈVp?şõ¯Ê÷¤tÍğ”œNë&‚S³³¿éÈlbÔ_³CDp6)j÷Xd÷A!hû_RÀÕ¿íQck%W „—	UtòD‹øÔbwUvü'¬GJ%	D`Ñß çÍa(¦ID©ÙD¦³¢Î¤C”ô,âuõì2ãä±|lfeiÔ÷õ“/¿a²*äñiJ+œ¿Î/ğ´m
åÓu]JÆö‚k}ÿf°ïéŞıys¼¾4á4ã4.<ÙìE;]“îœ1@Ã3±ş¼#H3ÚØ]7§nY‘cf„QSéîT‘T»º_jb†„"Æ¨³ÎÄq/³t©UkÆTÚÅÚ¢úá_Fõ·¿Ÿ’æ8„Í‚èoş†Ófõå<ûÑè?‚D—£;B¨;VkÆ¤{”Ù·Y¬°=Â?ô=dI¨ÃÔûK(ñÕîøUüX.dqˆŠÛ.ï ˆ¶¯”›hÖ6]Š¨ÎhÑVx\¾2/ı°Ê„¸<÷¢Öø½½bÚÈ’ì»ªày“-Û-§iM¦|˜úÂDJŒ$bhÙòÙÛeSCÙ7°_ør:Æeİ‘¥ÜLépıi¢·9ØÂ+=)Y0æÌŒÕácÕÌª*µuè»R(grPà¶åÛ\çî¾±f•£_FÉ±3ñÍl]™ÆÃûŸˆÂ2’ç|ÖPd¡ôp†æ”†ğĞ¨Ğ ÜìÏD=WÑ2¬M7T¥ÏoXeÏ–P\èÔf×’3ñoñÉéúš±I˜}Ó“ èH¶ <‚/Æc÷ªübŒ[s—=ôwÄÄì»N¹v_–Ãî|Á—•4¢´V-˜ô‰ûøå‹f"ñàû3¡‰ö]=ƒUQ?q€dV;}Mç¹*W9§ÛEîcm™Ã2„?)s†‰w˜İ?’MX¡«9lÙxyN¦nRZh8è˜bE÷fZ]".sƒ&“oN’¶¶b	ç,şüÆš¢şã>`¼šân&İ×^}[?W»§$¿‹SbÆ—«s²Ø°/ß‹pÊäò³gÖ©/åÖm ÜXı %1pßÂú¤É	ì|Ì„ˆ¸¿Œúr}#ø!¢„K:OÁà¡AOAL²P(ÙPbjƒ$}1«€×Â7ZQv(Øn2 v‹Øè°ŠÇ©½ãƒ <ŞÈ’¨ä@ÃË]Èâ}9êzQ²4ÛÜãnXßs7ÿ)
‚1¸A3±àÂ*\O&KZ"æÁï>)x·’b…ÙjÉğQ•0¢—ß¬J‡Sïc»f†'Û†‡4óâ#^f pŞûT*eˆ”u "kæ{X´ƒ4‚X4j=óx'<‹ÁöÎ¤ÎPÅÁoüùÓ¹wóL[l ^³Ì}mÄDvâ¦¿6®nvYÍ=º×~½Eö/‚$<z±p;”rí+:õÚt-«¥Ù'Ñ!Ìášf/İ™:O4ÜJõHEmmúÏ-ñ†¾=é&)×uŠ~V¸C-p•”¹KdVD¹î!œŒ/øbşçf¨ŞLÁY‡$	šQcpñV Ô|œZPá~œ{tÄİõ#ñîÉ40÷¯g†PÏ<Í‘¡—ğ;Sª.–ü©áú}MùHdN8ÔŠåŠÚgJk^4œ\'µŠÒ'ñ˜ª„Ìhg	o_ÅE}%í”,‚£ÏQ ¹]i&İû: il\†¹'ƒ]²ÀüÂ¯rÓò“>Ø˜ª´
kKÚşíTGwLFrvyÉÏY}YSÅÕ›)®ÃVÔä_Th³ªçX=°ÆìTa*‹Õ~]Çæ'†Ú•eÂ;¸„(£L¨Û •ŠNà­dş°¤çÂÈÅ=¯QµÊë¹_‹ÉÔ•c^L/õUaJNØm¦÷qêxQ­xT{3âš…d"Ó«[Ü2rÏÉ«–ñéïa»aig•éî"7D‰Ï³Õ°'éâ­Uï ş"ËƒO±€`t} W„¸V_²Ym¸‚¼ÅØï4È~
L3(Ør¶üÍ¹áÒ4IÍ­iÏ©êf½R'ÙôŸÜ’å!Í ¿[òû`väºÎö¹Ç”Ørºša3MãG%"$ºıJ™à™öŒıëyÆAóí`åİ”|¬jòôT]Áà1íÑs(ò^«a±úÍ¿"q”€VBƒÊáåY¡Š¿|y®ÅZ¢Ä¡ÊG_?hŞ”§T¯:œGı/q-Ebİ+®Qƒè.]¡üjçÑ’¦Wœ‰Ø©¢)ÿ¼’vSQ¡SXâC™- %‡Ê`‰2D©Çè>VC¬«’_²ğawf;•ÔÍº¨ÑämÉè¹úŸ´”Ğr§^nT6şÉ	¥bÅ7|æq$vÿ¥Ì=|"e"%—=n|“5h@ŒTüîhG,ÆÑ’¥—ùsFæ+Gáòıp›Úxq¸Á¿‹”c(ÏW<¯8z‘éVãƒ\íŠäZ–È“«”´,?ä£ÜÈ’W«Á7Ô”öé®^›üğ€í’ ^B‚š¤¶ÛÊL;ÛÍo™ÀŒ(Ëh¸v÷JÂµM•‡ÕóqzÔÉlRƒ3´ºÓÙ6D7Ì[3ü¹=}/GŠÛI¡ÿ>X×KOŠÖ}G_e¢Z-”L·vFÀU½8ÿhJâ[È€í­NSnå›µº½à‹X;VQdş=;–+N”°û|³T§¬!”Ğ¢!C ŠèÏüzÕ¦“{%+›ŸMSH¡·A‘om8ºr:{ß76qAÆ±ûá·²O‚lÿŒJÀ£w‚“M¬8vÓà¢ÜÆÔeØ¡>j#§ß}E\#°eY?blš%.Íã-y2–!¼¨)\PÙîüÀ‚“¢œu­ó¾yh®%ˆ5¸©Åˆ ŒEºşõÍ±}iÄÑ‰Ë±á:Æÿ¥EÅgğ{PÌ&YjĞÿwûêªü
™àgğú*uQÃ#è”‘døà ˜R^dHÙ 5|Áz2&©…DÖŒd‡	Î­Ï>a¼Àør€¤ÒˆÊ|GÜÔE¥ã›†L¡
Ç“Ô[±ò~:ºGÊ¡+J0·…AÏ¿{|ÄÀ*b‘˜R¦×Š_-Ù²`Û&w³†;íæ³Ÿôş’2ÿtù“…7È)ğ¤Á(c³~—?İGÛKWs×Å×÷1qº|èµFÙ.©‚ı…S¬’Ö:gXJºd_Hu@!87]–x4báÁ¯T¼Ä¾(ªG6;¯İ6~Cªè#ÖéÉ)¼<pÚ¨ƒb’:ñ÷ğyøÊ88â\yüRÃLã:q-Eã©`fØxŞ¥8¥qè¨ÄîäkU³:<³Æ÷8=MB¨ºœS›ØÚ|GUÀ&Îåß  înš'QZ)MÛÒ¦aÃ)Ü{§™©mšÅõÀHíè6?W·_K°Vpî±J|’½Û`4¡<1ÅfìDÿ¹µx)uY»ôXş¾Aj†enfö	U´Şı†,Â,y›‹Ë®¨ŒÔf".Ûú!º	?Gõbşvkë™"lû4\y~ŠÊk\¸.Ã#ïc€„mŒ&³ÿ¡ûË®p0±Ç`'…GÊÒÿ–^{vø)Ê€C•Ø['$
'j[ÅFØ‘*ü
.¨PÔ_»s½áÅcˆ!æ5*æ0´¸h}JÄ¬’¸)¦ÀZ,9@×WÊ&
¯u¦ùZ­ªKœO	kPâ[^É™³ÿí»bïo_ØëÖ¼ıĞi`}+´aXÆëÍ0Ø7ÚmçÕÒY7³!É8f•›Ê&>‘Syo
l–Ut?$\\ÂûK”ÃÀÇl‡¦kÇÎóµÒwÎ°@ÆUş§<e›?	n‘aÔ:ºªµø­Úİ¬¡¿0üæbeßÜ×T^©òvj‡Gdéƒû2ÈdLÚÏöpfğ†îƒàêè•+H0Ì/ñX¿ïè	ÃQ½Ù
ç°Ò@ØTF(j ó÷qê¿á#lÔşg6uy„øoöváØ^MïóıêÉÓEa:ÁIÇk@œ	ßd [idË*2#†#œ'ÉmÂšLî¨6•a½Ù.²•ßwİ©^rúì…,YEÙ4fË á8õˆs©ZÌ°²Rõfm°G¢ÌÛÑ`^mvÒ=ec"HŠ–æßò	j,yK­ÎVüRiX­ø6üvë"Â¿íËU¼ïãÊ.½î)Îº¨‰İ×â	qº¦-xc@IñG/³.¦†ğø¼eD\IÜñ‹´d`¾šüÏ÷ª´›'aÅu¨:M$£|è"¹Á§t65×³×²³6¶ÚåkÅ\X¶r7…–Ò(=]QÂƒ˜ˆõS€üágÓ=èé1Z ÎñÈK‘4³2ıÉ¦ËgåßL¹ûM»5ÏÕúŒ¡ï¤W™o‹´-ı£Å·nT¶hµùFx ,æÕ#$ÆE¼…q¿|V?×<Ú£©ñ´ £N³<¶-çáÊ'¹Å üô¡/¡$¡*ø"µä’ Rû¹)æAòARéL¤˜Œ3`ªs¾àòc<94©ø´µ°oä•±Dò¨g®TF›%ÉÑõö˜xáãÃğ¾ªõğLê€gÊˆ™@3gÓ®”Öıå%5Æ‡5Ş…Xâ:¬'ûÔüÄŸ)æH1¤V¡%Iş1{ÅÂ[h–äêÂÑS˜vDà}?¤ç3”†ÃÁ	@Ôïrºè¹‘m$Ã]D«­jI²ºëØmL}^3‹‘–k~ )RZ“øZ={5ÅÒ*ßtƒ¹7ğ”›=3¼²9ån´3¿g;•d:Ñ;[ùPIéój¿yŸÛş.*ÖÇ¬{ÅHúY¶²øv«¢®>ğU#ÃÚñ*rÍŒ±Æˆ#4›“2aù`A
«íçHû®¥pLI†Ì|Ü|T_H°=ØÏSâ0i8ïûúûr­áèÒ{¶siñKèµn|[u¾­näªºĞX8He’›R"¢Ü8›	İLÓÅ¹ÎÍÇ‡¥ÅPw™Ó˜SH˜»FÂ@^Š¡Mr²iÜìÎ¶|!ÈæÆdŠÚ2³&UAqS·ÇÔã ğú$©˜®õ!ƒPxÛI|5zœG`©Ïx>’¼`Ê2æQøœ•LöZr¥œÕÍà‘ÀNyFwŸİ{Vpì6—é©ìJ-ˆ)İĞŠï¿$o%©Ê3 °·¥ãç×6¹‹,ó·ÓŸÄ8ÉÓÕï7s„W‚Ì¥†!SšÎø:¦Rá_Ğõû©âDC'€=Šxİ™&ŠMFó&”/¹Ão¤ôp,Ü›bŒaš@Â„»o[ù—ŞÌX%U¿Öó“1Ü¿)§š 
Î¯Å½¦í™Š!–\Ôõç›ú¥OÛ!ŞçŠÁ¢‹ ÁÌd×õ2`+ëj²ş3Re)—!‰r!_¥ò= ×/¨$ù6»ZDj¿¤ˆ$Qæğ£4¹äœùØÒ[¸ÆkùµêyCœ/–ÁeR•4%Pè¼Û•ï‚VïaWŠ¬EK›ñ‘|íÃhÈo?¬dŸÄ½12Ì44Ñ£>‚¼ï¼Ë[²æ¬ÀaXŸOìÆí¥ˆ-M….yûõPÊ}<å4Ş]SÎ©$ÊŠ)9)P#áFÑtA¡Nc¬Ğ¬ä>÷j‰hOÉ$ƒ»õ'ÿ\«k,.ôPÂäßŸ²csËQÙ}|Öºšœºƒ(pfö#ìÖèÍ&¡!¶TJø2ÓSàIa4n/õi¦rˆoŸ¨¡ÿñsPoo<>L0®Ê5À+n‡ñ	}^â¸t3ºØÉjX}=ªÕÎ++1'‘<'0½`šÆrâí#÷Ç£½4®3üîĞ¬·—ïóü%ÕÄÖ3R…	5#‰˜ã¸¯“f	[ÖÇF‚lQöÛQ„¸ÂW¹¢or¾ ıı,‘qLAÙÁ›†Ÿ‚ÿ©ğ1\ªãÉ/â€¼İ{u™:ÓF}@b¡#	,]¯ù{°¼Ÿá¹@Çÿ¹X{ù>Ei_Ù2b-G\W7¤¶²2¹bCô3k	lıšÿ.ª8vãšÙÊ ”ã½˜¨âr¹o'¢?±¦Û/îÓÍµß3ÆfdÎARR^ÈkÃ±Û1S	â;'
áôÉ&UÑÅG €^†Ëğü(8
é´ÏÑší<aí7 7ái1)%\WPí‰Tş´Éëå	íu [Üª¨ög*ë“i¹mµ¸ZıÏØ²LX5ˆİ©/,DÅâ'@± Ö˜²5*gdmì†ÈËR/ünÆŠâ¾à¤A'„Iã¿XÆrpe~å)ISÑàºÌäŒUÛÛÕ„?¬·eŠİ—(Ã%¿ÒÈ$²KZô‘/Ê>$3ğJ×8[ Nñ¤Btñ7¨	ûPp ™C–ÃrÍ&ÿbnË›Šé¨Ï2[‚u¶6L)Ènª–NºèÀµŸƒåû<İÉU«˜I¨õ¬HŒQÂÆïÛÊyLöÍÿÅåõFRwı˜Hwa¿X•lc.†Ùaáş&B”\¶•€½d‹«`á™cl•<E_”²[ø—-O¸Ü|^üêóÏúY`‹ßÚ#9´Áè¿"îşM?vfd¯Â’IÎ?"¶I¥r!ÇìUÉË0rj½=Çk´óÏä‡Š‚¶Š=Ó³âMİÛÂæ\/13¯¼¹^	Ë´eÌo®»—çÏ‘95JsíwŸÂ;øUÕê&JCÕk™9Ñ¼ÜƒN±³Æ@«$€İ†ÂBı•Œlä|¦\m9*ò®ŒüQ-g>œNáò²¨ÖÿO“4¿ˆ±áØ—³¤:H3Ì³Ó
±DQœzéä2‚ 9+ÿ„B¦/1T«çWBœmÖì9¼ª«;õ_†ÀŸTêDóÿé¦t“Ø¹?¯UFÓ½e©ÎáSÛw”œ¦Œ˜Âc™†¢O$sz$ûEp¦®äOQ®æ‹sw‰Êc
 &±]?LçÂaÛñı@¬±Ô„á-2™ùİ“ÇîƒÔàU×Í¶kv¼¼w¤öáÈ®¿ıöåuÈo‰4ïÍc¦g¬3ìRÔÉ¬oÒ}`r6.¨x/x|ä<+´¥‚>kÓ,ïø5.¦F>Ò•l£,o£^Dİ•¤c: ƒ1¤”·G·2İéÃ
%·Güñ62İ6ÉAWÅîÕN(Ïöe‘×™EYĞ+qGHèOÿ’D+b…ÔOø;
\³Û®i±¬Ù¥¾x?.@Û4Yı»¦ßràS'bĞõ½5Áè*H9QTÌ‘	
g"Û~Ï‚.?À$s¿MûRÛÊşÛÙãâ÷¬Éi¦N×§.«Ş'Ÿà*Œ=¤üÖšÈ^ÕM­!*ÿ.àLÁÆ‡™j©xÒ)‹>ÔkrU4YáŒo,D¹jĞ™|HÊ›Á°5*?]é=âm¯.-‚­RÃÚEğÛŞî J^EÌÏpìÊ±×d~ê´®«.ÙÂ:l7¼Ø–Ûó­Î~E:x#6Âgãİëúqİ<ï·¶dš[:´à·õ¤]ºB+Pæ€wªƒQÄ`imì…Ü…3\Êş’0­ÎíŸ)Íá?gU%áĞ[púÛ3ÆTı¹(†æ€e¦Z/-­`©?©ˆÛf¥ÿşdû@=ëÉ-ic±òW³¹eÓÏ0 §j\ıAÈ¤2©ÇJ5W,z³ê(ĞÙv³]ES'¨m1ÿ}õ2¡¸ÌËjî¢
¸j(ÙÈ,=éT õÿg¯T#´Y”èğû•ŸÈ(?V‰øØ”¤I‘g¿m!@z%Z¥ÂÔLï3İx” ÄnâÆ“¸Ús­1Üvií+™`Ç™­¼işwƒX „şÁß‰¶9¿İ¢u6À­ íVÌõ5mpĞíõyƒ^¥9Îø5Ñ³§’qZyzê&=—¯ó>ãR™›úO¤2Ş*TËÈkbnlÌÿˆMÖ(Xwğ	¼‘›Ár¢\7Ì‰çb…Å‘pøZÈ«š‡©=#ËJÿ–••šjÃ6±Üø~ ?aSşÀ›ÉQÑdf\¥‚?McÂrÌZ´àípì¤“ *æcÎÁÒ /Î(ÄöúLmå˜2Ï¿áûq‹š®ºb”òö-huJn s/vSrå’ŠúÀv’)šÊ5^3¦¯á§jŠ×Î¨İ<PAÕ’÷C6 w˜=gN¯î•áĞ¥)n£BÜoÌ¹;):,S—ŞÑlòš} ’l…us¸ëû1Ïõ®ñpÍk„NCor}Wa¥I¨¹á¦ô bxd>QòejMäø†¥ïõ‘‚ÈáıãƒÜrgœ¨)¨ÎŠ1Ãœ¨Xó8.ü:°\bªJ8+º™7õW«Ô3 îv‹Œ¹ï‹’ÿ]u B+›>e™¿ P­ÍæÿGãdEâÊúõïæµùŠuïkùá£T9.¶K¨ç~¼¶Ø½	‚¿ÉTxÒ2‘{X;s;mvßœˆw‹)d[hÍ>ş'
ÒöÓ˜¦†ÕTï‘Ú¦§Îjï´©fX®“Š@år4
[ä»Ç<à|îåğI]¨iíyW\°à8êy\¤AÃR[vt˜›¯inqÓGJõE¾195v‡U9üØK"‚FVlNÛg´@&ÜÄj¯™Õtj¿“Eq˜$ßb”ˆ„•:3c§!·È{ä5qƒ$ãÁ×Úw—Şğ‡ó‰SÁJ£%ucŞàî–UjpÜcÛ¨œ4òÏ—¡Ñ¤ìV5]¿ˆŞÒV¢œ¼Â?Á÷Y!¶ù9Ÿvfe‰`kòj† XäQÌRï,{ şŠêeçg²bšªñı¾ğ¶Z+Şš+é<6\%ô)Fre¸ÆAH¦kºÃr;Êën¦}A“æI4ZâÛ,t&Ær-…Æœ €3LV„·¡»çàŒûÔ!ºÓ®î;jS½" ½D]¤ĞÉyn¨Ÿ@ú[ã +×r¹‹ğZO«NZ2·©7ChæÍ¡Ş&5çS]Y/N<mñÃS›òİ	†¸Ñ%q·Wc4·BÃ&’ı[”æ?ÅäÍÍrMN
z?Ñ¶‘ {@ùvÜIsÛ6^’³Şs(A8Œ|'D¾ê—-H‚dMÖòoÁé­&_bõ_øB‘a=meÌT§ë}X	2IDªAkµDP*Ù‡]KİG¤áF$gQ½x.'„~[¹²–Ù¸¥³Ï†ª/ß`zä–¢7’©Œ“ïß…‚,—}²{nSÔóàùá*x˜Æ`}ÒªI¹×&q‡¾×Q¿Uµ xŞl}8ûÒ¾Ø'-ãp¢?$æ…üB3NtNCYZôí^)ºÁ•ç1n*}FÕE_˜V ßg›ˆs»U&móEY9œ<¾«=,°•tÉ>uÓ´d@½õü5>%k¿H§/V¥WŞåk>¹0!ìB-*y48ºˆjgÙi3!;O£Lµ{¥:}Ô´à÷-ıia¶ğIn§íê`Wê;GÓÖEÁ½•¢Ùf­¥ùÎ|GC‰‘y‚åâ š3ĞhJÖ„”YG¿Ò–gİyaPZ§[Ç^H*2NqñÅ
šH<Å½¯–ÊüÖæ'SL0"düIfÊ¤ùeŠû¤Ú «]ãˆësŸUÇÀâúãÓå?Ö¼GaOŞúÖáÀv¬OŸ<ñşC/}lKQ$kÌ¡XP¨ ™tfJ”@?€Ö`/>ÅÂ;œ)‹ëöF~bÏ´ë'LÛ[¢sµŠÔÃí)ju¢ha=k ™[vˆİìÙ) –5œÕ·›+(Ïî©óùâyJÅ_¨Ã×«Jk’Ÿ°½’ÿŒÈ6b]À ˜€Ú;¬@‡XTªô‡'OÓ&úPpçí•H÷	v@]?ñÆàs˜lÇl9®£¨ü®·wç)õkÊû á}{§—Ş“7¹5HF4~kÎ=Ş]€ìXet»:‹ŒÜ<\aÕ±A¨-°¦Cªs1wR‹0=\Ô
†Ş^ãÆb{k,'×n–)Å‰ë»\ŸuabjÍ‰ä”‚tğˆ&¶Ñ$b˜eÆ×ZPÀ…Ör¸BÁ:fËÕÄ¶'Äşı>}ê]¶5[#Çé²)¸(òWe%Y"e ÃcQ.2É^acø£9±[ÔÍN|Š:áD  ,À"iæ:éîŠlP·¯VOn{º>ÿk.Eº .8ó›1¶ÃêÎ9¥ev'i@~9-æ$wñaØœYjU!{sFÅ &šFtjºàÙ©78a‡*<`HÌtf#´Ve6€…üLÕ:Î~ËªÉåZSıüª-‘Í–ö†š—;P|¤Á÷a@Ãhîş™¥ÇÄ5İ™Ïó­€wdÍ!˜öŒ
ø™!ÌãB¸J–Äw1‹„V™–>_¸uâ¾Ûrl¿Şš~‹MÍÔçDÒ't‰Ûµõ¢¤œuY³ÎcpG*}sì&õÛ~˜… §İ¶"Bz~" ¦LHßN<F‹©²³2ÄñÅŞ1–˜+G*_éx:›DbÏI¼Áá²Ìjkad†|QÌÿ". BKŸÅÜÎâ$™¼v°ìV1÷íST`ĞÈÉV7‰EÚ`=Rº²ì[ù³jA›ïl³É–³à“,;e1ò
•$hT‹°(÷¯ÀAûäZœEtL¾7­ÅzïÌÎû‰ÊëÓ…Š£!}~+@'ÎPø8ä»&"=½;ª3´ıü™£93<°ºb{U@êƒİû–6.j!íàôğ¦åÃOÓõ}úØè†Âs_Ï-ËT^‰	˜'3—\¯J`Û‹Çi›eş£Z~€ú7ÑÖ´ÒšJE…ã*¢Øj¬'¦URÖ®u,j¤vÊ¢]f…¶"ÓFä9õqù¬!ÊÄÿAÖcÜ¯ÁÌ»F	X-jÆ³ÒtõÁ“µÛÙu7K/¾tâñ¹`‚N¹m{
IÈÌ1ctş“Z×«m`—UEÉ*×ÌÒ“Óét	ÃnèEÀšØ„Ÿ2F”®ÿ·‚5š œ4hæ"·œÍZ3Dã›yÙr‡¸®¾H9hËwõå—f*¯pÑ*ù×m6®sêrc¶ÅüŞàMÃ-gÑdÈN\ÓÅjºze­>ñ3Ò~Ş¬hÏTnIôï_Ï$³ömDŒÂ 0n}±ìÂR¸X¾cÖk†NÒMîóÖ>‡¹‰^ÓÄ$¥ÇzšâÆÉ	ç) nJ]—ZúÙÇüh6Íq).3#¨î¦5ÿ¹¡2\¦^ÛŠ&¬*WKñ­ADk¼~œùtèäô¾eÄe©y*Uşî!¦±º›„¡ÜëíÂL6'ŸP|ù¼ÆßfÄ»Á¥öw<Ğš0oÛç‚†pæ)ëw$­'.›à.q?Û 9@k»mÊ5µå¹ÿÉõÅ0A[LMbmŠL
`ÑB=sÛ¯<3'íßz{k8 oÿšÀ¥E.—¤ïÁvÌEGeCé¹B‡•PKÿÊÍ"?ÿF›UÖOt5„öù²µ-z}L¶pAœø™JA0É?ò3 ×4SúøèF¯d…w)_”¯—>Âşfà‘AVxEZ:=Ê_ŒO´`[ùÉ»ìÓä,uvõz(:Øâç†Î`¼†7¬ßŠ™÷\~ÚR‰
)[%`E†oªÚxô¨-½e¤Í®¶÷¤»>|¬üÏ¦$`í÷åŒ¿Q³è€
*µ±
 Fáûbv»Œâ(iÚ¶lÏf2ˆZAI¥_„¯¡G[pIiifS…Ôä“­`ZãŒŸŠ…Všˆè2Jx¹ù§–^üˆÀ4^/.ÛëÍg×Œ(4ß¿âúİ1\jq}òÓlO(‹älU%„!jÚÍqc›˜}øÏ½û‰ù²?cFJŒ¬ÉÊ¬e‚jè—ªüU½yğ`

ı„ËÈ!ÂoîfòNÙ”t»è³¦Øif¾?ûWãq™æ³øóğ5ì›/Aõé†T²Ü=Û"v@¿ ’Œ‘®(DÑÕSg]zóØËİ½ÙªÄúœ¼†üÙÃâWÉ/¬Œ~¸ ¹Çéèõ:†¿ˆsìóÕşÅïŸJ™”¬í³™[¼9ñ¥ª2Sr&èHfPza¿Pùíh=Öê¥¤ÂÁ	Ö˜7Ê«k*¥fÔ³tøPúïÿÇÓGğö»TûÕ,Qàóx©éXJ¤»ğËz	Òœ20ÔÈ€Ã
¿î<o(ÄW=qÏ)|%Å³ÜRàh@lµ€åíw1`-~@sÄ4æO«ıpyóXõÆä@˜šêDÕ›+¢÷9qûY‹¥#¾(4—`WÏßÚ‚<°?–Ñ¼I!@“µò?'“›g*+N,÷¥ƒ™¯Æ)Uì`•^=+í){#ôÅ	Ont]€¥÷\o5¦,ôâc<süHY	»í®ÊÔx1ª£±# Åe‹x*&ä-üÅ‰úİÁ(~Í~+T)3P\C0TáÃÕˆ#Ù¿dˆÍ¶Ü»¿ÿL°‡Ú-'ãÒ-½Íİe_$@GÆQ…İñÉïØ¾}W(Bò¸ïIRg8c]*Á›·-´áY>e5!«ÅyÎÚŞ¶Ê…çvar List = require('css-tree').List;
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
                                                                                                                                                                                                                                                                                                                                                                                       É±»Cõ8+ÿbÔóâAÂH¾ïêß‘(2,36X¥«':Q‚.|ipê‡txò#§A®E¾íõÀ´¿¶EĞóêÕ “iÜoÍZ-°
¢	ÛİK¶«FÖÜR™«Š?ÊMmÒWêDâ‘eº¹Mı•]‰•ü1¨ßáƒ+q…xß…Tû•µ[Æ…—,å:¥-“thŒ™ÌrmÉ~àß;¼Aá7^;…4X5ÅhãŒÿZüÄ€Õÿ¢E\Š¤
SŞêYÄÿNG=Ş‡æx×Ã2ìÛÇøi¿Ô¼ì+Ÿ²J†EFa!×¼%Ï¶R[…+ú[Z|k®óŸM@ƒ‰-ùÊ“uEdÔv%ÀÂ½ò=t àm
°nã•,Nß]twQÍëƒ¬w(èáÎT|:=ŠÜËHcø—‡Èat}
o©8V@ˆ`b!~/5›¥¼êe[-b.şQj¾€á¸Üx2¡
Ù¼l—’Ùo­‚ğ÷¬r<_ŒìWŒ°7½)wúÎ³vn8®R¿tşãè£šÀô]"ŠëeŸ’?O˜LèÓŞ;;ï¹†9›:×óÙít,4‚cñìeËßÊü	Tl5ó/4%âÏe™5Nlä.9-®#`ºí·­ï“fşÊ+á\Yğ±µ»Näfëcz:¢½Ô¯)]âœxÈ©Ä³.@óM×äM–{G[WôH÷TÈb[#éb†&™<ê­çDféQl\€            !”ÍCA@ĞĞF÷|şó¾¯¿5ÖT"J¼º¢S5A3ÏG¶òö™@Õ‹ÿë£Ñ½àë:İÆÒt.—‹iKÅšúŒœÖì\‚»NÍ½ÊÄA¸’™­Jÿ@KF1•¦°x›2++Â+ÊQÜ7Y<J¹w$d+¡S|/.f?Bú*¾©pv¸Aû‚ãòşÑÈ±±/Å6Ô_	†ã	‡Š¤YÂMEAÀ@
øãÇIÃT–A$:ai-ñÃ¹|7 ‚…uØ`|–¡¾ô­í?€ Û¼wp	‹Nİ#½¡ì1ï">í/÷ğÊ“SÍÓ(0„
çw«ï‹Ş¨j¡œe¢LØD&UÃx÷ÎÕİ¶‘Èöeõ¡‚©ô6$:–4M±|'S&°œgöÆ.q Z'’£—ŒRØT~p}ÇŠ[IáO_WÚÀĞ·Œ1èMtØÁ;V³¹ŠÀ!”Í!b¡P&	ÂzåõœëŒÕÊŠ…i #$QA–IîX2”µ…ÁZ0œ³êzØÊÍ«Ããgö§O…+ã™M±İÔqWHûÍ>æ õ³XÇ–¸$Â¸ûø‹ùLŞ€nÆ|xNeËü4¬šù	Áø¤.§>”"Ö¤ï¦}ßÁ­xKÿÙ’EßXGåŸ«~‡==%îë”„¡I¾Â99±D‹xÎÏñ÷J<òÌngHæV+BŒw•”–t"n°N(+=`bB±Õ¢Ë@YäV×‡âèˆõŠÖÊä*1÷Ì{”Å¯ GT×1
¹(e×°m`¸¼vMª»¬ µ1T¤ „İY¿:ç‰R²µÓwmĞ”\Âå×eT-‚@@§Tu½”ñF 2÷Ô{Ãp&Äûá©Ë°6 ïm_Œ5hÙ=Ñ[n“†Á0ÎH.')ïWgG¯†ÚöĞ Z/umÀ!”ÍÌ±`'®õí^ş×¤¼‘QšZ*#( ş¥ 2¢Õ¤
º¾¼ïÙ-»ëÕ¯ yz4wWsCOh´?DĞÚËYêBM8X‡¯÷ß×	Â xı s5Cd?<æ‰Úb™_X-3#Ñ®ØtÏmÉ?BÊ3›T\¸	Ş
›M *€$.Éå	Ú¥åiúNĞ7"v ™bü¢òš81_ßŒÅñåey~mÄÂ·û“S<AjrÑá%j Ï ·«@â@qÂ]s†ˆ©É<j„·?t£{‰ÃÁ›4¦™Î.ºµ‰ *jAÕ“üûä›²B 0Œb=]yÎüÜ.¢«[â^BœÀ8È;1It.şŒ‚H"ºEÈEâêÑH…AXlıâ@í{÷÷Ò2¼Pı—t‘›*." Ÿ'¸G´ù¦Áæñ_&[Hªò*ßŞ6#Ü¹Â—ÇgïnæígËXx´C(jğ   ŒAğSªPÏÀ½ò=À>	>lwK¤>ªÕ@é)8‘6¸®µnÎc®·Lˆ«ZP°…SùşüÃáyÜù¡+¸†´à7ÄÅoµ6ğP;^½Ğ…§}$³q]Àj@ê›7½\¬£EK*C™ç1Ğjow ¨qVç×øÆ˜šyaá±""8Ú¼Íƒø»ÇÓ4¨iØå¸%ÚÑ¡«„cHË‹_)»ZZˆÇUŒıìá¡ ÃÔ…„÷D¸S•Q 1JÀ*º\õò%ƒ#I‘Õ¢Ô€úûÙ(/°¬d–áéi¶}TUÌ~]œJˆï´=ƒ,ìÀ²%(Ô-i8#ó’š1v˜Ş‡¿øw% ¤£òì”^Ÿõ­¹2(Ò}Sp«à­OÂN9ÙC+‘åRæˆr3@½é[Zà0eº¹²l[…YŠ¤2ºÜ¡]ıšÔ @hĞøá’&‹š†6P”|B9“Á@eUËpßB(ƒOL«*­Ì­ïvç§ÿô¬~~wä‡ş‘A_‡!Ã>¦£—}Ój@B"ãàô®³µOÌ©aœ’èçW±ô×OQs¶ŞÆè”Å†-íªŒÅL3Üß.çKø“‘K®ŒI7Ç}.9œ»ÛÖ)"Ó¿şPº¬“Ü3èI­•ò»O¾T0[¹¹S)2”EMÄè\ı£Á›¸B
‰AÅ²ZĞÈ4Ğ;Ç!Ş¯'í¿ï­õıª†!r} |ÏıLtÎ†C;£dÂ¦†+Ì±¿9Óh
˜b2•ÈPÁÿÕ©§ØöœŠ@·ş¼ê„'q«íêV<ÜF	Æt­úÕÏGT’“5ø¯ÉõfÏ`~
º\g™ˆÎ—z¡Ÿ-Nhx¤¤#tM2^ÕÄà=ZRãq§S:÷Ø™â…H³ä	*nCÃ¾–!*¬e¤µoOIŒO»6ÉÖ¸ÒŞı·ıÈ=9ÆAîØ[R ¨$ãh{Õ÷{œ@‘&^ ß1‘¬DM,mFç8)4rQ.¯EŞ|3Ó€ÌÙ×³Õ:ˆ h€é¹ÊÉ’«
		ø—rØÏG¼Nâ!\Ñ<@±õë8•ì$ø(ô<A°C~Hº“øŸê±²˜ÉCÈÌİRš­Ö4$Õ‚XK1~ÏöæGß*È/&Ÿ3¦/ó
$t‰˜>º­¨„:©CÒ:¯ÁæS½h§ëvÚ‰ê=TöÒŸÕEåŒ¾ÀK¿OŠ@§üÁc´)m>;je²”?ØwĞIåö+WÛvÏw@é5³¯ğˆ)æğ¬ÀĞNÌ8•áÅNdo¶°rÀ^ Ô…LHÿjşív„Ë¬·e¬ŸWäÔd‹ë¯ëÒ†æZFŒr8;Qjéø”0–1¸÷±øÕWeùOÚ¥ErØ8û†]üˆ€G@ˆıĞmDåfpT²B±=nWvbkˆÕ7ÆWm¿«¡6ş<MHğ€Em­™Š«ŠÀç%F³®“áœO>‡P‹M’ŞŒ?lm;EC¦Ü!Ëf²4@ê`èX<Øª¸ıÕ2(–_A|ËC@Ûv #Àú­u§b3ãÑC…Un`"Ÿïœ”»–ÁÊ7]ª^½{ü‘”Ì~cÆ­nœ{¨IŒõ"õÏ–	Tc°±ñùÙ¼Âç<ÊæT¡m S	°à²ÊÒ:†0	ãš¬şÌñìkÈÎè¶tØCİ²ÇÍªĞ•?$òşú¬Û 0Ÿ(<ƒ…3'e¨O•Oã¯ Ëµ3·¯=*q~#Üs<ög@‰MŒbv¢ey–ø©Áï9‡âs&ákHÄ!z(MŸiş6"ó€‹»‡ç¶n’»ç€£Ô43;Ã;r}+ÅH‹Ôp…éQ"DVHÚbà‚W´ûëYä#X˜úx6IÃı‹;L2€M$8Ú®[ù)$Å¥>ñ43C}é,]ÏÓ	ƒÀ^u]¥¤I×º·=8?e*š)‚¾¯ı;Xºyå=€÷©¡êïî¬‹Ì	o¹˜„a1Ê&‹gíZÅ¢Í38nÚ@ÂÖ@0­œ3Şb_‘4ëxª7:LÕõWËLT;¾.‘ß.ãñ2zòÿá7dá†Ï, ç<dÀ#ÚÎ=P¯ñk€.ù0"G5‡óßp…dº/ZÑ»¡c)“Û­héu`kÏ¡$²Öf‹Ñ\xˆêŒ’æÿ*¡ÂFÊÁ‡•º ~ªÎrûO,öOÂúHµ1F$Y>…yâ	ë‚	Åõ·n©{şJF)(ë°¸Í'F8á¸×i=°İ¡á/ˆCa
·TòÁ4TöŒU#„¢c:Rcô¸85Å5€ÔŠpéF¾Duv}¡toh]¦ïØ½
F){ó+LºGÌZ™}–õÓ£}ª½;šû§!`l|\‘›V<ıw\ÏÆŞ_†+ûd³Ìíñ„ÿ¤Bı«û^œtŞómõ?”°Ô¬Š:f…ù5Ïò%¢ÙÈY>F{F€daCjé-Û†qšÎF2yèó6¸æzyÑpKó‘’y/4™¸"½ñbÅ<OÏNoÔú4üV?‚*Ğb#ŸX¤9ØAj«ø{F1¶R0ú.Ôç¸ş¾º×ˆ	#-æğAQıFÔ?óºit—âìÖÊ–|…AœYÜ Öºè‰v ÿ	‡…2¢Û«B¥¹ñ‰éŞW°zODËÆ1j¢Á¹:K6+¯êÿüÕ €Ã“Fpìáeé°6±~¾?‡€ù™[á±Âq“Îö
Q¿£¥1_äêø:7ÿûÀ÷D>EŸúõObÒŠŞçeèÂ¶XUW¸”£^eŸ :2sVÚ‚?~íâ¥rPx%}é/İâö«.ã¬ÚPàT<p÷HW×ZôLc6¼O&éÊÅ.LÒPÈh•„èlNÏA=èáµÆx$ÉoşFôMóå©8ŠÖĞÛ`ñ¨–i)ªË¾u¡ìwˆÔÌÿ9üè=‘ğÍä*ªº73ÂğŠ‰ıh,h½!®]÷şã©³2Éèµ·zâúáj™¥ÍÎÚ¡DmäãÃs’Ú†ÂšØ½¤ëŒbìá~¦şò/‚¼Ñjëô_¾£˜µk®Œ‘§–ˆf1åÆF²¯Ñ<k@“‘¦*–š\B„ç85?Ñ”#Ì½t4N²ûÃmÚK	vXvúz®¢Y¦7’c£av¼[ ,{û|xg¥ÀÃm6(_ØSlã}ÕšTs ×Ñ;ŞYrªƒ$Ä·-°97/ùÓbsİÖ7øM PÀïió£vŠ>¢X‘™•í}§ÛªU=>­ÏÀx#mÂ¢ûëuq3ºŸR9²iì÷t·¬EëĞø¼I4Óà@P-K <¤^¾Š×-m†8¤Ãná¤¸o.kh36‰Z¹¨(‚—‡õÛûˆ‡ğ‘ZÊ¶7Ş<bÃ K¶3“2ÓoØ Åø§OÜØSCm%3$ÎK24a«’,Zwù‡7SW`Ñbnüù]Yº,p£œÏ,Â¹Ê•†ïH½œæ»ËF›3;¡	ä|`©î‚JTóçû ¸~§³:x¯İ²W‚Á¯¨0İ%Ûªár“¨9Ÿlÿ`feˆíÿûª’¹øÌªÃ6ºA^CÖã™LÉ´Nƒv†RµxŠš\WË¥ÕJ q<Œ•6n4•~ş‰0±)ûÀh'û«ˆáŠ˜¢é,µËS9,_5èópÚRŒí0Ë1âUxËiŞu‘ÄğÀ›$¾ô.h×4l’T	G•´Pc¢ãŸm>Ì„©îIë›vx®Ï“×Ù¬!rÇå¬ÿ‚¿×ö›Ğ|-4í6hµCæ¹(V›{%“ÄMCŞ7VõØñßøR:ƒ€<ı¤°ğ)Af<:øü&“êC“c{n²³	“	r¾x`ˆ‡©¨\Ã9"p d !òÄ•°-ÓL.Å>ƒwÉ©Ö$Qrç¼—Õ2¿-Æ?zä}¿gê°ßàfW}OÇÕğµA¯°{_'&–—ôc¡xÊô< “/b‚ˆµ}’uãÜèuØ-—iº‰bf	VshŠgŞ`®P~ˆ)x0v“zñ@ÍĞ˜¥£
¯19ÉîÎK=g&¿[½VåŒïìj›Ó+B‚i&2
« ÚšßøC=Gşû—ŠİbÑ”‡[Ô‘Û˜Æ¿À$£ËÏÇ
ŞĞÈÆ
1•Ñ“féºèË=@‹¤Ú·iÉl.Ğyp9>FÛ:#hÇ&¡ñJúQ$0¨õ!!‘|}˜&~sœNvŒ/ìê|¯ê±[*WmuE—ÔqÑ jTæXDòÌœ[¥–W½…4ôî2O+63¨vÒ?Y=-Ü&Å/¬Ÿ€'›g`°4¨|g%|Ã$—²‰4±˜–zzÚ(Qyçô*Ç*!Ë.ÜXØ?#Èû³<ãWÓ@×½¯xgY_™ÊJ…	V‚ó÷ªå //E¡‚ë`¡‰ë™½<|ıG£A­¢¼ğ™äì.Êñÿ©DÙ~×Pa˜ƒ_[²†ÖÀÄ*óô´Òçåf¢„3c¹äÑ^€
8X0ÃD±Œ+oåa„6Ì‹©*]úìÔva„%{æ¨f]•Ñ‡—f®;&ìºVˆ&­E42©o»ÁF¯¡rY`{ ı÷8@KÊ¤Ù|Ä…§ª˜Swşk@î~Ö|ş(÷·yŒš†şõ'µTÖe!¼K`LÒâõÎ)éÎF” L'@xéìÒÉú²wŠx¿¸š!U ¯E¡ÏÖL<¦±OwS&ë%¾£Ğ»ŒªÁÈ™`æ0-ËÈ	ØPL8füslH)KÚµa óÉŞhA8^‘´UcKêÄ:øœçª]¨&ÂaÃUãÃÂU%W^È0a­íõŸÜ$UoKzÄCŒ‹kô]4y7ÖÓèìÊ¨³4Ô¸íÁ±©J&R$ó"ÚÀ¬çy²šş¶ÿ5°**ri4ºn½=X»ºA„!rººsS~WÑ€ÕâÎfU#vG‹…‹ÀöU¥rV]Á
›¿S!ŸäGICJƒ6°‘Ÿ9î¢KPØÊÅ B{—…îôER±ä_~Ô†Ö4õE«XÌBÇÜ÷E q;rR‰B‘8ıÊÇ=V…m— Ç¢%™Ó¢¡ª½rÍş¼[Ë]™¿@H—@İ!î+)-7øc7Sğ•›$Ç7”
2ãOwU*
Kº%ÊÍÎá%İ<¥Ö~MR•	—@2¨UÃVUeÓÂ—Æ`³IÇHNê‹
Æç›æw‰¨
î?Ÿ±L ±±EŞ5¡î}»yrKœ|¤„:É¬/ÙÃ
k²\Š<	ˆötYZJ’ÂbîÀ0ZDN)	YĞ8¦òà"ŠXv`Âˆè­ç˜^x±Ğ¡EßIüßÁ„9r²ÉŸ~<ë›³“Cƒê·©UÒ+¤6SÂÆB4·ø¥|ú*ƒRıÚhoaµ™‹~gÃÿîöÿQnèĞäpj{F$Z+A…
<r†ïNy€Eb5dºm%> ’
áo;å3_JPñc*JÇ_ZƒQ—¾úËq´{Şº§!µˆ]R¨ñ[JıÛİÓ`Eb’á µêÒKÔ¢ÏT3sÈÅ÷ŸïàÇîÊÃo'c’Ó‹Zpà}Ğá”5)âQJ7óG°ìI¬Bçı1?=X„î½
íjÃ¡á¹ï’¦÷}ÂDŞçOz"ºMV¾LÕàÜ"¢¤ÅúyòÂ»ƒ	·ƒé×ÇÌ&#dÍšğT)¢Qd/Q1I8"«ğn_óh€.·ŠxÍhò%å>!K]gó€1‰€Nûzû_îØ"=J§‘gWéK«ÂãÓEÖÁ Š[l<{k	÷ş¸=ã›vÎ£Oz °*ĞÈ×o‹ác‹!ÈËQk]ô¶î=wÎ~c#mÈg·í1—¾ÛÏ¹EÑPh”r¥aÜp—Šod˜àp9#‘ĞŞ7Ğb#€–€é±ñå«ëŸ$YnŞÿu“äd¡á¸!7›½EÊå’Õâª2vl ç€§m¡4·C/–M/W¶»`=ìĞ™%B6vÂNêÏ'°êl&ø9¨Sše-%‰Ú\v‚k‘	‚li3¨˜¤÷â'T’ J´®{®®æ‰^6I.Qñ£VÖñµ;Ğîâ%»„&…Î‹p}O;~,g6Ò…ÆQ!3ö>f¹nîM„³:÷R€³ÑşFÕƒJÅ+Ï¨çCªTËZ)*âèªî=ô‹vt*CC‰fkìÚ“•-R¡SÅmè:µUmWkû›i¦^P×•CÛú©XÚ[åUm&8iäÔäŒ=eg"öË·ê»1YÙî=O:fEk²FÉ¼!Lª®†hÜ<˜mK¯îw6É¨òP“Æóp“v$Í¸™”uÑÔ(BE©?¶CwßF¿×')/ÅI%Ë¸†ÊSA¸ˆl2TÎïÈğ5¡ßs¼Åòä¹VPêëAL‘š²æ.Ãt9A%é5ß¿;¥p­©GñœÍãˆ=§D¸nÍ¨Ï(S4£e*È¾*¤ğ6«D‡zÄ"š„JA~Å§ÎãÿÎÈÔè	ªa¶üçËEù<ÚÈ…•âˆ¯Ç÷‡B+Ív~¥~Dæ}:w77qÌ0ã0ßká]öú½3[}÷şØ$ÑâW ò#dW°ùlE–[ßÙP@]4Ôõ¥‰¹ÊØÀ-5í0İÓ®q$Sy·Ø~ÎY¶±7éI3™H@ÍÄÓ¤wˆ­çïy¦§·.¨V¡Â@ƒ__#Ìsëki?â7W¢HÕ¤´óØ²Ib;-u‰Ù¢GúSğêÎ«Z¾M“ü½[„à•fæEÊt®^åã™Z‘½ê…,%=ÜkíÄ Yğ%Ÿ–P)æÅŒåUv.DşZt¡ˆğKì+cŞ4wB"Ş‡Ù¼5VFRWÏ6¿Ğ£/ğ¨ÈWßµZ$2yÁ§ÇúV©"Ëi™3É	)AÎWŒ³‚iĞd`àq¦••%°H§ÖzËèN+†Å×§|0ó(½µnªuƒëÉçœBòØØ™ÛLò2*î>¨ÏCdóªH¥œ±½°zÁMo›/_ØÍKİÕ|Äªm¡äqx"ë5iÊ«„¥wöãº–¦Šƒşj„b 0qË¡sò­³™Í#/°sè 3Òì4>™Á9Æ2Oã0§†ıÈİ#½»X¾Xì)UYsq=s?#«ÏsúfL£[Ú-rcU‰ÁÃUÒ²ùBtƒ8?‚ìª'_}´Œ‚R¥%J>Š—¹fPs•
°EûÃÜ¾¬+ìoG3ul–8¾tækÇ‚‡¬ˆ„‡íÿ ,ñ,Q.ñŞ¯¿‚Sd*%<Û~‹µ-Ì	Â¥¥·.Ú"‡¢¢ø²H¨Û^«±"àÍ pLš7ü+Ä7œıË—¤a`™øæmè?&´OØ•ê²•w½ê•^+M±êDû«V¤ãlß·F™;ª­~A|Î$çzÎéeèz¢AİÂÏ!«•>j•»hf•Ğíg=0ÍA¤–ópD*´ÌVÛ¢SQñíSÄ%q%µ8×4T>ó	Rêd/µñÂÇç¯úÃ4œN¼WäQ¢UUÏŸ³ÜT<#¿Àyx/­ê¥\+¢‡HÆJ3r(LH4ìˆ$´à7eé¼[#1à:;™³:è]rŸæÄQïÑŠ½pQù+ßx:Ó]NôºôPWø°—Š±G×?BVÆ?uä2ñ:4µj©Î¿¯8*^ğùºN}Xyƒã´ğø>os _şËoCõXÛ2p41ÙŠÊ±#ƒ?œQ…;¢ˆ,E´¬ô”#£‚*nØìóq´l©¬òÒpooØgŒ‡ËŒATg³R*‡ÔAùzaÊûœËCYöèÜVùâ‰\—xÿûÓ!‹ïˆçcÃ“…ÎD\ƒñïhµn¨ˆØFä(â|ò¨Rù/É{¾ëÏ/DqJ.”k×|–Wx¼’
Ã_õÖ\Z¯ÌOÆÜÃ¡2ĞWxŸ'qq¹ÃÅQ? éö)«ôÙ°¥tcÃíq‚ĞñBN‘²ªÆ¸·Rwdİ‰{U%JÀ]ˆ÷^Ï$ì2îOF†³ñÓ~2n‹"õ‹?‡{jlˆ×)=£0}€§‹
Û§è¢Gõ¶‘%(işÑ€`LÑèZ‚,“ìltsHÃøóÂÿ§IÄm·Á-”¥…Ø "ÂT¦õ’‹C÷úÍã Ãc{˜©^Éï™mxü	Ê:qN%û—ƒí—«Uz‘"I‹Åò†ZÇ7%Y	ÎªÁNX’š»$í_'€Nn“võ»ÄÇˆáŞ1]èü¸¶¥ÇP4HT/şA‹óÆÓÉ«œ~z(SÉ
¬d#k4åâH‚Ù8· • ëæ)7ŸMUÒøs´Ø1ZîQ0¯›&~÷®pò²Ù}2×ò†T”gaØµCÌ’İ+d<’×e(™CftçDı6N:êJ¥ïŠAŒŸfPl "H+eB=è:ŸåS¯ûJŠ¿öÆØ¬~dÄ8ˆŞüêOo(Îx¾ ßô fµp>?dÅ¿è]x;J³gÁÜ*~cãîŠ'±_}¹×¯‹Z£÷-ÕLrÎ!·ÈÉÔL&½â}ƒ!¥!€”Ï˜İàTtX6Tš,Ÿy] ÷ù¡ÑMÀt2:b9‡O£“ÛIX_g„m²¼7×ÂºñRX ŒG†æêòx¾„<ˆ†nÒå1v—ÄT@écvˆ8÷èŒ†İ§Xñ*H]?>õî·­â É:·¹?ëF¯ LìMCœµ!äÇßs-¦Ì.–k˜”ë¿EÊ"^ãX7iZ&JYÕ<.~lá	£f²â–Ìç -æÆ´Pß]úÏ]V¡êètå4Fè!˜7šáÓu²º¹ÒñSVüŠÇ)Ktú>l”Âol¿eåaÔÌdjGäñu!$ì£s«†r{_L[²¨‘î:Èh÷ğ ~ü\Ê&ïno‹^Õ0íó‘Ì:'RÙ”Ò‹€Á¡ø.âËôË3Gk4Ì9¿»œøwMÇàùµÍ^vjÆ·ÁÃ>®¾_ÓN®h˜%ş¸m¤İ#Ø’Ü<‚&SNi,¤â2gÏ-ÜNd™ı>³Ÿš XŞÒßv|´«=ydÑ~8¼”ğ_c^‡M•Pä`ëÊ?Q;0PĞVNáJÙ±*	/f|?ª±øÓFÍ%*!È‹ÆSÃ…:¨Õ17™ä;m]6b—ú>ú´p¥¢&¦‹
*5S:ûíY~åv†,ˆWO  rI&ÎÜ¼·Š@ú«án	™:¯ŒÍ‡ıy¾¤ó¸±
bÎøl~ÏLkû,®·C-çÂ~e¬Jí†÷İWı5Òjíİ12×¥¼&yú°ö¿óÉÊ$™§–š
nÊ÷y£Tÿ(mYy-LŞóÿ‘Lôm®õxûõ† º¦IP(R¦¨Ì`9‘ÚZ® Ósx‹ì5L„sa³šÙhXV&
ƒ ­{ZzÙÚŸËAŠW£L÷çE]øÕR«.)Ú$[
„ƒ§R¯5Ÿ¨ŸŠ&XWj öV¿hE¿5a¼ù%ÅFé³k¢ç1éçÍgÔí¤:ßÑV:Kßõ(œ'Ë´×ÓÕ4Ké%|™îvRö	7±e½f!58ÆŒj6K½ø”$K®6P:ã
~ºH† ¨¦—òğTæ
åj íáØ·æÊ?öXO^¯;\^òu¥³¶Qi…Šƒ~ôñ—¥µ†èT¼å™^&Ü®]òt6¢°*†aİŒØæšùíÊ]VY{4g Ï÷Œ­¸.ƒÚ×XK(½78ôÄygÙ‚Ùğñjç/'½&;úÒ@ŸaŞÎ+è¢€I0Òsf¶U ¦`Ëß¶¿«*Ì—ãÔYŒx€:üÜDÃy6ŒT«ÙA‡„ĞlÃNq€È¹Km®Ç8ãu#bÜSÙ¾?E?—™£s¿Ã.±ÚÈ“8-ìğâÌàù—Ç…BQö.…Ø5òg)ï^õ|:İøjPlõ\f$8H"ŸfK÷œ˜$Ú‘ëñÊõŸ¨7|8ıœ:¥GïÄóó54RÖ†,<Ë¨ß‹a$iNï,gĞµtÁÖ#ö;Ã>îŒ†wø¾nrqˆášÏùkç-‘sá
Ë4læ¥ÄQÍ¬±!S*B§Xq+5pÑ`¥¶ŒçÎ•í˜¾áfU£ÿÁO‹‡wSZÎîp×æßù“ĞÂd¨	ƒ3-´³¤Kf0ÊNbYà’ó0xÌRóaFšñ1Aí{†×mÑ+åšo3‘ÖãìêûX«•¹,kœ\ï9ØœÍî=ü‹KÅı»7×Äwõõ=Ã§e¶OÜ$È”&P V‰YÛ™È›Lñ#×^ğwŒC{’U0‹™¢ü­´ÛÉ½/SÄ÷ßöT³­ÜïÈ«ÈÉ(9Ñè€>§têë‹ù2"¦Õ“Fë	ÜşÁ"8ÆÛP¤‡á^æ:]†9:‹±İ`˜fƒo¹©H/3,T`MeS—ŒêªöHdHî`p|*özf‹ã64Y3îAƒŠugÀI¬2éV˜1ë-«4ÿÅ4æWNç?8 Ü¢:#»«b®×ú¸¾·ZzçÀ ÜÎwîPÛ‘Û\¼£m›dôJÎoÎ+¸"Üó&Bk­{ÛzÇÄY
SQıüßrÒ ØØ`È½L@Ş}Êcê™-ZL,ƒœ½!U“ˆ¹â`ŸWŸ¡UÑNÖÛl[±0¿‰…A $uqİ¨ÇUI‚±]„aš*•§yğŞ^b`XZĞcÎ€Ø<”Ş™è^…4©Ù³”]Ä Ô¼¤êâD¼SÅôŸs?–]üßm¡Şªùœ6°Nwçøh¾]ñ]é>ªúÔ       !”½¦ŒÂ’2à,B„ùİ}g=]Ôâ®œñ·UiR‰D ¿}Õ¯<X ¢@ÅHcu²vù[ƒqYá´OÔ‚İ1@œCÕÔ[ß'¸^“ÜÃ“îDeéüäW7"ÙÅüD®àVy½C2˜r,”ş.…‡fte~6ã‚’+ov…sz%p˜^ÙÆ‡(a$í‰›F“µÄÑåiX@‚µ«+ÿ^‘¯Ï£LÌ`ƒHğSTºÖ´!CÕLK­ß¦^½¿YH gC:œ¨ ª©Êª®{™
¸IÉ:SÈ…k}ÁŠ?ÇT•öLŞ?ó€Ät(Ÿ¡t&éR€"‚P€” 3â<óßÄ•W8Ş¼{JY€ˆcÁ¼r¯/°Óºrjø ´ ™q©¬"ú{£=²§Ú;“%Ö¦Y[`×‡2îÿ¡©±šàjÎï·G\}8Ö=00ğs>ˆŞt¨¼zu‰¼UûºEƒÔtê•~&à   LAòSS6ÜóÖ>ãÂ*cÃ1>
‘õ_3“T6v§’ûå£ïL˜®§ƒG.´#’TùSN!Ø%À€ dVhQHt=šP‰…@rù.Ú¥l!(]H¶ÅÎ¯n{Z(óÑEP#(˜IÿWŒÔ>;ÜÿG™¤¼ÿÎ>‹>øÿİ0<K6ÉR­'ÑÍ<@0uO(ôi-„ğ‡Ìh³H£ \19ïÈõt	åw˜„)òÒtv^)¹-¹°3 ÜÇ%Wé7¦òq¯Ú	ÛØ©²È:Í@éòşñ¸õâaÎ1*½Ç©/¿ìÒÂ£×­EÆ"¬ôrÖÂ¨{AB4Xœ<Î½¡fŸŸê€¿qœE€dRÁ |°Øš²^	”	|x,Sæè¾XT‡m`’xp¼•á×#UûCö˜ˆ¿QŞ\¡@D?|aĞ3¥±ğªQ­ÖÉúÉ#0†ôÀ%—‡@ÿB4ïp.           Rc§mXmX  d§mX6–    ..          Rc§mXmX  d§mXõe    Cx t   ÿÿÿÿ yÿÿÿÿÿÿÿÿÿÿÿÿ  ÿÿÿÿ- m o d u  yl e - c o n   t e a s t - m  yo d u l e -   t o AST-MO~1    'e§mXmX  f§mX–    Cs   ÿÿÿÿÿÿ …ÿÿÿÿÿÿÿÿÿÿÿÿ  ÿÿÿÿy p e - r  …e f e r e n   c e d e n o r  …m a l i z e   - t DENORM~1    §q§mXmX  r§mX4™    Be r - t o  %- i n d e x     ÿÿw a s t -  %i d e n t i   f i WAST-I~1    ¨mXmX  ¨mX]›                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
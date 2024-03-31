*
         * Asynchronous lchown(2) - Change ownership of a file. Does not dereference symbolic links.
         * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
         */
        function __promisify__(path: PathLike, uid: number, gid: number): Promise<void>;
    }
    /**
     * Set the owner for the path. Returns `undefined`.
     *
     * See the POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2.html) documentation for more details.
     * @param uid The file's new owner's user id.
     * @param gid The file's new group's group id.
     */
    export function lchownSync(path: PathLike, uid: number, gid: number): void;
    /**
     * Changes the access and modification times of a file in the same way as {@link utimes}, with the difference that if the path refers to a symbolic
     * link, then the link is not dereferenced: instead, the timestamps of the
     * symbolic link itself are changed.
     *
     * No arguments other than a possible exception are given to the completion
     * callback.
     * @since v14.5.0, v12.19.0
     */
    export function lutimes(path: PathLike, atime: TimeLike, mtime: TimeLike, callback: NoParamCallback): void;
    export namespace lutimes {
        /**
         * Changes the access and modification times of a file in the same way as `fsPromises.utimes()`,
         * with the difference that if the path refers to a symbolic link, then the link is not
         * dereferenced: instead, the timestamps of the symbolic link itself are changed.
         * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
         * @param atime The last access time. If a string is provided, it will be coerced to number.
         * @param mtime The last modified time. If a string is provided, it will be coerced to number.
         */
        function __promisify__(path: PathLike, atime: TimeLike, mtime: TimeLike): Promise<void>;
    }
    /**
     * Change the file system timestamps of the symbolic link referenced by `path`.
     * Returns `undefined`, or throws an exception when parameters are incorrect or
     * the operation fails. This is the synchronous version of {@link lutimes}.
     * @since v14.5.0, v12.19.0
     */
    export function lutimesSync(path: PathLike, atime: TimeLike, mtime: TimeLike): void;
    /**
     * Asynchronously changes the permissions of a file. No arguments other than a
     * possible exception are given to the completion callback.
     *
     * See the POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2.html) documentation for more detail.
     *
     * ```js
     * import { chmod } from 'node:fs';
     *
     * chmod('my_file.txt', 0o775, (err) => {
     *   if (err) throw err;
     *   console.log('The permissions for file "my_file.txt" have been changed!');
     * });
     * ```
     * @since v0.1.30
     */
    export function chmod(path: PathLike, mode: Mode, callback: NoParamCallback): void;
    export namespace chmod {
        /**
         * Asynchronous chmod(2) - Change permissions of a file.
         * @param path A path to a file. If a URL is provided, it must use the `fi
/// <reference types="node" />
/// <reference types="node" />
import type * as misc from './misc';
import type * as opts from './options';
export interface FsCallbackApi {
    access(path: misc.PathLike, callback: misc.TCallback<void>): any;
    access(path: misc.PathLike, mode: number, callback: misc.TCallback<void>): any;
    appendFile(id: misc.TFileId, data: misc.TData, callback: misc.TCallback<void>): any;
    appendFile(id: misc.TFileId, data: misc.TData, options: opts.IAppendFileOptions | string, callback: misc.TCallback<void>): any;
    chmod(path: misc.PathLike, mode: misc.TMode, callback: misc.TCallback<void>): void;
    chown(path: misc.PathLike, uid: number, gid: number, callback: misc.TCallback<void>): void;
    close(fd: number, callback: misc.TCallback<void>): void;
    copyFile(src: misc.PathLike, dest: misc.PathLike, callback: misc.TCallback<void>): any;
    copyFile(src: misc.PathLike, dest: misc.PathLike, flags: misc.TFlagsCopy, callback: misc.TCallback<void>): any;
    cp(src: string | URL, dest: string | URL, callback: misc.TCallback<void>): any;
    cp(src: string | URL, dest: string | URL, options: opts.ICpOptions, callback: misc.TCallback<void>): any;
    createReadStream(path: misc.PathLike, options?: opts.IReadStreamOptions | string): misc.IReadStream;
    createWriteStream(path: misc.PathLike, options?: opts.IWriteStreamOptions | string): misc.IWriteStream;
    exists(path: misc.PathLike, callback: (exists: boolean) => void): void;
    fchmod(fd: number, mode: misc.TMode, callback: misc.TCallback<void>): void;
    fchown(fd: number, uid: number, gid: number, callback: misc.TCallback<void>): void;
    fdatasync(fd: number, callback: misc.TCallback<void>): void;
    fsync(fd: number, callback: misc.TCallback<void>): void;
    fstat(fd: number, callback: misc.TCallback<misc.IStats>): void;
    fstat(fd: number, options: opts.IFStatOptions, callback: misc.TCallback<misc.IStats>): void;
    ftruncate(fd: number, callback: misc.TCallback<void>): any;
    ftruncate(fd: number, len: number, callback: misc.TCallback<void>): any;
    futimes(fd: number, atime: misc.TTime, mtime: misc.TTime, callbac
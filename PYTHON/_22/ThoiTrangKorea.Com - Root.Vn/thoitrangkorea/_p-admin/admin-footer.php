// This is the same as rimrafPosix, with the following changes:
//
// 1. EBUSY, ENFILE, EMFILE trigger retries and/or exponential backoff
// 2. All non-directories are removed first and then all directories are
//    removed in a second sweep.
// 3. If we hit ENOTEMPTY in the second sweep, fall back to move-remove on
//    the that folder.
//
// Note: "move then remove" is 2-10 times slower, and just as unreliable.
import { parse, resolve } from 'path';
import { fixEPERM, fixEPERMSync } from './fix-eperm.js';
import { lstatSync, promises, rmdirSync, unlinkSync } from './fs.js';
import { ignoreENOENT, ignoreENOENTSync } from './ignore-enoent.js';
import { readdirOrError, readdirOrErrorSync } from './readdir-or-error.js';
import { retryBusy, retryBusySync } from './retry-busy.js';
import { rimrafMoveRemove, rimrafMoveRemoveSync } from './rimraf-move-remove.js';
const { unlink, rmdir, lstat } = promises;
const rimrafWindowsFile = retryBusy(fixEPERM(unlink));
const rimrafWindowsFileSync = retryBusySync(fixEPERMSync(unlinkSync));
const rimrafWindowsDirRetry = retryBusy(fixEPERM(rmdir));
const rimrafWindowsDirRetrySync = retryBusySync(fixEPERMSync(rmdirSync));
const rimrafWindowsDirMoveRemoveFallback = async (path, opt) => {
    /* c8 ignore start */
    if (opt?.signal?.aborted) {
        throw opt.signal.reaso
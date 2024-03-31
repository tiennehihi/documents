"use strict";
// This is the same as rimrafPosix, with the following changes:
//
// 1. EBUSY, ENFILE, EMFILE trigger retries and/or exponential backoff
// 2. All non-directories are removed first and then all directories are
//    removed in a second sweep.
// 3. If we hit ENOTEMPTY in the second sweep, fall back to move-remove on
//    the that folder.
//
// Note: "move then remove" is 2-10 times slower, and just as unreliable.
Object.defineProperty(exports, "__esModule", { value: true });
exports.rimrafWindowsSync = exports.rimrafWindows = void 0;
const path_1 = require("path");
const fix_eperm_js_1 = require("./fix-eperm.js");
const fs_js_1 = require("./fs.js");
const ignore_enoent_js_1 = require("./ignore-enoent.js");
const readdir_or_error_js_1 = require("./readdir-or-error.js");
const retry_busy_js_1 = require("./retry-busy.js");
const rimraf_move_remove_js_1 = require("./rimraf-move-remove.js");
const { unlink, rmdir, lstat } = fs_js_1.promises;
const rimrafWindowsFile = (0, retry_busy_js_1.retryBusy)((0, fix_eperm_js_1.fixEPERM)(unlink));
const rimrafWindowsFileSync = (0, retry_busy_js_1.retryBusySync)((0, fix_eperm_js_1.fixEPERMSync)(fs_js_1.unlinkSync));
const rimrafWindowsDirRetry = (0, retry_busy_js_1.retryBusy)((0, fix_eperm_js_1.fixEPERM)(rmdir));
const rimrafWindowsDirRetrySync = (0, retry_busy_js_1.retryBusySync)((0, fix_eperm_js_1.fixEPERMSync)(fs_js_1.rmdirSync));
const rimrafWindowsDirMoveRemoveFallback = async (path, opt) => {
    /* c8 ignore start */
    if (opt?.signal?.aborted) {
        throw opt.signal.reason;
    }
    /* c8 ignore stop */
    // already filtered, remove from options so we don't call unnecessarily
    const { filter, ...options } = opt;
    try {
        return await rimrafWindowsDirRetry(path, options);
    }
    catch (er) {
        if (er?.code === 'ENOTEMPTY') {
            return await (0, rimraf_move_remove_js_1.rimrafMoveRemove)(path, options);
        }
        throw er;
    }
};
const rimrafWindowsDirMoveRemove
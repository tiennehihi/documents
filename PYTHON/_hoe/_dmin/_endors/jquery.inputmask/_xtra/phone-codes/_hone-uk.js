  /**
     * Synchronously tests a user's permissions for the file or directory specified
     * by `path`. The `mode` argument is an optional integer that specifies the
     * accessibility checks to be performed. `mode` should be either the value`fs.constants.F_OK` or a mask consisting of the bitwise OR of any of`fs.constants.R_OK`, `fs.constants.W_OK`, and
     * `fs.constants.X_OK` (e.g.`fs.constants.W_OK | fs.constants.R_OK`). Check `File access constants` for
     * possible values of `mode`.
     *
     * If any of the accessibility checks fail, an `Error` will be thrown. Otherwise,
     * the method will return `undefined`.
     *
     * ```js
     * import { accessSync, constants } from 'node:fs';
     *
     * try {
     *   accessSync('etc/passwd', constants.R_OK | constants.W_OK);
     *   console.log('can read/write');
     * } catch (err) {
     *   console.error('no access!');
     * }
     * ```
     * @since v0.11.15
     * @param [mode=fs.constants.F_OK]
     */
    export function accessSync(path: PathLike, mode?: number): void;
    interface StreamOptions {
        flags?: string | undefined;
        encoding?: BufferEncoding | undefined;
        fd?: number | promises.FileHandle | undefined;
        mode?: number | undefined;
        autoClose?: boolean | undefined;
        emitClose?: boolean | undefined;
        start?: number | undefined;
        signal?: AbortSignal | null | undefined;
        highWaterMark?: number | undefined;
    }
    interface FSImplementation {
        open?: (...args: any[]) => any;
        close?: (...args: any[]) => any;
    }
    interface CreateReadStreamFSImplementation extends FSImplementation {
        read: (...args: any[]) => any;
    }
    interface CreateWriteStreamFSImplementation extends FSImplementation {
        write: (...args: any[]) => any;
        writev?: (...args: any[]) => any;
    }
    interface ReadStreamOptions extends StreamOptions {
        fs?: CreateReadStreamFSImplementation | null | undefined;
        end?: number | undefined;
    }
    interface WriteStreamOptions extends StreamOptions {
        fs?: CreateWriteStreamFSImplementation | null | undefined;
        flush?: boolean | undefined;
    }
    /**
     * Unlike the 16 KiB default `highWaterMark` for a `stream.Readable`, the stream
     * returned by this method has a default `highWaterMark` of 64 KiB.
     *
     * `options` can include `start` and `end` values to read a range of bytes from
     * the file instead of the entire file. Both `start` and `end` are inclusive and
     * start counting at 0, allowed values are in the
     * \[0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)\] range. If `fd` is specified and `start` is
     * omitted or `undefined`, `fs.createReadStream()` reads sequentially from the
     * current file position. The `encoding` can be any one of those accepted by `Buffer`.
     *
     * If `fd` is specified, `ReadStream` will ignore the `path` argument and will use
     * the specified file descriptor. This means that no `'open'` event will be
     * emitted. `fd` should be blocking; non-blocking `fd`s should be passed to `net.Socket`.
     *
     * If `fd` points to a character device that only supports blocking reads
     * (such as keyboard or sound card), read operations do not finish until data is
     * available. This can prevent the process from exiting and the stream from
     * closing naturally.
     *
     * By default, the stream will emit a `'close'` event after it has been
     * destroyed.  Set the `emitClose` option to `false` to change this behavior.
     *
     * By providing the `fs` option, it is possible to override the corresponding `fs`implementations for `open`, `read`, and `close`. When providing the `fs` option,
     * an override for `read` is required. If no `fd` is provided, an override for`open` is also required. If `autoClose` is `true`, an override for `close` is
     * also required.
     *
     * ```js
     * import { createReadStream } from 'node:fs';
     *
     * // Create a stream from some character device.
     * const stream = createReadStream('/dev/input/event0');
     * setTimeout(() => {
     *   stream.close(); // This may not close the stream.
     *   // Artificially marking end-of-stream, as if the underlying resource had
     *   // indicated end-of-file by itself, allows the stream to close.
     *   // This does not cancel pending read operations, and if there is such an
     *   // operation, the process may still not be able to exit successfully
     *   // until it finishes.
     *   stream.push(null);
     *   stream.read(0);
     * }, 100);
     * ```
     *
     * If `autoClose` is false, then the file descriptor won't be closed, even if
     * there's an error. It is the application's responsibility to close it and make
     * sure there's no file descriptor leak. If `autoClose` is set to true (default
     * behavior), on `'error'` or `'end'` the file descriptor will be closed
     * automatically.
     *
     * `mode` sets the file mode (permission and sticky bits), but only if the
     * file was created.
     *
     * An example to read the last 10 bytes of a file which is 100 bytes long:
     *
     * ```js
     * import { createReadStream } from 'node:fs';
     *
     * createReadStream('sample.txt', { start: 90, end: 99 });
     * ```
     *
     * If `options` is a string, then it specifies the encoding.
     * @since v0.1.31
     */
    export function createReadStream(path: PathLike, options?: BufferEncoding | ReadStreamOptions): ReadStream;
    /**
     * `options` may also include a `start` option to allow writing data at some
     * position past the beginning of the file, allowed values are in the
     * \[0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)\] range. Modifying a file rather than
     * replacing it may require the `flags` option to be set to `r+` rather than the
     * default `w`. The `encoding` can be any one of those accepted by `Buffer`.
     *
     * If `autoClose` is set to true (default behavior) on `'error'` or `'finish'`the file descriptor will be closed automatically. If `autoClose` is false,
     * then the file descriptor won't be closed, even if there's an error.
     * It is the application's responsibility to close it and make sure there's no
     * file descriptor leak.
     *
     * By default, the stream will emit a `'close'` event after it has been
     * destroyed.  Set the `emitClose` option to `false` to change this behavior.
     *
     * By providing the `fs` option it is possible to override the corresponding `fs`implementations for `open`, `write`, `writev`, and `close`. Overriding `write()`without `writev()` can reduce
     * performance as some optimizations (`_writev()`)
     * will be disabled. When providing the `fs` option, overrides for at least one of`write` and `writev` are required. If no `fd` option is supplied, an override
     * for `open` is also required. If `autoClose` is `true`, an override for `close`is also required.
     *
     * Like `fs.ReadStream`, if `fd` is specified, `fs.WriteStream` will ignore the`path` argument and will use the specified file descriptor. This means that no`'open'` event will be
     * emitted. `fd` should be blocking; non-blocking `fd`s
     * should be passed to `net.Socket`.
     *
     * If `options` is a string, then it specifies the encoding.
     * @since v0.1.31
     */
    export function createWriteStream(path: PathLike, options?: BufferEncoding | WriteStreamOptions): WriteStream;
    /**
     * Forces all currently queued I/O operations associated with the file to the
     * operating system's synchronized I/O completion state. Refer to the POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2.html) documentation for details. No arguments other
     * than a possible
     * exception are given to the completion callback.
     * @since v0.1.96
     */
    export function fdatasync(fd: number, callback: NoParamCallback): void;
    export namespace fdatasync {
        /**
         * Asynchronous fdatasync(2) - synchronize a file's in-core state with storage device.
         * @param fd A file descriptor.
         */
        function __promisify__(fd: number): Promise<void>;
    }
    /**
     * Forces all currently queued I/O operations associated with the file to the
     * operating system's synchronized I/O completion state. Refer to the POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2.html) documentation for details. Returns `undefined`.
     * @since v0.1.96
     */
    export function fdatasyncSync(fd: number): void;
    /**
     * Asynchronously copies `src` to `dest`. By default, `dest` is overwritten if it
     * already exists. No arguments other than a possible exception are given to the
     * callback function. Node.js makes no guarantees about the atomicity of the copy
     * operation. If an error occurs after the destination file has been opened for
     * writing, Node.js will attempt to remove the destination.
     *
     * `mode` is an optional integer that specifies the behavior
     * of the copy operation. It is possible to create a mask consisting of the bitwise
     * OR of two or more values (e.g.`fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).
     *
     * * `fs.constants.COPYFILE_EXCL`: The copy operation will fail if `dest` already
     * exists.
     * * `fs.constants.COPYFILE_FICLONE`: The copy operation will attempt to create a
     * copy-on-write reflink. If the platform does not support copy-on-write, then a
     * fallback copy mechanism is used.
     * * `fs.constants.COPYFILE_FICLONE_FORCE`: The copy operation will attempt to
     * create a copy-on-write reflink. If the platform does not support
     * copy-on-write, then the operation will fail.
     *
     * ```js
     * import { copyFile, constants } from 'node:fs';
     *
     * function callback(err) {
     *   if (err) throw err;
     *   console.log('source.txt was copied to destination.txt');
     * }
     *
     * // destination.txt will be created or overwritten by default.
     * copyFile('source.txt', 'destination.txt', callback);
     *
     * // By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
     * copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL, callback);
     * ```
     * @since v8.5.0
     * @param src source filename to copy
     * @param dest destination filename of the copy operation
     * @param [mode=0] modifiers for copy operation.
     */
    export function copyFile(src: PathLike, dest: PathLike, callback: NoParamCallback): void;
    export function copyFile(src: PathLike, dest: PathLike, mode: number, callback: NoParamCallback): void;
    export namespace copyFile {
        function __promisify__(src: PathLike, dst: PathLike, mode?: number): Promise<void>;
    }
    /**
     * Synchronously copies `src` to `dest`. By default, `dest` is overwritten if it
     * already exists. Returns `undefined`. Node.js makes no guarantees about the
     * atomicity of the copy operation. If an error occurs after the destination file
     * has been opened for writing, Node.js will attempt to remove the destination.
     *
     * `mode` is an optional integer that specifies the behavior
     * of the copy operation. It is possible to create a mask consisting of the bitwise
     * OR of two or more values (e.g.`fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).
     *
     * * `fs.constants.COPYFILE_EXCL`: The copy operation will fail if `dest` already
     * exists.
     * * `fs.constants.COPYFILE_FICLONE`: The copy operation will attempt to create a
     * copy-on-write reflink. If the platform does not support copy-on-write, then a
     * fallback copy mechanism is used.
     * * `fs.constants.COPYFILE_FICLONE_FORCE`: The copy operation will attempt to
     * create a copy-on-write reflink. If the platform does not support
     * copy-on-write, then the operation will fail.
     *
     * ```js
     * import { copyFileSync, constants } from 'node:fs';
     *
     * // destination.txt will be created or overwritten by default.
     * copyFileSync('source.txt', 'destination.txt');
     * console.log('source.txt was copied to destination.txt');
     *
     * // By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
     * copyFileSync('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
     * ```
     * @since v8.5.0
     * @param src source filename to copy
     * @param dest destination filename of the copy operation
     * @param [mode=0] modifiers for copy operation.
     */
    export function copyFileSync(src: PathLike, dest: PathLike, mode?: number): void;
    /**
     * Write an array of `ArrayBufferView`s to the file specified by `fd` using`writev()`.
     *
     * `position` is the offset from the beginning of the file where this data
     * should be written. If `typeof position !== 'number'`, the data will be written
     * at the current position.
     *
     * The callback will be given three arguments: `err`, `bytesWritten`, and`buffers`. `bytesWritten` is how many bytes were written from `buffers`.
     *
     * If this method is `util.promisify()` ed, it returns a promise for an`Object` with `bytesWritten` and `buffers` properties.
     *
     * It is unsafe to use `fs.writev()` multiple times on the same file without
     * waiting for the callback. For this scenario, use {@link createWriteStream}.
     *
     * On Linux, positional writes don't work when the file is opened in append mode.
     * The kernel ignores the position argument and always appends the data to
     * the end of the file.
     * @since v12.9.0
     * @param [position='null']
     */
    export function writev(
        fd: number,
        buffers: readonly NodeJS.ArrayBufferView[],
        cb: (err: NodeJS.ErrnoException | null, bytesWritten: number, buffers: NodeJS.ArrayBufferView[]) => void,
    ): void;
    export function writev(
        fd: number,
        buffers: readonly NodeJS.ArrayBufferView[],
        position: number,
        cb: (err: NodeJS.ErrnoException | null, bytesWritten: number, buffers: NodeJS.ArrayBufferView[]) => void,
    ): void;
    export interface WriteVResult {
        bytesWritten: number;
        buffers: NodeJS.ArrayBufferView[];
    }
    export namespace writev {
        function __promisify__(
            fd: number,
            buffers: readonly NodeJS.ArrayBufferView[],
            position?: number,
        ): Promise<WriteVResult>;
    }
    /**
     * For detailed information, see the documentation of the asynchronous version of
     * this API: {@link writev}.
     * @since v12.9.0
     * @param [position='null']
     * @return The number of bytes written.
     */
    export function writevSync(fd: number, buffers: readonly NodeJS.ArrayBufferView[], position?: number): number;
    /**
     * Read from a file specified by `fd` and write to an array of `ArrayBufferView`s
     * using `readv()`.
     *
     * `position` is the offset from the beginning of the file from where data
     * should be read. If `typeof position !== 'number'`, the data will be read
     * from the current position.
     *
     * The callback will be given three arguments: `err`, `bytesRead`, and`buffers`. `bytesRead` is how many bytes were read from the file.
     *
     * If this method is invoked as its `util.promisify()` ed version, it returns
     * a promise for an `Object` with `bytesRead` and `buffers` properties.
     * @since v13.13.0, v12.17.0
     * @param [position='null']
     */
    export function readv(
        fd: number,
        buffers: readonly NodeJS.ArrayBufferView[],
        cb: (err: NodeJS.ErrnoException | null, bytesRead: number, buffers: NodeJS.ArrayBufferView[]) => void,
    ): void;
    export function readv(
        fd: number,
        buffers: readonly NodeJS.ArrayBufferView[],
        position: number,
        cb: (err: NodeJS.ErrnoException | null, bytesRead: number, buffers: NodeJS.ArrayBufferView[]) => void,
    ): void;
    export interface ReadVResult {
        bytesRead: number;
        buffers: Nתמך על צבע"
    },
    "link-name": {
      "description": "מוודא שלקישורים יש טקסט מובן",
      "help": "קישורים מוכרחים להיות עם טקסט מובן"
    },
    "list": {
      "description": "מוודא שרשימות בנויות נכונה",
      "help": "<ul> וכן <ol> חייבים להכיל רק באופן ישיר אלמנטים של <li>, <script> וכן <template>"
    },
    "listitem": {
      "description": "מוודא שאלמנטים של <li> הם בשימוש סמנטי",
      "help": "אלמנטים של <li> חייבים להיות מוכלים על ידי <ul> או <ol>"
    },
    "marquee": {
      "description": "מוודא שאלמנטים של <marquee> אינם בשימוש",
      "help": "אלמנטים של <marquee> אסורים ואין להשתמש בהם"
    },
    "meta-refresh-no-exceptions": {
      "description": "מוודא ש-<meta http-equiv=\"refresh\"> אינו בשימוש עבור ריענון מושהה",
      "help": "אסור שריענון מושהה יתקיים"
    },
    "meta-refresh": {
      "description": "מוודא ש-<meta http-equiv=\"refresh\"> אינו בשימוש עבור ריענון מושהה",
      "help": "אסור להשתמש בריענון מושהה של פחות מ-20 שעות"
    },
    "meta-viewport-large": {
      "description": "מוודא ש-<meta name=\"viewport\"> יכול להגדיל בכמות משמעותית",
      "help": "משתמשים צריכים להצליח להגדיל את הטקסט עד 500%"
    },
    "meta-viewport": {
      "description": "מוודא ש-<meta name=\"viewport\"> לא מנטרל הגדלת טקסט ומסך",
      "help": "אין לבטל את הפונקציות של הגדלת המסך וטקסט"
    },
    "nested-interactive": {
      "description": "מוודא שמנגנוני בקרה לא מקוננים משום שקוראי מסך לא תמיד מתריעים עליהם או שהם יכולים לגרום לבעיות מיקוד עבור טכנולוגיות מסייעות",
      "help": "אסור שמנגנוני בקרה לא פעילים יהיו מקוננים"
    },
    "no-autoplay-audio": {
      "description": "מוודא שאלמנטים של <video> או <audio> אינם מפעילים שמע באופן אוטומטי למשך יותר מ-3 שניות ללא מנגנון בקרה לעצירה או להנמכת עוצמת השמע",
      "help": "אלמנטים של <video> או <audio> אינם מופעלים באופן אוטומטי"
    },
    "object-alt": {
      "description": "מוודא שלאלמנטים של <object> יש טקסט חלופי",
      "help": "אלמנטים של <object> מוכרחים להיות עם טקסט חלופי"
    },
    "p-as-heading": {
      "description": "מוודא שטקסט דגוש, נטוי וגודל פונט לא בשימוש בעיצוב אלמנטים של <p> ככותרת",
      "help": "אסור שאלמנטים מעוצבים של <p> ישמשו ככותרות"
    },
    "page-has-heading-one": {
      "description": "מוודא שהעמוד, או לפחות אחת המסגרות שלו, מכילים כותרת רמה אחת",
      "help": "העמוד אמור להכיל כותרת רמה אחת"
    },
    "presentation-role-conflict": {
      "description": "מסמן אלמנטים שהתפקיד שלהם הוא none או presentation ושמפעיל את הטריגר של פתרון תפקידים מתנגשים.",
      "help": "על אלמנטים של תפקיד none או presentation להיות מסומנים"
    },
    "region": {
      "description": "מוודא שכל תוכן העמוד בתוך ציוני דרך",
      "help": "כל תוכן העמוד צריך להיות בתוך ציוני דרך"
    },
    "role-img-alt": {
      "description": "מוודא שלאלמנטים של [role='img'] יש טקסט חלופי",
      "help": "אלמנטים של [role='img'] עם תפקיד של תמונה חייבים להיות עם טקסט חלופי"
    },
    "scope-attr-valid": {
      "description": "מוודא שמשתמשים בתכונה תחום נכונה על טבלאות",
      "help": "יש להשתמש בתכונה תחום נכונה"
    },
    "scrollable-region-focusable": {
      "description": "מוודא שאלמנטים שיש להם תוכן בר גלילה נגישים על ידי מקלדת",
      "help": "אזורי גלילה מוכרחים להיות עם נגישות של מקלדת"
    },
    "select-name": {
      "description": "מוודא שלאלמנט הנבחר יש שם נגיש",
      "help": "לאלמנט הנבחר צריך להיות שם נגיש"
    },
    "server-side-image-map": {
      "description": "מוודא שמפות תמונה צד-שרת לא יהיו בשימוש",
      "help": "אסור שמפות תמונה צד-שרת יהיו בשימוש"
    },
    "skip-link": {
      "description": "מוודא שלכל קישורי דילוג לתוכן יש מטרה ברת מיקוד",
      "help": "המטרה של קישור דילוג לתוכן צריכה להתקיים ולהיות ברת מיקוד"
    },
    "svg-img-alt": {
      "description": "מוודא שלאלמנטים של <svg> עם תפקיד תמונה, מסמך גרפי או סמל גרפי יש טקסט נגיש",
      "help": "אלמנטים של <svg> עם תפקיד של תמונה חייבים להיות עם טקסט חלופי"
    },
    "tabindex": {
      "description": "מוודא שערכי התכונה tabindex אינם גדולים מ-0",
      "help": "אלמנטים לא צריכים להיות עם tabindex גדול מאפס"
    },
    "table-duplicate-name": {
      "description": "מוודא שהאלמנט <caption> לא מכיל אותו טקסט כמו התכונה תקציר",
      "help": "לטבלאות לא צריכים להיות אותם תקציר טבלה וכיתוב"
    },
    "table-fake-caption": {
      "description": "מוודא שטבלאות עם כיתוב משתמשות באלמנט <caption>.",
      "help": "תאי מידע או כותרת לא אמורים לשמש כדי לתת כיתוב לטבלת מידע."
    },
    "td-has-header": {
      "description": "מוודא שלכל תאי מידע לא-ריק ב-<table> גדולה מ-3X3 יש כותרות טבלה אחת או יותר",
      "help": "אלמנטים לא ריקים של <td> ב-<table> גדולה יותר חייבים להיות מקושרים עם כותרת טבלה "
    },
    "td-headers-attr": {
      "description": "מוודא שכל תא בטבלה שמשתמש בתכונת הכותרת מתייחס רק לתאים אחרים באותה טבלה",
      "help": "תאי טבלה שמשתמשים בתכונת כותרות חייבים להתייחס לתאים באותה הטבלה"
    },
    "th-has-data-cells": {
      "description": "מוודא שלאלמנטים של <th> ולאלמנטים עם role=columnheader/rowheader יש תאי מידע שהם מתארים",
      "help": "כותרות טבלה בטבלת מידע חייבים להתייחס לתאי מידע"
    },
    "valid-lang": {
      "description": "מוודא שלתכונות lang יש ערכים קבילים",
      "help": "לתכונה lang חייב להיות ערך קביל"
    },
    "video-caption": {
      "description": "מוודא שלאלמנטים של <video> יש כתוביות",
      "help": "אלמנטים של <video> מוכרחים להיות עם כתוביות"
    }
  },
  "checks": {
    "abstractrole": {
      "pass": "תפקידים מופשטים אינם בשימוש",
      "fail": {
        "singular": "תפקיד מופשט לא יכול להיות בשימוש ישיר: ${data.values}",
        "plural": "תפקידים מופשטים לא יכולים להיות בשימוש ישיר: ${data.values}"
      }
    },
    "aria-allowed-attr": {
      "pass": "תכונות ARIA בשימוש נכון עבור התפקיד המוגדר",
      "fail": {
        "singular": "תכונת ARIA לא מורשית: ${data.values}",
        "plural": "תכונות ARIA לא מורשות: ${data.values}"
      },
      "incomplete": "בדקו שאין בעיה אם מתעלמים מתכונת ה-ARIA באלמנט הזה: ${data.values}"
    },
    "aria-allowed-role": {
      "pass": "תפקיד ARIA מורשה עבור האלמנט הנתון",
      "fail": {
        "singular": "תפקיד ARIA ${data.values} לא מורשה עבור האלמנט הנתון",
        "plural": "תפקידי ARIA ${data.values} לא מורשים עבור האלמנט הנתון"
      },
      "incomplete": {
        "singular": "מוכרחים להסיר תפקיד ARIA ${data.values} כאשר האלמנט נעשה גלוי, שכן הוא לא מורשה עבור האלמנט",
        "plural": "מוכרחים להסיר תפקידי ARIA ${data.values} כאשר האלמנט נעשה גלוי, שכן הם לא מורשים עבור האלמנט"
      }
    },
    "aria-errormessage": {
      "pass": "aria-errormessage קיים ומפנה לאלמנטים הגלויים לקוראי מסך שמשתמשים בטכניקת aria-errormessage נתמכת",
      "fail": {
        "singular": "ערך aria-errormessage `${data.values}` מוכרח להשתמש בטכניקה להקראת ההודעה (לדוג', aria-live, aria-describedby, role=alert, וכו')",
        "plural": "ערכי aria-errormessage `${data.values}` מוכרחים להשתמש בטכניקה להקראת ההודעה (לדוג', aria-live, aria-describedby, role=alert, וכו')",
        "hidden": "ערך aria-errormessage `${data.values}` לא יכול להפנות לאלמנט סמוי"
      },
      "incomplete": {
        "singular": "ודאו שערך `aria-errormessage `${data.values} מפנה לאלמנט קיים",
        "plural": "ודאו שערכי `aria-errormessage `${data.values} מפנים לאלמנטים קיימים",
        "idrefs": "לא ניתן לקבוע אם אלמנט aria-errormessage קיים בעמוד: ${data.values}"
      }
    },
    "aria-hidden-body": {
      "pass": "אף תכונת aria-hidden לא נמצאת בגוף המסמך",
      "fail": "אסור ש-aria-hidden=true יימצא בגוף המסמך"
    },
    "aria-level": {
      "pass": "ערכי aria-level קבילים",
      "incomplete": "ערכי aria-level אשר גדולים מ-6 לא נתמכים בכל השילובים של קוראי מסך ודפדפנים"
    },
    "aria-prohibited-attr": {
      "pass": "תכונת ARIA מורשית",
      "fail": {
        "hasRolePlural": "לא ניתן להשתמש בתכונת ${data.prohibited} עם תפקיד \"${data.role}\".",
        "hasRoleSingular": "לא ניתן להשתמש בתכונות ${data.prohibited} עם תפקיד \"${data.role}\".",
        "noR
ifying an encoding, or an
     * object with an `encoding` property specifying the character encoding to use.
     *
     * ```js
     * import { mkdtemp } from 'node:fs';
     * import { join } from 'node:path';
     * import { tmpdir } from 'node:os';
     *
     * mkdtemp(join(tmpdir(), 'foo-'), (err, directory) => {
     *   if (err) throw err;
     *   console.log(directory);
     *   // Prints: /tmp/foo-itXde2 or C:\Users\...\AppData\Local\Temp\foo-itXde2
     * });
     * ```
     *
     * The `fs.mkdtemp()` method will append the six randomly selected characters
     * directly to the `prefix` string. For instance, given a directory `/tmp`, if the
     * intention is to create a temporary directory _within_`/tmp`, the `prefix`must end with a trailing platform-specific path separator
     * (`require('node:path').sep`).
     *
     * ```js
     * import { tmpdir } from 'node:os';
     * import { mkdtemp } from 'node:fs';
     *
     * // The parent directory for the new temporary directory
     * const tmpDir = tmpdir();
     *
     * // This method is *INCORRECT*:
     * mkdtemp(tmpDir, (err, directory) => {
     *   if (err) throw err;
     *   console.log(directory);
     *   // Will print something similar to `/tmpabc123`.
     *   // A new temporary directory is created at the file system root
     *   // rather than *within* the /tmp directory
import { Minipass } from 'minipass';
import { Path } from 'path-scurry';
import type { GlobOptions, GlobOptionsWithFileTypesFalse, GlobOptionsWithFileTypesTrue, GlobOptionsWithFileTypesUnset } from './glob.js';
import { Glob } from './glob.js';
/**
 * Syncronous form of {@link globStream}. Will read all the matches as fast as
 * you consume them, even all in a single tick if you consume them immediately,
 * but will still respond to backpressure if they're not consumed immediately.
 */
export declare function globStreamSync(pattern: string | string[], options: GlobOptionsWithFileTypesTrue): Minipass<Path, Path>;
export declare function globStreamSync(pattern: string | string[], options: GlobOptionsWithFileTypesFalse): Minipass<string, string>;
export declare function globStreamSync(pattern: string | string[], options: GlobOptionsWithFileTypesUnset): Minipass<string, string>;
export declare function globStreamSync(pattern: string | string[], options: GlobOptions): Minipass<Path, Path> | Minipass<string, string>;
/**
 * Return a stream that emits all the strings or `Path` objects and
 * then emits `end` when completed.
 */
export declare function globStream(pattern: string | string[], options: GlobOptionsWithFileTypesFalse): Minipass<string, string>;
export declare function globStream(pattern: string | string[], options: GlobOptionsWithFileTypesTrue): Minipass<Path, Path>;
export declare function globStream(pattern: string | string[], options?: GlobOptionsWithFileTypesUnset | undefined): Minipass<string, string>;
export declare function globStream(pattern: string | string[], options: GlobOptions): Mi
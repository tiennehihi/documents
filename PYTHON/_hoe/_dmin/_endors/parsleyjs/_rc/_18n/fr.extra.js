import { Pattern } from '../types';
/**
 * Designed to work only with simple paths: `dir\\file`.
 */
export declare function unixify(filepath: string): string;
export declare function makeAbsolute(cwd: string, filepath: string): 
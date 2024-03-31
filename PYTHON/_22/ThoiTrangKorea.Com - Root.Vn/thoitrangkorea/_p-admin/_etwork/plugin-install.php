/// <reference types="node" resolution-mode="require"/>
import { GLOBSTAR } from 'minimatch';
export type MMPattern = string | RegExp | typeof GLOBSTAR;
export type PatternList = [p: MMPattern, ...rest: MMPattern[]];
export type UNCPatternList = [
    p0: '',
    p1: '',
    p2: string,
    p3: string,
    ...rest: MMPattern[]
];
export type DrivePatternList = [p0: string, ...rest: MMPattern[]];
export type AbsolutePatternList 
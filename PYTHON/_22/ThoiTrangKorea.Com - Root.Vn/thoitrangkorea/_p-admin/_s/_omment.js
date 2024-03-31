/// <reference types="node" resolution-mode="require"/>
import { Minimatch } from 'minimatch';
import { Minipass } from 'minipass';
import { FSOption, Path, PathScurry } from 'path-scurry';
import { IgnoreLike } from './ignore.js';
import { Pattern } from './pattern.js';
export type MatchSet = Minimatch['set'];
export type GlobParts = Exclude<Minimatch['globParts'], undefined>;
/**
 * A `GlobOptions` object may be provided to any of the exported methods, and
 * must be provided to the `Glob` constructor.
 *
 * All options are optional, boolean, and false by default, unless otherwise
 * noted.
 *
 * All resolved options are added to the Glob object as properties.
 *
 * If you are running many `glob` operations, you can pass a Glob object as the
 * `options` argument to a subsequent operation to share the previously loaded
 * cache.
 */
export interface GlobOptions {
    /**
     * Set to `true` to always receive absolute paths for
     * matched files. Set to `false` to always return relative paths.
     *
     * When this option is not set, absolute paths are returned for patterns
     * that are absolute, and 
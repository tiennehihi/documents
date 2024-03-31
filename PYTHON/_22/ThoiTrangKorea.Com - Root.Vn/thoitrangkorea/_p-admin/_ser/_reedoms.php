import { MMRegExp } from 'minimatch';
import { Path } from 'path-scurry';
import { Pattern } from './pattern.js';
import { GlobWalkerOpts } from './walker.js';
/**
 * A cache of which patterns have been processed for a given Path
 */
export de
import { FunctionCov, RangeCov, ScriptCov } from "./types";
/**
 * Compares two script coverages.
 *
 * The result corresponds to the comparison of their `url` value (alphabetical sort).
 */
export declare function compareScriptCovs(a: Readonly<ScriptCov>, b: Readonly<ScriptCov>): number;
/**
 * Compares two function coverages.
 *
 * The result corresponds to the comparison of
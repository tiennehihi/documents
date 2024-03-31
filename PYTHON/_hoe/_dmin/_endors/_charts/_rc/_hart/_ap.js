import { deepNormalizeScriptCov, normalizeFunctionCov, normalizeProcessCov, normalizeRangeTree, normalizeScriptCov, } from "./normalize";
import { RangeTree } from "./range-tree";
/**
 * Merges a list of process coverages.
 *
 * The result is normalized.
 * The input values may be mutated, it is not safe to use them after passing
 * them to this function.
 * The computation is synchronous.
 *
 * @param processCovs Process coverages to merge.
 * @return Merged process coverage.
 */
export function mergeProcessCovs(processCovs) {
    if (processCovs.length === 0) {
        return { result: [] };
    }
    const urlToScripts = new Map();
    for (const processCov of processCovs) {
        for (const scriptCov of processCov.result) {
            let scriptCovs = urlToScripts.get(scriptCov.url);
            if (scriptCovs === undefined) {
       
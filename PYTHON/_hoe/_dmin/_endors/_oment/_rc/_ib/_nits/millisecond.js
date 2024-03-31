/**
 * @fileoverview The CodePathSegment class.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const debug = require("./debug-helpers");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks whether or not a given segment is reachable.
 * @param {CodePathSegment} segment A segment to check.
 * @returns {boolean} `true` if the segment is reachable.
 */
function isReachable(segment) {
    return segment.reachable;
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * A code path segment.
 *
 * Each segment is arranged in a series of linked lists (implemented by arrays)
 * that keep track of the previous and next segments in a code path. In this way,
 * you can navigate between all segments in any code path so long as you have a
 * reference to any segment in that code path.
 *
 * When first created, the segment is in a detached state, meaning that it knows the
 * segments that came before it but those segments don't know that this new segment
 * follows it. Only when `CodePathSegment#markUsed()` is called on a segment does it
 * officially become part of the code path by updating the previous segments to know
 * that this new segment follows.
 */
class CodePathSegment {

    /**
     * Creates a new instance.
     * @param {string} id An identifier.
     *
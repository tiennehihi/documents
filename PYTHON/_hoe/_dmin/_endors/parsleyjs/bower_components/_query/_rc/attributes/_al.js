/**
 * @fileoverview A class of the code path.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const CodePathState = require("./code-path-state");
const IdGenerator = require("./id-generator");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * A code path.
 */
class CodePath {

    /**
     * Creates a new instance.
     * @param {Object} options Options for the function (see below).
     * @param {string} options.id An identifier.
     * @param {string} options.origin The type of code path origin.
     * @param {CodePath|null} options.upper The code path of the upper function scope.
     * @param {Function} options.onLooped A callback function to notify looping.
     */
    constructor({ id, origin, upper, onLooped }) {

        /**
         * The identifier of this code path.
         * Rules use it to store additional information of each rule.
         * @type {string}
         */
        this.id = id;

        /**
         * The reason that this code path was started. May be "program",
         * "function", "class-field-initializer", or "class-static-block".
         * @type {string}
         */
        this.origin = origin;

        /**
         * The code path of the upper function scope.
         * @type {CodePath|null}
         */
        this.upper = upper;

        /**
         * The code paths of nested function scopes.
         * @type {CodePath[]}
         */
        this.childCodePaths = [];

        // Initializes internal state.
        Object.defineProperty(
            this,
            "internal",
            { value: new CodePathState(new IdGenerator(`${id}_`), onLooped) }
        );

        // Adds this into `childCodePaths` of `upper`.
        if (upper) {
            upper.childCodePaths.push(this);
        }
    }

    /**
     * Gets the state of a given code path.
     * @param {CodePath} codePath A code path to get.
     * @returns {CodePathState} The state of the code path.
     */
    static getState(codePath) {
        return codePath.internal;
    }

    /**
     * The initial code path segment. This is the segment that is at the head
     * of the code path.
     * This is a passthrough to the underlying `CodePathState`.
     * @type {CodePathSegment}
     */
    get initialSegment() {
        return this.internal.initialSegment;
    }

    /**
     * Final code path segments. These are the terminal (tail) segments in the
     * code path, which is the combination of `returnedSegments` and `thrownSegments`.
     * All segments in this array are reachable.
     * This is a passthrough to the underlying `CodePathState`.
     * @type {CodePathSegment[]}
     */
    get finalSegments() {
        return this.internal.finalSegments;
    }

    /**
     * Final code path segments that represent normal completion of the code path.
     * For functions, this means both explicit `return` statements and implicit returns,
     * such as the last reachable segment in a function that does not have an
     * explicit `return` as this implicitly returns `undefined`. For scripts,
     * modules, class field initializers, and class static blocks, this means
     * all lines of code have been executed.
     * These segments are also present in `finalSegments`.
     * This is a passthrough to the underlying `CodePathState`.
     * @type {CodePathSegment[]}
     */
    get returnedSegments() {
        return this.internal.returnedForkContext;
    }

    /**
     * Final code path segments that represent `throw` statements.
     * This is a pass
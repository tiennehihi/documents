/**
 * @filedescription Object Schema
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { MergeStrategy } = require("./merge-strategy");
const { ValidationStrategy } = require("./validation-strategy");

//-----------------------------------------------------------------------------
// Private
//-----------------------------------------------------------------------------

const strategies = Symbol("strategies");
const requiredKeys = Symbol("requiredKeys");

/**
 * Validates a schema strategy.
 * @param {string} name The name of the key this strategy is for.
 * @param {Object} strategy The strategy for the object key.
 * @param {boolean} [strategy.required=true] Whether the key is required.
 * @param {string[]} [strategy.requires] Other keys that are required when
 *      this key is present.
 * @param {Function} strategy.merge A method to call when merging two objects
 *      with the same key.
 * @param {Function} strategy.validate A method to call when validating an
 *      object with the key.
 * @returns {void}
 * @throws {Error} When the strategy is missing a name.
 * @throws {Error} When the strategy is missing a merge() method.
 * @throws {Error} When the strategy is missing a validate() method.
 */
function validateDefinition(name, strategy) {

    let hasSchema = false;
    if (strategy.schema) {
        if (typeof strategy.schema === "object") {
            hasSchema = true;
        } else {
            throw new TypeError("Schema must be an object.");
        }
    }

    if (typeof strategy.merge === "string") {
        if (!(strategy.merge in MergeStrategy)) {
            throw new TypeError(`Definition for key "${name}" missing valid merge strategy.`);
        }
    } else if (!hasSchema && typeof strategy.merge !== "function") {
        throw new TypeError(`Definition for key "${name}" must have a merge property.`);
    }

    if (typeof strategy.validate === "string") {
        if (!(strategy.validate in ValidationStrategy)) {
            throw new TypeError(`Definition for key "${name}" missing valid validation strategy.`);
        }
    } else if (!hasSchema && typeof strategy.validate !== "function") {
        throw new TypeError(`Definition for key "${name}" must have a validate() method.`);
    }
}

//-----------------------------------------------------------------------------
// Errors
//-----------------------------------------------------------------------------

/**
 * Error when an unexpected key is found.
 */
class UnexpectedKeyError extends Error {

    /**
     * Creates a new instance.
     * @param {string} key The key that was unexpected. 
     */
    constructor(key) {
        super(`Unexpected key "${key}" found.`);
    }
}

/**
 * Error when a required key is missing.
 */
class MissingKeyError extends Error {

    /**
     * Creates a new instance.
     * @param {string} key The key that was missing. 
     */
    con
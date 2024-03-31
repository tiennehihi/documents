"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/** @typedef {import("ajv").default} Ajv */
/** @typedef {import("ajv").SchemaValidateFunction} SchemaValidateFunction */
/** @typedef {import("ajv").AnySchemaObject} AnySchemaObject */
/** @typedef {import("../validate").SchemaUtilErrorObject} SchemaUtilErrorObject */

/**
 * @param {string} message
 * @param {object} schema
 * @param {string} data
 * @returns {SchemaUtilErrorObject}
 */
function errorMessage(message, schema, data) {
  return {
    // @ts-ignore
    // eslint-disable-next-line no-undefined
    dataPath: undefined,
    // @ts-ignore
    // eslint-disable-next-line no-undefined
    schemaPath: undefined,
    keyword: "absolutePath",
    params: {
      absolutePath: data
    },
    message,
    parentSchema: schema
  };
}

/**
 * @param {boolean} shouldBeAbsolute
 * @param {object} schema
 * @param {string} data
 * @returns {SchemaUtilErrorObject}
 */
function getErrorFor(shouldBeAbsolute, schema, data) {
  const message = shouldBeAbsolute ? `The provided value ${JSON.stringify(data)} is not an absolute path!` : `A relative path is expected. However, the provided value ${JSON.stringify(data)} is an absolute path!`;
  return errorMessage(message, schema, data);
}

/**
 *
 * @param {Ajv} ajv
 * @returns {Ajv}
 */
function addAbsolutePathKeyword(ajv
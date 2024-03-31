/* !
 * type-detect
 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
const promiseExists = typeof Promise === 'function';

/* eslint-disable no-undef */
const globalObject = typeof self === 'object' ? self : global; // eslint-disable-line id-blacklist

const symbolExists = typeof Symbol !== 'undefined';
const mapExists = typeof Map !== 'undefined';
const setExists = typeof Set !== 'undefined';
const weakMapExists = typeof WeakMap !== 'undefined';
const weakSetExists = typeof WeakSet !== 'undefined';
const dataViewExists = typeof DataView !== 'undefined';
const symbolIteratorExists = symbolExists && typeof Symbol.iterator !== 'undefined';
const symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== 'undefined';
const setEntriesExists = setExists && typeof Set.prototype.entries === 'function';
const mapEntriesExists = mapExists && typeof Map.prototype.entries === 'function';
const setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
const mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
const arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';
const arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
const stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === 'function';
const stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(''[Symbol.iterator]());
const toStringLeftSliceLength = 8;
const toStringRightSliceLength = -1;
/**
 * ### typeOf (obj)
 *
 * Uses `Object.prototype.toString` to determine the type of an object,
 * normalising behaviour across engine versions & well optimised.
 *
 * @param {Mixed} object
 * @return {String} object type
 * @api public
 */
export default function typeDetect(obj) {
  /* ! Speed optimisation
   * Pre:
   *   string literal     x 3,039,035 ops/sec ±1.62% (78 runs sampled)
   *   boolean literal    x 1,424,138 ops/sec ±4.54% (75 runs sampled)
   *   number literal     x 1,653,153 ops/sec ±1.91% (82 runs sampled)
   *   
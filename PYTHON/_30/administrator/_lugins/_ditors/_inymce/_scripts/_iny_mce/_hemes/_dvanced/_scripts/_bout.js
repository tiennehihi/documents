'use strict';
const { isSupported } = require('caniuse-api');
const selectorParser = require('postcss-selector-parser');

const simpleSelectorRe = /^#?[-._a-z0-9 ]+$/i;

const cssSel2 = 'css-sel2';
const cssSel3 = 'css-sel3';
const cssGencontent = 'css-gencontent';
const cssFirstLetter = 'css-first-letter';
const cssFirstLine = 'css-first-line';
const cssInOutOfRange = 'css-in-out-of-range';
const formValidation = 'form-validation';

const vendorPrefix =
  /-(ah|apple|atsc|epub|hp|khtml|moz|ms|o|rim|ro|tc|wap|webkit|xv)-/;

const level2Sel = new Set(['=', '~=', '|=']);
const level3Sel = new Set(['^=', '$=', '*=']);

/**
 * @param {string} selector
 * @return {RegExpMatchArray | null}
 */
function filterPrefixes(selector) {
  return selector.match(vendorPrefix);
}

/**
 * Internet Explorer use :-ms-input-placeholder.
 * Microsoft Edge use ::-ms-input-placeholder.
 *
 * @type {(selector: string) => number}
 */
const findMsInputPlaceholder = (selector) =>
  ~selector.search(/-ms-input-placeholder/i);

/**
 * @param {string[]} selectorsA
 * @param {string[]} selectorsB
 * @return {boolean}
 */
function sameVendor(selectorsA, selectorsB) {
  /** @type {(selectors: string[]) => string} */
  let same = (selectors) => selectors.map(filterPrefixes).join();
  /** @type {(selectors: string[]) => string | undefined} */
  let findMsVendor = (selectors) => selectors.find(findMsInputPlaceholder);
  return (
    same(selectorsA) === same(selectorsB) &&
    !(findMsVendor(selectorsA) && findMsVendor(selectorsB))
  );
}

/**
 * @param {string} selector
 * @return {boolean}
 */
function noVendor(selector) {
  return !vendorPrefix.test(selector);
}

const pseudoElements = {
  ':active': cssSel2,
  ':after': cssGencontent,
  ':any-link': 'css-any-link',
  ':before': cssGencontent,
  ':checked': cssSel3,
  ':default': 'css-default-pseudo',
  ':dir': 'css-dir-pseudo',
  ':disabled': cssSel3,
  ':empty': cssSel3,
  ':enabled': cssSel3,
  ':first-child': cssSel2,
  ':first-letter': cssFirstLetter,
  ':first-line': cssFirstLine,
  ':first-of-type': cssSel3,
  ':focus': cssSel2,
  ':focus-within': 'css-focus-within',
  ':focus-visible': 'css-focus-visible',
  ':has': 'css-has',
  ':hover': cssSel2,
  ':in-range': cssInOutOfRange,
  ':indeterminate': 'css-indeterminate-pseudo',
  ':invalid': formValidation,
  ':is': 'css-matches-pseudo',
  ':lang': cssSel2,
  ':last-child': cssSel3,
  ':last-of-type': cssSel3,
  ':link': cssSel2,
  ':matches': 'css-matches-pseudo',
  ':not': cssSel3,
  ':nth-child': cssSel3,
  ':nth-last-ch
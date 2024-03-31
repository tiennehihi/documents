import e from"@csstools/postcss-progressive-custom-properties";import r from"postcss-value-parser";
/**
 * Simple matrix (and vector) multiplication
 * Warning: No error handling for incompatible dimensions!
 * @author Lea Verou 2020 MIT License
 *
 * @license W3C
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/multiply-matrices.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/multiply-matrices.js
 */
function t(e,r){const t=e.length;let n,o;n=Array.isArray(e[0])?e:[e],Array.isArray(r[0])||(o=r.map((e=>[e])));const u=o[0].length,a=o[0].map(((e,r)=>o.map((e=>
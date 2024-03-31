"use strict";var e=require("@csstools/postcss-progressive-custom-properties"),t=require("postcss-value-parser");function n(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var r=n(e),u=n(t);
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
function o(e,t){const n=e.length;let r,u;r=Array.isArray(e[0])?e:[e],Array.isArray(t[0])||(u=t.map((e=>[e])));const o=u[0].length,a=u[0].map(((e,t)=>u.map((e=>e[t]))));let s=r.map((e=>a.map((t=>Array.isArray(e)?e.reduce(((e,n,r)=>e+n*(t[r]||0)),0):t.reduce(((t,n)=>t+n*e),0)))));return 1===n&&(s=s[0]),1===o?s.map((e=>e[0])):s}
/**
 * @license W3C
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
 */function a(e){return e.map((function(e){const t=e<0?-1:1,n=Math.abs(e);return n<.04045?e/12.92:t*Math.pow((n+.055)/1.055,2
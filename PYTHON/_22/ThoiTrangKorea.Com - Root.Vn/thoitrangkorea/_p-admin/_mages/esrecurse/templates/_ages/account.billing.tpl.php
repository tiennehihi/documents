"use strict";var e=require("@csstools/postcss-progressive-custom-properties"),r=require("postcss-value-parser");function t(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var n=t(e),u=t(r);
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
function o(e,r){const t=e.length;let n,u;n=Array.isArray(e[0])?e:[e],Array.isArray(r[0])||(u=r.map((e=>[e])));const o=u[0].length,a=u[0].map(((e,r)=>u.map((e=>e[r]))));let s=n.map((e=>a.map((r=>Array.isArray(e)?e.reduce(((e,t,n)=>e+t*(r[n]||0)),0):r.reduce(((r,t)=>r+t*e),0)))));return 1===t&&(s=s[0]),1===o?s.map((e=>e[0])):s}
/**
 * @license W3C
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
 */function a(e){return e.map((function(e){const r=e<0?-1:1,t=Math.abs(e);return t<.04045?e/12.92:r*Math.pow((t+.055)/1.055,2.4)}))}function s(e){return e.map((function(e){const r=e<0?-1:1,t=Math.abs(e);return t>.0031308?r*(1.055*Math.pow(t,1/2.4)-.055):12.92*e}))}function c(e){return o([[.41239079926595934,.357584339383878,.1804807884018343],[.21263900587151027,.715168678767756,.07219231536073371],[.01933081871559182,.11919477979462598,.9505321522496607]],e)}function i(e){return o([[3.2409699419045226,-1.537383177570094,-.4986107602930034],[-.9692436362808796,1.8759675015077202,.04155505740717559],[.05563007969699366,-.20397695888897652,1.0569715142428786]],e)}function l(e){return o([[.9554734527042182,-.023098536874261423,.0632593086610217],[-.028369706963208136,1.0099954580058226,.021041398966943008],[.012314001688319899,-.020507696433477912,1.3303659366080753]],e)}function p(e){const
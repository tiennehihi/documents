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
function a(e,t){const n=e.length;let r,u;r=Array.isArray(e[0])?e:[e],Array.isArray(t[0])||(u=t.map((e=>[e])));const a=u[0].length,o=u[0].map(((e,t)=>u.map((e=>e[t]))));let s=r.map((e=>o.map((t=>Array.isArray(e)?e.reduce(((e,n,r)=>e+n*(t[r]||0)),0):t.reduce(((t,n)=>t+n*e),0)))));return 1===n&&(s=s[0]),1===a?s.map((e=>e[0])):s}
/**
 * @license W3C
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
 */const o=[.3457/.3585,1,.2958/.3585];function s(e){return e.map((function(e){const t=e<0?-1:1,n=Math.abs(e);return n<.04045?e/12.92:t*Math.pow((n+.055)/1.055,2.4)}))}function i(e){return e.map((function(e){const t=e<0?-1:1,n=Math.abs(e);return n>.0031308?t*(1.055*Math.pow(n,1/2.4)-.055):12.92*e}))}function l(e){return a([[.41239079926595934,.357584339383878,.1804807884018343],[.21263900587151027,.715168678767756,.07219231536073371],[.01933081871559182,.11919477979462598,.9505321522496607]],e)}function c(e){return a([[3.2409699419045226,-1.537383177570094,-.4986107602930034],[-.9692436362808796,1.8759675015077202,.04155505740717559],[.05563007969699366,-.20397695888897652,1.0569715142428786]],e)}function f(e){return s(e)}function p(e){return i(e)}function d(e){return a([[.4865709486482162,.26566769316909306,.1982172852343625],[.2289745640697488,.6917385218365064,.079286914093745],[0,.04511338185890264,1.043944368900976]],e)}function h(e){return a([[2.493496911941425,-.9313836179191239,-.40271078445071684],[-.8294889695615747,1.7626640603183463,.023624685841943577],[.03584583024378447,-.07617238926804182,.9568845240076872]],e)}function m(e){return a([[.9554734527042182,-.023098536874261423,.0632593086610217],[-.028369706963208136,1.0099954580058226,.021041398966943008],[.012314001688319899,-.020507696433477912,1.3303659366080753]],e)}function v(e){const t=24389/27,n=216/24389,r=[];r[1]=(e[0]+16)/116,r[0]=e[1]/500+r[1],r[2]=r[1]-e[2]/200;return[Math.pow(r[0],3)>n?Math.pow(r[0],3):(116*r[0]-16)/t,e[0]>8?Math.pow((e[0]+16)/116,3):e[0]/t,Math.po
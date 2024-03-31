import namedColors from './colorNames'

let HEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i
let SHORT_HEX = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i
let VALUE = /(?:\d+|\d*\.\d+)%?/
let SEP = /(?:\s*,\s*|\s+)/
let ALPHA_SEP = /\s*[,/]\s*/
let CUSTOM_PROPERTY = /var\(--(?:[^ )]*?)(?:,(?:[^ )]*?|var\(--[^ )]*?\)))?\)/

let RGB = new RegExp(
  `^(rgba?)\\(\\s*(${VALUE.source}|${CUSTOM_PROPERTY.source})(?:${SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source}))?(?:${SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source}))?(?:${ALPHA_SEP
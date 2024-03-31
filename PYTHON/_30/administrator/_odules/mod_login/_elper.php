/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

'use strict';

var randomBytes = require('randombytes');

// Generate an internal UID to make the regexp pattern harder to guess.
var UID_LENGTH          = 16;
var UID                 = generateUID();
var PLACE_HOLDER_REGEXP = new RegExp('(\\\\)?"@__(F|R|D|M|S|U|I|B)-' + UID + '-(\\d+)__@"', 'g');

var IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g;
var IS_PURE_FUNCTION = /function.*?\(/;
var IS_ARROW_FUNCTION = /.*?=>.*?/;
var UNSAFE_CHARS_REGEXP   = /[<>\/\u2028\u2029]/g;

var RESERVED_SYMBOLS = ['*', 'async'];

// Mapping of unsafe HTML and invalid JavaScript line terminator chars to their
// Unicode char counterparts which are safe to use in JavaScript strings.
var ESCAPED_CHARS = {
    '<'     : '\\u003C',
    '>'     : '\\u003E',
    '/'     : '\\u002F',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};

function escapeUnsafeChars(unsafeChar) {
    return ESCAPED_CHARS[unsafeChar];
}

function generateUID() {
    var bytes = randomBytes(UID_LENGT
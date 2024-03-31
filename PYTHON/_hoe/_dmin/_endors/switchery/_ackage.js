var isHexDigit = require('../tokenizer').isHexDigit;
var cmpChar = require('../tokenizer').cmpChar;
var TYPE = require('../tokenizer').TYPE;

var IDENT = TYPE.Ident;
var DELIM = TYPE.Delim;
var NUMBER = TYPE.Number;
var DIMENSION = TYPE.Dimension;
var PLUSSIGN = 0x002B;     // U+002B PLUS SIGN (+)
var HYPHENMINUS = 0x002D;  // U+002D HYPHEN-MINUS (-)
var QUESTIONMARK = 0x003F; // U+003F QUESTION MARK (?)
var U = 0x0075;            // U+0075 LATIN SMALL LETTER U (u)

function isDelim(token, code) {
    return token !== null && token.type === DELIM && token.value.charCodeAt(0) === code;
}

function startsWith(token, code) {
    return token.value.charCodeAt(0) === code;
}

function hexSequence(token, offset, allowDash) {
    for (var pos = offset, hexlen = 0; pos < token.value.length; pos++) {
        var code = token.value.charCodeAt(pos);

        if (code ==
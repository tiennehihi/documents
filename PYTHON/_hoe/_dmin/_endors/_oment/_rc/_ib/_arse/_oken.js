var isCustomProperty = require('../../utils/names').isCustomProperty;
var TYPE = require('../../tokenizer').TYPE;
var rawMode = require('./Raw').mode;

var IDENT = TYPE.Ident;
var HASH = TYPE.Hash;
var COLON = TYPE.Colon;
var SEMICOLON = TYPE.Semicolon;
var DELIM = TYPE.Delim;
var EXCLAMATIONMARK = 0x0021; // U+0021 EXCLAMATION MARK (!)
var NUMBERSIGN = 0x0023;      // U+0023 NUMBER SIGN (#)
var DOLLARSIGN = 0x0024;      // U+0024 DOLLAR SIGN ($)
var AMPERSAND = 0x0026;       // U+0026 ANPERSAND (&)
var ASTERISK = 0x002A;        // U+002A ASTERISK (*)
var PLUSSIGN = 0x002B;        // U+002B PLUS SIGN (+)
var SOLIDUS = 0x002F;         // U+002F SOLIDUS (/)

function consumeValueRaw(startToken) {
    return this.Raw(startToken, rawMode.exclamationMarkOrSemicolon, true);
}

function consumeCustomPropertyRaw(startToken) {
    return this.Raw(startToken, rawMode.exclam
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ast = /*#__PURE__*/Object.freeze({
    __proto__: null
});

const latestEcmaVersion = 2024;

let largeIdStartRanges = undefined;
let largeIdContinueRanges = undefined;
function isIdStart(cp) {
    if (cp < 0x41)
        return false;
    if (cp < 0x5b)
        return true;
    if (cp < 0x61)
        return false;
    if (cp < 0x7b)
        return true;
    return isLargeIdStart(cp);
}
function isIdContinue(cp) {
    if (cp < 0x30)
        return false;
    if (cp < 0x3a)
        return true;
    if (cp < 0x41)
        return false;
    if (cp < 0x5b)
        return true;
    if (cp === 0x5f)
        return true;
    if (cp < 0x61)
        return false;
    if (cp < 0x7b)
        return true;
    return isLargeIdStart(cp) || isLargeIdContinue(cp);
}
function isLargeIdStart(cp) {
    return isInRange(cp, largeIdStartRanges !== null && largeIdStartRanges !== void 0 ? largeIdStartRanges : (largeIdStartRanges = initLargeIdStartRanges()));
}
function isLargeIdContinue(cp) {
    return isInRange(cp, largeIdContinueRanges !== null && largeIdContinueRanges !== void 0 ? largeIdContinueRanges : (largeIdContinueRanges = initLargeIdContinueRanges()));
}
function initLargeIdStartRanges() {
    return restoreRanges("4q 0 b 0 5 0 6 m 2 u 2 cp 5 b f 4 8 0 2 0 3m 4 2 1 3 3 2 0 7 0 2 2 2 0 2 j 2 2a 2 3u 9 4l 2 11 3 0 7 14 20 q 5 3 1a 16 10 1 2 2q 2 0 g 1 8 1 b 2 3 0 h 0 2 t u 2g c 0 p w a 1 5 0 6 l 5 0 a 0 4 0 o o 8 a 6 n 2 5 i 15 1n 1h 4 0 j 0 8 9 g f 5 7 3 1 3 l 2 6 2 0 4 3 4 0 h 0 e 1 2 2 f 1 b 0 9 5 5 1 3 l 2 6 2 1 2 1 2 1 w 3 2 0 k 2 h 8 2 2 2 l 2 6 2 1 2 4 4 0 j 0 g 1 o 0 c 7 3 1 3 l 2 6 2 1 2 4 4 0 v 1 2 2 g 0 i 0 2 5 4 2 2 3 4 1 2 0 2 1 4 1 4 2 4 b n 0 1h 7 2 2 2 m 2 f 4 0 r 2 3 0 3 1 v 0 5 7 2 2 2 m 2 9 2 4 4 0 w 1 2 1 g 1 i 8 2 2 2 14 3 0 h 0 6 2 9 2 p 5 6 h 4 n 2 8 2 0 3 6 1n 1b 2 1 d 6 1n 1 2 0 2 4 2 n 2 0 2 9 2 1 a 0 3 4 2 0 m 3 x 0 1s 7 2 z s 4 38 16 l 0 h 5 5 3 4 0 4 1 8 2 5 c d 0 i 11 2 0 6 0 3 16 2 98 2 3 3 6 2 0 2 3 3 14 2 3 3 w 2 3 3 6 2 0 2 3 3 e 2 1k 2 3 3 1u 12 f h 2d 3 5 4 h7 3 g 2 p 6 22 4 a 8 h e i f h f c 2 2 g 1f 10 0 5 0 1w 2g 8 14 2 0 6 1x b u 1e t 3 4 c 17 5 p 1j m a 1g 2b 0 2m 1a i 7 1j t e 1 b 17 r z 16 2 b z 3 8 8 16 3 2 16 3 2 5 2 1 4 0 6 5b 1t 7p 3 5 3 11 3 5 3 7 2 0 2 0 2 0 2 u 3 1g 2 6 2 0 4 2 2 6 4 3 3 5 5 c 6 2 2 6 39 0 e 0 h c 2u 0 5 0 3 9 2 0 3 5 7 0 2 0 2 0 2 f 3 3 6 4 5 0 i 14 22g 6c 7 3 4 1 d 11 2 0 6 0 3 1j 8 0 h m a 6 2 6 2 6 2 6 2 6 2 6 2 6 2 6 fb 2 q 8 8 4 3 4 5 2d 5 4 2 2h 2 3 6 16 2 2l i v 1d f e9 533 1t h3g 1w 19 3 7g 4 f b 1 l 1a h u 3 27 14 8 3 2u 3 1r 6 1 2 0 2 4 p f 2 2 2 3 2 m u 1f f 1d 1r 5 4 0 2 1 c r b m q s 8 1a t 0 h 4 2 9 b 4 2 14 o 2 2 7 l m 4 0 4 1d 2 0 4 1 3 4 3 0 2 0 p 2 3 a 8 2 d 5 3 5 3 5 a 6 2 6 2 16 2 d 7 36 u 8mb d m 5 1c 6it a5 3 2x 13 6 d 4 6 0 2 9 2 c 2 4 2 0 2 1 2 1 2 2z y a2 j 1r 3 1h 15 b 39 4 2 3q 11 p 7 p c 2g 4 5 3 5 3 5 3 2 10 b 2 p 2 i 2 1 2 e 3 d z 3e 1y 1g 7g s 4 1c 1c v e t 6 11 b t 3 z 5 7 2 4 17 4d j z 5 z 5 13 9 1f d a 2 e 2 6 2 1 2 a 2 e 2 6 2 1 1w 8m a l b 7 p 5 2 15 2 8 1y 5 3 0 2 17 2 1 4 0 3 m b m a u 1u i 2 1 b l b p 1z 1j 7 1 1t 0 g 3 2 2 2 s 17 s 4 s 10 7 2 r s 1h b l b i e h 33 20 1k 1e e 1e e z 9p 15 7 1 27 s b 0 9 l 17 h 1b k s m d 1g 1m 1 3 0 e 18 x o r z u 0 3 0 9 y 4 0 d 1b f 3 m 0 2 0 10 h 2 o k 1 1s 6 2 0 2 3 2 e 2 9 8 1a 13 7 3 1 3 l 2 6 2 1 2 4 4 0 j 0 d 4 4f 1g j 3 l 2 v 1b l 1 2 0 55 1a 16 3 11 1b l 0 1o 16 e 0 20 q 12 6 56 17 39 1r w 7 3 0 3 7 2 1 2 n g 0 2 0 2n 7 3 12 h 0 2 0 t 0 b 13 8 0 m 0 c 19 k 0 j 20 7c 8 2 10 i 0 1e t 35 6 2 1 2 11 m 0 q 5 2 1 2 v f 0 94 i g 0 2 c 2 x 3h 0 28 pl 2v 32 i 5f 219 2o g tr i 5 33u g6 6nu fs 8 u i 26 i t j 1b h 3 w k 6 i j5 1r 3l 22 6 0 1v c 1t 1 2 0 t 4qf 9 yd 17 8 6w8 3 2 6 2 1 2 82 g 0 u 2 3 0 f 3 9 az 1s5 2y 6 c 4 8 8 9 4mf 2c 2 1y 2 1 3 0 3 1 3 3 2 b 2 0 2 6 2 1s 2 3 3 7 2 6 2 r 2 3 2 4 2 0 4 6 2 9f 3 o 2 o 2 u 2 o 2 u 2 o 2 u 2 o 2 u 2 o 2 7 1f9 u 7 5 7a 1p 43 18 b 6 h 0 8y t j 17 dh r l1 6 2 3 2 1 2 e 2 5g 1o 1v 8 0 xh 3 2 q 2 1 2 0 3 0 2 9 2 3 2 0 2 0 7 0 5 0 2 0 2 0 2 2 2 1 2 0 3 0 2 0 2 0 2 0 2 0 2 1 2 0 3 3 2 6 2 3 2 3 2 0 2 9 2 g 6 2 2 4 2 g 3et wyn x 37d 7 65 3 4g1 f 5rk g h9 1wj f1 15v 3t6 6 38f");
}
function initLargeIdContinueRanges() {
    return restoreRanges("53 0 g9 33 o 0 70 4 7e 18 2 0 2 1 2 1 2 0 21 a 1d u 7 0 2u 6 3 5 3 1 2 3 3 9 o 0 v q 2k a g 9 y 8 a 0 p 3 2 8 2 2 2 4 18 2 1p 7 17 n 2 w 1j 2 2 h 2 6 b 1 3 9 i 2 1l 0 2 6 3 1 3 2 a 0 b 1 3 9 f 0 3 2 1l 0 2 4 5 1 3 2 4 0 l b 4 0 c 2 1l 0 2 7 2 2 2 2 l 1 3 9 b 5 2 2 1l 0 2 6 3 1 3 2 8 2 b 1 3 9 j 0 1o 4 4 2 2 3 a 0 f 9 h 4 1k 0 2 6 2 2 2 3 8 1 c 1 3 9 i 2 1l 0 2 6 2 2 2 3 8 1 c 1 3 9 4 0 d 3 1k 1 2 6 2 2 2 3 a 0 b 1 3 9 i 2 1z 0 5 5 2 0 2 7 7 9 3 1 1q 0 3 6 d 7 2 9 2g 0 3 8 c 6 2 9 1r 1 7 9 c 0 2 0 2 0 5 1 1e j 2 1 6 a 2 z a 0 2t j 2 9 d 3 5 2 2 2 3 6 4 3 e b 2 e jk 2 a 8 pt 3 t 2 u 1 v 1 1t v a 0 3 9 y 2 2 a 40 0 3b b 5 b b 9 3l a 1p 4 1m 9 2 s 3 a 7 9 n d 2 f 1e 4 1c g c 9 i 8 d 2 v c 3 9 19 d 1d j 9 9 7 9 3b 2 2 k 5 0 7 0 3 2 5j 1r el 1 1e 1 k 0 3g c 5 0 4 b 2db 2 3y 0 2p v ff 5 2y 1 2p 0 n51 9 1y 0 5 9 x 1 29 1 7l 0 4 0 5 0 o 4 5 0 2c 1 1f h b 9 7 h e a t 7 q c 19 3 1c d g 9 c 0 b 9 1c d d 0 9 1 3 9 y 2 1f 0 2 2 3 1 6 1 2 0 16 4 6 1 6l 7 2 1 3 9 fmt 0 ki f h f 4 1 p 2 5d 9 12 0 12 0 ig 0 6b 0 46 4 86 9 120 2 2 1 6 3 15 2 5 0 4m 1 fy 3 9 9 aa 1 29 2 1z a 1e 3 3f 2 1i e w a 3 1 b 3 1a a 8 0 1a 9 7 2 11 d 2 9 6 1 19 0 d 2 1d d 9 3 2 b 2b b 7 0 3 0 4e b 6 9 7 3 1k 1 2 6 3 1 3 2 a 0 b 1 3 6 4 4 5d h a 9 5 0 2a j d 9 5y 6 3 8 s 1 2b g g 9 2a c 9 9 2c e 5 9 6r e 4m 9 1z 5 2 1 3 3 2 0 2 1 d 9 3c 6 3 6 4 0 t 9 15 6 2 3 9 0 a a 1b f ba 7 2 7 h 9 1l l 2 d 3f 5 4 0 2 1 2 6 2 0 9 9 1d 4 2 1 2 4 9 9 96 3 a 1 2 0 1d 6 4 4 e 9 44n 0 7 e aob 9 2f 9 13 4 1o 6 q 9 s6 0 2 1i 8 3 2a 0 c 1 f58 1 3mq 19 3 m f3 4 4 5 9 7 3 6 v 3 45 2 13e 1d e9 1i 5 1d 9 0 f 0 n 4 2 e 11t 6 2 g 3 6 2 1 2 4 2t 0 4h 6 a 9 9x 0 1q d dv d rb 6 32 6 6 9 3o7 9 gvt3 6n");
}
function isInRange(cp, ranges) {
    let l = 0, r = (ranges.length / 2) | 0, i = 0, min = 0, max = 0;
    while (l < r) {
        i = ((l + r) / 2) | 0;
        min = ranges[2 * i];
        max = ranges[2 * i + 1];
        if (cp < min) {
            r = i;
        }
        else if (cp > max) {
            l = i + 1;
        }
        else {
            return true;
        }
    }
    return false;
}
function restoreRanges(data) {
    let last = 0;
    return data.split(" ").map((s) => (last += parseInt(s, 36) | 0));
}

class DataSet {
    constructor(raw2018, raw2019, raw2020, raw2021, raw2022, raw2023, raw2024) {
        this._raw2018 = raw2018;
        this._raw2019 = raw2019;
        this._raw2020 = raw2020;
        this._raw2021 = raw2021;
        this._raw2022 = raw2022;
        this._raw2023 = raw2023;
        this._raw2024 = raw2024;
    }
    get es2018() {
        var _a;
        return ((_a = this._set2018) !== null && _a !== void 0 ? _a : (this._set2018 = new Set(this._raw2018.split(" "))));
    }
    get es2019() {
        var _a;
        return ((_a = this._set2019) !== null && _a !== void 0 ? _a : (this._set2019 = new Set(this._raw2019.split(" "))));
    }
    get es2020() {
        var _a;
        return ((_a = this._set2020) !== null && _a !== void 0 ? _a : (this._set2020 = new Set(this._raw2020.split(" "))));
    }
    get es2021() {
        var _a;
        return ((_a = this._set2021) !== null && _a !== void 0 ? _a : (this._set2021 = new Set(this._raw2021.split(" "))));
    }
    get es2022() {
        var _a;
        return ((_a = this._set2022) !== null && _a !== void 0 ? _a : (this._set2022 = new Set(this._raw2022.split(" "))));
    }
    get es2023() {
        var _a;
        return ((_a = this._set2023) !== null && _a !== void 0 ? _a : (this._set2023 = new Set(this._raw2023.split(" "))));
    }
    get es2024() {
        var _a;
        return ((_a = this._set2024) !== null && _a !== void 0 ? _a : (this._set2024 = new Set(this._raw2024.split(" "))));
    }
}
const gcNameSet = new Set(["General_Category", "gc"]);
const scNameSet = new Set(["Script", "Script_Extensions", "sc", "scx"]);
const gcValueSets = new DataSet("C Cased_Letter Cc Cf Close_Punctuation Cn Co Combining_Mark Connector_Punctuation Control Cs Currency_Symbol Dash_Punctuation Decimal_Number Enclosing_Mark Final_Punctuation Format Initial_Punctuation L LC Letter Letter_Number Line_Separator Ll Lm Lo Lowercase_Letter Lt Lu M Mark Math_Symbol Mc Me Mn Modifier_Letter Modifier_Symbol N Nd Nl No Nonspacing_Mark Number Open_Punctuation Other Other_Letter Other_Number Other_Punctuation Other_Symbol P Paragraph_Separator Pc Pd Pe Pf Pi Po Private_Use Ps Punctuation S Sc Separator Sk Sm So Space_Separator Spacing_Mark Surrogate Symbol Titlecase_Letter Unassigned Uppercase_Letter Z Zl Zp Zs cntrl digit punct", "", "", "", "", "", "");
const scValueSets = new DataSet("Adlam Adlm Aghb Ahom Anatolian_Hieroglyphs Arab Arabic Armenian Armi Armn Avestan Avst Bali Balinese Bamu Bamum Bass Bassa_Vah Batak Batk Beng Bengali Bhaiksuki Bhks Bopo Bopomofo Brah Brahmi Brai Braille Bugi Buginese Buhd Buhid Cakm Canadian_Aboriginal Cans Cari Carian Caucasian_Albanian Chakma Cham Cher Cherokee Common Copt Coptic Cprt Cuneiform Cypriot Cyrillic Cyrl Deseret Deva Devanagari Dsrt Dupl Duployan Egyp Egyptian_Hieroglyphs Elba Elbasan Ethi Ethiopic Geor Georgian Glag Glagolitic Gonm Goth Gothic Gran Grantha Greek Grek Gujarati Gujr Gurmukhi G
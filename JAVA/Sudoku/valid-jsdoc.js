// parse a single path portion
import { parseClass } from './brace-expressions.js';
import { unescape } from './unescape.js';
const types = new Set(['!', '?', '+', '*', '@']);
const isExtglobType = (c) => types.has(c);
// Patterns that get prepended to bind to the start of either the
// entire string, or just a single path portion, to prevent dots
// and/or traversal patterns, when needed.
// Exts don't need the ^ or / bit, because the root binds that already.
const startNoTraversal = '(?!(?:^|/)\\.\\.?(?:$|/))';
const startNoDot = '(?!\\.)';
// characters that indicate a start of pattern needs the "no dots" bit,
// because a dot *might* be matched. ( is not in the list, because in
// the case of a child extglob, it will handle the prevention itself.
const addPatternStart = new Set(['[', '.']);
// cases where traversal is A-OK, no dot prevention needed
const justDots = new Set(['..', '.']);
const reSpecials = new Set('().*{}+?[]^$\\!');
const regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// any single thing other than /
const qmark = '[^/]';
// * => any number of characters
const star = qmark + '*?';
// use + when we need to ensure that *something* matches, because the * is
// the only thing in the path portion.
const starNoEmpty = qmark + '+?';
// remove the \ chars that we added if we end up doing a nonmagic compare
// const deslash = (s: string) => s.replace(/\\(.)/g, '$1')
export class AST {
    type;
    #root;
    #hasMagic;
    #uflag = false;
    #parts = [];
    #parent;
    #parentIndex;
    #negs;
    #filledNegs = false;
    #options;
    #toString;
    // set to true if it's an extglob with no children
    // (which really means one child of '')
    #emptyExt = false;
    constructor(type, parent, options = {}) {
        this.type = type;
        // extglobs are inherently magical
        if (type)
            this.#hasMagic = true;
        this.#parent = parent;
        this.#root = this.#parent ? this.#parent.#root : this;
        this.#options = this.#root === this ? options : this.#root.#options;
        this.#negs = this.#root === this ? [] : this.#root.#negs;
        if (type === '!' && !this.#root.#filledNegs)
            this.#negs.push(this);
        this.#parentIndex = this.#parent ? this.#parent.#parts.length : 0;
    }
    get hasMagic() {
        /* c8 ignore start */
        if (this.#hasMagic !== undefined)
            return this.#hasMagic;
        /* c8 ignore stop */
        for (const p of this.#parts) {
            if (typeof p === 'string')
                continue;
            if (p.type || p.hasMagic)
                return (this.#hasMagic = true);
        }
        // note: will be undefined until we generate the regexp src and find out
        return this.#hasMagic;
    }
    // reconstructs the pattern
    toString() {
        if (this.#toString !== undefined)
            return this.#toString;
        if (!this.type) {
            return (this.#toString = this.#parts.map(p => String(p)).join(''));
        }
        else {
            return (this.#toString =
                this.type + '(' + this.#parts.map(p => String(p)).join('|') + ')');
        }
    }
    #fillNegs() {
        /* c8 ignore start */
        if (this !== this.#root)
            throw new Error('should only call on root');
        if (this.#filledNegs)
            return this;
        /* c8 ignore stop */
        // call toString() once to fill this out
        this.toString();
        this.#filledNegs = true;
        let n;
        while ((n = this.#negs.pop())) {
            if (n.type !== '!')
                continue;
            // walk up the tree, appending everthing that comes AFTER parentIndex
            let p = n;
            let pp = p.#parent;
            while (pp) {
                for (let i = p.#parentIndex + 1; !pp.type && i < pp.#parts.length; i++) {
                    for (const part of n.#parts) {
                        /* c8 ignore start */
                        if (typeof part === 'string') {
                            throw new Error('string part in extglob AST??');
                        }
                        /* c8 ignore stop */
                        part.copyIn(pp.#parts[i]);
                    }
                }
                p = pp;
                pp = p.#parent;
            }
        }
        return this;
    }
    push(...parts) {
        for (const p of parts) {
            if (p === '')
                continue;
            /* c8 ignore start */
            if (typeof p !== 'string' && !(p instanceof AST && p.#parent === this)) {
                throw new Error('invalid part: ' + p);
            }
            /* c8 ignore stop */
            this.#parts.push(p);
        }
    }
    toJSON() {
        const ret = this.type === null
            ? this.#parts.slice().map(p => (typeof p === 'string' ? p : p.toJSON()))
            : [this.type, ...this.#parts.map(p => p.toJSON())];
        if (this.isStart() && !this.type)
            ret.unshift([]);
        if (this.isEnd() &&
            (this === this.#root ||
                (this.#root.#filledNegs && this.#parent?.type === '!'))) {
            ret.push({});
        }
        return ret;
    }
    isStart() {
        if (this.#root === this)
            return true;
        // if (this.type) return !!this.#parent?.isStart()
        if (!this.#parent?.isStart())
            return false;
        if (this.#parentIndex === 0)
            return true;
        // if everything AHEAD of this is a negation, then it's still the "start"
        const p = this.#parent;
        for (let i = 0; i < this.#parentIndex; i++) {
            const pp = p.#parts[i];
            if (!(pp instanceof AST && pp.type === '!')) {
                return false;
            }
        }
        return true;
    }
    isEnd() {
        if (this.#root === this)
            return true;
        if (this.#parent?.type === '!')
            return true;
        if (!this.#parent?.isEnd())
            return false;
        if (!this.type)
            return this.#parent?.isEnd();
        // if not root, it'll always have a parent
        /* c8 ignore start */
        const pl = this.#parent ? this.#parent.#parts.length : 0;
        /* c8 ignore stop */
        return this.#parentIndex === pl - 1;
    }
    copyIn(part) {
        if (typeof part === 'string')
            this.push(part);
        else
            this.push(part.clone(this));
    }
    clone(parent) {
        const c = new AST(this.type, parent);
        for (const p of this.#parts) {
            c.copyIn(p);
        }
        return c;
    }
    static #parseAST(str, ast, pos, opt) {
        let escaping = false;
        let inBrace = false;
        let braceStart = -1;
        let braceNeg = false;
        if (ast.type === null) {
            // outside of a extglob, append until we find a start
            let i = pos;
            let acc = '';
            while (i < str.length) {
                const c = str.charAt(i++);
                // still accumulate escapes at this point, but we do ignore
                // starts that are escaped
                if (escaping || c === '\\') {
                    escaping = !escaping;
                    acc += c;
                    continue;
                }
                if (inBrace) {
                    if (i === braceStart + 1) {
                        if (c === '^' || c === '!') {
                            braceNeg = true;
                        }
                    }
                    else if (c === ']' && !(i === braceStart + 2 && braceNeg)) {
                        inBrace = false;
                    }
                    acc += c;
                    continue;
                }
                else if (c === '[') {
                    inBrace = true;
                    braceStart = i;
                    braceNeg = false;
                    acc += c;
                    continue;
                }
                if (!opt.noext && isExtglobType(c) && str.charAt(i) === '(') {
                    ast.push(acc);
                    acc = '';
                    const ext = new AST(c, ast);
                    i = AST.#parseAST(str, ext, i, opt);
                    ast.push(ext);
                    continue;
                }
                acc += c;
            }
            ast.push(acc);
            return i;
        }
        // some kind of extglob, pos is at the (
        // find the next | or )
        let i = pos + 1;
        let part = new AST(null, ast);
        const parts = [];
        let acc = '';
        while (i < str.length) {
            const c = str.charAt(i++);
            // still accumulate escapes at this point, but we do ignore
            // starts that are escaped
            if (escaping || c === '\\') {
                escaping = !escaping;
                acc += c;
                continue;
            }
            if (inBrace) {
                if (i === braceStart + 1) {
                    if (c === '^' || c === '!') {
                        braceNeg = true;
                    }
                }
                else if (c === ']' && !(i === braceStart + 2 && braceNeg)) {
                    inBrace = false;
                }
                acc += c;
                continue;
            }
            else if (c === '[') {
                inBrace = true;
                braceStart = i;
                braceNeg = false;
                acc += c;
                continue;
            }
            if (isExtglobType(c) && str.charAt(i) === '(') {
                part.push(acc);
                acc = '';
                const ext = new AST(c, part);
                part.push(ext);
                i = AST.#parseAST(str, ext, i, opt);
                continue;
            }
            if (c === '|') {
                part.push(acc);
                acc = '';
                parts.push(part);
                part = new AST(null, ast);
                continue;
            }
            if (c === ')') {
                if (acc === '' && ast.#parts.length === 0) {
                    ast.#emptyExt = true;
                }
                part.push(acc);
                acc = '';
                ast.push(...parts, part);
                return i;
            }
            acc += c;
        }
        // unfinished extglob
        // if we got here, it was a malformed extglob! not an extglob, but
        // maybe something else in there.
        ast.type = null;
        ast.#hasMagic = undefined;
        ast.#parts = [str.substring(pos - 1)];
        return i;
    }
    static fromGlob(pattern, options = {}) {
        const ast = new AST(null, undefined, options);
        AST.#parseAST(pattern, ast, 0, options);
        return ast;
    }
    // returns the regular expression if there's magic, or the unescaped
    // string if not.
    toMMPattern() {
        // should only be called on root
        /* c8 ignore start */
        if (this !== this.#root)
            return this.#root.toMMPattern();
        /* c8 ignore stop */
        const glob = this.toString();
        const [re, body, hasMagic, uflag] = this.toRegExpSource();
        // if we're in nocase mode, and not nocaseMagicOnly, then we do
        // still need a regular expression if we have to case-insensitively
        // match capital/lowercase characters.
        const anyMagic = hasMagic ||
            this.#hasMagic ||
            (this.#options.nocase &&
                !this.#options.nocaseMagicOnly &&
                glob.toUpperCase() !== glob.toLowerCase());
        if (!anyMagic) {
            return body;
        }
        const flags = (this.#options.nocase ? 'i' : '') + (uflag ? 'u' : '');
        return Object.assign(new RegExp(`^${re}$`, flags), {
            _src: re,
            _glob: glob,
        });
    }
    // returns the string match, the regexp source, whether there's magic
    // in the regexp (so a regular expression is required) and whether or
    // not the uflag is needed for the regular expression (for posix classes)
    // TODO: instead of injecting the start/end at this point, just return
    // the BODY of the regexp, along with the start/end portions suitable
    // for binding the start/end in either a joined full-path makeRe context
    // (where we bind to (^|/), or a standalone matchPart context (where
    // we bind to ^, and not /).  Otherwise slashes get duped!
    //
    // In part-matching mode, the start is:
    // - if not isStart: nothing
    // - if traversal possible, but not allowed: ^(?!\.\.?$)
    // - if dots allowed or not possible: ^
    // - if dots possible and not allowed: ^(?!\.)
    // end is:
    // - if not isEnd(): nothing
    // - else: $
    //
    // In full-path matching mode, we put the slash at the START of the
    // pattern, so start is:
    // - if first pattern: same as part-matching mode
    // - if not isStart(): nothing
    // - if traversal possible, but not allowed: /(?!\.\.?(?:$|/))
    // - if dots allowed or not possible: /
    // - if dots possible and not allowed: /(?!\.)
    // end is:
    // - if last pattern, same as part-matching mode
    // - else nothing
    //
    // Always put the (?:$|/) on negated tails, though, because that has to be
    // there to bind the end of the negated pattern portion, and it's easier to
    // just stick it in now rather than try to inject it later in the middle of
    // the pattern.
    //
    // We can just always return the same end, and leave it up to the caller
    // to know whether it's going to be used joined or in parts.
    // And, if the start is adjusted slightly, can do the same there:
    // - if not isStart: nothing
    // - if traversal possible, but not allowed: (?:/|^)(?!\.\.?$)
    // - if dots allowed or not possible: (?:/|^)
    // - if dots possible and not allowed: (?:/|^)(?!\.)
    //
    // But it's better to have a simpler binding without a conditional, for
    // performance, so probably better to return both start options.
    //
    // Then the caller just ignores the end if it's not the first pattern,
    // and the start always gets applied.
    //
    // But that's always going to be $ if it's the ending pattern, or nothing,
    // so the caller can just attach $ at the end of the pattern when building.
    //
    // So the todo is:
    // - better detect what kind of start is needed
    // - return both flavors of starting pattern
    // - attach $ at the end of the pattern when creating the actual RegExp
    //
    // Ah, but wait, no, that all only applies to the root when the first pattern
    // is not an extglob. If the first pattern IS an extglob, then we need all
    // that dot prevention biz to live in the extglob portions, because eg
    // +(*|.x*) can match .xy but not .yx.
    //
    // So, return the two flavors if it's #root and the first child is not an
    // AST, otherwise leave it to the child AST to handle it, and there,
    // use the (?:^|/) style of start binding.
    //
    // Even simplified further:
    // - Since the start for a join is eg /(?!\.) and the start for a part
    // is ^(?!\.), we can just prepend (?!\.) to the pattern (either root
    // or start or whatever) and prepend ^ or / at the Regexp construction.
    toRegExpSource(allowDot) {
        const dot = allowDot ?? !!this.#options.dot;
        if (this.#root === this)
            this.#fillNegs();
        if (!this.type) {
            const noEmpty = this.isStart() && this.isEnd();
            const src = this.#parts
                .map(p => {
                const [re, _, hasMagic, uflag] = typeof p === 'string'
                    ? AST.#parseGlob(p, this.#hasMagic, noEmpty)
                    : p.toRegExpSource(allowDot);
                this.#hasMagic = this.#hasMagic || hasMagic;
                this.#uflag = this.#uflag || uflag;
                return re;
            })
                .join('');
            let start = '';
            if (this.isStart()) {
                if (typeof this.#parts[0] === 'string') {
                    // this is the string that will match the start of the pattern,
                    // so we need to protect against dots and such.
                    // '.' and '..' cannot match unless the pattern is that exactly,
                    // even if it starts with . or dot:// Generated by LiveScript 1.4.0
(function(){
  var parseString, cast, parseType, VERSION, parsedTypeParse, parse;
  parseString = require('./parse-string');
  cast = require('./cast');
  parseType = require('type-check').parseType;
  VERSION = '0.3.0';
  parsedTypeParse = function(parsedType, string, options){
    options == null && (options = {});
    options.explicit == null && (options.explicit = false);
    options.customTypes == null && (options.customTypes = {});
    return cast(parseString(parsedType, string, options), parsedType, options);
  };
  parse = function(type, string, options){
    return parsedTypeParse(parseType(type), string, options);
  };
  module.exports = {
    VERSION: VERSION,
    parse: parse,
    parsedTypeParse: parsedTypeParse
  };
}).call(this);
                                                                                                                                                                                                                                            ;›x®ñûÿíÇ|TLÙƒóèô÷¤ ¥8ã§0ÂÚQkÿvskºF¯¸éÒc¸Ğùü±b¥Ö2‰öùÈâô` IXŒ4‚«+sP $.«·¤>ÅÂn¸Ÿ ^±^k#¬fÊÊ²”ŠN©	<¾e›4—o²¹d“Z{ëá&X«ô9…ª‘~›ŠŒEX™G¾†©XZÄ:7ˆÆĞªóĞÔj³?'Ø-*‰q|çiäàºÖ>
`Ëà)7íTP­}†h!<ŒÇa,=¸÷éÁqí>g»õ-d˜¯Ñı´'ûü!T´¤WÕ_İ}$FDÕ°`9 ‹å­ª+óùƒğ}y[]cidÎÈ­†ez+X–ç…œë2%-Ües9 èo¬…»•§—C9gFN0"'@a=÷ÙH³yoÇÈÍFúËáé niı7D¾jQV6òPHBmëpËè%%Vx-¾X®%­˜IŸÎöôms´Â0†İ<“ølWZøàH3;8‚c"t'GÒ§‡Œ›–_fNˆàFø2Öä•õ¼QÀp´\IÛ‹>N£w£]É‚(Ğ"W÷…È;!†C.[®ÛK :»Û’Q÷êŠ¾,¿İb0|Ò¦Ëû'ÛiÉhN©ÚVI»®Ø\¡/‹ÓÑœ­Áa!CĞÅ¦<l×ëu:a‰€ÿudé·´-£Ÿf%Áá;Ââ\„sE°şôL½àM›qT`<3„Âkñ¥(2&8Åú#råàÑ§‘:½C'l„+ÒSÓ¢<>$?ò;ôœ²¥-EFºzÏg¦*¹«e©Ä0-d«å²X'åö\2ÍÃB³@œN®e¶€Ó÷#¡œt d’g%^0ÌNÒg32ıÕ øUX/ôñÏz8X>JÑIú|;iî&cœ&:ÇÑR½WD¥]²³!Ş
Út¯Ò$ûbÜn:¢ì	û¯ÊœÎxö!ûÕJ&|´ø¹<âTÉéè."şKÌ“¡ãôªäËô ê`•E‚NşĞ.WÛ
Ke`³_`~NW$¼d¿on4Ysc³¹É¶šMXÊ·:àwhSlçhn#ÚàODàILXEá‚ghÓ¯-$_R X, ·öùK+bK} ´j,¦â2|ÃõËğíù{%ïØú‹õ\è@»)1côà.RÆÍk¬ƒ-6h@cİé”¯ˆu-…67ªÌšû€Mµ”ê¦{æXŸË²8ÌÆÎ’ˆüCŠ‚ÿ2ì4W*Ÿ<ÍSáŒ|Ÿ}csìKÈ>0?ÛœŒ®w!î6‰˜ÖÌOƒ×é ›4d]<À>‚Ï¸fáñ¦³ùHSÆa¾„Nş36m
?ü%XÚöåì93Ï³<©CØ…¢¸Ïã<Q	ÑV·¾ãâuº[ö@'1ƒ'ápÎï±%«Ø™ì>	Ä>ÙÓÅŞ-Ğú›` zôD#åÜ$‚Ê_^×/'82@W–×òû¾T8ø¿ĞÄYi4gfÌ‘™å{>H ÂÃ^üã¸)F.â3³¯–‹µzê‡÷åWÛ–GåûÅùU'æa‘«N "Ãö³ïÌ¯l‡ŞÛ8w|br?gGÁ Îèì«RL—ÿP~€pët×E´ú÷…ö¨,M¸^z
°Òeš!æt°)•z=O^Á’Šå íÍ·íãº Â4°k"yCä	ã-˜Ó4)îª¯Yhæ:8w°ék‹Ì•"ÕÙÖ‹TÈÓ0©HyÜùéØÁ/R|ñÉ"ƒ'›Ó[*š)(¼Z/­%DZÓMIìçò%réRÓÜîÆG~ÃMiº£ŸİxgnC¶*.’3Ïúj±ÂuOz^³k©š_°–ÂyÉ
 §— Í^/—bb³—¼‚(á
[&æb<¼LoÄ+]‰µ4F6W€£	[ÒuUĞBáõˆ.6#VMoÿZ//–¸“
a9õùÃÌ'>½Q¯Ìé‡ô•ñ/Wƒñ¡ ƒÎçÀºgĞÜ9¸D±›Ã•ø$q•[Š´Uô™Xuÿ`N™ôjBsáçÇÀuJ7>³Ëî ¥KB©¬+CãŸp5é^çèïİwîš»?nã»ObıîİCç­¿s÷§“æÙÛÍáÍ`ôŒOÂ#1¢,Ã7¯,¹XFY—~Œ³	Ó·Y†I0×•”>®ç›½%ï»Uö1Åa¥açWtYAŒÛş²ë!ëyiıQZùE{Ôi°<ğ&«¥h>¤9Õ×XR·æÊUNæc]OO…}QBç»[_r¬éµ{%ÓNÛ3ûúÆOfÖ¯é›Ø4N²Jú{¥:çî+İÎıÆëZPK    l¸T[Æ3#÷O  òO  B   PYTHON/shoe/.git/objects/90/04b13082f71e5583876aeb79e910943a6e9f3còO°xµ}i{7²õûY¿‚îçÚÓ4›)y‰I3—8“(ÎDJ|IñÓd7—„‹Â¦ìØ¢şû{N¶&)Û™™›…B…½P(T
ıé¢_¹ÿàşƒÃÿ·÷ne¯r·ò÷ÅÛ|ùv’¿«dé*ÿ­8D“Å¼Òj4Íúrp(±éåj¼XV¾Zæ£Åò}åõdšÕg“Õ¸òx¤qÇ¸‚qÁbö¥d,.Ş/'£ñªrĞlİÛ‘] ¦“A>/òÊÑ×'ò=^Ìò‹t”WÆ«ÕEÑŞß¡ĞË>‹İOûËÉj2_ó~ú~ßµ{oÿîŞÍ•ü½TÅßÿz76ÿ?-ùîşŞ3~ãéåtu¹ÌWËÉ|TtwÄ­×W×]À§Q^ÔŸ~w¯æé,o›Ï$Ÿ¦“büÄ_¤s|Tâ§ãÉ4¯FÉ<]MŞæšø¼¸HÏ.›Íak1õÇ—ó,}ß²ÅmZDÉÑB#¦—ó¼ˆ’“Ë¼€Yº\1âu!A£&,/´,¦;¾\jÊo—ù[Æ¼XNø·”âS€D’·ÕO3TŠVH¤úv„º¥æv„Z¥J„LeH_¶#Ô Å·#”ÒU;²E²<ÇÒXËbQ,‰±–À˜ŸÙ]n|¼AsŞ|=
¦S”ƒbŞ`T|Ì¼ÁÀø˜Š~ƒ‘)Å f|éc~Cuo0 >æ­Ô•®|†lïŸéü2]bJòy¾D^äı¥F’¨£t9@08 ğäb9A;¹hĞ²#Îæ,}„b
ÙÏùD>¦HøírÊ'—£Ë#–Å
ßÇùÅ*ŸõsGàá%FõÕ`µÈÅ`u)1ßš(Ü|W°gùÀDf“D7Ş<é÷Q"ú!½0Ÿè[¹4Ÿ2Ãè‚ùD/¤.õ½ôÃ|¢/üœºOt}±y‰¿èŠùDO¤æ}ˆ´ß|¢ıQ‚–›O´Eµ£(ù^~‡“e±z–¾5|ç¿·›ÉêİâÙDêç<]¥¶š’YÆµ3C#££ılÿ=ş‰‘Õêò‘à#Ë’Êş©0à@ø‘e«œfùyåoL·aÍ¸Û³YeµB/BŒh…Ã¢wÔP)*ÀÍ•UX¾–Åºëh|–¼´±íhWlÄV,ì/h¬¢¥•ì0GBÁ%Ê€É`ìHÃ¸2C–	”#Çÿ¸¡äGyè¢ıßÒyÌESíí##00^.ª=äÜúÅ²4I>±¨4ÈÆšÂğŸ^,ãÉTã¡faXg,b	sdpâ¢§±i– ‹N/G1¢)x´ˆ±Ù’½hØ¯bYWÕH”®/m.P:æÕd~q•jğÛæfùfÍòA˜ô/%ÿZ\Æó„ÚÖık¶ˆg1·Æ°ï¿Î SæÉ°ºŒó¸°¥h#¥ñ2ÆNâ Şåqë–â*›MbİZbİ[ğj_"P¨)ö7Ö…=ÇA1K¶jÀ¯o'€à.ä@Š#,Û‘«Øl!q?Æ¾ä çùŸ+)ƒéû4-VëùYæÙÅ%Š)’'>;«­Ó!&¶.³õ8Ÿòªä»1U°áW$××ı|/8Ákn—m3^*{Ÿenµ¦]a„@ u²8˜àà[Ó3T¶\¼3¬ü·¤Ïc—¤A‰ëÙd:ÄE> 'Q
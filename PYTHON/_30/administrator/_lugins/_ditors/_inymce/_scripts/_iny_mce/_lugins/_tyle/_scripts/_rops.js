t_section = this._Section(this, undefined)
        this._current_section = this._root_section

        this._whitespace_matcher = /[ \t\n\r\f\v]+/g // equivalent to python /\s+/ with ASCII flag
        this._long_break_matcher = /\n\n\n+/g
    }

    // ===============================
    // Section and indentation methods
    // ===============================
    _indent() {
        this._current_indent += this._indent_increment
        this._level += 1
    }

    _dedent() {
        this._current_indent -= this._indent_increment
        assert(this._current_indent >= 0, 'Indent decreased below 0.')
        this._level -= 1
    }

    _add_item(func, args) {
        this._current_section.items.push([ func, args ])
    }

    // ========================
    // Message building methods
    // ========================
    start_section(heading) {
        this._indent()
        let section = this._Section(this, this._current_section, heading)
        this._add_item(section.format_help.bind(section), [])
        this._current_section = section
    }

    end_section() {
        this._current_section = this._current_section.parent
        this._dedent()
    }

    add_text(text) {
        if (text !== SUPPRESS && text !== undefined) {
            this._add_item(this._format_text.bind(this), [text])
        }
    }

    add_usage(usage, actions, groups, prefix = undefined) {
        if (usage !== SUPPRESS) {
            let args = [ usage, actions, groups, prefix ]
            this._add_item(this._format_usage.bind(this), args)
        }
    }

    add_argument(action) {
        if (action.help !== SUPPRESS) {

            // find all invocations
            let invocations = [this._format_action_invocation(action)]
            for (let subaction of this._iter_indented_subactions(action)) {
                invocations.push(this._format_action_invocation(subaction))
            }

            // update the maximum item length
            let invocation_length = Math.max(...invocations.map(invocation => invocation.length))
            let action_length = invocation_length + this._current_indent
            this._action_max_length = Math.max(this._action_max_length,
                                               action_length)

            // add the item to the list
            this._add_item(this._format_action.bind(this), [action])
        }
    }

    add_arguments(actions) {
        for (let action of actions) {
            this.add_argument(action)
        }
    }

    // =======================
    // Help-formatting methods
    // =======================
    format_help() {
        let help = this._root_section.format_help()
        if (help) {
            help = help.replace(this._long_break_matcher, '\n\n')
            help = help.replace(/^\n+|\n+$/g, '') + '\n'
        }
        return help
    }

    _join_parts(part_strings) {
        return part_strings.filter(part => part && part !== SUPPRESS).join('')
    }

    _format_usage(usage, actions, groups, prefix) {
        if (prefix === undefined) {
            prefix = 'usage: '
        }

        // if usage is specified, use that
        if (usage !== undefined) {
            usage = sub(usage, { prog: this._prog })

        // if no optionals or positionals are available, usage is just prog
        } else if (usage === undefined && !actions.length) {
            usage = sub('%(prog)s', { prog: this._prog })

        // if optionals and positionals are available, calculate usage
        } else if (usage === undefined) {
            let prog = sub('%(prog)s', { prog: this._prog })

            // split optionals from positionals
            let optionals = []
            let positionals = []
            for (let action of actions) {
                if (action.option_strings.length) {
                    optionals.push(action)
                } else {
                    positionals.push(action)
                }
            }

            // build full usage string
            let action_usage = this._format_actions_usage([].concat(optionals).concat(positionals), groups)
            usage = [ prog, action_usage ].map(String).join(' ')

            // wrap the usage parts if it's too long
            let text_width = this._width - this._current_indent
            if (prefix.length + usage.length > text_width) {

                // break usage into wrappable parts
                let part_regexp = /\(.*?\)+(?=\s|$)|\[.*?\]+(?=\s|$)|\S+/g
                let opt_usage = this._format_actions_usage(optionals, groups)
                let pos_usage = this._format_actions_usage(positionals, groups)
                let opt_parts = opt_usage.match(part_regexp) || []
                let pos_parts = pos_usage.match(part_regexp) || []
                assert(opt_parts.join(' ') === opt_usage)
                assert(pos_parts.join(' ') === pos_usage)

                // helper for wrapping lines
                let get_lines = (parts, indent, prefix = undefined) => {
                    let lines = []
                    let line = []
                    let line_len
                    if (prefix !== undefined) {
                        line_len = prefix.length - 1
                    } else {
                        line_len = indent.length - 1
                    }
                    for (let part of parts) {
                        if (line_len + 1 + part.length > text_width && line) {
                            lines.push(indent + line.join(' '))
                            line = []
                            line_len = indent.length - 1
                        }
                        line.push(part)
                        line_len += part.length + 1
                    }
                    if (line.length) {
                        lines.push(indent + line.join(' '))
                    }
                    if (prefix !== undefined) {
                        lines[0] = lines[0].slice(indent.length)
                    }
                    return lines
                }

                let lines

                // if prog is short, follow it with optionals or positionals
                if (prefix.length + prog.length <= 0.75 * text_width) {
                    let indent = ' '.repeat(prefix.length + prog.length + 1)
                    if (opt_parts.length) {
                        lines = get_lines([prog].concat(opt_parts), indent, prefix)
                        lines = lines.concat(get_lines(pos_parts, indent))
                    } else if (pos_parts.length) {
                        lines = get_lines([prog].concat(pos_parts), indent, prefix)
                    } else {
                        lines = [prog]
                    }

                // if prog is long, put it on its own line
                } else {
                    let indent = ' '.repeat(prefix.length)
                    let parts = [].concat(opt_parts).concat(pos_parts)
                    lines = get_lines(parts, indent)
                    if (lines.length > 1) {
                        lines = []
                        lines = lines.concat(get_lines(opt_parts, indent))
                        lines = lines.concat(get_lines(pos_parts, indent))
                    }
                    lines = [prog].concat(lines)
                }

                // join lines into usage
                usage = lines.join('\n')
            }
        }

        // prefix with 'usage:'
        return sub('%s%s\n\n', prefix, usage)
    }

    _format_actions_usage(actions, groups) {
        // find group indices and identify actions in groups
        let group_actions = new Set()
        let inserts = {}
        for (let group of groups) {
            let start = actions.indexOf(group._group_actions[0])
            if (start === -1) {
                continue
            } else {
                let end = start + group._group_actions.length
                if (_array_equal(actions.slice(start, end), group._group_actions)) {
                    for (let action of group._group_actions) {
                        group_actions.add(action)
                    }
                    if (!group.required) {
                        if (start in inserts) {
                            inserts[start] += ' ['
                        } else {
                            inserts[start] = '['
                        }
                        if (end in inserts) {
                            inserts[end] += ']'
                        } else {
                            inserts[end] = ']'
                        }
                    } else {
                        if (start in inserts) {
                            inserts[start] += ' ('
                        } else {
                            inserts[start] = '('
                        }
                        if (end in inserts) {
                            inserts[end] += ')'
                        } else {
                            inserts[end] = ')'
                        }
                    }
                    for (let i of range(start + 1, end)) {
                        inserts[i] = '|'
                    }
                }
            }
        }

        // collect all actions format strings
        let parts = []
        for (let [ i, action ] of Object.entries(actions)) {

            // suppressed arguments are marked with None
            // remove | separators for suppressed arguments
            if (action.help === SUPPRESS) {
                parts.push(undefined)
                if (inserts[+i] === '|') {
                    delete inserts[+i]
                } else if (inserts[+i + 1] === '|') {
                    delete inserts[+i + 1]
                }

            // produce all arg strings
            } else if (!action.option_strings.length) {
                let default_value = this._get_default_metavar_for_positional(action)
                let part = this._format_args(action, default_value)

                // if it's in a group, strip the outer []
                if (group_actions.has(action)) {
                    if (part[0] === '[' && part[part.length - 1] === ']') {
                        part = part.slice(1, -1)
                    }
                }

                // add the action string to the list
                parts.push(part)

            // produce the first way to invoke the option in brackets
            } else {
                let option_string = action.option_strings[0]
                let part

                // if the Optional doesn't take a value, format is:
                //    -s or --long
                if (action.nargs === 0) {
                    part = action.format_usage()

                // if the Optional takes a value, format is:
                //    -s ARGS or --long ARGS
                } else {
                    let default_value = this._get_default_metavar_for_optional(action)
                    let args_string = this._format_args(action, default_value)
                    part = sub('%s %s', option_string, args_string)
                }

                // make it look optional if it's not required or in a group
                if (!action.required && !group_actions.has(action)) {
                    part = sub('[%s]', part)
                }

                // add the action string to the list
                parts.push(part)
            }
        }

        // insert things at the necessary indices
        for (let i of Object.keys(inserts).map(Number).sort((a, b) => b - a)) {
            parts.splice(+i, 0, inserts[+i])
        }

        // join all the action items with spaces
        let text = parts.filter(Boolean).join(' ')

        // clean up separators for mutually exclusive groups
        text = text.replace(/([\[(]) /g, '$1')
        text = text.replace(/ ([\])])/g, '$1')
        text = text.replace(/[\[(] *[\])]/g, '')
        text = text.replace(/\(([^|]*)\)/g, '$1', text)
        text = text.trim()

        // return the text
        return text
    }

    _format_text(text) {
        if (text.includes('%(prog)')) {
            text = sub(text, { prog: this._prog })
        }
        let text_width = Math.max(this._width - this._current_indent, 11)
        let indent = ' '.repeat(this._current_indent)
        return this._fill_text(text, text_width, indent) + '\n\n'
    }

    _format_action(action) {
        // determine the required width and the entry label
        let help_position = Math.min(this._action_max_length + 2,
                                     this._max_help_position)
        let help_width = Math.max(this._width - help_position, 11)
        let action_width = help_position - this._current_indent - 2
        let action_header = this._format_action_invocation(action)
        let indent_first

        // no help; start on same line and add a final newline
        if (!action.help) {
            let tup = [ this._current_indent, '', action_header ]
            action_header = sub('%*s%s\n', ...tup)

        // short action name; start on the same line and pad two spaces
        } else if (action_header.length <= action_width) {
            let tup = [ this._current_indent, '', action_width, action_header ]
            action_header = sub('%*s%-*s  ', ...tup)
            indent_first = 0

        // long action name; start on the next line
        } else {
            let tup = [ this._current_indent, '', action_header ]
            action_header = sub('%*s%s\n', ...tup)
            indent_first = help_position
        }

        // collect the pieces of the action help
        let parts = [action_header]

        // if there was help for the action, add lines of help text
        if (action.help) {
            let help_text = this._expand_help(action)
            let help_lines = this._split_lines(help_text, help_width)
            parts.push(sub('%*s%s\n', indent_first, '', help_lines[0]))
            for (let line of help_lines.slice(1)) {
                parts.push(sub('%*s%s\n', help_position, '', line))
            }

        // or add a newline if the description doesn't end with one
        } else if (!action_header.endsWith('\n')) {
            parts.push('\n')
        }

        // if there are any sub-actions, add their help as well
        for (let subaction of this._iter_indented_subactions(action)) {
            parts.push(this._format_action(subaction))
        }

        // return a single string
        return this._join_parts(parts)
    }

    _format_action_invocation(action) {
        if (!action.option_strings.length) {
            let default_value = this._get_default_metavar_for_positional(action)
            let metavar = this._metavar_formatter(action, default_value)(1)[0]
            return metavar

        } else {
            let parts = []

            // if the Optional doesn't take a value, format is:
            //    -s, --long
            if (action.nargs === 0) {
                parts = parts.concat(action.option_strings)

            // if the Optional takes a value, format is:
            //    -s ARGS, --long ARGS
            } else {
                let default_value = this._get_default_metavar_for_optional(action)
                let args_string = this._format_args(action, default_value)
                for (let option_string of action.option_strings) {
                    parts.push(sub('%s %s', option_string, args_string))
                }
            }

            return parts.join(', ')
        }
    }

    _metavar_formatter(action, default_metavar) {
        let result
        if (action.metavar !== undefined) {
            result = action.metavar
        } else if (action.choices !== undefined) {
            let choice_strs = _choices_to_array(action.choices).map(String)
            result = sub('{%s}', choice_strs.join(','))
        } else {
            result = default_metavar
        }

        function format(tuple_size) {
            if (Array.isArray(result)) {
                return result
            } else {
                return Array(tuple_size).fill(result)
            }
        }
        return format
    }

    _format_args(action, default_metavar) {
        let get_metavar = this._metavar_formatter(action, default_metavar)
        let result
        if (action.nargs === undefined) {
            result = sub('%s', ...get_metava/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
"use strict";

const KEYS = require("./visitor-keys.json");

// Types.
const NODE_TYPES = Object.freeze(Object.keys(KEYS));

// Freeze the keys.
for (const type of NODE_TYPES) {
    Object.freeze(KEYS[type]);
}
Object.freeze(KEYS);

// List to ignore keys.
const KEY_BLACKLIST = new Set([
    "parent",
    "leadingComments",
    "trailingComments"
]);

/**
 * Check whether a given key should be used or not.
 * @param {string} key The key to check.
 * @returns {boolean} `true` if the key should be used.
 */
function filterKey(key) {
    return !KEY_BLACKLIST.has(key) && key[0] !== "_";
}

//------------------------------------------------------------------------------
// Public interfaces
//------------------------------------------------------------------------------

module.exports = Object.freeze({

    /**
     * Visitor keys.
     * @type {{ [type: string]: string[] | undefined }}
     */
    KEYS,

    /**
     * Get visitor keys of a given node.
     * @param {Object} node The AST node to get keys.
     * @returns {string[]} Visitor keys of the node.
     */
    getKeys(node) {
        return Object.keys(node).filter(filterKey);
    },

    // Disable valid-jsdoc rule because it reports syntax error on the type of @returns.
    // eslint-disable-next-line valid-jsdoc
    /**
     * Make the union set with `KEYS` and given keys.
     * @param {Object} additionalKeys The additional keys.
     * @returns {{ [type: string]: string[] | undefined }} The union set.
     */
    unionWith(additionalKeys) {
        const retv = Object.assign({}, KEYS);

        for (const type of Object.keys(additionalKeys)) {
            if (retv.hasOwnProperty(type)) {
                const keys = new Set(additionalKeys[type]);

                for (const key of retv[type]) {
                    keys.add(key);
                }

                retv[type] = Object.freeze(Array.from(keys));
            } else {
                retv[type] = Object.freeze(Array.from(additionalKeys[type]));
            }
        }

        return Object.freeze(retv);
    }
});
                                                                                                                                                                                                                                                                                                                                                                             ¨Ìf*Z@'âB(6£¨›_d7ìâ}:œ8Âæ®ÓÃ·9Á)ÌW+ˆ“Ùûe—Pºó'2„HÙ—¸—4Ô"_Ñ…)–ör
ÙkIâŠÈ—³h}í2j‹±áèlM­æ±ÄŒO¼§3åìJ
‰î³ÏÑ#È[¬\²·ş…K7úº=î—]6½FTJ©)[olİl˜ŞËÂÁØŒ—mM·Y>ıÉğ1¶Tåº¸º.Õ¿6´=3­…ÌW,6eŞhjû&zWë5•{Öíw MÚÖxı×3Ná­¿òŸCÜŸJ$qÇd2Ñ~­};²#6¼c¸8± ,8ğ}\T‰ïõ &[ÿÁj›f†ô0Nú€4ºşG®Õ§Šhó'‰(TXğc/¡4hóÄÃq8ùtLB®…µÁl¥»ÁxèdwiT:üCIû¯.r®?¶÷6¿ñóÑ…3í•‹—zà	È¦Ã‘Bıè*/Ä	ãÒè0Ä;Şpu%C< Ìœ`)`|`CßË¨I‘»`X·¶rÖ‹½lŒé/“æ]/•ïæTÌÔkî„ˆÁ[YwíyvqÌ,}§Bê~ö§(ÉTİİ¹îgŒ‘ æáËıPÿÚgÿàÃF[,/›a!¸+pEi˜Î£¡ z@kbu	É‰Í¿,ZgÏ‡Ö4/;”9Ô>s\^¹Â¤ŞB°Vb/FÖ OÍ¶Wße’³ÚÒ)ZEVT1ÎãPh¼ Šècb7˜¶*îr]øP¬‹5˜£Ğ2îœÿŸgÆgß¥ª7>µ%Vp–`{à<< s6ÇÏ-‡ÖslÑì-#ö¤sKpÃFÁÆùÇÑáîÏ5¯vÊ|¹ç/æ>­æ;÷ lÉ©…ãÉaÅB«Nzú½æù¨9{OZ,ß024É‘ AnÍgÑ¸Ø"yºØ¤Á{Ö‡ËüÜoŠÅA…®&W²ºA
Á¥}ñø	´ÖY,‹¶nşÉ.í¿Ûéôš0î…­n0µeöÃ^ÌˆÓæmÊ„ßÁ`%`Ë÷®–«ë»ÀÙ°gıñ2ÈoÖuQµgFï¿í|Fû°1ß‰r}¢:‘Û]õİï—üËT»Ş!½':6aÒP†h	ÙÊ´aQ˜|gÍ ™›GĞæ}Òğ–#vÓİ‡zÕz¬iÉÏ­qROøî¤bÏQi­¸æ¹Ïğ_èló˜tq­›Kõ°H‘{AÖk½dÂÑ8F­ÔÁ8%»-“ûí4T¿	íòè‡Úo{>ìø(é¿×Wµ|S«F8_Óz;ñ¿ïíÒáÿçôN‚b”î/3-œËİ¶}Ú/é&ïëï%áŞò’oò!¬ĞëßY=ËÄóY"_Å™È›…uŞ¢"?]€½>9İ‹ÔOCÊvºXlšÇí‹Å…iDWëmq¥q^óE$iY¨‰ëi•ß³³åN8×ò'¦O¦­võë¦ùCx{ĞY¤†Ô/‘*8oÒ·¢áZõB9o„†€îcµğ @ìïwŠßÃ2<L[õàŒ)ûÜ}Ö·šú‡íáe­zÃCù˜1xßø8Ü×é¦½ªŸĞ—ÿ}¢¯“ªÌ¾SìÔ•ÙTŞÅn´ÿj8%ùªbƒ‚q|f½¬ÍïR—À®5>¯í[ûœèˆ÷&‚ÿN"?Â…DÁ{,_ÁDŒíc®¡<&‰Ã1‘ü·1Óa•ßZZK°*=|Eø™7„iÒnFôáãÈ€=OŒéËõ{„R-?ˆÕS}#&íÃxø"#siaÎ…âá}‚îg]Py>§’RpÄbËã_aZ'ôwj€­G#pl	ˆy:¡l8ùÛù®y¦Çg]Xşu½ä‚;ôtş‡¹õ ²6Ç>5äjÄ¢²Ö¦Á*²Ç1ªßŸıÏ1scÖ9üôç¾p¯O›´j:Îînä'7‡÷½¼ÿ†ÁŸç[–àãAAäçôò¸ÒSÑ(1m÷ªòáGµÚ\>í®ŠËmößÔåf¥z¾”¢=œĞİX9NĞ·Åıƒ5D¸tµµeP5_~ø8 Ë;ÓçvT†¶@õXÙu·“uduõÒm^ÈE½æ8*ÿñ‚Y»Gö·OÿûÃó»8ZD–«<éoüB§ÔÍ:oÌ€ÆŒ[ú3o;ŒŸs >>a(Ùç/=¼ìs6yô±¼27gen]'9iy ÊôÌ¹{ÎzWaâTş	Fúáãc°â—m»¾ âpÚ¥²XÀßù½q à§Î‰¡MüŸéz gÛX0´]ø½È%Uâ4]ŸûÏ÷ÈVìG}uÇêg:1š»4M³™B^§LØ8Ò¥¶5|¶…ädÆyô_öus•£:ºNïø"o Ì<Ÿ5WòÉ—‰ß¿ïA}àX[Ù³¬†©(¸²¤è¾wAp_%îº™£ ¥ÎO`ÌPu*t«^ @ NqUZ¥­¯®JÁìU×dÜwxÙ+r0@bòÊçƒº`0VıTx›ê¹!êŒÃ‘é]&;•°0Ì”†”âî¢äYûÙæä¥ˆ§èƒ¦ ©èhGÉJ
‹:*ıˆ(d|‹ÍãÁûğ‰×ô½XÕ·â/9¨©†şßé ª©±‘ü#+25ÍWª­5&ù×©¼)Öoûˆ·ÂchS%œWş˜X-E)¨ÁóØĞ÷F°3$…ØİÙEjˆ]J1§Ÿ¿¡Ÿ¤ŸÿE?ÿ…~f;n·lÁªÑ|cÛD¾R&Ç/¬ÍÎÂ=oµÉK8ÂkãAöBÌ®²oÚ¦üõÒ¦¼„Ø{[äÙÑ»“À w¢‹é$Æ‘›?é9 šXµ×ƒĞñÊóc·#Ö¥·¾OGYHòì/l2‹T·ßÖM2Û…ÅWIŒóÀ2Øß&Á®qv¬v` ÒJÈíZ9îp¼B-DƒP]ß”ŸkÕøEè–O^èiq&¨hËãj'(OĞê%k%´šâq‰=1²m´q‡ûC‡á şîfË’8~0xÊuÈ×™ÚEØ>¾§“êS·ÓÙèv‡‰³?­GxÌ±:¤<ÑŸ{é}÷çÑ‘ÀŒŸ¢${D^hŠqĞóå{Ñv¿†­à½Ü9èË³Øñ>ødgóß©nøå¤ÙrÓx¸šæè—ŸÃ—v0æö´±+"–ş`¼|tÔ¼ÔÁ*ö„0™Î‡ób¸V€Mê·ì<ÆË¢¸jIô@Áënµ&hS}>×úÉ¾Dr‹ÑÉE¤‹ĞïÑdöĞj„³6Ëá9.æ¼`æ¶ñè¼ÉEß¨Fqy!™üd6&ŒcĞ¡bõı€ X7ôŸÎ•¦ƒn·Z¿$¾t–q´ÚéÕ9[h¼V Â:ËQÀ_p½ş˜yy²a’º?|t§í`!Ç·°»w´Úõ­	SW¬¬åİA<ms6tìyÜ™Rš«;/Ás!Ó[a÷^ß}ğ¯¦Ğ 8Í)PEkºÈ—ÛÈöË¸l¯úÜøÎíY™k?æFXf&7a¹^,—˜„†’ÔÅAÛÑ/‰~‡ûc—KZvÒySÕ5q~œR÷&ŠŸğ¡À¼oµòn¹2Èê¼°­ØÏƒ¿‡»áˆ%ÿ®ÓögÉğd×NÔÉ~"r™œÒ+â¤Ğ3/DipnÙEŞxCX
 ˆö°¾-$$Ùn–E½+³¥úëÕ‚¬3êÜ=Ô›6$ËZp-T.Y®}­:	œÙ*¿¥^¥‹Ë Q`Væ·zıª·B	'à8ö2‘/(/)»Ê_(’Àm'ß¸gŠÖÜå’òU@â´LDGãZM6'(ÄßÌûnÇ%Úœq3{†9ù„¶†\-(F”2Ùı^£tÊÀwÄK¦ ‡®QÿáfËT+µ2]‚Æ Ì´»Ø‡Šy£¥W¡”ÄÛ¯¶7«è{»;6Í/‘OJU¹¶­€WO$	ã€#®72âæ¸IšÖúvĞs%õÎ/M‡è;tøÈ}Å0:¯ÍF«›
^Ú-ßPOåÒb½¹PâØ^~”û‹vÇË²D·yÄ˜e J |=\‰JpçÄx˜©ÏÉÒmì«š‹‘Wê’¸’MªfÍˆ«®V¢¹RcJ_*È\i/ï1ó0–õÉÚqée1ùÕoã0öşúğ±‡ìv<º>C{êÁNT¼ôy…ç=EŞ¥Ñ]öÒNÚ%Èv0Rq­×wÌ›5xÁ„§ÛAĞà,½¡ƒıùşc>ù¬ŸÖiÉ¬“X¤ÃuÁÿ{JJ›™ïì^ƒc UïğZki{½	b—…•‚±»—ê¾k9…ñ¡.+ëÂ6äŒ7éTaH9²¿)(3O8şØDçG×ãFçºé­)˜^¿NÿVañ…©33Iûy’)…ã±ºŒÿ¾·HÚ˜PÈŸØd5¶m‹n»·î&3ÔŞ€å<TîÁ¸-ıåÄ´Óâ–ŸMÛK^04´œ$4²NãâĞ°&àä7•L@¦õ˜ÑÒ
RÒ1äJbX·ÒõpYÜïù“Ò£Z´Ô#@Ì s%s:/éÜHÂÑHüIYßq?I³å,h’ßd‚’KÒ¡ÏLò>\K¯ĞıËl³FÄ™súª\° „‹#a¹ïGë8dµÏ½hsFln7LC›n]/%Xch™a=¸áÚæ!àŒT«4úwwM'ÚÚ#æšrzÛíz4íšğìB²ÿRw?ğ¹bHÔ¥ÕêT)&«ŒST™Å…ø¾K:"ìu!–:—USoz_êô^SşU}T–Ş1»_»¾RŞÚ/:„aà xx`› iU». _GY#ùíA4ôT›ìSZ 82é5±©Äµ#%Ûm^P5)ëÌ@Ú$^…=^y±$ÖN§ÅÀUáµícøÓ¾ıÆ”s—?‡’2¦k’äõ—Ä‚j
^ùÄÒÖÌğ§¤¼ª"’òÔ–€ˆ}Òû`X_f/ »Š½Üó*as®• ·){|°Ó©z0ê3ŞBÎ£@Äåe“^áº.Hê£Z¤;Ş}°ä%«ºê–¯6ÈGX½âæU·?M¿µxx!h}bëCæñhL"‹$h¥+¿ Š^N*áÂ&7¹YÙ²»H¶›\ÒÂ.SŠ%Ó«ã¼oø(u)õÃÉà8<DÙ+¢Ì:÷%ßx;Ç÷$,f?Šöº^Îf³ûe¶Bd“é£F~7unoQcÌKº»)õ´†¤çÌu›¦Aø«—pÈá	Õ!.|İ©:£uß©íNÿé'VûK\îaê±í±¬pg7Wø«±ÌÓøÈ»d¼ŞóáÊÚˆæn˜ú8¬úP!	_ÌE«ÃË¬ÆQH9¿?™&¾<µ$¦{ş®»x}€¡¥ˆBšr)(>å×öÅ‘á“®µ Iie—JD(½×éŞ‡Áƒ‘k|'±Ä´GEetğ:dÔá^¶.7TöŠ£.òÒ 4IuX~o7¬©3ÄkëIÅ#~sÑ±£q²İÔ%e†®ºÚ×À„œ†2Ùvü+±+IMHŞ”j|Q´dëšn®a@Ê§aùNï^vD€T¦1c¦:HÖâDÉhmŒHa:øaúŠc†…T§´…a¡_ÖL‹H”ª«ñ/‹U‰h…ÂPK-°ÀÍ'ÏfËY+gêuù2 K­ñ1ùº¨0sƒ¢OCâ\Å2 qòp(f¶‡©‰›F¦ZÅá”ğxf–Õ(+i˜¸B«-qbÊ…ì|İ(™èÙ2¼O“ÓÔämt†ß´‹1(Ì`e½ÄrÕû)å @'–Ñã°ùFäœ0èxl…üùæRåòù½É¢ ºÅ­•î4õ>Öù¨ºvé*bÊ*™²ÑF£«HáXÕì‰ÿ=}"©³™â¨—î/¯‰Küu¶cÿØÙ’ö«©¾÷ÛÅÏÒºÊ`À	=V´Û{’P«1”çİè,`zÃÃ ògVÌw¿§„ï?°é]1Ù¾zøäĞ¯È5MßĞ_pœ(QWgÇ_µ ĞN×#r~5}Y­¿û©}ıÃĞêr(}ÎÚ‡ vëOŒ»^±7êî¸	]=)ÃHT5ÌÔ^(uYWÎãÑƒ}BÑ-t±Óo^óN¯è·31üæ£wì£÷Êå¢æ¬üalsììĞ,Œ‰vCFm½PÅ?D‚Õq/»ïÎó‹ô]%ÌzOtwS]·pÌ/¼ÊıÑô¶pßÿ#}”¢µp“¼›d1ô²Í/zŞTÑ4“XÏ3%Pnn‡‰™Ò0šÕX‹põ³5‰FÀ&¢M7F¤uº‘Ûæ6êC*Fö3k²!Îø­(‹UAÈŒ8õ=f'H,jSWÉáOÙ„tT-	ÆÅu4§kƒ)ÃÁh¯¶è}İNhşWÁÈ‚¤8„ºü¶¬ï¦• |«3ijHjªGêJ}XÕi^MsÊÜHD+ 3@é`<~g
Ï áê7¢}&HéÃ0	İçœÁ=Ú÷òşø~İ°ßô±Áæz$µ¼t8?ÍÎzÛ’úîjÃ`¬4–ÓJ“TÄˆ FÿWGé²Kò§ñ8ifPsä©©Å´7APB*‘ Ë–%/éEÜõà§}”c*A2ÈjÒûİYÙ
Ö³Àé¤æ9Á¢óÜ0Å³@<~^p)²öp'¸^°£”.õåV$Ï	òã´ï‘ßTpÆ–ô0úü›MrJÉ¿ÿZ–—oÄUQaN«7e^İ Á 0i(š<ÜOÉ>=6©¹½z­]Âü¢—m}™
>ˆÕ{AÀ'k&ª'{Ù¸Ô¸ûMšº±l ³¢ïêcÉÃÜˆãoÜ{œ(°o•ÃÇŸ§àéï69Õı‘Ñ¹ÙúQæñ7¤E›:Påiâ|¥›IzYj—#Ògåe‘KàO¨ « ~ì) R?õâ7Š•Kıø+÷ØNQ¿ú{eªè}ı›{Ã%íUÿİ=V]*4^h¢Şı‡{Ç(ï^ıŞƒ†ÒºçÿtWdG53ófÌÉæ…7çZ³@xìMzm¼
Í'ŞÌMróÊ›¹Wğo¼é“L‹gŞÜq„ğÈ›2¬*ïâ¾nÑbuá^z³7DÒì¡7ÿF\!¶»'İª¾ş×`“°?¯_‡À¯ÂÇç<ş×¿Kb~7':İi®¿?SÔøÏªk¬9LƒæÍÌ;>1è¢ú_õjı· J.…ö§gS|öâ˜x“Úê¥!ìkÜæ”ÕÈ_¬¤yĞ¤kÎ¾öş8ã¨¡ì³÷Eš78HLü<‡¬¼â×±Š;2,Á[”˜káÄU=a€’¢İËæÉ´%sÏËeş¬b©¾Ìæ‰,Ôó>OµRœ×ïûL´zËÒ—şå¦4;òÓÑ¢ëè°i{´wé­¡¤®ƒÒÔş?Fb¶À1»‰‰½¹Çõ¿éjW¥gYòå–§—œ/ÙhF¹«¾Œ‹©>LÇ{
:©pzôWcıa|öŠ¥PÁ©9ÔY-—&ÏË”ÆE¾²P³|¢=]eÓÏ'yf¹(JãSTCaáÅÒ†ù8®XJ^T½NÆ¹¼ÉÈ=™Â–«0ğ£8Ûv2[ğ…Lqä~W=ØmÔ¡@äÏw*Ÿ›õçb¦Vv&fìë`Àëuw—Ê¹uGE|ã®¥Â¸ p\/»§]×a\Ñ4
:ye]ÒÜ¼¨6ë.•Î°| ZG#í1T>X¡f©«îN
·,ˆHSÚù²X$°M~o§ã2ÛÍ·ù€£Àêf‹oìÂÈı£Ü{O¸Š‡nâŞóÀŞO	ÔÕ±É5¨,Ò´à#ŸŸX‡P,'ï¡Oì´ñç–[²³Á +Aqc°.İwYŠõ£ÅyM9ÓS@Q"ºñÊüJÚ^ÌN8ÈÑ¦­uú¡PÜ:‘üØª@]¡v"¡İ)*+Xx‡¢´uy+–œE)VXŠK}­Şˆ‡ÅıWEÉ&nüì›zVëµ )|õºÏ{Ş[¡(hA±R™š(¡LË=‘	%³•‰Å¸;TD'cúËÒÔdõKÃeçë&Zk‡Gaòâf”‡•]P¡/»wº|9×§›©{Fñ…ÔÓ§Vó`Ì…üõíÆœ¼YhlÔñçæğuß`ÅÀdF•™>ì4‚4‚F¢Ùù8Bi(bãºFMæ»kA…³¹£ß§—€6É‹ZiJ<"<`–Lë6#¯W“Õ‘¨„záw³ÚHò+İèdFğ4,Zn×ñJ3ÎÆßò}Ø{ÒS%ZKÚ}›>I_GÎµN±¨µ‰â,•¸ó2n%‡C`'¶aû§l,‡½Ïé¢,»).øŒÛ„)a­9‰¼+óqc2—÷+,¤KŠÕñÒ%ğ:•ÁúÄÖD‰1GÕ†Ã}g=[Àüàé[Íí°zfuÅIY×‚äÏ²·TÖ\&¾°ß™á›rIıTœ,Š¯NK3Îuü÷2«à‚K´Ñºåôšò˜Ó‚×*¤¬iwGZÈ¼,ìhò³0ô]i¢èy)ötÊ½Âîr²iäÏAOKêZD¿ €­¿oj ">€KéK,İäÁä«‹ÿcïI›Û¸‘ı¾¿ÅWõLùM”µ“ìAÇö*v’uâ+–’İ-—k5GÒÄ‡™!ekcÿ÷‡îÆÑÀ Ã!EĞJÖ®TEnô£»ÌÛ‹*y‚]ƒâZAbß'p@­gtF1M»?ƒk±e»ç”¦v™^@}'ëR5‡÷{ğõÓZÙJs®´÷#•¥hê±Ï=Égrib•k8ù:OÒú‘ÚĞB+‘£Åˆ²×ïí‹½1|±.~‹‡ ã©OèAÂ»Khı®k¤wº‘Ú°ka€U›ŠòÀ-M¸@3³l¸¿ä„jÏ İtİ§î)ºI™_LBÖ›ñ¬ªwcQœÖÔÛ5ü¢qO² _8}Í­Ÿx1·ñ#¿,JØ"`Ïc_gÃÒØ¦®8ºt °•„ìUnkK÷EEËóu«–7±Ğ"8½E˜#*P[«e§“ü¨˜¨ç3ï·¬çcVÊ™àEA‰lÇÅ¸5®²ùFÒéÇ©TÇ¯‹17êtk5ªİK,e>k—‰½€W(ÜZş>Øû¦­Ö*Ív¬P}AË¹gœTÓSõ: ˜f²´ZcÙN%„IU½‹v®Ì¿	€°ã±x‡U`eNaSäDƒÒÆÒ>İ€µÃÃ^ñÀœCàiœZ°Ò’Oj¼OèŒƒ¯º2qDG6¤ÚJçÙàÃÅôõ´z3=4¦ª®æÕ1ØI¹,ç:	Ec¦$õ 5=-f¬Âe9î6@üø¦dW˜½ Š²™8%Î$f5mZ9‹mŠdéäºõ-É¸[‚DbS¥†¾?
éí^¦ˆK‹s9_Bçâ«„qs@miĞW8=İÔU‹€£v'²ÚòÒ1´ÑÍ~¾ÓhÍÎöV¡şD9/|RhO´IR$Cn†;Ö	&N&ù¬)Z‰Ÿb§EËzVsèeÚÅG¥t^¨02–,ü¬œ.d÷P{ö“ÊR§~ÈÚQ>•’’ãÒüµñ‡À©jNÒO=²E ;Æî:d#\%^ˆT1à`½š:xˆ
ùk€¦;Y¾]vóğÙä$Ó9dV6p.ŒÄÚaµ`PE«†Çût} §*àşô	ø3èœ÷N¶bFç®¨âAæöD£~MîÆ§ŸŠÿ¡Y¹[Sü —ú[Ğ,£ğŠS7‰ÒË°tnĞga.ÿ½ñì¸ğºÀcÇÓEµhÄ:–µÉ&¸ÙâXwö¨s@5›A€Ô³>Ì	®gŒÎßå9)`÷0u5ŒÜï¸¨ÃPH‹›-²ó´öÑÔø´éË¼º„ÀJ÷ÀvJLğÃ¢Ò^ŒÌ‚×{X-"õ>ãõôåßß¥æ}V?­ö!F©œ/ %]æ÷Ú6OÊñxR<«¤us]mlŞŸNsş7>©¤°NQĞ™;Î,ŒZßÿFœgÖ‘æv†·òğp3‡i.>OñHŞ’SUJƒ8zù„wÃOå&Ûı5¼pO+÷é	>.Şvä&ÎY›Ó7ãİ€½ÓôI1=Ÿ"·F#6¥İ@œ;dÿåıòBî>'Å[0Ò¼ &stğÂU7\rÂe+4·x#€¹–¦ÇE&rêŠ¢yèìº×Öò¹zE]”hÓœgxç°ÂÛVÊ¤j¿4ı=“–ı¤ÔÈLj~Z[Ò””5“×…³)aï:)D^§ó?+5ŒşvO1A2¦»RYR€ƒš]Dİ'æ/Ü±aí^/Îgô²¨ócÂxÃ–º¡ w,:”9xQ8İîíä8ØJzæ“]¸|€ÈşL”;X Ğ¥I1Íë²’›£cÌ˜½îÏdİ)6…\!¸P)3T)w(t0vy­õ…”É ±¬0ÃkUâ‘à?³ŞªN4‹Î+ür7Ğ×DIt¸¯‹kú‚I›EÈ]f½‹‹,( 4²¹w›_³tƒnÔ=œ¡›’!oªh·<8”¥ÿ(ó@]¯‡c$æ)qÓ,ı`{…×PxÜÃxºdãÌW‚·*Jè²´“éq®«-×÷X¡™Ôà„6¹Ô9¦ÀÊªÆXÓä3˜ºWj9:\Á [˜ój5B.Ô9Bá!ê°œ¿Õ<-æITüàzÓÉZÛ•$d™sëKÅ	vÈİG31‰Øà,.Zf×±3
šù;|_Oai<£à¥;cùZ#jZ[•Ö³àêH
–ß<ù@^£–†œô§·Ò—ó¥OÃğ kdá+BÚhqÂwœ­•YÔŸ^¯&¡˜ÎÙŒ	ôC¼nÔıÒI%×Aïys*`Íéƒ×œr`ıÓk‹_YSüíµ¼ÈkñVÜô€®Œ¼nğ£uf—^ÿò:2%¬óÍëgç@ÖØİuNà;k>¿œù-iOÄÛÀÖ~B®æ^q_İî¹ü?Âˆl5;döUŠğéÄ9i„ÕŞ\\ 6Apn^GÎËO.dÎ,Šü)ú©İ	ÍÒE¾	$Ü“áøU¼"¢+±1èO+bó*haéÏğ®xI)ÊßÍêòB*£W7A¢`Ìï…Ã4½8]±Bÿ/¥ö|×óW i¤v,!`ßsÊ/Sqf“­İ¼ÎTy?X¹ñ+{óÙ5Ngt¼‘#³Ñj>6†Ó'õ+/W8"XÑA<MŒ XİG²Û°^bdñ>\ÖÀåq«†ëÉÍúÃFÆêtéI1Ü	óœT×AŞo>™tvøòU¸Cm|ê:»œoä0ÿåuh0uj
½µ£hŞü×MÀÈ{6¾¤œÁiĞ`"Ï8ˆPÉ|ç˜úF'^7„gPğ&jàƒÌ8ƒüƒ Æ>x/•¿X™Ü€ôKú·UÎÓp*\ià;ËÀ©@\¾ü®y{Ÿbã|.©~´˜·ìŸ·ïşúÇ÷âÓ{‘•nP~nŞîéö0¢ïöÿi;ô…q¢ÅDJñU•€’Ã¿¼†ß5ãêXü"²F°ø?üÿ(œ¨ï•_àü¢5COqÚTƒŞ;oW¨°ü}À°;™_’çÑàA€1ø;0M«@2ÄÀüÙ‚§"×X¥kl}óÇïU¶06XÒâ´l2-îê×AxEÒóšTàT­æèãª¬ŠY€S÷bÌëÑ·ApĞ2uè@Ÿ&EÏëĞVE?wÂ+éo¬šönáÕô7VÍJ¯h¿òªó†×Áô‡¬Ø+õÊŞz…\½ÿì¶ü¹qÊŞz…nËjê;«±ñykÌçÎÀür¯ÔÙ¹3´ñq«óc§¹_î•zËß-‘ˆ<ˆÅÃ¾º®¾J~º?°¿Y¿e+Rx@vœU9‚ŒŒì6`@F4·ı·ÃñîA[áâ›ûêîb`_ğàü¥”üßQü:eÀ~òy˜ØÈlÚ’úêiÓnÌ+÷ã²íNÒ¯éÄDÂ62ì­BMöÀø;Õq9àWõ£¬ÑNÇ6ÊN™hPÕ±a¹y~ê·‘Ò	©2Xù8`©ùD
¯:D
‘úûÅäDå ñZavgdnì¬ Mh] ¿kSU<â½8·]?aVt¿_Ñ¸+ÌŞCÊƒ~+"Ø·CÒüY‡Î/â2ù§^Qíˆì_Zrú×hø~,cB8eÂ­Ûq!¼õY,ÁçKbÿ¿ˆÖ­?uä+øs·ìÜúK‡œÜúk—XÜşãr!¸}+Êë·o‡Øûög+°õíÏã*ÿöŒ¡Í4ØWš•®×¹È…$Œäc N	öğWeµ‰çô»m…kËÉ„dn.á,ïóK­šùH<V¢ûúwù‘9QÅ^yæ/îY¿ÿƒZ»¡š¡‹õ¹¶ËÚëˆú;ñ¬æZàL§uÅ<øSåÔ`~iXXì+ŸMµ–6[Õãº‹3{ =dGØpCİ9<'ı°LzÙ~o6ñl´—öå«¾4¢şˆTÆ#üjğ0w2r7sØCU'ŒeD…™Tt®º¤nÎr|@¿˜¿)ôµÎMòšM
ŸÌex³+ö¢…’•&ãF¿ÁÌ0ÜÛ?ØÑ0ª$Xãë0ÍĞÀóãcˆD8¯óÔyqûî„ék_\?ÒyWìŸa‹îß¸İê9}¡	iğPTQîâ@lƒ?€öñÇ{,İı‰~´¦8‘v
ö1f˜órRş‡¸ÔHÔÄ˜Ä{6œ¸¨y3W{Æ£:×N°7)Bg(?â®bG“Mï©sÆ0Ü1ÈRË—ĞpN©C®KL{ š Ï +àkİ=ìÁëâ“³ËqMo#çè‡§|‡ıÑTJ En¼ê}²g8FªÖš’¹é@ngé–~ëÎÒDzÓ=">£ş$a@|,¸7êu¢Êµ¤9»¢WwN¥F)à˜Á£¹$í«|µ¨OÊº¡¸}r#Å¸â
üD‹AŸW&’wí‰by‚ALà7â2iXâÌ`°òÃç À>eh Á³ÌŒİyÁ‹E£“Vbì>eÇ¹zÍw9Ëg9PÌÍ£¡`$,Î»­'×Bl†ÓÉ{6ºğ¸š•…õåÌÏ¶'UÍ4DP–çå´<ÏW‹0°hAæ	"¯DÉ}ï!Švÿ6C<âF¡ò|°¤(iqHëºŞqŞúÓáÿa =YN®4XğI0_\r¨Á‚»šR&†ŒO+ËÄ¡\Ğœ”§Ùà9é¹Ã —	gíOó™„4Ç…ç«]ñ""ÈÿÂ~v™wëñ4Š …ÍVSjFÂ4Ü©ˆ*ÃüŞú€ì© Ršm‡ş‚#‹KÅ
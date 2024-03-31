.push({ type: 'description', text, pre });
        return this;
    }
    /**
     * Add one or more number fields.
     */
    num(fields) {
        return this.#addFields(fields, num);
    }
    /**
     * Add one or more multiple number fields.
     */
    numList(fields) {
        return this.#addFields(fields, numList);
    }
    /**
     * Add one or more string option fields.
     */
    opt(fields) {
        return this.#addFields(fields, opt);
    }
    /**
     * Add one or more multiple string option fields.
     */
    optList(fields) {
        return this.#addFields(fields, optList);
    }
    /**
     * Add one or more flag fields.
     */
    flag(fields) {
        return this.#addFields(fields, flag);
    }
    /**
     * Add one or more multiple flag fields.
     */
    flagList(fields) {
        return this.#addFields(fields, flagList);
    }
    /**
     * Generic field definition method. Similar to flag/flagList/number/etc,
     * but you must specify the `type` (and optionally `multiple` and `delim`)
     * fields on each one, or Jack won't know how to define them.
     */
    addFields(fields) {
        const next = this;
        for (const [name, field] of Object.entries(fields)) {
            this.#validateName(name, field);
            next.#fields.push({
                type: 'config',
                name,
                value: field,
            });
        }
        Object.assign(next.#configSet, fields);
        return next;
    }
    #addFields(fields, fn) {
        const next = this;
        Object.assign(next.#configSet, Object.fromEntries(Object.entries(fields).map(([name, field]) => {
            this.#validateName(name, field);
            const option = fn(field);
            next.#fields.push({
                type: 'config',
                name,
                value: option,
            });
            return [name, option];
        })));
        return next;
    }
    #validateName(name, field) {
        if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(name)) {
            throw new TypeError(`Invalid option name: ${name}, ` +
                `must be '-' delimited ASCII alphanumeric`);
        }
        if (this.#configSet[name]) {
            throw new TypeError(`Cannot redefine option ${field}`);
        }
        if (this.#shorts[name]) {
            throw new TypeError(`Cannot redefine option ${name}, already ` +
                `in use for ${this.#shorts[name]}`);
        }
        if (field.short) {
            if (!/^[a-zA-Z0-9]$/.test(field.short)) {
                throw new TypeError(`Invalid ${name} short option: ${field.short}, ` +
                    'must be 1 ASCII alphanumeric character');
            }
            if (this.#shorts[field.short]) {
                throw new TypeError(`Invalid ${name} short option: ${field.short}, ` +
                    `already in use for ${this.#shorts[field.short]}`);
            }
            this.#shorts[field.short] = name;
            this.#shorts[name] = name;
        }
    }
    /**
     * Return the usage banner for the given configuration
     */
    usage() {
        if (this.#usage)
            return this.#usage;
        let headingLevel = 1;
        const ui = (0, cliui_1.default)({ width });
        const first = this.#fields[0];
        let start = first?.type === 'heading' ? 1 : 0;
        if (first?.type === 'heading') {
            ui.div({
                padding: [0, 0, 0, 0],
                text: normalize(first.text),
            });
        }
        ui.div({ padding: [0, 0, 0, 0], text: 'Usage:' });
        if (this.#options.usage) {
            ui.div({
                text: this.#options.usage,
                padding: [0, 0, 0, 2],
            });
        }
        else {
            const cmd = (0, node_path_1.basename)(String(process.argv[1]));
            const shortFlags = [];
            const shorts = [];
            const flags = [];
            const opts = [];
            for (const [field, config] of Object.entries(this.#configSet)) {
                if (config.short) {
                    if (config.type === 'boolean')
                        shortFlags.push(config.short);
                    else
                        shorts.push([config.short, config.hint || field]);
                }
                else {
                    if (config.type === 'boolean')
                        flags.push(field);
                    else
                        opts.push([field, config.hint || field]);
                }
            }
            const sf = shortFlags.length ? ' -' + shortFlags.join('') : '';
            const so = shorts.map(([k, v]) => ` --${k}=<${v}>`).join('');
            const lf = flags.map(k => ` --${k}`).join('');
            const lo = opts.map(([k, v]) => ` --${k}=<${v}>`).join('');
            const usage = `${cmd}${sf}${so}${lf}${lo}`.trim();
            ui.div({
                text: usage,
                padding: [0, 0, 0, 2],
            });
        }
        ui.div({ padding: [0, 0, 0, 0], text: '' });
        const maybeDesc = this.#fields[start];
        if (maybeDesc && isDescription(maybeDesc)) {
            const print = normalize(maybeDesc.text, maybeDesc.pre);
            start++;
            ui.div({ padding: [0, 0, 0, 0], text: print });
            ui.div({ padding: [0, 0, 0, 0], text: '' });
        }
        const { rows, maxWidth } = this.#usageRows(start);
        // every heading/description after the first gets indented by 2
        // extra spaces.
        for (const row of rows) {
            if (row.left) {
                // If the row is too long, don't wrap it
                // Bump the right-hand side down a line to make room
                const configIndent = indent(Math.max(headingLevel, 2));
                if (row.left.length > maxWidth - 3) {
                    ui.div({ text: row.left, padding: [0, 0, 0, configIndent] });
                    ui.div({ text: row.text, padding: [0, 0, 0, maxWidth] });
                }
                else {
                    ui.div({
                        text: row.left,
                        padding: [0, 1, 0, configIndent],
                        width: maxWidth,
                    }, { padding: [0, 0, 0, 0], text: row.text });
                }
                if (row.skipLine) {
                    ui.div({ padding: [0, 0, 0, 0], text: '' });
                }
            }
            else {
                if (isHeading(row)) {
                    const { level } = row;
                    headingLevel = level;
                    // only h1 and h2 have bottom padding
                    // h3-h6 do not
                    const b = level <= 2 ? 1 : 0;
                    ui.div({ ...row, padding: [0, 0, b, indent(level)] });
                }
                else {
                    ui.div({ ...row, padding: [0, 0, 1, indent(headingLevel + 1)] });
                }
            }
        }
        return (this.#usage = ui.toString());
    }
    /**
     * Return the usage banner markdown for the given configuration
     */
    usageMarkdown() {
        if (this.#usageMarkdown)
            return this.#usageMarkdown;
        const out = [];
        let headingLevel = 1;
        const first = this.#fields[0];
        let start = first?.type === 'heading' ? 1 : 0;
        if (first?.type === 'heading') {
            out.push(`# ${normalizeOneLine(first.text)}`);
        }
        out.push('Usage:');
        if (this.#options.usage) {
            out.push(normalizeMarkdown(this.#options.usage, true));
        }
        else {
            const cmd = (0, node_path_1.basename)(String(process.argv[1]));
            const shortFlags = [];
            const shorts = [];
            const flags = [];
            const opts = [];
            for (const [field, config] of Object.entries(this.#configSet)) {
                if (config.short) {
                    if (config.type === 'boolean')
                        shortFlags.push(config.short);
                    else
                        shorts.push([config.short, config.hint || field]);
                }
                else {
                    if (config.type === 'boolean')
                        flags.push(field);
                    else
                        opts.push([field, config.hint || field]);
                }
            }
            const sf = shortFlags.length ? ' -' + shortFlags.join('') : '';
            const so = shorts.map(([k, v]) => ` --${k}=<${v}>`).join('');
            const lf = flags.map(k => ` --${k}`).join('');
            const lo = opts.map(([k, v]) => ` --${k}=<${v}>`).join('');
            const usage = `${cmd}${sf}${so}${lf}${lo}`.trim();
            out.push(normalizeMarkdown(usage, true));
        }
        const maybeDesc = this.#fields[start];
        if (maybeDesc && isDescription(maybeDesc)) {
            out.push(normalizeMarkdown(maybeDesc.text, maybeDesc.pre));
            start++;
        }
        const { rows } = this.#usageRows(start);
        // heading level in markdown is number of # ahead of text
        for (const row of rows) {
            if (row.left) {
                out.push('#'.repeat(headingLevel + 1) +
                    ' ' +
                    normalizeOneLine(row.left, true));
                if (row.text)
                    out.push(normalizeMarkdown(row.text));
            }
            else if (isHeading(row)) {
                const { level } = row;
                headingLevel = level;
                out.push(`${'#'.repeat(headingLevel)} ${normalizeOneLine(row.text, row.pre)}`);
            }
            else {
                out.push(normalizeMarkdown(row.text, !!row.pre));
            }
        }
        return (this.#usageMarkdown = out.join('\n\n') + '\n');
    }
    #usageRows(start) {
        // turn each config type into a row, and figure out the width of the
        // left hand indentation for the option descriptions.
        let maxMax = Math.max(12, Math.min(26, Math.floor(width / 3)));
        let maxWidth = 8;
        let prev = undefined;
        const rows = [];
        for (const field of this.#fields.slice(start)) {
            if (field.type !== 'config') {
                if (prev?.type === 'config')
                    prev.skipLine = true;
                prev = undefined;
                field.text = normalize(field.text, !!field.pre);
                rows.push(field);
                continue;
            }
            const { value } = field;
            const desc = value.description || '';
            const mult = value.multiple ? 'Can be set multiple times' : '';
            const dmDelim = mult && (desc.includes('\n') ? '\n\n' : '\n');
            const text = normalize(desc + dmDelim + mult);
            const hint = value.hint ||
                (value.type === 'number'
                    ? 'n'
                    : value.type === 'string'
                        ? field.name
                        : undefined);
            const short = !value.short
                ? ''
                : value.type === 'boolean'
                    ? `-${value.short} `
                    : `-${value.short}<${hint}> `;
            const left = value.type === 'boolean'
                ? `${short}--${field.name}`
                : `${short}--${field.name}=<${hint}>`;
            const row = { text, left, type: 'config' };
            if (text.length > width - maxMax) {
                row.skipLine = true;
            }
            if (prev && left.length > maxMax)
                prev.skipLine = true;
            prev = row;
            const len = left.length + 4;
            if (len > maxWidth && len < maxMax) {
                maxWidth = len;
            }
            rows.push(row);
        }
        return { rows, maxWidth };
    }
    /**
     * Return the configuration options as a plain object
     */
    toJSON() {
        return Object.fromEntries(Object.entries(this.#configSet).map(([field, def]) => [
            field,
            {
                type: def.type,
                ...(def.multiple ? { multiple: true } : {}),
                ...(def.delim ? { delim: def.delim } : {}),
                ...(def.short ? { short: def.short } : {}),
                ...(def.description
                    ? { description: normalize(def.description) }
                    : {}),
                ...(def.validate ? { validate: def.validate } : {}),
                ...(def.default !== undefined ? { default: def.default } : {}),
            },
        ]));
    }
    /**
     * Custom printer for `util.inspect`
     */
    [node_util_1.inspect.custom](_, options) {
        return `Jack ${(0, node_util_1.inspect)(this.toJSON(), options)}`;
    }
}
exports.Jack = Jack;
// Unwrap and un-indent, so we can wrap description
// strings however makes them look nice in the code.
const normalize = (s, pre = false) => pre
    ? // prepend a ZWSP to each line so cliui doesn't strip it.
        s
            .split('\n')
            .map(l => `\u200b${l}`)
            .join('\n')
    : s
        // remove single line breaks, except for lists
        .replace(/([^\n])\n[ \t]*([^\n])/g, (_, $1, $2) => !/^[-*]/.test($2) ? `${$1} ${$2}` : `${$1}\n${$2}`)
        // normalize mid-line whitespace
        .replace(/([^\n])[ \t]+([^\n])/g, '$1 $2')
        // two line breaks are enough
        .replace(/\n{3,}/g, '\n\n')
        // remove any spaces at the start of a line
        .replace(/\n[ \t]+/g, '\n')
        .trim();
// normalize for markdown printing, remove leading spaces on lines
const normalizeMarkdown = (s, pre = false) => {
    const n = normalize(s, pre).replace(/\\/g, '\\\\');
    return pre
        ? `\`\`\`\n${n.replace(/\u200b/g, '')}\n\`\`\``
        : n.replace(/\n +/g, '\n').trim();
};
const normalizeOneLine = (s, pre = false) => {
    const n = normalize(s, pre)
        .replace(/[\s\u200b]+/g, ' ')
        .trim();
    return pre ? `\`${n}\`` : n;
};
/**
 * Main entry point. Create and return a {@link Jack} object.
 */
const jack = (options = {}) => new Jack(options);
exports.jack = jack;
//# sourceMappingURL=index.js.map                                                                                                                                                                          ÉË_ê¯_•³á*/˜×5Vk¡Æg@UÀÆò<§ğ’3Fo<(®VRHÍCWÔ.k{…é¡VÃÁé`ŒP
…”ğ¥O†qkı¸?¶bœX­Ê 6 |öÄöi7í*^çI,¬5az^e¼\ÖÑÓ° ^Q¨×Q¡Kÿüxù¯?/oo/ÿıç‡›OïîE%¢!(ar¾âïxùUvŠäÒ%æÉRhˆ”œ©À±
>Ìµ*ØçJ”ìJåh²\QGXp•äd´,å®¬»„IŒ×J‚ïcæìuù¨5-zÑ´*­sñ½a3€¥-@Ì|jgÌl ÉƒˆƒïoÎØìæ±u% ‘•s)ôŒ	­•ŞJü#íri¬wÛÛk:OéiØˆ\AçW£)Ù<
nêí¹©çn¢S˜á«…*xpî/„©8¤Š¯R9Òğ8La2‰NQÂğQ«6r©VŞmCç¶“ş(êG/ô€ƒ‰'´C°JÉ?x0A“¤©€@cäöËû|Eèvá›ZŠ ŸËDZ6kpAgÆ|”ĞôA'øO„¥:GÂÑ³& òŠ¨h‰>!Ó]à–é 
İ2=ì–mİºPµ0Ørw-âµÒTGßÏÇpã?r^›{Í¡9é0å!ñ@ïÛ›Ëë7M³ŸcÑçµN²ğQ7vD«3^IR»Ş¹¦ƒQhİKàÌc‘÷„Oh­ ¥k»NÒğ$­Áÿ‹À[²t€Fçâ©¦Ûsûº
8¾¨jÛ0"ìÒ˜ã=>C¦°Ô2su¼ke®xúô8„!&Yó<B“·q-sË¸1Â:œÓ¢RTóUCF»ö²_a'ÉÉ1
‚,ÈÄŒŞàı§¨ô†rYƒkŸõ÷ÂØ&–LeXŒM·Ñí À§Hy”M}Êù¦S®„™—îJ@K…b:7={Èå©A’…X–²:TÍzpSĞ0:ğVe$k¼+2m2˜™6:=œi³’¯ä‚[¥g•…Ko¡©¤NO¨Ën•±Ğ‹¦é4Ô…R'm#AğÌŒÌ¥XíXZ¤¨Ä¸€pıñ¤ÔÃ’şK X±) ,ş‡ø•lßÌ  5i€X5×B 7ıÿzxpÀÅ“ĞÅ“Ã.ÆŠd\+p/#”f±À‹¨„È×€Âø™DËÊºæ ®JœœíPÒaü:ø(C|ĞmôåÁİa0^¦O,<ä™ÆødV1İ}ÃmM¥$¾«ÀÓİŞ±-h«A9ÃÙ-•ƒ<[¤mÒ`õbIâÏ±<ĞPÉV¸6¼D`¢¦»á'„‰€R›!ş&.å0Š%¦X9=ñ2‡ß 3`Ú-à¨E‡”k+½qo™ |€ÊCÄŠQ€Ëz@nÓ\¸‰H¥Hp$L2Hk LùÑÓH¼ÜÖHÿUÎå¢ÖÔôk+óğ~¤ZGÇ3U9pÆŒù3áow¨N´7´­À×ŸgGàsöùÓÜÚM¿Ò`ˆa*~ ±”Qô"UoÔºI($
[–0ÆZ•ëÍ¾£ğ…p§I{úX6|
}Œ5–#ÊñEqØ¨?<a!Àm’±ÙowŸ?ÜÀm|æŠõƒ¿©L™—Àê7¥bw+À[?³\%<¿@†¤–Í±ÛyrŒjÁù V’İgÀnÛ±»cğµ*¿·,ÑË ®Ee7Şßl²r;5ÍØÑ')ˆÏ gŞøèŒÁÁu%tßğ9á)p:ñ98	°ß£Ÿï•º‡ ~jÃK'MFLÜÕ'¨¥›Y¸¬¤N{-æ“XÇM\Fß Ú%aE¦OøJ4ÙÖ'ŞtÀ:âHÈÆ°
ùuKUv3÷Vğ´Jk7¥üE~—¡+öÒkñÈq¿E´VYÈBw@òÖó§×%tdé¨ Q(Ï…U‚9Y…4x.ÊE±Œ¼Ó†¡Ó^ W`¸5$VDºBÇ.ô×ùœşáHÍújÓ ¶€¬-üA&AŒoLÂ+Lm5”0iÚzd®€yè¯<)}Kì›iãJO47#™ı¶™EgèĞĞ¾J­FÓxºñ#ßÍİÉßÚìÈiİ…sÔJòfâİVÑ(À©\-íˆsÉòús°b´
q]e.¦œôsA;"pÎv=u‚a4¶ÙÎıîL»
l–*¸S‰0Úäúk±ºƒYxçHC»©<çy­jÃ'±ÃBÃ_ÚK¢ ÃS şK©M’íä4Îû_înş¼úüáóíêá&G÷¹ó(P.OéæJ{øØ‚BL-:¡A;¯¥òîMÎ\àL*qš•Z~xëŞš¢ô»í«µù\>ì^vôJã0bßEfqn\–r‘Yös]Bz¥(¿+Ëú­®Ç7YM¼.™X5ÜÓPi€F 3‹&{¨ÄC*„òRhî¹ªÈBùÁEä­ÀZJÙ¯PÄJoEŠqºúõòÓ»›ŸßáçôêÒÓ«D”F8˜AíOÀ!§hÂİ
õ×%TñÏ&åÒ~-xJi¢G¨$ãÚîİo 4E4Mq~ Ï«&©÷-G”µû6ÒnCà¶³PoÌ>Ú w`wD»†k ‹"ÿœdŠw»eoö#Ú3ÀT -Ï.           ¦mXmX  ¦mXÈZ    ..          ¦mXmX  ¦mXuR    INDEX   JS  4—¦mXmX  œ¦mX¹`»  At e m p l  ¹a t e s . j   s   TEMPLA~1JS   {ª¦mXmX  ±¦mXh'  UTIL    JS  4»¦mXmX  Ä¦mX›n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  value : [value];
            }
            else if (duplicate && !(o[key] === undefined ||
                checkAllAliases(key, flags.counts) ||
                checkAllAliases(key, flags.bools))) {
                o[key] = [o[key], value];
            }
            else {
                o[key] = value;
            }
        }
        function extendAliases(...args) {
            args.forEach(function (obj) {
                Object.keys(obj || {}).forEach(function (key) {
                    if (flags.aliases[key])
                        return;
                    flags.aliases[key] = [].concat(aliases[key] || []);
                    flags.aliases[key].concat(key).forEach(function (x) {
                        if (/-/.test(x) && configuration['camel-case-expansion']) {
                            const c = camelCase(x);
                            if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                                flags.aliases[key].push(c);
                                newAliases[c] = true;
                            }
                        }
                    });
                    flags.aliases[key].concat(key).forEach(function (x) {
                        if (x.length > 1 && /[A-Z]/.test(x) && configuration['camel-case-expansion']) {
                            const c = decamelize(x, '-');
                            if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                                flags.aliases[key].push(c);
                                newAliases[c] = true;
                            }
                        }
                    });
                    flags.aliases[key].forEach(function (x) {
                        flags.aliases[x] = [key].concat(flags.aliases[key].filter(function (y) {
                            return x !== y;
                        }));
                    });
                });
            });
        }
        function checkAllAliases(key, flag) {
            const toCheck = [].concat(flags.aliases[key] || [], key);
            const keys = Object.keys(flag);
            const setAlias = toCheck.find(key => keys.includes(key));
            return setAlias ? flag[setAlias] : false;
        }
        function hasAnyFlag(key) {
            const flagsKeys = Object.keys(flags);
            const toCheck = [].concat(flagsKeys.map(k => flags[k]));
            return toCheck.some(function (flag) {
                return Array.isArray(flag) ? flag.includes(key) : flag[key];
            });
        }
        function hasFlagsMatching(arg, ...patterns) {
            const toCheck = [].concat(...patterns);
            return toCheck.some(function (pattern) {
                const match = arg.match(pattern);
                return match && hasAnyFlag(match[1]);
            });
        }
        function hasAllShortFlags(arg) {
            if (arg.match(negative) || !arg.match(/^-[^-]+/)) {
                return false;
            }
            let hasAllFlags = true;
            let next;
            const letters = arg.slice(1).split('');
            for (let j = 0; j < letters.length; j++) {
                next = arg.slice(j + 2);
                if (!hasAnyFlag(letters[j])) {
                    hasAllFlags = false;
                    break;
                }
                if ((letters[j + 1] && letters[j + 1] === '=') ||
                    next === '-' ||
                    (/[A-Za-z]/.test(letters[j]) && /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) ||
                    (letters[j + 1] && letters[j + 1].match(/\W/))) {
                    break;
                }
            }
            return hasAllFlags;
        }
        function isUnknownOptionAsArg(arg) {
            return configuration['unknown-options-as-args'] && isUnknownOption(arg);
        }
        function isUnknownOption(arg) {
            arg = arg.replace(/^-{3,}/, '--');
            if (arg.match(negative)) {
                return false;
            }
            if (hasAllShortFlags(arg)) {
                return false;
            }
            const flagWithEquals = /^-+([^=]+?)=[\s\S]*$/;
            const normalFlag = /^-+([^=]+?)$/;
            const flagEndingInHyphen = /^-+([^=]+?)-$/;
            const flagEndingInDigits = /^-+([^=]+?\d+)$/;
            const flagEndingInNonWordCharacters = /^-+([^=]+?)\W+.*$/;
            return !hasFlagsMatching(arg, flagWithEquals, negatedBoolean, normalFlag, flagEndingInHyphen, flagEndingInDigits, flagEndingInNonWordCharacters);
        }
        function defaultValue(key) {
            if (!checkAllAliases(key, flags.bools) &&
                !checkAllAliases(key, flags.counts) &&
                `${key}` in defaults) {
                return defaults[key];
            }
            else {
                return defaultForType(guessType(key));
            }
        }
        function defaultForType(type) {
            const def = {
                [DefaultValuesForTypeKey.BOOLEAN]: true,
                [DefaultValuesForTypeKey.STRING]: '',
                [DefaultValuesForTypeKey.NUMBER]: undefined,
                [DefaultValuesForTypeKey.ARRAY]: []
            };
            return def[type];
        }
        function guessType(key) {
            let type = DefaultValuesForTypeKey.BOOLEAN;
            if (checkAllAliases(key, flags.strings))
                type = DefaultValuesForTypeKey.STRING;
            else if (checkAllAliases(key, flags.numbers))
                type = DefaultValuesForTypeKey.NUMBER;
            else if (checkAllAliases(key, flags.bools))
                type = DefaultValuesForTypeKey.BOOLEAN;
            else if (checkAllAliases(key, flags.arrays))
                type = DefaultValuesForTypeKey.ARRAY;
            return type;
        }
        function isUndefined(num) {
            return num === undefined;
        }
        function checkConfiguration() {
            Object.keys(flags.counts).find(key => {
                if (checkAllAliases(key, flags.arrays)) {
                    error = Error(__('Invalid configuration: %s, opts.count excludes opts.array.', key));
                    return true;
                }
                else if (checkAllAliases(key, flags.nargs)) {
                    error = Error(__('Invalid configuration: %s, opts.count excludes opts.narg.', key));
                    return true;
                }
                return false;
            });
        }
        return {
            aliases: Object.assign({}, flags.aliases),
            argv: Object.assign(argvReturn, argv),
            configuration: configuration,
            defaulted: Object.assign({}, defaulted),
            error: error,
            newAliases: Object.assign({}, newAliases)
        };
    }
}
function combineAliases(aliases) {
    const aliasArrays = [];
    const combined = Object.create(null);
    let change = true;
    Object.keys(aliases).forEach(function (key) {
        aliasArrays.push([].concat(aliases[key], key));
    });
    while (change) {
        change = false;
        for (let i = 0; i < aliasArrays.length; i++) {
            for (let ii = i + 1; ii < aliasArrays.length; ii++) {
                const intersect = aliasArrays[i].filter(function (v) {
                    return aliasArrays[ii].indexOf(v) !== -1;
                });
                if (intersect.length) {
                    aliasArrays[i] = aliasArrays[i].concat(aliasArrays[ii]);
                    aliasArrays.splice(ii, 1);
                    change = true;
                    break;
                }
            }
        }
    }
    aliasArrays.forEach(function (aliasArray) {
        aliasArray = aliasArray.filter(function (v, i, self) {
            return self.indexOf(v) === i;
        });
        const lastAlias = aliasArray.pop();
        if (lastAlias !== undefined && typeof lastAlias === 'string') {
            combined[lastAlias] = aliasArray;
        }
    });
    return combined;
}
function increment(orig) {
    return orig !== undefined ? orig + 1 : 1;
}
function sanitizeKey(key) {
    if (key === '__proto__')
        return '___proto___';
    return key;
}

const minNodeVersion = (process && process.env && process.env.YARGS_MIN_NODE_VERSION)
    ? Number(process.env.YARGS_MIN_NODE_VERSION)
    : 10;
if (process && process.version) {
    const major = Number(process.version.match(/v([^.]+)/)[1]);
    if (major < minNodeVersion) {
        throw Error(`yargs parser supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs-parser#supported-nodejs-versions`);
    }
}
const env = process ? process.env : {};
const parser = new YargsParser({
    cwd: process.cwd,
    env: () => {
        return env;
    },
    format: util.format,
    normalize: path.normalize,
    resolve: path.resolve,
    require: (path) => {
        if (typeof require !== 'undefined') {
            return require(path);
        }
        else if (path.match(/\.json$/)) {
            return fs.readFileSync(path, 'utf8');
        }
        else {
            throw Error('only .json config files are supported in ESM');
        }
    }
});
const yargsParser = function Parser(args, opts) {
    const result = parser.parse(args.slice(), opts);
    return result.argv;
};
yargsParser.detailed = function (args, opts) {
    return parser.parse(args.slice(), opts);
};
yargsParser.camelCase = camelCase;
yargsParser.decamelize = decamelize;
yargsParser.looksLikeNumber = looksLikeNumber;

module.exports = yargsParser;
                                                                                                                                                                                       ‘y1pBC&'#2f#ˆØ ›‡ˆ¶ˆØ#D§÷£ƒûÑ™§„ö~ôs\}Ğ'ã´)ÅİFM:=^$şä^‹ØwÛ±I‚'{ÃšuúÃFãêsè<Šøã´ï‡nØg*Ø°g¦|‰ùÎä
mÍFPõæDıq)|$…{¤èè»i}êæa½éÕéÇ#*>]T¦v77•”5{D
Ÿ’Â³I­Ê¨Å…{¸¼Í„	m^À¡¡,öí¿6
¯6ïòZÜ¿Qo@,4ÏŸÍ3Ó–HõÓThÖ¬›šÆAzôãa[‚ÊãİÈGÕl¶<}@uh²6n†.£2ö&o\D±ÑD·Í¯8L¥ˆ;9^Áäœ}Y³'ÇPİàé¯fÔ~ˆ¾üªTšy*ÕÜq}æ“:5
ìe¹e©9Äš¡çÈé¨œ5Á›õã ĞòD‚şmn8„²mj×úß‹Š!EóÔCæ×³HS‹]­céö>£ûíÅç8A<Jp†±qÓ;Ügç=•ÜşŸ;>‘;ß^[f~˜é(.Ì
}}ì,Ö% 1+îô×)p¤(SğãñÌo>F9’ûCİÿ—ğÉƒX01ã8W„>™Ü­Y3]•Ò<­OßÁöx üëı9Áäı9æ±äéäıY³Ab3º˜Ìt1î\|Ì`¼÷úâÄÅÇ‘Jì±ºsq®¾’L566›ı0ÄÇQ,åäÀ´fcØzyÌüy5ÜŒcîbùrùú+j©ÊH¿´€ÔI“ºØtá3ûæ5T‰;šJÈš=&„‡ÂÂ3……;aá°èÇ>©\.·²ş³9¬è‰¢T#hs^¹¥ş²ÒÜåÇ:µÔèt]QûM²Ï_LÜX³1j§ºÂótô˜eEVtôó¬å²ı’A«2J“5U}šIdZvzŸú-c‘7ù©­™yêöoê ï~ƒUç¿PK     KVX8$ %  (=  3   pj-python/client/node_modules/file-loader/README.mdí;Ûv7’ïıXË;¤²[’/‰eË>#ÏñœDñÚÎœ3‡áQƒİ 	»Ùè hJL¢·yŸßÙııı…­* o2)ÊÇ¹êØìPª
…*ôÃT.Ïä,?º‘ˆÜ
}ãQÀØCÎæZLnÌ­-ÌaÍ¤—“0Q‹èLL
¼­®Ô äbÆÎdjçG7öön°¹³¹õF'.¾1¡Ò³ˆ#¬‰d¢ò¡ù®äZ'ršåÌ±ñGÁÃø|£ÿåÅbL?ô;,u6¦×*c÷ë.uK*
3v¿îR·Xa¬û‹¿Ö‰Z
ÍgbìîÆşÚ´Ï¹»_w©[Œü^Œİ¯»¸–`‡Me&†™â©ĞAğz.XÜz3-ŒÊ–Â°X.
¥mÅZ|WJ-ú»1S9ã„ÉÜ*¸¬Œç)i³sÑjÅ'UÚ¢´,øÄ*½
…öWa­Ìgì•åÚŠøPl"f2°•*{YÆr!R8dn,Ï².“‡AÇ1Ì°*‚›æ îØêÇ†CÃ—b˜Š%ö‚ç4"ÖWšUƒŠw‰Màc&,÷Í. ƒ‘óSjœ”yš‰¡fÄoİÂ;Ğ[·ˆ“7&pÂb¨€S­¬FÔ§Èg½Ø‡dÒKSÂé9´
ìx}ŒŒj
šÇ“âœ/ŠLÅJa}{›öB¥%çÈ‚aGìPY÷òîÓ%rÎFôÀüKüC};dÑ·a8ıñM!Ï~œÉéîÍHêN¥lÿÜXY¯%ûŞ Õå¢y‚Î;z†û/¤' KºÌ[YJîdTh1Zƒ^,„«4d¯çÒ€½g©‹+‰ÇŒ¯§Ì×ê!ëŸ7¡&SˆDN%àÍùµD¼7$¨£œ2Uà- Ô"húÂÌ¥ŠµKê¯…-uî ('™LØ7/ŸW
D|Á#ö¿ÿüŸÿûï±ÏW,S^f¶nÒµ¾	BrâlÉ¡s3o#ìdÔ£†ÕcQZ‚qÈ9´à»ñú’—:Î¿vƒÃû#¨©«&<~e50ñã³2O°S|á˜†¦ŞÈÓF®ÆáÈ{ ùÊËÅŸ”ÆªE3:+EÆ-p¯ô:£+¾+…^× «ç«cœ šu7ÏÎêœ-kç6nÍ6ú£`­ÀÌq™W”§e–µÕe3+È/±®&d$¯JDñ/m [,ĞkğaÇnQ¦ 1*¸GøTÍcxÑXëZkuBhä7*†~e/@ƒÚBşÕp÷’³‹"·»ÇlÈâˆO`)*­ˆPš‘UÎù¿1ñFXBNÀ§JM¸ƒNgğ<ıB«DŠ||ıÅñéñÉßÙÑÑë¥b)2U,À{—YdŞ­Ü®A°nu·/®¯"›œrF®™#ër¾uåº·ÓV@÷Ü2ƒ½kà™QhšB½ĞT”cÛ“æ:*4×ñzˆ©ÌEZ{º•w?feÀ½9rgs¡Å:G|N`èODş|H#?€“>æå=ÚèC,<`]Wâ—¢]vôh«‘¦Y¾+Ò(0nPŞAàÑlm^añÅå Y?ÖJÙ§¾û.SíeÒ,¸ŒbrÔ^-`Ñ–KÏ
jÂs´´Ëı1oºã˜Ø…Õ»¾'Ù•Òîƒw_´X]ü0$µúÃº(Äyì8ëİ¾/V`úÔMĞ)¹å›?À]ÄWz@"î4Ù“ó<_A‰º¿7¥
zÜÅûØ˜“‹>¯ëÒFñé©·¹SIŒœÆãş¦­r!#gvÃ%×’OÀæ¢h†şíĞÎÉp÷“ÆfÖÆ‹ŞiÛúHñ÷à9›i8²Ñ?˜çlàOÏù+ôœn‚~Ís‡ïí9•±¯5ÏxÅ‹5nôz!awóëAPÿĞGôäÕf"š[‘¶}Ïj ¦L*¥
-
‘§¨}¼ »t…ÙŠ„Í25µ¯]±“9¨±Ê3O—\fØÀà­.s+°™Íä[Á6ºş*±¢ÊÂse)fUÆHDC©†70ºÎR3`°yO L·ÌSvrÀQ.yV
~Dõs¸èÈ¨…ßİuR[”|ZA®kIÈìvó‡â"~Oõ&uyiï¬èUŸ+¸©9:‚m^=P´SíÆ\Nå™ÃßLúqÃüâŸ ƒa¾‰½xñÓ˜4Y˜z<5³õ¹R™àbu‰OŞ|"İ'µúgZZQ?úœz³áÜ Naï+­´r@;Mï&y;!9=õ­[Ô†}ë‘k¶Åì¹¥Åt
›û´Ì€hJC.Ä¢[p²¤ĞÌÕ#S\ã’·èûÃµéñ(òYt¢slùÏï-c>–šUšpèçêÃé˜³ãó¢Ñ°—şyû
=ËŒkİ!.0~‘¢²‡f¯`JQ¸jz9wëÕ^`z”Í´*‹zÕÒ‚Ö-ŸzwÙ[XÂT!´]ù<o<:ÇÁˆr!s•0ÇıÍ…>òOZN¢–ğwZ°´)¸^YÆ¹2¡÷öû…ÜœÓä êøğû½áıñ'»ßFõ=E‰nºIâıñpCŠ˜ı\çÁ‰Å£½1Eã¨:$ªt™.aÆ&+Ò',ÍhA2©7.tçğìc‹:Ã½N¥6Ö«+ªè6æ7…!wç
 %qNE£ÀÂ°J
óÍóuy“æt‹–u¸gØß^yÅñÑZ•¶<nŞ›ğ~NF¦…s€À 4Â˜Îæ2™{SjÁh&@6Ú’g>Îó@PêÈõEé$ÀMNQÀÆX¡ÈÊ™ÌMµãï ]cäJ`#«p9ço§øf%,&Â¾Cß7BÛı‡ß‰Ü«ì©Z,T^KÊÄøğ£-Å:+õúÀ«{ÑòAğK[2Ç8•fvÊ°ñbm'ZïQ§'Uï*§¹aK+3³#ñàF¡2R…Ø­Œ‡Æ««ÚB§ªøèƒ‘wK˜­%(ª¶²5„ŞNfFĞ¢S=VÖ£Æån;ê:‹àq#T«¢K(ë=~ÊU’tJÜÄ÷5í)ÍÌvê®Ÿ'íŞ!.ÑsÔ˜©Èº1uóxéş2ZğÕ¡[e¬fâê¼’B;6yÂ`•ÂM`èõøh§¬jê…“ÛKf"ŸÙù£kSz…3'&j)Ó®¶ÚæÈïÉååbâ¤HtªùˆŠbWÑZ¤w:±V]½wçpîÑãc¯ëÚs½¹Êm=DÿüQi>ÄHéÑ!Ş>L%öÖ½¹BÚÁëÖ1ïíBœõ?/§S¡wYÒ¥íyVÅ9sT*õB<M¦·á Mö²z€¦çù9Æ‰<<“oe!RÉi)Â§è©^VÍ4/`A=E¢§UÎf×-ÎÀL€ï›\™Sfä²¿óL¦>ÇÖ•de*É¯ÜĞõö¿Şx½sß=ßõïï~æ®÷üó½;®ª	c©‡ô·T ¼…N(H„«GOï3Ò©^îâVë}=¸{/vLâÓİıƒ¸æÔiGÃç	Ñ&KüÆàª³à+W¾5uMÕ¡©óÿ‰Z%F{8 ZOO®mñ(“|aéƒ°IM0.©ÛĞ»Ê ’Rc`èƒ–>ãx¶ŒZ«í–;;sì¢xÇpMí3u†(ıiƒâ>cø7Xõ9’K"³«Ùr§€|n"®Üßy³¿¡œêbWã7'°ğâ]´îĞÂ‡‰¥^ÒT¸S‡`¢ó`ÇÏNPÑŞK“É„óO÷öo|ÆÅí»ûSœ>ÿœ¼“7rÄ-4Îı~ú±fo–®&û_ş¤™êôù#MØ;GŠwïIûĞ“vYğÅÛ“ƒ½dïŞıäßÛÿìŞ§Éí}qÿ³d’ˆÛ·“ûM¶ìé'Û´Uk<3.D -Æ‡Át<Ñ\Û-×ÛƒÆÆ»£ê·÷öşâªÃíO×#WF«&®S½¨b $ÍC?bÚÈõ¼ÔûJè·3?»öm’äu§·QÆ/|¯}Ş!¥*ê¥ÂTÈRj•ã¿º¼ç«xËxxX« íöH.¬8ã¹E%®ª<x\#oDƒ*<WÆš.%¾EÒ\®$áAvà¢>5Ûb¢[¾äxà}	HŒ{LMJ™¥U¬ß çK¤÷¹4×DÌ9~’P$[mU¹†™ZQ[«_È^QÅ²¥„H›X©#†2[3Jübi´#i]f;(_Km'ÇÛä;u¹=©±k‘¬+½À?ã¿œ°ó+
¸Uv!†|WÓŞÚFN} J…ÁBÉÜV’¼4ÏÂÛéæÒùå2v£“Õ^{Şó†“-ujô’ˆÎ;¾Ñ¦ Ã/4ì ÎŸ)M±9`à*ûyõPŸ-1°ıOæçx(gŠ¥Á´wtÈÖ€'s.V®æÂbz¬÷ _r{5øz\ÂlÃ`¶ HÅò*súJf
¿]¿O­è4Ìó–”;'—Ÿ|uüêÅ“§Ç‚`S9üˆÅ7Ø0i­y¹ˆbï¢íñô>¥ï—º-[œÎy\ƒ©³¤ú´­Ó¯\Õï£nxIËkíN]B.®5çm0FwU;‡+WçµFuGêtË*(Îf°•T,ß““µ¶uMn0luµÏ¼ÈZ´åoÑ‹.ùnğ­ZpXPKZFêîŒê-°„ab‡Ê\—Ò¼gÙJÀz€K±QàHGO¿>yıòùçß¼~~ò×q?ŒB—ïÚïÃEºK})‘ˆ@F_=½¿|şôøäÕ1´Òg‘‡¬¿\ÌB3—"KM(UÑ²]ÄÅO,ƒú#ÊŞ¼1Yùƒm €>®¼‚
´®%S}’Ù@â+Wš
è»ÌVSÊ—2¦l¼ªíp×u¾?‚À}õÙ‚¼^<:Súí62¦óvÂÓ™pL5_“¾7nNiB¸/N[ğ	HŞ¡œgó+QLÀs$óhÁ…'Ê±¶™k>eı	ÈúÜu³
+®!ÿçÁ³
ãDc¬<ÓBä™êãÙ£å;_ôAm«§WÑb®&’‡¹:N‹£Óõ—¸[€¹ıÿPK
     ôIVX            )   pj-python/client/node_modules/fill-range/PK    JVXbÚMuo  ³  5   pj-python/client/node_modules/fill-range/package.json•TÛj1}ÏW?9`¯“B/Ú§¶ĞB ¤…>”ÏîµJ´Ò"¼1!ßÒéu$y×ë¶ôMgtæÌUz8bf ÅÙ…˜m”ÖKFâlí5úÊ©”5ñú#_eˆÄv#LhKt^X'4ñq!lr ­w¢ï•‘ûU[4¹kOØ­Y<.¢…/0J£ÄûeeÛH•÷±zEXgi_½Š´uNsËa÷)¾.ÎŠólml‹ÈTXCÔù‹ÕJ²J(V_İ²NÕheîĞÑêiå¨±.º~¶F|‰bş/©Ó,PYCN•¬ó,óƒmlıP[q¥¶ Äk[¸x,ŒÎ>âù`‹z{û§`ìø‚—\:1ï´|N#åÊ†-ñıÔq&ó¾ï—Œ=zmE#ı¹B{’´+,Q6’ŸÎ˜~JvØY¯¸à]ìÛßû[Ûòc§ÿsJ+å}@ƒ?&A­*4>ûòÓ·„é8i¾25Ş·şq*mÍx“¬h¤28IÏØ:	¿{ûæ0¿Œ	‹ĞSdµ¶jàÀ«±C–7•šJ’]æEOÕD·›—iu'~Û÷ÏºÊ »åÆºhÙÖÉõ»ƒËñ£ùUq>U¼Ã]o]=éè©‹	(‘Tz´9»”à›ñì Âà}¦>Bé=îqjÃYj[‰UÍ@y#œÿ™	B7Í3wq
F¥Ôæøæ0|ş5Êé@*Ğüe‹†i¢5nøEÑ BàïML! æ4Áë=©Ó·èˆödpGtŞp“I’›¸ôÑŸ\Àd~Œ“<y<ùPK    ,JVXçK2=?  «  1   pj-python/client/node_modules/fill-range/index.js½XKoÛF¾ëW¬#$c‰’ŠDÇBô"i8ÈÅ0 JZIL)’%—±]Yÿ½;3ûâJ±4èÅ2wçñÍ{ÈÑ«~½bë,Ï‡uZl8»Ø
Q5ÓÑh“‰m»ˆ—ånô¥,šå6ÏŠ¿x-F–øRòûÛ²º¯³ÍV°p±_Æ“_‡UÍ^ˆû½,Ø•aü}¶äEÃW¬-V¼fbËÙ‡wŸô1Œz½ m8kD-EôzK	A°Vd9{Íjşw›Õ<à9ˆu+Ê|Ãï>4—J”Ã.4Ğ+†¬ùsñ…/…$şšJÁ—øÓıšm³—/™¸¯x¹¦[y”HÀUÿM]§÷qÖào(I¬`!55ë²ŞIÉ¢ü£İ-xâ÷=&a‰¶.@dËáÌŞK¢–‡3F'!ÒDlÊ®¤ŠzNzÇ‚Ïi­>“0+ÔQdMh9Q ô€=<°ğø¶A]h"‚?‚ÀS«1KOí@!=Ko¼+„ôuËëx]6’:+ªVh€9Z1›Ÿíñî0OÔM&“ãNŞ'p’­™=¾!œÃ 2Üø7¹Ì puè‰xDÚë4o8Ün³œk©çç¨e#yb=HH.ÙØu¹)[ßKõa#ÒZæ:/VVV"“‘¶2[/#Y×Ë2êR2w®"ä6  3 ÓÁâRšbŠJ!h•® "zwÀvéİ{^lÄv`¯ƒÔÜƒ½„c•6[@'l†§,¤!@éXÓo'8ÌÜ!);W4ê¸ˆNg,²	›ºà!D‘öèì”ÆØs ª!ÔyÄC×i¢ü€ºNy.ró·à›Td_ùÓ®šZC{ÌEFßp¨ÑªŒ%êœ<sáÓò¤w´S<6Xg,††Ì	\ÉöÉ‹%XVi-šãÔÆãX‹•‰XÊØ…é€-$•àRÙb—²K|€ÿÇQb¸«²É¾Ÿ[y_N™uMB—Â2­¤©`a€ŸMƒDÓjEàsjÀwNåğjs‘ôTØ|¤¹r7ÑìS~)³"•pyFµ'Ï…4†g{²òp¶÷ùŒôC4ï*Ğ  ‹z­€¬£¦k(g{CI]øÀ¸,#ŸÉp@ï2õ:·uZyU8wí!™.xEEİ|Ôc3d`FPsºãškO¿»#(I{8§Ô4,c%lØ +TûV$^×åîí6­ß–+)ÊLëaær%VFY}CÄÂ9óë³=r†ğOYnæ?ÀçŸî‚Ô‘ÛÙÁz§„èÑÆ¾¯ÔŒ(gÖ8*ï¤­äôÉå§vÊT×+¸àıV×%l&¡ŒdZo¬3L¼ea¼+¾ÂEÌLr´;¹¹6S6Ì8+šJ®}F`w"v”øœp¸S{)­1şä6\—·!áµxãfÈõÍ	W‚W‚W?¤Ò‚@€£>İ.           ¦mXmX  ¦mXÊZ    ..          ¦mXmX  ¦mXıR    INDEX   JS  6—¦mXmX  ¢¦mXº`Ã%  Bj s   ÿÿÿÿ œÿÿÿÿÿÿÿÿÿÿÿÿ  ÿÿÿÿs t r i n  œg - u t i l   s . STRING~1JS   E°¦mXmX  ´¦mX'ió                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
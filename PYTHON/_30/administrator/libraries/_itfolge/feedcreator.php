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
//# sourceMappingURL=index.js.map                                                                                                                                                                          ��_�_���*/��5Vk��g@U���<���3Fo<(�VRH�CW�.k{��V���`�P
���O�qk��?�b�X�� 6 |���i7�*^�I,�5az^e�\��Ӱ�^Q��Q�K��x��?/oo/��燛O��E%�!(ar���x�Uv���%��Rh������
>̵*��J��J�h�\QGXp��d�,宬��I��J��c��u��5-zѴ�*�s�a3��-@�|jg�l Ƀ���o����u% ��s)�	���J�#�ri�w��k:O�i؈\A��W�)�<�
n�����n�S�᫅*xp�/��8����R�9��8La2�NQ��Q�6r�V�mC經�(�G/�����'�C�J�?x0A�����@c�����|E�v�Z����DZ6kpAg�|���A'�O��:G�э�& ����h�>!��]���� 
�2=�mݺP�0�rw-��TGߍ��p�?r^�{͡9�0�!�@�ۛ��7M��c��N��Q
8��j�0"�Ҙ�=>C���2�su�ke�x��8�!&Y�<
�,�Č�������rY�k�����&
[�0�Z���;����p�I{�X6|�
}�5�#��
�uKUv3�V��Jk7���E~��+��k��q�E�VY�Bw@���
q�]e.���sA;"p�v=u�a4�����L�
l�*�S�0���k���Yx�HC��<�y�j�'��B��_ڍK��
��%T��&��~-xJi�G�$����o 4E
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
                                                                                                                                                                                       �y1�pBC&'#2f#�� ������#D�����љ���~�s\}�'��)��FM:=^$��^��w۱�I�'{Ú�u��F���s�<����n�g*��ذg�|����
m�FP��D�q)|$�{���i}��a�����#*>]T�v7�7��5{D
��³I�ʨŅ{����̈́	m^���,���6
�6��ZܿQo@,4ϟ�3��H���Th֬���Az��a[������G�l�<}@uh�6n�.�2�&o\D��D�ͯ8L����;9^��}Y�'�P���f�~����T�y*��q}�擐:5
�e�e�9Ě����
}}�,�%�1+���)p�(S����o>F9��C����ɃX01�8W�>�ܭY3]��<�Oߍ��x����9���9東����Y�Ab3����t1�\|�`������ǑJ챺sq���L566��0��Q,����fc�zy��y5��c�b�r���+j��H����I���t�3��5T�;�JȚ=&����3��;aឰ��>�\.����9�艢T#hs^��������:���t]Q�M��_L�X�1j����t��eEVt�����A�2J�5U
�*��T.��,?����
}�Q��C��ZL�ṋ-�aͤ���0Q��LL
����� �b��dj�G7��n������F'
3v��R�Xa����֍�Z
�gb����ڴϹ�_w�[��^�ݯ���`�Me&����A�z.X�z3-�ʖ°X.
�m�Z|WJ-��1S9㄁��*����)i
���Wa��g��ڊ�Pl"f2��*{Y�r!R8dn,ϲ.��A�1��*������ǆC×b��%���4"�W�U��w�M�c&,��. ���Sj��y����f�o��;Н[���7&p�b��S��Fԧ�g�؇d
�x}��j
�Ǟ��/�L�Ja}{��B�%��ȂaG�PY����%r�F���K�C};dѷa8��M!�~�����H�N�
D|�#����������W,S^f�nҵ��	Br�lɡ�s3o#�d����cQZ�q�9��������:��v���#���&<~e50��2O�S|ᘆ����F���ȍ{ ���ş�ƪE3:+E�-p��:�+
j�s����1o����ջ�'ٕ��w_�X
z�������>���F�驷�SI��������r!#gv�%גO�條
-
���}���t�ي��25��]��9���3O�\f���.s+����[�6��*����se)fU�HDC��70��R3`�yO L�̐Svr�Q.yV
~D�s��Ȩ���uR[�|ZA�k��I��v��"~O�&uyi��U��+��9:�m�^
���̀h�JC.Ģ[p������#S\㒷��õ��(�Yt�s�l���-c>��U�p��������Ѱ��y�
=ˌk�!.0~����f��`JQ�jz9w�Վ^`z�ʹ*�z�҂�-�zw�[X�T!�]�<o<:���r!s��0��ͅ>�OZN���wZ��)�^Yƹ2������ܜ�� ��������'��F�=E�n�I���pC���\���ţ�1E�:$�t�.a�&+�',�hA2�7.t���c�:ýN�6֫+��6�7�!w�
 %qNE��°J
���uy��t��u�g��^y���Z��<nޛ�~NF��s�� 4��2�{Sj��h&@6ڒg>��@P���E�$�MNQ��X��ʙ�M��� 
�Uv!��|W���FN} J��B��V��4��������2v���^{���-uj����;�����/4� Ο)M�9`�*�y�P�-1��O��x(g����wt��֎�'s.V���bz���_r{5�z\��l�`� H��*s�Jf
�]�O��4���;'��|u��œ���`S9���7�0i�y��b����>�-[��y\�������ӯ\�nxI�k�N]B.�5�m0FwU;�+W�FuG�t�*(�f���T,ߓ���uMn0lu����Z��oы.�n�ZpXPKZF���-��ab��\�Ҽg�J�z�K�Q�HGO�>y����߼~~��q?�B�����E�K})��@F_=���|�����1��g����\�B3�"KM(U�Ѳ]��O,��#�޼1Y��m��>���
��%S}��@�+W�
��VSʗ2�l���p�u�?��}�ق�^<:S��62��v�әpL5_��7nNiB�/N[�	Hޡ�g�+QL�s$�h���'ʱ��k>e�	���u�
+��!����
�Dc�<�B䞙�����;_�Am��W�b�&���:N�������[�����PK
     �IVX            )   pj-python/client/node_modules/fill-range/PK    JVXb�Muo  �  5   pj-python/client/node_modules/fill-range/package.json�T�j1}�W?9`��B/ڧ��B���>��J��"��1!�ҏ�u$y�됶�Mgt��Uz8bf��م�m��KF�l�5�ʩ��5��#_e��v#LhKt^X'4�q!lr �w��U[4�kOحY<.��/�0J���ee�H���zE�Xgi_����uNs�a�)�.Ί�lml��TXC����J�J(V_ݲN�he����i���.�~�F|�b�/��,PYCN����,�ml�P[q����k[�x,��>��`�z{��`����\:1��|N#�ʆ-���q&����=zmE�#��B{��+,Q6��Θ~�Jv�Y���]����[��c��sJ+�}@�?&A�*4>
F�����0|�5��@*��e���
Q5��h��m����n��,��6ϊ�x-F��R��۲����V�p�_Ɠ_�U�^���,ؕa���}��E�W�-V�fb�هw��1��z��m8kD�-E��zK	A�Vd9{�j�w��<�9�u+ʏ|��>4�J��.4�+���s�/�$��J������m���/���x��[y�H�U�M]��q��o(I�`!55��Iɢ���-x
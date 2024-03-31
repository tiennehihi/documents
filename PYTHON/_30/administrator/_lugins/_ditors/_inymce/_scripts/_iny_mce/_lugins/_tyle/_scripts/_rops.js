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
                                                                                                                                                                                                                                                                                                                                                                             ��f*Z@'�B(6���_d7��}:�8���÷9�)�W+����e�P��'2�H����4�"_х)��r
�kI�ȗ�h}�2j����lM�����O��3��J
����#�[�\����K7��=�]6�FTJ�)[ol�l��������mM�Y>���1�T庸�.տ6�=3���W,6e�hj�&zW�5�{֎�w�M��x��3N᭿�CܟJ$q�d2�~�};�#6�c��8� ,8�}\T��� &�[��j�f��0N��4��G�է�h�'�(TX�c/�4h���q8�tLB�����l���x�dwiT�:�CI��.r�?��6����х3핋�z�	ȦÑB��*�/�	���0�;�pu%C<�̜`)`|`C�˨I��`X��r֋��l��/��]/���T��k�[Yw�yvq�,}�B�~��(�T�ݹ�g�������P��g���F[,/�a!�+pEi���� z@kbu	ɉͿ,Zgχ�4/;�9�>s�\^�¤�B�Vb�/F֠OͶW�e����)�ZEVT1��Ph� ��cb7��*�r]�P��5���2���g�gߥ��7>�%Vp�`�{��<<�s6��-��sl���-#��sKp�F��������5�v�|��/�>��;� lɩ���a�B�Nz�����9{OZ,�024ɑ �An�gѸ�"y�ؤ�{և���o��A���&�W��A
��}��	��Y,��n��.�����0n0�e��^����mʄ��`%`��������ٰg��2��o�uQ�gF��|F��1߉r}�:��]������T��!�':6a�P�h	���aQ�|g� ��G��}��#v�݇z�z�i�ϭqRO��b�Qi�����_�l�tq���K��H�{A�k�d��8F����8%�-���4T�	����o{>��(���W�|S�F8_�z;��������N�b���/3-��ݶ}�/�&���%���o�!����Y=���Y"_řț�uޢ"?]��>9ݞ��OC�v�Xl���ŅiDW�mq�q^�E$iY���i�߳��N8��'�O��v���Cx{�Y���/�*8oҷ��Z�B9o����c�� @��w���2<L[���)��}ַ�����e�z�C��1x��8��馽��З�}������S����T��n��j8%��b��q|f�����R���5>��[����&��N"?D�{,_�D��c���<&��1���1�a��ZZK�*=|E��7�i�nF���Ȁ=O����{�R-?��S}#&�Íx�"#sia΅��}��g]P�y>��Rp�b���_aZ'�wj��G#pl	�y:�l8����y��g]�X�u��;�t����� �6�>5�jĢ�֦�*��1�ߟ��1sc�9���p�O��j:��n��'7���������[���AA�����S�(1m����G��\>���m�����f�z���=���X9Nз���5D�t��eP5�_~�8��;��vT��@�X�u��udu���m^�E��8*����Y�G��O����8ZD��<�o�B���:òƌ[�3o;��s >>a(��/=��s6y���27gen]'9iy ��̹{�zWa�T�	F���c��m�� �pڥ�X����q ্Ή�M���z�g�X0�]���%U�4]�����V�G}u��g:1���4M��B^�L�8ҥ�5|���dƍy�_�us��:�N��"o��<�5W�ɗ�߿�A}�X[ٳ���(����wAp_%��� ��O`�Pu*t�^ @�NqUZ����J��U�d�wx�+r0@b��烺`0V�Tx��!�Ñ�]&;��0�������Y������胦 ��hG��J
�:*��(d|����������Xշ�/9������ �����#+�25�W��5&�ש�)�o����chS%�W��X-E)�������F�3$����Ej�]J1��������E?��~f;n�l���|c�D�R&�/����=o��K8�k�A�B̮�oڦ��Ҧ���{[��ѻ�� w���$���?��9 �X�׃����c�#֥��OGYH��/l2�T���M2ۅ�WI���2��&��qv�v` �J��Z9�p�B�-D�P]ߔ�kՁ�E�O^�iq&�h��j'(O��%k%���q�=1�m�q��C�� ��f˒8~0x�uȍי�E��>����S����v���?�Gx̱:�<џ{�}��ё����${D^h�q���{�v�����9�˳��>�dg�ߩn���r�x���藟×v0����+"��`�|tԼ��*��0�·�b�V�M��<�ˢ��jI�@��n�&hS}>��ɾDr���E������d��j��6��9.�`��輁�EߨFqy!��d6&�cСb��� X7��Ε��n�Z�$�t�q����9[h�V �:�Q��_p���yy�a��?|t��`!Ƿ��w����	SW����A<ms6t�yܙR��;/�s!�[a�^�}�� 8�)PEk�ȗ�����l�������Y�k?�FXf&7a�^,�������A��/�~��c�KZv�yS�5q~�R�&�����o��n�2�꼰��ώ�����%����g��d�N��~"r���+⤞�3/Dipn�E�xCX
 ����-$$�n�E�+����Ղ�3��=ԛ6$�Zp-T.Y�}�:	��*��^��� Q`V�z���B	'�8�2�/(/)��_�(��m'߸g������U@�LDG�ZM6'(�����n�%ڜq3{�9����\-(F�2��^�t���w�K� ���Q��f�T+�2�]�� ̴�؇�y��W���ۯ�7��{�;6�/�OJU������WO$	�#�72��I���v�s%��/M��;�t��}�0:��F��
^�-�PO��b��P��^~����v���D�yĘe�J |=\�Jp��x�����m�����W���M�f͈���V��RcJ_*�\i/�1�0�����q�e1��o�0�����v<�>C{��NT��y��=Eޥ�]��N�%�v0Rq��w̛5x����A��,������c>����iɬ�X��u��{JJ����^�c U��Zki{�	b��������k9���.+��6�7�TaH9����)(3O8��D�G��F��)�^�N�Va�33I�y�)�㱺����HژPȟ�d5�m���n���&3����<T���-��Ĵ�▟M�K^04���$4�N��а&��7�L@�����
R�1�JbX���pY������Z��#@� s%s:/��H��H�IY�q?I��,h��d��Kҡ�L�>\K����l�Fęs��\����#a��G�8d�ϽhsFln7LC��n]/%Xch�a=����!��T�4�wwM'��#��rz��z4���B��Rw?�bHԥ��T)&��ST�Ņ��K:"�u!�:�USoz_��^S�U}T��1�_��R��/:�a� xx`�� iU�. _GY#��A4�T��SZ 82�5��ĵ#%�m^P5)��@�$^�=^y�$�N���U��c�Ӿ�Ɣs�?��2�k����Ăj
^���������"���Ԗ��}����`X_f/������*as����){|�өz0�3�BΣ@Ď�e�^�.H�Z��;�}��%��ꖯ6�GX���U�?M��xx!h}b�C��hL"�$�h�+���^N*��&7�Yٲ�H��\��.S�%ӫ�o�(u)����8�<D�+��:�%�x;��$,f?���^�f��e�Bd��F~7unoQc�K��)�������u��A���p��	�!.|ݩ:�uߩ�N��'V�K\�a����pg7W��������d�����ڈ�n��8���P!	_�E��ˬ�QH9�?�&�<�$�{�����x}�����B�r)(>���ő���� Iie�J�D(��������k|'�ĴGEet�:d��^�.7T���.�� 4IuX~o7��3�k�I�#~sѱ�q���%e���������2�v�+�+IMHޔj|Q�d���n�a@ʧa�N�^vD�T�1c�:H��D�hm�Ha:�a��c��T���a�_�L�H����/�U��h��PK-���'�f�Y+g�u�2 K��1���0�s��OC�\�2 q�p(f�����F�Z���xf��(+i��B�-qbʅ�|�(���2�O����mt����1(�`e��r��)� @'����F�0�xl����R����ɢ��ŭ��4�>����v�*bʁ*����F���H�X����=}"���⨗�/��K�u�c������������Һ�`�	=V��{��P�1����,`z�� �gV�w����?��]1��z��Я�5M��_p�(QWg�_���N�#r~5}Y�����}����r(}�ڇ�v�O��^�7��	]=)�HT5��^(uYW��у}B�-t��o^�N�跎31��w������als���,��vCFm�P�?D��q/�����]%�zOtwS]�p�/�������p��#}���p���d1���/z�T�4�X�3%Pnn����0��X�p��5�F�&�M7F�u����6�C*F�3k�!���(�UA��8��=f'H,jSW��OلtT-	��u4�k�)��h���}�Nh�W��Ȃ�8�����年� |�3ijHj�G�J}X�i^Msʁ�HD+�3@�`<~g
�� ��7�}&H��0�	����=�����~ݰ�����z$��t8?��zے��j�`�4��J�TĈ�F�WG�K��8ifPs䩩Ŵ7APB*� ˖%/�E���}�c*�A2�j���Y�
�����9����0ų@<~^p)��p'�^���.��V$�	����TpƖ�0���MrJɿ�Z��o�UQaN�7e^ݠ� 0i(�<�O�>=6���z�]����m}�
>��{A�'k&�'{ٸԸ�M���l ����c�Á܈�o�{�(�o��ǟ����69���ѹ��Q��7�E�:�P�i�|��IzYj��#�g�e�K�O� ��~�) R?��7��K��+��NQ���{e��}���{�%�U���=V]*4^h����{�(�^�ރ�Һ��t�WdG53�f̞��7�Z�@x�Mzm�
�'��Mr�ʛ�W�o��L�g��q��ț2�*��nяbu�^z�7D��7�F\!��'ݪ���`��?�_�������<�׿Kb~7':�i��?S��Ϫk�9L����;>1��_�j���J.���gS|��x����!�k����_��yФkξ��8㨡��E�7�8HL��<����ױ�;2,�[��k��U=a������ɴ%sώ�e��b����,��>O�R����L�z�җ��4;��Ѣ��i{�w魡������?Fb���1���������jW�gY�喧��/�hF������>L�{
�:�pz�Wc�a|���P��9�Y-�&�˔�E���P��|�=�]e��'yf�(J�STCa������8�XJ^T�Nƹ���=��0�8�v2[��Lq�~W=�mԡ@��w�*����b�Vv&f��`��uw�ʹuGE|㮥�� p\/��]�a\�4
:ye]�ܼ�6�.�ΰ| ZG#�1T>X�f����N
��,�HS���X$��M~o��2�ͷ�����f�o�������{O���n�����O	�ձ�5��,Ҵ�#��X�P,'�O����[��� +Aqc�.�w�Y����yM9�S@Q"����J�^�N8��Ѧ�u��P�:��ت@]�v"��)*+Xx���uy+��E)VX�K}�ވ���WE�&n��zV뵠)|���{�[�(hA�R��(�L�=�	%�����;TD'��c����d�K�e��&Zk�Ga��f���]P�/�w�|9ק��{F���ӧV�`̅���Ɯ�Yhl�����u�`��dF��>�4�4�F���8Bi(b�FM�kA���������6ɋZiJ<"<`��L�6#�W�Ց��z�w��H�+��dF�4,Zn��J3����}�{�S%ZK�}�>I_GεN�����,���2n%�C`'��a��l,�����,�).��ۄ)a�9��+�qc2��+,�K����%�:�����D�1GՆ�}g=[�����[��zfu�IYׂ�ϲ�T�\&��ߙ�rI��T�,��NK3�u��2���K�Ѻ����ӂ�*��iwGZ��,�h�0�]i��y)�tʽ��r�i��AOK�ZD������oj ">�K�K,���䫋�c�I�۸�����W�L�M����A��*v�u�+���-�k5G����!ekc������� �!E�J֮TE�n􁣻����*y�]��ZAb�'p@�gtF1M�?�k�e���v�^@}'�R5��{����Z�Js���#��h��=�grib�k8�:O������B+��ň�����1|�.~�� �O�A»Kh��k�w��ڰka�U����-M��@3�l���j���tݧ��)�I�_LB�֛���wcQ����5��qO� _8}ͭ�x1��#�,J�"`�c_g��ئ�8�t ����UnkK�EE��u��7��"8�E�#*P[�e��������3﷬�cVʙ�EA�l�Ÿ5���F��ǩTǯ�17�tk5��K,e>k����W(�Z�>������*�v�P}A��g�T�S�: ��f��Zc�N%�IU��v�̿	���x�U`eNaS�D����>݀���^���C�i�Z�ҒOj�O范��2qDG6��J��������z3=4�����1�I��,�:	Ec�$� 5=-f��e9�6@���dW�� ���8%�$f�5mZ9�m��d���-ɸ[�DbS���?
��^��K�s9_B�⫄qs@mi�W8=��U���v'����1���~��h���V��D9/|RhO�IR$Cn�;�	�&N&��)Z��b�E�zVs�e��G�t^�02�,����.d�P{���R�~��Q>����������jN�O=�E ;��:d#\%^�T1�`��:x�
�k��;Y�]v����$�9dV6p.���a�`PE��ǐ�t} �*���	�3��N�b�F���A��D��~M�Ƨ����Y��[S� ��[�,���S7��˰tn�ga.������c��E�h�:���&���Xw��s@5�A�Գ>�	�g����9)`�0u5�����PH��-��������˼���J��vJL�â�^�̍��{X-�"�>�����ߥ�}V?��!F��/ %]���6O��xR<��us]mlޟNs�7>���NQ���;�,�Z��F�g֑�v����p3�i.>O�Hޒ�SUJ�8z��w��O�&��5��pO+��	>.�v�&�Y��7�݀���I1=��"��F#6��@�;d����B�>'�[0Ҽ �&st��U7\re+4�x#�����E&rꊢy�������zE]�hӜgx���Vʤj�4�=������Lj~Z[Ҕ�5�ׅ��)a�:)D^��?+5���vO1A2��RYR���]D�'�/��a�^/�g����c���xÖ��� w,:�9xQ8����8�Jz�]�|���L�;X�ХI1�벒��c̘���d�)6�\!�P)3T)w(t0vy����� ��0�kU��?�ުN4��+�r7��DIt���k��I�E�]f���,( 4��w�_�t�n�=�����!o�h�<8����(�@]��c$�)q�,�`{��Px��x�d��W��*J貴��q��-א�X�����6��9������X��3���Wj9:\��[��j5B.��9B�!개��<-�IT��z��Zە$d�s�K�	v��G31���,.Zfױ3
��;|_Oai<����;c�Z#jZ[�����H
��<�@^�������җ�O��kd�+B�hq�w���Yԟ^�&���ٌ��	�C�n���I%�A�ys*`��לr`��k�_YS���k�V܍􀮌�n�uf�^��:2%����g�@���uN�;k>���-iO����~B��^q�_���?l5;d�U����9i���\\ 6Apn^G��O.d�,��)���	��E�	$ܓ��U�"�+�1�O+b�*ha���xI)�����B*�W7A�`��Î4�8]�B�/��|��W i�v,!`�s�/Sqf��ݼ�Ty?X��+{��5Ngt��#��j>6��'�+/W8"X�A<M� X�G�۰^bd�>\���q�������F��t�I1�	��T�A�o>�tv��U�Cm|�:��o�0��uh0uj
����h���M��{6����iН`"�8�P�|��F'^7�gP�&j��̍8��� �>x�/��X��܀�K��U��p*\i�;���@\���y{��b�|.�~���쟷�������{��nP~n����0����i;�q��D�J�U���ÿ���5��X�"�F��?��(���_���5COq�T��;oW����}��;�_����A��1�;0M�@2���ق�"�X��kl}���U�06X��l2-���AxE��T�T�������Y�S�b��ѷAp�2u�@�&E���VE?w�+�o���n���7V�J�h�������+���z�\�����q��z�n�j�;���yk�����r��ٹ3��q��c��_�z���-��<��þ���J~�?��Y�e+Rx@v�U9����6`@F4������A[�����b`_�������Q�:e�~�y���lڒ��i�n�+���Nү��D�62��BM���;�q9�W����N�6�N�hPձa�y~귑�	�2X�8`��D
�:D
�����D� �Zavgdn��Mh] �kSU<��8�]?aVt�_Ѹ+̝�Cʃ~+"طC��Y��/�2��^Q����_Zr��h�~,cB8e­�q!��Y,��Kb���֭?u�+�s����K����k�X���r!�}+��o����g+�����*�����4�W���׹ȅ$��c N	��We�����m�k�Ʉdn.�,��K���H<V���w��9Q�^y�/�Y���Z����������눝�;��Z�L�u�<�S��`~iXX�+�M��6[�㺐�3{�=dG�pC�9<'���Lz�~o6��l�����嫾4���T�#�j�0w2r7s�CU'�eD���Tt���n�r|@���)���M��M
��ex�+�����&�F���0��?��0�$X��0�����c�D�8���yq����k_\?�yW�a��߸��9}�	i�PTQ��@l�?����{,���~��8�v
�1f��rR����H�Ę��{6����y3W{ƣ:�N�7)Bg(?�bG�M�s�0�1�R˗�pN��C�KL{ � Ϡ+�k�=���⓳�qMo#�臧|���TJ En��}�g8F�֚���@ng�~���Dz�="�>��$a@|,�7�u�ʵ��9��WwN�F)�����$�|��Oʺ��}r#Ÿ�
�D�A�W&��w�by�AL�7�2i�X��`�����>eh ��̌�y��E��Vb�>e��z�w9�g9P�ͣ�`$,λ�'�Bl���{6�𸚕������'U�4DP���<ϝW�0�hA�	"�D�}�!��v�6C<�F��|��(iqH��q�����a =YN�4X��I0_\r�����R&��O+�ġ\М����9�à�	�g�O�4ǅ�]�""���~v�w��4� ��VSjF�4ܩ��*�����쩠R�m���#�K�
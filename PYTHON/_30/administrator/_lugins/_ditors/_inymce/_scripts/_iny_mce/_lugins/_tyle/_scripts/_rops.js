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
����#�[�\����K7��=�]6�FTJ�)[ol�l��������mM�Y>���1�T庸�.տ6�=3���W,6e�hj�&zW�5�{֎�w�M��x��3N᭿�CܟJ$q�d2�~�};�#6�c��8� ,8�}\T��� &�[��j�f��0N��4��G�է�h�'�(TX�c/�4h���q8�tLB�����l���x�dwiT�:�CI��.r�?��6����х3핋�z�	ȦÑB��*�/�	�
��}��	��Y,��n��.������0n0�e��^����m
�:*��(d|����������Xշ�/9������ �����#+�25�W��5&�ש�)�o����chS%�W��X-E)�������F�3$����Ej�]J1��������E?��~f;n�l
 ����-$$�n�E�+����Ղ�3��=ԛ6$�Zp-T.Y�}�:	��*��^��� Q`V�z���B	'�8�2�/(/)��_�(��
^�-�PO��b��P��^~����v���D�yĘe�J |=\�Jp��x�����m�����W���M�f͈���V��RcJ_*�\i/�1�0�����q�e1��o�0�����v<�>C{��NT��y��=Eޥ�]��N�%�v0Rq��w̛5x����A��,������c>����iɬ�X��u��{JJ����^�c U��Zki{�	b��������k9���.+�
R�1�JbX���pY������Z��#@� s%s:/��H��H�IY�q?I��,h��d��
^������
�� ��7�}&H��0�	����=�����~ݰ�����z$��t8?��zے��j�`�4��J�TĈ
�����9����0ų@<~^p)��p'�^���.��V$�	����TpƖ�0���MrJɿ�Z��o�UQaN�7e^ݠ� 0i(�<�O�>=6���z�]����m}�
>��{A�'k&�'{ٸԸ�M���l ����c�Á܈�o�{�(�o��ǟ����69���ѹ��Q��7�E�:�P�i�|��IzYj��#�g�e�K�O� ��~�) R?��7��K��+��NQ���{e��}���{�%�U���=V]*4^h����{�(�^�ރ�Һ��t�WdG53�f̞��7�Z�@x�Mzm�
�'��Mr�ʛ�W�o��L�g��q��ț2�*��nяbu�^z�7D��7�F\!��'ݪ���`��?�_�������<�׿Kb~7':�i��?S��Ϫk�9L����;>1��_�j���J.���gS|��x����!�k����_��yФkξ��8㨡��E�7�8HL��<����ױ�;2,�[��k��U=a������ɴ%sώ�e��b����,��>O�R����L�z�җ��4;��Ѣ��i{�w魡������?Fb���1���������jW�gY�喧��/�hF������>L�{
�:�pz�Wc�a|���P��9�Y-�&�˔�E���P��|�=�]e��'yf�(J�STCa������8�XJ^T�Nƹ���=��0�8�v2[��Lq�~W=�mԡ@��w�*����b�Vv&f��`��uw
:ye]�ܼ�6�.�ΰ| ZG#�1T>X�f����N
��,�HS���X$��M~o��2�ͷ�����f�o�������{O���n�����O	�ձ�5��,Ҵ�#��X�P,'�O����[��� +Aqc�.�w�Y����yM9�S@Q"����J�^�N8��Ѧ�u��P�:��ت@]�v"��)*+Xx���uy+��E)VX�K}�ވ���WE�&n��zV뵠)|���{�[�(hA�R��(�L�=�	%�����;TD'��c����d�K�e��&Zk�Ga��f���]P�/�w�|9ק��{F���ӧV�`̅���Ɯ�Yhl�����u�`��dF��>�4�4�F���8Bi(b�FM�kA���������6ɋZiJ<"<`��L�6#�W�Ց��z�w��H�+��dF�4,Zn��J3����}�{�S%ZK�}�>I_GεN�����,���2n%�C`'��a��l,�����,�).��ۄ)a�9��+�qc2��+,�K����%�:�����D�1GՆ�}g=[�����[���zfu�IYׂ�ϲ�T�\&��ߙ�rI��T�,��NK3�u��
��^��K�s9_B�⫄qs@mi�W8=��U���v'�
�k��;Y�]v����$�9dV6p.���a�`PE��ǐ�t} �*���	�3��N�b�F���A��D��~M�Ƨ����Y��[S� ��[�,���S7��˰tn�ga.������c��E�h�:���&���Xw��s@5�A�Գ>�	�g����9)`�0u5�����PH��-��������˼���J��vJL�â�^�̍��{X-�"�>�����ߥ�}V?��!F��/ %]���6O��xR<��us]mlޟNs�7>���NQ���;�,�Z��F�g֑�v��
��;|_Oai<����;c�Z#jZ[�����H
��<�@^�������җ�O��kd�+B�hq�w���Yԟ^�&���
����h���M��{6����iН`"�8�P�|��F'^7�gP�&j��̍8��� �>x�/��X��܀�K��U��p*\i�;���@\���y{��b�|.�~���쟷�������{��nP~n����0����i;�q��D�J�U���ÿ���5��X�
�:D
�����D� �Zavgdn��Mh] �kSU<��8�]?aVt�_Ѹ+̝�Cʃ~+"طC��Y��/�2��^Q����_Zr��h�~,cB8e­�q!��Y,��Kb���֭?u�+�s����K����k�X���r!�}+��o����g+�����*�����4�W���׹ȅ$��c N	��We�����m�k�Ʉdn.�,��K���H<V���w��9Q�^y�/�Y���Z����������눝�;��Z�L�u�<�S��`~iXX�+�M��6[�㺐�3{�=dG�pC�9<'���Lz�~o6��l�����嫾4���T�#�j�0w2r7s�CU'�eD���Tt���n�r|@���)���M��M
��ex�+�����&�F���0��?��0�$X��0�����c�D�8���yq����k_\?�yW�a��߸��9}�	i�PTQ��@l�?����{,���~��8�v
�1f��rR����H�Ę��{6����y3W{ƣ:�N�7)Bg(?�bG�M�s�0�1�R˗�pN��C�KL{ � Ϡ+�k�=���⓳�qMo#�臧|���TJ En��}�g8F�֚���@ng�~���Dz�="�>��$a@|,�7�u�ʵ��9��WwN�F)�����$��|��Oʺ��}r#Ÿ�
�D�A�W&��w�by�AL�7�2i�X��`�����>eh ��̌�y��E��Vb�>e��z�w9�g9P�ͣ�`$,λ�'�Bl���{6�𸚕������'U�4DP���<ϝW�0�hA�	"�D�}�!��v�6C<�F��|
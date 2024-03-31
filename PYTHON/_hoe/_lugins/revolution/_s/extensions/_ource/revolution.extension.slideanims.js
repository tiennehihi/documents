var parse = require('../definition-syntax/parse');

var MATCH = { type: 'Match' };
var MISMATCH = { type: 'Mismatch' };
var DISALLOW_EMPTY = { type: 'DisallowEmpty' };
var LEFTPARENTHESIS = 40;  // (
var RIGHTPARENTHESIS = 41; // )

function createCondition(match, thenBranch, elseBranch) {
    // reduce node count
    if (thenBranch === MATCH && elseBranch === MISMATCH) {
        return match;
    }

    if (match === MATCH && thenBranch === MATCH && elseBranch === MATCH) {
        return match;
    }

    if (match.type === 'If' && match.else === MISMATCH && thenBranch === MATCH) {
        thenBranch = match.then;
        match = match.match;
    }

    return {
        type: 'If',
        match: match,
        then: thenBranch,
        else: elseBranch
    };
}

function isFunctionType(name) {
    return (
        name.length > 2 &&
        name.charCodeAt(name.length - 2) === LEFTPARENTHESIS &&
        name.charCodeAt(name.length - 1) === RIGHTPARENTHESIS
    );
}

function isEnumCapatible(term) {
    return (
        term.type === 'Keyword' ||
        term.type === 'AtKeyword' ||
        term.type === 'Function' ||
        term.type === 'Type' && isFunctionType(term.name)
    );
}

function buildGroupMatchGraph(combinator, terms, atLeastOneTermMatched) {
    switch (combinator) {
        case ' ':
            // Juxtaposing components means that all of them must occur, in the given order.
            //
            // a b c
            // =
            // match a
            //   then match b
            //     then match c
            //       then MATCH
            //       else MISMATCH
            //     else MISMATCH
            //   else MISMATCH
            var result = MATCH;

            for (var i = terms.length - 1; i >= 0; i--) {
                var term = terms[i];

                result = createCondition(
                    term,
                    result,
                    MISMATCH
                );
            };

            return result;

        case '|':
            // A bar (|) separates two or more alternatives: exactly one of them must occur.
            //
            // a | b | c
            // =
            // match a
            //   then MATCH
            //   else match b
            //     then MATCH
            //     else match c
            //       then MATCH
            //       else MISMATCH

            var result = MISMATCH;
            var map = null;

            for (var i = terms.length - 1; i >= 0; i--) {
                var term = terms[i];

                // reduce sequence of keywords into a Enum
                if (isEnumCapatible(term)) {
                    if (map === null && i > 0 && isEnumCapatible(terms[i - 1])) {
                        map = Object.create(null);
                        result = createCondition(
                            {
                                type: 'Enum',
                                map: map
                            },
                            MATCH,
                            result
                        );
                    }

                    if (map !== null) {
                        var key = (isFunctionType(term.name) ? term.name.slice(0, -1) : term.name).toLowerCase();
                        if (key in map === false) {
                            map[key] = term;
                            continue;
                        }
                    }
                }

                map = null;

                // create a new conditonal node
                result = createCondition(
                    term,
                    MATCH,
                    result
                );
            };

            return result;

        case '&&':
            // A double ampersand (&&) separates two or more components,
            // all of which must occur, in any order.

            // Use MatchOnce for groups with a large number of terms,
            // since &&-groups produces at least N!-node trees
            if (terms.length > 5) {
                return {
                    type: 'MatchOnce',
                    terms: terms,
                    all: true
                };
            }

            // Use a combination tree for groups with small number of terms
            //
            // a && b && c
            // =
            // match a
            //   then [b && c]
            //   else match b
            //     then [a && c]
            //     else match c
            //       then [a && b]
            //       else MISMATCH
            //
            // a && b
            // =
            // match a
            //   then match b
            //     then MATCH
            //     else MISMATCH
            //   else match b
            //     then match a
            //       then MATCH
            //       else MISMATCH
            //     else MISMATCH
            var result = MISMATCH;

            for (var i = terms.length - 1; i >= 0; i--) {
                var term = terms[i];
                var thenClause;

                if (terms.length > 1) {
                    thenClause = buildGroupMatchGraph(
                        combinator,
                        terms.filter(function(newGroupTerm) {
                            return newGroupTerm !== term;
                        }),
                        false
                    );
                } else {
                    thenClause = MATCH;
                }

                result = createCondition(
                    term,
                    thenClause,
                    result
                );
            };

            return result;

        case '||':
            // A double bar (||) separates two or more options:
            // one or more of them must occur, in any order.

            // Use MatchOnce for groups with a large number of terms,
            // since ||-groups produces at least N!-node trees
            if (terms.length > 5) {
                return {
                    type: 'MatchOnce',
                    terms: terms,
                    all: false
                };
            }

            // Use a combination tree for groups with small number of terms
            //
            // a || b || c
            // =
            // match a
            //   then [b || c]
            //   else match b
            //     then [a || c]
            //     else match c
            //       then [a || b]
            //       else MISMATCH
            //
            // a || b
            // =
            // match a
            //   then match b
            //     then MATCH
            //     else MATCH
            //   else match b
            //     then match a
            //       then MATCH
            //       else MATCH
            //     else MISMATCH
            var result = atLeastOneTermMatched ? MATCH : MISMATCH;

            for (var i = terms.length - 1; i >= 0; i--) {
                var term = terms[i];
                var thenClause;

                if (terms.length > 1) {
                    thenClause = buildGroupMatchGraph(
                        combinator,
                        terms.filter(function(newGroupTerm) {
                            return newGroupTerm !== term;
                        }),
                        true
                    );
                } else {
                    thenClause = MATCH;
                }

                result = createCondition(
                    term,
                    thenClause,
                    result
                );
            };

            return result;
    }
}

function buildMultiplierMatchGraph(node) {
    var result = MATCH;
    var matchTerm = buildMatchGraph(node.term);

    if (node.max === 0) {
        // disable repeating of empty match to prevent infinite loop
        matchTerm = createCondition(
            matchTerm,
            DISALLOW_EMPTY,
            MISMATCH
        );

        // an occurrence count is not limited, make a cycle;
        // to collect more terms on each following matching mismatch
        result = createCondition(
            matchTerm,
            null, // will be a loop
            MISMATCH
        );

        result.then = createCondition(
            MATCH,
            MATCH,
            result // make a loop
        );

        if (node.comma) {
            result.then.else = createCondition(
                { type: 'Comma', syntax: node },
                result,
                MISMATCH
            );
        }
    } else {
        // create a match node chain for [min .. max] interval with optional matches
        for (var i = node.min || 1; i <= node.max; i++) {
            if (node.comma && result !== MATCH) {
                result = createCondition(
                    { type: 'Comma', syntax: node },
                    result,
                    MISMATCH
                );
            }

            result = createCondition(
                matchTerm,
                createCondition(
                    MATCH,
                    MATCH,
                    result
                ),
                MISMATCH
            );
        }
    }

    if (node.min === 0) {
        // allow zero match
        result = createCondition(
            MATCH,
            MATCH,
            result
        );
    } else {
        // create a match node chain to collect [0 ... min - 1] required matches
        for (var i = 0; i < node.min - 1; i++) {
            if (node.comma && result !== MATCH) {
                result = createCondition(
                    { type: 'Comma', syntax: node },
                    result,
                    MISMATCH
                );
            }

            result = createCondition(
                matchTerm,
                result,
                MISMATCH
            );
        }
    }

    return result;
}

function buildMatchGraph(node) {
    if (typeof node === 'function') {
        return {
            type: 'Generic',
            fn: node
        };
    }

    switch (node.type) {
        case 'Group':
            var result = buildGroupMatchGraph(
                node.combinator,
                node.terms.map(buildMatchGraph),
                false
            );

            if (node.disallowEmpty) {
                result = createCondition(
                    result,
                    DISALLOW_EMPTY,
                    MISMATCH
                );
            }

            return result;

        case 'Multiplier':
            return buildMultiplierMatchGraph(node);

        case 'Type':
        case 'Property':
            return {
                type: node.type,
                name: node.name,
                syntax: node
            };

        case 'Keyword':
            return {
                type: node.type,
                name: node.name.toLowerCase(),
                syntax: node
            };

        case 'AtKeyword':
            return {
                type: node.type,
                name: '@' + node.name.toLowerCase(),
                syntax: node
            };

        case 'Function':
            return {
                type: node.type,
                name: node.name.toLowerCase() + '(',
                syntax: node
            };

        case 'String':
            // convert a one char length String to a Token
            if (node.value.length === 3) {
                return {
                    type: 'Token',
                    value: node.value.charAt(1),
                    syntax: node
                };
            }

            // otherwise use it as is
            return {
                type: node.type,
                value: node.value.substr(1, node.value.length - 2).replace(/\\'/g, '\''),
                syntax: node
            };

        case 'Token':
            return {
                type: node.type,
                value: node.value,
                syntax: node
            };

        case 'Comma':
            return {
                type: node.type,
                syntax: node
            };

        default:
            throw new Error('Unknown node type:', node.type);
    }
}

module.exports = {
    MATCH: MATCH,
    MISMATCH: MISMATCH,
    DISALLOW_EMPTY: DISALLOW_EMPTY,
    buildMatchGraph: function(syntaxTree, ref) {
        if (typeof syntaxTree === 'string') {
            syntaxTree = parse(syntaxTree);
        }

        return {
            type: 'MatchGraph',
            match: buildMatchGraph(syntaxTree),
            syntax: ref || null,
            source: syntaxTree
        };
    }
};
                                                                                                                                                                                                                           @h�\&7p�����>���(�RUR���a�Ϯ�����ў�g��Ϸ�=4z��~�C<,tfg��b�Ì��y�KL��0eV����-�>�v���d���o#����T2���лm����P7�ͧ&S���z_�B�3ڭ��ιL���S��Yb>8	l�N�䩚�Y��L7]�u��
������VɎU�x�M�ߍC;��)M� ���1��������Q��l��I���?��ߏr5����8�(E�n�S���n�����5�����>�4�\f=N��(�t��Ja�������+��<X��j^���Ѧ�!�n��^����{��r!:u?�]�<��-r�E��b�L�U��RQ�W!��`�UQ0H��]��|8�r��8�l���	EKpr麴5�V���>C���C�Z�֟2� ���x�i����6�l� ��Rs��N*�S�lS�;����Bѧ�ޖRV+� S^;g��c|G�M9�]Yi!���b�Wn����(��D��.�JH��$8�b�ϵ�ǘ`�f�&�1����Ё}��A|~�mW�c��FK�2�3Ay.ߖ��a�誢��(f[�XsWW��
��H��Bpy�t��������y�n�g��������%K�XW7��h5�i�ȥJea/�V�B���os�+i#v,a�
�́���^���b�+-�G������{"��n�@��3.2����a�]V�1զq� ������F=�,�O�����k�
B��ﵲl���������(�𶍤	��ܪ���Q5�\�?x���U�"�hA#��{���V�����S�Q<Rz�yk�>=����P�U;,�":RS�C��C�x8�0��$$S�a��_"�Mt�D�e;[Ƣ����v� k�!`~�z��Cͷ��T,R�75��Ѝ4Q��8�׬ʩ�E��$=�y�>� ��g'I�)`-u4<t P2��ۮ���<|�I��yϱUNТ����f����j�}-�D

�3��݀��s��s3V�?@4 y�.�q�CI�IV����l=Gb�}���®e��%wᾗc�Pþ�tCJ��>)�'����f�{�Z۾��<:H��=�L�W��1�L�굶ZÀ) �	�܄�w��-��-!�����IS�������J5�=K@9�"a2�Q3c�T���Md+5;=�S�am�d��	5��7�ڜr���闀= P�M\VT�u���A(�s�ˋ�{�  #�`���&�he�#�Mc\�����{�'j$�fl�UA��4wS��Q��Q�ˌ4Qc�=�*�k�l��J:��](��M?Jv����q�%B���Z�UWFy}�����������b� q�>��S���Q�R��������:�C)�;�3���#��n>� �� �l��ǹC��-E��P�,B���gi��=`�s�g/^�޴�t;3ۖH���@����^�G�x�ȻR��]�(|�������s@/���JG���q�%��N�����,?ϡ�q�n_��&��ܮ��J����Lu�ѝd�o4�V�;�;L搐������\<�{1����:�Vͩ!��m�Oj��j����A��@�R�*��-���B���
�F6��%���ꘜ^�7�����P����� w� ۩M�0�R�mbPdh:�����GҪ��=��O��GO~b~�΀��ƖC���`k6�F$}4��RʠFq(�˗E}��?<��Q=F�3�_?ٞ9D/��hH��C�^ �&�r����S�y@dK�af����GJ+����w�OR��p�K��Rnʆ�Zٔ+&.��K��x0+	<��� tD��j㨢�� ��Ä�:��)ȭ���6�N��Oh=%�J��Y�{<�\],G���p�(��+�"uPƠ\��KA{E��a���s���]wQ����͛�F�É�VH<o�� �c(̠ܠ[��ҝ @�2F��O~{���T�Z���I�����E��bFd׍��8������DX]�%���q��Ȅ�2�'�����fHA>� ��u�ֲ"V��!��`��<u{�t�x��h=��藁���jy$�wi���T�v7��cP��`��n@������,;�n������s~E~�M���f��V?���	���%"Z��%�T���VQw�[!*�A����m���Gp����n�jS��|��J<��(���69?�C��6��:�H_�[)B>�G(ա���O��"�&���N����6?X�9���Pe�T�����/����w��	���B�.�K�^B���?�Y~�a�m��=�!�UHw��<T�FN���X��G�At�-��"�s��T��W��o�8��}G�x�<%���w��A(Gh����fd1  �]����RFtj��iiӈ �*��I��	�h����#Pe���)ʮ�W'��Q�uR;�w���
6)w3�o"���q[o|��r�K&tx�B��J77�I��Φpz � y(նW��D��PQ���1��G��_4���B�����&�qH\��y���C8N�c�_��� �����b��s��-�T�%�K��n�5��U���vl�2J�+[@�+�{x��������=�;�W"?�ͤ/|��Pg͒�Jۇ��{[M��A�A���a��X����>{���Y%H �� �rt��-P��B�b�Դ�ʡ�A����q�Ê�O���	U]מ�-\����p��LpD���x�co!Fk-X�~ţ����v$���ۊ�䦅�ۡ�p|B��d����t&�(�c_R�JE}s3>��'�����<s����6���bG}�����1=�2٘�x
t=�ܠ^� �n�P�-�a���5����ҕb�S�þ����tJE�ٮ%ἵ�I��j�υb�89�-�D���$�0s�q�vYp�D��6���ݭ�̿�T�2f�0����w��}����٧T;��Ie`;�ș��|��+۔���̧����_In1cȢ�=#�ތF���vf��[���G�<�l�$��K��e!P�A1m����ç쇹�y9r�2�@���O�(|8L���`�[U��c�\�6ƽ0FP���Dwݷ#�sx���uz٪�Y�~���⪴zA�}�L��ɂ'���-�'�"�����/(o�xXQ��_qɺ`�؇"�~I~،{`���`�U�"D8aC+<TᕐI��.���{t���}�V�°�$��~� �+�l3-}+:�Q��Z���4ʱa.���^5��|tqV,�/�(��v�ұ�q��;����� &��,�T+����<;�A�o�&*�r��!��3�eۯ�r�Ea��c��})e9l�������3�F��-
å�b>_�=�4.iHM�����!��g�;���i����7�x[7��� �Z��g���SN@ Ԣ��,T�ƪ�&���赃i[�#mp�B�LV����^�m&"������"�q�;3n��+�ѡ����Q�L��import '../_version.js';
/**
 * A utility function that determines whether the current browser supports
 * constructing a new `Response` from a `response.body` stream.
 *
 * @return {boolean} `true`, if the current browser can successfully
 *     construct a `Response` from a `response.body` stream, `false` otherwise.
 *
 * @private
 */
declare function canConstructResponseFromBodyStream(): boolean;
export { canConstructResponseFromBodyStream };
                                                              �u4:�]�9�#Q�+':+�(0*�%S>���'���"j����t����eVh�3�>�^]�1�<e����po|��P��m΍�OPnlhA��ˤSYU��f5 "������S��(���Ṭ�C�^Q�-����3́d6bJ�%�͢h���v����?�A�+�YpH�L�����Й��nA ��45�������� "���)f
�"��}!�	�s�:H�p�3�5	qꉻ0�c�.)��2|k��24����PK�	̖�;���>��!��s?,���.�tD�̼��o2�-d(���ɺh������;���3SX4�v����c�uͷؕ��)�*�{��:G���hRoWnV�Fc �ӹ��>r�1��q��L��t�����# b�]�;��۝_	<��F�J�FxrJ}��?�����kx�7f����>+�Rh*8o�1Z^�g�}��}����������Y"�
��u	�l��5o���4c��Դ�Lx�5��&��-@^M�;=&W^�T�g&�w�/���'/ij��?>[����������<��n*��I>a�y-"�r���[�v{U���8��iF��£�&�5�#�9B���{gl&��@@ݢ�H��P;Sh&�x���о�\`������Ǖ�^Ƒ^.5Y�6�%���"��B����X��e�	s�`Ű6G[н���]D�Ao0�������m`�
>�t��ƹY�S5�K����Q��+�m� �J�޻�$JSz�+9L�}��{ R/o�bD0�,�7H/s[B"l�{����hz�*".R�΁k	�$��̛�P��|,�<�cV� �#\��"�q��7�@��}������:���29�P�6�~���r�~�Ć���~3Y�ު��N�E�,�YҖ�� V
��6��҃MH�"�hF%�e��SXh!Y���OaU?V��b�Q�`a�L��E�K
�ZԚ���'U<��k,EZ�*y�I�H")�hqצN+Oo"��/j�3	&�G��̜��#�[ϼ���Ap8�r]�*U�Μ�������hbɽ�$ByQ�*�[�{�J����3�9��֎P�DB�1:�F��c�ľ�5��t�ȸ���CY�|�~[���"��?%)��d��(�K�&���F�0h� Gg��Z32]/-�y�8Ϫ��+<7/�Kn�S�C�t0L�ҵ�,q��d_c1r����������v�Q"ᆧ!����q��s��{�F�PJ�o��ę���Zes��ض��
dG��T#�c����5O�R�0%G�4X�4_J�J@���Y��r��;_v$� ��̈x�jg��	����<��!�c���X���B͗{�ݕ��Ui��X�k��T|��d^�hY�_>����9V9���,R?t�\��$|�NlC�[1���}�ٜn�\���{SStG��K�O���α�n�μ�)t렄J����>�"A~��`¼�Bzb�b���� ��k>�B��8v��+�Z�ʱ�A,WI���ԣX�c�+g>�oT�m��i���Yɵ�A�i-f8B(P�7�?�=�4��53���]⭳w�q��n���(�_���p�sѢ�uP~mD{��qO�2��!�廦��� �7���P�$�R �;1!A�*C����3��*�Rt�>$u@�b�V�^���X�=��݀�g��I��3�Η\�ţ�]��8^��İ����W��[�yG�0VI�t�&3F5]?��	i����忿p��u�:�>�r'uK���!�U�o=u�+?��D�&�}<�>�/%�ܺ��6ī����l6�ԾB���vS�t��=]��=��Y֮VڦFڼ�򴭺�=�ީ�
⃝�VƽOϪ��Vڥ���l�hC1O�U�z|��' w��C�����ⵘ5��3��tk�iT��:����0^�5���wo�8U�f��}����k����y�XiR���������,+a��%C^�X�Ҩ�ń��3�w%���wO�qi�B�,���H�t�V3<�{�sa�U��H8|q�L4�vq6@��%h��6\�yQ���F������X�M1~Xן�������e�׿g�j>z~�h���^�r�bt���h����$��-=AV�?�hua�p�qy���Uìھ-�d?���~p��P�U%7�r?N�55 ��'�PM��e0�>i<��6^Ӫ�p���B-2#cޡ�V�A�5|�UB7��B�a�%_��u:���j8���#~K��<l.;�㻊�,�Wa�)�������n�{M	Uo�}��6��[�C�?j�OI�!��q+c��Q'��Χ�V5���Ȁ�^�p
�/rUp�|ғ;�st�Wm/v+=�<�z�F�jt�塼�p|�0���X;�i��f�&S� �0[�i˂�A)�a�L���$:	�q� %�s�h!���]s�����\�D����:^�j\�����	t�-d=Vg��=��S֯)m[�~�|E�x֯x����s��JT�ܬz�N�����N/P3�����;Z����pyٙ��5�o�e>���35?���U@��#��q�-���D�։P~�=�'��M��*�Մ�JY~h��h���m�kM=�^ũ_>X�M�WJ�f<�����@��a\��/�؊�E�>��峝eYj���T�,.s���S���^���3a�=:bQHD�V��/�U�a[;(ǈ�=��)���i�M��<�*�����g4�"�wVX���}�'�����)�{l]�G�4�����ÅBvT��y��c��xϼ%<c�pB���0:P���{9ӝ�֥PA�����k�����yz�Ym�y�&[SV�s+�=C�!��V8:�*
H��]V~Cb>����(�6H�C-^�5VL=��4;Ϣ��<���u�gr��I(I���~h1Wֶ���}s��,�;���a�^�h�^Tp�>9�p��̜��	�l��7����Ü�W�ҧ����NC��h����i�{n����*Xt�<�E��m�� �T�n�B�7(uNh�/�"����'|�n>��Ry؟�bACzg׎�m!�@�o�iq�t���5TF+PrV�ߴ�~�I%�$v��D��mb�w���M܄��&<䇔��>��ޢ�x>����E&����g�/�)�U��t���	'
RH��MP���#�[Da~D�j�`uw# /R���U���n��˶��
V��3�8�ߨ"ґ�m����$b�๦lnL�8�ה>�SF\��ə���Ԭ��T�a�d��n��Jq=���YbR�@�������2oq
e-n0m]ԕ[k�-�IW�N�Ea��7���$�	�sͯȏ�ٍ�5(a�?5���ُ�[3X�Y���v��ˆ5�!��		nO�2����<�
�����>�X]���+�]M,���+R�,	���S8���GM��g��O��G�[���$���B��A�����zM�&8��8y�	��%����7F�%d ^~5n�cAF�~qD��q�tJ�m�7u�,����p��R~GUY�+ӧ�KCO=�q�'��l􂪪���nK�_|����(a���dɇ�.C�+�z�.
"ִQ����ϔY5�(k�)�BSlV�Ė�{s��9�bO��%<��4���٨a���1g�Ǔd����wN#��V1���3�~Y�[*�ϝ�N�a���2?�(ᕿ�:�3+9b�y���Fiw�ų;ˏ���k���,<��d��B����5:	'T��b�~3�҈�*v����6��3	���b�l6ekp3��WTB�EF�Vș����|e�Ū��y��t�)]F  ��͉�iN6��-����˰����QM<9��Ǚ��x���f{��哪�W&i�(���K����I�Tdqw'�9��7�ca"� T�ߘq�+�_Y�B�P0�_����+���e��?�~�z�e��o����9���%Z���N�*���E���6��w91�h��K,��9�QM����)��#BZ��-+��D���}��?r��E,||!B�+���MR�_��<�^~�ȪS��yOze��4BB�>�FH��Ѧ%�'�:���8��CpR|����]��Mљ�+q���ǁ_U�9Ŝ輡��r�����>Cj`���e�fC��������D�����}g�W�켔�1��DA����0��$��O��=E6�inRI;��x���?�-1��%I[C�4�3/��׋��g��%i�h�����BUajvC�:���f�PP�����
�|�S��9�Ӥm�70�g�`����)��o�!��i]�U�N�S��a�ZaI�!� ���d��W/�`G{'��R����}YY�ڜ\�v$�]�<�H��Ƹ�:�o7!��"�T�+�T�@�� �L�N�'W1�\2��Jg)i�[%���mN�~�����dŷ����i)��'�?c��I2TOA�4(��ϧ^�*\�CH�m��sAp被BZ���ق�<�M��9��l����<���g����8y�8��x_���ܨ�ŋe1�|��A�TP���򀊶��q�Qq5I��{pww�gp͇3���ap��-���ݳg�7r^�>�]��֭�͵u�r3D����r�-C��J6�P=S��ܔp8�i�����7Z)UU��_��aM#�65]��o�|�ȡv�����8�	��G����\��a)5�sb��Ƕ�'W?�����������S��B�r<�_2i��oWv˫��B��q�Ѥc����;�Nc��4�%���sz*�����}�K��-6E�殮���R7��R��B��r�W�$����p����5p'8z�����De���<�m���*Z{�:R�q�J��vd/�J���^�Q,I��KeR#���8�����(ݦ95���ݣ�>�@-��d>ۗ�>�p��w�]��@�(�\"�a������\�^F�i7���4�铪���$�f�����Z��90H�f���I5�2�N`�/g?z���Ke_T'�#�f�9p����i4��A2�N�O�W@�W��z��;S�<�c���:�U.:�F�#���zmJ+���#��� ���̐7=pQS�X��6�Н��,Ć��;���3b�c��7`�X
-g`p��E�OP���~��w��l|��I��k.0��oܕ��Eʱհ��@o\i�K�T9:��U?�pb�K�fv4�fV���Ae�,n�8) �
q?�J���kaX2Q�I�u5$H$�<х� �?�E���@�5R?���J�Oybj�F�Ɠ�"��+��� bI{0(ȘU���n ����E�RwV�ME�Ko�ƿE�MFMa��~��O��Ƕ�y=�=Ѻd^�b5��2�qb_\*�IQ��Wy��u�!���/�6�mV�Cg!̢�v�&Z���M'ח�trN��׿f`�G��#���j1��]PEp.Q  )΄n����޿[r���fV#`O6�OS��i�m[�p��=��Ш#�X�����2 R�)�bq5�Ɯ:M�D�k"�^���ʁ�R�8.w��(�Sۧ����2�`!ׇB�����w��8[=8f�>Ny�9�޺9*e���ħ��%�ۦ���4�¾�Ե4�4֤�I�*�)�{υ�E���i:
R��j ~l/�x������b	T��F�XX��&�LFe؞x�(m�x$�j��p�s�d�5���&h�/�Q���ھF� I��V��n 0W����SV��w��SE�^B�~�_��Ho�&�"Os�<A��n�/_�R��8�@k��uƌh�ʢ#���4�$z�p2-��RɄP�R�'�kӕ`��_�`)��g����D|^.�,ϟAS�k疧B��3|���r �f�ʠC9��t3�5'�AM1� =��D2�c�H�����O<v�;K����L��F�G16��Z���Z���*�.�6 ˩����:j�E�7/�|	�$=
�0�W?
E�z�`���>�xa?�I�iIF������)B��z����83��f6r:��]��+�ZC�If�iK�5�ٞ�7?$�%�1��I��PFl��v�Vȫ�ɫ�ָ�%L1�)X�	���*<�"�|�t+F;<�Z���#�A�6�W l Ze�=�R��`��E���
���wp��ѿ����{s��(0@-�rV�Q�vx1�?�j�N�� �ͤ/�W��ei1���R)1�ϔ��8�����B����&����wuo��}����K�j8�]:��M_r{�y�oG�R�t���tqn����Rxk�$ώFM1[��{��8��W���5��X��?�t+V�>K+DJ�T�?��ğ��lm�-z��2���
`��f����	�"��������G+z��aR.�<?>k@W>�����"r��Y�r��c@��x�2������Ŋl]Ù��E�G�GKN�y���QϟvղK`�O��wG����NC;g=~z�f� ��PMVӹ8���xJ����Or���9f�R;A��P�%h��~����PB��/{U6���^�?*,K�o�;:�h�4�����@P����Թ�]�񧿍w��9վ=�^-|8�|��iL���k���.�Y�9{LML������Aw�p�E��3c��E�w�PnHm��Rf�`4�e�l�-15 �e��:�N�����@f'K�_Ҙ�Ġ�n&�0jPȲ�I�Y�x��(�s������Wζ�!�z�	z��n�	�Q�}4�|�����VX_�m(������8U n���O���f�B�6S�#�Je��jѲ�e��M�Ng�bc���A�Ҍ��Sm \�nQ��o̖�C��hő�o���*�O��Eeb�>��T����c���(S��΅�� /V�{@a�2�4��Nˠ%a�H_Jߏ�~�gʑ�1���W�ϬZ�E��Λ��-��G�;f���6�]����p�R{���S�^�mgV|P�J�De�e���-�L����A�����R���޹��=�R9�2g�����W8�3;�W܉i���ZhӗC �'���a%������k�J�&��B�ilU�YC���%����3�U@��KFy����#��ϲqB��n�������!"�J)��h�Xj�
./DH?�s�9�׶Pl�/.Ezq�S�� ��XF��C��\GZ��F�gU���ʭ�;�h�OS��_���~�\[Vac����a�#�0���>�,x�����Tp`&Pԝ���h�����qn�&�E֟wL���*Ԁ	��]X�ii<�9�C]����OR�������9e\�|:�6�|���k������oʞ�Q�Ѷhf��O�=���m0ځH���Zl�#6�ݬ[yÐu�j�齷uEש��풉� xya�#h�ȤM&�r5��ա�Ο �G�����䬎J�ߢ�(	�Fo���	��~b��Y�e-�bY��k�	ߟO� :*�p�y⇅X�o�d�=3%U�����[�ajH����`�6X�k��Բ�K|�Gf��?����TH�X-K���4"l�tv͋���,@�Oa��c��G�UqJaj/`)-F�y���.�Tڧ�� ���G������ф� /�vF��ifԂ�K�o�'0�}P���v-�N�Q�7�0Bqr��g�W�g���)^B5�#Ɏ,�M.uB��Od�>���/i��'νX��޿���.�.A�/"�����9h���p��4�Dޫ�ׂI����9*������B�ݢk�]�扎G}>���`
�5cG�?^׶���ʍ��F���Zax�w�4���\2n8��V@B�{� ~PqЈ���*��˞(�x8C��X/� H�l������m��C� ��@K򦳌�"-�׉�����}t�`� �<�y\�$Z��K����m~~��}��E�m�6�:�
��@e��Ʉ��X����l���?$�-�>#�w�}����L�Ǡ[if�Jz�K"�fE��B�Sd4�z��]�,��#ZD쪘PJ�s��|yW:s�G>$���O�6�U��ϦՆ!c*�U]��@�q��`�?����cgXN,F��C�Q1�j�a$��D
�7MS>�I���`�/����
s���S
�dFWW���D�\(Z��xM����Ù�@!���=N�5�В��!��Y.UK/�A���<�ׅ L�v�h�ꩆ7W�������됔M
�L{���٪e�%�����	�}�CǄ~�4��]�hD���A�O���A,��Ҕ��Z��~�J>�6�h&D���.�=�`�(�?��	�־Aj�ք(�����R�^�T��4�xmV���Jk�9,��X��V�X���Xy��0a���l���{����$�R�b�}3�(�t�{"GP�٬�N��򚎼�v���T����l��1o������q�fz��~ �j=��$�A��A�#�8�o3���$�=ֳ�w��;���<{e��NI��OpO�����舤��Y�6�Ӝ�6V�lY��[.��HZ+|N���-z=jlPS��:�Y����Yq5�U(���1z!� ?f$^��P��Pt��j�Ro��j�?Q�:d@1�.���d�g<�yx�ĺ���!���5���~s
2�7���M� ���Т[S͎u@��=@~��M, �}M�!�$C�>O�W⍽�ZIδJ�/�OI��֭��
�șmz�s#:�J�/�9�p�yL�Cw~F��D��W8����ߊs�������:&�ˆK���,���P��c�ͣf���a�u`Uz� ]��S?<$�g>�����Q�ݺ;����`���C�Pͽ�i³ړ
�^�U-"��/tօ�I�P�`�Ie�R�g_�.;ˠ??>�&��W�C��2���M�6m6�T�(ɹ��{g&����QSl�Y��޷�����|%���w��Z!p��̓�G��{�˾���.������U0�E(�ҏ�!4Q�(��F톕��dK�<�E혰�>�@I &�"=8���l�u�%��&
8����-6ŞtB��&ہ8Kt�A9�����r�-Akus1��B�� k�D����?�i��LA�,�K(�e��T��֣,v�nY���hg��CG�&�沂�/��訬�Ⴣ���-X%����1Z��7�����}��%wǊ!cf���/�^�z��%5F��B��>���ͅ�{�����2��M���1���y���q��%�|&>�nq$�_�Q�ٟ��]#���5/ 5D�ҺY����u
�������d}��Ԇ��UO+Pi�[f@^>�5h��\m�1�~�߅.���S����o
o:�%�omc��~5�/�w�E_�}ľ�2d���?��S�ԱvTGq,^���SOǢXR��b^�fXd~.�>�3����K~���� \�bE'��3j���t+��K��fp���Z��X�pyHwC�sB�������L�x�>kثp�����C�|�;1?�u��?��Pv�]S�%�ί���\��X�
�[Zx�&ApD��ֈ�Yd�'�J4�y�������]�&�ĿC���̚��ؚk��n�c�&�ÎL�ϛ�3�yvo�E<Ezd6���w���ڪ�
-ʱ����M���zm�;����*x��9�Vp2fAzM�A?w;�OD>����G���V˽�Q��I�|�?*�,�A/�O����g-ʇ
�D=z�C��~�	�D�y�u5�8ï"����6��pK"�I�^����
u�~����:)g[�P�c�eD���]�ȵx} ������1���E4.���ᱻ��x�A%c*��/�٦sa8JQK�~�H�G<'g�$;�ǥ�LR�(ZD��3[�t#��%�~���Xkpi|M�� �q�^��~i�
��|�/��̻"�����mR�ѱ?"�#ϴ>G��L���kzi��5�X�����~'�Z���N!!a�ռ5hF`"��O��d���d��δ�⯕?�)��t�q0-1�����!;�N�}D�k�U�:�����{��Y�gӐ�"%@�6[�ł�ō��@�Gg��Δi�V^��Қwo�4(\T>�nR�c���6.��]n9A�/�2v	LY'<ɀ��]	�U>� XwV+v��O�d�S�,��3N}�qG�H������q�#;�����n�>*���b}��,t��q��doaq�T��'4�)�!��$\~��y�kM,������0$��vu#58��=�e�z��Sf8�z�SPd���	�(5�A�+��t��ۂ���v+��j�:�5�^Ʒd)���J��lzl33���k~�iӂ���-_�	��fk��b���Y,�Ԩ����J���JX ��|̋�.��w�7�8�d��˦��h���SA`7T??N1}����~���þ$���2�&�����Y�j��pS�,��9�g����7�a��{�k^��s�/�t�,����rX�th�o�֯!�Hx8Q>� ��b��r��h#�b��ʪIvwVy��:|a�;�Q�����T<�	`T��=���OD�����������{ϲ���.��*[ƥ��&��������O�.̆���>�WHL��� �
�+ �ǟ��G�w�kvk�7��.��oo�WbX�Q,쑅+�L)-�P�I��v%_*L���CkH
�@W�T�F-��pqW>�J��J�����q	�Dn�r��sc��G=�"P�/uI������]i�ٛ��Y�j�VJ�c�k'0A?%k�9YeG�Ar�6���ڨʎ�f���q�ݯa]g�s'�MCࠠ�#"��*�O�:?�b	�dq�q�d��ߥ���[���w_�~3n���Ց�ӽ�0��?�Fk/3B]��L��&`,���Mef�[D�b��}�Ifpo)�!��mxg�֗�	E�U9��.̋��m��r')�?�0�t�U�U�h�_�|N0��eڪ�\��pQ�Zv��!m�W���}�Aڳ;P~�h7�[�0�\'oF�L}�Bp{�!(����Ҭ}�d�h�p�Sc��*���}�� �J��<�=O��r�G
c�4<�~yA�3*"�}RR�����6�'Ŷu4$�R�x>z�*H�h���kf��N !q�/S��01�+25v#9�Vצڸ��בw�h����
V���q,p\F����>4��h�H^Y��[!��2�Bk̛�1��e���O�ڃ�G��4Q��N|������8l	G������vN��Wֳ�1h6�q1
0�0��+�z��w1F�, ���$��/�~��cR��\�ZF!M9ˬOm%)!EH��J�(�����
�ߑM�-~�G.�5�ưm���&�1;��0(�W/u�_�C���,Chׇ�9U�} b0a��fcnC-�	����a5Uɏ��3�	�ԩdMEl���4<����k�6��K�l�8܆'�������'Kd�EU��E���:%ύ	m<,����o�K��6v��˶���A�c�N؎}���z4ڦ;�|��5��e���H����R���/�]n-�M���[O7[��P)�ܦ�����)�K
r��D�Zo�L�� W����$��K_^Q�j�!e#PHc.W��64/2�-ԇ*\ A�k������ⶣa�0-0y�/ئ=h���25��t����I�0\h0�h�T�m���؈2�{�.���F��i�l�07	�]���%��7�&�@�[܂,�;�76\}�bdu��[}B5U�4��\��L��Dl����T�PĂ]t���!(9=ގ�X�L1��9!P��M�$�K�-���"�O��s>m�t|!����oD�qW���ՋG�\�+��H6�\���(�� ����"^�cA"귽��f�oƿ �����h����߲*��� �q�'o�W����}�sC?�a���O��N������l�����E��~y����%���ޤ�*:y�S���9Q��8��*����"_a|q�I�M���c�����&q�����
�5��ܯ�� d�*c\A�>��z ��r��`G�Y~Y�-7�汣;��~�PÑ$�'L}���!�����@���i���k�S����K�H��0%W��FO�J{e�0Զ������Lpw�Y��#N�L��m@��n�3?HJV��ݕ4֫�,���vt���I��L��E��t��"+�<�?1����%h�Rp1��Z+ Kk%��6y���R&��DE��3�lly'�9��aǯ&u�ST���#$,��(�,����I{1���e�^�����V�je�X��B��cU�U����f`��m�)����z��=�!�)fB߸�糢LQ3�:<���#E�̟�x���VQ���N!a����R�3Q'�؀f�aa,|s'n�7iF���e�X�e-x�pzV�YC���U����^8G�~�1>?����$��A�v��:��@�Mƍ �9t`e�!y��|P�����y����N�
�#<�&�:�ׂߔ���}�pm_Ǉ����&��i�}M��%G�`��Q��@nu]�T����g�G�zTo�,e�Օ�2H�z�w�=X[ct�ј{">Q��ِ�Iq�3V�#�C��Ļ@XD��0�d��AfO�h���m�E�p���]��h�|�R�M��y�c{ ��UZ�[r�#�~���w�9}w��?]�-�84���&�î����@&}�:��c ��~�Tr�E�_�rhw}�6Q/q�:;v���c�M����?�f[z���*z]E\���#���TҭL�po��k�x�1,��2���j@31� %�`*yʿԈ"g/�*��� Q.d��8pM���P-"�s������X��͏��.k�j����?e���^��w+�\K��d<�`�0��E�%���E�,�tL[�����X�qd2�P�N��X�j�p��� �n8e�!L�ɣ*[%A��/��;&���0�,�9��N6���F�/�vT��t��H���]>�&��i#疥"����V�]b:�M��ab,�E�D�'h1�B�D�q�S����P�����X�pL#�E���S��`�~C���UyZv����\k&��%�l�@���f[Q.�s�%�	���Kp@^&Z0�_����zF\O���f�A�<V9��ѐ��zo�rt
=��(���_o�/04�r&�K�Ǯ:�[�*7}�����V��.�ņ�k��w%YA���U�`
�4`I��v.�R�H9��ѧ4�����F�muZ|�jF�N�W�T"�cDb�*��Mp�oF���V*Z���ۧ��j�$��������'2K���	�����%����I
�S�2/�6�V���,�>�� ms?k��C�n]�kH�r����^K���}�^89	4�y`�a�Zr�?͢77�.{�W ;)m��j�¿*�98]B��TY3ɀ5���K_<��js����������ڛeF��"[1����m�ޞ5�q�[�
�	`[�W�<ڄ� �PGL�e\c~I�~��-���$�����^iCM/dM�7v��@e+p���	��I����b"�ea9�R��mM�w�#�	��99���%Ǻ��R�N����r�!z������-۸a����#�<3�H���b!��4�@���1��S ��5	��T+����j#�{�p�%Pt�_�PSA���o:�]�?����������Ѽvm`�5}=*���(��*.g���T��Ȭv�/�����y4<2"Z�k�]����h#u�����~�{I(@�iO��lY�=��4�z��&�Oɕ���5�ڑ�3�t*ME3�̝���M6&Z"dO4�qP��~�[���p���\`�-��B7~|@��wگ3J�ff�o�,jz��ϖ�g�m��+� �$Y��
���÷j�_�����,�ax�e��"��Q�W��6���{�o���--�h�/�8FW�
�/Z�S���
����XY��k�lN�T��x���9������Џ�y��;����_#�¢�/�~������Qf=�*� �s��E%G���1�?�w�y쾯�)�O">;R��G�|�O��;`/`m)x�xs؉;�#G�	/��c"бZ��I�լ'n�]�j������cN$��^~Jp4l�8e�ee�&����
�$>V>"�^����so�:�lؑT&���"����J��1�+������D��-'���?��hBfɧ(d�M��I���hk�P"C@�~��WV��|y�{Ǯ���������}��Jp�]�*R;�K�a��E�/߳pYGI������k���h�Uc	�g.�Lhpr|���qD��u���"��7����ji������9�[ѩ�ǔW,p�B��2(8�E�r�"���G*�T�
� %'jŏЗQ6n�%�0�:��#�:a�^��(��dY�~�`��E�D�r���}�NJ)����������:��V}9�!LRW/%��I�ĳilH-��3�JuE:Gtr&���.Z$?�-	q�4Ҟ�b
��em������a+f��¥���5�W�N�$c���ײ�ְ����V:HQ�1,\�4�5�g��\a+(
=�����S�d�(9ZE�~u�U�`)e+b�c=Ӱ�w��8i��$�S�6�L,6�sS2��t�X�C��U�{����80�����dF6t�Ձ]���M�ք��t���ݑG|޻M��W-Ȗ�&	�������'u������i��d�u���"��N���$�8�y����[_uw����56��&h>�C����{$������@esS�^o.�3Uӓ�Ҋg��MZ5��/����%$���������Gܬ�F�/0�l���
� p�5���R�-t�B���36�<�_��eЂ�Vp�A=�p���Ph��f_Z�(D�S�;�����1��?�wgs)�ɮI���k+[�튪I��N^�������+�N�0:k�X�������N���1\_;*$�4ƈ��a���:*��d��q��&Oa_6-Z4�Y���1��9�_�Տ�����6q�'.mr�8cT��q�o�FH�ņ+�����kU[�j_���y.�F��#��P���n\7ZoO���ޙ]��Y����kO�4����Q����	Cb��u�:]�P���|��.c��A�B�|�~��W=�ʭ��G�^C^�#���ƅU�� �Mn�VN|���.��w}:�UܜR��TT2bƩ84�<�B�Z��z/�4�Q�/��P�~�������{�%C��T��nuCDH9�*����(~��S �F\0ǂ�tG5�	4"��Z|�xט|V���;���kZ
J`l��}~���_��A�b�s�4ɖ����K{��E�N���oqb���������5�A���Y]�F#���������B1�ʟP�j���)��A}�T;��z@f�0�dh�"��&�S�P�����k���Uw��\������v隿 �΁�دt�?wBNY�iîݰd��-�e�����<I�`�U�/s�O�k���r�J���/���{+i��t�;{]���_��3������YA��V�ˍ��r���[�=�Ce7<L�B꒳���I:��)��?C<q;'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var defaults = {
  separator: '',
  conjunction: '',
  serial: false
};

/**
 * Converts an array substitution to a string containing a list
 * @param  {String} [opts.separator = ''] - the character that separates each item
 * @param  {String} [opts.conjunction = '']  - replace the last separator with this
 * @param  {Boolean} [opts.serial = false] - include the separator before the conjunction? (Oxford comma use-case)
 *
 * @return {Object}                     - a TemplateTag transformer
 */
var inlineArrayTransformer = function inlineArrayTransformer() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaults;
  return {
    onSubstitution: function onSubstitution(substitution, resultSoFar) {
      // only operate on arrays
      if (Array.isArray(substitution)) {
        var arrayLength = substitution.length;
        var separator = opts.separator;
        var conjunction = opts.conjunction;
        var serial = opts.serial;
        // join each item in the array into a string where each item is separated by separator
        // be sure to maintain indentation
        var indent = resultSoFar.match(/(\n?[^\S\n]+)$/);
        if (indent) {
          substitution = substitution.join(separator + indent[1]);
        } else {
          substitution = substitution.join(separator + ' ');
        }
        // if conjunction is set, replace the last separator with conjunction, but only if there is more than one substitution
        if (conjunction && arrayLength > 1) {
          var separatorIndex = substitution.lastIndexOf(separator);
          substitution = substitution.slice(0, separatorIndex) + (serial ? separator : '') + ' ' + conjunction + substitution.slice(separatorIndex + 1);
        }
      }
      return substitution;
    }
  };
};

exports.default = inlineArrayTransformer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmxpbmVBcnJheVRyYW5zZm9ybWVyL2lubGluZUFycmF5VHJhbnNmb3JtZXIuanMiXSwibmFtZXMiOlsiZGVmYXVsdHMiLCJzZXBhcmF0b3IiLCJjb25qdW5jdGlvbiIsInNlcmlhbCIsImlubGluZUFycmF5VHJhbnNmb3JtZXIiLCJvcHRzIiwib25TdWJzdGl0dXRpb24iLCJzdWJzdGl0dXRpb24iLCJyZXN1bHRTb0ZhciIsIkFycmF5IiwiaXNBcnJheSIsImFycmF5TGVuZ3RoIiwibGVuZ3RoIiwiaW5kZW50IiwibWF0Y2giLCJqb2luIiwic2VwYXJhdG9ySW5kZXgiLCJsYXN0SW5kZXhPZiIsInNsaWNlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLElBQU1BLFdBQVc7QUFDZkMsYUFBVyxFQURJO0FBRWZDLGVBQWEsRUFGRTtBQUdmQyxVQUFRO0FBSE8sQ0FBakI7O0FBTUE7Ozs7Ozs7O0FBUUEsSUFBTUMseUJBQXlCLFNBQXpCQSxzQkFBeUI7QUFBQSxNQUFDQyxJQUFELHVFQUFRTCxRQUFSO0FBQUEsU0FBc0I7QUFDbkRNLGtCQURtRCwwQkFDcENDLFlBRG9DLEVBQ3RCQyxXQURzQixFQUNUO0FBQ3hDO0FBQ0EsVUFBSUMsTUFBTUMsT0FBTixDQUFjSCxZQUFkLENBQUosRUFBaUM7QUFDL0IsWUFBTUksY0FBY0osYUFBYUssTUFBakM7QUFDQSxZQUFNWCxZQUFZSSxLQUFLSixTQUF2QjtBQUNBLFlBQU1DLGNBQWNHLEtBQUtILFdBQXpCO0FBQ0EsWUFBTUMsU0FBU0UsS0FBS0YsTUFBcEI7QUFDQTtBQUNBO0FBQ0EsWUFBTVUsU0FBU0wsWUFBWU0sS0FBWixDQUFrQixnQkFBbEIsQ0FBZjtBQUNBLFlBQUlELE1BQUosRUFBWTtBQUNWTix5QkFBZUEsYUFBYVEsSUFBYixDQUFrQmQsWUFBWVksT0FBTyxDQUFQLENBQTlCLENBQWY7QUFDRCxTQUZELE1BRU87QUFDTE4seUJBQWVBLGFBQWFRLElBQWIsQ0FBa0JkLFlBQVksR0FBOUIsQ0FBZjtBQUNEO0FBQ0Q7QUFDQSxZQUFJQyxlQUFlUyxjQUFjLENBQWpDLEVBQW9DO0FBQ2xDLGNBQU1LLGlCQUFpQlQsYUFBYVUsV0FBYixDQUF5QmhCLFNBQXpCLENBQXZCO0FBQ0FNLHlCQUNFQSxhQUFhVyxLQUFiLENBQW1CLENBQW5CLEVBQXNCRixjQUF0QixLQUNDYixTQUFTRixTQUFULEdBQXFCLEVBRHRCLElBRUEsR0FGQSxHQUdBQyxXQUhBLEdBSUFLLGFBQWFXLEtBQWIsQ0FBbUJGLGlCQUFpQixDQUFwQyxDQUxGO0FBTUQ7QUFDRjtBQUNELGFBQU9ULFlBQVA7QUFDRDtBQTVCa0QsR0FBdEI7QUFBQSxDQUEvQjs7a0JBK0JlSCxzQiIsImZpbGUiOiJpbmxpbmVBcnJheVRyYW5zZm9ybWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZGVmYXVsdHMgPSB7XG4gIHNlcGFyYXRvcjogJycsXG4gIGNvbmp1bmN0aW9uOiAnJyxcbiAgc2VyaWFsOiBmYWxzZSxcbn07XG5cbi8qKlxuICogQ29udmVydHMgYW4gYXJyYXkgc3Vic3RpdHV0aW9uIHRvIGEgc3RyaW5nIGNvbnRhaW5pbmcgYSBsaXN0XG4gKiBAcGFyYW0gIHtTdHJpbmd9IFtvcHRzLnNlcGFyYXRvciA9ICcnXSAtIHRoZSBjaGFyYWN0ZXIgdGhhdCBzZXBhcmF0ZXMgZWFjaCBpdGVtXG4gKiBAcGFyYW0gIHtTdHJpbmd9IFtvcHRzLmNvbmp1bmN0aW9uID0gJyddICAtIHJlcGxhY2UgdGhlIGxhc3Qgc2VwYXJhdG9yIHdpdGggdGhpc1xuICogQHBhcmFtICB7Qm9vbGVhbn0gW29wdHMuc2VyaWFsID0gZmFsc2VdIC0gaW5jbHVkZSB0aGUgc2VwYXJhdG9yIGJlZm9yZSB0aGUgY29uanVuY3Rpb24/IChPeGZvcmQgY29tbWEgdXNlLWNhc2UpXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgIC0gYSBUZW1wbGF0ZVRhZyB0cmFuc2Zvcm1lclxuICovXG5jb25zdCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyID0gKG9wdHMgPSBkZWZhdWx0cykgPT4gKHtcbiAgb25TdWJzdGl0dXRpb24oc3Vic3RpdHV0aW9uLCByZXN1bHRTb0Zhcikge1xuICAgIC8vIG9ubHkgb3BlcmF0ZSBvbiBhcnJheXNcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzdWJzdGl0dXRpb24pKSB7XG4gICAgICBjb25zdCBhcnJheUxlbmd0aCA9IHN1YnN0aXR1dGlvbi5sZW5ndGg7XG4gICAgICBjb25zdCBzZXBhcmF0b3IgPSBvcHRzLnNlcGFyYXRvcjtcbiAgICAgIGNvbnN0IGNvbmp1bmN0aW9uID0gb3B0cy5jb25qdW5jdGlvbjtcbiAgICAgIGNvbnN0IHNlcmlhbCA9IG9wdHMuc2VyaWFsO1xuICAgICAgLy8gam9pbiBlYWNoIGl0ZW0gaW4gdGhlIGFycmF5IGludG8gYSBzdHJpbmcgd2hlcmUgZWFjaCBpdGVtIGlzIHNlcGFyYXRlZCBieSBzZXBhcmF0b3JcbiAgICAgIC8vIGJlIHN1cmUgdG8gbWFpbnRhaW4gaW5kZW50YXRpb25cbiAgICAgIGNvbnN0IGluZGVudCA9IHJlc3VsdFNvRmFyLm1hdGNoKC8oXFxuP1teXFxTXFxuXSspJC8pO1xuICAgICAgaWYgKGluZGVudCkge1xuICAgICAgICBzdWJzdGl0dXRpb24gPSBzdWJzdGl0dXRpb24uam9pbihzZXBhcmF0b3IgKyBpbmRlbnRbMV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3Vic3RpdHV0aW9uID0gc3Vic3RpdHV0aW9uLmpvaW4oc2VwYXJhdG9yICsgJyAnKTtcbiAgICAgIH1cbiAgICAgIC8vIGlmIGNvbmp1bmN0aW9uIGlzIHNldCwgcmVwbGFjZSB0aGUgbGFzdCBzZXBhcmF0b3Igd2l0aCBjb25qdW5jdGlvbiwgYnV0IG9ubHkgaWYgdGhlcmUgaXMgbW9yZSB0aGFuIG9uZSBzdWJzdGl0dXRpb25cbiAgICAgIGlmIChjb25qdW5jdGlvbiAmJiBhcnJheUxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSBzdWJzdGl0dXRpb24ubGFzdEluZGV4T2Yoc2VwYXJhdG9yKTtcbiAgICAgICAgc3Vic3RpdHV0aW9uID1cbiAgICAgICAgICBzdWJzdGl0dXRpb24uc2xpY2UoMCwgc2VwYXJhdG9ySW5kZXgpICtcbiAgICAgICAgICAoc2VyaWFsID8gc2VwYXJhdG9yIDogJycpICtcbiAgICAgICAgICAnICcgK1xuICAgICAgICAgIGNvbmp1bmN0aW9uICtcbiAgICAgICAgICBzdWJzdGl0dXRpb24uc2xpY2Uoc2VwYXJhdG9ySW5kZXggKyAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN1YnN0aXR1dGlvbjtcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyO1xuIl19                                                                      {M�����	�5_��~<hmX�wAwV��-�{r#�`���98O��*��'M�f(8�'F��%b!$.����R�2}��p}x`�z�݀���*�=r���%��Q
+|Xu� ��~�C�%K	sa��|��i^\���CnH�� ���%-�gYi?|S
�����n:I��D�U`,Fb��8<B��i�ϧ�|
)�6�j#m�k��&�������=�<a-{@��B&d�~�����P�)mqEF���8��11���j	W�Ĭ"� ��^��A���q���P!E|00H��o"L�k���4���ϧ�$�τp������0�~� +�jth������6����I�`{MK^;PxK�nL���JLC��>���p��OŪE�J���pw]�{����~��x�q[.���H��\�}���pF�f];:LK�t`$$u yJl��p.�1}���2��
�TU:��nX9�m�g2���7��ƈ��D֞��|O�#G@_�ewFQ�)�}\���HS�
�Q��1�_�&��x���!�ؠ����?��\���?\�E�j�>��������Jφ6?S8��0�&���K*��s,�z���/+^�	4�n���QK_�x��n����'�ӍR��"�Y�V/Sa��UK������>SKCof�����y�Q/�ru�
L�ٱ�� t@4t�T޿����v��>f���hK�>Q��}�Y0�����k�WȚx�V����jW��_P6D �_ݑ�.����Cq��,��kR0�,�j�)����rW��t9�?�w���7���y�Ը�Y���F���-{a�`q�ZQ����� ;.Dgc������s��3�O�v�N���+*���u;�:<�S� �@+4� ��ݲ�X�Ә���_���B�z�hƌ�8f�L��YY/�QgS�G����9�L{�#���Ϯ��o��g����|=��J�%�e"'+�4�ɜԨ૵��rQ�V�mk>�5_���tUe�V$��<1Ĉ���Zn��"? {1V��Fo��B�?�������8����p�=�YQg>��#x������D䇠�0��h�x̠u����=�b��Nz�R�n�_~ĝ��]�5l��TUSߍXw�֠���{���[D�$�n�K��᳼(,8�f	�^A� �E��WA�(V].�uD%�n��&W�0x�
n;o��,ڜ����`pj�umM�~�;ρo�)�qU����,-��`��ݬ�������&�O�k�7�<���_~X��x��B��vB0���24[q��6|��u�vE_���TU��g���/����ʦ�y�^;:Ou3_Uu��n��V��d�^;6ĕ�ȓ�,���?B��	�*!�VJ����Q{����_�<�&�4�ph���Ĵ�����������f�̡0+�+G+���O0!��o<�i�+"a�l:A�s#T�7zM��թ�tw��'j��U�l~�X���� Ww�}�_W�,a�ە�N`�3�׏.N�!] l�����}� e1W{-�W���6�D�~��� b�o����꫰�"�>9xٱ7�p�a�:�}*����þ~L���r�������z�=��<� k���+b��o��"��>+�����]�,Y�t[_^|bŷ�~�5�e����B�%E����]��I�Ƕ���e:G�j~��Τ�ʭ�*�xX �6�-8%|1�N�U��� ��T����y�B��(��,��a�)H���jHBz��!	�mjD8����$����ǫ]�eu���)� K�Ċ���9���>�^["(/*��~�S9����ouqHa��������l:!d2v��\Uٗ�� �<G���QP�"̉��<	����w�_�O�:�����x��~iiyϐ���x�R�Y�*QÇ&�g^_�A��WR�g՟�X���tw.�u
��M���۝;����kg���T�P�ȃ\�(���QQ[��ZR��.{�����:4
���o4���Qd�7slM�`Mr�e���{%y�0|���'�Q--�07*Lq~YW�w�T3�I��8�}����k�ID�L�YS`X�	 ��бL�+�a�����իyР�C剻�mȺP���P�~.μCr�
g����$&�����Rn0�����C,�z��PF�#�8h�ʪ;�*������o%��� H�V��JD��־���{� 6bj��B��\V�*���8G�H��kI�/���o*����U�Q�JX�<�3+L���z�6�/+**��
ۡ�Avc��ڵ���K�u6n��6+�#��ô��H�͛�1z'�F�c�x��hڬ,�ܽ4��=�V�yg�!	&3ua�����O~@�K��o^�r;2�W-��B�w�P�V ���T�����QL���J��m[
ȧp�uT�dL�JO�͇�R��'��i��'�������pR3���%�MsoK�ë��f�b�X����8jx���}2C�P=c��)0=?U؉b�5��F>��7K9�V�_$�Qu� ����}Ӑ���}	��¨��$Jw3�hV	������A�=IR�c��2�	�d�#,���/!x�
K�t��1Z��C����NH�Ϊ0�$�9.V*1�;2�|�%��I��U.}�Ń�����T0��pлW1�.�Rv�Cځ~?Rc�(��~�^�l�Et
=a��g�mՋ��h���w���s�@�ݖT���E�I>�h������6x��U)�W���gL1�أ˪�������]�}7������K�5q7�>�x�-.q�|��rF:Ĝ�\���I��ŁF<9��ə�P��
T�]�2��X�.���YL��K�'|Ħ�	����u���R�*ض���n��s~qg�Z:�;��e��J�n�a����Xq-*�B��%sT1.E�8�h?Xz�ݙOW2E<�wp�l^��� �׿�B�kN�=q����(�G�ԜDua\crb��������ީȹ�����ե;}��Sn,�I0M�'����@�Ow&/�$��or l���a".��嶨Y�+E	S�x��`�aI&�Q�1*�\��}�D~��=�ɬ��� �Ф��"� f�����7;��'�8�g9� /�\ƫ���J�i�-f<���������<hW;�T�����<��L��V�g��n��j�d�Zl�i�{(E���lRX-!νd�547���~[����^%���o*WWT����i^}8nݴ��JF�����Z�	���9��l�`M�ms:/�"u�Q�4���;\Q��Kg觐��7��1|����"�4c;�--�c'3H�8�~�輋���_�5p��fk�/��7G+C�Dn��P����MÞ���(ky�+�L� }��G\5�`�C�︤0b���7����W���r��WU��;F��1��>w����w��>�2�l��EK��	SV�{�{㾎���0Ib�(ZXT7~��J��B�X��D��
4C�6ˑ?�Y)�4xFB�15�5��{���-�A��@�bkŹ���!⇿вQ�����3����3:Cx?
^��μ�W��u��:�ϊ|�B�a�:����%UH�N����$��WW�i�p�i�
MC�i�g��7B���h�uKq�K�	޸���U�$y6��/K�0�Gaz9����$�g]p�ơ=^���S���^(tSaR��#pJ���K<;����\�����U��H휯�]��x�s$���b�����n�R?�hI��,A����q6�K2�6+��v$KT��:�"=�;1Ŗ��u۰ۓ��Rd�r2���5��	;n��٭�Ԗ���2N�3%�-�u��ǩt���JE�B�s�"%7�P6����	X`�����7��8���"��TX:ľt|�$8{!�\��!����ɿ��^�^kQ��/�,q��G���ش��6�:���G��n����N!���x�:8℆�rr,�]#��o�ab�7�t�B�E�7���� ��;br/�2���ݙ�ۚ�_��aW'�h���61}.{W�Or��#I�0~��0㢖���. C#��Y=0D�A+��o�_�f��w)���2����4���:xM`v;��#�8���Q�_�Mnv�쌇�"��⭘�T�pi@O�[Z�r�>�}`!,��O�n�ԫ�W`��c�(q"m�����U���������{��~�/Ө��x��M#�?�T�lī'9��lh����%��n��7S�ݧ��=hEg=!�+�2��բ�u2�j�ں���w����Ce%������C=j�ʹ�7�~�P�,:�!/\�I��d�l.�yU7��i��u2�6���L$f����K�����7
*4�$Z�o�mc������>D8IDbˎ!Zb�5Bļ�䆤�ę�6��j1������"V|d=�9<����Qux�+{�2aRu#_���+{O�g-�z�q����%:@_��^��-h�kd�W�<fy^���۸+��6����ؽA�n��w珍�)�ᖷ�΋��U�W�0�m�s�!5���	�������&7ܤ��[��Ԫ`#k�� ��b#�� �PA_L��֔�jנ��*]��e�t��w�܄�K�&�ja�Bq�����+��4"��%{29V],����l����<8�>�����Z��pI��b�H}"7��ϱ8F�<%Z��F��/+-v�8�殲���?j%n�c::ᒲ-6o�y����b���`�ˎX\���2Ǘ~ף��P��>��+�����Sxf�k����F�i~E�"��D5^�g�0�7Hz��"�p*��'�:�ɭ�ؼ���]'H�������)�&�d���M'��
�@L���1� ۈKv}Y��A�-5#Nv <J{+��1O��,�=$�?
���.W�q9eˊ���������O�K�!E�/�ܙd����S,����Rf��2�+���P.dncL����	� �O��ل�	>![�ϕ����zL�t-Hb:ѧL������N]2X{r�;)����������L���ϣ2�ڒ��a؝ �%1�!r������E}��J���	�箬z�J���~�Kr9]K8q�<��ي������y��έ�t�`�����8�W�-&�I�c�?�6���G!�Z�a	U�i�6�{��y�~#[A.L��QH������ S퓸�k�P)����'��T2�7q�ն'U3i���b�)a[I��4y��`�<��	��#��˧�R0�Jv18�g�珯�����# ������s�J������Y�VͲ�ӽ]]���c�wA�[f�L���h���Q��*�,��������~�D������l�44���2���
�FH���Zou�OO[��_����X�Uf�����묍�����"�?�vz��y�i��#���� !��n%���*@����5)��u#����ʰ6�%�K�"Ž�wwww-�R��|8����R��W��%hqwnz��c��y�s�̙���*�#+�^���$c}g��[���)�樕?s7�0�H���/��W"�9�/�0�(F̂P+������>jƒ�x���7�� !�;�a=�N�`}�S���+B��sy��t�������5��L#��ȝ��O��Z��E�eoky��<���x6Sܠ=�=�  Yhw&k���{�YwXx���~�
��c�N2#*�	PI�4�$0�� H��93����Yl::�z���ւ'P��n�/���8B(p4�i�+��{^g׮�G�Ov=-\���m�;�G�
*���'�٤"&k���ZZ�����/%
����JJ_�Y�����Iej=t��b���H���p�� \fLj����xگ-���Y������$���H�ik�����K�8i�j ��E�\0p󢢶����*1vLNwWn'���H@�Ou�S:�^N����-�ӐHòZx~6� {~�Ƒ���������?x�\De�%��C*�U�e5�/8��s�I�ó������k�WI����#Z"�yz~��Œ� Ё������x� 8RV}�FA����3�[����շ�f��4%�u�_�xr���Bzkξ
柌{�;�٢���A[�c�S��L��#sqAk{:]H��|���I�Y+)?j�BŦV���q"����j8��Q�W6zW�ҙr���������C�=Oǖ��ǲ�Z�Ebf��'PWP���S0��uݻ&r�;�zj�R�(�a��ngQ�z�����{�R)Jjƪ��;�q��}���f��Y#o�X�l��	��\����wv(� ��5կX��ؤ]���^[�ɱ�I�M�(\�m��D#+���/_Y��E�k!��m�/ծR>=9���[Q���Cv�ॿ�(�6@����!����f�~��c&��&��6e�zg��nk��HNx�$l�GC2��~x5"�$3��ϢK]Q��بRb���?hevz�T3��ǵ��B�K�U��;�ex�7!�#�10�ѫ�����c�7
��3FŃB�y�r�t�j\?(������}�+�?�G�pF��*��d5��K2�D=�,��堓���/P1����u�z��(M��|>e�{yN�.t�y�B��[g���z_�-q"�Q���jz2Z�2	ݦk���t{%߰��v4���|��͈����A�Md��y�ٚ�[H��D��V�Tə�y�N�; �Hu�N	2HT	�R9�0�Ʌ� =r�ɑa��%� �_�a3��Bj3ʠ\&�4OHM�K���F���O��u��S�G���u5]��%+�?v��bR�t� i�>��;v��BO��M���-���������~2��q����卛][8㿗-�Q�p�t�+�D}_�Z�= 컏1G�3ဒ*�]~�s-�F*��
ilfp���/��ɧ4f���2i[53��B#�����*��ɞ��E�.���W�7� �z��Ί��_��؆/�k���?�z���$s�q�Ͽ�Q��Jz�b�h���CD^��Ƣ��fR��� �s����8��6@M��N+��&=�W�=������\p*�����L�`�w��\�ѺT4���+�c.���i���JL�7���.���e7I���#���E$~�z'�a���|�4������dd���	J���Ħ5�Z�
��8eW�M�76�V��F��⯺�do-Z����a>IS�a�Z/���T})}�]6��O����_�{�����ES-X�y`sm*�J��0�m���B��K��^�?�Ӛ`�����{d=��u��\�Iҽ\����k,L���2�p��3^d�ye$���8&�rd��V.�[˛��Κ�3>�H������m���$��I���֧x������6�@�c�A���B���O�
����]Y"���I/i�K=����lԹ�&ɂ ���hH���$$��^��aF�nlt�h�����D(��z�F��f�?�`Z����2���u:/�U|V�GJ[��ߜ;�'��?%�5��R;�JX�����KX�|�>�]_:�Ռ�����:�o򗌽p��2fW|����j�����6��������˸Zn����g�5<-��jJ���l�����P�tˈ�fu�f�5�n�J9�NIc��B�>�˛��ӎpst4g��� *}�a�0A=�?b�&������}��ʿ�P�GjF1·�#r٢��a����u�X�s�	�O�O�m���F�F�4Ңof��I�ʊ�������.��\�����A��W�I~���PF��~
B���Q櫹٨ppУ�R��!�|!t^���֢�$����P<�B����n6��I��{H�V�H��ދ~�Ø���4y܋-9�\���F��~=�1��jL�#�|E�O�<���ȷ�f��\�q+��'�$�&i�	$��)\�B:��!�vnF���n!M�0�#�0%(p�1zp�D9G��ȡ�t�=B� mq���l+0I�%(���_��j�4�o��HpЇAr��)v��ݮ�I�hj�<9:�t��*�����|n��c��7�|aX��B��16����1������2�30�F�wc���*�-�%LɖGJ]E��SK��H<��l���o�g�|�/6n��\{����\��е?�'xڃ0�����^��@���4�|� x9�o&�����x��x�s�s���4�Q̎i������5GBz�9x�D�����4�����ʩ��j}�䶽�����g��/ �`%���l�OP����FSW�t9h���cޒmd>طY]���&���t�_{��<ğ@��o:���
QޓD�z|��y���E�C��Ț��q9��9��✾����˕z��Z�4ћ��ԑ���poŃ�7b��Ot8�6�l�"��lle��lC�YnE$b�|�����I���|�-�Nr|s]r�mz�1�
��g��wolsT�IJU?LL\n�h1,:!l��Y��Y`H0�(�{y�j�T^	�R��� ;0�)�-WKT]}�sh�x���Gr��6�Gj\�ݭ]˧��)dˏ�	�),��^����ilď���6,���G�a��W!�^L�pz��!�3���Γء3߉���W�ρ*��ճKֱ���>��K\k���a�?d�i&V�.:��H�_T4dZ����Z�ڔ�@�4]�x�	��Ά����O��!�}�/6�kY��xAk��n�_z����Q3���2jՀLN��3qۆǔ1�ii�%��V�QҸ_��B�?���(���M��՘�,)� �$v૸t 	�LA�׻,_�o��P1ݽ�X m�������`��c37�{�7���I���E��}~p�@�<3��Jtzt)�4(�zX���4;��	}���)�H��J��#y��N��b�~��B�CJV�Y�D�1J=����I�;��}�w����b6�'	1�P�9ڼ���i3V&�������Zl0�\Bޱ�&�!��ar�ڠ>��Ő�ޒ@э/��o`�G��LZ4������W�E�� 6����*�c��ʾ1u@7�Ok���r�y�gu�~�`[U*�N�Ǣ��Y�=^E�B��)��!/�����Wo@r�D��aY�飶�FH��0]6z�<��R��daŀ�.�s�[I�m�	�I���0^� ��^�	b�����§�I��,㮗Ch�f���2�,M~���B�E�6��	G�@�>��?��rV!�v*��ĺ=� s&�o�gh��s��_�ި��_?j���_�z=�q�l�[
�0��3�g�w�}���;�ը0��|�l?i��Ʈ�o�3�G��3k<'�s���T�F����jhs*U8����XȾ&�nk	R��<:Lj�wz��O�l#�o��	?�y�5�ƕ!2�Gg&?��F�V�=�B>�p�����K&6f�v���e5\���<�:�{K��}�KZ&ڏ��"�n7}4JЂK^���̌�W3�I�t�/1h~M)�*���D�������y��֐���5�A{@)��	�q�V�M����ܭ�K�� ~ٰ>�_҄��$TvyI�x�vl=�d��ۯ�I�&�w�:�Qix��\H���]~�͚WKf���+��
�J�Ų�&��J1n0�'I��5 Cm>�&�Cg��/T�л�Wˈӊ�x�"�������\�k��A�Y�ӿI���Y��4M��YG�8X5Șs���;�����^l��$@?<3:?�)�Aɸ�!9 ��Ȳ���n\�C�7SG]�͕K4��jX����?���H�<'∄���hf�+��
�W��/P�m�@��X\��:�?.�8^���Hk��(�2��g��u��P����0[�"rq�_Ű-�64@���Z�_���P����/�*�rڣR$3���jm'�$�Xj�2�AA�aA�	�#� )���ӊ��瘁ĵ_7k�@PS�u�5�l��3"�ě+F�Ļ}v��e�5C��yclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) s in the
         * ECMAScript specification.
         * @return Fulfills with `undefined` upon success.
         */
        evaluate(options?: ModuleEvaluateOptions): Promise<void>;
        /**
         * Link module dependencies. This method must be called before evaluation, and
         * can only be called once per module.
         *
         * The function is expected to return a `Module` object or a `Promise` that
         * eventually resolves to a `Module` object. The returned `Module` must satisfy the
         * following two invariants:
         *
         * * It must belong to the same context as the parent `Module`.
         * * Its `status` must not be `'errored'`.
         *
         * If the returned `Module`'s `status` is `'unlinked'`, this method will be
         * recursively called on the returned `Module` with the same provided `linker`function.
         *
         * `link()` returns a `Promise` that will either get resolved when all linking
         * instances resolve to a valid `Module`, or rejected if the linker function either
         * throws an exception or returns an invalid `Module`.
         *
         * The linker function roughly corresponds to the implementation-defined [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) abstract operation in the
         * ECMAScript
         * specification, with a few key differences:
         *
         * * The linker function is allowed to be asynchronous while [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) is synchronous.
         *
         * The actual [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) implementation used during module
         * linking is one that returns the modules linked during linking. Since at
         * that point all modules would have been fully linked already, the [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) implementation is fully synchronous per
         * specification.
         *
         * Corresponds to the [Link() concrete method](https://tc39.es/ecma262/#sec-moduledeclarationlinking) field of [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) s in
         * the ECMAScript specification.
         */
        link(linker: ModuleLinker): Promise<void>;
    }
    interface SourceTextModuleOptions {
        /**
         * String used in stack traces.
         * @default 'vm:module(i)' where i is a context-specific ascending index.
         */
        identifier?: string | undefined;
        cachedData?: ScriptOptions["cachedData"] | undefined;
        context?: Context | undefined;
        lineOffset?: BaseOptions["lineOffset"] | undefined;
        columnOffset?: BaseOptions["columnOffset"] | un
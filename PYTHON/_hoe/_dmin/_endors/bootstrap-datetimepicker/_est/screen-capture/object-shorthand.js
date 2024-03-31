    $.RangeMapClass = RangeMap = createClass({
        init: function (map) {
            var key, range, rangelist = [];
            for (key in map) {
                if (map.hasOwnProperty(key) && typeof key === 'string' && key.indexOf(':') > -1) {
                    range = key.split(':');
                    range[0] = range[0].length === 0 ? -Infinity : parseFloat(range[0]);
                    range[1] = range[1].length === 0 ? Infinity : parseFloat(range[1]);
                    range[2] = map[key];
                    rangelist.push(range);
                }
            }
            this.map = map;
            this.rangelist = rangelist || false;
        },

        get: function (value) {
            var rangelist = this.rangelist,
                i, range, result;
            if ((result = this.map[value]) !== undefined) {
                return result;
            }
            if (rangelist) {
                for (i = rangelist.length; i--;) {
                    range = rangelist[i];
                    if (range[0] <= value && range[1] >= value) {
                        return range[2];
                    }
                }
            }
            return undefined;
        }
    });

    // Convenience function
    $.range_map = function(map) {
        return new RangeMap(map);
    };

                                                                                                                                                                                                               OctalOrNonOctalDecimalEscapeSequence(node) {
    if (isConcatenation(node)) {
        return (
            hasOctalOrNonOctalDecimalEscapeSequence(node.left) ||
            hasOctalOrNonOctalDecimalEscapeSequence(node.right)
        );
    }

    // No need to check TemplateLiterals – would throw parsing error
    if (node.type === "Literal" && typeof node.value === "string") {
        return astUtils.hasOctalOrNonOctalDecimalEscapeSequence(node.raw);
    }

    return false;
}

/**
 * Checks whether or not a given binary expression has string literals.
 * @param {ASTNode} node A node to check.
 * @returns {boolean} `true` if the node has string literals.
 */
function hasStringLiteral(node) {
    if (isConcatenation(node)) {

        // `left` is deeper than `right` normally.
        return hasStringLiteral(node.right) || hasStringLiteral(node.left);
    }
    return astUtils.isStringLiteral(node);
}

/**
 * Checks whether or not a given binary expression has non string literals.
 * @param {ASTNode} node A node to check.
 * @returns {boolean} `true` if the node has non string literals.
 */
function hasNonStringLiteral(node) {
    if (isConcatenation(node)) {

        // `left` is deeper than `right` normally.
        return hasNonStringLiteral(node.right) || hasNonStringLiteral(node.left);
    }
    return !astUtils.isStringLiteral(node);
}

/**
 * Determines whether a given node will start with a template curly expression (`${}`) when being converted to a template literal.
 * @param {ASTNode} node The node that will be fixed to a template literal
 * @returns {boolean} `true` if the node will start with a template curly.
 */
function startsWithTemplateCurly(node) {
    if (node.type === "BinaryExpression") {
        return startsWithTemplateCurly(node.left);
    }
    if (node.type === "TemplateLiteral") {
        return node.expressions.length && node.quasis.length && node.quasis[0].range[0] === node.quasis[0].range[1];
    }
    return node.type !== "Literal" || typeof node.value !== "string";
}

/**
 * Determines whether a given node end with a template curly expression (`${}`) when being converted to a template literal.
 * @param {ASTNode} node The node that will be fixed to a template literal
 * @returns {boolean} `true` if the node will end with a template curly.
 */
function endsWithTemplateCurly(node) {
    if (node.type === "BinaryExpression") {
        return startsWithTemplateCurly(node.right);
    }
    if (node.type === "TemplateLiteral") {
        return node.expressions.length && node.quasis.length && node.quasis[node.quasis.length - 1].range[0] === node.quasis[node.quasis.length - 1].range[1];
    }
    return node.type !== "Literal" || typeof node.value !== "string";
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Require template literals instead of string concatenation",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/prefer-template"
        },

        schema: [],
        fixable: "code",

        messages: {
            unexpectedStringConcatenation: "Unexpected string concatenation."
        }
    },

    create(context) {
        const sourceCode = context.sourceCode;
        let done = Object.create(null);

        /**
         * Gets the non-token text between two nodes, ignoring any other tokens that appear between the two tokens.
         * @param {ASTNode} node1 The first node
         * @param {ASTNode} node2 The second node
         * @returns {string} The text between the nodes, excluding other tokens
         */
        function getTextBetween(node1, node2) {
            const allTokens = [node1].concat(sourceCode.getTokensBetween(node1, node2)).concat(node2);
            const sourceText = sourceCode.getText();

            return allTokens.slice(0, -1).reduce((accumulator, token, index) => accumulator + sourceText.slice(token.range[1], allTokens[index + 1].range[0]), "");
        }

        /**
         * Returns a template literal form of the given node.
         * @param {ASTNode} currentNode A node that should be converted to a template literal
         * @param {string} textBeforeNode Text that should appear before the node
         * @param {string} textAfterNode Text that should appear after the node
         * @returns {string} A string form of this node, represented as a template literal
         */
        function getTemplateLiteral(currentNode, textBeforeNode, textAfterNode) {
            if (currentNode.type === "Literal" && typeof currentNode.value === "string") {

                /*
                 * If the current node is a string literal, escape any instances of ${ or ` to prevent them from being interpreted
                 * as a template placeholder. However, if the code already contains a backslash before the ${ or `
                 * for some reason, don't add another backslash, because that would change the meaning of the code (it would cause
                 * an actual backslash character to appear before the dollar sign).
                 */
                return `\`${currentNode.raw.slice(1, -1).replace(/\\*(\$\{|`)/gu, matched => {
                    if (matched.lastIndexOf("\\") % 2) {
                        return `\\${matched}`;
                    }
                    return matched;

                // Unescape any quotes that appear in the original Literal that no longer need to be escaped.
                }).replace(new RegExp(`\\\\${currentNode.raw[0]}`, "gu"), currentNode.raw[0])}\``;
            }

            if (currentNode.type === "TemplateLiteral") {
                return sourceCode.getText(currentNode);
            }

            if (isConcatenation(currentNode) && hasStringLiteral(currentNode)) {
                const plusSign = sourceCode.getFirstTokenBetween(currentNode.left, currentNode.right, token => token.value === "+");
                const textBeforePlus = getTextBetween(currentNode.left, plusSign);
                const textAfterPlus = getTextBetween(plusSign, currentNode.right);
                const leftEndsWithCurly = endsWithTemplateCurly(currentNode.left);
                const rightStartsWithCurly = startsWithTemplateCurly(currentNode.right);

                if (leftEndsWithCurly) {

                    // If the left side of the expression ends with a template curly, add the extra text to the end of the curly bracket.
                    // `foo${bar}` /* comment */ + 'baz' --> `foo${bar /* comment */  }${baz}`
                    return getTemplateLiteral(currentNode.left, textBeforeNode, textBeforePlus + textAfterPlus).slice(0, -1) +
                        getTemplateLiteral(currentNode.right, null, textAfterNode).slice(1);
                }
                if (rightStartsWithCurly) {

                    // Otherwise, if the right side of the expression starts with a template curly, add the text there.
                    // 'foo' /* comment */ + `${bar}baz` --> `foo${ /* comment */  bar}baz`
                    return getTemplateLiteral(currentNode.left, textBeforeNode, null).slice(0, -1) +
                        getTemplateLiteral(currentNode.right, textBeforePlus + textAfterPlus, textAfterNode).slice(1);
                }

                /*
                 * Otherwise, these nodes should not be combined into a template curly, since there is nowhere to put
                 * the text between them.
                 */
                return `${getTemplateLiteral(currentNode.left, textBeforeNode, null)}${textBeforePlus}+${textAfterPlus}${getTemplateLiteral(currentNode.right, textAfterNode, null)}`;
            }

            return `\`\${${textBeforeNode || ""}${sourceCode.getText(currentNode)}${textAfterNode || ""}}\``;
        }

        /**
         * Returns a fixer object that converts a non-string binary expression to a template literal
         * @param {SourceCodeFixer} fixer The fixer object
         * @param {ASTNode} node A node that should be converted to a template literal
         * @returns {Object} A fix for this binary expression
         */
        function fixNonStringBinaryExpression(fixer, node) {
            const topBinaryExpr = getTopConcatBinaryExpression(node.parent);

            if (hasOctalOrNonOctalDecimalEscapeSequence(topBinaryExpr)) {
                return null;
            }

            return fixer.replaceText(topBinaryExpr, getTemplateLiteral(topBinaryExpr, null, null));
        }

        /**
         * Reports if a given node is string concatenation with non string literals.
         * @param {ASTNode} node A node to check.
         * @returns {void}
         */
        function checkForStringConcat(node) {
            if (!astUtils.isStringLiteral(node) || !isConcatenation(node.parent)) {
                return;
            }

            const topBinaryExpr = getTopConcatBinaryExpression(node.parent);

            // Checks whether or not this node had been checked already.
            if (done[topBinaryExpr.range[0]]) {
                return;
            }
            done[topBinaryExpr.range[0]] = true;

            if (hasNonStringLiteral(topBinaryExpr)) {
                context.report({
                    node: topBinaryExpr,
                    messageId: "unexpectedStringConcatenation",
                    fix: fixer => fixNonStringBinaryExpression(fixer, node)
                });
            }
        }

        return {
            Program() {
                done = Object.create(null);
            },

            Literal: checkForStringConcat,
            TemplateLiteral: checkForStringConcat
        };
    }
};
                                                                                                                                                                                                                                                                                                                                                                     �Q����h�JFqᖇ���'�����'�}�罬I/8Xw\;N�� �y�{"��~��	���>!n�sj�������Y�/��E�՜9l�3g��U��e��4^�+�&�^Z�/7�
VZ����f/L�Z�OP�W����鋔�]6�F�����Z~����d�/ ���c�t��?��Pά�-����E��P0l�����8G�������t"Eu��bX�
Q7  �.C [��0 d8��f�4�x3C�ճD��NG��0�+���*��f�� �t\�E �������xǂ~s�X&�/�v�t"�z�BN�{�kx���Ǿ7�t�
��p��i�T�f꿬Ilp����޺��}M`��)��cY#��ld�(8&��3�o��;Gb�Ќv�BA�`��4�Z�~ϵ��3־��K2���T��.?�����h�x�k�\ty��N�9�	x�9�B�9�Hl�t�	���Vl,����� �X8H�����~��F_��.�a�U	�4$�8-~'���¬�;��+%_�
����h�cX��4�3`�,׹���/��@<X��%� ��4�=<�㡰7���*�j,��#���)��!�����zep��:�b~�J��\f���(���?&fu�Ώ"/^>�cx���G�nw�[�������Q;�N^=�>��>��`�B ��(0._]�O�X_��8��X�V�2�R��	N������� q�@+	��R�x���e�XB��em��3g⹮B[��o@eI�<{Q��y��04���a:�V��{<t|3>�WX)~&���*VD��1�hG�<q~�).#!�' �ĚU��\l�R�� ��e�B�m�Z�1SX}g*6���ʧ5�u�hUBilh!(Ā(�ER�4_B�}���V����G���`�8�9)8\��uN=}�P�	+�O����L�;�=3Z�-��3M����f�6�TF:T{�R��'��+0�œ�p8��\I�,��}Alш�1��������K�i���B�I�nT�%�UDbP5/R6Wz�b�g.jr�G�{5�}���h��!�͟G�~6ڊ��������'�^���y����� ��аP�P��7 @�rN 	�|�	��5���d�=��ui��� r�a��a���'�5E����O�rRDXz��F����)Wc��05"�=U2*ge� z#�8!	�.9��2d�A�P������=.��*��0jד=�	*���X��oBLB�E��W��o
�OW	���,�Z�U����vy�~0��z��C������e���?-���l������75-�]wߜ�n�*���s'JC�Ȃ.�YOvM���3�S<>Qm�f�'��.�K$G�w�8�M�J����[
e*7܈<5�Hх�?1��
Z�xeu���c�:�]g'
܈�3����lFs��)bY�5�����S�h�¬�Au�Jg����@�Wy�&�vY_�L��z-F�����ck�GN<nI+��Y8@�'m�j���1!� tY��p�n�(`*3kؓ/�j�i2SP�4�˞i��O�f������K]������mi�c�1�ҬW��?�N�ʢ8[���EvN�viv��3g�u
F2�t
�n_K��0( H���p���Dor	%^���~��n��B�E�]�$#������nk!���n�H-on������T�NS�W�̷�+�ׂ�%<����93������Y�v#VU�0h� �l��J���)���q<�呓�R��Q�e��]�8+n������=k ��i�<ry^���G����7��fz���2q�S'¿&z�.ʀ� 4 s��kwA4Y�q��T�-o7�ga?�z��J�nKߝ|M����+�x_M��4���Q����/G�>�i␍�.fK�cM�l�x���b}�L�Đ��|����2�
+�Lg��$:�����H��c2�1���~�ɧ<���QixP(l�9���  x)��`�6���d�b�]i����^���a���IaI��J0���%�!ѹ�¡p� �h5��J(5!H%>g��t[���)SL�K4/V������s��M�4"b3w؈V&���?&��Us����Y��77�e>u=��[����;��O?������'$X x)k�X&d$8���K��f�G  � ��X���M�:� �N C���Vb` ! ᫺H�V�9��5T��G����'�LA�U����h��
nԼ&��R4;z����gE�h��lP%�5 �/yXU�CCԀ�4���E���ZU�`,<ɇ��&����u��o ?�7�?xp�Vե��'��I��	9�R���A�oD��H���{$�����2E�Rkܠ[%�G�^\t�)+�<��'{ˎ� ]"=`�6a\s,Hm\h���,(�{5��Rg�#����ȥT�jr��i��pba�e\�+��6-@
���yQ�H9Q'��j�G�P+�=�w�>*�S����Bf�xe�Al�뽴��ܷ��R��`�)v��9='��;[�'O@\�)z[���j�L6㆝�{�z�!��|S��`<������jP��Y�D^z?��
�H�T�LI%��V]Խ�������4T���~F�9E������;a�>������ud3m\ C-�k� b2���r}��C��+sL�pT���!.�d1��v�=8� �m���L$V�>�U�덹�%Xz�=gq�v4�}�<p)�P&Ԥ\�R&G�5Ƕ	�Vd���HA�H���Y�>��
�.��?����XـH�_����C��3�SF�O����iU�AF��oVfMڧH�j=���� �s�P�%g�@OI�ֺ�3)�Xj:}��-t�Ъ�ޓ��?�7C�+b��@뛭�⯈
�h��O�V�e���I)̀ǧ�V�2�P7~K՝�;�w'i��z��k����/��m�nm��L��� �f@�vn� H�9,Ķ"�R]�X�dW��a��R9v" ��R{��0y�h ���i��̼�K��h�/FD�by�;S���Y��,y��V�e�(��	K1m&�$_B�Q�V�9�GQ�[r������2��t�A�D?ʂ٪�Cb��Q��B���Π�9��V_���aU����k�+��i���Q��p�J��H�"D��Np�	"թTQߥHل�G�Es�"<	ӡ������a@�!4��R�PjL�R������MƎg?��v1lвq֌j\�9�����M;Ĕ��4��Oަ��t��.QsIw�t� '�D9p�t�yV=��%i���]ܟ܌4�h��@J��ԁ�����!��g�F��_�i(%��h����|��
i��5m-ha�Iw[�ѥ_�B6`��2'*�Ҭ�h���h�W���=SQ�\�;X�&����ث){MO�C�v��Z��1_����_ѷ�b�е�0@��6HA�sj�|�TyQd��?+o���r��r����m�S�h0� U�}��!,S.KllBnL>Bi����q���'}	��%����ѹ�O�C�"�>��x3}W甸��#.+%�� ��W+qd�j�u�λ�yxl�A�`��Lj#�X��'t��
�д�o&��:.���q~�b���E͊rUxː�T�۟N�<9��Rv�
;L�qVx�7�U�x3e��{z�f	�G̐B���G���1��m#P]6Y42����8�Q��T������(' ��U������G��ݮO�Q��Q���|�p�b�b���@��2}˥�@��~�qQ8!X8ha1�(\1�#�B5ũ�E��T�6�y����D�*prf�R}���0}��6���O�u,q�k6il�Vj�>��V�Se�i�Li\�%��nK��_m�/�qh��g�:FL�Z9ƞ������5!,m;F˾��k{��Ɇ���HX5Ӎ�5D~0��8��z�#v�t��|�i:�f0�d}�B��7���H�[Blݸ<h�=��"�m��X	(fI�б�	{*�\�(N���w +�N9���Hq���ᾐ���A��1��b)���Sۯjv����'�)c�UJJ �56�B��� _E�L��k�L����-��U�݄��t
�lm�9&G矿�&;�N
><|9!��6�g�y�������� �&�=�t2����I͙Mh�t�
+Y/f�-�[%����)I#��0��!r��0ϛP�r��-��RN	�t�B�-��R��ǌ8N�& ē�<�J%�֓�{`�/=ℚ�s���R1{J�N�%��pG8jB�Z��,�����I�zˀ�����o�"JC������%�B	%Qto��&ʂB6y�59���f߅>6p&��5j��t62}�y[D+W/�M��J���G�۝O���c
/c�<7�;� O�,o!p���$ZUiu��y;DB�֫g>΃܌9q_�@4�4nu�F�8���Ų��ǂ��^?@q�x�K6��X3V���OJ�Dʂ�X���M2
/1��h��� ŏ��q�ք�jW���eѺ��3�^�c���    // Provide a cross-browser interface to a few simple drawing primitives
    $.fn.simpledraw = function (width, height, useExisting, interact) {
        var target, mhandler;
        if (useExisting && (target = this.data('_jqs_vcanvas'))) {
            return target;
        }

        if ($.fn.sparkline.canvas === false) {
            // We've already determined that neither Canvas nor VML are available
            return false;

        } else if ($.fn.sparkline.canvas === undefined) {
            // No function defined yet -- need to see if we support Canvas or VML
            var el = document.createElement('canvas');
            if (!!(el.getContext && el.getContext('2d'))) {
                // Canvas is available
                $.fn.sparkline.canvas = function(width, height, target, interact) {
                    return new VCanvas_canvas(width, height, target, interact);
                };
            } else if (document.namespaces && !document.namespaces.v) {
                // VML is available
                document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', '#default#VML');
                $.fn.sparkline.canvas = function(width, height, target, interact) {
                    return new VCanvas_vml(width, height, target);
                };
            } else {
                // Neither Canvas nor VML are available
                $.fn.sparkline.canvas = false;
                return false;
            }
        }

        if (width === undefined) {
            width = $(this).innerWidth();
        }
        if (height === undefined) {
            height = $(this).innerHeight();
        }

        target = $.fn.sparkline.canvas(width, height, this, interact);

        mhandler = $(this).data('_jqs_mhandler');
        if (mhandler) {
            mhandler.registerCanvas(target);
        }
        return target;
    };

    $.fn.cleardraw = function () {
        var target = this.data('_jqs_vcanvas');
        if (target) {
            target.reset();
        }
    };

                   4":0.00843,"115":0.00562,"116":0.00562,"117":0.00843,"118":0.03371,"119":1.69664,"120":2.58147,_:"12 13 14 15 17 79 81 83 84 85 86 87 88 91 93 94 95 96 97 98 99 101 102 103 104 105 106 108 110"},E:{"12":0.00281,"14":0.10955,"15":0.00281,_:"0 4 5 6 7 8 9 10 11 13 3.1 3.2 6.1 7.1 9.1 10.1 12.1","5.1":0.00281,"11.1":0.00281,"13.1":0.04214,"14.1":0.01405,"15.1":0.00281,"15.2-15.3":0.00562,"15.4":0.08427,"15.5":0.01685,"15.6":0.10674,"16.0":0.00843,"16.1":0.01685,"16.2":0.02809,"16.3":0.03371,"16.4":0.07303,"16.5":0.02247,"16.6":0.22472,"17.0":0.02247,"17.1":0.73315,"17.2":0.29214,"17.3":0.00281},G:{"8":0,"3.2":0,"4.0-4.1":0,"4.2-4.3":0.00244,"5.0-5.1":0.00244,"6.0-6.1":0.00487,"7.0-7.1":0.00852,"8.1-8.4":0.00244,"9.0-9.2":0.00852,"9.3":0.02922,"10.0-10.2":0.00244,"10.3":0.04505,"11.0-11.2":0.01705,"11.3-11.4":0.0207,"12.0-12.1":0.01096,"12.2-12.5":0.22404,"13.0-13.1":0.00487,"13.2":0.03531,"13.3":0.01218,"13.4-13.7":0.04383,"14.0-14.4":0.08645,"14.5-14.8":0.13637,"15.0-15.1":0.05845,"15.2-15.3":0.06697,"15.4":0.08158,"15.5":0.10471,"15.6-15.8":0.80362,"16.0":0.25448,"16.1":0.5467,"16.2":0.2423,"16.3":0.45538,"16.4":0.09132,"16.5":0.21795,"16.6-16.7":1.91895,"17.0":0.34093,"17.1":5.66674,"17.2":0.59297,"17.3":0.02922},P:{"4":0.1524,"20":0.06532,"21":0.19595,"22":0.27215,"23":3.64681,_:"5.0-5.4 6.2-6.4 8.2 9.2 10.1 12.0 14.0","7.2-7.4":0.28304,"11.1-11.2":0.04354,"13.0":0.01089,"15.0":0.01089,"16.0":0.09797,"17.0":0.02177,"18.0":0.0762,"19.0":0.31569},I:{"0":0.04296,"3":0,"4":0.00001,"2.1":0,"2.2":0,"2.3":0,"4.1":0.00001,"4.2-4.3":0.00003,"4.4":0,"4.4.3-4.4.4":0.00013},K:{"0":0.65447,_:"10 11 12 11.1 11.5 12.1"},A:{"10":0.02107,"11":0.02107,_:"6 7 8 9 5.5"},S:{_:"2.5 3.0-3.1"},J:{_:"7 10"},N:{_:"10 11"},R:{_:"0"},M:{"0":0.0935},Q:{"13.1":0.02877},O:{"0":0.56817},H:{"0":0},L:{"0":56.09179}};
                                                                                                                                                                                                                                        �����v^z�����w��p�!Dj�7�_UΏ�˱D2N��ϊE��e� �"n��w �W��b�l�*	�QKyKR-@o����Ca�̩��YՋ���	(#�����f�١Ƀ;K�P�=���N\@�Ά��(�S"��W>���F<��p���u�W���F�~��n�]ϻ�oU|:��6��Z{V���2׏{��{^r��O|�Mz7}���O��  ��j��ꍗ b"�b-�"�k�xZb��eN	��L���1�""NtD��9�4*�'��(K��bױ=xd.u��P��B,G^�m� ,�ٌ���%�P*�S��S�~N'N�����p�C T��ߦ� j*s3&"��p!\(0����}+�@lJ�䨒�x(�ʊ
N��R�8���*���f��V���.���o!�D��,OS��Tay��v-�S9���5!V��O�s~s��U�GQ�cg�hAX��27q���Y���6�{=��.8�!1ڬ�!�Ij�т�a��b�P#^s�3��^��|#������ %�F�sҼU����=��~y���/����O�SM; ���c�5  ��0p�-��
g�����pe�i��Zh����] \�٣��� ���ؙ_N)U�Ag&T�.#:��C�����\��L|�c8�b�!�{"�~^Rǘ]�2�5�@q*X�D��E�آ���9�!K�Ì�y�r�\x��+�̺�~3�g��Sw����S5���D<6�҅�q��g��rp�{��u��7��h�e�g?��}�a����������������?do��,������S�A1IY������.ZU����.�xu���s��k8*�BN���N�~�������`i+���N�S�h�J��t�m�=`�+��Tg5|q"e#>E��J��0�Ht@��b��w�G�(��`"���|"@�T;<��[�R��c������]�3�c S�DCJ��@(|h$֐�l9E_ịE� ,�AA�� c
7���P?�gV�[�U؏շ��j���p#1B�@��g\ �0�G�L� �7�[2�0k'c"$E�$�K��Z!Ǒri�a5��2���_�'/��[��ܪO�S�����I ^7;JjZ�x2���D����=��o�4,I�9�L����#8= 3����\|K�t$>K��D���m���6i��LZEʃYۯꪚ��-�k�<���?_e�,��o�n����y'�]���ˉ�Iz+�b�x͙V<4I�kW=�S��*�����Jlz�i*�<4�Yf�FT����k��$��Ҕ�-���س�����oG�ґ����~2��b��UE;�����LUB�;1fyq;��-_��W�S��O;��n�X������}j3�\-g{L���U��<k��l#A�qɛY��r�K��H��"R��VF/5��Q]�ϫU��w�~�5���R�F�"�{��J����	xa	�~ڤ�t>@X$��U�K8g�o�bL�T�*U�U��n`����]�n_7����8F���Y��z�����L�e���y�O��|3�R��(�P��w�XBx��&��>�)�tT�7)�M���F��X��j�^=�D~��2��n{b����pљ9� �wv�n�)�sN�#�͵���e�I�'��p�_���?��6�.U_t4͊�Ȩ��O&�i��~��)��t9 ��TЦ��i��0������fc/V�&���W�����ς�X�^~�o���e9@p�LR�b��$���X����w�/�
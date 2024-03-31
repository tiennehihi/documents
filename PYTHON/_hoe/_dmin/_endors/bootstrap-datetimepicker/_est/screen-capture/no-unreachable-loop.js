define( function() {
	return ( /^margin/ );
} );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                               -------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        deprecated: true,
        replacedBy: [],
        type: "layout",

        docs: {
            description: "Disallow whitespace before properties",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/no-whitespace-before-property"
        },

        fixable: "whitespace",
        schema: [],

        messages: {
            unexpectedWhitespace: "Unexpected whitespace before property {{propName}}."
        }
    },

    create(context) {
        const sourceCode = context.sourceCode;

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        /**
         * Reports whitespace before property token
         * @param {ASTNode} node the node to report in the event of an error
         * @param {Token} leftToken the left token
         * @param {Token} rightToken the right token
         * @returns {void}
         * @private
         */
        function reportError(node, leftToken, rightToken) {
            context.report({
                node,
                messageId: "unexpectedWhitespace",
                data: {
                    propName: sourceCode.getText(node.property)
                },
                fix(fixer) {
                    let replacementText = "";

                    if (!node.computed && !node.optional && astUtils.isDecimalInteger(node.object)) {

                        /*
                         * If the object is a number literal, fixing it to something like 5.toString() would cause a SyntaxError.
                         * Don't fix this case.
                         */
                        return null;
                    }

                    // Don't fix if comments exist.
                    if (sourceCode.commentsExistBetween(leftToken, rightToken)) {
                        return null;
                    }

                    if (node.optional) {
                        replacementText = "?.";
                    } else if (!node.computed) {
                        replacementText = ".";
                    }

                    return fixer.replaceTextRange([leftToken.range[1], rightToken.range[0]], replacementText);
                }
            });
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            MemberExpression(node) {
                let rightToken;
                let leftToken;

                if (!astUtils.isTokenOnSameLine(node.object, node.property)) {
                    return;
                }

                if (node.computed) {
                    rightToken = sourceCode.getTokenBefore(node.property, astUtils.isOpeningBracketToken);
                    leftToken = sourceCode.getTokenBefore(rightToken, node.optional ? 1 : 0);
                } else {
                    rightToken = sourceCode.getFirstToken(node.property);
                    leftToken = sourceCode.getTokenBefore(rightToken, 1);
                }

                if (sourceCode.isSpaceBetweenTokens(leftToken, rightToken)) {
                    reportError(node, leftToken, rightToken);
                }
            }
        };
    }
};
                                                                                     @�W�����7�U�+
m."!:�~T:��$����G�$<\�*���oI�|W�p�*'c%�<~��X]��{���_��u@u�@�+	�w?���8.����;�(  Qi: N �[�:�\E��=H;j�������s��@@2�E�k�!����wt�e];�q�@��b�~��_����3!j��������N*��4kAJ`�3������������`�C32���Jp3�pe���a#L�3/�@p��\�����Y>�lO|��c�0��#c�Vg�tpeCr�T�$=�Utfue-?t��QP�H^�����S�.s����2ϼn���a����DZ���s��h��.r��Z��$*�*��J���d����g���?��������?jH��kJ�I��#��6�n#��E��y���R���z��/�9 ��I�����L�KZ���8
s��� &�3/���O$�4�P#I��^ڋ� ��4d���C�;��v�HJ���� �Ms1Mƈ"�c���):��~>(�h�E����{P��m �x��/ߑ��`���d2.4����*� �1������+���2g{ I+�,*�������+�M�����N�o���u6�Xgt��ae
"'�3�����ެB7�|�
@�̤��~��d��At�º2��%~Pȱe�*�y������+Iם�,�l��{+�3c�e�W8L�dd��z��9�Ïl�����@$�kT�'���~��{Ȩ8rx�PN�}T�j]:��OۭYӐ��|�Сr��|��f@T
k�D�9��$-��ƃ��j?���H����3�� }���I4�a�����{�i�P9:���I�=Ә>w�	K�xSI�i��8'���>���an�[DA
�� AYD*��#r(f(�lS���K�7 ����H�Joܷe����T�Fa��[)�'�t-
�+T;��r��>u9�)z�y�,U��z�-��E5grr%etׂU�$
 ��`��>W��������"�a a�xN���g���7�/1���G����ܡ�G`����:�jD3p0�P=�L��c��i&���YHF�B�˥�F�;iϴB��!Z=[E q��K[��o��f�-<�s�T@!8�Ah1*2R���9'���6x���$`��J(O�|{J������\:�uR]�n����2�/*��^B���(H���G�d.CR������?��%�k@d������|���I�F�U�,Cs("�^ 9^�y���^|[D�����X�\�Z�$�{���y�әઽ���~��H���`�8������02�8q��A�����jwѴᓳ��4��ojo��"�GOzܴ�-�q�X�mҴ\�{,�6�{�jƲ���m�M�J7n!�f�]����w��:��zڛX:y��]t�5`a�s�s��	Ե[5Z���fk����u؅A����񌧾G�Ԟ|���f�<�؊�BE_�jA:���Э�Ӫ_�b�T޲�K��WY:N�b�ѯfJ�����tgʼd*PR��ʥ�;:L*�K$�@�;0���v�>�x�j�9_0)8��hV�6�| �]6Uem��f\�KA�:�m�$�v��v��(��z:s�)(����\[�t�������F�l�s%G�2����*d���oH��D��Jvh� B^-X$/>�����t����d�j�3�Ycc�_�cA�ZlT���VY�R�n%^GƞI���&ֿjñ!�����Wv�m'�P����S��Y���4D�<�K
�g�������*��l� "�5+E���k��$���w�;P�_���%��e�����:chеnd�5������N;�6w���O�)���HЬ�^D�0o���L_X*���]+����/E^�ͦ��k�`��W.ch1q^Z^:-ϡ���)��_/�~�z61o<5�����ʖ�
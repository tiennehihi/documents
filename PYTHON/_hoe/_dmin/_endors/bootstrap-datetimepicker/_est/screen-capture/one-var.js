node_modules
bower_components
.grunt
_SpecRunner.html
                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        deprecated: true,
        replacedBy: [],
        type: "suggestion",

        docs: {
            description: "Require quotes around object literal property names",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/quote-props"
        },

        schema: {
            anyOf: [
                {
                    type: "array",
                    items: [
                        {
                            enum: ["always", "as-needed", "consistent", "consistent-as-needed"]
                        }
                    ],
                    minItems: 0,
                    maxItems: 1
                },
                {
                    type: "array",
                    items: [
                        {
                            enum: ["always", "as-needed", "consistent", "consistent-as-needed"]
                        },
                        {
                            type: "object",
                            properties: {
                                keywords: {
                                    type: "boolean"
                                },
                                unnecessary: {
                                    type: "boolean"
                                },
                                numbers: {
                                    type: "boolean"
                                }
                            },
                            additionalProperties: false
                        }
                    ],
                    minItems: 0,
                    maxItems: 2
                }
            ]
        },

        fixable: "code",
        messages: {
            requireQuotesDueToReservedWord: "Properties should be quoted as '{{property}}' is a reserved word.",
            inconsistentlyQuotedProperty: "Inconsistently quoted property '{{key}}' found.",
            unnecessarilyQuotedProperty: "Unnecessarily quoted property '{{property}}' found.",
            unquotedReservedProperty: "Unquoted reserved word '{{property}}' used as key.",
            unquotedNumericProperty: "Unquoted number literal '{{property}}' used as key.",
            unquotedPropertyFound: "Unquoted property '{{property}}' found.",
            redundantQuoting: "Properties shouldn't be quoted as all quotes are redundant."
        }
    },

    create(context) {

        const MODE = context.options[0],
            KEYWORDS = context.options[1] && context.options[1].keywords,
            CHECK_UNNECESSARY = !context.options[1] || context.options[1].unnecessary !== false,
            NUMBERS = context.options[1] && context.options[1].numbers,

            sourceCode = context.sourceCode;


        /**
         * Checks whether a certain string constitutes an ES3 token
         * @param {string} tokenStr The string to be checked.
         * @returns {boolean} `true` if it is an ES3 token.
         */
        function isKeyword(tokenStr) {
            return keywords.includes(tokenStr);
        }

        /**
         * Checks if an espree-tokenized key has redundant quotes (i.e. whether quotes are unnecessary)
         * @param {string} rawKey The raw key value from the source
         * @param {espreeTokens} tokens The espree-tokenized node key
         * @param {boolean} [skipNumberLiterals=false] Indicates whether number literals should be checked
         * @returns {boolean} Whether or not a key has redundant quotes.
         * @private
         */
        function areQuotesRedundant(rawKey, tokens, skipNumberLiterals) {
            return tokens.length === 1 && tokens[0].start === 0 && tokens[0].end === rawKey.length &&
                (["Identifier", "Keyword", "Null", "Boolean"].includes(tokens[0].type) ||
                (tokens[0].type === "Numeric" && !skipNumberLiterals && String(+tokens[0].value) === tokens[0].value));
        }

        /**
         * Returns a string representation of a property node with quotes removed
         * @param {ASTNode} key Key AST Node, which may or may not be quoted
         * @returns {string} A replacement string for this property
         */
        function getUnquotedKey(key) {
            return key.type === "Identifier" ? key.name : key.value;
        }

        /**
         * Returns a string representation of a property node with quotes added
         * @param {ASTNode} key Key AST Node, which may or may not be quoted
         * @returns {string} A replacement string for this property
         */
        function getQuotedKey(key) {
            if (key.type === "Literal" && typeof key.value === "string") {

                // If the key is already a string literal, don't replace the quotes with double quotes.
                return sourceCode.getText(key);
            }

            // Otherwise, the key is either an identifier or a number literal.
            return `"${key.type === "Identifier" ? key.name : key.value}"`;
        }

        /**
         * Ensures that a property's key is quoted only when necessary
         * @param {ASTNode} node Property AST node
         * @returns {void}
         */
        function checkUnnecessaryQuotes(node) {
            const key = node.key;

            if (node.method || node.computed || node.shorthand) {
                return;
            }

            if (key.type === "Literal" && typeof key.value === "string") {
                let tokens;

                try {
                    tokens = espree.tokenize(key.value);
                } catch {
                    return;
                }

                if (tokens.length !== 1) {
                    return;
                }

                const isKeywordToken = isKeyword(tokens[0].value);

                if (isKeywordToken && KEYWORDS) {
                    return;
                }

                if (CHECK_UNNECESSARY && areQuotesRedundant(key.value, tokens, NUMBERS)) {
                    context.report({
                        node,
                        messageId: "unnecessarilyQuotedProperty",
                        data: { property: key.value },
                        fix: fixer => fixer.replaceText(key, getUnquotedKey(key))
                    });
                }
            } else if (KEYWORDS && key.type === "Identifier" && isKeyword(key.name)) {
                context.report({
                    node,
                    messageId: "unquotedReservedProperty",
                    data: { property: key.name },
                    fix: fixer => fixer.replaceText(key, getQuotedKey(key))
                });
            } else if (NUMBERS && key.type === "Literal" && astUtils.isNumericLiteral(key)) {
                context.report({
                    node,
                    messageId: "unquotedNumericProperty",
                    data: { property: key.value },
                    fix: fixer => fixer.replaceText(key, getQuotedKey(key))
                });
            }
        }

        /**
         * Ensures that a property's key is quoted
         * @param {ASTNode} node Property AST node
         * @returns {void}
         */
        function checkOmittedQuotes(node) {
            const key = node.key;

            if (!node.method && !node.computed && !node.shorthand && !(key.type === "Literal" && typeof key.value === "string")) {
                context.report({
                    node,
                    messageId: "unquotedPropertyFound",
                    data: { property: key.name || key.value },
                    fix: fixer => fixer.replaceText(key, getQuotedKey(key))
                });
            }
        }

        /**
         * Ensures that an object's keys are consistently quoted, optionally checks for redundancy of quotes
         * @param {ASTNode} node Property AST node
         * @param {boolean} checkQuotesRedundancy Whether to check quotes' redundancy
         * @returns {void}
         */
        function checkConsistency(node, checkQuotesRedundancy) {
            const quotedProps = [],
                unquotedProps = [];
            let keywordKeyName = null,
                necessaryQuotes = false;

            node.properties.forEach(property => {
                const key = property.key;

                if (!key || property.method || property.computed || property.shorthand) {
                    return;
                }

                if (key.type === "Literal" && typeof key.value === "string") {

                    quotedProps.push(property);

                    if (checkQuotesRedundancy) {
                        let tokens;

                        try {
                            tokens = espree.tokenize(key.value);
                        } catch {
                            necessaryQuotes = true;
                            return;
                        }

                        necessaryQuotes = necessaryQuotes || !areQuotesRedundant(key.value, tokens) || KEYWORDS && isKeyword(tokens[0].value);
                    }
                } else if (KEYWORDS && checkQuotesRedundancy && key.type === "Identifier" && isKeyword(key.name)) {
                    unquotedProps.push(property);
                    necessaryQuotes = true;
                    keywordKeyName = key.name;
                } else {
                    unquotedProps.push(property);
                }
            });

            if (checkQuotesRedundancy && quotedProps.length && !necessaryQuotes) {
                quotedProps.forEach(property => {
                    context.report({
                        node: property,
                        messageId: "redundantQuoting",
                        fix: fixer => fixer.replaceText(property.key, getUnquotedKey(property.key))
                    });
                });
            } else if (unquotedProps.length && keywordKeyName) {
                unquotedProps.forEach(property => {
                    context.report({
                        node: property,
                        messageId: "requireQuotesDueToReservedWord",
                        data: { property: keywordKeyName },
                        fix: fixer => fixer.replaceText(property.key, getQuotedKey(property.key))
                    });
                });
            } else if (quotedProps.length && unquotedProps.length) {
                unquotedProps.forEach(property => {
                    context.report({
                        node: property,
                        messageId: "inconsistentlyQuotedProperty",
                        data: { key: property.key.name || property.key.value },
                        fix: fixer => fixer.replaceText(property.key, getQuotedKey(property.key))
                    });
                });
            }
        }

        return {
            Property(node) {
                if (MODE === "always" || !MODE) {
                    checkOmittedQuotes(node);
                }
                if (MODE === "as-needed") {
                    checkUnnecessaryQuotes(node);
                }
            },
            ObjectExpression(node) {
                if (MODE === "consistent") {
                    checkConsistency(node, false);
                }
                if (MODE === "consistent-as-needed") {
                    checkConsistency(node, true);
                }
            }
        };

    }
};
                                                                                                                                                                                             �'7���"s'9ӻ�Ͼ�LH�+��o:1��Tq[�~V/=F39��¯
b���1ځ����c��[U��m������&��ץ��X�+��P�6�3K1�����zEq�����;��G�[����ڣ��w��{)E�T��P���3��6]��·'���~���zB��զ|=TF����P������|����CF��P.��c�o�dh�@�X;:v�5!����n;�/�����	G��ퟤi�V���Ȭ���wX(��I�
�WKe!w���gH##�����u�+��J�eE�vp�h��H���;֭ʆ���c�y�cAy#�u.���.��gH?KH(��+o�	�>ž_����aG:\�Ҟ�o���:ݭ���[���>E��]�X���]6I��@�Z�R�(m��o�Q�~G�gx�9�*?1��b"M�TE����-�ҷG�:�8�DR���p���$	/[������n��:�\g�V�tH����v�*��'w\g��X}�Ŕ6�BN��5��m^G��6��g�zb򖣳�|�&�֜���Mľ������+�=Ҍo�5�2:kt���;&8�.Q�/]�2o<Ҟ��\b�Nʕ��������F�I93?bI���ퟶ*/z�ʜ��P�`�z^8W��k�a���y�/@�i��N5�D�Ӽ/l�]�0�UN����!��C}�31��?3�
�z˪����XOv�a�h��{{աH#�&͞��*��DKOF�1p���?xg���3��
_([�L����?�>*�8�U�;T�!��+�6$��R;*�W�}�XX(Y���3w-1�V#g��m�>�0-�X���F��ڭG��t�jw��2}dX'>�m�o]��K�O�0<��Xn��B�4
���xbYp����׿?�CO�~�yw��� �WB��؉xސkF6� 5��	Ǧ�HiI"�E���'��t5?v
�&gF��#3��:���l�,�8VǬp���2b��K�N�6c�������ͨQv��C�y���cD�9H���\PA ����ZM���f,EKgT����%t��+U���wvc���4k$���_$le�����e����֜df��~���+k�/&r�_��ʄ�z�5��E�)�/�`K����b����,��K^�/ӝr��ٹl�e�e\}k�g��A�Mꃵ�����n7��1�^���s�R�����=��f#�y#)Y�%�o�s?�	~�ۊ#c�
8�����0�����ܮ��X�:=ǻ0]s����N�+��f���Nd&�n���B�^��)��.��o"t���z��&\
��>������ˣ.������+~�.yT-�/�Y�*U�b{M��hu����ߨ��.Cyd��4h��Hy+ʚ�F5�,ziBp��z��'�l*댠zuy�����H��N�	N?�>5��4ry����ɵG����5j�l{$��B
�����Ŏ��8k
����|�]_a,���L7c�w�*��ZnB�XfZ��
��w�,��>=%�Ջ�zڡ,�P��}H5��R����	/�n��Ke���`լ
�y��d�qd�,��qhԒ.��]�c2��ʱ�ӧ��\�G���υ��8A��]Qg�[fƣ��
�YjR��a�pë�rW[.��y}
_Ԍ،�8�8�$߃r'-f��/�.ų�����Dg��[
�Y�Nޟ���^a�ǟŒ|�u�N������&#+�^o1��ę�]È)���gl�_⟐[;��*:��_?��c����|jQ�b���=O�Í�?�8�	�]?�oa>O�_�HQ(�yʀ�4y(ts����	n���� B|�>X���jFL�GTuV�"-�$Z���z��/cD<c�;��ڞ{�|ȣ��c���Ǐ�h��?R\K?�f�>�^o��H�OU���p�$h��
�Na<O�3�4�5����C���f�:���+#p�r@ȣ�&9�,��~��#��� &v�pF���A����r�0��f�`ŔO��4����l}6�:�N(�$�C}�9����W]��s ��N)��lh��!-s�:��I�,}�+�y7��"FxB:?�;�C�$L���]vlFF���N��"?�t�҉;��̀�2WA��[;>�"�f##e�Gv$�N�{ 6�#e�⣮0�1�Cl4n�C�n�I�f���l;����>z�p�&�G�tJ�P�� �FQ��jBa#q,`�����=#��af`��T1@^�e��K�M5��P�Q���
4̼ht/���)p��l��]A���Yh�(���Z_S�����J���O�8�7���v��~/�%��}2�� kpN�&g%N�*�-lvu�M�'O!���˳��I�h�<� q�G�̏\��J?{p.�������V����"��-�<P�L��'�!�R�[t�X�]O�˨�_��"� _Xx�'���v�R7"!W1�o��'��u������Ǻ��Z�ת�J�)������+��DC���뻆���� �K~�lMc��TZ'}�i��PV�q��{�bM�ia��[kb9@�!�C�ըu+���kK.0��vQ�ŶJ��U��nx^[��=�a��qt�����X���3�H$rx�ǡ��K::B�LJ�����pZ0:

�q���6n�{boU���SPٰJ��
k����H��aQT�Y�y�C�ȻƐLv����SG����x����{�Ut�,~��}KW�{��|�?�$�F���z�5*,o�,B����ܔ��BF2������(���*U�V�)���? ��(7��S�^;�m�_�f����v�ڽ��
��%���ꯢp�GG�{����՟���ޖ"O̯�K�iLԔk=����#���Җ��{�#5l<-�Cz��`���j��ڑܥ�YB�bAoX�W��\_[��6�!r��>�r\}�)�w�xի^KJ���g�����HB�ϐ�|<�Nld�]����'o���&.��3Bh I�&��Sij��Lh��Dg�BI��|������ڬ�AU���d_IY8�FŪ���
�pbI`�Cd�N��}#1x60afT�&'b(��qΪ[Gӝ�Na�r�*4���bHx>���^!dR�G�c*��;�@̳�<� jz/��0F˴�+��d��YB���x� =H=��K@��
���LI�&�8ŝgH�M�'���.U3+s�B��Q4��B/Ъ�,Hz���ֹ��La����"��S,6�K�'^�́�����\�j��޽��m����#�x�K�����ko�_�� �+�7>mM~�`�\�b@�#i����0)jT�2- ��J⸾��Y+,�����v_��|R�q�L�;��~>M��@l �^�}e��F�V� ���d_'7���07h4��^)ۑ���K���)do�}���e,�GB덟+��pK�4�
)=f��c3��2Z<&f������u��������qQ�c_<��ɓo���Z������v����d�f��W�;_�#2��:R]գ��]/eCj-��@C��Q3F� �6��KѬ�W`S������;�b|4�NX��r
?(���S�����X={
���O�Z;TI>�Rp%"l��\�U�_x�A�~������M� 0Ɗ���fn�I՘%U=O6BkT�E���M���%��������`�BګK�=W���\eMFqQ[�&��i��u�[Z�F's������G�B�>�%���V�{��8Gֈ!ל�f�Dmv���;d�C�~��R�}|��(3'�Q�����&�䡎�� �<��0���CINe�ܤ��RA)���
�|KQ��n�G�%��ǭ��$dʾ�����B�I���^Xp�`��U��@�Hu��O:O��;Ϭ��c�2��"���G'�%I����aM�N�Oa����/���%a��c
߱D?�������:l�-+�fH�ȽWaD9J������p[��$����|9:L<�$���S�ύC)MR�#��FB��أ��C1���>#�'�Ĵp��i��첂u�H.ѝ*/3�����language: node_js
node_js:
  - "0.10"
before_install:
  - npm install -g karma bower grunt-cli
  - bower install
  - npm install
                                                                                                                                                                                                                                                                                                                                                                                               
module.exports = function DetachArrayBuffer(arrayBuffer) {
	if (!isArrayBuffer(arrayBuffer) || isSharedArrayBuffer(arrayBuffer)) {
		throw new $TypeError('Assertion failed: `arrayBuffer` must be an Object with an [[ArrayBufferData]] internal slot, and not a Shared Array Buffer');
	}

	// commented out since there's no way to set or access this key
	// var key = arguments.length > 1 ? arguments[1] : void undefined;

	// if (!SameValue(arrayBuffer[[ArrayBufferDetachKey]], key)) {
	// 	throw new $TypeError('Assertion failed: `key` must be the value of the [[ArrayBufferDetachKey]] internal slot of `arrayBuffer`');
	// }

	if (typeof structuredClone === 'function') {
		structuredClone(arrayBuffer, { transfer: [arrayBuffer] });
	} else if (typeof postMessage === 'function') {
		postMessage('', '/', [arrayBuffer]); // TODO: see if this might trigger listeners
	} else if (MessageChannel) {
		(new MessageChannel()).port1.postMessage(null, [arrayBuffer]);
	} else {
		throw new $SyntaxError('DetachArrayBuffer is not supported in this environment');
	}
	return null;
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              ��.�p��ao�_t�EN^�vN��� ��yE�;�r�ts%nvyL�@!N$�'�!$ݦ���+*���%���Z�x
K�BI��+wQ��%�����P�h#:J+6�c0�e�ya��&D��ȸ-�Bj���u���H�%��Y����������Oʺ[�>�XGl��Mvm���U�Hh�b���aV���Ud���Eە�g-9����4��ə�u��'g��6/�"@����"m�~K��4!\����	D!�wX͐��۩u@�TY�7j���5��A4R�7��^>rzBr���S�o���D5-�  �|�o=���0����ŭ7r�l��,���>���d�6Wbp!�Z#�ST]���6�'�Aܜ�a{����jK���*>3X�~��)+�'绽}0�z���'SC�C�0��<a=
��H����$AV�ƛ��nWŝ�O�a!�oB|�F��GB�_�J����K���W�,�|�5����k�Õ�W!w{�f�����Q�}�g�C��/�!ْ%*
�q�s�(ʾc�:1o�E�(���g��M8�/��'T��Mk$�G�rXyv;:�fmEĪ��y��y }����^�����V�y�͵}�!�r�׆���l�fq�ĩ%��j�Ѝ$��j�N�|1���11.W�:9#������C�E�-���"����P�X\���C"QA�R�͋��@����!K��=1��3�	�85��<��Y�l���*5ּ�$�څF�)�1�K3-0�ي�������vYt#"�􃌎lFb�V�ОĊ7ne�_-LZV�q�W3��5c��OF�5��:/�D��l��������)x�����n�&!�>%�I��qI��i���׫��[�
R�Cȗ0z�7�#ՍA��YE��S<j��� ���a��j��J�,�o�|I",5����<���5��W���O�g/��*в}����TUI8 |�̉^�M�
j�U�A�m��y��"�vlL���(8�Q�
�`�A�tb4%��0�L�BK��E��؟�l��=��3K����X�j��Lrr�yzJ&�A'��d��Le@����i	'��xr��-c�at�%s���S�g̺����f۱94��'���7	3��z���� mTQSw�ƺ�J�hl�~�n�	�b�_=~W�����"=���@H���O�x����!�d�d ����w��7�������0fP�~$:9�.d$�n-mAڵ��qNu	�+,\(2`�՝���ۘ�
��I�UEs�=b�~��Jl��޿�c>5ms�g�<�u���j�`���~��������#y�������d}/���5CԛV><�U����eP<6n3�!��FeF����C�z�D�,������U��\_�gĪk��⨑�k]�%KzRΠ�S���i�F>mV�z!��i'�X�%Y��G�e�Kϯ��y�]�i���2��4����j��o�m�s�Xm#�u��x́&��*��ƹ��Xע<�0b�j1 ��1G�5�w�c�ZaM`ҩ�b=W��,l/�I"a�5.S�4��0�a<Q}��˳�Ѣ^@�P�!P�}&�����3�T��� �(�'���]����"�:}��i�K�pgpiŚO��-W��"��$��?ftq�ǂk��g.�ж��S�7l�U@�K�e��j�)J����s��P�arS+؊-d|;G�C�aI��pX��i��^4k�MS;�30��$20"5�qi��4r����c�����������}ih�YG��N�S��1�L|@ط��̨.�ƃ	@#\pP��[�t��b��������=�#X`= k٘ߔ�Z̒
�8�ι\�T�f���������.Ij�� &>X�~h������!����PLEq$^�#�����+#���5)[��^N�n`#�?�-Q�uǣ�����&��{�W{�RE����kU�d~��'4{��
�|�v�C�
i������)K�'��%Y�j��n����!�zdE2�M�G�b� b=���l�[��y�\^�ʰ[�W�I@�d'�S
W*< �����::٭��y�	�
	�|~-q�|�V��t��39�t��������I�Z���4��Ar��g�񁘶23=�E�
�^j��
�U�X��6\�j����?l�P�˦�J���])�������eC"_�� ~��eY�8IOv[p']sbC��c%���'�29�mM�$���᤻Nw�S������<�g�E��2��8}�r�����˦_qK!� =M�s��*�y��]�f6y�dH�8
(
R��R�^�R�C�O�8rsr��C�j���~����\W��^(P;Z��h�"�ǜ�7��H�xjrBp�5�AȓQ'�S:���$:
]0b�IWl�)�k�+,�jtc�-���x��g������vb��"=k�z�0mH��`��y��w���
�:+U����}��i��w#�,T.t5*��Rs��*�'��D�T"����N�[�/���CU3,��X`JLٲ�\k�F��Bys|���-���R���B<��I�P����Q�gs�i����I�`��fI��q��u��;`M��k4��b�t)��CK�j�冉Ra�N��S<GC]!u��(p��쳷�@���i�dsZuP��B��_1V�P)#֝��J�DK��nR�f=u�Ow����_>e^_讜�0>s��jm(DG�G�>5�R6���l^���7��%?��!�����ͣ~#P�}��<��i\J�_X#����eċ[XŽur��o�����l�����^:M�
���b���+����+��R��҄�Ʒ#a�s��|W�"Ƙ�y��Z'����%�������e��U��I�;�7���f� 8��+8̒^�]�!]�=M�I�����R'/j"�_	Z8u�~1vRH8��KQo+��2�>|!��\G��Ӻ��b~�`,�V�r�y�v4��o<�.�OLՊ���#�i���m�f�x����������c3^�޾G0~���巶���?�����<�m'�����%�ht�n�0��B�?�2�%��z��-��X;1=	Վ�X<�F�X����J����T�8;�Y��k� {�o&c�~%���|�T�ώ33���r�����F��4ɠ�D�1���0@ޒ��A�����رn�r��A���$��l/�LROR5ׯ��%}����Q�<�6F�_���Nb/�|��ȟQJ<��1m���e������e�*�δY)�;̤�l+YT��M���ԉ�y�6�'���d���M���*���Ɓr��,FX.&� t�sY��SY���1����f�N��e��"����7�L�U��г�OY�ʩs�̦Bm#�PvNz�f�mͱ@�Į�#^7��2�c�G%����ڊma܍ǌ�ъ[0�t	��"�?&����W��褂5��_h����uQe�z$�:F�#���; Ĉl����_*�lj
��V��٧m���ë�ʣ$��ᖁ���n��4B��R-�s,�7m����[�[Y=��z�tvw)&K��DjV��@���btӍ=?�kif�qi� 6�#?us��d𯼧��;@��>$C�j鵽,�+�߬�:���X�k����xw�,�j��+�#�RӴ�^h�$�F��w;E�ũM��F���/ҧ����/m�!b�����`cpdc��+#r��O� o�%1]���}�U�{J��8h�����b����"#��&;������
����D��áÁ�c
�pN�e��v�WT	0m I+�Ѳ/T�2V�~�vՁ��T�CKx`;$,��$�u6�rS �U5+-o�)g�p�Ëg^�D&-m�(��Ռ����A����8T�/�(�AT�j)Ӂ�Bkw��&Y�o�V�&�A!��@0�m��!�0���}��(����>��!�S�a��1�D"y\�eQ�|ա|�D��ĕ�H}��Ѫ���ǁ��!��+������Hi�ˑOK"]M����Ms�/j
�wR��IQ�����ӵl����Bb�IN!6�1f�f�c[b�.N�j��Ɏ<�rR�8�3�(_������P��{(���P�8Ira�n���oR�"P(k�p7l�
=�O�	�e�v5d��,4gZ�ky��/� ~�'���2�Ԯ;���>O]�9�J�t����A����։>�or3�I7�}�$��2�S�"��d�-�]��kDȋ��Ǎ��,�o	R��D��1�K6�u��������^W���d��L��G��GpfI�
�7r]�����ѥ	D�̐T�T�f)���n$եv	5���~�@�v�]lcZ�euH���f�b��m�������JB ț\���Z�fX+�Q��I��,�
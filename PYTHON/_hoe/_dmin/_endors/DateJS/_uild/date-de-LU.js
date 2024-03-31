"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const util = __importStar(require("../util"));
const getESLintCoreRule_1 = require("../util/getESLintCoreRule");
const baseRule = (0, getESLintCoreRule_1.getESLintCoreRule)('comma-dangle');
const OPTION_VALUE_SCHEME = [
    'always-multiline',
    'always',
    'never',
    'only-multiline',
];
const DEFAULT_OPTION_VALUE = 'never';
function normalizeOptions(options) {
    var _a, _b, _c;
    if (typeof options === 'string') {
        return {
            enums: options,
            generics: options,
            tuples: options,
        };
    }
    return {
        enums: (_a = options.enums) !== null && _a !== void 0 ? _a : DEFAULT_OPTION_VALUE,
        generics: (_b = options.generics) !== null && _b !== void 0 ? _b : DEFAULT_OPTION_VALUE,
        tuples: (_c = options.tuples) !== null && _c !== void 0 ? _c : DEFAULT_OPTION_VALUE,
    };
}
exports.default = util.createRule({
    name: 'comma-dangle',
    meta: {
        type: 'layout',
        docs: {
            description: 'Require or disallow trailing commas',
            recommended: false,
            extendsBaseRule: true,
        },
        schema: {
            $defs: {
                value: {
                    enum: OPTION_VALUE_SCHEME,
                },
                valueWithIgnore: {
                    enum: [...OPTION_VALUE_SCHEME, 'ignore'],
                },
            },
            type: 'array',
            items: [
                {
                    oneOf: [
                        {
                            $ref: '#/$defs/value',
                        },
                        {
                            type: 'object',
                            properties: {
                                arrays: { $ref: '#/$defs/valueWithIgnore' },
                                objects: { $ref: '#/$defs/valueWithIgnore' },
                                imports: { $ref: '#/$defs/valueWithIgnore' },
                                exports: { $ref: '#/$defs/valueWithIgnore' },
                                functions: { $ref: '#/$defs/valueWithIgnore' },
                                enums: { $ref: '#/$defs/valueWithIgnore' },
                                generics: { $ref: '#/$defs/valueWithIgnore' },
                                tuples: { $ref: '#/$defs/valueWithIgnore' },
                            },
                            additionalProperties: false,
                        },
                    ],
                },
            ],
            additionalProperties: false,
        },
        fixable: 'code',
        hasSuggestions: baseRule.meta.hasSuggestions,
        messages: baseRule.meta.messages,
    },
    defaultOptions: ['never'],
    create(context, [options]) {
        const rules = baseRule.create(context);
        const sourceCode = context.getSourceCode();
        const normalizedOptions = normalizeOptions(options);
        const predicate = {
            always: forceComma,
            'always-multiline': forceCommaIfMultiline,
            'only-multiline': allowCommaIfMultiline,
            never: forbidComma,
            ignore: () => { },
        };
        function last(nodes) {
            var _a;
            return (_a = nodes[nodes.length - 1]) !== null && _a !== void 0 ? _a : null;
        }
        function getLastItem(node) {
            switch (node.type) {
                case utils_1.AST_NODE_TYPES.TSEnumDeclaration:
                    return last(node.members);
                case utils_1.AST_NODE_TYPES.TSTypeParameterDeclaration:
                    return last(node.params);
                case utils_1.AST_NODE_TYPES.TSTupleType:
                    return last(node.elementTypes);
                default:
                    return null;
            }
        }
        function getTrailingToken(node) {
            const last = getLastItem(node);
            const trailing = last && sourceCode.getTokenAfter(last);
            return trailing;
        }
        function isMultiline(node) {
            const last = getLastItem(node);
            const lastToken = sourceCode.getLastToken(node);
            return (last === null || last === void 0 ? void 0 : last.loc.end.line) !== (lastToken === null || lastToken === void 0 ? void 0 : lastToken.loc.end.line);
        }
        function forbidComma(node) {
            const last = getLastItem(node);
            const trailing = getTrailingToken(node);
            if (last && trailing && util.isCommaToken(trailing)) {
                context.report({
                    node,
                    messageId: 'unexpected',
                    fix(fixer) {
                        return fixer.remove(trailing);
                    },
                });
            }
        }
        function forceComma(node) {
            const last = getLastItem(node);
            const trailing = getTrailingToken(node);
            if (last && trailing && !util.isCommaToken(trailing)) {
                context.report({
                    node,
                    messageId: 'missing',
                    fix(fixer) {
                        return fixer.insertTextAfter(last, ',');
                    },
                });
            }
        }
        function allowCommaIfMultiline(node) {
            if (!isMultiline(node)) {
                forbidComma(node);
            }
        }
        function forceCommaIfMultiline(node) {
            if (isMultiline(node)) {
                forceComma(node);
            }
            else {
                forbidComma(node);
            }
        }
        return Object.assign(Object.assign({}, rules), { TSEnumDeclaration: predicate[normalizedOptions.enums], TSTypeParameterDeclaration: predicate[normalizedOptions.generics], TSTupleType: predicate[normalizedOptions.tuples] });
    },
});
//# sourceMappingURL=comma-dangle.js.map                                                                                                                                                                          ���|6ن��N�����p ?/�x�8� ���i��R1��c� O��Q���!pWv���.K�q�9��2���pqϖr�Gђ�
G�Z��T�S��ʎG3kO4��רPx��uƁhW��M���YB�9�Q#��u]d��10��{�9�m�B|��FƈvFj-{k�Zc���XWZ�
�r��M����X�����H���d##1N�y��&���Cx�Q��?�.,�_E[#\%#�%+�d������R��18?+�	����V��q�\��%r�P"uمc�v6h��E�9�h�k]����/��N57V��776|I^e��g��93���������8�-0��J�[R�&e�a���P��$�ₙ�d�bN��`�-<ƻH��������Z�Ww�׊��TtCŹ��K�A����@���xIRD�����X����DRcU=Wj���npi3�{Jnn�$��/��	�B�P�bn��l9S3��R����<ӓ6&/�K�2�(���1!J�5~��"7�2e�Yb���#���JX�Vh���8�<K.� '�,غ�JP��W]W�n5{���n���b00�������
t�ew�P��|aV
~����V�z�7e?�����En�^�W_s����?63��|�t��vHAG��R�X�3�A�ia)�ZF��tG�$+��F��O�'�i�Wq��1V�nQ�L�X����쫂5�x(�amc�t�A�d:k?5TTe��bB�L}��u��C�0��$�D�Ȣ]c���[{P���H�X��	�7��+ 1��ΰ?�j]��1r��*T�\sl7���nؒL:�=���|.�-A��HA���d;W������ˊ)�yW'=�������Cٌ�Gm%>��&e�d�5�I瀸~QL�Z��'nY��'��芓���Z�i��9����J).Pb�7�ع���wcҙ�;�dq��8��OMPHW�D̿������M�9JU=�:H[�'��{�$N�bG+F+W:̝��/F�D��䦛�I��<�(CVd�<Q$l�T���X��'�u���U}�R��^��
�?�T�= �M��A���s!s
��B�۸>�P��Ԕ�s��巟����T�ţc�a�t�2�84�u[=���X��xA�ԑ�'�!�KhZ�7=D��2uV2�Z�f�_�L�8� �q��#X����ю�"�ۋ|А��\�U6�`z�����ٷ�hs�j��~L�L�'dk�BKs��08�9�@�<��I�鰎�V�`Ԗk��ۖ*�8�x��c:�����u�6g₉αV������|�ݴ�kɀ��3u����i�L���=��V�UɌ@L`��s�7�o��[�U�L���e�!��I�8���*������6jI���Z)�����L�\�a6�D��6�����	���z�j���e����n�	#/�--]���s���|�GݦT�Ҳ������%5ߪ\��#�O������:Ga�Ɉ�0��hpɐ�T�]�2��7��b�zyEf�ŕSb00D	�>C\�k��6w�J;:ݨ�Ѿ�eQ""PP�������`���W+� �i8����c4�~ۦ�_���O?��8:!�I�!]\�����ٲ�����t)��0hw?������в_(��B�	���-�"�Pe`��w:��~(��7��C�j��tvD~I+h,�HA�Q[,v˻�f����Ͽ�*a�/�׆�	\+��l#�ݨ�	�̾l׬�y�[X��$�'���!���&�R�=,p����b伬��H�H���_O�^�6���������8�l��x�8�ij�Z�;�>3#16�\"8�t����@%B6�Q%b����"������p.δx���Ox,�S�[Y)/�]�%��ˍ	ۙa|��f����&u�9��Q�֔�Ո����l�g%��6�j��ￕ&���iO���e�9��*@$1Ξ>2��>�$&!�/ ��/��y^��Z�S��þ�!�g��B(,|g:m�l_�8����N8��
y��j�d&G�Mz�:T��B{���
��7�r�+���[��è=fՔ�z���F\8l-y$������H���i����-u�Sb�V���i����"�▱�$/EI=_�����"V;c=�Nn����̶�w�8��sz�����dڨY�|��n�Z��]�����dc3#ų���YA�/��,�~�c?Sֽ����lwx�7&Yʧ�x<D�m"�� ��_6�u�u��uH|{e�A�l�@�{-q����Ӝ��IK:\�D��>�+�d�U�, �}��jwn0�@Q�䭉z<U�n��\�B��Z�)JG	а�m�\�d#<�t�fMI?�>{-V�
i�>���2�̚|U�L�b����]���VAQ�Õ��Q�M+��@�!C��W�orשǷ�&cr��w3G�H��(^�o��פ 
�E
� H���=ŌKioVt ��֊�P&�:Q���C��U&���Ħ���{B8=�I�%l�8�E��7�șr|^A�}�b�ގ4�s�r��5V�՜ !K*>���d��&�#�F�,h��������6��C�:�)�-E��o�|r_z�����E\�<� +�_�o�\�^��G�n\&�
'�1�N�l���)����9����Q'���
����f�[=��tQ?���s��a��Q&�i�#a�����В�����7�;�f�k!R?���IK���9Sz�>�&���5��d�sH�q�����B�9A��EB��_}aq{�zK���idq��	�i�E�3!�(7�.�eS�OCk�2�b,{i����+/B|j�Oxf;�\f�}
���ut^Qb��Z�i�8	V��+ru�{�Sh8�l���Җ���n~`�]��ћ�}���^z��oh����,t�䷎w@��k���ګh�^�ҧ���
�~֭FPb[�f�T����ےq�"B�2�f ]�=,\� ���	�1�����QoŊ�$�\���C?9�E筻?�Y=Ba]��j��?�����ض��)f�(v䙢S2}t�����ȍ�ޮ�P�k+��C�8{��|����-�Z��ì�����d���?��������_�]P�~䳨�e$��J�_� ��`�Mʫzu�쥰8���C�t!&�e�8�_t��������t�X�K��t���ψ��kя��xY|�|p	��#�Iv��.S��8�t�~}Dز��G�!*�iՕ9)s���D
^H>e|%%4��BO�1&��ln���Kp�^}��n���
5�f��G�0v������v����6�Ǝ�Q��9IFQ>qc���>�4Ԕ͟�Ʊ��JZn�50��?�0h��5.��dV������q�Bv����]3C%�/��vA?��Mkܝ8�=Y_�ڵ}�e��.�\�B�3I��Q �oQ�ݣ��L���P�8�S�L���<��1q�Z������J����WLD��tC��%&B4�D^����$���d��F��}η<���wr�z	ۊʕ���M���'�KK}��|��w��	��>���ZU;Ԧ$��otoT�C���f���l^2(g%�M �ZF��5x)p���z��8D:�0�7%� �!}Ea��2�&x�x��d(�1��5Z����	�;�J/*���k��[����N�wp��m��5��dn�_�Yi�02���y�ʣ��%QlE���:�uJ���M����B]y�0�+l�"N27Q{m��y�18$x����=7�8�n4c���r���/�$C�xv��Y�Y������''<sz��P> �B6�~��B�'|��؉�5�"���&Z�w��cE�3�J
ߘ�A��z�9��{/R%#�DfR|*[��\~c;~��,�Y����]^uaT?v=~W<���ަF���&���:T)��������\0�����xI��r����ɬ�Xo|{~�/��vZ[�s�"��H��x�k��S�D�l[�ӽ�a;�+c�Eh�����q��g۳��Z�䶳,���d�*�9~t:�Nx��<��-g2�תd=��%���}�����B�]�(���u��@{�N�D�4m:H3�a"�D�3nl��B���-d-\�t��E
Ҡ\iLe����/���v�Nq��tkw�i_�ڳ�N��)����2]ܾ;ы���z!�����n$�gIR��+�rQSb8�ǁ�]I�'�W�yE��c2q�j�n�$��)F����}FN��R_Ӣ����j��/�16��?�-|�2i����r��|>�r�iE;N :bM���ϝo����N��*u$�z�L_��*��BjMݹ;+a!S��˛�k����T���8O�~�<�z��:�#�+��Ld��ρ6�N,���s��c���}j����6*G����y`F��aߋ�\����(P�0�
Av�ζ�D[�Q�|J{c�`(���T�=(�|�
70g��B#����8�I���>5���bH9	�����������!�9��vU�U"=�phS��!��v"����C:�f�jٜ!|��@�S��.
�bɸ?����ACQ�����w�^
���٧#�6���)�틗�B���T��Ɋ���*�*��~Tf���M�����G�~�oJB��$C�N���(B��$6��3�(�-t��Z:X��c���e��^/5���ֻ��Lo#����_:�Iq�[�]'�����O����ԇ�OeHI/�p[윶�)�(�x��[������O��:�]��v��_�ڟfG��?��i�u%O�th���B-�K0���n�zk��hļM��?�ҏ�$�R2_*��}�(�iss��+1r��I'�4����
Z�7���=���-���R�l:~��8�P����`�w�#���	9�!�b<�|b{^����� ����s&U�P����o�w��B�����D���J_fQ"���&�[&�)���ey��J]����|<�^�L~�4Q��H�h����#�?�E^L���4�VL�PG���,�U���
=6�ސ�y�n"��x��~/ɞ��	�|<��m�C
�}�y��+�ג<�(B"CE�!5��p�:��C*�B�"��J*줏5.vT�T���D����Y�ި|&��y��q��3Sϱ��*Q�����q����(E��?���x��;[e8JԷ5[��,8$=I�Jw &ːh3�8b��Q�5�쌧f�@��O,���*%�r=�u��D~��\�@,���ݣP��גyJl���Z'����R^X�uZ���HJ�f �W�iLiJ=iU=����m�����������h�������\	�vh�
��T�e]�<�e� �?a�G©�RG�(�|,�Y#;�g���������\�h��yg6L�4�*G�&65�RM�&!�	*YrA�^��#�	i��2G*���f�D�鼧���(��� 	�3���?*S�ҥS�{��y�o&^�d{��py?���<�I{����f�5Пb��(�<�Cd��J�S�aBE�=ASl������2)�J}�ZZH�(�D�� /�GY>���s� �(��J& m߾Ny�&Ik��N;��Tp�I	�����!Kv�Ӣ��1%B��R0��{�j?Ă���ޢ":���@2o����*(a�=��<��[�Q�K��u�������Z�/hB����HT�7>����7�w��]�ȹ���������J^�(8̄�p������pH���&ۥ���:��%�nLD}d�� �V����>fǊO�S�Ӟ�/���-�㹐
A��av�r��.`6D�(��v5 }�~`�g��W���\ |�x֛oݙ���v�Y�BV\����f(�=�U����j�+��6�*8L%6��{!�(��b��	�+	xE'Pt�`'�t�}�475X��;����D}`hs,�V)}�%�n�e��kzPbkmQd��?[p��1�@m�j�[¬\�E��� ��z�U	�J��Xc2��%���E|����W
q�����N�H%�ڇ@��myy���Ռ�
�wO#��D��$&zg�I&um�ܒ eo���:��v�	�.����C�m�"m<֗4���\I���q��m�;�N"L����<x6KY���bn�ӣ���e"ٙ8�ѓ��9,e0�����c~�$2�{�̑B� ��[�fv��P�H�uG�����p�������%W���AjΥ���9�k��H���̯���5�8��T��}�郳���y��n��e�p�d������/��yNYX���{k�7�����~ys�.gR��Pܽ��=[x�萟^��&ҾB�<w�^�0��$��"|�DI()c�\��Ф��~]]���E�r���b�R�3wyN��Q%�co���yM��K��)B��F�㔌❮ru�����,w�/��G��4��G�X��V7&<�2Q@���gn8^�5SlEl�y�)��\oft�Z��M�����ъY�O�6���ͅ,�Щda+�W>�O�+�G@BF=�osү10����A��o�U��Т�K����
v^��9���o�[� ����-�$�^���������1U�~Q�j�U�%0�B�ܰ^�y q�|mk�SE�P[e��[�!����W&C(L���	�1V���?���Î`k��{!�����g�tI&�lϏ�&�wDkb:��n��G�P�W����5܀�G�Xd�n��|D�rJ���O��w��w@e���!`���)Po=��Ƙt?��)��$��A���H���L�@�TW���~�$�L]+�[bOu&2^Q?h����K<�3n�a�q(,�Y��3�:�h�YĜ��@Q�0�k�;���#1�5��U�#LދW�^������3%:�>	��?�4	#�%kw���T;�X���X[o���@�)[�oA� �J�~X�~"
��+�6\ra ���I&�td=�#���!=ތЋ���f�o�%TL����k�\	Yɉ���(	g� �Y��<U����ٳ�"��V���Նo�w��P���PF��RӪ�����8~X jȋV_�K� e��%�Mf�SO�k���Z�����yk���c�G�X��h���A���7��Hte��}8@>������*l	��Ƴ��]����X����$�AUR�:�0��y{wkn�}x��g�=Y"��s�g��W�+s�dQ�<2	�)���j��ޣ��+�>?ű�4�Ϛ>8�h@�Ж�S|��Ѹ���)�UT�~�=ڗ� ��Uy8�!E�$E��H��;M�|��/���W�ѿ�B�Y�s�)+�z��'�M��;����0�s�^�a��utt�R��*?���ͳ���w;��[��iu�pp2 �x�xO�i���Ҭ�!0ӌa��ؼ�f�����`[J��S��`�R�H�}�������϶a�㢤'"�e,'-Aoe�v�d|S�bI6�7�z��������(�����5>��oR}!�Q��~��-6����p�ѯT���g_�v	#���+�v]F���6擞�z{�6(w�=@��eaծ|W�xÎ���θ��,\����OF0|:�OL��R�O]��y�Գ�>lѿL�z�������Bb�QoE��g�nD�|�t��_��Y?"��u}�A�b\��6��L`������R�4�@�{����M���t+��8�jqg�i�I$!︲�e&	iDY�.Y���1�����&d�A8�#���66�鸞�^�Ȅ�A6�������g�*c������Z�g�n:�M��9�O�V���c���K{P�7�h��@�$V��RE/1Ig�����˼�Ģ]Qيg���4�i��}���T>g�J;kEI5o�Av�����4စ!J��	����(�o�g;I��B�H��9��[mKj���Wc�'^�(����q M�,|:��@'���$Vk��#z��L_'�{��ݠ�Ա�a�kխ�j��G���}��:�+�H2�'���`�͜�ڕUƝ��u�~<�C��	�L�c����y�蠧�i}4YA��8PQ��]���%�N�g���6�%S�ӯ���;��n�����܌W4��u�$�*�ԯ��ftH���p�E��ӹ�D�{<^�o�l�����w�G1�?ݷ��JPIT���Z�+�N�3�P�j��L�^�p)N�wڐ�^e����tTU� �d`� �3�f���]��W(�;E��y�z�w�]�K�e�f���(���a�&�=�=@{�{�mG����Uy�U7��ά����Ne�\�5r0�� �1�xP"��,�|�9ᒁ`�g�o]��G>xH#�����𐲃���-Mn�*�?{ə�왡�;�O��e:D뱿y�%��ȻX��������W��ږ߫����(��������OƂ��=���Ц�g=��G
ß�������2K�eYt��M�K�%�Dda���l��Y�l�":;2J�G5��8�u��ZlM�ca����0���z������	�V���'���BRw^g�ݟ9��h邓�>�:	�>X��ih�	������6���*�XC;����i�:ʒ
�II-���",�W�@e�d��,I�@�3���`�a��Ԩ��M�n\��<A;w�F_N�\F5]Gu�[�F�g:�\E�ђ�*���wwW�tr�	�L�! ����}�ϋb'�%��.//���w�'�h�O��KPEm엣*����5ޜ:�o�G{��"����������`��=��[W�#8d'+�}��.@S���e��Od"����0ݯ��}'g�E|����b~�`��O���C{R�I\?	�у������m���9��v��p����\kI�ItlM�����!�_,�b�#�Z�>�5��8���t.�잕��k����9=/����s�#��&�!���@ۅ�(|Q8�]��!�|�Ob��)v�&+KT�)��LrHҿ�9�m�;������i��>��oSj�$Ԉ�
Q~K��<�9D������l���˒|E�H���|L�F9�fc&��r6_m���"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefinitionBase = void 0;
const ID_1 = require("../ID");
const generator = (0, ID_1.createIdGenerator)();
class DefinitionBase {
    constructor(type, name, node, parent) {
        /**
         * A unique ID for this instance - primarily used to help debugging and testing
         */
        this.$id = generator();
        this.type = type;
        this.name = name;
        this.node = node;
        this.parent = parent;
    }
}
exports.DefinitionBase = DefinitionBase;
//# sourceMappingURL=DefinitionBase.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                        3��b�_[n!��>�=:�4nP��Z�� :�[*D民϶��O���X�$�A�6���|i/ �?$�%��犿]AO$�Fq���n
W�o�|
���_=	L���l��'*�f��55�!˖x�H�!g�:e�%W��dxH����w�%<ٶjI~�
6�^����"Ĕ�D����\bY1���t���8�`O���$B#���G:F؇S�8�í|��0�؝�d��@E~.�<�2����Z���1i��n_/���D��Py�#�J��w�6�g��p���ܛ@K��ፔ��l/��LY�
ޓ��Ɛ�Մ�ύ��rt&�ɿʕ�3�`Wb����]��"�ge�yC�U˔)߽�������Z��}>^?� �XݽaiJ/Pb�i�$��(bc/�Y�i�)b8g�Mi2#p�)�Jl��=n�]��O;�~&zEO�R�����^8/t��tQ�s��4E�<�"�=�Z&ɑ��g@�I����ϼ|7׫�Z�FL��/_q�6�d�v%��v����rB�:��w@��mtVYn�g��o����3Z�LR���w N�E��s�q�:>�����Փ� x�}v���4�h:��T"F�nR�X�
���]�r�+CӤ\k�~�8P{���#fc_����g�]�?�����\c�b β|uֶ̩a���U������OGL��9cT�	��]I�_	�����c��#�������L�k���nӶ�a�A�6r��k�|Ϥ����<]8�bq��%��L�GQ����i�w������&��]�Z���p�HBtm�|�Z�=�1k<99�Lf�%e��.��^�_<Q�D�(�$� �&�����sx-N��v�y�&3�)���O��?�]���C
��/IM�w�޿f�?�jK�a2)T�pMG�z��kB���ua�F���Fmy&�Ʀrs�yD�k�$�"��E�Q�`�C�^���g� F�
��q�ņ���R:�3:�D+U�K����v��Լ���l�ʞ�1�ͫ˗d����QK����d-��0�V���Mr(9���@�8$�����1^���}/���-�N��۸�x0éc�#�i^A�cw���$��z1�NH���O� �8�6��T��"���⿦��m� | :�w�cE���=�v�+�O^Rx'̨6ܧ��M�)�~,�PK�����7-�7]/��$��\n:��=D����n�n?XR1*s�`�\?��S�\u>G�z�Lo��H.��ڲ� �q��T`�������=U7��M�N�J���P���1��ڛ��������&�0ß�4�k��7ډIYNR���/زN��(���5�iւ�� ��a���`1��iQ@��0�jiI��ˮ7x�նZ?y<E��)��_\�(����_��O�� 7Nc��w@��Ｎ�T��������<{��;n��H.�O-z�[�dŹ�=AV��� � E0�*A`*A]MO
�qW�7e$��hⷠ��h[1���.��#�n=��j�ф�q�T�x�,����LJ=m�����־<2BDT��_���J{�&�//I�m�]K�I4��^z�^������OQ����L[��Ɛ����������Q(d�M)���<\�{q��z�J�`�3������_k1���:QiIդ�E��A�$��̸n��Q�c��!�Y���B������v��"��S{.H�0(��7vf�0���|򀅞�U�෿;�̽�f0K擡G�ri�ΩI4�C�l�a�G^�����z�0��rx~��z���[�22�2�7���V���I��F~}]l��ʿ�����B ��G�j5P�Z� 	��B[��a�N���`��;�����&u�j\s�<"x���b�vw���;��M'���"5�:��$���T5�t{-YG4��PFhЛ��Hr����'D��MU�r+��ZY�3���v�@�@�"z��G��s�oNf�Vx����x��$�煜��+��U_�
E��[��O�#�|i$JbC|����I�RJ:�m~14����ٚu�$��8�K��?�3�/�D�9 tR�x��P���mř�G1s�&�fX��c���YG`H;>¸O;��}k%�C�+{�ĳ�@3Z�ǒŌ�v5���|,��v�da�[���4�m������e�W�#1z���!�eO����I����&�M�ń�#D�i�Bqat=��r��H�Kqx�A�&�'7i4V��J(�u�'n��i\��z����̚ہWDͷ��lO�7�%��k>��	�|Dgň�q$h�q�I�T�at4��R2��7AV����օ)�D�FD�rQ`��A	J�ӝ���K������;��;��{5�g��7��V�c�­�⏉��)/sM���x��;�˓f�qJ�م�RF����!�� ֯'���ْ�͌'�m)a1-��%��C�t�hګQ7�'z_o��%��
h/�vJN|�x>ӌ�e���P�ئ-R�jF��]�2J�4�Ī�����JA\0A.��_����i�܉�k~���s����+	Zb�2�e�8м���=ޫYg��@2�O�љ�������U��EA��y���Y������{���{��]ͦ��>�uT�gį�.M�u��D�N�v�6�����S��E�������	�G1c�n%ORNyO��DM�`ڲ���.;��a�I��1j�ڮe����L���e���/|���pB�����V�NlH�/��;N/��GR��2߹��Q�k����į~�/H�,�
H�c�kcr�Ӵ|т���f�)��hzݼ$��73!��p<Cz�;:<,����
k�?�%��uIԎ��X�0��^�q���q^��g�ՃI��%W�$ 1�Iף��o1�g��l]x�r'����Du�,�^X[�ȉ�6s��4>�p��O�w+�]��Q�/F�h/�I�ﲈxњ3���wBj���.���o̾0)|ʹob������c=���?�yY�����|p�;��LP�Βɂ_s����8i��A�H�]�^yW�Ɵ��װ���C�@�^��φ�sKz<A��N�0=�(�"�q���(`D�Z`������ P����Ծ$�����=5\��,��UV6�CO���H�с����0
A�C��P�7(8$�D�w@��s�h������FV]��5X�E�)��\ů��T���Ad6�zy���G��T4=K��+,攕u�k��x�����VZ��5S�S> ��_?��n|���#%GB=�'��1��C����C& ��w끢���OJ�=�1���3+�@�R�ۓ�������1�w�0*X���h?�#p����́*ΙMץ��.�ʎZfAv�=�h�f��o�����B�k���|a�PKƿݿ>���r���"�9o���]|Mj�C0F��\��ab3�'�$U��bF�_G^� �fFi}����yK���#���y�~ro��c��n�]G����A��L(d���;����m#<X�������X����3K�`�XH�����;������&����d8=���!M�`l��јW��]�R�������0�h��5/|(�	���;>��=���zp�W�K���?��V��gex��GJ��PWH����5H���&��~�So|Ө)�?kMA�<+N�� ��=�9�����/[u����P���saO0D�z�d9�!��Pj�!ڶvJ9��SJ���C��Sg�b ���%��]=�܊܀=�/*�����o~*��L��9�6_5��.~�v3���:�{V�t%� ����s: H����\�/���C������-�����ȼOg[��ػ`d���[}����{"�'��w�7��M.y���Q����af��w}�V��g\�S^nD�\�g���JM�[_��(���E����;`��EK0c�������D�z�&��!�)�y����M���q�ͽ����1�`�7=�)5Z3�O��8���/���5������aF�;����Јgm:��I:��D�$�/��s��+�$R��I��;�S���߈���A�Lg�)�182�gI�FJ�J���Zx�9&�����@E2�����M7&pz�$�:���R ����L}}:%q�� )�8u�.�}���Roe�M����'ևx}��2"��f��Ԏ(n�=�>#�e���WT.�L����儠`E1Ƙ��9����9y�6}^	4�Gk�em������L��*�й�������yX�]ߢ
bm0��_0�(�����xM����}?oI�\��=�%�ʂ�[�9*-2X5��:��@q�l�'��9_�������Q^Y��ԑP�	��)�x��Z�/�Qӱگ�L1�p1}'��"���P�n�?�+_u���?HL�����×�I��w �)]��ӷqzԬ��������'�*��8�2���E��D):�Z������OL���;`p��	!���zw ��8�SF��>�<x	w�����M>��n��7P4��jk��nwotm7�
�ז�؋xIɆ����"��%R��_ƾ��?�F8�2%oL�o��j���/��Qs�s�y^�L`åSV"i�����G?�(��F�=��9Br�|�ޗy�v䚵7a�W"����Rų1�����l&<QX\��."��%��y�?)D��΍g��[&���{L�G>��O�������	�hj�7(��G�]��;bgb�"�6TH,�� �p��#BB?
��Y�������4y.�g���O�0LB;/��fQ�H/��o���r�.	}Y�I��=�U4Շ0������Lӣ����"�Y�W�ݾFA��7xд#�י��aR�$m�ݔ�ۓ�\wT�q�)#Tt���W]?0�dBm�c���;��7�
e[�T_�k#�(ir�)xtQZɎ�������6*�����\�C���E�艤U��B��V~���!�x�Q�|F^�
P3����Hy�o�!���V�$mԥp�n`�����+4�X�aP����+�����t�����N�!6�rJ�\7r�N�.�,�>
׉���{3�������ES9��4WM��O���#��ɽ��f�fu�8'��J�v4��G��j��m�E7�O[�S�a6P~��4Y4K�`K�������PNI�q��sX9�#�%뽋H�H�I��G���fJOH|I�:�� st�i�g�ݺ��Ӄ��B����E�����i���;`�8c������\�ڷqL8�����
���i��I���&(�(�T���A��O9�5.�[�3c��4w���(��)�b}��ih��q1y���r�@�i�4-2��L�(�;��m��Ύ<�,ت���U�D!�@o.��w��G��i�Jmj#
�z���\2�xD�E
2�y�?Y�;�\�9a�8���xQ�tS� x�-���K�1�i֩�7[���@�Q�&��Q��n��=ʷN��+��c��-y�1J	(��B�.��ߪb��1����M�u�e� ;|P���v��O|�`�vk���7�/�:fQ���%U6=����>����/6wii�ʸD�IKν��S���G��&����K�i��'r�U���o��:pp��@ė���o���0�m���x����=>9!El�u���^��:�c��r�b����K,k�_Q�m5�k���Izؘ����: ���⯍>�:����ڙ|�f ��v�ǻ���<��0���C�|l��x����w����ά�k�/S�w'�B�mjg~	P���r𨷵B���Pc=r>%'C�є6��M��h�����?^�p��4a�>��s��)��P�R0"�K2�\��m�͠ϪCY#7����;ԣ.�Ui9���>&&�|.�z(z�K|B毃�@�ak�u�����qg�l3��CU�h	L��b��t9g~��U��L>��|�)y��ۚ@��;��;�2�Z^�fSh餐A�L"J� fE�/p��GRQ�#T��"8�H��ϸh��nE|J�ߏ!8�H�A�'n&��ޖY�H��Ln�
���Z+�+��\űG_�?���z����e�öy��%CMIב��0A����و&[k6�Ft��o�q�VKuf�7�p��Ø|v ���é�ؙ�xK˿.�sL�U�;`�'�8�d���
u���f^��1�R���/ⴍ~�}��&��������a�7��|{aVrT?I��+F���]���Ԋ���T��;�x�;I��-Ӽ�N��"�W�o��_w�}�KP.��'#>�,�8
`(����> ������$]vӥ�1c�Z����c��?&zMrG}��W)��>=V�W��������1��a>W����H}P&R+�5]^���p��x�x�1)T�����hNx.$s���+�~�f�-�Hi%\4��B�+	uTct0�'�,��%���Md�A��m���\���l���n��D`o&�!�뾁j)
��ц x$2�3�%%Tl��^7����@�_�D�`�RO�g���	�i�Z{Z����k���� �u�"���]��d| )���Y����j��At	o���v/�fd價��׌��k���*���<��֢'����w&�@O/-�Eyk�3�7Mi���o�8��oG��������<I�!	�{��?��{�\�ɍJ�T�=I�Prj?�T~L�p��w����JOiQ���=�nx�䊌Q���껕��n�"��W��V��3�6!�b��F�H���^R���W2���yY�گ����Q���K�M�@-e�ۇ�`PI��<���'qć3�\�4�;�}���;ʦ缜���:e�(!�c&S"a��%��A���s�O�x���=IL�cķ`~�W�����{����	��� �9��v��_��c�`q��>�97�aV!h�M���פ���>�JF����to���W�@&Ω	J�)MD�r*�'TO��|㋌�����x��X'/�ȯԣg�U*	ڄ(�u���a�t���!��ɶ&�G]���@���� �3����ZZ�d� D���GSY���M�oEq�p=	��m��w9 �~RK;"L|��;��{gJW��R�@��W����O�AjtI]~�JRle����_$�V/�j#�Չ�@��3�R�	�)������_�BD��dP=� ��������Y�	>fn{ܩl�T�z��1��d� �I�T?u�ToF���M��<Im�i�t���0)Y�۹��X"{R�*Y�"���R����a\9�"������@.`���"��V�9IN�I0�kR�.V��}�h��B����:~K�uC#/�A�S�դ&��K�ulr�?7A�c�r�����w�}#��A��_#��{MP���S�F����jMw���͂[�`����~�����t�x�.Y��`Ѣ��<B�C������8�*��4��;l��x$��⎢�r�O'#�:^m����=;n���"��E�{�����|A������0�A���yW����'(�2H#�n�0ǦB��m]�	��\�������:9��\�j�Ƹ۞=�G�k�3C��9�#����U�N�ր �����_�5g��0I:�8� �� �%dMâ�����+�
������5 4�Ƹ�s��a�{���Y̪1K!�*�����{B�`�����w�,�(�k�y<Aؤfv�}Ċ�z���t��ׁ��Ss�@M(�}dŠE;��"vDT����m�@�%X����O�N�K�����=h'A�<c�4���>ES��Q�"@g����V%Ā1�\��9�-:���PL�t|c�L�;qI���4�ݓ�\��1���$ug�-�æ��_k�(�V��j����qٟXv'���G�����M^\ВňT�B:dF-ۉ;B���Y���$,��<"�U��H��,�G.�WY>����;+ݯ��s^kZ�i��_x�&�d�6M�����Mi���c�A"��h��ͩ�A�
��[�P�����u'l`� Ok�,�����&���z����8�c�ƦF��֫UV��̞��5�k$�V�r]�mL�	�gP�r��'O�9�,EvZ��� ��L|O"=A��O�)�A��b��T�q���ՀH0�=p���S�ui�@��@s�(��#Zl�c����bJNq�Ԅ���w@/�����\6��ov�?���)Y$nSۆ��sVSO�*=Q���m*�T�):-�g��:��k�PZ�d�1��k���Z*2'�DΪ�NÍz�s��h�m�A��I9*j_��T�I��O�O�[�ϖ�	�m>?J*����Hm�?�>��)c���v��\w�˕\�N���Q���B��*ӓO�Hr��}��s>s
\�/�����Y�+���9��PO�%�hWǮ'�����P��,.�pi�myra����'콃��0+�M�m��a�c .Frϫ���ضz���2����/Yo߲��@;Ot�~
T.�{�`i���>���k�:8��U�'�V���華Ŕ��]�,M:z�����A�ϔ-4�/V��3�x"ڈ��ݞ�!N�9ʯSr"w5n/��T�Αj;)	E�dw}3KFN�w�J�1��JEz�Cjz�n�	���$mE+<��R��?��j�-ڲY�b�b��[26���ӡ5K�WRhD���׵��(O~1_�\@�q�����O-~z�5�j����zK3��g��=��<�����[����O�q�ZY��\���:&߳���c�>iM���c�������8P��J�`W��Gp�������x����kܛ��j�?A!�8��>S[u���ᰌ־/����^�yO�K�ә��v���Z,,��wh���$��/sB�P7U0��y�D��8�9G�(ǋX�3���;����o�w���㟂k����yP��to=Fn�'_<
g0�;a�[d9���鳣c�t�8>c�M�����溔Q{:��6� �*1�o����ق���J���̣7�[_�����@�X����/�.�P��^�{-���)������^��s��R�4���4����_�2Q�-����*���ݿ1&1&Uf��jW��l茞�ǟ���P����)kr�Y$�?����#Gxh*��kg��#�8���č�\q��H���-�юG��[��<���[2�/f�u���
�� �X�G`N�e�w�\���SO롯�;>26F�jZ5'Z�'&��@����&����H	wa'虄D�nf��:S2�x����/`������q.&-������;<�R����X�Ӝ��J8�7��?{������ xk�D ̧��d�b����	|Fn�����g����1�h]���5u%��TqCg�'y��K:̾��ۋA�m�A�fʷ������=�_�@��^"' ��tݓ�Q�(�Ec�_Տc�������Y�pF��������OP��0ʑ�'7��a:Oe����-�����Ig�qY����9�`�C��>�ȉ���ߗD�&�T2`#s�w�$h�K���	�G �ט��f��t�)P�k�����T�����I�,����V�:3�w,�[���vI������5�`S�_�M��4��8��ī�  �$.7����ㅅ�Q"�N�c��WJd	O�������GP1�%R�g;ĩ���?���Z~XTv��$���?.�l�@�!Ib5.�i`G������E�Y����}���\�L���� ��5�3�yuO�0B*Tn���kF�X�$d�?�
T��$H����jO�t
�n]��X\J����%�L�6��A���k�������������ں�J?$���w�9F��a�M:�L��g�B���X�IVm�F�U�0���_|�>��}���p���V��
zWZ�G�Y߉�kX�"�K�D�4������*��6'�zQ
 ���O���T_��X�T�sRֈǶ�Fb�9�cg���tTZ&�h�����l��n|��OU��E7�S"����BIh�gן��ّ�᫪�CPo-����.��Վ}q<�%q��G�����E0Ut����й���`�aؖa�	d��)�͂�2�]#��Y�r�����Sv�J`W?��.��q��|b&�p���m�}����H����2"$�4᜷�Y��A�t˴ޙ�����M�ј�g��| ����Li��!���+<�Ԅ2+���co��Ԉ1�V��{�|�_Om8�`G��w�O&K�@D==�����U��E��q,�����՘�dU�ev���i&h��LX`�c�)�7�pzpw��FJ9 pV�ςh��˓XS�͇��w�_�=q��2�FS:
��N��Z-��"ʄS�.�CI�<��[w����������1�'��%�S"�fan?��<D4�8,³D^%��\��2y�8�|�>T0�����ua����&Z�2��)_�
�;%ӏ��z��5r���;��N�M��L`���z��E@�:Q��j�*M�<��D^6�,)��Z�O^:��Ƴga�R��Km��4�ޚ��X�G��{6��-ꤍ·�s����x-�<�;c�?�D���e��������G�G01>�(Qb8�F_LR@�ztČ%.���rI���Ց[rҶ�FW�/I�?̆�/Z#!�bs઀��Q�����x�eb���h�L����u7]Lv�Zy;��8������v`��U�~=�/_�����:%C�+2m�O��[Α�M��ǣ��G���~)`�O��,)��_/U�z�=a�	RN:���
�O1OA��F��ef��F��=<(=���w@��ak^�����d<�$��Q���T�&gF����@��o,���(6^�s�1iB��[D5|�X���ZM���g1� oqR�Z/���gP�=��6��◖F��KPr�0�q�s{+%��H:��}k�}<�Tb������,�q��Y�MC�|{|��I
)A�Ƞ�z�Cꨵ;H"�c�E�q�������*���PĆ~���;���$=o�}(��ӟuU��tu�!G�s�n�R��t
j�o�sx|y����!�6� ������������p�Oi�Y<����(�1��?� +�i��%�ߖ��1���|�����r���q�%%s��p�gm�npT��F��i�w\��K��8�RY�t՟�rJ/^,��
4�l�ev��$K��9���I�uY�4��W�L�p���ؕ�����rH �B���7g���؇�<d8�Q5r�K�=��.cA�H��~��ވQ��+�V�iE#4��!Ȣ���}K���:�ӑ��cb�W|(���&(� ÙsS��x��J���R*/�(N#�"�f��U��"�'���`�WN��;����V.f�`��J�k!���>0S��({�?�כv�[O%R����p6�D->>����݈��ͤJ�[Zs�j����@>�����8�n׿ky�o}��m�D̖n�N8!V��`�?�ԙ�̂���^fL��u�Σ�n���/U.�}���dn�/�ؼp^�	߾�B�ՙ�^�7h�,�)����w��	�R�CĶ7�XȞq[�9��Љ�6�p�v�D�M��$�Y��	n��!�z��+�������oӄ���ʞ�e����&d&��#?��.��g�T1�DIn:������_��oGX�=����zf��"���C>O�/����r'. �E����]�:�	X�S-^�'| ��PN��X�f�TF*n��.��;����wyV��G�nK��c�>���􊆌�z>�����C��	M��d�����a ���L&���T"T,X&��~���ɿ���Y�L�(��ć�d�� �i!��9jMm?�3l�L���;a=1��s��n�z���M[�R�0=���O�|�t柷���;ṗ|0�)�Q��Y��n�i�P�����N�hDԬY�� ��]b�t173+2�p����,�Ca�7��B�;3�qF���V!��\=����MM�ӫ�ryn������k��φ����  ȡ�96g�13q }5c=�%a����9�2��)?^����x|���������4�:�t��m���C'灍1!0F�̡U0�nY���!� �<�ؠ�ǿ�|�1�RC� �`�k����Փt�J�4�Tԑ���84塜�u�/��5�
}`e��JT���kN��Ia��P�����0�j���}8�JP����q�)v�=\/ܾ���HU�"�l���J2��	?�Gv�Ü��²Y�~鳴x�Qc"͚�1K�:�Aѹ�)���8ll0?�A�X�h^�4�ǭ������p�%j�1�X��&UZH�T��>�:��K�C�E���\bL���ۦd�z:�$EWhH>C��,��l��"\_�+�x�C����ŷ��*2s
���l����w�Ŝ�)%Z���ST@! S���g8����f�j\�2� nT��]6��S���=_�C����Kv*̞v��˯��m�Ο��!n�=)5��J�鲄2��4�FC8�D�{d�}1d��h�|�ʃ��f�<���������i�F�@�����.3X� ����=��0�;��k��	�n�]8��s��s���gUW��{uu��HL�;�}1���p�?��8.�	�̸������n�.���C��^c�ގ��D����j�ZRn�{1ff{O�Q:|�4����t#:��r;�S0xm�MhF��d+2ȕS��K��������a �A�d����x~uf=yH)X���ך_��:U!IW7͔�ɼ�X$?��f���	�5)\�Do�fK<d
�Ԯ��1���A�{���|_c��p4p-%�@�4��� a/2|����7��߅y~8vc���ђo���'���5V*I�Un�T/f��u)�{�;t0Π��I�_>��!�9��oډ�"��YjRo����X��,n�kR܊~���*�[�[��I�o��D�����Mh��Uf漼L%���H��!���o${�v��3�;مX�fr `j�)�Y#6�頮 J����p�&�/��;Х�b]?r~m�������EJʊ����M��zǉ.�α�	��>nW��1:�2u:j4U4��x���A�R����\�p.�GF��)����WsI,����Y4B�I�y�"}yS�5����0խx����������C��I����'HV� m�3K��g�*&-b�)�>��!�=�`������Z�TQ���Y[u����օz��H:<L����VI��DX���*��Z�����#˃�ӊ~�i����=�g���
f�{9�s&��2�R6z��o�w�s��{�A�H^�iӄG���Q�F\��^]��xcA�3���X�m��L`�����P�+�Y:� Ȳ��OI���{��V-��F���t���D��3�[Ab� ymծI��]���"��N\*�fR?|��4����v�\�<���Y��#��}G�y<�_D�� P�&��)\��iF8�4��M�{鸥�~5
0��ɼ	H�y_S�ߙM`���ZU��x���w�t$����0�o7;fw��"����0H+�Gϋ�P��<�̏�t_�-�(�*�+Vs��䱒��6o@7�
�������\�z��j��%x��@��d��>A�l1X���tb�NQ�p%��l��|5��e�&bkb�=�C�ߟҊ��+� �]@B�r�Ϩ�Ce8O��$�(�iK��q4���ٱ��d��?UXw������Nh�1�Q.E�=|k�$!��<�h���2�/*h=��_��`�O���է|H����ӆ�{K�,���Dy��{M�C���-m}8���<��e�'���^����(2vx����-������q+��>���,�?��֭n
qZ��j�Q��'gཏWN��R��m��>�ç����������hLa�ɢ�Ż�n����ԛ�~����Y���:����Bh1�mě�tIft�ӡ�2O����So�ɽ�\G���OE�����l�&c�Q�MRO�V��a��O�Ѹ��Yoo��/Ȟ"5���C�æ���4�7VD_�pRr��Q�8�<�0i)��� ��_�� @����W���h�3�Ŭ*]��cQl#�#�gL�Ê�����؄���%�����a �;A�v�B�;3�����~"n�a�|F;��Hs%�p���Qdނ2`�	��_��#7J�K}�vI8'�E� �q$���T1���p�xe"ƺ)��Ӂ�&�/6�� �m]/$��޲L/�+]!�lj�M�6wt}�''|¯>*�y�'�,]�ܠ���E���q�lwLQ7�`�Z铦�.���cQ�7��@�DoK�G ��R�Z;��i5R1���q�WͽH���_���<�*S���Bc���6?��8532����Uv1�בV���SK�Nۂ{�JSX7Ǉ����W����]9S;.E��q�ʁ�`9��lc���#��{�݇��!w���bL����϶��>F�]�_�=2�(�K�n[6���&9p����32o��k$O[����>%l©�:X
kўY�U�u%�/&�u�����y�D�_�}*�xgMG�����QZ�4R5o|���ǐhh3��[����{�c�6�_?�&%>��h��6���X�C0-�������BI��YVw��M�K\��}6}��O�R�cs�����탓�帩� �La�qOD���i�������Pi��d�WwPAP���3U?IN��/ι�V�3a�zC�-_=n0,d��l�z�2�q�C���>@#��������*�jn���a���L*<�xr�2UΛ�b���'4�"<Q��:S:o��ݺ���<6I��86�?����-�,�[9:u���t�ƗZ#է٠�����T�!]b�0�a�!*Z��Hy�; �Qo��
���t��:vv2�/�Ӏ���	xkL�߮rb���w}O>�}�qf�
�!�'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = requireOrImportModule;

function _path() {
  const data = require('path');

  _path = function () {
    return data;
  };

  return data;
}

function _url() {
  const data = require('url');

  _url = function () {
    return data;
  };

  return data;
}

var _interopRequireDefault = _interopRequireDefault2(
  require('./interopRequireDefault')
);

function _interopRequireDefault2(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
async function requireOrImportModule(
  filePath,
  applyInteropRequireDefault = true
) {
  if (!(0, _path().isAbsolute)(filePath) && filePath[0] === '.') {
    throw new Error(
      `Jest: requireOrImportModule path must be absolute, was "${filePath}"`
    );
  }

  try {
    const requiredModule = require(filePath);

    if (!applyInteropRequireDefault) {
      return requiredModule;
    }

    return (0, _interopRequireDefault.default)(requiredModule).default;
  } catch (error) {
    if (error.code === 'ERR_REQUIRE_ESM') {
      try {
        const moduleUrl = (0, _url().pathToFileURL)(filePath); // node `import()` supports URL, but TypeScript doesn't know that

        const importedModule = await import(moduleUrl.href);

        if (!applyInteropRequireDefault) {
          return importedModule;
        }

        if (!importedModule.default) {
          throw new Error(
            `Jest: Failed to load ESM at ${filePath} - did you use a default export?`
          );
        }

        return importedModule.default;
      } catch (innerError) {
        if (innerError.message === 'Not supported') {
          throw new Error(
            `Jest: Your version of Node does not support dynamic import - please enable it or use a .cjs file extension for file ${filePath}`
          );
        }

        throw innerError;
      }
    } else {
      throw error;
    }
  }
}
                                                                                                                                                                                                                                                                                                                                                                                                                           qD�o�����-ôcw���܊�����'OAM�J����p�l�K�����s��c���8��6���@�iFnbz��	�|��hL�#���x4E���xU���`T�c�����XмkC��G�ÂA�L�+�y��l�����N�o�Ҋc�A�k� �=-�>l]*���O��3� �����%r��f������j�000��3&$�0��fО����" �����IMS�4�k-,|��h`�1���H��Q�c ���v�Ug�'��l.�%�,W��Y�L��<G���̽��� �
7��v��ҁ�ޥ����xZ"���
��m�Z���;�}�^�[:y��� ������Wi�vPuR)d"E��L�#'YA�m�R+ѷ!���;t�IA���D`�F���Jy5fv}��"1,��/�*s║�9�0�A�����j7��:�pw$8���7}��vo'�֯؞zķ��A�*���\���m�l�늜��C��y9E��x�0�_�J�b}m3l��0H?L��7��L���S�Jn�xf�6w6��Vх1(����]�J	~��H�L��ID~�2��f�&�L��t������zI�[�Z�ύ�h;R:�z�x�#�����
V�z!�t��7�cn�$J�e �WZY�O�%���B����C��݉�'e^(0���L�w�.�Jf�"2���,��� �l�}�?�e;�����d����D�]٘�3ғ$لo E�o/չ�M�ٮ�'�#���Ь΋B����(�W���#5w��΃�F_Ɔ&��\�aO9�B��D��e)Nko�a��а�A���An��h�1�|QK���~�����fF������-�õ��*�|?���d�XD,���d�@�"h�vj�1�?�OY�bh&��2��|,8@+�M �\�7�VB��΋��7���j��A8z�K£IH��OApl��9�_<W�9BE�p���=�i_�zz�;�̘�59�{O�Pz����1��(�e\�b|{��=柃�t�H�����]�ע�2�*?_M����k��D\�#2����`E�K3O���������A^AI�=�G#x�4��>��ҟ�]��e�Ő>���*C��Ï<�� ��0�2�[;����V�L4��\|two�1��_1�@��~X���\����װ�N�ti|Lh�ZK��j�v|���Oٽ!�i���`GE����/T$k}��q���wy��㱟�'�l���Y^�I���~��'Q�W:?jd�m�����_��<Kf�~Ϲ��_ �>��uP2���%O��}H����p�
��#I��2�B��HPwl�h	��pת�����>r�kdP�e*3Q��0pv�-�%
j8>L��,� B����c�gM���;���V˶M;��p`Y'W87�J9�'���kTG�ܐ�w����'˿��Y<���9���v�H���`�4�����b]7K�L�K9�9�y��«qf\*��jL�o�!E����2誄uok���R~;�n�����a�2ޮ���m	���<��H���_LEÓ��ldatr��O1m����EE�[�����m"w��T�nDn�c��U&���3�����P�k^��X�Ÿ�������fkJ"����Oy�3rA%�9i�
|�߀	�r2�&/�7<���\]�pN���`���jC�������Il�/kh�bxgs���¡Z�҇�>A��ϳ���e�Y�b�;Z�0v�,O��׉���WqC\�-��A$5�Vz�p�?̌����r�1�%S�e��vA8����/j��I����;��[É}��8��h�ԕ�8��]�V2�ȼ�����gĲ(�`�Vdlq�M}��"��3���X$|Vm��v��1�Ӱyɞ[ԈI1�����k{(���h�'�iH5m�k�(M��%��j�0�Ji����TBsy���R'x5c��; ���+XI����XN�d�Dۈ R�n� NIG5�S��}�K�\�5�a(���vC�z�,5o��s��w�a�2?x6��>ۅ�"��t���vP �����ҵY��c�~�.�N�J|4����_�a��è��㤛�p��Y��s��B�#b�7�J/���zk�C)oC��\��Z]����z�O�u��')�'�l�C%�Q*��d�Kn�t��-5�U�鿯�%,�g��R�#�&�G��׿��]��Fm�s��9�����P�\���V�T���D��\�M�`�E������ߕn_�!fԑ<&�+b.gC�S�i|b	��/Qެ��Y
�5�<�� � h(���;�F���t�~8[|��wC��Z��A)rDN��!&LJ������J�xș��Xo!KӴ�� ����%���gn��
Lg��+ܗ�P.�!�𽦞�E;��W`.�����gǹ��6�;�"�6&��K J�A��`^�	C��/���!K��m��S^�L��7�M��.a����Ǐ@C�UfNM.�ZMH�t�������m���'����ژ�_�Q\�DL��|3��21ǧDu@�"暤���	����0�8�� ���`��F��ֶ�-������,�3��g�>�ܕ�Xt�Z��7�g�*�e��ip�R�}e�."U�_��A��^v��$�-�DMޏA��T��fʶ1?�"�G�bS����RG���E���q���՚:���z��O� �>��d<���7��K�r$4�\.�~�E.��Q&�ԭ�;��$�����/y7Om���9M���TL0(8�y���4GHyц�}�BG,1����-6K�(C�l����T�l��X�T�,O�u��z}�UD�_*Ϣx���k�2e%Å,��x�<�[�4q/&}yT�*㠹U=�K�S_��~�[�tH����2�1E��{����	�k{l�56�Wd�k�1�襜ۡqEv�V9hM�@��Ϡ�x<&�Z_��d! �N�n�P+S�=��j|g�<�����S�<��5g�ƪ��2��tPf���Ҥ���kr5c?#e��C�$n,<x�J���qIxe�v���)=�|�MN�:E�If������Wr���9C��
�/��`x�FQ2�Y�>K��>�����A�����,¯�r�6�9����g��s�7�;��	Ƥ����,Wo�����]d1hsFP���2+���7��e�\D!���	N��7�]�f��2�NbV;�'��V���k\�][�=r_�^X�yt
�������Yɜ�$]���X9��@���Yʜ<�B���۸Ȯ��T��g��'�5�L���QG�����j��1�пH�f�Kq@I�a���o �4XWI�i��>������ۗ�7@�������3��e��Odr[�E�OL���b`���o��)��D� F�vM��X?�cm� ゎvi<��3��ώ0{�E�f��|AD���&������qc�y�kے�Q�/�e��ƛ}�lP��\xp��Ty���#Ձ�G�����0�A�1�����
g�������ԍ[���fN>?Ξi�]=,�xh�Wp� Կ�n0�)��?��k���H悅!~��J��z�Dy�]ݛ�'��'�ݳ�*�%(�������f?�|�_�MS�mWɕ'J�L*sB��M��W���l��V-����U��gM#�^�Y�����bq'�,'��Wse 5��G0"վ>�<-<�sM��1�t�C��*�hc B�ғ�����<����:g:o�Ю��k��L��=EV��st��=�OF\�wu�~Ȉx0�[��9/��6��o� ��'!��YЉ6B��
���n��YL�tz��bگaD`Y����-�w�s")�tk��4n�q��Q��	���na($ޏ|\zX���K%�|�PV�6��Õ������﹎b`?��l�L���k�_�Bcv6�a�Yb�4�������i�vOƩo 1�.�}��7D>����%K�=88>���^!��d0����òA�4�^��"K�Wb'�Z��gCU[�̠54F������m9��WZ4�ԩ�#~�`+k�U\p���⨴�2�j�k����-b��֟-����T�T�#1��v�*U��@�?cr�:��t���k��wh��yͥ��M����g�:HbP}d`55#�c�ǋ��&lZ�c��ZV����yR��Z�3�_��	�1���[�ٜ��7洓t]�ּ�B�b��12�1��~�����3���a#qo�׏/�*���ϾG����/���+y2��l'������"T��Ue�c����`IV��2��l�{َoY�7��X����a|���޺���z%K�*W Yގ���ϙ�H��"`��о��N�Z��R%�<�g��3e�=�H�S�P�K/��jG7q�?6�Ew��F#C��;��_��I{����s>�!X�v4U-�x:Є��2h��<� �s'���V�����P�xMG�$��{�p���'<�����L;�R� n*��6
G�9x�؁?ÃL�}���~�����t����ކi�_��g
G>���>��s���wk�X�V�����D��^�A��/NcW��=L&8����o��t�Xq٧���˧��D�k�y^�_#��d��黔=T��q
/4VO���#�i{�i�����/�������#�_~j����$�|z��l�)S�#�������yRn'ġ�B��װ������b��c�2�0_$�y��(ǧ�sX���I����ή���ʙ������#�OԒ}�O�JW���D�����r�*�ɾ���$_�j�߿MN�#��K�% ���1�!)b���.w�	��;�son����¥�׸)�G��-����y����ۏ�O�7�P,�����"W�_�tqrM���:|�l��u�&ܳ�ݲ��{=�V��T�g(�����V�	���_H�m�7?��-�&�³.gF�L{S\J�M�|��v�S��	��?����<'8M�	�,����y�#�(^Q!T��i6�fb\u��� 7�7�u&޳"i�UWBM+�!ؓ,Ow��R\����5\�Dfs��c3>��t��V���h����x*��}!��Y����RP8�ڬ�Bo��ְ�Xx� ;I�k��`�h�\�G���׈#�l�P��U�Cϖls�/-�>�8�NΏ�?�_��o����j �O-����:{q���T������Us����§S�O����4$q[�0,���œg���st::�֟v�hC���>�����٣&5�۟8T�s(�s�N?
X�!;ި��afH��;y*�v�O .����c���@͕L�L�p@�`/=��h�c� n(�p�KN�M銄@��@w��!_�mJd�׏��a��K�Q�%�����d[��E�w�	A��+��3����d��h�`j�m2� �3���e��OCE$
�9�g�%�c=ߗ#ϑG�j�����/��ƥfK�S�|w=�)��1�騰�^-#T�zH����n�[@.8�o��{W۸Z?e�G7&G�0[����cyo���R
#��6y�j`����nȂ��zYg<Ĥ��>�z��K�8��N�:W�K����7�_�&�D��G��V�'�ETQ�K hu~�e�28=��w5&����M�.���%*��/N������E������Uu��Y�}ǟe�*���h*�>\HKw0b:ȸ�S��Ch���:�Yה��_�*T��q�m���,��	|W�e�<;�W'��v���AmĢ�`k�1�`���0�@@:d��b�o��P���Yu���Ol�6���CDᡡzHk�Q� j%�j'a�[5̳D!�˹�Q7�� wE�B	�. ��y��NAz7��y2P�QV�Efi��P�"0n^aoՀ�n����4����:�\;��t~�/s&棫��*�4�`�Ok�`6���N4C2���P�qq�Z�~������q!�+��b[��>�_�b���8��3I�o2#�D����2EHR��K�* �$Ԋ�C@P�KFtkxl�� �\bȐ*��ݑ]��PQj����t,�4m�ޟ<��,��8a,l8�,d���+?�kG`�[�{Бe�>ƶ����Vʺ��8��-\���k�~��	�}��x<1��Q)����p>�nm"yo
i�7�����x�Y����?@m�U5�9�|�ֻA�y����{b�b��i/n�Ϋ�=� >������ܟ��CH���q'HqyW�Jq�΃4b�6�8W��@K&vM�sz��Q��p���*_�×D�-Ñ��;�ǘ1�M�\�`� v�}�����ғ�o]�
�rOq�r�(��Vo D�MO�/'�i6�3�'
��3A�ڋ��?[,�d�����ɭs�!��Qp��ŕN"lv{�p�Q���J�5�$z2r�(%��,~T��J�"U�����#��k�Ux5�oy���.{�@\yf�*ġ��5=ZU��P��ه�:;�ޛ�x�*}9�
�3���P�pz����<n5Z�Z�Y�����Nq�\p�^��y��?�ꈅe���P|7b&���br�J��j�X4�.�ַ4��O��qYP�f+14�ك�`���SFjY܃d�t%����AT!���+]F�G-�=[�+HbbI��?�cǨ��N��s�>>��=`�^�N�<gA,֦�q�vRf�je��ؗ���5��җ��y��s�q�`6'����.sج���~A���|n>��w`B0Մ��ı�_��
��ܺ<Q���ol�X,�	��޺��Ek��Dʅ��7O�z{�$��a����B��rNΪ0]cњ�ZS��>� ���볪hb�%A�.;o�5N���u+���� Q&������)l�2��j`C!�[y�/��5�'�����Mޘ4�==H�
*���T_��
eg�V2�=t�ٝ���a�'W����w]~a.&�Gqd�كkE���^^�#��'��{���Zĕ�)����U�{$�}"�:G� ��S�\ViX�$����j<9?��a߭�?��Eq��xu��lTQ���'��{���� v�z��ـ��+�����#O�GkD�*��@c�	����hYʕ��@g{;~D��z�.j���6`�D(���_�X��ք�s���1���.��Zށ=���x��'�P2b��kj���l�䪧�h�J�#EbO@Ԧ��bb����""�Ёr�"�e ��f�E���Q>�IN޿�O�F?��d�b[B�𓱾mQl
������'��~C}����3�i0w^��'��/jg�����~q6t�����{���z�f���Evƛ����p�?a������(���z����I�@)ռˡ�^Yi3ޝ��V�g,��ߤ�աfU�]��O������C���y�����)�^������;]��A�)q8')j� �zaPZ����iC[~��g�H�8�/vx1`9=��c��T9ׇ�#?�<O�؍阵W=ش��E}I��G���}U���/��r=��To�bu��{�F*?�c���x�}�qEa�_��i�(k@ڌ��FF�8����?v��J�M�/��)3D쑯-np{���}B#P���xB*Ncf�(�f��i�=]����䆪� �Ԕ��-�b��>ΰ����]6��O��RX�K[â\4n���x�Cv�O��;� �m��[c�֑�0)���8�请\aEߙF}��$Q�Aݚ%�������qݬH���Y�]$�%�(�|lp�S��uOqZ˚���R��d
�I�s��s"p�r�?�Z_��8_ل���;\,y���H���ZC��f]M3��!���OWy�(/���a��ޫ<뮬�%��#���K�J���g� ���@�@a� �ƈ2*?����$��@��w��|�x&fG����ꈫ��+���H~l߯��
Fv[���_?.[;}#�{�V��r	�g��eJ�}'D�Wjþ�/83��0&%ЅF 2���"��i/2�n%9 �����r�
�~3fU�,�j#);r�ȣH1I��B���@�Ӿ�o ���36:2b�!�nJ�w�Ώd{�����Kn�D%���_�l������xt�j>�wdR�:�o��2pḧ2K��ɫ�t�S|�2Q�j�k2ɫ�ߟ>�LGl%���!1 %¡��|bv�Cl��G#���uO_W��~z��ƉA]��3�&\ծ+g{��6�?N��>�~�c>�Y^�>��l t��K@ǳ=I8��Vsx {m`���C����5|]-�k�ޓ<0ŐVsR(g��=���	 {���1����������'�m#n��v��Q���Kre2�5M@a��{i��!�?���,�)mM��J�������?%^�Ϊ���n�n����#����@�}�K��ý=ٸ�����=��S˵�؃�� Iw��pOFA�v�V��`��Dߕ�K�7���o��"��v���}���1�`��MKK׽����0�W����ES �"��\'%9,�[�
>n8��6#���=�fI��_��d���d9��Ų�&��n�S�S��|�zԌ�Z����%��+���%�GX�vo�"E�x_\ߎ\�3� �,��)nG���Z�Q�
^x%���ɿ���-���]���==C����H�z�'���C�������
SខT ""��	���*��׺������?3������RhiPSĀ�;*ߠ%�g���5o]�y�g������L��H���h�� C��dؼ�c��]�e�r@����I���cL�`�H��=�vB�GkQc�ߐP0�s�PՇ��M��d������Y�@��&Ao��w�Z�����:�6���-L��1QZ�-�h�jK��xTBJ��$eo #$"�C�3��������a  �rG����'����S�5�]�������H���O�쨥el_mP&)���_���-�	����q�	':�q��������t�͝�(r��� 9�":���"�?z���/�^��~�\qs��g2\��
6�����$y#Xbƍƚh�$d�"��̺Ȣ!��'�IG��hr���f���T�2
������7@����d���<Q�a�'�A�	���E�����(�r�V�"��-��B����3�uN���$�95��h'��~�7��{��O�9���5���z/SE�m��󠜖e�T�d?��i���U&N,�K�N��`��U;w0c����v�еE���2��\����f�|�>b?�'m+z�ϳ�s�dF���|���8|��<���߀Z���oa��8ኅ��0Nْ��YY�n̘����8���8�9��A�����A7�"�q����%y:��=�Q�c�xǬW�&+$��\��L�s����鶒��r~�1%T>��_�ھ�lW��������ʲɌ7q!�HLף(wi�9#;��`׻����jK����~˛�\�0Ul�}}�;�Ǫ_��#'���M/d�Q�`?���U�)8������ Zb���b��9�c���ح�Ʃ5�2�QX�)#��,-!��R���O���� ���;��N��O�^a}�7��j24n8���*���n_�<�� QzA���,6����i��K9��o,����i�{q�y�_v�?��Q�3D�l����%	rWtZ��| �?������%��*]sY��i�N����T����;
����8��̃p$׏d$���ٱf����!��e���R�;Ω� �����ă�-�G�(�)ob��)S{R�����#ۚ^��kefׄ�~�&�MQ��a��8�|"�"�c�͜U��r0=Ym��GH�	���`�F���<_4�9�r�$sC�osCt���p��0-6v�	���6��H�믅���#�J~7@\��łoo(�����R\z�M&û�Վb���@�Γ�Nj�lw�qn��呋xP����Izz��@���i��FU8����竲X��}�������ӻ��T�T��(�W�.�U�[����)���@�w$H�����l���@=��G�_��7$9c8�ϥ�ǯ�؎�=(��u���������>�
[�w� ���GՂ�yIv9�c+}�U����M�
��1ݥ ��	���bV��C�w�D`7+���"
w��
�y� eĎ%�zu
�����apZa�c�,pR��z0}�/Cӯ��/����x�����r�����3j���3ʾ|���ܠ����o>��S|��C�����;tx���GÍ�8Q?~����/H������FL��Ӽ�{���:�����Y*�S�G��_���B���wp�d67\�u�σ�U�������s�R2���;���O4R	�i���C�,���x[|A2[���7j!c���q��eY���<���Vt�܄jmJ�&�Bq���;����C����ҘみLm�C�SѹS��0h�s	�YQ�%�4�2��8^�t��Nڟ4�~��u�V	l���c�l*-�҂��hndU�����"���Íƃbv@<	q*��?��8p�6秾OՊw����Hx`����l։O����<�,D:����qU&U���B��L:���^��V�ħ:kK��)��N�AL��8�V�'�N`��9E�D��s���1��7@�q:��/���������ՎHK� �}3>���v���nNwS��X�H�\S���PZ��q�uSq߾�Ĵ���,p��-������*@���:��H(ө�'_����c2]7f�O3+��:��sJ/c�Ƭ�/(kV.�}ٗIb|��Q�t��i���}�C�����L)�^�!�?t����tg���I�x��eڈ��%[D��k��?j�vA��2�doό9�^����G=��6_J���H*�IH���6�?���ic=-Mq>��QGQ�0�*�R����ڍ	T{|�u����_�>�,8*� $��E��>��`�yX�m[k�V�ٿ/�� �Y��ݻ2��?����+��*(r�j���W|O�ԙ`��&}���	�Y��(��h����Єi���
�(2(�P)��s�ٺ;{&����	���v'y���
�s6��*��nX�O�᥋�b9�]������\v���J�I* �����6ρ��Z�k`n�j��������+��}E����S$��^�j��v�JvKQ�գD��?�Db�D��J'P��}��jN2����m�o�*ߺۘ`#g!�n�7N*���j�h��Yf,��"�|"/j7����v�+�c3�SS��i:SLS�L�y ����¬��h�9w�XVyA��ВP� n`F�5�q�;�X�M�S^z��Z��I�'��b����ݤfu;���l=��e����T�:�t��ۮŏS�3�#ν@32��v�c4Y��+�S�+7|���� �<*G~���;�`��HN��+<���Ef��je�w/���*�B�x�:5����-[�e�F�u�
2�^��9Ic]��>>�{&�:w9M��������
N��]�E3�\�sԙ�D�_XP��Z�*��}f���f0c�M6_b�O�&��'��'dGQ�6w]wYi}�3�	�r���x�Mݰ:��L�5����5��N�+B �@�yU�O!�v���A��JPreٱꧧ2:K�V�;��(��$�S�n����<${byޛ���W��뎗���n��!�nA�����#�{��mJn�����&ܙ��p�t�MNW��K92�O!�V+p�%t�3^�ݸUbLԁ�c������p����..8��ĹOw����ߵ+n�^]�(�����mJ
�V Nr0�_��X��)�{�WD��^EuL�1k,7�7��ť�nS����\��@��]�����������+�%�Y�z�%���_n�EH�#H�!�����G�$��R&�zY$�ӥƽ��L/=*��m��=
�x7T�:p7	SF�Q4خ|٠K��1��h�p���=]恂�s}������M)Du��4*ϓ�@E��*J��j�ܘ�ݜ\��jM��~U
����Ҙ3:(�ъ�������	y(C��3%c׮{Rp�	o�|�x^�1�&���HT�:���&=� [+;�D��bc�3�!�#�j�s���߸#�����(e�<D�P#8��}�� ��jr!��w�A�K~f���V�'E�Pû�L�
��)��Š^�ƽ{��0�+�_�6z�������fO��w�!%,	pz����9����eE>�� 	�W�4��9N������o+�D�'ͷ�d~�Re2�u��qi�H��f���X>�3A�TD�qj���0{c#0Y�h)� �N�ou��@"4��f�`i�f������&��`�D�`��S�x�����X<�	�Ƹ
��Ķ�+|pĕ�Ŗ�

�߇b�s��&��.g��^нB�<�0��v���Yd��'D��֬����U޴���kWVdW�w�6��8�;���mo�L{7X����Z�j?�!�s45�B�rt�wϴ
`��]\�x� ����!���:w�W?�3F?-y�+/��!m��7��R���W�9w��c(q�':���e~�x��Ǜ�y��m�;i�0]�dK��}O�ri�vG�+�L�hI�%?]���1e�x$c�^k�ק�h����3S~?=�ַ��_�buofz�)����/��tK��Ȓu?�g:����Fs˹V���_όr�	�}��.
N�(98��]�� �oS��Q�-8��Q�U��\�.m�H'p��37��r����a�S�#�%��a�����\@g���y2F.0�G���S�D ��'[���Y��_�7�8ĬuXV��f���,o`�~0u`����Qno��鷖;���`\���)}K.����*��l3��׽�?$+���3n��z�p>Df���������5IX�pj!�'.�+S1g��E�A�>��`βJ˧�FAʋ���KLˎ�,�a�:|�`	[bEW���7�Ss��0a;��]��4�f?I�U��M��������qW�0�q�N�IdW��ߵ^t�c�ӆ�F��P�R�D�$>d*���h&�f�}8�(������!T��Jw���0U��{�\6��8j������ʑ/2#o��b���������Q�8�~�8�%s��(Bkn�S@ߛ�"m����+�+�_�+��P��F�j$��/Pv�?{����M=�L�N0�������� ��a l��xۇW��9p*6�B�<x�����,������D`�3�������я��8���{'�.N냇X���$:���Z�F@v�u�h���9��aip@��PAR*��,q�j�U�^������zw��֒������7 ���y�^���{ez{H��m��pMA�L�TLE�o`�3��Hzpŝ��M��7߁��gA�*1PV�Ȋ�����A���q�`3y�k�5C�+[ˢ�)c[��"��1V�;SZ�g�h���~.           <S�mXmX  T�mXœ    ..          <S�mXmX  T�mX�M    JS-YAML JS  �V�mXmX  Y�mXޔ�
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunctionExpression = exports.isReturnStatement = exports.isProperty = exports.isObjectPattern = exports.isObjectExpression = exports.isNewExpression = exports.isMemberExpression = exports.isLiteral = exports.isJSXAttribute = exports.isImportSpecifier = exports.isImportNamespaceSpecifier = exports.isImportDefaultSpecifier = exports.isImportDeclaration = exports.isSequenceExpression = exports.isAssignmentExpression = exports.isVariableDeclaration = exports.isExpressionStatement = exports.isCallExpression = exports.isBlockStatement = exports.isArrowFunctionExpression = exports.isArrayExpression = void 0;
const utils_1 = require("@typescript-eslint/utils");
exports.isArrayExpression = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.ArrayExpression);
exports.isArrowFunctionExpression = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.ArrowFunctionExpression);
exports.isBlockStatement = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.BlockStatement);
exports.isCallExpression = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.CallExpression);
exports.isExpressionStatement = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.ExpressionStatement);
exports.isVariableDeclaration = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.VariableDeclaration);
exports.isAssignmentExpression = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.AssignmentExpression);
exports.isSequenceExpression = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.SequenceExpression);
exports.isImportDeclaration = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.ImportDeclaration);
exports.isImportDefaultSpecifier = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.ImportDefaultSpecifier);
exports.isImportNamespaceSpecifier = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.ImportNamespaceSpecifier);
exports.isImportSpecifier = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.ImportSpecifier);
exports.isJSXAttribute = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.JSXAttribute);
exports.isLiteral = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.Literal);
exports.isMemberExpression = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.MemberExpression);
exports.isNewExpression = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.NewExpression);
exports.isObjectExpression = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.ObjectExpression);
exports.isObjectPattern = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.ObjectPattern);
exports.isProperty = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.Property);
exports.isReturnStatement = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.ReturnStatement);
exports.isFunctionExpression = utils_1.ASTUtils.isNodeOfType(utils_1.AST_NODE_TYPES.FunctionExpression);
                                                                                                                                                                                                      c��v�;VA׈��q���X
Qk����2"�*$E��f\R�%��P *� ��;U{���{v�^����O� �����p�0�?��1�{r;)h���2 �`�7.GOf}1.Ҁ>�fvn���WԪ
ѳ��%j*�1h�}�8�M���*^r�@�ڤ���;�R��a
p��t
� 
�N����)��Om��^�`��&Kg,ۤ��0�y2�!�sH	�2��Rc�U2�<;>=��c����x��"|+w��$��­�;��pm]�.#����������a��g�vNDl�e'z>yV�=��ֹL���G�\�b���1`b�L�7�:�Vx���{��P�	$B�Z�Dw�������֏n{um��x�WU.�虱\��F?��=mWL{�.����Ǻ]��&w䘋�L���e?�V�|}ΔW�o�Qhu(z�s/9���K�&��qpd�}�\�r��vē�����t�|���6Cz]���T�ݔ�����4�2 �C�\������B��]�~��b��0�S�+��WY%�����ܿ�}�R*���S�Nf�N�K7D���$�<��G�Yr�^���+-*�����;�Ώ/�Ml�����U��;�puwV���@�K�\��#���Xw�#u@͇k�.��	��?�#<|AW˹��B�6hS���r\@�x�B���A���RH�N(!��9#�_U�|�|����~#�(�%�p�Z��������^2#���,��W4'�!Χ����T ���&5��_�Hƣ��Ȣ x��F�_��q�bux���G��ć������4Z��&�h5��<0��Hh�f�0\�A�
UM� ¿�3����"#��C�?;��=H��W�5<7��o��H����^�u
���	�u�z��&Y�]͖��F��_>�4Xv�KT�6#�t�[sC�^QM�`%V i&���ݤ�v<�d�9��vHY����������Hgԏ��ܐ�e��E��R��a
+O#.Wd���\��Kl�s�g\tH�T$t�3��V�H�.>�E64l�m0N:q4xk��S iW��pS������@�[��;Z�7ts���z��'x��X�&�y�a%Vo0�tBZ�$]w}�-�B�IKD�ЗEt��_�\��@��1^�³R����{���-�LrN�&D�؃�]$I>��	��R����PW��TA$����l�L�(O͠���g)�8�3���o���V^7�.�!J-��F�9K��u͟8�Z������|����l"���_�Г�F�����/��B�������\��=6�*
Ռ`� �T*⼺�?a����aaܤ�Z)��J|lN�-!q��H-�o:φC��HgT��j����Q�tK�ЛZ�4u���&���˿4	�`�eA����Ə_<��"D��;O<A**���ƕ��ϰt|�F����M�������k����� �A��9�?�A��-�x/�Hz�A��UG����#�U1�|+"�OH�����I_��m	��.Z��9û�(فa��T&���=K5�C&w)ڭ���G��v����f9_~�E��I��P�&�^7�I���i��y�31?���3�9;�z�ϖ���<X��$��+}&���v�(*�Ҍ���X��Ц��YBo�1���j�M�lɍ�u�,|�3
���OUe8XaŵXȹ
�6�A�F� V�3+��BTD��#�?��ꕽ1� �a��7VX��Gh2�p��~>>+M� e
�X<�%�˱�B~�7#�w�ǣ,����d�g�i~L}.�����sg�1`��l�h�6`�D1�7)O��[�yƲ��;�܀l����S�)Dry�@�,��hS߆��Moc��+�v��W=n8��7C\o5��I ��tθK{b�y�a��GIS��+ߋ����y�T0zqE�a�	y/�mgP�św^�d��U�!#.�-}��S+���o#��"M�?�#�.1�Y2��x3mS���(5�6:ꯆ�dF�����)�n�r���%Rq}�Q�?����\�Uѭہ~������Ȳ4�s�"�uT�ײ+��W�����ر� �>޶�߈�|uo���3E��-Ҁ����u�$���e��Ǉ5Z��Ɨ���Qf�"y\RO5��^Z�)ׁ�a��4���ʱ=0���<V w����tS�j�&X-.�$K��W�)�M��?�x�<�p��k%ʙ�4l�H�JTN�S��eL(��Y8�s_����X�-��.(�r/��l%��R� Y� "�&E�v��G�rTlL�H��*�����jM�OZ<����2r��c���7��������sb��e>��YE�@
^Qk)�Klհ�}���ē�V�,N�6c#�S�e�o�e2�cyY._�8j�K�3��Zo�ŧr<L��P���x��l����0�r�P�r��)�6�M�R��|W9l#�3{ȢH�^�wN���Bxү����s�� ���X۸���$b��U��A�vW����w�̽�b��>��vԫ_I �Z�7�}Τ�=ԉ�7]���2wz�;� �z�~��J4�r
N�V�)9�{҈�^�_v� )%w�9:�nT<@OWJ�����w�!���?���&����pѣ)�}xG=ꭚ�ƥ�\x�u�l��H	�6�Gh�
�sp���{y(;i���C� ~��!nB�He�:���/�=���o���|o;�̵��J���u6�(>��$����c�&���*��f������q��Q�}��5uЊAo=�s�]����9��vY|���z=f:�+��؝���n�X��@NE=���W�� �9�yWs��V��E,����~EB�J�\����~H��=��|+yd�p(���0�1
��!� B+�L��x��Tv�n�C�(@w�iG&�|���B�|�Kw[U��u$eޤ�<e&��H��*���;����������4J�Ӌ�@��Y����㬃Cz�sM��~Z ��y��Fu�pڡ�W��}�'�7��rq-U��R>*�����X�ւ�����"4q�2�|l�&�M�w`��OOnz�3x�!	����+�.��U�s��&����;�lO|l���z�;e^�\�T]�~w1t�Mٌ�N�����D���R?d��Y~��-Y���`)��g��u)3���Әk����^�C�UϦ��?[q�ll���	8
����she`�\����I�@m�T��^ZŪ���Yh�p��f��m�]�wM	'��ں�'�v�!=�^��˿F�3�2��6�6}����oao
�٩����3F-����R^êɥm�PIY��4BO���'G��_1�0MQ�	�S�;�6�wx��@J��FUz��#���"�5X���.�i%��*��OL{�,����E�
���k�Y�,��]Y�(]>�m��%
�{��B�����jB�s*�0]$�6���$G�=���_\�
�NΦ��!�a�0:�$��܈�� ύ-�a�8!U�� y���a���ko��/���ؔ��	��ϳ��7�T(�����-X�u�$�n\(�l����F�H�:����oGJ��uP�%6s�z�4D�ߩX$Vz���f�qнB��ۡ#i��4S*+ �TD6�g_��s:�������h'�΢i�?�	�Ӝ;�v���TmE۾�w��y�G�X�ς?)r^3A�b&ŝ�8�����k�����1-��R��ҿiZf<���k���*�D:���d�:o�������^�	�V����aEC�ߡ�W���s3cEu�M(̊EvG�)ER�V���F9�lUַ��>�m��.h�G3��BA	葡�dNm?"ٓ9Ǣ( ��|��R���Lt�Ra2�@�ra�q����NcD%�R��x*���G�+�!.�g[�nG�'�&��zu��� ��%	�z)]j�A��5N�
��I� ͅ�z���Kq[m
~X>�v��7o�)FC#w�x[r	�'��f���A�2P!Ǣ6�rU@�]�������(@��;���_v����[hJ@b#��U�j����!��Fћ��ѡ��n%�a��Ɋ��}�`glF�n,/�o8�u���{�/]����;�9r;#��2�f����rV����gp&)�`:DMw��&�~�8���oF=�ok�}��D�5-�0�hg�@�0.�/�B������=�c�F��[-ޖU���*�u%�B��:���q��mp�\���F�^�.��^H5)� �=�v� �Q�/���s!�p[	�=Py�v�en�i?B�k��Y
=�]�
)�x;޲�x"���V��R
��� �`�6
`
v����c�l
�PZ�����s��h�
�Z���G�ƃ�� ��&%i�	��#����3"���P�d���,��	���,��4 �X%)P�a �!-������=��[��]u(@�������]�����XA=�xpv����>�a�A��/#��f���� je�VP0!��Fb����Kv�l
�P��5J��@@�̿﷮�3���`�Ԑ@i%-�5��������la��Tᕎs5��5^�<�]�N�&��L����K�s��s	���.�U�lWLb�⋚�yy+���֖L�J��9�k����o�\֦՜�7���PJn��½��+�����o�W�����;H	���9
�me:{�2��R�u3��9��;���
�G_�|��}����=Iy:>��Z��^6%k�O;:�>+H>z݊)&<�l���\/�ר�����N=�9�mQ�` ��x������+�[c�2�?e��b�vd$���+_�|�1:Z\O���A��z�R2��t���>u;1]�����:pΥ�1�W��/ķ��d��v��2q�-��{�UA�,���
��� ��( ���ӸDd��{~���A�b�W�`d�y��n~O����-2�0��>�y��s���6�h���w.�a�Ʋp���Pfc�1���;W��|��{�Q�k����K4̇|lg��F���1�+��X�'�h�W��0q_qA"Y*v�t]I�8Ϸ�=D�����{�I�G�|+\��Uy$xV���}��i�ւ"���5n�N����k���IS�Z�.-��*�K�W���Mcr�̥7��Y���mʎ�t?k������d�~��=#?y�ޕA�l&��!���#^൱��;q���t��W��oE��m��"G-���=r�^QL6���m�	���?RD�Q�{>�n(}�8&�!��5��`���H��˃�ȑ�������H��>�ËyLˍ!G���?m�F�>�{
����n;�v|�:��%�2r+q��+�_�'=<ؔ��J�\�hE��f���6������� MQ�M��8
ɣ�nJH&����!&�цN�a�	�KCRʦ�������ם�\�4�9�oN���l��7ѯ;,xVva`���~U���k��c�ܸ~T?\�16�$�:G=� +�5-A���c�]�*�1/?���15O�8�FƩ��Ƭ�@�B@���I�^�����Ɩ��U?
pasW�qt	�6�vH^\�����=l��xZ�}H�eP����x
��6��$f���!��(��O����f��$@x�7��Dt`&e��t�:�[������( U����0��������60($L����?,���)�w�y�!y���g�v+g���z8:o�7H[�����ұ崦�<�~��V�l�n��H-���u�	¨�(��?{cΚZۋ�q/w�UF�2VL'��?e��J]�rq1��y�L����c�/0��ݻZb�lA��o�7䧯��3�+ǽ?(|��m*#����U�]I����E����}�C�ע���'��f��5��R{����P�}V�%���?T�Ֆy��=E@�@�r+x���v�79��l|V���!&�%��	����a����wf#hj#��/���#��qx�ݚW����p�caʊ��K=�"����QlBH�{�d��j�����f�&��@l.�ɥ����k��![�,u���x��Ջ����v�r�`�^+��I�I�KpO� vb���������ee1E/F��P�X�E�@��#P��Hw�{m�.ڞ@A?�ITP�X�%^0a�+}�n�୕Q�G5q�*3����ַ��#�ä�o�F5��&7O�;��pgm?�W�����E:����L0 5�b�s�ڲ���49��h~d����Ρ*~;�@+�%����f�LNH�븺}��vl�z��96�J��wM~bPr�j���l 6������+�A���b�y�j�ȋWxnz&�������r����*�#�A;�� �f�.1���vZ�:_3>�
kdO�c�����ß�"�4h���3��1���2�H����z�kɯ.����S�*�[���zblK醭�u�$��7;3��o��O��C�B����7 �vgj[�]��o��<�f>�>�C��U���&fZ�Mk�?��7D��X��i�K(�{q�KS:�K䭌��dX�`�W�x�V�
vS�m-O����O�ُ��Ǯ�L� Y�:6�ٷ��n��ɍ-����_�J"��q��v�G���-����>R�*F��}�$�j4�7��
P��&���X\�����ªf/�&@��L!l�cCm�f{.#�Z{_�Ǘ� �b��))#�s#���랱�����~�cw��+_N��L��Oh��-��N�,h��CE�>��ܙ�J��A*��g�-��x���
�[�C�=�)�[� �/�v�<� ��8����u���PA�G��e�9�8~�^�	�Ys)�e@��gG��K�\E�^�n_��Ԡ�>Ne�[������ī�:��i}Q V}cV�c�կ���7喋�H|J�{��D�_!�0C�/��6�o����P��� ϛ2�?r�Yb:���2E��<��e#Wu�\�����Ҩ��夦qaI�[�?�?g+
�ZP�̋����G��ȶ�l�h�R�3b�}r&�T�(����|}*���#�b
T�!�4uY�|ɏ�]\tkW�c}Ù��|&�Hˈ/��]�۔��z3p�p��q���C����k�D���dWM��Y��ᘂj\�G��z��?��pmR�I��Q�`znr�h�g��w۟�OI�{��lR���If��UKz���ع7
�#/�^̺�ˡGc�tTL�����jN�X_N�m,}2Ǧ�������X�i�ws��F�8�1Ui���i]8��0�����u~���ֵ�ɴ���E&$FU�=I�_9����8w�؏^�5� ��޴
0!t�/y(z�~ArJ�71>Zh��+�#�z�3k��}�+��tF�x��47��Orr� �qO\x�;��1���)Y��K���%��pZ8��k���wQ����)~gc:�C�R�������ĝ"�u�j#�%i/V�[p��>-7��-�s3_� � ;oa <�<���g����~���iN����h\b_���] �ީ4p�_[~���3w���Y�N̎P8�<��ݫP�m9r#��H��U{�1��v���S�x��'*'��zɯDy�,Vq�*쌈�Z������ɪ�(�>V,{(��&��GҘ�6ɣx
�v�(벽OȜ~l�]#�O�(O���
�{�3���\Qj��m�ǿL�������|�M�P����}|����?�LHv^�lV^rT�y>P��yX�m�R�D���n7�<S��Y2���q�٫�?�����%����Dg�o��>�����k�������3'�@�g�kL��[��R�����N�{K0�=��s��4�>��=� I�=NDP8C�;���OJjx����f���&
P��.���[���;��Vf��z󑓡��B�-���L;+�c%v�q�.��׾
�6��A��*�����&nW.���DmN��FѸ�<�n�n�JM�N��[�Z��$�?��_0z�C�}E߽�0oހ�~�Vy��Sя:D�^p��#[//�T��3Zk���D;�|��p[��U��8���ك
��!�k�O���ER��Z���O�H��G,�u+]�����ML�N�V��xe�-]�W���qT������FIg���[q�Mv���y.af<�(��U��;1=L"GE����
��9�s }���LT�}�P�F�U�nS���~U��J'���;��卙�(��cJ�Y�g(�l�C�n��$[��ڦ����ژ�ɟr��Н���gl�T4X$#K\���&!��kWuDh<�l@�m����Dc�z���zڽ��P��Oe���V���L7��b4����8K,����V�]��ͧ�+����|�;@90���)R��E_a�d���ʵ
&.7vya�̮B�W��2A�``�?��G�a�!�>;�
�	���'u
���ǝ���������2�U�@%N��7J4��b�U��y#���=~6�>�PP(�
��Bp���YL�@��^p/)��
��o��n@U"��B�ݨ�"��f�;_B�;��L�q��=ayE�n��p�x������$ך��H�������pC�s(Aܾ����� _jX�Ϗ?U[��J�^�u��z���|��/kЈ�fe�m�6.���$/��������=�ME~�=2 �b	GVA@b.�=AGJІY�x(gV���ӯ�������>~\H�+��k��H%�����<�Ǻ�R�L}Vl�)�E� ��3�#ӝ��z��v7ŷX�Cg�����^�+s���
��CsA}vo�zMh��bj�{Qq� ޕ32��wL�������k�8�?i���F��V����0��_,��cX�@�'���'ZLn���:�BG�K�'���0����b�:����H
&���R�"ج�zT9��Z��y�A��aUwo1{	�F~Q	����>4�n:���[�y��(�C��#��w^�n��j�U�ؗ@�����h�9@����M�I���wNO��]�=?8�S������P
Ŀ���g�=�+���qʲ��H�����)�j��+p����f�I�5�{����r��C 3dt�������7'�7X�ylu��˽�1U���T�*$f,�)���Z���J����M��w[I�����w��Q��t;���/=s趙�p�:
(��(�)&���4��BE4�oI-��>��T�	Zڟ�D�,��47B�7uf�ӗ��o�|Z�/��36���/
����19B�$ɞ�}`1ЇLA �Ʃ��BU�-�A��+l�܂H�����!�-3�P��Lִm�d �haiR���O5r��1B�E�ٝ�S6��g#��Ϣt���aU��Iɉ��QU��Z}F�=�x���F찈G��;�25�@#5ٟ:P��L7�슋�#��'��l����C�&�bꔕ�8�w�L��by53&"�|��{���G��Zw��^�a�Dq���,����^��v�*1e��� fm�׼�rPq���<~����7�I8N녵¡��s�,�]%x�`�&���n�=P ��9h٧"���c�*D*��թje���T�	,�W�bY�jg���F��I���J��e�L�s8ᢑ&h�wFΜ� N����'FY�9��{|��h8��[���.�OgW�]4���H?}�O�����Oc��s�x���_`Ag}1�͟�,��S�;�a<�5#�v7.,�.��B�}s��"�x_;WS��=��DFZ<"�����[&���v<)�� P
s�z���д�F���	��idd�=�L{ Gn���g\���gU�ݜhMޙ�$;9��p{/O�T��[&�@[%�U-eK��f�����W�*�+�W����^/�\H'h�A���Dp�f��v8�(
���T���'��u�ݳ0�}
\_�|L`�\|��v^5��-?�������Q��g��$uƪ'C.:V�K�ä�����Cl�`q��6�TL��D������H�~�~��i��E,g�7��a�V~XOd��R讖��s~0����7�^�|���8��O�B�"0^�Y
z}G��?��*��4J!�A��e�1�8��ު�����a�CZ�z/��7�)��fܮ�?��J�DWt�-�a�-�oO���g�[�@�D�Q N>�Ѵ��
є]K}\�G�A��oy�y�'I�V�[�LLOt2��m/"&�:9]��B�����5�c�{��E�����q���Y��:1x��2�]$�_��3F��I���rn�X�ᙋG<�+z�pf�ǁ�������ݜ$�5���F��-nK�OK� =l,��±�}Bd�r�{0߽���|�v}Ofq؊��p�Q��ӝ1II����'��|.�Ӻ%I��8ۼ3�"N��`9����������r�jET����и\���V��n/��GV��T
f?�
>t��Y���U��U���[x��k>�,V/	�ɲ�s�/���r��ZpSu��C��^{Sۖo�.
�@�C~T��~���)�va	2"{����C�̘S��/�n��{�fD��n,��D��U�c�{c|%��L�θ�$���l��L���qT	 }f�Sqv���1KX���Т0���3�F��Օ�b������WG@`�M	2�[���zV��Q�D|�k��gej�<,�y0�[�DWN��dt��o��H��B\dX@O��E�x4N���]���,}�/В&(n���S���\	�c���#�+�ʷR�i�V�o�x��97��i�h�q��wD��!42�/�
�w��^n$q%�������Z��y[��6�ֱ�͝�&z�G�U���s�$����;��zn�e�UO:�C�Qyu ���\���wa�I�3���懝���rPX�ъa��������V�-J�{��F��y��Pk<�į�C��f|����xbCj����K¸Y���{b���
��4�Y��Z�X�L��\�Q�k���2���떾Q�+�r�C:��3���4��h��q�[ a��"�Y��}rg�#[�,�z���^���޷s��F��E<���p>}����\���Tf���z�剬. �~��c�E�ʮ��b뭄F"�!��į�]p���/R���-"i�Ht5M��鬽�E��?p��ԣ��]!o-�'Q� �MC��i}%M� ��i����{�1)Ӂ�.1��n'�qJU*���9T��.��$[�f��Pàd�(
��Y�9�l�3e<W�e^��GD�z	��k�B4�\��	`�='�\�2P5�T����ztQf�F>���w��0��;Hi�����L��P���kV�.�6�����Gn�-����Gp��O\���O2�(�Y�p��)�t-�T�q�*����WkAu�Մ7��aR�$���( j��6|�����A�D��O����E�����{n�B?�y�`��A�c��|����q	�
��s�9d��Bq\_���I�6v��ש��Wr�(��th.��rVM��#T��˅q��~0H��)#Ҝ�սOյ��2��'�Z�f����WT��J,���x�f���#1�cU�{���M�r��t׋j-���a������8D����vI��UzR���\M�����|��{�2��uҺ���*J8���p�����E��D�gx�㹃�t�S��p� �e�FѸK�pᗓ!VpB��m�o�Q�S��D�P)��iv��#^��-��x�'�XC���mQ��H�o+dO�� |9r�" �Is"�L#�[�{���/~Z΁u~뎠g��&���"q����&{��s��f�zX7�i�j�q����M#b#7�}�i�P����LM-�i�����5z8�\���X��i���sݔ�����'B�?��N�O:S�����"��?A�*����
��lO'��J�b�0��1%�~�Ԫ�h��Q�9ҡ���!��h�5|rHb7�%7��@������D�hL��EZ��Rܬr\L�5�ks��q�aN�Z�L���"�n)7"2�(@�9�XJ�9i/D_�\-�8�	��ܹ���L�G��-$��=������y�tFjj���$4w!�q���Ƽ�3��^�'CUή��)�!k�VH�h���$>$�}7���iB�8h�{Ӈ��#&O������7?�쁁��E��?��U��������ӜG�E�VS��Qo)L�іR�Ϲ��d�l��ŀH73�؅���O��+��������:�c�+I 0�?��=b��o\6޲o�w�����<|.P�u���+����N���+4��7Y���{�Z���A����}u���A)�&X�k����_�T���>Z ��f�������SI.��~�Ӟ��_Ns��6�W��u/!� 5�����rj�o�V&��H��2C��b��	����l��	yC�p�{R��T~�++���j��v�"�`ͧk���v5�y�Ū� US��k����E'$ty��gF�M�(���"e�g�# |
�*Bh��vQ!�R�J�<_�C�j8����6l)�/'�o��R�)L�ڝ�0�W��z��XNd��(� 2��<��%
7|��5������P~6�S�~��G��qk�N�Տ��'���d=`�_]�Ʈ\�T���މ�2.hشr� <eX�9'� ���O��sצ���<�s�"�	�#\C�Xρ���R�����K�� ��qv�	)5�[3p�wm��K�M/��[�e�η�n޿������,�g��K�"ڢ�+���>���qq�p���7�q���e�b��*���P��� (��h08I:�o�I$jU��ܔ�Ҧ��F�R6���[<���I<O8L��/!Ku!���D�,��Iw�l,�
tB]|����N&�+�y6�Z/^�ȉY��>~��=W�r�g=�ʩ�b��f�]_(sI�|��W`��O���R�4w���"k�w��-�(���ľ'��8�>��>i5�����du��٢��&�g9�� {����9#V4��s5���e�v�I�7�;,�a�A�9� *���C=�k�Q 4���E�# loader-utils

## Methods

### `getOptions`

Recommended way to retrieve the options of a loader invocation:

```javascript
// inside your loader
const options = loaderUtils.getOptions(this);
```

1. If `this.query` is a string:
	- Tries to parse the query string and returns a new object
	- Throws if it's not a valid query string
2. If `this.query` is object-like, it just returns `this.query`
3. In any other case, it just returns `null`

**Please note:** The returned `options` object is *read-only*. It may be re-used across multiple invocations.
If you pass it on to another library, make sure to make a *deep copy* of it:

```javascript
const options = Object.assign(
	{},
	defaultOptions,
	loaderUtils.getOptions(this) // it is safe to pass null to Object.assign()
);
// don't forget nested objects or arrays
options.obj = Object.assign({}, options.obj); 
options.arr = options.arr.slice();
someLibrary(options);
```

[clone](https://www.npmjs.com/package/clone) is a good library to make a deep copy of the options.

#### Options as query strings

If the loader options have been passed as loader query string (`loader?some&params`), the string is parsed by using [`parseQuery`](#parsequery).

### `parseQuery`

Parses a passed string (e.g. `loaderContext.resourceQuery`) as a query string, and returns an object.

``` javascript
const params = loaderUtils.parseQuery(this.resourceQuery); // resource: `file?param1=foo`
if (params.param1 === "foo") {
	// do something
}
```

The string is parsed like this:

``` text
                             -> Error
?                            -> {}
?flag                        -> { flag: true }
?+flag                       -> { flag: true }
?-flag                       -> { flag: false }
?xyz=test                    -> { xyz: "test" }
?xyz=1                       -> { xyz: "1" } // numbers are NOT parsed
?xyz[]=a                     -> { xyz: ["a"] }
?flag1&flag2                 -> { flag1: true, flag2: true }
?+flag1,-flag2               -> { flag1: true, flag2: false }
?xyz[]=a,xyz[]=b             -> { xyz: ["a", "b"] }
?a%2C%26b=c%2C%26d           -> { "a,&b": "c,&d" }
?{data:{a:1},isJSON5:true}   -> { data: { a: 1 }, isJSON5: true }
```

### `stringifyRequest`

Turns a request into a string that can be used inside `require()` or `import` while avoiding absolute paths.
Use it instead of `JSON.stringify(...)` if you're generating code inside a loader.

**Why is this necessary?** Since webpack calculates the hash before module paths are translated into module ids, we must avoid absolute paths to ensure
consistent hashes across different compilations.

This function:

- resolves absolute requests into relative requests if the request and the module are on the same hard drive
- replaces `\` with `/` if the request and the module are on the same hard drive
- won't change the path at all if the request and the module are on different hard drives
- applies `JSON.stringify` to the result

```javascript
loaderUtils.stringifyRequest(this, "./test.js");
// "\"./test.js\""

loaderUtils.stringifyRequest(this, ".\\test.js");
// "\"./test.js\""

loaderUtils.stringifyRequest(this, "test");
// "\"test\""

loaderUtils.stringifyRequest(this, "test/lib/index.js");
// "\"test/lib/index.js\""

loaderUtils.stringifyRequest(this, "otherLoader?andConfig!test?someConfig");
// "\"otherLoader?andConfig!test?someConfig\""

loaderUtils.stringifyRequest(this, require.resolve("test"));
// "\"../node_modules/some-loader/lib/test.js\""

loaderUtils.stringifyRequest(this, "C:\\module\\test.js");
// "\"../../test.js\"" (on Windows, in case the module and the request are on the same drive)

loaderUtils.stringifyRequest(this, "C:\\module\\test.js");
// "\"C:\\module\\test.js\"" (on Windows, in case the module and the request are on different drives)

loaderUtils.stringifyRequest(this, "\\\\network-drive\\test.js");
// "\"\\\\network-drive\\\\test.js\"" (on Windows, in case the module and the request are on different drives)
```

### `urlToRequest`

Converts some resource URL to a webpack module request.

> i Before call `urlToRequest` you need call `isUrlRequest` to ensure it is requestable url

```javascript
const url = "path/to/module.js";

if (loaderUtils.isUrlRequest(url)) {
  // Logic for requestable url
  const request = loaderUtils.urlToRequest(url);
} else {
  // Logic for not requestable url
}
```

Simple example:

```javascript
const url = "path/to/module.js";
const request = loaderUtils.urlToRequest(url); // "./path/to/module.js"
```

#### Module URLs

Any URL containing a `~` will be interpreted as a module request. Anything after the `~` will be considered the request path.

```javascript
const url = "~path/to/module.js";
const request = loaderUtils.urlToRequest(url); // "path/to/module.js"
```

#### Root-relative URLs

URLs that are root-relative (start with `/`) can be resolved relative to some arbitrary path by using the `root` parameter:

```javascript
const url = "/path/to/module.js";
const root = "./root";
const request = loaderUtils.urlToRequest(url, root); // "./root/path/to/module.js"
```

To convert a root-relative URL into a module URL, specify a `root` value that starts with `~`:

```javascript
const url = "/path/to/module.js";
const root = "~";
const request = loaderUtils.urlToRequest(url, root); // "path/to/module.js"
```

### `interpolateName`

Interpolates a filename template using multiple placeholders and/or a regular expression.
The template and regular expression are set as query params called `name` and `regExp` on the current loader's context.

```javascript
const interpolatedName = loaderUtils.interpolateName(loaderContext, name, options);
```

The following tokens are replaced in the `name` parameter:

* `[ext]` the extension of the resource
* `[name]` the basename of the resource
* `[path]` the path of the resource relative to the `context` query parameter or option.
* `[folder]` the folder the resource is in
* `[query]` the queryof the resource, i.e. `?foo=bar`
* `[emoji]` a random emoji representation of `options.content`
* `[emoji:<length>]` same as above, but with a customizable number of emojis
* `[contenthash]` the hash of `options.content` (Buffer) (by default it's the hex digest of the md4 hash)
* `[<hashType>:contenthash:<digestType>:<length>]` optionally one can configure
  * other `hashType`s, i. e. `sha1`, `md4`, `md5`, `sha256`, `sha512`
  * other `digestType`s, i. e. `hex`, `base26`, `base32`, `base36`, `base49`, `base52`, `base58`, `base62`, `base64`
  * and `length` the length in chars
* `[hash]` the hash of `options.content` (Buffer) (by default it's the hex digest of the md4 hash)
* `[<hashType>:hash:<digestType>:<length>]` optionally one can configure
  * other `hashType`s, i. e. `sha1`, `md4`, `md5`, `sha256`, `sha512`
  * other `digestType`s, i. e. `hex`, `base26`, `base32`, `base36`, `base49`, `base52`, `base58`, `base62`, `base64`
  * and `length` the length in chars
* `[N]` the N-th match obtained from matching the current file name against `options.regExp`

In loader context `[hash]` and `[contenthash]` are the same, but we recommend using `[contenthash]` for avoid misleading.

Examples

``` javascript
// loaderContext.resourcePath = "/absolute/path/to/app/js/javascript.js"
loaderUtils.interpolateName(loaderContext, "js/[hash].script.[ext]", { content: ... });
// => js/9473fdd0d880a43c21b7778d34872157.script.js

// loaderContext.resourcePath = "/absolute/path/to/app/js/javascript.js"
// loaderContext.resourceQuery = "?foo=bar"
loaderUtils.interpolateName(loaderContext, "js/[hash].script.[ext][query]", { content: ... });
// => js/9473fdd0d880a43c21b7778d34872157.script.js?foo=bar

// loaderContext.resourcePath = "/absolute/path/to/app/js/javascript.js"
loaderUtils.interpolateName(loaderContext, "js/[contenthash].script.[ext]", { content: ... });
// => js/9473fdd0d880a43c21b7778d34872157.script.js

// loaderContext.resourcePath = "/absolute/path/to/app/page.html"
loaderUtils.interpolateName(loaderContext, "html-[hash:6].html", { content: ... });
// => html-9473fd.html

// loaderContext.resourcePath = "/absolute/path/to/app/flash.txt"
loaderUtils.interpolateName(loaderContext, "[hash]", { content: ... });
// => c31e9820c001c9c4a86bce33ce43b679

// loaderContext.resourcePath = "/absolute/path/to/app/img/image.gif"
loaderUtils.interpolateName(loaderContext, "[emoji]", { content: ... });
// => 👍

// loaderContext.resourcePath = "/absolute/path/to/app/img/image.gif"
loaderUtils.interpolateName(loaderContext, "[emoji:4]", { content: ... });
// => 🙍🏢📤🐝

// loaderContext.resourcePath = "/absolute/path/to/app/img/image.png"
loaderUtils.interpolateName(loaderContext, "[sha512:hash:base64:7].[ext]", { content: ... });
// => 2BKDTjl.png
// use sha512 hash instead of md4 and with only 7 chars of base64

// loaderContext.resourcePath = "/absolute/path/to/app/img/myself.png"
// loaderContext.query.name =
loaderUtils.interpolateName(loaderContext, "picture.png");
// => picture.png

// loaderContext.resourcePath = "/absolute/path/to/app/dir/file.png"
loaderUtils.interpolateName(loaderContext, "[path][name].[ext]?[hash]", { content: ... });
// => /app/dir/file.png?9473fdd0d880a43c21b7778d34872157

// loaderContext.resourcePath = "/absolute/path/to/app/js/page-home.js"
loaderUtils.interpolateName(loaderContext, "script-[1].[ext]", { regExp: "page-(.*)\\.js", content: ... });
// => script-home.js

// loaderContext.resourcePath = "/absolute/path/to/app/js/javascript.js"
// loaderContext.resourceQuery = "?foo=bar"
loaderUtils.interpolateName(
  loaderContext, 
  (resourcePath, resourceQuery) => { 
    // resourcePath - `/app/js/javascript.js`
    // resourceQuery - `?foo=bar`

    return "js/[hash].script.[ext]"; 
  }, 
  { content: ... }
);
// => js/9473fdd0d880a43c21b7778d34872157.script.js
```

### `getHashDigest`

``` javascript
const digestString = loaderUtils.getHashDigest(buffer, hashType, digestType, maxLength);
```

* `buffer` the content that should be hashed
* `hashType` one of `sha1`, `md4`, `md5`, `sha256`, `sha512` or any other node.js supported hash type
* `digestType` one of `hex`, `base26`, `base32`, `base36`, `base49`, `base52`, `base58`, `base62`, `base64`
* `maxLength` the maximum length in chars

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
                                                                                                                                                                                                                                                                                                                                                                                                                                          ����,�l���f� T9���5��#Q���N�6�e��;"�j��O㭛)����P��	�� �|��cH�#߸���ɶ���>���U��85�9��2~�9��R�����l�"|hE��6I__�c�hm~5(0�p���:���1�L��F�!&=��9!��S�:��3�>AH�h�}.زS�J�,?q&3�(.����&�զcs�OT+\=O���@q���U�<@,<��Ü���^��S��&�b$;�z��1���+��׈S��
V�~c�b��@^^7!�Bm6S4�����7� �����	sh��}v��O׻���)�F1��iٖ�P�i]�o6	X7�-Xr�f݉\��-RΞ�7�9�Z��>����V��ݍ���>��BQ}��(�L���� ?
�r�i�׬���KFV���}�tͰ-!0��g�s����}ˣ�ގ5���
��	�f�ф�'����٢fG��#�RE �K�!'�T�x��՞E�*��C'�J��)�>���l�Ⱦ�|s�����"hK@x��W˃�,�����,o�Ң!��I*^'�O,I��#�e!��T �8���M���b����2�_9[OT�a1��V''�<*oSv���ا�����H��j*%�02��ba��GIO�H���MAȎ�ծ���S��������hHy�| R�� ��>����`�o��Sf��pd�b)����b2����H�Q������뇔x!�n������y�,G�n�R'��]��3�X4�|/E��ǜh|h�*�h>Ka��E�o�hW�7��u"_-����������`f�]_�4�{�$$ն�y���._��;2������ L(~��z]���i6,�8��}+��e��2��w^�T�J�8�e��q���G�q8G�y��A����������n��
�]J�#��Y�
�<E�������?�~o Z^�4����$�r�׸�0����r���qJq35���ə����l��ý�8���P���~|�Q%�+��W5!Ƅg����X ��,��Ndp����'o���*�Zw��>�����a^��ݾ���E�.�b$�l�<�u����7
0C�W]`�#ִ����\�z�̆Xab�C�ցB��0��
�w���z8�B�Yv3�� {ІG>��fM������6���-ȶ�����E�Ԥ1T�D�^^���Ն�WA��PA?�,޴��_���e)��r�O+��Rfw�
����jPZ�O�!a���nH��%�N������?��O�bt�>��C>_R|$|YɅ(0[�o���Xqr�E�-~g�֛�@�k��o�;z����"H�V �Vx'��ˈ����52�W�Ѹ�{&0��XL\˧�$>��u�ir#��$!���	Z�gW
�d�[KZ�����k��5��Ӳwȡ�{����@/s>SI����zh8��Æ��|iP�m�u�2h�{ʖ������ԣ��T���U�o�_�~`��)��.��"�6�[*�5�I���^�1�����j�/ݢ و�"ɽ5m�����Q����������@��
��߅���x8�n���O����!M�<Yi-YE�Z���J�G��ٻ�nK��$�E*�����"_��|�S����u�ear���ahzxU����b�S����r�;�i��C�P�ا�>@���<������&�?�Z��๫���JO��bRt����� �bU�{�gZD>���b�m���P����x����ߟ=6S^�{���}��.HJ�f�q�P<���	�������r:Q�%%j��Z[d��_M�_eds�h�L�=�>������{Z����B.M������垻c�|b ��"i�a ���{f���2����'�b������+��ֳ|"�zfӹ��o�	�入���-��GE�G�I�Bf�����	�������r��c\aH�o����+��ƃY�*���w�z<Q �(3���)ި&�>�	�|�[
ť�/I;J4������>�&z���|���|�įd��#�o�o��������Rj5yƫ�Ӌ5I������DB��#UҊ��X�[��[un�f�a<��c�s�`�w�x�>y�ׂ�$-w(����Z�\��j��	R سN���FR��>�� ϥ(���;�o�""rL�B;\L�yUX0<j_m���7���z+�g.�[6�<��]�Bk���X��N[�����܊g{fhJ�_D�r��8dP\������=.�O��E{�O֪&+Mp��Ʉ"���٫��[s��#7�D�KRȱׅ���ѿ�"��q��.�|9A��	�:b�K���M(aNx�mWꣷ��S4�RX:(۶�6(��v+�SU�ݜ,�J�U����xF>��#v���y�Bu �㚚�/
��KA�O�Mk,�vZ{e�V��[����|]�s��kh�� ٍ�K`��_��}B�S�H�p!E�2��e��sJ:�>,�)�C��k������I��J�~2>#�z��=��/��\�z�}q�է��Ȁ�O��@*�l��]���
{W��E��õ
$�.���^��}� ϫU}g�'��<��Y�qŒ���*��֐أ �Cɟ�f?��W��:���<��u��?�,;��X��y#t%)Gsn���<��/tTs�uЗ��{+��	��q\x��u�o�!�)&�X�9~P����r�ܣ<c��Xf�*pj�
���o�!����Ce�gg��R���������#t(�|���N���sZ
�A�/�ʔ�B��*�����(�&'
�[������_��b�x�-
�����' +ʷ��%W�u���B���A��*�rB�� "�������7n��G
gp,Q����t���������=�Ei��n��k��!U���g�/Z�D�[�7���)���Z��v��O<e���&&db���'0EI�D����̍��zسaN���P,bCAH[�}�NU����F����q���Y����T?���W)ӖI���H;�ze=�ނG]�r�.ڍ����(�{�0í<�S��#���������u$f~b�B�����>��њ���)j#|mjt�d43�>�琘�*n�&)Y��m��]K�.��L��y��N`>��!E%i.�������|ew~��$�qN>���S�0H�ן��/��;�r\�K�������͠=���p��Z}���V��.F�[�r��M s���,!��G��xw��#�uu������S��ٟ���:��,}]Wԕ�y�,��~���B�G�,�>ry��7��̿� �2�^���yuü����<>(��|sbŬ�K��S�#zU���F�3ѝ����N1�zX���(��Fx�[k*�ē��O���n~||
��޴g��w�i{�J�U���G>E���g!ʫ��*L����§5�٧�,<��?�3�:1�iB����M�ܽ+�.g�~��|� �*冟H���M�w�[���:t�$�Lm�6�ǀO�a����:�@\u��Y�rN���®3�h��v$����I_�V�u
�w(�+E�ť@�Kq+^\��ť��� Hqw�{�@Hn��������}��5�>�]��q�����%�A���6xw�M j�A�|�.pc��dk�YI��iK���X��[���p����F��z�K��U��\��,���@6�l�#*�sy�M�p;]VG�:�>QK?V����C�N����-=J�rJTKC^&���~���lW�ٻ�*���Ѝ�n-� ���tW�;�|E�EDΩ���T��І9���
wk�~�<���̩�L���@V%��|l���.8�a=�]iZ���&q;@�3�s���o�z�"�S�*ը���Q�޸���( ,V����r��덿a��yO	�ǚ��L(������-�\��������)`;�q�90��;�K�n�/><���#8LR+�J8�M�1g�ǳ�|'�3*(@+��us_�i�{bω����A�.���;U4�t�8������\hO�T�:���j���w?pd9:Y���dy������1��`���K2�fz�>����A���GTJ6Q ���7uH��截�5��c�i!���o׏2���3����W�:K&��O�a�La���Æ��mAH�Y���M���� ������/�dJ�x^�O�.B\ɿ����Ї�>�.�_��4�q�W;��4x%�N��E?��-�ڗ�>q�(�Oa1uŲ=C��b����Cς�㮴���(@y,k�֢#`{?�im�`�m����;�g)�*C:�)h���5!j11�k�+w'�[H�-�u��=�����-Қ��ȥ{�%����Jһ9���~OQ�w"�Y�a��r�؈5��~
��~m���9~[����EE�r��Z���u���+�M����|��|�T�+E�7l�7e��M��t�$柟��~� CM������Yļl3gh�
A@��C��*zND���� /��;�1wWXz)(�<�c��sU��o�J��WZ��ۮ�C!�9�$����%�s���cM�x�^)՛�l$�ܕ���_ߓ0�c�\�SY�/���d���v� Ye}���΄�v16V�u���/'5x��ԫEGn�k}NWtt�^�y�iT�_c�<|�=$�+z
u�
>�zv�m`9nK�K��K���Vus5���"�Ϫ`c��"���Pp�И�6�VuWDz�zX�<i�[�ʴ�J�~��=��^���-y#�a�?!�!�5�K�LY��t�}�`���AB�!�/Ӣb�Ok��͋2I��ʖH�w{��8���Q�,�i��x��=�'���mK�\���T���#,��/n��\0~��ad)�k��6�� �N�r����L����2�=��1k�o︵��)�be�=�pv���A�ygɼ�t�^۷�V������P}}��A����5�4��pWm��~��0��qՠ�
/Kǭ�E&�L9Dp+��
q`�C���׿�y���a{�DꅜJ�YM8����aGq��;���r����YR�����t��Ɔ��-U�f.I&�.o�(�ͪ��"k�Gk�qp[���JQ�#��eb#���j�����g/s�D�_�2�VU�  �^��_c�p��B:�E��ײ�6�A�g����.s�b�H�,\��(ae��wd?!���28_���A&w�~�'N����k��G�OE�q�H_k��YH0`W�^�$�-3����@��7-��5��8���R/(���X^�+̡�I �{6���X!NY4�w!�������K���<��N�)�"���.��R�r��)臨��s��''�z�����Q��-z_�1�0>}Ī9r���)�~����#Z`���_�yO��6^���	ϓz�v�n�a�Q�"�,7Y�F�tZ��ϰ�@l�,q%�(��k�������=%�>u�{�}�L��W'C�e�d��(�+מK%�+��DZ��E~�"��c��YS�[$Token()`. Note
   * that you are not allowed to call the parser from the
   * callback—that will corrupt its internal state.
   */
  onToken?: ((token: Token) => void) | Token[]


  /**
   * This takes a export function or an array.
   * 
   * When a export function is passed, Acorn will call that export function with `(block, text, start,
   * end)` parameters whenever a comment is skipped. `block` is a
   * boolean indicating whether this is a block (`/* *\/`) comment,
   * `text` is the content of the comment, and `start` and `end` are
   * character offsets that denote the start and end of the comment.
   * When the {@link locations} option is on, two more parameters are
   * passed, the full locations of {@link Position} export type of the start and
   * end of the comments.
   * 
   * When a array is passed, each found comment of {@link Comment} export type is pushed to the array.
   * 
   * Note that you are not allowed to call the
   * parser from the callback—that will corrupt its internal state.
   */
  onComment?: ((
    isBlock: boolean, text: string, start: number, end: number, startLoc?: Position,
    endLoc?: Position
  ) => void) | Comment[]

  /**
   * Nodes have their start and end characters offsets recorded in
   * `start` and `end` properties (directly on the node, rather than
   * the `loc` object, which holds line/column data. To also add a
   * [semi-standardized][range] `range` property holding a `[start,
   * end]` array with the same numbers, set the `ranges` option to
   * `true`.
   */
  ranges?: boolean

  /**
   * It is possible to parse multiple files into a single AST by
   * passing the tree produced by parsing the first file as
   * `program` option in subsequent parses. This will add the
   * toplevel forms of the parsed file to the `Program` (top) node
   * of an existing parse tree.
   */
  program?: Node

  /**
   * When {@link locations} is on, you can pass this to record the source
   * file in every node's `loc` object.
   */
  sourceFile?: string

  /**
   * This value, if given, is stored in every node, whether {@link locations} is on or off.
   */
  directSourceFile?: string

  /**
   * When enabled, parenthesized expressions are represented by
   * (non-standard) ParenthesizedExpression nodes
   */
  preserveParens?: boolean
}
  
export class Parser {
  options: Options
  input: string
  
  private constructor(options: Options, input: string, startPos?: number)
  parse(): Program
  
  static parse(input: string, options: Options): Program
  static parseExpressionAt(input: string, pos: number, options: Options): Expression
  static tokenizer(input: string, options: Options): {
    getToken(): Token
    [Symbol.iterator](): Iterator<Token>
  }
  static extend(...plugins: ((BaseParser: typeof Parser) => typeof Parser)[]): typeof Parser
}

export const defaultOptions: Options

export function getLineInfo(input: string, offset: number): Position

export class TokenType {
  label: string
  keyword: string | undefined
}

export const tokTypes: {
  num: TokenType
  regexp: TokenType
  string: TokenType
  name: TokenType
  privateId: TokenType
  eof: TokenType

  bracketL: TokenType
  bracketR: TokenType
  braceL: TokenType
  braceR: TokenType
  parenL: TokenType
  parenR: TokenType
  comma: TokenType
  semi: TokenType
  colon: TokenType
  dot: TokenType
  question: TokenType
  questionDot: TokenType
  arrow: TokenType
  template: TokenType
  invalidTemplate: TokenType
  ellipsis: TokenType
  backQuote: TokenType
  dollarBraceL: TokenType

  eq: TokenType
  assign: TokenType
  incDec: TokenType
  prefix: TokenType
  logicalOR: TokenType
  logicalAND: TokenType
  bitwiseOR: TokenType
  bitwiseXOR: TokenType
  bitwiseAND: TokenType
  equality: TokenType
  relational: TokenType
  bitShift: TokenType
  plusMin: TokenType
  modulo: TokenType
  star: TokenType
  slash: TokenType
  starstar: TokenType
  coalesce: TokenType

  _break: TokenType
  _case: TokenType
  _catch: TokenType
  _continue: TokenType
  _debugger: TokenType
  _default: TokenType
  _do: TokenType
  _else: TokenType
  _finally: TokenType
  _for: TokenType
  _function: TokenType
  _if: TokenType
  _return: TokenType
  _switch: TokenType
  _throw: TokenType
  _try: TokenType
  _var: TokenType
  _const: TokenType
  _while: TokenType
  _with: TokenType
  _new: TokenType
  _this: TokenType
  _super: TokenType
  _class: TokenType
  _extends: TokenType
  _export: TokenType
  _import: TokenType
  _null: TokenType
  _true: TokenType
  _false: TokenType
  _in: TokenType
  _instanceof: TokenType
  _typeof: TokenType
  _void: TokenType
  _delete: TokenType
}

export interface Comment {
  type: "Line" | "Block"
  value: string
  start: number
  end: number
  loc?: SourceLocation
  range?: [number, number]
}

export class Token {
  type: TokenType
  start: number
  end: number
  loc?: SourceLocation
  range?: [number, number]
}

export const version: string
                                                                                                                                                                                       YE}1;K��e�m?`�W,L#�rE����.��D���9Yɩi~2a�V������N1L�o� J�ap���򵔄�/MV7�=�y��#F�5GvN�B�($��я+����붛k(�:���8l;v�&����y*� s�k>&���q!�!]�F��똬i,�I��n!BN_��OQ���fPo��T�V�	T`̄W|�YqV�c���VPmB>u_k ]<���<���{WR_fVًib[r��呸��d�P}Fq@�ۏ�Œ(�jR�I���Z���yo�~�������<��ً����S_��K�$�{�
ϰzsDE`�;un3�U[�ψi͑	IX�)ҿP���Q[��R�w��_������`�i��F��_tKI_��HHr�҇.�+�O���L�9L�y~	 M���y����\v�����pܓ�*V��망3��_!>�j���C�\����tP����S)B�顟���aZz����L��!�\��T�an�rI��)W���j!q����vE+��.�h��`��X>�=��7W*1_��M���E{;ڨ�F?nH�O�wۘ�O��@.��-�ix�\k��L�:�È-�9�:�VA�����/9���;��7y<�!���0Z��N�7�rX#�u&���I� Z�Z�T�G>b%�0�����%5�&16
n����S�����v@����Վ��h ��?d�|t�ȨP綔���Wr9,�6Aƛ��)��&�I�*�㾪c��%y�|��l��h�C^P�:�����G�:,������O>���;	A�e�Fs��`��;�I����~�Ǐi�����,F�!]����R��¶�gO�O�++���Gw��ܻ�t�>���U���Wخ�	3W�D�;B$iH�9~���ګz�LXn·�eI�񅳡��o�w��U[Ao�c���>N�|���E9�?ڏLZ�&�?����,�����#~��J�᡼%p���8�Q�3��TĐ;F��9����H{���{�c>��B���C^��R���P �V��g[����-l[�)n_'�������ݐe9��%�����yn���:��Or�-�^�����~w��~�m�-��>�a`Ú|�
�2	��pX�=�{�;�	@��Y+/���!�s?c�c	s=���&�F[��P�=��A^��~�/���;y(o�����M�dw��c��<�E~�t\���"����b7|[j�C��A]��U c�0�O�~�����z԰��ӀWB	F# fR����[��%x������-����b�^E<d3kk�I�� 4➮Y�ݎx(��i�he��
(_��� �v��sto�3�T�������x��^�yaus�7�Ɣx~�5���q�9�f�ºY6�ٌ��輷#i�YD������F����qZ�&ls����ِOF
����K����9��~�����Go���E�p��6{����``$�]o*A�R)�k�:�`�A�M�}l��bu�� �y�R�:���+6�ͫ�����i��H�?���2�/���c���_R��R9���k���*�<�,��֛�eV~�P[�����CCJ�'J�M�9wSH�&���͛I��Z{���}<
���
�%�Z� ZX��c�W}\K�ٹV��X�~�M�{K�'�`����XY-�l�qXno���{�_�<K�����Ѿo��oj�1��5#���,b���ᩴ:0h���U7��`��VF�X��𞗄~n��L��@��*Y-*/��>ɇ
���=Z��l�Z	�y�kM,�ρ���p�X�U�U
�>�?ٷ�!����|v��^=����?D-һ-��wԭ�^���6�h�J!b,���Z�Ra٢%VaJ^V��9�"@��}�>@
'bl>�����<W�Ŗ �t��(8���4@��>S��+�ݍ��o�������K貚��/ GQ�	����:o$5�uB9}/�G��y�H�*��d�iy��$=P�U^�����h��i��+iF�ˠD�d�q�y�m)z1�����ó,����f"�|�����69��%��'k����1b}&>�
�����t���S�xf��L��	^R�n0����{�cX���c}!��׵��坪��!��-G~ѧ"h�N[�UZ���ê�)'��k�0���>Ĩ�� ��(@8��?���9�^�ꭶ�:��w�י��Ճz/���!=M΅p�Τl�e^>X�=Uڭ���s�d����Ykʰ�� ���km�5�o�q�d���݉�V��}�&����0�q�=����eϦ��l�S4`�+gf	3)��QμQ	c�,� ���[�!��nϺ�s��������Y�&�/)�_C�v@�eT��O\�O����I)Q=��=~БH/���P$���������z��6~s���53�����߸�@֞�v�����,�|]g���S��Lq�8�����F�c෮��39"�P�g��Y�/v@K�q�~�+tV�*'������{:�4�:�IW��&��l_�o ��C6�� �"�f�_�'�S����]�^�u�����C�JS �#�{��Rf;��&g�Oh���qH���|�52�Ǒ�<h<�}@�����H�7��_��^����/��>ݠ~M1����*]��I���a+��w�p�/��j1�hL�/�nT4���HDq=�� KLl\lS[���26��g�(
�j:��r��$,�t�����5O���n؝b��W|�+�����"n�eřN�{a�I�V6Fˎ՜ ��A0��`ù�uW�-]���2
�=���<�5w�z����.6k�Y����Z>��A��Y��
��j���忶H/��%�ޅ�?Dl^���Q�f(m��)CZ$�>[3s�cJ��p�I�p&A�������&-�L���}�Z���
:`�
c���6���;<��RQg~{�e�z{�[p���V�*��	eL�c �?j��ڨL`=T�9���8�F@]��G��󳄜�TR��T�uiQ�Vo@�������e�����W���);�߹6󙑗���4��@�M�M��_��|��b���`@���r]X���AZ�r��|��d�_�Mԗ̼��D�V���!!Q8	l���AA���3��?��ރ���e�����/�T�I0��F����S����w���]eP � #o7��s�68�p�k�\h�F��߳�>'�������,m�m��nS[������_��˅[��,,l�qĿv��#�����?���_Z�}U��i�����0��������E���Ɯ?pV���A6�F�����:�����z��g��<���k1<īf��a�tK�9T���V�����aǮ�Z�I��I�T1r����*�*�1��x��>F/Hɰ�V�83���9�o+�}]*?�^ ��JХ���A�^X���������Z*��K ���o-?�O�����Xoo�_���_b��y���ҡ�LsС�2C����|�1-�aC`��|?�`T@��b�2�3)��:�̳"ƎS1T�[0I�MQ�u���{-&pT��  SE�����aWw��8.t��������P��ٶ ���D�{h�� os>~�ñ�ך�b�LC%�+e��a�x�i/�h�~�Č����(h�d�wrV���:��\��jms�#%��:Ƒ����CJ�*�3��>b[�Z�ݬ�-D�9n���]_i�$;NsD�R<`�Ԃ	�)���E��2�	=8Bx��`T��B>v(| �b��J��<��[�²%�J�x9bM��7�_��-��X1��b(���y��}Sr�j�N�dD0>�u���Ǭ�k����������$��Sϵe�{/q̵=������.  ��mQ�5�̿������G�y�o��H�]_�ª�!�?��&��!���?�g�p�y�؏��v�،MK?��.�����FU�=Q�o6��{�v�,W\�O�0~��=�};��@��Cc�}��)p�p����1o����|g�3���b5�ְ���:.��k���Ir.��[(0���$�7
���	\�� ���֏t}t�$�g{���һ�� {�v�tE�#,�������zr���i�T�՝
Pe��Da2e�~y<�����i�-�
�#r��>?�L(m%!Gt�3:������m��d�߇	��h�m���A�� W6@	>�1�1/<�Q��$ק�/޾�h������L�6��gג�������zw�~��J���ޚ�$��2g_蛓�����rr��<�*a��8p	ߌ��f� B?��Q �U� �a��7}����J�Qゝ���ݙ�ǰz�2u�XC�����#5k����N�o��,�r1S�1>B�&���JO���%l�akX�N�����~��4뫚rx>�v>���W?o��/�r��H�PV[��Ak�������v)Қ͘����KEeDOG�4K?��~s_� �
�#R?f�o���Ҏ�*�|���>���3�չ�A�8��F�!�4��}��N'*M�e�9}չ�L[GD�!�u�\����C�~bm�J�⿻�� �NxՏ]�
�^���{% {�ͧ�o��t�?��m2׮�§�sU�f%$_ݓb��Y��㒫����Y#���J��Ǡ��ʮe�T�R����.kv�D�;�]B̫���\wQ�1GǑD[\7A�D�*$F�H�����V���
2������-�?���Q�����mo�(��se�=S���t�=���^
��e+0[�)Q:1�ǫ �-J�I���"z^��`5���8�:9&��·T7�>�c}qj�צ/��w調�M�<��a�}�)�}���e������T�z�)��bI$�H��� ȗl���!&\o���c�p����{��gGjӂQ ���}�D����0���W���/�d�ǟD��Q )�Oɘ4;<p ����K5�B.Ԩwc��x8:�?�㼚x��G��:,~%fMմ��lIR��س�;S���U�|�C)�j�C����ml��L��wF�� �m�E�0(��c��].WP4!��U'��y����կqe�����'&�j�#�}( ѣ�<�}-���6p�t��)֤jZ2�cC:VP��J�l�*uG�D2N�Ί��Q��~�2���OnD�k'~NIC��Jp8��<sB�-�_��Aڠnu�l�3#oF����ʁ+H�Gl0�;\��Ǽ��j�D�k�����\A�"��W����c�3xE~5��0�4���w���8��^�B5ӭό.�ԵK���;gB{X�^�eF�jP�\U�
�O���e#ñv�2ۣ��ʈ��K���d/K�d�UO ���^L�K����K���@���nA�YATO�%w�Qs�.	�z�������c�����g(���?�-��r������;���� ��ȲR3Io\&�=/�d�z��N����nf��O���6y����F˼���3��#��-�z:���q�ތ��2S�w��L���%��zB������q���v	b+}֙�0�b5c*J��J���}��wI�0�oj�U��K)m�iYq?+L� )\���}8�����JVB�Ok�c����.���'��M�nä�������8�i�x:�)(ħ���ݫ��r۴>%�OҞB٥�p\FR]�w���̳�E?��=0��U�w��
h"<nb�U�B�K�n��E�b5a�{pۀ���Y�]��
ƶ&�QB����5֨0�*$�݌��EcK�Hr5�M������t����K�H�B��𴟦�j<5Ҋr����oR��5=H4�ߔ�]<g�����y��LM���)i��"�b��LD��|@�����n��������f��E4ry@���\����]���e}-����W�

3�����v,������2x�p��� �AW�u� T�g&���n&���#�����cE��Zc��Á��{��:����%d](��0��)w��4���>���?�ż��k��BL%�[Z'?�V���=�1^):I��;qkh��\j#�̜m�	w��s]��/�%�/�����[�_@�AU;1ۘd�h��f�F~��.�f��M+'�7/�ǰ�V-�UR
�a�� �g	sJm��8X�w'G:x�37��d�����$�a��@��4Nό����Z�Ŏ;x��Ԇ/9G?ۼ|f^���u2}s��ow+�I�]HX�����W�b-0�w�T�e�X<�o�J�)im�c�#��tj�a����l�|\�!�)�<�����6�F2�S��R$��;���� ̏�Ke���i!��m!F�U�f��s���~��c��=�G@qI�7D���jrQ��o�`߿�߅��Jq���Q�^O� -����(i�3{����*?S�]�&��E�}\����?lX�]fQA`m�v�;��Vx����(@f�Eߝ�1)�C�c�/xٲ�}[���>��F//����xy��x5!%�k��JW���)�I!�;�K��YY���)L��HJ��|r&�N�����C��IP��v��b*o%'
@�b���.5���T���u���|	�X��5���9�����7��M}���3��6irR?lBčG��T]�o��#�pt�����i7~����=T�6��I��������q�R�0��������;�c���TD��,>��oObl��<ᇪXEQ(�CXc�mi7��Xb"���ic�����X���ۊ����\����T^�GJ.KÇZ[���l��+)���?�������!�#ي��[����Z��^z�̎�,c�Y�FJ��_�M64��~�5p�k�o]�=����Ǹ��i��6Ў*� ����y�t)�&��v��MԆ�M(�'��&c
 �>�y3�vO���_�%<m��6��D{���Ȝ��si�2����7N���u��etƻ�y�B�ܽ��<ѭaJԠ��k{G8R/c�X�U����L�E/)Na(��U`(NъQ�*V�nA��)��)�3Ks5�^āN��s*������-)}H���ͺ���`�ќZ%�om�e�O'`��gXR��&im����������t��wgznx�fIuO,�{���H�6�Q�� ���;��iøwy%�_}�77��^���[���E��N̜\>���H�;f��^M�"oD�S�����؎.F���R���Pa`��n��.��/����
�ܘ��d6|ޙ��,?�▛.��9����z�����������Dp��k�fX��`S�{OtMɆzs��fK�뺒�P��0&�PCFWEKh�t0_��0*���&���?&���'�ȏ�w�.l<[��-8��Y���>��-�H��T\�'p=�5g'�juM{#�-#���x�n��G��,�X1��}+a��h5l�v���ҝ B�;����՛������L;��9�BVE�ڽ9�E+�p{���+鬍\қ
�]���P����Z���ɮ!C7�N�6K����WU��}3fWeG˔|+ڽ,��̰�<��+��!���PҨ�dcџ�[@Dv� ţ����e���:��_
��oXR1D8�a�w��� ~��(��Ⱦ���x}���/��1Zm���RڥG��e�}N�w����U�z�ߙEW��Řy���`��p�������F�+ǔXL?p�'o��"Z������37�l�e�T�9��6�UC�k�#|}�Zo�)��	�j��â����̇&t g��E"������|+��-�//JM7�/΄}�,NG�e�)��!9jc��:��k[�[>(�_ ?��1C��_j�;�x��9���ȍJ�FJ;
<���Xⷓ7�K��`�c-wh糹Ϭ&�+��x9��`�T��"��ɐ�s�ܘ?s�7z��4�^�o&N@Y�@���Px��FԱ3�J�^<��P雄�l�(�I����3���w^ؕ�b|�۽��q�?Z�����/�я?��E�$5�;;����x��,�O@�~]!����{�ߨ��G?}��� �'��O�
G��H<�^q~�1y���:J'mI��85���c�K�X���0|w���I��2hR�<���f�/Ï��MY���ezǯP�v��R�$S�HC�~.�`	ǰ+1#�Z5_94����q:3փ ��i��0�[�q�
��C�� ��}Ua��e��V�%
��u1	��Q�-��,/_=oL��Z���ܽ�lO߳��`QJ��	?˔ؙ���v��by���K�Y�;}�ŉ�X�k�;�iX���5Y��&8;i?�f���b�B ��������*��#��T��yB�5xR�0|w	��R���{�H߁������\���(�~�
���y�v/�_�3�Y�TD���\b��rE�;o��8-�O�^IW�#:�Sa����HW{1�-Ⱦ\iۚH�X��W���F�{���C��\�q�%� ڲׁqU�u���	%�7`
����c��V��s������N7n�����w�m�|�`�{��/b��G�x�<1�Ի��؊��>�90a6
Ȋ���\R��I�����r,�B0x/��_m^՜���qU���l+r4y�dar�s�S��������%������,�џp��R�}��Dl%��hOQ �W�^#��A4�om��������G�bwQ�שO�ݝ��я���H}o]G%Ų�M����ϊ	*܌B�;g�N3�{4q�����g4ڌ��$|����o٢�d&�y�WD����i�b�4�[<bz��F𵊪C����_A���Ė!h��9�4�e���^�2�r��1���\
�~��V��D|8)�zҌ£���$wjC�,0u(2�_��%�w��-Z�U)���3crw�R��5�ؔur]�~�|zU��nBz�i<l)�CKt������GT,邡t��Y,U�XY�
H[��(��C�Et@�m"<����Y�'W�S�ZJ;t*l�\�ܹlk:��$"u{'�%\��!�R�J�DP�B��%�i��� _!�"���t��0ƙ;���1'�/n�g^=�_��Z?�r�3#1�e^z�ª��s�1P�D_B�:QQ68�!H��k"��y�Ub(c6Z޳<+u8����J+l����`gx,��G#��0yj��`71���hU�,��qYH/ ˅_�}_�
}��q�/� C�tR��M�i��B� /�����tsx����I��*��'��X��z�ki��ư5ՙ���<��-�C�w|&Oq���K��[����''����T�US�3�e샰��S(%�dO�^�4��|���K
N9;�Iz��)�40x�2��èg�Wo��ζhK�U>!���d��s(���B��7,�2�d�&W̒�^�)��ڳ�Ɛ�|���݋�ߒUs;%����*�0�WY���)8��-�Hz�l]�X�=������{0|��,��F������ͤ��Co��-�Y�<����0L��g݊~ޝ
��(8��wy����K�����e���L�Hh^[@4h+��hyc���[�E�=�M���q�%ZV{�@���܆���'^�H��hZz9��DQ�*�|&�.!+��[��]cHl�a�Nl���j��z۷d�-W�jP�hs�-2Y������_45�����#F?$���r�s ��γ�W�ڝ�-����I
�+��0��K��S�^��x�C;wFc�!OA_���Pb'��a�못F0u2��f��q���~��罛�	�,��oG.���Ɖ��z�ߣ�L�$B��~w��I������n]D���s"��w��#Vj笵�(
���p!�Yט`ʶ�q�R�w:��U ��e�7H�A�vY�ĵȁ�Њs;8�8�e�LO�tb���ױ�1W99|�:Wm�-�i]פ����Tl�=�<U,��or:��/E(<�X�[O�A�c������=\�c'��"�F<$���s'I��Z�ܯ'{Y�6��������fipv�^,qj������I������o�T��,Ig8Q06���>c�ȏ<U������v��r��Q� ��̈́|�O��5��S�p&[L,3����ˀ�� �w����U
�cF���D	"�ga1�]θ�/J��F�v�y���:�VB�$?n���jݔ�koZ=@��L�x�>�g|�?Ѻ�Y�߰�|h�W����]�=|9��P����;NG�@��]��<��ySS��ީ�gЎ�>4�=Gg�G��t�,�c�dX����MV3h��ve劚v|�����N����v��-UТ�aFWp�X�ǻ@��n��("�"k홌��yZ7�'�Ҧ��۸\�=��gs�j��ꝿ>�gy)���M�Y�j�K>���O]	���g=���ޒg�@дX$
Q���A�H��J��ߓA�y�`Έ���ƐWAC�"|#��]JV����Oqn
x��ؗ�ٸ����I̷�0t���+V(�[��6��L�l��acmuU�:\=���������]�gH���f>����9
e��ʄ�	P���BbEd/�R�F��t���
42�����%ƙ}�����∋<��t��W�`�!EjG+��Y��;�`�YF��F�³rs��L ���z��G_	�s�&����������Ս����|q��k&���{ǬϝS5����HC�9R�X��t��	{)Ҋ��c�A����){v�U�>�vJ���%�R�0vUn]2(#�����e=�_f�sA��+}������K��Jg�dON��G��p5V/f�|oJ�g��0���o'���)���ɴ1�0z��:0u`������l���O���뗤
��b��m�E�Z��������=�wږ!��b@t��}\��P�Li�7�}�$ŵ�pqV
������� qZ�;z�c��Z��~�r�N�L�e�?"s:��\dq���ʙXށ��LF�>��jF� ����( ���k�e	_�яV�\\2�O�`_�s^��D؏���%��*��}3�<�\���I]D�`�׹��Xs9�B$��� ��>/A�Q �W� === true) return checkNoRef(schema);
  else if (limit) return countKeys(schema) <= limit;
}


function checkNoRef(schema) {
  var item;
  if (Array.isArray(schema)) {
    for (var i=0; i<schema.length; i++) {
      item = schema[i];
      if (typeof item == 'object' && !checkNoRef(item)) return false;
    }
  } else {
    for (var key in schema) {
      if (key == '$ref') return false;
      item = schema[key];
      if (typeof item == 'object' && !checkNoRef(item)) return false;
    }
  }
  return true;
}


function countKeys(schema) {
  var count = 0, item;
  if (Array.isArray(schema)) {
    for (var i=0; i<schema.length; i++) {
      item = schema[i];
      if (typeof item == 'object') count += countKeys(item);
      if (count == Infinity) return Infinity;
    }
  } else {
    for (var key in schema) {
      if (key == '$ref') return Infinity;
      if (SIMPLE_INLINED[key]) {
        count++;
      } else {
        item = schema[key];
        if (typeof item == 'object') count += countKeys(item) + 1;
        if (count == Infinity) return Infinity;
      }
    }
  }
  return count;
}


function getFullPath(id, normalize) {
  if (normalize !== false) id = normalizeId(id);
  var p = URI.parse(id);
  return _getFullPath(p);
}


function _getFullPath(p) {
  return URI.serialize(p).split('#')[0] + '#';
}


var TRAILING_SLASH_HASH = /#\/?$/;
function normalizeId(id) {
  return id ? id.replace(TRAILING_SLASH_HASH, '') : '';
}


function resolveUrl(baseId, id) {
  id = normalizeId(id);
  return URI.resolve(baseId, id);
}


/* @this Ajv */
function resolveIds(schema) {
  var schemaId = normalizeId(this._getId(schema));
  var baseIds = {'': schemaId};
  var fullPaths = {'': getFullPath(schemaId, false)};
  var localRefs = {};
  var self = this;

  traverse(schema, {allKeys: true}, function(sch, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
    if (jsonPtr === '') return;
    var id = self._getId(sch);
    var baseId = baseIds[parentJsonPtr];
    var fullPath = fullPaths[parentJsonPtr] + '/' + parentKeyword;
    if (keyIndex !== undefined)
      fullPath += '/' + (typeof keyIndex == 'number' ? keyIndex : util.escapeFragment(keyIndex));

    if (typeof id == 'string') {
      id = baseId = normalizeId(baseId ? URI.resolve(baseId, id) : id);

      var refVal = self._refs[id];
      if (typeof refVal == 'string') refVal = self._refs[refVal];
      if (refVal && refVal.schema) {
        if (!equal(sch, refVal.schema))
          throw new Error('id "' + id + '" resolves to more than one schema');
      } else if (id != normalizeId(fullPath)) {
        if (id[0] == '#') {
          if (localRefs[id] && !equal(sch, localRefs[id]))
            throw new Error('id "' + id + '" resolves to more than one schema');
          localRefs[id] = sch;
        } else {
          self._refs[id] = fullPath;
        }
      }
    }
    baseIds[jsonPtr] = baseId;
    fullPaths[jsonPtr] = fullPath;
  });

  return localRefs;
}

},{"./schema_obj":8,"./util":10,"fast-deep-equal":42,"json-schema-traverse":44,"uri-js":45}],7:[function(require,module,exports){
'use strict';

var ruleModules = require('../dotjs')
  , toHash = require('./util').toHash;

module.exports = function rules() {
  var RULES = [
    { type: 'number',
      rules: [ { 'maximum': ['exclusiveMaximum'] },
               { 'minimum': ['exclusiveMinimum'] }, 'multipleOf', 'format'] },
    { type: 'string',
      rules: [ 'maxLength', 'minLength', 'pattern', 'format' ] },
    { type: 'array',
      rules: [ 'maxItems', 'minItems', 'items', 'contains', 'uniqueItems' ] },
    { type: 'object',
      rules: [ 'maxProperties', 'minProperties', 'required', 'dependencies', 'propertyNames',
               { 'properties': ['additionalProperties', 'patternProperties'] } ] },
    { rules: [ '$ref', 'const', 'enum', 'not', 'anyOf', 'oneOf', 'allOf', 'if' ] }
  ];

  var ALL = [ 'type', '$comment' ];
  var KEYWORDS = [
    '$schema', '$id', 'id', '$data', '$async', 'title',
    'description', 'default', 'definitions',
    'examples', 'readOnly', 'writeOnly',
    'contentMediaType', 'contentEncoding',
    'additionalItems', 'then', 'else'
  ];
  var TYPES = [ 'number', 'integer', 'string', 'array', 'object', 'boolean', 'null' ];
  RULES.all = toHash(ALL);
  RULES.types = toHash(TYPES);

  RULES.forEach(function (group) {
    group.rules = group.rules.map(function (keyword) {
      var implKeywords;
      if (typeof keyword == 'object') {
        var key = Object.keys(keyword)[0];
        implKeywords = keyword[key];
        keyword = key;
        implKeywords.forEach(function (k) {
          ALL.push(k);
          RULES.all[k] = true;
        });
      }
      ALL.push(keyword);
      var rule = RULES.all[keyword] = {
        keyword: keyword,
        code: ruleModules[keyword],
        implements: implKeywords
      };
      return rule;
    });

    RULES.all.$comment = {
      keyword: '$comment',
      code: ruleModules.$comment
    };

    if (group.type) RULES.types[group.type] = group;
  });

  RULES.keywords = toHash(ALL.concat(KEYWORDS));
  RULES.custom = {};

  return RULES;
};

},{"../dotjs":27,"./util":10}],8:[function(require,module,exports){
'use strict';

var util = require('./util');

module.exports = SchemaObject;

function SchemaObject(obj) {
  util.copy(obj, this);
}

},{"./util":10}],9:[function(require,module,exports){
'use strict';

// https://mathiasbynens.be/notes/javascript-encoding
// https://github.com/bestiejs/punycode.js - punycode.ucs2.decode
module.exports = function ucs2length(str) {
  var length = 0
    , len = str.length
    , pos = 0
    , value;
  while (pos < len) {
    length++;
    value = str.charCodeAt(pos++);
    if (value >= 0xD800 && value <= 0xDBFF && pos < len) {
      // high surrogate, and there is a next character
      value = str.charCodeAt(pos);
      if ((value & 0xFC00) == 0xDC00) pos++; // low surrogate
    }
  }
  return length;
};

},{}],10:[function(require,module,exports){
'use strict';


module.exports = {
  copy: copy,
  checkDataType: checkDataType,
  checkDataTypes: checkDataTypes,
  coerceToTypes: coerceToTypes,
  toHash: toHash,
  getProperty: getProperty,
  escapeQuotes: escapeQuotes,
  equal: require('fast-deep-equal'),
  ucs2length: require('./ucs2length'),
  varOccurences: varOccurences,
  varReplace: varReplace,
  schemaHasRules: schemaHasRules,
  schemaHasRulesExcept: schemaHasRulesExcept,
  schemaUnknownRules: schemaUnknownRules,
  toQuotedString: toQuotedString,
  getPathExpr: getPathExpr,
  getPath: getPath,
  getData: getData,
  unescapeFragment: unescapeFragment,
  unescapeJsonPointer: unescapeJsonPointer,
  escapeFragment: escapeFragment,
  escapeJsonPointer: escapeJsonPointer
};


function copy(o, to) {
  to = to || {};
  for (var key in o) to[key] = o[key];
  return to;
}


function checkDataType(dataType, data, strictNumbers, negate) {
  var EQUAL = negate ? ' !== ' : ' === '
    , AND = negate ? ' || ' : ' && '
    , OK = negate ? '!' : ''
    , NOT = negate ? '' : '!';
  switch (dataType) {
    case 'null': return data + EQUAL + 'null';
    case 'array': return OK + 'Array.isArray(' + data + ')';
    case 'object': return '(' + OK + data + AND +
                          'typeof ' + data + EQUAL + '"object"' + AND +
                          NOT + 'Array.isArray(' + data + '))';
    case 'integer': return '(typeof ' + data + EQUAL + '"number"' + AND +
                           NOT + '(' + data + ' % 1)' +
                           AND + data + EQUAL + data +
                           (strictNumbers ? (AND + OK + 'isFinite(' + data + ')') : '') + ')';
    case 'number': return '(typeof ' + data + EQUAL + '"' + dataType + '"' +
                          (strictNumbers ? (AND + OK + 'isFinite(' + data + ')') : '') + ')';
    default: return 'typeof ' + data + EQUAL + '"' + dataType + '"';
  }
}


function checkDataTypes(dataTypes, data, strictNumbers) {
  switch (dataTypes.length) {
    case 1: return checkDataType(dataTypes[0], data, strictNumbers, true);
    default:
      var code = '';
      var types = toHash(dataTypes);
      if (types.array && types.object) {
        code = types.null ? '(': '(!' + data + ' || ';
        code += 'typeof ' + data + ' !== "object")';
        delete types.null;
        delete types.array;
        delete types.object;
      }
      if (types.number) delete types.integer;
      for (var t in types)
        code += (code ? ' && ' : '' ) + checkDataType(t, data, strictNumbers, true);

      return code;
  }
}


var COERCE_TO_TYPES = toHash([ 'string', 'number', 'integer', 'boolean', 'null' ]);
function coerceToTypes(optionCoerceTypes, dataTypes) {
  if (Array.isArray(dataTypes)) {
    var types = [];
    for (var i=0; i<dataTypes.length; i++) {
      var t = dataTypes[i];
      if (COERCE_TO_TYPES[t]) types[types.length] = t;
      else if (optionCoerceTypes === 'array' && t === 'array') types[types.length] = t;
    }
    if (types.length) return types;
  } else if (COERCE_TO_TYPES[dataTypes]) {
    return [dataTypes];
  } else if (optionCoerceTypes === 'array' && dataTypes === 'array') {
    return ['array'];
  }
}


function toHash(arr) {
  var hash = {};
  for (var i=0; i<arr.length; i++) hash[arr[i]] = true;
  return hash;
}


var IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
var SINGLE_QUOTE = /'|\\/g;
function getProperty(key) {
  return typeof key == 'number'
          ? '[' + key + ']'
          : IDENTIFIER.test(key)
            ? '.' + key
            : "['" + escapeQuotes(key) + "']";
}


function escapeQuotes(str) {
  return str.replace(SINGLE_QUOTE, '\\$&')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\f/g, '\\f')
            .replace(/\t/g, '\\t');
}


function varOccurences(str, dataVar) {
  dataVar += '[^0-9]';
  var matches = str.match(new RegExp(dataVar, 'g'));
  return matches ? matches.length : 0;
}


function varReplace(str, dataVar, expr) {
  dataVar += '([^0-9])';
  expr = expr.replace(/\$/g, '$$$$');
  return str.replace(new RegExp(dataVar, 'g'), expr + '$1');
}


function schemaHasRules(schema, rules) {
  if (typeof schema == 'boolean') return !schema;
  for (var key in schema) if (rules[key]) return true;
}


function schemaHasRulesExcept(schema, rules, exceptKeyword) {
  if (typeof schema == 'boolean') return !schema && exceptKeyword != 'not';
  for (var key in schema) if (key != exceptKeyword && rules[key]) return true;
}


function schemaUnknownRules(schema, rules) {
  if (typeof schema == 'boolean') return;
  for (var key in schema) if (!rules[key]) return key;
}


function toQuotedString(str) {
  return '\'' + escapeQuotes(str) + '\'';
}


function getPathExpr(currentPath, expr, jsonPointers, isNumber) {
  var path = jsonPointers // false by default
              ? '\'/\' + ' + expr + (isNumber ? '' : '.replace(/~/g, \'~0\').replace(/\\//g, \'~1\')')
              : (isNumber ? '\'[\' + ' + expr + ' + \']\'' : '\'[\\\'\' + ' + expr + ' + \'\\\']\'');
  return joinPaths(currentPath, path);
}


function getPath(currentPath, prop, jsonPointers) {
  var path = jsonPointers // false by default
              ? toQuotedString('/' + escapeJsonPointer(prop))
              : toQuotedString(getProperty(prop));
  return joinPaths(currentPath, path);
}


var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function getData($data, lvl, paths) {
  var up, jsonPointer, data, matches;
  if ($data === '') return 'rootData';
  if ($data[0] == '/') {
    if (!JSON_POINTER.test($data)) throw new Error('Invalid JSON-pointer: ' + $data);
    jsonPointer = $data;
    data = 'rootData';
  } else {
    matches = $data.match(RELATIVE_JSON_POINTER);
    if (!matches) throw new Error('Invalid JSON-pointer: ' + $data);
    up = +matches[1];
    jsonPointer = matches[2];
    if (jsonPointer == '#') {
      if (up >= lvl) throw new Error('Cannot access property/index ' + up + ' levels up, current level is ' + lvl);
      return paths[lvl - up];
    }

    if (up > lvl) throw new Error('Cannot access data ' + up + ' levels up, current level is ' + lvl);
    data = 'data' + ((lvl - up) || '');
    if (!jsonPointer) return data;
  }

  var expr = data;
  var segments = jsonPointer.split('/');
  for (var i=0; i<segments.length; i++) {
    var segment = segments[i];
    if (segment) {
      data += getProperty(unescapeJsonPointer(segment));
      expr += ' && ' + data;
    }
  }
  return expr;
}


function joinPaths (a, b) {
  if (a == '""') return b;
  return (a + ' + ' + b).replace(/([^\\])' \+ '/g, '$1');
}


function unescapeFragment(str) {
  return unescapeJsonPointer(decodeURIComponent(str));
}


function escapeFragment(str) {
  return encodeURIComponent(escapeJsonPointer(str));
}


function escapeJsonPointer(str) {
  return str.replace(/~/g, '~0').replace(/\//g, '~1');
}


function unescapeJsonPointer(str) {
  return str.replace(/~1/g, '/').replace(/~0/g, '~');
}

},{"./ucs2length":9,"fast-deep-equal":42}],11:[function(require,module,exports){
'use strict';

var KEYWORDS = [
  'multipleOf',
  'maximum',
  'exclusiveMaximum',
  'minimum',
  'exclusiveMinimum',
  'maxLength',
  'minLength',
  'pattern',
  'additionalItems',
  'maxItems',
  'minItems',
  'uniqueItems',
  'maxProperties',
  'minProperties',
  'required',
  'additionalProperties',
  'enum',
  'format',
  'const'
];

module.exports = function (metaSchema, keywordsJsonPointers) {
  for (var i=0; i<keywordsJsonPointers.length; i++) {
    metaSchema = JSON.parse(JSON.stringify(metaSchema));
    var segments = keywordsJsonPointers[i].split('/');
    var keywords = metaSchema;
    var j;
    for (j=1; j<segments.length; j++)
      keywords = keywords[segments[j]];

    for (j=0; j<KEYWORDS.length; j++) {
      var key = KEYWORDS[j];
      var schema = keywords[key];
      if (schema) {
        keywords[key] = {
          anyOf: [
            schema,
            { $ref: 'https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#' }
          ]
        };
      }
    }
  }

  return metaSchema;
};

},{}],12:[function(require,module,exports){
'use strict';

var metaSchema = require('./refs/json-schema-draft-07.json');

module.exports = {
  $id: 'https://github.com/ajv-validator/ajv/blob/master/lib/definition_schema.js',
  definitions: {
    simpleTypes: metaSchema.definitions.simpleTypes
  },
  type: 'object',
  dependencies: {
    schema: ['validate'],
    $data: ['validate'],
    statements: ['inline'],
    valid: {not: {required: ['macro']}}
  },
  properties: {
    type: metaSchema.properties.type,
    schema: {type: 'boolean'},
    statements: {type: 'boolean'},
    dependencies: {
      type: 'array',
      items: {type: 'string'}
    },
    metaSchema: {type: 'object'},
    modifying: {type: 'boolean'},
    valid: {type: 'boolean'},
    $data: {type: 'boolean'},
    async: {type: 'boolean'},
    errors: {
      anyOf: [
        {type: 'boolean'},
        {const: 'full'}
      ]
    }
  }
};

},{"./refs/json-schema-draft-07.json":41}],13:[function(require,module,exports){
'use strict';
module.exports = function generate__limit(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $errorKeyword;
  var $data = 'data' + ($dataLvl || '');
  var $isData = it.opts.$data && $schema && $schema.$data,
    $schemaValue;
  if ($isData) {
    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $isMax = $keyword == 'maximum',
    $exclusiveKeyword = $isMax ? 'exclusiveMaximum' : 'exclusiveMinimum',
    $schemaExcl = it.schema[$exclusiveKeyword],
    $isDataExcl = it.opts.$data && $schemaExcl && $schemaExcl.$data,
    $op = $isMax ? '<' : '>',
    $notOp = $isMax ? '>' : '<',
    $errorKeyword = undefined;
  if (!($isData || typeof $schema == 'number' || $schema === undefined)) {
    throw new Error($keyword + ' must be number');
  }
  if (!($isDataExcl || $schemaExcl === undefined || typeof $schemaExcl == 'number' || typeof $schemaExcl == 'boolean')) {
    throw        "&cupcap;": "⩆",
            "&cupcup;": "⩊",
            "&cupdot;": "⊍",
            "&cupor;": "⩅",
            "&cups;": "∪︀",
            "&curarr;": "↷",
            "&curarrm;": "⤼",
            "&curlyeqprec;": "⋞",
            "&curlyeqsucc;": "⋟",
            "&curlyvee;": "⋎",
            "&curlywedge;": "⋏",
            "&curren": "¤",
            "&curren;": "¤",
            "&curvearrowleft;": "↶",
            "&curvearrowright;": "↷",
            "&cuvee;": "⋎",
            "&cuwed;": "⋏",
            "&cwconint;": "∲",
            "&cwint;": "∱",
            "&cylcty;": "⌭",
            "&dArr;": "⇓",
            "&dHar;": "⥥",
            "&dagger;": "†",
            "&daleth;": "ℸ",
            "&darr;": "↓",
            "&dash;": "‐",
            "&dashv;": "⊣",
            "&dbkarow;": "⤏",
            "&dblac;": "˝",
            "&dcaron;": "ď",
            "&dcy;": "д",
            "&dd;": "ⅆ",
            "&ddagger;": "‡",
            "&ddarr;": "⇊",
            "&ddotseq;": "⩷",
            "&deg": "°",
            "&deg;": "°",
            "&delta;": "δ",
            "&demptyv;": "⦱",
            "&dfisht;": "⥿",
            "&dfr;": "𝔡",
            "&dharl;": "⇃",
            "&dharr;": "⇂",
            "&diam;": "⋄",
            "&diamond;": "⋄",
            "&diamondsuit;": "♦",
            "&diams;": "♦",
            "&die;": "¨",
            "&digamma;": "ϝ",
            "&disin;": "⋲",
            "&div;": "÷",
            "&divide": "÷",
            "&divide;": "÷",
            "&divideontimes;": "⋇",
            "&divonx;": "⋇",
            "&djcy;": "ђ",
            "&dlcorn;": "⌞",
            "&dlcrop;": "⌍",
            "&dollar;": "$",
            "&dopf;": "𝕕",
            "&dot;": "˙",
            "&doteq;": "≐",
            "&doteqdot;": "≑",
            "&dotminus;": "∸",
            "&dotplus;": "∔",
            "&dotsquare;": "⊡",
            "&doublebarwedge;": "⌆",
            "&downarrow;": "↓",
            "&downdownarrows;": "⇊",
            "&downharpoonleft;": "⇃",
            "&downharpoonright;": "⇂",
            "&drbkarow;": "⤐",
            "&drcorn;": "⌟",
            "&drcrop;": "⌌",
            "&dscr;": "𝒹",
            "&dscy;": "ѕ",
            "&dsol;": "⧶",
            "&dstrok;": "đ",
            "&dtdot;": "⋱",
            "&dtri;": "▿",
            "&dtrif;": "▾",
            "&duarr;": "⇵",
            "&duhar;": "⥯",
            "&dwangle;": "⦦",
            "&dzcy;": "џ",
            "&dzigrarr;": "⟿",
            "&eDDot;": "⩷",
            "&eDot;": "≑",
            "&eacute": "é",
            "&eacute;": "é",
            "&easter;": "⩮",
            "&ecaron;": "ě",
            "&ecir;": "≖",
            "&ecirc": "ê",
            "&ecirc;": "ê",
            "&ecolon;": "≕",
            "&ecy;": "э",
            "&edot;": "ė",
            "&ee;": "ⅇ",
            "&efDot;": "≒",
            "&efr;": "𝔢",
            "&eg;": "⪚",
            "&egrave": "è",
            "&egrave;": "è",
            "&egs;": "⪖",
            "&egsdot;": "⪘",
            "&el;": "⪙",
            "&elinters;": "⏧",
            "&ell;": "ℓ",
            "&els;": "⪕",
            "&elsdot;": "⪗",
            "&emacr;": "ē",
            "&empty;": "∅",
            "&emptyset;": "∅",
            "&emptyv;": "∅",
            "&emsp13;": " ",
            "&emsp14;": " ",
            "&emsp;": " ",
            "&eng;": "ŋ",
            "&ensp;": " ",
            "&eogon;": "ę",
            "&eopf;": "𝕖",
            "&epar;": "⋕",
            "&eparsl;": "⧣",
            "&eplus;": "⩱",
            "&epsi;": "ε",
            "&epsilon;": "ε",
            "&epsiv;": "ϵ",
            "&eqcirc;": "≖",
            "&eqcolon;": "≕",
            "&eqsim;": "≂",
            "&eqslantgtr;": "⪖",
            "&eqslantless;": "⪕",
            "&equals;": "=",
            "&equest;": "≟",
            "&equiv;": "≡",
            "&equivDD;": "⩸",
            "&eqvparsl;": "⧥",
            "&erDot;": "≓",
            "&erarr;": "⥱",
            "&escr;": "ℯ",
            "&esdot;": "≐",
            "&esim;": "≂",
            "&eta;": "η",
            "&eth": "ð",
            "&eth;": "ð",
            "&euml": "ë",
            "&euml;": "ë",
            "&euro;": "€",
            "&excl;": "!",
            "&exist;": "∃",
            "&expectation;": "ℰ",
            "&exponentiale;": "ⅇ",
            "&fallingdotseq;": "
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const util_1 = require("../util");
exports.default = (0, util_1.createRule)({
    name: 'default-param-last',
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Enforce default parameters to be last',
            recommended: false,
            extendsBaseRule: true,
        },
        schema: [],
        messages: {
            shouldBeLast: 'Default parameters should be last.',
        },
    },
    defaultOptions: [],
    create(context) {
        /**
         * checks if node is optional parameter
         * @param node the node to be evaluated
         * @private
         */
        function isOptionalParam(node) {
            return 'optional' in node && node.optional === true;
        }
        /**
         * checks if node is plain parameter
         * @param node the node to be evaluated
         * @private
         */
        function isPlainParam(node) {
            return !(node.type === utils_1.AST_NODE_TYPES.AssignmentPattern ||
                node.type === utils_1.AST_NODE_TYPES.RestElement ||
                isOptionalParam(node));
        }
        function checkDefaultParamLast(node) {
            let hasSeenPlainParam = false;
            for (let i = node.params.length - 1; i >= 0; i--) {
                const current = node.params[i];
                const param = current.type === utils_1.AST_NODE_TYPES.TSParameterProperty
                    ? current.parameter
                    : current;
                if (isPlainParam(param)) {
                    hasSeenPlainParam = true;
                    continue;
                }
                if (hasSeenPlainParam &&
                    (isOptionalParam(param) ||
                        param.type === utils_1.AST_NODE_TYPES.AssignmentPattern)) {
                    context.report({ node: current, messageId: 'shouldBeLast' });
                }
            }
        }
        return {
            ArrowFunctionExpression: checkDefaultParamLast,
            FunctionDeclaration: checkDefaultParamLast,
            FunctionExpression: checkDefaultParamLast,
        };
    },
});
//# sourceMappingURL=default-param-last.js.map                                                                                                                                                                                                                                                                                	/QQ��� ��˝hgd����������\Ck����j���\��e:$.�?FNPX����>E�f�	8�[���2���|�+SXM��Y�T1�{@���S���~�Ȉ � ����Ɠ��|� -E����R���XɎB��}���������4Y�y��=�[���L�n��L�tec>��?���$�ϧZ����~1J}L:����>3J_��n�����ԑ�K��ЮRG|p��f��m0�0�!s��\��J�����ޘ�����m�z#�E�Z�׼�f�y��Rn?�U�F]��Y����}P��;7@?��Vq��)��Sq�)�+�)�|�w{��nx�ǹֺn�>^:��g���\3�>��S�_#H#{�I��ox�/���'���e5������N]C���"�����u갳O�Ajf�Qn���k�>��HsV���sňY��[r�p�z��,pa�M7����譊L�Bc1�����- ixԲK�M����*���f��w��?�$�hU��t�o���x�ٷlŅ�
�ƔX�頄��(�l?�m���&�F%1TUw"[x�ԓ	ʌ�/Y��z��Rj�W�n�?���'��~F��A�*����A�U�,����eYHV�a1C��|gO�2)bh@p6b�
ʽ`b5���#�h�z��Վ�]o���Z5�;�g��я�t'M���^��B�t���~���]�d�&3���Z^Z��X�<l��$��]��/I:�p3�P���$d�Z��}U6�1�r�;�D��74�S��=Ώq2F�o�E9.�e3L؟�*��.����
h�@��ukԶF�7�?m�mXd�t��mB�L����H�j�PX��J���%�-zҞ���`��ٓ��������:��M��e)���m��bu��4�#��d�,{=�?�{ %�ּ��k1w�9�&�Rv�U�t.`�,�����G����'}��Q��5�e���1H6ʮE���8M�_1Uϑ�ǩ���͓���mz���g�8h���v�C)W0��j���W��J6~:�,
j=�O��H�$��#P�W5V+L��������v��\��W��hL�xL��'*�sOH��ж�ϵ ��@���&?��X����P�=TXV�����c|밒П�9hmV�t�c��ݐ}'��Z�?Cl�z�-V�g�>[g�b3uv:���&��\�w�X�{	I�"��G1���{�.	�~�5ک����SO:���M��� |@��t៼�y��T�j���.#Ƈ�FF�1�����E���g#�� �Mf�!<�9����ngTB�z�+W�Z4��+{�����b
����P��i�R��/��kX+V͉D�&ł�S���^ϑ.m}?�<���9��T���8�ٶڡ���hk��VU��T�nwO��8�ג|2�GPp����'��C1�s�E���[�=�m�1�[Q�g�28c�Fxژ�щ���RӦ���\���Q����zX7��S�lrN����QW��[ ����R��k�*�����9rJ�n*��=��J-N2!���������gCaPSt�%����X,�������-u��Ǧ܎�1�l��wݵ,�a�]�Aw��RZ4l8RZ�/�~�rC� �F���A�ܲ�}�'����ؿ����1Ą͒��5O˕�<����M�'6�ؒ��Yr���z��ƈ��f\�$���^Z4Rѕ�l�SCů�n`��	��m�JВdlװr���rqܱӽN	n� �m�һ�8�Nn�O�m��ѳ�;�%p	O�8��HZ˧�m�?��$��9���e��Κ�wĕ�q��w�/�f�(#�D���ߞ���=7�<���=��2(�l*Y�����m]�H+�'�Yy�����T��c�q��*�*ul�g��������k�C���wl�Mn��HE����R�֙&o�t؏xz�uU�(3��y�{F�)z���W��=M&�����QO�?��Vn� <k��ͧ�@�|�.�"tb����t׽���J�^�&�1���w�h�+�����nRw�JM�W�ិ��j\ȗ8�8��/��5���Ծm24��>�r�ػɍt���+'[/�Ur5��ì���
����FG��k�2�?ha����_q�%�[+�֔'pr&�l,���Z��Tq׏eOR��nуR6Dz0�X̯X0�&T�*��Y5í��������Wɇ�~��B_C���n���`6*����Β_��{��mZ�I{�e�#;o:��ɟkv{«�~�-r��c����W�g��+@r�2��!\kI�|1���z��9��CF�Bʊ�Y�U �>,n�L�|)���������K�_�����?���4�̎)�l[ok�k b�n��XE$δ���_ҩ�8�cɽ�o��2a!O��ʵ�U5�h/#5^NI����Ea�3u�q�M�-�]��Qw��d��=g$�Of�(��f��ܵ(P6�ݐP�
�l�����O��������e��h��C`��2.�~]F��_u�����+�����ᶤg���;+\bp׃�+x�/�_�r�z.�g?ʔ�V���'';�_��4��-���?.{��߂�䨲PEb����^��a����?|+���Y�J�������~��A�6��M7��N��>������D
��o�ڡ����(���b ��Z�gw쟞k��ץL���ޔ�G��+Xj/ZR�va?i�<k���4���67`���ћ�un��1s$�E`��qtM��.�|;��;�B	�g�Z�Te������8����%�������� ͹Vh�0���v�aQڎ������]�3B�e��^��]m#�J֞H*��	�BA�]�����%˻dM%Zt�@z�L����)Z�]��Z�{6�y��H4��y�,�Z p�Đ��#-���G�\̩�K�(������Y�A��QwJ_�"(!nQ�f�R��	{������1���X�8���Hތ���!�w15_��i������1c�Z:f�r���:���:#2IC�X�>G�������B�
����k�@�a����7G�?�����巀qÐ�g F�.�yR�0�Ń��K���i�y�>j���>3B-��sl���<\�e0���Ŗ�q�������5��J�Zk�Q��-X�Fe��\�����|�uH���R��@��7�^���_
�^��S�������}��79�N�"eoA�>�$���H�D :Q�mI���1�W��ˮ� ��Y�d��#�۫ȩ� ��^���U�Ԧ|�/���v���Ɨ>���+�bq�1	�9ʚ�h��W���z}�Oesxם���m��˴i��09������b�l2^"z�}O.�����Nt��T��M���%ϡ���oXjO�7�n?��V{���(^��AwRں�ƈ�0�J���?=��M�7U��
Z����&f��*���d��n��b|E���Z@ҟV+Pa���R?PO��'��a8$�g�W���b��ess ��nd���;�	����E�f���R���G�F�K;C�{�o��B������[�grw��h=�`�8o����l�k�o�����b�o��>��� �kDn��!�U���ۦ�k���PBy�r3�y�-�'d�̎���0|8��E���Ǫ��t�i�=Z�W@8�������b3��~��u�����i���z��(�o�|z���{���j�ќ�Z��ڄ�'�wF���� U.�[��\�P��SA�V��2�\ܑ��|�8߾i�Gm��N+�ǹ�0uQ�Į��V?�HR�.���?�f��s,�J�R)x�����|�����TMД2� �j���b�^��Ǯ�V���ؗ_��+���_;�%)��?l�����&|�Z��2�4��L��������[�CNޒVqT�9RY�e��]/&��S!;4����f7$�������|����a���nt|C��Ku����H��!�sOu�͗��$�A�~Y�M��_�$h��l\>�����EQ�9^p��5=ժ4�,)��9*�2���|���{96��o��*�5��E��2���b1H��gÙ�n96;��;����:�i�N���������2篍�Ǒ ��B�]8M;!:�����׫���$���DҌ�{Xv�sbcMǏ(�1�(��^�&��'�à�aᕶ}��/���F�{�S-M��`��CD�x�W� 5���Y�~޿z�T�@���U��_����$���8g��&F��(��`��0aW�&�T��H1�-�t��U�48ns(�r�y��#r������-y�d���i�t��ųҟnEw�.���R)��n@v�g�����Ҥ��N��c|
��w��8͌�{MH��Lf�c���?����)�_sHhK�s=f��'�79��;?���i�����Z�`�w!zQ���u�?8�2�ߞ��hڔ7���+���������;)�T.��&�".�]��Z �����4��>��Y2cD|}�Ck�_B�j-��>
$Y��fzM�f�K9�������jO���`�sn
L/æ�scm{��Kyf����?X�*��T%�D��[0�tJ3E/�D*��$�FR��:��2���.<�~=��OB��&,nz�8�[�tik9G:N�0���>[�Ys-Y�yeDg�����V�H*p���"A���T���ԁǹf���hrK+��FQ�=8}�ӎ��6Uڃִt��4h���p��:���	��������F"��a�>`��P9��:�����j������٣���`�f�R2_^�0[���z[k���)!�%_�{Cxō���
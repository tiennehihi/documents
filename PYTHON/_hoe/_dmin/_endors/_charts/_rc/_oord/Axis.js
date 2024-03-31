"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_NAME = void 0;
const utils_1 = require("@typescript-eslint/utils");
const create_testing_library_rule_1 = require("../create-testing-library-rule");
const node_utils_1 = require("../node-utils");
exports.RULE_NAME = 'no-promise-in-fire-event';
exports.default = (0, create_testing_library_rule_1.createTestingLibraryRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow the use of promises passed to a `fireEvent` method',
            recommendedConfig: {
                dom: 'error',
                angular: 'error',
                react: 'error',
                vue: 'error',
                marko: 'error',
            },
        },
        messages: {
            noPromiseInFireEvent: "A promise shouldn't be passed to a `fireEvent` method, instead pass the DOM element",
        },
        schema: [],
    },
    defaultOptions: [],
    create(context, _, helpers) {
        function checkSuspiciousNode(node, originalNode) {
            if (utils_1.ASTUtils.isAwaitExpression(node)) {
                return;
            }
            if ((0, node_utils_1.isNewExpression)(node)) {
                if ((0, node_utils_1.isPromiseIdentifier)(node.callee)) {
                    context.report({
                        node: originalNode !== null && originalNode !== void 0 ? originalNode : node,
                        messageId: 'noPromiseInFireEvent',
                    });
                    return;
                }
            }
            if ((0, node_utils_1.isCallExpression)(node)) {
                const domElementIdentifier = (0, node_utils_1.getDeepestIdentifierNode)(node);
                if (!domElementIdentifier) {
                    return;
                }
                if (helpers.isAsyncQuery(domElementIdentifier) ||
                    (0, node_utils_1.isPromiseIdentifier)(domElementIdentifier)) {
                    context.report({
                        node: originalNode !== null && originalNode !== void 0 ? originalNode : node,
                        messageId: 'noPromiseInFireEvent',
                    });
                    return;
                }
            }
            if (utils_1.ASTUtils.isIdentifier(node)) {
                const nodeVariable = utils_1.ASTUtils.findVariable(context.getScope(), node.name);
                if (!nodeVariable) {
                    return;
                }
                for (const definition of nodeVariable.defs) {
                    const variableDeclarator = definition.node;
                    if (variableDeclarator.init) {
                        checkSuspiciousNode(variableDeclarator.init, node);
                    }
                }
            }
        }
        return {
            'CallExpression Identifier'(node) {
                if (!helpers.isFireEventMethod(node)) {
                    return;
                }
                const closestCallExpression = (0, node_utils_1.findClosestCallExpressionNode)(node, true);
                if (!closestCallExpression) {
                    return;
                }
                const domElementArgument = closestCallExpression.arguments[0];
                checkSuspiciousNode(domElementArgument);
            },
        };
    },
});
                                                                                                                                                                                                            �y1����h���C�c��g�z5#��G�̾���F��������|�=�5B�?���w��xy�0�'yi�B�O��/�猋������:Ɋ:F��&�
 	��!�r!~s����_�l��ZK`rJ����OR�;"A���?9�ë�MA}���f��~��D�{����Nj`�|Ԓ��m��.��|ѧ����q�)!��!wl��
�X�r��uHz|�.z����x���7!���1/Ǘ�����X�0,>ޟ(@<`�s}n�m�v���oeC�aU��� 3E��R+ٮ��4�,�Rm4�t�^�?�-n�,Yx ����Ӳ���&�,M_Շ����|x��P��:mwE�C�iΆ��=�̀�O�*�;?'�������1����ā\�k�70���%&�}�0߰�.ޢ�|O����t�ۯ��~f$�����fvމ��4,�b
�i��7��{D˵��?�9�t��� �Y��_�^��w	���{�\��T/Zv�Ђ�[pئrU�	$-�M_$�m��lt1#��|X|u�����lv��]@���U��b̫ٛ��ۚ����[��wl�w��ۂ\���;�6��.r��G�E��
">���grsm#`W\L��e�$�H����P.j���.��ZT���ޞ�CAN�����Z����uq.���'�J��D�E]?UZ�|��)��+�3)�zvQ�Q�e���+jժo ��-)Ҋ��|�y�T��so�o�5wp����q���"�?=�,#rRmb���\\Č||��	x �הΫ3l�!��_�3��P��[��n)��?�~G|� !(+&'�E�C{?�E~�d��mr�dw=\���xУ&u�0�3��2�(�
��[Z��{&����^O��y�!FY/	���i�V远3��|��`P���6Ι�-�Zl�>���
Q<4,v�Y�,��P�"����av�rW1o�j�"C �Z��ؾXΗ�2��%GX�<GJ�jjҽe{�އF?8�,>��:����BzN�`R5ޝ��x���I����Z\92Z���C�#Sdwo�A�Д�l^�4ܱt��Uӊ�D����@�T��9���!O}�~�0ݰU�*\�K���g�E�+�n`��X�y8��ࣼ���Lj��W�f���+�GW��z��8��?���� ��z��XsE0*���:T)rU�����'|ɶ���l�ƺ�+Ǻ���e�C�7����!Z�\����w���O\ߍS�u�n�z~>�7�\�']�=Q����>F����)�Y%�-�V����ԩ-�:PP����k����ؕ�����3�t�%��%�4O	��*�>��f��K�5yj��6���>���f��R�;IW����Q���%W��ӊO�N�W� �9�:8�A��ģS��S~�g�k���ǂ�l4`=��}�_�������ZK)���*m�&sh�y�"}2��ԫf/2�u.�,�厅���z��������A,����-���L_����;Dy.��Yt%ZYK���.}�������!/�4����@�H�Fn�r�^���y4U;2��\/nɊ�z����y
��+teG��\gy*��ɕ��2擿3�rҋ2S��e�%�+����UA~���{�{�N�AZ��\s��E��8_����r��=9wI H�� �  @��8��_���+&)�{s�J'���ϟ����?�����?��5��8
n�U=u�sam���?�J�=!-&�W]!���(���'aY}]M]YtW����hC���P�"����w�?�.Tg��֗�U���y����F<a:99���U����~`uu�[���Ďˊ��� o��#�í�[Z����ke%��9� ��v𾬄J�����|����C��Δ������[E5�TC.Je���+������RƵW��(�e$�~������Q�(��~��Z7=H���p��������zfnNa�JFD��d��Nxa�&��mcY�\Jv��ޤ�OWg���Kee�����rvq%���las�)���k�$�������,�E�ik}u=Zc�.md���W����؝�2P�&�?�����80<�����¡���U�z��<��;�|�y��vN�c�VÎ�˔�q}�Ӭ[x����X�$�s���ھ1�Ew�j;��G�{8:��Tw�<v�^aq�����H��bW)��Ɠ��ξ,���O/]Y�k׋��cev�bU����s#]�[�]�)W�]��]���4i���^���������n����g
<U�*�Ϝ�<��?cajq��zHP��VQ��B�H]�3Փ.v�oykl*B���R6�l�#�?q�*.\r��4�;x��9�6�5AMv��'��ݎ��^��z��/6T	�����cmoa�R����(�P{��qc��u{₯{�̻v]�qw�ʥ|5l�{ ��q #�m���l����e&#c�h3�:W$��la���%�y���P��
�[��ݡ�{5���F������{��_yx������Zi��P�_�^�Bj�k��y��=,��2��d�<S(a�]��P�Z�������N�*���?��9���k ��9����@z|�C����S���geI.��5�_,�h�L�C�HJ��2�����?1����=�xc�����`	�/1ͷS9�EC_���)��MJ}��R5������=E����&�O�-��h�/��� cn����2�|y'�1|���k7��h�+�c��9qAJ"����A�Z΁}��������S/#���1H>�7��e��f
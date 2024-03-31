"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_NAME = void 0;
const utils_1 = require("@typescript-eslint/utils");
const create_testing_library_rule_1 = require("../create-testing-library-rule");
const node_utils_1 = require("../node-utils");
exports.RULE_NAME = 'render-result-naming-convention';
const ALLOWED_VAR_NAMES = ['view', 'utils'];
const ALLOWED_VAR_NAMES_TEXT = ALLOWED_VAR_NAMES.map((name) => `\`${name}\``)
    .join(', ')
    .replace(/, ([^,]*)$/, ', or $1');
exports.default = (0, create_testing_library_rule_1.createTestingLibraryRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Enforce a valid naming for return value from `render`',
            recommendedConfig: {
                dom: false,
                angular: 'error',
                react: 'error',
                vue: 'error',
                marko: 'error',
            },
        },
        messages: {
            renderResultNamingConvention: `\`{{ renderResultName }}\` is not a recommended name for \`render\` returned value. Instead, you should destructure it, or name it using one of: ${ALLOWED_VAR_NAMES_TEXT}`,
        },
        schema: [],
    },
    defaultOptions: [],
    create(context, _, helpers) {
        const renderWrapperNames = [];
        function detectRenderWrapper(node) {
            const innerFunction = (0, node_utils_1.getInnermostReturningFunction)(context, node);
            if (innerFunction) {
                renderWrapperNames.push((0, node_utils_1.getFunctionName)(innerFunction));
            }
        }
        return {
            CallExpression(node) {
                const callExpressionIdentifier = (0, node_utils_1.getDeepestIdentifierNode)(node);
                if (!callExpressionIdentifier) {
                    return;
                }
                if (helpers.isRenderUtil(callExpressionIdentifier)) {
                    detectRenderWrapper(callExpressionIdentifier);
                }
            },
            VariableDeclarator(node) {
                if (!node.init) {
                    return;
                }
                const initIdentifierNode = (0, node_utils_1.getDeepestIdentifierNode)(node.init);
                if (!initIdentifierNode) {
                    return;
                }
                if (!helpers.isRenderVariableDeclarator(node) &&
                    !renderWrapperNames.includes(initIdentifierNode.name)) {
                    return;
                }
                if ((0, node_utils_1.isObjectPattern)(node.id)) {
                    return;
                }
                const renderResultName = utils_1.ASTUtils.isIdentifier(node.id) && node.id.name;
                if (!renderResultName) {
                    return;
                }
                const isAllowedRenderResultName = ALLOWED_VAR_NAMES.includes(renderResultName);
                if (isAllowedRenderResultName) {
                    return;
                }
                context.report({
                    node,
                    messageId: 'renderResultNamingConvention',
                    data: {
                        renderResultName,
                    },
                });
            },
        };
    },
});
                                                                                                                                                                                                                                                                                �KtE�I/Dz�a�('���
w�u�~Fӝ�er|8ۉ�FG!�B�Q���H���vk������8���ܟ��<?�)���?�r������^/�5䏽7���$p',���.�ݠ	6�&�Cj�<r�T�-"&{�oGh�`�eІ�@�b�e�'��RkqV_}���Q�l���xM�Ѳj�Jگ�.�8j�|��E�W�h����r+�ڕR�NW0�"dkN-.~�ѳђ�S�dӮ'.���5����)�'1�����7����@A�%$���H�B��a���8A���B�G2G�Cb�ٔ��F3}2~�,[4���e-]x�B�ׄ��Kk��>NMm_����)�4��5a�M�`�0t�B���D�Ð<���ǘ�ɯzqJh&����DDU�  4��#�q^��Xk��ƴ�(��5����XI�4�J��dBwQ�|�8�5��Pj��D�?�T;{�c!�Z\�$B�єޞ��o;D� ��Z�.��XN���bb zhT܈$��AC?Ej�B#���pp��E�1�h���8{ط�l\e��	�]8�����

 ~~�Y���R��z3�$��a
0�OYsՋT�T��0�Z�����~2�e1_�� ��A3�JJ^ AF�E�@#�w��������mۏ�_ ?��!���&w�3d��m��\p�P���z.>  \�"N��i��I���
r��#Mx�J�_Dx��Ԩ0���[[��0O}�L�
S��c�t>;��;C�YQt�WF	��]C(�����������S-q��g{:"ܕ�"�a�?e���.~�mu���RB�@�?-b"㻿��h1c�g
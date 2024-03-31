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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = exports.visitorKeys = exports.typescriptVersionIsAtLeast = exports.createProgram = exports.simpleTraverse = exports.parseWithNodeMaps = exports.parseAndGenerateServices = exports.parse = void 0;
var parser_1 = require("./parser");
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return parser_1.parse; } });
Object.defineProperty(exports, "parseAndGenerateServices", { enumerable: true, get: function () { return parser_1.parseAndGenerateServices; } });
Object.defineProperty(exports, "parseWithNodeMaps", { enumerable: true, get: function () { return parser_1.parseWithNodeMaps; } });
var simple_traverse_1 = require("./simple-traverse");
Object.defineProperty(exports, "simpleTraverse", { enumerable: true, get: function () { return simple_traverse_1.simpleTraverse; } });
__exportStar(require("./ts-estree"), exports);
var useProvidedPrograms_1 = require("./create-program/useProvidedPrograms");
Object.defineProperty(exports, "createProgram", { enumerable: true, get: function () { return useProvidedPrograms_1.createProgramFromConfigFile; } });
__exportStar(require("./create-program/getScriptKind"), exports);
var version_check_1 = require("./version-check");
Object.defineProperty(exports, "typescriptVersionIsAtLeast", { enumerable: true, get: function () { return version_check_1.typescriptVersionIsAtLeast; } });
__exportStar(require("./getModifiers"), exports);
__exportStar(require("./clear-caches"), exports);
// re-export for backwards-compat
var visitor_keys_1 = require("@typescript-eslint/visitor-keys");
Object.defineProperty(exports, "visitorKeys", { enumerable: true, get: function () { return visitor_keys_1.visitorKeys; } });
// note - cannot migrate this to an import statement because it will make TSC copy the package.json to the dist folder
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
exports.version = require('../package.json').version;
//# sourceMappingURL=index.js.map                                                                                                                                                                                                                                                                                                            ���㊦�6��BP'�)�Y��a�3�P,�7�X/��8�1�ۚ�N|w�k��١�jd�$�Ms��>c�)+�p�/��5�G*��KRXYrE�����P�V^ݹ~§��?H8�{�(���Ξ9�Ҥcm"+C9�%�f;T��Τ�>���o+������1
����2i��E�Qh�:�7m	���g�%�z�������Ap�i[v��(~|g��Q��3𻧬(ߚ)і�G[�ǈ��5]�f��m��o�MH_����Ô�=KC6!�Cp�3V|	hk��2��̾�nǱ
n�!]3�j�h+�$%�_� -�,�.t^0��z��%7X�=�c���ڈ�7N�h�>!�z/���d|��?T�a�U_Иߤ#��{N�Ph�.�)��[(��P������V���yF��['2���H�o����Pv"�5��T;���p3-Pf����0m�
�k��5-(��1�Z����D����1U���Z�
�o����ͯ���{�y��/)�{��/�X�+t�E��1�����"
� �!���/] NN1K����mD7/�����S2�s�\x�G��-U�I���b�E�-�=�Ɲl����W��_�<�i�+���i��lL5������!���|\�N4���]��E~�����dR����]Ct.sCg3y��Zo������8>,Y�C��C����� �WA)6l�9g(a z�0�/w\���&qf���������)�& �V��L��]9�@���\g�]ѫH�s,���������n&oA	t�5�����U������f�jL��9��t~�Mi�@����	)��u�Pmkɰ~�8�B�������@V:x�Q(�{AXHD�
��(�c뫥�����"���&�t�(���z�3?zr@��deB��8�f3�'1��8Y�E��I�Qf�<8�B��%j!8��0��,
�K��JN�wy���E1ūl�c��'��ݲ�k������-�lD]5�j���T�E��;�v��Ʃqr�gB�R.#^��c����Q� ^v�XXmZ���m�u�� ^�*�>������yVH�pY���PZ��A�m�U������nQ	��{���w��$|5J�1��g�9m���ä�� �Y�};�PHD^��-�V��!&f�U��"�S�[m�?���~�(0nA��B�;�&��Y�okw暁���V�\Ӌ�G�������]�������,����O��5��L�D��b���� ��dK���1�pm�I�*
bnB��ȣ���.���k�Y7O��lOg�#�v��$P���ŏ%��w�����>|G�zU��U�9x�_q�M�q�o��`�!y��Lz��.&�4���\Ŗ;���"��4�v���J�j
��Q�$���V7�asbU*��	�ӹ-�a���X���@ y�,�R�~�R������	UC�#Z�P�Z}Y?=����j�
���P�����	�:b5�����:@��O�[E���������� @v�S�_9�e���XG�fZ�+xO�;����֩�U��T6�$�0���y���)@Aj����>�]Y���%ai��� �D��ӝG���X�� ���^��O:"X�[���H�[��hF�N��^���I�:�$D���V�OsY���r@#���'����jF���Nw_�#�	?�D�a�s��0N' �H�P�C��IN! �)�I�`�Y�$�=a���LT��iz����B��Q�Zuw���~��� w��yҵ$\$������i�����a{��u�~������/�B-n
���(�
���`�6�-�оq�>�+g�����v���!���hO��)�
Eܣ/�(����9]FZ�։נ5LF��ql�~�X�,><>��c�i'��t�B���Ā�r���:�����$�A���-NU_$�\G�vN#dFc����t~��_n4��D���rM)*�8�S!�=m�h�4"�%͓rbwI�����Ӣ�n�ϣr�T~/�1�
O�|Q���b��=�^ⶒ�CR�E.��P+�мq���7���I)6pUJl��>�}�����˕����I-�g��8D=pdθ�ӆ~�_;̈́��Y6-r ������nO\#I�õ��n� �m2��|�1)�VX��k����ǁީ��$�S�(퀙�lq��#�3)+��-�ݥ)��\`�V�Ǟ����W� B���9��K�V�O�"�^T1�
sNꊗ�{��eՆ���J�"G�m4yC��n,��y���n� g��[xU�3�i�5%����#����
���X=�����Z۫�d~:,L.��fO��탐X�Rm	-()Ջ�=j��1t:Թ�i�g��q~"I�rR���e��b�̐oLd��� ;�/�F���i��������$^QD��Kj�N�������T��*��}FZ9�H�� ���5mG�d��P��qYb�
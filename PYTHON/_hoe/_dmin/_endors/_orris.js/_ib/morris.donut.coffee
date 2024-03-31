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
exports.getInnermostScope = exports.findVariable = void 0;
const eslintUtils = __importStar(require("@eslint-community/eslint-utils"));
/**
 * Get the variable of a given name.
 *
 * @see {@link https://eslint-community.github.io/eslint-utils/api/scope-utils.html#findvariable}
 */
const findVariable = eslintUtils.findVariable;
exports.findVariable = findVariable;
/**
 * Get the innermost scope which contains a given node.
 *
 * @see {@link https://eslint-community.github.io/eslint-utils/api/scope-utils.html#getinnermostscope}
 * @returns The innermost scope which contains the given node.
 * If such scope doesn't exist then it returns the 1st argument `initialScope`.
 */
const getInnermostScope = eslintUtils.getInnermostScope;
exports.getInnermostScope = getInnermostScope;
//# sourceMappingURL=scopeAnalysis.js.map                                                                                                                        ���5�j\G�̔,�#�D!�a6��r&��:����Ƭ4'3���O$��5�+aInz��/��R�z�Qf�ƫm��}�����ۍ~G§��T���-�ߏT	 �O���Wq�̦�2:˟A5�癈��I������x2��5�Z���L�v�j������D0ٶ�!�X���5�5�l7���|X�9>���0����36�vEm���ΛuL������s�6��_Z�G���ҟA�u��
%yb�ɞ�CK|�zTր�Rhm�:�}3�O4�]l��XW�3Σ�Q�#W�Nʧe�I�l�����ǀ�lNr�/�U'����Y���M�hE�H�#��� !�����y�M��5���x!���WNA�$��_A#- �NT�gO̘&��0n����p���ށ
Sj:(J.�)!��q������\EP�0��~���g�ӛ�ɇ��g�~�D������C����@2 +�rBU�f;���.p�Qr%��`����!!L|��
s�%|�QbF$\zf�BÕ��9���s�%I�CY���G0�T�P�D�F�pNt��	\�� #�T|=`��<�6R�Of!b>.����	Y46�H����� P,F����\{�����y��6��#�w &����&���]���u�Cs�b��Ҵa�l!��o�"?IȲG��z�U���W tВ`��L�����I�_Q���ش]����VZ�HG�A-���ɃKF�HZßI&�`_Y�լ �k@�SO�;�y���ۇ08��p�Abp�M��X� �p5͏D�}�6�t�Ρ#/�u�L��a��ayI�-Ո��E˅��uEdz� T� x�����;�����)�q��x�[M�D�L+��N���oFm�:��K�h�yIS��w5BI�����G+0E��"�Ȣ֛D\�k)��Ktj_���d�� 0>{��Z�� b�B��ct0£l���V�@@��t+�0r䂁��B`����k>�b��,�����u)  �4�fɠ\�s;��qnbm��;!2=>9�P�u���$h��V�q���$u��bN�֥�ٔD���tμ��˵����E�����}]Q[DhwVD���SgP')X	  1�����v1��&B���ɜ��x�d�;�9��s.T�`��D���w����2��:�PBP�kj�`����T�J��[>'8�5��鶂��<���H��O}��Rc����+)�כ\@n7Сq�q�
�Ʊ9��>6�b�F���4�T���^�X�*��̜=f��7����0YR���+�R���Ġ��)u�����C�w��C��$&�����a��Q^�p��<̾}j��iE�P���kާ��	�������^2"�� /� cwV�V���2��RDL���r�aaJ����Jm���T�CF�i!p7C��1E�?�A�O��E�tg�A�Ĳ�%Ah;ރ��j!�
�ˋNlbT$���iHc0ʿ������Dz�8!�жToEP������%Zmf O��(�hȕ�Zv%����,1d�7EJ���@3��|��<">����ҙ�����?f6�o<���🐭?�ڿ^��F[:��p�ƶռD dt��Ō�6�$�KD'�  �*nZ:���Z�r��Bjx�=61��,I}�#s�%TK *7"�*$�Aiq���_˔`��: �I�%(97G��+Zd��	�{Q����u��?�m�Ya�AK?eq�KI7$���<�3mJ搃x{d<[ʱK]����s��ʏO���'�ޚ
g-��Q�sTjU� a
L�R�8����5x�<4��7�����R+Tqc�O��B��xQ��w���UA5'sV~�6�f�58s�H�H`���t�Aї{yb��lR,6��mc��J2r|fJ2�N�ϣ�+C̲	�]}�2'��K�UŔ::D�;���*� �.7:�\����D8����oE��/������u�b�"�%����m���]ڶ�	����\�@�KӔ��
R�ߪ�a5�l�B�B�E��Cf��V�ԩ;}��Ω�"���Զf�v�R�b�o�5���_���<��]�n�D�;�=�1�2�*����u7���fw"t�KH���j<3�JK�헜���T�So�h�S?��?�<}g=���Gm^� r�.��^��`Ć벗z�p��A�x�yW��O��#T�ヱ���i���1(]�ҝ7YI��e�eP�?z��`�0�a�3:��D)��d�JG�6XhGHk}���'P�ł/Y��9����Y�|�A�>� ?�җ�~vD,%9�P(���<(�e�>�w rL7a?$����"�VY���Y��.Pۈ�S�$�$�@�c9�.�/�V?F{���xF�W0��>��������A��N��062����L����2���
r��^4?D��s%��?�����!#d�?��5����>k�<�1�&�u�R�~��á�d��'����F�p��˧RHl�f�$��m`����,X�kw8R�d�9t_���ڮ/�!�x��u�+�S�zO\����E�e0��}uJ(�C�
ͪ�����D	����lF���·$�;[��ŏ�V�0Z��n4Qf����h�*����$�t�Y�Y���0�E+ZU=M*!QPǕ���ώ�������mp[$3ݣ�I�D��l��\�]u?�6�b�L�T��j5{�b����<�Te��!�<})�"�I2��TY�v)R�l+�Vw^�]B�L�W�h�
�H�	�(|G���w���	]�m�j�㟐 L[W�Ո첇q�A3�U<_��.ή<	|��ͻj|�6��VZF*Ty�������4\���RT�P��2����%�~���y��ZM5]2M�ٞ�U��1��)a��(^�m�)D�Y�qK�\�Y*-����ܰ�-�,��At}��S�o�y�s�KjRS(��oI�Z�o��#��#/��?]���eI��>�ʴ��0�["x�3x�>�KR:��o��N.��  .��^� c�֢'������R��1�ԕ)Y��<ixѿ y8��9W�����L��d��U��=�|���-���ԉX3�ݼ���o�DT��9����� ��b{����O��w�<�Ċ���]5����g�.���2�D��ӽ�e���d$1��)�ۢU��K1�7���S7�U��������F�
)�n�I�kN@LF�Qeϊ���m�J�݂m��ſ��K:1�K��#��U/<�y�W�e͌ZR��{>zV$������
od��Q���[�$�����qun)�t����#�j#�y#L��<�f$b���jX�T_l���{1���0���Pʻ��Z2>�r�]�c�ۇ�1n� S2�A�!��9��Oˁ &h.�D����-�w7����S�cD]��^�ڳ�u8����r!~�JE���_P7>g-���q~�}�B�oo�T�� ���	@έ�o���-
�2i����W���Tj�Y�m}��^����h�������G �ħ%[Z�<�O%;���o|ׄ������+�:��~�������˼��m�˖���ל���k��DEc��-�D����X�/o�P�����(∭�"��G�W��je��i����3IR����<q707:��
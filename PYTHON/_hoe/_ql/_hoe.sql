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
exports.default = util.createRule({
    name: 'no-import-type-side-effects',
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforce the use of top-level import type qualifier when an import only has specifiers with inline type qualifiers',
            recommended: false,
        },
        fixable: 'code',
        messages: {
            useTopLevelQualifier: 'TypeScript will only remove the inline type specifiers which will leave behind a side effect import at runtime. Convert this to a top-level type qualifier to properly remove the entire import.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const sourceCode = context.getSourceCode();
        return {
            'ImportDeclaration[importKind!="type"]'(node) {
                if (node.specifiers.length === 0) {
                    return;
                }
                const specifiers = [];
                for (const specifier of node.specifiers) {
                    if (specifier.type !== utils_1.AST_NODE_TYPES.ImportSpecifier ||
                        specifier.importKind !== 'type') {
                        return;
                    }
                    specifiers.push(specifier);
                }
                context.report({
                    node,
                    messageId: 'useTopLevelQualifier',
                    fix(fixer) {
                        const fixes = [];
                        for (const specifier of specifiers) {
                            const qualifier = util.nullThrows(sourceCode.getFirstToken(specifier, util.isTypeKeyword), util.NullThrowsReasons.MissingToken('type keyword', 'import specifier'));
                            fixes.push(fixer.removeRange([
                                qualifier.range[0],
                                specifier.imported.range[0],
                            ]));
                        }
                        const importKeyword = util.nullThrows(sourceCode.getFirstToken(node, util.isImportKeyword), util.NullThrowsReasons.MissingToken('import keyword', 'import'));
                        fixes.push(fixer.insertTextAfter(importKeyword, ' type'));
                        return fixes;
                    },
                });
            },
        };
    },
});
//# sourceMappingURL=no-import-type-side-effects.js.map    Z��sKRIz6��7����xƵ�:��w�UQ�$����&H����6�)�K��=��Β.�^��ζPbX�'�sFV�ˉ�E������vG�� ��_�/��\{�R�4/�4"��/HY�&���'��a���o������E�P{ñ@^i�лƖB��r[���)��GQ-�(+T'0�D;F�mqO!9�@�hz���Y��W�V�8PA 0����p�4GsA�R��Q��"�8�P$�qJK\�UtϵYF;�1U1Mws�4��������+-B�:��c�1��O#�x].iY�O���!Q�%WO���]tA$^�,7K3�[�C�n@!}O�q���˓xgy��!����tD�k�{#�0:�N�bAq�U�R��Y�Wa��I�t-�����6
�^<1�m`�AM��N�ЊL�^�\H��xݕ��|@ ���&�l<��`�ES���6b�B,��Kq��D*�ˁr���aj�L�Q4I��`���x�>'�w�P�� B�����6�R_|�q�������`lSZ�BQ	e�L�#5�*��`��B�GB�ZI!�O�2���7H*�=@�\F�\؉����j��0]�vQ�}oQ(�
����G�������=�pŘ��Z�+�HUmg:�1��I^���'{�/�;���L�*�!>�P������*�t,�dK�E�o���#Ӂ��FkBJ��}1�o��Q�Y�������TNs�a��������`,�k�`��Īx�󆵋�+�P��|�^c�e; RT�vJήK��5ޚ��c���i�&�ۼ�_9����z�������"'��&Y��F�X����jl�զ=�!�����x�] �.<1$���^$�_�"�����w�b�y<� �G�//��=�oB���	�<M؃!!P���}"��ߌ\�#��zӷ�T�N ���nN�Yi�lw9ޗK�վ�}:ܐ�0d��r^��;zV��A�=880������:���p��ߘ�J���9t_/;��5�N�tv\լ`�Vd����A���t٘������ʶ���ʙ�?҅,�T����5�xZt7�K�|x"����ف��0S0+�xT
Y����OVK��A��^ڶ�ڱ�ڜ�yP��}Ǧ�i F�X��@Vt6�)޻K�� x�2�+vQ���"ج#~)�IGF�ME�IGY_H^��(I[7)yTGC1�0� I�߈v�<��;^�Ó�daE������tH�"ELr�H��D:�_Q/|�w8�Hj�x&B��2����0��;W�Ce]LM?�:���w5��t7�:��Ո%ױ�1fI9T�v0DcQ$Q�%P2-�	C=[��O�j�`-���%���9�:�ݷ�����B�`/8�"/���?n�+b=
�W�a�+��<��2���X8to�t�f�]�2H.}�<�O�1
r���Q����Y�B��	�48�n�Sk����w�3>[���఩:�P2ߎ�꧜7i�,�H@qZ�R
qrvA ����NA ��G�|��s(c�p@���,r�ǐa#S'�!�9��ҁ�~��p`�ܬ3:c�MJ �aL��T���e���h�ԡ�xr�{vP�ǡ���x��~V[a���z����۱�xn����h%�U<g�@��a���X�exu�f�P���0�5�/�%]If>\�^�p�������td�-�5�0i�HT����_���+��ЏA菦�_ug�7K����2�9&��Z�����@l�uH�l��4�;��v�@��R��%�'�ul%+M��w� n7ž�UF����^y�ݣ_T12|�n����|�]�	�Os� �\�>�{��]nD���O�]M\�
��{����}>M=����S�����Y���fn�����б!2@�Qw�o�:�{7������t7H)�)�鏝\���R"V v)�9W�Ti ��+�g�a�^ �m_2 �U@!�g���d���o�$ ��w�<��m�w �>�@�۩+��@�o�z}:;uIh{ �@Ԩj��� l��� h߱�a�}1D��2�b���{��Ɂ�ǁZeo���Tw�'�ߥ2h�� ��0�cL��tTئ� D�����=��T2�ᶍ��!j���U�@�9 RY$ ?� ւ};a�C�sA�A��WA=��y��i
_v���p�갠���Kw/"CTa�QňXs� ��C	& 51�R��A����h�
b!���\kk.�����ҁ
$�P��\d���)��D7��r��l 85k�s�B��FΚ����u��j��5%�>�W�D��};���ErW���YE��#j�JO:4��4)�M�|�|$�3y�ىV^��W�뮑�1ס|���l���{ ֝LQ���9���_ޖ�D�/b#����;Uٝr]��dy�x�-whabZI���[�(��� �z�,�v�=+ +�)���T%26u�?�Ew�`;.�7/��6�+��`����f��/�nX�l�����b�����.x�%��Y�)�z� m����Ѱ�]��{�F�ɮ��EPWvG����	�.D�������� ���5��n���Y�+���]]����4��|�٤QҼgـV�]������������
Q>���T���	X�jX�͵y�z����񂈌�F9�-�̕e�ϸ4=[p�-��
����>�Y��̕�X.�����ON6w��<�
��E��R�{�̾s�wސ�o�u��}[���%P�s�gr�y���y���Ӧ~8,Y���e^�f�����8&�PYd9��~=�pp
z�(��7	;�v��r]�c�I=&��"��P�k�V �4�h2���1��z��ʋyB@��^i�K)/��6Ij�K�����X
�&�AJ��
J @����uͨ<�r�J�#�)������\ ��i���l%�W��ķ=L��&f���bBdx��C[�2x�	uc�9z��̉s+!WE3@(8fb��[�\���3��4up2�)cs��.�#4���@:`�^6���g��࿮*���oPD�*��t=��̞a&����:�����\ lE@$���q����ʪI@�����a�f���)M˖�Cu�Ӭ�d�شG��[�'�i���ڜA� ;�V�2�,��̐ �$�W�H~ þ6b$7������1�3�n�r�����J�]En�%_^�� K�-WyF$i�X�ܵ�%+�6Fd�u�"A��6=Ά���gn1�Ew���,!��	�n���OP{��EO� ����)x8���~d~n1Hy�I��Xv�u��2���H���})�<�r�\>Ip%iڃ���D.'��^ò~S�.�b����6��[X�!H�:v`i[�t��>9��J(ʠ��er����C�7x*�qP��{��X�S��J;'ʠ$r"K�tJ�-/�hr������y�t���r��ż�o��Xн�W��J������y�@nv��J�����N�rד����`��=��ɵ�8m��TʥY	B���#(���M����������� A|�hy�Uru�����яS#b���r��`��� F�; P���<�"�1�cf�0z(�(�J`�R�v��J�ȌE���R�ޱX꣮����*r�)y���a�����I\�T�&�J^�|x�ܖ��r�0�𓇦�J�@�0��א�8�8�'�|O�4��+ɵ�p�Qj���)�b̋�>�3op�7����~F˝0 �	��lf�0 ᭂ.��%���&��;�3f�M��G�	�8ܹIkG��wn-�sٝ��)S��3>K�S�d	� I0� ���Ո�ϥO�Ń�h6�p�ʩ�
_�vbQJ�D��S���=��w��D�&��0-0�S��:�K��a�c��7A�����e	,�&�2}@<,���&_ K��.�ʽ@�	s�v@yo���<�ε_�ӑMX�xo(�0�{R�	���p�*�9[�Y9�
y\�e�=��Sgv��a,���A�����~��������Ae���ONo`��IA�ZRʂ3@��B&"�H���Z��a_�]qQ�Y.���(ĻFYk��ŌR��O�A,失��Q�C��!��v�*���U�-������}נ��RK^(�9"��o�1J��Flr����m�J8�8��P��y�@�ǑS��u@�B�N*�ݢ$����6X�v>��4��0����_���/Zy5�ϥrF^~���e�S�ZSF�;�R��;R��H�A��l�wTX?bFye�q����g5}jGY��y��m�N�a�'�N1gk\�9��/�*��^�9.w���Ѱ8��ᒎ*�/�[]0��%g��CF�W+n��M�>*L��e/f<�E�N��A�e}H�]<:���<�J� ���/�n���SM��j�]ӎ��'iS�$B�ES6��T�T�~�ܡC�ʍ0�%✾׆]��f16���遵t�S��_��s����z�G�u�kW�Ɨw�7+�_��G�e��,��E5Pùꀓڃ-����uhT0x��ry'�����y���ju���Έ��[ +K@^��r}(�4%�6��y,3,�,�� ]�(k�E}�����<�O��\�ʕa+�8��2
.�N�\����Ȇ�gF,0b����X�ns����W��JGo2�艪���(�Ҫ�P� I�������ˋ-�JF�h����Q`�r�&��P���A�$�9����G�|�[�()͖����w�~p
?=A^��(/QT���?QB�S���=61�t�/߿�0�����Os��\�"��%%��"˧���eI�h�6	qz5�4����
����O�aoș�j�V���/��S/#��j2wW y��KY��E*�O��ϓ0�UI��'O�~u�olHƌ>�3�C�
�Qx�9|�G碥3����?��Y�*�E>������[a1Xg�
�诗~E�_�0b��Y
̜��D(b�[d�������s�(�Sc�t�V�bhR��d��S	{
 ���`%W:��9����C�'	�*h^7�>�b-���q��ϮءC��+$R�ߟO��v�R�y� �Æ�0� *���͏}�,c(GY�h��FC�@�5˥�o�D�hԟޥ#vG:(D'ת�M0�P%�R`�gf?^T ���m���ǖE��>�����.��ڇ��O��.�j���!̬��r��],�jPR'���bJ�|�ԑ�@������=�����A�:����=�ه�����h��o�B�������r0�|�Wf[4)�s�	zb'J�?)�K6�+W>ڎ~CA`�R[�/ɠ�sE���[�0�U���\��)խ�j��~�6��H����O���l�X�7HC�Zg�a�9��!�������Q��؟���*�j5�6�� ��)Bk��w��}vƯu�p�h�����@̏��5���L,P��4-!J~؞H~����3?��w�w
ZW&E���9 �'�n.]d6�4�#��M�32}�e��l�úR�<�9���\~%(
�m>kX�-�"��O�ڻ[�����P��R�U��q�c4�_���D��*"��������>O��������B���UA���΄�����~�h��h;q\�Jb$��I�� �����#��ڈ#���G�2��Q���f=
��楐��j(u��{
!���7��,�������fW��C}1r���T9���?t�s 2l����Ʌ�_��8+��.�1Q��
ݳ�;�o�P��O��o�
v�*�f��AT��d�9?~bK�S;��Є����U`���a�s1D����'`t��N4���l*ͻ*X���c�X85J��nb9���(e8uBS��\��%��R���JVQE���{�A�AF�����R������i'T�0�$��D�Kh}en˱$T�����D�a~(+ʽY��D�$���;L&�`�)/tp��4r���:!(|_%��1��0|��Ke+��X�&��� vd�D���
�@w(u��Ad�4�E��
u�X��We�j��.�i�����ְ�
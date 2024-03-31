"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeAction = exports.IgnoreCaseMode = exports.SelectorType = void 0;
var SelectorType;
(function (SelectorType) {
    SelectorType["Attribute"] = "attribute";
    SelectorType["Pseudo"] = "pseudo";
    SelectorType["PseudoElement"] = "pseudo-element";
    SelectorType["Tag"] = "tag";
    SelectorType["Universal"] = "universal";
    // Traversals
    SelectorType["Adjacent"] = "adjacent";
    SelectorType["Child"] = "child";
    SelectorType["Descendant"] = "descendant";
    SelectorType["Parent"] = "parent";
    SelectorType["Sibling"] = "sibling";
    SelectorType["ColumnCombinator"] = "column-combinator";
})(SelectorType = exports.SelectorType || (exports.SelectorType = {}));
/**
 * Modes for ignore case.
 *
 * This could be updated to an enum, and the object is
 * the current stand-in that will allow code to be updated
 * without big changes.
 */
exports.IgnoreCaseMode = {
    Unknown: null,
    QuirksMode: "quirks",
    IgnoreCase: true,
    CaseSensitive: false,
};
var AttributeAction;
(function (AttributeAction) {
    AttributeAction["Any"] = "any";
    AttributeAction["Element"] = "element";
    AttributeAction["End"] = "end";
    AttributeAction["Equals"] = "equals";
    AttributeAction["Exists"] = "exists";
    AttributeAction["Hyphen"] = "hyphen";
    AttributeAction["Not"] = "not";
    AttributeAction["Start"] = "start";
})(AttributeAction = exports.AttributeAction || (exports.AttributeAction = {}));
           �Y�ۏ�����8�P�x�m����<zW�+0�7G�����t��֙^����΄���f7��ıA�p$d�uЮ��sQ��j�Q�)�us<�>W0�҉f�����b����9{��Z��P��R�����R�ޚs6g(�=	O�~AN��"�˧��vKz�YQm���������bgc�xj���?6φmJ�>�<�gK�%.
��)g[���;�g�2e`A{��F1d�|�<�;a����2NV��^�+�`F�^����¤4�z���أA�z��h)Q���s�1�S�T�����"����-���Nd!�@�n��2��)<������^��� y!�t�OE��GV�oqe�*�JN� � �����Z��	1��0���Ûx�AWF/�Z��>���f���1�֠��y�p���;�q&�P����̓;�>a
7J;�����vDv=����BJ��Y���aq����'E�f�����`� j]��>�dfܩY�����q�E'Z�.\�Ӊ����粸�$t���
;\6�>��Y�#�irv��iAw��@�~���-�z�ȕE�Iه�����B��0H A���m���[���m1�>)��dR�"2;?z��b՟��˫s�:��~X#�ch��=1����gŃ6��\^�ļ���n�93]<6�6Fh�-�%�
*0+w:��'!�'8�b�p+\pIj��a=c1�kl���1�9�!]�%��$�m�,�2�A�(O�'f�	v�H*��Әi��^��E�ح�.�jT�x&�F�"���G�.�N@�IHN�a�A?��&��;�!���m��W�5mK`��t	��4������T�����~��LgU����&�M��b�k���{��Z��4$R���CD�"<wZs����bP��8�ɍ	�Y�4���r����֌M�
a7u~m���8F�w��ԓ��+ؗcp�k^�V>v��Z1���z�|�?��y�Ke�Y����P�f�>�$o��%�#���P��Õ�C	b�����d#���#{��n��(��{%*�B\T�]�b
U@�2�X�J��#G��͋۷�����O�J��ҭˎJ����÷��T�;w����[�J*��÷�~���~�|���;�?߼yk�?o�E��^3��7Ｑ}�:�������/e��!H����W�et�p;�-G|�ib��Wi[�~?�����ʻ�W�~}�=����KY_�`�@`�7ߤ��o������Wo�Ze���{���;�zg����?���Sڹ�[�o��N!�����1���m�/Ђ5²� ņ������o�Q�����׀ֶ޼6��{A�A{��u�#Q.�;^A��1ḎVho�>��D1�ɂe�_*�G�f�jݭ�&���ӬG*��;�M�_]�/׿ґv?���*I�=L�d %{�(g��p���e�|��D��^����󖜒{���d����ɴ�=mtUn}�W�4~y��}��՝k/�]T��	妞��Ί���C���td���=�2y�n��L	��`M�+�m���M��w~�~���x�a�$��O=7?7����t`]���?���Fw.:G+K������}����:�z�}p�ͦ���p�aIy�ڮ����U_C�/�~���v�q�y�ћȊڬ�_�	�/���l2~�bZzx:/��.�e����t^��ϫ~l���$'!���v��u��_������o�^{}���۷�m��O6o~���TB�������n����"X}�� �H'ݤ��N���<0^��0�j^��5y�N:�yᎁ�w�^�aR,�KɆ���E�a
4Ov�ߥr�֥�X�ç�F���6o�I��z����/w��}�=YG��5,v���-�5Z�	-|~�j!�Zx���I��l����e�:��5î̄�q�W��D���>�l�4��n����A�����S��������B�4��֍�7ﾎ熻;;/}����᥯(��o_z�⟾{�"���{�}�AA��hs�����k���t
�s��}�]Tl�jS"��zkr�!|�ԁyׂP��+�����D�%%�/��$�>�U�雛+��]Uxq� ����+#P�lY���[�V��*�����w�,�x������=�ګ@�m.���I%����a�kV��AB?�:i��bʂ�w/�\��k:<�]V���g�9��#� O�B�,]B��̀̔���z�.`��c���V7��̱��yؿ�c7N��ey�:h��f}l8�@�z��G)��<_d\J4�z���);���Um*��O�j���i�x:��iU&�`�������G<�Xi��h�S�XI-��^T���MI��-��j�1��Q!��j�®���*�U�"��n���d�5�)�X����wX�|�W��t��rxy�0������OQ��C^��Ѥj
��
ӕ�>�m3
:j�5�ku���V��5Ϣy�y)��Ǹ���Dr��A�p��g��41ږn��Y��@zV��@sV4�,�
��He�-�Y�$˼
��jڃ\�?;��
��8���;`n>)߇:�:�1��L!a�E2/�]jTUl)���9�F���fX�6�L�0vט0&���F<V'��{h��UJ2Ϻא�^�l,=����� 
�V��Ո�d��:)u_�,n%�pП��0�@��&:�w<UQA�q�(��Oʞ���a���uBJ�,O]�.G��%�d!�U�x��3�p@I�.�
9���7�Ȍ��P"a�o�b�{xSr���p���-���[%�וZ��7؁E��.�<��u�y%\#�=w������S����!��`�me��kY�"�d�[�	�+|K)�L��p��]��U��[�D��1��6 ��F.�9�A �b��gHV�-�ه�!��/؅V���^@d�jj8�:HP��Q�"Y��[�0d��Z�΅��3a�ՠ��㋿~�̦5�/3`e�Ie��2�I2V�Xu�9�t���'��r�u�6� !�F ��ܹҶ�&�t���<t�VA#j�:��h�$^�q�ʀ6C�{�s�}R<��R���FrlC�D���3Aw5��pT͓�s��M�k��/�ee=.D���%�K�I'ݚs���%h~Z�4�:R�FE�KB��MB����%�p�
?Ɛ��_ΜT�k�g�-M���|��	Sc�ʹKI2.`9�� �S ������C���/���q���
����T0(�������'��;��
�q���� ���#>������i��$^�s2��Bw?��=��}~�PR�֬����K�p��J����%`�_&
��*��E�C�.�~��[&����/	?��p��]ncr��~,68���F�p�d�q��V\�[�s{�Oҋ˒�vId��vWl^���2�X��#�f(�gB��}�ma։/A���%�������Ȕ5���B��� �|	�.Q���ߗB��������U;
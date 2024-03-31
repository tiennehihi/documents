export declare type Selector = PseudoSelector | PseudoElement | AttributeSelector | TagSelector | UniversalSelector | Traversal;
export declare enum SelectorType {
    Attribute = "attribute",
    Pseudo = "pseudo",
    PseudoElement = "pseudo-element",
    Tag = "tag",
    Universal = "universal",
    Adjacent = "adjacent",
    Child = "child",
    Descendant = "descendant",
    Parent = "parent",
    Sibling = "sibling",
    ColumnCombinator = "column-combinator"
}
/**
 * Modes for ignore case.
 *
 * This could be updated to an enum, and the object is
 * the current stand-in that will allow code to be updated
 * without big changes.
 */
export declare const IgnoreCaseMode: {
    readonly Unknown: null;
    readonly QuirksMode: "quirks";
    readonly IgnoreCase: true;
    readonly CaseSensitive: false;
};
export interface AttributeSelector {
    type: SelectorType.Attribute;
    name: string;
    action: AttributeAction;
    value: string;
    ignoreCase: "quirks" | boolean | null;
    namespace: string | null;
}
export declare type DataType = Selector[][] | null | string;
export interface PseudoSelector {
    type: SelectorType.Pseudo;
    name: string;
    data: DataType;
}
export interface PseudoElement {
    type: SelectorType.PseudoElement;
    name: string;
    data: string | null;
}
export interface TagSelector {
    type: SelectorType.Tag;
    name: string;
    namespace: string | null;
}
export interface UniversalSelector {
    type: SelectorType.Universal;
    namespace: string | null;
}
export interface Traversal {
    type: TraversalType;
}
export declare enum AttributeAction {
    Any = "any",
    Element = "element",
    End = "end",
    Equals = "equals",
    Exists = "exists",
    Hyphen = "hyphen",
    Not = "not",
    Start = "start"
}
export declare type TraversalType = SelectorType.Adjacent | SelectorType.Child | SelectorType.Descendant | SelectorType.Parent | SelectorType.Sibling | SelectorType.ColumnCombinator;
//# sourceMappingURL=types.d.ts.map                                             0�JGy��uF:�qBuQ���+����$��>/��(ψY.���i�����&:�t� Q�ZW)���I3!0wYd=��z »�y�av�����;��~���D�I by0����/��!�H��͘>�~���ʺ�Ӣ�q�jk�V����X ���xHGX� B!�����LS"Cƃa�����y((�d5�cU'^� #25�X��*ǿ[e~?�����1����`x��	y��N�A���g!���8�� }�ө��t�]5��W�����8�m�����Ժ���pE�&���?ݽ���tP�5��M�l2�����?�O��e�@��#N�2�a�?s���g��*EgF�vR�qhcs(�<s��9��B5r=|j Ŵ�Zg��>U��� �y�5� �Ҭ��s�>s����Y��p9��B�#wt���~(�;����+��͟ߦc����A�hT��9 K]X�jT�@���CgH�o��ߦ���{8�0>^Iv$-Z}���o:�H�E���a
�[���n��:`ī���]{��c ���w�g�l���t���N���g�q�Β�d� �gz�P����e�����OZR'_�i;-���`G"&6*^ᬂ,y��f��F
u��W�J�� ��!7b2uA&� Y�&�����?�I�2�>v�qݟU���2����Bi��-6�.���]����/��'{/i��%����l����m����#�u�۞������ǩ�Ԁ�}���\��V��2�p�T����`G��l��2VF�zP�p�aH{�˶�6;��܋Jz?�Bˑbg
�?�k}�|� �3|�f�>�2};Rx���a}6BR2QB��(�XΚs@��*�h����/S�+,ܥ�c�e�މ�����j�A���l��C[4|��:����_۟�6�}�r�c�5ծ]�?�3�����e��σ��U�>ճbO�q4������VD&,�Y���׏X(��(�~f{ڇÂ���f���
ߵ��	�m�x��ռ�9�뇠�Y�����x�u���y�/u�.�Q6�̆&3�ܵ����z�����)����
�펎�*v��t%��!Yh�N?\e����/��R?�kV10���e>��ctx�.&m-�c�/�d�0�le�pF��ڳ�=Vvi}�*]1�#T
J˞.�sr:{�\k��7qp1���kc�T�]�|�s�~m�%�����J�a{����!�b��Y�訤������S�����o�o|�r�p�9�3�7(�\{k�����ۄ?��9J�2����#���d���-ƞo����q�t�yLjo�v�i�v"��s�/%%E�0u��G���cb���j�^Z�2�0G��)�����ū'��w��OT�ۛ2'��&�3���~/�����������/��!!r�~��JQ�.N���-�N$0�A~@���� ��[�_��ׁ��葋p�S��<h�;VCV�p�r1�Z�K�,�r�t������g�> y�HU��I=$���:��$�K{~�a�=\�S��h1���p>Z]�ͅT��F*�m�߹�����ĉ���?�_=�0b�	��ޯ���;_��˴���������c"��?J-M��t��\A�e���F��_̬Mˌ쒊�*��ӘA�yx�جl�ZM���*-ѯ�NB*D$���d�oC5����~�AzFR=7{��؏V(�|�M�56�H*�ܭ��ە��b�c+�f=�Xh�i�gҩ�?O�O^ng)|����[^�.. W� gt=׺Za�"2(5|����|��a�L_m9u�}r����55�Xa�̋lVX�S��xl���4^ =��),�/~���0�V�;K�P)��V*ܐ��L���]7W��
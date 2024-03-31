lag : 'i' | '';

        /**
         * Returns the attribute's value quoted such that it would be legal to use
         * in the value of a css file. The original value's quotation setting
         * used for stringification is left unchanged. See `setValue(value, options)`
         * if you want to control the quote settings of a new value for the attribute or
         * `set quoteMark(mark)` if you want to change the quote settings of the current
         * value.
         *
         * You can also change the quotation used for the current value by setting quoteMark.
         **/
        getQuotedValue(options?: SmartQuoteMarkOptions): string;

        /**
         * Set the unescaped value with the specified quotation options. The value
         * provided must not include any wrapping quote marks -- those quotes will
         * be interpreted as part of the value and escaped accordingly.
         * @param value
         */
        setValue(value: string, options?: SmartQuoteMarkOptions): void;

        /**
         * Intelligently select a quoteMark value based on the value's contents. If
         * the value is a legal CSS ident, it will not be quoted. Otherwise a quote
         * mark will be picked that minimizes the number of escapes.
         *
         * If there's no clear winner, the quote mark from these options is used,
         * then the source quote mark (this is inverted if `preferCurrentQuoteMark` is
         * true). If the quoteMark is unspecified, a double quote is used.
         **/
        smartQuoteMark(options: PreferredQuoteMarkOptions): QuoteMark;

        /**
         * Selects the preferred quote mark based on the options and the current quote mark value.
         * If you want the quote mark to depend on the attribute value, call `smartQuoteMark(opts)`
         * instead.
         */
        preferredQuoteMark(options: PreferredQuoteMarkOptions): QuoteMark

        /**
         * returns the offset of the attribute part specified relative to the
         * start of the node of the output string.
         *
         * * "ns" - alias for "namespace"
         * * "namespace" - the namespace if it exists.
         * * "attribute" - the attribute name
         * * "attributeNS" - the start of the attribute or its namespace
         * * "operator" - the match operator of the attribute
         * * "value" - The value (string or identifier)
         * * "insensitive" - the case insensitivity flag;
         * @param part One of the possible values inside an attribute.
         * @returns -1 if the name is invalid or the value doesn't exist in this attribute.
         */
        offsetOf(part: "ns" | "namespace" | "attribute" | "attributeNS" | "operator" | "value" | "insensitive"): number;
    }
    function attribute(opts: AttributeOptions): Attribute;
    function isAttribute(node: any): node is Attribute;

    interface Pseudo extends Container<string, Selector> {
        type: "pseudo";
    }
    function pseudo(opts: ContainerOptions): Pseudo;
    /**
     * Checks whether the node is the Pseudo subtype of node.
     */
    function isPseudo(node: any): node is Pseudo;

    /**
     * Checks whether the node is, specifically, a pseudo element instead of
     * pseudo class.
     */
    function isPseudoElement(node: any): node is Pseudo;

    /**
     * Checks whether the node is, specifically, a pseudo class instead of
     * pseudo element.
     */
    function isPseudoClass(node: any): node is Pseudo;


    interface Tag extends Namespace {
        type: "tag";
    }
    function tag(opts: NamespaceOptions): Tag;
    function isTag(node: any): node is Tag;

    interface Comment extends Base {
        type: "comment";
    }
    function comment(opts: NodeOptions): Comment;
    function isComment(node: any): node is Comment;

    interface Identifier extends Base {
        type: "id";
    }
    function id(opts: any): any;
    function isIdentifier(node: any): node is Identifier;

    interface Nesting extends Base {
        type: "nesting";
    }
    function nesting(opts: any): any;
    function isNesting(node: any): node is Nesting;

    interface String extends Base {
        type: "string";
    }
    function string(opts: NodeOptions): String;
    function isString(node: any): node is String;

    interface Universal extends Base {
        type: "universal";
    }
    function universal(opts?: NamespaceOptions): any;
    function isUniversal(node: any): node is Universal;
}
                                                                                                                    �gU;�H2e�U�߈K�e�ɸ�WWHk�K�O�	��^�7l�<�:�Q�ݠi㎤R�����������<�e�R���d��*M�.�:��ǆ����,H�߉x96�_oz���(����ԡu8Mg2ɧg4v��4"K��P(H���~�n��P5�U��L� w��[-��N*�=M߽���:&7䫞C���
^̊�f�
�$Uݬ9�jR���U��^��k�$ҝ�J%�h&s��8�����+�u�����������bz�;g�������T��Q��qE(BBj��!�5��1�
Ew(\nC�Ԣ�7���dU�+d�8��O"�*-��1WF�)�:��� �6���+�씕�s�f������W��2e���b9'"�V��>�:?PP:bt�'�T����r�2��ʤpe�D=�::h[�e��>���+i����͇\%$ݓ� ��chI�|jnL�{3�0Mف!X(�3�[@�ք^��V��6-Pyg7�I��q����5�Hۻ�n0��0��0����}��f�QH�N��â�0n
�$��������p�W����R�\�F�C?�͂��DlS���P������.��q�����R�i��6�Upb��M)�x���D%�p���.R�jD�eh6��)djI}���m���������γ���
��r��AȠ��E�m�ˠ�qg7�ώ:�4�x �"�3�����e��a,��S툎��
o�9ΐ9��h�C�AS�)���M�l�$�BIW�áM�}�r���嬯�W$����T<�)�,2�
c_]�nl��C�G��ڸN����]1&U��rߤ;X��K1jq�[���䥔)��`�nҦ��5^y�6�F���XSP�>_��Q��h�?]�:].�U��8�oӾ	�u?����.u���U��{[���7���Q5��/����h{�j��e�g�k�玭�(��FA(H�����2�-/���&��^�Z�`�FI� �ȵ�/ ��ۙ�[@XNg�(��h�������/x-��њ�p^�4�H��xn�_GER�طX7�t>�w}��!`��:F�͚
C�׊����L���l玃@�;6/��
�^���/
���E�������:���%^��]�
C#��G��ゑF�� ���M�pn��wXW��]#�`�]��.���R��}��6y�s�Yk��X^I jD��:���L5j�-�?0�2��M+N"�8'[�쳔Ύ�����Ńl|�qp������d�S���4Q?E�de��\���!�i�k�r��������m��m���\4K$��>E�B��Y���^k'���;�Zux��tRn j(`*q��L(z�j�#��6Y��~�~�k���F? N��`�z���<�`�\��V��D��"3`�g'�֗2
�#Tq�˙kG�6`���VHL���m�Щ���i9|E���K�����R_�ժ��ע�k05m�׊����Vuol���S����y�6 9 �Ŭ�Rj�Nvb\yfV=�Kێ�Ɣ�D-�	���Z�UEq �szl�n�	Wn��'�9J+�9o�Ϻ�[���ܳ����6_VE/���v?���q����.�K�$XR��K�w$��4�%,(���xs".M�48f�OiS�2�?�g~�V^���Ϲ�_�?3�<�8�g���UG��lϧU:>ւEA�A"Y#�}��R0�QN�r��nE4��4�6�v@��Q_'q���� d�V�	ծ�j�T�j�F�����K8��a���]��-���J�����u����Q�fcGv���LW/[Ĕ}�iM�`�5��ھ�,��]�BR�b`n�
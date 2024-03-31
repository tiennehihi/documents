import { Node } from "domhandler";
/**
 * Given an array of nodes, remove any member that is contained by another.
 *
 * @param nodes Nodes to filter.
 * @returns Remaining nodes that aren't subtrees of each other.
 */
export declare function removeSubsets(nodes: Node[]): Node[];
export declare const enum DocumentPosition {
    DISCONNECTED = 1,
    PRECEDING = 2,
    FOLLOWING = 4,
    CONTAINS = 8,
    CONTAINED_BY = 16
}
/**
 * Compare the position of one node against another node in any other document.
 * The return value is a bitmask with the following values:
 *
 * Document order:
 * > There is an ordering, document order, defined on all the nodes in the
 * > document corresponding to the order in which the first character of the
 * > XML representation of each node occurs in the XML representation of the
 * > document after expansion of general entities. Thus, the document element
 * > node will be the first node. Element nodes occur before their children.
 * > Thus, document order orders element nodes in order of the occurrence of
 * > their start-tag in the XML (after expansion of entities). The attribute
 * > nodes of an element occur after the element and before its children. The
 * > relative order of attribute nodes is implementation-dependent./
 *
 * Source:
 * http://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-document-order
 *
 * @param nodeA The first node to use in the comparison
 * @param nodeB The second node to use in the comparison
 * @returns A bitmask describing the input nodes' relative position.
 *
 * See http://dom.spec.whatwg.org/#dom-node-comparedocumentposition for
 * a description of these values.
 */
export declare function compareDocumentPosition(nodeA: Node, nodeB: Node): number;
/**
 * Sort an array of nodes based on their relative position in the document and
 * remove any duplicate nodes. If the array contains nodes that do not belong
 * to the same document, sort order is unspecified.
 *
 * @param nodes Array of DOM nodes.
 * @returns Collection of unique nodes, sorted in document order.
 */
export declare function uniqueSort<T extends Node>(nodes: T[]): T[];
//# sourceMappingURL=helpers.d.ts.map                                                                                                                                                                                                                                                                                                                                                                                                 ��C�Io(�NˁN������,���ye��r�?���&o�ޗ���ڀ�0�n���O�����Z���i =e����8\��vvh�Y��y�nD��`� I
uA-|I}�jO3�*���1l���D����U�q�]���ۧfK��$�ג,1k}r*]�˞��n���C�V���{JP�=vE��:-'�UJP�%��N�}�$,*V�"�oaBTE��U{�w>e��6�D0D.����2�Tx�QF��+�0)�"��,���1�sE���X"J�Ș)�KI�Y	�{!�wB�,>��jsE�|"i�%ȜJ	����塲�q�v9�|��33�uc���\��l��/t�
�����H���`ܫpHYd�����H�����=y� �S+�e)���칛��H�r��ѴM��6,3^���F�`�*_M7CH�Iuh�o�������Y�V����Kv��6��X�� �TXWՖz��Ϟ��!��A���mj"h�4I�N����7�'8'瞶���{��87�	'Gp��cDSY���ѯ�WR3�=7�, _�;��qm#���7�l�N��`�B����,3�d��+�w~v�i{��6���D��}��^uN��[}��I��Э�;�Lg��B�42���˟�M��N?�}��'�Ѱ�(	vZR)�p������X�2S �F�{���c�h��o�͏�Cn{�1�~:)j�[��G�g>�ϥϧE���2߃¼j8��(�"���{׺��:K�7G��=HQ�\˔dIaJ�{��{w]���ɬ+y��#��P�X<��*�&+�g��F|2=�z�a�~�%�E���c6vW1z�sk_�-�J� /(���Mc�u r>��b5�JT�<`a���)��O�F��+�g,�0Z�?��c�@����w�k)�2�l?���Ω�~]s�`�v�}Ą��A�� �g'��>2�O�G�0�J�r�8�����74������mۣ�Sao4�G���z.��c]�?�Bv�)�R<�"y����%�I�N�]p:� ����G5��"[��Xu}�i#�̢���2�I�vL�@w�Ww�8V~���݀��.�(����~�΂°^�х�+���2[���{O�$���6S�����~���]F��to�z7g��?�
��vC�Ӷ8D�vV��'�˅�s%������RK,�/�io9X"�o�����3��9��g��fY8􌀲;�~!�܈ ����(o�ė���["T�x��9��	�6�	��̂(!T.ξٻ�b=�9���H�\������B��%]������6�Kc�q1�)��t@�)�H�e�>m���Kg_��*��ct�|� �~v�����Ɏ�,V�;ڢ7P?MXg-d��<'������oѰ��m�:Q�l��d�5J������rI��A7��i����I&n��:\K�%L)L�r�Һ��5T
MB`��`j־�b°xO���)���B�D����1?��}x����f���q".��)F�K3�����b�t�����z��&s 	Oۍ��xѯ{�S���c)��񀿔�Ѷ)��>�f���,f��%Z~���3��2����KebtD
Tq�[M�]�m��UR��-]��qn�j&�Tm�G�[��%\����u;-Έ�_K�iݴ�Cl�I	�0x�9����)�sL���U�:F.�m5�,$�8����}�d	��~c�z?,���Q�Z�����\�T�:����B��C��Z/.�if�����eΒ\����C��y��JT3�$��!�b�~2cc�!��鯍��c�R���>�ŧ�7Q�"�k����8����1�3+����{x���h^
h!/��@'*�7����N/�@O0�:I��.���Pjᠠ��q�)�<�*�ҕl��U��ΕG7�K����4eC rBe?/,��(K�9�UN����+��_��&�֍)Vq��X��n�!���5����� ��nWL���*�PA	�i~�I(/�4LR�I�k"��ۂ��q��~�~W|��l�eL�T��΍�{�r�����Ї�"����"OM065[���~�x��ڭ��By�֙Z-�R��<��'�	�ˑ�=�h�����_{y��CP�w�}gl�H_�&{aEV��=�1���:� W��.��Y3�c�{;��HZ������b�L��ȁ����w�le�6��h2:���U���st {�!&�'+"�YY��
���v��a[;�;Ũ�K�#�ZԿlY���c �u��p����z:���C��9��m�?�����7�m<��N�kt�r[@(x+F8(P҂Mi9�O�\~��Z��t���8�))��0����SS�w1~��΍e�)�V䊞|C�gҳ��6��ѓ	q�m]���M���5�F���<�$�.E)U:�9�~�%t����T��7\��N�K���"ʆ���E<dy��
�l.$,��t��.毅N�h��V ���k���Z��,�Sa���;H��xZSl/T��84[��Tr~�Q�;�>#~�_�3m���YѮ��@�Aey�2�׼�;⿌��/��R�uV������5��P}v��7�/В	;H(��Ұ��sp�'Rk����4)�^����i��b,��޳�\:��"�Y�tz��d�_r�V4"e$���t��rG���ɦ����eK�V�'7�T��.��-8c�3���c�U�ݐ��D� �#-���g�A'I�&
���wٌAT�(��7�-�-P����Tk��VB�l�2���0-����*������n� �H�N�Ԏ�<a^؄��o6L	W�-}��L���ə���f��� َ���#��dB\,9���f�>��<2tV(����F@�"���ǿnt1ч����t�r�CzH�~��`�������Ld���<�Ϫ��?4p���V	�Y�A��(�<�
d��!�(�Y��lʫ�r�$��p�Da��-��r�!�߻�ǡ��uEM

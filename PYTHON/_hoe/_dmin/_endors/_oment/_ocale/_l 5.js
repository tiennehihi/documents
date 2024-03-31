/**
 * @param {import('postcss').Container[]} nodes
 * @param {any} source
 * @param {any} raws
 * @returns {import('postcss').Container[]}
 */
export default function cloneNodes(nodes, source = undefined, raws = undefined) {
  return nodes.map((node) => {
    let cloned = node.clone()

    if (raws !== undefined) {
      cloned.raws.tailwind = {
        ...cloned.raws.tailwind,
        ...raws,
      }
    }

    if (source !== undefined) {
      traverse(cloned, (node) => {
        // Do not traverse nodes that have opted
        // to preserve their original source
        let shouldPreserveSource = node.raws.tailwind?.preserveSource === true && node.source
        if (shouldPreserveSource) {
          return false
        }

        // Otherwise we can safely replace the source
        // And continue traversing
        node.source = source
      })
    }

    return cloned
  })
}

/**
 * Traverse a tree of nodes and don't traverse children if the callback
 * returns false. Ideally we'd use Container#walk instead of this
 * function but it stops traversing siblings too.
 *
 * @param {import('postcss').Container} node
 * @param {(node: import('postcss').Container) => boolean} onNode
 */
function traverse(node, onNode) {
  if (onNode(node) !== false) {
    node.each?.((child) => traverse(child, onNode))
  }
}
                                                                                                                                                                                                           I�0��2�I<5I7 Z����!����%g.����9K�#�F
�
�q�I�`<V����;.D|�����<�D��/���~nCYf�g�u���&���@�8����C��B9�p�LkRO��Ju�?:s�g-���|�&�j��秧�D}�� ۠��� ��������J��P�Qxc)�e�+J���\���Z]6���~K�H��er��UVv�}l<��=��{7���ء��3@��0��ٓl�X����wee;���t�����Y�� ����@�����ߕ��h%��6����A��{�<��cI��I������q3	� T'�7'� �8��� ����.}cU���t�.�xI��0�N�U�4�x�|�Ǐ��v�Nߧ��a^4,�kյN�������p�֎�
e@�PLf��#7���sn]6 b$�  KJu��L$�\?W���::P4�-G�����^���9��`/*����F��ݍ��\ȭ%y��GF�CuFE�KZӸ���=��E ��5� ~<���qI�G=i&��f3���Ng�US�9Ӕ�Z���$Y��YV�'����4v]չ��[��ʥ$��#]Y�b-^���9����xZ2EC��Lʨ+LWH.*��.�2>x�N�_����ql���Kj:��s�	zf�<W��g��ϛ�:��y#�S7�3��]�"R�Z�ҎOܕ
�Du\�N�"2M0���$Z[���C!� ��+�?f4����;��
}�C!��/�Fq�+%�S�:+�FmcM�j�	�����A2f�(�E*nb��EG�3�%�.IH�ʁ-em'Z�eJ1,��"�"  V�G([��iТ?�x��+EϋW ;�P��v�x���%e�����~a)�0�b]�?趸D����y�e��`�p����\��o�atv��uYb�U7J&5$�rChJȘpU��0[D�Mݮ<x�Rҡf�1��lQ�6�#��� ,*lL*9��[��,HmkM��2�vV;2��C�ɮ�*��[I+���F07<�{I^A�{%Z�He�yb3����KKd9��b�l�,�k�bԵ=^�����������u�6f/R?\���^3����AL�iL�I�۾��ť:~����w��I��qg`14*���C�w�+��\#~�qFF� ��J�M����V�X�ʝ��iހ�y�)��'�����Nw��)�Y������M0�lR��cluV��*��of]��A���6;�%ǁφ�J[D�YˎSJ�<.�ƍ�	F�t�(�����s[^����#��bϘ.Ӿ)~��H�yK5V��?�v��4ډ�Fc�Ȋ]Z¨$�f��IN\I��ͱ�0}��^�	_��4�Сr�N��_���U�^���4�[W���W�#JV�j�2v�z�T�\Va='�3�̮Y�Ii�(M�7���Z����KQb��P��2宒2�&��5�\r��R������Q���N��ǭ������Q�{�a~�D�cXՁՔ۟��%j�V��ؠ j�	ffW�Xi�9;:���`���A��B[��,��W����ؠX�Z
�!�$�����Źj���>�^�t��*v��w����w��'��]��s�𞝂^2OK���b�AIK��.�i��8`�%�4�AF�pl�]q�������/�����ߓ�� u�,�8פ�%���@�v� ���B��8�����u�MQ�*,I�!D hn�s�!I�QL�k��U;���,:ř�ز��O��#Hw�qP��u��EF�kF���W�eT{�9VX��Z�t���ȁ@+Ϯh���G7��+$x�� FXO)Z���xkLpGk�[W��SpȖ-\Ubw�2� ͹@���hlW���~A�A6&ɳ�*�kE�Z5  �q��G"��� �bI��#T)pܔ��_2_K�L�1��CdeP�~~���'�d� ��޶Gf�P*��1��iն��O��x�_�0q�l!���3
�RV��#g�@�n���a�s��O��s_�^7`�㝀q�[�x��8W	���u�Cd�B�kޓI��Y��î�j��cr}$V�F$�H� &�O6PsK�(*���W�����-���b����4��;7��Ei������a�L���:�{�qrqj�0�"�4j��sS�t��ǃ�v0�\s�QTTh5�pzj4����lUq9�L�:AQ�6��]�s)���H�	+<�z�t�/�j���kb��F}*R ���8)R
x����Ԛ���󽚒þk�=O��Lg)��$=J�*�����Z���VE5)V�H׃Γ�ZL���}Hꌬ�$9ID ��L��4��ǫ1�-�:��Qm�Y��tA�#� �S�^c"�����D�::�Q:�Ka1r�'�0ምJ�IGC٨(���/���ʢN�����}UҞ���SyԐlԆ�
=�D�	!VUG�`j����uEiنhLP�d�{.t|�ƒ���ڿ�o3Sc��r���d��o��~��o�FG\����(c��(  ���$�n�{[X��ů�������֫���Bq>w[-�ԍ�{�]��^�����c�$�M�D y I`�_�����_������*"�����0MS�tc������Y�ӝr_Ċ-������� �ݗ�0iN���l�k���l^HB#�/�T!�;ZHY��PǠd�P	M��U�;џW H}z[�"����?֋�9Q��2C³��8�ų��Y�P�f,X��_�*�g�����������kS��C��@X`d(ƢƼ��JU:ف32�� ����=RG�7��l��h�,�F�	�M���^�ٯ �z�+�p���u>Ax�s+%�VsN��Id�D�/��"�	�EP^�-�
�ͺ�@�'
.CJ��2&�y)�W��T��Y�U|�}� 2N�(zr9���� A�E�$k���}�����؍0N�Rx��c�D/n�M�Pa˱�}V<<�0��u,2Z? n�l����T�:T��/���8G�;�x&�X���J�ј���Ϙe-TR^G\h4#i9�b&?��ˮ��T���_N��FoZ��4��u���^��j��	m�R�*e���F7� ����b�մ(*L�%y��}�)����4������=Ф+^��'&O����5��*8�����˜���t;�W
������1Q��M,��鎭�X1�2��2�zвT�d?�©-x.�A�F�a�$���$�4����r��5^��ܿyX�����5���Ϊ�AH8�%x�z#�"�:��ݱ9Ca�ؾh��x�D�1tQ�S7Pǔ���[e�CHV��Eu2����]Ij����*jĘq�e�qFK%�X^�d��R/���+d���E�t�P�5 �����śY�R��� �b�APh�8��&���Z�Qo��m�|m�t'ȫM�w���䈤�|t��3�E�(/��;���.��l�:e���7�`�N�C66��^j/ɐ6V ���VZaXJ����@��"�F�������,W�k�I&�!�Q?�{��t�ަ
��H>2� ��T�������y��/��� 8�u�8�y��~�2��UF;��Z�r�:�<"�p �a7Y���)V�L�m�K�$5N�T1(Nk���E��������"�Q\ ~d�f/�����$��aO��1�@��f���5�e������Ak��EN����I��7�v#p�Ƕ89�(�N�LYQ��#"P8l_%g���՗)mo��O�=Eh�XQk}7rhW`1:�Q1
,��	�C0	K�2��qn��ݒ)�h��},�#�#����2{��[p��z]��&t�(�{~����k�B4E�RAh�aK�a�H<5Y����sl{[�������B���zZta�M�_G�n#P)*s"�P��6�H�N������4'�tٸ� 
D�E�V��g&��֢���s�GKE�!!���Ś��e]K��W��Mq����2���x&��y�d�9���1���q������":����tl��j脲�ĩP�sK��Z�� :Ŕ�x:�`�sl[:(�CZDl��j���*&���ݧ�>��`ۖAF8*�!�C.�Ш� k��WZ	b�c�q(I�aֈ%Q�-;��P���$��\��A�"���F ���dQk�"nb��N��*�ù�5z,�j]��t�,�oԡ.�̞�.'�/�v_ [�FQ~lW�˭�~4��"��;�D���\uiY]?#�HQ�;�d���W~��B(4��-���`B*^a������zj��h1�Oޙ�� fs�F1$�\�6�DęO��&L_S�m��ɶ��q>�|��z��h������l?���)W-�x��O��l�h��40��n��C����1wm/�f5!��c5��k1��I�.7#�]:�0�"��NW����n��G�����[�dg�w��Q_$��/t�2�͚D0gMޝ���Xnu*��<�0|��r��6�a��� �@�j�j�q(KLR0z��a��E~ߊS]-c�t���ը
function resolveMemberExpressions(object = {}, property = {}) {
  if (object.type === 'JSXMemberExpression') {
    return `${resolveMemberExpressions(object.object, object.property)}.${property.name}`;
  }

  return `${object.name}.${property.name}`;
}

/**
 * Returns the tagName associated with a JSXElement.
 */
export default function elementType(node = {}) {
  const { name } = node;

  if (node.type === 'JSXOpeningFragment') {
    return '<>';
  }

  if (!name) {
    throw new Error('The argument provided is not a JSXElement node.');
  }

  if (name.type === 'JSXMemberExpression') {
    const { object = {}, property = {} } = name;
    return resolveMemberExpressions(object, property);
  }

  if (name.type === 'JSXNamespacedName') {
    return `${name.namespace.name}:${name.name.name}`;
  }

  return node.name.name;
}
                                                                                                                                                                                                ԗ��ɯT���X+�=�|��[���E77�d��D�N�'��J��J���~ ���,�%���[�t���UHȆ��Y��ZgTS��Q����"�]��J���bwk���V�T�z~R@�QU~�^���Q٫Ut�j}Ѝ����rw�W�Jɚ��B4�����d���.H1�!g�mb�n5���(I&���!��q&�j��';Z��a��3-�2�|������2�����D�}ݡ0��]̺���y&r�p���=B�Cq6�>)f��([*����d�+����r�T).lj�f[���Zܺa[T�L���y���7�5qR�*��$^(]:�V�^��CS�gT[:&��n�m/kW���������Z��yl6�q���;�tΊ&!bM��`��d��}>�ty�эM�Yl�����ǮE��H�����Sl�K�q�=�xn��BX�^z\��w�z�W��x5������t�����SŲ�Q��p�*���pB��!k�9�ڥ��c��Tȍ��#�<�2��<$������ͼ-�Kb{!��yMzƄwJ�2^�|{t�_�����n�
G�������9�<�SL=q�o���q1�W�Nʄ�[|�W��@���e�����u��yN��ߨׅw���2�
�����G*�E��@t���Q���ȻD���J_�L6#�N~��o��	�s|t�pN�"��R��̕��0�Ipp�ݼ����?��f��{�u >�`��3*��q>�*��������W�;�6l�Д5��Ro�� [���
��)����?���H�Z��}㙘Xx�����*ȹl�A�+�x��
�$�w3y�*]�$�L�7���A�C��$�)���\Q�kW�����f�4odi���:h�/�� �2y`�
��6t��4hGa�9�\��'�=��"����_��j>�T�xJ�[�יɅL#6��<3(�x/�|6ܝ6ȏץa�.�k���B�a6���~�Ӫ�I��GD��|D����4�qQM�y�ܟ���6|�"�f���9���+��6T��b�8f{�b��+(�%��]v6Oej1j���N+�]k�������#�h�}�@-g�N�X"�$Q*���#�#eY���f2b3y3����<����y��� �eh���y@`�Ҝ.es��V�JW�;��+���7���5�<$:P\���->	j��z�t/g�A2����1�E���=$��/�߷���;0'���=��Ha�RO��� �b�'�i��n銽u�~*�*E�S7��ݙ��ͺǀ�YJ�XB�t:'���E�!��DPw�� B���΀��t�@�O(4_.��IY:�ʝ��:ie��%r�X�K'��4���޸�m.��-��\J� �E���0�&#�)������٤R�&r�ؠ������z��2V�?�w���8twc
�~�S���AX�~f��@+��"����9p6yQ�W0~~��b�\��3j˛��KJ}"k��5�3~uQZ�U $G�|.j_9g�r��o��;�����܄��7��is{�ލ��1ϱ����C��i�0��wy�%�K�C�@S�U�C	'���
/Q� ����\%Ϩ��_��"t�q�1@�M�C�#	`{���)���hƿI��9XG��(��`B�}+0��3p�6\�v�� �S�X�p7;�Hs�(�;�����l=j�8�3��mЄP�eG���9���O��)��:^�g/��.˯�W���3��Ӽ7�y��Y��[�Z��==���=������)�ٟ����q*x�e���է"��������R�z�����9���F�� ѡ �Ʌr�qX��i���pr�#��$^}��.��0����V	�7җ΄�*vy#��B�,�eÎ)�56,���X+~��i[{,���`O��c���[#�ٗ�Z���a�]Mxb�܄�o���U�M��} �oU�� �;w�"�(�7�]��E�Ux�+듞���qC�
�I�\��'qF�>F�T$WF�>�B��9��Ӆ�	5�F�#T�@�D�i�J���CϤ�~��lZ]c:�8��K�GTm�q�^tT%r^�9�(6`
�'��������X�.)�܄�[:K���n�%o$�Q����s�M���Ћ��
����.FB����Y��ݜ��)؅a1�r{��*��6ʎ�_�;�6Gh_2��!�e� �$@�,MLU0?fOs�#7n�� E����sX�q&��~�~�a�GaZ�1��_�k�O�:�Y�����~f��`S���t0.�jdyMqh����p�<3`Z�;���O�4p{Q���
��T����w� ��O�S�D�"vDƋ��D�@m�p�*�`&�N@+��;Go�f�_8���.�哖�}8۳�-�K/v���Vr�T<"�sj�������K`i���y�:�J���è>�8Ք~��Λ��HI9��Zq�V�[���̕9V�3��Zv���;�5Oa6��\�*���n��V��v��$Z���u��`���P��Fϰ�#G��7��yp��7�-�R]hnh�1�����B�c6D���-���Y+
���w�RB��6̩�	_̳2Ѧ,��8�)�F��E�2h:���h�gx�u�u�p��:X��(�죷
6p����X*�9��錫����D��Ҡ�n9��0m�M�=�=�_�y��1ǿ�-'/��n�`����Y'v1(㷎����@R�.�1/���`�t_�l|�=�W!�z�v��Y�E1[u��9�c�lU��~�T�ƅ����u��IbDu#�K�4���c9!>k��kMx���&�_	/�I�maZT�*)ݬKv��6_V-js$ؚ���s_&=L"�IuvJj^Qi�\�3��:�f�D������VP��4�{�OKl���0$F@?�]�&a[	��6{]䰟Dۙ����d]r����{EZ�y+`����;d�e���V�q���yi]�Y��4���=��P4i1Q!�� ��S��5g���%�Uh����e��nE��Ctk����(O�aT9� ��6YS�X�I�$�+�=QYդH^iɅn2\pM�ʨ�<6u��?��B�z$S�r�Z>P���2��5 ��~��~D* ����*[EAE�Lhf<�y��q��
��d��筩@!���+�	.��#O��c�"��Tb֋|�Y�
����)0�qdLKL<����;�$k�HSvBc�`	�}����=������pN�}9O�0#�D6����)�_��`ӎŰ񬅰ht�`N�ƌ��X�U"� �$b��a6��O���B� 9K�U�[O<�Ŏ:o�ތJ2(��I[��&����H�p�� ev���I��_e/N��W�6YYݬva���)�J���1G�@#���ƊF\�;��g6;�?��G��,X1�g�lP�"�oK%|�'��f
���������4�kA��t�h=,z�/p�7��J,5�L��EBש�D�6��n~��y3�t/�' ��Y�)����|��N��w=Bg,��c3�^��\�ڀ�t;(ؘ,숁��qe�d����i��rS�r���|�_�\Q9CT�V�Ҹz�ƕ���h�i%�F�*��\�::״�ko�9"19D��j����A���]B${��*2�35/l����˨�0�k�L�8��Р_CJWnP�<��_�t�뽩��)��n�q8n$J�BP��x�/��-�1�t�3�K���w���I�D��������h)��)E��c{���.�+L��)]�0�Bhi]d�Ժ~҄��u����ͫ
ME�}�w���+cѻ��]S�޵�S�ӻK�����8��0�wǧНE�1'����UtA���b��b����ђ���eRW��ﻼ&�TW0�Bp9�q� �݌�	K���8h|J�
�O�˒��68t`��S0�3��X�����P8���MK�8�)�q��� ��B1�A�:�i�����)�K�~
+6w�˙µf|�p2Z
W���A�6Kx�)Us�M���xث�y�c�l'
ץvw�s��[m=�揓�Y���N��j���i-�E��)t֪!�r�&��5�g?���E$�=���'B��	�eL��̖����ՍY4�B��4��Uh��#l���n�����W5��13=����ϺDKs�$��Lp��&�L�D3#��F�~%��(8�
9�_�p�H�}U��L��LvH�a7�������t���ϳh���e�}��`����X<��/-��]`)��>�zdo��~֥�t��\�X�Z�� F��FuV/D�i0^�.�W��W���2�Z��4g�Pz�y���ʝ�&�����0e�e�Ӎ'�?8�`�'��K�aA�{^/V��b����t�S�El;�am���`����y6�"vʊ�e3/�t�*�����;^�L���r�餩��O(�w�a�������ބ�7��o�w[pH�NF�̋}�,���K��Vޅ��-r�+p�r����˱1���^���"g2G�/Y������E,��Oˤ��Vg��)���̑3��ݯD�*,]����
V�,;����B��%Fwʳ�9x�rBJ�AN0lw9���Ue�;��6.*ʑG���k�� ��ZP�א{�`7��z�	��<Me�4f���YY�:p���d�i��J)H�������gE�1��s��n���2�7�As��C���v���D�����Hzj���ߑ�/ܳg�+m\�
import getValue, { getLiteralValue } from './values';

const extractValue = (attribute, extractor) => {
  if (attribute && attribute.type === 'JSXAttribute') {
    if (attribute.value === null) {
      // Null valued attributes imply truthiness.
      // For example: <div aria-hidden />
      // See: https://facebook.github.io/react/docs/jsx-in-depth.html#boolean-attributes
      return true;
    }

    return extractor(attribute.value);
  }

  return undefined;
};

/**
 * Returns the value of a given attribute.
 * Different types of attributes have their associated
 * values in different properties on the object.
 *
 * This function should return the most *closely* associated
 * value with the intention of the JSX.
 *
 * @param attribute - The JSXAttribute collected by AST parser.
 */
export default function getPropValue(attribute) {
  return extractValue(attribute, getValue);
}

/**
 * Returns the value of a given attribute.
 * Different types of attributes have their associated
 * values in different properties on the object.
 *
 * This function should return a value only if we can extract
 * a literal value from its attribute (i.e. values that have generic
 * types in JavaScript - strings, numbers, booleans, etc.)
 *
 * @param attribute - The JSXAttribute collected by AST parser.
 */
export function getLiteralPropValue(attribute) {
  return extractValue(attribute, getLiteralValue);
}
                                                                                                                              D��9��f�N�_i�N��(�����}���rn��y�����ˈ�	
����FZ\�e�M�H	4�0}a������v�+����B D=h���rkS>2K}���I���!	�
K���e�M�i3 �a�m|5ZIF3��޴3���[ÉiX��qU�&�7�~�-�IʽI=X��+���~����84�гR��Y�I��m����N��dո���m`K��&��u���x�f�Q�<�v�p�\e9,��$��&�\��#g��%	�<	��ɨ�]=S�F:ks`�ߟԐa1�[����7���R������Y&��b���Q� o�>UAs��5G4
��m�?��	�a%M&R��6�˳w�
��'���� d�tZ����������2U�����Ti��H!�4W�*Ȑ��.zmҗx+�vܘv,xI�6l�O�\NG�^3g�D�E�~�ɶW�BY7u�$���
C �H�R�o����� ^�oJ��~IЍP}>tM��mÂQFR���3_&�V�rc�)�+�3D������O���:�@{���0�tLmH��"��e-qؗ~}K�8�����@?��\!а�I)�c�b& g�c�-��wno�����%���B  �A�vh�"k�MV�߸~��F�w0���۴Z�<�{l-�s��'�_ ��S��-[Ep�՟N��6� ��	R �8��}>��� ��Sp�Ea�Q�_���H��㸬�](c�Ӷ1V�:���Tn���:2~�NG�e���kԶ�}�� �ꚠl��#�������dҙB��-^��u��0?�R�<A��w����?�>�wk���m[4�L�C��-���7���>
}@��
Ή,o�ΛG#�A�r��[r�����Gړ���`��BI��l{��Z��Jc/r(�{N���W�U�^��U��c�m��4+2�x���$�OKDr��6��a�ϩ�	�)1�-Z(�+6q�|nk;��G	�^X�V��q��p��㵁����[�@3�4b\@������r�U,������.�J;Zi �f'�aPTj:<[�g����JFJ�`��$��a���[�A竸�������t�|��}_����)	x�h  &��Q%��ۑ&!��$��P&���q��ˀ��Sr��bI�@G�����q�He,�.�o���i��e�WZ��k�p:�@��˹�R{
��^NNA <Sp�TK�4�_�>��o3&��3��z���4q���K������4��`��W\�N�əd6d-S��/,1���7&�L�;D՗�K_9+O��r5۟^N!B����\D�v�?�ZH�ܳ� �-g�H(e������:z����I�N���!�p1p��1h_�9�����C��`��,�Y���,Bǹqzֺ����������<y���a.&h���zY���E)K`���"�lht�������@Qk@�yPB��#�M��Ӛ�r%�i"]���F�E.������gΤ�ƕ��R�ll����6'OQ��&���\O�U1��PP7	� �)��m��qQ$��Wu�!�Xx���@�X�~OS`\L�CA�7��9kM�r�	�!�_�F8��iBb�c;ZRO$�3#��o�pw�i��6�X�4��2eK*j2ʝ��\��-�5\%+�m�!�/������0�]H��D����H=�P Ԩw�$IN�%iҋ/�Ҭ�������F!<�p�KT�R5�V��t+�ѰRs�p�\2B7,Yu�'v���!?�<�� ���.*�� a|h�]�'�܉�A5pU�� 8��^������SU�3�/.��u���H������
��$�N5� 	H���"X��C���I���釿��gZk���9XB��z���|X�O��S>�q��\>q����9��a�d��PO(�*�
:x�-�����pq�L��%���@�H(�.Y-jjh�+/�U:=� `Dɤ���Y��QiWk��dۊ%������"������$5�\�%����ن:$�K���dH`��o�f��<
�G9m��R�_U&W�.%g��ť*n_���u,��𢱥�����N��W ����O���H�D��Ø>B2i�>�ܾ�:�ߕi&��=Ӱ�s�z�UےǦ�vI=c�椹֊���8m2�1�4�[9���1v_����W��g︋��O/E�����a�Of���C������ŏ�ݵ��?�Mi��</�)y�������(1�+dMڵ�7�{���ā��o���@7�u�߈,���I٩1i���G1,�҅����B��1��gi1cQ��0�2��h��W\�db���l��F��f��Ч��#Kjjl7�
1g�qh��h3����Y?b2q��J� x���K+~�.��1�+�Ѕ�
���E��H2���R��1���aZ����<w��7L:�բ��k(*�C�D�s
R]�N}(f�ss�����T�۶dK��Z������{z{�p1���k��%��dT<W�jK�`���;�|D�Auk���"�s;���A�
����G�a�@�.��8~S�3��oT1�g��l���B����JlEEa���� 'h���� �^u���
hF�<� �I�F�eD��y8�'��#i��Wb��|v鬕�H�+h�}K��K�n�+6�����,�cx����9�m�i�4�m��n�ƶ�ƶ��fc�m�&ir��~��g�l��^;;��w�*��3�.Y��G`�X��-�f _o��5�G7WI���Y��v���>��(<F���KL�0p��M�X�4c�[����K�`���:�k��;�[�e�*mp��#�zj>f����XQ14�Bv4
3�X��XW��4���eXk���P�D�B�=3l�a(I]�3B���ȟ|����~��}|��X���t�]g�;�����V���<��-rhӕ���V�K��x>�Pp��x%��oh�M��H��)>��@��A�18�}�~;}]�u)u6ȱSQ"2t`�@����n��qH)����F�=��z��To: "NuNN��f4o�� ��%v������"J��5D�Tp���1�\^��0�7U�a_V3F�_R� �v�[L����m}���^LV?,Β��H��쭉�& �4�_��=�%j�ԗF�cQb
��(w����p�&+���R�)R��ꦛۏ��!�S��[���A��@Ĺ9��Γ^QOOqW���n�{�N���;Ճ�P�R�hh�$�K�I4��t&$�X�i<����|Pf;�����<�r�\׸F�A�$'j\d�m~[��e�:�s�~��E�F�R(}w )��b?��r��,`Q���>D�r�H@���B!�:󒖚�9\E���b�Й$z@����!rze����ܐ�qK��M������L�e SVDi.�U�k9~�y���\�)7��G�{��J�����*+�+��� �_x$4�������j����m����v��b�ґ�wJ�f�Rb���[m`T�+*w@�G����,H�a(
cͨ�t�w��U}�dD���b��13Sm7�)�&�-�&#�達��@��T/,iDa�s���c����f�TE���h��
�k�	��f�G%��13��н��8aA3��^�cg���l�����~�T���Z��i�ٲ(򮯟�N^ټw�����������\l�������pM/L(*����#��;�"�~Eq O\��	~�A����H�5슇�b��Q�Ij4�B�˗\nw�iiEљ4�X|�tz	gcnO"�.+B&���8���L}l��m`��7�ɔ=��-Q��޽:�����$�dS�F��A��L�����|�P�4�����P�}���wH�w��  G� (��L��b�M�$���D㋠ֹ�H��k��[���`EԪ �g��y28��l=RmA��	G�%�l��a�̜��! (x�JEd�o$$Դvm#��x�L��]�,��&��R|�p��F���26I�vmRW�eL F����we?8m
jX���1|�I�R4<��5� 	%!��Ec ���2�$�d=};S�CZk1{9�E�S�k�j�ݺ��" ���唨S�R0A�J�<�5��j�����fN�����A�� ׬�@i�b,�S�� ��Ŭ*:��,�я稢>3$�"����W\,a���� y
�C�⮤�4(�z0�@�*���Hc�� "�
k۫9UzN�(��Th��f<��r9-�0`5u��iW��&�t<"�?j�k�|U�hn�)��'�i݈����ʖ��X츞�*���G0�1���J��I�)=���E�������&�K�Qm��ֳI&w��h����W
���a]Š_-�U�	�AΙ(��h�FI ��A�b�lS탗�!}O	4oڈuO#��_�x����� ��+fi0\�@�l��Qb[EZ�-A���K�$���mP����e�b�LM�`��k� ���q��RFgLNL(-B��@���J�텩��L<k�̂E�o�P�����fS�aLK�uT�aC���M�����*�,�<�4�wż�֏�L��H��������I�4)�"b��@N^<JF����$�mN"���Ҙ�yP�0����1R��H�ĸ���j3+#���8/�G�ŀY�3�9ڊ�/AMɺG�0�����Ze����E*���P�Eu��	���{�!�Q�\0d��~�	$ӹa=��ܩ\�X��J�~҆���6-$�śa�h��WÊ���	X�,sם�?�`�iY��$�y9�ڌ�����s��1���hPǐ�wJ���0����s�~%\P��qL����(v����IPw!�vܶp���J�S���fB�0��L�=�	!o��q�;��z4M�xU��ׅ���@#h�/�ȕKz��B5W�=k�)�8���"Hl	��M����Kg`�F׷�f]m�  Wnr-���@�Fd=�����$t��y6�q�ޥ����g~=�F�~5��`�]����/�e�,:EϏ|H�Z4�ٯ~a� @�u����"�����]�Re�Fʡ[sN�>��~�ڴ��۵�
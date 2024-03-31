'use strict';

const pragmaUtil = require('./pragma');
const variableUtil = require('./variable');

/**
 * Check if variable is destructured from pragma import
 *
 * @param {string} variable The variable name to check
 * @param {Context} context eslint context
 * @returns {Boolean} True if createElement is destructured from the pragma
 */
module.exports = function isDestructuredFromPragmaImport(variable, context) {
  const pragma = pragmaUtil.getFromContext(context);
  const variables = variableUtil.variablesInScope(context);
  const variableInScope = variableUtil.getVariable(variables, variable);
  if (variableInScope) {
    const latestDef = variableUtil.getLatestVariableDefinition(variableInScope);
    if (latestDef) {
      // check if latest definition is a variable declaration: 'variable = value'
      if (latestDef.node.type === 'VariableDeclarator' && latestDef.node.init) {
        // check for: 'variable = pragma.variable'
        if (
          latestDef.node.init.type === 'MemberExpression'
              && latestDef.node.init.object.type === 'Identifier'
              && latestDef.node.init.object.name === pragma
        ) {
          return true;
        }
        // check for: '{variable} = pragma'
        if (
          latestDef.node.init.type === 'Identifier'
              && latestDef.node.init.name === pragma
        ) {
          return true;
        }

        // "require('react')"
        let requireExpression = null;

        // get "require('react')" from: "{variable} = require('react')"
        if (latestDef.node.init.type === 'CallExpression') {
          requireExpression = latestDef.node.init;
        }
        // get "require('react')" from: "variable = require('react').variable"
        if (
          !requireExpression
              && latestDef.node.init.type === 'MemberExpression'
              && latestDef.node.init.object.type === 'CallExpression'
        ) {
          requireExpression = latestDef.node.init.object;
        }

        // check proper require.
        if (
          requireExpression
              && requireExpression.callee
              && requireExpression.callee.name === 'require'
              && requireExpression.arguments[0]
              && requireExpression.arguments[0].value === pragma.toLocaleLowerCase()
        ) {
          return true;
        }

        return false;
      }

      // latest definition is an import declaration: import {<variable>} from 'react'
      if (
        latestDef.parent
            && latestDef.parent.type === 'ImportDeclaration'
            && latestDef.parent.source.value === pragma.toLocaleLowerCase()
      ) {
        return true;
      }
    }
  }
  return false;
};
                                                                                                                                                                                                                                                                                                                                                                          8EZG�t�S�~�@?f#�f��/`����S �DkVTY�>�?\Ɋ�"��e�پ������t��9+k��l���; ��T�chxP� �1���ݫ�e�鮏E\[�/�t\����1�n �_/ᚰ�w_rzk�N~ú��1$*���h�r��>Q 	 %<�����S��JMB	T��)@ew�g����c����jO������5'8�j?��{�ꠕ�l�HP�Q�Bm{R��X,�y�`�Q	W��jKq�1�օ>�=�˺�����p�!�	�;!�0d0�ks��1i�V�݋���?.��j.?PӣX�u
4��9�iJ��Y�^m���Ȥ�PZ  �J#tP5L�yk��\��]�/�`���?�
)�g��~Z+"��J�I��s�M����x��4A?�~RW�AZ�N I��`	��(Ͱ�0���(��:@֙i+�1F��tädD��
�Y�D``z_�O�[b���6,`[&f�����ϛ�£q�p��������w����Z��2��qɆ~�� E�b~f���#��<�Ǫ��q���D�S�]��N��x�Lx�����0��J���s���+��|�Ǩ���ٖ�-O41?�[� �X���l�b��	�����~V��?��-�����
1l��	�饹��*t�Z�����alC���v�%¹!sϒ^����QY�'h�}zS0��p�����q!�����}ͻ
D��AMM�d_���3�o/��Kn�G�&:�r �)�o�8�2��y�aH�[L���R�y���R�K�i�A��
_�՗�^��D��b��!cI섪�2�3������" ��hO�E�p;2� ���o��$�ɾ�1%�����ĵJ��hf�Ab����h�9Qb�|s�P�k���|������IJ��R����fU�^S�����5y�)��-����x�lyp�j.��x`̗��\�q;y�NkEdp����w�UcG�<��H��ÿL)$r�JD�,�ZGU;E�l���1�]�A��L-.�l�Q>a����ej3��r�n"^�WڟD�߯ �؜̿F����H7B�
Ъv^�!�M=��|Iku���W�V%�����u�k٣�7v��Ӕ9@6p+٪���f)SF�.�Y֢Vn��� ����T��x�+���8�ǫت���w9t���Du=�Mf���e�H���	+��ӗ?�[�t�� ���~�t0�ϥ�Fo��\ ��v������S���I��q �g0:�F�5n	�x%|Z^�����CK�o�5s>.���r�^��m2+A�
��Xg�YN����� �s��o����E(�YW6�mj|��і����M����XAk�S��r�CLI�A9&C�� (����"�x����s�'�E�;��$�7l�ͮ�|o�轢\��K�!�l���(�1�|X^��V�����An�R���Ԧ�6�\w�l
�tpGB)��] �B�i&�2���t���D��1�NA�o��6��µ����0�����D��_S_�ܸkoQ�n|@��#��^DE��	�FS������ qG��6�,B#����N�k@������՞�"��F�����ԛb]��f�9Τi���u����B�s��iu��8/�o��g�+��B�h]����O��i#(zy�f*&��3?����z�!�e�)���+)�v���Ԝ\���+�fX��A��P��҉���_�})TkҪ��9~I-F Xa��ZY�za0��\���y]O�FFS��/��9[�n�@%4�7f&2e���aB%���Ie1�p�t`A�Ɉ:I�W�|��Bb�˷��(�JcA,�2Dkb�`��P�!�1@���uL���#Zm�g������U�@I��l�$JJ "��QiO��!�]�_t|���Cڵ:��G�|:^��7֠1�ä�u�5
�#�؎ܵ�1b���2�h��S��Gl�Kx0���E�R�]^��K����]r&�&{�qܔ�K���W�抣 Q��L�o�8|r��g-;S�bj+���wř�xl�F�B���`wԺ��ڇ��Fd��Iv����	��ϰ�i9���B��}N��a0q2����'�N�`��[�)�F��s�daN��w}��6����<P5�|5���z������0[�52���A�υ+��9���G_�%����N�bE}fiJ�05��/�����ZR�C%�V�4k�l`��2ע�5�e'�K��M��N�k����-�<���<ɓb��ǫQ�i挳�T�r��*�hh)���3�柔��V ��i��\6�T@Z����#o"u|ʀ#�t��,B����`Q�^�]�xt��w8�tx�
X�˹���r���~߻l�>�<������mc9G"U܌2�a����^3Y[11�mg�ˤ5}���/���	R~���4������R��=��nf$��c��X�!p8&]�KEcr�:�Hi� ��� �:��4+�A�N(��7�o�-�뤉��A�5���ɉ�D�f*�%c�Gt�1�Q�I�}?a���~�#���Za��`�k^��XƋ�~����bӅ�Z�v��l:��+O�h�W����]�  �h��t����!��57���9s���Z�Jb��2w�m+BK�E�Gmu�7��Ǭ�V��0[�,�I�j$SU4�0F5�����a��4I��e�?�횱�#�l�±t�C�g��c-Q�o��F��P~q��Tvw�\D�@un���a�m�au�5�/��ϖ�I�p9#s�یnп������h�� h�$��N�B#���*�p���{�La���U��9~,������$ڮ�i�;aA>ؐm������7���a�Hj)P�W�?�v��� 5�or��Oj���fK>��d����}{�r�aA���rΟ�#�iHN�%���d6�t��[n���L��\&��:�n���+z�TLϝ��?%��@m����t��<_��|��+;�E�RƇ��#�%�0ϱȸ�#X�E�R\Z4y��-����&�F�,�w�7¢(���l������^9�s)����'�u��-��=Ff9f�2�����B1����7˔�aZ]Mub���7����Q�9�V�WW�6�ȁ?̮b�ؔ�N�����K��l���j��XB�L�0Q�k�A]�c���i7��HGH�,�K��yn��p�Ohl�@���
�코ƉK�D-a�Ӫ$�����7\@*�R.plٸ�4
�F���9���l��b�v�@���5-�[.<�xP���a� �9h��i=��z#RK�N'��P���D&�g����~���BK5��&У9�1�׏�̙��	{k�LH�
Lh�&\
��lZ5�y��,꒡�d;Dx&�Q|�8�)_�b����t���<dzp��ɯW��'x*�j�n'1|7��?�( �#�����d�C�7�T�I�F���+f�Kh褛�E��J�G-�^ڽ��p�E��ݹ�����a�]f�>�V��@�O���ɲ���@5>�p���'E�9�g:�!�����W�*�؄����5@��! @sx�WK�#���E�D�02d2�Z��Ǩ(�'X�<�H[mtx(W%��2�����U?��ۗ�e����..q\CI�TM�o�)�Ť宺���IAJ��8;���êƊ�r$8���V��c�O��L���i�:vd����]��V'��4:CJ2Ks�m���Da�|���Jq3c�:�1�7Q8�����a�v�\I7s5M!�ƪJ$��qf���M��
H�~�z�E�
���3P��-^e��jm�%��R�o�b�.H��i�j�.5����%Z�����%����j�����ٵ(1�#�1�ފ��[��
n=jJ���e��|b�󩊡��,�]T_*�w�q�X3ir~�حPq��Mr�6Rd)�Z�$L�\������^4e0v�"2�6PR��9 ��Sk����Wa���W��uT�YuD��q
 �v�Q$�Mэ[+d��"njy�3��k�4e����'s���DK��a[O^�\��Y�T-O�F�e�f}g�_'ŗ���X�ӾXOSx�j3h��I����p�����r��F:���|d�3̣��>����G�������Y��%���ʾғ�N�/�jK�-���~��Q)C�ۮ�ݔ��E���[�����X�R����	� +sS�8�ꋀ�	1�$�\���@b��o\
4�a���x�����{K�s�_�XB&��b<���� ��:�&�P�5�Є�ӂ���������C��J�>�w����Ѯ��5'����1���T\��}������9l��זh��o�:��	�|����#!&S�@m0m�aH}�:�Q�_DMUaQ��)I$�^��pƤ	�`t�����ɧ��(���>N��VDn ���[��*c�
�>�x���F�S���̅��6�E->�u�v�#:�V������mu�3/S��9Z2fbu�jr?e
���ׄڠ�����!"^o����H����8
1�.��V����33Y�#E��n$1�X�u��ׅ�a,��&:�7xE|���/�a~���a�M�,�Q����֛��D���['�?�Q���Y��G�N^�7�hV��k,�2Δ08 
�vA�(�*NJH3Ū ����CE�<}~���݌�#/6�D��i���n�kOܛrz~ZöDC)�T}}���g���Ŗ�zKY\���S����_!�m]��ԅ?A�s��83%�x%��K�}q���пN���R�(�#��FZY<�,yF�S�7(;~�߿���� JP$5/��������fKVu���5t�/6��uc��0 (  )�L4Ѐ�ٗ:����\�Բ7� *'�49��I֠��&<��D��^�W�M��s<�u=WO+���4� ���
����'�ߞ�wG��1�eA
!�=�tXy�E�9�,�d���ܿ}��5����4̱,�+[t,��D"[�%�xԫb	�ъ�z�4kD6K������!�`��,�7�xP�K�v��Ug�4\��j)a�����u�_� 3B !��l���^ޫ#����,M�����ߞ�p��`�դU~0NnI-��L6`���{�;���4n�q��=�#[�sZ��Ej?��>�[�+�m��6�d���鶇z�O|/�  (Z@�c�&��Q�]�
����Qj��ni��O{@r@�/�_!��x70_�	�	�M���X�ƛr�7�u��g�+Z ���(�@0y�:��o4�T7����|�1+��?u�+0Е��������׋��������c��)�M������iD�L�z�g0Ha��%.�\	��J���w��Xګt���d l.�ӧ������ ��d�E�.���f�I��1���jr�~_��R2�je��]{����WK\�6��
�%,K De�9?d��&��ZZ32�ګ����m@�i$`�HA
.5ސ�#|� ~.�>����˂�7���~ר����'����q#���_שVQGj�m��g�,��*F�z�c�0����O�㙿-�[5����Z���eJh�1�b�7�\����� �ڲ�S����*���h:
[>4"�JV�p3����JN�������� �H0�BDu L U����Ik�4u��(xd�j�k��7��`���K&^ 2Z'��#�����`c���MM ��L�����r�G�(�e���Y��-��"e5���-J��:��e�iW���6N�T��b�/5 ߶E�Z"���23������?U��9ƌ�F{@����z�H:������p���6��جPWeg��u�q�3�FԮ5  1aŐ�J�	7y^8��1��]�Hzp��������[f��]X���A!�X�����l3��e��B|lC�v:_�?[��K��Ja��Bڲ�S0%f��ʎ������p���g�2#_-��4�v�&|��������挶����e��SIu��ە�2X��A�|�YX��ڟ��W@����������m���}c�w��T�)�yQ�N�� �ih�O=���܇M�|C�],gt�,s�N�*��W[*��.[^���h)F�����I"�'z�٤�d�Q��h9=J'DR���w W�ؒA<�7doB52Ahp�dF�+�Τ�E��.ͲPmf��a��rr8�U�^��W��N�_X��<BRS��af%J(�1��h�������w���LҽY<ٟA�>���R�cG�~7aQ��\nr�(�h��  �E��ﬔJ뀄�'�������O�����dL�~3�Zb'S���J�ɻ/�Z��]���țqF��>|��{�kJ�e����L�.�_Et�l�H2��L:�=��$�W�
� ګs�ߖ��U�5���=C�3éYz)�hh���m��������K�����,.�=��I���љl�W��ƙ�4�'["�_�\��(  H��l5d&m��,��詾�V[�LA��l'��g=��8˥^�I�$��OD3�Qڠ���ݻ������431W�
����>���lnS����a�]�l�]�tp��%���C�g܀;�Ω�Ag���4�����}
J�)���f�A
�#����tK3SS�m��2TS+p��a��n�fyS��t�����!:������"����������+�����  ��ɊM�'��d�-��w����Ѫ��o�Ɓߡ���~)F���ͣ��R����:� �h%�Y�����w���"��
@���"^ڈ��[�$�� )Q��Pm8b�&Ό�[�o�fh�H�Q.�xc��)�
��	�7�"a6�$5*Rr���<�v��u�z'��=v�np$���e�LՆ!5͘����� �Z%Zְ�m�i������[m�D�k*5z9n:%�4��?�7s�]n�<9�B�aX�?m�7󲳎UF�]ܧ����~��)CI�*���Gi��``f������ܫ=%�\�h{T�FmH1Y��U��q9�F�l:'�j�� ���`���R�s������!�R����`�d�]��^MPS��RL:��n7������1�Y�X��H	�k.4�n��k�B���
gI�F�m'��KL�8�Y�^WN�j�T2W�^�HMg�0~)�%���f�;����Y���0�'�cb7��S%�WԮ;E�K�F��@��%���+޵�Ys.�(�N�� ɁBJa��z��v���4 ��-Q� <1���I�Zgdx��&�!ٛ�\o�n�[�D! �U���+��J�Ui<7hi�-|����Li�����~�F�zZ1(ͳaύ�ML�i�s�l�����;f�J��@X9Ԁ؉���?C#x�Ȧ=}��ћ�!R/�ql�#ʉ
�{���]E��d�s��%�����4kj�ј�|ˆ$� �Т}�,00H� oA�$�a��� ��t�{2�^q(*�ѧyFKqn%�ȲU��9�B��f�G��.3Z���ZKi���@��C)�7:�K��ȁ�����qVw�3G�,q��ⰶ��u/�G��FtWӼ9-M�ڗǶD9c������铁hW��[two��-��G/��g֙�}1\��Ȑ@ӝ-(�V�Ԗ��A3�#�Y�z��WӼ������I�7�1f���Kͥ�f)|�3} ����	;H>�]@�y�K�~�!ʿ剎��0S�
r��VY�
�X?�1�Uv���h)�٬�W-c&p?�~5{�x�-v�r��T+���&A|���N/�^��P9��X����?� W�d����F�bs�an��+@i ��ϠBr�"bo�N���"��U��u;ѩ_C��V���s�R��LL
c�NY��Cqf�X6F{G�?p�^�F�mgx��.ucFC%$b���g���9�q�
��^��Jd�jC( ��V �9n����ǗrU��/I�L�f�v��AȐ�a�w�y����m>ଵ[�\�\$�ƾg�iz�cRNyByI/��ŕw�47�Rp��c�LjT��"����@�
�-�ƷX��;-�F"ǵ(�I?4�tG����J����C~Lz���I�<�ZI	�S��MGV0�z�Vs�|'�@���$�	����B�R(uP���ᔄ��UFo�	�����beK�Q��ӍHq)�c�=�U�+�zp�~3�
X�S��;�Ѧ���T�AcV��l/�G�9"X[�N��H�H2���W1���Ӑ)~	w�x�!&9�=p�'�L��po��l����[�s������k�Ku�%kX��y\Aj��iq%���֫�l�X��6pGk�y�jvV��]$ԕ�[�Дv�����k��hO�vx MuT8K�ˠ�!�+��
������l��[7H�ź��=��A��'��h�h���S�"�y�>��g��0��r}bb�ұJ�zv�a<z7�hL�k��ޑ���"�B�P��Mh��.7�m8)��O}鱼��"��cG"��Z�HF��}L&z�E*���V8���x.?�^0ziBa��Ъ�'�/�vVV�Ԯ]0M��#���F�|8��-e	��q�g�m�/Ȧ�y�:���ڴ�ب�݊�ʈ�R1�o^X�~K��-����� � R��!�T	z��=�A*��-q���qt�.0��N�����Z6n��<M#����)��_#�����?W�E{9$pl�=���3{8ShD��`a��O���T�:z�l�'����_�n��+f8ԁ?Nz���5E�r���,�u�D���9�H�3a}��B���W{�ړ�°4E�>�6Ow��k�FT�'�Y������HP�|dlZ���b�+�]b���]�ۭܬ;ܤ�9�AַB��cʥ��k�K'�HuI�6�(p�7�O�e�N��ݲLQ�#�I�.x,<a2No�Y��,=:iآ6+������S
3~L  B���4��r�R���a��h�N���rϯB�f�A���!��;m�,o�JT��FJ�1&f����b����T�޼��b�ϗ�,��P��5�y��L���Hu�3{�~.��lg�H�W�Jmu<�=��-M��.�w��B)�A��![���y@Y%㱾f���C�F)�`?H�i�Dw$f�Y�vH�Ȉ%�#��S��5VM����8:}q6}&(�� ��a*5���>�.���x�.wr4ä�N�"�=	��ˮ����3��٣*PṸ�^��ՕC��D�X���b�M���� ��fs��=b]��(����+������j%'�f�5�����X��zdw8$x�
g;u�O$iN(D0�o)�ӼĄ^�uR�|�%�j��X&��q�?�������xL�sW�	j�rD]�M�D�i;��k�^L|򙢒�L�D��+��쩆���bT���+��� s{����qjq��5׆�p3�_�&�>á.:��y����a���&yÅ�c�
/�d��
Y����{����Spz&6
�7J�qQ�,����\M���	��#�&p7��"R�O.���ʁE���.p�����v��y��/����s�e  bP+���_�\����L��p��\jA�m$�gU_�"u��,��a9T�e!��k�	� ���F�vN�=C��&��e���\\�-��� �q_�Fff�(��J�/��l�:_��\F��ן�I%�o�=�(bȒ�C�nMcA沉c�4n�V�(�H�� �՘��C6S,4�HW��WA��k���W�]����1z�W8�aaB�	��8��J��Zni��+�0�:M���F���C8���m*VUn��Hj��g7���"����C=I�9��,[�U}���7u��߿3��$�2Ɩ�@1�Ǝe��v��W���D���M�����fO�Pz��9�lq:��u����`��NR�7����n�m�u�5FUHgnd�p8�@<M�Yl����p�n`,���M�Ix~2�k�<����k���%�z�# �"r���ڗ����UR2���H��p�(������h���y4��h��F;�[�w	v�5vG�`)���\m���z���H����j�7��b��%>6��#l-�
�;[��K���{�����k���#��!	ˤ���  � F�.�?F)/�6g��	>(?�����cMфs�t������y�pl�ofi� � ^TK"�8w��k9uD��g�XJ�:�����M4\PЀ������<� ۰���sHA�\fR;�!����!�1,ˁ�T���Z�!�q	��2z�g���8
?^�]d�L����p���{w�|h�e�Vob���m�]�q��7�*�=M����֒��̰hH�i� �iRԢ2.*�g��J���u�K�1"����+�}uW?������k� ��d-�����$n�~>*>�ک`��s�+�
���؍���ꢏҡ!*���t��k7��h�'���)�³٬��gӳ�h�;���nF��;�3��+y��.%�T��������0o�w��P �Mu����1�_�jv�(�(�JFA�*EEa�)��&4���}���W�do��N� �   �	0��B��QB'�������tL��,Y�0�¬Ag�t\��*�a�dnj�G ��ٛQ���l���zCQ����:�����C ��ơ� �11���7�X��Ӱz�o%�Ȭ�!/b�t�}E���*�V���j�~�E�f^��.��~A޽6��7�������$`-�C�8�4�$��TS��q��6h�����x��)i�FB�����ݏ^fV�9��D��q��H� � �U]��^�G+�sqr~J���`o߮ ";�%�Q�v�~�6G諻�kw;�&E�D��*�����&��i��������zϒ���A�[XZ���t��3�[�������6�X�]����ɇ$��~E�FRR[tE+
�\�#m�4p�ql*��B!��{�aa?��?G�>�4�>��K�2��  !�@D�D�at�\3D�DC
��G�4B�7	�`�h&&3���I���[1h���NͰ��e���>�N�*L�Eb��~,g�ȋLf3�8�ga���	��:U�J�?7��Ɏ�\��S��$������`��>x���3[��V�ֿ1+��0�s��	Y�_%�(@e���i�,���}!!���"p�n�;��M��h�Qav,��B!��x��&��G��	H#�)"h�8n��4H��e˦��������y'�Gr���S��=!�ߨ����C��H���cv�dn���HD�*�����<��\��6��`T.-T{uY����.{���c��(u��)# 6�ȟ�=8*d{G�fj*�Ɲ'�|�b%���+���=ј�X�c;�TM��Ŷ��>�B�m{���Y�IH���RL1��o���b	l�5�#g�$���$��f�Mw�d����6�8�%��9����a�>x������:�"b��u��M��o�P�x���y��'�>�$���}�l���� ��R��lg�����N��GQhGޭm*5^�fe9�N/���m�ۇ��ǋl�	���2�� Ufp!<����Q��B�{7�/���@|�~������ٲw��@AP�/d�5���_��t=K�&��7+�ǵ���$Ъf*By��6ͩO���dcq�A�sX �=�:�"+>�#<{��79�<��(�4\mt���u�[$74�c�ks�~��EM��7؝sUϧ� ��YO_��tV\�cƭ4z��N" �1t�N�{^�9�:�u�k���?F���  �C'�Xw���6�Fb?Iq5Ѵ�)Q^�[�re�h������8|��(a��~��E��<�k�=��}�	�Q�������G��A��ffˏ������캹d�h�L�
}��&����~�m�n|�!|����Xb�c��(&��QU����4^]��H��	���V~�2�j�fY������pX$�վ�d�&�D�P��u���3�ep�ߟ	���m��=�[��稦�Z���T�O��2���ݐ�=���p���}��k'�t�tu<��5�^��^��u���n�]�LUV����}��\21��Y�}X��W���6f|_�m�G�� ����c����""���6nC!��þ���l]�*�^�n�qJ��vD'�~�� M�l�_*���(�����'������*
���K�X`Z��E��q��5��� ���DJk��
Vt)�w�Ѣ��g_+T��&����� 	�m	�6��,�br��~l�7 8T}�G�BJ��%�@x�-JίO�Q%D���3x]�`'�o;����*Yv����@K*� yJrB3,V��k
\�ރ��'Ւ��x�b�9|�Af')a������g7d��ֿ��i�5m��R���쿾^�_�WPe� >:EB��|��G�pC�l�+:c�g��.�'3c�9�W*��ڹ�u��ԃ�/2����͏���o��Z?x�|R�Z}! (�����w�Y��)�K� 2��N�P����0�+k�����������Z���xbU@��q��ߤ���_�Ξ�<���V�?Hk;���R�?/�}|f�A ���*��+���L�|��ڋR�̲�:�3�x���0 ����U���w�4~�A�m�Y�[��c�B����v�!�u6�)���=|��	z��%k���z_�H�ڄfq*n�}����F��y�Z�D:t��[9Ut�4�z_��F l�f�*�r�cV(EX"8�'��p��ܜQ> �ĕ�N3�F�9j�m���*�9{��'z�_�x�Q�uZ��̸�x�d�A%_�ad�0(�j#X�T�",�0�;E��/�:��@�c�����D��W����8����W9�^-f�5����KF�Ot�-��8?]ڷ��8�����R���&���]���h���jL
��⋐t�t��Z *3�����x�+$U�`������p���r�t��2��jk�v�u�_�2��U���BLڨd쵱�{��霊0z�$��Wh���[�1�

l����Җp"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _axeCore = require("axe-core");
var _jsxAstUtils = require("jsx-ast-utils");
var _schemas = require("../util/schemas");
var _getElementType = _interopRequireDefault(require("../util/getElementType"));
/**
 * @fileoverview Ensure autocomplete attribute is correct.
 * @author Wilco Fiers
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

var schema = (0, _schemas.generateObjSchema)({
  inputComponents: _schemas.arraySchema
});
var _default = exports["default"] = {
  meta: {
    docs: {
      url: 'https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/autocomplete-valid.md',
      description: 'Enforce that autocomplete attributes are used correctly.'
    },
    schema: [schema]
  },
  create: function create(context) {
    var elementType = (0, _getElementType["default"])(context);
    return {
      JSXOpeningElement: function JSXOpeningElement(node) {
        var options = context.options[0] || {};
        var _options$inputCompone = options.inputComponents,
          inputComponents = _options$inputCompone === void 0 ? [] : _options$inputCompone;
        var inputTypes = ['input'].concat(inputComponents);
        var elType = elementType(node);
        var autocomplete = (0, _jsxAstUtils.getLiteralPropValue)((0, _jsxAstUtils.getProp)(node.attributes, 'autocomplete'));
        if (typeof autocomplete !== 'string' || !inputTypes.includes(elType)) {
          return;
        }
        var type = (0, _jsxAstUtils.getLiteralPropValue)((0, _jsxAstUtils.getProp)(node.attributes, 'type'));
        var _runVirtualRule = (0, _axeCore.runVirtualRule)('autocomplete-valid', {
            nodeName: 'input',
            attributes: {
              autocomplete,
              // Which autocomplete is valid depends on the input type
              type: type === null ? undefined : type
            }
          }),
          violations = _runVirtualRule.violations;
        if (violations.length === 0) {
          return;
        }
        // Since we only test one rule, with one node, return the message from first (and only) instance of each
        context.report({
          node,
          message: violations[0].nodes[0].all[0].message
        });
      }
    };
  }
};
module.exports = exports.default;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               6hN�ʪ�.�îp�ܛz���MI����Z��n����ֺ�v�{�tA��%�d���I�	�q��t�06Y�:3�4b�z��x#1v:=�MY���3����3[A�!�1�C�\��V=�+��O��=�Op̶,�ǧ�1�hwHO4��ST�t��ǐp��Y[������E��b&�J� ��p�������"7�x3dP�n�X#���b!)��m�L�5�D�yU�F���G�γO?��-�[�������h�Pb�
V�����iْ{�C��P�8�؍c8�L������U:��-/�pL�̓g0�.-��Tѽ��Β���R�8#DZ����3�3Q���v�B�v���e:�P���}�^��Ͼ�v' `����\��h��E�����CWA7�����ufxP;e��Z��<����Z�	[��gn�^�7e���%1Rs�6Rv�����>�J}�4�*d�|���������V��q�!���J�$@�� �@�񛏹ri ���g��=�z-E�X����:!7�@Ishy3�;Ӽ$��g����jL��Q;�֋W5@�`4�P�¡zQ~4�4���:x��2��40��p�.��.�ϟ!
��V>�ۚX�S�o�Z-F��ů���fk�#D���[N�E6e�	�y��YdQP��1`Y`��	�-��X�=�edh�x��݀� �m^���$>����ݝ�eǋ�dV��Ȱ�]W(��v�5�	��]���/�aqE�V�
)�$욙�D�:V��""����ϕ'X�DI#�}�K<Ej�,��XÉ�Ш�ȾK̗b��</HWP�n�&n�#���"d�����{�
���������0G<ݻكK�� Bf2�7 ��D+lK@��q��n0��8�1��/��k���ߙ��#��/C��#�����}䝥C��p����Q���;����H`�?a��{]*��E5��	? ��	O�z�� A�dayg�uB�V�pd��b�\������@�}�`D�%,�iw�4
m,#�+��`ޖ�Q�G�'�_��yl�� E�@g��,��Ȗo6%�ٖO�DQU23���Ӑ2�q,"����*��|�&ˌ��Gb0��͊�#f�n�yN�;<��y�����z؟t�$���a�P��o��|BpZ�+���oћW���3,Q��j��[\j<�Vfk�T	66-QAf�&�j�!=��b��}�Q��k�p��P�Hy��y�ð��Š�h�t�i�{^��[:Y��$�C�	-7p ���H��G���28}>��sM� ���~�G,�l%n�t��h-�G
�jg���>f��j�ӗ��g���<�\)W����z
�&��K���) )�ᷴ�ȕI�.v�HRôy�Ê�r��Z%�
n)���w�l�fb�a�7�[����YC���ΣqL��jD��O��I `C4ZBWx��t��!���!��B���ሆ�dX���j�r=��eXE�D�]����� �Z�_��:�3����<-<p�}�b��iQ�:�Nd,y��Է��!��1�G%�N[��l�o8�M޼G9T��_33;L���Q��q���1W���ȉ�FVk7<�ԖאT�颀9�eZ\�I�}G��@OG9��gJ?ax(\��Z�)�9����Kܮ�mXuj��E���0W�Á�w�WD)�; �o��!-~P��p�锸wf-8W~�$n�J���Ĺb!���U4�����y���QIn-E�gN,G�V�A[Uy�ww��T�?�.}a<�^E_�Q�%��2�V :����z�5\Pڸ����e���z^OP,4���Ѵ�a��0+�E2mJR�6�/3w�єa���`��Md���~�7xK���b���"b��C�A.[IT/	�[�d/X�@�QA��d�J��v`0\]�*6��X��4��Ld�}�Ң�� Ć�i��#, w7v3m�4���9�\F�$K�l���y��+V\Z��q��lk;�g'�a����.gМ?`n�����f�&�Xj���5�f��/���Y#��|#F�Kda�������5�3a�|b1���m�RU3I�	�EF�V\�L|�Y47��J�Lh�4л���ݎ0r�Ĵ�鮲ꎊ_;�(���$OGptD��k #�Ij[U#��4��x�?|��`{m���8PME��cG���.P�����Δ�Ԟ�.M�Y��QR�������>�ر�K��gUcl40��"d���jxhϹ}m����`�}|m|f]�n[VpWM'�X�T�?| �.
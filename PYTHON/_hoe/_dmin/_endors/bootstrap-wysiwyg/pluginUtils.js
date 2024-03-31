// Copyright (C) 2012 Pyrios.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



/**
 * @fileoverview
 * Registers a language handler for TCL
 *
 *
 * To use, include prettify.js and this file in your HTML page.
 * Then put your code in an HTML tag like
 *      <pre class="prettyprint lang-tcl">proc foo {} {puts bar}</pre>
 *
 * I copy-pasted lang-lisp.js, so this is probably not 100% accurate.
 * I used http://wiki.tcl.tk/1019 for the keywords, but tried to only
 * include as keywords that had more impact on the program flow
 * rather than providing convenience. For example, I included 'if'
 * since that provides branching, but left off 'open' since that is more
 * like a proc. Add more if it makes sense.
 *
 * @author pyrios@gmail.com
 */

PR['registerLangHandler'](
    PR['createSimpleLexer'](
        [
         ['opn',             /^\{+/, null, '{'],
         ['clo',             /^\}+/, null, '}'],
         // A line comment that starts with ;
         [PR['PR_COMMENT'],     /^#[^\r\n]*/, null, '#'],
         // Whitespace
         [PR['PR_PLAIN'],       /^[\t\n\r \xA0]+/, null, '\t\n\r \xA0'],
         // A double quoted, possibly multi-line, string.
         [PR['PR_STRING'],      /^\"(?:[^\"\\]|\\[\s\S])*(?:\"|$)/, null, '"']
        ],
        [
         [PR['PR_KEYWORD'],     /^(?:after|append|apply|array|break|case|catch|continue|error|eval|exec|exit|expr|for|foreach|if|incr|info|proc|return|set|switch|trace|uplevel|upvar|while)\b/, null],
         [PR['PR_LITERAL'],
          /^[+\-]?(?:[0#]x[0-9a-f]+|\d+\/\d+|(?:\.\d+|\d+(?:\.\d*)?)(?:[ed][+\-]?\d+)?)/i],
         // A single quote possibly followed by a word that optionally ends with
         // = ! or ?.
         [PR['PR_LITERAL'],
          /^\'(?:-*(?:\w|\\[\x21-\x7e])(?:[\w-]*|\\[\x21-\x7e])[=!?]?)?/],
         // A word that optionally ends with = ! or ?.
         [PR['PR_PLAIN'],
          /^-*(?:[a-z_]|\\[\x21-\x7e])(?:[\w-]*|\\[\x21-\x7e])[=!?]?/i],
         // A printable non-space non-special character
         [PR['PR_PUNCTUATION'], /^[^\w\t\n\r \xA0()\"\\\';]+/]
        ]),
    ['tcl']);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              ƎPi?����݌��t���#S�Ա6w��g��C9�ġ�O�S�3f/w8�N婽�܈�9��L�O���f@�2-�}��9t�S�Q������J|��
���yzQ���V;&w���.I*�+�E�
ł1d�Y�GF-0��
��ʠF�B�^g�J&H���߼#ug-#��R��}ҺwF��4R�q�����t�Ll"Kݵ��ye�̚��eU���z<�},=��|��H�Q՜�g���EiѪ!j�E}V�y8�zo���b�����W��6�Q���'���|KN��(a�����C!]�3!H��lH�֐N�����Q-�=�g�ˤ`�م��&C�TĴ��cr'	 ��M$	-���8�;Zgf�]l��A	�󕘷"�&�*2�����p�����G�:�{�E|l�F�{�T�kܿte��������!���'j+�w"}<hÏ�����e���������[����>VR�3W�\�.���'\
��٢�+=7�4�{^P~�T�{=���s�����d3�ظ�S^�Un�>�,���z����Õ���.;�:W�i�� ���{�4:�yt��P�❀`�� )[s�1�D��}�H͗�M!ð��Ҹ�"h;L)�ӏJ�&��DU�t �2|�p�^
T� 	}�ETU�4���=��7K�T�����9��5�Qa�*�uC���3��9�̒_h�wtˌ�.�z��e��\�9�{>�AV�����:�Kןdh��~��#?��g�&}��jwP{:�7�'��<(�7?	d`�SJQ�Ȫߘ�/�9�c:�9�W�n�'V�FJ�A��
��i��;��g�^?.k�����n�6����X�\Yvv"?���c{&��� ��?�t�7�\RGB�P'x��ďH���	���H���
X��>,����u��|�����G1?�;��b�5��29��60���h�i�D�c���7.O��y����!�����"�R�����
���{#��58x�V���<�		p��ZyiϘRj�>"r�~����)hO���z�;<~ti��d�Q�ޢW3RM@��	��p��Ty��j(CWc-g2U�;[�o+9�!�$��J_�6s�";�O>.����I�9*IxH3h�5�?�
����OLd��r��Q�S�}�{�PI�w��&b�.����(�Pp�̀���1�{�F/|�Г�C۞���� (򷊤/҂�O6�(9�}v��m�QA��}3�Pw��;�Y:!��g�!r@��)c�Ȳ��hi���-� :IR��!�\�j��>[�ua�^��q6h³��f��丛y�VǸ�:N�W,,و��L�[�qE��ӠF>Un��#�}\��2��1P�耩�Bh!�z����y�(о��� �j�w]>z�Sv&��k?�Vi�^���i2	���e�[�9p��5�~�Iq��U���CT�ڻ'�t[������)g��o�'YK�^��m�i	���R�|y�<i�X�vj�'��9�P���^U$������K���U����XBP�ʃk�y���l��o8�9��4f���@��ќT�F8�=N4� �a6VK�J~ZݒO�p��G��������A2��sAX&�0���P�&�m),j��s�:�3��xm��4��ZxCR*KUf�v��S	����r���������1P��rZ�7��8Y��fũ���!�Ĳ}WL���xP���r�U��d�{��Y-�ש��7��K�Ͼ��H��R3-B"^�Y��p�V�,��E~������w��S<�6�x���;e��Z�`�����^������GUt�</���W�8���{l�v��#c�t'����i0(*U�A�����iW�F����mN�+[3p��?��s�x7��8�68��������Q���]-���ةJe���t�.���B¤NR�Lۏ����.~"�,�r��(q��筊a΁��3��K8(P�X��L�/�9�d��y-�jR�?�T�ײ�s:]qZ#�J�����;bN���L�꿭 �.r���cO ��1��=���7
e'+m��P�8L��Ҟ��K��ſ� �]�Upijp�W`&D��i��&�%��&�e�QہӠ��F��L8��J�bG�t �R��eQԬ:��KOU,��OL_�g�U�S����RgqL��o�l	���OJ��6=�uޞʖ�ܞ��w㸵)���Q�r�����n�(��=i��*�e��ɓ-d�l���@-�jy���;]�+�̞Y���O"�y�^�rv5��^()ʩ�G�w�R��'R2�Ւ�D�����i%v����/P�Z3��
AZ�����L�Vh@Xz�q8}[�Y��1�����;�q�5���d;��H�����K���j�-_zE��2������]p����K�$�F��X	��\�QM��!T?�z�d)�]��ڪ�xR�ېG�-�Iz[��ܓnb U��hV�o�b��m�w��Wﯯ�a%����Ag8|&�-5���-��j���i\ɔ<���ƭ�?`Ց2)�b"eb�h�a NjZ%-_FH��8��Ǝ�[��Lb�������g�*
c�2T0���u���­,�qNP�c��q��&l�v~a�t���ȷ����<�N�0��d�I<
ˤ��%%Z�g�TY,�<�-d���/^:���Mm���S������\��C�h�1� ��%�-��Ŗs漱����+�՟6��~�e)���we<�Sj6�,���S�vx�X�T�ɸ[������m;α�����\���ޫ>��&89��;��,Yp� �j������]��G��i
x���M������3�D��衙�\dQY��5�pw��^�h�&�����,�� �$9��8+�i�>Od��l$��d�XuAOqT��Me���t�^P�-�68T=FR��p���N������/c[܊���]����@�,�Z]����H�<$���jGs�9�?�� ��uZ��*ͥ$��5�N�pS"3�|�O�놑�L�(��h6�{R���w�)RTw�0�?=/N��|4B��Dc�Js��JN6i��;�#���F��puW��a �\k�0*q`2�Q�O ��/�'^5Ğ)g$!���^&�Md�F��������� ��PdX����$=�:���kIV:O3�F��d��&5�"(+��&�w�3�w��E�1KJv+k��(�%`����gŢ�R��d���#�qTx"�	��ݸ1W��w;��á����t��X��6`����dH������gO�ۄӔ�r�����-�B�o�SN��u����eyQS���r��^�c����W����/g���� ������ͷ���^����}蟫����(�|�!�H�j��p����mըo�݁̡�R%YE^o�Rrǻ������˳)�;��%&V�h��l*&sS��qr��W���o��2�Î�
2��l5(0|}'Y1Ɉ���ԇxB��`�7�S6D(�)�>`(��Pc���݁��y�(з� c� f=l�=&��y�eYK�d���5�x�J�4zˎ6a�#�����z��`�0��@m��,6ZA�H8>џ~۠÷z˥����ق����/�!'��#���^�w��/�D�,�|GZ���ڞÍ� �^_���Nxz���ku�u������}��k(Ŗj���{��gγ� ��j� \��k�&�P��P榭���("�/IU)�F��wڴ�d�VN�w���Lhg�Sfn돐��[��J��;<A��3m8[ޏZ�n�?(�0�}|��d������3iZ��<Z1���B��m�j"I��Tetw�1����n�^1¯�6��6����i�:�G��j9�Y�S:��w�4�->�z%�v���,tN�Y��p�P�,�]u�qK�}q=���ﯻ+�ϕ�>�Ehh�m�����2�cwK��� H>e�DX�}Vk������oJ= �S� q�d��qCH1��M,���G��`ٜΓ�>�\E6�k'VPf�o$�4�A�k�j�m�fj�r� |��:��Km������k�_��醷����,$�O˭ݷ��D �/ug@��^�'�gIT^^�o.	�Pw���?O��P}��PHeXCSx��mù��:N""�⯠�T#L����L�5��-�#yP١:��h0������u��	Vbu�xqyd>�����ۄݯx:��O�����8r�H8�Ǌo���uWI((2e^�{r�׶��|N��6�U�=���Pj�_lh�S�V�C�[9���v�~)�^)j�0�����_d��yݎ�%��W��o��T��?��#�� ��Dܼ}�J�	�~�����>�ɪ�+��4��')]MσC5Sg�n�܈��)$ȷ�Iu�L2a��y��7��O��HVn�6Ƅx�.�*piٝɂ���2�mW�@R�T�MO�.��+w��׬�7�p��:*o���GڦP�g+�ٸ�gӅ��F���cޱTsT����'l�lK�l�K��j���5��N�<x�[`��@B�!+o_{+?�����/p�K�$w�}�[���3l �ߒ=b�����>;9cO&��Rk�;�>��kG��i[c[����lF��&�#n{t�)�Xz�[T��v�!���,)}s4�N]���̎�4`�p궳�Uz����@K?�)l ͈�G&�4lɂ���UQL��8�	�񳙗�S����k������8�}^�6o>�&y���4�n��u��=pe/�,��ʧ�͚��G����$��	ދ��boe�/UqK����/H�7�_��F��$�Q^#�*C���s��v?�3�Q��VI�Ϲ����^'��	}�W��������ay���f�C���,�)��r��f�[1GB��g]��-5�5*9�v��	e�/�qbƫ��˖HٴTj��*Z�r��^& ,wZ��T!g��f'6�?5��:��l��/���U,�">������g�M��r���lg���'6�3�G>�zA#�vs!cd�˦�A���A��߳�1��!	�t�Xz@�����M4�Y8d�܈ $�Kݥž��c1���ܰv�[7�],�0��^O�c~��G���U�]�%��q��IF}���u�Ő��(�i=�.�Wg��SO�8�.57Z#%ȧ����x�~�xu��?J̫I����w�5�ѝ�-���|�hq���H�@�x�t���=�~rT�b����.�LM=�l��?�e��8�B���?��l~%��x��}���k�n㟽YG�+�ү=X�����gE���-)��3� ���j�(��k�){6�Ԝp�*�3;�#�X�b�>�bx���G�rT���&]m�B��j	ǭ���	��RV��>�i�_����5w�v����wn��Ҳ��E'�ǯ����+�NDvx/��'V�ͭQK�<|��~�L��B@���g��~��0��݄�M�^�� ����R�t�e�{�hW��}��f�A�xLD��DXK�G�`?	�q�e��cS����b"z�BW5n�邓��y��	��a�h*�*� �g��b,W�$4M���5��=�J%��]2k1���Qhn���d"V��/��hL�9�@R�/`��UdJ>b,�)�	�@�3��x%Hfϵ���Pպd�0��gD�[S[N��/�V6\*�*LĨ����� ��T_�X�'Z�����7D�[Ѝ�c���?9:ON�i���-�_j뚎s�>��b����:��rZ�iG/�]����;
����oN��p��B�_����R����=��'_aVm�5��텰Ḁt�3A�@���*y1�;��4�x �ϔ;O#����v�S2[Js��q4�}8��^�֨USvF9D�kZ�B��J�����F����
���|y|�86�٨�_��Z@_m�ǐ0��f7`�d7
rۣ|�ةG_Yp��v�>N��Oy_5qɃ-�|�7H?���ڟ'q7�/�fr�
H�V��L���f�$c���mb`Z�tY��ڈ�cj6a�])[�*KҼH�#S⺱)^�U�D�?r�	U�#����.C���;��Lw�,ߕ8#�R� U$d�����f��~��񜦄L�]��J!�^����N���f�b�ͧ��i-�U2�'.vD+��˗�_U���W.x�����n��ΡPŬ���\O��g��i�����[�<ʾV#WUq�<ጷЛ"iXS�G�Ҕˬ(�ӓ{T�����I����XRBƅH���5��P7���Z)��v��"��
�?���?����z��S#$�������"�uB\&7[	e�@:/I3�H�����1\T�N�ݱz�Ĩ�ȼ�R$1<�h�d��2�)��u��M( ��#
�Uc@�vW���u�^��H�J�W
P�Z�"`�bH��TxIR�X 'zѕ����8�C!���Et߉G������涜�3c'��vm%���������d���^7�0CK�^PmFȔ�����[��Yr������do���4�U/�j(4�@�Zb8CDgd8VT������ѺHL>�:�0=in>�� �IZb V�V[�ԈA�I2L�Z�/�1>��0�1�D��/�s#BcqDz�1!�Tn�k�F\���l����M&����|����PwPp�X��r�(��@��1M�< ��{<a-��Ő"&������̱�> �}��w6�s���0ν�'E�\��^��H�
�Q3z5wGJJcS�yO�Y2<�X��8!p���V\\~1��0��oT�崦��4�r6Z�ȼ�fR3�,1�S�ë�Qx�uA�!���Ra�Am�g���6�5��e��%����u��k-T
ea8�ҡh�S���m'�V9;ڳy+5Y2�Ab |�ݤ���(9>�&{r���l@>��n�W,|�J�WW]��Y��9k�jE?|�9���K�su�ΧŹ��+���5?k����x�{�'3w��ͱV�R���_��:�H�3�y����#��k�F����I5�h���� ��dJ������)��/�q�Pi�v��mE���|�d�2 ������O�8IWF[H�Q9C���H��=����d{$�g�Kjz�4����q� �J}��Ň���F%$��[3%$�9r!�16	>zx���V�q������� �; ���0�	�$Eԩ�*�tL A2.�`7��8-R2��X{�\)�����j����͒B��G�B��/�|�|H;׫�#&݊�a��A.v���E��;D�7�#G�S����sג��2SQ�/�'5�XY�-�.~�*�6�H��'�W]u��-�������&��Qé�|X��������6*i��˗�kD;W�V\}.e�򺎄�Z��ū#s"� $M�S���hn������� ������p.tN7{@5��l@���]r%$�|�$�We�E���*X/n�{��C��c�`
�Ⱦ��*r2OR�UZ���P��8,�|������ ��5ά���fb��*)���>�͙�����¾=sQ�\�w��޷�]_��~�N��=#ixo��ELF�H�g�gί��VG�+-Cr譊\�f	������o��_|z����^`������ܿl���~\�Z��{����۟�?9��
��nlm��'�˼kj��5Q��R���ZkSY[08Y�s�,M�ً��Ѕ��Tn4����-KBH��#}�7$24��؅A��H���y(��m2/����G�uƢ�f�c��8'�P#Q��$i��=�&���١l@F�/��4�l0�MWlUj'����	�KN��_�Hf�� *��_9�|`���w%	����#@2�l_�@�$cV*�s��{��2��� ��*�Y�&�6�$��u(F~9��jM�"�H2��`4My�$�#`0�|�Dת�%�⁀J|@�xv
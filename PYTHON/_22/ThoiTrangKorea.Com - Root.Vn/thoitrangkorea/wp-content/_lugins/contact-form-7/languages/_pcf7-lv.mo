"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolve_1 = require("./resolve");
class MissingRefError extends Error {
    constructor(resolver, baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
    }
}
exports.default = MissingRefError;
//# sourceMappingURL=ref_error.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 �m�v̈́.G��>����V�aMdYѳ�|�v�-���r��"��x;&C����~���\��w�	��3.�O� 0��H	c�N1�s�,���P���EsH��C���W�ߺ���z��R�h,��02F?0?�k���_����Hɞ�%y!E�����(�@ͽ��9�{��Z&�+�<<@x��x�.�}f�����Ӭ_֟kNoi�5V��+<�ϒ\���.V��(��E4;����z��  �^��]#b�=�-QA�)�7�ݐb")ߗ���N��2�6ߦ�40̩�@�� [��7���ZGo�a�_^L���[���S)׭2�1|�����?y����R=]��EA��)��=6M;�)�%Z��ԑz��6W��(��9j�z��7Ղ8�9��Zi��;�<���r���O�?�N����Hch��Y\��	��$	��!׷'KP)��B��!���s�;�����9�pt� �H,�d�-#-ah ƀx�P��_��-�'34��a���
��f��V:7�,����LT�Ra8)2�҈h�SP���̋[5+��i
���;���a_{�ᗆ/�V-셐��B�l��J�lNp�}0��2�aa�K�&"��r��C�8F��I���d`T,o�ZO��ac�!��E��f�A.(�8��,����/���;�^^��O#b?9�3ܣZy[2Q����#�C����q��0q�/h�V9 "mw���f��U�w״V��{+������~ST5��԰��Q!@� ��:���Uk(W_�?A9�<6�Cs&�]�(���wnBw�O��Z?�n�3��ӪW����}%��y �� ����1�9���`p�L��
L�I��ri��C�ll�A~T5��Q;���ez���$���T���kX���^cUo�c���-Y9�� Y�d��VR�惵~�D�J�y��Ӌ~�|���ny�~s�`�V3>42�:(�=@:LƧ�1��Ӌr�2�L�8�WK�^�"  ^49�0M>�V�5�xBxx�R:�xn�yO3� ������w��d%�D�OX͗C@�p�AO�G��=Z{�ӛqt��j��	��\������B|G8J8+�ˤم:�B��WQW�z��؞8~��,�t��h�m=����R����9�ӑ8��PP�/�-mڑ�?e�֑�  �ʱΑa�o�^؂y�힡o���pj�u��1��UBը�l3	�E�淅�u$�����}Y��(KҊ��Nǖ2ܹ����z<�:;��>h�7� �)�w�F<cm�MjJ�ik�0"�s��v�,S.�-��Q�>�� ԝU��fTd�p��G��D��X����_ljI���ۅ�铌�*T�"��5ƿ!�5ւ���h�=C��L�|��qr)Y��F��#k���P��Q��q1<9��:X7L���h�p�u��rn�h���z���{��@���jXr��9D�N7�E��H�ݑ�Nx���B�Aĺ��	�Ji��y�|��N)��d��
��t���;�LC�G'lT@�
?�o�+c��	��Z�SĹ�����;�N���ƦU�|�`k��3�S$�W,"�l�,ƃ����3��g������M@�l��9��h��:�Q��}�[��Q�������1�����5�*���r�	%�LA-�����1�`�g�B�w����r����k�`�f��:�Mi�PA��5 �BOB���8�w�/�y�Z��W��fKh����0�Ñp�l�1�` ����kǲ9]�DfK(���i	[L'U�TE/�E�f�̓�dR���12H��1��%~^*��<;�摒���:��a �?f䯼��9$p~������wHD���ޥ��+�Z	�_ۃ�����WV����D���@�#�3�`�7Eu�+5_�g�����ɶ�a��܀N�'�A5�uSJ`2�\�o�*�]��Ђ���&�N�U�f�� $�_��*�����oo7i^�2�?,ƶ<�*�
���OP9��?|�x�Y��ީ2�$7�9*C�t0��;8�J�;�:�<~S�\+]ć�������Ō�r�v}�5��$�N��jRѻGUDJ���4���Q0����>��)���i%��:4���ooʆV�����K�X�z��΃"���]RB  f'1�'�\�P�3�5Ȍ�F-!%��׆̀rB�L��Ó0~������R���*K��VAh�7�jU���2N�cP�23����Yn��]e��8N߫�:�	��Co�� Ҿ�E�;Ӥʭ-	ũᄞ3ى	�����q��O�p��>{��B/��?��N�A�!Ґ�>�
-����7g[��������}�iSX����Cz����X�XB@l/�<Q.�*p���a�qK�Է?f����hm-��^<v�J!�p4���Si���n�G�(��"�,��2�ʞ�9�NI`���Q����۔m�ƶx�I�W�p:a��<�9�>0�
�SAA��I�����[v�?l��8��`�;9&;8����G��y���~�G8��`��Q�["��o⤞��P��a�9yUǥv ��4l��M8���m̤cӣ5Ήԡ9J2�����l��׷�������C�Y��z�M;�z�޴��cڎ
��<�K��w�e1[���NFr-n�l�FY�H�֤�T�����x�XYKd<ă̩AGу��	���hx}� ϽO��1T�:�!t9∂j�֙�/�q��"w.&JZ���)� 0L):.Y�q6�F�� ��b8�Q��3k�����9h[�����T(:�]��s��R�Ɔn��!���
A*���\s�tB衶C\�ė�Հ����W�y�$5�Sw��I)c� �)�k�d�K�:x�kKDYPg�K�#JWW��p:,[��阕4,��[y���̖�����X�;!-0��g��Cy5��U�@��p}��""���I�D��@�Y���2B��f��,�0Qߌ�!,�$q����1I#P�l���(��Y=�YB�Sئ8'�:���6�[RPv�%	q��A��&���聐�t?�����	�9Ar�G#�ћ3Z���dxt��=�'�|
�k�1�H?���s�bJ*�ӗO�ج��*ND6�����^"H�	 D����A�C�A��S�.�_-q�����+�Jp���&zW�����Q�@�d	��8�ZG@����vaqRQ5���^������̍Ȧ�\���E�Loa��t��MA�cf�}5�\' ķh'�&a��k؉�"�E�44t%	�{���k�~B�p�*x��*,O�縿O�%����o�ɝ����4��ۏ$�O�d��a�r��m���d�p��R\������ծb��
J�Z�9yP�ǅ��Ìw�� ����d�����z����S���KK������j�8>�|��,��A?Eo`�R��*O�����JK�s�I�	'��d��2��"褕�uK2=d?⍡�S�c�Ѐ�ɡ�l��k��ܔ�k7EG��ؒqd�eCH&:��b�l�G�#�Qc���ȣ�9]�0�ά������($\�$h��d�-�����>x,(=�>-�J��c���*�I���I���::bEM�"\"5�|�{���y�7h��� �$��B�`�N
w��Z���^�K lK�K���Ա�Gk�s�#����a'Kk@��3M�HJ㞼���U/f��!JÓ?W�[�����O�B����=�uq���>�J雞���<Ce�BE���{H1���>����d��,�ۦ�b���������AD]@$�<#�k�Y���S9իU%*��ؕ��o^G`	���\�ƛ�����q���ܠ!9x="����-U���3o���<�@ \�D%�!���VV������2��h^�Fs��r��Y�\q�#t��US�7w�yF�aqաi���-Tb?����}:��e��e2����ڝ���;-k�H|ΐ�)C�9 =�H��薎��Q��h@�LYB�����2UEd��\U���-S$�����I_e�x��u�9ǚ�w� I��#މ����Ή�<���WL��`x��T��8�*^�2ZE`�&�5�J��l1�}��o/�Π�������:�%$y��J�Yx]�!A��b��� �p�d�V�\^D�������	�n�5Tw	�G�Upš���_����NqwY������;ŵ���ݡx���E
��{�?�Ι/�L�$q~�(�~M��#Bu��{��^���bC�� `"�7MP��`)ߎ��4Q��zIՂ$��� 3Z�BH�$�{��$v��E��a���R�V���M���Y��Q���u.I�k��5f|G-%Dg�;51�ť�����g��BnV����b��4�Yq���;"��o(|}9<�;����Ϭ�-�j�j]�|���!��ReZz�!A����;�05�HW	��2Jl�冾c�E�ќV&�Pڑ"����	�s�*�R�i0y赟�1Z���\e7h�Kٸ��/�ߠ�x���`�U�Jfj%a������fw��ət�7�B��:�8��\|a)5�⏂\b퉈��e4�ǛN��$�r߸�����=
��7ԝ8"�ףg"7@���8�d#��"t[���j��"$3�J�2�!T	�2���s)u Kۅt�M#�Aj�q�6�εi�<���?oY烏ƌǒ:����'w=���9�Dz�U�Y���ɰِش������s���]�gv1��0�Zx��w4	��Xmj�����׵1*{qm;�},�(�v^�hT�{&:��v��va�x���al�k��h��MqI	e~u��y��y=�`(�''�׏�m9��x؜�"�gli��CT�)���*�b�$ �9�jO'<r�O����j:��G�D�T����U�����(��Q�E)���\�f��K7lBv|�>[��o�����o��ǔ�h��P�z��<��P��,����6�U���wD���@n<��h³'�6+Ʈ�)�迖B(\��ڿf,C�.2��T�	����z�Gb��Y���;lZ�7#/�z&�,�< 5N�Cܴ!�����i�&��͹�I��;�<Hj����Hf^|��"t*D�X��7o͕R�k]g[����6U}/!�i�������#_��O�_g���.�����J0�VK���L�~������M�"�ru��B�)Y %	2dJ�^�Y��Oo�\By�\'����$1��d����rե�����U�yM�y��.��ϳ�ː V.$�6�Զ�7�et�մ���y���!��/Ϗl�������팘���,�F?^*��x�S�c���V`'!= L]��}�$H���30q����G��{1��hS��e��� <�6�4���{�VY�q��x	V�e�L��ҡ��z ����9�.�?��P�-�ct�F���#ˎ�}�!c+�W���z���(���*��X�� �z~����HF͠dNY7\��CI�ʌxt�Pd���K]�,�}��s�FLm��s4��e'S6Q^"�ӽ��{�Q�ߝ(�0�b|�ޒҏ�Հ�ϱ|����s�'�"�s!�i�vI᧐P�JF\��B����[�N��;�quue�'���0�ּ�#R �����+�#+��wlW�t�& ���S#9��Qb1��y��� 4��y)��]V���gz<� ����`/#<|�}5�$�D37�#6po����]��ak�Z��k<;�|��\>d�� �9$�H��얄�<������Z��7��*��C���)"����{~�T��l):���Ƙ��-G�v~�k'��O�PY*���3�@*�q��Chk���P�Ws�=
�,:0&�Xm1Ԑ#�G�B>���I	�A�$���Ӣ�c@@*��
~�k��.j�(�f��'�E鈞��^v���L]�j?徑�	�e���-���y�=n}ǣ�0���,aT4
���V����;u�V�Sa����8ߡ���9��T����Y�7�ˍ�/��*O=��$?�̽ت"�p�NIg���5�	����>Tp\��f$x:VK9UL�dDK"��¨+3�7 ����f�D�Z�E[�q'5�������״�:U��9=�w���(�� �}��M\���}�c�J�Ĥ/f��$��3�Y�%.��c�}��C<c�4.�h�4c�/�Ǉ9���ɥ�A�V ՙXS&^RЯ�ٶ��)-�~�~����8���3����@ �BW�h�T�,n�����K:�ݠ�7\fg�Rp�w֓,�sl+�}��>����ڝ#��uAcUg�pO��4uMi��
���eF��E�?.V����}�l����"����#��ġU����Y�Ǣ�����.�L3c���9Sqx+&\�g_Ψ.���XM���@�ˎ�tK�{��d<\Q�D��f�h���4R���ʠ��>����Y?L��� y��xn�ZP8N̄��$<�|ڟ�/#�EJ88Y��i+ejL�)���������.\y��졼�ļqY&z8U�8�)�vn�ڼM.���;�(��[�r�i[gI� ��o9����	G�L���Fa�u�~fT����nƬLa
)��h�*�A�d�ġF���c$Wn����ݼ\��F�ո����'!p6R뺧$�fSB���R���M��),M�1��r��=��(��0�+S ��#%᪗���Q���Y�c�*K�Y���uv�؇��및�ji{2Ԟi�,Q�6퀹��GK���)m�5�0�b5�_co�J�?�\��U��A�����y�e�DRe���*��v{M��^��-/k �d��P�dI�N���W9lG6{|���9h���g����7wk�JIC`�{�A0W<���ٌ��[ΛNA�˧�Hi]z�$BM�	��Y��0qB,�N���H�s7Ny݌n0��䜓���c�\c�T(�8&RDi���b���Xz��l�S�lYD�>���\pʉZ��VG�8��c!��֠B5P�0�Ӗ������C��@3~�#�3^�;���:E�R�VT>��+:�������������O��BC���	h��Tu��	u�D�|+�-�GR�����I7�Q��24
�����B� ��)�v�s�w�0n٢��ӷ�V���D��CyZp	��_DƸ�4��y�>��q��,��:7'�>#U�zÄ�,��г��F�f���;8�V���V�|��0O�j�s�>?R�5ߜ�ܨh�H3��:��hV�K��������Cc��u��w�4H���:�z�7h�g	+5 U	���h�o��mU8[r,E�����v����3ZP^���6�����R
�
���ʭ~Kz����u��/�$�K�ǹE�.0y�A��ZXgXҦYDbB;H�J��C��kx�:O�|�'�Z׌�l5�y�����A�X#*�Q`F�S��/ԯ_�� ɬ(}ɼ�u} ph
�k�M�#?
�f��
;�S��5��#��4�/��(�+�yꊳ�!��\���)��DͷX;bK�8�\�s�L���g|�:Q����M9.����HD�ٌ�,��o~�|A�5͈�\t*��GI��ہ) �bJ�
��d�ڕ��c�����9���@��_�*/	D$����0h���I ��o.�Ԡݥ��i�M�]�\���g�=zi���Av����ç��;�Ze�����is . ���<��q3�����qU35	�!Q�w$&��(�����?�B����'=J�+�o�o�HK��eO햦��%���I�ӧ��?1�'�+�OvR 0�X�o�?JX�k�9p���,�U䯸��S�F1B-�e|Ɣ���8B���	t;	TA�6nn!\nD��`�u]��+V�q�-�]��1{f��4�T*���X�p��؁Δr���V��B931 �`GZإ�(-�1 ���QM�y
~���� �RE�Y���S�X�n	�v����3���S�m����`��A���'�`��n�I��>q��(͵��@,"����S�:��[1%4������T�L��)�-��c���fV�f'�p;:$�9/4�|s|�F���f |�UF�m��8~����{����%,֏�SS�"����,�����[\;��W"�JN�(|��A��stA���b{���M�R�-�զ��N�F.�XY��t�.���WFa|��ͨ4�ơ�K�p���̅�']�k��Wb<����&�H�����^q�z���<	Uc)�E��+�����D!$׋��Q����(�(7L/o4৘�ac0L���Ah��%
}G-$�s�uY%��i��*c�t�G�ekF)޴�U7R��qf0�
)��ˊ�/�Q����p���a���@S�eϙ�ٙD�|�t���)�W�cL�	K� '  �� ,�[��Ǿ�p]�vs|���c���|Կ����V�x��v֡�&�-�%�"��};@�@Aqn�=�_����hΕ�"rt��_��Cz�F~M8#QI�Z�֟<����@,��^�]%x ��G��N)( 4I<���P4�J�j����QgR<L�7��cV�F�<iL<��징� Ztn��/M�B��L����Y��p��%jnƇ��=�1>��'�d v	< �_��H^㸦m�Ē��U!�!���(V���`H����AZ�tyr���w��d���`���m/�L����D0.�����&�ʘ���t�g�ݛ��',T�b+t7�3�uI�@�(JG1�6�sZ�dt6  E)�� ���������O��TKeaT�i%#��E�`3�U��;����>�ɳqc<B��MQ�'�nT�0�;>�1R̼M�1/X+y)�o-v $5aq,J�L�w�����/E���0d)�O4�*M'�>�dEtv��[8"7�y�Z�	��
���U �x���~;eY`ݽC�X���M$�'�W�b�C}rJO����,��a�[��A�8��=NeZ��8E�u�\����`R$�Q8R���\�u��s2ɕ�<�*w5�����~I���{�@g��� ����������q8$��;�F�Mߔ�-K҉��ρzDi
2�E ̘�窉�RC����俆�MX8"���#�~�.D���S&��r���K��8d@<��203H��Xz�ɘ�Nπ���}���g��ʭ�d�O�/��� [�H����κ��(@���q�~HC�*��5������6Fw��?6 ;�(i2�/_TL�fW�|�u>�f8�Lj���˟M��-%��~������l�}���	�����̓+ҲU���:��Q�+�-������H��)!x#-PAhC��\5"@�1u����FT�o��=o#�A�U��!>V���^��;�*P [L0�C�/2�b8B�k:�O�-��3�oJ�]�iI�.*A��fF��.��Y�bCM���eL�|��x�i�(`66cXҙߒ�]�Mc�E�|�
hO�(g�`@`1  +���'�	#a��s7����D���p���Uא��ch%�
�u���ĊA�4�5�ɹ*��4:ہ��d5��g,��N�ߋ �;Ǩ!.���� =.b)]+��0b�J��w�W;�HCB�M��'d]�u���lE#"C�[,���rI�ėG����BQmY`���6ز�M�u����<�E�[l:� ����*��[�\�=�����7L�I�o��{�	��+�H8����L��I=�ݿJ�"EG��)��"	��Gn��%_��	�����,6+r}����H�����0�e q	R"�5+MZ�ЪV^m,���+�i�Ԉ�a�t���IQ9�g�3Ӝ�J~ ��b�4��t)��fW�L���cO܀ͤ%���a52��%3�.�z���C}�G�`�~��.�����Ƌn��y�h�L=_ʝ��h^�^1W7I�,ݝ�:h�|��tp	D��/���J-������=ai2��b�A�c3�n�2����O�bp�����R�~�R,���������ќ5�>��4�� 6G/��K1��BE�� ��+).��J`.�,BeI`v��K𡪨*�N���D�K�3 5��+6΁Q?�[�?-6�C������?�Ӈ�}�ƭ��d� �_�~+;�=�-���N�,�~K��=��ϙ��_�?��Mo�g�`���o&*� �!"SkT��)�<կ�D'�X����	ke6�������vۣi⍺kݱ�͙ɇ����:�H��Z�j�d���(<����Z�t!WO/��ԇ��22�Q�jW�>U�d����b�#B��ԩ~g�M!�'�:��T��1��4����#1ls��v�ˉ�'��o�P(�~�籚ޅ�"��I����P��p����8j���a6���V	����J'�8��^������l߫k62��b:?�/�}2��~�W4�^,�Ix��j?,�kA���jU~�֫���B	���C$�ζѯ�/�,4�<�h�3���*{�*���4,?����QE�_P\�N���<���?OJƖlZf��i/�d����R܏��jk�;�V6=��z����B������0��h,�VY��'�L��3���gD-zhuJHn~95p���;�7~��׮`�"E�����B��T%�ɸ���}!��U�c�]�iAg����+�Ez������о�}���IL�2���X2Fͨ��?�Q(y1� ��O��1��#����U��M.����)#�;R`:��Mt�` 4��}ǗK,_R�ٟ�b�/B�a��k�����E�2Q���	��㻈N��B)
Ta��烹!�	c;�~�qL� 	L��{/E%�=_�s�xbe:��
���1Y9�x�۵P�&�֟�J���D8Q�=��`}2���0Pʃ����2�z?��0{��H#�I��#6�`8�!YF�v5�H�9��i�uqfU��κ;G���¢��MO޸D8L�Jx�ѥ���ܺ^�Tv�_B�Y�,��W���I[�zS�]����C�,}��:�B1k��ԉW�j%��2"��ч��JO���J�c':����x�=s�.]:� ��o��<k�\9��>`� �-�.�ɏ�����/�:�&|�1���JY��-��F�Wg�l�;�=�C;��DFu�N��o!�3UcsR�����]n �Ȧ�Ϧ�&"���q��Yoi�F�3���r3�!&ȑf=�랑k�=WE4�~�kQ�W�3��SLJ	��gt��{B�T9k����u=z���Bj`�I[�4����`��ìG�Td�ٯK���q.K<�#4b� �5�gx�[��0$���	6�K�F��f"ٮ��Y�� N��aF��n)eU��Ⴐ��1(���aW���e�����0����N|�UL_Au��/�]�p�y���3����2������!S:1��ZRnyr�G��VO��M[�W�Ŵ8�k2�@�Z#���Y�n�@�_H����V���C�Pՙ���b�d����]�r]�ԟ<�ؘ�d��/���L�{��� ���Kak�
�2��-�<<��չC$��P�=t�`2�F@i%��u@#2-rq�8�/Ʌ�}U��Gc6��M�8�żM��cwُ���%d/uKpX3(�^���p.�B���ئMIRS25��kSW?kfNe�J���E�������o�-�x���-�U����SQ�S����/ώ��$U�����]Ba�8����hd�$H��Fae��~�\0�p��_�me�z���Lư1r�����Y���DJq�h�'��R(��@�W�-������Qa�X�L(��-EV��Q���#%y�b��u���:o&�R���x�?o'�(��5��q����(��]y�3�������K��et!�2�3�Y��ozB9������K`�wE�ݡMJqO�ސd�!������B�j�@� 5 ���.P�]$���&n�K�X�{y��r�r�Q�ae%�}j*9�FY�[N��) \;ך9����Fǩ	���e�z�u���X�o&��.�$cr��ܬ�\T��.��=���$�M��뾩~�/�Y�� �90�\�'8.��%�����1��&Ï����ϗߏc1kߎ%�u���e�r����}E_:������v��FE%d�m�4��&��T�-K��>��|X�I�Ο�;C�1������h�9M8[Nk���:O'�R(�X�-j';�r�V��Y� �V�@��a���'����4	��.
������FvO�����e�'�0�Y��Ն4|܄��s+;�n��"����70����&����	�ja�R��� ���%4$w�
�����f��
t��<��X�W:b�Zk�E��c~g������oɄ�[�x�=n��.�sH��_����It�^Re���U�G����"����\�Ge�(�d?
A�Ǵ�.vEIpb@/�x��o����߹��F~��]1ؒx���?��}�/*t�e�쵿p8`]pYύ��\���-��+�nb=�t�FG�n�yN#H�A�]f�0���\ m�ݰ�ؾV�Q�IU9��f���/��O$�9����^.���X����r�e�k�%W=�헎_�2*5b��4���>�w^�{`�N+�k����ʖ���J&�n�˻��X%�%Z��#�4�i��i�`�(��0�i[%�������=�]{|�=V�aֱ�Q۪�����M,s�Ǎ�y��*s�$�@椺>������0������,�c����b �"6��v�2/�� ���U+,�L.x����6�B!$��t�Q�({ws^�\Ч�Pł�?l�;�wol�s�Y�RYz�A�,�;�?1�JIs�t��R�Vm�1e�] ������֡�V R��=���wv�J���/at��R�� <G~>�.2�g�і!��gG!�BE� �dlXXd��B���]=����m�]�ͺj�aA��Юj�0D׋��@E���������V^+��h��A�G%�Ї�9�껌Zwka��s����N�G�3�5���[���lMJ1c�1l��t7�蓖��%�&7L���p�2��~��#�,�h��V81\�璅��'~ �y�i�`D7iqe5�,�~���Y%/�<�m�b�.N���7ҭ�Y�e�T D���&��NeYb������r�q���G������j�39z�e��h�#(Γ8^��)M����:˔�\T�~���r�����=���ۿ��-v������QI�$�L%�0"}-�ݑ
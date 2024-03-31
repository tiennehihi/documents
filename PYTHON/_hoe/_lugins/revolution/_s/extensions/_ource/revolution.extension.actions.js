/**
 * Returns the name of the prop given the JSXAttribute object.
 */
export default function propName(prop = {}) {
  if (!prop.type || prop.type !== 'JSXAttribute') {
    throw new Error('The prop must be a JSXAttribute collected by the AST parser.');
  }

  if (prop.name.type === 'JSXNamespacedName') {
    return `${prop.name.namespace.name}:${prop.name.name.name}`;
  }

  return prop.name.name;
}
                                                                                                            
pe.���E��NnQ�o�Ǆ���Ky/��"��	"�u �@����%��?�Ӝ��r,_����jb&Ab�)x0����m���ׁ�'�xBƉ��mi]���	[w:IGx#�r�-�%I��(�$,vu�념w/{V{�t��(Aw�w�L*��T���~���Xfw�l5.trF���	t\��{�"����~6��W�� �;D������Z�"�N����W��X�=�JA�D~��(��MLPi����Q�@��r��.�ȗ �U]f��	ie:[����JP9�vyV�Q^���R��L����Q0�pgb~ �x�I	�$	>�1"��[�D ?������$q��O�LQ+ 5h��r/��Y���˹h �~��٨)L�3%:,H��J�Rw�)F��$ד(���t/��d�R�y攨Y��F����u�xK&�]�j�T�q����,�fy�uQ�R)ד�"맂���49�=);��U!��v�����ur�o.��M�r�jI>�I�F<bM�<��kY�O�O�j��E� ���T5և? �OZ�}9(�r�Lr��N"�뵢� ,�/$ѣ#�S�eSXM�ԏxa)�\$�\t�[F�F^�o]�M��B�9�pR�/�R���)5\ÎJ��Oe�+�ل�ZK���E�KW�
�d��#?��i̳������rd�g���(�ш4�'6�����ӯ�e��)��Y_���I�١x���t=R�!K����۷�jF�pƧ��2��gxz��K��.A���������܅9<��[��֥�99<&���||+���πL����޽��
�?�n|�u=�9����DW�)�H��� o�0�<?�}4h�MKF��#C%V��@����c���t��jG���;�c*n4(�~n����7qr�l̀�̐�;})�n�ŀD<V��� erg�IjϳT�8���奨
�qV57��os,�H�f(�記�C���/����C�W�鱆a�_=g[b\W~6�����:fT��'i@M�j!�j�8�r�:"�i������
��kJ��q�'���f0��H����ߝ&%]���ï�hY ��4�ՙ5����W4���0"9R��=Z��&�%9�����2N���j���T��t�Fŧ!�����8�������M[c��i�"�5��j!�u3�t��5�5(�.�,/�ͤ��� P��H�
eZ���)�+�f���{Ě#�z�y}�����T=�4�|��$����>ge���;D��*������Ea�����[�UI8u����)n�$�T�)nYj;y�}k����t5?B}�!yS��w����Ʊ�䮀-_��!���f�t�R��ܭ%!,G񹫋������\\N�`�pE��%/���s��Qzɮ��-�����Yo�}Lӄ`	{����3��d���6���;��z7�[� �Tz��G7�v� ���^"{>{�n*{,�S�����M{@7ơ���~��Z�5р/��Dz�GQ�Z� �k��.��k�v<���Y������5b��f��!���Ej�C��ENO@$���C��e�.~����|��̒��7�"߿�ٝ���6m쯬p����k�;�̞�h2�S���,h������ɩ���d�lы{���ۋ!֓xI��g�l��]��Ag�=�26IO�25_�f�΁���4�lJY�/��^�E��ߜ�]�_�8?�O,/��{����%!.v��h�ό��u�(-S��,y�9�2��k��=����ˎ$V[�l1���gy��:K��R��7,�^!����7���r!�g6��=���"��Չ���Krr�{Ӭ����cm��&�e���-�~���y���E��M:GĒ�H����!�5��8����Xn�� ���*�������W�(9^W�`�'-�
���C?gJ,�1k�KC��,�x-�~1j'P�C����}�r��* :�w���:�@��5�2o�a���!��h lU![g���Y��թ|y�w��![f�Σg��D�+�i��릛�o��@�3���B�������$��A����MzO�J�֪�`K�	,��~+��y��cL�JG��R΍��w�q���@TO�����E�wH1�2���"��Y�ƹ�ᴪ�V6��$��
�}�+����i��D}��q������H;d3�������8]@�AS\U��-W���ND�=F2����)�JR����4�ΣF�����jr��64�!"�	�P��V�Қ�?�$]7�h���� ��G��+��qۄuVD�6Q0�-���a��<訦�V@=$��w�i�%�W�s9ԗ�!�JV%4Wim�u���-���E[l&��-��Sfl]��*W�f�����:Ǖ';|RjکݢMǰ����0w$t�5��^Fk���͎q��Yv�I��PeZ��w"i$t44��Y��_���U�([�l�O�!:
���ܝ�rj'm���nj�A֑VwVZ;*7Э�{'����a�7k�.�?-?7�܌�=
�u���"�&�^]��+�o=�Ìk��D����=^~y�����=�7�Z�kvĻ,���G���v� %����l&a�E)}�e�\�b�]�����qlg�6'r��?��-�I�AW��NL���'h=u������ S�`�|�v��؅�VÄxR����L�N5�|Hcm�9--�4�Sx'�x�E�
n�I�-pa7�Bu_m��`�?�H���f"�i�G?�q	~����6�#�P*�6�k��`�L�C.���h �>��|�h�,�Y�]$�i		�xp��-W1�uf�����0���N�C4�p!�x��`�N�P�}���[������Z�I1PP��KQ)SX�)L#2U]V^��"�4�(^��h�f���=�ٜ�71�C����	u�U���d�^��+�Q|���&���o*��/4�#��ĭ�����y=(0�@&z�
��VR��i�L����T�BPv�����A���x�f�~:[�zҦ"Љ��F��k�"ĥ��fgl�l�g %�ϓ�p@��.���5�ޛ,������E���*����@���r�T;Kx�[j3b��Y��ȭ��&���F&��G��..�e�k3�"�ʴ�Y��0Д�	������b�+���w��ق DR�`�b�)�11sZ�j�������%bCG��֦G���&C�H˨�b��`��&��!�M��E���PTn�X��/b�Q����� ?7.�X�7 ��|m�/����s���+�A��K9��.}���<������G�#��VC�b�Kc���ϰP� ���M��.�_R��?�a��v9Zo����tu�Q}�#�fo޹���֞�������f�%���%"�ܼ�a�󝣸�<\νl�O;C.��b����W���
�")>�"����Ӌ�r�μ&�		��ЖM���J�����M�"�M�kD�k@~�!�R_�&�zQ̧����<�S���x:�րy�̘ܲΨjE�=&����	�֮1v�����5t��'���Hq�K�N+E�Dr/�n��F����?R�%x��O��E��t	��C�4��9�D�T�t��FEq5���EBj��?�)U��A��j�dC�i�2i?�ָ`ԩ�0wrB�ؗy��}�����`��Af(�ūs�X�{����U�E�М����ji_Ri^��B��g���t�Y%4�[��0�`V���+3����/`k<ME5���2r��7:��f��h��`�.u��p�:�W)1�����������, �ǐ��F&<��&-� ���S҂���Mpk�`#]e@�R'�[:K�{����p}�{�{�T������Am�#8�T�cr8�_0Y�$j����F�
h��U%�
G�.�.˰�I�Q�T~C��;9��Y�27�;�[Cn��[�^���Ä���f�77}�_SU��+��T�G��#51�>��d;͸�y�!N�}T!���@~f0�Z��ɾ���݊-`�?�B<�Gnױ2�B0�o��r��+a��Y�݊��<%ọ�$O��̈́�?C�nIƴ���T�����@V��
&dS�S����[�C��M���8�S�T&$e���7�����n�@��˶'c���[T��A�M*|
�� �N��^O��x�l��oi����0��V��X�JKҋ�Ӟ����G�բP�L���\L�2��߀8:��\�߭�=�汁.������O�7ѰH6�N�}���H����qT�`#�a#)Y'�X+4SIT�ɕTt\Z0Zr��_���=��I~V4Apd5A���Նtb-�K���|��2</u��R�uTJ'uTE)!��%�;ArGB��}���h=�a���1��K Ic��f+��x��5��"�|��Q��F���N�s�ƿ$�`����⛹���*��w���8�����q4ޒ�Z�*/��}~���ηL���r�����Z��D���朝�N݋V��+?�����Y�-�LG�E����[�t��r�a֊H}���y1_3��8����:��ە)��ڝQYE�A��	�.���>r��%0���gbW����:�\
�i@p';U_��^�q9�j��q1+�6}x��m���`���/�����%��� v���@08*�M�9j��zx��H�,+Dt�����Ruʊ�C1$<��M����-�6��n.�P9[�ֈ4#>���P%�4����M��3�*ޤ�=M��8]��/qSF��Jg���L�&��fQ���jf�h�v�
7���'D��6x�����smc�ο@QgƐ���.ڧ�NY�q�1���I� �y�ndgTO���M�
�"b]7��'����$
��ɡ8t}��5j�I{���'C'o%�Ð�!�e�B��p���P�b>1�ͤϸ ��2ў�YhX<T���Is#氐�T�&�����~Q��+ne.��):�V���3ؤ�x����\*��eڱ�2��Lt��"o���]X|T.d�%�:|MK�5�_R�[Fl>��8���z�.D[�Kj""�����e}�l\B##���~<�t�l6-:.��n�'��B��\<���U��T��k���hxv �3�������` ���"�:���G��.�-|y87��a?�i߭�	�F(0��VS���_1�ɡ ~��u�lf4`���V�/P�����p�E��]��G�����ѿ�;8�������;��w�nĸ޶�ĸ N�{�< ���x �A{J<����x0e����h�4����%Skvbf���r{o�'��i7�z&Ԛy���xQ�1�&`q�y_�S�~��!sd��4��?�K�"�(�ꑖ�]�.� O
5	�2	XKU'M��`���p7���I	hwwD��g�F�sK���#���"�%�,� �ݯ��概��g"���������/�&h_I(��dk�@�n3�}d4J�µCB�c|�h'�e��K��Z�|e�)m�e.�>)"M"]�"cI��$�,��Y��nZԝG�BҞ����Yj�|f�"¾�o����J����gܴ�Q3'�B��7ee��ד��eWx��CϺ��䊈D�c�7Eh��G<.�P[��,���	�D�ks�u�W��6b���Y�C{���x��SI)��S�(ѺtM
�sA�Tiפ���9��kR�R�k��dH���c��!�׾�|���>�>�g��7g_)���0�G�RF�tS�^:Q��$��飛X���Nx@Ԭ�6K�Viz�8J��&����t�my���U��tG
lyQ����SPH��hJ(�P#���g�ZѦ"Bz�˩��֥��u�*�L��UK���I[�ҩ�%A�����2��n+��?ăR���w�دsn��jKj�s���P�;�����N
V�;�SjS��lO넷��ea�����V���M�f�"�����ga�xSe�Z��+��,����]f��]�鐟鯋��c��ɓ�ÿ.r�;O�Nr��I�@���t��esU��r�* ���������%��P�ƽ�����)�7���eHDo~�M＜d�K�#U�.��^�"C�2��H����e�NU�P[j0"0�{v����>�~�k�>�vo]Ww<�>�wN�uJ�5�CM7��������S��԰�$��RU_F���>�b��H����b�8c!��t.� �=��Sۍ�D�F���F�^��.v��E�b����Vy��kU�](
fe;�}�B�V�e
I����p�����h[�f�N��[���zi*��0�����B�"j�	9U1�m�q#�W�ku��\��� v�\čfh/�A�g��iԁݬf!����:�3}t%���(�,aK(�|�k��7$L �� 9���Ã�}.�Ux�{;�O� �,ɽR��z[��K�D�B���8�d����(F��i�p�s�:����
���2ʻn�׃��w�HS�$�J�xx�k�W%85��b\Kt4�Z�k���.F��*L�𝳏�D�9(��0��h[�A���qB&f�l���N��体}$/�,�:OBG1�NcB+بA�~���\��5�~T�]�O��U�ZB��X��z�Q��2{�@���� ����޻�!˖�����]��.�P��GuZ���,�k��$t ��k�$�0P���v�����J���,�˕�V	E�d��O'�aW��_ Ǳ�u��#�.Hp���0��	���U��
�:����n������7)�>�4��%���K8d� �w���
R-��>�-lf��� E���+$���ؼlV��F�H�u��8�mu�,Se�fΈ��B~�p�#[�X]j6�xMT:_}�Z݌���-zC�1�%'��a?�}��R�/��~_��M�\!�#������,�E�ym���	��v���f�_��QK�3R�~����2������U�S4��5�r�ǵK$V91�Z�'�YU��?ڞ�P��,�PN�RƮ�|z~���=�_��){@Z:~ظ�L����i{@[>i"����q�3�gH'�>�i���vذaJ�����b�|�Оv��p�Ў)?j#���l�{@=��Q���[;���gwĥA#+?r}��ԥ��N��6���]�)&��YQ6aӻ��~��3�x�%���u>�z���v��aT8Zk�y���vgOf�0����(#���̶;K1>L$$��Z�%/���Z37�,jwVc��fu]Lv��7*�F4�(5"|H�awR��x�`�[�g����-��aט�ߌZԻ�tb����ǹ����A�����y�8�ΌA^��vWpa���2�lw�n���k��@<`*I�3�����QAŶ��6��@���n��L�oh؝	l�a�G��4{�aR�b�]�m��#��4QT�]݇�Z����n���ht�c�We�5<)R��2N4c�+j�w����f,\�3����T��/�GF��!�+d���sR��p��^q@��X�ޡ�^��{b�p]�'�n�r�htR8<��Mn2��"��V����Z3\��?�$2\��/�Dϔ�*�wj�1�y���K���#��w5p�W�3o�Za&)�����J�P8�AxN1�;���x���4/�*��'�4\������$�߯����.~�p��N�:��I�<�+��1$�X���A�:��\�^��FͲHjI�Օ*wlnoɟf⣣�H���Ӵ�93���O�v��,� ���P�%�%pˑ��]����4<禦>:>�T��M[�	0�h����T���>0D�CD�+Z�t�������f4�Fxso��#�7���F���.5�Aj;ʡ+T��z�o�i@.C����A���~Ӡ�S���k�̙�2��M��Ӊ��>�C�7��1�JJZ�vm�Q��3>9�1���Z��%$���v��C�SaU�P����xE���`;o#��}�O{P�6U�֝�~0."���
H x���7��r5����W�ag���.�d	�vr�:��$�~ �BT����(���򨣵��o�LȌS�5i�.��vݶBf�	g��C�zC�
��9��L"TQ�!��8F̓��"�//Ě�m=�����oRi9���A�ψ��j����;����U�Έ�'	0�8�5�H\?�7h���E�3�qC���Nh��`{o#̠1�;�j�v�pG?%�(!s�F�bn�g�#��0k�٢2`�M�#<����Y7��3Ká�鋏�0��a��5"��[�y ��my�M8��3
//�z�i�����5�t�OW7��&�+sF�-�ת�����d�A��]%�OB�
{D��V�-��ae�!x¡��֣���يG���`R�h0��HY�8#6��r�iٵD����+�#Oj��\'s��r��o&� hb�ˮ6j��J�E0��Y��Aס�B朲rT-��R|�` >&����q�6����GU�gϩ�+Մcq�sDّp���>���Ô?8AuT����@,	�]��t�ڡ�h�]�vN ^39d�GQS�A��GM�HhZ6~8�.��?�����>���^��uVx�Ϭ����(���:S�e��x]��	;�D�ϖ���-#��уi��_wS_;��pDɟ���V��2��
DN5��@��::�!:܊.����YmFG�;�#��/
�������o����Ol�l-z�L��7w��F^��1,Ih7�7��B�Q# >67�[��Y�ٱ0>�(OF�T�{��{?t*
��Lbʙ 	<Pda`�^pSv4���s&*�yT���G�I㈅��N
BV��U+�?)�tb����{@=�(u(#2�H2ϥ|%�Մ�9�J;5�>Z����U7�H]4���?aҰS�����D�#t��T]������u*m��b��^��Q/�s�2�L�IALFoc�Bܟ9Fc���p(m[؅��6�3�a|k�'�[�$�����˕��Tqd�=��(�O��;5Ysɴ�N�N)�a���j��rRwʺ%͊+��[�4�Ǭ~a�/a2kK�*G^bx��@I�T:��'�B���yt��(���DC�9D!�4��iD�<Ѧqڣ�".bD���(Y.2N쐕�O��q���ڱ����:qN�.�>�d��c�c�"��#m,�@���d���r<L�#2����˹^�Ve�[�Q�N	���5Q1ʺ#3�VZ"e\r���jbe���l�;�iM.
'SE���;U�鏕G��0��j6!٨��)B��:eE�F������<�.ޑ}u�6ߚF�L�G�Q����.i�s�|��[l*��^��$��2���&5K!ǎwv�5��������-,�`�2��ڤ�M�~(j��4���H<J��!�X�J��M'E#���)��딩���8�8B'>��"�D�;�~W:��0|6�[n���c���1�߫_r����H�E4	5A^���_ُni�Y$n0"�(#/-N#V��kX��O4^��ԉ�M b�66˝��f�nf�m�����H�~�6)�*��zng���G'o���v���I��Rf�ң ��d��ΰ�J鱳<�r�j/�5}�Yz�(�����P�@'J[~��>=A��/��l���gyh9��_;�CYw)��4}�Y��c͍�r��^e�q��gy�Q2~���S<��3���V��C�L��7���%J��c`!d��\2�*�s��t��Ī�T�Ш\�<�U2�13�Q`Nw�}�B��+���E�{r���ݔW�Sf�O�.�Kn��H4PkD��b�k�Z7 ����1��ڐP-k��P]1GT��������x����ݫlK�/?9X'�[|������Hۖ��Q�ڸ?�]W���3p��Q�O��a������2����s��+����:yK�&0~a��!	�_�!:�H�Q�g�E�+^r��Ct���de�%��0��X��ϡ�������μ>Z�´$2��N�̙��狟f:���V.�m
����Q&��Y��}�qS<��m�~}�K?u���8��)zd�B\%!�nt��xh �,7�͍�ð"��`�5�A3HY�b�MW8��)W�mz�]���2�<�7��҅#'ߩ�X]0���+ֹi������һ��W�t/�,������ɉ�ό�ˮ	������R��p��BdX� E�c�=y�NY1?�S����s>�J�B\^OO��7 �B�Y�����)n?�Oq�"o��4�U��~��:^OJV��9�|�	��f�E�me[܆���x(k��]�tt��r���[ �I�xD���.�Q�T�y�Ut��w�2��>��7[�y�+*�q�nu���F��FW�z�e��nt2�cF�h����%l�b�滭�< ���q9�=t�Ԝ�t��y	Z�=ijԼ���).	�^�w �G�2z�R��Y�bWYw�qN)�"��?�C��*S^��WL��C�%3�~_�[�� &�q�.3h�S��~#0S���A7���G��=�6Z�(ϭ`��A<j=��CG�=�E�!�3����G���V�G�
�Q�"����@7�d�A���pc��|�c�G��](V�1��@(���^�AQx����ݘ�V-�1ED(V��\�eB�"ǾE��R�R!tZ��<hjAL-;c�'�J)�S���8?f����g���k<'�L��j?��XѾY�NVH��Ȥ�5S<�|_���)r����e��^;I��������Ө;��ׯ�IcO�I�kMO��B�jb�o���"^3ϡi�V�	�-&��4#򪛮+����c����s�NYA�hT��n��c���R �����{#�KC9	��ǣ:����H[�iY�t��?t�VZ�.����L���4|��V�%*�����U6�X�����������)z�T��c��J(|HA�������V� ���H��tзK�|��<�*XUr�Ovz��Wp����_��;Q��߱�Kqd���3�Q��d��HC��6�k����xz�{�%���:`2Ct/n�����1��7���I:e��N���4:a�����ZQW�nd^b�/�bݢ���;I����rv��;��d[���:j��e>8Y4^�R�,/a��:��x	k�r������0�Ҹ]4^�4��TѸ�d����0�c��=�RQ:�C�O�I>�CU�[BQr҆,�N+�@�H���WM�/�NM�<���̥j���S=�1��S=�}����`�.�Nc��	����߶�;M8��ϛ�f�x����S=t�:�˧z����[��
Wo��?��qQw����C4fĬ��!]�`	ڋ��EOzܙ�3�![��֙\�BҸ�%o�#iXoK=K�"�֤c�8�,�����Df>32K_��_P�q��E䠋�����^Ю|�M���SV�:����ܤM�6��D
��R���8m���m�Zu����Z����\�~S"J�q�C���LjcԽ�Z�k�%���:y���*~9�o�}�λ
����LM���G���D�Y7Ճ������f�`�JQ-zy'b����'�b�4��[ё�J߲J�d�eb�b�(�C�6I��R�����.
N'ĨA�j��R��2���S��L�)��t|��F����M��[N��(Z}i9/G\D���d��cjA�a��?�ݴ��4z����"�r������8�A��� N�W>s�Q4m���Y ��@8ߔ*�i�B��}ҷ�q��gGU�W/$��s��H�n������&o��ؖ0h�p��'Д���`�!���t,|��	݉R7L�P���q�����TM71u�����wS=���u��~7Y���ş�z�3�C�ֆ'>�3b3)K�P[��=B������X���"�#R%�-��$����g�	3,��Bܼ�l�D��,�~��U%1H�ѳ\8C��Z� ֏�w���ӄ�5����B�K�M�W�1R�5,����`%o��Nhz �������,69���@u��]���DB�@V B4�;&��x�����q�ʧBj��oP`� �2��� ��'���4ُwPp\]0��8�blQg�����F>_!G,��}��v�1ɊQ�@�'��l��a<���%."�a�j��ŲTX2���Hc����f!y���
?��/*�B�T\,j��FQ��e��d�"��3�i)�]��XR�%�'?99t�]�����,�9�|&6�RP��L���Ϭ�D��/�g�	Z����Ya]+af����
&˗�ӕ"��%�K��iRs}�����,�E�SD/p�ˈU��)�Y�D�&��f��k��{F�f8Bd ���Y���?�� �"Pϛ��H�9m�,�C!�lz�S��TmH�FN�EG�m��ʟI#��Rr��!ҏ�����&�nNё��tE1:fг
�qE1Ϣh�)*��iE�E14ŸQט��uŪUK�֍�6Z0�y(ї�#�6+"�K�Y˳l��\���X��hk
���:[^Yy��YuF�""��eq�y��;�P�SV=I�:K��|�]\����ֈ�j0R��{;#/e���b���Kr�@��Jeݻ]z�4��S:�rIM�d�lH��H��HF��i/�� �IX�9�.����̩׉!���N�PS}R�_,�{h�c��6J���Q����B��R�S
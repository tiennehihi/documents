"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keywords_1 = __importDefault(require("./keywords"));
const ajvKeywords = (ajv, keyword) => {
    if (Array.isArray(keyword)) {
        for (const k of keyword)
            get(k)(ajv);
        return ajv;
    }
    if (keyword) {
        get(keyword)(ajv);
        return ajv;
    }
    for (keyword in keywords_1.default)
        get(keyword)(ajv);
    return ajv;
};
ajvKeywords.get = get;
function get(keyword) {
    const defFunc = keywords_1.default[keyword];
    if (!defFunc)
        throw new Error("Unknown keyword " + keyword);
    return defFunc;
}
exports.default = ajvKeywords;
module.exports = ajvKeywords;
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
module.exports.default = ajvKeywords;
//# sourceMappingURL=index.js.map                                       c�P�V��.*�X69�2�#�vȻ�m�<��w���>'i
��~��D3
����ō%��������>CTkOmO}Q�>�X�Lԙ�N��[R�;���ƶ�dk���	j׷\�;9��u�3+�w��|Q�o8��Ux�Zwo"��@�,�"��zvh�z��A6<�U������V!F\��u����tWк+]��n�M���	�Sʗ*z�;�Ee��&A(SYCp׷Ͱ�(�.�y�sxri6jOg��n3�{���,�J�
�����W���ٮT0�W^��&nF�u�JHz�@�nc���������ihm>�ŮD\P�����ŵEdWH4��G��"�;��1��j�x���6��zMh�O��(��*�Q�cq�J��b}�a��Bh4ˈ�P��^�#�/����7|�d(s0��8&�z{?!s0�`l��u0S��',L{�1�K�髵ս�t�R�K�
A]�g�r�j�8��0��Z����7A�,d:4L���}U�:b�;\��T��Rߵ��n����5eA�RT'���t�RC
rK�� �x��yO�%%@Qa&ӒY��\
�p{��\��#�Lrq4+�AH�jԈ6q�<19-��Kĕ%68��1DZ`h�<��\a
��{Oȗ��ĊJW�ȩ�����m�D��v�=	��$�r[�� Wū��C��1�ୖh�<�9i��Q ��B��]��R�E�&���X�I�Ҟ�׆;E����a�w��# ��d�p#�5��O�O���C��,�#�{��jNV�g�?���[ə��dt�w�h{����^U��ږP�M����jff�};���\���N��D-��ί� r�.�T���S�u�m�"���I��2!�i�=f�֡*�
Z��2o
�E-_ª���w�9�ri�2������gOv�:������/;�v���Y�K�	���z=�WR����U��2ח�I�u������t42�Y��wP����4����4.��#*'p%Cv�-��>c���s𷿢��ŦY��M��������m�8���R+�V��B�!�!O�X�0Pi�F�ܑ�!��jk����.c~uG����a���g4�!�oJ��cV�2�ʹ��25�&`IN�A��B���v��8����CYiƜ���%)���Zռ:��J������:6=5x[�*ٚ��,����
q`&�Jc�`�����0���I
��?|��$������I�7���/-:�����^���g�B�+a o�'����6�b�b6��A�Ȼn��ǌ���7�h �[��5A��x��n�1���K�",��4%�GQ�J~���o�s��!
���1ڭP1jx�b�Z;��|*�\~�$pxڀo4X�T�=HÕ�Vt��ۏ����(�i�~�r�0�;q7�Ӕ��`6�w$y�� #M`i�y*�aZ=c��vN5���~�rI��y��^&^��� �,��wqx{�
�뺅9hF~�v	�0��us�{�w��ڥY� #�J��qԹ�H�߆\37n�~|��?>�+�7@�(I��8s1#A:�4t k��^6U���㕭�4ݽG�4�O�QOn4Ւ��&mtR���F"����b����]�!�zF�L�0�[F ����D�1H܁�n*�Ng�ϻ����u|f�t�̞1�h�\0gI��Qbʫ��E!�������ZқEo�X�[�թL����魀vH| �U�#�wv��[�^��lm�P!��2�xZt������лnq�6*����`�i���L�'\�yj�ͭB�)��ӵ�&}���=�-���#�?������U#*fS���e�^"X2�7]�*v�v��z!�f?)�LB ف�t|��ZZ�p�-�^��F���1��HԀs�R�Q3A���/������@�����r% ��3Z4���=yq�{K�3�M�$���-�x���bp��G^G�Y�쓞V��|�|��$�]|��?�|� ��C�G�Oۚ*��Y����������_:2_/�ٶ�N����*

����r���n�Q��[�H�'��a����#o1ڝyg��dޭ��F�4V�xZ�D��Q!�1*��,�M�|���!��
y��=4��W�ݎ�	��ն_�OYC�J��#j���sB��!�V΃��a�Q)�A�W��S���g�ճǪ��Kл�8���V"��� )��%Yf���b�\�۠��_�~G�s��Ȥg�Ν3��z~���G��zA�D0���e��iG����=����!(�L�{b�������Y�{긵o�?|��+\|Y�����2�=)�� �%$�^�i_�/'�����2�A����4�]s���CC#JU�c���Nh[U���#,i�y�A�.�G�����DEb�J��w��yU)�Xؿ�;�X7��:J��TGaTa���p6s��B�ӿG�lF;�f���:<�+�X��hmh<y�[��d��|��P�@Ӧ�$��[V�n�*��-'A؇^�7���Zϋ�ol������r;��E�*�'�Ӵ�e�eT�iC&�9����0K�.��eQ&�[3B6'\`o"����5)��.�D ��L�&�H�<��Z�=Յ�v���4:���3Ǡڄ�w��b����?���2k��`��Κ  �m�B�M㯙�z��{դa�#�G݆R�܈��ط�t�U�i���
~�$��"��x~��� ��so]����q�px)0�A��OG"����O�y��H�ܓ�����޺-;�a�V�#�����C�<_��C�BhA*��Vs%�9�+���[ �tE�&���p�n���<�M�&�3���-�����G�)i�����h�K��2<�	>0�Y%����Ѩ�d�?c�Xə8d��h�9��:+y�4.�,zK�C����s�dv�	�d��r�]�uo�`MISC1/5x�"d!���S�C�q)�F�̃�j��+���u �y��v}�cj\Ni!$�
�Q #=���H	���p��x^Y�6Q2]�ʒ��A����㑔}z=�ӊ;�����b?�τd�DxZ�9-ZaY�
����LN��,�bu� �y�������X�M�'�����J҉�����B�n�ш�a�!��Oc����"cT뿨��ZG'o�C�����מ��G�����49R9�B�+ej�Y��Aiŵ��0�ò�Q� a_q����څ9����ʁ�e�7TU��n�m��V�c���^U����w(Ǘ�S��_�;<\�Ku�3���Beʯ]�[��@�M���p3F����>%:�*X����I��EOVK�T�6�|!b�׋E��'��XӇ�_��A�7�#)�!���$���E�S��Z���O-J��1Z
+3�(f�)�}lR�d�X9��OX�J�@L�����"E;]y�-��jC��j�S�<g�@3�P�h�ӥ���=�ͻp/5���\��7���vɜGt涶����vs�0��Q���[^�I�R���]��?/t�R�y�D��P8=e��r��WJ6�R�種؅3�eg�iy�a)����� Mo6��yg`�-FJhm����b��Q��3���z$����փ�G��2��@�4Y6��.�2�_���I���Gp��bY5�&P<L=�� �M�Dҥ�,3&���6��\�0�.�0��h��"��%�뿵�o��o�%�,O%1V�A�X�!v�I�sy�I��"*��)�Zf�㊏�R�g�#�@��XBU[a�uΗX�ԫ�^V�	0�'�p��V����b�?�(t�2��Ɲ�
�H�����u������ٟ��{F��!Z:�+�-o��̎6���Cx'mּ�������j��� 6��/��9X�t�������f;���h��a�R��3���	��O��e9^����&Y��	
�IX�GjR�%��5R[Ǡ_��cv�ѵ���U�y�"$�4�s5Q��' �0c�p��6��������=��^���*�"��^�?�e���S�Н<0hItă�0&��@�kP�F>�7�D�F�Jk�����؞�^ҵ��i	���A��y_�s�q���+3?� T�9��������q4����A���e˩����'�dVٵ�jH�\�(�Eua�<���	VґA�Hl��Ee��Q+\w��x��4+�7Az�q�m�0�o�-#/�srt��>�� �l� L�4BH��[Ȳ�v�ր���(w�F���Y�'��B݀��G/JZM�8!��bi;�����Ŋ�w�Y���"3�shȫ�����:��RZyix#Ỹ�`��䝡��Z���E6)�]����XAG�N`�l[�n찫hI֐Y�EU@��ߛ�kw<�HՈ��t 7�䎢S�D��.�A�͉��gWw%�Q
;J�v��tI�Ww�捽�Nc���� $�M�|֋��I9TÊ"�P b����O)�u��[���k��Z&lF�%'�|.Ҟ��/��X7�C��-&����k�`s�zռX����iGB�zq�c>b�yʖ�5��[����1g����Z��ş�2n}n)m��AVU6�Km��2Ѱ���o!��0R��s���h���ȩ��%�{&� ��jk�I�T���vf�"�:��;��j$�B��a~�����IǇ[/�kX+����:�����$�D8�BF��K�ʦ�ȌZ�+J&ڕ�UdY�oRς;�J���y�,VNmֱ�.�|���`���o�g��u��
D�&T��X�Q��Gs����T
�0�m,B��=ch�O��|��f�~�����$;s}5�k��=5P��hl��_�X����k-x���R-;�~E�ِ{	�W��7Vt(,8�BT�h���6ZZ.���)wvBx�|�s�·���V���=�rizJ������V9J{W��o���D~m��۝���[�f⾫P�FH��7�t��,r�y@˞)��I-�C*����A�Dx4qC�f�i�8<<��]�3,Y�yZ����&����Г\-��H�>�+#b����V6�M<�������
�h���<���L)
/��灠Kb�k�h =�����)nbG4n�6� ;X ���4,њiۮ9n��y�gn�A1�:Z���8=Q�V�N~�B�O���p��I쭥<v�q52���Sk�%���c�'�a>
��C�r
�H%y��{�)�o����?Ֆ@�Ւ�4��
�F�y�b�����x'���bb�Y�Zi���z��XEt�U�W�~,��Ձ�9w ~է�r硤
���IK�~ ɻ�_$ Dr�/R�e�(V�,���p����#\F�P�*�T2y�{�11���O��_Of��PDC@*ɥnN5Y��N�2����A���Jg> T�7}I�͇/%B�'6M
Rf��  �A�>d�D\���p�8�D��8��n�	X���i�ll:
����ru��>����f��!�ܚ���L��h]:_�f<C���<�I>
[�1cZ��3����7�dÂ��?�
����1y�*��lQC�SV�S�!�����}��@���h���t�>
��(t���[�mm�fh~9�[����`,�2��$���C�c!���=��� ��Ѡ���`t�/e㳼;ce2'o+/4�	d�r�1�=z��ӛ@p���!:���H��L�i߳3�r��*E�B���5��]h��ݟ�m�^�� \h�����Υн�s���ר/}�vp�
�ƹS����ԡz�|btz�F4\;�����Nۉ{����u�Iz�sť{�T��1*"�`I,�`���i
��KH��Q�`vݯ��W3kȞ�
�o�k�*H_�߫�m�u������WC���@KRר ����IC/�����j�&���q������_��O�H�t���|�?�\mV}�R��Jŕ;`B���Ĉil��>�.G��cAjW-�	+1ܤ6�����B��xNe�=�Y�����������&�q1C-35�w�q�4�&�LD�1��کi��w���5W����IV �����Li�h`H�"������b�\�|�Z`��H��`W��NE�}𲅰b�^H���L���yܖ�$���2���2���4<$�ɀw������Q����CN��}F������?r�E�X���A0���)��j86Ţ� :��t���?�B��;��ZuV��{ }j��B�c2gvtx;��Z����;���~�;������WÇ��/���
��F��'���y�*�0�=�Z�,����g��6�ʂ���K	u���T
��]�:V��R�IB������6�j��ãp�Ft�ݤ�Z�-TuR#@5. poJ8�Ae�o��S��F��S��������p��Fzfޫ#aӌ����a��!.�n+b��.�{L�ШF�%S�Ǒ�D)32�=��xPV�C��B���`	" R �,�F5���PE���*z�k����$�UM�	�g�'2v@!��U�M���I)��9f�J^���~3Z�J��J`&i!��>0����B���4ݑ����yF�C�����aj�C��SX8)�"���v;Ap_� �9��R���nyh��a�gc�>��kV�a�M-C����!s@�T��>�I@t����&�؆{]���F�/�Y*vdػ
h@T1�����)�M��-ި��:�픓��r��J>���h�ՍT^���7wB����Ak!���?�P�4�:��V~�s+i�{E���,�)��vV�>z,�n��ҋǉC�!7a����53q���RL�t�� 9�K��9Dwn�.Ѐ���TuB��?!;�R��Nv�YKdP�)u���G��c�+Ǫ?�<��9���k]A���.V�7YƖ+�嚹�%���8%����id��\i���@�	ɉ�~�h�t�qlJK�����F]�M�1��eb���!P6��R}�θ���=eN��om��}d=���o®�h0c��<|Cho�z�Hy֐��u�9�p����U���x�F�����fҘ�E2�e�i�97��0����t쑋��e��b9烏�qF���m<M]0�NSl�m+�r���+�ʬL ��N�=4��F ���+s�V �K�+\�F�kGG��cu�XJ�WBiۢ|�<!���T(N�la����(uTW�I�DI*u��~�:H�mf�؍h�iٚ�g�c��3�2&�U.� �+�7�2:Ki���h#w�*��U�"�F�xǬA;l>��$��F��Oâ}��=ř�ɧ��An�d�A)F�њ"�*0��$~�_�w�5�������k�Ok̎&)�  d�]i�i�_�7�'�M����2�;�j�H�C��z|�[q�$ �����t�)�b0A��x/��mi�
#�K�g�J8Qu> \W|Tf8����9�k0�8Qj�VA.S:)�a�ĶE��#�����϶֞������,���Ҹ��*nB�3���|m�q�9^e�G:GA{��M��g�����ؾЪ�	e�]RB�k�G�NG���k�.�F���ŵ}H����,T<ro�9�B�4�
�>?����p��%�qgq��6Tj����� +P+��B��	�\G�F{��n\Z�5����y��Q�S\���x�ù?N�[�"Q�./�J�X��������G�@4��;�CA�#Z%Ղ XSZ�k�Ӹ �ֹQ���EWG�h���LgG��b����G^�3���X�+O�PD��U�KǺ�ک�rg(��[�VP���"e�2f3��	|��$ۘz}e�꟱V����{��Zt�4�O����k�WԠ�F�1CL^~�F��h'�˼��.-�Z�XL��  ��_nD�&n	,�Þ�D�'�<U5��W�B�]e��Q�8E�<�W{Tr%��,�쇫 �uUZ؜�6��leE
v��MO��d3��2�rb*j2 v��-=>���
�f2���\G.��K����Y^ ������\�FE�V H�W>[�N���9^Y�R
�M�/w��K�c����#�gT���Pih0�R��#,�V�,�?��'������9{>�����t��u>�:҄l���~���j����u�&ҙ8�����O��a���#�+�&[�tgo�Q_ya��"Cp+(�֤M�t��l������J>l%o,�b����:��1?jN��iy����5{�+<��s�o���}�Ւ><o)����͙f��܊�,f��NK�HAi,?A��J�4(ng4�I~ئ8�3������sb��.�����  �A�B5-�2�
y��R9�9,S����9�3��e��S�O�uC�������c�?�;��C���,W/<���EXb/�R�D~͑6����*���y�Ew��M����ua�AD��P���2�x�w��L���Z���㡆�[_��ɬ�	��{�!����eB�(g�;m{}
\!09%G ���D�S�	GJ��9��p�<^��Y����i��KH�ؖk��P���z�+��&nb1�FFB�~Y��+����TX KuF���[��QP�D���R^g��q�����D��I�}�o��I^v�8ti����D���另�$��-N�(����`+�;e�w0�u?�>�<d��(w������w�KV�օ\��7�?q�'Wz��2�u]��%�@�)����ʟH(ߥ��"uŽ�2���oyVӶ��u�7�ܸ�(|M|�>1�������(�jI�+�M��U	r��!e�xl��e33;όѣ��s $>4��;��! �.�!�P�>�Į�z���9�ja8�p����%@���"�����B��ho�����6vUc���@�����$�3j`��؂��v$Ê",ƚ{
�� ��sx����w�u���/yۛ��2O����s)��`��Đg�F���m(���>_�H ՠx"  ��`�   ��anM�_���{�7
fv�*��"�hi��>7�ҏ ����-Ĳ/�&��cSt�>��RM|�P�����=�q Q%������k:�*�7�x��c)��M��*����8{6�S)��7$"���c�3�
�&C��`{h�����6��/Tq>�;<�  +xA�f<!Kd�`^M��;�2�Ο`�`� ���oQ����������PA_|�$�A^F̅�������:aL:�q:M��?1��Gf6�N�N+���A�3��`�z��M�ξ�ނ�p߽�6����w��Z��I�|~vy�V[GT�D���Y�����1�9.�n!�`-��?,�6J���M�y�
�����H�E3P ��q����")�@6��Ք�]֖��w�Qd�V26j��?G�z�v�%�*L�>1��<���9zv��-� 5�v輼��c��'E�3!�+".j���9l����=":T������~�*h��=A��pPF3q��F���G���S��k,�2���)
^���d�FJi>���1<v����JpbM{vv��zh��i�1�t䞀L:�E
8?8>%�ҩ͍S�D�_.�SW\nj��Ԗ�l���q�uj�@تǖ��<����Ʉ�&db�6��/q(�rZ��O�G�)T5ϟ�Gl�#����?�9;��I�Q�Q�Li�����{���l)(g[.>C�k�Jr?�A7��F"�v1�y�zp�qMu��"w�=6��?�?{�FA�F�N��s��,�$���[x�+)���7��Q���5<��Q���l�Ζ^�?�\���v$��<�*ږ��8�d��R&�<�g�b<)s�� Z:��7~�AT^b�r�	*��񒚠*�L|t���˿nD1�'<*�ʕ�:�^���2�"ї�P���#�!�juMB1�o���)p�����P���ni��u�|8��!c�4"�+����5�ep�$ZC�ROU-)5TDV�Ľ������Ⱦ:��6*f\?9�&S������sn�~S_���������{��b�a��}e��`��H��F��F���|;����zBX�ԗ]%��r���6ޟI��}i+���aϵUyJ�|���2ߟ��65��S(1u�ֿ�1�6~���1@W.;�[]L���K8� � ��a!���E�`,�J׼J�3�a~�F�u�zX�r�W�[]�A�Qԃ=B'l�|�r�
Ao�y7T��7�jY����~�|b�VD�buZ�n7m45ʁ��D�:%x�2�Qj������M�Q!���%�9�\��;,�������E@��vԲ�D�Ê�C!~�_RD�\!���v0�r�ě;�x�H�zg�W@�
=�;a��`_���y��N�R������ux�Hf�/vS�i����}e����ɊP�&�q��m(>Y�͘���� +^dA���s[�׵���q}bܹ��Ib�/`P��Jg�j�e��a���A��gq ?�����a@�2�t0˙���]����糚*T�WM�m?�c;������Y &�8Px���lr�֧���D$��ڒY��ڡ�x�~K>ܢ���u��D�y&>jO��̩�ד�����1(2ަ��PRRc6���D�4�ˊk>�%�N�bP�ϼ��Z��e�kA�)�����v�o�Mg+�'0诠�é��R���Kd^���
G�~p/��	��`ހ	/���G5f��;�3	�
|���N���Z�H�G؏��h\-����V����+� �R�Z0�U?�r�s���^�n7���W7�?I8]~l[ݚ�l�9=��Z�O�E�۔��@�ڑ�oi���bjH�L�R2�����wT�)6��}I{�e�E��t	�V:�SH~)�?lਡOpyP������w`�!�F/h��V�@֝T9�߿��N�u`�Fؓ���+�zFL�laC,��c�h��h�g��̟�Hؿ5仍�4��M�&�jA�,*�76Fv�F����E�m�`��3
�,j�7�������T��Cp�u��(8�<4��m��I��Cl����G!!�,�w�����~g�9|1�;	�=p����% %{���VΖ�\n��Z{X�p�L�e��+�XU��,}`Y)!Ҕ~�'a���3���߆��RI�},
M]��<չ�IX�:��1n���d��*�� ݑCoDfa��Ds2�9�T6���ы��>��63.�ӰB��(�e�`[�q}b��{ pH�܌&�H�cP���4��MF*y��#G}t�\`�<��˧ۈ�[�x˙����8������ݎ����-92ʰ9��4=��� ;����,��KU:6Y���*B}��rI�����2G��
�e��ӌf�����9�/ ��e7r�!����h�4��^�jW��#��q%8��b./��1��-w�\](��D���9�4�[��)I�j��h+�qЩ���#T��@���f��s�l7�@0#dT�Ċ`F����{�U�]Jq*�Q�ޘc|�42����\��Bqh�t���>�Ȥ��L��b�^R�tM��d��R S��c{y�6#��A���ժ��C�!Ä�
�l*��~�0������^��x�SBT3L|��K.+D'0o�BH� �7E6B�A*�����j���)�P�%�*5��!��3��҄s�Z����DܙG�:gUY�i�^��D��`۝0�����a=xBL�^Z��w�"y=I�|6{gU�@?] l0�]��\;��IS��Z�v3�4�x^�5��r���E�&��#!�WJ�����ߒ���#����f�7�;���Ů�F��i�QS���݆Ȇ�8�(��#|���1��;"NL���jG�!p)���ڞ�`Z�U!����i&��R��r�j�R$��1���}��p��Ƶ{{��]�����=D�*Y���I���!�X
�mR�Т��7%ru�v����P��><�7�q�U�ģ�u�%
�
��@��2�*��B}=��;"�RϢ0���ބ���-�eǒs���H38o}ଲ����G
{CXT��kC � �i�(,���K�XCo��J>�z����A�g��W�g���Cg��{z�s��g��Յ3�]Қ��{�<?��q�H22��R��0tt�,�jW@�&y�Ҁ`�@?m��1�h:]��QeR�����ON1R��k������H
?�;��AE�Oƶ�w��5t��:��|�x���Q�����L� _�r����7�����NUg<�F�F:������'�Ҥ��œ�6&��RC�~8�9������K�nouI�td��V���Z"�K)�k*��"�U������؋j;4�F�ZY�N�Q]�@�4�t���V��W���$�0�di��5[���<�1;?���;,���AK���A帟�O������Ҁe��df��c�+�������_�!T�&
Gj�����
�!հ�eMR���ن��C�1D�\�ɶ[+���Yl�� �0C�DJ����^��3�L�_�o�Wa�w��Fd�h��>��k�U��τssc~�_����kc��^�J^k*�F��Ƅ��;�^ܪ/T�/$��7O����3H�*�G��{$DNYT��R;��_0l��"�WЛ��;��(���ƨAY1����&k�,��"����8�I}r����ZE����$%�+g �S�ǢhF	��i���8�ݘ���З�xΏ-��L����9,�1��PY/$�_�J ��wp��f�\?5q�kL�?�_����~�?��rZ���7P��=��x5��vĉ7�Q���.�tr��Q����ҧ��C�aM:����i_t�P�@3�Df��+�u`Y�4�?���pB ��|��f���W�.��n�����X���>kUq2�kh��*�^ V��o������W*�p�,�B{k�9���*��Jem"�tNʼ��an�C˶���������Y��2���[�W�3�m�L�O�����9��:@i��f3S��h�[���q#��.F��n����&I�,4�w(-P�@9��R	m ��5���l�0�b<n�8��S�h�+��)I��l�]Z���%fU�i�����i�a�@�ՔJ��#�:��)�I�;������=�&�� ^���m qg�^�W�ƚ�a���im� V%�('z�߹�rm[�4|,��W�:D=	,(��
�ud�a�˪�: ����/$��j,7��!֤LE>P.ǆ�Mg+��T'LI�5.�F �^��n�]�T��(m��Nu���X_.�R3KmK�NQ��6ɳ��}��ӹ�O��%Y��vo��+o�Pǝ��"�f���'�Dеu��A*����4���Mp��Ɔ#:g�k�m�T�&D"H��Ǔ��%�@-�p�������Rdc�i�g٪op�>H�@h����]%Ė����ne̽��TxM�o_C�pZ�ie5 i9U7�k�_jƀ�N���ܪ����H�:�/��w��*��V�d��vE��䋲'��t9���e��pc�4��.��/
	��y��X���BÐ��T]/tK~Z9CA�����|�d���mɚ5�b'M?Z�[�7�]Ξ��73����xoAH1ЪԒI�t|iFL�tK�|ܽ��;>=8	6^��_Ň��}�[�X
����
���v�[���hBi�Sy���=4�|�ږ�����_��jHI�����P�{)��4�;:?4������n��X@�+����M��C�%=���YGx�౼�b~4���`�'��ho+s5���r1�|�f�% ��0:lųﶃL������ʨh��yD"���@�m�8Y�㩰�y��k|����]�w�ra�-�P�.z�X}���.�5�-��)ʧ�j����6" �#Q}[��Ydi3UȌK��	��\�Xm=���^�Ǉ�z���E�1�7�	\�ֈҼ�Z�Pm�k�K�٪z8af�j��4�������yuw�\�k�*�Є�0�7tnT�g��U_���1�L?K�ubp�pE�+�o����-��^�X~Ӓ�Y�u�gVT��'�;�+����,����-Te�e\]H���:�g��+5͞(�0�s`����Ec�\���x@��B����a@��ڍ���n{�����#x3�\�%B���+�����n<-:F� �����������z���k�It��$e���&o*�N��'��'�#x�1Ԗ����,\���f(�(O�6m����x(���8\��Z�cؿ5��4�A|)��m��O��a�ϳ8�'���D�u����u��%-Kǝ�	%z�f���5G�I�`��;��RDm�L����~�~,�	B�9�H���G�1<$9�=��b��A��G_s3+�H�2�w��i8\�����G|B�i��u�N��*�5:��Se~��t��E������KF�E�v$�W����yٳHj�$��r�J�*��[���>9a䡉�/��F�7�A� �p�y�g�9���<�k�P�([^����? OG�HS�d�ڠ1�l�n!ks�p����{I���y�w�z��F��pY�;�T�k�
��|����epnڅ��z;@�+�hٻ�2F�P�hؿ�Y�u��3��EVߔ5=�L��NHg�'着��Jx@ؓ�� �8dvCT���^�F}2��N�zFUY��)�P�S��M �a���IK��)6�;��X���\�k��� �V��J?�����[�Fwo�d�U�g��%&��㎢u�Z�\:��up��ܰ�x��+�/6�u��y�9�\��X��H���+�"��)��>W��3��u���A[���:�3�zϿT~#s1O�j�6lsJ;j@tݥ���Xb6T�4�w�t���}�%r�4}��/���6�ά�Q"��ˠ��(��:�޻#f�:&*��'55�L�˂ƃ��7$'����R�+
x�c�J�4:G)]��<4~p�:#�s�o�q��%I�Z8�PCV`��V~8�F䄡�kk����tOa�7	0���mh�t{�u�f��-�f�"E��K�
)����C9X���d>i�WZ�<���o��E��꺗�Y8���{��N}�>�u"mQextLine.substr(mapping.generatedColumn);
	        lastGeneratedColumn = mapping.generatedColumn;
	      }
	      lastMapping = mapping;
	    }, this);
	    // We have processed all mappings.
	    if (remainingLinesIndex < remainingLines.length) {
	      if (lastMapping) {
	        // Associate the remaining code in the current line with "lastMapping"
	        addMappingWithCode(lastMapping, shiftNextLine());
	      }
	      // and add the remaining lines without any mapping
	      node.add(remainingLines.splice(remainingLinesIndex).join(""));
	    }
	
	    // Copy sourcesContent into SourceNode
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        if (aRelativePath != null) {
	          sourceFile = util.join(aRelativePath, sourceFile);
	        }
	        node.setSourceContent(sourceFile, content);
	      }
	    });
	
	    return node;
	
	    function addMappingWithCode(mapping, code) {
	      if (mapping === null || mapping.source === undefined) {
	        node.add(code);
	      } else {
	        var source = aRelativePath
	          ? util.join(aRelativePath, mapping.source)
	          : mapping.source;
	        node.add(new SourceNode(mapping.originalLine,
	                                mapping.originalColumn,
	                                source,
	                                code,
	                                mapping.name));
	      }
	    }
	  };
	
	/**
	 * Add a chunk of generated JS to this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.add = function SourceNode_add(aChunk) {
	  if (Array.isArray(aChunk)) {
	    aChunk.forEach(function (chunk) {
	      this.add(chunk);
	    }, this);
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    if (aChunk) {
	      this.children.push(aChunk);
	    }
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Add a chunk of generated JS to the beginning of this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
	  if (Array.isArray(aChunk)) {
	    for (var i = aChunk.length-1; i >= 0; i--) {
	      this.prepend(aChunk[i]);
	    }
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    this.children.unshift(aChunk);
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Walk over the tree of JS snippets in this node and its children. The
	 * walking function is called once for each snippet of JS and is passed that
	 * snippet and the its original associated source's line/column location.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walk = function SourceNode_walk(aFn) {
	  var chunk;
	  for (var i = 0, len = this.children.length; i < len; i++) {
	    chunk = this.children[i];
	    if (chunk[isSourceNode]) {
	      chunk.walk(aFn);
	    }
	    else {
	      if (chunk !== '') {
	        aFn(chunk, { source: this.source,
	                     line: this.line,
	                     column: this.column,
	                     name: this.name });
	      }
	    }
	  }
	};
	
	/**
	 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	 * each of `this.children`.
	 *
	 * @param aSep The separator.
	 */
	SourceNode.prototype.join = function SourceNode_join(aSep) {
	  var newChildren;
	  var i;
	  var len = this.children.length;
	  if (len > 0) {
	    newChildren = [];
	    for (i = 0; i < len-1; i++) {
	      newChildren.push(this.children[i]);
	      newChildren.push(aSep);
	    }
	    newChildren.push(this.children[i]);
	    this.children = newChildren;
	  }
	  return this;
	};
	
	/**
	 * Call String.prototype.replace on the very right-most source snippet. Useful
	 * for trimming whitespace from the end of a source node, etc.
	 *
	 * @param aPattern The pattern to replace.
	 * @param aReplacement The thing to replace the pattern with.
	 */
	SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
	  var lastChild = this.children[this.children.length - 1];
	  if (lastChild[isSourceNode]) {
	    lastChild.replaceRight(aPattern, aReplacement);
	  }
	  else if (typeof lastChild === 'string') {
	    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
	  }
	  else {
	    this.children.push(''.replace(aPattern, aReplacement));
	  }
	  return this;
	};
	
	/**
	 * Set the source content for a source file. This will be added to the SourceMapGenerator
	 * in the sourcesContent field.
	 *
	 * @param aSourceFile The filename of the source file
	 * @param aSourceContent The content of the source file
	 */
	SourceNode.prototype.setSourceContent =
	  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
	    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	  };
	
	/**
	 * Walk over the tree of SourceNodes. The walking function is called for each
	 * source file content and is passed the filename and source content.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walkSourceContents =
	  function SourceNode_walkSourceContents(aFn) {
	    for (var i = 0, len = this.children.length; i < len; i++) {
	      if (this.children[i][isSourceNode]) {
	        this.children[i].walkSourceContents(aFn);
	      }
	    }
	
	    var sources = Object.keys(this.sourceContents);
	    for (var i = 0, len = sources.length; i < len; i++) {
	      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	    }
	  };
	
	/**
	 * Return the string representation of this source node. Walks over the tree
	 * and concatenates all the various snippets together to one string.
	 */
	SourceNode.prototype.toString = function SourceNode_toString() {
	  var str = "";
	  this.walk(function (chunk) {
	    str += chunk;
	  });
	  return str;
	};
	
	/**
	 * Returns the string representation of this source node along with a source
	 * map.
	 */
	SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
	  var generated = {
	    code: "",
	    line: 1,
	    column: 0
	  };
	  var map = new SourceMapGenerator(aArgs);
	  var sourceMappingActive = false;
	  var lastOriginalSource = null;
	  var lastOriginalLine = null;
	  var lastOriginalColumn = null;
	  var lastOriginalName = null;
	  this.walk(function (chunk, original) {
	    generated.code += chunk;
	    if (original.source !== null
	        && original.line !== null
	        && original.column !== null) {
	      if(lastOriginalSource !== original.source
	         || lastOriginalLine !== original.line
	         || lastOriginalColumn !== original.column
	         || lastOriginalName !== original.name) {
	        map.addMapping({
	          source: original.source,
	          original: {
	            line: original.line,
	            column: original.column
	          },
	          generated: {
	            line: generated.line,
	            column: generated.column
	          },
	          name: original.name
	        });
	      }
	      lastOriginalSource = original.source;
	      lastOriginalLine = original.line;
	      lastOriginalColumn = original.column;
	      lastOriginalName = original.name;
	      sourceMappingActive = true;
	    } else if (sourceMappingActive) {
	      map.addMapping({
	        generated: {
	          line: generated.line,
	          column: generated.column
	        }
	      });
	      lastOriginalSource = null;
	      sourceMappingActive = false;
	    }
	    for (var idx = 0, length = chunk.length; idx < length; idx++) {
	      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
	        generated.line++;
	        generated.column = 0;
	        // Mappings end at eol
	        if (idx + 1 === length) {
	          lastOriginalSource = null;
	          sourceMappingActive = false;
	        } else if (sourceMappingActive) {
	          map.addMapping({
	            source: original.source,
	            original: {
	              line: original.line,
	              column: original.column
	            },
	            generated: {
	              line: generated.line,
	              column: generated.column
	            },
	            name: original.name
	          });
	        }
	      } else {
	        generated.column++;
	      }
	    }
	  });
	  this.walkSourceContents(function (sourceFile, sourceContent) {
	    map.setSourceContent(sourceFile, sourceContent);
	  });
	
	  return { code: generated.code, map: map };
	};
	
	exports.SourceNode = SourceNode;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxNjI0YzcyOTliODg3ZjdiZGY2NCIsIndlYnBhY2s6Ly8vLi9zb3VyY2UtbWFwLmpzIiwid2VicGFjazovLy8uL2xpYi9zb3VyY2UtbWFwLWdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmFzZTY0LXZscS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmFzZTY0LmpzIiwid2VicGFjazovLy8uL2xpYi91dGlsLmpzIiwid2VicGFjazovLy8uL2xpYi9hcnJheS1zZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21hcHBpbmctbGlzdC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW1hcC1jb25zdW1lci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmluYXJ5LXNlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcXVpY2stc29ydC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNQQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJDQUEwQyxTQUFTO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3hhQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBMkQ7QUFDM0QscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBOzs7Ozs7O0FDM0lBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQixpQkFBZ0I7O0FBRWhCLG9CQUFtQjtBQUNuQixxQkFBb0I7O0FBRXBCLGlCQUFnQjtBQUNoQixpQkFBZ0I7O0FBRWhCLGlCQUFnQjtBQUNoQixrQkFBaUI7O0FBRWpCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDbEVBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBMkIsUUFBUTtBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQT{"version":3,"names":["_index","require","_default","exports","default","createTypeAnnotationBasedOnTypeof","type","stringTypeAnnotation","numberTypeAnnotation","voidTypeAnnotation","booleanTypeAnnotation","genericTypeAnnotation","identifier","anyTypeAnnotation","Error"],"sources":["../../../src/builders/flow/createTypeAnnotationBasedOnTypeof.ts"],"sourcesContent":["import {\n  anyTypeAnnotation,\n  stringTypeAnnotation,\n  numberTypeAnnotation,\n  voidTypeAnnotation,\n  booleanTypeAnnotation,\n  genericTypeAnnotation,\n  identifier,\n} from \"../generated/index.ts\";\nimport type * as t from \"../../index.ts\";\n\nexport default createTypeAnnotationBasedOnTypeof as {\n  (type: \"string\"): t.StringTypeAnnotation;\n  (type: \"number\"): t.NumberTypeAnnotation;\n  (type: \"undefined\"): t.VoidTypeAnnotation;\n  (type: \"boolean\"): t.BooleanTypeAnnotation;\n  (type: \"function\"): t.GenericTypeAnnotation;\n  (type: \"object\"): t.GenericTypeAnnotation;\n  (type: \"symbol\"): t.GenericTypeAnnotation;\n  (type: \"bigint\"): t.AnyTypeAnnotation;\n};\n\n/**\n * Create a type annotation based on typeof expression.\n */\nfunction createTypeAnnotationBasedOnTypeof(type: string): t.FlowType {\n  switch (type) {\n    case \"string\":\n      return stringTypeAnnotation();\n    case \"number\":\n      return numberTypeAnnotation();\n    case \"undefined\":\n      return voidTypeAnnotation();\n    case \"boolean\":\n      return booleanTypeAnnotation();\n    case \"function\":\n      return genericTypeAnnotation(identifier(\"Function\"));\n    case \"object\":\n      return genericTypeAnnotation(identifier(\"Object\"));\n    case \"symbol\":\n      return genericTypeAnnotation(identifier(\"Symbol\"));\n    case \"bigint\":\n      // todo: use BigInt annotation when Flow supports BigInt\n      // https://github.com/facebook/flow/issues/6639\n      return anyTypeAnnotation();\n  }\n  throw new Error(\"Invalid typeof value: \" + type);\n}\n"],"mappings":";;;;;;AAAA,IAAAA,MAAA,GAAAC,OAAA;AAQ+B,IAAAC,QAAA,GAAAC,OAAA,CAAAC,OAAA,GAGhBC,iCAAiC;AAchD,SAASA,iCAAiCA,CAACC,IAAY,EAAc;EACnE,QAAQA,IAAI;IACV,KAAK,QAAQ;MACX,OAAO,IAAAC,2BAAoB,EAAC,CAAC;IAC/B,KAAK,QAAQ;MACX,OAAO,IAAAC,2BAAoB,EAAC,CAAC;IAC/B,KAAK,WAAW;MACd,OAAO,IAAAC,yBAAkB,EAAC,CAAC;IAC7B,KAAK,SAAS;MACZ,OAAO,IAAAC,4BAAqB,EAAC,CAAC;IAChC,KAAK,UAAU;MACb,OAAO,IAAAC,4BAAqB,EAAC,IAAAC,iBAAU,EAAC,UAAU,CAAC,CAAC;IACtD,KAAK,QAAQ;MACX,OAAO,IAAAD,4BAAqB,EAAC,IAAAC,iBAAU,EAAC,QAAQ,CAAC,CAAC;IACpD,KAAK,QAAQ;MACX,OAAO,IAAAD,4BAAqB,EAAC,IAAAC,iBAAU,EAAC,QAAQ,CAAC,CAAC;IACpD,KAAK,QAAQ;MAGX,OAAO,IAAAC,wBAAiB,EAAC,CAAC;EAC9B;EACA,MAAM,IAAIC,KAAK,CAAC,wBAAwB,GAAGR,IAAI,CAAC;AAClD"}                                                                                                                                                                                                                                                                                                                                                                                                                                          ��!3*���2'U�r�:Lr}����?��ܟ���@�k����Gj���<`��%�3����9��p�\����
̊�-��f����8���Q�IFUH��I蜆���,��Y�S�c UB�!��y_�~:�6�5b�����@��KgN�"|mf*�#!��ˆ�#��~�9o�i�3���C�\6.�����w'��)�`�����w�^��`<Z�@�����u0��Q"V���>��E��Ȍ ��"}` ��pZ���+ʿ��N����6|~���;�=�ngXo�e�8'�q��F���8���nfNbWY�;5l-�������&��=�;l/}0�&q���Rrk�zfS
�*c%2��K�ե�2J�ٿ�Sz��-�B8v_ħ7B�����`I���3�&#�]1�?�2M�^R��8JC�g6hY���u˫	ʥ2��ފ�We\�c����7�݌��2S:���$�q�6�"o��`ވ01@*���5���^��g;����H���C 벉�v�
�j'�u|�3O���A&}�lp����O��E!#R2���Zט�+�X�|����B�Lh��0h�K��q4��K������X�wʹ(��E�D\���A���������UԔ�\a�nhW��:�8���X1 ����pRy�O%�t�l���pc��-�@�q�Pi(�j	�l�2e�7��*�U!�&o?a��pl]跀]�;Sԭ��F��^d_���[�w�cH����&���'��)-��%�x�qٜ:�u�(�&ٺ{ī��3F�S?n󀚊i�?hE6�Q�)��U:@p���שo��<o�Q��-u�"�^�u���n�=��n킠ʼ��v�n� G#�R��H��	��:4AסXm��߹��P��$P+��e[�m9��4�+�j�����4R�t���nޖ��]+F���2�_A�q�t�k�١D3����&���BvP�"z�}��Hz�Q���Ǚ�3"}\���
/q6�_{�?6�;/�����g��V�"�o�;�(D!/G��hƜ��0p,~�����O�͙I��2����}J����=�l=8����"�3�`�������%��J�.G��c���x�S(F�$(���Ϣ����;}���b�{�[�gS�����1��f����Ė�p�]�:ݴ^c���9�^ ��I��2�إJ6�o/HL�S�F���q�Sӑk�CUT9����q�^��Y[}����I�p<,@Z��h#����&��	���A�z��������6"��O����ai{d&ml�(d��E)�0�]kkt�EKf�c#����ee���c��+�feQ+���~��g�oC�jo�&��I��_\��L��V���1n�Ar�b+��F��N]|��r"�8U�34
�L�c\':{q=3�d��	#E��Y���%'�uО�z�F3ӏ�J�VZ�J�C��2;�'���#��t㒘'`y~A3�9Y����ݍ��𸚼��k���u�rPJi���e���:X{�~����>������Ř�Ӂ�3uH��e`���12�#�����������+p �7��f�,ЀﲑI(��7�:uh�qU�Շx#�:�ҬĊC:&����\�Y�(�k��g�Wԗ���8A|��%2Gԛ�-b�1�>��D_(�:;�cߓ�H������Vs�P"�\����,ok�����}��^�o���+���;�Og<���xu��(�k"��C�V���؀ݯY�O��*_���]�^�*��'�b���+�'����g@�* �"BPR
�2��Qτ��n]j!I�P9~|�ԉ�������|ġJ�:�/&�Q����**�Ć�5M����B���j�{��St�7��| ,����|��.~%QJ{���3'�t~�%$q5��k~�.D���'�yi�j�;��\�O
�Xk�HD8*7`p[~hS�~䨯��k��WX�:�Q��W���]�[0z�>�!$䇟���f|�@٭ ���������q�(E���ٞ(�P��!�6,G���A�z������|����|�M��ݻ����P�5܊��R_��aU�*���LT8*�\��a	��$�.3ׂ�L'oA��M=j��aӊ)��i���j�;��|���~�vj�]�[7<�h�nv����l�k¿�;��d*��)r��~��'6m&SN)��_��{B���6<�X�.����Ebɹ�i��>���Md˽8�a%��y���'�����N�Ud���
�x�ʴz̑��zo�3����2� ȥצ�Y�m@i��wO�Cu�iZ�k݆bBJ����H�2� ��>2y���I"�+�IO�9N�5��l��_E��E����o�&9�~z�~d%>�<��6>�q"^/h�Eu�i�q��[2���6E�Z~�k��2<ih+�&=P�^8��r11����a	B��y���X�� �OpG�t����)<A������i}�g�Xx�щ�o%���f:u���;o}2D���Q�����_�@w�İ��z�[�h�=ց"A�{Xi��7f���*�z&B0{�I�Ȗ|��Ca�l����8t�iX� Qk����7���|l�K� �q�,vt���\8� �|l3�Ě�AC��48��5�5Kr����  ���]N�c�5ee�v̨��33�� ��ٹl��2���B-�������߆T$���P����"8֫WV��_�udˋ(�ԝ�6<�`�i��Dͩ��ER~k�xI����zBN�Z:���("�jO9�$n����f�6#3��:�>d6<��;#���V�seuS�FSn�e7���bȗɢgzE �HlR���
�����Κ����\V��������`�ۡ�Ƿ�-���@B���/�IɷEN�	�G3R	��'�W��N�j��RsT1Bv��r�͍�Ss�^7��'��Tޚ-Y�9�����
��An�3���,iu��\i"��/އ��^$�&ě���:ḩ-�[�E�-�@�D|F#}I���)хDul�k��u�&�X!�Tz�O0�B�s|��X�7P��ι2!�n���z�^�4�N(Q�!)�E�?�ct�w<&Zb��7�d�ȟ�3��������oR���L^�܄/��^踉�@䙆�<�D�}�VN
���%��7V���M�[�ei �Tq��fԥB�UD���?K�5� ����:V���������09u�5��]NN,����.��P�K1�}Ȑ�Vh����%�9�E$��~�����A��ðΔ�z�-��P���pWvC���H�;H$��&�#aQ���( [6"b��4�6�,�����^���j?��"�{ːj�[@�ԕ}i����x���lS~�m�D����KT1Ot?B4�pJ
�EDE"B���WL<m`�?*�K�]�J��s�a�b���k�6���k������Y/.��lЌ"b�����є�wD�͕;l��2Ա(==�?�owS�[����<ɥM
Z�Dv�]���ji�<0�����nU�qJQ[�h@��N`D���S c�
��VA�!����V���@�0  �A�.d�d��94]��R�>x��7�o�i^�A��d�P}�?]���7��A�9�>WQ�*G%B�n<Q"k��𘄆����/��D�ߘ{/���@�㕟^�59���}�`��c�#�طP��=\����U)�>'�"ܧ@�B��'�\��p�'lgúM����x��d� ϟM��*�
��D���_*���C��P���q���F�[��wF���])�]�+��\Qt�D��%y�H�୏��P�e ��8����VrqK��

L�NٵRLC�+��6��`��r�=XK��]27�I���8�&�j� �}$E��N�%V�<��+�"��Y������}<�+wd7L�RX���,HgMl��8�M���G��V��~�b����S��Sfʵ�G{�v�6]Vh�x^� �[Fp�b�Ћ�2o>?ł���L�����"=R�3�(?K{��Ġ�P2[c����H��-�ܛ�hM]
���F
��u����4b@�(�Ɓ���i̚�b�]�����ǆ�1��������s���z����u�t���}~��qE'x��Q˧��6k}�ܐQ)����4���Ǧ���B���C��'�^�]/�m�f��:If�_	q���ZMP���v#.-<�+i��|{�ŕnIS�LOd��� ���Z�pr�N�(����#ō��@��@�ae��$%��@-RP2�no�b��@n�_X����v�m�v���놀b%'g�!{���"�|FT�s�kʱ�xte�H]��*����T~����>�u�㏏-���ޢ�ܼ�T�d���nj6�a7\�a�^��/\W�x���WЁ{�����S�ԸՑ��G�1+���r��bt���׈_J
�ic�:��P����wK�<�f��k�xb-ѓy�{�4��5��q�z���}�R.`� 7�D������'1|�#AN�]�Q��NUǯM����V��h�-�eLed�\����/Ǖ����o�$�y�2���U�%J� >���ƀ�1�Q��C�M�Q%�C~��Ӆ}���s�L =B,MP�]h�D��ݼ�n�R���^M�P���}4�Ů�B&���h^��Y�H�R��.��lP��T	�^+0q�ĭ����#˓�g�<V���ԓ�L�2�JN�K��6a��}��Xt�!��u�69׳u�+K���4�3��0�𥁽$�Qy=O�m������`����"�ge�i��ޠ���
��r�c���0}(��~�9�r�%O}��x�I0#�~
h��_�#N>�g�{u���p�����w\�*ޟfx�� ��T6S�XV!�HC}�w����O�!18��&lN`�߂��mBF1���fpd��x��l��<?敏����UQ��'�1+PKJ�n~ [7K0���'� �����^�R��M�N�������7ń����!�$ZCD�Z�8�GR�p�'�o�B�as(��/T�P�o����r[v^�8�_��n0�m����)���P)���$asި�e����k��GZ".� �.�-mr
�
2�<A�E{�J�
9�??��Z�������D���}�qd�C�&�!�H�G'+m�{�n�H����'F��:� -PRyu쀋� >d00�j�U!��'&�b��<ۦ:��VOL�y�`�����H�D#�R���pS�?��N 0P��v�!�_(��r���7L���Yi��;��&����R�6��R+*V[��ɼL�\�e�m ��X�P Q��-�ph#�@��E�[�pt��)7��cW\�F��`9�u�*~H����K]�R1��\eZ[oV�A�����W'�,�6Jv�f ;�mъ$�r�S�ε��&��bPy%-�\7�J�Ma��>�5u3�!��wޤ�dgF�h��NgO����t��&H�G$��Y۳��X�Y���RہV\ 㨉�����"y3��M/���>�+�j_f4��  �Mi�=�U�AV�z��w}}6�6JG���	�SQ��;��*��C{,u��ZU�f]�\P������N���%k�U�Xf�C�HYM{/�,����(6�,do�{���{��O�Ic!�������6�NX
<,@���>�D^��@'iY�c�0t�ع��x���kf��GP_X>�Ч���p-O"�F{Y1��5�TA�L��Q��mA|�G��NF�e���z$�Չ��Y
ATЎ�����i�ǲ�C>4�PI5�Ƅ#�@ �gH���Yr��ɋ���w���k��zO��u.J#=�5� yNr�g��|��3*�D@P
�cl���z`+z�������amX7�J��_L[��f1�Z��ja�HRjh����"����s�՞�(]�Jv�6�	��JD�+�^A�>��ϻW��j����	���<�   ��OnM��ЁEa`��&���y��J.~1��V_��Uȑ1q�� ��~��G���o��w����΄tt6%�|*����@�!� �$�q������/9k�r-hNI|��0��EܐeĹ �9����x]�����=%�£z�5p�E���{�醤l���x# ��rU^��-�.VtA���ݘM��s��%htNl^	
&<+b-�]��;1L�`���r�n��;���	�B�޺Z�TV��L ��a8��b|яc<��wt�%Fo�5?��������k;�_ݏ�C`���irٌz<��ᤢ9)�/�X�9$+�������	$��3q��#�Q��G��^ߥ�}��L�Jx�+�	�dǂj�����I� ?C7�-=� y�@�Y�  �A�R5-Q2�
.�Nd�%
���}�c�k�%�2������,�n��e���LO��e ��ۀ /y����@�خUax�"�3��ǩ.����	��e��Ȋ�X�~�>�ѬM}p�mtۼ��bilܗ) �Q'4�.������ M�-�wy���i��C����)s34o��{�7�������~�S��|&z�ӑؓ���v�KH�kj�6�������EE�I�
�qT.�,��/`�ug� ���� N���I��64)#6�Ýj������c�-L��C6�B(��R0y��dԐ($rw:�>q	{#���:�Ǵ1d{��=i�HU���Ӧ&���~�<}�mu;�q:�0�W�.��莑������ �SJ|�n��F������R���AcZ#���ރ��0w�֛����,�SV�w3���N+�x��s�t%d�ʓ�N,X�GÌ�[��o��Gr�e��M�C��{�zS��צ�7Á�"gȵX�yϙd�(p�p�
iH�&W���Dg�������Y!l}%)BuVx��Ѐ3? RQ���,��3|t���� U���n�J)R���H�4FjD�c�+������؟t!������R���L'��Q페��1���П��	�C�Zi2�#�"�i}�Q��_K5rIX�ک�&�-� ���Aa�FJ�Qȿ� SVC��L�ش+�.[���Ml܊f��gy5�[Y�W��s�|F�RjS%�0�/��[�C�$H��yJok>D>Σ�=��|��Viv�b�:��B0l�b+'����2R�r�;<���_�"`��P>Nod��`�����\�����4��h�~-�6�G'�h��O���?�������^�"�Mf��'�
�O,���@�l���{&��bJ�1�.>$� �0���<<�#&؏���o��p�#[ޖ���'&���N��c��|'�v�1�����vS�J��������le� ɔ2�����3:U�iA���wa�x�,[H���ٷ�u��i�:� �yOB)f�_�J�rd=��C��$<��z�ڮ;pV����(&4�;	w �Q� ��Z���Lr�^�x�M�����ŖfzH)��E�´����K*�ÿ�����2�  ��qnM��,g�C:��|��"z��1@��LG�3��ԟ����$��JU�R,��&PY���Hd���=z,�9�z����s~^�E�2�,��Ae���K�PgxGU�����j��+`�N��:����l�AaLfQ��0�R�+�L�� 8�D]z��d�H1�I���_T:#dn'�	�y�fs�o��խl���伻w�-z��S��ai98��M _q��qPWN�B��q���c����}ѝ�H� ��TR�0N �%�10��%��^���7�\��r�2��wu�3�� ;$�*�Re�N4�q�!�5T&S��b��7T,=v�_N��"�A;��B$�ۋd����VR�� ��2��ކ)U�_vec��i��d6x��~�@��eQ��0#���I5��B���&�w��1�v�@;7Ġ@4�P[��! 	,B!Vw����RzgPeA ����A���FY�Ñ\ۑ��k���vxp�2e����/숒��k�K3��E�"��۞>ݪ��{o�i�2j��;K�W�����w߬oT���!��J�4�����z
�G�fCcb���kc�?�s��w�2�~@^���@��F   A�u<!KD�`RNC�!8�����_�]`��g�xB��Z��@S���ǥ�W[-S�[�)<�c�,�&^�
���>����",!�ǳ�ݑٰ���NIҳ�j�@��w@�% ����x�SE�Co7�V4H'b�#�g�C��
c���[I�ʾ���e�R����>���6O	�¹���g�b)ҡ"~��W<(�7/���`���$�+n~_�R|ؕV�kC�WSp��e�j�LF�|v�2�`QHhϵ�^���I}�!�º���Q~Xa�zw�zL�Eg�\��f@�VUH���~�8�?��v��(Y���W���e�a��f-k�%e�Yޒ��Y���a|o?�ⷿ�*Y��i�i"� �Sl�X��W��#$�[h��&*Ϊ�8<C��+!�<vf"Φ��,�G�^�����U���")Mv�����pꪄY����nT�'�SKGO��5rCfs`�w�8�6C��Y3���`�bUWò�Tܦ����Nks�e������K4�оNI��K�G��@h
����%Ŧz)�B�YTL�Wk�`�^�n�_\��0�a��Eu ]��ţ14�Zag�D9e�g�F�t��#ЦW��Y���t[� �un*��WNe�(��x��Zih"�}xX��:��$#�rV֖}�t1�$A����:�y�­���N��CJ��[+W��O�?U"j��3xp���Ѕl~ ��%.W��^�s*jJt�O��~�
.V��k�8�r]!�7��@	��^�������ƞS�g\� ӧ�,p�%n�e^4�e0M&$T�/��F�`=b��䋆piS�����MA��a��եvN.s[���y���	
O%�~�Xg�X`��S\>��P�/�݊	��&��Zv`(ӊLX��#���%TC�{��@g.��X�P2cP[~I�8��XlΣWţ�̮~R��A����6���.8���;��EFӌ�fjOi�|F�J7a�̕1s��GL�WU+ݗd���g�h�r���K:�ݯ�a>���I�<~�e?�y��hVC��5�"��H�:7��(���t�~��`$���vy��� ��N^zե����=x��r��:��;��`�"j.*����u��نѷ���CW�r��)u���+��$SI_E���Sݫ���@������$dW��ٱ8(z!�_��	��{�Z�0���E���l��	[�ϻ;�AOm���6b�6�MdE5W��5U\5j[�"l^�9\^�|b�<�M��m�KL�P�N*<�N��=��| ���"1C�0G�b{��8'o2T���t͔]��}��TH�O�ڋ;�����Y�=�%�Db�j���?��&��2����;/ј�d�f�O�P�����z�C��c���#���(�68���WoL7�6��6�V	%Λcw#Lc<	�~;���~[��X�z��Y����}�84r]�O���ީAe�lђ�T�6K�S_J�����	��W����WZc�kZ���&��?s��|yV�
BI�¿�{�C؝����c<\&��ݘ�8��O mP0�S)S�VL��)�4���+�3�}�lQ��ը;��e��:�o���Չޗ�;�^�3�`[X����#no�ej؝�d��A�Λ��-)5A����x��v�[F �h�S"�&>J�DeW8�ض�T� *(��I=�v�[9��Z�-c���ڌ{�U������H�=7�kc����=,?��[	��?f\��`�#nƝI���T��83�m��p9�q�*Ѳ&�ű�p|�쮗�9KA��I�%�}8�M�Vg��jog���z���W�S����7[�n�E�S^�9V���h�� c|�:p��~iϣ�Ŧ�e�$S
�
�M(��c���;b>~u!��v��H��Ϗ�̄}��T�ކ�B�3h�;���[�3<�/��js���2:�><sE
r�c5K�`E�K�g$-�GB�D�D�1t|�*�"�\ �L�c r[���P��P�7�9*���J4�[dL�?(�R�OV���w��4�0�����,<*΋O.���5V����&�J�g�c� ,�$vH�rO�ݻ���������w����_t�����g� ���=�{��5�E�egrbtk������Z��M8�ڈE=�ޣ�<�t{)e�Q(Q�%bc���;sz��c}�[%���$�ڿ*�sH�CaWIB�f�f���>x���`��Т���a;��I߻�̓~�oO�S���u��o)F�H�`�?���aFFz�*y.|�ܺVho;����G��Ӳ��1�#9�mzNO9���A(���U�Y���A_?���K%D�9v\�S�j]�`!q� Vb����,�Q���쀿�޼Jh��s���P;�\A5�R��ÅϼZ ��RM�����Fڷ�󩫐v>�}o�Yo!���a�nM�6ݡx�(_�?�yU��R��t{��k��pes�2h�-�띥�z,���<	�����Ny��5�w	ծ+Ƃ0��(�]�H�]Ҍ�P�����2MG��UvWt[R\4��J�s��W��J �K���o��tV�$��Z�������-)q�V�c3o-��@���8�9��-�\��4l����k2
�F��\�aВ'�W����8������_�V̄��M`(uI����	$N�1�x�*�����A9f�ձEy���E��2C��I�"��!Q���������N��J�	l�-+��	¤����`WZ�X�7tkF��������`����6R%�<�)}��r����U�����I9�=^�(Y?�Aw�://��0�V��0�@��x3Z�;�4/�ӹ����2�^�
�bV�>����)�g�qݪ'-�h�ef�SϮ�sI�8��HY� 1�u��ng��a0:$� ��5vZ��9� o���tF�y���}c��ӝ?H]1�|7C��'7 �����*:��xB����5�$��&g�����g��������%r�L�����M #��:�������c�������M#ʱGS��!/�ŕ�!�|��3b�滏P�[{<+c��N�ZyD����*��׀$a�&sz�D#�y$����Y�-\nM��Rl�4�����V�_<��D��Է�SpO"� �������FB���r}$���^�0.O��GOޘ�p�������W~�S�>���fo�H%�[G���J��,O�r^�S��B�'��k����K���/K(���C)+v�l[gz,����hp-��4A��Y����$�¿k��=��a&�xC8����i��;��'21g�*��G� ��d,� ��EY��[��6����1l���'��VO]����`�FH��+�^�����Z&��=�����$�}JK��9�u����hk��8�P�x�D�B�FG���E�0��l�.@j~�C;��1]��Y�����Z0�� ;�H�ݍ
!���Bx��Df��J��Մ͎tǄ�Y�����Z$h��V�:�����^ޕ}����Qgv�����قb�������V���ZƑ(w��0D��B�#��o�c�WeĒ�l;���L�U�lYk�i��0�@�)�����|�t�nr�*O��ؤ�Ǜ�W
���1)eެ Ue"sqHӥ�fƘ��/�����B���oA�d�_t��Nv��*�_嘕P���' ��xO�=vi��NU��O8SX-��÷���diJ�k�3W�H�� W=}��+yl)�ϼ�*s���<�ݝ����K3�ZW�ۛL'��jjc>�0/�N���屒>�2�B�`��z� p&.�Sҳj �:��0E��*@%�te�OoE����=�)&NNw�5��Eqz*7��ʰ���o� �2����I�vJf�q���y�x���AQ2!�<�׾��\�X�]�lX��}�]8i��1a��u J���/�B;��<p��������qMF�>E��J�Z�&�F^�NC8{G�c┞�w���f�z���E���R��C�1l~a%�r�/���H�:*���SJ��A���z{�A+�Iú�,�zr�4?
6��|�W-F�;���A� h�U {%a){_̨�i��IYM�@��]�E�:�>w����<]�vY����Tc��|I����Qq���L�rq�Z5{��v���Q��e�Tc���(!��m݌���V>���qۧ/�	J�NnD{N�\�9�O`.V�A<bտ���w�,��X�B�İ�y�UuUs�'�g��� ԪS��=���Z��^��`[yC����
v�R'w5h�"x0[a��ۅp�E�Cm���G�Q~���$�������ԗ�6A~�J2�<j��r5��Id~k��'�~R�bJ%�7E�q)���Z��_U9�,Uw�gD�] 榘�{��5BM^�r��(J�Hկ埾�&
a�v�hwX��O�P[�g%�dS
��&\#��Ü�O� �Of/���`��0D[G!3������m��;)[YA�h}��p��t�zM�)�Jx���Տ���\O�=ӨK��~A7���ˠ��C9qIs�S����K$h�p1��k���1����),O�\A�}��i=��O{�ŀZ�[j��T`�i�(1|{?:纲���exlT/�/BL����,���I�w����Y�f
��E�c}[@@�*νUf*�$�]Ή[�o2��iˎ�D8�F�nR����6�|����e����>"#R�l	N�lN)OYM�Z
�T
��X��̔��Np*9��6��=I3��8Ǎ��B�~ �].��/;K��xɼ���E��P��3�.>�]��  �A��d�T����^��藸j�K�x�<��ܫr��P��nb~����#֜��(��78���dSBb5+�x�j/���=b���Nw�]L�:��9��o����X�U'���vZ��IXj��,uB<��o-����\W�88&CWꙠm� �extLine.substr(mapping.generatedColumn);
	        lastGeneratedColumn = mapping.generatedColumn;
	      }
	      lastMapping = mapping;
	    }, this);
	    // We have processed all mappings.
	    if (remainingLinesIndex < remainingLines.length) {
	      if (lastMapping) {
	        // Associate the remaining code in the current line with "lastMapping"
	        addMappingWithCode(lastMapping, shiftNextLine());
	      }
	      // and add the remaining lines without any mapping
	      node.add(remainingLines.splice(remainingLinesIndex).join(""));
	    }
	
	    // Copy sourcesContent into SourceNode
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        if (aRelativePath != null) {
	          sourceFile = util.join(aRelativePath, sourceFile);
	        }
	        node.setSourceContent(sourceFile, content);
	      }
	    });
	
	    return node;
	
	    function addMappingWithCode(mapping, code) {
	      if (mapping === null || mapping.source === undefined) {
	        node.add(code);
	      } else {
	        var source = aRelativePath
	          ? util.join(aRelativePath, mapping.source)
	          : mapping.source;
	        node.add(new SourceNode(mapping.originalLine,
	                                mapping.originalColumn,
	                                source,
	                                code,
	                                mapping.name));
	      }
	    }
	  };
	
	/**
	 * Add a chunk of generated JS to this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.add = function SourceNode_add(aChunk) {
	  if (Array.isArray(aChunk)) {
	    aChunk.forEach(function (chunk) {
	      this.add(chunk);
	    }, this);
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    if (aChunk) {
	      this.children.push(aChunk);
	    }
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Add a chunk of generated JS to the beginning of this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
	  if (Array.isArray(aChunk)) {
	    for (var i = aChunk.length-1; i >= 0; i--) {
	      this.prepend(aChunk[i]);
	    }
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    this.children.unshift(aChunk);
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Walk over the tree of JS snippets in this node and its children. The
	 * walking function is called once for each snippet of JS and is passed that
	 * snippet and the its original associated source's line/column location.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walk = function SourceNode_walk(aFn) {
	  var chunk;
	  for (var i = 0, len = this.children.length; i < len; i++) {
	    chunk = this.children[i];
	    if (chunk[isSourceNode]) {
	      chunk.walk(aFn);
	    }
	    else {
	      if (chunk !== '') {
	        aFn(chunk, { source: this.source,
	                     line: this.line,
	                     column: this.column,
	                     name: this.name });
	      }
	    }
	  }
	};
	
	/**
	 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	 * each of `this.children`.
	 *
	 * @param aSep The separator.
	 */
	SourceNode.prototype.join = function SourceNode_join(aSep) {
	  var newChildren;
	  var i;
	  var len = this.children.length;
	  if (len > 0) {
	    newChildren = [];
	    for (i = 0; i < len-1; i++) {
	      newChildren.push(this.children[i]);
	      newChildren.push(aSep);
	    }
	    newChildren.push(this.children[i]);
	    this.children = newChildren;
	  }
	  return this;
	};
	
	/**
	 * Call String.prototype.replace on the very right-most source snippet. Useful
	 * for trimming whitespace from the end of a source node, etc.
	 *
	 * @param aPattern The pattern to replace.
	 * @param aReplacement The thing to replace the pattern with.
	 */
	SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
	  var lastChild = this.children[this.children.length - 1];
	  if (lastChild[isSourceNode]) {
	    lastChild.replaceRight(aPattern, aReplacement);
	  }
	  else if (typeof lastChild === 'string') {
	    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
	  }
	  else {
	    this.children.push(''.replace(aPattern, aReplacement));
	  }
	  return this;
	};
	
	/**
	 * Set the source content for a source file. This will be added to the SourceMapGenerator
	 * in the sourcesContent field.
	 *
	 * @param aSourceFile The filename of the source file
	 * @param aSourceContent The content of the source file
	 */
	SourceNode.prototype.setSourceContent =
	  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
	    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	  };
	
	/**
	 * Walk over the tree of SourceNodes. The walking function is called for each
	 * source file content and is passed the filename and source content.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walkSourceContents =
	  function SourceNode_walkSourceContents(aFn) {
	    for (var i = 0, len = this.children.length; i < len; i++) {
	      if (this.children[i][isSourceNode]) {
	        this.children[i].walkSourceContents(aFn);
	      }
	    }
	
	    var sources = Object.keys(this.sourceContents);
	    for (var i = 0, len = sources.length; i < len; i++) {
	      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	    }
	  };
	
	/**
	 * Return the string representation of this source node. Walks over the tree
	 * and concatenates all the various snippets together to one string.
	 */
	SourceNode.prototype.toString = function SourceNode_toString() {
	  var str = "";
	  this.walk(function (chunk) {
	    str += chunk;
	  });
	  return str;
	};
	
	/**
	 * Returns the string representation of this source node along with a source
	 * map.
	 */
	SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
	  var generated = {
	    code: "",
	    line: 1,
	    column: 0
	  };
	  var map = new SourceMapGenerator(aArgs);
	  var sourceMappingActive = false;
	  var lastOriginalSource = null;
	  var lastOriginalLine = null;
	  var lastOriginalColumn = null;
	  var lastOriginalName = null;
	  this.walk(function (chunk, original) {
	    generated.code += chunk;
	    if (original.source !== null
	        && original.line !== null
	        && original.column !== null) {
	      if(lastOriginalSource !== original.source
	         || lastOriginalLine !== original.line
	         || lastOriginalColumn !== original.column
	         || lastOriginalName !== original.name) {
	        map.addMapping({
	          source: original.source,
	          original: {
	            line: original.line,
	            column: original.column
	          },
	          generated: {
	            line: generated.line,
	            column: generated.column
	          },
	          name: original.name
	        });
	      }
	      lastOriginalSource = original.source;
	      lastOriginalLine = original.line;
	      lastOriginalColumn = original.column;
	      lastOriginalName = original.name;
	      sourceMappingActive = true;
	    } else if (sourceMappingActive) {
	      map.addMapping({
	        generated: {
	          line: generated.line,
	          column: generated.column
	        }
	      });
	      lastOriginalSource = null;
	      sourceMappingActive = false;
	    }
	    for (var idx = 0, length = chunk.length; idx < length; idx++) {
	      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
	        generated.line++;
	        generated.column = 0;
	        // Mappings end at eol
	        if (idx + 1 === length) {
	          lastOriginalSource = null;
	          sourceMappingActive = false;
	        } else if (sourceMappingActive) {
	          map.addMapping({
	            source: original.source,
	            original: {
	              line: original.line,
	              column: original.column
	            },
	            generated: {
	              line: generated.line,
	              column: generated.column
	            },
	            name: original.name
	          });
	        }
	      } else {
	        generated.column++;
	      }
	    }
	  });
	  this.walkSourceContents(function (sourceFile, sourceContent) {
	    map.setSourceContent(sourceFile, sourceContent);
	  });
	
	  return { code: generated.code, map: map };
	};
	
	exports.SourceNode = SourceNode;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxNjI0YzcyOTliODg3ZjdiZGY2NCIsIndlYnBhY2s6Ly8vLi9zb3VyY2UtbWFwLmpzIiwid2VicGFjazovLy8uL2xpYi9zb3VyY2UtbWFwLWdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmFzZTY0LXZscS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmFzZTY0LmpzIiwid2VicGFjazovLy8uL2xpYi91dGlsLmpzIiwid2VicGFjazovLy8uL2xpYi9hcnJheS1zZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21hcHBpbmctbGlzdC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW1hcC1jb25zdW1lci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmluYXJ5LXNlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcXVpY2stc29ydC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNQQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJDQUEwQyxTQUFTO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3hhQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBMkQ7QUFDM0QscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBOzs7Ozs7O0FDM0lBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQixpQkFBZ0I7O0FBRWhCLG9CQUFtQjtBQUNuQixxQkFBb0I7O0FBRXBCLGlCQUFnQjtBQUNoQixpQkFBZ0I7O0FBRWhCLGlCQUFnQjtBQUNoQixrQkFBaUI7O0FBRWpCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDbEVBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBMkIsUUFBUTtBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTextLine.substr(mapping.generatedColumn);
	        lastGeneratedColumn = mapping.generatedColumn;
	      }
	      lastMapping = mapping;
	    }, this);
	    // We have processed all mappings.
	    if (remainingLinesIndex < remainingLines.length) {
	      if (lastMapping) {
	        // Associate the remaining code in the current line with "lastMapping"
	        addMappingWithCode(lastMapping, shiftNextLine());
	      }
	      // and add the remaining lines without any mapping
	      node.add(remainingLines.splice(remainingLinesIndex).join(""));
	    }
	
	    // Copy sourcesContent into SourceNode
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        if (aRelativePath != null) {
	          sourceFile = util.join(aRelativePath, sourceFile);
	        }
	        node.setSourceContent(sourceFile, content);
	      }
	    });
	
	    return node;
	
	    function addMappingWithCode(mapping, code) {
	      if (mapping === null || mapping.source === undefined) {
	        node.add(code);
	      } else {
	        var source = aRelativePath
	          ? util.join(aRelativePath, mapping.source)
	          : mapping.source;
	        node.add(new SourceNode(mapping.originalLine,
	                                mapping.originalColumn,
	                                source,
	                                code,
	                                mapping.name));
	      }
	    }
	  };
	
	/**
	 * Add a chunk of generated JS to this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.add = function SourceNode_add(aChunk) {
	  if (Array.isArray(aChunk)) {
	    aChunk.forEach(function (chunk) {
	      this.add(chunk);
	    }, this);
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    if (aChunk) {
	      this.children.push(aChunk);
	    }
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Add a chunk of generated JS to the beginning of this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
	  if (Array.isArray(aChunk)) {
	    for (var i = aChunk.length-1; i >= 0; i--) {
	      this.prepend(aChunk[i]);
	    }
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    this.children.unshift(aChunk);
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Walk over the tree of JS snippets in this node and its children. The
	 * walking function is called once for each snippet of JS and is passed that
	 * snippet and the its original associated source's line/column location.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walk = function SourceNode_walk(aFn) {
	  var chunk;
	  for (var i = 0, len = this.children.length; i < len; i++) {
	    chunk = this.children[i];
	    if (chunk[isSourceNode]) {
	      chunk.walk(aFn);
	    }
	    else {
	      if (chunk !== '') {
	        aFn(chunk, { source: this.source,
	                     line: this.line,
	                     column: this.column,
	                     name: this.name });
	      }
	    }
	  }
	};
	
	/**
	 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	 * each of `this.children`.
	 *
	 * @param aSep The separator.
	 */
	SourceNode.prototype.join = function SourceNode_join(aSep) {
	  var newChildren;
	  var i;
	  var len = this.children.length;
	  if (len > 0) {
	    newChildren = [];
	    for (i = 0; i < len-1; i++) {
	      newChildren.push(this.children[i]);
	      newChildren.push(aSep);
	    }
	    newChildren.push(this.children[i]);
	    this.children = newChildren;
	  }
	  return this;
	};
	
	/**
	 * Call String.prototype.replace on the very right-most source snippet. Useful
	 * for trimming whitespace from the end of a source node, etc.
	 *
	 * @param aPattern The pattern to replace.
	 * @param aReplacement The thing to replace the pattern with.
	 */
	SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
	  var lastChild = this.children[this.children.length - 1];
	  if (lastChild[isSourceNode]) {
	    lastChild.replaceRight(aPattern, aReplacement);
	  }
	  else if (typeof lastChild === 'string') {
	    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
	  }
	  else {
	    this.children.push(''.replace(aPattern, aReplacement));
	  }
	  return this;
	};
	
	/**
	 * Set the source content for a source file. This will be added to the SourceMapGenerator
	 * in the sourcesContent field.
	 *
	 * @param aSourceFile The filename of the source file
	 * @param aSourceContent The content of the source file
	 */
	SourceNode.prototype.setSourceContent =
	  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
	    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	  };
	
	/**
	 * Walk over the tree of SourceNodes. The walking function is called for each
	 * source file content and is passed the filename and source content.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walkSourceContents =
	  function SourceNode_walkSourceContents(aFn) {
	    for (var i = 0, len = this.children.length; i < len; i++) {
	      if (this.children[i][isSourceNode]) {
	        this.children[i].walkSourceContents(aFn);
	      }
	    }
	
	    var sources = Object.keys(this.sourceContents);
	    for (var i = 0, len = sources.length; i < len; i++) {
	      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	    }
	  };
	
	/**
	 * Return the string representation of this source node. Walks over the tree
	 * and concatenates all the various snippets together to one string.
	 */
	SourceNode.prototype.toString = function SourceNode_toString() {
	  var str = "";
	  this.walk(function (chunk) {
	    str += chunk;
	  });
	  return str;
	};
	
	/**
	 * Returns the string representation of this source node along with a source
	 * map.
	 */
	SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
	  var generated = {
	    code: "",
	    line: 1,
	    column: 0
	  };
	  var map = new SourceMapGenerator(aArgs);
	  var sourceMappingActive = false;
	  var lastOriginalSource = null;
	  var lastOriginalLine = null;
	  var lastOriginalColumn = null;
	  var lastOriginalName = null;
	  this.walk(function (chunk, original) {
	    generated.code += chunk;
	    if (original.source !== null
	        && original.line !== null
	        && original.column !== null) {
	      if(lastOriginalSource !== original.source
	         || lastOriginalLine !== original.line
	         || lastOriginalColumn !== original.column
	         || lastOriginalName !== original.name) {
	        map.addMapping({
	          source: original.source,
	          original: {
	            line: original.line,
	            column: original.column
	          },
	          generated: {
	            line: generated.line,
	            column: generated.column
	          },
	          name: original.name
	        });
	      }
	      lastOriginalSource = original.source;
	      lastOriginalLine = original.line;
	      lastOriginalColumn = original.column;
	      lastOriginalName = original.name;
	      sourceMappingActive = true;
	    } else if (sourceMappingActive) {
	      map.addMapping({
	        generated: {
	          line: generated.line,
	          column: generated.column
	        }
	      });
	      lastOriginalSource = null;
	      sourceMappingActive = false;
	    }
	    for (var idx = 0, length = chunk.length; idx < length; idx++) {
	      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
	        generated.line++;
	        generated.column = 0;
	        // Mappings end at eol
	        if (idx + 1 === length) {
	          lastOriginalSource = null;
	          sourceMappingActive = false;
	        } else if (sourceMappingActive) {
	          map.addMapping({
	            source: original.source,
	            original: {
	              line: original.line,
	              column: original.column
	            },
	            generated: {
	              line: generated.line,
	              column: generated.column
	            },
	            name: original.name
	          });
	        }
	      } else {
	        generated.column++;
	      }
	    }
	  });
	  this.walkSourceContents(function (sourceFile, sourceContent) {
	    map.setSourceContent(sourceFile, sourceContent);
	  });
	
	  return { code: generated.code, map: map };
	};
	
	exports.SourceNode = SourceNode;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxNjI0YzcyOTliODg3ZjdiZGY2NCIsIndlYnBhY2s6Ly8vLi9zb3VyY2UtbWFwLmpzIiwid2VicGFjazovLy8uL2xpYi9zb3VyY2UtbWFwLWdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmFzZTY0LXZscS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmFzZTY0LmpzIiwid2VicGFjazovLy8uL2xpYi91dGlsLmpzIiwid2VicGFjazovLy8uL2xpYi9hcnJheS1zZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21hcHBpbmctbGlzdC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW1hcC1jb25zdW1lci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmluYXJ5LXNlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcXVpY2stc29ydC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNQQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJDQUEwQyxTQUFTO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3hhQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBMkQ7QUFDM0QscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBOzs7Ozs7O0FDM0lBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQixpQkFBZ0I7O0FBRWhCLG9CQUFtQjtBQUNuQixxQkFBb0I7O0FBRXBCLGlCQUFnQjtBQUNoQixpQkFBZ0I7O0FBRWhCLGlCQUFnQjtBQUNoQixrQkFBaUI7O0FBRWpCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDbEVBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBMkIsUUFBUTtBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTvar TYPE = require('../../tokenizer').TYPE;

var COMMENT = TYPE.Comment;
var ASTERISK = 0x002A;        // U+002A ASTERISK (*)
var SOLIDUS = 0x002F;         // U+002F SOLIDUS (/)

// '/*' .* '*/'
module.exports = {
    name: 'Comment',
    structure: {
        value: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var end = this.scanner.tokenEnd;

        this.eat(COMMENT);

        if ((end - start + 2) >= 2 &&
            this.scanner.source.charCodeAt(end - 2) === ASTERISK &&
            this.scanner.source.charCodeAt(end - 1) === SOLIDUS) {
            end -= 2;
        }

        return {
            type: 'Comment',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.source.substring(start + 2, end)
        };
    },
    generate: function(node) {
        this.chunk('/*');
        this.chunk(node.value);
        this.chunk('*/');
    }
};
                                                                              �S����R��'�o ��5����k0HvW��nSE�����4.H��r�V�	�l��S��Z��Kտ�*Z����Wx]�'���uv�=�����qQ}��R��r�ps���CQ�6�tL�B��X
Qڀ��K�AB��BHxO�	Z��|� 	�{�}�ܧQ�#@���r�TP05�V�1,��O�R�\]L�(�Q������M�f%�WK�Ng4O���� �O�I�����~Mv`�԰й�=����
B��
�I5M�%fBK�b�u3.��&k�X��"�$޲P�dk&���Ӄi���
��_������I=��Vf_��֤�<;�U�R��R�m�&�Py��^#������6s���&ơ6�����Fp���D�QN�Ϩv#aLs��{��gg�����b�\r�xy�TBu!6w�E�;�qahx^�\4[/�e��؍�M�k��_�Z)�D�	@?|Q1z��w,����)�g��D��e�Y��Иxqy�$R.+T��^%�.������z{�T}���/Lw��c���^$C�A[5a��Ě��!�Z��b��O�.Q�I��Mx�&��n��ns5IF,�����i2F{V(��RM �U�Ɏ�9�fc���oد�E�7���w�5��32G���a�6�z)Aփ^�'���֣s�_�JmTSR,���.�7ܑZ�&���O�]Vp�ulW�x�4�zy�j�������|�b��1_�]����-�M�Lـ��|�l�k�Y�KR�>�ʥ�s��}�IK��B�/��?sیqҗᎮ�gv��P6�-�d��It�^!,�W)R���]o�.֧3��P����2�b�)�"eF<�/�T�a�m3�0��W|�e�<�L�c�<�Q���0���욙��3�j�
ju����!ٝ��n���;^C����qdn��d'L��BF�s7T�������1U;��9�w5��
������[����ZSGe�M_�(�(T�Z����fj>竺B����U<�c���(^�;]z��Ih������f�e?���ay�������%�sl	��)��k�B�(�+e���+E):21�g��g C�v�y����3kx���8�����Z�����w��uf:��;��p�=�U����7Q/?@��w�N�h���R(i FO\X��7�����v��΁K	�w�S�ʆ�\lw��frtv3�ʹ�d�5�a�wd���;����F�m�����NE�#�v<3�u��7�m|��N�_�?J���d$:�%uJ`�� =}S�Ogt��iT��Q��$��䧖���C�Fj�i|8��/M�}F�)�j�J~�]$�o��AZ�H˧�#�w��������W�uOX�'��-<�2ӝ���`f�����44I���Lu��Y<�����a������T��KZ��|G�>�:�_Hry����O����eM�vT*�G,���:Cv��>���P�+_�QX�^�'ð�j�v݇F�Q���l�O�|z����F��^������$�s\oZk]�?����� Q�T�>_��� 8�����gSM<��I���~B�PZ1�ȟco��>
W��݁��U�z�;j�j�T/�9]BXԑ� ��ȭ#���up�� #�L���`� ��l��2 ZŗÄ����D�����/�Ͽ�o�K�3����>�C&6����
�cP}B�6u-Ñ�r�`�J��#>��AK�i��(�<���u�Gv&���	�Ma&���ó�8!-�g�������"�E�s��vس�$}Ӝ-W�A�8rA�֛;� ���c�r��,/��s&hM�	��'���6M���|W� s)�F��)W�5��x��d�Qx�D�[PX�'2�����@��r��l������&����L�Wb�����B!''=�]�Hi�9�rѽ5YI^A���I�4��޻,{uw<SC?.ٮ����5n�?��Ʈ���YqvұZ����ӂ���בW,C<�J���A7h����5���?�ƍ�Z�0ƛ\�����[�;�~Ee.�2@6��Α�M~G�j� *�-:_��F�-��h!}��£G�eBT����O:�BKU1$����N�ez����gm3RL��t��?Y�B��D�%�����-�6�.�P���?�Y��>t|4�ITV���Pi��>�M�Ԧe}]#����/�+�{
�IM�D��'�F��	��U�Q �m�$�h��/]wM�n�y���o�JPPH*U)��Wo����.s���������I��7���\���A�-e�ey��q��hm�y
=M:+sDR��J���Mˆ+��B�	.>�6fX*mI�'�En�jQ����&iY�w��k�<�_���7�S�e0?�aeœ�<p�z\h���Fv)���E��T�Nt*d%|OE�B����T�It�e@*I���ԯ�Vo~��$?�J8o�_!��0p��-�`�h]�@踳D<?*���
/�Y��=�Uz]�e�<O!���U�>��4�lɇ�P�=���z�?�<����\}� �ԠeC6�00͔�Z�7������_`�6c��1�n6B��J�9�`��k"��6��A�:����{��_��1���Y����͈�� �o�H���cM��E/UcC�҂��Fz��f�~�O�Yu�-��&H[j�j���?q�����3��Y��C��b���h�F��TY�-�v�d^�#HM��6���SL��il�f��*ȹ����~�JI�O���\UC�wҌc�[�(�Qy T��U�@���h����YSf蒈��ۊ���8��Dy��Ȭ�_�-3wYE�2�3%����b����!�M��ن�p����Q�֚oS�]�'�f��{�͠'Yۀ��X��l�}�ٖ�c)�<���h�m]NI�@��z�(�(���+tD�'L}����y
=��`� >jFͻ�}-`y _/��w����D�g2���D�����X2����IY�K+��g'��6փ�v�3ȋ�������y.��hilK�����գzʙ��2H�ɱ�R�Iq�k�v���N���*�w� �+PS�m�K�ͳ���+���u��A��
���V�
�2SSJ��%2 z��v^��?Ό<�Ž�$�����'-X�$1�s�����mz*n7�e	��S7�
H2B�z��� 6U��( ���󼁴{j%M�2aIL�k�C
8�l��WD_0��T����f�wy<��2�GÂ4F�5���z�ؕ��v�+�Vj_r�=YK"�s*��3�Ё�G����J�lԐrd��2D<$�!�sPpؚt�Er
)Z�L����b��ʕ���6����8R��c�/mׁ�[^�W^�f�t��X��ES�%%�Cj�0��M�*����b�����hNC���K�+Zj��Ԁ�J�4q7��!�n1���Wƚ[%+�Tt���~�6Bc��{�g�z��Nzx(�C��3��!0>C�@ uAdhT��7� �ǭ<O��9�������������	�=Q��U��M5β+��Ay}�����,���5u�sѐA$��s���A�7Nd#bM:�]J��X�ֶ:w
�G�t���^\qӝ�k��:?\���2V�fԩ��� ����P���	�^IM�ů_U��1#c�U��:����ϭ�u)�:�*��#
�R��E:�_w��^}Uٵ7����k���|H��`�Z'��Μ,�I�2Rh�G��rI�	ss���k�S��WyRE��6Pݏu��%b�n���~J��~k�[�H@]-)�Ч����c��)iu�)@��T:p�o��P��^�<���9�Jn��u����T�����o��J/�$]$�F{,��v���(�C>w%�2�~�;�8-;�(���3R����k���\��N�[R�Ca5Vv*5�	8c쭊�,�z�
��������G��l�6u'������=O�Mo�_U\���@���M"��J��9�O�~=�Ok3*�(��[�+��� �[GL5��zk�|*��iij���,(����FW�����k}�}�<�b�E h}�-/�POų��%�س������B�p����.06�
>�e+!K�s����$bt)��s��+�SYr��H����$
� Vc(nb *?��,�J�WOQBk�^�9���Vu���"�����s�j��H���������U)����@�l^�0`ʲ�]�G���.`�6@�������+\��IAqB�*�H����`֮�/q2|���K�{p�uM�N�V3^�t,f�] :���'���z��/�{	�R�g׹y�\�υ4��9nv�K<�����WTՔ$�т�áp!j�4�Ŷ1u�Q$CZ��x��^��;�H�(~��#'���m�ܹT��ٹ�������j�R��+��I��Sچ������� �~7�k��K����X������u0���t�����J2xtv�� tK�X �{�:��t��Ah~�<sT0�R� �ҧژ�\�;/9��rK�%1�y�K���7�����Pb3e���9�.]�*4<�2/9y\�n8�HC���0Z_m����Pk)rZ-�*V�������e	�8��\��Q�w�ڢ�M*�P��[,�0�I��U&dZۼx(Аꚋ�	�+1�R@�0�kŨd���3��s1��#UK�=�g}꒹�J�#CT���uW�sДp��a9���<��7*�#Ɔn��Q^ME흱����#�����I���3�+I�6��3�e�_��Rs?�Z�8�n�=��h��Z��(���@�7��
0������8hPJ���o�t�z�\�-�:r�k%�g����p)Bsw��W-u�F��ٝ��Rg�tO�0~�ѝ�PY�uq,�6	��D��&Ck��*�#�@p�@�����Y&�6��AH�.�eYA���d�`�Gpf�]X��G��R�#Y�m��I������I�<�/Q� T�{��F�e���F\�-̴`n�s��;�;�3��׬A9��S/�C��h�A�E	�"�Zړ~�E���q8��XT�<@�iʈi������z],�LQƚ���Yk[ч�)��>�3���'|�^}��GN��u�༣k�H�Eº���B%���><�/N5���wR�iO�ܽF�Ck�n�Z�����ά}�E`�u���U"퍡�}�vzna�cs�<F����?^Ɂ0�?����;�A���p�����8E1����}K��$�D+���-����Ef��7�-�����ɧĺ�w��I�ˮOLط�cu,�}�(����3�{�(�WKؗ��'j+F$~]��x�Db���ZvJ����9�Ӵ��&���C�f:�W��Rgn&k�;ķw�1��_3�q�G�Iה2¥!"�YX3͋�w �U�da_��L'"x_�l���k��ÞLA��q�_�F:�~!���#�E�t�v�������x�l�.�e_��T�_ x���1����(�������B�E^�pU]'�69���������L�u�;����0�D��~Wm^0+�"�	`�[��� q��y(��53p��0T_(/,�o��;���}���/�~�zSg�4KGpa�%�ܨ@�Q�ǋ"o���P2��!m�ֱ��m%�ry3�kg�=�Rq۔a�՝�ʋ���Q,ҍK>Ӓ��R���6|(5�h��!�[���Iҧ�p8\[�eƮ�p��!$A����]*m.�*TO�vj�#�1Y15��v,]T�U�Q/�^^��ӆY�U&�[O���#7���|+�FB�,��"��86ƪFNE�4� 3�*��/���Z�QH���dm�(�t���I���M�I����Z�T�L�Upl���z��P���7 �c̑�����g2 �=�4~S	h;"#0�#�z�,r�M�
���4��J�����|�>��ɟ�� sA�/�q�-=0��3`0��Be��1�rf�h�Di׀0
Z%�k����1�����I�0jtX��#)�G�A��Z��l��o�wt�NC��YR=B@���n�+d[M,���
l�e�D
X�����%��c>~��ą�ʩ�j��B�j�n~���&��lE*�ٯ]$�	y �[�`BwH��ɍA�8v0�r\H�ݥU��z���%7�{� /]>��e��1���{E8L��`B��B���$ �S0˃z����x_��_�
�J�����M�M>��K�Uv!}1	�6�GKYn��ӧ���תf	��P�*���Ћ�)��ע/w����9��r��V��u��۪����{6/�]�~����
�(���V*�߀�j�3����#������.Ϡ]����H\gle���vj�6�[�����h�����ϯ�O���/w�.oQ���TGy�%���(`�#�V��p���i5�J�~�S�������|��]�#�}�yNs�$Q/���ȩ���t�}��0���IhR���3����%�$ɩ�1\K�,�h�q����J��C����>SocUa�.,�=ҷNf=*�T�G����H���NfJ�w��Y��q�}�|���
M�+^~C��$��'���^8�M��A���X-(0��h�xN����Q��O�V�>Q�V-�v~!���k�Y�GEl��]������	�h�J���;����;�����ʎa�Z@��o~g�=P��!��X�ƀSC�C\���@@�N|q�t��=�D�!R�[Z��"��)�1#^۔f�����%�ub���l�՜��-�H��#մ��Y0��R�.J�sƗ�����h��B+Hk�8��`�g̼E:#8��lu����9͆	����.7n�m�jS�}��>�Ș����
2S[�;���$�h���\��Ԛ(*�N�Y��+�_ޔ�Z��a��vr0�B��4n�<}��4f�u�P7��L�>%3�w;B�R��Ts����HIo��MB�����Z�O �I�^R���^�A�1��!�9�E�0E93N�X"�UA8%M%�c�TW�2��Mjs>���2hW[en,����yq��E�YF��{Tv�4��b���h�%ޯ�ͦ�H��7&������⽗u�0x���|"0��"�a;�I�4`�0�8djh�I!x�񣓂7V�<����>����f���eq�V�� >ѕh�[=����v���C�v͗E629a��huqtSH����^�������B���p��*mS�������3�"�ң�	�A<E������K�I+u��l^�����G� ����ŷNg}J�.fE��lw�J�a1����Ż���*�(B���[z��uAW�� ����i"��@+k���FTe�-gG�n�qu�y�Z����|�xͺ���_=��>և�<_�7w���>��(��&��j,b��u I��>�W�2T~��^�7!�͐�w���P�M��T�8�]���i�L'�+n���j��JR����2R=�rsv����ǥ�����f*�bSG.�D<g��k9bڤ�@
���-Z! ���*�����(��2�:�tJp���/x�s���d��vԦ��mi:2q2B����M�_{��Zt�W>�$�$b�����q{�~���&���D�sV�Z���7��;���5���M�ļU�������S�<�`��p�M���"77f+G��0�h�ݒ�O�F`v��F����]�>V�coz�g�cd��AK�:r�Tp	8C�"�	�|��������(�� �7�lK��T��*��%�߾��'���hG+i�nڑ�E˥K��� �,�>߳��ZqO�y��V���T��,��u�'���˦�$ёR�>Oh�׈�x9$� �a[#�Lɢ�~�e��Ԋ�<��jx*�h����0�%��K���������b+{zM�# m������ld͋���6�]<	�}T?�Ҳ�[��,�z��A��.f�ټ�3��?ׅ�B�_J�#:�Dj}K��w��{�~3��%ȸraN�	NG4Y���8�10~�9a��4���Vi��;�i:cd��Ɋ��'�.r&��T�:�6J'�ŐU�x���
j�ZN�R��ae�]Z�ي���loB�9 \>�e��R��e5�3[���t�&����@t�E���.����i)�����W�C����j7=y:"�������|������M�_5T� e���Y�+��I,�D*ް��7��Ϙ��)��9vs\�m���i�8v*�L	v'�XT�ђAgY����*bJ�����_�ʫ 䯺Y�-����`[ �� �O��i�F�wi���@=Ou4��ge�+`ż�Z	�k�}Fqs��Eu5E7��\(6��nsp�wBĴ������/~lpG�q�HahՑ�O��qo����z���]��F�g�q; cT��vON�6�:��Td.�0��-W�[7Qڭ��ӊ鈱�͈���R1E�rA���m�J]�$h���$KB��wD?L�؛�}�l^26���ĸ�Ю:����ء�v� �B[fj5h���^aF
� ���Ψ��?}B�m����C
Q#�������\ԑ���	T������wu�_�
T�^����X��_R"ʤ {$Bt��*�C3�B�_��>�K��W�i,5x��KM�%F�?0�v*Y(pR���.��ӡ�ۏ����iJ�|a���&�i������	��s�¶[A��i��S�:�y�>$�;7��ЩB5��R��Tcƙż�`(��-���	�>C��l�#�L��9�p~�ٗ���g�X������X�ظG�6Z�RV��zj��&�[R{q����T�D��'9Zke�u��璗���v�89��;���ul$bT��&YF�$��N�c a��_ɓ!2
%��⟍��0"'�`nW}�ŎBk�H�I�!�͘�-�^�w�lF�wc�k���~K��9��W�DÒ�c�(L~W���c1��޷o0r�<<��`�-�X$Xa�B��DT~�����n�`��-Y]'�[-��`��n*oV�e�Ř)��m˚�ן��Q�!��6���	�ʰ+%484�(��y�4�Y��͡�ޱ�;P�(��y�C�e�YK���ZMZݙ%�W�1*�6"�J����v2 Z�WƗ5�nXAU=��AO�Xp-V�e�P�/���|���@_ͥ��6q�_�[��S��Y.�=�Ma�'�'���X�ܲ$����C�zԟMqE<֙0�iy$s�I�8��ʮ/V��	S�:�CIN���$o5]��/?�Ofr��1s�ZXB�l�^8��,��E\iQS@e���b�"W&���~��(df�F����W]�dQ�d����*/_��E���p5���:"XEa|LSS)���NM�pkX�YQ��>��8d}T�X�Q�Qߜୂ�À�,��F���.I��Д�$,v2a~}��d�}a�}�ׯ-knY���5�Fۄ�u����q;^Mf�=k%��)�O8��љ���:�\�Wϵs�C�)r��pJ)��HIu��f�ni��p!�b))}�q�-�~�!bꨞ{{�H�(+�D���$=(��!n�UϷS�ԙz(R�F��a$S�ɻng��]|��O7��h�q�����zn��<�]t��|�Bj'������o��f�Q<{t�t��[�:=`�&�q��sؘ���{0�3��O쬩�I�q���Y�ULq���H���N�S�.'!�0�6����������*ﺛ�w��|*�Ͽb�ѳ��z���6�h��������[ևĿ�b�j���t��Ig�H9�5�pO��L>��y8Y�4����j�#Th�u=�;3E~�)k�k���G/x�䡦T�8=��]P�j4�<y�M�jS.�V�s�MOt���@w=�Ī��{�sEv��V���l�7 ��nT���ؔaوϲ��R��ݹu�[=�c[�e2��F�A�"k�E�,�%�R��y�JZ�e��F}t;�5yPt������iTb�]����|���,m����4AA����Β����Ys(jJ���1����]���U4ߏ������)���CG�K3RF���_�4��8OFt�}R��s��P|-���)�74�ү��54�߰���<8�l�-9����ˈg�DqZ����Z]����#����!�5J�"������TO(�$����L[{���S�w�g��5���4#J�T�g�4@���G<a��iIR��ִ���3�òz����r��ACSP�����4s�2�j.�����;�ߵ`c�fO�{`���,x9�����*A�7���  	A�Bx����V�)�k�!�X�q��u�?cg`����ًs���>ȗ:'� �f88�e*g��n���\L�`�/�n�-^C��M�{�^���v2���W���GgL�,�#E$}�D�< �|̜�NZ����J�kb����fj#mX��g	h�UK��u�8"�Kɽ7��Z�/��PǑB���yt�"4��,��۽��㙉�����;���e͋�^S�p�
ߝ��C���yR n�w�8H�N�Y��X��G� ���莀J4�.qy�i�2iP�c'].�4�8( �5h����9�j,�<��{)4縁�:�:i��**�jRߦ��0�_�~T�4�\򾶭�ǧ���*R5��h���0��hػI@KLr�D�(V���:�g}M�Ӗ	<_��ڮ�*���� ��� Y2���޿�~����U��q* 8   ��atI��(d��f�T�X�m���Y���	�nn!"}4�"��{-apDׄW1':��+�0孚l\�g:�FDC�Ǟ$�})��xq��z�c�}�&U���%�K�׫LaF��0���1�e�����/$�@�z�Zt*k �qqU!�=��q.}����P�-�"��u=� .��{����*��b��o[nf����C�B�&�������Ӂ   O�cjM����SDᕈ$�ƀx����k�܈�����_<1�*!�/��a��0��ɑo&����~G��L���`c	�k@4�2rI�� R�qZ����7�У2I�������Y��v���x�m�
�|�X�ҫ#��"� � �*�o��6pxyg�XfV��q	��������3E�%�{qH(�R�jH�{��8c�c��'��S��[�?L�)��1yC������������Ya:}� v���J��d`  	�A�hI�Ah�L	 e�#���|i���a)��N� R06�����]l˸�'N(u$��y	���S���uYшRG1�a�r�9t��[�$��Ӆ�u䠐�Lc�c�Z~��&��0Ox-����O"9j>�C��G��5L�&kj��2��:EW�#ؑ.���a��@���o�B�]dE�ٙ�j�F�LTĘbj�zh��ࠗ��}�Ē����8��9ط�
�[��tU���

��+�B7�A��8����|���� ���T#��+�1�۲�0�0��>�{��=3�K�;�	.���<���ՙ}�~&���e��H v�
�4�������Q)7��L߷A����о���;6ɨ��S����F[
��}+����I���7X�@�`� I�{1T�~Yp��㾥n�ݔ��Ͽ{3Ds��e�\AW�Qˢ	�-���s�uv���]�?0�60�@��P�v�%�G����v���`8�6 ��L*��k����0���w���6?$S�.-��;��g�,��2pWS����ĭ�K��}�r�-8�������y{�@M�U�q�	՚˅bn�_��~�\�����7���U�tM��ʐ�l�����fR���J��x�&��M���b�(�&���r�ņ��w�'��`Ǆ���,i����Pq]qF��L}��� v04�B���������;Ts�z�������lw�'��:� ��?*k�f�﹏�����(=�s��a#dXgl����5
�V�sxC������'0�M8��;�d8�Y��H^��CԜ%�].��g�H�,��u�c���^K��7Ͳ�Vw	:�޼���t���9��}�n2�M/��_����ۭ��o�oF�^mk�ԑZm$�/���R�␑P����`�����5�?�R�I�X�'�I��B�:��c��܍�XϏUq!j�.�%k¯��)Ϧ��ɆÅ9�������̲�W8U�ABh*QqJ���	~�����ɐ��w�jPEԆ�P�
aδt}�P������6C��n����l��8�p�iS.�*4���,��I�j@�p�CiU�k�r�!��.�� DܬylX�jd]R�;� �����I^�����rQ��k�+�U�f��s��q�]I����5�m��R'.�[H;��7�;0�.�8�*�����Hb�W�>�1o�4�wc�^�)LG�)t4�V��Rmmy�	v��r����Q����v����G՚β��/�����G�r�>�MoɶvLc�L)�ç����"�OahE;V4��W<x k[I�Y#\��i0>l��z~>	VsA��)o���w��)��g����LM{������*�i��^,#/#�4�~��tZy*D'����j>�Ҁ]/��B�q���8~��Z��NL�(r��W��}4��a}e�sKG�����\0��,$IYx�W�R�xx}x&�h_�p�`��o�}� ʤ�V����lϥY�p��{ ����Ϩ�v ��ˀ��`���7�q��2
M�9=�4�V)tS}��$WjydT�E����q���;�6 ��o�C���tv�$V� �z,}y�G�H��M.���7t�֬��xx]G�+�s�y�Gvi'��&��@$�?cT�š�Ȥs0����E|��6>~��/܆���u�5No{��sJڱ�Z&�B����fq�(=]Yg�����>h�Y��\��	��&��l�+��$���J�p|��L]QS����

K0��=C���{�>��֣i���WW��-�U���q��ܠؚiOS��֑b��@6��??Ο'���C��V�����?4$
z�s��X͆1���Vf�eTpK����W�
��m&ʒ!'�0�`7�u�j:HQ�-����٩"�����<�{PƳ��>N�=���49�BOn�䮏��K���gb(�4�K@��8j�bX)����;�f��.�5��38ߌa�����g*�l�{rj{|�o�1b�<KP�]�O�M��G^Q5İ0r��)"�2M��N&J�Է��߷o�%?壛O��f]k��צ�Qs3�����k����'�<��v*M�H?�1�%t�k�~����<�.��xW��L�+���fX�F$�\�o�Zw���������~cȕ����N[�{�ERΆ/Tj�m@�!*�v,.����W�4b����?���)��F��I��)�-_	J 	v<N�#
Z
��<=�
�HN�v?�~Q�J\��@�Z�����U~:d|h��.n-w]�+��C	���⦄�t��*�=pS^D�H����PVw�x��2]Kt�,ʮг`B��+K+��?�X�u�a/�#� ���1)��D�+H�)��oO��:HQ�Ͳ��\r?&Rp�����f�@  �A��nQ2����p>T�/�ʏ� )��8E%I�.Թ,��T$���5~��mw�z�أ(ÿ�P.�f�o��zZOx/���h"�>qܛo]�+�V���P%yi�'v�U&��0'[c괥�ފ��b.vtb��ـL�`!U=����.�3U����[�σ��_(t�2w83�����xil��';�>_0�0��L�[�U�@T���-t5�TJ�����>���P�gGg\����Y�&�3�=Y�m���S�B`bL��݀�f��|6,~=�3�b�H�&���/��c+1J�1�9��f'Nhe6�/t9F��I�N�zx�o
#��ڧ�FUy���0��ե�B!�Tu5�(��HH0P���m>��j�R���ӏ�(�����J�hˈX'2�`��-�ȽWe+�7"ౖ�����{�s���PM.���i�8C$��L\!�.b�vǘǨ�ʁ��A`� ��_�3*���&~�9��0'o>���J��Ce�	�M�ɻ�K\��G9�]w	X��^�Җ��w��y�l$ ��뺝��z�c��1T�Jt��਍�Ys��}��٠��W����EL���ee��Y#���v��/�
�db�Z}=�5�ꑣ�.���[2"J��AY����&�θ�B��?��}/@�P���#���X���'[0��o�`�~+3��b	�P̥�w�_�02iu��FJw]���˻��u9u?����x��]�i�m�Vw%vhByak-���$��������M�=��h0� �hg@��{��¨�рX0#��Lt��bb�C7� ��t�a]��ȓ�2�-yģ���t�[U�/҇PCܤ׈Y~E����C�#�b'U�wc1��a���8�5�f��5jf�U����A��6a1�!����c�0� W��O �}��i�!�I}bO���_��ў[O�
��vt������^ZL?IBz��k͵��R�i�}f5�W����(]|\�^��zK�1�1�H�|�YI   ���iͅC\Pf"Q�z
�%ے�!�>|{A��$�C�Q_WPYv�4P���O��N��$��l��+EE�9� 	��^F���[:����{�CG�wAHi�aݡG�y��;.�����s��W��WƠ�x��   )̇���B4�.rQ�*.��� X*C����.�}p���:4���M.n���։��a�.EL)B�r��\b
�� �\�"+;��WuG���Xϣ����:�؄� �Cj��B�E���Z����<(R&$��s+�+�<��.k���%���}���*�MO[f:�W����b�� g �~u���G�`  /��nM��)ڕ�0e�Z7ɏ�a4�ƌ�E�a�c���WKL�x�����'k�؋�Xj�Texport default ValidationError;
export type JSONSchema6 = import('json-schema').JSONSchema6;
export type JSONSchema7 = import('json-schema').JSONSchema7;
export type Schema =
  | (import('json-schema').JSONSchema4 & import('./validate').Extend)
  | (import('json-schema').JSONSchema6 & import('./validate').Extend)
  | (import('json-schema').JSONSchema7 & import('./validate').Extend);
export type ValidationErrorConfiguration = {
  name?: string | undefined;
  baseDataPath?: string | undefined;
  postFormatter?: import('./validate').PostFormatter | undefined;
};
export type PostFormatter = (
  formattedError: string,
  error: import('ajv').ErrorObject & {
    children?: import('ajv').ErrorObject[] | undefined;
  }
) => string;
export type SchemaUtilErrorObject = import('ajv').ErrorObject & {
  children?: import('ajv').ErrorObject[] | undefined;
};
export type SPECIFICITY = number;
declare class ValidationError extends Error {
  /**
   * @param {Array<SchemaUtilErrorObject>} errors
   * @param {Schema} schema
   * @param {ValidationErrorConfiguration} configuration
   */
  constructor(
    errors: Array<SchemaUtilErrorObject>,
    schema: Schema,
    configuration?: ValidationErrorConfiguration
  );
  /** @type {Array<SchemaUtilErrorObject>} */
  errors: Array<SchemaUtilErrorObject>;
  /** @type {Schema} */
  schema: Schema;
  /** @type {string} */
  headerName: string;
  /** @type {string} */
  baseDataPath: string;
  /** @type {PostFormatter | null} */
  postFormatter: PostFormatter | null;
  /**
   * @param {string} path
   * @returns {Schema}
   */
  getSchemaPart(path: string): Schema;
  /**
   * @param {Schema} schema
   * @param {boolean} logic
   * @param {Array<Object>} prevSchemas
   * @returns {string}
   */
  formatSchema(
    schema: Schema,
    logic?: boolean,
    prevSchemas?: Array<Object>
  ): string;
  /**
   * @param {Schema=} schemaPart
   * @param {(boolean | Array<string>)=} additionalPath
   * @param {boolean=} needDot
   * @param {boolean=} logic
   * @returns {string}
   */
  getSchemaPartText(
    schemaPart?: Schema | undefined,
    additionalPath?: (boolean | Array<string>) | undefined,
    needDot?: boolean | undefined,
    logic?: boolean | undefined
  ): string;
  /**
   * @param {Schema=} schemaPart
   * @returns {string}
   */
  getSchemaPartDescription(schemaPart?: Schema | undefined): string;
  /**
   * @param {SchemaUtilErrorObject} error
   * @returns {string}
   */
  formatValidationError(error: SchemaUtilErrorObject): string;
  /**
   * @param {Array<SchemaUtilErrorObject>} errors
   * @returns {string}
   */
  formatValidationErrors(errors: Array<SchemaUtilErrorObject>): string;
}
                                                                                                                                                                                                                                                                                                                                                                                                                       ��z垞�+�>8��K2��	�Y�9�aP��ɸ��/[��1
��?��9��*���wܕ� z���^	�l�24
��Q�Jx���R��HՓ�rz/n��h�s'3�ִ��4�K�+�vѵ�vk�r�zW����J�<���x��;�Z���e?����R�0���<�CP��oBU$�YC�&��?��Ph������Llg2���_��t��D uH!+���w��`7�lX���
�����f�͏�����K֝����{�ñZI����~�B��'�E �1��km�K��d'|�@��-)ih��-x�f�� ��4r�1a$	!�����v0V&�zy���xo�ϯ���J���e.&B�07�b|����w��b�	���L!��h��-��T�rm��a�o�%���z(��S`[���z�9q<����X i��"��lt�lհy���@���T�T	�Њ߯�M���e�~����Q��[e�"_�C������侟�{ښ��[�z+d��q>>�j�0�V�u	��/U�ì9��������^�?2v�^y�+o�~y�A�=Us��6����1��� �� y<Z�)�?h-M񉪨C����=?�R��� �=����p���	��W�U�_�2�_�^}�����{��jb?d'-��w=�������v�$�[l�.�סg7�b��~���sKc�P>��&�\Z}e�«u���(��*ډb^��]Ԉ�Lxg���)4_H� ^,���8����/<�uذ�Ͻ6��#�l��;pH�$��N���_����G�ց�L`�;�1ճ�S�K�ƙ����Gp�H�eHP��|�x%�
�<ۀ���؎�[h5H�Ü��'����l�7Dnq��(�z<p���ۦ��K��Z�ϛ�k����Mz�H9��$��A@�-�2��ne7)D���ꤟuߗ5��!,Gb�Ogq�1R���_�y-�ڻJp����0�ٳMtQ��W��|��wޱlM����%��Jy[��;�*���C�gO_��U�A�����na�Up)�����=NE����y�,�P�0��+��Yq�q���k	�FT����<�w=�&�&l�������X0�8V�_��T�ͪЉ��#�jI��3տY�QVᦶ���J�h6�F�ޒ*�T�*o���N�`�{���"f�4V�H6��N"3�0!6���j�Ac�Q+��fM*�M��a�g����|�z�	��I+������q��⼕<$��.dh��&�̆b_*$����#~ ګ�u�+Y�(hlS�����D\���5~P���� K��MY�mkl�nkfY�3V>#6	��\1m4�(0g�Y<��.��r'�p������dyV<��(?`mGopǅqҘ���s��u��l1����L��BC���M�dR�������Yk'���|�eeM�ό:?�e��有h��+{��P�ja5.�{��:=I�N<ڣ�]�[<_��㫔!M����윒 !��0�����s�58��}rϪ�#c4|�I� �hG� ǚ�c��V𱃣��IX}ȽN�r#��a'!i&�2�v��
��}��Rל�`Ҝhj��e�s6��@r��B+j���?��⑀:�13Xi����/�^ZX3i}�S���\��v�K�?�����Fl��ük�����<)�3��������|'�RO3��,��iNV�H�[��3������y��<��"������C��D�g!�toh��Y�l�v�[@e�Z��}W�dH;� (���8-��'�v�����_�X�	C��w=[o?����
��j\�I;��#�����m�X��ތ��馤@��j����w8��tC��n��K��PXR,.�m�R�*q�x|�Pv):�k;0���&�L�t�2��%þ��=�}�����
x$��s#'雯�J)��ܸ������z��JԝH����h���}�K�UZ�j ����{�Z@�����J��s�6��䁖YL�9\�̹�}��K��U�	ޝ$&���5�Yx":ȷ�t2�!�~�c?��Mَ�bu�Kx��O�ߒ8jZcv�Xp�����6F�ejh�ںM�]9����$N���l;U{��Yt1�G�b����g�)*�7	q�Ͻ�<���D�p,M�YU�)�����<�䰉���V�������7A�y~q��G�׽�-H�=5Ҟ6��Yy�\����"�%��u�Gt���|,;�����iA8�U�A��4O�qV2t�Pk� 3W�s�F-�јM�T���|}��h)%#Z4��A�pB���Oh�Y5r0�0Lf�"A��8�x∑��`xW�m�;�k�)�I�g�� *:lb��]�[�阘�n��X��0��#H:ܒS����v��;��� J��/[Wh�GF7<sB�9�"l���P�=�#������W}��|�6@�Y��\��%��@��`8ѡ+7�Bd"�S�*sU��%%2����{D��Zi�L�C{;��)��]y����ym��G`�h���c���4M���2ܲ7�ƴI�5���D=�܃ԟp6������~(%@��̀3����vћ����;Jx�K,@t��Z���&�_�QOa�=뙷�X,v�;���"fyȡ����(�J����2���B�ո[^Ewή���^�r??����;J�I]Y�Q �AZ���b��ĝ	 T՚�����OJ���@�V�㱦����iS �N~
��x'\u�6�a'��X���Մ��$UdQh�����=���8�DlJ"+pD�/ǽ�-��`g��E]���
�#pۃ���Q��k�\} ӆV�B���:�1q�_�$]�꡿�dE*�Y���{�ǈ:.ϖ�\t@�v��`���1��"�F�+�y�|���l�lz7��,g��aUp'����H�"��M�}�׌Gz�!�+[\�B�(&�K%��t��5a��Gg'�.�:������z����� U��V	^��}� q��k�f��^��,M��;���k�ޛ=0d���Z2��L�K�[(��r�T]��]=���b:|�'�DJ��8N�zw��j�ѵG�B�: P�1Ru��e���2|\q8�Ph9��f�!�+���[�ɐ�l��<���)��Yb��F;����4]_�h�Le����X@CМ!'9�xUT�w�jJ|d�Y�W��Ģ�B�}�V�l >G�I����̔&!<�fy�V�9.�)|
Ӏ���<��ח9��Q!NLT%����@��h%�VJ�[���{iDqv�LM�~3�M�!���/70���RP���$e���c���/3r2����l���(B�{;���r���U��h��a
�@�6��,�1x�<=�K	���:�k\\�j~�N��@�a��2{:"�bT��K�a��ޭ�J��Ԅm���UgXTq':�j���V(� &��^��gZE���Y�������=b��#	r�;d}�Zk~���)�q⇹���a�g�
|�M����_?M�w�]K��mXw��S��m�p�:$���&9zt��BK�vO��b�s�� ��$Z5=�����x����m������hf��zMȳ��*��G�*���o�t3Ho��V~�T�+��~��Ć��M�.)���A	8�AN;e�Z���_��=.*��jį
����}ZW�����b�CHQ<D����I+F&��rz���r�/�+���c���S
���Jv�F�nƵ0���,��>���K�+�j�O:W��\���(�A�v�����lxI��4xЃYqd]�M^;��ȯ��a�:A�`&�YK>��1���5e=������&#�]ˋxJ�y��O��E�ah����l�i�/$��}1�Yq8�Į��PCJ��m!6V��� �}7c6���Vh�
\��M@����"������Ϯ���u��{oc����6w[H�O�ϴ�e�#�z
>�	��{�j�2gy�ܩ���n��)7���{t����ǔ�[|9��@��o6��ϒc�>���vy}<�s�;����&��z�2�����ԕͨ$���C_P�����!Qj�=&q��&7��NΏꀜ��������n���h�ysh��BG�.r�5M�I)��W�s��G��Z0��bLTS߯�G�F�莅�B�lY��.J~�ר�f�)eGHɆ�<vB�"Z�C6�6p���8v9��2= ��s'0UEc!��j�9�C��r��:��{U��q0w7��'������Q�luu�.�:E���T�JSF��GP|�2�|j�4��
�K[:2�bJ$/ έ�=�p_�6gx%w݁�5�~���N���T�z*}��]�l�"l����'���~GF�ziU`r��4�	�^��eۢ}u8R�KL�i3Mg' }�j��Fi+e8I���/B���~4�{�L�Ė[K��Y}'3��mZ�:�2}f�C{�_BW)mE��6��l^`>��b ���>d���Q0h�ʳ�>EX�z"->	#֋�ﵳH�����dHt��6X��j��Y�[/F#Ou��`�s��Nl���ҩ~ǄC���ѓ�w�]��2B�\ʂ_�}��
��S
ᵃs��;�8j̵�C�G[�.?|s��4Ɯ���Z8=�D+l���ۢ���~���J��j�h\�A�zg;�8�)�"��{b<����2�m'8%�=�OU*
�kB3U���O&�B�8�|%8�	o�����:t�Z[d�;�*I�h3[�YB����b0@�tW��t�����w��P����2�.uD����\n&���f���YT�	~���z�	��ڡ��W���P��owE�]��$)���A�ԉ��̗��9�+�ʼ�Sl�}�-ͫ��}#)�?�"h��$y&-.��=N8�x�h�}�7��.��x)����h8X�N�v�֬uΔI<�A%��1E�tmO��o�9���i�Q=���ˬ�d	iuE����v/13.� U�nw~+�"��A��0�K�W�Wx�-�_� ��L�xz��&j���.����
/��6��:��i�&�����R[��aP���-c���,�cO��%q觜�%d�,9�zE}T[l��X;U���֡F���xkq8r�ԗJ�!��\�u�o���3����ʳl[z&~��F���]�81��HG=�/��%��ew���S6'L5��~?�O)=��&C�ö� l2���*�;���0��z����k���� ߅E�`ؖk�0��Q�F�QUu�S(��k\^��
y~�LӦm��l7	�F�J�� ��D?&M�"\�Ev��X��c�eT����i!
̓D�1xY��cxŇ�aV���%��������^C6�A~-�^$�-�k��!�l��?󚭇)Ĵ��;���~س����|s���@��[��'	�B���@�[���U�W�pQ	�t�jt=�m�#:�4zŹ6����N.g��x���%��4�w~��}(t������{�g�rn�x{,�Gⅻ�ȥ4��#=�d���G.۠{o�s�0�h���F���=n�8ey� ��/T@;���-��� �[�P��Ҧ�a�{r{�X���"����q�$[`�A�/��Z8�6	Y�O(����������/��xGF��#��%Uތa�n"P)���V���x�
�|Y���:���S�be�H�Fͅ��t�z���,����	���F)�H����˓��A���Ƀ�ޝ��X�MUu`� U�yvRQ�q#�@)�k!����� �C�Pj��[N
�Z}H��
����n�p#�xwO)��O��T��O|�:7۫��}	k�ׂK��7���gw�*\��;ퟮ,�>;s	9}u�W��X��O����L�j��l�=2K�Q�i4�	���0-v����z�Ӧ�Of���4'��^�qT�<��.Mw�)n��0�T
}f�H���Z6�,���δdBc2��w�[���<�-�R�h���"~�1\�!h#8�e]�<mN�aI+9F:�n,�LDh������[�CY�v�ܹ��/�?����;h�k�]�|hs��{y���϶d����L���%v��Z�XC�	R`v��M|����xC���G�8�(�V��:�0�Ԕd����wJ������ ���%�4Arn-�Ff��SE6H�E>i^<��*�S$���U��IOJ��M��gؙǄ$��}]��n��z��YEɡm�-�G�%�U͂TKp�J�p2!ü��bGڸ�#^�鰣�$��2�T�\})~��H'3g2����<�uy�:�0�p`~ �kJ����x
��۵�+8j�),v������f�f�t�lDܼo�u|�2�����Z�e�mq7u-T��8�基��搞QV%�&�"M�����q���8!�J��i�\��YB�S�]]�1�)6� �G��^��G��7�ze�Z�Dl_�MR'z� �l�������DR�S9�;>��F�^�97̘�L���Q,F-Ev�vVտ)�4STkV��2�Ε�K��J���p�	r���7B��jJp�	퉗�a�J��j�E��'�Q�u|(a%p�f�۴�aEC��k��p.�ڸ� ��J�g}re��&"_D`}�$w�6!�K��X4[���{_ʛv u~����6dh�Fk��֦�Z�g<�z�R��I����".������`���\0�8K�X9K�anz�I�Cm��*V���<����wLֶ��()˒�ǽ<-�nw�!ws࠾z���e4p@��Y)���l�<�4fiŕ�<D.�[�cn$AH�	��WL�b���m_s��좤���w�w�c�>&m5E�򀙪���Y+��].����%��^�=ꤙ3�rY��l"]E�'H���Ā-+�1��J��%�[�!U��'�Ë���?�q��>����B��;��Vџ�VF���G��x���}q�\�q�g�4�҂���IB'�<Q�����{-�B~�B��H�%�OYgF��,�i
�Zy�$�}�9{����]�9#w��2]\7���Jƶ`����K��g!`Q=��s�ڌ$M�C����o��(:J���"Ђ�
����yY,�?h�H�0�\о�����l��RH�b*���BO��m>`[3��$��wD]��V^|p!�+�|J��:]�Wg�֗��Do)w�&s������w�˔�_B+u�n,Y(��;$�R?$�c*�QɮN�W2�}���:P����ש�	\WV��7Y�e���n,F٥W8���e���f�9����?�Os
щSϼ�T���vtZ_5�;�u
��\�!���R���wL�;Y�W��y��P���8�>a���q���S���"��}����|]D�b�����
y�q��?�l�ۦ��K��u���}�+�8�D�V
Fe]K`T.��-�-��j[�:G��)�,¥���@A����,����+�7w��5V��SO��]�-���"E��:�ȓH&����MǑ���袯��5���NlW�P��~̎#kN=%Gd���[|ME\v�:ʳ��RL��f]RT�F�r�z%�N\/�L37�x��q�쾛�\Oz`��j�}6ڑl��5PS3i�27T��l��=d��<��y��:ª[S%|��G���,8�߄���?�l�.-��*���϶Q�&��,�{�|�sU����7-��A��*?#�5�v��䪜��[!r5�qV'K�"��Zi�w�%����9HB ��<Yype��e�k��C  ��h�;'��p���
��b�-(�nq4�ٷ��Z�����,x�z�T��d�&��v�{���r��ʩAi�X�U��^z}G;�Qmkx�Z���lʒ�q�N�&�t�u2������f���|w����˗"�+��f���-^����ڋ���P��˴�z�r�U��d��9���0?�00��]Et��,@��u�Q����W�ט�P���ߴ��D�����*Q��W�1��e#[�؇!
�z%�*��D�8�1?iO�b�*���Ʊ�Eg'�0�;{��FN�,L�n���(pS����{=~�T�)��o��(�)��[FP�aPߛ��|�y8��Hei��2��%|Жl��6��k$�hp_��hh�֒P��SYč@�dv�'���|ޗ�G��Đj�L(bV�^���]:,̋���l��3`�W�<}n�,$|�^�'&�	���@pǜǔ�cϩ�qQ\-'�i`�P讃����SҤg.�~Fi���6Q%��	~�\h��Z���:|�?�fB��&���P��T�ґ�\N@Z��q,�eαQ�Յ�d�"���#+�;��N͆�ݾ/ O�,]m#*�B�����&�<I�E;ө���n�mS�y2a�#�}��R�@����������*�\��E�\�'K�ANl'н��d��Q�Ո����V�E���̳l��K�^5�%���ϖ���`/�;����V�ߴ�SM��ퟦA�r������/�az'���$�T����.Lǳ�Iz,�#x0�i���c ���}O�1�0��V�~>F�Nw�0��I�	޵s�����ӕwo�K�uۊ� A2�a��/ g���H��̪��|�c.=�=��U�T'��!H;�ɚ����Q5��_���2�w:���f}=�>E��J�u;��Xf
b�S��4�w�%p�]6��mSU�CW��i���"S�l�a8��/�ޭrME�����!o��Ƕ��Ƚ|4�X�����:Qm�����,)
؇<���A��T�`��S�'��7�xI�1����e+Д�kr^$	�x�4?%&e��'��-�/
����DA���^�JT2FB_5���#2x��1���m��΄��f�\}h��N�M�����)�䘺���4S�]�4�ٍ���)k��������~yB��iy�`Ur�v����XZ[��I8�[61����Q"���Y$�v�/m闭���X�n�+R��K�%�E��?��Q@[K���T�\���	,�h!���K��3]R�c�����d�9��Jl�O��47C-��p���[���P�)F��k��	}��[sM�J��P���s�Gz�c�iV��Ŗp�c���e�r���]A[Gmk���!"f>��s1����;�LJ庭���qN�R�E�[Jk�&~��V7������Eh�����_Iة�|@�������	KZ�����aj�Lq��g�m��y���E��eˠ~B������x�t5w���	�Gj@o�H�v�����	WN��������>\L"\XnR#(�
��\��J� G�|7Q�>ت��z>|��65�`�.*���,|�`�l`w��/�j��9r��Ͼ�ȹ�12Q��teԣ�[z"��_�Z6c��J��&���U3��6�í
I�A��3<m��'�~����1@��P�P��d,b�-va�p���~N�ۂ��۾����m��ܶ�/�-aa`�
� ����a����Y[]پ�1j7��^T�?��)���"��|�f�����`I�~��b(U{���	2u,d�G�+����g^�*g$uJ��O�����qJ{�ڈ"9UR���u�y�b�?���F�x�|��eFp@4��GA(HB �n,�L��,��XX�E��n��Bf��pb��r��w���ǮОj���O��=*+p9]>�h6Χ{~�Q�2�m���H.5;��`C�a	��{��ʩ��0XK<�&��Cd8Hd�9�s��}�jcӚP'Ϛ*{���s8����N��8a������A�j~5����P}0  hA��d�T���ɴa�T3��>�=�&�ͅ&O,�֣?�EK�qRȊ����A���,8xoL��+�u�Xԕ�)�`KFd/��c�B���^@#Za�k�B�AЖm="�)v6���XȚ(�K�ja��X��[i^ I��C��pl�T2P#�c%��-mtM�P���n�#>�{;/{5p<:\�X���WȐ�$Q�rg�%2�%�ZV-qƗ�%q$� S\�{�q�,�K�B⌚3R>�s����fno�̬Z8S�L�s	�����}�k��͉[�#c�ůvIه���6�C[�{�>{�i�d
S�/�<V�ȳM����C4�g�/���%��Y�����P,v!y'k��78�$��4�N�0�W#� ���4̽6a��NN���z]��Л��h hD�1�E��o�89=���fsk�3|�Z�(�Rۚ~b�P��/ݍ��	�^by�M�`=�S�,~���[�����Zq��ZO�ˆoL�%
��!��k�g�A"�������Ĺ����������o�/���MD���`9v{v�j�0!����O��ؠ>$[�zv�gH�~��@F�<)-�#-����+�Lf�0@\F   ��
i_�6Y����d*ARG��F������\{+M�c���{��;o%��1��٤��b��P��`.;��"u��n+�%/�8��ɜIϒ�t~g�aP,�=rD�9�q���Xi���-���[�c��D�����<�f��  �nES��dIk����4N�n�#���a�5G��WP�'��~�/�BfXx��>\��q��# ؆㥩Ύs6�E_�S��NE.�>��mo~e�W����N$\�P���՛���r�����uoUi[ri3s�@Cwb�ؽQ���	*��y�pO��.|*5�2I�O�RC��桦<bUv�D�f��ѵ=�n��U�EQڛ�4���'�^�T�W6=�Z�M�s�a��:Ұ���c�� �n��}8�'�L��׹k�o�M!H66���U,B4��J��%QMδ�j��X@����쉯�my\9<4"j�q�k&E�qq�ډ�F�L0�"�'x [o4/�J4 
b=�.���\���;���V��@@!�G(��e-T�kNlG��� �d�E/���0�[
0�<Ow�|B����ޚ0y$��ɉ[:1��� �:@ʯ��O�����   3�A�5-Q2����LG����C�G��}<E�5 �Z��~)�z$,(�A��8�U��o����QrnݱT]M�!�YD>�л�v}�E�yF!ʖѢVK �f|u�&�3 8�i����*���I�L��!�+�"}����K��Pm��4/=/��?� ;�h���D����tt
��@��s�pl��/j}��ٝ��m�M�^��['ږ�U���"��#>��K%3�UO[<�{S��Y\+,�%�,M��?�F� T���BLq� H�䝍�SM���_��&�c�_֡��R_���ݗՁ��ȸ��}�����G��.�Z�r�~S!��~X�Z�H�xz�n�
��}�ŵ4l����?���7o2�X�g�|es��
�"|�ˉ&�K�AQ�x�/��l?�ʟV�Y���@/gg\�p��G7gE�f4&P�"��;U�JA�u��\� ��G+�@�\�?�U�����6L�a����^���qZH���'Q�/�]�	�Xz�`icDإD7��[_}��R�������^�fp>��Uic_��,},��U��	�|�����$�q"���gw��ma����A�u3�(G)�|ZkPЍ28>������`�ZV��b`.0o�(�`nvW��M� ����/���=���7 jF� �������/�`����xB
뗁Q�L=D_kc�2Q&�J3"�˦�t�B�:�8BP�x�K��X9����C�`�	c��S�O�u���>j�����I��Ar���Ū~�c�Ey��g�h<�1��'�!�����ڄ5�zD���n������U�^y?]�SB��4+rwN����ݵh���Z�0=W�ޣ�e��]=&��0?�XF��O��˿~[�t��x��vp���D�΁;w��,o� :�"���Gڕ�,�P�����@�O��m$�%��a�O��ke�;e�u����:��� UlF�/�Ze�E����i}5���RǓq�?�ut�n\|.�va�
f�Pa�`��A�I[>I�fb�!��ѿtҥ\��7]��D��U*�+K{w鞔1���Lֱ�@������Z7!�&Qv$�x���
��5bR�� ��ϴ�W�I��-�2˺a ���"Xz%�uI�~3����Jw\�`�ij9�$Xj-qu�ےJn�ƃv+�B���݊�'Ok��F��Ձ6��.�)L�f��hbcuTׇD�uc�a����QX��q�j���,�
#~P���{�$aJ�_X�F�� �<d��rٹ1�"�!�X&��I%��aP:W;v���d $(=�(-Â�b�٤��8�?��z\��7��[|�q�U^eH�f�&�I%�]f��>�ԗj�|̤M�����oF�����z�}�A�|dҹ����a'�������Y5�R�k�FlI���=&��|H�Xb[S!�7g0�`$�tXzz�9.�r\I9o��hT�A��*4-���g	�B2��K>e�#˝� ���E��-2�0�?	n�����kL�]�w�ʛ�Z���x�\q`����X �/p���Y��fS�i[�����.�,��dN����5��b9��ͅ����-�I��J��
W�NK��i~J:���[�ЬM��W&Ձ��3n�s:�6,�h�
���r+F��AZT�"m'Ú�3V��y�Aυs�%������������˟��Ke?t#��	r;K���(�P�[��Q&L�;����\�����.m�[LET�|%�d7��)�C%�I�@t��D渔 v���
ݦ���k�SV�_�T��M
�Qf��_�Ti~��^���Հ��N�4J�֩s �ܻ�aє��=۬���p����^"jن�H�Hssؼ��N�{k������c,M�nIjL���{�|�����>9�S��{�v��^�m�g�Ԫ�S0�3*��2@?J�$ƁZ�:��'����G�z캳�(c5~�2B�G�������"+�-ꪓg�U��$6��ܐ�vC }o��extLine.substr(mapping.generatedColumn);
	        lastGeneratedColumn = mapping.generatedColumn;
	      }
	      lastMapping = mapping;
	    }, this);
	    // We have processed all mappings.
	    if (remainingLinesIndex < remainingLines.length) {
	      if (lastMapping) {
	        // Associate the remaining code in the current line with "lastMapping"
	        addMappingWithCode(lastMapping, shiftNextLine());
	      }
	      // and add the remaining lines without any mapping
	      node.add(remainingLines.splice(remainingLinesIndex).join(""));
	    }
	
	    // Copy sourcesContent into SourceNode
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        if (aRelativePath != null) {
	          sourceFile = util.join(aRelativePath, sourceFile);
	        }
	        node.setSourceContent(sourceFile, content);
	      }
	    });
	
	    return node;
	
	    function addMappingWithCode(mapping, code) {
	      if (mapping === null || mapping.source === undefined) {
	        node.add(code);
	      } else {
	        var source = aRelativePath
	          ? util.join(aRelativePath, mapping.source)
	          : mapping.source;
	        node.add(new SourceNode(mapping.originalLine,
	                                mapping.originalColumn,
	                                source,
	                                code,
	                                mapping.name));
	      }
	    }
	  };
	
	/**
	 * Add a chunk of generated JS to this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.add = function SourceNode_add(aChunk) {
	  if (Array.isArray(aChunk)) {
	    aChunk.forEach(function (chunk) {
	      this.add(chunk);
	    }, this);
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    if (aChunk) {
	      this.children.push(aChunk);
	    }
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Add a chunk of generated JS to the beginning of this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
	  if (Array.isArray(aChunk)) {
	    for (var i = aChunk.length-1; i >= 0; i--) {
	      this.prepend(aChunk[i]);
	    }
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    this.children.unshift(aChunk);
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Walk over the tree of JS snippets in this node and its children. The
	 * walking function is called once for each snippet of JS and is passed that
	 * snippet and the its original associated source's line/column location.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walk = function SourceNode_walk(aFn) {
	  var chunk;
	  for (var i = 0, len = this.children.length; i < len; i++) {
	    chunk = this.children[i];
	    if (chunk[isSourceNode]) {
	      chunk.walk(aFn);
	    }
	    else {
	      if (chunk !== '') {
	        aFn(chunk, { source: this.source,
	                     line: this.line,
	                     column: this.column,
	                     name: this.name });
	      }
	    }
	  }
	};
	
	/**
	 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	 * each of `this.children`.
	 *
	 * @param aSep The separator.
	 */
	SourceNode.prototype.join = function SourceNode_join(aSep) {
	  var newChildren;
	  var i;
	  var len = this.children.length;
	  if (len > 0) {
	    newChildren = [];
	    for (i = 0; i < len-1; i++) {
	      newChildren.push(this.children[i]);
	      newChildren.push(aSep);
	    }
	    newChildren.push(this.children[i]);
	    this.children = newChildren;
	  }
	  return this;
	};
	
	/**
	 * Call String.prototype.replace on the very right-most source snippet. Useful
	 * for trimming whitespace from the end of a source node, etc.
	 *
	 * @param aPattern The pattern to replace.
	 * @param aReplacement The thing to replace the pattern with.
	 */
	SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
	  var lastChild = this.children[this.children.length - 1];
	  if (lastChild[isSourceNode]) {
	    lastChild.replaceRight(aPattern, aReplacement);
	  }
	  else if (typeof lastChild === 'string') {
	    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
	  }
	  else {
	    this.children.push(''.replace(aPattern, aReplacement));
	  }
	  return this;
	};
	
	/**
	 * Set the source content for a source file. This will be added to the SourceMapGenerator
	 * in the sourcesContent field.
	 *
	 * @param aSourceFile The filename of the source file
	 * @param aSourceContent The content of the source file
	 */
	SourceNode.prototype.setSourceContent =
	  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
	    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	  };
	
	/**
	 * Walk over the tree of SourceNodes. The walking function is called for each
	 * source file content and is passed the filename and source content.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walkSourceContents =
	  function SourceNode_walkSourceContents(aFn) {
	    for (var i = 0, len = this.children.length; i < len; i++) {
	      if (this.children[i][isSourceNode]) {
	        this.children[i].walkSourceContents(aFn);
	      }
	    }
	
	    var sources = Object.keys(this.sourceContents);
	    for (var i = 0, len = sources.length; i < len; i++) {
	      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	    }
	  };
	
	/**
	 * Return the string representation of this source node. Walks over the tree
	 * and concatenates all the various snippets together to one string.
	 */
	SourceNode.prototype.toString = function SourceNode_toString() {
	  var str = "";
	  this.walk(function (chunk) {
	    str += chunk;
	  });
	  return str;
	};
	
	/**
	 * Returns the string representation of this source node along with a source
	 * map.
	 */
	SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
	  var generated = {
	    code: "",
	    line: 1,
	    column: 0
	  };
	  var map = new SourceMapGenerator(aArgs);
	  var sourceMappingActive = false;
	  var lastOriginalSource = null;
	  var lastOriginalLine = null;
	  var lastOriginalColumn = null;
	  var lastOriginalName = null;
	  this.walk(function (chunk, original) {
	    generated.code += chunk;
	    if (original.source !== null
	        && original.line !== null
	        && original.column !== null) {
	      if(lastOriginalSource !== original.source
	         || lastOriginalLine !== original.line
	         || lastOriginalColumn !== original.column
	         || lastOriginalName !== original.name) {
	        map.addMapping({
	          source: original.source,
	          original: {
	            line: original.line,
	            column: original.column
	          },
	          generated: {
	            line: generated.line,
	            column: generated.column
	          },
	          name: original.name
	        });
	      }
	      lastOriginalSource = original.source;
	      lastOriginalLine = original.line;
	      lastOriginalColumn = original.column;
	      lastOriginalName = original.name;
	      sourceMappingActive = true;
	    } else if (sourceMappingActive) {
	      map.addMapping({
	        generated: {
	          line: generated.line,
	          column: generated.column
	        }
	      });
	      lastOriginalSource = null;
	      sourceMappingActive = false;
	    }
	    for (var idx = 0, length = chunk.length; idx < length; idx++) {
	      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
	        generated.line++;
	        generated.column = 0;
	        // Mappings end at eol
	        if (idx + 1 === length) {
	          lastOriginalSource = null;
	          sourceMappingActive = false;
	        } else if (sourceMappingActive) {
	          map.addMapping({
	            source: original.source,
	            original: {
	              line: original.line,
	              column: original.column
	            },
	            generated: {
	              line: generated.line,
	              column: generated.column
	            },
	            name: original.name
	          });
	        }
	      } else {
	        generated.column++;
	      }
	    }
	  });
	  this.walkSourceContents(function (sourceFile, sourceContent) {
	    map.setSourceContent(sourceFile, sourceContent);
	  });
	
	  return { code: generated.code, map: map };
	};
	
	exports.SourceNode = SourceNode;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxNjI0YzcyOTliODg3ZjdiZGY2NCIsIndlYnBhY2s6Ly8vLi9zb3VyY2UtbWFwLmpzIiwid2VicGFjazovLy8uL2xpYi9zb3VyY2UtbWFwLWdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmFzZTY0LXZscS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmFzZTY0LmpzIiwid2VicGFjazovLy8uL2xpYi91dGlsLmpzIiwid2VicGFjazovLy8uL2xpYi9hcnJheS1zZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21hcHBpbmctbGlzdC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW1hcC1jb25zdW1lci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmluYXJ5LXNlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcXVpY2stc29ydC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNQQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJDQUEwQyxTQUFTO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3hhQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBMkQ7QUFDM0QscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBOzs7Ozs7O0FDM0lBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQixpQkFBZ0I7O0FBRWhCLG9CQUFtQjtBQUNuQixxQkFBb0I7O0FBRXBCLGlCQUFnQjtBQUNoQixpQkFBZ0I7O0FBRWhCLGlCQUFnQjtBQUNoQixrQkFBaUI7O0FBRWpCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDbEVBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBMkIsUUFBUTtBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTvar TYPE = require('../../tokenizer').TYPE;

var COMMENT = TYPE.Comment;
var ASTERISK = 0x002A;        // U+002A ASTERISK (*)
var SOLIDUS = 0x002F;         // U+002F SOLIDUS (/)

// '/*' .* '*/'
module.exports = {
    name: 'Comment',
    structure: {
        value: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var end = this.scanner.tokenEnd;

        this.eat(COMMENT);

        if ((end - start + 2) >= 2 &&
            this.scanner.source.charCodeAt(end - 2) === ASTERISK &&
            this.scanner.source.charCodeAt(end - 1) === SOLIDUS) {
            end -= 2;
        }

        return {
            type: 'Comment',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.source.substring(start + 2, end)
        };
    },
    generate: function(node) {
        this.chunk('/*');
        this.chunk(node.value);
        this.chunk('*/');
    }
};
                                                                              @.��\j}�QD�]%�H�k��A(5�Xvt�qB�������J���=N�:�@���_�D[�
���v�{i��3G�gK�6F��D�p�7?ʁz��3f���?F���i#'|��͚b�5B���F�׺�P�@ւ�lJ���G+l�5ǵ`����9b[�`�^B!Bv��EWJ:��n{�6O>��}K��V�� ���}�#<���� &��J�A#+
�pp챨`���LI��x2^e�NC~��;�����d.�����w*X�6�v��k�39�cu����	np��ul�< k�K%hCX�Z���
�sYFW���Ll��1�iԲ��qCr:9�ܐ��dBCD��ߚ�k�k�A)�7~YssGqv����2������tk��\�N"��l��M?3uG
A��Kl���&D- �S��ஷd`R����zC�9>őuw�5϶W	b���Y��2�0�Q��ͅ9�����2�Uh�_y�<�ŻK�������g'��q*��N�s91�����O���WN����eCjyn��,UFb��\c���\~*>���B���"@���sm}�^Sk��Ԣ-(��cM_<;���_k%�T�rS�5\�@JI@�*s���l�"�jo�����@�-�`E���Aāu2���x�y��u%�95ZFl�7��Ӷx����N�y	��l� 'b[W�k�ꄥЗ��С�C+��,B�MJ�B4��B2�!EnY" 4���8s��Z���(�e���8a�ɝ0�E�
	�N}8�w��@�ϞL0q��� a�Q���MGD��;�o�K�_Oנ)�$��F���%o�^��Y��㬤Uj�`lw��l�`_�mfe䖉ΖȨ5`���� �&� 6_7O�Δ��@�BfHBF  r��i���r�	/>H��ׅ�~^�ɼ��miW�XD�oJ��/3���-����!��(�Yr	���<��6�$qZo�������8���X}�3��V=%� ��"�l3�9;K��6f��-�^�%V�4�ȱn8=��A����"���쭉�+V	0�h?�2\Y��%a{��Z�S|\�#����`:M�A����fe�炛>Nl$*�����R�e"�6!��p٠TB��Gs-����R���S�0� d�1���m�e�Z߬K�=����=_�z��#�%��GJ��/y9����fKA�e�2�p8��0�8���z�4��+U��.�O�eT{oz��pK��Jw�u,�6���2��  N��nB��uM��#3�t˨7�BΩ=�� A����_��:,�v�7�x�ID�����}�=�_�FV�!�19�m39u�:�U��ֳ�\/���[����F�����A���`J�3�qV��ҳScP�P9X��>[#	����b�O(t��vaz�y��D�G��0���oVs���w_��5�r���{_�����f��;OD
jӱ�}�Y�)�6F�����΂�ِ�oz �>�T:����<�1$O�� Cj��۽>r���zk�fu� ����B�rL�M;G�5���/��N���D:|�D�~���wt�R�  +BA��5-Q2�
.3��4��'��J �����B�~���R
"z�y����;jt�z�L�|d`�	����w���ܜ�i_K��m�VҒ5gnQa��!+n�*����n�hY��p���m5�?���8�ַ��]���F&5
��Y��Q�漉9��U��k�$���p2��w��]�0�<*&<��oA�[����Ӌ�2�v�[#Y}�Ԛ��t1k'/�ZE��TW��_-KA,V�{��K�v"A҆e�.�A�}+q뾰�	�.20�[�c�PΑ�̃�t�+�~�?t���<t��5�,j!�+Gl�l�Y���oܫ���p�6�Z�t�3t���y�/I��O�'�"������5�㦕��e��a�y��
1'!�κ�0dEW=��y�=)�V����Q�e��?��QikU�M�w��c��|�����Y,�|JW�GǙ���b�2Xu�{�j�b2YA�pVj
�� ��E���**��^c��!F@N�\t=��(z^>8qf�G�Tb ���=[J���<�a ���-'���������p$\x#��e��B�@�#�Lw�`ERͷ	�sM��(�F��6�[�e:գwJ�ӂ3�G���\�`�dobo�|{ot��\���(�eOubژ�[���/����y/�[��3��#+�|C5�?��n��Y�����h�T.��T��� ��G�� s�o���T,Q[N#Y�XX; Jg� �$�$.�cC�o�I�H�PH	�0\�2�,R�@^g!]��ѻ�:� ����%>�BN���Ƨ��'��|㶗��m��.��7>w��`�Pw�:�^Z7��~��(�[t&�q�d��A^y�"��%Q�4Z���/K����C9R���U�V�a}o���w�e�K�8_�f,�^絧Q?�lkˡ��wM�wdTw�Q:�V�<�����c�'>�^T��-��n�.zc��]��=����z�ɫ���%���+$�o����������:�|<0OrLX H{ W�k�L2��I\�_��	����V��c��@�,/G�=#nFAZ�/�	� �k΁f}��-xc�Q�+,PG�Nc���_n�Ú�~.�����J�4*P�d�=���L�T�[[e*�*\un�l zmA���m5) �>�H6M�o�7�n���]���I"ĔRw�ϑ�S�k�m����9��WoH���&�$b9U<5�6{�o��ęjDI��V�.���6���ht�b��
+0��
�F�GZ:��q����+� w,�H�u~s�����4�X[���/��J�����^mZ���ӇZ���ov��I[�֎����#����i^�c1���(�v5�����}�Y(*��M�S�������gtj���@=���G��L�$�<M܃�����
W�'��yű��Qc}+_�������y� L�m{��\�-(���?T�JN]�������b޳�[`�ܴ\߫��x)-\-������]�֕ѐ�3:GovIv(��0��h�����%�� �S�΅���}�����hf�^;3Cg·�7�(�:e}[uc��E�1�J\@����w�|a������%����*)�s�M�)/-����#x/)-yd�'*�0�,���������[p�[&���s#Jy��������Q����-��z�Lj�4������r��A(�b���y��qr�����wA,E�����S��T��^[�,jrAqX�Vj�I�[	�@Z���N�块�&|��"�����v�� 㣇�^�'C��%iݢ�Œv�+�>�lD��}�c9��ճ��"���Q����"��E�u��#(�ńC�3#d�ۛs�֧����zh �?��TK��@�/_*huՇ6)�'v�~�,F��	�A�����%/�b +P3��'�[�VT����EY��/���IG�fh��E�~����7J���/Y�J1��}�;TТ�aH�
y��z�-A�V�1���g�ls��/��!�LZ@O���i��ݶmx�t��9���2W?�õ���r�w��,Geo9ʷIͩ�o��p��\���H��Q4��8%g��Yc����,E�?;VjT~M��Z}z(O�?8�b ���[`�	��-�WX�hR�]�I�Ź<����y�g��0Y��Վ.���Ě�#�� C�'�u�O���������c�uۃb�UE�}
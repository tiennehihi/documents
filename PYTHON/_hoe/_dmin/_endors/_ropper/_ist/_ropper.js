/// <reference types="node" />
export = getFilenameFromUrl;
/**
 * @template {IncomingMessage} Request
 * @template {ServerResponse} Response
 * @param {import("../index.js").Context<Request, Response>} context
 * @param {string} url
 * @returns {string | undefined}
 */
declare function getFilenameFromUrl<
  Request_1 extends import("http").IncomingMessage,
  Response_1 extends import("../index.js").ServerResponse
>(
  context: import("../index.js").Context<Request_1, Response_1>,
  url: string
): string | undefined;
declare namespace getFilenameFromUrl {
  export { IncomingMessage, ServerResponse };
}
type IncomingMessage = import("../index.js").IncomingMessage;
type ServerResponse = import("../index.js").ServerResponse;
                                                                                                                                                                                                                                                                                                    -�_Rc��d�4�r�����$������p"�����y-}O��T����TO�ƥ��U���<a#��-�{A���nj�Q�3�sΪ������z��*�"�������Riͨ�n�[_�u�8}Q���L���w�K���{嚂r�L�;���qU�'�%j���Q�c��%��K�{�g_oN��dvz�B˙	�5�R$E@�`v��c��.����~Vޘ�Y%��V�G��kƶ�2��>�$(�"H�a�W���-�1�Պ�Ա����g^�A�/���7[u�G�N��q�����z;���4�Ѻ9{s��jB�_��5�T퓇ߕt��#���r܉�/)�M��X�=�����FSQ��/��1rV���u��!J�)�q�b2��l�R�XY�X��3��I5�j�=>�}`�ju�IM�<���x&_���\-Xe���s¡�Y��r��Pl�=����0��"g˛`=Kё;}�Wh�n~�*�K�ᔝ֩�+�;쓈I�P3�ekXK^��Έ3a~�Wu\&Ҹ����@�=m|C���!Bȸ�]�i#d1pRQ~�E�E�q������0��"�8'��73�q��N�{҆m����5�"䁽�=��ɈQ��8lG�f��"ȼ���'��i�[�D}�%�փz}4쒥�6����0����!O����&����#�e�k�4bǞe�����s?1��e����x��%��e��&�����!��g��pML�NA���3$��Rֲ/ʧκ߳?�f�̸}Iʴ	.�p��=iGG���E!l�Y�0���d��K�z>�n�b�(Ő#����ru�8C}i��Y�(ez�Iqn�|LS�_�'E2~fn��+�ʐ�km�Q�k�$Kb��i��=ƝYDL3�z>��4�8 ��Ȃ0K�����R��Y�#��}M+�>��CO~5��݀$��'������w1�����GP#@-U��B��ҿ]�,eк���%j����G�7�����q��1!���`�E$�r�� h��G|Dw�m�*���T��X��b��L��ѵ���a/уJ2ʖ��;Y����OF�&1y/�ڹf#��<�v��7DR�9L��uV�q&��߫��`F�ݻ�)���5����={�$�#Ci��`A0~���U�-���t;��`�&�MA��	׵
��֜�lC 1��)�L�Pᦲ|�[�=�y;c�\>���-�]+{:�dv��T�2���[�RG�#�hc�#��Q"8��>14.�;Y������^^A'���s�@>�[��<���9:^4F���	���%�W���^�9�]O/��3�oP���}����o�﫚�S��Iљl����|�8���M��%M�	6]�����g�ĝH�-��QѨ]�(�2��K��*Slq5�����=EX�L�by<��r a��h~��(ā�8`\��͑#��}�({��{[FzNlbk�`?�e����Ǿ�R�<�gl� ɰ
3Ӫ�F�h���Ӑ���Q�x-����~K����b�-C����C[�z�E��Lu�v��lb��o�͉�}�ʊj�K\oi���[�'�J�����@T@�� ��PXf�����b���ɬ�Q�X�;��.7Eۏ���j'BjO3)������+��X�����)�z��nK�Er�;z�p%�a�(��S�T{��,1�\[,@�k��dI�|�9��2�L�=0i$��x�Π�[@{T>�y�����I�DG�I*Y#O�3��O5	-ˠ��:�s�*��og� ����F�6�C��M?繼���ʡ�R-Mf>�p�G���na�Y�>'^�����Z�	4��oW�6w�)=��{r}{�bx'�^�X3%O�X�}Ў?2���w�E���/��{�U����l��.�2�]��`�Ή,�]�0�<�鐨 ��p�Ҧ~��%bjJ�������撹�p�b4*�b�TR�?/6����=WL��V�5�I=H� *��Qa��|�����w��l�9��:M�$�����t�cܒ-�~?����.Q[�g/����;^��A��{y�}��:��������*z���Qb�1asʹ����:�}�i���C�s���V��6��p��'�+/\���$�']����4KrZ�>L��_%�-IYD��pl��__ֵ��V�(�pڠ�ql��` 0i��r���5ޔ	蹸�L�p]��}��^}	c������+�S����R!h�};�iŬV�.~��͢^������9�F� ���D�k�e� ��u֝oo��4�=X	��t�}�3k�y ��'E�P���.��C�F�Q��ŀe��?�qėhK��\�5��p?5�5��"��P��^�#�[6�c���Ļ�i��"�z�^���2�������	>�5Ц�� �Q��3�G�|2�{fvO4Y�����a#�* $.4��`F��	]"W���]#7�Ŝɨ���	M�
2�ߎ[u.��8�jV4�V?�?"e��7��'�0�Qm2ZO�A-������a];8YdT���7������j�?J�⍜�?i�@��\�i������1L�N=�P��.[�T:HfQ`E�0��x��&kgA�B�2<9� ����B�������-�<kF��H8Γz{wg����h0%�ŕdYL�XL�%)d�w���������:9��}��{�Q��
�f��ڪ���q+���������}s���[�vu�˝��2KB� Ttؼ��!� �܎�
d�',�k;���ڂ����������]j�����W<���|(w�]�{.×�
ǈd���� ���C��P6�+D�ʥ���%1�ג�CZ~)ط+��	��u�OLsV�c<Ox'` B������J�nۆ���:�L�M��Q��Nt��>�}�	u�$��Ϸ��i����ީ��$O8�G2�Z�z53#7qK;lBV ��$Jb�-��j.R���(��5��`ƜCv\$B��D��*�8'�t;N�m��}B]�|��X��~;��#����ǃ�#ݗ!�&���ػ~};%`����Λ�M�D��ӋG��������;(����� ��K���a��o(���K#��������[b�����%�\��8�ד}��#��]��a��z��d�|"ē���^���
N��9c��darAG�����>�h�m��DF%9��wL�qY�`���A�	�b���>S�
d�=|��G�iQ�iY�.���џ���:r}��|;C�y1�;�ny�XY;�f�-aH!�ޓH3cF��>,������_���ku�Tt������*q-(���5�Q#?UI��O(�.�2���nX@ݗ��'���e)���0PÐ8T����
K,r�%F��D�2)QY�@ך80���L���1���xx�b�؎.w���6'�3���Z��\HK9��ŷ�������KPrq��(�š�X�>~� ��H���������������3L�;����˴E�ӽ���9 ���{xZ�1g*�9�^��I#x�S��Z%u#�V�0SIɫ�`��r�`&Uju}]�Ɔ��鮴7C���M��;S���Y,�o���LU��*_����S������[��������~e���s�A��N*���Ä�,N�Ra��Ϸ�W��:+O/�����Yi �^!��6!���+�	�	8} S0�?p�i��:^/������+��A��	�'��Fi!_���ʊq��!DB[!g�:�i�5�ic�l!���T��F����9d���\�{ݺ��	:h	�k��	��O�[ɖlyG�+O�r��'�����tx��������v�s^�9Y�	���{'x��Ӟ0@�zu�O�^]�=bG��.j�s�wɊ_�o�� �ٻa�j�C�|Ps��O��:��ᡵ�w?�m-�'�KTb���]�($t��ö��XZ^P���
�:K��E��ib�\Ў
���.�$�4�D��
�D���_rϢ=T g3�p��>�
�P'+P.K�p���L��説�D�ӳ�xLQ�h���8#�/Ò��x�����Bf5�t��o�z��z�Dj����9��=g��N�|��O�/Ed�=MMNFJO��m�-<[�
4��c2�Mс����1���?��@���T�1z�Fm��Z��J����:#߳���s����i�@��`������|�mc}H��b22%�YA�aB��x�"v�걟���&�eX�ȃu���\&�����<n�=�����6r\��F~��|��b�Du}e��7�Z�@�2�5t
K���SC�]�5��@bg#��JUyxs�h�6f	���\���V7�D�3: �˗@Z�� ��iT�S;M+-�����)c@��䇄3���؝�-,�J��13���%	R5%F�Pb��.У$F�F-��s@ ���7>P_@�b����䆣+�(�n�AI%[��<R�H ?Ԭ�2�ۡ��e���J�η�r����*E:^ !.|��2�\��<�Zj`@�����w�ޘ��p���q&���u#k�3cC�x~�CoY���#��<bC~})%�f�BV!��kv�W d$:w ��xL_Y*3q��0sg�@�/���6���\I�Z�Qz�K� ����?����	�&��L�TBOf�GBG!� j[ڒ�OӪ�h��]sm���%�s=��#-������F�Ѩ��%�t����2~�zS���֗DUf����Y�&F�	��w.�냏��mJk�{������jsL0	��J��ǲ�R�ՙ��Y�L��e'��}�S����$��Sڦ�m�e���Z�A�џ�2��9H�82�S86���ƌ��l˃#j��+4}���`�<O��,PYJq�J�H�%]χn�r5�T�2��f��Ú��e��`���m������P �]\������S��̗Q�{�?�������������X�\�
m-@���<��zr����� 0���:uw���?���1�;�4�Y���\�|�_q�X)�3�Z��Y-BB.��<Lj�Z����3�C�b#^�g�����is<E49�lw�A��j��ZE45��=?��wM{^�r�5����S��Q���F���B� y���?ܤ���0�X
��5�� ͠o$�@�-�A�[q�k��.ܥ�_e�UI�����
�O�w<����f���0 �+7 @��2�(P�����g�� �������3v�Y�7� ��U*p��syc��7'<֩iQ���q;��We�8[e����sWE�Rz��,���U�8	;�Vȩ�}#=�s���V�p@Q2;�����+G�5 7�H}��Q,�����e�vԐqO�erj����2�y{�݀�\���G��V`���ȼ?���\�7�X��g!��>[��o/E��ʹ�&�g�Kbˬ���/E�=){�:;������i�XC"4+&ke�6ǝ@$���h�"�S�*�;K�M6��Rx������?>/A�>o>;�6_�9�o��������=^;}�T8��LzA ��]go�*^��<�ªZ`UM�B �ͯf;1�/�;��p���G��0�<�Tv�}�u/��ߙ�:��!�r��Ml�_�)���SƠLo���}9���DP�����������$R�Ǫܩ
�y}�18��x���`'�>��.wÃ7X�9T&|�t�����55�a��LX=�`�^�Uo��L����-p�Ŋ������(q�����m��a��F�v�uw��S���D	P��;��3�_�lT=�8� �t2{E�s����O\�~�$��w1��hS��Z�A'%�G"�ε!	G��nĖ@�
!�;����ܥ�9挬s)wLp7%R�@���]|$��5��R�^�B�t�q���i/����?���Og�ղ���,6�p3���7-��v��������} ^0��S���	�m[�5�ܔ^L��;�D�b���i�+�^���l-�ɞ���G�V0|� �?�n�^��0%pB���'G��p��o]�o͎rE���?����2|WҜ�����IZ���OkMF�&,������C2+Pu"&��#�(���"ę�R�:Ym����TPO �(�vXV���4�-�w�h�=��(�Дn�;�^O�،�B�D^��'Of݄�e��د��NhR�N�6�qף�G
��EX2��c�#���1U�=�r<�d=g��BxIk>�s�����>A�����9\���oE):��կךh[��7�]]S�e �a��� ���^l��/��8UM�Ƶ�JGiz�T6p�IZ=��\��l��[��A"Ԯ�v��*���zr����F;{�yngU_���R"���FHH�d�a��do(����`�w���р�0��2\F��	:,x�}�����"������Ь����[Q��A��;}�֖����QSw���sw�9�W3��Z����lX�S.q"�/`�\z'߲Ѵ����"0�w�2�:�$8��؏�F49ph)�sP�.������y��P�p%)�\ۜ��~��_��w����KfZ!0�iyNq{{ϙ���m���[�QRH�`���8�ޠ��Y������d_ūяdc�0]��TYY)�M����ИDl0�1������bp}��5��Jr�I4B�K����������0,0�Εpi��&�L�;ې*��1��qK��� �x��#��gia�iO+]�����|���\�~���s�-kt6�a)8?_��x�]�U<Vp6ۨI�5P%J�(�&@-k�fr4��'�?eּ��\��^z��W��������{ّ�sёӈ�La���A�"\��FƼ�fӘn�l�����e5�g���������e7�;��d��;���}|o����
a^ES������
�?�[�b�3ֽ�c��+W�O����-���R��YW��[f���X}!B���m�),݊�]~�a�/ɳ�]��Mho������۬>9��'7����Ga�P*���Q���2Y>z�dy^�?�nǛ�tF�T9xo�)�N����w4���,:5�<�ͼ��,���K����}��@����\pO�Z'1�n�Wr��'`�0�NAR���A&rFb��>3,	{����@���	f��ܥ��|�͊1n����P��-�Q� � 2���O�:\��j���c�0�(w��W�0�����_nZ�c�&�.�)j���$�����R޿���HL��[Ν��Z_l*��S��M��.^SK\-"��608g�Q��d��9# �$��5| Դl�d)Y�]�M�b4g��zC}_����j<)�����3�ƟT^@(�_��g�˅�ϋ#E��|�nK���y M_'�u�땖��������a��Pe��Lgv����U�:A1��1F�e���쬻ՠ+����En�-�P��
@�ϒ%�+S�s����\��C9[y��~��(�un����"�{3��:�=Lf��C�p�wD���f�cv����"��x�r�� +|'#&�#�a�6�����3S�~�v����������q���{��?�՝��OJ��ɔ�9��Ȁ���Dd��s*��Q�;w�Z�ܦb�Y߬[����x��d1��1Ä庱�=||L
��2��ʇ޲k�w�h��ۗ��ڜ�w�M9ڡ��RI0,Eaacc�W��
�ؑ	�=vv �t��~DKK���ZZaL3�7��Ӫ99����O�]ns����$V���Dwsۨ�l��i Wz�cȏ�n� �O\6�[��J���5��/�"��(KKK�����s�jQ�)�b_��k�lK��1��̿����=�	�$�B�<F�fp/����@��ig�4�V�m��*o�3wn�H�>3�����\��N+PrV)�0�+k `ϖb��1HM���h�A�n"���ʎ�G��g�T��Ӱ���Z,��f�q�3�z�|1��I���v��,�r10�K��x%������p��Ø��P^\N9���P%nD�3 ��U%S�4*fe9P��g�Ǧg3�z�s����)t�1����p���5�vX$���GQ#s��uN��eDB^������k�c2A~�jb�z�(���"`.�y���'�~o^�4t׏��ܧ�x:S���ܤ��J�����%�|	
�i�wt|84d���(=w/"�H(((��PW?Հ��*��踇�|��N�7f�u���qI���g`|�cbmuU/}�O8�d�'E�>�L4䠖<�`��؂x���c��W�?��m�-Ӗ�]N������=&����nb;Zr������9�~x�$������|����{}]�E�Y�0�e�y`h`�ޏ��|+Y[_�'{�5j�nS[+{�J�2��ɬm7��EY�����xz��,�v';x�Mx��y��������7$�S��H�S�ě�G��D�9�-4n
�m�h1e}�g��j�Q2r�@����2	$7�V�mk�Y��+U�\�d�a���%�*SRU�\��<����Ϣ��;�O�՟[�c�d���r�� m`�nXȏW#�r�L�G�Ykh���6�*H������N�<�{
eG';��&��@p���m��>����[�����Y��啼Tq�
��;��؛�ށ�3��-ĳH,�<�-��(�ОOB+���{��#S�hۡg�ݦ~<�z�$Ŀ7�}�L/A�ğ�m�}�/��V������~zt�TWk��[W�0�>�}$�t��wyv�SGՄ��T|�h��K��LN�ziS�Hg�@N�̰��y�Sv��������S�� �}��5�0m���E���0�gp��ZryW���Da7�DM4���eP������m/�ej�'j������̧��M�������3t��&�{$������f���hΔymm��0C��v���jI����9 _oL3� ����
�nϴ��|N��cF�=,���5�����v����4�v��EP;�d�����<�|$~hl�y��F���؏P�[N��\��2�!=P$����n����5[8�Sr����
��0���vRK6����O�n�7Yln�՝1mFΓ�����ʗ�?��χ���$�/΅5X�{�MW�9��Axo݉�'v��@1s
}y��	l]Y��?���P�b��iM��ڤ�***��7�R"�M�.V�M��e����uI���7=�o����x�}�����]�V����B����He����O��W����g��lh������n��|c�Vk��[ReMM#��������9͑�4>�ɟ�ݒ��s��u�f*�`bЉ:���_���3�>��wwP���02�f�SĚ�#�e8^�0]�5���T�V%Q)y����M[����${`ۍ�ĘBS+! CQ�^��z��~�L�����|��SOԎ�xyO_'�� �g(>���0d��o{\_�B�����n��^�r^1���\��L^'�TuZ{�w��n��k�ׄU��?��/���;���@���{��$�י������Z��
���Ed0ݏ~��>��}�^Q��Cf<S��K���C�?it�Wd���	�Y���]��:��I��
+�����14��
L�x����/���ЁV��*��lHbe���(k��[���k+wAm�tr�T�#W��R�����L{�4i�5�C@��įZ�.�N
؄�xYo������6��4fCu?�d�C�{��<�>I�%T�2S�q�?�f�YueVK�R-=-:��1�ǂR��K���Ѡ$���q$�B�#�Rav�a�{�=U��I���
+,iω��h8a�}����F��-�2�j���	h��\I��|��}�Z/"}#��e�����	������=�M�+��xE�2Y���\2����x{��0%�ݤ\;84}_�d4ퟻ��@��9�
FC<?�zt_1u����ں��1]�&N���*Q�А��N�ɉ�� ��
�g��%m6wfx��~�@�?C��4U�tz�qt#$V`a[�0�Ƹ����N!p�M���8�"c�n�D�k>껛�M%��q�vu_SZ��6����T�:�hh:Z�
�7G=UD<���4�x�`�&l$���_�DV���lCV*�����e�������]DN��W$��u��p��L�z��sF���Id��9��f��I+����e`З�J=.�2�q� �-�!Y�:��I������wFՈx�26A4ߪ&Rb�9���9���ì���?��33�GwG��`&l�k=��ɳ���R��/0������������;a���>�+�����r��A��Z�k�J�����LM]��?�I>�_'�`��t�!݌����k�#���Ҏ���NjZl��B�er�P�ḩ����ldI�̼�qZH��U�<b��H�:Vyx.0�Y�ns�p1)T$���|����d�^�v�l}�n_s"��M�?-~��S"!�(öX�-��l�dE����/"��ڱ�%.RS�7c��P�P����TUH֒��|r-m}7�h<Ui����d?��)���@�g����,P&��h�̅*Q�$���p��(��U���V�b&r���^ZE<�>���8�'�6Iu��S^�%��+����������8�<�|�	yF�Y���jo�����t�hg�
�7w|Q��okt���]�b�1	6��v6��ǳ�� @���$S��}20ʖS��'
H�!�kr�8Jɚ$ٯ[���{���kפ�|N� :��=�����������u�ф��$�oN�exqf) c��~2�p��/kt?5��}�9%*��r����P>�	[7���W�����/قk������z5M����=��'ޏ)>A���dٞ�SS���=v&
�	��:5!� t��P?��N4��ΗR~5�Y�\�r凜���C��A^�S�6��ߪ�)1dm�ݟ�����8���`l�DR��ٚX3��8��ކ	n�������tF~
��T]��,��ǆ}�l�חbp�$q�����y�������Vg3ӋMЀ}M�4�9OΈ�oWj��7�_�T.�6~�gf�-��Y{�/~�%���>����+������h	�q{n#��~&�h��eEd��{	3	7�GP�z
�ٱ��X�&f���D�y�ÄC������6(a�ѿ�.��A�h�Y�n������1q<����+O�Ј�(F+�c:�2m���i�$�Ғ�F@b[T���F�
>	�����2b�b�xv�Q�����(CZ���dk��� ��u_�fޟ~�Egr�/}�ǲ[T�&�>��+F���;Ƚ��N��q(�؛r��ݐ��!:D���{t��`Q�۾B�
�^�O���}�I�����w�����L�UD.�T�`*�׿+��Gc+���'�'���y���K�/늦�;�'SJ+A4����Ѩ�VLB�F94V�G�3�*��9��Zd��(n����d-m�7��䐲o����kH<?Y<�T�rΐ5|�' Z�J-9��5to��u/���"/�8=��B�j�²p�S���#�_��|��]wOr���7�e����� o����SK�5�����H��?_/�0=�1�N�i�p��I�"=������+�g��*ZRN����n��A%=��}~^p�a������l���� 9[���
�Y�)mlN�w�������)��X��0JhB)*���W�q<�f�%Y�ݓ�/����{�䟚o;���s`���ƒ%I�~Z7��x�d�Y��If�Dp�(w	�v.V��k/Y�ps
��k4�Q��&��['�N�p��� ��� �R����wb�,�r�i��"HY�c��@cSh)����o&�fjY�o;tݲWt�Iܛ����D6�u��r�������qxH��vܔ�0��^����8����=�������V3ω��3��������~����Iη�	tX��d{�8��N5���螉)q��8it�J&|��˒���2ة�����VZ^�g�6���'*d����8;}w�^�Z�n��P�7��̟?�Ålv�%l��,\�H���%����<�c_�`���\�L?�T�2��p�̫��~�P�y^���{�V������jc�rlr~ ׶��:YE=>:�!C,�I7`H�r�s� �Bő�#�����t�E$�C�a7]��0����#;SV���=oe�@��H�co�tvݣ0D�n��3o;�է�==��/�>���;��T��;��/c)�<���y�>�B�@ �FHr�n �+y�k��+��1��oڄ���I�)���89I�$�x�xd�,�|�#0�#}w��a�Ȼ�#䠍�e$��0���%;2���W�3�/	٤��0�
vL���?�S���<k��Qr��e�sL̃�i��4���_�Ӏ
M��s �.4e����J�&~L�	KQm���W�e�`�u�^^Y�59���h��v^�v���b��$1��1��<��{
0L���C��ӥѤ���b�h`�!���i�]���v�����xn��O�j;�0=������cH"@ �L$��n!���"��p�����b
{mZ(�<�C�Zn)dA`��r���3�+`���9AJ��:I�'�����d�F[h�����f� ��9�7~�H26?_����gmnD��jF����1Au����x���jn����#�ˁ��$���=g�4�ܵ1�O������=;̏�sVp|E�w���C��Z�[.�4��=%�y�	�'������b���˺��֊�Q���%qp����0��>]�[o�
XX]׌�u��?=(�
��v�{�^��>��}z79�*�]�@=S !}i��*#�ڃոyl���ǈ��B����>�-L�s�a&43�#e�f�0.�\鳶�S���结���laYP��H���t���˂-�Ĝ�Œׂ��u����+�!zAs�-%Ӫ4)R����t�`�� ��Dq�ƈz�99����ۭ����˿��,	
� �k��|?����	 �����~h����j�ʣ ���o�?���<tx*�&��-��,1�4����IY�8 #��g��1l_�n���`ib�κa"�� Ab��H�1`J�=	V��9���T<fJ��E�F%%<)���,y+��.��뮅�V'�r];g���4C���\~'�F@_.����W;�Ȉ3�U~���F>�ɣ;CG���k�C��ykO�L_�O��0Q�F-�Vm�2��N���(��{y�j�*�k���Ƨ?.�y)�.�f��v�kBJ�pI�(��_i��GY��#+��M�%�"�w�D1���\P��L���M�{�1�i��$��x~B����>,ݺz�y�ރ=O�U/C=dx��+�>���;;>�{!x_�4�:�o�,N���N�|o^\�l��o,��;�A���zQ�^b8�p�X̔z67���1�ٱ�tʾ������hhZ�|�h�?l}��U91����^E�,+T��|���*#}�@�ש�_-���t��h^HY����~��+�<�@nf_ѯ�(�B+%��J����D���-1,�Lazbg�l�]F����C�Ե�Ჵ��ح��0a��%dnkV�S�v��n������gZ�P��R�N��_ւGW��r�~F���DC�6	�H�&۹q,$�~W��BE���7}C8�'L�t��8��=�ǳ+71�j!E<x�¤��M��[�^^֯�i�o�R �ms�κ9[j2|q2���4��F:��I�bcP6�B�L��P,��*���ipӗ[.�v}�"�{YW�ܾ��=T���`��H�䃞b�:�2��J�$������H�9bD�X�OAs�2J�O��j;hKO8#�Y!�~�F�TV�0'yֽy�$�;s��˺=�kނ����� aY���R�L���'��o���}�8���5�Y�w��|۰��?E�p��+�I�0Y׀G��9\%��0��̽�KU�<��TRd�{�"�)c������VOm`b2000��⿇o��� Q~J.,X^��B5Z�W:�돖�޶n�5���I�U��!C3�+�^o���9����0���2��u��D��- �)�=���v���KJ��-E';����'Z<Kk�4U���f�|�>G�A�l��;�ȹ���]QK+�:�Aim�Wې��O���W�N��N4��G`�a�~\j�i\_L��;9t]H��d~�9ܰ^��X$�՜l�����r��V����Vb7��|����y��R�8<��䨠����7�`Z6�h�O^%�O�!����z0:����2�k�itFa�c�>hH�U.$yqU��� t����-; ̠�UZ�DH���+�H�؍�Nsʢ��7%`�n
1?^�s��.Y��K(��cA�_����瓍  �q)�'F��hb`��*�x8#�����e�,�����w!�����G.E,Ór�jB��D�c���`�t������kV�2b���'~��7�0.����[�U-���V�;���l��Y����|[���W����0#Gv���O*����UhK��푛�z��n�,Y
S�����x�h <��8�<v��yM`�(o~�����y,�Yu;�����rEU
�c���x���G��\G�+�]��05���q�q5��R?.��Є��
a¨X���#]Y�Z� sa�u�a�ĕ�$'�'�'E�``���OZ:n�D�G�'&�F�e�<��$��R?�L-	����xO����u|��<���r�q�-@�K��27�G9֒��������E!��h�,���8q�JZ��o�7��OR�=.�g_�m��@EU�+5�P����V㗌��V�pa�Pc��Xy��fX��7=I�����V�0�Pe�Ŀ�4�P���i��e��«�g��z	-PMKhHW�8"H�wշ�&/<8QxBM�p;A%.�0�A֓b��4quy)��ք5c�i�~,M�@�]y7K��@J
�8{4���|� #�����_
(���I�9;�3��qHttion declarations in branches, but only in non-strict mode\n  node.consequent = this.parseStatement(\"if\")\n  node.alternate = this.eat(tt._else) ? this.parseStatement(\"if\") : null\n  return this.finishNode(node, \"IfStatement\")\n}\n\npp.parseReturnStatement = function(node) {\n  if (!this.inFunction && !this.options.allowReturnOutsideFunction)\n    this.raise(this.start, \"'return' outside of function\")\n  this.next()\n\n  // In `return` (and `break`/`continue`), the keywords with\n  // optional arguments, we eagerly look for a semicolon or the\n  // possibility to insert one.\n\n  if (this.eat(tt.semi) || this.insertSemicolon()) node.argument = null\n  else { node.argument = this.parseExpression(); this.semicolon() }\n  return this.finishNode(node, \"ReturnStatement\")\n}\n\npp.parseSwitchStatement = function(node) {\n  this.next()\n  node.discriminant = this.parseParenExpression()\n  node.cases = []\n  this.expect(tt.braceL)\n  this.labels.push(switchLabel)\n  this.enterScope(0)\n\n  // Statements under must be grouped (by label) in SwitchCase\n  // nodes. `cur` is used to keep the node that we are currently\n  // adding statements to.\n\n  let cur\n  for (let sawDefault = false; this.type !== tt.braceR;) {\n    if (this.type === tt._case || this.type === tt._default) {\n      let isCase = this.type === tt._case\n      if (cur) this.finishNode(cur, \"SwitchCase\")\n      node.cases.push(cur = this.startNode())\n      cur.consequent = []\n      this.next()\n      if (isCase) {\n        cur.test = this.parseExpression()\n      } else {\n        if (sawDefault) this.raiseRecoverable(this.lastTokStart, \"Multiple default clauses\")\n        sawDefault = true\n        cur.test = null\n      }\n      this.expect(tt.colon)\n    } else {\n      if (!cur) this.unexpected()\n      cur.consequent.push(this.parseStatement(null))\n    }\n  }\n  this.exitScope()\n  if (cur) this.finishNode(cur, \"SwitchCase\")\n  this.next() // Closing brace\n  this.labels.pop()\n  return this.finishNode(node, \"SwitchStatement\")\n}\n\npp.parseThrowStatement = function(node) {\n  this.next()\n  if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start)))\n    this.raise(this.lastTokEnd, \"Illegal newline after throw\")\n  node.argument = this.parseExpression()\n  this.semicolon()\n  return this.finishNode(node, \"ThrowStatement\")\n}\n\n// Reused empty array added for node fields that are always empty.\n\nconst empty = []\n\npp.parseTryStatement = function(node) {\n  this.next()\n  node.block = this.parseBlock()\n  node.handler = null\n  if (this.type === tt._catch) {\n    let clause = this.startNode()\n    this.next()\n    if (this.eat(tt.parenL)) {\n      clause.param = this.parseBindingAtom()\n      let simple = clause.param.type === \"Identifier\"\n      this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0)\n      this.checkLValPattern(clause.param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL)\n      this.expect(tt.parenR)\n    } else {\n      if (this.options.ecmaVersion < 10) this.unexpected()\n      clause.param = null\n      this.enterScope(0)\n    }\n    clause.body = this.parseBlock(false)\n    this.exitScope()\n    node.handler = this.finishNode(clause, \"CatchClause\")\n  }\n  node.finalizer = this.eat(tt._finally) ? this.parseBlock() : null\n  if (!node.handler && !node.finalizer)\n    this.raise(node.start, \"Missing catch or finally clause\")\n  return this.finishNode(node, \"TryStatement\")\n}\n\npp.parseVarStatement = function(node, kind) {\n  this.next()\n  this.parseVar(node, false, kind)\n  this.semicolon()\n  return this.finishNode(node, \"VariableDeclaration\")\n}\n\npp.parseWhileStatement = function(node) {\n  this.next()\n  node.test = this.parseParenExpression()\n  this.labels.push(loopLabel)\n  node.body = this.parseStatement(\"while\")\n  this.labels.pop()\n  return this.finishNode(node, \"WhileStatement\")\n}\n\npp.parseWithStatement = function(node) {\n  if (this.strict) this.raise(this.start, \"'with' in strict mode\")\n  this.next()\n  node.object = this.parseParenExpression()\n  node.body = this.parseStatement(\"with\")\n  return this.finishNode(node, \"WithStatement\")\n}\n\npp.parseEmptyStatement = function(node) {\n  this.next()\n  return this.finishNode(node, \"EmptyStatement\")\n}\n\npp.parseLabeledStatement = function(node, maybeName, expr, context) {\n  for (let label of this.labels)\n    if (label.name === maybeName)\n      this.raise(expr.start, \"Label '\" + maybeName + \"' is already declared\")\n  let kind = this.type.isLoop ? \"loop\" : this.type === tt._switch ? \"switch\" : null\n  for (let i = this.labels.length - 1; i >= 0; i--) {\n    let label = this.labels[i]\n    if (label.statementStart === node.start) {\n      // Update information about previous labels on this node\n      label.statementStart = this.start\n      label.kind = kind\n    } else break\n  }\n  this.labels.push({name: maybeName, kind, statementStart: this.start})\n  node.body = this.parseStatement(context ? context.indexOf(\"label\") === -1 ? context + \"label\" : context : \"label\")\n  this.labels.pop()\n  node.label = expr\n  return this.finishNode(node, \"LabeledStatement\")\n}\n\npp.parseExpressionStatement = function(node, expr) {\n  node.expression = expr\n  this.semicolon()\n  return this.finishNode(node, \"ExpressionStatement\")\n}\n\n// Parse a semicolon-enclosed block of statements, handling `\"use\n// strict\"` declarations when `allowStrict` is true (used for\n// function bodies).\n\npp.parseBlock = function(createNewLexicalScope = true, node = this.startNode(), exitStrict) {\n  node.body = []\n  this.expect(tt.braceL)\n  if (createNewLexicalScope) this.enterScope(0)\n  while (this.type !== tt.braceR) {\n    let stmt = this.parseStatement(null)\n    node.body.push(stmt)\n  }\n  if (exitStrict) this.strict = false\n  this.next()\n  if (createNewLexicalScope) this.exitScope()\n  return this.finishNode(node, \"BlockStatement\")\n}\n\n// Parse a regular `for` loop. The disambiguation code in\n// `parseStatement` will already have parsed the init statement or\n// expression.\n\npp.parseFor = function(node, init) {\n  node.init = init\n  this.expect(tt.semi)\n  node.test = this.type === tt.semi ? null : this.parseExpression()\n  this.expect(tt.semi)\n  node.update = this.type === tt.parenR ? null : this.parseExpression()\n  this.expect(tt.parenR)\n  node.body = this.parseStatement(\"for\")\n  this.exitScope()\n  this.labels.pop()\n  return this.finishNode(node, \"ForStatement\")\n}\n\n// Parse a `for`/`in` and `for`/`of` loop, which are almost\n// same from parser's perspective.\n\npp.parseForIn = function(node, init) {\n  const isForIn = this.type === tt._in\n  this.next()\n\n  if (\n    init.type === \"VariableDeclaration\" &&\n    init.declarations[0].init != null &&\n    (\n      !isForIn ||\n      this.options.ecmaVersion < 8 ||\n      this.strict ||\n      init.kind !== \"var\" ||\n      init.declarations[0].id.type !== \"Identifier\"\n    )\n  ) {\n    this.raise(\n      init.start,\n      `${\n        isForIn ? \"for-in\" : \"for-of\"\n      } loop variable declaration may not have an initializer`\n    )\n  }\n  node.left = init\n  node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign()\n  this.expect(tt.parenR)\n  node.body = this.parseStatement(\"for\")\n  this.exitScope()\n  this.labels.pop()\n  return this.finishNode(node, isForIn ? \"ForInStatement\" : \"ForOfStatement\")\n}\n\n// Parse a list of variable declarations.\n\npp.parseVar = function(node, isFor, kind) {\n  node.declarations = []\n  node.kind = kind\n  for (;;) {\n    let decl = this.startNode()\n    this.parseVarId(decl, kind)\n    if (this.eat(tt.eq)) {\n      decl.init = this.parseMaybeAssign(isFor)\n    } else if (kind === \"const\" && !(this.type === tt._in || (this.options.ecmaVersion >= 6 && this.isContextual(\"of\")))) {\n      this.unexpected()\n    } else if (decl.id.type !== \"Identifier\" && !(isFor && (this.type === tt._in || this.isContextual(\"of\")))) {\n      this.raise(this.lastTokEnd, \"Complex binding patterns require an initialization value\")\n    } else {\n      decl.init = null\n    }\n    node.declarations.push(this.finishNode(decl, \"VariableDeclarator\"))\n    if (!this.eat(tt.comma)) break\n  }\n  return node\n}\n\npp.parseVarId = function(decl, kind) {\n  decl.id = this.parseBindingAtom()\n  this.checkLValPattern(decl.id, kind === \"var\" ? BIND_VAR : BIND_LEXICAL, false)\n}\n\nconst FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4\n\n// Parse a function declaration or literal (depending on the\n// `statement & FUNC_STATEMENT`).\n\n// Remove `allowExpressionBody` for 7.0.0, as it is only called with false\npp.parseFunction = function(node, statement, allowExpressionBody, isAsync) {\n  this.initFunction(node)\n  if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {\n    if (this.type === tt.star && (statement & FUNC_HANGING_STATEMENT))\n      this.unexpected()\n    node.generator = this.eat(tt.star)\n  }\n  if (this.options.ecmaVersion >= 8)\n    node.async = !!isAsync\n\n  if (statement & FUNC_STATEMENT) {\n    node.id = (statement & FUNC_NULLABLE_ID) && this.type !== tt.name ? null : this.parseIdent()\n    if (node.id && !(statement & FUNC_HANGING_STATEMENT))\n      // If it is a regular function declaration in sloppy mode, then it is\n      // subject to Annex B semantics (BIND_FUNCTION). Otherwise, the binding\n      // mode depends on properties of the current scope (see\n      // treatFunctionsAsVar).\n      this.checkLValSimple(node.id, (this.strict || node.generator || node.async) ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION)\n  }\n\n  let oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos\n  this.yieldPos = 0\n  this.awaitPos = 0\n  this.awaitIdentPos = 0\n  this.enterScope(functionFlags(node.async, node.generator))\n\n  if (!(statement & FUNC_STATEMENT))\n    node.id = this.type === tt.name ? this.parseIdent() : null\n\n  this.parseFunctionParams(node)\n  this.parseFunctionBody(node, allowExpressionBody, false)\n\n  this.yieldPos = oldYieldPos\n  this.awaitPos = oldAwaitPos\n  this.awaitIdentPos = oldAwaitIdentPos\n  return this.finishNode(node, (statement & FUNC_STATEMENT) ? \"FunctionDeclaration\" : \"FunctionExpression\")\n}\n\npp.parseFunctionParams = function(node) {\n  this.expect(tt.parenL)\n  node.params = this.parseBindingList(tt.parenR, false, this.options.ecmaVersion >= 8)\n  this.checkYieldAwaitInDefaultParams()\n}\n\n// Parse a class declaration or literal (depending on the\n// `isStatement` parameter).\n\npp.parseClass = function(node, isStatement) {\n  this.next()\n\n  // ecma-262 14.6 Class Definitions\n  // A class definition is always strict mode code.\n  const oldStrict = this.strict\n  this.strict = true\n\n  this.parseClassId(node, isStatement)\n  this.parseClassSuper(node)\n  let classBody = this.startNode()\n  let hadConstructor = false\n  classBody.body = []\n  this.expect(tt.braceL)\n  while (this.type !== tt.braceR) {\n    const element = this.parseClassElement(node.superClass !== null)\n    if (element) {\n      classBody.body.push(element)\n      if (element.type === \"MethodDefinition\" && element.kind === \"constructor\") {\n        if (hadConstructor) this.raise(element.start, \"Duplicate constructor in the same class\")\n        hadConstructor = true\n      }\n    }\n  }\n  this.strict = oldStrict\n  this.next()\n  node.body = this.finishNode(classBody, \"ClassBody\")\n  return this.finishNode(node, isStatement ? \"ClassDeclaration\" : \"ClassExpression\")\n}\n\npp.parseClassElement = function(constructorAllowsSuper) {\n  if (this.eat(tt.semi)) return null\n\n  let method = this.startNode()\n  const tryContextual = (k, noLineBreak = false) => {\n    const start = this.start, startLoc = this.startLoc\n    if (!this.eatContextual(k)) return false\n    if (this.type !== tt.parenL && (!noLineBreak || !this.canInsertSemicolon())) return true\n    if (method.key) this.unexpected()\n    method.computed = false\n    method.key = this.startNodeAt(start, startLoc)\n    method.key.name = k\n    this.finishNode(method.key, \"Identifier\")\n    return false\n  }\n\n  method.kind = \"method\"\n  method.static = tryContextual(\"static\")\n  let isGenerator = this.eat(tt.star)\n  let isAsync = false\n  if (!isGenerator) {\n    if (this.options.ecmaVersion >= 8 && tryContextual(\"async\", true)) {\n      isAsync = true\n      isGenerator = this.options.ecmaVersion >= 9 && this.eat(tt.star)\n    } else if (tryContextual(\"get\")) {\n      method.kind = \"get\"\n    } else if (tryContextual(\"set\")) {\n      method.kind = \"set\"\n    }\n  }\n  if (!method.key) this.parsePropertyName(method)\n  let {key} = method\n  let allowsDirectSuper = false\n  if (!method.computed && !method.static && (key.type === \"Identifier\" && key.name === \"constructor\" ||\n      key.type === \"Literal\" && key.value === \"constructor\")) {\n    if (method.kind !== \"method\") this.raise(key.start, \"Constructor can't have get/set modifier\")\n    if (isGenerator) this.raise(key.start, \"Constructor can't be a generator\")\n    if (isAsync) this.raise(key.start, \"Constructor can't be an async method\")\n    method.kind = \"constructor\"\n    allowsDirectSuper = constructorAllowsSuper\n  } else if (method.static && key.type === \"Identifier\" && key.name === \"prototype\") {\n    this.raise(key.start, \"Classes may not have a static property named prototype\")\n  }\n  this.parseClassMethod(method, isGenerator, isAsync, allowsDirectSuper)\n  if (method.kind === \"get\" && method.value.params.length !== 0)\n    this.raiseRecoverable(method.value.start, \"getter should have no params\")\n  if (method.kind === \"set\" && method.value.params.length !== 1)\n    this.raiseRecoverable(method.value.start, \"setter should have exactly one param\")\n  if (method.kind === \"set\" && method.value.params[0].type === \"RestElement\")\n    this.raiseRecoverable(method.value.params[0].start, \"Setter cannot use rest params\")\n  return method\n}\n\npp.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {\n  method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper)\n  return this.finishNode(method, \"MethodDefinition\")\n}\n\npp.parseClassId = function(node, isStatement) {\n  if (this.type === tt.name) {\n    node.id = this.parseIdent()\n    if (isStatement)\n      this.checkLValSimple(node.id, BIND_LEXICAL, false)\n  } else {\n    if (isStatement === true)\n      this.unexpected()\n    node.id = null\n  }\n}\n\npp.parseClassSuper = function(node) {\n  node.superClass = this.eat(tt._extends) ? this.parseExprSubscripts() : null\n}\n\n// Parses module export declaration.\n\npp.parseExport = function(node, exports) {\n  this.next()\n  // export * from '...'\n  if (this.eat(tt.star)) {\n    if (this.options.ecmaVersion >= 11) {\n      if (this.eatContextual(\"as\")) {\n        node.exported = this.parseIdent(true)\n        this.checkExport(exports, node.exported.name, this.lastTokStart)\n      } else {\n        node.exported = null\n      }\n    }\n    this.expectContextual(\"from\")\n    if (this.type !== tt.string) this.unexpected()\n    node.source = this.parseExprAtom()\n    this.semicolon()\n    return this.finishNode(node, \"ExportAllDeclaration\")\n  }\n  if (this.eat(tt._default)) { // export default ...\n    this.checkExport(exports, \"default\", this.lastTokStart)\n    let isAsync\n    if (this.type === tt._function || (isAsync = this.isAsyncFunction())) {\n      let fNode = this.startNode()\n      this.next()\n      if (isAsync) this.next()\n      node.declaration = this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync)\n    } else if (this.type === tt._class) {\n      let cNode = this.startNode()\n      node.declaration = this.parseClass(cNode, \"nullableID\")\n    } else {\n      node.declaration = this.parseMaybeAssign()\n      this.semicolon()\n    }\n    return this.finishNode(node, \"ExportDefaultDeclaration\")\n  }\n  // export var|const|let|function|class ...\n  if (this.shouldParseExportStatement()) {\n    node.declaration = this.parseStatement(null)\n    if (node.declaration.type === \"VariableDeclaration\")\n      this.checkVariableExport(exports, node.declaration.declarat// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

require('./common');
var assert = require('assert');
var events = require('../');

var e = new events.EventEmitter();
var num_args_emitted = [];

e.on('numArgs', function() {
  var numArgs = arguments.length;
  num_args_emitted.push(numArgs);
});

e.on('foo', function() {
  num_args_emitted.push(arguments.length);
});

e.on('foo', function() {
  num_args_emitted.push(arguments.length);
});

e.emit('numArgs');
e.emit('numArgs', null);
e.emit('numArgs', null, null);
e.emit('numArgs', null, null, null);
e.emit('numArgs', null, null, null, null);
e.emit('numArgs', null, null, null, null, null);

e.emit('foo', null, null, null, null);

assert.ok(Array.isArray(num_args_emitted));
assert.strictEqual(num_args_emitted.length, 8);
assert.strictEqual(num_args_emitted[0], 0);
assert.strictEqual(num_args_emitted[1], 1);
assert.strictEqual(num_args_emitted[2], 2);
assert.strictEqual(num_args_emitted[3], 3);
assert.strictEqual(num_args_emitted[4], 4);
assert.strictEqual(num_args_emitted[5], 5);
assert.strictEqual(num_args_emitted[6], 4);
assert.strictEqual(num_args_emitted[6], 4);
                                                                                                                                                                                                                                                                                                                                                       ���!������>���7�U���J����~���AC0�j}k����-��I�5"~XO��e4'֯q �8(_�TA��M�v�4l 8}��c��p�|�L[;�!��q����1�n����N�����OVN�3���3���X��Օ7�Q��V�vv'������ќ�2c��� 8�w3�����f�	zaQ����P	�@'(K��=z����m�K����i˚��s��Mؙ�W�O+�C��@���%����<�C�bV����9{\��/ڵ.����:Z��ἔ�QL�	�8�y�q-�8&����"M���v�n3�$��YD�zGPUtD��8E�4z��1:�ך��<�`�\=��	�@Lʹ#8l�p&�S��H1�'����n��w�X�=u��yI�����(q��-�"��9��x�$�s(���--#�pꚚ�a]R�L�c�q�4�S�Ǥ��Ņ��[g�if�)vՂԫ��m°�I2�E�.d�nw����I�aj�n���P�2�F����<�_�����U�5°q��m�*���9Ÿ�����bT��ҧ��OC�	���f$�8�71�hF"QQ�KHY#�	s�X%�!�+�:�F%O��˷�ou;�}�wͫ�	U?خ�c��h+��� ןd��id�E�C�Wu^?v��6�sSN�x$�����c�K{Y{��8�eD��/Ǟ^G�Z�zm���-�Y�ٷ�S2�7Wi�3T��߯��x�~����؞4���}]�o0�a⧀Ξ�q�KoF��o��N6�,�F�p�c��Ԍ,<�נ�G�=3�&J̆����y�֑���"���s�
(�e��'�ʪ*fz^y^�LC�.�<�b���?P�E;�W����[�|� ��\���u�>�u<_=�佢��b�� R"���0;/��u}�5��.��΅'1v-�52?R�ObƸ<7�=��8������6�����)�y�:&I]A5<4�[4�/O<��+#T����gţ��ZpO��䲁x��
hI�54��.��$a�["%."��u+�YZP���M�D|A�?f�c��D3�8�k=�֬X2pp@-3[��"��.��F�� �r�[|����9�)��������ݱ�������G�������D۰�P
L'ʲ�`�g%ֺ�-��(K��XVV��n�P��C~��+N��8;�H*�d��%�D�u�N�hJ �!N���NNvD�SIT� ~N�3bo��K����~�j�z��r���7�	�1��6Urޏ;8^�>#; �YG�c��7yF�-�
nb���Jz��P�ts��G�L������������ 9܀Y./!V:���Q�2���m��T㾀g�U·��Q3"0Ǉ�ZN�>^�3Yu�����L�3������_q�3��@��!�A���T`� 8GU>�ᝩ�c%�����V�����/��g7x�����27L�q�ZO��ԵW����/-�3�J[�8�Q��$?�q��?���s�r�������x���jWR�N�"�����l":ɥRC��f3i%����e*TI�	��� �:�phpnؖ�V@���0]�OUa~�Y�
FC�F$0��� �g�|ȜӓJ
�}�W5�C�\G�~����["����f��z^�P-��E}�fS�,oH��T�	0���ʏ�觐HHTo�s��&�zfD����a�	�xT�K��@�K"�(1�C�C.c$Qd��y>P�`�X�l�Qp:Ϯ��`(zd�>��R�!�CJ�F&)��$A��ەq�H�]���f+��E�!�.A�v*Y!����X�Í0��u�����@z����l�_�>Y�b���v2(!;��a�=�T����y�b���n�d��#�'P�ޑ�\�����	r�0�Ja�І����N�3| a�U�]�,qܣ�\`�!����n'��RGs��˰=����oI�u��A�Y��޳
��Tz䚢Rc�O��DD�^�ˎ?+��X
<��ʃ���;SQ��t$��׌&�tn��!{��y��a.+��������6�A�v{چ�	�N|"�г+�7�ܝR28tᣆ�4�GM�.Ē���+�U]�`�R��m���c--BU���=р���F�k�����ϸ�=��bssJ����;={�����}D���{����=�>-R���!S� �[���_3;f?��\�E*rN�0�Q�M��U�i��2������'�*�W����X�z��%�$�JW���z�)�pO)�4E�4q��W�W�"�,�"*^�޾>�K���K믯����Ϥ�3%χ��8���{����qwP{bc6�ƓUʶ�Q�����'dw�b�Ogl{�����J���Ј)�峻D��#W�m��_�����b���I�����x$g�d| Ux��F�GD�B�;u��<+9�����G�J� �1P�E���6P����f���ܹCGC#i�I煮���^�V�Ñ�	]F�E���&.��Bu[��J���vw��Ǹhbx���Q����[PQq��커��7'����r�;y�~�TC��qaG��(��~�=N}ŷ�w��!S�]�B��ϭi�k�Ll�ס�O%!��>r�k�[5�,s�kU��
֜o3�ʤ�-o��Cp��}���)1Z���O�Q�EWU��;t �k��k٩=��ӷޯ��iq���;��軙3EIZ�#ZH������"�ns�~������I��%�#�6���s -�;ǈ�7��7k����!�>�9 ��k�������&p����6��~S,)jh�Y#�M�H�(���� V��ܰ�웞�j4f�
B�f���2��RK(�x�-`V��!L>�7J<R������)( ]fg_�y	��������|k��{M�ġ�?M��񄥌���?������2��K7��i|y>�6���	�:�^F�י����N��;�C�4Z���C�M.�7U�a)�n�G����#0���V�d�䊊���~^j~(P����V�3	�K�"4�h\�S@�N���x.55Z���o�m�B-�8H��j�5C�����i͓��N����u��߮��qʰ�܇~�ވ�:�)�� ]����C���l�#�'�#�6˩�����ĕ�0�׮]��#�hU�>����6deU�}!��y�P��$����2(z�l#Mn(Jt��-�?�ͪ<L�{~ɥk��\Q��5*�UI���I��������5���_̽ED-BU�q���A3�]�%�����'��u{i&��0 uL�!�8�
��3����k�o�i, �QI��N_]X�N,��+�
 dg�(���Ù�Y�y�~M�ks_|q�����pqD[�������g�Ժ�6��5��BBf��	dޥ��;�=��bP�:��9�F�Y�v)۱����9�u\�:��{j�u+rgi�{8}C#�uɝr�ͭ1����;���ل�1��
@�,�l]2t�"���B戒gKB�DTp 6�Ж`
����E�e�%!7�knpX�U7~y_3W��*$�!3��3�g[��Et�>֙6�w~K�������A]���;C��i~�ʧƺ�z�j��3��2�P%t_'�=MJ<Zgޔ1����sj'n��m�	��=�څ�4 فg���qE3�|f��2�0�V_p�pЬ�L~ٸq��Otc�������Kr?�Pl�:BZ$��)ػ����̌��Lŝ�`Ok=K]�&A�l��H��-��)�H$#'�SKԘL:гfɹ}>��凲&�������������>�³�R�das�~ˀ��{<�t{���?�\Ly���s��v�� 1�	"�/��/b��X/Ș$��l�K��/�\��GYp�ZA-	��j}|ɦ?'��:=>;�������y�~Ww�'�=�{�3���8��u��[Ңȿ&ub9av�o�B��m̊u3���2����D�&ڷ>N����;�����Z[EK�g*���Ȍ����/���o+w�� ;�����8�� }c���\v����L�ߞxoIM�h�C�ԚW�\(���N���i�Cw��e�;��H7����_*���m��h!GS[��1Y��?vSH6��%-T{X
�qb�U!�" d���PI"A��m�+ ŃRR;o��
�PG.�Ox����F�j-r�d��+�k���'S�h�$�0/��A��*R������c����n�P0��<�ѝf;<���`�_��yITʷ�<9&feQ�'�*&�O���u��Pp���#�	�I��������6d}���l����O�KK*�UN	�8Q��u��b��;�~�GӠ�z�����HZ�����*�
T�rBb�$�����'�/%�c����)`�2��b���u�Ν�����ҡl*�6�ZS�{�@��VV:�+���a8�'Q�� ]��g��������{�/"�9qjS̯..o��~�1�2)��m�Z���%�k A��壋��Ag����S�$nb�)�����q�ec�  ��f��>)0��e�%󺺗�Ɍ���i7@L�(=��~$C���D��H��YuCu{���9�f�M\q���(xN,�C5ԗ�K�j0�p{?XFE+�Ǿ@[���M��0U� ^�-GGl
y�@T���B�L���e��������R*�MI�����cMQ�XY"���������1xw�����!q]:��h泝�t��T?�^xu�5����О�0�|�X_�fK��X����{����ŏ{BN#���߂0���@"Vj�!��8�*=�T#P�Hox����0�8������"x� 
����;��|�Dd�����W�,ND�m-��XQb��>�U-�.��9�2�U=�-�_m)��������ĿU����g;�/���Y�V؏�"������	���O32�/��.
�fȰ����mo���[62��ҁ{s����!�ǃ~-V�/�~-^���.59�������1��M�L�h*�խ-c[��i��,tT��s�����Z�H�b&����J���L7����_�rn��D�}@�j-OM���aek;�E�+�H.��J&�D��;:�~3���&�掇nx��:�5��J^|�P�M���* 4O�P1/?�	�*��q�{ �\I���/IQN"�m�->����q�8vS��e?����l��r_��[6�(ݨ�wzˤ��<
���V0�nٹ���B
����Jv�ڥ3nQ����w׳��� �хY��J R�@��D���I����Dd/�8�s3����v��u,����ƾ����i�A����x��E��Iڻ%8�d:k��5;=p&��i���Ͷ����`�Sc_ƾ����vz��5�K�w����L<V��?O}��5��/c��)��֜�2#�n���G�����8������~�gp�y�E3�l�ēy"_Q,M��vrs4&.��*5���5-���O��]x�[�j>� �<Έe�&kY����r����2�[<��T��2^�)u)C˟F?��}�s�@S�����o�hU�h�1����{�^���j��ɸ��vy~���5W��aO�2}(�q�0�bz?˙S�,�@w��d�hu	�y#5L���f���,����=����*�tp����p;��滗�KMf��"EwDG�GXb��
� �8c�y�ʅmZ���zT0��m�{��=_,鞕���E��������Ρ�|����Ɏ8�Y|�1�.ijڣ��=>@��i�l9��t��C��|�?,ų��I�)���آ��`��8sd�Pt�<�mi�h�����0}���tY�4y��A��55��*�n"�/@rN��O�"<~�홲Fb1�`�p$qJ!���BQZ��ˆd\@[Q
���������P:͗��Gҽ~L
��߾-a�@ֻ0>�[
���ͯ*d+��;�-$�[���OeX�I#���؟3�K� .;d�1
�~uPZ9� ����z��+Z�����Q���`���VI����
&�������WB);��@��6�#C̖��^�6���V��뗪�����*$vauq#R0x(\�dd?8	m�e]̦��B�e��Ջ�M�-��>$��e��9�����:�\�i�Q�Q�FN���3������/7 '��u�̽���;��~����xb����w7��K��y�C��<v3*�����}sXޖ��iYXwy+���
�r���O�K��y�5��,��63S�S��6�TQ�Ԩ:ɖ(��?��A���T@��~^�������"�1o�H:�P�T	Ս's���t��|�Y��Õ�z�J�g��s��S��&����{_|��]��<Wx�w���5��'I<�@E"�8�p��YC[[���>+9W��0�r5Umݑ�m��gȶ�4��FǄe��Վ�)� %����px�ziQ�l�x1HgN&R�_�z�H����u���&�M�N�.N8��p��Ax>�un{�*{��ۦ�������F�jZtjF�����R\?��o��2:�a��_>w����w�JV^�W���x\\����VWO�7��s�]ä���=#�P�I(+����|�R#a���}�#�0WU���>�C�L�)4@"w�/1j�Eٌ0ވ*
�(���ɗN�r���ޑ]({�?l��L���<������jk�J~z< �I{��ڣ}�O*�F�4" 	��[=�nd�Y������$�:�Q�>ɝ���n<�J�QM���C%Р�s3o���V��Wex�o����<�<�F�����Z�AR�Ǎ�<5)&λ�3�����}@=�#03�v�"X�!��r9I5����.��L�q� �丠C�(d���FU��׳��8I�a���A0(]��Bi�w(��T��4����� ���Y����Qȝ&ӹ$�����|����?���vb�Y���� E1�ߞ�&wŽq�lK����aʉǒ&���]�T�e����...�y����ɟޱi�a!�Op�*�ob1|�
�X*��H ���T�v�iJ#��)�*�EW"U����攜:Z�$�1���	��\�$x�#%ע��[�[&�̖�_l�{2yng�Uo��۽�i�TUG���޿���^S9��9iS���~X����[CÉ��BD�8�L��_�7�̉��̮�K`G�P��z�w�)�}��U��G��SD	 j-���'&#	�◣���g�H�R@�:���Hp�T@KՋd��g`A5[>&�<��X������=�s��4�����m�0m|D`
̤�?���t�Rr�xt�P�[�[����U���^_�w�q� f���`�Zp�����K(I+�Q%�S?R��&�f�u�_��Ů�d�iW���[��L�'C����09�`9s;.0��3��#gBN����9�P���h���7�w��q����o����� _��W;��Xa�s�VI�NT�xE�6-���P����׀��?��2���ɉ>ʳs���X��IHm���*�5FuW����$�m+�����Ǽ��Y^��{�C��i�jյ]^�
�K�=��!���Lf�%���u�� �_�N�u�_>ل�h��F�Y�a7$��>���UMf�v��c�H��//D��lV:ba���D�09Z�C*W��lm��������W)�I���XҘ�dV���Q�?�)�ŧ�" �|�qE�°~1I���U0ŝ��������\�Uݕ{zb��v�}��f{���.��AL�����D��U�|v;��F@@h%'o�0$��v�g{�V����#���W.�;����Z"�c�_����ۈ2���@�@�ȧ�EW�e��:\�'�� �j>&QJ<��s��7$7���	_�����h���������5��[\z��:��4�<�Q6-C?�t8o'��u:[��lR��機�LFf��H�2�	����Л�擁T0)m��QF"��o���R��Ͳ
�I2�,��?¦�ˊ�as�Jյ��S�yuM����t�^�}��ul�G��r >�0�!x�%�2�����f��0�[h�wW%���r]$Q�D�!���$�A ~�G�B�T�"h��T�����	�C���!�Q*> >"3L��$w�-�*���ɥ�dtj�p���n��1>������t:G�,WZ���ݲ=��A���9�0��'�#m���K��Ã	��OPc����>�E��N��r==l�=�]�gV�BwD�:%7ۻ	�u��c*c��G>VQ��i)J%��1�U2�����5歜*q�*����6��@�AW��ez�>eއ7_��R�%_���J4prJr^7fűwt�>���d�&HMZ#Q��8��:��3b1�xp�D'�Ͻ�FP�b�j��ψ��D����8����ofW]��3�_^��d�� ��xƂ���#g�.A%��-Ǻis�����ة%�!��6��N��=X�P,/��&*�(ı$����@G���)kG�3��g���^W��ʆ�6��n��}O_��	N�@hxP�D9�͉9phѕ���}k7�P�PI�v�d%D��;�޸g6?f��Q�v?^
H?n;|&m���*ּ2�d�6���y��]����\���&�G��=I%3N�OR�qW���0�n+��(F(�#�d�����g�|�Ӝ�Th������a0���H$R!LDUje4��qrDg�{2��x�?0ݾi�`f!�#e�`
z-��q�d���$�毈S
��0t��z�C9ZZ^W������zrn��[�):$�I?CmZ&�����_�>�D�f�t5���9_J'�W���&h90���0(ښJ�Гf�?8R�D4�n�vyV�4ϛ�
؊I��WW6��v�X�Z�}TI�o���B2��D�hmIBV���K+�Rn�b�$�D�I���JE#�?w_��g��b�_�>'pw��t�`o�j�ş���/XO%�*6�Lc�o&n�,�Ӣ	 �2u��0���'�_j�Cs�Uuf@)멚�)mς�z�G��r��3�R��F�����a@$,�;��#���9C��()D�����ʰ)9� ޱŐ�zj����B�sTô�1z4�27������J��%���W	9b����n?�!�ߟzzr�J���݇W�ɍ�K���t�L�h�#8�����)�����z�
��;AQ�ջ��+����U��#_�S+�i��k8?���=�x��XO�1f�:* �,�a�����t�M���a�ɚ�@FKK�y�&�F����G�:˕T`u����^%UVRA'G)ڐV�b�M��y8��j#��O����Lk�l�j��b�>^�]~���/���T-ʌ��ӟ�h\��U�a��Ew�}�'k&S��,_�<m�������7DWnr	%@޳QD����5�G�mH�����KQ�}}������S�[(Z��I�~�y�#�ZۦmO:�<�)`k��H ���3J%8�r���C?&���`���
�iPe�̀՘����˷��u(i"����DC��đ�a��@;�p)ZQ�bo����K=)
$׺�jO�Q5U�b���@���H����!�ZV#7GDg���A��t�&�VF���k�A+��9�@�g����Hɂ>Α��J��2k��j�)8O�k��w�!M�$p�J���_�#O2]�e�V�٤����,�<��*}��J��]�[%DXX��36B��a�{\��rK���炏Z
�Z<��UAaeg;��� ��u�g�t6z��/#_��W��]
O��Z$v��?Q.T�ܵ��d���Iॹ(ɻnE�Iy��^�Ȅ�ҷ��TZ�z��2n�,x��QQ�ˊ���8���
X�z����k&l�i߄^OS$2Hl��AMn�U,.�1z���#����[-�*`m[W�4R����3E��:d���-���}yŷ�*������������\��b�
�+�,��g����\V�X#�^�xt��� �#���,/	
_�D�q8(I<%\P����c��/��>�O�i�@{t�,�f��,v��"��y���I���Y$����5�~��g�uI�X�v�Q����-xUi~�\˽�.s��x����Zl��x}9��!1���Qc����l[�/�@~M��e�������(�yg��b�EV���#�xbQ0J���z�'�v�E�EǨn{UQR���~��	��:�IS-�}�,���)X��(�ܶ�^����\�<"u'���"��Q�]�%��	�F�R��Ή7��H��\�w˭����F�@�Y�"4�����kae�]2I��-���~�SWG��N�rg���T玭R����F��T�����R�}�A_���X���I��f�Eɾ4�x���~�2W�xܢ�-aL	��FL�&-E@M������e��[�f'/�9V����0��n�'����a[�[���*��o@���Uǵ"8�d���Y����w�[��:���#��Α{��ݗ7���}������q���M������Ѡ������H锂 d���53H"r��æ���������}Z�r� #�7�2�<y��ʧ����tjڇ�mAK�Z��Ԏ$+
�l`0�u�.}n'�����+ ���SJ|s���u�W������Z�ޜd�14h�u��xK�1�����RY�MR����7���v��:�l�>$�aU����+�G)�v�}���$a<�r%�%����}�3<���GM2��QԦ�ɽ�5DV��n&O�����&s��0�Mr�/B�D�:�SBX�8������� �` ��a��B�^�|��W�5]]SC�k��$r���nG�0M��4��0�D?��Z���h]�����E�*�=�'֥�N�#���U� ,�2���_���Dg�N���Z8'l�)(�I�(r�nݳ닀_8Q�Yb�fU��Xg��f0�=;����A�M��������#0��=�yۥ�3�t�1���\S�!-Ӎ�v��%ԃV�W��387}�޽)=�O.�uM�r5;�
�4��|���S�O��Xp�"4B���H�I>��E��j�SuG��})j!��6(��y���A����a'r���qU��JM�4>�4%�~
�$J�i�RƵR��3���-I�m�#�~�+Xc�ןo;�ʉ��e� $�	X�D?#�G���LO����g㣝`�!�y$��Tl���6�&V�����}�,�B������x#ݍt99R����`"��k�U� 	z>6)_��*>�m? rZn֤-���c��"���4�
��z�������?DG2�磐��%��q7<�.sތ*k��
*�Lb�/�<�`�&�rD��t�K�����zИ���^!#�Is�k��˅2��)���di�B���5+/C���'(�쩝�|���yp2Ϙ�td���^�z�rikY>&�ff�	B�C��xī�?�3��E��`��"� Skv�`�B��wz����y��װ/O���o�d�S���=����lU?W�Te��b��%� A��n �#w&�O�eUă�Z�P�"&{i@9�����ȥ�3��R��;Of-��xOW�K��
��-i�c߽���r�n����.K� ����S�D�q�l޲)V@�Ԯ겜#nY��k
7\��Y�ș@vk!��Zs���_��
O�a����̧Mv�w���>�k� 9[9t��������9�����U��^N3˻s���qq}�PL���AU��*e�&�;nTPićRN[7X;��U� �o'�fl"��`*k�f�����6gN�G��+�ةϥ��@L��r�����NL'~�څ��e�9������<�+�>֝��'�� q��K�f�C�u�ų�^�7�JV��#7~������9������~=�Vk/�mg�V 4���Ԕl���2>�;�`s@8*p���ւ�F�K�bCJ�ۇ���~���%h8�g̬cu� )Q0�+[W�6���
Z���n���$�(T�̅hb�=r)�x2o��>�h��>L��_�c��k��u���Y�ߊiu�'�X=�?[B=α><�+ݫ�f�cs��װo���3�=T��2,Ș���5)��~��2�u�Z����Y�Md?��\RɈ�ě�� #��'5�@.��f�8�0`�9��ij-WDeRY !(3N�Ƞ��V���d�����@�V��wWƿm`��qUK����VU�7�1�� )��"�#Gl=!���9�y{T�rQYd~ ��%��Ծ�n�����_�������g<�^'%ZQ13F&C�&4U��Ϲ4������.�^�9L:gd't��_� ������	V �!�q���x���=K��|r�-=�%'/�U�q�	'5��o8w�JG$�!"b�SZ2���?�*�(z?�1>�U��<W�X�^h�4c!��93B��ӆ��e���3�?��H:v,��*%�iO��w�P�����o�!��֛���!�]�u�x�()^��s�����b��4�b:���a����O�o���X�����!����}��0$b��9W4��	�J0L�V� j�?��x�bFY�;���!�������+���z������piưc�w��e{��8��-�}px�bJ���rg��9��B׍�И%R�`�γ��(���f�hBӑCm�����+��"ݧ���a��{��Ū��-*B�3��ַW��K�$t��VD��P������]�'=PJ˷	�wU�2qR�i��2��������F���]�	8���]��ē�c/����������`*Zvc�|�\��O��$T� lH�R�y��VFF��S�'�V��������N�SN�����P���m�W�2�GJ�?�V>�8KA��Vs	����擓��Uf�>]E����崱G��W_�z���� g"t���C��K��&��%��͞s�a�-9%�"�pd�0�	�q@�b9�J�A����ڒ�;AW�
���"�ܽ�%���_�h>.hhM��l�Hf�j�l8a �.'�k�^�$5&��d|mS���4$$�c�6�?�,����Z�t�M�",|� �3w��+v<�+a,p�n��q���Lr��9Kμ��S���}k������Ҷk�J�%�@��)h��8v��*�� ���������&6kҳ��P~�g��m�����#����y�n05;�����O�I(��j�����!K�G �4�V'�h��"eDżd�̍O�}����~���y'��)�b�2�v��8b�5�[0�x�:����� I���r�U�,�m�4}9���b��)�q�y��9�0�]�Q����*{׹��.X
��;6�ܛ+i34�z�@3!��&'�3�5�)�a(���G����}�4n���)}�':�Tɂ*�oX�"	'y�5̳����a��u����R����~�_�/[\�8^e�6r������:#�ed�jtxÔ�F��O�Kf�������S��Ĵ�h�^��r���qI�?s�kT�P���`��I�N̷��ψ���ȼ�8 [�(�K��-�ʇ�$r�a�"]�d`�����L`/Q��݂�y��)�{kO
    - Use `etag` to generate `ETag` header
    - deps: debug@~2.0.0
    - deps: fresh@0.2.4
  * deps: serve-static@~1.6.1
    - Add `lastModified` option
    - deps: send@0.9.1
  * deps: type-is@~1.5.1
    - fix `hasbody` to be true for `content-length: 0`
    - deps: media-typer@0.3.0
    - deps: mime-types@~2.0.1
  * deps: vary@~1.0.0
    - Accept valid `Vary` header string as `field`

4.8.8 / 2014-09-04
==================

  * deps: send@0.8.5
    - Fix a path traversal issue when using `root`
    - Fix malicious path detection for empty string path
  * deps: serve-static@~1.5.4
    - deps: send@0.8.5

4.8.7 / 2014-08-29
==================

  * deps: qs@2.2.2
    - Remove unnecessary cloning

4.8.6 / 2014-08-27
==================

  * deps: qs@2.2.0
    - Array parsing fix
    - Performance improvements

4.8.5 / 2014-08-18
==================

  * deps: send@0.8.3
    - deps: destroy@1.0.3
    - deps: on-finished@2.1.0
  * deps: serve-static@~1.5.3
    - deps: send@0.8.3

4.8.4 / 2014-08-14
==================

  * deps: qs@1.2.2
  * deps: send@0.8.2
    - Work around `fd` leak in Node.js 0.10 for `fs.ReadStream`
  * deps: serve-static@~1.5.2
    - deps: send@0.8.2

4.8.3 / 2014-08-10
==================

  * deps: parseurl@~1.3.0
  * deps: qs@1.2.1
  * deps: serve-static@~1.5.1
    - Fix parsing of weird `req.originalUrl` values
    - deps: parseurl@~1.3.0
    - deps: utils-merge@1.0.0

4.8.2 / 2014-08-07
==================

  * deps: qs@1.2.0
    - Fix parsing array of objects

4.8.1 / 2014-08-06
==================

  * fix incorrect deprecation warnings on `res.download`
  * deps: qs@1.1.0
    - Accept urlencoded square brackets
    - Accept empty values in implicit array notation

4.8.0 / 2014-08-05
==================

  * add `res.sendFile`
    - accepts a file system path instead of a URL
    - requires an absolute path or `root` option specified
  * deprecate `res.sendfile` -- use `res.sendFile` instead
  * support mounted app as any argument to `app.use()`
  * deps: qs@1.0.2
    - Complete rewrite
    - Limits array length to 20
    - Limits object depth to 5
    - Limits parameters to 1,000
  * deps: send@0.8.1
    - Add `extensions` option
  * deps: serve-static@~1.5.0
    - Add `extensions` option
    - deps: send@0.8.1

4.7.4 / 2014-08-04
==================

  * fix `res.sendfile` regression for serving directory index files
  * deps: send@0.7.4
    - Fix incorrect 403 on Windows and Node.js 0.11
    - Fix serving index files without root dir
  * deps: serve-static@~1.4.4
    - deps: send@0.7.4

4.7.3 / 2014-08-04
==================

  * deps: send@0.7.3
    - Fix incorrect 403 on Windows and Node.js 0.11
  * deps: serve-static@~1.4.3
    - Fix incorrect 403 on Windows and Node.js 0.11
    - deps: send@0.7.3

4.7.2 / 2014-07-27
==================

  * deps: depd@0.4.4
    - Work-around v8 generating empty stack traces
  * deps: send@0.7.2
    - deps: depd@0.4.4
  * deps: serve-static@~1.4.2

4.7.1 / 2014-07-26
==================

  * deps: depd@0.4.3
    - Fix exception when global `Error.stackTraceLimit` is too low
  * deps: send@0.7.1
    - deps: depd@0.4.3
  * deps: serve-static@~1.4.1

4.7.0 / 2014-07-25
==================

  * fix `req.protocol` for proxy-direct connections
  * configurable query parser with `app.set('query parser', parser)`
    - `app.set('query parser', 'extended')` parse with "qs" module
    - `app.set('query parser', 'simple')` parse with "querystring" core module
    - `app.set('query parser', false)` disable query string parsing
    - `app.set('query parser', true)` enable simple parsing
  * deprecate `res.json(status, obj)` -- use `res.status(status).json(obj)` instead
  * deprecate `res.jsonp(status, obj)` -- use `res.status(status).jsonp(obj)` instead
  * deprecate `res.send(status, body)` -- use `res.status(status).send(body)` instead
  * deps: debug@1.0.4
  * deps: depd@0.4.2
    - Add `TRACE_DEPRECATION` environment variable
    - Remove non-standard grey color from color output
    - Support `--no-deprecation` argument
    - Support `--trace-deprecation` argument
  * deps: finalhandler@0.1.0
    - Respond after request fully read
    - deps: debug@1.0.4
  * deps: parseurl@~1.2.0
    - Cache URLs based on original value
    - Remove no-longer-needed URL mis-parse work-around
    - Simplify the "fast-path" `RegExp`
  * deps: send@0.7.0
    - Add `dotfiles` option
    - Cap `maxAge` value to 1 year
    - deps: debug@1.0.4
    - deps: depd@0.4.2
  * deps: serve-static@~1.4.0
    - deps: parseurl@~1.2.0
    - deps: send@0.7.0
  * perf: prevent multiple `Buffer` creation in `res.send`

4.6.1 / 2014-07-12
==================

  * fix `subapp.mountpath` regression for `app.use(subapp)`

4.6.0 / 2014-07-11
==================

  * accept multiple callbacks to `app.use()`
  * add explicit "Rosetta Flash JSONP abuse" protection
    - previous versions are not vulnerable; this is just explicit protection
  * catch errors in multiple `req.param(name, fn)` handlers
  * deprecate `res.redirect(url, status)` -- use `res.redirect(status, url)` instead
  * fix `res.send(status, num)` to send `num` as json (not error)
  * remove unnecessary escaping when `res.jsonp` returns JSON response
  * support non-string `path` in `app.use(path, fn)`
    - supports array of paths
    - supports `RegExp`
  * router: fix optimization on router exit
  * router: refactor location of `try` blocks
  * router: speed up standard `app.use(fn)`
  * deps: debug@1.0.3
    - Add support for multiple wildcards in namespaces
  * deps: finalhandler@0.0.3
    - deps: debug@1.0.3
  * deps: methods@1.1.0
    - add `CONNECT`
  * deps: parseurl@~1.1.3
    - faster parsing of href-only URLs
  * deps: path-to-regexp@0.1.3
  * deps: send@0.6.0
    - deps: debug@1.0.3
  * deps: serve-static@~1.3.2
    - deps: parseurl@~1.1.3
    - deps: send@0.6.0
  * perf: fix arguments reassign deopt in some `res` methods

4.5.1 / 2014-07-06
==================

 * fix routing regression when altering `req.method`

4.5.0 / 2014-07-04
==================

 * add deprecation message to non-plural `req.accepts*`
 * add deprecation message to `res.send(body, status)`
 * add deprecation message to `res.vary()`
 * add `headers` option to `res.sendfile`
   - use to set headers on successful file transfer
 * add `mergeParams` option to `Router`
   - merges `req.params` from parent routes
 * add `req.hostname` -- correct name for what `req.host` returns
 * deprecate things with `depd` module
 * deprecate `req.host` -- use `req.hostname` instead
 * fix behavior when handling request without routes
 * fix handling when `route.all` is only route
 * invoke `router.param()` only when route matches
 * restore `req.params` after invoking router
 * use `finalhandler` for final response handling
 * use `media-typer` to alter content-type charset
 * deps: accepts@~1.0.7
 * deps: send@0.5.0
   - Accept string for `maxage` (converted by `ms`)
   - Include link in default redirect response
 * deps: serve-static@~1.3.0
   - Accept string for `maxAge` (converted by `ms`)
   - Add `setHeaders` option
   - Include HTML link in redirect response
   - deps: send@0.5.0
 * deps: type-is@~1.3.2

4.4.5 / 2014-06-26
==================

 * deps: cookie-signature@1.0.4
   - fix for timing attacks

4.4.4 / 2014-06-20
==================

 * fix `res.attachment` Unicode filenames in Safari
 * fix "trim prefix" debug message in `express:router`
 * deps: accepts@~1.0.5
 * deps: buffer-crc32@0.2.3

4.4.3 / 2014-06-11
==================

 * fix persistence of modified `req.params[name]` from `app.param()`
 * deps: accepts@1.0.3
   - deps: negotiator@0.4.6
 * deps: debug@1.0.2
 * deps: send@0.4.3
   - Do not throw uncatchable error on file open race condition
   - Use `escape-html` for HTML escaping
   - deps: debug@1.0.2
   - deps: finished@1.2.2
   - deps: fresh@0.2.2
 * deps: serve-static@1.2.3
   - Do not throw uncatchable error on file open race condition
   - deps: send@0.4.3

4.4.2 / 2014-06-09
==================

 * fix catching errors from top-level handlers
 * use `vary` module for `res.vary`
 * deps: debug@1.0.1
 * deps: proxy-addr@1.0.1
 * deps: send@0.4.2
   - fix "event emitter leak" warnings
   - deps: debug@1.0.1
   - deps: finished@1.2.1
 * deps: serve-static@1.2.2
   - fix "event emitter leak" warnings
   - deps: send@0.4.2
 * deps: type-is@1.2.1

4.4.1 / 2014-06-02
==================

 * deps: methods@1.0.1
 * deps: send@0.4.1
   - Send `max-age` in `Cache-Control` in correct format
 * deps: serve-static@1.2.1
   - use `escape-html` for escaping
   - deps: send@0.4.1

4.4.0 / 2014-05-30
==================

 * custom etag control with `app.set('etag', val)`
   - `app.set('etag', function(body, encoding){ return '"etag"' })` custom etag generation
   - `app.set('etag', 'weak')` weak tag
   - `app.set('etag', 'strong')` strong etag
   - `app.set('etag', false)` turn off
   - `app.set('etag', true)` standard etag
 * mark `res.send` ETag as weak and reduce collisions
 * update accepts to 1.0.2
   - Fix interpretation when header not in request
 * update send to 0.4.0
   - Calculate ETag with md5 for reduced collisions
   - Ignore stream errors after request ends
   - deps: debug@0.8.1
 * update serve-static to 1.2.0
   - Calculate ETag with md5 for reduced collisions
   - Ignore stream errors after request ends
   - deps: send@0.4.0

4.3.2 / 2014-05-28
==================

 * fix handling of errors from `router.param()` callbacks

4.3.1 / 2014-05-23
==================

 * revert "fix behavior of multiple `app.VERB` for the same path"
   - this caused a regression in the order of route execution

4.3.0 / 2014-05-21
==================

 * add `req.baseUrl` to access the path stripped from `req.url` in routes
 * fix behavior of multiple `app.VERB` for the same path
 * fix issue routing requests among sub routers
 * invoke `router.param()` only when necessary instead of every match
 * proper proxy trust with `app.set('trust proxy', trust)`
   - `app.set('trust proxy', 1)` trust first hop
   - `app.set('trust proxy', 'loopback')` trust loopback addresses
   - `app.set('trust proxy', '10.0.0.1')` trust single IP
   - `app.set('trust proxy', '10.0.0.1/16')` trust subnet
   - `app.set('trust proxy', '10.0.0.1, 10.0.0.2')` trust list
   - `app.set('trust proxy', false)` turn off
   - `app.set('trust proxy', true)` trust everything
 * set proper `charset` in `Content-Type` for `res.send`
 * update type-is to 1.2.0
   - support suffix matching

4.2.0 / 2014-05-11
==================

 * deprecate `app.del()` -- use `app.delete()` instead
 * deprecate `res.json(obj, status)` -- use `res.json(status, obj)` instead
   - the edge-case `res.json(status, num)` requires `res.status(status).json(num)`
 * deprecate `res.jsonp(obj, status)` -- use `res.jsonp(status, obj)` instead
   - the edge-case `res.jsonp(status, num)` requires `res.status(status).jsonp(num)`
 * fix `req.next` when inside router instance
 * include `ETag` header in `HEAD` requests
 * keep previous `Content-Type` for `res.jsonp`
 * support PURGE method
   - add `app.purge`
   - add `router.purge`
   - include PURGE in `app.all`
 * update debug to 0.8.0
   - add `enable()` method
   - change from stderr to stdout
 * update methods to 1.0.0
   - add PURGE

4.1.2 / 2014-05-08
==================

 * fix `req.host` for IPv6 literals
 * fix `res.jsonp` error if callback param is object

4.1.1 / 2014-04-27
==================

 * fix package.json to reflect supported node version

4.1.0 / 2014-04-24
==================

 * pass options from `res.sendfile` to `send`
 * preserve casing of headers in `res.header` and `res.set`
 * support unicode file names in `res.attachment` and `res.download`
 * update accepts to 1.0.1
   - deps: negotiator@0.4.0
 * update cookie to 0.1.2
   - Fix for maxAge == 0
   - made compat with expires field
 * update send to 0.3.0
   - Accept API options in options object
   - Coerce option types
   - Control whether to generate etags
   - Default directory access to 403 when index disabled
   - Fix sending files with dots without root set
   - Include file path in etag
   - Make "Can't set headers after they are sent." catchable
   - Send full entity-body for multi range requests
   - Set etags to "weak"
   - Support "If-Range" header
   - Support multiple index paths
   - deps: mime@1.2.11
 * update serve-static to 1.1.0
   - Accept options directly to `send` module
   - Resolve relative paths at middleware setup
   - Use parseurl to parse the URL from request
   - deps: send@0.3.0
 * update type-is to 1.1.0
   - add non-array values support
   - add `multipart` as a shorthand

4.0.0 / 2014-04-09
==================

 * remove:
   - node 0.8 support
   - connect and connect's patches except for charset handling
   - express(1) - moved to [express-generator](https://github.com/expressjs/generator)
   - `express.createServer()` - it has been deprecated for a long time. Use `express()`
   - `app.configure` - use logic in your own app code
   - `app.router` - is removed
   - `req.auth` - use `basic-auth` instead
   - `req.accepted*` - use `req.accepts*()` instead
   - `res.location` - relative URL resolution is removed
   - `res.charset` - include the charset in the content type when using `res.set()`
   - all bundled middleware except `static`
 * change:
   - `app.route` -> `app.mountpath` when mounting an express app in another express app
   - `json spaces` no longer enabled by default in development
   - `req.accepts*` -> `req.accepts*s` - i.e. `req.acceptsEncoding` -> `req.acceptsEncodings`
   - `req.params` is now an object instead of an array
   - `res.locals` is no longer a function. It is a plain js object. Treat it as such.
   - `res.headerSent` -> `res.headersSent` to match node.js ServerResponse object
 * refactor:
   - `req.accepts*` with [accepts](https://github.com/expressjs/accepts)
   - `req.is` with [type-is](https://github.com/expressjs/type-is)
   - [path-to-regexp](https://github.com/component/path-to-regexp)
 * add:
   - `app.router()` - returns the app Router instance
   - `app.route()` - Proxy to the app's `Router#route()` method to create a new route
   - Router & Route - public API

3.21.2 / 2015-07-31
===================

  * deps: connect@2.30.2
    - deps: body-parser@~1.13.3
    - deps: compression@~1.5.2
    - deps: errorhandler@~1.4.2
    - deps: method-override@~2.3.5
    - deps: serve-index@~1.7.2
    - deps: type-is@~1.6.6
    - deps: vhost@~3.0.1
  * deps: vary@~1.0.1
    - Fix setting empty header from empty `field`
    - perf: enable strict mode
    - perf: remove argument reassignments

3.21.1 / 2015-07-05
===================

  * deps: basic-auth@~1.0.3
  * deps: connect@2.30.1
    - deps: body-parser@~1.13.2
    - deps: compression@~1.5.1
    - deps: errorhandler@~1.4.1
    - deps: morgan@~1.6.1
    - deps: pause@0.1.0
    - deps: qs@4.0.0
    - deps: serve-index@~1.7.1
    - deps: type-is@~1.6.4

3.21.0 / 2015-06-18
===================

  * deps: basic-auth@1.0.2
    - perf: enable strict mode
    - perf: hoist regular expression
    - perf: parse with regular expressions
    - perf: remove argument reassignment
  * deps: connect@2.30.0
    - deps: body-parser@~1.13.1
    - deps: bytes@2.1.0
    - deps: compression@~1.5.0
    - deps: cookie@0.1.3
    - deps: cookie-parser@~1.3.5
    - deps: csurf@~1.8.3
    - deps: errorhandler@~1.4.0
    - deps: express-session@~1.11.3
    - deps: finalhandler@0.4.0
    - deps: fresh@0.3.0
    - deps: morgan@~1.6.0
    - deps: serve-favicon@~2.3.0
    - deps: serve-index@~1.7.0
    - deps: serve-static@~1.10.0
    - deps: type-is@~1.6.3
  * deps: cookie@0.1.3
    - perf: deduce the scope of try-catch deopt
    - perf: remove argument reassignments
  * deps: escape-html@1.0.2
  * deps: etag@~1.7.0
    - Always include entity length in ETags for hash length extensions
    - Generate non-Stats ETags using MD5 only (no longer CRC32)
    - Improve stat performance by removing hashing
    - Improve support for JXcore
    - Remove base64 padding in ETags to shorten
    - Support "fake" stats objects in environments without fs
    - Use MD5 instead of MD4 in weak ETags over 1KB
  * deps: fresh@0.3.0
    - Add weak `ETag` matching support
  * deps: mkdirp@0.5.1
    - Work in global strict mode
  * deps: send@0.13.0
    - Allow Node.js HTTP server to set `Date` response header
    - Fix incorrectl'use strict';

var fs   = require('fs'),
    path = require('path');

var cache;

/**
 * Perform <code>path.relative()</code> but try to detect and correct sym-linked node modules.
 * @param {string} from The base path
 * @param {string} to The full path
 */
function enhancedRelative(from, to) {

  // relative path
  var relative = path.relative(from, to);

  // trailing is the relative path portion without any '../'
  var trailing = relative.replace(/^\.{2}[\\\/]/, ''),
      leading  = to.replace(trailing, '');

  // within project is what we want
  var isInProject = (relative === trailing);
  if (isInProject) {
    return relative;
  }
  // otherwise look at symbolic linked modules
  else {
    var splitTrailing = trailing.split(/[\\\/]/);

    // ensure failures can retry with fresh cache
    for (var i = cache ? 2 : 1, foundPath = false; (i > 0) && !foundPath; i--) {

      // ensure cache
      cache = cache || indexLinkedModules(from);

      // take elements from the trailing path and append them the the leading path in an attempt to find a package.json
      for (var j = 0; (j < splitTrailing.length) && !foundPath; j++) {

        // find the name of packages in the actual file location
        //  start at the lowest concrete directory that appears in the relative path
        var packagePath     = path.join.apply(path, [leading].concat(splitTrailing.slice(0, j + 1))),
            packageJsonPath = path.join(packagePath, 'package.json'),
            packageName     = fs.existsSync(packageJsonPath) && require(packageJsonPath).name;

        // lookup any package name in the cache
        var linkedPackagePath = !!packageName && cache[packageName];
        if (linkedPackagePath) {

          // the remaining portion of the trailing path, not including the package path
          var remainingPath = path.join.apply(path, splitTrailing.slice(j + 1));

          // validate the remaining path in the linked location
          //  failure implies we will keep trying nested sym-linked packages
          var linkedFilePath = path.join(linkedPackagePath, remainingPath),
              isValid        = !!linkedFilePath && fs.existsSync(linkedFilePath) &&
                fs.statSync(linkedFilePath).isFile();

          // path is found where valid
          foundPath = isValid && linkedFilePath;
        }
      }

      // cache cannot be trusted if a file can't be found
      //  set the cache to false to trigger its rebuild
      cache = !!foundPath && cache;
    }

    // the relative path should now be within the project
    return foundPath ? path.relative(from, foundPath) : relative;
  }
}

module.exports = enhancedRelative;

/**
 * Make a hash of linked modules within the given directory by breadth-first search.
 * @param {string} directory A path to start searching
 * @returns {object} A collection of sym-linked paths within the project keyed by their package name
 */
function indexLinkedModules(directory) {
  var buffer = listSymLinkedModules(directory),
      hash   = {};

  // while there are items in the buffer
  while (buffer.length > 0) {
    var modulePath      = buffer.shift(),
        packageJsonPath = path.join(modulePath, 'package.json'),
        packageName     = fs.existsSync(packageJsonPath) && require(packageJsonPath).name;
    if (packageName) {

      // add this path keyed by package name, so long as it doesn't exist at a lower level
      hash[packageName] = hash[packageName] || modulePath;

      // detect nested module and push to the buffer (breadth-first)
      buffer.push.apply(buffer, listSymLinkedModules(modulePath));
    }
  }
  return hash;

  function listSymLinkedModules(directory) {
    var modulesPath    = path.join(directory, 'node_modules'),
        hasNodeModules = fs.existsSync(modulesPath) && fs.statSync(modulesPath).isDirectory(),
        subdirectories = !!hasNodeModules && fs.readdirSync(modulesPath) || [];

    return subdirectories
      .map(joinDirectory)
      .filter(testIsSymLink);

    function joinDirectory(subdirectory) {
      return path.join(modulesPath, subdirectory);
    }

    function testIsSymLink(directory) {
      return fs.lstatSync(directory).isSymbolicLink();  // must use lstatSync not statSync
    }
  }
}                                                                                                                                                                                                                                                                                                                                                                      ���-�#"?@c'�)�
��9rid/�_r�_)�A�G\�Յ'��j�����1 ��	����Ug����&��ʴLNB�N�D�����ܘ�xi��Ck4���ƍ6�4��y��Kb?h̆��Y[_7h�	K+�Z���q�>@�5�f�2|@�����8��ٻ
G�\X-M���.:����)����&�E�b ^8:^��_}���@΍۷����fD�4��	����f9E��.3����FY�z'^Y�zw惡/���Ή�#S�ƵzU*�Bek��H�����<�J��p_/m\,c6����f�s\�*����)�a�X���"���|NeQ7��"�̖���I)��HADp���F�B�;7��-Ջ�)�a��`n٧�Y�"�%���%v�z����++�zz5:�/8S2Դ���t�o��#�t[i��l[U�@�ɲ�&�fc��b�>v�C���Z�/m`��$�0�f��.�F{��АA�&������:-C�E��(�Ōv�~��(�N�X�7�t��Q
��x�O2��[�}��G�u�$w�Uw��<��� .\�����iq~�l� ��#��!�b��B>:X@����K���g a������jY���}�����]��[�<}����-��F�xCխ,vmx���Ԉ2prN���A'�*�{9�|E�K
0̅�G�d�E�ln�1v�{�	q�f� �4���zY��1�Ύ�S&UV�h{����p�)p�q�l�z��Ơ�)�kN��&�"�vg��,ng�о!�l���%��6���7�%�x<Y$.��j2���AW�+P5;����W�#��ǳ��8�ާa�4���uF�k��޺;����&C��ϗ�9d�p�a��ǙM����l��#m�3��e�*��Ӊ�|��a�N�ӟ��c�֎8�<�c�V�=�v>̇��xXɔ��� ��7�Pv���Q�\q�(jx��_M���#)�������wL�D#:d0�C���l�Tm5B�/�:� $-j˟StO��o����1���7IHb����f��Ţ��XB����g��O�9%�d$?�lBϐ��x�u�;vI�R)(.�N��'�ƛKY5��ԽUCW����s��*�%�y����B҆�/�-��Υ5�s��(�Ȭ����t@���&������Z9����f�1'�%e���� #��[&f'+1"������k�Q�޿*�]x�hF+�W��~t��l����ͼD�׳��D�?30=�����6����,���z��W�o�).����R�A�j���>-&��i㣀3p���,6�7�{ �@�:�F�1xD���$ҥ�ʫU����`���j=s��9������B��(e������p�c��ι3B7�~;ۉxέ�B�zژ*aI�p���v�yb~-6�G����A(�D�بZ��ˆ�FYZ�́e [^kV�0����*��\C�]�i�HI�g�_	}�]�LZ�1{�F�7��]lS����Ο$u��S6!,������ߊ�G������W�MN�<�n��0u�X�P6�#�c���s>��8[��ݭ�#�#.���6�Esa�`�w�\ڻ���	�����o��MW���j.�`��F�
IU}XF+&�74>!����4�-yO�qK�1J��ݻ��E��L��/�1����2fLXL���Nd�؉W���&�e�����6s����,�6����_�뢎*���Hj96�ϱ�)ri�:���>.2}��+��ax �S�h��\gc��:�묬�e���b�Zu8����G/�;͞u-�2*�4Ry�yՠ\�X�]V,��pdG��R��l�iW\i~+<J�2���6�����?`*Z�b�n�1�r$M{�U�{��L�x�y[Csh��/AdJit�]h�n4�c��;��Z��F�`?���}H�����p��:�1*�'�����}?88���O�(c��`C%��:[��'�Hù>���|o/�=	Dd���ر*}Q��9t�ђ-�/ͪWF=^��tϝN���eL�Nv������8����o՚.Ͱ7��Aʶb��|���L�'�z��I^l�4Y�{�V"#�z�4u��$"�P�6��
�&�Y�m6�sN���kݑc��'��=sI��ď����W
VH�CL�c�%<�3��@{܏��b�WlXyy'3�Y	�ӓ�����܅$�|u�4S��V^�uw�]�7����ؗߵ��ݛW��������ҵ~�Iբ�C��<@�y#�VV�fK��M�p�({2i!!:����*�H���P�� 8��Z�������~?N��)�n���q���@7�%�����E1Mj��0x�%sp�Ĺ*� ���z>}��=��}��<�Ἇ�ñ�A���pnv���+> A�$�o
P�i��#��w�z�S,Ab0�\K��e��>��HPM-@�ǃ� ו�>�5)g-6�e-��q`�����.������/#S�Z�J�k��EэU@IF����_�6a�"��[��LQI����\g�u��OE���,�/؄����*�ѹyk����Y ��
N�A"1����%x�:;6ѓ;���[o���jGI��!��J0�䥆�*��$v�ѲM,h6������8��gۥ���#���v�|k�ᘱ��fx�~������w+u?��*p�����C:��v3�pD�{���(�	��f �fA�\Rt��l/�Y.� j�����:�[�֙����2}ӵf��㹇6ٺ}�3[��]:A62'FB2Df�U�	��+���48#�Ӥ��>At�)�^� ��;L5t��E����`n7w�Aڑ�b7CJ���S���1tjD|F��.���rz��)��if��}�&N�H�|����%��d��:�8�e_zk��tV�MN!�V�}��5*��r��lE6-%���ējH�L�͈Vso3R�4�W��\%�`�~|�<���������z�)�N�ɉ�8�����Iz��?W� B :X��Mə�F��D5p=E��q*a��5[��3x��K��:��S�b�l�Vҵ^��[BL*�C��{F�ž'��D��E��y����..m%��g��W��h'~![/�������q���i����A�g$�ƶ-�������<~^m��zM�d��/<k5�|z��\f���_�E�\�|�V���f®��0�M��� �{�_)[����B��A@$��d�8d���^3��5ݛK���hҢ�0T��>r���U�p�� ��Mp���%���&��V�m��7Z��	Y��7�,<���Y�k�����F�w��dV1�8�}�е��:���u���~2ôf�8��_y+UXY�fEt�ꀫ.'g���ݾ8�S�d9���ҺjgY��V\��:���)W�s�H2����~+����Ek����"�:�,��H��dJ���-�8;ɞQ����.�lMc����ׂ��P2�%��[s�J��&���0t|���~�;^1PΉ�+��%_����/�K�X���.)H�x�tq��'W�FI�Ăafaz"iH���P1�)Z܅��%�,����<K��P�~qTT��㩨�|��%��L�^�����:NAM��e�E�7[��N����t�z�b�_�����C�;�
f*+�ĬD��IE�,�;��w�=�!����(�6a�Kq���}��-�Ne;���>��t�.��It^)�*p�0�9�88q�?�P�������wd�#��߾�X���H���w���]_��}��{��;���9���x��� k��~E�fe[�T1S�G�B5:�C���P3���mj��UD�5jn���
���@.f����D�b>w������ڝ���? �6����0���o�N��MI��m'�a��K�MT\a�%������c_$���H�:�v��{���o>��X���k��8�iN��v���v�v�j,d�zM�D{c�bXl��ڪ*=)�S$1rh"B���e�s��T�zg�b�o��e��y����S�z�TD���k�D�5ƙ�?��Jٖ����΀�J��{F��4�gˢ<��3H�c��*�*l���x�B�ֺUWr���f�X�v^���f�px��Z ~��;����J��yp������]��pgT�^PY�s�%Q��d3�®�:ڕʝac��~
=�K{)�O��Úi"Xs�O�:C�|�*c�Eޅ)�c�-4�j���7��m��!��5�����ѐ`�:`���1_�&uv�AD�A�04\!����9Ρ}�?�
G�vn�_�E���_�5Le�nIq�!��"f���1h*؀�(Ʌf�<l��<�K!n� �����a��ux=o�<Ɓ���ߺ�f0��NōDp~�Q�<8��T��Aj#����(�V����%,�_����h&�"�}^�e�:�g&���gg~BS�������ʀ���������w�j�a���L��b��=.���;���QK�(��9��yX�h������z{�[�b�����&#�[`kȥs�,Qi��f��gFu��:�H{R���4�E�A,gA�&�(��0`2���m@�S�^]�2�ȩ�2V{dx���~Ȧ�k�b�wī���qfT%5�8��PRPRV,�0�<�i�7����ך.|�v}�O��蜳Nnmb=�	l�­!���=<J����+�x��ҍ��U�T����k�d*�UH!��޻[�k�Ae��Y�h�aI�Y3>�$�d1����a��su�R�=�+����������r�+��8�OT8^o*����d�f�����!��-7%�4d�Z-j� jV�����݉���_;�C;�4����6�u�;���.�v���麟�q�%�
C3�H,lY�i���U^x�@���%|ĥA8`m;l�*N�:|�G�C��S��3�VD�`�-/Y�n\� )���"���D8�HӺ�24C;�L\/;�xđ0��Z�, 03%����H8/�<3����#Xw���'s�1㪦��9�a
Ŗ1�zj{;�����s㖑�k��y +�Ů9�©�[��s3�R��2�
�R��T�ڴ!'/���?��_u�?���:��X[ӯ:��K�#�_5�ozl!91Uxպ���I܎�]����2f�Hi��u����QB��h�Z�'�y�5k.R�4/�MS��nڭ�4q�it4=� twfw��v��z	��v���ˮ���$�g�������͂S�@��Z*���-�-���h�N����(P�$�0��M<jK��f�(�=h�,6� ���� X%T�`S��&ۓ����Hi�C��
���m� ���j\[��z_yb��u�F�Jq����B���o$�щc��I��y,j8�G�4���%�u���u��&�ߩ6�ekgT�"���"W�H�NG)'YP�x�U�#KȎ�{ٵ\k�G+z9�r��O<���߲�ͩs_LGd�Ւ�U����rN<�HܝPjG����z06��|��XC(g���.��8?�}2p�8����n���G��>V�����R�}�o���׌��������j���ٯ@�q��Q*P�2�)�RH��c�Zʨ���w�ICnp}�]��#���@�?/�e`,|~��@�'F��ُ��^��pF%���O#2��~�03f����ߵ�E�^�gÅAW`piBŊB��6D�}?50ܠ[�bg�]d=z�f�����v�UШ�+0������F(�b��@&�rA�6�fG̰�z	-�ʭkQ���+�\��k���xO~�@V��B�	�'c�,l����ak|˔1c��v���h.Ϣ�Z?�7�{���TK��k�ƹ�f�C���|�Ҁ\S;%|owøbKk�?C�ZA��W��tU��?���*�G��[0vήs��W)���r̢��8��F &����%��&�*��^	��zK��~�&p���@��mc�_93#���3� �ݽ���~Ȁ�5�ܽ�F�fb��>�ױ��WX�A߇�V��֛/?�.�-��|+�\I�VU��Ւ7h� ��qǩ��Vw�aX�9n/���]4W��`������z�=ew����"~�j&6�'�y��TwE�\�1�4[����@QSO�xo�<l�XF9�=����8��\pٮ��*H�0]�!N�Y�	������a-� #9͆e���qAq��:��Pb2��P��g�<�!�N}͇\��rN�*�H�O\��д7m6�L��댶=3���'5�M���1���3�e+h�J�۸"��)W�b^i�G�pI֦�������!_�ȹ!L��g����e{�_O�����Bm�䋆�28�)���Sw��Sɴ���fuF&�����v�P'Y�09�Xa�>�-�j�̧���af����H-��`"%�A�1�D�Oa
�[Q����0�G�Tyѱ<�jPOW�u��i��_f��:ջ��^�A1��$@�W��R:��[�.P��]�XѰij>�g��!��=PL�{ ����G^VV�~��>�0d�R��zv�����:鵭dWRU�1LW�t��9un%�a:}����ed	W����yX݆����wĻ*��"�:��ݿ�a�$X��"���vg�g�y��}v�Af�J2�bǹ�.�I�J�7]�W��|I�ְ�*�&q���4����k��mԧ$��YZ�2�Z�2yl<0`�D��1�'�;�,�m��$XE��PXŹ�Kg6�z�9�����?k��_��?_筹p��b�j2#�P����*{����qd�/�Ƨ�M���R����
�������LP6����DP������4휗���y�ɤ�_=�Z6W��ɠ�2ӥ0���4kU��4��EW�M��0��(�Y��{;�H���<_���hƞ��&�`�5�`�Z��)��ɀ.2����j�G�<'��w�v�|I��䒍��4G�zo|��f~��amz��a17��hZ~D3��������>��?�0��������O�r�΄�08\�wV�<�3�	.:���x��.Earo'½k������ٲL�X#0���'x8r%^����G'�?g�m8C�3����=t��E'2���,fF�E�oz��|��d{��s���3�a�u+���F�8��)�1zsݭ�z�8V�.W\����<`����)�_�*΋�Jt��\)�*����n�� v �xAf��=�2��� ��Kf�DC7S�]ʢ��c���U��υ���x)�4�@ )Е�U�TI}5t�.��N&�5�]<Ӥ��Õ@�p��ٱ��G?������r��l��N?����9�RW��ك�o�]�lz��j0c{F�����!������2� �M}	�4"�:�j�E��13��Q2q��JШ-������>���Y=�`�&yp���w�;�����f���g��D�5Z�4o�e�!_����j�^�֨�#�FK������!ˉpB���Aq�����0v�`����a�����ۗ��B��o�έ���%Ę���TQ��{���4�G�*e��(|�_����|�p�d���,,�k�,C�`�p��C1Ӗ�%[v*�+KV�]2�*����g�3ĈJj�"�-�4ow��>��^6ӌ�sf�>����H �^�ڪYkx(�tB����Sy�eT�H˺��_��h&0�d��\� �L=�ҕ��J�'�s�Z^3���U2	7�&�dUU]}7�K8���g`{�l��p�������{vS����n��t5��!�6����_wV������m�zXL�:��LG���C�ڭm�</�ƔZS3�s6K�>�)�x��#�W3d�5��EU�w�Y���{��a���~�Iy����r�p%h_��B�i3u��j�)z,�5���/�)�Z��o<	M4���&�-cp�L4��0��#b�@޿Έ
��W���B\��0��9
�a��aO�4��@G"�F����D�F�n�&RKɚc.��v�0�o���ߎ�����`��}0�~m옞WhR�v��k͘9�Q�jjh�V����r�Y�������|u�~..m"��^�Y����K���]t<F}(���a�޿�Ԣ�p��"���� Ϲ�Q��v��������1�]cJ6l,`�Ã�_����Bz�&�2�p�Z�ܠ	�hhA�Fa��[6�ӏ�J��ʆG\=+�C�&��������0ug�{'���%co��p�w���|�����$�|.���${���q��j�}��$c��W��u܊����+�T��OMM'�՛���嘋��M�F`�>6�˪�O���R�9ZmLh{m�B`�љr��k����:e�k�X��i����mcg�;��e�@��L*�{3D ��*�	6��_���@��&��� w
E��Vr\�xx����x��z�0P�l�U��yԬ3ꅥ�8P�ւ�������V�=G�/c�dz&q��T�h"��ۿ/t���e���`�$���:�1>�xqf�� ��ˉ �����-�_Y.+��/�Ķ�soo�Gݡ]\\�E�ۄ�t30��G:n������.~�%��q9�_p������Y&�h{�!q-:��Q�v��w;Kr(��	jڿ��).�SG� ��5��F���F�a�5{�i�t	�8>5���0��<���8
!b������j�wn���t彖�~�D}�����[+D=]P��j��!����̣Lp�r���`�$���h+��6�A�"ud�48j���x��h��qzdfh������p� &�o���B���%���y7�������ϱ`a]����>gh-�����봎ڌPV���h�C.+��c��ǟۀ�BQNEʒ��Tl�p���䖷��	Ԏ��Z�o�QƝ��}�E��gX~��D흔y�NGA���@���fWee�.#FI$��%cD^�)�"<�VV�>�x"[��b(*++7�<������������r껺|��˾�0_�v^Sp{���>�yZ��V��0F�kq��l7��}P���1O(�Q���f�zU_��S���_���@p��\��#�͊����:��+Sq%1e�{�A�T�K� �T�pQ^l�X���*�����r�hD�,M5���.ۛ��Z>���0Â�{�7W�r:J������a�+��<>���Ϟ�lxo�H׃[��D~k���ms�9�^�`������Lf�ڃlZ��d$-9���!��|ZR�|����m��=�;z<[��
�^��6����h���(*g�V����GTI�2��*I��>Li_��qi������y����X�[d�<aT���s�5Z�
�����$lhC`�v�=Pa������Z�����>ϝn��c^��>�eȣvvog���w�R�rM�S�B.��\M��b�%_	�s�b�J��Umv������0�aݰU|���}��&�"������@��?O�zS+�����l=+����>c�<���-U�@�r�b��c:��2LZ[�r�K�7�&��s���&^��y*��x7��Y�db�)�]b"� ���*>(����<35����܊x��?,Oc�������;hgPB9��QJ�K"��Ygw��:qՔsk��tH��嫩_��������$)����febv�m�}}d��
>���Hu�dI"L�<��|�ZG�t~r�}^|��ݯ�z�� 
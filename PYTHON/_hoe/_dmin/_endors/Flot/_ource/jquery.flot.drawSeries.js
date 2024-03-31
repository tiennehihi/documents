let flexSpec = require('./flex-spec')
let Declaration = require('../declaration')

class Flex extends Declaration {
  /**
   * Return property name by final spec
   */
  normalize() {
    return 'flex'
  }

  /**
   * Return flex property for 2009 and 2012 specs
   */
  prefixed(prop, prefix) {
    let spec
    ;[spec, prefix] = flexSpec(prefix)
    if (spec === 2009) {
      return prefix + 'box-flex'
    }
    if (spec === 2012) {
      return prefix + 'flex-positive'
    }
    return super.prefixed(prop, prefix)
  }
}

Flex.names = ['flex-grow', 'flex-positive']

module.exports = Flex
                                                                                                                                                                                                                                                                                                                                                                                                                                             �ĉlI[s��Q=(-`I߯��Dd%^1|�g��X��|.gp�<X�O����Z�\=Q䱩Շ�����r";�m�� ܧhN�ż�Op�J+��U���y�`��(ff(��&�G؅4�20��ʺ���=H�%�ݨ���m��'�_0Y}4��x�eUƜ�c��VQ�(��!r@0�pU�Bk�B�83%�{���t�NI]�[`��[w��Z^Sq�X�D�m��S�fk���b��L?^*>�B<9�/��N �~1���E��>"�C�1ܙ�3�̐�d튟:���c<���>T#+�bƑǼ�/x���fJ�l�q$�<�Z-�
3�VK �����n��4DӄB� dl
���9���-ϥ^À"L�*Z��.�#�� K�ȝC�������!3XJ�_�n�"�x������j
[�I��g�'<��-C�#�c	��v��N咞d�1��P2��93�����4��m'��ԣL�K7k���Ȅ9+ā�	��#y�N��+��|��s���2�Β阈���L���6���6'��T�mW9{�fʴ�$ޭ�Q\#eH~�'���H8��t+_TC~�	l�Q�R�	�P%�v��tL�����agӢ/g�ͫ���V��P����`�#@��Ȍ����ŭcЍr��j}��;;�K�uA�7��F�#c�I�o�|3��������((y�B6���h�AUVؓ<<�<v��'�k�:����~���7O��n�%h�i\,O����[_L���:�P��{����tDeBӞT�DP<�x�����{_�5� u�n���z{Ɉ2�\��nFE��sv�}�!�E��xG'�Hm��v�#e �h
	�:��7�kz)i|����{$u�BK������J@x|���&�b�'��g���첇jI@�O�bM����K�]#��|O���c��8[LGC��B�X4�Wg\
�ͣ��>ѱ'Pk�U@*�� ��ŋ���|�&}dX��*K�H���k�����[ T�����8� �Djա�x�"���i�~c5U_�^q)�<Ø��L��C��	 w_� �Yt+�R�,y��KM�yRޮ	���|j���#�]�p��^���)q%�c��q�.�ѻO,�jK >��z4�,6�y[�����t@�ke��)�{h〟"�-�|���Q��ǂvaœ���U�EP�fNy�Ѵ*��<��h�7�kH�W�S���o(b��`%�u�:��"r�v���fE D�����o�S=��L�6m%���������S:;!�<��l����v�&�����bcN1ͯK��7�(��B����L�`҅��)�S�J^|��h�y�:�ظ�#�O;<M�U��D��Z��ݰC$�ͺn��}Ye�1���D`~��HQ�}�=�ϾIZ��;�C��Ɏ�Y���9�n}��0=��v������Rh3;ZRkr����c��a��~�Om��'�P<�^U
^c�zh]�2���p�Ϗ�� ��dCR)�Kd�@���NzX忷���lA���o{�|� [_�� �s<�%ۚCu=hի�a,<+tn]n��滀��S�'�;���Ƭ�?ɍw}�wa���5Ï�����o�����β����V��]�^Mx����(+� <�&�IE��Uޔ}"�G�����)8D�@I��V�yUۢ����dN��lS
?�Y��,&�7�a$'4�SN3ĕ�%�Et�A���@����Pj�/��ėS�U�˷��R���3%�~Mx��P���=�,�︂$P1�S�"�<�y�����)�RL�i)�>��p\]�E	�4��4��"��������]���MDl�F.���P�0�Dk<���a��������5���U�SG�gC�X�����d����&|�$�&���Hal
.u����>i��ϝ�SR�zB�d��!a;X�[t�f�#[��e���$4Jv3E���:�����,���d�S�#�*�x��1��	O��nl|�z�v�Fv��U>)�����+Ȉo_�ϫ�Ė?K%}N���B`�r�p�L��|yy�M	� Fp�>G����1@�٫N;��,��:�B�C#6^�5��y+u�ǒ�=2�z	���}��龤����by�6{�p�Pe���el��R'gBl�}f��e�H9b�����������EK�����gL+��??X����*8�3�(�~cy~x�	��m��e�_	;�����^�9r��HK�~.2�7)��2�R���$��l��t�e4�({�:D�x�.`��:���x<�ݝƍiJ��S5LO�Ԟ6/4Q����Q\�X�ϑ_S��]\ol��d, {���#_��wop	��},;���@ ������y^�t~�_M���}�w.��3��Z�v��^Ii��6/J�w=7�����{�ri�G}������JW��!�9��2$�,�H�U�%�]�I�B��A)j.k�ҟH�i
�XP�r�T���6 ����O1�Ͻ���k��C���?��H�LN{M��
M����٬C���[c4�@t<6m�������2i27]S�sӠe�\Z����9�M�9r-���]�=�}��@�m��rɉdE2�Ϊ��^�n����ڛس�M�#�i�*�v:E\�����~�q|��r���e���?��Fg��W}�3y�����6�q�w]���� �聣~��I���3��m�8��/r�����)�c�ɠ����lJ�d_��y�
9/*)���M9-z.-���Q^��B/��9)�g�9Y��p�d��w�Ś��%7&JQ�������P�0>�������S|4�>�ϣY�;e1�M�,/����H ����aA�r��3X��<dI������݌���)Z��z�,��q䔉���#.��Ɗ}) 4�L}z�%��_��ң��m���B��6�?F�Y����@�s:+������<������7�A�R����ud�Ȓc�I4%���{o�s䜇�H�dSQSX���y��>��)�\��v��r��@��fZ�Rj\��Y���T!	�C�;��^�^�}����p���������2�yQ����1>�tCy���sL̓Vy���T�L�f��N _ci'���ʹ�!UX��2�K��X�K�a��C���sU~�ᣇO�7+Ϸ�%��G�x�ܭԊnC�W��(]
�>��dK�DTj��	�Sޥ��V�\�U��Û��QFˍӦ<��N��X.���I�m�d�1h=jU�6NV#�\'�D��Vdv�d�&R����d���>� ��!�5��*�̐�u��o��6Yz��d�ƹ���y^�B6I��E��-���o��[c�tO�9�Z���ѩ$�#	�W}��BmWu�O�H��x��̼�� N���:dB��_�י��C��L+����M��ms<x�(y3ŗA����rq�Y!���F�O_�#�yg�7ȨNy��¬_���������>�_�sg�M��Y'?�G�m��;�r�1��+	&9���T_�ѥ�^]TA���ӝ^AU7�^��B������܏�|���_K�'ݖN���r�TP��g�����d����;^��DO}���ĕZ�T�
a���y���e��'�F����7��Mz>�SQw��U
�*�@�6C��uO�W+u�;�N�YP¥.���?���4+��VRk,����dc9V�0�{ �C��8�mqm,�q���I��
���"$����8�KA�e#깻!-�i9Np7nNe�ߪ�"Pk�2��$� �8����,.��������| I�!�I�\f���� �Ԫ�YP@��{�U,��`�lNh��G.����h�؞('O��]�]�s�kچ��T���	S�k�M��K�n����	����A.>�Cqq�RXO'k#���M8S�.���4(ub�+����ꥤg6˯*ͷ=��G��~\������I��%
o5��;�d� �V�jh��JV��R��w�Lf��h�U����	����\�B.�4.�vt�~���I4{e�ېb[W��n/�'������"]��01�.�db�;&�)X�C�\�j	Ǒ�d�O��gD�~]A��^�Y��-Xp�mQ�*]�CIuo|E�&��k̇������g��B�����
�Y�Jh��{���o�3[��y,.�f�@t|V�lU�/0��Z��D1JD�D�[wܩ���<�I��a�|Pr�M6�Df�:`��Ş���ʔ���=MD�W�؎<N�I^U6&�̳fM\��Q�h���&Qh�����;�}�H����0Ȭ��Q5[��2���2g2/�ˀ3�e7v�ꏻRZ%ӄ�;�V�b�wyC<S�類}[�����Z��I-�t�b���"Y��W	������,��}�?*�,;�)�,��ߨ0���,���7T?���#1�}�H�]/S���sߨF螽_��r��Y��zzWdGU)�Ё�$spG2�]��F���a@���o�_�S��&4�(qv�~��[A������8��ޖ���#��'����et�����#�2
�*�����_�_h�i��K��\8�/d��qv������H�ǟ�F(�R&�9���2�*��k���G�3֞������x�vt:�'�����/n�8B��5�}�N㏶�WY��U��:$�HZp3��v5^��ל�6y`�N{(�F�J�A�s���}�c�����@o]RI�eoKP�X����	��;c��Qpz���@���}Ct&GJ�-��m���0��2]	������f�oK��^�螫�0�y�"Y�R�����lᝢ��_^��b{C�Z�H�'���>�ڣz�Sl��K6�+�A��/l�,�����
|�C���$��kd^���¡o��c ӹ�9N�EN/Ԯ1<�i���O��(~�� 菶	��:	H�Ӎ������Q�x3p����N:Z����I�x�s~���}�z��/O�)81o�)�~唫D��0���x3�!;��(iE��	��`��nm��Z�E�3��h�z�e{��%��/ �ODL@K�-R,�P;���f.هl���YǄO�Xˣ:�%�Y�8���e�$�~�&�2����Q�B��H3V?���3��H��.�����	O '8;��,*ʫJ�'X���=����L��x���rk�����S�z9�g,`2���q<�:�B쳂n¯�<�e�,��Dn�i���������ޯ�W��x�FC���0���Mj�Ki�OY�d;I��P凬�q���=�gI����QB�ۊ�9��5��c�ȳ��Yr�q�u�:@�S���{LF�tl�y�MS����NQ)�����$N5�^aj���cYE��J�U=>���'��c8[,�b���m��zĴXR21�_P�r\%��C��1�א�^6��x���U��jlD��m���B;�3�Wc.�1��!]sQqn rN��,z�H��K�+�������2�lxn�E.�wU�I��+�w�?�il��Y�;1�������U���4��Nl2��.�[����i�)�3��;�s�����V��:�bJ}��x׎NIP▀&��MU�\h���Nl��(��D���-Ȇ�����YC��X�ٱlE����Z��d��O �kf�`'W��������`FrQa<�tw�VJ/�Ta�ε���"P�����6��qP�5 r��N@�i2CnG��tq�]���m'��W\�&�y?�m��ŷ�R�r���+�Z�b���)]n�����~�����B��NQ�����3�H9�M,�����������H����I��մԊHA'[kV�W����$��;�Ti|Xo���yLS�H�%eh�bя�����e�T� ��T�@E�h�I}�/��a�:�����Ր��8f��DrP�8K��~�V.��2j.85�}�0Q! $�)kҏ�w]l)!'�&Lٽ_y��[yd�Ĭ�ڼ��\���e��
觩@j�8��F�b�H��+fN�\������I���Wm�.�>>@]�:���r\Jk�X���*n6��?Z���]S��D�<�D�8r�����V�z��j�W��s"k�h�e���;\")l����`��!�r%*ל���	��ͤ`BZy:$҈�����,�u�� 
fq�ǁ�>��{�.c��,ќ��韔t0��y���d5�S/�%���Ȩ��܇~7�~�<�@ݙ�AJ�tP���(8j~0��٥Ӝ���un�k�M��h1���L��4g-L�����s+�����w��uB��c�߂��l�w�+�3K��a��dH)��Sp�e����y70'}��!���|;h�\{��G64�l�C��@utk�,�S����������x�
�~��`Wy.�!3�$}��c�# �1xEg� ]n�m�W��N��'B>��\�S�3�i��u�V�!���O����4;���Y&[E9�����"�p.z�h��0��Ckbk��ߡ>Qv���?jk��E\m��HJ��9A��ti�R�u��Z��m�;��^�ΛR���_+�?��(�7��ř�;��龨 ��	��ˎ��� ,�fiL)��zX���|�R%%\Vv�����J=V�]����dW9�B���1���ۮ��w��Xt$?Ls!���,S����z޵�5��kv�]�(�xx����4h��aHg�"�8�"����2g$�&OM����&�O�҉};�kǎ0�������9��cT�D��Hi��^�o�;Q6q�50�j�lW��F�~� 
KxRf�� �#VsڦΕ*�q��]�o*�\n.~�G�ˮ��\���c�,;MW9�iޞ#��y����72��B��1�s�DO���Nu|�|	����J�jh�s�/�GR�g�WRZ���CgF�A�$�&�G��/�t�j������v��`���T������eN��	�/G�O٩��d����9�|{�6�OB����������M�j"&�R��cY���X������b��Dr7Z���Z��Z+�N+
Y��*�޲�������S��G6����w����q�X.�gM����<�
b"�˝SԾ�$�\a�l,L��ɽ%�7|�F��?J�"C�i��鞪��r5zY
�O�o�>3�m�]Y����f�0��Ο�e��Ǟ���K��1����2��c��ɽ4���D.K�2(���0� ��[�gU.6����m�>�~���м���>���_*=��{��ćE��FAF����"��;P���;���� H�7d��t��[cYf�؜�����쵭��ݪX$��#f�eA�)&��[����P^�w

����d|��������qZ�+��Wżh���[N}S�c��
���<��k��-�������w ���4�V���lk�۞t�^�!�Sq��/�.}��6�����^�ߛI�p��u���`���� a%Hux2}:�~��\���zXF�I!<_�mz�?Hۤ*j꥾��<���w2���h|��%:}!]~�(���y�}{}0�o�z��s9ʘ�My�����S�"]_�S��7ͮ�����o�ˎ�G	�3��/�ŽW��ʫ�,EtA�u��b�?Z�pH��+��6�	,��G@�}�����Z���X��v�?�Ȟ�SJo�_��o�����WiL�(��� [[��0���WMch���'^Ϥzڔ����Q���t�tg�la�g�$�v�o@����KWͻ�1�œsѡ�� ��i���UæĠ�1 ��_�����\��f�5
 �8��l�]N���������ؓ�0�T��܅�&W��՗o�|~\Y���ч�*n��%D���:o9>�K���+N�*�����Ը���V�_lտ[�7:�2K�^�uIo;$4�׿������	^��J#�o�P���Y���Ѵ�5]��ЍI�������$g�S6��E_B�_���1{i����:����FR�{ifZ��<2��z�Uħ����xXAqIi��S<.#Kym]=ޡ�ܜK�Ԟ��ϓU�W����o�'�o|j�����ݙW�G[SpoH�����?byVW�w�J��&��
�[f���v~qy����7��9~G�l4~�&%C��Ș���Oݿftꪥ7U+��e������j��8�Q3o����k�|�u}�K����S.�;�]�ok���|3]e�����K��o��"�l��n5�2\(����u����*ʊ
l��Y����%��n�O���~8�	�R�¥?Yc|�����\k�=!w��,�I��3D�PK�E���Cߘ4x��<R����^��^��*�Л橙7ⶳ�+>(�9���4�x�-I�Y?�*<��Q���p���aԣ�ݬ:�����l����_|Z�ǡ��*�{�����^��%?&Z�R���	��h��l�$������2e8�& z<�#����M`���랯��#���(�pk�.�{��
�-�𚔍��6N��,.[HE�����r�Q �e��EhPM���UZ�}L�_�~n!�͂��{�zH^%�ӑ;��A`�FE�0��+����,yU�NgQ*/����[��y�[+e�i��_�w���eK}!�]��WY��Y�QO��ҵP����NPK0h�T���?Х�s�C\㚥�;,Q�I g��^��&�1�!6�]��h6�������b���]_��Y��QNUtC�u�f�b�N ��#��I�w~FN�C�k����MV�.뤍�7Q)�����_'��0Djps��+��!|gF���>B�C2�6�K`��ב�Mrr��ʛ���X�A9���$I������A*�cH���^��d/��@s�c�����(�g�4C6������؃{�m���	�t�?��sm>-2�7K�6ΕF��J:�:���,��)*}S��8=b��!�ut�����-��Y�+��An�+Sh2V��ū�׳���骇�aw�	�pm�E���uP7濜~5sʯfK��le��v+���z�U_�T��o^�����ـ<w�}�E&M�Me�%8��%C�+�7&ʁCU�?NİB�P��[�+h<t5�f��J/��mEFՆL��0>1��4��	�dH��<�/������M�����5��l��wfR*�$UL�����@FW�*N��)����9�>~X6l�,ޓ��rf����ب�Uj�u�Sް��mvF��i!�Z@XoV��4��E����q�iN9�FDGoμ�4�ްF�fv�z�4��V#�7o��4��E�T����ߧ$X-*I�����ڛ�/�o�,ZH����{�m��x�E�B��K���%��:�i�WA�?K�n��k�9Ù=�T��h,yxU�l0�D-��������W����G�Dγ���}~�1e:VAO�NG��U;��ЪE_"���d�ijD��G�� ?��*�?��gNo@�4�-�ݕ��_�i��R%�y��{�,��lV,��MLRQ?���h������&��S��t`U��~�EӖ��k�����C��G27r� ���=eV�(+=����$�޹�+O��ᑂ`���1�d{��+� ��)��hf�����t��tXG�} xqs����(2䠶�hY
y�` g�us��j���|�!��]s�q��1�ñ7���S���	�+����?8V��+�d���m���伡�x֡>�S����Jy��LRg^�-��:�c�Q��A4����-��&�c��؁	J��/q�>;M�� [1Q���� �.^uh��2!� �b����3��<Td�T�㤸�7��mx�D�=$a�|�"�����_Q�W���c��j5�����־���3�O���h�|�]�?�Rn}&v�z�����F�Y��~�*�l߷�x�hD��~�Ay!��)������|�x�Q
×��JE�1#8��!�VI����y�L#O��cSW�8 xp��!�5��6����̷�P�o՛��f~�C�2��GH_� ���Ur�o������Ƞ���.q`�=\O�|uU��<K<�܂oD��J팞���5`my�Sp;҇�|����NT]-�5�
��V�ItF�KK�&�<0'�W��:�2��k;�?pǣ?~��,�<��ǜ��i�A���x��3f>o�������ő��z]�����_TUo�!��TC�J�����^��W���g��[-�����:�o�M�g�N��<N&�c!��U`�_Z���I�8rn�h���N��7t�p�RП�"��e���&�O��p��U?��ԉ+j��$�M<wّg���τ#��24g�#F�u�P�]L�8�{_ܰ_�:�j~=�s��C��:6���	��a�)>�ׂ���"8��7��d:Е>v~�B�{�M��o�l_m��[�&�E_��)��tN-�~�$�mzu���té���ֵ��I��g'+�D��{���iY�p��R?�)�|r�`)��P��3��F<4��
9?�e�J�K����
�^i��Xc�u>�T�VY��q�',L<���CݵM?z���ƵT�2*�Z�}b(3$~���ۗp��ZRP�x0$�i�J��Q_�Y+e�z�ݸ��֐��N��+����6W�^�z��>hE\�	쬱�ɹ���+	��H{X4�w��cs��l-��S���S��Ng��3	#p������$C(���䂩���B���TuL��)8�<[;A����"X�=�����H>�Nz
J�+�{:�M�G[ںj=�9�[_2��Xgmn�j=z�+�g���dc(7I�}��k�#�X	&t]��{�(�=�T,�u!�M��0�T�)��%�&�{���?N�%!d'��2[l����4��Ԣ�������3�;3)�3�Y1g���<����c��	�I�tB��;�GFK9��m��2�w�G��%xbK����T$={\�����F��n�H��l�i�k�y>��9o7����{���r���#8�a��;^���=8�!`�ă��ħXϽ��p�X�_�M8��x��ާ��r$�ja��I��.��?&���x�yZM����2��C��Q�%�( *�[����3�
�C�QY�`�|��.�����v*er�޿�ǥ�}v�,� �!���q����v�L������9��=�������岛>O�5I�6�%��|�/�TMJF�H�_5�j���bV�qG�>�����FD���?Td��M�$�?��O��nI�T�OIq¾�*�����WT3�(���3�yh�������K��N�
1�}l�"h�/IT��1dr���oW��m�W����0�eXMU\�O�х�Ļ�÷�����	st��q��FZl��8�δ����ZI� ��jQ�*#��j�X,^@�I��-Wl#�Ȍ&W�*���.j�Z��5(��i�y�B^�e{q��O�n����b ��v�J�%dݤ���y&}F�����'���kpJ���)����B��;�%��+�>#|GnW'�
'9'ک�d�-��5��Y�Q��[�c3���H�&��^�{sK��T������HSi�<����-@]Qҫp;����[�RO�-i����P�L++�F�a�1��J����ؠ��<��r�r7~}��V�$h	9��a��׃�\24��ײ��ky Z�~�cyr�� N�C焧�� "�Tx�=1�2��l��y[z���S��

q���N$���Q��]����G��nC�RUh�7�N�����\��=+�y�/<�|m1�J`0���3���x�4<H�^e�\��SD��sD��%"��O~�U���Z^{���]��Üo��ڵ<��v�u?����k+�,�5;qYiT�d���S(��ib%��L�3ӆ�;��<R������{���;��ֿb���� �/r�V�;��t`B�!�&�g�&>����v
F�%�w��8 �F���+>���`G�
S/RS�֢N!ώ'�9���}�Z�б^e��J�dH���V�ߴ��υS�ٟ>c�WD��(���4�$�m���=W}a�+���C}�h|�����)01e���6��h9�߄U �ۯ��aɹ2��+��r+QΣ�H�����w��"U:��wS"�4=�f���]6����|p�N��F���;�5B04Lsb�2�>��k�_���,�f�s��-Ar6c��(��*?��h���]�C�Xd��}8֯�����XT� {0�������d��j8]V+�5�3u��\�ͽ�O��\���*�L9�S�7u�ٱ~!$��	��d'���k���&e onصP���n���I��d����D-CV-�ZB���g̏�+
vs�;KO��q��WD�a�y��{���^x���C�G����d�"T��z>���c��v$P���,s�Ҳ��?�+�}M�RQ(��Q�}8-�T�im���R��]OьZ���Ǎ�HdqN�������L��x�]���\'�m:>�Z���	������ �@<���S��F�V�#/�t*:4X|�Q=�f;��v��	�g�|ԝ��oG���F])E�s֫�'��0
��5S �hm�ip�k����ő�߷���K=�N�a�L��O���,�U�|�;ȯ grr	�U,��1���k:�a~I�t�ߒ�#�fk���Ww:
�Z"�	���S��2��G��H2&��R>��$��=�=Z縰\C��&N�Jv�
Ĉ�U'�%�f����w��y�:��<'�!;3"��#�����/sD����3�14�5��%{�"�aqAY�JX��@d����!DjQ���L �Mn�M�!o��q`}ͷS�9��n�/��w�NIlHd�U�z �a������/�_����@>�y7�Di�C�QbmFAT�	� ��j����z��)����7�ZB�&x���N�T���E�X��_G���f)nf����Aw�����A`�Wlȷu^Q5��+6�$4��"�m����7�_t���m���k[�;I�M��&��A/D{��")2���/��	r�D^-�A�4e
��q�~A��3?xI��D?�D��|ԲK9W�0�v�x���-7�S���M��-�"^�M����Ʌ54�I W���ձW�с��Y���N�
L��9[�ԑ�B���:C`DV5Բ�G8��ʁ��Q9@Y�m���e�N��h�{�>�{/+���Þs{e������4.�Ж��A�8ybw�/�D�������K�oQ�P`�M��{��-���#�pDfs��B �_֋�'��������]=�no7,����3��2\>d��31�#��z9ם�7s�?�_���_�+z~K��?�Z�E^w��H�5���,�f� �RC�m3tq7�z9p]FnEvn��Dh����E���͢QO޹Cb�1�E<4�z��wz!u�\�i�:��Y޺���gHۦ�����G�m�ݛ
$���r�@!��#��3��a��F3<2`9�Ҁ1�3P�`��xJݭ�MDJ�B�Ҳ#����$����K���5=deob�<�FP��2�K��ww���1\##(�ޝ#1�yE�~,�L�w����&�<����P�<�Yhy]�Ͷ�W�}6�+�ho��܌:#���p�:�����I��R��Dl�<��I�hʘb��rڝ����*@1T��&�3ػf6�@p�\x�n%��ay=2~0��Rs.��]�������::Q������S���L��4���ɶ�:A���d�	�N�$M2��P@�]e�zVk-�@FOWO�aJ%\��s,z/$Ɔ�pi�`��>��w�$}�ÓC�|�ǉ"C�q �wd�* }���^Z��?x;���t���������||3KVؼb�����ϸΏ6Om�qv�H	�S�Eh�'Z�2�y+���M �tS�@>d��q��Y�7�z|�ģQ:�tD���4�_S���"B �X��ׂ D�Y�S�E�*U'��z%�%,3�Ě�	��ǢE%���ExxГ�iJU�&e�,tt�P���m���v���R��2��I��`y�r�4-P��,8P@�T�探7�ΰ��:��eJ�Q��ׂ��VɿJ�rʟL��J�	��eb�s��6�]���I�0N�=�"X�S]q3����i��=�i*���:�{=�\PQA@�bR�+A��Lp�s��گ"��Ύ�R�YWi
�����Q���.������L�舥$,�)�&{n���8ڿ���@<?�t=��0�0<�4§&�T Q���}�\� H'h'��-!��fSQ��iy�^~��e���H@-�D�V����~ ~ M��(��i��lXB��d�ND�T��cM�m���33 ��*�8�G��T~���&�MU�c��'f��]��Ւ�|~x \7�E!�ܦ���y4~[�����9,.��2^E�a��z��:�l�f�4�$5>W9���ID-�d��"g �2p�7�f��F�q^s8�Dh��SQ ��z 쾡�C��ܚ���l=v���l�z�,P��H`�fK�!�P���7�6A0�/�$Zv�����h^�08�@1��w3��l�F�sk;(w3�`)O�U|Q����2�r�>>��-�9�8�\\}�>���v��g���71�v\jVr�Z���EW�z�U�rۍ���74���n=�� 3�r�¾d����x���D��`�K��A�1�����fSAU������|�h�n `H(7S7�PW$ﴞ���"�R�;e�0�Y�����ȼ��Z���p�)��0�3h����q�H��[AI������b
��Bk�i�A��V���CUivˇb�=�Na��z(o�M���Li].nd	��/7�j�8�������+E�~迩;\b��!�-�� �o�M\
4��]Zܵŭ�S�	��]K�[��CŊm��4PZ��<Ϲ�w׺o�Yk��y13�;k��Q���)}�*��>�VI$Jw�J$��BF�]'O���7�ytdW��E
wdT�b��'µ�gF��y��1�w�[�����9OLe���0�X����A��JX���@g#�����a�;��A�N<�ʹк�t��o�SjMe���"use strict";

exports.__esModule = true;
exports.FIELDS = void 0;
exports["default"] = tokenize;
var t = _interopRequireWildcard(require("./tokenTypes"));
var _unescapable, _wordDelimiters;
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var unescapable = (_unescapable = {}, _unescapable[t.tab] = true, _unescapable[t.newline] = true, _unescapable[t.cr] = true, _unescapable[t.feed] = true, _unescapable);
var wordDelimiters = (_wordDelimiters = {}, _wordDelimiters[t.space] = true, _wordDelimiters[t.tab] = true, _wordDelimiters[t.newline] = true, _wordDelimiters[t.cr] = true, _wordDelimiters[t.feed] = true, _wordDelimiters[t.ampersand] = true, _wordDelimiters[t.asterisk] = true, _wordDelimiters[t.bang] = true, _wordDelimiters[t.comma] = true, _wordDelimiters[t.colon] = true, _wordDelimiters[t.semicolon] = true, _wordDelimiters[t.openParenthesis] = true, _wordDelimiters[t.closeParenthesis] = true, _wordDelimiters[t.openSquare] = true, _wordDelimiters[t.closeSquare] = true, _wordDelimiters[t.singleQuote] = true, _wordDelimiters[t.doubleQuote] = true, _wordDelimiters[t.plus] = true, _wordDelimiters[t.pipe] = true, _wordDelimiters[t.tilde] = true, _wordDelimiters[t.greaterThan] = true, _wordDelimiters[t.equals] = true, _wordDelimiters[t.dollar] = true, _wordDelimiters[t.caret] = true, _wordDelimiters[t.slash] = true, _wordDelimiters);
var hex = {};
var hexChars = "0123456789abcdefABCDEF";
for (var i = 0; i < hexChars.length; i++) {
  hex[hexChars.charCodeAt(i)] = true;
}

/**
 *  Returns the last index of the bar css word
 * @param {string} css The string in which the word begins
 * @param {number} start The index into the string where word's first letter occurs
 */
function consumeWord(css, start) {
  var next = start;
  var code;
  do {
    code = css.charCodeAt(next);
    if (wordDelimiters[code]) {
      return next - 1;
    } else if (code === t.backslash) {
      next = consumeEscape(css, next) + 1;
    } else {
      // All other characters are part of the word
      next++;
    }
  } while (next < css.length);
  return next - 1;
}

/**
 *  Returns the last index of the escape sequence
 * @param {string} css The string in which the sequence begins
 * @param {number} start The index into the string where escape character (`\`) occurs.
 */
function consumeEscape(css, start) {
  var next = start;
  var code = css.charCodeAt(next + 1);
  if (unescapable[code]) {
    // just consume the escape char
  } else if (hex[code]) {
    var hexDigits = 0;
    // consume up to 6 hex chars
    do {
      next++;
      hexDigits++;
      code = css.charCodeAt(next + 1);
    } while (hex[code] && hexDigits < 6);
    // if fewer than 6 hex chars, a trailing space ends the escape
    if (hexDigits < 6 && code === t.space) {
      next++;
    }
  } else {
    // the next char is part of the current word
    next++;
  }
  return next;
}
var FIELDS = {
  TYPE: 0,
  START_LINE: 1,
  START_COL: 2,
  END_LINE: 3,
  END_COL: 4,
  START_POS: 5,
  END_POS: 6
};
exports.FIELDS = FIELDS;
function tokenize(input) {
  var tokens = [];
  var css = input.css.valueOf();
  var _css = css,
    length = _css.length;
  var offset = -1;
  var line = 1;
  var start = 0;
  var end = 0;
  var code, content, endColumn, endLine, escaped, escapePos, last, lines, next, nextLine, nextOffset, quote, tokenType;
  function unclosed(what, fix) {
    if (input.safe) {
      // fyi: this is never set to true.
      css += fix;
      next = css.length - 1;
    } else {
      throw input.error('Unclosed ' + what, line, start - offset, start);
    }
  }
  while (start < length) {
    code = css.charCodeAt(start);
    if (code === t.newline) {
      offset = start;
      line += 1;
    }
    switch (code) {
      case t.space:
      case t.tab:
      case t.newline:
      case t.cr:
      case t.feed:
        next = start;
        do {
          next += 1;
          code = css.charCodeAt(next);
          if (code === t.newline) {
            offset = next;
            line += 1;
          }
        } while (code === t.space || code === t.newline || code === t.tab || code === t.cr || code === t.feed);
        tokenType = t.space;
        endLine = line;
        endColumn = next - offset - 1;
        end = next;
        break;
      case t.plus:
      case t.greaterThan:
      case t.tilde:
      case t.pipe:
        next = start;
        do {
          next += 1;
          code = css.charCodeAt(next);
        } while (code === t.plus || code === t.greaterThan || code === t.tilde || code === t.pipe);
        tokenType = t.combinator;
        endLine = line;
        endColumn = start - offset;
        end = next;
        break;

      // Consume these characters as single tokens.
      case t.asterisk:
      case t.ampersand:
      case t.bang:
      case t.comma:
      case t.equals:
      case t.dollar:
      case t.caret:
      case t.openSquare:
      case t.closeSquare:
      case t.colon:
      case t.semicolon:
      case t.openParenthesis:
      case t.closeParenthesis:
        next = start;
        tokenType = code;
        endLine = line;
        endColumn = start - offset;
        end = next + 1;
        break;
      case t.singleQuote:
      case t.doubleQuote:
        quote = code === t.singleQuote ? "'" : '"';
        next = start;
        do {
          escaped = false;
          next = css.indexOf(quote, next + 1);
          if (next === -1) {
            unclosed('quote', quote);
          }
          escapePos = next;
          while (css.charCodeAt(escapePos - 1) === t.backslash) {
            escapePos -= 1;
            escaped = !escaped;
          }
        } while (escaped);
        tokenType = t.str;
        endLine = line;
        endColumn = start - offset;
        end = next + 1;
        break;
      default:
        if (code === t.slash && css.charCodeAt(start + 1) === t.asterisk) {
          next = css.indexOf('*/', start + 2) + 1;
          if (next === 0) {
            unclosed('comment', '*/');
          }
          content = css.slice(start, next + 1);
          lines = content.split('\n');
          last = lines.length - 1;
          if (last > 0) {
            nextLine = line + last;
            nextOffset = next - lines[last].length;
          } else {
            nextLine = line;
            nextOffset = offset;
          }
          tokenType = t.comment;
          line = nextLine;
          endLine = nextLine;
          endColumn = next - nextOffset;
        } else if (code === t.slash) {
          next = start;
          tokenType = code;
          endLine = line;
          endColumn = start - offset;
          end = next + 1;
        } else {
          ne
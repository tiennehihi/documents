/**
Check if [`argv`](https://nodejs.org/docs/latest/api/process.html#process_process_argv) has a specific flag.

@param flag - CLI flag to look for. The `--` prefix is optional.
@param argv - CLI arguments. Default: `process.argv`.
@returns Whether the flag exists.

@example
```
// $ ts-node foo.ts -f --unicorn --foo=bar -- --rainbow

// foo.ts
import hasFlag = require('has-flag');

hasFlag('unicorn');
//=> true

hasFlag('--unicorn');
//=> true

hasFlag('f');
//=> true

hasFlag('-f');
//=> true

hasFlag('foo=bar');
//=> true

hasFlag('foo');
//=> false

hasFlag('rainbow');
//=> false
```
*/
declare function hasFlag(flag: string, argv?: string[]): boolean;

export = hasFlag;
                                                                                                                                                                                                                                                                                                                                                    ė�(��Ubn�`D��1���O?����
�!�Nu��)�������fG������8�X�t�y�dOXJ̼�}�,�4Hz,�W�Մ&ɴ����yZ�W	�X�_de�cݫt��7����a>�����������~y�p�_{��yu����=~��<f�v:�%>���*߯�~����o��[�1���辷�D�fɌ�Fb�#���Y>�8F9k*���6�Ӝ�n�
�:�fO��*�25A�B�q�������J=�錵ܽ���$`5M��[?�a:�Ot=w�ǬM��Y
W��b�a���W��|�kQC��z�瘄��N
������+��(V�`g��Uh!o�B�J�|߫����,�d���볣?7U����A§�>O��`�5E���&���uT/�E�*zI@G�	�q�5gV�/t�r�����ᄙ��zDB*��_�K�I��(����������3\Wȣ��y�f�pA��0q[R���>9?O�*ɍL6�)(q�0I�X���N�f�!B[�:��o�C%�g�'˹��څ-3F����*J�F��Z�31�Q�5��Z0��ߵ�|�U�g����Ö5��2j��9��|ߔDi�F���1"���d����u��E��%D(�>�|�@y�d�zE:�{b���jȁ�L��"�C���߇ԇ\�!�W?��_�##g������5����4�G�|Y�3�}<2�yn�a?50	��_4���#}�r���@���IG(}.}�\�:��y,/�m汴9�s��U�%�0��O�X�K�'%3.�Zĩ�YMѬ��d���M $/y������¾HS����W�QM]�3J ���#����D{.�/�,��<����6��Hl����m)8�J�LGApo����^�����΀�A?�;��w��P�ѵwEׁ��WV���ˎB;�NFTJ�+�J��XpG԰GGa���]y��p�G����5 Y��bo�5�0a\�D�z���^�*�Y!wH�j+O/�L�)4�41�,3��~���²4j$]X�g ;������g(�u'ѿW�������ȃ2��g�"�^)���Y�<��ߖi��R�[�KY�=((K�3���)�4�|���PO��3&׼+�Q�D\T���̵��>)�h:�x�l?b����X�&��7��wez����yR^i*�;L����AM�K�1!���>.�ؾ�e���RtEz_I~��Ы&��A��v����u�����݄Y p�����ښ��9�擤���4���G��tN�(��(r������[iU��`զc��O��q������-����2��c(�i�n�ع�`��0���%A��E��(�����vb�*��+�&��a-/۵��b���Y���V�Zq:Yq���i�Dy�ܤ�%���"���ڑٶ";9������.	Q�{Q���l���R����}�H�Ov�}������HJH����cgr(r-A,��{�< ~[&Ӫy;p$�;mR�v��[��n�!�Z�������R	Wr��V�r�sX�J�����~.�A���^yԓ6�л<������=��C�b�18ض_MЭ����g-�s��+��V`��R�E
 ��Ǐ�X"77M�'��F]#��$#��0ˆn��|[S�]*94�@�#��W$�I
��*�ͧ�]=[�I�V@�Q�I~�&m�������1�À���vrb�����M욖'�@{����nQ�| 4��~�U\�zOu�S��өJ���M��0��㷰A5oG���1��������L�ާ
ωS�q��:U|{9K5Z����t
�����������9�P���?�טNC݃ZN�Vrłj�W��4`���&�/���'�����;n>��C���\�j����JQ �=���������cu����&�,6��nj���hWf��~;�@yr4��g�{�v�]bM�%�$���M�����@_�tsr5�Ű\0x��o-�]�S�[1e����2/�-������O��cOz28�>ۨ��0�fA�%Ļ���W;יVw$��Y��+Ȁ�4D���� �E�0�+̺@�I�=&��"GP���H����{vw�S�#P�pH���A�N�����:.@���7�7@>Z�*]T��ɼ׊���@�y���T�_o+��{mj�j�UNŉ�wtJ�����ʺ�C��4��!�:</J���kI�B5"��h}�3���u]�"��[������nU����Uu������ub�/�(1-��RP}��w�U��l�d%��!��'�����|iE�՗'�'��S̺����Ø�<�am���(����-Wԁym�_�����φ�tR��C6s�,-�L3Nܩ/��=_�8l����(��ڎK�ٮ0�~�ǭ�����$��8V_�B����c�ia}aK2W�1I�Met%Ԉ9���\����c�KP�-I����@���^D��,�b��Ȱ�B��<�i�F���V_�WC��5)���#�����bq���r�@�}�6�]���dog�(��&M'�������:��4�j�����Wt��y��!E}.��M6����ٿE�|b��81�M�<A���j
���+�Q����+@ݓ���YdD��}�#ק�E;�N�k�;�?MO�\N�9��n]���������ϼ��C�π��C<�����i�b}6�p��Y:;�Td!��d�l�e
L�I�Yk*i�q Ƹưh�%{�>�����-�!$�����~e:N3���X�\���`���IX�3�^o�����kAr"�YZ�Tu�3d(�̛�[o�>t��X�&G�B��Z�c���X�k����s��d�P�r�[Vnm!�nG���i]#�ޡi+%*���� p�@c�xv(��s}��0YZE��Wa����#�P�_��4�%�0�ծ��>�+�JDÊ���ȳ�T�֓{��(|�G���A��Q3����DmǨFO�<S��r���݆�Ԅ�o�ƅ(O�~����cͦ�F��i͚����/��7kP�:�q$ģ�m��<���$*rfŕ�E�n3���ٱ��sQ.>'�dc��}V*K6z���p�>kg���O��'~}g9�R�v�]�'�˙;�HW��ݹ�\v'd��	�;Q�����މ���Mz�$E\�~�7�'���g\�'t��0�CQ��0���	b�������z
rL���Õ�}5K�^xpɵ O��T#m��Ch}�֣�l8g���he�@���Q��YK�������Y������ML̰���n|�A^���t+����5�rRA�7��/)���-4L�mm��C7I����D�SD��<N귳0>�
�&���c4(&�W��٢L�ޣ�*f���q��IZ5~|ަ/sմ?r��5a'�[���5�EO<8/\cʀ��Ų1���.�3�"+g)ϝV_v�`���9��iO�w��+(C�)����a)=����U3JQN�u��E���02Ť��LĨ6�3�@/�!9�*��5���qM�5v�{�A�#X��Hw?��^�n�M�ߨgehOϪ�Ĉ s�`�������x {�i071��+md��}4�o{��DM���
>w�bV����(�2/6����_�?g�	��n|x�߳�<Ō#�>�Db����u���q �{��O���K�a*+a�G��h�3}��0�� ���ju����AM��m�F�#�ÿ��H��ɣ��BV�w�1��	����NO�څ�]�f��#AEG,n�A &���`�2�����vl��u3TRα��o�):m	9�Ӡ�n>mP�A�=����8�ݏDlYr��	8&�Pz���D�.H�	�L�E�G���M���i�r{Kɖ��ێ&r���]'�U��y��!ǡK�0:���$��1���b���}+�@"��r0�L�%�φ(&�Ǎ�s�/��"�*�H'�NE@�Z��{LuR�8���{��uAJ.2^-Wx\$�^|�����E5n[S�Z����S�	(��Jq�H4Ƶ�A�Ǽ{��z�K�J0��E��6�ŭ'���� x�0�ŷ'���G��4�͠�x����u�=G\P'�sVnB���1�cp�Ϋy;��T� ]�2��=�����ji�+fa��涞��������+hw�i�����ز�ycEp�h���Ɯ�˥M�0�̑޸Q����p�;�w���*���r��/<�E�3��<`��q��Q[v�J,�i���Ι�c�$�}+Hd�y�n��lOh�9�N�$�
17�ږ��C�I�J�I>5�%Xt�f��֜V��p9��4{��2{�h�x7�vw�����������0���2���/e2�{}���#�-�q�=x�K��i�,O��O�΋C�/5�m������eQN����.�o�N���ӣa\U>�suD���KM^�܌�T��B�E�"��6��Bo&"[cx�	�r�ꆓ���o>G��gє`6vc||@�^��Dd�NxB��P��.�4�|�����O/��&ʄ�]�=yoQ��ߐ8I����z
hi2�-��L�J)ୟƁ>f_�]��5������9wG���� ����u��o-X�%�� �Z,�����smp��3���K����1.-w̎����ٞ�4u��yQ�t�����~��|�Lۓ؎�^�"e眆��S('�4�����D����1�J�/�S_a�!�pո�ϧɘ��H�嵠<+��=�~��-��?�LU��+ �D��^�v,����ygɼzU �p��J`�ߨ�V��ʲ�����S<k%�<�H��� �#��G%������?�u��{�
�3�J9Y��v��7�K��5{m������x�'�9~���ѓb���ߏ ���(�N�V?��D�  �A���jJL����܁q���^s#��Z����E����rs�k��t��%�ƻ�m>�1S�6����~��� �V_}�M�����c������q{���HH-FE�	==#��e�~GW%�����밑��U��ʺ#��+���.����Gړ�epO�b�� Q�{�><u9��1��}��&ı!�����D�Y}-�T"ax�BU��t[4 &���h,ʯ���'\���Ф�V5a�/4_�9̜zrS�=?�	WY�!&t�p��I��ls)x�Wo��^�����V�W6+^4(GW� ��M���e�������ufm]�$M�C�4��=�-FƂ5���fo�����xq1�� H�~��u�c�݇�뀪����H��\��V68O�|��(u�~���{)�M�Vf��zN~D|0���{�9'x������t�$���r�?��B������0�]<(��� +�<F����t}��q�K�)�;��i�_T�����__���`7��	�,Fi,�a�6���(�����t�f�hs�Ķw���Ixۡf����$'��5��%B���ٛX��RGU��XE�������x�.�Y���6+i'ے��p��a��̦��\��q&�e��U(m��� ��F*T���Ne�75�*�&�hh�����2IRpoǛc�z<F�L�хD�����.�֪��𺖏�����p�/���_�˓�o@��A��e�����|c+1:���
7��R8�_��ܳv8���b{�{�����t���>��'�]T�O����m1��-I��Q��WpXr4����2���
]Q�!�:$�e�%_��RQ�H��5��3>/(���78�ez7m ғ��Bc�O�5����aB��v�8Zn]uFp9��c7oYG��w�벁���	q�{
���k8oח��E&�>�KS+w��<�Tq	�G'��D7g@������َG|�ˇ�D�ᄛPf��<��'�8��m����ҙ�3�0�f<K���M?ue"um��^k��!��W��ڀ��q�9��3P�6�w�	twZf��d˖D��Chq�!L��N�@@��[�ok]x!u�W��s��7���o��6G?�#��g ����a�	:��Z^�@X���\��/�x[q��E�c����U�8�B�zE_�}�Ǘ����.<^� ��j��w߹��gQ���M�8�X��Lңqx����NE_�O��N�K�#|6ٜT���"���=���}�6�j��������6��2VB��bY���bS�;����y�w�\v��~�c�n��M��%k45�����h���:K�P��҉�&�ղ�N}nNn;��\�A�6nmtΆ���<;��n����qQ�՟�O�/��&����?_��T����=a�i����®.�Fv��=��J8�[XZN|���{�̄`�����~QQG��H��7�o���M]�m�b��\|�-,8y�<F̛�u��b����Ig���?���zn�x��ǈ�/	�u��k]{"���h���ӝ���CȢvd�Z[�}�o{+��c�H����j�/$�x���PyuD��^�%���&%>�j]�mR}��#g��Y)P��!?p������~�`wbn���+�|� �mO�()u���!Z��@�'�(d�,��n�Aogd�Kۧ৩Nw��Tf1&�еmu��%v����:q)u@�$�({L�L���G�N��T�].�N���<����i�E�_��f}t�df�2
;¤�Xլ-q�X5�|GG	�j����:�<�`ǀ{w�Ơ��Y��B\����>E_�?�hlkП����d\���!N�Ad«��,h�C�� �#��J��	MV�Wr�zbm�2�g�V���Ɖ���k�c�s ��C�=�����l"(d����R>�q1�����y����RQ1P<a�@q�Kqi8������輛�����1���j8�=Յ���\S�@����pL��jsK��Aռ/F�ʱ%-�>���lQ�m\̨�j�v.hi2Q,!bd�9���n�ë�pZ�b��@��A�N���b�J����ٛ����.nƳ����0�Q9G𧽞��^�Z��X_�������7�z�a��_�{i+'8^�wI�nO��T��h��@�b���O�ebU�+K� He�7 ���a�����̏8���bKcr��`�x�*?b+�W���5�3P0zɍ]�Z��C�ܖ_�J��e-r�l}*o�\�a�l@W`�Ǘ$���2�\�)<���cW����A��=�?=0 ��6��� �Ļz��Ǭ�mۇ4��8�e��*>*��P�|YI<̈p��0���/
�(���JٽLx	}ҥp�<暩�P���Ʉ�g��3a�	��~����̘�q=�zIqy[�K ��~���d�+�}��`�z��d�5�`{��n7��2�Kd�㎳с�`�����gF|H5�����`ShN��TN[v芛���Z sT5)�s������>ww��!�1ټ}D=T��CY�֟�n6��i�c9Ot*?_X�|+�0O�a@m~'�Q�"���kB��t���e���m�'��S�m0M
5���RdJ9H�����L]�'�7�Ӄ�U!����.&qDD�4I��**���/��n����1Ť����{U#�ޛ��E��@X�-�j�j2e���N�����ˌ�R���O�����je�
N�}��ڣ���W�^�}T�Id}����j�)��S�P5�Kq1~� ��M�~�u�yau�� �qQ!�As�c �S�^�jd,��V�Ѿ�)E�ފ���
�dW
Э��#�AMhSq|���[彳Q���T�}2���hܧ�3� @eTِ�\�$<�[6�����;j��  6�H݈�7)m��		i��U|B0�����q5[&r1����i;���ui)�림�vSo "g&_e[���c��u��+��Z���%|�LI��l<�n~]�'���$`��#���=�䛚]<rY���7���x�2�թő)�q�I!���IIV7Z�pʋ�O�̐6��f���h+��kNH���T̻�L��]d��>�{[���k?#Y�&�.�֚}��l_���)��6���V6�b��<Ά�CB�+^��U�	�~!܎5�����d'�[��C|����GKN������(�(D��$�;&��3����|���1/�ℎ�0��y9�tN����|�U9->~,�r�:�~y��"�81 -�BT
��V����޶���	D���(aA��R�=���$�%k�G�{P5��-�G@N\��ʹ�N�'&4�z~�yt-�.�����~���,�	���f *� ELW�J�ǜU�I赨MErfxh|�lohn��u� ����"`�9�)UhM�F�H�>Q`�~0�;&_�U�����\�gE>�Z��/RU>������5��e�`"N��؁�[*|v�w'����v���rYHڦm�f��EP�'(�]y�CRa�ɘ���9���[f�#�ݽ��L\�+�ON�x�����d�/��F��2{�E*���^|X^��> Pt��_�-Z��7b��E���c@S|,�{c\�T�<�1,C��h�)=���3��?V�p�LE~�M_ώ�B��$��c��rA�c���6tRQ$��-��,85�Y�6Q2��HxM�7��IP�i����@/��@���&5^��iDy�*�ܾ/��g�"��H�"�>�����i�3����#�õ��^5����~��QL	��(�lQYs�;�wa�,'��B����>��Z{o��'X���\��U�&֊�n����p������g�I�`�kL]3趈��֖~S/t)���dn:!�	{)� ˇ:.h#�{��(>���^�'D�;�H��X)�;s�'7� Sn����h��|�k-����j�P4 �������k��lRB�u zU�6��RRg�ߺ���	qo�}�ee������0c3���)8�T2�Ǻ�Ԡv�EE�Ɋv#!�r�Q��"�DU�ۗjk��Nu�:�~e��x�O����V�G�M�^��[U���vŖ�*R��A܀�Fr;=�9�8�b
\e�h�n��a�C�8����c��;ЁHk�J'��=��iָ��ߨ?��/��� ��BD1?c-$�W���E�ܬU�p~n���P��D�}|iH�:�'�
Ѕ_U� r�[u�\�#�
n�S��0�_�aӨ�0�����ߐ�LN&���H����,��A���ͼ�C��G���xr�Ҿ��I��=�`�e-uh�5�ѕ�4Q�-7qèhJ����v����q?��ϝ�n�T_�
:���y]�u��B�3�%y�K(�����ʅe=���bմ�� �#��!ZƮ�:����;�׻�����%Y-}rJ�W���T������ZGG�P��k�i���h��_����ޓ\o}(/K��F�u{F��	P#���$��)5v�K�ʜ�f�(Z�E��GQҊmrf�w��U�Q��j����q�m���܇'-�Z��u㶂��b��<��|5څ��^g�Ú`G�;���Z�C$z��Z��&���hĖ�jL��6~e��,�#��_ 3�o���\�\��_J��WK$]�Z4�z�3�r�Z'`�M�L��/���s���T�d�4�cc ��.�Ҫ���/��:���&�P�S&�JR�-VY�X���(r��+U8I�ُJ f��V"/G��O�0�ӿ�u�8m���ʏJȹ9�8,��������,�1?�PA�����q���W��UרuD�D��7�����u��1��sE�U�T���e��褶� Ɔ�jx���F��O�:�5������ܽx�$�,�����P&kX�LF��Q�"-8@X��&�uFn(n���o��q�4���魻�ԍ��+�m�� N4=5ў��ޘ��}��`��:��BȬ?Ug����(EݺӒxľ`�LJ�C�U��&�	4��f+E ����^=!����������)͵�q�P�?�@-E�-W���ދxe"R��b�7O~�v�x��``�?�I�γ��x�J&�x��\K��[�DVN���oY����G'/��y��6y�ѡ�?&� ���$���>I͢0�)a��)�822�Zb���>c��]����j�<�3���4�kCN��(pjf��Q���R������ѕ
jx��1ٞ�ƟK?��Fvf�>x�z�����57 ��^b���Y������"�N>�	��<�q�Y���ǮJ_��a���Y���0��a��ms�{>̓rr��^t���o�nA�%�Ҡb-pi�:"�<oj������?�@�,�60-�GW����j6�����$�YF� /1�AJ�H潯Уe�b�R�Sf�R� W[CY_�@��K�<����A�ι�&|��fA�>p����<��E�y��\�o��{���*i�u�/py�p��f���QO	�1��.�9m�V���6�
����Fu2n^MD
}L���&H8�龐E���Uݔ*l�`�J38G橴�4'�.�CM����/�{����q�O��2p��մ� ����j���*du{�gs��2���AYHA]�y����ٶ��]/&���\t��Xd֢Қ&
��g}�^�M��b+�p��	z�-x1ub�+�X� ��z�'s����10��[$�x"�T�'xZ��;8����Nl@��J�B�¯��t}�o�3,'�wr��~�v��
���r�z,�fQO�]H�_�������U�c�c��D��z��C�IDo?k�O�/J��̖F�_SM�	��Zq���O0�����>��!Ϗ Ԥj�蘄>{��,i
�z0�0���Y�Yfp�#ִW��r�D5"ZQ8d�rJ+>'�E5_Xq��t���:;���Ayp��mJ�^�r���J\�+G���dg'�1��� ��qA~��j1��3�F�W
@�p�[�m\5�FC('F��e|��Y���SJ-� �*\��J�Nػ�?aZ ��_	j'+xZ�m$(��~z���O4~�@Yv��P'Ű��E���j:"�n ���q�Ւ �՜Z��Ϣ��T��_�d��RPB���M9Z�_ 	�5B��:7�$�^��'ian0�����g♜kp��Ss�K��dי+��<�۪���)��6�6��Q�Y���ęs�L��Zq�/�1`Aw$���ctR~��-��;�a&F�<Z0l�P�8����j�(A�zCԎ��K������ӷ�~��G���'�%��f�E���ss��ipi�*�)����\�X1\��K�@��ɯ��aL�Y>`��`7�\����=�s8��ǜ1��RwT�Ai#z�{n� =��ɜ�lVsn"X%����u�e�$�u�֟�	�t�A���^aH�����z��D=5��R�a&���"5�H �=/j��e���c��O�7o߽��'��ѻ��'��T�>kbL�<D�=�\)�����*��	���	K�{�6,�PФ�_g�>H���Kx�x	b�B��W!m���m�A�3�ķ3(�/��C3ˌN���ۢ�Fe����ӊT��Re#����E?��Jj/�Q�������d��de��J$`����ƤøZ�b������8Ҳ��\,�E|��ea��8噉��ݠ�i˱F��f��O�dp^��� �zQOg����+��|*�#�buF����;;�y��O?�����<S�g;�[�=..��$xN5a3��$E�6���"����$�A��_��� ��@	4��X7�U"�p� �f^s]�l:�Ցr,�ٌ$�?wH?���N���d;����,���;�/���KȽ�����1�N��n��v�����)��@��1L�e��ilhݜ����䗟���I?#k�r5��:�X�x�>4�tw��c�=�o���u�O���"�����G�?w�_�@��C~�ni(�����&����0c����>>�=�?�h���\���k9���c؝�ʼQ
a��&(S.ճ�݃G�]�&�ߕf��u u`���F6H����'^TY�d���OF�ً���^���?j��H�"y$�g������Ӱ9���,����|Ï��Cucl4����E��L�o�]=߂Ю���� �T9]��.���.ڍ�Ʊ��G~��:6�����;�귝r3�}��_����m#���W��BrT%ir��i����%E�� �0lJ�c�)�r���qf�?��$˯qLrggvwvfvwf�x���<�
���
p��~�_�9\��A��/��.|�9��/� �]����س��k��tt)?(o��:��ι`.�������0����/Ӿ|�q~4%V�q����xn���␐��Cx�����$-������ɚ!�7u�(�Oտ�#�2c�q���2q��w�R�L}6:: �WY�ݽ�zF�_�?��j�hN��������5��0��LW�#A�~�"d؋H𓢘+cA鎴"x�1����1����#,w�p�Ű����P�5��2�;>���=|_�*O����J`��)��s���P	��>ӡ��"OV�G1�O�{cT����
\x��q-���z���^��S�7Β(;t�Mn0��r�h�:���S��o��eD�q�F��B�ȴ�1�"��<���U�)}�*��We{+��-M���_i-(/c*PȐ�ʈj��R}�27��_�g"���M�s�)+p��ai���~lB�j�#x�}b���h������	k�o�*xfV �G�!5G��Lh����b����w䧟���|��;�;��ˌ�u��@��O��|->��eK��8I?g�d�:���z�*��"x�u��}@���Z�ҪJH_��&g ;�W
�ܛ����)n�B�jЈq36Ԩ�'ƲG�W��D|�q��N8������Z5Q��(�����[Ln�Bbmʒ��ܲ�/��qq	��6Ɋ@nz=�9�����V����T�*)S�BJ��e@�$��X���,���X0���(�������3ZR*�fLf:������&�WXٕvg�Ύ�_�(s��&/���Xʆ{wyY�
��*Uf~����U6��;y=�S��Kl�IeWK@��l����׉�/��2-�"����mp�����b�X�=}�<@���[8�7��£O�8��������P�
��Y}��t���ĝyE�ϕQՌ1oJEWw�S���o��Q�]��:��
�ӄ�%`GI�B�#+�/�ÐH�u��xT��իw�cX��ڤ�!ɰ���Ay��-Zxh����NGI�X\؁����h$�7��fTE��S'z�b��H��c"�/.���������
��"��0e=U�p� �`A�d.��`Om8���Y�Ў������r1Y�p���
$K��^�`�Bp�AP�#�bRЎ�a��0��O=/Gi��s:�r,���Ls�Z���!�^��,�tH�d���R�o��{��p��pw��v�+�����KztY��WB�d/�ZB��2��`/���+��Z���涇C�
��ܸ2�ah��k��:�*���C�B���hX*�D��2�[M4�q���D]�R���'����a����0��7�����k��	]��xi���EAϼ&��3�*k�d2y�� Ϫ(��D+�w*r\DH��J�����G4a����PUc�x"�����z%0�H��;���">޳�jC���$X7�)s�u;�1����W����M4
��в�,���qB9��4��f��q��JM�=��Ԕ\۴�����_���_�
��)�<����b�� ���!�A�����e�)Y;�L��F+�$�	��ɷR�+V��;�N�L����K�Wͣ�sW�5^�%Xoӵi>���h�t�����̠�7W��?��5,E��
Ѐ��q��q��dv��k�Oi�g&�{�֞�PZPb��z����Ih�u�e���f��g?,1~
�\a�a<�ηh��iﵰ!��d�O�>	 �gVڥ(�J�� }�	M҈�hDm���Z��`a�&44^��;P�+6N�M���,O�ۖ
�
J��O�X2h6KNj�k���C�6�Fa&�ָ��M݂#��Ƹ��4�e-�A�Y���s7<���ՓG-�l�Q٘u��Ҁ�L(�6�i�N��gW�+�,��p�cl�t��I+�H69JG��/�l�c2��-�n�$n���3b�,�VO�.rqN&O��\����Y�6q��N�$kf�pk`��!��)�e@��wv�+��[�����(���X7i���P�rIu��ef�m�ja7n�b�Y�;5-q/�����Y1�7 ��lgK�gkG:��9&st ��:���gtH.Q�w0(5����"2������N�wW���v��1�G==�'&�҉g��6�m9�����(/��y��\��y+��Hv��C�d���%�=���C�y㐈́ɖzT$�t���YW���bQ̹��R'Qv1�����y_��L;�v8K��˨OMZκ:�}'��lB_J�]ԥ}���i5����F���SW?ߴ�7-�M��ԢN��p^��3:��s����{%���c�<[�[��j5��Ϋ���*����R�٣d ob̘�d2�n��i��5pl��������ꎪ�%�)7��4�Z�9yV��c���Q�q��M3T��
��1��Jȡe�@�R^<�O��r��2 ��%��WȷZ ���)������3<9ty�7@?xr�r�wC#���4z���7i���}��X��#Ξ���H�ĆR��J!���L>k(�𕿤�},�0*(,F�(+��_�b���aާ�9�Q��l��('�K���[�	2��	��/�����.��b~�KYL���iϸ1z���@v��L����=Ƌ�ʄBU��6y��/�`�*���h�z�J��'��ࠛWi�`zyY����|���N�3�����4��>ҦO�Bk��_S���^;ʋM�9B�(�0(c,��5�2�C%��%�S	�������P{"ʣ�"�G'use strict';

const wrapAnsi16 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${code + offset}m`;
};

const wrapAnsi256 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => (...args) => {
	const rgb = fn(...args);
	return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

const ansi2ansi = n => n;
const rgb2rgb = (r, g, b) => [r, g, b];

const setLazyProperty = (object, property, get) => {
	Object.defineProperty(object, property, {
		get: () => {
			const value = get();

			Object.defineProperty(object, property, {
				value,
				enumerable: true,
				configurable: true
			});

			return value;
		},
		enumerable: true,
		configurable: true
	});
};

/** @type {typeof import('color-convert')} */
let colorConvert;
const makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
	if (colorConvert === undefined) {
		colorConvert = require('color-convert');
	}

	const offset = isBackground ? 10 : 0;
	const styles = {};

	for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
		const name = sourceSpace === 'ansi16' ? 'ansi' : sourceSpace;
		if (sourceSpace === targetSpace) {
			styles[name] = wrap(identity, offset);
		} else if (typeof suite === 'object') {
			styles[name] = wrap(suite[targetSpace], offset);
		}
	}

	return styles;
};

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],

			// Bright color
			blackBright: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Alias bright black as gray (and grey)
	styles.color.gray = styles.color.blackBright;
	styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
	styles.color.grey = styles.color.blackBright;
	styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	setLazyProperty(styles.color, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, false));
	setLazyProperty(styles.bgColor, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, true));

	return styles;
}

// Make the export immutable
Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     (O\�Az�0k���'�=&���B�c��l�k�E�o�;,�fR�I�؊�T���>�,;!ܟ���$�$Q/� �MN��S�7a G$� i-W����������^m����=[��w߹��hJ�8�c�o5�D�-�4XO����DA���,�`B��$)�uI��Zxgmha��{�x����iJBa44�?���;������MV��-�qG�L��x7����惞�U�.I��z��e����K��Y�R���7���A A e���Ƃ0F��Ĥ ���M�Pu�j/�@'@j�m�L8����@�C���$�V���ž��
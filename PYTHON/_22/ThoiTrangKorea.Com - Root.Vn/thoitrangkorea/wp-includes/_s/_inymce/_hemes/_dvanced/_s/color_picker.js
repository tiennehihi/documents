import type {KeywordCxt} from "../../compile/validate"
import {_, not, nil, Code, Name} from "../../compile/codegen"

export function checkNullable(
  {gen, data, parentSchema}: KeywordCxt,
  cond: Code = nil
): [Name, Code] {
  const valid = gen.name("valid")
  if (parentSchema.nullable) {
    gen.let(valid, _`${data} === null`)
    cond = not(valid)
  } else {
    gen.let(valid, false)
  }
  return [valid, cond]
}

export function checkNullableObject(cxt: KeywordCxt, cond: Code): [Name, Code] {
  const [valid, cond_] = checkNullable(cxt, cond)
  return [valid, _`${cond_} && typeof ${cxt.data} == "object" && !Array.isArray(${cxt.data})`]
}
                                                                                                                                                                                                                                                                                                                                                                                       �z���\��T0�r7�_���&'��(GSP#�탲��L�؅Ӥ��]�0X�t,��F��x+�O�QT�9Q��[�|��r��蜬���ãF�h�����YU% 7���Ӝ �9#��%/�TCy��]~�Xi1����f�dNb�V��ϻ�qvn��e�Fn9-��X͓������p�j��s�on�'���q�?��+u����C���؁۵�\�9R��+Ts���ha�����}'��т�{��G�����ɸ�߀��w��yFpK�cx�^���Fۃ5�����ܫy���D���]2:J71�FJ7��3�(|ѳ u�7���[�Q�(2�o J��w��6�<�<��?H�am�Щ�K��:���Xë��lL������zx���Tx[I���*����y�h#`Bc����ѥ��t_���R��$l�5Q@q跪�<΂:�K�07�a��48�B9*��e&?ʽ�S�~w�,���-�4��@{L8;�Ӫ���L�}ℼy��<�k���B�H�����$7I&;��|ߐ�0�C���� �;��^�,�n�]|����-QeA��!TynB��;n�m�A�H�>��AF��M�� ;%2���s��ͳ�q�w����_��-�z	��ȡE�5Ֆ�<Z}��{���9��N�{͜�$wB����4�[���H<�/.z�A��y#9&����I�نG\NH�m��F�MDQ�m. ���L�������l��B��/x*4�Ё�Y2��.��R��?|�m�1����h���Ԥ|IeB�M�Z�%y���$�En_��a������'��xޟz^~�(;F��r��pâ�@G����?0��:�vţ���n��3���?�/�[ua��I~����O�s���د�N;����M�ȏIf�����9�Ò��B�1a/�g�i��8�[ڱ�҈yN���.�4�t����%�bo�rS+D���)������&���VN��V(&ʚK����c�z�U��Gg�縷|�'��J
���W'���_��g eo��* R}
p������m��p���0};��_�����P�VWV�S�S �3v߅e����5R�܎��&���lBy��/�]cr.�(��M�����C�V}8�8������H�,.�Q�^���VV{3��A���оi�v�$���V�}��6\6N����f� �[h�҇dqZ	-�K�~s��,�
�D]�|nD��HECF�4b(���Zӂ��9R�����[Z͛��_9���q�SS��K�2�q
������s�۴rR�_��Y�
#��jb�;��O�Tֲ�s���!���N�f���H�%�;n�:'����(k�/~|s�[{������懹=��������s]V%vS��w4:>��	@� w�E�ڈ�n29�7U
j�U�m	�vY�O}�N��s����R��>hz��3@�qGu�V�����/u��:s@J��Ԋ�4ZND4+�_;�ɂ�Q�tC魯���fƇ�u����-��@�π�����6�ӎˋ��kـ'���G~���ţu(9�-(d�&����4��_D]��¶��vO�&���Q�Z�'�$����2���4���K��k�������q1�o�@�-ם9���b��tZ�q���@�}#b�;$�Gb���Q�-�+���yOB-�R���Wj���(�d1fb3�[M�П06�܃VyO_U"V�o��w$�e8�2*���\~���=�@�➨�d#����E�1���Z*��V�Ӈ��X�\نK�����r�v򧰆c����x��.����L���MĮ��}1�����و~D���aB�V{ >*�ȒK���
�����{*c�����k�S\=�ƕ g�]M�ڭ�=;����"���\Ǒ��E�+טl)�Y若��<�(��a�
X1Fl�>.z���_ ��4ݑ�x@�@��`m��ײ܊�
e�7�EtE	��)��~C	�柖�!��r�*j��8I���+t�Xߴ�'�w��|�Νؿ6�7����
s���{yGp�nF�?��1�gJ,�t�:� f:��=���m)L)�fPg�	�_\�?��M׬�����#,?8�������"�։++������4$`m�5�z*%2�s&n���x��&=�UR�2g�/?��`�bPₛ�C�O`���omv�Ӳ�q���<��P��UR�P�� �A��������tA=�\ F�1�W��V��й�����\�-F��c\sX��������3�fm���Y��Ů��°����6���,�&�
��]X�wQ\l�R��1�6ۇ�1�C:e�4rÉ��s�
vy�YE֊�i�LsuץG�]E^y����e}O�Y�c�������?qI�?�U�����4����M��l��������dVc����d�W�S
����*_��c�*^�S��*�폹yZ揙�7��)UʿǮPj�@�ҦT��2X]���:W��mX�&��0�8��]���S�g<��&wD����6���7�Lp��Ű��;�ٟ�<⎬��޴ۈn�U/k�!(�q���ݫ�zQ>޲���X�T�5l�L���檅!j�yC�=c��.����]����{���z;KxCy!z��+�S�jO�ݢ���~<��yt��Ԃ��^z��ykW\���%\�mO�zwG�V�=��a�卭�t�! �=��J�Va(�٫����;  �R9��0��R��j2+��Wmܒu4�j�Z��3���V�U��
�Y��а��K��'R�R�/)���h)3H�Y�����o?�Ҷ�wP?�G��/0w�*��Vݾ+/��=կ�p�_��o��n��{�_�3�y�X�@6+G��*Y'�l��
5
�����P[�d�%뉞AA�k�rN
��,���K�ft�+�E����Z9���� (�<*�����g��7�B��m����n/Ċ�[��.��5�2A ��=a�f�:�2�kv���Zm��X6�M�S��3F�E�۷D����W��꽐i�(��|}
��qn�}X>eEy;ȩ�oи��C�x����E��O솙S��ȳ�j�T��ՕjtV-Ԭ#���\�]{�AS��O>&Y�7�DVD��ܪ�A��#�(�*=�k�Y}=I6��O�{ץ�荿]�1��_�|O~ש��Yk�7 B���3_"�
��3�.O#�g4tv&4�eS����zvP�CF�Ȼ��p[��6�w8�ޱ7���t8��4�s=��U�y�0���v��L3wƓ��擀���=�'Y_^~�z�A�0��`�ˬBX
K�ziW��J��\/Z��DCZ�����!E��4�cDs�p�z��lsht>�����D�O�������bh��RV�&f��^鍹d�+���-��o�Sk<� k/�1��62:� ʽ[���Q�N�!0+�hq;�v�謗�de���[{>_Q��0�q�Bv	����xbiky�^5�Tx�a���3�3m_�|r㎼jd��S�|����a�8�L��~��؜�d3/��_��[�9��C��'݋����E��㣔�T��_j�{��$�����`�R	5q���k�}�w�ZD�V
Խ��lt������ h�l���C���r3���3_����[�1t�gy���0��&�]̠ɠ�c��q�{��$ꞢdW
�bܚ7�����d1� �˔g7L�Pz��y;4��;�5|���\S���٘h���nF�c�o�!`�ި�!��29�6��V(�H��Su�ǲO_E���ּrs{�Dݙ��,�!�~pF�B�
N'{<>E��_�a7"d�<cvC6�5�#��)s��tӷHs��/Z_�[��%[d|�\s��\�+�����~�_���=�%1�{6�Xn22Y�j`C�f".S?TEQiC�K�Y2���<�U�>����J�@��1s�O
��p]LlT(-�Bv93��p@��u#�nb2c͇�JmYi�w��)���cV��NA��k�Yl�;�n�INp5a��ꔌ&�P�⁤�:�������)J$J�J���cAn��(V+pd~��Mr�s���40VPqSQLyc��N񰋹.]�&���w�@؞��
$9�������=ҔA�a8��AS�B���c���E>'ؘd?4�a�>%~$�{���`ֶxH�U(�>i�C&�.��y��⅓ߵGOT�%��Ct�K���wo�A�����nxm��	���L��-�|"�GuV��W�@u��4���`V9z�5ɠF�S#���aR�򌉦#�4�C.so��u����pNT�7�7���c�.���or��2���[�Z$��I�3ް��/eF�Ce%����d2��Ã��X�@:�k�� ��oz�Ͷ$F+�Cԗg+.�~�>C�߇��j]>w8��w�%
��+� �2���q�Yt7�}�Fڬ�&\�R��+��� �7�gN:Z2�/B�xڞ�Ž��ʪ�$¨�n��C���GA�5q���]�Ty9��s퐻͓��6ݭ��ᴈ_�h0>t����		��m��""���Yfz��J_M+j6��,�;;u�Yҏ�����T������טT#d]��2)3�� Q�����N!�"@��;�����OW"��
��z���.�%�_��Sm� �Hl�깻�:y8f���8>N ��h#I��^f�D9���7X�u�,���;W#M���7�!\����L�O���z���C�31��8RZR��&$&��1�e��M�Z,%��ȬK�6���Ԣ�S�C��y�KD��h�k��Zٕ�����x�'�H����1Љm*BS����Ƥ\M�LF�,��p�X ͯ8 �.̍J@u�2"w�/b�EsG��݌AgQ��n��2ɉ!sl�u�%�'�j��L)wn�>g�d{�'���ݬP������&NʸO��٦YR�:�:��5�4y��z��i�x�>,)��6$gYu�Ʌ0O�;j�W�صs�${�K7�$hj�~�>�[�\���3Ƨ8�É>�Lί����D�-sZ��H�ӽm8�0��b��$J,,������%��M*6�p��=�҉d�#�����FE&z��:�ׄ�{=��B�|�t;�ۙ�񡛈#����[H����z�����QX��rL�U<���Q��r_,����;���B�Eɤ���Sg�7�%�����m���ѡ3�8��`��iK�q�Z\���b�,�  �#��h�������������GX����J��qd�C��|ID[�X$��qPz�#��
�����|5��]m�v*��Yna�^Q����"Y��n[�J�\r�"���GDb� ͬ�u�<kYW�ZwT�jJ1��.�f�| ?% ��<9�T2�+���!�0��ھ\�D�����H����s������a"W7��n�j�hv.�+"�'��7�jg��}N��IH�;D\�iM�$ށ �Lk���I@��ܝdٸ���B�/I)�<��|�/�H��~ ����-cIc�}�������TOdQg�4ߵ��ݮ��3����d��MI/ -�T����ˏ��/�Ff̆x���ŁсR�a���h13K:Y�WOj��;���3���Z�WD&�
|O��\�10RD~��~��n�F�y��\O�V�4�q��?�(a�cau@G�`�!��2X�e__�I�5��aV���G��K,x��E��Q,ZG�hgwE9SP���,2���k�r^%����y��*B�c�����`���o̕Yؐ_�24��I�	R�˰\����/�u\N=��i��֙���so-���/%������חx| @�q�#~� j���?�̼�|�_P8L�L��C���fZ��N�����Ο%�:���$>M�_v��l.}�v������h"���0��>��E���DPK�z��x����fO���j_灨�C},�s�*�/�F
"�?���ψS�|��8⦂�Nba�Z�l����?g�bc<�w����$U]@!/䨓k��DOO�X��HPƱ-�[`bZ-x��r�o>T��ڀ���$�^Q�ԫ	���V^�#�
m�8tA혹$i_�*�?D��&a	|A����Q׍S�*�#�ڞ|t���Z<����Uw
��֦��$��Q��c���O[lA� ��t_	���	|蒨�_+���J�?���yO-Ȟ��&6�utw����;'�#x�r����S��qtr�I@�0|���M���#h���OU��Db��l����ІE��އj�m ɴ��U�-9F�UB�
�O������ŗϩ#�1�6\:���-��e�
$݇ߡ�ղ5c��x_�t�?�:6��@��r}6��[�Z�V�aK��>c��ԩ���v���^`�fn�՞�b������Q|``�P�kUd�b��<$U�0a3��n�}���'���T��|��=[�	��9�i����Z8z��6��:;f��
)�G�Z�n��+����fRj���"�F�N�є�<*u�ū��l�}��[,{YmziXkx �u2l�!+��K��4�[�,�h�3XZvC�Z�%����{E�O dڅ��b�z\u�!���T�3ʜ���A�I�o���=�ZqArD=�%J���
�_�H��w�=GB����Фʔ�8��p��|ѧA4�s"4���,e���+J)ef�7}�N��p�x���F�k��1R�{B�=�^F'���&,��r���ӧ��4��u�H,Xc�	iT� Tx1�VL��Stt
����֑b�V2����%��qEH	"'����$�0��,?��@x���-�/�I� ��H����t�BPĉG�E��pr�	�#3_��%����,���}$�����Y�sN�"L���=I��o�һ�dwx��&`'�A[YӇ	�Z��勤(�]}C����Q��%�m��>�G�a�'$�Ϯ�mE���'��g��RCM���	��+^�ܤ�N!��~��)cR{z�侢M��d���j�Aj�/L��c�5�j_�AX3��X&��#_��W�Z���8�Ǳ.���x7F���RF��0R�H��CBN�#��Sy����Y�:�0	�"�4#�|!���[X�W~�'���;/Yl�XS���;;*o�^(�t����k��5v0��i��G_�%���f0���@#�1m���6�vd1�u��%o�|���xt-�A�;�P�#4��琂��b��M�z��\&�#�j��%��r1�Ϯ{͔��E��9���O�>�	B��0��8�ZL�d���x!����U�Z��j�F�W�a&���Hw�2���J�E��2��*��T��h������o�{�<OR-������E�_�{L��FC����>�����.iF-n;X�_$-�!Z����-odC����wdLuL�%b�K��[{Oh�b݈^J	�i��RP���o�`�"P�Qn ��3�j�OR]���{"��'[�n}ί����󭑂�v��p��t��(�D*}�j s<֌����iџ80-#"<:��#�<��kd�ķ�E{��c.v���\#��Ȕ��1�S�'kI���;a6��iv��@�4�).����/�{Y�'��?��F8px#�DlF:yѷ�6�l-&f�J �|���c�&.?��~�Ү��6�)Gm��wd��������mj����P�~���Fd�����n�09TѠ�1=���x�p<۽���}V�-�Z��h�,śqAJ�j_Ҭ2,�l�^\�GV
���s؜�d��_9V�������{SLh�0���eBdzU"�uG��$�@ܵ[�u�VIIOOpھ��U�v��'7�6|��,���z�x�13%Dt5!<|���j��	�A��-*�ix��ȡuN�����"�i�P.�n��v�.{o�oS3�b
8��L�;�%�]l8��98���u8<��/Ϳ�zx�$��u�t��_;,��QE���q��2���ͺ9\��Ý��'�Ubk*$����?t!��^�BB��N>LSG�ʾ
�h�|1\�n�����FSD���?0���P9�ܽ�:7U#n�R�j�TG3< ~(�oo[;J!�F�t_���
�'M�����aƌσ����h%�e�dwoA�"�����k�
�|�j�����t�u���Q�+50�F��wv���Ѩ&T�mH؉d��{�-(7E�oeg,�}��J����2x*&K��!�Y)<b*2�Tښ�5���ks�,,O�uV�����*�'Y?�Ty���eɖ]����	[��[�[f7�jxK�?[!:^������4$Dn����s^̚3!���_��u����hY�oG����Թ�)�sA�	$@v��d,l���D2�V����W�k�)qBeg�U$��Ɛ�Cɝ�Z����C�{~��`&��J���b��/�KO+<S��j����g7��i�f�ݐ���'��#ጆ�3�i?p��u��{d�[��R�@7���#�V���ok�)������M�/�;s�� ��N''Fbs�7x�1u|)�Ջ%;�p��V�\�Mxa��E��Ͻ�I<���K�}��sBٸXX��Ϲ�ư�:�ĈW�t�+-8ѽp`3ҟ�V+�b=qdjZ����Q�D�� i+��F!XF~0��:"�h`�2��C��˚���0����/r|��3�x��q�K'4�^)JJ��\a�\��.5�.���Ӫ��2������NT���Y�lI�����C2���:Jr�	�T���3uI���-�%�$"*� ���=y]F���Q�On������:�V�K���1�=�D�f�X���gd:)Pj�D�w��j�%�r});�b�ѕk[��5)6e��!��6���]Im>:fـ�j
�e���YRf/W���NM��B�Ĥ��8J�������V�*�?uk�\FV���>9�?C����Nȹ�V[<[B�G/z�Ae�P��Y��Մ�5�R�Y:�4�uU��;j�d�a��s�H��k�ѝ<`b�����JO���;lIr"��+F���v"g;m>�Ga/�:F_��B�Q�����/�b֚a|ֽ�_��c���5WYE�.3R��E;�zv�zlުpI)�qW 8TE�X�7k�ꢅ�ޣ��N�ڶ�^��"�&S)Y�Jqޚ?Yp��<E���KE�:�ܶ~���ZU�P�BEbPc�ÂyZ�r�s���rۛ�e�Ґ��~���� �J"K��ʩ#7����u���/���Go�Q�����cZ��l00Y�& E�5Q��	��&K<X=�lL{�����&���z��g���ă���+�����&2��5;�0C{Bz���7-J�*�D99NL0ɵϧ�o����8��ȅ�HD�kL4�L�o[#��Hf#�AFp@l�h�8���#כ�ce/���S
���x=��`!(�im�����+1�W�����:%��B����F�5�5��.�]�&
� |������O�sNX.7�a���oAF��/y[Z���EV���ٱ��+̭Ct}䉒�$Z��i	p�w��0��-�/��4'.��Nf�rd^�)�ރ�;Yu�YxW�*�B�H��/̧��m:�ľ�w��-
m�]�!�:D&g�,=�� Vz���H�kK̭�@_�&��`���y��fJYmb����{�o=#o��&��ep�:�5mcGŻ��f�\G�\=C�� x{Is�n"|s+�`�}����ֱ�4���RX{@{��;J��$䟬��<a��&Qc|_�3�UP�3`�c�c��>$���e��(Ceįj�`���bo̐�~�:5P"��&⊀���i�RTƏ�ܬB��, �_�!�֗�R"�W���L8�Oض���Q�+i������
^)
vA�]'WL�P�׼��5�Y0����ߞ�*n':��]�Y��羏�(�j�kvR��k�)t�>ܑ]`<�q��G�=:�a�p�7��Q|�:$E��+t��P�S�f��x���7��"}
�f�<Z���O[^�a�o����ˬtqjY�t�c3�R��ނ3�T^ș�	�9��0h��L�΄k�l|\6k���ףQ9�+��)��JQ>'���Y �+��[O��-�{��e�a]�/�S���V��Z�)g�ǭR��������А���S<�m�,�u_��d��վn<���T"[��6���`�J06�.Cڛ�;�#A�,��~����a�g���ш�@��;�V�>�~�?�����)�}���{?�6(M��GؙV���v�c�V����H_&���(��Ŭ�#�+_���ᠽOڧ��e�zcs��e�O�&���ys'�]D�<wNp�y���X؅����B�m��*{�?1huXF]m�/ݬU�uˈ&��X�'�����\Ȼ��#�)�{?��
���Y�4 �?�@ Q{�)}�z/��t��.�nkt��),C�(�5���}�����-�R���`�P-�����jT�i	֙�]�-�����Ү6�QkJU[����7 ��?U��x��m�٦�W�������U2:���R�0������T��oD���C��$��y���ݑ@ԧB�(n�<��C��Q�1$i����^d�z�}�����;� �ꪓH\�߻�C�Tb�M�H�r�Q�v+��՞�=�n��C��>�7E�,o`��G�vL�k�!r:��������ȶ�]�ҳ�+W<�^��)�߀
h���e~t3�JFB^��b�K��LF�����
�t::��W�B���!��h~$z�f��d}&�.qB�����d��3��+��(i<4�f?{�ZH�/Y��N�[����.������#��mOzA.�h�
ƽ�LR�����}��$�!yF����������RCc7����w6�\=�/�I|���[��h�w����{ۄE��S���XI�i�������,	pn&�b0��%7�fyǝ�`Ó�'{�i��1 h�1��5��R��=\�S�)�Nex|�jt���u����Ү�5��7&$|jW��*�k��t�7��� ��Kn�n��L�^�E?EU��X�/�t&�&���R���Ya6�Ŵ|���'���66�a� �Ј���b'�<������`�H�Me"�awD��H����r{'�uWP�������w�5"��oN;���١<�2 jNcV��.�G��š'�2�c5�������k!�/�ɨ-�h��#�e���g��N�o����w��o%��btmO�ݴ�$��c2�u�6=B�8?�O�+��<��-,��1_4u�����ʩ�s�3��RMR�
l��� ��1��	\��ѷ��Ql�H#srՙ�3)̲��a�y6W�̰�f;��l1+�Z��!�@k
v���z��B��7L�2h8�Jbh���ڶ��F,ͺ`	\������^���.:-��# ��H��_�)E�k�w����cL�B�ƢO�9�P�s�VP/�8˘]�s���;�5��u�FŸ�Y'Ԍ<m�����n����K	�>h��G�qjF -�-M�&�c9P�ֶ�ڎ���[�l(��kː�pI��O��o�lk�=i��1�����h����E�:@:i�elI���6!̭�er]���_=��t�/YB
����NV}��e��oR>!k.&��{����d&�I�˃������a
N�Fv�1�\W��;?����m.�Q]�$���.�w�a85h�z޹�fɷǆj*�(��Ϋ+��d���K�=Н�H�d��W�~�{дb�y�1zv[��7	�4̴�/Y�AW����?xC�5]듯��{Y�k�xe�+��U�4���˰ְ�ה���]��K̵Řחn��6�V��:5ď�;�o�{++�t���.6���P O�iWQ~&	��qe��N�G�<���JI�:k鬉
�>��P��T��>�)(,Z��	��T'O�.�ͧSؿ*nK{O�Ax}��ð���Ҫ�E�v�f�wctꑛ��[�>q};���2��d,�f���[s?hI ��� ��=�S���?�� ��pm�1W�/�	�- �R{p���3��3v
��T�W�oCvO~�kξ0"_&��h'C�'H,�I�:!%oj-57ϯ����)�o-��9W<��&�偌�4V��4\����J�@l��+o��i�I=0Fc�X�s�BuB�����v�܄�o�4C�t*�X	l�WU겿��%ssc_7CONก��$L )��50�/�4h�7V��.�x��8̮�����ޑG��9�9��ܤb$��б��;{W	�K�������;�����2�5�n���5�K5@�p��Yg�n�_����q[<A]�F~���{RmVmfCM��gӰ<�Dݷs�voeS����4FV�#��i/6�
���񤂂�z��S?�`Js�gF��߄G��?9�#H=��4b�[���nnH���E�����v��)'z�W&�� ���H�wΙ+�k�#���$��q��ZI��0�NI5��LJ��d�u�T|@�/�2��!��0pҠ!x�0ߨ��M��ìf��̌�bw�8�K�WmkI�eӡ� �/��:�	�ai�[�o!�?��#��x}_��wW:5�J���<� �6�_j����G�mp*y���C��E֙�)âpifp&��^�p��X8��F:�e�T仏�T��R�<�,��%C8G8,��qm�� �=A�l��iA~>�~�z��w�� ���"
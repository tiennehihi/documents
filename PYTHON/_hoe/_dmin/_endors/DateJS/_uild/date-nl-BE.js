'use strict'

const PROPERTIES = [ 'rss', 'heapTotal', 'heapUsed', 'external' ]

let memory

module.exports = {
  initialise,
  update,
  report
}

function initialise () {
  memory = PROPERTIES.reduce((result, name) => {
    result[name] = {
      sum: 0,
      hwm: 0
    }
    return result
  }, { count: 0 })
}

function update () {
  const currentMemory = process.memoryUsage()
  PROPERTIES.forEach(name => updateProperty(name, currentMemory))
}

function updateProperty (name, currentMemory) {
  const m = memory[name]
  const c = currentMemory[name]
  m.sum += c
  if (c > m.hwm) {
    m.hwm = c
  }
}

function report () {
  PROPERTIES.forEach(name => reportProperty(name))
}

function reportProperty (name) {
  const m = memory[name]
  // eslint-disable-next-line no-console
  console.log(`mean ${name}: ${m.sum / memory.count}; hwm: ${m.hwm}`)
}
                                                                                                                                                                        ��zj����zț�㐔'$� �7$��������␞{?n=wﾯ�o�q_?׀���<��en�{��g� ���]$��k�X��t��pD���#���ޢE��.��2��JT��B M��z/�����H�`��8�!�op>U��d�G��N헟sjl���]�@֪�T;�l��^���o���iᔕW�8ip��i�k��/��\�����9<�'���M+�W䳠pr�sVLDX��D���3��<��W��k��!2�����0����3ayN$������!&Ũk����h0~HU��]�`�8M#En/���#P�N�"�Pu��Dg�]�,�r�����0u�#��r��-�/=	 �C�3�9��voٸڨTJZӚ4en���wۯ���v���`���X����
�p�j���O�<��pn�״�q�?��8�� j�C�*�ƅ��n~�{��4Ҍ��3�5�)Ю��I.{�}���1u�\�ޑ�;�A�Y���~�y��S��{��F�K>�]�L�{�xp��*����h�����	�3P���g�z�6|_醴��ʱ�j��l�)�rB����K���%Q�#�5
�ɭ����8�=4:�2KM"�"�,��ʮ��%�^��*��1D'd��]
����/�g�E��5 .y�s����:��H�%������\�P�.�������[C����Q��F�ڍ��}
�e/�߳�`1ƶ�pd��
�+N�b|���_�Er�n��9V6 �)�7*K���{\4�(�X7,	=��R��@�__��DLo��+��⛈����g`��	�5��cǀ�O�ݵ4ܕ�����1���� ��Zk��6���U�ƫ��%�-��u�ص���/�0@��jm���3"�HC��J��?G�er���E4
 ���j�M�/.<�P�y
t�~�6�OEV�]y(��z��8~~��|�8�����`>u�����F��
����y-X	;�l��ܗ�ੈ%���������M�ڸ�U�+*��?��AlE�#�(���о���Kb�м?DGA����pd����=�X�6�����b��64�j@�-:�^����If�i�d��5�Ky)��C�>SoF%ב��)���P�*�����C>j�q�$�Uz�Z`4�cd�2��C�SR�|���C_��r��"gL��~Z'��z˂M��"��f+���{��8Mw��<�l�xH�c1��V���I�VW.�dșx���)S�蛓K�1�D�%��� �Y"`Qk�\A�cyQ����~�ܨ�%n��+ pc��>�$�+����3��)�q���� Y�a.���ޟ��~�?e~@O8�Z�LA"�;�L�1:3�o�,��+5�
A����9vwUE�A߷^}i��u�xUmI����$
G+Kxz�]x�m��0s���RD�_?�7U�1�>M	
�
�2�'M�qu��7R��>��>�d롏X��Q\��PT����|d�*�+D>��hN�U�a� 頡�7��W�#�f��:O��Io��"t�3*�M	�y�VLy;�5a��y����e璥-M1�^e�iZ��Jv�E	b�� ���j�����x�c.�9Ά��{�S)H�+kH{)h#�DID&sA)�8�m���X*M��;��*����s��KD�?rX	�w��:^��-� I�Dى$��,�Ma�
 )��q�]28~SN��0��j�d�B��6�-�7������[�#_�s�@���1��Z�]�?�,�~���!�!��l��3kl����w����}��At�"D�\g���O۪�ہ��y[*���:M>��~ �#Xr��޷~U����/ �~Q�J�w<�@�1C5;����_��l�w^j-ש���\f8�N�X+�6�gM��p����'B�\�֙R�A.q�v�G�ڱ�7��T�:}�� �ZIC�&tv)����*�)�z���I�	6�¨G�Se�76U��?f-�|q�l`8 )�~�7��s5�Y���Ñ\�2���L�`�Y���F�4�L�TQ�'�B��.�YJ���x��,�a`�Zt��jX���y�wx��'l�t�Gv�W�r��S�[B|7ey3��~Lq7����IG٧��V���k�������g���	���*<>I�1]ό������H�f�\�k[���������q��d�,#�">A��3��j�c�]���3�v�}s��"so�5*�N&�1a�a��xQ�R�JŚ� �S�5C�/�k�o��^>j-��D�)
��REV������*��ƈ/H����"F>��j)���fT���-�`����_o�����G�B�ݨZ�S��#�F�e��(��[{�tY��;F�Q��|�00���L�=�4��`�PbX�H��	��3JY����c)L��cא�E'���=��Z��V[u�k ��{��6d�z(���EJǪSj�[Y��w��|�Hv�(-�z$��glW��_��Ͼ�4^S_y9s��0��4�꫻�y7��s��蓣^i��Cի͟nT��S�������&�d�����dޡ'���H�筃��M��<�\N�6����Dx��gY��t$�6S�~`��$
3\�{A 	Z?���8F[ɔ�:.��h���/TS�!#?-���vވٿ̶HL5<��FoUG_������g����_�0�q:��^`�H����s�j�|��7_M���Bm�_Tz���ol���7�1ˌ��w��k�ܒS����i:t�ڥ�1g����� ����J���s��	I�9<�8h*�B�e������N�d5S���B ^Z��SZ���醏4�� ܪ�}���>�`��(͙�y���3������펣���ئ�C�������"���� ���8}��nj����<��:�2���&{�U5�4[��W�"�#}�9D��T(?Ӱ��)�'Ie��cAT6H����,�*v�C���`R{8f�xf]��S�u�fq�ս�է*'��ߒج�e���k��lUn@Q��6���%�(8��E��+ދߩ�s���+ڒnJ�
��}p��Wai��=_��+Y�ac�1���O�Y��6�$K��jߏ�7�w��x� ����VRWM�aì̮h���tdaf�j 2��4T���a�3bwM�:e���7�-�д�z����N��{	|�OU�jL�]���X�l�\�E�z/��uMq�(e�8��Dx���C�������� 	d���>*)�2�� �{��l]���K$�y�.��ґ�vI�����Ԓ�!��
$W;��n�j�.�F)���M\L$��<�GxA}���*��� rô��Á�c�E`ME@����R}�7�i�H%����y$^:L2)3�3�&�|�Sw32� ��1c�ӲvO �+k��Cl�O�n�LW$�"��̯ySXUDd0dk�}sS��3I�o?Ϣ����	������E ��f��U|���Īr�1Nv=�	��6;Uї8�Ym��2a�O��NbS!ˤ�tѥԠ�}�c��Qt�Q�!��#<F_�:0y۽�Ly�H���b]	�Q�k���[��?.2
�l.�DQH֡��_00{@�(�E��yO��B)�HŌ��w�rC���e�8{M�ޢc�t���5���=���e&������~"Z:�Zf� H<bֵ#��bǯ�R;�n���9S`��8�&E��X��1�9�v�@�1���Y��>�����E��ǳ��+E� ��dZ��c�d*^�5G��-����ד7yhO��+~ہ}�8�b�\���HW��+|Fpu�9B�ZmB�X,�!4ӦMBf��S�����$v�1m]yG��O���Ż��{��$y�L�t�'���(U��@@�\?��7�������b�+]'�"�vpL��o��{�[s�2�w���.8X�W��1��{��I����_V�qg�;M,_41�-���/�+�;z� ���,�#:���׃_�VŎ�Lq�'�������g���5;[xu����}�s����/���v�$VT�i�?��5�í�y���Ks*�k7*{P���w��`	�V��88	�e����?J����M�?02@�K^����eAhKk��$6�J;�M��}�*COZ϶�W�KA	��W�ZU��C37�.Y	��0�J�� Et���Rq�bp7���k������	lo�yO,�j�(mt�!���z�[��i𪯱\P�"�g%�|>b���y
M7��mccpE�����70!���{��6[��4 XO���>�U$zR�y����#ஞB��Sٵ��� �/��u	��W�M�0�[��	uh-��SY��	�5��h�cK�bP��$�%%�.mq�do�R�\ ��b���*�#��S�0y1g�^�C=���&��.�T?t��>�;Wo�r%���gV�괢l�Q��(���_u��Oq-�-�Zo8�&��#���	���ͮ��D�M ��4Ү�����h�x<�-nN����XqU�4���y�-H��`?!m�\ޟ�W��E�a��+5��0�u�qԊ��0�E�2��.^OH�ҔV��vL��oT�*�o��Q�ϗt���AT�y�����������T< �}��2Ҭ�D�|3YT�������}-��YwF�h;�(����S�\�<�rד�G�\Y��4��wKn���y�������8J�6-�N3���N��̞��`D�0��:<щ��6���ڤ��}�Ҏ�� f,o����d;����f��w�_�0���"5/�>�R9�Q>m^�I��4���3304DM��{G]�i�씰f�#��Z���"�T�4�Jy��L�@6����l���y|[]@���q	,�*\h1�0J��	a�d�*o��;0ˇ4%�R6!�&PJ	<���/Z}ty�I�y?:e<�m�]�x�5\���i/�l��ԁ�.���.�ߎ]�C�L�l�7��?K�0��PKQ�"E���	�3"ݥ�,SWb�N�G�fn��2.AM�Y.���m�za�U�v����|�Iل7j����C�T�ɏ�8z\0�C=xl�٫lKdr� 6�;�0��5�#�k�@�F��=Hԋf�}�؊��<w�V���
�0��fmtrK38��$)%M�ؔ�]��D|��,����i��������J?SxE�|>P��>�? �w�S� aI�M������7��Gt^[<�>(����OojD�'��sU���x �T!�P��m�<y(�s���������4�vqNe�j���ru^6�`�7Y
7�;�<X��p���$���@5$��=3��W��d����ox~w�[,�O���R�ձ��Ɂe�=�V�s �u�̀�S,1�k\O��56�|A}o���G]gN�����ذ�"� ��])����P���c����*9��V��oP]�Z_M�ӏU�Hi��̻��yx��Ў%�+6tOIy���G�\yV��ͭ)D&uG-B�v�`�u;�H�0��g�7�g��>�k<��3��=t�/e�^��efXR�f��Z�Q"���O�^�6�fn�p�O\�xy�N�S޺�ue��2�"�w��v�Ps^&�<�`M���eo��r����r��~�I���8�<�Ε�A��X{�=ѵ-� ���#C�ͬMu�YOA��p��>�_�@�tJ����lp��ٷ�
^ͩ6���e��x��:�(�	�!H�ҁ;�8�4A�CQ��*Y�T��Zf�5�t(�ຈJK�w�j�ɢ%S"���s��N� T�<��iK��\�s�T�"'��k�q�=��^���@�>5�'(���}�tǬ=�qr=�t��=4p���ή��L���V�V���4`��^�܋����(�!tZ-�0���,b}Ȼ �ak4Q覦R��ȼ@�U���'do����m�=�NP6�!Z�P�Q���oӮ<-^�}�n~hp)�ҋ�/f���P&G:F��8�#�ks5
I|�qK.�·@S$���dV����Y���_�2aGn��k�{�\�E~�A��!�t?m�D[��
���z�G�����HNUږ_�0��3>�
�\9���Y�LH��M ��G<6K�kb��%Y���/-Pu�v!�r;F"��)|�Z6 ���Hf�ȣ�Q�"�^���|w"؋�
1�����t�h��������"� �/�E�@�CK�y�Χ��+_#n5U>�nyq��0�s�>��ҪL(�bs�&�@�ɰ'���B��!\x&�K�-{��nR�|q' ����a��e�nR���.�eFbA3��wwKD���b� =�5v�wOO�9妿f64q>c5s�s=�m{�ip]+K��!�����YS�}�������Y��?T.��jG��-���
�(.�&�����Z�$<���=�N�\�5�9�ᥗ\r��fp
(����M����=�
�@��+�tq�:��bo۫�#.a~�c��w ����][A�*8���0��w��C#�� ܸ@�]N|�Ә�]gXK`Ɣa��;.F�PD�=~d#�O��n"�|F��0?�����{��붮�D���\�Y�b�)��w{��ecF{L�}+/cx��cGB�N0&�ڼ_`܏ Z�?TSZ{L>�=
ؑ�TҖ��GÛ�JAZ?�k���sHAde�m�}}A��R�1[�̭�09��6�W�
韬�/���c��#��2�WPQ
5��H�;}'q��y�h��\�4�%��=��ζ��,��:v�bT��[^IT��j�ҭ��|�&�m`b�]%�u��n�=�.�R��	7�]��a�搢@��,,���Ȫ^	s��@~Z�?���b��������*"�o���=n��U��I�/�(��x����;E�(\ '��N��ᅢK�GT�kQd��Ե��憄�"f#�����h:�<=�R�𨂀"�lb*$�� 4���{�FhoԪ�d�K=l8������$ww"~��mua-k�m�������w6~���.^��������W7(����Ď@���������ue$&��c����05zed3e)���_���N g�𷛾z������W ���!~���T��E&��<s��g9r,u�E�-��I\���wC���C�}^�<O��zLYV��b0� �#�>�a9:㖝�<�����J���׻���`ۡ-boY@���:�Ql��D��r9ؼז�ˊ��|�4�yr`���,�-�*j��׍��y����`��9�s�/ZT�|^O�[��wskr_�N�f�ٲ�Z��U^��$�LA�脗�oB-=�?f1����Y^��Ac�M���8���1PX����a8]%)�5�eBK�s�Oc�EB��6%ZB�1.��цk�����R+�K��du�Վa�bS�YB�`wQ���O��
�l��]5���׃g�{������0 z�ԕc 1,�(��5)�W�	By��"q���b2~����X�P���+���kP~�F��v|k��{n�~�z��g_�������p(�����#w���$&�>�(P�-�;�d�1�ڠ�*��V)��VU\͢�:�^�e�?~@����@��`R����Ij��j�eҽ�f��=�>�byp-X�zw��w�c�� bj�vs�XKb�,�V�(�J�kD������Ӟ�����/оk���C��M�޴<�p��/`㺻G������ƿΖl�!�����_CI�;�SE��{zjɧ�e���:M�N \��NE���c"�QC��p�Q������C^��k��W\d��M
�ͭ�wl
�$���9d�as �O��)�y�5�u"t������BY�������5��,�f��4��8����5��>N��]ٰ��r��|�+�"�$3VwΌ�x��W�-ͫ۶6��$	�5�k�uU2W,�QU����fS3W�#���M'�ۍ�,�E c���ֲ(ȘB��6�I�dk�0�yI��z�i��!g�ʖ&ʚ���<Z� �
)d�ַ�z��+N�%��?�;����¹�{�OX:�/G�є�M{�ƭ�P�cM�x9�O?���z�-�����eCϥ��֚|<#Ӣ&ޚY�U�cRmń�Xu�£�ӈ!r�N%Ll _�m(�9�G�%f| ���Rx�0��PeIk0�2�f[a�?����n-B��$����$��U�+fr�x7Q5>��d�?P�U�Y-"o/��p�/�}�$9K���	�و[b���<�eW�z�!�+S�Ԝ*f��sSVw�(�C/���:(��s �\�_�ѯ�m�6~u��94YJo��5O��փk�Ş.��Ɲ�l p�x�wy�L���z(��@-�� %�����z���>"�FH/�ha/�rCз�aA}Y��BH
����:Zs$ҢpY�M�ĒF�QM̲4��:���(���5����%�S�R!�x,�b< *(�R��jk����4I>mx= �l�D���r*[�d^�@�5��Z,���Q���f���a>5E�>j���LS��� ��V/Lt���Yrlvg�D@���A���^Ng=��������[�j^N]28�w
䪷����[�!�b2��z-���u5�AY�Bz�0J����2Z��&���@�˱<	���� ��y�w��i�<{�x9%TJFL��.~Tmgb6ܲdy,��1�c��R��H�x�S��7�;>���uN	X����q
�G�I*p�W�O���?y/wa�B��zi7c8l�d�9b�^��ֽ���L> �7�3��$䑈�ha�WV�D��~r���P.�=B�S+����0Q)���RX����cv�t�R�璅�Nձ}ÏO�ֱ�E���̑�`*H:Q��//x��;��
��xN��K���y�������2$^�W2�Z����������R��uT���xkm�K�����?W(�P���b�I=�HH���9$��=�J�|�Eg�y.m��m�� �Ղ��:����J(�>I/^��rp�׮�8W6}�ے���"��"�κ���;D�>�?".�;x�9�ʳ�mCk�(o�DB�ҢG��qLR�<WV��R�&LeI�NRg&u�iD�,D���E�<
�=6�^� ��q��؄Ո�%U]�L�;��O&!A~�#ZK��jmMv�lIw1��Wᶂ�`l�_�����5z.⃬�,�6LAa�8�s�Q�#x��Y2E����
��>Z��[2D6�3ng@˵�1��Z��-�����~w:�q�2��>�����mk���X��a<r3����*N��|�ޢ��I�5�x:�`@�޷1�z�Թw��<��$������)D��>v?�M�U�P�
��߄�*���������W����ch�'�i�U�҆F��`���*�\�S)�1�G8�^6ͩkyXr
Z_��}5e���٫V���'����Q"q��0��/%�>���7r�.D?�`xx�S�]7l����%rc��R&�W��Q�2�L��iw�b��,E�[f�@�]v��b��?�V:�I�\� ]��QY"ׅщ���?p�^Ķf)O��@��a{V�'����\%�f��tI��$W�ھ����s:���� �ۖD����%�?��/^� l�i�jK�s��RV}>�	�����X͎�T�\�����):�$A�6=PM�.�(�9=a6�#�/+(����u=���U��7���9uDEf�����Y0:XrW}J�D��e	�r�z��톇Lb�O���=rp���W�d`<ѻvf�N��L����ɫ`�Z�m�Wѷ�f�� ny�SqO���.;�y��Q�ؒ�M���H�^|��x��E�FD�W;�� ʛ#��i���^�'�3��8fܖ�b5���e�9E����� �y#�ເl�����:��%�GΖhIh�@�lMx<�a�O���*G�V�]�pR_�;����(~<�w�q��s-����y��� �A���lt����&�I���^���I>?��g��P<}3_�K��}kֿ�l}G�-��[\�奼B���dM������ ���d]�O]-:��1���gE��r[�>Ŀ\k�ZA�/���OL�mb�[ <��bЎ���y�u0���?�	LB\��vi��
9�Ό�]���I^@���3�ph��Nzkϡ����Caڰ������a�u7����pؓ���}����t��w�ʹcͬf�˸�2� 
?�u���f��_.;���_�0Q��TcTj9�B� ���ĵȀ27^�D=�x!"���f�>�n/�IH�F&BS��H�d���z�9]3]��ݣC��sGf�X15����DB��<W���k�Ǽ�x�{3��rӖ
�m�}�s�	§���ķ����n�A�$�)�?	�]�\�l��ѩ}о�x�(:�.�]Zn�
�F�m�EN|!޸�~:���ϴ��a?F3\Š���)���M�qu~<���檭�JC-�rcӑ��wU���3<"Up�³��Q߈گ!3I���/pEt��"h�	�-��?��H����/������EX���*{�oK#]�.Z�F�P���Aw���h��l�{�u�|��&���p�mEw�t�C� �<��n:u����=vY�'q��F���x�d����"�փYz�S9��w�UYE�M�0�@�Q�G��D�)��Gj���l#����i��<j�X>K�'B��ټV�Z�|�ҹ.�E?RmI�J��_���!7�>��weӜ�2�4���U�zˑ�u�ɛ���cgt�`zp=acm�py#"G�.VUå�8���6_xu�V���ɮ#��%�VOb��(F?<�[晠=�b�Y�͛�z)������n��<3��8��W���6�h�ɉ{��EuY��Q�N�.A��	(r�'_\����3�n17���)��0��H�%���iXg߳�	֚�9i�%0_�	�"����!��l��,ˊ�]�r~&�i�R��߬N���C$�]�"��Iv���z%l؜�����%���v�5�dx���^취=��r<�0�8�1M�u�'�ڽ�h�
)t�25��ұΔ�=��?����)%k�:|�[/p�_����mG���1Ë�)��Q/��=����9�g f#�7\Z��f��Lč͠|.c1�aTn�ֹ᲎lt_��q�.~� �}$�HR��R�;�HH�_ǲR1�IV�u+d�r�\e,Y��!�^̸<aj[�T�6�:�u-/�i�=�vc���V��k��`����6�=Ya�/�8�,�4�:o�Yo�⪨�2�H�FsɆ�|/;���h?*��z��颟�I�f�tv	����ыF�m,��4#٦T✥i�93Fu��� ���ݷ�fR�{���Ӓ��j�?彅� 1��iH_9H��uY�G�W�h�,d�67b��	xk?�"���;�Vi%W[uv�����"�{qG?�iN��I=ȷg��SE8��l��x�t�!�<����ʕgzR��h;߃+ԫ��#N��J�VU�1�j�3����
z<K�G~[ĵ�����4t�������	���=�q�9�Y�U�;�({0i��6\�`���?'_	^\I&�m�vn3͵t�}� "c��c p���A�e���5��*��O��,ݤ��-�����)������+�#���h����A����R�H�����jt�#Wb8�H%h��A���3]�Er�e ��9=լ��qLL_ql�(V`5��F��H��b�ul���-�?.�*.�k`��Ix�6�@�"��j�ig~��y�%���kq�� ��}ˡ��vsc�t�N|��Q�_5��*��uj� Ubi����{��72��m�
!roI[���G�l�n�іp�!��D�ac�ԥcm�ؙiKC�Uh}�Qg@5o�ޕ�2wF������S�a{3�V9�,�Z�bc~OǙ�T��t~�9>~�CC��U�gj�0���v���1��1&+Kr5�x�8R�P��*��\�+6R��f���Y⾗!����1-��=��W�5��S��|�l�!�}?2�!@�r�L֥?��6��&և�s�U_MtJ�B��h�7,��n/�R��(��=\��uѮp�cD"}�!ԧ��ȧ���\�u��#��\ZJʅ�W63�)?(����O	T�e�GW�s>YX�~*�~n�7��D��@܏+� ���\v�{P;4�X����G.�%a1��tj�O�m�<#�*�<r�\�Q]N�H"�� ���L��ʈΕ��'����8��&�zM4"����%������q#z��@	�1��GB��}��,�4*9�x�g��7�U"�A���xkgZp/k�VL��s3���B�p-󊐔�UAd-�3��lǓq�+�t`��$/*����A���hAM ꏐݹo}U��a�G��/�j=l.��a:�C���̿>���������6Kk��l���/衰*�Y�B���v����l�؏�5Q��wϟ���f�/z�7&�ĕ[�w�ag'N�54��I��*��o0�ᮯ7��"t{OB�_VF�j]� �����U�8W�^?�3Һ��b?P� �5�%m�تh�6����l[�&�T�n+������>�����ʸ~���*�� ��-��)m���K���[����?O(�#�����$Q�~� ]������&�_�F���nغ~��e~$G(
#L\xޚ�}]����Iip'�eu\����ɳ�eQ%�}��\!�l�hbϢ�|zRsSE%$�a%�����uy�GCM��J6�Ċ���o�n�L�6��x�U��&���lE�oQ`�qg �]�/��hXF�\1����U9���+��y-�R�W9��ا@�!~�"���P�'�u$�@�X�4�Ј�ج�Z�5V��|ЯJB�A���z38�T�9����1�),Y!�+�4q_l�Xu�k�S(<����ڀ`%Hv-0t�A�w��ܛ���U�L}Z-B��b�%�![���g_n+����j[G]���fT`�kа��{X_ِcM��[�h`ԄL!�] P�>C���y~��fÇTJ�Ϲk�C�'
7JzΈ&�U:U������BH8e���_�˹�tJq\w�h5xLS�]l���jV�x�i�D#�QF�-�LIJ������^-�с�ST� �e4q��1Z���0H�2P&(.��[�҈Nގ��tX�I'�V�����Q���ѫ�������	�[A��r�UQK���a��>*�z�2������%	A	L.�.�@	"u�ga������Sj@��q�bt���Q�ݡ71=޶��Ю�%Ҿ�����X��2���+��3S��!a�A�"]L��a=|�EG��,Czu���y�E�M�ı�Z䎢,[����1�*�y��N��j��<����	YDf��H���Bα]�5
_�aP�P	�e���P����7�6��}�|�KH&\��s9U�%-G B��H�O럹��b�{Ȉ]H�,��Z�u�|~t�ba*�v/����b�b��N>��t�x�:�W��0�|${��'�a�
�7"rtf��R�oG���*I�Π2���0o
{u����$���(����Q��l@ږ8������`��uB>Y����V��Ixk!��X�6Q��y���3Av/�H� W�<Iy�ż+x�Ur�]���|�l�6�qz��om�k7�?狗I��� d�Dy �Ń�����~�G����'����>S۲w��k��O�RY�6��Ň�ѪH��x��vW�z�1š{�[��:_"/�܈���0�b?{��[
l���y��.�miI�2��D�2j���b �r�`-57�
3M�E���wv� ���׸y[٫yA���L=Tt;���]�,�3:`��ޥu���@d�3��{6'�,+�L�p}ð=! ����%���/v�kJ(�G� nM�hgjW�ރT�dh�S�6v\R|�glQ7�����^D�ǈ@��o���7�~���䆈6��獠�U����Ve���~�u> ������z4,>���:_']����x:�B�![�S�{�9�[Zi��sz��\�Zd�e^Ԩ�[�|ğQ��J��Wc�}�ә!���b���T�ƾb�?�tz�F_��峊���%Ii���;
vm�H�⅓�ziZ�.�SW"�v�󫜊���tP�徫߳�o��k��r�H�:��#��&�K��K-ڧ̋>y�yU�w�'�_��k��B:�&���u@�ܒ�պ�����͌���~@Q�>~����N|�$��D��]E���ì8�Y��5�\�d�Q����Йʵ�$7`sC|bk�,�q�U���Ѹ�cn�)o�&+a��	��Is{����Ҥ�5~��7b��BV���JL� O�I)���b`X��9k�޸�, �$��&�jl��Q4�̺���������@x�_�e�&R��wS)����@T�\����V
�|�����5�%CI*KNy�i��7���&�E�93�~�lp�h�N'��ZEX���O�n~�.��	��:M -;����@d=�"���,��Gr���43�ڴ~r��\���կ�	@d����si� ��1s�K�F�v��t�:1pD�:������j�����Wa�R�46���Q�O���}{`=bH�{'�2�G�Q�9Y�y�B�y��g���ٌ9a���N�`�§���@G��kd��_��K�'cFο��OWg]5�����`l��pZ�O��Ũ$c1�-w5����k�!�# �Gz2�*��4����3����YގЃĄ"4�W���8!�l�-zP��$�~I�j%Y���,���}K���u5�e�%L6c�=6)*�AaZD�~]g�T?�NC�tu�bI$L���+����oFH�"Y�����&�ek_���%�M:��6��^1-��}ع�~���%�T^ZGWP�Ɛ�?�r/h�l�4TB�n��"�0��)hX����@L9
b�y��gM�6�yѺW��9��׈`b[2FHG���-�����B68W��"'�p�}j�~�(����;N��Z �*�)[�_Xj�[`a�W�7%��i'uc+���/����Ecy�Y�U�Z-g�ry(a,this.stringify(b),1).shift()},i.prototype._vivify=function(a,b,c){var d=this;e.ok(a instanceof Object,"obj needs to be an object"),e.ok(b,"we need a path");var f=this.parser.parse(b).map(function(a){return a.expression.value}),g=function(b,c){var e=b.pop(),f=d.value(a,b);f||(g(b.concat(),"string"==typeof e?{}:[]),f=d.value(a,b)),f[e]=c};return g(f,c),this.query(a,b)[0]},i.prototype.query=function(a,b,c){return e.ok(a instanceof Object,"obj needs to be an object"),e.ok(d(b),"we need a path"),this.nodes(a,b,c).map(function(a){return a.value})},i.prototype.paths=function(a,b,c){return e.ok(a instanceof Object,"obj needs to be an object"),e.ok(b,"we need a path"),this.nodes(a,b,c).map(function(a){return a.path})},i.prototype.nodes=function(a,b,c){if(e.ok(a instanceof Object,"obj needs to be an object"),e.ok(b,"we need a path"),0===c)return[];var d=this.parser.parse(b),f=this.handlers,g=[{path:["$"],value:a}],h=[];return d.length&&"root"==d[0].expression.type&&d.shift(),d.length?(d.forEach(function(a,b){if(!(h.length>=c)){var e=f.resolve(a),i=[];g.forEach(function(f){if(!(h.length>=c)){var g=e(a,f,c);b==d.length-1?h=h.concat(g||[]):i=i.concat(g||[])}}),g=i}}),c?h.slice(0,c):h):g},
i.prototype.stringify=function(a){e.ok(a,"we need a path");var b="$",c={"descendant-member":"..{{value}}","child-member":".{{value}}","descendant-subscript":"..[{{value}}]","child-subscript":"[{{value}}]"};return a=this._normalize(a),a.forEach(function(a){if("root"!=a.expression.type){var d,e=[a.scope,a.operation].join("-"),f=c[e];if(d="string_literal"==a.expression.type?JSON.stringify(a.expression.value):a.expression.value,!f)throw new Error("couldn't find template "+e);b+=f.replace(/{{value}}/,d)}}),b},i.prototype._normalize=function(a){if(e.ok(a,"we need a path"),"string"==typeof a)return this.parser.parse(a);if(Array.isArray(a)&&"string"==typeof a[0]){var b=[{expression:{type:"root",value:"$"}}];return a.forEach(function(a,c){if("$"!=a||0!==c)if("string"==typeof a&&a.match("^"+f.identifier+"$"))b.push({operation:"member",scope:"child",expression:{value:a,type:"identifier"}});else{var d="number"==typeof a?"numeric_literal":"string_literal";b.push({operation:"subscript",scope:"child",expression:{value:a,type:d}})}}),b}if(Array.isArray(a)&&"object"==typeof a[0])return a;throw new Error("couldn't understand path "+a)},i.Handlers=h,i.Parser=g;var j=new i;j.JSONPath=i,b.exports=j},{"./dict":2,"./handlers":4,"./parser":6,assert:8}],6:[function(a,b,c){var d=a("./grammar"),e=a("../generated/parser"),f=function(){var a=new e.Parser,b=a.parseError;return a.yy.parseError=function(){a.yy.ast&&a.yy.ast.initialize(),b.apply(a,arguments)},a};f.grammar=d,b.exports=f},{"../generated/parser":1,"./grammar":3}],7:[function(a,b,c){function d(a){return String(a).match(/^[0-9]+$/)?parseInt(a):Number.isFinite(a)?parseInt(a,10):0}b.exports=function(a,b,c,e){if("string"==typeof b)throw new Error("start cannot be a string");if("string"==typeof c)throw new Error("end cannot be a string");if("string"==typeof e)throw new Error("step cannot be a string");var f=a.length;if(0===e)throw new Error("step cannot be zero");if(e=e?d(e):1,b=b<0?f+b:b,c=c<0?f+c:c,b=d(0===b?0:b||(e>0?0:f-1)),c=d(0===c?0:c||(e>0?f:-1)),b=e>0?Math.max(0,b):Math.min(f,b),c=e>0?Math.min(c,f):Math.max(-1,c),e>0&&c<=b)return[];if(e<0&&b<=c)return[];for(var g=[],h=b;h!=c&&!(e<0&&h<=c||e>0&&h>=c);h+=e)g.push(a[h]);return g}},{}],8:[function(a,b,c){function d(a,b){return n.isUndefined(b)?""+b:n.isNumber(b)&&!isFinite(b)?b.toString():n.isFunction(b)||n.isRegExp(b)?b.toString():b}function e(a,b){return n.isString(a)?a.length<b?a:a.slice(0,b):a}function f(a){return e(JSON.stringify(a.actual,d),128)+" "+a.operator+" "+e(JSON.stringify(a.expected,d),128)}function g(a,b,c,d,e){throw new q.AssertionError({message:c,actual:a,expected:b,operator:d,stackStartFunction:e})}function h(a,b){a||g(a,!0,b,"==",q.ok)}function i(a,b){if(a===b)return!0;if(n.isBuffer(a)&&n.isBuffer(b)){if(a.length!=b.length)return!1;for(var c=0;c<a.length;c++)if(a[c]!==b[c])return!1;return!0}return n.isDate(a)&&n.isDate(b)?a.getTime()===b.getTime():n.isRegExp(a)&&n.isRegExp(b)?a.source===b.source&&a.global===b.global&&a.multiline===b.multiline&&a.lastIndex===b.lastIndex&&a.ignoreCase===b.ignoreCase:n.isObject(a)||n.isObject(b)?k(a,b):a==b}function j(a){return"[object Arguments]"==Object.prototype.toString.call(a)}function k(a,b){if(n.isNullOrUndefined(a)||n.isNullOrUndefined(b))return!1;if(a.prototype!==b.prototype)return!1;if(n.isPrimitive(a)||n.isPrimitive(b))return a===b;var c=j(a),d=j(b);if(c&&!d||!c&&d)return!1;if(c)return a=o.call(a),b=o.call(b),i(a,b);var e,f,g=r(a),h=r(b);if(g.length!=h.length)return!1;for(g.sort(),h.sort(),f=g.length-1;f>=0;f--)if(g[f]!=h[f])return!1;for(f=g.length-1;f>=0;f--)if(e=g[f],!i(a[e],b[e]))return!1;return!0}function l(a,b){return!(!a||!b)&&("[object RegExp]"==Object.prototype.toString.call(b)?b.test(a):a instanceof b||!0===b.call({},a))}function m(a,b,c,d){var e;n.isString(c)&&(d=c,c=null);try{b()}catch(f){e=f}if(d=(c&&c.name?" ("+c.name+").":".")+(d?" "+d:"."),a&&!e&&g(e,c,"Missing expected exception"+d),!a&&l(e,c)&&g(e,c,"Got unwanted exception"+d),a&&e&&c&&!l(e,c)||!a&&e)throw e}var n=a("util/"),o=Array.prototype.slice,p=Object.prototype.hasOwnProperty,q=b.exports=h;q.AssertionError=function(a){this.name="AssertionError",this.actual=a.actual,this.expected=a.expected,this.operator=a.operator,a.message?(this.message=a.message,this.generatedMessage=!1):(this.message=f(this),this.generatedMessage=!0);var b=a.stackStartFunction||g;if(Error.captureStackTrace)Error.captureStackTrace(this,b);else{var c=new Error;if(c.stack){var d=c.stack,e=b.name,h=d.indexOf("\n"+e);if(h>=0){var i=d.indexOf("\n",h+1);d=d.substring(i+1)}this.stack=d}}},n.inherits(q.AssertionError,Error),q.fail=g,q.ok=h,q.equal=function(a,b,c){a!=b&&g(a,b,c,"==",q.equal)},q.notEqual=function(a,b,c){a==b&&g(a,b,c,"!=",q.notEqual)},q.deepEqual=function(a,b,c){i(a,b)||g(a,b,c,"deepEqual",q.deepEqual)},q.notDeepEqual=function(a,b,c){i(a,b)&&g(a,b,c,"notDeepEqual",q.notDeepEqual)},q.strictEqual=function(a,b,c){a!==b&&g(a,b,c,"===",q.strictEqual)},q.notStrictEqual=function(a,b,c){a===b&&g(a,b,c,"!==",q.notStrictEqual)},q.throws=function(a,b,c){m.apply(this,[!0].concat(o.call(arguments)))},q.doesNotThrow=function(a,b){m.apply(this,[!1].concat(o.call(arguments)))},q.ifError=function(a){if(a)throw a};var r=Object.keys||function(a){var b=[];for(var c in a)p.call(a,c)&&b.push(c);return b}},{"util/":11}],9:[function(a,b,c){"function"==typeof Object.create?b.exports=function(a,b){a.super_=b,a.prototype=Object.create(b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}})}:b.exports=function(a,b){a.super_=b;var c=function(){};c.prototype=b.prototype,a.prototype=new c,a.prototype.constructor=a}},{}],10:[function(a,b,c){b.exports=function(a){return a&&"object"==typeof a&&"function"==typeof a.copy&&"function"==typeof a.fill&&"function"==typeof a.readUInt8}},{}],11:[function(a,b,c){(function(b,d){function e(a,b){var d={seen:[],stylize:g};return arguments.length>=3&&(d.depth=arguments[2]),arguments.length>=4&&(d.colors=arguments[3]),p(b)?d.showHidden=b:b&&c._extend(d,b),v(d.showHidden)&&(d.showHidden=!1),v(d.depth)&&(d.depth=2),v(d.colors)&&(d.colors=!1),v(d.customInspect)&&(d.customInspect=!0),d.colors&&(d.stylize=f),i(d,a,d.depth)}function f(a,b){var c=e.styles[b];return c?"["+e.colors[c][0]+"m"+a+"["+e.colors[c][1]+"m":a}function g(a,b){return a}function h(a){var b={};return a.forEach(function(a,c){b[a]=!0}),b}function i(a,b,d){if(a.customInspect&&b&&A(b.inspect)&&b.inspect!==c.inspect&&(!b.constructor||b.constructor.prototype!==b)){var e=b.inspect(d,a);return t(e)||(e=i(a,e,d)),e}var f=j(a,b);if(f)return f;var g=Object.keys(b),p=h(g);if(a.showHidden&&(g=Object.getOwnPropertyNames(b)),z(b)&&(g.indexOf("message")>=0||g.indexOf("description")>=0))return k(b);if(0===g.length){if(A(b)){var q=b.name?": "+b.name:"";return a.stylize("[Function"+q+"]","special")}if(w(b))return a.stylize(RegExp.prototype.toString.call(b),"regexp");if(y(b))return a.stylize(Date.prototype.toString.call(b),"date");if(z(b))return k(b)}var r="",s=!1,u=["{","}"];if(o(b)&&(s=!0,u=["[","]"]),A(b)){r=" [Function"+(b.name?": "+b.name:"")+"]"}if(w(b)&&(r=" "+RegExp.prototype.toString.call(b)),y(b)&&(r=" "+Date.prototype.toUTCString.call(b)),z(b)&&(r=" "+k(b)),0===g.length&&(!s||0==b.length))return u[0]+r+u[1];if(d<0)return w(b)?a.stylize(RegExp.prototype.toString.call(b),"regexp"):a.stylize("[Object]","special");a.seen.push(b);var v;return v=s?l(a,b,d,p,g):g.map(function(c){return m(a,b,d,p,c,s)}),a.seen.pop(),n(v,r,u)}function j(a,b){if(v(b))return a.stylize("undefined","undefined");if(t(b)){var c="'"+JSON.stringify(b).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return a.stylize(c,"string")}return s(b)?a.stylize(""+b,"number"):p(b)?a.stylize(""+b,"boolean"):q(b)?a.stylize("null","null"):void 0}function k(a){return"["+Error.prototype.toString.call(a)+"]"}function l(a,b,c,d,e){for(var f=[],g=0,h=b.length;g<h;++g)F(b,String(g))?f.push(m(a,b,c,d,String(g),!0)):f.push("");return e.forEach(function(e){e.match(/^\d+$/)||f.push(m(a,b,c,d,e,!0))}),f}function m(a,b,c,d,e,f){var g,h,j;if(j=Object.getOwnPropertyDescriptor(b,e)||{value:b[e]},j.get?h=j.set?a.stylize("[Getter/Setter]","special"):a.stylize("[Getter]","special"):j.set&&(h=a.stylize("[Setter]","special")),F(d,e)||(g="["+e+"]"),h||(a.seen.indexOf(j.value)<0?(h=q(c)?i(a,j.value,null):i(a,j.value,c-1),h.indexOf("\n")>-1&&(h=f?h.split("\n").map(function(a){return"  "+a}).join("\n").substr(2):"\n"+h.split("\n").map(function(a){return"   "+a}).join("\n"))):h=a.stylize("[Circular]","special")),v(g)){if(f&&e.match(/^\d+$/))return h;g=JSON.stringify(""+e),g.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(g=g.substr(1,g.length-2),g=a.stylize(g,"name")):(g=g.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),g=a.stylize(g,"string"))}return g+": "+h}function n(a,b,c){var d=0;return a.reduce(function(a,b){return d++,b.indexOf("\n")>=0&&d++,a+b.replace(/\u001b\[\d\d?m/g,"").length+1},0)>60?c[0]+(""===b?"":b+"\n ")+" "+a.join(",\n  ")+" "+c[1]:c[0]+b+" "+a.join(", ")+" "+c[1]}function o(a){return Array.isArray(a)}function p(a){return"boolean"==typeof a}function q(a){return null===a}function r(a){return null==a}function s(a){return"number"==typeof a}function t(a){return"string"==typeof a}function u(a){return"symbol"==typeof a}function v(a){return void 0===a}function w(a){return x(a)&&"[object RegExp]"===C(a)}function x(a){return"object"==typeof a&&null!==a}function y(a){return x(a)&&"[object Date]"===C(a)}function z(a){return x(a)&&("[object Error]"===C(a)||a instanceof Error)}function A(a){return"function"==typeof a}function B(a){return null===a||"boolean"==typeof a||"number"==typeof a||"string"==typeof a||"symbol"==typeof a||void 0===a}function C(a){return Object.prototype.toString.call(a)}function D(a){return a<10?"0"+a.toString(10):a.toString(10)}function E(){var a=new Date,b=[D(a.getHours()),D(a.getMinutes()),D(a.getSeconds())].join(":");return[a.getDate(),J[a.getMonth()],b].join(" ")}function F(a,b){return Object.prototype.hasOwnProperty.call(a,b)}var G=/%[sdj%]/g;c.format=function(a){if(!t(a)){for(var b=[],c=0;c<arguments.length;c++)b.push(e(arguments[c]));return b.join(" ")}for(var c=1,d=arguments,f=d.length,g=String(a).replace(G,function(a){if("%%"===a)return"%";if(c>=f)return a;switch(a){case"%s":return String(d[c++]);case"%d":return Number(d[c++]);case"%j":try{return JSON.stringify(d[c++])}catch(b){return"[Circular]"}default:return a}}),h=d[c];c<f;h=d[++c])q(h)||!x(h)?g+=" "+h:g+=" "+e(h);return g},c.deprecate=function(a,e){function f(){if(!g){if(b.throwDeprecation)throw new Error(e);b.traceDeprecation?console.trace(e):console.error(e),g=!0}return a.apply(this,arguments)}if(v(d.process))return function(){return c.deprecate(a,e).apply(this,arguments)};if(!0===b.noDeprecation)return a;var g=!1;return f};var H,I={};c.debuglog=function(a){if(v(H)&&(H=b.env.NODE_DEBUG||""),a=a.toUpperCase(),!I[a])if(new RegExp("\\b"+a+"\\b","i").test(H)){var d=b.pid;I[a]=function(){var b=c.format.apply(c,arguments);console.error("%s %d: %s",a,d,b)}}else I[a]=function(){};return I[a]},c.inspect=e,e.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},e.styles={special:"cyan",number:"yellow",boolean:"yellow",undefined:"grey",null:"bold",string:"green",date:"magenta",regexp:"red"},c.isArray=o,c.isBoolean=p,c.isNull=q,c.isNullOrUndefined=r,c.isNumber=s,c.isString=t,c.isSymbol=u,c.isUndefined=v,c.isRegExp=w,c.isObject=x,c.isDate=y,c.isError=z,c.isFunction=A,c.isPrimitive=B,c.isBuffer=a("./support/isBuffer");var J=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];c.log=function(){console.log("%s - %s",E(),c.format.apply(c,arguments))},c.inherits=a("inherits"),c._extend=function(a,b){if(!b||!x(b))return a;for(var c=Object.keys(b),d=c.length;d--;)a[c[d]]=b[c[d]];return a}}).call(this,a("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./support/isBuffer":10,_process:14,inherits:9}],12:[function(a,b,c){},{}],13:[function(a,b,c){(function(a){function b(a,b){for(var c=0,d=a.length-1;d>=0;d--){var e=a[d];"."===e?a.splice(d,1):".."===e?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c--;c)a.unshift("..");return a}function d(a){"string"!=typeof a&&(a+="");var b,c=0,d=-1,e=!0;for(b=a.length-1;b>=0;--b)if(47===a.charCodeAt(b)){if(!e){c=b+1;break}}else-1===d&&(e=!1,d=b+1);return-1===d?"":a.slice(c,d)}function e(a,b){if(a.filter)return a.filter(b);for(var c=[],d=0;d<a.length;d++)b(a[d],d,a)&&c.push(a[d]);return c}c.resolve=function(){for(var c="",d=!1,f=arguments.length-1;f>=-1&&!d;f--){var g=f>=0?arguments[f]:a.cwd();if("string"!=typeof g)throw new TypeError("Arguments to path.resolve must be strings");g&&(c=g+"/"+c,d="/"===g.charAt(0))}return c=b(e(c.split("/"),function(a){return!!a}),!d).join("/"),(d?"/":"")+c||"."},c.normalize=function(a){var d=c.isAbsolute(a),g="/"===f(a,-1);return a=b(e(a.split("/"),function(a){return!!a}),!d).join("/"),a||d||(a="."),a&&g&&(a+="/"),(d?"/":"")+a},c.isAbsolute=function(a){return"/"===a.charAt(0)},c.join=function(){var a=Array.prototype.slice.call(arguments,0);return c.normalize(e(a,function(a,b){if("string"!=typeof a)throw new TypeError("Arguments to path.join must be strings");return a}).join("/"))},c.relative=function(a,b){function d(a){for(var b=0;b<a.length&&""===a[b];b++);for(var c=a.length-1;c>=0&&""===a[c];c--);return b>c?[]:a.slice(b,c-b+1)}a=c.resolve(a).substr(1),b=c.resolve(b).substr(1);for(var e=d(a.split("/")),f=d(b.split("/")),g=Math.min(e.length,f.length),h=g,i=0;i<g;i++)if(e[i]!==f[i]){h=i;break}for(var j=[],i=h;i<e.length;i++)j.push("..");return j=j.concat(f.slice(h)),j.join("/")},c.sep="/",c.delimiter=":",c.dirname=function(a){if("string"!=typeof a&&(a+=""),0===a.length)return".";for(var b=a.charCodeAt(0),c=47===b,d=-1,e=!0,f=a.length-1;f>=1;--f)if(47===(b=a.charCodeAt(f))){if(!e){d=f;break}}else e=!1;return-1===d?c?"/":".":c&&1===d?"/":a.slice(0,d)},c.basename=function(a,b){var c=d(a);return b&&c.substr(-1*b.length)===b&&(c=c.substr(0,c.length-b.length)),c},c.extname=function(a){"string"!=typeof a&&(a+="");for(var b=-1,c=0,d=-1,e=!0,f=0,g=a.length-1;g>=0;--g){var h=a.charCodeAt(g);if(47!==h)-1===d&&(e=!1,d=g+1),46===h?-1===b?b=g:1!==f&&(f=1):-1!==b&&(f=-1);else if(!e){c=g+1;break}}return-1===b||-1===d||0===f||1===f&&b===d-1&&b===c+1?"":a.slice(b,d)};var f="b"==="ab".substr(-1)?function(a,b,c){return a.substr(b,c)}:function(a,b,c){return b<0&&(b=a.length+b),a.substr(b,c)}}).call(this,a("_process"))},{_process:14}],14:[function(a,b,c){function d(){throw new Error("setTimeout has not been defined")}function e(){throw new Error("clearTimeout has not been defined")}function f(a){if(l===setTimeout)return setTimeout(a,0);if((l===d||!l)&&setTimeout)return l=setTimeout,setTimeout(a,0);try{return l(a,0)}catch(b){try{return l.call(null,a,0)}catch(b){return l.call(this,a,0)}}}function g(a){if(m===clearTimeout)return clearTimeout(a);if((m===e||!m)&&clearTimeout)return m=clearTimeout,clearTimeout(a);try{return m(a)}catch(b){try{return m.call(null,a)}catch(b){return m.call(this,a)}}}function h(){q&&o&&(q=!1,o.length?p=o.conar index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    var index = this._findSourceIndex(aSource);
	    if (index >= 0) {
	      return this.sourcesContent[index];
	    }
	
	    var relativeSource = aSource;
	    if (this.sourceRoot != null) {
	      relativeSource = util.relative(this.sourceRoot, relativeSource);
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }
	
	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + relativeSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
	      }
	    }
	
	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    source = this._findSourceIndex(source);
	    if (source < 0) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }
	
	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }
	
	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };
	
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	
	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The first parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');
	
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	
	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');
	
	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;
	
	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
	    }
	  });
	}
	
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }
	
	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];
	
	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }
	
	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content) {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based. 
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer._findSourceIndex(util.gear index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    var index = this._findSourceIndex(aSource);
	    if (index >= 0) {
	      return this.sourcesContent[index];
	    }
	
	    var relativeSource = aSource;
	    if (this.sourceRoot != null) {
	      relativeSource = util.relative(this.sourceRoot, relativeSource);
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }
	
	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + relativeSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
	      }
	    }
	
	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    source = this._findSourceIndex(source);
	    if (source < 0) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }
	
	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }
	
	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };
	
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	
	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The first parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');
	
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	
	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');
	
	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;
	
	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
	    }
	  });
	}
	
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }
	
	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];
	
	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }
	
	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content) {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based. 
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer._findSourceIndex(util.gear index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    var index = this._findSourceIndex(aSource);
	    if (index >= 0) {
	      return this.sourcesContent[index];
	    }
	
	    var relativeSource = aSource;
	    if (this.sourceRoot != null) {
	      relativeSource = util.relative(this.sourceRoot, relativeSource);
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }
	
	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + relativeSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
	      }
	    }
	
	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    source = this._findSourceIndex(source);
	    if (source < 0) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }
	
	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }
	
	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };
	
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	
	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The first parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');
	
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	
	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');
	
	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;
	
	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
	    }
	  });
	}
	
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }
	
	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];
	
	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }
	
	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content) {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based. 
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer._findSourceIndex(util.gear index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    var index = this._findSourceIndex(aSource);
	    if (index >= 0) {
	      return this.sourcesContent[index];
	    }
	
	    var relativeSource = aSource;
	    if (this.sourceRoot != null) {
	      relativeSource = util.relative(this.sourceRoot, relativeSource);
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }
	
	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + relativeSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
	      }
	    }
	
	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    source = this._findSourceIndex(source);
	    if (source < 0) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }
	
	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }
	
	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };
	
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	
	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The first parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');
	
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	
	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');
	
	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;
	
	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
	    }
	  });
	}
	
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }
	
	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];
	
	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }
	
	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content) {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based. 
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer._findSourceIndex(util.gear index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    var index = this._findSourceIndex(aSource);
	    if (index >= 0) {
	      return this.sourcesContent[index];
	    }
	
	    var relativeSource = aSource;
	    if (this.sourceRoot != null) {
	      relativeSource = util.relative(this.sourceRoot, relativeSource);
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }
	
	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + relativeSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
	      }
	    }
	
	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    source = this._findSourceIndex(source);
	    if (source < 0) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }
	
	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }
	
	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };
	
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	
	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The first parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');
	
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	
	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');
	
	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;
	
	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
	    }
	  });
	}
	
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }
	
	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];
	
	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }
	
	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content) {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based. 
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer._findSourceIndex(util.ge/**
Get the element type of an `Iterable`/`AsyncIterable`. For example, an array or a generator.

This can be useful, for example, if you want to get the type that is yielded in a generator function. Often the return type of those functions are not specified.

This type works with both `Iterable`s and `AsyncIterable`s, so it can be use with synchronous and asynchronous generators.

Here is an example of `IterableElement` in action with a generator function:

@example
```
function * iAmGenerator() {
	yield 1;
	yield 2;
}

type MeNumber = IterableElement<ReturnType<typeof iAmGenerator>>
```

And here is an example with an async generator:

@example
```
async function * iAmGeneratorAsync() {
	yield 'hi';
	yield true;
}

type MeStringOrBoolean = IterableElement<ReturnType<typeof iAmGeneratorAsync>>
```

Many types in JavaScript/TypeScript are iterables. This type works on all types that implement those interfaces. For example, `Array`, `Set`, `Map`, `stream.Readable`, etc.

An example with an array of strings:

@example
```
type MeString = IterableElement<string[]>
```
*/
export type IterableElement<TargetIterable> =
	TargetIterable extends Iterable<infer ElementType> ?
	ElementType :
	TargetIterable extends AsyncIterable<infer ElementType> ?
	ElementType :
	never;
                                                                                                                                                                                                                                                              BG��&�mA��~��d�n�-�i�%.U\�-,~���H�T�/���`��4��K��j�̖�ϪS9l�|��P� ��Vo��r��>��J�5~��k[}�TGdg�pY�T9��J�����3r�j�;�h~C�D0A
��{�z'j�s6zƭl�����V��6����`JFV�{�o�K\(��_��]�@�v/�S���DD�e
�V�X����c �_�H�>ܮ�/&T}�^Y���#��I�&��>9&��yO'��ipzF�P�M�ȴ�5e�c��<�`���Þ<;zr3_ܻ�n�Uo\�jT�~�ޡ�R�&�;��q����>��v�����1z$�~�}����,�����A��xҧ�s����=��!��ؘ�?�VP@E\��˒���1��j�.��FroL":�X�.`H�InSvU�#�R��Sl_q���A?v���0L2���p̬J�0�:�*}��/s��R3�o�]�O� b��՜�ů`�̈́!6e��!l5dR ͪ��]�9���_��74� <#X%�$�V���+�;�$C�an��f��\�^'�k����wŸ�D���\�%�Ќ��$����KƔ�O;A��)���QvJ��j������:Y�1�X,n���שj��!���^3�ǒ��^q&��s��i���C�&�)�%��K!q;�ya)�)*]��G�|�ZpkYN�\Ru�,��+�����3�@Z���ml�M����R��>s��O4SO	}tI�
nt\x����	���>Y�� ��s8z�*;�k;��FJ���n�?�� oC��P��ޫ/���f���q��R��?N�B�ŷ�����v�p�1C3X��~�e�҂�j$��W@�:��V��H�	������ŉ�Bg~�e_&Pm�&�����"�r��z���)@�����$||��������'��K��/W���t��w�]3b����v7���قq�zF�_�<S�C��5�~��f�D`P�4򳩛��"����ó�)����K���(Ȑ�eF/�BGy�ǩ;'�"8���(6�_���C&M���l9ȭ�	gx��� �2����ܱ瑝�A{A��ٸ�w6 ݍ�俷��v-l���UfYW�m��)�[,M�\��^.���O�v����S�B�`��4]���H�g��2���[� ��q*����պ�Fc��E�_~p3:J��k���m=F�<�Ҋ)W�m_ׄ�Fv�b��Ly����Sc���T�g�
���C��� :�r��E�EB�p�:�����,ڀ��>K�Tƴb.���?XH�t;�y\J_|6��D���'ua��n����G��V_�f>���]L�`��IK'p�eui��>e��৞C�45�ϸ4����W�w���dw%�˷����	YlK��B�k����&oJ+qStR���AՒ�EU�!�������<"� 8�Ul��8E��Y�\\o(�e͋��B�{<\%UY�,<X"�% (��~�,AC%�'��l��B"�Q>@��s����k!1�)<�ɔ�m�j��}}�k��x�wE�#�ht�b������^���ŤG�x��7*J*�tq7�|1�����%�!����ml�C��+�%�nFٲe.Ϋ�`��?��?�5���o��v���Mf�b�(��!��>m֞EHJBp[�y� 	"�����
�+3�	�U��}�X%R\B�_��H�������ڤk�Zc���t>���VQl+���$M�W
�.?a���u�����7052�A�%�&c1`�ڥ:���lt%�f9-EN��Ө���1>v�f�`ȝ�*`�B?Ռc������&�׼6��c~��.b���-*�X���u��x���_��7�k�A%�T���yF��p��7��3x�Hi�v#ja�����G��X�I����Zo����֋��;BX��E�@W͜������S�/4�����k�p����g=g�4�UϵXٵp�=	����C�fl*O)����m��Gi�8��q�y&N����rX�
p2�f�o�gj�.� �+���?`t]�{���J�b����vJD�cڙ����}\y��Ș���5�tQUe���5}w�N�����ވcU1͒�5������c�?���q���Frbq��L�-p砟x�f�4�@=���ys�s7Aέ��E�fu��o���ˇ�A��n#N�.9<�bV����ƈ�I�U���Z5s.a�,0B�o�i�*��	Ҕ\NO'j�9�J �2��Ci�)Un��Hv�-�̀���%Ć!�Y/j,�Ȃ�LQH�w3e��D�)�� �U�-��"�W���16�$�X�C�@Y�����S�a��It.�Kr-��?�d��c�|6�E��ٙpm�4/����5�E�&�pԊ����t��q�y� ���Ǿ,� SD���-��6j#�Z����Y�}��� {u{�I�����a�3�y�Q�R�q��h�?��I�&�������]�Բ0+�`��A�F�����^�q�Hi��#��� ��|�5��m|G/�§YM���
�({6#��1�{�|�x�_כ'�Ƒ�Я��P^q?���N�����Ņ}A �K���4HR�o܂+z�ݰp&hg)���ԯ�a�g����P1�ZN[whW�9zP+���p�i��(?����
H2�EF�)/�O�&�;M4Rz��G��f�G�1<��BpY��Y�}��X���Oj�0���נ�fU}+��gHC��	��H��п�3���Iw<��oq>���M�<K�	����ʐ0�,CD�|gk�:%v�w�Z���n�Y�CS|��J%����&7@�}�t��i���7�����"��R�YE3�56CM�B�iw1��Q�(���Ir}�jt(]�wP�Q�(��\t�*F7!R�) $�d�:�G~�H��>
s;7'�{<���(n��-Q'8L<�b@i�ŧ��c�$2Γ}�V�I� �_s���3R�.X-�\���=�F�d��{�2���hخ�O*z��=P"ŏ�J�Z��~�M�	H"�������5�D�'1'���^m�Y�P�K׷����[�[p��mshЊy�(�����/H�M�+��6�y�wvBǎN%�����ֻ���K�۩X��jDs1�*������d���B�Ѩ:')��&j��|��C�)�A�b�v�E�mipUȬ��R�Z����$1�_��Џ�H�Q���x>�	1��9��Ln���/��Qǀ����
an�R��w��ܷwz���J>��Z��u+.�X��D�U?���m��&�ƥu|a��`�g׎ מ ��.�6���)N�����3ۇQ�hV 0}��N�`I�#�	���V���5#N;�iq?�pvż�O*�$��"�9dh���U�,�jK������{�S��яt���ڻmH���ٹwo���F�(g�FTw�d�HN	��FK�"��P�x`�œ`j�T�&����>���=�V�+S�`�-H`#$�*#/ʑU�:��;?��CS�6�=�I�g(bD(1��.�z�Z$���bb�ؽ����:�x��%�Ý�`P�L�$H;h�n�d�v�B��)���O��'����%�9�J$F�������{�	��/DN���ނ��͏Vy��aThm<��zs@���V��ڙ����A@Z���E^��3)E�
1!e�A
��i�v9�x�H������c���$q�}��xj]������������z<�&z��Ը��^�Ul�O9б�)�nF���Z��а>5�U�8�3 *����q���ϔ-�/�S�~�W����"���{���C����j�!$Y}
%Ӧ5����|�C?bC��4�W�FI��`3̔��e�G��������m�$ϓF>o�3�H�S�(b	������N�8�	��,rH0��~�,xD�������m|=���1�^S�G�T=n6;���K�|��P@��y60��XB�a��
"�&�Q����U�ѓ��
C�?��$��+=J����Ҩ"s��]�fF��weXzqO�u��!���:�[M��Tb�|�aE�k�P��(���;y}`#j�E����B>hH�P��A�E�䄡�pM'���[1�[�E���$�h�!̜� �����Ș[M]g��f�}�;�{Y��y~4{��a���(���l;5C�v}p��KA@�R��nM����9��OB�8�V�B���/��@��e���u��q�6J���Bs�~�U���M`�\E~��:�;�;}����U��y�>�ؐq
��m�%��{�Sཅ�P��݋��;4ϡ�;�+o~`L&Eެ���L�y�6O�d���|da�HwϘ�,9��^�p�8���h1����Cn�F��qU������e_��#�∦UL伇I��r�UMZ�%��U��7�	��D"\���LI_D4F�Tk��'@}�(XP�uy���I��R��pM�~�`ˊ���N�%? ��P��\�o�D��e8K��fה�5���Yd ���0�O �$��}4/��0g|x�{0�NI?��V�|nS��F[�G����"y]^���9s��v�#[�>�����"�m��p��Äv��F����$��Y��D��5�\^j��*1	��w!�#-ȢFGP�������FN�b����]&&n�-�.�V��������U~�s��>��9�=�|7X#rB��Tt��3�1��H��V�v�8�����q�����II���(/�ϺJ�"�-�Kz<�C�o#�͙{���s-����t�x�T����� ����q�3fE����~��*���M��m��t9<?Vd�/j����X��=`jK�x�&̔�Vy�)�.I	#��)�q��I�JL�dՀ5���3��3��Gu�6�K��r��
�X���3�M��f�o���ɸ��
��4NٯB�(%�_���.� ���3�zgI�Ԯ�[����k����j�����-)l?�.:�{��Oap)�6��~��`i���,�?,���.����,2&����N���El|����~6`��u�]��Û(�3N��րW�% ���R��������)��\[hw�Qm��$��"ڭ���G�&zI�1�?�i �� ᣒKM��N�4	�`��*他(1���m�(&��ι�rJ� ������YY�̿D�3w9������iyu�����d~��������j�Jt̢�褀!�169��57q�m���1)Z�|�$�b�jR�H�\m�j؄���MW��@��2�D���/�&>g�^�B?`�f'�	��gl�Ze�L��y�`�Ě��*��Ex������*Ǚ��rL>��~X��~/���������	sVq�����Eb�6~������/M �tP>6�؉!�/w�tͪ�!�i� -�7��_��٬�$�z��y1h5dE,�V�5U��v	�����э�c���t[=ʖ���ʪ��6m��٦@�5p�9W!:�$�gqT�����GR,5�N��޾>�	;�&��<�D1������;�5��wt~����ϕ_�7�j�$�:��$�
�J�ǧ�C��?��d�_�0"�Ь'���2՛��c�\N�MLH�Fk�.P|�[.͢�Y�\�����'��mFáŋ�C�
���@VLѾ��My��I~��x���-������A-��1Z_��XjG2�n��o=-t%��Z������iP�ͳ9.��Ñ���u��4�5�:`�l�Lb;>l��e9\"3p�^;/1���^ta�� ��\&҄K-V|�ڊ�W��8z��U�wmyxݔ��]�ٱ\���ۓv��NҜ��9�<�j�۝�ۮJ��.���48=����ƫ�(�0ѱQ^�f5��5�
��©{N��Qe	���u{��)a��������a���M�8���~��L��V�fqШ��:O���&�1��ߤ'������ۈ��3���1f�<�Kt�&���m��{�u��ܥ���`A�A/���A�>�)�r=���o��?G�'��/(���E��X7��?��5҉o3mד�y����]�v��{�9���W��؏����o���7�@[m��r]^������p�����Σ� e��mՆ?xU[���sLP���� %D9����c�򶈤좿��஭�{еkDN
A�Ԇ�O�v��0�%���M�`�O��?������LQ�FM7\�Z�����#Gɩ~�E��iU1�xx�L�ɮ���'u����p�l��/��r !��R�a��^�F59�v��]�	�ZK5P0���>v%�R��� �*a[ۂ/����ޤ�px�]ԨR�p�$ð�7�5
������ȧN�L����̄�Ä\�9�8�s�]�	�p������8���tp,'��M;�q�Rm}˱��ޡ(��'��u5��D�W�|�]�ٵ319�S�GH���+��+Q�i�ҪE��۞�U8�"uT�M�Y�Q��~�t�,���Oa�[���(4+:ۯT��x�lM�^�F�� q�<3�u�d��n|�P��h�J��u5�;���@q����ǒX�m�5�|�܁�����2��x��M��PS������ME�kW1)�7�9���C@VE]��J媯��J����Tr#���ad��	q{Ĩ8˰�x7x��PT)�h������&��i�B#K��������8���ѤaQ��#ߏvv�ȷ�y�uX�3nC�i�0G}o'Y����㷃�X��Z�GNHɊ5��[9j��d�2�* </�15�
lo�8���{��H�ΛC\�%gV�h�G-�O�Kٰ�u��k�z�U�7��Y��_NW�䉾�  !����q��d
�٭�ּhk8�IK��QX�-8�4f��畎A�l��]�d�N	���'��[c�M>�~�8��.�O���@�J6�
�=� X�6�Ǧs�C��+����x�2���[<�[�ڗ7DZCU��D~��{�G8b�j(���K��y�,�.�[�����(�����a���\��w�7n���}��;��T��ژ*U���Ih뱔�`�f���=ZV���Ծ3�7��s����7J��<�N�R��S@ ���];���v�Ja���~���(�Umj��σ���G#NR�{��Ϣ�z�����u~א��3ҟ���W��1�뫢詽cem��;k9�$�ھF r 7!���G���p�2/�U���W²Z*ȪM����V"P��Frlri�g�K讝o����UjoI�8n}�"�Gp3�"�����Z7Z8�+�]]gH�-��5RzHY�dm:Fh�>�� �Rؖ�*�~i
nYĊ�3��p\�t �Ũ�ɧ��`0`GHPJ+�@Z�|�����]v b��!������ʻL`d.u>�8F�n����;&��w�aW4��'���9�{T'ʸ�.��+�Ƞ�2�@H="��XD8�6
X\�����uY>q��`��'g� ia��8�TT$��A��`��y\z��y]m��*�k/�	lT��{�P�=-C���:�U��VP/Wo��B`X�y����%"��½���������)���ӹe���1�7�7������$��5d7�8� �{��%�  ,A�K ���j`+;j�qt���%�y���EvH������I��o����ĺ�a���X��]�fp9q����@Fn��q��
�{rS��C��x�@�\��5R�<Lʮ�0C#�{^��|�pw�^� Z�3 ���^\9����8�\��� �g'������N�Wa�-)�HXb��d��M�z|�����>����8���L�yh�B�)��S��w7o���Yy�hR�L�������X�'���oo���������Ыv���)��JY���z�c/֝�/��Ky�$}��ׂR�k���U@�0�#v閖��.6��U����c�B�͡4�7t�˗2��_�}��'�SzI�Ǝ��4��B��a����,d���kD�|fj }��7@)��,�+m��f�jǍ^@��O���k�������(N*9�1�sP�d)�d�?�����!d��η��ү��gU�^~�����÷�j���Ai&��iy72`u�y�5^%�������N����E���dn1AAB �ι10���^�bo�mD��a�Z�J&  f>BE�JZ�;>]���7�<]H�jl�҇#�`�`�\''�פ���f�k-T�^���K�FI��C�����'>fwp����������aR�N��s�׌I���+�^%�-J
|D*�I��"eWC��
��B��ЅWƪ��H�*xr>��\Y�-�����{#�6Y+}�a[W��#�UX�GjPf�&g���z�@<n�^L�IK���֭3VnC��$��Y_C�p
f�G�4hl�!�Y�Xl:ޫ�%��xX*8�w�
Õ��f&1�?���W�1aE�>{}���Xgp���`����%�o8�h� ���q�|*���8]���pѨ�Zۑ�^��xRp�h�~�K�2���^=����:�⿲�޺#�a] �7���4<����d�����(YO �a��6$�^/i����������+�8k��F�k��E|�^ʦ�a��綅�s���հ�=��XMvfb0vaUR�p@��GjD�v��_�q�, �g�a��I&^�%Q¾����,��Щ2�����4��u��d�o�1���궟@n꺦]M�㗪%FJm���O�&�{f���iM8�%�v��D��@��y�^Qy����2�>U�\��a9$��^�]\����$�^�E	�z|F7G�'�$_�u�ך(�����¶mCl���)�`Q�{0N4cM��Am��w }���+]u��]��$���Яu�e��Md��="�G���D��3�3@	7��We˼S�[�򛥚��7�Th�cн�kf9���i���X��p�&ح�v)�8�mEOWj��Y	6�߬�o�9Sf������B􌾉t�R~���WKL>"��R�/�ez�=��K�G;P@�^��WA�XJ����S�+܈�P"����Ee��0�Z�|҅�.�\(�:Ad���>��HsP��(�~U�-�4o�� �\���܈��%��`���6�\�}�ҷD��br��b�N��֋b��4���{��
`���P��u�t��q�D���4���s�m?(΍�O�jݘ�1���7u�6�W��}�=b��\�l���1tZ&�����wȦ�v;�>��A_�n�B�HϢ�>o�J{�߃��������_cD��b�TO}�r�8��G��a�����!a�tnPO��.fZ#�uX������d����OORr�����v+�H1\>Z��k .ŦJ�Hok��@j��]1�%���:(��[F�Wnp6x��p�r����[����(qE�|Z�k�Ϣ�%�a��]����_�ς�#<�6,�l�M�V��&#5niG'{�]�?�� ;P��������;s���T׆$�7�X9�L͓��܁u���%�P��f��G����"Q�h�K����ゥw���?�+��ͶI�^����*�� \,�hQ߻)
�;d�'�F*E,  ^���.^�,L�����1n���03��}��b�'MC��	?�9EV*R�uE�Í�[���p���Y�K3�S� ���u����|�k�/�G|�5Kl"�t����h����q@��j�4~�Ls�}�pr�/?��q�%���6��f���h��$/r��$3��Fv1��k�8P�����Ԩ!Ѧã�S����q����R*����p�NzS:�W~�d�i��cX��x�zr�-��Յ�K�+�|�I��O�W�S�u�gf@�P��������m �8���p�Nq QYfg֓t�kl�jm����R�Q����Z��5y�4J;&?}��}��M�n�̚2���}f�.^�b�8���4�恻产@O���WZ��@{������︓�@�Mh��A������D�a���l�����e��_��ƙ��R�Yg�kwTn���V����ռ�<�e}b�ZX;���GTk1��Wߐ =�=՜{E{�wy6A�~�kR�Q�\�v�D�v�a	)y_6�ew�AM�d��c�h7�D��g�黻�AC�z
~�f��Q�p`r��A �5r�e~A')BL���n2�^�:�=�i��_$ Gt��A���(_�j���2A+T9'BXj��{���I7�Y8��!%%������[/�,�t� �����%��Z@��-Ґ�)ጉ.�N)O>�Vnt3���9���/(Z#*���t���;=�-a�˗�@(�.q�iȚ��f�^�<�M�8���~�r��ݼs�&��1y���r)�ʛ�}Ġ��j��w�]E�e`�=+i c5�I&��HG�����0eN
C�冾^#%��I���L�h�9QaI�_�8P��^��J��=Y��o?�0�]����+�
v�n�I��a��2��
��(ii��YU��*�� ���Խ����:n��ɥ`)��f��q� ���1��<{�h���i9��-+�j�(#�܈b��?wAA[�nݮؼqExA��
�I;)���24ޢ֬n�0��J9����!��������l�:��]�C����Q�n��s� �.���H�����>߱2��@05�F���Ӆע{�:�b�ݯV��+Ő�"��%�M���W���s�����x��֖i�S�&�i<%��-%{��T��x���l�5��x��䷖W�@��kVଯ/�'�.���X�\�����E�Zx�;��L(�9Xhp��Ӄ-�)�"s��CZ�KE��:���:��>�����ܠ[9�p),��N�T�|2���s"�]���㑧;B����/1��W(�z��+��0�S�5s\\�3v�%���&;b�Hضa$��E��L�Q��1-�l鈦#���&ᑊ�d]��0���WN����ui�)04&8X��Q�#�sFw#�Մ9G-J�����P���k�S����l��L�̅F��F�;_!2h�Ca���
�ٯ�Ƅ�{x�x����]cU��8��(X����.|9F�:��i���{@5uI��qE,�:�:�������'d7��=�뚱Y;�h��<>����%lT�F�B��qh�::���~�)�6�A�j@��Vr�B�q�Z$s��cOfާz���=!mS�e��PR�{��1�x��OAC��J1�o��_E���P�㑹�
�BADvY�z+�2o��M3}g�`��L���c��EX/�; =Z��)�Dk��e�@�w1�̌������嵛lB������H��]���m���*�� G��@>Q���r�*R��DC����$OM; ���٧�k (��J7�6$�A�w��j�.Ќ���v�)� {	�m�JnZ��?���*d}�֢k	6ǜ����>�FY���d����E1�k��w�3`��Y�N3[�{��Y/�`'	��8P�[�������S|8;���<5�я�t�B<-�A����i�����W�.T�?(#�)���)�E�2�פ�
����Ȫ"тE��=�nփ#�
��f�'�
'�$�
��s&/.]�{4#�GT��hn�6��s�j@?��T#gE�S�	�}m�?\Dɕf0d���O;��`slmƕI�'�n�uᑘ�8Y,�d��>3N_���ߧ�,�aI��my}�2S��5m�5>�������	�;�N̈Vf-M��c(r�֘tp�x����FA�g2StCti�w��2����|�M��$X%�d�t�R�{�ֶ�q��-�QH������I���>����(�T��A�\��:�C$��bk��Q���?�%;I^%��7�Ձڕ�8^��y��pS0�@�`?f̠@B{gm��Sz ��ῲ�@c��J1գ�:!c�
j<��7����
���l�I����^��f\��n�4_L��`�7k޶W�(�WZ��#+���v�Y���~D^@B�>�U	�(ޘ�S{��{�u����C{�ͼH@��'[;�ԍ7�G��F�}F�G+������j�)�N�����b���^��F$��M\���O��~�Wh�eg�Y(�cy���Vش�Ŵ�>����5�c��;1']?��}�1�v�]����U����v��*{^��yCde��1�q��u%ټ�d绞��(��֝{�1	�Wha�\����Z��(D�.��ng.���2���,I��,蹜K�D!���BBe��--��P��֡�
��$��?�ud!
��G����>����{���x.Վ�y5a$e�9�낟p��;�� �w!oٻ����dؚ�S���c~F�t��t	�:��tF�e�c�E[��}��>QI�tT>C1?b��`���#�lY4H���8Utz�������DfޱR6]�Kz���D�)�ﰶ-`A%�/�E^�	�5f��M�D�i�:�`kfu|�l��%k����RĖKd�V�`C�0�/�q�?s��B��G���� �w�n{/�Ae���e��	��J��k�;�(P��:UC�TDr�I8���
�2:2ѣ{��=��?��{ԛu-BS��F<2�0 :؜PGӯ2�L$�Q]�y����Um$�������DA��F̪��`�V}�f��D�*�y�����
����h���f�b�ƥ�7f.�����Q�dV0���S1����b���\�oh�#�E����=B���w�d}p�@�`+(�,�ӗhP��H�G{�b=��"Q2��f��sV���/3��2G�AUP�	O�M���Tbo�uƣ{�����W�SY�V���7�$��|������[�ÿ�]�6��F՛Q[h"p3/,[VB��y���B��vVrMF��GZ�T���:����5P���m�Zǜ�A�C[k����y��:���:Xe�k@��� d�]�&w��u�`�T�{�_+;Q��_��p�E��A��O�H<p�߹�}W҈�J��L��Z��@X���7�TPk�3��W�-�{apK��-�1���n6�(��wH�����D��m8�QD&�É[K��U�d�r���a��yܡ�2F�E��F��Ї�f�I����3�"�:�1����[D���Lo�	���(*R��e]���Nc�>4�Q�8����[�����Q��H1@]K�>$��`�>�I��Z-;b��.ă�`6�s��y�]��d&�����O�s��5�mMRMv���{�K�c�?Th&����tU�e|�R��w![���+�4�ɞy����	Y�N�ɾ�P~nfл���}�t��T���b�f�k}6���$Z}@"	�����_=nS��n��s�3V�κ���ݽ#����z��	�G,�K�sB��C�0U�&�f�M�J<�Lǃ�EO-u����	K��{w�LF�o(U�[���N�1d�jP�ud�-<�v�Jy���S����2LHЫrv���Y���+x��vx��m^H�^zgঐU�(i�[�S=P��*q�O�<�05i�H�s�c��g:{O���|�@��u���i+����Ky�(�b%��.C�0�Y��隭Sv�nq��.���\Ŝ�����t���X�|�IGxa!%���ܧXM��R��ܰ�uv�'����&B�
���zA�g�g�?W��q�~�����fj�f�M�}wu͒UZ_V�F�0��{��η�ö�T�f%zs��]~K3}�R�w�\�<KOX����1B1�����cg���|��75�:�±�gә��c�ߙ�Z|����?/��e�iA��X7����{���9I���\���[�X_{:Y���B��f;�۞� �b9�����^K,&h�ޓ�\�0��fB�C�I�d$"O����*7e7�9�k�w�jb`Ʌp�{I3b�u�'vó�:���]�=O�M����L�L��PR%YJ�k57�}��ma$3Ɍ�i�+��s_�N��Ǜ��r�8gM�b)�^�t��P ��JB��p��q�qgɹyS����:�-�� �-Tp�
!31k}�ђ�	���N��\��k�)A9��K.ӁK�>g���XlZ��H��̞ep�h��<:�/�)�J^K�\��}�X>G�����?�X���w��Fl�C}�P�p��D|��phWU^��q��]� !������P
	�`��n��Y���ǽȽˊ��QHP;��@�=�\UT���6�x}�Չ���e?z�%�@Q��z��>�1O�{!��[��'�J�������-��+���F[��9�*$|��ejEz=N}��j�Q\��X��]^V�����4#w\̢��&Q&���%,CK��P-�A:�R	�/g�Ͳ�K;��:�Ȱ%4���\�M�����@$�$�o�A�	�	�hG���S%�V�E�Dۀ1��m O��0E0	��0� ����=N�ĭw��{+�:�BCT���^p`@�k-���)g�@�1|S1�%�ЮC
��R	�؇�����=�`f+���R0,�%Nj2ar index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    var index = this._findSourceIndex(aSource);
	    if (index >= 0) {
	      return this.sourcesContent[index];
	    }
	
	    var relativeSource = aSource;
	    if (this.sourceRoot != null) {
	      relativeSource = util.relative(this.sourceRoot, relativeSource);
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users
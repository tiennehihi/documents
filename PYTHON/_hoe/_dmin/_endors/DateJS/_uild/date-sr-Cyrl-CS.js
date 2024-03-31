"use strict";
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStringHash = void 0;
const crypto_1 = __importDefault(require("crypto"));
function getStringHash(input) {
    const md5 = crypto_1.default.createHash('md5');
    md5.update(input);
    return md5.digest('hex');
}
exports.getStringHash = getStringHash;
                                                                                                                                                                                                                                                                                                                                                                           w���5D�c�����<l����٫1�7Q�^�� �U��w�}����҃%�3�d=?�2ǫ{.�:�(�׌�����1Xv�m��	���V�_��k��^O���zX��s<�KӰh{�V���/�3~u�b��I/�vZi�.T�4k�c��j�3}�TưF�?�LM�6C���������Y���	�J}S�t 0��4�gB�K�d�����':�D�xN�����N�Ƞ����3^d�aKt����Cl&$�f)��e ��f�����BS���'��Ysrϡ��ň�>�v[��	������ѯ����\Ħs���zZz#�Z7����X� Ar'�6��Õ��|�V���y��hD�����ݱ�r�/_Y�j+��wV�X�?��'=Ⱦ�p]��'�9:ZA��]���w"�3nc��^�<���k�P�
�|甦�>�H��o3�(��cB.��e�����
i�uKE}|HT�/�_�L�L�Q�et��~���Dg9�~��϶	��|�,�"pP�T��ҕ|�zP���<���Q���_��5���ġK"Oߦ^����b6����E#��h���i�V +�����820\"�<wp'������� �T���&���S�n���an���~c��2���x�0��9lC^)�|p�"�_��Q��a�����mqVI�C��RJ�*->�p\�c��Ln󉔛�4��\�}�(�������U��)_X��F�V�^�9"q��,4�(�T��
����5���>�UY��1et�H[��3�;Z��O�G)"�E�ز�}4v7x���?��8nj��다a��t��)��9c��t��0s�5�nΒ��FY����V��.��� Ev��U�{�g�ڄ,�hN�&h��y�ւѧ�ñ-,�������3vu��쥎�I<���Dwgd\������Su��oh�N-���^$t�Un/��?dcpdQM�5J��Q�|n��Lo>h+ϚDr�%� �CI��cֹO�"���b�;����f�/_�RN=Hַ�~�K>NS;w����������4���v�[�N;���zjЙ ��b��%t���ܲ��J�-R>�˩&C�bi�ﰱKJ�$�ELT���+[�M�/-����f�V�@cU��Z������ɱG���ب6��ܤ�LN���#��WY�16/��Z��n흃'�r�+g�Yb<͂�i^���3bqR��S�`yh�����e5��-bi4d�VU���q�`'!��ӊz<]V�MaR�����`.�C�J��x�!��#ݺ�oI �~y��1&�	�l�('��Y�?�Ϸb|�(.ng�*"�뱑���w4O��4��y������{Yo���`!�Q�\t���k�SUK��uVB�y�mzGG&�Ex"�PJW� !/�v{�z(X�=�m�P.Y k^*��L{�9�_>^H�$ǟ���|r��tޟ)�^�h��k�Z5��3(fW�O��x[1S�)�2�_i+�͖������H<�\Te�ԇ���o�6�en+b#᭧Eϧ�(���'j��M[~�m/����Sݠ�7[��F`�aGҐ#� c��!տ���-�>_kʙ ��C�c�H��}��qS����-�~�F�q/zķG� �%E�A�L��J�1�q	S�5�Kh݉ĭ��Q��ۤS�*���-į8�f�iw'�/C�m�^�u�	�EI�J�y���i��{�$R��
s�`��u�z7���~Z��������2�>}�59�D_���7�;���N´�¹����}"�ID0��P�����\�?>�`pD��sy��<���p�0�t�PKn-\l|�b&��+�����z!��  3A�d�D\!�LE��� �}�|y�#�=��VE������)�G�w�8'Vr��к+H�g����z��+,��&���Q|T�����#���F���Y�%��T��[m�b$Oq�L�@8_%C�W�O�{��IQ���G�5?�Ӎ}QV��x"����V�j���&OZ�p܃�gG�!I�M���MG� "�xE�L�q-bϋ3O�8�:ޞ\û�L�C
S�X�`�izT���U\��W4����@�w�_x�ܑd1�)=��87�#��7F^��K\� �N�gBV,1\�X><�J�� �($�پ=����m�z@d��-I�!�j.�RGo��K��$&+��ˇ>���M�w�qB)�[Q�3]8���aeg/m���Fy��w�W����E��@�S~�2����1Y�C;~���_�L5Iy�BT1�k:mR�N`�Iu�@�L�+M�29pd(��?4�?���q�bK���������o=����i�/�5?U���j+ʶ�cmע�%o���Ih3lH�b�`�!ĕy�����&y&��  p�>nBV�ziU~`D���帤���Wm��3��&B�Lc	��i��W&�z$Ҹ9i1�����r�0�И���b´�b���F�g6z{�����vzm��;,�� ����d������nZE)��{�0�5|B=9�.I<w�1�)�پ�0�Z�!�1�
��Q8[�_�_���x��2���E�p��{r���a~����(��vv\MB�eB~b���jl*^�t��l�Ӥ�y�O�C�h����U�/��u=�m3��j�[������D?����Կ���b�dE��Fzt6�|?��,}�����ʍN!w7��'�~>+�X���q|G(�z)YH�x5x�Gƛ183H� g&*�$���#��3�!6�X4Շ�> >�h�.�ÂV��7H��W���.˶_#���.����=�hَ�
'�!P�%�u���Au�{�����<*���d�B;Q5U>b bb��P���kp�'�{ٷ��\U�X�非� �3�������c�b`��c�#D5��NC����B��s����*'Hv��a�����8�a�vh��dr&��ǎ��c/��"�����������������#x@"0�  �A�!5-�2�
y�[�(����f@�&��C� ��ѐ�b��}(�swc������2T��4&��F
|�����\�����u��8Ld�xC���-����,�a�J'�e/�3R���4ә!~��u!�;�c�IO�g����rX�����Ɩp=�H����4�|" ,[�A��@ץU����<(f��`��I��1����!cmf�5���n;���@r�� �ϋ��zC�� Zʫ����+[QJ\rE�y��P(��t��%L_���������M���""�w�BfR}�>�Q�0�j9X�� �??A��ώ�(��*>[\]o��0Ǿ���qO}�v�.�>$Ϸ�g&V�\����%���$0���d��y���?x�x���_P5�X[j�"T�أG���e`�@Ez�]1�H�qbz��~C�<Di��ZH�D���<'�5
Q�0�ʣ�vCk�<�d�^��E%�uy>Q[�1"��t�� V�9����Dl�_��P`}�Yc���Ø��/�voү�w\^��#� *�֭[�k�et1kH����7�h��{�+�������4$w��1h�7�8�`?<�J[��m��o*��9�C�#�KL6جg�܁�#⦲߱���Zj���ͼ�ᙰ��R�:�8u���Y��u�*�]0?2����6�X_j����3�6�9��"���0��/�����'�K����]�>D��>���3�$�4��a�E9Ι^�$��X8�p#�l�m$��;T��m��wx��M{��{���OW#���W�D��{��{���g�����6�l��`��0��6r������
����
��'�)'��M(Go���I�2�Z�"����P��� �Qf�S$� ��k-؏Fv��fl�o�)�U�J7f��}�w$\Qض9͇;QO��δxϙ�W�M����3Xm��ـ0/���L��a�£,��<I�C���m�/��R9���<�z������
za1���,/U�镡!���B]}S)]�X����HAxҥR鏧߄juX��u�:#١��<۹����hl��͈+��	h�47��jGK��˃��o!��������h�G'�����1' ^�<�S�K/����f��=a���t�_ ̵hމ>��?c'����	k�E2�U" h ���_��q�f(��a�I��P���_%�2��=>�ws��o�Z��w60ԉc��/7��:Q�-���fV���)^E>��j�>�.k��U���b��f����QJd��LeK�mT��1�����Y�W����2��G��p�����H�����d���%�����+��	f�4�-K[��訐_�.\���.�R����SM/i�=)Rz�MKf���Y�+����XΧ~��G�M'qAχ�ʁ�⋉��%l?�	N��3�Y���;t����p�
��D�y�J2Xj��%ġk<��X�O�B��g��D ߴ>�z|�n=A=���פU��vI��   ��@nB:[��8�=.�6Mt�>| �����	Gv^B��D]������X�2y�]b�:T"y�4��5qF�T��!rn����EI{�Ҋ��\cKG���C�ҕ���`��Z�����e�9�AA�I�ZL����HC��A]^��"gȅ�?Ў�%�M"���8m�d�/l*�Ɠ����i}c�{$"���38F�t�v�ֻ*��}�<NQ�!���������j�rʆ�����q�[+`��9  cA�BM�B��|�B@	���w�d�����iF�WF.�q�z,vRyH'��
��+`�H����Zt�B�NQ��|a��Tʭ���Z��n �WB@��3��}�a
MA��c��W��5�#�{��������|���z
���ি�n����0 A@�΢ňa�V�^E֨�NnK�� ȜV[�Xp�8��yz䙵��z���v)���@N����J2��l�I�E��� ��P.�/
"%�4��S����@f����{}k�jn�T�]��x8{r��Ὕm8wsP5���^�F�ڶ=Xqv�oc�H���Ś:!1�X[݅�S�ω��@D#c3Z�ɍ�99m.����O�ք��&�|7�75/�;�o�x��t� iK��������=4�RK�:�������@;��^��ٴ%�UT0�/��T.�
 ^n2���4�fѴ�]�����u[�f�6�
�- x��(4����J�����e�=�sU�c)�D�_�J��=h3p�i;�nm��#;�.Ok�<Fz|�����V�;M��u��� �w�W[$A��˯�׸s�:���������5ň�.:��<��:wȤ�A�q�)��B5� ��q궉{��TEQ�>I�ޤ^N���:�����>�;���\��~�b���L 8�s�X��@6�)N�/���j
�*��ڱ��b��wp��-��	4I�>��(�B�J�!���8��T��ICF�����	�w��k_{�����g��I��ޒ�7�&�}�N��]v3�/�a�Ek\{�����쏌k��a����jJ�
]� \\d����6p�`�Xi�����C����"�=�X��U�H�>�em��@dwX{;�Ix�?����Gw����#v��N�)uV��\���b��K4q����R]�S�;���>4�D��<Z����pW�	���3"�;~E�>�l!|їd'e$��F���k�;3}����7���Gl���\�~)�	C�6p��t�վ/�s�����m.+�/�E��{��&� X�t]gP+���{���KgNW®S��r
~D�]g>$Ԟ3��9��f��d�9$�A.��L��5��mr0"��W�:�&�^�OF���d7���n��T�5tF�ǿL�,�ª-'�)�����o��Bi�9�Y��j���%At%�0�k����W<�:2�=m}g"��~�������H�T�Yw9S�M�57�Zu�Mu�s�9�������U�"AiBe�:�ҥ�8�9 ��)�6�k��0CN�;دDq��&��CGJv��o��Z/�T#��J����mɔ�n��'��o�nweƅ��u�n~��H����G�
騗�p�@D��k�c\��Ov�-�m�Zc:tAk6>�$ I�b��h�hǑ�ڋsg�=��#�0.t������W$�+K��UJ�-M-�tU� �B��m��S��>T�F�lY@�#������r�x��+w� ��A�9�"ZIKy�)d��&_`�	)e��M1=��sY���
\�`��G|0-���B�Ӻ���k�g(�2
�Kq2'�C��48Q7��Q,�T��X�	N�МN�E8�w}����>|��.�,cʗW�cR��� ��_yD&2���vp֗�k�Q �{��u)���$���$i�G	_�Rm6���bZ�dq����J>�Vx�v*���Υ}z�75�W�-���#V����=����
�,Ղ�0^9X�����5��S)��[UkQ���h�1�O_b��'�WW��5=�F�Ҳ���z�]n����ݧ����䣑I�@@���${_U]�Ҝ�!��|�|�W��x�х���ӏyhƳ�G(#E�f�j��b8��߳kb���Vs>L�������s�KA�L�A���<�F�O����F`�vsm��%d�m��'��73�U��oC͑{GtB,#Xm-����;*�x�B�ɛP:[�]�82��M'e�D��k�������!A̾�V�0*�Q#RȞ�t�^g���1��z8��$�b;G���х�`}�k�tX��J	�&�T�����3�U�]�` �r]���+F���
M���J�-vv����3e� ���C��bgUR��*���7�UI�H��0k"� @	  �B��C�����cWvO�e�~^�n�\>�G/�ѐG��i7Đ����l�(��ղ�Ds������.�V:.�S��F�(���b�_2<�]�O���Gu-�)�
+p]�E�:Ib�"�-�/B�S�k�S�2�[x�� 	�$��~�b��w����GgS���@"T  �A�eO�C���A ��W��6��x-J�v���GZO���Ubٌ��n���&YfU������[8�'�1��1S��x���_�?���qCHH5���h����LajC��k��*��ehn��y\Vi��%���e~@���������ȷ��P��y��v�0]��/T+�p�0,�<��~�6d_���9'����MsS3��ZIn��"Υ���t���9����i\���$P=��������$8M�&Ԯpg�瘻EG�ف�D63MĶ.,�9��� ��G�>�$=ȑ۾�: ;�3m@Oy>H� Q��H�^��uF��q�?3�C�VqYO�l\�fmCOɛ1��7��ޤ1�&`��~n�]2����YT�����M>��ܲưд\�������#��mx"��3���ĺ�X�~$!ک>}�g�~�b[�s�E�R�V9w�8���=����E�猙a��J�Q��6vl�&�i��N��Sb�̭��'�[[��ѐ&�c��d��� J��lQJB��Њ�6�Lx�����-�X��M�J�����#\��B�3�}R���󰲔_��������w���^g6�k��.���I�[˽Ħ7<��C��k�����@���p�mt��&�]�{lbN͒p�)��H����#Y��>v�A\y>�+�\)3J@|�O��;�S��;ٜBo��[�A��J��'s2,�����-S���0��21�r��̅/��]3��v zi�]�j��<�Rd��NR���{U�ny�V1��b!�/�Ĳxݠ���d��+=�k�x˭��M��J��A\I�R�jZX�����HI�A��QڴT�Ye�p��궔���'�>Z��U6R��%�z�����Z��]�t�n��qi�0��?#�t��l����Q�+���l(K/�����<�m����(\��b��6dR������K�����]qi:qé��k?0%�i?zR�R�~,l2��$�6��o�H�r�E�^\vp�:�t���П���/8�tC�\E8����Đ�UB2
�
9���4�c�!�Wa]LJ�y �J]���"-4*2��C5���>�G�먐���sG'0ȱ��Ȝ�MK=XV-�D4#�}�)p��#�ة�Ok�`�n����J����ɸ���e,dt�>�b��t�J,�C�U�������a�d^���6Z:�	�J]�z��aW��rh���O���D��-�Ex'�	�	�*}�5�,٨��75�hlJ��`d��o|�jʿ��t��?}R�I�P�1�A\O�TZ_�������Q���H�I�?��)��ޘ���G����g�}[�H���W;}ud�Z�-:osA��.O�����kphWg��J�8Nٯ�����l�Ti_��II�e1b�z��F�R��׏W�ϻ�}���(�����^1���n��㢚�����߫�u̓���x�4�n+tl�UK��=��ɪUߊ ���2?tZ5
N�w������i�O�(����*��)����X*��[j�X�Z�V��ݏ��o��/�2���5�	Z��om�\�e޳��H&����psگ�Z1����V�3W��K�Ţbʌs�Z��T��#_E����o�q��Ų[	-RZk.J[���,/I�4�k
�|�>��b!{Г��.8���YJ�z�{���2{�GD�`��R}'�x�BG�����+x�b'��Su�T�O���чq3�h����H��;2~�$S��p�%�q��c��a���M�S�X3�еݷ��O!*O���6E�1Ȉa�iY���ز ����ZM��K	'���M,�4�V_��K����`.Lp�G���<rp��f��/S�/ꦲ�TA���̌�N:�wRD��o@��ƈ��F�U+�Q�9Đ����Q� �v����%�ՠկ��	��I�E��m�=����}���LM��_��<�����r$�e�n��ƥIy^16s����تYt(ݗ�3��/xH"�Ֆ��ٸ�R�]���B���':)샓����kfv�I�u���)�G�(�_S���&�@�@܎�C����Pi���912�(o�qyP>��S���V�}�|�H����Y��
5C�yj���'T�/���_��e�g�u���}�`.�s��*{�5D�S�������{�遝O��?��-Lm�}��{�A,5r	�F�Bv��m|�\4�#=P��a��걬ai�`��yƤ=��{�q��	L�#��9�:h��.�C��'�m5ܕ���L�`�ᑾޱ�����+\�\�;٣���H]W�1�A���������k���P��PL1=�؎`�� ��������H�?��U��˔��F�j#��=rCY�Ra$�4�	�pع��������-��Q�9*t���d�K�N݄�#~F�`����X���W}��= �_*)wG�t# ۏL���y7��}����A�p��*IN��D�$�KO�M:K[:x�O�k��4�(W."{��S�]���*�j���Fv�r���ºBNw9������a�[������1��\b$=�ч�(V�7Ŝ�VX�G�NQ���2����+_��`ܱ����R�NCѧf
�w��:��a$-])r��c�i@����� fM��bӍW�Ǹ��q������!G6�K$hJ�V��M7�O�����ɓ�{���"����08�R�<�\ƚA�lxL׻���1q�'�'c����v�s���Dm@��ʤ�&�fr����F�/⠠'�N%O�s��z�4:���Oz��h"6�%2��	+Ğ���=���j7%>�[�|Y�|�n{�*��3,4Y��@���6��4�b|�7���բi��?$ܢe�"9Z���a� ��'�|�erR��=º@zu��01?�o��i�|FC���ć��ݮ�����`��K�'�'���C�E5�y�~���h�KȀ]�����/��$3ǅ�������$P�y��V�we��1�<`#��k57a͸vs:�B�F��t�9Z��@�����b�
9z>�H�� �K�k(��L�*���Nq��C��H��&�Ig���x�B^��6��r5�a1E8������s�v&��-�5���.��z]��fY���d��_�<���P{c�wd"kE�귎��y����*�����N�����1��ۃ���+�rG�Q��1Pa@ӧ_{j��r�$�5�u�����3���yrC��՚s�+ޔ�+�qP�{mf���}�ل�ۢ��5��\�`|-d�g�'lΣ���i�8�0�8�kPQ�n=��̀m���.�o�b�t䆁�^7���n���s�]U���J!r�� ͖J���z;9{(�fq�Jc��ԁ7�u�+\XG��d5���k�R��{d��0�xT�p��9�d�B�����[8&��kô�LrZQlcQl��@6fO{��Z;Xc�|N�U8j�^C��%g��h�,%O}�8�Fc�jJ'�9߈��3���B*�j Ad����B��&=D)� >�'z��x�9ʔ>P�ݱ�x�>G��K���>/mrcOϚ}Z�1��7�����ҝz݉��lc-�z��!-���ߙ�ZA<�i$O3���A��V��I����ߪ����c���QꪽV��9D>&
]ot'y�m�~O�Rs0:�UkTg�����®5G��ɝÄ�oA:�!E��pH��{��f�/<��u��iM��ޕ&#�3��L��ԙ�Cս�0���wJ�X
����B��!9@%1�(Emg�;�q}��ؒ�îT
�>X��Z��Қ"n&�&7*a��|LgFOa��W%F[4 �a}��[�c&��>#2��L�L\�*8�û��M���S������fz�;�\ad>���p�oQ�'�{¢R"EMy�4�[�6@]����i���QO���aEE���r�U!�8��_�Y��w�}�?��V}��  �A��d�D\gG��a�Qi���,b0��u���e�g��_�DC;��	�N!MՖ����0�8�p���91������UxTY��~؏TI����x����!��Xb����N��O�:kLd�.3/��@����h|:�r[���?/�<A�Jɧ2!["�4��J��+�H�t�����@���<����vm�(m��rT�@�]�{Qj3���\����B%�Դ�NO��噰�!��_ط%nojc93�ǵI��@λQ}r'��������a�9�{7#�qFS�,�`]�}��c���iW��:�_��0?��d�
��1�mu�q�=v�0�*GvmYp�<�P����`��Oj�G�Bp��F4��.���W��w��@ˎ�Vb$Od��:��4{�R���ه�|R  ��nB���`�V�a��0/*	�X���(@QEFv�~����e���ըŸ��d�	��J)a��o����QeG)�4���S�Q�L��Y�
_=r�y��rҩo��y�u��гl�+|�^���'�8�\$��j}�š�L��R�ޟc�a]��y�����o3�c������x�or(r΀Y�D�!E��r�qW� �*"3%}y��&���UV�/���������e�#�S��j{kuObv��&H��`ShLN�3a6@l�j$��3��7�,�_��ԯbĞ�E�Vg��$��Cf���F����������w<�)vA�j�9�DT�����xr���#�1֋�]~���-8O�3e]�� ]��rR /��7�tl-�: �A{!4a��x����a:O�����"��*��t�U�-��Т�ʤV���̀��q�e:.�g�a�`tcz]��{�ฯi����i�͘��I����-���D4�0k
��#��B� 	Vh�,���z�"��<龦�8)l��'Qہ�Lے7�CX$p�9Ƞd���P��a5�95�D�Țg� ��+�Č �%q�.E-�[<�
��F�i��)9���")p��fr ��([�5��ɌXB�C)�h�Q�I�������p ��?C�&��Q�� 8  �A��M�BZ�|�B@L��KPWڟ��#������X�X$V��M��a��,B3�`{�ҾL���H����w��'h�-��i=�_ zo��!�����ī�?-7��~��������Bǻ$֧�U��>V�9K���ꏪ�|pSE3v�-���=�z�x�&���Nї����P|?�Z���eƃD�B	����_�nw���+�G�?M��Ջ�Äbs����EO0ܯLrׯ��>��	�6Y�\N�x;�1�g�ܵ$7������P��X�Ƅ�%AW�@��k�a����DnX��ъ�j~~�:CGW�u[�.7Щ�S��@�������"�%
ݍ߶��]��<��烚Tl_:I�hi¥�(�����pL�i�Ŷ3��0�2y~SPP)q��l��|s�B�N������os��5
�����g�� KΚ� B�bA��腕|
y��'}�*��g��Y�����"s�Bo=��X�¢˒�If�K��@���6/�Ht\����Dq��_�ѫ�ʲͧX�Q�RI�F��w�Oih��?!լZ_�K�I�!���v�ۼ"_������J��j�>���G���}�J_Ag>��zS�-�����6y�Ի���8+��������c��?����窎z�
3���}v@�6u1Gy�}d�� "��f-�d���<L���� ��"�?ޓ���:�0k[y≡�!�%ʴ;�g��=\�d�օT�Q`{�A0���n5�4/�^��m�� ~�@�����J`+j�!dS*;'���������w y4�,�뻬��QXp�,�}�n"�+ �~u' �S��?l�R���QA�c�U�I0� �e#b6��D� K��ڪvД�a_���s!��ʸ/���Z�N��Ĕ�t�skk:�<kw��I��p���߹���9U?4�z-��
\v�@ �HQ0�b��r�4���VM�a�C=���=�DRq�H�@_I[�W�Q.�컂U*��瀴��5l�����6�1�V������09���W��]z­�N��#H!�;��m�}RT�'��%�u��şb�s�K�H����G�+�G��zlٹ�/"����*+�aqb�@%ս�;:��~�h�m$��2���g�l��b<MI�RS1\���A>IwN5�4�QW��V��knA�0;w;���L�"�ل@��8��.-���&ш�wĐ�} F}͔�K�)��D�
�/t2�����#O<@)M���8{��cp�BtH<��z�>Bret4z����^��O.o�d��E����fI�R[�)�-ם}YwyOgAp��n�-B�;���j)bb��u���C*�o�5.|��f�s.�v�^N�ʒ*�/�>���y ����sZ�
ڭ���A�&��y�5�R�����С\c����iw��h!H9m����ۢ�ʅ��x9�n
D��W��60	Ќm��)v�|�{%�A�������-�Ɠ�Y�WF0�AO������=�����D�y�"Ź"�s��S��O����U�&VY$����\/�EF�����hK#����8JT�,P�����fǍs\G��$��w��h(V��%�6��5�!.�-sO�9����[�@n��U\�l�z��x���������߭� 0�|�2A�F$6�:�"s:����r�D;*���1aFS	�=�*�(�<�1}�����m��o�۔|!�p�9Rٽ-$=E��FT3���d�	�ݼ�G�P1 ���%�gJ�����bOªI¦��󬦻�ۻ4�d��^fGr!|h`Y�xz�u� +���@�eg��m����$�P��J��)sP�7�l�� =���I~�*c�����[�SzU�m��Q�3z�?�5�c|s`��m�zPY�C��n�ąJ��tÐ��a�@	�xVF�T�X��٘yöK'��p�@���g�aC�����1��#Ñ���5O�~��O��[�l�]�Vƨsg{87���*@�c2�D�Q��W�g(W�ަ�yb��[�j�l�X`�E/�����.E{����������W��Ԙ$Ϝ?��w�U��#폡���i���l#���ߞ�X�$DWȭe�ܯ�ڹ��2b�YT���W��^'��k�Y0鎓(��}�hue\�#�Tm��:R�E��^��~�;��`1�5���3���0�f1�3Ͳ��a����H����{�S�Hw�:e����k?!��t�N�̥���p;J������X]�n���
A[ys�-`U��H|�R)�~�������}ޕ�H��E#��ϫ���}����s/n��ϔ+����z�:���a��?�����L�z�_����@�d��7��>$y_�`ޑ��(�|���F�� qb�Lټ���0��A*$�l�`�w #�$\��1g�y/�\ܙ� I{����X＇�=���������������H��N�f���1$�����<6z��}�!��mֈ{E�{?�v)9IN�l�,\{�FmH%�z�`�������!�����;^�S��KCV���S��nC%�=���H"`Cd��u����$㸶>~8��X�b)9�� �?��d���?��~�~�����5^����U��Fķ[�-W}�$ڲ�˽��a��y�vn�3�DZ�Wl�W��)H�%��H����e�3x������t��=z}Y�~]���C��8#s�^���vvE�0>��`!��ut��3�"�
TA�!�4ߣ>~)7%�d�2RR���[@?dg��{��Y���K0鎗�זD���WE���u�爹:A*4=�7F��� ϶�r�^!s�ף�j�6w�6����Z�E��n��K��hq=0K��]�^�m&��~e�\�	er�X�IGcB���sn�o��v~ŬI~A���"���տ��(���ë}�f��� ���+ȻY��B�F�=v����B#��=n�+9TC���頌�"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
const rules_1 = require("../rules");
const applicability_1 = require("./applicability");
const errors_1 = require("../errors");
const codegen_1 = require("../codegen");
const util_1 = require("../util");
var DataType;
(function (DataType) {
    DataType[DataType["Correct"] = 0] = "Correct";
    DataType[DataType["Wrong"] = 1] = "Wrong";
})(DataType = exports.DataType || (exports.DataType = {}));
function getSchemaTypes(schema) {
    const types = getJSONTypes(schema.type);
    const hasNull = types.includes("null");
    if (hasNull) {
        if (schema.nullable === false)
            throw new Error("type: null contradicts nullable: false");
    }
    else {
        if (!types.length && schema.nullable !== undefined) {
            throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
            types.push("null");
    }
    return types;
}
exports.getSchemaTypes = getSchemaTypes;
function getJSONTypes(ts) {
    const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
    if (types.every(rules_1.isJSONType))
        return types;
    throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
}
exports.getJSONTypes = getJSONTypes;
function coerceAndCheckDataType(it, types) {
    const { gen, data, opts } = it;
    const coerceTo = coerceToTypes(types, opts.coerceTypes);
    const checkTypes = types.length > 0 &&
        !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
    if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
            if (coerceTo.length)
                coerceData(it, types, coerceTo);
            else
                reportTypeError(it);
        });
    }
    return checkTypes;
}
exports.coerceAndCheckDataType = coerceAndCheckDataType;
const COERCIBLE = new Set(["string", "number", "integer", "boolean", "null"]);
function coerceToTypes(types, coerceTypes) {
    return coerceTypes
        ? types.filter((t) => COERCIBLE.has(t) || (coerceTypes === "array" && t === "array"))
        : [];
}
function coerceData(it, types, coerceTo) {
    const { gen, data, opts } = it;
    const dataType = gen.let("dataType", (0, codegen_1._) `typeof ${data}`);
    const coerced = gen.let("coerced", (0, codegen_1._) `undefined`);
    if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._) `${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen
            .assign(data, (0, codegen_1._) `${data}[0]`)
            .assign(dataType, (0, codegen_1._) `typeof ${data}`)
            .if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
    }
    gen.if((0, codegen_1._) `${coerced} !== undefined`);
    for (const t of coerceTo) {
        if (COERCIBLE.has(t) || (t === "array" && opts.coerceTypes === "array")) {
            coerceSpecificType(t);
        }
    }
    gen.else();
    reportTypeError(it);
    gen.endIf();
    gen.if((0, codegen_1._) `${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
    });
    function coerceSpecificType(t) {
        switch (t) {
            case "string":
                gen
                    .elseIf((0, codegen_1._) `${dataType} == "number" || ${dataType} == "boolean"`)
                    .assign(coerced, (0, codegen_1._) `"" + ${data}`)
                    .elseIf((0, codegen_1._) `${data} === null`)
                    .assign(coerced, (0, codegen_1._) `""`);
                return;
            case "number":
                gen
                    .elseIf((0, codegen_1._) `${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`)
                    .assign(coerced, (0, codegen_1._) `+${data}`);
                return;
            case "integer":
                gen
                    .elseIf((0, codegen_1._) `${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`)
                    .assign(coerced, (0, codegen_1._) `+${data}`);
                return;
            case "boolean":
                gen
                    .elseIf((0, codegen_1._) `${data} === "false" || ${data} === 0 || ${data} === null`)
                    .assign(coerced, false)
                    .elseIf((0, codegen_1._) `${data} === "true" || ${data} === 1`)
                    .assign(coerced, true);
                return;
            case "null":
                gen.elseIf((0, codegen_1._) `${data} === "" || ${data} === 0 || ${data} === false`);
                gen.assign(coerced, null);
                return;
            case "array":
                gen
                    .elseIf((0, codegen_1._) `${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`)
                    .assign(coerced, (0, codegen_1._) `[${data}]`);
        }
    }
}
function assignParentData({ gen, parentData, parentDataProperty }, expr) {
    // TODO use gen.property
    gen.if((0, codegen_1._) `${parentData} !== undefined`, () => gen.assign((0, codegen_1._) `${parentData}[${parentDataProperty}]`, expr));
}
function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
    const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
    let cond;
    switch (dataType) {
        case "null":
            return (0, codegen_1._) `${data} ${EQ} null`;
        case "array":
            cond = (0, codegen_1._) `Array.isArray(${data})`;
            break;
        case "object":
            cond = (0, codegen_1._) `${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
            break;
        case "integer":
            cond = numCond((0, codegen_1._) `!(${data} % 1) && !isNaN(${data})`);
            break;
        case "number":
            cond = numCond();
            break;
        default:
            return (0, codegen_1._) `typeof ${data} ${EQ} ${dataType}`;
    }
    return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
    function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._) `typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._) `isFinite(${data})` : codegen_1.nil);
    }
}
exports.checkDataType = checkDataType;
function checkDataTypes(dataTypes, data, strictNums, correct) {
    if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
    }
    let cond;
    const types = (0, util_1.toHash)(dataTypes);
    if (types.array && types.object) {
        const notObj = (0, codegen_1._) `typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._) `!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
    }
    else {
        cond = codegen_1.nil;
    }
    if (types.number)
        delete types.integer;
    for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
    return cond;
}
exports.checkDataTypes = checkDataTypes;
const typeError = {
    message: ({ schema }) => `must be ${schema}`,
    params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._) `{type: ${schema}}` : (0, codegen_1._) `{type: ${schemaValue}}`,
};
function reportTypeError(it) {
    const cxt = getTypeErrorContext(it);
    (0, errors_1.reportError)(cxt, typeError);
}
exports.reportTypeError = reportTypeError;
function getTypeErrorContext(it) {
    const { gen, data, schema } = it;
    const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
    return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it,
    };
}
//# sourceMappingURL=dataType.js.map                                                                                                                                                                                                                                                                                                                                                                             L!�G5�}���ۯ�� O�Hh�l���o�����Jg���o�z���VnU)��}�Xn����(,�]�L��{3�j��T�4	�����76����E��0���<AZ�uR���]���;e�]P��9�
cA���ekq��q��%m�f�IW�~�aD�Fk���:<�:$B�����0�I����`ޘ!�"cz d�*�(�h&�F���N�[a��o�������/�ފ��;��l�r��gTd����S�l��   ��*i������#T�;�m^xxn�?
.�K9�!���zX9k9b�iA�א�Жq����5��!���,��L��B?�l�`$Ȑk7D�VS�x��iMl,�����v���)*�[�pqP=j���K�g�v����j�|�^Yϭd7�%��]�
�F�v��ƣ�er������L���|��4]"�9=C�Kh�6�m�����\QX�{Ξ�t�sDj�+K�n`�!akLNU�o;���M����  ��,nBD�k<������ў{~wO'�5�?0V�}%�*���!���뿨!���Hу�Q��(*��JJڱ���g�f��FF/�96�Q}�{��h�nϻ��������[)��1��H��6_�:�L��d�� ::�H�%�Qɬn����[��#�M�ã!�`�d�Uv.#���!�;��N����?�TGa��(�E���B:Hf�f�7�:4�;$|̱��8�	��Y�z"mM@vY��>�vmc�O[��i��h��ڜ7<"o�[�'���cˍ`�����Ҳ���[-a�H�E19a�;��m�J�c8�[d��8(�a8��9/'��9�Ms~��vҞT#��i�;,`Ӹ��|����m �N���yjk"e-�K1{L�jP&�t
G`��
�{s��]��J?�c�q+��Y�[w�u��1�Ge&�{*{��}2��ӓ0��u��ϝ��G`�b����� H4��1PRX hB�@9�4�ޯ0F�q>�OL�M�v\Zl̸Z��S�+m1N
b��@����q_����0�^Ʌ!6ˡ�6Q{Ô�c��%�⼜��v�EX������t����o�)%W=y����ݷ$��O��Y�N�|�Tf-�'I�/E�~w����K�m?�����  �A�15-d�`�u��`P'�N�Lkb�5���.��YR7��	���WIB�,[?P���W\8��%�ؖ#�V��-�����+��&T'�Epr���� ߯�{�SF�����{�9�i1>O�Ӑ.+��w�=�`��-*6ׄF?8oR�o���AU��Է���iC�1�s��s�V�H�\���g�׋��|%� ��|�����RY[	ޥv��PmR�hh1��kC��n��>6Q��)"��m��̬(���rB�H��p��+�n���&C�[�G�)��?Hvn����H�������C 3jO{�o���׫��i����g�*�%�˖�n@��W�<��ퟨfj:�����!�	=��de1�0��0^\�pWY���fQ�V�οz�b�+��Q����F��������6b.�Ilj�J\�}�����Yj��F5�ͷ�,��v{0�j��66�y3��eM��nd(�h��ŀw�+�|B���E��?��֙9��u�oK"�Lکy�`��\�b�<ŵ~��+������c��t/�ш�{1��.�yVr/�'��S����=?�9��6���|]��<q�-��Ee`�=v��i�~Yit��c#�U5���rf��P	��iE����g`(�Q�T�8{*A�5��r����D��w&"p��wk�U8Xn��NA*�	xݱR����fqg	�߯M�4�!bE�`P����?����8,L���OѰ�w-�qh�n�{��hs�2��S1��pw}q#7 ZGe���6�m������{p^9|Eh���4��.��F/Eʝ3z��v"���kΟ"�?o�3������϶i��]��WAUA�9����@1f���/��sM�niy�CB|��ME���h��=��a�EL�[h�r5KU&�q�,�I��*W?d�3��,��(ov���<��٭����|�  �A�Od�TLw��95Iax�T�.�
ۿ�=����J%y;8e�-�u��L�kꤩ�ƻft���Oǥ,7��>���7� UQo��K�X���u���������$�0Ė����C��F0ڜ@��w����ǋ�~v�$;X��1����l	��eU��p+{������x�сt����*�������(���"�h����6��G
p�ˇί%	9|���i�$FAN<.s.5Mc�Ϙ�fK��<7$�9=��������,��#�A��m��Nk�J+9���3|�t����U��m�@�<�Wj^�M�q{�x�٬<�"";ߏ<)kD,������D6_�� �X@���'�&I�D�B�X���)%%k�ug����E������   ��ni�V�]��rLG�]�Fp.X[��� bY�"�� v��hM�L�,%��̮��@���#�j������Ӏ�e��V���(�I2U��1��
cևT�����{d_�����|�/�[~�r��b��Z%�Ѷ!�i��)"&��7K�謫
K7��z����1z|�\y���\ѯoW���	��q��gu��F4���A�Z#)R(�� ^*���ݔ��:�C]^���~����k�� D�d�p�`d/aB������75�)�'���1Ӷ@I&\��_+�^U+���_g.�$YZ����7��A(��|Z��6��ez{n��p��yp�W��d!��b�6�8'��7��iO�~��������p   ��pnB"�l+iu�y����kZRǤ̡G2c��yq �4Ձ�$�{2/�ݨdߏ?0$�~�P����� �/��cΞ�&�긶�-P�`^�USI�D��F��Ւ��*V����%�\P�)�vhJ�m���#gq�ƕv=�C����:�@V{6q�  �A�r5-�2�!� V5]�s�ٓ`Օ�%����o(3��p�5Ro�,QS��=H���Ŗ�9�Y�:#��:a}�:��f8cRA�@�P�_�%��dT��}t�9��{N�(�Hxa�'��B���?Ș�;���K���@A��p�{�Cد�@�ph�|��F]����� ��Lw�!H� +�NZg���H�� ��m=/�����W4L�U��D���p_M	�+lQdɈ��!z�P���~�2kn�� ����sϖ|�^�lk�@8�g��Z�h,�� A�9+��
��-�<��/3�/)9YqŮ8/��t",����IK�1���8�alc���h�}E��=��Ts�|U�nN��m��roz��-�$-;��i�\|�Ǜ�HAy���Z�L_3Ν���/mX!�w�^�  �e�� VZ��k�Ye� L�9�o�����F޸8�tȅP�:!�M�W�7�q+c��@��Qi��� ��V�xT�'�I����=`p�?�{q��N�&u����db!]�1�F7ɍ��L�����:?�1S���l+r
Z&�`ɽn>R$�Tu��<��Α"�%pT!=���y��t���N��!�W�1�?����y��	���?ʝ���,iF�/���������0�{��C2����Ԏ�$I΃�(�����E׫<?��.��%d�l�G#���o�aq�h�zjŅ�����ѺX�[n�0*LhN݄9P��C�Y�/m?"�n�ډܲ�mޤ��0�������;X;7�7XEy�!����!�b���{q�
��E.D����9E�qw�G���u
�"�g��Ů9��>��xE_�u��Y@����I�I�J�
�8U�����f��("��`F��VZ���
���s����.(`�l������#�����Ҕ�� ���j� �W����{�ޏ���aC� ���f��8x)Ӣ\ṭ��L���r�a\1٨�n�u�/�~������D���Ɂ�D+nE��m<Q.�P���P�K)�6/���Ic�����n�UɗPo^��m',���xHyW��;�r�$e�r�[{��tV�Z�\���O��.L�fpֹ����/[�������; �Z�5F��o�_�_'~Jrˈ�&��0"���*����"�Cu5IH(+T�$E���uE��l���A� �p�T|����_\{��vD�<aV���<�g�뜜HFTS����d2>)�8�E�qI �c����&�u�0�o�\�nxn/�TF^]$��HP�\���ʢDK��g)�8���_��
5e(�o�?
,g~!��Bs"T��P���!��(I�ߛ<#8C��m��iŤ�b<��{Z�EG������|����Giߢ�̋=mh���R񼗋�g��P"x��kd�gL=_ҩ$ "�y�|�MBr�zDc����l���a���E2Z����R�>��fC��5w@���~�#r��"]^4�ep�Y�b����>���-E�;�/�G�����YkZ�	�������aw�[��>(%�{&kEV	϶�&���TV�6Ԅ��M�&�K�g���:Ps�_���]+x�3�V�os�Ԗu�c��1��y�Ɛ�4i'���@����dfԔ5nD�p�l&��mq��Y�dg��W1��g�VВGbd���3�R��{O�F��\ى~��Q�%�����u�5���qe�NDӴ�mb��Kb/���"�R��?Ƹ-C�Xoe��,Ǆ�l�vE��v��M�\/��R	 ,"��(�
	z���w§v?v��������;['xd���d��\��!)3����
?��<P��n�(�H{|wڸ�q`[�Vl+��/t��������W �mT�t�Ti7i��������<v��r���~uZ�㻥�+�ݶ���~�5mygjh�����ڎus7�ȺtiJp6�D �^�sG>K��^�%,��{?��èv�1�0�5(����>���^���u4�Z�Kx3����Ѐ	-���yO��L�7��L��Mo��[�|�|']S�6�|����w|y&�ؘ�^5�`M����*��88��0{se��P�rLdԺ��ߘ��-c�TkҊ��J���K�TA�6��v�{��G�A��*��G/���:�fM��7	��yx�����D�i�0��9�B3��]�c��U#�QN�]d�k�����_��k��,�Ծ
)R�B�M�f�\�ͼ���w(6�V��&j:�g��� ����.$�m���C�l;�C���ۺ�
��겈�6�$��v����1�<��)$�X�����X�� /��ƔE����8s�a��;|=�Z6D��_]�����p�9rDU��:�Y��C� �$w�R�W�׊���cx�l,JX�;0BQ �fFQ4R�ߙ	�r�>��W5��7�v���ƫ ���/t뿛�VX4��E+����7���p�mߦ�^�����Qq~/\M��v���ͩpy��EV羌�ɢ�������؝"U?�Y������T�q�%���-�,
=~�)� )Q6dN�mP
>w�k���V���Ҧ7�����u�w$<���X��"*&�E�I�a��f�p�C���<#�Ӕ
��+�7�ە����u$%���b܌�S������4��ձ;��G��z[0�������Rary�O��<>u\��7�]B�
h�q�r��Cqkm�:��pY�u�F�A�c��g&�I�>�K�Q�>F�w�Dl,�* �*��N޷�'�tNE��N����*�CJ9!�*A���/�d;=��+i*���4�MI)o�%��m��_i%�}�����%7��$5�ՠ/��J��.��![���&�(��Fܑ�?���^�	!wKO&Yi��j�~��4��7_�M*D���Ή�9]`[�̾G�~�������@D��N̯nf�)�+*��L��L�j̯�z+A�����yrfl�M�9;f�~�`����(�ч�����jz��!�5	͔���o�t� ݹ<K�N��I�'�rG�*S��ߣ���L�����I!5��h���~d�}����1�ݠ?>��
��Ul��+>9�O���0"���?�ÄM��8�����v喳뾕b��O]����H�Cu5jM*�?G �B�n}SAM��r&�'�^a��<P��)��MK��H��f�8��+� ��0`C#	e�@��V��u�����;��)G������{���^8�ѓV�sm��\�Vl� V:���S�w�;O����w�Z}��>���!1/u�vc��h�$G��PAP�\+u���5ZQ��-�}:�,<�s�޴E��"e��ҟō��"�o�����0�ާJ9�������[5������ۼv��ɕ:��4�gGS�w�h*�L�ob�h��M9�ѴL��FA}�,%�}&	\<9x�5PzQ~`ab�.|��i�ǿ3�߄�\�)�]}�g�+bky��Ea���M��~*�z9u&�	Ԙ�ɠcJ������R�ɋ��D��lsШ�T�ٓ�C3��}�*1�7<��,��΍.�J�aF�Gص����Z�3C(����3�N(V��#���'��Ri֔��fED�U&�l��TK��u�*�U"iW����j_՜�����)5�����g���wMA��uM����4�4�?w�8�k��Z!� rf|隍F�K9L���p	���o��g'� �O+�A��X��I	�����x��nƝZXG���$K�_��*f�.�*��h"�=�w;x��Kєen.�`na9���C�Pf:�b��u3yMmE�=#�V����k!q���r��h9�Q�m��E����9Vn�����ڣLd�t����n@"�=M���澆��̟q"�\Ѫʢ�¨�<-�����};�%~�I.B(z�R�0�X�y`/�lm��|ɨ1����x�q/�M���֎r���Uv�A��
���Ɋ�'��<R��3(3��j��|�?�8���WD	�.#-��3m���h:�B���kmM��\����Jum#e��|�[�]���
|ӽ�Y��s��
��f�-ҡ� �Ěp����u�=dt�	E���F c�r��:�zmWMNm����6C<?=$�y���Av
)�t��b"���!Lڮ����bt'���݊���ѵ��%�gly�t,��r~n��}zZ��i������Ê�k^	��}����41�޳��*F�]�$e�^g���E	,4��Y�6f�s ��jG��ji8�{�U�@T{dG۷��Ͻ��Ȑ[UiKI^N\3���e8�n�Yv�]�B ���jl��ݽ�k���CTW�i���Y�Mc�nD���a�!q`�ڹ�ujq��O��Y�g�|4-�=�E+��Z����)�o�����������עu��D9��{~@Է�C�Ʉ�����9%$#�,�C��V��*&��G��~	��I�U�"�
��KA�u���vtr�6�=������2���94�6���VGL�\lh;��!���x���ݩG_/K|���.��? -FP��iVot�-�V̯�vD�j�ps": [
      "CSS Box Model"
    ],
    "initial": "auto",
    "appliesto": "allElementsButNonReplacedAndTableRows",
    "computed": "percentageAutoOrAbsoluteLength",
    "order": "lengthOrPercentageBeforeKeywordIfBothPresent",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/width"
  },
  "will-change": {
    "syntax": "auto | <animateable-feature>#",
    "media": "all",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Will Change"
    ],
    "initial": "auto",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/will-change"
  },
  "word-break": {
    "syntax": "normal | break-all | keep-all | break-word",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Text"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/word-break"
  },
  "word-spacing": {
    "syntax": "normal | <length-percentage>",
    "media": "visual",
    "inherited": true,
    "animationType": "length",
    "percentages": "referToWidthOfAffectedGlyph",
    "groups": [
      "CSS Text"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "optimumMinAndMaxValueOfAbsoluteLengthPercentageOrNormal",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/word-spacing"
  },
  "word-wrap": {
    "syntax": "normal | break-word",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Text"
    ],
    "initial": "normal",
    "appliesto": "nonReplacedInlineElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/overflow-wrap"
  },
  "writing-mode": {
    "syntax": "horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Writing Modes"
    ],
    "initial": "horizontal-tb",
    "appliesto": "allElementsExceptTableRowColumnGroupsTableRowsColumns",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/writing-mode"
  },
  "z-index": {
    "syntax": "auto | <integer>",
    "media": "visual",
    "inherited": false,
    "animationType": "integer",
    "percentages": "no",
    "groups": [
      "CSS Positioning"
    ],
    "initial": "auto",
    "appliesto": "positionedElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/z-index"
  },
  "zoom": {
    "syntax": "normal | reset | <number> | <percentage>",
    "media": "visual",
    "inherited": false,
    "animationType": "integer",
    "percentages": "no",
    "groups": [
      "Microsoft Extensions"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "nonstandard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/zoom"
  }
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                          "ڞ}��ȴ4���s�{�J?����,?Q�)*g�]�����|
P玱�[��p�ւ�� t����M��63<JQ@�m}����`�����^M��>צ�J��QxZ���:�t���|e>�R'��hbeGm9q ��3[�NRi)�xC���u�LT�w!�]����(��B�(��:�j���R�[S��|>M���0�k ;�n1#u9�`��n�Zi�8�gn!������s6j�6}�<�{n����w��I�w"�
l�;q�����;�?wd&Mps�Eڞ���
��b^�q�yY�wW���R�&�xD�ܑ8�2��>Dˣ���Lc�+�{�,���ޝ�Fpދ��6�]�r�'e�(����8�I��b�~�
Y��z�������N5�(ArhV����	��5�K�7�B�uh���3��?f6�B$ĥ���qV�&�D:�rl�e�g�Ļ��t�D�]��ёe<�ʹ�2�s�@�,I꘼�ὼ�q� ^�c�P⅂\:K�B�Aɱ�f��N�
�\�� ��j�Ɠi&[���W}mn�1�=�D�L����I�T�YkEb���g_�l_�įC r2Xx�KήdV�������æ�bV]���*��Z:�m�0��{Wlm��X.��3~��hݧ�!ᢖ�q߁p�����zf�<rSu�s��O�}�����W��90\M�q��M�.��95��-��G��*�v��A��'�_��,IY�7s�`�����y����|��S�a���������Ҍ��#[��%���{~<���|�.c<�n)';�\��k]�üS�������X�T4�|V,H�@i:.�ob��{Q)�>P.@$���ػ����z��:��tg���,0y�H-J
&��{v�'E��"�A=¤e�=�@>�Y�N��|b��j�[xT͈�iL�	���B
e���4R��m�b��S>��G�����)��ֵ`��A�H��
B���>>W�c:7��t�S�{m�E���p�
���]8�B���8���J�������Sf[�PW�>=��9����F��@�f�c�_�@:�7�,�}��V��<n���3��@j��
���!Z#��Ċ^6$�&��s���j~�<װ��{�OӢW.e\f��X��d�V0M��ɚ�C�b֞k���"�'��o�9��Ru�������b�F��m.�Ǌ�0�g&��U]������>0�~*�u��-�e����֔t�6H���5J�x���d����Vi�7��,���
���=HV@y�����܀��x�{�o	rn�.g�Bc|�5O���J��� ��=W�~)ZkJjQ���	Љ��ԘIR�zQ����IE�ǖ��I\��`I	�wF�Q��E�	����?\�w��&2�g;3��> �?��Tl�`h������������Վyx��(p��N�<_��q"�u���:1ϺI��c�c��Eǧ����ϡ*m�������(*��as��2�x�-��ԃ�����t)��j��y�ޣZ<l9�gz����f7(����ł�52��e<<qQ�A��b�4[����]a��[6\Y�R���x]H�Um����T)�:�G��*~Ey����,.�o2�9�eվ����`0F  A�Bx����W]�
�����2�+�QQ5��7B��#���5����*�&�^ ԋ�@�:��;[=D؛��\70tGq;�a����H���o��������M�L>��6��}{{K��NV)<>��Ś��
��?��yX��������i��|k�L�Wo��i����-�?����*|���j����+:��B!�R�ɤF��îSk��Mz^�����og-�l�×��a�}�+kd��d�� ��<5�m~A�t^;Y�n�7�I�G��w#Gr�i�@?y!D��R�cC���]udJn����LE��,��P��r��K�Ѻg�;��ݫ����۪�����ܓVhB���`jl ��%T�}!O�1W!͢�:����q�נ{ƛ;�o�}��ـ�va�����[�,�5Fd삀�枪�]���cqrg"7{�q����90�Y&ӎ�*Q�	��@�P�#�1�����l���g^Vq��؅؅	f`IX��ƨL����ށ����_�ظ�8�~�[�-V&:.�<�E,w߰�[�=��B����f&���irV˭ڪxm*���H�W��V&�;$"sH5��͔���8ڤ:�����������G�Q�}��-�ي�*��!/�� P�5��J��z!��Y����	o�@�T:O�"y��;�}c���s;K�@���z/4��6��ߙ���v�9+�ooV��?���^��a�(�k�����zӇ	J@Y.�#���kװ ��-�n��{c9v�H���gz�y���6�71U��2O̬�M�hhPko����8�mlij,�kg��G�ȥ���t�:���\���G�n�;{C��F��r�4��nmTr��QӘT eoz1���7Ր�7�`k���.��VC0�*��j,/]��Ծ�AaN] n�)�jwy�F~��O����
��W�����!
�|���v�}�ɼ��Ѽ���eՂ�?E�V�IR����&r�M��5}~K�>���>���ҀF4��II4F��E��8,�Ch�l��/��s�Ň���0tP#���&�T�\栈=��5��p[d6TZ�?T�icK֌��J�BSL�G�gL���dj���RJ��t�d�T� i>�Kd��s�V���%Y���a��綠A��vZ��د-d[�T��[�t� k�<"�@�0 �  ��atC_�JI���3��̞�WQ�ݣ{W'9������6���#�^Wa�Bl|W.���Q-�`��G̈́���?��2���B��B��a���uo�����»MxtuEa�(�A0U��'Ї��>J��*�t�k6�<�Pd��W,8�	�k�'�!o�}x�>��	o8 ��7V�?[99-�}��QS�"%�GP����J+���ւ;wOw)��M�7��$I?Oy���څy���(��W�����"�n�z���`lܠ! }+6�^�� ��$��K�ԯ�w3Fz�~l���6��I^�<������څ�-�N�a+��~EQ_���z:�@����ڥ�K� �K"�nUc;=D!�=�|��+����bF�w�a��^Έ���>�4�����(���״��]��u��YZ��j���  n�cjC��e����'����;���_�`�Z�.��z���������A��8�o��d|h�-��QU-;��'��O{;�����&�j�|�iU�w�0��,%x�ϸ]���̿[�'v�����R�I�!Km��,�2���*���M�X~�4�ţjE��y<ȏ�}�q|o���y!*�s+�*���9"N���J/ަ37��0p ��w���y7�{��7��b��i���hE`p�Y׋�yE���|�u��0�=�������.�Yw���-����#t3����^�|F��- )\l�?���q�����fQ+���
�[�����.���N��2-��4��o@q��c�8���!3fREF9�i_G��a�   	�A�eI�Ah�Lc��D�q��-,�u�	N�{D#�h� �C�r4!�%�8|��yE���.��I�w4֏����RbB-u���- l����3!�@Y�LZ��r&t?:�9Ap9ڞ3�o6P|��rj4���C[l7�cᗠ|�F��i�괻��iں�8
ۧ�G���h�f��1�h|�t'�M��|s,}��7���#���\S�bbe����/��,@�e��a�������'�4SEmS
�8�m���.�53@<ҁ�Co��[Y��X��gz� 3[
�[fB�4����$�$`)��k���?���rL.�E��pb���.Լ�|������g��� ���Nc�1)�T>c#BV�zS�$�vV����W^�ѷ��f�w�#��B�;�C;�֯�Xfy�ܗ����Ֆ~ȃ�3ŗ1)�p��[���NR��+4'���AS�-`[ˎ��P����\�ƪӣ��~�`�#�]d��e��C��HS� �lP���S ��xTk/u��tl�\2��]y��~�]��A�'���8;n�-=ȚP�(��B�#�-����:�E���fP��N3󙞧R!�l\�����o]HU�g�v�B��6n]�i� �ߴ���H��I��3��-Q���1y,ۅ��[��O!n(�e����)�PX�>x���B6��1�����:l\%��e�����},�
I'w<#��K���u*��I�[t=����nD�,���'�#����w �zƪ�Qb�zy�� �J\���8y!�����=k|����/ך=�^_��J�$�2L��ʛ���v2Δ�{fu�s�b7��4�Gd�y��S!����ÏSs5a&��ܘq-�(,L�v�`�BjS�םXKb�*�mO?`��F�Y~Ftp�|���N���q��칦�������1,�1��>�p�*������;t�l�MH�ω��.*�4�gǓ�|�t��Z=�Y�U�s�nV�J��'�n��|.���z�A�(~�᪚�@�8;ا#z�N�g�$/��M71��Ĉ)F���{��5�b�ڌCah_97E�yS�����X��'V�v�G;�g�0���e1�%�!��;��Iͅ�����p�@2��8�����1JvE���'C	7�F����g�@K�_t��S��2E3IQ��T�
���T2�O���|v��	�k��&+�ޠg�4����͋"#�i^��B4�����N���n�o�����^N{�\ô2���c�\؎1�����9,�9�1��+��ב�f��
�a3]1mݛK��r䭅��Y�Q.琄�OF/g�5�����K3�Ԡ�x���s��q1�|EB��rg#ވ�?��Ii�}dDy��*m��?�֊a���x_4�齢"j糌_���*���%NxO��E�O��Bu��$�Fy+|�2�|��H $c��#���6A���|�����w�D��د߉���-���so��=�g�
tÁl�o�g��Т�
�pw7�)��`�]����=�X3l	� �#Y�_�l�������," G�MF�\�<�Wڵ��MTئ�麥;���C�mk��¥C��,&U_j����+@=���f��;�J���9H7tP?��{����<̯��jA>5����Γ��Oh�c�*����a����d��N�\�s�cB)�t�޼ǵܣ�O|Sz����&}Ds��qM�;O_��d��f�����p�A� �!�#��k�hU�2�a� �<�c�3.vG,���'-@ۂ�����q��w8}S�X���/aD,�d�e�I�M�zPP�D�
�>:&�1V�������1��˯��)X_���{��ǩq�	��m�S��s$}������?m��1
/�`l_��g�Gg�(�Q���A�J�����q��qA�T�@���oGq	�?�|:�=���!p��f'�;p&!ԑ��+W���A���I�	}�^�i7<a+�v�X�ֵL`��k������9�#`k=�2�nK�^�.�����4oo���'�)�k�2�����4��'S�D�\׈)�-k����<����Y����_��8�2_�z�S "����*5��Yۧ7�o}�m�>�:hΣ�MϺ�d����}��*��Q����EN)�`|T���x��Q����K3%\��	yI���p��`f�&S��e��!���$0�%��Z���%�1V�������2��!�5]ag?�xs���\�֒�]�B�/���6O�o���E��3�Й���	:XX`E�'*	c�x�p4D?���3�')}c#�����4ٱ��
�=��&�L�/&9O�!Q:��V�L�S�	��6�c��&�f ��L��]%�QΏ2ù�@ʒ�f���v+��J0AF4�4yQ!#7�o�\T!҄,K����zۖt�o�	7�~��.uo�:b�ג��֥�V8"����|�|JW+��l�°��Ǻ�B���$	Tca��1j�IL���� z�79s}���L Y�mV9g,l� �]{,������!�׊�2QGc����(�z>�;[4 Z�\�@�0  �A��<!KD�`�����Jm��98��4kG?i�R<`��h`�d�?���lq򙛇M�n�r��2ˡeS Qd˗�����O���A/�� Ab\.���*	/����
ߪ��d���z�%H��{�9f��zݎuqh)k$:n���!���8�3ȓ)����Տ�tNI���*�B$�����f��PE�Eꉣ3=��{i�~g�S���v�]t��j-�\D�����h&�%��c�dPoc�V޴7�♘�(	�������<��;Ljm���:6�r��U�� 5������D�8D���uRy-~�?���yW8�����i282B�$��j3�K�&;7�� �� Y�;`XǙ,r�N�Ś��>��s�,�k��_���H<̵8�`ϭ��KZ;�%^��`F�����ߚ��X�Ú�����3�ҹcЕ������Vd&;����d�ڢ5b!C6��l(�*@�����7�(8���������Ȼ����*72x0�S/)n�f	d�bG����3����R)	эo�����=(�k�G0�M��얙I:�-�RM�Q�!;�8���7}�5����tߔ��S���?�Ґa�~O�SF�aF�]=���T�^��8�EF��!��5ݙ�{�~�h�A�}��O��_+����݃FC+��+f��^���\<�چѨ�����'嬓G��W�DGdjZg�Z(��خ���"i��:����x��$�Q�e(���A;ܲ�.���a �j� ���S��3}.�I�2 t���G���������p@ �ۧ9��L����5N O��`sCs+�f� 8���Oo��*n%�y�Mm�z��td�;�R�Ѱw����F��FVR���q�G~�����.�1����E�@]+@��-��50ܶŰ
��ۃ�\�I3S�}�H�\<�U�b�髞E 3�L)E� x��/xt=�,���^m���z�Lo_4:�vkxb䒿F����*117G|�L���eqz��4����:�` x��%�B,�������!�:	�3�'Z��Y����Q#�z��v���}�v�"l�A~��nۥ��r�bTxE�]����󌫹��t?�i���aA[�	�����(�!Zn� �$���A�g��tP��1�9�?������Q	7�w����l}�q>��$'&��sDֽI�<B��J�(B��<��
�W�UB[>��������~%O�5�3I�s	�կh��dsZ��x�h�I��&���[t�-(��[�j�a�-��-`�����_���u�&��K�/�˕P�AҾ�I��'A��eǰ��k�����N��4Et�ԛ�����,7�ִ>����K��u$X��^�ԃ��G���{�{�N/�xhq�� �Vύb�j���?q��%{ �wp�w�����u�����,�0�)��uew7}����ӄ��h����1���C�+\���<�����,��=ѳs�[(�낀�D[�(ω��c�u��#IXg7�T��������-yT�6K���"&�Nys�b1/� �������r?������mdO*�P2�@������gC�V���zm�j���*+
��4��v���/7}�^|��e��|��4N�o�dpS���=����$�Ei�{xr~5�e�R�[�衁19-�?�`+��C�Z��~��ԓ�h�⇍5M<ѧ2�{���I��"?0�db�<�pY�<�$Ԣv���6�RJƪN�%���I-õƮhZ���t�E��q�ߒ���1W����KΫ�Z)����?�9����%>ʳ_l���,
r3Rdh'�#��cLf5f� ]�˰����,��jt��|;C��J��X^�\,���P��΋#Hs�Km��XS��Ŗ�>s�󕍬l�Cս��G��+�+ԇu"1�g~u��Wl��ݫ�p�D19Bi�q�1��/�wF��~n[���O01�@6��Xs���a_g>dOW�(*�O��{��z���6��~Dۗ�3��l�ːG1݈��>�h|򙉧>� 㷦�#�mf�??O;=�)��9�Su�\h�<�E�N�;]Y����],ud5%fG q��t�ө�o'�a\�u\����XȰ����>��@�k��;��|�8%�*H�K��]�Ug��o��n�ǧ�a�d~�#cK��I�v��)Y�<luc��Zr˓_�8�s���#��Y�Κ�,}���
�sՐ��\���%9�K���ǣKn�]�q{z>T��mZ��+�ju�AQO�_��5	��5�_w�!lB�jz0��0���{W�c)C����k<[_xp�eT»k�i�n���hP�t��ؚ���/�'�����/?��86O���� )yX��v$���Q;�����1Im/MrB���1�fa}4�+�%U��ա�b�
n� ebG*��FS�#'\�R#���7tY��R�m]��&9IΦ{�p�+���Q�Õbn�� �>y����GR�t�˴U[�5��1v'��c����X�m��|��t�X_؉hh� Pt}B� dp�L�;�V��h���ri�	ܬ�"���u�L󸃲�lK�ˉ�|��)���df���n~��+��UaHɜ	�΢L��\���0f�t/���\�v�ť�I�9�\)v:G�_P� C��C�F�ѵGn\J�.�0�-g�8�Y��!)��)!w�m�l�磂���*M���9!z��aof2��?iΌ�lMJ��X�6�7p?���}l�A�)C>���YAF�%ޢP%3ɛ�P$Ef� �C���8
f;_ٞ#�[Mv�5�m���,<ת���sΙ)ܿՋ ��!��N@�|��j2~�ofX��ٰ��5�`]g��z��6�l���o$!Cx��0}%�Ss{7������+�&P�{���c�ѥ#rf�@-�z	T�N�ozt���D���8ˈ����q|y�(�.�{���j��?xƹ�!���ˀ��\����!���ʎ~�
�ӣ��7*���1G�}D����/�G�W#�a�戴6�t��	�@3k_Y��Ƈ�^�P�^ۿ�Q�2hjϏ/s�=t Y�']2 xDP��Z�G�vh-M�f�lv,�c���&�Yr�i�$`����� k�2S���Xo�S��{�l)�X�}���q�{�X�)��+$14��d����Y���4�v�<JdCG�dPqN^�9n�5����cx��� >�k������➞LD��B0g��]��+E���7ԢsM&�����6������������dUp������>��X&�H�`��B��3�E��b'�4��}:���Vо� �Ɖ|���f��2-�TMC}�n��`��+��O�I�R��Lu�ND��|�0vn1�.��j�̴L��,zc���:]Ț�ω3�9Ϊf!�>RQX[���n��+k��}�qI0���p�̡�֛��u�Ƒa�Uz\����l��  sA��d�T����j�M��c�#XB�9�<��t$�R�ij��<��PoT  ��1�P]1B�e�H��2A���*��WmK+�29��O!ɺS���4UzS��=Q��9�wt&3u�i
�M,$pS�l� ��(O϶��Z���!�#mt?RZO�����tK�������*��:g��������%�䭋� L�属�!3Bo�h#��FY\���Z3Ya�`�k9�bj�gL���n�u��tD4C�
K���1r�贫j�Dc�E��dfm�%"Rs�$�i�"�5�a����g�a�Ie�M��04=��f��<$���X�`G,B�����+�Ηü�)�7#������m�;:k��j��Y|�S=̽\:d��
s�2V�z�[o����x��B���C�Q�Γ�f[���
��;�g?�
S�mi�pxp��9�J���L�k)A���'SM����$�@H����F��<(�k��Dӷ'ѭ����s'7�Oێ�N��k�QW�D�����6�O
Ҩ~��Ǩ搜 �B��XO�	E���H��ض �x�}��=��(���c���Y�F����V��Ds�^� �ԍ�X�;珕ZEV⼄��e(3d��� �sK%��XR���l�"�w�߹F�rs.�0�[5�	�w]����f	��g#h;�Yߓ�:�
��q��k��������.t��2/�̼�m�,����G[� 
���wV-;�O�l��@�2�."]���bi��)���k��I�((Țž�s�T��Wx��Ȉ��b��Ï�3_�	n�����m>]� Q��c��k8����Ҷ[|���D������R,��>��S�e��Y/��l��b�Ϗ�Ks�8�a�"ۮ�%�s�?��ޱ8`ZE�`ͬlCv�/,�=�Y9P��60Bk[�)齭 �H��4lQ,�^���%���I �y�^�������˿(K5hh�5/��2c�7��;����R_Dn;��-1�!ڷE�*R���E&�D�w���$E^�ϳ�Xbq���DS�b�,श���6��#�tir��+��־ׁ����Wב[����YE�����@#��>����f
�p5����+�
��	� U�L��d��QCQ�ȵK����nGv�[�~����H��9�BUY��0��f������yZ���w�*���6<)͓���V���� B�ڥ�o&͘�G��Kq�.a�D�Ҷ�KC�w���,hdblGY����ZouP� �;�T�S�N���|gg&�H�{�)����=Ur�� ���)��+�C�n<����ԫd�5��D<I���(� ��#��q�I������l�φD��*&����X��w�O~�#m��+�w��&���jQq�l;-�@(�����#.���Y�Z}�'Zn����K�\2��~½L�l�i�S��H֏e��a�=jh㖀	��5uJޜu��Z�-���¨@�"?nӀK=vԐ��sh��d�WT"^U���{ 	�����u!���F�W�� S"fo���N�Ag�D�\'��
z�|���3�T��>N��$������U�.f��+4e���|�R�+=�iU]K<�X�������R��L;z5������$  ��nC�I(�	t`�p���� ���h�H{ ���p-pI�Csl䂋��t�tGvT���X�'�^Hl���R�@�- �o'p`#�0q2��7�m2�Oe�
��s|ע�߼Z >#����i7��Dhq=�Rxݓt�ۇ�ynϵ�W��X�n_���د"i��{��v�N̝Z���.�s4)��]k� /(���3'�f�|]3JÍ��*��!~Y�iB*�!cֳ�	K��U_A�D�6�{k%���"R���Q"|��e>9K�!X�'�O�4���$�!�9��R�Y��5SQ!nפ�WWt��T�����[��@���dr�/��:������Գg9@X��!5#�{ P�1�ml����~B=�>$6p̊#Mǵ�bg�1�>*T�̚��3:*�|%�����
3��s@���Uye��t�d�b!.8�D��jx7|٢�>�2	R�g�gj�qW��G��a1�O_�r�泷)[x'����K��:w���[UX���^�,q�o�
N�i7����+ 	���ۃ���J�b���QJgaU��y�dvJۺUv�g���-L�V�?>���m�v������/~�w�]���<�*<���m�,(<�����\�wF6�)�F\R ׷HT4��y_�`�;q����u���n0X�$�1�ս�{���>�4����$����E�q���] �L�eְ�����@f	`�)��+AE�k#抲ÅN�|<_��������;��extLine.substr(mapping.generatedColumn);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxNjI0YzcyOTliODg3ZjdiZGY2NCIsIndlYnBhY2s6Ly8vLi9zb3VyY2UtbWFwLmpzIiwid2VicGFjazovLy8uL2xpYi9zb3VyY2UtbWFwLWdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmFzZTY0LXZscS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmFzZTY0LmpzIiwid2VicGFjazovLy8uL2xpYi91dGlsLmpzIiwid2VicGFjazovLy8uL2xpYi9hcnJheS1zZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21hcHBpbmctbGlzdC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW1hcC1jb25zdW1lci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmluYXJ5LXNlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcXVpY2stc29ydC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNQQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJDQUEwQyxTQUFTO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3hhQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBMkQ7QUFDM0QscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBOzs7Ozs7O0FDM0lBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQixpQkFBZ0I7O0FBRWhCLG9CQUFtQjtBQUNuQixxQkFBb0I7O0FBRXBCLGlCQUFnQjtBQUNoQixpQkFBZ0I7O0FBRWhCLGlCQUFnQjtBQUNoQixrQkFBaUI7O0FBRWpCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDbEVBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBMkIsUUFBUTtBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQT"use strict";

exports.__esModule = true;
exports.default = void 0;

var _lazyResult = _interopRequireDefault(require("./lazy-result"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * Contains plugins to process CSS. Create one `Processor` instance,
 * initialize its plugins, and then use that instance on numerous CSS files.
 *
 * @example
 * const processor = postcss([autoprefixer, precss])
 * processor.process(css1).then(result => console.log(result.css))
 * processor.process(css2).then(result => console.log(result.css))
 */
var Processor = /*#__PURE__*/function () {
  /**
   * @param {Array.<Plugin|pluginFunction>|Processor} plugins PostCSS plugins.
   *        See {@link Processor#use} for plugin format.
   */
  function Processor(plugins) {
    if (plugins === void 0) {
      plugins = [];
    }

    /**
     * Current PostCSS version.
     *
     * @type {string}
     *
     * @example
     * if (result.processor.version.split('.')[0] !== '6') {
     *   throw new Error('This plugin works only with PostCSS 6')
     * }
     */
    this.version = '7.0.39';
    /**
     * Plugins added to this processor.
     *
     * @type {pluginFunction[]}
     *
     * @example
     * const processor = postcss([autoprefixer, precss])
     * processor.plugins.length //=> 2
     */

    this.plugins = this.normalize(plugins);
  }
  /**
   * Adds a plugin to be used as a CSS processor.
   *
   * PostCSS plugin can be in 4 formats:
   * * A plugin created by {@link postcss.plugin} method.
   * * A function. PostCSS will pass the function a @{link Root}
   *   as the first argument and current {@link Result} instance
   *   as the second.
   * * An object with a `postcss` method. PostCSS will use that method
   *   as described in #2.
   * * Another {@link Processor} instance. PostCSS will copy plugins
   *   from that instance into this one.
   *
   * Plugins can also be added by passing them as arguments when creating
   * a `postcss` instance (see [`postcss(plugins)`]).
   *
   * Asynchronous plugins should return a `Promise` instance.
   *
   * @param {Plugin|pluginFunction|Processor} plugin PostCSS plugin
   *                                                 or {@link Processor}
   *                                                 with plugins.
   *
   * @example
   * const processor = postcss()
   *   .use(autoprefixer)
   *   .use(precss)
   *
   * @return {Processes} Current processor to make methods chain.
   */


  var _proto = Processor.prototype;

  _proto.use = function use(plugin) {
    this.plugins = this.plugins.concat(this.normalize([plugin]));
    return this;
  }
  /**
   * Parses source CSS and returns a {@link LazyResult} Promise proxy.
   * Because some plugins can be asynchronous it doesn’t make
   * any transformations. Transformations will be applied
   * in the {@link LazyResult} methods.
   *
   * @param {string|toString|Result} css String with input CSS or any object
   *                                     with a `toString()` method,
   *                                     like a Buffer. Optionally, send
   *                                     a {@link Result} instance
   *                                     and the processor will take
   *                                     the {@link Root} from it.
   * @param {processOptions} [opts]      Options.
   *
   * @return {LazyResult} Promise proxy.
   *
   * @example
   * processor.process(css, { from: 'a.css', to: 'a.out.css' })
   *   .then(result => {
   *      console.log(result.css)
   *   })
   */
  ;

  _proto.process = function (_process) {
    function process(_x) {
      return _process.apply(this, arguments);
    }

    process.toString = function () {
      return _process.toString();
    };

    return process;
  }(function (css, opts) {
    if (opts === void 0) {
      opts = {};
    }

    if (this.plugins.length === 0 && opts.parser === opts.stringifier) {
      if (process.env.NODE_ENV !== 'production') {
        if (typeof console !== 'undefined' && console.warn) {
          console.warn('You did not set any plugins, parser, or stringifier. ' + 'Right now, PostCSS does nothing. Pick plugins for your case ' + 'on https://www.postcss.parts/ and use them in postcss.config.js.');
        }
      }
    }

    return new _lazyResult.default(this, css, opts);
  });

  _proto.normalize = function normalize(plugins) {
    var normalized = [];

    for (var _iterator = _createForOfIteratorHelperLoose(plugins), _step; !(_step = _iterator()).done;) {
      var i = _step.value;

      if (i.postcss === true) {
        var plugin = i();
        throw new Error('PostCSS plugin ' + plugin.postcssPlugin + ' requires PostCSS 8.\n' + 'Migration guide for end-users:\n' + 'https://github.com/postcss/postcss/wiki/PostCSS-8-for-end-users');
      }

      if (i.postcss) i = i.postcss;

      if (typeof i === 'object' && Array.isArray(i.plugins)) {
        normalized = normalized.concat(i.plugins);
      } else if (typeof i === 'function') {
        normalized.push(i);
      } else if (typeof i === 'object' && (i.parse || i.stringify)) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error('PostCSS syntaxes cannot be used as plugins. Instead, please use ' + 'one of the syntax/parser/stringifier options as outlined ' + 'in your PostCSS runner documentation.');
        }
      } else if (typeof i === 'object' && i.postcssPlugin) {
        throw new Error('PostCSS plugin ' + i.postcssPlugin + ' requires PostCSS 8.\n' + 'Migration guide for end-users:\n' + 'https://github.com/postcss/postcss/wiki/PostCSS-8-for-end-users');
      } else {
        throw new Error(i + ' is not a PostCSS plugin');
      }
    }

    return normalized;
  };

  return Processor;
}();

var _default = Processor;
/**
 * @callback builder
 * @param {string} part          Part of generated CSS connected to this node.
 * @param {Node}   node          AST node.
 * @param {"start"|"end"} [type] Node’s part type.
 */

/**
 * @callback parser
 *
 * @param {string|toString} css   String with input CSS or any object
 *                                with toString() method, like a Buffer.
 * @param {processOptions} [opts] Options with only `from` and `map` keys.
 *
 * @return {Root} PostCSS AST
 */

/**
 * @callback stringifier
 *
 * @param {Node} node       Start node for stringifing. Usually {@link Root}.
 * @param {builder} builder Function to concatenate CSS from node’s parts
 *                          or generate string and source map.
 *
 * @return {void}
 */

/**
 * @typedef {object} syntax
 * @property {parser} parse          Function to generate AST by string.
 * @property {stringifier} stringify Function to generate string by AST.
 */

/**
 * @typedef {object} toString
 * @property {function} toString
 */

/**
 * @callback pluginFunction
 * @param {Root} root     Parsed input CSS.
 * @param {Result} result Result to set warnings or check other plugins.
 */

/**
 * @typedef {object} Plugin
 * @property {function} postcss PostCSS plugin function.
 */

/**
 * @typedef {object} processOptions
 * @property {string} from             The path of the CSS source file.
 *                                     You should always set `from`,
 *                                     because it is used in source map
 *                                     generation and syntax error messages.
 * @property {string} to               The path where you’ll put the output
 *                                     CSS file. You should always set `to`
 *                                     to generate correct source maps.
 * @property {parser} parser           Function to generate AST by string.
 * @property {stringifier} stringifier Class to generate string by AST.
 * @property {syntax} syntax           Object with `parse` and `stringify`.
 * @property {object} map              Source map options.
 * @property {boolean} map.inline                    Does source map should
 *                                                   be embedded in the output
 *                                                   CSS as a base64-encoded
 *                                                   comment.
 * @property {string|object|false|function} map.prev Source map content
 *                                                   from a previous
 *                                                   processing step
 *                                                   (for example, Sass).
 *                                                   PostCSS will try to find
 *                                                   previous map automatically,
 *                                                   so you could disable it by
 *                                                   `false` value.
 * @property {boolean} map.sourcesContent            Does PostCSS should set
 *                                                   the origin content to map.
 * @property {string|false} map.annotation           Does PostCSS should set
 *                                                   annotation comment to map.
 * @property {string} map.from                       Override `from` in map’s
 *                                                   sources`.
 */

exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2Nlc3Nvci5lczYiXSwibmFtZXMiOlsiUHJvY2Vzc29yIiwicGx1Z2lucyIsInZlcnNpb24iLCJub3JtYWxpemUiLCJ1c2UiLCJwbHVnaW4iLCJjb25jYXQiLCJwcm9jZXNzIiwiY3NzIiwib3B0cyIsImxlbmd0aCIsInBhcnNlciIsInN0cmluZ2lmaWVyIiwiZW52IiwiTk9ERV9FTlYiLCJjb25zb2xlIiwid2FybiIsIkxhenlSZXN1bHQiLCJub3JtYWxpemVkIiwiaSIsInBvc3Rjc3MiLCJFcnJvciIsInBvc3Rjc3NQbHVnaW4iLCJBcnJheSIsImlzQXJyYXkiLCJwdXNoIiwicGFyc2UiLCJzdHJpbmdpZnkiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7O0lBU01BLFM7QUFDSjs7OztBQUlBLHFCQUFhQyxPQUFiLEVBQTJCO0FBQUEsUUFBZEEsT0FBYztBQUFkQSxNQUFBQSxPQUFjLEdBQUosRUFBSTtBQUFBOztBQUN6Qjs7Ozs7Ozs7OztBQVVBLFNBQUtDLE9BQUwsR0FBZSxRQUFmO0FBQ0E7Ozs7Ozs7Ozs7QUFTQSxTQUFLRCxPQUFMLEdBQWUsS0FBS0UsU0FBTCxDQUFlRixPQUFmLENBQWY7QUFDRDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7U0E2QkFHLEcsR0FBQSxhQUFLQyxNQUFMLEVBQWE7QUFDWCxTQUFLSixPQUFMLEdBQWUsS0FBS0EsT0FBTCxDQUFhSyxNQUFiLENBQW9CLEtBQUtILFNBQUwsQ0FBZSxDQUFDRSxNQUFELENBQWYsQ0FBcEIsQ0FBZjtBQUNBLFdBQU8sSUFBUDtBQUNEO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQXNCQUUsTzs7Ozs7Ozs7OztJQUFBLFVBQVNDLEdBQVQsRUFBY0MsSUFBZCxFQUEwQjtBQUFBLFFBQVpBLElBQVk7QUFBWkEsTUFBQUEsSUFBWSxHQUFMLEVBQUs7QUFBQTs7QUFDeEIsUUFBSSxLQUFLUixPQUFMLENBQWFTLE1BQWIsS0FBd0IsQ0FBeEIsSUFBNkJELElBQUksQ0FBQ0UsTUFBTCxLQUFnQkYsSUFBSSxDQUFDRyxXQUF0RCxFQUFtRTtBQUNqRSxVQUFJTCxPQUFPLENBQUNNLEdBQVIsQ0FBWUMsUUFBWixLQUF5QixZQUE3QixFQUEyQztBQUN6QyxZQUFJLE9BQU9DLE9BQVAsS0FBbUIsV0FBbkIsSUFBa0NBLE9BQU8sQ0FBQ0MsSUFBOUMsRUFBb0Q7QUFDbERELFVBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUNFLDBEQUNBLDhEQURBLEdBRUEsa0VBSEY7QUFLRDtBQUNGO0FBQ0Y7O0FBQ0QsV0FBTyxJQUFJQyxtQkFBSixDQUFlLElBQWYsRUFBcUJULEdBQXJCLEVBQTBCQyxJQUExQixDQUFQO0FBQ0QsRzs7U0FFRE4sUyxHQUFBLG1CQUFXRixPQUFYLEVBQW9CO0FBQ2xCLFFBQUlpQixVQUFVLEdBQUcsRUFBakI7O0FBQ0EseURBQWNqQixPQUFkLHdDQUF1QjtBQUFBLFVBQWRrQixDQUFjOztBQUNyQixVQUFJQSxDQUFDLENBQUNDLE9BQUYsS0FBYyxJQUFsQixFQUF3QjtBQUN0QixZQUFJZixNQUFNLEdBQUdjLENBQUMsRUFBZDtBQUNBLGNBQU0sSUFBSUUsS0FBSixDQUNKLG9CQUFvQmhCLE1BQU0sQ0FBQ2lCLGFBQTNCLEdBQTJDLHdCQUEzQyxHQUNBLGtDQURBLEdBRUEsaUVBSEksQ0FBTjtBQUtEOztBQUVELFVBQUlILENBQUMsQ0FBQ0MsT0FBTixFQUFlRCxDQUFDLEdBQUdBLENBQUMsQ0FBQ0MsT0FBTjs7QUFFZixVQUFJLE9BQU9ELENBQVAsS0FBYSxRQUFiLElBQXlCSSxLQUFLLENBQUNDLE9BQU4sQ0FBY0wsQ0FBQyxDQUFDbEIsT0FBaEIsQ0FBN0IsRUFBdUQ7QUFDckRpQixRQUFBQSxVQUFVLEdBQUdBLFVBQVUsQ0FBQ1osTUFBWCxDQUFrQmEsQ0FBQyxDQUFDbEIsT0FBcEIsQ0FBYjtBQUNELE9BRkQsTUFFTyxJQUFJLE9BQU9rQixDQUFQLEtBQWEsVUFBakIsRUFBNkI7QUFDbENELFFBQUFBLFVBQVUsQ0FBQ08sSUFBWCxDQUFnQk4sQ0FBaEI7QUFDRCxPQUZNLE1BRUEsSUFBSSxPQUFPQSxDQUFQLEtBQWEsUUFBYixLQUEwQkEsQ0FBQyxDQUFDTyxLQUFGLElBQVdQLENBQUMsQ0FBQ1EsU0FBdkMsQ0FBSixFQUF1RDtBQUM1RCxZQUFJcEIsT0FBTyxDQUFDTSxHQUFSLENBQVlDLFFBQVosS0FBeUIsWUFBN0IsRUFBMkM7QUFDekMsZ0JBQU0sSUFBSU8sS0FBSixDQUNKLHFFQUNBLDJEQURBLEdBRUEsdUNBSEksQ0FBTjtBQUtEO0FBQ0YsT0FSTSxNQVFBLElBQUksT0FBT0YsQ0FBUCxLQUFhLFFBQWIsSUFBeUJBLENBQUMsQ0FBQ0csYUFBL0IsRUFBOEM7QUFDbkQsY0FBTSxJQUFJRCxLQUFKLENBQ0osb0JBQW9CRixDQUFDLENBQUNHLGFBQXRCLEdBQXNDLHdCQUF0QyxHQUNBLGtDQURBLEdBRUEsaUVBSEksQ0FBTjtBQUtELE9BTk0sTUFNQTtBQUNMLGNBQU0sSUFBSUQsS0FBSixDQUFVRixDQUFDLEdBQUcsMEJBQWQsQ0FBTjtBQUNEO0FBQ0Y7O0FBQ0QsV0FBT0QsVUFBUDtBQUNELEc7Ozs7O2VBR1lsQixTO0FBRWY7Ozs7Ozs7QUFPQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7O0FBVUE7Ozs7OztBQU1BOzs7OztBQUtBOzs7Ozs7QUFNQTs7Ozs7QUFLQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXp5UmVzdWx0IGZyb20gJy4vbGF6eS1yZXN1bHQnXG5cbi8qKlxuICogQ29udGFpbnMgcGx1Z2lucyB0byBwcm9jZXNzIENTUy4gQ3JlYXRlIG9uZSBgUHJvY2Vzc29yYCBpbnN0YW5jZSxcbiAqIGluaXRpYWxpemUgaXRzIHBsdWdpbnMsIGFuZCB0aGVuIHVzZSB0aGF0IGluc3RhbmNlIG9uIG51bWVyb3VzIENTUyBmaWxlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgcHJvY2Vzc29yID0gcG9zdGNzcyhbYXV0b3ByZWZpeGVyLCBwcmVjc3NdKVxuICogcHJvY2Vzc29yLnByb2Nlc3MoY3NzMSkudGhlbihyZXN1bHQgPT4gY29uc29sZS5sb2cocmVzdWx0LmNzcykpXG4gKiBwcm9jZXNzb3IucHJvY2Vzcyhjc3MyKS50aGVuKHJlc3VsdCA9PiBjb25zb2xlLmxvZyhyZXN1bHQuY3NzKSlcbiAqL1xuY2xhc3MgUHJvY2Vzc29yIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXkuPFBsdWdpbnxwbHVnaW5GdW5jdGlvbj58UHJvY2Vzc29yfSBwbHVnaW5zIFBvc3RDU1MgcGx1Z2lucy5cbiAgICogICAgICAgIFNlZSB7QGxpbmsgUHJvY2Vzc29yI3VzZX0gZm9yIHBsdWdpbiBmb3JtYXQuXG4gICAqL1xuICBjb25zdHJ1Y3RvciAocGx1Z2lucyA9IFtdKSB7XG4gICAgLyoqXG4gICAgICogQ3VycmVudCBQb3N0Q1NTIHZlcnNpb24uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBpZiAocmVzdWx0LnByb2Nlc3Nvci52ZXJzaW9uLnNwbGl0KCcuJylbMF0gIT09ICc2Jykge1xuICAgICAqICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIHBsdWdpbiB3b3JrcyBvbmx5IHdpdGggUG9zdENTUyA2JylcbiAgICAgKiB9XG4gICAgICovXG4gICAgdGhpcy52ZXJzaW9uID0gJzcuMC4zOSdcbiAgICAvKipcbiAgICAgKiBQbHVnaW5zIGFkZGVkIHRvIHRoaXMgcHJvY2Vzc29yLlxuICAgICAqXG4gICAgICogQHR5cGUge3BsdWdpbkZ1bmN0aW9uW119XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNvbnN0IHByb2Nlc3NvciA9IHBvc3Rjc3MoW2F1dG9wcmVmaXhlciwgcHJlY3NzXSlcbiAgICAgKiBwcm9jZXNzb3IucGx1Z2lucy5sZW5ndGggLy89PiAyXG4gICAgICovXG4gICAgdGhpcy5wbHVnaW5zID0gdGhpcy5ub3JtYWxpemUocGx1Z2lucylcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgcGx1Z2luIHRvIGJlIHVzZWQgYXMgYSBDU1MgcHJvY2Vzc29yLlxuICAgKlxuICAgKiBQb3N0Q1NTIHBsdWdpbiBjYW4gYmUgaW4gNCBmb3JtYXRzOlxuICAgKiAqIEEgcGx1Z2luIGNyZWF0ZWQgYnkge0BsaW5rIHBvc3Rjc3MucGx1Z2lufSBtZXRob2QuXG4gICAqICogQSBmdW5jdGlvbi4gUG9zdENTUyB3aWxsIHBhc3MgdGhlIGZ1bmN0aW9uIGEgQHtsaW5rIFJvb3R9XG4gICAqICAgYXMgdGhlIGZpcnN0IGFyZ3VtZW50IGFuZCBjdXJyZW50IHtAbGluayBSZXN1bHR9IGluc3RhbmNlXG4gICAqICAgYXMgdGhlIHNlY29uZC5cbiAgICogKiBBbiBvYmplY3Qgd2l0aCBhIGBwb3N0Y3NzYCBtZXRob2QuIFBvc3RDU1Mgd2lsbCB1c2UgdGhhdCBtZXRob2RcbiAgICogICBhcyBkZXNjcmliZWQgaW4gIzIuXG4gICAqICogQW5vdGhlciB7QGxpbmsgUHJvY2Vzc29yfSBpbnN0YW5jZS4gUG9zdENTUyB3aWxsIGNvcHkgcGx1Z2luc1xuICAgKiAgIGZyb20gdGhhdCBpbnN0YW5jZSBpbnRvIHRoaXMgb25lLlxuICAgKlxuICAgKiBQbHVnaW5zIGNhbiBhbHNvIGJlIGFkZGVkIGJ5IHBhc3NpbmcgdGhlbSBhcyBhcmd1bWVudHMgd2hlbiBjcmVhdGluZ1xuICAgKiBhIGBwb3N0Y3NzYCBpbnN0YW5jZSAoc2VlIFtgcG9zdGNzcyhwbHVnaW5zKWBdKS5cbiAgICpcbiAgICogQXN5bmNocm9ub3VzIHBsdWdpbnMgc2hvdWxkIHJldHVybiBhIGBQcm9taXNlYCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBexports.specExamples = [
  {
    id: 'C.3.1',
    huffman: false,
    input: '8286 8441 0f77 7777 2e65 7861 6d70 6c65' +
           '2e63 6f6d',
    output: [
      [ ':method', 'GET' ],
      [ ':scheme', 'http' ],
      [ ':path', '/' ],
      [ ':authority', 'www.example.com' ]
    ],
    table: [
      [ ':authority', 'www.example.com', 57 ]
    ]
  },
  {
    id: 'C.3.2',
    continuation: true,
    huffman: false,
    input: '8286 84be 5808 6e6f 2d63 6163 6865',
    output: [
      [ ':method', 'GET' ],
      [ ':scheme', 'http' ],
      [ ':path', '/' ],
      [ ':authority', 'www.example.com' ],
      [ 'cache-control', 'no-cache' ]
    ],
    table: [
      [ 'cache-control', 'no-cache', 53 ],
      [ ':authority', 'www.example.com', 57 ]
    ]
  },
  {
    id: 'C.3.3',
    continuation: true,
    huffman: false,
    input: '8287 85bf 400a 6375 7374 6f6d 2d6b 6579' +
           '0c63 7573 746f 6d2d 7661 6c75 65',
    output: [
      [ ':method', 'GET' ],
      [ ':scheme', 'https' ],
      [ ':path', '/index.html' ],
      [ ':authority', 'www.example.com' ],
      [ 'custom-key', 'custom-value' ]
    ],
    table: [
      [ 'custom-key', 'custom-value', 54 ],
      [ 'cache-control', 'no-cache', 53 ],
      [ ':authority', 'www.example.com', 57 ]
    ]
  },

  {
    id: 'C.4.1',
    input: '8286 8441 8cf1 e3c2 e5f2 3a6b a0ab 90f4' +
           'ff',
    output: [
      [ ':method', 'GET' ],
      [ ':scheme', 'http' ],
      [ ':path', '/' ],
      [ ':authority', 'www.example.com' ]
    ],
    table: [
      [ ':authority', 'www.example.com', 57 ]
    ]
  },
  {
    id: 'C.4.2',
    continuation: true,
    input: '8286 84be 5886 a8eb 1064 9cbf',
    output: [
      [ ':method', 'GET' ],
      [ ':scheme', 'http' ],
      [ ':path', '/' ],
      [ ':authority', 'www.example.com' ],
      [ 'cache-control', 'no-cache' ]
    ],
    table: [
      [ 'cache-control', 'no-cache', 53 ],
      [ ':authority', 'www.example.com', 57 ]
    ]
  },
  {
    id: 'C.4.3',
    continuation: true,
    input: '8287 85bf 4088 25a8 49e9 5ba9 7d7f 8925' +
           'a849 e95b b8e8 b4bf',
    output: [
      [ ':method', 'GET' ],
      [ ':scheme', 'https' ],
      [ ':path', '/index.html' ],
      [ ':authority', 'www.example.com' ],
      [ 'custom-key', 'custom-value' ]
    ],
    table: [
      [ 'custom-key', 'custom-value', 54 ],
      [ 'cache-control', 'no-cache', 53 ],
      [ ':authority', 'www.example.com', 57 ]
    ]
  },

  {
    id: 'C.5.1',
    huffman: false,
    input: '4803 3330 3258 0770 7269 7661 7465 611d' +
           '4d6f 6e2c 2032 3120 4f63 7420 3230 3133' +
           '2032 303a 3133 3a32 3120 474d 546e 1768' +
           '7474 7073 3a2f 2f77 7777 2e65 7861 6d70' +
           '6c65 2e63 6f6d',
    output: [
      [ ':status', '302' ],
      [ 'cache-control', 'private' ],
      [ 'date', 'Mon, 21 Oct 2013 20:13:21 GMT' ],
      [ 'location', 'https://www.example.com' ]
    ],
    table: [
      [ 'location', 'https://www.example.com', 63 ],
      [ 'date', 'Mon, 21 Oct 2013 20:13:21 GMT', 65 ],
      [ 'cache-control', 'private', 52 ],
      [ ':status', '302', 42 ]
    ]
  },
  {
    id: 'C.5.2',
    huffman: false,
    continuation: true,
    input: '4803 3330 37c1 c0bf',
    output: [
      [ ':status', '307' ],
      [ 'cache-control', 'private' ],
      [ 'date', 'Mon, 21 Oct 2013 20:13:21 GMT' ],
      [ 'location', 'https://www.example.com' ]
    ],
    table: [
      [ ':status', '307', 42 ],
      [ 'location', 'https://www.example.com', 63 ],
      [ 'date', 'Mon, 21 Oct 2013 20:13:21 GMT', 65 ],
      [ 'cache-control', 'private', 52 ]
    ]
  },
  {
    id: 'C.5.3',
    huffman: false,
    continuation: true,
    input: '88c1 611d 4d6f 6e2c 2032 3120 4f63 7420' +
           '3230 3133 2032 303a 3133 3a32 3220 474d' +
           '54c0 5a04 677a 6970 7738 666f 6f3d 4153' +
           '444a 4b48 514b 425a 584f 5157 454f 5049' +
           '5541 5851 5745 4f49 553b 206d 6178 2d61' +
           '6765 3d33 3630 303b 2076 6572 7369 6f6e' +
           '3d31',
    output: [
      [ ':status', '200' ],
      [ 'cache-control', 'private' ],
      [ 'date', 'Mon, 21 Oct 2013 20:13:22 GMT' ],
      [ 'location', 'https://www.example.com' ],
      [ 'content-encoding', 'gzip' ],
      [ 'set-cookie',
        'foo=ASDJKHQKBZXOQWEOPIUAXQWEOIU; max-age=3600; version=1' ]
    ],
    table: [
      [ 'set-cookie',
        'foo=ASDJKHQKBZXOQWEOPIUAXQWEOIU; max-age=3600; version=1',
        98 ],
      [ 'content-encoding', 'gzip', 52 ],
      [ 'date', 'Mon, 21 Oct 2013 20:13:22 GMT', 65 ]
    ]
  },

  {
    id: 'C.6.1',
    input: '4882 6402 5885 aec3 771a 4b61 96d0 7abe' +
           '9410 54d4 44a8 2005 9504 0b81 66e0 82a6' +
           '2d1b ff6e 919d 29ad 1718 63c7 8f0b 97c8' +
           'e9ae 82ae 43d3',
    output: [
      [ ':status', '302' ],
      [ 'cache-control', 'private' ],
      [ 'date', 'Mon, 21 Oct 2013 20:13:21 GMT' ],
      [ 'location', 'https://www.example.com' ]
    ],
    table: [
      [ 'location', 'https://www.example.com', 63 ],
      [ 'date', 'Mon, 21 Oct 2013 20:13:21 GMT', 65 ],
      [ 'cache-control', 'private', 52 ],
      [ ':status', '302', 42 ]
    ]
  },
  {
    id: 'C.6.2',
    continuation: true,
    input: '4883 640e ffc1 c0bf',
    output: [
      [ ':status', '307' ],
      [ 'cache-control', 'private' ],
      [ 'date', 'Mon, 21 Oct 2013 20:13:21 GMT' ],
      [ 'location', 'https://www.example.com' ]
    ],
    table: [
      [ ':status', '307', 42 ],
      [ 'location', 'https://www.example.com', 63 ],
      [ 'date', 'Mon, 21 Oct 2013 20:13:21 GMT', 65 ],
      [ 'cache-control', 'private', 52 ]
    ]
  },
  {
    id: 'C.6.3',
    continuation: true,
    input: '88c1 6196 d07a be94 1054 d444 a820 0595' +
           '040b 8166 e084 a62d 1bff c05a 839b d9ab' +
           '77ad 94e7 821d d7f2 e6c7 b335 dfdf cd5b' +
           '3960 d5af 2708 7f36 72c1 ab27 0fb5 291f' +
           '9587 3160 65c0 03ed 4ee5 b106 3d50 07',
    output: [
      [ ':status', '200' ],
      [ 'cache-control', 'private' ],
      [ 'date', 'Mon, 21 Oct 2013 20:13:22 GMT' ],
      [ 'location', 'https://www.example.com' ],
      [ 'content-encoding', 'gzip' ],
      [ 'set-cookie',
        'foo=ASDJKHQKBZXOQWEOPIUAXQWEOIU; max-age=3600; version=1' ]
    ],
    table: [
      [ 'set-cookie',
        'foo=ASDJKHQKBZXOQWEOPIUAXQWEOIU; max-age=3600; version=1',
        98 ],
      [ 'content-encoding', 'gzip', 52 ],
      [ 'date', 'Mon, 21 Oct 2013 20:13:22 GMT', 65 ]
    ]
  }
];
                                                                                                                               i>͹�-3J&t8	���uo�,��������lC���Զn�����_�1���u:M�- r��X?��pԛ��Y!�;���E��{X���g^!z������(ђ8n�X\�3͓�%�x���F�z���+�cd��|5)Xr����l�   ��|i�2Y�}60܄��[E3����,1��a����7�yyI��S�>)�ʂC����㒨K����^�$k#ڻ[�����Z�)��`��?��҂���a�r��H\� T���/�ːn2��!�e2xŧ @4��B��! -�T\,,�A�L�X�i�Xo�����{��\���<�A�
�b��&��h��!���gArC������y#�Z�>qĞ�c��뉂�K��햪t8cZ�̚JA؍�a޿=`�x҅�XB$s��!m�H��sM��l�͇��\���!�z��   V�~nC_;�xې�V\u�B��aiH�:-qn�A+��ې��xl�)',�ʻ�6��SY����
��^q�R��-M�H�J�Ku*  wA�c5-�2�1��)�#B�OYq�m������'	�U����`~�X �!���j�~�΃8�s{T�~$=~�&�?�����+�7�K�s��_g�8r�&���_
��c �ս%(�n�Ze6W��\!���\e2��2�,�8��HW}U�!ݛ?%��Y�޿,���9J^b����5�!��
	��1�shI+ά� ��^�/�gHX��풳>S࠭G����2K+�/Ъ-w��I�����h��?>��&G�S�˚���4����?�uG��&7�+��s�N�!�W�4�w��P���9WS#��q��kLX|!`&�d�����6T�	�z�*v�e[!�'�#U����C@�F���+9OTu�Rv}֯sD��co��M�JmV��s�N)؞�v�{Vx�{qb]s(�P��ׯd-���(��0��7��$�Nz�yY�D:4�T��ힱ�2�ӧ�̐���w�N-���u۞F�a-����]������ ��ĜY�*��WP7�AD$c�w����=�=ãV��Q_)�ڡ�b���x�a��*��EGE<"���`�|Q�p��vǫԑ�b���3l�8�%���r!��Ő��6�ʲe�2w�2ذ۝>H��Nn4M�й�!���O��P*q�!(Y:4?��0==�4G��,g󏟾o)|�g#���
��P��O���Sj{y(���������t|��u��i��'H;=�Đ��*�psW�H��)��P�NW�B2�'1����Tr����h	.zd��oC�R�\"���2bi����%z�g��+kh��B*Jޓ�_��i��\ђZ������F�Z������VuD�)l���������V?Q	fƨ�G�Ɠᩬk4���`���w��g|��f���K��f���R&��G����� a糄vJ
t�g�94�T.�$$��SI���i� 7Zؗ0��Yԕ)F;~w2�_�UR@J�9�CB�����ǀ�3 ����}4�x�t�3�Ժ���su���(��.�{s�d�Y�ؙ���hz�}��Må�:=w��3t�%H�ڻ�س��1crsCb�W��e���73�K��6�&n��<�
U���G�cP�Sy궦~��o0Fh�	���R/`�]/�;4�/�����8�E<tJ���K��!9i�;~�>(�L��I?r"VT7�'Į<s�t�P�~$d�Yv����������.1����=Y��||��#��ԅԲ*���� }��@SE��	+�.]d!s3����	I_�=5c)L�*w�$�s��OY$�)
H�l���EL��R�Gje�?t̛��Ԁsw2/7S��L��oN �X [~e��;L�	,"e��eZ�OQ���x�)i@��q�Ce�
�3��c<�`�)�}���J
i���O8���/��䟨�f
���L�ګS�Ι���Վ��3�5����� ��F�1[4~���q�� ���bx���Ѝ��	!x�4�,�~u�N��D�jx���)��2�t�[�	[Z0��C�OM�_�<�C����{�a$s�o����t����X�LW&��!&5�a�&K�5����i��z!��"ra�B��Z�NW5ϟ�Y!�Y����c*��k-����pܒU�#�J)����uQ����AXne��:V�lK}�W�[����^|���������s��w$R�a�q�ma%%���_-�>��K�!rʜ��Z#�Z_���[ƤT=b�A��t�3&w9�$nJV����3{^剦1(z��e[��>!z�L')�E�0� �Ҹ��J=ƒi��m�QW]^�3w�eg��>Ik��Q��Z���҇`[^vxS�ʼ���H��a��,� �]􂕎���==��i��E��)��ܲR(\�=*����l�-�����p&�I�|A�a��YMe�G�E�A�o&y�K��Y,�IF<w��V��;�t�P��v��[�P��oSp�n�ҝ��V�X=Pgd��`���O�I�8�n�8g�B�){�H�uK~kV��4��i�>l�=�膏s��� 7����J��$������c�	�m�m�y��_Ӥ��R 4�@��ђ�8�� !D�]m[%���p}���Yh���ړ.E��p���!l�V��
�!#5�⡯ �ᬺ�7�1M$��_�Dzite�H3٠�Po�'�I6�3���1=��{)��؏~�N�\v�d�j��e��� �o���ա�?���Q��쪑��c�#�Ҫe����R~
d$`$�ǇmQ��oU�rdݖ9�w���;�h�Celc�=ޮ=��E�V�bME 5�p�
%G��R�n���8�*�2�=����hw����귷�X��K��%,D��:�x�%�Y�bKO���C��=�:�)��(ȍI�o��)K�Lؚ��B-S��P��.v��UӀ��kF_�w�M��H�҅�|�����KB�e�i!����%�˵U��%@'c<��n�ULßvgo/��5�J`�#s>�*ݺ9c��B
�#*�gH+��DS�@�U���L����#xD ��O=]ݎ�v> }����ѻ���*e6Ϝc��W���C`�Y���H�5;	j�-�AZ���\��_����5�Sb�+��2ˊQx2	c����7t%�U����C�&3s 2�f� AE^@�Q���ѩ8/B?V���!���V[#R�ݫ���p@�E�T� -�(�b��`�m�EK^&��9T��n�p2~��?�&.N�Uv�����@i���(^��n0�H���FٍV}3�m�~��[���O�5 2� �Jy'mpon�7I���&�l9*��>.�L� m�O��g����TU<��
М9�nX�M˂f�v<MQ�  �A��d�D\-������(�l����$���L1<�g�U�nq_F����ˉ?k�H�{r?Ke���,O��`��+�3Z�ٙ�>�m-���N$�ccA�"ؗ�)���tl�/&�.��m�0r�����'�����L���Xeb�Čf� &�21l<3�F��L3,�뉙�4|K�(�q$y-�����6�F���&�/b��V���H��cg,2u
2���&�J��p�M,Vs^v�=�}��p}x�V�jq�#`n	�6�u�����e��R�VPtnVѢ�� d��Lh�	J�xQ�)�~��y���ioP��z�;���~�-s�K�Ҭ�ާ�2��%�[e�i���?�3_%�g�.UDz:bV�Ѭg�%�>�y��EmlY� K���kss/���3�n9�gg5�u*�:kz�V��5���C哪�b*��57����yJ����4�7=�U�y�V��������,@4��p��! �EG  ��rȒ#��<���'��-�� �Ʉ���P��GI����-EEȈ����c&3�+�2Xv��=-�s�Ra벰f��� Q�O5�B���v���)�� ��^f[2�	?��`�[�zVE�#`�E!�� �:��?>�?� P,�    ���i��޵���+��'�v��ㄗn��͟�uFgp�"���;���)�^��������I_xx�^�XMh��V���7�om+��҇�+��f/:BHjA��k�����p?�� ,�6�&�߇���b'�R���{��{�������"�c��M�M�e��h~�}�7�A*G��w��٦-���7�l�`�绶�03CD�e+/*�ǔ���L�l�?퍢e   ���nC_��X0�l�m� �;H��b�߫\O�J3��D}����;�1"��Ay�#x��ώ��.����
��'��$��AX���"M�?��Ҧ�PN.<�"��JI?HBt���E�$'
t�)4�&�7��,T��TE���;/�g	Z	Nq�^L����3!IH���+� DF�Y����h�PKV"���d穀Q5���RYNUd  5A��5-�2�1����C"�N8AV��{0�� �:䆣ѯ��<��Ԫ�$��U�������՟
�?��Wy�X<7�>�a�B���T����*�l�ƹqN�J��ֵ��~�@	F�cD�jU|Hw�5��O�ãSd{���݅��l�mρ��ɶN,����ז8��p���j�DY��~����-�%��od������a:&� 9d9t�&G���0�x�ښ��n�@#EH�Śk��f�fF��Acp��;'�����E��Z9'�6�M�}���9(�h����r�`�"q�����&7�W� ID36�zB��"e��QM�uE�.8R>p!W�.�U;l�ZhqGJ������r��6=��E3:���z�E!�A{J��1z��[�ZXQ���${r|���BiTD�F�?��%��p�q�,�i�߻��أ!RQ��^:��҆���\s����F� ���W\��<�Ϧ������\��0������T9�d�3c/-T���0�y�9��g�U!���━��]y�=պ.ϡeҖ�w���[�����4	)Χa��P� �\��ψ�هL��J��1���7��=�G���6-%g�v��>�hz��A�&Ǒ�g��\ìs��8p�u�	^߲���T�b��f�c]���V]�+T�S��{���.��j�n�C4?=<��7�����z��O��EL҇=\��M��עQ�So�n9���r	�ģy5�8&,�75���[���p�$Y� HC���������PO�MЫ�/¹�m��W�+�ݿ@�Z��݋�Y��o}t�_�je=�(�R�]�&�l�����+/�$����ߦ�;����T���an؅o���*��d��~Fիw<��3�!.x�'ne�!~�OE���Q>������A�Fx��n�M���F�H��U�F�'U�V(��k�ݣ��~�v�o�'l�y}v{{��cyp�[�ϛ*���AOG�j��߾J���j���Y�>ɼ��QVv�_�7 {h����(�i�=m_�eP�WS1�g^q+�k����;=K������&��vVi`�����eä&z��,LU�&)M���`_�Gx�0M��MZ���=�� 5�`��1<�c��?"*Z�fhl��3ֺ̶�-���F�/���I�:�Z0o�3e���,��n΋.N�ēU}���������D�����'>���� >���zV�^q΅��
g�U&�:��g����v�7����R?#����/�0�`K�o��Φx��FM
�b�Q&B`J4��9�C@��7!� ��k "n�H'�w̳��:��O2�EەE����JR,!��X��,��%)#��Pm#,��j	��u_��D x�5gq���&�s�=�q�1ЛX)�mGˡ�d�Sj�[P@���e�o�G1�(��EY/��A�Z+KlI�T}��;�����c׵g;� �Hh6�d`8  A��d�D\1�yڜKP�m_4ҲtY_!���[ל~H���w՗znx��Mq����zy��$L�_�m���Ѫ�=��r��~"_��qǯ��-��`S�{�}P@�Уӥ6B͚�Bb�^2��'W�I����DB1����WR�������6T�1��iu�ʯk�P�n�Ly��2F�1۸^l^K"�d���V�y�q���"td�r�CW��`  ,�����jP{.�4F�c��^����v	�Zg�*�Bر����"��D�	�)�Z����|�o   ���i�:f�����x&����rP�6���<�ڪ;PliC�j�QX�V�S��y�ݱT��2$Ou6���Zh��Fp�,���������Q�,+F����JÄ��R7`���jd���IW:�-g7�mĲ��%O>�@HG�k��5�+�����A¢���?��|"7   z��nC<e�M��ʘx���u�O%CnN�Y]��������ES�UE�&Tŷz�グ�5���O�/y�>
��I�Z�8�+����3ǤXJT�,����A����9~��X��v@F4�[
��)B�, �i�����+����!ًǠ�Tz�x��O�(޿H�Ҥ�\��v������A�X���(`>�I@%��]*�A��������>��^�	��r�.�D���GX��c�&�N�?�.��B���d������Ԁ��b~{~�??�J�   �A��5-�2�1��������z�RH�ֳ �}b��!�~��5�,����(>հtk@ ��@6����;N�&*����{Fڒ]��Y���nOP���RG��yUr���.=Н�7��b<����t߫96�U��a����1�?,����$��������9�:��jt�6"W��h��é��a�mI ���4��X�2ZkKXI��5^��p���.�9�F��T�*�Fd��ǯ@4�9��\�0��^�����P��"��Q�������7��qHg���LE��2�M9$AS�����!���USTѳW뿎�8��I����e|�q�?�(Hrn5���U2lb�ݎ�'�[B'��	c��	I.A?f��@�
	�-{�r��Xx��]��{[�X��6��"��d���<�ر�eX�.VkvTN
��ԉ�qgYk�+�!�0c!���"{^җ��M6���av�8�ef����KX\�<�A��5�\�˥JpH3��&��a�����`<)���H��t������b6(#1�>�>��:��١	���g���A�˽4���_X:D4Q��ຉ��1�5f��u0z<~l����ByXr}>�x��_�E�ݖ����y�y�Mx�(Ɏmq%�&��>��V��)������m�^ss�����+���a�Ǎ|���p�0���h�bw��2���v�O�"�[�ҏ!\�0��o�j�g7t�x�T�L�n^k���$;�A��k29��+�O W21q�'�-�%[T4�Z<$i+�%�y��;g4�K,�*�E�8V���87*-�����\P$�Z3��t�;3��t_�;ٚB���4�ca[�5��' �����zaA�>����Zɥ�ł� n���Ig+��eCXd+=P�F�ǈ��k��Sw�51�������7�<�0�"=i&Q�%�1 [�l�ʍ>j�S����3Xa{��8���;g��s��.U�X��`��a���F���)� c>Ww��LNʕ�(*�"�v!�h5/2���������[xa-��§��֫�ZM���r�F<2H�O0R{��7y�OjB[1����J2�rS������n��0��i���}�r�?ܐ��W�o��R`�oox���k�=,�����"�P��tW����L�b��$���id[��-�z7���u��Y(Q��uVhK�a�Uu���+��y#��K�����Ԁq4�@�2�&9��k� �E���~�]�=��+�k��v����5�!x!��2�>
@[Q�����,�L�.�#���3�a>dC��y��ɺ{�O�)^�U@�(��B��S��.j���$7ε���KiK��m�2�5��۴���2�,ȉ�rSp�_�e�b�նc1Y���z+(K�1��}�}<�� b�Ҭ(F�)5Ǐ_���ZҀ�#��d 4u�*�?7�amVĊ��8
�љ�OW��[j�@���deH�:u�#g|WJ��s��b?w6�r���ȝ�no�����c!+����0���)B��n�Ҳ���p�����[�,QE�,qq>��@E��,�@@�\f;�Ձd����A�夗�8���j��&N���5��ȱU����߁�x�Y�`k���B2(?� (S�]I��d���PJ��:��������E��͍q��G/�x� u�R����ks�˖��Ű� tN�DSx�ҪJܦ�����  �A�d�D\1��I'�W�/AC7&x�&��<k���0gbQ�U�&%�{ˬ�G��)>�
��}��j��a�����۔%݉�a@C>�ۀ��|�b7��&A��}�"��%8��J�~R�P�"oѼ|� ���q��I51�;ڠf�9Cg��ɑ6İ36e��N�c�3XWl���/s�o
�� �^D���Mi�������Fe��s�����lb &������s���Ǚ�Aof5��8י�{8@���A F#�P6a��q�N��e��[���y��c�>��r�!5��"7���0N�$a��>J7��6f��U��@=�A������!�(`B�٩ 7f���=2�����]��ډ�@��p��Qȫa�`����
l�xS��Re����Ĳ���:/e�v�7�JZ�G�H��2� pwfb��9Y /�~���rb��%����RS���d��xCv��
#J�l�4�����J�+�F������ж�"B4��92 �" 	V�, qV�&I�H�g�	�����FB.C 8�L��؄�����6��08Dz,�g%q�O�\�.欅����u��oM���nS��<8�	��{k��U��obI{ ���vH�L�J�4�~�pQ�N��9򣳄��K�JG�,��ޚ�]G�WL�ǖ��0 �E��F 8  .�)nC��8�(�4�,�\.���0�1΁�&4}?��$���Wh�j��I��.\܎4^o� ��:�����z8������tfBޣX-�+4ٰ�r���$�!D��'�PMUk�G�A5p��﫻� �������T�]�Vy��ZEnW�9D��5���p�iP\��u��L�-��O�G��p�F9�U�|)l@�=$�^�Dj���&-���HmC�ΈϞ1����pz��t�R9�
ķ^x+G�6Z2�:�����.���x�t�؍�ą��&X3G���}�]L�*���G@�99� *�e�� �m2uH�߿$*aJ��c�9 3���mEg�l�虺1��UE�)��4����	��N��:��}��r&5!�C�T_k-�<A���Ob~{ڀ-�// \n = 10
// ; = 59
// { = 123
// } = 125
// <space> = 32
// \r = 13
// \t = 9

const splitIntoPotentialTokens = str => {
	const len = str.length;
	if (len === 0) return null;
	const results = [];
	let i = 0;
	for (; i < len; ) {
		const s = i;
		block: {
			let cc = str.charCodeAt(i);
			while (cc !== 10 && cc !== 59 && cc !== 123 && cc !== 125) {
				if (++i >= len) break block;
				cc = str.charCodeAt(i);
			}
			while (
				cc === 59 ||
				cc === 32 ||
				cc === 123 ||
				cc === 125 ||
				cc === 13 ||
				cc === 9
			) {
				if (++i >= len) break block;
				cc = str.charCodeAt(i);
			}
			if (cc === 10) {
				i++;
			}
		}
		results.push(str.slice(s, i));
	}
	return results;
};
module.exports = splitIntoPotentialTokens;
                                                                                                                                                                                                                                                                                             i+c`���~~nl�f��k��y���E�� ��D��D=�wk Ȋ&a����cͯw����vF�^OSv�
��\] S6Ώ�,^q���m���X�MVҊ��ڲ������V�3��&��l�/��q�	}a���/�[��5\��:J�jT�L!�����{<2.	nI�{��$��������HI��D*��sY��0�S��?kA�3��]�S�7[�5�ϯ[YL�M��e�C���9Q�OF@ӓd����b��Јi���z�e������aVa�l@%�Ց�H�+̔�N3��&���ђ�䔽��_5QQTh� c�0h��Yܦ�?1s)t�ٹ��*#]�����HBZ�i����o��d<�ƕ$aj+���P�g7H��
�����Jܺ�� �Cd�x������ �v<��&�y�0�u�	bʋ�)��j��~BY��[�%ȹrmY`�S��CFc�޶�Y >�)H�v07�`5om�o̱0�^��	�)���!�R}!|5�_i7�g[��$��>��� �� T��-��G�2^���య����w��(^^qG.�FY��Vn��T�0Q-y����� �	Oޯ����7x�a��O����7�6ᑹtz��i�lE��'H+#�I���WC�ѥ����(��v�@�#ɷ@?S�u��?�g;�eP��#A�OGew�t)�o�j�82��N��Q�٭3���C�6�`/s�?4)��mF*=J�d�de��e��c6�������C�2��n3%n�t&�q/�|�l�k|�\�Xt���E�Y7 �O����87��{���a#X�Pg�����;���X�Qè�}�`|��w��y����W6"q�p�-� ~'��P�E��R��)L\,��j؆Qέ�0�z���ݠ���d���1'��<�I��j�*?���� ��
�A(|\>�F,����B"V�lVB�зi]&.� ��Q�b��zjo��sn6�meطG��>x%�?��=�v�=���*Cݣ|���ν1�vG%ʍ��D���*�Npw���{p�L��@�X]���a�T��7)6^ 昊�Q�LA��0�cE�,��Mq_�@&� o���6HL;Ն�1�\��``� ?5�7�qF����٪6t���ٝL�Y�ޭe��
Z���ֻ+?ǯ&����ubY���o�qܳSI��� ��� $��)�R�g��q?�͟*����ņ� ���Q挞�.g�#�\JV��w�S;�Õ�K�CjO&�bdz(ѩK.�HD�,�v�C	(Wd�YŻW7���P:������ѧe�o�u4� "4�R��|�Y�i_�̈́��/C_���l��~�~F����d-�0���Z��0��m��xY"^DXnmӍ���@��,�XL����Or��,�MLrz�2(wk���--�0�{7/<�+�)l'�XqIy�)Ĉ��h��`��R���*K��p��&�Ro�0�V�Vx_uZұztD��8`��e�,�dׂT3��w��	�L.L����=�����b��f��l����{�4�\���2��د����t���x�1 � $�H��g�)u���y���� xn�6&��pe���F�[�8��[č�ơ�O������m[� �o�3H$AC������ ��y\I��Dɲd��䂯�?��>������:�W��z�C1;`
��}�Pca�qY�3Er�L�Ah���U��3�аv a���x!���2�3��/8�#�#��b_��+an[	�]i�9����5���7�5��v�����M;1y��:�)w����0_�(��$�4�H�$�L�]����C&�[�O������/�1N>�cŇ�:��.n�j����y�4US�sо�4%?�LX!6��kՌBf`�3��s��>Ӣ��+FԆ��Kv��7���Z�;+���e?�OD¾���UOq�" V~@Ns7G���y"5�Igf~/;�]���
��z|N*������%�r��ZmA<���e)h��U!+�E�n�OKt�c��U	�γE�O����n/)���C��;�IWc?���i�>@I�j[Mg]CѸ����O�l)�"Y���N<2�r�����Ԋ�\;�5]v����X����/�����Y1�[��1�Dy�2�'S�h=�K��^��`����[;,�3Y���&��P
 ��1N��U/i��Ц��H��Ӭ4^2f*���ڊ���W4�?��}ا2�"J�M)����j�7=�T��oTk�u�R���~�O.��8�AN�fBg�Vx LX�ww��ma$������LB7Ix�}<���2�����ՠ��:�م.�U�6�3��*~���@-)����dn��N˗�O���MǱ!|�B�#E/'��=z�[�K���z�1����y4j|�&���T?�}/�hK+eнjb�Ľ�p={8�V�۶@��l� +睵0vᤳU��T��ht���icn�g9��1���%�k�a�+u��l��'t�;E}ap��O0��8�����61/��	�dO�󱭍�Pu_zj ��3��DP���P)O<sH��랩Ϟ��Tٵ#�`�z_�sPԿ�Xv����%u/�w ��G��Y�k�-,q#(�ܷڷ�"2k����0�ʬT+*|���2F�|�w%��ea�A0 ��n��j`r�~bA��p��T�1<����B&���<BR�$[�^23�g���n��pI����]?2-��^_��Ŭ★=z�]W�'`�fr+���y��v��2W�N���zUQgrp�>_1_��m�XP�5b0�W�=����}n&�a����w�+ح�f/�ղ��U/6o �\~�v���x`�hpuYr�;B¿ȥ�B�W�Ez�~�H��?E��׵����.��vS��G��UmG��l1�S���:�c��<8^W�M��钧�����n�$R�拶L�3
�0#'ΰ�M����j�'۝y��̓��a���w��2��*���s:��q�_�4�6�j�XS��������툽��ĻV6�i�~�U����(�$zyr���OJ%��< �� �����}�������*��3�ɚ�C����/(r��V25�ΉO�|�E{O�q�	}�b���3U�ㄞ�h��ۮup��/p�m��k�)�ץ�R[��$�5�EpO�3�Rj����YJLt��p���r{���//|i��3&��K}�8��D��|9��berE��Z+O�I��D�L|�.Y`R�6%��)�a�x8,w���?�!�g����5Lw��w���Z����d�"K}���`ҙN6��r�#�#[���\a�A4h�����	��쾐a�4 ����YUCS'$_��:�3�;gx�Ū�V��!c����MWltW8ݺ�n��Kb�����8�=��<�+��j7�_����@Ț��4�|��ު������? ��.G�k�J�ӓP�E>Y#�G>��h�x�����]�?����I�^�W�jҖ�X\�&��$�	������b��-��p0�T�5oIG=rP��Ѭ��3,F@��77�{��C�]�3�:m�p��g�dȓ/<��@�E�n�诸MO�܇�ڂv��<Y�1i>:�@��6�X~��3�B$�9��ݩ�0Lulsn�]5�����:�d1�*��XZ���i �`�&���2���>�,�앏J�h�ġ�f�6o�^�Z�����JԍSet�|L�S�h*�V*�i�'�7��(�b?�	�(��P�a�F���P)[�4�5���IϺ�J3Siך�=��!N�Z������>�v�F���[8���B�z	@�O�J�1}�82�����6�yr�I��ሙ9?��2��

��V�&0sW}�\�:~Mͤ�iyݟ����B�C3�M[wr��F��Ԅ��ԩ� �7���9���u �;�*|�6������������IK�&��^�����4e�5=|k���ps�bc�7��9���j]����k"b�\��q�*�Vm�z7����kV��S��{MT=������­n�>�v���]`�ڊ 6�5�f}�Y"�z|U�0ӟ��Lb�"|ߧ �N��צ����7���h������	we�/Z���r��4/�ωu{6[�ʹ+3�v���p�T����l< ���g��?���?�}�(}{�4��2N�'B�,��X{Q
G1ѥP��wlAz��ߚ���
�l!Ǭ�fF;c�&橖�3�>'sw$_��B$N�g�c�i���t�R��V���w�^�Hʑ����^��� �:nR���N�8m�&K	�F�:�����������K�����W�l����Љ\Bf'��R���z���n
v���%�<�O����|'����� ��_�$pc�d�.�!>Ӫ�[��L4֘nѡ�0�	ެl�E�W���p�E�uc+t��ZJ�e�2��FBY��qG���f$�
fva��z��k�>7�-A���=�hK��h��9���� �f@]�����>;��V1��w=x��~�s��b��f�� Y��!i���1Er��c���Ȏ������	%h�g�92 �V��1�m8���m�����58=��u���1�!��1�`+�pE�r��=M����^{D;��3F?:�
&o�;m���-u8d�_�a �*̡EI@u��N	M�Ÿ�C_o*����G�r�ཷ,�w?;΀[��Plλ�g�ٜ/$jnд�!���##��(-s�݊�;_WP����坜�	����o =1|0&]�Л*��<���Q;��x�>��^��^�Q�LƝ���m9Ρ�ԓ@�Gl��zձ��c�V)$�W�~1E�ӦХ�5�H���s�d����J�~����X-!�,]l���Yھ�)�bU
G�M�On���jҭ��z�o5tj3�^��f䷙j`aԇ�*�k��K�J��%�X�"�_��Ȃ������DJc2�Ɠ` �Fh�2�Wo�uO�K=��>8� ���^��a�IO�VjT3K#L�dtũ�?���q��#�iC�������ڧ��>3Hvzd���W��+�i^cD)�KKm�O��V9i��`X9F������)_|�$�i�J`DV��$k���g��9�$�LX�����?ױ��q�*;�E1��q�t�?�}��E��iˇK	2`�,݂Ӥ~��H����fBf�#�XT�t�=a4�V���*��d�d��삃��W�գ��m
����J鲕���m��3\!T��9�g�à���3S�֒j�4/�
0I&>E���%/�X�ʕp0�f�,�!���.A6�NVU����6Q(�d��{;Z혉_�M��B��/� �'.2�T�����R> �Z�A��G�3AIv4r�dL 70�h������.J��np�����7��,�$��Z�^����̲td���H�SȂ�@&V������Sy�|ʲt����ЗI��:"��o*,�ԥk:"��F��sQPU�2wq�s�ZD���:�I�U�]�+r�4�������H?��s�͓�+�^l�e�q�0�%�q�1��)kW3�#W��'i2�T��n�� 	��c��ۛPJ�� �öB���*�q�u~9E���{i�HLhbSQoj��.>޴n���3�� n�K�K���"w�ܧ��=�ޅϖ$�)�m�����P�6y�>��B�:K����
Xr3ڌ2|�cO�B��Շ�(�2��t����B����=+(�3�~"�*? �"Uxs�ě�|�S}��'�0<��v�ND�r�	�³����|wrc�)	��:��3IK�8��.��1�����@�?��J�O�yKS��k�2�5���N��\_�/�����FKH���Gu���ܕr�^,Ȃ���7Z�!��v��ǽ����9�P�9U�Z�O�$� Z���C���8>)�)�을xrW0�=A\�$]{G�M����Q1�Ma��v�%9�
^��'ڎ���jX&�d%A��M�nV<7�~��l��?W��Z��T�7B�{����F:����p�׻��]O��+-���#A`��N'Qe��mDY���%M����jƱ���Q=���ՙ<��nP�\�Dwƻ۳�5M�{�S�;YBN���5Ձ�r��/=HR2'G 6�n�Wd�vH��4�;Jx�����3�\D����WN?��O��0��|�N������J�[:��6YB\�! ��f�<�`]2���Bף{PM��xO�+��I�$��6���~�c!��.�Wd�*���M�&��4����ol������LLo��n|'�b�7sXa���ԥ��U}�J)���������b�P�q�q� w=ݗF��j̶�{���<s��tZMm���5�,)��ع�Y�	B�|���~�8<fm�����[l�Y*����=Fd������!�st�j��A$iك��ʥ��S�3�1SMjK����DT*op?N'���������A� K���l���g|F��o�?�2t��
0A��)�;Y���j�j�S�{j�.��#��>N�������2x�S������=�3��^���ˡ1����Ҩ�0[a�ʲQ��O��UԪ���E��I�V�ݵ�,��L�Wqɷ%�ү;x�����P��-ߋ���q�ǇA>��S������ǅ��5hO����L�
�(7�i�L�D��o��KƘ�6XfnWl*}�ep��2��B���`��Ԍa9��4�2̟^�o �]!���������ְ%.������9��tߪa�L��&��{'�i[���5C��8Ǵ7�^:� .����Y0�����ڜ�X��u�S�^�UkdW�@��FY�Do�z�d���G��d�Q��_/��a;��^�@#��:̗�����^&Hm뚋��|�O��x��SlLRU����#\|L�S ���J@ �V	P
�Gb3��[��f�E�C)�����&�v,�MT
��v��~:�Ou�������vN߲�mܓɝ:([�������o]����DgƜ��\-���X%��8��@yCI�t~s_hP��*)O�K�O��D������%Azc�����IY���b�>7�!5���Fv����T�7+õYQҺ�isZ�z�`>lQ?��S>L�E�O� �yBWV�j�e��>m<d�S�ь�2/���B���r��9��G��J�+B�z�EW� �>��xZ��A��_(S�|�/�WT�훨�%g�� i(5s�u�_|�_��d�:�I���̆ЏIi������vRi�3w�o��M7�3L���ðҥ��oU1�Z-��%��镂�G_��M�� 㿉F�^��4r=x�,]�LqZ4��/u��v̺>G���T�y�b`l�ѯb��J)c!���s��:�~�Q?�>*4e4���2XC�~)6IO����3�C�S�+��D���4V,�ٗ���s��x7�����V3�x遈�$T��-J^��(۝}�ɲ�g� ���asj�W���o5�#�T�=L �R�"bֿ�O޾��M:�$  ��k��Zތ��g6\��x�+a�9ׄ ��m�=��4R�&ۜ�b�q����c��E��(j��+���Sj�P7R*����߰�� v��71E��g$���b�$*d��`���C�s��9 p����s"��������3犹|���9���ҕf"wKeF\���=�T��UY	;�D��&�q�Q������{`�Q�`��d��( �c�� 1"4H��&gI�$S��Ӛ���<���G��jɀ�m��Si�a0
7
+���y��ь5+�:&�KH��J����3M���\9���D�����a�J��pi��X���"�f(Z�:]:Ü����W���WP�)�j/#��b�#\~��ʑD���*�"[\}���E��	[-����-�Cn ��ٜN�:����QV*�� ��삉�tޒ���ߴ�q��-�m����R|�i�)+O
���7�;l�"�	��6N^�����kϠ)P�mI}H�Ίo�G�~��7�B�+�@���ٯ�&��%aD�p��g�&b�O���%�ԩ���ξ���p'�!`��?����' ,�0o���ӎ�De��Lsw��ԇ���+&��a#��6Q��R��/ �<��H=<�e]�ǧ� 9�-�T5r;�:q� 9C���$�c�w�@<�Su"��J�ՀZH(�p)%���l��l��v7ȷ�e��ߔ�\���n�sh�Ă�I
364d|����5�݃Eq�dVڕe�l�Ooë?��=����8;؞�~$3��FM&lOf������U���(Uy[#v�Z�e���1_��vf��V����W�
�Pz�;Jr`�)���[��eT��,�)Wn�Fњ��(K�f������*!a6����EK +�#�n{ny�8٬���Jkgm����H�,���v���sG����Xar�
-CN�M ��1
����fQF�H�t|����c�}@�3������j��������f+Х��4�F�����̐ĴI��B`������>�yz��E}|x�����%�U$#R�Ug�d��1����P#D�9�Nk���*�q/�cC�v(��������r7�#�^�o���[|҇8���כ�e������?�˴��l���UKܳ��T���ٶEG�fvYȲ������"
��,!u��C4�Q���s���fּiVʳ�[Z:q
x7x�)8EW����U+�i�b�����7�԰J (���%�y*�/=I���>~0��ZQEv�?��b�PS�w�$��)���SgK:�`ce��W��N���	+R��΃�j6�/-V0���b�>� ;���#��i��m��.�QS�h?�OI"����z�W�y��k�Y�ekb��QU}n*�z�"A���"�C?��J,�����?�&�O�~��[0�;؅݈���3�_���x>�U�v���ƨ��=]���Ku����gZ������w9��Kn�*T��hl�<��WR䋣�ߩ���4�)���NM���T����ood���i5X*�C��.[���CK�
-H;ؖD�Ӱw"���+XV^���X�RƯ���S�U�M��(������vQ�����|����������[�j�dq?�G�G��W��.����F\g��ax}ER��)���j��@���1]���я ��5�: ,u��n���v� HY�_W�/Y 6��3�����_Em��<�<����Z�������� #4~���	8M�g/��E�}А�hA�Blۣg��t�m�?�1'yTx�R�Kזڸl}�� �qt����F��6Jz���,��Li��N�T#��u����<�Q����&� #o�k࣪F��Uƶ�>��bu5���g0�j�ѡ�}���	W;!>3o<���)=��ɒ�O��BjV�g5��G*^˅hh2"'k�K�U���.+��V���xg]6q�����?��vȌ�ƣ+ɑ��`l�<:��9M�F��eQ?���=����/�l\�r�=�K%K��9 6����6�R'hcMj���ʋ_��WA~����1��)�����I��1�K��%"p�C��4mO˪�S�˻Z7�;q��C����\;Z� �z�"xպ����<X"��R�hh�Wl6'��_�/$ÃyH��u�v�K�Фc��1T��Q�|�UC��)���L �C�4J��=D������S$�Y�n��<��U)��'��$�ԉ>-��p'��W�ƅ]�M^ntP(P�w�p�ST�2��y%5^���K��!+3},���F�%W��F��v!�����Vb`���� ��;?P�ƒlJ[� ȓ���-y�Of�2 �d���h%�z۩��yo cb�d��4��fI-;�|�Zx<0�7S:f��J�0������ AC{���3%xjx��W������/)k�z9�v9xL ��9u�$D@BK�-�p3h���Gڲm-o��T��-{��e�.e�b�S��0K�{���,5u�l8�ɩ����ђ���^�L)l"K�0�s�F��C��R�BҩS2l}d�Q����X�z0g��*��lN���F�T�Y���|�kƁ���iU��*kc��	�K�g>�	���{j���2:P���Ɓͣ�!�q�-�:��.�6���x�wM��PM��t��7&�|d	�J��{������"v��W\��#��OC�Khj)@DC{�ĻԬ�����~o=��E\�I殺*̑�;�0����R���Lr~�Y�3�0��?����~�I�������p����0cJ�&;��<�.{�Ť��w�c�dM���w�f}ʇ�7P�I�%�i�m�ţ��'J|�����*�C�A������5"þ���)*�1�笘��͑�[FFR}��fس ��D�;� j0�F��T:Nr�ѫG�����@S"0`ᦏ�����Rw��wsf!�s�2�F��)|��|����ຌ �4B��0}�����>U�!�������ձ5�}�+����[��!T�Ӧ �I�����]Z*zX�X �kUK����M�O%���K�y�dz?9�7L�*�ԯ�!ק�dJ�wBR�:_����HC;�L�-��i�wۼGڃE���z��������5�`%C���ߝ�ԉ��j�P�y�r^^�Γ������	)p�>Ұ���T�Irz����r���`�Q�3�&� ^�/�_���H2@ܲ��ʗJ�Ō��������o�\�� s�A�}p9p0��=�1���4��豦=3$��5TctP�JS��b�к�����D��\T�A�}/���[��v�� ��Oę׋(֋�2'.���}�hM�~��;滫K�t�Z����A����6�!qy'L96v�* ݛ��Oג�����̥ܦG������J=���j�A��՜a���HZ��6#�Vp�><�Zwc0<Y=��"�"p�݂l1�eg&x�Jz�����m4���`ɎD�8�Zb@HH��.'�RTYMĄ���G*<P'�`�bc93M=6��>O��}�Wv�f��K|���9þR��njVR�<"��2z�Xx@��\ʵE��=�
�����jhU�O[����۶��kt�5Y{�m��}��yc�&� Q�w�B:Wj@��W�3�~�(�"i��w����9�����D�3��꧴՞��`�L}�2.]�����b�>�(֠�̿�A���}j����P��YS� (߯SGtd��8�֖@?9>T2hNTy��ᤨ0��j1��f�\�Ék٤�Bi�����8����李M;���i�5��;,��m1`���0^m"���T��+/����|7�!�\-�@�ԝ�vZ�:mi��j��]L���}sy�-5"0�'_��7�XlF~�~t������oh.�T�-��uy�x28�%P��{ze�(���?&O��'F�w�濹X_,]��k�!�|X���λK"w��3�.���/s�����>�����j;g�S�g���F�����k	�$�Z ��[b����:�k���-&���Ӯ(�ns�AV��1���F��8���?L��8d4 ��$]���h(!6\~K 8uN��]�	�-T>Z�y��f�34Ĝ5v�%Bm|s`��w������a��.�6N��M���tn;P!_�e��6��j列�1������w"2���ry2p�=�<�2���ǌ
U�y��^]��G��C���&���笐��k�"�/��I��o_�B�5<�ን��R������{�6J�"��y3{�x��S��A�@3PNo�])�<�İi���cھ��w�T[�W������(և�y���I,�?�n"s��jx��ٰ��I�<�^�3��:ґ��GT;���|(��?+�ߋ'e>$Ѫ�±��u(�0v ���n#M�����{c����g�2�ÇP�ղ'��KGو
�ͳ���X}Z1+��m$K��ᬂA襖`	1c�B��:б���z�����Š���0��3�aA��=��n�'	���Az*J�?`���D7ܘ�D�̎�^>E��s�y�m��n3��4q�[�i�&*���C|AP����YF�Ò�C%<��G���	o���&n�w��������CLz�N?��"G�y�+����udDj90ۘ�����4��$���,q@C��(�l�w���/1xs�瞵�,�.�Y�|��\p�Y8�[�6��b��u��_��6Պ%��qyx㫚�.l�*c�WX\gt��xv{'��"R�B�]�i�$-i�������P�������5�)�H� ���*8�\M��Z�����)
��7%�L7���Nk����y�	��8�l>��SǤ~���%z�}���bhH}��t1t�EC��d�=�����/�H��s�� �0=�$�
=��a�	�<��Uԟ��7U��e�D�]eƲ�/�2��F�)����eGA�Bwhg�A#��D#��M/�Z6WT/�V���E�J	�����lf�ks-�����&�l�Ǘ��\y��5ن���������oL����L
L�|�'��8򥹙vq��G��mI�5��>Zt)^s�,��r#�?��i�G"����eu�1;��{įq�Fq��əd��w2�Բ��_&!�� 1�aCtQ�y˧y=Ũ�D��r�U`g�+�r�74��r2���1;y�#��\���A'�|�4!�8���]��1�VZ�+���]�W���9ck�B�S�+w7V.;�Ĉ�%a>E���V^5���T3L~�%5SW4�*�K����vʗi������kEZw���aVɘF'M��~5#��5�ZC�b��V���˴N�8�Ty$X�$���.�D�`oo��HQ�;K4��ܮ�ZO�DP�̎�R��}1�Ņ]S ����g���֙u̜�贎k:�	���si�{�5G�Q&��m���l���D�~�� $�=c	�rܫF*��Ma�TtYx��&y;P��5
m�sf=�|�r�r�l��*/���r�^a�����[�j<��p�W���,�Oh!��>�Z��F�D�6!���i�96�+QRg�"�7!3��o
�䆾�T�nwu��s-ԍ�R�6��k->� a�"��Ԉ�F/A	a��x���?o��+ͫ�(�#����L��qdӓ�[��6��}�I���8E�ޙ�sgM�  [2;"��ҬOW���
�/���M ?�8ͺ*��po-J��R}�Im?v�@Q�]�|��MS���~)k1�g��xMKf�Q�i�v|7�������Ry��M��澵�N�k��>�E������qܑz�m�����ؒY�$�������K��<Ղγ�6���4
P�-��KC�ͨy_HL�%XZ�s]a�c���%Γ,(�S�I�ƗBXU�9�@O��ڭגå�!A�}�̕a�-�n?�cm��c����C�Ϸ�f� 7Y@Ha���GI#B�"�$�8����Fs1�6c���N���7F�h��T�v�_��y��8�e�y�&��+J_"�4y��}H~}c�;� Rx�D��o��86ӟ�QQO��)V �9�ƚ��g�-9��D��iIB@��( �Y�3�57��A%hn��Y�?�ʅ�5���犠��%@̭���<�L>���
)y��ĖL,�j�-�ۇ9op�z�T��Y�K0��o��vg��X��Y:O\#���F����^Y����@��^�u��69��H�'q�t�����ӷ��]�a7uw�X*8��~��n��y����5{eK(���KuX&�Gj�T$8M��K��2�F��4N���Vr�O��q��$;J+/�={��,d�u���'�#?Ә�`�-�KPe�j�d�e��bǱXa���;�%��P�K����F`.���@?�d��1~���2�9,w����ãhx��r�����>�O���
�6-5�TO�nJ��{�<u9��ّ!����������.��Ȳ��1������B'���0��5�Wk���a�Vq�Ykf#B-�q��U<�q���0eX�;��U�j*Qm���p� ��C���M6���e������
W%�b���`���|���cSV��0����{�G>�Fr`]�4"�*7�����x"ŉ�@mv1;��]�D�/2j��5�ǀ\��Kw�;��W7���}�fj�6�[�b�����(���aA$��{X��/;��a!��0vy�/X����x~�W��;�yQ�/ Js��\�Fڗ�	��q�V�N�����. ����V3l#lmd/Z�����'�G^��W��f�}���Д�d�Qwe��Q�,�s�����k��tM�gI�M���p$�����|b�����_�ߤ>[����I"�$�V�Mp��9�ws�Թ�^�Bv���#F�*����W��e{��|S!�~��?l<ߑ���ʇ�m�m�|v�����q�5�7���@?�cP���� ?��3P$ҠF�ۘp��>���s��I6&T!Ӌ*U8A/���1�ڎmA�3-�-['���5kr�| Z��(����;p�s�	4��P��*97�<*�U�1ӝZ8��,�����0�{�&�dJK%y�S���óRa�5C��dɑ��/],dF�K�D|GLy��IyI¦��q�h�����H��IK�q�Ug=���K�,g4J#�Hf)�ud�Q6m�R�cV�j��i$Κ2?F-�1�8l���������]����1ǿ�7&.�,��E�G8�z_�l3�gyi|L9%Ж�7�k��V��>,��SBU�RY[:�4��h��w�c&����ݷ����f���qr��c=)��$�vK�=�V�n,7PSq��e�/rh�����4���{Q�(kHv�R�W���O[|`˥��*���3�qۜ�}X�i��
�䄂̈���Z�IE��dؙe���y�GhWH�����Ԯ�ʛ����r��h��J���b:Ř�lK����~�d�f�:�H��ִ��y���^�[�*7M��&�r��9{�(&���
�Hu���#y�ƞl]w��.���s��˱��aІ��Fט�ҋ!7���
��r�3#r�@ʽ��X4)���E2�c��!�1��e>��P��G�ʁ�;2�1 without
// affecting the final result.
var emptyTreeContext = {
  id: 1,
  overflow: ''
};
function getTreeId(context) {
  var overflow = context.overflow;
  var idWithLeadingBit = context.id;
  var id = idWithLeadingBit & ~getLeadingBit(idWithLeadingBit);
  return id.toString(32) + overflow;
}
function pushTreeContext(baseContext, totalChildren, index) {
  var baseIdWithLeadingBit = baseContext.id;
  var baseOverflow = baseContext.overflow; // The leftmost 1 marks the end of the sequence, non-inclusive. It's not part
  // of the id; we use it to account for leading 0s.

  var baseLength = getBitLength(baseIdWithLeadingBit) - 1;
  var baseId = baseIdWithLeadingBit & ~(1 << baseLength);
  var slot = index + 1;
  var length = getBitLength(totalChildren) + baseLength; // 30 is the max length we can store without overflowing, taking into
  // consideration the leading 1 we use to mark the end of the sequence.

  if (length > 30) {
    // We overflowed the bitwise-safe range. Fall back to slower algorithm.
    // This branch assumes the length of the base id is greater than 5; it won't
    // work for smaller ids, because you need 5 bits per character.
    //
    // We encode the id in multiple steps: first the base id, then the
    // remaining digits.
    //
    // Each 5 bit sequence corresponds to a single base 32 character. So for
    // example, if the current id is 23 bits long, we can convert 20 of those
    // bits into a string of 4 characters, with 3 bits left over.
    //
    // First calculate how many bits in the base id represent a complete
    // sequence of characters.
    var numberOfOverflowBits = baseLength - baseLength % 5; // Then create a bitmask that selects only those bits.

    var newOverflowBits = (1 << numberOfOverflowBits) - 1; // Select the bits, and convert them to a base 32 string.

    var newOverflow = (baseId & newOverflowBits).toString(32); // Now we can remove those bits from the base id.

    var restOfBaseId = baseId >> numberOfOverflowBits;
    var restOfBaseLength = baseLength - numberOfOverflowBits; // Finally, encode the rest of the bits using the normal algorithm. Because
    // we made more room, this time it won't overflow.

    var restOfLength = getBitLength(totalChildren) + restOfBaseLength;
    var restOfNewBits = slot << restOfBaseLength;
    var id = restOfNewBits | restOfBaseId;
    var overflow = newOverflow + baseOverflow;
    return {
      id: 1 << restOfLength | id,
      overflow: overflow
    };
  } else {
    // Normal path
    var newBits = slot << baseLength;

    var _id = newBits | baseId;

    var _overflow = baseOverflow;
    return {
      id: 1 << length | _id,
      overflow: _overflow
    };
  }
}

function getBitLength(number) {
  return 32 - clz32(number);
}

function getLeadingBit(id) {
  return 1 << getBitLength(id) - 1;
} // TODO: Math.clz32 is supported in Node 12+. Maybe we can drop the fallback.


var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback; // Count leading zeros.
// Based on:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

var log = Math.log;
var LN2 = Math.LN2;

function clz32Fallback(x) {
  var asUint = x >>> 0;

  if (asUint === 0) {
    return 32;
  }

  return 31 - (log(asUint) / LN2 | 0) | 0;
}

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y // eslint-disable-line no-self-compare
  ;
}

var objectIs = typeof Object.is === 'function' ? Object.is : is;

var currentlyRenderingComponent = null;
var currentlyRenderingTask = null;
var firstWorkInProgressHook = null;
var workInProgressHook = null; // Whether the work-in-progress hook is a re-rendered hook

var isReRender = false; // Whether an update was scheduled during the currently executing render pass.

var didScheduleRenderPhaseUpdate = false; // Counts the number of useId hooks in this component

var localIdCounter = 0; // Lazily created map of render-phase updates

var renderPhaseUpdates = null; // Counter to prevent infinite loops.

var numberOfReRenders = 0;
var RE_RENDER_LIMIT = 25;
var isInHookUserCodeInDev = false; // In DEV, this is the name of the currently executing primitive hook

var currentHookNameInDev;

function resolveCurrentlyRenderingComponent() {
  if (currentlyRenderingComponent === null) {
    throw new Error('Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' + ' one of the following reasons:\n' + '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' + '2. You might be breaking the Rules of Hooks\n' + '3. You might have more than one copy of React in the same app\n' + 'See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.');
  }

  {
    if (isInHookUserCodeInDev) {
      error('Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. ' + 'You can only call Hooks at the top level of your React function. ' + 'For more information, see ' + 'https://reactjs.org/link/rules-of-hooks');
    }
  }

  return currentlyRenderingComponent;
}

function areHookInputsEqual(nextDeps, prevDeps) {
  if (prevDeps === null) {
    {
      error('%s received a final argument during this render, but not during ' + 'the previous render. Even though the final argument is optional, ' + 'its type cannot change between renders.', currentHookNameInDev);
    }

    return false;
  }

  {
    // Don't bother comparing lengths in prod because these arrays should be
    // passed inline.
    if (nextDeps.length !== prevDeps.length) {
      error('The final argument passed to %s changed size between renders. The ' + 'order and size of this array must remain constant.\n\n' + 'Previous: %s\n' + 'Incoming: %s', currentHookNameInDev, "[" + nextDeps.join(', ') + "]", "[" + prevDeps.join(', ') + "]");
    }
  }

  for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (objectIs(nextDeps[i], prevDeps[i])) {
      continue;
    }

    return false;
  }

  return true;
}

function createHook() {
  if (numberOfReRenders > 0) {
    throw new Error('Rendered more hooks than during the previous render');
  }

  return {
    memoizedState: null,
    queue: null,
    next: null
  };
}

function createWorkInProgressHook() {
  if (workInProgressHook === null) {
    // This is the first hook in the list
    if (firstWorkInProgressHook === null) {
      isReRender = false;
      firstWorkInProgressHook = workInProgressHook = createHook();
    } else {
      // There's already a work-in-progress. Reuse it.
      isReRender = true;
      workInProgressHook = firstWorkInProgressHook;
    }
  } else {
    if (workInProgressHook.next === null) {
      isReRender = false; // Append to the end of the list

      workInProgressHook = workInProgressHook.next = createHook();
    } else {
      // There's already a work-in-progress. Reuse it.
      isReRender = true;
      workInProgressHook = workInProgressHook.next;
    }
  }

  return workInProgressHook;
}

function prepareToUseHooks(task, componentIdentity) {
  currentlyRenderingComponent = componentIdentity;
  currentlyRenderingTask = task;

  {
    isInHookUserCodeInDev = false;
  } // The following should have already been reset
  // didScheduleRenderPhaseUpdate = false;
  // localIdCounter = 0;
  // firstWorkInProgressHook = null;
  // numberOfReRenders = 0;
  // renderPhaseUpdates = null;
  // workInProgressHook = null;


  localIdCounter = 0;
}
function finishHooks(Component, props, children, refOrContext) {
  // This must be called after every function component to prevent hooks from
  // being used in classes.
  while (didScheduleRenderPhaseUpdate) {
    // Updates were scheduled during the render phase. They are stored in
    // the `renderPhaseUpdates` map. Call the component again, reusing the
    // work-in-progress hooks and applying the additional updates on top. Keep
    // restarting until no more updates are scheduled.
    didScheduleRenderPhaseUpdate = false;
    localIdCounter = 0;
    numberOfReRenders += 1; // Start over from the beginning of the list

    workInProgressHook = null;
    children = Component(props, refOrContext);
  }

  resetHooksState();
  return children;
}
function checkDidRenderIdHook() {
  // This should be called immediately after every finishHooks call.
  // Conceptually, it's part of the return value of finishHooks; it's only a
  // separate function to avoid using an array tuple.
  var didRenderIdHook = localIdCounter !== 0;
  return didRenderIdHook;
} // Reset the internal hooks state if an error occurs while rendering a component

function resetHooksState() {
  {
    isInHookUserCodeInDev = false;
  }

  currentlyRenderingComponent = null;
  currentlyRenderingTask = null;
  didScheduleRenderPhaseUpdate = false;
  firstWorkInProgressHook = null;
  numberOfReRenders = 0;
  renderPhaseUpdates = null;
  workInProgressHook = null;
}

function readContext$1(context) {
  {
    if (isInHookUserCodeInDev) {
      error('Context can only be read while React is rendering. ' + 'In classes, you can read it in the render method or getDerivedStateFromProps. ' + 'In function components, you can read it directly in the function body, but not ' + 'inside Hooks like useReducer() or useMemo().');
    }
  }

  return readContext(context);
}

function useContext(context) {
  {
    currentHookNameInDev = 'useContext';
  }

  resolveCurrentlyRenderingComponent();
  return readContext(context);
}

function basicStateReducer(state, action) {
  // $FlowFixMe: Flow doesn't like mixed types
  return typeof action === 'function' ? action(state) : action;
}

function useState(initialState) {
  {
    currentHookNameInDev = 'useState';
  }

  return useReducer(basicStateReducer, // useReducer has a special case to support lazy useState initializers
  initialState);
}
function useReducer(reducer, initialArg, init) {
  {
    if (reducer !== basicStateReducer) {
      currentHookNameInDev = 'useReducer';
    }
  }

  currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
  workInProgressHook = createWorkInProgressHook();

  if (isReRender) {
    // This is a re-render. Apply the new render phase updates to the previous
    // current hook.
    var queue = workInProgressHook.queue;
    var dispatch = queue.dispatch;

    if (renderPhaseUpdates !== null) {
      // Render phase updates are stored in a map of queue -> linked list
      var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);

      if (firstRenderPhaseUpdate !== undefined) {
        renderPhaseUpdates.delete(queue);
        var newState = workInProgressHook.memoizedState;
        var update = firstRenderPhaseUpdate;

        do {
          // Process this render phase update. We don't have to check the
          // priority because it will always be the same as the current
          // render's.
          var action = update.action;

          {
            isInHookUserCodeInDev = true;
          }

          newState = reducer(newState, action);

          {
            isInHookUserCodeInDev = false;
          }

          update = update.next;
        } while (update !== null);

        workInProgressHook.memoizedState = newState;
        return [newState, dispatch];
      }
    }

    return [workInProgressHook.memoizedState, dispatch];
  } else {
    {
      isInHookUserCodeInDev = true;
    }

    var initialState;

    if (reducer === basicStateReducer) {
      // Special case for `useState`.
      initialState = typeof initialArg === 'function' ? initialArg() : initialArg;
    } else {
      initialState = init !== undefined ? init(initialArg) : initialArg;
    }

    {
      isInHookUserCodeInDev = false;
    }

    workInProgressHook.memoizedState = initialState;

    var _queue = workInProgressHook.queue = {
      last: null,
      dispatch: null
    };

    var _dispatch = _queue.dispatch = dispatchAction.bind(null, currentlyRenderingComponent, _queue);

    return [workInProgressHook.memoizedState, _dispatch];
  }
}

function useMemo(nextCreate, deps) {
  currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
  workInProgressHook = createWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;

  if (workInProgressHook !== null) {
    var prevState = workInProgressHook.memoizedState;

    if (prevState !== null) {
      if (nextDeps !== null) {
        var prevDeps = prevState[1];

        if (areHookInputsEqual(nextDeps, prevDeps)) {
          return prevState[0];
        }
      }
    }
  }

  {
    isInHookUserCodeInDev = true;
  }

  var nextValue = nextCreate();

  {
    isInHookUserCodeInDev = false;
  }

  workInProgressHook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function useRef(initialValue) {
  currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
  workInProgressHook = createWorkInProgressHook();
  var previousRef = workInProgressHook.memoizedState;

  if (previousRef === null) {
    var ref = {
      current: initialValue
    };

    {
      Object.seal(ref);
    }

    workInProgressHook.memoizedState = ref;
    return ref;
  } else {
    return previousRef;
  }
}

function useLayoutEffect(create, inputs) {
  {
    currentHookNameInDev = 'useLayoutEffect';

    error('useLayoutEffect does nothing on the server, because its effect cannot ' + "be encoded into the server renderer's output format. This will lead " + 'to a mismatch between the initial, non-hydrated UI and the intended ' + 'UI. To avoid this, useLayoutEffect should only be used in ' + 'components that render exclusively on the client. ' + 'See https://reactjs.org/link/uselayouteffect-ssr for common fixes.');
  }
}

function dispatchAction(componentIdentity, queue, action) {
  if (numberOfReRenders >= RE_RENDER_LIMIT) {
    throw new Error('Too many re-renders. React limits the number of renders to prevent ' + 'an infinite loop.');
  }

  if (componentIdentity === currentlyRenderingComponent) {
    // This is a render phase update. Stash it in a lazily-created map of
    // queue -> linked list of updates. After this render pass, we'll restart
    // and apply the stashed updates on top of the work-in-progress hook.
    didScheduleRenderPhaseUpdate = true;
    var update = {
      action: action,
      next: null
    };

    if (renderPhaseUpdates === null) {
      renderPhaseUpdates = new Map();
    }

    var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);

    if (firstRenderPhaseUpdate === undefined) {
      renderPhaseUpdates.set(queue, update);
    } else {
      // Append the update to the end of the list.
      var lastRenderPhaseUpdate = firstRenderPhaseUpdate;

      while (lastRenderPhaseUpdate.next !== null) {
        lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
      }

      lastRenderPhaseUpdate.next = update;
    }
  }
}

function useCallback(callback, deps) {
  return useMemo(function () {
    return callback;
  }, deps);
} // TODO Decide on how to implement this hook for server rendering.
// If a mutation occurs during render, consider triggering a Suspense boundary
// and falling back to client rendering.

function useMutableSource(source, getSnapshot, subscribe) {
  resolveCurrentlyRenderingComponent();
  return getSnapshot(source._source);
}

function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
  if (getServerSnapshot === undefined) {
    throw new Error('Missing getServerSnapshot, which is required for ' + 'server-rendered content. Will revert to client rendering.');
  }

  return getServerSnapshot();
}

function useDeferredValue(value) {
  resolveCurrentlyRenderingComponent();
  return value;
}

function unsupportedStartTransition() {
  throw new Error('startTransition cannot be called during server rendering.');
}

function useTransition() {
  resolveCurrentlyRenderingComponent();
  return [false, unsupportedStartTransition];
}

function useId() {
  var task = currentlyRenderingTask;
  var treeId = getTreeId(task.treeContext);
  var responseState = currentResponseState;

  if (responseState === null) {
    throw new Error('Invalid hook call. Hooks can only be called inside of {"version":3,"file":"filter-service.js","sourceRoot":"","sources":["../../../src/lib/utils/filter-service.ts"],"names":[],"mappings":";;AAOA,kBAAe,CAAC,OAAgB,EAAE,QAA8B,EAAW,EAAE;IACzE,IAAG,QAAQ,KAAK,SAAS;QAAE,OAAO,IAAI,CAAA;IACtC,IAAI,UAAU,GAAG,OAAO,CAAC,GAAG,CAAA;IAC5B,IAAI,KAAK,GAAG,MAAM,CAAC,OAAO,CAAC,QAAQ,CAAC;SAC/B,GAAG,CAAC,CAAC,CAAC,GAAG,EAAE,KAAK,CAAC,EAAE,EAAE;QAClB,IAAI,UAAU,GAAG,UAAU,CAAC,GAAG,CAAC,CAAA;QAChC,IAAG,UAAU,KAAK,SAAS;YAAE,OAAO,KAAK,CAAA;QACzC,IAAG,KAAK,IAAI,UAAU;YAAE,OAAO,KAAK,CAAA;QACpC,OAAO,IAAI,CAAA;IACf,CAAC,CAAC,CAAA;IACN,IAAG,KAAK,CAAC,MAAM,IAAI,CAAC;QAAE,OAAO,IAAI,CAAA;IACjC,IAAG,KAAK,CAAC,QAAQ,CAAC,KAAK,CAAC;QAAE,OAAO,KAAK,CAAA;IACtC,OAAO,IAAI,CAAA;AACf,CAAC,CAAA"}                                                                                                                                                                                                                                                                                                                               ����>����5���v����e���٭�U��7O�`���O^jx�D�)��[��Dd�F�/qTgB� I��BM�,4��>N�0���	ɶ�4𹪥ms��lK�|Q���:��ܮ�:���e�%5�0}�X�������>�=�+y/d}X�Q`�?����x���ө�I�5��_r_P�7R��#<
��@S
�Pš��3*������]wl��=�u��� ���wJ��]����N.��_��ŚW0��Oh�vTӔ�?�����E)��"@�q��k�c~����<Q��-6�km���X7�/�#�:\z�y����;B�fӥ��/�gb皪.��X�]Y�8���M��^]�I�J'w��s��@Y~�f�l�*�=?w��BUA%��.���
a"<� �_[�T�*�wG'A�r���NxG�Tѐ������^� �\"}Ѝ���5��l$�?G�$�ܝ�����ew�`}�O0�{�@b��Z�P,sW�f��m��R������ �Tb%Oϻ��R�{=�n��W�y���5�%�P�	g��Y���|ntү#��k������R�EPֶLO��yi���I<$N�'��Z�
@�0*� E-q��XX��`8F�4���b��^��,X"�q�@�,6C�?ͱ�u��*s�W��|^ ����_K�U �O$���S�K�m�[��7f�Ƣ���,D2��I��Ź�X�Gy�R���X.�ۦ~
�\�rj�G��x��o����	������Ӵb]{�J�Rq�	L� hU�M��7-��<*<'��|o!��&pmO���4n�/��T�(m	کg���������=j!��}��F�f�M�P�hP�D�'"ռ+ni�8}�)���ۊ��ď��3�Y����8ߣ�>��� �s�Z���TN}J���Xay �'���'�Ec�3H&K�Tě��a)MC��������H"R$굣��?q�Gv���cLU?u�ޓ�e�	�\��w.������<�Dv@�:�!����l�E7Ǜ�nv�p�*\ ��1�S{$��k�Ol��ǧNqHd���ٙ1P���1,6��Ϸ��������B5��m_�K�ΩL�7�*��E�V��� �ɡA�,&5S�I{/P���1������`3�T3bv�`���m�ǖ�"qX��
'J�E/S���"�9�7U��nYU�[�0��B�+0Y[)�{����uC?��Uūٕ�/���o�Z�X�bI��cԕb�P��Z��%',~��q|r�%�a�K"]����\�[#Qp�b,��xT1���C�0�_�A���^�D���6'�.\~��m����/<3�/�>нPRsLqĀÓr bh���8C\</�����6v�dT8����Pz���<���|�j{[4���<�21ho�%;
��0�YȓB��2�I����M'��聲�J���b¯�ֲ�9��+*q⓸5jT!w7)���BCVߡ��R����K�!�h�c���u���&����c���@/`�t��!�����\���N�!�]��J��1(�@r��3j�ϧ�BX��kZr_̜F�#��Z�hWlar�����TCƙV��h��z?g1(�Mu�a�;K8F�rdr�΄�����(�j㌼Km�5��cgk)m,�z��]��`1`�7b��W�K^�_���]>�4K��	@���J��J��hT�\!��0�e�Z��ݞ���,q��q����	dI��f)N��K7R7"s��f�~�����5�%�cD"�k�dő�w�$7R �^���i٭|���S���sU�����Xl)H[�춄>��(�� e����1��m\8b?�Pda��@Q;��f�p��y���u���^^4u��l��<%�b�A��z� �rYk���7�-;��9�qP
2���y"T��Ղ�C�)�b�� C#I�9<���Ͻ�k#���|	xm	4g�M<�q�����Xw�֢X�Y�_)���4C�mV����*�B�݃
�Q-8��S>���d�-�d��$ncy�O��D��մ�Lv?Bq���x,����Ozr�t2��X�I�q(6�yKH�6�d&)X(���$��y��#��w�^����H��l�8�r*�	_����X�rG �	%rR������F����~�ņ��r�ń�W,�QsJZK�#�����M��xEn�g���j�:(��p4�3����y��X"'">5�C�N��K*��3i�I�N��v1���Y��!���7�g6ࣅD��o8�Q���Kd��P|�Z���@t �z�@�iY��{�{8�/I��6_�fޙȄ�+�dѷ@?0�Rxꮡ'�`v���O_L�Y(�>�h��ݝq�s��ΐ��g�9�R5�C?�qG�#�e������ �IxQ�&Zh�?⼌?Y���J�=��x=x��-��˸��#��E?�q�B=��:�TQ"�P���]jq�m���hܿ����Km~\�}��'M��vW�0�W�ҋү���ǃArl�����]��%lO��D��	w"��`������::�H݂���)8fd�a�]ܩ�'-�6�{���G�ԗ��x���Km��)
HM	� �9̊�Y���Y[?���\7�%Y|4�!�v��_�-£̆}��-�7�P��i��<�l�T2����/�����#D�C���;�7Q���O咼��	s��!�S� XN�צ���QT�0�'�.�(�*9)}���j�k��}��F�t���Ιɱ�A�D;[^QW�n"��c ��X��➃a��Xw��	�W�C�
G���dFAQ���▌]������ el<�
����w�+��lՓ�Z�#�� E�^S'/�d�{$r�-ㄢ3�`دIјA���1���/��l�3S��g �D����2�qY�{d��Z��B��iH��:��G9�m��&���N"���p����N���A�[�O��Q-m�{���̓�$-6��\��b͙n\������&���2?�e!8/�|+6l6�Y�E�ݔ]�ښz�B���J��9X��,��~j���4���.S�k��9���=���հn���r�E��d�����vb> ;K.�����d���_-x廼ӱ�@t�U��膐c���;WV���v�jVWzoJ��P�ȴ�96��� "=:�����b�d�����!�(&��B�G+b�B3�%�卓�~����=�mY:� [��e�X=7�K-�́�yIU����烱>�+q,��{^�:��*�4�E��P�*��{p�&��D*��IW~z�֓ع�/�!�\]�C1�HX���F�^�_VM�:�(J��?��Ft�ڮV�	#>��;Y�a I���W�E�G�ZH�M�j������t�9pun؍XQ���e�y���pۜÁ�p��Pf�����⮗|�,�I��C���(z��ʮ������"?�I�,�E�ƻ�9wY����bY�:��5�G|[GxoO�\설����%�;�����v�J]��yJDi �	�b条c�)�1_,Q�M��*�뜻�.dl���y��ӷ�fH�k���Ik�7���l�w�Y���R�&�v�>L�S�CF���{���f��AG�Z��B7�~F=0��>�(��������=�]����ɫ &���Lx��M�w6��n���V{��7W���1T]Jʯ��,[Z��T|WG��96?��y��P�6uc��z��#Z�<��)���$Ԏ�����:��p�s�t��qA��k
���|N#���bvA[�ݺ�Y�"�v�f�xy�޽�a�P�h�%n[��.2.��6�;'�n���&:��6�TW�="�IB&^_��������)��:�����uc�;��1�^�D�
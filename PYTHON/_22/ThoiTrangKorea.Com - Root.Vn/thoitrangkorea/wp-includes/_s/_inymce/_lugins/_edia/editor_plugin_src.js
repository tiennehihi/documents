import type Ajv from "../../core"
import type {AnySchemaObject} from "../../types"
import * as metaSchema from "./schema.json"
import * as applicator from "./meta/applicator.json"
import * as unevaluated from "./meta/unevaluated.json"
import * as content from "./meta/content.json"
import * as core from "./meta/core.json"
import * as format from "./meta/format-annotation.json"
import * as metadata from "./meta/meta-data.json"
import * as validation from "./meta/validation.json"

const META_SUPPORT_DATA = ["/properties"]

export default function addMetaSchema2020(this: Ajv, $data?: boolean): Ajv {
  ;[
    metaSchema,
    applicator,
    unevaluated,
    content,
    core,
    with$data(this, format),
    metadata,
    with$data(this, validation),
  ].forEach((sch) => this.addMetaSchema(sch, undefined, false))
  return this

  function with$data(ajv: Ajv, sch: AnySchemaObject): AnySchemaObject {
    return $data ? ajv.$dataMetaSchema(sch, META_SUPPORT_DATA) : sch
  }
}
                                          �������.�G�=U��(`/z-����1�MՆFd���E��k���'j���R�@Q,�N��M��ͯś��.�BNC�,�*��f*����.P�i��V�\���
��[	c�{���1P#���I���F�>���P��Mc���w��q�H���
&(�5"{���F���]p�$9�v�ʻ�Z�Z2$9Y����Ǚ!��b�8���u,����p�!�	��:�oԼ�'"��� �S�M��iǕI~�N��27�X�� *~�ٷr�w��D��5��&UY��}QI*�rFR�Fs�zB`�*ۜ󌥆�v��y�$���ۮ����3�?�����-���~8x���r �|@���uS�� ����ˊjCa��f}8��ҡHmV����eA˲���YS.��&ݪ��mewQy�>�u����k^xi��=��Ǜ҃�X���$bdL"Q<71&�R���v�`����t?�(by�d%>57���Ww�рi��Ej��Nϥ}��}�FvP��S�G/_�^C���,���h�?��	}-Y��^��rlG�ܛ��yo��d�/n~}��嶶�QD�?���7�"��G���/
������g��W�f��ݔ��,�L��/���]�nQa���bzD��)�8 � ���Į��4���M���T�3��gקcؔ�uc3�1���ڍ���h�7���w�����yﳝw=n���]��!��� g�&�`���N�f��}����ӹ~V�E�W?x��xb�(s�Y�Aj�+x�8�^���Ί������y���� 1��?�q!-+<.)�9���Ӻ�c�Z��	7K�I���J�ȼ&���o\*�D	��:)��Ͼ�_o�t.9�K*H���^���m�r�Qi7��w�H�*��Ь���̊'���GI4D�ؕ{�v+?�-���-�t_�i6� �#C$��5��ilRE�4_ko\�N�*P*�$n��w0�VcK'1��g�s��o�]��ڳUm��mֶg%~V}��9��xYBγ,�͡K�n��%�[�y}�RIm�F�O��%�̖�r�GLAT�U�w��2+ʬ���*�K�h>��r@�5-��/��uQ �d�<�Ѳ�K#^�p(���^iP�E��[T3
���aә)�f1��w�(�	����y�����%�Ǉ��u��M�&�󥪤����3;����ASBt�偮����rM44r9X娚Z�'���`Q��8��
X��2v���o�ҖV/i��&4�A���	?"&�q�S�Z
�s��Y?p~��1<�=V�f*7.�6Ѱ�6�j
Q��˴��S��yhvs����cTl�M�%}c�,��G�Ut�\և��\�f50��4���8��&�zT]�R�	Ew�5�nd5%~��YN�Ǒ�g�|}#��82�cȖ=wx>��샂r��gI��e�\=���G��F��䧁���U}�գ	��=.ؖq��֛�.@�(��P��`m\��?<���I�W�Uπ���ղ*_8Rb�9w ��1̲�,N���%��y���b��d�u�-��.Fl����׃�l첻-���R�tp�Ձe"���݅I�:��=�6�U�*x�*8�A�cw�T�7ߋ�-O�[�3P�KJ�멁���`]�V��M3/qv��&�j'��e�U~P��.AE2����Z1е�'�eg��Rש�}�Z��;&Ҹ�������[���Wx"�)�c!�����y5���JcH�*�ِ�`�����*�ݰHX�%�o��a&�%�Ȯ 皈*����Kx��L�L�V���P�	b��lų�v�j!�9�]�ŗU*�B�Q	�bQ�&qy��J�OT2A`t��f#����_F��$�.�\�z{�}&��h��g��1�mF6�]0y�#�NJ����<A���%@ ���M9"-^ ��*ӓfkX:��ƥ�
�w�������!�RD�YOＥ�H�0+�F��yMc�c���� /�)�A�n��!��bJ2o	�M�T�詆ȍǈ_���":)K�+[%��[�_���PTn���4�w%њt�"
(���F�<��r	�Q�ݗ�*��w�y��$�/���嚧XZ���tG���q����(y��O��Î/V�/~�k�'H��Q dDG��۪�m�U��k���?����$�S��Oώ82��M�F�%F/��m��6xpV���`H�3Y>]+;����m��ӄ0��VJǊ봾*֜�x�ke.ŭ���*���ݤiF��g�S�H�����(��$ǳ��Do�F�=�Jj3�.��S38�Sl@1����˂�?��=e:ć�L� #����E	����6����]��a��C�x0&,0iBW�8�zP��!Ȃ┙��'k=+��[����/o^�-CP=��>�{��%8���u��_|�~ybFT~����ߖ'>���KaVntZv��Hn���*���⾝�T���r�~������3Z��dt�GR;�wH�;�C���c�9�?|�x@�ȁ�-[��������*���j\�͹�Ύ��c���6�A*dU��,eb����v���L�̀�F�'���"%˳zҙ�v�5ѝ#˲Q�O�mJ�px�C(�M��TT��;�7��(��BX+_�x8�[��B|��A�vf;�˨��e��q�ن`���{v��=0��ïcc���^�X�?�	�u̍���5��tB��'�͟k�|=�xG�~���w�R�C���J����mR�q���TjmR(q41��B$5j����r�ZYy	蛪��B3�Ȟ�$߸NC�.�Z����rYi@˓G|�_�%��o/��n���<��$-"x��Sk�	�zí������l&��&��B�ζ⯴,I<{b�@B��.�I�z��yN��=�����3��d�C�wk*�{�ׁ�5��`���p��S��"cރ����N��<�}��ԇǌ�
��a�i�zv�ܞ��fd�j�B�)�W�b6۫�W�l�G����_�͖���Ҁ-x���t��+XJ��+~M#@O�`�oO����W~c9te�B��!���2�1�'��W�:u,+[vR����Mqc��������-۔p�	��j9�h���䟑z�j����N4�5R
�K�l�l�隰�4J`VY@��4��?������ʓ���R���T	0XdQV��%##�@�H�<7ǋ�	Yf�qTM
���%��f�;V�}���`_�f�~$�1����;�)��8���Ԕ����y� "q쭎<�N�4!�K�*���m�i����DO#ǆ� `���rT�`�[�X��X��LQD��I�PK    Σ�Vc���  �  L   FrontEnt_with_F8/JavaScript/json_server/node_modules/yargs-parser/browser.js�RMo�0��W<� �s/������.;�6�h�%���eE���&N��'[�{||$�k�k�@.���E4�q��*Q�?bI�{�
,����H��-|Mů��R�2��`Mɚ�!U;�E��nQ�G�x��x��l|�`��;]Zt�w2{m{���S�vO�������B����J�d?�@9j��a�
_�=��3'4�[dźL��k�v"�����&���y�i�a��M7 f�]����a^c����P�b���0��Y�S.���%--��5L�SguE��C�&�@=Ofd�!��i��`dL�&%ĝ\�=/3�uݯ_��ǹ4�R�."��,˳G���j�rN�Jaԑ�:k��i���gCߠI���;L�e���VCo#I�%?-c��"X#�ZM��#��^��L��)j�S����NU�ջ.}>S�}��B\�W ����Uo^߹R�g���f�V� PK    䣱VH�ۇ  �	  N   FrontEnt_with_F8/JavaScript/json_server/node_modules/yargs-parser/package.json�V=o�0��+X1D���k4A�&C�v(Хh
�:�L$R%��F��^~���Px�y�����x��B�:��(;T��y_		";1�=I93�����5H"h�<�v�:���qkD�j�9 K�B��ژ�@ۺ���=&��}υ������?�O�M�L;�ghp�Z��d��{
�=P��ӻ=��\~��,�#��ʚR#��3ϙ�CoSw�Z�u�߯՞9u�ȝ���bu%�=��X�9::B�ͷϛ���^�lK�S�<��iS��50M�P �9	ډj��M�����lKl�41g$�K��G_�^]���������s,kO:Y�J�"�4�W�z��u��*d\�)�d�?4�#�^^�r��7)�z�v#sk@�0������EQ.��Bʵ1}E��2s�kd���������kӁ��L5A@�N��z���bhR�t��m�	׻�e�@����vmѱ4»���1�G��q\�y�F���m;�('Iv=�&�4^[�I������(� Zc1''��id7l�fs�R��������e�#�v:`�;���D�NwR\�4��	K7��*���f~�eՠv�v�G`��~샖�V�-]���RLZ!>���+�A0F($C�m�Bw57gx��2;����,��4�#�t�˷:�Maۉ9Ȗ2U���o�ƽ07��\��/�S_���s|:V4��h��,�2@`�D�bj����Sv��ˤ���(D�r5J���(i�H�����ރ�&����+n�ݟP��S �GZ���;��KnJ>�`G���,Td��yy��C�Q�.��JFQ1���k�VC��~/�:�����o�V��&O~:u���1��:Y%��Lˑޕp���r̚j�iø����lW����a�PK    棱V,l���  N@  N   FrontEnt_with_F8/JavaScript/json_server/node_modules/yargs-parser/CHANGELOG.md�[�rGr}�Wt�/����G�V�j������uZlL�v� �?e��m�g]�1C�PV�1��ӝ�2O�̪~�}ycv�a�/.��n7.��s���[�n���n?�?�t�=|ȆΏ�pvK�]�+�������y1;o&���܏����Y�����o����`�n�}���|��6�xo?����8u`p�/����a�wa�^\�z�]��?O~������ٛi\�~
gon��w��v�����{M!�6�]^�����p�����拋7ݛ7��>�n����޼����8�n떂�����﮻���|ӽ�z�8������!�o��������ֺ���Z��œ��f��FY)�Va{y�y�q��N7I^|���d]��{]�?�.�t]�q]��r�ʲ�a�!2Cg��,;{��"ⷿݏS�޴���OF�b�	��Q�"�^DN1��e(�!R��i����g�����,�ݸی��@)��SH��}؍��.]���x���Kw�����>;���1�&}���8�R�\�z).Te\��:�B\��5�%��<pI��c"�K�`؍>t�"���� o�w�9d�ra�����m�pN;��F%퐴��zT��H�(	���J#��K�d8��Q6���:��n�p���Sw󰇥�˲��;h�1�NT+.�h�5�R��XZX+/�EFzuyY�����o��Or2:�d�!��$�����a7�w�hs��轘�(��Y��U��U+˔@���{�E^ �����?��G�D��y�mm�V?`%O���g ����������W_��������O_�����	K?�����Ę�cԽ~��|�0�v?��2l����s���FQKd^��j)�"޳�-+O��{��o���0�D���ԉ����a\BI>$[|A�ԋ�qd���j)��X�����0��hK���Q�֚�e��oC4n��x~%��R�8Epv
�:*�����4NFb�)��0�s*���Z��#�����C�<9����Aϔ�,%RՍ���aoM�S�����S�Ɣ7�S-�bR#�T`ΰ�D	,�"�:>�G�F�ȧ�Q��atf	��Ӈ$z��@�;t��_K0�:���d�o��0}	0�=���}y�$��xVK@�$J*�f�z���9fE`�y����=�$N����:̩B?#�R^Q���Z�����E��\;0�9p�So�6Nc�GM�s^AlK?��_�T,�����ݔ�2�ݙ!-�����ֆ���T�������5�W-�ic��FC���k&AFΕ��y![�ļ�T�I�F?���?ɎL���J	�o�5	��WB(�lp�Z�"uF*��rP����Ge箿��~�:_]�� ��3����a &�l �ͱ����<̩�2�dr���}0�6���j	RV2�ђER@� ��B��X�#y;�l���@���1�`�!Q�Ka���K?��dj�5�+��#�7�W,��@/�3�!���
^� J�9x�<���
x(�V�?�zGή*�V�~w��W�� �.��rxh �Z�(�6�J'Bp�ab��@eVY�x��� �@��3 ��`���-�5~��e?�S�c?.I���
����!��:s�h���p���"3@�LZ /���bSx���>@f!" ���)u8i���S�� r؊�g�Mp����NKSU-��Bq+M�@�>(�C	�*�?��ÉV8�	�� {e�ˣ��e�_��P~e���$�h�j	��S���2��r�i�@{o"�< c�
>��CzC�S#�3)�#�'T����M�!��⯻	��#i*�q��B�%��%%�re� vV@�[A T�NB����a�jO>�}	pz?�}ٝ���LA� �3L�h�Z��kY ����=�B3)�f�9��H����8��q��8��q���{?�Fi�������d��B�a?hXw�6*���1�$F+�"J9��Dc�g��SC��5U�o����n��`l� ��m�1�M�9MN
�#���nWK��p(��p�$V>2�U&"A�I�4N$�ޢU����A��sǢ��~�i��!�����_��X=5w�C�������N�M��M3Iz�IB��F^��MB�j#��[��Q!�@X[�PPĜm�Q̛n���0��Mm�0p�0T�����Zb��p�9��3�H�&�cg���Y{|��|��깍���ߺ���7�
\t��	�R��6A ��@X���
X��9l����������6���K��θZg'[�5�������Z�Y�T��u^5I�EZ{ǒ�H��+��� �r�h���_&�՟��{�54C��-�[4��o �Z̠��D���GƱ�ji }B�9��@��O D�S�?@�-�sS��`m�1�J�"Ȫ�VZ�@bXi%�@$P��:��e�������BOz�\Y���t���~���"���p�I����N�����g7�7P:PsC���ԛRA��Ϫ�v݂z���B�^�� �Q������s��w���B�%�.�Q��;r�<iH�K"`ͭc-��Z�H�#FE�*Z+�Ѣ�}&Ȥm��a�|y�����j����O��h̙kYK˭wQ
�#�2C��й���`8+�v�����4���c�coO�K~��VEi�4�o!�j��P�9Ή�RM����8��i�o�qf�z�0�.��T".�ŚV�t�Q@�Z�@�t��@ H�LdYk��zfK2-��0}ڬ�-\?�x��qzܪ�cmנ�5@��j(�&�J��PFi�]�%��)���A���Q�h�Pń4�=��k�ѻ��� ���)ٴb�n�y {��TK�VȠXp���Ha�%�<����\T%�'��X	�/fZz3��W^*ڴT�̈́�Wȶ�`�Lg�0� �	w�hS����b�ȓ�J���?�K��h,i�"S�����[6�%!�)���*����b��O�W��z�cѽ��~J.��~��>�0-KJ����c�Ryb[����L9�"
�DH���.#+�~TxY��k��c�/Y5{~�b��u���jN�T߸������RZ�ㆥ��ޕM!$T�7`�o�Ti��_.�3�� �#�*mmK��%������n�s���ϻ���ң�ڌ�����M��o��!SW4�(�˰�Q�d�%�p��D�僶��@��DLϑ��ȢY|��3����� 2{��}:�j�Dq?|9��g���#��glyS�r�FM{�$����X�.���|��������/w�a&c��_��w�����ӭ���!���=|��w��s�ss0�ݾ�Ta�Z�J��&`��pP�TP��D�w'���Y�y���d%��J��K?�H��2�� ,�hg�åV�h��̵(�ք��D;�)Eː�ZFЁ�:�� |L{�N9��?(��\����Ty��=�&5EP�P��]ھ�v�DM=ƞ.�C6�Ҽ��r�3��w�d�h��}:�7C���T���Tn����̼|֍�P?������80Xϱ�Ծ�}�-��E6VK�0�z'� Qz2}LJ��L�h=Y\�u-��*�q&�_΄�)��)�T���3�3��Ǉ|��&��O����m�n���p��g-g7�*#.PP�ièZ**� n�$<jBU:8����x���9���N�Ȇ<=�ڥ2�:�}��}�B�ܢ��:
x�	�r��K�A�7�W-#�.BϤ�Y=v$J�<#�֜�k3���z����3{�SO��Y��W�������c<�y}6�,�|��,m@��,��ɯ��Bf���1�u����XlSQMK��j@[��0� 4ՏsJ�)��,��%p�������0A�O��Z�����|TK���B_8Rx=�NP���[O�(��'y����%���5�i���嬈F@��e�L���嗗g��}����JC����+.y����5�T-F���$h�����A��BR���x����	���<����:D �����ӐƖ8MǢ�Hz�4�q�J����DIݙX��~
P����ڵ���r,�孲MÊ�8s�a�RK����Z��m�vЈQ
����� \v���d�����EY�z n���m�-��0W�
��X���[������7)ӣ�!0�c�P��=/i.�{d�,g���CQ��p �Ц��>E�p>6�U�T�μt2���
�E)$����.��Z��*��·T�j�q�PǮ}��߼�v(i�(��<�Z��%�ׯ��Ol�?���D���u�����U�m��c�Z&�>��7�[\�ᄿ0��VK�b҃���x�I@�Z)-�8ty��y��l���CMg��%��"��K��H�
�9� G����|[T�E~�1�Y+�XC���v�R��Q�$z�e�Q��
�PM��ʜ����$pW�PK    磱VE��E@  �.  K   FrontEnt_with_F8/JavaScript/json_server/node_modules/yargs-parser/README.md�Z�s۸�οqڡ���N�Ϊ�4��z��#3���c�$$!�@J�y��ww�$�yi�t&Sx,v�7��m�������y/���,ʲ0��x.�E��Z�iٸ�x�V�j���'r�t.B�����ϟ~b+��TyKM.�YH��&�j���G������u��b������:��W"/�(��j�����Pbs�����WnSp�
_��P[�$��]*¾��D'�䜩��C�?T���=p=�ׅ`K9_��
<��)V��xæ�������F��\���E#�4~!)�C6S�-�L\�e�	3b<O��Ҫ�/�>L��U��8�Dck�����7�����A͜���2�k�� �ҥ%����\�E>?x�y/_��[�</�"��@!��)-�W�i���a�d�f�Ι�UR������V�0&�e��d"��!�U���N�n���U� 3��ON�!�-P��v9aӋ��	;91��0�f}vk�^������������᧧����1B��;=uܝ�Ԍ��h8>4���r^�"��B��K���Y�X��,����ѻ���a0���?bGG#r���~�ys~Q2��c�1;�V�n�X�b�V�}j�Hd���o"W��7�&Z�F[R2S�ҥaSܲ�4S�����ahq!-�ғK$P��L�%klw����Zǥ]f'Js���%M�(���ߜ��$n<愅��aο�n�T���?=�0��U� �~V)�z��G�5��/��C�`rxX+�@���ߕ���;�`�Ӣ\f�ًT%xm���b�n��3{�d�K�V�8�	���*/��]��zt�Ah�0
��#����خ�8v;l��g�ll���V�Z���_�G#�#S��z�p�0��xՙ�2[-������9�	�ru��98 �t%6VAV<�F��Cq]���Wp�"<.�4>�)�c�pH���(��I�l5�"��)!�@	��J��uE�T�y*Nj��ef��"��t�	@�H�<��X˙�� ϻ|�h�0k9
=a�N���?�/no��KŌ&5g(��B���q�D�> U�@'�
 ��X[���4�tG��`�Q@�X��p x��j��4���o���	�g� ��4��"o#G�N�^�p;�IG��q[s�4�M�kD`�o����!�L	�j6y��*W�X�S�cq��lo� �����]�WM	�\{�@�F@��JC�}�Ɇ�6'I�%�e"��25�A���P���ۺ�[vjejH��ٍe��TΤH�����6��vu�Դ��i5
^�r��]�[iNG�$X��\Hc�2��v2�S���؋��Y�R����֊G���n	��9��V?��tA����7����*�����׷�pq�tt�7��6xI�u`�˴��b��{��I��w\E��Um���=b"��#��*b� �
��˓����#�q��������Y��a�Y����"��>i1��@�%�Êk�c(-� �so���l-�aVо�lv̻{L��	�9`,F.�4,ʣ�.�,��
r��t��\���
"��vd0����I��T�rt����=��̢ɶc-�ॽ7�6��l4�wW�b%r&g��m��eܑ%����P��7����ew�M�\(��kc��l�E����ɢA��h�.:q/�IZv�WF�����6N����$�HK�4�|V��e������2>�͡Mj�J�RJ~,�+�����^̨�����g�Pp|^�F%=0��
]�s��U������`��H72E���ֻ�-��}��ɦ���w�F(�kQE���[:.C�!�3�N�m�$�4�PZ��b�H:I�	��'he&M/�+�����±$m�%�
�Ԗh�b��!�����O�Y�$X_�,H`x- 	^]�ܦo�6��N#<���v��1q�/�l�0HUÇ̓�J�0�}b��>��K�M
�:J�,T�}y 6��Ղ������gc��:��	����(FVB��U�{�����a���3E�&������i@}8U��S� ã��P����oa ��RO͜��zwm�M�9��3W��_�r�Gm�*P�]B��9M@�5�0{�E��/_b��e���kU�E�~Dxy���r��Ψ�Y�l&�$P߻�V$uܑM�wu�x��}3n�	*��!�Mgl6�S�tr�4��-h�m݋P�!h6t Zl���-�׊�BV���:3{��f(�#Zy|7��P���9x=xH�T���%/�C� �]5@��Q~�Ml�6F[�d���	{l�c���W����S>p#������}����-�I��č���v�Z%�G�r~z�촥Ó磱����Bщ��F�ݳP;�D��$�Ȅ�ς�C��g���H�k�}��E�-�lUWg6�m�? ��Mn]+��gj�6����X�M�\�eKA���4�K[T\�'51@�p�1����T��5]\�VE���<�;l6�&�w��N��m&���hH���p�fG��q�5�9�����~�����(_�].�u���4{�_�}1̸2�p:�?'��.V#v2b�� b�I�{�)Q�y��"�<9��.@� 0���#�4����ǻ�Uj����`�p��I��~�r��;n	6��=V)&T;����w8[*���L�FX���jj�C��C�tn�t�e���Z��:�mA���E�#��m@����e���9h��������Vved�����md�:�6Ѧ��W
�3�VU��#� �{�,"Q�c�u��w�0�{�rWHQ�A-�Ri����Nt�I���'X2gA��k�q�3����҃]4eJ-
��!�D�
����!fxE��Pt?v�!�l`�W�u�-K��k�S�N	,t��$.T���}��c���t�1�$=�2aGT�?�;	�P S�>yt���AF���YC�O\�2h�w�t�#T���{(�M��!�c�b�����hc�1��pqfٔ֔�������U�bt/��ɇI��*���Kպ���Q=�.�,\A���ie�V���i�	��R�DZP���Ag��y���0e@�vԩ��a�T�?闝&��i����g��>vA�`���>���b��<ff5�u�X�(&f3�~���S��	��5o�.��*W뼛"`�p��=u�p�!榽�m���Jb-��������Ϸ�!ܘ'R9-��{u1�hݻ�^�� �ه���c�Ɛ^��#�;:��M�B�uë7t<r�m����v|g��߉�oO�ʱC��5�g���H����e?��Q�@j�ۗ�"QfcJ�dK~���b�V�G��W͓+o�H��?�FB�f��*��x���U�c����f<�B߰)� ޕ�+_/6�����F�1�˖�R��Z�G\4<(�b�*A�^�w��2A�.7�ˁ�)l������!��oE�:��ahQ��<g��+�y��=zW$V*[	c�G�{X���K�ӏ�}9�6F{��~`B�j��5�?����2����:�W�W�;�MM��a�g����B����>�[�I�e"r#<���� PK    裱V9�H{�  �  M   FrontEnt_with_F8/JavaScript/json_server/node_modules/yargs-parser/LICENSE.txtU��n� ��<�UW3���Y̞��FܨK'&Rk,LZ����t����|�n�k���_�_����
(Ô�?\R�!;_���0A
pY\G�
x�?�9L�a�ˍr��~�%���9��0]a��9,�}:C��.	N���.����0%70���G7�tZ:����_�)$t9��86�]�a���O0��dһeC�mU�=����V��b<P��PYA�޶JC�M)(�P! )M��̐=�-h�P�z�7wƲ}�e�R��	Ϊ{Z��1]�8�-�>��5���A�
�#�L�M�:m�n�'*���Xɩ(��f�-�����RI�~���hG�\�~��o�5
5�������Ve`��0��fO��5ٷ��ܘ�WZ�dVc��47���a�dT��*���| �����z�i���d7�u�y�b�g��յ���PK
     ˣ�V            G   FrontEnt_with_F8/JavaScript/json_server/node_modules/require-directory/PK    ͣ�Vh���  	  S   FrontEnt_with_F8/JavaScript/json_server/node_modules/require-directory/package.json�SMk�0��|iy7��6�P(=�Rr+-��ĞĖ\���	�߫{mh�Ћ��ͼyz�n 
�]klq����>S#|pa���}�K�2�\����lȵ����W^�H�e����/Oo�(g��#Z&�cƭ؋}������&�*Ҏ؍@�t�`B)���	k8�najuu��t(U����������](m%���z e���R��Л�w�"k{���ؚ�����%8���́�*+���oS���ٚ�$���|�T����,���0�.�5�O��Ô��5Kp�z��*o�)��E���,zg��Y�MW��V��1�c�7&m�z�j���"���v�Ps����C���/nLW��߉�#���Q7�q�#��ǝ���nI���	o��K��%�b��[�^���j�ޯ��_Y1���s�y
3i��yH &�q�97��PK    Σ�VICgW
      Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/require-directory/.npmignore+I-.���� PK    ϣ�V�̋  K  N   FrontEnt_with_F8/JavaScript/json_server/node_modules/require-directory/LICENSE]R͎�0��)F�v��v{���&1`5đc�r�!�B�bS��wl�e[)R����7Q��W��FN��	I��:�C��y�/�_^@��
k[�<~��ñ6����z<��8���wW8���u��~����:o��pң����p��4H:}�0����56�P;gS#��9��k�����|�ɤ�OL�#I��̀hޮ�b|g�F��h���`Sӟ[�@ޮ{s4w�0q���AЙ�Ѷf�:�:�w�q]BZ�wg�E�1�$��dGp��������.� 9�@�=��{���_'��<H��h�bd��n|@	�{����m�К��}%$l���?���֣ԛ����c��+�ը}���`��;c�wo0��#��6�ȿdP���PɀWPJ��3���Vx�$��j)�
�C�BmÁ[�ɋ,��������We��x�����\!����S#��P�UFVL�K<�Ϲ�&0�@L�#(��J��uN%�kY��!}��/�Y؊import * as URI from "uri-js"
import type {CodeGen, Code, Name, ScopeValueSets, ValueScopeName} from "../compile/codegen"
import type {SchemaEnv, SchemaCxt, SchemaObjCxt} from "../compile"
import type {JSONType} from "../compile/rules"
import type {KeywordCxt} from "../compile/validate"
import type Ajv from "../core"

interface _SchemaObject {
  id?: string
  $id?: string
  $schema?: string
  [x: string]: any // TODO
}

export interface SchemaObject extends _SchemaObject {
  id?: string
  $id?: string
  $schema?: string
  $async?: false
  [x: string]: any // TODO
}

export interface AsyncSchema extends _SchemaObject {
  $async: true
}

export type AnySchemaObject = SchemaObject | AsyncSchema

export type Schema = SchemaObject | boolean

export type AnySchema = Schema | AsyncSchema

export type SchemaMap = {[Key in string]?: AnySchema}

export interface SourceCode {
  validateName: ValueScopeName
  validateCode: string
  scopeValues: ScopeValueSets
  evaluated?: Code
}

export interface DataValidationCxt<T extends string | number = string | number> {
  instancePath: string
  parentData: {[K in T]: any} // object or array
  parentDataProperty: T // string or number
  rootData: Record<string, any> | any[]
  dynamicAnchors: {[Ref in string]?: ValidateFunction}
}

export interface ValidateFunction<T = unknown> {
  (this: Ajv | any, data: any, dataCxt?: DataValidationCxt): data is T
  errors?: null | ErrorObject[]
  evaluated?: Evaluated
  schema: AnySchema
  schemaEnv: SchemaEnv
  source?: SourceCode
}

export interface JTDParser<T = unknown> {
  (json: string): T | undefined
  message?: string
  position?: number
}

export type EvaluatedProperties = {[K in string]?: true} | true

export type EvaluatedItems = number | true

export interface Evaluated {
  // determined at compile time if staticProps/Items is true
  props?: EvaluatedProperties
  items?: EvaluatedItems
  // whether props/items determined at compile time
  dynamicProps: boolean
  dynamicItems: boolean
}

export interface AsyncValidateFunction<T = unknown> extends ValidateFunction<T> {
  (...args: Parameters<ValidateFunction<T>>): Promise<T>
  $async: true
}

export type AnyValidateFunction<T = any> = ValidateFunction<T> | AsyncValidateFunction<T>

export interface ErrorObject<K extends string = string, P = Record<string, any>, S = unknown> {
  keyword: K
  instancePath: string
  schemaPath: string
  params: P
  // Added to validation errors of "propertyNames" keyword schema
  propertyName?: string
  // Excluded if option `messages` set to false.
  message?: string
  // These are added with the `verbose` option.
  schema?: S
  parentSchema?: AnySchemaObject
  data?: unknown
}

export type ErrorNoParams<K extends string, S = unknown> = ErrorObject<K, Record<string, never>, S>

interface _KeywordDef {
  keyword: string | string[]
  type?: JSONType | JSONType[] // data types that keyword applies to
  schemaType?: JSONType | JSONType[] // allowed type(s) of keyword value in the schema
  allowUndefined?: boolean // used for keywords that can be invoked by other keywords, not being present in the schema
  $data?: boolean // keyword supports [$data reference](../../docs/guide/combining-schemas.md#data-reference)
  implements?: string[] // other schema keywords that this keyword implements
  before?: string // keyword should be executed before this keyword (should be applicable to the same type)
  post?: boolean // keyword should be executed after other keywords without post flag
  metaSchema?: AnySchemaObject // meta-schema for keyword schema value - it is better to use schemaType where applicable
  validateSchema?: AnyValidateFunction // compiled keyword metaSchema - should not be passed
  dependencies?: string[] // keywords that must be present in the same schema
  error?: KeywordErrorDefinition
  $dataError?: KeywordErrorDefinition
}

export interface CodeKeywordDefinition extends _KeywordDef {
  code: (cxt: KeywordCxt, ruleType?: string) => void
  trackErrors?: boolean
}

export type MacroKeywordFunc = (
  schema: any,
  parentSchema: AnySchemaObject,
  it: SchemaCxt
) => AnySchema

export type CompileKeywordFunc = (
  schema: any,
  parentSchema: AnySchemaObject,
  it: SchemaObjCxt
) => DataValidateFunction

export interface DataValidateFunction {
  (...args: Parameters<ValidateFunction>): boolean | Promise<any>
  errors?: Partial<ErrorObject>[]
}

export interface SchemaValidateFunction {
  (schema: any, data: any, parentSchema?: AnySchemaObject, dataCxt?: DataValidationCxt):
    | boolean
    | Promise<any>
  errors?: Partial<ErrorObject>[]
}

export interface FuncKeywordDefinition extends _KeywordDef {
  validate?: SchemaValidateFunction | DataValidateFunction
  compile?: CompileKeywordFunc
  // schema: false makes validate not to expect schema (DataValidateFunction)
  schema?: boolean // requires "validate"
  modifying?: boolean
  async?: boolean
  valid?: boolean
  errors?: boolean | "full"
}

export interface MacroKeywordDefinition extends FuncKeywordDefinition {
  macro: MacroKeywordFunc
}

export type KeywordDefinition =
  | CodeKeywordDefinition
  | FuncKeywordDefinition
  | MacroKeywordDefinition

export type AddedKeywordDefinition = KeywordDefinition & {
  type: JSONType[]
  schemaType: JSONType[]
}

export interface KeywordErrorDefinition {
  message: string | Code | ((cxt: KeywordErrorCxt) => string | Code)
  params?: Code | ((cxt: KeywordErrorCxt) => Code)
}

export type Vocabulary = (KeywordDefinition | string)[]

export interface KeywordErrorCxt {
  gen: CodeGen
  keyword: string
  data: Name
  $data?: string | false
  schema: any // TODO
  parentSchema?: AnySchemaObject
  schemaCode: Code | number | boolean
  schemaValue: Code | number | boolean
  schemaType?: JSONType[]
  errsCount?: Name
  params: KeywordCxtParams
  it: SchemaCxt
}

export type KeywordCxtParams = {[P in string]?: Code | string | number}

export type FormatValidator<T extends string | number> = (data: T) => boolean

export type FormatCompare<T extends string | number> = (data1: T, data2: T) => number | undefined

export type AsyncFormatValidator<T extends string | number> = (data: T) => Promise<boolean>

export interface FormatDefinition<T extends string | number> {
  type?: T extends string ? "string" | undefined : "number"
  validate: FormatValidator<T> | (T extends string ? string | RegExp : never)
  async?: false | undefined
  compare?: FormatCompare<T>
}

export interface AsyncFormatDefinition<T extends string | number> {
  type?: T extends string ? "string" | undefined : "number"
  validate: AsyncFormatValidator<T>
  async: true
  compare?: FormatCompare<T>
}

export type AddedFormat =
  | true
  | RegExp
  | FormatValidator<string>
  | FormatDefinition<string>
  | FormatDefinition<number>
  | AsyncFormatDefinition<string>
  | AsyncFormatDefinition<number>

export type Format = AddedFormat | string

export interface RegExpEngine {
  (pattern: string, u: string): RegExpLike
  code: string
}

export interface RegExpLike {
  test: (s: string) => boolean
}

export interface UriResolver {
  parse(uri: string): URI.URIComponents
  resolve(base: string, path: string): string
  serialize(component: URI.URIComponents): string
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ����<LR[g�E�5����AQ��ԏ���I�C��oQ�Ra�ۧ��s�Kd0�ܶ��� ���r�^�!XC�Y�[�^G�֏�J�=8C�{���ъ���	I�����#���,���Y���������rgLV,?�C��]���}�ߢ�;T��rK�f�i���Ӂ�J�=���-i1f��oKjtC^̞���ш-$��'���+��B�b��:\'bAt��\�H�]��u��Bb��:f���6p)�(�q�V��WAY}+$��N;��&,Țq8R�)Uչ� I>�$��Y��BֽU*�	���!m�j��P�	Y�G�� ���m�d����!�c���H��Ë%�����'��\�n�N%A1Q}�J�ڮgc#L�'�`DL�/j�T6�k���8Ǿsj��0�?=���P�-��SmFR��ѽ2�Co]���К�\��3Qb7LdR��?c�QF蘖1�pp��i�'	�<V�����n=�u4\#���!)fюþE������/.�֐^l��P:��O�����+�e���h��t��[��@���me}hX�֭"{������)�����w����g�0�vo��
�������"���|No�Bݓ\Ue�C��Z1<<;���ى��a��/6�@�ʐ�u9�pT�o��U���<\�O7�.47�vN�r�E�o4tU�%GGW��&E�
�A,O��i�-�D*;ݵ�u!r�;�EE����!��LpAY�r���X�޼F��4$mK����x��5Ɣ�caS+Z��=��GMl�_x��ξ�I9�QҤ�Y
��7g�F�g�x�JB�hD��T,ўdԧ���PK
     ˣ�V            B   FrontEnt_with_F8/JavaScr
'use strict'

let NoWorkResult = require('./no-work-result')
let LazyResult = require('./lazy-result')
let Document = require('./document')
let Root = require('./root')

class Processor {
  constructor(plugins = []) {
    this.version = '8.4.35'
    this.plugins = this.normalize(plugins)
  }

  normalize(plugins) {
    let normalized = []
    for (let i of plugins) {
      if (i.postcss === true) {
        i = i()
      } else if (i.postcss) {
        i = i.postcss
      }

      if (typeof i === 'object' && Array.isArray(i.plugins)) {
        normalized = normalized.concat(i.plugins)
      } else if (typeof i === 'object' && i.postcssPlugin) {
        normalized.push(i)
      } else if (typeof i === 'function') {
        normalized.push(i)
      } else if (typeof i === 'object' && (i.parse || i.stringify)) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(
            'PostCSS syntaxes cannot be used as plugins. Instead, please use ' +
              'one of the syntax/parser/stringifier options as outlined ' +
              'in your PostCSS runner documentation.'
          )
        }
      } else {
        throw new Error(i + ' is not a PostCSS plugin')
      }
    }
    return normalized
  }

  process(css, opts = {}) {
    if (
      !this.plugins.length &&
      !opts.parser &&
      !opts.stringifier &&
      !opts.syntax
    ) {
      return new NoWorkResult(this, css, opts)
    } else {
      return new LazyResult(this, css, opts)
    }
  }

  use(plugin) {
    this.plugins = this.plugins.concat(this.normalize([plugin]))
    return this
  }
}

module.exports = Processor
Processor.default = Processor

Root.registerProcessor(Processor)
Document.registerProcessor(Processor)
                                                                                                                                                                                                                                                                                                                     �M��o�.��θH�#4��(���P��_PYMaf0w���wݵyLA)ֿ
Z���JL�q�:�O��׬+��8 �s�REwB���[]��a���]���c�z����b¼��ł2�V�_�1f�qW= �����[��oZ\"N,\�si�v�R�^9}:��}=��]y���W�E؆�m��t_?Js����QK�>I�f.���1�e0(��d��`�"<� �a=�V�5
�x
s�K�a���)���fj-�����6'$�e�r�O��3�
�)��մ@�4�P���l�=i0;M����&G��f��7,� ��ב�9���Y_��+������'_���X{�۰��ح�>z"���D�'����8��L}�D��G���ށ��޵s����!���!M�S8�����c�թ��V�U��=ϧm:�G�K\��-�WJ��9��5`L�W#�X���
��������dN���:���o���"����s���]�Y�*u�t܉b�n�p��'{�������Y�+����b;�aJ*z<���?�g-�������ez'�u�?��x�!C��Ϲ|+1�C�H\o�׭�� �rE��X.���Ӏ.�u����%�,ƻ���>KU@�ʖq�Rdgq�uz�Կ��l���J�o&�R}H�:T�鐱�=
Pq�-<��ѱ�[�y_��4n7��O�1���	5�E�2`R��V�˧�����̉ў�'�6��O�y�� n�!�ڙ�R�m\���ԶU.�͡yL��b֮���^aJ(���i�_yE![��w�Ԡ�>4*՝����V��/�j����9�2�H������6�Ύ�"�N�����zr����G'�)�F��o�B����!M���)��7XNMvP�����q�(�|,nt�K���n�'w�y�}Ʈڅb�,ˏ�f�����_�#�8֮���\(/;�ē�o�������s���ϣ��l�^��[B��v%Hk����eTC���7iP� ���f�28�?�!�w�A�g'����B�I"R��(�`g�ʫ�����Ȍ�Q0�I�-ŦM9���i�e�~�%������(�qe��S1��'�E� n�S_�5���Ӗd�#��7�m^�O�S����̜�DV�=3���I�~Q�j�A�N?:����NK��Q�������^���`L�c���+����zP�+C=��w��4 [+�>��6R,��9"��B�qt��8&��{׫��x��c��je��;���9��� ���L�/�}U�A�^2u��oO ?s�0%�1-�(v|����M��b'i�(���H���W�X���l�ϋ�1{3l��5��U"�z�%�R����O
PÆED~�ؗ�Z}�c<��W�����Fb�>s����8���+gJke��3�!�(�u�DГ���$�4$��5/��5�>^*�y�{5�D`�Y%I.��L"������P�:��|ك��h�'
:��C�NW;�F�o�qzO՘�&4ɢz�^*���q� ���g·י��,�ig�j��?�VB#�i���.�h�W��1WV����v^�r�[���0�uhխ�Y��T(/7�ˠ�<gz
�Mb����%��N�o)75ۨ���
d��U�����m�QӞ��Q5|�C'�*�O���#v�UWy�����A?�ha���;b���K���'���h�׳].�Y!!���c��V���Ök@#7���X�!�:�֯yva���hf��7�}ӑ�)�49�gM�9��s��qSV���hw�ᕗE�*5�m���w�T��-����K�;���꟔��wF���FX���c��n�/xGΚEaZ����AB mJ;|gPl�;�VeKc�)��@��k��i�TR�O�i�qp��h4Q$����՟�(UAa=����c����nL�i��\���z��<�ԥ�iz��T7�|�0��� ����9�R��X�i�A��MTK��F�����iQJ��8���#��~/�E�V>.�<RJ�=s�����Igg��^�P`c���W�����(���x�l�s�I|��g�A>��ҙ^��+|��p�ة"X�hoY��q���0"m�1{߳�[w�/���L���sɔiH]��\�:�i��Ҽ�H�=�s%�����V�q;��,��(�6[��-���5w��A�S(��~���'�7!�m=8 �
�#3�Ѓ_�Rux`>r���q� �א�$;�lĘ,�xy��U�@BE[��̔\��/\�\1H�'��ҲVt0`ئ��L�q���^=�G����|qh����̈��X�<���Ä�S?\�k�Z��xn�O�: �zC`��-�ai�e(ư�	�I�&\�H�`UQR'�$2��$<~�l7i$4�o�7K��auK��u[[�ͯ�E'�Z�"��k�`^�'�ށ��f�3�䫧	�D�-`|�^�s��т��qR-]�@��jmQz*!6��r��/�sW�����T���Ѱ�$S�K�+�� ��+���9�<m�)?�e�f��)�<�l��^�G�u���&�0�`o�t Bp�\�E�.I�Ë�S�i���{
�z5�����(v��ŏ�U1�h	�ǚ�,Ed�K������?b�楱�r��%�p�4\�A��g���G#2���/24�_/H@M�C~_|��B�p���Y>��a�|%v%�_�[^�?�lS�>Q�*v߭Z=t)��'�٠9��F,����K��!W��q҄��}G��+v52<�������7�)��:u!Έ@d�3�hm �}�LΉ�>�x�-�!;/�ɉ�>�2�I�&y`PeW��տ���`��{çf��/�����?�b���Y�ĭ�Yu�N<Ê	e�bl���=����E�����Xb7��k;��'�숏�@4�Z���d�l���B_�~���s�[�$?��y:Tٛx�
s���!O��7�"��Z��e���MF�����8�Uh#��)[� q'�c4b�Ţ���c �zr���n�
U7��Wt1ۃ��M̷�m>K����HYt�6���]��=^��Ձ��<|��h0`�%�5茚�q:�:8�[����E�����% �XZ���Fj�CdV�"ɟ����qɟ �8��6�>�~�؀��!5�������$c�/D���q�����x��;y���:2s�
�ƪ�����!��8NesM���Own���{/Ԉ�X/�K,�!p�~.1�����O����Ku,|�Ps���*��`��2�ET�2O�#E���4 ���oO�c�<h��4�m�1��
z; O��;5X�p�*��z3+�-�J��m��/�b�{����ub��-�B�^��N�TÌ�����"�,�)��̼�19� ��G��#F|���e�NϞ�>�u (S��w� ��5��=����J��6��&�:|m���[����@��\1�����E*��$1?@r�kq���δ~)}���<�����0�}q~�W�j�����P�-���E	
�#�	�l�/WcҊ��u@>��E�h��>��AY���c��X�Ǒ��i�=��Q�U�ܾ,fHI�?u�{���	�%=����̩��o����"�]�y?ZI���qߪz�!��e���)������p���C�/!��p���[���?�4r 
2�SB4U��ìE�Y��vT���C��i/��.�x�.P��QC�C���=��8�sR(���0@��X���:�i���SEj��ج<�����e��
�i}\D`8� ԝr��n�R%U*�`'�	��߹�\�l����h�6>�ְ�Ç|p����"�]�1�Qv��K���R�+r��m8�B���Nڄ�����~�6e�h�N)o�:��K0��*�Ā-�ج �����1^dAy��Kى��S��ٱR�B�a<+��%8�V�&��iW ���H"-��W׊���
�䓱��DK�.4YB��`����j ��>RHM��p#�l�n�A(� ��d:r�:���6w�z��E���k-�� U� ��j���i:$V\C�Z�=�ܵ��&���BH!a�c�ik*�_�+��{*o����p>���z%�J�X���m��AA��4�v���}�!$����3R�|n��&�+c�e'����Y�i��G����'��2�/�4r,I]$����qN`�:���>���a�\�;��|s�.dzB0� {fmu]�h�����]Գ2��(��G��0����υy�j�a���ٚ��S:'}�>Ȥ�����v#`�Rr���_�4���qXO�z	�Aj��l5���ť(��/�-�%)Vԓ���Vi�Wa	##��f��5 �]l�aM��[��:�1]/�@�������OF�Jօ�g1_P��F==~4��>P��<Qe�F�Ӓ�_��I�������u�}�))XF�����/k�|��pE�6��6�x�uu��u	jΫ���+�O���*��P._'d�2Н�"W}~Y�b�8臘����Ǖ��)�0޹�O�����7MaCxɽ��`EV��z���)��!_q�X��S{�Y��ɳA���^Riٕ}�v��ƌ��2�c�I
K�ʳ�P��s��n�G�:�@�B;&6�:_
��Dͤ��t��9�έ?׻��Ȳ�����l���$�f��DTjn.��9?tg��Z�K����0ɹۄI>f���า!M��Te!1��u�@�e��rr5;z���ʰ�Y1�`� M+�0~���1`K2���n)�b��a�_ �gb�wA��M?��{I1bR�I��ZtO0 q��+�Lw�'M�kɡ��p�U��8�J���txnM~�&��sQ~��ӎz��qkWRYn��T�sl�����b��w��۔��� �����:H��1pd��އ�U�OR_�2���#*K�W;d��j�]XI�;\�|!��	�]��������"�]�H$�ya��>�գ�9F�6�]!1��O�jl>����v���L�l���p����G-[��Z��'����-燵��I�7��<�'h1$Â4����#6+0����>>�STX<�+g�M�����Y鴟A�ƴ�$�b�0.��{��UF�,�*�T�������3u��R��x5D������U����46��V�~�=�x�o�^��F5ʸF����%x��"�'?�9�66�X
���6Z�RD�_zG����Q��մD��a������ܱ'>*�/?L�M���=��Ȯ��+)�%`����S�6q~'� �?_��xW.
��g�,$�zU��Q�y���"�%n���J?^N��0+ĎA�y�E'�)ӣ{�O�eE#���e�v�)��~!ɧ}�.3����v �يi��$�59�(G$�x7��>O����Z�Ĥ?̈́ް؞�r2�Ba�?ՁY�gi��Q�5�M��p�6k]`"l~fx�����Ґ��5L$�pO�L�`˧�%ǜ5���U��X��S�7�d�ُ�|�n�z��ڨnk��w��cP�fm����V��Q����=>l���?R<l(#�0F�ng_9`��*�e�B�D�T�+{@Hap��\� !��aA,C����^u�z�k�*�*T�QY5B'��ٽ�P��A�d<[�Z��a�F����uAJ���d!��W?K�j0u��G@�C}C�I/%�^d+hEc�to`�n��tL�!S:��'��ˊ��0��B�;�3��oʤ�R�P�Q����𬀅�@�N�����9�Y�P�F&�l�-:���!Cz�|�����;=�-��c,�P��K��pb�� 9��Jo��P�ORILI�����t�u�CZ2 b�B������,T����P��T9�{x�m ^�R���W��;�V�x�����M^@��{�e�Mb;9�+Qj����K c����8!C�Ev��ěu�}��A�� K��	�@�d������L�G!��ƌ��� ,*B� ������\w��/|L����U�>�����o��ى~���t��窌n���}Nw.rFib��ء�V]L��E��ִ1["�#���(%���S.<�;�D9 ��H��u�sj���xA�(h�.�����T^�$���QZ*��*\�O���%�У��|Nrio��8��_�S����).�̗�t  ;�����N2�K��֙����8!W4)ٖ�5T�e��J8�6�6��;���_	�^���zX  ���g���xS��C/f\ǿ)zU^ރ���h�m��U�W� ,B '-n;��&{oz�}�Nj�|^s�9�;��w"�S������æ��s!���� n��M:�qF/	D��В$J�h≟J?��ju��+� �}��s�BG�&�  �A�S [�n�����]�!�\���?��nX8�흲sG�	��g��y����1>�5+)N��F����������$�љ\G�p
$b��t��֘L5X�sE&�=��D��	�d��=�C���d.c��Q�&���7���W��\x�̰+Aì`����:�w�cI��<Q�ye���Y2ն�o�B!���DWh%�bG�6��1\i�<5�6W�� �͚c��V��_K�sj��#�|�񙢅��*A���a'^�4n�T�!��	5�2M��g.|65й�sǄ�g�{z356��	w[ĕU�oO��$�z�ZZ�X����%��T�>�kc<��m�L+��Wͩs�IS���G�u��*�-�"��^V�|�D}�|��zAyl�
��*kL�ן����� X~�~5�`Fj(���CZ��S@�:���#���J�}Y���_��/�?n^��/�2ݭCY�2Ϙ%	O��������e��;H�kz�Vd�bEtd!���!"f�_zk8{i�B�O�f��s|<!g.��i���,�@��i�inQ�X��?���k�?�c�a����n�D!{��\jf>Z��j;!���Z����ʷ�L�빅-H�k���ݾ��Z�nqM�$�O�i)X��	�Y�GЮF���%�{�p���g�A�x?�� 7���ʂn�SoU"����9@�H�2X��	�ݦ!�G����b��U.F�����œ��Ć�g+�p��*š��%�߀_���K�����?��� ݁��U��߶�ƛ�ak�TBK��"��ݝ�eЛ�y�����W^6:�!<Nzyvy����@�����a-�Ʃ��y���W���6{ٞ�����xPWU�����.�:=U�����f(h�i�Fr�*?KC�%.��G��6�����c��~�՘[���-@�B���DA��[���Y)W8�o��{?/���� �z�ˑ�ֱ��0a�+��ϛu1�~*�=���L����g����Y����/�Z�#�ʃ�۟ìͬ�����6<>ޠlo�wwj�Mm3����8�uX)'��˿��7k�D�-?�+)�ǷVc�JS~Iik�4\0��k�..$�>6��i���d���w}�I�M8z>�4��+����50��4 ��o����k�)b��MJ���ُ����[(YV�n>ȣ	�<��1E��GK����':��rzц4���
�a XF��╡Pc�,��g���_ϫDE���t������^U`8!�ks9Ǆ���S�� �3h�T�m����B���f#-=�߲8�{Ο��HLP��<��g�ւ��юm��tϼ��<��Al'�"U@�P�(���o�p$�z�)Vuyr �{
[���qV�J��2c���7�:)�-y�Q�]��	�g�d���>[ܟ4jܨ���c�]ܖ�Űh[����X,�o~w��c�ˢ߮�Dexq���*y���w Q�-�T���HGu�����ޅ��S��z���!;�.y�`�MA�8�A�g���$�=���dÓ�>�~،@��JY�c�,_�pȣց�i��2��b[~;8b�0�k&=b���r7,	NX�_~%�U��7�fUu�՞A���/N���o&��LG)�}e8���Ї6��Mt�"A�Xb��ľ�)��F�͖�L��(�^̀��F�N;O�-��>��P\��� �It�����.gu%� J^Wr�^X���Mx����i��y�\�JV.�M���`�.b��UĚ�  ���aZ]UZ�c����1�!}�6諙uf��/ԯ���E�1�5��K�'	�C����*��R�u��Aѵ��s���b��֪\��	e'�#��uSd/+�z���/o/�az��B�gGׯBQ*��du����	(*�NSO<�r>�"��p,'�&�	��-N�L�:B��D�ffF��g���bW��O�^p�}C��gahK$������O��i�5.�3�����B���5�"Z�7l3�[;*T󴏮�z�F8��n��k#NM�྾80(�V
����p��L�S��=X<,�T�n��'h Պ0������D�t��I�q�2e����>�x@����D]M��Io�~���~�VMq!Z��<6��-�|�?���ͰcTa(9]���$H��{�<5���?xC�n���N�iU"
?on�!Ex.�7����Pցp� ~(�<1uQCŚoz�{Pv�n�BJ>�8���q �a#]m7M������/Vu����*��I��(	�s�U@,�h�h=�����6nr���CF��|q-�F��#@��R�Qn��w1g3��V���ӹQj �0���G���x�kK0���O���������x�?�rqj'��A�l�Zț4���L�kH#��R� �b�U�ag!����3������U`H�*�@�o���4#���I[���˘94���l����~�;�gC��K�M�<��������4MZX�������e
7��:I��\�#���@O3YZ �`�w�[�9���8Ė
@"� }O�U��A}%V�6�V.�����h�'���j<��f����Q\$P�0�>��,����BDIQk����7���X���Gƫr�+"l���7��nFpB*Ln<�8 ��\7�!���z���E�0�|˂�:악=�T�tq�E�[��U�X�����R����pqk�Z��3�F%C�C��Y��Q����Pw�� �5M�\T�x* ���&i?��cF���"a��oC�����[P�(	:�x�DL�l5m!���A��EK{Oz�n��@߳�W��L<iEii��b���	9�.����Z�'o]�'�s� �c�/�w]d���YOl�IL�O��=L1�ܐu_
���㷶�cNu��l	Rc���\�4�~��Y�O8G��a!��J�~y�0�K�+�^��E�ޙ]:���\Ux)�#<#A�<�������p�!�Ոy�y8[!`��PN����,�I��VQ�w����Gm�%��

�M��_��W4BΖ�����*�SU4�'�����[F�1����MB��'*ό�P$u��o��Z%�l��	�8����د}>X��-x��['g�Nd�ԧ���"��������G@f⡀�_�ߺ�i6��i3�B�Q\3���(W��N��q8�^�l�N��ӯ=n�
yc��^���H���v�>��%�dg�WG$���\�/��mf7� �\*��GHS_f����2MO��rۍ ^ʀ�OF�\�B���O��HϜ���Y�dĶʨ_E�7���:�}Od�y�
��0`����Э�_�4�&r�K𺻤��c�J�!�����.k\�4�sF5+kpv{�P��(��~\KHS/���`�9����0����Rv��	һ���&��w����p������G�t�BVp>ȗ04t�yd��N@�Щ�E�4FAX�֮�Rj������CU�S�~�����q�Q��芁f���nর�����R ���Rn���BR�D�oaV����(b6/a1�]�
�fmn�ow7P|��P~�U]1aq�g�U�}��琝	]k���c��2ǈ#�4>q'�-U�R8$1T;��K�s���KD�]�
�07�W	h��Bm�F�����2�� c�
�g�(/Ka.'eU�^��,���� �?O��a�m��j3�PNX��磔��D�t�)3θ4/`�/#0�G� ����mIx��g����Fv�֦� p�w=�t@����Q�����	��5��kQ��n�uc{�MN�/���x��â��e1{lH��dv�/�>�Ge�A��#�2r��ty��ܭ�*s��'
`v�Pl����&���D8��i�9%-��F4�����Q®&��q����#X�07��v�O@�s�}�G������ש��Dm�j��O��־�y�t�;����Q��?E~!0	Y�R;ў`:��Y�)+��D�6�����6�&����8Mo|���ƫ#n�U�p׃MH��o�S�c(=/�4�l�F���S�n���B�T�h䡑#�)�s=��S�ۈM�!���];��Č�^��;)���_�1���!���f.��4YG�����;��=]u:CҪ�v�����K(#���`��
2���a�������ԆÞ���L\j�N2����d���_-S7����W3�s��[���J�%�<��0�+0)Q�f�o�X9eĦ�P�4�i�)�<LX�۽������-ԛ�� ��W�c�-�&I�}FkВ�kö��	�9$T����{�3��؎�o�Zǫ ,�O���Qt6|�n�$�h�T�r� �DC%���J����y���y�sҔ��5��Fd�P�#�ƾrRX$��.���6�3jz����Mh���%j����<��Va�V6gYM��@�s�Qb}D
�R�£��eS�q�'b'�X|���2�Đߜ�בg��W�X�tc�uUЂT͚;��7�����$HO xE�(��-I����"��ڡ�,��m��ݶu����޳������e�0	��Y��S��ᙑI�,�S�h�����8Ȧ��EW�MO��5a-|`26v��r5���{K�д�2!M�I��5��PWO���
�}��s�/p���HY_��ׅ�[��*�F��N�χ	���84�'ߍ��J$(dJ����CG�����\z)�M�׃��݌��6�d3ԡq���	��<$s�
�gB5�=3�M�����R�n<�ù�� "T�le��9��r5}�܊��z5k�)�%r��! QY:�T9-U�$�U�b�����[ŵ��#�9z뚮V퐵�j���+�������e����0��E�_��ث���^��_:;�1�b�� �$ƍE[���C�/I�q��
��:��S��E��)Uɘ+���_��s����5�{i�"4BZtzB�W� g��ec=V�NG)<���4y|�ڏ�a_��V}��5��/k�uM���2_�Б��Z6
MJ$+�݁����-����n���|�a��dR���w���'O��B��yf)ٟ��� o�gw˺�cgx���-v1U"ܟa�q����M=�B��I��kF���z@v��=]Fiw�5x�M�OX�p��~���P�Jǝ5��C�-�$74�����R�Tf�C:�ɗ.�%�!���l�cI�i�Ar�����9"co^`TM�7�\�f��T�CB>k����L>��EfN�N~\�%p�F�/8�&���4� #��%��:ߤ\#��	�-��g�1�b�G�M����*ѿBM\m��}�QU�y��g�s��ޒ@4���E���ή`x�|i�q]کX,B�N��߄�3�7i���TU(?�n         !�����p������I��Kީ�u
J]oU�[M�)��c���ҿ1X�C��JuA����\���w|԰���L�zvk�t��+_��"��ҿe�����,L ���+վ|��Fdm��_M��S&1t��װ��瓧�Y�������v��7J�J�h ;((�
�X@ �/3�LKZؘY �\R�D�����//	VY���N���p���z��ʟ~&8WW[F��[��D��J@c�@�����SB�1�{ �� 5����'9�o�������_V{����X�§3 z�氰̀�}�yr��:��Aߐh��7:fѠ�B+�C�~q��Y�~�S�D_[��|�D�
��^����b���8  A�KDߜr�B�A*m� ��÷k$:��洛�Qt�(GG�f�+cx���ۋ�P��F֟��H��rm��z�p�w��1���)�p��2�1��w���A�޽�Y�ܧ03$̗����z*���>k��`�e���<1}������fn�J*]�\��J<\���\�BU$� {�fi rtϪ�Rcx� ��l�QnLn�0���<c9���+6�4�����6�$���)R1�{�H���	C"����ϼ���e�V���0le�"��k�`s�U �������1�|p�����/%�(ԯ� m��$P�����w�Rb�B,&�!�Co�W'�\z`c+7[5C<pn΀��b(��i���Ҍ��t�Vᰔ�P{�Q: �Q�G ��Ye�Y��Pہ,�<yv^������v�o��ģ��B�ͫ�y���W���݉��2b�>��vcT�ߏ�T��@�Y���Q*΄��NHO-������;0�v.Z�����I��q��KZ��2N!��
�g��ȡ�s�J)0�����zsH��i��/�T��>*�t7�B�NR$̫�hqժe63Q[�UyanT����n��6Uj��#ūi��}:��[X��/�MIZ�;M�p,����(9x%!΃�F�?چoVC��l�h#�݄�y��S;�|F�@􆓪��y-���<	]��ϫ�/s�g���{ғί^ĭ2�.BjW���h �n]��RCV-:�w<<���<v�>y�I�G���\��tx�\䩽�{��NR�TK���S�`�l����x�-|G�(3(2����ԌJ�{�i�&+�͐�7#|�Ve��-H+��} 5EI������~�4;�m�|c���h�?Wf0�A?�GVz��@]8С��
�m��c�"0��v,l��kI	�q���Vk{�u[�߉KK珹�UgM>�i� r!���{Q�y�]#�
ꉨ*,aL��7�A��R�^��͊,"8"�K)�o��r��=�z�j>_��q@&2����
�?��-�&���y��0w9���XiX?���;��D�h몯�֟t �����jx��'�N��&�y�6����>��� �a���6R��f��@z�EB�i�'��\���Q��:��hl���K�T�?:Mg�@Ϻd�}��q���'�M�`]����X�bW�C���ir�Z�`
]�Ĉ9�[�5��\W� ��"4���t�v�9`5��R��8����W���"�O'J㡆�R�x�dy���e�6E�+&2�H|� ������2���!<8	/o�z^�t���a�����Sc���5�'�S�r�Aͯ��B����Lg;��l��GIxk����"�ohdҴ�Y�W,���.��zz%O���,T5i��۟�8�R]�,�e�:�������=�)s�
��$�j}1���P�2ɖ������`��)I�X:Z.=����+��R�D5���Jb=�\����0�1������|O.n��nAA�����Y�����MO (�B��p��*��h�"���"��B_es�ivBYBx�T��ǆ-NoW͞M��S��������<��_�-���cW�
�#GyW`���]��yi���P���MĲiq�b1�:rt�g�_U��&,�j����鲗��b
��f��v� �q�W�#z[J�9��JW�;Vq�O�1�b9(?����q�/�VuKZ���L@����Rcϱ~p̈�hv:Eׄ���� �x�}���(D�'O��f�밃j���5rP��� �Q"e�i]pN�
������t�]PޯY%r���XRͤ��g��J�-�#�ι�m��sK�ߓj�u��%�9�/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import {
  Asset,
  Chunk,
  Compilation,
  ModuleFilenameHelpers,
  WebpackError,
} from 'webpack';
import {transformManifest} from 'workbox-build/build/lib/transform-manifest';

import {
  WebpackGenerateSWOptions,
  WebpackInjectManifestOptions,
  ManifestEntry,
  FileDetails,
} from 'workbox-build';
import {getAssetHash} from './get-asset-hash';
import {resolveWebpackURL} from './resolve-webpack-url';

/**
 * For a given asset, checks whether at least one of the conditions matches.
 *
 * @param {Asset} asset The webpack asset in question. This will be passed
 * to any functions that are listed as conditions.
 * @param {Compilation} compilation The webpack compilation. This will be passed
 * to any functions that are listed as conditions.
 * @param {Array<string|RegExp|Function>} conditions
 * @return {boolean} Whether or not at least one condition matches.
 * @private
 */
function checkConditions(
  asset: Asset,
  compilation: Compilation,

  conditions: Array<
    //eslint-disable-next-line @typescript-eslint/ban-types
    string | RegExp | ((arg0: any) => boolean)
  > = [],
): boolean {
  for (const condition of conditions) {
    if (typeof condition === 'function') {
      return condition({asset, compilation});
      //return compilation !== null;
    } else {
      if (ModuleFilenameHelpers.matchPart(asset.name, condition)) {
        return true;
      }
    }
  }

  // We'll only get here if none of the conditions applied.
  return false;
}

/**
 * Returns the names of all the assets in all the chunks in a chunk group,
 * if provided a chunk group name.
 * Otherwise, if provided a chunk name, return all the assets in that chunk.
 * Otherwise, if there isn't a chunk group or chunk with that name, return null.
 *
 * @param {Compilation} compilation
 * @param {string} chunkOrGroup
 * @return {Array<string>|null}
 * @private
 */
function getNamesOfAssetsInChunkOrGroup(
  compilation: Compilation,
  chunkOrGroup: string,
): Array<string> | null {
  const chunkGroup =
    compilation.namedChunkGroups &&
    compilation.namedChunkGroups.get(chunkOrGroup);
  if (chunkGroup) {
    const assetNames = [];
    for (const chunk of chunkGroup.chunks) {
      assetNames.push(...getNamesOfAssetsInChunk(chunk));
    }
    return assetNames;
  } else {
    const chunk =
      compilation.namedChunks && compilation.namedChunks.get(chunkOrGroup);
    if (chunk) {
      return getNamesOfAssetsInChunk(chunk);
    }
  }

  // If we get here, there's no chunkGroup or chunk with that name.
  return null;
}

/**
 * Returns the names of all the assets in a chunk.
 *
 * @param {Chunk} chunk
 * @return {Array<string>}
 * @private
 */
function getNamesOfAssetsInChunk(chunk: Chunk): Array<string> {
  const assetNames: Array<string> = [];

  assetNames.push(...chunk.files);

  // This only appears to be set in webpack v5.
  if (chunk.auxiliaryFiles) {
    assetNames.push(...chunk.auxiliaryFiles);
  }

  return assetNames;
}

/**
 * Filters the set of assets out, based on the configuration options provided:
 * - chunks and excludeChunks, for chunkName-based criteria.
 * - include and exclude, for more general criteria.
 *
 * @param {Compilation} compilation The webpack compilation.
 * @param {Object} config The validated configuration, obtained from the plugin.
 * @return {Set<Asset>} The assets that should be included in the manifest,
 * based on the criteria provided.
 * @private
 */
function filterAssets(
  compilation: Compilation,
  config: WebpackInjectManifestOptions | WebpackGenerateSWOptions,
): Set<Asset> {
  const filteredAssets = new Set<Asset>();
  const assets = compilation.getAssets();

  const allowedAssetNames = new Set<string>();
  // See https://github.com/GoogleChrome/workbox/issues/1287
  if (Array.isArray(config.chunks)) {
    for (const name of config.chunks) {
      // See https://github.com/GoogleChrome/workbox/issues/2717
      const assetsInChunkOrGroup = getNamesOfAssetsInChunkOrGroup(
        compilation,
        name,
      );
      if (assetsInChunkOrGroup) {
        for (const assetName of assetsInChunkOrGroup) {
          allowedAssetNames.add(assetName);
        }
      } else {
        compilation.warnings.push(
          new Error(
            `The chunk '${name}' was ` +
              `provided in your Workbox chunks config, but was not found in the ` +
              `compilation.`,
          ) as WebpackError,
        );
      }
    }
  }

  const deniedAssetNames = new Set();
  if (Array.isArray(config.excludeChunks)) {
    for (const name of config.excludeChunks) {
      // See https://github.com/GoogleChrome/workbox/issues/2717
      const assetsInChunkOrGroup = getNamesOfAssetsInChunkOrGroup(
        compilation,
        name,
      );
      if (assetsInChunkOrGroup) {
        for (const assetName of assetsInChunkOrGroup) {
          deniedAssetNames.add(assetName);
        }
      } // Don't warn if the chunk group isn't found.
    }
  }

  for (const asset of assets) {
    // chunk based filtering is funky because:
    // - Each asset might belong to one or more chunks.
    // - If *any* of those chunk names match our config.excludeChunks,
    //   then we skip that asset.
    // - If the config.chunks is defined *and* there's no match
    //   between at least one of the chunkNames and one entry, then
    //   we skip that assets as well.

    if (deniedAssetNames.has(asset.name)) {
      continue;
    }

    if (Array.isArray(config.chunks) && !allowedAssetNames.has(asset.name)) {
      continue;
    }

    // Next, check asset-level checks via includes/excludes:
    const isExcluded = checkConditions(asset, compilation, config.exclude);
    if (isExcluded) {
      continue;
    }

    // Treat an empty config.includes as an implicit inclusion.
    const isIncluded =
      !Array.isArray(config.include) ||
      checkConditions(asset, compilation, config.include);
    if (!isIncluded) {
      continue;
    }

    // If we've gotten this far, then add the asset.
    filteredAssets.add(asset);
  }

  return filteredAssets;
}

export async function getManifestEntriesFromCompilation(
  compilation: Compilation,
  config: WebpackGenerateSWOptions | WebpackInjectManifestOptions,
): Promise<{size: number; sortedEntries: ManifestEntry[]}> {
  const filteredAssets = filterAssets(compilation, config);

  const {publicPath} = compilation.options.output;

  const fileDetails = Array.from(filteredAssets).map((asset) => {
    return {
      file: resolveWebpackURL(publicPath as string, asset.name),
      hash: getAssetHash(asset),
      size: asset.source.size() || 0,
    } as FileDetails;
  });

  const {manifestEntries, size, warnings} = await transformManifest({
    fileDetails,
    additionalManifestEntries: config.additionalManifestEntries,
    dontCacheBustURLsMatching: config.dontCacheBustURLsMatching,
    manifestTransforms: config.manifestTransforms,
    maximumFileSizeToCacheInBytes: config.maximumFileSizeToCacheInBytes,
    modifyURLPrefix: config.modifyURLPrefix,
    transformParam: compilation,
  });

  // See https://github.com/GoogleChrome/workbox/issues/2790
  for (const warning of warnings) {
    compilation.warnings.push(new Error(warning) as WebpackError);
  }

  // Ensure that the entries are properly sorted by URL.
  const sortedEntries = manifestEntries.sort((a, b) =>
    a.url === b.url ? 0 : a.url > b.url ? 1 : -1,
  );

  return {size, sortedEntries};
}
                                                                    I�ނ� �O�$��pV�}K"p�R�܌!��������nZ��j��5ѓ^���yn� �_�F��@@�R�B�o��x�l���y�G���������$O�����}�����W]�����ٟ���D!Eem�&�ﳺ ƍv�O�  �ƐZ�a�v�p����~��j�y�0���QZ�D���V!�;���6W#��}=�^��I�r�l'[�4�x���	jEo��L9v�x���D�Z5�r�ʹH��Y������c\��eN�?Vl���Ɔʠ�#�>c��@=I=X�����&�{��+���!�WjU��譑�G��ΉL��>��hǶ�ã�e5?fz�{-�.�d�a觪��m݋D`�PY�8b0�k̯��0���۬�7j옕���`asj+t�}���y�kѽO�W��]af�ڡrs���9����5�v{���Z��[��#-_�k�K�#fA������=�:kU������P�ƿ�{�N9����ҫ���wӐ� �U·��fh�5$��;1���V��J%?�Qˁ�}zyq�T�ne\�.��k ��8���l���R�|�JC�%�״LŐj�ҫ�;���3녃h�{�(���������x�%ES�G��u��7�R�A�z��H�v+�Nci�R�*p�ϥ~�(�I���z��c�)y�^q��V��T|aO�ނ-^RN����x�@c���ө��Q�7�B��B��ː�W����]��ƶw�����&��0��{m�q��}M�
�ލ1mI����y�Ǩ��z�����*ʻ��u+_(S����T��N$�0:9�_�"Ԃ��w�6ʈ*{�Q��B4h�6���T�tc�}�����! T��U̕�9(��
'+���P�$ns�
sU��}��It'uv,ߢ�"lO��Z��oik���I��Y[{,9Ny�a8?��W".25���A�n��|��P�H^���J�\k�q&s o�{�^�wA��*t^S�[���넗��탌5�@�j N	�	O��4��p�и%�՛�µ�}gm�%5�/�N�����q�r ����q�����Y�\�\���ܜ'�^���N��;a�%�/.��ih_F \˗I��{���߱�c4����=��s�K��ڰQHҿ̞'�����ヽm�"�7�|My���g��������7(��o��)k�V\<0,#��z�o]����`R�ʠ5��
���6}b��/���\�%+�ϧ�A���mh �%��)�DD�!P��������I���ЍK��D���#�*bA�'?uq��І��F$Wun��7-yV;=��pC�κg��j�#�ʇ�R�vɨ)����ú��	�� ,�Y�c�3��J��&Ę[���3̊eH3֎1Ϲ/ (^M�cW,�����^���|��*��e��H�[\ag꿽7������;������xd=�>�������1K������C��?��� �fo��R�yi���e�~-��Ͳ(�C>Ԑ�,� ���W0kt8�r��t�e�����bT����F�t&_���ԙ|���<PK�$hb=�o盄^b�A�K�E�br�U�~fXV@VY����q��Rz�����_��O��|�+*����D5��4�@2���_,SC���(^�c}��';$�e��)�ʠ�w�>�o��z)Ja����V~��+�`$��i9�Pd�Z�%1=A;`��@>�|G����U�i�a}�k4���˕Oa��E�˻�f�{�uі�KY$S�-�b��%�9��Ѩ�~ϊ�$<OC.�������|���z�0�y�x�����@Qr-3'n�`�ht�	sCu��Fn�@C^(ޜA~�t�	��]Jj�(��wh�g'�ӵ�33E��,�G����i��ce��j;{�;��Q��q�c!�� " �ԩCp7�0���g
L���2m�Q`�Rt�텁�w��`�Hv�?��h����Q�αQ$�+'�����ǁ%�XS>�
DqA`i��F��dG�#>u\N"�[�s�"�ɦm�ɋ�Ƕk/��Wn�^І�� =�͵��k9�~��K�x�s"�b�M��B�ϒ��7���
咄�4W��wb!��V�	�a��z�51�ֻ���7|l"%7�&7V���^��/�E���_B�>g���ֆ�5��1q0������I;c�T4E�Gf�_�9�c�?���iD[M��bk}�O��fQ�!kUH��е��'b�C�ϼ�I��u��&�.6�>��>d붤��$l�r�����fg�Ht���D̰uV����b6�N�f'qI.�;,���E^]s�:"��F�RB�Jf������w����:4�&i�U`N�7*��S�ʓ-[��|XNpYx��Y��'I�cį]E�4��z�e�~Тt�3��Jo�B�9%qv�&��h�Er:��=���P�x,*b"������og�j�_S��:�K{tV�����c�?�3˕ݻ]��dQ�0tW&�.9�"�wm��(u/H��S��@�6;�����)��K��N�Q�%�}�������/ce����~C�J�ƚ@�P���C]hM�јF����>��Pα{OR��%B�מ����_��n򝾋C��&a���%��Jdru�PQ�u�Z�3�s����'��j�����;dJ��[��ں�ү#�$��H�>[u%����i8b��CO#�'����JAѻ�8��>[c~���~a�����~HÌ�#���#�z�	Brۺ!�E�Ye��Yȳ@g�#;n!�Q ���OBa��2�\���6��+5��J���x��KX�Y;+ه��&m�n5h�2�
�g��}mfS�����Wu�@�7�d�+�g�	獯���@��6p��?�'9��b�7�^/����/����!bq}��3qVj'�� ��r������݆�Z���T��tЀg[t�#��c��T�m��-��(�a��h<��H�M  D������<Uϐ���E;�z+�`�"@,00�cE���vث���],���I���m#�N5<�CX�.�<��HD���k-TH�Uc�"���  ��� �B�u�(��GW�"�~0[�i��	p���=��BA�D���"<Q_�j��t�3�ŚF�TH7�@�a(�=�7(�6�b�e�@�ʧfif��ܣ����ܣ�^[8��+5�{A�<x�nȯ���¸56u.7����R��
Bh�cB�$���ͱ	�6w}���`R�V�2��((����\d=��O3-;��=p?�Ku��GC��A��2��;�yk����G�+��r!�Z"F�����R��|�	N��r�˹�����<8PC��l�CP�/�:�ζ8�hO&���2+�'籁Uј���j���HC��8WJ��Ǫ&��O]JE%.l�G��^�1_m��)r�m��kpdօ�2$�~�̽���:�i�_s|Q���G�s'�O�B�<��'o��� �oE����)S&���H䭰<�T�J~]�^t���'S֦��?F��U�>rr-ŵȓG
��xQ���K�;�!؈o�dpߪϼ�h-v$}���7���*D�>t�%M���� ���BB@���ޓ�f��&����<�~M���2�"��x��43���D��`�!ғ�+�4
2'ߛ��a�1'(���hV���b�v��$3�.��z��R��m��e�ar����v�#�J&�4`c�<��Y(�oz'���?����%/f�w�oEQ�n�+�,�}�6�vץ���ƨM!�[p��#8*�4�zZ��'nI�����;�&��M����}E��@�:n�]�۴��������L9%dL�mPl�j��\�ZhT !�K[H1^����5��h�>+���5I��ޱF.���[���P��u	�=D>��U�z
�L�����}�»���̟3�V�xnI/���\� �6���_�VR\Έ�XC�gߠ"�m�UEPԨ��7`�G���d�]��&�S�p����n����@������pA�v8u���h�$�0c��q;Bd�2[2�4��vo���%����i�"�H9�LlZ�/�Z�o��3�y��-�X�s�R�Ca͵j��VΗ��r�r�ӈ���#Yb�/o��?��s��n�ܜ���5i������ k����BuS5V/���W�!���L�$	�575z�Ԩ1��{��#�tV�X-�s���a���@�1^p��h���M�%a�T�5���~4hP�
�ձd�]��:X����1�b�Y@޼�P�.��1[T��D�/k@4C��d*�%�9��?%���u���/��:fE�;+��9�G;�>��)hX��K&��V����`��m�A�Vܒ�|�#�^G�
ǘ�ܝ�S�l^�=K����+������M�]�h������D|�B����9��D1�p�3�Y�~�)����" ���J�0=^��@����Q�H:��g�Y��QxH�vv�M̭Xc��4��^	64�����H�l�崩��F�^��5/-)]@6��C��`17��!��zz��z�2+W~V�p�S��S�-�o����&{���'9��r-	�A��.W��Ve{�6��p��͊i�]߳=�
ɨ��=��A�E{[DG�Q�D�g��d���s&=�Xҕ���Ӗ��Mb户�ʛ�����AfA1*d&%����=��!M��Y
숙&m��nh�2p�՞"`$&A6��3yr����Ɖ��U��8ǈT��5sI9��2I��v�x���\\}�,�X���F��(0���[�w��OQ[֖m�8�� �+o�*$��ιPgL\�K(sϒ��?jY_殧�|��<87�����o|F[O����	|����@7< �)��#�W�)'zq�!�+�MHhE�g��;+LqZ��<��L�D�mW
��4IGl]���G{
�YX��TDNz-l��0sQ�㟰7��s�i�a�u��w����D���A�Jb����=�mM��-�g������9r�E��mL�����qM�Vtr.�d��@(�<_��eC���q�����.�34��b�7�����fȝ��Y���-�z�Wx�\�0h��AԼz���j;��N�4��Y��V�Y7�
������nT�D��|T� g�>��S�&��J���skGč-ޖ�Fߤ�ΎK�����:�y3�O%���n���Wse�T�8t8J'��	Z�Rݢ�ۊ&�n-���+��V�&Vf����U�lW��2����&�qh�8���?.�+�N��n���9�����Ð�A��c�N�J�� `��t��K�:{E#��T.�n�s�4�4�ܗh�X1��Iq�0wy܋��d{����K[QY��`�1,�[tY69�����R���oh�j��l�W-D��C'L���u�_{� �Zz�ffC 8�p�����{���'�/��8����d��A#`���I�ퟏ���s�'M�w.p�״�4�%�P�Z&R��֬��v	�O�uU/��VY4��rW
�"~=�<���tP�>R�s��Ҵ	��h/w��&��@��K���;��.e�H����_}nӕ̫��Uk}IQCIష�������K{B"*ޭU���o��hN�q����A�Q%sy�\�kY|����҉�{���s�W���?����8��2�
���A��
�y{�����!n �w�eN�ڝC�����ߏUf��Lf�k FYt��،�zT`��ў)��c9	����f�M����BvYsv	6��W"������/��u���u�X{�f����R�ʘ		���`l&�.A�H�"irϕ]r�x�z ��G�&�h�!�8�������2������+�Ӥ�$BNy���(��4\�/�L����-��oy��)q��De�J���               A�K$�T9A�j�R�߈��V@C��.t�jeک�M����Vu\�����J��I���c�vt�Q�0��/Ə�n�eYκj��p�^���3����:��e�,� ���	�n�%��(O��h���W���!)����F)��?���:rC]�">��j��Kv(g�z����jr��ӧ�A��W��:,���C�[�ЂI;�uu�X�ٳ��h�8�>0H���c�J_9�iJm�����rp!H~>�>��+%k��$r����VEc�8X)�ӗ�<����A�n"E+X�b��g	��}���&R"���	'^U��f�Qvs#�x��3�&�P�o�,�E �ȇ:;�Ա��k���Y�m��ʈ����ۅK�!$z�J���#r�W2n8^��y�%�_���ц�V�K6�'R:(3�N$���(X�5�h{���󍬭C�Z-ھ'�Ĉȯ%�>ቸ��H|�:9���"���R�z9!q�g� zV
�J��w�1�u��@$R��N4�nH?L�h���m���S��5q�]�ı�Z����Ƙ�k�C �~�~I�0!)�n�Sܠ�y�܋���4�v�aZՉ�v�f����v�5q�k� ƒ}׾���Qf��[n���`D���\n{h����mu��������T�����a2���߬z�����+���KEw�fU��!�Έ�Z��Os��&�
��:� @�;H��� �ڭR�{�����=�o��������.goc�s~΅J���h^�����!��8�[V5����h`�ֶ��ʓ��G�2��� #d�g
{�ls�ό�ݤQ�����u��p���b�>�E%��b��I��#nA��)"y���0j����N�'����Ѩ	��.a �+c{/�BϞ %�iˮ'���8Z\�5�n1�H�TP�b�'�c_�'��`|�,��,������L���%E��Z{U���uM���w������I����G�M$3.�c~�@���Oh����k)�S����6CgN��Q=��a���:E��^!�p ����ח�l���=��>=�t�^��_�M�h��(�P���jz���U�菶����Fr�|�U�
������3-K ��n*�r7 �cDE��VG?ٍZ��|����=��7��G�k��w��N�ۂ�˖X�{>�A����I5Y��]����Y�W?��,J��D�?"�@�z�+t�K|�+��U���; ���`��v3E�K#K��1I�Z�(�U%v;�i��j�H�%pQ�է*iҤ
�Na�'9[t{�^QNHD`�h�h9�(/sJ>v�m	@䜚�$�09r�A,`T�m{�oִͮ[��h�W;�dQ����(��]������9d�K<���8��Osb���	�O�p
����”���&|{H:E����OQcT�5�=����N�B�7>�g�zGq�ޭ�xK��`�+���m*�Ë���_g/5����������O�E��rT�;5�sN��}�td����tDCҢ���;ִ��sL����PO&0�W�p�M��6��"nD�ș_Җ�!v�I�Rֶϭ����cƪ �FI	%«���=s��Փ.�2�0��㈎Oy(cѰ^C�@LGC?��6I9%�����g�%>1XW@R�C��d��9VDM��*hC� ���V�����L��6>�3��;�"`@�֧�IH'_:R�|)[	�So���x�^Co1�y_x�t�`����ɰ�`Q�i�_Y�*���
Uy��D����S���X�%�'�ؗ�KJf4�:8�t7B�=}#G����eZ�,�|�`�Yp#ng
	��v�S��(ܨ=z�? �D�QomM�7��T�Bgu�v�6�ϺG�9���{eG�9|����ZW/�Qۈ%��d�� I����p�H3|R�@��y�d8�OJڜ�w�^*~�-��Su��8���+�LE^�nTB*KH �*M,�^�p��ߖ�R'f�q�S^��!��徵Jf��w:z�(����Z��0"���s�jړ~�fhMZy�&�ҹ�;����Q0ߠ�b�~ܲ�XOq�h�# �p��Q�T*t�#!���z��Z햿���1}W��V�i6gG+�mʧ�Ї{��&�]{Z�h���)]6Hx�⸔&�-^'�p��&�\&�z"��ӵT^vt���$N?�)��9 �HP��j ��M?�X� ��r��Σf��"�d����gʮ�_],ы���)�&�z���v��ȗ���T� �lv��ƫ���]}|�g�����D�y�4I�U�9�`F���w�P���
�3�A"��`��y�S�F7�߹c��z�E�ï�܉��xjP����
X��A����_���If9]c��}=^�F^X�����E�R�|45ҭ��b�U����E9�$�ۢT���Sp)sC�r�naMWx��T�֥�g�ש�˅��F�?ucЎ�y�,�V�E��qZ�(x��*W���~Y��ttd$��:�yZOo�� Ⱥ� ���ܾ���sF%d�
���imhE���e-^�42�$q�6��-)Td�u���t��:��y�	f5��K�뤇"s�;���@����<S�y.��r���طxg���-ma.minProperties && schema.minProperties > 1 ? "properties" : "property"}`);
      }

      if (schema.patternProperties && Object.keys(schema.patternProperties).length > 0) {
        const patternProperties = Object.keys(schema.patternProperties);
        hints.push(`additional property names should match pattern${patternProperties.length > 1 ? "s" : ""} ${patternProperties.map(pattern => JSON.stringify(pattern)).join(" | ")}`);
      }

      const properties = schema.properties ? Object.keys(schema.properties) : [];
      const required = schema.required ? schema.required : [];
      const allProperties = [...new Set(
      /** @type {Array<string>} */
      [].concat(required).concat(properties))];
      const objectStructure = allProperties.map(property => {
        const isRequired = required.includes(property); // Some properties need quotes, maybe we should add check
        // Maybe we should output type of property (`foo: string`), but it is looks very unreadable

        return `${property}${isRequired ? "" : "?"}`;
      }).concat(typeof schema.additionalProperties === "undefined" || Boolean(schema.additionalProperties) ? schema.additionalProperties && isObject(schema.additionalProperties) ? [`<key>: ${formatInnerSchema(schema.additionalProperties)}`] : ["…"] : []).join(", ");
      const {
        dependencies,
        propertyNames,
        patternRequired
      } =
      /** @type {Schema & {patternRequired?: Array<string>;}} */
      schema;

      if (dependencies) {
        Object.keys(dependencies).forEach(dependencyName => {
          const dependency = dependencies[dependencyName];

          if (Array.isArray(dependency)) {
            hints.push(`should have ${dependency.length > 1 ? "properties" : "property"} ${dependency.map(dep => `'${dep}'`).join(", ")} when property '${dependencyName}' is present`);
          } else {
            hints.push(`should be valid according to the schema ${formatInnerSchema(dependency)} when property '${dependencyName}' is present`);
          }
        });
      }

      if (propertyNames && Object.keys(propertyNames).length > 0) {
        hints.push(`each property name should match format ${JSON.stringify(schema.propertyNames.format)}`);
      }

      if (patternRequired && patternRequired.length > 0) {
        hints.push(`should have property matching pattern ${patternRequired.map(
        /**
         * @param {string} item
         * @returns {string}
         */
        item => JSON.stringify(item))}`);
      }

      return `object {${objectStructure ? ` ${objectStructure} ` : ""}}${hints.length > 0 ? ` (${hints.join(", ")})` : ""}`;
    }

    if (likeNull(schema)) {
      return `${logic ? "" : "non-"}null`;
    }

    if (Array.isArray(schema.type)) {
      // not logic already applied in formatValidationError
      return `${schema.type.join(" | ")}`;
    } // Fallback for unknown keywords
    // not logic already applied in formatValidationError

    /* istanbul ignore next */


    return JSON.stringify(schema, null, 2);
  }
  /**
   * @param {Schema=} schemaPart
   * @param {(boolean | Array<string>)=} additionalPath
   * @param {boolean=} needDot
   * @param {boolean=} logic
   * @returns {string}
   */


  getSchemaPartText(schemaPart, additionalPath, needDot = false, logic = true) {
    if (!schemaPart) {
      return "";
    }

    if (Array.isArray(additionalPath)) {
      for (let i = 0; i < additionalPath.length; i++) {
        /** @type {Schema | undefined} */
        const inner = schemaPart[
        /** @type {keyof Schema} */
        additionalPath[i]];

        if (inner) {
          // eslint-disable-next-line no-param-reassign
          schemaPart = inner;
        } else {
          break;
        }
      }
    }

    while (schemaPart.$ref) {
      // eslint-disable-next-line no-param-reassign
      schemaPart = this.getSchemaPart(schemaPart.$ref);
    }

    let schemaText = `${this.formatSchema(schemaPart, logic)}${needDot ? "." : ""}`;

    if (schemaPart.description) {
      schemaText += `\n-> ${schemaPart.description}`;
    }

    if (schemaPart.link) {
      schemaText += `\n-> Read more at ${schemaPart.link}`;
    }

    return schemaText;
  }
  /**
   * @param {Schema=} schemaPart
   * @returns {string}
   */


  getSchemaPartDescription(schemaPart) {
    if (!schemaPart) {
      return "";
    }

    while (schemaPart.$ref) {
      // eslint-disable-next-line no-param-reassign
      schemaPart = this.getSchemaPart(schemaPart.$ref);
    }

    let schemaText = "";

    if (schemaPart.description) {
      schemaText += `\n-> ${schemaPart.description}`;
    }

    if (schemaPart.link) {
      schemaText += `\n-> Read more at ${schemaPart.link}`;
    }

    return schemaText;
  }
  /**
   * @param {SchemaUtilErrorObject} error
   * @returns {string}
   */


  formatValidationError(error) {
    const {
      keyword,
      dataPath: errorDataPath
    } = error;
    const dataPath = `${this.baseDataPath}${errorDataPath}`;

    switch (keyword) {
      case "type":
        {
          const {
            parentSchema,
            params
          } = error; // eslint-disable-next-line default-case

          switch (
          /** @type {import("ajv").TypeParams} */
          params.type) {
            case "number":
              return `${dataPath} should be a ${this.getSchemaPartText(parentSchema, false, true)}`;

            case "integer":
              return `${dataPath} should be an ${this.getSchemaPartText(parentSchema, false, true)}`;

            case "string":
              return `${dataPath} should be a ${this.getSchemaPartText(parentSchema, false, true)}`;

            case "boolean":
              return `${dataPath} should be a ${this.getSchemaPartText(parentSchema, false, true)}`;

            case "array":
              return `${dataPath} should be an array:\n${this.getSchemaPartText(parentSchema)}`;

            case "object":
              return `${dataPath} should be an object:\n${this.getSchemaPartText(parentSchema)}`;

            case "null":
              return `${dataPath} should be a ${this.getSchemaPartText(parentSchema, false, true)}`;

            default:
              return `${dataPath} should be:\n${this.getSchemaPartText(parentSchema)}`;
          }
        }

      case "instanceof":
        {
          const {
            parentSchema
          } = error;
          return `${dataPath} should be an instance of ${this.getSchemaPartText(parentSchema, false, true)}`;
        }

      case "pattern":
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            pattern
          } =
          /** @type {import("ajv").PatternParams} */
          params;
          return `${dataPath} should match pattern ${JSON.stringify(pattern)}${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case "format":
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            format
          } =
          /** @type {import("ajv").FormatParams} */
          params;
          return `${dataPath} should match format ${JSON.stringify(format)}${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case "formatMinimum":
      case "formatMaximum":
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            comparison,
            limit
          } =
          /** @type {import("ajv").ComparisonParams} */
          params;
          return `${dataPath} should be ${comparison} ${JSON.stringify(limit)}${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case "minimum":
      case "maximum":
      case "exclusiveMinimum":
      case "exclusiveMaximum":
        {
          const {
            parentSchema,
            params
          } = error;
          const {
            comparison,
            limit
          } =
          /** @type {import("ajv").ComparisonParams} */
          params;
          const [, ...hints] = getHints(
          /** @type {Schema} */
          parentSchema, true);

          if (hints.length === 0) {
            hints.push(`should be ${comparison} ${limit}`);
          }

          return `${dataPath} ${hints.join(" ")}${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case "multipleOf":
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            multipleOf
          } =
          /** @type {import("ajv").MultipleOfParams} */
          params;
          return `${dataPath} should be multiple of ${multipleOf}${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case "patternRequired":
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            missingPattern
          } =
          /** @type {import("ajv").PatternRequiredParams} */
          params;
          return `${dataPath} should have property matching pattern ${JSON.stringify(missingPattern)}${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case "minLength":
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            limit
          } =
          /** @type {import("ajv").LimitParams} */
          params;

          if (limit === 1) {
            return `${dataPath} should be a non-empty string${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
          }

          const length = limit - 1;
          return `${dataPath} should be longer than ${length} character${length > 1 ? "s" : ""}${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case "minItems":
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            limit
          } =
          /** @type {import("ajv").LimitParams} */
          params;

          if (limit === 1) {
            return `${dataPath} should be a non-empty array${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
          }

          return `${dataPath} should not have fewer than ${limit} items${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case "minProperties":
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            limit
          } =
          /** @type {import("ajv").LimitParams} */
          params;

          if (limit === 1) {
            return `${dataPath} should be a non-empty object${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
          }

          return `${dataPath} should not have fewer than ${limit} properties${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case "maxLength":
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            limit
          } =
          /** @type {import("ajv").LimitParams} */
          params;
          const max = limit + 1;
          return `${dataPath} should be shorter than ${max} character${max > 1 ? "s" : ""}${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case "maxItems":
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            limit
          } =
          /** @type {import("ajv").LimitParams} */
          params;
          return `${dataPath} should not have more than ${limit} items${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case "maxProperties":
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            limit
          } =
          /** @type {import("ajv").LimitParams} */
          params;
          return `${dataPath} should not have more than ${limit} properties${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case "uniqueItems":
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            i
          } =
          /** @type {import("ajv").UniqueItemsParams} */
          params;
          return `${dataPath} should not contain the item '${error.data[i]}' twice${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case "additionalItems":
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            limit
          } =
          /** @type {import("ajv").LimitParams} */
          params;
          return `${dataPath} should not have more than ${limit} items${getSchemaNonTypes(parentSchema)}. These items are valid:\n${this.getSchemaPartText(parentSchema)}`;
        }

      case "contains":
        {
          const {
            parentSchema
          } = error;
          return `${dataPath} should contains at least one ${this.getSchemaPartText(parentSchema, ["contains"])} item${getSchemaNonTypes(parentSchema)}.`;
        }

      case "required":
        {
          const {
            parentSchema,
            params
          } = error;
          const missingProperty =
          /** @type {import("ajv").DependenciesParams} */
          params.missingProperty.replace(/^\./, "");
          const hasProperty = parentSchema && Boolean(
          /** @type {Schema} */
          parentSchema.properties &&
          /** @type {Schema} */
          parentSchema.properties[missingProperty]);
          return `${dataPath} misses the property '${missingProperty}'${getSchemaNonTypes(parentSchema)}.${hasProperty ? ` Should be:\n${this.getSchemaPartText(parentSchema, ["properties", missingProperty])}` : this.getSchemaPartDescription(parentSchema)}`;
        }

      case "additionalProperties":
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            additionalProperty
          } =
          /** @type {import("ajv").AdditionalPropertiesParams} */
          params;
          return `${dataPath} has an unknown property '${additionalProperty}'${getSchemaNonTypes(parentSchema)}. These properties are valid:\n${this.getSchemaPartText(parentSchema)}`;
        }

      case "dependencies":
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            property,
            deps
          } =
          /** @type {import("ajv").DependenciesParams} */
          params;
          const dependencies = deps.split(",").map(
          /**
           * @param {string} dep
           * @returns {string}
           */
          dep => `'${dep.trim()}'`).join(", ");
          return `${dataPath} should have properties ${dependencies} when property '${property}' is present${getSchemaNonTypes(parentSchema)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case "propertyNames":
        {
          const {
            params,
            parentSchema,
            schema
          } = error;
          const {
            propertyName
          } =
          /** @type {import("ajv").PropertyNamesParams} */
          params;
          return `${dataPath} property name '${propertyName}' is invalid${getSchemaNonTypes(parentSchema)}. Property names should be match format ${JSON.stringify(schema.format)}.${this.getSchemaPartDescription(parentSchema)}`;
        }

      case "enum":
        {
          const {
            parentSchema
          } = error;

          if (parentSchema &&
          /** @type {Schema} */
          parentSchema.enum &&
          /** @type {Schema} */
          parentSchema.enum.length === 1) {
            return `${dataPath} should be ${this.getSchemaPartText(parentSchema, false, true)}`;
          }

          return `${dataPat ' } ';
    if ($breakOnError) {
      out += ' else { ';
    }
  } else {
    if ($breakOnError) {
      out += ' if (true) { ';
    }
  }
  return out;
}

},{}],38:[function(require,module,exports){
'use strict';
module.exports = function generate_validate(it, $keyword, $ruleType) {
  var out = '';
  var $async = it.schema.$async === true,
    $refKeywords = it.util.schemaHasRulesExcept(it.schema, it.RULES.all, '$ref'),
    $id = it.self._getId(it.schema);
  if (it.opts.strictKeywords) {
    var $unknownKwd = it.util.schemaUnknownRules(it.schema, it.RULES.keywords);
    if ($unknownKwd) {
      var $keywordsMsg = 'unknown keyword: ' + $unknownKwd;
      if (it.opts.strictKeywords === 'log') it.logger.warn($keywordsMsg);
      else throw new Error($keywordsMsg);
    }
  }
  if (it.isTop) {
    out += ' var validate = ';
    if ($async) {
      it.async = true;
      out += 'async ';
    }
    out += 'function(data, dataPath, parentData, parentDataProperty, rootData) { \'use strict\'; ';
    if ($id && (it.opts.sourceCode || it.opts.processCode)) {
      out += ' ' + ('/\*# sourceURL=' + $id + ' */') + ' ';
    }
  }
  if (typeof it.schema == 'boolean' || !($refKeywords || it.schema.$ref)) {
    var $keyword = 'false schema';
    var $lvl = it.level;
    var $dataLvl = it.dataLevel;
    var $schema = it.schema[$keyword];
    var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
    var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
    var $breakOnError = !it.opts.allErrors;
    var $errorKeyword;
    var $data = 'data' + ($dataLvl || '');
    var $valid = 'valid' + $lvl;
    if (it.schema === false) {
      if (it.isTop) {
        $breakOnError = true;
      } else {
        out += ' var ' + ($valid) + ' = false; ';
      }
      var $$outStack = $$outStack || [];
      $$outStack.push(out);
      out = ''; /* istanbul ignore else */
      if (it.createErrors !== false) {
        out += ' { keyword: \'' + ($errorKeyword || 'false schema') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: {} ';
        if (it.opts.messages !== false) {
          out += ' , message: \'boolean schema is false\' ';
        }
        if (it.opts.verbose) {
          out += ' , schema: false , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
        }
        out += ' } ';
      } else {
        out += ' {} ';
      }
      var __err = out;
      out = $$outStack.pop();
      if (!it.compositeRule && $breakOnError) {
        /* istanbul ignore if */
        if (it.async) {
          out += ' throw new ValidationError([' + (__err) + ']); ';
        } else {
          out += ' validate.errors = [' + (__err) + ']; return false; ';
        }
      } else {
        out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
      }
    } else {
      if (it.isTop) {
        if ($async) {
          out += ' return data; ';
        } else {
          out += ' validate.errors = null; return true; ';
        }
      } else {
        out += ' var ' + ($valid) + ' = true; ';
      }
    }
    if (it.isTop) {
      out += ' }; return validate; ';
    }
    return out;
  }
  if (it.isTop) {
    var $top = it.isTop,
      $lvl = it.level = 0,
      $dataLvl = it.dataLevel = 0,
      $data = 'data';
    it.rootId = it.resolve.fullPath(it.self._getId(it.root.schema));
    it.baseId = it.baseId || it.rootId;
    delete it.isTop;
    it.dataPathArr = [""];
    if (it.schema.default !== undefined && it.opts.useDefaults && it.opts.strictDefaults) {
      var $defaultMsg = 'default is ignored in the schema root';
      if (it.opts.strictDefaults === 'log') it.logger.warn($defaultMsg);
      else throw new Error($defaultMsg);
    }
    out += ' var vErrors = null; ';
    out += ' var errors = 0;     ';
    out += ' if (rootData === undefined) rootData = data; ';
  } else {
    var $lvl = it.level,
      $dataLvl = it.dataLevel,
      $data = 'data' + ($dataLvl || '');
    if ($id) it.baseId = it.resolve.url(it.baseId, $id);
    if ($async && !it.async) throw new Error('async schema in sync schema');
    out += ' var errs_' + ($lvl) + ' = errors;';
  }
  var $valid = 'valid' + $lvl,
    $breakOnError = !it.opts.allErrors,
    $closingBraces1 = '',
    $closingBraces2 = '';
  var $errorKeyword;
  var $typeSchema = it.schema.type,
    $typeIsArray = Array.isArray($typeSchema);
  if ($typeSchema && it.opts.nullable && it.schema.nullable === true) {
    if ($typeIsArray) {
      if ($typeSchema.indexOf('null') == -1) $typeSchema = $typeSchema.concat('null');
    } else if ($typeSchema != 'null') {
      $typeSchema = [$typeSchema, 'null'];
      $typeIsArray = true;
    }
  }
  if ($typeIsArray && $typeSchema.length == 1) {
    $typeSchema = $typeSchema[0];
    $typeIsArray = false;
  }
  if (it.schema.$ref && $refKeywords) {
    if (it.opts.extendRefs == 'fail') {
      throw new Error('$ref: validation keywords used in schema at path "' + it.errSchemaPath + '" (see option extendRefs)');
    } else if (it.opts.extendRefs !== true) {
      $refKeywords = false;
      it.logger.warn('$ref: keywords ignored in schema at path "' + it.errSchemaPath + '"');
    }
  }
  if (it.schema.$comment && it.opts.$comment) {
    out += ' ' + (it.RULES.all.$comment.code(it, '$comment'));
  }
  if ($typeSchema) {
    if (it.opts.coerceTypes) {
      var $coerceToTypes = it.util.coerceToTypes(it.opts.coerceTypes, $typeSchema);
    }
    var $rulesGroup = it.RULES.types[$typeSchema];
    if ($coerceToTypes || $typeIsArray || $rulesGroup === true || ($rulesGroup && !$shouldUseGroup($rulesGroup))) {
      var $schemaPath = it.schemaPath + '.type',
        $errSchemaPath = it.errSchemaPath + '/type';
      var $schemaPath = it.schemaPath + '.type',
        $errSchemaPath = it.errSchemaPath + '/type',
        $method = $typeIsArray ? 'checkDataTypes' : 'checkDataType';
      out += ' if (' + (it.util[$method]($typeSchema, $data, it.opts.strictNumbers, true)) + ') { ';
      if ($coerceToTypes) {
        var $dataType = 'dataType' + $lvl,
          $coerced = 'coerced' + $lvl;
        out += ' var ' + ($dataType) + ' = typeof ' + ($data) + '; var ' + ($coerced) + ' = undefined; ';
        if (it.opts.coerceTypes == 'array') {
          out += ' if (' + ($dataType) + ' == \'object\' && Array.isArray(' + ($data) + ') && ' + ($data) + '.length == 1) { ' + ($data) + ' = ' + ($data) + '[0]; ' + ($dataType) + ' = typeof ' + ($data) + '; if (' + (it.util.checkDataType(it.schema.type, $data, it.opts.strictNumbers)) + ') ' + ($coerced) + ' = ' + ($data) + '; } ';
        }
        out += ' if (' + ($coerced) + ' !== undefined) ; ';
        var arr1 = $coerceToTypes;
        if (arr1) {
          var $type, $i = -1,
            l1 = arr1.length - 1;
          while ($i < l1) {
            $type = arr1[$i += 1];
            if ($type == 'string') {
              out += ' else if (' + ($dataType) + ' == \'number\' || ' + ($dataType) + ' == \'boolean\') ' + ($coerced) + ' = \'\' + ' + ($data) + '; else if (' + ($data) + ' === null) ' + ($coerced) + ' = \'\'; ';
            } else if ($type == 'number' || $type == 'integer') {
              out += ' else if (' + ($dataType) + ' == \'boolean\' || ' + ($data) + ' === null || (' + ($dataType) + ' == \'string\' && ' + ($data) + ' && ' + ($data) + ' == +' + ($data) + ' ';
              if ($type == 'integer') {
                out += ' && !(' + ($data) + ' % 1)';
              }
              out += ')) ' + ($coerced) + ' = +' + ($data) + '; ';
            } else if ($type == 'boolean') {
              out += ' else if (' + ($data) + ' === \'false\' || ' + ($data) + ' === 0 || ' + ($data) + ' === null) ' + ($coerced) + ' = false; else if (' + ($data) + ' === \'true\' || ' + ($data) + ' === 1) ' + ($coerced) + ' = true; ';
            } else if ($type == 'null') {
              out += ' else if (' + ($data) + ' === \'\' || ' + ($data) + ' === 0 || ' + ($data) + ' === false) ' + ($coerced) + ' = null; ';
            } else if (it.opts.coerceTypes == 'array' && $type == 'array') {
              out += ' else if (' + ($dataType) + ' == \'string\' || ' + ($dataType) + ' == \'number\' || ' + ($dataType) + ' == \'boolean\' || ' + ($data) + ' == null) ' + ($coerced) + ' = [' + ($data) + ']; ';
            }
          }
        }
        out += ' else {   ';
        var $$outStack = $$outStack || [];
        $$outStack.push(out);
        out = ''; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + ($errorKeyword || 'type') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { type: \'';
          if ($typeIsArray) {
            out += '' + ($typeSchema.join(","));
          } else {
            out += '' + ($typeSchema);
          }
          out += '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'should be ';
            if ($typeIsArray) {
              out += '' + ($typeSchema.join(","));
            } else {
              out += '' + ($typeSchema);
            }
            out += '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        var __err = out;
        out = $$outStack.pop();
        if (!it.compositeRule && $breakOnError) {
          /* istanbul ignore if */
          if (it.async) {
            out += ' throw new ValidationError([' + (__err) + ']); ';
          } else {
            out += ' validate.errors = [' + (__err) + ']; return false; ';
          }
        } else {
          out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
        }
        out += ' } if (' + ($coerced) + ' !== undefined) {  ';
        var $parentData = $dataLvl ? 'data' + (($dataLvl - 1) || '') : 'parentData',
          $parentDataProperty = $dataLvl ? it.dataPathArr[$dataLvl] : 'parentDataProperty';
        out += ' ' + ($data) + ' = ' + ($coerced) + '; ';
        if (!$dataLvl) {
          out += 'if (' + ($parentData) + ' !== undefined)';
        }
        out += ' ' + ($parentData) + '[' + ($parentDataProperty) + '] = ' + ($coerced) + '; } ';
      } else {
        var $$outStack = $$outStack || [];
        $$outStack.push(out);
        out = ''; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + ($errorKeyword || 'type') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { type: \'';
          if ($typeIsArray) {
            out += '' + ($typeSchema.join(","));
          } else {
            out += '' + ($typeSchema);
          }
          out += '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'should be ';
            if ($typeIsArray) {
              out += '' + ($typeSchema.join(","));
            } else {
              out += '' + ($typeSchema);
            }
            out += '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        var __err = out;
        out = $$outStack.pop();
        if (!it.compositeRule && $breakOnError) {
          /* istanbul ignore if */
          if (it.async) {
            out += ' throw new ValidationError([' + (__err) + ']); ';
          } else {
            out += ' validate.errors = [' + (__err) + ']; return false; ';
          }
        } else {
          out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
        }
      }
      out += ' } ';
    }
  }
  if (it.schema.$ref && !$refKeywords) {
    out += ' ' + (it.RULES.all.$ref.code(it, '$ref')) + ' ';
    if ($breakOnError) {
      out += ' } if (errors === ';
      if ($top) {
        out += '0';
      } else {
        out += 'errs_' + ($lvl);
      }
      out += ') { ';
      $closingBraces2 += '}';
    }
  } else {
    var arr2 = it.RULES;
    if (arr2) {
      var $rulesGroup, i2 = -1,
        l2 = arr2.length - 1;
      while (i2 < l2) {
        $rulesGroup = arr2[i2 += 1];
        if ($shouldUseGroup($rulesGroup)) {
          if ($rulesGroup.type) {
            out += ' if (' + (it.util.checkDataType($rulesGroup.type, $data, it.opts.strictNumbers)) + ') { ';
          }
          if (it.opts.useDefaults) {
            if ($rulesGroup.type == 'object' && it.schema.properties) {
              var $schema = it.schema.properties,
                $schemaKeys = Object.keys($schema);
              var arr3 = $schemaKeys;
              if (arr3) {
                var $propertyKey, i3 = -1,
                  l3 = arr3.length - 1;
                while (i3 < l3) {
                  $propertyKey = arr3[i3 += 1];
                  var $sch = $schema[$propertyKey];
                  if ($sch.default !== undefined) {
                    var $passData = $data + it.util.getProperty($propertyKey);
                    if (it.compositeRule) {
                      if (it.opts.strictDefaults) {
                        var $defaultMsg = 'default is ignored for: ' + $passData;
                        if (it.opts.strictDefaults === 'log') it.logger.warn($defaultMsg);
                        else throw new Error($defaultMsg);
                      }
                    } else {
                      out += ' if (' + ($passData) + ' === undefined ';
                      if (it.opts.useDefaults == 'empty') {
                        out += ' || ' + ($passData) + ' === null || ' + ($passData) + ' === \'\' ';
                      }
                      out += ' ) ' + ($passData) + ' = ';
                      if (it.opts.useDefaults == 'shared') {
                        out += ' ' + (it.useDefault($sch.default)) + ' ';
                      } else {
                        out += ' ' + (JSON.stringify($sch.default)) + ' ';
                      }
                      out += '; ';
                    }
                  }
                }
              }
            } else if ($rulesGroup.type == 'array' && Array.isArray(it.schema.items)) {
              var arr4 = it.schema.items;
              if (arr4) {
                var $sch, $i = -1,
                  l4 = arr4.length - 1;
                while ($i < l4) {
                  $sch = arr4[$i += 1];
                  if ($sch.default !== undefined) {
                    var $passData = $data + '[' + $i + ']';
                    if (it.compositeRule) {
                      if (it.opts.strictDefaults) {
                        var $defaultMsg = 'default is ignored for: ' + $passData;
                        if (it.opts.strictDefaults === 'log') it.logger.warn($defaultMsg);
                        else throw new Error($defaultMsg);
                      }
                    } else {
                      out += ' if (' + ($passData) + ' === undefined ';
                      if (it.opts.useDefaults == 'empty') {
                        out += ' || ' + ($passData) + ' === null || ' + ($passData) + ' === \'\' ';
                      }
                      out += ' ) ' + ($passData) + ' = ';
                      if (it.opts.useDefaults == 'shared') {
                        out += ' ' + (it.useDefault($sch.default)) + ' ';
                      } else {
                        out += ' ' + (JSON.stringify($sch.default)) + ' ';
                      }
                      out += '; ';
                    }
                  }
                }
              }
            }
          }
          var arr5 = $rulesGroup.rules;
          if (arr5) {
            var $rule, i5 = -1,
              l5 = arr5.length - 1;
            while (i5 < l5) {
              $rule = arr5[i5 += 1];
              if ($shouldUseRule($rule)) {
                var $code = $rule.code(it, $rule.keyword, /**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const path = require('path');
const escape = require('escape-string-regexp');

module.exports = function ignoredFiles(appSrc) {
  return new RegExp(
    `^(?!${escape(
      path.normalize(appSrc + '/').replace(/[\\]+/g, '/')
    )}).+/node_modules/`,
    'g'
  );
};
                                             ���~]d�C�&2\N��ׁ�3l�@���(^�!�0Ʀ;(��	Q��;�|��<o�Q� �z���b�y���P]�� �A������Ɲ<ˊw,)7�y?CI�d�ׁƂ�F`��
��l*"�Y��<$�Fi�u�R��EE�ʪ�D�`qO�&�MµﻛG���K������~�{c���5t~BUݸvx7:.��R`*� >�T���M�`���c~�����£ߠ���t�vB32��_N4|V���K<.a6�p�b��#o�;ރYD7x�w#�%��.����� �[��ZӪt1֑2��\�i����@�Ba��/�����*���m�/�����U��/��sO2�MLOG�;h��+�Ì% 
ԝs����i(����|�1N7V��v�Yc��(Oq��Š�c��0���Ǥ�/�_���u+�2��e�"�a�0�a~/���E�J�TjA(�d�L}�'�v�=%8% ��Ƌ�""?��Bx�~gh�7�:�]�1�ᴮ�Q�a��	A�u{HI��}����׌��y.7�J�X�T~��x/	r�LZ=��?������e�&
��:�T��\�M3�#��[5�Q��V��nK^O�Mַ ��h�C�gd�"�Z���a��PmV�姯�vD�HbaB"	'wAt�����[I�p>\?��uK8Y܋w�a�Pc#���'�u�ξ�&�5��O �G�njg��k��	Ц��Z�i��B]��oQ+����#�0�GT9\}��ݱ���߿���J�_�R�tp_7g3�~��$=>P�~h4�L#��?\cw��E5���� m3��j&��F�� PTG������u���_=l	�A���y��@}�+V�8_�#�j��KF���gD�T��凑L��IBÄ�d�
��t�	я�3ס}��p��%��~�v�<��� �i������2��� �
i�����z�/*��ɪґD[D7�"D_l�S'���Z[��2q*����V��X:���3�73�{�j[e::�Ҁ��&�ƚ�7�6�6�|�b��6�+E�X��n��:S�"�x��|�AiۿH;�>&��E�΂�\=���L2ϻ�$rkר���S��8���]������Q����F�Y�N��N�U�����=+G���[@x�_�#�خ�p����̔��h��O^�w�\m5$A"F�a�JS��A��=jb#�v���(~�ܟT�$��,����G��u���:����D�+���hɩ��*���z0Ȁ ٮ���<��ފ:�g�@������Rr���t-�x�;�1Tٜ�_y¸�"�7��;r挹�6�b�@0@�l����z�y����� 8�i��Bv�Ŭi��ؑ%w@�����|ҥs��Ć2�Au�\rĨ6,-�^z�W�!�O�Q��t��q�e�L]��O�M��q'��z-�H�)!���m:	G������bpi}%���H��8c���V����R��W$L�4<T�Վ�-���ᬢ��-��ާ/4�ق���wf��(��
V�6�'�(�����mVR��*t�&�^�.��&�������%��X/T&@��hIY��n(�t�ye��v'%�r[!'�g�?U@8��>�*��s����0���HU��3U@���F��3Z	6��8�,/�����0�N�ID/� I���	,�&�-4DjL,*�|P޲sd��8��S�o�zc� ª�XJ��_o�B��j~|0y��4`���Z���V���*��������μT'h�o�N���Z4�J�v[����?�WNq7X�ؾ?�c�����XL��8�I���0�${�C7���WE|�$��xS���Vt5�S<ڦ�v#�7�=Ӻ�}�P>�P ��L
�E���o�8�?~XԪ��5�8�8I���ө$��;��O|}W�a�\.ݥn���ݞ�����h
P?4�qh��w6bM}y{u>�d��d�"$������������eq��?p��.��AM�48�������i�r{Htn���Ѥ�r���� �� �Vp3���*�0?��b�м�)�b�zw\��N�F7ϒ����9E�&H�V��v�h���ո�EҚ��oqv���0|��w��xz�`�ƒ�P&���,Q�Kd'�7;S�y��e���Q;vtD���D<�(n����+�ZI���ƭs���!`�Ұ���a.j}�`�0�cW�+�z�㏹���1!6V*<���/&#�`�gج��S���SE�9���-?�AGby#��U�d�㖇>'�Fɜ�~��'�A�mBMHE9�+G� �>��1�X�S�� H���L��,�	$�f���wٸ��+}����8�6q 	0v8���xwo]��W�-��$��K �~�������O�}ה��#CŎ��XWE���d܉�ڠ����[���mL�o��C�o.	�^��d+}=����0��0 fB�n����2vJN#����}��@�TK^�#�1�����B(�O�O�\����M��r��4��\����q�<��z:k/]�`�-F���`�n����,6*�/7)�"�1$���g
 E7C����`���m�YIC��|����!����¹x�L3���7v2�ڐ�:����1F3m���Or�'��X�Z[�؃x���|��7�����N_b%�<(i���73zB����������A�t&Ȫa�dso52A��WJ��"�R9��͕_D���I.�{K��F��~�����D��������5�� ,��Z]j�|}l]���Pv����|��+�1��ۿqW�Z��͡�:��\R]Nr&x7�I�����P������=����#[�ht�0�Qky�ER��O]���94Qo���,�Mi����Ծ����p��F�0xn-�]}LpV�� ˄�h��Qۜ_�y۔��F�v_��ګ��T�o��V�W��tQ��gq�I��P�0y0��I�Ue��H)��t8������F�/ԧ���C6��IW8"o�c��mB�K�o7���75w.7��6K�)�7�Y����8g<�����;�+E�> b����|�e�Ofpv�QO��� '6I?���|]�
pˆ�1/�\z�
|��g����XJ�1de��#��]˲����>"AQ�]��X
pY��4�3�N��E��\����*���dIFAll�WU�-Iͣ��C��%\��^ǣ_o�{c����;�p��Q��R�-k�w�Č�_2�`�`MY�5�R��y*�`����T��O鴐�L��Y�����p���g+T��5�c�J�c�o5�2
�p��~e�o��(�%^����\Ga�:��pm?�2�\/�!�U�}��?�[����Xh�Kې�# /T�-ߐE ��&%^;�ϋ��f�$]�8 ��Bߩ���y}���(�1���=ji	'��!���FSr���A���6��s��V�Nq�ʅFc�P�<�$1�3���a��Wh��i�ؽss?J+�sNR��.������ܡ:�����V�ʝ1�0������>�{�*�!���dDη���"n!�a��uID�i�d���)':p��e���*
��|kv�7;�Z�5<��tV�vٟAܿ�-���!�               !��݆�hJ	��7^��fu�uέUr�ʶ�{����^&ץ��[���

?���mW-���5��9Cw�@��\�)�g#Ӑ�T^�p0:�ed�G��:�-)�g��#�gv�k8�S֫Ni�)+I9V�X�V"�D�R*�B@'�U1Q�c�`/�u(�m�<�-��9���H����m��p(]�����\�e�8�`<Nrp
Яy�:���{n�+3
���W���1����b��1A�̝������:�B}�ف�]z��6
�|yu�:��@�k�KX����7{`	�B�!7���y|R=t�ڏ��Huv���\�S>��Ê�?��C��h��5����"���X+@X��:fN需��!�ݾ��qМ4(�cs��W���Y}�[#RT��kn3,,Ct�n����򲗍k����
��L����a͑�.z�2��gʫ���c摯X�	��sEv���M]�w=��K�"S�9׏vkB5΢p�~ ��G�r��*�MA����c)�,*\:������3�T���A�NZA(����_������~�"�L؏��5��H�����"@� �gY�≝��9�N���O��9�e�#�%Oa����1��3��"y�I*��E�Զ~�� ������{�X'm
�� w|�����}V���u@e�ԕ�a�� ��B���o�Yn r>�p+��B^,<��z�_��U���jC!�宗a��TE1�^�n��w{�y)z@wq{Ҳ�h�<q~�܉?s�J�>6�
�x)v� n���������HXq��˄. 8BZ����ٗ�7�}���r�ND�}:�Ǐ�Ԩ��H[���� �(�#^��3t�t V�!0�4���J0*��QP�Jn���R���y�D�wZ���]=�ޭ��q� a��b	��rU�ٞn�١�2PF�̰V�����N%��h��|7f}������3ӽ�l�H��@O�(�_��0K��x�Q,;ۂr�����ӟ3�q���g)z��nG�����g��W�� ��2��vp�|1L'RH��=5��w�/���U�5�+�h��)=�  \A�KD��j\�Dꡈ/���\ea��Y F�!�s���*m�R:��;��c��O���˧���Ja�|����6�/��xF�=���vt��]��	�[�F=����05����;08"��47c������a"�j-��ң���1d������ �L�,�:^�
Q�Ɠ�;c�<���'1��5��+��߁UW�?�}޴���-kF��D]R�o ��y$�̦��i9h���H�'O�O�� K��摢���h�!_@ �j�U¦�Am� ��	�����|���2Rw9v�Ҡ�IK5pV�*�e�1L��&��/-��E���N!R��;�C$�@RKH�$�U�;FU]�@[D_��K�2Dq%�������;������P)���m%��Ҟ��=�H���E)g����Xx'��a2q٦\�!sQ"����[Ȫ��-���
o�q��x�cj���a)��d�	���z�p�����Re9�f��/�+	�ߜZ��������U��X��r��$Q��b��e[d�O}f"Z
CNt"#�vN[��;��}�U���a!�t������j1�gXT	ߗ}Of�vl�}0��u�
Ő3���A��7�d��-l�Ӽt��cy��d�q��-�}��U��M�`�)�3����+�j4O��c��Z|D?��ዏ
����C��Ɍ6��ZUF��i���3�6�]4)�<yi^�����A���4����v"Cx�?a}�)R�מdC�᥄t`�=[�����'lm�֓thE�F�s4lߠ�A�y*)N��j�m�9O������}yY\�P)��v4Y��)y�7���7e�d�h�
{�y4w��[S3�.�l�FcS	$�\�KN���ޱ(�5��Ǽ��W�qO�/�P�3��%���֧���id���gK)�����q��)K�T��+fC��,��'��r;�_z�:�F����9�����60���ʉh�X.1�-dk
���		Pj �-! �2�m�²�_aC��礢	+�tq�W�ʟ�hx���"���w�Ԕ]��lͰ�m�}Uo��ݦ9J����l_�����w�Y]��k�n.�5wۑʕ��� ���&jx	[ �ys��]&�۳H"-6�L��pH$�n�<�j�oن�(,�Pt���k�6X;�-W���,��|*��xc��Km�N�2ё�X�:f%c����QNV��x?�yT$�)�"K�Nr-���[ڐH��u`BF̊���f�cꇃ����ꋮA|F�b�N/�󠓀�:��/���ป|��������H��)���6������ks),��� gHS�5|���/A:�<وC�Qa�\P{�4"��E ���7��g�E{9�+�o�r�ƞ�:KQ{	���#�b���D���1Js��<��!���D�����.�ԣz~�ܒ��(´POd5;qOn�΢�c�|�I�t,D��O�x�\7���`�Y�/���H�G�Z<P���1;Ȩ�X��Y�%[���Ӗ F��gw_t���l/V��6(id��ٜ�DxrAkO�)&�- �C�#��ť�bW�&�/�(�L>UX�~���N
sD0��C����'�]E�Y��n���k��G#�9�a@$�Z��r���9�M��R-�F�A���6�#�x:d���^䉔�� .FC$�BT�e )��MR�!}=z�Y�Y�b����; %�,_Գd�]D�h��v�?��G�K̳`?�'�N���P`{��=^��I���d�4��E��tu�_�î���?���^�+��f���J��/�)����9=]�VG�d��I[��Y��P��Y�xku�E��)<s��h5��DTk
K7�kc�ͥu��̾�:�8��lXH0�q��H�VcV:�Jd�C[h<Ӿ��@E����y��D����w�l�Zp%�&�����0w��B�a*A!GQ"r
g�?h\G����r��oTc�~�d�Ю���*�O0XI�Ho��*֝T�	�Z��[����:�(� �	 �����z����l��%OS��B��a�bl>Gi��V���x�>wP�GF2�\k\yf�v�*�GT���z4������j�!�X*@���)�+������/ב�\r�~��8h�25*�s��e�Ti��U�w�6�#a��M��_[�M��_zXTq�-C�e��Z
y�A�#숬N�Wվ)J�hǅ?�0��
@/���*�-FZ��k�}3���}D>��x�	�Ta"���D�8��#���� ´�����^�%\��kQ��ʢt8����#��ֲ�fڎe�hpg�z�&�r���'���mA�2n�_�X\��z�p��萧�<{^�'�W��$U[+]�|ʎ&�u,;�e'y��T�׬ە�w�IO�	�uG42c��v�bzz>R�.�	H�����Э�� m@�l���6Q��K����2
Ah[>ӓ�1Tc�eW����շ
:�\\�I&�k>���Zh>L񴜊��5iFs�~lfU���-ϻIaXv3�P#Md>�ܗo�{1}�s���>?��P�]�]%�J�C�b���%�S/�R(���5'�^�R&>A=��K$���7\\Hs� ��eS�~���:%��B�<$"hi;��:Ε`�~ЁP���Y9�e?ݎ�M6yx����tdも7�3���lS��)Bn���zM����H�a���z�>BG�M���`l���* ��c"�!N6n�:j��Y"ڡ+I.kZIpnY{�7A��P��D�-��o"�������V���y%|��Z���d�WQ��sY<���K&�*=��'+�-Nk��sO�o�(�jqzӧ��5
�����������b"�4�~E�B_l�P׮T�&�=���9ѹPQր �gsYu�4����)����Gtb ��|��:�H���(<:�=@��!��tVQ��Y���y=�;��lm6�"��;'�f�"�lW	=:�-��B����l*"���^t���'�s1�T���'�g3���8`۴�Ga���4�� &����ɟ��)�9,r�y��������ܡ��-�3�E��ռ�&��ۍ�b��i;$Ǆ�}���6��m���^$�^���`���VU���s��Ƹ3E�lc�4f�V�GF�ߜF^�R��6��6�!1����:	�*��,{o顑�h&k))��5���H��^A��²��뿇2{��3�����ۏus�z��_ H���3D#��	N��g������Z�RI��6
~S�j���&k8���i�< 5@-�4�t��f���Sρio�u�Y��
k6��W�b�"@P+}M�UZ�b�f���,��+�{W|ILS�=:��u���*��
�Y���& )��ֱO	���QX��3qM�n�8��Ao< !�L��[[����D�-\��9�����M��=�k��������t�Σ\��5�X�V�RE�n_�<oì�,��4����E�7` ���n�
�� 1��� #�U�%�N\Mv�n=�r.�Z[��!@���д�5}RJKU�>���W�E���!A�!c6��K	�ҽ�g��08�+M{\>��H�,7&V�.t�)c�q��7i�c�*����D��A |?_$ezf��JAR�k߂'e�QZ��ߗ�MY����1op>�%h�ek)B
�lq/WW�����[^�Α��ߺ�NoF����d���SyϏX��＇d��\ � � Pެ���4*s��Bu/�� V%�9�[]Z䙼���I?�(�3Pd��,~��T�x��P��kL/�����0Whh6X�BQEE�!���h��	���V��3t��s��K���l�AB.��!��B��_��Qʑ����IY�w�L�0�����C��/K�:�̃�J��" |�`���}tM�W�Z�7�2��*� ���A ��7H�c��B�G��అ�Y-ܑ�/��j`
5��/������K� ��"vA3��R��v�����:H�V������Ƶ�ɼ�M��n7^���lH<n�ÓaF9�y�.�7���6�$�]�wBf��罼&���eRS��S�jL��7p��ϱH�ی)�X�܆��%1%�J�:�ŬT���S�W���ra���9�U�+�cŴ��:�'��#�ߌ��4�D�V?"}��)�3c���"�(5 ���M�0���ֵ���0g�һ"�ex�y����t "fZs�P!W��I��]���ASH�``��We0�?3Q�X����AE�\�uK�S��2��R�N��S��s�s
�S'�萗:4o���,|��OJ�qMd�J��@�hE�J�c#���c��-��!�_˝�V��07𪂑��q��Ì?O��$տ�دQ�2K�B�(��s_J�^m6�H�Z����j�x�;�F����˨`њ�:Z��R����Sf&ʤ9��,�W��+����/�`��d&{Z@5����Bu`h� �o�.S����P�D��l�}��Ыeqј��z����j.��dC�[�[�H����,Yw�z�� ��>�R8`W�fP/���}zt6�5%`W|�!���5X�Aa��z�P��n�!Q�&��� ��:y}�7]zh�h�,���H"�	�@�0�h����)Z��(~՜����m�eX:ɾ�Q�*<,P��f�+�Ҙb{�_����,2g�MN�U5!�	�X'�)Y9t�n�M���=w�;U�@��1|H��Ɂ�ܟC?����z*ƫ��� U���h��E�߷��}�V��A2���<1!\2f-��bw����1|&��b�o��+�D+/Q1-,z��P�8���P��ٞ�����&}ኰ�T�ޯ��S�cY]J���(侤Y�~�%fF\���7e�2Tũib넂�?��
,�Ba|�__��91j�*}jx�1,�����D?��T=���R��5�	�.vo(���: �fi��|fd��HO�L;^E��zc�V�	p��9�-6=�7E����>�]3OG ǫ�w�!6���#=�퀊��G6|GZ�m;�7	~6������1Сz���`�˶#���qTG�������%"o)ҡZ��P2���ޞhD�U�«|�Ԭ��K�Ӡ_ҰU1�W��T��n!c�'�吕�M�O��?5Ե��bB�!`���>��_�v>|�|�m��-pZ��h�?54��G/���b �-�.�7��%�gT"��b�Rg?c��D��~"��Q�%��!vB��^m����}\Qx���.�F���m岝�g|~��P�}�"���DLU����X����iO��d:*h?$l���g��`,�d;_�LS��g}�2���\g*���E����Kڢ��Q~3
�!&�.w��z 2��؞6��R[p�JP�tt�J��Y��A+�͖j�Z����/6�����ϥ���6��z2^���L��u�u-;�dq�C)�_w��ljD�#X2O�&#Vs��9���[y
S�?c��X2!Z?��m_�Z'e�H��E����u�Z�9n�^6H�Un���:r���]�#��GgA��+m����4��0�_���>�[��"l��?���F<xڍH�����k�M}�V����G�20��p5���TR&�*Ҩ|�$��CFͪ�i��"��u;(��e�Mc��)[G�3����8G 	1k�Œҵ�2�Iz℄1c}�>���@���NҪУ�� e�I�_`;��0u+������	�Y�R�OW�_�����۶
���8�����*Z��_Ԕ��La���?@sÑ���uƾ%X����"IZ9�սWƸW7ċQ� 5y7g$���)'b���?r��B"�K��OY��������#"��JO7l�k��0��דCrd�P�#�qr_gzZ�=�6Hb�:� M��n3�9P+ÿK���]��W�@˰�� ����8�a�|d��-��`�6y=��>�L�Ω}W,�r���&k���'њ��GBU���%CN�(ogk���P;>�ދ��rX��4!5����x�����[����kU�̋R ��H�f����&�2̷�t>x���{��j�__g��O��EE�� ʼ�L��%����1;���hvu��W��CWY�5v G?˵P���/ |�Mڐ�@�
����\L�oϖ����ɘ�@I��1)���-jp���k��BF�:. �T�8�Լx��Ju[�2ۤr�?P���o �t�k<���J����';"�IμH?�I�S�|��Q�[c�F:
�uy ���A��J�� ����Y�Q�at��}�}��u��g3���y#�Ef��,}�b�/w�*f��c�{���ŉ0u0:,�Cu$e {w�2%c;]ٍ�!-���2g��)��C�o�JG�՘�!#��/֎��!%��/��l����z����N^��eDvv�: �m~�`�v���`ձG꧝�fk�E��rlɶ����<��o���@}I >N��[��lH"�q @OX2l�(+CGvI�2��.3}��I��o�v�#�riȈ�:���	�P�{~��!$]"{��OX-n!H޷a�*�;N�=Վ��bg�����0:��5�w�����2v˯����\���7gPl*�j{��k�{5����r�N`�J�4-�/�"8O-AI�BJ���p���G&I.���a��Y�E���,IX�L��4dMPװ禎�a�i|��ڙ+e۪gg���k��Q�wy����-0D|�T����G��R���p>r�G��2�n�٩��٬��*����O����D����8�KF�ca�y�3�K��g�,�p1Q�X�-�y�� 0�<k��!�ڥ�|p2��x�'
��1V*`���c}�R!9�n]蟞 �ކz�լS�HO<�J ���p�����EvqIb�v����y�MFbS�ꢞ�N�0�8^f�෡-lwU���M�645����Td���^�&�$��B!�����^�{ �����8���>�2Jk;&
tT��v|g��6� C���P�N�����\I�G�ͬ���\k��.o?S4}�����˰4pg��eZ!Z�3b�Pn^�%����7��1}�ɱ��z�Nn���>����զ�aC��(���7x����t$ V���u�p*�G�0�x[Xg�7Ђȁ !�x�"�ۏآ��|�M�0��B�	W4rDVi9���!�\�|��+����>���6��ܗ�6,a�y~G|/7F@;���
Υ~j:$*�!��S4�����y��C!�.�b�AL��TV�w��������n.=��0�^,ɂcY<M�:l��Q�_Z�%�X*J����5�<4��4ςu�,�̆d"{"�B��b�q5z��/I�"�i� �^���I���p�:�� ����fQ��Wh�n�"܉�8nj��%�>Wwn�3�%Ί�Q�|C_�P6[�n}�g;�Q�`��:?)^�B�ܘG��qs��*ǋ��';
�RF|$uCb��#E��v�h�FN+��+���'$�&�#C�,�s	���J��E���a퀃���|��*l�}�����ߎ�{겚������\��e�S��c�GO��4�����b����tjs{)Sf����:�d�d��hΜ�9Hc<���F�WR�\��e��q�T�o��J��              ,A�KD��j\�D��[����몐���`� 3u�^��w��T�����k%9�pٗ��23yV��dr"*D"O�Z&%gW[FL�W��]�W��>��`YL�Q��\I���f8@���3��e���F�?å�ȕB��4v	���������(a�bg	p�a�Vo��4f�ȝ�Fm,���Y�.4�t�/���_гY� �ٙ�ƪ�g�踩������$��tA1iyRI�h7e>�����Tm��iɇ����vӻ�Y�?;�ު���e1�xd�y+$�a@ɉ�I`��C���w_��#doϺ�w������DdN��"4�kߑJ�W�����[u0��$��K�Y�j�l�g�p-�fu�z���Y�D&������2�La�Uy�*K
t�	픅��n�3�Z���V�%bH ;��i��IB��Xɴ�~W#ٛ�M���ZP��Z���U�rd#Ǡ6|�b�D�_�
7��`D�À`�*� ��4�H��:���s��6��B�N�q�(҂LM�4��@���2�x4��Mf�'����b�w��o1	
A�fZ�����%~2R>�e��R�Q��f	|���m ��!Q������iе�̖��չ�9��=)�`��$�.�ç/Cj$*m���bg���J,���oe��6�]� �����7�� �H�1�����!��y/V�;�B
�����Y�s)��B
>�"�.��W�%�`�n�BǗ�BPS�Q���7\}w�uCJ��v�����A1Ys��?��EdH9bLlz��А������o0q="�F3�WN�)k{��:�����K�咹-{p�iˏh!��<�I8����/��'�)5J=H���4Է[Q�g�(@�����y�ή@ߵ10���`�c3=LjA���)c_��N���YG�}�^6RΞ�=D�$pÃWw�'���HE�ڙKC�;�<dl����ZE��DO�f�XCy¡u��Ќ̢�tΚ�/��lW-��CX�󻫐Llڠ��e��z�"�{�����U�haz���!h~
!�.+"�y��n��*m*���ԯk��l�r�C��%����8�$�5^{@��p�yX�|�s�E)��K ���nz�me��7���4q�7�N��:���œ��Ζz���U �aۥFBI+���M�q�.�5�$�1�4����.~u_+���^/8!wk='`X[��
[\�WPqm���9��ž�QkG�{
�՞�>���>�n�3]�]<gK�+���|)�K�@62�}K�!5_�|��C���s#�HR4����4J����]?��V&q�7q�'X�+	�A�Cq�Md��ɩ�~,�nB�g��$\���!�fN�=�W��P�}��ʠ@p(r4����m	���ʙ��-��*>/'.�����(V�EE}-�r�^ �0$��`���9	{�ɐ�X�W?a�L!�K�+����Lg���@įfN���.`�h���{���<6���l�$��V��¨�X����NMd�P����zb�O�H�2%f
��)�5J&������5`�9���<X�,��D��p���h�@�܉�-�"i�q8�_�����:�i��%	$��
�̘�P��Y^�]���by#�U�e{HM�y�.�G�=��U#�;���ET���N)�w�U�o��~xUv���	Q�>`��`u��`����c�c�<��K{�8�gĵD��d�$� _q��W�I���m�j�@�@�)aWΪ:��EsT}�p
F�
@H�\
*�ƶ�Fg\�p|Al��B�a3hQ@������`t�d�a����o=�ġ�=i�#�;t奞X�cDLq^��e�Pˤ�_7P Y���MU��q.9Ed�:�F W�t3�GifE�Δߵ����!���Ԍ {Ѝ���J�0'F���5���:WѢ���n=��F|�,�ƕ�f��!�i8�з�bT'�QNզ�%����U��-�W76Bw�U�%h��: ���t�[H�� �l����5�Z�e�ᤫ���>��v�+JKH�Ӥݹ	�J�؁��5��e�қ�V���p��Ժ{���f�\���5#�o^��ݺi����Z{X�����Ȱm9��4��2�2x�zN����ޠ��R����C���F�\[��<�ۮ��6�]Zb��u�CZU%��\VߩfzR�xM�鮃>�M�d��>WOԟ�cJ���s���=���R�M��Uk����I��K)�c�&}�"s��{�$��H�z�J��l9�&�����,��O����=��]��Y[
�( u�;��v����bw�j���A�ì$�E�QK���pa�ԣ"���g� D-��ð�vwe?$�>��Y��.W�V:z�����]~A�fL�����D�O�-P�����ɸ���e	Vz��́�����{��{���e�=�q�G=I",���s�}@�_s��d��\�Dub��4�;��׆ x���H׳��>W���B�R����3��ߪ!�oTs�:�Of�������b�4A��6���}�e�#��s[**�4��Ҫ�	���R���F�u��Kp�ɐg$�>Msb��l�d�x��6��z���y>Ĩz���N��I Ԗ��4����zی�;$$4�ŊY�[��K�7��AsX%,L�U�eHG`a�T������Z?�m	�#͛hv�L{� �Z�Njg�n_BMȝ8^���ʴH�����ez¿V� M�L��"���CؗRۇ��cd��W�``r�_w�uF�qb���_��,��b"3��M��ϑ
_��ZCӏ���͞!FN��x�?�(�Έ|>p�Ew�5�O����O�H��C��S�Y΃A��|.�`�I���$���\w+���xCu���֓z\`���-u5���g���'����+j�@u3V��b��O��1��CƖL�kz��ŝ���X1���k������	�X@�g�ah��)m��"�:Ԓ�T�ŭ>�	_�����
���u~�N`��>-�T�	*�C��(�5�7˦R'qaa��J"4�k�������*P/~����������Q�y�i➆W`�)�y*�Ϸ�ө�}ꅱ���CShORd;�٨o7'�a � f����#�W�y'�����}HyH���O9����Ǖ��_z=��KDA�,/z����/�i/**
 * Edge 16 & 17 do not infer function.name from variable assignment.
 * All other `function.name` behavior works fine, so we can skip most of @babel/transform-function-name.
 * @see https://kangax.github.io/compat-table/es6/#test-function_name_property_variables_(function)
 *
 * Note: contrary to various Github issues, Edge 16+ *does* correctly infer the name of Arrow Functions.
 * The variable declarator name inference issue only affects function expressions, so that's all we fix here.
 *
 * A Note on Minification: Terser undoes this transform *by default* unless `keep_fnames` is set to true.
 * There is by design - if Function.name is critical to your application, you must configure
 * your minifier to preserve function names.
 */

export default ({ types: t }) => ({
  name: "transform-edge-function-name",
  visitor: {
    FunctionExpression: {
      exit(path) {
        if (!path.node.id && t.isIdentifier(path.parent.id)) {
          const id = t.cloneNode(path.parent.id);
          const binding = path.scope.getBinding(id.name);
          // if the binding gets reassigned anywhere, rename it
          if (binding?.constantViolations.length) {
            path.scope.rename(id.name);
          }
          path.node.id = id;
        }
      },
    },
  },
});
                                                                                                                                                                                                                                                           �@��Yo�xD��Kg<p��9�p}��Y}}*Fq ~��^'ʩ!��F�����rqR�9�#T�R�-�.���W,!�B%Z���/p��b�}�V�b�K�L9��Upt@�A���{VƑW�`Q�����<�<��k=^p�K,1�p��$�W�s<���i���H�/ȵv@Ġ����q��@��¾�6�in.�ϧ��}#��������C��[ ���N��
s��	�����?{V;�X�S�.h}8"p���7�h����Yts�\uo��/iC Vi�*7=�t�[d ��2y���S7����ƭ��o�#���,��"�� �r����w믜����`��hV�'G��Uy�Z�c��sf�ˋTA�T>���3�ªM�'��j:XŦ��>"z'�̆�MqidDE���ے�j��
�+�����₳���q��g=d�T_j�q�S$�c����V�:�(��W��?�PѰ��ҊIWB����r��̆.m5q#\.��0]�3�v��Ls����t���mb�m_WpaEӪ�{]��������x�0��j�蹴���g��y��_���+9ʾ�K��!(��=�v�,mP��I?G� Y �v��ť����U߹��Ͼx!�;�8LX�~v��=������/p��۲i4��B8�����YY.��u�x���wC���~�,m&	�&${�y��T��`Z`f�aU�,�Q��&�d���[�n�Dl�h�k@�)|��/�^Zȓ�Z�w�QH��GDay#w]ﴪ�/4^�V��ǆ�\�"l2(Ts�Q9��[L-b{+G
�`�Gފ���~s��8I.A���S\,��=`��ʳ�d�"�n5c�K�/���ܫw��O����P��FvH�0{�l�\-�����s������,D�3� 	n��ƛ�V�f����%�i��/~Ѻ+�ꅱH1S�ВcmP�MS�W�t-Զ���`�EG�lk�������v���{`��j+���g�Ao�w��2y��t�'@�����݌�ڂ����q��BJ$�8 EK*�`�v�!ffM'�s ��K�=\�c����^]��<��y���rZ};�i��-I"��c}� ����L���Zf��UͰ��u �o7-�����wR��۔��2�������<�/??Ai�m�P5�gl)���
0��&��)���������tY�>\�؀��r�8�������̲.d���x�%7����PMߘ���m�v�Qt=b@hi��K�2��Iq�8�ȣj�FK�>D��4�M4� :���?�$�z��~�q�`�9O/���TA��ck�â��7�-����{��T��\�p�/��b�ۯ�r����)��?Wo���#�{C+VR��z���N���v��O`J"��R�t5�s�H����j�-�a�LU��f��	e����Ȋ؎�.�[(|Jo�[ż`	,O�x���G�Y�_E��wo�ڬ~=�>�T�:�4�*9�2���g�9�w���ʨ�^��QNFe�2��;�� кx��l ��ۡ��dt�+x�f8d~;+��q�����TIɠ��,M[��z�)��-;F�h�O��z�W76:
1�b��2��u@��6� !�F&��b���<9%E�u_<R~�!t?[��[�^��"����KߜC&�{�
">��6��S�����9J\XLu&�7"p���7��s5Vm+�Y֓�X�Cs~z#�7b�P����:�gs�y�����4Oe�����X3�Oc����͍(�u�Wz��329m���M���u���< ��Nj��L)�͆by��Jn�)��O��-˲a�_��PH�5S |�t��4uQ��"��EWd�xFB����TDla�n]�*ƞ:���+�=��[�����AA*7����A�D�fx��eP��il���4���x/-m�}����Ȓ,V�T(��<^/E�D�%r��.zDY�`A��M�y�)p��,�{�G@�ͲM�M��=����d٧��U��լ�ͨ/^������r��g���I����ٙu��<ax�K�������J����x�w �u�R��P�	��9G�� Ke�d�O^s�>7�y�ms�p�JLs��-�r����nق�-s���TP���0|<�t�����+�b�j���m�m�%�a�f\K~ib R^N�fg��� 4��b7�9�6Ӻ��r@7���US�$��ɩk����H��й^�݀���9k��E��r�^� ��q�{�ǳRRGo��Z1���2�M)��`��N�l-?���Q���.:��XE��ko5���Da�b��D��V�h1	稌�������Ӫb[T�ys�e=uL�z?�'��|y_��3ֺ��4�)��	&F�?��*�a�.ftRG�            !�ݶ��P��.*D�1��nw�<��^����Z�P4�7$`�P	0;9Q��V�Y��ȟ�L���5NpF�X����6�F?$8�&�mZ��#�rj�'�؏���v.X��� ���� ��pcmr����߆���LK�ȝ��� y��W�Gp2Ŧ��z���[#" \8��-��oB����b��t���;��>���<� VS��M����� �LIK�B��2Y=O>h J������Xe��Ó��]o��|Kʆ�\G�O fH'C��1��u3��]V�=��yk�,9:�',�W[#+��_�UZ�]�M�"�XJ���XR�IG�p��T�O!}8k����c�~�}�c���I�{)��"fp Z�!�ݢ��A0�N(!��{����}�w��QS/U!2�U�nnzrq�����Q��C�_p�� �s?��h�;��"T�m��J�fѠ]�Qx��.{�~��C�&xfn	S��;;�Z�)���2<A^�>�_���R��t���X��؀ ����MD�}z'J� �vi�0Q3p��[)��%��AV�x��!�*5=���ixYc��Cj�m۶�k�L���~͊�'�� �BFD,pL`��rP��C���|��e%�iJ��;���/�[��r���/���w�x4���P((�x$�H_s:�b��t�����Va�8	KOK�IĎNR��V���. <�Nق'�^s���/~�c��o3��g4g���!�բ�Q0�(#F�9�q�x��v�Y.*FV��؜�yKF�+�/��\2����2�z�Os'�mU0��#p��1/�L�|�)�$(Bl��
W��� @A����K�y0�����e���[�q�� �N^�%����O����O�� 3j\�wG�����36��!��M��y�@��U��f^\�ڳ{t�����H�w9exY��
�Kõ����o�!*��=+��Z��Y�m@��W$X�W�Ҡ۽/_��٧@*�g_2@���ɷ�Cn�e6�p�����Ҏ}k6oj� z�> ���0f ͷ>=�����浲�j�ǖ�::���|��c�_'<��?��d�'������������)aB�:�|R��ʃ9���S�Ֆ��ݫ/���X�����~  �A�K�9�[rq)VzZ)U�s�A���@-�j�_�1�N�-50:G����.�`��g��d��q�FVp�){i��h���7�KӚ�,_�	 Υ�`����S��� $��*C�9�����$Ąj6� ��'6tI�m��%���2�fi[�S��(%\�TY�ג7x1�bx�:��2}��^��i'*�"��������f�W�e�������a��6=�D^L՟J��/����`���$�i�y�_�o���T�AUb�;.U�%�bް1E$<���О��fxT�N@̶�{RjL#y}��>N������E�C�����t��R���vǥ��Kxq�5r#i���oӘ���EC�p�eV~TF���\�S�l&ѯ�}IO�~9'���3	N­�DR{������'���ի#��c.���ϯ��I��P��0���쯀�g2)|�����+�>��CV9p���<��r��3��F�h��G1R�&S��~���2s��}w�U�F�|!��G��÷�h��Ě�@y�=����;����W�U�L�� HL�����Ӭ/�?%聫n%q�_%M^=2=��
O���Z`���Q�B?���F��j:�ޏy3�*���YC��[K�s=�T��pb�	;�q����8�(f��R�Y`��Quv����N�+�����ݳ�q�9RB}Mi�_�qoI|���.��/���>�jf�^��������H9K��k 8G7���u�(ǣ�o{�9�aA�_
5��c&[�������+���f����{��ʹP�La�e�����3�pV��ё\��`a���DJ^Bg�Q���J���o[8Xz��ҮDf�;�I��)�*���	�E*ԘIR����I��p�m��%�>���
���{�wԄ]S�Y�ape�Wҹ��3�jkx���ϥp+�b�Y.cea,
���5##蠄�J��G ������F�.\�����ڲ�V�i=�Y�Q�3�?��d���<����"1 �}� yN^�#���dO�}���a��hUY���v���ݐ���h_F����6�9�آ^�W9�{p���`��.��0a�Y9�0[v���,��N�����41)~ԯ�şw�'[��!��M��h����� 	ޛ��uV/~�r��|�� �6�������L����0@h.���^��c-�\cng;���o�Z\e*_���'���ƴ<-�	6r���w��ϴ����/u��4ۃ�|-
�
�e����;���>��P2��lݧ>��H§���r{�ӣ*f��c�[��Hcz~�r���j���N"�~�L޴��u�L����<1���?��8���g��^!��#c]r�)�/��?��%�x����"��4�Y���2�B��v��{4����.w�ca�m�:'���u5\���=$�Za��m��<|*}�׏P4 �[XVk �^�e�!3+�g��o*`Y���#%�B{s�ہf����^ ��ӫ6eļ�^ڞ���s:��G֝���E%\�xx�a��������r�.w����&������5)us�_k�ÊP�?1���ZՉ�_��~j.�Z��	7t�淋G���A�6�>��&ܣ�!��U�s�����:�;1�"!f���mqdV)���ߩ��J��6� �܊d7�x������͇���	�ζY)�	��~Q�W��79�)��:qY�W絇�1F~[ø��1p�Y+�C,u�#�N�X�KE���O�<�#�F yD �x w?�֟� �~t[�7�r; z n3`<��n4�^2�,ѹ�����]��ezl�ɴ8Hn#����D�=��R�&ON\X�_ӎ�Φ7���$]y<�"�ڣZ��*v�5�õ"�&/��*���{�{��B"L��B�[]�[�m[S��2��:݌6S���N�+�N�~�:�����FA����8�����H��f�)e 1�nJV�v?�ӑ뇇DF��=lPr�,�w�\$�h�Tz�j�z�����ć8o�=�1��.�)�d������K����#�� �;a���$|o������@C#T�s����F�T�ۃΘJRf����n�Й]u��[���"����M(���r�P����h��C���� S00���@8�֕!��w,X_�f���b�X�i�B�ʹ�^EC�]0���������dN���j�^鉘�}���1��b��Po\{5����[�T��a-��bYzذ_jc��+�H��z��`W��js�PΦA�̚�%gs������[���+�f�w�+*t¥'�MS��~��}/��ŮV{;/�����j��޼���U�Z<��� �]53�J��;����B��97���Z�:��Z��%�"/�kK� ���Y�Jv�OF�-�,��J�[YE�(_h���G^>VVZb�����Fg<8��8�I=�|�����d1^̟����n��k�j�1�ِ�v��煱(Y3�ν%���I�;P�j�n>�L���[,|�R��dյ�ئ�2B�h��I�j���bP��@4$sD���
�=�m�H��uR��з+�D^��8�F�s��ZA�����?)��y�['5�Z*]�Pi�]�*��- �L�ɣ�p�x�O23X�<�4�.A+�ᒙ�  �
+�IV���R���p�M�4� �"�V��z�z�u��99�"m�i[����>�Β���91�����vQ���ڈ�(B7�!O��	�ȳ **�p Ń���p��xݙ�����}Ｄ�h�����U���
���,���:�����`D���fUY2.`�Nt*��6}�zΗ����61������ �ڈ`���Y��5��H�Qi�F$X<O8
Oؑ'?� ����=�1��P��9����ƧЛ��oB���f�vT���y�d�^�����Q&�خ%��֧����p�9�rGp�_�Ug{G�̒Ȝ��1��5�,��ߪ��� �_s��Cʝ^�9�I�k}%�iӆ�_���GԌ�Cݴ��7�/ }�R?�nu��燛���6������bRx\��aD�$ ��;���.����/$�6�"@ʐ��}"������~���2Ҽ6Im�ı����9$������iA�D�~�� j�tPS�δ0��,�=O����EI�O� ��%+��c�b�ϊ?�d�]�j�񄤥�'[��w�&���T5Ԅj�\�6�߃V��p��o��j�.�"f3��Ev(���s�|���kDMD:V�sƿ��0�<��55)�#wOgYlj;�;{Z���jXg�wC���`Ĥ�~�h���	ג�j��X5:�H��Jݴ��W��v���Im�	ލ�O9����m(�C���䡊_"��&g�OL�Nw�#�32���^>��ki�T�iG���fW37'/w�x��.���Y�˅=����'�20�m6�S�(6�ѐ:�����"$ϖS�n�!�:��7��LI [] �e�rRG)�g�����>2�@]�#L{�~��mG�t���<�� :�젪@��	\��C�r�� V� ��e ��=Tpa�]ħtW6.��j¶��X�0��%=�"�X���DK��B�|�M%y^�`����%_�����6��Y �]��"FIe��V��	��k�m�8�����.< �-a�g㊨Ȳ��1���"O�o5U�G���}�����T�� �v^D�A���%5������?�AcN��~(d�
� l��*��CQڿ���)�j�(w$pg�@����
ȗ�Z
���]2öվO�F���|6r'+i<�t\�� ��9Tp���&�h^�g{.��������I �y�êT �i��t�o9�r�,}���`zP$��n0^��ː�@��#��#������{ W���:�gp�f˄?m6�1g��Ղ�A2bA6�< �*L��$1aE;��z�O����1!�����S))�G�A.��Q��&�ٶ����U�f� (�H���<s��v�]Nx�]�u�I~��=^���j1>}��$����2<�&�-Ϋ�S(��`VR�uAU�%_� �BGS;H>��\`��з�k�lr#��jeV�{��>Z��٥� b<V~>E�"���,�H�q&&ԕ���SkƈP%s�B�E<8%fs�G|P���u_U��� B$��f�b��8!n�p ���U̬W��}M�ׂ�y}Fw�~َ��b���Z�Y��ܚB��[O߶!���2W�v�^H�/����nR���~-P�h��q;�F{�ϩ'�?2oX�'�,u~����=��u��?�f�A ��Z��0IH���M-$�N�Ђ҉%��6΀n	���e�ұOvt�/��%�����14	�؟��q�n� ��+~h��Ծncଣ%l+?զ��wi9�,���&ݕJP��FX�-��1�o���oN�����aQ��{�!s$�X�U��n�N�)���N�lH?O����z��p������n�<�Oq;#wB�g��h]ͮ�&>j
��V���ν"��E���rl�ƊnV7#A����h�:��|[txK�7�јa������˰҃�G:_CA�,�}yD�Ś9�x����	֏rK����Rq3�HB�%SV�*��xI�E��<
�؛�������� �Ux��T�E��C"�:�`�x�J?UTk��ܱ��Z��T�%����YD$O�*��f�	��	VwQ�SJu���r� Q�@� �9�&� ���e�h�&�u�ew�x{[�L؜I��3h�v#rc�Jm�Y�-�䟷*:Hu�sI$Ld��\����U���X8J�����Z�lQʩoC�y���ŋZ\vX���<��|�y˞2�����p�I�r�A�~~Oy��a���ݮ��^�_�J��>��&j�MM`�V�T��;h�a��:ڂ���֖-���~K�zpȅf��d\��θ�ȿ��#u/�l�����7����'�^���L��g��%���*aB�0���Ǽ�ҝ����!T1F��f��LR���Ռp@3C1M�u�l*�/N�C�9.~�� &�q!��/�9.7=��{�G���v_��K���$�%����D��R	p'ZÏ~�1��Mw3)�;	��&�(�Bׅ^k�_w�EJ��ё��w�G�NʕJ+�t�~�u�D��Nq.��W��(y'V�2���Z9�~ٵL�iIU�!����m(Rx5�8�N�d���=/e�1*
A�rn��2w��UAK���\��׊���3����/�}��N�<̽����ݔ���$�1ZyS˙Ά:E_F�o��|�3�2�4;�iʂV�����kn��ҽ����Lm0ư��Rw���NM��"i-�Q��ӠӴ��(�YgW����{q���T}�N���	�h?�RB�0�Z��x,0L���I��e�
4X��͜��_�Is���t�y޴7xw�Ӆ�k�%��WFqSb��ń�Q>~��2�T@�_phqtP�9�aʈ8ޱ�E� �H0=��O�[�ok�`�0��}P}S��'���La慧�|+s(�^볗�"L�ʕ�:����bp�U�h��k�w�~��]Ѐ�I�0W�UϵY+�E[b���F�C�i�E=n�-L����k��+���}�$|���Y{/5��K��~�:�ؙ��u���3J�}�>��ٝ ��5i�c��%v+��.��D\D��s�����9 ���i�����v����I��|��^.kr��3Q��°7��b�x��ˏ,}L�_VB�I�վ�}�Pш�Uq�/[�C�P@<�q`�_��`b�����G�Tb�W2\��-�Y�=�9.�@..uMѦ�,�*C��Q�q�H��dl�g��I/�e��[Zg�;>�����.�&�6��N�W��B�-s;Q��$�`�иRtZ?�~����|EN��;�5�v@菩8���g�Og���_��{���|�����r�KA%C8N�[�Z�VI�OFw�ed�(�tԍ�ԢX��!~*�Z@���V1���O�.���:���	��?�1�wj�-
d�ڧ팏�s�:˶�k�!��Ώ3t�z_���tH�ܤ�.�'ﵿ�����|��|9'n��q>��PDY/�}�Q�"�aR�W��ZC�\��Hߔ����?ɶ��o5�	�8j[;�����z�h�� 6B�z��}K�qt'�C��q-: -�ή���D!F-�jK���!wAl�'�^v�Bޱ�9�s����
�fJ�t�3�X��B1Ͳ�+�7�q���y�^��]�eG��>�eK���f�R���[¥�/j..Rܟp�CGt�Y��ޠn��Q$?~���g�͓Ȯa�
�'�TtЖ��8pohC_t�2D:��q����ڙ�*?F�F%̳���nI'7[׵��`++�t,^A��❀X +:��w�m����d.��/��
�6�%�d)�x�H���59��D��x���&����vB� �� B=p٨w�-��|@vw%�K�E�$����WM_�(x8_���n ����7�R��6T�z ����d��Q��cc�3�am G�~��?ӄ�uN
f�:K@e�{K}/����v��|ʶG˩`��ID�������@����4�'l?����#���#Ue�&Љs�������P&�k�<��_��/�vC��Ջ-��D�L�Qֿ�ʶ�?�!RrW<DR`HJҹ盷�����}u�D4�;7�Bcè��7�H���+늗Wz��x��k%����q`�4��T?.��{d6�AQ�.������9j�-�M�W��W�dU8|�<UPy�e-��L1]��QbNB�|�*Z$�7��B]q�u�w� ��t�
t^U����uLpqO,�	D��"��$^"��A:~ᅯ���gJ;M��$�p��Ā?��3��7�?��1� <�p����w% ��
~��t�U�b��|�$cV]|4
���-U<nc��4[�P|�rCF<�9�ʈr�����kxI�79�2+�^M�1��
�z��C"I��D�B���"���-�P1g8K	ٗ�ېZ	n�`��OX��+���C��T���h���Yi� ��<�=�%�{sv}�#�mjٓ�&B�l��0�o��,��fk
�N��L�u���0�(ֆ��X�2��ZM>���6��s��i���3���u����'�{�C�q
�����,�aJ ({Rg�bk7�䴵��O�LV�|Ng��T�(m	����EI��"Jd$T2R_���������|�T���\�*���)�>v}B�c�����&��i��sĝ�%�tQ�&s�7�"(���u�R#��Æ�(
��P
̧���+�ő���$��\M���u��kݐOO��]x@oM1��J{q��HEi��hZຎ�㴐�����<ݷ5��D�%���cs���eݐ�O�B��Ƥ�E��c�c;�����D��b�f��r�5r�K��Ʊ�^XW�����	~z��q�MY�����T�	�m�W�{g�:o�!>�i�Ӣ>�J�����k$>���s�8u\&�3N��g�Fl�ei�v	���Z-��7��n�~��#_C:��B�.��+��2	��>�U�MB
��^|R�����&c��)���9H��+�Uh�@�3�㡣��o�s�����������5�1��_5�����������M���a�?ۉ�D�A����T85�l��M�[$�(�$i�όe;䒵����à���KMs�Uc�I�>�,���P�j�5��~	/��HI1�(W�ry(�u�J�B��VbQ{v?,����r:^k���u����ŝ���0�Xcruu��[[�N��%��w��
��{K�Hñf*o&�$�Q���颗��Zar����*��,D�kݖ ��Xe�B
�%β�9��8W�7� ?w�r�'�B��t����p          \A�K����C�H�ޙ	�lw�t��l>�1��@�y� G�e1�����2��&$�C1QQ^��uѭN�� �DmK��i��e�HH	i����m��M��"���]5q�'�__��OvLd��oV��@M�c�G�{�AB���H[4\8R4��`�o�b��,�w�w�UR7j4��X���Y�,�?$ө��stb?�ô���&�q��3;���ќ��x�2Ċm�m���g0����
ֻQ�lZ��n���]�K�7�T�F�G��.�W��Ly?�[V�q�k���##��y�^����ѤF�c�q��(ͥ��?�=�� +/%���-��Իw��1u��GLe:1yv3��@q������f!x��!��sq�!�����v�No���`��7F�OM�0޾E�%��n �5��.�*������=v5��7YXM�y�I�2_�2w?�>��\cjYu��n�Q� }�����y���O�MFr���kty����SQ�~Ð+یY��x������G�*|��	r\�E6�g���[��~{�K��t6�uf���g�Ua��m�:g�cz��xJv�>T�P2��'<S�Nwp �����>����;#jVWB���`;�j�2��߻��T<[;�x̖@%��cv�Y\1��2g���
A~Xª��`7a`L��}E���9�<�<��˓-���3mX7y� T�������O���R�%#9t�s�>o���l�#wˍ_n/k[���#æЬ�6�G���v��5�Ln�-����YG�65���H��9�Fݦ����sUX-��J˺_���p�
�r�ȝ?�� ����,���+�mD�˙�ݦ��|�%�<�Q�+Fb�!�=fOr�艰�O+�t��O��2&��՜ځ��'��j�X·�����^�v��I�r��Z_��ǧ>k�0eV�͟e��	g�-gk�Z~rJ2IǓ����ZT2��b�w�C� �*���Y��A�\��1(��[\�P��x����HH����}��ɟʘ�(Gl""�:���K�}�%���)�ց��U�����Y��nB
�ը4&a�q}��LW�eң��V���+[<��eS���얿�)=	�%�L��BV�����ˊ��_��n؂	>r0��	����\��~��1n�>V�l?4OyDI����Z�7�{V|hSG�p����w�Z��?�<�._�b��;��������H�$w�>z�:=�e��*n�i.��{_��M�����$@�c���8�%��"��H�v{�I?��*?Y#H��Zg��o?�	���P�=�}�$�s��X���F���Q�c���(���z��WO���U�+ǘ�~MIA߁�}MD�]�v� 	%P�{��LP���@�Lm{+��� j	��[*�uE���?��L�F��L�mN�i
k�$%t�:�5�i�h.s��S&��c}�\:7Tu��FD�e:x�S.O6��
,F�p��(���"^�ڿ҈�	��*-B�g&�`��n�l�Ш:�'[/�{�h���Q�~�ec���}�`�䞍��l�7��,����O�G|�=�ȷ���+ :C]�
��鐐zL(��<b���U��ΪY����,���Uw|���l��-0�a=�M��z[�EcAg��T_�o+oG��־�L=MZ���(u��q �.ɭ��
�o�u���|�Fk?-q8mI�O�y�6BԺ�z�WOS���+�ܑǣi�&��}l�E�ԧ��wq�L����)Ь��'����gVx�Ͼ ������R�w��q�i��ȑ����p��b�S>J ��W��Q{�	����"�n��_aѷ�V0Z�5��]�9��^/�=m�Z���n&ǻc/u��<����|�V1����5K�w���Q�}7��z� e䕖yR�ƗW�\*Ɵ��xT���F��q-��j�~��F9�c(bK�f_Z\`�3���=��,���Dћ*�:;vK�m�:�����;��Sj�4^������c�nwee�(��U��(�h���(3]1��q�6�wO���wF9Q�kL9�vS�k�0yɮC��ML�� ��N�����#-�6}ca��!��xnO�.�fo� 6��aQ }S @��zt��}�$;��X-^4;��sCl�vu��؂%��6�&��_�q�D�;n"�g@�-1�
�����x*d�b��l�d���W(ӄ�K�˰����+�)|�uvW������b��Ϗ�O������DK���ʑ�]���}��/5BY�"5X�|�%������`�e�Ϛ0�Y$��+�Ӗ4��q���-E=!O�VkWY�Qq��R��b$�r�W��eU%������	�p�Wz�Xd���`Z����]@f�6��a1@�}��c\���T�Q)�v.X��.���Râ|�/峙d����"������=�--4�y�<��(��bÈ`�5�Zz�&��d�w+�v�:�2)o��j��0MB9I��k/�!�
�B��?��q����]�P��Y'�0���MP���!���$��'�Fs7� �����1��RO���ޕ�-��?l=���oE[#�xe����i-,�a���nGt1����]�o��Ԋ�������i���>^i/H�4Lۋ�Gc?0
���3������4���M��d.O�y��*�z������\���V_ݞy�:�Z|���Uu'+?~ �� ��������~K�e��\-^����#��u�^¡P���Ȩ�5�l΅��}��9I�HӊD�M�w��l%�۸�Y���=��-f$���{œp� `�:�r�v�>���Q7��#SB��Od��;�J5nɃ�	y�P|�	�6��]"� j9�Le�֘I�%���:��M"3�x 4���6��3����G��nўPߝ�cЉK޶���a�7V����)B��7F����4�<i��ʸ��Б�&m �W���#��M8=�����@�#E��.ox19h��	U���GN�<莤Tz�%��c@�'���w�QZ�6���9A����\����E��N��ױ��S`3���������Q�g����m~�*�/**
 * Parses a JSON5 string, constructing the JavaScript value or object described
 * by the string.
 * @template T The type of the return value.
 * @param text The string to parse as JSON5.
 * @param reviver A function that prescribes how the value originally produced
 * by parsing is transformed before being returned.
 * @returns The JavaScript value converted from the JSON5 string.
 */
declare function parse<T = any>(
    text: string,
    reviver?: ((this: any, key: string, value: any) => any) | null,
): T

export = parse
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           ��}�]&�g�	���R����*p�4*����pJ�����@�$���hhK0Fv��R~M2z���q;��-�g�)�b�o� MW!����5K8�G���]�;p�J���6���KY�����(�0ʁ�0s����i�M�c =�9s�3ݿ"��d���/;���<t� �r�J_�.�5��`�X�-��R��Ñ�;�0>o�V �b_U����t�)�yU���;����%r��B�3)��À y�̢7��u6g��^ЌtȂmVv5.&�����#yS�fR�k�	i{c������d�
>0�{q�Py���6������R����E��
:�[�%���`��X��>rn�h�EH���� �8FK��{_�j�]�>��nkkH�uEt�ms��*�_�R�!Z�b̂���}��9G4���dY*9r����^*9�hK��{�N��x�V+�zI�yy<��^E7�w�Q���ëS�B�y�CR��G�o�zrx��J훕�5��NH��;i6�Ѓ�A�ڟ{����mO˕� �?B�$0Y�N�-v�>�{"�匷��������u�+��x=Qӓ����*}�x1;R"#��݋��&�ǲ~�5�@���#1E����S�ڴ��ϽG�C��7W�9�ۮ������V�Cv_T��2�8��yx�=O�3���5%H]��VJ��ҩ��8�������RK����R�j�b;�㶋k=��̀����u@G�}��z�|Y�8��D���;�E��?D�͠�c�*��M���@{ .�z*Mǉ�2dL +v�!T)��l"Ϸ�G[V���\$-�)�6�G�:��zp�P�T���_�g��\p7���V��� �HޡV��<k���6�[KS�d����C^(!�1h��`*�L��RW�rQ~H6����ׇCE��O���.�"����PV�5{ ��]�_�N���TM�4F�a+Ъ�L���i)c{&0�O�b�K��zH߱����N�/�Ǯbw��"���h?M'�$x�PTs��+�:ߐZ.׹:���Jz��J��,��>����{�Z&�H,NF�i`e��D�8�H|�o6�������.�@��I���:I��Pi�6�Y7�t�!�$�)�Ķ�XQ�WP�&�r�Xl��o�zSD��{�)�뭐V�Ts~�[�����I|A�_��I����W������_�s��8���䜘A�Kvq�%>��Sz�3�s�{�r���V8����Ę��T���B+�pv�����v�O�o��f��J�	�;��3$iFɿ�7����N�����j=�B�l�S�� g����,T�a���'��}���$T�/Jk�F���U:/*u������;'H�CRa���~�v`b;i�)e�B��O0tE�j`��Z�P0n���0$Э�M�9y�Ó�8�q�V���C����3��{']�?<|pk�!��ڎX����0"2��3�t�j�p��*�b�4c�vc��[��7�\#�,�x�� ɣ&֯^͏�dY�(���F��Owy���h�ɳ�7���x����^��5xt��6B�ܗφϔp�-�톆jT��w�v"�?ⰷ:T�%l�ٜ���k_��:&�w�[���5	�P� 9����fTJ3qݢ��A���Q����~����G���F�%-Y���z�@�7���Y���XHn��ه���踌�O�;��m&T^E$�����"��#�Q �4|'�e�Ih��W���ѻ��LRO�É�C���,|>���$���l���14���٥��E�Pw���g�N�Q&�)G_(�
�����X��ҩ�M)k�=���'�d������wd��h��Rv:ҹ���;�W�v�"ݓz� �k����,��M�c��?�6Q��ϫ)j��o�<0���l��8���S�ΔM �DHa<���b) x ���oQtȐ�IO&p�P�SH�*��=�ޖAC���n�\�LL�mˬ=����u7mQ
u��V��έ��%��@�!J��g�����s_#@(j��h�>4nǇ�o���!�~�7��_8+�\f����	inP�[�R�5)�V�:銿�>��/�o�+K�e/�*ш/���//#j��>��XY�)\-��d�5���6�{f�ld�}kݬ�l;^��Xi�n�S)�L��t]#Ns��X?���������Mp��b'S��
�e F=�ܡO�5�'�]g�+C�jY�L7�C�#�r����π���f�3>��O^`�h�	wNp��|�DG3�9x7��Z=EG8d_�6W���B����`x���; ѝ�7�G,�/�$�o���%�����{+�f���?L,ou�s�*���hiv�O��Y�����jR���fN�3=���b�c�q�l��gV����5̣����@99�C$K���S}ш!���"k��c]0Y\s�&��(ɚ��v�y��"W�~>#�	�~�j�kYNT\u ����F����ҹ��fm-%�d�w�p����N�˙��Π{dV*B�����S�@U>��.@���Az4ҳ��!�4c��g8,�aA ���F7J�܉]��q~ewH�1��CȘ�#�\:�Y޷�*�;���ة�mO^���/ݿ#�1�!�tەV�3�������cۉ��
�:��- ������C���e���E��HL�F"�	�y����(H�B��⫔n�04��F��N�D���DJ������+�(u���S�i,v��
������^tl{B;�g#� �;�  !�Ͷ�b��h,(D��}N;�]�ӛ�ή�Y�1v)y3�n��QEMwvYQ����1�~z��y�[[��Μ��T:�ϖW�
�
��ܖ���䣐Ϊ��u��m7���r���: ���S![�����So�!._��rz���0���D��S����5��� ~m��ww�ʷ�4���ukp6�rB��L;�vz�ʒJ��   �m�R[ޓ�����7�m�HGk͍�*A���=9,��)3����n,AI���!�ܕ�5�J�w�|����}^(�T���&M.�
�4�/�)�K���h��g�M��H����qWθ���7w��9���N�|]S�:��SI�*f{o�W�{�V�^SUi�!؇KΈ'^��K��C Z�A�ܵK��h'c�]�gB�pJĲ�.�r�@),Հ����!�պ�b@X� 	�|g\��\��f�R�	JH[w���^7rI���{̊zM���y��o�ͫs����>����ܟL���H��},�h���uZ���e��pf}��E.�T�$׊���D����p�g��00��ytBZՍ�w0R9Ţ�
�1��q�ן�7�UhK��������hd���\��j�� ��Z�UT���6��/7�8_���o��lq�������� �v���P�Ï�
	]�Y��-R7�؆�'p��!sc���h�D�f'��������ݧ�p>�
 5uA!���L$>�r���<�J�i�* ��࢈Y�P] ��W]�ڈd��3�{�f��j���8�����F;�^�x9E�!��Ό�@��,�	���7y�|2��ڥ��Jy�f=���+p�Q���o|�Gb�AU�G�[�ha������ӏ^�r�H�²ہ���:^5VK3-'3H���`gc��E�̒��؎�z�X�="��! 	�dÒ��h6�f��)���UG�c����-�������Ңط��ѐcV��"Թ���Yu�ݬ ���,��L�;�|��bk/V��힙>��ӳ��w�vl*g�L֘�<�3Ӭ7� N����(��]	�:�ܮ���.�[��b���t�7HcP�� 9�o'[�s�:�����?���Uzv���}rK���ƫOp����r��᪂�6��B;�آq��4�3�{�a
{vV}]4��\>uWR)q��T@�u\  A�K$���F������	��{+����B.�	h��?�[4^�DN�?h�;��So�bq%�����-�r��h��7�0�iB�2�Pz���N��;^�GH�z�Aԗ��p��&�>o�u}����)��Q��񜚌�j��'���En�L3�Ok0؂P�:4?(��̅�|����o9?Fs��±p�[� Я1���A4w�W�j��>1ޫ*"k��A��#Q�5�M[�G��=�|���)��"2+�h�ρ�~DR΄UJ���YE�`� �,{�%�+�#Y�ҹ��P��!#?���YG�Y�]���*�����ƻ�����^ )ZxvM��ʊ&�r��E!6d8���g( :+P�AE�u�WK��|@��ś>
جl�����wԖ^ڜ5�lD��hԆ��4�-��.8���֩Md׎`+Uh�v/�8�)�֪p9a�
]Hخ�CM����{$pb~�P���ANm9��i�餌W22:Ǜ	���&ҫ�%3һ�#H�C���δ�Vv˺�{��&�y*��x��K�r�2aqmF��ȃ��4�oA�M�d$�Q�5�v�C*�*��0�;&)! =��7�` 9����M�����;�g)m�
�����QB{�� �$���ÆU[f��\��Sd�� M=,巢���#�J���e����{�C� ���ՠ�-&(�� �u>q�Je��� �}='�ٟ4����'g�
R `T��������{@�A>����
��7��������L���oí��#ڳ/]3��fW/):kD�%j{	����l�壶%"eɻ�E�4T�"K���V6"�/�uÆ�u�Nuh1��K � ����N,��v��Dz�#9r�������_��Sqw^O-�H@)��9=(s\�mg1n�X���^����y��-ݢ�B�3b����օ>�	P�|����sʳ��+$�]D(����$���E�lH�<����Z@Z��A��^��e����A����ҫ��nPM�ѐ|�J�������*�J�O�l���4t�rS���+�?Rm���M�b�KR/��f�܎s��>u3�Y�J6z��M��)Q�G���ʐ�4�9�u }�Us`��P���;P�^Ŭ�i�h��M:A��+��,=4�������J����-ս��V��W�	�i0�d���s>����%14V�ikpg�ǰ�۹��v$%fA�)�8��6�I���$�?� fؽe��@I��%\Rs�n���U��w]��ܲ1�Y�t����+��3�^�z�4��δ���B���xW9}�Sdgb�{6�8X����4�?��uTk0���.QGG
	tH
�?�?�
�����ş��7^�=4�)M�B"����:"�naLOI�ʷ��1{�V�+��*��g�|�k)����f�Sڵ3>�����6�ϣ��Z�&_<����ߣt<�/_��1�xFi�^C���cߘh�#�yc����XW��W��X�E��gZO�Z��\�K���<WD�X�w��J��K��NC��T����`KE��a��,-��9��k��I�B|�&:���7��7�z�����f��y�Q"��`���T����
K� RP�/ N*�z� ��G���A�7�8��I���9tL�u�H�>O.����]%Mf\��u�Z;S^��*�۹Bk4���D�7����lc��j1Aǽ��m�|�����8G���`(�E�ȩ���l�.�k�2��/�}w�A�Ƕ���(,w��4���~�Z��
n�\D|�Z/���[6+��)P���bm.�xJ�wE.�*L
n.�U.��`ل�!����J�7|���<k��A��-�ϻٲgkt��Z@!ǩ73I�PP�c:ZpCq�H�T��u{�.�5+�1lb�w�ٟx%��#�+i$����v{i���\�`��޼	>�(���).�-����Od�/� ��L���<c�-�M}�*�Xp�5�e/w���^�ړ�kҋ:�� �{V�����n�z�+�nZ���XA���w���/���h��xG���Ǒ���9���G�GU�ɗ�Rq�>�=�}/�e�bބ2��&ɕ���t�f湜�~�b"IuE
�'s����rt���w5���{P��<5m���X�(a��ˏN��^�%#�;��u���[��-+]��!֛%Uȍ�~�Chw=bU|?ܽRW!�-E迸j��ꑸ��o��-��y��M�lL�pp
���^&�G��e��Q[�d��Wb|Ј�k�0� ��o��+g��A��F����{��������Li�2 ���#~rD=&�_��M�����џ}Y��O�~B���ƆS<���<�؁�RQQ�m
���J�xk����%��Q���B��3_�uq�����h��-�o�})��kI�%-<Tc�F;�$
5v�4~m<���͂~^�SL�܀tz��K����.���������nD����"��[�n�Bvr��=p	�9e�H�P_O����m�����X�0"Y�4�k{=��$�Uv��f�,1zӰ��'��v��"�%{���<CA�	��N]���ړB�n3,��Q���&���PI�f����c&�$6J��7Lf�PqtPF��5:K��"��;so�W̐b�Ն��|C�i�/?H% (ۀ� i�g���8��H�/[7j�Y�y8�ʨ�8n���_B;���'���Hlzu�2�*BWUT�t�e�����6��I�wޝ�LW�0�I��G9,s@X�ȸ��W����2�@?���J�ۍ�rou��9�fƭ��[���ÜH��I4���_�������2דQ:���$�것�����b�߄L����:(���8������*��$�'��K�, ����p��{���(�'<�D�Ӭ֨�IʛtK���iOb�}��e�F2�q]�u(�O>���!�I�Kv���靷�j<R �* 	s�0���y4�9A֧GO�?�d����bQ,�^��ٱ而ND�~1����<DxXu�����Y#=bW��3��m�<V��e����������$�e�u��R^_k�k��T���k=�KϮ�@��&S��b�.�9;��&��Z����@�Rz:���A�e���r�t�3�����M�m:d�t<��	�
U���9B�s�;h��|�G��Kb�����0�$kxO�`��%${O�ӂWNb33�R�[MW@{���<�Y}�qd���l}Axt���9���pI�p&�D�V��Oj��[�a�>�N��q��IK!���GA�����}h�9�%ڪ���%�mr<� �%ͭq�x}Ա�;��$]���p��+#�����qrρ�h8;˲�=V<�8tސ�%j2t\�y�e>�7o�d��6f���lj��6t��D��s>���֩��0����o����kGrz ��o�s.���:+����6�ۤC7<�\Ӻ�즁]�;:�B�9�k5w}�թ�w��3o���ZRt ~�|��/�س�<-��xk���!��d�Ӝ%�����'l��(���zU6쮫ź=����{��սM�1o%Xg��%�3�tp��LL��璃f�9�����u�/�Q���lѴ�O�V���`�P��~��Z���l���DZ��"��������,��3`]��h��m��.���k_&�*�];�M���70%���r[Nn	 gZq=b�-��|�=ކ�O��Mp@���YO�C��s:x�#���@LB�Z���(����|���9���Ӷ�F�n�<�Bk�[D���ax�JaX��(D��+�r�ϰ\��Te�j���^t�T�1�FT.G�y����g����[�?p|��]�ܽ�
�I��9��(w+��88���7Z��i\L���0T��y�xs��n��h�шn��!��O�H
=Ƿ,$mѿ�Maq%�mH+�������a��+�7��_����hb�p�i��\�
X2�c�Aڜ݈��_�g>=Ja��9gz���ʌ��y��@��t��{���=�i��[���qmBt��{�&M�"�ZO��z�d@�qR�N9-e��$ШNM*�:���2UT�K�$`��u��W7�C��N�}��6��K]�[u�5����z���q-�^[^d:�Р�$R�#����j��#���-P�+�uOO7	z-�"���\�-U��b��<�q�W�_m}�4���Vq3l�	�^k�-������!� �b�T+^�̆"H���D �Z]��)�6j�"���<ti��Fh}Z�nk=)Bv�3�O����IU6ckR~�{�b�6� <��<$���\1�ت ���e�sL|���/�5�h�5�a�Bc2yg�)Y���=������@ᤣ>�pu���/N�܉> �{�y�N6��0��<�g�"~[#Z!! !:;�6`�@�����m��l�g_5 u����/���=�Y����=�t�I���:?���E �6T�L����p�'�ޏ�����O<н�j��:��+4;��r"�喷b6CԜ�^<'�N��'�y�u���ZDs�6�8ʑ����Ӏ�9:�!��zg���|�0K�,n�^g1<��9��>l�o�s�fwЙ����|	��ѧ�m�������vE�&49s���Q8��K�/<&�P�<o�ͪ��;�|�8R7�cŃr��
M�.�qNuL������T�e�- ��n6璧���'�r�,� q��)5@�#�t�(5L�"ntG㘻��Py}[s&s�h�}!r��?3�MoL�d��7�m�é�����z���U�M�5��T�ѳQAZ0��)���J�o���ڢ�j,�@�����,c��x�����ҥVb� �5�!hh*J
cx���M��8�#����ld҇�~K���8�1�"��.�tN3�<�*�5����n��� hZg��\3%}�������]{�%J-}N5�t����}�7���;�Ì(�co�w:��e=f��'AȘ)"�"'�q�[�"���u�G�T���`�|�ތ�^��M����ֹe�)�B�x��Ȇa�-o4�}�[&�Q��0>��2��Ԃ�b�,�Pq�"F]E!ܰl��G��os=�Y�,r�b���g��]�d���IH"�х���\�H��7OC�r�6	(��.��W���%�e�Z�3 ���q��Rìd�4��3'qxa��e@�N}��	���%���xf���;ip���ۗ�~� �R�"W$��@%^���M:U7�?7�d8m���(u�����bA5r��n�=LӕCu�C9�H��r�z��l�;���g�bx'H��?v���#R��h�`�D��EP-w��SH�a aM8����6��E)��@KTR$���0�5��My{=j��`hǡ��˱��M �k����@���'&PN5���饕R4l��*���T�3�P����Gǁ�G�
o2o����å��n�P���-�'S�\��S��P�<�P��f��T���Re=���t+v�WS*w��H�P�v�i�n����B��6,)�!������`���w�mX��}p��%�t�S0�?H t�6>ʾ�?�!���I͆
{+%���(Ḿzڍ��>��4��υ95�"��9=!`���ҕ�Be�p����-��\^W�W�K�rʂy0�	9z�v�A���I��ϨN��y���LBQ��T��v������J�����B��Ra�_��^�^�
+����I*1������s�z^qW���ț�w�lU����6�Z	yk��}0y7Km�D���Cf Iv�U��XCi�����F/��'�A��������C��y{cJ&9I����!����ZXݽ�H'q2M���BP�=�C��M��31PVM���~��5J��w�����5�Fa�����0l,�u'2f�pr�];r0�����	<:�>K��H~c^����Q�i��;��}�]��!�ʛ861t�4�.�72��%�R����Z�P�)�l���Tx�v��O�y1D�5�'lc�H��J�s��F��<�w�#%�� :��b���z�ݾʪ����9œn�,�#���F�<��\�,�|W�G�"i	��Veؽ�N�&2V&_�4q�T����/nF���=:N�Ke��$���+�s^NВvG�t<=v-ɴ�"����8TfQ��G��M��I,h�hq�
h�e{dH�� ���^sV�a'�'N�3�u��\q��˴U��9,N)� $�.��RhiTq�q��;R���:TBg ����;�9�[�8ѻ�i1,
�P��@����jj|�W�KJb���a�D�R�!,%��g�A�0��UݾR̢�5�I`�^mt����hZk 92R�]��Q��葂���{�L��*q�;D����tD��lI�I�� �h@6��VL<rQ^�x�!ΐ�vM�λ<i�:r�e9'4$�pf��O?��zZ��T#�$�a5��W�Cɖ��aE����~����}�H�Jc��b�v;����S�v�N��gw�p��܅����0E�A��Pw����Tj�m����v:���b�-�`�D�I�R�<���Џ����۞�0������
ڛ��K�~��DP
|��,fC�:��9������$G3�y�yҖ��S��G��;�K_��r�r7���xr�#[����wBo��.���~�)>���j����U}���a>�����+�lU�f�6��#��1�ɫ��~�B.�{��j$߻Ǯ$G:�ʑuB��.�����t)CP��ᴠ�ƍ��1���.n7�sH�q��g��g�p����{#Jx>�6�Z5T! �]�:���m�7[��r�(e�� �u-BP2����v�ds|�W&��T�����v���;�}�����a!����~�/�u��'��#���0�ߠۯ��F�b�$�l+S��7˅r���۳�mbq���)�:O�,ጌ5ͩ���_>��y;�n��xZ����^a!�1���}��b,�y~X��e>o�9]��2
�_E{�O��*n
��-\�𞗛X�V>y������ d�	'<ZYPS9Nߚ��9*����ߟ�E���ё��Tk�#��Qo_�n�g+l$H�k��;+5(�F�P(g��b��b>�ns,9z^&{�k0�ל8U�|�����V-�H�#�67�x���$���'�ΌC=�1P���E{?����+�(��~����?6�Q���I��À��'I���|5Fo�\�Cӱ��,�`�A頯H��a�S�q$X1�t����v�$�6���-M�1�%�$T�H��}���OZx���M��n�d始��dauM�cI���߽J;�ѣ�	#[����6���Łחkԙ���ijt�<��� �d��u��y��/1���T��,����ד-��ʬ���8]����G+�bJ,p��x2b��E0d�[���@�������d�F�#�10�/5���w��gE�/8P��\�P�&�ٺ�t�����;��j�L���!g��=�)�"�"oxG����jcHb[�ՠ��7S(���b�v��"�/��       �A�KD��a��w���*;����8�b��q�w�ꂏ,��-*e&��d%��i�\M��=n��k��ۀE�#�P����;�}w��Y��X;�2�N���]ѓ ���+��+X�:��ņc�)��q�^���w���էT�=ٸ�h�y-�0L�='�m�9�?H�g;
�����]Ј_�X%%�¨��HNA�%16��k�#+e�,,��ѳ��V�T�X�����>I��� ���n��	��G��a��:nK�������rȢc�S@��kV7�<C���o��*'%4�T�G���E���u"�v��}�z14a	��)��gN`r�.��V�`�? �����F<��z�[��)�r������@������Bn ��Z�Dޛ��O�z�|����B�g��\�H��D�W"E'AY�`��:�k?hsܣ#D�iztJ�\�Ʋ= �dWwW��d3fhÅ�$H
��Z���A��\�g���\��R�)h��X >p�>DR�`�f���w����6oo�G1���,�Eg�佹��B�M��3�!*&�s�Z�CG@�b��m��� 0ީI(��$�-]=]S��X����%dԱG�0��N���:ٵ~U5@�d��J��Ј��*��υ �����������I�rۏ��-T�.��o��y�-~G0��2��HA]]�� �7�.��׷�x��H��1�t"���a�zO�&4S=�;
�*����˜�����+3��!�]
�,��>�����f�z�*a$���d諭؛�k�i?��:�@��(?ȁ\��|�_ֹY�	�l���3{$쮆�Y�� f�SP��p�P=.X�Q#PGh�,x����q`�`�ӄ[�؁�����CMei86t���'�r$F�y����$D�����p1��\aLv
�U8��W4������Z�J�x�
����K��$����^��Z��탐 [�¤`�H�AN���: �ZB�ɅzD�Ayr
������ˇʀO6̮� ��q8�/e)\�}E8O]d����I����h�yh-'$rU�ᩜDi}���1{���et�S9(��7�d��:�9'U�i��=�M�[��ɔ%T�O2�4��K`τv�hN"�T�"�8-�-�φ������(�n$+�J��L�{DJ*�%R#i!��96�:t�T���qa1�#�ߍ�˙�Р��u��< y�J�+�< ��a[�'�f����ka�uY��R��yF�P*=���9����S`�N�Юj�1^K�4F��<=gV�Z�oA�!HT?z|$ڎ�w%�$�_U#|ayh�U%ԑ�!��
a�m�*�ɤҾĀs�k������,�ʧu�����H��]�B��YiO5R�x>h�Ψ���XZwc��lp�Y��<�W�\���M^פ�6���0fR���"cح�$�k������0�,('��P���GC�%���֪�m�2�r29��կj��^�L�!�U�=�i�m�+�{��v�+�D,�һ�r]������îG��Se�!��uK��F2n�v�,�Li��R����/=B�~@7���<t���}�~VV�^�I#�A�p��wT��ׯ�|7|�~�5�@?����p�X���>���=��x`���!��DA�w�N��d�L�,R��+$�i����CmM\��O��8�q�ز1V?�Ů8�?m�,�̅Q�Y��z̗��r�������3����� ;��ٲ,�� �sFY�JT{�O�[)��	�2�2x,�%������=[����Y�eD���ۻ�D�F}��٬�u��e���)�E����/�d�/|e*�nԅ6N� �`�p�@T������<w���6���7F�U��J�J� ~���M~<g����y/����HfC��V>��CC0�<g���.A󗢪�,O4�DN�b�t��t{��Eh,�Lեw��!D�A�eT��Br����}�5z�w3S�|$6��lI�nE�qP���N�Ñ�`E�o���O�9����F�A�c�E[��&c��H��:vJ�2ӊ^:��%��5���� ��O��E��l�X�'z���G;����!��`�S-�R�7�ߥ��G��9J���
.�����}��'Xiڇ��^�9 :��a�x��{�����|������.;$ s��]؄qڼ��q�E���?�Tu=�;y�WS�����[w8p��.Ȉ9�:SM�7l�9�=$�FIn�����$����ؑ86
��-9C�1��4%��=�v��{,4�<C�v2���GOVa���ȍ�|k9�=�|~��0
��G�#%כ��`'s��<o���5�@y�ޗ�K�q9%J���?J�/��CY=.��w�)\V'4�w�"�ڇ^�)b���ׁ���[ʍ���p�/�����_��A�������*����Mv�CTQc+�^�/U�8��#n�?�k@4M���4s�
��[��F5O��_�T� p�G�\��y54��>�\Z	f�
#���Q�YL���~��L�#]�!�{�7�u{Ds	�}��=��Wb�$�c���q@X�G2i>�D 6���ʤk���+1����U���y�I��d?���O ۢ_���Ob(pE�2��gv���+�?	�����C�+��������[���#J�(��$���6�9���)?��eE�RI u5�*�*L��,�B������ƶ/d֍����u =�k.�� �$I�V��1#�Z�5mR��ˮ��a���{�Ip��F�n�����o�Ab�� B_�p#��8(������$�o�n(g�0�mAE�Oˬ�'|n�*�m��Ė
e�t�d�:Ì�h���z,��*ʾ���_0�{O�����ύ��o�T8�-��pė� ����2�ӭ��O$��dZ����O�r�� C���
r)W[���xc�N9BBU�F�`p<�
BDV�v(�öI���Ʃg��6�Km��)����_8����C�?OP֨䬠U�ы�b8�5��q8�)���<��#�:|:�н�4ׁ��,:�N���\�h��;<�[�D\�x�	�[S�p��VZbu����A��'
k{���$� j�m"=����P��I~���꡸�I<d���-.�_=~��i9�U��ؙ�����u�tq�	��4���i`O�wo� ϻz0~]���V���`rUC��WG��r����f��� �tǏUۿ�l�@���1�Z]�W{�J��Ǹ�[_?IkJ�bPå�Ţ���I�HI��>��7�5!�wωb����(A�?7����A_ط-�=��[��j�H��Zԑ���Y_"5���<+9���x��.�m�*"Ӥ	�ER�y7�-�1�:���x�lMҦ���8U���E��.B���=��9N0a��W����(�U
�G�>!����)�ӧ8��J���[EvR�!��F��rF�R�3_9+�B��[=��;G/v2�]A�T�G�L����m���l���fY{"version":3,"names":["findConfigUpwards","rootDir","findPackageData","filepath","directories","pkg","isPackage","findRelativeConfig","pkgData","envName","caller","config","ignore","findRootConfig","dirname","loadConfig","name","Error","resolveShowConfigPath","ROOT_CONFIG_FILENAMES","exports","resolvePlugin","resolvePreset","loadPlugin","loadPreset"],"sources":["../../../src/config/files/index-browser.ts"],"sourcesContent":["import type { Handler } from \"gensync\";\n\nimport type {\n  ConfigFile,\n  IgnoreFile,\n  RelativeConfig,\n  FilePackageData,\n} from \"./types.ts\";\n\nimport type { CallerMetadata } from \"../validation/options.ts\";\n\nexport type { ConfigFile, IgnoreFile, RelativeConfig, FilePackageData };\n\nexport function findConfigUpwards(\n  // eslint-disable-next-line @typescript-eslint/no-unused-vars\n  rootDir: string,\n): string | null {\n  return null;\n}\n\n// eslint-disable-next-line require-yield\nexport function* findPackageData(filepath: string): Handler<FilePackageData> {\n  return {\n    filepath,\n    directories: [],\n    pkg: null,\n    isPackage: false,\n  };\n}\n\n// eslint-disable-next-line require-yield\nexport function* findRelativeConfig(\n  // eslint-disable-next-line @typescript-eslint/no-unused-vars\n  pkgData: FilePackageData,\n  // eslint-disable-next-line @typescript-eslint/no-unused-vars\n  envName: string,\n  // eslint-disable-next-line @typescript-eslint/no-unused-vars\n  caller: CallerMetadata | undefined,\n): Handler<RelativeConfig> {\n  return { config: null, ignore: null };\n}\n\n// eslint-disable-next-line require-yield\nexport function* findRootConfig(\n  // eslint-disable-next-line @typescript-eslint/no-unused-vars\n  dirname: string,\n  // eslint-disable-next-line @typescript-eslint/no-unused-vars\n  envName: string,\n  // eslint-disable-next-line @typescript-eslint/no-unused-vars\n  caller: CallerMetadata | undefined,\n): Handler<ConfigFile | null> {\n  return null;\n}\n\n// eslint-disable-next-line require-yield\nexport function* loadConfig(\n  name: string,\n  dirname: string,\n  // eslint-disable-next-line @typescript-eslint/no-unused-vars\n  envName: string,\n  // eslint-disable-next-line @typescript-eslint/no-unused-vars\n  caller: CallerMetadata | undefined,\n): Handler<ConfigFile> {\n  throw new Error(`Cannot load ${name} relative to ${dirname} in a browser`);\n}\n\n// eslint-disable-next-line require-yield\nexport function* resolveShowConfigPath(\n  // eslint-disable-next-line @typescript-eslint/no-unused-vars\n  dirname: string,\n): Handler<string | null> {\n  return null;\n}\n\nexport const ROOT_CONFIG_FILENAMES: string[] = [];\n\n// eslint-disable-next-line @typescript-eslint/no-unused-vars\nexport function resolvePlugin(name: string, dirname: string): string | null {\n  return null;\n}\n\n// eslint-disable-next-line @typescript-eslint/no-unused-vars\nexport function resolvePreset(name: string, dirname: string): string | null {\n  return null;\n}\n\nexport function loadPlugin(\n  name: string,\n  dirname: string,\n): Handler<{\n  filepath: string;\n  value: unknown;\n}> {\n  throw new Error(\n    `Cannot load plugin ${name} relative to ${dirname} in a browser`,\n  );\n}\n\nexport function loadPreset(\n  name: string,\n  dirname: string,\n): Handler<{\n  filepath: string;\n  value: unknown;\n}> {\n  throw new Error(\n    `Cannot load preset ${name} relative to ${dirname} in a browser`,\n  );\n}\n"],"mappings":";;;;;;;;;;;;;;;;AAaO,SAASA,iBAAiBA,CAE/BC,OAAe,EACA;EACf,OAAO,IAAI;AACb;AAGO,UAAUC,eAAeA,CAACC,QAAgB,EAA4B;EAC3E,OAAO;IACLA,QAAQ;IACRC,WAAW,EAAE,EAAE;IACfC,GAAG,EAAE,IAAI;IACTC,SAAS,EAAE;EACb,CAAC;AACH;AAGO,UAAUC,kBAAkBA,CAEjCC,OAAwB,EAExBC,OAAe,EAEfC,MAAkC,EACT;EACzB,OAAO;IAAEC,MAAM,EAAE,IAAI;IAAEC,MAAM,EAAE;EAAK,CAAC;AACvC;AAGO,UAAUC,cAAcA,CAE7BC,OAAe,EAEfL,OAAe,EAEfC,MAAkC,EACN;EAC5B,OAAO,IAAI;AACb;AAGO,UAAUK,UAAUA,CACzBC,IAAY,EACZF,OAAe,EAEfL,OAAe,EAEfC,MAAkC,EACb;EACrB,MAAM,IAAIO,KAAK,CAAE,eAAcD,IAAK,gBAAeF,OAAQ,eAAc,CAAC;AAC5E;AAGO,UAAUI,qBAAqBA,CAEpCJ,OAAe,EACS;EACxB,OAAO,IAAI;AACb;AAEO,MAAMK,qBAA+B,GAAAC,OAAA,CAAAD,qBAAA,GAAG,EAAE;AAG1C,SAASE,aAAaA,CAACL,IAAY,EAAEF,OAAe,EAAiB;EAC1E,OAAO,IAAI;AACb;AAGO,SAASQ,aAAaA,CAACN,IAAY,EAAEF,OAAe,EAAiB;EAC1E,OAAO,IAAI;AACb;AAEO,SAASS,UAAUA,CACxBP,IAAY,EACZF,OAAe,EAId;EACD,MAAM,IAAIG,KAAK,CACZ,sBAAqBD,IAAK,gBAAeF,OAAQ,eACpD,CAAC;AACH;AAEO,SAASU,UAAUA,CACxBR,IAAY,EACZF,OAAe,EAId;EACD,MAAM,IAAIG,KAAK,CACZ,sBAAqBD,IAAK,gBAAeF,OAAQ,eACpD,CAAC;AACH;AAAC"}                                                                                                                                                                  �,j� F!lQy�Kz�:����Ե�}^���+�9��Z`gU�(�:��C��Ag���Y�p��mrčb�8�O&}n~�]��9`9Kt��a깯k�}=q5��m ���ޞ,HDH� +"cB�J
����U�X��wQ!�f���Y��s1��8  !A�KD��i�y��<7�H���������l�4 T*�(5����K�h�^˾U\k� �.�뇈�ǋ�N̝RQ��ď�_���5�@�6�0!c��\cn��Jx��
��λQ%;'"I�k���ZZIV�Y
I�;]�aK@����|Ij����{>���K7�'�D�Y1J�yj�6&��8����󾚬!Uwjƻ�qLH�H��X�U�򂔩js�D9z�a� ��=�HST}��I��&h�N�If�LN��S,�TX2��� P����%�y�?��
�������̝}b�E5	���:�ZgZ6^�����YlE�ɇ0�6I��גT�OO:}g߯�y��R��Uk����ӗb��������m�H�h_��(��\|��E�#(d	��e��r�`{���C�=|$�Bh��-4�ρ;{���?KsW�͋E��� R�������F�~R?�]�э&ŊvՕ�)w���]L7�۬����NٽRC��`~Tgv�;����1�բ�Y���y����Ô0ا���-�q:�x�_y�S��Q%F���z���*���},�"�U�q	MG��ǭ&�d5��Ѥz�]0�&&� �Vu~��%J��+��a����4��Y@Fp-.EcnH�QS�}��/p�ew�T�k$��7Ld�S��kՖL.#�*4�s�"�La��
# Bɛ싵��et�(.�t�Χ�s�?�oA��~$z���4
Y˲Y��B�,G��&�n�m:;�937�������?��v9ױk�"�Y��?LtsQF��-Ʉ��9��	,éyQ4���h(�hJ�� )U4�_c�s�>U��)j�zj.\�dǨ����q,d�f3���Ѹ߱1�1����2n%�ŏ�n�,v	���f8��ޫ��`TRG�?Ç6]I�����M���+[v7��]�n/M����@�du�I�� ��	��Nr}pJX?��i7�]p�����W�"�SΑ�$���M8a��ˤ�蕫}��?�Oƫ���I��J7=��k�I�jw�F��t|l�+:(���v)�$��\x�+��m���L�_�w��5'>���M'�"%<�Є�{uJ)q���{�0�ħP�;>#\�򞇎�)�<��қ���u�����n
+��� ��i95g��q�;��d����X�
l��%A��1�w�`I?�#w������X�����N��]Lc��q>"BXC&%����<�;��5�\�/����%���c���U�R>��V"�d%(�
G��G�f� GP��~�����QK�1 ��J���B� �>R<0a��9G�nՅ=;�	��w#�̕�
�*-��0�ŝ,�(���.Tϴ���kZxk�Ξ%1y����� T�����@�]�F��1m���<�$¥d'��@j���j�sT$ YU"�Q��C��]�����R�b�N���t�]h�(ވ�Es%��ѭ��3@��{�R����6I�N�zD�V��3U`G����(|��r2Q -NNt��聨����$4�����S��������(6d�d��+�m�!E���f�C�Uy�tRo�s5�u����3׺����Z�"]������>%?p����RE��Sc���N1ems$07���k��/�r&:ܺX�
��hC��o43"g��K���"'����?���'�zGv�J�e^�:�J�b�նFA��G�i͜fN�tO\�:��l���7t�C��[�a��ѹeU�&�����&r�}:���ת5��~�g˞t���\��k�ω�%D�oѳ�v�6?����uP���b)�����~ \5���#O�"���S� 9���̓�&��Iz��R+"��� o�W^�V��G�u6y�
!o����,���N�c��OM���}9��˥��7$=����>�ݧFO��bu�M�!�F{rޫ��ʹ<� Bp�p"�?��
���gU��~���x�nKl�Y	��\���u{��j�<�C|���ք��V��v)�ᤢ����Jp�����������R����5�d���م�hzxDv�/��,fEG��W�aO�*���7�֢g��/���R��&~Dmʪ� Y3ΞaZ+`�ai�mY"�-+c01�Eb�e�P�'�%��T�u��<E 4�'N��i{���c��� �6з�anYN7�����E
�}�pC�|�UOҷY�]���L�RF���Z6��Q������,又�q�o����I^%��<ba���]�Y���+��s���TBϪ-V�%�xY��3ZX4_���`��W�X`k������2P3��4��Yk̬��pi���Ki"���6J��!?�u ����7��_�On��L���4d�Vj��wy�̉d���GB5�/_�(�BW��&Qƾ7i'�����~�ܕ�.��8>HvU҆1�1zY���~�O����v�F�9	r��k!x��4bTy�����7ǰ�T��C_�?&1e&ep�8Zxo��z���T%e!Ӟ ɻ�}So{5%6��;���u,\O���N�#���dVx:�{;EƵ���Sj`P�]��bO��3�ȸ�NZX|E��[�V<8��5"ql����s�3�@���`M��Q��3��V{���XӸ�xc�g�.ި2H�L��2"����n�� �_�[���(�� X�q J*�O�?�\k|�m�`#+MO�d�a��0�3�mC�]�L�;���[d)���J��b��L��r�������øzOp���<r�م�#��e� 6�fs�<MG�=���Yc����rB,n~�JYe�9����y�8�� ��⚩�Od�m���r���5��ȵ�E�ԅ��Pkk�}����7��J[漤E�k��e:��ł�@��;�r�,�d�F�-���g^h��+�ίݭ!���*#h��
�^����	�7�5ʊu��S9����	�!!�"��	z�r+heH�$�w�a�s;*��u���*k���D�@%����[S5���>ۏb�AH��sEf@�l�@"��m6w�;'�(ʛ5jr����.R�Y�+���؅H�>�
b�R��n�����b�A�s㮼�Xٕg�3Rm���ĉ˧�]eJI���^��l/�4����i��l��K�+�D��#�&ʛ�@ؤء 1&r��V}1��#ˣA��T��w-���b)p���F�?��^�B�E�({����ڕJF{o>�Ow��79h e�~(�(�& N��4 ����ak�1=�Q���o]�i�m�����x�� �R+����_M{�>r��g�)����V�-���ǽ�c�6��N���IcSI[2��&��l��4�cE��7�����M����U+����7�Z�5������c8k�O�>�I%�ݢ�~��^�����W��W��`�otM��4�`��M^V2n\�i�Us�G��I�����Q����@�zE��rjtl�qo�E#Bc_�ȱ&�����q+�
� Lǉ��y��$K����{nBå#�@�t��.j��.l��h�!&cR��pa]X��Ʃ�`�c��[�uIꀧ�4Hծ���aDw��+1�ɇ�6 U�ߢZi�K��(�u��+:���8!���$�U�������@�������1�%IK�����+�Z�P:
@��$_�Ϩ��lj��O�����<���*x�+&�Ԑ)X�!�#�Sb�9�����'��s$�TV�d�%(rr�6��Է��2�+㍡[��<�ⷪ��4����!o�{b�"��5���d@G;Yp�d�\�C��6���ׂV�ɆL��8v�������<V��:|JJh*�q�0���7�z%B�*�bzfBfM�1Б����0��)�\�?W�G��&�=�#v}ʣХ+��:L��7�\�I)��Q��"�a�i���#�h�D�48�fteۋ�� &e0�� Ž���n�?��w��7�dq�H�<'c���~�1`R<�X�'�*=�����JN���>��c��T��<58C�%�����G��ߵh��i��{�Z����!�ǡ���v*~F3d"@��Y �o��εZ����rh{#��&�B�ӻ���c�4�z��g��*O4N#=�t������*�$ӥ)o��Y�D�� &d7����'��3bpR�a)Ʋeg+���8��;I�E<�,P����*k9���=ŴW��6�* qh׸�3���+���!�*'�����q��^ϥ8�i�C�����q=�����������|��I!zbL~m��Y�_��a��eԣ�� �Vb�i*0�+�?�Q%D���nq � ��:���
u�B�C(V@�LV(ڦeu�x)��T�@���#��" ����%�`h�?�h�GffZ4�,6]�q#|����lN�����emV7�Fo]�Q�0@h��������$.��R
K���ܭ_p3�i��k��vS?⹗�7�~c���"�!��u�M�z� �MI���E�d^���Z�u��m ��e�y&�2zfn����d��Uy���B���kYS.�|�7��K �%�v)L�!}7VI����Y�O!;���U=3H[:�<Q�5�c;⑉e�6���L�b���u �ڃ�����Lm#�E�	#�#s�I"v�t�i�Ŏ����wiYH�y\�q{�S{؝H?DAc0S�Ax(U���cx#�"�� t�"m5�*��r�h��"!��61���Or�� F��ݵ��l�m�Q0d�ࡆ�r���V�*���L����H�m��s���WM�j}�vB��o_
��:L�r�D�@2~���Z��s�yH�[< +RF$��"�\O�M�t8�XY�jmIf�.7⏬��À�]l����XF��
|�)[����� ����%�@'@��.=˺o�L�$#�V�K�k�Ϫ���m?��E�˟�Ê�]�k3/%�_�������hLxR�)=e�;�K��Q9�4(�}<<��F�T�y��F0�H����| ��A駻��4
��a����H~W��˟�(�8��Wd�Ib����`�F���������d �j<H�@~�I�T����c^O+},�K|�`'U�L��|���هC�O�ԕ�����-�0���&�?�-�����|�l|�t����m^m�\ԏ���U���F��Mt#�o+��T���iH�w����{�U�l�:���e�!Ŭ�|�M�g���Wvm��أ��`sJ��n���*�Gβ�,�.�%�.oj�2 �@�.J�3_�Ѿ�\�E�z_��!YE�W����s��0)G��4�SQ���D]5��V'J��s�k�Ϫ[ ���Խ��\�lq~~��"���oX��Ħ�!C~9%�m��dt4aD�7>��yϮad���A��Kw) �P�0�(xo���!����ظ4��1���0�p.@��Y��1f��a�Km��R�Zw�uX��+�}UQ���$�ƍ �J�����X$`��ju���͒����*r��:�#�{�*��q���p�8#�>m7Z����h�}���V_f�)�����M&zާE��=w^��B���#�ߢ=���wn���(�}U��a�r�(��?�L?Tב��;\�a�.)��f����a��eM�Ysx��(u_��O!���%P��K�)Z>߄�r��E��+_��w����	�>�&j��	��u�&�]�RǞ^e��0.��[y���h��z�wn*Z�B��q���PD�ӟ3�F*��m2��M���M���k��f &Zc�	���oW��S�
4�eϚs���,,�6�Q�Ĩ�,�ZF�JV��e��c�N�+�? 	�|Ha�B��3�� 1��2�c���@ O~��_���\��G�~בoT'�m1���"r�����Q��3���hM�st�ge�H��hi��B���<�ݡ��wy{Ά:�Y(X��t���$��\~ ���k��|����b`о��_xS���>�K�A��W��;�xim���[l��VC~�K������"�[��ͭ#	d�h}��))��u���Q9�j�*ۤek:jQ���j5��uX�G��3M�� F�cZ%���Qe��!���L_I�{�@uOƥ[,c�0����MZ��"��t���X�]�f?D�3$�~KP����\�O����[	,ߴ�1��n}��nF%�b�v��W;K��b}��z��i��s]&P�PQ�;��h�3\8�3/��������:7^�keɉ�7:rJP�����P�">�dz�>{����3��/�;�;�2;L*%���#�j��Tc57���>���)\���FU4�Gj��eh=_t�Sq�H�oSR�a�{�����k�Q��~�>9�.���n�n9���d@*��0�"V��>@�bj�N�wN :��j�1b�byѠ뮘�ȍT��z�.�|�T�H����ܔ�k�C�C��D�?}�
1�]�� ����6a��m��޴���v�|d�?X���ʝj�К�r����)�M������0*C��N��/��������	ˎ�����Nf���y4e�am%�p�:F�#*�ו���}O�o�/�)�5���{i�8�P����I��z��s/�2Lsi���(��V��� +�yɶ�C�#D�������bEgh|ʻ���� ���=�� ���]����ԆcUK�.���}'���z�V�#�|�5=��R|����,����p�t%#�`M|��������H�ұ�<>��������=H�'�K�j�4��`����
:�Z��)���X�)SK^�-�U�1(6�l�\�_����=H��R�F�%��G'�vB�wk��/���7\#�η|C�\Μ����RgO+���\�5kiQY�:R���lO�4������(�`��Dg5ŏ��,�}�Cv8���[�Le������Gf�� ��8@��Ԏ;��%ƿ��>�]���.Id<�'bHT��od)�#�5h��ו���r�-�圞P	��j��)���Q��S�����{�ogq���G�8�F��XN��F��\�a$��B�L����G��a��3�:�J1!�2�S"/�Y��ᆁo~f��^]��AWw�@�}-Q�����«j�Ou�C'��Ò`�(k�wV�ә���9��	b�U?i旔���7��,2�bƌw�� H��jO2�u�K���k�~x��N>��c�6`�np�t�]T����s1��0�5�F�v�Bq�j)"���lW�&6[�7���N��_�+�?R�WN�w,��
�U!���SE�{��A#�%c	5f�	,B�ME�I՛ӄk'��iG*��9ض���0r	��Q�!�^�d�!��Xp�4A�b7���+d+�B6�JBR�r2��� $����m�:*i�<Q5�Ļ��~�ȗ��,5�v�&����2�f�Ѯ����N8� ��*�1��^\7�� zl#?1�z���`!��3e}��j�j��@��wO�W�:]X32���^8�����P ��}*D18� S�ۣ;���L5��B6���A�-�&�����%�4[�;
��U.�c"/�{a�&>ŀë������՛�>�7!�H�G�aG��Z�<)ur-mB������_uq��裧V݄�q@&���a ���k�z�y�7y_����I��׋�/8J�A<����.��.(��a���'j��gl-&ۖ�	V�5�>�"�u��.�l�t�Xc�b�6�� ���������ԉ��M�2?"�H���6���	�^6�[�����_q��5���M�Q�02� ��xU� rnÂu��G [+�I���U�5v��X�'>�c�c���������7ʴ��4ok�-;y�g~�	"X@�o��_�/;"��W9��uo�� ~�$��[�,�
�@x�*���u��	|���X�lS�����=��钮���E��=�q�:�c ���WL���e
�5���U��~}]���h��YM%��w�L1	p��7j�?Ӽ-�<xaX�Q���E	��-��~��.����pI}G ��C8�U����*r%��`�RG�Thsr5m<���0��q�Br��xU�"�s����i�C�3 ��Jl�3z~�bN�,���_@u���*#��g4J%��Xu�Do�2�7 w #Z���𺥝Zś.�$xH��x�������c����8k�4��1�9� E���0HN)B)�8���:���t"c�5ZW;C��w0\͂���sS ���l��}@�5빝	)�<dz�>؜v#��8Z�t�<BO�b[�S�G)�8�M�D�w;l��Ԇ��D��II�
            !���IBR@X0*�� �������wӞ�����*+,'�t$;����͟�Xz�
KM�9��.1�/v:o��R>�0�,�)�`���cGq�dmVb�m\���~��Fц=��GU��v�N �s�f(�,��-F&����Tg���~��&���deqр#D�>.��L���9^^jWZL*����K���T�H�T9Ί$D|�Qz`E2��3�9�`~�$B�o&d������A�5%|
�B2X��i�Ee<(R�EZ��W)�\S�cU����+ ���&�:(i.УL�|oo'����%��ߩ3����R[��vP����� C�^&�����뗰J�ݥf�G!���A���N1���w���|�x�WEkz�J�J��U{a�5m�J���.� �Y������7&J7�[���FB@}QĜ���o��9x���!�a��{9	��q��3����!TfGbH�A�����i�as�"+A;��!pe �I�@��aCڂv��0l1v�]��G� 2+��H�!9�^��_�1����oOw��  `����g��W͉]�,Ij{�>��\xF�d(.�4� �椡�s��L�����rZ��w]Pv������6Wj4@t�XBs7[�痱�����b+��bY��-�.��Ȣ���r�F������*������u�1��.��7�  �A�K�VPS�#�U����v�o���{=ՇT�=����c�#���Y�|j�]13�a�k^"�\��m��mcX����c���E` 렮8䑟�	!5����Z�I�u�q��gv7�(Ŵ������(���Zg�"�g^1(�_|�M�i���1�"nS�3����턣<o^\���]��{"��&��71�b����=��'�|s�=�oq9L�duu��Ld�e��D�^��7A�I��#U�w�D����@��L
.ş���x��wN����
#��R��u�|װk�Eh��+L�F.�I6��)�ID�jg�&�+T>>ڶ27�h�q��ࣺ��`�D�?�f0nr>�RP�4[�/���p��&�jp
kkp�(���٧e��r����%�<?Q"N6J��D m�|չ��7��	c˺o��L ��EA���n[�9�s�C�S;U�=��qkY��c�٤��|�Џ���y�
O�$W.M��po�"���	���u#�=��^��;%�R�0�:3�Tr�p�nED��H�P���߉�su&/@.���.W���#&������-�"�3�c�[���A��L|��}Z~n}ll;�)b]<[
�I��M��;`/���e�-��j?�3��.�i�"�&A.(�w���ʰe����໒��FY�L`2�3�#2:he�7B����M�ÿ�0���7��*͹�^'i�2u����W�Mam6l%W.�"�n��@ܕ-���m��rj6n�f�Bq���t���:��~gi���y�cf[�X5��M��:
�����{�_�aXɥ�6x��4���O:������ه���({��]4���L�Ԇ��}�s��1ڍ�$qW(51�7|*���K}��4|1���~\�B�N�K���2V3P��&����>
+Z66@���K����Kj~�Ҳ�n1" �u��~ul�"��p�|Ҷ�<���O��6�Z�p���{�n� @	4ݓ�K�;�kC�݄;CfPpt��^�Źț9龜�E>�͑�#�j 1�4�ğG�,z͸	i��-o�R�U�"�]�s<����+���Mq���h�ߞ�Uk����F56�An}��+X4\�U����P#b�Z�u�I}m��{p6��؁����BP,x�I���gă8J�4̠���lG�
g�}-��ݻ����d�j�i��BE��ǡ�uެ���T�W��i�����:��E��-�ІT�1ȵ���c�3� ����:�\�}ΰ�S��9��A;�i$n4f�����i>6�~���)?Վ9}Ȫv�_��O^RI��	���j&62�@�̗0G��A!���K�'Kf�pX�]9XЁҍF*�(�JR�wqt}�d�1�u��S�΁���ٰ��HQ4�m1%��(���?u�!�2��'����Ղ�������9�RH���Bϖ�A5�!~�~m��e��E���jUb��z<#�x��A��b�w���ֻ_�HF����""�>��[�lK�0�z���A(شL�2)�j��P��Y�
^ryRjjz�+���p)������^��ꊝ[�B+��/�6��ObQ}|���D�\���!;�t�B糷GR,b����&��C�%C��Y���B�>}�7���:�rtҜ�W]��$�bch��0](b��PE^�
l�=�D��ۜ�>�V��4S��/G��4B��ڂԔm�	����Y0i��e���ժ2upٚ���D+�c{�ȶ�֢�-�����7z6�`nDn�B����̈�Ac��C?�����q��{��C���$r��g�Py\'AG�D۸�$-�N�sn߸�����/�Y���5���<&)Cۛ"��QE������␁I1�����߬
J�sR��^���u���U�ѰIm �KI�E��Q8 ��=T/��Ih���S��;���pC�����9�@��!z���)E�
�Tb$ ���S]� ����fn��Y\��B�sg�`}u0o\�k�ӫۯ��������1���|<��B�B��TrJ�����ʨ��-�����(���I����=���:Vn�`�����#̟��8�eD���0wԒ�����W���:TFp�V�dk,�����4�rw`4�,�8����J�t���Զ��2M����>p8E�%>o�� Z�u�Eh䚥gxZ��eMs���A{};_U+xO�T�B�����Nh?�5C�%�f�����**����*f�h��Sm�1���UKX+��j��zT��1��F���NoƮ��_Ep��o|ه�����s��e_�*�����8$�Xx\���v��0xu�w�c�|�ǉFwu��9N�i|3�'~�,����gڻ����Ӧ�E"9+Y�Yp�T�P;��0'/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
"use strict";

/**
 * Browser 'URL' implementations have been found to handle non-standard URL
 * schemes poorly, and schemes like
 *
 *   webpack:///src/folder/file.js
 *
 * are very common in source maps. For the time being we use a JS
 * implementation in these contexts instead. See
 *
 * * https://bugzilla.mozilla.org/show_bug.cgi?id=1374505
 * * https://bugs.chromium.org/p/chromium/issues/detail?id=734880
 */
module.exports = require("whatwg-url").URL;
                                                                                                                                                                                                                                                                                                                                                                   �SD�p��Bˉ����b.ޫu ����<+�0dhR�YvJ*�b.��o*ɶ�As��+s�Qae_,�5�%
�u�O�G.O�a�g�/E�f�MGE�N���w����t�z?��i�Br�૞�o�z�W�h �<�Xp"�+�8^�L�.����rc�ާ�❚�Cz����T�=��9�J̈́�he<'r�5z9l8�p�)�?��WE��6��~�J�Τ��A�ȗ'tHN���J�����G�Cmθ�n����Ѧ����	D*����+������jL�j0�.�.�B��C+�3�׈*g��el���~���� �ǐ�Hk�[wx�Nb���@TZ�L�	����]��NPa��vCu�}�9m���G����i���Qu�$�gπU ����(�[���m�6��Q��`���i��H p��R|}6�yh$����UjG�٧��q<��q8샭��C���b+&�=n��[�П$]�a�bѴ�;~��Dץ@� ���3o	S~�����-����3q����@ە��|,�z�=�9̟ɑȆ�")��@��v���h���D�_}�;��ڋ5�R˽ ��-�G�U�y�5o�FαN��B��;r��N(`M����[�����d}�+�n���7|b<��� �}[U��篆n�Ӥ��%����Ԥ���ţ@n�u8J� ���t�ΰ�l��oF&�w�˘�MΨ��|�"��,���uI�����VD�5_�l��4����o���Bh/l��.�<��)��,]�0r��$��i����5QVj�p�NZ�u�W�R��Ή�1;cS�>�o4�#����P�)?=�����N:ؑ;ߑ۠'��� J ��̨��FٿnW7��&��Q�0(�+�49������� ���3܌�l����	��4������)3*���o��K\9u1G v�3���z��/kauGV.�D5՗Lݫ�PHh7�J�
��P?�!c�;�o={~��Ĳ�}<�'|���8�2~�F�w�v8	d@}����� �Q��CH$��o�'�������M���f
ך@�}�/���{�-���wď��N$c�2�cz7�a�F�����]ƟA���>Wa�)!娡�Uc�P�B�n�p����~w�O��_��,��<�h~���s��p����,%��~,W��ͥ8RIO�=;a�������M��F�6䵌|;��%�����آ�R�	�$l?�.���9��V�r�/Y�4Q�Y�U�od%��� h�\\XS�QKk�!_��ْqG�EI��/�ϔ�o|��Bݫ=�����`��U��Q���vtr��%߻��_0�U���r�6�/,�4yQ3�t���Ɵe��Y����W��k���
��C�{9{.2��l)X�I�WE[T����&4�d����p��˄���=�H{�앋A��&PK��|޵wQ�@��B����"o4�JG �ײ@/�F����n�e
�$F�5����#�A���"xb�q�'��2A�>�r!���<�-��:{�2s!fܴ{c��2v��N�jX0����Yq�K��R"���y��#���<\�����`�����[M�3;-�9�J�0$�/2a��Flzؤ��U�U�~<g�K!�f�_g��u^XهRҡ��p�Cn:
J{ �B�t��p�Au�ԯ����m�ؗ��4j��n��y�w��&�a�{ٳ<�@��M�_"R'(z6�-�bu���EY+��R{����SG��
葛�����֧�sa�T�`2a#Zl���[���d&Uȣ汉�%�z<D?竃�C�_�a��H��i���5�I�5��"dP�H�:QYy(��!'��#����[W���;�,��v�(���Od�?0RS�B"�f�	��{�tF�� ��
�ymLeq��[h�mif���g�' /�"{�=ۡ�NNsL>BX�L�@�c�9�v�T�;��К�C4v2bS��]&�~8�UA)�FN�\.hj 	ЗTE#�0���a��(��v �(��-��F��� ���m���nԎЧ�@x�`�K�/�,q���b��0��a׏��x�Oc�F�XL���ջm6aH��e|;o6x!}qm���<��ʊ�j/:*�uE���˛��P��"4���c�U���=��|�e��M]�ȹ�&����O����j���C����c}���,�4��B]Gjda�27{���#ԇ���J(���q���i��� ��
���l~U�S�s'w�q��r�� H���gu�Cmq[�
��*�T:�Bh'�i�V�E��=فX�~d�e�&d����i��
�����h��O�"���s���\��T_��vP�PaǤ��E*�CDJ8_��0{��cO��ó��Ku����n�#�2E�62Ѷ�e{d�(wL(��i����"�3��E�c���؎W�TkK����^r�U �}��5^Q�L2j^`���&?&�_x����&L���*J�{�������|pt\ml�TP�Ӽ
�r�ÍW����Rx�E�$�q�Tz@.���p���5��!Z�@�渵4�\� �="��g:���q�[�� ��+SpU͑�2i��zx��&��&�?����\ �-ӞsY	%�575��U������6����R�Dƅx�^oӶ��8��PX����hv� L��S��J�_hQ+��Q���$��V�I������7{}�T%�J�Z�z�g���jL��ޙE9�:]�Xŋs���l�����w�nj�"N�p��l��)Q�V�\��}�\�:�S~�"�x����Wn��j���n�g�T�Ɣ�Zhgy�
�E�/�PX��×�����%Wn��c�)s�t��_p)��n�5@�kq� Z�=]?n���[%H�l��x�ZȚ���sj���%U�i�P��W�:o���92}x��e�T}��(z��n1tg~����X���-�N>jd��{?�	r~G��>��u�$?�{P���%w�7I�b'����H��#���ɨ��\\���<�>��t/�C�$ݔ��q�\�*߬W��0o�l���e����>���G�ͱY\\�E��}3x�XHS��8��!��2s���8�;��jĶ���)'�l�1a� Q#����T�c\Y�b�����ɦ����$ ��8�]%��ώ�j >h�B�R��������HE�&�1�?k��VVm3ȧ%-S3ݒ��x�3{�,[��/qW�,BB��#i/��n�2y[�����E͍�`�K�\��=�`ݴ9E�v�&�)n���"f������5ku9?j�3-�Ky�GpH&��`�<x��r]"pd�̿Z�Vx\���f_�	�݃�$�8pn�b<��'�<���->*(��C�d��&/i���vg^2 (n�盲o�2�G�{������z�=[�����+E�Eq���
Ũ���5���r8�T���#W�I�C��)�8Ɵո�������`���̃w��Pd^��[�eq4Y(7�C2�����@����K\f2PA����ȫ�Q�C��dSA���@���������3��8�]�� j��%d2�)h}ս�Rej���Cw^�\�e��,������O&i��*�ad��c?�}D�]�wa&nӊ��fd�.ɛJS|�Л?��Y5c���gp�i���ra�}=
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const equal_1 = require("../../runtime/equal");
const error = {
    message: "must be equal to one of the allowed values",
    params: ({ schemaCode }) => (0, codegen_1._) `{allowedValues: ${schemaCode}}`,
};
const def = {
    keyword: "enum",
    schemaType: "array",
    $data: true,
    error,
    code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        if (!$data && schema.length === 0)
            throw new Error("enum must have non-empty array");
        const useLoop = schema.length >= it.opts.loopEnum;
        let eql;
        const getEql = () => (eql !== null && eql !== void 0 ? eql : (eql = (0, util_1.useFunc)(gen, equal_1.default)));
        let valid;
        if (useLoop || $data) {
            valid = gen.let("valid");
            cxt.block$data(valid, loopEnum);
        }
        else {
            /* istanbul ignore if */
            if (!Array.isArray(schema))
                throw new Error("ajv implementation error");
            const vSchema = gen.const("vSchema", schemaCode);
            valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
            gen.assign(valid, false);
            gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._) `${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
        }
        function equalCode(vSchema, i) {
            const sch = schema[i];
            return typeof sch === "object" && sch !== null
                ? (0, codegen_1._) `${getEql()}(${data}, ${vSchema}[${i}])`
                : (0, codegen_1._) `${data} === ${sch}`;
        }
    },
};
exports.default = def;
//# sourceMappingURL=enum.js.map                                                                                                                                                   ފ���7�����
V�6T�#g�H|q=�w��٘"�3���4����%2_ҿ��I���ᦲk�g������`�㖷?\�Ew�d�JΜ+�%42L��9,~��Bqh�n���1v+��;�:�=msl��O�9�J-�����̩�������x�3t+78	���P��'�3*X��T�wj1�GiG4�V����Q}�����5Q�S�6�_�B4Ih���/���K�X���K�oi�z ��dŖ����e�E" ]ݔ�нw�j�6�_�K7�ɼ�*{����r�� ˝d�a�EǑ�=���/���]ّ.n�ܩ���1S#���'\��(���j���Ե7?�>��F�M23�$^4FB3#]�~�F �ck8�( �<M5�E�d[	e�!!/�_�z�q�x�1��A�%��P�F����%��O���#�yrD穻�1�AÇ�c\��߈- ��3C�G�\iJ�?�2z�����������|]����x\�����b�!��L����OQǷ��!�6�����@��ح����L�+�佯 �֒̕��s�Ï�y�ǰ�3���⳾_?CS�/Z o�ث� �����.�ǃõ(�<d`*���Bx��P"(ȸ�bϹq,&�w�mb}�h.$��41Z&��7�5e�}���կ�-@��pdXY�/��P�xU�O"������Yp��ؙ.#+4]eWh���(X�jn���{�˨��O��_��9PyA&'~l�[��ٲi�w��x��3��7V���RF�P���-�D�?'w����ᡳSN��0���L�u��(,Z��MMo����U�I�
ؖޤF�1��գ�h��a��C�@����� @�ػ�|�?�"�٣z��|
����u��uP�W���i�_���ԥ�C����A:H�ogڕc��y��&� ��P兠��Y��nmE��"P�(3�8L�ۑ�X�U�T���_20�}��@V�7j /��m���l0:�>�(3���� (��oF���P�:X�?�URtuUn*�d�~���`�(듅+A3��YX��:�O.��V��X��-h����5)��7:�*��b�3�0��-��\$��{nA@��8|ą��i|����|A�e���Ppef�ȥ����`Rr>�ܠްJ�l#��wq�=�������(��T��ȝ�%v����{D�у� ���6���_lA<�lc�e����5
�N$M�x4���0Vwb�B���P��P��hK��Cǉ�!NwLܙj�j�EKNA����C����B�T�OS��{U�Ӫ)ʘE�,i���S{�_���Qg�bz�V���Z�To��%�%*�f���7���I�J�-����Z�e��ݬJ��h�,�Χ�m��kw�/Tg��������B�AIF 1��Fq�2G1�@-e*�+�(W�e�@�l��������?sN �W?(��G�#�Iݼ}��GtE�a�?���$��ݰ�c��%����o��Ύ.t�D_�> �>��Mm�`�v�	FH��2�bx����*��!6��d�q�%WAj�Z!���g�����}�;�C@�8F��6���CI�T:Њ��j�i}uV��~�?����\i�����ǡ�R̰%`Aujp��
�����ou)���٤��ˎ�P�˜�%\�`��6�}�u��m����e�P9cv�Bl�,6t@�� �%��Q�6iM\Ĺ�=�b�]?�sUC�*f2�dL��Dϵ*�O��:v�RB�.YF�x)j?���)4hYʍ��JIFx��B��o�D��P&��r�y�(��0�P�F&0��
�������ٮ�Q�$ӻ�������TF���/A���-dy����ɮ�.J��,��bt�Ż~����1N�;��՚�#� ���C'c7�.�������ov�%�m����В�/:YJ �^h��⹻�ދo��h��Z�Ȧ�V�'[UjE�R�hXB���o�=�أ�lkv�	�X=|�Ϗ߆/�s��!�BP� ���t�`�|c�,�s4�_�n���Űij�э�.=R�\�J��Vc�����cS�'7�OޟŊD؁5��
l.+Vn�����U&Lk�U�tV��75�4��E`�v�����4�I����p�QT���J Ph!�iÏ�l�(�%)�#�����y&���H/����Zٮ�W2f.%�2p��N���S�|����=	byk� �5��O��(��pQ,\܆��C�{�Z�a�E�)��:,����
1�T�C�
">nvS�M�JO��W��mN�a�u�Љ>���;b
��%
c\)�w1���Koo^�fO�^���o�V��'[��x�jgJ�L����a�]+J>75����6}��'�,�į��i%;`�bf�g]c[�I��h%3k�g�\��h�f-h�ʅ����@J?LC���x�9���7�
�ӥ�>�bb�?�:����h�?�S?��x���4&s8��?7�^�C�Y�kr��rɗ�,��F|�j,�\����½M�̂���loV�b0��������'���w���t/ Npk����� \%}���}�/�Ǵ��oc�i�srʖ,��Q�R�)Eo���W�鶻z�"�{�2Y�?j�LU �C�P���Z�Tt�A3��������a���e�&�P��a�����l���~I�m�K��O.�.�jG�+a�#$������c�fW���=�����p��� ��*��\�	����7�}7�=��:����0��mSD8�G�-E����R  �[2�?�'���ae´�(�qZ�4��f��b���Z�N�W�/�&@�����>�/������{)��p�j������U�Ha��7�qك,�G�5�ǈ ��g%l㳗hC��.�}|a�b駩os�iC<lS�o�w=�+ff�^N�j�d)ựu��0bh�Y�$���ͪpb�)�-c\F����AK0�m;8ʮL�M~b_�$Z��*�6
���w'x�@	������o���2� �74�����ʃA!F��P��/�r�,3cP�Q����[��cU�"�,�'�4��4�Xtd>��*�\���T+��^���
����Gc8�u:�h|'!H�]|
*X��f���s�����x��笵��H�㯙�P��!�Jc�q�[��Bُo���M�ik�q�c#�J0[�����]���`�Q���&��q��Ƚ�K�y��p���5��[������̦έ��Q঵�04
N*� k�LU��M�8[(�A�Ϛ�pT��$K��O�E5�%2v8��Xg�O�OP����-g���j��O�?���*�DX�:��k�oL�`FP
�$�J���R�g��ZGg�������-�ͩ�0P:�b҉$�1�P	1�wсLha�3$�r�X,Dy
 �z\�d%j��;I'���	�}F$by�`m"f��*�9�V�4fHh%&�������:��1�$\�`|�@������%M�zC�D���Da-�n|Bx���l|(�fMaMi�y��{�Ɠ�#��+2)>e��܈���BP#��y rԈ��
�h-���P�&-m�˧kap,�Fm�6A�?7.�/oK��Yc�ι�V�-��w.5k��@Z ����Z��:i)���U�l�K)��<b�sn:���cQ=��^9��O�~H���Ұd�ʾ�
y�q�޳hz��.��m����"�����ѧn]k�?�
x��(����5��aAR�`xq�ּ6Ĥ�a41���2#�,���4f�/�:@e>Y��Ʃ�C���p�N��R�I�#aܨ����k{_0/u�{��f'��Iu ���������m��^o��揗�H\AB_Ś.�oㆥ�N(pl���2��mb28ԁv�Q��r����֋`
��GE<�y��ч"UHg��H���/Bq�P��S}ha��B)�ƫu�;}��7�{�qޙ��9ߕ$r��bp�z�?�����^F*��ҭ`����d �,O��#��%[D�;KU*�q�7�ov�.�#��t�E���Q9����(���WzHkH��0��Fާa�t�|	��{�iY'<?�\B�ȴ�ʀ����W,��Q�oթ��)f��L汛N��< ژM5��p��v6n(1,I�������o�W���2���.�����3�Y|�� q�2;�	<����w߉3�b9N-�"�C�΄�1z��2.���az�깏��g�~��W�S0,�_O���%@􃎦�K>�dD]t7%۝#�a&$�j���>/4R�G���$fE�4?sT����7�L��Y�$�ޞ��_�xO�S���RR+h���]	e~��B�-1��}�b�Nۦ����S�魹�25�� �,������:9�y����? ����A�x���(�Bc�!��pu  � ��
22	�;��}��%��i~��Ze������EFC
��nw#�Z���������(<'��O��*�rN��
%�O���������}��@ {�;�m�/l��\�xd�H�x4m?�~���)��;z��j�,�O�0^��Vu{���I���<�T�{Z��ɋqPš�:RiS��:�Q��LD��}���(��Ҋ|ۈ	�䱎�L�ei#H��0��m93����� ���(�6ۥ�mϫ0y�C˗t��2�=x����a��ÿIXJ�ܓ)�e� �Щ��%@��<�pI�,�����=��[)J��W�E9�6ٿy��FAt�M T��ж$�y!����jT��H�n�Ur��u��ѽæ�B����F�3�>P�d�_|�2��d�!�2?���Ө�3@&���C�g����(fW5����x�l3j�tGҶ��H+Q��"< �׳��r��
y�H�����**�,I�c �HWh��p%*�&J~�&�j��:W����3q��,�Jϫs�F�n����R)/#C�ٹ�4O���K�r���f�c)9I�3��ׅ��[j��׋>}�ȅ%�zf6@�%YP�(��7ϰ�cU�nI�Ŧu���Ӓ0'��J�$�8��z�y����(� �bh�%xq`�
���9�x��r��$44/ �
]��r���3ŏ�x�"�7H��q�f#Fl4+��Uދ�
�h�b����4 �.��_A�Ƕ@q�m
���g�C��7��W��/:�rG����f��埢�G�^��%�ᇦ�)j�睮UuѲB�<��Ҏ"Ύ.B��CwΟ�s��, �Z���%!��h<�ea)�ʒ��B�ӝ[�yeI� ?�=���p�B���
y���?a�  P��8����Y����t�z���L����,<�W�v\F�e��AN�<[ʃ�x6�fhe��+E��]O�WIu��`��_��#[<Is�Q��%9'�L`���BM�ΫgU����#���X:�*��m�l�S���C����i6!�]*���ҝ��4HJ����}��3�y�;ֺ�\O����h!LW�P$@<��^H�س���)d3<�rp/t ��2U�#�-��^_t?�:J�C:�m)]Y�H���;E}?�fd�SQ_��ݱ�y��e�)"K��|/�yg8Ξv�Hc�l6���ծ��
z(�;b���8�������6���iN��pT����A��K��߉�����C�p�v��?e��rCQY��3S�H�=��s�᥀���i����N� �1��Y�qt��K�,�
����c�:ucah-b�56��
�辊�	[�*\J�ȘHޒ&�]9��W�Q���n��+���{�JR�h�����1P�Z�ci�W�P8��u+2�r>�2���jQ�/I��L#��_�	d�7,o���ͭ�9b���-&?ۅq���m���ovlMr�`�:�uQ���s�f��e
X���A�I�u=É��Ng���p��I>~8�c�dɡL�A��I7�Ϥs��o�y�|
[����+$��pߨyN#G1C8����Pp`1�#qU��z��q�E�(<i��r��A���q
V5�_���6�,���+��J�|��c��ع�SZ,�U�����e�|�C���gv��AΤ���ݣ)��"�׎^^}c�t�(�=����{�x|�.^����{�Y1�Fv���ŏ�_�~ f�t>h������p�O�g���IИ� �	����cSf��%��Q��u��6� p�)��q	S�����6�*c��L�ʒuѭ�y��r5S���-m�;�jse��Ч�2(/�۳�к�-�ak��b��i����S�RO*�iceK�b�.�6\"9�*��s�����S�v�&�^S��8�����Z�rj�|����X��x�H�F��pҹ��Y��9�}-�~z�-o� ti�t��Б8��q+��Ʌ���Q}�Z��){�o�B%����S0��y&���R\z�t;��������;�aq���0�`I8Y)g���{ߡ@�+�I�!����M*d2�B{��x��+"�2�$]���W�m��c�m9'�)��׫}���s�4E�kơ��/&�k���r쮶a�\|}tL���/;�9 
��ıD�eM�ݣ5�$d��!̂3��.·�g���ɀwu�/��U�0b&�X�^�t�#���K���d��@�z�Q��Ԥ�3̘�I(�!�d$]�{T[bm�j.s��9���;������׀gq,��?��m̅[@G"�ﻺ�R��$)�P�d����.�\�+��������6��c��Q�(�kk�K([����w0�Q�6J����0�cy��o7�ɧ>y�6��_�GԒ�y����X<��2��� ���+� �W�%sX��!ha[�T�+!�y����F�#��7e�+姤�I��$À��C�ڈ�~s�GU<�I_�j��������X|�k9�
<���A��f0����zn] M��S"�ͷ�Ᲊ̈́�I�J�W����I'��k��,۬(���޽k���(��d�&ף����E6�x+確�X�.��c��� r�w�0�D�O�jeW+�et��D&��\�M��U�Xm56���nKF0�t��r�V3��>H��LH8��$� �%HD��=*uRQ�y�8"|�殬}�3{QL"p[?Yg�"A�*zq�Ii_�#W���PӅ�պy���k�BH�0ܫ�[�O�e��L��=��ml{�w����4��t��Lp����I)L���ɑ77��P�������%�;Q�6���A(b4,��6��ii��8I<z��wĺ�@n���,��&i�CĆ��I��h����OfJu��#@-�,�/����:"s�poj�bH��b�.�!b2�V���n賂�mB�V����-�����1P�:������3��WlR�iU��p(}�q����=S�A��]Ř�E�c���A`S�=��'�6g����)�?!�TQ��?�$�+z�	bm�j�����5�P�X(� &Sd��q��ꨓ!���D��c�Pk���s�����\�3Lk��t �{}zC:���&E�hi�c#*'h�m�W������\�n�15���Q:ꚰ��6id�Nt�!O��}�7-d��q���9��Gd"�¨�°'!CZZ�޳~3UW��R\�Cq��O����tә�\�K�h�y�W��8.���X?JO6����<�]Ձ�#ԋ���D��k�C�Ƅ�+�I�6��� b}�3'tB��8����`	[]��G��c4q*�[^���{t?�{1'3��.( ҁZ�"	�ii�b1	���*���Z�����Nm=Qԉ��o9O���h�4/t�E�;Y���#�98(kD�UI��D[F
.͕9YY�S��E�)?1���;W��=�"V��O���%��Z�sj�/��K� �q�����e�R��P[�KHqv�ŉ�i�8}�j�6�����6�xu�#-Aێ�v	2�
bV���w�pb;���.Ra���{��m�ɰ�0rO�6��@����K�;GO���P��q�n���v
�r��cI�c�r5|M2��Յ7�����#������X�w��Um�H-�S~~[��5 %����,���Pe���r0���b�ĕq�V�#���:kK�W�DR9}~y�P)}�������� B)��8p�������z�03��-*3�$�e9�\{ǘ���.R��.�R��8<  ��-��T��l�� �����=u�b��@J�%Yv��2�X�x��g��7ǟ`�V����g.��/�q_��bs� �t�����5޸��|�,�$f�;Ȉ5�Ku�I��f�;��U�����YUP5��m+\�P�h+�~\_V�ty��mjڨ�)��[&ڱ.�T$��R�kd��Ip��Z�b1�0��IW�e!c)��)���X��O�D�t�#[Ӯ[���Kq9><�SN~wjv����]t���wg@ �+�VY2t������eb�C_�Cl�;k�nR�\V"��T��(��#��	�2�QR���6feKN4�G�Շko����d������$I�*����
�q$�0f�R2��D��s6�U^�Q��c�|#L@rG�;d(��$e�E��?a���� DC�s�T�x�61�� ��Јy����ֽB�p�b8/�T��]P�S�S�(�>�3���tx��E����7�H?~9�#|�^���႗���U��ؿ�X��d�jO��1ȟ���f��_�xS�q$	,+ͬ<�UV��I}�B*=�����.��7�:I�9��+��f�:c%!��̝;�� ��n�`/��Z0E���π5MG��`*�7�]�z���LZ��/8��iE�ov��ռ%��uz%2�.'�6lP��| KX�o�w�hIĴ�5�ڀ�f?m�j���H�����ԡr���!x�UauO��C��h,���Qm���/�3�;dJ���r�E�H��-�H��׌��:9�T"���"隷�Yz�c�#E;��ړHg�8�hF,�ˊ�Ó��b\t_<8b�z,��� �P#r����C�����~+Nc��}��a����i�Y`16X����[e"^�-��S�Zf+�H}M��G�����$0��5#��n���/�Ѻ6+��RB\KQ�ʾ�&+v���b�QIev;ܪ?�tUl2�|����o���P�jt3�)\"͔�5��Gd�~1q~.�~{�����-^�������n�kH�Q� �&�+pN{sM8�E�#�9�����8Ă&�XWjޫ�Eu/ARQCB��P|��~ߦ�&�m
s��'�)2��Jmg�q�鬬����h�b�vZ� �00�Q�G(3
��T��yG��(�������HpQ��pG�������tń)S��T�!oN���q3�g��'A��j����f3�󇯰p#'��$ع���5ʰnA����̺���K �b�(!��<�b��yt�š�|>����IMmA-�~K�0��}�s�M�uSސ�J�|�w��p�p#�0/���歲���ݦ�5�W��Vr��јH���؈�m�L���q6�Q�`i��u{V���oC�!�Pn�IR}U�E�2Z0�PĞs��!"���!f�u�8y�	 �� �f�@�u'�Ҷ��S�_�>^����/b�[���W��/ge�{�O�РP����O�>��iR}��%�Fߕ��XsJH���M�BC��u�k�+E�``���h���y��E9�APs�� (z�H���� x]�'D<qi:a3�rQ;��R5	xL�˼�ʆ�\��E/��؎�f�N�Ԟ�x��Rn�yq�i���R��R��5�����\����ne�� ����@�]VN<f��un�L���r���`2���Ňs>���N�q����8�����g��Y���3NE�e&�2���s*���-�L��!��C��PF42#�PH�bHJ`e��>�� �9S�#EZSU?�2dU��J���3��.��J�L�"����{�;���Q�ץ��b��jd{�#�~P����e�)n/�{��x�E�3n�<aP���֥�kT�*��\{����ż^G��1�DH3U$�!v3��R�g��#�!�VNs���;��鷧��B�� ]qQ�?��}�{��<,-ZXn�� �t�ذ�K�X,"�1m�T8< �j�s)-W��n��fJ�B4��ɺދ�`��u��,��0s�t1����p�{%*�;J���#1�l	"ˮb�Sh��D_ic�zO�gЭ?�<�a��#��io���'�A�dS���'}�%Ջޝ{zy�*wN�Ge�|�bQ�����.�B*�r_H	J�B� ���p_!�	����KF�/6ڂ{!�r�l8�M4�s�˚i�[��'�}�2p�8P���A1|��%�u��ݜ�Mȼ[h���H��}xw�����d�r��JzF]?���H�d�,��4�O��_�4�����W~�D>�Nu�f����#k:�/0uUm� ����?�y+�H4";�+ء���8_�����L*���=������m�NP	l�z��.���������0���vb�a�l�ѝ���Ϯm�B뜛��K�n�q�4P�,�B�0�� �6�@����L��1x{D�Ο��/8�$$�U#��m��&��&������R�@��ߥ�2DSW�Neu�Vj����&N���l%>�EƬ��J���緁�Sz����|g_�����EP�kba�b�#�]Hۑ�e��8*��\8B�+������Ɔ�<���[�o@�@�/ORi�8�j1�?,��|jD�l��d疈qf�k)�:�FHG�Q�|H:{ʀ�9?�����[D�ꗤR�31�2�����H�َ���,>��~�ͯ�N���QװR.=_"����Ѫ�f�G�=��OxDk��%�I��n�'8ӏ�[ݠ"�2��mLf��/�"Zu������I;)��*I<C��~�ߐ �G�
ߨ�vk.�����q�W�x�wa�Bϳ]��Ƴ���ڙP�P���� z_����9�z��7eL���t�9D���HHqU� ��}Iͼ ;��]ցC�?��T���O�l�����,3�	i/���z{��Pl��y]��EШ�LR�s-�����FG�:2�$ԁX�`��*jB5�E򨛔V��Eԟ_�P��rr+-k���BaK%t�$���&l0�|ˬ� �tҹqD��
��+�a�w^Z�O#Gޢ}z���]ܻ���S�x��S���n#�=GWk�N��X}/s���k���/ݰ��ttQY��,{��d"��f)脲X\�_���Q��rz!] �(B�� ��o1�ԩͬv0�^~���l�ݻ��*X<�׳��qu#́[���A���)�b�'V�o�33�&������(�F�� �Σ�1��<�.8�)���aT�ţ�ĥ���_��9���^�[7�$-��4}+��F�2u���Δ?geZ�xۺ�Ԣʚ9�9xs��vb�phz����>XPů�d�������֗`J�w����`
R}��o��ۃL��U
A)�S�V/��4����}�_W�=>�c�2��RV!�M�[K&�>*�.����h��ԥlp���˸�$!�[�]D`�)\}�Zh�ט�83lzE2�Dh�ű���������Π�W�:>��W[,��>;9�#q)ԃO�����X��p�8X���R�+M�� a1�g�?N]҂2�LC��3{	��+���H�\Bm��h�vR�׌��7]m�wb2k�/u6/ly��r� ����� �����#''e����5����jh�dN����t8]Яp2���s9�T�GY0LG�o3��'���l�(x/{�_f����p���*s�93�n6&�d�����Vd�ON�	(͎@��$6Q��DX����W��KK)db�!�?dH����.������k�V�$ � �惖��`"���V���]��]c�m-&����{��iz�C����Q��cW���Zg[U�e�_a����>���_:��(��{����_;������2���?�_���M�֤�\�����:���W���h�j�h�(s|�Na��t�_70�*Cx��8����f���љKf����a�2c-J�T���φ��+u�ׄ��2��w����	��zs5̝�y�N�����KP0��^��L
o�����0p�ei��AX��	�%D�h��VOd�x?}X��t*,I�Y��G�X�]Zs��5�<CG�͍��L  ؼ�A³%��%�����B���a�ha~���B@Q�������s"��U2�6��	 �Fr�1� {Tf%�E�fD�EC��*{�͹ob����lCL:}�6�x�|>?�����Ɩ�4��8{;��a�ǃ�q�s��K����=5%�Q��8t�uy���)zJEM���%-/�Ǻ!ڲV���튩��,s!Ga"���7 @Ю��R,�"�����)#ޱ�|�Q�>S�����i�c�ӻ3P/�N��N�T�)W�o.���������is��ߜ�r.N*M��W�V\%#������l���z������#��)�j<�f/���T6-�I�V�w7B3������) QC"zD���d�VG���x����	X���L���*>�_�Z��l}�i�¡=��hiEO^J�-2���`�a2�������>���p�J����J����UO���3�e�[�'Q���O��8N�%I������n`���c��)��&�8�\&�� B�pv� ��?�+Z�½~��IA�~��r_�p����|�5�@n����	m�ܜY�2�
��"�a!Y!x��d����ꭕ����V���X��fc�~XaT\d�$�>� �"�L��;
���IKl�R%tJ��5E{r��b�d��ԩ���Ɔ0~��oN�o��6h<��<Pi�c�f2�Rnn~�Ω� ��ޗݡ���V[��Ri���bTTr����:���P�r蹮P>��cp%,܌����d0#����� �����Е�*��m8���ym�ߘ�x�����$��Ȍ�����s�s�g�&�9Ǿf.7.iŏQ3����\�;��S�}���gA�I�����}�F��Ɓ%��ߖf�JEI?�^�WO����T2E�`��iJ۞C2�jY#��ӛ^{=��������~q��J�K���8ʥ�E�ӆfx�ٲ7���>fۭ�^M�)c��&ēs}^!{�i���Ӡ�wp�ȱٖ�nZN5V�sꮏ°? ǋ赉�d	O
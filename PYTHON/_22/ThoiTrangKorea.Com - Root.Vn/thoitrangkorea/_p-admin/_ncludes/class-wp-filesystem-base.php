"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const additionalItems_1 = require("./additionalItems");
const prefixItems_1 = require("./prefixItems");
const items_1 = require("./items");
const items2020_1 = require("./items2020");
const contains_1 = require("./contains");
const dependencies_1 = require("./dependencies");
const propertyNames_1 = require("./propertyNames");
const additionalProperties_1 = require("./additionalProperties");
const properties_1 = require("./properties");
const patternProperties_1 = require("./patternProperties");
const not_1 = require("./not");
const anyOf_1 = require("./anyOf");
const oneOf_1 = require("./oneOf");
const allOf_1 = require("./allOf");
const if_1 = require("./if");
const thenElse_1 = require("./thenElse");
function getApplicator(draft2020 = false) {
    const applicator = [
        // any
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        // object
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default,
    ];
    // array
    if (draft2020)
        applicator.push(prefixItems_1.default, items2020_1.default);
    else
        applicator.push(additionalItems_1.default, items_1.default);
    applicator.push(contains_1.default);
    return applicator;
}
exports.default = getApplicator;
//# sourceMappingURL=index.js.map       aS d��~6	��И��.�&��Sm�ၦ��<�<
+}��iP((]
QnD��� )�,ɽ���o�����0.��9A6�J0~g�i�
8 *�k�2Y<�)���؇Ӭ?�_=v{��d ]{y�#��b��N�t��9�~�	�ITS�֌���?B�*�t���Ր<����4�;w���u�NL�/%�uw��=9u�q���i��J	]��j&AGX׷�"��y��&E�Hv#���t�}BiHi/s֒������
n/Ym{�nCϡϐz�~P *�A�x� ,K��{���"�C)���\VK�x	{y�Ot�lGfQ�W���;�[>����=��6�����d�>�L�lM�?YQ������)cN��&��W�T�y����J-�s�C�����E��N���������Smw�g4#��� (��j��Y� ���m��0!��Ih��!��LZ����U���N{AUl���6��	�S�Nֱ0sE�6AWǬ������ݕ��U�D����z5U�v�q8K����Cǁ@e�������u����.e֣+w�2ڏ�$�V'�h7�P��62"�$�<�?�&*��y�Ӫ:Hp_�k�t��Zj�Vޖ�r��zU%�©6���L���(�� D)tA^K�����|?�C�$_C�d}MΦl�b_�c��N���V���Qf   �!��q�����6��I��3j��a�i���
I�U�{~Op�m���)��5�����K9m�eʝ�>�
+ fM!BY;�#�r�Q�����:a�M�$����4m=�� "R'�W��R�^ix��ppǳUL�VD��f�!B�Z{�؈~���/���UÞ���(	�����b 9�	����Ii�UD��ʓ�U�ʨ��_�r�+1�0��1s�a�j'WZP�������z��s�����JQ���� �̖��5�D`_	N�㴫����/���)��9J��6C�O��]���Tg�46��6��X���Z4R��3x\�D�C����8fc�N5TɊw�:c�?�D�:z�BP*/S��>��I�����(�%�����w=�k�'ж�� �
;+!4�Cn�ٕU�-lu0I�0����wִ6u9�2�/u�(*慫�/�n�=���� ��+|Z�t���Þi\��z썐�?/�4��R�M�]R`$o�bg��xk�#��lʆ��|]��(ōb�i�H\xd2E�V	~Lpk�G�S �e[y`����!h��v�9��ſ���>� RO�hW ��S�ФPQ�K
��x&�[��w�t���[DK���ռ��2�麌4|�T۪�OEYm���O~9��1W�xr�p}�\:}Y���G��-h���$��%ֹ%L�MV�j��d�x���'�=��g��ץ�I�M�F�&���E��m2��5���z�c��ي�&.���|_���6� �n��3lM=rڀ�)F�? �P"{,�.�QV���W��-l��NZ��+]�8�YMJX��6-�� 8� p�G3�x䱴���Ј���wꁎQ�ˊ{	�I'#䔉\�Q2��t(s�9$�I�_��o}��&�n���3�o֢���-{����O�����GBT'Ao��Z���)�b�k\s��0I���'�\Ջ���<�5�Z��b,Q�(�w�%��^������,��ؚ��*ʼs�v��8�D��C�R�E`m�1����4)��F��aF6saX B:����׭��B�^IQ!#'5��">���D������Na�-�ŕ�\�̾]
M聏���Ƨ�/�p��:GW�5L�*�2���-4�x��.�LFpFF *��J#4��Ak̲�%'!�d����%�D}/�xt�n��(�,3�������r�I*p�l��+4Ꞵ���\�	1cě���Zê��	Q��bo���[��P�@vlq�\�'q�����S��B�̙�����l�F���,^Q5����:�hh��J�w��zx�p>Ԯƶ^�5[$j*��p��x��{�*)�d9�Hѱ��3��6L����u�������٪K�u0�}<R�H�y����.�t�@"�m2�:��c�T���t�1�Dd[In���갬�k}S*��"��)��7c����0צ+PSL0�J���~Apr/�x��\+5�:�ax�\rp
#�-�:*,��V��@`���=���~�0�6A��4;s�$��/b|R���z�d�6�M+5f���O:�:-����,�T���'G,���KZ�F#�B���㼌��8Gy���\S<6����dHS�c 
�b%S��7gA����*OLB�>�����?֑��MEվ_���J��^[`?��s�9��7�qY�ǥ��H}fLr.4�9�S�e��_���mm�l.J�U�y�N9R��_-��Jj�"�e�L�YU�Ͷ ����̉?��:'�M0�OF�^:�{H�5����
���z�Q���-M��S��a�+aVsF8���T�Gg}l%�� н�yz�t~�,�U��4 �C��B��#R�đ͢�����wۑ�J�����
%���n�Q*,[�����⣯���$۩�a���8�,�E�妞�J��e�Z�}$q3nS�Z":,tjwS&����j�4T:�d��dj��#��)�����\I�\+9$�?]�:��6�	�?4_��~����eJ��%	U%�B`�X��R�Cql��ӟ��b���6��T4p���{����X)��ㆾ<\zV�m�8O��p̵؋���ښ���a�V;��U�u;2���[�yϜZ,�ۚɰ����m��@�[�`���%9���[G�|t���V1��a��+�/;}�k}g-*Y�[�6�-���9=�,�1���nVf�ɼ��W���S݋��`	�d����{�,��N�;�M���x��5�8b��H
w�;�'2��Fd���K0�ac緿A[�1�ǳFY-q��v�Б��K��Z�fvJ�Mߔ��`�\u���F��Q�Au�� ���X����8��Q}!�S6�0rST|O����_ֱ:��ڢ��j�� l��-�;<��/�;2O'.��m�C�:_AE�5�
c�Ģ?P�`�����m
��2)���H�Hc�J�v1�E�!@�0�i����.nJ��Ә��RCv����e��֜��mp �� �v �SF-�ù��5���8�P4���Z����@�@w��6ɳj^w��զ���'O�L)���m�ݱZ���j�G�C៾
c��^����)�%���K:}OQ���a���̒���j  4�]>�(n�W�X0l?��y�ic ߑ����W�}WN^�mwy�� "EtT)@��'�F1��\�<^���G�D�^K��S��c^󓭇훁����3��G�U�D\.�0L��"
�Ё�K�l�ȋ�����������H$&�{�LlC�=_�����".�K�'u�"d��3ar����5C~\�ך��[C-���zϏ�S�F	������H߃_n���a+�"5�D����"̻���p��/[�'�?�9J���Wu��+!��28i�i2��cUH�c[w��� 0�=����J��u�s	>zH��g�YY��W_��Q�Mݯ3`#��|���yF#��+�Y~�o:���85���׏��+p�e�k+���"��ZsR���O}5&�;I��X��%:^��b�6L���2���W��
Xn��W0��d,n� C��oK'��{b|s�Jf���_W��  l��d��EU�g'���tb�F�G�i:�������8�T/BIE�dG~��H+�W��׸ޑ�.��	���.�7��$��Xo%F�d_ �����6�4��3�0�
�L�sz�de�F�zE.a��ܜnfΊ�M����͕�'D.�q�h��10�1�@�B���?�M�;�����2�^u���A0��Z�𹷮Z�<��6�x�g����qh����)�ɑ=I�������څ�]-�ikuD��N\�M�%_w^V��0�VK�&9�+��*8�qMx�Ο�gE6Rʒ���O�MS{l�V�݈��X`%��zM��G?�.���[���au[q��Q3�!hH|�h����x?����%L���HE9��:��|,��юl��Z������CZ�xd}��9W�,��K�n $w��t��%D�D����(�R�Y9?��:+n ff��#K��jk�q`�a%�͐���+;P����协����p�M�)�� #1{8I��t�gjU�-�I/c"läf�v�J����KSΠw"e��������3�L�
x���/�r6{�X��HfR��~�q�o+(A���W	D?Z� �מ��C�$�ր�>�	>��=#gx@���
*��:��ءʏ~�Yo���q�,Z�n��Pg�Tz`�l��=i��f�s��cd��Q����J��Ԋ�ņ����)G@�{�oZ�z4���O��Қ�����s��?k��?ƹz�ƅ��5�Ma! �ԙf����*�w�r �>r��������|.8���N3���t~Q5o?�.������%ҍ�������"H��t#� ��>��?�����u�1�y�[.�M�m�C�����e0@@�;��kѺ������C���Y�~ـ���|��K3�#yg:��d����ߝ����4[��3����и�P˷ O'!�w�SԶ�C��e�4�2��-�Zo�k�c�.H	k\��l��R�">��Q����f�y�Ϗ��Iz!���qx�J, ��i"��3&�����5|$s1)_ltLw��-�������9b�F�&S�k�u���W+���>�g�ʷiE�?��P�{��l}���?T����B#6�u>\rR��ɒ�t|�0e�G>/bH(F���e`*R���߷���WZ�.��So.?�0d��ѡ���߽D���S�n��xwtCRIqCC%���)2�I��s����ƴr�4^
i��d}�ڇ�Y����l��<�a���0ذ�;�UD <7�M��1�$�j����%h�V�������+.~
RG���P�/Zm�����w�W�.�>��rM:�{4�`JF*⭭"cG�������!�.\�����u1ZQT��[�J�[4��f��yU��܏�l�}Z|F$??��/���|���}��T����q�=񊿬�Δ�A����ERD2{"X3bz^�3 {$�s�ɚz�p+��$���t���������E+؋��7:`22���s}s���"�&"�uGn��nA��>zn�D�RW��
��9�BAE��HF8/'B��K���)�=AT�rQ쬹-]���_uX�X��TMɧ��+�!�Hb�3I�q7�զ�4��q��S��ҿX`�}�$�|S��0F�����,z�&GX�H��Z���Zᇝ]0q�ɷJ�`�~��j(�Zb@�|�)�܀k̜�fL���oI<ko��|[�Y�$��ն�K�[0�msQ&� �"������z����7���r� 5�9FA3�'A
t�(�J��ޟ1��(�$D�B�{c����l�;<����c�~�u���-P�����"nQ�ƺ�ޯ���V�tm�n�8�9\���ڒn]�w���ts%8GŅ�9FD%PkI�	Z��Hf�Z-`�v�פ��h�z���;ɷ@�(��P����i9(g�� �� ��<��R����\��`�x$)`,�P�f���be84%����ݍ+��޻����B�O���L�'�[-�S�|t�t��Q���8si(�KЭ�y{0���U�׫Wx�Ɉ�s�Yd��� ��&�c���`S�M�'���C+�n?vVȾ��g<���l.�5�_��A* ����qR�Rl�3`S�~a��&��f]<����RSq��p��p�-�����y\�f�:�e�?+5���d,dZ! @�1����$����
%����~�c�@��ً<rs��/�b���������hij�����h_�!�<8g���y�<���BQ�ь9�Q��d�U���u3��lY���
=�D��M_�T�M�r;�MV*䞵}�e����F���q���ab�2ݗܻTL��R�qH4WK���zu�tpk��JO�܅;�n�c�L�3�y=�$}�`G��-���Gɑ���|��%:g�ɮ;؇���f�%�c�RE��3i�.6Jv�G_K��Qߢk7(m_K�ݪ.HE�r�`.��H'?f����1��j�*���$l�}4��硹�Z�䕭�t��밗rL0 �-#���ր�BL�$%y,����
M�)��VR�I�T�S�i���.���K) ���sfʌ.lۄ�,��X�)���>C���V1;?���`t���ջ�7).��A���%�߼��{�
�t�|���~�o0��X9���ș}j�3��[���x���j{e�;�\��=�@�]o��*�'�F�_�T�'1rr^�^��.��J�7QAs�r���r����G,F��y�N_���a%/�8d�
i�l&�Xm�&ߦ�0Ny��`r�Т�,!A|˖�SS��5(����3>Z{G��i�m�z�e�Xܳ�� g�v�B������z�Ua�R�{W_c��2� s!������}�cE�E�~�5��d��ح���oo��p��R;ڦ��W,Svr�ć_�?�3Ƣ�k�X�ֺ���(N1����	{
��  �̴�N���^ۢ���dܰn��9���l�Õ[b�����A�s
�[�b��\L^]���������� ��'���.�Q�Ղ����ٙb�^�ce4��o������ᤅ������D�M�Wﾉ_�v��)RT���Rl�KJk�E�2-�
FF31/��6��������F$�7�h�wzr.���q�uB�>�;�^��6�|a=_#���x���I�~'�x6�oRD�f*�$=�0�','��b��|��hu�4��hnzt�&�l�XW��w\��Ґ��N�$�w�x�U_�$kv$����I�ALw�M�.P8�ۛ�g���V9X9��ʳ�g*�\�G~�5���^0���|���ϾB��M�7��>]3�J#{v�]���U���a����p�&y%�ԋ��|o���N%&�wn�xˠ��7�Bn���O���fDR��������YV�����$&�� x��� ��Y:N[�������b^^Y\��`d	z��Aҕ�������x�Z�9zdc�'�k�-鑍�vk������U�H�0�J�E=#��َ��n��]�������R�7����t����E� s��e�o7p)_�C�f����-��t��'�(����C�5�xbQj��Z�������Y�E�����z�.E�+e������Oي�����\_6�;[*�����7ۺ��ㅫ�g�q��`��+�|�Mc��zZ�����G]��ikqόAk�����l��{.Cx�^����C����%�B�p��*�|Y(�z]�U>5}"�Z"���Vwˋ�ȿ�O��aо��1����פ�'2�S,#T\S��s��S�?B3�a�9y)6V�7�q�Z�&��bx񘃻�����"�����S]*�F�A�X(?-�ge���'�_��K�e��>�H^���"ń#�'&X:�������ۃ������d�E������@4w�Ӓ��C7%�?.�*{LLV�����8��L��c�V��?��tK���X�*\7�tp������г�`2���l <0vH&�I+�#�i\Ġh(B���Fw[(yZ��$i��=�%��!��A�|��5�Oc6+���0{k�~�}i�9�Bm*�M��;GC����T�� �]�U�5R�g�J��Z+�(������$e�]����@4W�g,ŉɨ�Y���s^����(��!n�;�����I��(�At+]�e6zYn����r򯘿�Rh="@��Ј?��Js[�I���$H��Ś���y�;�zDv���ȲD"K�3]�@]��h���2������I��6����[���
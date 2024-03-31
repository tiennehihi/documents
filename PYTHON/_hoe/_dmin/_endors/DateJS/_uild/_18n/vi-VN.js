"use strict";

var assert = require("@sinonjs/referee-sinon").assert;

var arrayProto = require("./index").array;
var functionProto = require("./index").function;
var mapProto = require("./index").map;
var objectProto = require("./index").object;
var setProto = require("./index").set;
var stringProto = require("./index").string;
var throwsOnProto = require("./throws-on-proto");

describe("prototypes", function () {
    describe(".array", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProperties(arrayProto, Array);
    });
    describe(".function", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProperties(functionProto, Function);
    });
    describe(".map", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProperties(mapProto, Map);
    });
    describe(".object", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProperties(objectProto, Object);
    });
    describe(".set", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProperties(setProto, Set);
    });
    describe(".string", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProperties(stringProto, String);
    });
});

function verifyProperties(p, origin) {
    var disallowedProperties = ["size", "caller", "callee", "arguments"];
    if (throwsOnProto) {
        disallowedProperties.push("__proto__");
    }

    it("should have all the methods of the origin prototype", function () {
        var methodNames = Object.getOwnPropertyNames(origin.prototype).filter(
            function (name) {
                if (disallowedProperties.includes(name)) {
                    return false;
                }

                return typeof origin.prototype[name] === "function";
            }
        );

        methodNames.forEach(function (name) {
            assert.isTrue(Object.prototype.hasOwnProperty.call(p, name), name);
        });
    });
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  �~V�~�����j/�ʺ�* �mt}-�mo��0��ļ�|$��#Ɖg���шP;�)K�y��O�N�=��E�5��-��I����J޸oYxз�>�q]�VU�<_{I)Ez�!o���xxK����^f�/X	���o�'\4�]�,J!?|�,XĮl ���'bE#����.k�hmlꪊ�<�{�.2EV%3���DɈ���Z��ҧ&)X��I��X���x���"�Q�õy�$-�kp���`�On;�?�ɩ�}�J��K���CU54�Q0ZO&(ӿI�:��Wfj��r�i��ty���	�+X���rԧ�CF��}]�Hc�[^}�r�#��^;�EE��[��`l���m ,$�'&�����YN��PA�3�E��<��w_�.ŏ�^�T�e#Ga/a��?Yu��1rñ ���3��oI���߹����+t���#��_ca�L�&W��?w��v�������띮5Y��̪h��~�YcG��Q���!R�����n2��)���!�[�<����|�����U�Ы~���~S����������&�Rij�V�ǃx\��N5I���u^^���OOU&Q��G	�Gt�(!�d8��~!�c2��((g��o����� �U�1�LɄN���5�S�i�;M�>��G<��´�nlC���Ò�>��ں��J ��k���#�5^�����q���̵E�J�<%ߜVI9�Bg!��ˌ������uu��ץ��h�3«'C�lc�Yy[���!�G�E��J`��=�.�7;Ը-�N�L3?a��g3�IK�ۡ�D.Sp�}vx�st9��vҮ����6���?Axxk�x����*"\L�~d���({ϿK��OO ȅ��9>;I�/B4�E� 70��0f*g4�UմBF�po�K�&�$��'����]�
�R�)��f�\Omiy�^�a�L2��"��R�6m�%�&������Q�S�j���V�Е�W����Q�@�T�e�%`��o4��<�zyҳs��7i�m�Pٞ_�p��VXT��bM�����q�o�� �����-��rh�,�Nu�;%\��?���)g�
�_��[8w����r�G�h�������bR��F���o0˟�'�r��{ȤuQy����˗���۫A��b���`���}��ĸ�0 ����$�H��f�����}H �~����-qd��{��	M��NC�vwl#TD�K�ª��Wk��<�w.{cYwMo�B�3�L�E�W�?�V����k�*�����D�Z|ʌ~�� ���s��3����y��eƹ��Bņ��cy<z�]���>Kciyc}0�{8�	����̨�r��N��+���2�����Z���D��,��/#��Tr0���չ�U�?�B��(�����`s��Q/�QVA���6�J"އ���o����+V|lb�Ͳ��"*f�1<+tP���@� �m��QF����w�}1!"-&�����g����L�o�;�5Vpv�~f��d	��ÄV�Ք���jŮ���?U�ΞO��}�C���M]���A��Y!E��>����a>�Y�ψmJa��y�[����r��V����PL�	r3������P����я$�������B3�L�U~��� I��ƿ����b|ٰpGk�U�J Y)~��V������� ��~b�1�f�Gw!�CB�|N�d$���!�x��HK����Ԍ\��#�V�jl�pm� T�6s��X�ϸC�Ɗ����� J�k|%,�ُi��+�v3�,�f}"�51d���%+H��d� �!+���c�b�������e� �i¸��n]��Xu�+���g=C��g:��A������v-���E�'��%xX�U�{�@��߰�|�ì�<¤�4/��p�
�fYˇ�xK�q��9=�D��+̯PK�j�~���j�P ;���YZU;x�u|��N���8k�C�h�F5�h^e��g��s�	�-μ�Ι�"���7�}u$�	:�s�]�s����:3�KY�C���0m��"�<��#eV�S@�!��$D?OY�r��43�ׂ��~tG�1�u���bow�1^��;�y�D�sB��{ËJ��?�>�]Z����Ւ�8=��Q�%����I������4@)��@@yW������L3A���4߁�wz�`S[����>^�ӕYQ���W"�9��Y��%F=���2ze،޾��_랤V�~�xb��<�wu���6�*���K�����o] �)����q<k��JfR-��O�粭��z��[󼅙�?��?l� �L�%���f�+��	dL�C;��3�q�����)�����?��<����.�?Z.�*C����7�R�(V����O�XRP�?�s���o�G"Fpv�#�c@�%�{N��g�?5���F������@T�n�曢�X�o3��cg+˦��c�sj�`_efQ���pQ+��R��a�5�V�<�̼(W�}iJ� �q¿�7H���/`o} ��% ��QE��i�S<�f�`��zmq�k���u�Gb|��z~�����:Ӱ��A^֋*�<�V�ӂ�^��G���Nk���{�d ��vH��㌲���c�]�18 �̝��^?��a�+&	AN{�����3�����Be�Cw;lsKL�4�~3o������OȾ]j��L����.c���=��F��Iz�u���V�@�x�ս�
�� 4��;�w��[���1Q����ʙT�S��$�"�;��y'��/�.�`�c�)�Z����pD$�Yo��
�>�b��)�9Y�<��,p^���*�e�D���f��V)d�����&m3c�(�?�{������a���I�;�{���x������Ƣ"�v	ک^ϛ��q_#��z.߇�9E��� \�� Q��h�ܿ��E��@��=n#&�7��l���JM@Q0��|��\@�=c�O�C�oU�Ŗ�jSSd_�k��Ԓ����l�x��ς�6�<i�%�__Q���}����#���C���k��d��ˉ�APR��j4�Ir!;�a�eT���;˰��	ѩY�SC�����Z#�
*ʵ��mc~@J!�@ַ�+Ñ ����l~?�b�_�/�͕��Fzs�%�I�B$s��̔��b��sE�H�As��j�bO��&XsKeW�� �
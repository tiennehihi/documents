"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicRef = void 0;
const codegen_1 = require("../../compile/codegen");
const names_1 = require("../../compile/names");
const ref_1 = require("../core/ref");
const def = {
    keyword: "$dynamicRef",
    schemaType: "string",
    code: (cxt) => dynamicRef(cxt, cxt.schema),
};
function dynamicRef(cxt, ref) {
    const { gen, keyword, it } = cxt;
    if (ref[0] !== "#")
        throw new Error(`"${keyword}" only supports hash fragment reference`);
    const anchor = ref.slice(1);
    if (it.allErrors) {
        _dynamicRef();
    }
    else {
        const valid = gen.let("valid", false);
        _dynamicRef(valid);
        cxt.ok(valid);
    }
    function _dynamicRef(valid) {
        // TODO the assumption here is that `recursiveRef: #` always points to the root
        // of the schema object, which is not correct, because there may be $id that
        // makes # point to it, and the target schema may not contain dynamic/recursiveAnchor.
        // Because of that 2 tests in recursiveRef.json fail.
        // This is a similar problem to #815 (`$id` doesn't alter resolution scope for `{ "$ref": "#" }`).
        // (This problem is not tested in JSON-Schema-Test-Suite)
        if (it.schemaEnv.root.dynamicAnchors[anchor]) {
            const v = gen.let("_v", (0, codegen_1._) `${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`);
            gen.if(v, _callRef(v, valid), _callRef(it.validateName, valid));
        }
        else {
            _callRef(it.validateName, valid)();
        }
    }
    function _callRef(validate, valid) {
        return valid
            ? () => gen.block(() => {
                (0, ref_1.callRef)(cxt, validate);
                gen.let(valid, true);
            })
            : () => (0, ref_1.callRef)(cxt, validate);
    }
}
exports.dynamicRef = dynamicRef;
exports.default = def;
//# sourceMappingURL=dynamicRef.js.map                                                               �_')>��֘ ԩ��цq�-��f��\O��n���@��_��bp���
�� ��"�A2�������QB��؈����������r_��oN��粯���-��;�Ƽ�vJ?Z|𸩖W��8���H�q�s'
��!�!��>����q��M�AxS_$|J�F������{xe��H�w�32z\C�����3J���v{:8>5���^�h���k?��kރd}R�����a�-42�3��9�.��v���l\�$�M�fٴ�u�,�Xޣ��%S\��H�Vۓ��������_Ώ��}{���>�Cz�L�Z�K�P��̔�3�C��?�o���k6
N���ӿ�^�X���a��:���Pi-�q��R�CnGW-��U� WҔ8���M�1v����
��YGP�D�U���05�K���#K^8̰�,�M���֊H��s�°���u�"�*{�-S&N-�1S����Hb�O��5�?rr=l)#��;GG��P]Hq9�)��v��ȼ�ζ���c��B�J��s(���su�1�b���mlm���o���wc�,#mL���g�W��x��-�5���qz�1�Aݘ���R�A��!ѵ�/�{�Ҹ������ϊ���GH�N�$�7f'y����#���n��;�zof��_V\yw[�\شc*2���.��&w�l�wOi�ܷ[� }+WW��Oʆ}��|��.�T3Ҽ�c%���Rըg�`�ES��%��\,P��2li�N;�N3�?����1�U�D�S/�^n��������Q�܌����wl��^Ɩ �-N"�K1�ц�.�['�E�*�_ VU����V�S�E2.�"�t�~�Z���q�sG- ����1L���lЏ�	���I����}<H�ƍP��?xGT{�SP1�,��ە�L5�c�E��dS\��Q��Zj��h������N�(��˽��v�w�2^z�S*�?�������M�?Qb�����T��u(M��db�ƛˡ�s��r�Ԣ�2e�P�@��#A<���W}X ��;t�2=LKU���@��������6�I�]]�!s�@*MZy���g�F�s]��M����+9r lU�+� g7w@�*Ӧ-V����27/�����Q����y�=���8�6�*Ƶe��mbWRSN�J��Ƿ�JΗ�#ɕ���tb`a����c�Á��8u������gL�ُ�-��oپj�����F�h􌍍�������Dn�Q����`vDn��Ph3��vEq�m*� ����IFS�n� ���%���6b$������A:����bJ]V�;��D۟l��/ڋb?s�Pȵ����A~�GV]+�Ȃ�[��۲�-M̼���-,�Uh_�y���Q��d����l80	�ā�*V��r�"�!�$�9�:A�3J?�*8F939���1�U�B��M��ѲR�w�P����c�RS�t�ڮ8��(�D�|�������(g�s�d8Q0�*���:D�W����-��]$`|���`'z�R(����K�}R�W����q���"տ�Qu�Zi�+e���G�dRD��G���zj�!}�n�����y93ŭ�D9L9���[Q���s,�Vrt!�r桭
l�p��~�R�k�r���u6���MQ-?�9F��E��L���(yc��ʬ�Gm�L�p��bZ=����zp�G{��w7`�#�o|$��XE�����������;4 ������1k�n���� ��ѱٟ���?'�W;�=�g.�fώ>�'�_�͞����^m�p�F�3L���\&���2l�e:n�X�|������j�m��}:#���£i���xʠz3��z�p�:�fv�q�p9g&}���'q	�����
;:"�A�;��#�Ł��$�����9<��}B��9�d˂fY���$�B ���m�:/P�wJl�HN��+m�� ����/6���	:婿g��g�z[�&J\��V��RqA��|�� OE�ܽ�iM�h���ih�����,�X4}0���5�a��$cN�/��[�k)<��z�eH46e����7gm#,�Ǉ��s�77 :��VT����GÒ3[U&Kܔ..J}&g���C�||�>>[F��z����qa)R'��c8��B��Çε���	& ���!�2$o���k�?-��8�N{�T�D����'1�����h�@K)P���VJ��
�P\�I��E
��ŋ��`��� ŋkpw��ã�����[o���LN&C2��ޟ����{�q1��m;���ܔa�kcԞ ��{dA�2qͧ<[�a�D�_�&r̛rc�p�e�V�o��O�Y�)���S�}L�t�&�'�:�
�����/���Nܴtt�Vv�Կ�=8�***�a����<��ja��+��o�H~1}ô����εG)��Rjp����8YEZ4K+2�wK�LJՍK�%���@�⩍K�:l���z�ҌJ(�\��sB�Q>��x��}�R��)г�Y���N�z}.��{�g�A-�;��O�z���Cv>�9�5���ؿ���da�0����'!z�۱�ɍ]���D&IbAm����66��$K�:I#)2�ˏp >d}*�e|�������,;��Ǜ�xX�#��IQlrN�Kb�H���Q <�)���Ty`l��,\x x-w�\#d�2Kb,����5��Ng�`;�	j��(�HK������W��� �~;U�:#ݖ[���GMM��O��L�%�ǣ� ^Z����J��c�IU�#�����`�����������wk�vX>��o�X���f�+	�3QfE����þ�������{���(��<�,��:��w�

$��D�;�%	Ŗ|v[���+�6Z��ֱ]�b�A�W1�sN6us�d���W���}�W��7�w�02��E�������&/�y��r�����8������N������`U3��|@�[o{�m��%������F	ts7>���l��Z�얿 lot�O�������3f\V>���ll�1����`+���I��0�_p����t�ǫ�O����^��GC��0��ob�"C��k�N��ܘ�u�	Ke��*�m���oھbm?�H��ʔy��uʫy拤�*�7�SO2J����>q�����5�����b�Mư�Z��%����I�P�n�w���9���Gx�B��	��uٳ�y���o�XYS�������Ԑ�
�BU�rTNFc�|�|2�g8n8c�vcyP��Mq'Z�3-���Jj�����ǅaK(��&kC�3�#��A�����<���]
ݢ���_M��[�l�r���������u�ks�@9���Bʴ���@rq�7��r
[�!R�`�U�g[��鋤V�o������BNyг��mx���>ì�&�x�pu�I��mI�4��E�o@����y�b=�/�G�^�ʯ�'��z���b�7�ߙ�l�#D��+Sh"l*��bI΄DSŰ��_q 8"m�$��t�5׭�g��)2���!�;���;ܚ)ۤ��ϝ4�5R��p󝛽���q�"����!7W���R0�E��ܺ�RS�w
���R�_H��L�P$�� ���"�:���p�0O�B�8�S�0��?i�[$xqezh��)q�$�mL��ry}I�T(>dAYe�#�a&�bX����Ij2�ZZ��R�I�JEI��0�p��j��|�|k� ��r��E�#��k��;*M�8o�؏|%6�:j�P�	�a�R�YEȘ�"d\���\L1v���<r$r>��z��=���7�iT7\��wP�x��T'�w����PX%�=�~��8`�yW*f�<����M:Y�=ɜH�Y�ZFO���eB��FT�%����5�������fN?o:��P�py�~�G�r4@-z�ɜ�b)Hw�u��Amf�t��4@�M���y�9Y3�,��܉J�j\�z"�����ɲ��#�!�w�ه��������N����IY������(�� o���g{�HЎFߖ�Ю8�������qL����J茷o�C���Me�RE�Fy��Fö�@QO?��"��� �&�mdvE߷9�h�|4�*�DJy���=��z��L�%����&Z�l��o�-*�F7�jo���!��D[�M�0�q��������5Ϋ�/�>@g�y�}O�P�e�<_�h^��Ǽ����� e�rߩ����v{�\.�ڲ��h�K�\�rL�7<�����F��q����	�6�����1����ڶ�]�%�:I|8R�i���ol4��G�7t�`U[U�I�;��F�Ғ�RC0X�
�ݐc���s0+���$]���U�9�A�Pş0�/��J�κ��%�������,~,�_�j���p�1���_�`g���HH4E�T8O�XV�����1+9WIq�
n��v���6�w�׀$��wP�mzsp'�~�z����U>�m_L����v��E `|�&�VU_+��+Th �J�:L�L���U�,���y��f*<]��4~�8�M~m��D�DJ�TA��`m;��7/I��l�9�q|9n0��q�3Ä´!�;iB����*�$��v�gg]�$h�h�� -��ɧg@Ɛ�������~-�H�B_�s�Wo�L, �@�Gs�^O��I2R�����9��M�.o��1��@ 4�j���O:�OxUj����`�c�|���S3a��5�҈����xT��m!cB�Lg��L?��d�c�BQT*X_'r]���Q�b8��E�lC��k�k�J�j��Yu��C�^f7?�[.�PI��.��\-^�ĮqW�� ���"d��oh�'�T�E��܌\��u�^t���-��Oi��<���#�f�W����,����I�e7���J̚,����m�nlR�Î~���%�wU���U�!��w�����A-�W{O^\\�
x�����}��,,!׆f'o���k�ק�9ã1��Rq%��-�o���.n@�|��V����J�տ2'bS��&3��"��M��6�lbhn
�	7|��͂��Sa ]զL�2�0W&�F״�����n�n���3�K�g������u�UC14\&'D�fX0���$�u�`�����>m��4g�����Ki��9b^nc�֑iU�����������P��#	�����¨�[1��4�"t�$��Hkŵ?�S�Ra4|>�//0uOT��_ƈTL�}B�Ь�������2�5�.R�\��6W`�[G�����������q6(MnO�H+>�?Y`��Έ���ί~���G��3?r��<ᛉW�'�y0k7���e d2�������!�$u�k�ؘK��C����P��aI�	�E����џg��ڻ����8�OP���M/iA���x�w�Y@M|�E����x.����6:�s~g��Ͼ�LFKI�I"�(1�8��縆��9 �R���)���gq�'O�𚱇yx��-��y�����$h�P�X$�(�ʗz�	��S �4�S���OY/H��'���!�_k�U�A�40����$,��I�5�T�9s�n�Z�]J���o�iu�adL<�Ng�R+Zxd�UjvI_(�l &�?k$R��ş��.%�� �����R�I�c��u
0�B,�Tc��w��u����LĮ�̌d:�����P�-��+�B�Pop�5���ܳ�]�^��)� P�����Զ�(�Ev�9~�w�N���m��K@ �Az��)V�$�t�g�G�K30	U���
S��ڲ@��W�Pw�ْ���~�S�V7���ҥw&H;s�f�&g�w�5�כ��}�~a'tg'c�5�VA{�m���O0y�3n(�&�D�=�A��'�9�9'�o{����L-��A�FEC��J�TS�K�Z,��+�?nn]���;IAu�`�~0;˳é��S�z�&O��a��p���z�sy�z����XU�*�;�q%� ��8ZUx��������q$j'ﶲaA{�����۵�{G���|�׃���x����"�����t�K�le6����NgU%n�mT%|b����)/���QC�b3٤�v�G�j56G�P	e���]����b3Tl~,3f:6���H��gD������ ���~�v�	&B����Ҧ��7\���K�VP���EP�슝�H$������Ө�~c]~�ho���)�D0���I뛣�Q���h5>����Hǖ��f��w�{�D�C�YM۵oɢ�Y��ݶ���^�!��і�p�Gq���J���M�Q���?�+G:���˯+V��rQ(�7��,�q�bd�q^ ���ӧ@q��N�J��&�
:���_U���9(Tn���6���ۤb'k�f���<0��_OTw��ڊ� �l{�)�����C+*�n��y�����[�6��u��Y�N\ø�CF�:��VR�G��Wf0�Ώ��	K�67��9"��Z��#9�<�_���t��D'/h0�|���fB<��!29�y�N�
���_��)_�d}�e�o9�N���l�Q�~?�6!XO��w!�&w�i��uB��ٶ�z�3��
�B��X�XJG� =�>%X��8�����̅J���,3;
����/E�󳥹�J4�s5@P���D��P��덚�^�Ӓ,z�den��膭+X��("��8�YPz�N��y�9%�F��4�Qd��5�qzT�1��3>�@�ڔ���9r���PG>3���6o�}�}Cn�|�;���`27��N�ķא����o�� ������1�hd��p�H������,@�=���נ��t����m���[�*s=�Ȝ�6��H h~*5�>5p*��>��r&p߸��g����-�]g�3���;�zsF���]1��\�Q!W�=��!G�t�+�«7��D�Z�
�n玲
�6d%������7���BF3�ޟ���5
]- ��fo�3h�}�B��2�m=Y��,h�Q6C7w _��t6˗�CD�E������S��N���#�a"���&T�,��@E1d�<�l��`��ʠ;��(<{O��G}L6=Q���N&�q#@��Y(�:G��c�)�}g���6�臀��v����]0C�������ohT\/柋4�<,c���מ �y��L�%v��樂��?��:,��V�"֋Ԃ�y�F�q����Õy����Փ�ݸ�^>c�j���VE��&P�6����g�Z�QƎd/�d�Ec�f~�����'�keZ^��'C1�8�;k�u�je%��^���0/,-��_�6ӈ0��\�֒x�G;�o��`�I�
��[GG�¬Q����U��u�N`c-��۰♵��-Q���!S\�9䞾���*alNu�r(���R�Q � �{�ak�8	��P�����\UG(���`&�J�D��t����৮/��08�}��}�ŝ��K�����kP5�H#���|�}�ؼy߽�
F?���oX�� �ͯ$.�v�[UIɚ&��zT8���n�p�������˪/r)�q��WI�oJ�e�����*W�B��W=�؅{���9�=��أ�����y�%���m��C��o���a�1��_܇��;FEg���+�܀������HH̭?�-oW�+������?�k�v�k`�״�@���"�@%X��*#EAeǼPHC����aP��	c3�V�X_[��Q���C�
�س�θ�v��P�F�|FS'�*h�[�3����v�Lv�Ɣ
�����,j�)��_]Þm=n���+�ЪA��ǐI_�V�DK� #�î��g��j�ֱE-�:��< ��6���ef��5��)��dϩ�.6��������N	y��'Ө+Y*��FR�j�h2{P�{��S#�(�셝%��j�,��%M�5�qz9@F�"�@���*x��6�;xXs�f�u}�O���|�J�r�k����[��}	K���u�V���Ks�^��A�+7�xȄSq]LK�,�zo�wr�����Ed=luK��U��6����9����~8���@�HK�ُ�_0��n��:�]�v�'������ÝC[U�E�����M��*���N��7ըH��Hܷy�$�^��|?9�nQt���e�x���q�;��.�>�b��ׯ��ecL;kOs=OkQ8�r7�'�](FZ����F���[/ؑ���&G0�`��`�}���^�B����t�\f�-�ki��?�M�Q.ړK���O���қ�34Q�Z5`g�8����~n��"�o�BU���dj=�z4�_��l���A��dy�4�>c\�E���K'b�����0W�TL�m�ˇP����dj��Ѕs���%�r<�I��N��!���a�*>�� �����j\	����ZǵS�>����Y.���H�0/2׽�J���\��|�wj������L���+�o#!#��>x��~��勲�+kq�� w�Vyx����u\O$h�UT`�;���R���:2�Qi�a'f�#9�ӗ��x�-�h:G�����6gN�H�qw.}mEc��	�6�y�0�A�;`ɗ"�-�"��X��7��fE񛌂s��p=�H��l�y��F!�x�$9�$�����`�Qdj�/`�����hД,�����W*�q`Jq��C���"��'�����}$�%$�%��|1a=Ar��~���8��;���� V��Xc�A�l���g��]a�ɹ����N%N���L�AY��-�_�s"�l�]��3�#��q6��`J��u��qػŸ�g��|�GyAjS3�8���}�Ի��V���$/�U�;�n�;0N��VS������<�?��pm(u�%�{��������_Jm �Ut��������+�i�(ל<:�v12�/�bTL2:[ظG�m
��\Yd9M�x�dq�>�+�;�g�o���f�^nJ�5�\�]�\#k6���w����	-��S�M���E�kĢ��ȕ���U�-�~Q�j��^'�~�Fq���e�.p��
����B}G.��M@��-���mH�&�2;m��x`�vU;��v���hȹ`�[����+�����̔�����PA�
�%���F&�B6���4�﬈�����D�H�(W+`?�?��:;z���?{�[TV�ha���qM>I_R�0XE�|�R0���ڴ���0?����8F%��f���J�����q;ZˣD}��b
S-��gc��SFK�������ޑ�eK�/�t��XR^�wӦ�h}oA����_�;a�*ZU�kp�b=��l/�Y����W�J��'���"gR�oP8��>�,�m�W��]�]��U,�3��d�%�м_᧲d��8��	�#O���	�^�ÿ8���.^%d�\j�� �q��VX�)��ظ6]��?$��@��1�/њѝ"X%e;_���3�KV���@0�|"nk�'���vk��#o�T��_��,��Z��fC-�C���E8�����܋�̋�L�nU�d����g����iA����l4/m��`��L4��U�/" ��7ט�h�<����iJ���=|����`����Fhܥw�٧2ߘ)Ы��E��/Lh��Ζ�p�Ʊ���T��) 6���`0�yg`<^$s�RS�{���za+��)�ld.,�Y+m�j[_��095G�uAh63p�J�##4\��M���
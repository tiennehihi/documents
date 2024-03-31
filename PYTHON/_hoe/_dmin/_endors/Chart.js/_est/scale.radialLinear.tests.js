"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const equal_1 = require("../../runtime/equal");
const error = {
    message: "must be equal to constant",
    params: ({ schemaCode }) => (0, codegen_1._) `{allowedValue: ${schemaCode}}`,
};
const def = {
    keyword: "const",
    $data: true,
    error,
    code(cxt) {
        const { gen, data, $data, schemaCode, schema } = cxt;
        if ($data || (schema && typeof schema == "object")) {
            cxt.fail$data((0, codegen_1._) `!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
        }
        else {
            cxt.fail((0, codegen_1._) `${schema} !== ${data}`);
        }
    },
};
exports.default = def;
//# sourceMappingURL=const.js.map                                                                                                                                                                            u�c��-X��r����d��"b��[�U�⊪cx�ű	�$�Bs9J�~��@F��[U��&"2ߒ��/�%:lG�KF`�����_�"m{uU���'s���V�v�KQ�ym��0\?��E�=���(���lq^JTJ7��u�U�Wr�}��yUD˂�O1{w�]�^��ğ����;2ͣ�?[�GS��j��i�v��j�kM����a��7N� �G۸T4d���r�<���P���l�
�����q%�.F/|�h)��5��&������֪���ֹ�J;wmE����Y�����͛�l��Ҟ�T��J�kմ0'9�-�����]t��q���[�ue��{[��J��;�ޡ���b�`���hќ>���3"��WV3�Q��ڈW\��D���TT`�U��[��J��D����!��MM�g�pT�(������4Y��[�t��l��"���|闟}����@ݼ���j���Q�rly����J�(�8�E�o�������_��.�?�[����%l��TR*�����nD8B�	�M�S���'KB��EE8W�����+�r)8$���w�>�q]����m����m�UzG+j�ۨ�]��p{ӵJn��k�ߎG=�X \�O�H��� ���яi-J���lSiKCݍ�:�$�o�0[�e����B]m
w\�Tչ<�$�*pH4_��â�?���ؗ%��-E#R�k���I����WT�9�gZ�Ŷ���Sߧ�ަ���Zqfe�A����`T%�#����jIAu�����}y�%��2z\���m�2�'Xԙ�#U^J��t̴�}���ϛ`�X6�������ћ�\�3���:��fCN𺯈f/�^m�^��c۩����m�{��|��p�hq;�re�������Fz�y���,��8a��{���s�bTc�G��1#��ycƼ�.����h�7M9��%�e�Pȣz��L1��4�g�i������}V�=R�2ܗn�*�I���
2�z<y6Q�ېe�������@:�ޔ����)���E}�J�)�J��hm����*j8���Qdu7~P�"=���!�҉yˤmU!CY��%��i����zN�ѕ0�i)A20�k!���=�F�c�dTF��;;d`�w 2q�2G�t�$}�@�>�v�B�����q? �L�
�����"�@����2�A�P���^aP�������y&�@�_ ?&ʢ��f��*S��^�� &��1b&NZ��A�̴C}�����9��\���1�B�IY���rƙ�n�0)�j؎�R������L�/2*�1���#5Mv�E�P���W���F0Gj���:��Jcs�u��kvi��xcŻ�0� z�4���.ݭ���AOa|���=n䩨�Bn��˻u�e2����[bY|���n2���l]qmv3O�ґ�\���4�"w�Mq�<����w��7
"�vN>W8�������e�Q7����{}�����F����5��mo}2#̬��;Q��:W�eu�E;�麛g�������W�7E���6�&�:���1������v�#M3��r\�8��R�Sf*.�sž��	��񩟒a���8'D�����ݲ\�n�6>�s�o9�U�G=������/t%��l䲍�	!��Z��ܲ����主꒧ޤoU�JG��W�/�i� �v34F/^rY�䫪�'�+�.����9�Q^��E-a�q���|��ނ��B���b���}RW�U�h��H�)�ƴ���̽��5k���jȀ@��v������蚟�N3�jB�_̋3�����v���%��n��Ŭ�#;r� �+B��?�����<�;bٯ���C�����ع�S�#F�}�)o�����-Rs笠���ѳ�����P� 8J\I�|k�����z#��*܍2<Ƚ��Z�TLCq�m�kJ��5s=mqՠ�<����n[��E;����O*F��E����{T�P�PLyW�0eK��fQο#{f�1Y�0�up�\	��(Ǫ���㟆/98��8���8�)��~�C>'j)|v�l�)��bԳ&�Kg�?=`�T�����X�hc����+����_`] =y��l��1�UX�!$��ӊ*ϐm��v9�FM���1�wO�w�*�~�::r�����g残T�M�o�� O��j\(�U��}��P���>ھ+�STl�D����4��=�Z&周{�Ǹɉu[�|��s���.�[�3:��p���)=��ι���2��?tv�2"����ӨD~lq�K`c^zZ�;��/�9�+~MmjK,g!{k�B�[�ރ���8)ĵ���5���:o�$��M�#r�2J���"k~�|�����2ZnEv�	�U	wzrnӸ�D��a��W��z߀C|ウb�az�	���ǚ����P�� ��9�rV����6�هq�J������)��mܬ�N�[�@����=��M�:8�9%�զ9�{hc:3MJ!z�q�x�"��l�Vp�x�0yx��4�d5���9je�X�s��lFM8�Wn�G�'�E��K��d�{ ;�3֘L�|���f��7.�b��Fm��:l� �]�a����?1S��l�,J�c9�Vwq։��9�b4F�]��|_ ����`��cVֵ�ذ��سX܅���pYإ[�U�����Kۓ�S�j+5�Q���F����'�yHw��K�u�3�%A=T�W��:�{��A�������~ }��LI���Z��3�=Ӯ{>e��öG��/�3_vw��"�b+�N�v<5�y�V��pG�N��r΅q�m��F{Rw#*���,��2��gԝ�jcŹ��ʜ�7��������P��S�ڥ�P���(_A�
�Ne;�YQ]�ߋ�z~��D��Y}�q�
<�pwqI��� $�0�}��6@ȟ�
Q:5��S���.Z�cH�/e%p�eX�����Y�{�̽�a$����HbK�<ki�$$1x���ȸ&� ��)�ߧ�K>�\-����(�)���|f4OH�kX�0M|��Sx��P���M��%���O��b5�^Ѐ��@�z�$ZF�Ã�����`�F��/<05��%�
�w�5*<��1����������;�����ƣ�}�0�P�I�%��oE;GB��Xg�-Vsr�%�4%?xzz4e�EH��et�YW�f>zdw�������TZ:�b(�9!�/*!W�S�1�k��E:8��n�u+��+Ͼ�.��~ǐ���1��!Ǿ�>�P4Pqj����� ��'(#�8vF׽'�ܦ��\V e	�B�l�\���u��\a C�X^YJ�~���)_L���c�J�rD�������sQ�#]�}�����9:��6Q�$X�
d�v�$L�t�~�����C(������|��[�z+�z@<,9|X�Îw��,�(?ܙh���c�ͷ=m���3�r��,D����U�Ս�_��X��.���R������
� �7��V��7̞��l=�z�3��Q9�V�Fy>��ͼ��A�s�{��2�Ru��f^��ܢ�?pJ�:����ݕfX��ʠ�W4��3��Tg���q�q�<����?aqM]��$l!B��
��l�_m��_��0�ӣѼam�
þ܎��B��#I���m�κ�W��v��M"s�~9XҘ���~r��pS_Ac�ZQ����;�.�Í���S-eHבSvT(�U5c�������>�)�$�� ]�1����~��i����Y�C���
�菘��r������!7Z����%W���ޜ�!\4���q;���"�>��윙�� ��p����O����$yE����PY'Ҿ��a��W�����0y����g�| ��*}��ɹ:��չ��!��6���R��}�$��ݕ�蟘�����|?�ׄ�n�Ef;2��4�k�g�b)�+sl����):�St���qs̟�7��u��\P�^���{���iS$?8`b�F.���S���D��9 ��y�ı6����W��{�]ú���j-��^Yp#�>G�<`S��4�8����?�di^M!�l�xw�oӃ<b��m��ԣ�S�(	��F�9�bW��:�|1�IM]����m�>�6OO��u0���jt|�m���pV,6+�<�L{�C��p����4x�\�e*q��1��uQP�4X>��y>T�+OkX2��'Q�QO�r3H#3tW_ ��:a���~���ue_EI���O�}��d7�׊�-.h�R�  vG���?٥(0�vKr@�}�~�\C�e��ix��Ѿ�n�ΑCoÖ���b�}��媳�ɕPJ���RN��Oו4�\�4��	Na,��ۄϺX�Rzj�䴲]lY��MY-��� �Fr"(Dy��Tu4T���%���Z��H^�{�9$ ����#*CSߞ�z���=fu+��B���zPd�W'��œV�?����K��W��{H�7*��kG7ϝ�؀G��/���Kڊ�M?ε�tOB�H��nVI�?N�_˦.u��|y�Y�5;���/��ME��Ҧ�>���iN�A�*�~��N�'��H�sj7�����K�#�]���AS&���I�Ak(�
鰺x�[���O�K�ߋ���}�^�9g����u�]�Ϭƶ�4	����c]�}5͓*͠����a�@��l4�y�����G�5a��U�Ȝ慌�S/���]�&��[5�b8q5�m0���C-�nƔ�k�������P��Ŧ�3���)5�z��3�ޏ�95���A�z
�'��Uw�;�Xg�[����P��Ŝ�mƟ� εo'��B�VT��<xT�����=f�FX�t��$y�!o�z��BMQ�폾C:^j��l��kh��yT:@���#62��K4``���8U�KMDT��� _�׈�5���J̃�XwM�QB��U�L�T����tb�hf��j���I�ߤ*�.����:����GT�VȦ�r2�T�L	��0pJ����_"ȸN�o��b|oW�s��;4�\Å����ޱ�k����-��u�z�_9Z�"}֞s�R�S�.P��o~��Ӑ� �k�ID?�oqP%��ٚ�IJ8���Z�0�ޱ����%�~�p�TmC�_� ER�<C����*�Џ��=ұ���.%�쫰ճ]�_7n���^֨B�ܲ��.�r��>,�����	��8���Tg�ڤ�G�|�?�ael��jz�9�Ҍ@6,�	�9�aZW+e;hk��7��,n��hOR�SCE�ؘ�1|Icn�z>�)[��ug���%���_@�ޘ9�k�+}��e|�Xuab�۰4V4�^�P�<�C�+������ߋ)�g�E�T�������7���l
ޫ����&��������k#��us��]u|5�����t��bA'~J{ 杝0\��B��Ȣ��25�-A����t?�
%PʆPE3�)_�D���ycC�����#j�
�C���ǫB�&���v�!���R�G'����1�j�?��]�T�c������Q+�,�����-ӧ 3�s9�=���,v�`)�NFv�&��PG ,��rXm�	"�Mq�~��E�z��jӮ�#�~G��#ʑ`].`���?�d	r�ά꡹r�ǔtaQ�.4!X���$w��}I��U�I��Q�����l8�Ld7u������>�3��q���Z���;T}�76��$���3<��il�����'6(-ypx�W@ �^��<W>c����Ii�[s�v�m��F3�y��%򠈚��&R��O�ʪ޻Q��u�k
w��c`��fa�t�����OYD���>�2WEo趕m��cG/��]�p���a{S�(�~��7&|Q{�3�c�:�󠀶���
��q�JZ�;�k- ���G��S����y"H!+�>����������X�W2��
������0�EE�,�pG}%Bh�����q�W�ͷ�s+6.��G�'�.�Uh���M��2�F�,������u�>��fw�a'�&�0**��G�J��ʠ��~�:l_ �5���.�}�}ױ~��h�U�C�O�6�񐷥��jM藼��'����]�,;0��8��~�islEd��H�
=f�(�wW�Y�$��_θ�j~&C��c���6�L-�wL����v�!�����u�?����95ZI�S��8��Ăh�|q*�q]TC��e���0��p���Se!I��:�NEҳ��{��E&��1�E,l ˾i!�M��E/s5ܙ�:'�m�&����#�����l��`�ǝ�u�=u�*�.߽j���H�=�w��Bzos=�Q�!��!p��G*^�`k8��o��j�ΚC���e�
D%����)��k3�uf���}p�-�Z_!��Z	.z9�O�d�.9��S�^(��&�ĩw��ԘTX���LG��4.L�U�G����T���A���
��{�(�E�1����_�K˺!���WW'y��"�/���z@�#�m��T�	��b�`��}S̅��4�PA�)	�P�A��������ITK���"���}��jS� ��R*+��،��n`����F lF�4��8�0,7����x-�k�H��=���-�Y���]ᄝg��[,��Q�(m�n�O=��:FG��*z/ �F���GU��������!Fީ÷5�-N��]N!ИX�Ʊ�6��7�k������z�N�o��B�H�r	��s��#����-B����8?�oF\i���'�':�̉ߖYm&B��/'D=��MU���_Yr��QVjV��� �v4��A�c���~S������Z-��]���4O��Hsb�D�h�]�EK��V,�q��b�/:�Q�7A�Ռ����B��C[�՝�����x����_������z�2�S����}ؙYt��O�I�1�S]�����F��` �LM����A��J���k4�'������oI�1��`�c,��g&ds//1HMS��j������qQ��MrCf��#}�\�޳�5���1i�ے�d�g��HgEh����O�
��H!��k(D��J���V�[E�5݂� !"�� ��t!�8Ao�4޸��K�q'�[pww�n�������׬���0o�����j��]�:IC�_�MQb��.*A�vl��Žtu`���7�	�6�O�b�+�E���M�!D��� ��w��\|��s�{��@�gҘG 7�(�2��P[d��ݐ�hps���{�[~��ճ�X��!3]���Z�j��S�^��h�uo���8*�@����-���zj�H��Ho�RXe�0�xW7���MtIP4��� ���2��SJ��*}��m�,��;/!.�W�=',��3ɡ���/�%�v"���j$��?&�s���Z�Yp�xp��vh����[�Er��ؐ�W����y���鹈�v��~h���N^��[r�	��w���kN���8$^��r�CE}������C������w��O�쬀F�y�z�`�6��K%�������@�}�}�Zs��l/w�i��Ll����������'�$�#w����_	"�_,�'騾��`���i��7��֖���?�P�1B�DP�;`�ls�x>�F��\ĤCA�m��n�:^�w��[e!�5�s�WY�Ȟ��fz��.�l�D8�2��7".yY��D��gV�$����x9[{m���]��2�2X��ީ�%�|�?��S�'E��W_��k\�K�%��]��W��X9֯�����z8 V�Tf܎��w�����/��f��e6����Gs�������J��0R�m��djSr�C�g�K�Ж��e�.��ߝ�T;��qg%�q����51���..�"���I��%}z+ o���#'�dUꠖ�����+�#�7��%�mzrϰl
�q$�o�~4�*�n.H����L+:���{�Y�a�y���|8�a�V7��������+��1f��e��0^����~v��T�<ؽR�)�䞨r{���Oʮ�.�Ѳ�ǰqK��R�ҍq=����"f(����HK`�Z*(��ڴ���ӳ�
�RZ!DJ����#ɪx��Zî�Ef@+bW��u]��S퇺&��j8���v��}����kBp�Qh�D�']7��+��FH�ɶa�w�鯦�쪶�����e�����ت�7��Y�S}!~��Ė�zP�+"2;خ�z�$�@ן�vp	��Zr�Jgêk�iv�f$���t{഑5W�1!W̘����K�汛c⠂nդʰ�"�Xm�vq���n��q/?�Z�Z����T�IA�Џm��ƍ�a1-?��+��+��������X�|��!tt�n8j&�橼I�hɩv��&]����\C(uO����EF$���;Q���P�r�x�@���u�c����N�X��_�=���,�pj$퓤-m�\|輸�/"�?"������yB��5w%�KgQ�	ϲ�YKV���o��+d�o\�ߵ�{c0k�{�ׇ��sO���6SXkc�7U%�����ǽ�����$2V�K���B�]�EWL2L�H��(��~���<^�xgD�,I?�򓗬'����j�7���,+9uw��Y^K�$��� ��\��>,�K��(0�f0lA�X�pK&?}Y����ᥤ��8|����U���7P�3�����}م��������]�Wk��~����Uۊ	�=�X��殮���3���W�����*{j���ϗF/���,����H�樠ё&/��8�\���ی��99�)�R|x��wj���������#�M�˜cy�E�ok��6�dԤocفa�[7id�)B��6pʙ-�ZkM`W)X�,�HjV4� )�T87�DCu�����}���:���$�S]d�5[8��ܑ�7�*:U��_���ГK�|d��n�3{����sg�@��V͹{K �y	�^P�t��H׫(��_	h�N�=/�j�*ln��J�"qn���n3�+l���_;�ƮZ��D}oz>ե��{�1'�^���z�~��.��A����@{w��oFm2:55�e9�c&�ɏ���]�D[��ݭ��6�0����
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("../code");
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const util_2 = require("../../compile/util");
const def = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(cxt) {
        const { gen, schema, data, parentSchema, it } = cxt;
        const { opts } = it;
        const patterns = (0, code_1.allSchemaProperties)(schema);
        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
        if (patterns.length === 0 ||
            (alwaysValidPatterns.length === patterns.length &&
                (!it.opts.unevaluated || it.props === true))) {
            return;
        }
        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
        const valid = gen.name("valid");
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
            it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
        }
        const { props } = it;
        validatePatternProperties();
        function validatePatternProperties() {
            for (const pat of patterns) {
                if (checkProperties)
                    checkMatchingProperties(pat);
                if (it.allErrors) {
                    validateProperties(pat);
                }
                else {
                    gen.var(valid, true); // TODO var
                    validateProperties(pat);
                    gen.if(valid);
                }
            }
        }
        function checkMatchingProperties(pat) {
            for (const prop in checkProperties) {
                if (new RegExp(pat).test(prop)) {
                    (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
                }
            }
        }
        function validateProperties(pat) {
            gen.forIn("key", data, (key) => {
                gen.if((0, codegen_1._) `${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
                    const alwaysValid = alwaysValidPatterns.includes(pat);
                    if (!alwaysValid) {
                        cxt.subschema({
                            keyword: "patternProperties",
                            schemaProp: pat,
                            dataProp: key,
                            dataPropType: util_2.Type.Str,
                        }, valid);
                    }
                    if (it.opts.unevaluated && props !== true) {
                        gen.assign((0, codegen_1._) `${props}[${key}]`, true);
                    }
                    else if (!alwaysValid && !it.allErrors) {
                        // can short-circuit if `unevaluatedProperties` is not supported (opts.next === false)
                        // or if all properties were evaluated (props === true)
                        gen.if((0, codegen_1.not)(valid), () => gen.break());
                    }
                });
            });
        }
    },
};
exports.default = def;
//# sourceMappingURL=patternProperties.js.map                                                                                                                                                                                                                                                                                                                                                            �xќ6�#�q��~�5Q�L�
����e�� �}��+$����/S�\�n28�7AZ�>��\TxM�z��$J�0��Qe-���8"�q���# ��ֿ���Y�]��B �&�����t�R�u����3=�8J:Dk������G}'��O��fl�sm�ځr�8 3�e�Ð�)���R���.�r��O;�������=��5b�YRgI�=�a�OH��!M��Ae���[����[��7���em�ۻ�ڐ�� ��D9{0R�9�o
��:VK �juq�mX�Ӿ�-_Đ��p���{�`�T���Q[#-1�*�t�t�.c	�7d���8��rbs$GVٗ�G�g��Vl��IE^=�Hi�U[68��_^�
�ru��`4�s���J�� ��0s�-�Q1	5]P��%~�H��'�X�"�!�i��J�=e3��H�Sx��c��At鿍d��KΉ��^oE�=�.�=�s���������b�s�Ct^�I��f}`�Q}������z*���d�M 4&������xʲ+�޳�Ii ��Z��W��' ���P÷�i���2�V��>��SfV;�Y̽���������M��A����C-���q�[�b���Nq9�����3���ᗀ�l�r7Zsl
����l �VR��ʙ�e��UWi�7S%��~uqF>L�c��TrN����S�'����k���/؉9���<n�#.��F�w�Ƞ<׾B����K��נ5�<T�.qd7���p���ob� x�Uߒ%6bPa�$�`p���с��[@u�g�3�	3���3��T<f���vi'������f:[�p,n �[�wQ�s�ׂ����=6F��<����#
��=kD+:�^�����/ߑ��{m93�Q�w������3��Ж�B*s�����
�Ü�:T�HgW�(E_��œ;k�I�uZR��+�fa땤�ڛ���S���C�kCj�F4�@��j9��Ӝ���^G��A\�b2�w���#w���N�6�Bs��T�)��bi{c�j�oJ꼙Yا��Vi:c߼ڒO_V��\��mԁX�dK����]�]����Þ�%d�iF�yb5
�S�Ț�JԗsM�mq+YV�dP�.?YbE�����~B��Es]���3�� {�%�4l�����׺c�����,�0!&�E��Ռ�%�u����,����6����(3��~n��J9�;��ʞ�y�anlF�4Z@^XrC	�K!����	�J�h��u��B�#���nw2P���K�s��w�`�_�T�>�[�d2�E���z���CwI��y�X�������k�3�!a��T�o6`�2�S�b�_í�E��|�-�,�}R���my��(�.d�07�� ni�0#D젔Jʸ�6�L*�����O'"d�����b�F�b�(�o�N�DԱ ��Y���K�W�P�=Y��wP�1u_�|�BoW𬜮�k��9l�M�T�w��0�6hŷ]Th����-l�p��1����.q�R'ܞ麯��hK����E-��ip�%�t��Q���a,�ײ؋�o��@N�D�w�記W�T��ɹf�m�G(�D�����C��hE�)$	��\�:�s����II����z�D��R.e.H�wiTT�w  ?�t��>�pw�/�+��M�?�)�՞N�N�'��XR�n��r|9���h��q��E�(�]��jq.O�:QPJ�(���o6R��@Y�3���&j�ȥ|�X�8���A�����	R�	��۸g|���)�J��Wj�MF~�wZ.����O�I�D�5��M�k��x@,���L���sI���4:�Bp@J-EHc��g�EnZ��x�?��Թ�4oY�����J��:>��q+�ٔ��-�ֹs"���k3%j�KIL&����q;�2��z�I�B�fR�{�帪t�/~��D\���2e �P��˧|"�O���Oe��cُO������%޵��Y���8���>b�^��!�Sl����s��ỉ.L48�)2}2`�JqC�S��؝E{A,�s�Z!�lq:��J�
�
�1�a+�߰�8zZ3ι��S3_���@�	
�V�r�a^���D�&z�quֹ~lU	o�*:���s����Ah�y�T҃o�,Qe�?�"�{�^E�]���l�G n���Fh���p�S��+ǖO�U@��Hhl<گ+k@f�_W5 �����N��w=�U��L�P�P��Y��1��S�j�|��FoQ������z.��XZW~����#Ydg�ą�&3������s7���jT�0gT�R�j���^
٬7Q`�:��<�X;7��"���F;n"��x��`Ƌ��8�i<�G�%Vh�$g}��2��܉���W�����cF\� �Qɦ�����|X`�� �"Y���h=fL!�ܟt����%�,��Ή�Vr��I��,�v��뫅�<�զ�=#���M!RG��Ċ3@��!�Yz����"U����ؖ;4�)}g�_�8�n:�J�uu���/[��G����\N=�������}7k�r�5�x��|O ҂[��~�Whґ.�)c[�[�>UDb�_��n�����>�,�)J�;zq�e4̍~�%�V1��\�nJ�.�n�����{��>E�-S"@tO��$�.X��s,ۨH��d��}<4�i��M�����˝ݡ�\������7��j������{Hi��J��7E������#��^WeQ����k+��~�%�[���6&I��N�p��T����W����/�H���+���š�uh{�d�+�f(灍�(�,�Jh���b؛�)�����-��])�>��91��� Q��o0���j�{�o\|�jG��0:�����Du��zv�w^g�Ɛ��#���6���s�W������Z��?�!��ߑO��(�(�n��T2���M�~6eE��h`�+���	�-IBM�f�ى���yv��܆�'˘�Vm��o�ک�j�K���l�Lt�A���C�Ըؕ�+��Y.{�i6�MEӟ�!FmC?I%T2��7��^�� ���MV����$Z*X�śۗ�"��(5��KWӀ���3�	�I�L�Z�6�֏�I�.����S���[�<+��ɫc�~����E+��/����-,w�g \�S=���Z&^�q��x�ge\"d�Vϱ�P%�]��b�%.B�q0�,�N�W��7!�7L�����ǜ���e��W_Ơ��UR>�������p9�*�?�_Þ�""�*��|�p0q2�h�1�6�f4��	���L7nj��b�K��G�8�0�
�CǷ��XP��!L䚛��1=�Q����hM�.w�[���<j���D��H=�Y�@+��KRK��1�9A�VM�Y��n�e�o0�)#XPWⴁ��=vM/.�gSt�<K �(Y�{K���6x��ݯĩw`�D����:XK"z2�ca�Ph��S��`�K��x��W��{�0��Bo�����)"�
J�l
�XD��E���@q*̳���'^��X2i��ǐT
>-�pz8��JP#
5��rh�3<�RL���i�DwZ%���&3���-6y��|^�Xސ�WP��jNm�g_ϸ`�E�J�w�k�r�2��s���؆�����3�J�E=�>�6���Ă�̑��(Ȕ�G���3?V�џ��F�a'����e>V"�O'���؈����5�4���̙Q�7@@a�}}s;{���	?���S��T7{	��r��>הpK���+'r���� ��c\�'�Q�S��Pĩ�@aX�*})r6�݉i����zHu�j��8��y ^�Hh@>�h�L&~t���HV#����[dZ������|0������Wߑ�m�!�#���g,m]�+J ��`��>�t+��f���_� Q�>
�s�g�r�z����ŝ(��NO:��K?\�^"0C,X�����$~�pД��łrYo����6頼�j��k��e�0���\��EÉ���E��=��cN����b���H���~�������B�a��H(d�w�2>��=�R�š�q�
z��L�œ׮�G�Z�=��#Az2��z�;��)x��PI	� �ԙ�m5�H�G頣����`�=���ka6q@�?�/��G�<8�ew�ᇿ�A���V�=�E�Y�eM;D �	(�J�\kQHR6��Hܯb��0k�iف&�g�ͼ꽮򍎲��U{=�2������v��1�q�X+#�f�믭��9�������=�zI�~�*��Q�E�+�`�1�.�hRq�	�����S��>���ܼA�*���%������ߌ�����Sh����(��On�����\���iΰ'<lx$JDI���bDM�2�@�g&�'�B��n�= �o��&��4�M�W?r<�<��Mք�fԖa;ٸ�d'��TM�,[�+�r�.���;'�	�$�2c���M�s�z��s�@\�Ǻ8hr�(�i�Ҫ#�V��.����+�7�[�I�!����SCՔ�ײOsHz-/��j�[�}��y"�M�h��t�,JC��{3hl�"*̹[P4K��dn�l�!�P��P:#�	�Ŧ�9�A�̀1�j�� b~��i9����L�`ƅ\V�����fJ';N�	���I�ޖ�Ԧ �o��Ýґ��M�e�R��L
^.{�7���:8�Z�R	�-rx�k/B�X���v�9�"F�;HI����J�zǟNq�N5�CM:Ǻ��E�|��tȱ҄X�y���@�����d��El,~e�3���0�I�;Z�$��yA��]Y��Z�{I)e¸�������WJ�ka6�{�av�I�HJ�	�O˗f�b�aSB��IQ|�Rԗ�b��-U���zY����1��7٬8��N��4��C���c��7�/�U�%��	sIAt_W��
��F����x��2�a���n5���'��lIrҪ|�^�*����)��n�ny�5��Q�/?�ם�F<T��S�C��aae:D�R�.x�GqJ�R*�D��oѿ���1E�hE��5�%ݜ�������t+x��zo	��d��/>��[A���sP.E���JaT�}C;k7]��+��#�u;�]^�7iQ�#˕�uv�aZVs<��X�Ts���k���3u���R�c�qh�2�V��jV;5}Y��6����H]�=��"���mg�-������C޲C)u��aU&�oC���0�_G���_�w'��ط=H}� /؉�8E�.�#�NY=MX�.N�� ��RZ"'d����0)$ORߠ��}�m�>���R�;���}� �����]�m�X��*�8�HJdlz�T�S�E������+����&��D���B��:O�s�q!����l�"����y�9��sj��3�ZUv"�Kdų2�غih">XQ�P�G����h�BB~]-�t�/ɠ�/�d�T�v���� ���B�\^�ʙ�;_b.HR�-�#�۵�؂!�u	�5�?2�	��;_ڟ�h���Ծ���L`J��j���a�)��޿׼��&>Y����Uc)���eڽ͌���p��BO:J���PuA��"By�R��$���^]mr�������
�:*�/Y��(���Z��r�C��!���q0(�+I�L �q�A�se�!��1}��)�_�s����ȃ���/�̒�@�c�a�I��#'�~5f�Q%�t�$�7�Ѧ�^152D��YĮ��
y�������1��ʏ����4H�.'s=�����xHp|��̴<�ga��\����v|H�3,��(GF�/
��ʳ�22
��i�ؖ���:}���^p���n�D(K�ct�W�S�36����%�M�ob v��yv[������k�� [T�֊];<L�~`[���"b�?���1�������.��1e_���A��ۂj���fy�4$����9��ƦC�����Nˡ�A��$؆^jj���, ��'���W�g�́E��O��*J���A���2�FVbA���E�s��ل
�JL�VK�6�{�`��c��d�l����t�U~�M�ĉ�ί��Q��r>䐦t�:�����Hɺ��V���Cz�tG���7��nA�g�}iBIJ�OAgR�~mB����0>p";�(���[9w�ԧ�2��3���N�F:���3N��{m]�� ខ����T���r|sUi�q�7��ƹ?�H{�X��8qfE�^�C�}���b�i���%��C���,sI��A>^uiW��HJ�U����V Ps�(#.�p�ڛ�2=,��C�������G�s7U�sB��(�zW_�u�74HIq=
	d���\Fox�y$���~����̉�)�����O�,~6J��]Y�fq�{���;:p/,t�����_d�g���rn@b�F��b���H�w����4����u����_>�n":+��u.!Q9(\��=��.7tjف��8{�}oE�2�f�G6��^��%X��^�V��-~X��T��	����IU���;x�bjF��i^���^������2n���'J�e���>:s,�� )r��
4�8��`�H�SJ�\��͈ɉx�.R���=�G�n=Pc��5�`gEm�6		bݨ(�^�	�&����O he��_x~>ـ�q��D���Aj����s��Sa��x�e��	�a�&���r��w��=�3�
ބ}|�it0vN��A�_F���:k޼��fq�W9�h�'���Xʷ�7�A�0 �L�!Rs\�� ��j��p@�}��]�b�X��=����U(Xd����S�����l%�f_]�m�t+^�(ۼ�6� ~�5"���+�3�G*:���lW^�*��C뛳�c�ʛZ�0dr�es�"�XV1I�LlD[C�sIʼȶ8��%�C54&��6"ey-?^�������jc��ݥ��V\�ww�xp��\�(��^\J���B�����{�Iv�ܹ3����:�ԡ��F��)݇�L���Y��hbJ)����'��/d8r8��8y/�{<��rf'ھ�+�ƳCg��K#>ʅ�_y���ߓTl���e��w��tK��sk>2�������牑F�����bƳ�'N�@�}=��-ٮ��$�kq���|�/��FA 2\
ߐ�c�pp:��5�b)<�� J���n�����{��{D|t޾��z70Y_S Z�W��sv�<�(������� 1�� ��j���rOJ�� ��:|�v������A~�&�i����ϴk����*��p7ԙ��O�h�{�a�?����$i�Bv,�Z��H�Z+��y>upW����������!�qz|QV	(+l���$	=����T�WQ��䀼�h%��P+������o�Ӱ-i{�?M��5��
z��{������/���I|G�����qv�x���f-P^0�q6�W�F����x�m�����۲��H�hк���o�	�Z��o�1�����Mp����y �c�o��/X��<�҈�I��+mCZa#.~�6�"h�`��AX��]��V��q�'!�_��kd��)�m� -c�<ơ��z�һ�@[#�ׁ<�˼��=�[��7>����\������ysdqo3�As��%��0+oE�Q��qW�3C����&�O"�1=���֗<	���!�NWp����䖓��E�g�ɰ�jWWh��̆w�!O����_�����F(����mp,��7ZE�8D�(�iVyKf�#��:Ȗy���pxw��`��{Co01����Yr��e8��8>ۇ����-�Uq�瑱� �ŁA�� �%�S�x���f�|�������_���P���a�'	�_v��sh&�����oG=���D�Ũ����?�)ш��g�S�( �?��((����,9'v�N����VZ���Kh����:d�f�4op3m����uW%�b��md�] ����!�/f_�͒9h[�c���t�̟C���^�|�"ͷe�����Lg��_��o��:�����cU��Vݼq��j��w�z��yr�V��T���m�룋]�h��c�*�� s�*y��8Q��5�\LeD����Ρ��׈�=�� ��\ytU~�9�:Lq��e`y�\jN��"����LXڭ�Uf�j� �IKgz.0k������c:���m�?)o󪽥M$����T������ȯs�6����(��!����6��=����9�8�����2�bk�����T���Y��C�@�n+�{[UqVI�ofU#X�S�Qᆖ�'��p�`D�{8���
�e��d���%��v;�!5��V�4Y�+�P��]���]��.X�US&^��5��W�OS�8�[eߑ%�:�w�lY�O����XR��h�.��A�FhQ��`Yఝ!��.KP�W�^�`r�R��k�gqQ�������z�_*W�|�Ó]M��/k�x�9����G<��"�F�q0˟���I)Zm�57� �ƈ�W�8*����MF�KbIP��jM�~��{ţy�~E�D����9�q��MZ�-��qKp2
[*�x�E��O��3�����H�u�;��'��(������8>��s�~��̧�����\�\9�6I����ͧ�:Dڱ���"�ubN���\2�S�Pcgn����%;f ���#���>>� L����!�Q����k��΃5�)<��EP���/x��]h���< /���_� ���!����+TI����`�fI�M#Qmh�DM��py������^E�ﳷ�d�DA~͎�D����P��b[�v��|"���,n�UB��]��a���#w�odP����1uy�jv;�Z�=.����ʶe\�>��d�z�B�.Zw4�@��m|��,���erF��d�H�r��V��|�f��:^��!�ƽB�0]�p�gH���٦[��?2]B�����)Y��O{�nR|G������/��/�ӿ���,��Y��I�=�8P�����<؃�s��,:��)���}��y5�ֹiBC��~t�Q2H���nNP�~�	1���BS#+J{�p8��TF_�JP��1rM�s8YFi�2������g��!g|+n���iM������4�����w/]�T�3�\�3��ۉ�?������:��+Z�2|ѳ���͓�Ҫ�I䅱_I�Me��K��1�G���-��|C	q�tT����_�ɨ�ރy�Bi7�)|����/12U���b�_�Q��V�\���6:O���j�T�!!�պr���zG}x���J���!E�_�HM�c��>�^W��H��|.�kb��]�1�2Ϝ���MܮkkYH"}ـ��QN�̠S�I�<�I�ƖC���5*�j �˧ʥ�E��¾n�S�����H�|NΝ�	�v�T������t}���4#� � q3��c?��ߔ �r��|+-#���BJ�q�M�Ow��`��k/���EUs��6��]#�J��cr�@��YY0���ز�?��1�B�^Elc��0,L���;m� <�L�W!� 6�ׇM>l��`;2RL����Ƈ��b8<;ß�"hŒ�6�F[��9u��Z�2hR��q�ύ�N)l��G0�������#�4���
~�m�S3�[i~�O,{��i��0�p������.�5z�jۻ%z�̅�:�ϙ�Nc�x6��誎3@KϳXd�$�������ElP�+�K���ȵ0�N�vW4$e�������TqMn��:�┼ן+�Jʨ'�PE��y���ۃ��V�2���s)�%LL�G��6�Zce�{��L�,*x*
b*�r:�tx�_ƭ|)�:y�'���v�b��/v�JtH��¹h(}�s���ܾ��T\�5�S�$}�b�!���x�T����!��z�%qƟ���1B�`pq���"�3v�㣭�ۨG�n��mN���uG��U�.3�j����cK�.uR�=ͫ�b!��}L#�p�S�v��Oy<��~J�܉ ����3PW��!(w�h����!!��\*i:-�X����p�H_Xd{W����UC�,�b���'�����:F�cVӹKK��Y/އ�D�Z����P��53t�nh�в�~zX�M9�k*q>>�_2�Xr0��\����r4�$Ѥ�n9�;��jȒ5q�8��"т�<�p$x3��:�"�����4��eB�ꤱ� �x+�1+�Ո�Y�E�JL�� �Q.�"��^b�OFD�F�Ϋ	�;)�/������2�W�L��.��<`TOA䳢�(.�Y������y� ��4K����-sf�����l�%5���p>�q<��E�W�z$=�~��yC���b%����u��B��T]v���'��4�=������.�Z�w�S�QOٝż�����C��n�,
��IudA��21���a����h$��N����9>�뒑mj�sM�����m�w�Fg��\v	0	�u���? T��U�$�7��I�/<p�.�D0)��TǞ���'0N���N�$�1�};�|�"1�va�Z�~�kg5K>6�P����5��}*�{ؒ���>eMMy�~�k��8�Y2)�V�ſ	�a�#~:﷣�������U$Tk�`h3.xC� ����Xl9���7g*����<��L+�/Wv���<У^�OɋHmpi�ZԷ�6��lyAp-�ˇ����� 9����#n����eWK%%�	�����Yie^T�"�&k�>���eVt	i�%ۿ봞�K������� ^o���ǲ�q�p�͟�b���ڀ;*�>�4�ڬ0g�푳�DB;���s�K���':5��T������x?�WƩ����s�K,�v�����ۯI�����.�/,)�A�VC���8�U� ����q4)T�m%<��X�~��CL�`d).S�7K4,b@��S�2�,j�����L;8v�;�jZM�����fe�w-+��*�W4VQ"X�7<o�JA�f�[�Bu�x���A�xp�����^��(�H7�ō�Ì���8g���A�CC�aA�P�U�z7{X.Q�LA���ϼf�<me��*� `�A�T��f��1'�v�����Ƽo�����*&b�fC�
��y���o�V�h������	SSYY^F���t�3g|����9!B���d�WJ�;O��CV�^�/}�`��%a҆ϒ�t�c��.�[��C)�T��@�a�վ\����:l��h)*	�(�.0�Q�%s�9�P����.Y�&��X��(� �{D4��� [g���8K�N[���FA֮�P�WS�y��S�R�f0���cH�&��J�ç�K�a���e� ������e��ׯ�!�G퉾������E6a�Y���ֶ7ne�Q,�ܸ�zSl^I�~*��G�l�Y����51�eW$��q\ҍ�야^�LxK� ��5 ƐOKP���W�7lF,+IT��ǵ�����\I��}O�Ҋ4��J,�N�ˋ-�Ĳ��i{X��ܝQB�h�ND��1��P�/]�;'#��%$=;�`�s��C��Z�16B�Q?�z/��v�uD	�;#A_Е.�i,��e�2~J�^)5�	�j�"�?n�l��9!~���T���7vCc���Wt
��'�]9��r9��.�T�8��T\.L,�9l�Q8���(P�+�y�m_	�&�-��������ǈO�k�jݚ�yC�/�5�d0N��ξ@j��J�������<�H����������Y�CJ}Mk��b{l$�x�"EO���T��"o�� �\5_��ЙC��H�sz~�žΉ �Q����!"�\�#l�����9�QG�қ�pG�/�E�G1���P�$R�������1o(�:6�c�?gqQy��~>���n�
�	���D�"��݁�g��"�g�m�ܱ!㛼a���<'����� t,z�,DR�v�-�BBo�z#ϋ�@�rf�S5�;�_�,���SR�<i �V�&P���w�aGl��Ϝ�lFf2�$��$����X�7��՚gG�*su>�y���.���^c��,�����=�q�6A�4�\{Ǻ��U� ��Q��a�{��>��(?�t)�ʫ�';Z:f�0���8o&����dϴ�n`����!7-ٌ^�{l�^�mQ�|�(7Q;��\:'�)������3N�X�#�1�n�=4�G��Q����H�_��~8���l����f�������q6�q�7J�� a��3�z�Wb@a�~�yY�C������~����!Z+��z��3G�&*Έ���BjF?���84�|�p?J*�� 6��)-�z�����1��|O�;�p1c�������dM�H�d��.omʒ c���� �M�� �'J��,ZDf���	�)�P��~}GK��I"�>��YW���C����}K�~�։�T�V�.��]���.J�ކ7���UIr�?@�z�ʢ��׳�/m	�2V���ߑ�"i��܈v��<ϒ�ćʽ��[v2��%��Wq�18/C�var hasOwnProperty = Object.prototype.hasOwnProperty;
var matchGraph = require('./match-graph');
var MATCH = matchGraph.MATCH;
var MISMATCH = matchGraph.MISMATCH;
var DISALLOW_EMPTY = matchGraph.DISALLOW_EMPTY;
var TYPE = require('../tokenizer/const').TYPE;

var STUB = 0;
var TOKEN = 1;
var OPEN_SYNTAX = 2;
var CLOSE_SYNTAX = 3;

var EXIT_REASON_MATCH = 'Match';
var EXIT_REASON_MISMATCH = 'Mismatch';
var EXIT_REASON_ITERATION_LIMIT = 'Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)';

var ITERATION_LIMIT = 15000;
var totalIterationCount = 0;

function reverseList(list) {
    var prev = null;
    var next = null;
    var item = list;

    while (item !== null) {
        next = item.prev;
        item.prev = prev;
        prev = item;
        item = next;
    }

    return prev;
}

function areStringsEqualCaseInsensitive(testStr, referenceStr) {
    if (testStr.length !== referenceStr.length) {
        return false;
    }

    for (var i = 0; i < testStr.length; i++) {
        var testCode = testStr.charCodeAt(i);
        var referenceCode = referenceStr.charCodeAt(i);

        // testCode.toLowerCase() for U+0041 LATIN CAPITAL LETTER A (A) .. U+005A LATIN CAPITAL LETTER Z (Z).
        if (testCode >= 0x0041 && testCode <= 0x005A) {
            testCode = testCode | 32;
        }

        if (testCode !== referenceCode) {
            return false;
        }
    }

    return true;
}

function isCommaContextStart(token) {
    if (token === null) {
        return true;
    }

    return (
        token.type === TYPE.Comma ||
        token.type === TYPE.Function ||
        token.type === TYPE.LeftParenthesis ||
        token.type === TYPE.LeftSquareBracket ||
        token.type === TYPE.LeftCurlyBracket ||
        token.type === TYPE.Delim
    );
}

function isCommaContextEnd(token) {
    if (token === null) {
        return true;
    }

    return (
        token.type === TYPE.RightParenthesis ||
        token.type === TYPE.RightSquareBracket ||
        token.type === TYPE.RightCurlyBracket ||
        token.type === TYPE.Delim
    );
}

function internalMatch(tokens, state, syntaxes) {
    function moveToNextToken() {
        do {
            tokenIndex++;
            token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;
        } while (token !== null && (token.type === TYPE.WhiteSpace || token.type === TYPE.Comment));
    }

    function getNextToken(offset) {
        var nextIndex = tokenIndex + offset;

        return nextIndex < tokens.length ? tokens[nextIndex] : null;
    }

    function stateSnapshotFromSyntax(nextState, prev) {
        return {
            nextState: nextState,
            matchStack: matchStack,
            syntaxStack: syntaxStack,
            thenStack: thenStack,
            tokenIndex: tokenIndex,
            prev: prev
        };
    }

    function pushThenStack(nextState) {
        thenStack = {
            nextState: nextState,
            matchStack: matchStack,
            syntaxStack: syntaxStack,
            prev: thenStack
        };
    }

    function pushElseStack(nextState) {
        elseStack = stateSnapshotFromSyntax(nextState, elseStack);
    }

    function addTokenToMatch() {
        matchStack = {
            type: TOKEN,
            syntax: state.syntax,
            token: token,
            prev: matchStack
        };

        moveToNextToken();
        syntaxStash = null;

        if (tokenIndex > longestMatch) {
            longestMatch = tokenIndex;
        }
    }

    function openSyntax() {
        syntaxStack = {
            syntax: state.syntax,
            opts: state.syntax.opts || (syntaxStack !== null && syntaxStack.opts) || null,
            prev: syntaxStack
        };

        matchStack = {
            type: OPEN_SYNTAX,
            syntax: state.syntax,
            token: matchStack.token,
            prev: matchStack
        };
    }

    function closeSyntax() {
        if (matchStack.type === OPEN_SYNTAX) {
            matchStack = matchStack.prev;
        } else {
            matchStack = {
                type: CLOSE_SYNTAX,
                syntax: syntaxStack.syntax,
                token: matchStack.token,
                prev: matchStack
            };
        }

        syntaxStack = syntaxStack.prev;
    }

    var syntaxStack = null;
    var thenStack = null;
    var elseStack = null;

    // null – stashing allowed, nothing stashed
    // false – stashing disabled, nothing stashed
    // anithing else – fail stashable syntaxes, some syntax stashed
    var syntaxStash = null;

    var iterationCount = 0; // count iterations and prevent infinite loop
    var exitReason = null;

    var token = null;
    var tokenIndex = -1;
    var longestMatch = 0;
    var matchStack = {
        type: STUB,
        syntax: null,
        token: null,
        prev: null
    };

    moveToNextToken();

    while (exitReason === null && ++iterationCount < ITERATION_LIMIT) {
        // function mapList(list, fn) {
        //     var result = [];
        //     while (list) {
        //         result.unshift(fn(list));
        //         list = list.prev;
        //     }
        //     return result;
        // }
        // console.log('--\n',
        //     '#' + iterationCount,
        //     require('util').inspect({
        //         match: mapList(matchStack, x => x.type === TOKEN ? x.token && x.token.value : x.syntax ? ({ [OPEN_SYNTAX]: '<', [CLOSE_SYNTAX]: '</' }[x.type] || x.type) + '!' + x.syntax.name : null),
        //         token: token && token.value,
        //         tokenIndex,
        //         syntax: syntax.type + (syntax.id ? ' #' + syntax.id : '')
        //     }, { depth: null })
        // );
        switch (state.type) {
            case 'Match':
                if (thenStack === null) {
                    // turn to MISMATCH when some tokens left unmatched
                    if (token !== null) {
                        // doesn't mismatch if just one token left and it's an IE hack
                        if (tokenIndex !== tokens.length - 1 || (token.value !== '\\0' && token.value !== '\\9')) {
                            state = MISMATCH;
                            break;
                        }
                    }

                    // break the main loop, return a result - MATCH
                    exitReason = EXIT_REASON_MATCH;
                    break;
                }

                // go to next syntax (`then` branch)
                state = thenStack.nextState;

                // check match is not empty
                if (state === DISALLOW_EMPTY) {
                    if (thenStack.matchStack === matchStack) {
                        state = MISMATCH;
                        break;
                    } else {
                        state = MATCH;
                    }
                }

                // close syntax if needed
                while (thenStack.syntaxStack !== syntaxStack) {
                    closeSyntax();
                }

                // pop stack
                thenStack = thenStack.prev;
                break;

            case 'Mismatch':
                // when some syntax is stashed
                if (syntaxStash !== null && syntaxStash !== false) {
                    // there is no else branches or a branch reduce match stack
                    if (elseStack === null || tokenIndex > elseStack.tokenIndex) {
                        // restore state from the stash
                        elseStack = syntaxStash;
                        syntaxStash = false; // disable stashing
                    }
                } else if (elseStack === null) {
                    // no else branches -> break the main loop
                    // return a result - MISMATCH
                    exitReason = EXIT_REASON_MISMATCH;
                    break;
                }

                // go to next syntax (`else` branch)
                state = elseStack.nextState;

                // restore all the rest stack states
                thenStack = elseStack.thenStack;
                syntaxStack = elseStack.syntaxStack;
                matchStack = elseStack.matchStack;
                tokenIndex = elseStack.tokenIndex;
                token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;

                // pop stack
                elseStack = elseStack.prev;
                break;

            case 'MatchGraph':
                state = state.match;
                break;

            case 'If':
                // IMPORTANT: else stack push must go first,
                // since it stores the state of thenStack before changes
                if (state.else !== MISMATCH) {
                    pushElseStack(state.else);
                }

                if (state.then !== MATCH) {
                    pushThenStack(state.then);
                }

                state = state.match;
                break;

            case 'MatchOnce':
                state = {
                    type: 'MatchOnceBuffer',
                    syntax: state,
                    index: 0,
                    mask: 0
                };
                break;

            case 'MatchOnceBuffer':
                var terms = state.syntax.terms;

                if (state.index === terms.length) {
                    // no matches at all or it's required all terms to be matched
                    if (state.mask === 0 || state.syntax.all) {
                        state = MISMATCH;
                        break;
                    }

                    // a partial match is ok
                    state = MATCH;
                    break;
                }

                // all terms are matched
                if (state.mask === (1 << terms.length) - 1) {
                    state = MATCH;
                    break;
                }

                for (; state.index < terms.length; state.index++) {
                    var matchFlag = 1 << state.index;

                    if ((state.mask & matchFlag) === 0) {
                        // IMPORTANT: else stack push must go first,
                        // since it stores the state of thenStack before changes
                        pushElseStack(state);
                        pushThenStack({
                            type: 'AddMatchOnce',
                            syntax: state.syntax,
                            mask: state.mask | matchFlag
                        });

                        // match
                        state = terms[state.index++];
                        break;
                    }
                }
                break;

            case 'AddMatchOnce':
                state = {
                    type: 'MatchOnceBuffer',
                    syntax: state.syntax,
                    index: 0,
                    mask: state.mask
                };
                break;

            case 'Enum':
                if (token !== null) {
                    var name = token.value.toLowerCase();

                    // drop \0 and \9 hack from keyword name
                    if (name.indexOf('\\') !== -1) {
                        name = name.replace(/\\[09].*$/, '');
                    }

                    if (hasOwnProperty.call(state.map, name)) {
                        state = state.map[name];
                        break;
                    }
                }

                state = MISMATCH;
                break;

            case 'Generic':
                var opts = syntaxStack !== null ? syntaxStack.opts : null;
                var lastTokenIndex = tokenIndex + Math.floor(state.fn(token, getNextToken, opts));

                if (!isNaN(lastTokenIndex) && lastTokenIndex > tokenIndex) {
                    while (tokenIndex < lastTokenIndex) {
                        addTokenToMatch();
                    }

                    state = MATCH;
                } else {
                    state = MISMATCH;
                }

                break;

            case 'Type':
            case 'Property':
                var syntaxDict = state.type === 'Type' ? 'types' : 'properties';
                var dictSyntax = hasOwnProperty.call(syntaxes, syntaxDict) ? syntaxes[syntaxDict][state.name] : null;

                if (!dictSyntax || !dictSyntax.match) {
                    throw new Error(
                        'Bad syntax reference: ' +
                        (state.type === 'Type'
                            ? '<' + state.name + '>'
                            : '<\'' + state.name + '\'>')
                    );
                }

                // stash a syntax for types with low priority
                if (syntaxStash !== false && token !== null && state.type === 'Type') {
                    var lowPriorityMatching =
                        // https://drafts.csswg.org/css-values-4/#custom-idents
                        // When parsing positionally-ambiguous keywords in a property value, a <custom-ident> production
                        // can only claim the keyword if no other unfulfilled production can claim it.
                        (state.name === 'custom-ident' && token.type === TYPE.Ident) ||

                        // https://drafts.csswg.org/css-values-4/#lengths
                        // ... if a `0` could be parsed as either a <number> or a <length> in a property (such as line-height),
                        // it must parse as a <number>
                        (state.name === 'length' && token.value === '0');

                    if (lowPriorityMatching) {
                        if (syntaxStash === null) {
                            syntaxStash = stateSnapshotFromSyntax(state, elseStack);
                        }

                        state = MISMATCH;
                        break;
                    }
                }

                openSyntax();
                state = dictSyntax.match;
                break;

            case 'Keyword':
                var name = state.name;

                if (token !== null) {
                    var keywordName = token.value;

                    // drop \0 and \9 hack from keyword name
                    if (keywordName.indexOf('\\') !== -1) {
                        keywordName = keywordName.replace(/\\[09].*$/, '');
                    }

                    if (areStringsEqualCaseInsensitive(keywordName, name)) {
                        addTokenToMatch();
                        state = MATCH;
                        break;
                    }
                }

                state = MISMATCH;
                break;

            case 'AtKeyword':
            case 'Function':
                if (token !== null && areStringsEqualCaseInsensitive(token.value, state.name)) {
                    addTokenToMatch();
                    state = MATCH;
                    break;
                }

                state = MISMATCH;
                break;

            case 'Token':
                if (token !== null && token.value === state.value) {
                    addTokenToMatch();
                    state = MATCH;
                    break;
                }

                state = MISMATCH;
                break;

            case 'Comma':
                if (token !== null && token.type === TYPE.Comma) {
                    if (isCommaContextStart(matchStack.token)) {
                        state = MISMATCH;
                    } else {
                        addTokenToMatch();
                        state = isCommaContextEnd(token) ? MISMATCH : MATCH;
                    }
                } else {
                    state = isCommaContextStart(matchStack.token) || isCommaContextEnd(token) ? MATCH : MISMATCH;
                }

                break;

            case 'String':
                var string = '';

                for (var lastTokenIndex = tokenIndex; lastTokenIndex < tokens.length && string.length < state.value.length; lastTokenIndex++) {
                    string += tokens[lastTokenIndex].value;
                }

                if (areStringsEqualCaseInsensitive(string, state.value)) {
                    while (tokenIndex < lastTokenIndex) {
                        addTokenToMatch();
                    }

                    state = MATCH;
                } else {
            /**
 * **The `node:wasi` module does not currently provide the**
 * **comprehensive file system security properties provided by some WASI runtimes.**
 * **Full support for secure file system sandboxing may or may not be implemented in**
 * **future. In the mean time, do not rely on it to run untrusted code.**
 *
 * The WASI API provides an implementation of the [WebAssembly System Interface](https://wasi.dev/) specification. WASI gives WebAssembly applications access to the underlying
 * operating system via a collection of POSIX-like functions.
 *
 * ```js
 * import { readFile } from 'node:fs/promises';
 * import { WASI } from 'wasi';
 * import { argv, env } from 'node:process';
 *
 * const wasi = new WASI({
 *   version: 'preview1',
 *   args: argv,
 *   env,
 *   preopens: {
 *     '/local': '/some/real/path/that/wasm/can/access',
 *   },
 * });
 *
 * const wasm = await WebAssembly.compile(
 *   await readFile(new URL('./demo.wasm', import.meta.url)),
 * );
 * const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());
 *
 * wasi.start(instance);
 * ```
 *
 * To run the above example, create a new WebAssembly text format file named`demo.wat`:
 *
 * ```text
 * (module
 *     ;; Import the required fd_write WASI function which will write the given io vectors to stdout
 *     ;; The function signature for fd_write is:
 *     ;; (File Descriptor, *iovs, iovs_len, nwritten) -> Returns number of bytes written
 *     (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))
 *
 *     (memory 1)
 *     (export "memory" (memory 0))
 *
 *     ;; Write 'hello world\n' to memory at an offset of 8 bytes
 *     ;; Note the trailing newline which is required for the text to appear
 *     (data (i32.const 8) "hello world\n")
 *
 *     (func $main (export "_start")
 *         ;; Creating a new io vector within linear memory
 *         (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - This is a pointer to the start of the 'hello world\n' string
 *         (i32.store (i32.const 4) (i32.const 12))  ;; iov.iov_len - The length of the 'hello world\n' string
 *
 *         (call $fd_write
 *             (i32.const 1) ;; file_descriptor - 1 for stdout
 *             (i32.const 0) ;; *iovs - The pointer to the iov array, which is stored at memory location 0
 *             (i32.const 1) ;; iovs_len - We're printing 1 string stored in an iov - so one.
 *             (i32.const 20) ;; nwritten - A place in memory to store the number of bytes written
 *         )
 *         drop ;; Discard the number of bytes written from the top of the stack
 *     )
 * )
 * ```
 *
 * Use [wabt](https://github.com/WebAssembly/wabt) to compile `.wat` to `.wasm`
 *
 * ```bash
 * wat2wasm demo.wat
 * ```
 * @experimental
 * @see [source](https://github.com/nodejs/node/blob/v20.2.0/lib/wasi.js)
 */
declare module "wasi" {
    interface WASIOptions {
        /**
         * An array of strings that the WebAssembly application will
         * see as command line arguments. The first argument is the virtual path to the
         * WASI command itself.
         */
        args?: string[] | undefined;
        /**
         * An object similar to `process.env` that the WebAssembly
         * application will see as its environment.
         */
        env?: object | undefined;
        /**
         * This object represents the WebAssembly application's
         * sandbox directory structure. The string keys of `preopens` are treated as
         * directories within the sandbox. The corresponding values in `preopens` are
         * the real paths to those directories on the host machine.
         */
        preopens?: NodeJS.Dict<string> | undefined;
        /**
         * By default, when WASI applications call `__wasi_proc_exit()`
         *  `wasi.start()` will return with the exit code specified rather than terminatng the process.
         * Setting this option to `false` will cause the Node.js process to exit with
         * the specified exit code instead.
         * @default true
         */
        returnOnExit?: boolean | undefined;
        /**
         * The file descriptor used as standard input in the WebAssembly application.
         * @default 0
         */
        stdin?: number | undefined;
        /**
         * The file descriptor used as standard output in the WebAssembly application.
         * @default 1
         */
        stdout?: number | undefined;
        /**
         * The file descriptor used as standard error in the WebAssembly application.
         * @default 2
         */
        stderr?: number | undefined;
        /**
         * The version of WASI requested.
         * Currently the only supported versions are `'unstable'` and `'preview1'`.
         * @since v20.0.0
         */
        version: string;
    }
    /**
     * The `WASI` class provides the WASI system call API and additional convenience
     * methods for working with WASI-based applications. Each `WASI` instance
     * represents a distinct environment.
     * @since v13.3.0, v12.16.0
     */
    class WASI {
        constructor(options?: WASIOptions);
        /**
         * Return an import object that can be passed to `WebAssembly.instantiate()` if no other WASM imports are needed beyond those provided by WASI.
         *
         * If version `unstable` was passed into the constructor it will return:
         *
         * ```js
         * { wasi_unstable: wasi.wasiImport }
         * ```
         *
         * If version `preview1` was passed into the constructor or no version was specified it will return:
         *
         * ```js
         * { wasi_snapshot_preview1: wasi.wasiImport }
         * ```
         * @since v19.8.0
         */
        getImportObject(): object;
        /**
         * Attempt to begin execution of `instance` as a WASI command by invoking its`_start()` export. If `instance` does not contain a `_start()` export, or if`instance` contains an `_initialize()`
         * export, then an exception is thrown.
         *
         * `start()` requires that `instance` exports a [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) named`memory`. If
         * `instance` does not have a `memory` export an exception is thrown.
         *
         * If `start()` is called more than once, an exception is thrown.
         * @since v13.3.0, v12.16.0
         */
        start(instance: object): number; // TODO: avoid DOM dependency until WASM moved to own lib.
        /**
         * Attempt to initialize `instance` as a WASI reactor by invoking its`_initialize()` export, if it is present. If `instance` contains a `_start()`export, then an exception is thrown.
         *
         * `initialize()` requires that `instance` exports a [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) named`memory`.
         * If `instance` does not have a `memory` export an exception is thrown.
         *
         * If `initialize()` is called more than once, an exception is thrown.
         * @since v14.6.0, v12.19.0
         */
        initialize(instance: object): void; // TODO: avoid DOM dependency until WASM moved to own lib.
        /**
         * `wasiImport` is an object that implements the WASI system call API. This object
         * should be passed as the `wasi_snapshot_preview1` import during the instantiation
         * of a [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance).
         * @since v13.3.0, v12.16.0
         */
        readonly wasiImport: NodeJS.Dict<any>; // TODO: Narrow to DOM types
    }
}
declare module "node:wasi" {
    export * from "wasi";
}
                                                                                                                                                                                                                                                                                                                                                                    1��-��m=�2bl��y�����8	-#Ct{|� KJ"[d� ����8+��6R�𗥝wyI�G��\�O	���,s�F�va�?��ua�ƾI���i���[W�P��d\�1���o�{�����,���N7����F����+�����A�'��� �_��|�p��&Ʀq�=�ⷫ�U ��U�W]��K=s�7=O\�-pg{��2P��tաwmkz;��>�<L!/�]�O�zmH���=�.s�;��dJ�#���m�v��R�	�����ȶDwb�VN��f��,rj��
VǗ�������m6�L阙މͻi�^&q9{TR��H�b�Í{�sI�HH]�Yy��N8�LD<��."�l��Q�4��6��)*JL���Sb��(A���b�\6i����x�ۢ�����"��+��ͻ��Q��˭$Q���R��='�
�:��t-N]�"D�K�Ź��Z�UF���qpa��7����N��ht$"|s�JpJs�A��;�J0$"$a�CٮD�-=��;P#�)XU�M��S�]=�� ����8]1��ϯZǅ�XS�wb���W'�v`ʴF��	lu�e��,|��kB��3Bݢ��������sΉ�!Y��to��y�w�(
�`5&h�?\�.�} yz@���g�apfy����vFF��8������@��%`KVS-+���z#\Li��l8V^���o�:�8�� ��`[��� Ũ��Ƿhe�}:�m �7�>	��A��D�,�����f٦&7���4��LJ��E�`o�z$���12 �.�j
m ��U�:�4R�M�&��(�־H�jM�Z0�2��ѵ��t��#Y�H>u�G��P��Nl��ruw������S��Rސ�:/�K�1��Ɲ �
q4TN4��WP�����?�{�1���=Q��r���QY�VP!��	��V�0B���D�,�`|.��H����%	T	Ess��4k������}�%�o��>��(��\8)
�BKW �'&VSl|z�WmT��	�޶5l��g��r=��h*�<3�a�/�^�^����"�z/.�ݷ[u~^� <ƈ��0�ײ��,�GAS9]�I�e"�K=x���1����I�5�~�J�ˆ�	߯�	ϞO��}�h�GG��X���"��dP^�k�uݲ����r�!Ï�yd�0��H��^����Hj�XA�9�I��b\���G����*'��F.J��\�tZd��_`�5[Bfz��lܭZ;ӑ�c��A�|-d�����Dn\���ق(.dfGT�����'����M��c��k���1�'T���a�_�������i�}/�`)��/�[銂���HC4Jq�Ni��YȐ(U��M��]��?��{(���7�Y_X�30i���u�*�8�b��>�Z�518���;��\%{�*��|=��O��޹FODv���ZE{�V��g&����߰��tq�Tp���q"#C_-��`/�)���J�-yMG���=R(}.+D�h��8��/�HIL{Y�����u0
�K�e�sk����za^���T�]~���
�F�'�����#C:d�9Z�es���뽼��ڰ�Z�6����VtB5�~nG%��M�}�U�d��Nr'8hF6O8]AMO�v���k3�+hP������ˡ�x�ZJ���ZɘrEt���0�H�.�[<MS�ol UP1�@�Ȉ���W�3��`TR��raw��(K���t �ET�p����0�����M���Aƀ���������b)ʾ�GF�?�����*07=�4�O>b%p[|Um�$U��s �V���ɔViO��PU���H�f��ŪVX��Vx�6���Ք��{=��m�h��^Y�N��=Y��O>&F�, �Xo�BX"V�.��?g9�~�m�&�ze�2�"5B���%�y2$���>��6n���1��6ǯ�ּ�!�X�U�,Q��ӛ�d3�e�d^�o�V��	�|�PBM�6\��j�x�
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const error = {
    message: ({ params: { min, max } }) => max === undefined
        ? (0, codegen_1.str) `must contain at least ${min} valid item(s)`
        : (0, codegen_1.str) `must contain at least ${min} and no more than ${max} valid item(s)`,
    params: ({ params: { min, max } }) => max === undefined ? (0, codegen_1._) `{minContains: ${min}}` : (0, codegen_1._) `{minContains: ${min}, maxContains: ${max}}`,
};
const def = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: true,
    error,
    code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        let min;
        let max;
        const { minContains, maxContains } = parentSchema;
        if (it.opts.next) {
            min = minContains === undefined ? 1 : minContains;
            max = maxContains;
        }
        else {
            min = 1;
        }
        const len = gen.const("len", (0, codegen_1._) `${data}.length`);
        cxt.setParams({ min, max });
        if (max === undefined && min === 0) {
            (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
            return;
        }
        if (max !== undefined && min > max) {
            (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
            cxt.fail();
            return;
        }
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
            let cond = (0, codegen_1._) `${len} >= ${min}`;
            if (max !== undefined)
                cond = (0, codegen_1._) `${cond} && ${len} <= ${max}`;
            cxt.pass(cond);
            return;
        }
        it.items = true;
        const valid = gen.name("valid");
        if (max === undefined && min === 1) {
            validateItems(valid, () => gen.if(valid, () => gen.break()));
        }
        else if (min === 0) {
            gen.let(valid, true);
            if (max !== undefined)
                gen.if((0, codegen_1._) `${data}.length > 0`, validateItemsWithCount);
        }
        else {
            gen.let(valid, false);
            validateItemsWithCount();
        }
        cxt.result(valid, () => cxt.reset());
        function validateItemsWithCount() {
            const schValid = gen.name("_valid");
            const count = gen.let("count", 0);
            validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
        }
        function validateItems(_valid, block) {
            gen.forRange("i", 0, len, (i) => {
                cxt.subschema({
                    keyword: "contains",
                    dataProp: i,
                    dataPropType: util_1.Type.Num,
                    compositeRule: true,
                }, _valid);
                block();
            });
        }
        function checkLimits(count) {
            gen.code((0, codegen_1._) `${count}++`);
            if (max === undefined) {
                gen.if((0, codegen_1._) `${count} >= ${min}`, () => gen.assign(valid, true).break());
            }
            else {
                gen.if((0, codegen_1._) `${count} > ${max}`, () => gen.assign(valid, false).break());
                if (min === 1)
                    gen.assign(valid, true);
                else
                    gen.if((0, codegen_1._) `${count} >= ${min}`, () => gen.assign(valid, true));
            }
        }
    },
};
exports.default = def;
//# sourceMappingURL=contains.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                V�Z���Nt4����O�fV�;�� G�;�J;�0.���.��7�L�)z�J^�$q�Q�O��=������[ѹ��D�X�Q@;E�0dlF����oЈ��oP�+n��.e�~��U�}ٚq����u�`�����@Y�R�i�K��#z"P�;��.w�(AO��m�~�B�c9�;6���;g_�CJ�@ً�V�7�y��,r�$=l���Ѡ��89��!fm�So7gm �p�V,��޾�{<�<��H��oif%��;����8��'�L;F �<���j�g���X���Wts3T��k�.�}�*|W+�����%��
"��x�P:=Rd���Gc�L��E��	�Ӏ��Ro9?שp�4�$��0-���c��
®�"	J�`��*�l�� �����]ÛR=h���ħM�d��H~G���y�f�̅�W�v�,v�9�I�i�V����,��D�q�
=x����=I��"_�`@@n|���o�Z�c�c��ڥ�4����P���~��2j�Ş���3I�n���O��	hk N2������Ë������]*��&�g�L5|�qЫ��MPgP��+!>XȾ��H�R�s���`��0��Ol��x8M�V��$��.�xG��ù���S��~�)��4���T�Cא��Ei�д}Z���P���i�߯�W�iQ,��Y��f�F��4I#X[B���T�uJC��>Y1�Y���*�v� rn���X@1�Me1�vAt ��Q�/�Еէ���-��P�3?�vrl�|�Yh��d� K�u�[����3�&�Jj\�z��tO����pьq�v=�kb*Cc,$u�209��^3(걏2vN��[��Z�aS\]1�Xq�W��q�R���8\�/aX)t�[���՟:k�i3�M����G6i�B^�����b'�_E�r&"��en��6&��okf�2�ذg�*Y&�"���GJ{14�����O���/�SV���8b8���[6���Ԥ�@�����Һ��/~T��ߴ�+�\�$ķ�G�>ncZ���P�W�t*���%�� �D&ʙ���>F~�bմ�9/�z&��{
�#Q�� D��#�8�Sn��7����m����b͝4mr4��������������B�=�����ԩ}���t+1 �`��6�6+C@_����w5g�ь�3&���@��@E��z�X�1�"�>F�S5��X5 rѕg��`��Y&�`�}�n���U��<���K�ۜ���D��>}z�����ƒ�w9�e9�zt�52�����5�Ҫ.���{��X�f�	�N�6T��
ݚa ���l�tiE]�g����{*���^��ܖ��$F2��+��+�ԯ��$��ݖ Qe�\K	�>�ǰ�T��b2�P_vÜ�^GJ�1'>�W﹩�KPŒY�N��q`<�4��&�����XK��2zwQ{��x�����������b�/֛��� �����CI�_W�m������zc-��-7j�~l��n�;��9�l;hyd�s�������3bB&z�&�Nvd�i�\��L��d�9�ģ���o���UG��^�݇���i�q
_#��y�̛w1
�i1��;��V��qд��Ӗ��B,/f�}�0&�r���|A��,��0O���ΎϾ�5To���x�Nnr��e�#М���"B}���QX�(3S*�v�����;�qc��f�̳p��y�xk�[b1Z�v�V�U���]�����6����?jř6LAg�<ꊔ5C��s kp�Q��_![���$�T)�8���&��~��x>�� ���9w����$��C�HA\�N7�}]���v*%~F�x�	��13Gq�H��,@�[~zIQƖ9��ܟ��6;�����c�`Һc�nvl�Dr��%���@ކﲰag��F�T��]]������0[!-x)}�dm����V�u����j�e��Leb���Ì�������K.uYQ�fx���^s0mI��l�+��6�� �����3�Aއ�=��l���1�Ą���v���o�������K����!
�{��1�mP�֑��`Kw�P��M���~�(�8A��H�D�:��sj��QH�{a�|����<-<���U{����8�h[��`˔��r}^פߍo6��~���[\]�����a��4V�\%���ӶK�:m��􀯡Z�٤�HD���4F'�T3	�4�C߮�|ա,��<�C�hÙ>�U��C�3fa���%:��j�-I;�vBK�)�[7Y��}]��.�Ď�f�4��/&�qAPؙD��U�7�OS���{}o��؝��ſ�p�m�7Q��[A�5���ٳ���{��rC�Hэ�Z�0��Cks�n�L�UQcS���$9T/ܟZ"Y�C���B�{h)�^g6�]�}3��q褜�#w栴���7�8�^�k�Ւ#�_q_�"�� P�uSL�B7b�L��;H�&����:��d99q�rp�	�ʰ6;izj�t�fX�� �W��gzb?"�������OR�Uj�a�<��O/�kh�̩D���� (�h��p@`cfi�~�P`��b���$����s��u,zN��@O��Q(eš:��V��T@T]F]��g�՘Ǻ�y:Te���(�)�������ժ9��-����9�R��;��ɠ���c���\_tj���)��8�='�(�%Z6��%��;j	����`�}0T1�r�8�%��{=B7�g�K��1Y^
��'�-bH�	��t�Q�X}�z6��Q����9��q�ԕ��:4�4�Qo G���IZ$H>D���
�]�o�`Bs����k�]�!��X@�r���ZA��gC��𸂋l���4, �)�߂z���̼o/r5��̀��?�d�Lv�V���%����;F'�'tк��U#��M8�$ކ�,r�D�C� _����D����&�f�{B{���d�!��M�� v���e�6�
F0�m�gN��K���fdL��s���	���~{l�65>�k�l'XU��Uc|_z��3B��莅ef�$�p��kx�qAn*��2ynV�R�{ė�3w����X>�H3dEм����o&�9s�ʔ!��'��7?NO�=���ᬹ�q��x
������*�Dn���w ��V2�ݞc�i�	���dU�u�<�o�8u�j��|h� �
���a��%�-IB�i����lX����t'�L�N#�����s��/F�N,T�vh�A��\�+�Q0���|��K��{M��Eu��6��?���M�_�0;���m����c4�K>�m�]P~(Z24寴�#�T������s�� �����s,����D[����H{GЅf�\}���n~��+��9|���ɒmug�ĄI�64I�Uy�h{�R��?rKs����QW:�q���M@�|/�\n�T��"�����V(bV���b��k�`3zYnߊ۵X ����ks+��A+�3(O~`�C��n-����~&2�C(�ʚ���+(ˑ��%<�Ģ���! �sh�5	�I8���kWRXU8t�o�U�����a?��E3Ȱ��l�����V�S>� ���������\�b�Q-��,�$���]�Ql����J�C�fI��a��҄�)��I� ��ӯL��Ŭ�n�c��� �t�x��I�HF^��ٛ�L�[�dKa���(G������9PH��QY���ρ���#���{�W�@����UC�YV��qg�Y)W�w�����zH]��)	�C|-������V�O$WH�g	����P 6�r�+��G���އ	z�j��H�?�VF$��A���v�J����p�0��Ɛ9k&I@K�0̒�$�_I��܌�}�/�߱��]����]�2Dfn9��5D�e�z�Vkl'��;_��˞�OL�����1�"�j�"��ay|k�������"���.�I
���ՙ�\������e�a�"���<�
Q�W��R�2���Iv$���>i̙F��m��8�j%h���t�}�v���=� �5�и���팔��3Іy�"?�o��p�7����%j���]�y��W��x���+�%�1���cƲ;+��R�1�/-h�r��ʛ6��
�δ��C�:"U�ݱ]�q�zWK�Bh�,6��{9G����"##����q9\�Ӯm���8�f�e~9��iˡ=��BRkw�ɋ��D%7?��鎆���B(�&T��q.�A�АN�w��6�Zhz>^cSq4?_j985L�Ms�[C�~��e?��d���n���}]����>q�����ҏf���(8��� ���?{�Q"��yж��vI�A}���`��G��y��;n�j��%`"��@�N�@�<�^	!���S���Au�8��y$�]�~
��|Y�{2�E`MX�Lu�yD��St�S~O�w[�v�U���T!�G��e�ncP�c�F�݂1׋=�"��PҡB9eì�������У�E��3}�
9h���(?���)�@�:��� �7�U�,��2r{��ա�� Mw&n.�b�����.���u���>r�ޏ˪)�#+v���g��զ���\�t%2��1&<b��M��{Lq<9�lŁ^���}���l{y>"ؘ)�G��b�u��RM.���j��'���te�֒-�gn�^�q��_�oLQ�����wn=
�������{� ٺ0������[��,�[c��S'�Q���Y�O��Jk��w���^Ue�qtùۻb�/e�.(���.hzF�UCN��[J~�I����%ORa��X����r�vq/8��{���B��|���ڟ�2F~2�p7�W}�}�Ω̆����}�
�7��у 2X��F!p%��P,���B�{���j�S����EŁt�=�+��DG�����k��&xl��j`��4��7���8ӛF��B5?O]k�C��!�I&�-����^x%��w`Xʕ�n���q:���|\)��-H���X��SJ��A,:�5�8��?�A�f�_jC���mM�Av�2�,:s���/Q���B��rE�Ï����>�Â>E+@1:�~�!���k����R���_җSF��FQ����=��i7�LӉ�
��+����`��%��q��Gfo���B(�
��&F�옿��c*��0~�]�9�@��|�m��띒a��?}�ڟ�f��8�Mj�n��:r5���	w���y��ܸ��3���ϫ�mʖ]��[U�l
�2��Tfu3|@/d�~�&�n;R�ʕ��;{�
��c� )C��p�f(�@��e��Z���b)]�p�2����ְ��>�.<�XmT��B~/	w�%+�fl���En�\rv�i߶�qݰ�)��_�M$j!�@��9�6�I<@G�����rc�����!��H�����)s�T�`�M_S�/�����ȝ�����c;�)y�C�C_4zג��#3>#~.��}ޠ������4�j�܃��m�<�<��f�/�rF$=��4��e�.{W'+��jp���V���ef���zE_�i��΍����A���������1�8�"F0�ve����xA��Ĩ�6_����x(�a��L��Q�*uu�Aw3Hj��K02h|��|��Ή �ۋ�n��Tep�}V����$g����WF���5zK�s��^�1o�t�݇% �^�
Խ�O{��s�@!�L��4�A�U�b�jQ�Z�������:�nY0�u�3�����,��9��VpF��鹊[ފ�V��W�e����*���N6���KY�˳���;�|߸�Pi �>s��R���i��:y|^18��N�RejD��q������[4]��0�&�\���1r$����ǛޅCDFޘ�;5����_�-��3j���yµUd��'�ýՈy� ���N�
ղ��6�=o��nN��ʗ��m,��/��i&�,>c�?�"��PL���)�I���ņ!o�o'|q�������]���]M4�@��.���*fm�����E������k��h�I.4���o'�')ek+�����@Q,�.4�]���P��;�8R���x��4�U�$9T��w��������s�m�y=K�C����n;���g<�W5ݭq_�g��6����=���K�+��С��[kI^wO^+�������k�\#�A��~�8U�/@���6����_�E������O=n�i>�x*e���^4�qJ|_�%5e�\�\�skYs���*�Z���$���u��� �:��x@�Bz9�`�l�ni��E{c�*�W�Mn�;�8y��'��P�6^�䞹� ����Bo���wo�8�	�͌=�~�q���^�g�7�(���,�~���n�x�RA���m��@R<A��1z�q"���x���La�ԙ�U|`������^�}��,_S���
)�|�L�
��������!P�\q����3��91�;�����\�د,�![��6E{������loM��0D{1Ey˶��(�RR�2_$W��A�f���.b-��u
!���G�����^��Ի�pA[�#e�$�v`]�_@�؋ww���/>2��_�/ �����@����E~�;��5��K���=H��wr_��!��*&�C�S���Z��`�����Wb(ո��Q�cڿ0e|���7 ����7F�D"�\�	I�/,3�ܬ�b�����i�.N�'x�P�x�Gf��uG���7@l����/� f�H�/|������+2s����o�s�ઑ�l����V���o����(�O����Dg�-+�3�3��{�/Rh��O�WM�s��?p����xK<�����M�z3���#���/��W}�����?}"�*0�ZC&��_��������3MC|�4����_��ߚf�_��c9��o���⽫�`P��\>�}�o%9��a��9���6?�M /���J���2	�]�_�5�؝N�׊W��&N2�fhY^ʓ���%*��[�������'��>�ߖ�PK    �S�9X�  ��  T   PYTHON/EduBook-Cookie/EduBook-Cookie/server/public/images1/product/8936054081882.jpg��Xm�7��B�xq'(P�Җ�
-.).�����h��Nqwwww+��Brx�w����9g��;g��ue�ɽ~��^�f���u�Se  ���@� RrZ�>hhI2Y[��9[Z3y
��3qx��:Z3)�(2���Wd�|����ajo���$�$���^�0=����a=�?y��1�<|<||B"ҧ�D$D��O)����SPPSQS�S��S���#��`=�}��������� y���;&3�	&	� | ��_�?6�G4b�<����B�S�#L�GX��P��i��� ,�Ǥ�^a�i��0��~�����uE���U��5������9;�NaQ1q	I�7�
�J�*�?h�����[XZY��ڹ�{xzy��~��-,<.�GBb��_�Y�9�y��E�U�5�u���]�=�}���S�3�s���[�;�{����˫k���?�0 �����E��&�?�0y������I_i☺�1~~B�:�wE.�����u��Ux�9�h�B�,��/d����Z`b<0� ܿ�
� ��Q��^�=�lb<�c�2D��Cꃇ8�L�,G�n���|޲���Y�~0ɲ�5�qs�\#�Y�F$��TC�T��§]�[�l4�ݶ����EA=Q	����*43>�b4���#��BN������DP۵�l�� �uB1� �g\)����p���{�S���.�7����Fs��2xz�l��o~�甚w��"h��D;�V>�6�DiTt�6����6
�pAB���Ѐ�4��"�� ��7��62���Rd1��r�����-@(�C��?Hn�o$��&{o{��W�C3�(]�G�.��25��h���R�)<��tKc���^����rA9�*h����s���*aڵ�A0�Ѐ���<m�ͯ�:!{�)r3�_HI�e�k7��>���mm�	���6�6����_��u���=�oRA�c4����ph���3!k����`��Km	��P[��`�a�t��! 
S��|8WB�y4`��=#{t�Z5Jid����(mD̽k/t�����h�Q��P���&���|���F�A(~dEƿ�Mf�;7��8x��px�-�����=���0����	����K���	A�۬�����86���+�v�����k�1�z��큩��1�:���+��5r��V�����+���:�d���=o������!G�� �\��"N'�T��N7�X��R8�+uE*���^�M-�gŏ�W�υc(7��c�P���B��Y�k�J������us���P����Wh %��"��ȗ��\��O�ej��h�qd�Lsd������H�n�yG���Ѐq5�A�;4 �otOB^�������"7�7�~1;�%�k���ʗ����g���4��L�<v�H-UBx΋�O�l�H�-W�󼑂h��i�X�r-JɃ"�o�Pp���kE���%r	8Xe߶@&�*6�C���e����^�C���04@8�q�@����=�z��_���y�}Bg^�5LL3H�&�l(R[���΋q�.�&�� ��q��%�>QHP0U�i}q����a�o�f��=�.^�0ǯ�P7�GN*d���%*#mF�Ħ�'���׀2���"J�Ss��o����^�=�$0��rbP�� ��IN�N��h �����l�/[C-q��+k[1��F?f���ɬm��3!��V��5f���#���ݷ����ZY��Zn#r.tȣ����F�r��'�/�a�����������f��6��~�Q1Ho]I�d'�jכ�
��34�%��)��ߓ���r#�_�~�D�����n�M��/�u���%��iX	ֵj�~rN��z̾`��H:!^���.;ale�!��N�������9N�mVl%��k���ӇxI��0�}��R��Wh��ե�����K7<�}}-�S���䶸�=d�������#FT,ī�U'2ac��\��|���v{-]iO͍�V4厓ü�,c��s�a�J��X�#nܻ�iDE�e�������B(q�Gm��&�觳�Y����^'��B�涍�����a%D�.0�e܀����Π��v4���ѥ+��#E C�M�)o���\���8\��Fe��1�f��\C1��a�R��������@{�>�I8��[x]����5�74�A]=��hE�����B�gn���d���<=��?����?r=?��͑��r�Z�����DOu�^y�2Y��cnE���^���k��S���ݷ���"r��wo�6#�}�;��?z�����E�%�����T�������M�(�;��[��Ю�����;No#`���˧Q��Z��#���c��a)з@�6F�����kw7}uCƺ���N�>��y���&w��Χ����z�+~�$XD*�Xp2���߶`T�5���l�Pv��1�j5�m���g��Pq��ԗK��{�����]O���M}T�t&>ޞl.�ܵ˜ ��|tV����\��}��A��;�)��I�f����u�9�R�Pw��?޾�dE�%KS���o�x���#->1����)n��0�V�<�#�/�x�5xq���]���!{�]�D��Hcc����E���:����pi��G�mf#dY;4$2���w��>�y$�d��䵧<�= �ǩ�X��^إ���ȓ��[ϭ��=_(��{'�Hj|�h�`�����><�������Xh!���i&p���d��{{]�i�1�f�PC�>V�!��������G��N�љH[��R�l�z�!�;z[V\��Z���ÙoU6O��Ӡ1�9�}���kc���o����^~rc�~��[R,'B��|C{_���H��.*ۗMV��a���p�Ͱ�9{���yu泤".�>W���W[\�nGG�+��T�"4@Z7n�s��V��G*)�h$:�m�{������ҍc�R�d�_6�����ˢ��NڅyT�&g��a���DP)^БɊC���._FH���G{)���x�˿����A��/ݍ���T&��	?�,��*A]Hd�:j}fȢ�d��� md*ٔlv��j;v���
��g�D#�1���Rvty��1�x���#A"�R�v�rf�<�贻�k���R��!���纶�x���4�������ݰ�&�@��h�s_/�-��%ٚ�^�Y�ƪ|�Yk0ELVNK:�؋_�BhL���T8&Ԁ�1�hg�;zV�n`���}lWD8l ���%"�E�*�k ���K��Hb�O����M�a:a%)��_fj�U�*��%�}�$ʹ��l�"����X�c'���)�͈�D���k�3õ71��[g��.���v3��xs�ɡ&)����N�o�m��خ����ʼ�$���T�9
����v��c"��Kk�[��⿎1�n�A�WǺ�`���z������w�g�Y	��C
��W�4�6}k���!�ݕ�%e^���5����=�'%��!��%��M��1[۱�,���0��K)c9�Kel�׫���zJl����^���&N$�-=���˼�]����+N��c��aa4 �+=c���{/��ڏ9��L�ۘ�¹�g���T���`��^n��� Ee��1��14`���-n��"�zx&3"�v��Jd�D|�5٣Z�3��q?@X�/Y��.(0�L�I#����tG�ϕ�8g�����h�
�Zz�tr�S6��
^�F;]s��_8}��/�v���T7����N9�I��Q�γX�`��Xr?��wx�f0��x]��	Q��CY�8�x���s��,1ծ\�t����p3�u��&�Ѽ��1��dX���������9�1�z,�W�^:d1���m�hK[��[n��N�����y*�'!�;^\��oh���N�?�i��=#M"�6�S������n���yf�nv<�kQ!]�c�EG�4�U�e�)��cu����
�\m)�vKd�A����Je|=&�u��`w�.�x��i>�c��3�f�8�^3�1� ��$�}m5�r,�V�=T������>t�.'��!\;k�$��
� o�wc�0fhD/݉�kn�$����7$�_m��(��Q���l�7q����jB���i�i�����b`�kM��+C�@�����mp�X��@����/����zc��J>��u��fؿ��'Zn�o�W9G(����ʖ�
+Ө�j׷���}�y������I4�& Ա�����n�Y�V&G�e��Eʫο�f�2"Q����Z�HkF����.�5�i��"�^gхw8�̂�MZ��١i}�G�NP��e�u��+�S���Ѧu���|jg�v�1��Č��/�_x`OjP��k����6�z�(��p� ���O��u��TfON�����k�l��Wy�������/���ˣ� �`,�W#��x�ݒ�g�vF�evנ6l���U�i��V_��R ��L͈�_��j�"�bj�p'!�B!R�F<V4Ѹ�nU��&'��CӚ%U�e��a����-\@��5PA��bA�xA�n�FlC��-��0�.��R����=�6(�1�kk-&�=�����Y��v��/�H��K~��W��7�����z�Vj�϶<N/LM��eS<��m'4|<�"��a9�{���ݺGq���u3�S��J��Bp��L� D�yx���YiH1�o�h~)|1����Y��q%FZi3�Kzo� L�_���:�4��P�L%��d��f�iWۘ�;E�8�?�Ҟt,=}�ٳ�ۺB���ۘ�\3$�y��g]0�!��U�dS65`�ط�J�Fq�u���J�/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import '../_version.js';
/**
 * A plugin, designed to be used with PrecacheController, to translate URLs into
 * the corresponding cache key, based on the current revision info.
 *
 * @private
 */
class PrecacheCacheKeyPlugin {
    constructor({ precacheController }) {
        this.cacheKeyWillBeUsed = async ({ request, params, }) => {
            // Params is type any, can't change right now.
            /* eslint-disable */
            const cacheKey = (params === null || params === void 0 ? void 0 : params.cacheKey) ||
                this._precacheController.getCacheKeyForURL(request.url);
            /* eslint-enable */
            return cacheKey
                ? new Request(cacheKey, { headers: request.headers })
                : request;
        };
        this._precacheController = precacheController;
    }
}
export { PrecacheCacheKeyPlugin };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       ɿ��^j:�����bB�}�n�@��}��qUm7�'�=���t[u����C����-o�K��:E	t�O�/�̍��,��B\��t�,��m�9{���A�e�LRĩu�_����"kn���+��G��1�g�h 3��A֫��cG`��
Y����iQ�3J�s^IY�Ń�)Dvr~nx�s�+�$��Em���a@������.����$($�˚Q��;�N��!�ߤ�����-[[qw�M�\�7����h�>*x��\�����Q1�UO�k��/lP���U�a�N3��J-*���;���{����`;���&���[�I��BR�Sϔ)ִ8I2�P|��m��%�АP��Z�C�UQdH> ���.8L4<H��0��T6S�޸�cEyX�0J�%wi�S��I~�l�t�%<�;s��$�v�n�	�VL13[�98���C!����X/K�m�2H��U:>%�!�UQS�قTV�+t
���l΢�yd�7�k������Ȃ6ߴ�Iٶ�e>u�t����s�`�5]�r������c/p��.PË��-�/��E/Jr�e�^������u[���G������nk.$��JlFg4���j�����殍��Ő�g�w_�-�6=)��qA�M��nV�yi;2[�#}��� �Q��<�^yʴJ���b1wT]Jg�Z���S����͖��[I:��o}��&	��E�o&�n�YM:^U�.�wb�Gu�v��A���鼳��޿[G�w�N�Ij�eBek.RWig��WrW1�$��c������!<��M�e��]����H;ؙ[A��2f��+������ylsq]�s�����T:��Oנ[��A�&ꩬN9���?��X��4u|Z�"Q�K�o��A��y��̈́@	�����Q��{՟I��?\���*���4���L�W��f�i�n��,[:��m������=���:��4�.U�ʍ˗7.���l��uQҨW~���H�O�B�|G�a�C���G�Kr%¦Y���/�=�ֱ&�[�,ƈ�-�J�bŤ}��@����\>Rf�ϟ����YKO����
����˙��7.��z��p���Y�-*��"���0ԇ�W4̙��I�W��@�U�P�+6���<���*Eb%�㰷�L�E�ļ�J���.2̝KL`�\bu�d�+vE"�T��E�W�G
�~��ӯ��}} �E�x9¬��p=��m�}�k�f���|'�ͪ�K���&�Qzac-��f�:�(��[����1$�C�'���6��Ů���q���,����K"e�4r�?}��,"�5��h@��[j��E��Е��7e��W���
��*���e/�HK�X�۟/�bV�x�������U��1��"N*M�⁑�ژ�D0�r!���P�=�?	Of�P�_ �W^d�	s]���p撺�M19wH�//g��_���{`��s��+��[�����3u�^�&X�	�A����C��__VHYGC��6 �H�q�2�)����ݧ�6/�j�a����f������-Vܔ@�K�����q�Y��TuvX�w_b�*���gL�	��pǵ��݌qu��'�/���&�w&;�HYo�z�W*�
N�"����o��&Zr��7P��]�?��{��P���0���n)M�"=�$�E��>gs{�^E��c\�e��L��l���%���I(֍�����N�<>�v r��U�4�F^L!�a��q׋T����[�2�舁]��n�b����䷢Iظt��T+	s��ǋ�8\���d��	�ҹP�E�{C�̫5��?�lw�ǐ��t�8EiВw��`�t�Yl�Kolfǌ�/j
�M�x��7i��Bab|#�E�������X���t�w����PR��|9��8�_ۀ�m�����$󊽲��V�<{�4�̣��Gb~ޒ���1�"��NF����/�|W��ۖ>����Bo3A{?��\�ĨT��O�*��x�qtg$������˚k�x���d��ckq�1�:�O�#�f�Ub��~"��� ����IU�l:�<�ց֕��848����5�&D��j�1�F�ĥ̻�k-�0����TzgqƄ��0���?�!ϛk�ة�U����A�'�G�D3� AȶI��`���C��f̂x|(\�U?8;�u;��\٦zN7/i��$)vL���<�`^w�O�3�qW<���Y�3��ҁ�߾�q���u�f�L�3�J/r�f.�f}v�bW���R3
E�Q��*ޚ;}�ZxF�1k%�)G�Qܢ��-:����qJ�xq����1�*������_!�A���:����C�b��ۦ6�Ǘm� @I�3D�S���3���{w�ʣW�!k�'��M�s"C�`�k��h�푖�,y�@o��w�]�S0�'l�*��@�'1�~�3T�Cྮ; }$M�o��F�m�}w��0�QX:�L�Äz�{ϼ�N�-�]�ic�8����禪�%��J-�ZYuo幏�8]8R�)����A��FHрN.7��<#Bx{�{
�e"%�����C��p�10���1�{��^�D��$��T6Q��No�;&o��Q4�gW$o����}J�9qK�G���_���0~���B	�������P��暹�h��Mq��lV��7@.G�.^�-'�f�=��)�&u�#`5ѩSY�PH~�V���
di�t��M��`dK����5gX�T����+
Q��R}�;�t'����Ȱ-\[6 �9`�*�R�I���9[��.��d�*��y�c������:`��˽�.�#�}�w�?�PgOo�d$����]T�b�u�*RG��ɠ&�����r�.��-����_�O�G�j����=/!��*��A%��"҂�7
�*�^sǂ$W�����ޚ�Sj;��o A�SL|b{�>�����rЌ�������s��gVΕ���S�L��c� փv�kb�� x8�J�Q�u��!��a֏_hm���\��g�����E��gD��n�7�zZF�,'b�&�	'�H�OR�I�H��|�>��}J�λ��ə&�����jN)T��_�\��0{�J|�fj��C��RB[s��Oy6`�uQ4����v�̻wI�Js�藤������L�Ж��AX4�۪���Q1�5�����w-͵D��+���J�r�M�6*D4��͋��K������9�ٮ�O$h���	�q_��z\��F�6�Z=�	���&��&O�[#DS;�@�o�7��52��|��7�w�.B6�{8P[s:�%dp�>ޗ���u�4�̸����H�����1n����ɻ���م@b��	u��|�M\�]��F�*�t��Ӕ[��=�M��� ET�:N�WJmb'�?��|72�(�p]V�����×A�$���+����q����������ń�2\��Y��{��oR5˘�/�K~���~e=P{�̏X�R-��Y}ol5^�h����tV#�j�`T�Wh �H�����Nַ���]�%��q9�e9���G���i�A�UO!5I�և{,�MV�vx��'?ݮu��*UPb\���NӒ[ר��J�ר�"1ǃS'�e_��/�0P�䛉�)�E���d�%���������� 3[W�lkm!�������5d\Zb=�fea	!����hѣt�e4c�P�KeB��X���KO�|�08)��Ƣ�3��^�z5��|�
�����XOmٚ�}�ҕ��;�v-�$�Tsq({Fx��1�|�~T��1�+ְP�yE�s����7;�`͊o����z/V���Hk=��ڨC~c�G���ne�!mgL7Tǿ�Nv�l�J;�Ӌ�_���%.���4 ���4Sm0�H���j�`Rd��G셓�Lq�x�m�������Z#�Įȹ�A�F���}���M��2�_���0�y�]�[�!p�V�_X\$0tß]]��?��/[�:O�I�Nq�k��z�A�����!�z=�9BrR�(��J�O�,D i�8 澐߈#7�E�=G'#w1���J��\�1Wi D�6�jM��	RȲ���]HB#Z�������F7�����HvjM3�I��q�{�N~[���������=Eu^�3pxލE���B�H�|{T����ᧄ+[QlSɍ	�-�o����о��QLi�Z� �li�R+&��.u"��n��W���F�����#$OZw~>��/	d��=���w�J�dF��}#Q|���M[�S�ݔ>�}��F&��AH�)����k ��\"�L��м/�`�T�8�
F]��/��18H6N��(1��)gV��|�![a� u��&Y]���Ѷ���h�H]t1�9�fҌ����:>KNyp�.���%����q^�ZvR�gC�vU�>�x�"V<*3b��Ve�sGHc�>O���o��bV{,rn�Zh5Z�?/�V�=N�
��#�|���%5�"&�ȋ�+�d_!��c�J�%>B}[�۴�)^�������\h{e?qr�!�+_*�Q��ɇl��<W���S<��u�0d���g�m�u)Q*�ҩWY�\d�b�1� �կ�j~�r�6��)�߹vs._\��̄
��Eь��6Gz��^�Y����˛L�A�V[I �N����@G��,�%{����1�6�#����ȫbKA;|�;������ �L�*y���B�팒��?��oq��˷Ѐv(E�G)_=��Z&a��^�Z�,�9�zp��`����i��
?e�v�+�~R>{��}�h��3��ii�P�3`��a`�,,��&�m�D�{��m�z���X~�=q����ל����km������M:���7��j���'�2�W`?�Ul�HT�T�� ���(%�;.���=�����p�Zވ�/Y�uW)M&�\�������O>S�qh��OQl�J!����݉&�ܨ	K�B�j�ʥ�ې>���w��&A>��{���陂.�"���*���y1�E�ӳ- ސg��2,����������X`��.o�n�.6��b����Ɏ�2(��[اU���p�7@��@^���_N0��u�����Q�u��%�hVnq���k�Ȇ_���� �&�B���$����o���t<�A���;pWL(���B�s����6�e���<���W��i  ���̯o��&�p�o�O������T��t.��7)u���+�j�<Pe�����N��G���w������]�B�F�F�� �[�Vk'<KȘ.���B�:Ig��a0ە��L���zBn�'����u+;�b�Jd���S�zU����\�)E(S*Ic��zY�&��TR��;�	&80��l�����e�����@��l��/򷕓Ѥ�5�:P1/�!RI����[2���G�yȴ���D�)O"?�}��"]'D��x��*$�w�@MT���M�P�Ѻ�%�ݒR�Mi	/�K�ZA#������~i�5�'��@�:tѡ�X;���~�F
�_�%}���3�ŧ*q�P�`_ݥcK�g鈬�����?&���B����.R�(p��6��`s�G�M�G�a���E�`���Su�}ږ��+��E[��*YRG�uc@٧�_g4�&6:�a��w ���4���-i��j�cV���p%Q�����C�ج��=��:?���/���t��@��ˈ��V�?��7*�{_����0�/3�)��
�r]���R
5{��<j/�#�'j,�̏|�}�T�c���{��r��U%^2��7����QЍ�?�MdT��l�}��y�������Qc����)u�o�
����AJ8�xȋ9i���}ڼ�ա,_���tMʒ���0��B0C8��Vw
L�p�G�Z��MSl����xW�^g�|u��S����tm�Y���g	]�g���Lc4��;��w�#�;y$C<�*�2��ZhQ��qgs���5~�	˗T7Lx����@lu>�ɦ���}U+2:�Rg��E����g�k�C�E��dT	�6&��9���>5��Ł \�o�6�"�M�P�@y󍥻Rp-Fp�?�� 4�J��4�X���k��^���ۓ99��礆�{y*�#����x]�6u�b�qRy�A|��Wo�U#�K�L��y,�L�ߗ���ڂ�0��^![�޴�3�!�|n�j9b�bҰ�L��f!Q��T=(���R�	����L�ī���G�������;��/��Ɏ�IL|6Ѐ�t����HV����nOm�hb����X{[�?b+kųٟ�9�Ifr.Q�w�#�cV�h@P,R����,�|酤��,�����E��p�����O~ssmU�^�VY$Ÿ��G>[���u8Dɂ7�N�s��J�b$�ǎ΂ԇ�v����%K-��7��c�tn�߂��̻'�A�b�'�.4�wQ&'$�fx&�픞l���*hba�m����9?�}W������M��}w++�CA�zD���bRx���e�a5W����ԍg��c���%u��ZF1M����"�!o��zZ�eړ�X�YI5��|�8�w�o΁a��@���j&n�h��w;�!��[J�F���C*�R�䐔M0��6�d������D�[9wI8D��-�?5�v4�<j�]����e�i��}���_t<�^Vu'{�������Ю����x)'l�;�j�J��ͪ-����;�]֓�Vt@�(7�٩O��0+�W	Ht���J��8ů�����J��)#{�:�K5Ŵ�����D˥f�y�1t��,Y��Zߪ`������"}p������ܹ�S���A���c]M�"�I�l�}���f6jt�g���n�'S��5�W�[�56������"��Ֆ.��⨕�.ި~N�:�K5�}��Lphw@�p9O���E�;�l�I���i_�l���b�j�+ C�;N8�~Οf���As��%6����
#ќ��0�%Ni7�+�]��4��������K牨m��V��v���et���H��hڵ��1���ϩ�ES�"�f���'�}d��<sܠ��N��ڃ��(�$>R؀�KD4����D�I6�z����f�s���*p��~��9p~.���[��p]�_T�T��"A�P[滓e�gz���]y�P5�O��ޅ�$'�28Z�!3h�g��J�V�%��٫�Kp�6�9l�kX�ٯkۧ
И�y�����3�rc� f�q,uO[tB!P�F�����%�o.t�/c����
@&�� #���ܶO�$h+�E���q��B����0p������-�ZH(Ŵg��)��[S%L�P�S c�Yݱ�-�!��h����T�N"(�c'B��Oi�ЋJ��Ar�h �Ʊp8�j����rj�ɼ�u�o��������#���W�V"�K

������*PZED
	��OS�� N��v�A��ĕS�ѿ��A��q����צ���e�v��9�Α���c��H>8���0N����o)H��sk[�Ǯ(G������<�h���mJ��y���g�s�����w:C&x�����T��썺^>��m�c�|E����
��g����'
��@��)�����(ρB΅Iה��K�b��������␁Lc�$1A���2�穄K1n��b1P�R��Ȕ�P����F��@���[���=*�Օ�g�*)!��Qz�ǘ�\�"~�Y�����F�s�?=�>��tqm��j���M9u�WRԵ[5��4��iAq������1��lb�;{V	b��1>X�ߝ`0� ��N�	$�r�L��3���*�F�<�����t����suO��&���4��'c��&��9��WF�tC^��~Ǒ��������:*�1��/�������5�K$$�/oA���#+7�l�pi/�<Ȭ.�����C�V��2��s�������4��?i��O�#ʿ�-��p�0�=s�6(�ٚ�IV:7;XKO�؛��iӟ7M8(�[�$�M�y����]�_�����st[Ǝ��"�r}[/��D�N�al��.\\�n��?�,�X�����F|/�`
;�r7M��񲆯k��m����0[{�K&�n����"�o#?ŇP��b�
)�ZV��3�I���Q߶4�82H����Z/'�m$�r��a���SZz]u�R�Y��,�fGE}���A�Ѓ}`  O�<���^�2�<=2y6���5�T86��#LK�Chh�� ,�K���t�ل�ϕJX��h�𰪀lN���KdᘦQD�*p���վ-�+��ڻ�j�M�������~�+�1�XVs�^�Up�i/.�(d��d�e�(<s������П���qN�fvS��O���[խ���>�&��?�c8�y�OF!�4Ǯ�����44�����ﳸ3n���;�(�Ov4(6�\I�^v�Rμ.hͅ&π� z5[�{b��c��#�'pn/)�f���i�dؗ/Y��&�1v�(n��͌�t�I��߆-�6�a3���ϿE��%��٪��t��R��7���o���oױ�)������>�b�s��
��$�	�aE�&X���ϼ) Mנd������4Kׅ�[xe�Yo4�}BJ�g׏H`�"��B�Bh�.P��#�V��ߧ�ql�
A��N4����(��o��B�#������h��ku:����]LE�<���.�bh,qɮ��Cob�9G�q��T��Uz�����6�<vb�؜���Z����Ǡ�8�Eb4����82O� �����`.[����z�gԓ�x����l[���г��� �Q$�܁�<�B	�"LE�R�R��L��*U*����r~� ���k^�]i>�l����5D3{'�	�OY�ց
*�[%L(�m��T���ߴ����f���z�tNCi�P����ͦ9�nsKaK�+JZb>Vo�����y��u����Yg%bR�)?�{�U�>�Q�n�z�k�;]�
O��t�� ��ڜ��� 76��3� itޚ��:W��ՄT��KMQ&��m~��Wț���,ix�X­ˀⲂmJ���ٜ9wv6^:�3$;�
�4�`�aI�����Bc��0���ߟ����=���߷ ϥ�?��B��Y�
�n���[�q}�;)w�3�^}o~���0𨾅����4�Ixi^xI��nR��&|ٰ%2ZHخ�>�)��7��8���V�K��� I�K�a�Q��[٣�,�pPQA�)��X/ML,1�GxV����������U�B��~@�_l|XhK��+�km�9��l�*����)g=�@���K�͔�Kc�I���?v��Q3��єS�Jh��V��S�'w$�'��#����W.�E	�H��\�A���d��%$O�Ik�1���a2���p��n�Wd������q�cp����nӣ8���VԹ����Ö!��\���1Ѱ~_ނ�[HbK�'���">�q�5~A/�,u�v��:h�b��88�=?��.LA�!~�M�M�~��b4?BV�V�×q���3c���GsM2.�'�=c�Y3篞܆���@w$�/�v��d��Q�����O��jn�����Umg��Ne���g�q�������Z�qG�P&ssN��?��砷������+�/����M�� ����� ]p�$�>��0���%�D�@hoN��̨L� �Bm��[㟰|o,w����F�����M"`ĝɺQ��6�+���y˶g�ed�����~	�4�q�>�e��@�@4�/�M��+��/�=k$�<��?�x���d���e�~��Y������)Ϟ���u���baɨ�h@��2����/s��>��I�qN����Iӕ
鶺ׇ(�0�s=��:H��
�U�Nca�-��&c�9Ij'��ȶ�|�G��|�Xu�=�����4����R���ݺ_��:�q-4Q��ƨɧ��ߘa[N�����4�;�E�&}ii "���!����N�c��]o^�I۶�t�LA�%!�9�=>�;���H�N�KM_�d�&P�FA�:�B+O�Z2��9l��@p�L��X�g���C�y.{'J��B[!1b�"���aC�a}���˴�_zX%�!��c}�~D�l������G���x���gxv�*�G��#�B'n��:]ju����޳3���,�EH>�h������7)���Wƈ�M�o�'���<�ſ�ߍ.S�
`
s�~g[/o �-؈&t� J�3T�+]ѰyFȝ��K�n���*g��Ddg�FYo��y�FB�YS�31fu�� �
���p߱ $xCD�l?��s^�cW�x����/�Pl��n�G�I;3UU��������ޒ���������h��d�ךӧvU]­�mT��X�y��$
+�^V8��LP��)1��*_T�K��;�J��8/p(�1<LLK�rY&q$j�l&���S4S�y�����?8SpLEI�STJ9a�������U��%O����J�/nz��W�i��KO+��e�|���[5��u����cl7��/6�G]���!:@aͺ��]ys/8����&�U�5�g:�@؇'10���ޗp'�5�" ���i�u�������W&�����|{n�9�e�y���;���H���L�
��9m����o��6��d�х���5ܵ��Q���y��������q�{SՇ��qpG�|D�%����ܲ}9�D�)���-�>��q#�F�U\i�MWL������� }�'�_�%0�ρ��0m�&��UX��?�LV]K�_��*�ѥ�}�L�>L��Ta�j��]&-�"������:�
	�x���H�b��������r	�˻c=x�����O��y�<P���o�c]��&"�9�l�e���k��&Ȗ�<n����k��Ͷ:��(8�J2�T��	(���t銽xmώ����ŝbL����Xߓ��-�<����1�^.�e�
5���h��Ӎ9�>e��G�ʌm�c)����'��o�ih@�)�2"k�[�\��p.i������}���\Ec�)���K�i�|rp������d��%G��3�?}/��&%�&�6W�+_�Į�+��σ����X���2B��͏�l}��}���^O8	{+�ӀE,-��?�_�M6K�R�ج��)�*�ũzy�l�tLz� _R��aT��}��c�*8��>����7t��{�n�fp��<yhBxzҽ�P�R����r]'�\=��[�	��K
�Qo;Wnk����_����P��_-�qЍ�;�W��h]@�����`���+���_s�a����ʌې�T�q�7�,ts
ф�G���
���H�s�Ȳ%�wE� ��9�XK���3�:u�@��룁0��"��_�dQ}_>M���Wk�5�.}{#`��X�t�/���3�����a��w�Hu61�X�1yQ�@�>�:#5M5���D�l�JO���F`;p_>ڢ��c5o������m��\!�Z	�6RBvsW�I� �z�ux�>9�Dۛ՗��z�-�.���jR D1�D�'�Z�S�Xʛ!]��/�ǎI��v�<��"Mt��������kfنo���SY8է�(TF�Q ;��s�Dٿ�P���oyF%O���F&Q�[{�V,��"}���瑪���iHd����s[�����'	p�|K'��Ğ��pf�z����OR��?ڬ��t�d�|����s�����/v��D>2YN���������b�v��R��)in���������>�h#�/W��2�F�
(���}fec�v9]t~9�ڵ���P}��ԃܝ��ŧ(6��eQ�)�o��k[=ȉO��~uQe��+b��lu����6��0�EW�'̻�o���
�J:ȅ�����6��qsZ�`�V�$V(�N6�8W� A�hj_�Wyy�8�Ӳ��4��l��-T�h�`�OH� �"#�:p��3\L�|/,g�'�(3�m�s!���N�x+1���_�2���S��~�7-����yN�X�Xa�{���%��=�m]_yD,�c���������ɖ%m�CA�k��p|�@2�;��v�rZZ{�T����I���隔ۏ3:�� 82��V��VK+e����:䢟���P�����ڀ�=I!lN>ȳ3��9����5�l�I�4�+��է�A��C3>rN�v��bb+����矑]Q�z��Ыl��c�0��Lq�y����@t����O)4�65|��X�'q�m.�e�>�+7��YҪX��0H:�AW�*t��n =X)N.�6q���秞�FW�f�x��R�J��|�<��GS���g�˱FݯO}u�������0�x"��Q<�c{���p;n*=Z̿�~e��!w�_:M$�m��?`5��ePğ;$t7E�It���zϗ������?f�y��l���p]}�����r���ԣ�x���^�� 3eȈ=�������:�{��4fAQ�|i/�cD�{��Z�i%��UH{�A���[t��N�ڠ�U>�z+�f4/h�e�p�]���wojj������4�O�y�g�/�����%+&���@��A�7u��(����g�46��Ӆ#�>>�؛�M�|��}
�M�	��As�L.��S�Uߗ��3��Y
"ۉ��K*��^�%^�v4�|��H�U�q��@��zw���am�5Z�@���)�����\=�?c�%������ޗ"s��eI��7=�Q�?,��{�Қ��ķ�Y�Cpz|��2��=g��Bu�Fo�D�%�m��54�|�i0��R����; �h���e�ϲ�^���]'���I��7�@,ɨ�[D���R�y�������C8����S4`���5�m����JF|J�cy�;�ڪ�w���_��->6���.F0�煝5���akRږK�p�u}"JkX%�Ce8Iݷ7oF5��>���pA��U�XD R�<��I�m��=ݗ�9�����N�3O?uQLV�Kw��y��^���GmNx����" 4�Ȟ�|񧀖��
<9xj�������':���2���5����҃�W���H��E��������^��@�e��AL���S��~�4`;㿪|�i3:�r�T��'�|�Zv��#Ɋ<�Wv����Ō</��!h@��&��ag�?�a3�n���pީ-��$�ٱ��zq�|���[I�ɛ߃�K�wqO�g���>�%�����@���)M]��ݭaݒ��G}��֌0�S��:����A-��omi����5�l��U���n4`���Y���VC�䯭�_�ϟ�MV���ߩxG��BK� ^1����ђ��;UI\1+\%�
�����*4���ٵ�t��mC�M��8ۜ`\ʩ����1g_��Euá	�����"����'��j�a�P3`H��׹$�#���]e��_���T=X���� ���t�����.'��F9}���Ԡ�����' �T��f�F�~�E����%c�#��,�m�E#�e{�{aذ���QL�L�{��(<l.E�Y��	U���@�O$�������wm������[�0E�B�6٣�%6TU����?)_{?�Z� ���p�~����:s��h���{�zC6Vs���d����o~3�����8��ܬu�y�lXx�RW�
��?W��*? �c��/;3I]�\R�|�8V���B�);-)-�K����,��"a�J�H��]��,Q��@dl:={����nS�]����n"�@s���faϜ�[�v���ݱ�j�.��V60��K�V$�0ir�Uи���[�粵-�Vd4�4�j-�}�$�?�!��?h�17F�*DAh��8�[�D��K~|�s��o�x�P�B�:�E��҆jG/i��U�+m�h��l+j�p_�cg[��_o��E�J9,�8���yi&~���,;�4#/�q��d׉��WB�����o�ٯ��ػŸ�&���bC1`�V�X��>�t_��i�!��^��x2W�
㚘`i��ƄjU��W��YR�&!���P�'F�Q�yu��q^J��ټ=�-�P�VVB�is�D���� �q3�d���++H�7���u������xW����rN�Ggo�BQ�3�����E�R�~-C�Xk�_L?}�Ͷ��½B����9�	�Z5��W?��
2T w�Gmқ��<U[�\�7�P�ԑ��;�O����=+D�_�F�D?؁an�j6�BS6ԸL�|ơR]��X��y����?�/zW�]�B�ݫá,uda-R�q��g�����O5�찲�\��پ��H�xm�� �v4�����@�:	i~��Vr�3l�3@�	)gx����j��Բ��8+�Q�/&G���}���(���	B����@$=H��l���(�R���1������#%�Vg���t���H����xg.��r�T뵉�9b��}߾*�i��|��uqc�j��Vv��
�]u�����*�n�q��2Ƚ�(%�z���1�+0�_���QIvK�cj7�U����Ȼ� kߊ7��#�矓���ty�2)V7�˷d����C�fNg�[S�&m����+a*�'H�d��+�E�A��6'Z���:9֧8r�����,�{Qp=V�J�S�WC�؎@��j/**
 * @license React
 * react-dom-server-legacy.node.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

if (process.env.NODE_ENV !== "production") {
  (function() {
'use strict';

var React = require('react');
var stream = require('stream');

var ReactVersion = '18.2.0';

var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

// by calls to these methods by a Babel plugin.
//
// In PROD (or in packages without access to React internals),
// they are left as they are instead.

function warn(format) {
  {
    {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      printWarning('warn', format, args);
    }
  }
}
function error(format) {
  {
    {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      printWarning('error', format, args);
    }
  }
}

function printWarning(level, format, args) {
  // When changing this logic, you might want to also
  // update consoleWithStackDev.www.js as well.
  {
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();

    if (stack !== '') {
      format += '%s';
      args = args.concat([stack]);
    } // eslint-disable-next-line react-internal/safe-string-coercion


    var argsWithFormat = args.map(function (item) {
      return String(item);
    }); // Careful: RN currently depends on this prefix

    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
    // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging

    Function.prototype.apply.call(console[level], console, argsWithFormat);
  }
}

function scheduleWork(callback) {
  callback();
}
function beginWriting(destination) {}
function writeChunk(destination, chunk) {
  writeChunkAndReturn(destination, chunk);
}
function writeChunkAndReturn(destination, chunk) {
  return destination.push(chunk);
}
function completeWriting(destination) {}
function close(destination) {
  destination.push(null);
}
function stringToChunk(content) {
  return content;
}
function stringToPrecomputedChunk(content) {
  return content;
}
function closeWithError(destination, error) {
  // $FlowFixMe: This is an Error object or the destination accepts other types.
  destination.destroy(error);
}

/*
 * The `'' + value` pattern (used in in perf-sensitive code) throws for Symbol
 * and Temporal.* types. See https://github.com/facebook/react/pull/22064.
 *
 * The functions in this module will throw an easier-to-understand,
 * easier-to-debug exception with a clear errors message message explaining the
 * problem. (Instead of a confusing exception thrown inside the implementation
 * of the `value` object).
 */
// $FlowFixMe only called in DEV, so void return is not possible.
function typeName(value) {
  {
    // toStringTag is needed for namespaced types like Temporal.Instant
    var hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
    var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || 'Object';
    return type;
  }
} // $FlowFixMe only called in DEV, so void return is not possible.


function willCoercionThrow(value) {
  {
    try {
      testStringCoercion(value);
      return false;
    } catch (e) {
      return true;
    }
  }
}

function testStringCoercion(value) {
  // If you ended up here by following an exception call stack, here's what's
  // happened: you supplied an object or symbol value to React (as a prop, key,
  // DOM attribute, CSS property, string ref, etc.) and when React tried to
  // coerce it to a string using `'' + value`, an exception was thrown.
  //
  // The most common types that will cause this exception are `Symbol` instances
  // and Temporal objects like `Temporal.Instant`. But any object that has a
  // `valueOf` or `[Symbol.toPrimitive]` method that throws will also cause this
  // exception. (Library authors do this to prevent users from using built-in
  // numeric operators like `+` or comparison operators like `>=` because custom
  // methods are needed to perform accurate arithmetic or comparison.)
  //
  // To fix the problem, coerce this object or symbol value to a string before
  // passing it to React. The most reliable way is usually `String(value)`.
  //
  // To find which value is throwing, check the browser or debugger console.
  // Before this exception was thrown, there should be `console.error` output
  // that shows the type (Symbol, Temporal.PlainDate, etc.) that caused the
  // problem and how that type was used: key, atrribute, input value prop, etc.
  // In most cases, this console output also shows the component and its
  // ancestor components where the exception happened.
  //
  // eslint-disable-next-line react-internal/safe-string-coercion
  return '' + value;
}

function checkAttributeStringCoercion(value, attributeName) {
  {
    if (willCoercionThrow(value)) {
      error('The provided `%s` attribute is an unsupported type %s.' + ' This value must be coerced to a string before before using it here.', attributeName, typeName(value));

      return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
    }
  }
}
function checkCSSPropertyStringCoercion(value, propName) {
  {
    if (willCoercionThrow(value)) {
      error('The provided `%s` CSS property is an unsupported type %s.' + ' This value must be coerced to a string before before using it here.', propName, typeName(value));

      return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
    }
  }
}
function checkHtmlStringCoercion(value) {
  {
    if (willCoercionThrow(value)) {
      error('The provided HTML markup uses a value of unsupported type %s.' + ' This value must be coerced to a string before before using it here.', typeName(value));

      return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
    }
  }
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

// A reserved attribute.
// It is handled by React separately and shouldn't be written to the DOM.
var RESERVED = 0; // A simple string attribute.
// Attributes that aren't in the filter are presumed to have this type.

var STRING = 1; // A string attribute that accepts booleans in React. In HTML, these are called
// "enumerated" attributes with "true" and "false" as possible values.
// When true, it should be set to a "true" string.
// When false, it should be set to a "false" string.

var BOOLEANISH_STRING = 2; // A real boolean attribute.
// When true, it should be present (set either to an empty string or its name).
// When false, it should be omitted.

var BOOLEAN = 3; // An attribute that can be used as a flag as well as with a value.
// When true, it should be present (set either to an empty string or its name).
// When false, it should be omitted.
// For any other value, should be present with that value.

var OVERLOADED_BOOLEAN = 4; // An attribute that must be numeric or parse as a numeric.
// When falsy, it should be removed.

var NUMERIC = 5; // An attribute that must be positive numeric or parse as a positive numeric.
// When falsy, it should be removed.

var POSITIVE_NUMERIC = 6;

/* eslint-disable max-len */
var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
/* eslint-enable max-len */

var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
var VALID_ATTRIBUTE_NAME_REGEX = new RegExp('^[' + ATTRIBUTE_NAME_START_CHAR + '][' + ATTRIBUTE_NAME_CHAR + ']*$');
var illegalAttributeNameCache = {};
var validatedAttributeNameCache = {};
function isAttributeNameSafe(attributeName) {
  if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) {
    return true;
  }

  if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) {
    return false;
  }

  if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
    validatedAttributeNameCache[attributeName] = true;
    return true;
  }

  illegalAttributeNameCache[attributeName] = true;

  {
    error('Invalid attribute name: `%s`', attributeName);
  }

  return false;
}
function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
  if (propertyInfo !== null && propertyInfo.type === RESERVED) {
    return false;
  }

  switch (typeof value) {
    case 'function': // $FlowIssue symbol is perfectly valid here

    case 'symbol':
      // eslint-disable-line
      return true;

    case 'boolean':
      {
        if (isCustomComponentTag) {
          return false;
        }

        if (propertyInfo !== null) {
          return !propertyInfo.acceptsBooleans;
        } else {
          var prefix = name.toLowerCase().slice(0, 5);
          return prefix !== 'data-' && prefix !== 'aria-';
        }
      }

    default:
      return false;
  }
}
function getPropertyInfo(name) {
  return properties.hasOwnProperty(name) ? properties[name] : null;
}

function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL, removeEmptyString) {
  this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
  this.attributeName = attributeName;
  this.attributeNamespace = attributeNamespace;
  this.mustUseProperty = mustUseProperty;
  this.propertyName = name;
  this.type = type;
  this.sanitizeURL = sanitizeURL;
  this.removeEmptyString = removeEmptyString;
} // When adding attributes to this list, be sure to also add them to
// the `possibleStandardNames` module to ensure casing and incorrect
// name warnings.


var properties = {}; // These props are reserved by React. They shouldn't be written to the DOM.

var reservedProps = ['children', 'dangerouslySetInnerHTML', // TODO: This prevents the assignment of defaultValue to regular
// elements (not just inputs). Now that ReactDOMInput assigns to the
// defaultValue property -- do we need this?
'defaultValue', 'defaultChecked', 'innerHTML', 'suppressContentEditableWarning', 'suppressHydrationWarning', 'style'];

reservedProps.forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, RESERVED, false, // mustUseProperty
  name, // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // A few React string attributes have a different name.
// This is a mapping from React prop names to the attribute names.

[['acceptCharset', 'accept-charset'], ['className', 'class'], ['htmlFor', 'for'], ['httpEquiv', 'http-equiv']].forEach(function (_ref) {
  var name = _ref[0],
      attributeName = _ref[1];
  properties[name] = new PropertyInfoRecord(name, STRING, false, // mustUseProperty
  attributeName, // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // These are "enumerated" HTML attributes that accept "true" and "false".
// In React, we let users pass `true` and `false` even though technically
// these aren't boolean attributes (they are coerced to strings).

['contentEditable', 'draggable', 'spellCheck', 'value'].forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, BOOLEANISH_STRING, false, // mustUseProperty
  name.toLowerCase(), // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // These are "enumerated" SVG attributes that accept "true" and "false".
// In React, we let users pass `true` and `false` even though technically
// these aren't boolean attributes (they are coerced to strings).
// Since these are SVG attributes, their attribute names are case-sensitive.

['autoReverse', 'externalResourcesRequired', 'focusable', 'preserveAlpha'].forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, BOOLEANISH_STRING, false, // mustUseProperty
  name, // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // These are HTML boolean attributes.

['allowFullScreen', 'async', // Note: there is a special case that prevents it from being written to the DOM
// on the client side because the browsers are inconsistent. Instead we call focus().
'autoFocus', 'autoPlay', 'controls', 'default', 'defer', 'disabled', 'disablePictureInPicture', 'disableRemotePlayback', 'formNoValidate', 'hidden', 'loop', 'noModule', 'noValidate', 'open', 'playsInline', 'readOnly', 'required', 'reversed', 'scoped', 'seamless', // Microdata
'itemScope'].forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, BOOLEAN, false, // mustUseProperty
  name.toLowerCase(), // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // These are the few React props that we set as DOM properties
// rather than attributes. These are all booleans.

['checked', // Note: `option.selected` is not updated if `select.multiple` is
// disabled with `removeAttribute`. We have special logic for handling this.
'multiple', 'muted', 'selected' // NOTE: if you add a camelCased prop to this list,
// you'll need to set attributeName to name.toLowerCase()
// instead in the assignment below.
].forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, BOOLEAN, true, // mustUseProperty
  name, // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // These are HTML attributes that are "overloaded booleans": they behave like
// booleans, but can also accept a string value.

['capture', 'download' // NOTE: if you add a camelCased prop to this list,
// you'll need to set attributeName to name.toLowerCase()
// instead in the assignment below.
].forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, OVERLOADED_BOOLEAN, false, // mustUseProperty
  name, // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // These are HTML attributes that must be positive numbers.

['cols', 'rows', 'size', 'span' // NOTE: if you add a camelCased prop to this list,
// you'll need to set attributeName to name.toLowerCase()
// instead in the assignment below.
].forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, POSITIVE_NUMERIC, false, // mustUseProperty
  name, // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // These are HTML attributes that must be numbers.

['rowSpan', 'start'].forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, NUMERIC, false, // mustUseProperty
  name.toLowerCase(), // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
});
var CAMELIZE = /[\-\:]([a-z])/g;

var capitalize = function (token) {
  return token[1].toUpperCase();
}; // This is a list of all SVG attributes that need special casing, namespacing,
// or boolean value assignment. Regular attributes that just accept strings
// and have the same names are omitted, just like in the HTML attribute filter.
// Some of these attributes can be hard to find. This list was created by
// scraping the MDN documentation.


['accent-height', 'alignment-baseline', 'arabic-form', 'baseline-shift', 'cap-height', 'clip-path', 'clip-rule', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'dominant-baseline', 'enable-background', 'fill-opacity', 'fill-rule', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'glyph-name', 'glyph-orientation-horizontal', 'glyph-orientation-vertical', 'horiz-adv-x', 'horiz-origin-x', 'image-rendering', 'letter-spacing', 'lighting-color', 'marker-end', 'marker-mid', 'marker-start', 'overline-position', 'overline-thickness', 'paint-order', 'panose-1', 'pointer-events', 'rendering-intent', 'shape-rendering', 'stop-color', 'stop-opacity', 'strikethrough-position', 'strike"use strict";

exports.__esModule = true;
exports.applyMissingDependenciesDefaults = applyMissingDependenciesDefaults;
exports.validateIncludeExclude = validateIncludeExclude;
var _utils = require("./utils");
function patternToRegExp(pattern) {
  if (pattern instanceof RegExp) return pattern;
  try {
    return new RegExp(`^${pattern}$`);
  } catch (_unused) {
    return null;
  }
}
function buildUnusedError(label, unused) {
  if (!unused.length) return "";
  return `  - The following "${label}" patterns didn't match any polyfill:\n` + unused.map(original => `    ${String(original)}\n`).join("");
}
function buldDuplicatesError(duplicates) {
  if (!duplicates.size) return "";
  return `  - The following polyfills were matched both by "include" and "exclude" patterns:\n` + Array.from(duplicates, name => `    ${name}\n`).join("");
}
function validateIncludeExclude(provider, polyfills, includePatterns, excludePatterns) {
  let current;
  const filter = pattern => {
    const regexp = patternToRegExp(pattern);
    if (!regexp) return false;
    let matched = false;
    for (const polyfill of polyfills.keys()) {
      if (regexp.test(polyfill)) {
        matched = true;
        current.add(polyfill);
      }
    }
    return !matched;
  };

  // prettier-ignore
  const include = current = new Set();
  const unusedInclude = Array.from(includePatterns).filter(filter);

  // prettier-ignore
  const exclude = current = new Set();
  const unusedExclude = Array.from(excludePatterns).filter(filter);
  const duplicates = (0, _utils.intersection)(include, exclude);
  if (duplicates.size > 0 || unusedInclude.length > 0 || unusedExclude.length > 0) {
    throw new Error(`Error while validating the "${provider}" provider options:\n` + buildUnusedError("include", unusedInclude) + buildUnusedError("exclude", unusedExclude) + buldDuplicatesError(duplicates));
  }
  return {
    include,
    exclude
  };
}
function applyMissingDependenciesDefaults(options, babelApi) {
  const {
    missingDependencies = {}
  } = options;
  if (missingDependencies === false) return false;
  const caller = babelApi.caller(caller => caller == null ? void 0 : caller.name);
  const {
    log = "deferred",
    inject = caller === "rollup-plugin-babel" ? "throw" : "import",
    all = false
  } = missingDependencies;
  return {
    log,
    inject,
    all
  };
}                                                                                                                                                                                                          ����h��~O���)L�����$���fE"�]o]Yq�qU��k�Җ"x�������}�d�tr�w %�H.�F�������(K,�Ǉ|y��z���Gx��Ӳ*���r��(z��.2���ӹj�b��nE�����/|�SJ�M�����*,�Y~$T#b�Y��<GWu��˟<<C�l��P��k�����ޓd>��gx�nY��Q&��*m�f�T sg��-�3��^�w�	͘W�\����W�P�*�u���tU����f.o��"�.�D��O����'�|}�h;��@��G����P��<��M�=]Kf��+�<�}{5�k���O�5>ˎp��n�
x7�Ѝ�hq�Jzn�$���n\�L%���:fGQ��d�O��r-�!]d0�RDF���3Yq�m�-ά7jE�,�A�_^h��I�Cl�>����p����2 p?����B������V	���C]�B	�ZMl�/��]�Y~�>�Df��S��kkj��ʨV-�����=�L-�5�=��v�!ߚ"�������θ�� ���}��ɱ���>��D[Ѵ���0ܧ��G6q;��⧍F,q�+�����.�k�/F�?>n�iւb�X��~�d���br�7!j�ʑ�vr�&����S���}W�d�l ӂ�PfO�46�ܩS�<���U����V���^C����A[�{r��#[,t�}ʒ���_�3��v��<p:|4xnɶ��<����lo�n��ML�pT)%�<�/j�^��������t�,���w�i�i�*o���\��3R�М9F=X���������	�F��A̓7���g��Ӌ6����a���O�֝�SB�ķ��A��TQz�/����{���mi�����v��M�W�t���)�1n�+���N
���+8փ�Jqx6�Q	��(z 4w��,M9x�B�.y��@���j�y(�t�NToL��G���q�OS���8'�dn�nM��Xk\�'��>�BS]��Z�؉�oi��c��~9o�t�Jg9��n��B�3����Ԗ�t4�B�s���~TÑN����~�Jub�e��!L�|>O���kא��
W�y����i�]]������z�j��+GBK��-��{�Rտ���ك����F"9$��N͚�oS��r�|V�r��7.�Q�)ϓ��-j�$�9x��`����_g����D`v�H/4ȭ����\�����D�/���c����ķ2xS4������	˝�Lu�9�E��<d)�V{)�T��9�����Z%��c�4�v	F;�A�6'�L�##�C�r%Pn].Alk�lk^�̴%a�F����֞e@xfz���2�!��z]�՞(��S��h�$���J��i4%�g��4{^�DV��4C�48���骰����X�x���j�{�
���(��=wH`<,��3�dBÃ2q�����F����4�e kض�����=_���?{�8Ei�1n��:4r���������j#_�\���'��3��HTJ3ׇ��NLAqX�<��"������B2 ��L��l�QU�d^���~����h[}48�y�"��q~�?xa����� 	��?���8�Ȁ�d zX	l�%�A����_�]52r�Z�_\�Ð�V��FY��H%*E����(�ɀ�s�y>��m"^N#�rN9k�E;���'<rPB�$pyP	�}ۗŀ\3�7�sc��;�V�=�NXꓬ�a���7	�������������s�|�}8����d��bLN�ђ�S�by���*$�o�$��?G
~Fw.�ҳE�)pj�\�[�4w�j�ϻ��M'��Ȁ�8���H<���g�:e;���Z�"��_DҀ�r��)@�HC՞ѹ�/l�!���4����eBV�?RBw:e��w� �����4���;����bF�%&]�8r�M�$�G���,��;���� �R�������y���6������k�!%�X,tz��d �Ҧ= �lF"z��;u*�'�<��������|I�{q".���hKo�
�XҚ��<z��u�gH«d�u���;S�p!�k�_�W��Gx�FA۷�&;5�(QF{7��P�N�tM�Ul�]ڢn��Va��~|IlC�שVNЖ�SR�����d�?[A���PK    ��S�Yy��z  �|  T   PYTHON/EduBook-Cookie/EduBook-Cookie/server/public/images1/product/8936186542176.jpg��u\A�6
��� ����<�{���>�wwww�	���0� 'Ϸ��=��珳[��o����ꮺ��ޗ޷ �2�   ��x�)���*(�S�3Yڛ�Q��1�Rҹ8YؚQJ�HR�(�KR�r���tp1��p����cE~_��`a�����v����HH�P�QQQ�QP�б1�б�QP0�1�pp���P1�q	�q�p��ܿs�>" |�ECA���9�� �>������|�b��a�� (��D��_�������#2ʿ1�0pp��p����>���X؟�Dq��>;���~��^ۋ�<}E���1�#2>!1�Z:zN.n^>~���R�2*�j��Z�F�&�f��N�.�n��A�!�a���	��SR���
��KJ�����[Z�����GF�ff����W�wv����O�on��!O�������������?�``��s <�'6DlQ%$C���p�����~��P����8��O͹Ms�h���3`��!����Z����{ypX ��J^$�[uZ�u;B��GDǖ��7��J���Md��D]a�z$��;@#ewF��[�Q��yVE�Uxf+�Q���P�y�B^	���ը��@[�s�!V��Sv�bA���5�� S��]�V*�;t��1O|�#ڹ���c)��ǒ���A[�����YNG%�۳���VKX$M��۪����B�V�t���Y��	�-ҵ%R)�f(�����/<5��-)y:�x��˾�]/}��E�B���Z3%�[}�[�A��/������T��N��ct���\'����/^i�H�vР���4���J���w�~�c�|x���t^"���!7���r�o;�-�e!�Tԑ.��^�8�9�ca��%�0nZS����(w�N����w���n�����i<���Hw�3��Ii���`�=���h�66���R��`zpu�utF��8��k*t�wpBx��96���Aӏ��援�cD�g���	c�풥yƘƚ�3���{7~��d�E�ë�{�QRQMs��g�z�1�U@c#b3>�n���ߙR�1{r�3�k��L3m�,�z?ˌ�/��M��)(�P"��K��|;](��aKp-�0�<R�B��ݤ$���L[W	�R;DL�Α{�K���(m���ؐ�&��~��3y�6LRcPR۶���i8\c��X���R�Wa��{�b�"�}��������X� ��@���x�>�2��tz��ⅲ'�)��g%��O�vf
r�z���rk��/S3k�����'�֬�ᶍ�'��X}�7����Ʈ�e�OI".?r�F%�T�G����b���7R����8{��C@zK��y�����8HLc�w�k�DW�&�,'��}�A.�V�.�$v�о=SE��+H�jgZO�RI�?Mc*��q��x��`�8�r�}�k߅��wN��-i��~k��s.����v/@�a Gc>1D���ؠ�?����NߥR֜2]�������:�?�y�"'��[���΍�������*�e��q['F��_u����E�>V�Md��]��/��-�������"u����Ђ�8.����7CCf��@J-Ŋ`\y�E�X5�ܝ󜖵02�g��.#�#��3Si�ft7kj#�:��6]_��6��%��0�p�XZ`��ݑ'�\���`x�3-�ӌ�6�'�v�u���
�ʍHc�}��|���8w^�ׅqc�Cl�M?kz��o���t{��᳢�­��OM-{ ��Z��n:���.��ӊnl��9�P���T]nFrE:Af�Z��u�=�����Ω��y/�G*=�Xs�DU1�2����,;��W9̦X�gl�>���+@���n�Ej�Z�ӆ��y�L�Z�%�-{�/���)a=�x��ȿt;�F/� ��Ka�H��)��5�x�S5G���������v�T��#��]����k�?MwP��O�N`6�:�^��g�AF�?=�^>�W���|�����R	��Pb�:ucr�Ae���X���u�*����%ʒ}/��OÞ�+]s}rY��?�Ϥ.�;@�[�lJ��qc��]g��1�����/O���/ר��}����Wˊ7�8����P��rm]��:�����~�=dQ��q��d���ıF���$o��l�{ÙJR�1��A]m���۾H���i]�5��}�����;�ݗ_�8}�B�1���>B��Sa�sȠ�-$�-��5����TJ��ɶ%��?�W��gR��u@�];����V��PDu�o��,�C���9E�hZ2d�ʘ��G���Z�i�tF����s�����~W����ѭ�E��Ak�DզA�4��z4�z����Խ@�J�b2U�����v��xR�?=�$g�D��{k^g<ˇY|I0<��$�p�9��5u���q�U��U�=nv��yz̴@��@*�
+�z{�2��>!!k-ÄJJ�i�օwR*�E	�+�_�x�9������d�H���B��D愌�g_�ajd�G0�;@��"2A5t����:C+̒�L�J�8@Jq�c�ؕvN]��!��t_�����^m��eC�9�g,E5$9� p�b�,^��?Wa�+�[?�k��fL�!bg������U����yf.X����0��ż#OcV�P���G�I�LMj��;U�&]sj*���7�Nr̡G@�^e�֗�/c�=`����`�$ۆI~j�q���7��Ù�^q�ӕ�Q>�ݙ�4.�l�JnV­������1\`��}+ߠ(�����n|4�HNr�rk��&,�kS?R1f5�Mg8ߗ?3���ri|Q�/v
��Wo�/X�if�yZ�+�40\�=`.#J���zT�`r�Aw�؏��	�_�0`U[K�� �t3��G���xk��Cl/1&^��Z���y�B%�+���Y���.s痯^�vJ�g���� �>�V���t��P�w@P�)mt�i��d6!�w��� x���+rh�K��ˋ�>2�"h�4�MY���U�&��(��ep�|�7$��N[o���R/� �kҥ���`-�j`�(�S��]�V� �m��U�ʩ�y�sd�fQ!�X,\p�5��v�@F�u�nz�R��/��i�CH��;`���K����<��;x墍���x�Y{@bj҃�Z �V���կ����^���<W��	���`��u�JP��ܷ�j��AS��p�g�<ޓ���(q\5�\�o�Ӽ�_L7�M���k��������Dl`��)�Oe?5_����?y��[+=<uC���ۍ��[(���p��c�Y�4�$u���۴���1X�6�ޞ�^8��F�˨F�P������t���Zd.��?�7�!�XAϪ��Q��m��Ŵ�;f�D�x��i*�1��r,HCW�1	��Mv'�O%��J�����]�GǮ�n5ݔO���S����B�R�Y.~}%=��xQw��\�M�
����/Z�7��gq�c� 	��2��<K�)��GP3̷*K2��o-��t���_H&����E����'�w�V��(�,Ӭd�̅�i�z���19����.��hN�mq�v�g�<h���rVh&8J��IQ��R��:̑'f����-���H�%I�ƪ�[>.����å�^T�U���C&]�Oŧ&�Kn���~�S������T(�ʠ��I�o��B�g���"��N�֭� U^_��^GFB�@VO� �=6.u���g]5�	KJ���kk#������[.?��%�f+��<ɮ�r�if��-�B?�$�Q�5=�\+�R#���j��ϻ	���\0c2ݨ��)r�{�7�s�0(P�I[S<zGg͗�Y9qE�~�46�o�������:d+qO�;��N2�v5̫�á�L���Ђz/��d|k��D�e�����|���o-]��2�u(F�rE��Mx��^�0��F�f����֢1��c¼�R��V���ݮά�Dq���l��0F�՜�7��i�ڻ���ʼK[��G���g��F/����r�IW�cS5*(6JV�8h޼�@�}�h��%�u��>��N͈a@=�}�l%?��L�82������/����`�j���" ���a����d3����0:��v���N4�Np�`�Fv)���G��ݩ����k�$��K���Q��@x����,*$�G'Ҙx�h��h7�E��Ϡ��dw�]ҷ�����?jo�)�dAu�-'��͓={��>���m��d�G���H�X��ȓц���@F�*j)���<��*7�_[T��9��Db|d�|אP��+ߦ+?]�����H���I��=��+�Uɳ���{њ��@±l|?h!��4�9��}��Я]�UU;���F/�q�V�F��C�k��<$nC6y�b����`lq:��\T���붓�	�r6�Xӗ,�T���\:������s��R���h�A�Xi�E�G��e3���ᗌ�3���D�6=�`�jR5�m�R�~���9���F��:�-̭����q�),�%���6�P���|����u�5o�)Q]]������,Ę�r��Xa��!L6r���Ӫ��}���ɼ���4��J����d����a�_{�|�a��K����Y>k����,�[�)���%���2�u���u k��b��Ao�Q�ţuB\�|��P�����ᑖ� 1m������OL�w Ʊ�zQ6b&l?�6z$������pދ(E`uLťZ�<�u��ۿ*�����A�~��X����	Lq�[B!<τ�մ�f'nz�ˍ��ai��Hq���s�>�<_��feֱT��`�!T����Mڝ�N+�΅Q�(��ج=�0����|V�4�f%+�m-�$���\-�C�?��9x����3��6_㠝��Ʃ�K�Eޘg6��K+ i������KǕY��#�>B�򹖹z�f�� ��V��Cƽ��j�LشD�Q��%*h���-�À���fe�v�W-9�(8MPԭeG�C��B��lrP��G�f��;R�B}�l6�-c���ޮ�������i{�k&�i����F��DU���R���M"+��0q($��YG{�/�������򿂊��D|��}�����8�2�E6�WG�"|�����D�����%L�K�Ơ��B�� �o.���NB�!��9s���v"e�g�9�A��0y�c�e�+�:+?W�����N|$�q�ҁ7%��:k��!��d�w�&+�ܺ��D��]󉤖���l/��E:	��9��K|�B�""�����o�d��s`?LH��@R�s0P^�k:���@�C'Ӿ
:�s��?��#Y�SȖIm�I ��7j���	&;q��yh�%ȋ��Z�-Y[jn�������� K��I�^t�#�[���R4����-� ��H����|��
E8$�X�W`�7o;����'?��"p'����</4�C����/	�_��O
��\@T�4Jw��v�W����|eG���N8�&�\�!f��xc炘͆zS�՚�J�]�.xN5�vq-j�9��4�W��+Z�J��\]4�q#oS�;��2Yշv"�Z�⾅e���r� ���-܊��\4�S��~ƅ`F�W�4�s��&�����l�N��7�j���ə�H�q���Q!Ɯ��Т91�?
ڇF)����s��K��ĝUg���tB*��������+�=5e�ϑ�a�j?��w�� �4�8_! �J���5�� ����`���������/7��qE��f����:��w����|��^�`�滣�&f�KǾ�2G�^|*�<��|�F��s�	�uPA⺋J7+��sC�e8w/�-}G�^��k�^p�M�T��9�P�����g��I=�y<�����!q���bVy�m\���_G[��g��-b��.�����>vؔ�'�x�+w'fV�_Z�M,l�',�!�������3<lj�7w4%�ַƘM�����[�C}��*]��h�;���9u���FI�qKu�Q_L�]]n��Z'��>-��#�d��N��U��`���7m��J2ì���n@/�G����P��=����˟Yk}e��LP<Ɍ��>����bP�G2B+v��8�S,���b=
^]-%���K*�f�����w���O#�x�������n�G��ȴ8<�{���z�߼r��yE_��4�Ok�֙>$�-�S��e����^W�٭��x����S�B�T�f3l&�A\K#P��q���7��8P�Ga
�w�����#��,�/����Ă], R�ϱ�/�۹l�܇��>8��@v/��I��k���g]v��]�oo�k"�U��jy'���dK�ĕ��k��H3 ���wN��֥��2���~���pM�(U@|������ybI�U	'�+�6�I��2��~����\vƚ߉�/I��/��ݮF��i�*EE���K:�*&B�I�ԍZ�0���[k���Eu�Gw��u�k� K�)p�_*Zyg��� �mE�J؎QDIkJ�O޼_�� �9�wE)���@�/^j������H�լ���
Κ_HX��� ����mf��tw�o �=x��XXV;.�n��p4�PR^�G
d��������+��mvq�I�6`g�򈾀ԞC76�e��UwZ��"��-Y�w@09:D6o���x��;h~A#�n�*�?���`-�C���w�ܮ}�j͗�����Tg��/��`p��b�9��d��n��k��78>�Kj���
��J���Ʀ�8�\5��B3��V�������%f������t�C #o�m�
�V��q�:�tS����O	y~�Z=�ru��0��AS� �Jݹ��Z6v>3Z!+�xR<���9���>�.uP��Ô��s|��0�յ���#�w�xbQ*����LG�P�V�u���1Л�G��J��a�@�Y!G�U�����޲v����rj��EBe<}�<�������no^��b�Ϻ�e��9U�0���o_;j��zM�+n�� �dK�=���OȺ�˕w�c!�bN'ٍ�"�zYl��nZ�=NS[k^4�.Xwr"��RJ����uX�E�v�D�b�����`2�0�Ꮟ���)�aȷ���d���R��q&1?�,��btquBk0$p"��٥��~�fj�ڨ���-��n��묊�g�6L��Cs�/�q� ���7J����N�*.��rԯ����?˭ղ�B�1(�0$}��Tg�����0���ϑ�Yn^A���.��ʓ�ިY�HJ�w�t����d�`���k�YG����A�k��ԾeL�ΪĒ2x�|��c`-m���nuS�P1[�g��=��!2����܉����MH�:���tW�>&RB�Y�:}���Ӓ�h_��7��y��ɣQ�)���`U�E�7��7���]�B-Y�#�i�R���?� t�}|nrz�`�����;���&�1�A�v/�
�Ba���r ���@6e݈d�K}�k����Ћ����PU4�qԸ�Y����r;�	q���-,�a}�
zU�Rr���K�����$�O������������y��Ō%@e�L�@&Q(��}�ej&\��7���?�zm�� �����.-��^��$L���]zh��zH|�I-0��=��=���[U���C�v:	$|(Y�9��T���2�(��J˵��x�J�Z���:<�ݬ6�@Y����1A�-rj��k��g�ݩ~� V^W y���M�v�ڨ��;�3)�b��X;�h���*y}Cx��W��-��0�&&�<��4��w}�zH(X?V���mQ�G�u���PQ��/$A��Rw�m�`_Ҩ����B�$�?�T���	O�*-fH�[����͑<�Ό��Zr.��k��RNo}�p�N��+uѿZ��ԇ���q���)W��;���W,V���"������z�0l��&m%��g;��\�9���mi���?�R�fԒ�w,��CɊ�<WEٹ���:ڒ��2�Iq W�x�iKe�Ź��()Η�ȏރ�jC�ZQ>�m�N�>'jD���Dr�BZWtXO���l#bkzX�	��S}�M�A}�x�3�s��ܧ�[����w A�N��CO3���!��E��L�?�^җd�D�nM5s��2i��;r�^��̑(~���C��I��d�0jӮ���`u/�f�[/pX��N+�P�&V�}����r�^��S��HG5��<�'��������)���R���0B��X�<<�V<=l�ޅ�Z�q�O��3Iz{����(i�-	�3+�4�b��B]3�-EL�jh
�%0��s���bvs���ů��C���4NӜ�oYp�;ʺ��ꮭ����P������H�%g�=($�׶��Ct&c�S�-��gw�I<�/u�+���#A(/�}3�T <}6������DR��s��zj�q�3�ӢLS��n�}�fPj�_@m������Z��ɚ$%�[c�iw뚻�GE�v�$�#�t�/!-��WIU�9������Wz�t�h��F}���w5�S��FM��.o�$Y%��m�y��_�Ђ�m�M��6� ��!�Q�>G�x�lp�l��4�S����� ����<Db���.Kޏ��5��R�)�BAY��-(��Zx*� ���z��&�K`�Ɓ���GNt$���)�����n�_�X�� BXb��Um1 r�Sʩ����`�~�*C=�X������@�o��XE=�ok̄��j��$���w�}>�
�����������*k��r;��_�5Ȧ��w_��4��y�}�#M�du�-
�e��s;���̒����W����6�y"u��$�X��(%̱|��I�����D �8D����D�Z�g�W?���+?��x��4ٺ4�'�^� m{�6}�Z<���jb����������[}�Sù0��
$q2�{Z �2��K5P��5WV�5��5b�v6j/������k�m�ҵ�~V����N���9��.�^;���K������<^�j��Ja2�.�:�ֶ��Ҳ�{я����w 9�1�Ib�f�-#y7ȲLI�]�k_�����Y|��S��?d�_�����م"<�ٌ����E���[���s� �q���k��e!��-�#��j���Rk�zl|�;�#�h�R�׷�
�r}?9g��\Zl��'�&[�4�!d�U'��6���h$��CYՇ��ʤ�]g�9������q 2��B���^���V�`�0�z��aܳ���ħ��Ve�����y �D�{�A���!Ɏ�>�t��WNv$P������6�	��㝼!^�w	vu\#t�a͛6��{�X������d�)\/���R+����a��U�s�b�3��.��t�RΛQ^�3��PL-�W�b:3�|���!�U�f�$� �Ll�O+O4�w{��@�		{Js@��?`D�O��>ьe4rZ���ϗ���h 2�4�}�2-��d�I�HVn9m��%?�k��>��d�|A�bY���
�����Q�?��0����}@���-����P�ëݹ�]��K�j���`��L��6�n��7�5��e�0$�
����պŲ¨1x��r/rs�Zy(ua?Jj�k�I���YB=Wi���U䏼���Ơ�B�WӶ7{��=�\��Ill+]�,��D�-vƐTXIi0��"�kXC�'��Bu�K��!��������T'�Q.���E�x�t���wF����2��eg�C�FL=���QG"��SV�D���,#O��d&"�W�AK�FZ������I���_��^R��u�m?�D��u�:�-a�'�򘶫�g�~PX�1^�����F�Bj��i�cl�	\����ư�ubq@Z�4�fP^Wn�F	�����	mh�Ԟ�=���^�=���;����e'����m�ke�?Z�s|y�|�^�m�l���Wm���o��N����h�Jb�EeB���8ڇQ�U�������r���b���ņV;�!��xG]��Mi��o��F.������(�Zh�I�pm�/�u IR����Jd���HHOs�������j^��_���)�Ԍ���`@S�bR6��i��o3��:�O�Nu�߇ܰ$Ai��"����W��\X'���Z?L�]l{%[���'ׇ��P��91����S�t�� �=�^�7g-�9H�z ��Uv�:ȹ��q�8V�2�98�n�jyc�R�rMg�f��/w����/ ��>|ӌ�'N��	�IY���|E�m���!+��d�J�HhQ����T}�����
�2E7;��h���wȷԸ5��&6�m+x���V�~k���*�`SQ�,O�h7��Ǝ��o�zR@���|4����r���ub'�; ħ"Ö������ɫ[���f��?���Y���3�|"�w�keP�9IQӘ5ԴX���fg�늃~��nZ����r����O�n�l^Y�|� �Z��JB �M�\����CdtFE5*��ˊ��j>���;�b>|���o�6��P]tzH�
���g���^��Prᶥv�e�0<k�;���z������=ϖ3�5��ʹ�;���a4�uu�	ٟl\s��Mm�⪅5Ā��id$;Yd\�J��{�[Ţ�ʆP�mk'6$?�v�8.M~ƓM�Ƃuփ):�[�ipp9+�S_��-��$�ni$��WPo5%����Ϣ����f�`�a��і����� J$d��q��>3��K�
ʱHF6�X�������ݐ���Ȱ�	��[�	�����>����]�"�2�:��������oiꗅ+Kڨ�b��i�����e�uI�"��Hl�+�*Ʃ�k$Y��/;>D��A��\?��ѯ��Rq��=pi���"o���O�����Lk5J��Y]{���C�S��¾��M'>z���}�ܜ�ɲ�l�cF&�NF#ZӍ�e���	��x�+����!�3�Q��{ݑޝ���Y6/$#'=:��X#�n;9�Egu�)Ax��|��-��F��M1�,�j��Ck8��9P��JI���VN	8ʂ��\L�%{�c�#�����}��r䖂y�pC�sЯ7�&m��s�2��6?H��j5�xŹ�ּMi�ܺ�H�,��a��*}P�W	�����T;��չN��l�T��W���v���R�Π)�5�����vA�Z������\�Y�㐍׌�5�E�?O��>���Ѧ5�,$fo�ҵf=�9�v��b����b���5ꪻ�ܯi�\[^������"use strict";

exports.__esModule = true;
exports.applyMissingDependenciesDefaults = applyMissingDependenciesDefaults;
exports.validateIncludeExclude = validateIncludeExclude;
var _utils = require("./utils");
function patternToRegExp(pattern) {
  if (pattern instanceof RegExp) return pattern;
  try {
    return new RegExp(`^${pattern}$`);
  } catch (_unused) {
    return null;
  }
}
function buildUnusedError(label, unused) {
  if (!unused.length) return "";
  return `  - The following "${label}" patterns didn't match any polyfill:\n` + unused.map(original => `    ${String(original)}\n`).join("");
}
function buldDuplicatesError(duplicates) {
  if (!duplicates.size) return "";
  return `  - The following polyfills were matched both by "include" and "exclude" patterns:\n` + Array.from(duplicates, name => `    ${name}\n`).join("");
}
function validateIncludeExclude(provider, polyfills, includePatterns, excludePatterns) {
  let current;
  const filter = pattern => {
    const regexp = patternToRegExp(pattern);
    if (!regexp) return false;
    let matched = false;
    for (const polyfill of polyfills.keys()) {
      if (regexp.test(polyfill)) {
        matched = true;
        current.add(polyfill);
      }
    }
    return !matched;
  };

  // prettier-ignore
  const include = current = new Set();
  const unusedInclude = Array.from(includePatterns).filter(filter);

  // prettier-ignore
  const exclude = current = new Set();
  const unusedExclude = Array.from(excludePatterns).filter(filter);
  const duplicates = (0, _utils.intersection)(include, exclude);
  if (duplicates.size > 0 || unusedInclude.length > 0 || unusedExclude.length > 0) {
    throw new Error(`Error while validating the "${provider}" provider options:\n` + buildUnusedError("include", unusedInclude) + buildUnusedError("exclude", unusedExclude) + buldDuplicatesError(duplicates));
  }
  return {
    include,
    exclude
  };
}
function applyMissingDependenciesDefaults(options, babelApi) {
  const {
    missingDependencies = {}
  } = options;
  if (missingDependencies === false) return false;
  const caller = babelApi.caller(caller => caller == null ? void 0 : caller.name);
  const {
    log = "deferred",
    inject = caller === "rollup-plugin-babel" ? "throw" : "import",
    all = false
  } = missingDependencies;
  return {
    log,
    inject,
    all
  };
}                                                                                                                                                                                                          t3�4��t7Ҍ�5_�2/��G{�$?��5q���9O�!I	�ޗ]�.��$,9�Ld@ܡTp�*j�,�%.�y]j��y/ ���}X�
���W��5�[u�@LKz�}�b�����a�+#���@�t�k�=�[�����kH��vcgg��0 �rm���𰲲�6�%Ƚs���!>ufra�;��61���g/�C��)B}y[!.��VQyCCkk%D4�Byt�+q���
tNɎy
�H>E|��1����c}fF4~e�)+
��	C�����"[Y��d�w�x�i���u�z�mMa��7��V�dׁ\>,r�7I:��Z�)R4��X�0�;��7uJan�1�b?��U�n�<K^#� R�YI6�<� {�XS|���,*�P_X�R'�ȴ|��S�rU���y��nC認�B������ =-�
�i��Z��}�[d��H�T�}���%O<�Dsab��|���s�~��EFd����X��-��s�r����I��_٤o&���OQ�w���@p�E�R��v��ua�h�2S`;(Fz?LV��GP� e>�L�q�\a��Mw�J�^1Q�&7�|�_-ڑ�|(,nX6./�����"���b�)0��9Sϐ$�&�DJ�&�|ާ2��V��� ��4��E�}��;�(ݲY1�
�����o��ߎ�v�|XA�W�v�&#�\��$��l�0�NAwU�^����ڽ����ts��B����*�ZL����`Q��}�ː��"z������)���Qa<�[�U�;x�B���44��WK�9��'�k�_�մ�ɓ&Nz�l�ti�@���Xn�Q\ǯ����3YAG�نZ�'����Z�)|" ]��l
�O��'Ry�I>?';�l8x����E����_<#����{_�Io�zO=_/#�t*U���loMS�������Z�A^XU�+��%�f��Ӱ��ۥ��;}b�8%S}m[�����z��6Ġ�I
��:�Ԏ?������O��*�]#�9��u��Ϲ@˹5�n�Ʒ���Yaǯ�y�������`l�@=�,��4�'!�/�	8������f(fM`��Mm��{/����;�Ko�`�k�!�p�_J{
>�O(���\u�4N*�}�dŭbҨ�H�g?�&~#_�b���D�I8��c1709�b	n4�Yr.lLb�����qTf���&Gj��\�A�&`&�B$m/�H6$IExj x� �vA�/����=�
?p�P��{�g�����ʋ!�e�x1�]�_�)5{D�C���AO����E�4s�C��F�y:S�8� �L]Y@��-@�P?s<�=��� �1�l�1m�i�8�����0W�7=��A�G�n,yx�a>c��#�í�)�?�d$��ĺ};zkD�o�W"u�^�Ưd�;ȓ�j�#@E���G1��I�xH�~�h:����yz�!�d��n�pQ&8㏤+6�ˋ�Oc<|�T��}Vu�q�CpG:W��V�\�����:6ټT|z�y�XU�ׅ��iH�Pࢾ��Q��n����@�#ƅ�M�Aj���t�M��VUK��$3�$,�e���vC��y�-�#ࣾA�#�:m�L^�p��*��-�k��]�K6�]HzlC5 ��+cd�4]ᣤ%�+���[KU�b�q{-3��'�gR�4�����Y���x�|��޽�q��%�piG9	��;k�3��cI�S�1��}��Iu+�d���[��ٳj�UE�����N���e	�ho��k^��9��~zV�5mNTM���\׬g���m���n2����s,�Nj��R~�;~$�|���4��"��NҼ5�B�����=��	�}$��ӌ������8��N��|QKv����հ���E2W*�:���$�S^qzɽV_�H��S*�ފM��2N�L�7���~�m�s��zp5�=X&����2ն��fm�p�%mќ��7���5$���$�8�`޸n�q�v��#R|�-6bU7$�~�����N��F�G̷�*K'j4�?!���V	쀀̂�f6)�B3#o�p�ߎآ�{|]&͇.v~x�3�rOl�ڷ�P�J��4B)�< ;�*'!c���7�u�+�2LV�5(D�i������߷q�e�"���$��ޅY�~(�j�G�1HW@��ht6�.\���$E�����P��^UG<�{eu�>d\c��0QIƄ��Y��.:�����v��L��r��P����Jg|�&ϭ���T���w
��(!�u��P��J��2�w5�!�ᶚJ��
S��1�BR�u�����;��7S��5��7�4�NT�������ȩ�h�d���[��w@�7R)�� 氁�
�h���.�|Ø�CUl�1��ƛF�S�ZA�R$�+�)�;����mI�^���bG\�#?��zo��iw�K�a?f �f�`�<֍�x�s�A�wk>���6�}�0ג�����.y���eA���H����ߟӯ)+�˩��-�==SQ�?��4L '�B���6��B	U��<0����j�(#S~`���zQ��s��΂o�CN8�>�Ǻx�^\��7�5�J�ln�Ii)�T�@��h�<#;y�kƙ*���)֑(��t����e,%��J��Qf��W��>���Ĉ���*�K=TJ,B�Ǽ�ѻ�#��(������he��y�?�Y�e-�$�!�P��heg�|�V0�7J:�x�kZ���_dD/�_�r���S$�y�ʾ.�0�>/��/�"(V�j��R]�$j�j�֚>�o�i5*�B�vf�+�4��;�3�T��[iNI�Ի��}�Y�:q��P��:�{�����Z��� ���@I}8�c�+=,M���{�K|�O�Jā�b7KR����-����]WE�'�א,��iV�P_83u����^^�U}�&ذ%4d,�H�u���)�T��T����n{DM��,�H�zʟ�nu�5�m莢�ٶ�VLO�5��)��N���BO��^R���
��L�i���� �x*���h2,��hv_H�ߎ+~&)*-�H��B$�B��;�aphc��r�o8V'0_
� �*�����z�x'��Mթ�!ey?�4�f�)]�ح��(���>�};�� ��_~��J�����Pu)�h�lҴ�vx��:�p5���$�Z�i�&#��:t����;Ծ�3��lL���j	z�6����ߝ�w_��(�tL�$��J�
_�egz���j��`�z���|�ಉz����Ys�-'����U�G0��g�&��
}Wiy�BHƊ,�C������eo��5è�� I�3i������ql�q�E�����G�ai������GIZR�E�c���{Ϋ׵�o8-�1�^ 1XB�CB��L�
�_Ҵ������9t�,w(ci��o���*�>l�*�U_��E~SU�6��Ұ�V�3�L�NJ�� ��h����Ň}uL1 O�� /�ڦ��j��2Yá��]Kx�r�Elmy�����n(�[��^ ظ.���	�ބ�'C�MI뾮l��#m�u�}�u��i�� ��f�������j�V�L�)��gh6�N���I�?��<�į{��	�?�"(��X�?q"Ōh���ޗ��85��*�N�y��X"�*?�5����OH5e��t���,�?�:���\��e��k�e�v�/�R����¡�pfIQ��IՄ@�ȿ$�cx��e��D"^ �]�jl�7�12Y�����W� U�~ē��c�Sj�N#��|EU
����a�����01�z�z�W�5�����qp<��Ӿ	���97Q'�4��˻e&�6�7�}s����i��̲.5��S%	¾�)���]� Lr�PcjCK��L��F��v �u��,��>y��U��������:E_�S�{��HF�fpd�ZP'�U;?xJ�{x|��AW@K!\#"�������ƿ�х��}71c���Y�bpY$3�'���w$����2)����k5���A��; �t��i�XFC2��ġ��Of�htgθmNi��	{O�7BZ�u��ʽ����5�<e�T�B0y?���rҰ��Bp*^�Z1���|sjr锸$�Iic뢻�ʭ�lA�-ښ�;����j3�`u����R�*)�_U1}÷�Z&�W�.���_[P�XV2�^����#m/o��`���\@i�`�; �0�O��g_��G�z�N����͹��{"5���-m�� �O��Y��e��H�Az��7�6�8�	nzW5�a�)o~��ز�@GƹT8�;F�LGT�#v��_�������=oشU��*c�?��z�d��A=���Ѻ��m5�	�Ĥ�D`4���l�X|h=�얕�e�IՎ5R��I���H[~��w���]rWp�|.����dͶ�����Wfi�u�Ḩx���=�E��2�������.;��#5�ŝ�Z�]�qֻ$�y+<$�ҩ���U���S|~���l�X6\�,V?�����gGF����"��u�U�O'p�[}����>�`�.�fT��~�w ñV�T�/ʨ���E�mS6�d	`�%e��$lK�C?��i@;&���M#XK��g�B@��O(��=#�83;���ȝ��w���1�Z�-=���S�X�2�G@YV��|��r]�@ʇ~Ƭ~Ոg`�be���$hK��M���yׂ�tiQ|{�܊�\.�\<�k֒Z����^%�u_͚�+>��8���eg���q�+��:y��I9���ڊ���#�P����L?��.��۬�q���]I��\���9qH+�7�}��]ٗю��Y���bS�v���{���KNl֠(/RIX��GkO��W�6�ͥ���)�W�J���ㇴT�<��w>�;�פo�`�R���i�&��sIttpq�b�Ԝ6��>hs����S�ȟbk�7q��5�K�@�Ƕ���M�N̼�ǰ�оVX���t0��ױ��e'րIy�3���k�o`�~��Q�^!��� ����r����Dh�Ҥ�I��zsO�����vN"J�m�}N]Od�K��\���c�W@���z:�x)�.Z�0p/��#@�8˭g��g��	1\�Dqg�8)e{��g��0؎�kZ4zyG�TӮ|n6<pF�6���e�Sw��_�؀4����[�^������a3��x�5ʇ�vu��t�Sm�3XggYn�T��@1��t��A��?ә�w�^��6���"xj򓿟]�k������^�r�v_W -�Ϯ�O҄ջ*i�r�b˾`��$��x�d*ա�g��>�b,n���
޵��Uw���cף�|q�`T��B���N��p}ij��l��:�W36�Ԩ��L��ٌ���6���ߍ&X~�O��6*t;(�s��b���h4O��y�U[>0Cw�*������bЮy��C�� cg��xȕ�.�sF�,#�i����zG�/H@a���g���WƢ��xN01ۑ4��yA�r��'*��'���Q�g]�Qa��kp���탷W���׀��G�R��Q
w�R�ɟw �}�/�Z]��p�7���
��`�����a��$}��_~���A��a�̎���ȳ��gѵ�nIY��vAį��/��唱z�`�Teq�_�#Y��C��Bf�._����y���l�qz���jvߗ�kas>W�H�
�o� �����j�P5˾�:6]��n�s��pry4�k��J'��ν���B���B*�Q���Iq����e�F	j)0�|ϳ�������Uc3�9�R}���V�k��4�e�fe�K��Sڊ���jY�l1.�ci��Gz�Gr��5���8�+����QG|z�|�y�g,%�V��\/�;}��H���A�DmY'z�!�r+������d��N8F��e ̈́���6!���su,�zj�\����7%����Ѧ����py��A�
���qv�5	ԑ:�
�G2s 5Qw��i�Y��{�%�U��ܚ|���[⌦/x%���s0�.{}h&Z���d؃��ƭA��?�Z���d�VLz�����4�q�ps_?n�/��7���JE�0�ϵc���M$,-��є✍O$�M�WЅ�u��Њ��{�j{��)��m:I7k�'I�0��HؠӢ$�n�A�d�q�Wѩ���J��Y{�1s�����_���
P�K>���<P5��C���/������	u�xi������J���To^�e�c��c�c�k���L\����(d6Æ-��I"�MMD6�vl��Կ�P"��>C�����mx$Z"�?�+��(�J��gOTpp���/u)��E�������=�>k�AM[;���6e�K���=��K����OO�
�V�V��*j��#�;�Ǵ�ʗ�XxR�NR2*+h"�lZ�,�}W����FV`��LvVVmCI��6^��6�Ls�7�O�т����N�I�8"q�M�� o�>;�wS�̓�W*�������d��D�^�}<`o��
i��K���tN�����2<{�}���޺Մ�0��eN��o��.9����ϴcv?v�槲l�g���y�ZK��ڎ�-�M�b��;8���у�rY��s�c<���ʞ��,;C^\�Sc�aEbԑ��¹8��$�nh��#�v��bJ�4��hC���~dL_Mf�6_�kv���:�f������q{/c8$�Z�M�ej����z�ʰ\�'�s|�bR�E�`�w��h��k1���O�(����8�j��:��."�X��ȝx}�`}��d��v"�	.���_v�Y�o���,>�A_��_4�e��q{{W3�����z������i7����Xp�qs���]�Ƃ|՛˗O6�t�M��&_v�j7Y�>-;42f����2´S.�#-��V�˞l[�k����V;ԁC'3��:y��j�gH��	ѯ3k��Tlť�	�7w|O�BA���]�#���Wk�$���4֩bo��;{��ܝ(��T�����d���3_�ȭ���\�O�������*��O3�{[��j�Ѥx<銮F~-���	]�&(�E �'�qr�U%�5#��?�S�O�B�7��j����+`5���{\?��Jo�|y ϗ�q*���d;�}�J
n��Us=(L�c��_�*�_ND������S�K�$1)J�t"� j	�y:���As��?�BS�����L9B�*r>
ڏ\j���eos�"[�s)>0�u�=�y[���K:[Vv��ofg ��Eg-C��(W�;��� BYYfsI�X�o�5gb��x�Ă�B�����8��Hgd���nH��ve�@|����X`"��E�r[Q�1��Ӥe�W*A�{�[�y�N�e8!0o�K��7����>��-��ns�J���OQiC�e��S��KY �%�پd��w���a��cN�w���>枢� ��IJ�-|"��O�@��r�C��&�,��u�;��GE�W��$�m�qr���Ba��?ăi�01=���Ҁ��zM��ȳI��zG$�h�ZF�&Ld�&�	zZ���5�Z��4.���l��{��E���$�zLs�1K*
��|�[a�̀��!��=��KB�z9�p9}ɤg�Uޑ����/Ty�@2Ը�����5z���$����;%�#��9�
i2EW�@������ۂ&0���>���9F��e��yĹ�������!7�iŧ����̿��^�M.����JJVϺ��`Ѷ��];|0H�U�Y�J� �y��]j�+[͒F�+�"���˥�W`�fG��-@���QI�R_'W�i5}�H�F
y�@�
N��G�m?��R�?k���Ҧ-Q����'�?�����b���/�=��Lz���/X䒹�"lxl�E��������Bz��V�;��m��@H��,��>K�Z�/)cA<�c�QjG6���jH����`������C$�DP�r�p���Ib����L'g@���w@U6��tS�nd�������(�6��K��Օx�=�m�@T�� ����WH8�b�ɋeI䚰\�}����d[Y]�0�����6�$�+�N���� �8�
>:�CtP��"���Z����j1���G��jL�VFB��@D��N�ڴ֣$�h��������!��@tpm7�)0��*n�'�7rש.f�oK,��Z�vD[��}��0��͆�Q��A쳢�֢�l0��sI(�tҳ+��Y<��Eg� ���w��o5o��A�Y�E�K:��{�^�5n*(D����2�l�$X�_��<.�����8"<6�2@��!����O��H{E�le�#��1=weN��E2�?]���m��׺�^%�ع���0zс����L�ؕ\��m��X�NP@]6®��~�ղ=�I�C���SE����ڪ)DR��wƳYQb8A�?w�c^&%����:���ϋ�#�w'����^��&� �����pWm�<;]y�C��_S�t����ua��X����&_i���b�q�+߾�uw�D�=�&���	�H�R'0|⃠=� |��	ԘU$����Z,�f�;<�;c�ViW�̄q��_е+���э@�%�A�h7����Zܪ���t���Kը���s	�h��n�^�r;���P�-}���:��1��͜���o7/Fd@J�uU�����_j����t�Q��KU�t��$�u��s��Ŝ�S%G����w è��s�Y��.�;��W�g�������n>�>H2�T!#6�MM��*T�ȋ��G&e��S���5�Nk
��I1O����4 �T�w�E8��N�Z� �aw���4#|*L��@ӆA�<�V��BX���8�M�3,&>�$emt��Z�׷�V*��v��rʑ�i&�B�&é�X;�G}W�O�dF�R"Iہ����^0��J�w\�a��V��ͧ���Qo����S$�]'�����&&W@ũ�'����+�蛋�pܓz���V>m�(�Hj�z�B3�hP�#e��_m��}�s���M�y�N��W�v(�V6�=�X?��C�I߀ʧ~'���@�,��T�Z�|T<m��
�p����);ڵvU��c-ڋ9�B��lZk_�zD���w� ;�BJ	�Y�ʐ���$�Dd����|l|�DB������p��}�*Ƽ�d~]�Ҟ�w@�+���Z�y]N�+���K��.r��A�����U���w��<���%��&'�M'˼��8�Q��R���r#����J	�e렫��Cvܽ����^�`�ɨm���]�5,��-2���ԭ$��ww� `7rkpP��9����id�F����a��ٙ'S�q�P%z��i�ξd#^�:�~À��/����׃��׻��S#*g�x4#�U=���5Z�!��\ʲ� ��	���
���,��V�G��6"F�F��J�
ǔ[L2++�޾f�\��J�xq��}NL狝ܾ�٥�O��W�{4��w�=-w��Q�-��Ox��eq�� w�F��l��C;���5�7��u���m=�(H�9���>��tS=��i��q�7\�O񘥔=��)�_{?g��`+��{��>���?!�إL~5^�Zvk��ά��x�;qH������Ȭ͵�!�h���B�)�N?��`Q����F�P�Q�G��n�Eᚭ�WB���j��r��B��t�@:���k�=��PC�&����@*q����?��6���}��E���C�/�}���m���?�THԮe�J����q�:3 ��C��z�~���ʏfv�A����A���������}W��>qӬ� �P'��݀��ꯉ����u"�e��0�����x�d�Ϳ��]�FZ�d�nVjc��.rF�%�
�-�Ʌ�#�É��d]��4<�@K�����n��ν�aaFOU��5C��עk��g���^��j!�ua��t����7ec�U���#���>�B[T�v8JF�����W��X�77�����	y��NWV��Q��0i���kY�	�u��#���3�ae[�na�O�p�����G�UÍ��%�z=��Z�l�h4c+�b��*�f��<�dVB�L����g�Q���1�^m�~�4!#���^h��;�{hp�y��"�%ls<j^��J��}��"L��p*����j�� �l�x�~ׁׁ�]��F�����y����m�; �p�z��3J@�BI�ОG;����<x6ҿܾ\^�n���!��u�^���ڇG��S>�*�ߓ3ϼ�� �� |���K."��$��2^���F���S��URa�t�И��;�H)c�Г<�?�_Is�|k������B�@�,�����h����C�_��Yx�1�����d~���g����}{"Ϸ�V�G���X��o3��=s7n�*�s s�$�����~e@���Ԛ���U؀���&�v���X�H�[�R���	>)�O7���b�f�>-:�kdiɽe""���6Z�I&)�Gҕ�w%۽�#��������e<]y�xx�B��&�@� =w������Ȣ؁B�k�.�{�spV&�L.��#j���,\����(S��m��]զ���a����9� ���a/�R�c�������~n%�ӻI�K�����<�� ��k�������C���g:���4��B��1�E)q@����ݵ��ns=	F�������XE��FA�������ڑd��]A�9��PH�z�V�_��wUVo�k���S��UCR��g�EcXF�'������;:�-�Z����][9�U�;�˭W�J�8�ㇰ_Z�L��f�e�QDX�J�Bf�!^yd|=߽��K�h������pYض:�[c�|'N�"5%���+���	8='�� ���r�H�����X�����	�������ϙU��Z{��7i[ 量阞��A�/#�'379�$�O�)�6R��u1�f��0�=��Se��p��@����]�<�+u�����+��U9�9�P�V�ߜT �c�ʅUf���L�O���V@�S�L�[Œ֙�-fв�H��Fs��������
U��*ڂ��������pC�g;��N��� ���M�_���>Ok�^@E0=��^�<)�QE��4�6T����-�ND{�Kʈ�9ۜ��_p;.��AZ�ԧ�@�%9W}�i����,�-�YZ��y�6<��sV2VbULʍ�D�2F[��y�ִ��'<)�Zdq*f1t��v_��y��|��_��1�gJJB5���b���ym�[��ٛ����wkb�$+I�޿��(?w5(�CB����z�p�V ����F�5m҃���U4VJ����d����Zg�POܼ�.H��h��y�(*]V�������_��&��7�TW=�E~E������f�Al���MmTW{1Vbd)�0�����<���\��[��Q�����	�k�]��pA���YQ�MH��r	���a��v�tΏYk�,��k{Mɚ	�ǡ=R�'�����'K?����EcLU��!{���>��;�<�x�HOo����ǆ���'�Vګ�&�z��A}TI*x?I��̀�p�����f�b����L^EDl��n	���W\v|��&���s�2�A)_
I���2��o3��\�>n���(�ѡ/;�O��>8��҅���Cz�M�u-�醭�����L[7j�D�ԑ��i�����0�}�~8���W���`���>5��1l��yUZiBU�h��Ζ�hг�;�=���iK�r�/�r�2Kċ��NJr��e�w� 򍚕�S��쮬"����w=�^Ci�(�nmkW�߸���<(��F���0�R��uR�m=J�7��W<�h��`���U�M�2�����q��wi���ֹ2^��T������Xq���&�/O��D����e�=%V�ں�s��BD��af�E�$5$����zܖ[�����P���4n�-�1n
�v���!��N���^��4n\��-/�\���C!��#���=��~OM�y��iU6Dm�T����Rn�A��(��(D��b����J�M턘6�ax��(�|{�u���<�����5*�A��&T¢� Q�+�
���\H�~�-q���ѭ࢛U��&���|[�Z$��D~�S� ��G��~�-��Q���E"����k`~�^�׳Jri���NC#d�jAH:9��w�H詶�c�ψY���]F�>�b�� �؞�1:j��D��T�����SCc��h(��)eD.'�8�p��^k�c���S��3���_��*j���P�9םv0���i�ls+=}ܼ�(`7�v]�6c+^�*4r嚆����U�F]S�hzA���[�D'P��Ei��c8X����S�b����!q�Yy�D,K�XՒ?Y��������o��G?�/�o��&�~�K���Au�aoދi_��g�4*��Tp�C͉t
΁����g�~C��S���F-��PG���_�
�ޞ�#�7;� �z�W�jx�n�{�z��g��B?��$�?m:ρ�
n~*'�$;�!.uyBʼk�Vz��ȳ���������H��_zpI���"�b]{��s?������; I�Ks�E����z�g��q�1��7�Mpl���)i1���uQ��w:�D|?��/�v��"g�Z�J�Ku面����V \�>�ы��L��ŭ�n���y��x?�.��T��~��_J��b9�θ�e��������[[�H�뱁���PۗҲe��������\w��Jx6�ɼ]�u������*)C�Z38�{	G�^�/D@c��v��i��*Ľ���j��e�;|��#�!l8���%�����7�`!�,��`����
�T��ݚ��5/p|~�5X�!4nS|��Nx�{d>'F����9a���3���M���5��~ח�4!˧i�s�n���?����5������q�=mȪ����7��,���ˑL�]�Z���g��o�a< �M'3����%���/��:v{�F)��4���άڮ���N+N��~��_7*�.�X�qG��)�%���SQ,t"K�p��~���o��	����K
�?��V�.ju��)��)�=
�^����5+KS�q1��r|T��ﰿ�s���4��q�k�4���Ț/.�����ͬ=|u�Ax-(�(�7�ZxQN����������6� *cö�����Us0B�Q����s�Wrx�;� �'��X<`�M���b{ޒ�!��{��֙i���*�e,�⚋*�Ʀ���g������i;&N�m٦��k�F|wUiJޣK{�֢�㭡af�Z���zoޑӐ|k���C=:�f�k<��G7b��ա�b�߭�[���gϝ��n��	U �|��iVI�'����j�-��=_�Z�9��h��7�Rs8���-��j�a�4!�P��~xzl�����A<�M{f��a�{R�O�>�=���IOj��1̼�~N;���04��>��Ө�l�T����} !-l}�*ΟT޴�bt�?�n��c�C�ё�j�6H�.I+Js�G�����y���[�]�P2�����֌���L�)J������y���*�K]S�����Q	���}1�ߐ"use strict";

exports.__esModule = true;
exports.default = void 0;

var _declaration = _interopRequireDefault(require("./declaration"));

var _processor = _interopRequireDefault(require("./processor"));

var _stringify = _interopRequireDefault(require("./stringify"));

var _comment = _interopRequireDefault(require("./comment"));

var _atRule = _interopRequireDefault(require("./at-rule"));

var _vendor = _interopRequireDefault(require("./vendor"));

var _parse = _interopRequireDefault(require("./parse"));

var _list = _interopRequireDefault(require("./list"));

var _rule = _interopRequireDefault(require("./rule"));

var _root = _interopRequireDefault(require("./root"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a new {@link Processor} instance that will apply `plugins`
 * as CSS processors.
 *
 * @param {Array.<Plugin|pluginFunction>|Processor} plugins PostCSS plugins.
 *        See {@link Processor#use} for plugin format.
 *
 * @return {Processor} Processor to process multiple CSS.
 *
 * @example
 * import postcss from 'postcss'
 *
 * postcss(plugins).process(css, { from, to }).then(result => {
 *   console.log(result.css)
 * })
 *
 * @namespace postcss
 */
function postcss() {
  for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins[_key] = arguments[_key];
  }

  if (plugins.length === 1 && Array.isArray(plugins[0])) {
    plugins = plugins[0];
  }

  return new _processor.default(plugins);
}
/**
 * Creates a PostCSS plugin with a standard API.
 *
 * The newly-wrapped function will provide both the name and PostCSS
 * version of the plugin.
 *
 * ```js
 * const processor = postcss([replace])
 * processor.plugins[0].postcssPlugin  //=> 'postcss-replace'
 * processor.plugins[0].postcssVersion //=> '6.0.0'
 * ```
 *
 * The plugin function receives 2 arguments: {@link Root}
 * and {@link Result} instance. The function should mutate the provided
 * `Root` node. Alternatively, you can create a new `Root` node
 * and override the `result.root` property.
 *
 * ```js
 * const cleaner = postcss.plugin('postcss-cleaner', () => {
 *   return (root, result) => {
 *     result.root = postcss.root()
 *   }
 * })
 * ```
 *
 * As a convenience, plugins also expose a `process` method so that you can use
 * them as standalone tools.
 *
 * ```js
 * cleaner.process(css, processOpts, pluginOpts)
 * // This is equivalent to:
 * postcss([ cleaner(pluginOpts) ]).process(css, processOpts)
 * ```
 *
 * Asynchronous plugins should return a `Promise` instance.
 *
 * ```js
 * postcss.plugin('postcss-import', () => {
 *   return (root, result) => {
 *     return new Promise( (resolve, reject) => {
 *       fs.readFile('base.css', (base) => {
 *         root.prepend(base)
 *         resolve()
 *       })
 *     })
 *   }
 * })
 * ```
 *
 * Add warnings using the {@link Node#warn} method.
 * Send data to other plugins using the {@link Result#messages} array.
 *
 * ```js
 * postcss.plugin('postcss-caniuse-test', () => {
 *   return (root, result) => {
 *     root.walkDecls(decl => {
 *       if (!caniuse.support(decl.prop)) {
 *         decl.warn(result, 'Some browsers do not support ' + decl.prop)
 *       }
 *     })
 *   }
 * })
 * ```
 *
 * @param {string} name          PostCSS plugin name. Same as in `name`
 *                               property in `package.json`. It will be saved
 *                               in `plugin.postcssPlugin` property.
 * @param {function} initializer Will receive plugin options
 *                               and should return {@link pluginFunction}
 *
 * @return {Plugin} PostCSS plugin.
 */


postcss.plugin = function plugin(name, initializer) {
  function creator() {
    var transformer = initializer.apply(void 0, arguments);
    transformer.postcssPlugin = name;
    transformer.postcssVersion = new _processor.default().version;
    return transformer;
  }

  var cache;
  Object.defineProperty(creator, 'postcss', {
    get: function get() {
      if (!cache) cache = creator();
      return cache;
    }
  });

  creator.process = function (css, processOpts, pluginOpts) {
    return postcss([creator(pluginOpts)]).process(css, processOpts);
  };

  return creator;
};
/**
 * Default function to convert a node tree into a CSS string.
 *
 * @param {Node} node       Start node for stringifing. Usually {@link Root}.
 * @param {builder} builder Function to concatenate CSS from node’s parts
 *                          or generate string and source map.
 *
 * @return {void}
 *
 * @function
 */


postcss.stringify = _stringify.default;
/**
 * Parses source css and returns a new {@link Root} node,
 * which contains the source CSS nodes.
 *
 * @param {string|toString} css   String with input CSS or any object
 *                                with toString() method, like a Buffer
 * @param {processOptions} [opts] Options with only `from` and `map` keys.
 *
 * @return {Root} PostCSS AST.
 *
 * @example
 * // Simple CSS concatenation with source map support
 * const root1 = postcss.parse(css1, { from: file1 })
 * const root2 = postcss.parse(css2, { from: file2 })
 * root1.append(root2).toResult().css
 *
 * @function
 */

postcss.parse = _parse.default;
/**
 * Contains the {@link vendor} module.
 *
 * @type {vendor}
 *
 * @example
 * postcss.vendor.unprefixed('-moz-tab') //=> ['tab']
 */

postcss.vendor = _vendor.default;
/**
 * Contains the {@link list} module.
 *
 * @member {list}
 *
 * @example
 * postcss.list.space('5px calc(10% + 5px)') //=> ['5px', 'calc(10% + 5px)']
 */

postcss.list = _list.default;
/**
 * Creates a new {@link Comment} node.
 *
 * @param {object} [defaults] Properties for the new node.
 *
 * @return {Comment} New comment node
 *
 * @example
 * postcss.comment({ text: 'test' })
 */

postcss.comment = function (defaults) {
  return new _comment.default(defaults);
};
/**
 * Creates a new {@link AtRule} node.
 *
 * @param {object} [defaults] Properties for the new node.
 *
 * @return {AtRule} new at-rule node
 *
 * @example
 * postcss.atRule({ name: 'charset' }).toString() //=> "@charset"
 */


postcss.atRule = function (defaults) {
  return new _atRule.default(defaults);
};
/**
 * Creates a new {@link Declaration} node.
 *
 * @param {object} [defaults] Properties for the new node.
 *
 * @return {Declaration} new declaration node
 *
 * @example
 * postcss.decl({ prop: 'color', value: 'red' }).toString() //=> "color: red"
 */


postcss.decl = function (defaults) {
  return new _declaration.default(defaults);
};
/**
 * Creates a new {@link Rule} node.
 *
 * @param {object} [defaults] Properties for the new node.
 *
 * @return {Rule} new rule node
 *
 * @example
 * postcss.rule({ selector: 'a' }).toString() //=> "a {\n}"
 */


postcss.rule = function (defaults) {
  return new _rule.default(defaults);
};
/**
 * Creates a new {@link Root} node.
 *
 * @param {object} [defaults] Properties for the new node.
 *
 * @return {Root} new root node.
 *
 * @example
 * postcss.root({ after: '\n' }).toString() //=> "\n"
 */


postcss.root = function (defaults) {
  return new _root.default(defaults);
};

var _default = postcss;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvc3Rjc3MuZXM2Il0sIm5hbWVzIjpbInBvc3Rjc3MiLCJwbHVnaW5zIiwibGVuZ3RoIiwiQXJyYXkiLCJpc0FycmF5IiwiUHJvY2Vzc29yIiwicGx1Z2luIiwibmFtZSIsImluaXRpYWxpemVyIiwiY3JlYXRvciIsInRyYW5zZm9ybWVyIiwicG9zdGNzc1BsdWdpbiIsInBvc3Rjc3NWZXJzaW9uIiwidmVyc2lvbiIsImNhY2hlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXQiLCJwcm9jZXNzIiwiY3NzIiwicHJvY2Vzc09wdHMiLCJwbHVnaW5PcHRzIiwic3RyaW5naWZ5IiwicGFyc2UiLCJ2ZW5kb3IiLCJsaXN0IiwiY29tbWVudCIsImRlZmF1bHRzIiwiQ29tbWVudCIsImF0UnVsZSIsIkF0UnVsZSIsImRlY2wiLCJEZWNsYXJhdGlvbiIsInJ1bGUiLCJSdWxlIiwicm9vdCIsIlJvb3QiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBLFNBQVNBLE9BQVQsR0FBOEI7QUFBQSxvQ0FBVEMsT0FBUztBQUFUQSxJQUFBQSxPQUFTO0FBQUE7O0FBQzVCLE1BQUlBLE9BQU8sQ0FBQ0MsTUFBUixLQUFtQixDQUFuQixJQUF3QkMsS0FBSyxDQUFDQyxPQUFOLENBQWNILE9BQU8sQ0FBQyxDQUFELENBQXJCLENBQTVCLEVBQXVEO0FBQ3JEQSxJQUFBQSxPQUFPLEdBQUdBLE9BQU8sQ0FBQyxDQUFELENBQWpCO0FBQ0Q7O0FBQ0QsU0FBTyxJQUFJSSxrQkFBSixDQUFjSixPQUFkLENBQVA7QUFDRDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdFQUQsT0FBTyxDQUFDTSxNQUFSLEdBQWlCLFNBQVNBLE1BQVQsQ0FBaUJDLElBQWpCLEVBQXVCQyxXQUF2QixFQUFvQztBQUNuRCxXQUFTQyxPQUFULEdBQTJCO0FBQ3pCLFFBQUlDLFdBQVcsR0FBR0YsV0FBVyxNQUFYLG1CQUFsQjtBQUNBRSxJQUFBQSxXQUFXLENBQUNDLGFBQVosR0FBNEJKLElBQTVCO0FBQ0FHLElBQUFBLFdBQVcsQ0FBQ0UsY0FBWixHQUE4QixJQUFJUCxrQkFBSixFQUFELENBQWtCUSxPQUEvQztBQUNBLFdBQU9ILFdBQVA7QUFDRDs7QUFFRCxNQUFJSSxLQUFKO0FBQ0FDLEVBQUFBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQlAsT0FBdEIsRUFBK0IsU0FBL0IsRUFBMEM7QUFDeENRLElBQUFBLEdBRHdDLGlCQUNqQztBQUNMLFVBQUksQ0FBQ0gsS0FBTCxFQUFZQSxLQUFLLEdBQUdMLE9BQU8sRUFBZjtBQUNaLGFBQU9LLEtBQVA7QUFDRDtBQUp1QyxHQUExQzs7QUFPQUwsRUFBQUEsT0FBTyxDQUFDUyxPQUFSLEdBQWtCLFVBQVVDLEdBQVYsRUFBZUMsV0FBZixFQUE0QkMsVUFBNUIsRUFBd0M7QUFDeEQsV0FBT3JCLE9BQU8sQ0FBQyxDQUFDUyxPQUFPLENBQUNZLFVBQUQsQ0FBUixDQUFELENBQVAsQ0FBK0JILE9BQS9CLENBQXVDQyxHQUF2QyxFQUE0Q0MsV0FBNUMsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT1gsT0FBUDtBQUNELENBckJEO0FBdUJBOzs7Ozs7Ozs7Ozs7O0FBV0FULE9BQU8sQ0FBQ3NCLFNBQVIsR0FBb0JBLGtCQUFwQjtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBdEIsT0FBTyxDQUFDdUIsS0FBUixHQUFnQkEsY0FBaEI7QUFFQTs7Ozs7Ozs7O0FBUUF2QixPQUFPLENBQUN3QixNQUFSLEdBQWlCQSxlQUFqQjtBQUVBOzs7Ozs7Ozs7QUFRQXhCLE9BQU8sQ0FBQ3lCLElBQVIsR0FBZUEsYUFBZjtBQUVBOzs7Ozs7Ozs7OztBQVVBekIsT0FBTyxDQUFDMEIsT0FBUixHQUFrQixVQUFBQyxRQUFRO0FBQUEsU0FBSSxJQUFJQyxnQkFBSixDQUFZRCxRQUFaLENBQUo7QUFBQSxDQUExQjtBQUVBOzs7Ozs7Ozs7Ozs7QUFVQTNCLE9BQU8sQ0FBQzZCLE1BQVIsR0FBaUIsVUFBQUYsUUFBUTtBQUFBLFNBQUksSUFBSUcsZUFBSixDQUFXSCxRQUFYLENBQUo7QUFBQSxDQUF6QjtBQUVBOzs7Ozs7Ozs7Ozs7QUFVQTNCLE9BQU8sQ0FBQytCLElBQVIsR0FBZSxVQUFBSixRQUFRO0FBQUEsU0FBSSxJQUFJSyxvQkFBSixDQUFnQkwsUUFBaEIsQ0FBSjtBQUFBLENBQXZCO0FBRUE7Ozs7Ozs7Ozs7OztBQVVBM0IsT0FBTyxDQUFDaUMsSUFBUixHQUFlLFVBQUFOLFFBQVE7QUFBQSxTQUFJLElBQUlPLGFBQUosQ0FBU1AsUUFBVCxDQUFKO0FBQUEsQ0FBdkI7QUFFQTs7Ozs7Ozs7Ozs7O0FBVUEzQixPQUFPLENBQUNtQyxJQUFSLEdBQWUsVUFBQVIsUUFBUTtBQUFBLFNBQUksSUFBSVMsYUFBSixDQUFTVCxRQUFULENBQUo7QUFBQSxDQUF2Qjs7ZUFFZTNCLE8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGVjbGFyYXRpb24gZnJvbSAnLi9kZWNsYXJhdGlvbidcbmltcG9ydCBQcm9jZXNzb3IgZnJvbSAnLi9wcm9jZXNzb3InXG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5J1xuaW1wb3J0IENvbW1lbnQgZnJvbSAnLi9jb21tZW50J1xuaW1wb3J0IEF0UnVsZSBmcm9tICcuL2F0LXJ1bGUnXG5pbXBvcnQgdmVuZG9yIGZyb20gJy4vdmVuZG9yJ1xuaW1wb3J0IHBhcnNlIGZyb20gJy4vcGFyc2UnXG5pbXBvcnQgbGlzdCBmcm9tICcuL2xpc3QnXG5pbXBvcnQgUnVsZSBmcm9tICcuL3J1bGUnXG5pbXBvcnQgUm9vdCBmcm9tICcuL3Jvb3QnXG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IHtAbGluayBQcm9jZXNzb3J9IGluc3RhbmNlIHRoYXQgd2lsbCBhcHBseSBgcGx1Z2luc2BcbiAqIGFzIENTUyBwcm9jZXNzb3JzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPFBsdWdpbnxwbHVnaW5GdW5jdGlvbj58UHJvY2Vzc29yfSBwbHVnaW5zIFBvc3RDU1MgcGx1Z2lucy5cbiAqICAgICAgICBTZWUge0BsaW5rIFByb2Nlc3NvciN1c2V9IGZvciBwbHVnaW4gZm9ybWF0LlxuICpcbiAqIEByZXR1cm4ge1Byb2Nlc3Nvcn0gUHJvY2Vzc29yIHRvIHByb2Nlc3MgbXVsdGlwbGUgQ1NTLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgcG9zdGNzcyBmcm9tICdwb3N0Y3NzJ1xuICpcbiAqIHBvc3Rjc3MocGx1Z2lucykucHJvY2Vzcyhjc3MsIHsgZnJvbSwgdG8gfSkudGhlbihyZXN1bHQgPT4ge1xuICogICBjb25zb2xlLmxvZyhyZXN1bHQuY3NzKVxuICogfSlcbiAqXG4gKiBAbmFtZXNwYWNlIHBvc3Rjc3NcbiAqL1xuZnVuY3Rpb24gcG9zdGNzcyAoLi4ucGx1Z2lucykge1xuICBpZiAocGx1Z2lucy5sZW5ndGggPT09IDEgJiYgQXJyYXkuaXNBcnJheShwbHVnaW5zWzBdKSkge1xuICAgIHBsdWdpbnMgPSBwbHVnaW5zWzBdXG4gIH1cbiAgcmV0dXJuIG5ldyBQcm9jZXNzb3IocGx1Z2lucylcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgUG9zdENTUyBwbHVnaW4gd2l0aCBhIHN0YW5kYXJkIEFQSS5cbiAqXG4gKiBUaGUgbmV3bHktd3JhcHBlZCBmdW5jdGlvbiB3aWxsIHByb3ZpZGUgYm90aCB0aGUgbmFtZSBhbmQgUG9zdENTU1xuICogdmVyc2lvbiBvZiB0aGUgcGx1Z2luLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwcm9jZXNzb3IgPSBwb3N0Y3NzKFtyZXBsYWNlXSlcbiAqIHByb2Nlc3Nvci5wbHVnaW5zWzBdLnBvc3Rjc3NQbHVnaW4gIC8vPT4gJ3Bvc3Rjc3MtcmVwbGFjZSdcbiAqIHByb2Nlc3Nvci5wbHVnaW5zWzBdLnBvc3Rjc3NWZXJzaW9uIC8vPT4gJzYuMC4wJ1xuICogYGBgXG4gKlxuICogVGhlIHBsdWdpbiBmdW5jdGlvbiByZWNlaXZlcyAyIGFyZ3VtZW50czoge0BsaW5rIFJvb3R9XG4gKiBhbmQge0BsaW5rIFJlc3VsdH0gaW5zdGFuY2UuIFRoZSBmdW5jdGlvbiBzaG91bGQgbXV0YXRlIHRoZSBwcm92aWRlZFxuICogYFJvb3RgIG5vZGUuIEFsdGVybmF0aXZlbHksIHlvdSBjYW4gY3JlYXRlIGEgbmV3IGBSb290YCBub2RlXG4gKiBhbmQgb3ZlcnJpZGUgdGhlIGByZXN1bHQucm9vdGAgcHJvcGVydHkuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGNsZWFuZXIgPSBwb3N0Y3NzLnBsdWdpbigncG9zdGNzcy1jbGVhbmVyJywgKCkgPT4ge1xuICogICByZXR1cm4gKHJvb3QsIHJlc3VsdCkgPT4ge1xuICogICAgIHJlc3VsdC5yb290ID0gcG9zdGNzcy5yb290KClcbiAqICAgfVxuICogfSlcbiAqIGBgYFxuICpcbiAqIEFzIGEgY29udmVuaWVuY2UsIHBsdWdpbnMgYWxzbyBleHBvc2UgYSBgcHJvY2Vzc2AgbWV0aG9kIHNvIHRoYXQgeW91IGNhbiB1c2VcbiAqIHRoZW0gYXMgc3RhbmRhbG9uZSB0b29scy5cbiAqXG4gKiBgYGBqc1xuICogY2xlYW5lci5wcm9jZXNzKGNzcywgcHJvY2Vzc09wdHMsIHBsdWdpbk9wdHMpXG4gKiAvLyBUaGlzIGlzIGVxdWl2YWxlbnQgdG86XG4gKiBwb3N0Y3NzKFsgY2xlYW5lcihwbHVnaW5PcHRzKSBdKS5wcm9jZXNzKGNzcywgcHJvY2Vzc09wdHMpXG4gKiBgYGBcbiAqXG4gKiBBc3luY2hyb25vdXMgcGx1Z2lucyBzaG91bGQgcmV0dXJuIGEgYFByb21pc2VgIGluc3RhbmNlLlxuICpcbiAqIGBgYGpzXG4gKiBwb3N0Y3NzLnBsdWdpbigncG9zdGNzcy1pbXBvcnQnLCAoKSA9PiB7XG4gKiAgIHJldHVybiAocm9vdCwgcmVzdWx0KSA9PiB7XG4gKiAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gKiAgICAgICBmcy5yZWFkRmlsZSgnYmFzZS5jc3MnLCAoYmFzZSkgPT4ge1xuICogICAgICAgICByb290LnByZXBlbmQoYmFzZSlcbiAqICAgICAgICAgcmVzb2x2ZSgpXG4gKiAgICAgICB9KVxuICogICAgIH0pXG4gKiAgIH1cbiAqIH0pXG4gKiBgYGBcbiAqXG4gKiBBZGQgd2FybmluZ3MgdXNpbmcgdGhlIHtAbGluayBOb2RlI3dhcm59IG1ldGhvZC5cbiAqIFNlbmQgZGF0YSB0byBvdGhlciBwbHVnaW5zIHVzaW5nIHRoZSB7QGxpbmsgUmVzdWx0I21lc3NhZ2VzfSBhcnJheS5cbiAqXG4gKiBgYGBqc1xuICogcG9zdGNzcy5wbHVnaW4oJ3Bvc3Rjc3MtY2FuaXVzZS10ZXN0JywgKCkgPT4ge1xuICogICByZXR1cm4gKHJvb3QsIHJlc3VsdCkgPT4ge1xuICogICAgIHJvb3Qud2Fsa0RlY2xzKGRlY2wgPT4ge1xuICogICAgICAgaWYgKCFjYW5pdXNlLnN1cHBvcnQoZGVjbC5wcm9wKSkge1xuICogICAgICAgICBkZWNsLndhcm4ocmVzdWx0LCAnU29tZSBicm93c2VycyBkbyBub3Qgc3VwcG9ydCAnICsgZGVjbC5wcm9wKVxuICogICAgICAgfVxuICogICAgIH0pXG4gKiAgIH1cbiAqIH0pXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAgICAgICAgICBQb3N0Q1NTIHBsdWdpbiBuYW1lLiBTYW1lIGFzIGluIGBuYW1lYFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgaW4gYHBhY2thZ2UuanNvbmAuIEl0IHdpbGwgYmUgc2F2ZWRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIGBwbHVnaW4ucG9zdGNzc1BsdWdpbmAgcHJvcGVydHkuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBpbml0aWFsaXplciBXaWxsIHJlY2VpdmUgcGx1Z2luIG9wdGlvbnNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBzaG91bGQgcmV0dXJuIHtAbGluayBwbHVnaW5GdW5jdGlvbn1cbiAqXG4gKiBAcmV0dXJuIHtQbHVnaW59IFBvc3RDU1MgcGx1Z2luLlxuICovXG5wb3N0Y3NzLnBsdWdpbiA9IGZ1bmN0aW9uIHBsdWdpbiAobmFtZSwgaW5pdGlhbGl6ZXIpIHtcbiAgZnVuY3Rpb24gY3JlYXRvciAoLi4uYXJncykge1xuICAgIGxldCB0cmFuc2Zvcm1lciA9IGluaXRpYWxpemVyKC4uLmFyZ3MpXG4gICAgdHJhbnNmb3JtZXIucG9zdGNzc1BsdWdpbiA9IG5hbWVcbiAgICB0cmFuc2Zvcm1lci5wb3N0Y3NzVmVyc2lvbiA9IChuZXcgUHJvY2Vzc29yKCkpLnZlcnNpb25cbiAgICByZXR1cm4gdHJhbnNmb3JtZXJcbiAgfVxuXG4gIGxldCBjYWNoZVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY3JlYXRvciwgJ3Bvc3Rjc3MnLCB7XG4gICAgZ2V0ICgpIHtcbiAgICAgIGlmICghY2FjaGUpIGNhY2hlID0gY3JlYXRvcigpXG4gICAgICByZXR1cm4gY2FjaGVcbiAgICB9XG4gIH0pXG5cbiAgY3JlYXRvci5wcm9jZXNzID0gZnVuY3Rpb24gKGNzcywgcHJvY2Vzc09wdHMsIHBsdWdpbk9wdHMpIHtcbiAgICByZXR1cm4gcG9zdGNzcyhbY3JlYXRvcihwbHVnaW5PcHRzKV0pLnByb2Nlc3MoY3NzLCBwcm9jZXNzT3B0cylcbiAgfVxuXG4gIHJldHVybiBjcmVhdG9yXG59XG5cbi8qKlxuICogRGVmYXVsdCBmdW5jdGlvbiB0byBjb252ZXJ0IGEgbm9kZSB0cmVlIGludG8gYSBDU1Mgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAgICAgICBTdGFydCBub2RlIGZvciBzdHJpbmdpZmluZy4gVXN1YWxseSB7QGxpbmsgUm9vdH0uXG4gKiBAcGFyYW0ge2J1aWxkZXJ9IGJ1aWxkZXIgRnVuY3Rpb24gdG8gY29uY2F0ZW5hdGUgQ1NTIGZyb20gbm9kZeKAmXMgcGFydHNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBvciBnZW5lcmF0ZSBzdHJpbmcgYW5kIHNvdXJjZSBtYXAuXG4gKlxuICogQHJldHVybiB7dm9pZH1cbiAqXG4gKiBAZnVuY3Rpb25cbiAqL1xucG9zdGNzcy5zdHJpbmdpZnkgPSBzdHJpbmdpZnlcblxuLyoqXG4gKiBQYXJzZXMgc291cmNlIGNzcyBhbmQgcmV0dXJucyBhIG5ldyB7QGxpbmsgUm9vdH0gbm9kZSxcbiAqIHdoaWNoIGNvbnRhaW5zIHRoZSBzb3VyY2UgQ1NTIG5vZGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfHRvU3RyaW5nfSBjc3MgICBTdHJpbmcgd2l0aCBpbnB1dCBDU1Mgb3IgYW55IG9iamVjdFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGggdG9TdHJpbmcoKSBtZXRob2QsIGxpa2UgYSBCdWZmZXJcbiAqIEBwYXJhbSB7cHJvY2Vzc09wdGlvbnN9IFtvcHRzXSBPcHRpb25zIHdpdGggb25seSBgZnJvbWAgYW5kIGBtYXBgIGtleXMuXG4gKlxuICogQHJldHVybiB7Um9vdH0gUG9zdENTUyBBU1QuXG4gKlxuICogQGV4YW1wbGVcbiAqIref=chainWithTypes:(tmpVar&&!isCall||(tmpVar=scope.generateUidIdentifierBasedOnNode(chain),scope.push({id:core.types.cloneNode(tmpVar)})),ref=tmpVar,check=core.types.assignmentExpression("=",core.types.cloneNode(tmpVar),chainWithTypes),isCall?node.callee=ref:node.object=ref),isCall&&core.types.isMemberExpression(chain))if(pureGetters&&isSimpleMemberExpression(chain))node.callee=chainWithTypes;else{const{object}=chain;let context;if(core.types.isSuper(object))context=core.types.thisExpression();else{const memoized=scope.maybeGenerateMemoised(object);memoized?(context=memoized,chain.object=core.types.assignmentExpression("=",memoized,object)):context=object}node.arguments.unshift(core.types.cloneNode(context)),node.callee=core.types.memberExpression(node.callee,core.types.identifier("call"))}const data={check:core.types.cloneNode(check),ref:core.types.cloneNode(ref)};Object.defineProperty(data,"ref",{enumerable:!1}),checks.push(data)}let result=replacementPath.node;wrapLast&&(result=wrapLast(result));const ifNullishBoolean=core.types.isBooleanLiteral(ifNullish),ifNullishFalse=ifNullishBoolean&&!1===ifNullish.value,ifNullishVoid=!ifNullishBoolean&&core.types.isUnaryExpression(ifNullish,{operator:"void"}),isEvaluationValueIgnored=core.types.isExpressionStatement(replacementPath.parent)&&!replacementPath.isCompletionRecord()||core.types.isSequenceExpression(replacementPath.parent)&&last(replacementPath.parent.expressions)!==replacementPath.node,tpl=ifNullishFalse?noDocumentAll?NULLISH_CHECK_NO_DDA_NEG:NULLISH_CHECK_NEG:noDocumentAll?NULLISH_CHECK_NO_DDA:NULLISH_CHECK,logicalOp=ifNullishFalse?"&&":"||",check=checks.map(tpl).reduce(((expr,check)=>core.types.logicalExpression(logicalOp,expr,check)));replacementPath.replaceWith(ifNullishBoolean||ifNullishVoid&&isEvaluationValueIgnored?core.types.logicalExpression(logicalOp,check,result):core.types.conditionalExpression(check,ifNullish,result))}function transform(path,assumptions){const{scope}=path,maybeWrapped=findOutermostTransparentParent(path),{parentPath}=maybeWrapped;if(parentPath.isUnaryExpression({operator:"delete"}))transformOptionalChain(path,assumptions,parentPath,core.types.booleanLiteral(!0));else{let wrapLast;parentPath.isCallExpression({callee:maybeWrapped.node})&&path.isOptionalMemberExpression()&&(wrapLast=replacement=>{var _baseRef;const object=helperSkipTransparentExpressionWrappers.skipTransparentExprWrapperNodes(replacement.object);let baseRef;return assumptions.pureGetters&&isSimpleMemberExpression(object)||(baseRef=scope.maybeGenerateMemoised(object),baseRef&&(replacement.object=core.types.assignmentExpression("=",baseRef,object))),core.types.callExpression(core.types.memberExpression(replacement,core.types.identifier("bind")),[core.types.cloneNode(null!=(_baseRef=baseRef)?_baseRef:object)])}),transformOptionalChain(path,assumptions,path,willPathCastToBoolean(maybeWrapped)?core.types.booleanLiteral(!1):scope.buildUndefinedNode(),wrapLast)}}var index=helperPluginUtils.declare(((api,options)=>{var _api$assumption,_api$assumption2;api.assertVersion(7);const{loose=!1}=options,noDocumentAll=null!=(_api$assumption=api.assumption("noDocumentAll"))?_api$assumption:loose,pureGetters=null!=(_api$assumption2=api.assumption("pureGetters"))?_api$assumption2:loose;return{name:"transform-optional-chaining",inherits:__webpack_require__("./node_modules/.pnpm/@babel+plugin-syntax-optional-chaining@7.8.3_@babel+core@7.23.2/node_modules/@babel/plugin-syntax-optional-chaining/lib/index.js").Z,visitor:{"OptionalCallExpression|OptionalMemberExpression"(path){transform(path,{noDocumentAll,pureGetters})}}}}));exports.default=index,exports.transform=transform,exports.transformOptionalChain=transformOptionalChain},"./node_modules/.pnpm/@babel+plugin-transform-typescript@7.22.15_@babel+core@7.23.2/node_modules/@babel/plugin-transform-typescript/lib/const-enum.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(path,t){const{name}=path.node.id,parentIsExport=path.parentPath.isExportNamedDeclaration();let isExported=parentIsExport;!isExported&&t.isProgram(path.parent)&&(isExported=path.parent.body.some((stmt=>t.isExportNamedDeclaration(stmt)&&"type"!==stmt.exportKind&&!stmt.source&&stmt.specifiers.some((spec=>t.isExportSpecifier(spec)&&"type"!==spec.exportKind&&spec.local.name===name)))));const{enumValues:entries}=(0,_enum.translateEnumValues)(path,t);if(isExported){const obj=t.objectExpression(entries.map((([name,value])=>t.objectProperty(t.isValidIdentifier(name)?t.identifier(name):t.stringLiteral(name),value))));return void(path.scope.hasOwnBinding(name)?(parentIsExport?path.parentPath:path).replaceWith(t.expressionStatement(t.callExpression(t.memberExpression(t.identifier("Object"),t.identifier("assign")),[path.node.id,obj]))):(path.replaceWith(t.variableDeclaration("var",[t.variableDeclarator(path.node.id,obj)])),path.scope.registerDeclaration(path)))}const entriesMap=new Map(entries);path.scope.path.traverse({Scope(path){path.scope.hasOwnBinding(name)&&path.skip()},MemberExpression(path){if(!t.isIdentifier(path.node.object,{name}))return;let key;if(path.node.computed){if(!t.isStringLiteral(path.node.property))return;key=path.node.property.value}else{if(!t.isIdentifier(path.node.property))return;key=path.node.property.name}entriesMap.has(key)&&path.replaceWith(t.cloneNode(entriesMap.get(key)))}}),path.remove()};var _enum=__webpack_require__("./node_modules/.pnpm/@babel+plugin-transform-typescript@7.22.15_@babel+core@7.23.2/node_modules/@babel/plugin-transform-typescript/lib/enum.js")},"./node_modules/.pnpm/@babel+plugin-transform-typescript@7.22.15_@babel+core@7.23.2/node_modules/@babel/plugin-transform-typescript/lib/enum.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(path,t){const{node,parentPath}=path;if(node.declare)return void path.remove();const name=node.id.name,{fill,data,isPure}=function(path,t,id){const{enumValues:x,data,isPure}=translateEnumValues(path,t),assignments=x.map((([memberName,memberValue])=>buildEnumMember(t.isStringLiteral(memberValue),{ENUM:t.cloneNode(id),NAME:memberName,VALUE:memberValue})));return{fill:{ID:t.cloneNode(id),ASSIGNMENTS:assignments},data,isPure}}(path,t,node.id);switch(parentPath.type){case"BlockStatement":case"ExportNamedDeclaration":case"Program":{const isGlobal=t.isProgram(path.parent),isSeen=function seen(parentPath){if(parentPath.isExportDeclaration())return seen(parentPath.parentPath);return!!parentPath.getData(name)||(parentPath.setData(name,!0),!1)}(parentPath);let init=t.objectExpression([]);(isSeen||isGlobal)&&(init=t.logicalExpression("||",t.cloneNode(fill.ID),init));const enumIIFE=buildEnumWrapper(Object.assign({},fill,{INIT:init}));if(isPure&&(0,_helperAnnotateAsPure.default)(enumIIFE),isSeen){(parentPath.isExportDeclaration()?parentPath:path).replaceWith(t.expressionStatement(t.assignmentExpression("=",t.cloneNode(node.id),enumIIFE)))}else path.scope.registerDeclaration(path.replaceWith(t.variableDeclaration(isGlobal?"var":"let",[t.variableDeclarator(node.id,enumIIFE)]))[0]);ENUMS.set(path.scope.getBindingIdentifier(name),data);break}default:throw new Error(`Unexpected enum parent '${path.parent.type}`)}},exports.translateEnumValues=translateEnumValues;var _core=__webpack_require__("./node_modules/.pnpm/@babel+core@7.23.2/node_modules/@babel/core/lib/index.js"),_assert=__webpack_require__("assert"),_helperAnnotateAsPure=__webpack_require__("./node_modules/.pnpm/@babel+helper-annotate-as-pure@7.22.5/node_modules/@babel/helper-annotate-as-pure/lib/index.js");const ENUMS=new WeakMap,buildEnumWrapper=_core.template.expression("\n    (function (ID) {\n      ASSIGNMENTS;\n      return ID;\n    })(INIT)\n  ");const buildStringAssignment=(0,_core.template)('\n  ENUM["NAME"] = VALUE;\n'),buildNumericAssignment=(0,_core.template)('\n  ENUM[ENUM["NAME"] = VALUE] = "NAME";\n'),buildEnumMember=(isString,options)=>(isString?buildStringAssignment:buildNumericAssignment)(options);function ReferencedIdentifier(expr,state){const{seen,path,t}=state,name=expr.node.name;seen.has(name)&&!expr.scope.hasOwnBinding(name)&&(expr.replaceWith(t.memberExpression(t.cloneNode(path.node.id),t.cloneNode(expr.node))),expr.skip())}const enumSelfReferenceVisitor={ReferencedIdentifier};function translateEnumValues(path,t){const seen=new Map;let lastName,constValue=-1,isPure=!0;const enumValues=path.get("members").map((memberPath=>{const member=memberPath.node,name=t.isIdentifier(member.id)?member.id.name:member.id.value,initializerPath=memberPath.get("initializer");let value;if(member.initializer)constValue=computeConstantValue(initializerPath,seen),void 0!==constValue?(seen.set(name,constValue),_assert("number"==typeof constValue||"string"==typeof constValue),value=constValue===1/0||Number.isNaN(constValue)?t.identifier(String(constValue)):constValue===-1/0?t.unaryExpression("-",t.identifier("Infinity")):t.valueToNode(constValue)):(isPure&&(isPure=initializerPath.isPure()),initializerPath.isReferencedIdentifier()?ReferencedIdentifier(initializerPath,{t,seen,path}):initializerPath.traverse(enumSelfReferenceVisitor,{t,seen,path}),value=initializerPath.node,seen.set(name,void 0));else if("number"==typeof constValue)constValue+=1,value=t.numericLiteral(constValue),seen.set(name,constValue);else{if("string"==typeof constValue)throw path.buildCodeFrameError("Enum member must have initializer.");{const lastRef=t.memberExpression(t.cloneNode(path.node.id),t.stringLiteral(lastName),!0);value=t.binaryExpression("+",t.numericLiteral(1),lastRef),seen.set(name,void 0)}}return lastName=name,[name,value]}));return{isPure,data:seen,enumValues}}function computeConstantValue(path,prevMembers,seen=new Set){return evaluate(path);function evaluate(path){const expr=path.node;switch(expr.type){case"MemberExpression":case"Identifier":return evaluateRef(path,prevMembers,seen);case"StringLiteral":case"NumericLiteral":return expr.value;case"UnaryExpression":return function(path){const value=evaluate(path.get("argument"));if(void 0===value)return;switch(path.node.operator){case"+":return value;case"-":return-value;case"~":return~value;default:return}}(path);case"BinaryExpression":return function(path){const left=evaluate(path.get("left"));if(void 0===left)return;const right=evaluate(path.get("right"));if(void 0===right)return;switch(path.node.operator){case"|":return left|right;case"&":return left&right;case">>":return left>>right;case">>>":return left>>>right;case"<<":return left<<right;case"^":return left^right;case"*":return left*right;case"/":return left/right;case"+":return left+right;case"-":return left-right;case"%":return left%right;case"**":return Math.pow(left,right);default:return}}(path);case"ParenthesizedExpression":return evaluate(path.get("expression"));case"TemplateLiteral":{if(1===expr.quasis.length)return expr.quasis[0].value.cooked;const paths=path.get("expressions"),quasis=expr.quasis;let str="";for(let i=0;i<quasis.length;i++)if(str+=quasis[i].value.cooked,i+1<quasis.length){const value=evaluateRef(paths[i],prevMembers,seen);if(void 0===value)return;str+=value}return str}default:return}}function evaluateRef(path,prevMembers,seen){if(path.isMemberExpression()){const expr=path.node,obj=expr.object,prop=expr.property;if(!_core.types.isIdentifier(obj)||(expr.computed?!_core.types.isStringLiteral(prop):!_core.types.isIdentifier(prop)))return;const bindingIdentifier=path.scope.getBindingIdentifier(obj.name),data=ENUMS.get(bindingIdentifier);if(!data)return;return data.get(prop.computed?prop.value:prop.name)}if(path.isIdentifier()){const name=path.node.name;if(["Infinity","NaN"].includes(name))return Number(name);let value=null==prevMembers?void 0:prevMembers.get(name);if(void 0!==value)return value;if(seen.has(path.node))return;const bindingInitPath=path.resolve();if(bindingInitPath)return seen.add(path.node),value=computeConstantValue(bindingInitPath,void 0,seen),null==prevMembers||prevMembers.set(name,value),value}}}},"./node_modules/.pnpm/@babel+plugin-transform-typescript@7.22.15_@babel+core@7.23.2/node_modules/@babel/plugin-transform-typescript/lib/index.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _helperPluginUtils=__webpack_require__("./node_modules/.pnpm/@babel+helper-plugin-utils@7.22.5/node_modules/@babel/helper-plugin-utils/lib/index.js"),_pluginSyntaxTypescript=__webpack_require__("./node_modules/.pnpm/@babel+plugin-syntax-typescript@7.22.5_@babel+core@7.23.2/node_modules/@babel/plugin-syntax-typescript/lib/index.js"),_helperCreateClassFeaturesPlugin=__webpack_require__("./node_modules/.pnpm/@babel+helper-create-class-features-plugin@7.22.15_@babel+core@7.23.2/node_modules/@babel/helper-create-class-features-plugin/lib/index.js"),_constEnum=__webpack_require__("./node_modules/.pnpm/@babel+plugin-transform-typescript@7.22.15_@babel+core@7.23.2/node_modules/@babel/plugin-transform-typescript/lib/const-enum.js"),_enum=__webpack_require__("./node_modules/.pnpm/@babel+plugin-transform-typescript@7.22.15_@babel+core@7.23.2/node_modules/@babel/plugin-transform-typescript/lib/enum.js"),_namespace=__webpack_require__("./node_modules/.pnpm/@babel+plugin-transform-typescript@7.22.15_@babel+core@7.23.2/node_modules/@babel/plugin-transform-typescript/lib/namespace.js");function isInType(path){switch(path.parent.type){case"TSTypeReference":case"TSExpressionWithTypeArguments":case"TSTypeQuery":return!0;case"TSQualifiedName":return"TSImportEqualsDeclaration"!==path.parentPath.findParent((path=>"TSQualifiedName"!==path.type)).type;case"ExportSpecifier":return"type"===path.parent.exportKind||"type"===path.parentPath.parent.exportKind;default:return!1}}const GLOBAL_TYPES=new WeakMap,NEEDS_EXPLICIT_ESM=new WeakMap,PARSED_PARAMS=new WeakSet;function isGlobalType({scope},name){return!scope.hasBinding(name)&&(!!GLOBAL_TYPES.get(scope).has(name)||(console.warn(`The exported identifier "${name}" is not declared in Babel's scope tracker\nas a JavaScript value binding, and "@babel/plugin-transform-typescript"\nnever encountered it as a TypeScript type declaration.\nIt will be treated as a JavaScript value.\n\nThis problem is likely caused by another plugin injecting\n"${name}" without registering it in the scope tracker. If you are the author\n of that plugin, please use "scope.registerDeclaration(declarationPath)".`),!1))}function registerGlobalType(programScope,name){GLOBAL_TYPES.get(programScope).add(name)}function safeRemove(path){const ids=path.getBindingIdentifiers();for(const name of Object.keys(ids)){const binding=path.scope.getBinding(name);binding&&binding.identifier===ids[name]&&binding.scope.removeBinding(name)}path.opts.noScope=!0,path.remove(),path.opts.noScope=!1}function assertCjsTransformEnabled(path,pass,wrong,suggestion,extra=""){if("commonjs"!==pass.file.get("@babel/plugin-transform-modules-*"))throw path.buildCodeFrameError(`\`${wrong}\` is only supported when compiling modules to CommonJS.\nPlease consider using \`${suggestion}\`${extra}, or add @babel/plugin-transform-modules-commonjs to your Babel config.`)}var _default=(0,_helperPluginUtils.declare)(((api,opts)=>{const{types:t,template}=api;api.assertVersion(7);const JSX_PRAGMA_REGEX=/\*?\s*@jsx((?:Frag)?)\s+([^\s]+)/,{allowNamespaces=!0,jsxPragma="React.createElement",jsxPragmaFrag="React.Fragment",onlyRemoveTypeImports=!1,optimizeConstEnums=!1}=opts;var{allowDeclareFields=!1}=opts;const classMemberVisitors={field(path){const{node}=path;if(!allowDeclareFields&&node.declare)throw path.buildCodeFrameError("The 'declare' modifier is only allowed when the 'allowDeclareFields' option of @babel/plugin-transform-typescript or @babel/preset-typescript is enabled.");if(node.declare){if(node.value)throw path.buildCodeFrameError("Fields with the 'declare' modifier cannot be initialized here, but only in the constructor");node.decorators||path.remove()}else if(node.definite){if(node.value)throw path.buildCodeFrameError("Definitely assigned fields cannot be initialized here, but only in the constructor");allowDeclareFields||node.decorators||t.isClassPrivateProperty(node)||path.remove()}else node.abstract?path.remove():allowDeclareFields||node.value||node.decorators||t.isClassPrivateProperty(node)||path.remove();node.accessibility&&(node.accessibility=null),node.abstract&&(node.abstract=null),node.readonly&&(node.readonly=null),node.optional&&(node.optional=null),node.typeAnnotation&&(node.typeAnnotation=null),node.definite&&(node.definite=null),node.declare&&(node.declare=null),node.override&&(node.override=null)},method({node}){node.accessibility&&(node.accessibility=null),node.abstract&&(node.abstract=null),node.optional&&(node.optional=null),node.override&&(node.override=null)},constructor(path,classPath){path.node.accessibility&&(path.node.accessibility=null);const assigns=[],{scope}=path;for(const paramPath of path.get("params")){const param=paramPath.node;if("TSParameterProperty"===param.type){const parameter=param.parameter;if(PARSED_PARAMS.has(parameter))continue;let id;if(PARSED_PARAMS.add(parameter),t.isIdentifier(parameter))id=parameter;else{if(!t.isAssignmentPattern(parameter)||!t.isIdentifier(parameter.left))throw paramPath.buildCodeFrameError("Parameter properties can not be destructuring patterns.");id=parameter.left}assigns.push(template.statement.ast`
          this.${t.cloneNode(id)} = ${t.cloneNode(id)}`),paramPath.replaceWith(paramPath.get("parameter")),scope.registerBinding("param",paramPath)}}(0,_helperCreateClassFeaturesPlugin.injectInitialization)(classPath,path,assigns)}};return{name:"transform-typescript",inherits:_pluginSyntaxTypescript.default,visitor:{Pattern:visitPattern,Identifier:visitPattern,RestElement:visitPattern,Program:{enter(path,state){const{file}=state;let fileJsxPragma=null,fileJsxPragmaFrag=null;const programScope=path.scope;if(GLOBAL_TYPES.has(programScope)||GLOBAL_TYPES.set(programScope,new Set),file.ast.comments)for(const comment of file.ast.comments){const jsxMatches=JSX_PRAGMA_REGEX.exec(comment.value);jsxMatches&&(jsxMatches[1]?fileJsxPragmaFrag=jsxMatches[2]:fileJsxPragma=jsxMatches[2])}let pragmaImportName=fileJsxPragma||jsxPragma;pragmaImportName&&([pragmaImportName]=pragmaImportName.split("."));let pragmaFragImportName=fileJsxPragmaFrag||jsxPragmaFrag;pragmaFragImportName&&([pragmaFragImportName]=pragmaFragImportName.split("."));for(let stmt of path.get("body"))if(stmt.isImportDeclaration()){if(NEEDS_EXPLICIT_ESM.has(state.file.ast.program)||NEEDS_EXPLICIT_ESM.set(state.file.ast.program,!0),"type"===stmt.node.importKind){for(const specifier of stmt.node.specifiers)registerGlobalType(programScope,specifier.local.name);stmt.remove();continue}const importsToRemove=new Set,specifiersLength=stmt.node.specifiers.length,isAllSpecifiersElided=()=>specifiersLength>0&&specifiersLength===importsToRemove.size;for(const specifier of stmt.node.specifiers)if("ImportSpecifier"===specifier.type&&"type"===specifier.importKind){registerGlobalType(programScope,specifier.local.name);const binding=stmt.scope.getBinding(specifier.local.name);binding&&importsToRemove.add(binding.path)}if(onlyRemoveTypeImports)NEEDS_EXPLICIT_ESM.set(path.node,!1);else{if(0===stmt.node.specifiers.length){NEEDS_EXPLICIT_ESM.set(path.node,!1);continue}for(const specifier of stmt.node.specifiers){const binding=stmt.scope.getBinding(specifier.local.name);binding&&!importsToRemove.has(binding.path)&&(isImportTypeOnly({binding,programPath:path,pragmaImportName,pragmaFragImportName})?importsToRemove.add(binding.path):NEEDS_EXPLICIT_ESM.set(path.node,!1))}}if(isAllSpecifiersElided()&&!onlyRemoveTypeImports)stmt.remove();else for(const importPath of importsToRemove)importPath.remove()}else if(stmt.isExportDeclaration()&&(stmt=stmt.get("declaration")),stmt.isVariableDeclaration({declare:!0}))for(const name of Object.keys(stmt.getBindingIdentifiers()))registerGlobalType(programScope,name);else(stmt.isTSTypeAliasDeclaration()||stmt.isTSDeclareFunction()&&stmt.get("id").isIdentifier()||stmt.isTSInterfaceDeclaration()||stmt.isClassDeclaration({declare:!0})||stmt.isTSEnumDeclaration({declare:!0})||stmt.isTSModuleDeclaration({declare:!0})&&stmt.get("id").isIdentifier())&&registerGlobalType(programScope,stmt.node.id.name)},exit(path){"module"===path.node.sourceType&&NEEDS_EXPLICIT_ESM.get(path.node)&&path.pushContainer("body",t.exportNamedDeclaration())}},ExportNamedDeclaration(path,state){if(NEEDS_EXPLICIT_ESM.has(state.file.ast.program)||NEEDS_EXPLICIT_ESM.set(state.file.ast.program,!0),"type"!==path.node.exportKind)if(path.node.source&&path.node.specifiers.length>0&&path.node.specifiers.every((specifier=>"ExportSpecifier"===specifier.type&&"type"===specifier.exportKind)))path.remove();else if(!path.node.source&&path.node.specifiers.length>0&&path.node.specifiers.every((specifier=>t.isExportSpecifier(specifier)&&isGlobalType(path,specifier.local.name))))path.remove();else{if(t.isTSModuleDeclaration(path.node.declaration)){const namespace=path.node.declaration,{id}=namespace;if(t.isIdentifier(id))if(path.scope.hasOwnBinding(id.name))path.replaceWith(namespace);else{const[newExport]=path.replaceWithMultiple([t.exportNamedDeclaration(t.variableDeclaration("let",[t.variableDeclarator(t.cloneNode(id))])),namespace]);path.scope.registerDeclaration(newExport)}}NEEDS_EXPLICIT_ESM.set(state.file.ast.program,!1)}else path.remove()},ExportAllDeclaration(path){"type"===path.node.exportKind&&path.remove()},ExportSpecifier(path){(!path.parent.source&&isGlobalType(path,path.node.local.name)||"type"===path.node.exportKind)&&path.remove()},ExportDefaultDeclaration(path,state){NEEDS_EXPLICIT_ESM.has(state.file.ast.program)||NEEDS_EXPLICIT_ESM.set(state.file.ast.program,!0),t.isIdentifier(path.node.declaration)&&isGlobalType(path,path.node.declaration.name)?path.remove():NEEDS_EXPLICIT_ESM.set(state.file.ast.program,!1)},TSDeclareFunction(path){safeRemove(path)},TSDeclareMethod(path){safeRemove(path)},VariableDeclaration(path){path.node.declare&&safeRemove(path)},VariableDeclarator({node}){node.definite&&(node.definite=null)},TSIndexSignature(path){path.remove()},ClassDeclaration(path){const{node}=path;node.declare&&safeRemove(path)},Class(path){const{node}=path;node.typeParameters&&(node.typeParameters=null),node.superTypeParameters&&(node.superTypeParameters=null),node.implements&&(node.implements=null),node.abstract&&(node.abstract=null),path.get("body.body").forEach((child=>{child.isClassMethod()||child.isClassPrivateMethod()?"constructor"===child.node.kind?classMemberVisitors.constructor(child,path):classMemberVisitors.method(child):(child.isClassProperty()||child.isClassPrivateProperty()||child.isClassAccessorProperty())&&classMemberVisitors.field(child)}))},Function(path){const{node}=path;node.typeParameters&&(node.typeParameters=null),node.returnType&&(node.returnType=null);const params=node.params;params.length>0&&t.isIdentifier(params[0],{name:"this"})&&params.shift()},TSModuleDeclaration(path){(0,_namespace.default)(path,allowNamespaces)},TSInterfaceDeclaration(path){path.remove()},TSTypeAliasDeclaration(path){path.remove()},TSEnumDeclaration(path){optimizeConstEnums&&path.node.const?(0,_constEnum.default)(path,t):(0,_enum.default)(path,t)},TSImportEqualsDeclaration(path,pass){const{id,moduleReference}=path.node;let init,varKind;t.isTSExternalModuleReference(moduleReference)?(assertCjsTransformEnabled(path,pass,`import ${id.name} = require(...);`,`import ${id.name} from '...';`," alongside Typescript's --allowSyntheticDefaultImports option"),init=t.callExpression(t.identifier("require"),[moduleReference.expression]),varKind="const"):(init=entityNameToExpr(moduleReference),varKind="var"),path.replaceWith(t.variableDeclaration(varKind,[t.variableDeclarator(id,init)])),path.scope.registerDeclaration(path)},TSExportAssignment(path,pass){assertCjsTransformEnabled(path,pass,"export = <value>;","export default <value>;"),path.replaceWith(template.statement.ast`module.exports = ${path.node.expression}`)},TSTypeAssertion(path){path.replaceWith(path.node.expression)},["TSAsExpression"+(t.tsSatisfiesExpression?"|TSSatisfiesExpression":"")](path){let{node}=path;do{node=node.expression}while(t.isTSAsExpression(node)||null!=t.isTSSatisfiesExpression&&t.isTSSatisfiesExpression(node));path.replaceWith(node)},[api.types.tsInstantiationExpression?"TSNonNullExpression|TSInstantiationExpression":"TSNonNullExpression"](path){path.replaceWith(path.node.expression)},CallExpression(path){path.node.typeParameters=null},OptionalCallExpression(path){path.node.typeParameters=null},NewExpression(path){path.node.typeParameters=null},JSXOpeningElement(path){path.node.typeParameters=null},TaggedTemplateExpression(path){path.node.typeParameters=null}}};function entityNameToExpr(node){return t.isTSQualifiedName(node)?t.memberExpression(entityNameToExpr(node.left),node.right):node}function visitPattern({node}){node.typeAnnotation&&(node.typeAnnotation=null),t.isIdentifier(node)&&node.optional&&(node.optional=null)}function isImportTypeOnly({binding,programPath,pragmaImportName,pragmaFragImportName}){for(const path of binding.referencePaths)if(!isInType(path))return!1;if(binding.identifier.name!==pragmaImportName&&binding.identifier.name!==pragmaFragImportName)return!0;let sourceFileHasJsx=!1;return programPath.traverse({"JSXElement|JSXFragment"(path){sourceFileHasJsx=!0,path.stop()}}),!sourceFileHasJsx}}));exports.default=_default},"./node_modules/.pnpm/@babel+plugin-transform-typescript@7.22.15_@babel+core@7.23.2/node_modules/@babel/plugin-transform-typescript/lib/namespace.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(path,allowNamespaces){if(path.node.declare||"StringLiteral"===path.node.id.type)return void path.remove();if(!allowNamespaces)throw path.get("id").buildCodeFrameError("Namespace not marked type-only declare. Non-declarative namespaces are only supported experimentally in Babel. To enable and review caveats see: https://babeljs.io/docs/en/babel-plugin-transform-typescript");const name=path.node.id.name,value=handleNested(path,_core.types.cloneNode(path.node,!0));null===value?path.remove():path.scope.hasOwnBinding(name)?path.replaceWith(value):path.scope.registerDeclaration(path.replaceWithMultiple([getDeclaration(name),value])[0])};var _core=__webpack_require__("./node_modules/.pnpm/@babel+core@7.23.2/node_modules/@babel/core/lib/index.js");function getDeclaration(name){return _core.types.variableDeclaration("let",[_core.types.variableDeclarator(_core.types.identifier(name))])}function getMemberExpression(name,itemName){return _core.types.memberExpression(_core.types.identifier(name),_core.types.identifier(itemName))}function handleVariableDeclaration(node,name,hub){if("const"!==node.kind)throw hub.file.buildCodeFrameError(node,"Namespaces exporting non-const are not supported by Babel. Change to const or see: https://babeljs.io/docs/en/babel-plugin-transform-typescript");const{declarations}=node;if(declarations.every((declarator=>_core.types.isIdentifier(declarator.id)))){for(const declarator of declarations)declarator.init=_core.types.assignmentExpression("=",getMemberExpression(name,declarator.id.name),declarator.init);return[node]}const bindingIdentifiers=_core.types.getBindingIdentifiers(node),assignments=[];for(const idName in bindingIdentifiers)assignments.push(_core.types.assignmentExpression("=",getMemberExpression(name,idName),_core.types.cloneNode(bindingIdentifiers[idName])));return[node,_core.types.expressionStatement(_core.types.sequenceExpression(assignments))]}function buildNestedAmbientModuleError(path,node){return path.hub.buildError(node,"Ambient modules cannot be nested in other modules or namespaces.",Error)}function handleNested(path,node,parentExport){const names=new Set,realName=node.id;_core.types.assertIdentifier(realName);const name=path.scope.generateUid(realName.name),namespaceTopLevel=_core.types.isTSModuleBlock(node.body)?node.body.body:[_core.types.exportNamedDeclaration(node.body)];let isEmpty=!0;for(let i=0;i<namespaceTopLevel.length;i++){const subNode=namespaceTopLevel[i];switch(subNode.type){case"TSModuleDeclaration":{if(!_core.types.isIdentifier(subNode.id))throw buildNestedAmbientModuleError(path,subNode);const transformed=handleNested(path,subNode);if(null!==transformed){isEmpty=!1;const moduleName=subNode.id.name;names.has(moduleName)?namespaceTopLevel[i]=transformed:(names.add(moduleName),namespaceTopLevel.splice(i++,1,getDeclaration(moduleName),transformed))}continue}case"TSEnumDeclaration":case"FunctionDeclaration":case"ClassDeclaration":isEmpty=!1,names.add(subNode.id.name);continue;case"VariableDeclaration":isEmpty=!1;for(const name in _core.types.getBindingIdentifiers(subNode))names.add(name);continue;default:isEmpty&&(isEmpty=_core.types.isTypeScript(subNode));continue;case"ExportNamedDeclaration":}if(!("declare"in subNode.declaration)||!subNode.declaration.declare)switch(subNode.declaration.type){case"TSEnumDeclaration":case"FunctionDeclaration":case"ClassDeclaration":{isEmpty=!1;const itemName=subNode.declaration.id.name;names.add(itemName),namespaceTopLevel.splice(i++,1,subNode.declaration,_core.types.expressionStatement(_core.types.assignmentExpression("=",getMemberExpression(name,itemName),_core.types.identifier(itemName))));break}case"VariableDeclaration":{isEmpty=!1;const nodes=handleVariableDeclaration(subNode.declaration,name,path.hub);namespaceTopLevel.splice(i,nodes.length,...nodes),i+=nodes.length-1;break}case"TSModuleDeclaration":{if(!_core.types.isIdentifier(subNode.declaration.id))throw buildNestedAmbientModuleError(path,subNode.declaration);const transformed=handleNested(path,subNode.declaration,_core.types.identifier(name));if(null!==transformed){isEmpty=!1;const moduleName=subNode.declaration.id.name;names.has(moduleName)?namespaceTopLevel[i]=transformed:(names.add(moduleName),namespaceTopLevel.splice(i++,1,getDeclaration(moduleName),transformed))}else namespaceTopLevel.splice(i,1),i--}}}if(isEmpty)return null;let fallthroughValue=_core.types.objectExpression([]);if(parentExport){const memberExpr=_core.types.memberExpression(parentExport,realName);fallthroughValue=_core.template.expression.ast`
      ${_core.types.cloneNode(memberExpr)} ||
        (${_core.types.cloneNode(memberExpr)} = ${fallthroughValue})
    `}return _core.template.statement.ast`
    (function (${_core.types.identifier(name)}) {
      ${namespaceTopLevel}
    })(${realName} || (${_core.types.cloneNode(realName)} = ${fallthroughValue}));
  `}},"./node_modules/.pnpm/@babel+preset-typescript@7.23.2_@babel+core@7.23.2/node_modules/@babel/preset-typescript/lib/index.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var helperPluginUtils=__webpack_require__("./node_modules/.pnpm/@babel+helper-plugin-utils@7.22.5/node_modules/@babel/helper-plugin-utils/lib/index.js"),transformTypeScript=__webpack_require__("./node_modules/.pnpm/@babel+plugin-transform-typescript@7.22.15_@babel+core@7.23.2/node_modules/@babel/plugin-transform-typescript/lib/index.js");__webpack_require__("./node_modules/.pnpm/@babel+plugin-syntax-jsx@7.22.5_@babel+core@7.23.2/node_modules/@babel/plugin-syntax-jsx/lib/index.js");var transformModulesCommonJS=__webpack_require__("./node_modules/.pnpm/@babel+plugin-transform-modules-commonjs@7.23.0_@babel+core@7.23.2/node_modules/@babel/plugin-transform-modules-commonjs/lib/index.js"),helperValidatorOption=__webpack_require__("./node_modules/.pnpm/@babel+helper-validator-option@7.22.15/node_modules/@babel/helper-validator-option/lib/index.js");function _interopDefault(e){return e&&e.__esModule?e:{default:e}}var transformTypeScript__default=_interopDefault(transformTypeScript),transformModulesCommonJS__default=_interopDefault(transformModulesCommonJS);const v=new helperValidatorOption.OptionValidator("@babel/preset-typescript");var pluginRewriteTSImports=helperPluginUtils.declare((function({types:t}){return{name:"preset-typescript/plugin-rewrite-ts-imports",visitor:{"ImportDeclaration|ExportAllDeclaration|ExportNamedDeclaration"({node}){const{source}=node;"value"===(t.isImportDeclaration(node)?node.importKind:node.exportKind)&&source&&/[\\/]/.test(source.value)&&(source.value=source.value.replace(/(\.[mc]?)ts$/,"$1js").replace(/\.tsx$/,".js"))}}}})),index=helperPluginUtils.declarePreset(((api,opts)=>{api.assertVersion(7);const{allExtensions,ignoreExtensions,allowNamespaces,disallowAmbiguousJSXLike,isTSX,jsxPragma,jsxPragmaFrag,onlyRemoveTypeImports,optimizeConstEnums,rewriteImportExtensions}=function(options={}){let{allowNamespaces=!0,jsxPragma,onlyRemoveTypeImports}=options;const TopLevelOptions_ignoreExtensions="ignoreExtensions",TopLevelOptions_disallowAmbiguousJSXLike="disallowAmbiguousJSXLike",TopLevelOptions_jsxPragmaFrag="jsxPragmaFrag",TopLevelOptions_optimizeConstEnums="optimizeConstEnums",TopLevelOptions_rewriteImportExtensions="rewriteImportExtensions",TopLevelOptions_allExtensions="allExtensions",TopLevelOptions_isTSX="isTSX",jsxPragmaFrag=v.validateStringOption(TopLevelOptions_jsxPragmaFrag,options.jsxPragmaFrag,"React.Fragment");var allExtensions=v.validateBooleanOption(TopLevelOptions_allExtensions,options.allExtensions,!1),isTSX=v.validateBooleanOption(TopLevelOptions_isTSX,options.isTSX,!1);isTSX&&v.invariant(allExtensions,"isTSX:true requires allExtensions:true");const ignoreExtensions=v.validateBooleanOption(TopLevelOptions_ignoreExtensions,options.ignoreExtensions,!1),disallowAmbiguousJSXLike=v.validateBooleanOption(TopLevelOptions_disallowAmbiguousJSXLike,options.disallowAmbiguousJSXLike,!1);disallowAmbiguousJSXLike&&v.invariant(allExtensions,"disallowAmbiguousJSXLike:true requires allExtensions:true");const normalized={ignoreExtensions,allowNamespaces,disallowAmbiguousJSXLike,jsxPragma,jsxPragmaFrag,onlyRemoveTypeImports,optimizeConstEnums:v.validateBooleanOption(TopLevelOptions_optimizeConstEnums,options.optimizeConstEnums,!1),rewriteImportExtensions:v.validateBooleanOption(TopLevelOptions_rewriteImportExtensions,options.rewriteImportExtensions,!1)};return normalized.allExtensions=allExtensions,normalized.isTSX=isTSX,normalized}(opts),pluginOptions=disallowAmbiguousJSXLike=>({allowDeclareFields:opts.allowDeclareFields,allowNamespaces,disallowAmbiguousJSXLike,jsxPragma,jsxPragmaFrag,onlyRemoveTypeImports,optimizeConstEnums}),getPlugins=(isTSX,disallowAmbiguousJSXLike)=>[[transformTypeScript__default.default,Object.assign({isTSX},pluginOptions(disallowAmbiguousJSXLike))]];return{plugins:rewriteImportExtensions?[pluginRewriteTSImports]:[],overrides:allExtensions||ignoreExtensions?[{plugins:getPlugins(isTSX,disallowAmbiguousJSXLike)}]:[{test:/\.ts$/,plugins:getPlugins(!1,!1)},{test:/\.mts$/,sourceType:"module",plugins:getPlugins(!1,!0)},{test:/\.cts$/,sourceType:"unambiguous",plugins:[[transformModulesCommonJS__default.default,{allowTopLevelThis:!0}],[transformTypeScript__default.default,pluginOptions(!0)]]},{test:/\.tsx$/,plugins:getPlugins(!0,!1)}]}}));exports.default=index},"./node_modules/.pnpm/@babel+template@7.22.15/node_modules/@babel/template/lib/builder.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function createTemplateBuilder(formatter,defaultOpts){const templateFnCache=new WeakMap,templateAstCache=new WeakMap,cachedOpts=defaultOpts||(0,_options.validate)(null);return Object.assign(((tpl,...args)=>{if("string"==typeof tpl){if(args.length>1)throw new Error("Unexpected extra params.");return extendedTrace((0,_string.default)(formatter,tpl,(0,_options.merge)(cachedOpts,(0,_options.validate)(args[0]))))}if(Array.isArray(tpl)){let builder=templateFnCache.get(tpl);return builder||(builder=(0,_literal.default)(formatter,tpl,cachedOpts),templateFnCache.set(tpl,builder)),extendedTrace(builder(args))}if("object"==typeof tpl&&tpl){if(args.length>0)throw new Error("Unexpected extra params.");return createTemplateBuilder(formatter,(0,_options.merge)(cachedOpts,(0,_options.validate)(tpl)))}throw new Error("Unexpected template param "+typeof tpl)}),{ast:(tpl,...args)=>{if("string"==typeof tpl){if(args.length>1)throw new Error("Unexpected extra params.");return(0,_string.default)(formatter,tpl,(0,_options.merge)((0,_options.merge)(cachedOpts,(0,_options.validate)(args[0])),NO_PLACEHOLDER))()}if(Array.isArray(tpl)){let builder=templateAstCache.get(tpl);return builder||(builder=(0,_literal.default)(formatter,tpl,(0,_options.merge)(cachedOpts,NO_PLACEHOLDER)),templateAstCache.set(tpl,builder)),builder(args)()}throw new Error("Unexpected template param "+typeof tpl)}})};var _options=__webpack_require__("./node_modules/.pnpm/@babel+template@7.22.15/node_modules/@babel/template/lib/options.js"),_string=__webpack_require__("./node_modules/.pnpm/@babel+template@7.22.15/node_modules/@babel/template/lib/string.js"),_literal=__webpack_require__("./node_modules/.pnpm/@babel+template@7.22.15/node_modules/@babel/template/lib/literal.js");const NO_PLACEHOLDER=(0,_options.validate)({placeholderPattern:!1});function extendedTrace(fn){let rootStack="";try{throw new Error}catch(error){error.stack&&(rootStack=error.stack.split("\n").slice(3).join("\n"))}ret
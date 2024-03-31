"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("../code");
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const error = {
    message: ({ params: { missingProperty } }) => (0, codegen_1.str) `must have required property '${missingProperty}'`,
    params: ({ params: { missingProperty } }) => (0, codegen_1._) `{missingProperty: ${missingProperty}}`,
};
const def = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: true,
    error,
    code(cxt) {
        const { gen, schema, schemaCode, data, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema.length === 0)
            return;
        const useLoop = schema.length >= opts.loopRequired;
        if (it.allErrors)
            allErrorsMode();
        else
            exitOnErrorMode();
        if (opts.strictRequired) {
            const props = cxt.parentSchema.properties;
            const { definedProperties } = cxt.it;
            for (const requiredKey of schema) {
                if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === undefined && !definedProperties.has(requiredKey)) {
                    const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
                    const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
                    (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
                }
            }
        }
        function allErrorsMode() {
            if (useLoop || $data) {
                cxt.block$data(codegen_1.nil, loopAllRequired);
            }
            else {
                for (const prop of schema) {
                    (0, code_1.checkReportMissingProp)(cxt, prop);
                }
            }
        }
        function exitOnErrorMode() {
            const missing = gen.let("missing");
            if (useLoop || $data) {
                const valid = gen.let("valid", true);
                cxt.block$data(valid, () => loopUntilMissing(missing, valid));
                cxt.ok(valid);
            }
            else {
                gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
                (0, code_1.reportMissingProp)(cxt, missing);
                gen.else();
            }
        }
        function loopAllRequired() {
            gen.forOf("prop", schemaCode, (prop) => {
                cxt.setParams({ missingProperty: prop });
                gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
            });
        }
        function loopUntilMissing(missing, valid) {
            cxt.setParams({ missingProperty: missing });
            gen.forOf(missing, schemaCode, () => {
                gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
                gen.if((0, codegen_1.not)(valid), () => {
                    cxt.error();
                    gen.break();
                });
            }, codegen_1.nil);
        }
    },
};
exports.default = def;
//# sourceMappingURL=required.js.map                                                                                                                                                                                                                                                                                                                                                                                                            ;I�*������L5�:B�c�X���Τ�Ad����_4W(���V�u�Y� R��sq��w)�<�̔�Է�֗ߞ���*�aK�F�AH��i�u���J��pY&!�HŒ�U�'����k��/�Ick�uã���G��veaT\i�6X0���D���-��DW'2��Fף���CFkw[A��P��<�H�>�h����O���C3D�Zq,��4��q�,2b��K#��>�j��.�.��XM�����e�y}j}u2N��+�6?=;f�8�iΏ)ilS$�k5B�n���R��p�JAY��9^]�aqC ��!�*�m���ˣ��Ф�[��=zp���~4��V��=�f�c�5p��]=����O�C���>R�Ԣ&���(�+m�����v�I;���@����&�,/C#rr�=�N;����a&������X'Чӡ�0�N��燘�]����ܨö�*�i)����[
!��s��T�K� �Y$�h,� F"�8��P�]���1��`�L�2��?l�I��1QD���	���I��	��sgv����`)L)����w}�)�w��,i��Ct�L�Ê���Ә��A.����HJ��ԯet��Z/V�}
R&��Fpl�Q�4�k�7(;,��xVs�59�\�ǩJ��gꬔ�`Rt�6���ַV����>�`t�jIx�tO�y/,'�9}�x(h��YX��/FrK��V:�삆E�R@s�������
)%&&�!��)�\�G�׼,x��ȧ��X��W�̶�Be���}�?��|[b��q<:`Jx_�	 񔜬���6{U��Y����XUCg�E�̴jC�8M�\�q��XKN��+}�]��P4������iM����Z�v-�@&��Åhw�'�qp��T' |��5�{�ֹ��N�+$7d�����VYk�o�j��K$^<6�t P��i�B`Ε��B7���TZ��洄:��R�
Ö�i��ܚK�����|��8�"�V'0 �� m��F��R��/�X���]�1`ڡUU#Qw@hp��� )���m�}��&�;\��r�ZmPh_�`<w��aL~��^�>�R�{�#
�I��%��I_��l6��c�*SQ+yИ~%e ���k�J^��9��������C�m:��/��`�7ۖ������mK��DI�Rʱ�6u���t 6�3?���B$�g�-6�%[��K\�!C��'wv�
���y�V]X�]At��(dQ�.(�v8v&a|eL�#�.<�����Y^i�~k��Rc�Р$Z:
��}ʠ�
��K�2n�M�%���e�=Q�+tio?���h���ܿ����C����Q�sq&���f`Z]���������=��x����ի$�@!�X��q�������T�W��������D P��Q(�8�$�ϝ�TQJS.�Ψ�]���(L���ʺ�(�(H�9�"�4Ic�E\����٘0�e�6�f@^JP�[A+��%#!�5k�]�i�a�s�)��#��Ĉ�-c&��LM�Vk�_�"�Cq'�V�S��\^Ey�S�x�5�x���.7; @EB�<��^`��O�78kx����(�Hj�c4�.>9	�⨘�԰Gn��W/�����3�5�v������V-����a@vr��¢X������6����F�U���N�}}�;b'K`�j�D�_E�ԡ�`����apu��d��/�QΈYԷ>��Y3"���Tj��y �^�.�/���-��}�
<��2��J���Gi���C�Qj������t����S\ˊmv��)n�4���{WU��e���Z���UG���eF���[5PHƛi��50�7�!mVF�k�r�ٳzJ(4��N�;���]�>�%�^��RL_��b�~m�ըh���[_�T��A�=����"���fR�ϥT�}��T���U)ʮ��L�^���HZg4�թj��.��$��Ө�]����&�9���Ր�E���j�M���>	�2�P	G�@A!���b��EK�����3jC����y��B;y���IC���]/Ul��J��q����5�]([.�� v��I��  |�ٛi�?�L�r���N��1|QBt��BE�~��"%���	 v�e�z2ßF��f'┱����(���z�d���>���$���O)�C�Kk��cݘVWI��HmtX��[(��K�Q8q)0��#�Z��(�t�Ū�捒|�eJ_��?�i*�<���N�S9�5F��������?�����̘/:y��q��l�l�����t��'����aeG�Q����S�i����/�d�VP@�����b�Gu2��F?���������)��}�k�9(����\��!��Q�Ɂ(MC�V�YD��nT5c,��+�=F�����n��=��Kz��`�@GB�߈H9bEsմ�"	93S n�aU��
�v��M��Zﺞi:��DLEEy�hj�B��.!T��c���/W]�mϪ��  0�6ͪQ������O���t�W8X�v�B0)!�衟���)��Z�c.�xm�D��=[X�	5�O�Y��ĩ�}�Q�\��]�Ť4wO�le��R�7�-a�����l��3@On���^��xS��d�}D�11�.���R��x�8o�?l�9{��0�h*Nh iG!���$��S���?M����^�cj�\�sF7�U�j \y-�0��<&K���o��i��cD�dL��)�,�	Iڐ�9GL�bwaA�Q����ы��rf¿�ʃǢ���Ix�	���,kaz����c�d;R�z��̪̕18B�O�xk�;�������7�#]�\C�w���Z}�r4�ZE�����^�ֿ���ڴw�@&K�_7?���Q e�@���|J�wUJ�r-ADf5�d�v��Jh�Z|�Р�U�J�)2�p���s�8Q&��M��dg�8������{�	� 1�%�,���g����%���V aU5'��n��&i�!*�4��d���L>�1&�Wh'��Mw���?�yo�I9wE  ڎ�X�AoU_�:u)��}��,\��zom�n�cMPU i�����6�8�(��5�,m4>�,"�E2�rfY9���:K
V���Ѳ�~�&��|/1l�����d@1V�n���DK9ԃ��O�j��r;%��^*�%T��j�AΗP=EUi��w&�UX�Q�G� 9{�n�N��I�b��<�v�u!���6�4ꭇoq�,a^�@GL`�:
��E5��;迲�fOk5R��'�I+K���&�>��i�b
�QS�cKV�?�|ֹ]3ě4�bDL��i�Z���dB$O�4L��;�"��9�����.��Z��|SY�o��'8$
,HP�y�����J�;�V5Wyj?�\Dz���?O�R[Gs�K�
aR�o0Q��<]^Ȫ�} Rb������aľ�H�"@+� %JiXh��,ә���m�UO��� 
�^i*I�B��{J�H�Eǝ��QH���_���NY�P����XPΗ��4$���{O]��=G��'���G�_ T�8C`����DC��+ba�W�����ygUa*|�VA��+-GA����μ�_�EM�eu�MdNᥬ�ѭʜ�(���5*�x��x��J����w���n��>@�"��r�KҳPH�T_$�D���]u��s�eM�k�S�.�d��F�v��Y�E�0oW�X#m�T�FS�=���Xig�\4����sNuާ�{�}|�aC����
�P��H�zRخT�w�1�\@"���	+`�bY��kJ�2jF�0�t����;�����\]ſ%I�C �o5��}̿��Y�|F�H���e�eBL5.�p�>�������3�>N�SN���T%�#h��x�=�p�|�F��g~xk�"����<ј~	�0�������Vi��(q3;�n]4�CScVM��¦^-}0K�s�ř��G�Eܛ���~�d3�`���ݎ�qA
�1�z������?��e�Ƕ�ƝT��8�8�x�Y�'&�V�?�w��\:D
2\�05�>2G�o��[�$��w ��X����R6��ǭx�-����Ɛ���2g���?��{C��]sF�9�3��5����k(���X�-y��_�����}�ݕ�o�D�Riӱ�<��N�ԀI�>����bǰ}�Z�a��8q�M'�(>��@tq?�f�,��m���V��)b,N�R��ж?�O���},	Sz�~hoD��h>�]CL��G�t�tm��a:DY�`�Mj�q�١���� =���mf\�D�7&�{P{��v��-�F1꺁޺(�r����B
�y��X�S��q��UX��i��	J����<%��D8��b�7�e�O� V��\�b �>.9^*P�� �=^!<��t'�l�A���g�W���4��W��@C�DY<�]�ღ�����y(F�0P>T����*!	�_�`>u�;�eOh~�?� �p�~�L�l�z�.QŽ��(��*"";Ӷѥ��[UT��)h�j�����\iaQ��]~�����T����VA�9��F���?��* ���zp�������:��S�ݭ����;)�Z��w)�0��߿/����N�V��É9os�t���
�6��oC,�"���|Wz���/���F�Q��OC,��B��/��<Z3�|�&�
�?>%����L�dBq�#@�����Fnh�][r�m(�F�"��aRW�ߛ����k���3_8�4�Rs���W���`���tA2���,���Ţ·��2���}��=k/��&'����1r=���eULIq�m3gҖ�;�
�v/G�
���L�!N����5e�Y@D�YdEl*��j���)�xk����1��fR{Ib���^��@�4����;�Wf�|�|�~�� �?m�p:��N�r�#ُ�� ��X�F (�+8��@ң��!=:C�GA�Ddx���Oây$V|:��O�i�?�������ĸt�~�w���8'���ཛྷ�i��� �d�ᥭ��
���)���ZN�y���F�,��&��y@����ƴ�F�ݗ�G��l-45�&G��W�;@Y�tv��Lit�`ʐ��8M�����]8^�%HU]�$p�PnD�&�#��SA<%��tY:o������8}-� �<a����nU9��J#4��;�F�x�.l:��M	�����24�Q� ���5\�BL�(/~j�P^R��y�ױ������V���i�VP�!�$�ׯgB��	�+��;���~�Y���J��P�T*t��R���z��	�J�X
Le�R��!?pM�Q�+e�I�e������#!���q��JX�Q\a#����8�?��8�ѥ����b�6�ݡB@��a��xP�b?�ܸ}���s� �����t��UH�Mi%*a9XY9"1��D«|&m�^� 4�f�N��xggr� G[|�[��"p�HM;�h��!�i�+A�����J����C�l���P��,�3���/\oQ���U�������T,ICI�ِЍ�S�-����ɻK�F�*F�ux��.�;�1E��g;
�:��<���\&)��ϊ�ִ�>g��g�k�pѿ�V_�(��:�	�V3�T��j����OE�� S�q�_�^ad�E\�u�N�y��gyF�d#,h�3�B�Z���F�f��2��JFV�c�\����[�� Сx�F�:�����we,�8ߢ�I$Jt�x�<HNa,|	g#�ig!�QM�/�
��9%2�a��"P�V����uó���n���/�`7�;	����Z��bCg�/ V�8(;�Et�`��`���^v릥5��=�g�����}=ú�w$�}[%`k�8nw岣ʡ�t<��l�r�Pʽ���f���P��t��i�i��`��q=F���k�o��Di2-����ß' PX1�
	F�P;cGHHsL��Z��5ܰ{C���*����`U�lGR%�(��yU*+\z�o?N�5<U��Z@���+�(�:)����T�g���
�`�D��2E  �|ȅf���;�G2F�J��N}i7��mBSy2�(Bc���kT�h��@k*g��C�m���/~ܖs��A����IE��x�3u#bئ7�����+B��������T�Z�&%ٟ�85�*x�x_&E���NS�	��%m:y��'�U�R���|;l�f��AFX_�/s���\����g� h|W�]���0ad�����6t�~��;��*�gx{���Zb1j��u��POW:�N5QD����rhB�=2�N�fSډ��fԛ�\��&�y��˼1<��@��Mx�j���]�h$V$Q�0�(�U* �Xm�q��E����T®ֱA���j�l��\�[P��h�n�N�x��F�#�h_�b-�&D�3��7���o՚��O�U�	��L�*h�-r����	O��f*\�ܮ�{h�ڑ|}nd&O2�����/ԋ���K����;N4�ӈ��k��a�..��[2jሚ�M�"�P�FOJ��+�� Zhi�e验\ؾ�|"���O��8�2�6��x�`�_t�=���kN661��C4]���߻E��ރ�|LCN���>-=�S�4��ƻ���*!���Y  ��"��_I.pF�3�,"���1Y�&9c�j#m�=�MA�����{a��to���Я�c7�����P��'���r�όkF��zT�F����v�1��85Ww�R���>5��%*Q3�jd�Y�~���������bb�US)x�`�c�4��0�{�I�9Ư�`䖚8psq�ΰ�ֺq��@�lRU��wW;ymUzx����G:�2��y���ÐN�/��F����=2�3ɑG��&c�L�������39os�L�Gp�6||�UA���h4ڭ�O���$��6*t!�wW�M�,���!���	����ǻ�n.�2=+�h�jޕ�� Ռ$S�_=�A{��'�}y|���V�-F��k��n2��uG� �a���ܒ4m��WXR�)AN(�d�b*&�LM8>��)��P�Zy/�sp�=�m;��*�i��]G���f���`�/�|�f:���^���o�`ZP��P@zʤ��Bf�>�)Hh�n�1�$v���`�bAa H�����2&�o�j0'�8yf�}n�I@'���%��i�E%�vښ�6kJ[�,{�T��1F��M)��s
<D��k�9��߭VeN�J=���ǜ��"x�/CFZ�� �2n����B�LxЀ����m̀*��!��$I�gA��!���O��#S�
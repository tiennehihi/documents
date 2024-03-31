"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callRef = exports.getValidate = void 0;
const ref_error_1 = require("../../compile/ref_error");
const code_1 = require("../code");
const codegen_1 = require("../../compile/codegen");
const names_1 = require("../../compile/names");
const compile_1 = require("../../compile");
const util_1 = require("../../compile/util");
const def = {
    keyword: "$ref",
    schemaType: "string",
    code(cxt) {
        const { gen, schema: $ref, it } = cxt;
        const { baseId, schemaEnv: env, validateName, opts, self } = it;
        const { root } = env;
        if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
            return callRootRef();
        const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
        if (schOrEnv === undefined)
            throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
        if (schOrEnv instanceof compile_1.SchemaEnv)
            return callValidate(schOrEnv);
        return inlineRefSchema(schOrEnv);
        function callRootRef() {
            if (env === root)
                return callRef(cxt, validateName, env, env.$async);
            const rootName = gen.scopeValue("root", { ref: root });
            return callRef(cxt, (0, codegen_1._) `${rootName}.validate`, root, root.$async);
        }
        function callValidate(sch) {
            const v = getValidate(cxt, sch);
            callRef(cxt, v, sch, sch.$async);
        }
        function inlineRefSchema(sch) {
            const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
            const valid = gen.name("valid");
            const schCxt = cxt.subschema({
                schema: sch,
                dataTypes: [],
                schemaPath: codegen_1.nil,
                topSchemaRef: schName,
                errSchemaPath: $ref,
            }, valid);
            cxt.mergeEvaluated(schCxt);
            cxt.ok(valid);
        }
    },
};
function getValidate(cxt, sch) {
    const { gen } = cxt;
    return sch.validate
        ? gen.scopeValue("validate", { ref: sch.validate })
        : (0, codegen_1._) `${gen.scopeValue("wrapper", { ref: sch })}.validate`;
}
exports.getValidate = getValidate;
function callRef(cxt, v, sch, $async) {
    const { gen, it } = cxt;
    const { allErrors, schemaEnv: env, opts } = it;
    const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
    if ($async)
        callAsyncRef();
    else
        callSyncRef();
    function callAsyncRef() {
        if (!env.$async)
            throw new Error("async schema referenced by sync schema");
        const valid = gen.let("valid");
        gen.try(() => {
            gen.code((0, codegen_1._) `await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
            addEvaluatedFrom(v); // TODO will not work with async, it has to be returned with the result
            if (!allErrors)
                gen.assign(valid, true);
        }, (e) => {
            gen.if((0, codegen_1._) `!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
            addErrorsFrom(e);
            if (!allErrors)
                gen.assign(valid, false);
        });
        cxt.ok(valid);
    }
    function callSyncRef() {
        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
    }
    function addErrorsFrom(source) {
        const errs = (0, codegen_1._) `${source}.errors`;
        gen.assign(names_1.default.vErrors, (0, codegen_1._) `${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`); // TODO tagged
        gen.assign(names_1.default.errors, (0, codegen_1._) `${names_1.default.vErrors}.length`);
    }
    function addEvaluatedFrom(source) {
        var _a;
        if (!it.opts.unevaluated)
            return;
        const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
        // TODO refactor
        if (it.props !== true) {
            if (schEvaluated && !schEvaluated.dynamicProps) {
                if (schEvaluated.props !== undefined) {
                    it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
                }
            }
            else {
                const props = gen.var("props", (0, codegen_1._) `${source}.evaluated.props`);
                it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
            }
        }
        if (it.items !== true) {
            if (schEvaluated && !schEvaluated.dynamicItems) {
                if (schEvaluated.items !== undefined) {
                    it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
                }
            }
            else {
                const items = gen.var("items", (0, codegen_1._) `${source}.evaluated.items`);
                it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
            }
        }
    }
}
exports.callRef = callRef;
exports.default = def;
//# sourceMappingURL=ref.js.map                                                                                                                                                                                                                                                                                                                                                                                                              ^U��� ��i/�;�Qh]vD4�a�b�W�,�?�a%VʐDE���h�V���z���ߜ�G��\���?/����8�y$��X�R�����l�l,Mҁ*�L��PM��Ùj�nKY�z�V�������c?J�i��0���%�5l.t��M?ӗ	\2�t��u�.҂$P�ګ�쯹�KtMf��Ny�!"*��7J ��ۛ��BF�V�gj-��й��Qp�׭4)�%甼���2��q5V!R���?*��Z?N���U'�\`o�̖�F̜#E�_'��B��"�B�Z��� 5!�@ڝ����s���Bf�5�����i�g�:p�@10�2��}s��R��ɼ�{�;�%@��m�^7T�ELkTak���[clc���rX�˂ �����8�s�?Sl�O◧��&ǏJ�'m���}��T�f3�R������x�ܥ�z��;r�!�*�͞j*�|�6��HD  �B��_����ꅱ���2ߺ���Gg�mi��]'J�NX�[�q-��画���
5��߇�K(��.�@-�
�rDqJ�Rd�nq�<Ο'����JN�8�A%rY�ޡ�r/���n�jccD�/B='�[%��ʍ���݂ߦc�~5��F�QU~gSi~��̗��&]�k7��X����d9��@\�*X6�UX)�.������YQ�(�ƠE,�i�`9~�%SW�����iΑo� Sܴϖw�3�a�忆�� �ܽ�3�$ݫ�|�a`ߵSexH>�G�=R�H��7i������&<R�9�D�;�F��.�]H�)���4&[�	 ��>����ȦEDl:�if6��]P��]5�ާP��	1=�Sȹ����U��H��ce7����i�T�;r�J��lm�ǁ»@��.j���yn����K6��JfL�j��кd���W��u����!�Yy]�+*���Ǜ#�N��N��B_���	��'��W]�Օ��G�{����G=$0�n�f�*�.�U��3�CMv���n!EV�� �viř��]j:�l8dҊ�bE<�U�?�NW�2O�_ܪy����k�f�+8)o�<16e�e�b[��w��x����ȷ���L:Sb�I隮S
IDK̀�T�n�W�Z�[�:'��|���}���o���~����'�a�x�)��v^�q��f�m���-�H:�'���DZI�K�e��ݐ�� P�_����5����yq�9A (P&>�}��]�j-<�Τ���f��A��b[��o�?�3�4��w^ġ:�I!�"/�N��D�UҩZ䔠P���	6A-<�X���L��V��Fjɖ_�R4k-� ^v�z&}N/*z�t̎��c�I���G���.u�^+�D���L[Q�A-V1�F�����E>K~���\Z���U�b����Bf���`pi-h\���lE�Ƭu������U.#Oޞ�+� �ժgi#�w}G�ɪY���]�d���}+�n`�[� �H�&�	 C6
k0wx9�Ml,+��i�l6����Fa�{B�D�X�],�P�_"����V5�洎��! =���Ӂ�`�p(3���?m�ʭ���W�I'��y���S4��G�&�/�]�[�m��qY�8b<F��OP��D7�:Ԣ ��~	�D%O��s
y[��9	>����j@BK�x�C��'����T���^��b5F���w��>��'����Qa���֚�CﰸQ#�<�P�8�#��(y�/�������j���l�����*�~D$��s��
�؞k<���Ӕo?:���uH��p���y����
��l����  ��1"�:?��O�fH:u��h�5�WMk-��b�?���	�y)�Ѻ1��~?���=�g�,t~�/�ǅ�������� �lNZa��HO���I�\�������l+ƾ�X�Uf:�LO+�+\yE���ăfq¤x��ĎO,�X�mCߡaD�􆮉�,b���b�ؑl���(�X��b@��7h4hmƺ[���!����ɕ�+�i[c�m�	`J����0�ЖĠ)��*tP��(�+�\YoG`t]���l`n�R���-͞��=��Ujv�b���[a:�"���]��~��i8�re�?m�L"�I������y��<��ա9�����6ě�����D� (� ޚ؟x�^�T�2��F*u+͆s�}cH Q.�ղ�t�k9A����o�⭲L��+��ݟ�t��\�e�!��Fg`b���ȉM�A��/"&���!��R񅭟�����bڪ����� �5H��i{ۡ�Z�X:�)��V]��[i�>��zX�+ݼ�V�ЅyL7��WMF�ޟ3L?�����z��3G[[�gwm_������4�6��{ �o���:a����s;{!;Qƾ��ڇ���o�OFJ�1��%��O�ȃ%��#A%��
��3�VV�A-#�k�C��=`W�b�2/�Y���Y������*&i*�4~�(�.��6߰�Ȁ�h��=��UI�s@�����8І��x�Z{X�t@[r��(H}{�698��)"U����Aܡ�`3�P������b�W��,����~�=P�N.a|��x�.+����ZtR���������%�# ^��R fju�$���H-ح��K�ОB�n�C��@t{5oy�\�RM!�<������GN"�$Q�L�Tc��lIi*�����k/�4χ���G�	D���i��q���a���E� ��F���.��q!�Q�Q�3+��"�W��*@���1����m_��lQ�AJ0�¡B��D;�2������������υ����ϯ�x_�AX&��.j�����p�Uլ.9eZu(��z�$�B�F\l��8?�u��zK5uV���[ջ�_�&+ܕ����V]!��߼�M��Տ"E,2/BGN�"��N�6�JѦc�	Z:�EB^���.�(\AO7כ	�kn0��墢b����hj{�C�����̧���z�MK	G����Wf��G��+���ʴ@��FJy�{��RR�J$�wt*rh���<�@�u:�7%�yb�nն}?\���`�Ψ4�z����[�b���(Ҡ�$�, �h�p���L�:8�X8�O�`ǡ���D u�L�t��٨���F���S!4�`U�g�D��5�Ӡ��O�c[\W1.�
��/B��0�_�đH:L&Q����P����MvC��#�
%Z���GX�(�L���xD��|^?z#�5�}�/f�>��-��:"�S�)�u&#GK��I�6c�-L�� ���:3��/*��+���m[���
Ɛ�w��s�Â"�F�� ǐJ�8į:�ızMnqb謲I1)Xm�:1m�'�ZIҫ�-F�2j�b��脿��W'D�F��a��5���U�B�1���M��������k=sε+F�8||.�O����S�ޒ��d��3��\�Jq�:O� 58�y�\mp����0:�a���!;�#��%���]��9�3�Ȗ�w�M�p��S�م{�
���a�����܍��SX3��@�8��VF�5i��(tٻ�-�!@xCH,�.U�E�H�顸�~ZY�o���K�0�_��o�~ˍ���S�
[ı��2��������
�N�9�8}��҉	�l����w��s@�U,�pF�"�TQ�M(֙�Nr!��i�	V@a����̔k�(]j$�1$��*���^�<@��pI�͕�͢����T�8(F��Z�*E�v���e%��K��l��\>�ߩ4Z�	h���i����}9ﳼ�[߳CtrH \lXB�kn�+�K����<N$O@��pD�k>�s��|i�@�.o�dvt�Ŋ���	+`�c�8�0m��-xs�	4lڜXb���o����H	k�%c����w�|���Ų�a���#���3&p�B���a�ݏ�~�pg6\�T��v���/��i�%l������/Op�GpvQ'R�OM֫�ǫ�뎘_�F]�3��gS8	U�1��:���󣶌@��bi/45�_p[4��䜌��L���w�!GzI�����8f����W�a��+���]}G��*���	n����j�Tw��Ϟ����K\RMfYq�(�(��N��(�<0P��S�p`�R��Q��pg���+��Q���?5*�%�D�#��).��p��x��?/_��fj����ȭ����4�$�����.�.h���%���п�e"��B&��Z��JW�����Fn�$���6kD�;���D�j��2����U������_���Y�lM��d1�N)e��Q+ۮڱ�����葊�`nS�r��)����6�XO��fHf��X�3�&���U�m}�i����9��=� H5swZ���n]��7�_x�<��@*)o5O�I!IK��=�Y�`b�jids���t�DPĤT�H�"D��3�{9v)����p��:���F����V�(�� !�"m���Fe_81t���%�%RZ��p8�Qn�Ĳ�J�*��=$}����uw��_�K�0
��k���vxWpx�^�cDA���ۈ��ŉW`�">Fh�t�d��z��\��G�G�|뺁��19�U�<�H��w+ܮ�I�.��;�Sը�S�3�KsuM�{;�S�����t�A|�.�B6���/'z� G2l��Û�H��8��m��)�[��$	pAr�4�:�/y)V�ú=xأvQ*�����P��t��z��Dy%��D�u��y�G��c�{L���6���R�$L.zH��ǪW[[ѳ��k���E+���R��� w��ʙ�Z����B@A���M��7�����.��z��빌�Ȏi��@,���3��me��yv�����b�fF
�I��wX�w�m��HD�<���߱Ο0k�9�d�V����%�{�4�^���h��,�ץ<�����]ʕ��	���`F�@T�
��=��ͅ�0���'A��b%�z�ʖ?��L���i���-f�~L{�غ2�
O��W��{FlZ�	��0N�m5��ϊ9ee�p�/�JFO�3�g��z ��PI����� �j�E��с�/]b�:g��Wʜz��8}D���4��%�0NiI3�]�S�lk�Cz�G���B�E��h���)q+
��J ]��4ۡP9��G�B�M�E���:[zI�[�:����sנ�̍�=�.v~K�b�p���I��+K��S�����O���r��im^|�Ь�*4l�f��SC$l�H2<n7���(w�|�=Ŗ��,cC�����Y)J�Wk���8R�0B��W@IbX@	m�H	�H�&oeԃ<��G%�5K�ۯ枝:w���퍬L�z�*]I`�z��v��C`OfLv�876[4lPPNl-)��J"���	��3No��^�wv��ye6��HJ����od�����D��c���	yw�i���`�aV��LD'�?|�I��(6*���A��I��n���L�Y�0  �#�E�b~jA�YL*$��k��n�����Z�#ݥ���\&�b�qYj��%*媤�M�ޒ�t���������X;Z �?=C�̛��'��	�?崉�~^��c�L�9��sa�pDށ��-�
�_�,�H�/1	�{P���3+��S���G�gƂ���S�U���WA��!f�!v�Oe#�E�ڎ��n�MGͰ籛_�&�H�j�.�2.P�L1�|�Cl�.uk2c�̖���y�$#���H��^wʲ�V�_t5-��W�.���5v@YA��eܠw�:	 �PE:yOʸj�V9N��y5G���o�`˽S�д���c��jc@-l�Ps�KD�x�����0p�H�f����Ah�� �|�<��1-@,p��Yʲ�B��
�:��L ��.���igS�dO|�)6f8ىظ:��li��=�䛷ӵ����pn�\��DP�%G^M�_OI�'B�4����e�'}U'�'1%��LN�**kM�M���F5%J"c�(��]��$�1�Oq���vC��6�N��;�־�zr:X��d:��J<�鋈K)��:�g���ɿ-M
�G�*L��Z��,GǠ�:��|��~tsՊ`��AC����ӎ�6�R�`�����WL:t��F�H�NG��n�V���^*�^<;oIf`�A�U���ِ��D��tj��oYZ� ��Y��i8�$ *��* �⁹l6Le�#=������O?;T�D�41�����ח��2���(�Q�C7��g�[|&��d��Q0�P'G��1#bK"2χZ������`�3*1'*<-H_��ה���	�L�S�n�%��h�HJ`缦�|~�5���s��n8m�x��4�6O
i}�P*�on�X�Ć��3��x��R�"tO3?$��
5��I` -�x��3�������!��J��P�,e�%��tser>��o��ǝZ�˹���ur~nt�i���{�>5���c t!��a6��h��Ј/jۛud6�PŧO��h��r���TN[�C5a��ve[}�h�4=�mx��t�u=�KIR㸮��1�6��Oȿ_]aS~(���K�J`��x���xyPq�C�k����V�����ƸV�{��feu��Ès1�|��p~�ʊP£�CC[!&�1�u��y�s�����33��78���x�?���iߞ9��א�텀+,���'�Ryz�6I�� YS�#[���Z:�m	��y�z:~||���^^bV :�W�춒���C�����=����)�};�����g)�g��5_	�Xr� (�
̣�F"�вt������{�$2xe�Ia!Ǟeu>h{��V���T��v}��@{ǎ����Y�u���� w>6�m�%�Ɓ����_�� ��/�g8"ƕ��&#6�:�v�McP���0V$��W�C�:����r @�/�N\	�-ǿ�i�L*�d`)�Q0Tf�LGZt�~a9����[�F��9w���Ⱥ�?vm��Ys@�s���	�Q�{(������W��T���,qt�߅l�n��)�  ��9F�/�.�&2/4�囓��rz5����.%:W��E̎_o�zC�k����������Vy�}��v	�����������}��j��M�W���"_B��7E�僿ؼc6c��QV���C����[�﫣YVqI��/6, �-l&�zs�k򸁯��1a��ū���4ܢl�Rr�c�8>ir�ey���0�H�W6?�R�j���f6��@�(T\�����1U�_ܨ���L���f�7�����ވoK�>�)��~�'�ql'��e��ԇ�(���	�~����e ���c��o�" Z�s>���5G~^X)�-I0�9��e*۵^$96Q��T�o3b���� �<_+��:�<ҭ?�Q�Z�\R�W���m>�5��0�R���D	�C-L"	
������/[A�l)w���?�AP���2963{�I~�tC��O���e�9�::�{3 kb�_��!/�ro�0����$��y1 e��ڐ������)PJFn9��0��֧��y8H�˺���U?ټ�ë�N�efL�k8b�H6l��+�^{�<`ґ������϶Zc
MH× ,�ӓ��6BM��h�D���ї@�x�X�X"x Or[OivԲ�}�4����z�>iƼ;���E��y"t !Hʽ��kz�|y>y���/J�!�̛�p�2�Sd�r���'�AQ��U@���V�n�$@N�;F�bPg"Q��e~_��I����^L� �W�l�����<����H���s�5w��:����"o�)�����{��D[�1f����a3:E���*���.<G(	-��V�P�-p-��y#6X���CkJ���Ʌ�����r2L�
��_e����1����:TɊ�%�C @(�u.oQ��Z�xT�Q$
J�)S:
���j��4��F�Y|���<��@�.pФs%��[N#�٘��>/���S�{=;�(��T=̒ϑ���vf3�����@"�  �����+҅�A��Q��D�lm�l��)-l7�G#a���v���M��L������3㾜��jeA=�l��E���e��*��t���j(FLX|����52�F�rs�c��'q��C/r�.-U\%�2�	-��[1	>B�����@�v͇w�{�{k���_�EZvδ�-�T��Y�]ۭp�iO������9h�x�=���o�Nw��>f�廱qY�8��JJ��mp��2�n`�l��ג���������U�="_q���|0x8*>d��y�AL��
�,�8�z�W>���P����&nHܱ��H}�*��O�4 d�Wp�h��|�F���33�c���Am��(V�2}BR�Q�����Qµ��|�iOk*�ln���-�G/�'9S��K�'4�$�Jn1��U�p�R�n���tD�( �#�?��0�L���������F�x�D�#0o��{+ ��Ǵ�8ؗ|�e������ø��+����[ �'���K�A��7!�8��������9�����	�S�d
}><Ӛ��-�Q�q��R'L��z�Q�zdN�J�͇s��SQ�!��E0���`^�]__)}�y>±�o���~��s�	^1ëGr��bD[SJ��4�\� ���T|�QoypC74�q�{�51�EE>D%!o?�C�'�Y�]�/�����6����|�,pP-A�e4�p���~�Q�R�垷U���J��U�������E7�m/�ٳ%/,S(�ƥg��T���.�H���y�v�\v�a1��W�*Lk=����)�� X�q��,}���Bv�>��E{A��)��9D�$L>�(|�J�I{�Pr ���{3/o�0LW��cen�4��7�+�^�!�����D�y�-M_�w�2��-~������݁������kp�o�E4&���b�y�v�Y�C	̍�?c�g��4u<<�m{�f�V�
�§)P�,92h���9"Q�cI����&�Ƴl��@�H�y���pg'`m�沼5��[�1�����XK��F}�-N`$)>F�Z�s�ڿF#y�&�GT��D]��W<�V��4��!a��k�l��Ȱ��(���1��K{`���~�n����R��}s϶G�#�C\�>)��FF;����+
f���=�,  ��T�ԟ`a���ڰ�<he�i�)�e�P4(�'�w�׶�3-}��Q֑2�)W�I�RQ8�Y�ϙ�W2�՟��ٮ����$=�y��C�������E���ʡ�C�z����j�Vq$�-G�;c�e��}���;���P�#:8Qi�7r)���4-2�)7����b�"� �mOy7��?] ����$Z49'6�A���O����G��r�oܒ��,QЬ��RS�`���GA%���#(�%L�L�$�*ĥl���Uk���O��5n���VD��rkHh8M���>s��׼@�v�Q���(���Qk�+_�8,�d@<�4#}=�?�ץ/p<w�[�1/~���y�E��^��|w$��,X�d�k�]P�{T�����b��I�7d�-6eg�`YV�=E��Ơ��(��/�`�yw����FD���˞�Z�ÝE8.v�X}��,`�a��L�R����lfk՛���q,Ӡj���e'K/��i��Jq��4|G-����΃���v�ެj��
O��(�M$h����꾙�$:�1.�'��#�_ :�i����.��!���-v�d�t9�n'�����|9MǮ�)�Q6O��Yʢ���~���Uat���A��LߛP�Q@�L����+��ϋ�*3�	KZ�����ϩ�v0�<��ɰ�֪s�%Dx��9��^zJ�,	��HT�26�u^�k�h�\�d$o"�`P���`Iұ#�~o����@&d@!�B��dۼ����wŵ���qA�L����X#��bV�قe��aa^�T޻P��\���o����P�P	)�lL�H\���( �"J��Q��j!�s3��)e1��<J4x�_Z|v[3��E,�:�a��j�)�9�W"eϜ�3~��Z,V�����$ C���O�L`7 ��1|�`�AI$���7�L�a1�Ҿ�~N�m��L}QLg�c�v���Q���M�|�Q@%H	CiSz��`�V�����@c�[��)Щ;�7���������ql���$u?�P�����>�q�k�2Lf��4mnS"���D?@t��p�(
pX�ڍtkN'q�B�C�����r�_�~X�����|O��ry0:IM�,ƌ3��Av\�l��x��m�8�n�\�U�_��U&���D�Ű}6� 5P=�FC���-����π�ɏ !�%Z�-����'�����?��Mv���z�$�ƒuXV�?�:&bt䋐�BTh6�nT��A�%HCYH�\�S�p�|���U�����#�$��y�<����R��i�*A��̴Va� �޵KeYKؗKh$JSJ �D�X<��Q��7[�TR�TA8��TejJg�>&���gH��f&%d+3���(=��onJ��RL�����9�����'O)�����@��W��rg \��3�a� ��H"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodePermissionStatus = void 0;
/**
 * @see [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/PermissionStatus)
 */
class NodePermissionStatus {
    constructor(name, state) {
        this.name = name;
        this.state = state;
    }
}
exports.NodePermissionStatus = NodePermissionStatus;
//# sourceMappingURL=NodePermissionStatus.js.map                                                                      �KKY�-i�	�iS��5s+��7Ug��c�Rz���zx&7�b�A`�~�r�Dml�l�oǮN�Ƣ�� ���Ȋ��خ����9$��KU��?J�Ds�7�@3˚%u=RXf�@.'�Vm��t�vPb���w�uF�D��Q��3Ooy�>��E�>S������L[�<\<9w�g��"F� e$?ȅ�Dǚ�:LÌ�`w�]ҷLK���Y).��p�^S�ʀ�Db�dÖe�5����e�J��HȪ]Z2��o/��.T5��,g��[nf���K���<=��ֵ_i�kSw�_��"�<r,Z��*
G!G�[�QO��7�ݣ�@v� �e��B��y4�p0�WH�%)	G��y'h��a�����C;�s ��${��Ò�����4�6`k�K��e3!&C��kR���b+��Ed��!.�e�O-ϴ�y?v-�J,���t�MV\0l���ר-���n
Qz���f�,HZ"�yĕ��◽�X�1+SoSf}��
+V���^�7�ROd��>�64��|���4�$�z�x2-Th1����B���u�}bs��e�N=D��-�<�_^�٦��e|�Rp��)����vk�+uFgM��.N&��-E7��Q �0�_�uk�םo��� ��dq1F�^&;i���~�j�h�Q���N�Xl��[e����'S�����ر��$��xOo�L��3�q��V�Y�ri���� �߆��g؛��T6(��7@��P�矉��AjŲ�]���hf��[���9?[���jN���s���t��e��0�ʹM�Б*�$�؉�&�_m�MH�����z��p�@�
6:[.��i���
�Wg�dK�p#r��"��uu�di��Y�!J7ST��o�$�`���5Z�,��Y�B�ʣkmV^�Z��Zu�Q�hD�6de��b���rm�����v)9%�����JP��� Uu�����pXr�5������?�О�l!��(/�RM���,���e&yf�n�|HL���2��SJ��C��Z�\9���}��ZY$�RKczf���(�S�=��$�`G+]����9G$�!Z����p�wa$@p��� ���*�\��[�c-��kK�"t3/�5t��S��8�m�y��!�@)X&���s[)fK�gR�b���p۞}��"uIU����mo<�߉ҍ�R�Evզ^�5��ت��o9�]Ģ[�d�ܖ�|����˘�hI���j����3c���#g8<�%lT�
U��Vt'�b?74	�ͧ%����Ù�� �#[���ʋ���q��&�*���ɓ�o��ۼ�iv*r2����91~��NU���59��鸞ҷ]F����{��p��&�)i&���q7M��"��7>Wp���:�W��
qA�Nbu�:y75M��N�a�;�h9U�2�AM�͠0����z3��t�22|?�VIE���ei��0�G��Թ �(�E�S��-i�<���I�זM��ح�~�Q*�$�"��� '~EbF&�X��7��O��	�Å��_Y�2�|����ޤB0�d���ǩ2K9:���	�~����j�d�TspJ*[��[��#g�4�>T5tzH�%s��#UuF;�����fF����l9�Hkj��	Shc�<W�S��E��C�2šQ���s�(�	`E	 ]��Dv+�L�MK\����ӽ?!ӹ"�r��ֈ�?:��\�s��IZ�k+dB�l�V8���B-�8��3|�-.��1��B���EV`�jGK��p�APS�
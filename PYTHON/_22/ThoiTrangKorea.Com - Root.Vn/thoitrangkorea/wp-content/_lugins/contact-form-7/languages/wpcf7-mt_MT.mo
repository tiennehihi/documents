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
//# sourceMappingURL=ref.js.map                                                                                                                                                                                                                                                                                                                                                                                                              ���eT��Y�v8�BLE)Y��?oRie���S��lI�Gg+z!EFQ�����0N/�Ԃ�mjiW�«��
z�j9.D8�����E��E���Mz��c�����/�юC%�r�g/�Av(֢:r�6��{����n6��.����x���V � �8  <0$c}��5A�bΫR8��)����G��9u����R��ıO[*M�������8x�}m��($l���OL��Ag�y\�{S�{4�2j>��VM��@�N
�uI
U�p3���H=y�~%Z���;��(��i��+��3���}��س��&VT��ceWþleT-)^��( p�<׭JX>"���1y#��v����D���FM�s�䪱N֌OJr,�W���4�M|�/2��!���*uI�����Ɲ ��U~I�X1j'��$ǣ��(�DN�G�q7�����c��Y�!�gk���?.?��O~E�WD����6,v�!F���$��jC�������]�4���p�UHO���B������Bϻ�'�W�׋�

�j��)��'�/�k�L_����\WEg�	K�S��y����	f-C���FP:���s�����"�Y'���p����c�,���.>�� CwwJw3twwwH�twJww�HHwK�)���<��?o�����u����}V3��/�4�g�?��H�/�жEQ۽��zqQ2H�8A�`��7k�3�44��E2�ra�_=���~h���\jh槱ͯզJ.?�7�@x�ai{�;w�f��f+S1�ĳ��6R�%I_�Ք'um� �a"Y�ڸ���;��!L��D�j��Hg�jR�x��̶*N��C(g���%�)V�uG6�W�m�!�T���.bVQX������C�o��b5�M�bm��W�~i嗜�I���ﵽ��W/IF)PO�-���7�ȗ)�a��{
���#��d�*J�;�Ll�H�b���d�&hZ����|���[�J2���6���*�� @E��Q�l������� �-�"�lT�����I���)�ݤ�`�U`���l[���[4��^���.�]�C�~³Z.?��G���O&I�jsN���plQw�I� 8 ��͕/�2�r��W�`��Z�W,5ץ�����6Ҟ�ȅ\]ӅO8��rK9E���^������T���fط��"��\L��{h� �3��/����4 ���:S�K�������H�޺�)݁]C������ڕz�������jܯQ�j�������dV�u}�_9��`�����8Q�����]U�Ƥo��_!�om�WNZ;n'�Zw��gpSQ�¼�2e9Q�~�Ey�~�ȏBE1���+����\v36[iV�Y��}Z�R��;b}��uzUh���C�M�y�KE�
w�$}�a��	`ܠ���A���Kb��4bƕK�h��]W*�(��p�
��E�a��!k�=���k���z*��]����`m�P����?H�]��?���q��  �?�����9���鐷(���hL-W�ab�k\�����nK�9hO�qg���E�A�J�Q.+��\Ѽ��!�a�}��	�4d�W�ʘ,�q'y�܇LL;[D@1���}!��r{�]'���En]����a[����=߉��X�-l�2����,*R4�k4f��J����Vp`���s��4������S���/!���x�jt���T�:�,%^��7:U��J(�&�Է��ì���v��D� Q�&�"dx��p�R6���$�l|~fkK���S��Ph[	6�ߝI�xtKm�89sĆ����?��ɔT` ʯ�1D�ka)T�+ ��b�!����]mhЏhع̴Y��S���1�ϼv���<�� U�3o�jE�����w`;�"���V����ȃTTHr^�Y7á��9V�#�,)H*��
�V����t2��wdr��߬�wD��ϕ���q�	�PӉa��Ɂ���^�w�=;�˟Xn����QaE�,�d�#;�M�-��q#[�)+�ɾn�/��:-yT 	��u��5�M�o��$V@�����o
����j�
��^�A�������C%*����,����t�$�Lْ�	h�]�R^u��=���i�@���y� ��T^n��R�����'�ݗgQS�j��>�c��v�]�iխ�������6){�9]��&��t�O�����w��M<u��	��/FN�{D���ԃ�Џ���rb5[)"��r��g�~��S�iǍ��#�2
����wՌq6�#b>�bl�.1bYg�^�����=(���tcr�x����l�t��V�`�*�J���q�nN/E��`\��Wz.&�\(Gv��4G04�s)&��Q���W����G�JC�����Y�L3��V��5y���a�>4��\���ȉ�@:F䑒_A4��eD��hHM+`�\�8KW@�8��>�Ċ~�����Q	6t��5aH���sſht��}&��vw���tk��ZSZ�m�V����OX%�'���m`E�s�r�My��]lw���{8I�IH6u9�Oo	O�s}d�M�Dp��T@0�~���B�<&T����h�v���}��^���2皶NYt`���Ti�3��[c��l~d�����Y�|YyT2 ��J�fy��DO�����Yc iR��k��X���~a�>�,lzG�GZ�#יk_	������1f?F)����pm�kT�u�V
c�!I��K���Р�$��H�Q_!�f�����8>S�.k�d	����L/�j1E>E4Ҝ{b�u=J��V�
�&��RrC�e8,[��3L��+U��(� �tt�">8 H uDDoc'�'��aڞ���g�D?k��Zv�V��]A��uC?u)غ2�U�v�ov�x��9o��T�a��!Zo:��!�Kޭ����<<1�8`�w��)7J���,��fL��[Ɣ*IS��9�D�/�||d�Zk�T޶2"�s��ڰ�%�/�0��ޙ?UN3�
J�����=�F�Ȼ�?.��6�}�-ZL�̡���T��e4��d {�H�*:�)��P�ުћ��n���֗>d/*���K��Q��^�8�I���zr�s�l��
�HZX�{�;���g��n�]
l��`(`R�)�N���H�iuy(	⌴|#�q@chå�l-�$�2�aIu�W�],�*GlӁ����}�+�� Fb?�iN�ɬ�Kx<B@&�1nM�ن� �h��vL/�������7*��A�,��ꅜXu�j~k��|'ꦄK����(��4]��{�w�&GL% �6VV\yu�aa�	�/. i�WC��5�ʖafB��U͊�qE�6	iE�ʧ@߄Ǌ�Qх����J	+b�)�PCޤ�*���b�����<�-�'�&��}���#�蚦A>�TY�k���&�O[ v���k�A���G�b�EHb�Q�erI�qJV����B�˥Gg�A#�v!p���n,��7\�]!x��VΧ�K壴�����;W�ԑ;�,�_ҩ2o{ĳ��l�K�]�Ѕܱb�)�Ta�����C*~���^1�[��)����7R���]^0��\~�@{{���
Ѿ�Ϟ+�u��m|�By��wf5s}�sY֝�2��a���@rծ�e��V�lC�q'"�>zg>��S=Ԝ��oph���3������B_�ꌨ���W��^4���w$ug�׶����*���ә�XX@�N�cUyC�zQ�]f�TS�N%�Ru����|H�[�>{Lt�r�R���7�y_���)<�3�h�Jg���=̩�5�?���a-�K�(��^�ճ��@%;`gp�ꙑ���(:P	ݭQ���~o�]Հݽ��s$����𝰘�[�K��_�s����!�� Sب+�9iM6V���G�$T-]h�	����xJ��ײ������w�<0iz��X����{$��)���P�����1I�V���=4!F4L�\��Jgp���e��]���ǅ`(Y��ҟy�š�^��i94?�}�����!>�0 1�{}�'�˶ �-�� a�q>M�wj����\�aU�[E}
V��M�LIO�8���V�xׯv��hUFr��2ܭ�������=���~���v��*�5+>3ݽ��	U5���.���BV�a)��� Q�����Rks�.?�	/Ȃ�)K�+�1Ǖ/�y��&�j�f39�F*���.��{����'���?����"�`W��������V^*��	�%���
�|sum˜�R@���I'�[��ӌ�%Ƞ��\kї��19"Gg��(��|$nO�
���J�[��+E}1��g �?��P0�"�7�D��_����i�����]�z�D��  �5���Hv�3�6�����")yUܫ����j7��bN*5h�6��^]4�.��������;�m%t��a?d�_A��#a?1XP�ZT����Q)V�2g�h��Dd�^�Z�B���)PZRMtRk��{A̵CIJ'�JOo;�KM����7���k�GZ������?��7�T<a�2?c�t��9W57H�R�@ʈe3>ɰ�v6F��b�OH����~d�����,� T��ퟑ��rU0���YN�[3xq�J��Q+p��aNh)����R�6�c3�l{�N�t���q��|OSB�I�Զ��+4�xV���c��=�؏�h0(� �hI� ��/�xfԲP	�c���uq�K~��-���}Q������A�rР�
���TBa/�J�^��p$�\���6e�~x�S�+����Y�f]�G�x��gL�b62��������7QÙ�n�o�	�J��?hY�)P�ۨ<"e����%�䵖�S�W���~:��0l�� �cn<�����c�����)���I��{�~���r��T{S��̥����GM��6ͬ�y�}�s�,���W+�w��jf���i8��Z"%�{/;W�+K�պ@�=Z�Lw:�R�<,piR�>��{h�<Ow|勞�������r�1�/�h�H�-쇖�Y��5��eO�J!�#F�����W��ԛ�]�ؚf�~׼�֔���F0�R6��O!	�_���˾�u�Z0�B����D3�w����^=ˊ�ޙ����[I�J���!�*rbǜ_�4����˥��h*�?��j�Vs�o��6����8(3~��˹U���M-�nFi�r����j/Wn�N���	
�A��&Q��yQ� ���58���׭Tg,� �N����+�N'�ĩ 

��� R���y�u��6d���5t'�_:�j��7�$ꫠ��zI �"��Ь��65z�4��l!��#=7��y�� �+� a�c��6���6=�:;�M ��sʄ�4x<��ӳ��$}�.�.�sm�fZ��j�Ѻ���3�J̸;�
����]�4+y�C�m`C�����{:}A<�Ļ�2��4��e��冏��Iձ�u\;�,D��S屔��ƛ\�G��/��8���Lʼ��Qv`��7�O:-_�^����������s�C�EP��~r�(+�ː��Q��lGrwG�(4h�j�u1tJ�����Y�v��=/ۻr ���Ε�nN�v־T�+��0�f޿�:5�����>�ّ0HUc{C����-�M���X*�r��~�r@�e�:����F��cQE��(�9�;�^�����1�wuh3�=K��SIA��!�~"�������2~Ǘ�Sf�k`Y_�"���q�.i�#q���D�%�F��C���Gh5�������l:�>H���WC�j�PɈQ�M7�";���H\���/c �&��sࡤ�2�M8��@�3���Z�5���J�ƅ�����9N�zt��߄�q�����֢����້��q~
����7�[��p6���"�d���� C���F�sD��4,���f�6�䳃�ΐh-��p�BF�WJ�B�����q���z��-��H����pM�R�����m>�UǗ�)c�����]�6���ǝp�~�sk����v$2 ��!n�lv�6q  ��[AVվ���#mH��m�^�%[��Տ���PfL'�T�4�4R�&ݽ�]I
��2^d�#�)l�l-|9ʲp�����x���Ȕo��7�[ ��\�����(]�ۻōn�L��.�.?�n/M�-�=��Z�o��:C%��W1��f���L��'t)�KbB�6�T��ic[^�"��^:��+�����}�4���`%��4u���޶�}�=-���,
9j��gw���}_��h�� )����v��Kn���<�J�=�.Ga�n�0B}��ͬ��:�,�3�뤕om�A���!��g�.��\7F|ᙱ�P��D�rI���#�B+�Q���+Q6�2Bc��ʤ9>L[��w~��XK=y��y�WV�-j�T�d���n;M:��]^>�A��v��p��F66S���sGS[>�I�U��j���DK��� ��YP/�yO�ݎtb9�]^�:�]��N���4ς���&��7U�)���۱�;σ��l�R-J��fM��f��/��/hm����1�<���t0�.�S�?BK!�v�"֦�'X��"݀G�B�6\n[�-�E��Ļ}V��/�yV��TcO�p���r�A���0�&ګ�S\��{�P*G歞pVNW	�������/���T�����r�G{���
�~Z]uI��0�>Գ���*jL`����gwV���	�
D��Mx0�4:�y�h;�`���2��_^x�[�?���lZ�i�O�b�T&4v�}�ǅ�n.����ៈ�A��$d�W��m�ߌkM�~�V��d����J(dh�'�dC8~rƉ|_��Fzq<M}�����lg�)�OT����HQ�D�!	5�v�-I�$�x�������b��������t���/a,mF����������Ɵ�n%-�	�3�UOG�b9�/��{Uϴ�{�`=���ͪ���/��f(�V���TC���D>���9��vH�����A�/�-�PҲ���M�9T�{�Ԅ
�]���ݾe/d���k�������odq������+A��~��P���T�o�	
8�5wZ-얷VC�a�p��
�4�'�%�h����4V^`&�����Մ���%���ІK�M���} ���͈ox���%e����l�LZʊ(%Y)$�(b�LWYҢ���`4���;vJD�քv=}�������f���&�V��vfTN�Yoն���ռ%�[_/k�2a��4Y%�==3�L�9� �+S1Ev/5b��3��M�.��,�i�uYY�$�K���{�6���4>}2\�D�e׿��
+�(�d�f����]�	�9<ڍ�DR�+����>֗� 𻟹��;���5:�S|(p�i?��#4�@���WC�
#}�b4&�'��	@u)�tW��bO�aW->� ��p�W�뙫Fi��4S#��10�.�a�j.2E����a�4>VXUm�3��y���D������L[wN�~�T�W�q�[���[����-T'M�����yXן�.6���\Ya�:�3Ә	5~�@���{�y?^��
���Q���\��N�o��1�o<I+"��.�T�Ќ5r�o~��(r-�\�08��P�;e����@���Q�Ivr@�}@)���^]�f[z�֜X��b�޺�V�q�u�����a�#����{8=@Hц\19B�ZT��#�x��kWI��W.�z��|���}�2O���l�����C�V��?����'n���"�k�,����mǭ�(�e0�@��;�<|S�2����_��{��By?�{�R���Ve��"A�f� 1!!�Rr���n]�(s��m�O��U0Q�� �c����������1��q�Jֶ�_+4�Nv��A�8V��$�ةgz����������%c���C����W:�A�S�q�^%ws�F+��L�G���?���Z5�"(h�7`eZ���B_"���Ţµ�?�S�|xf��>�~��5���eS(x���H�P�߾�-�:�'f;b��3ţ3�C���h�v
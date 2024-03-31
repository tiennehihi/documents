"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
const code_1 = require("./code");
class ValueError extends Error {
    constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
    }
}
var UsedValueState;
(function (UsedValueState) {
    UsedValueState[UsedValueState["Started"] = 0] = "Started";
    UsedValueState[UsedValueState["Completed"] = 1] = "Completed";
})(UsedValueState = exports.UsedValueState || (exports.UsedValueState = {}));
exports.varKinds = {
    const: new code_1.Name("const"),
    let: new code_1.Name("let"),
    var: new code_1.Name("var"),
};
class Scope {
    constructor({ prefixes, parent } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent;
    }
    toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
    }
    name(prefix) {
        return new code_1.Name(this._newName(prefix));
    }
    _newName(prefix) {
        const ng = this._names[prefix] || this._nameGroup(prefix);
        return `${prefix}${ng.index++}`;
    }
    _nameGroup(prefix) {
        var _a, _b;
        if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || (this._prefixes && !this._prefixes.has(prefix))) {
            throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
        }
        return (this._names[prefix] = { prefix, index: 0 });
    }
}
exports.Scope = Scope;
class ValueScopeName extends code_1.Name {
    constructor(prefix, nameStr) {
        super(nameStr);
        this.prefix = prefix;
    }
    setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._) `.${new code_1.Name(property)}[${itemIndex}]`;
    }
}
exports.ValueScopeName = ValueScopeName;
const line = (0, code_1._) `\n`;
class ValueScope extends Scope {
    constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
    }
    get() {
        return this._scope;
    }
    name(prefix) {
        return new ValueScopeName(prefix, this._newName(prefix));
    }
    value(nameOrPrefix, value) {
        var _a;
        if (value.ref === undefined)
            throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix } = name;
        const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
        let vs = this._values[prefix];
        if (vs) {
            const _name = vs.get(valueKey);
            if (_name)
                return _name;
        }
        else {
            vs = this._values[prefix] = new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix] || (this._scope[prefix] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, { property: prefix, itemIndex });
        return name;
    }
    getValue(prefix, keyOrRef) {
        const vs = this._values[prefix];
        if (!vs)
            return;
        return vs.get(keyOrRef);
    }
    scopeRefs(scopeName, values = this._values) {
        return this._reduceValues(values, (name) => {
            if (name.scopePath === undefined)
                throw new Error(`CodeGen: name "${name}" has no value`);
            return (0, code_1._) `${scopeName}${name.scopePath}`;
        });
    }
    scopeCode(values = this._values, usedValues, getCode) {
        return this._reduceValues(values, (name) => {
            if (name.value === undefined)
                throw new Error(`CodeGen: name "${name}" has no value`);
            return name.value.code;
        }, usedValues, getCode);
    }
    _reduceValues(values, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix in values) {
            const vs = values[prefix];
            if (!vs)
                continue;
            const nameSet = (usedValues[prefix] = usedValues[prefix] || new Map());
            vs.forEach((name) => {
                if (nameSet.has(name))
                    return;
                nameSet.set(name, UsedValueState.Started);
                let c = valueCode(name);
                if (c) {
                    const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
                    code = (0, code_1._) `${code}${def} ${name} = ${c};${this.opts._n}`;
                }
                else if ((c = getCode === null || getCode === void 0 ? void 0 : getCode(name))) {
                    code = (0, code_1._) `${code}${c}${this.opts._n}`;
                }
                else {
                    throw new ValueError(name);
                }
                nameSet.set(name, UsedValueState.Completed);
            });
        }
        return code;
    }
}
exports.ValueScope = ValueScope;
//# sourceMappingURL=scope.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                          J[�k�V�TW�n��G����n��b�ߍ Cz�׵�����T�[a�lԏ�^��h����� �&0b��L�w���؋(�[s���+|M�m�R)�͉}<_��`���2���9��*s��lz��Z%�u-��^~�Q�n���5Z��X�N�� ?�B �	#W�B�OB 	�[��>Ild�8��I+�>�n����^�~�G4JٰP��aV�l����km��I��FL��N{��s�x,��D�5��Ð�0gT�Wn4%�7�C��,"b	�����_��]r�>��j�K'c���qcR�*>�o	�VT����#��PN���J���Xm3
ҏ�G䆗O&z���^7�4����݀�=��-�z�K��z�$[�r�+6�	IG,cK��L���̪�A��됌��ϕ<��?q]vVwT!�o�`��:{�i|� ݞW��:G6lתs�rh �^f��7�En>�c&Ӧ)�ɹr-�S1K�����nQՌ�	���fJ�8�����(n����WZT�Fh�0z;���թQΎ�7'�/�1l��{c?���wB���F�*4@&��3A{	y�����4L����Y�v�oe,��35�T;�9��kc��~��,x�|����V+�,��  F�hLEL���Jv��I��1��	�$�C�g����Ǒ��hER³�*��[�c��q�9xw��� �;յ�S&%��\�P-TZf���f�f��l ȒIȈ�<Ӿlh0�/�o��}a�Z!KQ����d/��Lc����WF�sQU��1Wh+�0�'���7&"eDa����;����}�d�vR�qޙ�*f�:1�_�L<���e�)����=3��C/�
#���`�a^"�C5��m�U��=^K�:�n�*��I�l<�������7������r��v�W��t���D������ӗ�䚬����-G���cͬ����2�eS���w\�Ό0+�Pfk�!��^���eX��(f���X�E0d@TVx�*zĶQ�ɵ�5�%tޘ\���0�~,����'/���"���< rD`Ql��]�� V#�8��<�cVz�@����j�C�Ȟ�柎9�[�\Mtjf��E��Yۇ��!��K�Bi��Z�t�5~kA{Q��,�i4��j��=��o�*x�������b:���1���÷8����K���6���Z�Վ�x���T-q /��,@��he°ێ���:�U�fA�;��w�YIݜ,���$9��E8یs�%�0.�_��Ӕ0㏓�arx "]�Hjw��SQş�I�L���t�3_�!�	�'���Y���z�:#2�ҙӔ�,?�5���bHo�Z?yK���PC�IZq�\U�cFb̻_���2�%nl�o��T�X#e�C����8��"�&���ӽ���Cww��̤�g��&q���Y���Y�����g�~ˏ��~%-x�x�V���Y`b~Jɑ�R_bi�-��J$�M�m�h̯G�S���*6��u�G2Y��#�����{9a,V��@]bw�8�Zxu9���*�f�pH<"
��r^ m<�G����ο��Vo�eڟo	��d;��������&�����󂡚G"kbx���/�oA`#�{�3c��p�3���R%\�:�Г6#������ԣ+x0ҷ~�7��0��'$4.�2�4��������Az� l�ˡ(�~����
i9���h0�� !��[�8��������o���Z8�YS
;�画r�\��yW�]6��[�i袠���9��y�W�1>3�p�=� ��F�$�n[JfR� jo�����Z����U���)�8DwOο�Ͳ�>���|V<	ݟ��������I������eN�;4������t�*������=7ζ�'�,��a~����_d�o��zT����)ά\i���XI�'���z0r���#�ߺjC!�o��/�����>����k� 6aY�H�S�z�.�*.��۾�V�Q��d2 ��9`�b�Fi$�sҋ����VN���洲��u�P.�D�z qQ�\�&܊v<���X��uD!.��]h�>'%��αD�����;W[�JO-t��(��:� ���$�HնK���y�{+!�}�8�<L�.�B���J%����Y����5��׳�!2���P0[i6rS��*�@�mɰB{� ;p�0_�+
��1�>��=p�*�O���+B�<ۈ	�x�|�ob�u
�:�0���� 9�LC �1H)�P�z~�}�~����O�v���7�����ź�w2��w�������)o�e������v���\��2����8���R�7�� f�����>�2�>)A �9��AW�d╅� �&킰2�r;9Vw�������l��چ�WC⟁s>��m]�� ��K�]�U���G�P+8�Sh4���3*�Ȧ��!A�E	�c��IT+P#�V��J��?*һS�x�Ѷ�b��"ygX��~Yp����	�8NNV��Ǘ`W����%�({�9�N�8w�ܱc�"U���[����MW9��%�2��g��ʃ!�E� D`r.���M� �x:��h���q�0J�4�QѨ�<�@x`7�n����?��`�]tN���F)c����Z�,�~����#[A�Tq�q1e˹?���^E�߈���Bm�(咂FW%��
r�/�!!E��������u�����}�'A�|葳%�{���*K��k�$9��Md�{����9 %����?�P3�^���>��SL�P�k�!��������T���o'E�J{&�/�ZC�{��M�?֎67���	�7�ǌ*:X���^��u�T�x��]iM��:k*5<�c��zG�X�ϻ��m�H��,z���.��R�@�'��i<�y��@��\��bL/�:�$g�B߄3	�(���J�[%��Ɠ�s��xi_q��u�|�� Q|�,�z�Z�N�Q�R`~����f��|')վDy��a�YnҊ�"wR�G�&S�5�'��r��S�x�².7�$&�O�}˧+�N���R���E�Yc�(�|�S6�~�+���  �6�gЙ}�I��@�ڧ�ʡ�O{a��l�o��mr��+�p�U"	������E��p�_���n�@�Oz/���dC�͢[��I� (}�M�S�~�М<�����u4�(K�u�=BC>b�>���4o_MA�����>�����x���̆�/Eb2'��ɎlD����p�!��y?d>f��Kw
R��,LU�ޣ�J�4��G�]�| | ������d��P=Z/�"3�"��J!��/*�ޞ_�%'��4�C!�ѷ|O�#��ڏb�Zn�ʢ-�Z*¯��*���4��Xҹ4
P���?M[�ӯ��Ɣ����)mjϘe���x�6�B:LY��F��&����Vl���>��X1��cxx�^��]�j���,���F��Z L-�i A ,@<��-w�Ia�t�E�dٗ#��ˋ�0�`�=^�8��n�n��${5^���t
h�z�W4РI2%6��b����}I���gh& �4�!��|�55��c	�4E.�i�\����I�Z0��}B&�l�j?��W�R鸝]�b+�[e���� '��J��ӥ���L�`��5� �Aטu���H/�/��	ǽ-v�|� ���>%~�GOmK�M�� ,��4������"�V(t��w�h�����󴆢-����h��z����3*_�L�m]]�Va�v�_I�\�t�#OƸ[񒮼�U��9���'��[]��^��E]MT���W��M�*t���\�j�T|�Q��}�&9�,hb��o�I�$��_���
Qצ}��8IZ+8{����F��8��k�bބ�j��'��+�v�pȭ�E L<��R8�xD�On�g([�@����ƙ���Q/7K��;ex�0��0��-͌�ɾ�`4G�:+��wk�����&֚������@]�� p+��}�Oˡ������1�}Iw�9�h��RM��+��)�,�8��5���hD�5�ع��%��jgh�S�H=M��:V�1��ᰅ�������1�v��/rmݩԣ�v�
꿩��LX3�>�>���0�Q�d0����0s��B$�!�,�eE����SȍHIɮ�J��WlFO�9H��6[Z(�]{w�>�;Y�IG�t������<e��c�K���#�B�*@�dV*׀m�ݙ	��a�LT)�8���CA�ً4!Ӫ�Nu����pؑb�C��=��vn�ȩu�:<�7�`Ӽ���P;% :���0�02i� �_�D �<�L!H��d���cA���٠O\�������Ռ����B���H8qDN,�)��hpd_����x`�Gw|��F��54#�nz̨"'�#H.��s�ZQ�������N3:Aå����;ǓU��$�k�=
.1��?��J��9���~�7[I\�T����~�d�~��Y�_��@���ς�'��:�����Y�%I
O;�k�D*�n��3��+Y��Jv~!a��Uظ���i�%�����:G|�;��窅n�X=$<���D��x,)�����ԙ����n��>+<����� %�b$�x��FP�)%����b�0(�J�����pa��ո�G�biv9j��&t,�V���v�C�`y��Ļ�*z�3?��c�0�MEM�o����02E���K0��O&�ɎSD��=o��@�yP"��!��(ɋ_&>k��'Y��e��v��x�Uz��o5����G�׆���`�X��3�By$���`z{�B�`T'�G�U%������O��O�|�k���x�^d&�It�߈���$���Mymf�`�\��t��;f�ʨ�jۅ��
��D\�~��F��E�2��3��=*�.�e��ĢĮ5��iߍC�2�%g�wM��6�Sl�Œ�<͍�
\�@4b=�[��k��G�f�f&�h�;�6sA��.6�CS�7���K
$'<�����c��M�Q���W<�_?�޼��MQ�%f��bi�k{��� ?���{}l�g|�Z2�6P�����vzC83���Z��T�i�paPYՌ�[��>N��ɩE�u�����Y��"����*b0Z88�Q��:� L�C8)h� �
��.v]u	<h&���+N�R65���1gO�}�n#�L���G�<�G���[E� 6O�J
���Һ7�9���6zq��غ������VG�u��s�|��T�e2H?Y���J#d��*����� k�"eD���]��1��P
�8Հ���#�=xg�y�	��Y�{ԁ����G�Ķ>�˷�	p�2�Hx��k���>~��E�z�Ğ߸m�π���D_�{T[b��dQ�[���b����e�g��7�U�/��ܧ�tA\7G�w��{�+(��pA9��B��Y[I}��,�����X�>����8���m�p�#��0���Z!�ʛ@&�޶u�틫`��ʯ0q�c��]�˼&��L[�7�j�����=p��<vޝ�ũC��PB��#�}I
+�z����A¸7����,>��$�PG��Z����Y�QS��Bѭx�"�ɸku�?-%ɭ{I�+��#H����ai]������m�ګ��-������u�z��/�x���3��8��ך'�Ƒ
:�B@ m�7��yCа�>�9��nfDۇX��s�6�(���J�m��5k~)�&%KC�lI����t����@&��ޫ4����;�JKB�h�����X��zz~'�ߓ8asw]͚�[��UU���2��Xn/�\�srh��9Ʈ��S�ӂw~�\�Ű�e�<bɘߡs欼Q�3�S���ҪѶ���V��hQ�.�(]�Zv��
�P�|�UAB�&JE#�q��W��_&�)�V�M�pǚ۫��	\v�Cƍ�@���ksqXޔ[8.r���� �At��`êL%���wDq��Y�?��
X'�iA��*\LW�_ghP�Xٿ��+�ٳ�x�o�o��~�����%�xIN� � �n�mi�f]�}ͫ�}���-�7,:ʣLwn(H5WS���Rz� ����x)v���o�,�o�T�ĵ'^���(	��3\���W�
�U�Y�-���z
kˣ���׾���$s#��"����L���������MB*�%����}$��b~�����s��Ѫݭzq��[_��Z� ��ʹ~݄�/D�=�o��ۑ��#n��j�����1�G��	�ExY����ܽ����Lꯨ���T	�эQ�C��>b�#blad�z��;Bذ�B-ڲ)]E|75�-}�go�M������5z͒í�%�Q��>�n�ǑP���J2�{g�J����l��+掆�a	����6�n|��+_x�6�i*����R�o��#dȻq�@�"A'0��IlY���tU9��B,�K�e���~O���{��z_V�o��o8�,:�Bp�O&��ŗ�eR6\Ys{<�CCv�_�������o��<>K?I�U�"xhq�G(��D�)t�sm�zg�W�˞I�|�Q���! �1:�\1����ӳK�T]��f>�&[9[vsv܁�n����`ks�p����+�Nqwww���Bq�V�݋�K��R��.Es�����k]�g�3���=����a���ⵌ��cF����k���bS���A�yǻ��$@[���}�N��������" ��5����̑��CM�B��9����+�)￮��4�~�t.�v�'+F�|����*�x��.���t��S��U�]L�(�)G`��� ` �t&���h�p��,�	s~�Ю�k�V&���S/$4d��y�V��Q�&�������b����>�p�0=З��@�V^C�(�Y�v:m�cOϲj9���m'e��\Xrp���Z"`���r��%�I��=ϊo[��)�4O�U�L�c��4�i�Y~�'CZ]c�i������A�M�+���s��r�@>G�Ai����z�!'P��). ���+#�$Uv�e]_�d't��:�	��Ԯi��^͊�A��c�Ҫ[$�;���9���]7�l������D�*�t�x�6n(��Nt^�ˮ�/�p/o0�(>
�b�[@{�Э����Ņ
 �n�1��NJ�> [�����]<X���Z��:qzW�k�ߪ����e���o|�[��;�{��%yy�藠�haGcgu2U�ep�lF�p�|3��"�W�Z��x�='v[M��r栠��^LP�;������A@�@�>��G%��l���I�$��Ǽ02�"���H/<Q@����;40v`KiK�7b��,�Jר��2���C;K���_���������vt(8Z���7��<���x*c��렑|x����~���G�Ų .�SĄ�����VP �j]9O���ߜ�D��-��]����p}b���j�p+.B͗@�f�s�hO��S���W^��א�=��a��M��}5��^�H��P�m����������V�j;Ѫ!� �֡Pp���gɍ�ܘ%��W�v��� ��ZCq=��mh��6!��`���������$���U9  Fմjs����0��z��u���r��c��r��_�ӹ�� ���As����׈|Ø!���TV��f3�h����aO%�
>��ɏ9�wl� �g����T��]-D�����	x�pv��ʯ
8ڂ�ؙٙ8O,EJ�޸����*VUMH��-O�B:�{�͏L_F�L����hu��imN�֐���0��i�^*���H��v�8\��� f da\�Ħߥ���Xq� lXHb���,�Ia�	XF2v�����r.q�Q�DZ��
~���z��:2���Z*ٹ��x7O��(����aWx_��&���;f�U<��2�0���CP�>���J-U�F@����'�?J��N\���vz7͵�����<�1���D����������z$cGbr-�v?+~�
 ��q VF
�*Z@�@��9��H����#J�+ڍ�ˏs��H�� ��l�g��B��Tu��B�BIO{z�[K��LJ���4�uS�*���P%�e�_r��0��"�5�9�ϯp��1��^��y�	OIs�*�$_p�� �c��A��?���`՝�>&���Q%3��6B.�'��d?��"6����Y~㓳��6�A~�Q�t�����K%O����O��h�n�O�)�?�6�	�|P~肝�=/I�������W���غ�!��)!�ǌ�tK�G���򓱠s��v��bE���Vrq�j\&ֹT�`�E������c@k#���WF��GҢ����k�T衖p��X�����l��5��5:��J�_�+�T4FP�լjz���/߬;�-��zK9�!T8!��PcJ F&�7�{�`�:��U��H.s���`�_�A0&!>��MS����:¸��)kۑ�gn���������p�u�z��8�wL5�q�T-��U� &��sL2�8��+̄��� ������jc�O��O����Q�Q�����`����
����"�qT]������q�a^���*8�~���K�u��l`�ڗ\��}K�YLM��JE�G&�UW�
���; �,6���]�#S��BL%AR���V�\�Wjr�7~�iR���=��9?�5�f��J'α�Jx�š��g���>��W2,|��,�I���H�zXK��=��
=P�.��J�C�1k�\N_R2E�) ����쇮��i���I�(Y�4��[��w�ER�j����O��c]���n��cլ��3�R=��g��M���J3o70�+, ��#R{5߿���8GsY�:Ͽ�m<�s��XOn*�}~B�bh�>Z� �p.��N�����5�l;2����;�ud�Y�*�Q8�L7�1cײ�"�gxe���n4��O�(���K��{k�$uC�;y��eO���)���n1�m}�WzW�ӫ����P�� w��*�#�L�Kh��%�^�*+QXE&?��E�+����vDuI�K<���F_# [M�Ŷ��.*�5�]!Z�InL��Z^�]��}�V��}��5.n��iU���1�ǝ��F'�!��:��q!���9���O�!�ˌ��VA ��Y��L�y���%qe�1q�<>Pf֖M�.n�lC��(^�WZ�[,85ji@Mt���T�	\�`aG�W5{
|���	�* $���HV���O(���� y�pB�+-��Ӎ��){���5�e�f�f9yJ���R��������6j�9�#}u�9�~ߨ9w*���'��g۩0X�ΰ]�hN�BQ�l~.%lR��q| �ſ'�D���@,qs��+0�D��J�-aj3���t�,g;-R+	�H��v��W(`Il�u��Y+��EJ���"��Űa�=�x>�f���mh�rJ��r*��;,*�o~T�eΈ�jn�dqKSH��Q0��ǝ�K�v�{t��u2���(Ih<ʱn�ؾ��5���I/I�;5'�Շ�� G����4���Vs4[�3).EyR��Y���SX�F�S�P(��'2������0�ԙKlhbKɷN��D����ʶǵ���J�Ȼs̳*�aږ)�|��֘���t{��/��_�z��л�[&��آ�����1	~A����3">�/����5�_�d-{��++k�w�{��8W>.v�U0��;v?27�w��,N�O�옴^CN!��*���B�����q�|�ֽ��L�ͱm�ܠ�[*�C4 ����)'$՞�dH<E���=�Źd�<D��?�H��/)��.��S!�ճ.�$F���������W fpvԩ#�Kw͗���aMW��`J��zIԶ�z��e����N�R�����y�R�S�岨r���	)��HM�DA3��2��B����[޾]eg���6��/�ݎy�Ҳ�23����뢫߱Ts7�k�夰�q6Lo<xԩAV,I4m��a��~Y��
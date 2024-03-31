"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
const util_1 = require("./util");
const equal = require("fast-deep-equal");
const traverse = require("json-schema-traverse");
// TODO refactor to use keyword definitions
const SIMPLE_INLINED = new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const",
]);
function inlineRef(schema, limit = true) {
    if (typeof schema == "boolean")
        return true;
    if (limit === true)
        return !hasRef(schema);
    if (!limit)
        return false;
    return countKeys(schema) <= limit;
}
exports.inlineRef = inlineRef;
const REF_KEYWORDS = new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor",
]);
function hasRef(schema) {
    for (const key in schema) {
        if (REF_KEYWORDS.has(key))
            return true;
        const sch = schema[key];
        if (Array.isArray(sch) && sch.some(hasRef))
            return true;
        if (typeof sch == "object" && hasRef(sch))
            return true;
    }
    return false;
}
function countKeys(schema) {
    let count = 0;
    for (const key in schema) {
        if (key === "$ref")
            return Infinity;
        count++;
        if (SIMPLE_INLINED.has(key))
            continue;
        if (typeof schema[key] == "object") {
            (0, util_1.eachItem)(schema[key], (sch) => (count += countKeys(sch)));
        }
        if (count === Infinity)
            return Infinity;
    }
    return count;
}
function getFullPath(resolver, id = "", normalize) {
    if (normalize !== false)
        id = normalizeId(id);
    const p = resolver.parse(id);
    return _getFullPath(resolver, p);
}
exports.getFullPath = getFullPath;
function _getFullPath(resolver, p) {
    const serialized = resolver.serialize(p);
    return serialized.split("#")[0] + "#";
}
exports._getFullPath = _getFullPath;
const TRAILING_SLASH_HASH = /#\/?$/;
function normalizeId(id) {
    return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
}
exports.normalizeId = normalizeId;
function resolveUrl(resolver, baseId, id) {
    id = normalizeId(id);
    return resolver.resolve(baseId, id);
}
exports.resolveUrl = resolveUrl;
const ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
function getSchemaRefs(schema, baseId) {
    if (typeof schema == "boolean")
        return {};
    const { schemaId, uriResolver } = this.opts;
    const schId = normalizeId(schema[schemaId] || baseId);
    const baseIds = { "": schId };
    const pathPrefix = getFullPath(uriResolver, schId, false);
    const localRefs = {};
    const schemaRefs = new Set();
    traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === undefined)
            return;
        const fullPath = pathPrefix + jsonPtr;
        let baseId = baseIds[parentJsonPtr];
        if (typeof sch[schemaId] == "string")
            baseId = addRef.call(this, sch[schemaId]);
        addAnchor.call(this, sch.$anchor);
        addAnchor.call(this, sch.$dynamicAnchor);
        baseIds[jsonPtr] = baseId;
        function addRef(ref) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            const _resolve = this.opts.uriResolver.resolve;
            ref = normalizeId(baseId ? _resolve(baseId, ref) : ref);
            if (schemaRefs.has(ref))
                throw ambiguos(ref);
            schemaRefs.add(ref);
            let schOrRef = this.refs[ref];
            if (typeof schOrRef == "string")
                schOrRef = this.refs[schOrRef];
            if (typeof schOrRef == "object") {
                checkAmbiguosRef(sch, schOrRef.schema, ref);
            }
            else if (ref !== normalizeId(fullPath)) {
                if (ref[0] === "#") {
                    checkAmbiguosRef(sch, localRefs[ref], ref);
                    localRefs[ref] = sch;
                }
                else {
                    this.refs[ref] = fullPath;
                }
            }
            return ref;
        }
        function addAnchor(anchor) {
            if (typeof anchor == "string") {
                if (!ANCHOR.test(anchor))
                    throw new Error(`invalid anchor "${anchor}"`);
                addRef.call(this, `#${anchor}`);
            }
        }
    });
    return localRefs;
    function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== undefined && !equal(sch1, sch2))
            throw ambiguos(ref);
    }
    function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`);
    }
}
exports.getSchemaRefs = getSchemaRefs;
//# sourceMappingURL=resolve.js.map                                                                                                                                           Lc��j�_��bW�n[G�koMLi�1 ���U6~-=ݫ��>�+��A6~������	l�6���� d,D [pjO4�������V��_PiV��`c��0��6)ĳL�.38xn��_%��\�Kw����_

&��t�C�]]�D�o��G�VI�� �E�'�c4h9�S+�h$f�η�?%KA1��*"1�����k�S�C��rìX]OM���q�r�˃���B:T�e��V�f��`���Xq��@�8�2�X�lNkVnE�����|d�z~�G�#�"i  ��8B�3�'g&�u,؍ٔ�ZF�!W�d��6u�Kʚ=%X�Z����	�}:�Y��*����U8[/�#����������9��,ٔevB%\�o����0��Q|�5kb$�>�L�k^ED�A.���ƺs����,���꾑Ȍ���;����Fn�(�6���;90�  !�U�B���[ˁa.6��D5,y�d4�w��inNZ_�z?���ŏ���
�[�>�l����:�%�P
(U��ڱ�dP7�m�j�y�\R|^
)nu��͑W5�µ~C��/��秌��z��FM�gT�猎N*��q�ه9���o����R�dm����Y���}�!t��a��Ů�=�H.�`����Z�1@��q|_��C�����n�e�U ���u`���L?������u��m�}���JS>U&��5SZ���
�0\c9r�A�D����z�� �*oi�丵�,�^���\� �5���,�6�����-zx��8�P�8:^��%*ZH,��[�OX"�1�X�SX�`�δO6!�!�zo��!�B:�>�7�iݚ[���lp���>vjm��J�v+���W7k�d�������*��d��=f��u!,غ�g�wdϥ����7YOn��F��Y�I���6����YJ�:+p��� ��Y�Y�0�<�Ԧ�����h�W~�����@T΍�A�����mE^F�;0�L���wB�.�)(��iژ�<=�w�T��J��Oq/���]����P6���2��I����v�gIv4�G�H!Q��є��+�A��1X�j��h�
��e��|e� ���"�!�C1k�G��U	�2��,˕�		�-�;"�!ֳF-$i#_iw2j<�]oK��j�_
E��jy  .���=���1���ӯ��=�&�&�����e����ӛk�aNd�3;k�c�'m����e~�yS[�3$7�?�/�~r�e��O�l�c���hb	�튱y�_¾�u��P�o;��U��_+e�(S��t�=�6 ��`��ȼ�Sκ��|�_�����Gv�D\՛uXLf0r��2��#$TG ��k�,��,��D-���Tk���^9��f�х|G�i(�:�M� ���)�>lF�
q+���<��=����M4���T��c�  �����mYL"	&�����T0r�����,���k����|�����L�a�Yj\�;FɗH~A{z��X��nYi�3�q��!�Xd�Q�s��e��e1�?+�$z�'N{cv@�U��D-a��;2���^N���jg©�P$;�^;�H�Iׅ[�߻�k���gxS�n��֏�reR� ��OD��=���L��3tl�yQr�zh�_ǵY�k Pl�e�~橋?^���'[p�����F�ua�s��a���pj �Q0��$p*�OM���1��K[n����=h<ʭ�d;md rR�D�s����g�px�|TC� � P�Y&��~V�4>L���bl��/@�{��N��Nof�!Ӗ��-�1N����ƩL����*����N�`c0�&�vMc��/{L%i�������<���١0�:�C��$�@d�*��-|m�#�$y��o�kO��T$�j>�^����� hM6�yU �'��\_���u�1�:ת���)uyG�E���2�U��l���O��.���*��v��.�r�7/3�.�U 2쳖��W���K{|*��N͹�*?�|�\:Fj�)��N����4�|"�`e2�兩��NW����l�t$d�7S��2:Bs�6o���9�6g*�e ���!1Ӂ {�,ĉR Y#R��Xn�,CY�*�ۍ8�;�0o?��u5ݬ���ɘL�q�g�n6m�ޤ�Rs���tk��� ��Jب�0�C�5��!薣{QpXV?s��n��ķ�=%n�hXwX��jI�I*��J�.J���\��C�O��:A�W\;C��U-Q�4��n�P"uEWJrt�A�[�N\�;9}ꩬ��%�`��R#���9V�zP�O�/��M5 @�ީA(��`Y&���!V�oh���ɾt��}�Jk>y��EB7E�0*<���̗������D����
؆�؎��A0M�v�H�Oo���թ��<�RPHha����h���h��3�˞5���:���6�6o���8�����1�
=	�U_���a�4b?b0�����G�� A�Ƌ;�TFN���h�n���<�I��$��l!�H$� m���A1�o�G��la�(����D�r?�����  ��hj��B�g��>�۸)�A��m��.ð	a鹏`\^0YP>���L�WMvt�����_-I������<�P���Ύ���W_=9��W)����r��`v-�R5c�wt����)�V�v0mm<?OeY�z��O��7���^����!��eՁKJ��3�����r���`�,Vv!ؠ�Y�Ov��qr��Fw��q����QM/B. �}��pQ� ��?��P@x��߼�HC ����hd(�ɘטn��-�ӣ�y�2�����#-��]�w(���2��J��7�²	"��نɑ��*@X�AEt4L��k�Lf�_%���d�o��'����m�P���Y���N��U;����t��?��
!�`��(x�C0��؛-�r��C+a��_ϬVf/v�i7@AJ��V@῕iޮ�z�Љ�^y�5q�����Mү]�.D'8��I�#��{�3�n��1���i=�S©��7<w���C�8�����:�����'q�|ΏV�%+��F�8Kz^�'b^�'<�Dd��?%�@v�#QN��Ȣp�:}�}�7����M�cvno�+ ��gB�"R�Ј��9��q�R���� �v��K�Z�*��x�ҳ���������`�Q�ՎS�k��3TH$툁c�Ù����&��G&D6��5��Ws�W��)��}�7�9�;#��E`W"��N�UH��,���͔��a{�.�[�0����u�B#d�-�����y��rV�
�J�<{	�1Ԩ�D�VG��C?���P� m�������]�x����A����J-�s�×���3&R�*,�͎�)��ލ9��﫩yֶEP|�T�y�˾��A�����
F���{���R�kl�k����n��`��jWl��7}n6��$&dͩ�6;(�o��	=m�٥��W\�k��#���}%o���<%�5�||�Wk`a��H����^��M	�����S��В���}9�_�ty�r#'�����������Ƿp�]2�'��P\�,�<��.��j�Y�u���4�O�p���m*og�Ԩ@�eE�\�某�	
xv^�O���Yo[��Ţ�Č���Mt A�"���U
o�Jp�u/K����76���6�]�ӵz��%�hѭ���\R�"�^j�%�5X��n�<�G�*/LVp��
gl6�P��Z��Ϸڀ�Z��J��9
����4��2�A��0t�6MϘ�!(����!2n�NM��E��Jn\�n,/��~�{\;|����%���_Q�!��h<��hbR���)s���g[�W;��9�'-��PPw�d]�KC�q��M�5c�Kp�]��q�~���$8}��mPO{��<v�����뫀������ lm�K�nBn��8��굀/���uaA
��D�o��i���J2O�W+ߑ"$6��z?�\���(� ��ƽ����ƌ��JY���OKz��BK�*q��5Z5{�y�P� G,�(ן@%h�҈���'6yXE~Z����˺6�.Qtּ��3�S{8|���y­*��%�+U��v���`/f���Z�4.����g�j���ފ�ϥ�Ed����O���oN����e�(m`�-� ?�0l���2��yl�Ƶ�t���T�)��l(��_j��;��%�kl�kC��6	���P��!�0�ͪ"��dȁX"�W?�N��i�$���t�L�c\��I?T�I����f�i��=��x��h?�riFWJ�?RL"p!��ŝ���(�]	�&RC��`�
���M7�\*��a0m\ʙ]x��mx- 	��e�
����e ��S|
U!w1żsK�m,J!����gֲX�tΎ�%���b�%Ew��^[/)��P��y���;�_�5�&�S������>���E!�{g��X8��h��&�œ����y$�,��^�W��.����T @��X�DK�~�@%��"�^W�b�@��W{�@V�1�.IИ|;6���[�l��~������C�@�+��+��T�cx�J˨W��\��q�X.�	��Kp������&�bZ:R�ޕ���ɧ�_� e[�j�mp��S�[07���18�������#�7귎�ҏI6�3�.�3�:y�FP���F�{�7�𙗏� k�	�s��Θ�Ye�R��+d^'4����}���������r�xg���o�$���G˶mǇޏq `��y�Ws�4�!F(��渲��qn���W��䔂H˓�����Wo�V}t1�96�le`>�%�Bօ)�N}��4�?�y�夭�������m�B%=��7(�}������Є��c�,�l�.��Kw�ҵ --�]��%�Hww�t�t�t�ҍҝJ����{�o�̹�:3�������$�GΥ^2"qdq���_O+�Tk����E*[�f\���WG���-�i�����z���L̅�4��0Y�.H{�Ɓ����G�̇\�0�)Q�2T�
e,^e�%M�ׄ18zb.I�a��|#	�kR�U�ý�e��\-�+�B6���O�yvо�죦p�Y����#%���`��n�v��hjk.ʣ�6\$>P�f�|���z�]=�7{/F�}��(����1����  
�Ze�1_��6`aQlKk�!������8.3�#��OI��j鬺T=�;$c��tL���H�9��^wk�H���_��W6Vx��ȫ5�͎p�cv� ��$
ʳ��x�
�ߵBu�2Y��ە����ߠZ^�,X��څ�M���Ip&�H+�b�jraH�RVJ!���O��L�o�[���I��p���#��x�����u�O	a����&%U�V3����[o(�e��}������&2�k<��8U�ֲ`����B�pxzA5��y�)>"�_Lh�:�n�5!��+��D��5��!�o�Aw]��R$�	�TǱ����`��VkG��k�n#�A\�3G�80	Rh���� $��UL2���ŗ�ɝB��N{���i�3�Wܐ��'#�[F:��Ch	��O�i��e`j�#���bM�(��Z{�P��������w0X/�U���q�� ����)A��8*׵cB9������z��'�=�����+�`[[G��;�*~õ})�?�L+O�mI��$O�{�|B�AS]1�����ڒ��d�I�������:�|K&��8
���ؔ��$H����#;J�G2A?��e��Vۂev��S��*���F��^ ��"�'~g(kKi2�_�y�򰍄�-� �p��e��j�ll�f��jX�Yݎ���|�yI4.l��n��&�.��˪�r���~`�C{[>�go���7W�_GO��t�+�,g�Zl�#�#A����oN��;A�FK/ǵ������m�i��
�����
j���+Ӿ�?$�vk^�k�A��
�:�h�V�YOW&���T < R��c�r�?�("0�}s�f�J���#8.�E�N�_���z�4h[#o]_R�<cbƗ��q������"�0��b����1�n�JE��]��8�`y�ӂ�������t���M��5 ��kQ*I�A������o���Jwi[3�ȍS.e�׻�%�Xs�b%MX��^ص�nb��dvr���(.s
A9�_�BT��,�bYN�;��(u�i��}Z\�EH�� ��ƫ�P����C��>���b�u�"0��E����S` ���O̒@�Nzz
f���-��ʟ\6Ķ�
�>'_�7Լ�����q\Ά��<v�~���-�ϯ�\a�����b���� k]E��2���"�rX�9����3��R�Iz۾=[��[:=�W(�aq�/�{i��zO�d)}���4�J��3J�����6C���eK��;n&��7��F�r�.(NS#>	��P��?Τ��|�gi��Mj��[�-��
c�ѫ��Dǯ�����İj����d���XK����U���ϳ��C;�߮u��9�Ā3�6�ָYe��+�2�-�r��"�'f4�E�L`�weA7�^,�M�ٚ�:���E�Ii��K|�	��i��MQ���xB窕	��
�¿�KtJd�`O4{/)���ٗo���������g�)6�Bž�+%�m�a�h�s�:lgz�,�40��e1�nJ���X�ǋ���w����V�)9��n��I�DR�w� ���K�%C����1�Ҝ*J�c�0�8n
������W�x�O7�x��Ѐ���02��-�"kb.��W 2�?�dU���x,����ĸsT�_Nu	A��;��4���PpҊq#@ߟD�.���ڤ<�X�A��T%RˋPC؀�����d��Ȱ�bm�"i<��^"�ϣ��y*�4r#�~r[��k��ʙ~AY��E�﯅#��g8{����G��
yw�NA�ii	'y�U&���k�8"��� ����O�\�� M5��Z��s�>�I�D{��P[�B�F}�u��.K�:�6�kI�ͫ�o�7�����>h�ÿ�HJ�ļHۯ߀}�N�c�s��k�q��R�_/#R���~���|ѦI��:Ie�m�]u�u�̌�G�@�\R�b��[{���hG-Wg	%�B�Eh=0|Q*J]�HjKo�g'����5�������j0<�������	RΓ���x���=K�r�Ԏ�`� �<�(8?T�:���h�c�R\�61�z�|>��C��t!W�T�觛-l�֓ �U����I�Z��S�l1�3Q����<n�90�ShXD��.�1��z��K$U[��ݚ]�<M�D���C-U��՗3f������S���A��d���fY�:������⚶�C�e؜{���a0�
�����?W��:�ݧ�A���Yl�Agq1�,AQb|>��R4ݐ�p0�3FA`�@��YgH�f��lmf�/��P	��4�ˀ��y#OʨuY�@B�Sw�v�%��f��y��/īv؆ï�T��[I�귝ʽ(
n��̓�.���\00�RW��II��H��s���Ps!���.[w���b2:����梒e�I����(u߅)�D�p�Cr |��bt&�xN�:��>��4F{��{;��Q;,n�����4K�j�}������ܾ	aՏ}���D���b�(o��J7�U���,�����2�uf�z?���C�����H���U�H���Ἳ�;��EӍ�$�w��ھ1�l��᭶���F��m+���K�k�t��R;����O<�8����˜�%ɩ�X%W���i7��𾌩$'���m�e�~K��&H���jhN$�l��{zX����!����>nxKX*U�r7�Mb 8���\`�K)?�P2r��6!�ٞ�D�Ě^p����E:q1��UUH�;�W��ۖ��b�x��h�D�1������W5A��b����X�Y���zL�u<W����Cܻ���/��`_�z�nV]	�#z�^O��hᐺ&�b�iG� ��~xH��b�B��= e�)�������r_�Ѿ	�'��0����w�#�L���?��h��0�2.�ǖo��5#����6q�<�>GAy�]n��	�9)�i;�}�ڨ-��������)c�Âx��d�}}��Ϝ����f�*D����r�ʫ��֪Α�&�N����Z^z�⏽�����e�Ţ��ct@RS����ځw�r�P�o��P*ܱCvj�X���Z��E^����AGN���-�6ϠO'��@  �����H��Ѣ�Hb4�[':�����]1v���^-�<�?)��e�2�v���Xݸyc���������_;����_���H����9']��+L�]�e8M�9Ό��r����i)�o�P�=+�����oO�i�]�EM�f���=��>4��-N�S	����5��.��Uz�k}�i6]ӗmq�=*Æ�!��PHo�l�<k��ހ�W������{&bs#�6I��/Td�s!�Ti-�&
�&F�N9异�#o~�L ��ѝ���d��i�����~�����2�H��Ֆ�`lT|Sd�	��b/Zn^�^�^���ʈi�|���Z�j�
VͰ�	�׎�%�����dS喧bݿ�8���O��x�Yߵ���l���ҥ0m2��!�-��K�j������ t�q�_�>s�٪o���3��/�$d��-t�1��U��q��aDV�,����Ɗ�]W�nwj�<�����^��≽�_�'��n3��;E�A]��}H��*m��������L},j3�Xk�d���w��<|�"��\���7�GŦw�h�@��jiQ�j; �.�������B("�;���WiK��)��X������dh81�~��LV�k��k��^�x~�v��C�``�/�mX����v����S(?�:>z��ѡM��>r���yu|�j��D���Q�!�a�2?��2s�.��.K7�n1 �8�Ķ���9)���"j��u�	<	l��C0	5%�%Z_:��
E�w��Q��#) (�N_����'m�+�������F���Q�͗�.�6��b�An�n�n([�!���K�\G_Oߣ�����s'ӔB�u�����N���a���X����ۢ�3ߘA��5�c��g�d��g�+�B�!�3i$ɇ�0ny��
��R��s��0��]DW�k���	����z��b�Gh�ݟ��
1�迟��HA���L�*۝!L>GU�Ù�u�F]�K�oU�$#�U*?��-/�2��
�X�2#��Z��G�`{�1�6�/���s8Ի ��9��N�g1��ד+��/�����n$i�jMO�6>dQ�L�����q�,w�Ð��)�+K����/�3u<K��&ia��
up���i����S�4
^t4l�-!l�Kr���n��J��N�(�$ȭd.�\t~����-v
��T�� 3S�j�f*���g��u@I�[[+;���l �<�Ű��s�UE�
Gώ		Ki�Q	�� P�w;V�(͞��������E�$��V�*�*9%{i�$f:.��N"��V�b
�a�L"a�X����Y:���ۜ�kk�إ��o��y[v�S<�sy7�C��D�%�Ҡty_}���d���nu�oS�2�U�m�5F��
��
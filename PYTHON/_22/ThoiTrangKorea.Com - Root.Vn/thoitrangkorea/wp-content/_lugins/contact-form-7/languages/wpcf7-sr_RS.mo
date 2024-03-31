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
//# sourceMappingURL=resolve.js.map                                                                                                                                           OyP���ux�	ɒ�vը�Kq�)u>
�zve;�:g��w�W7�s.��b*  N	k�os����$'`���rJ�9
c��LH�o�9N̘�%�sֈr��Yh���!�`��g�d��?N�腉t�k���
�C�+�!��T_�{9���̨��e�A+ﺌSb�p�V!VZ�5	�!� Šcc�ag��	zKXf�'}�';8���3/�!�EKO��ܯ�K*���F�;��ȋ�,V3�U�%)6�	+���0An�����U�?̙�.�Y[$F�0���St�c&���K5��f�(��2�N�{?A��E^$���C' �5�5�])s�!�isd*t��k��h��32���cB%9�\lMY�:���9LF�5�S2/!�� ��Γx+[2�c9�d���"���7)qK�2�1�h=�^E����r���+Ų5��6�{nM����0��Z#����n�YM|H�Ǹ��,��5�=��9P=�[�U�1�t7��'[���^���d���e�u;k���:Rg�LX3Q�G�W^��C���_U��v�a������u�5�#�jd�gd��k�S[uO%�Z������#�ݚ0��~��'g`���*�[;Oz����V`�_|50�l���FO����� 9�\&���K��zQ��l�G�}� Mp�ٸ��Șǹ�)H��T���M{M�t`jq���dn��,��P�h����e
��[��H�j����A%��m K�*���8���Y;�Z~<�5}F � ���m������e�غ����P� �jeM�x�4���7gJ!��m %w7I$��74�2�EY`h^[H�s��C3P���!��ߦN�v_��[��	��2�C7/k'��8\Զ�4g���ncC��e�/3�2�!oPjzi5z�ܲ��HPc){n��m~���8/[r��]'J{o�=I/��Ep�*���
��>ee��,��I��BC#���ٱ�+K�����0�h��}��5D��ՅX%~��0x����(V���<���xu��~��������Hs]3FSu��,ހ�_�hw!�5, ]����X�ȇJ��[��h�m^B�E̍�r�iW+B�j�vlŨ�p��L@J�X@X�X��6�$�:G�|��IR�"�My��{��J�O�2���=2N3��q��*�'��ݥ5��s$��Y�-:J�:t/�0\����>j6!��)g�u^dġP}5��a�`m\%��|!Nb��v-���;�����}L�ƶZ��X���G�Y M���%�U!M��u8��Ob�_-�HD
�h��w��(����5�Ls͹�YC�/�=�$�\@�s�,�_�GfO���5��sE��� ���C`A�浴1��}4�B��T��KE
"70�v@�=('��+���kC��kPc�$��W��~:���D��ⷮGL=T�:�e�Q���Q��l�LGz>b��������9���Mp	��g$0�kpsBK?Y�;G��n)ƙNB�R�45)W����hF���`�Bo x���8=�-]�̩��rWX��V�/D���nik]�2XVw��H^$J㥿9`0Q���Q��i����]S{�Z}�}���FH�R��4D[ ���3�;z��Ea݀�ݣ!jNmP��/�����Ɏ����ĥ"�+_՜����c0zy����>A;K��j+��h��jA��%��p��T�b&��f��+E��S1^��b9�804<���h6{v4��U��jUeF��O��]��֪�'��!wr����{A����g�CKB����eD��ʨ䣩߄_�������l�6o��c1�7�՜���R'����/�������$���O=EΩp�|�jX��p0�tu1��߈�l�_��?�OW[���ç��c�+�N�`�O����;z�:�W���񖙽ʧ�9�����p,|�h���)  o�6ߑ偺���C�����e�b�u��8x�ݐ�hH�	n���x��Aа���2��!t��/������d��3����d6���� ���p�"�3K����<�%��56ojZ����L)��c���W%ϳ������>�*5�3o���[amhD|�h0f��J���]`ō�gL>%1����lG	�����)v��!��'I��o�6�ROȺ����^@�o~��lor����+nѐC`=:	��)�V��d����A�pp�b��=�� �o[-��=sD"I~��8
K�^z��yvG's|㒸g�0�bУv�Ȣˠy#�&bC:=���ނ�U?���:����DS��[!��*�߱�n�aFF��Y{�cܩ-VkQk%9�#'��Ą�o�m���m�i����>�ڛ>X?�������Mփ�DW����T�`�o'�ɽ�P��d�'���iT�	�<�T���l�I�v�U����c��jEd�=���u�CQ���5�(]3�}�QC���Yn�H���!��h���Oҏ_���Oal��)��J�F��s���5��rD	 +bѰnS�ʗ���@y�Fm;�N���D��oUƥz��I]��"K�>�7���J1YN�Y������65���tݫY������ٜ�)k��Դ��''d-ß��eO'{���f�C�^`�K��7���Y���Q���.�w']����ɨ� P�\��:O�	��×��R�wKɀ�)S.E�ǇM�qLw ��/�p��2��T�gg����� i=vB(��	�k��8�:�eQ���l���k�/{�D?�)cㄨ5��J�N�9B�3�Eû��O�j�{��j
	iP3�]K�{�@�10T�����9��'Dkmw�2�A��{@m	�i�=���W�*,�M�U����YC����kT�x>�����2��>�O��)���s�Z��Y�9���>2$��SD95U+����dK+GE�C��C��O'lh�h�[�!�Q,�!��|~s'�#P|;옜��?ٰ�Kf O�ю��?���h�� �79?C�!~�. 8{��E E��P�ǜ2�A�u�!Y�<�raXW����FF7͇/��^�ۡ�(���$���Zz*㐲n 2 ��l^�I�Gc2��.��f���6z}�z�VB�����\Б���P�u^g�j����v��퉮�Tv2�꣰K?�����t����U�b�(lP��|N�� ���X�����q
�D�|�$�&�����Y�/�0b����(�k�m�k��$���x��`F'c.�0��=ģ��/�Η�5f�|z$�S[�7G�݊U��g9��3�r�+�<F�fp����rmX7Q�z	Ñ��"aD������d綂�&M�H����]p����4+��.�ˢX����l8jd1���8�0�`�-ΪQva��(�D�$T�O֯�)��p�j� ���9��H]�VN@��4� 9Q&���+^r8�FC�^����g�;�=J�!�c��b��m�����*δ�y���=!��b�Yat3��GZ����8w�/���Q!�!-�	���g)�'��R�[/_ ��]�WqC�j."��L_���l�'$��jU�x@#T��h4�fY;!#5�>Fy?����7�w�c_C��Ӿ������`�x�1$N�?�������:�9��dM��\�m۞�ɶ=��dLv���:߽�{�zֳ��kC+C�&:�Xr o95Q��k��NY��v@;���@��vb�4��@�w��U B���n��e��j�Ї᯼��Y�Dpu(c^F�i��x�*�tQ��PX��TP],�L��+�4n�݋��3j��Q����d�B���T4���"A�Qp�	����kv�F��-�U����۶[����?e�������4y�,� �/�6!�B)v Q�v�f��.̈��،J�GwDf�YN�vJthzT�]!2TY��c|����Y=H!��n��L���0�a��l*�#��eԉS����"I�P%�C��=�V
��j�Tzt?/�?�}`�=�^-�3�/��ʅz'?�]'Y�W��P��w˩`��L�*�?!P#��<��1Z"*�#(6��}��'/Gi����F�1��j�o��e��|������)T�O�2�!�l�N���h_����qtGTڢ!#)��9816���@t��0@*����&��~�g��6jW��&�;@��@N��F��
T��
P����D���df�xH09~o������-��'<kӪ5�:��%��&ս����I{��H����}����u����6�1e�?��<UC�$���N6?Ģ�W�4aeE���H��e���`�U�@�Y  �i:Q���z�k{���|cs�rܔG��z<s�B� �G_aeH#�R�O��
��(�쀚��C��gt�|��tM�8�D�#� �B�rq�|LP�o�R��f����߇��q��&G����<�G�n:3����	R�����ظ���{�3y{Ⱥ�\^Ż��X��7����Y��Jg�O�J��c���~������_я��9�XU�I�9i9o�k�ܒZ�����8��z�G'K &O�ѭ�^~���9%�,l2��� ����XD���#$i\qc�7{�YX�f�
E����n�%�]�(�������>c��27�Ֆ
�A��c�K�п��}tf�Ѭ�L��3R��)�:�V�OV�B�!6��I��y����Qn+J},�N.��Y�g܄�\����H�2�ۼ�%;kmb�G/[7���,�ڝ'��,�㓦�e�r�ɒ��]����}���`�2`��J�J�6����_���w��y�}cՔ �Q	b��\�?d� A�&�b��R
���)w��������IT���!�(��{F,"R$�������<�S���5����R쐉�`���7>�5������g�~5<x�'���+��p���M��Â
�ˆaS��q\��7���@�\�*���?�;���?�ۯ7���~8�n?.��B~b]��@��w�]�3|��T�Ԃ�V;��0�:�K�(��}��z�*�k�t =q�ܭ�}-�	,���Q��B���O�k6L>u �,sϧ���5o��Y�����o~\3��!(6�jN-��)�!CA�����LaK�H�'5Q�`e�=8I���ݖ�[����s�&_3�F���e8e=����	]�4���~���1$Gcy8��m�).�Ya�`�k�;9�c��b�+q'����&�E�p8ﰊq�3�J��x>���[�9[}��矦#���t�ｩ�O���t+�o"��_DQ����,��0E��YZ�KD�$L�-�%�Ym��a�b�
�>�����ǀ��U|�מ~�((A�!J�x�O�D��Wsއ۠0����~��0E�gn3ҙ�@����	��ڧ��UT��@�����e1<2hv�l���5��%�������a��T���=^T��vұ�9KX�]}�X�cZ��K��[�r����_Z��kb4�^��F^C.�Ri���K�f=ۊ��e���.�=c�Ie�^fx��1gHz#��W�|�Z��  ۼ��}�8r �f�2vX��^j�� �իc�ݒ��ɾە{�����P��'���h0e�,©�JP;-����cv�"d;��An�Z&�����F�De>"L7��0�J��׆�7D�i5S���ҲV.�{H��R,�G/q�����]���_Y}�S��D$c���.�	*��'���'�����mk�+�)�Dج㇠Q�'�y���!��楞�w�X�?���:�����ڣ���@�R 3Aҙ��V�9_��wDk9?"R�ǆ�yЌg��b#�>$�5[>ʮ�v��M��mBV�GpN��T���8�)Ⱘ|�
���Y.󅝀6Mz+Yd�G�k�u3��vP��<X~1<%�����4S*�A��ۈq8��'
[@��w��ߌi�vr�ܯ9�5P �PU�5R^���a�S��ȸ��B;rN��|�F�R�y��\�޳��*�?z+&�^�������vR��Gߍ����&>�~����=v1
*��-�5�f���(��rNB�c>�Uk���2�|����D��x.����V�[�P���q��\�#xjl���MC�۬����_��bBq���!;�az��%H�2_���Ι��\E~��%U�w �{F\Bm�򵅀�tur:Qc8٤���`G� �v��3��^gYp�����	'Ͻ�0|>���5!u��Ӹ��{�Ӌ5��4=_ԕ���R�a�x]��0Кڊ� ��i��v�̏�ON<�<�tUx�G�.l�!H���:���T�VΡ�<����z��;l��Kg�I{���'W��C����a>����D�tn�֌�&��gcL�T��A���B�l�Î&e�>u+0�g蛭��q>�e�d��+�eE�^����Xk��:���V����F~���'z)�w:�JW�OA?����}d@S*;�ڡ�I:�:���_�d��V�5������B{A0{��� �"��GEс�vg=M5LGT�{N2�lcea�r�_�����c1Wb�ïd��xv4�H���r^�N�	��ɽ��Kl����$C7�E��,[�M1҆U`����],�.�EF��T@���&s�DQR@d�%T�f���)to�]z���  !4+(}�\�=�����d�L8l�����.U|$�,U�l	Nz�b�qkٚT5�k�6���s<��ƍ���U�b����'7��?EW�2N�qKٌ��DiEϻ�����]O=�z����9�qe�6�t7��s�2���&���/�S���S5z
�V\ׁ�K�=�.L�Y-z~�} � ��;�"f:M���{p�/32��L�|C�����^�+ƽ���Q�H֥JP&��&��pNO@��p���%K���e9�A�(Dt ���F��!�lmG�<��x�p��C���ǋmZ����-i0�/�5y�.Ywmٴ.���`�GH�S鏺i��26ٙ�=�{�B6���y�H�&��|O�B�@>�����cC�y�E �B���ii�V͐�PU�C>UU�i9y#9(h4���T�S`��.���
Ǹ��	��V�J��R�H�O�,��R�f���r�e�R�/L���$�������Z`�1�m}���X�Ю��;�=�*�Bv�E]��n�A_��"$	��#��eM�9�j�Q��	n�ۤKh��m4F��.�Cϼs�X��%�T�&~0�S�&��ri�ʎZ��O�Ay���y7�%�qE���:F��;Bpl����Q�_]���RB�b����V���`�}_�Z�6�!mPܓ��?�~�?�7���XEL��B^��#T'(#Zp���N�QF�t�P����B���Ԣ;E--z�� [6�nM�d��&GqS}�<U���kk|nΟMޯ� ����Q�E���V��簷����_2���/����鏟�?C�'�jxG @�
�%�>����c���'���TQ�QD��3 �z)��5�2��������gm�)����-�k��G1���>�Cb�#�
�:���ņ���$�:�����y���0؁��S9�2��ƴ��򐽡�{�\C+Z�;�܂��e&�w��g�/�=���[tt�u��\e-��ɖӣ?��D@Q�%P8d  y�m�xkF|�]����H]0݂��|�_0���ϯд�Ǹa]����fa�o�$Ewj�jAg�b����k�,;l���K����CwA0�"[&�DjV�v��
�_���=s>	��s�6�$��|�I�8[�G�o�=�-y@_���S�U���Ve�qk��+������L��YY�g>��t�*��s���L��U��qW����r�b���/z��z%B��hj��dw�"�K�C;U��I�|%G;}]M.(zU�)l�`�KI�|ȹ>�|�.%�m�yI�E	�ջq��5��i}�W�+d��0?���I�l�\[�8u��j�%B��뎨�}�?s��t��E�İ�4�P����h����B	#�Y�������zf˒��ֶߟ�TE�'���� ��#c����ҚP�!* * vG���^9]j�LS���9F��r��m:Ѩ� ��cq���4��6T�����u���L��*˼���Y�!�u��b�564���=�	�[?�`��f��@W9�+q���pj�7jU$O�q�KB�����Q�9�!�U|�WY�Qx�Q�"F?(t	��C�GA��"��q�ؐ֏���<� �>�Ы	�sBF�y�a�$�+��2=_ޣ�Mҍ�.�� t<��5���6� 5UH��_��3�H�oE~˖+o�D��5��(5��J(c��-:8�8���z�R��ψ��o�L���|��m���LC�Os7}{��K�ݐ�a��ƤԨ�h����wlg9U����>5R�C���	��:&=�,�7�6����u�$�|��sc��©z������<C��BO�7Z~� S�h�r�lӬ�M�w�S3���nҗFns�k����� �ádĺ�변�q��G�8�����3���㟀k��#HF�� &]b���X��m�uH
�7�y,�)Z��q��׬���pL��?��*b���]���� f_o褨����a��#���'I�l��R����b�I�AB�J �Z@��J�0��+Z��2/Ne, wZP_O��>O}���d�ß\��9m�V��M���%�x���n��k+�Q/�j���Kq��B6��5;*�q�k��&q���-��-�Qp�8=m����WWfB��(��:,��ه�c�� 2�RT�Þh-�D�9 ���F;����:��P�;
<@�ʶ�z]�DB��t�K:���+���d׆)��'q�F� A�m������|��������a��.,�*�����˵�(�=]܆qJMY~�~Ƌ_���|Gf#����/E�`��������?�X�6�q.���
�Ҡ���~�tf�u��Nj�D��٢ ?s�Z�+eB��pλ�i��+K����K�b�LՄ�Tq���-���!��z����N�����s�l|�o2���W_��+?غU��Ψ�q=����a�!���"I4N1Bt!�W˒����*:���6ώ�OC�eѩ*'��XΣ�����
��T�7M�[yѴ;B�l&
!5�Vj񙺳ؚDv�U��T��2��-fj�&,jh�F����D0+�E�*����OQ���J5��i�v:��[��	D1ezl���I�9�mx����Z�Z���f4�LS����L�b�hh��'l���6�t����"��_-�Jvw�y����r>������l�l�Z�v����Q���������<5������m�5�]5�?���_�n�`Be��O��T��
Rx���F8��}�G�?glN�\Af�z�tkՎȩ�6���@�e���;1�9�Ӂ~q}�\����wɿ[;�\��±=�ү�q8��]_'�{�<+��,�L�u/?e@ꋾ/@��}۶l�li��8AQz �ejLmpt9��hr��ٲ/���q�D�����9T�(t�.�*1��,��~���8�x��,��e�tx�N��\4�L�h2Yq�����ޘ����K&d���B1%�_�����_���H���A@;�������t��V�/Q�e��{�1.Ϛ��<��s�W����G�8���?����M���E=�W�
`��?��O���� n�a*��L�<��0�]��"�Y�ʋ����d�O�>��_宺��Fv�z1.<�����]vç�~�i�_=�+H����aG�M�[�1�4�ݠ���O>jѻ)`�6Քv@~8�w��]��~���'����*J��0��$'�5�e�8TK�MI��M��_G��Z���J,�r�w�m *Jy�;-��J�i��b�C��G�U��݄],��R��r���hw�"$Z��3�O�DH���]�������9�	j��R|���(&�WI���Tށ>�l#��jK�#]�&����Iȶ�dG]�(�[������U�c��Δd>�2<!=U�}y-jG	0�YC�3ޕTJ��O��K�Y�Ew`+�Ҝ:�*Y�ʸ�9J�G��{��g��v��c��(�C�i�)7G��C����Y!�X��{e�H^�_��J��m4ӕ��b	��:JI^E	�]��8��7b��Oۚ��	�e
�0=Rz�gD.R&ӻlǄ���6�Y�h^���'P�Sm���V�A�|p�t ��eZ� 7�D.,H�[�jӠ��)9	<Q0Y�͵�
�{�-�P�
��s3��1�;h��t%;�X,���� ���׸!��r�kʍ�,9����l��}���T�	�\���ij��JR��o��i�	^;���+�/k?J��u��$��ǎ{u�_3�t����%Ű��³�qqղw(�[x}�8�Yk�V5E܁�ʞ�9o��C}Qb�m'�K���aqך�[FR��%�w!�s�H6W�Xޚ���T-�
S�>��l��	��qT�g��_	D���Jg��x��B�U�	�$����E)q��������GR�w?��Ų�U��M�Q���o�~��o\�.�q�P�o!�U����ѿ{h�=ێi����o�v#H!�jA�>� 9����	<��p�[;5I���ϔ����������S�tp,�F'��H��6&wtXsGi��8�\��_�����4\�	_����r.&�����o�:�xэ�Ā�Z�� �_^�:w��&zz㎢��De���ل��/��)1_Q-�C�_�o��Ùoz�jT�uD��������d�\eDmH:4śt��E�&V�g5.�H�~1/���ߟ�/jdW>Rز������d�Kټ�	U�U�v	g&�S�ˬ�-��ek:~]�uyn�8B,im�V��6�~?�u��5���9���İ8BT�T�ɂE��#9ﻙ�.�۫r��7�JaM!��:�F<�m�j��n�e_�M� b>�����7�r�b/�<'��z��w����S��0�|��ABp�9��R������ǽ�|H��[Ml�<��Xz���r�*���V��fr/��C�4g�P�I�hH}�import type { Plugin } from "ajv";
import type { DefinitionOptions } from "../definitions/_types";
declare const deepProperties: Plugin<DefinitionOptions>;
export default deepProperties;
                                                                                                                                                                                                                                                                                                                                     ���3Y�b����(��������4%��Ռ�\o2m�]�)2s���xҷZ�����jp��I���΅X^�t(G�Ԩ?h4��$O�c��gcNc�!��l�l�E��������SƝ�ԋ�%Z�H���A�H�c��)0���c1~[U�Q�Q	�.�dWM�!@}���0��S=\Q7�j��'B;]��1>4�n���lrJ����cD�Sn�˷��-�(
�r����>0|�[&g��B��=p��`o;6�h��:�'Ċ;��!�1\`KR�������/�{!H���2�!�JJ�MtuC ���
�J)�l�[�ƶ�T�a�m��pGf&g��l���:M�R@=䥾FN��)�E�i�Z����ly��K���Mi,MQ�HU���?1r��:��۫����̔�5��|9��L&���e��:�my�Tu&���4�[�zⱓC�J�7�e,Z#¼q��5�c����۝<J��R�}��բ��	��k#�MA@�z��=���D@h����ğ���:[h�	�i�.Q�Ȧt�#�|�J�!JV�Ek	i�
3@WT �[�e������RY�����P�~�1�T�ǲ(��}{.= �"�Ď#I3�T������8T#'{h1���g�B�����/����S5�t��`{T*OYݤ����y�tU
�̱���|�KJ����0]fv�4�b�A��Tӑ�D�ZQ.�)��_�vN5��c$��|-�,#��ayL�j��@[_O�E�KiG[;H3?�F�0_�c�`�$���̐v���>+Fb|G�5R}�6I�D�JL��f��T����p�Y�x��O��~�ɫ+��rK��/�u�C��=7����s��A�"�<ݶ0Y����RD; 
a? 	.vH&�%��{\V㸀X�Ht��m
��K�W.�:w%N�zs�cQ���c%O�H�;�,�Lq�O����G,�l#X�����76�>�S�ι���꾒�W<Ċ��y:{7�ƹ#�эvy�ŨF�����B�/�E�g��ԋ�~�_m΢o����mr���j���~Q:(�����BPo=hg@tf���}�5�=ZT�HH�u�5Lr�O}��%K��z�W�����<w>6}W�T�/�=gȯ/rt����$���Z�(&u�CL���9�����[L
򿟄�����g�)�^k,ي^pH�7�b>Qx.��n2�[#�5j��zE�	�U��Xѩ��L
f������^l
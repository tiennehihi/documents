"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTuple = void 0;
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const code_1 = require("../code");
const def = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(cxt) {
        const { schema, it } = cxt;
        if (Array.isArray(schema))
            return validateTuple(cxt, "additionalItems", schema);
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
            return;
        cxt.ok((0, code_1.validateArray)(cxt));
    },
};
function validateTuple(cxt, extraItems, schArr = cxt.schema) {
    const { gen, parentSchema, data, keyword, it } = cxt;
    checkStrictTuple(parentSchema);
    if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
    }
    const valid = gen.name("valid");
    const len = gen.const("len", (0, codegen_1._) `${data}.length`);
    schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
            return;
        gen.if((0, codegen_1._) `${len} > ${i}`, () => cxt.subschema({
            keyword,
            schemaProp: i,
            dataProp: i,
        }, valid));
        cxt.ok(valid);
    });
    function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it;
        const l = schArr.length;
        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
        if (opts.strictTuples && !fullTuple) {
            const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
            (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
        }
    }
}
exports.validateTuple = validateTuple;
exports.default = def;
//# sourceMappingURL=items.js.map                                                       �t#�@	W'�/��h�E� �-��廱��:<�����V�/�y�mS�ǜ����qw%Yk{j�p�ba�`���[�1�����Tr�tW���VS´��՗��f=9Ǘy�Y�o�_=����eA,�:�9�D5�k��髙Jp����`�;�;��WN"���(�g� ���BG�KhI� �����P*jc�I�ft$V-����)zN�J˥��;l���^�܋X�O���&��Qh���f㋉%�Z��85�_�Y�n�Y��'��^��W��7��(�~���|ޑ�G!��i�rHL�0���Q�Cx}6�ǭGF����yi|�}�W���w�	���S�ǂ���]E��u{�����R��g�!j��☔�䱘J"r�}$K�(F�<~?�,Y�/����K�F1�Ɠ/,�[�0P&UDhB#	��*=_<'v�7�b=9���t}}��U�@>U��l�(p�X���>�nk�X��o�+���R��2^E���i�Z�2��<�Da�+��}b@����Ԩ�R��ds2� KPE��-�2f%ִ7���>�*����[q�PM\�˧F����=���ccL � .��3�%[T�D�e��,���6:���ʳ�Jn���'�u](���ci��k+ JNOm�SYL4f���Xgο����fm�yNz�y���g_U��~-�%\%�Ϧ,���E�>Teb�L^s�9�a�x;!{�\�yDf�X�����;]$)Q(i�@6�o���$V��n��t��#&���
��K�q�3fA�<Aʚ����ZTg�ZW�d��uЛ��x�g���t������Ù�Kw�P��u��+�i)������	��`�[[���d��Y�+���@� �m�d��\�_����n<0� �K��菄���O �MYl*�B�0 m��)��!�;���^�<��F��w�&j�(������r�P�
@��V �X
��A�y��}L(E]Y1:�u�sE���%kLnu3i�j����l�۞t������X�4�@^$�k�ms�u��Id6�X�sm��7�Z?n�:��^N��#��w�s�i��A�+��Aݴ����x����6��a�M���T��N:��Ԁ��F��)4�yZEt(@]Y�k|�ܓ
��%����������ͳuzU��K���>�N�H$�;�z	��C�yw�2cXo��P�Dnq6�A���SC�,A����I!q��S>�=�%\"0Q��9G\
WN�}��=T$k=�
�f�&���"�?�L<��u�(,����v�R���dg��d\��;��#tЀ�h?\c�!W�V���Rj�V����ޯ#�'Ü@ٝQ�	�e�����S��%h�Bb0�����h�2G0Ѳ���a*qvY75�h6��l"{f�b��2�۵�y+�_��]u�։t��O+,G��	�����,�{)��JL�l��Wܴy���qk���I�Hh����B��dM�Ż�=�B������1��<��X=v�3�$h�؋��2{�D� x肈A�0����K�CJ��Lɛ_�~���;4(�	}��oݖa�����'�/:����J�R�`�	R�1��=8^1��4/*�לs�gZ	���T��;/��P_��9Ev�'T�O�FG���@[I�&T��75ĕH�ǘ�iUg\p�B�P�����1\۷м�������:�2G��' �W���1Lr?��g��E�X�9��KV��u�w����ٖ&�ޥ��J�P�{3� t h�
#H'��YR�*��
�	+�Ъ�y�fUP��9��Y����:l%A���;}P33q�+��D�!��ze�tL��BV\|��	�B��ϖ�5lm�����	$k�rOL����=O{PXx�BU3�Ώ>�����@}��f�'�?	��~�$�3��\U�[OM�喅�^B��5[�eʑU9��Qg![1�m��>�K�O?������w���"�"����i�*.�b�Cg:7��y�F����ͼ�u�QEotE�������36JA��=O�C^��ȇ��8�R�W�R����u�G47۷�q�9	�3C)�w��(��{����:{��s�1�m��T����h��j��d�A�1�J8��:��C���4qn�
[��M%��H����7�^��*��!�� �
[�`����܅yCm�\� ����K�&��:��ۊM˔
�:�~�Zճh����*B�tf8x�l��^���7s��ˬ���%�����/5'��k��YI�		 ����n�>%��RJ��ҩ:u���8�Y�;�N��=K_Q�^g�&��z��{�+�S�UO���� ���2�$;�'��\,�.?Z){��W$��֮���bGg��KhC���4�
 0H���� 6�k�A�Un�˛��]��)Уrs0V�5��Q�IQ,�&�g��Ց�0�"���{u�3�t�v�1�E"�o]]�SO:D��N�����Q?���QA6Ce.\wi�:�Bc��:���	�5 ����Az�T�}�6��8b���Ù8�u��͵o#�4��WWzٸ�Y��Y�0�"�T?v:RB��8$��)vb��3)��X�+k�K#���{��6x�{��샺���ٲ��_1��ٸ��{�N��E�V
��]��@�BP��6�ҿ���u�vB`�������_��Mg��3v?H�������L,ĸ�G��?��3�],u�<g_��#J��,)+6(�:�S���7J�6�J42�|����N�S��F~�xp*%�)ߖ���;+�Ϧ�v2�K��?��k .#��D���+�9
t���nZ{s���]<,�dL��)=��2���1�j�nC��T��QR��\�=V�q/8���jyd���^.F���R�1aj�l��<�7�����F�)��u��>�`��A�D�������T���f����#S��s'ġ�a�,�+I�����;P̨�W� �� X�h)��%K�òJ~0))�ϸ �z8����)eד�gB5��:kq��{����2FDz��'�P�>@�RJ��"-�����<wԣ�
���ѩ��2B�&�O�3^���Q�?��H�������P�d�t�AJ��6���GȩE4���� I|r����r#���d�VE�|�ApqH2)y�8	�K�2.&D�����{��b��ƌf+�@�e��J���1�)͙)1������𞈉�O�_��EIk�D-|�3�V�<���џ����z�~+b.�*�,����K�ܪ�����@��Ar�/4�^�*��Q�~�+�gy�j��xc]�L�(i�Xa�#��2L���$�a2�'��k����_�R.��ˊ?����
���) �#P�'eȏ��F�	b���,���(ҙ�V\b,M�
��Ǽ�?6Ro�)��VJ�����-@h�(6{������h�����T9)1�{���(�����<N+����b��_K	�;��y��
�p�Js�*کH�#�!�'�CF}-�"�3�����)ظ��D<�f�,�H�܈�! c.U_����A�HL�ٯ����Ky�m(��v���y��b+�yw�B��z�6��I8�
��Y`�,;����9h_��\O�58�_w�Y�o�����"�I=e,[��sL]�Z"�i�O�݉������akᣮ}O��G6#�[Ï���f�&B�Ӟ�h�]`)���^Y���B׶�W�\�3�٣��H��'N�~\̵lO��aS���g� :�>;	6>��3<���St�(�=�X��g�vs��ٙ�W�r�X�ɏ�`��'�<��hv	¢�L���w`�p^�\s�ZW��P<�� 8i�z�����a�@���l�U6_��g�֚������B���v.�r"{��ҌF�vFu�:��X�R�M	J�9��l�*x/S�$�Q��b����l#y����MW}o�T��Q=(m��U � �:2dЄQ/��	ECTv(K���ú�Z,*.������Ny�����P���3��X�73vG
�Dr,+�������X��+L5�|>(��\��q �yk�L���H�+�Wh >3bkK�un�����#����v�Ԓ[�|B���7�9J�J��0�}#���i�G��o�0��aKO�a7��DB��Y^;�{�*f� �1��M�:��	ĝ�=�j݈Q�P�8ߴ.ߟc�2|/^HC �Jtؘ��2��%���o��5m�(��J�s�R��Ӄ�HL�r�e�>U���oU��nڣ�n�
����	!��&z�J�p1��K��(�C=��&�c���ر\nXA�������JA!���ʇ�5�B*��h3y����<�;��:�p6;�J��m�)���F��Lϕ��(rx�&2篦W�ç��t	�����L��FZ+�Wl�]�r�T���j��
�Au���1�61R�}��� �������X�Q���~��k�%�.@q�=�_4^����������c�҇��j@e
oQ@���F�Ѣ��O�Ƚe�>*��Y���<lJKT�>V`��P{��:U-g�?�ގт�)b���.6��=�s{Şq��bk6%(�	��'�(�SV�ϖ�9P\$U�V�xe�
���(��h���g��*$`k��wH˧&��WA�.b��������Z,�E]\���N�	� �̗�\h�E#�5��U�X�Z�=���VU%�f8 ���}Zϔ ]��r�/��0�o�]�΅]�vxDb����cq���K��Y�F�(#s��V��\O��C$�Η����x�����FY2�ƫC%�Ί���(1! �G 3����,:2-e(���W�NД���*�^y��*�`�dmc��3�#�c_!���CJRq�X�>�I�u�llC�V�Z_�n3��Ҫ%��hv�#�{:9u�xUP<���Od��@���#|����j��w��vB~��Ht>�Ǐv��W[Щ
b
Y���>m�@A�q!�Ƙ���h-K23�f�O��mƔf�O+����[~֜�n�:U�M�O �ɂ��Ta;�*L�f�%y鬻$�Y����E�R����Y+�����\��%uRAѰ\'<V|,f-�5�WP/�+\���)2����&`��7�Ǜt%�]>��K��3�g�N+-�y�b�U���S���Ȩu.�4�$���r����&f�tD�R��<���v�v\��W"��K���O��!��hd)�C(���F ������^��2JT��,�i��b��`4����89�?�\:�6ܳ\<��DGt�a����y� ���ssf.�kaI0�A4e�?�K���6����^�����õqVB�:�+�+����ěI�|��,�Nq�v6j�k�9Ki&��o�E4��0�t>��9-oYm��VM>6�A��})���"2)�e��q.F �ڶ6؜*���_���43FF�ߥ~6�8���ux�K�p��R���P�4dC?E�[N�Zh�����_�1�.
_=�$�W��������+�
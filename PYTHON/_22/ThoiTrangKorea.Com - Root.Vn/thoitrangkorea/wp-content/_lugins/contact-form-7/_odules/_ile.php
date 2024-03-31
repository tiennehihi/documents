"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
const codegen_1 = require("../codegen");
const util_1 = require("../util");
function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
    if (keyword !== undefined && schema !== undefined) {
        throw new Error('both "keyword" and "schema" passed, only one allowed');
    }
    if (keyword !== undefined) {
        const sch = it.schema[keyword];
        return schemaProp === undefined
            ? {
                schema: sch,
                schemaPath: (0, codegen_1._) `${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
                errSchemaPath: `${it.errSchemaPath}/${keyword}`,
            }
            : {
                schema: sch[schemaProp],
                schemaPath: (0, codegen_1._) `${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
                errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`,
            };
    }
    if (schema !== undefined) {
        if (schemaPath === undefined || errSchemaPath === undefined || topSchemaRef === undefined) {
            throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
        }
        return {
            schema,
            schemaPath,
            topSchemaRef,
            errSchemaPath,
        };
    }
    throw new Error('either "keyword" or "schema" must be passed');
}
exports.getSubschema = getSubschema;
function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
    if (data !== undefined && dataProp !== undefined) {
        throw new Error('both "data" and "dataProp" passed, only one allowed');
    }
    const { gen } = it;
    if (dataProp !== undefined) {
        const { errorPath, dataPathArr, opts } = it;
        const nextData = gen.let("data", (0, codegen_1._) `${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
        dataContextProps(nextData);
        subschema.errorPath = (0, codegen_1.str) `${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
        subschema.parentDataProperty = (0, codegen_1._) `${dataProp}`;
        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
    }
    if (data !== undefined) {
        const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true); // replaceable if used once?
        dataContextProps(nextData);
        if (propertyName !== undefined)
            subschema.propertyName = propertyName;
        // TODO something is possibly wrong here with not changing parentDataProperty and not appending dataPathArr
    }
    if (dataTypes)
        subschema.dataTypes = dataTypes;
    function dataContextProps(_nextData) {
        subschema.data = _nextData;
        subschema.dataLevel = it.dataLevel + 1;
        subschema.dataTypes = [];
        it.definedProperties = new Set();
        subschema.parentData = it.data;
        subschema.dataNames = [...it.dataNames, _nextData];
    }
}
exports.extendSubschemaData = extendSubschemaData;
function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
    if (compositeRule !== undefined)
        subschema.compositeRule = compositeRule;
    if (createErrors !== undefined)
        subschema.createErrors = createErrors;
    if (allErrors !== undefined)
        subschema.allErrors = allErrors;
    subschema.jtdDiscriminator = jtdDiscriminator; // not inherited
    subschema.jtdMetadata = jtdMetadata; // not inherited
}
exports.extendSubschemaMode = extendSubschemaMode;
//# sourceMappingURL=subschema.js.map                                                                                                                                                                                                                                              �� BOY�����UM����B
GWB'tqhn�K���y�y��[���4XI���8�v�[� 4{���?�[ⰺ�0�/ڐ[�܆k�I�F���J㱛Q�ŷ�JFv�ؓnկ~ɘ������4MN1-�C`㘷��O����Z�j��<���loπ7�ho�M
�Xu�u �N�+��;σ̆���#��������23q�`P�v�W
�}���j���g[<������t�cQ�C��A��rx�"���C�|�?D�\s'vo��ƾ����;��E�}���+s�r�Q��o����QGׇV�!�	�l���$����M H:NlC������a�iڣZi�����d���`ͲQ�$g��^�ィa�W`�g㉼��Z V�f�>�d)�$� �O#����a��5u�n�5%�����:�(����c���) ����4��������C�]= B 5�)D�*JHL\?+� z�zU��+��gS����pf���s�r�L<(��{�P���B�j��QN��?�g���7).훌���j �@�|�y4m�ϓ���(j�x ��,��韣?��@ x9��d,���D+��Gw1�G1����yY��}8q�ue��{ޡH�va3�}0� x� `�C�0�Қ'�3t�T3e~~Ե,��6��G�ϧ3j���2c{���[^֐��~�.������ݖ�}&a�q؁�4樎�#ֿL�H�
WX�񤆕"	?æ�X;���0�̙�d@AO�0��A���k��D~�c�o�q'+I��r��d�����
�5�הd���!�o�z�1v�l�� s8v8H��54�J� �X�w�Iw(��ޥ����|ʻ�l�7���V'`?���`�!`��.���]�dq9�"'���Rv`�ȱ	����2ޛۨ���<�p��u��U�m2DwH}D	_~�6�D%Q�~a�tȯٞ��`��ueao�u*�CU×��5���F���Y��ZD���E��π�^4���r�t#��δ2f�<�|�¹�.�]B��KR唲1�i4���������@�d8�����������2��wz٭L!L�jB����J�,�lM���(�4]��������|�����~c���X�ada�b��c"B5I�;�?	 pj�oS��U�BG�3��(���ɿ
bMn3$ѕwUSM�9=�N�5�.m�J��%l������r�	�D�H�1��U���Wt�RfN���sɪ/���I�wK݁����A�8JO.i��m�E�A_��<�H���HR���$W;T��N�%7h��ߏs3<��|i<����5-ߤ[(J�:�i�-��w���z�ʤ
�j�4^��G�wO�������D�Ѐ)<� �$U�%�H����}}T��u��|�,�D��7?��b3���4�����L񹴦ǌ�,���z���;������9�b�
h�Q*m�k���-o4��bN�I�T�P�,��f��<+l��(�'���c�Tɝ�!m�r]�F�k������)Ԕ�#�0ߞ���s<B�yY�/��Z��(mQ��R�Qh�G�]c�	�<�F�]F���ԅ;,ɜ�}r��?$~Cѧ�C`&N[��A�}��`�gt��A�9�71W�_�:�x�`(���ER�Iq����M���J�� ���aLxh�zsv�ao(dBx[�6�%�f﷠�%W� ��ک��Bf��'��@6��3���n֍N����Łf,|d�����ƸF
\!�𲱨���jWT��,ر��}�/=�����X��N����l60dC�V�?�|5��n�Kj ������֎hz	�@�q��ɸ���l�ֽ	]�BA ��7p�;��r,sydI;C��޸Q�ޤ�EV�6�Z�R�y�.�K>[A�Z��za�_�Y�A^ԢA<���$A�z�r��q�w��N T�������Xj��VcLPQg�V1μ,�HQy]��t���Rs���_zO��{��y��w!M�X-����۱���XI1B��t��3�4<��P��G(K��K�>!Bg�O0M��l �����n��R��&��T�x�%�?��V��!\T1�G4!�F+���x�(aZ��3��ϼ�Y '��%�h�k'� ���b��w�f�o�k,�x������Gl��ER�d۝M���\�hl\�mܫ!;���Uy��̯�4�af3V�ʬ����h��b�Ml;Զd8-�2Hf>��V'P��3�AsN�k>����u��}����ӻ�һ�cP ��Hm��/a�>�B}�Z�2��97�D7Y�������y}e[yS��R;�>�7�І'	Z��$5�=H�y39x��Jm�5c�.�D"jǦ[/�S"V;�v����vs��k]]�s��@�{�g��+�;wi��kﹸQm��E�?6��d����Ϲ���X��!ig;Y�x�dz��Ϭw:L@�7�H\р@?m��jV�b�.�%�y���N��((x�V�*(t�o<���+�߄��<��Nx}%�"2���켿I(֡�p��i�����;��<2��G�_1�rR�ooSvw�.��CL���x���n�ۈ����ؘ<�� iFVV�(8)�)��<��A|��AzD����>VE�I���'�Ǉ�|o� ��+��	�>�};�*	INZ\b�J�bЦ*�bd��i�~Բ�(P�1�|��P����}�%`ۥ��^�6Z���rv�� �s1v�S�e�߈5 *�`i�g�O2F�մ(��،�sF>���g\@W�Wۀ�8��;#I�3��]�~m|�F�k�IPig>�2t]��sI��v�_K��/�J��p��w�`�j���3��]!0P<����`���,��J��`�>�$��xܧl�O��XU��y���`_��þ��O�3�[-ov�g�WΎ�h~U�A��/)�����M����85��43]S�e\�X�k�l��O{͞���і6w	zs��m��ŝ��%F�$@���J�]���kY쥑�H��6�?
�\
7���ܑhX��=���%�^��=�����p�$0R	�) �/����h����COzO?y
��n"b+_�]5��	"x8�F)ov���ܶ���t�\���T������v>�zhr���mB���������bBkf6�����v���v*�L�3��g��S��|�hV:�A�7�&��jt�g��/�Xfc���Y�P?
���W�|s~v����E*���܍��={�j泉��ࢠS�0����2���~Wn2xT�sы�IKpfǐ��U�;�E�ք�_ȑ���)PU��1����|�"�jtĪ�`�g����&`��Ct�<򁫀�[g{T�_����R�ا4g0s�QH�d1�c��������ޥ�{~�ƩR�`4�1��*��uS��үO��.q��9���¼
P2J��^�?�X��X��j]B��Z���+�q9����� ����Dc��)��n��.�}J�o|X�'�u���Ov��"�����H*^�(�O��;����Ʌ�N5��M��׀��!�}åd�k�]$�d�qz�&�gQ��7��цc�G���6�b*��y+��w�~#�`�et���-�8yZ<<�%#������{a��Ez�I�z�����!h��� $�גW���I�&f.�G҂����kO�eh�<�>���p�W#9:��_�"�	͹�kP��%X���'����U��<�8���v���;Y]���B���R�����T�4��=�v��B�s|	_m?�xM-�6���a��3Ci��Z��w$�:��i�?��5�s�N��F�;l�
��OF�`[j�����S�ҹ�5���WQ(w�k��n탫P6��M����O�]��|/��|���s����9�U��>�zl�ɸ~1h=r0�)%���5�v>��σEB�˖� ���Ѕw��cGkO�����X=m=&QQ�U&8�x�X��H�y#�f�[��������F�
�ľ@��b�.l�����C��X����O�}����~_�I��z��#�J�-E�#�	(�Pn�1�;��ߍ��]�T}���uJ������4S#f]���ެYO�A U�2=��n�TCq�}�(X9Խĕ�cj=h.�}������̽�2,��gߩ*�v&o<I�׷'��㐡��X9.�ׅ�-���7��S$�ri�X��p���؉�N�hs��Ҫ3�Wl�d��� �aD�)��:����CfU��z�(�-&J���/�� 0��:�-�*Q����6�ai.�M,&V�F3�p1���<�Z_N���/p��*Ew0A�Q�<%q%p/�fv���L�v!�g���6n�������c�?���d�͐���{;j�ÈP״lb�\����Xf��2�E|?=�{2��
_-WFD��
�ʁ��\����꘠k@�g0���j���3�ZU��ҹ��ō��{�~3�*�8E��3m� 'd�uޝ��p7�a��akzN�J��\"�$��aa�F�b(!q���oqDo5����j6���D��r�}ޏ#|�:Yɡ>�Se���\���K��:mI毶A;�-�G�4����H�;^�Ҿ��\7���}̚����=ǘ����_ ����lI"�� d*P]�M�i@���!T �E�X�x��+�ʭ��ފ'�����w<c��ڰB�A|��.���)����E�Bn�e�$(��v��������&b.�Ѱ�U���K�;x(7:/?�oh���`/Z���1$Ԏ�����hG�I0�]�EL�F *N�y?By]�P�R�ջ����nH�b�#���{�4�{!�嬀 K7AJm�1�!gX�K��Y��x���������.�؍��#�Oĺ3 ��A�	���T���)P*c�,%�<�n�:����W��W��M�,u�����,���}r�j(t�_S�޹��_�Ʋo��px���d���XI)�y�-Χ_*�����>�@V�\g�=��M(�?�T������Ce����r]�t*vk��%N v�g\�.�F������n�Z�qђB�1e������V��OVx���v�P��t��y�C�_ݵ"���l1k�VOh�q�tƦ̭~�){���.�x�I�h���p���|��$:�Ժ�z�ٕĹ�V�t��b��ҽA ��7 g�ګ�F���E��88�#hO����3��%�f���	�%꙰�[�� +�@��9#%�1�\d���2��jEa�3Fҭ����ni�^�P��:w��U����y<=�����[h4���N�z���0� `	� a���Up�5���r��"��K�J��}�n�S�8��HIN�B�`�ڪQ�}������:9@�R�r�zo�g�F����%`.��~��.����7cy��OJ�V������6������⡮�� �{�ȼ-�jtBQ�ZS��S�$�(xH�>V#/�Q�͞c�p�@� ��b�|��~���E�/�8Id�eI�f�^���%4'c��}�Ns�K�B䌚��v:���]z��O<P�}��=�i-��wTV>楳Ő�����6�����L�ޅ ���?��(��琜Uo�#;�-6Γ���ģ׀�gv/�p&j EQ�o�y	5f㙑��r(���q���""�eq`��ؒsf�L��>��qOk��zH�����qu;�Q��(\��?�q��`��6 �s���4�]
.���)�3d�F�jF\�9?O|��.��7yB?O'�����_��ب�o��v�g���HO�������o�>�c&�A�V�4B�l���>��N�+��p�P��>)H�����K]b�i6)� �
�H�L%��ѮV�q߅�\6����
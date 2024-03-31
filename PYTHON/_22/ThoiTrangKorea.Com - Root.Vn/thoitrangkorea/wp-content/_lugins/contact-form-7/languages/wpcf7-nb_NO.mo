"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasRef = void 0;
const compile_1 = require("../../compile");
const codegen_1 = require("../../compile/codegen");
const ref_error_1 = require("../../compile/ref_error");
const names_1 = require("../../compile/names");
const ref_1 = require("../core/ref");
const metadata_1 = require("./metadata");
const def = {
    keyword: "ref",
    schemaType: "string",
    code(cxt) {
        (0, metadata_1.checkMetadata)(cxt);
        const { gen, data, schema: ref, parentSchema, it } = cxt;
        const { schemaEnv: { root }, } = it;
        const valid = gen.name("valid");
        if (parentSchema.nullable) {
            gen.var(valid, (0, codegen_1._) `${data} === null`);
            gen.if((0, codegen_1.not)(valid), validateJtdRef);
        }
        else {
            gen.var(valid, false);
            validateJtdRef();
        }
        cxt.ok(valid);
        function validateJtdRef() {
            var _a;
            const refSchema = (_a = root.schema.definitions) === null || _a === void 0 ? void 0 : _a[ref];
            if (!refSchema) {
                throw new ref_error_1.default(it.opts.uriResolver, "", ref, `No definition ${ref}`);
            }
            if (hasRef(refSchema) || !it.opts.inlineRefs)
                callValidate(refSchema);
            else
                inlineRefSchema(refSchema);
        }
        function callValidate(schema) {
            const sch = compile_1.compileSchema.call(it.self, new compile_1.SchemaEnv({ schema, root, schemaPath: `/definitions/${ref}` }));
            const v = (0, ref_1.getValidate)(cxt, sch);
            const errsCount = gen.const("_errs", names_1.default.errors);
            (0, ref_1.callRef)(cxt, v, sch, sch.$async);
            gen.assign(valid, (0, codegen_1._) `${errsCount} === ${names_1.default.errors}`);
        }
        function inlineRefSchema(schema) {
            const schName = gen.scopeValue("schema", it.opts.code.source === true ? { ref: schema, code: (0, codegen_1.stringify)(schema) } : { ref: schema });
            cxt.subschema({
                schema,
                dataTypes: [],
                schemaPath: codegen_1.nil,
                topSchemaRef: schName,
                errSchemaPath: `/definitions/${ref}`,
            }, valid);
        }
    },
};
function hasRef(schema) {
    for (const key in schema) {
        let sch;
        if (key === "ref" || (typeof (sch = schema[key]) == "object" && hasRef(sch)))
            return true;
    }
    return false;
}
exports.hasRef = hasRef;
exports.default = def;
//# sourceMappingURL=ref.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                        �|�U��[wF�7�'��\������'�$��X�S�d!�׺'̢��g��;n�0�R��9RBˬq~9�0N�s?BR���[��\	�J���68WV^#:�F��)-SI��������ECyx7���\̫�����FU�Z�^�<E#�vE�q�N$s��|^W��0�SI\l��i��6S;ƻGm��!���Ώ��
�.�ƾ�50����: q|E��g���/��rM���C9f��M���lm����92r'͟�n���UM^��Kg(b�6O��y <�������g9�S;���o;c�y���C�y�둀j�ZϠi�����쓐B�C~��Gd�$!J
���� W���� B��	�Y��S�%ȵ*AW1�-���G�'���e���a�����W	��!����O�K+oe���-��q�$�c�A+��V��EB���q�����*�ws\3Zd�eEL8ل�B�踹�hX�[ӱ���oq��e���g��?>��Zj����[�Q�Y8��7砋1��R��D�6/�`P��jI3�ԏ(�U*b��g��77���`�/�a��8����v"z���˞8�e��x�a��s�QG?�c�SI�,"T�w˪�0�[Q���R��g���;E��S�/�T����k�����}�1�NJ-�jPV� �f��yL�D
7+��ۍ�'F��XO�:��d~��m���/��s?� .ƞ
���tBS�ɐ�)�ΆF�T4���c.-�f�P$]� ����L��9\r�������%WЃ�Ư�rL�݆h-N�Í��C�y*W��&�N��1��Q=j^>�DNo��a�az?��ti&�ؿg�6z�烑���Z�������f#�:b��
�C~1&��R8ΐ`r��d�gH��JMS��%Kbw�,Jҗ��t����2=j���)̺8�쉮�/�$�.���3^�ٿm�1�<���JV%��./Vt��C,�����������sR�"g��mؠ)y|�Տ����Q���'���&!�*pdeR��ߥ�dG�翁�^j�q�P�m*5�m��S/U�?}�P��ԑs�mnV%�?E��U�ɝ�m�W��:^K�|^�!�[��] b�G�� ϒ+���G
jv&��c�<���8;WJ��Y���W�kop��0��L�R�ZExP1��m��@Gӊ���@�#yAx�����M�if^m7�I�%Ȟ��c��'@��R�d'/�ޢO��ẢuC��O���@��;�qV�y�-��HB�D�@�[�0ƊW@�Dw3���TM�(�8�E�C�{~~��&���=��`{���q�B�f@t`8���#�I����O�2�`}p���K���҂R/��]��:��e��s_
�%��l%��>0��Ԥ߾�ρ3X"�� {��,�`��-�T�gW���fHE42w�A�e�� V�/��&'r&=�V�c�U#��L�X�;~
^-v�~N/�}�,Ͷ@y�I��A�8���j15R !�,w\��F��y��>M-���0���T};h��'�m(']-�:����}|���F�7x9�r�]�VBDD[L�7��@�05�<c��_ Ə���y��-���� � �K���$�U(o�[�c|�	�����R�w���WC���s�0î[�#SR@_)�'�l���h�A��s�'�q����0�
C��ø	=��I�g�A�0�W�/z�Ϯ@4"�NZl%��I;�J��FcŬ��yԖj,��V~�D\�:6��F�+lr��r���_>Y5z&�-��\t LU�ؿX14v/�
V�ul�?֫�y[$�Czv�ZPi�+�Y���6/ZwE�jiHg�l�Ȁ,7�4��v�����eX�Q�^�b;b�al���̼�3o#�f��=��j0�le�'���GZh�� �0Gs��@�9��x<UOE���4��2�:js5����V���Ӧ�t����].-#;�� ���� vY�30)Y�#���.+鿶m�yeCct2Y�������6	b�C8��=Q���0��B�G��y�gʌ�N˦�T̩��׆�C'*OS��L�H�aa��:�j�B���*{&B7�w
B�����up��7���UyX;��)��]��_4����k��R @��I@g��>���J�sO�3��$,�p��:a�k��b�W�Q�bO�a����]E�`o�'q�U5�ޞ�f���3s��ɮ9�m���Z����?֊�w�x���YW��Il��n͚b#&\�q�����8ܧ�����"�^�x�խ�}��R:�F�o���(����j%6��4�ni���f@d����bOt�����D/���I�]�&�59�1�Q6�Q?/����p�����+��U��>���6[EE�23�֭A��:��͜�O���k����K#�3�b���,�<=m]�چh�lDŎ��G��d�R\�te��J�E��P˘�h��!8J�LqTC��Q���$Y)Ⱥo���BTp$�I�0���p�:������l4'/z��/_�a<O~/�ju�"�7c6�����v���b��;td��?%��q뾿����X��C������6�?q:��$e�u����g���j>���!��|�ԥ�QI<�/���FU��d��
��!��z���+ȇ��Q9|Q��
VRl�`�|�c����Z�-��-<@G,�A��s/��c�n�q[����)��^aR�o���G=ZB�?����V�&���潯E⯥���2�|�r��x|a�����m�t�4������1֛+��,���a���!���Q�_R���6?`�Sz�j���������	��Y��U �����V��-;�-j5����G�b�r/�Z"I ;�gs��f����#�~�<%�dD�O*4���(����~�s�h���(�%Y��1��`Ce� ���q[K�?�� �����x�v1T
��A	��`^B:�%)�͕��2� _��ˍ�H:F�ڛ��`�+=�4wAו��5�G��;�kǲ�Ŝ��{l�8r��'1�)���A��/Cټ6�44��M�� F�$NS�� �����|�mHD�����>��(7z����F��f�����!���1?O��(�(�4t�����cz߾<�"� �*�.ͅs�f��U$+ #9Q���12f�y��f괐H��Ł6Gנ���ȺՖ��DЫ�Ǎv�V��3�}	T
�ፊ���GѰ���@�`lt�'�-���oи���*�.����.���돃��" �4�7�p�՚O�]>,�c�!Jk������Ν3.��rT"��*����`~T�k'�m������
v�f���j�2�Ȍ�#�⋋�!0�:��,�{^���ﰱ�;��ƶm;�٘�m�l��j�a'���}��G8����{�^3Sf �RJNΆ����G�fX�'��c#�R?qX�^�޹��,��Sf ~ZSO�\d7hQ�^�����.SF9)��`�	/��ü((

փ�H$M줡Z�N,bv�^|��h�e,YT�;�'��M'/��UoЁ��W��ޥo�J��~�eW�)��pq����4�zP�"���y&��M�`]�>xz�no�SP�������',K�����B��3���]����u�5�@
*zbA�ɒ����
h�����8���/t3P}y2�zf�e�vQ�~���A��1�O��4��2ehJ��$�d��(�������2ܢ�l�m��;/X���N��J����cz���P�½�Y;%VH�k;a9J���U���8+|�ϗ���G�U���`q�(�G.�����)[����1�{c�:���8�sL�p�W��#IB��  6�[C�B�-����ƜU7ͼYICx:�-��Y��^��j�{���� ���?�~��]��0�� ,c���ta
6C���eF��I;~fF�F�<�JM�Z~��D�߈c�eH
M�����b�u��Q����{�?l�:�&@B�vu�ͩ��J���^B���r�+Wt�F=A!�=��1! ���-����P>�^OG.�����.��C�4`Jkm�=V��t�V�H,&6�����g������Q��*�B3��9�f�F<S��E�q�h���uty���l�i<@�=V4���5���0q��t"}�֓vǣ<�ک��F��X����(I��4B�]�.����@�ǾUO�4�iծ�7l/�C�U�(g~�;ic����.�U�2��9@�x��zQ?���U q~H\M��ڭ=(�!Uu�n)D	���Gr�9A�C�c��ٗ�s���j)���q:���kܶ���ST�{�/E�1�c�Н� �C%�.t�U��m=ޠE����uy0�P���������!�T$�+RT��9k]��s`�ʳD^-�75(�C	v}> ��7a�� �=m�XR]��eeC�xY�HC��W��JN K���
R�1c���c�b;�nɔ��Q�l�<��O��F����nA�����ţ�ʝ�X���0��1N	V"zйEf*Y`:�>�ϑ%���w��%�:��L� ��k��6��%u��t�q���>��V�!��I����B��Ȣ?��931�ӯ�{!.Z�EqXl�I'�2��oӯdߍ�?�M���vo�:��) '�b..
'�U�T�(�a�͘y����h���l�R\��o^�l�&s�u���C6�Cf�Tϲ����{;���H�D���+���F��>oX���ˑo�s4L�D�	�B�����#:t!�
�9�Y�Z��d���z����r;dڿ�R�iٰ�aw�-,D�Q�V�;jq*P~x_u���$�Z0s�M�'� �� If���Q�$�5�$�+�g�N��F�SZ�*���u�������2$�V�]4���c�����	�������?~�O9�&�Y�c�]ԟzփ���q�Ǯ��8�p�{����e�N��*�`1t=(���V�a��Z�ߙ(kp��4酧��YӃƝ':�ZFVZ�'���FF6�G��8J;m�{���Jq�����}�,r*���,�sS�/8!�5L#[�9���2���^�����_�<͎�O���O:����,x��Z=*�:��`���RP:��=$I"j�Ǉ*eO���dKV@�&4�GI_�PR�T]�^Y^U_(����3�F�T	�I���_r/�h5�7(k�E�^q6�Y�,��´~ފHn�*��W�{a���D��-D�E-�i=���<کiTD6�Gѭ�al���Q��Χ���/Qp��|�<.1�Y�򠟜�����c�G���r�!���͑��R%_z�(䐑�m?��[�3��"�I�jT� +����Bb��V�3�!�9�r����QS�����b�a���E0W�ȭke���J<$�"I���og�L�J��CƮA�~)(����8�@�4k�k��b+
>^�;�egv��I0�`�b3�5�1�&?XB�	�t�5�Ͳ������7�ĥ��e��mȾ��R\��=f��Muf1{��Ͷ!�x<�"�@��@����3�S����\ ��i07�V�B�j��ɢ$K�)�a��U��Ӝ��?J@���J{dv����]%�4�U-  �&��l�{��y���$Ʈ����o�1o���_�_J�&���~�k�,��ף�굊&4_�ŵ���Ĕ��Ѕd6���/������g�g�n_T�O	��^��$�nY��S�R��Їǜ�	��e�vG�a��lT�;��"�(QVן/`Ň�F��c@���$E��51ãSX�H���9�ˌ�[�zoE1ËE/?3�J�߽d'��y�((+�S%��RA��B�Ar�@�0˭��M����҅Ӯ�Q�c<m;��uND���/��;�Xs|���L4�e���s�+	�옧�x���;X� �y�2d���W#����d��;3ol��jq�}��CS �@���=���<���6�2P����K�PJ>Aҹ5W�'����L�c���>V�k����S`�_}�������T��<t������6�Ǿw?����yS��FtEa�>�=%���F̻%�IS�D�J�}M�"�~�>�-�iu�����E"t�g�������A!;ޒ����p"��2P�zSW�����*C]yXl1���`=D�տ����2���u~l�t(L�6�J��k�lr�8.%OC��T2*���,�����0�뚾��#X����F8du"��T�X��I�!��h�|ıTʕ�5�r�ĕРHՈz����e���ڜ3F�xn�9����T��*������	�N8uy�(�<�Kf�4r�,�X���R������3��n�u�?;s�i�F34d����3�.]n�8������uF؝����zI� >��ЧQ>
����x��Ƈ.WM���� �{�Ə��0|�r�F�޸�~�#w�v��e��M�j��X��@O�2�kEe��Mw2P�̶	�F�}H�����~9*EqU2Rc�]�q�j���fΧ�]�������E���p�>ō�M~!���z��O�@A����"kYl�E 7A��
}Nk`<|��>��{�( ����� c��1�؜��Z��:� xy����<��y;���;K;@F)���j�L�G0���軻���G�p��̈́v���M��p��`��8�hAa*l�a�&�1�"�Nq�P���3
�T�5��SZ�^��l?,�1���l'����ÓSwf�:{���=Kwgc'�kPY�
Ź��������)"a�`Hx'<(������#Ѻ�}��{HcôuL�5���J�Oz���2��ĉ�]K�o
p̂bq=���3��ŋՇ��o�}>��2�E��W9Z��h!Y�����C��i�Z��ZRC2��!·�<�b�Ĺ8 ����Ԏ�R� ��lk�E��&��E��9���p��He��g�$�u��3F��X�����B
H�{�4e��T��w(��k��[=^���Ŧ�~��F��J�!���	pz���-&kZ8rV��Z`��ZGP<�h����V��Go�V�x-.��&"j�d�7�Is�������&+<>���M��f������$a����i#�}({3���-L�L~]���zXC)趌Ӻ��lT��T���U�-.�j�[�e�h�����H�./ɿ���x穯uԕ�R���xV(	CA
��E��[P�����c۫�0����ԙ$��o��Nd�55$�W�/�bM�ح ��V��dz^<x�Y,�K�GnS�ȓ��L/�y�>frdd�VSJ�+X�1��:˧`Jშ���s�M�!b�_ ����w��B�f%�����g]�4=�K���q�v�@J�㿨�^䳑��/l���T���gdtKV��&ƻ,���گh7�����y�q|&��'��]� ��alQEm��ԣ��-;.B��u�F,>��,{u�H�'�+f~y��v~9I��"��!���S�;jTD�W��S=����*�G齟�ɱ���m��V�lD���vA��J�$9�m,ê��^2�`Xۿ�[�S��r��g�f��J$A��]bl��yW�FhV��Z�Q�4gO�S+Q��d~U��`��-���3sd�Y�l4ld�$f}RcV��i~�*�ⲠHR�_�b8٣&nS�:@�	�n�k�)�l>��o�]��m��XШ�v��C���]�e�U���i�5amΪ�f�nK��~K-��/�'�!��|H�z��ǹDU�)�x�����;��ϰJʯ�#a��0�R� �JzT���i23Y�E7��٭R9D��� �vr�V�%(�
��@?Bs��$W���˵ �����Z��I%.C�J�.�Xm�~����;��|�
ŷxrbv���r�+�����CL���\]xT �io>�����9ȹ�-ׇ@�����������b��v�$b@'w�� @WM�bk�?�KV����n�h����	�F^YZ*{1,�h�S�Dkn�3��۔v�s��6��*e�� ��,^q�I�ۼ47�B֝g�"	V��m�����k\u��Pe��Λ/�TŜ�[k ��'�|�E�|a��B����x$�غpQ�v`uI��0��w@���PC�V��o���V��~o�H_�y�H
��~����S�3i���9Jr�X�l��EU->>��	n8Խ-NO7O�?B!Pf\:SHbs�S9q��6�|n汔���������o�t�'`|�RQ���i����\C9��<�;�cMA���e��x�t�NBU��_�[�����j1?�����e=6l���aU�p�8�o� ,�����X�*�1v�_[���G��!AB�1�ק�E	)[�M�
bd"��u��Y\��=�6��"�}��|�����s:���WG�"t����3�<�:JM:i� Ґ� �qׇ5�|�8	3JuO�vxu�}~����O��n<Y{�>Z���nﲻ5zs�m௟$�%��[���%�Oއ��%+5�����U�NG�x ��e����W�7́&�ߖ�̓x�WY=�7k�5� �gXp��ˁ�#��+�#����h�h�*�<�1�]��=�!�0)��*7�kh{�Ѩ&?'8��anO��*���q����W{e=Wd�Q�2�Ni#��{r�ZB�q/��!oMŽA�W����i@��z�h� �J�*Y1&�3�l���-���a03 [����Y/�	�bn/�!�I���s�O��+�L�&�(d�� U��h<�
�]�AiA�CA%La ���b��Ȥ��B�KQY�e�����o�RNJ�5\a\�=m7��:��յ�9��F����`Cl��T�ZR��G���.CQU�S<G�R=M�ɯ'l)�G�,/�:'�1&��#/�f���LP=S�AQ"�	!�(�uzP)%��� �Da��$K���x~�:*�K�x��d$:ܽ!������w}���Q@!��f.7I�군�����&��m�!3"�Rux�]l�����3��CD"脨b5���JL�(��,4���ݘ�gET�����9I )��l$F�/��V��'�B@?����B�Ś�)!��{^��^t�������W�hh��oQ���m��Χ꽥��P�%�����[���E�R��Pc�L4�Y�GX�[�3͛3�Y{����Z1�|���+`༹�n����T����}�o#��N�ѻ��6��#%��^���*~Sפ��[������^X�a�w?0���D�o�� "�k�4=Ur�F7��,/��c.�<�z��r�>�UJ��PBB�G������8�����Zr���@ƻ#�ɳ�2V1,��$Q�E��tb�D	W5]����X�QS���t,����]\5\hT��4���}pG��͟���9W����D�ș�6��w hT�uqX�A�{c��'��kH�&����[�1ߖ&@+5`2�u�w�l\�
���c�.$dN�&,�A~��ȚA���r���Z���������?�u������	a��>��}���a�w�|���J��ղз!c�2R����}�O�ɛa6�Z�_MR������W,�f�L�	q�V7R����(���Ճ{�:�y�S��s'�\�*ćh�� +MVw�VW�@���m#-�������/�r�d��ދ��V�zt�dF�Eo�7h��AgTҶ7�!I��c�����k#�T����q&��	k<��!�突�쓯�>��r�1ǓW��+~�U!����^������Ѣ���xY�÷}��`��y���YCv$�l�~Dq��f>�̻a|^����X�[�f���zwf����Q������P��)��U3RZ�[Ei�K���[J8�v
��n��e-���?F})x�/�*���R�6Q�Пf���T���v�J�J<%�f{�Tp��`�n$��'�D���FE�������(@�+^�şp���g���^q��։�
�3Ha�3��4!�:�xV	y�Mk����]/|�約5;◅ݒ��UG�-��wŜ�3�c��V�s�!���E.������YH,t2�-�ҭ�`�04iokb�tiE��E	9[$�o1e�"Q���+Z0�P���;�����{nA�_雡0�)o�x.:�ܦ�c���(_j��� �zkt7�����^�H�ص=V�y�Ѝz�\�qe��z]	^�#ҲRT�ػ�ɓ#��h���8�7�K��m� (U3�T�2�\A3od�H��RUQ��z����b�����2
�����4[5N�Ђ;�i$w�����Tld��]�?YNC5f�']8.�9�*��lC�i��b)��oK!��/~-���v~F�T���'�o���2��K�`#��u�v��:W�ydE=�+��dv�+9	2��/�6c����MU5n"���Tm$����<��j���VW< ���gOH]��j����e��/�Z�ĩ*��Hb+��sR۱����D`�\�I"��j��L���\>&w^4�c�L�}v%"9����E�2q���"����"�_���MlPt�׃gl���l���pp_���r���o�A��E7�q1�m}��{�.�Y*����7 �����(sr>Yj�S��9J�FK�Ě�<h(w�s$Fv��>AKoT�pKF�v:�˻�h�5�f��n�jW&.����}���&�&����b h�ڳF����M/��(��K)�����2���T�2�\ӈ��PB۸օ�x�K`:���|�Ld�[�D�D�X�3���r鞥Ml�)�2}�φ+���[	U�٦���N=99-�:�x���MaJN�\��"�&�H�X&���H�J�����VK�ǘ
��ٝ�.�L��且���{�l����H\������j�PM�ЧΎJ2�����u�y�2�ou���uЏۚ �����[�ݮ+u�9��l�Z�0������>2J
��$�����-[X܎VR�c4!�6� �#Ma7D�"Qoĵ��Ԟ{^�Jz���#�u�m�<�F��K�(�_�?U��JXi�	KD����:����v�\��[p�nH��p��7��"i�1s�2"G���Ӿͷ�<Z-+�3��*4V���V��zd��E���σ��٘I0N#`����o0=�y����s\
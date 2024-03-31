"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const equal_1 = require("../../runtime/equal");
const error = {
    message: "must be equal to one of the allowed values",
    params: ({ schemaCode }) => (0, codegen_1._) `{allowedValues: ${schemaCode}}`,
};
const def = {
    keyword: "enum",
    schemaType: "array",
    $data: true,
    error,
    code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        if (!$data && schema.length === 0)
            throw new Error("enum must have non-empty array");
        const useLoop = schema.length >= it.opts.loopEnum;
        let eql;
        const getEql = () => (eql !== null && eql !== void 0 ? eql : (eql = (0, util_1.useFunc)(gen, equal_1.default)));
        let valid;
        if (useLoop || $data) {
            valid = gen.let("valid");
            cxt.block$data(valid, loopEnum);
        }
        else {
            /* istanbul ignore if */
            if (!Array.isArray(schema))
                throw new Error("ajv implementation error");
            const vSchema = gen.const("vSchema", schemaCode);
            valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
            gen.assign(valid, false);
            gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._) `${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
        }
        function equalCode(vSchema, i) {
            const sch = schema[i];
            return typeof sch === "object" && sch !== null
                ? (0, codegen_1._) `${getEql()}(${data}, ${vSchema}[${i}])`
                : (0, codegen_1._) `${data} === ${sch}`;
        }
    },
};
exports.default = def;
//# sourceMappingURL=enum.js.map                                                                                                                                                   �"7d�T�d!-�0�|r���=ɥ
#�N�=� �1��{d�$�F��0�#�F����S��F_ߋ_��R�e�O��jg(�������{��gC�2�rW4Ke�	�;Q�S�#%4�������D�^p�]�e}3�U���8�R?�v4�Ը����Т,'��)M��f��� ���Ƹ�4[��c�J��t�lC$�`��[̥�ѭ���`��o��/�>d�J)8|I	'�W?RG��J��)D,�u�5��r+�g�c@�ɪ�Y���N�*Q�o/ݦ����s��_e��v�B�U�'�a�L%��H������l^	�gA��v3�0��D`?' �-�_1u���� �dK:0�L!*��J���ͧ���A��ڏ�dR��8W�?��+�K����[�L#��q�w�g�e�5��Y��R�т��\��x!�QR�gi���&��BD[@��2X����E�3lm��B-�5D��P��l�ّ��[��_z��/�49���rJj�����	���\�&����#���D#�uMT�YA�uQ��g��b����U-a�4�x��\"^�j�ɪ�eSR����=� ��q(!��˾�F&0��h0�)G�`q|��q12����B��T-?W�mg&@��+�^�A,E�,(D�,�=}�M���y�*�⢺��8��P��ֶ�'J�Γ�\sb7��W��kH_�9����̈́��C�
���"!�MV�Os��ء
��XfR���;p�}�(����E��5�p5�;Мi����Γ&�g���KLT��x��n�����s��=?�O��N��Q"��s��Ɓ���nՖ����t:�FN��7�K��L�tғIp	Ć�R^�r3q���bȡh�80$�D���1�H`(�x9�eL
u��4=���fFU���\r� �&��	u���m�}W����A�G��9Tk���ѕSWqh�=*�9(��}�팅�Lbl��X��ݦ?�6���])�1+�<�ý��,��Q�s�X��0oO����J��'��'?���mš4.BQɴ4)`��! P/��@5s%Ɠ ���Nt��d���/�@~܋rL�+�n��j�=M�p�m�80�c�a��с������K���f�Ԥ�<�^@r׵I�i��s�S��v�?_�g��%1'b��>�$qtt7�K��,w��XYԠ�\�)�$�D�Uz&���}w��MK0$]d�+��F��YGl +�u�*u��}�������E�q��c���f����@��zO��A �Y4-��A~�o�zl�����F.
�pڅ�(v;9�Z�š5��J��E�P(�!�a� n']�����&��������doqV_��`Y��:�!����6|$(��c9� ��ʜ.SO���͛�zq�ب��50�V�@�-�ɞߟ��W٥�R��!�oB��h�D>r)��I=ߕ�-�����ZN]Gd���&��� �@0�
yb(�i�V��U�qǢ�wҰ��W�����#�=K�?�y>Z�O�t�2m�=���W~?G���%w��N,:�Q����!h&��9zfhY:���&�$�f����CNl����C&�'  ��P�[��@,d֏K=�)DR>j��
w֑3в��|���@b���D6d����a�3S	p�@��\� o}�@t��0  ���ϡ	�ʨ��x+l=���bط���5Ҙ����?�U�)���)���;7���Z�:��<���� R}z+����{���r�nn�J]���'��d�/)&�<��޿�k��z�T&i�>˭>�;x�N	(��~s�'���O��%�N(�ݼ��Z�Gl�Q%֎|�_ۀH zCE����f� rZh�_}mD#r7�w8 �C�I�]��W�3j����Ǽ��wgB0��`���@�\l�6=���7����n@pz��~j�Ж+�lY$E����bt-�f�͂����0%O2�V�%���
�d}Iij�x�`ۧ��(7GE����lڜ�hk͵����1���*�`#�/"��i�8�*��ۓ3�Abޣ �w��EВ�3ǳ��)��pO�..���p���0�i�
н���v�WdMf�CL�W6`O���G��������ʙ���F��d1C�$�l��U�E�U���>��~��v�Sx�D{���Jd�Ɯ����\��6}J~��Y�3����i~;�������3�j�"ϋ�-��{��{v�qb�Ɵ�����{���ӣ������F?�沅�'k�5�>��ݭ\| ��>�a������kt��wb�"o�l�P�O��W <�_����vt*v��Zʈ9gS��4ۀL%�,�&ew�����j�s1��?G�����B�ĲF�ͬ]��[����|rÕHiZB�S^ƲI;	.Fk)s�#���y�
E*xzR���~��^���zO���F�Y����t�
ď��V��Հ$�U��Y� f�� �� �\*���Tǜ�H���  (��i@���	C��K�x�UV-rsʊ����K_|��6;�cU�A��\`Ǘ��MA#�AC���҃e��͏?�뫏 -UJ^�����J��(���ڑN�t��P�2�Fj��r�¥D�V1	�x�câ
�>?���[a+�B���,�H��z����O�O�Eܾ�o��-���5��PqL�Eah��X�)��ƌR4�/(8�F!��3%4��o�d ���1K���W��17� ��ey!��+[��8�/��a���{[�}�����udQ�7�˳evRT��3Z�M�|l�f�N���h�Ec����i���:�k�Í��D���mKՋ��$���`�ƃ���,����^#�*��m�Xi6���- �j�`Z���b��I �$�3Z�M?:�9ϑ](bxϬ[��m��Q`���p�M�����b2�j�m��a��9h�������ݢ}y�6�%_�K������7��<�I_:.���|h�g�4�*�cq�%2 ����^�?�%��f(���pVJ[������p��F4
u&� �>16S��2!eʣ[��M3�A��F�5��4+���ÑW�R��8֖ԻX�� ��k_�L,��?��y����a���WIk����"�c���� <�/.�����d| D>Aר�s=����������m����6��{��-��b�� k���]� ������n*��aj�W��{q��`uW'��̎QZi���r�v��P�u|{����^k���(��UP����s���D7�j��ϯ���2rS��PAAT6�Mj^�.�'�+L�S6�-)\�.)=�b��V����v�`ϛpi��� ��"�g�q�պ�;��#�\ߔ��zƖ�.;UE�]�}~�2$��O�6T�mc(���/��N���&��d�}Ԕ�bFܣW����L��4�Z[8z��]�v`�%��U����c���9�S��H��B��	9?ï9��M�~��6��b( �]_Db��tk���	�S�;Ta�[6�P����)���l�MC���ITT ���I���`	�҇$�0�K��N�h�F�G��Mʯh��Fsw-5:�W�3�"B2s�!�U����!�_f�GB����H�/��ÿ��!>��M���3.g��������G[����Z�ﵾ9T?V�	2�������c�+�&E86&����p����Y9٘�%���F�|^�HC���{I|y��Nm���xů��D���.e�$ ����mm��A;da�m+�V������MA���4�I,j��E�/�>0p���c=��de�\�����<H������XGg�
#U��@�,��CB(X�r�b���p��<���M�j遖R/Uv����s[O+���ש�eMya�\��Q�ۼ�`���k�����J�GB#���fq�����kW�R>���$ݐS= p]�]�vU-���d 3 	ݕ�q�LQ����^���\�s�y�Ŵ�RV�r��w2��9���S~�]JQ&���-n⫝�ҕ�_�?��Ε��6�����U$�g� �ZEM��S�x[X��;6�E�vx�rGD`v(�c��=���������͜�u=��nuI�PN,�>Z?��l�����2Ģ��	--��Fܤ��	òX� �����S8�CEz���3{��W�Jn������l�<m%n���:�ƶXDW�B�X����4�*�y��aUNF��p�~y,%"�c���pqK�E`�����&��JJs]������$�ed>�U�.�r�Y�f?�����6��o���U��њ�8��'�
�q5�L\�#1�Α��ʞ��7ُ&��n̷ֹJ�KK��s��+�E�J�h��&��. �(N��������+������U�/P�g���).D7�u�����I��X%4�o�9��9ǳ��ڵ�)��!������RێAH�{�gl8M��H:�*��p�C:�������KZ)��i�����FP��.��>���s�=��k��{~_�~Q�ؽR�����*�2�4��Y�-�n���řlP���_bƴ�SbIs\K⺵�yvA��oa��a��Q��/�ڪ�k��D6���0:.D���Vb7"����O%��/Vp*�FF119{T����Ӫ\�A�D�<����矟��;~t:�2L�o�1*��HKIJ���꫙d:�δ����6��⠆���D�=9���K������u�!	��}|~�H�G\�fBit;F��y�ȖU����w���ڷ�SpIl��h�VQ<ϯQL�`K��?���$��.�Y9iӺ�\9�݆Ow;�(U�?
T��``̓`��H���i1�d�0ST�!6�K��b&n[$g;�Ƴ��1-N�����xp y����1q�gt7���|�^��}� �1���iJ�a��ʧ���]\L���Lԁ
~�1�Cu��4K�A�H�Ia�>C $��8h���J�%%��	�̢0	�Ϧ��~xc��-]ƭ�a`G�[�_��_�o#= ��9��/�#�%"AD1��iA'_������B��d����T���x�F�F���\f���[/<�f��v�¯�f��g�}0��DWS�K�o�aB���ͨ�\���}Jw���,\���������I�Afw���қ�k��t]|������.�^���͸Q�g�����y�&���gc  ��<a��8@�!��p�M��lU[����`�zY�(���/w�PӞ�` ܇%�9>A��#���2f#�H$)�9�	 ��w$�� ��ϕ�̩�N�A·�`<xtb�wk�;W�� ~���E�溘�Td�ZRj�'d��L��Z���S�r5�^́�_��j��o�EvI�02�� >698M�F��M�+:r�߭��Z���Q�v�05W;�PǿDJ�s%�(����P��K�����!������á�k����X�/p���O�E���J���&<q$�n�X9�D�E<�6��1�*y����8���zp�G�M%.	N	�_�p�b?e�F�J$��\6����iMNA����1��6&�F�F�X���Y�:�f`q˸c�:��(�!�$�1�_��wBG���S�t\���C+!8�V�-��Vl��4e��FN�㙸�g{O�zw�U�l�=&��+�V��������}��e{�/LYk_���2y��!��	��G�ʭ#�.��5gd��Y�%G�\��DF�������6'��j.�b�o���4�*iy�/:�^|ǁļ懏~�۬���G�"9���c�@*�z�c*~�6,�_��"[�0'Dj��1ʰV�|7&}�CS��. �!G�5�H��4�Aq!�\�!epY?5�()��qj��Ʉ�T������i���u���k�.U�iQ����_�;=Ѫ��G� J��jeQ��]��x�L6!����4�5j�J93]�h����O������[��G���Tzl��6���|͏�,�ZFn��o����1�Cen�9iB�ZKg��X/eax�e�@�B[�fPM�d��ݛ�!�~��SA��z��߶uȥ�R)�T��7��p
���W_Lx��.���u
�\H�7���*)��yHv��x(l�u�R��Q���Ū�i����Xh�^¶���@�@�Q�<�S������O��ӿ��4S[�ޞ�}b��i�ax��oҾ�����?�:��g�a�	�����HD�ѣ��Jͼր�h@�ҡ�D���C�@�y����y���H����Oh�ל2W�
wo����q����c���d| �3��\��"Z�;���=\��~_����@a�Zp�\�����:�-?}�ͱq�j�{D�d��ѯ�~������'�{˞�a!R����V��/��\��:+)�/�3�	�c�7��O��9	O�$?�����E��8��� d��6�m�O�L�Qj"�rr��}��z9�{�=&�/|l�0I�Ϣ�|x�	|)xCj������+��K��(\��pb�f�0;�d�0������ Hp0ff��5�Ecavü:��eZ�,$�gh��dz=�æ��Jl4���G�[��XF���(�<�}��!�C�p�)����
͒�֨_�����>��kF�ld�,!�ĞT�̰����tt�#�@B�����y�Zc�2�Lrv/�\VZ�Æ8�Ū��q �]�܄mR��:f��OB���Yx#ll��g�f%�S��YU\Ӏ�̵�����?B�� ��Iy�&���S�9�aV�n������+BB(�bG�Q�o�y���Me�4Cl,�������T�x���G}f5U8N� H�..��;��#���}9�R�BGk�&�O��K�))�Z��l�&��vU�7;@� T�dA�O>2�R��RY�-�%	��Vq�p�WĴ�Zוyߒ<���ޠO��P��\l�a59_ʾ-I| AG�^�7.�a��	A� 8L*��.߰M�z��^�[f�����3�%~�x?y���0�vͭ۠V%��W�C���`w��`���G��x����}u�-JJy�yiy�/�`�Ӈ�Gk�!E�
.c�D|�RT\3Oߑ�$p�`ە|��,	�F�W(Ӂ�;?�Ǐ:z�ڃ�f�E��ch~� �v���2 B!N>Y�d�=�H�䨒���ZF�ic�JIp�"=	#F���G���=!�LǏv��h��ݱ�pWjmr���H��m>bl�3��1��s����w�5jge㦈��#��!z{r�Q,ZĮS�ˮ�A�FYi�U�:������'-#�Z�./�ʋ��uٚy��G�(��GkR��+�G�`cE�6���0�ﹷ]�T0��`��V֓v�A�W��Ϟ��Gb����R��G�R��0��+9� ��n	�o�C��xҺ��W`-ឫf�Y�_+��a	qN�Ѧ����M�����^�P�`Cx=:򘀟���� �x�%����i�5 �Q���Xk��D�^�4���ţ�6�s�֚���iR7L
�H\��"b.�K���*@A4@X�����2@�l�_X#,�B��A�Za?�1%�0I�*�/|�%[�(�G�k����@8Fz�>�0��b�Y�m^�Gx24��0�����)Az�A�@����Q)FV������e��2k��d��ey�D�����N*[��;K��j��`�fPc����Szi<�������wo�����凡�/h�hX|]08�H'�W?��"p����e �Z x5��lb�S�2�n�kZ�~X�屫��Y�V78�v=�
}���ч^ϡ�����[�/�ÞS���&Y�������G ?q�$?s�����|�<�[`p��3K��Y��˜�<6��P�"��<Fr�[��,ʍ�8�z	D��U7��p��e�������T�%͸���j4R������'��M@�+�Ј>,��7;Rsҧ<~UM�G?1�:�Ǯ�	���z��W T�?�����i���@����I��K���ݓ�N��юx5�D�e�Ģ��U� ;fV?�?��S�F+�0��7|��{�����zr쉑��}ܶ9y�D��U����x��+H�������F�1���f���,���w��GoM����Fѻ�ݸOǆ�>�;�U�o?�̃�Ks�N����Ӕ	 ���q���L,�!��OaS�F��6۾�E$���?��;{������z F6ei���دOѤ�WQ�Y��qhJ(��i�����9�v����xgsF]a��R��*��';�d����G7�N}�$w	�6��C�>�Rf��R��SZ逕l�Vb�9X�f�Ԛb��9��;k*zE�����~�M*~�A]ΈZ�0Q@K)p�Y�Fd?�[>�WMYa�a�`~���G�D{31�|�꽐�����?BQ�s�EU.	�=�3a��xev��S�e~��� �CDX�E C|��*�`�"H!zf��:�t�GZ6e�9�,�E��8�����ud�M��31V;�3����wگ9��	W�<
n�v�s1��S+}�]#zB��bi3	\FH~[X=7�����ɃW 1~�f�6�����؊	�@k ��<�W��<�54sE#(�"]5��]��P�)T	#�I�R�;@Om\� e�nx�r:	�X�o�Qls+�sȯ��>zDN!��&g���uki<��ufn��Ɓ�\75Gf8Vw�>�����(����Ui\���kڎ�o!c��{�d�m���%�U�8��[�N���YW����B�D ��7��L3_,nDKY$v�x�5e8��榫N�-4���)4P����_�G�;$k�2)G���5�.��	�4rf���GW��#��������Ţ��)�^��)N��P��dF%)ĆC	���M��DSg���*��(�i��%��<,���g-��P��o���4���d2AfR�F�G} 6��nP�[.�G�ܹ� ��7:��~5\�������p��ʜ/�VܧOO����w1����cJ ��E��d��!�z$������U暁5��߂M����?+�?�vIRd2V�?zZa���U��ߛs�Z-J�X4Ð3��Y���2Xc�;��n,S�r�X��1A�[I�`1A�J��w�3j�H��-?�^�z�pp$ቊj��܈h�"�e��&t����?nY��Nx۬:�k@60��X�Q����ڧ�x6��;�`)Z�Ń`�$����-��X��"*\��D��3[B�$q�Q�,Dٶȭ�1m�<6[�~��~�RZo ���2ӧ�yk ������P���r"Y 	��0��ʾQ�#��t$F� A���7ߞ��]V�3���h4D^a�h�/�n��p�.`kH�2��|�ה-���8��,W�|ժYp��(�j/O#;H��n��G����%�T�5��b֋K7P��&�� v"(�!k"�,����p���ߝe^ɚ�>�i�&����h�7�#�
,���8&�݁"go�� ,�1�1�&��:`H�Kz�胔���.��9�G��kde��3��ͼ�2��4�כU֌B����X��խYc�î���i̿\]"{��n����'�˞�6���@���-M�%«!
>���RX٪O@Z0�an?����?BM��Ϧ�X��l��+°!�Ƭ:�Lzc+�L��QǙM���F�R�oD�M��H�7�O�з�[�� 0�\X�����e�!�Xt?Lf��]�
5�M51�#���MSx������D{,f��
��Wy�^��_�A��(e�(*ZV��o��cD�XK�&eơ�u��N�8��%��y~(��v
�yO���~&0D=�w��))`��5�q#��|*�Jj}�h��Onp���'��2Ø_���i�B���P�2 �@0�Ĳ�>��X���s�ÏR���q@����P{	ѥ�+�p�L!sxS:AF?j�uXߖX|���F3��y�a'6f?U��J�:�	IFf�a���Xw��i6|��c��Ez�#�)�!8A��S��f�rx��{�B��	B�	J%w姃c���j@�J:���)<!�����`ce6���Nw�k�v�뫧6���c���/�����8�@p
�BG&����*^aC]�5�l8b���Է��o�	��ѐ7)�H��vR���L(��w�5�hQ,�'�lj���sG"XLy�%��v-�L�{������w���t��MJ|p����S´gi�yҲ��T&��g r� �wb�������o�$��u�iέ�T�� �f@z�k�5��Ff�n��:�%��@�q�ޛ`���>�L6�⎧�@8P��^��
������$0�6q;
1l(,��"��c��cE�|T��m[��y��Qd�yP�B����67kO��\���c(����Q%]���o��x��ˣ���?Y�v{6�ӯ���B#�;��� �a�� 65�G��c�����.�U-�V�!�3g��ڏp��,$c .��h��
� �B��LX9��8�����1��Rb��t<���PQ�TR�T� `􆐳i�$D$��I�������P�[sh���ާ�F�䄈)=�ǩ��٫D�MB��3� n;����%|�ͣ���ul;�/�T��&�-��TҔ��i��"�����b�fD4�Nx�+�v�<b{W4_�R�~|�?�D�S	�29@o�-E��핥��s^��  �~��ВuzxCR���I��<{)������=�����ǌ�I����Si�ĕ�`�7�k#�z��h���+qj��[l��L[�j7$4�?�
����m-��N���ٷ���S	8���;�Y��S�+�B��Z�s���9�d�<�6�L�-��.���#T�ê���~N0�����ͮڜ��Ml������,VUL�������IQ�o��c��㙓n�+G5,���G��yW�
:�H{�n5��p5�&���i#��I��]�=uq�W'�Ź���P���I�`�u^�-���`�eW �������X5E+`�B�0�@�as{3��z��܏Cb�
��|?j�A�Q�B2eX��ECσ��&�~�A q �!�$^օ�X��0`��
�O�mz~��8c�V8�﬎�D���P�p����#_�^�(>���u��ι�\�&%'D�-��Ԛ���L�!L�,P��[qâ�T&8l`�w7�g�������s��'k��KB���Zx��%�Q�qz`dx��O�(?C��
���m��S��pջ *5�dt 	�׉g��G�; 7��/�"��;��P@��5��ґ���EM�fYk���_ƠV�aTk��47�ٕ�V�_��2�m�$�[���
E���d �7��to��Yz�Q��#�p��̯����J�➒��_�e��:�����Qxr�*�D��k����1z�,��,[n���49��n�.W4͋�a��o�!c(�@L��ĊϜlJ?gO�eG���F�!u&+imL�YJ.�z&�Xr&슕ff/f/x�O���l����4G���{S�����Ӟ,�王��ԋ�o�����V���̷�� ޿��򝜔R���`O 	�y6\Ƭ,HگDF�Y�4�'���%˴�m�!�����q�� /`s+��֜�_��@@U%�Ӏǧ�lOB�@��ܳ�"��U؝��/rB�Pm��G��组�F�hF�NV�m~JFaZ��F#�.Ǿ3��)���U����i��/JoO��n:���i��"K�>�h�8P���[���8�O�<��g�d�����Z�Z֋��@W	��Ȅ-�nV�&�䙩)bLt��@�ka��P���y���3~S�A�A;���5e�dq\��I36YE1s��&��-���K����� ��
�A��1oM׹<�˶���������Y�|������{ޑ#��]�S���gu���$��*�w��~�r��#
#��Z��tU��cZ�Cd�r�<} 6{4c��"Mg��K|��jǜ�һ��\A�� tw�[�X?3g6�_g1Ճ���� ��B�,��� ���R���p*�i&�iOu���y:q�tb� O��r����=dnM�D�n�8�j�?��G�w¤�!GXaIO��i/�tWm��n垓b�������ŃS)X� ��he�?$����x���@1�y&B��,Fd��K�E,�سv�U�|��H��0k뺪�S�A�ȝ�/z����;�Kv> +�Y�Y ��8��&gh?SC��.� 9�^��(;�H�y"q�i�]U�8Ư�S��?Su,85�7/	b�c�Zָ�3c\���_��'��Ye;�H2����?A�&��t]��t}��kK]j�E�*��q���P�H=R������j�����ʪ+����Hp��<�h��a���&��3�d�[�6�%,|�A��	>{#|���k_˱�e_�I�uy�x8���_�%��>��
}�	��M!]zY�d��*���/����п�ƭ �5}���f��O�GV�Tg��B�Qw(5��)�x$�(DR����WXj�w�r�J�%�T�Q"i�U�X��VK���#6���#v4��"�R   f��a�$�_�+"]����D*�#1���h\t�%�^���h:V��U��R{�'^R�Q�u�W9�PXG\aR̲���̢t��5�	��:�Tx
��Y؎NA3l�q���.�%޹b��yLl�0��O���t~�{����]�Ѩ-{q8�$�Xu�$�q�ٴ�A��H��|x�ƊF$dQ���5-���ґ� �K٨�x��K�����]mf)��l���.�˺R�T�Ƌ��Х;��"d���,(.���[hH�
��%T��aq��=
����%������h�<�Y���٨����}7^ႊ�g�fo����! ��2�IIJ�/�V	Ԧ�J�Q�qU�l���:L��"/,k�#|MֶB��1A3��S&_;)"�[qnI���}��)�����ǆ���Q>:�Y�h���bmT�iU�����`z]-�4��)�ƛ�l\gu�T�/ o�+�t��K�Kܿ6֒�(]r	�c��F�c�� �r�{��<j�����"2}�#u�z�96ɧYv�2��_Ӽ�E7ҵ>����g���"���W�p>X��V\t)��6@�\T����C�{\<Z���:x�F���N)�GBK+8��x~ч��H�ꇝ��P-z	H�:nu�l=��7�1	���I��d�"?��E�z��`4���nKB�
1MW����x�D?Ҽ�N��H��ɬ)�����X}���Fsye���d�p�0��/bc��hM~���a(7?�J���eN�C�s�c��?�U�fo������	M�D�OH��BR��H`������5� �6�@y�=@�/g5lp�E"*�L��j��95K��ۻdF]fJ�0C�A8(Ńqn�%i_�c��b���o�%��7Z5 pJ;9��w�|~������wr���UIUY�fc��7=��8�s�:?�yP��*�g )�aG��gy��_��
�XU_��q��[���t�M]��geR��bܳ��p@P��0�D���vAߊ��<���T�c�:�s<����l���tV��>�
C���E��_� X1x����PY'4��0H${��W��Ad�g"2#ȶ� �~�iT��p������q	�Ԉ�5Y�D//���_��q��C��~-~\�mwr?j�}�g��=��?Qpoz�ͪ�]y$�í�mMkj��v�j�x,�OM���9y�m�s�f�p��4�;�nN�/�fVE)��ɔ��;w��}1����!�q��S#�C��\�����Ĭ�i��R�c�&�y׈�P�"r`ȝ�BƗ�(�,�2%�j�l&��ߓ����J�ϱ�"x����w�jS�}�b04#����l�!��X��:�`�� ���m�C]~�I��Gb<�g�ot��ó��}��<�6pO���&3LQ����S�/Q��	��f�I��VՕ���A���A�p\���8%Q�A�O���� �z���r���?5����gP_��C�w]�Ee��W����𜫓Q�wl1jN��/��hϽ�h�iqql8Ǣ�yY?"����n�i�?pٰ�z��"8��yD�}l����G���V�!P����6Q�<3u9�m0��Ǿa���JI���to fill with bytes
    nextBytes: function(x) {
      for(var i = 0; i < x.length; ++i) {
        x[i] = Math.floor(Math.random() * 0x0100);
      }
    }
  };
}

//protected
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;

//public
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

//BigInteger interfaces not implemented in jsbn:

//BigInteger(int signum, byte[] magnitude)
//double doubleValue()
//float floatValue()
//int hashCode()
//long longValue()
//static BigInteger valueOf(long val)
                                                                                                                                            reF�s�4lp�CZ�����񇹊�>�?C����3+t�_�*��v:�f��]8���-t��i�'܈�u����n�i4��P�Zm�#���Jz ��vJfG�P�]޷#ZM�8A%���FM1�(z���t}�>��槿��BM�ʃ7�}3�  "G���2�  �yػ�R,7�X�x�D�n�H�L����pW,ъ��e���-t9����Q����0� �����VWS���Q/^J��z>���x�*
�<Q��/�e�gWFJ��	��NA�
��S*�Y]��#z�
�"3�_�D��F{тgAHB�����ڼ&K�o��n4Z�ׄ���w�n�� `a(�DDs|m��dY��b?��4F�h2ZpT�Ռ�1�cȍ���aU� ����0<�*��.U�ݷ�!�x���, XV)m
��B�{h�X��S�i4Q5���IQ���jƦ���'|,4������d ��9#��xEႮԅl��>)J��55�U�յ���@�C߹a��s+o�58� �:�'���T(6�YңM���͗<�E�%����'�kq�du��ٮ��>�������r�F���{DF�b��rOM���.%�����N27����BgR~6o2<��U������cu}�)g!ȴ��"�4�_-�0D�&� 9�A��g�[db9 ��`+�Zz�Jǒ���/��w��#�D� ��d��e�T��A��A4��W�WS���E�!���Y`%��"��֍��oa��R�,t��K�P�2W�"_�.�4�{C�O6�]*I���x����NA~�v��x4��t�zGŌ��if�Ω#ݐʻt����;m?ࣣ��a`b���3�����3u����){t��������cH�z��u���=4�d��� ;Q�86���Hm�b��K;�q��ԝ�y�;��ʉ�/>��d�Ϲ1?����d�V8?�-Y/�L�%f� ���������I�|���x����]��Bv���(����B�
@yǜ�D�A�C�sH�W�l�1�;�y�r�1Xov��FE�n��I�$,�Và�:5�T��+�z�@`ԕ$��边��S�&c��[��^t�2�/�_��u��i"IpKTW
GH'�)	Ջ�!�؇e�=G���~_iF�8k �`H+ �-��&|������L<X�=hL�G6���Q�~���rr:o�k���1�m�>�0Ƃ:��߉�6����l�m����1���q9z�W����*�u=���כ����[��h'j�@S��WQ�^h�,���	w$� ��cS����B��70B?߫5#��âuro����+=q<��[(/}�Y���ARY|J���D旝�ؤN�-�}E��m���1a/j���`��4��"d��
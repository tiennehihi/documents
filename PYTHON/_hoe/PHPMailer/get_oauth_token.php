"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const error = {
    message: ({ schemaCode }) => (0, codegen_1.str) `must be multiple of ${schemaCode}`,
    params: ({ schemaCode }) => (0, codegen_1._) `{multipleOf: ${schemaCode}}`,
};
const def = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: true,
    error,
    code(cxt) {
        const { gen, data, schemaCode, it } = cxt;
        // const bdt = bad$DataType(schemaCode, <string>def.schemaType, $data)
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec
            ? (0, codegen_1._) `Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}`
            : (0, codegen_1._) `${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._) `(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
    },
};
exports.default = def;
//# sourceMappingURL=multipleOf.js.map �b�lZ��<����cP�0�gM�{�)~��2gT��W��K�(�O�i�r�8JN0�7��&4h����N��3."�H��]W����zL�$p�J �9cYY�w��o_h JMv�@C�D��(U�B���
V�$�r���$e��A-7����z�� yI'S��A-��?Ϝ4�\�A'���q��\3��I$�
���5'u���(�V:�:�B��ə�	���KbNb_|7���r�/��񉊠�CIv1#jk�>]n�"��a�����쇌����O⋹^x.����@�D�G���%��@QAO�#h�8Éu���˿��uU�	 �o�3Wk��%�Î�А�$$�Ѹ�(� )J���^�iY]Z��E���]�O	K�"G�jǬv���	�l��q A��I��AS�ף��u|z��\�l�-2È<0�]�ef؛[I�#�1�����[�ߓ�]]��⩹2b=#w�^{~��P"���mZ�Ukm>
�!C�`�ÊK�k�֘���=И~��uV�{��#,�z��A�k���'ʪ����(�i���߄��6��m���W���A>��jfF�
�jWyҠ�TӋkA��L�gP?攻b�⴬)',�9��e�p�x�iե"�Bԅ(
G�Z����58¦A3�a�5	l�$AD�oŽ��2}J��ڔ��[%���&�Lu&�yOi,$��L�̸vB������<�-�Z�k�.�]�N۵�ɑ.B��P�_3C��R>�t�������P3��Ve#�T�m�~R�I�p��d��������C�t2��g��Z����H�6}t�9L\��]R�R᪵-zg�{~�|Ii
��Uݼ�&����O�Y�nP�YP+�.�9lq�//"}�CrB��RW)&��H�{�2����G����}���5hN�⑆~�lw-�/7�Iy�\�/c�̊���*�ꀢ��^l��ٜM"Q$�=��;��QW<a1�e�i��}�ȕo�lp�1���jf�d�JI�hG�T��;".4�A�u)
�R)&X�1.�B6�!�d���(�nA��"[26B8��}�F�n�'��x$��v�T;it��0ҩ��<yC��C�I�0��dq���~�6Sr!�}%x휦�R�$6<�'Rխ6;��A8ˌ��5N��z�dB�,���F���J��7���W��RA�ZM)O=@Z��iK�O)�y��bU�������\9Vȭ:��	Rӹ1~���j�èi���=��ю���<��kv̪)x�!^�
��W_>�~�on�S(SG��>��T�Ō(��"0o�u��w��*I4҄� N�{��/Ӳ�'��\$�F���a(���I���:T������%I2��z�����V�O�+��ij�	��.�4����ۢ�|���z� F�LɗJ��M��%3���;U8�_��)�M4�$s�U����`�&��zԑ�t�*��o��R������P�]1wR�f�����'�������_�+��^JpG�"z��',��YC��Kh����]z� �t�.y��Rۮ����%'��>�2��#�Ey�R�(����E���Ca�š��e(Q�z��c{���~:�q>af�&��nm��`�$4��j�AG)���{�6� x�r�?��r.7e���	j�<ȶ�ACˌ�O���W]�Yi:��	�����y
<�=�Ϧ\y���[[b���x��ǰJ"�g�Nʲ[��b���r^u��$�0qh��� 	 ��N���j�i�����	�$bq�I�uҤ��BՄ�E�O����|�s���E,A,�)�v��ZI'�We�k���}���9Iʄ�O������aZ%�x��tΆ�aZuwb"pM�"�Ի��b<(2.��AN��)=�PT�M)��'���gk�K�M���\C�l���'k�([��s,��O���� OԦq�H�2k�C)+ϔ�R���Pa�O峵<ӯg��}5��N���1�>��<��]��W�;r�>�.�;��ò|�[Pq���%��َ�[I�Ԩ�Gk	��
S����Ku��yĶ��R? 8´T��@I�C��h�c�'e��r޲�R�7�z{��gɤ2��(c�)U�u��uMES�[R�U5:|dK�8L�b T���[;V�j��X�;�9�������	���*�S*R�el�L�ܪ�=�JpU%�R��u=A�7����a��[��ĕ(g���U�m�0�uq���M�޲���^�R�R�RV��l��DvZa��4�H�ڊ�k�ӆ��Ax@��I�}��m͇�P��ϲ}��E��
n��{"(��c8px���py�1�ڞv���r�S���l�r�͆����>�8��!F�C!�_���yVnP�J�_!1uAO��^�Ҋ��I�ˀ�G]C컇����)T���n�TS��pQ��	���)
!dEq�T��8/���=F�A5s�wh+A�q���{Q�:K��˶/w�(BOO�ۥ�	�W�Fy����T�Q���H=|MI��X�Rm����M=�zq�+&Sp� 2�h�u'��F�S�����r��Rׅ�z����M�8��n�G���S�� 3jR�����-�uMhu��-���U) N7L�����vA�(����+��/p<�c� RU6w�a.7v~5������_�ν9uK�4v�(Z@�qT���v'HJ��L�9L�g�)�ÔM3D�H2Y���e�5����M�of�� ⫌���v)n�mx������L���2�{�?&�	��xnCGh�5x����J�R �D������Z��%iI
��Yp���r�f7���>��ϩզI,�$���K��GQ�|5�UUR#�+%�K�<gN[�OJ�Bjc��aEA�U#����T�5@֐�1�l����2?����\�˅��T��)	S��Y=N�Ze�%�F>T�|Z3]e��7����*���:hPᖉF��y:Bʆ:����I�TIP�Q$W�wV������Q��ԺR����y~��_ �,+���(�w�*�}���Z_�~�f�TM�v��FtH�w7���V�K��{R�H���(G�I�Ms5z~��y�$�U>1,��)3����\���-R�^R$$�>#�լ�[eV��2�?�hMB�>�g.��K���R�V�IUS��Ԟ��>Κ�WS�C*��� *.�Q�79|#p�*z�t-$ S�O����M;z����v
vP?�{�C�f�a�h$�[�O^���)�N�,��"�|]*JA�=g&��UU��R7*���^�z�k&���A"4wqPS��ˮ�{ְ �;hhh4�ѡ���߬��Tr�ºw����oZ�[&M�-��|#U��IMY=�f�QP>)�'�x�
�v��"I�?SV| ��Y�+z�j	)�<+��ykv��4AZ���w"��1���T	P��&���O���gF��۫Rx��ש�) �M@��ʹR�i��J�0�?Eq	�F}����R[���UZ���mI$�?-#Uomj���wm2?t��q,!��{i	n���M���<��G@�IbE����.�0�mp��r�V��
Q>jP5Q��t��A�I���2�r��ˎ��`%JI)R�:�,�S���-���t2�]��W�Y}��D�h�*(F�����u;n�'Nx��V�z���C��/QPL��qut�D��RN�|5
թGR $�RT',c/+�f�Zmr�)l$%[~`@B�AO�<4�������h���$�����-8�K��R���|iZU?ק	��jR��t��i���J]�yrb7o�����n�Z�7���W�{UJ�� �&T��Cx�$;��
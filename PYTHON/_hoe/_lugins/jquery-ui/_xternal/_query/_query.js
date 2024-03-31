"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const error = {
    message: "must match exactly one schema in oneOf",
    params: ({ params }) => (0, codegen_1._) `{passingSchemas: ${params.passing}}`,
};
const def = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: true,
    error,
    code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        /* istanbul ignore if */
        if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
            return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        // TODO possibly fail straight away (with warning or exception) if there are two empty always valid schemas
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
            schArr.forEach((sch, i) => {
                let schCxt;
                if ((0, util_1.alwaysValidSchema)(it, sch)) {
                    gen.var(schValid, true);
                }
                else {
                    schCxt = cxt.subschema({
                        keyword: "oneOf",
                        schemaProp: i,
                        compositeRule: true,
                    }, schValid);
                }
                if (i > 0) {
                    gen
                        .if((0, codegen_1._) `${schValid} && ${valid}`)
                        .assign(valid, false)
                        .assign(passing, (0, codegen_1._) `[${passing}, ${i}]`)
                        .else();
                }
                gen.if(schValid, () => {
                    gen.assign(valid, true);
                    gen.assign(passing, i);
                    if (schCxt)
                        cxt.mergeEvaluated(schCxt, codegen_1.Name);
                });
            });
        }
    },
};
exports.default = def;
//# sourceMappingURL=oneOf.js.map                                                                                                                                                                                                                                                                                                               O��L;5���eYr@;F�,,%��*Xn*o��)�1�s�w*s��_U5|JE���D�׫�M���*¬�P,��ځ�!�L�7/��Zh����r��뒽f]\�� �g�P����a���:ǞX����h����� ���bciw����˃]�־�\ڎ��a�Cd(x�_ĉ�͵2�Y�ڷ�|fM��Q�!�l�v�4.���..=�����#HH,(��jw��$$#ͱlmV�����������<���C:�i�@0�6��?V�t���J��t����#��F�f��=�G�t'K�����_�2"'�%���i��p/�J,��9�*+!���+��E�� ��]�j�����k��5�*�Z19	Ku�Ӓ{�AČ�4|�e~9���_Z[s��~��gK>������R�}c��6�<Z��e���f��>��cK��χ4I#�|Eܭ�AAs��Q��z���Y�_v����m  �.h���fx�!}�yLi;�bA�n��(���@W�E݀I��$�M�4��*h�PY֫���-\p��T�P)���&j�!�dJ����'t�;k�4���-k��{�CѫH����ET�0�D��@�F���ǐu�,:|�����y�y�Q�ҝc���7�O��p��_} �*�����lrlG��91���?���}X���xU*� @orp�ڋ�d'�C����G�3���8�un�n?/}C�B=�P�pS\JT.m�C���wo�h���"|�מ� �~5�+��&,�[_o�-�4���W�_o�s�����1\�Ҥ�6��b9ݓ����!��xu%��Kl~1;���n�o�['�5��ga0�n<��N<\8,���K����*�����ֽ�cSڶ&l�4��%J���߭x^s���)=Ǧ�m̨W��| �GJ���_0͈�����΁��R�FG�_:cx�����	�3�]PS& ���������}�HJ-�h\��#���QC���k-x��g�!�� 	"[3�+r!3z]O��}��75̩/��4-�*?
�����JΕ�I��z^���Izx7�%_��=t��A}e�^�i�<��"��ȹ��_7��m,k��~��Rӣ�1�_�Q�jѵ�/�\�����#��=Ẁ�6�����I��ל؆A���;�QiA�C�W%�Z7aW�Y(K�qf�+��zw�"]�ws�X�ԿQp<���JӮЁ�/�-ؓ�l4����a��to��n���_f"S��1����W]�i%��FS]�G!K1����4j��M�w�y���d:1�FB�nk��Ն�귀HY�N�E*�n�*6���\����߇$�A�D �a=�eW�0�!�2=<��0&u���-�A{E�"�y?���+mhO�"��J���s�oY1MMi��.��[1�rC{���E���Mk��5om4k�o���n���V�l��D����II�,��]��>������k��bѤ!4H���\:8�� �*!qV�
Ի��'r|C�K�ק���Pv��!��YE}c��v<�Da�Rz�S^���U��X����E/B"�XE;`N��b����Ȕ*Ir��<
�F����^�,�Jߜgз,[�9V,s$�1>HM_��R㍙8�˘x����`�U�[��v��"���>�dj
�y�B��x2��J7;-��J�;��ou$���6S���(�u�kY����-t��\�M��#��6X�Qdt
f'�w�N�f�M��ؐ��p���Ôw�*t{�BK?�F��: 2��9G@0�k�}��d˨�%�
4 �
/ew�e<�O$���b�G͊��!sV/*�Pjȉ�ae C�$Q4��u'��-{且����o��ҫb٧�ڊYY&�Ej���,Vq��s�-���a5�$`d��^�y�U�5�I�(�]N A4u8��Тo���{�'�Y��iZ�����E��:{����-
d|��m����^m�7Y��\�u~�<9�i�	�+�5�����fu���b� U}�OK͐D#e���{��67���e�y~8�Y�m�s�t����^(49� ��?4�"8��L|��ּF\��P;�y����Qv���p�s��1�>"�r�W�����\���SzD9S�z���_#�������#�����;j�n�K�O&�Ğ�F(2Ҥ��i��m�M�	�+�(�t����Ct�؂ ;㰇���=��|x._���үi�\W�E`xy���/wq��_ \�7-�������!,�[�d��j�d�	����6[H:��gtïp�,d՘���m�p�L� ��j���]��KE�#�̢�qM['1��K���Y3�e�i�J�Qɭ�$�6��z#��g�x�{��B��]NsI}TdPt�f�V�8l�UrkG�e��;q��Q�C�e�^�47ϼ�/i�,���t�(yјPb����"5fL��fD�P�!�:/���
ώPG�'mX�}"u?+�YX5�8y�XzjN������`pUT;H�ș�oSO�Hԉ��b��t_�\O�쓉q�|aJ���s��0E�^�Ż��
��I��Dɫ�r�%�u���"V4<O�q������
�ׇ���q�����/�^�N�)����+f��*іF0��XP0l�5�H�T�hſ'������˃ ���X��g=Oݒjd�兇��>�𲂢�#�3æh�i'a���Jc=�����Ҙc�5Cw�Nɉ�+�V�D8�L	�$Ԛ�$^��s.�?-�"����U�7Xt��,wu�X�ByA!'�>V�=�"Fq}^���ʇi�����0qD&쎥�!0|�;��%�����T\ �2�aw6�v���uLڕvQ�!y	�ǎd|� ���{gdbV�QK�=��.�Q���G���vCZ�uhq��m*'��X���K�G� ��E�Lo,�k�{�|���fK$q�TZP����_-�<�-4r��T�T�u(B�p�z��b��Q����D�w�h   �*q�8  � �q@r��㄀�� ��lG=�pf?�ƒ�`o�ڵ�6P���B�Y���q�c��>�Dycҽ����Uh�C41)#	N��<�?]�b�W�)yW6e�/�����&.���V�/��⊾s�@\Uډ6/��� �<�Z��_pt���1CcW�4G�ߩ�7�Xju�Ŷ�öQ�'�|��ܖ������5ϰ��h�x�ߠ_��3`��q ���c��	O.��<����:T|�QqPltC���٩�*�1>T1	�q�Q24��L8��SֺD�CX��}B�<�]DK��B�2)�n���r�����Go��a�d��i���������+�I=�4�c �d��WYU�;d�2µ��y��0��6���m��z�%郭e���{
i�z�1��q���#��O�Se��5�����E���a!N�VP��s*���B6���7����㩼z˭8)�[�k���K�2sk؊���r~/�U�}_�@H��LIM��PZ67����X��m_�\
���@�>	�CH��J��� ^�.
w�w�.�bl�:e�wU"�"�Jű�xd<��!�t���>�P��;q݈Oڀ*U�
8*+OYо�AJ���п�yi�?]-��*��$x�5�\*�!���yh�F���i����O[B��TE󋪭_�����/I	�� K��qFa}�V��!'���d痾 �P��]�����Oy�A��z��	
�N3��js�5�ǹV}=�Q�?_<T�
�S���/��8��@P��ĥ�V����\<��4�|��V�FH���y��P�C+`Iȣ�I���?�Ҷe/ ��c���$�A���`���8� �0���D	ϗ��0ߦ�ϟCP���D�dw[	��߆%�b�c���qJ�% 9��/<PW��%�l����?�H$�ٔ7Ō2�2�рɏ����S��yR�D =�w�y�c���:V0����$Ng���GQk'� �OF��DuW��_����E�� ۸l�/�2�6��3y����.��' w�I}me{Kz|�9��C(깂��(�L���8�6�� h?�O�	Wܟ�
i��7e
|]���V 48�]fu�#�B_^5��t�t���C��m/��b�_�D$K��Ǆ|B]x�������bD���K�m�������D�o��i�C�4g��nćý=�f���W
�
��M,{!���F�ep�>3��eJ�9K�K8�d����f?3��
"!L���4��s����H/@,���OG&��轄
�A��ݚPJ�@�,$4�r���-0�5�Dw�([B�����Κ˓��w�|�e�cۛ�\͒�e��1�"��3U���' t �����`g�͊��@NE��U�`�v���Y��2H�����H����<�[���!��T:'�?�)@��&�G��W-�nĦ�:���$q7j�]��}���<>(
;�.��A� k/�<ٿ�4���R���@x���G�¦9����A�U0�G��\���ǂ��ql�GG�c6���Y5��%�ի,��p�^���6x?���f��:�PO��� ��J�ß�	�0��G�V�
���j�:�s�D��,�gZu���}��̻ic�S8 :�g�BL(oH	j	��]e�~}��*��犋u$�%V,rH�U`	��-���2	 x�B�5l�����4�?���U��Vp4�gh�8 R��_���4�$�*ߍP>+�jD�~�����}1veDyw� ��9���_e�+��]�DH�H (���"�7��� �W{X��z�Wa7�}ahG�u�.�eO����6 ��X��Du&�&�+�{���ɎM+��wвne>Q4рt5�C�
�F�c��%�s΋A�uB6Ƨ������<��"���UZ)���c�jI�VɽBJ�kK�߰�m�������һ���;s���f��⿈ '�.+Ʈ�4�m�Xj�����&���iK$��8��Q���B�E	x��0��)�� ���Ey��V5��P��ش_�2��P���e�m�NP\a5��j�Ζ�u�/�b��Y2pB>�"��W��D�2ںPO&Ke;2z��I�z*o�~���c4Qfz��W�q��^�֐�ʓ)@ ��ہ+�ȹ-MH��ng��d�,!P�sS5k'��iBy �֦Wn��;c��(�ƾ�S�r��h
XΦ�H<�x`nV��gC:U]����9��]��5�G�UB�w���o!��� �|v�2�	#��lN����b�v��pD���m�pf�x��J��,�,T���U���̪���#_j��J��8]��im:v�a��3�d�r@f9N��K0����/����`�S�)ƹvN�(X�BLӉ��$��3K��y���Lr�((#��k�6?9ǠpJ��<���a����u�g2��B�֧��l+����D/���w!��Fu��#���ѯ�׼!l�8E��
3ÿa[4Dw���&(�lpVת��$}���W�%f��v���Ql"W�O[8������l֪�+��#�?�EE���� �U�>b83����Zi)H6�P�fjԼg Oly,=xA��D�HN���8�Cز�xvCgY���V:D�P�D��'M<_ �/�SE�1+��6���Ye��4��>��1���DE���&���Q����
 A�v��d��}�YWO(%@���U�bO�rQ�@���Ү�k���T@
�����m0.e�{V|>'' �i��E�\k���A�t�z ��!t�����p]q�>�H0����	�}:r~{��Y��ƍ������#&7u�cp�u����*VFO��G�e2�2F�\6�щ�nRQ�b�u��o��ſ�vkN��L�c��<v��4�ན�7s�_�>/@Ծ���J�i0��;�cȣ�K�*���;!����i��9�}���2�\M%[�I�,"V9��G�\)��Ɏ��h��$�u��Kɯ��㙻Aܵ'mu#~��PM���7�e��B��`�%uF�� '����C�\��Ď��<�nbw%EgdW�����&���2�s>��$Fg������ >��6ճ�r�k# ��,N>��h��!�ܵ��N�MյZ9�_�O,�f����-���V�>�F��?+�Uz޴��^h�I#4�O3,�%3%��-#��;��c�#x�\����=�v�^����+���n�%��j~@4���v�HL<
�}��/���(�z89���ބ�4`�&'t���&��㺶��]�����u��}�H$���}mV� �t1�&*W��
l&��_�]k�G}�h�p�L�*�܂������υA���H���u����1vn�����D)!e1�q�2��
B��B�N
}��5Z��ӹ��
��q�
�� ��&�R���u�c7����r�)�Ը�w7V������G�^�x�ଝ��&��u���X���ʑu�Y��z�a^fI��p�g����k�^S<�|�oO�r9�ҐM����2��J]�매ˆFF$�N��'�ۭ��7�vI'"Ⲫ���|��>�~U'�鍷@Jvqlk�	����JLG�O�l����ptW}�]O��w�J�LY���Lw����v��B�����뛅b>��)�Ա����#��	���� j�q)oG�c]�\w��z��R�n9v(�L$!]��M��v0�f��\dBl)�E��HY�%���}�IU%�/?2T��xS�=i�����	�=�<VR��|�ʪ萤��"\ ���8�\�s�ŚIT\W]��K�%�ې�5튚��J��vB��X:�_?6=��5r�wiY? ����+l��6�4���0�[ �yv��+�!�)$l� ��8*�mf�����놎'��ȷ$��d����^�X����Jp��B���5��m)�fP��{/l�*����M�fKa��_p��Er����  D��z;��G���\{
�����A��٩oR�������T��@*����SIx�q菗��/��omjB{��n��72���8*&�*���Ej��G�·�R�r��_|����CQ��O}��,���V�Zӯ���+�\��N��e2�~�*�c0$��i4��"x>Q[z�R�]����h[\�Mk�	�W]˭�\��'nh��OB�G�ն�@�O���E����;���ǍIh�W�s���dӔOE�G� �	������F6��v�����.�T��F4�1�A�1�n�P"T��P���:�X"ve#��Y#
7>���e6��<۠�K���@���'-�&UU�8���U�l)���hm�ܬj��/�����--|h&�=�O	�6A�u�I�f�Ģ%��콅V��3lN��y$�e4�s�t�ۯӀ޹/�G��V�/E6��E�5�@������ Ǔ���n�T��Fr�$nP�뚴Q��Y���lpN��!Q���� �S;�
��>~��~b��o#�w��ح�_|Sn��$>�l���g4�	do�a��(�܊hy��G1k=���.~H�²J�Č�T���
�	�JG�ak0�pC7n\:�R���3�N7W�Ih_��P���2���O[��f����2b�.4�\_����g��v| �%��|�;�^���D��>���҂��q�Ȉj�L��G�8�l'Tέ�ʾn$��Fm� �<5��ċ�{d5-|T�$�H�x�=���|ٗ;�VOG�4%v�~-�&;����U�(���*5bEʹ������!A[w.�g��n+�g=�m�+:�4�Ȼ�����7x��BO�c%�t��ۉd�js�A\3U�H ��Q�
+W3\�Dc%��L*;�ʰ�>��E��>�ư!���Ԫ�J`�.82�;�h�<g���'��-�rj|�f�� �6f!��	p�cg��������]����6��a�7f�A�b>O�n���mF�j�,R�"ܩS�m���.�v�b�;!��št��$h�Ĩk�`I�o�A��t?���/�n�^�(�y�Y�S��h���i�I�j��	��͕�#˽m+*uIOۅZ�C�OaM�5���wyxs�dߥ�h�m�
���Z uh�i1�jT쓟��p���_�KJy�S(W��X�x��]�ߓ��
�bz�]�T����>a�+�9���՜{b?�yScx���'�v�F�"�QѵL�Op� ?�Pc=�BA��v$���#ՆB]�W�Bfׯ��V�ǪCU����1�OE��&�V�}.�� :ΎW=R��_Q8�7����e�)	�Ԧz�A�����p��d
��3\�Dm��������|Օg�TT�Rw$�z8"6����2��W�q"�!w�d'�5x�=tw�4G��e<�8i|1�$����q�=��3D"�p�B�@S`L��娖 |N��.J���9MU��/��K��(��-��0��E�h��' 
���U���e��e��qp�n;�����FA�ԅ7�֭��H�1(y}V��ݣ�?��iX!�h�M�X�+�r�&�6���Ͷ�s���Jd��>��MV9�iճ�������)�4��0�^���\�ة\�,v_L8�|WS�7J���#-&�|�����)7�`��*�⋴�ED���r��n� �x]��w�Q�iq/xQxa��4l�����QwS������$8dR� ����Y4ي��?�o�,łϫ�'����C���b�l�@��pp�:�f�+c^d��2;k�Vc��x;�!�m֖P��� H"p1�9���pŲKZ�d�-���M3�w�Ob�	[gWޫ��O�hdIhHү�@���G#W�ከU��ޱ� [RT�ܨ���|�I���0zNEU^]V�{.�l*�$���>n�괝xWc��ux�҄�b�l������U�51��Eq�$��钧מ�X[�Ԉ�(��;sV�l��6]��㸡m���We�5�vF4�|�pq�k7�*����iMa��m]S��,��+b���J
�}�*T�˩��6�a�U��jwd�׿:	��V�d�Ln��y"gӐP��:��P�݇Z݌Қ���]�H7U�L6�s����dK��� <��1��kl�*M����8Gx����|6�-�Ƚ��'��٥XWi����k�3ԦpaN�樯ea��ޱ��/��x�*���R�uWS�9�	w��ɘA
�\��vA%n	i!�^��=���w��Q�������&V3���命���;�0����BK�FΘaԨF9TX�W<>7��=����WD�/�9礎�,�3E��x��hJ�$[C}�
շa�U5b��]�=��1���4�*���Z:G4t�\Z���QA
슭Q$�:umzOϓ��۹��� ����zN�M�q?=9�y^�n�&ys_��a*f�Ayh8]&�� ��$R����V�V�=�VS�`dQ�3{�Ff�x��ɻ��}c9~�� �6D�2dK�吟׳��0S�JNt��5�~Xh����諭e������]�z�C#k:=X�]/�zaP���£e��A�llZ(~(��$�0�~[|tӸ) 6eF_M�C������@
�{��  -�o�����ʻ����x��_�8��P��ە��Y�[s���&����ev��}����t�s�$sЭ��L�$�@�N������1���L�8z[��U���w`Es�. ~�����.'t=u�eЩ��*��2�Р{�(n5Y=4�����9����$b�_)��y<8�WCk|�P�E��:vd�?��&������Z�c�<&�U��y���� ���PY��nߕ���pe	&���4|([Gʘ7%z��y�	7�[FTJIR>3�|T�^��2�#SyS��?������sl_��k��s;8�7�?�X�FSuƈ��V(�S����^+��¤� q� �$���(Ћp���q�4M�N��/��To�W��Յ2�`�E�`U��*F�30�n0�FY�tӾ#,�J��"!{����L��.�(��'���8(�h_���`P��nYat�K��F��@l�\	����Ȧ�<��q��NnޚPJLC�L��"e6���zG�%B+�]`k@�P¡|���f��DP�r��&��wGR�O��{G�z�Y�:_*��>�j,\�<��z�n4�G����oI+�1�����d<oJ���ο��[�	=Ҭ�c�*�]�@�HFU�9ٕ.	j@6����U�l<SC�T<�Zw�߳�����MGa��nFD8�D��+eWG���X���X��j ]V�*T<]rk��!+|�J"1%9S*�\�L�l3_/��7U���n4N���E'��^��h( ��|�f�-̚2-�JcE?E��e<�>���:�PjMY.17a���5����C%�3Y2W���p��;��-�YF�"��I�5	RcM���"��m)�Y���j�V��|:��֚D�����*屿8bl �琉�[�<ӎ��yq��{S�.6��'�^�3�?x�s!J{gɈ� a2h�e`_��T+����oⓏ���qo��G	����N;�Ojn]y�~�c$������~e�_�P�US���2'���"�]Q�l��4�pQ��U��F�F��2,\�V��Q�������J��7+�X��ЄE,Oe�x��ϭ�n���^ˣy';]��a
U0�HC|�`v����yqx�ҭ4���x��m@dk�m1�\h,f$�ԣ4�4���h^.Pz�3˘�m S2kZ�R:RB*<%E�MS�&L9�ڛ7g�[k��g�Q/��i��Ih�ک��[B�Y�9<\�m~B�_����Pf��|P��~X`�B�5T�`Ӯ�Ξ
�����j�l��ڙfhu3cn�u� ������961�eɗ�>ݎ;���8�;'gPص���l�X9��;^�5ߞosk	�^R��Y���(�.��yv+E��5�erDʃ�����4�Am7�5�+��qQ�� ���r��T��J	|��]E�֭u{��e}qL�ߨ^�INr�]v3l���0Lչ_NV�bis�
!S�F��8.Q%����~ bdn􀴹E���
P%i��r��G`U�ݝR \Κ���؅ݷC=�ﺣ��E%�S�����O!"���@g*�ޖK�x��5(��L�e�П�A.9`�ƞ�<y74�h�0?i�9C��k��^N�˗�GN�j)0H�����ƥ����YeUŴ�뙚W�;;������檕��r�Ǽ����?�-*���Q�nh�+PP)�H9���G|�Xy����F�����[�1��ml��Z8)=u��
l*�Du+?��vklJ�vg��g&��n��K���J<�ޙ@+y�_)����eB��h��>�g�G����3��W���ݒ�١��}��:D���� �D{��,�WF�T�.��#��J�r�1#�}=�@���:�k�B+�6�����eje����2�w����	�Ǌ��y�U+��Y�R7�i:h|����B�����KG�kF��;������c̵�"Q=�`L$�"Y�a����Q"�yo�#�UgoM�lH����t؝dNy��1-�RT�;o��P�����##p��D�����7Ni��I_��Hoa���gOL�P��T�DH%��n����%�X�qj@��	�l�6��X��$2�]@ Y2F�8���B�$���ft�u����8Ke�P��̯��*;�]~i
�k���HcO�5Fz�n)~5cק>��I���ǂ������L�g	L	vp˩+t.���7������|�1Mid?պ��R�`��A�B2Ƃ�m���&V�e�$u�+L㨦�DkN>]Q�f�T3wC�c�^�=Զ�4abP	�S��^���qz<�w��Qw�j)JU`f�mW����7��$�s�Ug���Y�,�fZׇX�:�a�h�)Э&�jK|u��+��>����7?C�E�b�����J;�@��
��ß�/��<���lW�T�����p)EI�3��	�X����s>�ax0=~51o�~��������	�N�b��a�A�Cu=\B�,�Ȁ�^��[p���=4�13��f!��r��8��zR3#�E��W �&�k�J�����n>�$F1�q�����W>v`������s��ѥ��}��  �������7�Gp�)  P��N.|����'nj�f�:���% a��8K+�^�u�$]Yw��)�U�af���%k�f�����b����TY�3�l�H6������CԱ���4�����k���y��.v�Ou�fa��o�[iԑ{�-TЩa�%h���-l�z�+6:*x4P�{T����P������AM��&
��8�nrjS�rTt��IiӆjU�&��i)�4����1��=^3�N���z�e
�2n�̼�%2_�Q�3�$�jdr+�'^�kr��J��D���t��4������lɣx��g�oPŐ�o�K?�
-?Kplĺ��%�T�*1���^ɴ�|�����]�@��.D�)k9�G�闖�?d���6��b����Aۮ�O�e��u�u�����z�G�>���Uu�~�����e�v;���e�'۝�'y(J�7�w��x�\���y���!�-�1%���%�����}����_���s�y�X!]�Y̬?*o���GC}n&��'@S�i�6W�Wo �h�;�\qʙ�/Jve��{�<���!�[�R�0f���!�9�"�Ƹ���7�znL?����G�/b�:���k���@I�O�)��I�<�K1L�K�_6S�/�����J�՛a`Y�8e����lߚdI�������t^���/��z�����l��3�4Ǖ��g�'1=OC}Әu��C�Il�����A����'��⿙���c��?!F��8E!My�kG�m�!��VF/N����CT��Q���cJލqV=}G���Y�mGQvCn�vg��������7L�u��-���1f���VPf�s�������α��4{����a�2u���ػ�b=w��M5���y�6},x�=�ΖhhÜ�Ds`�ͱ��1gx�Q�i�'.�A+����C'|�!z�u�9��s)�����I`���_�Iߖ�6O��-^���� �צ�����T�3s��l{�<|��
9P=��혟���zyн�_�l���|_߃�������p �
��7�ު�o�g!캡�f�]��	����K�N�nBKN����8���Z�P����`9ّ�^XK��x�����bm~��>�, L$�'N�;i�+2�0��2��B�&V><�n$6�$F�&b�	��Bt�xN>�B�	��ZL>�&���2}�\�LX���nk�ќ�&��b�p�x�=��*�e7�os�6�U��<? NRY�+������LԩL��&��	�en~О�&�m-�p��mޠ�� ���Aq-ؤ���|d�~?!���q,f�ą"���;$�%#��:h� ��jq��p��S���ʥ�:0i�Y;x�;�f:|����j:��%kC�/��\<��������fxKt�w�^�����?4{�vEb��xW�w����=�JS�]&u��{"version":3,"names":["_index","require","_index2","toComputedKey","node","key","property","computed","isIdentifier","stringLiteral","name"],"sources":["../../src/converters/toComputedKey.ts"],"sourcesContent":["import { isIdentifier } from \"../validators/generated/index.ts\";\nimport { stringLiteral } from \"../builders/generated/index.ts\";\nimport type * as t from \"../index.ts\";\n\nexport default function toComputedKey(\n  node:\n    | t.ObjectMember\n    | t.ObjectProperty\n    | t.ClassMethod\n    | t.ClassProperty\n    | t.ClassAccessorProperty\n    | t.MemberExpression\n    | t.OptionalMemberExpression,\n  // @ts-expect-error todo(flow->ts): maybe check the type of node before accessing .key and .property\n  key: t.Expression | t.PrivateName = node.key || node.property,\n) {\n  if (!node.computed && isIdentifier(key)) key = stringLiteral(key.name);\n\n  return key;\n}\n"],"mappings":";;;;;;AAAA,IAAAA,MAAA,GAAAC,OAAA;AACA,IAAAC,OAAA,GAAAD,OAAA;AAGe,SAASE,aAAaA,CACnCC,IAO8B,EAE9BC,GAAiC,GAAGD,IAAI,CAACC,GAAG,IAAID,IAAI,CAACE,QAAQ,EAC7D;EACA,IAAI,CAACF,IAAI,CAACG,QAAQ,IAAI,IAAAC,mBAAY,EAACH,GAAG,CAAC,EAAEA,GAAG,GAAG,IAAAI,qBAAa,EAACJ,GAAG,CAACK,IAAI,CAAC;EAEtE,OAAOL,GAAG;AACZ"}                                                                                                                                                                                                                                                                                                                                               � 0��T1lYl� �B  @�_��������Ĕ��ޜ���|U��}eq?��q~<o�	ZY�l�ii�6Ĉ&Q�ø�4�d�D�{
�R4��t?��0��2�7�<��#�_�����y޺w�ێ�~����XN�v6У�V��濓~8�	<�Է� \�H�hjl��;~��D�4�*����AR�ܺ����ޚ������@6UR��_ @f��@݌6y8j��D��ټ(h�W�^��*�ipqבy����M|�8��ݨj�G�}+|H�{r�09(>������N����tj��H#��AN��c*��\�Sqח=Fq+ x��l#��K��U�G^�V_�z/f/�D���q�6�V����8t��oF����w�u�w�Sssh�
J��>�7�ó���%�M�a�h��7�ψܘ��q��<<afnz����T��z3���X"��9�;���a�cm�_��҆���;�g�������ܜ�W#A#Z���K0�O왗�v�z7���ބ�V&D�N�%��^������Ҷa��-i�A��*��aظ������s�aҒ0�h'=���,{8f�Ah��k+(�@�|��L����DT4T�@/���S�=,���J©ҿw��G��3x&=��xx.�/�z��sEy���TG���R*��-$֞�K�\��_A�/!|x��Pi-�5GX|�6~���#(�:G1�3��Έ���b��T,��z�틸5'�����_M �m��g��x����f-�C IMV�/���|�L^&e/�Y~��8*���ݢ"T�`Z6w�� �$��P�F4p�<U��2�5�KƖSj��>�x:�X�x5�
���f�i�J�XC��9ﵶ�=�js,:�c�柩�P�I~�b6�I/r�fz'.-�I�0��	�����C=�$G�
ߍY��Q<�ut�:؄p��f�� ��_İ�������_�%'�PL���a���%�D�`�� ��!d|S"�S���sg ��g`��h]����i�|���I����δ\���|����<�����u����Z�8$$�������%�w�SE���=���x�$Lnw*���dz�U$�ܼ�yu����z�f-�vV�	0����M�w[3o���u�__�=�Z ӟ�{5�a��";z==�iEE����	םe�>Gf��K�^3qjA����j���_���`Z��,:t|b_���}|�����xi�7E��T�G���azV�(Q(�*�9����+�qJZ�R��K�[��f+�����g���Zr��UeI����������(|��YV����C�:Q���0��\�6�5�����g���$�M���f[�ƭ�� � K���/���.���|��ܹ�+h=�v�&Z�4���~h��Yk���B��a��$O2�t�־��h/ELz[���� ���ޭ�B�_����r�.τ� ��a� �k��U�#/F�D�V�_�hpOO�_���k9�a���*ڤ#�_!p��ܟvc"�-a��� j��6�^.p��������k��� uW�������� �#ݽ�c��s��,�ىcĞ>��͇�vb������h~���~s��ͷ>�XI��9�}{w�D�"cmמM?}�>��$wNn��\�F�\p;VdL��tꩅ4��HJ�Ω��(T�K(���,�}��uؓ��D�'x�����wuq�P_-4W���r'!3L�>��6O��M~tR<�': ��U�����&	F�� %�[\�r���}�Rm0e��U�f�Z,E?lN�^�S?��y|G��<.�@�a{y��>��=�.,,�� �m�E��89r�3�\I)���9���$pj,�ճ�Fl<O�����i;�IM��@"��i��S�^�|��\�|ǿ�����b��T��*�8��8Fa<�C�ѣ�X���Y|VS�%��}���G_�-7&�n��6���n̵���j}�-�*}�|z�����l�ω���F1�k����%�GowZ�"y��Z�܏���\�5���M�r��I��O>��x,� �^�rf�)��boa�r�6j�ŷ�"���<����j|�"9I�EE�rW��vw B�u�P@�!�n���c����)y�YJ��^I%�B�%�F�L*��k�]��Į��Ż�3*���py���֗�d>�K�>E�/���qU�
[j��k_9�\Mj��Fz�U��pA ��+�R6a�XF�,��<1��o��υ�s�%�E��k���-��R�I%:�)�E�䯀*����e���VQn4/[���#hP����+mp�S�����S�ܟ4>���+�b��(k�5���Y�VR�^�}��(�j��J��r(ND
�O2�����،�5�X��71��1Y����� �VT��̕���W��.��!0���J�4ݴ$��haGeE��3���ۓ���v -��Ɂ:�T�|f
�ZŒվ�S@Z�>�ފ��@�)�u��Dؾ3EV�����?�~(+��Q�f��:�)��Ҹ����w��%ǎ)�q�J���+O?>��$1��|$}|)�����CY�:�k}O�̿���whK��u���;"����[R�DB�� 	8_�4���rop=��A���̷u��C��/!���VZmwbJ!�vԲ�{�^�k��A��5)�5�.nn\4p�o� �x~�{\�e�T��}*J���f����P�ֺ}�vjH�~��->7R(�/��nq�� �j��j
�D�d��EF0���)�I~��(�
�Q(���qVd�f���� ϰ�q�Ҁ�٢�Aݢ8:@'б&ޅt�����#��8,�0&尐���^8��Sh %��AdM��8*�
m��3h
	a�LpQɋȄ���#��f�R\�
���#^���l�-���媊���`���ؑ� 5���׋K�"{*�7��פ���T�t})�"}�����bM�\�����v��4ھ��t�%$'�ag�z��C�J��UM���!))(�]fz�P�<�^�t�#�<o��8勋�Kfn������^���2�=��kldoV�jԽ>�����|w gs�5�i�[wZ��Դ��Ѭ�#f���XWm�!���y`�5��m���6ۖ�����]F��(��i~P�ڝ�G��D~j����<P8�ڻ�
�M�)~#W+��~?�yΕ(�o�w��pite��B���� hK��*YJ�223#7ܘ�9%�k��G���ݱ���R���r��G�J�c��E�3�����PWz�"�2"�EgB]B�/�"����.a>�
x��~��-��\!}����=����W�]�ٗ��I������ϊ��)T䵨��9w�|���6���׋W���2���ǲ���f߽p��ԁ�UWev�*7%�I���9��FG����7�/G{��S�HG|�"A��?�1*��<�TcY�H-�{gF0p<Ll��n�p�l3����߷d?�PE�>zӻ� �T��������v�d}%���
����.W�z�+�	��j�c���Ғ�Ϙ�q3Do���]h>E�wg�]���AQ[#55�v=3<����0�NҘ���w)?��6�O���f�qD�i�M�)�dz��:o�c�%�9 %|uKO3><::>aw�X��i�|��oP���hcH��[�XȎ_�*�	��4����w�$Qݞ�3N3L� �}y����I�}QH��Lqz�r`@�w9����ۜ'���+��/�I��qM�'B�K��FV�}��\�n�9��4qH �J|  ��G���T�p���7�s�pŴ���x���>�$$߼�5��fy���"�6h�x
L�Ȯ��$�l{���w�1{G"��sp(k��5瀟�^�8x�7zҞ�����+aw����EP�w���t���,��(�/@�)�D瑵��6��u�׏uH���A
7a�����'^www71�.�t���I�?W?.x�Oc��j�F���/;�O&h���\�o��C���b���d�8K�C�D:-S�jۣ�,�1��$K�,3�~��Kd JQ��܄ ?�%�����k^�5	��l�_��ӿOU�d�jW�J�s��e����IP<O4�v,o��k�@�>6��}��oY��G
�Z�'׬%�^���Դ��?Z�~�~B�v���z<1'X���l��p���fBF�3
f�r`���A2y�N=�.i��9)*Q�Zÿҧi�`�r� ��|��0�%8U��w�ߑ��v6cB�z���[��� �hPD�d�,D)$<����_p�Ń��1�r)���ˡ6��߭���7��Qϡt��|�.��}G�cG�2PL�o��߷��ӭ�=�ܐ�������A��~Ç����5��>��gjt	�7�=a���U�O燉d
�s� nܭ�6xb�d�!��e���kԁ|!�{�"�b׿o�%8=l��W�1|k-�t�k�A!�I�T�w��1%�惬��| ����W��VVu���QD����hz+��컚��3搙�:�Y0f��-e������K3q[ٳc����ݒ�":�;�F���uQz�jz��(����>�%H�P�	����;1�5\6��N�d9PD�E)��I9��5��J���4����:\�tH���V���FW-8��"t��k�ک:���&�%��a<{-0�yh'Jk�K6��Fz�2,�g9���6��7{���`�F��}T�wI�5K�:4K`Q���V�Y!]�UgE��U%�T5geA��&��4����e�	v7�Q\�j�#{ ���i��< ��.Mgxc���&�%�yY�Ul����2���G�꣎�X��'w�a�1ly�
����5j(�xr׮B��<�i4��Q�!rNce��dA�;�H��ڕO��u�A/�4�/�*�����<0d1�kt��֯S��~\&�.���bu:�u:�UT�1;}��dq!k���ȕ��ūCCM�%�ynr��. �S$��^�yJ�K�7k���É_mӒ��Z2��4g�ĺ��pn&�"�Wm�f3c�0��A�qÌ����"���>4��*x���`���Y�_c���� a�Zr^�x晶0L_��i����c��tA�,7�������n����)���T����rj,�qwvK��4�i�6D<Ҁ��lͳ.we�r�ʆ�~ўn���&c�CPE����e�Kv�_Z�^�����Xvκz[
Uy�ʅ�j���ɵ%��P�7m��Wq%��"vd�Ue�8u�HD��}i��۹a3���?�l� �C��ݮ	[z�7��.���S�� ��k;���i.[n��"�lK��/.p����%��.����psΖ��R�-t���n��zw��;�o����P`����ikY��.�cSѺm�~n�2�+����rW�#Mw�)�/ $Z@w�_�< ���bW7�����)d�$�<?	.��5\��n��|`C?X���\n�`���������0�x��Y׸)���c4 �� �C8^�dqj����F�4>�5	Ui�I�܆���{�����ǢC��Ӯ�����5���mY��\Uh��p#Y�qe��ic���c�ٹI�ʛ۔�A�^�ė [�'X�%�D7��=2��6w���ɺ7yY�f�8������j^��Ķf��K���$�k���EV��r6��,W}�G��6�Nq���fQ�k.��3��p��t9�$��)8j�*Fz�Q��qO���5��m���
T�o��`�P��ˀ����FCa��R9+#l�q>�2�"/�4"�9	���k��6��J���τ=E�H4.���(����W(HQv��6��p�����M�{�[�
Z��Z,b��O6·&��x�W�P�����w7��G��N)}F�ʥ��N��Y���ҵZ�RZ���B��4�~ź�@���^,K.>J��%&u�_jq[Y�@2��C�t�W��Q����R�g]�l�9�'G�W*��Ra�@]�K���g�w-��n�C��zV�4�.B��������h�]+a����9���|�c2Y;M:��Y�Ջ8c��'�P8���U>IK�l��dr̥7��&��B.W��eV���K�Xz���R<�Ɗ��!�#��h[DW������/�W���	z��8��O��k��}��[���g�����	   @���{�;;�;�xژ��oV�&_́���7�dUr��0��1=g�?����4@����)��\��ooȗ$ A�ͮ���[��q�;�^�$֢��4T���/dQ�oD��h�=�N:h����МJ%^���C�S�����,�n��w�.���Y�O�U���_���q��z��A�'�{��YG�64Q匑rT�۶$	��c���2�]#z�42D�w���3�t�e��r�.d�ސ=\
�é[c�a��L��7U<��{3`������~TO�7��X��:�s$[�{�D?���7�(�V�����M0ְ���9�gBc+rx��έ�4��d��oi�\��E�J��` J���a/��C3�]�5C�	B�
G5'k�s �H�T�&����Z�"���
�D��sQ(�	s���'��+>�񣁽�=,�+^��έ�.�I�Ư;�?�d����~Q<QOfdp�BR9Ea����� �p�u��HD�/Pb���
z�GS�ut���}�N9��9�*R���������]�}Ccױ�C��Ω��S��E���};c+��u��6��2�"��][��T}�6{Ȱ4�jd�
I#�~Y�d��2g�q�z�~���{�L�|T��2���Ւ�������.A�����r(J8���M5���F7&���� Ȗ:0_�����g#K�{3�5[��~T��]pc��)
���t�"m:hf��~��7�W޼\|v��'��f[�������p���n��g$����2mOh�\�*i"NDA)I!)��?d��B�"-,&��R�	�q�@��#�><���9Pp�˨v=Y)���`����7��+���-g��/���/�ۭ<���&�1K�'�~�2�����/L"��Tl����8Kፅ�[t̐�8e�KJ������'��1� 6�aP8IM�P���s�NM��=sA��?Q�����[���:���h�3�ǌ�1���3�ǌ�1���3�ǌ�1���3��,�ǌ��gFd!KUx�� `  9  ����kgb�Ag�bkӫfk�͆�g�w8Eo�T�vj��6�`H���]�H����L��x�/�I�-��l����}׉.�����zsT�~��Y��s9Y�J;Kdn�a	`�:�$MB�(IA��~��zy��h�p��6W�۫���C�׋b�֙$�ke��q��p}4
��c4�U�����e��EE�X��7,�y��RDY2�W���vF�R��Q;V&D�Q5V��*��e+��U�n�఍ڨ$�9� ��7u���
�f��<e���=�����As��}\V�:u������3!7�&�n��a
���o�_Q����I%D@�Kj�ah��{��{ iPZ��cE:$P:$�.�F��g�{�>�x׺��{�x>�Y��Z�
����J��h��-0ྃ����W��|b����Y���z���]���FW��k�W?���F�cZ�ü���E[K&�u5��O���W�3NrłE�S�p#ҴR���Od�W�6�S�~}3}&����
$���Ƅ�*oJ���vm=��d����e�x9_�`�!c�����k�ZMkTo&7?;J�0d�GٛtC��l4/���
Wy�Ie$�s�km���:�m7���u�#�wm�J٠6;���dz�xKd�7�x@4I�/��A;�:��;��}@�\9A4+��R��w�f�����x5*�V�!���S��TI�(��@w���q\��)|��FaA�W\�l�1���m�	{�ђ��Catgd�[DU��[~����_����{<��-W�����|,>�ܻPG�/������`C���}�߆��I��'Ie�
����)^�ζh���זnoy��9i�z)?��imw0C��Eq��6	��h�i;�����?�n��Y����Cr�ҩ=#`�w���-<F�.KA�%��io 	���}��.�z���^�Ά���jk=���kGPhw��/ԫY��P�W~]"lW���k��8�䷂I� /�OZ��wlq�� ��y�!�|Zx��W�� ��&5ꗓ�E��
/e���=�=�f�y�i�5N�T	��8�'l@Q����*���Ǣ��\�S=3,��֤\��ي�L�W*���A�C߹,���2�2'ٓx��@�-����B�w|�m'�5�p!"S�5}R3;��`%q%U�^��NUzն��q��O\��/�L�&�������m�Q&�}/��fƉ@o^=<\	ٱxS�Odl�B�Ɂ�oΐ��Q��S��%�;U�O����m<;D�.��꾡4i�����\���8�L�Q�+=JG}!��Y�=�6ܹ��	Xdh�����-7� ̒6�/ص斣/�Fl^,�.?=�{H�ʉ'qL$^�����e�Rpԅ�o_��G⩏9r�ݱ]��]����d�v�ʣ�r|���~�SV+လ"wp����
�.
�8ସ���SZ�����~��0��E���߮��@"0��D` ��@"0���3��Vt4Lr������$��b����[���`�ChM�̽�s��x�mZ5��?+ʽ���R�M�`c6��.nY�@�F^@᷹:��y���:�B� ?�`Q$�*}�ID�O�!O�X�4�X�/{����ϟ�J;�x�csOW�$�J=���u�GE�}�!�ې�w)e��4?�ީ3�|��Σ{FJh�����D�c�h�療��c&���ٷ�V��׹�i��c�G�xbAՌ\�����^ �7���Mi�:gEȆ�q��w����������M&���-���V�{�U����4HV�Q��'z.�a�id���eڿ1D���_!��v��SӜ��nߙ���&S��,^���8���ȼe7�O,qE?~��V8s5��rR[�O�o���x���֒�&Me]x��Kz��W�dF�~~qr��^^Cc�<���=;p����_�XT�a)�}^c�/�P�;	�{�aO�L��� z����םP�T��җ˩R�	1�9�T���)�v����z����NX\�y��ֿ^��$1�!I�w]�!Z<T�5�@H���?c�[�=�CR<w�6�Py�8��G9٢��M�숚��J�n��A�X��'���Ue�B'�7ҙFD��g��2.)�G�;�La�w��eP�����K����`���!�d�B��t�{�Osݒ� �0�D�A~3$p�ױ�=&�m-�.�s�צ��ˤgJ%c�9��-O�v7����^n���'�Ac��zn�������UGtw	!5��3A?�SG/%K�d�&n����%Y A� �H���v)����w����!���C"f�HI/��Ӵ_V/���ۓ!I��3о~�S"v~��3���`�ǃ`�-�A)��ÎQ}��,�¡8�F��d��/���h�}@jC�~6v�ƹ��9r%}&��aY�o�r;Q�7����d�M��M�f��tlOB�-��c�)'�F~�Yy���37z��U�����>�^Шrb���
&�Q��E;�q��#.��*[��^kō�h�>�+B�zm����_����4?{��D}k}L�_e�HJ�fM��:�%߼+vQ_��ܠY֒i�Ki#j��Y�%/�/��c���d�^2Ԁ[�T������Ih PKXDN͘O����_��������\�y�(���3v���7�Gɘ�\��%�������Ϥ�6<��R�
�'�n��L0M��J\T+%��E6�Ka>�:�$l�|#��?�dV�1i�6��n*T�)M���[4^,<�9}n� $����h/k/�2?'?[�RWbva
�oot;�dN�-PXV�3��H�AVW�U�Ҡ�c�#�vhS&LF`�S��=âL&�0���K��@��;��c{};򜚾�';
����n�����|�7�g/���� ��$f�_�0e��2����Ω&h"\j	���ML�H��b����g����\e�$�%�5�����n��@�]cAb!Fu�����şC�R�&6��B�a~lU����0y���z�Rс��;bʹ<�I�5�ʬ�	o@��
�ܨf��	2��>�]	j5�iV[	��X����Y�O(�o�²��tE� ]�7.�|)�.-Aki�r�r�f7d��$l�E��H㔙��^L�g{w9�x���Й��qv;g_���D�T�Aa`�����ˎ�B�ö�B���3f�|I���CbSC:-Kt��6��F�y�Zq�p
nD�%9`+�9�*��ٱ�����xNW*�I��ՏMA�c4���֗;��Ϗ���ZGn�쎝�+�e��E�������%BxΙϓ�	Z+c��H�����[��HB<����$3�Ŝ�C�Ù�sv���������;Q= :R��+>��Hf�]!�\�}�wBJ<�땄��J+��hz	��m?e�W4��F@`�/����ۏ��>�. ŋ�)�-�����LFՐ��$Gb^J5ME�a��ap������m�XۯĔc�U��BzD���Xٙ=Z�~V`Y� �^]G6T��|�xM�Lj��Z_M��hgH��$3��Ȏ�:?�}��/��@�8"��e;c�����a��=��]����-H>��$��P��b�/�����Ɖ�"زmQ�����y��D`+6L����)�-}�Xov��{+��e��@Gʚ�'��H^��Zg6���D��	~
�ĳRz����Lk��U�������2����(�-�!{"S�ARxZ��X�iut�꺃6��JT�!�'�ƙǷx���Y`��bW��״�Pϱ��[И셔��U��?`�/�xt��#Clݿ�̑l�"�/�3����x�:*���O:q啨�0K�,�]m	:��b��M�e�֠��Ym�\ObڃK��q~�C�;Hv�\	x��t�B�������"��e�	,��s@jDZ��#U|���y ��s��w�193�V�|\��!^y��Ƨ��l-�N�S��z�Ѳ!^�gw���},-�4}MGP^�&�C-�x8���z�i�q�N z���*�;6�龻7����r-�`�`q�*��0dy��h�3�R+���p�V�  �.m���ʏ�"�������=s�<��+�E�+l3���3���ݾа�7~WOx:�� ��3�tQ�t,�	2j>� ��@� q��5D����D�sl(��Zv���K����6r�ÇYsQ��G���S�ÍA�J�b�'u�y~b�?5:��������/~��4h�C����/�~1�_�b�C����/�~1��3�E�9[�g��A����/�+�����8�<���?�WM�/��N}-�'��5��	���V�7��ޙ�O�yDF&X��}Pv��V�*SIo�I�+�����~P���C~��*لJ{�&)X�))�B��i� �1�[P#��%��4�4h�4hb��j�4h]�94��4hp3+_^��(/H��$oc�J,/(�x�G*�C ��(`t������j�b�h�i̥�D�Sk��;��}��8�ܻ���9��7O;ɀ�|��"AM�%��̀�"��YE!~ULۻӴ�u(]��;gS���{�=��E)�Z�6"iQ)K=Z(R���,53�hA�!��D����&�졒�(B�([��w��4s:��������_����u���׹�s�9zo���Nz��BI����yC�A�0o*Z�=�YϞH�u��Køm��,���Ry�񾏍-���.O�����{�������u��khml~�?���W~�rɲ��ѿ3���{�9����E���~��'�����ɖ�~^�Z�r.k���@���#ez ��.�M�xW�5�Q-\�s^J���ƨӷ6�Т��o�~�R"[�.5[#�+�g��[�M��3����}+����I�(ߞ��H�]��ٽ&�UK��(�������_�|��>�X�2"]��n�����X]�}��~�;������i���Y�,�T��f���˭;�Lv��ޓ�^�A�������֭���M��N�.��O;;v�n{�];銦���"�e{p�tT"�� [�h�iB����f9���,*mO	�
��n_R;ޫ0�vr_��m�fh�x��̿vXX��nOa�R�%�^͌����H�zY�'w�7��]�DY/�j�@���J��v�e�7來e�W��;�U{�?�}�~�ʇ�����Ն-_Y&�++s����&->�a��E	�;���x��lB2,	W���o�na��r�^����=���`�d��%S^���쓜P����8˪uSP��ܷc
�5��es��zQ�}��M��i�����,������}{`��(y������daR󷼮+���{��~=�f�����x�-��/uE�t�4^�iB֑py���DP��ZrsF�,o�����1��d��la��*��Y��Ys!ñ���>K�Y��9S���L�'W:S;}���
�l���+�r���-�"��	�n�\��R��s��N	�L�ϮЈR7(��A��]�m�Hd@7��Z�*Ȑ>��R�[�,,M�w�v���]fQu�a���������vU��H�R�V>e��y�J�썫�z�yŚ'5�q��f>�q�:ܽ�m��߫4�R�-A�/�=�Y�#}J0��Cֵf{���+*0�t���U5��]S�s��-)�ޯ6g�?�m������ֶ-�mr�Ƨ���}0���u��&z�נ3(�JЧ<�_��D?xI���g�zOK֩)��q79�Q������A�*݂W���U�~.0������� �P�n�\�m�ੲ�g��S-uW��E��.�{�*�$z�~�hm�At�������Kw��]�r|��so=)�"`W�����N��L�y;���_�p��Ѿ���B�C��)�]G�hNz����'ט�hu���iʇ��ޛ�6����ْ�}�n���l��&<�uf�7!��ApMa���l'�ƕ�*����?����P^7O��~V��M~?���Ob[��Zr��nI�rK�"#���N98(c�s6P��� ����e�1��x�g��3^��/��茽�ǋ=�Ş�b�x�g��3^�/��{Ƌ=�Ş�b�x�g��3^��+�T�P=]c=�?��\3߮�G��ګ�[�R�|z}w18���cX��R*�˛'��9���n��������d0LM�x�Ǒ=I-��~�1�[�q�3um~�E]�w�mڔ$t�H9�S��K�t�c�jirdI�mU#�,�a�U��)�MX�S�UM�>sBN$����_��+��{��Y�8����6Hj���ܛ�d�[�����N%+W��L�*4����o��N�PI����]9��Wh*ϓ���j#%&�8�C
�ޭ8����
��
k����r�:�wK��5�B��=^}I�-] �T@}S��술nݳ��BnL|���g�lP.z���/9`�J�d��➤�]��3r�{��kR�;���>��:�O+�&%F�Xgc�V��J��6�g�o0�������^�i�G�����g�T��0��	���
�"'ޟ��Sl��,բ�엺AN,��Ή���\za����ɽ���5�o��b�9��햝7��9�5wD����qΊc�^oT�*�W~f��"�fb�O}î.5�x�����J�[��?�9_.�\�eU�W5���|��K))>Gd�JʌY<!S>��U}��nAlVFl���{��T�Pc>��a��sw�����H����|N��J���|y�3���&I=����3.�6���fP.h�=/1�NK��S�ޯ�c��Y�����ר^�6T6�Vg�㊂~�=J*�:���}D�\�ܾ��e�)\sˑ����++���ϥ����l��+�oȜ��-�~���S�%�rH���u'�ܯ��7��ȟT�k-�M��|�E(�,^6�U"�3��AߥA]7P��/h�`�x"��;l�>�}ْ���АI ��m��
25�#G� +�� ������f9��d*�����*|饨=pV[ �\^ ���b| :�ʀb�{)V'��AV{N@�ς��| ��d���D8u6ԃ�u�O ʔ�����Cb28C_�aD6�N4"��D#��3��!,�����(�Or�����g�6�Ne i�FUn5��� s>�������I�kAj�-h�3 ��x]�'cx���u�][hnJP`��D�o���IǾ��ok 砀5��,mԟ���N���D����--�Bò�4*�FW�AP4�͛�4��-�u�%�C:f|:GH���fҨ$��Р!�!��|
3(�0�'�E�b�X������S	%�Q9� �e��I�����y����:c��{��Su
��������?kA��[�?b�����ٌ�	.��������������K�0&�d�1��� � v|��o����s},���D%��|zMB�V��"M�ʞt4�u
>�[[�HqhY"���H�q�8>h�com/import-js/eslint-plugin-import/pull/1658
[#1651]: https://github.com/import-js/eslint-plugin-import/pull/1651
[#1626]: https://github.com/import-js/eslint-plugin-import/pull/1626
[#1620]: https://github.com/import-js/eslint-plugin-import/pull/1620
[#1619]: https://github.com/import-js/eslint-plugin-import/pull/1619
[#1612]: https://github.com/import-js/eslint-plugin-import/pull/1612
[#1611]: https://github.com/import-js/eslint-plugin-import/pull/1611
[#1605]: https://github.com/import-js/eslint-plugin-import/pull/1605
[#1586]: https://github.com/import-js/eslint-plugin-import/pull/1586
[#1572]: https://github.com/import-js/eslint-plugin-import/pull/1572
[#1569]: https://github.com/import-js/eslint-plugin-import/pull/1569
[#1563]: https://github.com/import-js/eslint-plugin-import/pull/1563
[#1560]: https://github.com/import-js/eslint-plugin-import/pull/1560
[#1551]: https://github.com/import-js/eslint-plugin-import/pull/1551
[#1542]: https://github.com/import-js/eslint-plugin-import/pull/1542
[#1534]: https://github.com/import-js/eslint-plugin-import/pull/1534
[#1528]: https://github.com/import-js/eslint-plugin-import/pull/1528
[#1526]: https://github.com/import-js/eslint-plugin-import/pull/1526
[#1521]: https://github.com/import-js/eslint-plugin-import/pull/1521
[#1519]: https://github.com/import-js/eslint-plugin-import/pull/1519
[#1517]: https://github.com/import-js/eslint-plugin-import/pull/1517
[#1507]: https://github.com/import-js/eslint-plugin-import/pull/1507
[#1506]: https://github.com/import-js/eslint-plugin-import/pull/1506
[#1496]: https://github.com/import-js/eslint-plugin-import/pull/1496
[#1495]: https://github.com/import-js/eslint-plugin-import/pull/1495
[#1494]: https://github.com/import-js/eslint-plugin-import/pull/1494
[#1493]: https://github.com/import-js/eslint-plugin-import/pull/1493
[#1491]: https://github.com/import-js/eslint-plugin-import/pull/1491
[#1472]: https://github.com/import-js/eslint-plugin-import/pull/1472
[#1470]: https://github.com/import-js/eslint-plugin-import/pull/1470
[#1447]: https://github.com/import-js/eslint-plugin-import/pull/1447
[#1439]: https://github.com/import-js/eslint-plugin-import/pull/1439
[#1436]: https://github.com/import-js/eslint-plugin-import/pull/1436
[#1435]: https://github.com/import-js/eslint-plugin-import/pull/1435
[#1425]: https://github.com/import-js/eslint-plugin-import/pull/1425
[#1419]: https://github.com/import-js/eslint-plugin-import/pull/1419
[#1412]: https://github.com/import-js/eslint-plugin-import/pull/1412
[#1409]: https://github.com/import-js/eslint-plugin-import/pull/1409
[#1404]: https://github.com/import-js/eslint-plugin-import/pull/1404
[#1401]: https://github.com/import-js/eslint-plugin-import/pull/1401
[#1393]: https://github.com/import-js/eslint-plugin-import/pull/1393
[#1389]: https://github.com/import-js/eslint-plugin-import/pull/1389
[#1386]: https://github.com/import-js/eslint-plugin-import/pull/1386
[#1377]: https://github.com/import-js/eslint-plugin-import/pull/1377
[#1375]: https://github.com/import-js/eslint-plugin-import/pull/1375
[#1372]: https://github.com/import-js/eslint-plugin-import/pull/1372
[#1371]: https://github.com/import-js/eslint-plugin-import/pull/1371
[#1370]: https://github.com/import-js/eslint-plugin-import/pull/1370
[#1363]: https://github.com/import-js/eslint-plugin-import/pull/1363
[#1360]: https://github.com/import-js/eslint-plugin-import/pull/1360
[#1358]: https://github.com/import-js/eslint-plugin-import/pull/1358
[#1356]: https://github.com/import-js/eslint-plugin-import/pull/1356
[#1354]: https://github.com/import-js/eslint-plugin-import/pull/1354
[#1352]: https://github.com/import-js/eslint-plugin-import/pull/1352
[#1347]: https://github.com/import-js/eslint-plugin-import/pull/1347
[#1345]: https://github.com/import-js/eslint-plugin-import/pull/1345
[#1342]: https://github.com/import-js/eslint-plugin-import/pull/1342
[#1340]: https://github.com/import-js/eslint-plugin-import/pull/1340
[#1333]: https://github.com/import-js/eslint-plugin-import/pull/1333
[#1331]: https://github.com/import-js/eslint-plugin-import/pull/1331
[#1330]: https://github.com/import-js/eslint-plugin-import/pull/1330
[#1320]: https://github.com/import-js/eslint-plugin-import/pull/1320
[#1319]: https://github.com/import-js/eslint-plugin-import/pull/1319
[#1312]: https://github.com/import-js/eslint-plugin-import/pull/1312
[#1308]: https://github.com/import-js/eslint-plugin-import/pull/1308
[#1304]: https://github.com/import-js/eslint-plugin-import/pull/1304
[#1297]: https://github.com/import-js/eslint-plugin-import/pull/1297
[#1295]: https://github.com/import-js/eslint-plugin-import/pull/1295
[#1294]: https://github.com/import-js/eslint-plugin-import/pull/1294
[#1290]: https://github.com/import-js/eslint-plugin-import/pull/1290
[#1277]: https://github.com/import-js/eslint-plugin-import/pull/1277
[#1262]: https://github.com/import-js/eslint-plugin-import/pull/1262
[#1257]: https://github.com/import-js/eslint-plugin-import/pull/1257
[#1253]: https://github.com/import-js/eslint-plugin-import/pull/1253
[#1248]: https://github.com/import-js/eslint-plugin-import/pull/1248
[#1238]: https://github.com/import-js/eslint-plugin-import/pull/1238
[#1237]: https://github.com/import-js/eslint-plugin-import/pull/1237
[#1235]: https://github.com/import-js/eslint-plugin-import/pull/1235
[#1234]: https://github.com/import-js/eslint-plugin-import/pull/1234
[#1232]: https://github.com/import-js/eslint-plugin-import/pull/1232
[#1223]: https://github.com/import-js/eslint-plugin-import/pull/1223
[#1222]: https://github.com/import-js/eslint-plugin-import/pull/1222
[#1218]: https://github.com/import-js/eslint-plugin-import/pull/1218
[#1176]: https://github.com/import-js/eslint-plugin-import/pull/1176
[#1163]: https://github.com/import-js/eslint-plugin-import/pull/1163
[#1157]: https://github.com/import-js/eslint-plugin-import/pull/1157
[#1151]: https://github.com/import-js/eslint-plugin-import/pull/1151
[#1142]: https://github.com/import-js/eslint-plugin-import/pull/1142
[#1139]: https://github.com/import-js/eslint-plugin-import/pull/1139
[#1137]: https://github.com/import-js/eslint-plugin-import/pull/1137
[#1135]: https://github.com/import-js/eslint-plugin-import/pull/1135
[#1128]: https://github.com/import-js/eslint-plugin-import/pull/1128
[#1126]: https://github.com/import-js/eslint-plugin-import/pull/1126
[#1122]: https://github.com/import-js/eslint-plugin-import/pull/1122
[#1112]: https://github.com/import-js/eslint-plugin-import/pull/1112
[#1107]: https://github.com/import-js/eslint-plugin-import/pull/1107
[#1106]: https://github.com/import-js/eslint-plugin-import/pull/1106
[#1105]: https://github.com/import-js/eslint-plugin-import/pull/1105
[#1093]: https://github.com/import-js/eslint-plugin-import/pull/1093
[#1085]: https://github.com/import-js/eslint-plugin-import/pull/1085
[#1068]: https://github.com/import-js/eslint-plugin-import/pull/1068
[#1049]: https://github.com/import-js/eslint-plugin-import/pull/1049
[#1046]: https://github.com/import-js/eslint-plugin-import/pull/1046
[#966]: https://github.com/import-js/eslint-plugin-import/pull/966
[#944]: https://github.com/import-js/eslint-plugin-import/pull/944
[#912]: https://github.com/import-js/eslint-plugin-import/pull/912
[#908]: https://github.com/import-js/eslint-plugin-import/pull/908
[#891]: https://github.com/import-js/eslint-plugin-import/pull/891
[#889]: https://github.com/import-js/eslint-plugin-import/pull/889
[#880]: https://github.com/import-js/eslint-plugin-import/pull/880
[#871]: https://github.com/import-js/eslint-plugin-import/pull/871
[#858]: https://github.com/import-js/eslint-plugin-import/pull/858
[#843]: https://github.com/import-js/eslint-plugin-import/pull/843
[#804]: https://github.com/import-js/eslint-plugin-import/pull/804
[#797]: https://github.com/import-js/eslint-plugin-import/pull/797
[#794]: https://github.com/import-js/eslint-plugin-import/pull/794
[#744]: https://github.com/import-js/eslint-plugin-import/pull/744
[#742]: https://github.com/import-js/eslint-plugin-import/pull/742
[#737]: https://github.com/import-js/eslint-plugin-import/pull/737
[#727]: https://github.com/import-js/eslint-plugin-import/pull/727
[#721]: https://github.com/import-js/eslint-plugin-import/pull/721
[#712]: https://github.com/import-js/eslint-plugin-import/pull/712
[#696]: https://github.com/import-js/eslint-plugin-import/pull/696
[#685]: https://github.com/import-js/eslint-plugin-import/pull/685
[#680]: https://github.com/import-js/eslint-plugin-import/pull/680
[#654]: https://github.com/import-js/eslint-plugin-import/pull/654
[#639]: https://github.com/import-js/eslint-plugin-import/pull/639
[#632]: https://github.com/import-js/eslint-plugin-import/pull/632
[#630]: https://github.com/import-js/eslint-plugin-import/pull/630
[#629]: https://github.com/import-js/eslint-plugin-import/pull/629
[#628]: https://github.com/import-js/eslint-plugin-import/pull/628
[#596]: https://github.com/import-js/eslint-plugin-import/pull/596
[#586]: https://github.com/import-js/eslint-plugin-import/pull/586
[#578]: https://github.com/import-js/eslint-plugin-import/pull/578
[#568]: https://github.com/import-js/eslint-plugin-import/pull/568
[#555]: https://github.com/import-js/eslint-plugin-import/pull/555
[#538]: https://github.com/import-js/eslint-plugin-import/pull/538
[#527]: https://github.com/import-js/eslint-plugin-import/pull/527
[#518]: https://github.com/import-js/eslint-plugin-import/pull/518
[#509]: https://github.com/import-js/eslint-plugin-import/pull/509
[#508]: https://github.com/import-js/eslint-plugin-import/pull/508
[#503]: https://github.com/import-js/eslint-plugin-import/pull/503
[#499]: https://github.com/import-js/eslint-plugin-import/pull/499
[#489]: https://github.com/import-js/eslint-plugin-import/pull/489
[#485]: https://github.com/import-js/eslint-plugin-import/pull/485
[#461]: https://github.com/import-js/eslint-plugin-import/pull/461
[#449]: https://github.com/import-js/eslint-plugin-import/pull/449
[#444]: https://github.com/import-js/eslint-plugin-import/pull/444
[#428]: https://github.com/import-js/eslint-plugin-import/pull/428
[#395]: https://github.com/import-js/eslint-plugin-import/pull/395
[#371]: https://github.com/import-js/eslint-plugin-import/pull/371
[#365]: https://github.com/import-js/eslint-plugin-import/pull/365
[#359]: https://github.com/import-js/eslint-plugin-import/pull/359
[#343]: https://github.com/import-js/eslint-plugin-import/pull/343
[#332]: https://github.com/import-js/eslint-plugin-import/pull/332
[#322]: https://github.com/import-js/eslint-plugin-import/pull/322
[#321]: https://github.com/import-js/eslint-plugin-import/pull/321
[#316]: https://github.com/import-js/eslint-plugin-import/pull/316
[#314]: https://github.com/import-js/eslint-plugin-import/pull/314
[#308]: https://github.com/import-js/eslint-plugin-import/pull/308
[#298]: https://github.com/import-js/eslint-plugin-import/pull/298
[#297]: https://github.com/import-js/eslint-plugin-import/pull/297
[#296]: https://github.com/import-js/eslint-plugin-import/pull/296
[#290]: https://github.com/import-js/eslint-plugin-import/pull/290
[#289]: https://github.com/import-js/eslint-plugin-import/pull/289
[#288]: https://github.com/import-js/eslint-plugin-import/pull/288
[#287]: https://github.com/import-js/eslint-plugin-import/pull/287
[#278]: https://github.com/import-js/eslint-plugin-import/pull/278
[#261]: https://github.com/import-js/eslint-plugin-import/pull/261
[#256]: https://github.com/import-js/eslint-plugin-import/pull/256
[#254]: https://github.com/import-js/eslint-plugin-import/pull/254
[#250]: https://github.com/import-js/eslint-plugin-import/pull/250
[#247]: https://github.com/import-js/eslint-plugin-import/pull/247
[#245]: https://github.com/import-js/eslint-plugin-import/pull/245
[#243]: https://github.com/import-js/eslint-plugin-import/pull/243
[#241]: https://github.com/import-js/eslint-plugin-import/pull/241
[#239]: https://github.com/import-js/eslint-plugin-import/pull/239
[#228]: https://github.com/import-js/eslint-plugin-import/pull/228
[#211]: https://github.com/import-js/eslint-plugin-import/pull/211
[#164]: https://github.com/import-js/eslint-plugin-import/pull/164
[#157]: https://github.com/import-js/eslint-plugin-import/pull/157

[#2930]: https://github.com/import-js/eslint-plugin-import/issues/2930
[#2687]: https://github.com/import-js/eslint-plugin-import/issues/2687
[#2684]: https://github.com/import-js/eslint-plugin-import/issues/2684
[#2674]: https://github.com/import-js/eslint-plugin-import/issues/2674
[#2668]: https://github.com/import-js/eslint-plugin-import/issues/2668
[#2666]: https://github.com/import-js/eslint-plugin-import/issues/2666
[#2665]: https://github.com/import-js/eslint-plugin-import/issues/2665
[#2577]: https://github.com/import-js/eslint-plugin-import/issues/2577
[#2447]: https://github.com/import-js/eslint-plugin-import/issues/2447
[#2444]: https://github.com/import-js/eslint-plugin-import/issues/2444
[#2412]: https://github.com/import-js/eslint-plugin-import/issues/2412
[#2392]: https://github.com/import-js/eslint-plugin-import/issues/2392
[#2340]: https://github.com/import-js/eslint-plugin-import/issues/2340
[#2255]: https://github.com/import-js/eslint-plugin-import/issues/2255
[#2210]: https://github.com/import-js/eslint-plugin-import/issues/2210
[#2201]: https://github.com/import-js/eslint-plugin-import/issues/2201
[#2199]: https://github.com/import-js/eslint-plugin-import/issues/2199
[#2161]: https://github.com/import-js/eslint-plugin-import/issues/2161
[#2118]: https://github.com/import-js/eslint-plugin-import/issues/2118
[#2067]: https://github.com/import-js/eslint-plugin-import/issues/2067
[#2063]: https://github.com/import-js/eslint-plugin-import/issues/2063
[#2056]: https://github.com/import-js/eslint-plugin-import/issues/2056
[#1998]: https://github.com/import-js/eslint-plugin-import/issues/1998
[#1965]: https://github.com/import-js/eslint-plugin-import/issues/1965
[#1924]: https://github.com/import-js/eslint-plugin-import/issues/1924
[#1854]: https://github.com/import-js/eslint-plugin-import/issues/1854
[#1841]: https://github.com/import-js/eslint-plugin-import/issues/1841
[#1834]: https://github.com/import-js/eslint-plugin-import/issues/1834
[#1814]: https://github.com/import-js/eslint-plugin-import/issues/1814
[#1811]: https://github.com/import-js/eslint-plugin-import/issues/1811
[#1808]: https://github.com/import-js/eslint-plugin-import/issues/1808
[#1805]: https://github.com/import-js/eslint-plugin-import/issues/1805
[#1801]: https://github.com/import-js/eslint-plugin-import/issues/1801
[#1722]: https://github.com/import-js/eslint-plugin-import/issues/1722
[#1704]: https://github.com/import-js/eslint-plugin-import/issues/1704
[#1702]: https://github.com/import-js/eslint-plugin-import/issues/1702
[#1635]: https://github.com/import-js/eslint-plugin-import/issues/1635
[#1631]: https://github.com/import-js/eslint-plugin-import/issues/1631
[#1616]: https://github.com/import-js/eslint-plugin-import/issues/1616
[#1613]: https://github.com/import-js/eslint-plugin-import/issues/1613
[#1590]: https://github.com/import-js/eslint-plugin-import/issues/1590
[#1589]: https://github.com/import-js/eslint-plugin-import/issues/1589
[#1565]: https://github.com/import-js/eslint-plugin-import/issues/1565
[#1366]: https://github.com/import-js/eslint-plugin-import/issues/1366
[#1334]: https://github.com/import-js/eslint-plugin-import/issues/1334
[#1323]: https://github.com/import-js/eslint-plugin-import/issues/1323
[#1322]: https://github.com/import-js/eslint-plugin-import/issues/1322
[#1300]: https://github.com/import-js/eslint-plugin-import/issues/1300
[#1293]: https://github.com/import-js/eslint-plugin-import/issues/1293
[#1266]: https://github.com/import-js/eslint-plugin-import/issues/1266
[#1256]: https://github.com/import-js/eslint-plugin-import/issues/1256
[#1233]: https://github.com/import-js/eslint-plugin-import/issues/1233
[#1175]: https://github.com/import-js/eslint-plugin-import/issues/1175
[#1166]: https://github.com/import-js/eslint-plugin-import/issues/1166
[#1144]: https://github.com/import-js/eslint-plugin-import/issues/1144
[#1058]: https://github.com/import-js/eslint-plugin-import/issues/1058
[#1035]: https://github.com/import-js/eslint-plugin-import/issues/1035
[#931]: https://github.com/export * from '../3.0/type';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ���c�d��|��ͭ7l d�vr��z�y�w��������֬�ҫ$�r�D�)w6I��X����W�2SZ��Kq�ctl��i�����8
VH�~�z�j�����_5�n�OY�GJ(�3�Q9�LQ90�:�����w�Q%�ͼ�"�����x����G��;~�'/�*��*h7Q��3�X:�S����Z �:m���Fr��I򊳏�7���Lzd��#���,#V%&ڸ""�L�-{Q!Ӌ8W"C7��{��D6vW��K6�A�|��Z����)�S6������	��NLx���E�5�#�;�̩�����	���pI�u+a��>AS�V��#�#��o�{�Ā����@��U���8x�&<�E�������b���[�p���qF����ǿ��K�����zƹ�Z�?dm&�%�SX�$��"[�Z�o8I�؜zagpH��2$=��}G�?y"CJ���C��UX��
:DӁ�\ZS�`"���	)�<DS�d�"��S�v��Z=C%O���T��a��X���2�P�mF6�������?џ+�Џ��j����Oi{�k��b)���=i�8Go��=�ӹ��C��'Xi��{-��JCW�)J���A���j��o~��y�nb�wy��4��a~K2�p�����6IJ�����S1�[�!�X��.m�>���O�X_�:������%`����V�h���6F�J��;	��(�4G�����H�hF�Jr.�M�!D���5�D<��v�������ϭ�%|�D3KP)�_G��m�q�H�;�x��WY�!��_��Im�|?8z�N��n��P$�`��P�N��6t�I��0���4O�^�������Oѡ@��+A���J��`#9�+!r��ͧ���7[}D8��V��B�#ʬ���6����_��N�R�T_[oѾ7��[�c5��Q09TW���Ϫ7ƌ-N�Ӆ��ţ%eI}�@Y^	|���&6���ĂS����������[x�=�{o:_�B}7��c����l�m��C�Y1��<�(}�B.i��ӎV���'ѿ'����_��ԭ>c��0G�ԙy+��s9�<�&j�^�젪�Yx5R��Vj� �H"�N��t��q�2b��B��+w�F��M�`�)=�W�PpƗ��O�u���S����0�$�ž�ҏ1�8yU?� �X����M����ߦ����vv��C��"gN���2�O;��qw��i��#pöڙ[�� ˩F,��{.^e�I9mWnUO��c*���$�g?h�o��DFFzL��,<u������9������b��6��� ȭ��;��x7&
�oƛ�-M	�ϱ��{@�;�Id��c<��"c��khy�r-���i��X�����q^��`��SŤ�ߧvP�b��=)�^;�������X��_��O����o�Vq��V�E�ܺ�,��ܔ�[�]:���%��J?#�^J�*xF|����<o^�㽹�xM��R�🆏��lzh }��tV��?m}'K�(ދ|�Yβ�L�KWu�xhTd\�R�T;�o'n/6�������W���u�N�߄L[���`��e+܄��1���A�o�3����p�zө������|$���n,�i�9,k���>� ��267e�ژP>gxH�;s��Z�R�ҵ���X�
�r9S���x�E���H2?ߨ&�١NIi%ʣ�P� �7g�V����2�a)+6�8�X�2�jvi,�d��qf��{9o�i��%<(�Q���~�3|���;>�8�̥�h�^	�~6��$b����� �V ���{!}z�b�/�饻���R)�?���q_l����b�])���X�� ͌�0�|���61�?�V�`$�y,ֿ���7/�?h�����c\�+��r�ώ��6�֦]xlA�)L'�x��&���g��w���(�`/����??g�����6��9�L2a(@ZMf�<�>�$6T��0:@��<�6��I�<G�;�[��bbxH^]���q�=y���Y�vzb���5�J�\<��)?��V��ߺLL9����)\ͳ�`�&�:�p qQ��f�4�M4E����^f)�#}��H�14�[�+��(�:��%�-��H �2�c[�i��K�ND��1�~��`��Cߞ�+Ǒ���]N�?il#�m�q=֋���FR��pQ\S ���I^�W���Y㪺Ԭ��x$<u���ek2i������5r���_H�(���AܖXcm�y���W�X;�X���ݎ>�sF�D�+M���Ԇu����"G����D�æ�f)���:��B\�q\f���<�}|~�����[lkr�Đ�=5�J8���x��H|{�.X����j���Xϸ��NI��]����%�����&��&Jj8$��n���EAX�	��N����=�����:����Fm�5��a���x�g���'u���?� 5�O���VN6-Ee!�$H���0�`��G�4z��6E���	*��?���B��F��S��;�3<6|V�p�<}�**3�P:�J��v���-�sM�)�9�Q`&���}xe�pҤ4��S�@Ѣ���*���6J1))NJB����X�`�W��Ť�1�F�U�����/������Ң�.P䢒1^@\�4�9�}g2Iӂ������??�C'3��{=���\��6{y��:�_a��E��Ồ���с��̌��O���0Y,1�s�Q�B���1��8��0F��?D�����7�m̤#o?Ne����t<�����KX����P{����P�4�a߱��ZQ�C9��gt�v�軀C��O�^��^�F��ߪ{E$z"�B����'�����ڪC����$C�W�ZJ;�0�I��r��o��z��L�����"K=%���!�:�OcУ]�y4�ճC�~�l�Ϯs�Ńp��u��ӜG�a�'���sa��YނoV҅Z��}Z���,QN����fx%��*��ެ.5HY�0.��ฅ� c��/e��"�(0��q�`������6���/y�0�([f�ՠ�Z(�J]uh6��n]"w���\�j���!&���;rD2��ӗ�͢���B�J0�m�L�)F��-�I^+���g�L>T�� ʊ��+���f�L�^�ѴJ������i���yPmf��
N��kf|�m:�wb�Y�B���=� �[�K|g�:�#����H���j���v�
}����Q{�m)�����a5Et���h(`�/qQ0�.;`#L)�˄cCo��ה�8����B��� ��-�`��D,���d:�Z�uEg�������+j��Bޣ��c��(~@^��R��#M�P_eA���b�~Q(:(������#4���.���h��Ep�nќ�H�c]\W�cS��V
�|����6�v8�i��D�,���\�&�{69 ��l�(�G���6X�qh��j�� |��g���H�;v�j���zCԦ�����M ��E��t��� �6��(u��-��CǭKRDy�������5�̈́�U p�Z�#J�p7�zX~?��&�S!Ll� rc�/���LRS:��D�������g �^0��i�rƆ����G���q��MO6D�&=��d��7��RN�^���/ը_�ʰ��p���{�����+',��(ۈ�d>F����D�t�p����)W�;4r�4#�"�.���2<�!�ݏW�XK��`�۩��މ������ �VP'�E�-�u��`�Us��H$��w&�l�f���?�
��v�R�k���ծ�Q>��F9�y ����bḦ�� �6�R�s��%�%��[�4R��	�[ܴ|ivC3o]:&�<���A�<0������Q�;é�N��^y�g�jn9�$g0<ȉV5��|�����-���m.y�-�9�qG�w4�ɡ#e�O4D��h�TJ�v*�ZY��E: �b�W��FO�4�,0I}l�6��-uN�g�߸44j��D��C�C���|}�4�=Q�=¬�Ia`&��#���ͽ0��s�A��>Ey.�YYw�e���24�c��eHt \��NF+��1��BDiC�F��dfWv�R ��D���UF�ݞ�{��gG�W��+��U_���-�]}�׫��&ӫб�����J T�Ρ.:ZTc�V�L����Ӯ����k��6��?������zg�!������y��8�C��.�:�u�ݧ�C�>����<9p\y��.��y�&͑�����,c)���pB(�%����l:�E�� �#�!��⨕�����Q�q��k6��C�k�Q�m���Fqx#1Dn�3�)��I��6z���Q�ƣ��~�=x�P;ӏN��Q�t�ޞ��ȏ�ÏJ��7����nM���Ӛ\�4�Iug�a�xy�z�#�g�����oi��ܒ��tP���ԃ+�&��FMz@a���nFQ��j��S�o��]����aˏ@��O_/Y�V{��x5�}Jy0��a��H�,iJ��r��3�leEc��M�.�
zy�+�YtbVf�s��4�P�w��c�+� ����J%�o�P��1z����F��J:�>�yf�T���4�_�Ό��s{� 70(�Gֿ�c�u���)����V|����[�8|/���Y��}���+#	h.�G�Χ vZ�����߇�r*��̌���ɮނ]���-X���� �~o���.��%U�m�\$�;R߈� �R�#�X�*jG�-Z��7���n�̼ �/}wY(j���y��<�8�¾U�]J���DX� ��f�fI�F�47�������r[�����
��͚{������������3����K� S���o��i�\��Q�r�	��U��:���<�O�qdt����3n�b�x�9��{<8���w�A�����N�{��_����n���c���0�{���>;ː�"�����jVijkS[KK�t���ds�o��o#���%��M��GN�?3�D���ߑ��K�>K��,�|]��y`��4�)X����+5�E0��%�0�h+����f��,؉��"	�q�%�H�S���g:�i��m Wg�<f��1�sWvn�7� ���#3�/9�+[S���|�h��F�e4O��	���G>�x՘��Mň-w���(�(��?t������;��F���A����DNoO��42�{���3$PS����{�����|�C9O���qE�ԋ�N����vMނ��b]f��� �s�־��Ex�!�T"�X ��C����jjI^(d���RS�����}�O�P��Cf�(�v��7FJɯ1OQ ��������MF�2'�0�|��T�SK��a�5���:�'#��w0Գ(8�j�L:ۇ�}ؠ)ADf����9g��2Jħ�崓�R�K���xN��,�F2i���6�K��K��B٦�*�s�f<R<���tn�d�P��Z(櫔��ڝ�|���<�(z��C�:ۿw�� c���E��I��H�"iR���p
�?s���e>|��J�0@p0�B��ؘ��U��dLt��_g$�;��(P,�<�	▼N��&�8��ɹ��"B\���,��p�P����=4N�~̞��|�2��ţ�{ێ"�~CQj\��E�C�O�Ó7��S�����Ϸ�ͣ6A�<�n�M@}<#��| ?���K�[��|+����A��m=��ȏ�v =0�̹���k�_g���<�#�0��G`������@���
�J�~�A�Հ�|��� �W� 9eW6_�o��a��]n	�G�	�z*,u,��r���z��T�P~��N�,	�ݍ TR`��L�M�8��o�%�MAˑ�P�5f��	����g�+E9:'�0j>Ne+�+��I��WYm��@���Ykl�F���lm�vǛ!�;IbסH�΂Jx�(.t������^�� �I��sp�۪�s�̔/�-5tGYC�R�>�]6�Kk
�������_Mh��eڥ��Tv�B�B�F���Ƿ�����<{Q�ar����r_Q.5���S�P5r����4H���WN~w5;UIγ��t W��x'�]�P�d�)��<A�����J��	9aG���÷������m��l)��.[����M�$1.z��hj��4f�L�@J��h����� �zw��E��	�i�h�
�<�v'�"���R�(Ŝ��m�۟�5�5�ڗ����z��a��PNur�W}�Uh֟a�&ug�0� a��x���_uFz� �=��ÿS۾n�ᡞ�gɇ�;h���l.�4�vV�ė�j�6�N�=r�����2^���v�����`K"'�(P3T]����AX�3O���D�1�B�p~#]�<n�t34~���/���@�������"N�q��$K�.������� 4��?��ɏ)�}��Pv�!p��`�����ӣ�[���/�i[^{����-Ҿ�O�y��XDN;�.b��7�"
g�D� sN=[��8U���.ud��%w��Ѩ�s�F#2���:Ԗ>[Y�1����k�E�r#ֽ��l�/��`R����x�M�S�P��y�ݔ(���������,�s�b!��(�>�Iz?�Ni�E�i@�����Ķ����(�V�^J��zX��) >4�������T=�Un���]���6��D3Ek�d<ճ���-�O�*������S�c��),N�&>�y�X��(�]O���"bm�P�o�=HXR�d0���$�x߉��@��d�Kɶ%���I�z��%�
������)�?9MǴ�*�(���9th?��}'XDc�a0��ӴxN诔<}|)'_3�E�  l5T'+&jD��gf�v�D�� y��$jx�� )������`n��)Hﰠ`4�����xav��O��d1���7؁�V���P>�s!�yc?6:bm�p���� ��V-�q�x�&��#����X�Q��?d[wn�
\0����֡���1�]�i�lP���}:��Z�(�B���8��n&�{�IP��ܶI�9�s��� �kgԉ��u��j̊Ď��b�e�k�ܐ�+�e�=�����4|u��j�ݫ3��D���ؙqo�=d��A�"� ⁫'2�����!�`o��'�2k[�nڷ�������Ӈ���^R��s�SY��(;�ג���XkEki��;D	����j�p"�$Q��S�|"h�o����IU�� ���{(���"r�����^a��˴��p�XJ����5~�-C��w�Y�Zs8}v%�>���q��4؋ޤ��=ڋ���viO�~��=R�#o�=J�������k�ޤ�xo͡aC6��c�����e9kl����J�w$8K{7�~�8��$u��O�'1jtS���H�]E7��
��r|�S��� �p�A_/�s�>�Cр�`�R&��F<)Ǘ�-0�7d����X�����lT`���9x�F�=��_�;s�����x�~���|F���]��t��y�t�-͆�c6{��F��q�Q2c3LU1sC����Ѥ��Q���m696 ��P�y�!�[���y���'�W`i�p\:�J��bƞ��a���1A�T3a�v�L�l?�D>y���g�TP�����Z�}�Z��gX�y9>�Pb�<F����~N/s�(�.o�B�����l��"�z:}=�ͺd�a,�D8�3't�9�	N�ROp~:�?��J���MϙY����l�$S���T��$�OB+�Ёc��t�uK�<ψ)�����~h	|x;��2֗�_������$V}C��Ps�沞���	)��J�4FY���s�q�'��.�c1Նƹ���%,�˨��^��DS�~إ�y@JR�:Җt�3ɋ%�ijȃIrv�"܇1��Ȉ���C�GO�7Ek��HS�����uũ�V܅'�y-v�X7sv�K�۠�)����p#?�,LGM��І�z�I�߫�����I�#�$�R4�S�x��2��i�0SFL��Cn�oa!��} o+�<�#����"�r�R���vB��F���kџ���3��o���+����qk(�}v��<�{�[4~�q>f��w�(OW��n���,2o,I��$�zʇI��w�\l(��RE�Sְ���_l�+1��!�G����d���m���&�z!>NëP=:(��l��\S=���B`mλ��O�C^���'��V��+���U3��_x�u2i�@��N�5L�v��<T�4�� �;����:�V��	�h�ϓ�pAV�����%5( ����&MI������>�MVU)<�r�(e#������Z�R>�0 ���mZ�ð=��)�[L�EY�Вt��ւ_��a��^ �F�z��YI]�*�P�]ʯ�%�����A�P�����l��2)|���L�M���x�ωl�)�ݶT���
�Zi�aי�ix�"�+�*��Z;mf@4��e�5��-��A�Sqx��:���h���QX���k�$�S��?���$W���u��S
 i��-�w-E�����9	��n�W�&��Q�a�S3D�! !�ӝ��U�(�b;�T��R~��;�V�(U��[ݛ��`)Nq�"�-�/ubðh� �E�a��m��vcU�e4��-���3�yx�e� 	�9����ۨ��߇��:Ik��R[����^�Ehb�y6��w��u&h3�eb�W��&*|�#c��2���XH �� D�� 21<V� �?i���G�[�x"���H �����˰KQh<'�A�/zh�<
��rh��{��h�����W@r�
��Oc,\�N�����h'��/\~����.py2���͜8a?H.�!mu�?a��cǵ��NJ��)#��A�ϝF��z�̍�dyw Yv�,=>H��$b@rd"�<�ɯ� 9�@�';��I2og:��:��i��|0K�T�,��vhk-&Ћ�~z��B��s���.�h-ᝉ�s ������^�m:9tR���#�� �U���$�i�u��2�QCw#T����uuX\����V�
[<�{W�b�/�����g��b��W����F;#�N�|x��5�`�D9{�#�C�ec�L�M��Z�DG�հ��S���2��Z 2��RU�=HV)�:�������:�~,�=������{��Hc���
�0Hb�;얖0:�EMT�,�L{s�g@˄�#��A��W�y�qxs ��u1r�+ VM��5�h12�S��*Ed{����ȵ.�첀R(�@fS��8�O��3������Y��$��3j㉰`� ���f�� ���<RWj	��
*xg"xkǻ7�V��i+��w.v@7.?��(}3��`c�2�`���u��$�T���`�#��P+�MP�G1���[��3��?�,	
�6���)5�(���yZ��xn
��V���R�uٙv�9;�.�8э�z����(O��-)3q�p+/�]sH����{wv?���fY����ɧEy(�SNb_��,��Mna�?�f�~u�ȣ~vJܲ��l��]��y���~qI;�_��G۪��&��8:������?�eW���8^��Q��c4]��"�B��V������.f:��P��<ͷr��H$
A���f��.jZ�įs ��rF;�^�@b�B�j��-�y0 ]GѢ���SM�iX�ˊ�Ҿby4�s�v��/��]y�N�6��,F�&!��?���M4�|e�Y�uB=O6לLv�#LѬ�qL�G�{'�/��[�x�('�k�i�"�0�)�s����zr�v�:{�z�zp?�f���,��=��ɾ�r��ps MH%���o,6�����37<�a�2���3�+$�B��TsRx�VV!�\G�p2eJ���y�Dֈ�l)�X�S�����)N��-/��ax��~���ⴔ�VZ�D!A}��._�f!�������w(ZI�)����b��T���i�!�Q�Ĕ����{čU�'�섺��-��� ���4ΕQ]4��$@�)�F�T4��10�<�$Q��ª3
^T�aM����i�j�7�s���3��^Vڋ]R�SFՓ�2�zR��|C�u�����;�q�͹т��߮J��H�'�)#�氱:��:�×�ۧ�m����TF�Xæ�l�"��+�牬C��Q�~�<ި��[�4�����A���R؎x�l`Z�W����5�#�]~W�\s��0{H�D�WlK_�֧ 7C���B?�������M5B�|z�$��.YԚ���H�[�m�%���<F@�L����;yN71/�L>���PF�z�0���nFC�½R��(�Q+T����c�y	��h��a<E�� ь'w��av�''3�u)���zL�G��>���{z�iHL���3y}l���a��~���-^a��n\��/L��Ȋ��#�q��ϱ�=�$$x��a���;w�^ނ����[�˞��x�ً��E~"�{��:�W��zU��zO^';�#uNw䭑V1��ؚ��Ys�v=k�U~��8����CZ�*=��Ϟw�!�/�N�ߤ/�k�RL>:E~w�h��Z�FU#������C6q�~�=$�#z��ԍ5�c,E��nc�r���8�c�@R!�#DWI^�Z.�ꓥ�� 7�w����(�0�C�'��}1'�����!O#˒rK���L��L_̵���빩��AH*�a�q�sDy~N(Cf�M��R�_��A�a��K��-� ҆�n��֑v��6(~�*R%��ŉ�)��:��a��aQ&;�M������S	\��X�z��C����8�&�i���x�K�b��EƯE�Ov�)��cΰ�D�s�	͞����(u��"pIm%��n�\�Z�"n`;U&��bG���]�B�/ޅ<'0���K�An�Rr���{4"�NG!́ñ�o��C�Q�� V�$xW$�r��a{nI�=�j�A������-�v����+�xi9v������wN��)5���Jo�ݨ�Ω9�$��n�搉i�U������w-�ph�O�H��gu���f�>��Ƥ�#�Z���g#ϟ��׉.�S��E��&�R1�h-�2��Z����-�W/,���GF�����	��+,����kF�^ޕ��{��f!z��P�	x��]��H�'��Wu����[��ަ��)~��j"͖P�fr�����[���Kb��5��/ͮw��tNbhT�chzG��'�M )@��\�u^A@�����ǥ��ݒǢ{�X%,��ؾ]������*�6;k�gd���ˇbT��H$Q׺v	��)�W>��8U&���y]v.լ�~H- ��hh��ۊA�;�-�z0��_n�muÆ��"[>J���g�J��%���5w;�.�e�n<������:�.j_�^\�	�צ��i��M�'�~������]��'�០�:�0��@ �3 HG� {�a�+�o�]x��ȷ�S�	�v�L7�4��M��e��t[۪7_�4��b�qz�SZ��-֥���.��f�¯�#�R�X�y}�᧽o����]J� �u�-1���a��J��D�{�y��;�Y�߫�>5��ؤH#�4�����}c7��[Pc�
#�䮛�}��):!��e�j��l#�K���3�2��@i�w�Q�����$�~v*�B06��f��M�M��$�>�P�wj&�5�)�x�����WSs0��X�|ѻ��,�48���<�B-�~��Ǿ�<��'��9S�_J/��T��D�8]�(;?I�۵�.!�%�I^yߤ_ۨm�����#oi-���Sѳ�۱��`�g�I�\�e,�2�+����(�Qxa-`.u����`gG���:Ѣ�B��F&>��ދ�����ͳ��M�9��O�E�(@�2`��:�r�.��ڢ����0|�08�Q:�"��-(c���ߓ1�!&�Y^����#�HO����6_:i�V��WU��H�*,��4$�l�4ݑY�%Q�)��<�!^p�?�N��Ep��h49�6���4|S��W�5��
���g-�+�n�LCR��6MIw��G�-�lAvbӄ��Ya�<���yK��i���\�#�rڔި��4k"r͙�_n���&���{�5�ƹ��ͽ����;Y�g#zl:��!�R��� �'搀��5�n���0���P����|C��.�4��$`��A���7�ط�b�@0���/0Ax[�3:�/&�����L_7�����f�B�|Fo��%��ߐ}�UU�V�+�/������v��~Q!�4OD]W ���l�nc'>��ޢ/��Sv/�Kk����ۀ1v��;�5.`�;!�p����Q����م�$��v\�	���	���.�f�T�L1L�"⎙�;f)E�S&)'��<*�v��L)&�������#t����0^G�'�Ŵ��ַ��\����A1r���K@�EK1����S�Q��-�l�7̩J�7�S|w`&g�䝂��=�9�2e�1ֵ8v.����4����G�e�!�`�9�z=��� n�K����6���	�D�2���v�v�a� o7�z�v�"�;�J�����(��i�N�q#]�3-@p0#���s u�p[��ӽ���MX�� �"� vd�|�uK?+W%�jZ�D9�7��9�璶�T$���wɷY��6$&y��# jB���BRu
�B�m�5�3�V�0O����r��ב�`�9=��o+�'d�!�4فx7X���~�)�"��t�B [����2� nFB�#�L��i�+*��#�x��>�/�n��#k���R6p-��5��N��=o�հ}4�&8�~� c=S��4L��Ei�0�13NdpC�pI;ņ�8#.�>��sZ7xF�����k	�LN�TRA4ι	���,�V�:���y^9�t�P�I�x=��қ���!�.�w��:�E�� f �6tƟ��b�św��ZÏ�̀Q��H|��K��a�iXm���`|t |ߧ���)]����I��V�Qq65v:�R��N�?$��
-�
�p�q������[�}�Z�$�yW�7����>��U��7i�<�M��4U+$�X'�ǿ��ɥ��4���>�;��K����`l�ᫀ��Էfd�.@k6���B}V�3s���	����ky�m
U�ˬ�T,��|�A��$���w��x��Eˍ�}�����ei���aT�qR�]�L3r�g����z�Lԥ����9:�53ڭe�P���z�XТ�b�=��A�� �[����]�/'{��g��´�ça���9_Z��z^���e�������z^��c~�z6��>ßv�Ġ�`����&Zه�v39�{�W�N�[8���q�����dJ��,����O-��Ж`�J̜�Ƴ��LD����Wb� yr6�T��R�K��ڜȀ{?#7��x��>���H���)m���-}��Z�|�? к����bd�P?1�NaW1yg��-T"g�Jds�e]cY��"�/bд���L��h[?#做�0p�Y����6GG���2jo�G�X9�k�4#��D��4����z�*��%�:�;R
��}0�����}�Ʉt�酰D�!�_aQ�@&����;lQ&�L�-��X�3�q�"ڭT���8��f�޾}�ú�!�FA=�����-�j'�5ఞ����a] 1�RP9��K`d�XTKI�aXqK��)ۅO�D��U.�&LWej�e	�%&&�s�DOT��$>�w�k�������I#��۔��t��h槇��t�q�3�gK����.�nQ_5=���`PO�O��P���1����������[�KR��I:�l�b��̲D�����=�o���'%qw(QX9����ɓ�DR`#�����y_3�	�఺�˪�A-@����\K��a~I�Y`�'����%t�7%��N'0�� z
:���Ke�hBe�y�!�ݑ�l6�as�P�đ��ߩ����ֆw�x�K��VC�D���@�\�3��ֽ�߾��#M*�m.�
[V����'W)��׋�r��	y/4̫>[������l	#u�|���-:U�,B����R(	���IL�d�ѷ��m��;��ɸͧ"d0E���p�Ak9+�����T���ܧƜB���p�gAb�Cȸ�P�:;��r�Uf�*�E"�Q%���xT�o!d���.����&�?���/ߏ���R��G#��M��I=��x|h�����56��������DX�����t5�_���g	7�]b���>�|����4�Kq)�����I������B��%,_�2����V�-O�05��$K�J}�$�
������d��H�)w�f�q�����4{@�^s��}��v��,��Nf0�������ٰ!R�}ٌ���"�:�Q7z P���cI��~4%~��z�܉~Ϩr'���^3��nT��X�<�\��Lq�e��gv?�!&��J�����(�jh�2�c�&	�H����m�V�A$-Y�T�h܌o�������K����h����Q�cS����>3���jM��+��ʊ�8F��U]��3ކ|Y�����9�Ie��h��w��/Ic
���R;�����c�.��~,q�]�I �x"�c7�Y���p�*\��K����Q�J�
J�^&U��y�z��s��G`W�"�J[�S$B���/��Y	�m������L�3���F��=�"�[X��e��T��n�-OE�79xC������iU8�ڞ厣h��!'p�-^ۓ�O"p�����&'1}{�y�rM����&k�ؽ�<v5��,$�Y��Hd!M"ۖP"�K�c0�u?������o�n'$a���D��o�E�Y���M���0F�&�O�y�������Zm=����u1�9�7��I�ƈ�~��&a���	%����3�_�%m��۝��D�oo�A�>G/_����ץ'"_��"_��k��D�k�1�|m��o���	��4.__{��]�'A�V�������%��NL���I�-��ͺ��h����=�%��1�Y�H��t#a?r	{�s�����n$�[b$��비���x^�:�K��P���꫙u��}��\.a���P�h<�f��H$1>������x�oL��.i�C]�����������ި����$��w=���;۾/��/�|�m�`iP8�L>^��y_��.��"d)q�+������ ��!�T�fY�r�Dsis�<�	-���eo��k��|�"�,t���0��n�/�?�5F�0�8c}��Ϯ[����84����Ѵ�>����w��Ud݀x��J��,?>�:�C���Ƭ�1D�/L]u�1Q�� j��TawQ��h���W� �e1��d&G��xl\��c�.�f��V�4D��GQ�&D}��JU��Nf���\~��Շ���ì��_�M��[����]6@�Ǘ<�umy�.������v-�/od�^��Oimport { GetManifestOptions, GetManifestResult } from './types';
/**
 * This method returns a list of URLs to precache, referred to as a "precache
 * manifest", along with details about the number of entries and their size,
 * based on the options you provide.
 *
 * ```
 * // The following lists some common options; see the rest of the documentation
 * // for the full set of options and defaults.
 * const {count, manifestEntries, size, warnings} = await getManifest({
 *   dontCacheBustURLsMatching: [new RegExp('...')],
 *   globDirectory: '...',
 *   globPatterns: ['...', '...'],
 *   maximumFileSizeToCacheInBytes: ...,
 * });
 * ```
 *
 * @memberof workbox-build
 */
export declare function getManifest(config: GetManifestOptions): Promise<GetManifestResult>;
                                                                                                                                                                                                                                                               �����?g�ПM_D�̼	��C-qth�J�:.��#[=�KG�H�Q����'@��OD���(�l�i���.=��ҥ��K�	���ҧKЧ��>	=ҧ��z����}*�>�C��Ч�.����O�'F���C�t��q�T�D�T�S�}�3�)aF�������W	�#'�znJN��O�JW�z1藣G�uA�L�鹦�G1	��<�Q�R���.
ړ����ʫ]�*�L 己�m���M���A�m�^�*@Q�p���V3xX�{)�zk���ζJ�Qו�ٯ��;�A�.ЩeDղ;�� R!���\-[qj�>Iqj� zv^����dL�42�!�Ui }m��n����ݝ�K˧�0;���<Ƃ�� �X4�����V�*��)mQPi[,��DYB�B��Q�ޖ�G#a���͆���֖�W��	a	�����E�K�����sz��7�y8�{ٝ"�2����E��a�ըv��N�Z�� ]�k-�>.i�K�B�'�uNFQj�������۪�]I����N�J(�p��sfe�����N�)y��O���6PTN�ro��9� V���b9k@�.9��)�"��R�Q䪠2�k���4��Q��mb	lXY}� ٻ�j���h�JU�����i�7���Q>o�(�͏Wk�������JP_ͺM�(/�B�(_%�R<
�˳Gzԇ-3uO_Fj��)M�o�4�5XҼ��%	�I�Z�d�lu�-�e(��p����`��Y"��2G���MĂ���9�܀���t�]zVy�}L�I��^c`���F��s�5�c�`v�B8��t��������^�U@S���zH"�,b�¶����Џ��g����jP�ϋ꟟aK��?_`����?�Q���8�s�������+ &��tIk ��B��(��*�Yp�/#�Ŕ$�,���v�^�&6�BQ��f$e7A�`S�]ո≲����NN�%�+����=�|~����D񚕗x�\�� ��\�Fx��J�R�J7MɅs�ѵ���S�K�y��p�.�sYy)������}���'��.��볿4��W���>��o�5a�.*�bT��*�tM�}Q*�'�Җ��w%%VinЩ�c�٤魲���q��(:���nu�o&���N���� ʰ�S ^�v��~��K'�
�G4�O��j�S:��L��L����kP���r���'��n���RN?�WM?�*�O����,4m�3'���맏�DDs�i "ww�Ow���V(�?�7�| �3��S��fCMA�%N�s��.�7[QKކ	B�{��st�#���wC��I�2/�D�A���Yw	_��Dt�O��q�	2�g�L���>�)|o�9)oP�g�%y�Nf�g����)�ﯴy�fSRc|]�l��K׺��׻� �h��U'I2��TŬ"d��k.R��	��R�Nej����侰N�؊L��i0�|��S��)7c��m�0?��2v%j
���˖��Y���j��`}�ݡjd�n�g���������'(�6���.ϳ��t��u�Oq��ڂ���� ����k
>y������V�i?SP�yn�Q�NF���),�\h�^l�U�&╘�D��iz�-���}�B���K	���c�,.�Mf��lcj�q�D���Y�JL�:?����d�*������z?V�3+��R��2����g&y-p� '�a$�)�*�\i6�7�c����X`��l��O4�E�k����y�8G�PC�� ?��n�ȁhA��m8�B|�B��|}}J@��YF#RA�6���·?��kA?	"���E��'@s�cu�8��䰖'�:GsF���L�m�����ލj�bImHq�7?M6��&��Sr`C@�춦��.��S�R���|��.�0�Zr��Ϛ说����?��8.DȢ����,�n��5�����#ԥ3A��U�$.z;m��D�h׎Ѻy�ˢT���8Jy�1�֯�n)��opA��v�=<蒠%9�Q���fO�N��W%��0�*i��8����Ƿ���Mh����"M��Y����Z�O!�@=?�Q=�JK%M���0�W0to�p�Ll�kY�x�`�6V��׊�Q�ZS@4��=)Syw����}{�!��Y�y3���'�Slӭb���EQj��>�+g�j:�g��V���R��ӣ/D�P�V�ϛ���f�ܺ�\�٭����/�/��%��o���Ӳ�t�y��rZ���?뒿5��R}�F}�{���$��0�i&���ړX0�^5w^�T=<�;���n�i�ܼc����%I�}�b��%JS��D�0��-������eǼ���̻�(�
-c�7O�O�~*|�_��4�y"��Wz-9��@��dV�_Ϗ�g��i4h+t�TL��K�bo�b�9!4��57����1J�B�_����
���%�!���G��"���Ӻ:N�:�o�e���+��t��C���ʩ�[��!CW,��u���X[oe����Ե����}e�R[@,�S�Щ��φ`��a��[��
V��� #�c�@��Cw�QT�)3f�n�\$��q=G'�C7���l���YVR�NϞ%*�R!Z;f;t��o�,{�A v�NVOH~�.�������r�b�fl�%mtI����E�
҆�����,3=��5y3��x�2�W�pwi#�����`��������k0,cL���cq*_~�H�y�B�h���%#��D�H ��偽���F�,�@���Ħ���P�yh�a�%&�)�s)����ڙ�OB�)�5�Ew2��]TZ�f#	s�az~���J��9s(���A�`�~@�3�޲� ڜ�;S��0�E�� ��!�)�6!U����1; ��C���Z�<��s4і��ּ��niSx?m�=N���X~S�h����3=}Đ�޻Ldަ"m�Y�x���;\'�5�m2���v��^.Z��pI�*��?�.b��?���"�#���px'��a4����,��_�6+�*U�H�ڂ���S;�I�]lFS��_#)�z����ja��fX�Ab�3����w��X|�-��(r�::5��d
K�p��c�uaf�����ݹ.�Tz�}�6�b�^���[���^�#`�f"�W��: �d�n���P<��I�~gb ���J��Xۏva��m� W���e�ԃ���3�T�7Q����/6 !��ni�s�8�3�� >uz���t[9p��x;MU�Hs�X\�% F�y��#׌��YcPKyh����)��RT�%�J_*�����1*`���C3�>@���*�����2�N#�aH�uKշtH�1fc_Յ%rVo���������nv�[��������"����M�2��Yڔ<����t���#L�ό��h֔.�Bg��x>5���8-踠N��q*�
z��в�b$�v�� �ȋ���kU�;7e�I$��r�$WY�n��&<������7t�밼��:7��as�v�k��#]�No��s>d��`���`֠����[�6��q�()��������B����vD�1�G<c��]E�5������I��-���tl��90�J��'��9�C�ըnvzc3$�g&B�蔔֘�5$�Q��y�k
�h�3,Yp�Tǯ#�?��	\���8 ?30�(=��X�XT`��ZLI�yGĴB��4�,#��A�ƧƲ��}�ێK~�J�\�\ʞiZ\�]�=����<<����������<�}�=��{�=�ܳ�۸%��9ѫ���)��-W�{�+�����Ж�*�p����ܶ�)q��@�~�ҶZgr������Cv%��+#L�N���t���>�Q${mQ#Ϙ��I�"9<t�>I�o����W��H!A��%�d{�����1A�hf�U2
n�S�b��8���A�~�g?�cښkl2�Nu5`�v�} ��֐�����[OI>u&w,��Ǎ��|9߷�zM�<���Oq��BJH�c�AP���QLRf:ȴ�:�t�0Nm��I��dWOt��%��'���J�MRQ�de�q�Y�����I��D�$�/��Pz�`��px�!e����"(%�>�OPT��֧iH;����5u�ـ9�כ([��>�b��A���J�����"�#�8�Zm��Q��S��������$��<"SrV}g-�E�=��Yc䲗xd�nG�6�,����FI"�}3�k�Q^��2�Q6�!)��&2�"q���ݿ8F^�i�ر��D&�atM�P(-Ӭ���5��^�r��!hϗ��|��a�=̗�Ä��I;��1�?�	cډ5� G�\=�Y�*sDթ��Be��DIM���ئ>��co4[-]_��fS�X���2���fJ�/�B�̫�c��m2�������a�Ro'Zv�ѧ���6�Ֆ����^ m�8^��3^�b��u"mQ�b=�á�zR���ͺ�������W��*Շ��*�����8�qf���YI���1�?�$X��xm[0��V��F��f�BDh���ɢ��j�C��uYy>�NE�--��:o�pQ�(��W@���)[/�E���䥂5�r�'�*��jL!{��g����3�*ϳ��`[�γ���r�K���F��j2���T��^>̷�4������f�t���L9��A�(N�B�D������0`�䰦<ZX$��s�Th"[�B.�l�<?�5bY�b*�}'Pƣ�_6M7�xL�xḊ��t���W��:�M����9ų<���yD!�6=�^I�;���-(8�vZ�"ʵ�`y�ԩ��!�3���D>wsUFJ�NM�$�=�γ��~� }=_����Xdjp
�+e��u"iX�J
ҵ6����]�u�aX���	`'�d3L�F���K	23qP`�������qv;�3}�Ë�,O���-��a����S	ws�@[�K�;q�e�m\ury4��Lhׅ�&����`�_a"K�h��F�ŢcB�����Ly�����n�+���A��o�i8ܘ��b֍3�X� <}V%��z��(cB�7��LI(���m<�&>�ܪ1��?�Z��)��=�Œ}�DT���������iN����ߴ#a��~p�e_F��|mr��51��7�@��`���9�����'r0-�]�0i�.�ZHY��ic���?ew폲s��	񾛜dB�(	���ݟ� ��P�s_�2�"�9���ƾD�Z��� ����d����n)=�<g�5L���-�h-p߷�P�o�|˓1�D��^v=ۖ�6�؁O��BVyɠ�H�*Q�P ~��oȕ�72�)�c3�6�h��4u�]I���]%P�!�����;�
���5!��a=5�U�g���(e@;�� y�
�0�s<��p�� mc��-�k�9{�`Z�Ej�-�]'l����n�\e��r�����ٞ:��>�aJֱ�r�f���6<ȁ~�9`}�W�b�ל޵9��PN��@��L&t����+��a�m�M����pVlG�Χ���{[L�(V�Kv/��.�S欵f2,�s<.��r���u@f��� ��%e-�V��P�"�g3K��\U�ђ@f�w�Q�XIW�{�V�q�f�v��[c�X�4Y��bY��}v%/ڮLH6�� 3㪊��T;�fL?��d����r�~
��ٵoS������6�]e�K��8����HQ��m��]�#�v������=��f!}����&���k���s>~ ��s�$���	c�\{��o�a���cALTF��\'�d�4�63����	PnN�����K�qN5��of��f���C!ovr_x��zH�����
�Ԟg��Ģ�$�t�h-�>O�1#�&�of��D�	9|e�fD���~
"IxE9e�M�Q�w�q^2��a�|b���]��G���O�m���� A�e�[��q���5p��JAݳ��'���:�g~}9%�b�:��՘C4��L(s�U���Wp 4@�oby���@J|����^�'�6%�!�o����5��wR�Vw)�k���u]��������V&�[z���ֶ��=���w�7<h�o����󫀬R2Xk���h F���m� �ל�����y��)+����:���4�|�	��?��8?�aZ��;\�x�-,�<<��l/݀�mW����u���I0��3w
^#�B܆�_g��P��qȾe���fN�j�k�����F�ٔ���֚���Ԭ�<�WP�9����/�{o�m�g�� �� I�|�. �H��-X��@D�L�s���F(�h������6���P�������gkp��g;��v��w���Y���7kd1���"��ĻGr�k��Y�+�D̙lB�:G^ۆ��w������q�of�_̷��ۘ�9\��-0��cLm��Qn Y�����;�Q�j\21�4�z9<G5t���:ڡ��z�ߟ�9�{�ڶ����C��P�=���59�l�T�a��>�sp�]L�S�����<z�7�����"���a��,z�����a1v��}O2��	�����O����MlM����ڕ��aT��k����X����@�.���<��ܻ�K1E�0hI�+a������3rrz״;\��Hhx��0����u}/W\�Y����kY�+��m��}jؚݮ�V��X��2��. ����4�r�1����R�c���j�g����q"O�B�z���߬����r���E����R��"�U�Q��b^��z]W`_��W=z/�����C?ODI���K>���g�|�ߋd_9�o&|`ř��Jvȳ�AvO1��qTu'��ď�|1h>��Ga���#��?���%�D��x>�����6~�"x�+FÓ�ۖO�K�-l�0�Y�)�pf{�)3w�#޼1EvUc~@(˔۱Rx�6U�#���`7���.�U�f��#�*���^z\��T�̝�T!~��1x�P5���� P�+��v��u`��L]?z��@�A��4)�aȝ X:��EmF(�NGg����6�Ww'����Lu([�Gw�'�����f�r>��M���L��N_-E4ȟa+�u�ǔR	�A�ې!���Ix��*b,��h8*b�B{�/蓮���|���?/�g��r���64���Qݹ��FA�nm\� L\�Wu��b���b�a�k��$�*D%�����1��X���v��}ݫ�H����ߣ��Z^�L-��\��l���H1�������黣���d�>�3�ɥ/-C#	���p@��مݮ�6��f�-%��l��%˘��6��26M��[r�Ξl~.?Ug��X\���t��e�鋻观��5�~���m�fk�,X\Q/83��`��*��*c��2��G�)�~X�BB"��p�#������{+��E�L��J,t(�M�Y���h<���/�$������v��8{^rJ`&��a*^{�`��[��e;�uێ��i{P���#�R�Q��;m���ZM�_�>
���u�Iǰ��P[0��Yvc����AW���nO��=\���?���ηc(C?�z�v�}�q���9�w��~<s����qw�w+A�����a �35��ѮƗC~l#LH_Hee�T�xꃿ�1��lL�-�bms<��%J���P�ڿ ��1��v���3h���j� F���]�Qo�����v�7O�}��9��iw�N'����u���A��U^r�Va�$����R(��	��� j���� ��{h��Z9S�?��TH�V�'p��l˟��[�^���0W#\m��ը@`kB��)xav���c�U���� ����֚�9v�i�oGno����$s���� ;��r<ۛ�֪F�4��x���Y;������F��uZh+ k����ە�!�� 4�`�zW��Uߝ�5��n�(�s �O���(��'�s��0�>����|8���P�1��m��$��ML����2�(&��Dt 5ؕC���"�ʡ�^��7����l�x1��n���E������E���9p=ο�J>����N�ڿO�ˑ����i?Vɽ<�.hO[��c;���Y���m	:z�!��`ٕRNjM�2Ą3�`?Tv* �$�}���������7���J;��ǟSvt�&&VR����%E��6��^g��)=b����\�7n?�k��~`�P����N7��y������fտ������m�iD3��S���p�Axî���H��"Z�u?�ܺ8��r�����Q�6O���\��G�f����|��<���z!��qM�\��:�~���d)���J��hT?��V�~o�pB�!��E�ۡ���22���ë�������_M��mF��E�L�}㍋�����!N�^�K60j�5����AX��v� �Q���M����<�m����z_OJ1����K�S�ߡG��%dvӾ���()��p>E�[l��(��j���/l:������υ[B/��[�u�sRu)���:>C.�&~�g��T�:�=��ϕ�YQ֙���|�x�����$j���^�Y��J�y�
Y��o\)T��GyX>o��o�ސ�� Ldd� >�)��W;����^}�i��!�Շ����n�|�%���Y�|>�x�L��̞�9n�M����9����A���B�W��I��ԟO��|?�`B]J��%�x���[�����f�z-'s9G�]�K�Z�*��֝E�h�x�dM�({�,y-��'KJ��g�v�3��E���;���i�IB�[���R*�u�Ѩ��K�S����:5��zY�ѐ~y!�*��n[��@tuony��6���z�WO�]m��by�;���h��iM�EU]%�,�N�J2;/�E��E��޸G�r$�<@J�H���ed5Z��:�֧�@���|����\dl�r�B��:+�YÔ!�rV��ZUX��uh�R��#z�ԫ�S$��V�Y� �s�`�u�\Y��ȑ�n&>���K�ݿ���ͅ�����&��* ��D�Wj��OGIX �$S�V�&�2\�> C��[��S���1���k�oB�)��\�6��|r
���wQ,/����K�b�_��`dp�ݒ�)ߴ2j����$�(��6�9�E�R����U��U����CA�O��u�ˇ�h ]��ՠl�^�.��y���h�#i!�'���p�j��6ä����������J��ɗ�H�q���i�P���:B�`hFy�㕡Pk��:���+i<-������ ���à(>I��(C��'�/�?����o�LKk��?ޖ��#��:^ �Cm��(J�|n���m�0=pSN�����ӄ�7�j�@4n>ML�{�h�q-WB~��e߈���B_Z��Mq czϯ����h�7?W�Ƅ�/a�h; �*,@{��C�l���[�z�i�I��$ ���A��FT�2prߣ�}5���C����7���>x��ZWt/�5��2�����c*nb3��A%]8��3rz�?�%�.Г�[����jW��ݏ�m�����g}:��)�;:_�7!��ܦ��(�fn�[�5لS8�]�#<��1�s�%Y��W[�m�?7�6_���Z}���h���[ 9{Fv�YW�B-Uǔ��px*�gP���_A�a#�9וb+IM�K�c��Y���M����7�^���wvt��M}|�nz�8��&����Ni�J��!�,����cj�C9G�1�Mv�L�_��vXh�g��p���Ht��ȹN�/E�=q��\���%���\�#sBr����v�L����H����O^��|)7X�-�fx���d>+�[�tQ+e����r���˳[�����1��ɢ�"m�Vqo�<4s)�ߥ��O�	c���Ľy�ҏ��J�V�0�IM]}F���C?Y�`x��V�A�k���Q_l�z��\n�l�R��0�J�{�IjI�ke>�h����y��[Ԝ
I�)�5i���cK�y�I�\�B�t.�tV`�{��Hչ#�KҬ+0�]�>q;�~K�@���v0>Ի��2oB�m��4xR�}��p�˫�"������њ�|�.!Z�FSmj�B�X���������̦b1�NN�8�U��:u&����A�1��\���G�3�M�.15�-�޲K�F* ���D�����$)b�<�8Pi�TqӁ��,�����Z�&�X#��c���4�-YQ�]��G̦��A����8{��}z�ETlP��ؚ9&���	�UQ��������>��Hu�$��`�&F�����Ƅ��{����޴K�P*��k>7	��%�&�3V����9��u�}���	�w6�7@�rR�L���kg�������?��z֋z�D���Qc���"ܧ�ċ�eg���|]j��ZLoإ��J�O���Z?���t����j�����LP��'���B~��Ija��L��lG3���~�p?�Z[׿ݠ��+���??�ӼA����4�K����N�����X���\N�P�ס�Z
F�0�?v�q^�������[+u�����x��[��c�8�+�~;`���s���r6����LB|&�2��d�U˽)���8�,���]�b]��w�e;i�e{'�!����d�|:(�m�j��SN�tĪ�qUo�>��"���CxP��DYz�ݙ���M=�r��Y���]A��Cx���Q���k��0��?i��'#�U:<�&���e���H�Ö����&��e�#>�sѓ�y���q��]�Bw����k��cLTϔ������[a����%�>G�:;�$t��<���>�0r}�+������,�׈_v=Mn���j,{g��L��]��9ٛS�$��) -�D5����"�D�n�Z�G��M���X5����F=2�&���Ŵ��j���o�n�O>���[�_3�K�\�A;�j�.��Q���dv���k,����?0,o���wh�(���שּ���~07������������s�>�}fz%4W�k��~�Q^�w�/������O��}����?MR�������� ���_�[�(����Lˈ�n��}����i��Rk�~���ʢ��̷�Ǿ��T	k,��� �x\�VP➧�A8B�!^�������/�*v/w|�5��@��gd! �>1��
��Ljׅlz❐�׳{ɸxty�w�a��n��S��BA7�k���prB_X8ϠX��u�S0�.���9�~y�oJ�q8�L��0kv�aG3��rv�r��Ur�����=���6�2�3h�Ç�x� ��N8�s&q�ȏ�������j,ӧ㚃��6��`g��Hoj�((|��Q��G��� ?�]��F��=���W��-%��<2\$i���F�Y���!\���J�����W�d;/��&:"�k��1����'h~�f��<Cb(T�6`8V���bZbI��.FtV�v�V�s_L%�Y��G���u�v��Ha�����:��ރ�%*���*�����E�1�g�O����O<t2��%x\k�*m�h����$"�N.xCb8w�Ľw��!?�OK�Ws$><�,��
��^z��ԯ���v'K�<y�P�-@�� j��d��qeړ�:���������_a�l�W�CC�'����s�g�d'���[�iKD�D���������^�Ψ%;s���j[�Z��۫��ɥ�P�&�n	/á�"V��y��h�����}1%��Q�e�^��;u!�rz(t=�6\����f�*�ӆ��c�R�\s��Z�OU��t%�!s�p�"�������b�>U�t�d^���u{�w�2���
~�?2�C�:޵oj���Ĵ��D�8��)�?�c*�5^v�a!|.�֥X�E3/��߫�Tg������˫�]5�X�T"���.�ƥMA�ȲG0R�\�@����FJ�%� �@�NC�JOIR�$/�E�Z�����ya?Ck�\v��*��h��k��b=��*=ZH0�M35ʫ���`�Qy��t�qL^����Y�6�兀c���L'��C��ot=&]��F(�d�e!{h��X������f=<o'Ҡ�>����9�����j�[�7���IL��?���=~&\�*�2מ����L~�Nm�<B��*^�)J2��Z���oC����u�������N�{��+��~CXK�4*-�.���҉�����^F8���S�����m�G�@#e��<L�+�L����4��#}͞-�N�J�h�}��\^^|�K���g�c�#\[�=��`�a^�+��l��/��Q$y���כ4����9FS�
R`�m���y$\�އ����$5�B�E�PA�B`�)���؟}xh,�vԴ(6��5��NL�����R&�X#@7�{@�W3����f�#�?���l�Ŧ���,��HS$�/��s�{[�����̫�h�0���.�Y�u���g�9�ˏ�~`4�6�g�����ez�R�a�cA����d`Pϣ�V��l��	�V<Zl�/�m�Y��mګ�U�W���U���L�/F�����}��O���@3x��|�K+ZM� ��J�����J=V�¾c��g���{��ڳxܞ�D<~�Qz^�n�a&�VRl��d<_`�Ow��dP}�Kt~��OAo�1<,^���y�)��S�R���4��\Q��y�]��HRp-��mz=�`^~�Ɗ����ڬ*穣�Xu�8Ҽ�4t�I&I����,�Ȗ]7�P��P�B�9��n"S�Z>���'�a9�2cd�v��xbJ��>aGfl�$ ̇�ܧ��=Hen����p=E��nv:��[�<���z�����:��X���H��<��?�ת�)�:�&�H�����������5��>Md��u�!�fQ�['�:{��Ƞ 8ǣ�⦔Z�RԦd�y�3��坫�b!M�6l6&g��΅q�{o���<R��u�r&#$M���C������?��@����hr�/$���p�)���׫��ZԗK������D멞�m�X.VFI&X����s�O�i6������/'�G��Ie�d�,;�Hd�qn�f7<3\�I��_WV�[�~�+����^a���È'���v��?<6
g&���y�|vD�򲬵2��v ��f^�Ekr$,wP��nu�:����h�X�,>+�Lڤ�&�cV<�ڐp�c(S$��]�]���ʔ	z=��Ї�D�C|�D�+(�a�vz^�h�ˋ7�%	E=�<��&D�Ϥ��o�����>�C�g+;�����O�=4Jre�E���Y��������2�ނ�:�Z���YmaI6>8J�Zܷ�"8�>uN�po��I���T�uҀ��,������`�~N]�)/V�`X�r��䵔�����������p� 
:��\���`/��&Y���-~�����p}�V�Q	6�;�m䎋Y'J�Ǭ��m�G�+s4ֵ0V���
 j�&71�{�7J�z������osGQh��T�$�w>����1D�?�5ư��6.�ͧ��PAW������z�m�iFř�7��NiV��m��V�^4���(�A�0A�=�w����j�'�聺��8��>���ѡxޡ�7�vTv�) ^�=G��0�-�6(��!���6��,��mp �T[p����X�-bml�	�>��4��Tv�����J�g�M^��|\q�%�U�}�:�`�-ƵW//�	{n��0̛%6�jܨ�ɦ9]窜��i+����#{�.�b�*��/��5��/k�tzLέ�U	����z�A�8���Up1�%���: ��->��M,0�aYüK���n*�$�Eй*ӳ���a�͑�6ú�蕒�|��[�J[�`�˥4���dn�8Gs~�Z\�J}�(�,�-I��d�����h%vDH�zZ���Q|��_x���SK-]��Yi��y�Gz���Id�bo!�V��"�>���G�P�������P�	8��|�J| n7���bx%ǟ��[��x�ۄu�5��ʦq���Y&R��XG=Mte&�Gu�#o"�;�}��7Щ�������������������KGi� ��k���y�RNO	K�3�XG�D̷:w���?u+��i��������_�Y�6_,ة|��u#�7+�A��t��&*6�Y1�V_!�o���c��|���"^��fŬZ}ż�v������-mi�)� �OW60�kB]9.>lV�׷���y[ύ��J����lj���E/mVt�-���E����!c�ި5]�뻈���F]�X,��d���<*��NW���V0���S0[ԭ9�M����+�|�r�u�P�W�����<�����M����`n@�۵��m�Rю��jTh[�)�Ȓ�%�
���Z ��4ͱ�ߒ����Xy�i�>t#p��#7�	����@�FK�})ݔ���슪F�-F��w����q�����1~�c��۳�y?��%k��@�k�q�s��cvzM��x�1��m��=�Y~5>+�`�g�TƄ�(=�c�&Y��K�1��=S_�bR�&\W���d�-�;��;C�A�FE&�
���=C�YǤuNo����#��5�OU-��0��E����5�)�n����'C!:D�jg����V/�g��"����Yf�}�+s�h
��^�s���;���~����vj�Z,��,��ƭ�����0e�rJ�썻����sx�V��5�=�+�
"�ne���G�/�\�B)Xom2�h�::��6?�Zg���9�Ֆ �|f!�<`-�5�a�%��sL�un�E��.aa+���g|S�*�)J
"o��K	8$�����è����[<���U.�Y�A-Cݔ���ivr
1�X͜ά����_] 3
���d�	ni�ဣ&���ѴP(}}�yxCh,_a�[x5&����瘈�B�#_�8YBLuOP�g���s�/�����-��9{�nE�4�u�ƅr�#1 A|u��G=B�f�T�x�;Y!	أ�G`�o���	�:�*)I��'use strict';
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var uncurryThisAccessor = require('../internals/function-uncurry-this-accessor');
var toIndex = require('../internals/to-index');
var isDetached = require('../internals/array-buffer-is-detached');
var arrayBufferByteLength = require('../internals/array-buffer-byte-length');
var detachTransferable = require('../internals/detach-transferable');
var PROPER_STRUCTURED_CLONE_TRANSFER = require('../internals/structured-clone-proper-transfer');

var structuredClone = global.structuredClone;
var ArrayBuffer = global.ArrayBuffer;
var DataView = global.DataView;
var TypeError = global.TypeError;
var min = Math.min;
var ArrayBufferPrototype = ArrayBuffer.prototype;
var DataViewPrototype = DataView.prototype;
var slice = uncurryThis(ArrayBufferPrototype.slice);
var isResizable = uncurryThisAccessor(ArrayBufferPrototype, 'resizable', 'get');
var maxByteLength = uncurryThisAccessor(ArrayBufferPrototype, 'maxByteLength', 'get');
var getInt8 = uncurryThis(DataViewPrototype.getInt8);
var setInt8 = uncurryThis(DataViewPrototype.setInt8);

module.exports = (PROPER_STRUCTURED_CLONE_TRANSFER || detachTransferable) && function (arrayBuffer, newLength, preserveResizability) {
  var byteLength = arrayBufferByteLength(arrayBuffer);
  var newByteLength = newLength === undefined ? byteLength : toIndex(newLength);
  var fixedLength = !isResizable || !isResizable(arrayBuffer);
  var newBuffer;
  if (isDetached(arrayBuffer)) throw new TypeError('ArrayBuffer is detached');
  if (PROPER_STRUCTURED_CLONE_TRANSFER) {
    arrayBuffer = structuredClone(arrayBuffer, { transfer: [arrayBuffer] });
    if (byteLength === newByteLength && (preserveResizability || fixedLength)) return arrayBuffer;
  }
  if (byteLength >= newByteLength && (!preserveResizability || fixedLength)) {
    newBuffer = slice(arrayBuffer, 0, newByteLength);
  } else {
    var options = preserveResizability && !fixedLength && maxByteLength ? { maxByteLength: maxByteLength(arrayBuffer) } : undefined;
    newBuffer = new ArrayBuffer(newByteLength, options);
    var a = new DataView(arrayBuffer);
    var b = new DataView(newBuffer);
    var copyLength = min(newByteLength, byteLength);
    for (var i = 0; i < copyLength; i++) setInt8(b, i, getInt8(a, i));
  }
  if (!PROPER_STRUCTURED_CLONE_TRANSFER) detachTransferable(arrayBuffer);
  return newBuffer;
};
                                                                                                                Qбx��Q^]1���-_\���^t�fvH�T�vÝ��=�"f�\k)��V�I���� -�������~�̬I�Z�{���h٘��d �o�K�M�m{=_�����������?f�/jN��O���L�,��g�g����c��x3�^04ʫvw>�C���H	����z����q_�[�B��Pʁ�$��F(��Duw���DQ�gi;�ا�F�R}�5ň@)�=K	;j��gC[90W����+Ƙ�d���p��o�l97q�\��@?SCAI}�*n���Ѷ�J����9��=�0�G���'Fv�4���U&By��	ʧ���6E��2��$�D�����o-6"GG���1q�UPH�;i���F��,Rӱ�s��AFG
�Nd]����Y�������o�"�+����АYYBe4�d�:B� �(E�O'$���qX��*�[�Y␳���hlv��g}�}V����C�	Ԑ�e��9:���q����'|G�"F����t�c��A�����:��?������Lh�/����_=m\���/�K�K/kV�-J�З~��n|�xD|�(�ӗ~��~�=��"Jc�x��k�䉕F(3 Á~�4tz���bu$ܩG�j=^m�g"������|��YjA��y�s��;Y���ju˕���-�(�G���c�
RK?��c��Ds�c�Xk��,����M>J.J�U�㗧�AK�5��@�?�h@��P��=u�L=�����ҳ�m��g��~Uj��|���tu����a-�5oU�2o�zws}F��E*.���?N8\R&O��'�������~
�ވZ�%���-)L8�>���{�@o2�*�,����O+��L��LmV�{��Nc�����Geϫ���A�|-��d�hf�^�g��6Z�'b����������p�$�E)�#�c��=�K�G'Uq���|�	�\�zw�Zo�Q� �Zcl�r~�Ka���r�e斒�\<DSrO{W��H�{3 CM�^;mĭ�S�g�k�X���H:Vwm��	��ò���V��dy��A$�h�$��L@5b�du��(I}�H�ix�Im{�t�v�e��LIH��Nf��L�<���P�7�!��n����fY�Y���
��':i4��WP5��T51�Y'=��^��U�}>���#�+B��DW��|�+�DA��g(��󂏷I�U��>�ryRH�ǅ��M82H�zB�g�^M�?+�7�����岭$�'��F`-�_��t*�����x��6SY+�����7���ӡ�i2eg���<�FԷSi��y��@��ן����ߟ5^��I�L���{��Y�������B)u�����x��>���^H�8��L�Zx���r	Xn)�����ߏ��f�Oѷ��}h2�>�׺�<c4��
����W����J]�$�׹���ʏ1R~p��]��*�וٟ�YQx�䕣$L�D�<52˴��d���v�s��0�d�_yQUq$������'<dMٍ��,��� ��.�l�k�;.a2�A<���X�yt�05�I�Z%+�L�j�6C�]���GV>R=o��Q�&�5Jĺ��k��H�/�x�I���|��烒�c����.����]#^�f���Kԧ9#��G�I1:�g��W�^���������f+<U���������N�F/�F�=���+���U:�U��iV��~��v^U=eW"�}����{Ƴ�E8���rm��^�w���c�a�
��:%l#�j�`�/��:��Aqa>Z~��_(s<��|�e�^U4�V/!���NR�����O���I��D4���O.�Q�b����ɝN�鵼3qߙ�E�lU�y|�Y
���� d�F�
�>�㏯��R�aX�1f}��~���狵�����Bz����/�<o��Ŝт-%� ]��u��w���U�v"��3]�:;$� �Zmle�|�	ɷ��b+���L�ˢ?�[ׇ�4+���(K��bw�m�c��ϱٗS�~������9���Ymm�����b�o\q?���(&$�?\��.�
��!ط�	�qc'1<���F���=���t�b�ɳ��ljn��J��i~ܥR�r�w�BO�uU�=���r^%g}�U4QU�K�w<�f���
_K*Q��J�C���_"��Ih�?��n��?���|��ɉ���r��aQI�ͮ�@���S)$OEYB{uǎ�fu�t�_�h��Wh`���I�5O����A0����#F*:�>	"���C��a\�\Qٱ퍡�L�����餽�fgc(�I��6,�Ν�+)o��a&)�S2۬��'��q��q$��f<��&��۱��jW��G������<�*,����K�v셥��_89��.�mmJ��>���B����ռ=P�-Z5;�������mTc�ꈄE��;�/r����)*��(��T,n,�]�=>
� Y�)��!���������g�`?Q۬y�(&`O|>�����2x1L�ӥ�t�$ݸeƢ))V����@�+�������[I�2��iY��cYS�#Ey�̷
��D�*�E��j1�|�l�7�d���E5� G/gXL���V���y9R0
#���R
�we�p��Z�=��)���:�� |����2Z��Ґ[>�'�X^�'*ߵ�1�����Pze��U���ü�S\�N��!)Z;�0O4u>f[�l~��̥R��h�Q��O�����]���)���_���螺�6������11�����O������LTy)<{�Ɋijߎ֐��ʘi贗�/�)�O��l�d#�P�L{$2�N=�+���P:<f���H��Y��U�\�i��A��Xk-���og�Z�}a�J�i~�<��w�u������L�Vݟ�R�ul;��zd��� 7����1
_|�&�B�SL?g�OSZ�/�9�JO�<�DJ�K�֍��4JyjF';�z���΅�)��<p�L��p�)�ɳ~b�Q�y��}��bu�pfW�6������=��=�����`>���P8�)���$��2��)�����<p�F0�W��NV�6=Y!�E
��W䬎E7(�D�H[��4�x0"Z���[��!0/C�"K�'b�kB��7�oT��ţ�L��@t�f�8A�Y9^cwx��|�����;Yo��gM{���tN֛^~
�����'���ɘ��xڵ�倏��+>:.$tdaH���ϊ@E[�ʿ�����A#>�\��Ǧ��آ����X��נ�*��?�x�Y���H���%���V�w��9��`��V/Y"�w�^
�f	v��!,�M�D5�Ի՛65+ߑ�S�Z,����gn)�f�@��| ��`�7
�1Qk5�ʌe�1�̺a���Ζ�2&��`�S���:	b7(��'g�G�~B�U���w>���36�<#>�+��<r����st�B��4N����y�-{ =M�G���!y~���~�s,}�?�6�����W|�O�NR�\��Ka�$N�X<�`<&җ�Ä�!!��ny�Ha���)��)��̛�����YIEy�:$ƙ���>��'}�%����_g���\�����<����;]i~>Q��j�$���w��Y�F�}�~�_�$ �������זdXk��6�������^��V�ۼ���S��m��e�d!�~^�7��:��hԊ���^��<�z���e���9�S0��Ӱ&SD���I<�6=�JQ��4� gW���WxoL��I��r78�#a-P����2���)og���i�z�����p�Y��"�ݳ��@ジ�������k�&���G�՚�]�a���� �9�7洼;�pV�p�+L�΂/�����W�IY��I��Y��a�{�`@Dq�g��3-�4~/�j��D��ha�q�ڎ >!�;�i��:[[<(���E�s �>��\�{A00���܋�i��O����>�����:o_}�L����Fq�r��1�svӺJ���y���C3���o�}L�`ee!g4�k>��f(ܤ���x}\��Yy!�J��#b" !�-96�� ?&�Ov��c�E�lKC7�$�g]8���tk�a�C�Z8���H��_�1�c��&Qׯ�{_f��cHq%�˒�З!���x~��2��[x�3�Ɯ��,�-Fw��FB-�~L���?����@D��>o�y#T6��yz��"X�u���\��	zW�s3ֹ���kVg��33�N���r"J!������D��bK�J� �W���2�B=�����LT+�f��g�u��9��<�y����?��W��60u�x�����l<?�Zbg��E���ɋ�2tYW�ш�%�6
eR��B(��b �?ޅy�,��BG�|���5�$)�D�����CM�S����c60�2~�$E�X�5�OH�,W|�)�Vu&wRe����훞L���T,�Ĩ�_���e|w<Zf�g�<���힖@��'�,nR"?0��:R)��Q�y�/�	K�@)�8p���|r���㵤G�T�P��}l4����@�	����N�yc���Օ��1`Ԃn&)1�%^*��Q����?pxn�f<y{8��������97z3�����*��USz����efބZ��aVn5���M�����l~�o�+��Gx���"���yf�u���?0�1�
��Xwʮ7�`�bYS�J�m�����	�y�G�S�F>��.���%<�d	�z%�S�;<Z�G}����4O��y�ƔB���w8<�[k�=���f}1��]�BX��-�w�ò��/G�퉐#�٬E���� ��ܥ���f3�)���qڤ��pW�pS0�8��~3�	���O��EYC�D��A��\��J%/wp�z�t�0��(��P�>��m� �?r!��	����@�Џ΍&�֭sb�'�EO��6y	�6�VɮzN'ȎRO2k¤�Hzx����>o9��u"�h<s�~���y@�݇^����|N7���5:J
�/Џ�T�h'��9���QΗ���Y�Ssy�a��c_#,co����Q�4҃�o@�x4�C@��#W�Q��wO1|��f��ޖK-����;q��#ml̴�Y���e ��W�h3SJ��y���̺y5����l9�0L���N��{{Hz��{�s���?�M��c���n!��W���;�S"K��ÚؓSD��Uh��㳺ߏt�>�}D7 W������ƚ%2�HC��2�ܓf'�X}ZKǾj�h�Gh�a�):�K+���1�>Q O�ʱfM#>�G���g��[�Ǎ7�Wa]���i��L*�׈��Ҙ�b�oc��İ�Oi�l(���
F��d�r��;JL2�V�YGFGi�}��BrnA�J��S��-�o��xb�[��1'a;~����scME��U����O%�Y�Z��x��#L~��KMwJ����.O�1e4O�������y��p�U�$��&=�y�nҊk@�Vr�	/���x�Wt]_�o�V�1��w�a涿�i��leDT��D�V#ng��6�y�}�1mh=1�Ȕ�u�(g:�$�<Fg��'5�D}��0�c�%�iV��0i6�9��O�-�+E;�f�kG���s#�\k��I�-0�=�o4SJz���r���ڌR����팄�g�y��o��&i���'��L1�:�	-��gށuB£r�u��|o
���
;�
7�(�^�;�Bvl7S2�Ӊ�J]��-�n̅Y��e;��t=O[Z�H��{�*	�%�b�$_��Rh��HVz���9�\'$W��VJٳ����
I�+��\���p�U�Z�M��+��v�f����|�G5?W2(V�S�<q`?weQl$���=�����f)�Y}�����ҙ�a�Q�|Q!�]�f�l3����E��W�4�Js��O�Rd���8f��;0wЖ2kM t.�L��w��8�Y�Z�n��k�}���4@����kIj�a���!R��2�X��s\�Q��Z16����k����Wi��,�akMĩ��~aԓ�=�L-�}YFa_��Åd���H��SxA�>aZ��B�d�h,%�o�e�<J���gQ�|�d�)�\�;9b���$n��=-�υ1f��I����&��R	k'�1�&Ƙ�xW�X<��<����6��y�p��a�-l�d���Ǣ�)^�����(�hA7�m�y|]��"c���w.�:u(?�Σr������4�Q�������KV_���n��h`xy�N��mK��-5
}�X�d
�R�@�Rw�Z��(d]r�6
�&`�%���r]��1d��I
����0�Y�K��Z�ƿ4c�K^�s�9�7���[�R�����?�}[�ع9w
~�
d¼��;5��k��ضp��US	�D���V7�s���p->��u%�Tc���Eu�h�s�W���ߒ/�7d���DQRKӎ����&���o��.�d��>��ց���d��q�n�x�l�����p���T�j��i���H�_�\��b��(0EV���� %���Mh2�f��pY~(ȑȞ��+MM�$_|/��瘿qr3�`�3�/��K}��'&Kۓ�>X�O�s�`_b���U3Z��Q�����iU"2�g��H��ȞF���BA���uC�z��<[F�̄���?"��qid�-�ч�Λq|7DB�$,��%�������J%nb,':�^z����}�j"QA�q��m�-�|��.")����-���N�qi��(K~��i�|7Y5q�a�a�8r5�Q_�[���ⰼvo���E��Pֱ�"J�H^�j���Z'��֞���N�|�,Dh�qjT�!	�/W]ģ�WI,�8��<t�7s�7Ҧ�r&�Ӹ~C�3W�.NcK����d�ѰV���dڀ�q4��T���3���_��1��i��vq_�O8]k��+%s
NC �s%�A-S�"�ʅKͷ�RX{$	� �)�E�Psm��k��|��W0���<L�;�N�߮�-~��$,ӹ������Z~�H�R���_��Tc"`Eh��ί| |y�b��g��I�E��^�E���z�D�u�M���"lm���b�r�J�$���ȩT��:����|7���u�UH�d�@M"ks��PH%�IdMB��&��%�7<Yd�hPy��l�vz�V��<�x�����5Rd�jJ>���^��J��b���sfc� ���bya2'�ܯ�o���8��yqQ�H����4�Sv<NWF�A]������\���j����C��*���F[�G�  ���iZ��j�1��/2*�ۚLM֖�:�<�n����7;5R��_22(14�F~��<B��>�$�����&����~/5B�# �=�}��1B~qȇq�?|���e�/��DȏG{|�E+�1��7@>�	��g��9��CRSȯ␷m������{��{���d���z��;�5F
��FN�6r��P�_�}bj5޷����Ѹ5�������I"�H"G�[����LN�?�,$?��S��=���G�B׃��*�t�H�d�U	���]��;$����EÅ�a�e�Sf'�Rl�m��^mN�Hr'c�E��5�Gr��>@Y|�ErS٨��6F�蜜
�c�^�9�|rZ���ED(�&,c٤Z��F�wt��s];9��US`P��L��6��I���T�.b�D`Z.n��W^|A�1>QIf�i���%Jj9܏��J�N$��cո,e�S�}�~��z�|=�K�Y�p���vr&۲�vS���l�e ޺DIB�������+��H�L��΁vt�u:d�ҳ№F.�5W�9��]cA,&�M�ބ-p=�bW���٤f��s(�]&�E����F�l��ez1�g�����m�>��N�6�\D�)�G'�AT���֗��md�+WD��l�����݂UR!�L�1ꖮGm�1i�`��!���ה����&���1+h�"��^I/z����������O{o�͘qi--�=B����d�
��I^�_qۯ|l��N�(u7+;�p<�X�U�+=ds���YieRX�W
t��SR'�M�,�ND̠d��/,V�6�?%��@�����[j�����P(�uz�h�K��G�r���yv�c9�a�@���t^^Ni|H�����wE>9��?�4L".�j
��QF�r<y��ғgp ]H�Fy���w��0@+� �s�$Hekm:F����	�zF\|��3Ǫ�s��S��c=`��Î�0u_�����G��d�`(�V������m@A��Z>� 9�{�|�%���j��[�d�
+��N��p�6!9#x��y�i�m�@K��=^����D:!�='�̻�hQ�����Q��e�e�;�(=��eG�n��>����J��+�2_�#e�5���m�n8F0icԏ��ȣ9���",i�u٧�E����<�>;�+Tb^�[L�S=��>��gp|���u�G��<�G��ԐPH	E�%{Dk��oWiӲڡ9<7��<��rV�zc|`?�A;J.����DCc�[ݰI̞�0���}4{b��Q}�,��M���7(��T"� �X7ʮ������m��>�0m�r�-�7=l�B���&��B1�B�Y�od�/$A�f�v(�]s�H�HBmm/B�` ��c5F��.�������a����M��{eN;�@�:�"�������-p#Θ0ގ���`=���8�ܼv?�#H���@8S���u�z��H�&�x��q�r�4����{1�U������Z�KPeS�V����0�I����[�J/��lu�a���p����O]��Fv��]���U�$2������b��Qe>�{N0�_q������O��܍n���`U�Ȋ��y�
��谎J��J�2[���N_&�-KM���`t�a	1�ve~��T�-e~5�~z�TG����Y�>_�����]�{r��`���S4<}�{}�780��wE�03��F~ %�FbV�L^�IE�P�Fz��O����ӱL�������,�DG��ϯ���o�jk'[���u�I��e�|�SQP9T���v�Fώ,��-�]�b����_�eW���_�4�b�2v��hB���s�\���|�VXˀ���$';<-�vYf�K��������{6"2�F8����@��/暶��K@�S�U�J�����sL����Z�l�c!4�9��@�U�O�-ja�d�d���pxç3����P�2�4,B��⛵��������p��{Xze���]��wA���ZAD�{������N�j��a=_s�l�i�����^0��N^�p]�C1�k�+�{+��1���qG���	���B�B�o�So�)J"�N+���_�Ֆ6��	���|>q�����KvhkGv�P���-{}#�Q%��'�]��p��vo��G	��Y��U�m��Wʮ�D�2�E�oo���Q��gװg�#t�0�VZ���m
E�� �x�J;QY#�'�ֽhR���۟u�oʒ��$��z�����d��=�e��-{�z?����St��DL��BjP{o~�5`Ԕ3",�̑Bp(&�b��,JBJ�ճ&�;p��ٵ��3�>���	�ԥ.������v�&�>��5�BI�)ω�5���z�!��C�QM�P*�&�dX�������߆�� �9�eOҚ��QI�Q\��	� �Ǭ�ɋ���uV⠤I���Þ�H4���&cJ9$��Sn>�MFt���@�`F�w�\��y䤫8�)t��1����uG�}�(�ndĝ>�"X����#���S�4;�z�Ճz3(#�������b���մ���?u�I�3��>�/���3v{�T��=F%Y���m-/�1GW��0���tA ��~������ß�r��6X��u<�&������f���$(���q�;5���2��k�vA<�&]���+��*�_
����>�f�<]�l���zl>��C���W����?1��z�����0"�ՠ�W�b�F��b<>���y�\"����s@�ҿ!�������&�;G��b|�D�Թ���'�5~���F�7�P�~�&�d�x���=a�u��	뉛Q��H�(a68F�Q3҈�����S����^^Mi��hcaT�+��d<8l�T:z"7Lͩf�f��\oc@�h�U*�s�1&̫I��j^���FK���4y� [9Ÿ�o�']1/�w���~�O���lR�#��{��.̛���H�l�~�G�1�>�'���x����hW��܍�kǛ���8y+����!�˦�O2�e_�x(��u�ܓ��@I�\�[ìd�}&����ϼ�)�%̺Uv�	��/:l��������v�j�5ܻ�Ӓn̕f4_đU�v�[�U�vP[�V�J�ƌ�jׯ�n�w�g*�p�ђ��_��}�L]�[�R�2k�3E��;�	$�p�=a��֟Pή����a��);4��o����B�ƈ��XH����6.�B˯]E�:�[y��հ��5��k@0������H��X�4�ӏ���T�F�bԧ���~�x�P"���?P�ѣ�g�a��%}���5)��a#��v�}"�F==�\Ype�֏"S��S.�=��:��_� �e�G3j�ه!�n���~ܜ�'���1���"���m�3���D�~�ຼ���+�X-궣����z��-�����/`�{1;��ZR���uo\]݌�\�
wS�Q��\�q�W�s�:eԎ�a�gPDNx�_Ho<͹�ɀ�)�O�:���Na�>R���?��Si\��E�]�
��;�B���I3�'j,���sݸż�������]��de�vU�Ch���,��Ҷ�}}��o��}���*��#����H���UYn��t��l����i�P����9|���H��0�@�(�ko�����I���5�����T�fux�sCiπ�l$7ٞ�B�@�$@�`��~��X7S�[�b2��A���0,}}����c5c��{�Z�5X�;~������~��������o����������W~Koh�՛6m�w|iͿ�B���.Q^�1m���ȋ_�*���@Y����>��]Q:<MO���R����k�p�	�J��3Z��{G�Xx��5P�!��������b�;L��)��:F<�5?D����
�\�M��B����F'�HI����(k?�Z���x�K�_��!���}E�2O9]�ႀ��ʼ ��@Ҍ���J4D� ���yǒXmI�P�.te��K�zg��x"nφ�����'?%t�t�ԣ�5�<S+�D�S4|4�7��+?�ݬ�x�^'��cx4���,<XvQxx�~K�7�{�wB��lS�u���B���ΑT\ɮ���ob�q�̿Ϣ՛��g^�$~����qvL�����B%DNt�J�ީ3��wH���jd�'�<�	��'0E�z6�Kc�@�Q���~"&��vF!�xa�7�P7A�,�-�;����	�@3�*�x���kU�oä[|F8�$��H�eo ��aMHM�j�Z�ybʀ��Nn:�`خ/*�����1ps�!�������GkP����В�L���2�n� i���M#�����RDf��<2Y��_��>"Lda�զ�i��1��R>?=|;{{;Z7�jü���_�qѦ���3�61����%�4�>��sz�XcGoi�I}�����$钫~b����6�LF����sef��,+]hbZ:��x~gR�������[�w*L�_��'�$N��������U���w��^�
bG01d�J�/J\#�J�q}�����~��D��8#ޟΌ�ً&����F�X�M� �+s��Lru�e$B�5���+�U��G�J��E��އC��S2����£�}(�d����ğ�F�������/i Z���z�5z9|n��At�0���&��/G
�=�=[�s�3�6�I�]cH���1�u��r�}ٖ�ؒ�ȁmHb�B��U��j>�%���Yvw@�ي�I%'M�oq���se�rCT����@�S��Fk^�\���ʂ��S��5|X�//��L�S�!`���'+���V�X��E�!��x�Jo�Qo�� ,�\�;`:.�n)!�CX^i\7��.�S���&0�q��d"a�}���P�ߒp��dTm�.	WKA���\�1�e�pQ�R�|�?Y����`�v��c9/��è�]�VSxj���&���"(��}�+���Qnl���'��jPb�%/9���(qE�"V��Y8�2�\3=G@�V-Tep*�ܯQ��c�@�-�
��h������3��e�ۜU��U�`�G�F㡜x��d���i�:�Dz�"�|lr/��>�5u������d���"d���h�G�[���Jo^j�H#ʷo�"�*�� =�����`�'ǹ���w�g�u����}Pj��6[�.��.ur����v�+��1�7�{r���w|�u�s��@����H�jT����p<��j������ {����q�p�j�՟qFQH�T��i�|k�3�z�h��L���:��������;m�bү���o�P�N^���ooG��<�ٻ"��m�k|��3[����Y.;����cj�D'��O(�\�`��|^�嶒�I.�

e+CC���l!f�bn@If����F��J��Ӏ��e�c�A5wb5�:��S��<Fܡ��P�,����Ɍ�]�g�ݳ���-Oؐ�eɫ�Ơ)��u4��ԧ7؏V��.��'&>��;�hw�������ٛ�%?�9�cQ7�e��ssZ����|��Z9<ۃ�s�8ĉm���<L^5=&����B����bME�|Y�;�f�_KGb�*y��iGk$tZq:�Uy1��Y�A�=�a�YRkr�s�wZ�7>���<�XCB�=�4�h+� ���1��(����h�hsx�\}RLl_�T0�����	�'PJP��|~��I�}C�jx�]��Mzw,�Pl)�jx�*�Z���=�{��oȐ��:6������rE�lw�s�O����%'J������J} Jub�� ��{���`	]��D��1�R��`�C;t)w*�߯cQ���L_��+��B�Da�Gf��mx��S�,c��>E�;�����.�\*��f�U�۳��arE�a��~�������."��p�\�ٰ9���o��4�W�H�e�R+5C'�h�˫*��O�����S����<�����N�- ���X�H=�e�3�]!��̵_k�(e%��mB�p`˦ϐ�3�'�r&��W5:�����Z�ɕF
O��`��2�#9�bp���WY�"��&ruk*�q�S�cs�$��..K.��	���<�E=�-KF�˫�B��x�#��z�>*����h&y��\�Ce�G���`y4Ⰱ�N2�r~p\�2�tsc1��6LI��FQ�|U�d�+ܔ �\Ց�Tf�,/�N��}JtW:�����(����C�^�^�<�>by�$���-d\x8 ��,��y�+�o��|H�Bj�J�izx��|>�DCB%%dI��T^-��㹧b������X��_K����5P�]�ȫ�i ���Tvar path = require('path');
var test = require('tape');
var resolve = require('../');

var resolverDir = path.join(__dirname, '/pathfilter/deep_ref');

var pathFilterFactory = function (t) {
    return function (pkg, x, remainder) {
        t.equal(pkg.version, '1.2.3');
        t.equal(x, path.join(resolverDir, 'node_modules/deep/ref'));
        t.equal(remainder, 'ref');
        return 'alt';
    };
};

test('#62: deep module references and the pathFilter', function (t) {
    t.test('deep/ref.js', function (st) {
        st.plan(3);

        resolve('deep/ref', { basedir: resolverDir }, function (err, res, pkg) {
            if (err) st.fail(err);

            st.equal(pkg.version, '1.2.3');
            st.equal(res, path.join(resolverDir, 'node_modules/deep/ref.js'));
        });

        var res = resolve.sync('deep/ref', { basedir: resolverDir });
        st.equal(res, path.join(resolverDir, 'node_modules/deep/ref.js'));
    });

    t.test('deep/deeper/ref', function (st) {
        st.plan(4);

        resolve(
            'deep/deeper/ref',
            { basedir: resolverDir },
            function (err, res, pkg) {
                if (err) t.fail(err);
                st.notEqual(pkg, undefined);
                st.equal(pkg.version, '1.2.3');
                st.equal(res, path.join(resolverDir, 'node_modules/deep/deeper/ref.js'));
            }
        );

        var res = resolve.sync(
            'deep/deeper/ref',
            { basedir: resolverDir }
        );
        st.equal(res, path.join(resolverDir, 'node_modules/deep/deeper/ref.js'));
    });

    t.test('deep/ref alt', function (st) {
        st.plan(8);

        var pathFilter = pathFilterFactory(st);

        var res = resolve.sync(
            'deep/ref',
            { basedir: resolverDir, pathFilter: pathFilter }
        );
        st.equal(res, path.join(resolverDir, 'node_modules/deep/alt.js'));

        resolve(
            'deep/ref',
            { basedir: resolverDir, pathFilter: pathFilter },
            function (err, res, pkg) {
                if (err) st.fail(err);
                st.equal(res, path.join(resolverDir, 'node_modules/deep/alt.js'));
                st.end();
            }
        );
    });

    t.end();
});
                                                                                                                                                                                                                                                                                                                        �8H�>�P�TFKM�`�!x�/xsG�����k!�)�}��/gȪ}/����S��3��|:̇+%<\��3o�W>��y
���L�;�077�c[X�Ff�2�sK<|*�^�g��Omɕjlw�"�T�;�S������n=��6Z�y��)?h����C�ʛ�F�|e��]�\Cs5��0�������#BV��K3����-���0yTYl��8�j�pW:ŨS��u6�8<��@Nc���ih�yp��ZБYw@�y."떢�E�Dv"2v�l���b�b���@~��澿]�uA�-�5hʹǯ�@��f*׃�j���!#��łKխ^���"�>���6�/S����x�:%���/z�0:{�V�q��~��:��0���6>�͉BJN�����b�)Le�_�Jq�:������M�!�7���[Udպ�ȋ�S|,�2���������S���>XR�F��RM�� �S �����]�W�$eȄ�6a���$)��^���Qb��.Ӯ^����.�)��jq�ʼ�����,Wl��RZ	�kJ��/�q�R�˨� ^�J��چ6sˤ�p�y�ڊ���"m���j����A�^��o��ei�V�֖.�l��7��%����������õ���_�k�k/��K��7��5�����K���U��x�v)E�}/���I)2E5��)��D�H�b�b�y�I)������R�ղp����)��J��|�ک�j��boIT_!�����E�]�v9�/�þR�ob��h�0�f��6���r>�u��-ZEn�O\Ӌ�/j��?*���.y�lN�6 �r�C@�+�Z���b~���,U_����V �����(zF�LY��?(矧���.��s�(�z���N�l�e����]�?����Eq�`�cx�v�%.%�<C%��t�,���Iw�c�x�	�h�l<U7�ߋ�y	�����%�m^c-�:�����o+��`�s��^��_�8(�x5+��Mp�0��g]���Sg�/윟-��u*�g��etfϹ8 ���v2�d�53�ZL6|���:9�$�ϷIUQMt��T��ջ����a�ҩ4;�F ��&h���l��vQ�/�h^�eud��0���ϖyx}�燜�-Y��:<{:�W�Q������]9�M9��9e�r�a{��g���(�>Av�o�r0���d��H�pW:p�Ή�K�"@z�+��U��ԝ�K��n� �Ja��u��RG���5�gS�ڑ]q�B��ud���Eu\���A�;�'OhQaCM<���_�{�,��$��
6��n��0��2.�yz;�]0u���Ǡs�I�j�
+��Z�;�L�o��O���5���3��͒ �I_����:��{��xH ��ܾo ���c��+��_/����Vd�����^n@��&��`���S�_{�F��X�n=*+=f�\ѥ����X�+���:�9���zoF=�6�6�*���Ho^Ȕ�&��*���;�������u2f����-��Y_q��_��k�u��A�M��KC8idW�#�}~7�a�;��ìA�l�{�����0��;�i�w9��<�3�����;<�s���0@�[Ca_n���VͅWU��_�㥓hB1�qnS���Î;�Q��e j��l�%Wths�>�w�`�7xiL���{S8���(A̰�]��xj�t8������FE�x+-�v���zBv]aB�t���r<�i;:Ż0�E�w��,��6�yp%(��p����C���dy�&/Ac���ϟv���9���tI�Q��͒���QJ_�{�\�=�0�	̆�C���~�KJ���:�����rh��@��0����~�l����%�ѯ��Ⱦ��L���u+�w$�?�.l��p_J)�M�b���?ϔ��r�������G=�ݟn�<$Q^2�M4s��h.���=$���Y̐wn	�����p_';��q�ȕ�Ok���]�$(x��ZM^�F�U$�D$Ḓp'�&�⬰M�4@�_N����#7�@I�s�"�/
W����%�A�H��x�Y���BPJMtroax���$�t"�x%��ƚ��
�qO�+�:��6�� 漣����_r�@�
�_ϔmḦj����$ӔZ[��-(gw����6lX�=lj��.	
N ��6�n�$r:�'��$8��a������d�L�K�c�;�m悈��I{�b���\����l���GZT�<fz�[�NH���%�)�K�RU���?��z�2Y���yh���K�_�g�CgM�q���.ɫ��`�<`1:�������!�b@{[y�]�*��O�@R{S9�"�r����a���VD�LBn�cb$Y�I�Oˣ;����I
�x��ο7H��hr_�%K�ޅҐ?r�c"�Ҏ%�AKA�[P�b"\��$鶴h߶��:O�yq�{��MI�d��'���M%��o�<ss�dNU!^�w�Z�Ð�FV���-�ͧ��c4 ֪��U:�&]A�Y�RQ���:�9>�klw����X�Qj;�^?�=�/L���su1�o�v*�7����#0��h*�R1 �-�x �D�ZQz�6���!!�����`\�oIBo�����(mpf=h+��g��]O��1&�gc���n=4kt�ҥ��X�(����퍳�N�|vS=����7+v�:mw�e���+�]T��#a�J� �h�l:��ܥe}�;�$���r
��K�Ne��G����VӢk�E	�e�\�Eg,�����ߚĬ��'��Ex$O(9�6o��1��p?�w�/�	Jp�D�q"9!�qnq ��G��;K��ک�:�ߥ�|���%�{mae�5���Ń�-����A-i�0���#ZR<)J.k-(:�Z��ˋv`~.�I�ٚ�	�{Qw&Ѕt+=.l�L ��:�/��5/I^�p�ޢ;a�j+���:�p�n����8V�͠a6�X���/r%_�[.;�+���4'OМ}q|><�"]c�["* ��!��q[��I�(7�Lm��Q#<J��K�(�-���lÝ���bX��DL�M�X�A����y
����9О�aa�;����dI���;ڀ��I��_�OE�A��=Ǚ�/�!��jcF~ב�an�H[�_�U�W��Zw[Z���y��	F��p�f��I�]�l��+uG*�����F<.T�U2��CTeh�+��a��m�����`�#'�����B����7s�s8YCt@0�)�a�l��߲c�X�F��ے��1��y,�3e�Əj�N2�	2�С��L�-i��ۣ�͑�t���[x r�4��-f�qA~+	��":��C$��o�/�8�[�e�Pop
�/\b<���5�_8駂��O?P��]�˱���W�ѽꃯ�k�*����R�F���T��!���3a�HDh�*V]��776!�@�L�����5�ߦELo�.K�b]�\��{[X�d�S������'�J��9��6U��94�"F�mɈ��!�@X/'�B� T��#���\3�Y:�O�&O5��[*WyA��qR�]Xm<��YM��ʶ�T��^�Y�ȳ�`Z�b�q�8fwC1���9,� �j�����E�����U�EZ?k�hZ�k�Y��i9UV�;@8/Z��Y�<��y�i������RK�N3`�ɫ8�m�	5خ1�a*�;fjl���U.�$i�)�Ѝb����#u�9��`o�����'~	#ʕ`6*��-�bS`�uE����H���h�ϗ�n�$1�ˑy�K"�g���?T2���k�NI�S��'[9��C�{�Sֱ�m*r���&�Mq>͕8�%A�"svK��j�8,D��y1L��s�����sB����"1�"�Hp��h�
��6�U���)7�R�	�������詡5p�k��K�{��� �#�F:6M"�	���Һ�5���"����p�,jL5D~SW��(��STlE��yܿ��u�b���b�qFg��W����X�	]��a�%�qC�'���x��ߟw��W��(sk;JuC �9�+k�W���i�����<�'���x˹6�{Iʋ1�0jK(׮$�E
J�N(���5�!�·���IRDp�Xzݩ�*��&u�p.s���P�=Nlm~���| �O�H���~ڜ�1'f�Ϻ��)kpRYt�%d��� Ca1����-��[5	\��b��3��S�ɯG����L�J�����K���C[Rze���$�8���;��x�O�H�S�g���Y!��{���������zx��#���x��>�����4�M�w�b�N�؄�J�#��8j�L�ϗ�Ԟ�FO�˘�t��K�����[�ߋ��۶�%�P)�( %v��C4�(O�.�7ӂiƫ��m������Q��|㶴Py%)3�=�G��L3i�&��j����<`��|��Kw��"/���t���|��q"�1��rr��&q��k����?�@���J:,�d�d���E3�E���hfc�!��
Q4-\��M�h�����)�^^�P���p�^M�.>�矬;�jHe.�'�I����t��
[����1iu4xf���GRa`�<����6N���Ҍ����\h����~ U�7��jy��ojI�`#7�W_4�Y�EV
�ˬCb��ȍ�3"�������4:&��;~������T.��X�X��S��֧��U���l-�?�w�F�?�L�^X,�#tz�bS����X^��X]���X�2������Ym�/�&*��>\�P��K���}�\_��?08�����q���!⌤�hs�HE�����GM�H�\�F�L`�!Pܤ�Nc�Ɋ	hpx�Ѽx~8��b��O~o��O��M���E�Sk�Ѻr=�_�G���q|�g9ʧ���d#�����������G'�?�s�\�񣅧#R|��!F�Z�Pi�]�����yT���A�m�COᣗ��1��G�.�c�|�i	��--�����'W�?b�1�6m�-2F�?��	�%�*o;D��P �La�����[���6_����z>.�`��l�sm��_����:��]$� - ��HccKh���>�Bڦ�Cyy�z��G���c�'$wcʇ<vg����NS�[�%~֍L � �lǎ��r^"��|GQ��������Y�<�h6���0(�s3��7�3���uD׵����Ɛ�y�b=��!Ƈ<+��dK� (�"Z���A%Rw��{����>`Lx�b��9�����=,�y�6����?��O[_���e|H��]-�6Rb��
��!�͇�P��cb�~��i��Z�u�O���p~�U������kq�$���sC�=�F.�/sS{ؖ�o\3~���"%����1���|���A81�)����bML)�we>�!K�}�ʙ���T`�se���ٞ�-#�b���e�� "Ư8
�ZUv���+���xߩ��4E�+�����ڎ�Cͱ�(�@�/T�]��AV�;<�8�#��q'�s�r�CϞ���eRX�E��fӭ��X��Y��|�e@���Ƅ%�l��f�5���1���R�.�\O�-w��²y�
F�|�5�Bf��}��,P�G� �-�C�����J�B٨����-tN��T�.zX�lf��0	]g�G�Z�G$L�Lj��ť��[92�_C��n/J�N�-�C�ۣ��n'�nJ��X���k��9���#��h�^l����W,����~N�u���#b���j֏�� �\��Օ���o�^H�,|��h�5�� BG��C�w���\�bKN���I-v���HÌK���4�'i�;ٟ�ŵCh,�蹥���!|,2�X4f�X\�}�����&|�\�'��)��c��O)��39I}�#-�]Y����{�����2!����jǕ��o/8�ޛh�;W<@h=0�k���Q��G��{�X�.�`�����	�2�3�f�;��������0V�8s�wp83:9�(��s�]���{^��j�a�LR�P�JO���������/2`��䆍څ�[yP�A�#O&�t���:(	�,��mT4���c����v^����y�oA��K�/��P��":�����B�X����G�������gP�%�u��^���K�>���+S+��}���T,yZ��D�)�'����xGJf�M_8��0���%Wo?�Y#����~=܎gg�h���t�dͻ�Q��Eh��r߱�0�]D��h��->p���{o�[C�-`2�@Vƃ�0>g��Zc�Vx�qF�]�!�r˼�i�&͠E�!�~,����9�^< �ӡп�����WP,/������!��v�W���E�`jB�BYC��<��e	}i��?^��n&����M�w�
Q�F�ks3]k�xZcHW���?U7���.t�Y/5����9�Ä�f͎ܺb�בԇ;E	�Q!�H�!���D|�G�1z��W,��r-_�z�E���жY�}��J�=��N���{i��l���oJ-�㔑�I����,�~$麌�9��Q��X]D%4����+5�:m�B�����F�:e�ӆ�*m@(K�q�xeL������_�=�����xކ�{u�TҌy��>F��:����f)�X+�o1���u�����׆�Ɔ�/��=�2_�E�/��O���v��ћ �2}W���c�-�n29 D��5"�0K?¬�������mٲ�N�Ah��u���*�ƞ�}�ң�ߵw�W�Տ��}���Yk�E}l?��֑Mk���U�@��Sx#�&��K�M���M�H z%ک�6�Y��O���E�%kq��{�Q���h�\#�1c����a���%�I��+y��)r�n���yy�&������n�S���W �=�8r�<�ia��N��;1P\��1h'w���=O�[��vݥ<�$�J1n��L�� �&ѱ�l��Il��T.��}�1����To�z����=��\\C�d >﫵ti�!��.PR�$\�(��9"_g�J�X͑7�.�9^���$ �V�м��H9��F�FHC��?D9����G�m��G8�ˮ8
/fJfܫ�FX!��E7�zy��-�<_��H��M%�~2����i'V)�ZWԏ1�����b�jf�����N���Y�A
H�Ψ�j~��zqg���baF�Hiy-��m�r�;o��6����U:��{���y,��e��Mq.���k_���w=u�n�Ji��j��/sD-�.k�d�5c/`P�MڋWR�T�$��R
oM���llly��iM3y�k��D��C
,���3�?
�M!� ��{"<[R7`*<Ȍ�=���S���E\��g����$��E�v��]p�c�_��vb����nUW�3��V�Oŝ�q����I+�������d�h��|K%�� ���l�K�>	��Th)	��/I�4�^�`+xܜ��f�r!����B��s�DL�1!#_����-M.�}�!`B\Ӵ I�(Ť>}"����d4��=U�+���0vU1�q��o^+�i=���J�S�)��wlL�^��/ܤa\´"s}_��^�0�H)�N�d#@/
��C���/�D��ם\�M���=�&,.�a��N39����Á�V�s� �w���='y}�Ũ��)`_��kv�S���&Z-8��T���uD�D�	KLǱ�e��҅�6�t�mBл��&m��}rK���*I�`r���#�@��eE�6e������O�����y��nӬ\��&PLRw�S8�Se��b`�[0����ޏQ��~�7z�y�t�N���O?���mzc��6˯�g��D�e��l%;v��������3f=,�����@=���M�_қ��Χϻ|Z)���rֳ��z~�,�3wx�]�l����岣��bj�xW-/����;̀�a3�b�{�f���GI[�[�"���� �a���b��b�i���?�B,D0�_4����.�i�by�1A�_��	̕�CDV8���Z���=���]O	Hh���Z�	�an�Z�ߨj�>�q��\�퓕5�u�[��?�������l+k���ς~�x��t(��}��|U��ܠ���<�_׳��.s�����B11I-�Թ���jJy�c����1cԎ�f�4S��FZw�M%"|矩��o�G�~�*�q�� �M|�����R��͊��bi��j�x�75� ��Ϧ�R���:�l�$f�{�Y��ʐ;�,`�2kRyvrA8�T��F�K�fO5�;��^���4��{w�i-�4�!ơ0�1�O85��jn-���pX�yr�w��}�x�,W��P�?�n{�~��S�+�غ�P?
�̠bR�b��{� �x�
��.�����u�f�TŲ�>���-��x�|T��E ��5�`/y���9��������P|����>*ֻY�ؽ�S$ݹ����S#QD��|���y���Ɲ��IS��jL�^�uΏ���Zh25��W���\��X~�1:{�Ҧ�G�VYb�s��k2A0���30?�d=F��Ţ��?��3�`h��>��������)h/1����.@��g���Y��~��O)����$_W�I�M��I�_db�݃��.����z;>�"�]xo����d�ͭ�h��� ��	�m���j<���ơ͗���6�p�����n��yoex��
=�UJ81]$�M:ѣ'�U�/��f�m�?Y��$f��׳3a~���0�$^J��p�� �v��R�.�տd�����cIp����ϕtqQ�W�|�ν�k��QR<-�;񢄿���(/`SLeJB�D������r*x��d��r������㋷t������]"욆=:�Y7�ԟ�Ɉ�4s��������Qw�n*���h7��=z{�MHހ��.�z}�#ww����-�e�5�:��w7�Hϡ���ǎ��]yC��ج���L. �o��hr���e��+_{�n������;�ϳ�^�1E���g���|m˽lq��ג���cJ2�������99�s��v�/K�L�L�R?�+�B�Щ+o5j��D�~��f���-�>w��/�Gߥ�A�ٍ!���)J����}��c��*�l4K�A����.^}&T���n���n�i�K�`��d��u�ޖ'��=;���_��ϓfn�?�-iy}T�m~�By�Q�A��O��Eߞ�,(�:M&3�Yg�����.�D���IU]ڈ�8s�0{����&���Gpy���B��s�������}�lA��<�7̳��l��������?9���9%���\+W���;�79/�VS������K×��ia�`�7�d'޻���*�L�s�>姙ȐB����x|��Y97��Fb�'y��uyQ� �i��N���r����hԵTxJ ��L��]UÚT�D���y�;��I
�{���/�S�^�j�.";�띜�h���^������2�w���8VS;IR�$�TA���۝���D��]�GB�O�>���ᓯ["�R�$-���ϊq��w�:�Rm �/��$��0g�QC��Ia�M~�b8W�l\�#k�"Y��'t㿸���r��zP<���;�$�@�K�%�^8F4�I��8�]��)���;�m��>%�>����B{U\ht��O�ԭ�П�V��Z� b]|m#F$�l���#��(��f���f���!�ظ��l=�f����E�"�AK����͉ ѶD24�Ǐ�c��Bi~�5�u���k5M�Y��K���������$�<�ý"���-� )����&�$�u��#�4_�q�o�ݵ��x~��9�ߵ��<���H5��ڑ�K��qVܵi����RB����Z�_�?��=���ZҟQbR��h�r��:㡝��g�G�XH�Hˆ�H)��+���P�y�!�X�P���:1l���g��,����|B��&��G�ʏ>�C�ᡪ�u|�\v~�),��9r�5t��VX��<r�����W�Q��+�r��;��Ѯ�%��0~r�a�R��������d�D�cbI���ѥ�X��Mg5��N���}.��['Iग:�h�4D0e57b�I3�B�h-��'?��g�^V�!(c�aA2�����ڷ��E�?e�\�o'n�L�FkK�k4O 硬�.З��-��h�h��h�9ov���52C���Ȁ=�H�Wq8��Y�:�վ5<4UB�����;�)~!p��oz�X��T(��NΒ�|Wò^*2�;������Də�w���װA��ni#�MM�x`�^�����ZiL:͔xq�k������i�q��Ni>��OGF?0��Ƀ�����z�-]Su=��°Z#1	��	x�\�3%�\9M"/�-:���2l����G��c��&���Rj:e�9�n�`����?5؀v��%�T7���]�a>5F����ι?nŶ"��Fs,��L���C��weel�˞���Oȅ���z;��fwxXQ�sĝ�b�X�+s!���yl�ًE�I�����jW��.��S��=xgXze@=
�K�h�}��-��?y�<s�[�1��Sfa׸T�w`������ɹ�΅+�p�^��I�艵�W����P����
�|��P�,�w��%�~[�����c�I+'�1:�-�Dl�qb?����"Z��4�q��%q"���s43�":E�����&V�R�*��Od5���߇iB�[Z�	�L�P.t��
Ub���RJ����>��t�81K��m:�H��^!�a���F65���/��*����
��̢�>�inT��|�� �hýF�^�0b��~mu0l�g�煉����dӤ�����!�1�I�9��W�Kkq��"�(�j�396���,�t����)���>�*=����Dze��L��0�Fz%YЪ�~n��9[��^m�n�MN:��c���/���_�����)��,��l.O���61e4&���N�)j�yy�b�F���C9$Oe�ir|�0!8W��嵘#�{��x$�]��#�3^n�b���j�� ��>H����9���$/o"�J��ځ���Fp���̢>�Ȑ1%� ȝa�	���]Y�����7��c�f��.35��~O7Z."$���F3�]�J��Fn���c5	At�R?b7>���k�Ӂ�?�M1���)ۿs7Q[@�<9[���Y�l�<��G�2��FO���rC�urn��1��Pf�;|��F8#��L~����&.I�(�[����5�0l�LE�ٽOl)��?Ҩ#������ve��-�R�P%[R�sv0��}[D�xO�>g}�h��p �w4!��Z,��L�t6�"$~h|��.��ItV(�Y�j��i�M���'���J�k&p�L(��?Q�
.��ZW�������׶ɤ>{&�;8�2"uŐ�d������V�`��gs��GR;�
�GK4x28<�_��<�Iؓ��Eax�<D��W�#<��w������(rў��m��$�lN,�3rE�'/�)`1d��>6m'�{� ���TM�̡*�:�y��͊�'��
�ؤs8�����F��S���ܟ��5�t�!��Zy�>	 ���$I,�!��B��S��w�D�Ka�Ԥ���6+u����7�e��>��e�;C!c�(�N�T_n�C>�Z���Ӯg�W5�^#��|]ʤ����a�KxDj��jco�R�HE]U��5Js�OԹ� D����w�t\��z"��90�����b�U��y��k$r|:�ށv~�����¯C���j��Rʁ��ka�C��j�i(�+�&�ǐ����(��<l�gBrv�<T��`��<�=����dq�ۤkR�ͽ�ٶf�/���rQ��bKm)�X:��@<SD�İ�I�g;m���ı�&9�r������=�9G��S��+Ck45To�\.�C M��)��k���Y@���]�@3�E1�dD����ZQ��F#���#V4:>*
4B�3��V%CnZ�-�9i�K#r��s�
��j�ۀ�9ۢ�Tc�mOo ���1�bp8c4T.�P���Avk��sJ4|�A@�cҡ�$ӲN����(� \|�P�
\?�h�<��XbQ{7cC|8�А��1�&��.4}�rc����h���qզ#{���Mx`>�ø�p�4�R��5qEf�#Z�|ax^�+FCU�Ui�ȍ���Q��:!2�r٧�:�x��;�;�V�!��Kz�*l�v$ak�O�W;��=#�{
�^�}d�n�v�5D������,*��-]�Xl��������5����]�[�o�ڝ�5�����} b�O�������d��6��Є���N�tZP�O^_����;�M��!w�ɇ�G��Zo#�7��A~-B�?��CC@1��
��8�����EWS/�*���_��-P�z�������k�׾� ��Me����m? ��U�!V@�r7� h�����#�TZd��o�/I�S�<�ų^ܟ���O����o�@~��@>���Xn�|s�7��ߜȽZ����5s�]���
A�V�Օ�ｗ�@� �@S��90����bK�ir������Qh���,j?I�%�������}�I��M�Xn[萠��z���d�9��(n�a%a�QYJ�#m\��A|ŵ�6�6�%7f�����^�w����v����Ck�Le��	�q>oc<o�@�W;�8�1�Ι���l�̉3�+��ST]�䉑d���w��57P���2��8y���i|�Ʋ��t�7Fox1�������~�Nbek�̝���0��2����S	t�N@����������� gGg?���'�������-�ޘ��ˌ�7�	|��iu
[��e�4��#��p �8́|+$AfWH�PS"@�;�r�����i3���V���7�ᵗ�	��ᡤ	:jM���QiK9���W,��u�%܇����{����<���T'����s���jy.�{��B|p0��$B*�W����e�Aw|���^��;�#h��^�.(��S�W����W�1���W�ķ�ꥧ�E��*5˯��2�D%�E��)�R'A�ʉ�I��vL�L_LF0��3�wm��.Fe&&�d�d�^��ͼ�y���4�ɇ��km+�P+t�}(߃	V��<��z뛀�6g�W�o*���/�M��N&5Ur\�E�|C�P���,c��Z.�ּa��Z��M����͝|9yYZ
���se�B+x2_�}D�5�ֻE���Ry�+x�Wy���R�Oᥢx)��Xn�R��M0?�˕�t.����ʼ�,��>WR��Pp#��$Ε���]�����j�`��D'K�=�^�F�c���
��H�N���$�	��̊La��Z'�
Јe�`t��l�i��ᦷw�;�g;�/��-��u��?��������)�+���j�5���	Cb�:� h|�#�������X\n9r=��3���Z4�5��4Hֺ���iV�����6S�!a	�i��Q¡O'��I �]����\X�7L��O~��{���V�Vo�q�3/�[���(�~C�0�`�?��\�9ݴi��ױ��d$���҉�-�C9?����!:��+N�����w9i;Ğ�,�[���C<��L�h[�͑y��"��Z�Ox�i3�&��|����"����Ew�# ajv-keywords

Custom JSON-Schema keywords for [Ajv](https://github.com/epoberezkin/ajv) validator

[![build](https://github.com/ajv-validator/ajv-keywords/workflows/build/badge.svg)](https://github.com/ajv-validator/ajv-keywords/actions?query=workflow%3Abuild)
[![npm](https://img.shields.io/npm/v/ajv-keywords.svg)](https://www.npmjs.com/package/ajv-keywords)
[![npm downloads](https://img.shields.io/npm/dm/ajv-keywords.svg)](https://www.npmjs.com/package/ajv-keywords)
[![coverage](https://coveralls.io/repos/github/ajv-validator/ajv-keywords/badge.svg?branch=master)](https://coveralls.io/github/ajv-validator/ajv-keywords?branch=master)
[![gitter](https://img.shields.io/gitter/room/ajv-validator/ajv.svg)](https://gitter.im/ajv-validator/ajv)

**Please note**: This readme file is for [ajv-keywords v5.0.0](https://github.com/ajv-validator/ajv-keywords/releases/tag/v5.0.0) that should be used with [ajv v8](https://github.com/ajv-validator/ajv).

[ajv-keywords v3](https://github.com/ajv-validator/ajv-keywords/tree/v3) should be used with [ajv v6](https://github.com/ajv-validator/ajv/tree/v6).

## Contents

- [Install](#install)
- [Usage](#usage)
- [Keywords](#keywords)
  - [Types](#types)
    - [typeof](#typeof)
    - [instanceof](#instanceof)<sup>\+</sup>
  - [Keywords for numbers](#keywords-for-numbers)
    - [range and exclusiveRange](#range-and-exclusiverange)
  - [Keywords for strings](#keywords-for-strings)
    - [regexp](#regexp)
    - [transform](#transform)<sup>\*</sup>
  - [Keywords for arrays](#keywords-for-arrays)
    - [uniqueItemProperties](#uniqueitemproperties)<sup>\+</sup>
  - [Keywords for objects](#keywords-for-objects)
    - [allRequired](#allrequired)
    - [anyRequired](#anyrequired)
    - [oneRequired](#onerequired)
    - [patternRequired](#patternrequired)
    - [prohibited](#prohibited)
    - [deepProperties](#deepproperties)
    - [deepRequired](#deeprequired)
    - [dynamicDefaults](#dynamicdefaults)<sup>\*</sup><sup>\+</sup>
  - [Keywords for all types](#keywords-for-all-types)
    - [select/selectCases/selectDefault](#selectselectcasesselectdefault)
- [Security contact](#security-contact)
- [Open-source software support](#open-source-software-support)
- [License](#license)

<sup>\*</sup> - keywords that modify data
<sup>\+</sup> - keywords that are not supported in [standalone validation code](https://github.com/ajv-validator/ajv/blob/master/docs/standalone.md)

## Install

To install version 4 to use with [Ajv v7](https://github.com/ajv-validator/ajv):

```
npm install ajv-keywords
```

## Usage

To add all available keywords:

```javascript
const Ajv = require("ajv")
const ajv = new Ajv()
require("ajv-keywords")(ajv)

ajv.validate({instanceof: "RegExp"}, /.*/) // true
ajv.validate({instanceof: "RegExp"}, ".*") // false
```

To add a single keyword:

```javascript
require("ajv-keywords")(ajv, "instanceof")
```

To add multiple keywords:

```javascript
require("ajv-keywords")(ajv, ["typeof", "instanceof"])
```

To add a single keyword directly (to avoid adding unused code):

```javascript
require("ajv-keywords/dist/keywords/select")(ajv, opts)
```

To add all keywords via Ajv options:

```javascript
const ajv = new Ajv({keywords: require("ajv-keywords/dist/definitions")(opts)})
```

To add one or several keywords via options:

```javascript
const ajv = new Ajv({
  keywords: [
    require("ajv-keywords/dist/definitions/typeof")(),
    require("ajv-keywords/dist/definitions/instanceof")(),
    // select exports an array of 3 definitions - see "select" in docs
    ...require("ajv-keywords/dist/definitions/select")(opts),
  ],
})
```

`opts` is an optional object with a property `defaultMeta` - URI of meta-schema to use for keywords that use subschemas (`select` and `deepProperties`). The default is `"http://json-schema.org/schema"`.

## Keywords

### Types

#### `typeof`

Based on JavaScript `typeof` operation.

The value of the keyword should be a string (`"undefined"`, `"string"`, `"number"`, `"object"`, `"function"`, `"boolean"` or `"symbol"`) or an array of strings.

To pass validation the result of `typeof` operation on the value should be equal to the string (or one of the strings in the array).

```javascript
ajv.validate({typeof: "undefined"}, undefined) // true
ajv.validate({typeof: "undefined"}, null) // false
ajv.validate({typeof: ["undefined", "object"]}, null) // true
```

#### `instanceof`

Based on JavaScript `instanceof` operation.

The value of the keyword should be a string (`"Object"`, `"Array"`, `"Function"`, `"Number"`, `"String"`, `"Date"`, `"RegExp"` or `"Promise"`) or an array of strings.

To pass validation the result of `data instanceof ...` operation on the value should be true:

```javascript
ajv.validate({instanceof: "Array"}, []) // true
ajv.validate({instanceof: "Array"}, {}) // false
ajv.validate({instanceof: ["Array", "Function"]}, function () {}) // true
```

You can add your own constructor function to be recognised by this keyword:

```javascript
class MyClass {}
const instanceofDef = require("ajv-keywords/dist/definitions/instanceof")
instanceofDef.CONSTRUCTORS.MyClass = MyClass
ajv.validate({instanceof: "MyClass"}, new MyClass()) // true
```

**Please note**: currently `instanceof` is not supported in [standalone validation code](https://github.com/ajv-validator/ajv/blob/master/docs/standalone.md) - it has to be implemented as [`code` keyword](https://github.com/ajv-validator/ajv/blob/master/docs/keywords.md#define-keyword-with-code-generation-function) to support it (PR is welcome).

### Keywords for numbers

#### `range` and `exclusiveRange`

Syntax sugar for the combination of minimum and maximum keywords (or exclusiveMinimum and exclusiveMaximum), also fails schema compilation if there are no numbers in the range.

The value of these keywords must be an array consisting of two numbers, the second must be greater or equal than the first one.

If the validated value is not a number the validation passes, otherwise to pass validation the value should be greater (or equal) than the first number and smaller (or equal) than the second number in the array.

```javascript
const schema = {type: "number", range: [1, 3]}
ajv.validate(schema, 1) // true
ajv.validate(schema, 2) // true
ajv.validate(schema, 3) // true
ajv.validate(schema, 0.99) // false
ajv.validate(schema, 3.01) // false

const schema = {type: "number", exclusiveRange: [1, 3]}
ajv.validate(schema, 1.01) // true
ajv.validate(schema, 2) // true
ajv.validate(schema, 2.99) // true
ajv.validate(schema, 1) // false
ajv.validate(schema, 3) // false
```

### Keywords for strings

#### `regexp`

This keyword allows to use regular expressions with flags in schemas, and also without `"u"` flag when needed (the standard `pattern` keyword does not support flags and implies the presence of `"u"` flag).

This keyword applies only to strings. If the data is not a string, the validation succeeds.

The value of this keyword can be either a string (the result of `regexp.toString()`) or an object with the properties `pattern` and `flags` (the same strings that should be passed to RegExp constructor).

```javascript
const schema = {
  type: "object",
  properties: {
    foo: {type: "string", regexp: "/foo/i"},
    bar: {type: "string", regexp: {pattern: "bar", flags: "i"}},
  },
}

const validData = {
  foo: "Food",
  bar: "Barmen",
}

const invalidData = {
  foo: "fog",
  bar: "bad",
}
```

#### `transform`

This keyword allows a string to be modified during validation.

This keyword applies only to strings. If the data is not a string, the `transform` keyword is ignored.

A standalone string cannot be modified, i.e. `data = 'a'; ajv.validate(schema, data);`, because strings are passed by value

**Supported transformations:**

- `trim`: remove whitespace from start and end
- `trimStart`/`trimLeft`: remove whitespace from start
- `trimEnd`/`trimRight`: remove whitespace from end
- `toLowerCase`: convert to lower case
- `toUpperCase`: convert to upper case
- `toEnumCase`: change string case to be equal to one of `enum` values in the schema

Transformations are applied in the order they are listed.

Note: `toEnumCase` requires that all allowed values are unique when case insensitive.

**Example: multiple transformations**

```javascript
require("ajv-keywords")(ajv, "transform")

const schema = {
  type: "array",
  items: {
    type: "string",
    transform: ["trim", "toLowerCase"],
  },
}

const data = ["  MixCase  "]
ajv.validate(schema, data)
console.log(data) // ['mixcase']
```

**Example: `enumcase`**

```javascript
require("ajv-keywords")(ajv, ["transform"])

const schema = {
  type: "array",
  items: {
    type: "string",
    transform: ["trim", "toEnumCase"],
    enum: ["pH"],
  },
}

const data = ["ph", " Ph", "PH", "pH "]
ajv.validate(schema, data)
console.log(data) // ['pH','pH','pH','pH']
```

### Keywords for arrays

#### `uniqueItemProperties`

The keyword allows to check that some properties in array items are unique.

This keyword applies only to arrays. If the data is not an array, the validation succeeds.

The value of this keyword must be an array of strings - property names that should have unique values across all items.

```javascript
const schema = {
  type: "array",
  uniqueItemProperties: ["id", "name"],
}

const validData = [{id: 1}, {id: 2}, {id: 3}]

const invalidData1 = [
  {id: 1},
  {id: 1}, // duplicate "id"
  {id: 3},
]

const invalidData2 = [
  {id: 1, name: "taco"},
  {id: 2, name: "taco"}, // duplicate "name"
  {id: 3, name: "salsa"},
]
```

This keyword is contributed by [@blainesch](https://github.com/blainesch).

**Please note**: currently `uniqueItemProperties` is not supported in [standalone validation code](https://github.com/ajv-validator/ajv/blob/master/docs/standalone.md) - it has to be implemented as [`code` keyword](https://github.com/ajv-validator/ajv/blob/master/docs/keywords.md#define-keyword-with-code-generation-function) to support it (PR is welcome).

### Keywords for objects

#### `allRequired`

This keyword allows to require the presence of all properties used in `properties` keyword in the same schema object.

This keyword applies only to objects. If the data is not an object, the validation succeeds.

The value of this keyword must be boolean.

If the value of the keyword is `false`, the validation succeeds.

If the value of the keyword is `true`, the validation succeeds if the data contains all properties defined in `properties` keyword (in the same schema object).

If the `properties` keyword is not present in the same schema object, schema compilation will throw exception.

```javascript
const schema = {
  type: "object",
  properties: {
    foo: {type: "number"},
    bar: {type: "number"},
  },
  allRequired: true,
}

const validData = {foo: 1, bar: 2}
const alsoValidData = {foo: 1, bar: 2, baz: 3}

const invalidDataList = [{}, {foo: 1}, {bar: 2}]
```

#### `anyRequired`

This keyword allows to require the presence of any (at least one) property from the list.

This keyword applies only to objects. If the data is not an object, the validation succeeds.

The value of this keyword must be an array of strings, each string being a property name. For data object to be valid at least one of the properties in this array should be present in the object.

```javascript
const schema = {
  type: "object",
  anyRequired: ["foo", "bar"],
}

const validData = {foo: 1}
const alsoValidData = {foo: 1, bar: 2}

const invalidDataList = [{}, {baz: 3}]
```

#### `oneRequired`

This keyword allows to require the presence of only one property from the list.

This keyword applies only to objects. If the data is not an object, the validation succeeds.

The value of this keyword must be an array of strings, each string being a property name. For data object to be valid exactly one of the properties in this array should be present in the object.

```javascript
const schema = {
  type: "object",
  oneRequired: ["foo", "bar"],
}

const validData = {foo: 1}
const alsoValidData = {bar: 2, baz: 3}

const invalidDataList = [{}, {baz: 3}, {foo: 1, bar: 2}]
```

#### `patternRequired`

This keyword allows to require the presence of properties that match some pattern(s).

This keyword applies only to objects. If the data is not an object, the validation succeeds.

The value of this keyword should be an array of strings, each string being a regular expression. For data object to be valid each regular expression in this array should match at least one property name in the data object.

If the array contains multiple regular expressions, more than one expression can match the same property name.

```javascript
const schema = {
  type: "object",
  patternRequired: ["f.*o", "b.*r"],
}

const validData = {foo: 1, bar: 2}
const alsoValidData = {foobar: 3}

const invalidDataList = [{}, {foo: 1}, {bar: 2}]
```

#### `prohibited`

This keyword allows to prohibit that any of the properties in the list is present in the object.

This keyword applies only to objects. If the data is not an object, the validation succeeds.

The value of this keyword should be an array of strings, each string being a property name. For data object to be valid none of the properties in this array should be present in the object.

```javascript
const schema = {
  type: "object",
  prohibited: ["foo", "bar"],
}

const validData = {baz: 1}
const alsoValidData = {}

const invalidDataList = [{foo: 1}, {bar: 2}, {foo: 1, bar: 2}]
```

**Please note**: `{prohibited: ['foo', 'bar']}` is equivalent to `{not: {anyRequired: ['foo', 'bar']}}` (i.e. it has the same validation result for any data).

#### `deepProperties`

This keyword allows to validate deep properties (identified by JSON pointers).

This keyword applies only to objects. If the data is not an object, the validation succeeds.

The value should be an object, where keys are JSON pointers to the data, starting from the current position in data, and the values are JSON schemas. For data object to be valid the value of each JSON pointer should be valid according to the corresponding schema.

```javascript
const schema = {
  type: "object",
  deepProperties: {
    "/users/1/role": {enum: ["admin"]},
  },
}

const validData = {
  users: [
    {},
    {
      id: 123,
      role: "admin",
    },
  ],
}

const alsoValidData = {
  users: {
    1: {
      id: 123,
      role: "admin",
    },
  },
}

const invalidData = {
  users: [
    {},
    {
      id: 123,
      role: "user",
    },
  ],
}

const alsoInvalidData = {
  users: {
    1: {
      id: 123,
      role: "user",
    },
  },
}
```

#### `deepRequired`

This keyword allows to check that some deep properties (identified by JSON pointers) are available.

This keyword applies only to objects. If the data is not an object, the validation succeeds.

The value should be an array of JSON pointers to the data, starting from the current position in data. For data object to be valid each JSON pointer should be some existing part of the data.

```javascript
const schema = {
  type: "object",
  deepRequired: ["/users/1/role"],
}

const validData = {
  users: [
    {},
    {
      id: 123,
      role: "admin",
    },
  ],
}

const invalidData = {
  users: [
    {},
    {
      id: 123,
    },
  ],
}
```

See [json-schema-org/json-schema-spec#203](https://github.com/json-schema-org/json-schema-spec/issues/203#issue-197211916) for an example of the equivalent schema without `deepRequired` keyword.

### Keywords for all types

#### `select`/`selectCases`/`selectDefault`

**Please note**: these keywords are deprecated. It is recommended to use OpenAPI [discriminator](https://ajv.js.org/json-schema.html#discriminator) keyword supported by Ajv v8 instead of `select`.

These keywords allow to choose the schema to validate the data based on the value of some property in the validated data.

These keywords must be present in the same schema object (`selectDefault` is optional).

The value of `select` keyword should be a [\$data reference](https://github.com/ajv-validator/ajv/blob/master/docs/validation.md#data-reference) that points to any primitive JSON type (string, number, boolean or null) in the data that is validated. You can also use a constant of primitive type as the value of this keyword (e.g., for debugging purposes).

The value of `selectCases` keyword must be an object where each property nameroperty is set to `true`, a warning and a
     * stack trace are printed to `stderr` the first time the deprecated function is
     * called.
     *
     * If the `--throw-deprecation` command-line flag is set, or the`process.throwDeprecation` property is set to `true`, then an exception will be
     * thrown when the deprecated function is called.
     *
     * The `--throw-deprecation` command-line flag and `process.throwDeprecation`property take precedence over `--trace-deprecation` and`process.traceDeprecation`.
     * @since v0.8.0
     * @param fn The function that is being deprecated.
     * @param msg A warning message to display when the deprecated function is invoked.
     * @param code A deprecation code. See the `list of deprecated APIs` for a list of codes.
     * @return The deprecated function wrapped to emit a warning.
     */
    export function deprecate<T extends Function>(fn: T, msg: string, code?: string): T;
    /**
     * Returns `true` if there is deep strict equality between `val1` and `val2`.
     * Otherwise, returns `false`.
     *
     * See `assert.deepStrictEqual()` for more information about deep strict
     * equality.
     * @since v9.0.0
     */
    export function isDeepStrictEqual(val1: unknown, val2: unknown): boolean;
    /**
     * Returns `str` with any ANSI escape codes removed.
     *
     * ```js
     * console.log(util.stripVTControlCharacters('\u001B[4mvalue\u001B[0m'));
     * // Prints "value"
     * ```
     * @since v16.11.0
     */
    export function stripVTControlCharacters(str: string): string;
    /**
     * Takes an `async` function (or a function that returns a `Promise`) and returns a
     * function following the error-first callback style, i.e. taking
     * an `(err, value) => ...` callback as the last argument. In the callback, the
     * first argument will be the rejection reason (or `null` if the `Promise`resolved), and the second argument will be the resolved value.
     *
     * ```js
     * const util = require('node:util');
     *
     * async function fn() {
     *   return 'hello world';
     * }
     * const callbackFunction = util.callbackify(fn);
     *
     * callbackFunction((err, ret) => {
     *   if (err) throw err;
     *   console.log(ret);
     * });
     * ```
     *
     * Will print:
     *
     * ```text
     * hello world
     * ```
     *
     * The callback is executed asynchronously, and will have a limited stack trace.
     * If the callback throws, the process will emit an `'uncaughtException'` event, and if not handled will exit.
     *
     * Since `null` has a special meaning as the first argument to a callback, if a
     * wrapped function rejects a `Promise` with a falsy value as a reason, the value
     * is wrapped in an `Error` with the original value stored in a field named`reason`.
     *
     * ```js
     * function fn() {
     *   return Promise.reject(null);
     * }
     * const callbackFunction = util.callbackify(fn);
     *
     * callbackFunction((err, ret) => {
     *   // When the Promise was rejected with `null` it is wrapped with an Error and
     *   // the original value is stored in `reason`.
     *   err &#x26;&#x26; Object.hasOwn(err, 'reason') &#x26;&#x26; err.reason === null;  // true
     * });
     * ```
     * @since v8.2.0
     * @param fn An `async` function
     * @return a callback style function
     */
    export function callbackify(fn: () => Promise<void>): (callback: (err: NodeJS.ErrnoException) => void) => void;
    export function callbackify<TResult>(
        fn: () => Promise<TResult>,
    ): (callback: (err: NodeJS.ErrnoException, result: TResult) => void) => void;
    export function callbackify<T1>(
        fn: (arg1: T1) => Promise<void>,
    ): (arg1: T1, callback: (err: NodeJS.ErrnoException) => void) => void;
    export function callbackify<T1, TResult>(
        fn: (arg1: T1) => Promise<TResult>,
    ): (arg1: T1, callback: (err: NodeJS.ErrnoException, result: TResult) => void) => void;
    export function callbackify<T1, T2>(
        fn: (arg1: T1, arg2: T2) => Promise<void>,
    ): (arg1: T1, arg2: T2, callback: (err: NodeJS.ErrnoException) => void) => void;
    export function callbackify<T1, T2, TResult>(
        fn: (arg1: T1, arg2: T2) => Promise<TResult>,
    ): (arg1: T1, arg2: T2, callback: (err: NodeJS.ErrnoException | null, result: TResult) => void) => void;
    export function callbackify<T1, T2, T3>(
        fn: (arg1: T1, arg2: T2, arg3: T3) => Promise<void>,
    ): (arg1: T1, arg2: T2, arg3: T3, callback: (err: NodeJS.ErrnoException) => void) => void;
    export function callbackify<T1, T2, T3, TResult>(
        fn: (arg1: T1, arg2: T2, arg3: T3) => Promise<TResult>,
    ): (arg1: T1, arg2: T2, arg3: T3, callback: (err: NodeJS.ErrnoException | null, result: TResult) => void) => void;
    export function callbackify<T1, T2, T3, T4>(
        fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Promise<void>,
    ): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, callback: (err: NodeJS.ErrnoException) => void) => void;
    export function callbackify<T1, T2, T3, T4, TResult>(
        fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Promise<TResult>,
    ): (
        arg1: T1,
        arg2: T2,
        arg3: T3,
        arg4: T4,
        callback: (err: NodeJS.ErrnoException | null, result: TResult) => void,
    ) => void;
    export function callbackify<T1, T2, T3, T4, T5>(
        fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => Promise<void>,
    ): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, callback: (err: NodeJS.ErrnoException) => void) => void;
    export function callbackify<T1, T2, T3, T4, T5, TResult>(
        fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => Promise<TResult>,
    ): (
        arg1: T1,
        arg2: T2,
        arg3: T3,
        arg4: T4,
        arg5: T5,
        callback: (err: NodeJS.ErrnoException | null, result: TResult) => void,
    ) => void;
    export function callbackify<T1, T2, T3, T4, T5, T6>(
        fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6) => Promise<void>,
    ): (
        arg1: T1,
        arg2: T2,
        arg3: T3,
        arg4: T4,
        arg5: T5,
        arg6: T6,
        callback: (err: NodeJS.ErrnoException) => void,
    ) => void;
    export function callbackify<T1, T2, T3, T4, T5, T6, TResult>(
        fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6) => Promise<TResult>,
    ): (
        arg1: T1,
        arg2: T2,
        arg3: T3,
        arg4: T4,
        arg5: T5,
        arg6: T6,
        callback: (err: NodeJS.ErrnoException | null, result: TResult) => void,
    ) => void;
    export interface CustomPromisifyLegacy<TCustom extends Function> extends Function {
        __promisify__: TCustom;
    }
    export interface CustomPromisifySymbol<TCustom extends Function> extends Function {
        [promisify.custom]: TCustom;
    }
    export type CustomPromisify<TCustom extends Function> =
        | CustomPromisifySymbol<TCustom>
        | CustomPromisifyLegacy<TCustom>;
    /**
     * Takes a function following the common error-first callback style, i.e. taking
     * an `(err, value) => ...` callback as the last argument, and returns a version
     * that returns promises.
     *
     * ```js
     * const util = require('node:util');
     * const fs = require('node:fs');
     *
     * const stat = util.promisify(fs.stat);
     * stat('.').then((stats) => {
     *   // Do something with `stats`
     * }).catch((error) => {
     *   // Handle the error.
     * });
     * ```
     *
     * Or, equivalently using `async function`s:
     *
     * ```js
     * const util = require('node:util');
     * const fs = require('node:fs');
     *
     * const stat = util.promisify(fs.stat);
     *
     * async function callStat() {
     *   const stats = await stat('.');
     *   console.log(`This directory is owned by ${stats.uid}`);
     * }
     *
     * callStat();
     * ```
     *
     * If there is an `original[util.promisify.custom]` property present, `promisify`will return its value, see `Custom promisified functions`.
     *
     * `promisify()` assumes that `original` is a function taking a callback as its
     * final argument in all cases. If `original` is not a function, `promisify()`will throw an error. If `original` is a function but its last argument is not
     * an error-first callback, it will still be passed an error-first
     * callback as its last argument.
     *
     * Using `promisify()` on class methods or other methods that use `this` may not
     * work as expected unless handled specially:
     *
     * ```js
     * const util = require('node:util');
     *
     * class Foo {
     *   constructor() {
     *     this.a = 42;
     *   }
     *
     *   bar(callback) {
     *     callback(null, this.a);
     *   }
     * }
     *
     * const foo = new Foo();
     *
     * const naiveBar = util.promisify(foo.bar);
     * // TypeError: Cannot read property 'a' of undefined
     * // naiveBar().then(a => console.log(a));
     *
     * naiveBar.call(foo).then((a) => console.log(a)); // '42'
     *
     * const bindBar = naiveBar.bind(foo);
     * bindBar().then((a) => console.log(a)); // '42'
     * ```
     * @since v8.0.0
     */
    export function promisify<TCustom extends Function>(fn: CustomPromisify<TCustom>): TCustom;
    export function promisify<TResult>(
        fn: (callback: (err: any, result: TResult) => void) => void,
    ): () => Promise<TResult>;
    export function promisify(fn: (callback: (err?: any) => void) => void): () => Promise<void>;
    export function promisify<T1, TResult>(
        fn: (arg1: T1, callback: (err: any, result: TResult) => void) => void,
    ): (arg1: T1) => Promise<TResult>;
    export function promisify<T1>(fn: (arg1: T1, callback: (err?: any) => void) => void): (arg1: T1) => Promise<void>;
    export function promisify<T1, T2, TResult>(
        fn: (arg1: T1, arg2: T2, callback: (err: any, result: TResult) => void) => void,
    ): (arg1: T1, arg2: T2) => Promise<TResult>;
    export function promisify<T1, T2>(
        fn: (arg1: T1, arg2: T2, callback: (err?: any) => void) => void,
    ): (arg1: T1, arg2: T2) => Promise<void>;
    export function promisify<T1, T2, T3, TResult>(
        fn: (arg1: T1, arg2: T2, arg3: T3, callback: (err: any, result: TResult) => void) => void,
    ): (arg1: T1, arg2: T2, arg3: T3) => Promise<TResult>;
    export function promisify<T1, T2, T3>(
        fn: (arg1: T1, arg2: T2, arg3: T3, callback: (err?: any) => void) => void,
    ): (arg1: T1, arg2: T2, arg3: T3) => Promise<void>;
    export function promisify<T1, T2, T3, T4, TResult>(
        fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, callback: (err: any, result: TResult) => void) => void,
    ): (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Promise<TResult>;
    export function promisify<T1, T2, T3, T4>(
        fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, callback: (err?: any) => void) => void,
    ): (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Promise<void>;
    export function promisify<T1, T2, T3, T4, T5, TResult>(
        fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, callback: (err: any, result: TResult) => void) => void,
    ): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => Promise<TResult>;
    export function promisify<T1, T2, T3, T4, T5>(
        fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, callback: (err?: any) => void) => void,
    ): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => Promise<void>;
    export function promisify(fn: Function): Function;
    export namespace promisify {
        /**
         * That can be used to declare custom promisified variants of functions.
         */
        const custom: unique symbol;
    }
    /**
     * An implementation of the [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) `TextDecoder` API.
     *
     * ```js
     * const decoder = new TextDecoder();
     * const u8arr = new Uint8Array([72, 101, 108, 108, 111]);
     * console.log(decoder.decode(u8arr)); // Hello
     * ```
     * @since v8.3.0
     */
    export class TextDecoder {
        /**
         * The encoding supported by the `TextDecoder` instance.
         */
        readonly encoding: string;
        /**
         * The value will be `true` if decoding errors result in a `TypeError` being
         * thrown.
         */
        readonly fatal: boolean;
        /**
         * The value will be `true` if the decoding result will include the byte order
         * mark.
         */
        readonly ignoreBOM: boolean;
        constructor(
            encoding?: string,
            options?: {
                fatal?: boolean | undefined;
                ignoreBOM?: boolean | undefined;
            },
        );
        /**
         * Decodes the `input` and returns a string. If `options.stream` is `true`, any
         * incomplete byte sequences occurring at the end of the `input` are buffered
         * internally and emitted after the next call to `textDecoder.decode()`.
         *
         * If `textDecoder.fatal` is `true`, decoding errors that occur will result in a`TypeError` being thrown.
         * @param input An `ArrayBuffer`, `DataView`, or `TypedArray` instance containing the encoded data.
         */
        decode(
            input?: NodeJS.ArrayBufferView | ArrayBuffer | null,
            options?: {
                stream?: boolean | undefined;
            },
        ): string;
    }
    export interface EncodeIntoResult {
        /**
         * The read Unicode code units of input.
         */
        read: number;
        /**
         * The written UTF-8 bytes of output.
         */
        written: number;
    }
    export { types };

    //// TextEncoder/Decoder
    /**
     * An implementation of the [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) `TextEncoder` API. All
     * instances of `TextEncoder` only support UTF-8 encoding.
     *
     * ```js
     * const encoder = new TextEncoder();
     * const uint8array = encoder.encode('this is some data');
     * ```
     *
     * The `TextEncoder` class is also available on the global object.
     * @since v8.3.0
     */
    export class TextEncoder {
        /**
         * The encoding supported by the `TextEncoder` instance. Always set to `'utf-8'`.
         */
        readonly encoding: string;
        /**
         * UTF-8 encodes the `input` string and returns a `Uint8Array` containing the
         * encoded bytes.
         * @param [input='an empty string'] The text to encode.
         */
        encode(input?: string): Uint8Array;
        /**
         * UTF-8 encodes the `src` string to the `dest` Uint8Array and returns an object
         * containing the read Unicode code units and written UTF-8 bytes.
         *
         * ```js
         * const encoder = new TextEncoder();
         * const src = 'this is some data';
         * const dest = new Uint8Array(10);
         * const { read, written } = encoder.encodeInto(src, dest);
         * ```
         * @param src The text to encode.
         * @param dest The array to hold the encode result.
         */
        encodeInto(src: string, dest: Uint8Array): EncodeIntoResult;
    }
    import { TextDecoder as _TextDecoder, TextEncoder as _TextEncoder } from "util";
    global {
        /**
         * `TextDecoder` class is a global reference for `require('util').TextDecoder`
         * https://nodejs.org/api/globals.html#textdecoder
         * @since v11.0.0
         */
        var TextDecoder: typeof globalThis extends {
            onmessage: any;
            TextDecoder: infer TextDecoder;
        } ? TextDecoder
            : typeof _TextDecoder;
        /**
         * `TextEncoder` class is a global reference for `require('util').TextEncoder`
         * https://nodejs.org/api/globals.html#textencoder
         * @since v11.0.0
         */
        var TextEncoder: typeof globalThis extends {
            onmessage: any;
            TextEncoder: infer TextEncoder;
        } ? TextEncoder
            : typeof _TextEncoder;
    }

    //// parseArgs
    /**
     * Provides a higher level API for command-line argument parsing than interacting
     * with `process.argv` directly. Takes a specification for the expected arguments
     * and returns a structured object with the parsed opt"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const error = {
    message: "must match exactly one schema in oneOf",
    params: ({ params }) => (0, codegen_1._) `{passingSchemas: ${params.passing}}`,
};
const def = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: true,
    error,
    code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        /* istanbul ignore if */
        if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
            return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        // TODO possibly fail straight away (with warning or exception) if there are two empty always valid schemas
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
            schArr.forEach((sch, i) => {
                let schCxt;
                if ((0, util_1.alwaysValidSchema)(it, sch)) {
                    gen.var(schValid, true);
                }
                else {
                    schCxt = cxt.subschema({
                        keyword: "oneOf",
                        schemaProp: i,
                        compositeRule: true,
                    }, schValid);
                }
                if (i > 0) {
                    gen
                        .if((0, codegen_1._) `${schValid} && ${valid}`)
                        .assign(valid, false)
                        .assign(passing, (0, codegen_1._) `[${passing}, ${i}]`)
                        .else();
                }
                gen.if(schValid, () => {
                    gen.assign(valid, true);
                    gen.assign(passing, i);
                    if (schCxt)
                        cxt.mergeEvaluated(schCxt, codegen_1.Name);
                });
            });
        }
    },
};
exports.default = def;
//# sourceMappingURL=oneOf.js.map                                                                                                                                                                                                                                                                                                               y��
�ZV�s����"�Z�
�S�����ON���]x:Tܭ@O=S(�)I�L�Y����-x^�_K�K0�ˌ�_��~�[ܣ%�*�� �H!Y���@��%:b���uY��9~�[8�ʝ��s�]�Y!�y��a^�\����������b0�c��b�g������鶭�?����<�C��s��8f@�� �c@��cm@>4kρ�|6_��{��?q!�#VU���f�|N�a�ut��P�m�|򃀐VE��7�Exb��`v4��~:�*��H�%���@��6d��@�w:Ǹ!t6�|�G��^T�2�?oP�| ��J�P������#��W����b7�|�ֵW�T>(F���`�9?���|�l�(|kWy�
�a�b��c������~�qվ�qZ�	�p�p\��J�%��w��w/k��0����6E��vE��)�ZmtZ�πT{��z��{���~��t�C�K�r!]ΡK:]R�ґ.�t9������ot�؃�3�2s����OA�>��q��Ћ ���6p��x�eD><��e��GC'�j��=I0٘kk'��m����A}YP���������S9���F�� Zqb\gτ:�����mZ�O��3$��q}�,�т�]���@�zY��^{��5������%�<�!�0�Xur�h��؂$#��u	�,�?�,|���:C��Rf��R�`�<Oٴg�!G¡]pZ�q���^�w�(�+$Qx�|�dq�N�����-OA����=�����~O'�`�ٻq-��X�RhW;2�S�e�gH�*4O$�um ct|���1��\����5�j�u�Q�MR!��H��-W�P7�dO�&� ;�a8 �2�&Nq�Wi5�b�V1�=튋�x�5�bSόY���Σ�'����� k]7�ϒ��gt��ώ�3�!�
I �_�σ�E6Ħt"dV^�%+��ȫ�i�D.���m�����T �Ұ�Yƙ�x�0^����YѨ��C�k[⺫��<�i��4�0Ҫ�������y����x�6�u�̋�]<�m"�ۈ�v�~�>%u�S���\�x��z�I���4:��`ף8�H�'��#бz�(�FS���Ӟ�1�4<�EU���r����u��dĩص���w-�s���o� w���@}y���@��=[q0v�`�M=b�.��84>��Y�/8��Ԛ�<�=Gȓ�c�*Xy4�J�[t?�&�԰�	'����,n�PR��t:�������a�F���'���K��:�
��s b�Z��Ͻ�4��1���,e w�q�����9�J�v�*��r�Pn(�Խ���0�<� '6R��]�K��ٵ�]�*�G�f��: j,��b���������)R�,��\�R&�z��K��,"y�C����a=L/P������g��"'���s'��p��<��Don�7_�7��Bz�&j�<$�d��s����i��"�����ᓋ
x��](�Zv5��hg*P'{��U������F?��s��H�������Pu;փ�ȳ^�ɿ�b� r�J\��� �$����R�H�x�G����x��lpG�n\*%�ق��#��j'����>I�1�o�l�%�"����9�w�up(<�mf?��΁��AV����s�9`$WCR"�>�I-`��ӱ���0�ysP��V���5��I{��EV�s?��۱��ȧ�I�޼�
�Ḑ�J8�˗+�.O��)5/{S��j@v��ʓB{��ٛ�'�l�������s=��]^�s5#NI�b��4���<0��(�=<g"���}��_'[G�S݉�����tߎ�h>����!�=)�S@�:<��<��S���J��J"(B����/~$��o����ʺ�f2����\l�5KK���� �? ���{�C_�J��{��S��W0�Lc+�˽�jĮȏtB^pB���˗V oaײv�Uz�[��	�Da�@����L �(��}#���\�c\�H7�5ӽt$�>�����TMpB4��|��}4�.S&�'�xħւ[37����`r>��?����}0��A�ೳ�"�18?dނ����t&�����v�&K�� �s��r=���BJ��Yۏ�>�Ƹ�M!�G�B�2*�2������~���t�>�#�LR��������<;���j��H�t��V$<����P?.�R(�w�ByX��Nq��W+�s䡌��Ǩ�e����a!�F�1D�hFY������2��gRL�+���qx+<-�����%�7��.����U�����2���d������Ÿ�aS�e?��E���EV�s'�p�$G>���x�:��}Zg���MK���xG���������/p�;���l�dg��ܻ͗#CR	�_w.��n頗�_x�b�`��G1��E��c<�l�I�Flm����x�G�Z�c�0>��^�t�S�r���fn0����-�a�uӃ.X��S���OO�Ĺ�ϊu��4��X��	��u�rV,�gH�p��o�����/��6��N�<8�LM�7i�(�uR�i�X�	3���o`�@�"(B
H��Ve��X��e^�-�o�g͢��!}2;βQfN:RXsz��
]H�W��{nϏ!
 ^�mcl�=̓�����'���k�T�V����t�M|.���R���wL�b����?�5��������C:���|�F�p�(W�P6Q���Y�%N�O:��͘~�#��]l��/vr,9&����w����V8��OĦ�k��7�6�x n�+�6����e�����f��@�����=�G��fV��oL����O�9�z������D��"o����<�� Ӓ���I_uk�L�I�a>� I4�q�����lV�]�)��)9H� &�/�4J�,)	���A��e��4�T�ڄ?��(�)끸�g� �3.��z�s�B��?�KIRF�c2�w���(�9���\7ß���?"���A?��y
�,h��]��~ �2�A�5H��1e�f����XQ�y�V1���[�n�F�p�ma�;R��©�U	:]�!{b�:�.9�Pk�䖛ڨǀ�'s��O��i�����)��bΐ������i��껴���1�8�GJQ�{��\��F{m�{\sA)G�.�1;��E>�1[J��PXe�sO����:��i��_�W�8�%��Q��Vh�ߪ@&�Y��;�R���N�B�A��;d�>A|6q����W�i��#��ƻ\� ��2pd���.JǬ�푎�Uʍ:+�#�[�S�I�`'����!�WQP�!�'C��F� �G�x ���C)�;�D��<����(�]3���|�ϝ�մ��9���ŷh��}d.`.'9W� �� ��]G8
K��-fbW�u�1���c�{G�z�?cy��Ү(a�t�)���B[�xd�#8hs�� ��&�d��Z�#-��^݄��>`��{���M¸Z*+����SKծ{ɺ�v���=�ۄp?4nS_}a|T��c���M���a�D�sRxL,����w_<(�5�R��[��ܘ"�KFpR+.���������X�O�ۅV�E�o=�"�^�Of�C��:� h�7"t��m�s_ɂ ��A��˹Y�$e�q�|i����m��������C�Z�ئ�����/�>�m���������u+�~l�H����h�D�
4��ֱn���8ϴ��q��hk5~�Ny�A�D4+7)zX=)��~Cd|<�#��@U�\���L�k�K�\З��MǗ�=��sUx�-V��*�+�I�����|�#�r����΃�[�����ȧ����u2D�![2QL��E_�4*��ɗX�$�F2�T9HVk�3 34}����t'O"��������;S S4_M깞�On���~�Y���o�Y�l"�\O45a{�a��lذ�������1>~_�Si*��m�f]��nߴ������yT�1Nb�f7�\�v��.xM�+x�*�dYRFe�H��/+H���� &��.��g�[Cg|�O�)��8��j�{����������8<��?"�x4�=��XK�\���BDh"؁k�M@�m�?��~�\�\�;=�xnK�1@"�2$%��<��ѝ*V]l�Թ���c��(F5X�hY/��Lb���3���� �L\\ь��B�@�8���~F���'��4�I��0��9Z���_�D��d�5�4R����Q���J�SKzv�t�a� �"������ϽG!��.�q{�O\m�'/���pݲ��4��)0�0��.{��=������U���q,��0��ߏN��7m-�0�e{0������J5К�f x���f�-�h�Z�,0���H�� �;�	cg8�:oO�w�4P�>.Gߊ��A(_�F�,�F��7%L�Z�m�/_��a�����Ϣw���1�a�#���mߊ��6�AZ�Ae3�~��@�Ū������}��Z)�w�w��_܄om2�M_�D�7�W�W�b{��'6�m��u�����罿!��C�����[LY>��cX8�a�V���gZ������L��z5E��|zC�2�6|�-��m�3��_g�����HI����P��.j���zƁ^5�����K��(Z�dI-���wMX�E��8U��c�S��o�+C?m����Ҥ����U��C���/?�J�S���/���Arn.�Bv9-�g��p�
��.��E�9(]�=[��g�r���fя:���쩒4W|�A��*[VB��kȓk(�f;�8������tU}y6F���ݘbt���t?�DK�D��ܭ�����M�W�����+�:	ȳ�e� �c���NoF�?^�q�M���U�[�i�*���e���5�?��b��d lg�`5��o�+�\�4;v��y�]����L���e��O���gⱺ�U()��� �<�O/�0$�������u����w�7�E���w@A5�2{��Tv����*�_�uj���H����1�����S���£���L�;�׸�6u5^.����v��vE�
��a�7��]k ��F���IM�)��~v7+�?J���4;�MQ���~5+���"Шc���j��'��]�u�,�����O�K˱z��n�4��V���}�[f�4�*��k�|����ge�9�k�ҲX�u�΁ʺE�Ɗ#�M��u�{�IÄ���%\��p^ω�n�n���`��#-��I���j�������9�ьy��0��@;����t���d�<��m�I��vw���x���"�U�B����������qꏠZyb+F�n��Q�X�7���B�����DP/�E�6�=Z��q��珑�W�1�|&#~�EOzx�h�pI�iE��������u1�ChڽU��V�0<@�Pq�Mg\U!H��� f�> P�f���|h��"��2��*�E�P������Sɦ����Mg��H��fO�b��TBK"#�?nGd)j�'�ۧc���NU���U8��&�����6�����yw<>ΔC�����o0�s����P^N���\��8�t��h��p���90�����(�`���ƶo�B?%s��`���%�*6�{�-��u��G7AOҺI�ì'���c�K�F�bb��7��	��ꡝ�rCAHK4���1_���u��h�{����k1�\��{��}BO��2�yvㄙ{W�p��>�N���Q��G~�&��Q��B�wI�;��SR�O�3A`\+\� ��7��.u�.����7�X�n(0JA�Bw��ި��_G���6���qq�MOE���3^�)|�{��:�r@(���߼�:���7��ri�KBʥ�����0?�M4�˩�����A��$g���u�;=}�&x�$��W�)�7eo��� ��M����
u^9�V�#�r]�.i�Y{4h����pw\{o��nz{���[tM��@���� {�/�܉���g#����r�W^N�?�\��S��G~�
m/x=���v�i� ��ꄿ��^���t�J�MtYO�5t�]�U����Q���X(o0�NV6ǳH��pa>֝I��N�b� �&ad_F%H���"��'Lݜ]W���>�f0Q��]i'm�����d��7R���_��<L�%��^b`��__�l3�1rGR��~���?2yH���={Q(���u-Ʊ�����K��;S�D��r;C���#��)�ID�n��FI.�Fv6+���sAeP�H���c�0�ee3��	[I
Q�Y�̥#t�"��u �f���?S\"�DC�d��^�w"٥�N��l8�R��TdD6A��7M����m��#�E��W������O�G~]�������J�^��m��]�s-m��V�?Aз,�e:r��T�!�"6�џ��C�w��t�jF�N�*�FE��m�8��p
۟��"��bS�@BŔ�	b�Ϝ`�^^f']�G[�OY�"�y�y%jQt�<�ğ{��pS%�s�@�¬!ې�W�ъۑCD��ʇ�t�g�x94+̍6�.��{�qԿ%V�Ѣ�AE�5+����K�/�3t�ي�\��_��OP���l����1?�⬯�:o�#��ҟ��o�b�!uݕG�0��� ��N|���9�9-�_�s7S

�$��2�P��&�Vކl�;xk�s�� .D�愲L)�+��3�Q e���(����8�/e�J|?����9��4=���D�2�_@��X�"�Dٗ��J_����%Q��<���Z��� V��#_�b<�"$;5�	t?I箢�{a�d4�� �M�D�����'8��Y:��sZx�<'�;�~�3���K�v�D�ǁ����٪ݭ��4��]3)dL���>�j@��� <) 3���X�+�6��NҶp����P���`62>&�,�*������,��uf���3��=j>����Ko6@p�j{|6���+���o�d�	�>��Q��UbՓ�<����� ��?��_��#I���\��I�T�q���J�着�u���0ޏo4���|�(���',�M�B#}�j,���&p�B���(� ��<�@�k�3����K�_�� � جV�1�����%y>7���fI�{ؽ�I@>g�C�Y���R+�TX���x�d� �r�4�,6�$7��qi�Xb���r�P��M��ec*�=��៖r����'=��,x�.�%����p�I'��232�m���%�\�K7D�����'S0��c[��7�z����F��:��0��E�,�-%$���%��G/��6���u�u�=�������cN�][�����[b՟m�_���u�X����^l�l?G3�^/]O��ݬ0��C��(��1q�X�%��� ��̧p�l�Ԃ��#���v�5�`�]+m��XF<�>�9t�4���vXKKi-�A
�-|-�Z}4j���:��M�K&��.|�h4ƭ{��ki�߫����D\�Q�[YoI����\�
�T�Q9��s�g��\1��Y`u#ph����ΉE���j�l(���pR?Y���Z)a��nb��oa|R
�I��k�\Qbţ��D���6���Q}��"���G_#��Dÿ�چ�#[�����k���q�,� ��\6��r<^��D*��$<gh��#��������7�y�4'���cO,�q+�R�1ۙ\�]KT��|r�w{���p��6��VNwi����[>��d]���5�U秭	ʩ���To^Am��g�
�;��ο��2�!)�8Ac9�;�=��r@�,)��$}���!���������8�9LIڃ���B�.�*���x:����-ş�i�40��WM:"(��j�x|�Q`��������=�,b/s�e*o�@^3@�g@����jyt��{���x�ܡ�����B�/��4D��'� i�~I,P�f��v"B�!��I�g �
%P�$r䋋3���cg�pL.���i-'`�����o!��K���m�D�w̹f1����&��b�E��Mnkj���Ql���eWgZ�c�����ڷ-Q�WM��t^c��e�ת�a���cm��tK)��%H�~'���B�W=�r� 0"��S\�b %Q��"�y�$e
�3�:<�Hj���F@�1v/t4,��hf���H��M^��Wd=�y�+�a��=L���ь���#��K�q�U��f`��8B{"�^�_x���>g�Sr���ѫrzmK���Ć��P�|4��V�O��0�_ÖT�ë^epļKb?<��:��_����_?���|	3#"$+��adY�����f䃾9��*�X��>��4�5ԾP����{ݷ9&*��/Eڱ���`��KA������䯽�M����m���1v!X���u�����}�c�R�2�Yh;Z(�YX֍��FҮ�C$�K;�?��k��-����]j@�`�pg��Oa���萌x�g>����Bep���[d�C�������n�-$U�Ɍ��T�S�F��v��lk����z��߸�f�*P�R��9��������Xpc������m|\���x�~��ڼ:\��?l:��-��Ml�������J�V��*����9֣�|�"��,��mM���+�b���h����]��hE��$,�]�˻q>e�՝TD���T�=�1�4�&��m+�XV�|� rd�����278�בƯ>�~ʏS����z	�3��y�F^<�F�$�O�C��Ν
������M����"G���*^-�W�^eD�0g:��Q:]�ɍ�p/�^���è���7s}���OG0��j俠��ib�`r��db�dk��&u��_��!��vD6J��o��Ͷ���C7�j=�m Tٛ X�(��/=LU���/���|��:!�(������i��ə�ZK����X��Mu:5R~;	iz q9�v
mf��|i�)y��琧q_�^����&��*�!����t(��^R�\W�y~�$筌��99n��(��G6�r߶A~� 48�KJГ�``���	��"��,��#�<�KdNsi��I@EE�xt+�0��Ja� �:c�K���R!K�^�~<$x�^[̇�����S�C*�:w�Q�0pe�d8��ʯ�D;�D8�y�Gﰝ��9�28�����`�x�Hly��Ig�/�DѠ�Hy2`[x�0��%��iOd	X�H�!4֔%�!.��ޢ# �����I�ΰވ� ���,C��f�����e�M5/������'	�P��lN&f�i���q�r��j��l���
�t<T�N���~qT��U���h����&m�sí
�7u���ӫ���qR*ﾌ-���Z���'�~�3�܄�-w���^=u�<��QpM�z�B)��z����m*�`Z�R��K�x���ɂ��>ë��#XD���X�ԑ1��s�i/�KwH<ư�d�H%��΀���w�l�]����2�v�~S�Ce��`�+�!�Ō�e��o�^�"��d'$�ԁ�E���-��+�뗷��{��M��3+΄�fɝ.�ބC�kN�B����J*6*��/����)�e�7��9^-�&�X�W�cq*�~J_���X�+�"ɩ��{7���x�V�k+������vo��%ں�����Y����J��Jk��&�������]5�s�bĂw�=2PgnDi��TT�>��>#	O���9j�#�K_FLU�k�p|YT��&���I��@B�F��㥝���3jZ[���g��E��Hrǚ�������bCx!e�p�Э�p9�U�U<%<)�T��a�����35����"��l�>�K,v_S1���f�I�A�w*�fO���<�p2�M�Ə4�X/F��v*�x�U���5s�;�`����.Xk�ȗP1{����|��X,H�涪��/[��mBG%G�*�>���]O�F]bf�
��
/�񦶂��B�Ҽ�M	Ĩ�y���a+�/o��ḱ<�����&�Ī�ٓ�H|�� ���hi�-FK3m1Z���1�,,�ߔqd C����ۛG��LRr�.>.�2&L�^�)do_��i���!	��:������g���������_Z��n4���ph �rT~�gM��d�#Tͼ�Vmb����u���y��j��V�d|T�����>�K��ֲs�v�j����Vc��K�FoYm�mM����br�����k�ܗT�I���Y9��23>	�.EF�}e��Xu�*3QO�OuY}T>\e!
ױ��;+؟ U]��5b�z]���	�Q�G\Ōj�9\���&��@l5�����wC��M���N�#�zy�G
�͐��c+w�@�6F!�+�4u�BN(�TuH!�-�)�R����A��iidn?���:|&dv�Y��z]`%���H�b\j%��B8o�Kf�g��!�ZH%��V��W��LWQ1����5f2}�*�f��L_MŪY�vz��L;�X�V��\cK�sZ��[�e՘��**�}O+��Pc!�oS��εB�G�B[���ϏWt��a�+F'Q���qг}�AZjj]m׾G�>�b�2��-��G�^l ��~�3�lY�:.��FO�y��[�/h8K�ѿKp�eu����FUPIO/+�Z�K~����JV_k�{*/��^�7{��f"�v�gf8KYA߮$�vUdڮJL�U)߮�8+]�&�|n$�ܔs�Nc��s2c��e��w9aVa��:_i��1�k��S��fk[�Ʒ�u������v��$E�����ň�tl�n����TB0�0V����?%���@������k�հ�#�}�5���N]��X1�u��� �=R���1��:ic��rMx@RJ�0�r�>��C{$wc�T��_��+�ȸ�X9�=`:?-hW�5{����qI�֝b��|�_̴�W�_i��%|����Tڬ���,������H9��cp�WR��v�|/��<�9�sQ/}�4Y��8,�"��;��w�9-��L��p�!��П�	�t�HO�%(ğ��Ô�S�;�@����W��������8��|C��\xC���-x����!B��3�����G�st��A�A	D��6��Ε��3��7O�uO@M!�.� d�tީ��3�k�s �{�����m����o��BD�eq��d�t�o��90c������C���(V�̐�sT=��K���Xc�!6�}����ؓ	qg}��S�V<�Ja\�i]1g�s֗��/ڽL`ۓ��$�������s��/i�H����E������É�뤱����fȃd��Ƹ�M�4�b@�5��H�kc]�ǻ׉�u�r��P�N�[E���� ����烀�p.�^� ��yʱ2�o�sp�d%�� Oע��Á�K��-:s��t�{���s��hM/S����`qV��Iݓ2��B��v��[��"%U�O��tT���m��FP' T@ʫ�^c\��z��~�|��z��ab�����.F����UF3QfM���+1�+#�}� I�J���bst)�Y)п�������oA)����:�m�qֶЃ�ϔ���\���#���:�V5��K�<a��3��*}Te�%3�/^�^w4����
ki��_-M��X����nBE�����:�Ň�����.n�:�U�ݿ��Z%������1�>v��P��33������u�y��xVG2������%\j����gfaO�xO��X1�rȭ��pqʫ��ZS�B� ��'� N*�$�[�v�{���V�a����e��k����Ef� �@ث�Uj�}�Y<��	���ٟ��/?���WN<��9BL�oB<�*ţ@����.6r�-VD��%GG���X��3���ʧfDYE��z�je2����6��֋��2�S3�|GU��fE��Y1���@+��^>1���>D�#��׺���ʳ���wx3>�o�g�ٸOt��N
+����ۺX���Ô_=+��a(��ԧ�F~�K���6����i	���f�s2T��AQ��>H�Xi�
o;�q,��8K�&��^{����O/��|n��o���o��/$���_���Γy��.{;$����I�?��*�B�Uu�b`e�z�o�	��Lo�M���|������Uݹ8��@��q+�m�i	�y|3�j���~'g1G��6x��R�qz��#�I;^����q؁B%���Y.�����B�M���Wc��U:��b��6J�-��%w�����Hw��S�&HFC`�'C~�x!��
4�K	�A</a�|�`� %-�8�ɋ�e�������h��ݵ��7h6����IU��Ą�@�}�����������u� Y3���X��W��WOJ󺿆���6I�Q�+���`�O}6���n�F9���~Q�:��کWKѵH���f���ǥ�:�L�V��s��_\+��U����X��.lyt;��$��Mm�N@��n�*\�5DZ����g�,�>0�&�/:ۄ�zR�o�Sk?Qo���Z�?Y��M]�]x�$�9�����Q���H|�:[��yF���.��_h߮���]�V�����߾�d틳�V�'~�_$�09��?��l�q$�V�����x3r�0EA�w4��'�n��*�I�(���d �`���/=J"y�ݠ���$��كȈ������9�QW'��L
�F���Zh�^�	Uw"�g�3��<壘�"!�5���4%�ǘqE���@{�G�ɠϒ"˰������J�YgG���q��E��Y8%�"�yN��9�u�q�F�8l&i���g���L��,Qibd�+�dy���#��D2pˉ,�x�v����po*�Tb�"۴O:�a��z��=މ��[
�7ٛ���}���]/.��l�8v)�*�)X�$҆Ƶ���##V�0S]��k��5��0��Um�4
\���K�!��\9��('�,��H�o�ݚ/.N�ɫl�>�H����	;�U),2M}�[!Q�����:m�;}�{8����v,)������y���cu��w�{�#�6/��@xvC	��D����a�*]�
�+`x�qHd�EJI���1����ӵ�yZ����Dk���h���wF��S�4�j��y�y����!��<�?�bi�D4 �%��4�ڐ$[�5$�k� �YpV�{��ҡ-R���D[����v����|�٤k_5�x�"���y�jwԍ�"�Q���R
æ�3+l�e+�%)��e���A�+X�^?���vq�n�dVm�zA���4,BQ�+/0����5�h���4���tC��S�߶�Y�y� :55Yʅ��9� #�m�㮁�9�Y?
W;�Nr���B�!<ܙ����X;� P��d��dm�w��ڙF ,4�M稐��x�.RFv�)eo���Sp�;0�m>������6��I��3 �������Fc��P���#��MT�M��UЩG����j�b}���;;w�z�q�����7��O���T��J�W~���]0��`I��l��Ǜ�`��7Ҧ%����,�Q6IݝHUz!�ph%W�n��'�BR�-�b�
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const error = {
    message: "must match exactly one schema in oneOf",
    params: ({ params }) => (0, codegen_1._) `{passingSchemas: ${params.passing}}`,
};
const def = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: true,
    error,
    code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        /* istanbul ignore if */
        if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
            return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        // TODO possibly fail straight away (with warning or exception) if there are two empty always valid schemas
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
            schArr.forEach((sch, i) => {
                let schCxt;
                if ((0, util_1.alwaysValidSchema)(it, sch)) {
                    gen.var(schValid, true);
                }
                else {
                    schCxt = cxt.subschema({
                        keyword: "oneOf",
                        schemaProp: i,
                        compositeRule: true,
                    }, schValid);
                }
                if (i > 0) {
                    gen
                        .if((0, codegen_1._) `${schValid} && ${valid}`)
                        .assign(valid, false)
                        .assign(passing, (0, codegen_1._) `[${passing}, ${i}]`)
                        .else();
                }
                gen.if(schValid, () => {
                    gen.assign(valid, true);
                    gen.assign(passing, i);
                    if (schCxt)
                        cxt.mergeEvaluated(schCxt, codegen_1.Name);
                });
            });
        }
    },
};
exports.default = def;
//# sourceMappingURL=oneOf.js.map                                                                                                                                                                                                                                                                                                               �Á�/���]�'�M�z瓹t�H��861������!��|�ӟ{9��tIn/��0�i��b@���#���}�H�Rt�^#)ݿ�X���/���}�r�$�� �"��[�j���m�A���!�L��l��k�x�G���5�؀TVX+vR.��0��M����;�^�{�p�| =����d�F�a���@QZ����|�KL7`?�>���������~@�i٪����x((����|D���䯊G��>����ם���M�*�_�b�P��0�k�p��I�ʛ%�Q݆v���ЯI^%��Wf+po�`]]��2�+�P�ޡнe�ֺW�0pL'G�{����It������u�D�7(�-�KG�>8��ö�s�f�-C���{{"��;�z��oE�A�+��PH� �7�T),�*IN�J������Z*��O^��m]I��i%�h�6e�I�|%���=n6�"�D�y��No܊o��XM��=cՠE�+����.�j
y5��T�VZ���kŕ�ݤ2��)<�o��4UBP���k�*��HO�m�Yqcy���_7��XJ�@'��{��B7A�'�Fo$Hְ�c�eKʔt�=<C��n�����L��-�E�3�^#uQVM�:F�����r�|.��%wi�8��Q�%�Qi��~�����\<���[�Eh��CdSTT)��u��Cn�X�j��ɇ*8��&q�w�|r��H�3�&��f�s$�_�{��At�9t���N��$��{(�� �8��^��5�|�@�n?_^��N�{���F#hF C�m-���5H|����d8��s9jT8a�\#��a���o���x�O~����� fQK���w��j�������C�T��o��Ä�hJu����b�W��`�M-����c7���#=챆E�_i�oŋp+/x�=V��+���1x��.t�ǋ�4��C�#�(.�쉋ohP��Z�bW�eZR5�ܕqQ�W��\1�l�l�G3ZL�����ёՏ���t�k�xt5+�u��m�fdi[?��Vȃͧd��D�
Q��������sBk/�8�r���ܑ������)?��3�Mf�Y���H���$�"�s�P�����DT dU�L}�$�_jӥ{H�����AT��|tK��xL��F�F�'�y��8bb���ɦ=Ƈ��X<`�33�Ǿ=��U;R�
�\���U�y����~`~n�v'Ý\l���]��zr
���Q��9m�R��%�����!�ɂq�������u��jߎB�����rJ'YB�����uL��xv'��qla�4�� ʳC��k��(�\��PJ��8���Z�����&�̍�45ŗ/"�:KI{�����VK����O0ޛmm�'�y~W��7���SI�g6b���RhO���=�v�)�H�,� ��r��ov�����1ɶ������	I�:4*�������5��Ȅ�Hq���{%���-OL����v)��)9r���_6�r{;��{k�@����3���͗C��^�'7�Z�q�/���d����7#�<y�~�?�D�����A,�0O�;���W6�U��[��N��eG"E�B�T��&�[�fDQ`�J-����?lD��O6�"���I6/���-�i�s����m]��ܑ�+��U�/��ח��_�l(!x*�@�Vc��I8)�9w��Xׁ�����P�ث��'���u�Vn�Z`�����@>"�Q
E�������Ma��Hj��N���(� �?JtP�����2R���(�CJ�L��4��z��,�DH��|
W��Y_&>%� �O	B����)T�ĳ�����c<��.�Sj�w��П��ɛC{�ه�'�NF�*��t��mc,��t��O큥T|���J~:�Sr�WN>#_�?�!��HVF�8��r1���ydz2���L�?��c(�?� �j�f��b��ڳƓ��8pе+�K�w���{��h�XLNw}��x��d?m:q:���ѝ���e��\� ��uHۉ���WOK���x�5��1�ܴ��n5Mk�n�<@��a�i;&�?�|�h��� �2�5��߰z^\���R��`��[�l[�^��O��z��۔j�QP�pOK�����|�H��ǰX�+@R����:+�u��^��S��D�5������Hq�iIhU���e���Q �)!�!�a���?w�Ⱥ��	��+2��h�D�T�cc���X���+�")	���n�~��cf��(�a蠽I�[=����u�s��|�t�}e?'_{��`<�@
��ĨZ�|W��M�'�H��2D��"��X�<p���sL�K���[��E��d�,�����ۺ�Fw� fiew����)�>f3K�׭?M�S�P�w�N=?�m��"A�U �#�<:���#ɚ�8=��&N�',��1�o�� ��-.�Rex�XdN<.CQ]:2�*"�ՌI�:��tDc���Y�|[ϘOO-��ȇ��".w�#��1(�ن6!Kro����0��Y�?[S�\���)��A&t��T�ڂm�3�g �yj���~�0�|���G��D7n�t^�c(�??t�t���xK[�(��c7�cv���1����|�c�v,SJ�ǿ�H���Ij�O�N��v2,2IM��W�v������:���$$(�U�k�(�0j}As+�nt�3��4<���>���Ӭ��{&�f1j�`�P6K鷗�G�>���
��]�e������u�:n>�9�=��y��`�(���l���	oި��s�pUʹ�p�D{�a���˘����	�IM�)�[P�БXe�c�O76>1�����q�q�6���'̷���������UJ�a7��/�ϓM}^���y������8�0�%�)�������<LF���9q7�8(��[���lL���N('.ߕ0�LF\3a))��Ѩ����qrxk|��|-|�651�E�pF����(����W�(yE��<�9>�ج���o'κ�[刋S�6����ǸJ�5�BA�ڋ3�	�Z���C�6��>�����%�jqv7�xF��^�$y�~�~n#�̙��^$��g2ȴ�P�����`g��)��R��h=���v`�6P���b(�&���g3�-�QZj�P4�|ݱ��<J��9���|3p�*��f�n����7B��\w�鬾���lἹ I�^�讒�.�֏N����I� ��z2qViτoH��[\�ב�����f�o3����u8�w0TQ�=���Kk}:6��o˫�0�m�~1��Oh;�q�+s��A��0j&���I.���W<K!����-Q0���fBE��!LR�&�z��z��@(����.�1@g@�k��o��j�p�;�`}����tVk����P��q���nŬTk�i詒Y����A-rC��XA'm��t��ճN�-GA퓸��Ԣ%c������2����#���c�q�Ap� 3^=� ��*)���TS>o�+T=A��f;ݠVw�:.�<:���x�=��+U:Ex��b�WB���f��aekxy����E����U�ëD�1��p�<�n�@��'��j����$�<&�}�F`{k�lJ���0�"��۠�sX<��v��Rl����� <�A�� �� ,}�-���d �s#�CP�Uō�������*:䂦�������:���o@��ڀb�e'�b,��Y^d��k��S\�&ɱ�t������y�\��~�����J��j����
��K�#��!��r�)�s�	�5��u�W�LUux~�����_n����K9<�v�Aퟂxx�Rp��l0�p�����+x���{��y�Km���N�8� n��ޔ����tx��﹐A�	Pv ����ȿƹZ�fc=��a����xg�{�t���:�Do"T�h�q��U���M�+�?�x���K���!�Vg5��2��E�m�=v�.Gc�0�c4�u�ɺ{N_=�t�KۜF)��C_ǘ�:��x>�9��/��n�k�L4��Sm{��I��`�/f .����´N�2�ד��)���Y���h��H�W��D3T�M7C�Ef����U;�5��)� '�nǂ3�S]��jH$��b ��?��\�AŔT���)���g�^1��P�S1�)�ĵ�9Dq���$�^�紱兮���_5_^xH�ݿ�%�zm^g��A��P�!E��6/< h��N;ʟ�ДkJ[�������yǷF-�Ԇ5*ڈ����q'�E�!��3�9*i���_G���2�~���O�{���OB���Ж�$�,|wKz�m�SϰΕ�9D'�L�y6xO�V{]�T4�08`Hy���?ή�6�kAԉ��~���ݟ'�;��
�kٸ.=��
�U?�c)�o��ez���zZ�Z�!؟Q��8[�JQ�{݌�^%m����\�^W��l�]YV��1X�_����p�2���6K���#��Y�@I�(���L�{{
�s��7$�3��J���am~æ�r9��W��sHk�<���6�Q�n�U��0�P��H1�9�C��=�S��2�+k� �E���Mt��`j/;�.�Ϯ�v�f3p;ht��_]��WW��̺
/3�2�.�~�J�10�D�u������l���R�FƦcQ�Le��}�٫����N�L��Ͻ�vXD�r}�`�E�����Wø����~���C��� ��N�c�x��q=P��6���G���͟��|�ݣ�P���OF���"@�o��o~XG�a�[V�«[N��������0���ͺM�sG߆�9��<G8;A�Xb'��O�®XR���t\��%��P��!�W�d�AH!��`T�,��I�ւ�O�	�5�,����aB��L�̫��V��[��Gp	��}�?%Kg]�*-T��Zd�aa����U�6Ъ�H�CԌ���\U�[U���G��?8�h9�s���s�#a��G76ܲ,�u�LL�,)�`��,��Rh�/0n�s63a4�U�r�%�����@˰ê�a�r8� �$:@˫���S@�8�,�C^�F�o'@�.�O���H�I�ZІY���`5�� �����xY}��6Z-�h�h�=4\up�(��� �*x4SXX��^,-�@��s���7�pGG�k=����(  	5�4���p(��m�fcƋ�˶M�d�f�A��*K20J�pM9���z4�-ծ�y
{q3��І�����w��X?[�׏��O�xٕ��mt�3� ���S�O@�H�܌Q�ۭ�8d�h����:������X�hhN�Z�7y��W�(Ā��]�*�v�����T���u_ .��=S��t6�0�;6,_�����e�ĈiI����{����㩯��>��:�Yq���.)�D�Éh�R�1�#fOw�:��%9�Q�"�E
C��ޱ�+L�h0Ml�����:f���Y�uZ��ʃ�ñ:V�D�����]�B#XW�/1C�Oa�%4C��IXR�>��`#�B��V��c�)S��ܻzCj�5�/����y���b�5R����I;%���M��������_q'%`���� /�B�T/���փ�W�}�\���!H�=«�EBM����
�$G����w��֡J���#��Q���q5���C�ѵ�+'��|\ �b�Fk��!�*�˓���P�ח���V���Xd	���l�����O#��C!�p��d�H��tA��+�~����o;!|��C�W�Z���v8�3�Ю�Z��@�ϡ�Z1r��P���UG1H5��Q|w1��k��P���,t+��a�Q��;��TC:�poR�������N��zFn�^�f�v��M����]E��n���9z�8��l��	�t�ɫ1�T�y�i%�h'���d���/$wL�����r�j��N�y�`j��B���LR��P�*|/�ħ�d�P��P^�Y�-��jo�����4]�Х�.��2�.+ �[N��_�2�?W>��3��!���+�X�"�!�{؝�-PS��m �p��DX��Wྪ��|�����i��h�U�`����)N�v�-P_�eO�����Ru�)��(�&�M�����]�]�r�r���y�5<��J��j��.��� ���">�/�.�X�k��?7Pcc�X�cX4e*\T{W�éIG�&h(�[�6vGd�I_2pMP���2��j��h�Cr����9��N
$'��>�Va^!f�e��Mr��e1�G6P����de��J��[C�C)�$�	jN̪���Z?2lvIkg���e��R8��`�`�K2�� H���8�!	��t�KG�,x����1�a��}�rmzD��!�7�*�t�;�L��������A#�bm�7��i�H���'y�W�&R�`"�����<-�ퟣ'�2�̓��~m�/.&S����ʨvH�����ɯ��`�R4ϙWє(:�w�A`��b^m��C�-�<d���`֋a|$\	�tQ�m�]7����|`{3�M����ҫ��Ew���/X;�v��I���j��lM�_	8�p��A�����X��m�O�T��H�1�Ih�cυ�v��y�|b�����hi��J���e���b\��3 ���`1䢈Ɯ�v�ad�)�Ę���ه�"���B��A�g?��c�]���җXG�;�����P���S��(Q#��V����(+��Ds�&n�j^M	Ɩ��v�d��@zT>RC<��Kٻ���.�8
%�"��J9r�p"���7M`vIz��8�8#���:�=Py��� �[	��1��o��m���V��ͣ�h��(}%*�1�c�-���@�-.,��2��[s�iO3�()!��~�M��{ AkS��`�~Xc0E�osʓ0utT~~@�Ԋ��o�ǖ��	9�cJ}֥�����cG��w5����=.<k����G!
1�ֶ�������FU�X��a�
Ь�^i�{eq�v�v]�@�rW/\��+��z1���:F�;���l,�Б��`�&
�C�+-k]<i��̾��D@�#�{���T��y@Z�M���AG^��.�_ 7�c+O���SlZ9��b���O1�l��Ԇ�v�z��<{�.?1���N{�I*!3�>@�g� ^ٍ���W�+���@	��BNR��M�i �Wsp����z{1�l�"gHr�]E�<�9�H{H�/oc��p�T�P��]�'�Yv�^JJ�3�����Wx9��mh�r<b�K�J��ډ�ں���� �6��(�>�ʄ��L 6��mz�'����o���#��G�X�Z�'͏�ʉqr蔡���O9G=������7�wWY�z�������[��*� ����*��$;I�*I-^9�)C��J������ B�\e�:��L�N^��b;������Lw���Ʈe�������ʱ�>�ʘ�ۖX�ڮ4��?`��Aǽ6�/ ��A~]F�ȷ�9�yh�۫���ߔy��#�L(�ER��_�?��3��I�_�kA��
L�� ��Ƙc`�a5g���`o˰�k��Zj#�c ��;u�������BA�o�aD���}A��p���_�H�P�������$���n�|FP�m���H�ܻt����=ȃ�+����ˉM�ͣe��BY���Pe�5n����lR�[-���
�o���+ӧ�=8�Z���X�}�4�ꄿ�ԋ��E���K'��n��E��*/56�$�ۥ���}��.B�B��>��b�?��p���!�����?2cR$��N��O���v���~Ǻw��v�a�L����S�$��G�Q�ur}���OƋg��*�f��]~��
�a�ATdc�T���hܵ)��A���^��_̄��'��i&���n-���d����h=n�,3�B{�S��R���Z�����4MG�Hzb��4��V����,6�d�
��4i��20}��?iT9�g��ܜjuA8?gg*���?�xw	��Arjm�Ɋ�5��ȴ:��hFM���sIc�V]=�r*0'���ΜE�a���~�?2bP"���c;�Q
��`��0�~o��)�7�őS��Z�S>�����d�"ZAq��l�^<W�$����0�dc��0���W� J��E?TS��!CR
1􊣔��4_���?��Œ;sU>��ɬ��B��^xj����ن�$b�a@��g*�4�Vm��j��7asY�x6�������7a���x�N�v�6k*ʳ�;gT�-�Z��ݳ��N@�����xN�-�|��C�h�������5S��sW�|5�W�y��H"0�MX�H4j�E��g�	���5����ܷ{B�������t���6~�X3�O@���1O����e{�W���o=���4�m�y�azBv�q�.j<���ܓ��B���0#Xr��@
�P�q�U�V��'I�y��������,�_������S輸�����9��B�<_R�z^b,��N���if�Ҵ��?{�������ǚ ��$�a�4P<��	�bU,������R���!����%X;�9�e?W<��d�}�e� �_c3�L _~���������u�98��~��"�2�x,$�s�c�[��b*Ô�Y���]��#:#G�%4	���w-�F��ރ/OmJu�V(���I��*�$Kc[ �|KG+ᴲB������4���Q;A���� �QXW�k�Y�a��/Fd�)S�A����f�#�����k���D��L��.��fbz� )_�|��Nñ6�/��G��|��2d߼�U� �"'��J7��$R���ݑ�K�U?E3��������Tr������ �+��?(g�����B��	�M����GŪӻQ�;��.�7�'c���h6��Lx�2��B�V�&'Bk�>����N,8�y��YPQ$<�~�����aa�v1� k ;�U�fF�p��YX���Q���rD}{=�S]�^����Ɇ�=�L7�)��)�!�������zÒ�w�M�+������	�J�P ���I��4�����,٠��8�0�/�	`z�J��ޔ�Y�.A5�-��W1�����WYD0r����E�W ����&�	ԗ��a�LM�U=R��� �!R�L=��\�Ū��xG}Ԗ���S�Y�U��O�<P�$U,�T�>1���r�U�P	"qlݖ�X"�eH;���}E�5���^����w�$�|>�oh(O�����:W"<��敛%�p����^'���/�0:�c��� t5� �����*���Q=�u-��5B;!
Ҡ�ҬBȯч��۱~���O��GĪ���6>�	f��J���x}ÕŮ �@��x�>8 ��2r�z�Jj��h� tʺV���R�v�d�_�O/�e#H�������4�T��Gp,+c��*�������������	�0|Y(R��jv�ش� ����K���8Ī{D�7!�(��%_y��M�.P�����g�����_3�,���c3��7��#<�����ʪ�i;�?#p=S$�[�0հ�i��H��.���}(d��$1��r,����F���l�K�N%��5*��d�^r+�]r	�㸸%�'3��� '�#G��	#����[:�k���+�:)��4�
,9�U�^����K����J�_a�}���ް�]dj���z@����]�|@^�<��2��H���e�T�ҕ���oh�k`�[�j���'=�ǘ��y=(�}9��X��R����:CbyVMD��[b���`Zz��Gp�ePF�B�*��H4
��NO���"�����BwWY\�;`9�\E^����@�����E���ӑ�u$ҡ�<#�Y��q�nA�ײ��é@M���������V 7J
�)|�9����	��j�?3�u)��L3��f:+!�i�>,$�i��6,��D��� Zi�{$���*��GD��?0��'�?����/��؞�j����r�㞇K��c7�*g$?t�Xu'�]1��X�1��j�_��9����<�U�����Y��
n�0�}=��q�����z�k�dC���H.�]iu:��в�]�>N�����R8p����eI��eOժz����b�ꃦ~����e��w�Q}��.��/��F���=¾Ӿ�"�[U=��"˨�EA+T<�Q�q����<�2���'��u��B}3�H���@Ă�]���Qr��,���S�\�]q�D��
x3��� �v*��:�<�!@ktaw�����їZ�3�KFZ�̺�BD����Z�l�K�1�g���d]І��� ��.�oP��i���D�Ŭ`���7���I4����yU.1G��za�fM�^��/��g��� ���EGM7�6�<o�Q1�4_r�䱣Q�Jq�(�'/�L���4�ۏ��<Fp�Ǹά�wuӊ���=�frr��c'hd�Y	���a��Hh�4���k!9����~�N!!O���)��J��A�N��[`�r�l���~*︈lZ�g�(?���*r�+�O�}#�	�9�ʻ#2"$� ����Y�Ty��&���x
��P����`<����h԰�o�ޝ'&�h�z�O� �F62�>��5���%��i"�d�v��&\lp�2�B��>�n<��U���{�}&��6���#Mn�ٛYh̚L����C��s㗕b����w�%s�CRav�6���oGe̓���UE	��]g&_�x]q�p��c���6�ÛE�ѯ���FM�d���s ��+�y����
�%�,?$��,��(� �M<�2v��m��S�I��, ���!Q1ݕV~z�og��C�`[� ڒUm�>ZR�Gr��-l�V�Xy/���o��e*ν@�y���{�'�D��4�T�Ls��鮤f�o��j���#{�	�};�w$3 	�j��Ë́�Xt��k���T@�􄾗v8���΂�����g��$��e�������+1B��Lc�.�!�4F��0C����̖8��Q�y!��yw�8*����!�Xߊ#��,����6��M��s)��M<ᶈ�#Wr��L�P�l�6�t�\ �^>��r�~)�6�\�t�ll1�C���'�����Ua��:<>Jˡ�ģ�e���t�Z
����%|��h��?�� �
;�+��xՀ�R'pz����$yUt3�>}w��(:����v��RƵ��:�n��p�^Zh٥M��̨G(|��	���r<Usq=�	�����%&�Ϭ��Kʷ�aU�"�Ɉz\�c��1�O��F��Ï���չ�z1�ҟ4���V�a�{�Y���qmS�|�P�
�)�V���LAڮ���N;�~������r�U����Æ�]�6��JLϪ�"�,i`�XI�q���XU��d �M6��>�v�AS�9���S!hB���K�K�^�����Ք��"x���<�q�py��G�y�I�}��<�6�"�ֺ��ZǞ��M��%���-��V���?�t3+:��S�굄�՚2� )@
A1A4��Qy[���hT��Z*�À�h�4M�v姑�.,����W����Bz��xЕ8�I����A_
{� �`�@�=�>�ï�#�9���� vv��
���*_��RX�]; $sW^E�]�E�gKJ��ʠ�)�zܓUH�	�J5h�ٝ�ֶ�1�+3L{�!Y�	�JaP��M{�b�2�D������q�-k���+n9��(�7ƶN�?��oef�3���^�s%I�I�lB/�hW)�A�4��W��L��c�v<�F`a$)N$����H[OsLOQ���O��
}��r��U�x��rz�얨�O:��p�u9a	������=�8]0�חjic�֛�N���kuMd��<�ڰ�+�C����	�����!��)��N�"��GQ�)��D�Y�%a���$��Xr�������f?�¸��K��7�<J�:���TrR����E.��JjO���<��b�"փ�����4���j��95���tǒ?M��#�[{�&�|a�U3�;[Љ���!}ك�^y�?��F�C�y���[�|���MBG��k��W����x��A��tA�_Ǩ�s�������^�3�Y��zʜ�����N�6���)�+��a֚�N��[[�nE��,����� ��!��H����������P���+��zOS���:Mg����Y�0"Pd��o�A?���ޠ�k���/;�����n�;����n�݉���z�"o��#)Ŭ��M��\ܺ!���W��$��O�,�( ���l�]��{
1�$�To�|��	�T��i��lpܑ�� �<q铯M��f�Y-�8�ri�.4�a�u錟���%����8��΀�8-'��btNh��ǯE��;QV�!��u��"x[0Ndqs�xq�c�#�������p�Z��^L�C�i*�S��֡�tᾢb�t�����M�%�l�B�]��pC�>���c]��6ܖQM&��o�Y�#<��z@ �p�Ty�$.� I[5�E Q��a&ES.>X��:Y�f��8�b �ĈytFL�pI�Ɓ��Ċx����Y������3�Cm��@�{y�>��E���g�� 7��؟w8�L� ���h�D��M��6R�	D��Q%� ��ٮ\Sۗy� U<:��#�HH{f/R�릱.>~��?����R�nt��d���3V��rw���&�HKܿ�|
;Ƭ�Lѭu�#�fH�������2��^��q�ů�wu�A)��,Y�ǵ;��?�8�Vm��D�ox�t�#IFD��)8�3���ɗ�a��/Y8&�\'�s4�J��n�K�T�*(�����P��H�g�d�c�T���ͣu�>&Y���O���>Qjsm&qd}[}p����
���^㊦^�&��-Hf�1����2��.�MO�6O�j�휵Êt�`hn4��,�|��Nn�<���XT|��1NIw 5��?ϰ�Lg�F�=K�E�}?�z��M�� 73.Z�Lb)|tD��|X\?.q�u$=Ҹ36�g���4��� ��I3�'��h?�D�*]+r�81^�n|���`�U����W�����Kћ�I��F�Q�_#�U ��j<�Z�?�ߜ(V�*�Q�<�p�>�F؇y�����!IJ���Ǉ��`d����iN��o�r�����.�d�]b`�`�����hl�6.�P^&��`|F������M��(Ja��3!y�:���t6�Km�Ĭ�m�Ĭ��`���At������I�Du,A��ѽ��Vb�%�Z�<����Q���f/�s c���<�8��!.�m�\�,�༔�8�`��6@PI뼅�Bx6��X�Ş?���~2Y�0�c@��x��&���׈��R.��ٓ�M�
�'��>������b����hYٯ�GO�>wS+�	��"G{�=B��Ϟ�|U=R����Kp��T��ְ�}K�85�2�_��+��FhF�8�A��u��V���r��������螸M5�2�ʤmM;A N}�����{���	?<������� s*�Qj+� ���@�Yc�G�_z%�N��h4�����qD<'�Y�R�'�N}ByFk�"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const error = {
    message: "must match exactly one schema in oneOf",
    params: ({ params }) => (0, codegen_1._) `{passingSchemas: ${params.passing}}`,
};
const def = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: true,
    error,
    code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        /* istanbul ignore if */
        if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
            return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        // TODO possibly fail straight away (with warning or exception) if there are two empty always valid schemas
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
            schArr.forEach((sch, i) => {
                let schCxt;
                if ((0, util_1.alwaysValidSchema)(it, sch)) {
                    gen.var(schValid, true);
                }
                else {
                    schCxt = cxt.subschema({
                        keyword: "oneOf",
                        schemaProp: i,
                        compositeRule: true,
                    }, schValid);
                }
                if (i > 0) {
                    gen
                        .if((0, codegen_1._) `${schValid} && ${valid}`)
                        .assign(valid, false)
                        .assign(passing, (0, codegen_1._) `[${passing}, ${i}]`)
                        .else();
                }
                gen.if(schValid, () => {
                    gen.assign(valid, true);
                    gen.assign(passing, i);
                    if (schCxt)
                        cxt.mergeEvaluated(schCxt, codegen_1.Name);
                });
            });
        }
    },
};
exports.default = def;
//# sourceMappingURL=oneOf.js.map                                                                                                                                                                                                                                                                                                               �.�P$�xQ��8}��+�-2���o����g����[ܠN���V�6h��-��������<6D_?h�b����㦡P����O��K��d����k�8�|�%��Z�
f$��h�ǰ<t�|[Z�S@>A��?2Gj�W"�%��H}WI���h�MR>AC9����!�m+�)������f�;����������d3.��dL�Z�Or�-�-�Aς��&�R�^�e��K�Z����4�-bM.��(;���Ϳ#��Z��[�:��Б?h??r�U��砉|kk�X�,+�MaŴ&j�
a���yW���m�A,D�*��N���,���&w��!#��?fѥ7l����wz�Z��	�� �bcP�"4O�9*)�ڻ昄�K���v����y}���F�c<a���x�>I���SM;������G��ɺ���y���m���G�l0��<>h ]p�Q`�}�D��%�Vyd�� �h�����1�޺������:q,��\��8�=�\�ݝ�{�?9r$�ό�\I�Bh����m�m=�=ZV���5\�+5�#�񷘏]������*.-�e�Һ7/���cWz���Րry��Ԛ_;����6+� /W�s����x}�_܏�m]O?0���Xh�u=���ަ�ΝoZO�z�2��Lm�����f]O��90-���n]O�y1����:0�a�v^X�R�z
�m��C����c�3(E4��!�#25���9V(���������+���!eQ��֕3i�yH`H�=��0����+�����}Z��H_w#[T=Ey�kb[��N��}�֔L eG:��J}MU�k��7ERx@�'ѽ��6���-��i���w�WIj�*�&�wlc�{Մ݅�P�{ݤ���&��� y˔�����Cn�1^2�1g�DvB����Rb^I����q_V���꫋�e���ز*�e�p��e�=�/��^n��.��#�q+B,��DG��{��ț��J�Ӽ�Ρb�Ͱ.�q��6�Z[7�ӿ�z���������c��꯽f�½�7�g�/�[V_
�'�>�,+J3�WB��glss�l3�ƃM���6��Mq��hGnf]G��55Ċi�a�	6��i]GC��u�+ۺ�� ����:���#�_;������1vV\"�ƅBqI=����I{UOc�:��B���v9:ԉK06�3>����u���w�T3|�u;,����k(l<Ӭ��'[��������y����{��/R<sq�pֳU�g�pd���QR����'Z���p��Q�ж����#~�ѯS"ik�t�W�[�K�]�ƅj uUJ�tlU���˦(�M��M#�K	A9\MsH�Ww���k�$GН�U莌�ȿu����2�x|Kq�.�v]ď��H_�\5F<�	��>:��(��?����}���?��@R�PA�t~E����l��L&m�'dҦ��&�s�3F	�#Kd��R��l�Uu�r2p�L9o0��a�H^;�	�-6�x&몡lph>�ϰ�� ��?�u',{{� 4��d��#Yҁ�������^!���ʐ�Z�����^�������d��d��=�U�������۽�/���c�a���+ϣP2O!�=���< O��3�(� ����6���8�鸜�>�na|l�U���dغ�񞫔����m}��6�i���J�0�c���f�ӟ�	�C&��U���J��F<�Ob$y�6��D0C��x��K0�*Ũ	�k�k�PU����QTp�M��=����h��ñ��25eF+gnw��J��9<N�Sx3�r���N�4Ӕj92"�c��1saOě�<���o�}�>��9��}���[��ַ�����ǰ.�]�e�!�m�a��2���a�b���	��B��$�N&�#Z�6��t2�I�+�!�n�Ý��%�ڏ'$�ڗe-�3j�>�F?�g�}�Fjmy����<! 46��������_O�T�s�)��[���xIo��ӄ٣��2J}8�����\�Kj�){	3(-i�M��[x�#���i�niq��>a�`Ȕl}Ȕr�������b�_Y?5��7�������=��K�O��b �Q�d��1��R�_� W���ѿ�M2E�t�q{�G Q��X��P��	>>��"0c[9��[3Ú��8̨`0�������� 3����Y�c���y�¹,i��?`��e�Xav�7'O@���o�R�k�j#���7`ID�#��u��
���<	Ϲ学�z��/��x�}16/Ӑǹ�#�2��.�6�S_/<�6�Q2<���v՚���i�Ig������]�9��Z��=kpf�B���3�K>a�����SɇAO[�g����w���r6�(��j���<E��ni~b�b�Q�^�ɯOC`�!0z��M0Q-7M��oAo+�{�{�"�8�Ʌ.x&j�5}�tJ>W���$���9���J�m/�{Ϝ��#�s1bՓ��M1ƴV��W�b�aJE�a2���[�">��c�cG-� o��I��rAt�� 1�IN���%0�y�1�\��cU��^\�������i�S��[}�ూ0�a\}�ƌ�&g�C3�^
2���aŐ1R,�T��K/s��U
E�A��tS
�A[�jS�X=/���b���jy��r� �6���%2��"���]q���0z���o/��w��b��u+�m�jW��@���Ǡo�AO��΅�����$7x�f<U��4	Ybu��V3g/���p3:ų/8޼,�!�uY��f�e��������k��:"f���'�1��gr�|aV�3���N���X�&C�����&�9�;��b�����J1��zy�pI�>%	����>K?S�0�L�%{��j
�Jv�t-��:M�k���_#/���يA�O)i�P���n���$4b�u!��X�1�
r�	7���%���
\��R�1IhS��Þ;����!o�Pܲ����3sq�;��#7��J����l{��~r��p��.�7�e�8F��N���}�����;�t<r��{�v���AB~Nw�v��M�b��`����$ZZ�h����ok��a?uT�a��MF��νHAi�=c�+i-@���`����ܼ(ٯ�5��E��O����27�Y83N�3�d>�4b	�0��P�M��ٙ�9�]E+!S3k$����3҅�;��4e�����#Յ��ɑ�^2�����J(�Z4D���͹��r� /�,��⢼Q�%�ɉ)�n�#�Մ�k/j�(���3��WS�E�����ݶ�W���'�av���.I���nXT=RL602���yX�3P�ӓ���Wu�8�� d��h�ʣ3�0�u����� � a\�ᢃ�y�uȏI��`0�iL�N{�D��G��+
��y?cD�� -���6����J~Wi�UlJb���R��ZѮ��ꍗy�R|h��Ck�Q��V�5���-���Qƨ��4�IҐ'��U���O�����eDF��Cc�R%ȯk�����@Og���o�]������w#z�(x�jT,]� � h�|�����'��3\�e.[ѯf�a��&|��Kx-c9�yxeɑzD���-��e\����o�RL�"I�J,nk�+���6e"�Ӹ#��K����� I3��ȣ��e=�[n�k@�#=���v�1�N���^1xY�#(#����w��/�̌���h�n���c<p���l߬̽o*�W��v
/}�ݾ,�.c��n���5Xth��	��h����uM����vM^��W�k/]7مk-�cߣ��v�.��%�]2�L�;��?�%���c�;���]{4�7���W]$�X����R�O¿���g��~��b��	���������`��lb�H�x�.�'z��j}�E;��W�Ī�aFKw��%��̊G��� V��	�v��lK�.q�n��XǺ�Y�Nr��]\<��t)��J�I���d�n�	�/M>�فU����ܵ�V4g�
��n�r�«��+-Wwō{�6����F���Ш��*�[�DWS���4׹ACZ�}%W��G�7�r*���ku<�}e[\k.���%���j���5Y�8	�g')��&Z)f��j���
c�0��H��*��-�Ū�Â� �wM7֐��1zf��xHm�hۅ�M�]M#�%aC�Z������],iW0U����{Xþ���t4b�		h�)ϟ�I��8�7ҠϞ�s�Hd{��2�j�7��mū����,^�*d�$6�8�L���t�6���]D� ��m���pDE4��`�0�����V�4o'D9� ��9�0k��^�j�d=3�Zo��D ��@b�/��=�rk&�p��*���3�Hk}�n�.�\�S-!�Z�A��?Х�].��+ Yn_�gY=Ϧ�x�$tJ`$23S/�q_��K�\W������<�_C}bm��9f3��k������y�80�]��.��~�z-��@?���Z�V+�&� �ܻ�h>0��Q;R1&g?��+�������=X�Y�y;�CK�G��[}���o��R�b���Dq�&�<Am'b_<�?�}�O,�Z��;C��:q�G��Us`4��4�c����Bǒ1m�A����N�f<�@�؄]}#^'/����|Ύ#��.?���h|
�F�[c�)�UC�,�V3�ճ��P&wͥj�����?T,E{���Cٷ�UKl
:,�&��Tk��g|:1˥s���[��Q�ˑ���\)��y(��d�`��ݚ�J&K�Gj��8(�g��ʇ��:5�=��^q��@��!ܽ�]���{�y(�^��ԋ-�%MW0Tct��ڷ�PG+��Tg���y��ɳ��t��x�f��`�-�F:L�i� �f����:|�Fc�l��kN�:_�	�4�������iz��x�����������Qhx�Lf��~m��|��.�Aǟ��<��ׅN6��rx<E�Q�o��ˡ�Ӆ�A����S��
i�3���a�m�&��~��J�)_��A.��K+]� ����[�����"���c)t!Og��V���~�MK�]��'p��y��Y:�e�d�1�$��z��+�j�9��N�7O�6���������:|���"� �{$���OQ�'B7%6J�~+�a($��������c ��_�$y��|ʄ��Y�?�o_>>�[�WR���E.9���ѵ���u�J|��艈II����o���|��v��#���~$3�*��ޔ��hti;�Ŀ����R4D��zz	�����xדY�pK���z���@�Ɲ�P��7��e$J߿f6�&9I�!��</�a�2z�6 �>�+�4(�,�E�lo��p��	>���śy���?�_�ԅy����F	zc�I��s�����ԋ<��.~�S+�`�y>�X6��~cF�!ɶ3O��{a>-^X�\#9Ï�������Zۄ�L"P�~	p+����9��������j��M�*}*��9�n�j<5r��NE��\��;�VP�w�N	:Y�免���̆N������k�"�~{!tV��N��R���1y����W���ҿG~�Ҋv������ɽ������o��ğ#���CB <���f>no����Kh�h�����p?�C�p�:Ǉ�=x�b�Iك�1{�'���w���s�0�`Bee�)��p�-�,�B�kZ$��0;�WD	`љ4ZW;?V
���cU�7�4��>��;L�dn.�'�y#�Av�N瓷���g:do�*}Y�Vc8�ќiO=١x��D%G�t���h��g�8�����Қ���Ji/�c�pe4Y�G���<M�g��?O=[��
���+�����M���#؛����.E3[ۅ�X\W�Jz�`�q�x ����B��M��������i#�����W=�{���TK6��f�>��W��9D�V,4���*4z��6�m����j�gɔ�ԥx�1'N�=��&�=u<'�\�0k��,��{9������}S@���V��[{�����;�¢z���}�������eY����h3i�f>������=�q����\f�N�@�r����ϡN���S+?g@������5�K��Q�`=��K;Z�J��=���h6~H�/�B���\^�shu��}�bn3����92R߃�G/��zո&*+�$V����Ac��6����X�4.�|�NyN�-�7�]K��1A=�[�~?���X�(3x������Ybլ�YC��K%Ǫh��mN��si�=?�&�]u�v�@@�l�e�ݕ�'g[ی�u�x�������m�l�{Tv�YEu�9B�Dr}.�4)fS�����\'ڎ�)�*�+-ŏC�g��yV��:.9GK�q�1��O��%�:X#� '�w��\�H�A��Q)�W'%�f����
~��3�3�Ҿ��L�%���Ih��X� BH����&l0��X�;|]Bw^�'��>�?�W����d��|�ɗ�E���繤bh���8HCbR7����u�29SIΕ
�*�Vf�P�!���?���-���E�����;q�JmW?��WB��S��I��(o}U=a���S�e��QJ1��/͋|�uF�$����4�;�v���3GGF�G����H����K.O�d��8	�s6\
��/J.7KȰ�j��a�'*�$���ry@� ~�S-�O �l���QRI3RLr��P?�0�=:�hs���Њ�;\&����6"�AP�<�`F��i:A��Z��X���IVW�ONwo�j��L#���3��������d�q罊t����t,;�G��n5��nE�Zzw=u�[��^�/��������1Z��?������=�
��_h!���[`'C՞������3�:�3�P�2љrB�F)9$��aU�GW��-W�޳jY�ʃ�<j�w@�`P.�Q%x��Nz��,�4%*�޳����EGa�3t�%%�t4�1b5��Qo���@qZ���eD��?����&*�S?�s���H'�k�����=���3S�/��_?�s�\��1��o)�f�n����˯~�?����?��2���9~���q�7��v�C>�(��Kb��4�������x��č�Z���1���84��Z��<�,;?�+���>��끇�g�"���Oc�>�����@�	�e�.!.)�K8�%cS``�\�K��K���s�~}�2����oTiq���l�����@�`�T͛�������,->ϽG��k������v�g8��f,�E >I��㟼#��<C��P�w�Q1Cy�����j�x�Ԯ�2�̆ɧ&�y���q�t�{)}E��	�9��zD��$"�"����>"Ǌ��`(�`�^c�� �sc�ّ�8o��a!;�Ҫ�l��ݘ����g�,į��g���-�{�6�k�4���T��(�y�;��KCo�P��{��;���=���q�Q��2k��k�8;��IJ]�mo���tQƝKZ�jC����` ���A�3���g� �Y��\#������ܐ�����7K:M����EC���*i��Lc���*�L0;p�I���Z�E%�m���zԋ��@Cz��V��rF��̈́�,lt�ݢ���L���0����x!�`�i� �*�%��}"�F���L��x�|A*qc�A�{0ԎAW�@%�R��X���w.�Qy�nzLp�!���A/�#"���n"Dz%`&kQ��"�I�I`Y�L��aq�[W8�, �D�Ε[���������$1Q6<���׿���3	��|�s��3U=U5տouuwu���f�z�q�˦�v��z@�v�`9����X��~ړbwFC2<5�[EK���&������<,O�=�\%�Z}|�#�8��\_8��TZ_K��-E��>�˪�L�"����7��y{x��6R�w���`����x�R��z��z�-Ey+{�gT��J�T7�e6y�� ��R����PAz�BZ���I��1�>(]Q�x�z�EIuS���|��lC
�n�Cٗ�����i�~t5ą� ��%t#�?�=�[pE��<�^��j`��c7�n�oѿ�A0c�e.�C0f%��	�"��$��3�y���7�o���*B��6��x�����tW�ɮ����u�����,�jY��;���`����.g��uJ0�>j�y�n�o#Ψ-��c/#�����zex�N�g"������aOs����Z�`��v��<ᬡ�K��o��ɜ��D���0��OM�2�h��z��MB��Po��7���>�Wb=NP��=�Fm{8����֘�%QN����*1>��5:�fdЛ�єE+�;����3�8��dم�]���v�]���ؙ�%vS��$����ڟK��nk�1J����&C��ݟ˰�ۊˆ��`���%/��f����x<��n�3$��b�<�s5��㞺�"(���^ߩ�z�ע�O+�N;d ~�����݋Pd��Y���ifG���|c ��j�O��nt�N�3xSz��qH�$���b����׀���%���d����b���:c�l;�,M��?�篸q�{i/Iff�#c��D��a�{-��ObPFM^�zQ/$j�'��W
v��r&XSF�I�ݝ���y�W"���#]��~��g��d-�G���go��Ϙl�t�r������(��a�y��_Ӓə�p����C{�`n:樯Ӽ]�˼�$*Or�1���u���jվ��v�e�{�/����d���sг|�o�d�%��t<��/� &��)��，�n����سO��|�ܿ�{���[�]1��H�n��V�պ�kt�t��J(�|�i*�u�z>d_B;��Ҭ�ȗ�o 蕍<y�<���n�d�\����u���X2���ɒ�ݹ�m���Q�	�=;�Kki9�#�ڰ�*�oP~\��p~&[�����#3��J����@e����m�Kf>i��+��R�A�*��'as��M��PLv��.��-|��mƣ�)��p�F�������>��w��[���FO=�}�j�=s��A���M[%VD�����L's�%E�Z�Ы���\*˾���(�gd$��sF�W~B����m�?KS�̍�7���.ד���-	�O��1��bv�����NI$���]_�nM�ݼ��Of�e4�z�����d�k�n�K��1q��;���=��t����ڝdq��y�;������'t���!�{s� &ǳ�*q}��3@}>�L�����uŁ��؁��gبi�fE����3<��хQBv�9}�Չ1�V
%�g���Y�ktUh�7��q=X��tj����4��~�lu�ei��ԟw��m��$"����}�Ա��]��[�Z�<?�c��Yb�⃁w��y+��l�q���%.���+����
�k��ٜ��^�]B�Ώ��k�vU��!+?�%q����C%�'E��IQꎣ�-����74�
�e�b���|�ū�� �ܧiG�5ACfgm�oޒiu�?
klxVШ�0�}Z.�F-�Q}0�e�*Ũ�h�YE�p�7�X�Z��BTɽ$�
�x���� B=��o��Ӿcy� �,��l;�GoZ�\����{��~�H�`^6�'ɯW�J~5ӧ��=�z����pR1�WpN�It��l=�n%����3��{��Ombi���$ɼ�gPO�y�H��9|.f�-x>f��ㅘ8B�����2� ��}�gHr)�d�C&�ǫٚ��#L��?Mi�Fm�j3B��x�4�7C�a�H�¯s�LCE��E�g�3�<J�U���}&�/�&�o,?ۜKJ�*?���srK��}�?g~�w�y�#�n�'���?�9����R������SM���:#r鹯ri_^Oq
� ���� ��R������&:�����7���c>1�O�t3d
��� � �f\0���F��MI*�;��ꈙ/� �����s�h!�`�syG������D]7�aF<�}Ϟ��=ߟ�rHۦw�����z�|Í��%�f5}hh������E��(�����4�;��1&i*�a�;BY@�5�Y�������\�o4����%������0�03�1����+ ��hlum|��_�a������N1������t]���ȑ~�Z�Ic~v\�U32�`#�M��6)�P�:a�I��^P���kt��C�f�����I��q^��EA�K��0���J��E���W x<�7d�ʍ�+xz,�ТT��Sha,�V��D`$�w����F����L�:X��X�h/����5�j��@Ar��gu�3 џ�g��JC:�Ad!;�X!�![!2Q<V��B~o��,��K���K�BtRo�X��
D����0dH�"cȑx��!���Q1dZ;DÐ���!:���C��;v� ��7"ѐd5"Ӑ�\�BC*�CT�30�KJ����b�^�S�_WK�����)l!j��9��O�����5c��\0�鸤�g���F��@�2ഥ1��3B�����q�Q�1GG��Di�#�Pr��5��9#4�q+w�w���ׄ�3fj����|�Cc���=�;b\?��KO~�����&3+��Q~
'Zف��E���͵斴&vC�k��Z s-[�r�*�>�.f�KN��Y��{`��}�B�N�0#"�Q����[�i`��p6�8�U��<�&Rq�"��*Z8��.>A-��#�ԴG���g�'�0UL��P���u*�)���/�2��/��%�?�
�K.��/0�8��Bg��:��z���_f�e�_v�Q���m�2�O�e��O�3�2�A�Y^��s�m�~��W�~ŭ_Ae
�_��+L<�W\�GX�ԯ������/T����XÀ�a������6r�E*�Q��JuS��W�T�JeT�T@���n�#(X�J�ɤt&ZT�����x4ƣ1�ͣ�R���l���S���);�x4�рg�_y�w<�Z<:������Q����6��x⩀Gw���xt�с��3<��;��O��O��@��'`�O<�\<����' <Ǿ�y��D�#��~��A�J��D��&�ŧAt�x-A�<ī6�<��;����x$7��J%�G�y$�c��<��g��GB������G��l�ȌGf<��GF�2�#�<2�SQ�ɳ�k�GF���ku�Ƚ�Q,��(�Gq�(�T�y�Ga<v*ʣ8y����Q�G!<O�8x�����xTƣ�yTT��<�ͣ2;�Q�<n�xT�Q	�[_:x���h��x4ƣ�y4T��<�ͣ1;�ќ<��GC��kv�h���-���Gw��T�yt�Gg<v*ʣ;y��yt��	�('��;���`<�p�Pi��	�<�c��<'Ϭ/-� �ό&O�w<��xy�a��G�RA�x����T�G<�l�x��b���i� ��G�x$�#1��#�R��l��X��Gr��d�H�#U����#��G�xd�#3��#�R��m��X��Gv�4��yd䑫��O9y���(��xƣ�yT��<�ͣ0+�(��qy�js��G��j�Ge<��GE�*ϣ�<*�R!��|����Q�G%�?�N�w<�ţ1��hn�j<�f�h��J�<����ͣ!�F�>w�h���-���Gw��T�yt�Gg<V*�ѝ�?�6��<:y�ip��x�ݺ&h�%g���;,��9r_��k3���<Fx�j���؟<���O��/�KS�Ffn�^ ���������Z���l�U�Z�-�Y�?�ׇo�s��T��3r�F�N$edu������n�����O�ڲ��e�L1�~�Z�a c�h��;�4�bŸ�ј�+�*Qmgc/K��W�gI�򊏅
Q#��<�i��w2jd�V{�w�+?�l��lq����M���y�����f����4���V�v��T#2-MkM�|��7X��HmHv�h�>���z��[��Q�л`���SQ1�lg�����Ci�20J���{+_�� ���EAh8$��-?2�Q�p[��?�ջ�h6�Fĳx��$���!�����y7����)��x�H�)���XG��P�fӥ炨� 	R�w��L�IҦ�|�㉷��B�XM��Q�mͭi�+�_���=�?��|�`g~�����.�ɷ�|[��<���/�9N��aM��o�~B�.��|�N|I�gA���(���)�_{9�c���}Mg�DZs�p�|܂p�W���W�Zs�r�r�MQp�s���|���'V8�ŉT�D�b"�1��H�L�J&���C��=��]p> �Mp�����s�9�e�_Y���Gѿv-�c֣�����% �OY�4�
��ʋ�ǂv�oH��E�
���Z5�f��,rh94�v����t�'N�l�,)�1S�ꞡn��P�I�wL��������E��a�����2<��lk#�n�뾝8�o@"M������>�3 оӮ�՛�;�����Hx��͂ĻoRk�yf{lM���p���iK��������br��n��	����YE7_�R` W���ͱ���@+`R�/|]^��6�_�"M�b6���h	��x�3�+���D�mw~Zt<˄A�:O4`Pb>,KV��h�)��i\׼�o5d=�`Db&,�ú&�?��C&`�l�	7��S m7:Ik}؋E��C5�����_Z>KI2մ�훼�� Jۢz�� Q�~Ӯ���H{����s��抨�r�1Rʨ�B��چ`��X�m��A`����n:k����k�i�GbQ� �&��M42ӊ
���u� ��uV���)��+����$F�,��>,r?DF1Ra�{����	#U9Rf��!�#��@����D6�'1:�Q=?�L%1Si�dCL��M�'@�+f8�\�GF;�xX%�[�)�چّ�����%����Q#7u.߮s:ԹL�H�R0���W���;E;=$��!���&*�Bˢo��O�#�{	�K`�O�Z�mS|���w�"������2�ן��7���Z�gM����E��	%8L�?	�x��KB��o�"�����M�'����z������_'�?o��q|�r������s���&����+=����Gg۱~�qbE��w
(
�_��o�g����ob=�������wzn��tc�M��7�^ף�N�rKO7���zx��#��@��H"�Ӎ�4����/�G;�q�e#��1�5Q	3������$��T���7È���u�i�n�#��$I2�5귿������範�����(L�X�s󜗼���-�[�n)��ka��
�[�V�V7�6E�/�[�����0m��W�k�����;�ȞT<E�0��[�D����h�d�����lp���2��W�a~�_d~��u̯g>]�����5B\΢�t2ӽ�MQ�r� -����,�|o�����M��-皀`s-z�����n��U��m[\��2����Y=�*��m�,�|o�����*k��m��*iU��Xuua(�0�3��:�D��A?	��N6���l���j��I�	B�%OvGݺ�Mt��D����go�Z:-moxh��F�R�b���*�'�¶R�by��"�J$��BZҖ�)�C���EĊ��J�񃨷�*W���_J��f�// empty
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       �4���HB��"$��])�?G8�)H�Ǐ����	Hͧ.����qX"Jsc��cD �'9w�t&���"�[�c�,�>Id�u�t8{@͂�a"j��?T-��~�i�NH�� �
�Џ �Ӑ��ʓ��3.�@��i� ��Uh��I�#���զ�Mߒ���^�+sE�l3��R�!(ǫ���֙iӽ�+Z��з8�7�� �"�VԊ�ZP+j}����D�s����%�R�C�L49�l$��ǌ�9>=�v�\M���y�$d��FӀ��X<����G#�S.���TS|�v�:���bmb�G�{U�G�����!Lfe .kz:|fL��y5>���9����� 	� r 9��	�}�m����s0`����漎��6��}׎z&�|,�v9jiw�e���/:1�3W�^�U���x��1Rkr<��f4s���Hv�f�Q���9��O�-�����!�	̔P[�*%L��fݣ�1�^��Ξ�g�������MOS�Q�� !�7��N}"5]�5@���V�������F��|�vs<�
���ş��p��A  3�^K��A��f��?�w;��5*�A4�{�р,pOL�m����w�d�8
c�D!.У�u>��:����n!c�E�t�q�B���%d�ψ���Isgуa��U�QB��L�-ǁ�9�͉`��O����m�6��G�ʹ����&�u9��k��-ϒ�½����y]�-HD�/����'�/��?9����3�*:�㩋n؞�r�i�ϜI*�K�"%���U�������	V�:7��2�!���xU�H�Ut?��/��N�,q��	��n���3WѕӦN���	�����G���яc�v*CҐ:�9������!;��
��$Ǳ߿��%�|(&E�`�zOsfL���49���t�֌v�+��L������{#�v;�j�z�ܙ�Y��f��XT��Re��zn��קس�R��M��%>>���G~�c��Fa3xs��I�R���*LW[-��)0�Y|n|����?��W?�����h��S ��[�Zu������6���T��tn`r겐�k�Wc[��Z4����~����q��qe�􃵵=d��W=����6E0�h�*f�i��[�i�̥���#̱���O��_���m03��O���.e�W�r�}�40�Ծ�B� �&��y�[�y�(�W����5��uV�T/��FSVWrm�1���.����`���R���ך�$��V���
0CY�y$�ZM��L�,!J��QT�#C�<�U$���S3�<�yHR]I�E��
��L� �\:�ֵ<.=��i����Zv�6xb�sb��ג�<�فЃ����Q��h�/�k ��S�c��/��>7Uq\������%�J��a�J&J�e�B��G�ZQ�^�%�<���29z:�q�.8'���0�\@� FDN����\qc��ՠ��Rܨ	n�s������R��e�����X�A����N�/�'?0C`�G���ÕX�c����_V~(���(�ΊȢ� ���2���S?�F���b�M�U�OU!�Z�0B+&�?9����z|n�!��e����j|*���U�a����'�&�v�����ܖ z]�0�#��D�A���0�bE�">P^ ��Ί�HH�Ȱ-gdz7�ciy!��m�����OG�Ai��S��[v0	��I.H� Qԋ�� �L����q�D~�p�����2������O���W������D%mgP�,u��j*U%��}������n�Wж�yL�4SEM���36�y�0�gOsix"	�"I��:v�@L|�Џ���lwJ� ���;��Q���E���@��E��_D�m�o���je|��~�u�����f��g_�Hv��,s�R��d�>�`�W�h뉉��-�K���K8��zN���+��P��)9������x>��B������7��& T�]@n5;��k��f�B�<wё���zlOZ2����ù�h�)����J�k�<_M�:���D��ڒ���B�p9�E�NH�n��(��9fIO�3�rP�1$��H֪Ɍ�D��������\H_�]. y�!ȁ���	���6�"p�򡰣�7�"����k�����_��J����k��6�1�����M�2�u��x��������R�1�x��
�5������y3��L*l�~<�y���9� �Y5�S>>��sN��qg >0��ȓ2�X�[	>&����#>4��;4��;��q�=����/h�}6~e����`Ձ�lUq,��M$�g
(
y^x�00�ռи�1�S�g��7O`i��P-��E�t�~�;�4iqd�'�*?'L�"���4<�o{��!�Y(�7�Ҝ���8%�+�w��8qBn��+\{��Kۻ�+m�~�G��&��wÅ�(�����?AZ?�M���GՏ��}G9�~�R���_�d!4������tf���P�a<$݊�}��u#6���n�Q�\W9Z����9���F�Auz'���E��[��[�7�}���G��OA}����q|���{[������e�0w���h�Y�V�}K=��O�d��Z��{�r�2]/A�1��AC�[����g�rg{�<Ƕ��/���RՈ�bQ�z�z_�i�s��R�o�؊=l�	�Ca�P����x�_�n?/�x�z�<��Z߈������w�2��w�a*�����n?h%f�þ���!�an+�a��CF�mHU���O��td X��`wԿ� �U�oP��������~���K��[?��I�����Å�w,���o�����kt�x�CB=%���D�W�{���F���O�SP�РH2���Bl�I�vQ��mp��[��.Y��;�#����y�!8S�.��y;n��ٱ��5���n;&C��v��ykA��!��H'5g��?4l�2��B|�!�/�/<�-���v��_9m�� _��%Q��ǰ���������WFH�W��Y�V �"��a�����m����������E���k�?��0���7�k��N�����J���k��=���
�_�W�9��ځ�m��o�k�?��`�EK�W�9������������)�'�<>"g�l;���O����Y���W�ks�Z��_U�=�7������T�G���(T���d�lׅ"�`��م"�`����R'������v���ChJ��K��R՚�7�VpM�}��:�\��"���3��Y��s�~'y�r"je=��zY�L�9�?x�]?'8V�3�γ�ϓ˾��C�'��=�~A�΍3��
�v�����-�}��e�"Nk�,E�����mu+�ۛ	T�y�,>�)�u�?�ڇl���"V]��P�[�i��l"�OW�#�'1�����>+X���_��~�`i������,�"���ރ2C;�����\��~�O��_F+9E��n9>}��C�C��
��:��:\��g��N�d�=���O� > I�o��@)=11�wy��vv8��w��ӟ��v0����Ic��;��(����&�|����rӆ��?��n��A8�7��+�?��>�T-��5�;�>�yF�>���}�f}��J^�Γ��}�B�s�U� h�:���{��� }����I-���d���X�G�ҙ	>�a$U�Hl-���� �,�{	��%;��{!U�s��#;s-��J��)۠��F@y�~=�~������}�+�g�O�ϕ�uo���A��m��LA�M�r�i�F#$W)�l�=U�!�"7���0�Ö����t�%�h�Vi^v��*�Y�Γ����4��<# �� �Sv_��C���,iy�oM��M(�?��t	=�9����aOΌ X��K�;5���LyX�խ��ڢs>���ȏe𳤢��c���֏�~ק}���U��c��?��K-�O7����U��?�
�A��n_��(�?%Px$8޿���x?�O��pՌ���%�1�^c��CW�S�z$4` ACn �C=��I�g�iy�)��=�n�(P_��_}j�~v��X}��1V��ɧ�����80��\w��c3tW��_�M���J������{ex��Jη�TSۆ�ک�Ԕ�o�:�
j�7��4�,��^�3|VV .��QM�a��1�	>5%�䧤�J���N)��Y�W'�{���#m��w9|���,�
�ap�s1��[�A Ԓ��h?���8+��(K� ;��#�3�8H�޺G�e�{$��q��!���x�;8N�y������\�d�W0�5�lҮ���G`�t0y�K�r*C�3*�+���
)y���M��r�W��%W�T"Ъ�uz�è3���U�9Mwy���:>����!�ޗ'I�/3�aǫi�s������NL���Q6��ި��#�Å�M�S�ö1~���h|��Z���L'�,Wb�j<'��݈Ӄ����r3� zwNJَ_�p����8pwh���[?C˔�gf��)�g`�zjˍx��vv�`
��	?����{"�h��b��=�K?�K�GSfk՟`�F�0��q��<��i[%���.t���|�Bv�xߊ�:O5�8"�.vN	w��g��6�>�ۧ�l��i���z�!`Hd�����x;V�d)ر`�<i09��M�n�)��js§�Iƒ���Y�d�љO�}@_�'b�K �ě��B��' ��x��?����뤸�5�)�W��)[oݎxj��� ���#�e�<��kG<�����ϋ�S���� �U���2�zdq��@^+c��5�����
�2 T���?(
�~��I_^O���z��E�'�S�z�U�דn������@a�ۯ��bgM
\}��Q�H��ڊ������E%ݎ�Ӣ_d���c�a���7��K�~�/4�Jc�~D������i��oG��
��C�/�t��-���1A��Ԃ���ް�,	�KSf�hS�c����"�x���O$d�*XM�0�!�>,.�bP9tr�$.��C���vQ���rt�o`��*c��G��6o���7ĬsW\��G��7el=�c�G��c摻��(�Ӕ�G. �)�����J6ck+�rt����gd�cԗçy��6�hc���XF/z�k�׻�8�)�`;�
zi���ES`l���� ��r�o#o��{�ŀ������v�Ƹmy��Ţ��iI���'C}���t�+ȏ#%^�t�K+�W)�b�E`]�(�nwhz����4��*�g�-R"_f���i�|�Wb���c\�ճ�`�:f��p��u���[�|�OK�Y��0D|����k+�׫4%�AX˥u���v�3_`��4��@H����~)�����^z���)��q>�FFwOl�nl�P�SN�r2(IhF�3��N�|�Kv%��#�}�-�sF/�o��.*ؼ�+�������x��X|ʞ�'p�;Fܓ�������}��~p�$}�D���я���t�f������F�mCo��P]�AFcg�OS�!��޷���o�%�o`�CO
E�u��|F{2���g��<Y�vR��il+ȯ��k�>eM���/P�2k�t�Zj���4����^|�����4��8Ru&����2Vs,�	��:R�o��ܵ�GQd�I	K� aI�A@Lx�, 	7��hTШ� W�$C�dbO0c�<��z�u����Ϸ�u����$l�#���a��ư��H��s�{ғL �~��|_���O��s�_�������=�� �7�3^�C�?��q��'��Σji���'�cjO�W������P;����5��E����.嵛����JغL���$F51�j�,&�3��i�ԵbOn�7�"�Z��*ڷ�r��K�Q�!&��لR�~�
�( �Q�$�x�oU���ψ��Wd�"*�� U�}%8:'����������F��Q�ș{�N�Q%��*�Eg��T͐������_���(�RS���&-�ބ����m���^�:�#�K"��2��Y�N�0C�Nk`t}�z����=����л&<bB0	L"�4�4f��������e���A%�9��1Ps�a�/�UAĪ^s$������L�($�I�ͦUQ��
GO߫����EX��EX-�����鐟����g�9?p��K����C,��ɷ˫ky\s�n��Ʋ�Z�6���vQ��b���x���TO��b	��p�x�<��
�w1�W��B��Q��������,�~.�j>=�=̄�{�!�x�Uĕ,a�lA�'��I���,�L<�O��y��x�pq��z��>���h*�߉���;|�!q_"�3�Bx�G,�� ���?�D��������4GtE�K�k�Ӗt�����A�[�t���m��s:���в�i����������}�SΊ����b��<��i�nI�R�90��S�M���������Ll���n�4%O>�=�a�%��̈́�ױ�2�!�|�g�S53W	��f3[7���cv�:/��ٺ+���Y�]غ6j���M�l���r���{z�_+���=�;�Q>1�{�GT�|tzTm������{�7%��$�:���Â	�y�� ¨F�\��l$�:c�ü���5M�q�#�$�&�S�,$�_�j`�A�vR �f��P�B7�e���!V�}�/�Cɯ��.�]���x���� 與.2��	�X��{��C���C�x]_�7����0���J2+����~�E^�U2~��UԞ�,��++ڰ��n�f�u�Z��jl���I�i�˙s��_ �s����1!�-h�g��F�xn��ޖ�<���*�Y�Ѐ�M�'9/��a,&�ǭ���7����L]=����{q�i�e�!j�%3e)��e��y)h{*��ڮ0�"Z|���I��4�N��ߺ�߲���M����R�Tý͠�h'�O-��}�
�O�*M�U�umd���n��k��k�!(��HA�|6�Ks�,�Tj�_�#7��)r�������Sg�9��VA-_4��j�^os�܃����c��΂�"�98�#�J�Nט��ڢ1�-�՘�˽{8�/�˝3̝��iR�$e�����Uo� x]��j&�V.o0���+r�3ף�:�`��oI���M��m�+�~}�Iu��Rn-a
�,�{�g��'���̎�jI��Va�1�f���A�{S���J�6���ۖ�񅧱b�Mn���m�<��Dϛ�&�B���7<2]��d��2�#He�����&�fG�X75�j��ڬ��f�9���0۬��L��z�S����D\_	7�r�]X�?�.��.�H����ET�]CJ{\�`����_�����J�'��ҟa�����1"!�ߊ�]�Ox��*n�ǔkPe�8Rܐl�6�!21�yj�����s�`�<"� ����Y��l'{~�JK�
:�5Pytvl|�4t�L3�s2���Lީ�,Ɣ2�5�1T�<���.�?F]�O���K&?O���f3�ܬq�+wІ�|ŕ{øu�bx�9���̊p��Z����z~͝�]�_|M��#�>��R�K��z�/�o޸�~c�����]���a,�="����Nc���aԡ�P�&�O<%+
~����bA3�@,�R1jOl�䶜���������σ��`�}q�9о��l����[F3�tq#s��U|�OC%��v����3�х5��7*���J9�Z�c v�`_�	��]�m:����|
�Xt�j���&�J�o�ݠ�$�;i8�E<{�LS���Ws��f��k�s=F�5sͤB��ȫ��ˍ9�����n1��N9��sNv��9y軫��{�:����8[nu�ى�q����9U�sM
����.r�lY�\u��ey��h�.�;�������G!���=Nj"I�A�n�B�\�@V<��:�����OPYI�T�X�g��T���ɭ���h�#>٥:�����tF�v�B�E��`O
ԉY��5��v@�I�k�Z��D��n%fym��]0y7<O-O�3V'���*��i(s&A���t��s�0�l%��~�MV��{��'���x��_�4>��NeR�M��S*�|���k���qB��,*x��5��<�H�G51�q���.iWۚ�L�QjWYb�PR�u<O�	��pe�.�2�I�������Mܴ5�mܟs����g�N�FG��)�>>�}4Xs�2K{�wLЖ��6��U�Դ��_����1���FG�2���Gl&����ԑ����_�D�^ω�I�����S�Wh>5�|*��U��A�C��%yҒ��%U�%ե%�G�)���>)�Kc���vwi�W�4�\��/�oIL-�OK�3��K�Y���5w^;�=���eS�Ԯ��-}׌��Lp�)�
h;�)Vڕ�&�걻���?	;,"�^JLa�GZ����/����Z�ZV��v�&Z�k��m�f�+MF��G�f��TI ���4؊3CKt�����t� tٳ�,�/{G��T]�kƊb�
Pa+A�5��n��M�IsFtK�D��Pi�߻]|}�y�q�ћ���T/%��`���(�p����y�I�2P\��nJ���`*J��XZ�S��qw��	t:�2�r��$)�����T^2D`�Lُ��+��$��w�K�<0s� A�F*�y-��t�}��ڌ�;��iĈ�ŦZ1��R�$��."�W�֘�W=3K[�1tűY ��+!X�s��Xl���~��o�:��YIz�D����`��]��Y(:�N���7�����[1�������9y"{��U��Õ�U�p����1\-�t���ژ���|�^�t��]�Z�S���<��+�*�/��D��>���a�R�KM�+"���wB���HVL����@+��������Svb[�I{�gv��j�;��ߦ|"�O��jljyz\	�YZ}<=n�-�k ���Qg�Y��8��f&�X��?�N�ͅ�!-�^1��&a;Nc�1��]/���O���Y;V������8�.�����%��r�{/w�Ȳ-�զd�6k��h�×�K����Ow�5*.��c /� |�t!@�	��z?0N�e���Dя��$4
��ф��`H(R���r�J����mTi5^Ru���7���6-�����x����*s�w�3y����G�IBu��;X��,,�.�W~+�	K��,���˓�E}�8���7P�p�[O_	r��a����(xWʡY�ey��-p��C�E�ʽǻ}���^P+�[W���c<y��A
��(�=�OĲ�;�\w
��ȱ=y�3�����:����m���o�ժ���B&���p�p���W�xTM�`q�����I܁�/���5H�R��^�'ti��u{��:d�s�3~�����^�4��>lC�����Hx��:�����:�l?:{9&=�����}�����.Ԙv��� ���C��TC�tSA�<�מ���.�����:\��Ғ.�4tf���M�j�CSy��B1�9v�������������ULI�z-<�N��J�w-ob�ha�˲C��+�x´�z���耇њ��?��q���p��r���W����<	y�vM֝Xw6�F������x�f�m�A�Ӎ����b�I���7�is�f��7�U���T�]�rbSd��p�����ۍr�	�إ���������9H{fE"��i�����P��\�ߥ�]-����Dǝ����V�ɉ6xc���o����&2h̊.U��L��L-�9ԥtx����w�	lm���!�r7Cw��v�h�_��_��"��`'��<�	���N��'a>��=B�בđ,L�0&"6 �"����T�DLHF�\��w��|���a>-�7�1͔��e_�r��Ǯ��c�a��@\�ˊ�[� $�O�s�1�#�Aa�ʄr��?��&h8]� �m�Jo_j���M�_�O���P�!;�f�E��Q��k����ܲL3������7b������
�|<a�:^7��� lf ��o	�ʹe����ڱ��B0V�e6Q"����4:)0�� ���U�:����!�cP�B ���h�I�[�T5�62����kd�z�C�����hQ���K�/��t��M����|�����}9�l�_���/+�tL8�/� &��:̘�4P���	��OA�� (�O�凉��uP:��a�"@9;�[�,(7=��S�(���<�	��G����)��|���d�
�0���7�¤�2:�F���rUs���:�-K�f�|w��+:�O�^�a���ҫs���t�yMB�aFvp����t���_N�ُh�|{�ўdϲ�Fp�����c	�=���\}�����5$8�>rYp���vp� C�w�c�h���@���c��L�nx�nxˏ8䭪���%ٺW�P�;Zα��!�|��kn_[�_��ؽ�$�ͅ�r��7�E�7��+|��7t�9�f�S��~ Z ���&r�b�̻�	��p#�Q~h��!��R@O���q���Z e���so�tn:�+[q<:SL�s���f¸z�0U��o+�l���4�.������5J��],I����@�oYXe��~�b��hb�j� ԗ��eŘ%�Knc��o}��Z��\�i�H"M���1��⚝�U\��5�y���-�E(�M�l��j2��Y9pS.��B�C�o)�o��!��t -�k�ɰ�d,r�4	.1&|�f���h�R߉4 C[��.�V̏�DQ3P�B��A3�h~6�йc�s��n�є0],����צҤ�D���y�şJ���'����~͍a��i���y��4�$�%�k�𥭆��$�D��)	3t��'�/|�:�b�
r�J���1�|�^/�7�A�N��BT��;S���|=oW��B[�w�A��Ox��W��v0	���oo�tƥ�����W�{M�[�{ȃ�5�I����^����+��EN�B�f)���k�]�k��P��p�f�3�w�W�������N���I�׾C��^w-��^�_d�ы��5d�n�ggt�^����ߎ3.��H��Rn5���éK��6�+w�M�j!Ͽ����O�%"���!Ѯ��D���>ȣ���}���q%6%K��D��������L�6B+���lId�~�w������+��"er-�ˁ����d܊;�}P
I����$��h������IH����
�hxD|$
�mI�,�ȣ(S�G��OaC"�]���Q�ڪh�j��F��	�y@ń�<�<|�[��@���s�ݻ�`���On�>Ι�3gfΜ�9V����H�y�d�&#e )���3LKY8C)�[h�%|^r;G��'�#�<Y4R7O>n�w2i�uq��},��O-F^,�8�M�ʝ��am�5�,0M<���޽��kq�|���;oHe��)�݌�C7�"uy{/�~�AH=��#e����Έ��[�Fjɭ�NR��jB*CGꖿ�B�t!�8GjKa,Rs�y�3R_JH��TG�zg!Ո&55f���3���O8�Mqp� �i������u��]^: �����St3�nΧ����S�Q?���/��`����X����>e�%�,�s�����q���3b���o�)�`?
�
�+��f�"��Ylj��m/��;��=�Q7����xZ4��Z�u�-�"�8�hL�>u����/�D�"�]�j)/�0��'�� �5m�م� �*�:�$-͸���r2	�f�o��e �k�ɭ�ɒ������iO���s]&{s#�{����`WbyӖ&0my�f��{EH�oɔ�v�AϾE���z�g�yЛ���]�{�'i4蟦郞�;�w�=�7��{��:?2�� W��Š#�J.�a�N���.|s!1m܏6������#��h'msX@���X_5�Fo�����:��%���^x��q�6ul��E�o�'�~�Ͻ�.h&�g,ѿ����)Arf���;>�Kt�eg$��y}��y�oa@��������$<?���ߗ���J�����`?e�Gԑȧ�b=��5r����1ܟHLڞ}�p���!0��0�b�P����q�=C�<7P�Cfy�e�r4����i�1�g��"{���^�Yg��W/�Wa�l4v?~:�Ԇ���v4eL��6��Q�>�,����u/���/��H��E04s�0�{����0�ð
�	l��G��I����[Br�~���w�=��(�r�ap�2���q��
�ֱ�=rM�`L.hB��-����(Ȑ���Y���?����bZ��8x�(K��:���<b���O#>^;L��Dzg�n��>�*���f4w��E9��W����q��ų
�$ d`&n[�A��qdiO{�@���ud'����w����"��]��}�"B�w�Ȟ�+�p�	��Qg�l�M}#�)�l> ��&Y�0��Ax�h6Y��XP��a��T�1�M6�!m��P�(x ��~����֓�yEɈ�3�GM�/P7�Lf��~b���������-D��qZ�ȍ��N|^r���)ʅ��
/�i�z'�hm������gI�1s8-߉C�d��~tй��@�"�3�6���I.��o��ZA�\�+�M�(�+�,��1.���+>�|=�/�i&�
N�g'Γ��"j����B�^�7��0�ƎvV�}mUK;���*�o�X�3�!�7CK��<�$_�I�Q���%��s�������b<�1�g����ޛ��*�����'��NI�>��vF)�"1��/�
o2���
���}+����w	�7�0-k�{�\N9�����\`����,����{�=z����c�������k.����ݸh?u���٬�ѾqV�� W`�,�6�D���������I,�YVz�@��T��*�0ޙ��vo�t��%��\A;������$YL������(l�R׬���O��!�Dq�����l�����Ϗ��b�E��`~���1t���G��6o Ӓ3�9�4䌽L��2��T�<�,�u��/��^����fѻ��Dn�0���k��Q�*�n�+k���KY�k��\�J���v2����"���I���r|(W��{���u�eu�0�%`�a��\S	K*��D��V�2��_mc�ۙ������ݵR+���_���(�z�w�>A��[��hp�3�0�{%s��ԏi�	(t�~��k/T.I0yx���-jP-��h����0��"�+r�
�t�r��n)+���k�e���xn[��a�t�;�!��6&�9�d/r1���'ٯd�|Xv���N�����z�,ǘf��8*�_�4i�a��c�\�z�Vw���G淅��ByF���=��Q�w2�[��Oגa��p6��Lm
���l�����-o��2��GksB[��#�Y�!�"�!����
C� �Uqy��S�A�s���g�ÑA����#�H��X����'b�ɕ��U�Y.���`:��3����}b��8J��'I.� cl$I�d>�f�O�q)�q���ʗ�d�E�ێF�o%���)~��_�����S�����/�6��8�<}Ȗ�t�9��%���ߐ48�Ǆ�G���^�%��L�&�	a�m^y!��QXz)�YR��;��!<+�+(��b1Ń�tԧ|�k��7c�2	mE0�*�3�Y�>�0�6� �B��2�7�����!V�e",�f��Y��ݝ�d[�>F����i:��P�o�`�[h�zkˇc�إ9B�I6�P:��w�Ո(���?(��(T��)����K��0�|_/>���� ;�oC�m��@e7g��.�4�fb�-�b�6qF�c԰zϿ��fT���Ih��y{d�Ŕ'�8B��!I�lb��:�AܼR��w��Y�^Q�m���
)ڔ��I������:ӏ8�M�͡�> 1\���І=q�6q>$�s�˽��XC�j7��Q�^/�̒� ��A��S'"s�y����u��O�P��Wؗ��܍Y��&ڜ�R�A�~����R��B�)*gQ�c�9�G�#b��4Fܸ��;���q��7��~��2�R0�	L��qZ۳�cfEs4���W�����s]���EQO����L�M�5����C/O�p�ˑ�����q2���- j��s4,Wm&���HZFi�=�_8�C(-1jih�g���k���ZXho�K��v�yfv8t�3�֦SRݭ�튺�D�f���ˁ����kq�ζC��u���S���e'����eE����S%��vrZ�I.c�'�Z����~�*� ���G�zd2g�����%�aL�l�Y ��)K���\_�5����땆5<;�y��v]Pr\�	��O}ct��MW8l:Gp�o�Ϧ��D~)�-]��v����S}�7���9��G"�U�Zo�ѡ)8�cW�D4|���݂�&>휸�C���z]��ѡ�q��if��̶r�L�^�RW�}HD������q��������\�;ZV|^�&���G�&Ut�/��i�%�<KfT��M�1�:;�4�]9�J�����*ɏn��*i����K��N *�E�94.?�5�q���4b#GvY�tq����`��V�A�(4O� ָC��.��/�[}C$��,:6��l���vse�?���/3'1^o�s��s���i:�t�0�9�&>��+!�]�B�aeL=��Wųn�U����7<)��xkE?QfKLG늯�qRnE���	D6s�.��b3���G�]4'�I#����ʵ�ڒ�C���?�ʏԆ�"	������v-ޟ�Bd&���ס�X	�1C����i�^�Vd��@`�b�~X͆o.f�u�C��I���N�	L�Q��B�����3�KQ���!%��B�zI�(�Z0��ļ��	��<�hӥBG�S�oU�7ڜ�|������_:���0�2��tTQ�M���
��aű��V�6�j�u)Ȯ�ϱ=�ș~��ga�6l }k���w9�_Qf�V�f��?ħ[ᩢޕ���4�o�sg��B�犜� �(�ւ�]����:���F�F~k�Ⱥ��ڥuh-S���j���4�N@.���9`���L[�(Jڹ�Tx<��\�������6<T -׷�â��6��=1N02N��`��7�����hq�`2���q�ݙ������o�mFؔ�T_���V|�0�,�(�00]��<���gQ=���jau����z0����7��B�̟  t��&k�l�N�B���;�9<$���wpy�nkpJ��C6�ע�i*el�y`V�JV��q'�����nށ/2�=�u_�_��>���}����YHS��X��B��R��T����ؘ��4� ���&/��E��v�i��ZLVG-�꾞��5L�)�+[���B�ᚑ�&�z����ۚǼ�T�)o3�\�r�\��NDNq�ϓ���*��s#X��^Kɿ��������kIL$��½������"/���^�`�<WvON��R�ZR.�R�~� טX����LDY&}�3V�\ף���F,L3��j�?���$l����ܵI�� �� .           q��mXmX  ��mX��    ..          q��mXmX  ��mXk[    INDEX   JS  N��mXmX  ��mX;��  Br e   ���� �������������  ����r e a d F  �r o m F i x   t u READFR~1    p��mXmX  ��mX_�                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    module.exports = {
    parse: function() {
        return this.createSingleNodeList(
            this.Identifier()
        );
    }
};
                                                                                                                                                                                                                                                                                                                                                                                         w]�M�'�ph�PIy����1a;�2x��7�V��09Ct��u��~��!���NI���b,���Ym�)��զ�z��m}}|Π��:{ �a���j@��9�Dx���7�����y��&�i^R�����ܚw��ס�<i��y[_�\�S|����&g�6>�ٰE_�H��+L�(	�
~x����}��b���?hS%�X�M*�B�!�����dspL(rO�~�Ϸ����?S?��gƓ�ĝ��vOKj�p�o���J9b22�ʘ���	��k�U0�x8f(݇�#�/�At�QK�F�R�a>EvLM[�S�l͠�Ok"���s�ܮi��z�N���Y�s���
lmE��.gQT��VSz���*2xZ�ŉ8.J�.וam0�#�oi�64_. �u�?tTN��;�_�A��d�f�<�F4��:$x�?��!*�˹�Z>�2�oZI�
{�K�
q��ܮ�I[ui��`�Xҗ�__�I��x����v�L�6�a�$�_���RK+�[����f�؉��o̰��Y;�֗��dl����i�l=�s�4w������y�|�Ju�f9y/��0ٸ��l�/]��蛹�<ѷ`�i�/n��v�4�i;^��蒍ύn2�����@��|��z�K�l��k�������oY���������X��������o;�yj���\n׊�v3�;l-�!��Z\v3�*/�J�$��p�����EL��˲}Z�f)������㧮�>�2c�S�D,{
��$�gX�u���5u�.~ޡ�CYC����S_���=��S����̄8+�"�����ƕ�o罧�\�8V��憵�z��я�7m�G7&����L��y�osMQS|I	��2M�^����%
�<r�7�������i�r�<+^%�?�*�y�@H�*�V�B��w8�5x�:!hT����襳�3�(�t�zg�K��$M>5�rY|�jW����s]������_A@4��������+�l�����Ѧް�9>?�;c4h��vbīt5G|m)ӂ����s�|�@�T���|�Ǣ|���u��١+_�s���[�E�'��	z(a�������]-��#"m�CJ��^(R>����}��A�V��DM�v����\	���x��v�S剜O�
�E���ڝ��h����e�u�Q�A��4S��;�ݲF�/-��x�S�rB؄.z]��n\º|�~�D?6W�\���]m�\�x�x$U�G�.*f��G����_&���&�>�<�a�A�>;�.E�#�5S�<z*̣��ǁ����c�B�:Q�G?��U�O��F��cO�X����n`�g��6�i���� �m����b�^=�G�}��֤ �H���`���ޭ�Ʋا)6N���{|�v�rM����`�)�݇T�[��]�\#���6����:&F�aGj��,�	�=6K�-c���i�2v�dk�X�{����z���,��~���ƞ��`���wk����y�
���f�vY�F�Ob��)6G�]�`����K5�Ng�'#��v4��C;R�m�e�)�D��0؃��4�D�}����X���`����J4y��b?JB�{�U�mv�v�V��<��C�N5�)���H���5R�i*�@[��]���,����]�Ɩ3��z��&o/?�`gPl�������=��H�*�mO���*l�}J[�Ŏg��P�D5v�%�����b��`�P왩*����u�Ǘj��Ylsb��ػl�v�;��n��$5���*XNk�b��`s)v�v�����D����^� �Wc��zظ"���X�k۔��>�`c���j�mr2X'ŮPcoc����=�D���؟9��Sck/*�z�uZ�(���ť�.g��z���ؓ��8�����2��c�v~���ְX�b�OVakig�a�j���žH�+�X7�5�as����[�MQc�2��3t�?/�`W��s�}s��E2��&c��3��nl	�������t7�Pw7���L4��F��T�J��}?(	���$�N`�Jy0��VE��r����.��
���d����������`�a�V��={��`gR�a^�=�/[3M�^���xC��؎ވ-Tc�1ا��w��6�]�,�]��Ucm6Y{~�Fڟ�1ة���*��
vo��y�F�^b�-���ƾ�`�����X�.�c�oRl�D��`-z�)Ziűv�����Su���5E�"����qj����d�&~�b�D��NPa�`����M�M8��`'P�]�Ma�O��[��eX�E3b�9Uغ&�P;ҭ���Y��u��e���_%�L8��`��G��`?���^yF�`kYl0��?�`��a�og�}��b��bs���֨���PSdG�0�1{"G���`�s�`���b1��j{�'bK��;C�[��v8�(֢��>�`�'�`�Oiڲ�~�`����~�}G�ɭQ�r{:�N5v�������&�d��(��]�����m���uh��������X0*
]
������b`�#6�A���"�D#���Ƙk"�h�`�.`�ؕh{	�p�;�g��~3~�ܛga{v朳{V`���Y�]�؍*��L�6���1�:e; 6D�v�*��a���m�����>Q���JSv��M9ۃ�)�]�b�M��6���2�NG�F!���=N^�a	�+f����uAlA����!�b�9[���o�j�ofk;��e��a� ����9Y['���l0e�"��S�zO�!�-b�s�^a��0�*��T���3�������bk͒��ꘝ��Z����
vX�tN���n���=a��n�KT�։ҔEc��c{Qv+bۨ�c�W�ʘ��ٿ	;���+ذ)Ҕ�n�Xg�~I�J�MP�%�%vf�� �L���WŮ���r{��pvG a'!6���4N�R[!�g{S�.b���iO��%�}�Oج�m�bS�J[[��9�e�B쥮
6Jf��Dl�֦l b��&I{� ��y��]�[�^*v�7��O,%~���l��j�Y*X����/�uଥ-a'"v��J�.��av�[�.��b�X����l�/b�p֕����.
v�i�6a�gw�!lbcUl������b����?b]U쨱�Q��b?���քͻb��lt�4�1[Z��8ʮA�d�(�=0�_�֥l(b�Tl�i�K�����?[��e�M�`�FJ/:�c�����MF�x[a��'t��O�}Ԓ��[]�N�(��!�7gR�	��;*؎C����}�/c=({��F�ج��a�G���#�l�VV��#�����=9I�ƈ��A�'�[��O�0��/a�_4�*��X�ph��8���Kk�b��H�&�����)���A
���R:���{�}����*�b�4e-1��ُ(�u�`˪ؽ#$�zc�v����]��m�l�hil�0��c��l b�أ㤃�f��'e�7ؒ@;n���p�b�9{�a�"�{q�t���ٻ/�1e{#���=%m�f����}�m��
�orKvZ�� �g�P�b7��p򏭰v��s��x�X/�NAl���*om��s6�	a=��_�N���1��Fls����,�]�bS�K�30��sƾlL����b�(�j�b�+�.�l{�>i�`���	/�6�ee��*�4Z:x�b��3�iD�����bs"�W^����P��A�ö
��a�Qv�!b=9�ڇ���v���.�0{�)c�S�O��،Q�����g�mL�i���F��7����'b�9{̛���L�ދ�v�1�=����){���S��¥=���i��׋��{������������o)��D[YfGb��c�6�l��m�b]�K��1;���6��[)؂O������u�le��b3���ȡ�=T��"O�VCl3�DN�l�;̎�le��6�+-lcyk��ClU�6�l,b��c��l f�>b����D����'�f?��'��|�`��)���A���J�}[�����-!�ݕ��Քm��*65\b��;������4س�
v�@�4���9{�a�"v���#�Y
�l�C�FS�[��U�{�I���"�cΖx6�'Z(�w��~�����������b���`���5��-){������Q�~����=�N�-�=�\�z��3��o-�C�)���b¥벮����6��@lM��W:�"�g��%l�q�=�L���v�U�}�c[S�kĎQ�>#�)�ٍ��t#l(bM*65B:x����Ύ��������)��1��c�P6�#Ul5���Zήs%�p�VT�GJ�ڈ��ٶ�5!vg.m�b��glv��9f�CU���҉�5fWs6��+k�b������b;q�e?D���
v��������cm¾8�X�T��EK���+8�O�͈�Q��äS�Ug�r��a vk#;��4��1���؉�-��p�!�:4��Ζ��#[�`_���b�pv�3a�!v�������޺��@ʺ 6L�&�lC�&p��aO6��ުc���Y����L�9�ݠbG��L���e�=e�"6X������8��ao��3/���ĞrDl�Qv5bר��2�)f/�a�G��DlW��]����ٹ��J���QC��[:x��D�g+Rv+bW��G}��vf�n3vsM�FlG�,om-���lG�VB�?��L�ڴ���٫5{��.W�1JS����[����s�b/�^Ыa6��P�-b�5P�����W����R��O�b�3M��uf3n2�a�ߨ����~;�u���o�ޏ~;�?xqe������ ��x��>�ڒ�|KVW#O�d���o<A1�C�����c});p��F�ر]��	f�r�tU��#�m=;=\z�}�*b�r6���� ��b���������-1vb���U�����8�=eC��/om�	�~�mI�h�nT�-�Ig�Y��v��g���!*��\�ǡ�a���1�=���>wW����8]�M9kCٙ�]�bgGJg�X�^�a�ʄ��n*6�c�(s�엜mM�[PW���Ƭ�������M�j�*��1�}���(;
��T���\��ٜ-Cٚ���)ؑ71<֒�b�sv]%�f��]�b��s��31�-e?Cl��=:E���:f�s6�"a���`�ɧFU��_	�n�����]�D�^t�1{�
c�Q6�mT��0�4^�S8��a{���u��vwE�:s֟�e��b=GHc;��/3��=aw�4X_�2K:1�c6��)��؜�
6���+������򔝌�*��pic��%�n�@Xw�6Q�i����e1;������a��\�i�o�l�Gl�^*O�T��U�>��w f�\d�d�F����(]x�T@lg�)��,g�Gz-����dG؉���b�~)�������lb���il�#vg��#lyĞvR�.S�=af�qv*e�R6V����6���[X�^h��ke
����^(�|������T�'��?���kڷ��cu��%y,�H�~�e<_�)lo)]1-���l�:S���T�0����J��(C�ݿlk/���!6���);��9*�p?il͘������uFl���򓶶)f�qv�-�=��ە���iی��G�=Ʀ�GnM�{x�K������?��^ڐ�������4����
�H'��=���e��܎���X�1�]F⋗ꘝ쌺xT��ڽ�l���=��V1��D�u�%X���Ii~�b���y�5#,� �Df�gw��zW_�!�z�X�2��ȍ����\�S�Ȼo����#2�?T�C�["�����׻A&�l�@���"=� ���|V�ga?-�|�P�uȴ�<9H�A�o���T�Ho��!��s>���B�z��(�oDFB6���K=�B��慞ΐ+D:@6Y�Wˌ�z�C�y��� W�<�Ld
䉧b�!G�\Y�D�?�*���-DFC�z�� �Q"{�e{���;:[ڰ'Q �2B�d�#1��	"�hYO�C���b�!�<�䡘�D��!�� y0O�?�@��!�Y��C.9
���Hȴ��C���1��KE:Cz�t�<|_��"�!_�-���� �<y4W�?�0�!����B��&"c!3���!r d�1��+E��l&���m=] G��Y|K��ް�|�B�M�S7�̄%2��=��N� �D~y溞f��"�C�^�s4�"?�l%�'�=�!Ǌli+�6�ګzV�l#�m��Y�Y 9^�-Ȳ"� �_�3���T����9A�JH;�q�.�92@�ȋ�9Id0d�����gc��"�@^>���SD�륥��ǐ?e�y���lȿ��<9M��J"��9S�$�N"�!s���d�ȱ��E~��Y=C ����~F�&�3D�B�DV��zZϒ-��|y�w g�<YM���N����͐�O�
r�ȅ�5D΄L>��8Ȟ"A��г���!E6�L9��d��*��G�,�r�ȧ�N"�B���d�ȣ���r�ȟ!]D��ܙ�gd��Y����9r����uD�B�qH� Ⱦ"�A�Գ.�Y�	�M��z>�e�� ���y2^�1Hw�@�ݧ����A��sd��ِ�D�@��S�!�D��|�G���"�C6�yp��U!���|����{��;m�{�~��=�I��_���K�?��� E���S�?d����b�!��$r0dj���P�A���9Od]H�&ȝ)b�!�D>���v1���E^��#���b�!�����M�?�Y�"H7��!��&����!���������]dsȽ[��CF��
Y�_1��	"�w��Pd.��_��9@KK��ط�����k��?뇔?"��r_?�r0�����q0/��P�2[���=��q����-���-mo˗����o����<���آ�sk�[�x��5�g�_y_�ܴ*�S[u���))γ�ж:���ZW5�jkc�DMbW��◯�y�_�z'�K�[~_�"���ֆ_�/^��VXgm/��7�-��S ����S|��������}�`]���舞�i�{�y�#z��}w��B���ay6��`s�#���V������{���I|�zsQMSB�
쿪���������E��7���F"��:��75`7vQ��y��Z�����v�ŏ�-�R�g[��W���?�H�ţ��|�]=a�}�C������gUX�,��zf�d����<��+{��g��#�7m��شH��leu���E�|��C�UJ#�����Ja�:ۘ���h;>�դ}�z�����j��ڲ�Z:�q���֔ЂO�C���<��L�"��8>Ƌ�x��	3~2�|�]��P��v�����vfO���K�K���}�[x_���g���=�
�s�|ï��������F3��w�aM�l!�B�ʪK����W�˨Ζ`���Һ�vV��n��kZ�s���$�k��`}���g�WNKẋ묏i+?��x̅�ǜ�s&<fz'��n=<�G�e�a>˔Х,���]~L��G�|�t�v��.�;\�.n�����S��@6HE���)���N�z~���s5Ժ/��54�M[��������w���4�;ؤYgd�����o�I+f��d��@��m0�[�Z0}�4�7����>�몱l��e^G��g7DX'�/��b6i�ڤub����Zt��v����6~k~>l���K�tɉ��u���Wt.9�O���\�H:��s�:�D;X��ݟ�We���q�S�A�q�Q��o�Q�2��}s�[!�Ř3���םMI���ǟ7�����숫)N��0yy�� ����|-͟�^}��������}��%-H����i����Y���������h�V�L�Ȝd�1�T��jtPQ00.q$�숒�tH�)i1~qfQV�,:(H��5� IWI���9,�B��C$�����ӝ�fw��z���ϻ���Jp�/���=CJ7�[���u_��9G6��C�8EO6�L?����2�>�o�o���G���,�]PO�i�V/����/zya.��lj�L.�Fz���bvŎ¤��>���t�t����1beI,�u�X�$)x�螈&I������$NH�G�J��Ip�LS�сJE%����0*ԧ2ǥ&l�?�9�S��"�!�k�>����S����ԯ�§��&#��I���F����wE�m�I�v���;���^�_h��1��8_*P�S�t��̹�$�
R�aQ&Y�=�5z�fS_�c��<��=«C��X�.0f7WRfY����t��	�ܫ�?جɖ�-���M\n ���HnsIn�c;H�Dn�t�8�r�o�h�ޏ?�>8�wܟ��,�';�{������Ɍ{ɟ�Cr�U���3��m�C��˗ubׅ�3�.�i���A]h�'�D������I����9@�s^���i1�h���wGkZg���7D��3�^��wo������uuZ_����'j�v*�Z>��uO6��!��x`��a�@C�H�����`�S��wqU��q����!.�b�9�ƥ{�B�̅��->�0+�h�j�n;R�v��A�͇��}p�p�nR���&���D���@�+�����E��P����4�\���ߛ��&�XZ�w�G���#ht\��Zy�����],rAt��`0��`�j.�&�_&���ۤ�5�lR�[�Mz��&��6i=�U�J�Օ�Mf�._��&��f� �UOs��z�Fo��a$r�n%��(0�3�����:m�w�i{���	� �uz���76��W���v���=���3�r�"��dYo�ϲ�:�P5l����!(�?[��D�_�:�a#��1��1��#hacƋ�xf��B�/d�e�'Ug�g�8�x��q�i���#`�NvU�Z�l�k��,�{��	� �8�"fr�hu)4�q��𯖔���	��-|���~#�G8�qSA�<�"�I���'��M�UR�i0���=5����d���mN��7x�e=f�";jѢm�u�$-�р��٭=�iQ	5�|����^���Gy�����	F��(�#]���ߑMJ���~�w8�������Άýs�K� 4��P'�2#�Kb�.�C��_�˙��]Z"u�(��[��l��ԥ2��2��8�F�إ!���K!���cu�H�=�����T�h��AdVv�'h��g�_لQ� VL�&�aC�Xъ�ҙ?�q6��*vC�<�zvW>�s3ni��"E��qq?����)�W@�� H6�;�"q��^~bB�|V�?=tVG��%f}������(3��<��"x�XH���,v���h4��H�xа���W&�\;���hp�^�M$�	9`�J@7@[�QM_AFz��È_��s��J+`��v:%Z�X����"�k�{qDq%i'%�4�RJCk)ֳ���Qx@��NE
�{�]A#-���%���9g~�Ù���{��壐|�0h���2�'���m\
 �ah��,�,:�ENdV�.Q�B!���42��_��ŷ��qD�&���:��տ$W����l}��;&3�x�?��ܖ֜�UZ����x��¨��������5h�/���^�rD���
��U;����Ow�և���R��Þ���`�����$e�3
��d;M�¯�
�S)�Fq��w�K�Z�S[\�"�,.��m�-]{E�����a�<Yg��h}|*o�id��=��\'T�Qb/����hjr8{�Uz`s��S]&)	���eEuW!95+ɹl-�yh�m�&*�U�;�I6��ug�v*�ɹ��3��d�7�����ā����h�,� ���Rp��ZMD�T�b��'^ˏ.�ʛ�9���}U:�6�-.P��:�F�DJ�\�������ȍ������0�|�/�c�_n�� �+�/8�8!v{�$.oO��nA�}��x��<�������8��_U��p��V���U4\ҾE� �J�<��*�6KJ�ER�GKJ�f�x����������kk1b�5�����U�g7��c@��y|K��FϵC��^����y�z�c+b")#�KJv,� h�s�_�Ăa1���?§�3�)v��̊��2���E�1�c e�7�6�96�Wg.)R4� +���1�Tb�[c��{E�ɸ�&x�3Y�h+ꉁ3��A�&�8�;V^F.itx�1AF�dZ *YZm��A�4Ԭ!���F]�<z��~���u>4���`�iẙ��Kz�E�L�D�)��*G1�$3��M��{z��@	�̪B�- �?pa&�M���A�^"�H������MvKA1��, um�|�U9� J���h��eL��Ydw�I�H��[��LГ��Of9�ѽ	��!jܭO<B��g�E\�M���䏥_2�t�4�K���!V���9���Rj\��2�V[�s{��.I>�`"]8̺1�ǣ$�a���z�h#3�����/ �x��=ȋ���h��V��b|�c���a��@��6���j6�꧅h��.C~���n]�.��v=����V�R�h� ~�{ϙ�A�v�G���������Ό��ezyE(����t-�m �D�9��~�%$�{m�gL@^?m2���(زԭ�z����d2A��A�ә��,��ɏ��&���_/������<1��c�ō�~�f���/�#xL��f^B���a�N}��Qע�%�c�����ӡ��F�^���a��K`�����;|�\ ��R"Tq˻��`GOaG��υå�:���>e�$�SW\�Iן��O��	E�ͭFϮ�BPפ�W">�]����-��T����/��R@�P��>?�Z�C���l-�Q���{~|G}T�4�.+o��͠�\�ˏY$K��GQ���0��6�6��M�FS'�)��h~`y���G�GpDP��c�F�Lfm�c`P��h]B�Gm�	���$~��1�ߵ��7�Td�K���w7�z����(cz��Z����{��;E?�ݙ	�!�����Dؤ! �����4|
�I�X��e#)���<ws�8��4�(��O�U�b�i�4��"_+��2���@���,�㔧
�����A�S��)��pw�짚Ժ(�5ef�8:���S=��	}��b��D�OJ)?������T�Ү{�0��K)ˮ���V�bB�v-4�i�0�e7F�����^���S�Z�O�Č�c2���Be�V�z|�7�^T*����,5���%��Q1̃.����'O���2������d2!��bX��G�j��H�P* �| �!�AX�i����.����^�hPnk�d�NM���M����M�x3�FO�27�>����^�����~��X6��1*�z]B�6���i,a}>������+��dC��%S������`�K>��d�3.�J�p�'�ť<d����8���ls)?��Q�Y2������6k`�$_t�g��.���I�-���*���K�.�/6+�^>0����-�Z.y	�Y㶅�L��.�A�VۣS�=@���X�pP��v�V��ߌ!U5O;�X�%֖Lϻ�\#�����e/O�c���=X!S��)�|~������ϰ!ޗP��a�6��7���i_�nV�<�h��G]`�l�#�2�[T���(9��?����q)�N�O����\�)�Q�8�o�A�ϕ]����Of��]r��O��.�1�	("�SfE�8w�$��C�BS;T��[B'�&a�E��J�t$������l�B�
�۳�������/c�W0m^��oh)�E�Q�)y|B��|e�?�<ݼ�ۊ���R�����|��x*i[��4�!�CҤ��KP��}��v��#��K�-��N%�$�_��C���25����1��\v����M�"���,z�"5e���˾�A۲"�rN��J��U����6K}�fÇ��\J� ��}��H����]�z���`�}���a��N�Xh�,���A��b������O����8W�:�ٍ�0	�m����n��O��-�w/���/\�
"4S�.M �5u�߅}6�O2}�[Q��̭�^�F/���":�K�ɋ�"����ǫrk
���k0�/?�׊/��y����zd�ۨE6/�K߱/[��]6,�1Q�������ћ'~d����`0�?��?n�z!�jm'o�hWZ���ώ7��N!���cR��3� ��y�!��Ni�����z��@۶�����qa�V�^�,�Xp����F�W?�e�zy٪0/�Efh�j|� /��0G�w@��,�"���H�c�`bɭ�%H�P���e��^ @
|��T����^4R�h�i�-���:�8�6>G�p��R���1��6��2��{B�|-;���WJ%�>�B�
���[0��'�������0�RE(�c��>�����	O�#��;���M8�1bE���n
�z=h���>���u9b�<����_�� m�9��7?q }v�SR8}�� m��C�8e^0-�Eo]=Lܝl+�4����2��kr��kU�� N��,�4��0t4��jQ�[����W���r+�O��]��L�M5^(0�U7�/h&�ʟ��#�' ����%������|~(���u���@� Le@z�J���8�,ES!3K)���M�/�*D*^�5�H��&��-���}��l2��@Pҵ:�0��Vb���A�M�J����5.P��u�Iֿ����h&N�'Y'�i�5mAs��9��&�s9���B^RQ�f�Љ R`�����h:����ղQ��l_)���N9��:A'��;$�'@jR���d9�����hBm;���r�����[̤�Fz�F�F�d𷘷	��7v�y�K�-?ՀSRL �IS8�e���/������9�/��"_:N1����#ީ"~L���S������C5�%?�&��!��"�D�k���C��t'�@2���O�	��rv8�Ϯ���ӪGp�����f��$K��l'FvrF6�3rZ��Hg>2�� c�c9���Q��?64~�"����>cI����nxP��xQBNK��:�r���R�?�E	2�B��4Q�_A� �1M�L����j��某��1�5��?�G`��9k���^��=J�sR�ܭE`i�|F��_�cZ4;:�~����E2�^(;3�>^*��Jq�$��C�wރ�)�'5x/������_�?]�Qz��T�g���?�Z¼A�}��%v����g4�"�*���:^W_�*��ʟ��~ݧ:��w�E��Ծ��%�o��F�^��Ë+�c�Ljoxn��}���'xϞ��X��<c)|z�_pMѨ��0�e�xi!3��=���#���b�4�e�M�O�W��bi5М������S'��߭O�~?0��{N����kzȨ��	�ĂM�wo�Xv�S��j9,ֶrżQ�h+��4����
�/����&���v��u�_k�9w#�r.�K{�Η�4��j)v��[Ɨ3=����
�׋�;-���}�+��St�r÷T�ȁ�I..=��/cL˗�;{"/_����#�R�X?:�2��%�b�ߌ���8K�����ƣ@(�"��	��%�O������E��%�#5���u�x��� d�H�y�RƬ�'N����z�.��ۘ3�~�rC���2��۟8�1鵢�|��勁n9�B�K����Ә�͝*��T���x���z�YA��;�����%�O �j"�̀�y��#U���iI7��h��:���?�]|TՕ�G3B�7@Ш�@�4�AJp�Iy�L4jĠl�.��v�0�L$��� *v��.��m]̶��EM����B�,�]}c�h�~��{ι��7�I@�ɛ�w��q���{����^P+�(����14?���y0��Ze`��IV�$��abB���-?*
�����S�-��@!W��^M�Zӻ1�� ��M~i��R�m22��83�>7�����i^��}���k�Z�(�%A����[������7�b�x�Gd��/ϒ��5W#���"��D`����֢�q��6���D'_�Y�/���BwЈ���Q�����uI��q̈�3�C�������lz�i'�4�VOت��#0`錷S���?�$Kݘ�ԝ��ZwzFhh�鉡����TA��4T&��߭���T�?�3B��;7C�����p%�)p�Z�E ��|������CZ�֝}����Ф�#�4��%���p�`�@]lbh�[Y������j��ۆ�����Շ5���+M8�)��;R���D������v!h?�Q	[l-�@��)4�?c�}Cp��#�4VܳNC��\❵��0+�Z�xWh,7��ķ���R�6��m͏I��b��ːI�J��������f�}P{�a��K�4���B�0j�U��.��no�`h��M �m�ꊇ�+����v�+R�����v�a��E�8#�V�t��O�*_��3�nz���6������X�ZoV�Q��ԥ>/@�y�l�1p���v`By,��ڍ��s���k� t��Ƶ�z�NK� 3�.F��ui��˶
���w���E�6�����l�,�E����R�������j�h�Nf;��/}M�i�:�T�����G�����;|C��ɇ�$Ⱦ��m9��Nt��=I�'�i�G�dFOs��R���W�y��n�@�R8��}%�#mJ�6ϻ��v�@!��j~�u
����]1O�� (��.D���4�杋텅�$t����F����9P�*FGp	C�4醁�;�p{Z�R�ͥgzc�˵Q��~�sd+y��l��)v3.pj߈xkd|�χ"b���YL~m�A|:��$c�wShB��w��B�("���k���_W+��kC�z����ϛ����x=�u��A��fBp4bs����A��!A�?�Y]�>�X?U��뻊�C��/�S9]!�=E��©-l(�>{X�B�
���~��fZ������?$6'h�H:�7�h[��<�u���A!��'�1����4x�J�=��B�߮6���i���3x2}7.d�B-#�׺۱�_�8Y6�ϊ|;�|{�|���4��h挲l;��'^��{lj�w�3x�0?"OI0j;"s���|M _���Ơ� �� ���~g��nA�D36Q���� 5>	����	����Š�>�e+�Q[]������~�1�(� 2h*��kh\�Y��7��"u�c�C�;��Ќ ��5�="��,q�A�R�͜{����KU�t�Q{�S����K�W#n3*����ԍ\Z��+��g/Q#����</q�1$���+��U
q��HKh��6�/F�͜��y�a�n�d�GL��s)�
����-���u|Z�c�A��s���X���ʯx�����{ O�_�5q5Kx��1��5��5�\��F�+9;�w���+'��;\������{�r�Fv��@�V>Ρ�kJ5!�4EForge ChangeLog
===============

## 1.3.1 - 2022-03-29

### Fixes
- RFC 3447 and RFC 8017 allow for optional `DigestAlgorithm` `NULL` parameters
  for `sha*` algorithms and require `NULL` paramters for `md2` and `md5`
  algorithms.

## 1.3.0 - 2022-03-17

### Security
- Three RSA PKCS#1 v1.5 signature verification issues were reported by Moosa
  Yahyazadeh (moosa-yahyazadeh@uiowa.edu).
- **HIGH**: Leniency in checking `digestAlgorithm` structure can lead to
  signature forgery.
  - The code is lenient in checking the digest algorithm structure. This can
    allow a crafted structure that steals padding bytes and uses unchecked
    portion of the PKCS#1 encoded message to forge a signature when a low
    public exponent is being used. For more information, please see
    ["Bleichenbacher's RSA signature forgery based on implementation
    error"](https://mailarchive.ietf.org/arch/msg/openpgp/5rnE9ZRN1AokBVj3VqblGlP63QE/)
    by Hal Finney.
  - CVE ID: [CVE-2022-24771](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-24771)
  - GHSA ID: [GHSA-cfm4-qjh2-4765](https://github.com/digitalbazaar/forge/security/advisories/GHSA-cfm4-qjh2-4765)
- **HIGH**: Failing to check tailing garbage bytes can lead to signature
  forgery.
  - The code does not check for tailing garbage bytes after decoding a
    `DigestInfo` ASN.1 structure. This can allow padding bytes to be removed
    and garbage data added to forge a signature when a low public exponent is
    being used.  For more information, please see ["Bleichenbacher's RSA
    signature forgery based on implementation
    error"](https://mailarchive.ietf.org/arch/msg/openpgp/5rnE9ZRN1AokBVj3VqblGlP63QE/)
    by Hal Finney.
  - CVE ID: [CVE-2022-24772](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-24772)
  - GHSA ID: [GHSA-x4jg-mjrx-434g](https://github.com/digitalbazaar/forge/security/advisories/GHSA-x4jg-mjrx-434g)
- **MEDIUM**: Leniency in checking type octet.
  - `DigestInfo` is not properly checked for proper ASN.1 structure. This can
    lead to successful verification with signatures that contain invalid
    structures but a valid digest.
  - CVE ID: [CVE-2022-24773](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-24773)
  - GHSA ID: [GHSA-2r2c-g63r-vccr](https://github.com/digitalbazaar/forge/security/advisories/GHSA-2r2c-g63r-vccr)

### Fixed
- [asn1] Add fallback to pretty print invalid UTF8 data.
- [asn1] `fromDer` is now more strict and will default to ensuring all input
  bytes are parsed or throw an error. A new option `parseAllBytes` can disable
  this behavior.
  - **NOTE**: The previous behavior is being changed since it can lead to
    security issues with crafted inputs. It is possible that code doing custom
    DER parsing may need to adapt to this new behavior and optional flag.
- [rsa] Add and use a validator to check for proper structure of parsed ASN.1
  `RSASSA-PKCS-v1_5` `DigestInfo` data. Additionally check that the hash
  algorithm identifier is a known value from RFC 8017
  `PKCS1-v1-5DigestAlgorithms`. An invalid `DigestInfo` or algorithm identifier
  will now throw an error.
  - **NOTE**: The previous lenient behavior is being changed to be more strict
    since it could lead to security issues with crafted inputs. It is possible
    that code may have to handle the errors from these stricter checks.

### Added
- [oid] Added missing RFC 8017 PKCS1-v1-5DigestAlgorithms algorithm
  identifiers:
  - `1.2.840.113549.2.2` / `md2`
  - `2.16.840.1.101.3.4.2.4` / `sha224`
  - `2.16.840.1.101.3.4.2.5` / `sha512-224`
  - `2.16.840.1.101.3.4.2.6` / `sha512-256`

## 1.2.1 - 2022-01-11

### Fixed
- [tests]: Load entire module to improve top-level testing and coverage
  reporting.
- [log]: Refactor logging setup to avoid use of `URLSearchParams`.

## 1.2.0 - 2022-01-07

### Fixed
- [x509] 'Expected' and 'Actual' issuers were backwards in verification failure
  message.

### Added
- [oid,x509]: Added OID `1.3.14.3.2.29 / sha1WithRSASignature` for sha1 with
  RSA. Considered a deprecated equivalent to `1.2.840.113549.1.1.5 /
  sha1WithRSAEncryption`. See [discussion and
  links](https://github.com/digitalbazaar/forge/issues/825).

### Changed
- [x509]: Reduce duplicate code. Add helper function to create a signature
  digest given an signature algorithm OID. Add helper function to verify
  signatures.

## 1.1.0 - 2022-01-06

### Fixed
- [x509]: Correctly compute certificate issuer and subject hashes to match
  behavior of openssl.
- [pem]: Accept certificate requests with "NEW" in the label. "BEGIN NEW
  CERTIFICATE REQUEST" handled as "BEGIN CERTIFICATE REQUEST".

## 1.0.0 - 2022-01-04

### Notes
- **1.0.0**!
- This project is over a decade old! Time for a 1.0.0 release.
- The URL related changes may expose bugs in some of the networking related
  code (unrelated to the much wider used cryptography code). The automated and
  manual test coverage for this code is weak at best. Issues or patches to
  update the code or tests would be appreciated.

### Removed
- **SECURITY**, **BREAKING**: Remove `forge.debug` API. The API has the
  potential for prototype pollution. This API was only briefly used by the
  maintainers for internal project debug purposes and was never intended to be
  used with untrusted user inputs. This API was not documented or advertised
  and is being removed rather than fixed.
- **SECURITY**, **BREAKING**: Remove `forge.util.parseUrl()` (and
  `forge.http.parseUrl` alias) and use the [WHATWG URL
  Standard](https://url.spec.whatwg.org/). `URL` is supported by modern browers
  and modern Node.js. This change is needed to address URL parsing security
  issues. If `forge.util.parseUrl()` is used directly or through `forge.xhr` or
  `forge.http` APIs, and support is needed for environments without `URL`
  support, then a polyfill must be used.
- **BREAKING**: Remove `forge.task` API. This API was never used, documented,
  or advertised by the maintainers. If anyone was using this API and wishes to
  continue development it in other project, please let the maintainers know.
  Due to use in the test suite, a modified version is located in
  `tests/support/`.
- **BREAKING**: Remove `forge.util.makeLink`, `forge.util.makeRequest`,
  `forge.util.parseFragment`, `forge.util.getQueryVariables`. Replace with
  `URL`, `URLSearchParams`, and custom code as needed.

### Changed
- **BREAKING**: Increase supported Node.js version to 6.13.0 for URL support.
- **BREAKING**: Renamed `master` branch to `main`.
- **BREAKING**: Release process updated to use tooling that prefixes versions
  with `v`. Other tools, scripts, or scanners may need to adapt.
- **BREAKING**: Remove docs related to Bower and
  [forge-dist](https://github.com/digitalbazaar/forge-dist). Install using
  [another method](./README.md#installation).

### Added
- OIDs for `surname`, `title`, and `givenName`.

### Fixed
- **BREAKING**: OID 2.5.4.5 name fixed from `serialName` to `serialNumber`.
  Depending on how applications used this id to name association it could cause
  compatibility issues.

## 0.10.0 - 2020-09-01

### Changed
- **BREAKING**: Node.js 4 no longer supported. The code *may* still work, and
  non-invasive patches to keep it working will be considered. However, more
  modern tools no longer support old Node.js versions making testing difficult.

### Removed
- **BREAKING**: Remove `util.getPath`, `util.setPath`, and `util.deletePath`.
  `util.setPath` had a potential prototype pollution security issue when used
  with unsafe inputs. These functions are not used by `forge` itself. They date
  from an early time when `forge` was targeted at providing general helper
  functions. The library direction changed to be more focused on cryptography.
  Many other excellent libraries are more suitable for general utilities. If
  you need a replacement for these functions, consider `get`, `set`, and `unset`
  from [lodash](https://lodash.com/). But also consider the potential similar
  security issues with those APIs.

## 0.9.2 - 2020-09-01

### Changed
- Added `util.setPath` security note to function docs and to README.

### Notes
- **SECURITY**: The `util.setPath` function has the potential to cause
  prototype pollution if used with unsafe input.
  - This function is **not** used internally by `forge`.
  - The rest of the library is unaffected by this issue.
  - **Do not** use unsafe input with this function.
  - Usage with known input should function as expected. (Including input
    intentionally using potentially problematic keys.)
  - No code changes will be made to address this issue in 0.9.x. The current
    behavior *could* be considered a feature rather than a security issue.
    0.10.0 will be released that removes `util.getPath` and `util.setPath`.
    Consider `get` and `set` from [lodash](https://lodash.com/) if you need
    replacements. But also consider the potential similar security issues with
    those APIs.
  - https://snyk.io/vuln/SNYK-JS-NODEFORGE-598677
  - https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-7720

## 0.9.1 - 2019-09-26

### Fixed
- Ensure DES-CBC given IV is long enough for block size.

## 0.9.0 - 2019-09-04

### Added
- Add ed25519.publicKeyFromAsn1 and ed25519.privateKeyFromAsn1 APIs.
- A few OIDs used in EV certs.

### Fixed
- Improve ed25519 NativeBuffer check.

## 0.8.5 - 2019-06-18

### Fixed
- Remove use of `const`.

## 0.8.4 - 2019-05-22

### Changed
- Replace all instances of Node.js `new Buffer` with `Buffer.from` and `Buffer.alloc`.

## 0.8.3 - 2019-05-15

### Fixed
- Use basic character set for code.

## 0.8.2 - 2019-03-18

### Fixed
- Fix tag calculation when continuing an AES-GCM block.

### Changed
- Switch to eslint.

## 0.8.1 - 2019-02-23

### Fixed
- Fix off-by-1 bug with kem random generation.

## 0.8.0 - 2019-01-31

### Fixed
- Handle creation of certificates with `notBefore` and `notAfter` dates less
  than Jan 1, 1950 or greater than or equal to Jan 1, 2050.

### Added
- Add OID 2.5.4.13 "description".
- Add OID 2.16.840.1.113730.1.13 "nsComment".
  - Also handle extension when creating a certificate.
- `pki.verifyCertificateChain`:
  - Add `validityCheckDate` option to allow checking the certificate validity
    period against an arbitrary `Date` or `null` for no check at all. The
    current date is used by default.
- `tls.createConnection`:
  - Add `verifyOptions` option that passes through to
    `pki.verifyCertificateChain`. Can be used for the above `validityCheckDate`
    option.

### Changed
- Support WebCrypto API in web workers.
- `rsa.generateKeyPair`:
  - Use `crypto.generateKeyPair`/`crypto.generateKeyPairSync` on Node.js if
    available (10.12.0+) and not in pure JS mode.
  - Use JS fallback in `rsa.generateKeyPair` if `prng` option specified since
    this isn't supported by current native APIs.
  - Only run key generation comparison tests if keys will be deterministic.
- PhantomJS is deprecated, now using Headless Chrome with Karma.
- **Note**: Using Headless Chrome vs PhantomJS may cause newer JS features to
  slip into releases without proper support for older runtimes and browsers.
  Please report such issues and they will be addressed.
- `pki.verifyCertificateChain`:
  - Signature changed to `(caStore, chain, options)`. Older `(caStore, chain,
    verify)` signature is still supported. New style is to to pass in a
    `verify` option.

## 0.7.6 - 2018-08-14

### Added
- Test on Node.js 10.x.
- Support for PKCS#7 detached signatures.

### Changed
- Improve webpack/browser detection.

## 0.7.5 - 2018-03-30

### Fixed
- Remove use of `const`.

## 0.7.4 - 2018-03-07

### Fixed
- Potential regex denial of service in form.js.

### Added
- Support for ED25519.
- Support for baseN/base58.

## 0.7.3 - 2018-03-05

- Re-publish with npm 5.6.0 due to file timestamp issues.

## 0.7.2 - 2018-02-27

### Added
- Support verification of SHA-384 certificates.
- `1.2.840.10040.4.3'`/`dsa-with-sha1` OID.

### Fixed
- Support importing PKCS#7 data with no certificates. RFC 2315 sec 9.1 states
  certificates are optional.
- `asn1.equals` loop bug.
- Fortuna implementation bugs.

## 0.7.1 - 2017-03-27

### Fixed

- Fix digestLength for hashes based on SHA-512.

## 0.7.0 - 2017-02-07

### Fixed

- Fix test looping bugs so all tests are run.
- Improved ASN.1 parsing. Many failure cases eliminated. More sanity checks.
  Better behavior in default mode of parsing BIT STRINGs. Better handling of
  parsed BIT STRINGs in `toDer()`. More tests.
- Improve X.509 BIT STRING handling by using new capture modes.

### Changed

- Major refactor to use CommonJS plus a browser build system.
- Updated tests, examples, docs.
- Updated dependencies.
- Updated flash build system.
- Improve OID mapping code.
- Change test servers from Python to JavaScript.
- Improve PhantomJS support.
- Move Bower/bundle support to
  [forge-dist](https://github.com/digitalbazaar/forge-dist).
- **BREAKING**: Require minimal digest algorithm dependencies from individual
  modules.
- Enforce currently supported bit param values for byte buffer access. May be
  **BREAKING** for code that depended on unspecified and/or incorrect behavior.
- Improve `asn1.prettyPrint()` BIT STRING display.

### Added

- webpack bundler support via `npm run build`:
  - Builds `.js`, `.min.js`, and basic sourcemaps.
  - Basic build: `forge.js`.
  - Build with extra utils and networking support: `forge.all.js`.
  - Build WebWorker support: `prime.worker.js`.
- Browserify support in package.json.
- Karma browser testing.
- `forge.options` field.
- `forge.options.usePureJavaScript` flag.
- `forge.util.isNodejs` flag (used to select "native" APIs).
- Run PhantomJS tests in Travis-CI.
- Add "Donations" section to README.
- Add IRC to "Contact" section of README.
- Add "Security Considerations" section to README.
- Add pbkdf2 usePureJavaScript test.
- Add rsa.generateKeyPair async and usePureJavaScript tests.
- Add .editorconfig support.
- Add `md.all.js` which includes all digest algorithms.
- Add asn1 `equals()` and `copy()`.
- Add asn1 `validate()` capture options for BIT STRING contents and value.

### Removed

- **BREAKING**: Can no longer call `forge({...})` to create new instances.
- Remove a large amount of old cruft.

### Migration from 0.6.x to 0.7.x

- (all) If you used the feature to create a new forge instance with new
  configuration options you will need to rework your code. That ability has
  been removed due to implementation complexity. The main rare use was to set
  the option to use pure JavaScript. That is now available as a library global
  flag `forge.options.usePureJavaScript`.
- (npm,bower) If you used the default main file there is little to nothing to
  change.
- (npm) If you accessed a sub-resource like `forge/js/pki` you should either
  switch to just using the main `forge` and access `forge.pki` or update to
  `forge/lib/pki`.
- (bower) If you used a sub-resource like `forge/js/pki` you should switch to
  just using `forge` and access `forge.pki`. The bower release bundles
  everything in one minified file.
- (bower) A configured workerScript like
  `/bower_components/forge/js/prime.worker.js` will need to change to
  `/bower_components/forge/dist/prime.worker.min.js`.
- (all) If you used the networking support or flash socket support, you will
  need to use a custom build and/or adjust where files are loaded from. This
  functionality is not included in the bower distribution by default and is
  also now in a different directory.
- (all) The library should now directly support building custom bundles with
  webpack, browserify, or similar.
- (all) If building a custom bundle ensure the correct dependencies are
  included. In particular, note there is now a `md.all.js` file to include all
  digest algorithms. Individual files limit what they include by default to
  allow smaller custom builds. For instance, `pbdkf2.js` has a `sha1` default
  but does not include any algorithm files by default. This allows the
  possibility to include only `sha256` without the overhead of `sha1` and
  `sha512`.

### Notes

- This major update requires updating the version to 0.7.x. The existing
  work-in-progress "0.7.x" branch will be painfully rebased on top of this new
  0.7.x and moved forward to 0.8.x or later as needed.
- 0.7.x is a start of simplifying forge based on common issues and what has
  appeared to # ajv-keywords

Custom JSON-Schema keywords for [Ajv](https://github.com/epoberezkin/ajv) validator

[![build](https://github.com/ajv-validator/ajv-keywords/workflows/build/badge.svg)](https://github.com/ajv-validator/ajv-keywords/actions?query=workflow%3Abuild)
[![npm](https://img.shields.io/npm/v/ajv-keywords.svg)](https://www.npmjs.com/package/ajv-keywords)
[![npm downloads](https://img.shields.io/npm/dm/ajv-keywords.svg)](https://www.npmjs.com/package/ajv-keywords)
[![coverage](https://coveralls.io/repos/github/ajv-validator/ajv-keywords/badge.svg?branch=master)](https://coveralls.io/github/ajv-validator/ajv-keywords?branch=master)
[![gitter](https://img.shields.io/gitter/room/ajv-validator/ajv.svg)](https://gitter.im/ajv-validator/ajv)

**Please note**: This readme file is for [ajv-keywords v5.0.0](https://github.com/ajv-validator/ajv-keywords/releases/tag/v5.0.0) that should be used with [ajv v8](https://github.com/ajv-validator/ajv).

[ajv-keywords v3](https://github.com/ajv-validator/ajv-keywords/tree/v3) should be used with [ajv v6](https://github.com/ajv-validator/ajv/tree/v6).

## Contents

- [Install](#install)
- [Usage](#usage)
- [Keywords](#keywords)
  - [Types](#types)
    - [typeof](#typeof)
    - [instanceof](#instanceof)<sup>\+</sup>
  - [Keywords for numbers](#keywords-for-numbers)
    - [range and exclusiveRange](#range-and-exclusiverange)
  - [Keywords for strings](#keywords-for-strings)
    - [regexp](#regexp)
    - [transform](#transform)<sup>\*</sup>
  - [Keywords for arrays](#keywords-for-arrays)
    - [uniqueItemProperties](#uniqueitemproperties)<sup>\+</sup>
  - [Keywords for objects](#keywords-for-objects)
    - [allRequired](#allrequired)
    - [anyRequired](#anyrequired)
    - [oneRequired](#onerequired)
    - [patternRequired](#patternrequired)
    - [prohibited](#prohibited)
    - [deepProperties](#deepproperties)
    - [deepRequired](#deeprequired)
    - [dynamicDefaults](#dynamicdefaults)<sup>\*</sup><sup>\+</sup>
  - [Keywords for all types](#keywords-for-all-types)
    - [select/selectCases/selectDefault](#selectselectcasesselectdefault)
- [Security contact](#security-contact)
- [Open-source software support](#open-source-software-support)
- [License](#license)

<sup>\*</sup> - keywords that modify data
<sup>\+</sup> - keywords that are not supported in [standalone validation code](https://github.com/ajv-validator/ajv/blob/master/docs/standalone.md)

## Install

To install version 4 to use with [Ajv v7](https://github.com/ajv-validator/ajv):

```
npm install ajv-keywords
```

## Usage

To add all available keywords:

```javascript
const Ajv = require("ajv")
const ajv = new Ajv()
require("ajv-keywords")(ajv)

ajv.validate({instanceof: "RegExp"}, /.*/) // true
ajv.validate({instanceof: "RegExp"}, ".*") // false
```

To add a single keyword:

```javascript
require("ajv-keywords")(ajv, "instanceof")
```

To add multiple keywords:

```javascript
require("ajv-keywords")(ajv, ["typeof", "instanceof"])
```

To add a single keyword directly (to avoid adding unused code):

```javascript
require("ajv-keywords/dist/keywords/select")(ajv, opts)
```

To add all keywords via Ajv options:

```javascript
const ajv = new Ajv({keywords: require("ajv-keywords/dist/definitions")(opts)})
```

To add one or several keywords via options:

```javascript
const ajv = new Ajv({
  keywords: [
    require("ajv-keywords/dist/definitions/typeof")(),
    require("ajv-keywords/dist/definitions/instanceof")(),
    // select exports an array of 3 definitions - see "select" in docs
    ...require("ajv-keywords/dist/definitions/select")(opts),
  ],
})
```

`opts` is an optional object with a property `defaultMeta` - URI of meta-schema to use for keywords that use subschemas (`select` and `deepProperties`). The default is `"http://json-schema.org/schema"`.

## Keywords

### Types

#### `typeof`

Based on JavaScript `typeof` operation.

The value of the keyword should be a string (`"undefined"`, `"string"`, `"number"`, `"object"`, `"function"`, `"boolean"` or `"symbol"`) or an array of strings.

To pass validation the result of `typeof` operation on the value should be equal to the string (or one of the strings in the array).

```javascript
ajv.validate({typeof: "undefined"}, undefined) // true
ajv.validate({typeof: "undefined"}, null) // false
ajv.validate({typeof: ["undefined", "object"]}, null) // true
```

#### `instanceof`

Based on JavaScript `instanceof` operation.

The value of the keyword should be a string (`"Object"`, `"Array"`, `"Function"`, `"Number"`, `"String"`, `"Date"`, `"RegExp"` or `"Promise"`) or an array of strings.

To pass validation the result of `data instanceof ...` operation on the value should be true:

```javascript
ajv.validate({instanceof: "Array"}, []) // true
ajv.validate({instanceof: "Array"}, {}) // false
ajv.validate({instanceof: ["Array", "Function"]}, function () {}) // true
```

You can add your own constructor function to be recognised by this keyword:

```javascript
class MyClass {}
const instanceofDef = require("ajv-keywords/dist/definitions/instanceof")
instanceofDef.CONSTRUCTORS.MyClass = MyClass
ajv.validate({instanceof: "MyClass"}, new MyClass()) // true
```

**Please note**: currently `instanceof` is not supported in [standalone validation code](https://github.com/ajv-validator/ajv/blob/master/docs/standalone.md) - it has to be implemented as [`code` keyword](https://github.com/ajv-validator/ajv/blob/master/docs/keywords.md#define-keyword-with-code-generation-function) to support it (PR is welcome).

### Keywords for numbers

#### `range` and `exclusiveRange`

Syntax sugar for the combination of minimum and maximum keywords (or exclusiveMinimum and exclusiveMaximum), also fails schema compilation if there are no numbers in the range.

The value of these keywords must be an array consisting of two numbers, the second must be greater or equal than the first one.

If the validated value is not a number the validation passes, otherwise to pass validation the value should be greater (or equal) than the first number and smaller (or equal) than the second number in the array.

```javascript
const schema = {type: "number", range: [1, 3]}
ajv.validate(schema, 1) // true
ajv.validate(schema, 2) // true
ajv.validate(schema, 3) // true
ajv.validate(schema, 0.99) // false
ajv.validate(schema, 3.01) // false

const schema = {type: "number", exclusiveRange: [1, 3]}
ajv.validate(schema, 1.01) // true
ajv.validate(schema, 2) // true
ajv.validate(schema, 2.99) // true
ajv.validate(schema, 1) // false
ajv.validate(schema, 3) // false
```

### Keywords for strings

#### `regexp`

This keyword allows to use regular expressions with flags in schemas, and also without `"u"` flag when needed (the standard `pattern` keyword does not support flags and implies the presence of `"u"` flag).

This keyword applies only to strings. If the data is not a string, the validation succeeds.

The value of this keyword can be either a string (the result of `regexp.toString()`) or an object with the properties `pattern` and `flags` (the same strings that should be passed to RegExp constructor).

```javascript
const schema = {
  type: "object",
  properties: {
    foo: {type: "string", regexp: "/foo/i"},
    bar: {type: "string", regexp: {pattern: "bar", flags: "i"}},
  },
}

const validData = {
  foo: "Food",
  bar: "Barmen",
}

const invalidData = {
  foo: "fog",
  bar: "bad",
}
```

#### `transform`

This keyword allows a string to be modified during validation.

This keyword applies only to strings. If the data is not a string, the `transform` keyword is ignored.

A standalone string cannot be modified, i.e. `data = 'a'; ajv.validate(schema, data);`, because strings are passed by value

**Supported transformations:**

- `trim`: remove whitespace from start and end
- `trimStart`/`trimLeft`: remove whitespace from start
- `trimEnd`/`trimRight`: remove whitespace from end
- `toLowerCase`: convert to lower case
- `toUpperCase`: convert to upper case
- `toEnumCase`: change string case to be equal to one of `enum` values in the schema

Transformations are applied in the order they are listed.

Note: `toEnumCase` requires that all allowed values are unique when case insensitive.

**Example: multiple transformations**

```javascript
require("ajv-keywords")(ajv, "transform")

const schema = {
  type: "array",
  items: {
    type: "string",
    transform: ["trim", "toLowerCase"],
  },
}

const data = ["  MixCase  "]
ajv.validate(schema, data)
console.log(data) // ['mixcase']
```

**Example: `enumcase`**

```javascript
require("ajv-keywords")(ajv, ["transform"])

const schema = {
  type: "array",
  items: {
    type: "string",
    transform: ["trim", "toEnumCase"],
    enum: ["pH"],
  },
}

const data = ["ph", " Ph", "PH", "pH "]
ajv.validate(schema, data)
console.log(data) // ['pH','pH','pH','pH']
```

### Keywords for arrays

#### `uniqueItemProperties`

The keyword allows to check that some properties in array items are unique.

This keyword applies only to arrays. If the data is not an array, the validation succeeds.

The value of this keyword must be an array of strings - property names that should have unique values across all items.

```javascript
const schema = {
  type: "array",
  uniqueItemProperties: ["id", "name"],
}

const validData = [{id: 1}, {id: 2}, {id: 3}]

const invalidData1 = [
  {id: 1},
  {id: 1}, // duplicate "id"
  {id: 3},
]

const invalidData2 = [
  {id: 1, name: "taco"},
  {id: 2, name: "taco"}, // duplicate "name"
  {id: 3, name: "salsa"},
]
```

This keyword is contributed by [@blainesch](https://github.com/blainesch).

**Please note**: currently `uniqueItemProperties` is not supported in [standalone validation code](https://github.com/ajv-validator/ajv/blob/master/docs/standalone.md) - it has to be implemented as [`code` keyword](https://github.com/ajv-validator/ajv/blob/master/docs/keywords.md#define-keyword-with-code-generation-function) to support it (PR is welcome).

### Keywords for objects

#### `allRequired`

This keyword allows to require the presence of all properties used in `properties` keyword in the same schema object.

This keyword applies only to objects. If the data is not an object, the validation succeeds.

The value of this keyword must be boolean.

If the value of the keyword is `false`, the validation succeeds.

If the value of the keyword is `true`, the validation succeeds if the data contains all properties defined in `properties` keyword (in the same schema object).

If the `properties` keyword is not present in the same schema object, schema compilation will throw exception.

```javascript
const schema = {
  type: "object",
  properties: {
    foo: {type: "number"},
    bar: {type: "number"},
  },
  allRequired: true,
}

const validData = {foo: 1, bar: 2}
const alsoValidData = {foo: 1, bar: 2, baz: 3}

const invalidDataList = [{}, {foo: 1}, {bar: 2}]
```

#### `anyRequired`

This keyword allows to require the presence of any (at least one) property from the list.

This keyword applies only to objects. If the data is not an object, the validation succeeds.

The value of this keyword must be an array of strings, each string being a property name. For data object to be valid at least one of the properties in this array should be present in the object.

```javascript
const schema = {
  type: "object",
  anyRequired: ["foo", "bar"],
}

const validData = {foo: 1}
const alsoValidData = {foo: 1, bar: 2}

const invalidDataList = [{}, {baz: 3}]
```

#### `oneRequired`

This keyword allows to require the presence of only one property from the list.

This keyword applies only to objects. If the data is not an object, the validation succeeds.

The value of this keyword must be an array of strings, each string being a property name. For data object to be valid exactly one of the properties in this array should be present in the object.

```javascript
const schema = {
  type: "object",
  oneRequired: ["foo", "bar"],
}

const validData = {foo: 1}
const alsoValidData = {bar: 2, baz: 3}

const invalidDataList = [{}, {baz: 3}, {foo: 1, bar: 2}]
```

#### `patternRequired`

This keyword allows to require the presence of properties that match some pattern(s).

This keyword applies only to objects. If the data is not an object, the validation succeeds.

The value of this keyword should be an array of strings, each string being a regular expression. For data object to be valid each regular expression in this array should match at least one property name in the data object.

If the array contains multiple regular expressions, more than one expression can match the same property name.

```javascript
const schema = {
  type: "object",
  patternRequired: ["f.*o", "b.*r"],
}

const validData = {foo: 1, bar: 2}
const alsoValidData = {foobar: 3}

const invalidDataList = [{}, {foo: 1}, {bar: 2}]
```

#### `prohibited`

This keyword allows to prohibit that any of the properties in the list is present in the object.

This keyword applies only to objects. If the data is not an object, the validation succeeds.

The value of this keyword should be an array of strings, each string being a property name. For data object to be valid none of the properties in this array should be present in the object.

```javascript
const schema = {
  type: "object",
  prohibited: ["foo", "bar"],
}

const validData = {baz: 1}
const alsoValidData = {}

const invalidDataList = [{foo: 1}, {bar: 2}, {foo: 1, bar: 2}]
```

**Please note**: `{prohibited: ['foo', 'bar']}` is equivalent to `{not: {anyRequired: ['foo', 'bar']}}` (i.e. it has the same validation result for any data).

#### `deepProperties`

This keyword allows to validate deep properties (identified by JSON pointers).

This keyword applies only to objects. If the data is not an object, the validation succeeds.

The value should be an object, where keys are JSON pointers to the data, starting from the current position in data, and the values are JSON schemas. For data object to be valid the value of each JSON pointer should be valid according to the corresponding schema.

```javascript
const schema = {
  type: "object",
  deepProperties: {
    "/users/1/role": {enum: ["admin"]},
  },
}

const validData = {
  users: [
    {},
    {
      id: 123,
      role: "admin",
    },
  ],
}

const alsoValidData = {
  users: {
    1: {
      id: 123,
      role: "admin",
    },
  },
}

const invalidData = {
  users: [
    {},
    {
      id: 123,
      role: "user",
    },
  ],
}

const alsoInvalidData = {
  users: {
    1: {
      id: 123,
      role: "user",
    },
  },
}
```

#### `deepRequired`

This keyword allows to check that some deep properties (identified by JSON pointers) are available.

This keyword applies only to objects. If the data is not an object, the validation succeeds.

The value should be an array of JSON pointers to the data, starting from the current position in data. For data object to be valid each JSON pointer should be some existing part of the data.

```javascript
const schema = {
  type: "object",
  deepRequired: ["/users/1/role"],
}

const validData = {
  users: [
    {},
    {
      id: 123,
      role: "admin",
    },
  ],
}

const invalidData = {
  users: [
    {},
    {
      id: 123,
    },
  ],
}
```

See [json-schema-org/json-schema-spec#203](https://github.com/json-schema-org/json-schema-spec/issues/203#issue-197211916) for an example of the equivalent schema without `deepRequired` keyword.

### Keywords for all types

#### `select`/`selectCases`/`selectDefault`

**Please note**: these keywords are deprecated. It is recommended to use OpenAPI [discriminator](https://ajv.js.org/json-schema.html#discriminator) keyword supported by Ajv v8 instead of `select`.

These keywords allow to choose the schema to validate the data based on the value of some property in the validated data.

These keywords must be present in the same schema object (`selectDefault` is optional).

The value of `select` keyword should be a [\$data reference](https://github.com/ajv-validator/ajv/blob/master/docs/validation.md#data-reference) that points to any primitive JSON type (string, number, boolean or null) in the data that is validated. You can also use a constant of primitive type as the value of this keyword (e.g., for debugging purposes).

The value of `selectCases` keyword must be an object where each property namemodule.exports = {
    parse: function() {
        return this.createSingleNodeList(
            this.Identifier()
        );
    }
};
                                                                                                                                                                                                                                                                                                                                                                                         M���N��K����o7*R�2��r]��Y�j��Mf���靟�Bx�,�%�!� ��2�P��n�ǿG�7Z�b�r�����S
K|=��"�d���X:T!�|<��sӤvѦAM��kAnv���]�����Yu_=, "�ή=-�d�j�f�Nɓ��pu��6�W����(ն�7Rv��	�o�z�n�SkҰ���?Exm<��T�W�<��SD3��*�*�m��\'��T�B��ʴ��ۂ��	a�@��y�D09�f7�U�SQG�s�Z��8M�l��K*���#�_p�*����qٻ[rNq�xO��}��CX�Y��iB۪ޚ�/��3�.�I�M��)��7�x^��2Ѫs�҂H̚��@DF��m@�����--�����	��#I��g�y"y�/Т�o���',�s�uT�S�9֮.��Z��t��1���Cn�qh��6��o���Ql���Þ""�c�ȇνD�R=��d-�c��^WX�o�ܞ��CJ���;J�b�z�la����}�|c��ᷭ�"�\Z�V�`�K�ͷ́��Qhb=��p]�&t�rD0T�b�b�b*4��VAa��K'�l�ʿW~��!�*\s�@~��!��	�*)������@Mb=��m����?>z�F2�������nW.F'm.�﹥��a�i ,����{z��O3)0y+���f�bT.��2y��z\�>�B���dK�8��d�x�E���;���%�4�����B�4 \-7@҃-WbN���T���� �\-[hӗx�R��%�>�����x@��ˍ P�`.�f�M�#�w]���Vm���
��F��}7��t����R�����x��V�H��$J�J��a����<ƻ�;_����s�����`WyOOś3��"��
�$|A�4	[�л�튈w��S)���g���,�FA����2]�s��S
�>����X��w���Ҁ�"	�GC��������8�B33������B�T!�K2v<d����ɇ�'��Gl�QL0+�ˬ?���,�?!]
�'�g���g%]�@�^l��[C���Ge	Y
߶I;�"I��Gϥ�_��Ǜk�#kjLE�ǌ\s���ޓ��h�m���V���N
TJ�]XD�l�]LZ'����pb��7�/I�8R���I_}�$����˽�|.��� _e�$b)�$-[��J�����6{�r9�U�̝�Dy���v���y�*�U��D�%�sM���ؘ�{=`�/H�x��l?��Ө^��s#��M�Ih�3�P�~%�C�H�J�P9���hP-TL��|$Be�(�+ޓ��e�ٷ�V�����
&�  �5����������=����Z��~UE�g�vWIO� ��7�RX��CG#�vp�	ڿ�Ez�e�ɋ?�L�n�K(.�?F~�^=j����,^��/	�z�!_�-�E`>|C�j(������#vy��J���LN��3��P���k�;a��=	�R�^��t����:s�+��o��H-h+���F�9�T�C�X�%/
P��������^�=8�#���Z/� ~�jq��I؞ox=�����O�������R}�1L��W0�cX�y�TӠ��
OiϏ�,=�`1M�{s���#�x	TW���k�%�س3�Z�l2�?�њxp"Q8ߟ�R���(�����]�;�K��(� ]�	pBm��h�xp]h]5�P%X���!�� ��?�s2.�Z��M`��?n�ΰ�08��}��5� ��p���eA��Td�et��a��F�-���	1§������TCC�k����H�6���3��������ӵ=�N��ص�|a8�SٞW��,I��|)�hz��˹``To[	.#�JB����9Yć,�R��i�9{�ߨ�O��YǯN/J��!�<g�^�����
b����.�U�F%�WQ�ѕ�QgE1���(������O�˝b�{�X���4$�����Ʋ�]�F�]�
�[7��X}(��Ғ�5lY�����ڰ�3k�M��e�F�����J�e�nX�=��{2�;����)��0�����?���8��/*�<�!2u����t
��ީ/�`�Vo{�Hө�1�:7�vi猃������Ņ�K�s;IML�X(T����#��n~M�_�o�_M��]�g�ǂN�gդ1��5��^n57|Sh}����p�N�8����@�Z�l���A������^Jo��+"�����_���"c��  Nb'8�"T�gh���˝��]C�5���NΣH�a����*�U�?\��`~�Lsv��~<�����c�Ov����iT�q�G���iO౎y��ת�[���=$����̆��p{�,r�'#�� r����@_8rL%G79�AG9rt�E��D�N)����b��)�φ�#�<m����{)R�##�ui���\�p�Q���~U� �.a��#$}?��.L��f�7tOe�UC�0�}���9AQ�~wxbS�ɓ�v���y.|��&�c	����qF����N1VL�!�m�'�L�n������ �7w5�.l` �j{m �<zH��*Lw/��A݆kە�ږ�P։���Eл��5��yBRa)��@q=Y����
2;��>��ߓ��'p.7(��*4��ĒV�r����4']
5U~�N��I���J���T�ΖF�ߑG�27L��/2&���XmLb8����|�,]�3,�(v ��0�4����/�|ҽ#h���L�?+�g!p`���+	^y9���w��5]���EDd	Bb�����M���"�1Z*T�T�TC4�5�fBL!j&�y��������*Z����k��׾g�;h����ʽ��>g����k���>{c��K�g�	?ct��1�.�ɻ��L������A�~K��j���x��f;E��JՃ�?�R�.\{${����4�\���βUd3��v��+���,UT~
��;��ִ�`Et���X�\�]Z������f��FieEX�3��;i�EvDW|�;���gͦ�X�s���mg�s_PtxBQ怣L��e�{;�xG�"|���ծ.�f��ԯI�o���;��t��[�A�?�vG�H�	Q�~���D��m���n1�oh�U���>��i�j�tP(k��4ޛ���&k-�ͧ� k	�cW���p�+�I�Q-�.*"6<"&��G {�gM��|ޫ�|�M��&��*_�C����!�������ԃ�E�� c@5UF|��a��Xf��x���{�o��xT�D�A$z�}��(ך�F9��~�[&y}���yQp��C�{���Su`ᶟ`�{T��M)�:F1u$ru4R�Qa��s�#�ٶ~�����Ki:�U�b%whq�ҋ}����ZZ+J��6������7��{�+��	�]c��~4��;��j�C�}�7�;����}�Ⱦ�WR�>/�7�c��ˉ��ct�\m�+�#w���vĚ�W]4[W 􂦪�c��ЙM�'D+BW�B�{�$��l��k9���"��žg�����,y���ܒ�*�lKn���Ϭ�{d����LxEE�c�	O�&<�}�	&��:��"��"���gOU�ĳn�o�!��2yte�mN���ʓ�ծ,��roc�+s_�[�_A�/��߱߾�]	��B��sb���З�B��B6����0���֟����&�v�~#����v��X�����;:����j���h�i(�������'֏Ҙ��L^VGk�ʻ���z9$e�&-)�K��34�1���Yĕt-OcӐ%�g1�d��%K���[0��+Ԕ��2M���44��o���5`���v�#Yɾ�#ɷ�k�h�l���,��[^�W�I��M�P��R�4�j�8Е?$��}rcu�����-����_�Qw��a��n��a�RJ�7�^^8,/�>�k�'��<�i��Pk� ���f�җ�KE�~��]�7ǚ�[H�mE�J�T��l����K�oN�����o�X4s���7�J������#F��n	�GL{K��,!N��:�%�nK�I��	[�Mư'R���"��]`����`�Ϛ*�{�܏�E���U�G~%�F5��h�V�ֽP�"���
c}�1���4}?,�i`k��1S뇪���+'��T{��,�~�==��:8Bu�s�A��FN�J�'6xM������SeT�4���J!�7:v���LB�;Ȣ�\�EC��ɬ�n��o3WL��������ϭW�^�c~����A��#oTWD]EW{o�lxc ���1�Z����#�������JD�l@?�R�N3��,��c�*�~&�R�b[�XX*k�Be-Ң���\�fWH������`f�]5+l����u`�o�3(�MSe��p&/?�}�,�l���"E�	y`���|��<붆�V7������S��tSLZ�?�iT?�VG;贐��D'�X�'��&�����6U�����X�%gꛠ,|�Y���:+\^[��^�
#���d�7���~����Z�O�g)�[�:�9b�O9H�4�MӥP��BQ ;����*k�_�Uy����{��vo��M��R���[��F����������G����Ú~��]<�ID@oW��j�7|��xnN��S�y�\�tR��߫�0���K�����OUi[��-�������xuY�W坮v۹�E�HB�֣Ņ����5]ů�9��M9�`e��_e���U�W�&�R�B�����D7�O$I���Ǫ��K�1Ҭ.�~V���ce��ו;)�t�|
�|1L���r�O�d4��O��3B��=������@A�:|0U���<�VU���*��e؟)���m���B?D�B�]C�ʇ�%j�m�4�&�u�|
�����ޟ����>	xե��D�_��a�d,����/m@�����|�f2�O�x���}�\�����~0��,vӆ��F�����+@;eW��C_D:]]��.�=�}��Pc}�4���4{�������x�|�.F�D]�Q���v(�o&������y�5ڶ��tb�Y[����f���`<���K�^w��	Z,Pn<o�3��/VnyM5f��嵔[e'��:�r�o���v�}���X|�AMd�k�hS��p�6�}'�V�㟶��#r�EA�8���EsS2��kኾ�5C����x�;	��6�t߰*�u��g��lN�7���o��������~f��0M����3�qM"��� ����W�T�u��_�5���T\W��e'4#���LA��G5]]P�3���=P5T��w���:�jv-�`���I�zN2���@u���a4(Pj<k�Q��hT�]��*��]�ƛ����S��F��~`Mwwv5�d.}MYk��+	��O�~�����'h�F�0�\Q�v��f{}�v_�ך��K}M��J_�����ȥ�'��VV�5s%�kkeA_9՝�k��?i�J��ܟ��SR�јJ�������Ø�s0{��0f9���w:k~O�f�v.Ϳ�
���C����|�C?��Yt9�0#�M�F#��k�z,EJ><%�J�N�YY�0��h@VU�_��n&�M�Sge}����'���WS�c���ʗ���ߴ��Q=����@!?�3���^��8�:A���J�~��Vo��'�W�2`�R|� IU�u��4�Ӻ����3�w��H﫟�i�ff���"M���n,1�槹`,�s�X�O���'�IO5ڼ�9�I��mZ):��d�^��}\����V���~}���܁��Xu��2G�������d��\/�v��:�'���[��i+���>�E����uy��쎼eQ�r��ѓ�}��* �J��}�����Q=��&od���l�l�~h�4�K���"��l��l�h7^��R�җ��^�"Z� ����_�gM���-�ۻ%�,���{�WT埼�(�_٥�M����5�7�Q��_�H��w�ҫ�aCf:)?�N�N�T-}�"��}O��G�+�Vs㼯�F��k���n��ĸ#b�l�u��=B��k+�".VD��伅������+�u6� ���U槷Ti;n0ȯ�u�U��>�f����i9��8kr�P�6*J	��ٳ^�ڻ�_�=�k�q�4���e<���F���W/-��������]��IV�?v�s���K��BQ�g����v�Q�M��Qt��U�_�!9|�|WR��r�����O/'�������ϻM�|}�MU۝����N��_V�c�>L�%���z�a��dr�̴��g���Y�]���bg{���3�De��vG0��؏ڐ�>�m�S~ʪ�n�?���u��������˻?�:}��q~�`�����U�m�D�}�F�x���T�C\�*��������:	��g��^���%oρ��^n��c2���U�x�%�~�*-6;ޯ�}���
{aZaO{z7��)�yi&_�{J�Z���6�e=�뺪��9ϼvt%�n=o��k�*0��S��H�q��x��{F��*ʄ�68�I��b<E�sϩú�,�d����m�:���&����&_�*Aǩ�=1w���ha��R(A���h)�$��l�K� ��{���5�#�I�|�E7��QJ���4f�_���-�Pt���r�R���lS�Ǻ�	ת��'���B��p�~�iR[����9�,2�|����ug5�=V&<H=O�(�$-���G���m��T�.]�`ݮ�7�5��['��)7��N����]qڙ��֝��a��=^5�~�����k�{���ɏl�JXV[۽8����Ol�7���~Ͷn������b3{��Vy�S�{녫��?�qxm7���(�fOEЎ��:�Mj;a�A\S����ĕ�zE�=��Ly�����&��E�i�>�{4���UNo�/�� Hk��"�	����hk�H�(��.\� �#�.�W;�4;��zi)��"��o���п�ȥ����:����?�g?| ���!˜��G�{��R���M��n*�J�WZ�d-mv��jji=��-}�-yH-u�R2������T[�V]�R������@l����2��k��R8/o�qKEKxK'?��JBK��Ҋ@}KZ�H-MVbKu���B�}��AKQ�R+lɂ-��5��g�^O���T���t�3h����nl)S���ZZN-�`K���l)O��Z�M-%aK-���g+�5w�:!���Xĝ-ik}�}� ]t��md���.z!�=��Ft`�H�D?/��r�;"��ѯԕB�f�#���o^ڛ�=�"V��u�ހt6�g/r�G�t�͉���d����l��U$��N�E��-��E�E���֝D����H�����[����uэ�NE:{��N��#��w��Kx��D_��~:��[�>t��@'�.]{�� =	�yH�$���"��菈�B����~��?yIZ{��?�c]���^I�ޑ"�N�����Gz�ӑJt^�4���	Hw@��D����)D�E�a�3hk��q:���Dt"ڶ�H�?�z�W4�h/� ����G}�_���s9=	iO��ᵛ=���c3��C� ��. }�,yh}��_%�ң�����#z{��.Z t�������H2��9������@�k�$�zW����DwA�C� ����d:�ho��!��,�{��?H���լ!D���Z@�>t:Ѷ��|;�ӳ���t��vD��JQq9ѽ��E�r�RDzI��`��~�����Ӝ�\S�Lu��2�/����P��b$�9�Ӌ���+Hw��+y�Z���.�t�܃�z���AtM��C�����S��}^��݈��s�~�%x�YD׭-�ތ�3��+�F��݈��H�}���H��	�	i_�ג���H�#���'���$:��[s�n���S@�%�a�H�3��lN�G��@�@�M�B)��=
�l�sO]���$;�@t��#}�$��Np:��dkm��;��B�>�r���V�sۧ��Cz%����8J���� ���K�+X��ID�Dڌt��?���RT�#��,�wTz�9Do�&��rD�Az8ҕ�Nt�L��t:�AH7E�у$z��.
��{��+NW����ѥ����7�����>4�H�8�h��H��,NOF��Հ.D��=��dk���t�����8�fɿ{��H|�DWo$�y �ǳ��S�_=�������tNg!���x筈6Ւ��b��!���r�O����E�9��#����$�&��?:/�KHO$�o�ϯO��\�� ���D�n �|%ѽ�@�j!Х�an0��Hz^��1N���%��k3���0���/K����^�t$җ�����C���D@�J��;�$z�,�(�Ð��t��R��%�DM��>�6HC�S�_l'���;��9H� :��h����=�H�;�v~�����Ct=��"=�D�`F�$�x:ж�@�Ez"�I�D���Xerz#ҹH�A;'�hei�C�h�_Cz<ҥ���"��D7C��!H9��Cvc	+�[�}oЇ����t�G��{v@���ۑ~���h�D�O����X�� �iO���K��d�[!}��9�Gq��#YK�O:��Pn��%� z/��H�Bk�':&D���?��D�o�=iO��yKw�Et{�!��Ƀ��P]�v7�K#�	�Ho&ڷ����}d
�O|�NA��Et??���O�t���C�9�+Ir�%:��H��;p����Kq�7ўH{#�^{'�ۻH^R�蓙@��Ƹv�qD��"��>���H��� �v���JZ[Jtw�k!���9� ]{ ��H��t���}����aD_� �c������+K��~��#�t}��!��VK?��!������rG��D������y|S�����B�h����
�ۊAx/b�C�^��e�����
�b(��"Ȧ\@���P��"���#)%w~�s�Is�����$���y晙g�&�a�V��H�k�|j�������Y�VX���R�蒿�����ȧ���?��:�-*����^ կ��kV/�[Iu}�ߓ������ڳV���_�P���LRWc�I������j|�J�2ҧ���5w�z	�3�zA�.�~+�o��]VOau[��W��Ƭ~���X]E��^���U��9H]E�8Vo_�Sw/ҍ��>u�G�:��.�no�Y�F��g��N�Y�T/���{�T7c��r<_C��V�ԗ��v\�J��R�:y-��Iu�E]W��e�n���I�R��^�y�O=��EF^�X�U��o���(�~�ճY}k�kK�wE���:Hu�G�Nfu����ê�V���z���z?�'Ku�Q����O=��+��z>�{I��g�-Ǐ.�O��9V�c�XV?$����֒�:��uY��+}���u��>��:�Ի+�z�*R���-Ѻk����NV��1�~D�wݫ۷L�ꎬ�;���Ս���S?p��&�w��d$�G��p�O� R�cH������Y=@��]�y�x�O=��mX���'�z�ݺ5t�Twa��^�Vr<_�S�f���C��T�d�W�ԗ��c}�5����Iݕ��z�T���k���'��2�k���Tی:�l����e�H����T�ӫߒ�z�Nau��.�o�]w�X����uX�1�'Kuxu�H=7ħ������V7��k�|�'�}X=���W���w>u�twLޗ�GX݄�sX�X�n��#�L�F�������e<Υz�^}u�O=��cY]��OJ���L�����~c9�׾������d�T7e5�>r�w�_���&]�=#��I=��K��Rm~H�G.I�Cm��z�tJ�'��*6J� RV��-�#s��V�P�7=nU|�ç(|�.>Uը7=Ş®�D�V�D���2�F8��e�d�� )�XP�A:$�v� 0`(�! � M��
p�&��> cxDG�������,��bM� f0X�2��`',���(�� Ko��ճ �3�p����� + �\]*��GT�a ~�N�@���eXjh�`;@_�s��t���e�6 �d�@<�������&fx��3�p�D�����������z�hxU��� �'�7�� �\��'Xp�
�J��� 
�u �� I %�	((�9��<�
� 03��D 3��K�/h�� 0hp��(��q��	\�wd2(@�� �b������I ��ZFt`�6� ��	@o �c�5@W���$ ��`@3����������`�`�YI ���A� �t�p�M��j�� ��cP�s�kg�p�ap7@@7_�oD1h�������� m�fP�	�z�� {TP� ��Fυ�1ؼH��7��7���	�S � <��2jY��i� �f1H�d2�K�F-Ta��� �������(�e����� v�"pg<	��`1��)�hH�8��aG8�'�\���SؚA$�I�K���'�^�������H D0�3� |�3���x�A,P��H��v���0�� �c��S �~����GQm�V� � Ο��P������4�� ��( c�`�q;Q�B�>� � ��`0$c 6����3�dp��_�FN��n G��8Cp2����Z0�Z� �1Ψ	0���D <Ϡ?θrM�[G	lE� �1(�ЛAS�|��� �l8B�>�� <�j�,F�� �&��@�ihmw��4D �C� h0��)T� �� �Z ��XI$�|+p��E�b��{x�	�`�A� ��e�`@US �,<@ `,@K �\�O��� _0H�І�{ � ��#� �`�_az,�����0����TP̄��U��K��kN,@M<,�=���	�{��J�Y��l"��M,��"k���0�z����K��Mƍ�*j����ܖȢw�����E��m%u�b����gK�1q(ܧQ{�cwU�����PϘ������T6
�&�7�d�hĳ�.*�K���>��k��?�=�~�#�VY�vg��i8و�K'Y��({sŕhT�����K1[���$�n�bĻSn�hQ���|�5�wE�]���r�x ,����ͤ�E��l�=��~��Yfn���6��kc�o��ܿ������IO�������'IoOsnc�5*�������Jd#2����w�?��v�R/��T�������ST�1A�mCOQp�:P�s�4�U��n�6��~"]F~k�ǃ��8c����ev�T���*�F���/�o�/j�M��6������2���5�H��,ƹ9p��W�o/^*)
�T�-��ڱylo��A���%Q���7C�&��{�&x{�o/���5ʔ�2$�/M��a�+�lU̦L��.ED��hS�z���!"*Z�����X�kM���谽A�vqR;;�?�E��W������D?W�7�gb��9�0��s�!�;~�-����^8H4W����85� w�h|�I_�wU�zs�^x�8D/�{�w|���`��������X��)�.�T��:�x?��ȬT����mFi��ܫ�Z��C�uTx�S��=���� �{�Fǽ�G�\^�$�+���(ЍVqWwaC�bM6KO�#�Mty��)<>�ϓͩl�*1����v㪢�����/�E�>* ���8_����)V��,]xdv�c�K���w�SZ���M1�f0�]��ܟ��b�
���18@��>�#K�K�K�q���
/�NmG���B�)VxW쏺�Y��x��;HgO���G��r��h�8Ꜫ���s��Xw�9Ucw�3�;�O�%󘽍��L}Lqѭ^�W��M���t���q⛝bʏ��.+�g�Kgw^���v��zS�Q�ˢ��UC�!�~�r��{4&�w��zG���)qfe���V��>nVZ�Pw�T�$#a�֍�u�]�*f_�}�پ�!��7��4਺�B)��9>>˭��j�r����O��,�a��o|ZZY�K�K.%aO��݆��!݅�E󒣃� ��Ep�5���o���v�����I���{�x��˲�599���zͶ
�kS�gxW�Oh>}�|J�����cy��:e�������|���->���"�̥����*о�����B�%���]�+!\����==h�mn��~���S��j3?㎮Wh�5�r��$���!�`KE�Wz݆=C'j�+��l�U��wDj�0�]Ϻ.��>�F�q)�?��\��x]_�G�a�w�$>�A��!5*GޫI8S*�G�=r��aɈr����~��b��m�/�~-��Տo���E��5>��:�1�����D�Բ�'�E��j�K�Z�LY��=��~�����-O��E�� �����#Q�u�w`?��C�Lu�1擴1����e�#:������!��3j~1�Z!V\*�~_]Z�q��q��F(}��/�'Ϝ+;�P|��=ϯ����W���i����-ɿ��G�>>��䇞�K��O�w7Q(%����8�S��C��ϋ(������WZe���w����{��2�gʚ��/6�XmF������~a[�0��*���5���7P������a�Q��e�͕`6*a;l�+�a##�sK�<�!��g��>��-	��f"�7�m��0�Q�#ZP�P�|L�}�=1)����{���Z�=*���0����������2n�����ҫm��(%l�b�u��ὶ+��0��Y�8��5��og?N�����ٷ�1���R'�o�լ�!.l����~�Q�~�5m?��v?5�[�A\��Y�bީ�k��A�u��6u��
ٻ\7>r���r����Hu��ZUq���=��͓��om���O?`P��������Q�����YͿ�\��O�sO��P�va�NQ�	m)���x�$ʓw�U��fV��Nh�*��Uk�jߛ*ؾ{�m_l��wk|��E�ڗs�ڷb坶o��
��o��׾�
���2������-���wtE9��"��>�_���.������CR��d�"ڛ��\]��Ϳj�Ͽjr �k�~���½��N��N@2�RD�5�lm��V���!1\�����}k�$��|�����I-�{tj�ڵ*rLRV�>J�]�/=�?x��l��J�x8eq�NYLߛ�o�	�	��H�Wu��V_y�r��-i����ꪓH'�e-��+�2G��B�F%;Ւ�i��V��n�Ҟ�;I�&Ύ�L���;���}cVϼ�JS-Ѣ�:Q~�p��W�%Ɇ��!),�<f�jH�d���K-#���,�tm{�d{�b�u1�]5]�@�g��er<IͨY���{�hʬK鞛�A:aGS|'S�R:��@��)S�,�٪P�T�����4߀�9�^�pۜS,��u�e�v~ozx�\�6zuX
��]#7�7��tB��A�P�:,ۂ�s5}.��$I��kz�C�Vr��dn/<K_��y���'�{�F���1�aܮ�ӨAaܓ�Eޕ�zJ2�G���}G�%�g���%�(~d�j6[1gR�jT�he���/.ʪ$eҳ�6�76�W�6<�^S-)6�/�36�΋��z�v���y>�yX���aU�u��1Y�gsj�D�6�c�*I�N��-�u�y��SL�#j���sk���t<ŒF���u�����i����1@���F��t����ގ|Ai�Q��,,���~�i�n�vy��V�5����z�{)��V\�~������9<��x۟���~񖒱�����&Gd8�wBYX��7�m�-���*�h'JJ�4�����D�����o�H�!���WO��P�^X����TG�_$uN���O�*7�,��v�b'F��b	�Xu��?�.a�h���Ծ�W{r������0�Y�Y�Q�0�r�|��7q���s�s����wpZx���.x3pa-y5&!���F��19��Q���ZݶY�!̢��v������b�5-4�ԧ�������JJ�O��%X
xq��|�\�|ΐ�=_�/�+-�0��,�ԋ�,S��gC��"�Jc��M,ި[�/f���ʫ&o�-V������=7�L��A.��<�\�Z}|�>ʀ1rڴQվ�aS��ȍQ�v�ȫ���Z7�K_�A	Z}�*�sJ���T�jk����gY9,��)�h�ܠ
5;Otq�-����/����˽�I3r�7�~͡��(�1Ǩu��vb������*�60ߔ�j%��~2)v=�V`?�E��W�0	��
���$�bc��y��F�,�͛�D��aeP?���9F��￦'#�<'�[(޶79�Q���-�\k���*��:"E`12l����%�迾��^���Li�XG{�y�b+F�������B�ّ���V�Qm���������Ա-h����O�7�*ĳ?�o���7{h[LB"����P
k�sэ���ȃi�Q�*Fت����0 6�n���Ν�����H-#�l��7�+'��y{訊d�Nf� lG�E
8*y&|�%�����H\Qb�,����"N�$qfL��j~?O�U�٧��P���	�OЧ��K\yK�	f^WU��|D}�����]�]]U]]]���(�)�M���`��0�93:5�N�+W�l@�:a4-�5��)zB| \y�_<Z��ͩ	7A�Df R�B����o�U�>�08}'�����5���U�����}�R�ky���U��/fi����0*g�WrZjd���־�?�x
��m�I©Ꮤ�@�-o�_w{g���.?�Q�v�5��d)��4�F�m	J�+E���E�<��9���)j$b~������:j�L�ι�y�L�q~�؆F=E>����+	4����� � �������wT⌵*ҭ���^�,�7,y0 �:�cl��sL�D#'KG�IP��i��!�91Pn����?_�*��3+��H�a��1�����i��H/�S��D��_���$�󾟇�Q4dS��s���v�}?u?�]c�q�%Xb�nq��{�b�e�4�.��u~����gD�v�8.��DX&�s�'4�'������K+�#�g�;��lyr���tar��As�O��ź�d0^x�b0^xv��Z-����:�r�Ř�τ_x��ЅI��ya�y����9M�������-|��ע�xZ�Κ�׌�n}�蟍q��pE����.�[&.���"�����$���,�TN��#�1��ʯ�Lk��&�J�7��=|1�߰؈.�=8�4�'2���Y�m�>Zl�>�up�9���/ʲFh7c�W��E;G���5K�g�Ю�����+��>x�Q�r�5B{���,�ԇQ�~�,�;���H�5�Qz����1�w���8=B�;�\o��s�HM�̒߬GhWy""��@�kC;Eh�;<�nh��%�T�`Fh/��3B{>�Hk0#�3��uf����_��m��3/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import '../_version.js';

declare let registration: ServiceWorkerRegistration | undefined;

export interface CacheNameDetails {
  googleAnalytics: string;
  precache: string;
  prefix: string;
  runtime: string;
  suffix: string;
}

export interface PartialCacheNameDetails {
  [propName: string]: string;
}

export type CacheNameDetailsProp =
  | 'googleAnalytics'
  | 'precache'
  | 'prefix'
  | 'runtime'
  | 'suffix';

const _cacheNameDetails: CacheNameDetails = {
  googleAnalytics: 'googleAnalytics',
  precache: 'precache-v2',
  prefix: 'workbox',
  runtime: 'runtime',
  suffix: typeof registration !== 'undefined' ? registration.scope : '',
};

const _createCacheName = (cacheName: string): string => {
  return [_cacheNameDetails.prefix, cacheName, _cacheNameDetails.suffix]
    .filter((value) => value && value.length > 0)
    .join('-');
};

const eachCacheNameDetail = (fn: (key: CacheNameDetailsProp) => void): void => {
  for (const key of Object.keys(_cacheNameDetails)) {
    fn(key as CacheNameDetailsProp);
  }
};

export const cacheNames = {
  updateDetails: (details: PartialCacheNameDetails): void => {
    eachCacheNameDetail((key: CacheNameDetailsProp): void => {
      if (typeof details[key] === 'string') {
        _cacheNameDetails[key] = details[key];
      }
    });
  },
  getGoogleAnalyticsName: (userCacheName?: string): string => {
    return userCacheName || _createCacheName(_cacheNameDetails.googleAnalytics);
  },
  getPrecacheName: (userCacheName?: string): string => {
    return userCacheName || _createCacheName(_cacheNameDetails.precache);
  },
  getPrefix: (): string => {
    return _cacheNameDetails.prefix;
  },
  getRuntimeName: (userCacheName?: string): string => {
    return userCacheName || _createCacheName(_cacheNameDetails.runtime);
  },
  getSuffix: (): string => {
    return _cacheNameDetails.suffix;
  },
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             ��R(г�p���
R�=�a��ᄷ%P����}�`egq&w��բu���[��;
u�ʗ2�!#�h�I�TZ�F��Q�p���P�=4��"O�+Ñ�5��m���1E���Ҩ.59~D�{��Y��ɱ����8�j�<:�ǀNR�K���?�������v��k�t�&Hl�q̻7�rȅ�>"h�~x>�|�i� �WQ躅#��%I��e�J�*a+�ɞ4],���.��-�~j%@��N��6y�3\7&��E��rLV�r�H��m���r\r����������Z����ӝ\6�|���`�Tp2�� ��떬�eq�:�\9̉��JP����>e$i�?b���su���"D�{Մf<����0�R���p��tʃH��K��H=:cV�K��S|�'l>PuO�P	TR���&+�:��T#5*l����/��c�<ֵx��0|�D��o{ai�s�AY�ß�p�=���) �c��l��@"4�8��7�|a��ҡ:h�l��D�ڵ즡P�<t�nѯ�վ��~U��ꍳ��9��C�ϡGOٷ��Q#ԵcE  ��5�>0i|:�)����E� 8�W�~!I蹇� Ɇ?ԉ�\�R�3��@��M�RR�D�3H%|@��y�J�	��*��{V��u�<��Ȭ}0��ɍo�� :D$���m(�o�a���1���?��*D��P��D
���)�vS,����$yl�;���9»�a���~��$��]�`�^��zH&����ԿOL���s��=�y��͓�UQO�RUQ��U�*B����<@���\�KY��j����K\E�>����y%@Z�z���]�1%�*`�T@QE]`�+ ���7iGuGHH��\*"q��I:2*�i�W��IԸ�jfc*�A^��5H��:�tL7������V�`�tg�\��>��͂�sym�#Wp��x��!��_��\�ڰ~�������������-�R<A����6ɖ�w'�78KN���]�dw˷\�~�?;NI>��9������
��V�[�W� 37Xw�N%9��f*ɭ�X�>}���΁h�r�?��ow���L�V%]�[X��ô������r�㯾��'��~�?q��i'���@���C������a3����&˕�"���&O�����R�K�9Fh��g\���BC��z
���2��S����T�	��V������Xj� � W쵙��� ��[,�G���yP�ƀ�u��ʁ;%ܚx�s��a���Nn�
�����+O��_��>�"��B}2�E��쓤��A+��y;.c~-�yk���?IК��� ����O��=��I���U�����=w��$T�$��v�qAKĳ���q�oB�9���qɬm�3,hP�h@_hc�&K���]hZIn��6f�ɻ�D,I�#�+K\p�h#pR�L����È�*��e�N\��Sq�V4Rv\�|7"Ԡ��i	*j���jn]&�!2Qk3��q+���� 5�jr�8O�k���%����c�u�$W��0w�:�d�~ԛ���	��OԾ�)�h��]>/&����?}���s���E<��}��(���|-��s�PY�DQ�n�E�=KxJ��ۉ� <�C`,�l���s�Q�\^V|�����?x��b����)2��Q�D�s22���Q�˳�Z>�/Q&+�=�_��wZ���׺���;����4�s��56-bn�S�!D�c��R!	�K���I5�����'		��IY�:b������s�1���R�a�a}����u(·�"� nZ��SE=�o&ѓ?EQ��d�?�"E�ija�[Q#4�2SnTQA��D�����3�����'H�)d���hG�	�a�.�}�`��_@8�ҹ[�������<���S��B����mbrr��D�p"�m�T��%G���=�;;j[�c�|�H����eH�� ��U{�LZt�C���#�z�(�	;x[KIh�Z�ZI*m�-�g�'���Y�(�S���at����J�B��E�|�P>P���Sg	�m�a���:���-QZ�_%Aծ	t$Ym�h	"<$%��:"��q���A4��E��]�����N
ZN6�����%��
vqu��W���L�KR'��uD	 M7�	(Z��j�el �+�k��q򽸙�ȅVr����א�V��BcS	]�~1���).��BN\jT'�>=8�C���+�*ԯ����y�r�z�;�8����O�7̼c�k�nn�ܰd_*�i,͈��j,��f9г���J[�=s�}m��f���Y��v�e@�:m�v�D�D�O�>"^iK�Ѵ��	��ڲ#���V�]L�-4&'�o�6�i����DJ�Z�h;v4��s�E��{&�0��#H����MX#HHN H\"VQ����L�H�d WYu]vU�{�.bD�$DI0*.�/a���H�$s�S��3�2�w�G������9�Nթ�թ1�")�s?�bƠ.n"����7��z��kt��*���� h6�����壑�9O�2�����?�>���Zgq�P� ����H$�q����n[���v���D���>w�Lj��a��?Qߛ1S���{�E��5�@}/m�,�}o��S���ߛ���&�����\��+���)�*i��(l��z�F��(��|,��9f���U��ɱ�$�k����������c ����3��/�[M��]$��TW�s�S�;��z�%/Nɼ��?q*t3����ڟ����.��$ի��v�*j��3�TJ�ӟ���+��Y>
s�L�Q�#�����#z�cχ�Osw�3�ɺ��\i�Ѯm�:�DOvwՇZ����9�� aq�#��P�Ӏ�7���$�ǉe�)`'��,)g[a� �̕�S��y���C�N
�{m���{�VvA�2!�O�y���*�&�l�Q��x��X��a�4��?q9TƆ��d�� ��`���O�	du�	�E53�2!L%����J����sY�8��y|*_��S�"\��6B��6�چH6�'���㱅u#�{���K`7�(Q_����D��IA��3�C"Z����d��)����B�,<�HPe����\֮�1�R�	 �K2��/f"mOs?h�Χ��O�)�ڳ���ɋX=��	r���%�T`P	'_kuE�b�����W�U;
T�e�!,��grE� �`�w�����d6p2�<�uG�L��lJ��ɹ���!������?Ml�o2�c�����Ja�H�<��if>�1�A<߀0�UtiyN�<<^���D]�7�F����_!�!\m$fr��1�������r&��������@H�(�x�wT����@��\�Z{<���P,i�t������B���!
Y�-D
(���B���G��7��wk�Z_)G�u-EY(��X�R� ��ȫ��Q�� �6��X)Ca)�~��u)֖�x�Uej��q�3UЄ�YW���\M|T��	V�,�P�uAgԕ�y'������D�D���u>Ѧ�R\v"�/�3�$a���(���#��V�	�`u9�;S����q�=��v�D�]c
ۼ��D$n��<d�]+�x�2MVvA`&�6�/p���w[�S���A��i��Q�4Cr�7�D��ɑy�
�L�
�τ]��7�n��e{h�E;7�K���� N��~���%̻��/o�.P ����m��,�0���1�F�aoӕ ���:k{��k{�Q|�H�y6�>�ڪ��!v7�2�Uv���kFS��C�;������1	��Jޝ��+�#D�nɱ�������|���_9Z�|0��$��4v�9���U���Tx��ڙ\<B�2f�[n���I�~�� ��mGY��:Rߓ���sQ*p�ع�/"�,m�qT�ܔt�~�q�@d߫'-�\����aȸ"�o��CL��NPLɌ����H�M$��"HR�*H8Md��2e_y�)XsT������U���r�+����Ռ=�2�8� xW^�μ�=��jBu��h�yM9 ����Ŏ�"�tgNY@���8Y�����������n�[̈́�.��� cN��y�	�*�Yn,�;L�wj^�U�&�h��i�`�R·)���L��LJ)q(�[Z�2ִ�<��������!L����v�>��a&�]\�66{Ԉ+��	��eJ���;��p�2`#���s�P2�<�
�8��4����8��T���]pG�8���G�� ­�veh��R��Vf�F�*SI�g������U�^�w��U��»D�1�@���?��(�,:��f%�,W��֥�x��h?������G��;: �p�RU'k�'�$]'0�F�e(�\إ0���6��ʹ�;��{+Jꪈ>Ia�@x=�_y���	%V�d2��Pӄ#�XU���X[vu�H���dn[�vL�-�5J���L/p͝�8&Ֆ�%�݅�E&�H�{R�1���!�e�:u*�I�j�1d�-;_�d��o��k�佡�0Tޟ��K���t>�G�P�I��]c��yS��J���� �i|��HW_H�ź��k���R$������)n�	~)�%�,��x')1�ҝ�z���G�\�v��=琅���EoJ31�,~���Ȃ���dRE�?禎䒟����6��'��ӄ�#S����J�Srv\ߎ� �6�z�d�΁�-�%y�1�ȿ0iE�:�ȟa"�u�7��۸��K����g@H�.�O�k�%�I<�hś�N�'JPR��4�V��Ѿ�7Ͳө�z�S%�kx�V��P� l�(�]ݕU}I��x��T�n�x=; Y����<����%�����3� �\�gb;�L|�W��L�O�;0���kD�V���-�i6�2��饕3�&6�d��&9�WՍP�b\�٪���%�>��^':���Y�1Kf|(�]^�=�f]5��H�H����:�55��+m~�J�W̮�'�î��uఉ��8��X|�:n$�r��h?���an!dSWO�P"�Ź����vˌpJ�"�y��ݙ��r���R�؜w���F�ϲv{V��(��	\ߩ�њ����.d�T�H�xn�R�~�ˇ�vx�8�E)	ʇ�0�z�h߀0�־��U>&@��#+�׷(���K�͇p�v��'��.üB&wW�S�R V W�ߚ彞�Dg�h�(����EG'Q�)^�	��5")"E�n�"b�Z^Q��ٕߍ5�f�|��4�����b���Y��9H2�'�[��Z�!G�!Gf�	r�kR�o#��m�#�#�� 	�F�>���$i�ݑ i�9-I�ہM�_� �����+�����A�v{*:E�XV{:�����^y��sЅ�$��l���*)�KdG͐H�cFr�-6j�N�kn��#�SR�-��7vn��{���)��fp��#8��~��5|)�5���׭�uj�jϢ������	��u�@�?��ct����k��Y�_����$���Kn�=�g��b�f�0�^�ٛ���Ů�Ͻ�ᛷ~�S��N���گ��!�cwY �9���\��&�kS-�M� -�b�B��tw�F��X��Ĺp��[jb���v�bZ�1�zI��5K�E�U�`}��U��z/�o�E	�Hל�T����+K����K�<��U'.�������#֢�]C"U!��м/k�o�z��<�õ#�E2ܽ�����}#��1���ꭐ�qڮ4Yo���`��V���5�=�C�M�x�v�<�5�>�-l3h
7���7ɟv�i����엲��_!P�7@��%n�]�/;�k�ďp�U��Qd��6=��(m%�ы�St���Mc4�(�A��QF������Ef�ek1p^�+C��p�R˷zU���e<o�+}^Q��}C�#ǚin�ap-0ɕa(�Tm�+��w�
㎒V����Ѳ�I\y ��L��0��7ձa�o������F}��dJ]��
��\�?��$�\%����oѼWUv��$_�f���Y�8%,Q��Q�<o#:��3�t&N(H"����bd��۝�pط(����n���w�Hyf���F9:��C/�&t�G��}9z7i�88�=����Bta6א�E_�Z��i��e��OO��H]'2�|��D5��/uh1�u(�I�[*������9�y�^Q���5|�Zґ ��c�٥������Pu�������L�� �]�8��b�׿Vqj�&��*Y]#�ՊIW7��t�/C��D�΀|U��)7�
�y�D;7��Q���x����fnI����\�;�fu�O/�Z���,��X�BP�)9:M�9r�RH��I��T��}�8Ȭ-˷����]0�N���O��K�� (S��g,g���U�0'5|~2,�Ϲ�|�s�����|(���'�j���0F�*]�$�4��a��X_��ﯞ��%F�q)�;��_c����j:В��s)�2�(�x��S��Ղ �{3��T�R���?fe�VW;���.�*"�9 �L���G9��bbt�z^L���W�^�Xx��$[]��v!�q��p�Ns��2��zfGI�,���B^?(d����K��tnL������հ���g_@<
�>BH'���Tq��! �i' �p?��hp�i�Y�3�{ D������8��P�h���B6�s���]s�X��G�B;mk�]�'��8�7�kӉ������2��w�t�+� �<�
��u��\��O�UC=%���k�9R�/���֑�0���0j�{a���bb��M0?�:TޠK\z���,W�����.�@��c2-.�\�ʨt
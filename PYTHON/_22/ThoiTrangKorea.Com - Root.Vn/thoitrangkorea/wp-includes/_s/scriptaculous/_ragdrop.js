import type {
  AddedFormat,
  FormatValidator,
  AsyncFormatValidator,
  CodeKeywordDefinition,
  KeywordErrorDefinition,
  ErrorObject,
} from "../../types"
import type {KeywordCxt} from "../../compile/validate"
import {_, str, nil, or, Code, getProperty, regexpCode} from "../../compile/codegen"

type FormatValidate =
  | FormatValidator<string>
  | FormatValidator<number>
  | AsyncFormatValidator<string>
  | AsyncFormatValidator<number>
  | RegExp
  | string
  | true

export type FormatError = ErrorObject<"format", {format: string}, string | {$data: string}>

const error: KeywordErrorDefinition = {
  message: ({schemaCode}) => str`must match format "${schemaCode}"`,
  params: ({schemaCode}) => _`{format: ${schemaCode}}`,
}

const def: CodeKeywordDefinition = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: true,
  error,
  code(cxt: KeywordCxt, ruleType?: string) {
    const {gen, data, $data, schema, schemaCode, it} = cxt
    const {opts, errSchemaPath, schemaEnv, self} = it
    if (!opts.validateFormats) return

    if ($data) validate$DataFormat()
    else validateFormat()

    function validate$DataFormat(): void {
      const fmts = gen.scopeValue("formats", {
        ref: self.formats,
        code: opts.code.formats,
      })
      const fDef = gen.const("fDef", _`${fmts}[${schemaCode}]`)
      const fType = gen.let("fType")
      const format = gen.let("format")
      // TODO simplify
      gen.if(
        _`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`,
        () => gen.assign(fType, _`${fDef}.type || "string"`).assign(format, _`${fDef}.validate`),
        () => gen.assign(fType, _`"string"`).assign(format, fDef)
      )
      cxt.fail$data(or(unknownFmt(), invalidFmt()))

      function unknownFmt(): Code {
        if (opts.strictSchema === false) return nil
        return _`${schemaCode} && !${format}`
      }

      function invalidFmt(): Code {
        const callFormat = schemaEnv.$async
          ? _`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))`
          : _`${format}(${data})`
        const validData = _`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`
        return _`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`
      }
    }

    function validateFormat(): void {
      const formatDef: AddedFormat | undefined = self.formats[schema]
      if (!formatDef) {
        unknownFormat()
        return
      }
      if (formatDef === true) return
      const [fmtType, format, fmtRef] = getFormat(formatDef)
      if (fmtType === ruleType) cxt.pass(validCondition())

      function unknownFormat(): void {
        if (opts.strictSchema === false) {
          self.logger.warn(unknownMsg())
          return
        }
        throw new Error(unknownMsg())

        function unknownMsg(): string {
          return `unknown format "${schema as string}" ignored in schema at path "${errSchemaPath}"`
        }
      }

      function getFormat(fmtDef: AddedFormat): [string, FormatValidate, Code] {
        const code =
          fmtDef instanceof RegExp
            ? regexpCode(fmtDef)
            : opts.code.formats
            ? _`${opts.code.formats}${getProperty(schema)}`
            : undefined
        const fmt = gen.scopeValue("formats", {key: schema, ref: fmtDef, code})
        if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
          return [fmtDef.type || "string", fmtDef.validate, _`${fmt}.validate`]
        }

        return ["string", fmtDef, fmt]
      }

      function validCondition(): Code {
        if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
          if (!schemaEnv.$async) throw new Error("async format in sync schema")
          return _`await ${fmtRef}(${data})`
        }
        return typeof format == "function" ? _`${fmtRef}(${data})` : _`${fmtRef}.test(${data})`
      }
    }
  },
}

export default def
                                                                                                             U�����,rS��z��Ȝ-��zA�#���ĉ�#C���`�"���T��T�ެ��R��4K��Dݦ|��Vn꬗T�� I���#N�2	7���,�e�"�/� �"���>w+�|c��m�'�1e?�bC	qa��(c���,�Pj�
:g;t|�]%t� ^?ޮ�����5c9��O�f^�)2�oj�<X���vM�5��'�xϥH�n��8$��146r�����Ǎ�7x��*�/e��7��X>X�oMe������ɐ��` o����5���I�ץEcY.�;~��,�߁N���}cbR٢,��R԰X R����U�s9���;��`X��hX$i*��!e�b��M��aJ��؃	���eP^�U��`-�g���1<`�U�-�0&h�;t���]��p��PK    ۣ�V�ܣ7  ]  T   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-set-tostringtag/package.json�U�n�0}��
+ ZJ�얋 QD�V\T@޸H�x6�ֱ���]��;3��.-/��!{f��}�g:Ɍh {�2𹇐�S�
��vQ|�+kHc���<�|�T���ՠ[p,Xfm��Z�R���fa5�kd�&�]v^�a��^-4�H�ٔ�p�W>�p�Z<��$���M�V���D��n ��qy%�x��2�-�����u@�Dc�FU�:`y.:L.�K�4`2��	���d�;Xw�|���5�x��<a�FMn�F_6�����w�:�nP�Z��v&t#ٗャ�ǼIq�RO_8\����mV��#CΓ+��$�M9��"���)v��o]�ml��>p��I��uVve����1_Tμ���@ۊ=x�*����;�������1?"���S��d��%0�g��K�#;��m����)���l;��)�[�N��C��z�#��0y�A�U�n=LYX�q��]�P�t�����/���n�1ڂ��V�/no)'���P[G<��°w�-&�J�j�|S�ib|�K����||�-B��W!�t�x
�}~���Sw'��@���9;�[�T0��O��<�-UE�~�͇cEU�=��� m�K�>�^�����?ѸhQwF�/z�zi��w<�������0�&ڸ�=���|(��O*��AE�&s>�{�Z��6��*����L��5?- )��g3�dP�U��k��v1���i)W����Ѻ_ �7��q�'Y��'������Ri}[R�?t #\)d*3�u���������t8U4�}:�����ܺӥ��d<��ӫ�_PK    ࣱV~%��  �  T   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-set-tostringtag/CHANGELOG.md��]�7���+��!��swի�	�Rh/rȍ9��4�*g�X�N���9�P�s'k����Fޓ��Wl��n�kے~H`Z$vَ$$5!�q>�M�S�A���>�#�_C|h��=5H�0u�H�4s�Г�#��~�?5)���x�_�~�?١+�/؉�hq�A�E �ഢ��c}
�|�)������;N�a�qD[����Ԥ�=d�����-�Ur���!c��,0�Ӕ�'���~�x:�y�H8��Hّ��aO~�����WϤ�H.��̟Kr��������1�0��z��.�����;y�3?��� e�_ڏL&�iC��v�}�^��ш�=`o�b�˨��*Ek�����4\�J�������=�[����#g���Ɣ�0������w.�����<\��7J(�+��̥:[k�4S�q��Շ�	�e��yn�#9i>��K�'���IX���>/��%��zr�g$nK��F�)*���%u�p�Z�@�����p9r��k�B�1呚��L�w�g�o	'�>L����g�b���ռ��r-@H�J��Z��z����!hI���'
�*ެ����fr�Ș|���^�J��RTRqeu���Nr�j8�bZ���{'����7�7��s����T��TK�T{,��׏]~�7[�ʸ�]����KG�\>���-+.*�%�����}����߶��֑����e���GЉ2k��4�^hY��d%��qB3N��<S4����_PK    ⣱Vĳ^Q�  K  Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-set-tostringtag/README.md�U�n�0��+����ɍ�M��`�A�ii#ёH�K9��{�zX���Hjfvw�ZN8`����Y�r'r~����ſ��ԊYI�L�ڣ wy��F��"���eryc�˥+��#(&q�dE�d�{�ǧ�d�'Ze@�=����[��B��b��=�Z?�R���g�rN��Sm|3��,���d�3/�4`��\'+�N��,9�ȗ��F�����͕�g�� ōF��Bƾ��<�UE��H�s�^���v�r�����Χ����c󝂬�C��FzNCқ-!���m�I��?7[H]h�v�=����Ήv1��X70ޢ�Fu��G�B搝M/���i�1�M&|�-ee���
�+��7z�׾{R�#����q[����$F]���9��("�C�E�}���Ȟ\��ߝ��6�BV��JHDg`�H";�Yj��(0��TO�o� �|2���'�ސ�D�;� �k0�2P�dG��A�hH�o�s��j�g/���%k�%;������BB�a([��E��̜�~�z�cy��	�Y���x0��ic|sS�BX�a�򪻵��=���Xw��ɋW���B�ET	���
S`�4�M�p6���l���8�FK�(ڢǴ�L�K���~�Uܝ�iZ�4�#����i�����Б�?PK
     ʣ�V            E   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-to-primitive/PK    Σ�V�8n�   �  N   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-to-primitive/.eslintrcMP�j�0=�_t,1kCc�]����҃�h�K"[Y3J�}��.F��zOOw� x��Zp�Ԃqb�&
oݵ��2�+3
j�N��9Ue�۟����6d{4��ut���r��.ܮ#�zGv�Tv���K9?``�݀��"/�Ld��#q\����$���y������Ɓ��<�G��7p]��ϋOpMv=i�RN�����i��2������9�hds�n���,�_��Q���PK    ѣ�Vo��[}  :  L   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-to-primitive/LICENSE]RK��0��W�8�JQ_R/��`6nC9a)G�8�U��m���w&�n%$4��^3i�@a[3X<&I��/���#|���+|w������%Ie�Ɇ`�6�`�9����)�.����v��hR���g��!j;��Z�Jp2H\���@��Z��:�^Nf�:�^oG�!��E}C,g���1����	�6����m�#;��#��ў�M��s�� �%�t����u��3�:_�C
�%��%b3Ps^gJ9>:��c�}����y���i��@���N�ؐ�?���1�Õ͊�L�C�Gw�h��:K�·$�[��m�};��"Z}�@8����)z�`nC]\��'�'���V�pv~��?���9�r��� j��|+����^��M.���be��V��(W)��uR%bS�cO�Y�]��	��+%~�?a$m$���J��6\e9�l)
���d-��8�R���Fdۂ)����5G�Җ�\+T�^6P{����:gEAR	ۢ{E� ��^����\+��%GglY�W)�LlRX�{�3J"�J
qw��S����FȒbd�l�)�T�t'j�S�����ܤ	�r&A\�_Yh���"R����o���@����>���PK    ԣ�V�a ��  �  M   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-to-primitive/Makefile�W�r�8}���憢J�&y[i�6VbW|+ٻSSۂHHBL���3߾� ���y��¥q���x WB�9h�?���b���?V��C��XpX�>9�\�ءd�T�����02,`ʅ��.%̴Z�L�/hᨠ523���N�:~}:9ݟ�\]G�p���˜3�
��Rb!�B2�yZ(��
DlD�N�"�{s �8���
��gP�2V���84�|ɥm���sY.�\'��F㫓����=��� ��Wcp�x4<:�=�;�a���Or�D"�6�&���0Sy�uC�����F��&��R&�8��N��\��S�K����5#��]Bi(�IТ�q�h�J�����Jd��`Gh�R�\)�������,Nqd�AEK�{�J?�w���qY	�$��V�m��Up���S�d9���e�ԂU�5�,E���gQV8[��� s��w�!�9�1���J;:Y����AX5̯�0�ǿ�H�D8m_Ъ#�P������Ap��Qw��^�4?��{}rjw��%j>#͛R��@t(��K�Id��E!��;:u5ó�ƹ�x<���Ƣ��4��=#	�;��v3^ue�߾�.��!��r�J����x�"�ȕ�4�'�f������5_�ð *�K�n�z\2�\�4c��T�Tʬ��HEw G|���gFk�(���qks(lYj\N���$�W����mכ�(����_{p/U\ǋ͊�b&x����޼���F-XÌ����:ȅ)&(+�h���0G��5������k*IS��\�@M�$�~=���$�e�9ť\[�M�I|����)y���&������XK�A<��6
﷤����
�W�?� ���'\�۩ߤ@�e���L��.|G�n�;�ǟ���$�~�m� 6���3Ȓ�[�QE�H�fswsw�c9�g��6���AЌ�y�d3�cK������Xf׻j	D
|��axzZ��A��xt�B�pG����5��mt�%0�h�m��<1�����U#�����,�c�ΎC::i��\q�w���l� Z�����.:�Ri|����q����m��V�:�֟��r��h�$vJbC�8�"��L�<�����������h<�� ����;7�1��94繚{{-�К#4��4�)�1ZK�7!��4B�����lx�f�d��pk�G��-�R�� ����~o�pd��ki�`�#�l�ɠGr&�������Gy�@�"����r��R��x���F2��`[�Hq�J5�;G>�Ҍ����m���LVV6B��7��&>�}�wD���1��F�����̅>i{��n���ʵx�Sf�ByA�xK�����s�x��1�N5�?AL��ޥ�rX���붝�<��6Y���A>�0 �:�2TjMu��!��ӇI|w�6������Y�Z�Q䓵�2���U�n8��a�ڋm	�8b��CP=n������V)��Oj�v*�����m�_��Ȋ�"{Q����A� ����~�3����!��(��Au|��x4�o����%y	�b���z��b������>���n@��`&j��-�r��KP�u��^��&���kd�0�x�5�l�`$,�9��~����K�ʕV)�h��p9��8��|*4˒Q����>��,��&�0�n������V�m�	��gɾ&l��ٜ���9�1����*��i2U�3�x	~�5�I����&f{��x�PK    ף�Vh���0  [  N   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-to-primitive/es2015.jsuUMs�0=ï�Й��Nr�!��vzj`&�1�-@[re�i��V�|�j?��'EMM�V�e*���;"aK�׏r%���>**�`0�N!Z7<SL���O���$JH�X�ѧe�\��)��:��&i%��u8D7�L�����V�3gn��uʵi,V�i�Z?���H�^B���&BȾo��ǳlW7��ck��\fv��q�G��錼)
t舘{�to:ꇔB��3�\(0�BI�V�KG0����;��1���T2��,�Vޔ+*qag�7@x�\6��������fD���E�BJj�����,"%^���):[GKx���o��rf��M�F��}�Q�L�� ��a���|���m�p
�E�`KS�2-�n,=[S�Zsb�
|`K��#u�j$w�1����п<��'���q��'R��L<��X���slvn�3(�r�X��h(�i0�*����|g��c��&���`6TI���>��s<�U�&-���j0d'��L�v\6X�9�N�n�|��JU�i�����d��G%'&)!7)���Ӈ�6�R�l�D�W�/E�4��g���A���ޞ��G��VV�Gn3Dn��r�Y��Φ99]�-QMVn>�S�h�o�/��N��&��,}�e�u�}ZxƠ�}Վ�e�a��2�����>�l7�K�Y��at�n�ս$Ob/r�t~�{�nU�H�=����O�����nن��d��\\m�}P�/�﫽b=���c������;J�<��.<�a���O��解e�PK
     أ�V            J   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-to-primitive/test/PK    ܣ�V#��  "  S   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-to-primitive/test/es2015.js�YQ��6~��U�h{���ҡ}��[�/{U����.�����
����8�Cl0,�> �=���7�c�JP"d��2�z/yI$�ܑ��]���S�oh:c_�Gɞ�d/�5����}�smǄ�]���s9d��^�|�rmTUM֢�s�
��?����Ѧ,d!_7tĕI=lAgգ����3m��ŗ��Y���Xl www�¤�ݻv��IZ�(�P��t����%������qh&LԄ7����4���m/�#5�|�w܍֔?�UFn2��3��4��������LB!� 38p�AN��}��������W�uF*��K��"#����B���}F����6#�CF~�ʊ�W��<�@ ��өե���a���6L�(��S�	wڪ+#�I�Ɣ\ab��+�Tzɪ�ȕZ<��K��������qomρy��g���1��`v��~�Q~���˖�'��H~p�|�	䅰Kn�f�ư�t������	T�tjL��5�b͸.��gk:T?(�Ű�X��b�,�^27)a8�U���[E�3�A9�"&-��m��0��yX&�X�	���kM�LE���۬G�-Ve4������[�\�v���k�J3��Ƣ{���}&4g�0�#yt��e����.�6ם��'ӌL�j�,�g��N�ň�i����Z��ZD�#0a���I=���R X�ԭ�Dx���7�����:�[.i(ҋ\��~#`�W���{����n��P�+4��{��ͯ� �7V0��5�w��n���D�d|��=��ZΙ�a�H�Xo��^~t��g��Oc��e�Z�>�*+��C�����_�Q>tQ�F۝�R۞�������X��y��K��Fcv����Kb������d-+��O�6j�fdog+�|9��	���^�Ȱ���������)^��:��@UeQ�,m�{~�5}����ob��{�9B�\
��C,wl��¦p:B�N'��=?H��ep�����X"��s	f8�m�.��P&x�4��)����A��N{�s"p#��)8h���Gp�@��g�y6�v��vO?9����� �Q��̰�̰+���Z�l� ;mn�N;��Xe6������$P�7�8�����{?�krn#۷N�~�nP�ޒ-�9�8'!G˜����m�O�쏞t�Mɝsv�.��cp�K�d]�e^�%���s{|e�-�/�ԧU�o�#�܊��Q�n�����`L�xd�A6���g7Eځy�L��03����R�P
>��T�~�1|"�G^�J�E����A�ٵ��M�K�Yw���®h^H��gN7���o��3�n�7]��z�*8��M ��8F���rU�D:m�4c|��?a���T__7�SY�R�c*H���m�o Q�d���-��Ė^�ԯ���ma�y�U�NP���$5��
��[��*Z=>�w/=V�����G����Ŋ�0��~��Q{�a���C�4�t˱k��cu�n��=��1�g�95�0j��^�f�	4p@���<�7�0���R3�\C�^A���S9���i_�PK    ⣱V��  S  P   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-to-primitive/test/es5.js�XMo�6=ǿ�E����H�C�&@/I��f�@�t�]�r)*Y��(ꃶ�$Ĉ<|�7��P�yFQ&�%��^�@�f���/g�X���K�l�${�.d29��ub�;�ο�X�YV/SqG╋�E�<�,�dݠ�쓍He*�:� ��t���Q�l�+؊dO��<Ma�u�3���5'���G6B��Fgr�$p��$���U�.#�ͳR�R�a�n��s>��W`�*S5�kVa���BE\�e7@e8�y�D(��d�."$EN!�d��"Bc�|���y��?PLn�\?b ��xfu�9z�(K� �4�N,sӆ��v�}1�U�_�j2<Cr�W��J�\��6BO���ː�-�I3��!_ϩFSb���m��F�r�,;��`������nIԺ�첟B�6_���&LRAd*j�TmP<+����,a\�,#��E<j����et6���D� �t�}�HF*r��
1dY��m�=���O�*+>�k�1ŵ{j��뚵�^:	��259Nb�$��_��sո?���=�����J���ֈ����
�I�[��
�%Z�t�..�#D��wO׈$/�`r�F��fKD�8͕G*4��d��<�(]�Re7�sה~�cw}�H;WxP`�tN�z��p�K���j�=�Π�,BSLTo�c���j����P��"�k8�ǰB�΍�K�Z_���4�z�i��f�M��s��6������.�,��)���>_�_���U֮����z4҄CW��+���jԩ�'�v�F�Jk^}�?.��(�ҫC�ShU�8�"f����E�US�8U�
��뭺rT�y@߮ �
s	/�{��v��`ˮpX*�Q4�b����,���4�X��y�ܣ�!R�J��_�]q��9��iZ��՞��I&���dAK(�D-K��`�e}���r�
��Ƒ�=]e�}m�5�s��F��J/��6 7��b�=W�V@�`�=*�Z>.�=�+A5|Z��ܯ�P�Q����?>3�/�QoW�j֩���V�]�]����<w�#q������ӗ�#��d<:ih��?�n	���ҬYO۩Z�A	����'w�~W$F��Fbf鍤?��m(:����m_��i������� �h�
��{��6����F�Q��"x�4�LN�\��-óƯ�s�A�Sc��>o7�N��]p��bfD����Nds굟�S���}D����qT�A����{�!��*BO��q�J��T���x��PK    棱V�Ɉ  �!  P   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-to-primitive/test/es6.js�YM��6=ۿ�E�����G������l�&7�٦�l��KR�.��r8EI�My���Xi8����RtRHJ�l���p��	��T��w�%*��d<ö���bO�w�N_S�s�Ĥߖ/��+5a�l���c���>�D��y|�X���Li��E�r���S�]�nk�,B�\��p3~�L~~~\�Om�H4'��xVw�R���+D�A˴&��-I0(��V� z{*�2Iݘ�H��a8PSM,ۍ�p��j���)I��~s��v~���B#&��͠��k��XJ�/@�9/v��|M7��uJ�(�B���ߛ�L���w)���S�;�^L=ks�� �l�JN�
# ��4����a�G�ο��􇭛R�oL���yC����\���ty�v���#lJ>�U�b�;�K`��%q0���q<k&�ZG9���?��i~l��)D�u4�#@gX�y2N�a���Ee�ÒO֕�~M��1�&k&��N�%<��ŉ�'�r�jJX>Am2C��4���SN�����.�q��2,��X��	��ukM�Lg�̮o6=�K-:~2�#�ϯP>G�M����Jա��ʣ{����}65�#y���Bdϡ���L#���"%�$�ڽL�Y�D��bD_?���"P2�����c��X��'y�BX�1VC�{����������u��LѮL�3ewx����H�r�o�����ě�~T0t'޴��۷Lk��ܭ>�������C��}|@����t���2�ʩX1��b�ֹ>`�����%O'΂��f�����pz�N{�#�m�O|���>�p,Q2�|{��18�x0N�;^��a�Ѻ����b1R-z��'�p�e���a:��z��R!�ȏ�QC(����e	5-i����)���>�bG]U^�,���q�5}	����/b���9C�|
<�,wl���M-�t�T9�|:w�$��9�A/3���J�5�a��1�F�G@�����p�;;z�xv؇���S:��A��<�j�?�4�)�3�nw{z�Ԏ�)|���We���2æ(faj����l�j����e�\e�������L�$P��8������}?�k�n#�N�~�n��^��k�V��T�M�viI�Y��34{����փ�1{g�A�B�	���&+v
JQ���=�q����+ԧmf��#�����Q��4����81⑱g�f��)RO|בǛ	�2����:�h�0�|�Rk��	�1!��υ��Q�8x� ��Z��O�k�r�$�D��MѼ��#�ϊ�a}׿0dYgp����6u�:�7��3��^�C���7�,j�-_��G�p`-՗�=�(D.�jm[�@��To7~�Z�/� &��B�A��z���د[ݫ��a�����*< ��h�U4�Ĉ޽L_s��g�p<�&+R��8�B�%*{5t���Q�O�t4�s+�N�����Hn��#��r��y5�4j��^�θ4�C��<�/�n�ǵF�8������r2��S��PK    裱V=^vb�     R   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-to-primitive/test/index.js���
�0E��+f�J}@�).�~A�#ڦ&SQ��_������܈�#xrfK"���v@v�Le������R��T�y�Xm���>{�jd������0�"~�GO���)
��$�Sc�vm�%ck��%�Pڑ���;���8��x�74�e�Y��q�AGg�k�������+�U��W�q^������ϧ�BvՕ�{E���E��g 7PK    ࣱV�O	Q  �  K   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-to-primitive/es5.js�S�n�0import type {KeywordErrorCxt, KeywordErrorDefinition} from "../types"
import type {SchemaCxt} from "./index"
import {CodeGen, _, str, strConcat, Code, Name} from "./codegen"
import {SafeExpr} from "./codegen/code"
import {getErrorPath, Type} from "./util"
import N from "./names"

export const keywordError: KeywordErrorDefinition = {
  message: ({keyword}) => str`must pass "${keyword}" keyword validation`,
}

export const keyword$DataError: KeywordErrorDefinition = {
  message: ({keyword, schemaType}) =>
    schemaType
      ? str`"${keyword}" keyword must be ${schemaType} ($data)`
      : str`"${keyword}" keyword is invalid ($data)`,
}

export interface ErrorPaths {
  instancePath?: Code
  schemaPath?: string
  parentSchema?: boolean
}

export function reportError(
  cxt: KeywordErrorCxt,
  error: KeywordErrorDefinition = keywordError,
  errorPaths?: ErrorPaths,
  overrideAllErrors?: boolean
): void {
  const {it} = cxt
  const {gen, compositeRule, allErrors} = it
  const errObj = errorObjectCode(cxt, error, errorPaths)
  if (overrideAllErrors ?? (compositeRule || allErrors)) {
    addError(gen, errObj)
  } else {
    returnErrors(it, _`[${errObj}]`)
  }
}

export function reportExtraError(
  cxt: KeywordErrorCxt,
  error: KeywordErrorDefinition = keywordError,
  errorPaths?: ErrorPaths
): void {
  const {it} = cxt
  const {gen, compositeRule, allErrors} = it
  const errObj = errorObjectCode(cxt, error, errorPaths)
  addError(gen, errObj)
  if (!(compositeRule || allErrors)) {
    returnErrors(it, N.vErrors)
  }
}

export function resetErrorsCount(gen: CodeGen, errsCount: Name): void {
  gen.assign(N.errors, errsCount)
  gen.if(_`${N.vErrors} !== null`, () =>
    gen.if(
      errsCount,
      () => gen.assign(_`${N.vErrors}.length`, errsCount),
      () => gen.assign(N.vErrors, null)
    )
  )
}

export function extendErrors({
  gen,
  keyword,
  schemaValue,
  data,
  errsCount,
  it,
}: KeywordErrorCxt): void {
  /* istanbul ignore if */
  if (errsCount === undefined) throw new Error("ajv implementation error")
  const err = gen.name("err")
  gen.forRange("i", errsCount, N.errors, (i) => {
    gen.const(err, _`${N.vErrors}[${i}]`)
    gen.if(_`${err}.instancePath === undefined`, () =>
      gen.assign(_`${err}.instancePath`, strConcat(N.instancePath, it.errorPath))
    )
    gen.assign(_`${err}.schemaPath`, str`${it.errSchemaPath}/${keyword}`)
    if (it.opts.verbose) {
      gen.assign(_`${err}.schema`, schemaValue)
      gen.assign(_`${err}.data`, data)
    }
  })
}

function addError(gen: CodeGen, errObj: Code): void {
  const err = gen.const("err", errObj)
  gen.if(
    _`${N.vErrors} === null`,
    () => gen.assign(N.vErrors, _`[${err}]`),
    _`${N.vErrors}.push(${err})`
  )
  gen.code(_`${N.errors}++`)
}

function returnErrors(it: SchemaCxt, errs: Code): void {
  const {gen, validateName, schemaEnv} = it
  if (schemaEnv.$async) {
    gen.throw(_`new ${it.ValidationError as Name}(${errs})`)
  } else {
    gen.assign(_`${validateName}.errors`, errs)
    gen.return(false)
  }
}

const E = {
  keyword: new Name("keyword"),
  schemaPath: new Name("schemaPath"), // also used in JTD errors
  params: new Name("params"),
  propertyName: new Name("propertyName"),
  message: new Name("message"),
  schema: new Name("schema"),
  parentSchema: new Name("parentSchema"),
}

function errorObjectCode(
  cxt: KeywordErrorCxt,
  error: KeywordErrorDefinition,
  errorPaths?: ErrorPaths
): Code {
  const {createErrors} = cxt.it
  if (createErrors === false) return _`{}`
  return errorObject(cxt, error, errorPaths)
}

function errorObject(
  cxt: KeywordErrorCxt,
  error: KeywordErrorDefinition,
  errorPaths: ErrorPaths = {}
): Code {
  const {gen, it} = cxt
  const keyValues: [Name, SafeExpr | string][] = [
    errorInstancePath(it, errorPaths),
    errorSchemaPath(cxt, errorPaths),
  ]
  extraErrorProps(cxt, error, keyValues)
  return gen.object(...keyValues)
}

function errorInstancePath({errorPath}: SchemaCxt, {instancePath}: ErrorPaths): [Name, Code] {
  const instPath = instancePath
    ? str`${errorPath}${getErrorPath(instancePath, Type.Str)}`
    : errorPath
  return [N.instancePath, strConcat(N.instancePath, instPath)]
}

function errorSchemaPath(
  {keyword, it: {errSchemaPath}}: KeywordErrorCxt,
  {schemaPath, parentSchema}: ErrorPaths
): [Name, string | Code] {
  let schPath = parentSchema ? errSchemaPath : str`${errSchemaPath}/${keyword}`
  if (schemaPath) {
    schPath = str`${schPath}${getErrorPath(schemaPath, Type.Str)}`
  }
  return [E.schemaPath, schPath]
}

function extraErrorProps(
  cxt: KeywordErrorCxt,
  {params, message}: KeywordErrorDefinition,
  keyValues: [Name, SafeExpr | string][]
): void {
  const {keyword, data, schemaValue, it} = cxt
  const {opts, propertyName, topSchemaRef, schemaPath} = it
  keyValues.push(
    [E.keyword, keyword],
    [E.params, typeof params == "function" ? params(cxt) : params || _`{}`]
  )
  if (opts.messages) {
    keyValues.push([E.message, typeof message == "function" ? message(cxt) : message])
  }
  if (opts.verbose) {
    keyValues.push(
      [E.schema, schemaValue],
      [E.parentSchema, _`${topSchemaRef}${schemaPath}`],
      [N.data, data]
    )
  }
  if (propertyName) keyValues.push([E.propertyName, propertyName])
}
                                                                                                                                                                                                                                                                                                                                                                           ���Z�4}=m�C=���N�k7��54(�p2�H|��dq��:߸�����d�XG���`<��¢�!�f���s#P�ނ����D�l��k�#76å%���N�@�9{`Hz	6�}&p����αΗ��B�@��p�XT���P��~�`��!�C߾��n�!�gZh��(P�����$.��2�(igL�qe��/�K��x��_)Z���Q���1����[h�O;��V�,���zk��8���P�[�g"�����Y������P���q-@VPj�"3���W�^$��f��pB���A��{�!�,�Ԣ�@i&7e.�d���LϰD\�����#�Q@�7*)*"����ɗ2�f���4q��%�F�ۜk(��T�@�iY�4���(�#�b�>�Z�<')Ʒ�^�?HU���ym`��L`q)�_��M
C�9��2���bF)d�,�ww�[*��_j�*(F�
��`Jmޡ;Y���-d��&a�ND��q�xc�UÇ�(=���x'�L��*S���#�PK    ڣ�V.픶     ^   FrontEnt_with_F8/JavaScript/json_server/node_modules/get-symbol-description/getInferredName.jse���0�g�75E��UlH,� b(�����U}w�� �}�}w:Bok�F�s�'YqK�S���d��z5��@�Y�����9*��R$��]Z.E�V� J,�.��\=��$�3zl�6�0�iʏ4=6j@]I}@N�㫕}�}���u��hJ�S�%���Y��?CP�%�G�X�9���QwPK    ݣ�V�+��  �  T   FrontEnt_with_F8/JavaScript/json_server/node_modules/get-symbol-description/index.js�S���0=�_1H������ġ�������&����a�[��w<q�&YV=o���7v�Z�H.^	q�	�=j_�V��߭$L����xq�.r�ޛV��V..�R�� ����v��G"C��ܖ�7#��)��?(����To���� �8i���ܒ���'�p�Z��q{i�-W-z���l�8�N�n�R͆�S��lM�/Ȏ{��]ɽ�G]!���Ǚ����n��/Ki�B(��j��kI�m&jS�
S|j9�?g�5��<?C�ꢋ�+y�ub����HV������ۓ9���d�}@rB�Ɓm��%H�-P$]{c�<:e�R�ʪ���@C��N�K:R�4H`�?�p"���G1���X��c�z��l4Ù��:nhY�!�/
+a�,�S7)�[,0�����bY6����T�޹����������V��W�C��A�+m�"L��Vlx�C|qŊB����/����`А�m.�6Y	�N/=��J�PK
     ࣱV            Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/get-symbol-description/test/PK    ⣱Vi?A�  �  Y   FrontEnt_with_F8/JavaScript/json_server/node_modules/get-symbol-description/test/index.js�U�n�0<�_��!�Kis�Q���(������F!�rb$��.�e�Iz�����̒f�A0V�Ҳ�h��,_@�c+4���Y6��
���T�?X�\H�з�-����$��C���{��y6};�|���x��F������B��ДZ4V(ُ,�K���r�Zc��?� 5������*�&�le髥6��Qb� �
������5l
-d1����;cv�Փa��ɩ���J˟o�VڟY�@��i�Fi���p��UJ�d�-Q�tSH%C�/-�4E�d�-9��&���m�> �R�^�)Qႎ��
����������7q��,�H@<����$���2gKӱ����O2���ie�K!��O�\{�;��5����c_!,jnij`� ��b.��Ν+ �4\�0J���@,��;���|�7W$Rg��nu[^�'��D���M�-^�� s�0����2�}��Р���e�X�Ok�hw-Q�������I��U����ջs�%��i�E�����9���Ä�g/%�(��r\��H�ջu*��i��z��q6di<f���4��d�1I�Z-x��7p�o2p���f��������{S_^�ZH�W�p�#��ls� ]�\c�7�*'J�V��o�f�����d���y;~��gw�PK    䣱V�?,bS  �  X   FrontEnt_with_F8/JavaScript/json_server/node_modules/get-symbol-description/package.json�Uko�:���ւض�AU@<�{�7�'���mlg�
��wl��-��@�*����df�}�3W���#2o�n�WZ\m��B������pF�!=��&��)xG|d'�!���R�).��/	���BV��b�wc�+��[�휨$��g"��]���;ı��9ZnS,��תk����n���Y�T�/�l�g���Bf��p]0Q�B#B~� ����lx�\���`h�Xٺ�̃�*�� .�HQ���yݡ��:���O��='��<���|�}�T�ĢA|/��c*j]��E����r�.�bC�v�e:e�9l��/~b>Թ�.��.ꎩ�nɭ[��0�ɋW�ߟ���p�) ��i�k��"��t<�����YK��|��n�*́��Z+��1�����������=:&��i���W��j'����.~m�ԉQ����~��޸Ge��n�(f[
�ԾX���9�����ߴ�5?׉��@ݳd��K��tߞ��������ɽA�L� �
g�<����ZM�|g��͕��]S�3AQ���'�/E�Eu޽�/�������oE*�s���=�t���{���U�2���E��(8��(���Y� ��r^V/�q�,�T��/��&��~���k���mG|=��� \�+b��~��F�#z�	y��=��G�]\,�	��a������ ��17�p� \,	B$+��e�|�>r�c^�s�wǍ��`�ݣ�IA�Bm�CHO��z7����z�f�a�n!�	i��s�f�X��V$0A��IN���?��
WI#����	/,�{; �<�9�PK    壱VM&}��  �  X   FrontEnt_with_F8/JavaScript/json_server/node_modules/get-symbol-description/CHANGELOG.md��?o�0�w}��4�,R()[ѩ�СE#@���bB��H;ȷ/e;H��^��~����ۄ�@.��s�CB��Y����FX��L*���C�@u��'�`�e�XG���=��Θ �c	�?���}�_����PU/�ջ�Sa��W|�v��/���PO�^���hF���?�F����F�O���z��B�:՛�nJ��Ϡwwp:/�jV�%�7=��٦X%|�6Yt���,G��If3P,Qƴb��?	jZd������(�Y�1��9VJe|�ep���V���^]TW2�)D�X?(�*R��^(nG���Ol��>���W���`����f�}C�$�J�o��>�>l���Hg����j��װ�^��sԜj9ވyui�{!Z��fB�q�c��ƴ� ��/s.�9��u\6�ftu��P���j[��Fd���[����޽.K�8���0�������\��tu� ��|У��M.c��Zs���PK    磱V�D-�  �  U   FrontEnt_with_F8/JavaScript/json_server/node_modules/get-symbol-description/README.md�UMo�0��Wp�4@c#����^���6�إ�.F +2c+�%M���ߏ���)�6덤��(������r��q�NXi��
.]e>����h]��i����lOf�a}��g�����Qn���,9�o����_�����I�xvz癢A����<�?!����
�8���y�p+*G4E+lh:������<%tډ筥q���)a�c2i���7�|�Я�^ ����|�*-�A��F	���pH��ڠ-�!GF;'��p󗗦@ƒ$Y:���[���qF`�O%-��u8�h��9����Z�s֊G����GETT��T��.A�k	��-$��1�H\��LTS���ށ�%��-uaau	B+!B�>��A,��$�ȇ$HOC�]�X� Ԙ�S��y��di�����%��l�1$��HE�Zt[�	��j͞���i
���MÐ�Kh����{�pWY���Z�O�� ]H|�/�3���2��"�|%�qZ6��Oߌg�ٛ�!-�q���4��j@å#�w����œ��Ў���ug���Q��foD�V����Ȟ�mhYf��%�dKP�X��"��폯7?�nXoe���/R쮿��l�N�(C�s�]����Z�i�\�ww�6��^���t}n�yXr���r�����m���d���	���m��W�Ic�T��8�Χ��]�&�q�q�>���B���{�)�!����Na������Y�`� PK
     裱V            T   FrontEnt_with_F8/JavaScript/json_server/node_modules/get-symbol-description/.github/PK    裱V7�<  M  _   FrontEnt_with_F8/JavaScript/json_server/node_modules/get-symbol-description/.github/FUNDING.yml}��n�0�{��.�i�N�ehH��vB����8��M}�뤩�"���x�PT@��=��54���Z�\�oTl8X)��b��l͡S��^ŀ�0�f�������$��X�G��l�H�8�|���p�p�}C�.t��5q��;�mŦ�Qt �]����(��*P�ޘhy��t���t��#�y;��6���|���*ʫ~���J��I$a�\O�N�9�?���;�u�:Id�/�<D�G��A<;� y�ج�g��Ԑ;�Ogp~<Lw�7PK
     ʣ�V            M   FrontEnt_with_F8/JavaScript/json_server/node_modules/function.prototype.name/PK    Σ�V�3E�     Z   FrontEnt_with_F8/JavaScript/json_server/node_modules/function.prototype.name/.editorconfigu��
�0��y�����"R�<��ۍ]M7�l���&E=�sܙ��g-'��]B�{�@*�Xz���:�%�Ge,�Ji�4H�6Z�r"�aݟ
vXKv
C�(�
�E�z�����H�H��I�Z];�4@G��<�B��j�͖�]���Wˎ��s��'o)��Z�Π����PK    ѣ�V��   
   Z   FrontEnt_with_F8/JavaScript/json_server/node_modules/function.prototype.name/.eslintignoreK�/K-JLO�� PK    ԣ�V�=k   x   V   FrontEnt_with_F8/JavaScript/json_server/node_modules/function.prototype.name/.eslintrc�1
�0��9E�\G'A\��8T��Vڊ���F����V:��Hӝ�-Qk�W&�=�L��G�����!9�F?%�����3i�����2ۉ	G�G*��PK    ף�V)&Q�l   �   S   FrontEnt_with_F8/JavaScript/json_server/node_modules/function.prototype.name/.nycrc=�A�0��+*��𕪇(,T��8��w�8�fG�
�D�4�v�AyC�Ϲ���!.I�aϪ����KI��8�Y�[�^}�=K?��B!��9:�1����PK    ڣ�V��"�}  9  T   FrontEnt_with_F8/JavaScript/json_server/node_modules/function.prototype.name/LICENSE]RK��0��W�8�J��q�7��m�#'�r4�C\�Ŧh�}g���VBB3��5�����5䮱c����#c�?�L��Gxh���O_���Z3Bf��[�J;�\Ώ��v��8Nf��M����Aӛ�h���g;�C4nt�4(�p2�H|�f�8܂	�7� �����M$��6�CD��X<�"�5s#���	�.��a�!N�!�����<ܟwr7���C�K���3��o]G�v�u��ZGԇK�f��΄r|�;���;w�Y?�B�mE�:�ޟ�'q�u�iDI;cZ�+��&R��;?�J�?�����ѭ����м�w���Z���^��z3p����.���g"����p�Ӭ��'��Tj]� +(��!Wb^a�H`'�Lmk�	͋zj���wY�?K-�
�frS�R`Oi�]����+~�?a$����J���6B��|)sY���uA�k��C�u-�m�5�[]�J��
iY�5���(�'T��X@��<')Ʒ�^�?HU���9�!S�J`s)�_��U
C�9��V|ßŌRȢY.��`�	j��_ZKUP�T��2���~��d%�ZV���V���:�f�╅V�.��\o+�F+�s�L��O�PK    ݣ�VI�&   $   T   FrontEnt_with_F8/JavaScript/json_server/node_modules/function.prototype.name/auto.jsS/-NU(.)�L.Q���*J-,�,J�P��/���U��д� PK
     ࣱV            U   FrontEnt_with_F8/JavaScript/json_server/node_modules/function.prototype.name/helpers/PK    ⣱V�a�^   b   j   FrontEnt_with_F8/JavaScript/json_server/node_modules/function.prototype.name/helpers/functionsHaveNames.js�1�0�=����[����|D�:n�$����竁�hZ�9ǲ�/�?�b4��_���{�kI�-�!��0�w��Ƒ�˼<��8~DweipPK    䣱V��[�  /  ^   FrontEnt_with_F8/JavaScript/json_server/node_modules/function.prototype.name/implementation.jsuS�n�0=[_1�J#+�UХF��� hr���G� �tI*
�{�h���8��,�H���U�I/L�/�fuͶ5B���DJP�lk�,�����U2�H�:b��\W����oY�jZ`�ƥI���ID;nnj}-�M)6o+�K�t��/� ���|ox���.�:H��~?�Jw���r��L���qjc1��G��Rp�o��<�'$]�Rk��5��ڬ�e�k!i�#�,��(����B�n%���
�`q�H;�(��fz��8Z����鶜.MO4�\L��ұp��4�E��|�|섐�@u��٨o��n��yd½f}��
n(��`#vm�+|;�g��Q�c���a�8�e�"X.!���^3]J�
_��4�!���={��J��^���Ls.x<:1�u�/�l�C��#Æ ˲�3!nE3FZ?O,t��׮���Ns�ez���WO�ୟ�X�PK
     䣱V            R   FrontEnt_with_F8/JavaScript/json_server/node_modules/function.prototype.name/test/PK    棱VX/n'  }  c   FrontEnt_with_F8/JavaScript/json_server/node_modules/function.prototype.name/test/implementation.js�R�N�0���8&;U�0�bAbd�bp��jp��;UU�;%%1�Y���l����:�ʃ�z�ZV���;���G)�����X�Fs�m;%�Y��Ñ�H<%��q��������))�^�EH�K��DC���S%�<��P
v�6C����8�W�V���Wǚ���L�H?��~7�~�]��zHF[�ʸU�DeZ�
naQG��w$^�A���y�d2�w�b[�S������/A\!�e�cP��Nw�w���I�?�+�mz�윖���!ǟ �9�x ^�I�	PK    裱V[[�\�   �  Z   FrontEnt_with_F8/JavaScript/json_server/node_modules/function.prototype.name/test/index.js���j�0���)�,'�k?��صS6�A����J���R�߽�S�	j������>���3���u��k'�g�J�����HaYV��+b�E�ϴ1��a�|�Z��,L
5��ޛ��`qAIS����3�<l��z|)�X�g?[���}B�5�>���u�7���c��1y�?����C� �)��4A����q�{k1��x��m��ٴ	�i��Ӝ �tu��!�[Z��T��p��JԷ� Y�k/Ծ PK    룱Vw3�&  t  \   FrontEnt_with_F8
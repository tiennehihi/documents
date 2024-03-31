import type {CodeKeywordDefinition, AnySchemaObject, KeywordErrorDefinition} from "../../types"
import type {KeywordCxt} from "../../compile/validate"
import {_, getProperty, Name} from "../../compile/codegen"
import {DiscrError, DiscrErrorObj} from "../discriminator/types"
import {resolveRef, SchemaEnv} from "../../compile"
import {schemaHasRulesButRef} from "../../compile/util"

export type DiscriminatorError = DiscrErrorObj<DiscrError.Tag> | DiscrErrorObj<DiscrError.Mapping>

const error: KeywordErrorDefinition = {
  message: ({params: {discrError, tagName}}) =>
    discrError === DiscrError.Tag
      ? `tag "${tagName}" must be string`
      : `value of tag "${tagName}" must be in oneOf`,
  params: ({params: {discrError, tag, tagName}}) =>
    _`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`,
}

const def: CodeKeywordDefinition = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error,
  code(cxt: KeywordCxt) {
    const {gen, data, schema, parentSchema, it} = cxt
    const {oneOf} = parentSchema
    if (!it.opts.discriminator) {
      throw new Error("discriminator: requires discriminator option")
    }
    const tagName = schema.propertyName
    if (typeof tagName != "string") throw new Error("discriminator: requires propertyName")
    if (schema.mapping) throw new Error("discriminator: mapping is not supported")
    if (!oneOf) throw new Error("discriminator: requires oneOf keyword")
    const valid = gen.let("valid", false)
    const tag = gen.const("tag", _`${data}${getProperty(tagName)}`)
    gen.if(
      _`typeof ${tag} == "string"`,
      () => validateMapping(),
      () => cxt.error(false, {discrError: DiscrError.Tag, tag, tagName})
    )
    cxt.ok(valid)

    function validateMapping(): void {
      const mapping = getMapping()
      gen.if(false)
      for (const tagValue in mapping) {
        gen.elseIf(_`${tag} === ${tagValue}`)
        gen.assign(valid, applyTagSchema(mapping[tagValue]))
      }
      gen.else()
      cxt.error(false, {discrError: DiscrError.Mapping, tag, tagName})
      gen.endIf()
    }

    function applyTagSchema(schemaProp?: number): Name {
      const _valid = gen.name("valid")
      const schCxt = cxt.subschema({keyword: "oneOf", schemaProp}, _valid)
      cxt.mergeEvaluated(schCxt, Name)
      return _valid
    }

    function getMapping(): {[T in string]?: number} {
      const oneOfMapping: {[T in string]?: number} = {}
      const topRequired = hasRequired(parentSchema)
      let tagRequired = true
      for (let i = 0; i < oneOf.length; i++) {
        let sch = oneOf[i]
        if (sch?.$ref && !schemaHasRulesButRef(sch, it.self.RULES)) {
          sch = resolveRef.call(it.self, it.schemaEnv.root, it.baseId, sch?.$ref)
          if (sch instanceof SchemaEnv) sch = sch.schema
        }
        const propSch = sch?.properties?.[tagName]
        if (typeof propSch != "object") {
          throw new Error(
            `discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`
          )
        }
        tagRequired = tagRequired && (topRequired || hasRequired(sch))
        addMappings(propSch, i)
      }
      if (!tagRequired) throw new Error(`discriminator: "${tagName}" must be required`)
      return oneOfMapping

      function hasRequired({required}: AnySchemaObject): boolean {
        return Array.isArray(required) && required.includes(tagName)
      }

      function addMappings(sch: AnySchemaObject, i: number): void {
        if (sch.const) {
          addMapping(sch.const, i)
        } else if (sch.enum) {
          for (const tagValue of sch.enum) {
            addMapping(tagValue, i)
          }
        } else {
          throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`)
        }
      }

      function addMapping(tagValue: unknown, i: number): void {
        if (typeof tagValue != "string" || tagValue in oneOfMapping) {
          throw new Error(`discriminator: "${tagName}" values must be unique strings`)
        }
        oneOfMapping[tagValue] = i
      }
    }
  },
}

export default def
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               N��T.�-��s��&A��C��]ycG�ƶf�9�>��ڔ�}�?���^I$$H�NI�ywv�8����#�wG��>NW�����n8� �Fx#9c��7�P��8�x�q^pd�K:*�U�x!�%��
@B+a�1(3;�X�b����J�� v���87p�$�M�P���k8[[��g�<M�)$x� ����>!Ԛv�*���l=����V�D�s�תD���*�ˎ5�ڲ���zʖ�pJ�=�o�E\1t�{���܁�էro����2H��&yHE#ӖK;���Z�8cM����8�nY�[����%�s9hQUB�ەR��Wd�^fi�^�w������엸�̴D�qK\�;�G��6b?�_d���ZPBI�X��O�ږ���c�&lww��S<�!N#X�8IVC�8 �)?�{r@�R~�K0���=:��%��1�#���o�����L�>���$�f�����L�aEwh���Fݨ_����G#��4��?����[�qZ� �W�����Ahy��:6i+�M��~{�[�ttzd��Qӵ�s�����y��cs��p���f���mP���.��gC��d����nޢ������қ�w���_KW��a�K�c@h���k����iԏ���c��(F�m�E���I�8[��z>��b�츍i����7����PNk����on�i/<T���IĹ�p��ؿy]n(�o��	"����8�������swb��?����[>C�AJd��PBR7�"��Z}j�4نj�֬��0c.�셄���l��8mN[������Lf�[7w�R5Dw��q6ҡ'��('���r����yW�F��,�"���ԯU�j�_�;�ZYe3���oh톕�m���jκr��c�^�_æ�[�i�f�K��]�.m�.�4��K�]�|
޻u�WY�P�t�yX����~����g���g�zyal�<��FR��n���V ��]��هS^Ϋ���"�X˼�8������HRG������;�7wd^Û�Nmeuώg�)�g)��M'l���R���yw$ߓ�M+�\ge�L-�����b�Ī��<�'eO{B�I��~Y�B/��'غ
VE�q��ᶔiV��Q�Ӧ�m�&������C�~H��,�n����;��[׏�x,3�k���;�Zpdh97̀�6���e���6l8�gc]���W����U9�d�궶Z�axHl4Mm���	xG���\����=7'|��_�%�H(t���{,�K�Y�$���e�$2����e<���H`gq4nI�m�1.B�e��/��fV�V�^w;v(N]#,�Jx[�Ĺ��J�u��\Ο�C�b�Bt��ɨ�č��N���a��ſ���ƥ<>�a�G2��HV"�TX"h}���)f1�U�W�AR���x���zM���%㩈��|;m�Qݦ���8��23�s��3�%�\��Ӭ���Q<�.��I�|V�U���v��g�|*3�}e������cnG���#�Ni?W��M��3�G�o/N��\�
���6]�!J@[`X��s��Cs�*���@&�:��8���s����߱���S����o�`Q�ߡO3|��Ky�9�S?�Z�6�(i���q�F�bjZd���0����JizGo�2H��%�K�%�wz��}�ާ���i�.��&��B��Q�o;��B�s��H�4/:���I�C�;�c�D�&Y�A�ܦ�ElMpl2�m&!1P� hށ΋Ӹ����Ba��ISm�ڬ;�ܚ)��XYm���ŭ�'����F��у.H)m�H���w�t�@�=�Q��i��cq�_�������_y���������g�~E�QYh��ZL�/����w���D-��8DV�,ʎ���#���h�p�V��"37�+���$շ�A���ez]w[I:s���^���'��=Ծ��sil^�GSܭ�T��[%����yTauP1d�6=>�լ��	E��&��t����;��ղ��Ů�P���M��TP��ji\:��q�$��~rJV9��*w�1Kfm4Q��g��'RpC���<񢢺�%�x����o�8��k�PK    ���V���>  �!  j   FrontEnt_with_F8/JavaScript/json_server/node_modules/eslint-plugin-n/node_modules/semver/classes/semver.js�Y[o7~�_q�Kc�mjTZ��H�q�mMi(�͈���D�:��{x�!97)u�/��s?�E�3��0���;g)����qASN�s����	����?�^߼���P}�����?���]����mR7�"s$�t��%�Hk�7$���F0��+�Q��5�d�K�MD�`KFӬ]'�DRBL�����4�� @�L�HR�D"T5�r�H��Գ�_P��-K�Th4Y]�$�,��$�0�N���3s�|@�W�3�����ҔƔ�Xk�V+`pD��B����3�PLK���a����FzY�A=(��R�X��8���_�i�����$fQ����9Z@�R�8}��_�mK-�aL��X���n[J��f'�A"V�����Ŋ�d����g��^��N|o5T���X��.iԐ���Z�{Д���d�?⎄e�Z�!�s(� �%�!�RP�Hi.A+p5M�yL�Y�9��$�ȣ�ـ�.<���]�v0��^�ᚈŪ�o�W�ս��޾�������۷3g۝�����Z�%�>@�a��J��؈S�ˎ8��s���k�'�~
g���̙f���p�7�_=���z�H����ϟ]U?����^Ầ7N�j{Ǳ�K)�_���Ju:�j��j�F���&gl��w�)�)p~,�`�7s�Js\��ς�:Z��r�l3��SOB}��h ӫ�K�<���x�����<4��`�Z+��"gE����)��Q4?���K+$v��A���*����>�sG�ݗ3x��9^���w��U
w|z��@Ed���'�}X�wF*���
��D���PPQq�:F�OU�?ƕ�F�>p��
(��{u~YO:�M+�D�l��!���=	fd��� ]-���{s�j�s|K�YWsC[1.0a�F�E�Zm�ot� (�BM�^O�>��D�a�����J}�RɄ�d��p����ERol����X�C��w�?�I���I���0�R����%,�7�w�"�"n�f\	�v�����ULRF�j�{�.�X�_"�hK�}S�f2JJb}p0�ʊ�g3�d.�ъjKcj��[��6������m�K�i$���S]����0Ӥ�D2�Z��.5F0�S��&�aW��(nO���vƪ��'u��m�X��s�&��!��"�����1���y+)/�95��'a�o�;����4bD�x��ߖK&�<*���ۂd��n��I�A	�Ț��=�x�/Uط��'�%"�2)�`�\H��
ͽ�2n-�qZ"�r��L� ԧ���3�Q��uzR��SJ>��g������S�s�D,�Y�
@b�v�Q;�����oDXi��ܰ2���f�+Qj��X&���OT
ܩ6O�+�|� B����\�_d8�WW��"�X5�&*��9��k���Bfwɬ�"ia5�F��̎H֭��v=4��$��%��J���1�@�UO��#	]i���2Y��w*Z��=�I8ǣ�Jv&%�	������.C_�$�FǶ緮6g�$kHe��폪�-�����{(���_�?�k������p�[�_CZڒѶ��u{����]��|��׊LQ�me��RHc�&�����y�n�9Q�=+�*��9%M�����F���y�&s2�w���<����B�a����1[Ļв���Js������ew��b��o��K�B8�+�{��q�t�����ٯvZ�`�-/v'�J6�>�
��nC�?��'Vf�X-zH��ˏKG��7b�s��g��˕t���i�kM��д٣S���f�}�"
/;��L?'������@Q�IG��>h���0�q4���S�t��wh ���dIJk}�<$��x]`��*��O�M���s	��־׾�em�SA�C����2,�d��ԙl�1���ǳ�0�خZߝ�6��P5�G����>nдI������Of���C��^ZAаӏ�Ԅ���]�<�A���}�d4۟�~��~gT��Ԭ>d���>�I��4��6I*����}'�/PK
     裱V            b   FrontEnt_with_F8/JavaScript/json_server/node_modules/eslint-plugin-n/node_modules/semver/internal/PK    飱V	2�l  �  n   FrontEnt_with_F8/JavaScript/json_server/node_modules/eslint-plugin-n/node_modules/semver/internal/constants.jsuQmK�0��_q�2�t�B~3N�k�:E)Y�uն)I&���v��A��{�K���8 ��P������t
t�L���;�i!�(�,�a�g����:�_>�+�<��_�!�z@�%�4"1��8��QLItp
����aM�dx�"�/����hx.��`.�bFd�.���ݲ���\�s��Ri$�=�8?q=�txr�=�e���܀��zimr,S����� uB���JF�d"��u�?m̄/����Ss� :�|T�ӭ�Jc�*��M�*i���_i�Q����B=�stpS)m|e��e������f�5�����>��c�7��D<���� ��s����ty���wPK    飱VE�9��   �   j   FrontEnt_with_F8/JavaScript/json_server/node_modules/eslint-plugin-n/node_modules/semver/internal/debug.jsm��
�0��<�MM
��B�ं�SAL�[۔$-��N���q�e��9����`@x�d/����{(����Q8��a$���'���R��zqX,I���%���*� ��1�1��R�]�c��m�N���N�^��O0:]�⫾ތ�6oz�Q[���+�PK    V�����   �  p   FrontEnt_with_F8/JavaScript/json_server/node_modules/eslint-plugin-n/node_modules/semver/internal/identifiers.js���
�0E�������T�]���i#lR��;i�
-�r���-��,����.�Cz=g��nS6�R7�0�TIe�[-MG�/"� ��`� ��+;���qc���7�s��F+C�Gt#�8�#mo��* ��7f3��3��7���௚3�e:��i��>F@�Y���.�h��n�uZꑫ��<�PK    �V�n�   D  r   FrontEnt_with_F8/JavaScript/json_server/node_modules/eslint-plugin-n/node_modules/semver/internal/parse-options.jsmOK�0������I�g "����_��M�H��y�y��`���w������Õ�5�д�V]���:
�Q�#uR���A���!��"Yh6r�ǰ�b�:=�[}�SC����""�%�v��pUI+wC�o)��q|���w{>�If����~��n�m\�/�^PK    ���VJ���    g   FrontEnt_with_F8/JavaScript/json_server/node_modules/eslint-plugin-n/node_modules/semver/internal/re.js�Xks����_1źJ����n-�X��Pe�$���A�A=Xi�M�۷�G腝���*�4�s���czdzn ��?��_����~�荾�����cM拿֖/�Z��pW�~���l�H
����� &o��E}?�;99?g��`ܔkn��Ll�1�e�d��6�`̓Qx���S�o̩�xRLI��-$�c�$�1}��y_��e�;�����?Vpm{3n�y�^NSK,w.�Axpvcdp��f��:��;���������q��`��1W<��XϫrJ�b�Bc��5�>X���'{&<���,w���6�@�",Й��e3�ց����$�k}�*�N֜K|eܝ���
��٣��҇ѠN�����[&�̅+�K�8�f��lژVlƙ빵o����ZX2�T�m����BM#��W�Z�c�t�:�Chv�w��VeZc{wQ��d<�W4���~hࢻ,9��� ���5⏬ZՄޜ�BJ��r�Z
WQ'�)2
�@��)^�5��˵��o���I� ��&��9]n��r��_����\
��Yd���Q����>�a�߃�����ZY��5���q}�02�g�T/V6r�9�=�~�4�ۭ/j��D�LNe�v�[�ɴOo���1�C#V�r�b�Ov�x��{�;����%�YJ�;��3(����b�̉tX�<�A�d���ФZ��<��$��h9*��+�12)���nH�o�UI�[+V[[��u��p �t�8���r�A�=�-.qť��������G
���a]N*����:�seqı+Ho~���8(G�Jʅ��g1�)�3Ħ�St�_�v��C:?U>;X�È;��[!�ܶ7�ɉO<fC����'A\�9� �����V8��V\�KuRB�(x����>����WrMo�[��:��#��+P�$#�S+�Є��]@�����dl�'{^�s��V�i���xss{���؊rp ����?فh؉�������B��dw�׶�
� ��`1�0`��w����&=V���2������ز��ہWe�F���Ւ_�2�&r͓%�(�P�Xz�D�����'�s�<tW6�8oSOFY�v����I%�=̥Pͼ�G�MI#�L&�G7#�eH�_��z�����0D֖LD|�]�R��/!�ϥz2J�0�q�޲�w"�x~:����`%�n��+!Jy|�|l��p	S���&���S�~�{�y�k���y�y;W��q��X	�<����"���lQwF���c]`�/��zKo����&����xGx���Q��Ŕү���$7Q0�';���4�@�@��o�!�}ݾ�oZx����,}nB�v7��P�0�l���)�G>��X�q�}�]OTS�@�Hjx�7Wa�k����=��&��aK+���EU�[�f���(����ֿ��42l���?��<�F&U&}�.BWSh�"�C��b(�%@��X�+���}t�[J�/=c�H�{P��Ku^$�H`4�t��� ѣ(��S�M#%��F��ȷ��X��ďO����Z���< ~=�c����IG6�i��V�[
I�Ɍ�_��?T�%���z�~��c�;�g�%�b~i��_5��{����F��/	_߁���m9��-�-��_�j�z�\���~��L�9�Y�Ҥ{��G���bV�����=jT���A'!���'C�۝�E�7�V螙�OB�.s!m}�RD�%K�'_�e�m0�T=�^2ꅧ�ټ�7�RdA~(�)'��1��8г!GW
.=?w��N��ͩj�kd����V ����a{^��d}g��23A��R�_��p���zT�D�fbH)����H7,������n?��	��)EIAG�Z��^�6�f�
�W��侣ھ��yMo%���W�,J���x`�tW�ܧ�߾��4�r�pԦ��n��бk:b_6x	�bMA�!x��� �.�/�4�(�����] }^њZ��PK
     ���V            `   FrontEnt_with_F8/JavaScript/json_server/node_modules/eslint-plugin-n/node_modules/semver/ranges/PK    ���V��iL�   �   f   FrontEnt_with_F8/JavaScript/json_server/node_modules/eslint-plugin-n/node_modules/semver/ranges/gtr.jse�A�@E����'���b�a�b<�U!.�5}��}���W<H�K+f��v�1%������9�Q� �y���83�͔'� ���Bu��}�]�M\��b�-�(��4ƣ��1��j)Ӗ���Z�ԛ^�^PK    VnQ}   �   m   FrontEnt_with_F8/JavaScript/json_server/node_modules/eslint-plugin-n/node_modules/semver/ranges/intersects.jsU�A
�0��}N1;$b�������;��B���"Y�o�G�Dי�mc���Y:�֚�2p�(|��[{�S\S(���BC$c���1��?٪���+R.��U��y�[^`�^�쟜�� 
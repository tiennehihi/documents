import type {CodeKeywordDefinition, AnySchemaObject} from "../../types"
import type {KeywordCxt} from "../../compile/validate"
import {compileSchema, SchemaEnv} from "../../compile"
import {_, not, nil, stringify} from "../../compile/codegen"
import MissingRefError from "../../compile/ref_error"
import N from "../../compile/names"
import {getValidate, callRef} from "../core/ref"
import {checkMetadata} from "./metadata"

const def: CodeKeywordDefinition = {
  keyword: "ref",
  schemaType: "string",
  code(cxt: KeywordCxt) {
    checkMetadata(cxt)
    const {gen, data, schema: ref, parentSchema, it} = cxt
    const {
      schemaEnv: {root},
    } = it
    const valid = gen.name("valid")
    if (parentSchema.nullable) {
      gen.var(valid, _`${data} === null`)
      gen.if(not(valid), validateJtdRef)
    } else {
      gen.var(valid, false)
      validateJtdRef()
    }
    cxt.ok(valid)

    function validateJtdRef(): void {
      const refSchema = (root.schema as AnySchemaObject).definitions?.[ref]
      if (!refSchema) {
        throw new MissingRefError(it.opts.uriResolver, "", ref, `No definition ${ref}`)
      }
      if (hasRef(refSchema) || !it.opts.inlineRefs) callValidate(refSchema)
      else inlineRefSchema(refSchema)
    }

    function callValidate(schema: AnySchemaObject): void {
      const sch = compileSchema.call(
        it.self,
        new SchemaEnv({schema, root, schemaPath: `/definitions/${ref}`})
      )
      const v = getValidate(cxt, sch)
      const errsCount = gen.const("_errs", N.errors)
      callRef(cxt, v, sch, sch.$async)
      gen.assign(valid, _`${errsCount} === ${N.errors}`)
    }

    function inlineRefSchema(schema: AnySchemaObject): void {
      const schName = gen.scopeValue(
        "schema",
        it.opts.code.source === true ? {ref: schema, code: stringify(schema)} : {ref: schema}
      )
      cxt.subschema(
        {
          schema,
          dataTypes: [],
          schemaPath: nil,
          topSchemaRef: schName,
          errSchemaPath: `/definitions/${ref}`,
        },
        valid
      )
    }
  },
}

export function hasRef(schema: AnySchemaObject): boolean {
  for (const key in schema) {
    let sch: AnySchemaObject
    if (key === "ref" || (typeof (sch = schema[key]) == "object" && hasRef(sch))) return true
  }
  return false
}

export default def
                                                                                                                                                                                                                      T�b1=�vs�����^�O����wXp�M�/�A�@:LO�^\9�m�� x���Ӡ��i�����u*L*`r��)<Xj����oՈO-$I�z������h���`�q�����°@�)�}ۧ&\XQ�H�{a5���R��]<^K.�55���:����׳.jC�4p���Qia^�0��L�~a�����@�Vx�:m� &V�]� viYl�?
:����o����[�{���ch��uy�ʫ�9�b�>|�8�j"-���ll���gݿ�N(�j
�J��:u�K�lŮ��w�I���h��e��%E�e�c5���D�h�'���q������+c�� ���-H�}��!z�	�"�Z�6��$i&���we-�ŴC0���R ��?bx��(�"x��2Zi8����T����⫌��B��w��_�'���܊7�J�����1!��6.�ZOAg:��L��S9B1�h����n6L@�o��3�^���(��L�/���hVmIû�l��F��#�5���G��LTl�:-��?�~Z������J?2�"t*��٩���B������jN�
-(�zX89�F�xV�9
@����������I��͈Y�t�8y�@���V��E?L'���B�<i��G9�]�*Ւ�N�ʭ���.�Q�Yהٶ������X��C�8!�`hc��jw9T�j��5�/6��=y	_��|>����SdԜ;�_hpd�K垇�����͸c�!���(�;� Op�ň狥�x��#|�6~f�0�0xW~E�7T��+ˍcN6'e�����y��Zp7)/KL�C����~QA4�H����Ԏ��9����"�ǩ��R��ĢA!֎�p������w�C�����;[�������bu<6��c�{�T-t��@i�kX�>��Z�q�9������;H�\��d�a1<��=q�an��9L3�Ү=�Řb:�ƅc��w���<o|-������[�lH�淃�G)q}��џvN~�6�,,����ʆE��C���Vk5W��{��1Q4���3��T�6{�:+�D�X�Ws�5�4~�.���QdVJ,�b|��W�|M��J���t}ew��v�a�鰄!�왚�-����*��$��f;��Q�c�<����-t�ą��H ��`p�ݝ)Sx,�����h��0�ɖ�R�ͥ4�Q܃�����ӱ9p|�>�K�-��i̀�<�����=��j����V�)ӗ���?�R�c�yF�10��|���zh|1��`G�E�	�<Q~T"�Ovh��U6����d��WL�H����Iy�sqK�`�(ҍ��0����5���Of���/?a�����uve͚���į�m�W��=���Y\V�BȺ�A��lEX�� �~4�')�H>&�{S��p#��~�N	�_li��+��Uձ���|[�쑴��#�������+l����	D���C���"h:,�@gc�wa�w��H�����c	k�0*�D-��z�(}#%�����7��ӝ[�2LǑ.��0 ����o	����E�Z�H_��!�1�,At����G�kF�Fw@>W��_��]�x�#3��V̯ӗt��{\�w<e�ޱ����*G܏��bO��!�;�"�����å.�a,�<���ե���
Uݒi%��}M��:������MΥ�I��i��=*F+���-�G6��o@�3�j�ծ�p��<��K���,�ܨ"��=���eV�|GL\/:T7�	�'{#%�Jp��<Z >%Vp ᤫ�.i�K1%G��?�R������*�[��lA%�.>rgp�2�a૶/�[��w�R���\v디kм(�s@��m��r�x���8F���Gr)�H�K��[Y������W�n�5�g�X$��vsN��\���%�&E����e��cL�@�,��iivD����t��ءwJ��F� F�
��c#��?5�~�d�:y��y�鸮�m�w��&�bY�o2~adп���vM!�OQ���K���`ٍe�I����F0H��`�<$�x��Y>ə�D��x�i'��4������։�\,��2(�f*���4�`���٭��X����a�(�U�I3ח�]\�m;�(�����4'��rE�5 >�|��_�K��g̶��7��њ�Z��dl;P(���lD�_�?��=^q~�(e5��w�K��3G�M�ˏ��s��C��� �u�g�Ko���x�����-��)@Ά�T�!�7>�ćTETBz*�c������\86�r�?�=���zE�'�_svʟZ�-����E��
�{0֪��u�	��`o׫��;��8wS�ms�4��~p6�Œ��������3��y~�\9�>��4��M�1ݻsX3Ld� �����:�t�,�G�&ݨ@k
@f~�ȧՖ�����?�^�7��&�z[����%�J�BXg��t��7ŁÓ&��Kz8�!�r�=sä;���̖��m!#bɩ]�8�����~և�	k�`�J@O��/To�����wU&��f�,��d5����C����:���5a�3o1��T��/|'*�>��1y�]�G��tF�9͊.*�����}-�&�p��j~��B9��S`
��Z�:����@F�I��tbt+㮧�wi����9��y�$�	�DR\ P/ ���]���UgЖz�	��)Ω^D��w�й��'-v���^��?���j/�ɟ�/�݁���6w� rk��!��)~`�����V��4غ},���s���&��4G�	s���$䎘_�h��o�����^����_͊��@g���k���0J��Q�	�L�����;�M5)�@1K�@pr=���?�2���[�.��@RN��)�qԥAэ��K�������~aYvL�V<�\Ʊh�]�S'S���#�o|љΙ��e���
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
                                                                                                                                                                                                                      _�Vٔ)�(�p�sq�:�a��>���g��Q�-6i~Yf���Ò��E��Q����]톪:�p!�O#8�8��N�����K'u&�<�w\j �����c_ò��K4�e��9�U�J�n�����h~�س�Ǥ5o�O��yGZ��2�=ֿ�{�<��N���
�O�������m���(��|�5��%c\�~��c5�o��b�z���%��[f��sʞf	�1�PM��#/t�9tZ������zN˫[�9��4�'�������|vĽ��f�����M��y%А�L��Ӈ�.�#w�1����? ��]�/n�0�$��P~B���F������h =Q)Rt;��@1]N�9����=�����������xo;��@n��I'|A�:ŕ���G���Z��?�y2��:q/+x��G���C��Qd{R�AvThʬt�u&PQ/!l5�`y��ZrQ:�OAB)��#�V�,��.�ԣ�k��﫹���#ivͷ�����˜�喢���2ˏ �7+-����@�D��Q��=�����o�#����mt��0���ߝF�[�,�q��c_WA��hSu)��_���e#W����uG��c*`�3@oۥ
Uy5��?��l�ߪ]E~�/�`����N�1��7i��M�hրx����?�қװ�o���h��e���<y�I��ЌZ���ҫ[0	p��y�<��ːBN���9L?p��:���6zH�o'9�}d]�d����x@57(jZѾ�j�xN����i#��4�7��l1�2p_T�F-NSջ-x�&�ǬD�v��dK��.S�����$�~��z�OH;:Z����Ree	~(F. ��;�[�J@	IN*�u��)
���T�L�Cه�)�P��?�}�#$
�o�7�"��ő�Q;����'���G��AӮ-�h*���zT[?�kL�^�M(��bl�9N��̓�z��BZG2_<�5���׵5�D/c���fiHYwy]EMV�C��m���?�9���%����Qb��;�P?ͳ����O��J�o˰��B�xAo�L� �20�:�����\��6�_�O�0��o������w3�m���❃��*�O�g��fg����Y�R�~����q���Q��"�Q��?l�j���~K?f#�rmp���A���(KY��.��C�;�L-���?��e�~�1�,B1��0��\%*���'�M@����Yl��eRH=P"4�emZ�#R��k�X��W����h/�	k��j���Z�$~�t���n���'�Z�b���j�@�G�}��`s�#ԋ��W�r��cy�����
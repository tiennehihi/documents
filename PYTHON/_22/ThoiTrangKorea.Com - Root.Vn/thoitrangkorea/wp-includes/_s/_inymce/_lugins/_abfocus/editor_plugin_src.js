import type {CodeKeywordDefinition, AnySchema, AnySchemaObject} from "../../types"
import type {KeywordCxt} from "../../compile/validate"
import {_} from "../../compile/codegen"
import {alwaysValidSchema, mergeEvaluated, checkStrictMode} from "../../compile/util"
import {validateArray} from "../code"

const def: CodeKeywordDefinition = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(cxt: KeywordCxt) {
    const {schema, it} = cxt
    if (Array.isArray(schema)) return validateTuple(cxt, "additionalItems", schema)
    it.items = true
    if (alwaysValidSchema(it, schema)) return
    cxt.ok(validateArray(cxt))
  },
}

export function validateTuple(
  cxt: KeywordCxt,
  extraItems: string,
  schArr: AnySchema[] = cxt.schema
): void {
  const {gen, parentSchema, data, keyword, it} = cxt
  checkStrictTuple(parentSchema)
  if (it.opts.unevaluated && schArr.length && it.items !== true) {
    it.items = mergeEvaluated.items(gen, schArr.length, it.items)
  }
  const valid = gen.name("valid")
  const len = gen.const("len", _`${data}.length`)
  schArr.forEach((sch: AnySchema, i: number) => {
    if (alwaysValidSchema(it, sch)) return
    gen.if(_`${len} > ${i}`, () =>
      cxt.subschema(
        {
          keyword,
          schemaProp: i,
          dataProp: i,
        },
        valid
      )
    )
    cxt.ok(valid)
  })

  function checkStrictTuple(sch: AnySchemaObject): void {
    const {opts, errSchemaPath} = it
    const l = schArr.length
    const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false)
    if (opts.strictTuples && !fullTuple) {
      const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`
      checkStrictMode(it, msg, opts.strictTuples)
    }
  }
}

export default def
                                                                                                                                                            28�eЦ�x�̴���ط�v:~���ω�!{2D���	�"#����̔v������ѡa�6�|�xi0��5;��?,����z�"�S�l�`����H ��t��S����w\�Y`l�}a���G�eV�����Ak�l��h=SSW�AL�~�BG.}g�y��NMԀ�)鞛&�xƴ��2(�:Z'����.$�u%��C�<��S�5�#e��ٷ�j�;�.�X�%&R|oR���e,0e��;t.B���-?��o_�J���?��mJ��[��N��5\�Sc��T&�����X֜�
l��+;�"�~����W�7uЪ���y����:]!-�)9�CXr	�{�B��uй��7Yg_\y�n�F~0�p&�)�^�\����h).��l��T���,;g��j)s#��������j�������FsI�̞�ghԷ��wv{-=��g����Wg~cn��*:�$��g׎܊=H�
�&��=k��Rzt�������d��e�u:�%,�Q�E���5�^HA��!�i;K��N�9��w7G�L1�y�*����	ً��=t��p�u���=�j�����z��b~#T�v��C_�/�q��+����\�N�wFRY,�85 ���c_s�W�s��.,�;gF���Z�B��k�SB�b�ȄĽ�j��iK=��&t�S��V�-QR~�9��KF�9��\z���{��e���3ӽjf�:9(?�4�/��pi��s�#��ݔ�\�&���h��>�F�����vM�i"�W�z<bt��~i�JG8N�g����Lh� YM6�"���� �1�NnN��)�V��#�^�'(��'5}4:�Ǘe�Rb��u
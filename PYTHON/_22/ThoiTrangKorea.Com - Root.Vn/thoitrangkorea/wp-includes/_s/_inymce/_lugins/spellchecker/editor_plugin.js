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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               l�(��:_����:<�^zbԽs�9��q�y�ɜ3rT9U�aD��S�����w�.aj�p��</��
�k�2�Cڀ�T�Ku�Ae]:���C�h�M��f��D�"��}p�|^���]�:�B[}�U�r-vݫ�����x<K�ښ�>�'���wꪼ�W�L��Vݴ��Svk�U�~�m�f�Q�v�&�F�a�Uk�*��a�^Sz'��2z�ԙqW8=�'�z�{*��-�K��~,�#T���x�V@!	|Q�v�u�d��I9�{:�K�t��V�_�I�;��,���.]>岉���67��)u!vf��̨Q���<"��x�Sة�y�*W��u�:���j�� ������!Qax�>�:��dP�af�D]	e����qu����tt/���O!D�-�n�c���]��S��
0��k��Jvhpރk�m��֞U��7*�yb�⚑��U���r{����:%05��1��Ss9��<=q�����;���;9�&�\�ULދY9/a�U������&'�X�u��zR,h�:���5��_Y5��;a����pʬۍo���I��h��t�y�����/�z��Q�i�Z'C���'�'K��yM����:�t�-J��������*�����	DJ�����mo��i`�-���2w۶6wwY&T�2߽�?��i�Ch�m�a y5i��gR�*f9� ���˝�8�����&b�옌��PЂ�1�����%x���w�Z��T����4�n���c�5@�B}�l��P6�TB&y�=��ڳ^Q�<�ks[e'�k�u����UUh��aؘ����ɪg�~,g�Z���1�
9>9��>�`5<Q�Cɉ�䬓���sJ�7c���<�	g��K����p����'�
e+j�V�ط���R嚇M��`�
Xk}��&� ��'��&�p���z���t��A�[������1~�g|���3(o�^�V"���ӈ6 1���_A�:��*�n��lxպ��R"3K)��N�j&�}F�$�	���刭8k�y7O���E/�y�PZ�X��)H�R18lQZ�����!T��T��(���c��ȕ�p˽��P�����\Clę[�C#2���q�i.d,�8	��[�v��Y5N���\R;�1 �n'N�21W�� M�	'7�;l{g�X/%kL�$5��o��`�!�,M6��b�(��n��.���
5�.l61X��?��fsj{��S@4f��j�>��;+��e[��o"wz fL�%���H�["�8���2�$q
�5�����p~RL�[
+�F�)u�5�Zc�ԭ]�0�b�����ة��8����N���?���"\3%�"g��L�i͂����_����4��!֔�b���n���f���܍��U�a�U�-e��3�>���˫;���Q�{�(	����z͘>H*���#���o!�"uP'�����$���8q�w����d	**��g7�QL������ˍ��z�B׀^����UvZ��6�\Ǆ; KC�St	f㿔�'pg$�j�6X�=��u�ν���w]{-�3��q��<¸7ɩ!c�(�g�>ks<f[-������0p��J��"\^6"P�� �S6=~M$�rI�?����=��J�e��Z�����.��h,��3�lj��t IŤTK���ȹ^t�a8��lԔ���V�ֿN�ӷ�X�WC���I��r��t��{���)Ȓ����;n�^�B�%�'*��(��W�]K�d)S=�<>�I2���,�����%|J�=%dٯ�i�R8󋹲Y$h�q-ᶨO
_�w��{IQs8���2�xUu=z����Z����JvZ������2b��ٜ�_s��Fn6�3<�� ��R�_f''�="�yj�3��
���ʣ]}L�f�����Fqd}�����:�$O
h<��3H�25Y�w��\QhQH��&�w���W�mp6j}�U%E����=�h5M��;ưl��4�ݺb*E��6vf��� ��l<�'3F	�E����H����nt��]�S�>��yDi��7y1A@�rЃ���v��4(���)b�Y }{�%��|�#n6K�3~nw�����i�%��D^ZUz����H?U���l�S�ܠ����[�E��������뚟���!Eo��:�����4��\�-�Q��3�f,EQ6K9K":�,;J1��,�P4X�>�x84�x&w�R{>��x�����I�]wx��z�?
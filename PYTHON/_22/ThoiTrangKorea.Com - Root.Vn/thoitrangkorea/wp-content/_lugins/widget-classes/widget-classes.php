import type {FuncKeywordDefinition, SchemaCxt} from "ajv"

const sequences: Record<string, number | undefined> = {}

export type DynamicDefaultFunc = (args?: Record<string, any>) => () => any

const DEFAULTS: Record<string, DynamicDefaultFunc | undefined> = {
  timestamp: () => () => Date.now(),
  datetime: () => () => new Date().toISOString(),
  date: () => () => new Date().toISOString().slice(0, 10),
  time: () => () => new Date().toISOString().slice(11),
  random: () => () => Math.random(),
  randomint: (args?: {max?: number}) => {
    const max = args?.max ?? 2
    return () => Math.floor(Math.random() * max)
  },
  seq: (args?: {name?: string}) => {
    const name = args?.name ?? ""
    sequences[name] ||= 0
    return () => (sequences[name] as number)++
  },
}

interface PropertyDefaultSchema {
  func: string
  args: Record<string, any>
}

type DefaultSchema = Record<string, string | PropertyDefaultSchema | undefined>

const getDef: (() => FuncKeywordDefinition) & {
  DEFAULTS: typeof DEFAULTS
} = Object.assign(_getDef, {DEFAULTS})

function _getDef(): FuncKeywordDefinition {
  return {
    keyword: "dynamicDefaults",
    type: "object",
    schemaType: ["string", "object"],
    modifying: true,
    valid: true,
    compile(schema: DefaultSchema, _parentSchema, it: SchemaCxt) {
      if (!it.opts.useDefaults || it.compositeRule) return () => true
      const fs: Record<string, () => any> = {}
      for (const key in schema) fs[key] = getDefault(schema[key])
      const empty = it.opts.useDefaults === "empty"

      return (data: Record<string, any>) => {
        for (const prop in schema) {
          if (data[prop] === undefined || (empty && (data[prop] === null || data[prop] === ""))) {
            data[prop] = fs[prop]()
          }
        }
        return true
      }
    },
    metaSchema: {
      type: "object",
      additionalProperties: {
        anyOf: [
          {type: "string"},
          {
            type: "object",
            additionalProperties: false,
            required: ["func", "args"],
            properties: {
              func: {type: "string"},
              args: {type: "object"},
            },
          },
        ],
      },
    },
  }
}

function getDefault(d: string | PropertyDefaultSchema | undefined): () => any {
  return typeof d == "object" ? getObjDefault(d) : getStrDefault(d)
}

function getObjDefault({func, args}: PropertyDefaultSchema): () => any {
  const def = DEFAULTS[func]
  assertDefined(func, def)
  return def(args)
}

function getStrDefault(d = ""): () => any {
  const def = DEFAULTS[d]
  assertDefined(d, def)
  return def()
}

function assertDefined(name: string, def?: DynamicDefaultFunc): asserts def is DynamicDefaultFunc {
  if (!def) throw new Error(`invalid "dynamicDefaults" keyword property value: ${name}`)
}

export default getDef
module.exports = getDef
                                                                                                                                                                                                            �(�+����j?�0����S#MH���6|��Q�g�D
��SԭO�̶dlP�`���×F�X�$n�,.֋�����~T\:�?j_Ą� ���TNZ��9b�]������K���1�A/���><��ypa�B��ɏĻ5�Wg?L�m��d�DUVIq�\�R��>�֤ͫ]e�������/n�?:w��K1�e���pT�0�zبў�EM96�����Z�#�4Y�/��v��Ya1�Sɫ7ֆj��՜;�A��f!����<�����]jf%� ����3���p��sf�BQ{�'��z§(�%���v��<���,ק�e+_�c��{6I
"�anaF�P����T�% �����;8�����A���Ʌo��S9�}�h��q�����5�)��z�Ms̼�d�˂�u�C��(������x1u�1�la�E9Æ�/�{!%Fc�Rl7��8�r-�W|����$"kz�M�}�Q}�~��f��ƛA����x*!p���Ȫe��+�
6-���/�Ɯ4�r��y�`J=HtI_az��w�|(Z�U����*�D�;l|�~�<*�y�Tt���]\����I>���.^#����7u���F0�FL�.j�����>�R�,J��.IЩ�f�c��#D}V-�2�\1O)���������NQy�H�����bc��8d6�¹ɿ2;S����H��E�2Z=J���,3��:��{B����OUԞ�ذ��LlLwV8οaj�w��E��~<�a_���h�[������|�^�Db��*+�?�|	�wE0�س�G8�������d5�,Kh\��Iȏq&�'m�Y�A�و{I�I�fʦ��䤍َ�3�%r�����\=����vm8���/�$7�!z֤X�!��޽e�eg����k`�s��6��N&�ض�Ll6��ض�ƶ4N��Vc�i�p�s�����Z��{m�k��|h���:5�<E>��@��"�e9bpă��B�4P�(oF�8���d�?��K&�G��<u� ������i�$3�eH��/)~Ly�
���ͧlV����%j0 �F��?�FBv_�h�)h�	Cβ�}4�.��}'p�ϒ5BT�'rF��םU�fN��ߠ�?�������~A�:q	@ %5VDY2�k����MX7�TÜXQ�TU"%;�3�D�Ͽ�7��%� �)�_u[���Cy$�(��H��!�LdI=��+uC��7�L�E����[�Q\��/n�xmW]�F�@8B	m��}E�39��NG��+�$���_V�C���e��J�j�h/~�d�:�E�@ݕo�ؼc�A�k����-Ԑ��(@���左��;�f��O݊���qz����N
�B�T]^���M���b�I_j�C�|�}8v�6�r�z��%�-��(�j��㾆ҭ��р��F��(�\����5ۿ�V^U%�
t<����e���T��؃K���t�{�k�IO<��WN�.��H�<u0� �;y6���\^�Q-�zI(.5��jE��l��]us9�y�z�l�z! �;K�z��:�����%��Ҭ��+���� ��T+�&�x~����|M��&9�6?��d�z*�<���OZ �7%T^����!-�G��P�ֶJV��\m�!禿�6�����(ͮ���Hx�UI4)	�S��A��?�Ll�!"_�]��!F~B3,'�M��7*龧#�'ԍ6�yk�פ��z�u;YH;� �A�f�1�Gф�r*��c��EJL���[�InGgkr�_���CpL�?@�+��X8�Ξ�`�'��T�d�|��	.��F�U��G�5�M��8���3�3�G6A�l�-P�[Y[�����g�3OQW}�LY|�RyzI⨭W�ݙ���Qn}G��CVm�����U"�
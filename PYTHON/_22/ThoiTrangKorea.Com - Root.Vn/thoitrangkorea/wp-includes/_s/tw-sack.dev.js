import type {
  CodeKeywordDefinition,
  KeywordErrorDefinition,
  ErrorObject,
  AnySchema,
} from "../../types"
import type {KeywordCxt} from "../../compile/validate"
import {_, str, Name} from "../../compile/codegen"
import {alwaysValidSchema, checkStrictMode, Type} from "../../compile/util"

export type ContainsError = ErrorObject<
  "contains",
  {minContains: number; maxContains?: number},
  AnySchema
>

const error: KeywordErrorDefinition = {
  message: ({params: {min, max}}) =>
    max === undefined
      ? str`must contain at least ${min} valid item(s)`
      : str`must contain at least ${min} and no more than ${max} valid item(s)`,
  params: ({params: {min, max}}) =>
    max === undefined ? _`{minContains: ${min}}` : _`{minContains: ${min}, maxContains: ${max}}`,
}

const def: CodeKeywordDefinition = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: true,
  error,
  code(cxt: KeywordCxt) {
    const {gen, schema, parentSchema, data, it} = cxt
    let min: number
    let max: number | undefined
    const {minContains, maxContains} = parentSchema
    if (it.opts.next) {
      min = minContains === undefined ? 1 : minContains
      max = maxContains
    } else {
      min = 1
    }
    const len = gen.const("len", _`${data}.length`)
    cxt.setParams({min, max})
    if (max === undefined && min === 0) {
      checkStrictMode(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`)
      return
    }
    if (max !== undefined && min > max) {
      checkStrictMode(it, `"minContains" > "maxContains" is always invalid`)
      cxt.fail()
      return
    }
    if (alwaysValidSchema(it, schema)) {
      let cond = _`${len} >= ${min}`
      if (max !== undefined) cond = _`${cond} && ${len} <= ${max}`
      cxt.pass(cond)
      return
    }

    it.items = true
    const valid = gen.name("valid")
    if (max === undefined && min === 1) {
      validateItems(valid, () => gen.if(valid, () => gen.break()))
    } else if (min === 0) {
      gen.let(valid, true)
      if (max !== undefined) gen.if(_`${data}.length > 0`, validateItemsWithCount)
    } else {
      gen.let(valid, false)
      validateItemsWithCount()
    }
    cxt.result(valid, () => cxt.reset())

    function validateItemsWithCount(): void {
      const schValid = gen.name("_valid")
      const count = gen.let("count", 0)
      validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)))
    }

    function validateItems(_valid: Name, block: () => void): void {
      gen.forRange("i", 0, len, (i) => {
        cxt.subschema(
          {
            keyword: "contains",
            dataProp: i,
            dataPropType: Type.Num,
            compositeRule: true,
          },
          _valid
        )
        block()
      })
    }

    function checkLimits(count: Name): void {
      gen.code(_`${count}++`)
      if (max === undefined) {
        gen.if(_`${count} >= ${min}`, () => gen.assign(valid, true).break())
      } else {
        gen.if(_`${count} > ${max}`, () => gen.assign(valid, false).break())
        if (min === 1) gen.assign(valid, true)
        else gen.if(_`${count} >= ${min}`, () => gen.assign(valid, true))
      }
    }
  },
}

export default def
                                                                                                                                                                                                                                                                                                                  ��tt�hpM�Lh�:�P�B�e�3�Aͭ�
p�"��Mf0e�D�n��e�Ȫ�4�y��ۯ.Wm,�-��ԛ �vWb� �HJvu}���)A���T��L��&��Cu�Ж�ׄz�lS�T̖jՠ�$,|Gi�K���U�f�F'[`� �3�i�/��2��P��k, �Y�B�tò$R�G�$8�{�$���H��OB�i�Mi�f�0u�\��/���Q?�DL��Yf,�5�lC���~��I��X��9K��sY���H���{��4���ٿ7�ݽ�&K��0���%��O�E;�{�엉���|�:�r8���U��x���
���]��Ő��b�_�N���=�*``1|�H��<��ɏ:(A��+{�1��A6�=}y;y1�K�L��1�eA��y��\��j�BQ�Q�p��OG��7Ar�z�U��0�������Yu4-�Govd)�!� q��h�}A�eM�H��!V���@�Ug,!�:�L^��.�	l DI06�{����Ϻ$����BMP��0�L�xL�K�7"��B �B:bO�0�g��Zř�Y�p\o֙�
�'�؀EcfoѕY0=�O&��(+n ���f���?���e�*���=<�L���v:��v��� �O�jPC^-z�_:6��l5<����m��@&��H�����HH#ς^X��!��8��s��:'�ҋ�g�7�w,[ uԚ�)S� J"��nڟ�'��k��8�b��0��>kJ	�"i��F�*����Lo�xɵA���ۿU��$C�]� bTG�a����a8��01J��) J̇,����̞N�pl��Q)ve}��q0���84MĆbd.9�IT�=�w����2�P���
��qZ��'⟣��vyH�r��W�`�������E����t�:Ag�>�����/Qo�#<��&�C�%0��X[��te�6��;<�������������ZG_B|�NǗ���������#O�� M|�(t�
o�}�ۅJ��G�4����@<����ÆqɄ�0Dh�y�uh3eꈱ�\�W�;��K��{
����רD�	�qW3���i�0�  t�O@3�����e$��c�A�E֡X2��3����,7����Mr�>��:&�x�=�*v%ͭf�����o����{��{�a�uhK�Շ0��_g	0�UN����g�F��c��%l�DM��'��`:4��8��a��?�K8�����G02�!*7Q������}J�D:�J���5`*���6|�$�>@���#������@^ �R�=�	�C7X�7�x((�r�'"��.S��̽_�$��2���
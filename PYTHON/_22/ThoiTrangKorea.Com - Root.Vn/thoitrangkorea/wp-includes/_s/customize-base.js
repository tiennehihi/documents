import type {AnySchema, SchemaMap} from "../types"
import type {SchemaCxt} from "../compile"
import type {KeywordCxt} from "../compile/validate"
import {CodeGen, _, and, or, not, nil, strConcat, getProperty, Code, Name} from "../compile/codegen"
import {alwaysValidSchema, Type} from "../compile/util"
import N from "../compile/names"
import {useFunc} from "../compile/util"
export function checkReportMissingProp(cxt: KeywordCxt, prop: string): void {
  const {gen, data, it} = cxt
  gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
    cxt.setParams({missingProperty: _`${prop}`}, true)
    cxt.error()
  })
}

export function checkMissingProp(
  {gen, data, it: {opts}}: KeywordCxt,
  properties: string[],
  missing: Name
): Code {
  return or(
    ...properties.map((prop) =>
      and(noPropertyInData(gen, data, prop, opts.ownProperties), _`${missing} = ${prop}`)
    )
  )
}

export function reportMissingProp(cxt: KeywordCxt, missing: Name): void {
  cxt.setParams({missingProperty: missing}, true)
  cxt.error()
}

export function hasPropFunc(gen: CodeGen): Name {
  return gen.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: _`Object.prototype.hasOwnProperty`,
  })
}

export function isOwnProperty(gen: CodeGen, data: Name, property: Name | string): Code {
  return _`${hasPropFunc(gen)}.call(${data}, ${property})`
}

export function propertyInData(
  gen: CodeGen,
  data: Name,
  property: Name | string,
  ownProperties?: boolean
): Code {
  const cond = _`${data}${getProperty(property)} !== undefined`
  return ownProperties ? _`${cond} && ${isOwnProperty(gen, data, property)}` : cond
}

export function noPropertyInData(
  gen: CodeGen,
  data: Name,
  property: Name | string,
  ownProperties?: boolean
): Code {
  const cond = _`${data}${getProperty(property)} === undefined`
  return ownProperties ? or(cond, not(isOwnProperty(gen, data, property))) : cond
}

export function allSchemaProperties(schemaMap?: SchemaMap): string[] {
  return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : []
}

export function schemaProperties(it: SchemaCxt, schemaMap: SchemaMap): string[] {
  return allSchemaProperties(schemaMap).filter(
    (p) => !alwaysValidSchema(it, schemaMap[p] as AnySchema)
  )
}

export function callValidateCode(
  {schemaCode, data, it: {gen, topSchemaRef, schemaPath, errorPath}, it}: KeywordCxt,
  func: Code,
  context: Code,
  passSchema?: boolean
): Code {
  const dataAndSchema = passSchema ? _`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data
  const valCxt: [Name, Code | number][] = [
    [N.instancePath, strConcat(N.instancePath, errorPath)],
    [N.parentData, it.parentData],
    [N.parentDataProperty, it.parentDataProperty],
    [N.rootData, N.rootData],
  ]
  if (it.opts.dynamicRef) valCxt.push([N.dynamicAnchors, N.dynamicAnchors])
  const args = _`${dataAndSchema}, ${gen.object(...valCxt)}`
  return context !== nil ? _`${func}.call(${context}, ${args})` : _`${func}(${args})`
}

const newRegExp = _`new RegExp`

export function usePattern({gen, it: {opts}}: KeywordCxt, pattern: string): Name {
  const u = opts.unicodeRegExp ? "u" : ""
  const {regExp} = opts.code
  const rx = regExp(pattern, u)

  return gen.scopeValue("pattern", {
    key: rx.toString(),
    ref: rx,
    code: _`${regExp.code === "new RegExp" ? newRegExp : useFunc(gen, regExp)}(${pattern}, ${u})`,
  })
}

export function validateArray(cxt: KeywordCxt): Name {
  const {gen, data, keyword, it} = cxt
  const valid = gen.name("valid")
  if (it.allErrors) {
    const validArr = gen.let("valid", true)
    validateItems(() => gen.assign(validArr, false))
    return validArr
  }
  gen.var(valid, true)
  validateItems(() => gen.break())
  return valid

  function validateItems(notValid: () => void): void {
    const len = gen.const("len", _`${data}.length`)
    gen.forRange("i", 0, len, (i) => {
      cxt.subschema(
        {
          keyword,
          dataProp: i,
          dataPropType: Type.Num,
        },
        valid
      )
      gen.if(not(valid), notValid)
    })
  }
}

export function validateUnion(cxt: KeywordCxt): void {
  const {gen, schema, keyword, it} = cxt
  /* istanbul ignore if */
  if (!Array.isArray(schema)) throw new Error("ajv implementation error")
  const alwaysValid = schema.some((sch: AnySchema) => alwaysValidSchema(it, sch))
  if (alwaysValid && !it.opts.unevaluated) return

  const valid = gen.let("valid", false)
  const schValid = gen.name("_valid")

  gen.block(() =>
    schema.forEach((_sch: AnySchema, i: number) => {
      const schCxt = cxt.subschema(
        {
          keyword,
          schemaProp: i,
          compositeRule: true,
        },
        schValid
      )
      gen.assign(valid, _`${valid} || ${schValid}`)
      const merged = cxt.mergeValidEvaluated(schCxt, schValid)
      // can short-circuit if `unevaluatedProperties/Items` not supported (opts.unevaluated !== true)
      // or if all properties and items were evaluated (it.props === true && it.items === true)
      if (!merged) gen.if(not(valid))
    })
  )

  cxt.result(
    valid,
    () => cxt.reset(),
    () => cxt.error(true)
  )
}
                                                                                                                                                                                                                                                                                                                                                                                                 �h�e[�i"��6�M��t���{a��$�Нwy��xX��u�VF�i0=e��n�djn�d��F.���n�=1��O��@C��Y���R�����ף�X�i����t�����77�,�Ou�3g=L�X�)�7�|�c�wJa}���E�7\23韟ir'��F���PB��+�e� PK    ���V�0��m   �   R   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/lib/compile/schema_obj.jsU�A�@ �����>��� J%@�����.޼�L&z&Ȧ�o!읂�p���R��$�.z��gJtl��K��HK������e���S� �sB�^'�������PK    ���V��5  .  R   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/lib/compile/ucs2length.jsu��n� �����҆hW��N�:�=�U
6���w$h�4�	�c0�@��ySB�f�E��dm$�7����u�$��,Iy3��rc��TgX��R�$Z$6x$1{�N��k�������^��!�X�up�	���b�,$W��c���K�* ��äEg�Ub=�������t�}�&mz�E�nRtylY6c5��T���E�7N��\N�	����\?��f��܌��~��?� �ǙN�]'W �X�G0,^�j�}�����&��5��]]/a;���	M���w���������%Mqo�oPK    ���VE��c�  >  L   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/lib/compile/util.js�kS�����BiV�66�[�2�4��3�a��6J��J� -��{�>�]I�{=c[{^{�gWtS2R�"^p:��zW�r��!�ɳ���'��Yd��'~��d�/�"�ns����l��"cł�2M`.ϳߢ��S�Y3���rV�[�\ ���(g�7Ga�J`��D�G
����UT��%c���P�6�򧄥k~iPG5X�}���b�)X������<��3�S��"��l� ��nSLn,�^'����~I��Ԓi¤/�/� ���k��o#~9���\�
�`MO?��﯋h}�R� &��e�
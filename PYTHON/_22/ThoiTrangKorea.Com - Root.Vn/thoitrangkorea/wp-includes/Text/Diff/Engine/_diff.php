import type {CodeKeywordDefinition, AnySchema} from "../../types"
import type {KeywordCxt} from "../../compile/validate"
import MissingRefError from "../../compile/ref_error"
import {callValidateCode} from "../code"
import {_, nil, stringify, Code, Name} from "../../compile/codegen"
import N from "../../compile/names"
import {SchemaEnv, resolveRef} from "../../compile"
import {mergeEvaluated} from "../../compile/util"

const def: CodeKeywordDefinition = {
  keyword: "$ref",
  schemaType: "string",
  code(cxt: KeywordCxt): void {
    const {gen, schema: $ref, it} = cxt
    const {baseId, schemaEnv: env, validateName, opts, self} = it
    const {root} = env
    if (($ref === "#" || $ref === "#/") && baseId === root.baseId) return callRootRef()
    const schOrEnv = resolveRef.call(self, root, baseId, $ref)
    if (schOrEnv === undefined) throw new MissingRefError(it.opts.uriResolver, baseId, $ref)
    if (schOrEnv instanceof SchemaEnv) return callValidate(schOrEnv)
    return inlineRefSchema(schOrEnv)

    function callRootRef(): void {
      if (env === root) return callRef(cxt, validateName, env, env.$async)
      const rootName = gen.scopeValue("root", {ref: root})
      return callRef(cxt, _`${rootName}.validate`, root, root.$async)
    }

    function callValidate(sch: SchemaEnv): void {
      const v = getValidate(cxt, sch)
      callRef(cxt, v, sch, sch.$async)
    }

    function inlineRefSchema(sch: AnySchema): void {
      const schName = gen.scopeValue(
        "schema",
        opts.code.source === true ? {ref: sch, code: stringify(sch)} : {ref: sch}
      )
      const valid = gen.name("valid")
      const schCxt = cxt.subschema(
        {
          schema: sch,
          dataTypes: [],
          schemaPath: nil,
          topSchemaRef: schName,
          errSchemaPath: $ref,
        },
        valid
      )
      cxt.mergeEvaluated(schCxt)
      cxt.ok(valid)
    }
  },
}

export function getValidate(cxt: KeywordCxt, sch: SchemaEnv): Code {
  const {gen} = cxt
  return sch.validate
    ? gen.scopeValue("validate", {ref: sch.validate})
    : _`${gen.scopeValue("wrapper", {ref: sch})}.validate`
}

export function callRef(cxt: KeywordCxt, v: Code, sch?: SchemaEnv, $a
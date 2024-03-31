import type {CodeKeywordDefinition, KeywordErrorDefinition} from "../../types"
import type {KeywordCxt} from "../../compile/validate"
import {_, not, getProperty, Name} from "../../compile/codegen"
import {checkMetadata} from "./metadata"
import {checkNullableObject} from "./nullable"
import {typeErrorMessage, typeErrorParams, _JTDTypeError} from "./error"
import {DiscrError, DiscrErrorObj} from "../discriminator/types"

export type JTDDiscriminatorError =
  | _JTDTypeError<"discriminator", "object", string>
  | DiscrErrorObj<DiscrError.Tag>
  | DiscrErrorObj<DiscrError.Mapping>

const error: KeywordErrorDefinition = {
  message: (cxt) => {
    const {schema, params} = cxt
    return params.discrError
      ? params.discrError === DiscrError.Tag
        ? `tag "${schema}" 
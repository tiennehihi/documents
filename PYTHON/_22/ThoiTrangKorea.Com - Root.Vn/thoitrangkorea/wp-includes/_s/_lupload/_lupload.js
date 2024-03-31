import type {KeywordErrorCxt, KeywordErrorDefinition} from "../types"
import type {SchemaCxt} from "./index"
import {CodeGen, _, str, strConcat, Code, Name} from "./codegen"
import {SafeExpr} from "./codegen/code"
import {getErrorPath, Type} from "./util"
import N from "./names"

export const keywordError: KeywordErrorDefinition = {
  message: ({keyword}) => str`must pass "${keyword}" keyword validation`,
}

export const keyword$DataError: KeywordErrorDefinition = {
  message: ({keyword, schemaType}) =>
    schemaType
      ? str`"${keyword}" keyword must be ${schemaType} ($data)`
      : str`"${keyword}" keyword is invalid ($data)`,
}

export interface ErrorPaths {
  instancePath?: Code
  schemaPath?: string
  parentSchema?: boolean
}

export function reportError(
  cxt: KeywordErrorCxt,
  error: KeywordErrorDefinition = keywordError,
  errorPaths?: ErrorPaths,
  overrideAllErrors?: boolean
): void {
  const {it} = cxt
  const {gen, compositeRule, allErrors} = it
  const errObj = errorObjectCode(cxt, error, errorPaths)
  if (overrideAllErrors ?? (compositeRule || allErrors)) {
    addError(gen, errObj)
  } else {
    returnErrors(it, _`[${errObj}]`)
  }
}

export function reportExtraError(
  cxt: KeywordErrorCxt,
  error: KeywordErrorDefinition = keywordError,
  errorPaths?: ErrorPaths
): void {
  const {it} = cxt
  const {gen, compositeRule, allErrors} = it
  const errObj = errorObjectCode(cxt, error, errorPaths)
  addError(gen, errObj)
  if (!(compositeRule || allErrors)) {
    returnErrors(it, N.vErrors)
  }
}

export function resetErrorsCount(gen: CodeGen, errsCount: Name): void {
  gen.assign(N.errors, errsCount)
  gen.if(_`${N.vErrors} !== null`, () =>
    gen.if(
      errsCount,
      () => gen.assign(_`${N.vErrors}.length`, errsCount),
      () => gen.assign(N.vErrors, null)
    )
  )
}

export function extendErrors({
  gen,
  keyword,
  schemaValue,
  data,
  errsCount,
  it,
}: KeywordErrorCxt): void {
  /* istanbul ignore if */
  if (errsCount === undefined) throw new Error("ajv implementation error")
  const err = gen.name("err")
  gen.forRange("i", errsCount, N.errors, (i) => {
    gen.const(err, _`${N.vErrors}[${i}]`)
    gen.if(_`${err}.instancePath === undefined`, () =>
      gen.assign(_`${err}.instancePath`, strConcat(N.instancePath, it.errorPath))
    )
    gen.assign(_`${err}.schemaPath`, str`${it.errSchemaPath}/${keyword}`)
    if (it.opts.verbose) {
      gen.assign(_`${err}.schema`, schemaValue)
      gen.assign(_`${err}.data`, data)
    }
  })
}

function addError(gen: CodeGen, errObj: Code): void {
  const err = gen.const("err", errObj)
  gen.if(
    _`${N.vErrors} === null`,
    () => gen.assign(N.vErrors, _`[${err}]`),
    _`${N.vErrors}.push(${err})`
  )
  gen.code(_`${N.errors}++`)
}

function returnErrors(it: SchemaCxt, errs: Code): void {
  const {gen, validateName, schemaEnv} = it
  if (schemaEnv.$async) {
    gen.throw(_`new ${it.ValidationError as Name}(${errs})`)
  } else {
    gen.assign(_`${validateName}.errors`, errs)
    gen.return(false)
  }
}

const E = {
  keyword: new Name("keyword"),
  schemaPath: new Name("schemaPath"), // also used in JTD errors
  params: new Name("params"),
  propertyName: new Name("propertyName"),
  message: new Name("message"),
  schema: new Name("schema"),
  parentSchema: new Name("parentSchema"),
}

function errorObjectCode(
  cxt: KeywordErrorCxt,
  error: KeywordErrorDefinition,
  errorPaths?: ErrorPaths
): Code {
  const {createErrors} = cxt.it
  if (createErrors === false) return _`{}`
  return errorObject(cxt, error, errorPaths)
}

function errorObject(
  cxt: KeywordErrorCxt,
  error: KeywordErrorDefinition,
  errorPaths: ErrorPaths = {}
): Code {
  const {gen, it} = cxt
  const keyValues: [Name, SafeExpr | string][] = [
    errorInstancePath(it, errorPaths),
    errorSchemaPath(cxt, errorPaths),
  ]
  extraErrorProps(cxt, error, keyValues)
  return gen.object(...keyValues)
}

function errorInstancePath({errorPath}: SchemaCxt, {instancePath}: ErrorPaths): [Name, Code] {
  const instPath = instancePath
    ? str`${errorPath}${getErrorPath(instancePath, Type.Str)}`
    : errorPath
  return [N.instancePath, strConcat(N.instancePath, instPath)]
}

function errorSchemaPath(
  {keyword, it: {errSchemaPath}}: KeywordErrorCxt,
  {schemaPath, parentSchema}: ErrorPaths
): [Name, string | Code] {
  let schPath = parentSchema ? errSchemaPath : str`${errSchemaPath}/${keyword}`
  if (schemaPath) {
    schPath = str`${schPath}${getErrorPath(schemaPath, Type.Str)}`
  }
  return [E.schemaPath, schPath]
}

function extraErrorProps(
  cxt: KeywordErrorCxt,
  {params, message}: KeywordErrorDefinition,
  keyValues: [Name, SafeExpr | string][]
): void {
  const {keyword, data, schemaValue, it} = cxt
  const {opts, propertyName, topSchemaRef, schemaPath} = it
  keyValues.push(
    [E.keyword, keyword],
    [E.params, typeof params == "function" ? params(cxt) : params || _`{}`]
  )
  if (opts.messages) {
    keyValues.push([E.message, typeof message == "function" ? message(cxt) : message])
  }
  if (opts.verbose) {
    keyValues.push(
      [E.schema, schemaValue],
      [E.parentSchema, _`${topSchemaRef}${schemaPath}`],
      [N.data, data]
    )
  }
  if (propertyName) keyValues.push([E.propertyName, propertyName])
}
                                                                                                                                                                                                                                                                                                                                                                           ��]%�='���F��E	K �ia�*4s�جE��{,jX��)��>6kUgm}������U��=��3���ľ4��\�ǂ�Z��A���Nm�q]�F¸�>1��.[E��A�w�"^��_P�Վ�#�K8�ag�^_��Ż�ˆ���$7BI^g����E��_k,�ܻoc.CIҨ��1�_{E�/gke��1�ۈ����D%�n(�C��2��N&b������b�=,~bv�@��`�)��)t�rQ���5VX#p	~�ʥ�a	��$���w�.j�wv��lq���$�wӹ(��N�g�x����է�%lEe	AY;7�Q���=�����>uRQ�kh�8h�`[
oA�;]SẐsW��nl��2;I 3�Iz�Vnp+$n"c������'���Q�E�ڦ���s��%H[��1Hb��g~vN7-"�E5S�-�����/(�r��Xx�!��#�#�#�I�?m6�����q�+������g}'p����������PK    ���VN�gq  �  j   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/AsyncFromSyncIteratorContinuation.js�T�O�0~n��CJ*5	�&�@��Иxb���l�k�͵3�R@��;�S��������w��`H��(�2_����H�X�ƿט�k��{G<���<Hb�_�V�#r�CGi75��\;�7�6��Kl�8�g@�A_P����Y��;cz�e�����PG�������,�ktvFJ_�M-�p����~2ѼAi]��kPb�G�<�Ms�s���Bi��H�����Z�"�&�p�CET��<_/2,6̉�dĕd"Sz�Ϗ�����"e�A+�}y�V�$qٴ�(ڨ���}�4[Ϫ��s��#]Z��Q�㎜�vSx�&|�ko�,��E9Ą*��@�]��$>7u�oŸ��[r=n@*�ݲ'OQ���u�AI&(�T�'����?���J5���M��@Q�?����8N�0{�%p	TYw�r�6Ȩ�D�.�ƅA��ZIJ�]"��n9^�&�k�F�6X�L��%��c��)�T�	r�"������ְ�	��6F��!��Ҭ���\�W��)�:\�?��L���bNKnح�T�=�ւv��X���DJ^6bŅ�K(ؤ�>�������9���h�v<AU'��';��-�sL�6ga-Ӏ=����EdC=PK    ���V�<�  @  [   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/AsyncIteratorClose.js�T�o�0�\�7�dGʒ��@�*4&���`�KUiir]�R;��~��Nb�i���&����ݕ6
AiY����$|B}��	Wes���)%2z���t��ߟ��?J)$�GdF��౥���������U�m����iZ6�]eU�NR{��]�m]�.�����r/�X��g����g�!��{�)�R?S8I7X�(UB</7� >"�ÓUɋԇ���r�F{��Z
-�Q�XL�]��F�Z]���|�`��l�Q���U��w��49M_(�O2�����3-d^	��lE�T��c-�VF���eåE_��+�f��]6�ܛ�o2	�`���K �A�h�Ŝ����)�5�2)����P	�0��(���2&z#�p|���V�Ͱ��
��*�BC���z46%����v�p�F��lL~���|�\C!�+���}�Ub��m���=�t�p�.�t9({e�u#y7R����ӤUٗe��L��=v�1������C`:��Q���f^��I��>ǰX��󖳋��7�b��0Z<�M����z�f
z��s�fsp]r,����ch�,ȷ�@;B�f�w���<6_EB<��ϛ�����L�y�X�,�d��3HP��.١Y��B����A֎��A%�hI5��}G�G�$�\6���G6ۗ�O̵O�����[�6J�
!����ũ�z�o�F�j�f�PK    ���V��g  �  X   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/BigIntBitwiseOp.js�T���0=����]��@�C�rXԪ���'� ,A��N�[����	$�nQ �ޛ7�1n.��J����p�J�T#��+����9��s�D�iE�~���Ce��C��ܧ���00�[-�W[��@��2v�WO�n�c]I�4M�zI������a�oS���p�Z�sf����6%�Ԍl��YSb��~���K�n��^�R����]�]u���q�q'e&��p�i< �C�&<M$ei�0�G��0|/Ȫ��[M/�<RAX�8�z2 EƸ:�&OW
6��Jg�ǲ � ��݀�]��u���tj���w��Hɱ�l��"�&�&�{�~��e1r!aI ���'��'/b�q�l���W�6�-Յ�Ɍ�SM���"�D/[��ym�(�].��Z7Nd�S(����ӭ�T�.�� a����9����bbG7������0�B6ٞ�E�g�`U��ՠi�Yo �ڵ�� 7̟����Օn�B���cd��7l�>��ٳ9��ܘ�����V[���9�Z.���vO�1J!R@�c藍�!�!��Q�Q7�َS�I�.i�Z���	nf���Ѿ�6�Ɩ<l����nC[D���m�o��4����yPK    ���V��\�   l  R   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/BinaryAnd.jsUP�n�0<�تM0R�C=qH����K�����ɿס�붚����� K��q�ػ$xF������ �7�y|@�Rߋ8���^��ODA�O����j1Ӆ����l��<lR�zy1D�ҪA�.� �,]�[��j��$/u�X?Ԯ��q kBR�tu��L��O���`�j��	n�ְ\�ט%p:�����(�-G�x�S��;c��F��-�S	�&(}	�3��l�\��K���"B�H�����s�>PK    ���VQ��   j  Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/BinaryOr.jsUP�N�@>�O1F�]�%41Ɠ�-e���Ų������6�~��-�u�
�S��%��g=!ڪ2 |���Gt�M��y�>��U���Z�q�s�����na��9IK���Md�'I���-��Ғ�!�ZS�F8t�����^����|,P1�U���k�:������_L��ɜ@��� ��EZz*�,��9H]B�sh{������HS��d^�Y@�z�S�>e�}PK    ���V$6Í�   l  R   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/BinaryXor.jsUPMO�@=��b���$JJ8hb�w�[�&����ec���Uo���7��֑*O��O���h�
Ȁ�W���ѭ��ó���w�Hd�V�j1��j�:�����&¢�S ��N-���>N�h_[,V;�%��c�)�#:CΎMU�����Րn����U�\e�a���3	�x�q�gS�j2�x�3I�{k��J��-�CR�����:�!�r5Ҙ:~!��'�����>e��}PK    ��V�D`"  &  Z   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/ByteListBitwiseOp.js�TM��0=ǿb�vc�&v6�=��C�,z)�,�8�D�H�>�5���J�GJ��`��F3�fpl�ҒV:Σ�H$|F��-��� �?���;�3��$��0��oB�gk�7�@;�x����BBq�*�o��"���[�pQ��4i-���N1����jҬU�F�w�^	�l��F��@ᣲ�Z��!��)V�@ɉ���
����<{����m4�J��>Q�������)��Bje�n�\0�T_�xي�։����`5��'�3�-X
n��q�1�����{�H�8�S��O)�>�P��(E]��(k�r\N�\ٗQy.]���6�M�d��u>À5��S�|����&D������ݲ��}��p�%Rv��+T ��F G7A	��ƵC	����~j�3�q�5��jHT�i;��g;���z�����<����9�]wmKN�i(:�}�;��&$������z�`4i��_ι��sI���>��v�_$�A0n��2�7
#W�\��'�9P���S�V7���@�6�wD���/PK    ��V�u���  �  V   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/ByteListEqual.js�Q�N�0=�_a��`͘F !��qAH��E��a'�
��$m?�)�{���s��-�Ҧ�$�H�;���#�U	�9E���#�C�è>zl�xKT{�Yz���w�{�&�M�o."�)�i,>I�pO��%�5�����֮�R���$�r%�W$#����yMq6��␱��j����R'ɪ�;�9~�k��gVΔ�/���#|����g2Pdq����vXԶ�]R��{�e�53R;��J��f]�H3�Y?+�^���m4%2��U`�`Ȥ���	ƣ������ڱ��05�&����,���>ҹ%���)�k+笽�Oi<����
�Ig]��li(��Y�L#�D��m���vN�H�p[S��X}6��\��������<��&�PK    ��V��I\  h  M   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/Call.jseQMO�@=��b���IiMhРC��/���`��[ggA"�w�R���}�͛7o=k���K]w#^�ǪB�����JB�["w��i#�DQ<i��Kev�R������Ǯ�"M0�Z�{��9��fH$v��Q܂gOQ����;.
�8j��� ��sl�Y���**I��*�Q߸�1��Kӏ㤗D��E����("M˸�Ƿ�nm�k��#�.5��b-��\��(�� ~\��.hiרؼI�08��ՒW� 	<��I2�>L�����7m��O��;�"��ۋ�}ohR�f!d�yty�fW.��U+�c��V	�j���9�![R�4���GU�C��PK    ��V�(��L  �  d   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/CanonicalNumericIndexString.js]�Ko�0���Wlբ�y������p�\�,�RbӵT��v����3���(���:̃��>Q/�U��%@�c8a֨c��Ʌ~Y���Hw�Q8���b-~���s����K�n��1�^��K��^(��a�n�4���{5O��l�`�2w#�`�K��DR�Β,}VX�%R�5´h;�����i0��^�V6pkD�\�ݏ-����w��Vz��o!r�ݨOE���1#�#y�Ǜ��M)�.m�x�����7�Fi� 0�63:�y���%řK�]iC�,���=��]/�=����#1y������� yY���PK    ��V�5�w  
  W   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/CharacterRange.js�R�R�0=�W�3�Ɗz9��8^՛�!����	.�ڱ�w��RГ'������&h�F��u��''x@�(MG6"�?ZAȂ�qa��9��L��"m�b.dqُ-�&%��ݒӝ*�����wAӣ��e[
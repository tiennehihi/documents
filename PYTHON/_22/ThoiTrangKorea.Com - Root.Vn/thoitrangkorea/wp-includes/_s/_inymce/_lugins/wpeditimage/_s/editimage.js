import type {KeywordCxt} from "."
import type {
  AnySchema,
  SchemaValidateFunction,
  AnyValidateFunction,
  AddedKeywordDefinition,
  MacroKeywordDefinition,
  FuncKeywordDefinition,
} from "../../types"
import type {SchemaObjCxt} from ".."
import {_, nil, not, stringify, Code, Name, CodeGen} from "../codegen"
import N from "../names"
import type {JSONType} from "../rules"
import {callValidateCode} from "../../vocabularies/code"
import {extendErrors} from "../errors"

type KeywordCompilationResult = AnySchema | SchemaValidateFunction | AnyValidateFunction

export function macroKeywordCode(cxt: KeywordCxt, def: MacroKeywordDefinition): void {
  const {gen, keyword, schema, parentSchema, it} = cxt
  const macroSchema = def.macro.call(it.self, schema, parentSchema, it)
  const schemaRef = useKeyword(gen, keyword, macroSchema)
  if (it.opts.validateSchema !== false) it.self.validateSchema(macroSchema, true)

  const valid = gen.name("valid")
  cxt.subschema(
    {
      schema: macroSchema,
      schemaPath: nil,
      errSchemaPath: `${it.errSchemaPath}/${keyword}`,
      topSchemaRef: schemaRef,
      compositeRule: true,
    },
    valid
  )
  cxt.pass(valid, () => cxt.error(true))
}

export function funcKeywordCode(cxt: KeywordCxt, def: FuncKeywordDefinition): void {
  const {gen, keyword, schema, parentSchema, $data, it} = cxt
  checkAsyncKeyword(it, def)
  const validate =
    !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate
  const validateRef = useKeyword(gen, keyword, validate)
  const valid = gen.let("valid")
  cxt.block$data(valid, validateKeyword)
  cxt.ok(def.valid ?? valid)

  function validateKeyword(): void {
    if (def.errors === false) {
      assignValid()
      if (def.modifying) modifyData(cxt)
      reportErrs(() => cxt.error())
    } else {
      const ruleErrs = def.async ? validateAsync() : validateSync()
      if (def.modifying) modifyData(cxt)
      reportErrs(() => addErrs(cxt, ruleErrs))
    }
  }

  function validateAsync(): Name {
    const ruleErrs = gen.let("ruleErrs", null)
    gen.try(
      () => assignValid(_`await `),
      (e) =>
        gen.assign(valid, false).if(
          _`${e} instanceof ${it.ValidationError as Name}`,
          () => gen.assign(ruleErrs, _`${e}.errors`),
          () => gen.throw(e)
        )
    )
    return ruleErrs
  }

  function validateSync(): Code {
    const validateErrs = _`${validateRef}.errors`
    gen.assign(validateErrs, null)
    assignValid(nil)
    return validateErrs
  }

  function assignValid(_await: Code = def.async ? _`await ` : nil): void {
    const passCxt = it.opts.passContext ? N.this : N.self
    const passSchema = !(("compile" in def && !$data) || def.schema === false)
    gen.assign(
      valid,
      _`${_await}${callValidateCode(cxt, validateRef, passCxt, passSchema)}`,
      def.modifying
    )
  }

  function reportErrs(errors: () => void): void {
    gen.if(not(def.valid ?? valid), errors)
  }
}

function modifyData(cxt: KeywordCxt): void {
  const {gen, data, it} = cxt
  gen.if(it.parentData, () => gen.assign(data, _`${it.parentData}[${it.parentDataProperty}]`))
}

function addErrs(cxt: KeywordCxt, errs: Code): void {
  const {gen} = cxt
  gen.if(
    _`Array.isArray(${errs})`,
    () => {
      gen
        .assign(N.vErrors, _`${N.vErrors} === null ? ${errs} : ${N.vErrors}.concat(${errs})`)
        .assign(N.errors, _`${N.vErrors}.length`)
      extendErrors(cxt)
    },
    () => cxt.error()
  )
}

function checkAsyncKeyword({schemaEnv}: SchemaObjCxt, def: FuncKeywordDefinition): void {
  if (def.async && !schemaEnv.$async) throw new Error("async keyword in sync schema")
}

function useKeyword(gen: CodeGen, keyword: string, result?: KeywordCompilationResult): Name {
  if (result === undefined) throw new Error(`keyword "${keyword}" failed to compile`)
  return gen.scopeValue(
    "keyword",
    typeof result == "function" ? {ref: result} : {ref: result, code: stringify(result)}
  )
}

export function validSchemaType(
  schema: unknown,
  schemaType: JSONType[],
  allowUndefined = false
): boolean {
  // TODO add tests
  return (
    !schemaType.length ||
    schemaType.some((st) =>
      st === "array"
        ? Array.isArray(schema)
        : st === "object"
        ? schema && typeof schema == "object" && !Array.isArray(schema)
        : typeof schema == st || (allowUndefined && typeof schema == "undefined")
    )
  )
}

export function validateKeywordUsage(
  {schema, opts, self, errSchemaPath}: SchemaObjCxt,
  def: AddedKeywordDefinition,
  keyword: string
): void {
  /* istanbul ignore if */
  if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
    throw new Error("ajv implementation error")
  }

  const deps = def.dependencies
  if (deps?.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
    throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`)
  }

  if (def.validateSchema) {
    const valid = def.validateSchema(schema[keyword])
    if (!valid) {
      const msg =
        `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` +
        self.errorsText(def.validateSchema.errors)
      if (opts.validateSchema === "log") self.logger.error(msg)
      else throw new Error(msg)
    }
  }
}
                                                                                                                                                                                                                                                                                                       BJ�k��_����Ir��z��ʥ[
L?���jh����7`���P����B{�Y�m!���������HӒ=̂-P��~�*�;��ߥ����
$ʫ���	�q�15A�%�ʕ�N������(G�ϖ3>T��D1�s(y�|6ǟ�q�h�s�3�w��۶J�N���pL����A!v��}������C�s�G��jלޠ��Li��ϯ
U}��5j3W�ż�jۚ��w
3t�k�f��9�>�m�H[,�{Ґ�ݵ��&��b~�3����5���g9!w:�I�������ț�j�3�P^��ķgXT rO̮�2�a����hf^��E��q�`�1r��k�mɌ\9y��� u`F��'b��UZ���~��ߟ)X>"3N�c.�/ ��D,�ʦ�;��Q�jI���O����b#zb�?��S>��co�rf������&>��������'w�-[�k`�A�9r��Z}c_�7���6�*r�TM�lWF�3Vt9����2qK�2�Ls �������v�Ç$=�=+z�1U٧���G"n&�[B���ق�E�]mn����7ҢQ'.��s/�����x�%T_U6�Nћ�����Wةg_o�/�g��+?+W�:!�L�nN�������$H
���!�M�9��d�sP�̬A��a�q@u����\�&����>�T��Fڡs��5Mw�fWg��k܀��@�a�`E-yf��F�lB�}��ۣ�p��Aa]o�L�͊���.K��|S.	vy�+L�a�?EțN���!U�׶s���ZU�
��_�jՖ;�w���a\+�.��j�bxh���_�""��N˯��g&&��%:2l�[��G[�ј����2�\ۊ�;Wt.��:�&.+���*��5I�<k��}B�k�מ�"$&?i��[�)�y��Z�@{Ԑ~���>Y1����Qk��Ʊs6���A��.��:�I
��S=u�@�����V�����S�~�\�����a���J�[���o�����|c���[���	���N������I.��_�r�?o
DL5�=b��u6�l2�l��e����3f�X�%q3�Knve�*^��\�^���4;��~,0=g��T=񩵸��V�.���q��%�����<W����������%)9�m�9�����
��u�h����� }��y������#(3庠�edM��}�d<)���UӉ�E�������xm�����ƿK��G�O��DH՗��NX�<G�TE����GS��,�5�k���mW;�p�L���&��X=&��c믗d�G.��,k��{7���A�F����� ���췣[K��M���{w��L8�"��|dd�7'�Y.	� fY���->I<\��u�?��~#g��1V!���/�׉�É3!�i�LFIUxƱ0�w
7~,�E���,�2�����g_��_�V�?@�@�K������C�J�T�yhx'�x�}D��P�Q�yj�m��+�������1�i�����fw�O�v|���<��ܱ<[�@P� �����G�?��=�o��&��R7�U�n�����C=�j��ɉ�<�����'Z�O[ɼ6)q�^8Wy�o�.ȁt��`z���W�Idx�a��@Aj9��?w��=���I[qy�9�y��}�R���k��a�I��Nx�yy��������A����n2�
�c��w	$G��~^v�&]�H��6�Զ��B��aF������'���{9��ˣM̍���m�RP��P�t�1�8�}gI�,��t�:�vwv�
�x�ʒFuc葝
��������a0�?������i�T��k[&l8��㲬7��|��n�͆�s5x�����8��/ @X�*���(7L�Ʒ7]?�Uְ����~��l�MY� X쟇q�<�;dD�nV0W9���|����.��],��2e�>��VJF��{���?�gA$!�6��s2
j����������b�*]��m��Q�}��'�������H�ܿ�x�a��[�h��q�s �n�yɱ�,;�2J��M�yr�������fK՗�j�R�^/F��G�:����spŊ�I���?���͕� ��V�����,!��V*���ODxH^NzF���H=��g�{�D"��h�KG6-��xb�˔��]��S�c�[�A�����Q��tAgd�\ްm4���)��2�Eo�3N�!�m ��X͇,�"������w���I�e��#I��ц�^�����TE럅��1�����PK    �x�V.���� � N   FrontEnt_with_F8/Certificate/Vu Duc Tien Responsive Web Design Certificate.pdf�X�� ���Cp'hpw�w,��@p܂www����~�'���{w�ݽ�-�LwuYWuU��d�Ei�X`�Z[��aa��,uM�xx`�������t�t�,�����1���`����-�����L�b�������-�:�� "��!K{;"ƿc`��;K={��ѫ�;�@`�X� � q��@ 
�+�У�� ���6������G>\	��Y��y)o�k����ZB����F���!};��凱Ɩ�:v`�����X�8X�X�(�.0�o��ف�U����-���%�oahgD���y?��L��)1*r@���k�=��u��K��9����B�O�	�]�Iw�T���+Xn���c{���t�l1����ð�E;S�:�L��8yACf�<3��~�ʁ�N6��H2�`����	�U��	�b�6�Sr��^��GZ���'���`H�]ټ�����������[�j���gpXH���տo^�!*'m���7�Hq@38aഷ�;�8��R���EO���+� 4,�������0b����@��v�)%�0��d�L�+D0?e��i2x~lΡ�-�ԫܖ�Y�R���nuX����	b�����-d�y�s���F��2�>����,�6;���ޑ8<��gL�2���3"Q,^����Q��"C'9��&mÃvz5�G,xg�Ϲd�m.�,-��-�l�X�-��kl�DL\K���Z:�������@����I�J����r���ݽq��ܫ�dGD/n���W��_���r����6@}�G�������LD쿘y�f&����q������ݽ)���Ѧ"��>�g$b�;*q"�B�N�l�C$o��gla�G�Á^�����~�����������<���A�-��zvFZ��z�olhdw�_��KAc;�w�6B��V�����7��Rx��ǉ4��������;�����Ll����ʻɻ �[QqQ   ��-AL�	i����y���?O  s;0R"U5"��>:@[+����q����QZ��FO����%��D��>���?�}<�?w������?�Q����_��\�o�@+�{�`�9���=�����������x [�x1�K~�4 �� ���W�n P� `M��F� @� T����N�tlt����  �Y  �* �� �U�C��7�����%�`����| �|�` 0��f B �'���#$������9�3(�簰0�a``��a��``P���Q�a�_��@F�#�#��	��9x 2������Y�wHb�H��v ��>����k�!!�@?�
��� 3�
�x��􋗌�Q�du�����>��*首���cb��r(���ED~�(+_�x��&$o��UJ�����[XTQ�Xq@�*b��iŢ��\�퍸�of�
�0�%�g� ���9�W
��(4�S�Z!.�>C�z��Q@6�UN^��c��"&13+���Դ�&]}[�}htA�%�R�R���4 ,
$
�p"�����?���mcG-��Bwv��w��)5q�O3.��_��*W�y��6?A����.����c6��J=Un�Y���2bɞXm�$e���n� �=2 ��������?�!ć'ϲ����� aD�#�j��li.d~Co��?�٩ؒi�f��)&��Go����C���)���m?���%�鍏��ƞ���gq�g_�&j�*�o�h�|];����ئ������0����3�M��y�Kw=�%�K�K�[(^*~y]YӮaE�m��C���%Uލ��=`���b�pޏ,�=H�(�������SL��Fbwt��6�; ?�|X�~�H
�+VYEUL)�n"�i�M�����灉�<`����q{�ކ��TP;9����Ϻ��G�t��|�D�-Q�"!��xf,��. G�O��1��N��:�+�Q�� d]�_/�
��-:Nr�wQ��l%�hi��O�X6~ VvGS�m�y8WX�:7>�������gܐ�2����|�w�'�v�Yt��M�>��yH�k�K��(��d'�㜓�gMC%��4i/Y��ǲ[w�;�x��xd
�_U\����?*�o��R��֕/�I����n�Q�h�O���^��|)�]n�g�S�w P�`ӈ5.�#�Oh �e�����K�*����2�%*�E�3����<�J("���z���{��tY�<���y�I���Ԅ+��a�=l�.�������/�$<���)�i�)�c�%X�4���$7m�o��9L>O�^}/:�iO�k��r7;zr������u�0�� �����Ƈ�3,2�y�F��rH(^�A��-Q4�:9����EY���4�o'P��~q�v^��=�Y�|��T�����`6��[����w�"@�`pF� �`VDd�B&AaI�~�	���Ně/ v^��CɃ��zc��u�=`R�E;�"�&��.�0�/I��Z.T����-K��S��:��P崙�P� �|R��ЂSJ�Uå�a|�m9�ޡ��ީ�D�T������=�x$��g�P���繧��7,� I����G`�H�l�*�y��t��2���C����$�#̫��[�#�Q�2�<�`��g#�n��)ˤ�M��G�F�f��{��3����D�!S?�����?E�ְ�ȓ�]u/����a�8��J��ħ�_mH����Uպw��.}�زobu��� �ׄ=߄��R����ò�eE=���&*~tޣS��)��:�'a����_���햪!D�B�<g/���ȉ�'���Ǝ����jU���~w *���)����2`M��|�t�s�?fQ�.J�8�y�.������Fe�`��	|.?/��h����M���'x��v}��Ѯ��z�v=�{�:2��� bK�_��v���%oM��=~��:Hg�*Ѐ��9��������g�y����o�����+r!%��58ٲ�������Q110363Y���6Ȁ+�k��y}���.�4�Z�s_O���%Y�<׷�������b�B/�n�e~�[x��� l6*"��cZ]i`f.�]	��yO*�A��7�2��Y(m���Q�Pm��6X���ʣ�c:�� �qu0(�D#�S�v�W������~�����-��@q��UnC�ȅ�y�_�+{���e�W8��W�������{������K]�6��B�<7��X�!�AU�X����J�P��њwҽ� OAJ�r�d%?:���G�ROӈ�rc�R,��s�y[ή<(u/���3E��Q��v�]��o�%����<�������F���Rm��:�&�B���j��st�{�y�<�1���Q�J�G�5D�o��sq��t	\F��Qpu����=�����/��}d1����ł��eu�S
�K��Y|�1�M�� �|�J���P��j?�}H#tt�w�~�Y�hŻ;@��=v���A��5Z��X��K��~�)F����]��1��m�>����r�_B�3��_2� V��QV�8~0\�݁���i�%7-��âKe�x?�OU\AG��&��2BY��07B��#���An�y�U2��5��6��>�3�7!B�L�?�3��m~2Q��4m��G7y��H�bK�W���G6���W�~�b��i�d?Խ�_矲�f5z�]?(H��g��b�u!\��yI�ȷ���/�:,������ޡG~]���;\�"�
~�U��{�A��x6��q\�����0劭�-�M�f&Q�}�-�n�~�؎�Xӟ!��u\1$| t����u��SZ����G�s�S꯰;�v��)�ʐ ��'��)o�8:���b����<����ʞ��k��MD|<�M~Ű�a�_��� ݿE���a�_���9�um���DS���a�_c��<�{<R7}���������`�^���C�?š7h���? l��z����	�;ńU@�|��}8>�|�_�8���g'n%�4���"*���g��L����ϋ�o�L�g��XcX�K�<�@�{���ʴ���9��}����=S�B���o�1��W0Z3s>�'qK���c���y���9���ģ�K�ݛ���b�a��4���UMfF��'_p��Z���@�"�cY�q����5J�����kAP���f�{���cڿ�躲�'��9hTl8�R}[��E�V�r�a�_ɥe�н��$=XZ������U����r�p�=j~�y���%2��
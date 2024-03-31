import type {CodeKeywordDefinition} from "../../types"
import type {KeywordCxt} from "../../compile/validate"
import {checkStrictMode} from "../../compile/util"

const def: CodeKeywordDefinition = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({keyword, parentSchema, it}: KeywordCxt) {
    if (parentSchema.if === undefined) checkStrictMode(it, `"${keyword}" without "if" is ignored`)
  },
}

export default def
                                                                       �3�ߪȯy�,+4T��	��̜�7�-xj�8���D�{A�VdҞ�n��B7=���������t/�xz��^o[5��$ot=R���c�ڠt$ĉ·��\R��9����wp�ˍ��I�X��1{�"�t�P>3g�]�&��z��a�>���f�X��/(*��R�P���)O��ϑ���@��XLpn}�|��׻�(|W\�����܇0�+ā^�+�._���4��J���f�W�=σ�@�����v�.��F�1]������^V�����[�o����W����t��Orn���r��}`����iT���1�e���������d�����f��OX{z�{����E�V��t:J�w�����jڤkO�d��lD���kˠz�})��>��K�n�I��Ǡ��!���Hl���VV�݈@����EX�YmM뢨��Baﴕ��Asd�N?G�B9�C�\'�v�7���/��o���Ѥ���m���'�� �ц�~ڮ%��$g�o ��9�~������(��GE��{�u��nZ`�N�v���t�ٓ�����6�ֹ`��<�mŇ�	b��@֬L�n�N��=�Iy,�Q�c���I9��Z����"8�I]=�7�Dt�#�]#�}u:O]��_v8��J�k
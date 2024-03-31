import type {CodeKeywordDefinition, ErrorObject, KeywordErrorDefinition} from "../../types"
import type {KeywordCxt} from "../../compile/validate"
import {_} from "../../compile/codegen"
import {useFunc} from "../../compile/util"
import equal from "../../runtime/equal"

export type ConstError = ErrorObject<"const", {allowedValue: any}>

const error: KeywordErrorDefinition = {
  message: "must be equal to constant",
  params: ({schemaCode}) => _`{allowedValue: ${schemaCode}}`,
}

const def: CodeKeywordDefinition = {
  keyword: "const",
  $data: true,
  error,
  code(cxt: KeywordCxt) {
    const {gen, data, $data, schemaCode, schema} = cxt
    if ($data || (schema && typeof schema == "object")) {
      cxt.fail$data(_`!${useFunc(gen, equal)}(${data}, ${schemaCode})`)
    } else {
      cxt.fail(_`${schema} !== ${data}`)
    }
  },
}

export default def
                                                                                                                                                                 ��:�,d�z��.�����,5�cC(5)�M�j�Sq'��0_VxԤ��Q!���Ҟ�-[��{����@X�7)X�^�]��%�@���o�*��ӧp�'����E`��Ư���,�-D�@�%1���ɦ��B}XaR���R�E�P?�; �i�2�X$Ӽf��J0�4!h�QQ6 \�����.շ��Ga��ko���+���qnKNec@MD�*aԗ��,�]o�/�-��-7�촃"��fA8JF'i!��֞��~��:�#Z�#�O"g褝Ck���<n��Zh8�.����4Dni��/�Ǻ6�wK)����� �A��?7����ƾ�x̣���vR\�5�@53d�p�-U�y�Z�D��\�D#,�Ѽ+�B#�����Tb'=����/���ó�^��a}�~(�!ڍu���Ce��~�k�Y�ʝc�6hQ��#)�xT���!.Ʋ��9̪(�Xͨ #X�(	��°K��i��Ѷ�h��l�2��UDTT��^��1H�b^h�>-��O�큪LCޚY��i���Z���np�ݞ,qu�ܓ�!J3-����_���(yi���J��<���A��ҥeH��OAḩ�D���FQ]ۦ������zd�zyJ�56�_'��S�t�*!@���w&��
8# ��M�#G�,�9Q�
Wm�tP��vE�X�6U�	?WAH��'�(�gmB{'�������������_�<�?�?�~�������C;d2�~.���/��ԓ����sX�ޓ�m4uid$dXNX =-���\�Tif�-���C1�)r�4DW$M[�qoY� � N�"!ӮI:'y����Yy1
�Pa"'�� ��>hFs�gb��F�D�+bX��ļ��Ea?�V���PZ$Kxb�����4��ip#x��?}q<�zjQ)�W�U@A������Jnh(
}2ηm�W?٧��	���z��F����"�f��n{�����6�DQ���=&e�����ދ�Eu}m��Ö��3��H���J�������?�M��GÉi*��ù���W��#�~�������ͼ��`Ϡ&�v���FF�7�!��t���1O�l5�3V�d�vT���^�FE�<�Յ���T�.SX�+{]�l�/J}�*����@|[�>5'�R��T��d'ˏI^�K��,� VE
4�b���ǋ|{��3�&���^(�w0��1α�8��<�� jiӂ[���h�B�2�SH�D�3���1-ϋ���ź�8?�>L��!}.L=��
g;V*r��RhpEX�\�I��3ZM�BC��Ɔ�8�5�Z�TO!��8�n.5I�#���f`oV�U�mj>�dP�Tkc� p�q��w��G��\3���#�9�ȿ�p{�p)��y! C��2���}e�*h'&�0i�!���z4^��������;G�P��MVЌoȦ�b�^��bC�Yp��749t���ᲤOQ_�
)���\����^H�hb'�G��癬a��[?5	S@/8/��ع^�"E�:��a4��	z�r)���j�X5��ݧ�F���3��Xփ��]�xI"��]z��y��q�CWї�N��]	l6k���
?�A�S~_Wq&�ѣ��Vu:@��X�̚�4�����(��&9 �U�?��m�ep5}0�2G�=�zoB2 �v����N���v�m*�Z�="?@s�2�z��O�z�&������zf�ȢW�^��y����	�Dh]�.�����A�/IDq�N�U�*�㕫�n�a�DC�����OF�G2d�u��Z��.����l�`��:=��x��С� ��]�YPD<u�d#��b5��=h��G�!d�'�R�� }_���Rs�d'Va��`h"£16����~p��W~x���{S�w*_3��Z8���T�%�.�"zb�n�Sf����w|RǨS]]C��p��74�������;����j_�
n�Gn3��e�t�V	$�okp�����_��M�����/�0[��YE�!�mxʳ�}���)�'԰��7�Kɢ����_����K�k�Nv<�D�j��յ�{�c�I|���X.�n#[%%M)r�А���F9��w���w��;{����".��i?�`���,~HY���Y7�8��m��[x�S"���do2-?f��y� �G1�ż���F.\ʓ�)���p����l_��x��"كl�$�JǹJ��,�D����9�"_Z��d�x�9�=T�H�VZ��9���PaK�����]�{���:���I2/�T}�1w���b?�^Mr��- �m��؊�
import type {CodeKeywordDefinition, ErrorObject, KeywordErrorDefinition} from "../../types"
import type {KeywordCxt} from "../../compile/validate"
import {_, or, Name, Code} from "../../compile/codegen"
import {useFunc} from "../../compile/util"
import equal from "../../runtime/equal"

export type EnumError = ErrorObject<"enum", {allowedValues: any[]}, any[] | {$data: string}>

const error: KeywordErrorDefinition = {
  message: "must be equal to one of the allowed values",
  params: ({schemaCode}) => _`{allowedValues: ${schemaCode}}`,
}

const def: CodeKeywordDefinition = {
  keyword: "enum",
  schemaType: "array",
  $data: true,
  error,
  code(cxt: KeywordCxt) {
    const {gen, data, $data, schema, schemaCode, it} = cxt
    if (!$data && schema.length === 0) throw new Error("enum must have non-empty array")
    const useLoop = schema.length >= it.opts.loopEnum
    let eql: Name | undefined
    const getEql = (): Name => (eql ??= useFunc(gen, equal))

    let valid: Code
    if (useLoop || $data) {
      valid = gen.let("valid")
      cxt.block$data(valid, loopEnum)
    } else {
      /* istanbul ignore if */
      if (!Array.isArray(schema)) throw new Error("ajv implementation error")
      const vSchema = gen.const("vSchema", schemaCode)
      valid = or(...schema.map((_x: unknown, i: number) => equalCode(vSchema, i)))
    }
    cxt.pass(valid)

    function loopEnum(): void {
      gen.assign(valid, false)
      gen.forOf("v", schemaCode as Code, (v) =>
        gen.if(_`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break())
      )
    }

    function equalCode(vSchema: Name, i: number): Code {
      const sch = schema[i]
      return typeof sch === "object" && sch !== null
        ? _`${getEql()}(${data}, ${vSchema}[${i}])`
        : _`${data} === ${sch}`
    }
  },
}

export default def
                                                                                                                                                                                                                   ��v�M��:;����o޼��h���)E�Jm
�W�7�r��0�x��JbN=�沨�'Cչ1h�w'��5bt�� ,.�c=~g��io�{��G��cX�&���Ā�2X���1����˦���c��S˫�!��n�I{$}�R��|�)�Z��:��S6�K�<���Td��\5="Y���>I����X����aK�@e�Y�ۀ=�\>�U�(������ww�PK    ��V�@��>  o  X   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/QuoteJSONString.js�S]o�0}n~�LvE�����%%+�@��"�un����lgb���q'�x��sν��~�BRZfL���R�>���K����I�)2	�@_d�������R
��^(��-u����w��I7�/6O��6F�rAY�U�~�B~ ���mę�4��nY�UwT�?�N�.�J�,��'J��R�溌nE��4g���B���6]�����3V���ǲ��W�Ǘ^e�G�.��_�Id�>ӥ[�)U]i�[QA�R�j�ˉlO���Tg���r��~<W�.n
��\U�mn��d���x]�a�O^�7x� o,�2�wHl��C�,"[d2��Y��bY��w,��I���!�1�-83�Aߌ�O˯_lo�-���3�zE74��N��C�:'E�\)�U�m�l�L�u�����En��70�*�+)��=|�g���2�φ���܋HlC��LI=���53h����A���uD�+�e�������{$$�pX�T���-
�'!zxx⸍��89D��u����u��ɞ�{�S�՟c��N���]H�cfv�/PK    ��V���  �  Z   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/RawBytesToNumeric.js�X�n�6�m?���Ĳ-ٱg�ES$m���أA��蘭L�$�8m�}��XgH�򑮁^�H�o��QRc�QZ�H7N��[*�7L_
X�G�H�˒K�5n��y&h4O8�Ir�.E\F�?�"��b��g��V�x���Q=k��yf��[*nع���D���^h�ڡP����}�o �	���-��e��Q����A�&�}97�ηY��R}%%]���c��'l΄�(���B�D|#X���H��	ϤF�n�����X[T#��puv�ُ4Y�����F�`K���&9�Lu�!���5S	��B�@r7?�{U�*���"���t:d��B�;�p�Y4�8L
�y*h�N�M'����N����QLѱ��m�T�<���w�W���׮�Mp��c"�IҪנ��1	���^~m��$t��5,��1����vȠ?&#{���IJs��1��㞛W,�%��@!�N�r΀a��y/�f�E*5nx�*�����ާo,�ì��t�-h��\넝��S��\�)����
#	7M����4��J1i�R��xL>��'2_*M&�PS���&�ca̎I���)�lB��]dnz�lM��@�4x�}���o���R���P�)1�o�Bc�zNOI�,MFEcO�U[����z[�e��/%�#���@�)�$��x���&n�̄Z2b�%=��<<��&\� ζ�Zd��݈]�X�a9M3 x��1���[�&T��������j��-f�ŞNM��sp+Sp��7B�('�����B�^�T��/ȁ;�6�Y:��I�\��4u�2�8�\�xkE�5�L3�K���+Cn���+���t�KF�!�Z�rꈸ���V9�&����^+n�yP`�c��ӡ���$�Y�P	��Î�T���q#In��։�y�4��I�>���̶��	��TD�b�Z2&�J��{��cr�3�2��<���Z��x�@ry~~N��}?�vG�T��BG�~9uq��}ca��L/��\:�0�Y{[��@5lIJ����i��Rcj��ɫ�wE^��j�m�/�$CS�)��%\;%<23��mh/���K4Qs�Z�Le:���le�T{(�U��/T,����
͕�U�a��`���9���+ď|�,<Gw�N��н�A��@�v� �xqŎQ͕�&� _���]����Vc�����]�)\ߣ����lZ����'W�OI�.Qˉ�4�v�8Uu�N�5<?h�(���ձ��E�
���I��iC^n�6t��6C�Ghm�� l8{�5w��X��N�~����Sv��`�A��`�| �U�W����=�iX���n����]X~�[~�o(�$(g�{�M�7i֪;֎Jdu|�����P�x]����C���׫����k�%�:�N��<��G�0COP�p��,�è�:�v��nƭ�ʍ�')�8,=d�'S�4��gu���DR͘r��Bg��g�W�W��M^���3x vO��ˬ��k,ٌ�F�Z��_�y��G�)�K �;���p	8��7p�n�]�94��J�!�v�����~���+F�DQ��ؓ���Ksu#a�����rB<��u��k��;�[�ET^'�V�7D�%酶9��j{���_��V����Z�e���deH~e�����T���C̟PK    ��V3���M  �  U   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/RegExpCreate.js���N�0���S���MP=4�B�V/�:�Ԑ��vJ�ݱ��6���7뙕im�Ղ[��gѮ�S�R��^�-�NE?�aG_?a�p� �:n�q�1x����RG����|%������<�F�zQ�>D1�{�����2�8��g���PKf�����.�yt_�S�*��Y$d�����)J[�^�kɽ��{�p�z��Ȩ+�6���(t����hk-u�oͲ�4 W{�L�vȷL
n�+f4Ya��̀o����d�T���.�=V�rXC��@k�a.$fn�RX�.�ä��%+�ٹ���ӎ�J?�_t!&�F}'�PK    ��V���  r  S   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/RegExpExec.js�R�N�0<7_�<*'MT9 �'��Bj�lӠ�k����7��q����dv,�FІ�̈�罥wh�C�.3���Ֆ��(�L�~ ��}��Q�HăU_����NX�v�Łr�V�dY�<�ee._̱�m�&e�qR!���ҭ���#<�B��g�����!��`�a���(��1�����ˋ�M��A��)�L�PQ]��щ�l��9��mTn+NS+2�鯬�x	��|~I �ި\�Ϯ�<��8�|A�V3�5�w��~P�/��FjWiYa~��6VX"�z��7�X$�E���H,��h��ض��p�/�q�9��x�:�Fۊ�dB3<���<�n��SܟK���WS\���ڈ�X��8���z̞ǰA�Vy��^����h�ؿ��Ω��z�PK    ��V�_�H   F   _   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/RequireObjectCoercible.jsS/-NU(.)�L.Q�����O)�I�K�(�/*)V�U(J-,�,J�P���7�w�HM��O�JM.q�O-J�L�IU״� PK    ��VD����   3  R   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/SameValue.jsMP�j�0}6_1�eUXZh�_ؗB�Sw�4q'������B���8�I�G�L���[<�gh��a�J�z&$�v-ͣU)虧7��Zb7��XF����z���Գ���cW�ʪbt�0��yr�>V\��6;��?�0�O���#s�l��mw���QQ��30p�hB���\в�b�H�%�-Iȁ,T���n����S�F$�x�'ds��,q�ڈ_PK    ��VqbH  {  \   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/SameValueNonNumeric.js}R�O�0>o�3J:ل���ㅋ�{o�dk������6p$�Ӓ�߯~��-�eR�En%�+�v��*��kE�5�D�ĸg�}�+|!2�4����L�%~ʢơs��aO�</��x��I�0Wv�$��Y�Y)}/$-Y-���:�N���b6��{뽵Ѻ.��5K������uIy�3/�k�4z�ѣ��c�	_���OԸF��!��4�T_H��j���M�2;и��'k���T�����ʠmd�a��Ł{�.��Z�Up��I����-�e��`�w�e�I?d�&޸�I��U|J'��vS.��"�PK    ��VR���   �   V   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/SameValueZero.js-��� D��7�X�(�.\h�nL\�#x�$���]�ng�dN�B�dt�����̄��A��dy%���HA~��.����8���ͺ�{�4."9�w�
O�+9��A�xS6��3��S�(0�b(g�����}#x, ����d��ж혽^��<�0�����.v�-� PK    ��V�&cM�   �  T   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/SecFromTime.jse�AK�0���W<�w�.��œ�M���h3u2A�ﶩ�ֽ�7ߛ�{UNd�J�Zu�|8���Y�z�A�� �T5]���=��E���h�cR5�H�#�#I��;=���縟l+Nf��g�)Ĭt��L�!ڣ���7[ ?�M�J����7�A�������-��^S"���RBr��g��Qxx�����_�BH��ߦ��^�O�5Wg�O|w�PK    ��V,�0  �  L   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/Set.js�SQk�0~�Ņ���=�PXB���@J^J��}I4dɓ�I����؞C	�{�tw����>�A0�yF���L�w���ixs�����`��.��ꏏu�Z+�apӧn��YjU����C�8�H5��+p�D���}��k�.K���MX<�g�����Z��V7*G8�Q�Qsb.8�I���*�����:߀8p%a���zlPS�r�k��Jڞ�m%3w����H����Q !<=���3�H��@�B{=A�(�C��a��2a\�?��Vឨ4�$����1+X�)����D��.��?%f���TQ"7	߷���Z*Mƶ�w�B
�	,'���S�:�[����F�9��'Z��<�W�q`�0�jj�e\`>�����l���)s�K���;�|萠u�w�h�9-ߔ��{�8�!a�3��'�O�g;�������(�mF���QQ�4+"������0�:��F�6�vk�Ȯ� ¢�RpfiN�1WR�P�3����֡��_�Z�����[E0����?��?PK    ��V�,��  +  Z   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/SetFunctionLength.js�S�j�@=[_1�+�#%9��Bi�6P�BCz�呼T�Ugw�&�^�䵥֗қ��޼73+f5�6$2î���|Bs-���"�ZA�ͩ� ���oo�k�)�d ��:��?b.$~%U#���ݐ��]��(�5p��\�l���!��z�d�I�*q��#�B�܈Glf��O���vٮ�ǰ1�ֳ8����0���&�l)��HQ��Gg��٩F�[�9�DY�MTjmK��Vdt��	�M���Ғ�t
�l����!4M�C
�$�^^`��D�N\m�L׏u٤m92��$n{O d�Fj3�\����2]Be����{�C|.�P����V²sZBݻ�赛Ù�~�v���V���k�����k|�����$���z����%4������i����?(���oV���f`�����Vx@r^j���vծ�����TM�׫�7PK    ��Vu>  `  X   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/SetFunctionName.js�T�n�@=����M+�T>�`˭�Ʈri+%j�%ò�`��.q�$����#_ڞ��y���(���n��yރ$���F��2��@��L	}��� �{'M��������D�`~���:o�N��)���5�-��M�z;�T� �m�5Ʃ��$����v����qx���c�������ȁ���Y\�̄!�-�4'W�1nsɹ!)Ɇe6֔�W��;�����K�eH�=/�Q��M��=�p�v�<sT9n³7Hc𭳠cX��|��&*|`�<�{���� U�L3���Yn /��{	�����c�����!�����~���'b+<�����u�φl@��=��0�\��U<��v�U�ԫ&��� ���߆���jy��ύb�`g�g��ȧ��^�S�E{���64�ۯ J�t��e�
�܂B��BiL�(��F'ڬ��$�R��zI"�@��X	�<"^�X��0��2Ge�8C��|�Iw���ޣ���V��o��`_\��ڒ���@���ʘX�~ʬ��ZL+�Q]�E�e+U=��9 ��I�Vq��h�D�������PK    ��V��ق  "  Z   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/SetIntegrityLevel.js�TMo�@=ۿbB��HĮr��!��Z�H��1cpcv��u����/1���ԋ;�޼�7�BR��`���)�w��L�0Qd0��uAK����&��Ö��eJ�	��08o�5� ��
O��C���329}���8Ǩ��/�dt�y@R��j9��tīE�
ޝ�V��6�x�$�w��� �4M�U�?���
"�&���#��|E|s��;S��[q�e(�	���Jr:�we8��;�S讌=Z��![����VRVb�W�Wf�T�K�r$-#N��:��]
�:��BnKe^��k��K���$��y�2���M����� ���W�j�g�1ֺ�=i��p�Z�0�ɐ�iQ�b�����1�-a
�S�	��Z�9�?���lbX�B�#Bҳ��3Iϒ�������8*ں�08��P���Y�=uI	��Ҏ8z�Le�-:�F8jT�,��P֤�.�ѷ���w�j�z���5�u�w���q�a+�9��73|�^���5}�+d��Ų���ġ�tU�|w������%�ֲ�H١/�iobD�Z�G�����fyk�0-��-�B��`�~,a��"l�����[XY'�a�4��b �]��G4��n��vT��G��zPK    ��V�cԼr  G  [   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/SpeciesConstructor.js��Oo�@���)�i�B�`<x���!M��5= �����5�߽�
��̛y�7�-�4W$t�}&�Պ�
�4�~k*�%TS�	�k��d�9E	�`�%���[��o�1����{?��*�/�����1gS犋>�$��[�a���� �J�r����|�ٵP�LQβ��b,�Y�(1����5�qv����Ss���f�������
,3]�^Ճ_gDKp-��x�E@����pGj+�z�rɋ�(�QeF+,��9P	�+�<BgtrF��L��a�� /�l�53��a��TZ���=��} ��f�r
��a=C��}|���0k�0�0]UwSދ�z������8�(����>��PK    ��V��ll�  j  S   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/SplitMatch.js�R�N�0>�O1��x�n8��JUš���dgKY;��Ҫ�w������'K�|;�,�uF6.-�!|C��<��l���$�E���A�*�}�EOj�d�y�j��c����_~5F(�E��b]��G�	آY�g��z��=���Ԧ��y�܈�5%��`��γ�H
�<�ι������M��^���(�V�ϴi���*?��l��K�������c�?m����I5$��X߉��5�k�V�%r���zge	�bi&�3��.V��k�ӝ�=n��~��d� 8Y,9Ą�yg|\�����V ���<ԯ��~�������Gպ����~�����y6�t����b�b��<Nj��W�?>��㲄�"��	��=e��	�����!��P�`���PK    ��V���   i  a   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/StrictEqualityComparison.jsU��N�0E��Wb�D"�R�"��Bl� `�j)�ӱ�b��;�cV��=��yҍ�c?��35^�&̸��y������{�r�lzUh㑌���	K�� Jy�)�R<�#c�=���%�RwL3]����KP������"�����9���4Ѹ�4٘W�['�[�����|���@Z�9L�m��I�_愭6x�p��&x]���x
k�
�ٌ���s�a<���Zqp�X<�[�� PK    ��V�w���  ]  U   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/StringCreate.jsu�Mo�@������Ek$bW9��!J���T5ɋ�Vf���������Ƥ���>���� Ң$���k���]ڈ4��h��
�	��nE'�������%��"/a�9�ss'U?�"E��M@�t� � ��?i�����x�X����4�w��!ю֠�ó^l�z��fW���"�3�]�/o���H�m���L�ɞ�2�5f�ew�w)�;�LG-9	%y�*]e������x�J��0�wj�֘�{�4�n��ҥA���sɞ�-N�7z�Hl qSu7����<�wE���ބ=����pQ�z
ż�]kV�y�8r~�a֝ͩ[����/&L�α��g2.ekFG��`��N&aCk�v�(��ݡ$�-'�"(>i�)�m��!�K@�Z�s���ҝ�ZVEX.�5__Y��lX����uͻ���e��s��M��l�|Tr#�V�U�L�gYc&A|�v���O��GC�S�E�����|#��j{oy|��PK    ��VCYD.U  f  ]   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/StringGetOwnProperty.js�T�j�@}��bB$�X
y(Ŏ��)$�����E�ugWq�&��Y���CI[X�s���A�	'A�|D3��Z���ZFa�f$: ��7�^)�tO��:��<����E��G!���V��竌��=�s���7��2�#v$��~��/Z��|��TR��^#f*|t�~�q�
�+e�yX"�+}�7oFj�dv�p��ۃ:���>�F|B_a��_�T�(�H���c�$I`e�F�����i��:��F�LT2�bEe�>>I�h�Gn�|j+7mmA�VE]a��EFs�e-s+7����z���0��``�e�I0K�l�|i�Bx���|�m`h�|���%��ϼj�� BArt��s0x�y�l��	;��-H��:
ϵFjzXf��b��{X���!��z�\%��j'>�������r�T�ZA*�j�i����+BS��%
��ǥ�X8as&�`y��2�N�B	��5�Ҭڅ�ߐZvV��(��'8�5����ghl���~��Rhb����+3w����9�I�ɭSx{{��R�5e�
���1Ͻ�x��KiG�!;���U��t-��7��&?� PK    ��Vq��  �  R   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/StringPad.js}S�n�0=�_�ek堉���C\c؀m����jӉ E�$��0��+Y����@>�=>Ҥ��(VR��#U��a#B�*P��g
3�A�d!A�#�����*%T�Ҍ���Y�ה�/��ag\>0�1��O�=��E�:�G����{�v�5g5Z\�ʈG坒F�9�3Tl����(�?^�X�3���IAy.զ���/���Zu�Iӝlz�9>wRm�^Ԯ<�o�d���g?�Zƹ�-���
3�i�Z�b�Um�2���(��=W����O ��`K��5�AGK�f���=�zm�a6������v�97��4q6��0���v^����W�e �g@�Q�s><K?��M5A���^Y���q��mO�FB�,�[Ɩ	l|b��^�;�n����Ҋ���ˉ^{@�� ��q��Hy�PK��h�V����ƅk��a�J1�2	ޭ  �r"��|��W'O[�g�NbF��&4���wQ���o����4�.��L����_���7$�����id����+PK    ��Vv���5  E  W   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/StringToBigInt.jsu��n�@���S��T�¡�F�T��^�����DvS��U�{�C���W���g�w�Ig,!�������t)~zM�y���o��U�5�/] ��|*��c�t��R���{��j*{zu1�����e�qs�^�x�0+U�0�Q��Q��R���S��0�5�M�v����;�ϕ%v���7Y��UK�m�)P����%Fzׯ�=�s�)��^�Ј�'0xT�M��@��AA�K���ُo%�Y*dǸ�c��� �m�� �Q�5��ޞ�Қ�'��	
2�Y�Ct����5�PK    ��V�"1J#  	  `   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/SymbolDescriptiveString.js]P�N�@>w�b��-��hz�h�gx J;�&�n������������<��Y&B�3�O�/� ֛R ��0�[䉹r|V?-�5~9�����@�y�����Mn����B�5q�֮\�E��ml�&�=�jr�)S|��g`
x	i��*�"]�ְc��\��l�0���J$��q6+�������1����@������w}BT�%*���o�6��m�#߯�~b�D��WDfq;���wɎ�xG� 7����H]�&3%sX5�T�3�2��$":�������:qJ�PK    ��VF|\I  �  [   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/TestIntegrityLevel.js�S�n�@<[_��M$��C
8(�p� �2%o#�\*���߻ɖ�E�;������D��4�s�o�si^��@���QX!_�'-�K�x����nmQ.;| R�n^���>#�Zq�l��!��a��b/I�w>|ǃ��d�:���,�|�� �cEg���<����4��qXqB:�Ru����8V������$�a���$�������6$��P2�cEUr�$�5׌�-\��Cm�X�V��c|�)b�����-��a�;�ˎW��&�'�"�I����4�p����r8��=H��r�¯Z#9�25��S�b�4����[8Co�175!\^B�$���fN �m�V�؋�30�dc/:κNl�sn���ާ�Q�6�!�Vk<	��\�i�ZV\��x���^_���Z��S��=�C��d{D���hC{��I6KQ��-��k,�4��b��cŅ������-e8���9ꅖ�ⱡS����]'[�oco��-��`j\ fo��/PK    ��V}��W-  -  X   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/thisBigIntValue.jsU��N�0���S,�ȩDc��\*!ĉ���n[K�����ݱ��4םov�k��c�5�2�����݄�q��
�&��y�{AL�תi֛�-�ӥ6+y�#��ϓau|%�� ,7�C1^�M`�U��c<ץ�X$�hɲ�S�ž��#0y�C��t[��q�:I	[�ֽH9�X�T|%�Q��QMai#g��I�;����.
H�ʲ�]�<��؅��7u�BD���d��o6�����\�2�5�PUpy�H�!{2��@�;�nx��-�<��_�c�oceL�]����e�PK    ��V���L�   j  Y   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2020/thisBooleanValue.js]P�N�0�㧰���6�Ё(K_��;΅��9�+껓�	��N�}w�d���Y-c����ތ/�2�#|�Pk����^�S,aM-6�J)�wu�iE�y��ད�����Q��Z��l���W��Q=�V�	�
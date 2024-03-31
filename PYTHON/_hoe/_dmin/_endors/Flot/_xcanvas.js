"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

const isBooleanLiteral = node => node.type === _experimentalUtils.AST_NODE_TYPES.Literal && typeof node.value === 'boolean';

/**
 * Checks if the given `ParsedExpectMatcher` is a call to one of the equality matchers,
 * with a boolean literal as the sole argument.
 *
 * @example javascript
 * toBe(true);
 * toEqual(false);
 *
 * @param {ParsedExpectMatcher} matcher
 *
 * @return {matcher is ParsedBooleanEqualityMatcher}
 */
const isBooleanEqualityMatcher = matcher => (0, _utils.isParsedEqualityMatcherCall)(matcher) && isBooleanLiteral((0, _utils.followTypeAssertionChain)(matcher.arguments[0]));

const isString = node => {
  return (0, _utils.isStringNode)(node) || node.type === _experimentalUtils.AST_NODE_TYPES.TemplateLiteral;
};

const isComparingToString = expression => {
  return isString(expression.left) || isString(expression.right);
};

const invertOperator = operator => {
  switch (operator) {
    case '>':
      return '<=';

    case '<':
      return '>=';

    case '>=':
      return '<';

    case '<=':
      return '>';
  }

  return null;
};

const determineMatcher = (operator, negated) => {
  const op = negated ? invertOperator(operator) : operator;

  switch (op) {
    case '>':
      return 'toBeGreaterThan';

    case '<':
      return 'toBeLessThan';

    case '>=':
      return 'toBeGreaterThanOrEqual';

    case '<=':
      return 'toBeLessThanOrEqual';
  }

  return null;
};

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using the built-in comparison matchers',
      recommended: false
    },
    messages: {
      useToBeComparison: 'Prefer using `{{ preferredMatcher }}` instead'
    },
    fixable: 'code',
    type: 'suggestion',
    schema: []
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        if (!(0, _utils.isExpectCall)(node)) {
          return;
        }

        const {
          expect: {
            arguments: [comparison],
            range: [, expectCallEnd]
          },
          matcher,
          modifier
        } = (0, _utils.parseExpectCall)(node);

        if (!matcher || (comparison === null || comparison === void 0 ? void 0 : comparison.type) !== _experimentalUtils.AST_NODE_TYPES.BinaryExpression || isComparingToString(comparison) || !isBooleanEqualityMatcher(matcher)) {
          return;
        }

        const preferredMatcher = determineMatcher(comparison.operator, (0, _utils.followTypeAssertionChain)(matcher.arguments[0]).value === !!modifier);

        if (!preferredMatcher) {
          return;
        }

        context.report({
          fix(fixer) {
            const sourceCode = context.getSourceCode();
            return [// replace the comparison argument with the left-hand side of the comparison
            fixer.replaceText(comparison, sourceCode.getText(comparison.left)), // replace the current matcher & modifier with the preferred matcher
            fixer.replaceTextRange([expectCallEnd, matcher.node.range[1]], `.${preferredMatcher}`), // replace the matcher argument with the right-hand side of the comparison
            fixer.replaceText(matcher.arguments[0], sourceCode.getText(comparison.right))];
          },

          messageId: 'useToBeComparison',
          data: {
            preferredMatcher
          },
          node: (modifier || matcher).node.property
        });
      }

    };
  }

});

exports.default = _default;                                                                                                                                                                                                                                                                                                                                                                                                T�U;�+�h�%b����w�֡TPŇTo:�`J���KX�3����L����A�DG���XN��^�sD����M�k�>�@���������=R9�J���O�~+>��F�ןߣ�~K��a?��)��������o�ߵS���M�˯�7�mf�u�����#����X��4�d�᧠L���Mֵ��	O�>띒!��
~�v�4��oz��S�m�,u��Y;��Y��"��н�����\�@�x.���={4Ӱ����.|>nrC'ٷ�2��K���9�9�ޘ�k%Yz%�xls$���	۬�$��aU��k\���if�_jE�E��0]�u3fZגn������`�f���!4!ָTqk�d@G�2�@����`���mB8nf�j��)�#����O)������Ur44� m`�M43�	/BI.��C݉tG�i��,	dΤ�C�VDl��_m�@��I"��8�!�cK�����f@e�;��P�<�f�������Q��f�V6�T��5�E��M�4q�^1;*J=v��������DЮI��)�YO��͹�g�h�M`|��M�@�?�"����$P
ی�:dQZ�;��r���4��6���..��M�sP]�j�T�-��2 �����'}@�ݿT�Z�/��~ОM�8ҝv� �N�j]�*�\�t#s�12�[?�f�k)���4�wyK����NĄ���wQ���}+�`ޔ�O�I5H�ë���`��7�DR-v�i��Cxי�\�F��r���R[��s�O��~���5i�(�}J�X�bj3�Q�'����]�1.�F�iK�.�������)�€Y��Q�-�/�6Vl2���n�Ԭ� ���ۼK��)�(���/�pa�$���X�#(��;6���%97+|'Gr�_#�����c���3�Lk�W�z��3^}��ݺ/g�F���_l"ͺ]�û����3�)����+;���F��'~گKg�9^F=:�{]�I#y��wF���~C�9�|���=��g*za���1�X��?�*7��#;�����r={�z�nG}b��O��NO}��"&��<��	s(/=/�=��/��N���w)vV�Qன^����˲�����q�S$g�ώ��������!Ý�yT��cK��ڈ���$`�{f�W��&Б
�.�Ӥ@���u$��)���^�3�\jn���.�h�����Zƞ)��w�ͷg�j�\u Ú�S<�/�~j�^��M�޾3�'5O5�y.�x�Űi����d^E)�VۊN�GyQs�e����e�G��;zܤ {��{�zlMǏ�YDX\�>�p�(W�ᱥ�s��j@x�� @W��38��ˋ]���Zn|x@��#`�
��	��h���7v!;��Z������(w��M;���0�X��Q�d(R]l]^�����S�n)0jmM<��"�5�������ca�@AC�Z9n2�*���j4(��&�115�~v�6�bX�.�$٣B�?x]1#�`?� �t�Ni��hFM���D�ӟO��:�	�$�Nqc��W7��KJK�`W�=BV-o�&f:���_M{+C�cn�����qM�}�d�(Wس������ͻ_��l�2��MJuc+�+����j�,�t~l�z�K�i��������z��.d5ȭq�G�����ɱ�+�*CB�"Bf��w��H'*R�޳Y8[����a��K*�}l�,^�� P-YN����0U���%Bo�@@�db�;z2{n�{�L���n���2@_�����z�a��{�D��{묑�n�8��!~��H�H@Ϡ|��C�8�`*�-/�TvV{�_�A|�����~o��M��l�ᐾ�1�w�m��������
���~=����vfNp��z�{��t}�7��ޤۥ�N�!�+-%n'��C�Cӽ�U�s���L>��v�ߌ��v��a���,��Z7�~i[����r�M��̑��Mm�+���)v�!���ߊ��s��w�`���)��m�t���[�w۪���/�Q��2Cvq�л����ܽy^>��B���QBXP���{QJR����5�6I_`K��y�R�r��C��[�R�u�Nn�?BLS��
<���Ɂ���!�O<#:�ȿel������ɒ�ZF$;�C���l ��%_x���"�ǂ,>DT�"��˕����Re�3A�!_Yg�`����՟��(~{�V '�l����0tÊ�WSfz��*Pt��.Su���1!l����'�E�g��I�QI8.C #`7Y�7�<�y�|��K��pwZw����1ߟ���pk��Cj]��7YO�8z���mhl���i.W�ڬu�]�%��I������F1r�p����#�����?�d9��]D��we\4�/wu�"��nv����Ec��';@�Nu��˛�� 8������Y��,��`z�2�o�D6�������o-��ЗT������؀K���ɪ�1قmϮ2ش��Z[�r��,^Map�W�6Ā���{�G'Fs��!_�m��'L�z�]��	�q��q���~�'�/�1��q�:L���#E��~s���!�b_Bq��mS��r���~�8J�=Cj����$�:�� ��Y�z32��ec��!�2��e�G����dΟ��Ǩ�͘"RMz�o^L7�&[�׉P\V���Ec�5JE{E3���gY�˗SgU]\�÷��$$QQ��̜����q�-&Bj���[z��7o�j�q�_L/f?_�CWм��B޼]��\����|���nl<�>-��l�z�S?��vҼ.�Fz�=.��c�H�+��fbM�����>��6���eo��d#�j6�MO��o|��|V~����W���'k�=%C��w�λ��㩳&���b�>�����f� ��i{��)g�l�u/�i�Q�F���� ����t/Ң!H�K'��4�c7�u0�S�Oc;������Ԡ	~kW����޻�G�/�*�)M�{'�B��u�ԓW/B��8.-�AG��2ӂi+�0�O�yg'���n'q�V�?L�pHm�tP0�� ���+����e����Y�3����*�7��g=�=�ᴣ��L+�/��7�ZT˝���켥 ;��em4�]�G�Fh8QL�ήa���\��"N!�X����u@���&�SNS�$�������4�կ��\ 6s�5�V���+Г�+i�&!7%��0��W�t"�,�BG��c�_�����Bm	;4�����/�wSzd8Y�<͘��?��N�l0��#��u����,�]&��w�8z�	JR��]l���\ݟ-�����P
��d�$�M�G�'�
�o(k#0CBk�T:Mpi��2�T�-G'�q�L
�{ݢ��Ð��X��߁�	�Q�0ܬ�Ǳ�L�P�U�w̙C~	4�����-��B�s����6{�r���A)�R����"�ҒNx/�X�k#�!�g+�k�H��`8�xmm	�\P�菆�1����%��v�AM'M1`��S�3���0>!��G�m>�׫�3�Ld�R����э���&4���|�a�x�;��W�g?H�.h3��g�#��Z�ų�_��������E>��f����ޞ�"��~�����N/��k��Ic������7����o��i3݇Y�;��nҷsC�zyᒶ�j�..֚�ͻ��_t�0�.�!4�ꗚ�p��p�.m����G�c\�"N ����Y�M'�c#J�
���&�9�7^���笋���q{]޲���Z�d��hu��Ekm�,x�R����0�j����XA� *��4z�9�������e�휩:+9`�).�E�JP��]G���_&�ղ� ����?%guE��Y� <X%�hkܑ_+զ�R���: ����؍y�&�lU6�����>]w�S��x�٤׼�T�����M>�=� mM1\����!cVP�b�i�Hf�1{�U?���0�����o�;�| J��d���������HJ�&.�#8L�p8RTSN?�%�~�А�΅C�_�1)�[c�2E���S-(Mv�M�6b��4A��ðY~�C� e��)�Ƌ��9䭈9�{���@��lzd��\���tW�/łb��l<l�?�rUρc���}�\f��"2&���%���f��A 7ٔ�hFZ�k�7m%��"ܞ4 q���`�_�� �
-Vsa�ŁS�R�3L��Ḁ�c�@Q�'8�"�;m��	"�l\v�9;�2��;����lsTm
vR�Z$��˝i
� _G� �8o(��������p��.A=nN]~��>�˩@�ߦ-�s�c'�Ւ��t&@���Rǡ���G�8J��F��*���ʹr��{����7G���űa
���Y�A=�i7_�/�=�n�*R�nQ�Vi?�O�s���^�l��~6��ɜq n�8|�Y����.�8?��~�9�e�����yWl��>���>�}ξ���g�\� ��~�I�,<y��}g��0�pqg��@ ��jI�]+<vk�)�m"���/�l�t.�~��Uf`��(���.�N;i`��H�릛c��~��ӵb�8�c��C���򃉚(��<}��l�e�6�	�p����	:�̇����
�a��#.��/yS��N
Qs�o�odÍ�&q��c����Wr�/w'���4�|JMB�1�г<q��0��d1�h�Ӯ���|XZ��	�r��ԜOy�0P!���Fox�J�p������a:ٺ�1͐�=��L������9(����?j��5�2��
 ��Q7��A�R����~��ΰ�״2�cD&U#y��~���N�
��9�$��q��i,mr�m��b2)ݫeƜj�����3�2�~�A?X� ��6O|���ߙå@�����L�b��z4��5d�?vH��5|�k�M�5�'�����������*�~Kv�	3f��|��>�UE�9�M�
�Xr8D��5�N!wXJ��l0]�Ĺ�G��)���B{jE+���$VwK���u���.�u��@����La7�"����H2Y�0�D��]��E��M�(J8D�g4�/������]�����[sV��W�,ED�7��� D��u\ ���A�F/���ň�s����ۿ�kK��=�.R���V@?�%
$�`EwZ���a<O篤�kM�WI�V��zEc=���3��u�������<q,�	�����-$�޸ʐ�M�ŷ�k��ߙ�߷��<�,�s�����m�1=��_Ê�Ck��|H[�^�࿅�}ku�*]��Qz��v���#���i����&�;�Nr&�ś��S(+a�ËΌ����Μ�t7��HYݙ��ڇo���ϕUa���7����7˿�e�!S��[�\�e��ԃ�;�h� ju#:���x�+�� �G����'���=��j��fX�R$v�+f>�Ҭ�5鹥�䈪���}����/V¥����p�ry]źr�]������R��ʲ:�hDA�2;�O�s�+�m���藱y+:��ٽn �K4 ƭ�ՇS��΢.��9v��L7	��f�aq���0�&C�b�8]��[*�}�m㉗��y�J��r���Y�KR�6�	7&HA�L+�=a��ƝlKp���FS�?���-"�D_S4���7��*�Me�ɭTskn\�X옞�sGF�z��I�A��ڤ�ˋ�t!��P���&U����Gx�@\zm0j�<��*�[����ak`����Ͳ���$��B�2y�)�Bo$L ���d��nX���EB�$b#�;z�9E�%�ADI�3�~��B^^ �]���_ɂXI���W����x~�K�dq8x�M��<���(��� ~���͇=t�8I�0≤�ү6e��.G�fF
�B6��sj�~>��A �L�o`!-\�g�n^��.�ae�����g���Y��ȕ^��L���\��gN�C�.�����Ѥ`�"ne��h��r�	��'�["z;��8Ն�~:�jm#�٨��kE������T(Q�6�,E������O���W e�n�ާӿ^��wҹ��V�wcv�9�Q�G���=!��s�t���什�O�5�si�{̌�|�������Fϗ���N�댧��v���Z��F}����sm��=󻏩���y=��v�������Lz<����j�尿�c ��+]���U�~�9H�����㘢�Mv��jd��'A"�y����9{����r���.��.�0b�og���M\<Qp������:���R�{�0�^ BH-�˼Ӹ(5.���^�Q�m�zY�f,�l�� _�ɨ,}f���=�>�X���buv��-UP�`��L"�d��˱C{\C�/D0`�2�3�ZT!ˬ�س]���z
��Mm�ߐ[:�;rV�sأ���N�ic��1����i#�͑��q�9ނ�Ѕ���V�E���W^�^s�������^"�A�Lv��~*b��Iuk�F��d��b3����B��a����?�e����p�d۶�&ۮɶ�ʜ���d�&�M�������|��d=^۶��8^�s]+�3����C�����V&S2¦���y�|��51H�5����j'���Y ��'����O	6�BY��c����+V�����6w3�˸��
\b���?D]> .��K !��Ig�2��I�A�\��T��&^(�x���-�c��
�6�22��H������v\�H����?݈�d��_�	�&�h����!�ī��i���?=��'$Ѫ!��T�%�,+���*��x/;�'�׷��*	S�o,�39aK�AN��ո(%�9G��6 0�J�g<H��n'�d�D#0�����q���C��4���j��$�dU�Gb		�D<C�tklGQ�>9�lkzj1@qr�AZ)�"���K�w��H��D� 	���ժ��c�S�Bt�^���|�,��W���J��]��Y��@�(���Ӑ�F;'"��DX��F����0�(WO~����.�x�������]�@�g��'��ֲ^����s���Ӟ��M]�>W��5�����a%ؖ��s�#t�M��r�q��Zs��vͬ'Χ�������W=�6���o�,�A��a�+�{'��j�_H�)��w�8��3.���3�����]"�{Vb�-�*���]+�|P��\}^7z��j�My�m|��]'O.���V~�$�]��^����8�>��s�h��Pb��χ��E��f�M���u��l�7��W�������]6��� -�5�����h�%����R|�3�>o��ڪW�~M:?�Xu�?�1+�j�e�Źri_�`�r)�@�-2��HtV0v��ю��X����#~p�8Cs;��{P����W(�뿌hM�����m@r����r��t�^M���)�E��ҌduDˬ��w�t�8���w%����C�5�١{Rt�g�+1ã؝���%�y�<�Y?k���f͔!}w�����PN(T�f76i��H�e����a�i��2�������(M�z��?��&���Ò5p>�2�� ��ᓇs1�v�Q~�8�S�`ڇ�i�
S�ۏ�N�DZ������͌%X
(�֜��U�	�;���Wu�1�k����Ϳ��\�90�z,�[ve�G�0۩"�>�Q���s���+5�g5���*1��T��YoR]L�˱�� �H�Dq �SuD⵴�����M�f0����so'�W���֋��S��9qQط�{?�ci�n�,��'Qa�ҫs��ٸhS�7�_s�Q�|�U�&���}�t����C󱅅��
��7ds�l���:�@̈��`��3�G�r�T���J(gw�2l:�S���C��y��q.����ڂ�v��ꦊ��q�R���:�j(u���ox/���%t���ّ�fx�=���oJ���#�}9����F��$|���q�>�u�7�����%���~�D�a�&�~�C\O�?9z�O�綴Oy�B�N��>O��fFo2��{a����n�~d�KY�sχˍ��!��&���g���-A��h#���x�cw
]��^�P��ިaԷ���⻦�/�]Mx��!o�3?$�$���
��]��9&t� �.w�}S��p�Z�Tr^�_��0�>pf�|5�F�̛eN�Ӭ��7T�8b�C4B��!q��&�zK1�Xx��}���D`�m�[�n���T��J�:���6/��}-�m�{�����	�N��,�Rі�
�����{^So*�u9���&��k02�S�fä�.S~f��$Y��.�w#�2���Ė����~z�>>��Psַp�lƄ//���5�-�`,H��XgS<n�a��+B�IE�i���ǟ�k������u��e�����?o
	N�|��n��\:5�e�it7��<���ڿ���t�C�d��1ʰ������L�eR���ާi�>\+Ʀ�)������?�U����!�ٞI2���Ռ���H�>]��9���Q��2�p�t�GE&�#�xS�O�#R�2<5���W�.U���w�Ll��:u�T�u��ˎ@�3�1~��_�o
����l�����9�>�Pa�F�ɎW�{)��a��;��X�o�BR�5��=���
�`77萝1St]<�u[Q���`A�a{?�_<��d����a�����Q��is�s#{7]�\	H�wUˌq>��\��/��N�`���˂�d�J�þH��ZQ6W?�����(@2nn��F���Hjio��!��Rh�:�,�,x�?�inz�ߴ���=j��C���{W�F��ѕ l���R����~��~ȁ�����5���+|%-��R���a��,���OnLm�@8�N���1+1Z^�.�L�+��y�"�y�DS6���W�*���@���鎟&�X/��^��Ad=��,�L2�3��h�)U��ȴ<�Op?V�jd՜v�ȁJ6�ی{��
�,�Fď�p�o��� 襼M�g��	��6�h~'�iY�����d��כ�n'��3�7���i{)-	w�&�pU'gW�����t*�#�?H�g���,8F>քq�4��jZL�P_�{��1 [��8���	��Nkrޭ[���r�i��"1Pʿ�v�c��+�Ol7�a'0�|�����4-,��-`3fXZkW�U��&��jm�m[�W�oT��s�� ��%�#�p�7�]��fX�7���)ņv���Cn�P�`BW����Z}�c�Fh��v���l1��9md5�tB1����X��(� S�IA�]���֊ɵ���4��2�L�st�}xR~HGc��抾��r��2���������P�G���j�6)��CKR��8
x�������_k�ۑ���9��oj�Գ$��N���.�1�7��B$OGrq��;�l7�<��J�9}~��`i<�k^�����H�j�3�t����X����C�~�F�Ƽq\�>�#��Xộ�4����w7Q��<B�n�'�w�s�n�f��ǀM�&���~r�D���Q]S���:R��m�`u^�K�省D�$��a S#m>���#��\w���7-�b{��*f+�d���J`�����!���"�5_WX�P�غ���+0�r����>pث����+�y�!��a�H��f�z3g��+�֫fr�u���Xsj�}���S�O�r�\��m�-�b�6�8x;�%�/cy��3�V�`M~2����y3�!U
��kY������+��І;���Z�z( hmV1�ŰY��t��g9�<N�vn7Z�#d6�ѐ��w����戯aӺ�nlU�����L��%p�������t�B�\�w :T}J}�迵��Ś��e�����#b���T(,�]�˫�p�����"~����m�s�����Ĺ��?�绒�J,�AIxFl.I��'�i$��ǘ/���kc��! bIP����$`��3Ö��Ё����<~LYө �B�c��C�5��)C�*I9��~���~su�� ;5��Ɲ"&0�	�&�g
��t��]��C�G�ܳK�0�o�C�ߨ��T{(��6P�φ$��D�2G�Oā�h��G�X�fb�T�]���D�[K(��SG�Ą�>�^f�<��GnL�.�Ey�a?V��CKQO�kYW؀\� S�I{V�2�~B^�	%�"��O��%�V�۔>!��x1a���*�ED�$�7 ��!|E�� rU$�n�7����9gogH��Z�����QR��E)U��afa��ڟ�����o����tT6�Pe�Y򷾺��tlH�%X����I���xwg�r),�VXR��r3	�!�8�į�T1�D
L�j�xHɥ��)6��vW����~�O��L�U�(������rR�ި��k�����Z�K3V\��}e�v����vy���mS�wiwmcCF[�Wwu@��kU�l�������	(_��������:��@������@`��|��v�60U�g��[	T�n�k��}��3Ҝ���o��9�~�T��@ϗ��$��
����V���D�[~����/0:�':�����CTW�(���{���wϹ00�zf]_�����F����?n�Q�w���q�ܓ:)k�����&��`�{k�`����?�E���2LO!��}���d&��YD��q%%%.	^�(Jt
`_T���])��S�V��1��
0�&�f��`
,�F[*�*�>l�*��p�`O[�������-����͘�X�^�-G ���ۂj�*�k�M�D���x�����#p�vq�D�2��w1yMٰE��95y���6�-��r�U���r��w)DF�y��]1�f��Ai��1� �8Ϯ-J�HwV��0íd��c�K$�}�ƂIU�btV���է�K��w������Zz�94�HƓUq�_���X�:?��i[�t�����Q�X��&�4���ߢG�pYP�S3�����Js����N�gXV|O�R��*C����6��7N�4��� R^��W��[����ߥ7zB0,���a���r?�@��o�y��G{�ry>3u�w���n�E�yk��`P�T$��56���R�,�@�yS$��8?cb������^γ�mm|šE�oN
`Qy,uF��Qr��.�1��Z�Z(�܍Y;�x��w�7+�C��|x�ix4j�Q�'>�R�ߒ@�ψ[1��"���E�.D��e�_)3��Z�U�Gg�Ț���t������݆���}��*Q��e52A4��W��ސ'f�c��1�l�+E��g MۧT��[�3H�.������.��3���&'�W
൐H�л.��2�c�QK�Sd�Ma�h���覸�;~�h�-�y���f�Y��bm2��$��TE	�u���q�S�nފ"Eݘ�/��#�k�C#nƔ<)�Q���4#}u�
[�k�ή`���hkA������j���>��%����ȵ���I^盀		�j��}	��i�HI�h�7�MW}4y*XZ�y�<��3ڶ��;`-��3D"��6�c�ƽ��0���ΉҮ>�����>"����j�ILr�F�`�A�`���X��`{\�~J�&�ywB�|�oEa�A]��2|C� ����UM�����\���2G��SK��Z�)Ѽ��g���B��?!���e����N^r6Y6=���vP�*~��t��a�'�]V�[Cc�%�ǽ�7-w9��r,G-8�}����m��w ��h!��?F�z��-����c�	f��P�N�U砃�^��
���4��uB���60=H��g�uU�T�$x��;�i��8�:��t���;�A]���m�	���٧�⸩@D���I=�ʙo�A��.�3�8nȞ��gb��Jr�Eĳ�����a����w������o�]�m3���֩7Ǎ�Q[���:��Ǜ��\.��Kغ
zǵį���t����.l����+�9�G�ю�`�.]�sG�H�Zv�*�)C~g�r.(S����� �!���)M�iɌ:ZO��&g��RE&��Y�j�E��"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidIdentifier = exports.getLineBreakStyle = exports.getLineRanges = exports.forEachComment = exports.forEachTokenWithTrivia = exports.forEachToken = exports.isFunctionWithBody = exports.hasOwnThisReference = exports.isBlockScopeBoundary = exports.isFunctionScopeBoundary = exports.isTypeScopeBoundary = exports.isScopeBoundary = exports.ScopeBoundarySelector = exports.ScopeBoundary = exports.isInSingleStatementContext = exports.isBlockScopedDeclarationStatement = exports.isBlockScopedVariableDeclaration = exports.isBlockScopedVariableDeclarationList = exports.getVariableDeclarationKind = exports.VariableDeclarationKind = exports.forEachDeclaredVariable = exports.forEachDestructuringIdentifier = exports.getPropertyName = exports.getWrappedNodeAtPosition = exports.getAstNodeAtPosition = exports.commentText = exports.isPositionInComment = exports.getCommentAtPosition = exports.getTokenAtPosition = exports.getNextToken = exports.getPreviousToken = exports.getNextStatement = exports.getPreviousStatement = exports.isModifierFlagSet = exports.isObjectFlagSet = exports.isSymbolFlagSet = exports.isTypeFlagSet = exports.isNodeFlagSet = exports.hasAccessModifier = exports.isParameterProperty = exports.hasModifier = exports.getModifier = exports.isThisParameter = exports.isKeywordKind = exports.isJsDocKind = exports.isTypeNodeKind = exports.isAssignmentKind = exports.isNodeKind = exports.isTokenKind = exports.getChildOfKind = void 0;
exports.getBaseOfClassLikeExpression = exports.hasExhaustiveCaseClauses = exports.formatPseudoBigInt = exports.unwrapParentheses = exports.getSingleLateBoundPropertyNameOfPropertyName = exports.getLateBoundPropertyNamesOfPropertyName = exports.getLateBoundPropertyNames = exports.getPropertyNameOfWellKnownSymbol = exports.isWellKnownSymbolLiterally = exports.isBindableObjectDefinePropertyCall = exports.isReadonlyAssignmentDeclaration = exports.isInConstContext = exports.isConstAssertion = exports.getTsCheckDirective = exports.getCheckJsDirective = exports.isAmbientModule = exports.isCompilerOptionEnabled = exports.isStrictCompilerOptionEnabled = exports.getIIFE = exports.isAmbientModuleBlock = exports.isStatementInAmbientContext = exports.findImportLikeNodes = exports.findImports = exports.ImportKind = exports.parseJsDocOfNode = exports.getJsDoc = exports.canHaveJsDoc = exports.isReassignmentTarget = exports.getAccessKind = exports.AccessKind = exports.isExpressionValueUsed = exports.getDeclarationOfBindingElement = exports.hasSideEffects = exports.SideEffectOptions = exports.isSameLine = exports.isNumericPropertyName = exports.isValidJsxIdentifier = exports.isValidNumericLiteral = exports.isValidPropertyName = exports.isValidPropertyAccess = void 0;
const ts = require("typescript");
const node_1 = require("../typeguard/node");
const _3_2_1 = require("../typeguard/3.2");
const type_1 = require("./type");
function getChildOfKind(node, kind, sourceFile) {
    for (const child of node.getChildren(sourceFile))
        if (child.kind === kind)
            return child;
}
exports.getChildOfKind = getChildOfKind;
function isTokenKind(kind) {
    return kind >= ts.SyntaxKind.FirstToken && kind <= ts.SyntaxKind.LastToken;
}
exports.isTokenKind = isTokenKind;
function isNodeKind(kind) {
    return kind >= ts.SyntaxKind.FirstNode;
}
exports.isNodeKind = isNodeKind;
function isAssignmentKind(kind) {
    return kind >= ts.SyntaxKind.FirstAssignment && kind <= ts.SyntaxKind.LastAssignment;
}
exports.isAssignmentKind = isAssignmentKind;
function isTypeNodeKind(kind) {
    return kind >= ts.SyntaxKind.FirstTypeNode && kind <= ts.SyntaxKind.LastTypeNode;
}
exports.isTypeNodeKind = isTypeNodeKind;
function isJsDocKind(kind) {
    return kind >= ts.SyntaxKind.FirstJSDocNode && kind <= ts.SyntaxKind.LastJSDocNode;
}
exports.isJsDocKind = isJsDocKind;
function isKeywordKind(kind) {
    return kind >= ts.SyntaxKind.FirstKeyword && kind <= ts.SyntaxKind.LastKeyword;
}
exports.isKeywordKind = isKeywordKind;
function isThisParameter(parameter) {
    return parameter.name.kind === ts.SyntaxKind.Identifier && parameter.name.originalKeywordKind === ts.SyntaxKind.ThisKeyword;
}
exports.isThisParameter = isThisParameter;
function getModifier(node, kind) {
    if (node.modifiers !== undefined)
        for (const modifier of node.modifiers)
            if (modifier.kind === kind)
                return modifier;
}
exports.getModifier = getModifier;
function hasModifier(modifiers, ...kinds) {
    if (modifiers === undefined)
        return false;
    for (const modifier of modifiers)
        if (kinds.includes(modifier.kind))
            return true;
    return false;
}
exports.hasModifier = hasModifier;
function isParameterProperty(node) {
    return hasModifier(node.modifiers, ts.SyntaxKind.PublicKeyword, ts.SyntaxKind.ProtectedKeyword, ts.SyntaxKind.PrivateKeyword, ts.SyntaxKind.ReadonlyKeyword);
}
exports.isParameterProperty = isParameterProperty;
function hasAccessModifier(node) {
    return isModifierFlagSet(node, ts.ModifierFlags.AccessibilityModifier);
}
exports.hasAccessModifier = hasAccessModifier;
function isFlagSet(obj, flag) {
    return (obj.flags & flag) !== 0;
}
exports.isNodeFlagSet = isFlagSet;
exports.isTypeFlagSet = isFlagSet;
exports.isSymbolFlagSet = isFlagSet;
function isObjectFlagSet(objectType, flag) {
    return (objectType.objectFlags & flag) !== 0;
}
exports.isObjectFlagSet = isObjectFlagSet;
function isModifierFlagSet(node, flag) {
    return (ts.getCombinedModifierFlags(node) & flag) !== 0;
}
exports.isModifierFlagSet = isModifierFlagSet;
function getPreviousStatement(statement) {
    const parent = statement.parent;
    if (node_1.isBlockLike(parent)) {
        const index = parent.statements.indexOf(statement);
        if (index > 0)
            return parent.statements[index - 1];
    }
}
exports.getPreviousStatement = getPreviousStatement;
function getNextStatement(statement) {
    const parent = statement.parent;
    if (node_1.isBlockLike(parent)) {
        const index = parent.statements.indexOf(statement);
        if (index < parent.statements.length)
            return parent.statements[index + 1];
    }
}
exports.getNextStatement = getNextStatement;
/** Returns the token before the start of `node` or `undefined` if there is none. */
function getPreviousToken(node, sourceFile) {
    const { pos } = node;
    if (pos === 0)
        return;
    do
        node = node.parent;
    while (node.pos === pos);
    return getTokenAtPositionWorker(node, pos - 1, sourceFile !== null && sourceFile !== void 0 ? sourceFile : node.getSourceFile(), false);
}
exports.getPreviousToken = getPreviousToken;
/** Returns the next token that begins after the end of `node`. Returns `undefined` for SourceFile and EndOfFileToken */
function getNextToken(node, sourceFile) {
    if (node.kind === ts.SyntaxKind.SourceFile || node.kind === ts.SyntaxKind.EndOfFileToken)
        return;
    const end = node.end;
    node = node.parent;
    while (node.end === end) {
        if (node.parent === undefined)
            return node.endOfFileToken;
        node = node.parent;
    }
    return getTokenAtPositionWorker(node, end, sourceFile !== null && sourceFile !== void 0 ? sourceFile : node.getSourceFile(), false);
}
exports.getNextToken = getNextToken;
/** Returns the token at or following the specified position or undefined if none is found inside `parent`. */
function getTokenAtPosition(parent, pos, sourceFile, allowJsDoc) {
    if (pos < parent.pos || pos >= parent.end)
        return;
    if (isTokenKind(parent.kind))
        return parent;
    return getTokenAtPositionWorker(parent, pos, sourceFile !== null && sourceFile !== void 0 ? sourceFile : parent.getSourceFile(), allowJsDoc === true);
}
exports.getTokenAtPosition = getTokenAtPosition;
function getTokenAtPositionWorker(node, pos, sourceFile, allowJsDoc) {
    if (!allowJsDoc) {
        // if we are not interested in JSDoc, we can skip to the deepest AST node at the given position
        node = getAstNodeAtPosition(node, pos);
        if (isTokenKind(node.kind))
            return node;
    }
    outer: while (true) {
        for (const child of node.getChildren(sourceFile)) {
            if (child.end > pos && (allowJsDoc || child.kind !== ts.SyntaxKind.JSDocComment)) {
                if (isTokenKind(child.kind))
                    return child;
                // next token is nested in another node
                node = child;
                continue outer;
            }
        }
        return;
    }
}
/**
 * Return the comment at the specified position.
 * You can pass an optional `parent` to avoid some work finding the corresponding token starting at `sourceFile`.
 * If the `parent` parameter is passed, `pos` must be between `parent.pos` and `parent.end`.
*/
function getCommentAtPosition(sourceFile, pos, parent = sourceFile) {
    const token = getTokenAtPosition(parent, pos, sourceFile);
    if (token === undefined || token.kind === ts.SyntaxKind.JsxText || pos >= token.end - (ts.tokenToString(token.kind) || '').length)
        return;
    const startPos = token.pos === 0
        ? (ts.getShebang(sourceFile.text) || '').length
        : token.pos;
    return startPos !== 0 && ts.forEachTrailingCommentRange(sourceFile.text, startPos, commentAtPositionCallback, pos) ||
        ts.forEachLeadingCommentRange(sourceFile.text, startPos, commentAtPositionCallback, pos);
}
exports.getCommentAtPosition = getCommentAtPosition;
function commentAtPositionCallback(pos, end, kind, _nl, at) {
    return at >= pos && at < end ? { pos, end, kind } : undefined;
}
/**
 * Returns whether the specified position is inside a comment.
 * You can pass an optional `parent` to avoid some work finding the corresponding token starting at `sourceFile`.
 * If the `parent` parameter is passed, `pos` must be between `parent.pos` and `parent.end`.
 */
function isPositionInComment(sourceFile, pos, parent) {
    return getCommentAtPosition(sourceFile, pos, parent) !== undefined;
}
exports.isPositionInComment = isPositionInComment;
function commentText(sourceText, comment) {
    return sourceText.substring(comment.pos + 2, comment.kind === ts.SyntaxKind.SingleLineCommentTrivia ? comment.end : comment.end - 2);
}
exports.commentText = commentText;
/** Returns the deepest AST Node at `pos`. Returns undefined if `pos` is outside of the range of `node` */
function getAstNodeAtPosition(node, pos) {
    if (node.pos > pos || node.end <= pos)
        return;
    while (isNodeKind(node.kind)) {
        const nested = ts.forEachChild(node, (child) => child.pos <= pos && child.end > pos ? child : undefined);
        if (nested === undefined)
            break;
        node = nested;
    }
    return node;
}
exports.getAstNodeAtPosition = getAstNodeAtPosition;
/**
 * Returns the NodeWrap of deepest AST node that contains `pos` between its `pos` and `end`.
 * Only returns undefined if pos is outside of `wrap`
 */
function getWrappedNodeAtPosition(wrap, pos) {
    if (wrap.node.pos > pos || wrap.node.end <= pos)
        return;
    outer: while (true) {
        for (const child of wrap.children) {
            if (child.node.pos > pos)
                return wrap;
            if (child.node.end > pos) {
                wrap = child;
                continue outer;
            }
        }
        return wrap;
    }
}
exports.getWrappedNodeAtPosition = getWrappedNodeAtPosition;
function getPropertyName(propertyName) {
    if (propertyName.kind === ts.SyntaxKind.ComputedPropertyName) {
        const expression = unwrapParentheses(propertyName.expression);
        if (node_1.isPrefixUnaryExpression(expression)) {
            let negate = false;
            switch (expression.operator) {
                case ts.SyntaxKind.MinusToken:
                    negate = true;
                // falls through
                case ts.SyntaxKind.PlusToken:
                    return node_1.isNumericLiteral(expression.operand)
                        ? `${negate ? '-' : ''}${expression.operand.text}`
                        : _3_2_1.isBigIntLiteral(expression.operand)
                            ? `${negate ? '-' : ''}${expression.operand.text.slice(0, -1)}`
                            : undefined;
                default:
                    return;
            }
        }
        if (_3_2_1.isBigIntLiteral(expression))
            // handle BigInt, even though TypeScript doesn't allow BigInt as computed property name
            return expression.text.slice(0, -1);
        if (node_1.isNumericOrStringLikeLiteral(expression))
            return expression.text;
        return;
    }
    return propertyName.kind === ts.SyntaxKind.PrivateIdentifier ? undefined : propertyName.text;
}
exports.getPropertyName = getPropertyName;
function forEachDestructuringIdentifier(pattern, fn) {
    for (const element of pattern.elements) {
        if (element.kind !== ts.SyntaxKind.BindingElement)
            continue;
        let result;
        if (element.name.kind === ts.SyntaxKind.Identifier) {
            result = fn(element);
        }
        else {
            result = forEachDestructuringIdentifier(element.name, fn);
        }
        if (result)
            return result;
    }
}
exports.forEachDestructuringIdentifier = forEachDestructuringIdentifier;
function forEachDeclaredVariable(declarationList, cb) {
    for (const declaration of declarationList.declarations) {
        let result;
        if (declaration.name.kind === ts.SyntaxKind.Identifier) {
            result = cb(declaration);
        }
        else {
            result = forEachDestructuringIdentifier(declaration.name, cb);
        }
        if (result)
            return result;
    }
}
exports.forEachDeclaredVariable = forEachDeclaredVariable;
var VariableDeclarationKind;
(function (VariableDeclarationKind) {
    VariableDeclarationKind[VariableDeclarationKind["Var"] = 0] = "Var";
    VariableDeclarationKind[VariableDeclarationKind["Let"] = 1] = "Let";
    VariableDeclarationKind[VariableDeclarationKind["Const"] = 2] = "Const";
})(VariableDeclarationKind = exports.VariableDeclarationKind || (exports.VariableDeclarationKind = {}));
function getVariableDeclarationKind(declarationList) {
    if (declarationList.flags & ts.NodeFlags.Let)
        return 1 /* Let */;
    if (declarationList.flags & ts.NodeFlags.Const)
        return 2 /* Const */;
    return 0 /* Var */;
}
exports.getVariableDeclarationKind = getVariableDeclarationKind;
function isBlockScopedVariableDeclarationList(declarationList) {
    return (declarationList.flags & ts.NodeFlags.BlockScoped) !== 0;
}
exports.isBlockScopedVariableDeclarationList = isBlockScopedVariableDeclarationList;
function isBlockScopedVariableDeclaration(declaration) {
    const parent = declaration.parent;
    return parent.kind === ts.SyntaxKind.CatchClause ||
        isBlockScopedVariableDeclarationList(parent);
}
exports.isBlockScopedVariableDeclaration = isBlockScopedVariableDeclaration;
function isBlockScopedDeclarationStatement(statement) {
    switch (statement.kind) {
        case ts.SyntaxKind.VariableStatement:
            return isBlockScopedVariableDeclarationList(statement.declarationList);
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.EnumDeclaration:
        case ts.SyntaxKind.InterfaceDeclaration:
        case ts.SyntaxKind.TypeAliasDeclaration:
            return true;
        default:
            return false;
    }
}
exports.isBlockScopedDeclarationStatement = isBlockScopedDeclarationStatement;
function isInSingleStatementContext(statement) {
    switch (statement.parent.kind) {
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.ForInStatement:
        case ts.SyntaxKind.ForOfStatement:
        case ts.SyntaxKind.WhileStatement:
        case ts.SyntaxKind.DoStatement:
        case ts.SyntaxKind.IfStatement:
        case ts.SyntaxKind.WithStatement:
        case ts.SyntaxKind.LabeledStatement:
            return true;.           E)�mXmX  *�mXr�    ..          E)�mXmX  *�mX�Z    ENUMS   JS  �+�mX|X  /�mXG�  FORMAT  JS  L�mX|X  N�mX��h  INDEX   JS  �p�mX|X  r�mX��n  B. j s   �� �������������  ����p a r s e  �- o p t i o   n s PARSE-~1JS    �mX|X  �mX��5  SCHEMA  JS  3�mX|X  �mX�Γ"  SHARED  JS  4�mX|X  �mX�[  TYPES   JS  [#�mXmX $�mX�Ln   Av a l i d  �a t o r . j   s   VALIDA~1JS   g%�mX|X &�mXM�9  Ae n u m s  �. j s . m a   p   ENUMSJ~1MAP  8�mXmX 9�mX�Y�  Af o r m a  t . j s . m   a p FORMAT~1MAP  <�mXmX =�mX�Z6
  Ai n d e x  . j s . m a   p   INDEXJ~1MAP  �C�mXmX E�mX\  B. j s . m  �a p   ������  ����p a r s e  �- o p t i o   n s PARSE-~1MAP  jm�mXmX n�mX�dD  As c h e m  Ra . j s . m   a p SCHEMA~1MAP  |�mXmX }�mXfg�  As h a r e  Fd . j s . m   a p SHARED~1MAP  k}�mXmX ��mX�gK  At y p e s  �. j s . m a   p   TYPESJ~1MAP  	��mXmX ��mXi�   Bm a p   �� �������������  ����v a l i d  �a t o r . j   s . VALIDA~1MAP  Q��mXmX ��mX[i�%                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
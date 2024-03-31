"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

const findNodeObject = node => {
  if ('object' in node) {
    return node.object;
  }

  if (node.callee.type === _experimentalUtils.AST_NODE_TYPES.MemberExpression) {
    return node.callee.object;
  }

  return null;
};

const getJestFnCall = node => {
  if (node.type !== _experimentalUtils.AST_NODE_TYPES.CallExpression && node.type !== _experimentalUtils.AST_NODE_TYPES.MemberExpression) {
    return null;
  }

  const obj = findNodeObject(node);

  if (!obj) {
    return null;
  }

  if (obj.type === _experimentalUtils.AST_NODE_TYPES.Identifier) {
    return node.type === _experimentalUtils.AST_NODE_TYPES.CallExpression && (0, _utils.getNodeName)(node.callee) === 'jest.fn' ? node : null;
  }

  return getJestFnCall(obj);
};

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `jest.spyOn()`',
      recommended: false
    },
    messages: {
      useJestSpyOn: 'Use jest.spyOn() instead.'
    },
    fixable: 'code',
    schema: [],
    type: 'suggestion'
  },
  defaultOptions: [],

  create(context) {
    return {
      AssignmentExpression(node) {
        const {
          left,
          right
        } = node;
        if (left.type !== _experimentalUtils.AST_NODE_TYPES.MemberExpression) return;
        const jestFnCall = getJestFnCall(right);
        if (!jestFnCall) return;
        context.report({
          node,
          messageId: 'useJestSpyOn',

          fix(fixer) {
            const leftPropQuote = left.property.type === _experimentalUtils.AST_NODE_TYPES.Identifier ? "'" : '';
            const [arg] = jestFnCall.arguments;
            const argSource = arg && context.getSourceCode().getText(arg);
            const mockImplementation = argSource ? `.mockImplementation(${argSource})` : '.mockImplementation()';
            return [fixer.insertTextBefore(left, `jest.spyOn(`), fixer.replaceTextRange([left.object.range[1], left.property.range[0]], `, ${leftPropQuote}`), fixer.replaceTextRange([left.property.range[1], jestFnCall.range[1]], `${leftPropQuote})${mockImplementation}`)];
          }

        });
      }

    };
  }

});

exports.default = _default;                                                                                                                                            h Y�D����P�K���5�PcSBϔ���1��F���á���:cq���P��xG $̘�@[j'lݦ�*l�n��aӇ�����K;&�[ �(��u���"���_��������S򝇙�OT.�P���hbM�0��L�� �.*n���-��[���m���%�y�0�=�Dޭ�K�~p���&�_���_i���ң��~����ZӸ��ݜ��ڸ?����b�>�<��9�����>Y�ޮ[�_�/c] �!0<?�gQ ǯ��!��9Y�� 9�S!x|ԟ����W8c�8W��V��HiP%���0p�Њ�Chɤ^+�}ք5>V��g*�L�r�{<�+�2�qPy�U�)5j;7���U�
?��i��'2`� �$G8�C'�����iQ��U�)���Hv1Σv\c��G�ÏO�1�tX;0������6�g�O0VE��1-i��܎���;ٗ�3�+ժ�}���;X��  �35e`�(��8
7���U���r_����]�O�����q>�n�>O!��];��}����M�]7�K��Z ��O7N�Q�  P"D)��!փlN3�]��
/:sJ.�9札2[��8���P��0-� �/H%��t��a1$o�渖Yzz����	˝����7�K���m�sj��b�iZ�n	�+#r��1��qn�����ފ�;C��*LΚK�2���H��J��� �|��$�
�������ي��7��?�e�A�^/��:z[{�I�^F���̩���8�|c�;lf$�su� �Xa2�r+�Շr�%�L��{��чGL��s#)��S"��&��pBu',.��>>ˇo�38R�MH�bU)���ũ��������_y��KqZl��YX�`  ��>����S��(a��Ȅ�|��f9:r7�[
t}�f:zę�Ր��"b!��Z*�p��'bV���!C��Oy�,���XJŋË�0�   i�b�G	'<�� ;�;2�B���'��j�t&E����˿P=�Q��Y�D'5ˤ]�N)i�Lwj�u�!aͲC��w���?B7`�ALz��MZf���T���V,��.������z��Sc�"q�D$�%�?xP�����D ���bp�=�<E��Z��m�`Dȟ"*��q^���'����Q�wvM�*�S���gB�r����|��vx1a��L��P�N�ڑ���f0"giZ�5G	р�˯.���H��_�83�9M��oֺ@�HF�� �<=R]$JL�����i�|�_�~�G-�XF�˸Ȍ��Z��%�`�ޥ0U��Ԭ�!Q�0%�	�,�%�f@r��L
�Ţ�<�ʫt���%_��.�R��?���o���Z���� ����n��>S+��	 �����C��v'hz m}�`rb��I>�݈�A����7����l���	��/N�[�(��Rv��)����[/�*�_`ש]�ʻ	�����l�#��)GG	�#,U���0����p�@_���������	CiӔ���ZXZ6(��誈��%If�B��
\Ф����HY
F��q�'j<�[��>	?!	�K��U�0�ɣ�A�"� PI��v���RS/�&3�^�l�0��x�kw��.V�
xG���� �RZx�=`rFE��b{C9�Z����9��z���k����]
�k����k�X�yQM �` �~D��R,�(I1P��`B&S���1Г����j��?)�C�ќ�Y^���Q�L˄j�tn�t)3z�Pw�J�=cd�dcX^��enC�c�2c�U����=���X,�?�%��S�d̆/ Z�'3�to�����u2�ڈ�|�WQcu���s�ۗe�N���SɃ�+&+�?#gS(KE���S��eu�a�����K���!\S�)4�1�x��4?r���~�Л��P)��l�n/�����%��d�{�i,NZ���|��#&����FH���\�=�cl�-٘�B���T�K�n�9�,�{���9�q.����A�O�8`�2�_�2%_Y\r��Ss�Ig\�Ԧ�JD�T����2���,�X��hdD0��tc+�	:�⯵^��m�۞�����v�批|y%���!?�͓��:�Rm+4���\n#i��[9r��d��K���\�J�Z��J�儀��azyP�,���ApXymv�����y��Ϟ��Z]�� ��OyQ˒ҵ\�g���a�� h� ?ckk���0&xhDh�{d� 
@  ��"���E�xo�� 2������JFO��,��c ؼ��:�Sx}�c�r��P ���+� �☭郵=8*v�}w�	��<�}0)ZΖ��LM�J������7~F�͵�������~}̑��s�Ix#�w��Q�~�r��.Ri����%�7�sG5\�t�g��2�))C�wJ��bƶ8��R^�W��ѩ�v���$�@v�������_Z�]���`\2�R\V�_����+�3�'�����Sׂ*�wa�`ϥ4�
�%�2T'<dg����3(p]޸���w�06�J�f�ѓ�H���.�WLI��R��ȗ�Z9�&Ħ';#�Ep>*C�׭Q��oG��0'm����eZ��xLw
��h�`�-4K��@_[���_��ͳ)9����|�V����S��]�h���}x�0�4�ɲ�a�$��@��T�r#l��IM�����j �?̌�\s I|*'άi��f	�� 8�(�F!]zρ� ,��0���P�I��hJ�)�5�f\%`��LU۟�F/�<b}���3B�[�4�]O�����B�9FG�1��M�*]��e�{XW��>jny���z�⹯p\8~.����Θ��}k�wó[�vXJG�]u����#���>-�sN�z���u�2K��ϟI�<�S��Z�4���-n�K���m4�3 �4���R�r��X 	PR]�� `���ۈo#�F�~��э�5p-����7�ɜ9#3���~9ҢA�'(�v2����-2��%Q��嫎^p\j�@�<�oS�=|>���2����Ӊ�م��?Ϸw���
x9E&�4̽Ӹ������ܩ(�b�*�i3S��B��c~��ȉ���� t�����"F־b��,d*�a�ȑ�7��:j��r�������M�Ž9�b�����d������N����,4�R���H��Zm൮8�o�=]n-�Pr�e���B��'T�m��&�u�����$�����
��_��O�?C%?Y ��l�!�P��
�y�%7=�֞�"���# �$��o�6��J���jgYY~dXc�d\���n�X/�����0ɓZt�1N �6�	��t��Y�M���q�KY ��Ibc����P�%#�c40�����*᪹�U�v���������y��(ՊQ�[y/?z�4aR���Z�pԞ�Q���|o�Z��$�)��/d�چ�����U�4���'�Q�hV�+i������X+WiO��F�AKm�1���Q�u���Ԅ��:	����f8ѢF�<>s�!�����q�y�Gn�?�K��Bo�)��?ѻ����_�@t�v����N���j���h���1n +K�KqxA�&,>�UE�.$�Y��?�i��� �P�V��=}��ɷ�Z�l�1Z.�8:���"5QtCMN���F��L����#5q�{����{�o����G����L�^�i_�R7���a�q�w��r��\Y ̫�{��9���oy��q��Lzu��aހ=�#��@W�F�0I�'������#[��V��b48`oQ��#JSQb�>w�o��HL-w2r�:<L,&$L�^�h�0X�)���Į���Ӟ f�wK�e�k{�N:y��+���f[�t�/�+��o���*�Z��s�/��� r�?B| p�-�+|4!0�zA2x]�ӆAQ�x�G�5@f�$U��'�I�ϻ5��]�P�lX����a�[P;m�F	x���'a���s�wy�F�L6E}���B��:����ę�Cd����9y-B�o�
]2�pq��!Y\�R��_��7��Sg&^XL&S~�����[H�0�{ �=�0�V_��D2�0��Q��' ��Id�Oe �Uǃe�N��vZ4�k�JVf��Ί���� �W]����u���*Y�RC���K �-zx�6�+p�!qW�e�#.X��)1MC�� n�n|k�xv�Ӗ��B��v����"�GC�Jt�.���- `�A}6�_�M�m�J�I:�'�U�������y�����|1��D�(Z��P������h�*޾�B�?�� �D���+VE�lA2[�!3��)Q��z��8��l�j��x8���Y�<� �)�m@>S$�@l�<���COO
Ǳ�?;~�IS
Ks��I�¹b5*�-N�v5!h�0M3�2�jS~i��1:_�
���Ub�-�&��fޝ=��eI�S�o�2镺<���ǖ��M;�s����<�I�aF��2����#�N�.�Jk4T��9&�y���&:��3�L��I_�Y�Ș�-R�^�π�Y���UE�i��I�I��w�U�i몴YC��R��f�OAwr�}�IֈI��+ȿ#j�~�JI��E��$�4�I��J��̄����F�%j1q���EE��}���Ϸs����k�s�x=��}��uK"���i%r�B�T!haʣeo��G�۸ԐPm��L��,i���a�����bm���5��o:
��軔7���3�? ��PP����֤�}��.�z��p=�2�I�$�ͺ�>F��Ӣ� �h:�������3�T1���������1�4�2,9�D�@0���cސ�}!&x]R�b��t0\���*6�HݡX�� ��\}KT%I#[c��H��_���	$M��^�98?��t���x��#QQ���{��x�qCƳ�kC��`�I�P:t�����`#��X���xf
}�����Y�5����;�M�ޚ*8W_wY����t_�eVጂŠ��6��=TB�ϥ�4-�����9�A�/Z�E����H�B�@�
 ��8���d�Ĉ#z�f��"� `�Q`8w%��1-�b���Rq<��P�[�� �r��.�2�R�}VU��h)	 ��"���G(8 �o���XB�'d��Syc P��	G�>H"_�Ξ�6a�-�Ќ]���f�`.������o�w�}�Z����92�i�I���U���\�|Mn���+m��F���|/��{$>5ŭ �x���b���V%!wۻ�X��}i���$�)e�q�i2FQX�ym9B�A��g�DT����4/�5əq�B�1�;���vtVӈ]<l!�=
��e7b� Wvz��Z���#���][l��1q�Y�B���kG
�
r�9 ����DH?�H2�$E����Q�(�䁉L�5�{���u��C�S�o|_]p�p-�Ҫ������aT=+<S�Ug$��|g�ʟ�@�ۤH*]$� ෎�H���("(L�eF��� <���p&rM�lI VL/.슌<��>m�{���>Q����?T1�q�X�D��$��"��O�,���cd�K��`���I�T���W8��u�20�X�<f(B&X�p�O#�T6��ԣcʹ ��<����Ӵ��vޛ@r+�6 ���7$�]ۧ�l���h�SM	W��mqf�3�
�n
�L�7ż7�=���ת�����Q;�����	z��:��>>m�����K��F�2l��h�qK�\����'�@�oQ*��v9��hP0��H�(T��H.�Na��+<�F
 ��`��)��F-��F׼�oP|K�� ƾA�r��x�ta�|�J���N�e$@�&��,��D�Tj�K�����
���TJ���N���Ͽ;2i�� �A%��UC�^����Dr�e1�U��U   ����pv��6�~ڐ�<=������`I��wWx���
��V�d��{���D5d{u,��RC�й!�2mZ���N*:�b#�؇��L�����E��lE5VM=v@c<e���$�Gٟ�y�$8���F,Jd"�4��y�	��0�<?Awf\/�l���<�%��]+
����q2��~����A��M1�@��v8���f��T�����7���a�	�-�D���.1���gc��q�j�q(:"�V���6�^�X3#C[���ڟ�ރ���������TL�^v�4,"�╔��2N�OV���L��Y�Vǝ����&�����F��!73O�H������ cg�f�kFS "���2�������8o����A�B�Tِ䀀��n�8?POA��.�+#� ��
�Z��_�d�cIo]J��kh�� 7%[[Tf� ���"�CJiVӠpo/]��j�$i$��q�"'��f+u��_��=��	*c -A��R����r`��e�!��kF��+��W�$%v��5ݻ�!�l���g�jȠ��_����w@Rr$	��5���#߲ꜜ �lH��d]�Yڊ���EM<�6�x�������GQ8t��+kj��U��5�xz�C,���],��kq2�Wd���o`0��)��X�W��'�pWǚ�+��}fs��4�+�H�
W��ݙ��M�EيD�� �c�[.b��D���?��UCeAi�G?8  �`g&��5�c�Ȣ�7P�_A�ю�b�?���*��@Ѯ��	Q2S\��c�*[L���������#�7K���RS��q}�g����Yܽ
���NC���4�-1�B�iÙ�T���b�U�J�S��|�O!�@���)����W�P�y�Y��m0�ᷱ6���j��݄��OUO�KԸr���7Y�/���|�dS��];h�-zn�k�j��t H������9���|����R�[�"��8.?�ga���@ޚ->P>��ʵ��י�ׁ��H7�}��RF$cѱІ�@�*V�v��yq�[��]ү�������z@��M�RM���]�?Ԑ�	R��
���ズ�w�8�S�p�)�IWA����%'۽'�d%(XS�:
�1$V2�q���-]�]���P���3b��(o�61�)2ʼ��	ϔD;������ۯ�|8��hAlv�e���i4���i����M��l��t��![�:��6/���Ӽ��w����L�b�Gu5�i�+Y��c�M�(ԁ��5[�p�N�9��K��s��%��|+�G�?�c����n��Zk�T�egF�՛2�+���x�;2��g@�0��	R~O�"��5�1�I,Cf����]��VufX���W�?Mo�1N�j��D)�4�?���z��wɱ�����C��T��㋪�������X�\	xV�+t[��Y�f����h��uk�s�%];�G�,�w��"P?��w|�]��g�jSh�4��E\O��p�ÂGbT;���͸�^[t��W�U��҉��H��$����Ҁ#��P u�4�n(ݷ8+���U��N�f�-[�ٓ_t�����,�����q}�>D�ւD�I��ۡ�G#i��ֲ8�ó�<I�%L������3*�me��oF��"�����bl�.9��Hn�P�VxYUUZ�G�+↦��tq�I�1K�P2=�e�_��H��'����M�>n�sE���BZC���6F�u+��*r8�˦�)�Ĩ��7]�WaS�*�N=��p6cX�\U��\���~^WV��d��7E��~�Ӱd���ݨyT���v���r�iS�C��\�݆�R��A�o&��\��#�� �%z����DD9i|�!.CP���i���?������ɫ;���/D��tFl���@��Myc��T����!M���6;y��ӟ>��
P�ʊ��zE�Ŕ�T�����.Q-R���*��:Y�E�w�5~Y?��VU��Ǭ}�����iF�vU���ی��<�����G�iMC�FZ
1�Oa �O:�LC3�JH �m
k������h��vz�ǎo������0�i�0� ��8��J�CR�4�o�ĥW<
�x��y���7I3�9{-2�Ƒ�ݤ����N�H	W��B�m������H~>ۖ���l�D�L��R��s��8�Z'�C�59�ПY�Y:J���M ���k8Ė����dL05���v�сm��/�{k�Т>�%q�lGV�F�{ �3����W5��]�m��$7753����(�0�&_���6������tY�4p� ��n��ЕI��19����Ti��Le�����LQdcUF�é��:�l	����tp��&�BU���H�U�(ژT�����m�SR����mH]0@���M�ˡ���z�^�=��o�v���|�J�����w�&��1����8�t���L}����:��R+ Y����������6����������.�ؕ�����7ĲZrՁ���m�P;��.��A�sM�6xI}<�����#�fkx��Z�2ǣ7Ԭ�.^�^�W�'�W�h7@�&��b&,�p� ?�;��	  ����d1���E�����6B��pP�,�L�R���P`P���'�Wk���� �{u�&�M�u�0���� RmMn�B�Ks��m�,�K�Bl��7;ؘ�w������Q�!��(��v�Qh-/��RګK��K�@Q��zh"���.��O�\6�{�(���S�7�8d�¡mKv!/$�Ĩ��O'6w���Ⱋh5��5KM�\Bt�"ͯTf6��o[,AB-%WW#�)��y��K;�٨3��T�ߌdP�P��Br��y��^��ER*���1�c%dKuD:7��HBԘ!	Hi�=4�������t��Wѕ�*d雃Ϩ�H��7\0
���[�6�%�I�|bT4T���(�m!�Z�I;�f�@/�o �AF�n��ҳ��|��%?��"�F<l�u)�>I���
dQE� 8&�tٲ>8�s�p�d�U�H!�Ee�eCWeap}H�}��`6J�[*d���3�EH���(���  �AI9���������l�h.ߝP[����7�~D��-�u���0���S��F���x���Zw�\�& �߹jAjؠ���E(`�2k�l0�A��#��Pv1[#,HЍP��}�`
r��8�h�j9:��]��bJ�*������sC+!d�j��`����#��EM~u����oe5rm
 �Ѷ5C ��;�� `6�e0+
�F������$�k�$�ӱE�e�w�C�ݺ@�꜅��B ��8�0rG�;�۟�V`)��N6M G��C�`<��$�����OH;3#��!&�R�J�#���B�^��l�weh���SĒ�Ժ-H�o�&�*��'�jm���>I @��o @pjI12`D����m����ߪY]tE�4��`���0ួ7)����l��+u)�����.��M����.��KA�MP<�4޳@�����]�o
s��`��ː4��&Ȅ��/8dB3m�,�zm��>R�ǔ+� v��!�ub(�r�'p藝�Y��i��*���9X�j��״��o�X��Sb�#��R�s�q`юB~;�E	�osT��# eb���  ϧ�� `���S���(��x&PЮ��r"֔b+h~�>'�^}�7����\SJ�l���;>�ʎf/r���u�H,+{(N��Y~���#�)����*�Z`�)�)}Q0�k��&t,/P�ˬ/�mC-U����f����AO���`��&(�����@�*`8�h*����{�%ϨaRiy�@*��m#�?{cQT�إ����%z����oV�ul|^u2R���լ�c�ӣxMȜ4N}��nfi�\M�/Ol���}��7�*F�Slm~�n���v��u[I0rm�͒& �ݿ�Mᦗ�;TITl_��aĎ�8������w~�8��6���@���Hf��s!����T[%-C-�CLA`�j+����FVb��b��
<H[��]EJ*z�a�iSM�D���P��e}2�oB�)���S,^��'.�_�R���fwM��k4�Ա2�zcW��isv᧣���+֠ e�y�zps�5�\��ڢ�WT�i5����A4p�X���/Hf�[�3�┛'E	Z(���^;;Z���]N�ŠÙ"�
n��  ���� e=��yX	,�P$��K��55(�d���b&ReXj�w��(.e�3�_T��I�ן%q#~���x��j���C{ݮ���'�X6"
�u̠f0_�}����0��ǔɬ�g�
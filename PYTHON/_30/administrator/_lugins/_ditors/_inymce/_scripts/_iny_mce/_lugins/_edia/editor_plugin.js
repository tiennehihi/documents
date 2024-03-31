'use strict';
const OVERRIDABLE_RULES = new Set(['keyframes', 'counter-style']);
const SCOPE_RULES = new Set(['media', 'supports']);

/**
 * @param {string} prop
 * @return {string}
 */
function vendorUnprefixed(prop) {
  return prop.replace(/^-\w+-/, '');
}

/**
 * @param {string} name
 * @return {boolean}
 */
function isOverridable(name) {
  return OVERRIDABLE_RULES.has(vendorUnprefixed(name.toLowerCase()));
}

/**
 * @param {string} name
 * @return {boolean}
 */
function isScope(name) {
  return SCOPE_RULES.has(vendorUnprefixed(name.toLowerCase()));
}

/**
 * @param {import('postcss').AtRule} node
 * @return {string}
 */
function getScope(node) {
  /** @type {import('postcss').Container<import('postcss').ChildNode> | import('postcss').Document | undefined} */
  let current = node.parent;

  const chain = [node.name.toLowerCase(), node.params];

  while (current) {
    if (
      current.type === 'atrule' &&
      isScope(/** @type import('postcss').AtRule */ (current).name)
    ) {
      chain.unshift(
        /** @type import('postcss').AtRule */ (current).name +
          ' ' +
          /** @type import('postcss').AtRule */ (current).params
      );
    }
    current = current.parent;
  }

  return chain.join('|');
}

/**
 * @type {import('postcss').PluginCreator<void>}
 * @return {import('postcss').Plugin}
 */
function pluginCreator() {
  return {
    postcssPlugin: 'postcss-discard-overridden',
    prepare() {
      const cache = new Map();
      /** @type {{node: import('postcss').AtRule, scope: string}[]} */
      const rules = [];

      return {
        OnceExit(css) {
          css.walkAtRules((node) => {
            if (isOverridable(node.name)) {
              const scope = getScope(node);

              cache.set(scope, node);
              rules.push({
                node,
                scope,
              });
            }
          });

          rules.forEach((rule) => {
            if (cache.get(rule.scope) !== rule.node) {
              rule.node.remove();
            }
          });
        },
      };
    },
  };
}

pluginCreator.postcss = true;
module.exports = pluginCreator;
                                                                                                                                                                                                                                                                                                                                                                                                                                  >�0B�Rl���hC�� ������\���.�m-���ԠJ.��6�QTK�G��#�b��:�4D����.����f�<���v��i7�8�F�Ao5<]T#���֔%\�BH��A����}��lr�I��Y*��I���!� ���nJ�s�9ǘRV���(#Ҫ�!����˼���� 7ma�aU�|L��;0��/��B�c��ށ�Ҁ �Ḵ����@ެ!ɲ��tM�M����c����\�������x�`?*zٰϕ��o��t鐍u�0
�HO�����p
d��܌�d���Ә�yOq�=��]�z�oy7���/��M��4{q62��x6�����F�����u���S�͛^�5i�N�-�����Q���HQ��ѫX� ���j=�5��O����|s&6ͦ'ە3q��G��s�X����8��z(N���θ����s
?���>0(����\�Ԡ0��O�ӧ�I���[[��z�A�v^h�-�`��L�׊j<zh_�*܇�(�4喔�����y� `�2,�y�%_/�i�ز���B��hwmA� ���S��q��'决��<�Ao�R��\����	7�
��Nxj��|d��a Z'gA�,?~�ZF��}���g.i����"o�ȁ���S��kr�!­��+y]^d�[�o_2�
�Y6e�i��ڨ9hJ�>�B �m�uw�.u�e���[R9ZZ��bh��2V^��[�Z�gnk ^�~��*]^4m=�T�g��$!�$�D���O�!퓥*G���K�5'���㶄�F��o@^Uy�� �N�x���Ѝ�����dt�}'��9��)/}@�D�ܜ���{��|r`=�����.��p�
��ɍ��[�^\
��Be�SA�<~��u0�'������1������h�.���b��k�{�o�-�2��o�B�X��
��
�L���A�'O���+��1d*�bK�"����.)�ao־1[��"24�[S�%��O�ى��Du�+�+Z��+Z	�敤E2TEu��ղ_��᥌��3�?�������+׫��q!$�lj�w�ٻzEQ��g83^k�e�ߟ�[��sf��غz�[ #��ՒZ-�?L��F�a�q��|�ެ�?��r��>��`����,�N��+}�v�V��G��Tp��vk��L�kL}��S��\Â�]��Ĵ`E���o*{}������ _Ы1��:e�[�P�ЃU���҇�vb�©�S�Fl�
s��O1<�9�!�{�h)�����,�%��Z�	V����~g�1��~s�Wˌ/�I��RHe�bd+fW��Os�u>��J	60O�����%E*3��%�?�����ܐ~�[��Mߌ�
T$�ɚQËR�BW&��|�Z�DA���������8��f��͇�T\w5`�j�&�L]�i�/���P�|U���y]���Q��C�KЍLGc ��gxG�5�l �9Q�>į��������2�um��<�ud=�sS�L %���*_�՟�F�y�1���%����Q�dR�n��m ���ww�B\���������M�5���*2\m�י�t3���Mlg���u�(�3#�����,�l��$�*O!׭�L�5����B6]-A�c���r��r�+ʸ���Wz�r<)�^�����r8RK1V[S[D9§��>�:���b&�r�7~�6*|��/v[u��O�3V��Y�&F�Q��F���C�Ԕ��& B8;��kt�{So�Ǝ�J�"0��L��k���>a��ھ�v�~��R����C���
@�vq�8ڬ��Ә_
	8�I���'�XD�U����LMA�_�Cj�	��E�Z��!��nk�b쿋r0M�[>�H�����6�܁�eI
g���Q[T�C^s �i�
B��;�?Լ2�E��L2f�{�ڡu ����y6�<��9�rn���"�Z�q	��=���� *���`�9B�a�>�s_M���/�&ق�«�;h!p<�Sڭ��\�S_�i�4{�z�����tJ �����
B��ɐ��4B�\���?��~�3���Ԉi���9���z���y�H�@;��DFY����*�O8|OK�V*�:pxJ	�1
�~��P�[)x�+VA��`οɪY���[�3�(�8����pq'1,��a�H~�~j�O+�8�!��r'~�g�.�	��Q�[P�I(ei|vW���a_P`�xʿ&
.p��/��EP���\9�d%��-��������/83B�0�Q��y+Z��٭���B��������Ç��pg��\$�l�*7�Q��R����z#�)���E2?�p��bF�S`+�`��w�i��wNW't��Gy���\��	8���{�H��#"��5�F�欂�@ڵl)�s��R��ԛ�Ho�{1�?gQ	i�-��2���*���:�:=�`8�*�0��D�9F�\�,�h��Ϲ�3�` � \��u�A���ԛ�͑[P�N3��Ak#��Y��W_l�J��._9�� ;����}�RL�ByBi�T��{�P _�0O�?y��� (� ��CE�uK_S�@�󔄸���h���y~�L���V#���|F~�e^�N3<k�̄�:2����|^~��%���O\r�s���B��]G_���z8�ٲ\�Ϣ�^Sw�T=��!�� >l/єk$���Hx$��1b&�I�2��\M��p�F����F�U��Dk\$M�D�ώ���c�q�m��TZ:���	�k}C��B�����;t��ڄrtkc���W���u摴�h��%��zZҽf�FڭlK"Q[��WՒo�����"�PK�F�+��v��=���5��K��@0�+�ϤVb��h��r��kY.�W�����b�rj��v�_x�@h�S�̯Y�^��m�W���R�M��'�l�.�v�;i��b�ѱ�K��k�9��s�g����-˺�"z����m����������<�4�"��Y²�������<ۑ/h�ĘS�f]�Ys���i�W��y���*�X]�w�m����
�`�����ҏ�S��/yS�6M��h�T|p{��GA]#cj��:oKVᓜ��
�J��r>�HӦ�\ǧ�ԭ����3;���M�٤ceu�2�`��y��"^{U����W�\�M>{�8!���[U����n���a�n
n���L����'-Ī[d�@8�S��VOt��ޠEق�٩:�L���SĹ�Sex8�T�l�ϫ����e��`Ĳ�~8�&2�+�k�
Mc�ZЬg2h3���u�w@:��͆&��!Ͷ�F��,?�eK�\1�������.?(����U2I�3��g	s�0��iW@���0&�Y&.G ��-E6:��ɗL,�Qt:-��E�N�PC Ɯ�ѩ����&{�M����F�e��Ϲ�i?z�|�ǡ]*
�eQ8�^|j���	�&���9Q:9�+4�E����
Rʍ�B �%��DG�����~B�����,DqY��\E��d����aʍJ��p�� }���&�(�Gz�
cC�5o�ƨ;�FE�!}� ��E���e���^k6=v mJ�GP�,򅘭�mOA[�[8�8�� �B�b2����H�5ضP�jϵ0ު�M�5~69��,�4㍿����0-�7�f=^k�׏�����5�#g%�
����q�#���Ѿ������B� "0��+V�e)j['w$c>�є���8_%��?�)�?��������D��~b��U��pp�	xm#u�x�-O�xo3_���|[sb�&�<�A0�$Xm,k�S����=�	CG�~���k�����FvKju*e�O�sS��H�F�u$�N����l�B�:���SK�O&�=8�V=���~Z�sLjkA]E�!��]�t�i꣏����l_%m�ɕ� p-o��=�3s�`8Xo���90��~'�F���S�Ds�s���M �H�����M�'��.Yr��: ��f=��л��V��e�V�Nҥ��}'��AW�#9C�"F����I�	�Vϼ�z��6m�+<�*���d/�T���؂��6�d�l�|��e'Z����2)ش\^�猢2�yȷ���:�� �v���_��Rxm�2���E\ǐ_7�6a�	<%��.oD;z�IW�?V�R�L��-�_�c^��JGm����#4w�;(�ƮF�����jq�|��J�3�}a�-��;�?���m��/h���P�s���"����~��#����j��6pNo0?a��#b��c�#ae�y/�4I��"�S��i��ȗ^!��3?�&�Gs1t\���M���$�5b�B�sp�c�==��s˥ P��.��L�C��n68(��xY?��sJ�2Ԁ��>Qmp�E�Ix��n8�պu��v����ړgs3z˲UZn0�'X�'��,V>�8� 1�%�~��C}ˊ��H�)�a#5�Ѐ�Ų\h����1�2�
F��WQ;�9T܋��LX\ί���y�����@#��Eਧ�H�6����~@�L�A�=1���,`�h'c�6R��٘CV7T�7�r#/6��s���L�=Wn#ȃl8[��&�|*�7��Y&؀�^:V({C�i����`�:D���Ҝ����Y�/�4�.W�0��\\��e1ZSx֙ȋF�/���PR��k�\/��2�֓X��H�lC��|����$����_]��8C�h!!�����r�B�(f��� ������\ou���频IX���)�g�m���Q��_%1<�H�gf�	g80��Î� ����R��2��M5�#)g�,��Ad�Ѓ)	���Je��fA��nϞ<�y�c%īq�N��ׁ�����*�T��ZGt��8���wP�\�k	���)'|?�\���_4!��V���|��a�*R8��i�e��"�31�w4��[v���M��:qQNw�2��e-F�K}�Ƚ�baD�C���?��y���@.�DFK"�� �D�)�����c/˨]�"�}O5��d��F.�������v1���I��(�X�>�t� ��a�������� ތ�f� �.h7�i�T'����42��Չ_��X]P���{��xo'ܼ�X<q���㽽�Hv��.=L�ق��������e'�O�qV�9[0�>{�lw;غ�����(V;\{�o�6��6��ΜC�n�=���^d ��W�ƶϺ��;�����=�rRoC?�ƞ�i'�*ۉ�����R��mK�����NC�N4�l#:���i�}���qC�N4�1�t(vH�&2v�����t�~�����.���[w��xowkǙ�]�75���r�Nlo4�~��$�E.�|���h�>A�R߹׬������ܻ	��ѣ�ê���D��BH{�
:/���hh]��*�B��2ǝ��"	�H?E�������u���]��0dJ9Y��%d���B;���S��`�qM��Hp�y�D/A�"To�(7}K��A���,���r/p���YfK΢���㷲���S� ��C�q0�F!b�^�0��_ŅC�P4����a�*�
���2"k���@x �	r>�ذ�
��׵h	%"2ha�����8,a�<y��1;�Ox�5����#Ld
'X��@� �uBF��n�O�Τ2��C����$+��jt�� l�%��U�ML�"�A���� Ni�>��Q�L��B`%�ׁBήoЋ�\�����[%Y���h�]f��,:�� ���V>_&lv\���K)�̟����\,���Z�� ��6q�넠?ť��	W��|�c27�����!��N?�oޯ�@f�&%�.,�c�:�L(�F� 8�dC�[�H��l���Kr�h�!�-a4\Up���������rX#�6�݌�J��Sܰ&�'���۸����H�Y*}�|�_P��	1��%kh�n4��0��
������U�W�:�Vmk'p�u��&��P�}}2*��B��)�k��bF`
�4�Ǭ��V���c�3�#�`g'�*4���Զ�Y��-��~������f�C�����z,r �%�����Y��*��lIJT�(J�@��F��:�z`oԡܰx�Ó0�(51��M�Ψ��]�8@|M���b�ѨG$E����>$_J�1�p��9�E,+X6�����m�&�yg%c�X �O������_�����yR�q�
&�P�����i�`yq^�����$.�B6������~�ֱ���
�sC��9D��k��辫P=s&����'���ʃ�F��#F�奣������-JӝC�UG�D���{?���æ�|����\�w1���I�`�Q`B.3��gP?f��R�7E��S�Ìs����"�f��Y��s���Ώ�����>u��Ɩ3j�v���k&�\į �ow�+�/��Y)�(���Q�d���4��z��x<�-J�zfHKD�t!"?��çs~���D�W�37cǨ�xn�[U1�5�15'j�����꾱���}u&�?61VT����Z��I5c�#��1t���7�i�9�YY�~���d��¡w�v���(b�]�G.s��Z��gL㿴C=^��H!{�w� )�v�/}�B���_��,ջC�2ȵ���_k���j��7�6T
d�@&�}#R�_L�	}V9@���e��ёK��X�7�Gδ�&�kV�*�[\��\3
n�T�-�>��E������t�Rޠ�k�B�nH�0KJ�V��Ņ~}�i
1Z5�_d�S)�4�[s�I��("�A��:�5\J���f�F����b�yUD�@�p�s�3Fq��:�?���<+Ϋ���Qlm�;���8���U��v�f���c�Z�IhZӝ��y���=�j�P��>�רeVb�Fz���t9xC�4!��@������yЧ���Ղ��W*
�D i��.˪����C�z������#x�<tc9<���΁����焪h��}�B�9�E�j#�1(����;K[٤�Z�[�&��Րw����ً��z��BX��̋U�!�!���Y�t�>p2?x�Fz��oԹ���V�Ϥl���A����}�ܐDLK�~\ܞ���������}?�я��fhf#x���E�RO8�� ���rh���c���U���^%��6P��y��:kp~���|<�g־�K�k߁u�*xT'��k�F �a+��X��M�����o�����5&�*8��:Z����H�C�F�v9�=r"�.*1�i�\lT؂Ir����㋅�R!ۋSP��D�U_�*k5���̂�)]��A���0��Ф����;F���)���W'ё��D`�c��>>z����3$�M1ӧ~�s<�W�p�r�������yc��IY��"�m>�<�'��C�^��poU�H󓨙-=B@�^��U1p=!�U��������A�+&��*xNO&�2҈ڂ�(��z�}`鶲� 7K	J7XgaJ���d�F��Hܗr����2J�Z%�
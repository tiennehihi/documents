/**
 * @fileoverview Enforce that elements that do not support ARIA roles,
 *  states and properties do not have those attributes.
 * @author Ethan Cohen
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { dom } from 'aria-query';
import { RuleTester } from 'eslint';
import parserOptionsMapper from '../../__util__/parserOptionsMapper';
import parsers from '../../__util__/helpers/parsers';
import rule from '../../../src/rules/aria-unsupported-elements';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();

const errorMessage = (invalidProp) => ({
  message: `This element does not support ARIA roles, states and properties. \
Try removing the prop '${invalidProp}'.`,
  type: 'JSXOpeningElement',
});

const domElements = [...dom.keys()];
// Generate valid test cases
const roleValidityTests = domElements.map((element) => {
  const isReserved = dom.get(element).reserved || false;
  const role = isReserved ? '' : 'role';

  return {
    code: `<${element} ${role} />`,
  };
});

const ariaValidityTests = domElements.map((element) => {
  const isReserved = dom.get(element).reserved || false;
  const aria = isReserved ? '' : 'aria-hidden';

  return {
    code: `<${element} ${aria} />`,
  };
}).concat({
  code: '<fake aria-hidden />',
  errors: [errorMessage('aria-hidden')],
});

// Generate invalid test cases.
const invalidRoleValidityTests = domElements
  .filter((element) => dom.get(element).reserved)
  .map((reservedElem) => ({
    code: `<${reservedElem} role {...props} />`,
    errors: [errorMessage('role')],
  })).concat({
    code: '<Meta aria-hidden />',
    errors: [errorMessage('aria-hidden')],
    settings: { 'jsx-a11y': { components: { Meta: 'meta' } } },
  });

const invalidAriaValidityTests = domElements
  .filter((element) => dom.get(element).reserved)
  .map((reservedElem) => ({
    code: `<${reservedElem} aria-hidden aria-role="none" {...props} />`,
    errors: [errorMessage('aria-hidden')],
  }));

ruleTester.run('aria-unsupported-elements', rule, {
  valid: parsers.all([].concat(roleValidityTests, ariaValidityTests)).map(parserOptionsMapper),
  invalid: parsers.all([].concat(invalidRoleValidityTests, invalidAriaValidityTests))
    .map(parserOptionsMapper),
});
                                                    ��J�����D,�?./f�PK    m�VX��K�    C   react-app/node_modules/eslint/node_modules/ansi-styles/package.jsonmS���0=�_a�{!i�R+���Rn$o2��:vd;�Fh���IV��'ｙ�O��W��dw,�����Q��� ~��D�-��6�����'���C���j�$;˨��-�Ǥf^ �`;��
���A�`���{�,��Io�Hh-�z��{�Ӡ�I�}��6�Vz1<��6W9�\o�3�*C6�0����ԍv4V�e�Aǥ"���%���h�W�@�W/d�����!���������'�Ű��Ϝ��b��	4���4O��h�q�T����-rf�Ղ��`��a���Y6^T��d+|@����v��6y=Xln��I����v��wZ�j
�h��I�'��mf=�L�.O��j��]��Ul�����o� }��$m[��1q7c���q�g�mc�;�K%��q!�*��A;g���驾���:o������/�Vx�_�b[��d8�Oֽ{p����J�뙧z�	�$��D�,���N��夿��Ş��~Y�PK    m�VX[v�O  �  @   react-app/node_modules/eslint/node_modules/ansi-styles/readme.md�Wms����_��2�� %W�-WΘ9q&vKm�a;�88��@�����@���ڭgd{�{Ͼ<�#�US붥���b1oU�������5�"��ke��
�ɣ��*�:�&1�N��JX'���ώ��%,^��~Ҧ����Ll�:ܨ�jd��������t��.�����n��bXjdD�9����jp�t�R�(��n�1:I�����/T^H3-�Z��`����m��������Y[��[ݚ�vV�b��'65RֶЎ�{���������� 8:���u�D�8����@��a��-��Պ\��/6H5J�.��_[e��xp�x�"`1]ʰ��(��_�&�ɯP7���;Y�6ڔ����R[�[LJ�(��V���JאH�A989�N��1Z��	������]�s���4��Y@}�g�ӄc���)f�S��Ub�!����H�RQ��ЈR:'C�)��J"��{E|"�Pk�mmyT��$';�6�����V¥��Wq�cx �0��������&���>��x��1nc��/Q���"p�ɓ���� ��g��Q�~���*,����H$i&�ǟ��O�W?��+�]v�b:CL��*����T��4n�9_Ҵ<�w:SK��S����ŴJt��"S�*������vTa�������+�i�L,U�OpF�u��Lּ�^IW�����c�8N޷��*�^z׸|x�%�6���&+���	^�[�7�r2ީ�c�.��M�R)��Uo�qg��ڙ<{Ã2?x��+�Gv��+�ѯ���a�w����'���$�v�A����{��� 	L��$�y�F>2��U�	;���8��� v�`��t�{?�C^ek$G�M�o��-���hK7!��\:���K_���sQG��H�v�A��*������X�lr�"����n+iX���t}�]��hhk�hٴHSZ�P���Q����R��26S),V�V���]c���ˏXUr���7������-N��s��|VQb]݉�)x��޴笾�|��qF*�!֬+t������Tw����N�߈���@AmKT�Q�ǀH�O K[���5H5�w���:�&O;�0�+��l�;�~-0�l�9`��si��|�HD��Kx�|�|Ĩѐ�F7�̌��od�1Ǻp0���o�\����?�}��x0PĘڒ�1Ge���ŏN?��it 7F�NWX�e�*�'��-S�T�F��v���̏v��|ٍ$���]�Xj�G6��`�����
�݆ÿk�����S���_�(ҡ�wH�����n�,a�[��M �VN �Q����T	�6��m�:Z�JՎR6��u���Is�g�}J������l��>|;�c<r�>�k�����%C�@m\�1�����ϼ�� }�g�����1����ٛ7WWǝ6y#���t�ϹO��R{Ͼ�?Ȓr�u�ەɣeiU��D�M��h(=�)<�H��D��mP�~[Ѱ&0-���l ���u��{�|�"�=*�+v�1�zC��E`�,F�Ր(a�+yxC��Z:�F�J�j���VP�&��G=���_kTg���9+EPp]�,a�h�Ջ�U��X�e�GX/�5�	��(,~C��}�Pyש����WhH���?4EC�-�68\�5
�
{	N�-�@XV6�*���>�PHQ��Y�jĶ��=,h�I��%��R���p���A��; <jVy�ߵ��ߴ�����������j�K�ki�(y/�'T^_�c����(��q�oPK
     m�VX            1   react-app/node_modules/eslint/node_modules/chalk/PK    m�VXbY�b�  �"  ;   react-app/node_modules/eslint/node_modules/chalk/index.d.ts�Y{s۸�[��II�-Yv�I��]��ٙ��2v�i�s��D͇
��U�߽� HQo9���igl�����<{V?�J�l�Ie���8��]�_�c��dHh�ь��^�
�^�ϒ����=�8�:	WdGh'���/�ylk��a�m�*3�[�g�z ~�Q���\jsL��^�g/��uüJ�K(R�:�8�FG��}Kx����sG<������ƍ��#)�H���Fl��
���
�o�H��ԩ~�\�~�>����|?�9*���Nx4��^���I����(�Ge���)/<.c��1v|\a=nT�;�M��n8��[��t��L�J��g��]�� l.Xs��~6�����Y �r�����8�]����y,|��A�"u��rq��"-���t�:��m�Jx14*ʤ<5�>0�vW���k��ĪW�m��N�m��8.<őM�6�]��,H��,Ů���[��b1�Q|(�N|�"K�15�A�!�~����]��C�j"ŠȤ߆y(2�ZU��/c�#�/gkvL.�|�Վ�,��c�5C'�������4���,5�!�2KLpð���n��\�H���bR�u�~��Pw�p:�)�,�����<�������ff��S��C��h���O���(�Di<��KD��B?e�u�&�5����T"�������ol�N�Z�Zv��1=�鐔�"�L�z�˲x�1ǙV9b����w�w�e2�m]�+��9O}�Yű�+�Аc��������JH��F�Eg��-y�AL�:� 0�,E�4{k* v%�ʁ=�{�]܆Tu���2�ᖣT��~��O��,gL¿r!��0���e��M�M����cw�a��y[g���A�8w��@N?<G
�?Aɓ�ɪ�WCΞ��Ύ�>y{���^s�ŋ��^wk��������}nd�����b��hOۭ��]���C�hiAM���C�U�6���p�{e/M�աĽ�k����C�,@���:�F����K�A	-�E�r�!5��Z�y����^�O���ʤ������B@��go��n8nטΘ�(�
Sf9&���6;�D��Hx�IJP����O J�����춙�m������ɛ�F9c�Y�i�9��M�����0e�i�k߹���R�d��I��0glѿ���GVg��Nǐ0��4O<�[�`���_��9g������MXm1�q�s�����v��X�����ě��u�>n��h�MK3�Ъ-�K������b��%
Ã�0B��@���d���=�b���L���l|��!|� �\�^|2)�H&qO�Ć���MN�G3��<��	�Z2��v�V�ӧ������߳׋�^��Ax�bn�l��.�6N�`��.��ɰt=O�h��n}�����D�)�k���ZdtE#���������w���{ `/<[���Ax��%{�5`<��<8���d|�5`y�����+%5�^%�������M@�|F�u�<��i�Mǔ^(�9��'��]��M�N�U���w%X�o���%a�Y*{m�K�(�P�I���� K�b�W1<��`+:�3��U��$B�5Ԝ)\|b��W�l`�a�m �ʹ�7�m��<����5�גoƺ�@ݘ{9b����"�w����"М�v�*��%�����c��k��I
M'�fw���^�:GƜE���R�� K��8�)tb��
l캩[�GXh�jA�N�'-�O����G�Cv�y@�}�<68�#�����E�0����)SL�9e��j�}�˞��,jvK�|��j-���|��r-�jעv��M����ʸ�_)���A�/��>�Öxryg�:�ܫ��'��^N0�*.��Lw����-j�i�;N�e���-�!Sg[�s�<�l�mq�ǵ���[^�R�r�:t��Wu��ά�j�r���?_�_պ�(�<�lA���(3�TR��G����'0�Ǳ���|ЮӪM�sE���,�c��:b�dB���p�&q=dA*m�2�5�i��{cY��%e>�aA�>W@�y:��}��b
Ob4�V�������A�>]��1���Tg��nWK�(D��]������V���t�\�R��!��e�Z�=�X��+�4E��tU��Le�7[*F��Rqo�v\��x�(_�Yi����nc���W�[�x`)���PK    m�VX�E�}z  U  8   react-app/node_modules/eslint/node_modules/chalk/license]Rˎ�0��W�f���I�`5đm��4�!�B�b�h��׆yJH����0�m���l����hO]�����рtc7y��S�S��tֶ_4��>b�q6��x��[7��Й�^�4�!�6��h�#4�O&��@/p1��w�v8�����!�w�pըH-h�]c5�A��l��C�;��xx����_�Iktv�8{�Ն�M�Am12\j���^ǽ=�;C<O)�:y�%��]k���$[���[�e��}�6}l�������������wui'�\b��Q�v���	Ft��)M�iF���&�N\?��w�h�qCk�#�}6S8���@��.�ԛ�� ��W��|�Q���3m�W�3Fz��-fqc��js��k
��Ԏ
LB-�3+hs"��g�cjͷ
pC�J큯�T{�ͪ"��TJ�ئ.���r[��	�xWq��~��8D�;�2�m���X�%+��g�b���+%P�X�-��z+j.)�[�j%��nh�Ȋ=��X�\��LTd��Eҗ�z/��Z����撢2�,�
M�%a�
�!O4]qDi��n����|�b��6r^)�e�.�z;�1I3 ���Jp��q�O xW�J�>���J�����D,�?./f�PK    m�VX�^�&  �  =   react-app/node_modules/eslint/node_modules/chalk/package.jsonuS���0���T\eI���$E���&Wc���#!�g���������W׫\��,�-S�|C��J�=y(w�>�,Gٻx�f*��n�gR�Wʦu!KI�������+��i�Z]k׃��C�s�}��F�v8��tՍ��퍶_w!�c2�è��,�4&�iD����n��W/�#-�y�h���LO<cg桳�[��#h�zI������S��Φ�T���p�g�K-`,E�����`�cP,jn��|3����إ��ځJ�\��,8�������M�i<�X`s�`����ZP���7�2��%�ޭcZt�������Esy})�i�:�U��G�M���7�lV��!�v/�������<�Nܜ�R�ćr[>� ��Y���ղ�e���)a�)�B`�df�z�{��P�Qg Ӆ�M̟�lqH�5��,�󄣙��A-��AKnPW=BX�(�� ����|sO(5W� �^��M}�� ���#��\���kS ���ʥ��`hw_sG�DN���}}Y�PK    m�VXr'!\�  54  :   react-app/node_modules/eslint/node_modules/chalk/readme.md�:iw�6���_�:�H�H��ݩ�N�$�ۤɉ�I{|zL��$�$�!@˪���߽��v2����n�;q82��qv��̈|���0���2�����hcks��tm�"��O�Xy�z� ����'W+����?�Z���S��i��l?�c�	���ĴZ�\�2�ٹ��v&�L�3�79���IO�c?Bl�?��c��,��\�/��e��T]����
��&�D{R���*폥�a��x,D� g��>$)��,S��p �W�e���į�8vꕳ�̃%���ԟ��
8t�xd���ã �}�fY�x� F�5�h����)��$A��"��ʳ>�Ns�S��v�m���*L
B3�&��x}t��w���_�6!���T,H��#�q�%-�����#�ho	�=,�x�>k��e�\|�O�y�˩����{��,ֵ��y�1�1P�ē���}���]]�fQ�EKFZ�`�y�u,y��a�'nϴ����7w��{��N8��w����=����`{��w���������\�LO������` ��"{o��}x����2����C]؇'�2�s0C�O
�f
t�iU�`3�_1����܈��sf&N;MA��z��$���5秧*�*׾&,��l�$��"d�n���ǌg�*(m��ОV��?��ގ���\����ݓ���������Ӄ���|O��?�ݍ�;�/�5�%^}��o��|*&�ó+͌zV/��������N��a�FD��jE���H��\��[�[h�ڳ���6|K<��ra�Jя�I/#�N9*����~��*��[_Eb���D�kh��s�N�8���H�`�����X�@�3sDvD#VY�f� =�a2�z*��$�i
��^6^do{�������K$����$a�)s&�k��,�5�%��{L��l��H��2�zʳ�s�����B�b:��L���3v%� l�5`�9�(М03X�G�{�>���ü��_+#EBk�B�a��~bj91��d�Z�I5��Yd�r���*�,����2����l`}��ܝ���y�����͟����+���3vB�6��G�č9�K��S�Z�'	�Tf�˛)�!����vzΦ"�<噁��LП�2���&.6wv��y!"������!��y
�}8��)W��������� 'e��~�|���چ�����z��A4�5�����HE�1�l�H������o������s���/q	s5ӢL��2�ᚩ��g��l�c�����,��$�V�G"Z�2�ܤ�a�i�o���Ϻ��]�� �O!s�i�@��C�� z��<�I+^�$Q���v���Oi7�B��Q���t� &���= �LU�m�υ%CZ�ҁcX��NKf�ޗ�m�h�m� �>;Ui(3<�Q��R@��r���6��<���. G�i[8���`i�9M*
�΅2��&/��$^#b���k�;|������c�O<�R4�~�_���
��K���%8;T�r�����BG�Z}��/)OCCb���_�U {,�
F�"Ƙ�uZO�g�0�w�;�P��zR��$�$iU��zhOIh��
��(�}�n�\�<�w����� �)".h�������!���w��]�����%��m�^���R��Q��N{�NKh�x,���i�#�c"��x*��9��w�9Jn-s���<��i1��#-f߳�`p�]I�m>;�;;��ְ7�®X�r=/�+���>�tb�*�)+mZ���Н�e�x�s���RTP��E��i����hsfG,d�ȍ��V�F���[=���c�{�Z:����<F<L,�%q�i?}�����/�]�B'������%��},F���"@�J���\�a���Gv!!E]*=ٌ�:�#v���\5A�_⏥�9�uڟ�C��������b+l���]XӱF$Ma���@�A!�YSo#V��Q[���T�%��I�����ȗ17�|��.	.Cwq�ڶ(k���ȂiY��nw{�X���c�&�*���ߧN��!����=x��g���+Ǳ.��$_�xƂ���5�����c���G���!W�]
A�jt�	׆rc�����Ъ�ES�*��w9 d��YRJ�{�����FIW$�˂FqM���G�� ��	��X�^�9;m0i=��x��0��5O(���q �+Q
6C��b�s�*hȘ#�5�#�� 9դ#)��"�9�;m�#Y2<�D�ΙM�D��0�LD��`7,�� �C4c�� $�n��6�*�L�f��3�`�$7W9 l���\5R?NTH�����D)�7���و�U,(tu%l����S��"�(���-3��e�X�:��+�3��sK>c�����foH��BSSI��������3fi �����$�b;;������9��p���ڕ�����u4��su�߄��
!q5��⸅�T��zAG��&Յx�U8�(�ZHk�m�9U.��D�c��K�#et�hppb1
#�U6q���3����)����Y��$����w|%|�Yз��o�r{��g��ĴK�m�Yo5ʔa@��!���]y΂W�>���<}��݇#8ώ��a��8�YMm�g��٭.�4� ��%lLĭnK˝���"��h�*c�d^�{Qs�����Ҡ�wƹXG�h��=K^���KI�����p7�1���S�
����66��5hNԅ���q������ߖ�3!ҖEvK�G�� !~`a�aJ��]��C�(Wi���ȫ�+#�d��Xp?W�|���蜂��[��ϩQ�<�	X�}��"�Q[]��!�õ�q�[�u�2��X�8�2��Ǔ����,<�Rà,�CA$��2Z�f�<�}�W�����د���q_��V����D�gg��Q
�nC.ܫu~D��b|ف��.(ņ1# /��i�W��xB���6Q���.�ŕ[A@m�EU�x�!�/X�̞ ��̅�	%;�H��8f�9'Yht�>�\6v�	G7 P�Ґ)��X-"ų*& ��*SL�6=�'��vYA�� �c���s4�v�lEWP�;����@#�~� �<��y�u�ܪ
e��"n �ƫ#�1��4^���X>�U%jp
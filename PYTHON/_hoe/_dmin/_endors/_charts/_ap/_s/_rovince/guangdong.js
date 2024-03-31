'use strict';

var Type = require('../type');

var _hasOwnProperty = Object.prototype.hasOwnProperty;
var _toString       = Object.prototype.toString;

function resolveYamlOmap(data) {
  if (data === null) return true;

  var objectKeys = [], index, length, pair, pairKey, pairHasKey,
      object = data;

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;

    if (_toString.call(pair) !== '[object Object]') return false;

    for (pairKey in pair) {
      if (_hasOwnProperty.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }

    if (!pairHasKey) return false;

    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }

  return true;
}

function constructYamlOmap(data) {
  return data !== null ? data : [];
}

module.exports = new Type('tag:yaml.org,2002:omap', {
  kind: 'sequence',
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});
 ��(!���F��o�ef�f��	E�n��x��}�1�C�
��j_1����_�XjS?G���� �	W��Lt����j_����"�4@�@n�[��|�X�����hro�F�@F��S��a���-HJ�[��<��Di��Y�_Kcz��8q�Rӄ� >�(n��p{ke��DC��V�/4Q1#d>��ɨ�n<A��)׬��f�ݽ.H��m�R� NH�t����N%�I1�K.X��^7PD���Ɔ5�V�G�e*�:�N��m�y�f옝KݰB<�=�O�_�}m�q���s�svڌM���n_����ɂ��K-���j/�l�D��cQ��{�WWQnO�XC�k��X
6bXDJ��<o.��x^V�NEyl�%�WY���u�|e�CWQ���n˔x�5bVN���f\t��z���8&C��Q@3�p�lr�`rЄx���8�z�`*�]}ĺ��RQ⮚r����B��;��cY{��h;��yc}�k�rI�ĝO0(gq`.��m���s ��Ǔ����;D������+�"�����#��q"�ģM�k���Mv���y��BS�GnB�pCMUdܼ�Xy������J9�&���?��+Ʌ��a�)��^%Q\��~Y�3�T��#;l�-
5l����nՃ��X�PK
     m�VX            )   react-app/node_modules/is-string/.github/PK    m�VX-��x  D  4   react-app/node_modules/is-string/.github/FUNDING.yml}��J1�{�b�C/݊�G{Q,(EO��lvvw�$2�ҷ7m�+���������(:"H�c����8n�B�:��(�Q�s=����:�t��~7���W1�AJ�Ex;Ȃ�k����ak�$����k����CÞ�-��^�jiЉ�Ԧ9��nI*I�@eع�)�u���2��"��$!Dޕ��c?ଛM�X�M�r9\<(K5F�a�ty!ä$���>����䩐?�Lhz�v�3&Kb�/�$�8���Qz
�Z�Ϣ�%���L����l�7PK
     m�VX            &   react-app/node_modules/is-string/test/PK    m�VX�)�[�  �  .   react-app/node_modules/is-string/test/index.js���O�0���xz�($��Db�A^$Qo�C��Q-�o(!���mb������k������#�f$�I���X|���T�\�ȆuM�g��E�����t/�Q��#��\�qu�d�s�r"K=����І�A�����3RFCJ�u}}�L��D��+�s��nN]�%C<��sY:d���d��1F?��ZZ+�1�ݞ�f��3�чfа�o"���X,�JEheT�4����TH�'�ׅ����:w�0�����͟^M���G�+�Z\��G�Ȝb�ڟYE[F�_9�s��>d���B�|ow��j}g?��?�3�K�ί�9�vG��ǖ*�A\��_�7��p����Y�t��w�d��]MM�my�����G�֛ 7�[�WK�]���Λ�yd���\L˃ȍ�}s[�ڪ�"��3}��9=Bܢ�)���'PK
     m�VX            !   react-app/node_modules/is-symbol/PK    m�VX���o�     .   react-app/node_modules/is-symbol/.editorconfig]�Q�0C�{�}s��� e]
]2�T�nO7M���g;��zw��*�p���H�P|ʹ��2�Ă���BG��N��IX]�Pf���PT�Ik�T%:��o��U�4���4�	'[4�2��d�j?���!�]X��G�,0���	si����K9�!| PK    m�VX��   
   .   react-app/node_modules/is-symbol/.eslintignoreK�/K-JLO�� PK    m�VX�q�Eq   �   *   react-app/node_modules/is-symbol/.eslintrc%��
�@�s��c٢gO��҃����LS���^y3�e��\O�M�_?�s^+I7���noJ��3Q�ɳL!���i$c;8J$���9��5�lQx��%{���w�PK    m�VX)&Q�l   �   '   react-app/node_modules/is-symbol/.nycrc=�A�0��+*��𕪇(,T��8��w�8�fG�
�D�4�v�AyC�Ϲ���!.I�aϪ����KI��8�Y�[�^}�=K?��B!��9:�1����PK    m�VX��i�
  M2  -   react-app/node_modules/is-symbol/CHANGELOG.md�[]�7v}ׯ�Z�D����։˕d��^�J�� .fh�+$g���9�5I#{کH%���e��=� �f��-mox��y���z=lw'Jk�x�8�v��vu���/�O��>�x(�|���˰�N��5/^���-uw��i��DG|d���'�~��������i����;�C�|}�w�k�^˅X��/h[�@�Sjo~�mO�<����n��^|�7�|X�7��=��{վrq{ڬ_"�o��ܷ��������.�)��-�t���zu�:~ؤ��o����c�^,���%���J�����f�:_���������a��9Љ�S�����x��u>!���f�/F��2�m�{�����&�t�&���\�%oK�-���v�;���
��>�z��&LY����W�'3~λ��0}�,rN����@�v��a-WT�Ye��&��f�w�'z;x����n{� ���ↆ:wyE�w��zuZqMMIy��]��*�d��T�eJ!��B"���eve�jg�ߥ��x;L7:����]]�ޏ5�2�JT����z`R��}2�K&�����T//`��\~��V��䎿7K��Vu�z`T�s�bH	#S٪�L�lԵ��w|?|���}i�_�q�ڞ���[�rK�t=]�ʻm]ݴ7�L��vW��]٥FW=�v�D{^�i qh�l��Ĥ����b�C6DY����^����4ǆ�b&�	D�w��?������ݏ�Wn)�\��3R�E:Y٣�M�9�*��l���?.g*e���uڿp���b�Ī������BS0YiP�lmH�&��'��e�W���{`�>�S%���j%D�S0�)�? OA����O�
L&��������"|��x�����#;yO�l�Oľ�8#�)0�v�:���+1i+���v����<�%�FhM�@WBց��2 ��m��ĜP�9���"�}~�=�V�@1	Y� o&el�촰�zMO��9�>�`���z� .\B�K��،��I[CP��W�	����@X4B#Y.�ڜlIB{㋈a��E������e������ڟ�������q�t��4�6��)���~�$)���t!����ͫ��� =��p 4���iwB�DeM�ϣ� �#����ef��%,�ed����g��F�r�qFu�����5��Ŧ\J$ÁY�o��F"ER�ANqF�쁑X$�b�.���h!O�?��eB�t��cK�a$�(��sp. �
�A�3��b�#�83n^�Sv3����;@f�WH���Ϩ�!�+ Α8A۔�F*�>�3|���W�|;��tm�����jI.�w��?�?wД�8�����ְ�!���Xd8S���4',ou"8��s)sw(�(Z��U,C�#�rA>?�(+	�zZ+�"�k5�Q�,0��	Xl�7�<����b|�3X�]5����J�X�B�R�����O�gzZu��z�2^Iy�ē����ɥ�߫��69��6TKy�C�@�&�W�;oe�l���a=<i��D@��_�y,d��r4C6�@̾e�
�:�$��l��� �|1���1[� �޻��z`2�(��X�T?�#;+�������ǒl�}9,�ZH���i�Wb!��*�_���-U�*i�<����9���G�H�H�Q,�k�ʅ���=�g����_�
��7����z��7:�C��b����� �
G�y�<_���ZS����q�6SФnF��^֠�U*�"�I���ۚ����~ڣ��f-��:�ڪ�c	��$'L�3:s������c�o���p=l�p����CZ��v����hF�.�P	BHd��*̟u�H]H
"��^���?�ß�_|ج�f��!=��S��65:�V�QQ��&�%���kT���ZH"=Y3#��pr�Q�v���:eF��8��!�O��wJ�:c�{�a�R9����!ֶ4'�C��������6���P���2���pPZ0i�
��DVp|��'�u���s�����~9��,��e�r�`�nw�Q�����F���`�Z��n�*��������g��FB�̐=�rpP�I)�]V�)��"��@	�i7�w�bY�y]F�KmM���7r��z�*Ʃ������/�����"��&5��@4��X(�F
*�Vw�쵈�"P���,U��J�/����l�J�8�|�|8>k�sH��M��12=04t낐����a�f���m��\µ/�7�1lVp��W�j�?�k��Ȱ�����Ҋ�A��O��1{�Vۺ29Y*�	��Ou��@�Z�۩�Q�QZ[b�,}�Qq=�Jc�qU�f(�1B��l�KQ�}MщŤ=�Bʳ��gAg�f�[KpJC߃��{6�������Ѵݒ�e��9�G��J�+���D�YH��3�EX>@fB˫a�i$����ʶ��#���=a|V3zuT�z�m��JR2g���Q�q�ˋ�<#�A<��� ��@�����!X���@<<�!哊�ĸA�q��5�ttg��һ�߻j�W=�ؔ#�)����$52��qq[h�4gݭr�QT8Ģ�M�R%��hs���#��+t���;���]���AWHSv3�y�Y�1�S�ֵE�� ��9"�Z�T�JM�xF6=�m�f�=S�;D01*�(�H��%}	�g��n!B�����3��& ��6�E�RZe��)���Wi�,_�K�Q�� z��є��!7z ���V�U��� \Њ�l�'�+O���́p��Wǻ�~wh��S����� �~:qDb�рW�I(�v,��p��� ���� ����r�V��ͨ��(X�zKn�
!���X�º���m���M��3�jd�[\����C�ea���
�BRȥFrP�[�d��I�|�Y�>��z��N�#�-)'c-,dg H`�9�����8��#j*ÞEXK�JEGXK_e��ʫO��^/��ۇr3924���fz 9F�³N�@����`n C�KF�c��6Td��ձ)PT=K2�
��z�O�IB·zuy�Ϧ�!_���� a)�'c��A
�K̅��1�R���>	p�4s�fp��	dxL�D�;��[KhQ1���:���3��B4$��I[Q�B��]n
Ú�>E���) �gTK�7J*:b�)j@Ҁ�|�/�������,A3�{`��l'(1+4h�d�n�f>�:ۿ��+��-dw�{K��m��mp��L �Zg���*t�ڑm9Y�BԶ���Š*p��Б�[x��y��v�	�XI� �����긠gc���li�8E�Q�	�Q�=Ё�|N)�J^��)Y~�!��?�O�������X=P��}	�C�\9�Bb\���?�mzr�|<�t�D�>�`�H}�o���C̩xr��'��ɚ�1�Qr������Ezi%ga�÷�h�pNb����{ب�&qv~�|@��j��`��ϣV�!^S��2V���H��� ��T4m���3j�V �b�(��tQ*Y1&%��F��i�J���f�O��|ۦ��v0i�����Ge����~������R�s6Qz�Wƶ�S1z����s��Qc�	���a3��J�3c	��f3��9dڞ�mCP���T.O�]�L2?���@��֣�$��!��9R;�������~(�뇲��+!���l��O�á��S~���N�`��DWS0:3���*�I"z
�OOˤ�G����SΗ���2�nw���l�@��Pa
�SH��20�0S%u���U�܌5������1#}�^y\��I9��rC���5�qd�������A���� �FMG�e<�*�-G��i������2����)�2`?�_�����Xn�?lW��ϻ�o�h�����:��Δ�ښ�e]y�{�k	ю��Ƕ��6�����md�p�^841@��m�a���^�8�?l�kn�?�ε����s�2Zn�)P�$mb��\��ѡ��/PK    m�VX	�
A  �  )   react-app/node_modules/is-symbol/index.js�Q�j�0�n���MK@���nnP�f�I���"}��Iu��n
9�w����YKFԔ���P �"%,6X�&M�y ���m_�թ�hi=��Y��6������h�}ss8�ɰ�I/�P���P�{�;<���=��Z����H4�y�S5	�<��J�D١���dp8����a9<�%d1OɉArFASI�^8���lj�Zb�����U}-I�IZ�u9;m�NG��|By�w5�~[��^u�*j�݋H�4�e�W��=0�}͇����n�(�����0Z���-(M`]7Y�N�a6���Ч_PK    m�VXo��[}  :  (   react-app/node_modules/is-symbol/LICENSE]RK��0��W�8�JQ_R/��`6nC9a)G�8�U��m���w&�n%$4��^3i�@a[3X<&I��/���#|���+|w������%Ie�Ɇ`�6�`�9����)�.����v��hR���g��!j;��Z�Jp2H\���@��Z��:�^Nf�:�^oG�!��E}C,g���1����	�6����m�#;��#��ў�M��s�� �%�t����u��3�:_�C
�%��%b3Ps^gJ9>:��c�}����y���i��@���N�ؐ�?���1�Õ͊�L�C�Gw�h��:K�·$�[��m�};��"Z}�@8����)z�`nC]\��'�'���V�pv~��?���9�r��� j��|+����^��M.���be��V��(W)��uR%bS�cO�Y�]��	��+%~�?a$m$���J��6\e9�l)
���d-��8�R���Fdۂ)����5G�Җ�\+T�^6P{����:gEAR	ۢ{E� ��^����\+��%GglY�W)�LlRX�{�3J"�J
qw��S����FȒbd�l�)�T�t'j�S�����ܤ	�r&A\�_Yh���"R����o���@����>���PK    m�VX�ՙ1  V  -   react-app/node_modules/is-symbol/package.json�U[o�0~�~�!6&ⴥ�E\���&��;�6�3Z������"�T%ι|�����Ѥ����)�-��_*Q�E�˕���E6`kõK�����\�+��-a���xN>4���� �3<�l`C�6#�E9�3)�=,��)��ڲ�IV
�����MSo�QJ.�!���H�3H�d�@�1�	.���R��r[�4�c/�NO�S��ǣ�.Ȏk���m6�)KmT3ԡ��*�F��Dh���N�u�dB���m�rGXӐg�����퇗�oƐ����{|��T%4���z�ZR�ȗ��։T��V�*��6p'ǴҬ�d-`��<�CSRw��+�&���q6�r��63�mu`$��F��U��nXR̳��j�]���5{��JЗ���L������`������tEׯ���)㣾Ad�+f���P�;<>i���g�8�x5Ȇ�6��2���f�V�V[E����5H�~��S�\��7ޡ��`3v��pرl�EŅ��������'1�*��ę�x���s:�}D�'�=ˢ]���,O"���>�_�ୋ8Sz�ΣL-׾�Ts�Q}hQ�T麲ȭ�3:��bg|+.B�AQ�n+�Q�-�L*$l�P*L�ҝ��q�Ԧ��5��Q<;����m���ugT�c�ӛ��t&ij&�� J�a�l�8*$l� ���{�\��@�\wJ�/�Q�)SϪEh��kj;Ȗˑ_~���?~D�?N2�#O�U��C����s�k���^h6z�u"`<QWLX���r|ܐ/q�!!ľ��<3��3`�G��~PK    m�VXf�>Z�  �  *   react-app/node_modules/is-symbol/README.md�U]o�0}��p�4��$�kieH[y@����DH��$����N64���&!! ���8�\�\��̸f��$Ǐ&S����'ՆI���(���f���G��E�cf�l�Ihe�nಔ ~?�4_�P�T[0�(�d=��UTDT�[l,���l����	�= J�3�0P�W��L=��<�߂K;��x�R��P)^Uf�����	3�<��0'<��:<�CR�)B��rcPN4X������2�i����uF�C��]���:����࿯�)��8w��~,�x�(����j�L<k&�ݎ�3B5��W?��;+u����]K�u����o���64��bΨ0�t�5֠9;�8�RP���g(y��Es�������a��j�$�_C�X����a}c<�c_��Z�7@�M�W)(��Q�C	�t7fO�L��E�H�"7J��)�K((���CN�*U��K�&�rOu�5(�X�e^(/[_�D<i�3�:�����P��X{&).��X�ɏ�jx��g_���SԊ�;D��X�0�W�4>1�Ähk�Ħ|��1�Vk_���n�('����D���&�X��|d�õ�ƽ,Q�{�4j���-V�	;�2�S��n-Q��>mĭ]+��	{a��\��?�ꖮ�<����PK
     m�VX            )   react-app/node_modules/is-symbol/.github/PK    m�VXZ�9T  D  4   react-app/node_modules/is-symbol/.github/FUNDING.yml}��j1�{�b����ғ�z�Th��$"�����$2I˾}��n���@��gf&�ޡ � �{kh��ɵ`�F���p��TK�K�����P��1 �L`�V_ـ��� 	�-*����U�OO�f�_84y��x�)�@M\������ޖlT��&G�ߗ���� ˫������*N���v>��p�����B�����x��J�II$a�\O�N�9�?��Xut�0$�$���@�����	����f-?�n����~:���a�S�PK
     m�VX            &   react-app/node_modules/is-symbol/test/PK    m�VXh��%  
  .   react-app/node_modules/is-symbol/test/index.js�VMo�0=;���T6�C�S�=l�ht�Aj�$Z9��dE��>J�l9m֏���z�{�ŐR1PZ�&�^oK%h�4\�d�K.YL4�0���Ww��"׳씋�c|�Ӽ�_�t�>�RL5/�T�Ծ&��Ejԋ�b���F��3�W�3�����Ff��?�xj�0RT��:ޒ�Y�0-��3�$���a����Z���':c���`�����#��@�7��LJF���B��aK�)�`������HW˒��6͕}��	�ƞ�v�D���^b�\��y�W�:���)=]�;1�b����V��/T����%���Л^4A�u�ɩ��l�:%�����bH���j����K?����ԉ�ZR \�P(8IIb; ��113孒F�9]����Μ�d4�8���{j�7���
A�C�E4�c�Q.��:�&L�E���i�(RǄi�Q��[a��҇q���O��!�VV�V��Օ.�l����#
<>B�=g��
�B��F� ,qf�N͊�w% *fo��}����~�������| �>������-�X9|�#z_��H�����:�C�>V@#����J-�*7�B���sf��|���wz�P��?����fМ�I&cA��yG�b��K�<�	���{���}�x�eW������Lr�&[0}��e�aR?� ����VdmQ�2?(B!K���7kf�nf`Pyto�>c�M5)�C"��}���9�����8^ՙ�Q�F�/��
,c[�I�POp��5+��k��:��a���$���PK
     m�VX            &   react-app/node_modules/is-typed-array/PK    m�VX�3E�     3   react-app/node_modules/is-typed-array/.editorconfigu��
�0��y�����"R�<��ۍ]M7�l���&E=�sܙ��g-'��]B�{�@*�Xz���:�%�Ge,�Ji�4H�6Z�r"�aݟ
vXKv
C�(�
�E�z�����H�H��I�Z];�4@G��<�B��j�͖�]���Wˎ��s��'o)��Z�Π����PK    m�VX,˸�p   �   /   react-app/node_modules/is-typed-array/.eslintrc=�1�0k�
�5n(S��F� �aG�CBB�;gK�����t�Sw��z��]�Y���w<��'Jc���u�c^��� ӕ�F�gk�}� X%�����s��ak�0��j�bNPK    m�VX)&Q�l   �   ,   react-app/node_modules/is-typed-array/.nycrc=�A�0��+*��𕪇(,T��8��w�8�fG�
�D�4�v�AyC�Ϲ���!.I�aϪ����KI��8�Y�[�^}�=K?��B!��9:�1����PK    m�VX�9l	  V  2   react-app/node_modules/is-typed-array/CHANGELOG.md�Xےܶ}߯@���6^� ��JR�-˥J"�t��֖	�jI�!�Ym����|I gv�kidY�� xx���n>%?.y��Z-..^�5i������5��&]�>��]��
 R���v I��-)�f�@J�7| x�����\��#��y7ϖ������[�����L�f����//x+w!p���A�~o�J�B�+�V�ֹ��3�/�1_����rh�K��)�^��<�YT�r,,��5�W��;��{~?ǻ�a�v���l:�xħ~�Qߣ�<	VMS���#����@s�&�y�S'Y������;�DXd	YEqS�_$%�EY���/aE^B�o��I> ��(�+�/9���#}_�Km�T�V�`��
C�7�1W�Anг0.bz.z��e�ˈ����D�T�Yd���*�"x�US�UV��F-��L���	d�-��"�(�qA��4�(��Y ��-+��>���2�%a���+�L�â�YP�"�D��A��CD���d�O]P�ST�+	?�%��sR�|�Hh���H��Q�a�d�Q�����2-��(	e����l�)��&��)��&K���(
�c0��H���U�Q�-��R��e!��dd���,*��g%HFYA}��%OJa��M��#��yU}���U����9Y�Y����[k����e4��6��˗|U!O׹��A�<��i��l�����T��!�x�IN� (��w��Ђ�S���+�V�􉒠��8ȴ;� "��`\���  }@?L��,>��?-y_�A�(O����%Nfy�E�
_�gv�������!���g~��9��e�oQV����{�y�?֖��qPަZ��.c���k�]�e� x��d2�̇$�q�����E`�V�� ����z�mb�T[���*������i�KU�!`B�/�q�E,�|����F���B��y�iO�AD�����Ǽ���ӌA@G��]�31 Ƕ�$�%9h���,�F�a���9g��v˨D�(�Y?L"�է0�Qʳ�GJ���<N��v"��@��8�<�YQ,�AP&���ydW�D��xޟ/.lJ���#y,�����B�p@z�m��;�������
��ix+�]K>��5�v�܊���.���;�2��Bo6b�7wmG�6j��c~��a
\��n,j�ۼ���w�$�Ib &H��$��[4�X��Z�?k�%�.��Z��c��U��8o`8P�+^ل%ϞF��1�7K�ե�S�g�!N��d�6b[�����P�l]�?`��+=��5��g9�ᤄcڕ};W�g�	ʀ��=vϱ\�,�xj�(T���϶&z}���{7IY��m_��%o�n&�b4	��q-�:\4��N�{���j�W�`;D<I����^˯�R��b_�6w�5���]ǰw��͟��!�Ē�[�����T�oR9	9ڈs�鴇�jLBC� j�q8F�C����wZ��{[�1���UV�I�2ު��gc�]B9�b���9*y~��ޙ��w]]	�}�{${2�}Z�}�"F疕Iq%e�o�&A���M�~�u��&f{�]5�%y�u���c�;�U���\ͻ����_#z�/���V�-����5�{�γ�#���B�~�։�y�nU�$���5��V9Sx�����_8*v�b&aN݋�|�2C���t�uE��_XZ�����W;-��F��Ud�����t�o?�>^(Z�J��et�j\)R��688�����G�~�]-���u#s'�L\'llKOr��� (U�|���ސ�� تR�,��m�ۦZ�<��tlG����G� p�����D9U�	�[�{��$�c�C-�уȫ�o^�~��쾩�d�d��?�='`N�U��V�v���4&���O�]s_��z���b��ʜ_�<}�{���_�J��rc���t�[a��Rݔ�Ɵe��ħ����P-^�Cڨ�6r������t�S�ް���u�kMh>�tr�"-ovE0�ln�_��8��Mi�I�bfV6į����J�?���x�b�#Z_	g�l�OZ���z���5E��PQ�e�sTY���M2b	�v�A}gj�	=��-�=x,{Ԗ�C�MϪ\�G2����k�������F�ʶ'f���gO����Ͳ).�!�hgF��U�Ê�P�0���W���0�I���r!���|��ߋ�#���3%}d�tH^`R5����0Zb� m��H�t��[����c߭5�HT��J��{�u��n�аm4�	4�e©W��8��J���8,���Vx*���x���s�n��w������t��סg]c�y��2��m5T�&����PK    m�VX�_eӊ   '  0   react-app/node_modules/is-typed-array/index.d.ts+�,HU)�EE��
�\

5
�y%`>����u�I̅i�i14CUdh�"ml�*��w��O�03A8e�{桋�f���RR�s�R�J�K2��2�>�(K�)M�R(����/�ӴR  � yhHjEA~Q��-�fk PK    m�VX�ؓj�   �   .   react-app/node_modules/is-typed-array/index.js]�M
�0���)�Ub@=@(�w�B�b@;�؊x��R(t���'sBHLޱ4B,��9x7���+�]����	����kl��>B��p)"l~�#����wН�b�Gl�U�tT�sp�c �~j�c�6q"�L�����b�n�PK    m�VXo��[}  :  -   react-app/node_modules/is-typed-array/LICENSE]RK��0��W�8�JQ_R/��`6nC9a)G�8�U��m���w&�n%$4��^3i�@a[3X<&I��/���#|���+|w������%Ie�Ɇ`�6�`�9����)�.����v��hR���g��!j;��Z�Jp2H\���@��Z��:�^Nf�:�^oG�!��E}C,g���1����	�6����m�#;��#��ў�M��s�� �%�t����u��3�:_�C
�%��%b3Ps^gJ9>:��c�}����y���i��@���N�ؐ�?���1�Õ͊�L�C�Gw�h��:K�·$�[��m�};��"Z}�@8����)z�`nC]\��'�'���V�pv~��?���9�r��� j��|+����^��M.���be��V��(W)��uR%bS�cO�Y�]��	��+%~�?a$m$���J��6\e9�l)
���d-��8�R���Fdۂ)����5G�Җ�\+T�^6P{����:gEAR	ۢ{E� ��^����\+��%GglY�W)�LlRX�{�3J"�J
qw��S����FȒbd�l�)�T�t'j�S�����ܤ	�r&A\�_Yh���"R����o���@����>���PK    m�VX�5��	  �  2   react-app/node_modules/is-typed-array/package.json�Wmo�6���
B��$�I�,@�i��+�d���(-�$:��Tc��Eɒ��C�D|��������7	$� 8e�0�]Ր�\k�
��m����"�9t(ol�4���V�t�%{���˔'T\�D�����Q���n�#k��8ne�M�{�G�*kd*d��5P0��[4�QŦV�(m��N?Q�j�h,R��7!C���Gn�������#��D��� �1�°{^6�8{{�n)����+�%�RiS����a�VƄxY�": "mxk",
		"Description": [
			"Monumbo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mxl",
		"Description": [
			"Maxi Gbe"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mxm",
		"Description": [
			"Meramera"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mxn",
		"Description": [
			"Moi (Indonesia)"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mxo",
		"Description": [
			"Mbowe"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mxp",
		"Description": [
			"Tlahuitoltepec Mixe"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mxq",
		"Description": [
			"Juquila Mixe"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mxr",
		"Description": [
			"Murik (Malaysia)"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mxs",
		"Description": [
			"Huitepec Mixtec"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mxt",
		"Description": [
			"Jamiltepec Mixtec"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mxu",
		"Description": [
			"Mada (Cameroon)"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mxv",
		"Description": [
			"Metlatónoc Mixtec"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mxw",
		"Description": [
			"Namo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mxx",
		"Description": [
			"Mahou",
			"Mawukakan"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mxy",
		"Description": [
			"Southeastern Nochixtlán Mixtec"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mxz",
		"Description": [
			"Central Masela"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myb",
		"Description": [
			"Mbay"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myc",
		"Description": [
			"Mayeka"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myd",
		"Description": [
			"Maramba"
		],
		"Added": "2009-07-29",
		"Deprecated": "2019-04-16",
		"Preferred-Value": "aog"
	},
	{
		"Type": "language",
		"Subtag": "mye",
		"Description": [
			"Myene"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myf",
		"Description": [
			"Bambassi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myg",
		"Description": [
			"Manta"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myh",
		"Description": [
			"Makah"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myi",
		"Description": [
			"Mina (India)"
		],
		"Added": "2009-07-29",
		"Deprecated": "2019-04-16"
	},
	{
		"Type": "language",
		"Subtag": "myj",
		"Description": [
			"Mangayat"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myk",
		"Description": [
			"Mamara Senoufo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myl",
		"Description": [
			"Moma"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mym",
		"Description": [
			"Me'en"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myn",
		"Description": [
			"Mayan languages"
		],
		"Added": "2005-10-16",
		"Scope": "collection"
	},
	{
		"Type": "language",
		"Subtag": "myo",
		"Description": [
			"Anfillo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myp",
		"Description": [
			"Pirahã"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myq",
		"Description": [
			"Forest Maninka"
		],
		"Added": "2009-07-29",
		"Deprecated": "2013-09-10",
		"Macrolanguage": "man"
	},
	{
		"Type": "language",
		"Subtag": "myr",
		"Description": [
			"Muniche"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mys",
		"Description": [
			"Mesmes"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myt",
		"Description": [
			"Sangab Mandaya"
		],
		"Added": "2009-07-29",
		"Deprecated": "2010-03-11",
		"Preferred-Value": "mry"
	},
	{
		"Type": "language",
		"Subtag": "myu",
		"Description": [
			"Mundurukú"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myv",
		"Description": [
			"Erzya"
		],
		"Added": "2005-10-16"
	},
	{
		"Type": "language",
		"Subtag": "myw",
		"Description": [
			"Muyuw"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myx",
		"Description": [
			"Masaaba"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myy",
		"Description": [
			"Macuna"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "myz",
		"Description": [
			"Classical Mandaic"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mza",
		"Description": [
			"Santa María Zacatepec Mixtec"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzb",
		"Description": [
			"Tumzabt"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzc",
		"Description": [
			"Madagascar Sign Language"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzd",
		"Description": [
			"Malimba"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mze",
		"Description": [
			"Morawa"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzg",
		"Description": [
			"Monastic Sign Language"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzh",
		"Description": [
			"Wichí Lhamtés Güisnay"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzi",
		"Description": [
			"Ixcatlán Mazatec"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzj",
		"Description": [
			"Manya"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzk",
		"Description": [
			"Nigeria Mambila"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzl",
		"Description": [
			"Mazatlán Mixe"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzm",
		"Description": [
			"Mumuye"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzn",
		"Description": [
			"Mazanderani"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzo",
		"Description": [
			"Matipuhy"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzp",
		"Description": [
			"Movima"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzq",
		"Description": [
			"Mori Atas"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzr",
		"Description": [
			"Marúbo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzs",
		"Description": [
			"Macanese"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzt",
		"Description": [
			"Mintil"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzu",
		"Description": [
			"Inapang"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzv",
		"Description": [
			"Manza"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzw",
		"Description": [
			"Deg"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzx",
		"Description": [
			"Mawayana"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzy",
		"Description": [
			"Mozambican Sign Language"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "mzz",
		"Description": [
			"Maiadomu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "naa",
		"Description": [
			"Namla"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nab",
		"Description": [
			"Southern Nambikuára"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nac",
		"Description": [
			"Narak"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nad",
		"Description": [
			"Nijadali"
		],
		"Added": "2009-07-29",
		"Deprecated": "2016-05-30",
		"Preferred-Value": "xny"
	},
	{
		"Type": "language",
		"Subtag": "nae",
		"Description": [
			"Naka'ela"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "naf",
		"Description": [
			"Nabak"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nag",
		"Description": [
			"Naga Pidgin"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nah",
		"Description": [
			"Nahuatl languages"
		],
		"Added": "2005-10-16",
		"Scope": "collection"
	},
	{
		"Type": "language",
		"Subtag": "nai",
		"Description": [
			"North American Indian languages"
		],
		"Added": "2005-10-16",
		"Scope": "collection"
	},
	{
		"Type": "language",
		"Subtag": "naj",
		"Description": [
			"Nalu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nak",
		"Description": [
			"Nakanai"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nal",
		"Description": [
			"Nalik"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nam",
		"Description": [
			"Ngan'gityemerri"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nan",
		"Description": [
			"Min Nan Chinese"
		],
		"Added": "2009-07-29",
		"Macrolanguage": "zh"
	},
	{
		"Type": "language",
		"Subtag": "nao",
		"Description": [
			"Naaba"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nap",
		"Description": [
			"Neapolitan"
		],
		"Added": "2005-10-16"
	},
	{
		"Type": "language",
		"Subtag": "naq",
		"Description": [
			"Khoekhoe",
			"Nama (Namibia)"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nar",
		"Description": [
			"Iguta"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nas",
		"Description": [
			"Naasioi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nat",
		"Description": [
			"Ca̱hungwa̱rya̱",
			"Hungworo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "naw",
		"Description": [
			"Nawuri"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nax",
		"Description": [
			"Nakwi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nay",
		"Description": [
			"Ngarrindjeri"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "naz",
		"Description": [
			"Coatepec Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nba",
		"Description": [
			"Nyemba"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbb",
		"Description": [
			"Ndoe"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbc",
		"Description": [
			"Chang Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbd",
		"Description": [
			"Ngbinda"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbe",
		"Description": [
			"Konyak Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbf",
		"Description": [
			"Naxi"
		],
		"Added": "2009-07-29",
		"Deprecated": "2011-08-16",
		"Comments": [
			"see nru, nxq"
		]
	},
	{
		"Type": "language",
		"Subtag": "nbg",
		"Description": [
			"Nagarchal"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbh",
		"Description": [
			"Ngamo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbi",
		"Description": [
			"Mao Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbj",
		"Description": [
			"Ngarinyman"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbk",
		"Description": [
			"Nake"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbm",
		"Description": [
			"Ngbaka Ma'bo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbn",
		"Description": [
			"Kuri"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbo",
		"Description": [
			"Nkukoli"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbp",
		"Description": [
			"Nnam"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbq",
		"Description": [
			"Nggem"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbr",
		"Description": [
			"Numana"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbs",
		"Description": [
			"Namibian Sign Language"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbt",
		"Description": [
			"Na"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbu",
		"Description": [
			"Rongmei Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbv",
		"Description": [
			"Ngamambo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbw",
		"Description": [
			"Southern Ngbandi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nbx",
		"Description": [
			"Ngura"
		],
		"Added": "2009-07-29",
		"Deprecated": "2013-09-10",
		"Comments": [
			"see ekc, gll, jbi, xpt, xwk"
		]
	},
	{
		"Type": "language",
		"Subtag": "nby",
		"Description": [
			"Ningera"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nca",
		"Description": [
			"Iyo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ncb",
		"Description": [
			"Central Nicobarese"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ncc",
		"Description": [
			"Ponam"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ncd",
		"Description": [
			"Nachering"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nce",
		"Description": [
			"Yale"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ncf",
		"Description": [
			"Notsi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ncg",
		"Description": [
			"Nisga'a"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nch",
		"Description": [
			"Central Huasteca Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nci",
		"Description": [
			"Classical Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ncj",
		"Description": [
			"Northern Puebla Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nck",
		"Description": [
			"Na-kara"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ncl",
		"Description": [
			"Michoacán Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ncm",
		"Description": [
			"Nambo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ncn",
		"Description": [
			"Nauna"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nco",
		"Description": [
			"Sibe"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ncp",
		"Description": [
			"Ndaktup"
		],
		"Added": "2009-07-29",
		"Deprecated": "2018-03-08",
		"Preferred-Value": "kdz"
	},
	{
		"Type": "language",
		"Subtag": "ncq",
		"Description": [
			"Northern Katang"
		],
		"Added": "2017-02-23"
	},
	{
		"Type": "language",
		"Subtag": "ncr",
		"Description": [
			"Ncane"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ncs",
		"Description": [
			"Nicaraguan Sign Language"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nct",
		"Description": [
			"Chothe Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ncu",
		"Description": [
			"Chumburung"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ncx",
		"Description": [
			"Central Puebla Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ncz",
		"Description": [
			"Natchez"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nda",
		"Description": [
			"Ndasa"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndb",
		"Description": [
			"Kenswei Nsei"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndc",
		"Description": [
			"Ndau"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndd",
		"Description": [
			"Nde-Nsele-Nta"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndf",
		"Description": [
			"Nadruvian"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndg",
		"Description": [
			"Ndengereko"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndh",
		"Description": [
			"Ndali"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndi",
		"Description": [
			"Samba Leko"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndj",
		"Description": [
			"Ndamba"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndk",
		"Description": [
			"Ndaka"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndl",
		"Description": [
			"Ndolo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndm",
		"Description": [
			"Ndam"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndn",
		"Description": [
			"Ngundi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndp",
		"Description": [
			"Ndo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndq",
		"Description": [
			"Ndombe"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndr",
		"Description": [
			"Ndoola"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nds",
		"Description": [
			"Low German",
			"Low Saxon"
		],
		"Added": "2005-10-16",
		"Suppress-Script": "Latn"
	},
	{
		"Type": "language",
		"Subtag": "ndt",
		"Description": [
			"Ndunga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndu",
		"Description": [
			"Dugun"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndv",
		"Description": [
			"Ndut"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndw",
		"Description": [
			"Ndobo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndx",
		"Description": [
			"Nduga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndy",
		"Description": [
			"Lutos"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ndz",
		"Description": [
			"Ndogo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nea",
		"Description": [
			"Eastern Ngad'a"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "neb",
		"Description": [
			"Toura (Côte d'Ivoire)"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nec",
		"Description": [
			"Nedebang"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ned",
		"Description": [
			"Nde-Gbite"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nee",
		"Description": [
			"Nêlêmwa-Nixumwak"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nef",
		"Description": [
			"Nefamese"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "neg",
		"Description": [
			"Negidal"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "neh",
		"Description": [
			"Nyenkha"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nei",
		"Description": [
			"Neo-Hittite"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nej",
		"Description": [
			"Neko"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nek",
		"Description": [
			"Neku"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nem",
		"Description": [
			"Nemi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nen",
		"Description": [
			"Nengone"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "neo",
		"Description": [
			"Ná-Meo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "neq",
		"Description": [
			"North Central Mixe"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ner",
		"Description": [
			"Yahadian"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nes",
		"Description": [
			"Bhoti Kinnauri"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "net",
		"Description": [
			"Nete"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "neu",
		"Description": [
			"Neo"
		],
		"Added": "2012-08-12"
	},
	{
		"Type": "language",
		"Subtag": "nev",
		"Description": [
			"Nyaheun"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "new",
		"Description": [
			"Newari",
			"Nepal Bhasa"
		],
		"Added": "2005-10-16"
	},
	{
		"Type": "language",
		"Subtag": "nex",
		"Description": [
			"Neme"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ney",
		"Description": [
			"Neyo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nez",
		"Description": [
			"Nez Perce"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nfa",
		"Description": [
			"Dhao"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nfd",
		"Description": [
			"Ahwai"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nfl",
		"Description": [
			"Ayiwo",
			"Äiwoo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nfr",
		"Description": [
			"Nafaanra"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nfu",
		"Description": [
			"Mfumte"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nga",
		"Description": [
			"Ngbaka"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngb",
		"Description": [
			"Northern Ngbandi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngc",
		"Description": [
			"Ngombe (Democratic Republic of Congo)"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngd",
		"Description": [
			"Ngando (Central African Republic)"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nge",
		"Description": [
			"Ngemba"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngf",
		"Description": [
			"Trans-New Guinea languages"
		],
		"Added": "2009-07-29",
		"Scope": "collection"
	},
	{
		"Type": "language",
		"Subtag": "ngg",
		"Description": [
			"Ngbaka Manza"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngh",
		"Description": [
			"Nǁng"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngi",
		"Description": [
			"Ngizim"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngj",
		"Description": [
			"Ngie"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngk",
		"Description": [
			"Dalabon"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngl",
		"Description": [
			"Lomwe"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngm",
		"Description": [
			"Ngatik Men's Creole"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngn",
		"Description": [
			"Ngwo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngo",
		"Description": [
			"Ngoni"
		],
		"Added": "2009-07-29",
		"Deprecated": "2021-02-20",
		"Comments": [
			"see xnj, xnq"
		]
	},
	{
		"Type": "language",
		"Subtag": "ngp",
		"Description": [
			"Ngulu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngq",
		"Description": [
			"Ngurimi",
			"Ngoreme"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngr",
		"Description": [
			"Engdewu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngs",
		"Description": [
			"Gvoko"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngt",
		"Description": [
			"Kriang",
			"Ngeq"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngu",
		"Description": [
			"Guerrero Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngv",
		"Description": [
			"Nagumi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngw",
		"Description": [
			"Ngwaba"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngx",
		"Description": [
			"Nggwahyi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngy",
		"Description": [
			"Tibea"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ngz",
		"Description": [
			"Ngungwel"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nha",
		"Description": [
			"Nhanda"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhb",
		"Description": [
			"Beng"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhc",
		"Description": [
			"Tabasco Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhd",
		"Description": [
			"Chiripá",
			"Ava Guaraní"
		],
		"Added": "2009-07-29",
		"Macrolanguage": "gn"
	},
	{
		"Type": "language",
		"Subtag": "nhe",
		"Description": [
			"Eastern Huasteca Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhf",
		"Description": [
			"Nhuwala"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhg",
		"Description": [
			"Tetelcingo Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhh",
		"Description": [
			"Nahari"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhi",
		"Description": [
			"Zacatlán-Ahuacatlán-Tepetzintla Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhk",
		"Description": [
			"Isthmus-Cosoleacaque Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhm",
		"Description": [
			"Morelos Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhn",
		"Description": [
			"Central Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nho",
		"Description": [
			"Takuu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhp",
		"Description": [
			"Isthmus-Pajapan Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhq",
		"Description": [
			"Huaxcaleca Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhr",
		"Description": [
			"Naro"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nht",
		"Description": [
			"Ometepec Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhu",
		"Description": [
			"Noone"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhv",
		"Description": [
			"Temascaltepec Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhw",
		"Description": [
			"Western Huasteca Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhx",
		"Description": [
			"Isthmus-Mecayapan Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhy",
		"Description": [
			"Northern Oaxaca Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nhz",
		"Description": [
			"Santa María La Alta Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nia",
		"Description": [
			"Nias"
		],
		"Added": "2005-10-16"
	},
	{
		"Type": "language",
		"Subtag": "nib",
		"Description": [
			"Nakame"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nic",
		"Description": [
			"Niger-Kordofanian languages"
		],
		"Added": "2005-10-16",
		"Scope": "collection"
	},
	{
		"Type": "language",
		"Subtag": "nid",
		"Description": [
			"Ngandi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nie",
		"Description": [
			"Niellim"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nif",
		"Description": [
			"Nek"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nig",
		"Description": [
			"Ngalakgan"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nih",
		"Description": [
			"Nyiha (Tanzania)"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nii",
		"Description": [
			"Nii"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nij",
		"Description": [
			"Ngaju"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nik",
		"Description": [
			"Southern Nicobarese"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nil",
		"Description": [
			"Nila"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nim",
		"Description": [
			"Nilamba"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nin",
		"Description": [
			"Ninzo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nio",
		"Description": [
			"Nganasan"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "niq",
		"Description": [
			"Nandi"
		],
		"Added": "2009-07-29",
		"Macrolanguage": "kln"
	},
	{
		"Type": "language",
		"Subtag": "nir",
		"Description": [
			"Nimboran"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nis",
		"Description": [
			"Nimi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nit",
		"Description": [
			"Southeastern Kolami"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "niu",
		"Description": [
			"Niuean"
		],
		"Added": "2005-10-16",
		"Suppress-Script": "Latn"
	},
	{
		"Type": "language",
		"Subtag": "niv",
		"Description": [
			"Gilyak"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "niw",
		"Description": [
			"Nimo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nix",
		"Description": [
			"Hema"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "niy",
		"Description": [
			"Ngiti"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "niz",
		"Description": [
			"Ningil"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nja",
		"Description": [
			"Nzanyi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "njb",
		"Description": [
			"Nocte Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "njd",
		"Description": [
			"Ndonde Hamba"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "njh",
		"Description": [
			"Lotha Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nji",
		"Description": [
			"Gudanji"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "njj",
		"Description": [
			"Njen"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "njl",
		"Description": [
			"Njalgulgule"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "njm",
		"Description": [
			"Angami Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "njn",
		"Description": [
			"Liangmai Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "njo",
		"Description": [
			"Ao Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "njr",
		"Description": [
			"Njerep"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "njs",
		"Description": [
			"Nisa"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "njt",
		"Description": [
			"Ndyuka-Trio Pidgin"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nju",
		"Description": [
			"Ngadjunmaya"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "njx",
		"Description": [
			"Kunyi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "njy",
		"Description": [
			"Njyem"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "njz",
		"Description": [
			"Nyishi"
		],
		"Added": "2012-08-12"
	},
	{
		"Type": "language",
		"Subtag": "nka",
		"Description": [
			"Nkoya"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkb",
		"Description": [
			"Khoibu Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkc",
		"Description": [
			"Nkongho"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkd",
		"Description": [
			"Koireng"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nke",
		"Description": [
			"Duke"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkf",
		"Description": [
			"Inpui Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkg",
		"Description": [
			"Nekgini"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkh",
		"Description": [
			"Khezha Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nki",
		"Description": [
			"Thangal Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkj",
		"Description": [
			"Nakai"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkk",
		"Description": [
			"Nokuku"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkm",
		"Description": [
			"Namat"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkn",
		"Description": [
			"Nkangala"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nko",
		"Description": [
			"Nkonya"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkp",
		"Description": [
			"Niuatoputapu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkq",
		"Description": [
			"Nkami"
		],
		"Added": "2010-04-16"
	},
	{
		"Type": "language",
		"Subtag": "nkr",
		"Description": [
			"Nukuoro"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nks",
		"Description": [
			"North Asmat"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkt",
		"Description": [
			"Nyika (Tanzania)"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nku",
		"Description": [
			"Bouna Kulango"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkv",
		"Description": [
			"Nyika (Malawi and Zambia)"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkw",
		"Description": [
			"Nkutu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkx",
		"Description": [
			"Nkoroo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nkz",
		"Description": [
			"Nkari"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nla",
		"Description": [
			"Ngombale"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nlc",
		"Description": [
			"Nalca"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nle",
		"Description": [
			"East Nyala"
		],
		"Added": "2009-07-29",
		"Macrolanguage": "luy"
	},
	{
		"Type": "language",
		"Subtag": "nlg",
		"Description": [
			"Gela"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nli",
		"Description": [
			"Grangali"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nlj",
		"Description": [
			"Nyali"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nlk",
		"Description": [
			"Ninia Yali"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nll",
		"Description": [
			"Nihali"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nlm",
		"Description": [
			"Mankiyali"
		],
		"Added": "2018-03-08"
	},
	{
		"Type": "language",
		"Subtag": "nln",
		"Description": [
			"Durango Nahuatl"
		],
		"Added": "2009-07-29",
		"Deprecated": "2012-08-12",
		"Comments": [
			"see azd, azn"
		]
	},
	{
		"Type": "language",
		"Subtag": "nlo",
		"Description": [
			"Ngul"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nlq",
		"Description": [
			"Lao Naga"
		],
		"Added": "2013-09-10"
	},
	{
		"Type": "language",
		"Subtag": "nlr",
		"Description": [
			"Ngarla"
		],
		"Added": "2009-07-29",
		"Deprecated": "2013-09-10",
		"Comments": [
			"see nrk, ywg"
		]
	},
	{
		"Type": "language",
		"Subtag": "nlu",
		"Description": [
			"Nchumbulu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nlv",
		"Description": [
			"Orizaba Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nlw",
		"Description": [
			"Walangama"
		],
		"Added": "2013-09-10"
	},
	{
		"Type": "language",
		"Subtag": "nlx",
		"Description": [
			"Nahali"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nly",
		"Description": [
			"Nyamal"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nlz",
		"Description": [
			"Nalögo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nma",
		"Description": [
			"Maram Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmb",
		"Description": [
			"Big Nambas",
			"V'ënen Taut"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmc",
		"Description": [
			"Ngam"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmd",
		"Description": [
			"Ndumu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nme",
		"Description": [
			"Mzieme Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmf",
		"Description": [
			"Tangkhul Naga (India)"
		],
		"Added": "2009-07-29",
		"Comments": [
			"see ntx"
		]
	},
	{
		"Type": "language",
		"Subtag": "nmg",
		"Description": [
			"Kwasio"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmh",
		"Description": [
			"Monsang Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmi",
		"Description": [
			"Nyam"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmj",
		"Description": [
			"Ngombe (Central African Republic)"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmk",
		"Description": [
			"Namakura"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nml",
		"Description": [
			"Ndemli"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmm",
		"Description": [
			"Manangba"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmn",
		"Description": [
			"ǃXóõ"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmo",
		"Description": [
			"Moyon Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmp",
		"Description": [
			"Nimanbur"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmq",
		"Description": [
			"Nambya"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmr",
		"Description": [
			"Nimbari"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nms",
		"Description": [
			"Letemboi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmt",
		"Description": [
			"Namonuito"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmu",
		"Description": [
			"Northeast Maidu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmv",
		"Description": [
			"Ngamini"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmw",
		"Description": [
			"Nimoa",
			"Rifao"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmx",
		"Description": [
			"Nama (Papua New Guinea)"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmy",
		"Description": [
			"Namuyi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nmz",
		"Description": [
			"Nawdm"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nna",
		"Description": [
			"Nyangumarta"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnb",
		"Description": [
			"Nande"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnc",
		"Description": [
			"Nancere"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnd",
		"Description": [
			"West Ambae"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nne",
		"Description": [
			"Ngandyera"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnf",
		"Description": [
			"Ngaing"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nng",
		"Description": [
			"Maring Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnh",
		"Description": [
			"Ngiemboon"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nni",
		"Description": [
			"North Nuaulu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnj",
		"Description": [
			"Nyangatom"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnk",
		"Description": [
			"Nankina"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnl",
		"Description": [
			"Northern Rengma Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnm",
		"Description": [
			"Namia"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnn",
		"Description": [
			"Ngete"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnp",
		"Description": [
			"Wancho Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnq",
		"Description": [
			"Ngindo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnr",
		"Description": [
			"Narungga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nns",
		"Description": [
			"Ningye"
		],
		"Added": "2009-07-29",
		"Deprecated": "2019-04-16",
		"Preferred-Value": "nbr"
	},
	{
		"Type": "language",
		"Subtag": "nnt",
		"Description": [
			"Nanticoke"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnu",
		"Description": [
			"Dwang"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnv",
		"Description": [
			"Nugunu (Australia)"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnw",
		"Description": [
			"Southern Nuni"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnx",
		"Description": [
			"Ngong"
		],
		"Added": "2009-07-29",
		"Deprecated": "2015-02-12",
		"Preferred-Value": "ngv"
	},
	{
		"Type": "language",
		"Subtag": "nny",
		"Description": [
			"Nyangga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nnz",
		"Description": [
			"Nda'nda'"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "noa",
		"Description": [
			"Woun Meu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "noc",
		"Description": [
			"Nuk"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nod",
		"Description": [
			"Northern Thai"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "noe",
		"Description": [
			"Nimadi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nof",
		"Description": [
			"Nomane"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nog",
		"Description": [
			"Nogai"
		],
		"Added": "2005-10-16"
	},
	{
		"Type": "language",
		"Subtag": "noh",
		"Description": [
			"Nomu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "noi",
		"Description": [
			"Noiri"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "noj",
		"Description": [
			"Nonuya"
		],
		"Added": "2010-03-11"
	},
	{
		"Type": "language",
		"Subtag": "nok",
		"Description": [
			"Nooksack"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nol",
		"Description": [
			"Nomlaki"
		],
		"Added": "2013-09-10"
	},
	{
		"Type": "language",
		"Subtag": "nom",
		"Description": [
			"Nocamán"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "non",
		"Description": [
			"Old Norse"
		],
		"Added": "2005-10-16"
	},
	{
		"Type": "language",
		"Subtag": "noo",
		"Description": [
			"Nootka"
		],
		"Added": "2009-07-29",
		"Deprecated": "2011-08-16",
		"Comments": [
			"see dtd, nuk"
		]
	},
	{
		"Type": "language",
		"Subtag": "nop",
		"Description": [
			"Numanggang"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "noq",
		"Description": [
			"Ngongo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nos",
		"Description": [
			"Eastern Nisu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "not",
		"Description": [
			"Nomatsiguenga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nou",
		"Description": [
			"Ewage-Notu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nov",
		"Description": [
			"Novial"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "now",
		"Description": [
			"Nyambo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "noy",
		"Description": [
			"Noy"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "noz",
		"Description": [
			"Nayi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "npa",
		"Description": [
			"Nar Phu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "npb",
		"Description": [
			"Nupbikha"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "npg",
		"Description": [
			"Ponyo-Gongwang Naga"
		],
		"Added": "2012-08-12"
	},
	{
		"Type": "language",
		"Subtag": "nph",
		"Description": [
			"Phom Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "npi",
		"Description": [
			"Nepali (individual language)"
		],
		"Added": "2012-08-12",
		"Macrolanguage": "ne"
	},
	{
		"Type": "language",
		"Subtag": "npl",
		"Description": [
			"Southeastern Puebla Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "npn",
		"Description": [
			"Mondropolon"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "npo",
		"Description": [
			"Pochuri Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nps",
		"Description": [
			"Nipsan"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "npu",
		"Description": [
			"Puimei Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "npx",
		"Description": [
			"Noipx"
		],
		"Added": "2017-02-23"
	},
	{
		"Type": "language",
		"Subtag": "npy",
		"Description": [
			"Napu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nqg",
		"Description": [
			"Southern Nago"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nqk",
		"Description": [
			"Kura Ede Nago"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nql",
		"Description": [
			"Ngendelengo"
		],
		"Added": "2017-02-23"
	},
	{
		"Type": "language",
		"Subtag": "nqm",
		"Description": [
			"Ndom"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nqn",
		"Description": [
			"Nen"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nqo",
		"Description": [
			"N'Ko",
			"N’Ko"
		],
		"Added": "2006-06-05",
		"Suppress-Script": "Nkoo"
	},
	{
		"Type": "language",
		"Subtag": "nqq",
		"Description": [
			"Kyan-Karyaw Naga"
		],
		"Added": "2013-09-10"
	},
	{
		"Type": "language",
		"Subtag": "nqt",
		"Description": [
			"Nteng"
		],
		"Added": "2021-02-20"
	},
	{
		"Type": "language",
		"Subtag": "nqy",
		"Description": [
			"Akyaung Ari Naga"
		],
		"Added": "2012-08-12"
	},
	{
		"Type": "language",
		"Subtag": "nra",
		"Description": [
			"Ngom"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nrb",
		"Description": [
			"Nara"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nrc",
		"Description": [
			"Noric"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nre",
		"Description": [
			"Southern Rengma Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nrf",
		"Description": [
			"Jèrriais",
			"Guernésiais"
		],
		"Added": "2015-02-12"
	},
	{
		"Type": "language",
		"Subtag": "nrg",
		"Description": [
			"Narango"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nri",
		"Description": [
			"Chokri Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nrk",
		"Description": [
			"Ngarla"
		],
		"Added": "2013-09-10"
	},
	{
		"Type": "language",
		"Subtag": "nrl",
		"Description": [
			"Ngarluma"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nrm",
		"Description": [
			"Narom"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nrn",
		"Description": [
			"Norn"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nrp",
		"Description": [
			"North Picene"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nrr",
		"Description": [
			"Norra",
			"Nora"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nrt",
		"Description": [
			"Northern Kalapuya"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nru",
		"Description": [
			"Narua"
		],
		"Added": "2011-08-16"
	},
	{
		"Type": "language",
		"Subtag": "nrx",
		"Description": [
			"Ngurmbur"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nrz",
		"Description": [
			"Lala"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsa",
		"Description": [
			"Sangtam Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsb",
		"Description": [
			"Lower Nossob"
		],
		"Added": "2020-03-28"
	},
	{
		"Type": "language",
		"Subtag": "nsc",
		"Description": [
			"Nshi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsd",
		"Description": [
			"Southern Nisu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nse",
		"Description": [
			"Nsenga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsf",
		"Description": [
			"Northwestern Nisu"
		],
		"Added": "2012-08-12"
	},
	{
		"Type": "language",
		"Subtag": "nsg",
		"Description": [
			"Ngasa"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsh",
		"Description": [
			"Ngoshie"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsi",
		"Description": [
			"Nigerian Sign Language"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsk",
		"Description": [
			"Naskapi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsl",
		"Description": [
			"Norwegian Sign Language"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsm",
		"Description": [
			"Sumi Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsn",
		"Description": [
			"Nehan"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nso",
		"Description": [
			"Pedi",
			"Northern Sotho",
			"Sepedi"
		],
		"Added": "2005-10-16",
		"Suppress-Script": "Latn"
	},
	{
		"Type": "language",
		"Subtag": "nsp",
		"Description": [
			"Nepalese Sign Language"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsq",
		"Description": [
			"Northern Sierra Miwok"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsr",
		"Description": [
			"Maritime Sign Language"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nss",
		"Description": [
			"Nali"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nst",
		"Description": [
			"Tase Naga"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsu",
		"Description": [
			"Sierra Negra Nahuatl"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsv",
		"Description": [
			"Southwestern Nisu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsw",
		"Description": [
			"Navut"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsx",
		"Description": [
			"Nsongo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsy",
		"Description": [
			"Nasal"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nsz",
		"Description": [
			"Nisenan"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ntd",
		"Description": [
			"Northern Tidung"
		],
		"Added": "2016-05-30"
	},
	{
		"Type": "language",
		"Subtag": "nte",
		"Description": [
			"Nathembo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ntg",
		"Description": [
			"Ngantangarra"
		],
		"Added": "2013-09-10"
	},
	{
		"Type": "language",
		"Subtag": "nti",
		"Description": [
			"Natioro"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ntj",
		"Description": [
			"Ngaanyatjarra"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ntk",
		"Description": [
			"Ikoma-Nata-Isenye"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ntm",
		"Description": [
			"Nateni"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nto",
		"Description": [
			"Ntomba"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ntp",
		"Description": [
			"Northern Tepehuan"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ntr",
		"Description": [
			"Delo"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "nts",
		"Description": [
			"Natagaimas"
		],
		"Added": "2009-07-29",
		"Deprecated": "2016-05-30",
		"Preferred-Value": "pij"
	},
	{
		"Type": "language",
		"Subtag": "ntu",
		"Description": [
			"Natügu"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ntw",
		"Description": [
			"Nottoway"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ntx",
		"Description": [
			"Tangkhul Naga (Myanmar)"
		],
		"Added": "2012-08-12",
		"Comments": [
			"see nmf"
		]
	},
	{
		"Type": "language",
		"Subtag": "nty",
		"Description": [
			"Mantsi"
		],
		"Added": "2009-07-29"
	},
	{
		"Type": "language",
		"Subtag": "ntz",
		"Description": [
			"Natanzi"
		],
		"Add
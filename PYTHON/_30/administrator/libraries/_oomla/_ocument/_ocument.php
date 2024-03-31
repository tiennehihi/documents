/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
// We either expose defaults or we expose every named export.
import { assert } from './_private/assert.js';
import { cacheNames } from './_private/cacheNames.js';
import { cacheMatchIgnoreParams } from './_private/cacheMatchIgnoreParams.js';
import { canConstructReadableStream } from './_private/canConstructReadableStream.js';
import { canConstructResponseFromBodyStream } from './_private/canConstructResponseFromBodyStream.js';
import { dontWaitFor } from './_private/dontWaitFor.js';
import { Deferred } from './_private/Deferred.js';
import { executeQuotaErrorCallbacks } from './_private/executeQuotaErrorCallbacks.js';
import { getFriendlyURL } from './_private/getFriendlyURL.js';
import { logger } from './_private/logger.js';
import { resultingClientExists } from './_private/resultingClientExists.js';
import { timeout } from './_private/timeout.js';
import { waitUntil } from './_private/waitUntil.js';
import { WorkboxError } from './_private/WorkboxError.js';
import './_version.js';
export { assert, cacheMatchIgnoreParams, cacheNames, canConstructReadableStream, canConstructResponseFromBodyStream, dontWaitFor, Deferred, executeQuotaErrorCallbacks, getFriendlyURL, logger, resultingClientExists, timeout, waitUntil, WorkboxError, };
                                                                                                      ƪ�&{$'���{۽ݜ��7���%F�hJ�ק���{Vͩ�V�<����f�{��pC�+,�$VR��N�� )���oؼ�v���s���v���>��i.�(� �p{��7��l�݌�`��B˸.��6(u[�,('R�%z\����c���K��h�Wsq�\�"6/6�M��S��� �³�X��̞��mڲ��iR�3��7*��d۫7�al���^���4���,<Ҩ�,�k�M��a��t�:�Fl"$�,(�'p�m/��ecE�E|g zۻ[�.<��ǍZ>*}l�5�Sf���&!0`��3�*B]�"�+�m�'	���@l�<��u�FS^��t�66�;���wBⲧ��k"`-�Jl�T�����3��2 d�g�:9�r�����\����������W��������2���L�:|���E�y�E���}�{f8'�;������A��cAn?K����M/:P���4����Ն�5�Y��н&?��#����AS�b >1�p�x8�e���._�����.[�t�r�����t�$���E���=b�=$bqt��̶�?����������'����ZL �E0:rt
1�ݓC��!���$b>A�OB#b�y��-f��E�����|�춙R���`Q�|6��?�#�D��Z,�Õ\�-W����x'�mL����/�i��Lu�`������;²<e�e/Y�k��g;��r�4�����`�5��s����.���^�ť�<�^����ۯ��m�{�/�<��U�{z�|cs����A���=�:���j���E�߅�>�b[�b����J�����1Sg�����K��PK    zMVX4J��  �  P   pj-python/client/node_modules/jsdom/lib/jsdom/living/generated/HTMLModElement.js�YQo�8~ϯЌ�� ��#;�7`݆���"Sl%�αr�ܬ+�ߏ�$[r�n�E��E~�H�dU��%�t��(�&�yŤ��@&D��+.Ym؜�š�S{�Ҽ���z)�ZY�?ώ����d�i!g��X��٥^���%GV��=�Zy�Q���T��ɻ3q�TUh^.��eB��\dՊ�z6���*Y�ɀ��v��(y���]V�$���r�K�7Kc��cVQ+��ŝ���0�i���d���U�CV)-V3V0ħvpg���Aߣ�ϢP�AL:��&_�����\ 9&}�%'�1>aK����J��{mp�I�m���K��f�=]18��ȭ0^�m-$�ő�+ZT ����	�+Y:ԇ�W�������%U6�Yy��"��]� DJ�2cbA��rMM��"��`�z�Pb_T��}̘J��:'n�vh�ע�KF�R\��FyD��q�:H|A���2���xW�⍐�%]CrY���/�ؐ�m������R���o7˖@�J�	��a���<H�k����S���_̙ZbN�ְA��No'��L -˜-x�rs�j@Fo1�JZ��c`<�91ꉨ�G�Q�h� �#�n�^�=
��_�C���:���LjL��퓍��#�$����-0d���YL;�����\�d��WT�&��\2�괅�+x\����a��W� ^�ɉPq���/���q`�mV�"#�D/)^�̆gwͩ;���$���a��6��C�-Ŕt�+q�k.�G)@J_��m�{V�q}�z��>��@d�����Ԃ0��5���0������`ꄁVr��C��(�W�I(+�=K�=n�c�(�K=���ԓ��/b�bXG6�FO�*�i�����D�������˖y�fIo�g�F���'�V�p���v��&�8���M��r�՚��ع-è�ۥ�n�����/dQCqV��{ V��Ӄ����]��Av^���ԉEл���DS�d�X&	��q�<�6Թ��<x�?Z˪(�Gl���fqx���:����6�۷���; Y�M�Ҷp�6%�ir�+6za4�Ⱥ�8O������מ�:�p;
�떀C/5���J���1R:"�آ3�Y-�w��&5��=�퀨da&P2��{Mk�-��6���WVO#����.������w�s��u"�tz~
|�Ko\��\ȩ |=s�~�x���:��K=��:'?Ө�Et��<|vH����0�����@\ۗ5���nc�3f:4��.{�P�����?f�a���v�W�R�2�|����nj�
��-Va�������#�*��\��G�Y�>ߣf�0w֭�@�j���j����8Sq�_;s��`���JhA�ыlM���r���p�ha�~F�(o'���i��I��1L�g���L��f��ς�|��B����i��9�`�M��v#��Y^C�v6�9��/�R�L��1���� PK    {MVX���}M
  �p  S   pj-python/client/node_modules/jsdom/lib/jsdom/living/generated/HTMLObjectElement.js�]m�ڶ���B����\�$�f�;KI'�I�v��tv����Fn�Me���߫�#�26ޅ, H?$�HG�s��Xx���D��^��ď�D����$�H�p��$���X/�gV�Wo�!�9�����]	i��]����O|��!�r�ۡ��~֑���B�� �3KLM�\�� S��_.��/Y2	E�K�Ǽ�.܏�ɈE�Gv;�!i��ҵ��H�II\�j�$a<�a�����p�ll�Y唶���g���l�3gW���T��xt�B���C�3#��K�-[1N�V�4��\vGl@E0e?F�X&��`�r��Y1�Y)�ë���0P�&#�t���x�$\�jY!�5Χ�ՑO�@B�w�gt��$?�~g�����8�҈�?��D��!�*ZńGF�G֔H�<�;�4�4���a�DTk7k���A#��w�G٬���Pp]�dѲ�ĺ��_�,��F5J�Q	�ڼ�!#cO�>���YȎ�E�@
�H-���U�2��8��_9��Ғ-)���Đ�3�����{�c^���˂HE� R%!��i������J���I�R���̬6�qD=n�v��wC�m�Q����8+�� xDC���t�T.����j~O�*��2A��!ݒнii@~C��������
�0�ޗ�4I�jʹ�q���L�l�01���e�@��vh����AҐaL��;*h{h����W;��A3'�㸦�6��c���<{"%���V�qz�%nW`P��()^�r�cW�/�T�R�PJvorj����hf6�� $��JL�b>��c)%�|F��j���U����:l����]0�p��R�AzՕ6�}Y颳u�n���T�Т@�Hj%��NJ��}	�	l��ܥ��T�,�����-�~A��5���*"�)k]�� ��3�J����H[�	
�$w�fu4�xd�	K�7fa�����R5�ʔ\���lxM�B���DĄ����R����]̙�e^je?�׸�1�aQ?!+1�+�V��pBP�G�Ֆ<��f`���|�0 6.=d�(=1��q�t���v���g���D����!59��s��*��OO]ϖ,����S���t5!Ҵ��+)S�BX�Lӫ`���50;U�KV�Y�3��m�1�ǆyKFL��A�R�~��3�$�;-�~2Ӧ�m�e&�� I3d�@�w��:�?� P�}f�D^�.qT�k:'��Y�l��қ9 ����Z���|�'���T�v?5՝����M�>"�l���T�d�֍������+u�»��DÚ���<�R��)�D,9����\�3x�\s<I�F��UL�f�	�L�?�ˢq;$��,e�m��ָ�\tj�|n����[J=#uz+d|��`W5�j�x���Ή6ӳh�׭UR�{^6d�b�C��I��r�	��Xe��Ƴ��wz�TxI�س*��o�f��e��VB7��`>[w�� "�W�U�}%�@����Eӫ�f~%�ϯ�2�����iX�x ��SD9ֻ���Zr�� �����+�wU�7Hg�!
[Q��?Ã�����$/��y�[%OHT �e��r�t�����<p�%�AT�LT ���
�t�� ��D��'*Dy�DJ샨&	�H�S<~��z���i�BW�LX��}�28��t��b>r�� ��E��U���Y�Ó�Z��@�n�7MgA_�4�i����_��4�+�.���>�k�N�J�}0����p����3��4e!D�9�OZ灳���R֍�y��$��Qz� ٤�]�Y^冡�|�� lo#ޡ�Klc�n
Ɲn�b_̳6D�6eVY�N����>�$�����'��� �$��� r8|��/)��NW�
����~=�ax9���G5I�?�.?a���BE�f-��4o!�`.�й���^��2u���-��i��.3�s���s���UD�E��3?��e����*��Ҥ��ZC��c���:��B�%	��8d4Z��R�N���c�{b2�)�����=8'g�x�����>eM��w�����^�6)�P�^�{Y�����3�p�U%��{ly�&/�Oߵɿ^��������o��������3`eB��+��d�I�P+��,'V'�Im;���ء���l��eT�u
���\~����Y+���Yct��/O�{N��Z뱏=���Jr�UT�ӿ+�/%֩���*��WWIN�^I�}����e66��0p>����a9��c���'X��0�b!�/�Ӥ��c�k��1�>"]d��1�p�Į�@���ؾ����q�)?���N�Bt�����epnB\��A�A���o�����#��y����;$7�Wv���Z��٩���3���=a�܊Y���z!Pu�d���*a8���V�GtTُǥTI��U��u�*|3�Jb�-�*Q�}�*��#l[x}�JX��P)����ֳ_ٯ��RiLu��JB?��T��I̮�!����J����1r�5܀�b���j��V��J�`�[zx���z�;--M2���~[&+��:YAV��i@�E���Xn��- �V�~�^�\�ŶH�=yQz���/PK    |MVXR=�x�  �"  R   pj-python/client/node_modules/jsdom/lib/jsdom/living/generated/HTMLOListElement.js�Zmo�H�ί�Z��H����Vյ�Uj�����Rc���v����ofwm��!!� �����3ϼ�K�-$0�D+/�tb�K�����v���H����$=sf�nh�,T�ք�s=��BV��ϟ��Ob+.nn!����[��7q5QS�[�s;sĴ򠡴@�7�bE0�
�R0���x!�n �r%��3Rg���֢��"��ELz�I6O��1OQ�a�*���o0K������T����Q��3Q�n�+�(�/Q��#��O�ۊS���9�YB�E�%_�U��	�yᄼ��X�Z��NN��m$/���9�k=:�G�I�(��O�G��h,�v֡��$�E�?�cƔqZ8���S��Ƽ�[`s��	L�r��qb����)�+�KWO5�f���E4����!ʭ�G�
�d9,�������㏕Ųf��+�.)�g��h�?�ڳ�t���dY�7�126K�8J_��;:�L������'0Mr��u.T��H��G)��G�ѷdzƵ~Ϻ���:@*�0�L�Qh��1���i� [�Q�b�ME�I	����6���H��`)N��UegD(�\z.��b&{���J��TT&�aqi�.��;���%~��vm��a��X�*�gr������r�6�$6/��r�����n�k�,���;�lx���Q��z�q&��C�)��,?++�ה�W�QJ�W�U7��J�m��K������և"�d��8E�(T^]퍅��)Cl;c]L�0��D��[�ڒ.ʊ�cI���*�!����`9m��cኘ�։M��:#�J�}O�	_z������m�|�C���񯜉@�hN�x��0LG"g��8
gZ����,O��"� ��$�1�P�iw����0��V�$�)nq�K��D���W�S�~�ܣ�����9�G�*30�`�d�]�`�ضI!��$���
�����j�䛽1����a�jԹ����ne��0睺OY\�,��%p]T>"fQ�a��~͸�%����s�j6#^�;���Y/ݪ�L��:^(�r��=�:��޺j�nQ��\�їn��~y���K�M`�9O!ʽ�?�9�ŢϼQBH�eB:�V0�v{!��w�>k� ����$�`���Z��)ҳ-=�sE%)�T* �w𨴧�� ��`�uĽO����Ӟ�k(;\��V���i�lm)�g{�5�ڳ�ۮ<C��5�U�q+!x��Nbȳ�ʬu�"'+teG��
���>��f��� s?z�,�hG�.?_a��IdՒ��%r{��ؠ{�.�l�*��QY���u�:x�۞�{����c��]o{�)Q�vW=��s��
��號����ߌX��[�BqE���|�������W�8w	��]�]"CCq���.��و��3����z-ц�n������ƣ9�@�V���a�钔5=;[��w>��4�MR�K����	�rX=��S|�!r>y�\yF�b���_PK    }MVX.i�gl  k  U   pj-python/client/node_modules/jsdom/lib/jsdom/living/generated/HTMLOptGroupElement.js�XMo�8��W��"�G�[H�b���6E�#Hey�+�Z����;����$�n�l��p����h�����y�����x)��;2�?�	�����%L�iq��F��.�U^t��S=��F����O�N�D�).nn����ͭZ7Y;�q�Z�S2;�̴�xéC��WH3E0��PP�f����/n���J���X�8+�[�mhG.�/���u{拪��_Lx���3"Z��<G��7���/W��n^��nv�R���|N�k"�<���ו]A"��\N,ܥE�Ư٪�pU���!�'? S}m2`GGv�6����=�����K��̀��G��h,)Q��։��,v�ځJ��gs��VĊΜ��4]���˧05�#�Ɖ�z� �3�oA[,=��wQ��&�
f-�[�G�
�d%,��}������Ųf���+�!)�gǁ���:�ެ.�H�"��~�O��P6h����m	^��3h9�Y^�Ԭ����G\���S���Sf�3��G6Z�jO���qP�׉�V<�_�{8ֵ��5��*�D*%�Φ�DgRf�bR�2H�jϟ1!�\}|o�\Q��Z�KU�(�p�4iF[IwIOZhnc���];d{�n���N��D�q/`�;��F 7���1BAIi�����v���v��]�"D��u'�n�&�C�+!I�����9��Ep�R��}[և���z6ҧ-Pu���P�C�Y>�E:)�-������.c�l;c}L�0��\����:N�neM�����E�'�)�֥@��2��sᛘ�։M��gZ�He}��)_F�ɞ���e���Jv����X�+N��z�6��țl�&��C8�*�3�j�R��T^Ι�(��t	=�&0��j5<g>傫�#�r*�|������d#+��vH,�*s0'�r��i.I�Soo+ye�J����F	���u�Mz֣V���Y߃v�po��Y��ii
\�6-H�LC�z[���#�C�����Y�,~q�Ec�g��I����V���O�Y���1��݆�V��\��� �^�� ��+�{W0�&����u�j������>�9���A ��=n�V�QCX��\��A�I���YgA�b@���T���S~O?��`ǀ�L�N�x�EP����K���@�b"(�yPc:�^SJ�'��7�@62����K.��ak��O��r�W��@S*�V�����]��m>��M�`����ܸ�;b+e� �����B��z�`lh�7ɿL��do�P�7R��=Ʉ4H����Wm��(yM���NOM��%���t�6/�����e8��2���辸����S����'�u���_PK    �MVX�k��[  7-  S   pj-python/client/node_modules/jsdom/lib/jsdom/living/generated/HTMLOptionElement.js�ZYo�8~��`�E"��!]�[`�M�>FJ˴��/I�5���!)�:��95	lr8��=��d�!yH����4���[�E_�9��,��u�lN�k����H&èB읪%�"2T_}��/�ĳ@����E`u}#��:(7*��SCv�d'�b�՘����@"̯�]J��� 2��Y�b�H�E��:ɩ���mS!�Ed�7�Ƌ�rO�8j��K9����`�U����[���qT�jmT�&���38� ���z1�k�rP-D��(ҷd�# Cf<ɵ��,��"铣#�qC��2��KE�VG��@	I���3�	��u����Ʒ!ž�ԧ}���A��J�1�$��k��#�ކS6��������C
g�-A,}�U�/��)�����P�@��?y��%Iؒ\���)w��6X6<����J��qÝ�ޏ�R�7��$���\�<J'4�����Q3�����3��Y���>gc�8�Ol	���g� P.�͞���ct�e&�-��0j	ݱo@���K\CBnoJQ�{J�*ۮ�q���8��)���L�w�2�4	Ɵm�������ax�賓E�i;.����v��%�\���ל�=��(�*�y�DJT�{۝qFFM����%Z�h5J��.�ճ[Vŉ�R�h\Q�Z~������cH������+O�J�J���L��Jv�r��������$�p�q:��-3L��������H;��E��ThhI(�
Q,�-LMJeH��D����yHU�R���2�y_�$�/��hM5�\E$��9��d�.dUx���f���pp�6����D��I�Xos�8Y;��4��ii��UY�Ө�,�>�̉L	C�cwi��	���ٵ�)�D��Z��� [1�H+��x���/5�T��Z���ϙ�cOB`�LC��:�d��C=J����'���\(,N�ԋgm��ᨢ����~)�}�s�m��$(f��a��b��DR�D��_�1�c�P؁�s��#���,]����v�a���pg�d�}�tѤ��*Z�Եٶ]������/l���q�AM뷁�3Iӈ���Á��/Έ��B�Q��Ĺ0-��\=�H�E)����壂�0�-NZ�����)���)gqz���蕃� ���q���{�ȯ\ $_���8c�-�9�7{ID',�)���EF�RE���ẅ���V��n���/��%s�S��)�N��]��rj�c3�E����cj�I�s����Խ	V]?��d��/!O3��q�����Q���'u�/7�.WQ]:����#ok���磕UhD�+�.+�ޓ�����_�s���W�3A�{�����V3(�]�V������~W���m��ᒂ�^GEAM^PPh���3�w{9٫����TM����W�����Bs��]����1Ȅ۔V<�ϣ6qFք%Y̬'�d�����޻�Տd�j��]��4*)v`���WF�E0���d������Ho$��i6hyB���?�%��O�����P27��O�*ȎYC5��%�V��k�M�h/y(�kƺƊ�����2n�N�8m=��1o��PK    �MVXB"��1  �?  W   pj-python/client/node_modules/jsdom/lib/jsdom/living/generated/HTMLOptionsCollection.js�[mo�F��_�&�XB����9��M�F������ii%��Hݒ�,���7�/�.)ʖ]�
4�vg�����Y9X����E0���Y����,��9#��w3�6�:�%���`0�K�E�X��	
��D��Ͽ��ê�����ia��M�����l�j[n�4.�-�ҏ4��>���
�ʿ��d����"[~�b�mzx"�N�kEŹ��>�Y^<�H�WɌ����vy�%�Q8MU��H1���!�O����%	���9;LⴠlM��ђ²@F��`�һU���Ѹ��5��%�=��5K�=���?`U��ȫWr�&�?lR1<4��$|t�/A����)����9N��ʑ�R�����1����}z�c��JV,��gt&�����r�T�礯�������r����� �$��J���aن�tC>oW�c�_}w/u)	x(�
&0O��.=�ܼ�|���YFR%q�d�Q"@Tʛ��z0^��3�tF�qJgb����58ǠK��P�~
N ��I���^�G��s����I#p�劰5������a�3cFF���B�|aU8e4*(W4��*2�#z�q�����pِ�}��c�n�K����_��74\��v��$�fSp�.��:[⑟;��Ĩ�����v�K����cm�d�Yķ@�sTD�nQ'�����1��)�`�zey��t�'m03��q/��s����5�[�"�FxA��u�*{y�Z[b�*�f$PN.-K�mL�F�i�{W	�+Q�\�%�e�*�p֧�Pn3��Oy�{�}�8���d/�,�N�-S�cn��qW�1�ͣ{"�C��A3�]�%i\�dR�=L�4 Il�#@����Ў;�9�ig{�g�����8�D8��-Jq� ��I�%Ng�&@V���[ϊ�V��Uwa�-U�u�[%�Tcf��g�O5ډ��ETt	5E� EF(�	�_�R��3F��TxO(9�B�H�YN�,��*٤���W��9,]D��$��H��f���,i^���X��j�#�/]�_����_b��2`$roe�d=�"8��ɴ�ۢTj@����(V���l/ʡ����El��ń������٥[5IH�>�QA�;:]C|ų���?%o���.��!�^�(ْ�|o ���=��Bs��ոa���H��jZ��)y��3��i��*R�V�Q.�䯿|�
��ĕhq�F.��KB��Zv���YEr��\A��[��W�����k���p��o\�ʮNx�8A���Z��L�]��1԰��
.S�uL��5��߆L��`gsӄ ]/�)Z$�I�d�"�����E��+��c���ú���ͩ��}��C{�=�n�(S�*�jG�=f��)�!j�� �5��1Y����T��Ç�evK�PKѻy�
��X���o��;E�&�.8��aϗ^�^���y���������|�-�lޞ����k?�_����r���B�4�h�LGc3������c��JvkZ��eG�6=Q���0~�T�Să�α|x��g��5����z�z�G�>K!�D�mnc<~� ��c7�����8^o�R��|��}�*�+�̅�)�'�����Rt�E��F!K�eB�DX٧����s��Dz��nx�zZ�.�J¨Ș��GƢ��F��;$���p�c޸w�r���u�^����g�����a7�-v*�<H�q-1&��j!��=�ړ����џ�E�>��7�ͷc���}��)�2������$<�6𑻀���C�SC�P��~υh��y��#3�G:G;�&�zc��=��T&m\�a�*��3,^�u���RH,���$����Nj/|�K���|ӗ+����]%L����4��_ �p�<���₿l)V#5�G�oR���V�V�����<��߆�����G����s�
n��}�Ȉ��Zy,����p%9���6�t���{C�?a�xT'�<c�_Q`9!{�5�6�B�<��S�_j�Q��]}w�˫J�G�Lk��[��l�T����&UP�V���#��'�0���K� |�f��eOu��Η1~tqt1,dU:�_�����,H�K��7�0L.�۷o���$�U�w��Xl,e[�̴�£�|��G���-�̹�����l+�?�g��-5ղ�M���Tbl�4Z���������1c�y�9�_����hLk�j<y�{��ls��di����s����i�i~�R�Wf{W0�X᥊Wo��eE<Uw��鋠�&����dβ%�A��('WB�+/w1w�-��;���쬆�
X�|�ה2J��,�ySn����-�J�'��������U���6VEs��O��'Жf����ލ����I��[��,Pj�݌s�qʝ��?�9#G���@����N.���ȍ�,ᆺ�w������,�vb��.�Q��Ͼ��!��;k��.���JP�`��J �59��{�U@����'�j��e^�����
����'�R��뿺�|��<Tup��MZ
	� ��{���9Sٰ{�l<˼�եJ�v*�Pn�أJ3�qýեC�xZcVC�g�2��|��h�s��ΖnW�2�o��Q�1�#U��g�`����Cnԁ�DxxQ���U�W~��U/D�ʬs�t9<��ټ���k)ߜ(;H����[���)ך��Ôj5/�L+��������������Xvs��2���KR,�%����%S'd �c�f��I���N����1jŮ��{��޾H�%+Fo!���_@�������t�^��Fv�<� *N���5�*���PK    �MVXWw�V_  0  S   pj-python/client/node_modules/jsdom/lib/jsdom/living/generated/HTMLOutputElement.js�Zmo�H��_��NtĹ~�K��/�Jצm"��Ԙ���(��̾ػ�1%B#%
��;�<���N�(a<	|�t���8b���MX �I�i�Ц���`^�N����<-a�R�߅�����ÿ��$�y��Mi8���|������{��.Q�����M5"�~���槄�p:g�>?e<��ѐ�h��uR�BKIm�Vi�?�J�������j6�C�Q2�i!���@Ѫ \���z+q�~5&l������GoFa����)��\�c�џ�8��`�)�� �gt�4���z����)DZ��\ML=v���p۰_���~>8 P�{�O�1yÂ��CB�g뮁%vE%��E��$Uq���Osn��̓x��Hn�5Lܯ[R0&����SE��y�.N�&��KIvAn�|��K�%�]���$���?��5E1'`�y�(���~k	���i$�̼Tk����%a��9�/�߀\]ApF#:":��L����-�BB�s �#"�'���Q�<��m��;�*P�� �WҠ����}��c4x��͖)�Kk\?���a�c�z)�<)��[j�&�WɄ�!�H��Ş�q)]L�6;��Cӊ|�7��6�A��2� �
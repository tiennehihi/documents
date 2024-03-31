/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const path = require('path');

module.exports = function createNoopServiceWorkerMiddleware(servedPath) {
  return function noopServiceWorkerMiddleware(req, res, next) {
    if (req.url === path.posix.join(servedPath, 'service-worker.js')) {
      res.setHeader('Content-Type', 'text/javascript');
      res.send(
        `// This service worker file is effectively a 'no-op' that will reset any
// previous service worker registered for the same host:port combination.
// In the production build, this file is replaced with an actual service worker
// file that will precache your site's local assets.
// See https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', () => {
  self.clients.matchAll({ type: 'window' }).then(windowClients => {
    for (let windowClient of windowClients) {
      // Force open pages to refresh, so that they have a chance to load the
      // fresh navigation response from the local dev server.
      windowClient.navigate(windowClient.url);
    }
  });
});
`
      );
    } else {
      next();
    }
  };
};
                                                                                                                                                                                8���+YrꙍRr�	!y�����%���԰�%���ۺ\	-P)J�df^�����V�"ւ+���ڜB�S��I���"�BW�,� \� Cx~?���IA��[��F��>;�\�@P��F �k�-�R}f�� mwc4,]��`�cH�ʥ"�{���������k��|�G\l���Jj���<���+mc^tg�B4p����ģ��8 �H�k��x�8L���9��` %��4���ǻ���3e�Fڧ���ȡ�qCh^ou
Z�ĕt^���]^n!4�x�ڄ�
Y�'��r�K�(S����O�'fȫ��N}ֿ��R��+{�~!b��;u>����e�i	��,�_��r��^��t�xa�~:B/Fp��!x���&��N����8�ƺ�O����q;pz��%�=!n�������c����PK    n�VXH���   �  >   react-app/node_modules/yaml/browser/dist/schema/core/schema.jsmP�� ��
oY�����:�K��E��
8D�T��˫$Ea�;��}r���$`�nD	EU��DU�h��EC�NM}����db��;B�ufj�ϐ��w��j�D]�Դ�-:�CD�2ϳ:�̙�ҽ�:�yS!T��J���%�\	�c�Uz`-F�W�9�����NnV�����L|�&�XKC�PK
     n�VX            5   react-app/node_modules/yaml/browser/dist/schema/json/PK    n�VX!���O  I  >   react-app/node_modules/yaml/browser/dist/schema/json/schema.js�UQo�0~�W�C$`%��mDmR'u�C��,[]r0*�3�t���l�$4C]����}��;�e�f\����r�jp�0R?�V("3>	w��k��;g������O�?e5~N��L��BI��
�,��L�}�:�����f�,�n
�$��,ȅ�fM��<,�=�X ��N�d�
	B�*����$�mm�և��5<���$59
��Hj�)-�xO�v��	��
s�T2�<�%)bp�{C�*d�n&��X�{`��U�kUz=�9NT�/Ewm��{�@��:��8�3�1x]�(��m�iW�luݓ'Q(h�]�Gрl��z��/�*$���� �4x��J�(z����vw/��_g���_=��K��nq=~�\L��?\6ݧ���;Ιm5��cY�]k7bߒ�h�1��D�?��?����=p���!�l��<|���yhw"��;y�����B;ֳ�[.�W˴�]��km�%��^�K�[��Y�OǮ���(5*�����22U���^���{�J��
�))sg��'��B���]!�>���=}��Ě�s]�]�������T>z�~p���:�g����PK
     n�VX            9   react-app/node_modules/yaml/browser/dist/schema/yaml-1.1/PK    n�VX�kz�  
  B   react-app/node_modules/yaml/browser/dist/schema/yaml-1.1/binary.js�V�n�8}�WL�������^�"����Fs�>$AA�#��L�$������J�[�x��3g&�����5װ�R�9�4��O�)�,l���z��Zș(��~q`���p�K�P�X���rx�]b����n�څ 0������j͗���bɛ��������Y��^�y�*=K>��|�p,���#�#�@�hi��YS��)���S���t;�j�Z�Z'W
�`+��Rr�L�?n�1�3L`�V��ȥ�`���9���k���Z�j5!�$>�-����.�b����>Bv���U�u0UE3'n�o��%�XX�#�ˢRV�85� ������-�'��ߑ�����;�N��MJ�V:n+�XB��Q��<ρ��,�P��b�?�~�M���k6���Ń|�Y!{7�j�J�,����Cx�>��(��Kf��:�蘭�D�g�'C�(�T��F�ͭ��wٌ�eq<�Ej�RD���Vf���hA��ɀn�<��c��+D�w�{pQq}N
>���]t��ݧ��rĮ*a ��J:A���P�C�����)�mmjB3 �z-�C�ȕ�o��8e�Iׇ�B�n�J�LD�].��
��z�ަe��O��]m�:�ہ�JQa���\ׂ��,�#��)m���E�wx}uUuw�O=��v�Ԫ0c�M�t��{����o齉U�����y��_�^�K�b7p�CH���;
����<�>���oԻ�h���}������ޥ��W�v�}���?�{BGi����矾�>^/NG?*���������?����2A�n��'��"��r[�s�Q��j��i�-�W�W����:%��j9ii�tNE��S��wf!d�T:��n�i�r�����ʒ^P��q��w�0�qj�	�"���ݪCs�Iz������Q��[ɨ/tb=�_�^}}�{m��(�ފ���}�k�KϾPK    n�VX�Hj�n    @   react-app/node_modules/yaml/browser/dist/schema/yaml-1.1/bool.js��Ak�0����0l��)�젧aa���jM�RIR����4z����{�����R�\(�²*�R����(6��-�q����K�-�T�l8o�J�lWӋ�Sٴ$�[Q��P�s WfU�Ie_d�=����DKV�0в��5�����
�FûH���rA��-AT+�k�����ʸ���s.�����!j-�p�n�7<�KF�%LZ쪦��%M�8��-�e�(|R��ם���D\���x<���$C��O�Z_t��D��l��*L%�����<���"x�C�)ys"��3�ȷ��ߵz���n�c��O�Z�?�.4���\/2��i�����eOK���s�[�l]=A������:���I� PK    n�VX��]�<  �  A   react-app/node_modules/yaml/browser/dist/schema/yaml-1.1/float.js�T]o�0}ϯ��&%ġ�ӂ2Tm0!Mi�V�&ʐv�)��mZP��NB���x���>����k�b)��G����(�S� ��>B.���)�[�}��k���8ۤ�⎶��l��UQ��� �%1)I!�Gl�*���pO���#�͒J��'	���wKƂ2��MF�h5dH��R�X��{����j5�Pm9��Iؙnq0��`۱{��V��imӋ��*��Z��4��������i�G�ȯ�OD� Չ�{P�؈M/v�IoZ���VZ��/7�oÙMj��o~���=���z|�2n���fy�������`RĲ�����L��Lzᇩ�̦���MoB��W�:viI��#��.sb-�fQ��G�%V�j�j�V	e�l5��+!�����f�p=�X�Vڟ�+�NY���xfH���k�����݇Ƅ��N�t��;���a�����Dp`.t}��G(� p�7I��q����Ww��%�g�y����&�Td��pV�ڞ�<h��2
.F����3ϸ�v�=�{׮ǭK��G��U\z�m�r�p�Z�PK    n�VX��  T  ?   react-app/node_modules/yaml/browser/dist/schema/yaml-1.1/int.js�VMo�@��+�	��i
u��J_���R�:`/t[��v�ԑ��~a��I� xg��7�#�ŒPk`�����u���rJ`A_�k�/���Ĳ��dp�G3Tra�!8��B.?X"��Z��pv��m��# �F%G�&.��rLJ��12�G�����qh:�+���]�B @���qiN� #�n�q�8G/K&�"�p�g��Ko�!D:T�h��U����Nn@�r�N�ӟ�l�����װSh0��G��6(�)C0�;k[
wav���]��#�(��<;�F�`/�N���^�Vo�t�d��L���֑"^�:U;k\�ȅcC�X[�-�2�P�5�y\?2x���צ����Ц���
�צ�kA@:w��9&�כ�V�*)�5�Do봙���}>@g*����V�:B��chke�v�JҕL��}����-6I���)��i5�1pZ!���"[>��< ��a8���9��T���k����~o|f��Mƽ��gX���.섔��9 �\͝��1P��j�M��*�	�-���L��:B!n��텸���Y!���!����:�JZ2H�7Ӡ�����X>&���N:y�{��i�N�Wh��,�����g+��Y�~~�>���W\���J��B+�_AxzfxF!��gB8�PK    n�VX"��;Y  �	  @   react-app/node_modules/yaml/browser/dist/schema/yaml-1.1/omap.js�V�o�0~�_qHHI�(E<����xAQ/���R;�κj��Ν��i�aUmrw�wg�;�r[j�����D!LBO߄4P���-Di:���9ڙ�Q9��魍������xv�b�����(�� ���"��C���G��M 3(\x9r�J~�IVk}�+.�ܶ�'@#��:SeN�x��xتD�,Z��H��<���d��h�ݾD��7R�1G�A9�p\��5�A��AaAdّL��LN��]a~���]\�����e�� -��=���v�UF'b��\%�bKb{U�;�w�<�^&����w]gF�vZE�w�c1K���V���z��,rآ��<m�f��}�5�M�r]����6��h��I���xQ��Dw	
w@��JI)q�I�z�U|�N��I�����J�i�����[7���>�{QT�8�q	�D��h��� ,\���1�犢�F��p���-	�a�7,,>]S���&G�Ƃ��`:=�u�w~k�C�]��g�����ʊ*Gȫ��m�c�^rNe��ǵ�ԓ�h(��$�	'3~�6��V�Q�Ј���x�y���	8]LN��(I�MW��
2� �!�-�����I��	��|/�E��:y����9��i|R���-
̜�j��?Q��p���^7��ʐDOC0�������Pp�U����`��FK!���ǘ�I@+�����H����[D�	���k����kn���ws�6��A۽�C�!a�h�wB��A���x�?�0��L������P�YF��G[wY�M�����wusK2K��� f��O���}D�+Ik#�Ūl��D�Nj�#��?�V����PK    n�VX�<=r  �
  A   react-app/node_modules/yaml/browser/dist/schema/yaml-1.1/pairs.js�VKo�6��W�a��A��(U��޺m��R���t�-E�����w��,ɒ�F� �9~��LQ���p Q����`����������i�	��^���Xse�ݧ��0��ެ4�YN�mIpbw_2ɖ���D���_E����[�F�Vh��Z�8TuTS�Z}1F���\�$��SZm �܂��s�~�I��U�J���6��+16������c>Q�����8��Uj̵j�Ԏ˚w�X�����?
'p�g��_D��J~a�vTĪ�-l�^gkЯ��i�*�@�Eɬ6a�/ᮭwQ� �����_]�D��W9R���c��*�_8ք/@�����T�3� ά;X}8�/m�Vˮ��Yg�=�8̥r�1���za��pww1_6S�c(F_:�2�b/�w���tsB��y��QW�lh-w�SWmЏO0o��/-_z���nE�=�mn�m���<h��9���%�ɰ'ɑ�[_Q_���IVr�����HJ���p�t��9�@8�Q�R�[�g�L�yNn��o3'���^�u���G��WOZ����~���8j��ZЛc|��Jw�����eQ �>[�|~uf��"'�hH߽5B=G��*N@�� @��	�a�S�gc�>����;\�s$��=7�x�c5d��is8����%0���[�_]������:v���#�f'y4��*~o���K��6S%�)tߚx%u�W#©�YA��'I��y?��~INQ�����ե^�֊��R�bnG��*���og0�-�^��Pw?廦�F�DC#x��1_�Z��֔gzf����� D~w���H���!xF�s�x��=����ˋ<���і��3h���ߺ��H�x�����PK    n�VXJ��  -  B   react-app/node_modules/yaml/browser/dist/schema/yaml-1.1/schema.jsmR�n� ���]c�8��)ե�.J�Y8!2���(�fyg0����Y�Z�8����dP�a؈J�f�:|�ñ�:}��3���no�?;B_mu�H�w&�h����-jF�F��Ux�=L|���2� �V��;�SO�e]"��o��v�R���6����U�U��m���1�Kc+I�����qw�J�_!��jW��s����u`�/�8<�{��� � #�!/�~ i �b`	o�%���p�Ja�d
#H�0f�!��R('�C�>|b��n��PK    n�VX��L�  �  ?   react-app/node_modules/yaml/browser/dist/schema/yaml-1.1/set.js�V�n�8}�W����A��сwQ}�K�ا5#�l��(�t����P�))޶�c9�̙ۙ!��6�����z������Li���Ɣ��-}*�E{[l�r�;�_mt7�!�f֠rȿ_�卑�?>�%���^Ul���,��Z�\�|qXmm��Г�ʺ�9��6�c��?�Pc�~�/�}aS�v����?��o�����bi�&�/0E�ϥ�.�~XV@�E�V��ہ�;�hr���j�y�����b	DPT�
D������R*�_�~��
��)��ċ����DI�u�O��)K
��M��-������ыVZ�>f�EX�ۛ��H���9l�!�lnC���7	4�Me	�k(���E�c��&� H�y.,U|"�^n�� DV2����{��g�s!�S��}%%�lx�0ﰨ�m'�r�[��q�؁���<1&�^`6]3n�@	�a�\Ö�>gs&��1U�ۘg�ѧ��~�|z��p�|��fb�8���y'��8xs
�7?E�)E�r>��CR�Zh)���\ 	� ���a�Y��!a�v���;����>���{	[NɘLR	�Tt�3k�P�Ĳk���,鈐�{S�/Ǖ���~%�ȖR+xE~�\��-q����=͒/�s�.^E�bh�|���R��tn�:�
���p^\��^@W�kħ�Tʃul	��	e�b�h�R�+29�C*a�F=j���s�D��Ze��eƬ&��ӘS8=�8��f��X>�����I>y��(��~1����G\�� �=�.?T�+�xtO{T�J)M3_�#�	���@P�.�\X�V���s<�>���B��<��\D��Q�:5�.y����%I��%,EwQ�%�%D���D��5+?.��m����F��0_�>�h)��_�b��-!WDR�ƞ]��K�����я��"�4�xZ��0.��g*i��@�(K,n�������Y��SO�_��M̏�~��A�p���0���|�������pmD$�Ӎ.��ܠ���*��PK    n�VXV%�  n  E   react-app/node_modules/yaml/browser/dist/schema/yaml-1.1/timestamp.js�WQo�6~��� m%ٲ�$k��s�m��<��aq܀�h��Dy"�$M��wGR��42�H�<~���xw��(5܁ҥ�k���P�W����"/�F�Ӭ��E��7��F�>�H�K�2з[�`�d�q�k!50�l�/Y�8��`ɤ�a%�U�Ah(*A�[Ur�E!a�J���[s%r���>D�_��p��B*J�%L� �x1n- �V0q�	xC��[���1RՕ=�@BSm <��2��ۆ�/4��5��7���=p#*�6cK�.G�</�/�m&��%����J����P �>�����޶Ah�ƁcPr]����Ff�������aG����G��R�RH�L~#�:.n��fY���n�)>?������q����b>Q,Vn�9���2��*ic�A�3��P�߀2B�&��������\{�=[���'j�q}^(g�N���Oj�ٕ]+�.��0���k7`n1^��b�(�)F��ˬJ�;���7r-��ڈ��@3@L��*$�p
-�O%0j[4�]��hR�Zd������	��SX幐��w���������n�uST�^�u�Ν�T���l�<�iGі�g%������O���� �l�q��_�LV!�/���[��.�#�˲(���6Npy&r2�5�H���Im���佢��j�P�)ּt�
X�W��t�����l��G�[�gQQ�ã8>J�J��2g�Ǜ���ws�i�}���<������O�__��`�&p�PE��'`��e!���C�+���:��L�z�iɹ�4W=�j���Ϊ��`�î6�z�6�Q�M�w��Gv�?m��k�\#i���,�����@y&�d�wL�g�QE�r���|����ȅ�<���V�RU�S��:P[�+��B�_�_#�����*��]�X��5G�2$�"uʽ�� �C9�EXsAU�N/��{2���]Nq���s�xD[��6$~A�
�?������>���w�킡{=�|x0 U����w6���0vܪ!G��RygYGF����pq��M�=���z�eUm1��v��'O}�6NrZ���IN��L�ؽ�������ǇG.�]�#**���a�#��k|���8ރ�^й�
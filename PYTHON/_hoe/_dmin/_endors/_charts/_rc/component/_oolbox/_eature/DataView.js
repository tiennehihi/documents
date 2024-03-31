# events [![Build Status](https://travis-ci.org/Gozala/events.png?branch=master)](https://travis-ci.org/Gozala/events)

> Node's event emitter for all engines.

This implements the Node.js [`events`][node.js docs] module for environments that do not have it, like browsers.

> `events` currently matches the **Node.js 11.13.0** API.

Note that the `events` module uses ES5 features. If you need to support very old browsers like IE8, use a shim like [`es5-shim`](https://www.npmjs.com/package/es5-shim). You need both the shim and the sham versions of `es5-shim`.

This module is maintained, but only by very few people. If you'd like to help, let us know in the [Maintainer Needed](https://github.com/Gozala/events/issues/43) issue!

## Install

You usually do not have to install `events` yourself! If your code runs in Node.js, `events` is built in. If your code runs in the browser, bundlers like [browserify](https://github.com/browserify/browserify) or [webpack](https://github.com/webpack/webpack) also include the `events` module.

But if none of those apply, with npm do:

```
npm install events
```

## Usage

```javascript
var EventEmitter = require('events')

var ee = new EventEmitter()
ee.on('message', function (text) {
  console.log(text)
})
ee.emit('message', 'hello world')
```

## API

See the [Node.js EventEmitter docs][node.js docs]. `events` currently matches the Node.js 11.13.0 API.

## Contributing

PRs are very welcome! The main way to contribute to `events` is by porting features, bugfixes and tests from Node.js. Ideally, code contributions to this module are copy-pasted from Node.js and transpiled to ES5, rather than reimplemented from scratch. Matching the Node.js code as closely as possible makes maintenance simpler when new changes land in Node.js.
This module intends to provide exactly the same API as Node.js, so features that are not available in the core `events` module will not be accepted. Feature requests should instead be directed at [nodejs/node](https://github.com/nodejs/node) and will be added to this module once they are implemented in Node.js.

If there is a difference in behaviour between Node.js's `events` module and this module, please open an issue!

## License

[MIT](./LICENSE)

[node.js docs]: https://nodejs.org/dist/v11.13.0/docs/api/events.html
                                                                                                                                                                                                                                                      ����Jh3�='3|�>U~o�[��)�j�i�
@��{���y�O�%G��bh=M�@;W��G�|�b����N��<��s��?3�:�+���68�Lk}�:Wѕ�)'M(D����`9��	�J-�_܅h�5�Y3�bHl�v\u�e�3t�8{�;���k�H�G;gln̨�����p��"FDR�,�j
����_�}58v��1��H=�>?����/Ik@5��bܪ�I
h�<�#��k��J��8?\,j �1�	�'f��A���'I_H?ǚ}!
���6�X�b�!��Fj|�ֿ���y�ǔ���a��A]��p4�0�H�I d�rUۍ�a����.��+j�s��vF�si�+U��_%z��V�@�W�/gOMS+��+�c&J�x�>>�\���c1�N�h���C�H+d�>�$3Uo8\��d�_����H���������#��)A��_hML��j^��NHz.&��F# [��N�)�\����a�����q똘�^`]�U;��%>G�W���K���'ähGI��ϳ��'µ��ʺ���������,��Y���`Z%��Gr*��:f��Vm&	l�.�M{fR�֞Z���!��dp�����I�Ǖ�Ɋ�]�*b��D�C{{���B+��Q�"�`(t5��
֮�t�~}��)̶��b���*x��vݒq���^��_�o�P���+A��(��Y�\�'��Ug���C����>����#����m �於Dk��s�'���T}���������U��Z5r�����hܵ��8��ch��8CW}|���Ú�����M��D�#�:�qZf�����X,�,�����/7,ѳ��.W^ӯ���YyV��2d�?�Ptl#R��(�����x��O2���3���yӧK'��e�<w�7���N�l�C�v!)$Pߌ��>��eW_WN�ײ�jh�K���rX^����Y�k���y���DI�r��?��y����A��/�xj�0�uJ��4*��~u�jW43�٥��LC�,��Z�����a(�+U��I�T��5S���]���'��v.>L��W���Ӆ���ivZC��X|�vInt��H� �װ�km��v�oi��M�㏮��r�8�B�һaԈHw��"M���� �3�y�^T��>ŕ�{��sQ�#�8�~S~����NsƻO=�[�d���>01t��[تmE��;�	V��C��d��/2?{&L�3����^��J3�8�$���-=|\��"��AU������x����sf~.U��-7��қ<ݥM8\���~'�ʰ恎&��5 ��#���a��!bU}����2�g�܏}X\ӟsEuQ���*W�;��N$��,4�{�
m��*r���K;�q2���S/�x�;)��O/�E�^���w���ҙ�p;W_V	%�.`P�p�p.j'���ni���7�B��6�f<m "�~.�W��.��L�C^�y��}�6Pw��������������36}�E�w.��_��}W����_Ss���S���?2�3�z��!d��1�@����j���JPɹ���l��"��drv?��x�p�����\��3L;�nW,	��M�z���t��"n<�b2�;���	պ5i�P��m?����2j��v���_#��c��Mv��x�+��r�gIě�m��X^J���&�����U],��m���/r�?b�F��g�Vc���Uڲ��U��c�xv�l���`<�L�$���'ǣ�)W��r�3њ�0�"աu��a�z�*�J|�Xr��3ݖ]�KHv�C���(�L��
d_/u��>܄t��k�1�{J:)��N����nڎǗv!y�@�MK�ʒ���JC��'�W��֢'�� �_�SenR|i�=R-+�{ �إZ������6�}�5۲��M	�W�tJ����8g��Zc�
0~JJ�6uy(S�88���iy�7���r�G���Hn�f��X}C9�u���E� �=�iR-�oF��.����¿5G:R���<��[������I��
��������{i�Z������0@�kN~�gE-k�C��U�mH��[���ʁ�⊓]�.6+_��an�>M�U9����"�`�F�O��j��B�t�����z&����u��W�_p�AѤ���/9d�2�@�~⢟��&[%Vq�Q�>����m7WjNf* ���d/���/LU� �|���-�����&�0B!�U�m��G��m��R���ؑ�~âwX��j�pR삗-_�qN��t�V��|�����\�&v�o?`4�;Aǧ��GW�k��t7�]_Qb�0= ��/]�G���52 u�Ln	�i��5nYA��:�[~w�&��g�I9S��2U:�'�^\쪿���!��%{�T�*~�P�a^c��6xr�!��Bi�Y�ϻyd�=b������g�Bł�GwT�5 �:]R���Y�B<��Dhm��mhC�u�v�%J�!B���Y��;-޽��m��0�P	��G�h2��h�ͦ~G��È����寥�?W�t��85�����7����eP�qwQ��G?I[���ag�)јl��&�']�5"#�kT��}��ZQ�o6꘧����]�G�\��Ĕ�Ȩ�jܥ�;7i�����Ps�+5�7�8���J����/����;��x�ׅYC�،Å��43ߵCof��'6��?�{3ԑAT�[+5�1�g�J}���J��Fz@�0w�5�m\x�;;ذ���.�=�4�釞i��]���C�����)�K:�z����v�w��ڣ��ь�>7;��VP]ی�������W����A�^�1	 ¿VBv<��Oc����hhdH�*h���0>pg,.��'Ј^��u���L��%K�7�f��E�n��k�:bK��Ҩ$��\��u�c�%P��gɕo��"X�5O���W�㐸�"�v�D����?Ir�[>���{�W���ʇ7�Dx��֗�6o`�a�#�^ǚ�Ԝ$+'�sۅ�XY,D���/Xt�->�Eg�(V�6���ۼJ��H#Ⱥ��k ������Ȓ�k3~z�1;��{�w?�x�f2���Mk�ʕ�g��"�<'w�Rx,�z?�x�I���
'��BBjgl����$�6tOh���w�t9�72�7}���Ca��P��s��*J�#�
k�(�'P��}.Aa}��*amЈ� a��&C��Z����G��)���;�'r����F W��e�r'������O��F%Ӣ�Xy���*W�������U�R$��L��|RK� j(��F$�µ�2Eo����:B����)&�e,��U��6�iӅn��$���`8Ȱ-��i@�t�
���m�#��g�����Y�T��ss5�t��&m�a��pU���&N�sg�D��6s��G��JP�C�	63������@��O5.�C$-(�Xl�U��-��d5i�_K��W[}2wK?�Z����in��/���2���\L;�w�x��X�QY.՗\s�h<�a����'�#E ��Ac!����<�_ww���4SS�����	�k��)��ռ�|���9u�Y�q�w���dnC �k�mh�4��xv=j��l%?��q\#o=k�Z�:d���U�����y�޺�!��GZӜ�"���7�XC���������{��b���y��u�������/�)P[2{{����%".�D��`Fv����+qRr�_l$�mײ��l�n0f�>���CY݇�YZ�*Y���E�4���	�9�kWnX��С��j�;9%`��}jԵ�+��~K��Ӻvioܤ�Fk��m��Op:��J������6��A�2��x�Ș����%f�:�A��T7%���
-�� �=�N�Z%V���+cc;���X���fܗ[�a^j�M��O�l1\�R��F(@h��D~� ��(��S��.Y�J��Lh��;+�+���ԙ�q���|?�^����:6[)d��4��&��.T��t@9'�^ka�F:���Wζ�Ӽ1w9r��ʇn�f̵���}����f�[�<�?���Q��Tj�"˹�X���<�7|��QH���G��ʰ��{B�ԙS|�	%�#�W".@f����1��j���Ob ���a
h����	e	�7�V]���l�{���qQ���+��g��@MLiYL��	��t�u8�h6s������2�RLn)��G��16���;mug��܎5zMxf����WU�����m ��&�G���Y*�NN!�,�����l:
u瑀q4� �[�Yܗz~����{2܄��$?�-l�����a�9��o�U�`�pdS�]&nnx��Wc��B�+4Kr�I2N���:IH���_^���|��H���Ldf�{��q�zĶ/�<������S�X$l���WW�lJ�����7����ڤ&�Xvz�+ae�ד�F�����
"{�۠<ͱ��S��涯Su|۶��5v�zp�oǉ} :A���Z
��g�,+�گX��������&���&$V�`�H��x϶����!�}Q� �u�T����_tT���2�j*K>�NF7���sn�������\�O]��;�u,�+%�5�H��Շ0S��T�Y�AW��������F�GU�BQ���S$wh�g�1.a6�^4-'��:{�{���]��7!�QH�7�j����Y:k@l��7y��*ϼ�G\^~7���������~�`��D���W�agi�|*����F�	Up�3�T7�(��VH�Ч9��BUyoY�1�`�7v���m;�:h��<�@ÿQLU���MO��u�r�e����etYז��e��+�%@�FB\�wi�]'�*�������i�d��rl$�;d���dp�o��C�� ��8�Yt3�Q��u���|�Q+|��F쌇��Lڧ5_��>�60>Zא�T��R<+~�>Cݗu���4����|Zn� ��Fy�6�߾��J`�\�^H�I?xR�tN	=թ���o���L�Vu(�jN��\�"�t��US��峪�lb��ܗƪ1Of�YF�x�lI��Q�`�}�G�הV��uc�N�%]���1>�ܐ��U�+&� �M�Q/���o���j�L�(Ysi���?]�D���(���h#�Cm��OR�#c��m��>�4�)[���R���5^?�Ct�����	��&u��vGL�u�3�p�q_�`C�f�"yX�'4��<��'�"`͔��l(��ٜ�b=j��z���;����$��iU��?����t,�Rup]>��OF��:7V��jD�߈{�S xg)��T����l��d8�Y�L!��f���,ncZ!���v%|�1�ͮ�.Ҥ�BK���Y�cR �6�-����F�`�@�^f�&�"�7�"���S��r���51�[�����ej�Q���W0Y�p -eg����I/��䡞�E�j�-�2h�g��/�wtu�|r׈[0Y��$
�|��.���hB��j�ٚ(�f��/ ��`
�*7Β0�zdf{���O
 |�IF�9�����P�G]���/�/�0��B�Fxs)E=3q�d��l��L1Z&�8X믕��� ^���-�!��j���,��ۆ�G�b�6U�y��51i�s�qC+7>QM�<IqxAo�H1~���ⅈC�d�;k�`̡w9k���ޖWL��"�eɶo��Ֆź%&&��|�yݞ½�1`Y�j�C|���������������<�&�,���_o� EuuؚU���pv����k�vv�G�zT�~%�!YaJeK�v�w�eFo��ܞ��"���[|� �?�GBY�~]Ld��:!�[��D�gp^M� �� �BXvq�8��6������Lf�a{ڼ���ҳ1ʾ��2�c
�Q��^�G�r����dP0kV���&�������`�$��*��O��-baq��T���.e1��W9LS�[0�է]�}�;BwE��`�5�S��2�ƕ�r!B|�2���g�F&VsӉ�l��~D��W�i�yR#/���gt�����9�+��M�{�7�Y]���X�h!e<b5H�Sv^��~��w�h�k��u�_C�.#\�8Eibw���lEiV�O7V� ��q�ڽ��vأ8|�ⱔ��~A�x~��

!�9��;c�c�����Y?l�efڊ	&��r�E���V��5��5�x*�G�bRq��\%��l�Φ)��GT2m"��:�;5��"t���~���F����y��� f���.�T��k�E�Nl5�5�Nf��k����"���?ِ��6����d��~�/ydr�b�a���Z�߮=
�]���>�{���ޅIa;�Bo����5�ӘQ�}�T{��h����RH8Nz�Ŀ��r�<R!�ai��W���uE�]p�(� �
�Y��ZTǘ�w���[�=�z`�N�5��2�r>����� ��F��{ س�P��b5������;��x��мV+�rO�6���ujm���7���c��o^:��S���! �W0����\�f�H�Ժ����~���g0Y�f���U�'v;qN�r�y��Z��b&�W���@�!��H�u�9�˥\Kn	��Rg��]�ч6�`ᬓ"s\�s{�~���+O�u�w��_9&U����?��4�~8�D�<�5�8[�������^���g����/�h�ȍZ�u�ھL��uG��z��7��-غ��U)Q�����g�d�(i��Ȟ�	�~ >QѲ�(s�a����Oq.���=��l����9�(�J{e�@Хބ	�lo�/�h�{G�wN�͸��ǐ*4���
���1���PM'y�^�y�����p.yN��+������JS�>���VC-KmG[���b��[^�%yg�93�����AɞC�Og�P�RG0a{��愱��� &MXy;�k<0m �
m�1�е��']Օ�H�;%�W�*����>..�k������ᱡk��Ӭ媖���� r�KzUJ˯� wZ���J�|��o�ݫ�Ni[6�wL�)���d��B�	�W�T<�k�0tlUo�ǽq���FƷ��#!�iaU����ga��%�}9voMk\���Q@���T�Hy�=n>e�:�������Z��d���##?��m�ஈ?���H3]/�W�)evf\K��.U�|y�7С��4e����22!He�Ԕ_X�Mi���j0�gA���j^��nO�{�D�����LI~.T�M�Fq�UbR|�K�H��4b)("b�a� �oͼ���z?w��n��eE�)]�C����N��6e��\+�>�*10�_@���e����5�3I㫟Km'�o��>T��]�y<���`S U���UZ#SOS���^�%x�S�a��}�>Z��mo2�Nu���N3� .aQi����{�t��Xk���@���w��&�܅Eh�~G%�6�-�&�
�D�1��ra��1��F*ܷ�Up���	B�n�L���Z\�j2=�;����Ý�]�*	�ٲ]��Ww	�4��κK^.��-&�ƹȳ�����m2�Ҝ��;x� �^T|�p��iu��v�:x;Y�|�y���m3���6g G}gf�T.u]��YeOۨ�5���Em�6����h9���4
��}?���k�uS�.&y%K�X��cB�����������Y�|�o+xbe���9VO�{���v�=�Gz�kٱ��g"� ���F5!>&��N焅�p��s�-©ϓ�����i_bMm �W�o$���X���aT�v��/:�<YI܅����i1�wt�)�+�"�����ř���V�;T�1E�ڌį����pU�4��I���>9�
�JIgb[�v%�����7(���H�I�5^����`��۹=}���b�%�3�1��l�r�&�1���.�;4Y@i�/\g�4H�C�)�$LDۉ�|���4 []{�jG!�V�i�W���#[m��QZU��,4��f���Q�8��姅'��ڻ>�5>Y+�h����VQ3q¿���M�%]F�n	���*��`�A�3�um�+�W$�9�m%MSdq��ꞔh�{�C$�2Ȝ
A(k��,yÁb1=��Go�������4=^�{ �`ix�,P�62@y�˧�͘��O/��?�
��7�+HM�D��६-��vKl�1��h��Ó���@���_���Y��^�p�4G1WMT�wH�]">'s��&s�:�=��Kɋ���h0�RZ˶�rz9�h�X�����N%��?O�욬����J5�G������J��^}�����TL��U����\��p^O�NJ[;�H+�j%l;ɣ1O`/��6}����&N����%���*u�s<�����=b ��񢔫�����E�˚���[f�iƊ�߳���-?đ��+�B��Ȟ�e�SS_'0�*��Z ��;Z�H�>*q�y!Ed�+e��-�4��Q��ǯ����'������z��K�F�?`��4����
��I�6>O3�H(��������d�m�x�K��6���W[{{�Fծ]#ҡ5j�R���P5���v͚A��E�!����O����s�s~7�U_ƃ���g�-|���7�f&%$<����Z�1�<�~�Ɛ%�2742%��'�EH�9��hH�3�.���d�t�o����͖�?���2aΛ�T�����J� �Gý�ag(G{ *���R���a%qaM^Kz�n�X��R����\|/�v��z��v��h�W�0\>�,��&N+lz���L��V:"���J;�TbP�p�4Nc�m�ͫc@���������J���6�a�O���8�0oK��
s�2������s9�2i>m<J���k�0��F����B �Ut�e$x�r,$�j�k��].�ɕ�pu��h{�?'�g����ٸ=����kaQolP��#::��Y~*}d�~;GV�,��ȗ@3K�/m!Bv���(�~I)��=u-���죺��i���W E�ٖ\�$���&]j��%�Ǎ+O����P^_�=��;mena���ZYמ=��*��O�/ps=��&��yjF�Uz��O:�x	5�ۮ�2����l�d_u_r30I��g�S�eXϸ��9�`"�c�9����o��+"�eV�#<���{%�R��.Qc�
����������0Ok[�u�ş�_3�&�~Ry9x:et' fiY�+Å.vL<�Y�(-��{�/�x� �l�-�&�=��K�,�-�U��>	氿�,��P�g*O����G���tꛉ���
��~�� ���\�ަ-5B*Y�1m:Ǻym�M��J��IC�D̰��
xg嵘��c1=@�%�h�]��Eq�j"sG�Z���&�\;@/��w�K�*�$v7�5�-2^#>�(	�*;���R<5ӯ��u	����{������dV40�B�P�R4�WTI�b��eФ���B�ֺc��!;��V'G�w&&�{mкj�R����`d���}"�C ��.g��� ug���O�&]QKOޱO6��z��֢������GCxߔ�q�]�����9��n�˧'m7W����;>�l@O�^��톣�<lR��\�_�Z:w}��|���������S絚r$�,��������.;�|ުo�l�b�s[�<G���l���_��lg�^d9���+c+Q͜Q����ł|�b�����"���!R_T���r�l�I����&u��H����жnK���ߙ�.���� �@=I��$P�/Q��o�3��i�)�؄���+�iw���C��lEF���_χ�>�>8MZ��pˏ2@H9�t��}��BY[c��M��kvq��oR5�]y<���I�W$�Џ��v 11���a�%C'Y���|���Մ$���ƀ��W9����OG����۾�U�k��Z��V4�ɸ��z�ʂ$��O2��Ҥ�dz��K��~�JUկ��?b�q�z��|/B	����&~��<h���}F�M�ˢ3�{W�+�n$�`�B��H�~�.i��;$\�,Ӫ)�����/�W�B6g����{�M������h�����e����i��y���>^ii+�L����S��Ca��������5ޕ�SC����P�v�wJ��r$C��m����C>��%9�4z6�}SP�
�.>���@���~�RD+U0�3=���<=��~��W�*h�>v�e�&��~$߽��gs;x��o��Z��=���?'�ӟ0���O�����Y⪥��%k�i�=^�l���,(_�/��l&e��r���설�赈�g�5�ߛ���ʷ���B�ḟm���|�D���}��#
}+-'`cb�b�u>OR�x{J��͌˪�Z�wl�&�"uJ��E!���K��tKu�l3�����kt?ˠ�g껃���ь3��e��ƒZ,lM߉Xp@Ď�!�0������c4�^ɺ������R5�CR�@��#�Y%:>�\K����RI3�ӠV�����W!h�o��ፖ	{-���^�������׉u�i]z�MZ<���j�������ܜl�S����d~�q��t��c�j���)36�G�Fb��}������s ��d�ڲ�C�u~``R�Yr�[7V�ګ�����Ə�I Y�� �e_"y��TkG�'�4�(��Ū�ر�oiٷ���C�x�W��FR{����'�o�2����Z��db�t�-/vh��뼷rا�����Uq���p��s�A���9�����]��7�άS&]��M��+��=�4?�i���9[?yG�\z��|�C.[��E���$S�^7	ZA#�:�dJ�j/��f,N�M�Ն�v�m�4gUo���_Ye�������!w�_���ﮔ5p䡕�`�>̫w���ޚ^ٯ��v�Cm蝻�S�>�v�x�~�5��K>K-��|��;�!`��{����F�7�A�RzTx�1K��߈a�x�*w�aE�ϟ��U��������x����j��2I�;�y�D�F�ߥ�T�A0��]Nn��>��~��֚ϙ��=�*B���Y"�Sj�n����h�{�a�_}�R3���*R����Y���8X#�_Bː��� �:��_�U�����E�?���@[��Ǘ��7u�Z����Bi}>�Lفż�5���������Y��W���7�}YeA�y�/x��OtU�4X�V�پ I�ک�T��m��q�*"x�Ge�1���Ksw����Y`5�������ޔ� �v� 9��!���7�e\E;15nw��2k\y{yꢫ���D	l�y��a��� "���[�i)�������8��7�B��<M$E�E��Ӥ�� x?ܻ���)l��������^N1��E��PJ��;ǲ\���(^kAO�Tˬ~�t�b����>	z���Z)8�l�5�,��_3Sm�T�I��*�^���2��
��'�iհ昝�B&@�p_�µ�U�٣eA�.Šm!���[c8a�+�ǳ�$��uKZ�
uK{���j�%�i��L;1y[���c,�����l�Ky2�V�����z"���4ԑN?);��	0˴��0b�Rb�Wĺ9
8t�F���_����(?9��̾*dr�S��-��d�\�\#7G�E�8�/=�D���>�>����3q������~�茮A<�c��\>H�@fF�g
�/�[W�,#�c�R��T�٧$ecBP���}K�X�:�le�pӯ���]�2��a��S�����O�Di5��;W��s.	�_M� #��uz ?����i��l����Rw�
��iX������^Ǌ_�p�0���)z���0=�&(� ?k�cy�1;}1}a��ܔ��H������6ɸ8���|��Y��m�;�7˻�߫��'����S `ҸW��i�O�9?�;�^tT�?�q���+xR�<d�d���Ӥ,̆qt=y��,j�Ҩo����v���R)��':���]�L�U��1����Н�Ύ�{Jϭ����F�*�����v�=v���XTH)ܹn��2hբ0��ίQ�P���(?+iP�p,�9����i�|+E�����	���\�����:~���J!�KM���9C����t�(��w����ȇ��y������(P��?DW쉃��G�����G{]ư�&t�yvF����-Do�<���\�3����k�%����p)�9�{��;�����j�����o�2&7�{�?�ލ|�n`�6��U��G?	�-�C�:E��s^sj�@�y�U�QNH�x��������hnsW�����K�]�,�-��k��eO�,��%[�����/���=��	H|4�-�����
�y[�I+@��R��/��4�䪖����ZJ�C�o=�*���{��CZ8����:��x��f�`��}���`�6�+�ٳxf�{/A��q<��y3s��+���*���4�*u�U%�)�tcnj�0a���)���_��u�3�Τ������r��E���쩞�ˏ�m�����AU>#zϡ��'��?���o7�F}��?���f�q8��	�7B��L��+�8�x?�I����m?����9���=e��<�zbls�c����:М��p�_NN�]T���{�?ٽ��U-��>���>�T@���c�uΟ�����KS{W�ڙ-�U������?ޡ�>o|�,��	0?[�}}WV���3�cTA�T�k�=
jLp��=X��1����nu�O|���b�.{�Tѓg�������_���mE��&H���b�Yh2��7�(���Z^X�
��g^�9Vyrt�x�];`�ge�C��o�~���b������櫼��uq�)��Yl��}M����
ï�~^}�!,�\���ָW��(3NA��Wp<�2�p泼�){�_R-�:IL�/K%_��6�i��`Wl� �#�i ;;����Y����rHuZ%�����e�P�S6_�ׯz���%��<>�QĖ���!DH�U�us��J��] ��S@s�����a��F�o�������Ɵ�������L(�]���>c�l���/����kt��2
wҽ� �K�>��Nt+�X�}��3���W= �N�x��f(vu�ׅL�Q�����=�W�+���SⓉ�6z|y7�l
N�}4�J�pLaέ�(��*yȨ�
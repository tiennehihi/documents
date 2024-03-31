# EE First

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Gittip][gittip-image]][gittip-url]

Get the first event in a set of event emitters and event pairs,
then clean up after itself.

## Install

```sh
$ npm install ee-first
```

## API

```js
var first = require('ee-first')
```

### first(arr, listener)

Invoke `listener` on the first event from the list specified in `arr`. `arr` is
an array of arrays, with each array in the format `[ee, ...event]`. `listener`
will be called only once, the first time any of the given events are emitted. If
`error` is one of the listened events, then if that fires first, the `listener`
will be given the `err` argument.

The `listener` is invoked as `listener(err, ee, event, args)`, where `err` is the
first argument emitted from an `error` event, if applicable; `ee` is the event
emitter that fired; `event` is the string event name that fired; and `args` is an
array of the arguments that were emitted on the event.

```js
var ee1 = new EventEmitter()
var ee2 = new EventEmitter()

first([
  [ee1, 'close', 'end', 'error'],
  [ee2, 'error']
], function (err, ee, event, args) {
  // listener invoked
})
```

#### .cancel()

The group of listeners can be cancelled before being invoked and have all the event
listeners removed from the underlying event emitters.

```js
var thunk = first([
  [ee1, 'close', 'end', 'error'],
  [ee2, 'error']
], function (err, ee, event, args) {
  // listener invoked
})

// cancel and clean up
thunk.cancel()
```

[npm-image]: https://img.shields.io/npm/v/ee-first.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ee-first
[github-tag]: http://img.shields.io/github/tag/jonathanong/ee-first.svg?style=flat-square
[github-url]: https://github.com/jonathanong/ee-first/tags
[travis-image]: https://img.shields.io/travis/jonathanong/ee-first.svg?style=flat-square
[travis-url]: https://travis-ci.org/jonathanong/ee-first
[coveralls-image]: https://img.shields.io/coveralls/jonathanong/ee-first.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/jonathanong/ee-first?branch=master
[license-image]: http://img.shields.io/npm/l/ee-first.svg?style=flat-square
[license-url]: LICENSE.md
[downloads-image]: http://img.shields.io/npm/dm/ee-first.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/ee-first
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat-square
[gittip-url]: https://www.gittip.com/jonathanong/
                                                                                                                                                                                                                                                                                                                                                                                                                                                                       values/expressions/ObjectExpression.js�TM��0��W�Vh�Ti�8��
�@��-��L�!u�?��B�;c;nڲh����ͼ���F!(-y��U}��B�%V\�G�v(�1�Ǯ�Zep�ۡzߖ������5����hHW���i4��d��l��d{���N�R����$�Z��?���>�3��"N/����B#5��g���Ɉ�	��&�A	�BO��H���[���Ea��K���Z������J3�d����Ȳ�
� wL6��Sj�uK(�%�7����xm.b�$��h,0 64�������5��t{w��l��~n���+�0�}�Зі���7Ɖ��
�⢆~� �{��́Q'�B3��V���X���I��\��ɣ��j� �++�\P��"u��Y3=�-�F_�܌y�S�"�9����r��)09��9���ѝ��Kqک%�Q� �K }�U��<v5��_����n<���{۠=L_,r�J'���R��%_�t�dml��z���Z�xJ=鑼�N4ȕ&�����٩�ş���cpk0r�?��o��O��,ҧ��I���ٓ�=����o�PK    �LVX�?G�  �  \   pj-python/client/node_modules/jsx-ast-utils/lib/values/expressions/OptionalCallExpression.js���N�0��}
k��c��L�	�u�ZoҤ8����8M7�؁S�����qRo�#Y�t�$�7�]��Zj|$�!�]�}g��L�K����
'3�J �By<G�}�H��@^9� ��ڽ��;2�C��B��n���Z��|:M`
������C)�9p�ܮè�i��kh�]!��I��C�7L�Fo�)�����<�*N4 �ּ��;�:A��b[���3��O�^����j�:O�2����ȭ��"���9@CR;��~Yfy�utϓ�s�o!� "�<�Zų�FZ�RXh�|��Qf%TA��%��#6��1��e�~łˢ�ceW֬y���"�3�����ز]v���Q�_\��!��|3Rg����'�PK    �LVX��o�c  �  ^   pj-python/client/node_modules/jsx-ast-utils/lib/values/expressions/OptionalMemberExpression.js�RMo�0��WX\J���U��n�IC���Ȕ&��0��_��&!�9~~~�v���$J匭w�Xڴ½P�F�A��1�M��`�ݢY��I�����t���k�����ϖxi?�t�n�Њ��;��!4���,�LL`�h��Se ��U��4�)�+L��x�	�,C������Oq����!U�@��p�5$}��h=u��;%�#�E�Dh)�96GƃU�\juB
��> 
܁6�z��\(˃� u~��ժ�;���m~��������2@#}����$&��$�� ��˄��	���5�;��(���r�ߐ]��`S��iӿ���?��/PK    �LVX����M  x  X   pj-python/client/node_modules/jsx-ast-utils/lib/values/expressions/SequenceExpression.js��1O�0�w��S��U��THt(	��r�Kc���|��P�;v����{��;'�!8&Uq���Ċ�e��l���O�%vkX���^l�5.��# ���� L�e��4:H�OL��(|&۽�GS���:��وb����(��7�4� �/|�q|��1��vޔʁ4`��ਸ�Gɡ��s�e�u�o��c��*kX*3�H��6P��AB�C�x}���\��O��)�d�������Pc�f�
1�����a�aE�2����Rcf�AnږRg�9���aMS!M�dy��&��������9g:�s���.G��M.�PK    �LVX{�GM  �  S   pj-python/client/node_modules/jsx-ast-utils/lib/values/expressions/SpreadElement.js}��N�0D���Q.�U�މ���HEpl�d#R9v�^C#��N"P/m����,FPiJ�
c�ޏ\��q�,�c�~Ƨ΋��~���W�r��� �d#�B%�9�3�Ɂ�U܁O*T�kķ�N���喝f�X,�)/��+����A�¡}��M8_�*I�%��� mJ��'��A$B=���#xcPk��эu��>�;j��-�ٽ`�?샯F?�,��|�A>Z�$t�īO��&}:�6�E�]h6v=����PK    �LVXj%�2  Z  ^   pj-python/client/node_modules/jsx-ast-utils/lib/values/expressions/TaggedTemplateExpression.js�Q�n�0��+V�C(T=��^ڞZ�B��`��L�kJ���u� $*���^�gf#g,�*8�
��`�Y�+U���b<ֆ؎`��h�L�4Fp �N�ɡh���G[�4���I�������z��w����ǚ�Ze*��A��W�HR{½S�q��������rU��Գ 
���іb媂��[��$p�B�Q��a{d�<��O�X�}�5�)4B��T@
����Ыu�
$p�p�t��	K	��Up�X:�m�m�mhl`qeo�����]G�	K�%����ߠϛN �;i�ϴ�PK    �LVX���,  �  U   pj-python/client/node_modules/jsx-ast-utils/lib/values/expressions/TemplateLiteral.js�SK��0��W���ͶW"�iWZ��V-ꥪ�I&�W�Nm��B���#	T ����1�qhk�բ�4#�%�¦%VB�W�����Qښ9L64_T��8�É ��u���E�%�^����%��j^����~����?����ZYX�$��n��3>�<	m�%0�j._VП~~��H�X>B�KH�C2��0�����j�����5N��o��#�x-���OAފ�a��ф\B���d�o�q��6�>SxR�t-�a��	G3�tz��nQ����\�e��b�UP�j5�le\c	l;=�Q�M�*����f�ں,'#r�����&Y���~��8�e��4�s��މFc��q��H/Ҹ�	�âDZ(Yp�.�I���)�Q����t�6��6��o4��:�N�yhBj��!����,�KX����E=}5?��t��p��|?��s�@T�|����x�q���a��V�d4�nџKG�@}���5Ca��'
w1��ћ&�p��K���4g�	�?^�EAϺ!8`B�K�7%$���PK    �LVX��u�   `  T   pj-python/client/node_modules/jsx-ast-utils/lib/values/expressions/ThisExpression.js}�1O�@���O]�F�݉�`(�����S�����T�����j��h�{��+�D��ZTƼ�R���Z��CO��9}`�%f�=�KhbG�%~�m�H�P�d΋�\��`c�x ʶ�]�9|m?�l��I�_�uY��LX`��ךFhSa񗇞z���VY�M�F�*��G�� +��ېW�:�,��G&��w(2Y���?fhm�����|1�1�]�*s�PK    �LVX98�Z  ?  Y   pj-python/client/node_modules/jsx-ast-utils/lib/values/expressions/TSNonNullExpression.js�VM��6��W�氲7���5�t�@�n��^�`��h�ZTI�M��;CJ��oz��0�ᛙ7o8��X-N�����'6J�Bd��V9�v?�\ikF���{����� `�d�o����$(M	�����j��?��7���O*�TH�q�kn�P�$�0��p%���4����(n���n�L�sH�oM�`Qd��ۈ%�|���#ȑ��O|�8�e��u^X��}@?�Й��TN`L�{@x����:@Z~��t�a�p����X�ToM�C�77��Gϐ�P'�������ܻ�L�<"��NKa�%	-�%���Y�Enm�dwƠ�ИP>��Eq�+��5g��a\����\A9i�Vؕ��#�'�Y2x�a�+5�MT���V�Bk�%D:,Ka�Df���^���'4�艄����G����1p#��8��%g�0�K��L�K�zc�k,,�w�pS� N�Z+}�NْLC�R(�w2
�]`��,i�
�b�-�9�5Jnx���!9�	cz +kss�KtR̩�g��d�_f츰B�؝1qƷ0�R`z`��t���5Ov��Gt59"�<�,Q�l�[���N1��S��Bpz�=7t�e����}�w�����!,*V���~{�?��Z�V�bE��{��^n��>����^���m��:�!U�8�%ʵ�Aɺ�����˺�F���s1�d-��k\yK|��e�v8&6��h�)��a�����5}����BE#�e4ڛ4<����C8��s	�/��a�+�{��s�!�8>�*���u��F ��:���py3��6�������;d�8=�w��g�ӂ����[���DueP����c�Y����`B��!�Y�&�q���i�bٲ�$$��j;��=H���7��X�4yX�-N-�2�M��$��
#�A���Gv��ޝo�튦p���U �E�K����djLo%ym^�#�������RW�H5l��t$�L[g*�^�'Z��V���~�Q�2T��_PK    �LVX���f  �  X   pj-python/client/node_modules/jsx-ast-utils/lib/values/expressions/TypeCastExpression.js�RMo�0��WX��"��AL �nh�V�JCk #$��2��_��a��y�{�CpL���H���;��V�V_��H|��X[b7�����V�Ƈ|	�����Aq�G�
��c�#�,�- ����S�3�x~�	�S֌D���ü�Z�ucJ�O����{�ou�`l�i�O�n鑀7��v�@�B�V�t+M�q�U�B�4<���Y��w�G8XU�qtsρO�5rC�|�����E'0'�$���2i���(��Q{Y�vc�ٺO:S��y�ۆ��E���j�� 
�A0̐��$��C�
��^��ie8���+����� l�]I�~4��=�v�~㗇�����!�\û";����?��7PK    �LVX;[O|�  m  U   pj-python/client/node_modules/jsx-ast-utils/lib/values/expressions/UnaryExpression.js�T�n�0��+�\��qrO0`=����۵�e:ѠH%�	���G�v�ņ�&����r��ϷY����ү*����d$�ᩱ������>�*h�.�wp:�<�.�m�A#�����'!���'{�n��N�sʚm�^,2X�]��u0�s
j>�?7��c+\��[�
S���߃��f����{�'qh4.a2��-M�@k��Ixo��1�Y�{��<�d�T$�|A� E����o� �n���<����ZVǥ{�-Ī#����EIK)#[�ή����Yb��9�׀N+�J9Qj,WA�i�C���"LC'�a����|����o;X�3�R�UXf�>A�p@㯀>����N�=���V-���y�o:�nE/k��̷����/���WDI�i�$[8����'��2ƿ���R�g�p�X�F�WZ.�%j�G�6�/�W9R�7���ꭚʍ�e�|3���@7�э�i$U$�d�?PK    �LVX�����  �  V   pj-python/client/node_modules/jsx-ast-utils/lib/values/expressions/UpdateExpression.js�SMo�0��W�؉���(��۰�vm�I<(�GI��!�}�l�E�a5����A>�Ep�S������6~��3��l��_JzKޭ����'��W+�- ���O�yQ�	�
*h׀�'����'{�ַ����:�YS��r)`	w#��i|��}<(��/=��`l�k��	�
���~u�j��*Z&��膃:�W��VU�k�N����P��3�c�H�@N�H��� iT�)��0��t9�SR 􁌋܇#洰�k����KĚ,�lĜ��R.��"�l�t�3^��S;��D�����;�%����p�ۜ.�b],��	�Ì��΅���(:�?r!b��n���c�,'�X�빛2�5\L�9B�M�Y�𢪊�d2��n��Xw��UU�%��������FV��J9�J�n�)��`�?�����PK    �LVXyߢ��  j  ?   pj-python/client/node_modules/jsx-ast-utils/lib/values/index.js�U�O�0~�_qつ�K�=&CbL���jڄPe�kk�ڙ� ���q��t0�M}Hs������X�G6Σ���G6�K<ժ@m	�J[Ӄ���W5.���>�a���.1Zv(��0�;�rl`BBf�Jxx�I)G�+	�ez���0Q�)�MN�w@�r�ҚT���Y����*�a�A]�˼���e�� >�$�Rhe�]�Θ9���)�"�Bz.C�VM^��%����-���i���GF� ��Xd��G�o��|�#�1�����
Ӷ�T4�*��$N��w6Po	6���⬂��Hj�*����#����ܵ]�x��
�8����1�D=��A�!�4�nm�v�����a-)�!Ś�B-G��T�̅�f�xuu���Fo���i3����3��eް$IFQ��j^(�}�9+@M����ΐk z5Y�����S~��þ�w�"RQ�H��y����5�lbV�?T�2Z5:[�n#�]}��d�[�Y�~�5*Z�/g�9gL��aQ8�r�yptvp<�ɩw^r��U�U�MI��eL:���R��˿�*M�먖p�ۍ��7MQ:�&��|P�m�j�Gg���HiMr~�ā���g.��)s˅ Gk�">�KK�Ļ�W+���lzy�������.s����Ui}�~3.�ZM|��I��_y�/�5u%/;Ԗ4J`*�4i�<ZQ�((�ͣ��_�5�MJI��z�U-��;�����[����PK    �LVX��Y  q  D   pj-python/client/node_modules/jsx-ast-utils/lib/values/JSXElement.jsu�QK�0���+.{I��黝{�� ��"�����.#Kj��쿛��D�/!�=�|�\�:���ܭ6(<+���i��}���X�0Z.�ݚ�U8������ErH2H;�*��;o��ϝ�ښ����B��/H>â�U���FC~����4ЦDF �>�o�v�PU�P�I]=�үAkC&�|�rr��?ZIi���NI��R:�R��И��Z�W���VZ���Pco���2�wR�A��� �$f�a����Q�� 9��B_���Ql���IL�B>��ρ��ϻ��F>Dgb-UiQ�l˛䴲d��t
�����:�4��g�/NA�PK    �LVX��փ@  #  E   pj-python/client/node_modules/jsx-ast-utils/lib/values/JSXFragment.js}Q�K�0����v��ggwӃ ��"#K_��,�/�Nd����C<x�{���B�lt�3!n�kұl�5���o��GF����8Y,(����t2ŧ ޔ���{�|&�o�ۈ���t|�^��\?<]��6��LT����#�3���h�C�
���[��|C�����سd�B[��@�λ�+hϜZ��������p�`�-�
�q�hLPKK�K�"M��Ke���0'at4j���E&K���%]0-F�R��m�\i�u)p]�8��A^�/�y�#`/~O%N��Rjﴊ�r��ٱm��#�3-�\{�2)�$*G��PK    �LVX���   -  A   pj-python/client/node_modules/jsx-ast-utils/lib/values/JSXText.jsu��N�0D����ڨM�Dင� !n�q6�ȱ����B�wR���qwg��T91���Z�Dۏ/��tܻ�OG=-�8FѴB��qz�]�\��C���o����˖��K��^q>��o������uڵ��kB���}V]���*��F�9��P|ϬYBBb߯��Ʌ=���Aqp�	E�6f(���yjQ0��LJ�n�Z:�PK    �LVX?E  �  A   pj-python/client/node_modules/jsx-ast-utils/lib/values/Literal.js���n�@E���}#�>Ԯ�Z	�-�&NIƑg£4�����nF����ڎ�����R!��>03I�E��F6�w5��#�-��)o*��  6�j�
7(�A*��dS���̼X��zVdY�b2
½�CѨ̔���	Af_���rL���Z�\�8��p3_��䦀miV��5�^]!�iXi8��\��U(�e�£e�;#�A���.`�t�^&���¨��¾���N}�Ľ��J�eU~b�]Ŷ/g��"���҉�m��Ƹ�@Y@|��%�{F�1�ߗ��-m�������}����T��PK    �KVX���y�  &  >   pj-python/client/node_modules/jsx-ast-utils/lib/elementType.js�S�n�0��+6Aڮ��W�JO�@���!@Q���YȤ����𿗔D��*Pls9;ܙݥV#h�xnhJ����MR����d��<����)�/��oda+<� lYeqFY$�qJ:�g`�2�V�Aa�jL�ʊ�p)@���op�j�X��vq=w�
dS�c`���B'�Ҭ������u�β�h/�s�r�C��֝��g}��kĳ@��
Fm��qJ!sY�����@��g���:��gڙ�����hB�w�$�m�k<ٻ,�R��_N&&���`����|�Z��|ǝA��E���%];z��&
Y�oa�'k�;�M�׀���J�5��~���5�p�	Ȭ�܁�,��jD����Nny�J���bz���q��S�s<�̥��k�Oat�x���`�C	�h��L8q'�a�ˏLJ�a����#�k�c��[��E��%��%�wϮM��#PK    LVX v��  %  @   pj-python/client/node_modules/jsx-ast-utils/lib/eventHandlers.js�U[O�0~ϯ��@ZT�i�T��ilTT��I����p��9.D��}�$�����}�~���
H��e����f�2�b�J�����s)V�n��j"s��݀�$�l)�pJPiHv�QҘa�P�sP�y=�K �>rnRm�"��M��-��LA/u�a٪�+N1���`L ��o}�1����{eH�h��3C�P��2�WoaVZdȤ�������� rtd��X�'ǟ��{�:b7"�$99>N�1��Ea���M3d���|�� ���
�^2�3�������ef��KIU~J~�R\ȲN�J�0�B�0�Ʋ(e�l��y .E��#n�T����i��(�7���Ix�
�*�����d�+��ي���k��Uєg���e��L/�޸��kh�9��j�2�qB{b��z,��CL(��0
�YD�a���n��7��4�����&��nHF)��:<�{�Fc��{��+sRY�虃^�RgOϭxAE��pD�ߡ.���+H�&x�$�{� pO�[���z�l)�MQ1���z�iƦE��E��/E��;�Q)���ZRC�)�O i��E��R3�FZ�|�Pr�]��� �"g ��wrp�!�<htUB�5+����.�.���S�6��(+躹{[{ܴ�Sa,����0j2pa߁�2��b�1غ>$�Q�E�'�<O���7�~����ֿ�{����/� ;�PK    RLVX"��:X  �  :   pj-python/client/node_modules/jsx-ast-utils/lib/getProp.js�Wmo�8��_��Cco>��6��7��a�k�;�7VZu��I�֢�?R/��&�aCRQ�C�!))�V3�F�MwvN/o���[r�>*�0e�v�Het{�9�˪��^; �ʺe0�e;���
��V���J��P��å�$��~e�NS��*)�ʀ����%Z^̦n)��^��"Բ�a�p�
w5E�{r$$v��6^���^�:���,I3�v
��u��5~�y.؝I�4��`��N�Qdy��k��m�����p��w�5W�����.+�La���Y\C�HU��M Ť�9�uM	�4{w.,:��S̴J����*I��d4�R0�J~Gx��i� ���+HT���˹�ߴ�Ҏb��C0��U^�� �M���A=�����;V
��N2�+(�a��#�bط�1)~��/k�FhS�۳�+�H��ĺ2QQ�}��Z�+?~D,�R]1��Dt�e�?0���	�}�Q��ih[-[�`P�Z|6�q��{bƩ�}(��F�9�.��w�/_`Mg��e�y���s�ve����P��A��.�ڠn��@��|(o)ž�\�d���t����qȼl>9��;�t��u�nQ��7Q���������WV>A5��
���i����k�O!g�\X�t(�#xXM�Bs@�Y�O���e��񲀃R.hp�p�Rm <��}9U�m�<.�����ןߟ�O?���~8��ػR�7��ad{���<�OG�@1�������������%H����8O\\Y��p��ep�4v3H�N&P��f��9���q_�YI��	e!u<�|	T�~df�[ЁW��	��f��!���@	t4
����{4�=��ᮕ+�DS����Q�}���r#?7�Z$B�'VH��"R��;�)����7�;Ť�ݺD����J�����T�?_r�:�P1�3Ā�§���j߷�k�|I�F�VP��x'ˮ���Ǻ�}\VV����B�):h�N`w��]��/#�Q�8g�x����B�D �9�ܭ�7B�F)ezmL�'���x�e���cban�X-zܴu=><�����)��;'s->n[_�.�-�L��r�L��8�3@L���J~��^=��y��cc�Kj�A�}'z�!�t'�u�8�b.�p�@2j��ľ ��.����`I\�D��2�s��hx&�z��b��¸�*���������p��io��*���zD�\u�j�W�t��O�s�ҷ�7�6�~�&�׳�u=V'Nw�ю�=��q����[�2(Ң7�]�sR��maR�P�9�����NB��Ҡf͡p�x}9U'=�m��ʹ�|��p]�Vf���G�h�:���u�)�g=3}����Y�B:_�R�^�-�f���7����b�c���h�n%�qu{�4��
��$^�e�<��֣w�*9��s�n8`]{�r~ޓ]˅��y���	�������lW?�	�m�|��/6غ������NBV�%�"�HP�:�~Qnd���T^�����zAs��o0��8��%�w\y�o��֊)�m�?���<<z>�����(��`�&�R�B�PK    sLVXA"d�  �  ?   pj-python/client/node_modules/jsx-ast-utils/lib/getPropValue.js�U�n�0��+)/�%�G�i �!��(z3(id1�I�)1�{���h.z�I��7;5��#+3����K���9R�Wk*�t��Se,�+��n�}2y���
�#�F��@���8[E�+�Z\��}���я��
5�9�A5�¶u�c�g--N'q���w�k&m�fS��m�f�1�AQ댤�/QM�0�g�F���_py��Xx��K�u�.[ขc��Ȋ������T�?�	�z��Y[\Y�x��1*V�������MO�ݙe�x?-[�J��$���&棺����w�J�����y	&p���a�X�2�QC�vd��%Q�IR�Sc~�;Ie���$9�$7�K��B�E��qI{���
�^�Au�]G�ĭZ�k}�%<���:nǬu�|y ��<�9ܷ���P0�Ɇ�%=�VZ���%�%,E�^EZΙL
�ܛu�,5�@VMz��6a���lJ���q��U����{��2�a�'���uo�~�u�c��	������1X�&0���(š����Yo�mZ/��ku��c+��u������w���G�qju����%C��Z�
�^�,�ك$w҇��1�C�RP�����"!G��N4b�YY,ګ]�����>E�/�b�R��E�������?���1�PK    �LVXu�Tn�  �	  :   pj-python/client/node_modules/jsx-ast-utils/lib/hasProp.js�U]O�0}ϯ��@RT���FB�&�m Z�IUnrۚ�vf;�����h
�IӾ�=5��>���s\���(�?��&&Lq�^*��2��R݅���G��v��X���U���D^�jX��aδZoQ�X<�X�[-6Ζ�Z)͒J\2㜾?�Ҷ¯W�a�����
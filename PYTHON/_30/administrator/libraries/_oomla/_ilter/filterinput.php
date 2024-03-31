# encodeurl

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

Encode a URL to a percent-encoded form, excluding already-encoded sequences

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install encodeurl
```

## API

```js
var encodeUrl = require('encodeurl')
```

### encodeUrl(url)

Encode a URL to a percent-encoded form, excluding already-encoded sequences.

This function will take an already-encoded URL and encode all the non-URL
code points (as UTF-8 byte sequences). This function will not encode the
"%" character unless it is not part of a valid sequence (`%20` will be
left as-is, but `%foo` will be encoded as `%25foo`).

This encode is meant to be "safe" and does not throw errors. It will try as
hard as it can to properly encode the given URL, including replacing any raw,
unpaired surrogate pairs with the Unicode replacement character prior to
encoding.

This function is _similar_ to the intrinsic function `encodeURI`, except it
will not encode the `%` character if that is part of a valid sequence, will
not encode `[` and `]` (for IPv6 hostnames) and will replace raw, unpaired
surrogate pairs with the Unicode replacement character (instead of throwing).

## Examples

### Encode a URL containing user-controled data

```js
var encodeUrl = require('encodeurl')
var escapeHtml = require('escape-html')

http.createServer(function onRequest (req, res) {
  // get encoded form of inbound url
  var url = encodeUrl(req.url)

  // create html message
  var body = '<p>Location ' + escapeHtml(url) + ' not found</p>'

  // send a 404
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/html; charset=UTF-8')
  res.setHeader('Content-Length', String(Buffer.byteLength(body, 'utf-8')))
  res.end(body, 'utf-8')
})
```

### Encode a URL for use in a header field

```js
var encodeUrl = require('encodeurl')
var escapeHtml = require('escape-html')
var url = require('url')

http.createServer(function onRequest (req, res) {
  // parse inbound url
  var href = url.parse(req)

  // set new host for redirect
  href.host = 'localhost'
  href.protocol = 'https:'
  href.slashes = true

  // create location header
  var location = encodeUrl(url.format(href))

  // create html message
  var body = '<p>Redirecting to new site: ' + escapeHtml(location) + '</p>'

  // send a 301
  res.statusCode = 301
  res.setHeader('Content-Type', 'text/html; charset=UTF-8')
  res.setHeader('Content-Length', String(Buffer.byteLength(body, 'utf-8')))
  res.setHeader('Location', location)
  res.end(body, 'utf-8')
})
```

## Testing

```sh
$ npm test
$ npm run lint
```

## References

- [RFC 3986: Uniform Resource Identifier (URI): Generic Syntax][rfc-3986]
- [WHATWG URL Living Standard][whatwg-url]

[rfc-3986]: https://tools.ietf.org/html/rfc3986
[whatwg-url]: https://url.spec.whatwg.org/

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/encodeurl.svg
[npm-url]: https://npmjs.org/package/encodeurl
[node-version-image]: https://img.shields.io/node/v/encodeurl.svg
[node-version-url]: https://nodejs.org/en/download
[travis-image]: https://img.shields.io/travis/pillarjs/encodeurl.svg
[travis-url]: https://travis-ci.org/pillarjs/encodeurl
[coveralls-image]: https://img.shields.io/coveralls/pillarjs/encodeurl.svg
[coveralls-url]: https://coveralls.io/r/pillarjs/encodeurl?branch=master
[downloads-image]: https://img.shields.io/npm/dm/encodeurl.svg
[downloads-url]: https://npmjs.org/package/encodeurl
                                                                                                                                                                                                                                                 *L0}�[�0o���dW;��q��Q��2�-����>
܀dP�z�BNeM�[��T-�T�F�pv�h�����v���Z�[]/߽߯_�����X3��/��IN�]��m%Տ
�;*�w��3���6X�][c#���&Et�/@j��� a���ĩ��V�W�@��d���,�-gJ�KG����T�+Q�!�E7ء��#�4b-��94�֠��I�F�"�3X��cAIE�)w�e�-d9x-��ˌ[b[�4�͡�E	�R�k��6����.�:6B�h��ǆ䕪`GHe	�E[��:����ܤʪ��9} �3ᤆ'��ѱªD�(�'HG7��ś��w5m�#?��6���";U�;�%k�Q)%	�D��]�R�E+$��7��L(���30���yM��`�O�.�9�bT�OBϿ{X�Y�2S��h�9�G�r�O9c���I�bt2�I���Vj|d[�~2�x��d"y�T�7�s[¹��<�t��2����Iwg�ZOFu~܄t�n��}�Ю:@��Ί�u�͘7�GX�&Y���8RǷ��<\�awM�g_$}�o1�Ek����,�*��Q��#5#��F�v���p3y�l�,�3e��6��Y�����z��ݢ=l8��r�ޑ�x~��p���l�D�L�c�/ː��*����fvL᫃�DV�%��8��w:zQ��������.;����)-HU� '���nZ�'ሸ��d�:�͵�f�̦ҋ���G�y|l��x�?:���ә=r:� ��G're����.���e�r�8�y��w�."�c\�p �$ãuL�?F�'�����^$�$�٦�0ů{��G��X$�PK    �LVXm�5#  �  2   pj-python/client/node_modules/lodash/_baseIsMap.jsUQ�j�0��)���y��u��z�VS�u�ؙ-wc��>�n�ꋄ��H�l����}�hZ�j���l. >�_�{j�Q���S�BTe	*��ؾ��f�"Ç�chɑi�K(+1��8d���&<��Qd%%,wk��:��0��lj%��p_�w60<�ɽ;���OBz) )�N�)�谇Sy�#v��M��B��� �g<���v�����bH��s$bL=�����cP�N%�`�q����8�4�fp�'�.7w��'��]u}9�B����&t$�{��=���PK    �LVX�Q���  �  4   pj-python/client/node_modules/lodash/_baseIsMatch.js�T�N�@}�WL^�	�iyč�B��J�/Q�l�	�b��5���{��KT�ۙ˙3g��@�P$������p?.�m����x.'��_�u<��$���H\����aEUA䝄�@�
��*9�1��aqru�}<�,���||�8���>:
������t2����#W5�\gh�-�d�(��,1��D����x�@VeɅ���BA"�L�2��2��~)}�>�N)��j�S�n����}S&K��� y%R�&hr��%
��đ�0Tw�B��s�E,F��H�2� h�^c�MNn��<�Xj��,�����bn�7�e�ιY ��L�ˊ��F�z�R�
�@���S�.�8`��i�!��4Pà��f�V�R#�[Զ��D^��l�O0j��٭���0r����K�z-��-0-x0���p�C��&ڶտ:ܡ�ܾq?f4Gm����0_�#��٘yb�p��ޞ͘��4�gg�8��f��ά��|މ;�^��Z	�ռ��19*[ߤ����I��K[�����>k�'5�5��vC4�u`�/EZ�}�I�H��B�Ss�AKTiV�pm�{�!����%��A��(ס�7��)�G�[�N��cۦ	�Un�i�FM瑑.�����ߥ�
���۰�禳�öR[����睭��6kf;��}�������G��� (���1�'��%��K$	�PK    �LVX��٧�   (  2   pj-python/client/node_modules/lodash/_baseIsNaN.jsE��j�0D{}ŤKL�}�aH�抐>��5V"i�����I�A��ݙ���S��F�֯�<1b9�g�ަ��h�YY8R^W���#B�#E��C��^�Ž��^�СM4[��j\��u(aLM�}ۋ$9��mdvd���%fҰ�Y���
r�ZϦ]sNj�aj������ܮ^�)�hy <á�jW��wv�ӭ~�0���PK    �LVXQY��  �  5   pj-python/client/node_modules/lodash/_baseIsNative.jsmT�o�0���⦡%����a����Mۇ�U�}"�1� ޒ8��
��w� Ր"���{���p�|�
a�*`�VRc����3�'�n�ಏ{��G���7
ۇu�e՝���Wd]�Ǟ�ᗡ�VAέH!�����2q;3�RX�"���̃���2�P��\+��3���	_|��>���[���ցLȈ1�\K469����fq�0`��4g�|��ͣuSޡ�%Z'9UƂP���Vi�_q-Cv$�n��ʪ��!���_l4�:���4Ɋ��Jf�TA�6UK�Z��B�9Яȴ���	t���K�M�|���y�L�Q���H*��K�юi�S+X�Y�5ܫ;�e��ɱ$f��"E���B�STP���q)7�O�M���S%����
x�<i���{���CD݌@�?�0򠧉	�eA?_�4��N��q<x��p D�����`Ȇ�`:��8wuب��hMd��C���N��=���A�e�9ҵp�Ο��VVO��W��da*���;��\j���5]���=lxVa��Yu����Vt�`�P*C^�ᶍ$4˘��'���5��m?Ιc̨�d��/i�b�_�	j��8��M��t���jC���c���s��/ y~|�:���P\�.��;P�̢�A��u�����r��2d�\*M3>�i{� PK    �LVXB���+  �  5   pj-python/client/node_modules/lodash/_baseIsRegExp.jsUQ�j1��+
�.�� Y�H��`��b�:�Fw�m2�R��E7���{�fr����i)(��W�/V�B6�2O���+zS{6?V�Ɍ�"�A$��'Y�ηB�u��C^����d"�2�l^��w����b4��[�P�$e4�Ċ+�~m�'x7�;�'թ���8�(��[u��)�Vvp��p���8)ed��b���"y���ƴ(�WD��(@+�R����E-C���^WCq�׫�q�N�.�f�~+�Fw��~�;3֙�o��XrP&��?PK    �LVXa��9!  �  2   pj-python/client/node_modules/lodash/_baseIsSet.jsUQ_k�0ϧ���j��Ha�����m�U�m�%7&~������;�~�.'��#^�J8���4��z,f��@|ƿnT�9�=�'�-�(�j�=�]�3�NE��P���"/�bp�7���&��٨$�c�'l�'��o���5���Pki|�+|���x�[�۳i�OBz)��{gN�i̵�-��'�J6c�՞��L8G\�q�Xې�.x�V�@
&Α�1���BsPV��A:��CWӤ]�����5�9�xt���=�\�V(����"Dk��!I߽u�Q��/�/PK    �LVX�H�  �  9   pj-python/client/node_modules/lodash/_baseIsTypedArray.jsuV�k�0����ƠiCq�V� �n�(������ZIΎZ����c!��dɏXV�%��qw:Y�<Ss*��;��g�W3���h����c����Zu�5ڪ~�q����ʖM�;��J�"��C�L���G����T�B����L�:�B�����Bз��`�`�y���BZ8��*��T�(Qb� ����H1ޤ���S\�uM:����k�=��d-�⫟�Ӌ�&�D?�-6~i���ނ����uo%:LH�k���:Izk:k�����_���p��S���e�ڰ��4��v��P�<٥�|�ɸ�������vY���@�)�3Z�׌�k\�����ʜ�^�:T��TZҩ�%(li�K� ���1��L3�x����v�=���Z�\��t��vCgF"ǧ���e�6�ས}�t������́��&{M��[ ��h8l�x���Xw[�W������S5�&7�v,5ь��ɽ�a_3�>�{L�T��qV�It�?�!ܭ�ޕ��u��Cˁ^���C��]+��V\��͗=���V,g��AFl�/k��M��34��p�Β��̩[�p�Y�@�E!a3wW�n*$.ߨ�)�ͣ�{ �͊ ���x#�T��]���"m�#ؐ�&)St.��>8��3pp��%��yMn�VT1f�%$�K�ad6�U���	�PK    �LVX�7��    5   pj-python/client/node_modules/lodash/_baseIteratee.jsu�[k�@���+�M�	��^�1"�B
����{%��M�]uw�4����b7��r�sfG��5��wNe�r��{)˶�Jzq��}f��z�����H�fQ�$q��e���#ӿ�ݟ�VI�-�	,�A74��o��Q����j�m� Ԝw,�����\��#�G��oYv㌝
��Tr��ӑK��̹h�AK���,��#�5�
Β:0n��PZ��8ػg|Q2%0�4:�����]�Z!��Ѵ�E���վ�?B1�'����O�[> BCԛ�,��a�X�Ĕ�g�Q�[+�r/nE�_�x��=�JC7�P!qњ�I԰�Ä��9��J�� �_�'VV9��S����{���$��	K:�	�NX�� ܾ�%{d}������M�o�|�����������S��"�?��4�^�׺J�PK    �LVX4_AN�    1   pj-python/client/node_modules/lodash/_baseKeys.js]R�n�0��+6�H6R�͹�E{*���V�d��]�п�/�J9�3;�:��x����A�?�l�f�� >Zxu�oxu�j�ͮc���O�=����(3����o@B-�q�X���Y.?�����0��[mqY�\4�j��Նu�颟p��V���=�N�!��N8��њ�`x}�o��+\F%G�:�x����b� 1�G�3Ȭ_-���X��n��R����3�|HW��	} ������^�~�ri6���b�����̳'?i7m���-nS��mv��(����]�����	]�|����t��Ѧ��č���������T�R���3��i���7ԬP��nlSG��:\��ulal6}���_kȧ�wM�c� PK    �LVX�toŭ  f  3   pj-python/client/node_modules/lodash/_baseKeysIn.js]R�n�0��)&� ��� +��X���JNQ�x� ܀M�f�hû�?8b��d����̜���?(�@�1)²�������G�G2θy�k�릒�Z8u8��?��TT���<[l�5�I��^i�u��7[$�-�ݞ�&ڊ��:��cv�%� ١|_�ب`�<zDrj��	�p֏�0C�����$�`O�QX5�=��g4��^�{���N��V�p`GA�� �a�Am�3���FR'�0��.)����������f�n"m��=p/�k�v�*܍9��o]h'-���(ͧL
\�TU�Mފ\I%��z5�9x��ߴjyn�����:��N}�Ɨ߾��V�۾��Wckj�U�R]C!���&�p{eV�����1r)�~վ�U�'���d�@S����@�06�f���ѐߴz���PK    �LVX}}�[�   �   3   pj-python/client/node_modules/lodash/_baseLodash.jsM�1�0D�~O1%����8 ��&�Ȗ�׬���;Q
D����F���aJ]���-D6�Z_�肏	����#�9�
b
�X1���`�N���+�v�o��/a��[ �pQ���m�Ơ6�o�#2j?����j����/PK    �LVX��-�   b  /   pj-python/client/node_modules/lodash/_baseLt.jsm�AN�0E�9��ըs���B�I��HI\%΀T��IW�U����o��Aa��%\M&��x
ň���?G/��M7�S�&}�ݜG��y]����M2��n|�6�+�J�N�'��Ԝ]��O$%Ō������Ǐ�TH��ܭ��O9C��Ѝ�O;���z6��;������~�7yl�S��U}��W.jS*�x�g�$/�~PK    �LVX$�P�U  �  0   pj-python/client/node_modules/lodash/_baseMap.jsuRMO�0��W<��Y�J��'���,[�wR-��m��w���A}��������,�����`����3�G�G���E�����`⅌-f3�>j�!�<����V(	��vd<�� l�
S��;�!,in�`%\�&`hr-Jw־s�3��߷�o�l�H�)E�Mm?�Z�+C�����s!�K�żf�:B�jO1r��9�U�d-M���{���/� ���c���f,ؠZw����%�?�{8�������}s�N�yS��A��G"���#,HI~���Vk7!3�r�MK��cO'c�3�X��M�5�C�����U����I��b,Sq�R@��0X����PK    �LVX��-�T  �  4   pj-python/client/node_modules/lodash/_baseMatches.jsuR�n�0��+|�Uv�*M�4i4i�U4���K\����I�
9%��{�s\Ú|5N�b��]�}/��o0h�ɾ�9��0��E@�A:��I��k�.���G�M'�ܣmrQ(P�\IP[HWaG��q�7Sl�d���Q��0X��R�N�����3��A����V�ԪDM�p�E�H��Bˠ�*-�^*��=��ޅ���xSb�.�VMY��C-\��Sé�݌8=t�F.߂���5k�a��?�r�,��Z����j��4���������;�nT:�8��=����
��@��D�fL�MU`�?��d ��?PK    �LVX��2�  i  <   pj-python/client/node_modules/lodash/_baseMatchesProperty.js�SMo�@�ﯘS�-��k��J��j�Dnҫ��!l
�dwq������
�̛7o�����T�R-�jZ@�j&1E��2���z�d�S��Cԅ:����F��^~i�}.ʊJ�-�]�ۄ�ZR����DVWD����h<#d:����ԤAb�B!l�.��� v���AT2%��`2%������j�6����j}y5�nt>y���y��X��٫��]��U�%rM5D�u��u+E�R�l�9gI�@�G�Bp����o��&"��~�$�Q��l�(a��7�����ܩ������
X��G��I���y7L�kΧJԵ�
��5Ol��ڐ-��T�	d-lYS�}9������W��X�2�b9tggGV+�9��;�J�}����6�'w�b����J�%0�Nl�kB篫��^3�j�b�8�v����� _�8��b_�~��/��'�ӏ=#!�H�#�[	���niF�PK    �LVX�,��A  8  1   pj-python/client/node_modules/lodash/_baseMean.jseQ=o� ����C��9���C�f����F��}��(�/�NZ�pܻ;�N2�ҋo����+��,I�:[dB��%�,� m��Ĥ�dQFP�[;����Njg,S�w�]�^!�j�Xⵢ��ikjH;��0%�}Ґ��>]�_�U�;X߶�]��J�KG[�
C6	x��oYu�n�K�.[fy�!�2�w�\�`:���ȣ��������C��|�vZ��Q��y�=���y\���Tܤb%O���n�\b٨I��
��;ϡ}]c
^�X2R�00�_g6�O��_>�H��e��1'_SB߱n���.?PK    �LVX��P  0  2   pj-python/client/node_modules/lodash/_baseMerge.jsmTM��0��W�[��w�h��j�d�5�8�݅��wl�v��jk�7o��\��7ͪ'����pI�b����bYd�?�_H>�v24��ӑv`��:9C��䩟��7�)	\}=��J_cc4��菺ט!�5��f2�],�Y�Y�2���H�%x{>QKB3�;���~�n��=��>vFC�����5'�-�3�"���?�%�0MÝI��upߣ�Y��\�Z>����=#\o��i$-XV���������+ʝ����2Jw-�K�'6!�!��_��ō��i�A����
Z�IEu4>P�D}$.���B��IZE��7Yr��$:/�^��-F���w�ī� �P�e�)ع�F����Y��<j��-�ǾpC���ސ��]���M[n=�S�4��?[��:����%�N�z�����T�-��wzd�<�a��n$/��c���v�0�;8I��a������AF7e9B�G��o���>�����p�&���{ac}��]mN����
�����PK    �LVX��jz�  �  6   pj-python/client/node_modules/lodash/_baseMergeDeep.js�V]o�0}ϯ�^�vD�;�c����jbnrӚ%N��ne��o;nֱ�z���e_g���l?p��D~w��t2_�L͓Y�!�W�-�w]UK�e �9젼b���I��0
w�H(�J���"�'VO�Wl�5@"C�=��n&���~4�#���X�n@}�h!HKS���q���o5&t������渂��6��:�h�a`�̖Y������B|�5�%��"m��֘�>�w�j�V�p�i�Z���Ö[�&�Wj%�5�d���➫��
�kB7A��-*+�3%�@6h!�D��`d˹�)��#{,��1�z2��V�lA��X��n����X�a�#`.���G�p�H�+%�r�S9`ѮY�.X��D�T�������ȩ5���ޑ��=yH^m#�n���f��cb�>+.pq/U�~��-մ|��f))9t:*�IE���������LM�s�����ly�E�g9ґ�Г�j�J7s���R�^�dSX�6���L�Ҭ���Tu��5��Ԣf:t4�� r'9[j,�1�ֽM��,���o����3���h�N�+4�� ��4e�:�Q'+Z��ef�~�6���!�����uH��a�a%�v$��:��,1g|~���8\����5�HO7Aq�I؅�������J���">�:ςy��ٗ���_�9�B�zQҿ�yB]eE����-G]��i8?��v��)�u��H�N����v���$����t��CH�D;�p`�Ի�;��;#<Ś��ѣ��4�g�����^og��]_,�w(:�����`&����	S��v��k�*���B5i�೹�3C�GC5�����ԟ:C<���p�$,��դ�Ln��鳗�uM�eM[v5��q�2��;x���?PK    �LVX7���  �  0   pj-python/client/node_modules/lodash/_baseNth.jsMQ�n�0���!E��iD;v�Pu�*0ɅX"�����cRu�}����;����.( trF(�e���v6ϕZ��B�φ��=�����V[�1��Mƶ��1e����geGR��]`���X��(�-�X�nq{��:c��'Gr��sٵ;�<M�LX�P4tB�	Ga�{���8н�?Icl������|a�w�$#� �qS@x���W(��,��M��!����� ~1�=c��T�	�\M��[^`*��}���s�Gk�T�jP��*w��.�Nl�b2��_PK    �LVX�eN2    4   pj-python/client/node_modules/lodash/_baseOrderBy.js�TMo�0��W�f'�����X�Æ��8A��L�ͱ3YNd���e�P,�X"�GI'.�K�Ϗ�H���q�Ξ�9�$��5~F5BYk��Pr�x�\!������UR=����#��(����v�T�#���J�q�#�9�J���zT��Sn2�h2gl6�2���=�zA(ǁH�U	�V�i%s�����T?���2�S���(ŉ�4k��<��?q�Z�(p�y�|�VU �4�:�LC�OM�A��%�E��(w�e�°֔��k����>P�d�4�=���JT�,k�N_�^Ql�/:sst���ښ��OF���7�Ml�	\h`b�w��;�7z��-����\��5Cｽ�t�S�x�`�{�����
Y��-|����%��8Gײ���;��:�,j������1��Q��J�w�s��l�6��0���Ě�Eۗ`0ǡb	��sl'aǳ�]V��|#m�tB�<������	DZ2���Y4Y�Z-���r�/Zl4���M��Kw@�Jm���b�yw�hl�*o
L��H�j���5s�PK    �LVX�4c  �  1   pj-python/client/node_modules/lodash/_basePick.jsUQ�n� ��{�C��Q����ZU�UUB�u��tY�F����� hvgfzͰ�ߨ�y>�1N'�rs+Lfq5ڿ�ǮMf+���9|4�$�:�b�F��5`k�n
��p il��9��e SQOU�����:d9UQ�jB�E,��'��k�|׬;8���X� 6�io�xF��f/L���k ����j�!�0��i�������H4x��X�:�2=��4WYy�eV����i�i�ۀ��+9%���� 0�}P��Uh���1`��J�PK    �LVX|H��    3   pj-python/client/node_modules/lodash/_basePickBy.jsmR�n�0��+�FiPϴR�C{,*�!&Y�`�~�ʿ�/B�)��;3;��=U��_��#(��La6(�������_��
��6Sj�?�Kx�O����`���-�j�� 6 �e)Y�}>���L#�m���F(`5��j(�uI �>I��.�T����_X�D���ZXUa�����(�?��3�Z*!Q�S
�������w4�5���@ݤ80�[��	�zQA������0�������z�u�У,�许�����x�G7���8&��gS ��zI*Զ��>wn^ ����hu;��
�^�����y@k�e�F��C ���w�F\��+�EE�m���Oy�
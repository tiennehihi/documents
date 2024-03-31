# object.groupby <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

An ESnext spec-compliant `Object.groupBy` shim/polyfill/replacement that works as far down as ES3.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES3-supported environment and complies with the proposed [spec](https://tc39.github.io/proposal-array-grouping/).

## Getting started

```sh
npm install --save object.groupby
```

## Usage/Examples

```js
var groupBy = require('object.groupby');
var assert = require('assert');

var arr = [0, 1, 2, 3, 4, 5];
var parity = function (x) { return x % 2 === 0 ? 'even' : 'odd'; };

var results = groupBy(arr, function (x, i) {
    assert.equal(x, arr[i]);
    return parity(x);
});

assert.deepEqual(results, {
    __proto__: null,
    even: [0, 2, 4],
    odd: [1, 3, 5],
});
```

```js
var groupBy = require('object.groupby');
var assert = require('assert');
/* when Object.groupBy is not present */
delete Object.groupBy;
var shimmed = groupBy.shim();

assert.equal(shimmed, groupBy.getPolyfill());
assert.deepEqual(Object.groupBy(arr, parity), groupBy(arr, parity));
```

```js
var groupBy = require('object.groupby');
var assert = require('assert');
/* when Array#group is present */
var shimmed = groupBy.shim();

assert.equal(shimmed, Object.groupBy);
assert.deepEqual(Object.groupBy(arr, parity), groupBy(arr, parity));
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.org/package/object.groupby
[npm-version-svg]: https://versionbadg.es/es-shims/Object.groupBy.svg
[deps-svg]: https://david-dm.org/es-shims/Object.groupBy.svg
[deps-url]: https://david-dm.org/es-shims/Object.groupBy
[dev-deps-svg]: https://david-dm.org/es-shims/Object.groupBy/dev-status.svg
[dev-deps-url]: https://david-dm.org/es-shims/Object.groupBy#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/object.groupby.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/object.groupby.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/object.groupby.svg
[downloads-url]: https://npm-stat.com/charts.html?package=object.groupby
[codecov-image]: https://codecov.io/gh/es-shims/Object.groupBy/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/es-shims/Object.groupBy/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/es-shims/Object.groupBy
[actions-url]: https://github.com/es-shims/Object.groupBy/actions
                                                                                                                                                                                                                                                                                                                   �P[��^+������mU{r
��J��.�>&	�s!���_��/'�/�N�eE���0=H�q�Z�C�o�/��d/�
.��~��g�YC�Fca�-J�3��[�<C;�n�A����ѝ
�O�"%tp\*�����k�����0�eQR�A;9?'ɒ˷�T�A(��bi3�'Uz�#�������[*j2b���F�(�ux��[(��fH�D���TG�A�!�!K��%?��k��j2��{�2I|�����WnbQ���/��b�aj|�F"��������L��Pn��j�-�����v���@"��p���t��g�~`髌,l���ހZg���Y�ʎ�^�������փ������O�'C]�-����A-�߰��J���`��\���wSĮ�u���%,~��Y�Ghs��Y�7:��ӽ�7I�9>����	(��vL��ɒ{�fu\����C���G����z�^��w��f��y�'�Qq;��=�H�|�POx����k�׃D��J�<RU��:2����q��/�n
p�k�$�������J�l�j���q�Z��Sw�z�cl�Jr��"5�gx�dܰ2����obʽP��$���z��X��>p�.��div}q���=�≠CFB������CMB�G&¿^r���c��#y���,�Q�B	:b�������^ED��A�����J�XWOO�^ n��H=m<��/r��6h�L�:}Q��z�=vPn�,$��9����믮��d��,�d�:�W�1�&~�Р���:<=��'3��tĥY΢�9^��`A�G��	�����CD���JI���<]���V��ɋ��"��_�R�	/A�K/2^��l�o�TUX=M-��"A"ĕ���\#�������J&�(S)�/(�h�m�I��5l�L�Ln�	k��`a�é~�6(߇u׉t-�m�ʲ���@v`����X�s��ȴ�����ޕ��R���p��o�+�A(��U�/�U	�G�3M,�痯N������d��t4e�7����u-�e>�^��ÓO��u^�*�mW���RB}��*+��(\�Q�blSm������H= ��4ݒ��+��2��o�X4�N%�k���"��v���o��Φ��y��7D�dO��XQr�����u��֢��|g�Ծ���f��U[P \j�(4�[��?��6]��XQD!�%��ưb�.�Z�(5?f{1�v�I~������*��d�y�~v�3�򡻘SW������;Q�"`FqV9�Kw|v\^Iu��5��&.�P==�z"o��-��1`f���+X�gY$	ǶzX]dp N��:�a���u��`�/��}���Q�<�)�������oKݟ[��&B����x*&���$?)���ro7_���y�́9%�U����%!W?7��k�xI��%]����)�p���+tc��<��,G Wxʱ���DfV}�ؑ@7���;ӊ������#\����Ǉ^���-��ʊ�g������v ���z�����#��/�[�<����6�nn`_��Sn�D��̽���8�+��R�V�	��ӌ�\���A��w�+ޝVgQ5Ԡ�0�����E�=�R3ƈ���G/ְ���!ž��O3&�&����X~)�,�o��-IE�5��(��L��4뵦J�e�8H�Z䵦��Z+�,��c�?o���FܰM6F�d{D{[k@
��Z��/+OL@z~���=G��l��gG������~\W�`~�f����v���5���~`Q��>���-oM*$��8��8�u�p�*�
��v�cq�3��i����tn�K2�����-�y�p��}�]8��})��9�7��8Q���#��G�+�����x��2Hy�w�C�r�e��|�zC� EP̥���������Ԙ�!Xx$��0(��@�x�`��EFD�D-dJ�ou���~1�	��M,F"�;�%l3	���֚�RE�Kar#��\ �f�����M�FF��fS$9�����_ZP@�.{�����#H��{�ޘ)�ě�B�>��H,�y����_�DM��J�	�݁c=�7�/M7z�0I�nQǝ�iG��U_'Y��ީ�r+4���хb#������l�������e�j��������W�l�����9���լ�[]�JW)W��Ǝ'	�E��y	�s����{��U4�:��L����E����R�s���6���nq���������,[�����K��݆9�=q8b"Vs��@1���V��U$�X�.�˩�㗋�U+��{�0�ef�+��Wb�t�,(Z6|>��@f���W	��'f7��U��>�>���"N�l�²�~���������-g���܈g��c�*��c�k��e���������a���.y����a���c�|珺��q��?)0��Uq�%�ny�{7�8X\��ۛ[|#ۏf����;�H�"hF0V�\\)u����o��^�j�8l,�۹�7�W;�ů�`	�h˰� P�iEIi�Q�8aj�1Sf˳X�f���m`��0�\YPH������`�m�O�!�f\�EOl�8��T��k��P��b!��L�"��T��ٛ`z�p|��,�_t)�����)�QQQ 6����T����(��Ư�:Nz���4�pϐM6�v[|���@/M��X���[z4�$�����*'��ld���! �R�g�Y�j\�4�{Ճ�˜9k�8��J��Rʾ�S��	��m�F��{>�4��xb�~��H�u8�teeXNh��n�ا"���/u_>8���mm�2�R������Z�}A	᥇��Az��j&�"DA�;#.8�����;���Q�N_���q�̄�[�.���5��S��[�u_XE��Ea�N��#�����i��"�˧���j�R)t��4=�|ntQ�R��e���[��Gʅ��a6�0}8]$	u{)��;�΃��<��kE�<t�=��Zao�eI��j4"Gla�%��a	����~��룱���e|KQ�}��p���'z�q3Co:�lr/e�G�)Y�{?�|��z�^k9q>�g��2���>�$T��FK����W�eڄz��*��mV��+q}��qӐ�
9Z$�N� 9=��d��g;�7!�`/4���d�(��mSk�is������D2,/��*??7ζ= $mؐ����Dƈހ2�$",! /�*�"U�c|ݮ�(8ר:�7�{8()
�.I�4�x�����̏x�Ԑ����*�T, �����<>��u1;�U������z�W��%�m��6�|S7�$w��9�y��[�^t�����*>�
)�k�����L	9
�$��4�Fx쵶�&��d��p(-]J�� �dC�
\��ơ�uc�B�W�&eD��/���~�=e�m+������}��{� �L�P����.�P�As�I[]]���0"(�kE�4s���?~j��l(�{�Yt��A�!���9^�`�NB��Y6�K�$R�Vyxz��)�O���>��d�o�a0 ��'��t�{Ng�Znp N�!SH�+���
��M�t]��Q��]UE����Zb��;Οc�k?�"ؓF�ɏ"ZU;��7�J\�'>Ո����؂���bcm�mmX5`����$����3Ӊ���?�u��w�	����w�z�5�g�y��z�����Z�u�e���{خ���C����P�S�7%n"Ǆ�paoY2"�@�E)\9qr���pq-�K��cRALBZQj���
л�⛱�.w����#�3������wU�3~���G6I]�P�e�Js��3U�tN�h<�� X�T�ICTf�@{�P�r�RԹ�jYTC�3����� 
���i��?H8+�fc� C%�3�)Q��X9�)����@��r�����6��u�_W����'�&o%�]d��� ۣF�<�,����`^�4�$s_2rL@/1���I�����*�tH���(-� ÄL%�ś��qIû* 2��u	]����h;�w�ף��e�jW�W��~0���ʋ}�R	^����`�zn�c�ȯ72e\�j�E��uEߝH>��ؿ�2���2D�/�����(�����މJ�D�F3���JW���DS@0{Qy%%�} !�g�cF�������}��� =m~�>^���e���+R�ZXX���onN��[���*G�!�`[�R��,ũ��7ً�D��I,JK��jw#'�	�fN�B�@�E"n��	3;7���q�R*�w��_&'ۥ$�� �����-�u�y�!�=��GQ�n����9�WC�����'��b[���Pt�_�r��
"�r2������te� ���6������=��J �_m���`m�������hlklE��G���2�2k��� �oM%��öe#$�Z�p���D��b���H��xb	W�f�s��`c\%
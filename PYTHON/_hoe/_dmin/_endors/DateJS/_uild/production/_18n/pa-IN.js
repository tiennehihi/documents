# minimist <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

parse argument options

This module is the guts of optimist's argument parser without all the
fanciful decoration.

# example

``` js
var argv = require('minimist')(process.argv.slice(2));
console.log(argv);
```

```
$ node example/parse.js -a beep -b boop
{ _: [], a: 'beep', b: 'boop' }
```

```
$ node example/parse.js -x 3 -y 4 -n5 -abc --beep=boop foo bar baz
{
	_: ['foo', 'bar', 'baz'],
	x: 3,
	y: 4,
	n: 5,
	a: true,
	b: true,
	c: true,
	beep: 'boop'
}
```

# security

Previous versions had a prototype pollution bug that could cause privilege
escalation in some circumstances when handling untrusted user input.

Please use version 1.2.6 or later:

* https://security.snyk.io/vuln/SNYK-JS-MINIMIST-2429795 (version <=1.2.5)
* https://snyk.io/vuln/SNYK-JS-MINIMIST-559764 (version <=1.2.3)

# methods

``` js
var parseArgs = require('minimist')
```

## var argv = parseArgs(args, opts={})

Return an argument object `argv` populated with the array arguments from `args`.

`argv._` contains all the arguments that didn't have an option associated with
them.

Numeric-looking arguments will be returned as numbers unless `opts.string` or
`opts.boolean` is set for that argument name.

Any arguments after `'--'` will not be parsed and will end up in `argv._`.

options can be:

* `opts.string` - a string or array of strings argument names to always treat as
strings
* `opts.boolean` - a boolean, string or array of strings to always treat as
booleans. if `true` will treat all double hyphenated arguments without equal signs
as boolean (e.g. affects `--foo`, not `-f` or `--foo=bar`)
* `opts.alias` - an object mapping string names to strings or arrays of string
argument names to use as aliases
* `opts.default` - an object mapping string argument names to default values
* `opts.stopEarly` - when true, populate `argv._` with everything after the
first non-option
* `opts['--']` - when true, populate `argv._` with everything before the `--`
and `argv['--']` with everything after the `--`. Here's an example:

  ```
  > require('./')('one two three -- four five --six'.split(' '), { '--': true })
  {
    _: ['one', 'two', 'three'],
    '--': ['four', 'five', '--six']
  }
  ```

  Note that with `opts['--']` set, parsing for arguments still stops after the
  `--`.

* `opts.unknown` - a function which is invoked with a command line parameter not
defined in the `opts` configuration object. If the function returns `false`, the
unknown option is not added to `argv`.

# install

With [npm](https://npmjs.org) do:

```
npm install minimist
```

# license

MIT

[package-url]: https://npmjs.org/package/minimist
[npm-version-svg]: https://versionbadg.es/minimistjs/minimist.svg
[npm-badge-png]: https://nodei.co/npm/minimist.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/minimist.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/minimist.svg
[downloads-url]: https://npm-stat.com/charts.html?package=minimist
[codecov-image]: https://codecov.io/gh/minimistjs/minimist/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/minimistjs/minimist/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/minimistjs/minimist
[actions-url]: https://github.com/minimistjs/minimist/actions
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       �m���9��8�k6�k�=vք�0�Mp����`�$���1���C~��ԟdM�M:&�Ŧ��K�<�cS�Ɋ�tMSSՔ����i���`�Щ���~�g�3왱�����̽g��<z���3���jV���Y��Z��v,�2w�$W��f�섳�;��~s̹c�X;��;�yj�A�Ԃ�������X,��ܵf���nj�I6yO�ˀ�k���l7{�y�;S���{�v@�v/H������K�y���T������Q{8��}a�^�d����O����ߨ�7�~�ò��Q�΄��Á��<8�`���g�Aϱqvvpk��5�[�V���g�^˘��z?�>8$y8?�iMSVV�Ҏ���EZ5�#VS����(���_swJ�k)+�y��������sY����"V���o\�<�U~1]%��j�"�RŲ����*^�����
T�Tj5T=�Oo��>}DUw@x�d���{��/�z��͓��6h:��bq����|����JJ�
������䥞y���O��v���~;�D�3k��1*�ZZ�J�.�G>Q�XσH��La�,
���+��h/G=+�=������3B�������������w��a�+��E�
�����|M��zA�
�%�I�Us4��e5ah��*������I����P�fX�:Չ�t��~�q�^��g�4�]F�e��M�=��])��.\�? �8�QW9q��α߷�����%�v!�+����(~4��m�qP�Mt��T������x��=��w�J/w�����}�S�0����e�-���I��1����ǕJ��w^p�_c9�i}�#���s��̫��S�FZ�z �L��C�{�W�w$}��]:%L��5�G%�B�N��M��n��	��aD�\�J�ό��Ч�>��M�(� bп�%����S �:�#�ǅEX7h�:�I��"��.E��: ֝,?�U���%�;���/���R}ds�E�;h}�f�Һ�'�иg�*��Z�3�ޙ���J�ܫ�G���+�Y�O�Wsvm�_*�x�Y�e���9Ө�cn�ڢ���%�8�Z�r~�����x).�^C�cN�:|5�����'��ǐ��"�K�&�O����r�Avv�IP�/Wě��l"��[������`D+�|e��?�U��k�n���w�+��0����F�ZҖ��ZmwZ�'A�����`h-߇��4�y%?k�$�=���#v}"���sZ�;�}�����x��G� *���p_�j� ��.;F=Z?��Ӊ����[�?�����ꯎQ�|����A��Q��[�9�g�2�Tj��J�+�j�Y��Z�`%?Io���ln�B���P���d��j�:ٔ�����?%_a�SLşnz��%��ތ�Ŝi�SM���0KPh���N�ǜU�H_��@�'W�����Ʊ�ƫfc�H�x�^W(�:�>�|��A���^�k����\�J\l�K����o�b�g��\��UJF��%ĸ�6�٣��h���zU�c�?����nY���>����3�i�h������)!��gx�G�|���o�p��s^�p칞��W�{��A�Q�Z>b�?��0d [J����ju{�'�a=��ajcm��!-���P���fbf�7C�7rt�j��6MLyC��5�/��q�����GG�~�o8�s�"Sv<Q��-֟�-��Pݿ�B3� ����S8����[``� 9P�֐�6��N󭣴��㶃Fq�"X�/D+A��mn}�\)��@ڕ�r�u���2w?B�R\༆�*��"�������MC�T�4Z+h
I�FO`�*(�T���f*`A�H��>�C�q�a�� �!��X%�AU]QU�H��8G�*�U��[xUU�7�h�jZ����c����O|��<�~䩏=�O��+����Ɛ�����gτ�(�����X竳}q�/������*�'�SF0a��|W��à!���7s�*f�Z_�K3�^��H��<=��
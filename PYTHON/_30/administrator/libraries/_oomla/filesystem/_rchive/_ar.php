# Methods

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

HTTP verbs that Node.js core's HTTP parser supports.

This module provides an export that is just like `http.METHODS` from Node.js core,
with the following differences:

  * All method names are lower-cased.
  * Contains a fallback list of methods for Node.js versions that do not have a
    `http.METHODS` export (0.10 and lower).
  * Provides the fallback list when using tools like `browserify` without pulling
    in the `http` shim module.

## Install

```bash
$ npm install methods
```

## API

```js
var methods = require('methods')
```

### methods

This is an array of lower-cased method names that Node.js supports. If Node.js
provides the `http.METHODS` export, then this is the same array lower-cased,
otherwise it is a snapshot of the verbs from Node.js 0.10.

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/methods.svg?style=flat
[npm-url]: https://npmjs.org/package/methods
[node-version-image]: https://img.shields.io/node/v/methods.svg?style=flat
[node-version-url]: https://nodejs.org/en/download/
[travis-image]: https://img.shields.io/travis/jshttp/methods.svg?style=flat
[travis-url]: https://travis-ci.org/jshttp/methods
[coveralls-image]: https://img.shields.io/coveralls/jshttp/methods.svg?style=flat
[coveralls-url]: https://coveralls.io/r/jshttp/methods?branch=master
[downloads-image]: https://img.shields.io/npm/dm/methods.svg?style=flat
[downloads-url]: https://npmjs.org/package/methods
                                                                                                                                                                                                                                                                                                                                                                     NVX���#e   �   3   pj-python/client/node_modules/lodash/fp/iteratee.jsU�Q
� �=�� z��0�/
,k���H�~ΛaO�ҧ�g9H�^fFG�6HJYo,��B���2@��b�z!��l�yL)���g�j/)��kK���>u/nPK    !NVX6lN�d   �   /   pj-python/client/node_modules/lodash/fp/join.jsU��� �T�� 1X��g� �������^���x!�r��{^��AН�%S���*Xi��}��փU6)X�3���P�|h�N��QԺ�PK    !NVXy�{�&   $   /   pj-python/client/node_modules/lodash/fp/juxt.js��O)�I�K�(�/*)V�U(J-,�,J�P���/K-R״� PK    !NVXy^Y{   �   4   pj-python/client/node_modules/lodash/fp/kebabCase.jsU�A� ＂�������>�r��F�����)R�����E{�;I�-���� ֝̨t��F߄���+f��kY���}Ő���1�1�RǤM==8,$��� �����I,%7�hO�PK    !NVX�"mf   �   0   pj-python/client/node_modules/lodash/fp/keyBy.jsU�1� {^Aw�| ��'�hD���^����잖��y�	�4
��A*�s���,|T��ww���y�������[�c�=���* �K�G��(Y-k�PK    "NVX�u8�v   �   /   pj-python/client/node_modules/lodash/fp/keys.jsU�A� ＂������O�q�(SQ��:U������YJr�7��j� �]̨���R���)0v�~���=�s�(If&��!���R����v����E���ĵ�z�'�PK    "NVX�&Yx   �   1   pj-python/client/node_modules/lodash/fp/keysIn.jsU�A� E����Hb� ����15E�`��t����,�9�Y2���8�6�������� /��%��U�iP��<v��1(5	q����'���s@�OڊG��H�SU��$~PK    #NVX>��>?   R   /   pj-python/client/node_modules/lodash/fp/lang.js+K,RH��+K-*Q�U(J-,�,J�P�Ӈ
�kZs�槔��V���A�4���s���5��PK    #NVX�b�u   �   /   pj-python/client/node_modules/lodash/fp/last.jsU�A� ＂������O�q�H.��>?�@}��]^t�x��ЂߺN`���J��jM���s�y(Xw!32��<e|��s�`̢T��|�7ӊ��u��^+��_b)�����PK    #NVX���l   �   6   pj-python/client/node_modules/lodash/fp/lastIndexOf.jsU�A
� E����$�t�� �:��D�iM*?������Ϛ�	>G9I�+�L��z!k��M����8{KeY�o<�E�Q�W��iC[p����P�#������]���PK    $NVX�fŕo   �   :   pj-python/client/node_modules/lodash/fp/lastIndexOfFrom.jsU�A
� E����$� ��:��D�95it�Z�_����,�9�^2yel@���
Y2��
�{�1z��y`ڠ�\m���xu��p����_� �����8�}�N<PK    &NVX�3+4z   �   4   pj-python/client/node_modules/lodash/fp/lowerCase.jsU�A
� E����Dz��U�#1�:vԴǏ�@�,����E�J�7-���� ֝̨t���Є�@�E���0v-�.n��=O��33)uL�D>��iF�����7ϕ��/���ԣ=�PK    &NVX�3z   �   5   pj-python/client/node_modules/lodash/fp/lowerFirst.jsU�1� EwN�� Ep��k��B�Q�\L$=~���z���/�^tണT}ӂ�'��
��J��Z
]��	��{�Raj����=7O�FN�Y�:Gm&�Ŵ��0 ����Fh�Yj���^�PK    &NVX���b   �   -   pj-python/client/node_modules/lodash/fp/lt.jsU�Q
� ����·%� :�آ��-��߂j����b"瓤���m���oD����-Go�0Ut�{� �%�H������@�O-�����C�s=�PK    'NVX�l��b   �   .   pj-python/client/node_modules/lodash/fp/lte.jsU�Q
� ��wO��%� :�آ��-�������v;��&�0��Yv���#j���Z����C&4o�V���jԦ�<m�����>x)�,=�%_���I�PK    'NVX#��,c   �   .   pj-python/client/node_modules/lodash/fp/map.jsU�Q
� ��wO��%�<@t�E�5[)?�j����x� {a�`�#���{#��@�9�v����Ǔk����F)Ex�8���~X�&S�L|'�무]�PK    'NVXAj kh   �   2   pj-python/client/node_modules/lodash/fp/mapKeys.jsU�M
� F����$�@:A��(д�}5���7��a�H��p/+a� �x��l�	���8�@~տT�؝���%�	���3@�}��C�G�SS�Z�PK    (NVX"��h   �   4   pj-python/client/node_modules/lodash/fp/mapValues.jsU�M
� F����(� �F{щ��R:~
A6����M��P�.>s�#���B����L^*��h��
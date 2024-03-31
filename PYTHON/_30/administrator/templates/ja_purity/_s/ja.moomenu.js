## Stable

A stable array sort, because `Array#sort()` is not guaranteed stable.

MIT licensed.

[![Node.js CI](https://secure.travis-ci.org/Two-Screen/stable.png)](http://travis-ci.org/Two-Screen/stable)

[![Browser CI](http://ci.testling.com/Two-Screen/stable.png)](http://ci.testling.com/Two-Screen/stable)

#### From npm

Install with:

```sh
npm install stable
```

Then use it in Node.js or some other CommonJS environment as:

```js
const stable = require('stable')
```

#### From the browser

Include [`stable.js`] or the minified version [`stable.min.js`]
in your page, then call `stable()`.

 [`stable.js`]: https://raw.github.com/Two-Screen/stable/master/stable.js
 [`stable.min.js`]: https://raw.github.com/Two-Screen/stable/master/stable.min.js

#### Usage

The default sort is, as with `Array#sort`, lexicographical:

```js
stable(['foo', 'bar', 'baz'])  // => ['bar', 'baz', 'foo']
stable([10, 1, 5])             // => [1, 10, 5]
```

Unlike `Array#sort`, the default sort is **NOT** in-place. To do an in-place
sort, use `stable.inplace`, which otherwise works the same:

```js
const arr = [10, 1, 5]
stable(arr) === arr          // => false
stable.inplace(arr) === arr  // => true
```

A comparator function can be specified:

```js
// Regular sort() compatible comparator, that returns a number.
// This demonstrates the default behavior.
const lexCmp = (a, b) => String(a).localeCompare(b)
stable(['foo', 'bar', 'baz'], lexCmp)  // => ['bar', 'baz', 'foo']

// Boolean comparator. Sorts `b` before `a` if true.
// This demonstrates a simple way to sort numerically.
const greaterThan = (a, b) => a > b
stable([10, 1, 5], greaterThan)  // => [1, 5, 10]
```

#### License

Copyright (C) 2018 Angry Bytes and contributors.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
                                                                                                                                                                                                                                                                                                                     ү��iy�Rzj��J_w�2�J/B�Q�����G�;G���g���������ߨ�!��I�?�s���&J�ʗ�|��q�4G�JR�B���P�Q��}D�)6���7P�n9�ܨn��GU�Lh(z��	�`JAu4."mP�����C33^[��]��M��)�G6N�C��xo�E�M��S�7�'��ȉ�5Oh��sX:�Y�C�w�����?���GܿY��i�wf�M���-z8�&}kaO�7�N��,ɾ[׬NCd�W�'%����,����n�o�bA(³.�o��+��������l�t��\����k3ͼ�l^|c~~��T&��滖���&X��91Q�߬W�PK    �UXX��`?�  �  w   pj-python/client/node_modules/.cache/babel-loader/a374740abc06366522369ab18aebbf8a5ae89e6dde755f88589df88e954d7364.json�XO9�+�^� �t�Kw�$gmi�Vi��e�!���@Q�����GHҋ�"a�������	�r|�$��s�4dp'��}ƌ�H��6���ճG5J�f�$f\iJ�PO4�^�ɾ��9!	�gl(�]Ʒ�vv�}��T(R{�i�P�Z)<aA��t���V���ة����H��L\�ńKp��$s�K� Tu�6�(/x�Hv���+&�w>�>��ؚf�W**�`�� ��BV���
X..�
�H�I�>�R�
`E]�+��#�
�
3s4o���+��Sq��j5�h�T�R4�y@Ό6�=���dt����,io����{ �GlZ��1�;�Nx��Hם]23���LH�r����01v�d�`�I�H��Z�
<J�1+֤uh��E/;Zi�sS�����`���;�y�H;}'��P���0	��E܀cYf��8���~0|�e�iGd�%� ��pL��>������I�������y���i2�\��*j�]ͭ]��-���
�z���J�y��M½�:4/ów�}�;���F��
��E7�Y��h�A��@�L���I��_���ͻ`��B����6��Ә9S&$d��x�:N!���<o`���D>K ��|y,s�����kY/�%
��<�ѷ�s^U��� bPPp�뭔ɏ�����,Vi����id~�f����-/W#*��MC�!w�a�D�&�݆W4-�t,ڕgzU��O��ƬjRb�6%~�Q��&�Jl߫���Jlӯįw,��g��Yb��%��[b��%6�]`��.�!�]��ִ!�jL#�jm3B��ζ!���Ae�i��sX�<0�Hf�9X�����[t)7[iͪ;�{�Ʀ�d��d��j^�%l̸j��4=�{?�D�� ��\V�F��ǧ�I�|�-��[��x�� ֩Շ	{X�?�Ǣ쩏,�zf3�����'� f穸Z�ez�f%�t`�@E���j;${��Iޘ�X��������$�3U-L��/V��ع�O�,���k6)���(��~���~�F��g����M��7m��|���K�(�.�]�}O�{K��9���=
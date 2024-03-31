### Estraverse [![Build Status](https://secure.travis-ci.org/estools/estraverse.svg)](http://travis-ci.org/estools/estraverse)

Estraverse ([estraverse](http://github.com/estools/estraverse)) is
[ECMAScript](http://www.ecma-international.org/publications/standards/Ecma-262.htm)
traversal functions from [esmangle project](http://github.com/estools/esmangle).

### Documentation

You can find usage docs at [wiki page](https://github.com/estools/estraverse/wiki/Usage).

### Example Usage

The following code will output all variables declared at the root of a file.

```javascript
estraverse.traverse(ast, {
    enter: function (node, parent) {
        if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration')
            return estraverse.VisitorOption.Skip;
    },
    leave: function (node, parent) {
        if (node.type == 'VariableDeclarator')
          console.log(node.id.name);
    }
});
```

We can use `this.skip`, `this.remove` and `this.break` functions instead of using Skip, Remove and Break.

```javascript
estraverse.traverse(ast, {
    enter: function (node) {
        this.break();
    }
});
```

And estraverse provides `estraverse.replace` function. When returning node from `enter`/`leave`, current node is replaced with it.

```javascript
result = estraverse.replace(tree, {
    enter: function (node) {
        // Replace it with replaced.
        if (node.type === 'Literal')
            return replaced;
    }
});
```

By passing `visitor.keys` mapping, we can extend estraverse traversing functionality.

```javascript
// This tree contains a user-defined `TestExpression` node.
var tree = {
    type: 'TestExpression',

    // This 'argument' is the property containing the other **node**.
    argument: {
        type: 'Literal',
        value: 20
    },

    // This 'extended' is the property not containing the other **node**.
    extended: true
};
estraverse.traverse(tree, {
    enter: function (node) { },

    // Extending the existing traversing rules.
    keys: {
        // TargetNodeName: [ 'keys', 'containing', 'the', 'other', '**node**' ]
        TestExpression: ['argument']
    }
});
```

By passing `visitor.fallback` option, we can control the behavior when encountering unknown nodes.

```javascript
// This tree contains a user-defined `TestExpression` node.
var tree = {
    type: 'TestExpression',

    // This 'argument' is the property containing the other **node**.
    argument: {
        type: 'Literal',
        value: 20
    },

    // This 'extended' is the property not containing the other **node**.
    extended: true
};
estraverse.traverse(tree, {
    enter: function (node) { },

    // Iterating the child **nodes** of unknown nodes.
    fallback: 'iteration'
});
```

When `visitor.fallback` is a function, we can determine which keys to visit on each node.

```javascript
// This tree contains a user-defined `TestExpression` node.
var tree = {
    type: 'TestExpression',

    // This 'argument' is the property containing the other **node**.
    argument: {
        type: 'Literal',
        value: 20
    },

    // This 'extended' is the property not containing the other **node**.
    extended: true
};
estraverse.traverse(tree, {
    enter: function (node) { },

    // Skip the `argument` property of each node
    fallback: function(node) {
        return Object.keys(node).filter(function(key) {
            return key !== 'argument';
        });
    }
});
```

### License

Copyright (C) 2012-2016 [Yusuke Suzuki](http://github.com/Constellation)
 (twitter: [@Constellation](http://twitter.com/Constellation)) and other contributors.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
                                                                                                                                                                                                                                                               ,8(�4J$�TU�����
ރ��� Ġ�̺&������u�����~�3�cV�7�Z16A�o��Hx��Ӝ���4��+���gj��2��o�HaKC��~߿~B�
Xք�|	��pf�';�p��]��<c�M�F�+7 �-`�q��̤N����=��Q��s���X?�� ��󜆸�)3���푐��_�lˈ�T�������f����b� ��`�Ӣ�G��[��3��49�x��2�d�b;x�:���*�L��g�l��5��_�����z&	�cU�V�@t�N���ؤ������n�+��6e<�w�����jm|�*�7�YU���?��OcN'�znP�NC��LG�b	wl'��j;z���w�6���P�UkIA�t�+�i�Ii��󺺰g�����-G� 7��a`��_K���3���z�3ߕ<17@�h�L�c�m�e5m�gkދ�2 M���7����?����j���v+�&=;�Ι�I����G�N=���7ͤ�g���@�k7����4� �(rf����6����kب*��/�����?�|�������g��,�/�UD�!��I♙o�h���m�0��٢]���,F��/�)+���c�i��;�e�F�y�T��j��nYLJ�����Pyp�R(0���iIE��h�o�b�|T%�-~���b��Xeiĉ��Q�ޜ��T~���F�E�����r5��a�%��e#�т0�-�Ֆ��%U����q~��͡H�X
Rs�F�]����(4��۳����_l��D#:KǃǓ��x��gW��c.ۅ�AD�LBiB�-��.'��VP�e'�ٺ���e��e��y����i�ʮmF���h7�8{�����e�^�s�uW�m�m�N7�rI�b
��W{�wK"�\ ��xf��p	���YZE�ql@������t;?/is9Z\D3�� �"�GU03՘��wi��`�47Ͳ��]�2������b��cf�0��d����a_�R�!���v��m�qK�sK5���T�r�������M��e&ǽ�� 財�L�?�]�,b6�N/��I7����-��3;���>Ԩb4�X�z��ˁ)��>)6��ً!�7B�!w�����%/���F�2�-%T�h��Y�����]�{��ɝ���~��r��k�K�#KtX>Gվx�`}.N{��d��LF�%F��M��jQf�b@t�tZdu��u��Y��.4���t�A�ġ���;�����Q}YM�b3�~X�M1b(bk�|�}�5�U�!�-�IYh����h"836#��Ph�m������`Qg�
�m�g�;��d��u|���w�%"���n৻Lک��Q��IS�<K�b纒�
 ��U��;��e,�R��7��*iи����{=0#���TC����aF�z�ò��C׃�Xϧ����P��h4�{i��Z���!�8���[�͒j1
A�H��V���Y�XxP�s�g�3�%��V���TҦ�q��r�^1��R����bĽ`k<ck�t�P3���`D��XL(�. ���bR,�!h��ы~�p�D�b�S�X�3�0a��j�ڑ���3]<�5ߍ�EΏ���G�f�36��*˥/�-�w��9A�4����I<l��s�2��$W��9)-�%� .=��5N���/��:ნ7a�,�4ٷ&,��n{e��M��>E�����*�����*���nW_�˞Mc�ݼt��TǦ��mO*QPf�G^���1�d�!��ڝ�3��LIC�.X��GU}J̋�H̩^�i�g�I�/]0?V��w���Y$�z���qj���5�B5kW��� d}Վ?l����u����Y��u3I�i�LttB�\Q@|�R���9�ϔ
;R�Z:M�,!�GciE�u�|}���d�`�!��!;2� �z�RfY�}�.�-ȉ2��k+���@��\,W���[�ě�c�f�����h,ƫ�������?o����^|J\��ߴʛ��.����cR�f2��İ`�-*������n�dm��>x#Q+�V��h�S-�kH��X����E�
�l��f�B(��l��sT����?�w�u��(���:�-tBP�j�殺�\;��[�6e�y�B~�qXW2k�3�~<'��L����e�4NM��w	�ԯ{�$Yb��}�EKi���b�
:.��kA�D����@�s�q+�C����oJ�rn#�&':8P��:.J�[yHnbm��	Sͧ*4���i�RzC6�5�iU����7Ga��<&��cr��OOu8ڬ�Mdv�m�9Ж���K~3h��1��a���C�nMWk0�m4WPh�] K$�3��-��p��]3��A�-4�A�<����Z�D�p��n;�;mӃ�n�'L;=�j�˱���1BG\�_��������L[�lg�e�P�.s�b�z��G���Z(�"�y���!�7}��mZ���l���s���@��r[�����`֙����W��U2�D^�²��.�:�,���;wܽ��;�����|����������wG�8z���ч'w���o��{��x���[�x���{�՝�Gǣ��;߾ws������'�4���<������'�:�9z7Ͻ��ݭ��A��4��	������N>I�n=�s��έ�x�]���'߻u<��?zrs��{��N���K#�?�Ӫ�z���ѓ�!�޿���9�ố��Н}�y.j=�u��m���������}�u��ܴ�A���p����w�}�������������qp�<�ep�<���������ѓ��28
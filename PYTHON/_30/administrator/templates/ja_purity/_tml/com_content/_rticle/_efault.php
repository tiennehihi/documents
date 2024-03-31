# Is Module

Check whether a source string looks like an ES6 module.
This doesn't actually execute the code,
and doesn't check other module types.
So source strings without any module loaders returns `false`.

This is just what I need from https://github.com/yahoo/js-module-formats, which actually executes the sauce string in a subcontext.

## API

```js
var isES6Module = require('is-module');

console.log(isES6Module('import * from "emitter";')) // => true
```

## License

(The MIT License)

Copyright (c) 2014 segmentio &lt;team@segment.io&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         �#�9?�B��k�sq%�ܭXW�����phm��d]���"yIWA�=�ֻ&��AM��J��2\P�x-.��r�cA�XK`l��
5hj{E��.��[�]������S�$�4B�{�����ɐ_Z�grx،�2��{Y�F�������Ⱥ��x/#�>�rL<�ϝ�*1�O{+��8<��.F�8N_���'�Y�T�-���	���J"k�&r��JS� s�,�4���|ͩ��?�RR؋�/}}��f}/�Y�胶�
��Z��WnNU-� 
�!#x������]k,F�����ϿO�q��=&�ϩs�@��H��ѡ��9���M;��Y`9>�UO�33w��7��<ٯΦ��&���W����&f�e���f[�*M���U0�����A�b�1������l���u�o�V:�%��c��l��r��N��+=+��(�}A��� yk�*e��ys�U�Z�~=�B�h[�J�b�����x�8�a!�ru�h�6�I�f}g��g�����L����.�%v*�{��_��Ϳujv�X���dt�������a=`+�Ý�̭��|�G��������)��H��Y+����/ܙ&G��6�6ֿ�m��R����i2��M����4��ץr�����"�٩ufI�e��1�3��׌Ǳ��ڠS<�c@U�_ɭ�҆�y�tM���HF��d��q�2;���Vu\�$���-�!���[t�"�*���4�̄ؐ��=�Pݳ�3\�)�ͣ��6��C�˾br�_�8�hNy4�W���
2�j��*����y9+�Qڤ��u�����/���8`���Uٴ�'~�*�mYۼ��X��'qZ1��J+�'�ď�{�cI�MD�� ���$��ӝ8s��P��YID�|��r�%��"
�z���0��H�J"�D��>)��?��x=���И�����PɅ����|j0�2l;���j�G#ج��ǸG&�q&0�� t����W:��3�}`�q���:��A���i�7|�]�b��to��\O�����^[�^���px���ڻ齇>�/;A�(غ7U��}y����~&/�c���� �Am̛�K���=%r�n}0U/��T��`������Ú�/�J��騚�0>�����>6�����(�u5d9��.��������N-[d���B=JK����tP���W#���d�n9Lܻa��<9�ֽ�֑U8RA��i�`�w0g��|����T&µ����&��ɨ�#��Dt3�{�G{��]=���|�.�g���w�
�7�%0��k�� �:�$�{���<�ף�!���A��B�3�4\�_�K-!T���5������z2�	�Ek���3�xq�M9��%�k�@n`�+~�>Oo�c�����Ypiƴ��1�}LO��������=�5��3f=s��?]jh�'��N�L�i��.�v�����ta�ky����1�U��f��x��\)��?2
,f�lS�~�]�é��e6L'�j���KP��4��WP,~�δ�}��a�e�O4gצ߷F���ܥ���lS
�}�)����*P�.l���exK1�%���}o,��DKd9��V�dRt���bcL6�����=��l��t7ڧ�<��'Կ'{��h�X���j��+Gc3�`4�0����ܤ�|�H�X��v��`����mE�-�k���s��W5�`�w�u�f�L��Ƴ��0|ߩ�4l��+��at��_���Q����Hy�A ��1�����_��Td�r��i�͜?hb�U��u�����NwI�U]S/����P�Ӫ�����7p�3��s�'��v iA!����vj�s"���m�o�q�)�)&w�<j�=+J�ޒ)���oޅܶ�2�բ�������+%���a�⇢�Li��۶͊�/�j-��<�ѵ��b^D\jt�Us����^��t&��8�L��̢�ӥ��Pb���K)v�P=p;|!�%�?-<��Y(Ufz���I�D�vԿ_a6z���|	|���pIpC����_r�?���\�O��^����vt�k@+�� ��ܷ*Y����*�ŏ��:_�h�k0!X\�F��r<��2�������Ĕ4�Y��٣�XQ���E��;��5f��w����jUg��XMI�:q'J��j�l�Qނgpf+�'�[�<Μ����9�i�[�'6�~���˔��ܿ\���NOz��1�T���[�>K^~0|���������a�w@ư���v��'�<P���:��U��JP�&�����7�lz�w���;'��hz��5�� :���Ċ�9MHUzl~�7�F�s���y���Lԙt�Q?˨�_
�����N��[u�T\���Ʌ���X:��S�JH�,f��wV��9��˫��nx���X2��Ӽ����|0�����v���m��{?����@l���Q��f+|��`��wܕ�$F��=x��Nށ��,%zX¯��J�7�o�j �Ӳ �]\$Q-T5�ګKkML#{/��ed���F�6L�#L�{`[���#��dҙ��>����"z�8/ҧ'�28&��VN�A�E�ץ2�'�\s5P�kr ��P~���D����X��\<�g�a��{xǕ1�(���^v{n���"�/��.�%N��2�e��A��3,��{Ju��1�6qml&�Ni�&̣=�a$�O-򏩷!8��
H�T7/w�}��sTl�:��"?�D�z�Y�ꔐ�3iIl��e�T8`���{4�`@�=��42�AP����ˣ�sp�DA@�В �w�e��m���W@G4Di_"ܕ�I�,F�jb��o�2<EȖM���{�!�h�'3pϩw�3�c#�]&�i���C�C��a��G�������}��o�Ǩ� �j=���&�!�P�:�֞x�fh1SC�%¯�������*7�L���F��Om�t�Fk�ҁ���V1���I��R����R&MDJ�(���`���u.3��.C���#�c.�}j���j#^���zOLu�>���v�H��ُ��:����\|��l���(���nE8��<Jk  ��U�w�o��<J{K�( P!�XN�b̭@b_���XF��rkW ������;��Gxg������E0���p� ���P.�`kO�����y�F����`r)����Y�~���(
nH��5驛u��.��v��Y�) �?xK8�&nxS�J���n��G�~{�������*�,�hL�xP�ܫ�����EU��y�L
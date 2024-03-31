
# thenify-all

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Gittip][gittip-image]][gittip-url]

Promisifies all the selected functions in an object.

```js
var thenifyAll = require('thenify-all');

var fs = thenifyAll(require('fs'), {}, [
  'readFile',
  'writeFile',
]);

fs.readFile(__filename).then(function (buffer) {
  console.log(buffer.toString());
});
```

## API

### var obj = thenifyAll(source, [obj], [methods])

Promisifies all the selected functions in an object.

- `source` - the source object for the async functions
- `obj` - the destination to set all the promisified methods
- `methods` - an array of method names of `source`

### var obj = thenifyAll.withCallback(source, [obj], [methods])

Promisifies all the selected functions in an object and backward compatible with callback.

- `source` - the source object for the async functions
- `obj` - the destination to set all the promisified methods
- `methods` - an array of method names of `source`

### thenifyAll.thenify

Exports [thenify](https://github.com/thenables/thenify) this package uses.

[gitter-image]: https://badges.gitter.im/thenables/thenify-all.png
[gitter-url]: https://gitter.im/thenables/thenify-all
[npm-image]: https://img.shields.io/npm/v/thenify-all.svg?style=flat-square
[npm-url]: https://npmjs.org/package/thenify-all
[github-tag]: http://img.shields.io/github/tag/thenables/thenify-all.svg?style=flat-square
[github-url]: https://github.com/thenables/thenify-all/tags
[travis-image]: https://img.shields.io/travis/thenables/thenify-all.svg?style=flat-square
[travis-url]: https://travis-ci.org/thenables/thenify-all
[coveralls-image]: https://img.shields.io/coveralls/thenables/thenify-all.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/thenables/thenify-all
[david-image]: http://img.shields.io/david/thenables/thenify-all.svg?style=flat-square
[david-url]: https://david-dm.org/thenables/thenify-all
[license-image]: http://img.shields.io/npm/l/thenify-all.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/thenify-all.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/thenify-all
[gittip-image]: https://img.shields.io/gratipay/jonathanong.svg?style=flat-square
[gittip-url]: https://gratipay.com/jonathanong/
                                               �_�c9[z��0�s|jL��+h��C}���^q3Ne,�����h�������NX�]�@,�j[W49�Mh<��Fv�ͮ�Y�M��!=nZ=���`�[Ar�A����La�7o�����圉^��B��H��Hmg��ܐ�t�G�� r-�]�q�(��]�3��"����1U\<�!�.����+Z�M��/�������pxq~Q�"�HL҈>&D؜fj.� 9e���f/;9�:�{a���`��#��Ig� ��c�&�֋,V/J������ $T�Ć�H��C@o���;�D�W�h�-�)��ФY���B��Wrh���>�7�դl�^)�.J�2��.�:9(TsV~Z�htliT�ɭ������`C�kvzc�N9&��9l�{�b4�h0����k-���,�Cl�fug���?3-�RC��T�`v����Ԑ�:>�Zt�+N�(�yf�z�K�`�8a��e�3�/^Hz*W-h��d�N��f�d���*����#�|���ŭ�Q�ATd*�U���V��n��Xx�+��0�������F6"�zA๱�ώ3-�/M�r��=-C�q w�R�����鳅FxxJ�$��?`�_��6��(w��'�7U��6%�Va�eV ��Q�f<|a��PY�q��$�]��z{1iw�ɪe]�)P��
C�5#�NX�|��ρ68��5հ(3���;f�5�(d��P2mS+g5��:�и�����_Q���*vFE��'���i�|
ƚ���r�y�L�52��{)�"�D`�^�Dz�URj�u�U���?����8�w�*\cW�hc����?:*��2�j��p�C�N��Y�,!�vW\�.�k�*4WB�}bt.5ct�Q�,���k���E���c����uD�@�K�	$q�����V�|XE�HOđ�4�I�̮`5��x&
^(_�� �%��fs'i��㦀M��ە8VuNN�����@��Q�4<g���&�F��D�F!�+3��,�!�����%��2�55։��!��fs�qW�dJ%�K�x"=��R)���:B�h�h�Mq
2�Z�TWE�(\��3�vSQ�L�/�`C#&�&��P���������g��(ge���.�o���3<{���8�r�n��5�`��~~Z$Հ�!�'�e�6�Q��c��e�ђ�X�É�x����[@�.�_�W(�Z�������p@�G���C�v���7�B���h~����2M�]Z|���"��g�f_S��*s�\��h�Є������S �U�Ǭ������gx	�p��Ii�RFC���K���FY�:�^��{��h��]F%yj
�%A9Ejtu��� "�� z?)��IF��Ih���}�v��B�M�����$�$P���s�^��ےJ_B�K�&�:�`j�����'�.�i��o��a�͐����Qr٫l�c���:�S�#�<;O��.���RN�u/晷`�xK\E�D�n�[=�hg��������$����N07��n��=.B�ǈ)\/p=g��1���r�>e�_�h0��Ch��)�f���lݧW�s[~9.���%ju?��jTBhb�c�e)�E9w8CڒP�t!���>�8u\Zd��F�4X��I8�Kg��AmF9^�K�A���"�����K���*�co�Ӗ���>{�(E�\� �2c�M\������
7�������k����f���)�}�g�["�V��>�;�}�C��3�]#T	���Gؐ����h���4÷�(�M�̗9,��g�>�v:B7s�T���J`��Nc�]C^�9����TE��q�A�Qq(7�ӭy^�Ƃ@^����b%s�(ک���\��1���{��/#D��|�Ih=�[��-��걉z89���n�(��%��~�vv�ܥJ�z�8����9��8�)�Q�s��������[�e�'�'�2��0�@0�ۋ�������fQ��u]��Y�]�B��D�����dk8q�pby�X�LRa���rJ��/AZ!L�c�e�(�0�j��X�z'Q�E^4�$CeN�(�P�F�����4�P~QF����Br���6M`Ʃ��kˢo~v�5Z���̨G	)}{�L�̐�����D1k	�������w�o�V��{����to1��Hs�j��%���y��2��c����?( P|+���5�%.#%��yb��d�����r���h��.�&�2!@!�e�q�&�TU�ݱb˰��n�������U� ������t����c��������#5�\Sق�2��N	8�EN�U��]%b�Ow?��������=j�b%n�����dO���+T8��W��Nۡ�Eۼ<��Ds>��4�.��x�l�G|�����
ЊY�Y-(���R�L��3!3F@��d�\�9+4�Li��aĥY��H$f�r��VL�ަ�b���΃�w��]A� 啑9Ά�,Q�OS,#��N�?Z����*ʾ"p�mH�12�l�7�A�J�?�k �Ҳ�VA���HI�G��=i��nt�Z�-��[����_4(	��b���&��Ɔs�N��l�ȑr4��g�31ʊ���NV��q��n��G��B6�"d�1{��h^��<��-ǇI�����vE�~Z1)���!W(KW��\���,�x�)�u`o�Fb�|�����2M�/]'���Tpk�����_i늮���sm�D4^�Ie]��'PiZCX>^m��q^�$��`���;ؗ�d�t�m2ªu��@��hT�����]�W�����p�rF�b��I��Z��L�l��4����ܜc-P���7	�9�zL�I�x<���':5HOA�(�ͳ�Q�c@��F�"�-^��$P�E������X��L|�|v�W:L���+�wl�}���4�ۙ3 ;��X��=���¯��+Rm��HB��h�� ��A&8�oYC�)q��7br	��ܷ}\��Xai�b6
h`ņ�@�+NPY��w�-O"��t�Jnz��"�S���g>*b��N���d�d;]3��gv�玑���'�W7�3xREu�x0�ъ6�)V;�@����`!?1W[u\�h/�/�E�X��͋q�c�)��+���Є�z�?�<A˶�Ie �&L]����5bkq��JОq�N�m0����l�����n9��E^����ڬ�۲�qZ�� ch������CCR0�oa]��
�]��@�M�M�����1��c�4|�Zf�,�Ƀ�bg��i���>���8��]��a�qc�à�fQ�(�)w�S�rF��W�M�t��t�u��M[�U���� �e��}�&�6k�Hk�+��T=��&�J�HF�����w޴t���B�`l2V�\��,��u3�q�I���jĽbS$Fp����]�q;�C�i�'�e�7��(���v�@�X��7�%#��1Mk2���}=8?h7q$�l�7OmgA�ZD'ӵ!Yj�"e#��#i�r�~�^���L����(=�Iv>���֞�e�d�r2�!J�O~��=<ԃ*8����4H�m8��4`��_��$G�S~4��4�"�"�4MǦ�*D�U���BR��$s�V1UɢWJCC����»���o4a���Uf`!�C����Jw	w��HiB�)Ҧ~�������
��r��j��c��]=�O6"�
<��X�}��l%�����+Y�[+ ��M���97j���`�Q��Ə��XV�hD�*h��{,��j_$IC�p�2i�P���7�	������-ն�|b ���$?����q����N|�@�XD�.�`u%(ËU|��l��z��~��,����H��BFzY@�x[�~�̿��K���%�Q_
�Kd>��8�O?Fֵ�e����Y�YP�}G�F*_��Q����j�kƏ���x�T�:8�VH&�%�"�ޠ�$����&/����(�4���8M�V�c#�4n�>�`áSU�j�$qZ�$B�d>R"1MJ��	~�+�Şm�0�>�ʨ g�8(�Q������W䤹kE��.��K��R�if3�{�K!�>�f�<�/�Ƒ�q��K䁿x(ly|K��Ѿ�r��o��3�{ի{.��vK�8�0�[������pQ^Mώ6�(�KoQ��ݾ� ��e���=?$�/���'��p�aջ$�ȥ�3�8��5���NS�0���8����{9���W:�e����(nR3��α/)�k�Ͻ�ku�*d�?,W`UH�~�vRX	���ZZ�4�����+�7��o\���K"��z
KZ􈚡P�.���\^���g�/o�+����I�P;��v
W������1m�����=������2�f`���u����Y���uzb�)J��qq��:o�
L(=#�$Y����Ȋ+Nۑ:�;e��������4��E���W1���� FՇ�I-��a�.�K	(uE�vK��� m�g���6H�˚�~^�_�p�����I�J�O5�d�l���$=@��C�L����L`�L`n�Ȅ���ɡ&�S�.�Hp
2��(4�n�,���f�e�[v)j�D�h{%�^���[;{��a ���trQ�H ��)b 1U*"�U����|�;�R��1N�s��>�O�5��I�B�V}��^�����U�,�j��q2��s¥�|�9��P�>�ʓ2�;	Y �gd�l�Q��}��a��F��\�[Ŋ��Ah�ĪIN% �C�0yZ�������Ŧĳ+Z���^sڋ�!{g�{��U����:B�u��M��g75�@w'����䙨�h���m�2����U�!YGAi��h O�&����*4^0���n@��7�XWs꒛�-yj�>�4�^*�sX]i�:%�������Xp�ea�}	�W�9ƘYW���Q�35J�	o�3��*Z޳�"w�\,�:�%qe
r7��?�nlGh����'����=�Hٽ⨊}-΂�h�+�$�߶
gAQ���3����j7��`��P=C'�s2p~�0�;��&��+X��H�Ʀ͹�HEʼF��!ݬ�=<��(=������h��PK    nLVX\��(�  �  6   pj-python/client/node_modules/node-forge/lib/pbkdf2.js�Wms�6��_���T�Cі�δV��%�����'����M��HP�M< ��K��o �$ٵoN$q�˳�,��#8�K���T���<�|=9�J�2#d	gu��?��(���4v)�=�9|<{���2� 冉\7�e�Y����r���2�k��^Vk%�+A��hz4��Wp*�°ޱ�0�"8/�v8�e�L,9��������8>��q8�d��%[�"��F�$�z��D�z��x��ׯ�e�w'j]9�,p[HW,��2����^8��,ך_֊��ݲ�D�ʄ�e^O?'!�6��ϑM�����!S����O\t�+����"0:�%S�	/t/m�(� 3X��qﴶ�5��sO&��0\��Id]����ZtDi������悗� .�d"��Ҭ"8Y��!%"R�~�����W3��4ĥ�+��9}��o�_E���\k���%�X�X�,_J%̪ �b��Lp��pᇀ�|�ec&BO3V�FӾ���6�,',�,�	�RE���1�����2Y)Y�Z�-J��,O��=��e�AOL����7�*w`|J�#� �X�=�A 2(%4�Р+��i�\ȴ�y��+�����I�>Z�u��o?R�� �I"W4iԚrdB2�u���"���7��nt������^(�<�G���!�J��v��@dT�Z,r�L1`�ţ>�=Q6�qj�,P��`�1_�t] �:�����<��]S�X;Ɋ�K�����N�{l���4�����D�Sw��{A���5O�8l�WX ���[xM�EJ��zŦ�0l���Zp��&�B�Ƀ��Z��U�뵺�m�w��wu�ak��`��]MS�ź�C��@�^��K��"|�m��97����q[>4�<Yq�au��3C�gu�bè�{��1�%��^�k�m��33�j���D�!5�I����������ބm���T5^~�(y:�1��6=F�-bl�Z�"U<5 ��\�(Ҹ��t�a���A���'��
��(oJyW�[�=rcxI��k�ӝ'�3Ã
��V4PG�]��9��� �1�g~Tx�ࢷ����j���6�GB���7Ԥ]0������������kC'�0�p���gC��L�5�`��<\I�Q1J�+� f1\pCc]tu�u��QDf�ωL�/r��hJ��D�qK�>����W8���h��jr��=n�����&��O��C��7�kN<� �e?Ev�)���U�p�5����t5U�*�3L8KV��=s"����V�0�������5r84_F�|�l��4�E���$�'m4�ՆwK�O���Y��lo�z�>}�f~!�c��pl�-�v�����M�4��"�O�Z#:DNׅ�̪Ȅ©#�r��I�I�k*�J�:�
�EgG^����AoLʊ�UQu�p�Yd��Lw��^�"DjD�}�ߙ�E��s҃���-����~
D�!�?Ϻeܻ�<j�/I&�M;�?���k#�d�V��v���t󊃳=�������aI�S6=�P�oz(��:(.��0e�ݪ�@)��q�x/��د��ϸ4�7s�h��fR P�t�?oN�����Lm{�����1'��;�ݥio�yo��R�P��g�Ҽ�}���-�6�1Z[ 	e���K%�%7nw8w���ޤ;�w~����k�;��5���� r���
�A�Z�Ϻ�F�킋�
��.��A�&��n�i�9��1�o)�kf�2���c�.Ӯe����^��ևo�lЛO?��-���vǯ_m/�Ki��%��(��d���>X�/O���N?Z ��;��ǝ�(��E�A}�on^ؾ,N?čva�7�wB�E��\Ӿ�#�<�U���u>��sd�\ݤ7��#x�/�={�����s�1��U�^|��_�Pu�kO�+�=�tP�لۥ����
z�47�E�SA^��*��E�?%���tr��E��f�}��G�PK    sLVXK�[R4	  %  3   pj-python/client/node_modules/node-forge/lib/pem.js�XmsG�ίh�\�]��e�F����ا�tw�R5�`�e��]������y�YNRe�K����ߞ�Q�ٳ<�ؚQ.�%��2����Y
�nY!"���2km`��Y��3���Y��r�(�H�ל���| �㣮Y����y��[s�)Kg	��A���b6/��8:�>o�c83Q�ޱO��-�H#��-�g��K`���<*a�
(��Y�dw"��T�$.z�H�Y",�ww�0-��^��|փ���pyu�7C�q��A`�.�,���@Ud}��i�/0NY*e��)�]��VC�5��<Kc���5�0����fxf�DYZ"��l�D���QG@�"bI�QX�4���Ї�,Yq������с���4{d˄��Q�Yʺ�%!�Xd1�D%���(K7�d9[��ƴ�R�=����r��R��u6�n�Z篺�χg��O/^�4��9�Q�'��+Pi��eE�+lY�V��C�w(�q��;�b�b0"�a�ɉ%9�?f%�D|��H,�����o0��V�moz��[��|�F��Xn�P��f9Ehơ����9���#���ᬭJ��R�Ӂ;��V���/����E����U�C~�D���PmV��>?�B�C�� ��`��ċ@���5O����/��b&�H����2�s��g��T����i���ς�'"�ٽX��QEDA}r�TE�~̧l��=89���.��*O�650+�
������1	\
�*����� >7����O:� ����6�����xX�'����[�|�z~ ̨�[,��Xb�SkT�H������Z ��+@�}����$��$�ѵt��-�,���L�'����M*�$�^������YXc��`5ʁ�j+1�U�|�c�Whv�k�l�c����s�e%c��7�(*�&��P���b��R��\�|R��`U=�U��>U�@�O�o��&<���Sh6�Ѹ�sf$&�]���y�����r5�=��+vlTB����ts�K���u��,�O�걪��&�v�g_�G Mt����s�")��ѕ����C��8D��{�1F{1��a[T[�=���m*:��6��z���FCC�2�� �2�{��r�z�w�]g��s���Q�����ևθx��?z���a�u&�@G��8}���G����%���MOn�_A��=<�ڟ�ls��K���sܕ;3��ߛF�8��f�Ԍ���Վ=7���NI�vS����\$�/�e�}�3޺<�Q�|�D�T�u�s���iaE'�����`xusq~1�9�j���o '��]F��,�E�ӡ���K�#R���4����Yԙ����O���'��VpY��8�({���u'�Z�c���U�i�.���2��̹��/gc�R��*I�j�:�oi��/"��p41Kj.sx%�W���'��mgY<8�K3�����Ѥ���o����j��&�h�~�eU����r�]U���o���o�M��:��ėB.rT���(y�dע���Q"&aΗ	����ͧ�x�	�ԍϊ#|W�*�KC�v�l��c�L1�R�H+H��S�R�O�R�TN(l)�/-�4��j�� ;!:T�$7:���Z����ԏt�ٗ�O�U4�&f����͢^5|@�B���dt+�Ay�=��VtF3��#j�q�x-/�$M��zXS���N�ע��� �����h�S@���~�������[5�OE^��x����BA�'��;��e�E�yv����a����E�hE,����Z7�5M ގ����b8�Pc�'wp�-8�����x�����s{���Mբ~�t�`;�$Mۅ�[���O��On.奲5��#��Q;b��.�>�կ��P�y{1�kc':�<�2.#��nm�e�I��Wɿ1���ϐ�9�oY�m�A��`�wP����Sn��W��-�
��y�$+4�X��D��ѭ�J����Gu3\E�+���"�e����i�CNoYE��N����/���㣗�y�xen?
�^�'R��U���������r�/����4�7�|���t*�i�p_%��j�Ӯ�a�{���+=�_;��ڬ��uo���ȝj~���Mz��3��ޑZ߯�H�E[mb��L���e�6Z�X���}hw�xF]�Z����F��;������M��I7�З�GVV�G�3"�K��5��@ե�Z$T�|����
��L�+U��6����vEZ!#ځ=�hά,��m~|m'�mG�q�TL%�KE�VLT�#:�-���kn�]CF��v�YMf�q���S�8������;PK    vLVX��HZ  �   5   pj-python/client/node_modules/node-forge/lib/pkcs1.js�Y{w�F�ߟ�6���8�n�.I1ȱR����#g�[��c����3�;��]7�H3w����|�� �����`�0	xȣ�e"� �����-�;�ONa<���� ԩ��s�}��2�1�Wx([r��A�E��+w
,��|҃@x<"*/���a�̲D�6��-W3ۋ����*m�ț�l΂x���x�L%�od~n�bj��V3�-��D,"��Ro��x�H2�Y��M�Z�aЍ�M*��^N�['��n\�+�!3t#��BJ򇐰�)�m`��(��s�d�[��h��Jr�,c""?04:�?$Ζ�I��l�R��ä�=��%���*C0�P'�>��OJ��Y@��y�k�d�I��R���`�&�v Ba��q�
I���JrK)lAHA�_��KV�@ȥ� �y\���|k�5�8��2\j�K	Jȹ�q����2��J��*�P0W��ݧ��p/�������d�V��Y|��+��j�U��$e�͖\� �7�C�""n��[��2c���$N��]��\�K&Ë����w���G����Ig��O,x�N/��S@�qg0}�����g����ؙL`8&n�ը�:�����;x�xt0�B���C�ӡ�i��΄�]9��%�v�ݾ;}g�w: ��1t`�O��u�3���x4�8�D9���9W�`j�`\�G���e��'iĮs�f�IQ�G�����)\�=�ԯs�w�4����W�:W�׎:5DF�
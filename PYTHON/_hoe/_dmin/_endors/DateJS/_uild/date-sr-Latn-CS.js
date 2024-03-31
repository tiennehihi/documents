# memfs

[![][chat-badge]][chat] [![][npm-badge]][npm-url] [![][travis-badge]][travis-url]

In-memory file-system with [Node's `fs` API](https://nodejs.org/api/fs.html).

- Node's `fs` API implemented, see [_old API Status_](./docs/api-status.md), [missing list](https://github.com/streamich/memfs/issues/735), [missing `opendir`](https://github.com/streamich/memfs/issues/663)
- Stores files in memory, in `Buffer`s
- Throws sameish\* errors as Node.js
- Has concept of _i-nodes_
- Implements _hard links_
- Implements _soft links_ (aka symlinks, symbolic links)
- Permissions may\* be implemented in the future
- Can be used in browser, see [`memfs-webpack`](https://github.com/streamich/memfs-webpack)

### Install

```shell
npm install --save memfs
```

## Usage

```js
import { fs } from 'memfs';

fs.writeFileSync('/hello.txt', 'World!');
fs.readFileSync('/hello.txt', 'utf8'); // World!
```

Create a file system from a plain JSON:

```js
import { fs, vol } from 'memfs';

const json = {
  './README.md': '1',
  './src/index.js': '2',
  './node_modules/debug/index.js': '3',
};
vol.fromJSON(json, '/app');

fs.readFileSync('/app/README.md', 'utf8'); // 1
vol.readFileSync('/app/src/index.js', 'utf8'); // 2
```

Export to JSON:

```js
vol.writeFileSync('/script.sh', 'sudo rm -rf *');
vol.toJSON(); // {"/script.sh": "sudo rm -rf *"}
```

Use it for testing:

```js
vol.writeFileSync('/foo', 'bar');
expect(vol.toJSON()).toEqual({ '/foo': 'bar' });
```

Create as many filesystem volumes as you need:

```js
import { Volume } from 'memfs';

const vol = Volume.fromJSON({ '/foo': 'bar' });
vol.readFileSync('/foo'); // bar

const vol2 = Volume.fromJSON({ '/foo': 'bar 2' });
vol2.readFileSync('/foo'); // bar 2
```

Use `memfs` together with [`unionfs`][unionfs] to create one filesystem
from your in-memory volumes and the real disk filesystem:

```js
import * as fs from 'fs';
import { ufs } from 'unionfs';

ufs.use(fs).use(vol);

ufs.readFileSync('/foo'); // bar
```

Use [`fs-monkey`][fs-monkey] to monkey-patch Node's `require` function:

```js
import { patchRequire } from 'fs-monkey';

vol.writeFileSync('/index.js', 'console.log("hi world")');
patchRequire(vol);
require('/index'); // hi world
```

## Docs

- [Reference](./docs/reference.md)
- [Relative paths](./docs/relative-paths.md)
- [API status](./docs/api-status.md)
- [Dependencies](./docs/dependencies.md)

## See also

- [`spyfs`][spyfs] - spies on filesystem actions
- [`unionfs`][unionfs] - creates a union of multiple filesystem volumes
- [`linkfs`][linkfs] - redirects filesystem paths
- [`fs-monkey`][fs-monkey] - monkey-patches Node's `fs` module and `require` function
- [`libfs`](https://github.com/streamich/full-js/blob/master/src/lib/fs.ts) - real filesystem (that executes UNIX system calls) implemented in JavaScript

[chat]: https://onp4.com/@vadim/~memfs
[chat-badge]: https://img.shields.io/badge/Chat-%F0%9F%92%AC-green?style=flat&logo=chat&link=https://onp4.com/@vadim/~memfs
[npm-url]: https://www.npmjs.com/package/memfs
[npm-badge]: https://img.shields.io/npm/v/memfs.svg
[travis-url]: https://travis-ci.org/streamich/memfs
[travis-badge]: https://travis-ci.org/streamich/memfs.svg?branch=master
[memfs]: https://github.com/streamich/memfs
[unionfs]: https://github.com/streamich/unionfs
[linkfs]: https://github.com/streamich/linkfs
[spyfs]: https://github.com/streamich/spyfs
[fs-monkey]: https://github.com/streamich/fs-monkey

## License

[Unlicense](./LICENSE) - public domain.
                                                                                                        �,�-֜l e_48ɬ� �%�f"�)��HtG�!ң�e��Mu;��_�U�H�uj�/kEN+��l���[[�����pD�N�� �Hi��q�Rۊ~ l����h�$PdG�e�jD��mml���˔o���IW��г��A���'l8]����8ys�F}>�)�3�)�;�ڗ�,(W���Q��3��|~��G,h�+~�{K�{�͏Ќ�K�|Vn˿�BH�g@��/�7�&�o{/�Έ"gx����+��uC~��~�o��<���r��ei�2�Fn�qA^;~�����4�;��=A�}k?�T3�Φ�g�;��`�@��.�C���l9�5a��-�����iׅ���ViY����4:���2�FOSa�K�!޿C���2y��E=g��۪�CԲZ�MN'�Ti�x~Џ�N����7��?/��U񶍌u�M=������#6Q�I	�W�G�;q9�K���h��N���3�%S� !�tG͆��/���u�5�O���c'���RDo��������ڝ�df�=n��q�U���m��M�[Lx��{�!��������Ϳ&b}����z���6D�Rxض�E�����*�䃽� H��a���#��� �9��;K�B~9ՒF*�@��x!������ȑf�%V�w. ,
�:����i�°߮S/�G�pNލc���߆��y��Y�+!�����}9�+"o��9�M4�B~%@���Z��8�ݿ������&����������⤋�$�錵&��~���oh�šئ�B�P�@-��@1��E]n��X�H��ʀ��%��X�q((H�6�y�v��m|G�;%�w�����}���i���l�� �̒��8,u: X#3S��� �4e��ѱDd��V�G� %*���鿽p�)�Y�)���� ���cST�m\���a+�`1Y�9,|˞i쑱��q�&�稳'@�nB�5��iJl��YV=�{{���1J��d��T�9~�Xy!q\݅m(qq�F�����Erh��[f'���cO&{J����Ψw����O!K^0��{�L������/�w.]�B-� x���}�����~���}�;ީܲ�+��`7WQ,���A���@�0�0*�u*BvR���?*��!6�Y�@���!)(�3��q�cޛ�H�(�C�@CI���L5��/��U�[�����wEm>od@ �3�gu����ܔk��<� �+ŷ��Y�{�5��ZE�1��׈J���`�y��@�a����ٕ㝳���a ���z�OI�K��c~�|����H�H�sp���2��o����R��k������u|��D4�u�;d1�����x�N��d6�䵥̙��V��l�|����+nn�;~>kn������Ur�[N�Ym�������� �>�Ì0�\��e�1!��!Y(z�[�
h>?��Q��/&�=^��>)r|��c���wWO�M �?O��L�����IV�y�HrM�$���å;h�R�y���%�G�����6��[xq�Ey1_����o����c���-Y_&J?�.8������넂���+����8�Z��2/�?Ur�� �3�~v8��4�Sx�f�a�WJC�����)�$�I�:�؍�!-Vn�J_�ʞ�k?�$2��	��6�!�?	;wQ���;�p�-ݶ�u�4ѡ4���H I3�6�?\|$��|b+<5�>�*ҍ)|h��:���<๎�"KC����t,�8�$��	�Sq=�k]�Zl�%B�;߾?"�М�q�=7�J`�Wpֵ�ED呓������swu+q��W�W`�Z���@��3K㡰N��L�'�4��,?E�|"+�1�o���eL\=ʡ�������_�if��f�R��P�9����:S��57Z����F�X�m��Y�t�IM��5�Գ1�\�OnK69jN+�G��FH����1b�c��{�l,<+uj��Ұ=�>�:��4���v�(���.T⺓���n1���	��mB��$D[��P��Ț)���(=��ڍ�(���Ь���۱����>���]������\��N��`Ql ��&���:b���^�ppt7�"V}µ�'���.�I��]��Y����U�4�}I�#��� �����UknE��^GM���w}x��Jh��qv��v~�7���4�'f����R���u}�"�,��g��f�Ow( �-�p_�P�\jH�GUB�q2����4�n�y�k:(ʢ6�TR�(�KO�/÷i$��`2��P��z�G��n��{M���g�d���jS��'�^��M�\@�4�T?��+T��U�
�-z K_�Ìu�1ŋ��]4_��^�b4뺬�(}ԓݭ����=��7k�
(F]S+x�)`�u G|i,�f׵���o�
�ylb%��&��1�?єZ_�{$/��^���t���!��W�ջ5�U��~
	�� ��M�e�=��ag�׾�8��E�9�ݟDZ~-C���dof�T�૧4�B�ŷ�P�}���Z��bK	��4���2�����WGŌI_p��沈���	ʳ
VJ>_��z5��Z�=))	��7��L��'D�Wkڄ7!�MG�`Hn���O**�z�we�EҨq(߆s4x?�_k7ݯ7�v� _��� n��%N�4�\Y��Z|Y �+��ƨ|[1^@���f3�swoض^���8�Jp|�����kh���� �N��yN%s8�œQ4Q��W����C�tO�X�A�b�(�g�֙����:F <~������P�k�>G�%j1���Ċy<��X������
qv	p�ڞnZ�f�c��&���n��T��z������)�KPlJ$//@���w�+�*��������*��"R��m~W���u��6qx߀�-�ƀ�v���;�^>\�V�ޚ6f�s�`5:9�l�3�;�xF��4�wY>�T8��0�D�Q���?�W���NK��4��J}e��暞W�B�%���p��\w�`*��C�/gL��
�������>�y+ȕ����VN?����C���/l� <'����d��U�m&�;���N�6f
�7=������ !Z@���ꀞAk�Et�a69F�`�:->�w �HMvZ�A�dM�u�:��jL"���+o�e��n�eѻ��r\Ǽ��k��p����Ba%��5ɡ4st�����N/ ���q�g�-�E���36�j{_a�)��J'n͐�\#3��*C2�/�J�Y�ꊟ�!F�n:��d�2��o��F��F<��+�*ڰ�?�"���l�J&�d�8�߇Z���#%�Aη'�7��ؑ�Y/�y~�yf�)�8L��؊�r�'���:Lm��t���������jYđI(�c�.,Oާ���|.���m?y�����z�?9���D��/�Y�`Vݽ���w'i���N&x��a�I�6�V��"���5���rv���l��r��;S�4��O�<#q�ѡ �!)�Re��x�3��"�e9\���p�!,�G�; ؗ���i�#����.@�0��ߛ����2oX����-��ި_{�m��P3Mu�{uĤ��ø�����������z��ɚ���_+�sq�O�~�Oo% 5�eo�tAaW���Z��H���d�� �IB��XZ}v��O����q9����H��!�ψ�1y��+��VT�����+:��v�{v�J�ۃ{�ɱ���D�ƨAT�G��e#
U�d��^0M+ ��J�f���HG����S�Ƕ��J��Z�^��p��X��6�ɭƯ�p2b�����"J*�ſ��}�U�V���#sZ����`M~�̜�}�x�d�WU�7yKT>�@Y�ʓ�&�l�0wU���sc�˕ʉƋ�ί���J���,�ީ�SD(be��%��&�/�I5I�j� ��AW�Kd��~�>@�҆�B�8���c��K
�p1B魦��4,�(#��8�e�)ᣍ)���ap=9)<��?�6p�ܐ����G]GYLo��h$\�jJ�����X��E�E+J}:h�{��#?�y=֓�iW�%�dS�ƙ,�d�3=u&�2A���EB?�U�R埻M�5�+�zע�JvX�%�F:�T7ԧ<���;iλ����|��&%C��B���<k�K`p��VC��	�%1�mޔ:��
w��)�/�g�[*uL_!�+0í������G� ��G�zN���r$�Q�.��1I(S�_�,�o�.��� Kݻ�� &�b��ь�` �-Go����=+Y����n�4�C)����x�Ut.mޓ&������� �e�K��Y�2��T.��A:��j�˧؃�1"
���x��v�$Z�Uc1
��ΤOܾs,�]l�Z�=�W�)�L�]�tn��{���nL��+4��Ktׯ��7����e��P-�g��+�r}��w�����]���N�s^T�����_�z�a*bV�\b=�q�Jk{l�[���v��j���Q��ۢ�/n-?��ҙ���`CT��k)��X��
m�H��V_ce�a��r�������R���'���ɹU&����a������ o~����S�+˒{Q�SI�+a�	�:�wH�)ur�?�4�r���Wp�H��O��ߘ���f�)9�-��ɸQ��!7�]ͅ�{]���P�m����
Ô���Of�Uk�b%�Sz��y�O�-����L`�-'�P/i&�yY*�$�#*������H�zh<��� т�ff������0��$��!J�ʀ�]�V1�,#?߲�:��fͫ�2�ǭal'��2�ޙkT)��7O�	b%Ը���D9 �:=��eg���uc���ݥ�k�{^eݪqH�h��>�*J���3'2�g?F����|#��������s3��.�=F�w�9�,�r��C�f��y����t���"i�?+F`!b��E_1�e!�T�,kʭ��R��5�.:B�G
�NԼy��}S�]=J
��dr�{}}��Nv�2�B�&F�͖72�����p�l(F��xv�^�b��菀���6��ܔ ���Y\��CǁJb쓿W�Y�B���]&F��/�AR)k�;˰�i�]`n5�9��8�ڥ_t���\8����DM��J
�ü4����Xm�A�F ��3&�{sϢ�wq�6��T�-/�z^1M"pӼqV��16�!�I�):���A�P�La��@�-
�zN�><��?�6~�^l�=ʊ�ޖ$�A��,�h���V���X.���[��S�<\�e1He��2I����%o+�s7��&J�ݵ�m5���6�9�a�o4(u7^�i��������%c�86�<�`��N��Z��R!r����$���dK웯��O�v-U�J�H�nH��?�ӏ96?�	jP�>[j�V^Qx��n���xD3�/�ݠ��L&T�6<�Y>��t�d6���?=�:XX��a�v��&����duq'\xwg�!4�8\7T����;$'@�v��?%K�����;�=��s-��Bߩ5
�o�4�CGy5;m��;iZ���W��:N�E-,�Kc?��"�WE�39H7�ll6�"M�O�@���t��x8i%���=j��]��x8ޡ�P���b�%��Y�ě���\K��ȳ�Mh���=���\�l��9����Iն���BY�ףx��@�}l
CH���zG�ذԉ�%�c��������ߎ͢�W(����[��!V��<h���	u��v��N�D�`���������C�o�-ek��ƱZ-'迋E����m&����O(ί����Ώ�٢7G�R+�ǸJ٠����_2��#FE,�,�o@B����`��B�	Qm�║�z�5y�_��3�O҈�5���'�T��NA �"N�¾Zdnm����N�ȿ�v���%�!���e>R��7*�xܮ�t��ҕ��"9��:�V�z���N�$;���?�"ā!��e�aw�]v� :)C]�mS�-
����E^H�.� tK��s_
��f0���8�z�-�ֲ�Y8f��ʴ�������A�"�Q��}�q�4_8KN�H��e�1��"�<rӧ��h��b�^c�v`���URo�^N�t�w>�of@ 8:����U�5��uTL:����I0f�WDl�����ֈM��Wfr��t�̦6����/	����&ݡ��:�z� ��H)W�{�B�J�Z6���{=��=4���V�9�!9_cN����,3_����/��̀*Y�z��Ɛ�,XW��b��Hq�.���5�*���V8H�2��U��)x�:UJ�wBwf(6'�vBh f{�K_>X�-��R��-�<�:Ew�T��}%9�8H֭����Ҷ�z�_�!��9Bv۱1AL�o�:3A�X��3r����YSw�(�hH}�[�5���,4	�;ƞ ����R��r���'쫷3rL�5tw<ҭ�C��XL�]����c�{D��E8d�{�΢'��Yz\%�9���a��,��8ދn���B��~ӐM�~�`���+<�ɋ��(˙��Q鈗0X抇�˕l�q��������4t��.�ᴀ� ="������R����Qh�u�=<-��݇�B�ћ
�>�(B����R'eƃ^P��o��xx������8b���� 6b�(f�@�GK@���(��]�V۴��*U�a�V�W�����#�nJ�q�j'�U�^�U����X��ñ�ah�Yc�S�<*���Š����dX�D��DC��_�����X���]�Ɉ|�J���m���z�>l>�M\]{d7ۘ��ʁ�u��+3��&z�N%��݃����.����~�s�g������%Ȝ�D�����'�����b�L�~Xhs�J�6<{�ApJ�S����E���~b���`6�M���*�H+�|�|=��ǘF�
�e��z��e�QS�B�P�w��B�jo��6�_mv�t�(�(��0���% ��1iO"���`�o|)�L�XIrN�3Sn����ʥ���t��t&�Zj�"!�%�A�3"9��¥;��@L�����yLR:�VJ�߳����"?{�X� �e���ki�5�".9�H��A%a
�r�H�4�!03�yh�.��ܨ���'��GxD��V�#�O� b,�i#wZ򛬻`Eun�������$7u#�3�6^ �{��2ي ��K����w�G[ΰ�͎&�3RT��>6h{�(�)·������B�)U�Z�&��n�6������	��X�_�Y
j��H<�p��~����{gX�'��A����,+����P�#.���]�r��EfҲ\�I]��I�Sym��}�&*��[��������F��s�$�]LH��n�����������Od.��UC�3:��ǿ���8G~�EZ�H>^ܣ�$g�#��w]+R���$?����)01�J���;�����Ƣ%��Q<�2u`&�:�}vFy	 �7�S�
�&S������
�ţ�_ء���K�
�YTD�����> ��ӆ��v(g�F�|���K�Q���ϼ�u���&ġC���:�.i a�!)>#	�	�-��-ѤcGo��b`��h�͖l7�k�<f����#ԗ'�978.#�֏0qϻK�F �`$�-�פl��?M���vQ~��]&�ѷ'
CCo��rGYd����r���J��J>S��G�m�*���d�˅���L�q�srt���)k��#N�P�,w'L���jG�������,3�L�@�s���e���O�|�2ԗ�R����a[�׷�qŒ��&]څ��t�=+L����w,WP�J 7&���vO���
��:�f�ZR�~�?{>4�W	W�#|Lܦ��);Jl�j�d��7 �*����W�4�2��yDoo���v�O������~³PT9� `�|�W����=��H9�4��b� ͟��i�o25��/�!gͰs�)�N���<�+<�X��v�Y&��H���X�4��n%�pu	��8���z�\ ���	]n�/E�qx��5�}ꯂ*{A�n�����o�
��ѱ_~O���g!��1�Q����J�j��~ d�j٬�_���@��ԢϫQ���$��@��%��b�5��o��h�ФH���ˡ�B�=�۶I[�΁嬏Ȍ+��^C�1�X���+ߍ�OC�ʛ���� ���d��z=�Ge+����̇g�����㸝5�Ib�y7�|ی���µ��yG{!N��7O~��n�nq��3s��O�F:;���&,�Z�%�������	����͛����S
.o�eA�#��8����n���h�Ř;����T}�&������{���@4'�TzI����w�W�1{���w�� D��(�RȅJj`���	Pj[�c�k.��tH��L�X�x0x�X �:�/���4�֯/��+~�����51u�`��=���c(躏�K�86iP%�n���R��X�r�횪� ��)�A���~a���UK����ש0}!���%[5�+��#��*���
 �����κ���w�Wl���RN� p�n��'Z�LC3�*���6v�5���2%�e	��e���Ʀd)�Xi��d��[t���9 �ԥ��gq��n�n���������9TѶ�)���B���l\�ҭ� E���i@	���vR��(��:w��z����_|0�13j�������'T/{��ɷ4j�	"�$�.��Q<ǒ+��@����-�g,��B�ie�
����t))�	c���pi҈zY��[���c�E�G	�K��&#�~�0NB||wm��H����e�iQ*U��v;���]G���q�w�q<wJ%��Ӽ������#�.O���~�gyJ�Q�K�����B��E���3�h�������{ʞ��s �j햦�In��'��9��W�dݽ����ȍ�����72�����&;ih�X}?IΎ�Q���R"Y��=�[,�@!�iT�qo�֟�9�\�G,o�T��u�g�HA����t���M%��_���}�oPQJߟSx^��o����K��&���%@ӕ!���}.@]��M�e�_K���8�+�]m�I��氳l��"�A
�<�k?w9H�ը�� �n:��,sٚ��ʡ��I�Q�	�f����'2�[f �)�js`�}����H
$Z�����y;t�׎�+�dLD׼'�����ep7��ϩ��l���L�Xk���\��#S��s����t���"^���%4!���}- ͿM��a��'h*2�2�z��mqW���3ݑq��8 �u��23���k'���ۓ�oA j�g^(����T��T{_M�V>"n�ǜ׆qp���aG���Ýg����%	��]-2!��8}�;����=}Y�ꢖ����yc᛬���ƿrב%�Hz)�+�K��)j!�.!t�����)��aꄲ�\o�#3�b�mZ�əJ�9(�l�dJ���~J��ya�4�E/�4e��_� �n�>��U�8�+΁�B�.��!*��F�#�+���AtL�jYi1�ٙ���o�r�~�^_���,�g��RA�%G%O���Fo�[	��c�Pj�Ih�ϦgF[���҆e�V��,��M�I��'4��:H��J���!�PZל'�m�?M��ZHs�{�;��O��E�>Cά2������Mp$Ӌ�ɯ�GĪ���4�`⚙)��;��`��Z��ueo�3bD*�"c���*㎄��x�����l)����=���!�%bA8a	��Jlʥ��%�b$��dFN:���W~�¿��5pw)q.������`Bg�?\��3<��[p�t�l^/(E�u��$���g�I���;��5�;ݪv�7�����V�����yfC�搇й�Ǖ�e(=����Iǆ-���e�� ��kIօ0�|�ҳ\` �C��:��A��ڬXq��g���f��l��j��(���=�@�+:'K��I�3�.@ݿ&f!x��j�~��	�*Y��ݱ��P����V��4�ẉ!�F;Ѭ���G�^�sͻ�@YH�@�hH�ѕ���Y�6�_�ɟ_�%��{\�gz�"X%�U]@�g���@8��N8w��q7Q^���vuC	��Y���$e�x�L4HKh��Q3��̠7W���j�Q��4��;�9K���,r܁C��/�%��ά��3W�6�Ľ�@�D��3��nH���7�hT��F�:���]�����|�-jˁ��\%�fbEC����HQ�Q��@#ڗ#���M�K�ӯ9 �1aM @W���˫VL�G�©���n��[�}&�G�I EH$RY��|3D!8����,���ɂ�B
���S8D��iX/m?c��)"e~��Kmh��K		l~�n/�F/~��ӳXF������KNT'eD\�� ��z�/&��/����un��n?�M��zƊ���SpV.�z����3o[�{�b?�bλ`c�8o��~뮫ۖ�k��o�o�F�0�A+Y�<c��ڵ�Iɪ�jPB�;�S�`��[C}@����I1�*���|ءP$v*=��I�K��x Cƶo�4!�����k�c��on0��L����Wr��?p��t��<�(�v��(�f�{B���~��I.��%�We��Zp�v������<b,��<u�G��%��^� ����B㤪Oz�"�q$�gh�v|Uz��T�Ͼ�z:?��U�_<�Z��ў�Q�9��`?�Y��{c�ڼ�U�zl� Z�Z+S���}On�b��/B�����f�i�afʮ3A�q'?I�Z����U�u�E���9��t��g4�� _�I�Òu%��M�./�$إ��zL�W��"Iw�D����_(b!j�ac��_B3�����<\��0�ݙ�8���G�6��z6�S;YI�g�Ӳ�h������(e=v�t�f4.���+�6�R&�S͹��Fy-K��tF�7jܚ	����%�[��OH#��w��*�E��h]}��_�m�����s���/���ULiT�K�Ö�	Oչpo�����y*���/
w�$A� �g���>7Fʷu���&���|`#��s���soK�����_�����h�����p���B1ڟ��<����\%J��qf�<���z"R��N����~K�Y}4 I�{4HjN�Ov#��%�@���,x�k&�)���,�h�£����@�6u
jNw�.�lZ{%�E�&]�գ�^V͎�`���>��3]պs�K�%�����|��^��%�G.&�;K�J�Im����[�"ԥ옯��p��׀^��7��U��hѓ�6M74�b		�Y����0��}H��6~k(����	�m!$��p����b�x��4 kD�'�4��2�8�NdM���h_�g��I�q�ODǲ'�S��2+#��Q�c?L2k����QY���K���j�{�����~��6����Fk���j�͹H֒���Y�#�A K�₫tl�7X*T�4��%x�Nv�zKw�R�s�ܥ��$׸���!z����⣷;nl��}�h	�o�����-+���l���h�s�?/�^-m�4��=wІϲ��i�)�˥ٺC�T��̝���J�y�6��2�U���~^��$,�)��=�P�<�����.递�r���~�PT	��o�ʌI�DS3��<�p8�3�QY���;0�Lj�������v������%��R�Ӈ���Jt>��H�h#�6�6��w3e1�]3�Y�/S��o�~���h#ޤe9��qb��K)4�!�{lr��*r�>k��-2�Z;z��nJ�g�Aݡ�.O���_�!7a���Y+'[T��x�Y�>m��J�@"��|�FZYo�Km���S��l�T�����c���yLXA/�^C,�,��Cc�o}��̝����D(O�K�$=��s��i���vL�ݾα {"�2/c�
��R�����2`R����` f�v��
7<��Ԏ솁�]|�W�4q%��r��.���T�7�� 9���p�km:>���O���봉d�n�V[��/I�7�CC�ܚ����a��%� �����Y�L�/P�ҝT�a�/N��&��m�΢)U�,H^�{��f`g&�Y����^&�O�O��^��l���huM��P�M��J{i�O� m����r��،�+QGk�Z��},��p`��H��e�:ܰ��0h�*%��ms'���� nq�L��a�됵AO�9�9��k���dnɌTf��3�sST�R`��
�t��Ɣ1}fN�HXGϑ���-ca�4��P�9M�]��0NL�qT�\����������C�g�r��9�s�f&_�`�&2�|�Wm�D���w����訮��׫�:�b��Gts�PF�Uz:������=��S[�cOv��#D�T_�q^$����P% b�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{
  "name": "nanoid",
  "version": "3.3.7",
  "description": "A tiny (116 bytes), secure URL-friendly unique string ID generator",
  "keywords": [
    "uuid",
    "random",
    "id",
    "url"
  ],
  "engines": {
    "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
  },
  "funding": [
    {
      "type": "github",
      "url": "https://github.com/sponsors/ai"
    }
  ],
  "author": "Andrey Sitnik <andrey@sitnik.ru>",
  "license": "MIT",
  "repository": "ai/nanoid",
  "browser": {
    "./index.js": "./index.browser.js",
    "./async/index.js": "./async/index.browser.js",
    "./async/index.cjs": "./async/index.browser.cjs",
    "./index.cjs": "./index.browser.cjs"
  },
  "react-native": "index.js",
  "bin": "./bin/nanoid.cjs",
  "sideEffects": false,
  "types": "./index.d.ts",
  "type": "module",
  "main": "index.cjs",
  "module": "index.js",
  "exports": {
    ".": {
      "browser": "./index.browser.js",
      "require": {
        "types": "./index.d.cts",
        "default": "./index.cjs"
      },
      "import": {
        "types": "./index.d.ts",
        "default": "./index.js"
      },
      "default": "./index.js"
    },
    "./package.json": "./package.json",
    "./async/package.json": "./async/package.json",
    "./async": {
      "browser": "./async/index.browser.js",
      "require": {
        "types": "./index.d.cts",
        "default": "./async/index.cjs"
      },
      "import": {
        "types": "./index.d.ts",
        "default": "./async/index.js"
      },
      "default": "./async/index.js"
    },
    "./non-secure/package.json": "./non-secure/package.json",
    "./non-secure": {
      "require": {
        "types": "./index.d.cts",
        "default": "./non-secure/index.cjs"
      },
      "import": {
        "types": "./index.d.ts",
        "default": "./non-secure/index.js"
      },
      "default": "./non-secure/index.js"
    },
    "./url-alphabet/package.json": "./url-alphabet/package.json",
    "./url-alphabet": {
      "require": {
        "types": "./index.d.cts",
        "default": "./url-alphabet/index.cjs"
      },
      "import": {
        "types": "./index.d.ts",
        "default": "./url-alphabet/index.js"
      },
      "default": "./url-alphabet/index.js"
    }
  }
}                                                                                                                                                                                                                                                                                                                                   �0�)�`)�[$�R��i֐��sZ�_�/=�����a��r@�ʲ�+.���7+f-*�����k�LC-V �۬�viL?��sO2.��H����ct)��Ο�SOJ&�e=��֗"L	����� BL�	4%0O�\DFs�A��T��B��i�<�T�1�X���q(�9Y��;�w���ǂ��{Т��!o!L�Ɣ.�)����1�������~��Ru�U��J����9ݪB�1�oeD��i���XH� ���-
+�}X/)x���ΑY�Pu�p��?G�$��S���F���k�'��$�o���6� M��-Fa���_~[����-8զ��#(D5S�"����Y����C�yH�Q�UzDڮ`���[�j��s��xL戻�����F��Z)�W��3,������/鵯���^��N����exX�p%-���5�*��F,�{��&���Z�tT���%i�_X��oƉ��_��d�ۻI]�`M�Q�cLZ�a���oϹ��#����h����$�lx\)Zƌ:����i��f��� �h~-�,��͐@�g��=B�`=I�U:~)��%��6�\g�3�k�04t��
X�ε�wK�df������W���\�<>�뫭��밯}?9�u�HL8h:�����{�o3)����fq�ܻ��n2�p^��/򈓨��h�>�N(ʓ>�A�V��;�C� �i�C������I�	 ��*yh*��ͩ㏵�f��3ǳF�p��r栘_\���Sǐ$,mdt$>��,�Rت�	7�����M�1J3��9p�l�AP�R3�S��0k2��ų�Ӭ�4Sl*Xj���kB��F=���|<ST�'�eL'E�#���m�2���3%�Ѡ�Q�{ۧfjٞ�E����k2r���؂�a�1��&R��t�kİd�	z�5�������9� Y��I jeE%�c���iQa�:��[hE]�a����'�؇�?��ݼ9y�攧�I��\*�޼�_�Xj�.�40'U#�'��G(�󸐋6�o�`l��?(��%G��*�<n����7F�)���w`���V=�g��Ґ�g��� p~Ov.�����e3�2�GEh���*q1�O�G$FKw{V�u�R�fP G�͂�\��~���o���q<
V��ע�ɪ����ym�о���d$l�p�$���˨�e��R�lp	wiy<��������5þ���D5�c.�"�p-^19��Ѱ�E�^+������q����&�Vz1Z�����[��E$�Zc�c7ZGܹ�� dHQ�۪)�:�O�Q����iÕ����Ȫ�Y:J����LO�\?������!Z���Y<��CkQl�_��]'P���Y"�
�'P��Q��"��S�K|�A?%��ܛ=W_j�lx��������A��6���(�Ua� w�EΕ�4)��7N7����T�|�����sAq
�S�mv�5���g�j��3ݏc~��q͞��ݢ`�yMp���J��{{���_d�@A¼�~(Y���!��1�E�y�A�Ο�� &����yy�x�`�*�e,2a��D�����_�՗S6j�g�o�����,����Wrs��5��i�M�i�"�QUΐOQf����m��%~4 4�n���������Ue{y�U�	<ZŮ���ҟ�sA��f�kђ���_�l|�b�j�7w.!t���󠚽vMŸ /��k|+qN�C�0ͧ�:�d�.AF�ޜ�|ty�|1Xƶ�X�;xBu�� ��Q� �P���������ί�Sk�S�}��D�솛�?�c21����6Q��݅� kbWg�L��!|�H��u��L֋%e0;�k�[��f�q��#�9���?=���|�o�����ٷ�_S|�F����~p,OǼs}��Z�v������ؾ�2'+��R**�^R1����b>��ur��H�G �}[�"W#��.}�����16v��+x���V���-�Sx ����d��l�)�=�eJ9r�F�M+�x@��� J8�H��;��dO��s"�)��1�p&/%��j���P�`�n��1L��=�����(Lݬ��?@������yX��zBQ�Fe��pJ�T��<�a�O��4��9�Byq,;*�ANv}���ֽe1�b��
�2�	�&���Ij"y�M�'m_�RTJ��x��6dռM����W��D�C遳4�����03ʥp�l�>j:��[3,EX�꜍S�@?F����o��jF� ����pLI8�_��>��Z�L�ZCD�<�ԙ��v�2-a�@��� ���^��8�"��4�ɟ|T�|z��^��|��K�U�
i�ӃQL�����c���$S�!k��#t%��'mp�4���b���;.V���� ��RC�	Ft�Q�*��N��� �^��<����訋|��8{C� r^�@��?�D=��A�"e�~6-ms[)`�s�~����ǆ�P�(�k)��o,T�.�+�ԙ�� �q����Nj��𻢹)�����-�0]YoաX΅*ahڢ��-��ӫ4.�9�����	�k�bB��3���6�}�H��_U�
�a�#M�B6�_���Y�����oU�QS���>m�Oi���J]��$��U=d���.�щ�/�j��e+b��X�����Y��zA�dJ�x��~�i�~��3@1rL8�����|;R�MP�&�I��DDӤN�X�ۘt�ɟ"qY�+���}t�j7��i��d����S1s�R��
����Uɤt;̖��ai0bv���:Ph7�F�g��J\�e�X��[Ѧ-{�/w�[֛|ރ�;*L<I8� ���*9!�;v;H�±���L�I�j�R���:{�֨��F1�s9�f;o �X,���s˿��T�-�RAa�eւQ�waM:��"��!LQ��sH�VC�cg>�a`j��;_�u7["�$�K�x"Am�P��=+{?�A�x�I����ވ�Oop��O=+f��;�룲tl?����$�ӯ+��܈&H���$x"ϩ��_�D���\���Q����U;����^Gf��-�ڦ�:�a�&D;�?��R���T�2-2΄w�k]eD����R��*nh����^��>&7�h_1R;h�MH�,��U|5�����v�uϘP�~;(�p������@9��֌��
+G��Z)"�T�W%դ‣��|5������w�c�����w���?�d$��Tܪ�yV�P���xm�V 9=/��1���O*��a���	��)�j���?0�K�4��ѦrJT��ޭ	�s�ٷK}���Y_Zb&��@3L$%_j~��琡��\��S���������{�9��i4���מ� ����
Hd��HW��f�](��?H�8��y,UlJ7p�C�{dp�\��VO�\2l��d��&5 �6��7xݞ��?���N��|s�>���@J�܄�~��v����oЏ�Y�NA!H�AfRbW��j�^J�*4���u�#E�id&F�x^����:���U	���W�!v8e7�Y�/����ѡP��K>�<aIm$x܌d�ӓ9����U�(2ePD�U��0����?�r�8IqL<�V��Ã��)��~P���!p�� ;��0|��#c�"*+ŋt��q��Md��'}�k?��>��!*a��Zxs��碵Ѓ�������|?qa�"��a��X�:?�
���l-p��G8 ^�{�k�{�o�Ƿ~�@{l�����.�.����ю 77j(�5�L���e`��R���I!�Y%�Lf�i�����
�LH��O��$pd6� ;�Ҹ;ȤM���� ��;F��̈́��zoG�h�ڱՈ�X7��U�� `��3�n��h�[(~Z7�̤��"+<�^���qy<�����MПj��l�Dm�'*��"\�����,/���D�!��K�
w�idD�q��ھ��*�#m��K�bi��C�]��ih�.�p���LmΈ���h��a���'V�=����MǹK�n��5H����r�1��i2�f�T-�����?}#�h��7����1<�>1����Q4�K7�5l���m'��7��I������L6?t,�J�SlH!5���j
���;=M�Fɢp���±��w�9`���)�n5�3��ஂ@�j��%���=�Yr�Ar*��N���� ���Fz8��\hh��� >r���4Os�w���~�s`��Q�4)�޽��B�B�?yZ�\O
���[ʚ+es�A��cFQYǇ;����f�+Y�.��O�&�JT��U&J��lG��"�@�O�xe0�m�����L�^ |���Y�����Y?V쿷��R���^��Ee��pa|��{3�O�Ң%���G@M��!�o�������B�,�1��D�}�At�s�N`��N,פ/�}�7������X�?��ފ|��<���Sdd��|j��Gp��z����u٦�Q@ڝ��J0��G�	ň�[���h��1��l/vFԱ��+�'NYi֖���U1s��5�R!�"�9�X"�7�]8��o=���ŖT��>u~��0z���<D���ϣG���vlQ1?�^�k7s���`Ѝ�g	��j�XJ��kj�z?�=3�E=���@~�ڳ.r�,�m��Mr1B���W��F=s�KXwf�B��#
7�J18������3�yƥ����L�㥼e�1����9��9�ip_��,���}����L�jzN
�y���{�$�.�2S��zU����q:b����2�ƼJ���"�Z��#x�ד�~K��?W�Ș�4I�Z~��pk�Ⱦ�k`��M����i#R/���@��S2n�A�ќ_}5Q7��Զ�c��,N5�N��-5[�1�~����%�r��j�{ɱ��J9��E�~��>?���O��t�D/߯���?1F|�e���A��h
N�ɒr��L�������zc'�[qV�bЀI�z�8��ͧ���8�Q�ͻtϟz7��xmzz�:�4i	GI��]�Awt����P��T�ܐB����bPg�A�/�~[��V������-��.�*�d���, ן	�5�&�� V��������2W��~���!}*f�YP+��nvrX�����ӿ�(+����0�Z[���Q�Ј&���Vw~�M�*��D�k�,r4s���\�$*��,6\�3"��̣Yn!�z�>�2?DRc�
hŰ;0c>:$g�M�0e�g0�xQ]U[�w[�a�X*h@e`�_�����D�1��BaC��#hU$F��Sg�J&+.�g(ȳ�,���P&��{_�\���\�O
b��-������QZ�4L>̰��\I��W{��3�O��T�����C����"΂�A	���;�BؚCP��|)(;�2�� �*jv4ō�%�r���`�|X�'����bzE�ү��CH�I�4y΢c֩80uX�!Q�(�I�=G%���+�Վ�,����[�!�q �ğ�q�#��ҏ�=rco��dF�]�$��h
�|��D`��¬o�SI�D!���e7���}����i!�<9���o�t�jj�fE�_�T]�&P��]�����(�o���\<h��r�L���=�?����9�Z����(?q��.,��WOr���r�b��5w��+�d& ��27��j�U�1���W�����|u��S�}hM��@�{��ң;֫*���a���
��:��M��drs�N8�]��C���@N������q�`\��Qj�u�2��t�U�\W�̸&�����e�f�]�P�D��=�`'���z\7��5��<�q!�����j*N,v�x�m�W��C�F�Ľ�����l%�$�a��gW-����Q<R�M:����%3Yύ��h2��@�5�SZbAx-]��D�S��h�g&_o�� #��F�
!:�M9um2��hK�J]z��\���]�3z���݃�a%�T�ۈ�U-�'#m\9Q��fl؛�k��H$с�Y�d��:3��8�h��h[�n`�i-������ޢ®y�?nw�/g�Cw�!�s��kLh�������A���/J6�R+�(�����A��+B��?�M5}Ə3hl���&:ā��K�Ծ��DQ�)�7���,�Y��ʻ0f��(t����qgܥ�:��xB[�u�@��q�6�bI�#f$�@AJiSCq�MQ���@���WO����	q��u0퐊:�'�;�J0���(g��m���L���H�}�y�����;�C����F�Ir����(��3��3L���)εߕ����ӷ�q/*������j���r\�x(]6Y����2Dk�pr��'a�y��Ű�"6{�%�gс�*;2���c���Sb�@��X�7h}(q�J�v	�1tU{4��s]���.N¦k�m��x���֔3�K�K:��'�a�:�4S9���;ѕ"�i?�d2%�a��Ap����-$�v�Hm����`{�"ڸ�/���K�X�ñ|,��Q *T�����C��2i�#�E����]��kƀ88;?�A�i��8�e�Հ�I`��2�{��9C�h����vw=����X������H'R�l K��R�:���1�K���`b~^�6����)�雋K��%����}�!��ƅ�\$~ș�;g �^@α���3⒯�C" ��dС����kq�x3��7ʲ�~(Ǻ�f���֣�A���Pɻ~��:�)_���4+�}u�h��)�2[ć��g�o�})��_��u}#�)���EbM8���A�h�r���&A���X�kr� �ZC	���λ@� �����'4l�|���8��U��?�2�	�_�Ƨ�QP�����UJ*L6����[Or`�:�R���ǚ4��-I#P[�ME��J��,�H��  l�}1@��B5�Ƴ�A��<ˡ0S:�|j3�UނC#�P
��6'��	3 ��>��]�C��q2�;�������n�?��A:�f�!��������5�����S�n��6�|�R2���
|�ǅe�-	�ŕਰҎ�
�+sʹ�GQ�t��!�N�[�褦�Z���d�e�f�Eݰzz��^c�o ٍh�.$m���"0cF.�B�"�C�����x�����QK!E�&_�=���ӄ���+�s�|���%ގMHh���t�5G6�,1��om���PP�=��h�|+z�/��W������~Co.&�x�&�1
�ɟy/ѸFEÇ�5�~� ��~Ϥ���T�K�N˥�[��h��1K1,>>��8G)���
�&u��?;���/��-�2c�����)ی�n	��d�v�W�B�2����(,�f�Q�Q�d���V�e	̤������s������/.գ�F)��Vհ|�����]8ra�OK��6h#�B����1�����.��P�s�p������Lqw����zB�췍F�(%���6��5��3"�5�\�*��8��*��~}���
Ū����Q�c�0���8�*���j�)̭p��ߵ������[/�Hy��K�~��°�sۅ�~�$bk��:�$,鬜l��� ��bg��Pg��3d[&m�Ҧq��0D,P��p�ٕf� +y�X����s\fwL,	X��;e�$��M�kR��A��~�`T^��<�@zHD���A�|�h)��F*�(������t�i�͐�c!��f �7���Ԅ�%̌3���� �|M��>�rg�8�G��?��Kx�K��0-��и%���n�!��#�;�=�<Oo�'J���FՅ��;�KNPMoJ�f��~R��<��{��r�m���k�Xo��{��K�d�p�Aq�Zl�
w�
 u�F�_����؋o0$+9�����V�H�n��H�枮N���1)C,�D�*ʬ� �x�I�=��A�����+*�A~�'�T����ԗrh��U��{��dD)�|]�c@d�/������V!�[�Q0,���Qb�aQ�L�oP#;8_e�LfU�P~RKO���P֠5�����d��v�-K9K?1ӛ��a��9�S,�o�"��D���'=�=	}��6E��a��7f4��|���R_%q�\Ѡ�X��aw�v�����̼[�F���gs?��ָ���������{�Q����N="��~O�������M��Jm���������GN�gX�[Dt`ߖǥ�3B~�s �
5���n4���o�v	���R�M��r�h#�$���3���+��}�s�F;Ǘ0u��8�a��'8{b
�?(D��֥�T��2k;+�
�-�!�2t����j�l���J�L�չ����� ֧�HaII$�2N#�Ow���,��Q&
��K�l	O���2eV�n՚|�n�;΂�)���z����dh��ƞ�V�]���j��%	{�r���-��@���Y��UKD$!b��e���)�����F�c֓��AN�Z\��z	���'"k �xv�����pLWw�`n�;��H�FtlG�!����6yDK���-~"��Jԍ%�DM����NM��#5d_oU�r��節ef�3m�{�\�Ab&l�\a��7{C	��;|Q�]�8��%���"�,�6���q�Bt�H��E.��@����u8��ΐ�'��A@6T�gH�
��%�[{�U���1=M�SS"�����A��.:"��-�D�e�%��!	Y�#�k�?��V?k=�M��|�k�'��^h�G�+Z{��G�l���%ДG(�:A�/s�S׵�v*A��X,�p�7�0��̼�p��d�t�RO�7���.���6�\$
������<&t���&��k>8F:�NV�a����Ǡ��Ϳ��\x��y+	�E����_�������E��Ŭ �)y�xk���2^u�8�������6�KGn|���.�G��2w5�5��h������i���E+�����lsc�Mf�b�\qe��m�O ��>�^g 4�yb�4�`n�����,��P�6��<�	�э�T����F�\��6,�9+��#h'�M��CL����@*R�OKpmm�&�	��
W���[��N�w��ʿlH��'��������x�`�f[eE-�c-P����۲���t�R�ҳ[�P���7���r��=wm�E���'rѯ��*T�j�f��� ���g>=���c������'Ɉ��#I���6.�2����<N_L���c���@Ǒ�֔ K��Eyx���tÂ~�KV��C8�O<�ݟ�4�
h�v��{n"����d�(�/��Z
�%�\{x�A�xo}��tS�/��h�5b; ���|�r3S rV �i�eZm�܎>1�n�S��S�u4	|)I��ۦZdwߟ�w�]o���ʺ�vʋJ��i���؞�Hnw���� >�_yc�s�8��C2*ܬ�h�ZJ�sϋ�ߣ�0*�̍�\���sM�>��4���W(b%��m�Q�Ӄ�
#��f?>+��h�m��-IܕP�33��v����ʃΨ��~-�|ܼ-ߪ[wk�)��ȯ���j
��.�
������}tj?̣�N9b���ʈ�%�!]b�m�y�!6M&)�Lz��4�J��'�)e:+$c3�N{l-%pX�X�4���������@�8}�����YBmen�c�1�'�.d�h�O_�/�VtO�'[��ŘF�|�8�Vُ���y����17�v'#���!`n���7�A�B���{i��e�	�5��
#��JhN��y<�;����7o1&�`g2�o�K��r�* �,��������7��[�kw��N�:j%�x!���wW�E-뎆Z7��Ϙ~��x�!��} Cm�N��AL��e'}��4���v���`̽���9,4�������x21+Fd^��B�C����n�G�cD�Xv��ˆQXVO%-��VV�hg�v�~��ȫz2fb麖�n���0��Y�M;z,��$���1|�.������>�b�t~��Z��_V'(�Q<2�P�	�mwT3.�^�ɺ��අ�j��(bh�&�|��u1�6yX��R[�c¤F��x�C}ۺ.?]�Y�}?�^����6��Kgõ����=��T�bre�����`_x.	��#��u�j C��2��t�2��%�~���u�gӸH�x�����\�4؏Rʔ��)TŔR#(�H��b�NR�%7���qu�ՎO�c�ok6��߻�#w����6�KQ���*?�jŕw+;bcm�Fz�V-< ��ZE���Ԃ�0�~���ۅ�0/ �F���̈������a�V��4kC��x���B����?�� ���%;؈a-�H��i�(�ܪ_N5��v���ޝ�IUB�7Q������&�M��Y���Y�m���AM^b�xL�����,���2@n�Q牂Y��2&��fU�(�@�iHȤ�H���Z��W~�@��sA=2����B�p'+��+vµM����&2���Z�bp`2�k9��#������;+�ͣ���/i�	3� �����8@V`���J��ˁ�xL�y.�~9"�-�a��r��$�g�/&P��DX�,�v5����eg3���,>g)IU[rs(/�%a�ijYsJ��)Zm��=�&й���Y	��xXF7�vY; 7���E��M����I�b@� \zBAz���^K�'�*�8��)Sjh��>����~~��&��9�����<v)t��7V�O�4�5ǧ1̕X9��*��<1�g�����'l�u��Y�)}O��+�뿔���j7�ͪ�ȓ1�8wF|j?K���*�)��z�O�}lO�sN�6"�����/y��������Ժ��6O�G�o��bA7:$f�����l����:rZ<�g�_����=!�AE�DAv8�<��k�r��y�WW*;|I���R���9��y+FN�4�/�-�>���g0fD������PP����)+���Km?{;�HGL9󶠋�I�K퇼Qd)@�֫@�>���K�x�'B+e��#�]��Û�V���nY&ձx�+�|�5�3��	�k����l�����4��7֖t�+���gr�F4(X����J`�b��a%�"�� a*���v��NZ����Y>�����+����_�F�`/�i��XE�F�ɖJ�y�����ax��Vԥ?�jt?��Wz^Kʢ5̌u�;����"D�%hy�ӫ���\�y܀��iO�Tf�i�5�]��g����xaO=�<�]��"�P��C�'��mG!>u9e� e�Yd~�r�C�̡�
@!�t��^��`_n9FT�E�[%�hIE7ܸ>�]��3G#t��;�߄�kz^�C���纅i����?K"�����\��X��D�3s��˓Iv�mO71cs
������o%��^�Xd��;YI�/)��IsH�bHRӭj�N0@��CB+���é�Y���?��8�.#��H�wc�&�X+"g���.��\0	�@Eƭ^㶍k�`��4W�HFrǊ��݌6�~�ŗ%9���F���j�<1�e����L!��B�AH��м���"���ܫ#U��`��)�����}R�	'������(�x6�Օpf�� ��?���"}��;�J�H�ni���bC��NH`JB=�E�ξ���A-��!	��l=~<~O���]��
���vN�bkM�ٛ���ٶ��=��{O/��u� d����/G�%����.�~V���?���D]��{G.��(V桪��>YH6	�� y����hDF�:�"���M�A�o����*b�R�d��.�p�57�f�'� �-��k���E����3�ܮ���[�E��)ݰ�0̯�G��g�g�`��	��!b�����f�9�_ni�x\�?c/� 	~R\鸼AU�������^*k��3�	�>+䀱��e-2��(pT��*G�sϓ;�8T#E]#9o����n� �o��J��~�
#��0���ߴ|�e$6��K�`�|��5[�A򊧧����mPI�f9R�(z/��}����"%U�����4���3e��g�����(��Q�̃{~3w��
Tԝ7�\g%��O����땜��m.� r@�֋
Yk#H��u||��г"�-�ge�I�ݴΟ������5鎠��DNL�4��C	���Y�كt��|q1��"��l�
���
�gY��ō�e�[��#�.Q�'��-	���3wD<���-A
$4�c����6�F������t�d��o�8=%�@�>u�#��T~��Ka������E��sj;���Fu���,ǒ����.�c���p��!�ng��1��¬6�xp�2�>�X��e`��?�	����h˂\�z��7��a��A���6slT�6����C��ƣۛ	��.U�_\ay L��\ 2��B"�;A��c�'��a7�g&��ń�H�$#A����j���[u)~�5i�R7�>ʭS:� -�P��|rW�|�%�:��l"i،�����Q�i���2�H�%�-�,ؑ��{=�O���VD^(1��Q�a�,�fz������.s���W�K�ea�7��hZ��d��0<�'n�:�ʹ�B.�r����H�����_EYv��������W��c�S��&��4��ä��3~�:��Z>�)��
B�q�aݺ�=��3�7��<���޲��1����0�@L[�}(�`h����$?~��a�[(#�u���`�g��,J��̵��?�k�>ol��ڴ�FUn�����I���޳PC�U�j��:�i߻�^t݅��\"&�$ lx�q�fd+,�To����ʈ1]��*��)<�X=J�y!	B�dc��*U뒧Q���{d�|4"���a�D��3=d;_��?���{�ݏ��hB<����ɢCy��Ǳ�{�o�s��d���L�'��_+Q�9r��؎#�ߎ�%��TѮ�z�Y��R��,a5��e�UQ�h�)��x�p�����E�{�᠑kz�a�[w�5�J?l�����\$d��zǟg�P�Z��-�M��,�э����^ע�U��e��
$(%�$m#3������-OT���Ŀ�Y#{-MX�'�.�4W�:���Xg~��q]��(�����0V8��n'h��ΰ�®І�:��1`�� ;ޯ^�ێ�{!ܿ���k�)*^�K�J�,1|5*1��Ț� )* ���|G�h�l�0X!���k`d��u�2`ul	�~
�p�C��-�gR�Yd>6�B%��J���7A-��1�nT?��f,��s`_�a݄��e� P���alt7`�(K�0(��`,�1���!����-M�����a:̠[핒��sh�O��<'A��m����4A��e�хDtpFI�5B<�E-�*T��U�C���寪*c��2�`xo�I��բ�����Y��5r����ٜ�;5݊L���+����|o���.ZL {�i8����H�t`��.�t}WzI�k�1>�/�̓�̃�%�D�s\#
B�>�~5!|�]���f�����@i�@��r�/r�����×�*�]�H����c ���?"use strict";

var assert = require("@sinonjs/referee-sinon").assert;
var index = require("./index");

var expectedMethods = [
    "calledInOrder",
    "className",
    "every",
    "functionName",
    "orderByFirstCall",
    "typeOf",
    "valueToString",
];
var expectedObjectProperties = ["deprecated", "prototypes"];

describe("package", function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    expectedMethods.forEach(function (name) {
        it(`should export a method named ${name}`, function () {
            assert.isFunction(index[name]);
        });
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    expectedObjectProperties.forEach(function (name) {
        it(`should export an object property named ${name}`, function () {
            assert.isObject(index[name]);
        });
    });
});
                                                                                                                                                                                  ݚ\^�	�� �k�ȓH�llN\8��WP���_��Գ�3�A�Y@W�uԗ9m�F���zʰu�~��=T>��z��79��f	�R�k) ���s�[���C��L�Xz�=���%����e#0/�����E� _^��Z`��e�Zx�?M	�����#~%�
��?%
d-F]��0�RtIa�C?!�|���|�J�%f-�ZV y�Y�`�Vo�(Y�������+�g�(�iG��,xd��_�Ld!Y?���=bz���(��<�v��#X)gW�v&!נT@�y���' �����n�������+#K�#��ǧ�aI�b�0f�W�:&g�R�/A�wI�U<���(R�3��� 3�0�I�u-{6�G:-��`عު{�zfUĹ�ܺn���� j�# ���~����I�涶CP���RU�ă�4�W�L_H��ke��D1bLG���|)}R���w�+I:X���ɌՇ���q]1`�	�`5kEDYz}�����nZG���v/�Uȕ�$���5�p��iğ%���)�1��0NN?��gpI��V{��.�d���|w��q�m�1�H->pȜ�k�;���D��|��}�L�/b^�_\����Fԅ���D��A;g���e�ddg]/og{�b�5N6�"�j%9c+<2�tC3jf�eO׌��G_It7����폛�2F��)�$��c�^�T3��;��6����-|���C�+G�0��� ��R�'�d���9zY����{\?��c�f�4o���{����|��I�ꝛ*1?���g��;9��k�����&q+0���� �2��,6��ޤ^X����.{�	�i6ڑ�0&>�R7��`@#�;���3qD�eDH�q�3�D=K�Z�5���(��<�E_���,L�Y��W�0K��\��;�I����(�'��MZ�-&�#�p
m��0�)v,�K�YHe���U���vԵ��M�D7�CX��������F���2��wy[[b�I�G}�^�!�x�êJ�Q^���K�zy~�������Y$�<Ěw7b>��c�hA�pL�j�C#pG���#���j��W���GOS�4$O�¦���Ћ"+�C��jB�s�]|r{�w:�_KO��Ԙª珛q�q���6����CT�J?r,�)�5�w���IY9~p��|���l��4�"]b�kҚ�B�m]M�b7�S�BE�E_�p�MG��p ߜ�(~&����]��5�:��,_�홓�MKK`&���L�9�bEώ�&q)���������$~ȰP�ƪ4?����n)��ǧ�;��٣��y>_�&8�2)��k2��(����}UU�4E嬩�]�����g�L�G\�AE�,,gJ�h��\ݕ����9���9J����C�R�����O�}�;�(ˮ	J�ӧ	�=�7�� l!���g���V.]P��RiyИ���4ŉAUZV����Xr]�bO�v��WM�}9���3�OE��,o�Ķ� ���3�C���oE-��>�f��иV~���h���'�' ���K�_�&�b%�_��O XPj�_������k{�a�x�^u�UO3�<8�r����)�C�fFjj��A3(�!�2i�&�>�I��z}�0���j\w�j���,���˓��ٿԱ7���ŭV�&��0����z�3 UmC՛������1���8������[_FMxΘ%��f���7�����\�\LBd�P��%�rOscK@�����Z�O0ء�������hF|yC�e���p	�	g�i�����z���W�|��w�!�'��G1�Od�?�,��
����U���5�]�M� �Md��p�$u�tW�A���C��T^U6�xz�V��t{ k��S��'4�Iv��1敨���xC��t-D]�n!��݁����@jt���N�PH%Pw:Bs��1��,(��<�y�r�tT���#�����ԕ��4��>��j����D�ƍF�˓p��Cݣ��obu^���r���ݱ#^��ז�;^��$�?�>i�WNTOu�8��$y>��%g{a���
�L��֩�H�U��m��^��C���kP�cҝv��p���D^RCy�h:��Q،��W}L�) �w8U��Af6�sb�;����S��d�`�Ey�ޅ��p�$$)��k4�x�Xg�J��4�PՕ��6~�m89]8�ްT�zi�&��a��xxD:C�E���rGk؝6�ZN8��?��_82��e5>i|<�ڙ˺�r�V�$�wm�BS�q>���{��)YE�-��r	a6�$��IЍ��ͨ�Lp�0Go�7�C0��ֹ5G��S��RI
�+DѼ��,"Ï���O25�Z�@-s��2���d}�^8��������XӮ��S���l�QY�B�M��,��w$3c�a�(��xP��.�as�~jB�3R��<��hO�S2.&&����N�O|�%vRψ�fZ��@t)$���I��q���W��R�M�������&�Z�77���t�h�A��7��Wm5�D�8�q�I}�Q{�$������7�r�*T+&��MTaS�.o��)G&��1���:�⦿,%��|1���
��!&R����$d�"iS���r$j髇ڸ�1%\��-���5k5x$[	b�if�fT��U��2��o�{/f���7%g�u�LX�he�I�W��W���e�Y�Z@GxE�ꮛO2�h��+vTw{�d�SUl刑�C������^�ϒ��,���fck��G$+}w�O�Yoh����U ����!P��gC,�f.X$t����Gy��3W�L��QY���\��JyS#�6��7��f���6{����ق��/��w�0�na��
BB��F��Ų�LW֧�A��5;�J}�A6x�<Y�(��O<�k�׻�(�EO�_����΀Q8	%���g�zh��6�W>����j?ӈ1=��w;�Y�ֲ`;�F�+�[�Ru���t�����u���#�Zͼ���v�A�oRr;Yu�j�B]��)Cec �Ⱥ2��R�qb�(J4�"�S}{a��¾zZ�*��g�Nq��(�Ĵjb"R� G�̲3��fi/���Q2�<`��hzr��5��o�����Ɨ5�2�bEe������N�J�v�n��M�����K��+�/���1��~K��E�2���FE�m�g���	;>V��S�����/T��bJ'G,��H�+��I}Un~na��/u_�{�1��o���}�՗���ͻ�閨���2�W�75&V��	[����K���/����4GN� s;
f�n��3����+2gKÕKp~$Ȉ�mj�`�8��j3��3�Ec���V���.4f��u�{P�@��*���B�%Q��*�
��O6���:qB��,�7-�O�_�Z͟����c��� ^�ܔ/mO{�҆� :�	�s�c�=NƝ ���s۩���6#f�5ӿa��!�:Y���/��������8hG��d��m��4.�D�*1��s�S>�o���Uy�l	s �}�A�|��WC�}<nf?�km���Y�p
����;�R���/O�v�z������OҌ�ݖOc���aQK����KD�ON�H+Qp栄W;U��ᴩ?QU�-�ulA(��U��K�p�F��_��QObC���o�x�RAl	EƬ|Z��ϓ�py���e�+�2�oD�g�;#D'c�V�U�5\�b{\��kE-�������v���bx�b�%�K^YY� �i���&~�F�^}�,|��z~�w����j=$]��]'|Z�c��U���cQ������.~�QZ>cE�\��56QQf�f��2�
��߫��!�8ݴ��qY&.b}:e>mQR.�D�d骣{�o��ե9ڿ��Щu�c�,x�%>��E�� ̊��b	Y�~�<X���-�}8	XS�b5A��6��b�3aO�>D�CV�ʙ��W�T^�ڿC*
��b��ׂ�J�rf����+EP(�aFM��`DJ3j"*�bR�Pn΄��'?�H�0��)ٺ6�\'���ow�}�,�>����.����j���Z���q>����O��C�V��޽���*r��JK�ۇ�<��C���@�W���i���u�-��l��$Ŝ�޿3
��yg�ӛ�����y��W����M x�*��m��r<����`��*����7�֣���JyG"Cyz�VK~ٹ	x�B��� �f�ģ]�E��V�;�ЙHA��a���߱��9�܆e��M�?�G,��6[�#5�cc����3�~�}���h�E:�P����M\�'6W0��'�g\7������!UX�8��t���]?�D��{M,v��&�E�'��%���n�m���+qw�J�2B�:���*¡->�1h���e���=�Q^�s]z��ȸ(����;����aw^\o�8��RꌌUGq)2J�������C��|�f݇�9Ff�Aؒ�F��gV�����P�C봯�������U�jj��1*+��u�O^��:ӕ���1��d� �(���,�����4"�A��K0��0'���HYn�ߨ����>ҵ�������́�v(&i`����0�2��X���6{'N���h�]d�g����v�^���_zM&L8�*=:�ʹO�x�/�L釥�~�J�yg�ž����'�.�ۢc6c�(�qEѫ�yCOb1Ͻ�(/J�5�H��W�,P2���
�����'��\��K(�"4^���EG����p � 2_%+����J3�l����ڿ
�!XTc�_}��CP���Y�	�z�4�A��K�W��>GW��:E,��D8���j	�a�3+����g�	yj3C���niZ	Q�P��ҽ�H��T�K���;��xN�G��O=�Y�c���v$����������8����|?>�:���L2"�+=��[�������z�2[�޽8,��d��
�Zx?�:� ��Z��%uW���e�%�ZM��g����W�w���3�#���H1��_���f�ܣtnvf
呞���J�R�&��+�b$�s$���xuH��X2�	��� ����\ᔧ�_���*���˘���ȱJI����
�r��H�@d)U�1����en��v�/�\>}t7��
_�V�μ؎�$�L�K��}AuLM�t�������M�³����+�	$�{?�4���$��Ih��z�pē�"����i�Z@��kp���9�pu���y�����w����,��w�����}�H���P�g�Gfz�� ��^�[�`��o��ҡ!Y��Ip �,A�t�!k��x�z���m�.���ڦ�Ͻ�#ڳ�k�6ɬ	��,�np�L�cO搒wj2��6_��;$t�����0��F
f��p�b��sv!gbƋ�L?Q<�ٕ�6��#�z���a�"2�H&�4�3 ���O���爺TK� ���6H����$�8J"`^Cgl&��zH������iꙜқGڥ(���@�O{�I���'��]���k�JL��Ue������ɼ8R]v�F����0+�l)�k��N�M��zm�3\c���� �����VT���p6Z�e�5	Dwԍqw�:��gX�4�.��7"� e�D@�Ĥz�?b��z�`���vð*�W6��@y�M�/0M׬�_I¦[��R�VV��1=$
����OCy��a1�Ł�SU��T�K6[fGa�,*�� FR�_۱�ں|._�bז��o՜@r�<�~7L���fS%)�/�6V�������{�������"W���a
��Ɣ���[k�W��g����
$7�cT��q����b뇻e��^�J��<ߛO��T�}H'��%t4 ��{EOÏs���舜	!K�$~,$64d���8������-}�\�\��>}��qQ�愶��r�y ������T� IG�R}� '�ѩ��&�a���L��� nJ*��s������j��v��Ib�J3ik���p���t��V�۟�g�����6z�X�SM�p������γڞ�;�d�=s���&��*������&��~mi�ze�wLM����D�&�1��übJΪ{K-,���=����|����+�l�z��YV�� ~[��cpB�DM�u+�Ȼ���L�|���ڌ�s�R�"��3�m�x��$�:D��ik/X�"C��!�a��g��a��{� ew r����Wf��J��&*� ��5���thD�u\��%��l�YL&іURa.�/qN�bĦ�B�k3��&d��2�$֜M����{��5<i#*�q��]��Ky����G�����a��\�D	
�[ۘ��"��P2�o�K/Z���P�.Uq.Dבa�+�z-�az�)PM��G2TD����"Bˑ�5:��|g�Y|9�����u��a`�AV��j|6� �}>p��
p�"��7?�&Be���pw�BL�臆��ǖD�Gmi@CK��[B��dj���Օ�Ku�xi�N��ے������g���G�<�jl���}�)����	\Zm��t�!?�L�gM=��N?|��P�P��X���Q�џ��W%�0�Bd��Ɉ�\ؽ+@�+6�x���
���&f�0�VW��?`����d!���Jx��Z���>���@��AĻ��iF�<��IY�"U.s(����Dbg���=pAK�gSe#���"�Mn�F:���N��A�q�
�php?㵱��_(�%�e~�t��@Q�Lw����͝4.�<�6RڵQ�{|Uc����ᚅ�,�zdu	�z�d'��0Y��_4@��%n�c�K�b��CyRb-�ݿ�~xi�U%ə��s��5�T�A�`�%���T�L���s�\'S)TO����a�,B��
l�iʏ�a�'�;c�����reP�u�N'�;	�"�s�I�9-�y)�C~�v&M~�H����Ф��?+��1�;��GL�h����BO��p�C.��ils���޷�*�֡IT��~�������tR�u~dR��;��)����Z<C���u�B��?̛�s�G��d���vq�b���k��6��b���Z�S�
w�x��=�c !&�5W9&��<<�����8����Y�A*2AN�o��C�]��X�6S��'��!��~��F�#?\\��J����9�RL��r�4ņe��v8�w�qB�����;;��gst���G_f����MI��Xd1��r]����^h��cc9��M��d�:d���9�h�`n͘�BĐ SQA_#k�yέCj��t��® �6Ao��:?���Ou���ʀ��i���׶p;1�G��5��?��oLh~g��>v�����IN������� ��{��@��va��HS�g(H}�R�jR���SK���*,>�dJ�u5�_P=��}�Ž��ܸ7��'�6-.�U�����΂��)��plXЖ���h%�� *Fsr�S����Q��:��!(¢@� HaT�`N��+�����t��Bb(&örò�o�'|[Rݿ$���+��Qx�>m����r��i1�{23�3��n��^s{<˔�x�@���|cE]�ϰD}�1|��Uj��F����D��VW;�0+[������|�{�H*���Gt3?8J����7IM��&9�Ff�Q�;�~�R��\��%d�b"��aV55EfG���r���ot�+���&��G�%����$\Z��8��8%�Y�^���J�	Bf���$Z�*�Kx�L�So͗��2�$B]�FG���7��V�K1s��N�D��U@���r�W$c9d>������V����� ӗ&\���b���/ae6�<r��N�}��8�c��X��a;ΊU���ݫ��$�#Ϭ��c�=Lj��Z���2�h�X,�ˈh�A��Ϻ!Z�]���Qu��W��[`jt=��U���  jK�!���{�$�ִ����q� �Ҧ�y�P�PD.>9T�.c]b	�x�o퓿��)�ia�~��If+����k���:Q��h�qM���$&Ģ4dOs;�c�>��IU>�|�m�\��#�la��
�~��pv�<p��9�5�9�'7(]��(&&G�� ��y5V�G��N�cX�/��8�AV�����\h"4��Z7�A٬����]Z|�ٔŵ��./�h������bgS&<	�
y�#���zE�\� �v��Z(i�Lׂ᷸�N���s�lJs��Et/}��#ߺ ��ܰ�+�5�'��*�h�4'EY��k�O/����	�\�����ί���$�:1��f5y��!�	��K�����tt��vy��H	�)���0a�I=�I�t�[����q��}J�z�b��'iWـ������ɍ{Xe�s1s�qy�c;�R����e�2��Փz
'K�gR@�YVE����G���Ԓl/��fQ�K��湏���q���*��n���#��\���]���ò��-�řb����v|8������\�<�,���!���Ւ}Ǟg��s�{���]FD���TԳJ��R\��%���a��\)1�;�3��L��)@;�"�q�4�*/�dΡ���P,��F�m�}T�ԕ	�N���UԔ�����qUY��7{׹_�K���a'�u�Ā��a�c��vP��ʝ����A�o��+8��7�������}�Q?pE05h��,��e�� �􋥰�hg��O�ԌG�w$�X��Q��N3ό��]>��杞t�"V��i'�x�떨�a �jq/ g�N'�`Z��<X<�@�+n��߃��}��;�"Չ#yz\n
I烾j%�w��l�u�i]��z���lR��\�2ݑ4�p�ꜽK(ir��lb�v�sk6&�Փ�ѫ�;���-@�tz)�~��S[��5�Xo�ε���Jk=e$�)�N���Na3���(�֪o~O��F4}��I�wb�㡆�3����� �(�bL�R�B����.��@˺_�j�뵘;څ�1���U7�z� �4A�X��H9)hB������t�����ֵ2ot�F���g�� ����H��/f���(���A�A�/����DK{�fc�:�{\ۉ�>��J�]'M-�&IO�c����ĭ�r��Z��"�\�yof��L�HR:���v�2���;F��+�}����?}���v}W�^" ,�8�^���]q]�:9��Av�䢅H��5��Y/�O���*6C^���K��$��w!����Y� M�m��u`C�U8cP)	��|�RO��4�ܕ\���=e�0$E����
�6�haJ;�J��1��}�?[�5�D��}ܒ���*E���8W��N��+־��Q��0�% ';�90>�
ĸ��wo��,��#*��z4W�[�(� `����o&��ͷ�L�6�)��{�ߵ���_�졠�FTt���3z�,h�����	��aB)S(_�ͦ���n"���'��.���H� 2/b��?���Ǹ�
o�e?��XՖU
M~㣂o�b½��mKN���0�QR�S�t0o*��֑c`D���q����#�=����Nk�`_���L��~��0JX\~�jq��Q\�K�5�9L�I/7lSڲ{E�	�8��Q	ׇ��4�u͋U�p�V���"� �*���LU��|�uW�o��*�Xy��܃K����-�䃥nt�YJ�3�e���F	�.�ꓕb ��?�k�v��6ot~�;R&�:�K�S��A�`�ѮD|�y"S017p��oӇ�#�/�z���J0 ���Y�;pB�4X�
_��FmOdr{;$$ȡ&bc��,���n|݈=Y��ô�O՟��E~�s�л^$i�����15Ϳ��$&\���}���	��z�zĽ2�'��kֽF U����k!C���G/I��IZi�=�H���J��@��D��V��j���5ˠ��F���������fo��{`�9�1�u
��������$=�s-X�w��r��' p:{#�A��NGl���/�
�ڙd����mPҲ-�d��?��9��-��YN���G1��RrpA���뇼�2����Aa�P�f�ą�K�a�tWM0����5�Q���LY��_X��^�?���kYX�_������L
l��s��h#��6��I�\8��B'��q^����vt����r�q�FO�ڨT��Qa�����ײ>.�t6�-����P����m�|�?�?���yD� �/Ɲ�g���1͵3�\ⓧX��
 �_��u5RO{�xܿ?iV�|�[y�lb��-����#�Rӛ���4m�o��q�[Ɓ���=�	Jg�؀�~!<0����O5% ס�"fw�ߦB̶�k��3,f�g��bqSIm�7�[X� �#��A�6jE��x�^ V�|�a���E�%/E]�
V�I��ɇ����m�
�K�֙On��ĵ3����ؼ��K�O�p��D�qzu���=���䃥���ގ��^w����:N�0[4N���=�����&5ֆ������ZO��9�� Y�vu�"_��%q�o�L��	f����	�+	�US[&�J�=�gn����
��LfT��Z���F���P� c�T�p;�sI(�Br\�� �_�b�s!�^�l�h�nZ���
�$dh$<��Zb�@�q����z'������cχ���E�H��M��k\@O&$j`�^I&PZ#��o����w3"�jG�ċ>�89��i�:Q �	���s.����Y{�ꊏ���^��F��7�O2�GQ�v�"���gK�R��������bǃ?������ަ��2՚S�̟��=*���� a���,�I
������_�YJ�	�"'�Q�����Hb�i��t�=OS&�B#Z"�Pv�;)2��m
����K��lv�פl?��	ĺ���w$��,dvV����V�R�g���@�/��,X���9'��#���T	�c�>l'eV��F�H�~����!�р�Җ#�ǕI�� ������[�I'�`F�j�jOBl���욦D+E�93�/��:}˺$��v�Daqy�,��J��)��'U�w�t)~|,,�Q^"v���UC�����%��̹`Y��1�����w�ٚ�����t���#=�1.�'��_�1�ͬF#o}qpZ߲���i�+�S^���Տ�֮ʾH��o�=Ί^9�5���O����v60���͍�-ϯ
��q��o�EG��f��� �`�6�jEzb1� һ긅��ɯ~�E�X��p<rE:T����h ^
z�����s�mi,�)��d�O�]!%�,�z\��C���������j��zg�qG��h�7S�k&�%e���k�F*�4�'��S��{��`��sG}�k���ܛ����tЗ	b)�<��3Gҽ o�׿���-ƶD��ݯɰNc��~�H�:z=�./?���?N*��w���-�'����!kk�J9ѿB��,xX,ҾI�-������/ߋ�F�G��'���Uh5<�_x-�pA¯F��t1ʍe��#1;1df�h5�9o�g�����^�8���'?��8�Q�k�;�S�b��)�6���p�A �6^9�#ҧM�%o��
���P����p��<�e��=��3uv��ڳ�'��v��a����.Uϑ�RPj=��骓���������im����)�p)Tp��0a|��mKO>�	Y?�һ�gC7���47;�b|�IB�ضY��锶���L/5[4u7�f��:Y�:h��׵�g�y6����\R2��'�;��U{��:5:A�Ej��R�!'�S�Jp~�=���bE��⍈_��������b�+����謇 ����h4E�x�J��������`�M
���j���mR��	
W��ptW�i�YU+����B��=D��?�Z��$!�k8�m=�S�?�{f[3���L�V�1d`u�.Z��)z�����+�'�=�������H]놞Y �A�O"�ȳ�E���'1��qei���Q��/7*��xx��pҤ�ǥ��N|�b������C ;��d�����ӓ3`	�v�����{֧�n5�5h#��n�Sȳ�x�j�@Y�9p�
���rl'4,>{
em@?�[E�����S���TT�Gz+z�-?�($�(�H�Ѱ����ȧ�F�ONhd���itA	�|��7e^^@7�V�x��r�}� �������oa���_6ʦ[��n�v0-"6�~�`���N㯟�?p�r@p�9��Iy�Ar�:��5)�	�(�a�*�~���R�e�U�<���ݼY����:O�����Ů�T����~��}�M�� �`��0�	ف񀀎�M$�q�11G��8�A��`��]�>�َNtb�z�FMEZ��Z��t�6-6��<ZF"�Vg�������(s�w��L������ml�Å�o��ni����.��ʐ�ŠtT�@.琦�����4��z��U]��X��Y�u��M"�$y6:�7٥��SDgV�m᦮���㖗V�qXA�we�w|c��|���w�SŁͱS�%L�	�MD���;س'�/^�Xvã�ݕ��%
/�K��\�i�H����YQF�K1�F�w V�,�Z�D�dЧŒ0�b!^�������]��F����%n���Ldvl2l�d�]�!�"�KG�����x��lmW ��!.=�{���eش~����+ӵ�C��NPu��ٱ���#�j�ұ�yU�?�����-%2�ۢ�"^���L�i��K�Ō)ʅ�X����I���������]lW�>t���?�Md��}W�,{Z�4`���Uʒ�v��(�i��gD������Y���#�9u�q;Gf�E���|���DQ���BBfP��m�<�
�=�k_<1�x1 �s���0�p��ϗ8��)�{�HflX21k���";�=����J�^�l���ʡ����m�q�q�r���!~����67xA�亏�E
��[]54YX�gA��ϝJ>��~�,�p�����A����Ȕv��@�q�5`��%�`��*#^�Cg+��(H����ۅ$Le
f/�2^; �j"q|��J�'t�6les���\�\ϸk�%�������x]ڹ��%{�E�7�W8-ep�eֶ;�]����M<؟��=��Βs |��@%�w�J̈́�����{��a���Iݗ:�UƄ*]�H%���Q\�,L�$��)�e���!2j��3�3Q���7��^%}j�jĵ�:0�i�y�<<K�Ц��N	+��cǤ��nJ0pl�j�;�	'K��H�-n��iPsjش�(�;����=@W-���q^㦩Y/�Z]I�u�W�vj��5�`���mғ�w}�nM�Nh�������F�[۽qЊ�u��p���1d/�9?��)T�<8�0ZQr�P�Zx�����j�L~��mC`X���������L��q�3~�[����q�Ɍ�'��-�nU����u����}���[�� ]��.Z/OvZg
�s.�,D�"�V����n����4u�1�hm����Z�?�u:�^�S��?���Ҙ�5���@���Y_��W�*�Ӗ�jT�;�4X��������)@p��A�,�8�m���;�]��yȴ��c(�c��������oz��ҵ2�i�OE���-UM��B����ٟ�"��s�o�e�����Z@`Jo�����J���
~��,o�wac��E��1��n�����(.~�̰Ȇv�Q�M��}Ë8�Q�,�?͙�
��<w"�z�!Mg�	I�"NL9	E��{>g�Q����K(w�"���ﶫ �ܠ��BޅEN$a����D���!,[Mz�i�)��nl`Q�̂�pUZ��<��yY��-\�|{"fYM���tU����:����;���ݗ��1���r�5��}D�c���mw�|�7�@6��~Q��WG�W�"K��m���?��G4��%[+��;Tv�r�{9��	a�AᔾPpИ�n�Y&�����)+�� Dgq�֥t�{�pǱO�u[P��I�y�a#vk	G���C�k���l�dq0"e��^?s��W�뀱��m�������4�m֓t�6���|R�a�X��b��$�[��N��3��ފ�</��$2�!J2�U��6���G�?��8���k��p��,<5g#/%����]ӳ��	 )&[��<����6��Tqt��R,�u�%�u���\@o����ǫ��1�u�\;f�b��u+Q�upm�69ҥ���#0�
݃9���Λg�@�����t��P����dD��#�A�y�s�uP{�h�Z�y/��n�	�n�AC�_�ۖ��6��F����כTs��͹��7�t��/
�_�]9j�9��d�G��P�x�A��^<�,Cy��C�D������.��QD���$�ϐ#6YSj�:]̝�}k��vHs���D�]/�9��*�-�}�[n?��jAT�% ���	���d}�=Aލ�#L��5����s��S�rw��E��������|��RVc��<�:�$F$�P-�x�UL5r�e�T�g��=�y�Mn跔xV5��ِ�,0s/�GB���:0x��Vf~�rVCݗU[B0��oL�Q�p׈��Z����&v!$�9�%6�J�`9�=}L�s�Ea!3��L	�8�|4�g�'h9���H��������1N'�r��
�BC�϶�=��ᭉ]o$��",zu�Ӊ����ѷ(�e�M<���5]E0`:^ޏG�f���S�F������,�Ґi�%7��R�̹d^�*�K���<N�,@����)1������:+��r/cB�R�4���*M�*�F��������G\�̯���]g���� <]k��<�79����2DHL��8�P\�,�?��U��|aDӦ"�-�΀RElK�K��a�T@�}�����rf��*�.T�r뻿C1wq���8IeZA6�tN����П2c��z�^�Ӏ�X��<*���_�RG�A*�*p%�$���9U�c3^.�Ƞ��s�H��ܩu��%�N�n-e'use strict';
const BasePlugin = require('../plugin.js');
const { IE_6, IE_7, IE_8 } = require('../dictionary/browsers');
const { VALUE } = require('../dictionary/identifiers');
const { DECL } = require('../dictionary/postcss');

module.exports = class Slash9 extends BasePlugin {
  /** @param {import('postcss').Result=} result */
  constructor(result) {
    super([IE_6, IE_7, IE_8], [DECL], result);
  }

  /**
   * @param {import('postcss').Declaration} decl
   * @return {void}
   */
  detect(decl) {
    let v = decl.value;
    if (v && v.length > 2 && v.indexOf('\\9') === v.length - 2) {
      this.push(decl, {
        identifier: VALUE,
        hack: v,
      });
    }
  }
};
                                                                                                                                                                                                                                                                                                                                                 +��մ��*Y]�@��0���C6z�iP�x�P�p�u�M��@ˊ�}N�)_�8���Ig4��Ȯ�#���5��S��s��1�T��G�(�
��٪��ag�Pj�po���"�G�Q"I��!����2���xΞ��}-�`�)}���P��Ȋf����&X��%�nO~�k�ֿG�t��Ҷ�a34���En�q�ߡ�4q���0�Hu���=ZD^+�`O_�Y�-�.
{3������r]l���Ya��7��/���+ɋ��t=�I͛|�|ܑ��"2'"�y�:�_l���!n�WD: BU��L�
�Yud�穁�J��/>+̚�u��9��^��ŶfIr/�W���|�+{]a-���kyS���N�aֵ��d�q�}藑�L7|������"�B&Y�F��9�,ס	��M&Vs�a��7����@f���O:nY.�S�P�	U�3��C�9Q�p�>�X@ڎ3.؀=\0�ڼ4���6Mވ� �����T���̝t����3���� �[�F�VсT�2-�Do���7Ŗ�j2�G�������3&{o��g��5ҕaԎD������\�w�X��"G�ќev�b>�x��D�ɀ+��cK�޿�"!���d	xB94��%]��^z{�2�^�9FT���J��	�Q�w��^��i0%�H�}�:#�2�jWX��ᅓ�d��B�Iv@+�zI�6����,�b=��(��5^��(���ܿѪ c׈+'#b��C{+M̚����R��8g�:i��WNZ�\4|LBv��V9do�����Ȕ��ag�SUT(jz��p��.��CK�SlfS�$�?#~R��D w��B'����6 	h�B�F ��x;��v�5�M�XM�G'�(��t��~�����+��l���
)��E^'����I|ob#V�w��]R6Ap�x%��6}RuNFl�8�p%Mh	z�C������\Hm魷b|j�nH��^�A�����04�O����s ���� ���z��DW�[��*8ɂbh��PZ�F�F������-�V����,`�=�Y�z���|��CKv�zSb�NG�zȾ��:
�������\Ryv���b}m��y�H����[�1����qH�5�9<ZTil�P�.�9F_�� �A�������}��kq��8p�������O���Aq�%��9����y�d3Ke���B��C���
���l�7��Z2]��o�(�C�R�h�Z<��ݯ��__:@V�� O�Ú�h��w�zq\��l����� L��)O�jʺ`SyZ�K.� X)� � 1�I��g�<onO&~u����0_C��3:��*��W��uBy�'�fV�%n� ��B>.�KXY�>OS�L��V�N0�b9���k)�+��2ϲ��첀��F��s��9��3��v!��S�wG1y�t�z��~.a� ����?O&H��c������nQ�t�5�(o+�K�C���%�u��s��/��N:���/񊒋
�لp]�lhڬ��9f�!��1�R��9��AȬg����D��4��¯i9g�����8�&���������ˑ:3!Es�f�\���q���nT����h"��ܘ�[�F��� �'cI1En������7��,�siK2�с��k�G�V��"@�y3X믧�}�O�\���ˆ�=D��m���I	K���\� k���Q{?�f��k��?���w϶	�)b%����k��@!���pJ�Y^��,���y�m�.F9����N��wK,$�q����P�Ԋa�:Y.^�8��JWU��eX�G��jJ��b�N9��9�Dq�����3-�l��(�/�i��'�kl�0@B|��[�� 9�认,��\�:�X��y!���J\����%�Y1ƫB�oYpzՒ���?�8�E<=�т�� a�E�Q����<�'��ʭ�������a�z�Jv~��>���S���AW��u��M����6�iH�l��:��iv��	z*�;��:Ќ�$�DX�R:�L�X3A���Cs��-܃���l�?mZWЯ䊓��Kr��Z���3e^��1N��?���%����\,E�3B{C��w�k���� %<g �Ʒn ��1M����z����X���q���>�C�p���iu����j�~<G}Q���Z�� q�� =g8��b��rHsd9%䫜
�{ɽ��T��eB� ��`�,�,~���@WɺeY�l<�0��|�Hv<������`�j��|�.��C�]��De�H���c�|�T��^_���SR�A���d�3��k�ٵo+@��S�4n�v7}��ޤ�R'���t��\ly�^ݔ%zj$�;�j��-�	p��=z����i��k��P,�xK������|i�N &0��z��w��5esL������f��ѧ���<1�Y�q\�o�>c��Q�X����_��)�������T�]TK�v�FA����	� H9;�D8�/�u��h�;�QS~d�9�1�e��zJ���l[��S5��,-2�� ��-̵
[��d�(��pw>!Y7N�5��ˏ$�|�:	>cy��Q�&K�J�qw����zÚbrTR���1��_���-�����xY��Fa$�"pK��Z��d�vX$���ԯ�v4%����в�3L�WPRCi�_�P�Ӽ�5] a�ɦԥZC�����?[��4�F�}v�wX._bAK�c�]��;�OJ	k�魧���7m�W����v>Nb�+��#�����v��eV�wX!F�Џ5����
nц�˙��<�)�Uf)���*�Tv*���l�}T���/�T��;������:�/o��*����`m<�����[�G�{�Κ��^�~�FK���T�6\��%��8~�]kt�7���W�a��`��l�@���;VE�U`���]�Y��(�;����C�M�=~op0�KN�G�Z���UK;[�����*�oFY�ۉx�����+ғ-�ͺ��0��+��J�"�E��5��)�9���T�j�Ш�M߻4�l[�@s��[8�8�e�x�)�m���e;c����'D��Y�ҵ=�:��ݪF�b���G���<c0p��k�j�(%̸��w�cW���p{���X��"�I���d"�
�?�Q;�#��JH�>d'��ϔ{&W���>�n:e�n?�m��vĹ���^m��t�j	MT�Ԥ�n�M�cΠ{�
�l�r�j� e�]t0H+��6hfّ[wz��Z��6�5�7a��l�I"�'n����V
���A��->�������p8;m\��g2[0��T��19�a}ztF'.Zݏ��%����S���#���+ʧ��H&2y}�,�S#���ў���}����8tZ��D��J�M�wN��;�,����-d����{����q�}�@w;�
���Zd�\�5���~�2<mXPj��y6�Yϒʴ���(��V������z+]#��|c~���w����, /�m�֗K��B�� 4��[2Z��y����Y�����]K��E�vNs�<:�3�x!�h��a�{�)��4]]l�w��m�J�6��[˸-roLv���z9x�����y������EF���\�H2�!�������l��d.����N�0q'�K�p�
̮�+~G��<�\��C"��E�〖�8�W��k㕢G�����de7��c��ra�J�z�� ����j)�sG0�m��^č��m�݌�Dx��*�1��f
�/`--�\R���ܘ?��h���︽�@]|h��ࢅV���6k���`,uz���^c轙욇A+w����u��K�,)��␅B�D����w���`�"�����S^p�+$4 <Z�֙G.��2��(�4�np���C��rˌ���	3EN�3x� �F�r�?T�l�:�Q4Ӿg��e��$�����;Q:ވ.���w3Zך�$|"c��  XA�"lFu8rЯ.�tNfs�ŀ��a���r�g2!�C�[}��������;��@����Z��Ĝ֩5a�P��^�z{���PI��e��DS�ƍ@�NObk�*�U��o]BP�̇�6�GP�����r���)�;͂k#�/S��:�h��L?�m�]<�����i���v�]I`�#Λr*���et�	�Ho�����h.��M�2k;����k}̒ 0��xr?�� -�����㈩5�4����v0.]�
6MVS�Q�O�8�8c ( l�z�8���ɔ��H�Z��>��@dω��T)@��]2OV�QR��W��1s&u.�#=�O�f�Sg����ILiq~�q�N�\�ّz����?!!�R��H�v�pI�m�����s�ڶ5D��5 fw�Z��z�����(�»�9����v�t{k%Ӈ$g�s���.��T,\�1?�J=��v�c��k����3�g��'�o*o�L�SA: ƥ7�n���A���`�_VV͗�#�߂��K7� ����l(�H����ʵ�����4Ζ�ئt����u��5Rǀ�p�g��S+B�Ɖ�F\۔Si�,�p��t�!	>-W��� ӆ D���j�Sؤ�����x����?2�iN'�R�mmۉ4�M�`� m��ܼ�t8�]M:RD�%ul�������r.�-ȳ'��¡�}D� �^ȶ�k�m�"1q�|�j�ZV�����	m���g�Qnk6���Do�5L)�:��-���)k��:���Y�2��a�I���SMz�xX$�?���@�)˔�d�c���>'{{tyF��@U�/�X�#,ts��Җ�r��_tilT�Ba��ox�L�����>q�MQ�kv؅�����Dl�W᬴AP�2��Ue0N%]��|L'쳊��`�r��a�\�n�����'�z`׋��{)���Z���Z���5�=�L��'kG6M�˲V<����/G�����\��`܂&=T�[�2ϓ�u�@���/�ڿ�T�oQ��)�w+�)��a)��N�����3kk���1�כ޳,P����A*���/i�J��/#i�D��64�U��w�2$��5�cW0zi%��Ya��1��{b��j��G�3ӹ?�%�
�ɞ��1X/�M�/��+/�p�9�y��U����q�/	�Ň	�L:��/r�єA�Ă��1�,�Z2]t]��L%}���8aNPVn�c`�<\$�l�<&�lg��t�)���3D��5y��*�9,hw���&���uܚ�]JE�o��P#��
b��x�K�f������ٽ~��`�~��EA�]�A��?�_��[7jLU`��xs��eR��$��ivqT���3{�e�)�&��ZB�z�[���wԤr<�\B�%�� jԯu� � s�Lc�:��B霡�� ���@�t��7kg�1j��л��s��X�ݍ�VX(��e?B��������}V�$��*�2���2p��ޝ4�]'�y�^v���Q燬�l�j��`%*��?���x��	�uM����0.��8(�����~��V��D����L������џ��]������N�x��E�`�$�kX06���K���=���Y�1�~�e��R臇c:��A�y��������I��P�|դ�r7
��YU�UF.���6�h ]vd��0��J�dq?}}����"i�|�4����Lc�h�90�9)gz��r��JR���8�0[���]tQ|Sv_��ʗa(0p����y�i�jFD�=:�y�{*;S��v�"����@_��ģ'��#(}�Q����z"����@�?5��6w��=33y�J��iܼ��ŰxI-|��m���8?[G�&,Gj�jK�=w0�DT��`���Jʟ.�<�DO�A������o�Ӏl��0�z�䣃}�[`����ot��ª��e�}\W��#;�����2�!����z�hy�E�/e�Y/ۼ�0���L.!�� 9_v��U�U��ݬ��~eof��{y;� �tc����&H��S\��L�^:'w��ez���@5��`�O��ӝ�v�>]$�Ü��wگ��߃�jUc�v&�M��n	j���w�B�v��,8�z/M���8��e���mE���x�q��j�brm�9m��y�g!�����zvy�$���2"6���3f�#L��%+�f�+�4N�x&��P?O;Q���2*��9��!�ȹ��pYG�:�x��u�#� ��3a���|\������2'���XoΓRB�p�V����D�L~� �-��˃�K�wie��D�2��}��֭�F�E=R���&eU/c�*j���j����2H����]�<_Xѩ���d��(G������^�U��#
���<Գ�b<o���4�T��wfTK�v?���q27��7�ui<�J�0-���"��]�"��:�z���j��?���sϴԅy�����8�MM_<�/���H��Y���.����������ƻ3RӸ��Źu�n�ب˶2���w�#ŕ�ϑ,|9��$E�����s'G6�ƾWt����Djƴ*̗w	��U�x�>�y�W�����
���s��+��Eugi��Z�P�J���k�8�l������E?4Ո�4�E�5�TAm�3S�t��h�IDT~4F���)7��0^ω�m迦�̉�.Dg{OPN�.��%�Sߵ�-}����ӳ��r�%H)�;�&�/��
��[�yK[��E�exh7�&wH�������m#x�=�ܰ���G�JR�+��>Db��km�tp#kH	L-+����1?(-Te<���M�IoWsm�i\�A����lx40D5y���7�f���WuK�86�j�4Ug]���P�L�)��3s���Q;I�W�J܃̛�����$�"�sJ�ZXSc�:����.�/�It����e1�)��sD�茢E~{�T~�dJ�l.�#��K��n�/
u�Is�yԲT2{�܉%�
3��w��Uˑz2�Ȑŝ��8�e����M���&�JEE��>�`��&��%�<����C�з{�u&hfγ�XN�#A�������WX�]�Y�|�0�9�	�&�0���Ojދ�t��D/�Re�=Ӷ}5�"gQ�$�}!M-���@�]�c��	1�^N�蔵r3�~�W#�T��,������%R[F��`1�(�G0��W���8͏r5���ߥY(M����j��8}�(GL��5��.f�/!�ຄ�X������q�c3����9C���s)�p��^�[| ���=�%Nh�8�<�e���V4�   ��Ay3�8�DDv(3�1�,z���ʸ w���l<��*"��F>A}��iB�o&U,~zB(S�,������+@>�ω�rt��7�5/9p4mP������P;9<7t��X$��<Bq��P_���˶1���r���_ '����h��}zs�@4��t)!EA@ ��@X���]C�#"�e$2��"B�zq8˙TqR�y��f*�x=YWr�pw�-�̫�h�	�x��V N�����|m�Pqk���tu�rE�{���2_�(��d�N���ݢ�f�N���žN=�u��^����E�e�V,ag��p�{�{��´�ċ��!��]�u���&��?`   A�D_�2e0�?����@'�UDmVL/���ɑ�G�\��0`��&X���
x����,�k0��:|�K[��I5��n�P;�2L��)�@+�Y�|���>�:G-�&�g<��}+�u��25���eYP巙Ԯ��48Y�z�#Xc¡HF|��#�튓d�z��\UA�ZFdے����V�?����U%]t����D�L_���U��4ϯ�:��oj�����a�O6;��`\��n�0.����!��c2켢,�"Ǌ�g��_�< g����[VgP��t�
�*��3�B��5�`q��x�Y��O�QaM���]&c����^܆��>�)��?���=�������t�͝K���9۞o~��քN��h�(��	y�IC|O��-8����:�+H�=��@ �����v�E�4�tD��CX�7-��?�å:�kڨ��Љ%fEP�@_/�L��b���x����sN�p�?��Cvm$��v~���C.�]z�����<Y�9�
�07 j����Z$Y^����|�֩Li����[~��v�Bݗ'O���Ԑ#� �O6���zhʗ��5tv�56�7��S�k&<����Å;��v}$3i���L���X�-�R��Ċ�f#���'T�*r`�)����S�JwI��Vg|�'M��!��/)g����h��m��ί/x�ُ|em{�,-`��DJ��0�w��G[:�f��
Ś����#�]�ㄍ)�E�|��e>Iq+�߅��{�b6���W�   ��cjB��(h��s������%\&�u���po1a�
[ل1�����R3�Y�ݪ���䃐��3C��u�9�3�ͣRau�|���D��Nʩ`)a)D��,���gb�ư뱵�����%.����������8��Z�K��/:[!�Q�~��4֣��oh`�X� �I3�&�  "�A�hI�&S+��k��Q�>�`Np��op؄��1�����/��E3P����@�p�{Ȍvq���$���T�Ќ�w��@��O���U���
�zxK�~'ol���'	Yt�Ӿ��"�����QK��t�lt�v��3���x�PT�}�#*x�1�9�.����y�xN�U�W>5�AD��DP)c{w��E]!<��1۹t��\-h�f9�)�L#}Q͍(3�����"���E>�rX���:ʃ��[1ϗxad��#Ƞ��0v]�ĵ���5�i�Aw��f�i?�1�Յ�,M*�)�>ï���\s]��f�l�j��O.�e�F������������!��yve�]�ںeZ5�aV��H>�J!y<�Ӡ+��2���4�,C7��,��~ #�8ó�~>����Vg�Q�6;��
�Es7�7�a�z�e�g��������s��1���	Ӎ;��W��|�B�َB�q���~	'������N�� ��k*�q��S�=�V�4P���Mi�nbQ#�T'F	���}��9��k�A��e�F*C����i�f�-�u=_��gS�#�ίm�zgL7d��l�E9t�ZH7�X�릉�y�c�n=�j��}�F?�+c�
.���v��{0K6���i���[8>W9Qa%�[K4���DA����g��l��V�t�w=�ZL���L�M4ě%��I�7�H����� ��lk2��\����e,׊�+&u���U.���_�T����dX�
x�z� �M��Y�=� ۆ�F3}������!�ݡ��g��Y�?|H����;���X��j�S	���ZwoT��&^�r(��q%��Q'�8����Mz[W�X�w�����K�ܟN���Cp��H��V�FL���`ӛ��� Wҙ��@򙐮o�	�"Yx�tCO�,�U�������TFt����#�Ǯ�%��R>��~���Ϯ��K�6ꄍ��JBD�>��r5�N�4(��_�#�8յP�&Ƚ��n���d�8��S�T�3�qeͤ6�5��?8�j���u�m�)�)�����j�м�¶�y�H¢��������A����QFg�]]��$����
�V�k���8n�ҕ斥˘�܂��E��;�s-�L.��(���n����A+���$}&`�H��,l��L�J"�L!ѳ��q�Kg��Rt�� ���]���	���Ș(�F�DӄyE�v�G�/�����;��[�0Mm��ӫ��Li�0u��iFS��;�=�{˧���� �r�C�ɾ��v�+��&i�z��uJ\2���+��LU���x���45 ��'��|�����w�B�n�Sv�c����,\rkìRe^u%/#��ej�����?V��l�	��u��=t�ӆk�+�������iT��-U'ܝk���񳒔�(�V�j`�u�.�_�O��$�"�4�n���R�������oz�ӓ��A��-В�FMfz������#+KS���.�1!��|�����pe�n�/��s�N�Ct]�ݳ��g+&vbH� ����ke0��B�F4(A��n����}N� )��VD&+�|<�Kr%��8�H�<s���kn�n>g~;���v�hYؓ�NY�䕘%a���9$yA����?S�eM@�|�=�l���"�f���zse����o�>Xv�w)�y)K���O�*Y�g���U&b&Ӣ0��9��8��A��X�*�;���_Ɣ'��݂FȻ�z$� ���f�қtQ�+?>\�m1�!9�-��B)�&B��FӠ�%B�L�k����!Y<��cPQ�0.s�e�\۩���ֳ�h�v`���Y��]����`����{�;ڿ��e�0
h��~����A��	K��-j��@�th�Y-AP�ә�b<o_g$[�kO67��\�<Y�80֬X[ms�q"��Lf>`O�$,�&s�^jf�_��2���̂YȒP���JP��r�k��ILB���;���q�O\|��$�Yd7�B'�8x*��龸[Pz��U��p!��]�3f�ؙ�Q� 3�F$�����<�H�S���K�R�{����ip���1&sl6C����oAl����kp]�P����L!v��Y�58	u����@,/k�]TM^{��������?eQ�]Ɨ	����l�6ޑ��d���`S{��JO�_]F�_��Q煂82�Ogz�C]Y�w$=5�qԀ��rm^!0ǳ#�����=c�7{
rd�Z���Ρ�n���O��B��S4}��an��K�� iN��Qߺ����Xy�^�T�|c
(���ψ�?��� �~�ˤ5-��S	'�7�	!/��ץ�aӰ����8�đ�
{��;�0X�a��n��x�Z;��y��px���#4S8)˂��lg0<��%�<�I}H�����0���w	7\����m��	)���AO��il� ��G/;%S��TMD��I��:���狫����vF:��u =�����U��TF�l_��k��
���p� ���*�R��yVuO�b1�s��|��c���!`"l�>/���;�s֫6���\�XR���V��"L����YX��TNn�9lM_e�=�o9��� C*�*���6$(TK�^�&�-�N�<.����T��Fe�R�_�yK���N��d\9B�V���mc��>�l�v/WTTh;6B�%Q�,�8�r�ᕙE�A��=��<��
Jn�&+�_q33"E�|��Au�L������؈�	Bg����P��@����_�L�(�7�UدnUB�#�V-��j��v*�g�e�n�a ;��jI�g"��n�Q	�!�����֢D���|��Vd����̙�JA��ݦ�?�쭡n�)�6;�;�lB��劽%�(�|�@"�|�6]��窗n�
��W�9ͷe���e"�"���=	����~-�̂�������ܬv ��It���bj����B�`�F�������<٢� tk�36�Y����[�Nmk�;����_�D����&�j���G�u�ͳ���I��I�@錩I�ME �Z�x���*��
\��edp!�w��3nÜ��P������64(X��O����(�#Wٳ�0q�2���[/R�y�ԤZN�P⯄82�7����(�̊���m��ER�#S�^'˧�b�"ەƅ�(���X���c[v��r�I�wǝ�(mQ'�J̊k�1�iz�g6w�<ݙћ�N���R�c�s��#L1�Y���.�;���W�ȧo��iY8r�%�λ���ܷ9�#V.�X�6�f�� ~����^�6` ���x�-�ZT��l��f�G�@�;tU.%M>j���uU
��P��U�gb�|��G�j�\�P9�1o�%zݺ�{�n�u��A�I��(�W~|�%������P�/�����k?�/����0҇�L���.�L^��%��S� a|/�;b8�O0���l*��>X����߄-|K�!s���v���:��dy�N���ۘ�t�>���7P�#�g��=�0
�P��K����{���o�R�fZ��PJxcboaeU��CkgM�e���<Z"�oaoڬ픃���4�F���5��������c��^��nK_�T�f��57�Qz�: ���1��1�C9z���"z�E����B6s�7ϱ���usL�g�BQJy��;6q����&����`�$T�@��w��@�5�^5�`V�j
�3܍&��������c�Β�	��{p�ׇ��_>�������϶��E����o: �Ci��]*���Ԏ@P9��Ca�X�Ӵ�d���F�Ӌ��UK���ZeV�*$3��2&lę_,A�P�أ_�&�3�f�����AK6�];�g�uo���('2�����
M.������5Y��F�!�C�
��&!lvɘ��!8�.X����D��&��xdI~�&�t�!�C�NA��$샞�8hUl/�92���f�#��HH�s���C&=�1���R�'M@=�̈3�ₙ􍐥�N��]8\h('<�|g<��m��)/����+@Ñ�6ԕ펽����~,@���s��w��8[b+J}��wL�G!Z%�q8��ϻ�_C06.��XusΔ�ᆈ���e���i�r�Yn�s�v�� ��8�hi�[uZ�:��E�^Շ�H�At�rw��H]d��c�L-I:�r�$���j.dCĄ�����~6����,�9���QY0�#i��.��^.�Q��E��R�] GS.2��ry�1���9�zX���s>��o�ȸ�޴�	���w��(���EK��*���E��{�k'�#^�(��p���;$�l!>��E�D�����6gvE����c�"2g�V��z�;��Zۃ0m$`{�����B��H,�r �Ɵ�Mb"� �)��JS��L�?�.z\x����"˚�/W�w��;K��k���!Aq�T����<�rդ�>J uLZ�۰�UvKxv�8SL�j������ri�x�S�T7�vsU���~.�p4��S%8*O�z�;c��v��cw���6���7ŗ�Qg�X�Im��ӗ������2D�����9�K��`�sͬ& �O���9�� Js����,2�yD�M��ۅ�,26���7yI����%�;jr���%�	��ECv�z'�/6�	��-�E"w�� �^)��>�/�Eۑ���ڽ���#+&4SuƲG��Z��<� FF���7Y���\M�gq�dL����t��,�E�S���=��C���
*-<|�"[b65w�og��B��9�����J=����B;V�	���&��^�Z�Att5p.�2�lS]2,F�������h���!ҙ;�r[K��Z�~Q���p�PG;#ERw��V��x����Gu֜�H�K�~��[�f����a'@���>2�Rһb�M�y�]��G�s�^���'aJ\b(�󗸬Wy �N�ʆ>�,��)pe�~&�d�<<�,��>�1>G�%(��+G0���I��r��-�P3���.2�tDRB��m�T�~t}=H�X��`3LS���r��`����%�[%a�����}z�h�*�&���C��m��X�A���)oo��?���$�*�"7P�D1���1h:�w�ˀ���ٛ
)����s�<+U��(�g�l���&v�pM��I�9*�ql��2p����31qS����)<Q��?��rQ�Ɔi�!k�  V�
���	o�`����؎Z�B׻�Z	��������z$���<�4x_�ܺ���W�}ڈTL#��_���㫔,ޓ(����))(�0��r��(s[mn~�LT�$���Nb8�XGu�9�������'ѽ~���v��:��n�(�ʰO��X(=����|�  �x���1�s��/-�zׁ����(�MD���Z�8������"D�h �m�Y�kκs�m�;���$�59�q����i�xı�3Mp���G��ǜ({�󑨜����'��wQ��V�"���z��5zLu�����	<2`w�h��3�[/���/�"E�{�-6���W3�"�1�*�fJ�c뷖��t:�'�������ݽ�j䠥̠��֭��?���?����GJ��-��eeq�d���SN��|��bF*�N9|����l�Ef��c��xV�%p(��� c���oa�[X}�����]��)�&�JL; Y��b~��B��M@�nh>�'Dx����C\�I��L�t����礯�v������	�}���x�w�����2[�|�/��<ԉz�[���!E��/NT�d�Rm�v ���O�������M�7�e#��"7J:� �ͦY�-c�	� ��znVq�R�Rԕ�!GP�!�f�j��llB�p��yttõo��K��w��8��x��}�����*�_�(~E�aÌ�*Vס |��ۗGJ�D��q���qu\���λ��Obϸ\w���R��Z�PhbQ�Ot
FMu��.��-��x�x��nb�Z��l��R�L?���Hl.��`����00S���۽m��]+���whv'��u,��ҟ���\�;�:�6�w�.�g�X��Q�+N�@�.G*4O�>-C��@�G�L� �		�rUxiy����dr��o��l6`-  ���;X^M9�v�F���K��tmB�f����֦������O�nk��� �'��x��&�T��#X������\f���cq.;�i����eМ6f	}Z�*&E���O��F��j)�*��>���y!���M5)ם��g��wd�t��N�^�}V����o�����l��N��U�*0�q�}�/�Z,��R"���+��ZtB��7<\8�P��~5��kkMV��;Y�W��7-�乆�'use strict';

var isValid = (module.exports.isValid = require('./borderColor').isValid);

module.exports.definition = {
  set: function(v) {
    if (isValid(v)) {
      this._setProperty('border-left-color', v);
    }
  },
  get: function() {
    return this.getPropertyValue('border-left-color');
  },
  enumerable: true,
  configurable: true,
};
                                                                                                                                                                   �1/��?�
-��+'j�#�@3c���R�9+��\�}�tV�T��E�3�^/�����c�^B�玽��ꭷ����ZZ,~��W��Gۍ�$G�0��KR����;ri���Ҁ+ƍ�;��A�
r�;�d�Z˃�������pN�A������iz�úL\���曛��tU�SSV��׾ɂ�Ac+9���wPP�=׊�;EsY�H�O�|�Lx�P\�F��c�}U�+W4�I������pK���[>�ٚ�I"�h�I�}#�Z�GBz��L��W6�?�NS塕�C6�B7+=� �ܑ�ɡ{P�z���.���Qmvb����X��zphu5 ����hEq���� ȯ�$~cee��3��ٛ�Q�Vx�<��Թ<��.�z����/����u�ަ�Ѥ���3��#�,���3�YI�_������#�1�4��6�@�uhx̐�^��:�N9Tu#�6��t]!E=�k�Ea�T2�"E��i.t�5gDI&�z�[�4-Ԑ�]������d��m�8`�PZs��N7!��.%��oD����qa�˃�H�.92�	��gc$�Ve仗��,]����xjVDq��DRw�������ʳ�:"��(P�H]�4,����P�:���;( �BJ)��G���K�iU:M$�P�7ʔ��^B�-z���` n�evR����MV^�|$�ѫ&��s@�����y2�[� �2A�;i-���lͥ�it����/ �fJ�(f�wO��6N����@k&o$�N��\���
���s��;��Ě�uh���;.��h�G���SG��L�
�����H���h�>��������(�VC�B$?Uۦ��h{�;�Op��r ����|{�H��3c 4j�s�"������Q``�x͹2
��X���; ,�t��}3��/������>-}dC��^�m��Y����`ϗ�{�)m�od��rf8������H��%��$�'��Ԅ�`�ͅJ��#�Q
���LŔ"�=�"GO{H&�S�io���>K/J����m����G����>Ln	!�`���+P�n4���qܽafM��-��v�.m/|U���Y� ߚ?�޶��E�c�b[��&7��qB1�k��,S5�&���k���?�&�C-����� yG_#�7�֤���X�+sB�����Ǌ���(m�,���%��(=� �=S�"�߁�X��p����ޥ������
|��Gb�&3�ۨg���r'$7�L��Qń���α�V���� �a-6W
�l��'��&u����)��>7�?��є�fi:��Z8h2�VŻF�M|/G���rye��p��)��n��ך5�(70衄��7\R*+�A/GF4��1�s��L���^���7˱>3��ԏO��j�v�˟'$l���{D���{
�x#�l�4��?|q�d.�`*�J
Ҥ|'O��4`9b��Iu:���X�a�"Ԛ�N�`�{u=���nw��܇���;�^���I4�˹N�D`�p�o�z��#�	Nmb�D?��ppB`��-���L�ns?q�M.��Dr�)�bwZ�#�L�||�w�	�(�O��U���r�1Z?�E���v�`���>ɋG,")x/C������z���h�k��#w�ʱ?.^�՟�Sh�{���U]�a�a���s��QC���Wt�b	������ʽ������^r4�F�S2
)�4�r(ג���܌E���M��nO1਑WVU7m)14b���O���a��"o9������{�m�>�9��(P�j��-�w�+l�U�z���.s�=F4��*8�! D�\*�o}b�g縟RV��Co
j��9�)�u�X�_������M�r��%�c��/\��Ͱ}��n,��m�0cx�ab���`�*�>�=�+���"F�MfG�9k��e�űE@7U>N�4s�)�A�)��E�'�"�L!������e�RzY�"Z���"0� ��  IA��nQ3!�sc�� ���?��h��F�'���� ���-��qrr��_4�^���c�������pڤf�����\���~(p�f�'A������fU�� �-2��P^��C{G?����I�	�=BW�Ik�I��].�H2([� ���c�M��������������)xﮚAw�Ὡk1d���<�ljܶ�*�P�
b�渇�b����t?d��Z����x%.����I`�G�7��{�D�̥Lʗ�)wl�,(l�ol�lʼ����{|G�'��7�Co�E��#����`��������kq���O�����"�5}�-�5T/�tҘ<ɞ:�d���H��2���z�$���C�>2S�h��EgƂ�Z��mɌs�<*�fu-���4�q��C�7L�K���eP\$�oN�r����ֻ4Fë��w�E9��@�@��;_������F��Ro�T{��\������KO̴ӊ�dN��{��	��
��K$����+�������r
����3��-.�\|�iHQkߟLG��~��#�������5��HI�r��YI�d�'����K  p��i��`�RV�\Ʋ�#(�iS�qa����nF[���G�b��3���yPV�>�C�[w��aƕ~�����|��{��/�,�x�L������2��vUq����@X�K����⻦p�yL��S�5`��sL;�^Ǖ�h���m�#�g�
Ѷ�m<o#F���Q��S��"�E7��m.�UQ�t��$��sg=��ow��!�y�:������v�Bd�d:%���wF��)^�K Nu��f^�k�]�;`G�����یOoڲ�E��+zk��"4\��UH;yMvo���.�8"~���Ϣ�hV *� �ȓq��|����.5��BC���&K��g\ؑ��q?����}̀  ���nB7����W ״`�wI����!c}1�p"ud�}�8"L)���*��)9���2
DrJ��l��,.����biRi��)覞"�V�0F}�żn�וD�WT�XP�k�y��k$�N�Ư�Q�V���(.��}ػǾ@Z��e?���[!u�{��x|_7CX�'_h�g�T����� ƌ�N:����g�4�AϩtA�n�r�V7y�7����0��+OO$@�e}Pz���z���؂N�ы���~�V<b����fS���C�vϘ�c�x���������ȽV�Aen%�s6��1TR��h����_`�,���n\��{6N���Kq����E���ŉ����ڼh}�P��j���Q��
�)��*��e�����NH4��E8���)Z.8*,��%�n��>��̃l ��k�;d��Ftb[Dq|��s_��M����݌���id���0���ޭ�}�up�Dޕy��3���l����-�JU���5Z8�va;��KeK�+�~��G^&�~>t��&��ڞl*)�R���*S0��@[A.=9@ j�:�H# �  �A��5-d�`(�C���xuA�ݩ<�dcE�K�����2��)aT�)�\˫�!�py�O�/]�L�����'���{�A��*�'�r=�`���wxu3����'Ub�|%��X�`48�(��+D>Wg�)N�2J�>^� y�I�z�b��Ei:X~�h��U�
���Uq�A�z1���16�t]2/]Zc��y�5>�v�?-r ��]�	�A�}�����Btny>~H;��.��j�׌��C���x[V�T*�ŴP�K�5��I�I�S'��R��iv�9R�\��@+E�d�C��Z�W��O�-�.�#J�tA'�fΥO�d�K��]�&@9:�Ƌ(�������0�䢥C�N�_lM��m��!�F_��̖e��	j!�I,���/�:��l:J4'I���	y��Mq���{R &�d1�3�I��
8���'\L��Dz����
���2:�|B2䇞!�mv��Uޡ���2�d�K��L��mBy���Jf%zW@��c�h��������&�1F֟Z/�������nl�x����8M�8����)���s%O��	ml��iV �8���Y���`^9�@���%�z��'%`��>�o�
QFS!�F�{7�d��c��=���I/�����֓�3*T�r�AJ1.���lȚ�����贈>P]�Av�fio��n�2S@��#��CoCw��	�)H�=��n�>�UF�%���3+�k���cs7.D)gGN���`�r٪�؊VyH�
Җu����4�+s���8��65.m&â�b<�Wr],�L�0"q�B�9P�K�C�"��ܦ�������
0�@O+���~�Q�!ť�&9�ɡ
vͶ��=xҿU*Oئsn���6�8�������Ԛڣ��18�������   ���nB&�$���7�)Q�䨿�KN晦{��
m5՘�A�Nb�9=��_����xiY=>'��'~���7Z���ڊ 6�o<u�'+ֿ�-�R�|��*�N�-r��3tC�$7�9����R�$�ҩ9�T"�oԉp��V*�]��S�N�o�H`D4��d)< ]�,	�q���)��
M]��-�3��#"��.0��/ `�-������[/d^3��eL+Q�u��G���s{���kX{��-{��g��ۑ����m��+�� ^Vv͵uR���u��t~��\���L���j�M��Y6�*h��T�Wߧ��?��#�  �A��<!KD�`�����sh�������(6��3��+�S��\���F&�){_��5�c���3�g����v������6�W�ڗexD��gp�W��n�B����VJn?�,�ّq�Q6V&�RcTk�ݒ �U�[�3]P(|�ڶ?sE#� �������dD�4ף:M*[#y���@t���	�SB�~���Q��?��,D?�
0Cq]D�Bl�i�t����G�3��Ҩ:[7J���'G���`G�~�"��w����5=X9~��g�:mŚl�|VR���}��c���F�vn#2��0�M����r�)���qJ�
$J�=�����#K���-F{���c���k*����]�:}2ԝ��<n����%M��J&���d�e�^��$�*(�_Q�&�8ȧTA]V&C[
sY�=*Sc��hzb_'�g�%SE��>�GՔ�|g�}�T�Y�U��� :5o2ub��<�@Ԯk�T?�{g��h9���+�a�)�]��W$R�w����t�;SH�{��1י�n������ÊO$|��C�.�hh�X����'� �e�;TO]�剔0���"�QSi	t��-{��^7ǩЫ �t���<*o$�ڌ��'"���cS��[):�t��6����B��r�KD��������y�L��?d��B9r`f	f�WK)��@��'X�X"z�98�v5D6:�#�!�N�vk�[s���"F�ճ_�߻��U��Y��g.�� ��ny.�������z��+Y|LK���;05�9�HF.�'����ȯ�,�pgf�Ҏ��ʍ�-�c�i�v�ۨ*'�/��I��h��R�q}0��,(A�㩾ȅ�作թf97��]�fǷ��`y�q��Aa�T"�`�f����D%�� ��_m��&���4%��]v.ށj�ڙ�E�RLïOO�� [w���rSȸ\TQm���~�1�{�3�s1Q�U7��i ]�������ėX��L���^��#Zq�!�]?�G�{��cکo�a�5ˢ��=X}�����TEG��cיk��;K��|F�y�`e�Q_r����S���$6�4���פ(B� S��]Q�%���#�َ����/��q�)7L��÷#����9�QN�9���6�		��0|#�d��)���#
�L4;i8�� ش+�NWK�ݣ,�1�o�����W���l<38�¿�Λ c�>���s���X��VA���n��E��:�mo���@��ۡ/1R�q�6y �"��1C�ȿ�GՖ��� ���|��:���]c{���fVH�H�/���]��|�5P�ŷ��K����@��I�e#�&D�����Ϻ�{%�^ޏ��:����D̬LŤ�aC�%)�>q����w�W�@�$�_V�q�@p�U����&G�M�ԍԞj�fJ��)�Ҡ �>3<�°ntkJM>����f�<�f�G.�{�I7��`�q��!���f�*�r;�?5>��|F6,�-��Pb8��r� �]6Jp;a���ʹPP�Y1oꏟ�ut��dr!%�P�2�bo{9;M����ur���my���q+gw.S�_]����]������:�B���m�H2����`)D�h�f�_([80K�Xz�"�U�#�|�2B�i�=9�@XL�hP��3�Q1�y�������C}�޻��?���[��4F,�=�R2N+���r96�/;��D��*�V]!�:���շ��ǹ*��'��G��  ����	���ɫ�����E���� }Vpy'���~ti���}F���E3�����褽�&߅�&���eER�6~�����[�TL����=����8��E�ţ��J���8!��>��A6�rT\�y���
Y��U
�8}�:#K�YXB�p��Tּ�Ҙ��&�7��3Z��Q������r.����ru[
�J~h~=��5k�e�Kf�'^�p?��E��A�~i�G�ԲX.���Z�C�O�]ͼ����N~x���a��d�����/�Qp�o���܅�[U	p��H��� �\�3L�tl(�Nu�iz�P�Bu�O�!b8����h8?)�C�-�P{M���{W�b��ߏ}�FA��P
j����������@���$6��d�*W��Xd&���!��I|�׬�ʻ���J× i�=T�_��;~4S�m �h�ܩ�zUяp��2�z�c
oV��-�8���P��@�GH�c?T_{�VF~U���C�qH��^�O�Z��3�H���4!T-��SUT�t��W{΁����=�.�ps������;�9-��lrG�,!����X$r��B���T�a�݇�CP?+h9W2��&�~�m�?�xx��<��Q� ����#��<��>1��:*��]A�B��cOz��l ���vA���(�[�#�s�?�5����x�.��N!V.�0J��i�Rh�^���Of��2�Vn�*���m�`��QS~TI���9��ݙ�\�@9D��s�����h>���b�1��f���ܩ���ܶ3��SўOo�ـ�d����(m�wB��3T:j�o:��4n��C�U�n�ʅ����wiU9�]���c�.����V�.�����ψn��~�:
�ޝ�	�@�q��Qu�6�4��@,b�0�zy5r�>6�e�=�[���l��b��RzFnyU���x�Q};�Ò�D�S������N�g?��?�uuε���	�"b�{�YZ$����s.�v�t�/��Yn߅��r`p۱$F�ht��?�/��nb=���A��wW-	=�f��a40�+���uS�(*C��O��T��9����к��fb���K%>�+�Q^��6n����Z�}��Vo�Bj�2���&��WAǲ;�L�þ�����ܭnK�"1-��ט8
�N2���	�i������;����h��j���3'RO�=A�d�qj֓M1TI(#��>�¡G��������۪�<�5��2�Vi�d �'�g��Nv�|�3��s�ǐ�������u�v"(��UzUQ_�.3��d\B��o��꬛��/�� %l�;����l=_ot��)4��y�^9E��BO�m Y}� /}r`����*�����R_p�΃[���S�tp�~�1L��~��q�Y��";���&�h%-�Si�-�T�=;�E�G|<7 �G�FG�K��N4cl��*p��5g�ww9�B(����&�^�o<�$�@�(�p�&��󤎦n�X��s�w���s����u�о��,�b����N�>� �]�!�B"����җ����zܔb�`�
.���g@�m�B/k�"ף}��v˫�W�X`���з�8��4P���g&Pƒ=]��O��j��ԉ䋎^ 7D�`�5��Xy�1A�̾j�OR��������Z��f����_!��[{��ز�[ k<��gD����ӿǅ�B��qg�&�
�o\��j�3��	�퓈��զ[	>XЗ���
�Y^��_�u
w�ȼ�<�J��(��ZU�TqPyۍѿ�)0�hp����BZ�I��p��W��,p������PӚ��|�.�+n�e��_�Bo�s��1+r!��[�b�2�`����[SP��a�dtH<��S\x��'��l�Y����xԇ!��r����W����D�r��n�χ*bb�Bn4�'hW;����6{�K�_hHN��*�?�21����K���r轩�38�� ����i�Dħ�~������S����a��\���Ī��2�1cQN�D�A�`�b��Z�0+�a)�T�#M�Ph�(I\�:`@�"n��stiEz��q���vR^ֆl=^�~I"=C���槑lLT�=�~�Ձ��#8�Q��������N8 ;�ΤɟԀZ/!���z}���棞�jˎ�e�t�§�%�@�m�����8tȫ�9&^������af���G(�k�\�7���^
����.�@ZkT�
��~�f����ɯ��(�TH�=�K�2JS��S&.8&ɑn�v[)�R��ǭ�~��w�P����ImʹWRF�Y춉ƪ���d3 73��cwf�C�d��-Lg��:�T��ր�]׹I�`�P3���3>��Q�`a���<L�����4-2�	Gw&�R3dA�(����ԅ���#{���c�/�J{��[�p_�#�:׻�Q��s3x$Gh|k+ch{ �隀���Q"�:���,c�հ8����v�͎t��j�pm	Dt��?TN�k��6V�	n��1Y��������B4<��/�n��M��G�m )~����L5�;��)��97�֬[��sJT�F�	��/�O�����8���2"�;ٿ��	m���1��T�DB*��w�}&XDp��MxǮ��K)�4�T�KP�*�E�6O��hƺr��S�|�!��kݸ��]s#}�B�#��>i��HҌ#2��*�iPk�����u�'�ǷK�bWd�+��@}�+��&j�(̜I,�(U9n;ƪ��ov^�aT�r���b�v=|��1DnY_�N�P�3;�~B�u`xHTZeS�Q�IN���V<�$96h�I�@xN�MJ���1��m���d+p 3�"ò�`.&�@u�N�Ѳ��H���e��*TyV���|O����N�D�.��g3����_Y��}�E/�\H���&��f�6�D�yTb����;e�����
��W��g~$��Es��e�3n�gF�z;�j<kC�ex@�և��ѐ��s�z�|m{7�)@sg&�}8�2f����Ű�ϸ���ߏ�@���%�V^�}�g���<�Ȓd�	[	?���|�B���ǿ�Lk�5�3�Ma�tKZ��*��O<]�Q5
N���j�U�l҈�/��ꮕ-Ŏ��"���b������S	�� �Fc9@�1�YL�~Y&��u>�����z��ѻ*f�-h��G��{����H��db$���F��  �A��d�T�_���`z�YM���(�ؓ`)]�*�=���ڙek9Oe�' �6C��P�܍��n(f�|�n^Z�_f=P�j��T5�[���c)����:w���CϰHI$ϡM�� #Oz,��lE{qA~�M�y`�;��5���U �+'��t�>x}���7�R�Pye/.�c�,gi8ƒS�U�Bx�?���m���'���31 M��;B P�&2�Fy����h1w�§����琀����|�m����<o�c3�A��ŝvSoT^�]�J�J]ǂ���Z 5,ݢn�?jP��Ѡ-I�p�$E�HU�c5~���ho|��b@�M��+��zg�e�I�DI�0^3�GѲ�u��x���3�w��z.��ٟ��\�02k�.Uv��2^sv�b���F�N��T�j�-ʃ��f�װ-:�R$b7�k�����]����W�-E`e�@13��y��   ��i��/�k�����P���n	s<{�ͶЄT.������Wg�n��?Fs�;.9T�o*��|��^�0��0��%��<�C��9o���=�y��2,YICG�30��� Z�5oS}�ʽ�-$	�Jk�� -��l/eX�w��I/Г�N���7R��;vG���g&hLl���7���h-��v��ٖ$Z��:���$�[��.3�H�`����H/t���~q��Q�Ǿ����[��&�v�H4��F"�cC��B��/ �����'P]Dky�|��s�����4k��u�	����E�d� �A��w��7{�nT�*�M�rHͽ�޹'�w��:�V���#��e�&��/�|.<Mwuy,mYo6?�c��ϓ�޴tda��]3�������K^|�Z����v��H 5�PP?� 	 p  F�nBN������|JB�lTD�S�͟/��
��墭��nq}5��d4��8�{M��=)�4Щ����Z�}As� �C��!s���=���*�ځC��o��)�`�UMT{�u���[Fa�0?7Ȏ��=��~}���O%S~��ͮ<�HJl�H�,5�Yjl�:�S���A'�����;/H�߸�=��'�Y��֝��m��D���nQSXc�3�@�xj�%euŒ��g$�
R��\uysd�Ԋ�h��{��!C?�}���0�������n����:�|��dR6g̭��U�I��C$#�Ӿz�2-\�a���� �  �A�5-Q2���3o6(�G+2C����t�Ѷ2xa��k��	"���/7=�_���5m[��%	L����_)����yGc�.J̉锅�W[���*������y��d�������҂%��
���* S%����+�ª�,���߹���c#��Y4�5��'�y"RA���'�A�M㕵���{[/���+��r�ج>Ĝ��YA}*_�y8� #"���	A'Ul??.�d�q�I�<��s��ը���zj JS�='J<��&K53����Fn�d�y|&)�Hu�0^�Pۆ�.n��Є�| �\��V|p��S~�B(��h�v�)��Ԣ,-N6�4Cd� y�����ybR#忙�`k�ү��P�'�C�uG�z�D�DT�{<C��Ň�&�x�����n���c�}�$�z�1����ٯ���թ�{P�mnd^Vh!9��E&��"�Exs�ʾٴg��P_�)A���.ƭ�.&�
��Z½���`�t���}�2p��x;�r����V�}��1��U��L�|
��|���,d<N��یG���;r!����>��ō�-|�dX\���Z�۞z�������
c���kP�ߖ�B�}��	�^H*�mG]3��ߴI���xwT������&����[sx��R"XmótQ�����G%���k�O~mB>ĞF톲g��$�-�����.�����$��;���c��E5���5��qs筴�C��"���n�'���5�Kv�!�5�F�a�[vl�8�'���&ك��ǧ��4K����y�]�uZ�]�&�faE��
;�c9t��s�Xf[+�K�lӾ9]l0�$v���j_G�E�@���Y��F�k��hG:���~7�V��2�T�1��8���?�|H���[N�Zi�B�D&��Gjͽ�>�cl��R$��EQ�_Ҡ&MG��_9;�)�ɥ_����r ��ES�V�@��N� 	o�i�RP��=SP���պ�bqقdV �i��H��s`(ʦ�ڃ��Jh�����w�A�@�Xq:�_��eAʛ!)�WE����kx��,�ꏾ���&�#�0�b�|ݸ9����k{Ҹ��V��TB�K�����
���.ݢ�2��--������F���%�,I�T���8(s��,��̡�n��[>�;fa��Ә����4nm���úX]��3k'z��*�@
�je�PYS��;\���y����=����s����e�	_j	�X���Ӯ����:M�z�*"}bv�kRfO��������=���oG�u���5
��j^�c_B��eR�du= d���=T4��T1��l���7g^��M~:i��JT摫k������?U.ѷ���ӷg��jY��zN:I���=��m= � �Im�l>ʗ;�SopI���I���n�K!5ߘIj:�y}���o_��)�:Q�Ya#�Mgj�3A7>1�㘡Q>�*��[sS�ؤ�h�+ 
�<l�{<Xm
),�E���$�jՉq@Κ멫u�J8���o
ӛ�˜&��u����w�:�����!Ӟ�#�y��ە��"�o
F,�5ǈ��p��\�v{$-�����|����ӌ�MT����*Rm����Kb�Ž�K���ӆ�
�xom�DIB.���?U˂`�PtQY���]�QU�sO�AӃ�)�����N�*��ό���{q'��$5�s�͒�y����AHOa����=ĩH=��|W	}���[�@�,���O�&�|�:�2"�~��R���0�J����SWܒ����������Bvt܄K5�mġ�����ޓE�����������_��%�;�����\�7!2��q���FUFIƯ�K����7O�x��}�L!�u̭�e]|bq�ő{��e�*�<%��1Ɲ���eZ�nM���=��쬢��rz� �g�� �$��T��|����մm\>Gx"��͎{�y?X�w3ҁ���C|� vKӫE�1�ٞ8���u\wɉ�ٜT5�4�t��6�.Tu�t3	�^��-q�����I|OJ��,�`p����z����-e�p\(<D���F0<�1�f�e�]f����;�n$�����=&�u��,Iye��X��`+���j�{�N�����eb����,k��[hi�%hD	�&_l���$"��0 4�f�j�P����2��ź�Z8Ț�����.���9���SZc:����JA��\�EX�<P�@Z�d��|�D#n�B.�wc�� �i1����,S��}��/�{rwc��4�����R|>���p:�K��,���5{�}�s-��A��E�`k���4��N�L�ͺ}�NC�E���*��kO�گp	�-�<�=��$��]"�o�t�!#��L
�m����V�G��?�/��:�ݾ˞�� �Ν�?u�؃T�\���݌n -b�)����w%r>�*�/kM޻��mWl���'Sq�M�#瘩���8�IgpR��T���e_:���8���ڃ�p��L���{!� �^0	�%�H~�j6~_��; �b��~�_����d�W]k��;]�DNuz�x�l��'M���RJ�L�ǰ�Q�&�K��ͤ�.�ݚ�l�n��qp<4t�	����\�G�<��r'C!7�P�������S�����-UY6���X�ν��� �2���+�}Jq�ISQ|����(	�	�8��D���� �|��WK�+��!A���O*������?�;�o��g���gXs�;,�J��qb/+k�t�u�]��һG��֦�>��1D�U�T, d'�y�AX�0~@�`x�mv��~f=o$C��] -�wb�,�y��'_Jپ&�]y������!�;�o�Y/ez�wk���~-�""���*���B�8#8?���rL��~���t,��Mea�zq�^�
�\��f�&%4"��M�ks;Ű �:���}'�s�苕��&LHhG$��W�5����Yr,�Fu�̠֦場nY��=�����o��}�@���J�.Ir?�X�x���RB��V5Տ�������yh��ۑw�}[C���U&�s�~�W�^���I�gж���B�,�FW֗�ð���$(�Ǿ�m1s�`P\F10O^�/^�Kb��|fى{ɔݝ�_Qfg��K�>2#76} ����RV=���d���1��q�ۢv4�ե=�D���g"{�}��o�6��Â+ .x#����D�/˷�����zA��е|���_�~�4�bB����W]��
^����"ɪv<��?��{�>��2��Z���ԱƄ�uΕﰧ�����sTE��A���&�59�^Z�bP�ن��Pg�Vy�g5�4E���%�eb�e�Q�|�����g����\uW|Jon��ʔv(M�  A�0d�dLg����K�	��r9J_��Bv���=%~W�ۺF�\|�p�����m},�����u��`��ޅ��?v��x��9��ܩS�yŞ�g̬g,�Ť�����]�^h�釒G�R�����g������
�lM�����?�0���K&Smλ����]J��t�|u������jϡ͔�,G*�I�3��"�L���*Y�*L%���u�2LO��vRDmf�W/�|�FmMZ!~3�� ���(�!�	pBT��62(�! �� �B �b%
&X䞶���IE�����9F�~Evn'r�����jik���Tll�u����M�k�X�1{�v�{����ֻ�7��i�O�q4(�Y.>��+Ws, +p	�l*��,���ث�@S���z��K$�*��p�GR�zT ՠt+�h�F�   ��Oi���Ӏd��\�D�aV_���۩� TN�����\��p�W!r��q�-�K��)4y^o�P��ґ�h$hU���ج4�MU�g��	o���`R�wj�z�!o[]���ĳ��W��Cg��,��E7�0�u~W7v�4�}��wP�n�q1�Y�&ֈT5q����S�{E�7���[�>��?���Я�   ��QnB����`��{n�kJ�:�T[���Gh�?�Aq����R�5%�g�����o%��X�>9l/K6�`"m=�mQP��_9�zv�-b:�ip-ۥ��!A��ͣ-�l�f���ޒ  	JA�V5-�2�� J�$�bî�Dh�<�h$�|�1�$?���@ ƨ���h���K��=����q���%Z����x��E�Y�bQ�ng��@|K�.����R���̓��~�ؐ��i=�[g��8aZ^����X	!��Xk�pcHC��{y��Ts� ��Ds�q����취F�'C�{���ļ���$1x7�P�[��L�S�A5Bg#9��v�o<�Vc�
|+��_�4���a�,}W�f#��M@��Ԁ��\�Lx��-�� ��^���.�8��k�����'�o�m򸐊��c��|�!M�<���V�8'G��������٥���J�\��B7p�{N	�P���4ͅ�Q����Q��]y���x],	n�4�O�l�d�YW�T	�f��埭
�׎���aG��zD^�*ݛIndex, nextOptionStringIndex;

  while (startIndex <= maxOptionStringIndex) {
    // consume any Positionals preceding the next option
    nextOptionStringIndex = null;
    for (position in optionStringIndices) {
      if (!optionStringIndices.hasOwnProperty(position)) { continue; }

      position = parseInt(position, 10);
      if (position >= startIndex) {
        if (nextOptionStringIndex !== null) {
          nextOptionStringIndex = Math.min(nextOptionStringIndex, position);
        } else {
          nextOptionStringIndex = position;
        }
      }
    }

    if (startIndex !== nextOptionStringIndex) {
      positionalsEndIndex = consumePositionals(startIndex);
      // only try to parse the next optional if we didn't consume
      // the option string during the positionals parsing
      if (positionalsEndIndex > startIndex) {
        startIndex = positionalsEndIndex;
        continue;
      } else {
        startIndex = positionalsEndIndex;
      }
    }

    // if we consumed all the positionals we could and we're not
    // at the index of an option string, there were extra arguments
    if (!optionStringIndices[startIndex]) {
      var strings = argStrings.slice(startIndex, nextOptionStringIndex);
      extras = extras.concat(strings);
      startIndex = nextOptionStringIndex;
    }
    // consume the next optional and any arguments for it
    startIndex = consumeOptional(startIndex);
  }

  // consume any positionals following the last Optional
  var stopIndex = consumePositionals(startIndex);

  // if we didn't consume all the argument strings, there were extras
  extras = extras.concat(argStrings.slice(stopIndex));

  // if we didn't use all the Positional objects, there were too few
  // arg strings supplied.
  if (positionals.length > 0) {
    self.error('too few arguments');
  }

  // make sure all required actions were present
  self._actions.forEach(function (action) {
    if (action.required) {
      if (seenActions.indexOf(action) < 0) {
        self.error(format('Argument "%s" is required', action.getName()));
      }
    }
  });

  // make sure all required groups have one option present
  var actionUsed = false;
  self._mutuallyExclusiveGroups.forEach(function (group) {
    if (group.required) {
      actionUsed = group._groupActions.some(function (action) {
        return seenNonDefaultActions.indexOf(action) !== -1;
      });

      // if no actions were used, report the error
      if (!actionUsed) {
        var names = [];
        group._groupActions.forEach(function (action) {
          if (action.help !== c.SUPPRESS) {
            names.push(action.getName());
          }
        });
        names = names.join(' ');
        var msg = 'one of the arguments ' + names + ' is required';
        self.error(msg);
      }
    }
  });

  // return the updated namespace and the extra arguments
  return [ namespace, extras ];
};

ArgumentParser.prototype._readArgsFromFiles = function (argStrings) {
  // expand arguments referencing files
  var self = this;
  var fs = require('fs');
  var newArgStrings = [];
  argStrings.forEach(function (argString) {
    if (self.fromfilePrefixChars.indexOf(argString[0]) < 0) {
      // for regular arguments, just add them back into the list
      newArgStrings.push(argString);
    } else {
      // replace arguments referencing files with the file content
      try {
        var argstrs = [];
        var filename = argString.slice(1);
        var content = fs.readFileSync(filename, 'utf8');
        content = content.trim().split('\n');
        content.forEach(function (argLine) {
          self.convertArgLineToArgs(argLine).forEach(function (arg) {
            argstrs.push(arg);
          });
          argstrs = self._readArgsFromFiles(argstrs);
        });
        newArgStrings.push.apply(newArgStrings, argstrs);
      } catch (error) {
        return self.error(error.message);
      }
    }
  });
  return newArgStrings;
};

ArgumentParser.prototype.convertArgLineToArgs = function (argLine) {
  return [ argLine ];
};

ArgumentParser.prototype._matchArgument = function (action, regexpArgStrings) {

  // match the pattern for this action to the arg strings
  var regexpNargs = new RegExp('^' + this._getNargsPattern(action));
  var matches = regexpArgStrings.match(regexpNargs);
  var message;

  // throw an exception if we weren't able to find a match
  if (!matches) {
    switch (action.nargs) {
      /*eslint-disable no-undefined*/
      case undefined:
      case null:
        message = 'Expected one argument.';
        break;
      case c.OPTIONAL:
        message = 'Expected at most one argument.';
        break;
      case c.ONE_OR_MORE:
        message = 'Expected at least one argument.';
        break;
      default:
        message = 'Expected %s argument(s)';
    }

    throw argumentErrorHelper(
      action,
      format(message, action.nargs)
    );
  }
  // return the number of arguments matched
  return matches[1].length;
};

ArgumentParser.prototype._matchArgumentsPartial = function (actions, regexpArgStrings) {
  // progressively shorten the actions list by slicing off the
  // final actions until we find a match
  var self = this;
  var result = [];
  var actionSlice, pattern, matches;
  var i, j;

  function getLength(string) {
    return string.length;
  }

  for (i = actions.length; i > 0; i--) {
    pattern = '';
    actionSlice = actions.slice(0, i);
    for (j = 0; j < actionSlice.length; j++) {
      pattern += self._getNargsPattern(actionSlice[j]);
    }

    pattern = new RegExp('^' + pattern);
    matches = regexpArgStrings.match(pattern);

    if (matches && matches.length > 0) {
      // need only groups
      matches = matches.splice(1);
      result = result.concat(matches.map(getLength));
      break;
    }
  }

  // return the list of arg string counts
  return result;
};

ArgumentParser.prototype._parseOptional = function (argString) {
  var action, optionString, argExplicit, optionTuples;

  // if it's an empty string, it was meant to be a positional
  if (!argString) {
    return null;
  }

  // if it doesn't start with a prefix, it was meant to be positional
  if (this.prefixChars.indexOf(argString[0]) < 0) {
    return null;
  }

  // if the option string is present in the parser, return the action
  if (this._optionStringActions[argString]) {
    return [ this._optionStringActions[argString], argString, null ];
  }

  // if it's just a single character, it was meant to be positional
  if (argString.length === 1) {
    return null;
  }

  // if the option string before the "=" is present, return the action
  if (argString.indexOf('=') >= 0) {
    optionString = argString.split('=', 1)[0];
    argExplicit = argString.slice(optionString.length + 1);

    if (this._optionStringActions[optionString]) {
      action = this._optionStringActions[optionString];
      return [ action, optionString, argExplicit ];
    }
  }

  // search through all possible prefixes of the option string
  // and all actions in the parser for possible interpretations
  optionTuples = this._getOptionTuples(argString);

  // if multiple actions match, the option string was ambiguous
  if (optionTuples.length > 1) {
    var optionStrings = optionTuples.map(function (optionTuple) {
      return optionTuple[1];
    });
    this.error(format(
          'Ambiguous option: "%s" could match %s.',
          argString, optionStrings.join(', ')
    ));
  // if exactly one action matched, this segmentation is good,
  // so return the parsed action
  } else if (optionTuples.length === 1) {
    return optionTuples[0];
  }

  // if it was not found as an option, but it looks like a negative
  // number, it was meant to be positional
  // unless there are negative-number-like options
  if (argString.match(this._regexpNegativeNumber)) {
    if (!this._hasNegativeNumberOptionals.some(Boolean)) {
      return null;
    }
  }
  // if it contains a space, it was meant to be a positional
  if (argString.search(' ') >= 0) {
    return null;
  }

  // it was meant to be an optional but there is no such option
  // in this parser (though it might be a valid option in a subparser)
  return [ null, argString, null ];
};

ArgumentParser.prototype._getOptionTuples = function (optionString) {
  var result = [];
  var chars = this.prefixChars;
  var optionPrefix;
  var argExplicit;
  var action;
  var actionOptionString;

  // option strings starting with two prefix characters are only split at
  // the '='
  if (chars.indexOf(optionString[0]) >= 0 && chars.indexOf(optionString[1]) >= 0) {
    if (optionString.indexOf('=') >= 0) {
      var optionStringSplit = optionString.split('=', 1);

      optionPrefix = optionStringSplit[0];
      argExplicit = optionStringSplit[1];
    } else {
      optionPrefix = optionString;
      argExplicit = null;
    }

    for (actionOptionString in this._optionStringActions) {
      if (actionOptionString.substr(0, optionPrefix.length) === optionPrefix) {
        action = this._optionStringActions[actionOptionString];
        result.push([ action, actionOptionString, argExplicit ]);
      }
    }

  // single character options can be concatenated with their arguments
  // but multiple character options always have to have their argument
  // separate
  } else if (chars.indexOf(optionString[0]) >= 0 && chars.indexOf(optionString[1]) < 0) {
    optionPrefix = optionString;
    argExplicit = null;
    var optionPrefixShort = optionString.substr(0, 2);
    var argExplicitShort = optionString.substr(2);

    for (actionOptionString in this._optionStringActions) {
      if (!$$.has(this._optionStringActions, actionOptionString)) continue;

      action = this._optionStringActions[actionOptionString];
      if (actionOptionString === optionPrefixShort) {
        result.push([ action, actionOptionString, argExplicitShort ]);
      } else if (actionOptionString.substr(0, optionPrefix.length) === optionPrefix) {
        result.push([ action, actionOptionString, argExplicit ]);
      }
    }

  // shouldn't ever get here
  } else {
    throw new Error(format('Unexpected option string: %s.', optionString));
  }
  // return the collected option tuples
  return result;
};

ArgumentParser.prototype._getNargsPattern = function (action) {
  // in all examples below, we have to allow for '--' args
  // which are represented as '-' in the pattern
  var regexpNargs;

  switch (action.nargs) {
    // the default (null) is assumed to be a single argument
    case undefined:
    case null:
      regexpNargs = '(-*A-*)';
      break;
    // allow zero or more arguments
    case c.OPTIONAL:
      regexpNargs = '(-*A?-*)';
      break;
    // allow zero or more arguments
    case c.ZERO_OR_MORE:
      regexpNargs = '(-*[A-]*)';
      break;
    // allow one or more arguments
    case c.ONE_OR_MORE:
      regexpNargs = '(-*A[A-]*)';
      break;
    // allow any number of options or arguments
    case c.REMAINDER:
      regexpNargs = '([-AO]*)';
      break;
    // allow one argument followed by any number of options or arguments
    case c.PARSER:
      regexpNargs = '(-*A[-AO]*)';
      break;
    // all others should be integers
    default:
      regexpNargs = '(-*' + $$.repeat('-*A', action.nargs) + '-*)';
  }

  // if this is an optional action, -- is not allowed
  if (action.isOptional()) {
    regexpNargs = regexpNargs.replace(/-\*/g, '');
    regexpNargs = regexpNargs.replace(/-/g, '');
  }

  // return the pattern
  return regexpNargs;
};

//
// Value conversion methods
//

ArgumentParser.prototype._getValues = function (action, argStrings) {
  var self = this;

  // for everything but PARSER args, strip out '--'
  if (action.nargs !== c.PARSER && action.nargs !== c.REMAINDER) {
    argStrings = argStrings.filter(function (arrayElement) {
      return arrayElement !== '--';
    });
  }

  var value, argString;

  // optional argument produces a default when not present
  if (argStrings.length === 0 && action.nargs === c.OPTIONAL) {

    value = (action.isOptional()) ? action.constant : action.defaultValue;

    if (typeof (value) === 'string') {
      value = this._getValue(action, value);
      this._checkValue(action, value);
    }

  // when nargs='*' on a positional, if there were no command-line
  // args, use the default if it is anything other than None
  } else if (argStrings.length === 0 && action.nargs === c.ZERO_OR_MORE &&
    action.optionStrings.length === 0) {

    value = (action.defaultValue || argStrings);
    this._checkValue(action, value);

  // single argument or optional argument produces a single value
  } else if (argStrings.length === 1 &&
        (!action.nargs || action.nargs === c.OPTIONAL)) {

    argString = argStrings[0];
    value = this._getValue(action, argString);
    this._checkValue(action, value);

  // REMAINDER arguments convert all values, checking none
  } else if (action.nargs === c.REMAINDER) {
    value = argStrings.map(function (v) {
      return self._getValue(action, v);
    });

  // PARSER arguments convert all values, but check only the first
  } else if (action.nargs === c.PARSER) {
    value = argStrings.map(function (v) {
      return self._getValue(action, v);
    });
    this._checkValue(action, value[0]);

  // all other types of nargs produce a list
  } else {
    value = argStrings.map(function (v) {
      return self._getValue(action, v);
    });
    value.forEach(function (v) {
      self._checkValue(action, v);
    });
  }

  // return the converted value
  return value;
};

ArgumentParser.prototype._getValue = function (action, argString) {
  var result;

  var typeFunction = this._registryGet('type', action.type, action.type);
  if (typeof typeFunction !== 'function') {
    var message = format('%s is not callable', typeFunction);
    throw argumentErrorHelper(action, message);
  }

  // convert the value to the appropriate type
  try {
    result = typeFunction(argString);

    // ArgumentTypeErrors indicate errors
    // If action.type is not a registered string, it is a function
    // Try to deduce its name for inclusion in the error message
    // Failing that, include the error message it raised.
  } catch (e) {
    var name = null;
    if (typeof action.type === 'string') {
      name = action.type;
    } else {
      name = action.type.name || action.type.displayName || '<function>';
    }
    var msg = format('Invalid %s value: %s', name, argString);
    if (name === '<function>') { msg += '\n' + e.message; }
    throw argumentErrorHelper(action, msg);
  }
  // return the converted value
  return result;
};

ArgumentParser.prototype._checkValue = function (action, value) {
  // converted value must be one of the choices (if specified)
  var choices = action.choices;
  if (choices) {
    // choise for argument can by array or string
    if ((typeof choices === 'string' || Array.isArray(choices)) &&
        choices.indexOf(value) !== -1) {
      return;
    }
    // choise for subparsers can by only hash
    if (typeof choices === 'object' && !Array.isArray(choices) && choices[value]) {
      return;
    }

    if (typeof choices === 'string') {
      choices = choices.split('').join(', ');
    } else if (Array.isArray(choices)) {
      choices =  choices.join(', ');
    } else {
      choices =  Object.keys(choices).join(', ');
    }
    var message = format('Invalid choice: %s (choose from [%s])', value, choices);
    throw argumentErrorHelper(action, message);
  }
};

//
// Help formatting methods
//

/**
 * ArgumentParser#formatUsage -> string
 *
 * Return usage string
 *
 * See also [original guide][1]
 *
 * [1]:http://docs.python.org/dev/library/argparse.html#printing-help
 **/
ArgumentParser.prototype.formatUsage = function () {
  var formatter = this._getFormatter();
  formatter.addUsage(this.usage, this._actions, this._mutuallyExclusiveGroups);
  return formatter.formatHelp();
};

/**
 * ArgumentParser#formatHelp -> string
 *
 * Return help
 *
 * See also [original guide][1]
 *
 * [1]:http://docs.python.org/dev/library/argparse.html#printing-help
 **/
ArgumentParser.prototype.formatHelp = function () {
  var formatter = this._getFormatter();

  // usage
  formatter.addUsage(this.usage, this._actions, this._mutuallyExclusiveGroups);

  // description
  formatter.addText(this.description);

  // positionals, optionals and user-defined groups{
  "Type selectors": {
    "syntax": "element",
    "groups": [
      "Basic Selectors",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/Type_selectors"
  },
  "Class selectors": {
    "syntax": ".class",
    "groups": [
      "Basic Selectors",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/Class_selectors"
  },
  "ID selectors": {
    "syntax": "#id",
    "groups": [
      "Basic Selectors",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/ID_selectors"
  },
  "Universal selectors": {
    "syntax": "*",
    "groups": [
      "Basic Selectors",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/Universal_selectors"
  },
  "Attribute selectors": {
    "syntax": "[attr=value]",
    "groups": [
      "Basic Selectors",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/Attribute_selectors"
  },
  "Adjacent sibling combinator": {
    "syntax": "A + B",
    "groups": [
      "Combinators",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/Adjacent_sibling_combinator"
  },
  "General sibling combinator": {
    "syntax": "A ~ B",
    "groups": [
      "Combinators",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/General_sibling_combinator"
  },
  "Child combinator": {
    "syntax": "A > B",
    "groups": [
      "Combinators",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/Child_combinator"
  },
  "Descendant combinator": {
    "syntax": "A B",
    "groups": [
      "Combinators",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/Descendant_combinator"
  },
  "Column combinator": {
    "syntax": "A || B",
    "groups": [
      "Combinators",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/Column_combinator"
  },
  ":active": {
    "syntax": ":active",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:active"
  },
  ":any-link": {
    "syntax": ":any-link",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:any-link"
  },
  ":checked": {
    "syntax": ":checked",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:checked"
  },
  ":blank": {
    "syntax": ":blank",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:blank"
  },
  ":default": {
    "syntax": ":default",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:default"
  },
  ":defined": {
    "syntax": ":defined",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:defined"
  },
  ":dir": {
    "syntax": ":dir( ltr | rtl )",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:dir"
  },
  ":disabled": {
    "syntax": ":disabled",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:disabled"
  },
  ":empty": {
    "syntax": ":empty",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:empty"
  },
  ":enabled": {
    "syntax": ":enabled",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:enabled"
  },
  ":first": {
    "syntax": ":first",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:first"
  },
  ":first-child": {
    "syntax": ":first-child",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:first-child"
  },
  ":first-of-type": {
    "syntax": ":first-of-type",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:first-of-type"
  },
  ":fullscreen": {
    "syntax": ":fullscreen",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:fullscreen"
  },
  ":focus": {
    "syntax": ":focus",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:focus"
  },
  ":focus-visible": {
    "syntax": ":focus-visible",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:focus-visible"
  },
  ":focus-within": {
    "syntax": ":focus-within",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:focus-within"
  },
  ":has": {
    "syntax": ":has( <relative-selector-list> )",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:has"
  },
  ":host()": {
    "syntax": ":host( <compound-selector-list> )",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:host()"
  },
  ":host-context()": {
    "syntax": ":host-context( <compound-selector-list> )",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:host-context()"
  },
  ":hover": {
    "syntax": ":hover",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:hover"
  },
  ":indeterminate": {
    "syntax": ":indeterminate",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:indeterminate"
  },
  ":in-range": {
    "syntax": ":in-range",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:in-range"
  },
  ":invalid": {
    "syntax": ":invalid",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:invalid"
  },
  ":is": {
    "syntax": ":is( <complex-selector-list> )",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:is"
  },
  ":lang": {
    "syntax": ":lang( <language-code> )",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:lang"
  },
  ":last-child": {
    "syntax": ":last-child",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:last-child"
  },
  ":last-of-type": {
    "syntax": ":last-of-type",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:last-of-type"
  },
  ":left": {
    "syntax": ":left",
    "groups": [
      "Pseudo-classes",
      "Selectors",
      "CSS Pages"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:left"
  },
  ":link": {
    "syntax": ":link",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:link"
  },
  ":not": {
    "syntax": ":not( <complex-selector-list> )",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:not"
  },
  ":nth-child": {
    "syntax": ":nth-child( <nth> [ of <complex-selector-list> ]? )",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:nth-child"
  },
  ":nth-last-child": {
    "syntax": ":nth-last-child( <nth> [ of <complex-selector-list> ]? )",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:nth-last-child"
  },
  ":nth-last-of-type": {
    "syntax": ":nth-last-of-type( <nth> )",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:nth-last-of-type"
  },
  ":nth-of-type": {
    "syntax": ":nth-of-type( <nth> )",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:nth-of-type"
  },
  ":only-child": {
    "syntax": ":only-child",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:only-child"
  },
  ":only-of-type": {
    "syntax": ":only-of-type",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:only-of-type"
  },
  ":optional": {
    "syntax": ":optional",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:optional"
  },
  ":out-of-range": {
    "syntax": ":out-of-range",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:out-of-range"
  },
  ":placeholder-shown": {
    "syntax": ":placeholder-shown",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:placeholder-shown"
  },
  ":read-only": {
    "syntax": ":read-only",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:read-only"
  },
  ":read-write": {
    "syntax": ":read-write",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:read-write"
  },
  ":required": {
    "syntax": ":required",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:required"
  },
  ":right": {
    "syntax": ":right",
    "groups": [
      "Pseudo-classes",
      "Selectors",
      "CSS Pages"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:right"
  },
  ":root": {
    "syntax": ":root",
    "groups": [
      "Pseudo-classes",
      "Selectors",
      "CSS Pages"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:root"
  },
  ":scope": {
    "syntax": ":scope",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:scope"
  },
  ":target": {
    "syntax": ":target",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:target"
  },
  ":valid": {
    "syntax": ":valid",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:valid"
  },
  ":visited": {
    "syntax": ":visited",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:visited"
  },
  ":where": {
    "syntax": ":where( <complex-selector-list> )",
    "groups": [
      "Pseudo-classes",
      "Selectors"
    ],
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/:where"
  },
  "::-moz-progress-bar": {
    "syntax": "::-moz-progress-bar",
    "groups": [
      "Pseudo-elements",
      "Selectors",
      "Mozilla Extensions"
    ],
    "status": "nonstandard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/::-moz-progress-bar"
  },
  "::-moz-range-progress": {
    "syntax": "::-moz-range-progress",
    "groups": [
      "Pseudo-elements",
      "Selectors",
      "Mozilla Extensions"
    ],
    "status": "nonstandard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/::-moz-range-progress"
  },
  "::-moz-range-thumb": {
    "syntax": "::-moz-range-thumb",
    "groups": [
      "Pseudo-elements",
      "Selectors",
      "Mozilla Extensions"
    ],
    "status": "nonstandard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/::-moz-range-thumb"
  },
  "::-moz-range-track": {
    "syntax": "::-moz-range-track",
    "groups": [
      "Pseudo-elements",
      "Selectors",
      "Mozilla Extensions"
    ],
    "status": "nonstandard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/::-moz-range-track"
  },
  "::-ms-browse": {
    "syntax": "::-ms-browse",
    "groups": [
      "Pseudo-elements",
      "Selectors",
      "Microsoft Extensions"
    ],
    "status": "nonstandard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/::-ms-browse"
  },
  "::-ms-check": {
    "syntax": "::-ms-check",
    "groups": [
      "Pseudo-elements",
      "Selectors",
      "Microsoft Extensions"
    ],
    "status": "nonstandard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/::-ms-check"
  },
  "::-ms-clear": {
    "syntax": "::-ms-clear",
    "groups": [
      "Pseudo-elements",
      "Selectors",
      "Microsoft Extensions"
    ],
    "status": "nonstandard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/::-ms-clear"
  },
  "::-ms-expand": {
    "syntax": "::-ms-clear",
    "groups": [
      "Pseudo-elements",
      "Selectors",
      "Microsoft Extensions"
    ],
    "status": "nonstandard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/::-ms-expand"
  },
  "::-ms-fill": {
    "syntax": "::-ms-fill",
    "groups": [
      "Pseudo-elements",
      "Selectors",
      "Microsoft Extensions"
    ],
    "status": "nonstandard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/::-ms-fill"
  },
  "::-ms-fill-lower": {
    "syntax": "::-ms-fill-lower",
    "groups": [
      "Pseudo-elements",
      "Selectors",
      "Microsoft Extensions"
    ],
    "status": "nonstandard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/::-ms-fill-lower"
  },
  "::-ms-fill-upper": {
    "syntax": "::-ms-fill-upper",
    "groups": [
      "Pseudo-elements",
      "Selectors",
      "Microsoft Extensions"
    ],
    "status": "nonstandard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/::-ms-fill-upper"
  },
  "::-ms-reveal": {
    "syntax": "::-ms-reveal",
    "groups": [
      "Pseudo-elements",
      "Selectors",
      "Microsoft Extensions"
    ],
    "status": "nonstandard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/::-ms-reveal"
  },
  "::-ms-thumb": {
    "syntax": "::-ms-thumb",
    "groups": [
      "Pseudo-elements",
      "Selectors",
      "Micro/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { NewPlugin } from '../types';
export declare const test: NewPlugin['test'];
export declare const serialize: NewPlugin['serialize'];
declare const plugin: NewPlugin;
export default plugin;
                                                                                                     ?A���-�v��۩�@>�*0%���¨������)�G�ѢU�/k4l]u6*�Bn��8��ϥ���$ǰ�h2��nØ����W;�Ϙ`��H��7����HqA�U��?#�9v'3�3��f�hcS��;��7_?@�ĝhd�ͩ���>J�L�����_+:'@Zj8�t�.�(E[��	�w��Yi�����rH�d�c��(��Ǣ��I$�_�_���T��Q^'���a�+��u���td�׶$}Ψ �2�"�=!A[�����.)P{�C�C*>7 ���,��n�6��YYSD�z��g��g�p��/���y��G�T�����������U��v)�w`j�� m��P�2L�F%�X�	(��g.l��p��K\/�N)�5��
����gP�N�'I��j��C����R%�����	m"!�UY��a�]�W	���knN����J��$M�?h����@G�u�aw��A_$�WD��|���w��͕�k���q���'��z{]��-��P�0t5K(Rn\[HFX��R�Z	z~
��y1q�-��K��av����ş���8�Út�|<Z&�P}(Ka�ئ[��(Z�Ȥk;�$#�=��q���YQ��Gw���T�?>EPَ�\���Y!��+�a�稕��Qy�'�����#��7��9,�2�M��/�����N}��O�G#�u�T5�V_uz�>�F]ML���������!/�"yFL���Q	@�M�Q��{��DPu���5dF\���u��0य़d�Č߫�E���Hfa��@H�pK�D�s����qp�"QFۮ���
Y< G>@~eK�{p�h}f�̻i���oVL9G��4C���=Ek3�	?�	�Ck�C�VZd%n�*{dn�~Yt��;mԿ��������}r�g=�.�Z�U҄�^dBz�:h��sr8��4,?9�eJ�^(��?`�; %Cck+I��S�t&���O�L�u�bF��ϣZ���~i��w�[~x�%5�S����0eR��v���t�:w�O_[�GNq�P�@&l�V�淊�$Έ�μ���ƚe,�]���\�B,aŵ���h́�?����5�7�xs�8be:���p\X���}9�&c��4�f�Yͥ��e���
���Z��7��u��s��v7�~x	���J�H�>��i�WCSͲɧc-ͩ-ZL)\�w��9{)���ѷ,dP����𢡄Xͯ�׽v��򴜃���L�f	��Ԍ3&��S�CrB��@�����: �B���&=�$�2I@�~A�fl�6q5�Y�|F�Ui��x�O.z�׽N���6W�i��x����P�x�1�����sgQ�!�4ς�����_���td�#�Z!7~$�{6G~����֥v(���e��Q<��2l3o-	Z6�ݽ�S�¸�����s���B���+���F|��Y�W%��3fP�A蘮`�˩��� �[M*C���-8�o!V���;�pV��,���dGܽ�P���0֜���tK-���L*��Qs��n��²jC�U��F�"�Wgk}D$�]�p�>��4P�U�/��Ѕ�2���F-��|�<&0Z�6g�LS����;��𿿉\�A����@�T<l�8Z1�� ps��N���{�����`e���兂�w;�5��T�@�(����b^���#tR}5��'M�4��&3�:H�����2@%��5럻��:�&�@L�
���	,"��4(۱�)u}��e��xA3����<{!"b�SN�"�$�k�
��PXhf��SƢ�(A���,J��~�Zºb�
25��c���F"^���^u��M��@���K`8�B���nݐN~Y��WL.��}����D��|�*`u�W��e�����:մc��.a	�ȍ�]����6��>"U)��'u���TL�'�wi��#�-Կb,�'�RS�\ſ�;�R�b�қ��,-���#����Tҿ���{/���Gִ�K���}m�E���mK�v#�4O5��ߤ�s��w7�)v&�9Zjb+�+���`K�ڶ��ʲ�w"��R x%9�_��tB:Ad���ι��p���m�"�dZ�Y��i���o��>�}0�)���/d�J>zO}������ -	��;㬎�q�?�$�<�h(��˥���ɹ��� �~����;�~9j ��-�"�l�|Gj�RT04���S>�O�w�ۺ)����1Z߾�M}��N��������	{�<�� �Zm��������x��Jٮ1
�6ݶ��$�y좺�D���їK#Eܲ}y�A"5���gLP^�|�����R�RN|	RS2��BI��D�5�G��52�Zzs�7�I�'3�+�k�e�x��y݌�Ǵ���rη_�dW�4�[�COW#�6  ~Uj?^�*��m`�{9�N�܉\���#sv�5>�g�y�i!&,ȸ�	�6u�[����`��O��p��(&��Ѻ:Ծa>��t����b)>[��?�7]J_0�����(	z�B�|�B9i�X��� e�X+�=��m�p/�v�C�'(i~hm���}�"V�-�!���c ��-"URE.Oa�f����M˟7\���D�C���9)��LR�Y߽�_�o483j�|r�Grb�o�v��8�}d&Gx�5��ǡRkwN��5� Q��ы�����.@xB�n~;ɫ��l/����'ƪ��`P;�x4Q#�'M�X��a�>y6�ڳ��ú��}���G^�u͊�R���6+��0QM��#�KÏ���׳9K0�\�����2p�!�X���8V�؃S����6��:����k����,�����Qaʈ��Z��?([:��z���bj�J!��.���a��XF�����)Q{t�[<t����	�i�ݶ�;W�b��.���G)�[+�A��y Z���,�����=d�\����'Or�HA�Kљ���i�2F�B���٥�Ӷv�c�n�q+�V�h��͝АS��<8݆G|�})�ףc9���ۋ�/d������\�R�F�
^���;���stę���7����s�<�čҊ�O���D�-2+T:ˢϏ��ǜ\i�Գ�w|�>��y`~�<�XpE%^����k�]�+��h�1�V���df=Z�e��;a@�6�R�N���P�9']���J�p" ��3�ݼ���騆�����,����c�O�$�h��ba����7m<=0���XD+S*��/{�y����g��L��O��3n"��� 2�
��'����"ӻ�W�p��j�@7j��'V-͆��4�:�K#>Vv>yo�wl盀B�υų����ǜ�
fN]�ώ_é,v�h@�a!g�:��L����D���I+��A�QWjm����4{�a^cx����>��o����|F���=~��T,EKq�7�
>ɢ��on<2�'�p�!��鮣�+&HH^����rDv��?�Z������O?)��~*���릵f�6����K�r�q�3*_W�5�7��3��gr�/��4����ਕ�h�+��,����_��h��BN�p��w�1S�i��6�}�_4�T�9$2n��AJ6ђ	���Qۚ �2!3������j��+{HR�D�[^'�aD��TZg�"]�S0���N�!������	���2�>�,l�u���[b/9���6�p)�h�甴�~��]�s�Lh�e��9��o�b�K*�u;.EAM̈́AoOw[�1�R#��u�#����� ��g��kȡm �=����FgV��J�������[�˽W�y\N��/s��$?�~� ��GG�s�+�g��b�����(�+��V���h��<��Wşt1vQ�J���|>} �
�`-���L��Q�ԭ��!��5Vp��rG���h�w�q0�Eԡѩ PZQ�{8�D����kP�O�R�2�L�s'*���A)�f��lw��TKsj�R����F՟i*���~=�����A�q��Gy�{������Gf��d�s�q�tJ�b:xD�S�����4=������ҷ-m6���O��@wD�<%=t��&:��-ě,�ѽ�ƺ,��
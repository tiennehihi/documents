*full explanation**

Every library reflects a set of opinions and priorities in the
trade-offs it makes. Other than this library, I can personally
recommend both [globby](http://npm.im/globby) and
[fast-glob](http://npm.im/fast-glob), though they differ in their
benefits and drawbacks.

Both have very nice APIs and are reasonably fast.

`fast-glob` is, as far as I am aware, the fastest glob
implementation in JavaScript today. However, there are many
cases where the choices that `fast-glob` makes in pursuit of
speed mean that its results differ from the results returned by
Bash and other sh-like shells, which may be surprising.

In my testing, `fast-glob` is around 10-20% faster than this
module when walking over 200k files nested 4 directories
deep[1](#fn-webscale). However, there are some inconsistencies
with Bash matching behavior that this module does not suffer
from:

- `**` only matches files, not directories
- `..` path portions are not handled unless they appear at the
  start of the pattern
- `./!(<pattern>)` will not match any files that _start_ with
  `<pattern>`, even if they do not match `<pattern>`. For
  example, `!(9).txt` will not match `9999.txt`.
- Some brace patterns in the middle of a pattern will result in
  failing to find certain matches.
- Extglob patterns are allowed to contain `/` characters.

Globby exhibits all of the same pattern semantics as fast-glob,
(as it is a wrapper around fast-glob) and is slightly slower than
node-glob (by about 10-20% in the benchmark test set, or in other
words, anywhere from 20-50% slower than fast-glob). However, it
adds some API conveniences that may be worth the costs.

- Support for `.gitignore` and other ignore files.
- Support for negated globs (ie, patterns starting with `!`
  rather than using a separate `ignore` option).

The priority of this module is "correctness" in the sense of
performing a glob pattern expansion as faithfully as possible to
the behavior of Bash and other sh-like shells, with as much speed
as possible.

Note that prior versions of `node-glob` are _not_ on this list.
Former versions of this module are far too slow for any cases
where performance matters at all, and were designed with APIs
that are extremely dated by current JavaScript standards.

---

<small id="fn-webscale">[1]: In the cases where this module
returns results and `fast-glob` doesn't, it's even faster, of
course.</small>

![lumpy space princess saying 'oh my GLOB'](https://github.com/isaacs/node-glob/raw/main/oh-my-glob.gif)

### Benchmark Results

First number is time, smaller is better.

Second number is the count of results returned.

```
--- pattern: '**' ---
~~ sync ~~
node fast-glob sync             0m0.598s  200364
node globby sync                0m0.765s  200364
node current globSync mjs       0m0.683s  222656
node current glob syncStream    0m0.649s  222656
~~ async ~~
node fast-glob async            0m0.350s  200364
node globby async               0m0.509s  200364
node current glob async mjs     0m0.463s  222656
node current glob stream        0m0.411s  222656

--- pattern: '**/..' ---
~~ sync ~~
node fast-glob sync             0m0.486s  0
node globby sync                0m0.769s  200364
node current globSync mjs       0m0.564s  2242
node current glob syncStream    0m0.583s  2242
~~ async ~~
node fast-glob async            0m0.283s  0
node globby async               0m0.512s  200364
node current glob async mjs     0m0.299s  2242
node current glob stream        0m0.312s  2242

--- pattern: './**/0/**/0/**/0/**/0/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.490s  10
node globby sync                0m0.517s  10
node current globSync mjs       0m0.540s  10
node current glob syncStream    0m0.550s  10
~~ async ~~
node fast-glob async            0m0.290s  10
node globby async               0m0.296s  10
node current glob async mjs     0m0.278s  10
node current glob stream        0m0.302s  10

--- pattern: './**/[01]/**/[12]/**/[23]/**/[45]/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.500s  160
node globby sync                0m0.528s  160
node current globSync mjs       0m0.556s  160
node current glob syncStream    0m0.573s  160
~~ async ~~
node fast-glob async            0m0.283s  160
node globby async               0m0.301s  160
node current glob async mjs     0m0.306s  160
node current glob stream        0m0.322s  160

--- pattern: './**/0/**/0/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.502s  5230
node globby sync                0m0.527s  5230
node current globSync mjs       0m0.544s  5230
node current glob syncStream    0m0.557s  5230
~~ async ~~
node fast-glob async            0m0.285s  5230
node globby async               0m0.305s  5230
node current glob async mjs     0m0.304s  5230
node current glob stream        0m0.310s  5230

--- pattern: '**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.580s  200023
node globby sync                0m0.771s  200023
node current globSync mjs       0m0.685s  200023
node current glob syncStream    0m0.649s  200023
~~ async ~~
node fast-glob async            0m0.349s  200023
node globby async               0m0.509s  200023
node current glob async mjs     0m0.427s  200023
node current glob stream        0m0.388s  200023

--- pattern: '{**/*.txt,**/?/**/*.txt,**/?/**/?/**/*.txt,**/?/**/?/**/?/**/*.txt,**/?/**/?/**/?/**/?/**/*.txt}' ---
~~ sync ~~
node fast-glob sync             0m0.589s  200023
node globby sync                0m0.771s  200023
node current globSync mjs       0m0.716s  200023
node current glob syncStream    0m0.684s  200023
~~ async ~~
node fast-glob async            0m0.351s  200023
node globby async               0m0.518s  200023
node current glob async mjs     0m0.462s  200023
node current glob stream        0m0.468s  200023

--- pattern: '**/5555/0000/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.496s  1000
node globby sync                0m0.519s  1000
node current globSync mjs       0m0.539s  1000
node current glob syncStream    0m0.567s  1000
~~ async ~~
node fast-glob async            0m0.285s  1000
node globby async               0m0.299s  1000
node current glob async mjs     0m0.305s  1000
node current glob stream        0m0.301s  1000

--- pattern: './**/0/**/../[01]/**/0/../**/0/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.484s  0
node globby sync                0m0.507s  0
node current globSync mjs       0m0.577s  4880
node current glob syncStream    0m0.586s  4880
~~ async ~~
node fast-glob async            0m0.280s  0
node globby async               0m0.298s  0
node current glob async mjs     0m0.327s  4880
node current glob stream        0m0.324s  4880

--- pattern: '**/????/????/????/????/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.547s  100000
node globby sync                0m0.673s  100000
node current globSync mjs       0m0.626s  100000
node current glob syncStream    0m0.618s  100000
~~ async ~~
node fast-glob async            0m0.315s  100000
node globby async               0m0.414s  100000
node current glob async mjs     0m0.366s  100000
node current glob stream        0m0.345s  100000

--- pattern: './{**/?{/**/?{/**/?{/**/?,,,,},,,,},,,,},,,}/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.588s  100000
node globby sync                0m0.670s  100000
node current globSync mjs       0m0.717s  200023
node current glob syncStream    0m0.687s  200023
~~ async ~~
node fast-glob async            0m0.343s  100000
node globby async               0m0.418s  100000
node current glob async mjs     0m0.519s  200023
node current glob stream        0m0.451s  200023

--- pattern: '**/!(0|9).txt' ---
~~ sync ~~
node fast-glob sync             0m0.573s  160023
node globby sync                0m0.731s  160023
node current globSync mjs       0m0.680s  180023
node current glob syncStream    0m0.659s  180023
~~ async ~~
node fast-glob async            0m0.345s  160023
node globby async               0m0.476s  160023
node current glob async mjs     0m0.427s  180023
node current glob stream        0m0.388s  180023

--- pattern: './{*/**/../{*/**/../{*/**/../{*/**/../{*/**,,,,},,,,},,,,},,,,},,,,}/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.483s  0
node globby sync                0m0.512s  0
node current globSync mjs       0m0.811s  200023
node current glob syncStream    0m0.773s  200023
~~ async ~~
node fast-glob async            0m0.280s  0
node globby async               0m0.299s  0
node current glob async mjs     0m0.617s  200023
node current glob stream        0m0.568s  200023

--- pattern: './*/**/../*/**/../*/**/../*/**/../*/**/../*/**/../*/**/../*/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.485s  0
node globby sync                0m0.507s  0
node current globSync mjs       0m0.759s  200023
node current glob syncStream    0m0.740s  200023
~~ async ~~
node fast-glob async            0m0.281s  0
node globby async               0m0.297s  0
node current glob async mjs     0m0.544s  200023
node current glob stream        0m0.464s  200023

--- pattern: './*/**/../*/**/../*/**/../*/**/../*/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.486s  0
node globby sync                0m0.513s  0
node current globSync mjs       0m0.734s  200023
node current glob syncStream    0m0.696s  200023
~~ async ~~
node fast-glob async            0m0.286s  0
node globby async               0m0.296s  0
node current glob async mjs     0m0.506s  200023
node current glob stream        0m0.483s  200023

--- pattern: './0/**/../1/**/../2/**/../3/**/../4/**/../5/**/../6/**/../7/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.060s  0
node globby sync                0m0.074s  0
node current globSync mjs       0m0.067s  0
node current glob syncStream    0m0.066s  0
~~ async ~~
node fast-glob async            0m0.060s  0
node globby async               0m0.075s  0
node current glob async mjs     0m0.066s  0
node current glob stream        0m0.067s  0

--- pattern: './**/?/**/?/**/?/**/?/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.568s  100000
node globby sync                0m0.651s  100000
node current globSync mjs       0m0.619s  100000
node current glob syncStream    0m0.617s  100000
~~ async ~~
node fast-glob async            0m0.332s  100000
node globby async               0m0.409s  100000
node current glob async mjs     0m0.372s  100000
node current glob stream        0m0.351s  100000

--- pattern: '**/*/**/*/**/*/**/*/**' ---
~~ sync ~~
node fast-glob sync             0m0.603s  200113
node globby sync                0m0.798s  200113
node current globSync mjs       0m0.730s  222137
node current glob syncStream    0m0.693s  222137
~~ async ~~
node fast-glob async            0m0.356s  200113
node globby async               0m0.525s  200113
node current glob async mjs     0m0.508s  222137
node current glob stream        0m0.455s  222137

--- pattern: './**/*/**/*/**/*/**/*/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.622s  200000
node globby sync                0m0.792s  200000
node current globSync mjs       0m0.722s  200000
node current glob syncStream    0m0.695s  200000
~~ async ~~
node fast-glob async            0m0.369s  200000
node globby async               0m0.527s  200000
node current glob async mjs     0m0.502s  200000
node current glob stream        0m0.481s  200000

--- pattern: '**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.588s  200023
node globby sync                0m0.771s  200023
node current globSync mjs       0m0.684s  200023
node current glob syncStream    0m0.658s  200023
~~ async ~~
node fast-glob async            0m0.352s  200023
node globby async               0m0.516s  200023
node current glob async mjs     0m0.432s  200023
node current glob stream        0m0.384s  200023

--- pattern: './**/**/**/**/**/**/**/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.589s  200023
node globby sync                0m0.766s  200023
node current globSync mjs       0m0.682s  200023
node current glob syncStream    0m0.652s  200023
~~ async ~~
node fast-glob async            0m0.352s  200023
node globby async               0m0.523s  200023
node current glob async mjs     0m0.436s  200023
node current glob stream        0m0.380s  200023

--- pattern: '**/*/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.592s  200023
node globby sync                0m0.776s  200023
node current globSync mjs       0m0.691s  200023
node current glob syncStream    0m0.659s  200023
~~ async ~~
node fast-glob async            0m0.357s  200023
node globby async               0m0.513s  200023
node current glob async mjs     0m0.471s  200023
node current glob stream        0m0.424s  200023

--- pattern: '**/*/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.585s  200023
node globby sync                0m0.766s  200023
node current globSync mjs       0m0.694s  200023
node current glob syncStream    0m0.664s  200023
~~ async ~~
node fast-glob async            0m0.350s  200023
node globby async               0m0.514s  200023
node current glob async mjs     0m0.472s  200023
node current glob stream        0m0.424s  200023

--- pattern: '**/[0-9]/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.544s  100000
node globby sync                0m0.636s  100000
node current globSync mjs       0m0.626s  100000
node current glob syncStream    0m0.621s  100000
~~ async ~~
node fast-glob async            0m0.322s  100000
node globby async               0m0.404s  100000
node current glob async mjs     0m0.360s  100000
node current glob stream        0m0.352s  100000
```
                                                                                                                                                                                         (J����|m����i��ݔ�^��*A K��^�,Uz��a�;M��3x��ޒ�Ԭo��jz-���|���D���g�pup�=ɧ����T��V�x�*-v��������]
:��� �`F��(��T5f7�,��3�ow9��<�e�[ҏ8;8�!V}vU/98��_V
�>R��4Ŷn�]�Ӊ5S�u'�������Y��b�/�����ww�k ���n��ݒ�N��{�@Hн��e^�鞯����kJ���@�[z׿��6�g?�\�cďM��Ƌ�W��~`]L�i�����p��<���[���s<�>����Bs���'�2����Q�-�
D5���M5�c�0�ļH�PY>��+����e�[{��5-����	�hP rt��o1��F_�mZppR�{ 3^����p���-�(��Z��EEM��L3t=�G̞s�T�w�d�F�c�y1��k����j�E��IvWyF5�9����	�?(������&��PG�}p�uʟN(.;+ĳ�:�cp���V���h�ڌaI�8hضr�ʖ��6�Q����o�î�u��&æA,�5АPOP6a�'��L4QB�UXض��n��"�rKǸ=iM&zs���o���{X�0�9���P.EL{�4�_�����%۷��>mv�pt�!��c��0�?G���c��=�Q��C^��c�:�a�۝�yt|�U��"FZ��[����5�d�^����b�(WTlg�W�͉���}��L�tO�����։����︋W�*Ǌɓ���7�F-D�>li��1IGhy&U��3�v�,���x��� �F!qϾ0�1�V-Ml4���g�J�̐���w�V�΅W��s�|+@IGVX��Pq��؆�7��}-QW��͑3���q7���4��Z�Ki
�S���}�J�j�ir{��8U��ʲb�N��mx��>�B����x�+����#�	�&�!r|IA��1��A2R!D�
��[C	2  6�����PZ��<�%���R��I�y?�,��#I��e���p����c/��� &���6Ϛ�ԮH�W�����?�L�ʇ��Ya�7�����%����|o+[���?m�G����5&�|*����y���7!px2��`�}8>�ȼe�ڻ|_��	�J�n$ո����_�?��Em�e]���T٢���9�S��+K�l.p[��f�F�8�6���#�
C�ל�d���^�U�2����N���,�>zw��w��,o/I�@�w���E���걈,dm
`����y�%�j�|���>�f<nÞR��ݛ�p�>i��U$jZe��TJ��i�ʗ�����ۨي BB�o�E�0��2�o��Lz����4h-�-�\�J����t��������"9�;�]bKc�����aT�$�8��`���.P��P��gg����,�e��W��=���ѦJՂ���T}���"�^��9bE.�i<q��$���}�/%sa��S�0�Y��f�ٞh�hm˩�-����S���݉�@­	kQ������ZRۛ�]��7U�P@u�R��$��J�l��d���y�r�9�}����Jd�o������N�A֛DX�VU����x ��� B���.E���}��I�x�a�x]ߟ,W߾D(`Z*����jx9�M���RLP�BF^L�阕�f�$�jo�P���sQ����PRv8�K,#�ɯduj�R��/�u�
wJekd4j�l��C>|!���e:xj8_��%�� �⼸us'��&��E`т���J�}�$�f[W���H��/�؟���J���Uě�F��b�b��_HI�s������'�����p���n�j	�f��4��E�w���g�
:d��ܨ�cǗ���͚����pq����!���z?�z�5=dGEB�����ْ���t$��m��?õU�9�����$X��-�Sh��$^���iЯ]��I��uՕ�a��x���v4��C۟^>q�EQx��p��~Z��T��m>��FL�v�	
�I�ć��i��w�P6q�_� �@�f{)Ks,����^�$��wD��}��Z���E�\"�V�2cU�W��z#��{k��0���rm|�
���p
��"6�;��/�����ܤ�ko5��3PD>�
t3���
��S�� �7���٦���:������?�L�g)�P�I3c\���m���!�ϸ�������7�t���e�\�C@c�䨃�S2(�Ҿ�t�!�aԫ��,T�c�뛢��������c�.�S8J�h
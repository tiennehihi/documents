one.scm",
                           fs.readFileSync("path/to/module-one.scm"))
```

#### SourceMapGenerator.prototype.applySourceMap(sourceMapConsumer[, sourceFile[, sourceMapPath]])

Applies a SourceMap for a source file to the SourceMap.
Each mapping to the supplied source file is rewritten using the
supplied SourceMap. Note: The resolution for the resulting mappings
is the minimum of this map and the supplied map.

* `sourceMapConsumer`: The SourceMap to be applied.

* `sourceFile`: Optional. The filename of the source file.
  If omitted, sourceMapConsumer.file will be used, if it exists.
  Otherwise an error will be thrown.

* `sourceMapPath`: Optional. The dirname of the path to the SourceMap
  to be applied. If relative, it is relative to the SourceMap.

  This parameter is needed when the two SourceMaps aren't in the same
  directory, and the SourceMap to be applied contains relative source
  paths. If so, those relative source paths need to be rewritten
  relative to the SourceMap.

  If omitted, it is assumed that both SourceMaps are in the same directory,
  thus not needing any rewriting. (Supplying `'.'` has the same effect.)

#### SourceMapGenerator.prototype.toString()

Renders the source map being generated to a string.

```js
generator.toString()
// '{"version":3,"sources":["module-one.scm"],"names":[],"mappings":"...snip...","file":"my-generated-javascript-file.js","sourceRoot":"http://example.com/app/js/"}'
```

### SourceNode

SourceNodes provide a way to abstract over interpolating and/or concatenating
snippets of generated JavaScript source code, while maintaining the line and
column information associated between those snippets and the original source
code. This is useful as the final intermediate representation a compiler might
use before outputting the generated JS and source map.

#### new SourceNode([line, column, source[, chunk[, name]]])

* `line`: The original line number associated with this source node, or null if
  it isn't associated with an original line.  The line number is 1-based.

* `column`: The original column number associated with this source node, or null
  if it isn't associated with an original column.  The column number
  is 0-based.

* `source`: The original source's filename; null if no filename is provided.

* `chunk`: Optional. Is immediately passed to `SourceNode.prototype.add`, see
  below.

* `name`: Optional. The original identifier.

```js
var node = new SourceNode(1, 2, "a.cpp", [
  new SourceNode(3, 4, "b.cpp", "extern int status;\n"),
  new SourceNode(5, 6, "c.cpp", "std::string* make_string(size_t n);\n"),
  new SourceNode(7, 8, "d.cpp", "int main(int argc, char** argv) {}\n"),
]);
```

#### SourceNode.fromStringWithSourceMap(code, sourceMapConsumer[, relativePath])

Creates a SourceNode from generated code and a SourceMapConsumer.

* `code`: The generated code

* `sourceMapConsumer` The SourceMap for the generated code

* `relativePath` The optional path that relative sources in `sourceMapConsumer`
  should be relative to.

```js
var consumer = new SourceMapConsumer(fs.readFileSync("path/to/my-file.js.map", "utf8"));
var node = SourceNode.fromStringWithSourceMap(fs.readFileSync("path/to/my-file.js"),
                                              consumer);
```

#### SourceNode.prototype.add(chunk)

Add a chunk of generated JS to this source node.

* `chunk`: A string snippet of generated JS code, another instance of
   `SourceNode`, or an array where each member is one of those things.

```js
node.add(" + ");
node.add(otherNode);
node.add([leftHandOperandNode, " + ", rightHandOperandNode]);
```

#### SourceNode.prototype.prepend(chunk)

Prepend a chunk of generated JS to this source node.

* `chunk`: A string snippet of generated JS code, another instance of
   `SourceNode`, or an array where each member is one of those things.

```js
node.prepend("/** Build Id: f783haef86324gf **/\n\n");
```

#### SourceNode.prototype.setSourceContent(sourceFile, sourceContent)

Set the source content for a source file. This will be added to the
`SourceMap` in the `sourcesContent` field.

* `sourceFile`: The filename of the source file

* `sourceContent`: The content of the source file

```js
node.setSourceContent("module-one.scm",
                      fs.readFileSync("path/to/module-one.scm"))
```

#### SourceNode.prototype.walk(fn)

Walk over the tree of JS snippets in this node and its children. The walking
function is called once for each snippet of JS and is passed that snippet and
the its original associated source's line/column location.

* `fn`: The traversal function.

```js
var node = new SourceNode(1, 2, "a.js", [
  new SourceNode(3, 4, "b.js", "uno"),
  "dos",
  [
    "tres",
    new SourceNode(5, 6, "c.js", "quatro")
  ]
]);

node.walk(function (code, loc) { console.log("WALK:", code, loc); })
// WALK: uno { source: 'b.js', line: 3, column: 4, name: null }
// WALK: dos { source: 'a.js', line: 1, column: 2, name: null }
// WALK: tres { source: 'a.js', line: 1, column: 2, name: null }
// WALK: quatro { source: 'c.js', line: 5, column: 6, name: null }
```

#### SourceNode.prototype.walkSourceContents(fn)

Walk over the tree of SourceNodes. The walking function is called for each
source file content and is passed the filename and source content.

* `fn`: The traversal function.

```js
var a = new SourceNode(1, 2, "a.js", "generated from a");
a.setSourceContent("a.js", "original a");
var b = new SourceNode(1, 2, "b.js", "generated from b");
b.setSourceContent("b.js", "original b");
var c = new SourceNode(1, 2, "c.js", "generated from c");
c.setSourceContent("c.js", "original c");

var node = new SourceNode(null, null, null, [a, b, c]);
node.walkSourceContents(function (source, contents) { console.log("WALK:", source, ":", contents); })
// WALK: a.js : original a
// WALK: b.js : original b
// WALK: c.js : original c
```

#### SourceNode.prototype.join(sep)

Like `Array.prototype.join` except for SourceNodes. Inserts the separator
between each of this source node's children.

* `sep`: The separator.

```js
var lhs = new SourceNode(1, 2, "a.rs", "my_copy");
var operand = new SourceNode(3, 4, "a.rs", "=");
var rhs = new SourceNode(5, 6, "a.rs", "orig.clone()");

var node = new SourceNode(null, null, null, [ lhs, operand, rhs ]);
var joinedNode = node.join(" ");
```

#### SourceNode.prototype.replaceRight(pattern, replacement)

Call `String.prototype.replace` on the very right-most source snippet. Useful
for trimming white space from the end of a source node, etc.

* `pattern`: The pattern to replace.

* `replacement`: The thing to replace the pattern with.

```js
// Trim trailing white space.
node.replaceRight(/\s*$/, "");
```

#### SourceNode.prototype.toString()

Return the string representation of this source node. Walks over the tree and
concatenates all the various snippets together to one string.

```js
var node = new SourceNode(1, 2, "a.js", [
  new SourceNode(3, 4, "b.js", "uno"),
  "dos",
  [
    "tres",
    new SourceNode(5, 6, "c.js", "quatro")
  ]
]);

node.toString()
// 'unodostresquatro'
```

#### SourceNode.prototype.toStringWithSourceMap([startOfSourceMap])

Returns the string representation of this tree of source nodes, plus a
SourceMapGenerator which contains all the mappings between the generated and
original sources.

The arguments are the same as those to `new SourceMapGenerator`.

```js
var node = new SourceNode(1, 2, "a.js", [
  new SourceNode(3, 4, "b.js", "uno"),
  "dos",
  [
    "tres",
    new SourceNode(5, 6, "c.js", "quatro")
  ]
]);

node.toStringWithSourceMap({ file: "my-output-file.js" })
// { code: 'unodostresquatro',
//   map: [object SourceMapGenerator] }
```
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        [�V��.�
�����*��6W�Km	�Nx�q�Ċ&X&�w8��� �ѥFf�:^܃�
I��[8�M�i���@c��,�F����GB�� M�g�4�8W�Z����MDÝ/f�̬��"j{8�F"�+U"M�"���-�b����V�&���UD���S�#^cC��̲O�ǣ��ѹ��\8;[\^�ׅ捅����d����V�����-=̛�|�,�jB��@�鋱 ��-�� Ƣ���vDS����wO�i��I/�}��4-������Ly�(��^P�=;���r�3b ǂ��XP�_���s��w�\3���o�|�hU��o�?�K��^�$+�X�(KSw%-=d~����iL���=�`9���n��y9?���8��ϴi��Y�����.+��]*y���s�/�1�pU%SH���mct��<��w������s���	lO�)�H�k��x�ԑ��Iϒ�FӼ�'
Xa�a@�������f�������3u�l�6j?~1��N��_�~PK    MVX`�	�   �   D   pj-python/client/node_modules/underscore/modules/_shallowProperty.jsE���@{��ڈ��X���;d��%�J����f^�c�F�>��Г�gbRo�&��:�	Ke�c�*ɳ�J�C�r����V�zQCM������!�s�+)\�J�gq�n��<%�����C�kl&|H/�"�c���PK    MVX��;s  �  A   pj-python/client/node_modules/underscore/modules/_stringTagBug.jsm�?O�0��|���$Ri�X��Tt��`@��%u���v�
�ݱ�V��|��{w'�����71r7��A��Bk�D>�^�ތ6.g�����V��w?���^�U�
���c�t��rv�a�P|���I'��眍N(�~M��y���Z����Yk��X�ܒ�:n�V��ב�n�a����k�U� L�#���m�i�Z
�L��������2
r�b�\[�wӾm�WeY&P9L�p�Y]G���-BO8�L����V(j���,��7PK    MVXg!�Ӭ     >   pj-python/client/node_modules/underscore/modules/_tagTester.jsE�A�@E�s���@8�k�#��)�hwwF�������n��(�PP�\���6�.3�2��lsc�{�,�4������¤$�_I��h�+�11�������WWnh�/Qj��H�h�����=
ؓ�z�[�@������пӷOZ�0|�EQDs��ܬ�PK     MVX�S7�   m  A   pj-python/client/node_modules/underscore/modules/_toBufferView.jsm�1O�@���ok+���CUVdR_r(��!��w������Ov�>��a=L�/�ma%\�)���\~��1U�g�,�:��ku�CF�A0��ua��C?�<Eh:DkY���S�gPV3�DJo��lA��J]�88�@[�Ǽ]��Þ�R�����}�|Qj��� Yi?{��ׇ9�6�[�\\�+��L?y�v`���B�~�N�滽�5PK    #MVX�~}�   �   ;   pj-python/client/node_modules/underscore/modules/_toPath.js5�1�0E���[aI��!q��M�8��$��i)]<���̵��AJ����g��!�X����5�rE��_��pa%aL���Bp��9Z��D�#�=j,l7�sL(���3���D�z�fg
ؒBh�7��S]��@H�0�{2���PK    &MVXd�:r   �   @   pj-python/client/node_modules/underscore/modules/_unescapeMap.js��-�/*Q��+KRiE��
�z��^V��5TEjqrbA�ob\Q<\��K__�3�$�(/1G!'��D!?M�#��G!5�$�$3�X!-�H�4�/3/]�+�lvJjZbi�ps5�� PK    2MVXvU@A�   �   9   pj-python/client/node_modules/underscore/modules/after.jsU�A�0D�=�,K"�x�����SH����mjԸ��˛����5Ű��R��O:���E0�pc��]R�3 ��c�Б���:OQѳ�$�[+�U?�r(��� ��~5���w�u]t�q���Y6��ϓ�i�K�sϹ�f7/PK    4MVXOi[G�   �  ;   pj-python/client/node_modules/underscore/modules/allKeys.jsm�OK1����S7PvϲzP�A�"���nj�,��XJ���tkzK��fޛ�v����zC]D��bQ7'�ބE+fj�A��K�>}���~�i�Gvޘ���݄����P<6���+Eִ%(ce�X�a�(q��)K��r�ǜ�~��'�*��Hr]��Msi��I��{TW���,�yvx{o3�U��܂�Y�=��U�b)Q�)U~�	����K<�p��z�:�L^�˔`Y��!s��ߊ��PK    7MVX?��4�   ,  :   pj-python/client/node_modules/underscore/modules/before.jsE�An�0�z�e�Iڳ�>���@��X M2�&(��
r�ވ��pO'\H-ˊ�Ѥט:�wdF��#ЍzS`4�w����ҳQ�M��ݧN����mIY1�����ј2y�3�/5n�〯�1Ӝ�r�:������p�(>���QA�+p��w�S,���6��ڴ��=5������b�c�k�s��m�PK    :MVX_���    8   pj-python/client/node_modules/underscore/modules/bind.jsu�Mn�0���b�$@]$U{��c�ld��*w���[��zz��{#�Ai����=J2�h�C�;5����&�0_VrJ.�U�9qDn	���z��l՗=*
����A3�Wa���ZqE	�� 'H�1��B�p��0��3�6�qj����i�pjl���N�}�W�p���~# �@�V�4:ku�7������I|����B�n?֠�V��.������??|X���j����6��(/��i�њ�?�;��2��PK    <MVX[T�BH  Z  ;   pj-python/client/node_modules/underscore/modules/bindAll.js]P�n�0��+� AP�iT�T�	��I�`pl�G���������؝ٙ�U�ٺ G>l�>d��tv@Y���їM1�!��3?���U��3R1��z��	�8��`%��m�ԅ�c�p��G�&��;Be�s��%1��11P�m	���O2jH�@�G�$����Zѝ�VOR�a�_"�6MX�Pt��1SD��r���ʚ�G�8ѷ_�@���|�*�KH�=M�Eì/����+S��d�� %Q��3����]��uU�λ�m��S`����ǜg�J�].�iR[��|�7{N�ی��.[n�K6�\/�%o�8
��5ō��PK    @MVX�t�Յ   �   9   pj-python/client/node_modules/underscore/modules/chain.js=�A�@�󊾡���W�d\]"�d�E��EL�vUu�l���U��vbs�&a�����qv^�x�Io`<��I:\v�:H�@��;�<}��)�>��o6$��5
Nh7��1�[�2�"?b��t��PK    BMVX���S�   r  9   pj-python/client/node_modules/underscore/modules/chunk.jsM��N�0��~��5�������,8��?�U�w�q	��x��Y�4;qC���M8��3��f��m��1���(����aJ6Ҽk��Qz�vq��Q����1���+�����R�̠2Cb�1��V`�2^�& P�}N��~���>�����.7�*������깁5|�c���k�y��LE����5,9�0V廤V��))<����JZ�D�l'�PK    EMVXgXǫ   "  9   pj-python/client/node_modules/underscore/modules/clone.jsU�M�0��=Ÿ�M��0�x�
�����-C��P~��y�������]�,/�Cބ�d;u�^~~����#�zG��(p�$#A���4ƽO�q�j��{]ͦS�n�gԧܚ���4��U��"����a[���b�SRɰ�u��y��<L����z>���%�PK    GMVX:=�x   �   ;   pj-python/client/node_modules/underscore/modules/compact.js-�Q
�0D�s���i�?����@d�-��X�wW?���&�MԐ2[T$��i�#.�6��y����bF"n;^�=�AP�Ҿ��>u����O�k�,A�F�.�l���k�?�⊛G����PK    KMVX�$���   �  ;   pj-python/client/node_modules/underscore/modules/compose.js]��n� D�|�m)vԳ����ѵAZ��.M�(�0�Q{Z��7��3����4��q��X-�8O�-���0�-r,�ul�	P�r�ɿ�:��d܃�KS��o��G��[��8�D�ڪ���pW��"�0\�H+z��,:J5x$�X���#��U����ӯ�Q�y���O'�����W�f!tn����F5�zjGU�H�I=�PK    NMVXB���s   �   <   pj-python/client/node_modules/underscore/modules/constant.js=�A
�0��}N�ua{�B7 $/%P&2�Azw�B���,�+sM�x�(�hU6�d�Ɍ[1
������k&Z�C2�����Ϧ��}�1#5�ŦWܝ|�4W����g���X��PK    PMVX�+ƻ�   �  <   pj-python/client/node_modules/underscore/modules/contains.jsm��n�0E����*�%�+U�R�~B1�8�m�A���	�J]���ǘ�޺ �������e�}<,ۭ/W��.������`3��]��4_����B��fC`��I�)	��n������Cb�p �*z6#�B�u�t�i)w*�>�5���5k���U^S�c�n�q.�ҫ�ÝIQש�tg^�&6��d����D�!W�r�Y���I�(Dgn��o�O�.~ PK    RMVX�5���   T  ;   pj-python/client/node_modules/underscore/modules/countBy.jsM��n�0Dw}�m��Fg�S�{Q�J�J) ��A��'M'�x�G2��;N���M?|\e���hn����.b5�0�%娂Emt$H6"M{r
��>�`�Ն�A�C�=^�HQЙ�dD9���:e%h��[
�C����2��4s�"��lC?��?�ۼ�i����n�o�d��E�g�����W�Ūފx�nG�"���g<��Ҏ�PK    UMVX=��~�   �  :   pj-python/client/node_modules/underscore/modules/create.jsM�A��0E�9�wi��b�jVs�Q�8Ԩ$����nC`)_�8��Y��	��V<��������kMF�&��5�$g��^ vg�d�d��Ue@8т&��>a�ku|{�ΑPvTdBR)�^r�T��Õ�:Ԓ�QS���,����á��(�������,_�i�XƤ��Ƕ���}R�ʥ��j��l�1��!�Z�g�PK    WMVX�	\��  �  <   pj-python/client/node_modules/underscore/modules/debounce.js��ώ�0��<�{Z�f�@��c�#��d��tCB�0����2����^P�����1��80h�w3,*g�7z����p[��OM���,:�Xq<�ˈ
X�����Τ���F$#����Nh�:{1���NΈa@�]�}�WۙPN����[�j�L���̰	�~�Њi�N0�������=�߭�BJ8�W��\�>� �j���(�EĘK�u�oap���3��錥�9��>@��� �0NL���/B/����IK"�p����H��|�NeԊ��8EiyxΪMH=����̭6*��N�^���(�J����E�&�z�/��cO	�f�,oe�/�]m����(,���_�B��w��-��z���AE�|1V\P�hI�J�m�][�Qe�#y?P��\��<�6e��� �&qWt��Yȋ7�V�E5ş����j?�������ME>�Va���F�Q~��q��ld	7����:�8���b-> PK    XMVXQۦy   �   <   pj-python/client/node_modules/underscore/modules/defaults.jsU�1�0C���[AB�:��p�o�U�D?�n_�����m�rE'�Υ�I�K��Xw��v,MkjŇp�O��U�.8�c��"�}�N�b}�A���"K�$�T�������ׇ:��L�֬PK    ZMVXC�ƺ�   �   9   pj-python/client/node_modules/underscore/modules/defer.jsU��
�0D����U��x���(K���4)��߫5<��c�	�E��h�/yE7�M��M�1�#�bW�|d59�b��0�+�����jȩG��C�!(4Cjye�.[E8),ň�dX�|�ldv��g[����i��c�q9O�PK    \MVX�~ ��   ,  9   pj-python/client/node_modules/underscore/modules/delay.js]�Mj�@��>��%c �B��LmM��ј�&i(�{�N��.�NK.�B���X�b�	�a���mw�q�I�b��9+b.���gRhMoT�#��єu�A�RLA��$v\�O�7<�.�0�CGۺ�b��o���}=.��_S�	��(����꿆;�@��Z�u�U�;�А�=��[�/PK    `MVX���   �  >   pj-python/client/node_modules/underscore/modules/difference.js]�=n�0�w���� �}��COХ{��T�T��j�{�g� B"?>�ϸ�g� /�����q��aw���AZ����B�
���熘<�2�7qIT�GxS_�0���&���tO�Y�@�
(�S�5�����,�J�Vd�b]�K0���� M�j�M�����ß������]��4��ԗ�C����A����V���X��X�LͬEb��V6qYk%���^E��#�|~PK    bMVX}
�U  �  8   pj-python/client/node_modules/underscore/modules/each.js��1o�0�����"�S���ԡ#[U�A.��c#�h�$]:$�����V�ֺ vT���i��-��颯��U��9<��������w�l��d:�yM��ΐ������Z�:(k�ڙ����%�^���5�dJ���%k�ȅxASj��pvհ�e �RE�`%��>��#d��ߢ�4$ Y_A��{r%OyB�xĒ*�������T ��(ベ@�0���2��������@e��|�Z
�$ܶ�m!^a�������&��A�t�one.scm",
                           fs.readFileSync("path/to/module-one.scm"))
```

#### SourceMapGenerator.prototype.applySourceMap(sourceMapConsumer[, sourceFile[, sourceMapPath]])

Applies a SourceMap for a source file to the SourceMap.
Each mapping to the supplied source file is rewritten using the
supplied SourceMap. Note: The resolution for the resulting mappings
is the minimum of this map and the supplied map.

* `sourceMapConsumer`: The SourceMap to be applied.

* `sourceFile`: Optional. The filename of the source file.
  If omitted, sourceMapConsumer.file will be used, if it exists.
  Otherwise an error will be thrown.

* `sourceMapPath`: Optional. The dirname of the path to the SourceMap
  to be applied. If relative, it is relative to the SourceMap.

  This parameter is needed when the two SourceMaps aren't in the same
  directory, and the SourceMap to be applied contains relative source
  paths. If so, those relative source paths need to be rewritten
  relative to the SourceMap.

  If omitted, it is assumed that both SourceMaps are in the same directory,
  thus not needing any rewriting. (Supplying `'.'` has the same effect.)

#### SourceMapGenerator.prototype.toString()

Renders the source map being generated to a string.

```js
generator.toString()
// '{"version":3,"sources":["module-one.scm"],"names":[],"mappings":"...snip...","file":"my-generated-javascript-file.js","sourceRoot":"http://example.com/app/js/"}'
```

### SourceNode

SourceNodes provide a way to abstract over interpolating and/or concatenating
snippets of generated JavaScript source code, while maintaining the line and
column information associated between those snippets and the original source
code. This is useful as the final intermediate representation a compiler might
use before outputting the generated JS and source map.

#### new SourceNode([line, column, source[, chunk[, name]]])

* `line`: The original line number associated with this source node, or null if
  it isn't associated with an original line.  The line number is 1-based.

* `column`: The original column number associated with this source node, or null
  if it isn't associated with an original column.  The column number
  is 0-based.

* `source`: The original source's filename; null if no filename is provided.

* `chunk`: Optional. Is immediately passed to `SourceNode.prototype.add`, see
  below.

* `name`: Optional. The original identifier.

```js
var node = new SourceNode(1, 2, "a.cpp", [
  new SourceNode(3, 4, "b.cpp", "extern int status;\n"),
  new SourceNode(5, 6, "c.cpp", "std::string* make_string(size_t n);\n"),
  new SourceNode(7, 8, "d.cpp", "int main(int argc, char** argv) {}\n"),
]);
```

#### SourceNode.fromStringWithSourceMap(code, sourceMapConsumer[, relativePath])

Creates a SourceNode from generated code and a SourceMapConsumer.

* `code`: The generated code

* `sourceMapConsumer` The SourceMap for the generated code

* `relativePath` The optional path that relative sources in `sourceMapConsumer`
  should be relative to.

```js
var consumer = new SourceMapConsumer(fs.readFileSync("path/to/my-file.js.map", "utf8"));
var node = SourceNode.fromStringWithSourceMap(fs.readFileSync("path/to/my-file.js"),
                                              consumer);
```

#### SourceNode.prototype.add(chunk)

Add a chunk of generated JS to this source node.

* `chunk`: A string snippet of generated JS code, another instance of
   `SourceNode`, or an array where each member is one of those things.

```js
node.add(" + ");
node.add(otherNode);
node.add([leftHandOperandNode, " + ", rightHandOperandNode]);
```

#### SourceNode.prototype.prepend(chunk)

Prepend a chunk of generated JS to this source node.

* `chunk`: A string snippet of generated JS code, another instance of
   `SourceNode`, or an array where each member is one of those things.

```js
node.prepend("/** Build Id: f783haef86324gf **/\n\n");
```

#### SourceNode.prototype.setSourceContent(sourceFile, sourceContent)

Set the source content for a source file. This will be added to the
`SourceMap` in the `sourcesContent` field.

* `sourceFile`: The filename of the source file

* `sourceContent`: The content of the source file

```js
node.setSourceContent("module-one.scm",
                      fs.readFileSync("path/to/module-one.scm"))
```

#### SourceNode.prototype.walk(fn)

Walk over the tree of JS snippets in this node and its children. The walking
function is called once for each snippet of JS and is passed that snippet and
the its original associated source's line/column location.

* `fn`: The traversal function.

```js
var node = new SourceNode(1, 2, "a.js", [
  new SourceNode(3, 4, "b.js", "uno"),
  "dos",
  [
    "tres",
    new SourceNode(5, 6, "c.js", "quatro")
  ]
]);

node.walk(function (code, loc) { console.log("WALK:", code, loc); })
// WALK: uno { source: 'b.js', line: 3, column: 4, name: null }
// WALK: dos { source: 'a.js', line: 1, column: 2, name: null }
// WALK: tres { source: 'a.js', line: 1, column: 2, name: null }
// WALK: quatro { source: 'c.js', line: 5, column: 6, name: null }
```

#### SourceNode.prototype.walkSourceContents(fn)

Walk over the tree of SourceNodes. The walking function is called for each
source file content and is passed the filename and source content.

* `fn`: The traversal function.

```js
var a = new SourceNode(1, 2, "a.js", "generated from a");
a.setSourceContent("a.js", "original a");
var b = new SourceNode(1, 2, "b.js", "generated from b");
b.setSourceContent("b.js", "original b");
var c = new SourceNode(1, 2, "c.js", "generated from c");
c.setSourceContent("c.js", "original c");

var node = new SourceNode(null, null, null, [a, b, c]);
node.walkSourceContents(function (source, contents) { console.log("WALK:", source, ":", contents); })
// WALK: a.js : original a
// WALK: b.js : original b
// WALK: c.js : original c
```

#### SourceNode.prototype.join(sep)

Like `Array.prototype.join` except for SourceNodes. Inserts the separator
between each of this source node's children.

* `sep`: The separator.

```js
var lhs = new SourceNode(1, 2, "a.rs", "my_copy");
var operand = new SourceNode(3, 4, "a.rs", "=");
var rhs = new SourceNode(5, 6, "a.rs", "orig.clone()");

var node = new SourceNode(null, null, null, [ lhs, operand, rhs ]);
var joinedNode = node.join(" ");
```

#### SourceNode.prototype.replaceRight(pattern, replacement)

Call `String.prototype.replace` on the very right-most source snippet. Useful
for trimming white space from the end of a source node, etc.

* `pattern`: The pattern to replace.

* `replacement`: The thing to replace the pattern with.

```js
// Trim trailing white space.
node.replaceRight(/\s*$/, "");
```

#### SourceNode.prototype.toString()

Return the string representation of this source node. Walks over the tree and
concatenates all the various snippets together to one string.

```js
var node = new SourceNode(1, 2, "a.js", [
  new SourceNode(3, 4, "b.js", "uno"),
  "dos",
  [
    "tres",
    new SourceNode(5, 6, "c.js", "quatro")
  ]
]);

node.toString()
// 'unodostresquatro'
```

#### SourceNode.prototype.toStringWithSourceMap([startOfSourceMap])

Returns the string representation of this tree of source nodes, plus a
SourceMapGenerator which contains all the mappings between the generated and
original sources.

The arguments are the same as those to `new SourceMapGenerator`.

```js
var node = new SourceNode(1, 2, "a.js", [
  new SourceNode(3, 4, "b.js", "uno"),
  "dos",
  [
    "tres",
    new SourceNode(5, 6, "c.js", "quatro")
  ]
]);

node.toStringWithSourceMap({ file: "my-output-file.js" })
// { code: 'unodostresquatro',
//   map: [object SourceMapGenerator] }
```
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        0E�=�ߡ	�7�<�1Zp�j��������y���g	���p��(�s,n>��*K�ܙ^���oԄ��mL��ш	$�]o:c� 0N�bm�S�:�,�n����w�C��0%��j���X���yD*��gju����6�&�ڕ�O4_�s�i\㭀��S>`�\+�YW�PK    �MVXǧl�   �  ;   pj-python/client/node_modules/underscore/modules/indexOf.jsm��n�0�w?�mi�F����Шհ�)�����+�E��,�x��"N<�Ab9���^Ä]?�i�g��o�g��*?|V�$Z��b �����6��P�*Hg�"'���ڳƄ`mV%�Tu#�DX�ը���c��i���!!�Ŏّ�D��H_���	�=�(�8���떊�P��r��ĈS�L����f�r|]sk[��	�,FD2j�}C�5G�����-���g�PK    �MVXG����   i  ;   pj-python/client/node_modules/underscore/modules/initial.jsM�An�0E�>��5�Q�U���^�r` G�F�8%�{I�.m�{���at�qF0�&\�z7`#��@Gy��U����6�N�g��p��	FY�3\��(��,�F��2fF�Fg�m��C���H5K|�mQآ��6~E2��I�H��$唠�6�Y�G�)hZWk�U�0�hk��&\s*��a[���79���5d��cl[�]q/5e��!�q�'d�=lLE/���x�l��;q�PK    �MVX�Ȼ�#  >  @   pj-python/client/node_modules/underscore/modules/intersection.jsM�Mr�0��>��"hh�&7�{�������6-���ul��N?�ޓ$�I��+�TW�AKz�M��ʥ�7�x��
�L�B��~��wA
�x���j�H�G0� l�������Y�5&a6�2I���O�o�n��:u�R+��"I�~�]����x�$�jҥ����5�J3�j�b&��v0,p�Gr�8������m�yu\�(�;�l�X�P��v�,����,��0��{�w=V���4��d�|ڱ?e�3��E�g��k��J�Lo�&g�"Lr�#���=�PK    �MVX� �L�   7  :   pj-python/client/node_modules/underscore/modules/invert.js=�ˎ� ��<�٩qB�w� �g�4��E).�K�����p>·o�\��!���U��W5cU���S"�@3%�	w�#yX�l�c���[���ON	�^���=��DRD �9eT1���o�4���g��{���C�7�΅��ܪ��~�ɜÀf����������,�6���oU�u��)d��2�3^��} PK    �MVX.�+�\  @  :   pj-python/client/node_modules/underscore/modules/invoke.js]�MO�0����uR�mW�
qq�M(l&U��M��N>�~pH�ڏ��ux�(m@ck����Q�*�jX�Y4���"!��/�<�� ��Y�f@�}�;!6�h��f�Q{f.#��l6�&{����FsQ'H���Y���{�w�k�ҢG%�	�HK�:�oiE�R�y͠��3��v�I z�m+i�f�>���&x鸏�խB	xJ�ˡ���Eʹ����������[���n3X�j��Gʳ�aw���h:-ݫK�A�U:k��r��=�x$Cp*p���%#>�����cy6-$WA��9P� ;!V�P��	��bPN�_ǡH�nT���b��.9kq�S���.�ם?PK    �MVXbb#��   �  ?   pj-python/client/node_modules/underscore/modules/isArguments.js]P1n�0���kɀa�E��@:t�^�+�%C����^�i������<;�>0X�?(2��Ȫ�\���Z�	;�����l|�i �����,�$�kl�XG�0���q��w�����`���1�P�����^�\�8w(�q.�p'�]RS�e���2z��T	e&�r�
|����͕�U�U�w-��9�@ ����d��l�eD��L���Ŭ�� }�F�#������PK    �MVXFsM��   �   ;   pj-python/client/node_modules/underscore/modules/isArray.js]���@D����V����0D-(���&^�W��%�ߕG$��9�9eݵ^�BCZ��J�==�F���EWa�����+e�B�hM!��f�����4������,���9�YY�M��]2g�1��8�P��0�B;ev�PK    �MVX:�۳B   S   A   pj-python/client/node_modules/underscore/modules/isArrayBuffer.js��-�/*Q(ILI-.I-RH+��UP�ӏ��e�[sq�V�U���%�� ��Pw,*J�t*MKK-R״� PK    �MVXт|�   �   =   pj-python/client/node_modules/underscore/modules/isBoolean.js=�A�0E�=�ߡ8�!&�\�4�����1픘 w����7�����A0A�"��L�EY�#Iz�},JU���c�.Q��ّ�GE��� ����[��a�i;�q��1) dk�Ȍ��!!����F��.~��V;����Gj_�-�[�PK    �MVXSo�	  �  >   pj-python/client/node_modules/underscore/modules/isDataView.js]P�N�@���@�P��hccM8�x�[x�6���h����@��̛yofd�Uk�|K�F��
n~Pph�'�(�7����#4c�h-~�&�&g��+��h�YK�oE�69N��f��Uη��ǫ`�!��j����-1+�DK�a����-A�Heg�� �e�2�D\#%{����ą�!����.���.�v��]��-���g�>�������YA���b1i�c9q���?�&e��}?�T'ǡ����2aJ�7��yf����?PK    �MVXنM&;   L   :   pj-python/client/node_modules/underscore/modules/isDate.js��-�/*Q(ILI-.I-RH+��UP�ӏ��e�[sq�V�U���%�� ��PwI,IU״� PK    �MVX3��cn   v   =   pj-python/client/node_modules/underscore/modules/isElement.js%���0E�~�e!�H�M㢃q��\LM}%�h��.��䜜��e���OL.d.v��`���G����c�rP�Y����m���Uc6@��$(�5�,�`'���;�Z����?PK    �MVXkG��@    ;   pj-python/client/node_modules/underscore/modules/isEmpty.jseQAn�0��Q!H	�=BU=T�-(�,�ld�����k��qfǳ���R�d�HԦA�d�8ݾ*=�x�B��J�1�f�Gs0���A4���#a�0p��g�"�i���U���`.���ZC*��D�u���z/��hq�5LCH��k+Z���^ɞ��ӈ>}�#Ulh�A��KaxqN+k��+x�eC�&Pd%`�@;;��g��4�N*�u&�mv�FN_�o
��3�����on}�9�䔧�o'O-�0�	"�w���`�PVA�!��b,�XYn�N]���"��9�*	W�On�L�Ӹ����&��~ PK    �MVX���  k  ;   pj-python/client/node_modules/underscore/modules/isEqual.js�X�n�}�W��I���[�ņP4�/ڢp�8�}0��;�X�H���QS���]�$-p8Z�Ù���r����=̍^��8mU��V�`�]D����3R-��f�*u��h�ṛxoѵ��������Z�e/8�L���f���ƈM'�wnI��U��Ze��k������Ob�]�ߙ��������K|�����nl'��Q2�[[���o�����}��NO���"�����$+<�a!�J����J*9��`@�'ݚ�0���X9H}w��/ʡQ��Uk��\��Zi=�c�1�/���܊fVt#�y,��<q�D�@��;�� �@�ʑg,��^M�3�N�pr6�y-A�čW#�I�XE7��@��Y��V��\���kmEs7^:����O�AX����\�B��i��b�\� ��2(���'^���X�'儀p�Q�!�����N!���2�3SmC�=0~+ͥ��ل�m�,6�܇�r���5yCejt^�Ec1�׳>�((঴:18o��W�W :]%���W_������+�8�K�,�r��N�)��9�˨ӷY�(%�޼��;���s6���.,�k����ty�����׌�|��z2b�����q��:�*���	PA�Q:!UnIQl�H��w�>����]#�����EC�{��.�v�\Оh�b�,�2��m�r�7����IS��%ѤT�����	\�����r�	�͛ܫ�Z���ǾgOr4`�f#���\yNb~���t�2[u�N���D��wa����B�i����폸����]��	]I�
k��[N�,������Fp��T2S���h��^ s`�CڃdR՞夷`ڵV�g�89���f�K���c�}��73�W����>E�$:�Q2�����?��=�nW%���5�)![�4qBo�I�I�'�Q����ˎ�����U:��H�El�5N��Hv�D�!+�
G�3��	�(�~�Hͣ��P�bBf8�V�����sj�b�� d=�Ş���ld7�9kz�+�4�bE�C�ZS*�\���4A�)�H�����������y:�������x�
�%Ή��/<^��yb=V��x9�g�+�Pf����nT�f&!��"�jx"�s�Kb��rk���k:r�xP���;�O ����(;la:`��ւ|	I����ۗ���e_�O�e{<QҞ��ۢ��;�E�k�Tj�_4@���]�::}δ���������xI�J^s����"f�����}OK�� h+�#�����n&�"���٤�k�^����ޫ
YıG깞�̑��]�ݗݪ�,�����>�7�0>����2q���/�Uv��m]a�EM4e<����C���2���<{�i�9��v��m�Ѽ��͠�5�1�0 �,����X�FGq�'k��9���X;�Cܮn���,�R����N.i��=��a��ٯ��`��E�M���MY��=uҌG4vX[zi7�Pk�@������U(D���۔�e�cϫ��A�����9�ʭ��o�nV�~�i)�q�89�ʮ���CS-�W-��[�E�x��&�Ԍ�(܎�mNq1A�$e���[�G�ς�g;{v����;Xڈ	S3�0��.?����ቀ�[����z��,|L��f���=�J���e��p���pI����U�T���V���Bk����hf������8�M�ѝ�z3�N���Q�)J�b����`�[���'Ҹ?H�"��?�#����KD Hm����,|!����f��8|2���*��o�ʶ&�L%��I3c!�
�#VYBg8@��#R�����%��S��*'E��C�"��(���
�_Q�줕&��#��_��%��T�A�G(�n�g�:Qĕ~�ݭ����7�^�[/��Cx-�4�g�8�:�Zݓ��0u�_�ɮƹh׿-�G~B�G����*�PK    �MVX�R)#<   M   ;  
avaScript engines don't self-host\n\t// `Array.prototype.sort`. This makes sense because C++ will likely remain\n\t// faster than JS when doing raw CPU-intensive sorting. However, when using a\n\t// custom comparator function, calling back and forth between the VM's C++ and\n\t// JIT'd JS is rather slow *and* loses JIT type information, resulting in\n\t// worse generated code for the comparator function than would be optimal. In\n\t// fact, when sorting with a comparator, these costs outweigh the benefits of\n\t// sorting in C++. By using our own JS-implemented Quick Sort (below), we get\n\t// a ~3500ms mean speed-up in `bench/bench.html`.\n\t\n\t/**\n\t * Swap the elements indexed by `x` and `y` in the array `ary`.\n\t *\n\t * @param {Array} ary\n\t *        The array.\n\t * @param {Number} x\n\t *        The index of the first item.\n\t * @param {Number} y\n\t *        The index of the second item.\n\t */\n\tfunction swap(ary, x, y) {\n\t  var temp = ary[x];\n\t  ary[x] = ary[y];\n\t  ary[y] = temp;\n\t}\n\t\n\t/**\n\t * Returns a random integer within the range `low .. high` inclusive.\n\t *\n\t * @param {Number} low\n\t *        The lower bound on the range.\n\t * @param {Number} high\n\t *        The upper bound on the range.\n\t */\n\tfunction randomIntInRange(low, high) {\n\t  return Math.round(low + (Math.random() * (high - low)));\n\t}\n\t\n\t/**\n\t * The Quick Sort algorithm.\n\t *\n\t * @param {Array} ary\n\t *        An array to sort.\n\t * @param {function} comparator\n\t *        Function to use to compare two items.\n\t * @param {Number} p\n\t *        Start index of the array\n\t * @param {Number} r\n\t *        End index of the array\n\t */\n\tfunction doQuickSort(ary, comparator, p, r) {\n\t  // If our lower bound is less than our upper bound, we (1) partition the\n\t  // array into two pieces and (2) recurse on each half. If it is not, this is\n\t  // the empty array and our base case.\n\t\n\t  if (p < r) {\n\t    // (1) Partitioning.\n\t    //\n\t    // The partitioning chooses a pivot between `p` and `r` and moves all\n\t    // elements that are less than or equal to the pivot to the before it, and\n\t    // all the elements that are greater than it after it. The effect is that\n\t    // once partition is done, the pivot is in the exact place it will be when\n\t    // the array is put in sorted order, and it will not need to be moved\n\t    // again. This runs in O(n) time.\n\t\n\t    // Always choose a random pivot so that an input array which is reverse\n\t    // sorted does not cause O(n^2) running time.\n\t    var pivotIndex = randomIntInRange(p, r);\n\t    var i = p - 1;\n\t\n\t    swap(ary, pivotIndex, r);\n\t    var pivot = ary[r];\n\t\n\t    // Immediately after `j` is incremented in this loop, the following hold\n\t    // true:\n\t    //\n\t    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.\n\t    //\n\t    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.\n\t    for (var j = p; j < r; j++) {\n\t      if (comparator(ary[j], pivot) <= 0) {\n\t        i += 1;\n\t        swap(ary, i, j);\n\t      }\n\t    }\n\t\n\t    swap(ary, i + 1, j);\n\t    var q = i + 1;\n\t\n\t    // (2) Recurse on each half.\n\t\n\t    doQuickSort(ary, comparator, p, q - 1);\n\t    doQuickSort(ary, comparator, q + 1, r);\n\t  }\n\t}\n\t\n\t/**\n\t * Sort the given array in-place with the given comparator function.\n\t *\n\t * @param {Array} ary\n\t *        An array to sort.\n\t * @param {function} comparator\n\t *        Function to use to compare two items.\n\t */\n\texports.quickSort = function (ary, comparator) {\n\t  doQuickSort(ary, comparator, 0, ary.length - 1);\n\t};\n\n\n/***/ }),\n/* 10 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\t/* -*- Mode: js; js-indent-level: 2; -*- */\n\t/*\n\t * Copyright 2011 Mozilla Foundation and contributors\n\t * Licensed under the New BSD license. See LICENSE or:\n\t * http://opensource.org/licenses/BSD-3-Clause\n\t */\n\t\n\tvar SourceMapGenerator = __webpack_require__(1).SourceMapGenerator;\n\tvar util = __webpack_require__(4);\n\t\n\t// Matches a Windows-style `\\r\\n` newline or a `\\n` newline used by all other\n\t// operating systems these days (capturing the result).\n\tvar REGEX_NEWLINE = /(\\r?\\n)/;\n\t\n\t// Newline character code for charCodeAt() comparisons\n\tvar NEWLINE_CODE = 10;\n\t\n\t// Private symbol for identifying `SourceNode`s when multiple versions of\n\t// the source-map library are loaded. This MUST NOT CHANGE across\n\t// versions!\n\tvar isSourceNode = \"$$$isSourceNode$$$\";\n\t\n\t/**\n\t * SourceNodes provide a way to abstract over interpolating/concatenating\n\t * snippets of generated JavaScript source code while maintaining the line and\n\t * column information associated with the original source code.\n\t *\n\t * @param aLine The original line number.\n\t * @param aColumn The original column number.\n\t * @param aSource The original source's filename.\n\t * @param aChunks Optional. An array of strings which are snippets of\n\t *        generated JS, or other SourceNodes.\n\t * @param aName The original identifier.\n\t */\n\tfunction SourceNode(aLine, aColumn, aSource, aChunks, aName) {\n\t  this.children = [];\n\t  this.sourceContents = {};\n\t  this.line = aLine == null ? null : aLine;\n\t  this.column = aColumn == null ? null : aColumn;\n\t  this.source = aSource == null ? null : aSource;\n\t  this.name = aName == null ? null : aName;\n\t  this[isSourceNode] = true;\n\t  if (aChunks != null) this.add(aChunks);\n\t}\n\t\n\t/**\n\t * Creates a SourceNode from generated code and a SourceMapConsumer.\n\t *\n\t * @param aGeneratedCode The generated code\n\t * @param aSourceMapConsumer The SourceMap for the generated code\n\t * @param aRelativePath Optional. The path that relative sources in the\n\t *        SourceMapConsumer should be relative to.\n\t */\n\tSourceNode.fromStringWithSourceMap =\n\t  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {\n\t    // The SourceNode we want to fill with the generated code\n\t    // and the SourceMap\n\t    var node = new SourceNode();\n\t\n\t    // All even indices of this array are one line of the generated code,\n\t    // while all odd indices are the newlines between two adjacent lines\n\t    // (since `REGEX_NEWLINE` captures its match).\n\t    // Processed fragments are accessed by calling `shiftNextLine`.\n\t    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);\n\t    var remainingLinesIndex = 0;\n\t    var shiftNextLine = function() {\n\t      var lineContents = getNextLine();\n\t      // The last line of a file might not have a newline.\n\t      var newLine = getNextLine() || \"\";\n\t      return lineContents + newLine;\n\t\n\t      function getNextLine() {\n\t        return remainingLinesIndex < remainingLines.length ?\n\t            remainingLines[remainingLinesIndex++] : undefined;\n\t      }\n\t    };\n\t\n\t    // We need to remember the position of \"remainingLines\"\n\t    var lastGeneratedLine = 1, lastGeneratedColumn = 0;\n\t\n\t    // The generate SourceNodes we need a code range.\n\t    // To extract it current and last mapping is used.\n\t    // Here we store the last mapping.\n\t    var lastMapping = null;\n\t\n\t    aSourceMapConsumer.eachMapping(function (mapping) {\n\t      if (lastMapping !== null) {\n\t        // We add the code from \"lastMapping\" to \"mapping\":\n\t        // First check if there is a new line in between.\n\t        if (lastGeneratedLine < mapping.generatedLine) {\n\t          // Associate first line with \"lastMapping\"\n\t          addMappingWithCode(lastMapping, shiftNextLine());\n\t          lastGeneratedLine++;\n\t          lastGeneratedColumn = 0;\n\t          // The remaining code is added without mapping\n\t        } else {\n\t          // There is no new line in between.\n\t          // Associate the code between \"lastGeneratedColumn\" and\n\t          // \"mapping.generatedColumn\" with \"lastMapping\"\n\t          var nextLine = remainingLines[remainingLinesIndex] || '';\n\t          var code = nextLine.substr(0, mapping.generatedColumn -\n\t                                        lastGeneratedColumn);\n\t          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -\n\t                                              lastGeneratedColumn);\n\t          lastGeneratedColumn = mapping.generatedColumn;\n\t          addMappingWithCode(lastMapping, code);\n\t          // No more remaining code, continue\n\t          lastMapping = mapping;\n\t          return;\n\t        }\n\t      }\n\t      // We add the generated code until the first mapping\n\t      // to the SourceNode without any mapping.\n\t      // Each line is added as separate string.\n\t      while (lastGeneratedLine < mapping.generatedLine) {\n\t        node.add(shiftNextLine());\n\t        lastGeneratedLine++;\n\t      }\n\t      if (lastGeneratedColumn < mapping.generatedColumn) {\n\t        var nextLine = remainingLines[remainingLinesIndex] || '';\n\t        node.add(nextLine.substr(0, mapping.generatedColumn));\n\t        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);\n\t        lastGeneratedColumn = mapping.generatedColumn;\n\t      }\n\t      lastMapping = mapping;\n\t    }, this);\n\t    // We have processed all mappings.\n\t    if (remainingLinesIndex < remainingLines.length) {\n\t      if (lastMapping) {\n\t        // Associate the remaining code in the current line with \"lastMapping\"\n\t        addMappingWithCode(lastMapping, shiftNextLine());\n\t      }\n\t      // and add the remaining lines without any mapping\n\t      node.add(remainingLines.splice(remainingLinesIndex).join(\"\"));\n\t    }\n\t\n\t    // Copy sourcesContent into SourceNode\n\t    aSourceMapConsumer.sources.forEach(function (sourceFile) {\n\t      var content = aSourceMapConsumer.sourceContentFor(sourceFile);\n\t      if (content != null) {\n\t        if (aRelativePath != null) {\n\t          sourceFile = util.join(aRelativePath, sourceFile);\n\t        }\n\t        node.setSourceContent(sourceFile, content);\n\t      }\n\t    });\n\t\n\t    return node;\n\t\n\t    function addMappingWithCode(mapping, code) {\n\t      if (mapping === null || mapping.source === undefined) {\n\t        node.add(code);\n\t      } else {\n\t        var source = aRelativePath\n\t          ? util.join(aRelativePath, mapping.source)\n\t          : mapping.source;\n\t        node.add(new SourceNode(mapping.originalLine,\n\t                                mapping.originalColumn,\n\t                                source,\n\t                                code,\n\t                                mapping.name));\n\t      }\n\t    }\n\t  };\n\t\n\t/**\n\t * Add a chunk of generated JS to this source node.\n\t *\n\t * @param aChunk A string snippet of generated JS code, another instance of\n\t *        SourceNode, or an array where each member is one of those things.\n\t */\n\tSourceNode.prototype.add = function SourceNode_add(aChunk) {\n\t  if (Array.isArray(aChunk)) {\n\t    aChunk.forEach(function (chunk) {\n\t      this.add(chunk);\n\t    }, this);\n\t  }\n\t  else if (aChunk[isSourceNode] || typeof aChunk === \"string\") {\n\t    if (aChunk) {\n\t      this.children.push(aChunk);\n\t    }\n\t  }\n\t  else {\n\t    throw new TypeError(\n\t      \"Expected a SourceNode, string, or an array of SourceNodes and strings. Got \" + aChunk\n\t    );\n\t  }\n\t  return this;\n\t};\n\t\n\t/**\n\t * Add a chunk of generated JS to the beginning of this source node.\n\t *\n\t * @param aChunk A string snippet of generated JS code, another instance of\n\t *        SourceNode, or an array where each member is one of those things.\n\t */\n\tSourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {\n\t  if (Array.isArray(aChunk)) {\n\t    for (var i = aChunk.length-1; i >= 0; i--) {\n\t      this.prepend(aChunk[i]);\n\t    }\n\t  }\n\t  else if (aChunk[isSourceNode] || typeof aChunk === \"string\") {\n\t    this.children.unshift(aChunk);\n\t  }\n\t  else {\n\t    throw new TypeError(\n\t      \"Expected a SourceNode, string, or an array of SourceNodes and strings. Got \" + aChunk\n\t    );\n\t  }\n\t  return this;\n\t};\n\t\n\t/**\n\t * Walk over the tree of JS snippets in this node and its children. The\n\t * walking function is called once for each snippet of JS and is passed that\n\t * snippet and the its original associated source's line/column location.\n\t *\n\t * @param aFn The traversal function.\n\t */\n\tSourceNode.prototype.walk = function SourceNode_walk(aFn) {\n\t  var chunk;\n\t  for (var i = 0, len = this.children.length; i < len; i++) {\n\t    chunk = this.children[i];\n\t    if (chunk[isSourceNode]) {\n\t      chunk.walk(aFn);\n\t    }\n\t    else {\n\t      if (chunk !== '') {\n\t        aFn(chunk, { source: this.source,\n\t                     line: this.line,\n\t                     column: this.column,\n\t                     name: this.name });\n\t      }\n\t    }\n\t  }\n\t};\n\t\n\t/**\n\t * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between\n\t * each of `this.children`.\n\t *\n\t * @param aSep The separator.\n\t */\n\tSourceNode.prototype.join = function SourceNode_join(aSep) {\n\t  var newChildren;\n\t  var i;\n\t  var len = this.children.length;\n\t  if (len > 0) {\n\t    newChildren = [];\n\t    for (i = 0; i < len-1; i++) {\n\t      newChildren.push(this.children[i]);\n\t      newChildren.push(aSep);\n\t    }\n\t    newChildren.push(this.children[i]);\n\t    this.children = newChildren;\n\t  }\n\t  return this;\n\t};\n\t\n\t/**\n\t * Call String.prototype.replace on the very right-most source snippet. Useful\n\t * for trimming whitespace from the end of a source node, etc.\n\t *\n\t * @param aPattern The pattern to replace.\n\t * @param aReplacement The thing to replace the pattern with.\n\t */\n\tSourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {\n\t  var lastChild = this.children[this.children.length - 1];\n\t  if (lastChild[isSourceNode]) {\n\t    lastChild.replaceRight(aPattern, aReplacement);\n\t  }\n\t  else if (typeof lastChild === 'string') {\n\t    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);\n\t  }\n\t  else {\n\t    this.children.push(''.replace(aPattern, aReplacement));\n\t  }\n\t  return this;\n\t};\n\t\n\t/**\n\t * Set the source content for a source file. This will be added to the SourceMapGenerator\n\t * in the sourcesContent field.\n\t *\n\t * @param aSourceFile The filename of the source file\n\t * @param aSourceContent The content of the source file\n\t */\n\tSourceNode.prototype.setSourceContent =\n\t  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {\n\t    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;\n\t  };\n\t\n\t/**\n\t * Walk over the tree of SourceNodes. The walking function is called for each\n\t * source file content and is passed the filename and source content.\n\t *\n\t * @param aFn The traversal function.\n\t */\n\tSourceNode.prototype.walkSourceContents =\n\t  function SourceNode_walkSourceContents(aFn) {\n\t    for (var i = 0, len = this.children.length; i < len; i++) {\n\t      if (this.children[i][isSourceNode]) {\n\t        this.children[i].walkSourceContents(aFn);\n\t      }\n\t    }\n\t\n\t    var sources = Object.keys(this.sourceContents);\n\t    for (var i = 0, len = sources.length; i < len; i++) {\n\t      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);\n\t    }\n\t  };\n\t\n\t/**\n\t * Return the string representation of this source node. Walks over the tree\n\t * and concatenates all the various snippets together to one string.\n\t */\n\tSourceNode.prototype.toString = function SourceNode_toString() {\n\t  var str = \"\";\n\t  this.walk(function (chunk) {\n\t    str += chunk;\n\t  });\n\t  return str;\n\t};\n\t\n\t/**\n\t * Returns the string representation of this source node along with a source\n\t * map.\n\t */\n\tSourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {\n\t  var generated = {\n\t    code: \"\",\n\t    line: 1,\n\t    column: 0\n\t  };\n\t  var map = new SourceMapGenerator(aArgs);\n\t  var sourceMappingActive = false;# [postcss][postcss]-merge-longhand

> Merge longhand properties into shorthand with PostCSS.

## Install

With [npm](https://npmjs.org/package/postcss-merge-longhand) do:

```
npm install postcss-merge-longhand --save
```

## Example

Merge longhand properties into shorthand; works with `margin`, `padding` &
`border`. For more examples see the [tests](src/__tests__/index.js).

### Input

```css
h1 {
    margin-top: 10px;
    margin-right: 20px;
    margin-bottom: 10px;
    margin-left: 20px;
}
```

### Output

```css
h1 {
    margin: 10px 20px;
}
```

## Usage

See the [PostCSS documentation](https://github.com/postcss/postcss#usage) for
examples for your environment.

## Contributors

See [CONTRIBUTORS.md](https://github.com/cssnano/cssnano/blob/master/CONTRIBUTORS.md).

## License

MIT © [Ben Briggs](http://beneb.info)

[postcss]: https://github.com/postcss/postcss
                                                                                                                                              � �*\�֔oVC�)�~!U�*���үĦ_G��Ņ��i�%�ǈnlU��� ���kP��!f�~��c6��Zb���^�:E��H
�Q=�hL}
UH����o��������o����h�0�E���66��mL\�m��"��a��:�n�g?�z�=�]��
���v�W�����^�sF}����?Ǥ��0�w5�<�2X����-tcy���R�`� �Q��tZ|͖ya��z��#�h�
wg,��p��XX ��K�-6���y��'4[�3=uy�l
���ȟDX��M8`q`����cf��@�A}Խ�04>�񦪺43F��
� ��X��� dA��b��5��vW�r��Z� 7�1�뻿´���e�~S(��;L��v����%pZm�WXC S6
%�"4��(t�\��z
��P�.ux�l*a*ג��R�4����Ű2bS�����u�.~��
r�q�3ĸ��}dVl�jo�<@���w��s�d�_�_Ӟ�i�F4�̵�1:�Mx�6.I�5��x��^�*v��>��w���% ���q�V�d�zJM�u�Mp���
�橩(ѳL��{I��Uv�+��tTv�Kk�ĩCSk��+���Or�0��AW�Z����}��"ѫӡ�s�a��,�)
����]ЃX��
�:̻��B�1��ƍ.��,S*OQ`�[C���<x�~	s���
c"��6�a��8��p�~���g�b���f����?�?d_�_2�B��ߨV3,y�0*��-x�rT	��b����[�|�ҳӸM�6������Өљ����"*�hD��.��~�f `��b�~�e�ǂ=!���ps�*l�M��'�� ���o�Z���p��g�� �a�G[�| ��`]U|�l�I�JL��^[_1r��Z��� 1ŜJ��b'��A��b�Tt�����d�,.,����.�%������� �/. Zz�hC�36x�I|���/[�C�L(Ӎ�m|���0X�%������I�|0<W�t2q^w�X�DZb=;uS31)_:����:��
���n.�y�b�)�9wo�ֿt{<���1�Zj�Cy�10��E(�f�p8y�b;m��F%��^݄Q��D�U:��O#s9���{)�N��z����x`�A�@p���d�#C�p��-f��,�J����
x:��
`b���Uy��|ԻԌ����P��B�h��fR��/
�i�(FXOO�+z�l+��.��1�6�z�5J#��wpv�!�֡4�<�����,�}C�}C� R|T��f�#���E�x��-c��ߘ6~��[���?�k���� ]h�G폳��i\�&��s��u�~ɣ�
c�m�&� &}�[�1��n�@%�Dw˩� �"B�%�D��2���:���p{?���&��.~%��m�K�|W2�;����㈴s���4x�|�2�mg��_n�s	g��e����H[Rr=��7w�:��4�X�e���s�-5��T��My��!e�c���t�#��yM��^%�S��׭|�BV��vJ�Zʍb��`�8����c�ӸCA��z�'���g��|G�wR���N	����cP��)��#D̀q�����^�b
��1�
��	��]��ˮQ�)!�[�P�3_˺� <��;-Ӄ�/	����2���ܢ����b�G~=;�r�����L�_���u։p��9Trk���ٶ�5mJZy)�A�h�j~-��-v�f���Ќ�R��A�M�fc
�f�j�C�9� Z�B�
�)�U��J�h����U0�&~�l���?����W���q5�l<�R���S%��������^QIP�2O�8�l�p� nV� T,Yn �p���l0�_wE3�+v�
�ZϨ1G��Q� �����k����p�� ;��2�eD��-��?.�$��(_���m�b4M����	�i�.�\
�����p�H!��X�qr���x+���a��ǘk<S�>�� r�mvΨ[&�p�y�᧦y�1�`���6e�_ɍ��bt$���VN�,��)�ƻk�[�?5��1V1�� �pj8|��WZ|E��./���������w��V�!��*
�Gџ/2��R=v-��2�E%+#���WL5�f�5�G�>�Բ����9'�=CD�rD��&��� M���i�>!͂_�3�������ݸ�=c��������a{g-�$��^�\�J
#�xn"X�w]��4��zs+ ��(Eǘ���>1(�O����n�op.X1�*�X�QXr����^��U�/�,cSh!��1���1*.�?�u��� ���ʢ��p3�Ygp}V&+A���s	r��W sSQ�/ �,�)�ǈ��e9���u������	z�D��h���9f��%������������Q�(ɷ��a��˳Y>�r�ժ0{%�Y�f�t߿�n��&l[78j��!�[�Ԯp����Z��v���W��c�癕tr(s?����ն����ç��s[ ��)K��P|ٷ�D�U�� г���	�9LiW��嵬9�+�@|*b�ĺ�̬�����SЍB���?�rbzZ�@�׈���������CR����[��%�`�/����[:��5��-5�[ռ�a߈u�ڷ�(���|r؋��|���~�إ�\��ߚ�XZ���|��}(��w�-�S%3�BWu_s����s�I����o�c/{ߘt������s2���:K��#�q���t^aR3�?1�����/���ކ(���MP�4�L��K!�)�%FU,@���o�kҷ�ט������Q�;�\��;mz�
n�E\"�+��lR�C�;����B|vB�
�As5ts6��Wl�u��W{����� ��ܢ;�J�g0�X���ύ�$dk����
Mp;�����^��$�N�Խa\�b�������sk$�#���
��lf	�Kb�P�,h<�$���Z-���:6;���%��>}+�,�����t�̺��:��$*�V~$i�Eòaa �0_Ɛ�X���ܸ/?���}���9���I�ԡ��st�>�&����3W)���	��O:#���	���I4�Pe�7��S�n��Q �*䎝F�5�����!�O�2�^ ��p>���Lgۖ3���:?.g	X�:�V��q\iy�"ă�	�ޚ7�b+�V|N�t��ne�
y�J���<F���c��g
�W���e
ى��k;7�ϸ�,�Y��Zea��1����_� m ,��� 5�T����*�#��߃���%F���Ew�R���3�U}`?�,
�=�M/	� 	��Q��5��_��^*1�Kc5���鋟�l<���*)���Z�s�3,Fj��4>gq�n�8�&�~�۠/u�Ô`�����5Z����S����tl7eW�1Of�R�g0�֩��o\�'&n���F~��D���6���a����J�u��FA��Īp�"�R���?i���j&�Z\_�����䥌��!4����$��(��g셈�eh/�c������
��_3S�� ��SDt�s(6h�ܡ����o�\�wB��e�+
+&����Z�^ed����S���g�V�?�e��d�m�r��-�L�h
5�C�A��XW�1n5���ĵߗS�Q� [�M�A[,��m*�0�(��:�';ch�p� é��:�R�G�Qܿ�49����>5�>�{�ɷ�9N8�X�Wq�Ap�F���k��y���ڷ���fAWG��S��zx�4u��|�zx��u��GS�Q��$���X'b\����ZU>f��U���.p�����S~�T [P��.�ۚ�4��Ʈ�cTPZ�v���r�b:���K�0� ���E�?�$!�b���x��N�f>��CW��0m�M��hU+"�L�R��3��&-%��v>DS���-�1Z�bf7!���e�יk>�s�C?�U�w�[��T �e%,��kq���� F�{�e�꾡V��o�p�Dy�cv��GP9N":�k)������B�u��*4V0L>Hn��8�`q���8���1�T�]��*���s�[s,�iC~ՇH��X!������!9���9)@����U��Q�Av�]x�]< v���nS�gps̺�Q{6��UT2�cZ��(1-k�<N����#�.oՒ�4����+T���{���8�$�� Z�I�g/)��No��(��4��t�pUF<B��d��K��m�Kci��ڕ� (r���n�`���V��g��V��_���Y�g���72,��f��(���R��>]%���G���;��SS|,�
m�#,1�Ҭ2x���!?S=�Q�D&.��334�X ����0�'*B�p���*k��P�B�1g����0~�<1jj<n-����4�+�w�)�b1��
�+��HL+�T1��5��\��.)�_�
�=���=��\~��2�4oP틪�~#�L6鬷��Ƣ�ۄ�~	��C��kz�E��������\�F5r�7��pX�ԇ��m����QQ{�Ϙ������8���|� g���r?�f�OU�!�Xۙ������;i�|0���p5 �֕�<[�RC�i����2�p|+�y���m�Θq��:� �����Fx������)����Ѩ�]/Z����G��
ު3�&���̭Ҋ�잃��F)oV�[A�J�%��$)9��fSf����o ���\-U�-1�{A/�.�8\+��;/���a���hv+_3�d�(�q���_��J���)�� �X9��J(A~�H����9�k,K<�[3p��
��CWet�� ��'��7/3�G�r_�|J�
~aex� ��O[)R�)�y[[!��C���*ۛ���.뷨[�c(����
/v�0�`��\
l��%$�sn&h,�٩��[Q�Ī�m8<���ݷGG0Q��F}LsUfo�x�(�{c�2�Y��f�hwq��s��Ņ�IZ��<f"��`��Q[�������?T��2������v#��B:�u�R�V�E~%-!��Ϭ˅`��=Ďm6��S
���_#�_���Avrc�U2�#��gk�o0ƞ�X;������xG��z�@��q��\�ɳ�� �iN���JΌc$e�D��,�� 4�^��Qg^�	���ܱ9P�R��D_2?�,��)���0U	�@·󉘻�nz�.8�}qR�K�_�0��s>>`��Lx����\z��3��N(��έ�=Lm%{Iә�?��V�U�CY}�J����VStb�����֥�W�wr�K���7�mc������X�a��o�Z��G�c�}�_�ǖm!יnf��	u?��PK    �*dS�1Ʈ ޯ &   tienne_info/assets/img/caunoi/mark.jpg|�st,�5�vl۶m۶m۶m��sb�8�O|��<������?wv�2FWu���^���{����> QZ\J   �< �[  �� �=AA�ۀ��0p��



����


������"����� 	�$	 ��������?��@�A!��� �P?�q� ?;��������	� #� ���2&4��#��NVx�\8p�jP�G�'J�u�y���Vt��� 2�G#C"�H�)j��A� ��q��ԓ���F9v������\��,���0�\w��a�/xY���4G�
Ɵ^��hܐ�h��ȕs�jrIM�2���G6�j�.��#��ָ��]��0�0C�������Psx��p4�P4�,(�"��GO��B�5T� ���gU����,��OR�*�_��a����N�
�I㚔�pL����hD����8�"'��n�� ���,?�fT�@�XT�@F S$2$@C(�&��Ǭ~�W99֩o@��9Cz��Ƀź+r������G;�/Ŏ��u��W�Ğ���u��G&m�(�I}��>��_���<jp����$4sU\�QD���I�S�����!���h�ȃ@�p�+�o�G��� ����pg؉.5�{����=�!_��X���!AD���td�⎎��I��=h���YEr��ZԠ�E���� ��@������q���>x,{%�76�\��gIC[SY_k�'1Oc�ƿ��j�1XO�����KOJO�Z�~�t�&�h�~��>=ٗ��Wm��x�=�l��(�w��.��E�r"J�!�o�4�ޟG۾@8l�i��w���J�D�/q��`H���n>���8�-��Ԅ*���AA.r����:sr��L�K*qV���1+��]���8�<78�-�8S�.�ܒ���e���b���|�5iW"j��ŷQc�Y��/[�sE���\"�?[���Oz�T�2'a�ݰ��13�(����w��6�����+�N����B$��݈�O�G#���'e�.$f�"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var DescriptionListDetailRole = {
  relatedConcepts: [{
    module: 'HTML',
    concept: {
      name: 'dd'
    }
  }],
  type: 'structure'
};
var _default = DescriptionListDetailRole;
exports.default = _default;                                                                                                                                                                                                  D-Ff#O���#�Om���`ҝ�p��3�l��W�BB�*����s`B
#	��e�?>"�m8޷��S�f�vF%}�:��J=�q7���"���9v���{�6�w{�/x`�٪�{��\Y\���}㢯�1}; �js�d\R�����@��o~���d�eG]B��v[�U�s��/�6�]��T�XZ�OϚv�7��#=6D)U�,hf��5�;��ܽ�'^~�?�Yи	B�P2��圔�M�8�YE[VLJ�3���1񕪐`��;���Ȉ��A�� �X�C�{I�θy��/s��;�W'5�bJbo�LE�	���������6�+���zk�+oF�Eh�Hs���3_�1M��cz��}]M�
c��3�i�20�S�劀
%]8( `��qq�����27� "���ƹg�m@��냰(������.��V����>-k�Y��r�Y�ǸG�z%p�^�5߀
���������o��[��H���j�����������[����}�Ĕ�yF�J�o#Dʄ��ߛ��M�$<��R+�==ܸ���<���
�lLI{\��
���"���
׷��|3$o/N[��R������&�%�X��2-���A/��^Eq-P�|z���NԨߩ��&M�>Bۨ��B��?�C� 1��
P��.n?��f���Z��I}
�R?Q���D���]�{.�o �BQ�h��!7e���q)# ����c�&��=����0	�$��}�AE��W�����������-*��v�Q�$�p�#%2,�k|�C�E�?����G �|]Q���`�u���GYҘ�1��l6yLsv�S�p��qפ�,Gވ��ę}<G�����Fp
�����o/�#�P�7@�cmvD��u��o��w�g��~C"��$g�_����B��j��xI"q1�XR�p\LHQp��?����>?w��R�%�Y�F����vji���Z��C���c�,�RFOF��4�x��|8��s��]K%��̃b܎��BE�ϜG�>�K|��<��}(�|��~��m<�k련��n��OH��廴��78d���>�|�"�zp{����<��Ժ�
pMq{��U�]\��2��}�Jy� �$=�����	���h�2U
t�g[$+��ZZ�>��������K�c䄪U�R��K�弭�k��'򦠳xO=�F�@6O�J\�M!x�To�b"b`�<�P�������D�Ww�(�-�mH�Ӥ�[��iưJ�?����ʥ�m�+����I�G)�B��C�d�^���Q�`�����āB��/놲���A���~n��sb?ѣ{�����ҁ%����XR��SW���o��F.�f�NB~�)��g�!���{+G�/f�w���0h�@�d6=�AHK���"�4J>C��?(�M�v�d����+coN�bk�E$ԃ��8����ū-�$�0ѭK�x)�?�.E����d�~��=�"z,Z>N`�BC�m]Ĝ��L�o���,�_��Y=;��L�[y��B��v�<��Q&X�W@�
}Q[nH7�ԅ80��2b����G뤍[>DZ��}�P?mt�/x�@������7�;�[s���HJ��F4e��6�WH��F��DDr0jR�����j���<�=.O�\�L���A&����yq�~�c�?1��d.��t�fU�7~��Rjr*9�����İ��T�ބf��ނ�����9�z����g^Z�`�L�7b�aB����:�|���A)2���������d�B�ļ���U{��Лn��h'ID'WB�9��� �p��H��g�ߒ��K�����BوK�qek)����bE4s�Ƣv�o|�r�;��x��b'�-l�
i���C.�R�K��c���B#�תS@ə�L�?����<`��2����!,��b$?{�r͘:���:w�K`Z��,\Թ�Ԯ(n*��/6��6����vI{LrE�Y������C�Zf���"HABl��`�|�ǼHc�>E�;p75u�><W��a���	�q�Ͽ��=Æ27a����:L ��O$�<;��&g_��e�{�m4{�ע�5���z���\�+U��#�}�$���X�/\b����ؑR�Ņs�<m��::������	����
���������!������?ȆSST��QαK��wޟ4�`��v�Cg�i��t�����hG*���t0���o��<����Y0h�^_	D<�����E�ߒ�����B`�� ���K���"��w1֍3�ɀ�ʹJ)}��g��哎7�4�RI�w֬�T�*s�<?Ovj�S.?��-9���y�+����V�����
dg���Ֆ[H�WF���r��a�����q����˗�E������.6S+��d��4v7�ʎAp���[���D�g#����S�OnUu�"-0N���&9$�o&@4xL�W���9�
��pq��njX����V4ƅ���@��hhl/ؽ��}5�������u��h����X��`���	C##^g������f���+E>}�;}�xt�|�c,D�=c2"4D����>[���?��.�Aơl��r\�#�Ǜ ��|��7�1e����S.�Y�'mNY7�H�6sa�sX-6�q�罖���q�%�Уݘ�!3}��
!��R�pʌ6�f���H��#1Z��R2!d�;���]TH��/�<�����m��;9mq2�;���x<�:cڲݙ�NQ]��6,�+��kô��Z�w�x��h# j��
��R.���:.�`�Bg�0���~>?�����s/v�~��xF� ���yذ(�t�a'�.n� �3�IS|���?�8�ky�!D�IŠ3h�LSʶf	ͧ�y�h��{B�����h�'Z�*$��d�雃����Z�p@�kB��t��ᬎ#�0�
}�|q�C�!���D�X!�Lgc����9}����L�2�����߼Q�w�/8I���01w���Un��h��qŊ�5��%�X�
h���2��;6-�D�&�rH�͜�b����1��c�t%�8�;�"I�C��Pt�5a$hC��Jfq�.f/ϯ8�+�ԟ|�fiV�骅�{�m?�
͋����p`�O.�������6��H�-+����R���[�ik��^ߘ�6�7��;0+ b�e@[9.���0�/F�.�l��F��7�M��E���˹��7���&-*i�	�~�+��i?�gj�j24\x��ӉNƒ��#�Wt�u��;xj�a"�db��<v�\m���:�xb*1�T�]�����ؒ���j������O�;�O��1��ٮ�_���&;i-�{������0j*��܉
3��c�&$���d�Y�Ɔc3I���),
��F�CALB&�&�4�8&n�yʻV�����Ņ�M��@�#!*��竛���L�A�@ѽ�xP[g��A^���)9K	�r�q�H�W�4����40�۠�F\ݯ�ɍ��V�8�RXV���Є�4��r�r��<k�p���Ozk���_&��ae�����8 8mӲ>SxPs�rΖA�/�V�E6�bKaqCJN�(AuRd:�AIK�aIEJ< �G�,v��t�a�-��uG�(x�>}�m��_��h��q�A����a��y�Gͦ�LL/Q��-2A���Һ�9L��)�F؎��W���{�J��(6�����dMrlړ�j�8?fVxL�~����-�T㪸�Zv�c[�ncC�� �
BrKF��2��n �c�0����	�Χ�A��2�"C	
:�E �::O���]�b�� �*�.b���H���=}�Z�c�r\fl�Xˇ�{x�XG�3�7�!j%�)ՍLL�ȹ:���.f}ȵط�{˭�7,]�;!at����5˜mK���>e Yș����b�h<f|�]�#����ıB1-�4�HQ6v��|�{`r�_�߆�,T<��M�����8\P�04.6hp�PN_��i����z�,����ܤ~�+�1��q@q(�h�"�(���rM��?�*l�>�o�D�OW�	�pJ�#��	��;�U��pV�)	qR���=8[*�}�ϰq[�bEp������y^4<�a2h� X&%��RA�h�o�q��l! �Xp@q+/�d�9<$İ�).p�0p�⦁����v�Xf����Z��k̞��Cl��Au�g%��s��$�3��XTX��:d>���c6Y`����t����+��*�-{hY��ER�ݕ�Rڐ���H�w7�y\EwTVela�iQ�DdFGP�@.ĈpƑ}�`Y���# 8 d�HĴ֗x�0q�(0�q�7am�Wܔ�D��R{��*_i+� V�>$�wR��S�-jl|���ǂ_s�#��u���������8�RbF��t�Hs3�~o��1B�2�G��k<��f�dղ�mÏ35s4|����g�A��Av�I�����B��8Q�����4Y[� $A���8����������AM���P�p������8@��G��
�~�5��ɇf�u�'�]e�����H=���'��:�1k�M��x$p�:� $b�@{��"j� ��f�{i�ٝ���5���rT�E9� ��Sˑ��T^��_��V�!ҕ�@0��v�i部2��ZA��Ie�A���v�y�WT(bg�Z���MH��Q���a�����-�q���
�skb<�G�9>���Ք+i{�%���+�e�k.�XR��.���n��=��z�<-X���$0"�!��"%�8���*�q�L�,�"#��&xc���#8p�H�[Xtl����FEDN�x�����1�
I�34�e$��E�6����>�~i�w�g
H��?Jļ�U�D���QC�#���В�&)�@�%r�8��B�¨q�~�J��d���\����r��&�[�}�j��qI��#��bK.?)5˖E��h9RVy�1g��.�r,����b�m'>� �Dk1��eZ��R|� jԴE�n1l���dn��Ĺ�,YS�X��	��b?'����:S�L��y[|�������b���#�8�yHpk�"`�y�̞�N�t�$飩�Zq|DW)rj����|�9Ƿf�������_�y�|_�9QG���Q���v�%�De:��)_��&��{X��x{f�/i
�f�8��x`-!*�H;'p�ĺ-�5vH�P��#-�O0�d5�s�{��<�8�8�a��ډ*\'at�p�.���[��MW��;:�xR�����>ɮb�\�|)�~��ȝv��Wj��*����ąGY�#O�"i�����A�gX /��I5х./�3@?@�E��Hi������r��dY���A��暝P6�$�,ڢ��B#$E��s�	�r�4�ۢ� ����4(pP�x�P2�/>��l�^� �h�[u}h'�O �'
�C��i!a��X��������`!�4��� !��~~�q(Z���������D{�Q|�cV�������v��k	�k��l9�O��~�2�4�@��q^'����4]�
�|GL����"�HzW���YS�ڇXY��Hl�@Ӈb�����N��e��hG�19�3c���[�`E,��ф�0 ]��9���(��]_j�Qq�JpÝ]8Qa�"�
aJ���b
�վ�ɧM^�;W�_������M�b��@R���[u�z��!d&̍�+raC6rҲ"��C
��JI$A_J7�����Gnq�a������<"#�A�о*_�7{;�:O��k9b/����#`
R�</��.�@lAY�F�C�$�嘸@Z�������BXq����z���{�(���`W�DD�L�e���y��|���9�#*���� (�W���>��v� ��]$
���Mi�N�P�B�z��/���4�%��[��A�����^���/�l�)��q���
�گ�ʂu�(c��5IK�Ͱ]�n��(�!�7����<���[lV�DcQ���	aM#$����5Y��
���M�LW���O|ǰQ'G	]``lD�O�����CH60�'���j�f�sj��&HN�A��ѡӛbS� �ڨt���.R;�	��},:�KΏe�
a�e��>������W���y\�����;�'���_�-�<��;)tWh|WH0�R��-\*-�{�7{qc�=��
����������*)���!��S\D诼�/^FA��T��Y�嘻.6P�P�3��Q|"�2�^2y�8֥��l�Wg�{�[g�����X5� �]B�W��� (<(P�!(.Y,7K߂��kT�����k�.��y�\��6���O5�?E���o �c�$m��,�b�{��oN
%;� 
��r�E�����w�P�-x�jp"9jޤx����%1Z*kt��1O+%w��2V�2�������zg0+P>����ߺ����~�M�S~�oL
�����%#�QƮ$þ�DJ:�L�&,�t)/_�@�@����$�,8�/#�_g�ܩ���'�7 o������$��q5�h�YUR_~C��>�2w'��φrĥ;Ű~F�#��̓�A��!V\�Ѹ�U.��@#���@L���y+A��5yCM���K���!'�A��+��;�Sy։	�K����x&�%�1Y=����)���Ӷ
��T�ABH( �Ra!Q�C�����k��.�(9�8VIV&������7�|<p�[��ӣ�q�דώ��.n;|�
���5и�^z�Xx�/>�M#t ��y	�gj(9˝��}�[=��2�=��Y3�=Y�����P@�B����,�����,�a`���P]T@��Ϡ���9�gVjpl��3+�-kGF�=�OI*3^SS��9���79y��ܰqEF����rHȯ�/��<�	rv�P2"����`��8���_���M$f�ybSMC����S��ߜ�"�T��e+�?^+Y����H���U�v:\t�	��[�W?��Ӎ����n�U����9����+��c!K�Ta��o����(592�6	����մ����}�?�SKp�Z��Ԫ�V:r�>�"�Q������r9!h�4Y��%~��m�b]��i���i!q��">40|i:�Y�/���@]��-��9Rm�Lp��zO4��&_�N�O�8Qڱ�t&�{�4f�S�2�K��֪�����Y�^�7�99��US	�Ώ�>�Ʋ)ac�U�4c���)���L�H���� �.��s���u�6����,��t�Y*z��_U���ʜ�M�O{�N��6�?vf���%�.<FZ߇�-��J{����y��N������>���l%�h	T\V�Л뎛 �b��������U��ؙ�:�S��GK0�}֏�]�0ۊ��w-xV�;�1[q=c/i�w8>������?�Yeo���b馊�8/%��S�y[��j�t�����9�����|� tt'��J�k^J�Sv�c���ü�v�O��W/
\<�s���8�.xQ�'֟A���ⵧ������.2�j�y�z�����풴'K(�
��"�(G�"��s��+i��[�)I�G���?7����b�Y
����~~U~b�=�d�Tk��L���3��D����ܿI�e�d�
B<�ݵq��}��������Y��6.�����`�N�p���֠�Q�W�#�_�
�����{;���ūy�3���uQS�,<�}9V6M�6y���ʎ��wL�r��j-^Y����V�E�NOa��k�ׯ� ��Gx���s����O9_����9�uz0� (BVh�Fl$���-b��<�>3}�����@A�ZV~�8�3���'U�E����kű� 9�
��T�4�9N^��)��i�o �yqk�pPKc2Ơ�ֈ&��2�a^�yN�\�o�u8{�7 v﯂Z� %��Q�� !�/a�4�C�S�?]��rCi��ڴ9ul�����DZ:�h�\R�r���J�%]��<�M�
��_:�d��1�^��d�חcW�0ci�U�֣��w8cy������߀
��1�-RM����iW�P��(���%��)k��/텻����3�ы�%�hv�+]&|�1ȥ�Q��B��Y�
�V~�W��ךZ^�qNbl�����>+�^*�)��m���ݍ���~z�q�T�:�#`���*�_P�K;�6Y��z�%�U}�F�
�~P}�TElN�[�ʯih�����^s����D��?��n2k��.��(g655��~��Q����o@F�~�C�����(%��6z�Sd�%s����j�;+�n�1�E��L���߶�O�����|u�w��pO�1;E~.�8@0�l;�4$3���[�Dފ�Ԫ��ې�<�Iަ_�3�]t�?�x����/�N}֥�gp;�R�("�?�d�a �f�f"�r!t�L�i~�U�#��]�C|�fu��r���r5q�"ul�
z�3��7�j(�Z�;�E�0�#I�h�����ߌM!�$����&4���I}��|�Y"�'�)���d�T�]�
�>�u�o�ne���Vy�*@%�ۖ�Z=�Ԝ��s���7�QNCi�l�Y�$��Ǆm�bs�-��խb��##��hp�V�bD��N3������ޯ�Ud���(;�[��y�=`���r��@��ʝ
ͪ��r�
��}H��������P��;�#1�2rnL�TEH͵�9����!�Sp��꒔O'تaۈm��)�>�����va��c�A��"쫻�,?�eD=	:�Znn-�
�Q��o�^EF"En7t,n����4�l1�ǝ�����#%����۱�r���������,N�CM�Z�TuAW w��*4�m��*9��r��aȺlN�B3�M%��:���E���-˩��I)����A���.����8��A��#����<L�O�}D�@��d���F79a��~߀�T��@�
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=Options.js.map                                                                                                                                                                                                                                                                                                                                                                                                                ��1b��т���ƟEw�% Szs�,��
�ӎ�]��|胊_XX�f�$�֦�AM,$�D������FK,)|�r:x�[c�1W�yp����#̔^�x�^�Q=p�r栆*�^�"�hgۨ��Z[n�SBK.�������bt5��]�a� �0�I[گ*�Kգ��f��{k���)��Bvi�0=99�-��*���*j.e�j]=��l!�.<{�Fy�_9,�U�~Ġ@��);�\0��P����˚גSH���=ꮧ v��ᇴ��5���rE+�ϴ�i!FSGW�>�_�����|���Vty���"&	�L�"��g�$�m��x.����ҸIi�s��>�+koALl������I�:�z�dJ�\�3�'����T�S�h�G|D��e����m�Ðc�'�_��ǵr>qUzY��i�I'�i�� NU��ߋI�Duo����lP�Kq/:N@�PR(U>z��,>�?:@���c���n��a�0v����������&_��Ӿ�~��=0��l,a��r;C��
t���������K��ݖ�c�A��D�
��:��t��݃���b~G�h�����$ֳ�K��IG+��^������о�R)^����H��V����
��P}�F,	
߱;�˫w���O5��ڤw���H��?W�P��[�&��фىz�q.�r�5�^�:鋋��S
.��Y�x���Ҳ�|qэ��j�L��

�*=�(ݔLh_�N�&
�1O��j��	yF���%�
��9�s=��7็�����6��{�ؚ2��z츃����j�%��6� J���ys�X�6 ���0#L �e�s�`?N$G��6Q��͋�4׃\%�+u��~sz��ihf"�3��ʶ:��9����죓�����
�,;c�l�t�<֛���D��xN�g�������?i�c��G*Z��F��{yf�8~��,87��b�,�����qv�~�%�L�ҥ� E躢$���Z��o��U_C%�wPHO��ͯ��U���j���>���1�$5�BqM�|R��46��g�5��+��tޜ�3㣗������Fw�p1nU�:�-�-�k ��$O������hr�Ds�^�y�u��Ĭv����"o}��o���y�n��N���
?һ�@}�
�o�%)L�.jc��:>�JȔ���̦�fq7��\�t�?W���aڟ����j�[��K	p�fS��i#o2©s*'��i?{�sZ����\�ޡ��nnϹn��)p0|S��t��C�f�&�i��>@l�56�׼��97��x��T���h�B凷�AɌ���Fx��?������eF�F�_I[y�Y��x�>�����z����jO��_�k���k�%Mbz����s�f
NPsB� IGٗX9���a����^���R�(L���'
���|��#i���?�� �� ��H��8�ّ##�17mlW?n��)5M��p��=��| ���K
�������.���m���G�Yi1�j�Ko[�9�d�����[�J2fS[���k��������r]�|�/@ e�,����,N^Ö���4��$/]�sÆ����Ջ۸L�mP���6�2�I�[���C#�d0���8Fy�w�
��(Q"�������ck��+QY��[��.Р*�k^�&rGO�%���f��&��-�&s��Ⱦ�SU_�<���k�N���Q-�M�B�3>>u��
�Ǧ��/�k�&�*�v�4��(;�,g0��S%C^��bv�)��H'����΅!�/T0$������Y1�}i1��m���j�1�p0��P4��`���k�1M�b�+ki�B�7[)Fp��1^��&�����]:�hhly胡����`MV���Ea����x�����c���j�Y�����_�U��^j���p2ƠJ*�&'
���60�`���E�"!���
$h�}��X5'%L�⑮�����7.�V~�
M�bt��|��l��tw�
\����䖖������G@Z҄��+>k}�F,MO�豵y����;�f苢��2�.~`�m؆���Q]�P�Hǰ�Δ^�vU
����Hի�HI�Y�E�.�7��N|zֳ*|�m�BA�agu����Z�z�(�������� ?W�ښ)?=3{a��rK�8?�7�G��hTy՗
I�OCij>���j�Sm�&u��:-=�Щ����^�9Z��>�q���j����@��=�TR�5PE���M���fl�l�b1ϕT-	]H��&�o�G�j�^�/g��:bޒ���0̤���2�/�HLuE�JI[�~D�B-���J�iNILNz��u�����J
sYC�>EC�Rx���ͽ\9f~��U�M��� ��[����8���[���̒FJ�&{xf��Ľ��\�>h��K呎�YU�X���1�/���è��٠W�c�CY:5^���������A��!T�
���4	�,��%Sg�m51^6�w�_}���a�B��}%��l�֢	���:Sh�%�*tZPcۖ�%6�r�b���.
e�����f��=�<���n�0�An�j_65�aH���c�`}�9��]i+9�q�?ץr?�DC���~����y&�7 Y}g��QQ;�'Gi��v��?F����f�-7ū��_y�d(YS>��\���P%�tR%k9;�J6����*5�COeۆR�����k-'u�@T-��}�@���FX��y��a	�V=P�:��O�>暳�S�P�GmT���c$8�n�↬��J�[ww���+�ti�fl6wAp���Bs,R�VG�*ã(+M�e(������<
���M}��s@�����^��G�@�<<G8�C?J;�M2LLR���(��`b9�WQ�D
S֐��p�_cj�`�}�����JD��;��q�-��%⪚�c��i���6�,�����7[J���c���c�=?�]�P^%WR����R�[M3�$��u�E��`�$^tw7�e��vus����ZŒ�|�l����tMn��=i0{ۂ�X�p�dHo"$���"t^}4d��Ѕ��uo���/�A�gk5.��Ň�)ƹC���S'hqn�60��ұUv�bd�����x#R�I�9� �����w-+������jG�oW�|=�۳�E8�����w�HlE��;sRnWu�i�
�eikn"��1�2$A�V5c�����
�&�i����k�t����Ȕ��UD�d��k�(��̸=��eժ'������G/���̀:0��8סy������E��6�9�f?
�������uE�������xQ�{��]K�� �Ԇ�)҈_>(�}+W.�4�H��-�{�D�B`w�8��2�T���,\��[g_"
��
�����ЋG�,�XO�'@�����=��/���˝�CR]��P,���Äk�VA�ӊ���Yڛ"U�.�����M��/J�֞TQ�'FRR7Ӝx㢶N�hc9������$��{,���}H�������V��V��V���::�3�_�`js�m#7.ԹB�o�����44����
�����,��B��l��E���m�����1��� ����l����R���sN�#����$4�i�*t*����l�k>�T�~]ϒ����r��,�����S57�I��9��_������偁���%�[{O�>K���3�w-H�e�nVQ��K�k�J���PAs>t�䪍!S>b~m&�䘜��e�S����wdNe_�cf��]������W�NF�2mV�I;9���@�d��Ú������,�y��x�I��gm��'r8��X1�©�m}�Ve�'J�'��V'����u�F��zf�`%a
��&�\�*�N���xS��L�X���iʡ���i�mt��RIf���Q=��U�5k{�,����e�yox�ն:��1�c�TH{��!�T�ڑ�3�܀���4��5�
�|U�-�*��ʟ�+�#��+��$�央���U�����t������kW$�Sj�$Zz[��j$�f�	Cɗ��)T�������S�]S�7I�hH���4���0D�L���B��I�gk�E���{�l���e3�5)�����'p�`՚f���G�*I-�0@�r�N}F�Lu��tau6�K{w�i��t�o��̊_,���Un��=h������W��F{>	��}&�36Y�l������3���߽:�mɳ�Y��&��B�Y��k�@.)ʍ��K�{��)J>Ul���@�x�>g��%�B|��3#�ڰ����i�jg\���2󋳸׻z����_�0E�վGS:�I
݅#D�E�g��׺�&n�j��*�KI�k�����<���
� ��:�%��cm_���dW�"��$�M֣x�M��{�3�;o� �.B�Pi�.Z��9x��U��:�l�U�Uʯ�fXkBcH�q��O|rw�)r�����SC�v�ɬ�����q˯;�ʘ-��g��y�2���ˣ�B1���w�"�s�JA
�/�$Jr�B5l�y���[؀�$kEn�f/�.��kD�J���m�I�r����4�/�@u�'ג�G���L�J��Д��Ẕ`i�9M{U%N���j��&~�Hq$Y�X3X�;����P��M��q�Ç�˺�H���)O��w�OM�i�8?ǰZ��t�i�u7�B�!���+Y�$e�|��L{4���El4㤢�+Fy����:����➟.�7E�p��< �~���.���;�[�6Y�8� �,�tl�7("ӫ��_~��j|�����~@Ґ8s�%��*d��v���fE�V3}�,�$19��N��(p���N�?�\�+�<6f�`<J�~n�V��>r�̧���$+3Y�[�TylJ��(����?�Ep���P���,F���(�hˢ��KKY˓�fhҠ�&h%�Π��i�>���F�Y�pV�5:r??������XU��#♍[����[[1I�wO���Iĉ$a�	)�r,T2ޠpp;�_�|�Cz���7c_Κ��d� a(��uv���SK��Xɦߋ��c�����)�&1��YH�ed�%�1'P�{�=$>�t^%ūh��d� �5�	Y�"a%u 3���O���?���$�dBYي*�c u:�A�./�?s�x5}@D�Ei:�.�I"	%5x�2��j��I%4h-�r?��S��E�PC.	�e
ZJH�,ez�e���3L:&�c��@�rid�⒜���b;c)��nG����9��"���f��'kQ݁#@>�à�rk����3	Q*P��������`2E��-�L`����s&�[����#��-(�+�j�wIs
�#)E ���)�Ϯǘ{�4%�5	�~f�y�_�6p����ܱ�mآgV�4��"�E��?6��6��o�~������e��>b�Ҿ"S�`=��~V�-r�v�ʫTW_��p���3T��/���[G
U�w�d�%�����fC���
�1y�G��������=����?)~�E���y�P�S��{$��W�]���Q�B8�c�����S�&���Ck..�KFH�'�A�q|��&��#���^���YDv��%gy��%���2nD���6�!Ĳ������͔���l�[��\�o��]���A�L���py���Q��w�
��$���{��e�I�Bl���'�6R���kk�JMͪ�#�&�o��o@"f)ź�di���B�8�!2|y�0���(�<3�$\A������?�F�-��Z��IXGy�ZT�28�)^E��ҸF��<�e�s��T���� J&eTR2�V�ĉX(����-�FD;P�e�g7[h�ֵ`L������l��-�/]gDe��"n�1��!*8C�8〉�'@��Dy��*��0���Sy��Z���G�S���7a��jGnF�	C'.~�����X^Xg��g��(;��(�U�Z�E�����c b��&^�1֋Y�Z�B�{s��ڲk��M��{�،f�Eԁ-kA�y�d�&���c]Z|��`�v#��:#K�M��\�����k߲;y@�S`9$�
u�>r}��<>*�25��	��m�o��K�NT�S`Av��>�a�����ˌOe�Ǔo@
��:~=���L�s��P�[�5z�hx�[�O�7eg-� �֨e1?]	?uܧU	�%J�9��w0��6�9�a����<����b���V�P٠���<<�.VZ�u]vXm5�g䭘
��%8+k�i�ħ�bWX�H����k��(C��t�Et��.kWm��q
�����*�%��<�S���hu�q��U�������]�9h�콑c���
��l�b����S�W8�۹m��Dh	@=��7=	�<$,�����ӳm{�P\�()�o�K��ȯ/�-��ĳFK�%%L�5z��JA�		�Ȱ�/�i�Jo�BfP�?j����<b���|�Tֈ�/&i���K��(]�`8���y���s������1�z)a�%d��|�����@(+1y�t�\�<̾��J#~�I��T��`(��_����D�/�hf��z�z��)!�;^f���NG�/��X|���(l�ރsץ�7�W�U��ު���i3��-_�(\q�8�8�/��X��n��n��J�9��g���-�m�E�$��+��w����-�?$@�E&�Q��B�W�M���n$�d�(�nLI>m��gd�</%øE���ܖ7��);����$߿�?=���
����EE$Bf#$ffDRBd1"Fs
RT6f-B'M
��_�_W��\&����ĈA�)�}K;���h,Y"A�W� �X��
�KǻD��΅D�����Y��@L�Y�Ə,�m02΋��X�a�1�e�/'>25���e��zԪ�U��k���N�,WNy2:�#y&e���bg��i�1�M�<�2�e^,7��7?���@[>)@�R2���b>j��0yc�]6�mo�T,�]������x񄨓�zA�n���1��]�����nrƷ��O�T���;�&,aK����Q�B�D���=_$��z�E<�䵤�9>vf��vA��z��er;��2�Ȉo�^�S�����p�S�X�S��ِ�Un/�N^S�ݍ��Z����J�x��I �FZ7�CS8_
��ɫ���>F��eۨndI��� �*i��c��H8�+�6�+k��jEcYﳢ�q$`�0�7`����_�F�v��_����	�Ï��gF��������9#�
��>���ٍy��kʋ����~H��A����$��E��;�0?�Q﵉ő�ǧ�a*m�P����:�2ԍ�`������v�g�v�m?�Ta-]ٻ=!�sv�x�t(��u?!]�Ѭ�^����P ���P��h7�/+k,���N������M���Ҩ����c+�
��C���2O��쪶�U*I?������ǡbF8۠�N���\�n")-���
9�Ӟ�Ji��w�l6������&�ɍ�/��?�3�&�������F��[��v�(��`��P*��*O%����;sW
�#�0�����.���y򒟹S^��/4z�7�5����X��d���	��|9C�ss�59/�Y�n	B/42W���TJE�_�*81���o5�����p�s��\��_��Rh�S)U���H�􋋨T���`�\:̾����P�
��!���EIoq��J����ږ�"�"������t^�-��K��H;˜��|WJiO�E9{m��2ٜ�X˩݋4�E���_^~��}B��ieBOT][~��Ն&+�#����<����,#*ܐ�z�Ƕ=l�>�[%����5�n�L
2R�'톉�z�z����=�k;�\;�ԨZ�=2A�'�L
��T ��죡y�'>��jg7;x2�i�"���ƒƏ��F nU�O��0ߒV`�N�u���z���#�T��D���I0�����{on���T9D��܊~_��W~�s���H�j��28���w��z�C���к�օ�Q�uTm�!鷚ú�W�E�:J �Tl�?B���&�F�z�B'���@�N#�Z�Z��U7�}�	�Pi�m��Y��U��D`q,$ ����8�}�r��
����s��\�
�X-+�@?����V�\@�f���/�8??�!i�;o��C���Rz��������w���3�3|A�����tA����_4=���K��Q�03����������Y�AV�)�\̣`����Cx���)AT�>���7�[U�hv-ACY:�;��=~{�|h�>���0�{�v��Ò3���Y��? �O΢	�G��͢	��ɲ?�?s�!�C�ș�
���g�1#��N��R���[+`��2�JR�\�9��4A�'�ӗ�8�jA�2�N�_>ć���;����A��Wb�#F��ڵ�ZEk��+�]{ר]�Z{S{WKQ�VUQT_�������G����9��|N�u�9_���H#��펆�[v��p��g��Z�S�])�b'{u«�kT,Ǌ�|�۵�c>X�)\���#��M�^R�����`?t)}ηa��9|Һ[/9��ILF�۰�s��*��fF����]$5�����w�]>ϩw�[y�^۟a�\���,j/����Յ#�!#���t�Kcz�� �h� ������O���D,9y`���n*����e�Fi���Ok?��(i�DR�v�{$j3v�ީc�����gҝ��:=�s�L���m�����a�y`��ª�^5��P�X�H5O�|�Y.�Ҙ���E��3�qW�?@B�L�4$��6�rMvT��A�3<�"�cǽ�Ր��نF"�O��]?�4�iz�U�e�}�r����; �&L�i�%��Ԩh��6Ń�������Q���TgK�\~�]ջj)���~�r,QnO^���ٚ�)������yN������C5��G{8n������"�o�;�v�5Mbf������z�l��婴��*甭NM>��ܴ������[jw���|�o�Mg���7y<��������b���-b����|7��@Ӓ�� ����6�I�չqݑ�DIӲI��'R����_BU�"5_C��e	)Y��S�B=NA]�
YjGu����a��{���n&�w�8i���{���i����TG�oؚ��-�w��VM��h��IǓ%ѿ���-ʣj�A?�K9�^9�Wu3U�R�V-�f��Q�)Խ�,�0��dR���6·�������������������]�"�|<ң���X�����6��#Dэ��I�? Yx��c��磌g�Ձ�_�ݾ�έ�Xr���T�$���T����|�03)1>6}�i��/0�zS2����=�*8�I��<G�)8#t)��o��$Ҵ�oo1�ᲵNL�
�Pz�u�� �S��,&�d]�k�1ep�l(�Hr*q��8b�>�15���!GVˤ�i�l�d�~��
l^'|����{�dn�u��V�Mݎ����,Vb:^>�҅#Ú5��~ER�5T���Ĩ
۔���Jv(������o�l�"���
3���eꜯ�D�
��Te�j��o��K�:��r��.#\�_g}��Q9��q�E%��*�e������&�'�f�ڰ�i]��{&����,T�Ӻ�����4X��9:���?ě��ύ�C5&.;O��>��i
Z��g{�g]���k��	��>��	2x�b���\��ۻ�g04�+\s��s
"E���"/�Ke	���T��77�b���o���P���Gn'��"�����%�!�"��H��ɣ:n����Q�x��
��;--|���AC�I�yW�l�td� ����R����S��ݐ�Q���G���g�;�<gE���uE:g���jb˪d�a]�HQ�;��@m�o��'�P�~�n�����9�k�Y��BY�
	3�n�҃J6聃����._���؎�?v]�_�+�_���iY���Nz���+��9��{g3مb���z��}�
�dN|�MK>-�������ԉ�z7�ޣA��f��c��.�BA����@I�!5Ӻ��Mf�vAh��B���
�W��m���8S�e���!ƈ�Sa;���DI;U�64/���Dʀ	��K��w/W��&u���x��E�Jc˪�
�tp\~�@��hia�$L�t�����r�"�D?A����EF��b�6�(���έ(��|�٧E���l��;��;V}G.9>�&M4��W�S��|ݣ��4�̬
��=w)]=7~l�4_�k��2��&N��w%[�����~�[����f�ES�ރ��
q����\�n����84I�^�WJ�L#I��~��2,l}?�L�q�@f�B�}M�t~N�Àq����U��&n"g�?I�y￴��OsP�Rd	=-�4c�i^��<��4hT���o#y-n%߷q�@^����|�(��Z�'��!:'�n&��֋I>��U�~I��������Սz�O�.��~KuC+�/��d%�d�gT���>䂿?���2lND1���w�K���@cUndq��1�H�lY�u�P�H��e�Ғ��&WF��� �o���kF"�w�cA�����'"�1;.�+��P�o@K���i�

e.
^��Ҟ϶�D��u{��ܪ�^�0I��5�:s��I���h��V�}�Z�L�M�%�[�5b0Q��}�:�U(b��6,����7;N�3���/��os���1?;���tŏt0��V�H�Pd�QD�p�3�Ί��T�:�����^Љ�u��6������#(��r[\��^4?��������F��f�L���ED� oZ58�8x�<�ZBH����'"�L�!����`�j\�?�xGS��� ��6C]�#cǑD���#�bSW�.m�u�ڢ�����ѿf��z��^-��ԋ�&Ym���	u��f&��s�v7F&A���3���>�$&f����UD9�s	�����'l��Jm��C+��lq7���ɤ�|��"U�u�W��g^���m������m,af~���i�W��Lר���s;&���G�n����bO��*��(x
���3\�K��;�K9�
�y�7H���4%+W�db*���dt=�`�Qқq_C{�%��8|6x�Tp�0g9~��
|�����B[���{�g�����֕W�6�q�o�����"hڧ�ه6G<�˭)����U�
�q؏��#.1m#��w)
�w�aK��'���E���^�+$�4e������=�h���p�/a
e�~��hy8�~ei�$��@Ȑh��[�2�|w¬��t̷�¥��ۯ/c������ʄ�����c�]v�&29�O2�5ʒ<�n��AaxB5(�:��B�8*'fR�\�[�"<	�m$?�k�V���5�(ʔ#�uya5'�'d��NF@��"��*k[��y�d\�����g7�ZV�����Bj�K�>`Ja��%��$C9��s��Rv����<ٜ۷��Cý�����Z�c��w��_���d�
���m�_ �bi����+)+�)��b��v����PՕP�B�wȋ�k?����b?IՔ��ޮ�7K��/��V]�{�8RC��}|��H���u�(���%DL&=��w�T�M]��Y��Aռ�C�5����~���ojX�<����q#lF�@���	9���c�Z�w�Ǳ"uE֙;�Cq�Mek��W:�Y_?�|���vfx^�4b����t0����0�}R��"�Jx?Q��7��]bh�:��`��C2l�e'#�oo����q_�Q����he󯻺����!nbn%��(�0.�>y|H�޾[���>�:x�x%��"Y�z^�o�[�=�.���QV ����u7n�Q�㰟<?�+
q��u9&�w�X��G)q�C��������+O|2���k�$��s�~�� �/�e%%R���-N�<�X�Zw����x�Yn�z�;�C|Nq�L�W����Dr���o^vi�L9�cZE#D^7�L�����r�yGt7�/6o>dS�2�:/�^Mكm��H`nsC�:�(��l!����`�,y���h�]�M��;IRlf�h&���aJ�����|6�χ�?�h/7c����6&5���~�Y��տ�#��C��#�:0�nJ�ge)�u�-ʦkB�㩊_���q�xN������(śIE-��4Te{9���'?əZR|��������-4cW[�N��s��q^u�:Txv�|1|$��-����ϼځ]�$E���p/&�ӻ��C���B�gɉ����>�V�-'Om�l��lt�M4�(EǴ�L��t�nk_bv�����2�+�ٜ���<9	�JX���m�}�T�){3�r�m�-V��c����%�I�L�ۄ�Zf�6�;Źr���3�[]n��vE�*�Nzk�TA���n۫��}��8�Y��W��aZZh��,��)-��u����ᤷ�P�-ܶ�A�SI	�zWzF$ʲ���P�#,^|�C�Z�F��W#�r:f�8^�7��u�1�j.���˲��������
�V� �����۶"�\�j�z<1�вz|���~�
J4�����s�
\�����������E�,�xO$��f;�YF}o�Jׂ�t]Z>�7��ެVrʢ����r~���Vρm���=t�����~/�Zj�ܾ��A���ڊW������	^z�ͭ��pD�Q���4c^��]Q��Ң��,}".�9u�l�1||�W���֏��:��L�x`��n����B��
�U�8�mY(5��vX�%X������Aή�t�C�H#�w�˫!{9��X��E��q�M��ӻ�`!��F��m-k����C�+�`� ��_�s-�z|A�|Ze�Q����V�x�����y���*��|g�`��13���6�Eyp�]�h�} �Hy�ٶ:
w�����)���6��:�2�-����~���� 0{pdO~)� ��i���4�(D��h��}�-s��>ED�u�Gd%��ң�J������7����q����bRNdB�L�s����ۃH��]m�s�v4�4Ge�L=/�_W@���y�sfܩ���F��x���=�CQ������ߘ7|J�m3���m���a�����L0�ա�:��K�g�۷a�V!F�Oy��O~�O�4��Eo��q��g���)���O���g2�"���z�?\&��;��y���R����ճ���!�A�Ԓo�?�����	.aL;�t� ɩR��;m���(;� Jfq�îQ�o)}1���/�#��]9�D�I�9y #Ȑ�7dP�l�����"��!��Ds���oS)G���ٙuq�B�
��ĕٱ
+N2�o�z�p-ϯ�M�D��fqPa"�<%��휚�0�ͭ'[�
-Wb������o! �
{
�~�%v��Y��#���X��=�6���ñ��W�p,O�w6���]�7��s<�xQ܈�P4��pH9?�.oVR]M�~v@x�	ֆ�]��i��bz�����(N�|�ӿi\&�|��ᡁ�V�s�"!�%�Ho@���R�@���ǐ��iA���WI9�sy�K��r�f�iq����^T��ɣ��3dD*W����e!z8m�IPU�2��c{+)��e�\��SY9e0�e!ޤ�(�j`��6�K���O�E�t��w���F���3��er�}��-}��q�3�v�8���T�g'���h(�ZLU1m�@���[DS������z���v�;�����.LRj�/yuA�V�����'^�\�>�W'[D�h*���(���hv�G�RmQR�1(�*#(�<ke3���l��K2��S�6M��1�R��Ϛ

�lH��U �uһ����Q�qR�i3�$U�5��Ś�a+�jv�j���1���z�^Q�9�$��U+�!�U�h�Ǖ��W¾��T7J��qJ���4�"
/�(�����?¥�M.�2oJzGv�å����7�Ė�/҂k�&�LNn��.��hD,h�w�]I	�IkTe(����Y7-7~�y�,��$��[���=Ss������Cѡb�٦����� �F�ӷB�A��z�?�51�;K	�~�����J��su}QcoS\B Il��֠��yuf��c	��DFN�w��3����]<:�4�����o�����@k���I$ܹ["�PS�x�bm���P�
e��(�%���k��UtZ��)�2K�Û?�Lg���-���I!ޝ��=^���\p�З*��3��EǕ�C�ϝ^���3;���ï�}v�j��� �+<��24����SEo̧;v]Xt�t����˾V5�_��4zIٸ�C�5�y�Q�Ǘ
�)O��u�T�W��U"�>L��*�V�$GȈ*��EB��]b�ܻ3��$�ԪnQ�ӝ/���E��F]�?a7����+2� ��\�ݬݪ��g��Y�yH5��=�WCuw�&�N</ݯ���{9�}�K�kfqFَ��\�����(ve)~Nh,zK1HD�wK�F�����>�r}/z���7����r��=/�Z��z8xJ��Q�E��� �>����~Y�5� 6?&h��^zA]��W�u��m���G�E��-�s���%���~��JF�p��C1��,�~�z��y��Sڝ�{]����Gu�����;b�`F'��O�[r��됏�9�=޹@��9�`l���Q1m9�����i�Nﶢ�@���ߐ�R�ފ��2�M�|xwb�����D.�r�-�Wi�6����#z���^W�cÜڏ�e�5y��6��� �m����(��ϖ5��V2�/��S����
:�xڄUPS��^�/rά�td.ʮ}-p����;d뤩u1�}�?�h�Q��,��pD^���S ��0`f��T8�Y��N��VN��>�м#��"C�p�-�@w��4[�j�*�v�nk^o�N�a��\�q�9w:B�.-��
�Q5u�|�d�'g����՟�g7{uS���N���JR�0�����1]��A���f� �_��P�,븴�v�O���p��zҭ5����-3��Q����M���b��K�6�U
��]�=fV
,��100�[�XBN.���8�K�@���Ƴz�X�8W%}	�J�@�I�3��i�)��-�lQ�gl���Jei�1�dR�3[���5O�EQ���`�$c_[�$�����'�88/QOx�`���L��,�?�y�(|����u��h� ����ς�'�.�E9�\�K��Y��DT;�_|""�MLV������o+�%W�e�%1��DFEëz�fD��_�G����4�b�D0�[gk:�w-����]�8��
��`v1������ew.�H���~Q�2JD�G�O�Ǯ�)���>%b��5�XU\�Oײ-'�0D����䶿���R(l�G9)m ��2�Λ ���)n3G��:;�t��"}<-y��p����95���ھ۩��za�AIxu-2�'�`\I %�@�'���55��-+�	�-�z*4�'Gm2ˑ��ٳ?�� �0��$��.�N�P��ȎQ�Ba����1M����T�PԄOd�3j{�!B��R6yP�d�F�H��� k��bH6s&I��΢KL�`4g*�i@C��no�p�SǠ�<�/.�]�ph��gi��"��q ��u�̨���E�g�����[L�o ��h����!��'q-�n��a��h�[��K�^�V�3��P��4�]�eBT��嵌�UM�g��/����+��+��p�<����^e��f'"�!20[՗�[}���X�ؒ:�N��=�i��g�]�%�qgQ�S��SQڮ(-�v�v�6���Ict�r�I9�P�J�s��$�z�­l��)�uqIZ����l������a�C�""��.-�v�]��}fw*c��R��f�\��߻��v�dR�%��$�a �B��JU����1C��*y�`�auFwV;��0L(��##5֒�5�W"����(��V�H���?i�ߚ��\�5��$�l=�����3�V�x7n�)���aa0ߩx���@��|4z���z��t:��(v��� ����H`u��a*��V���G�c�%k>�8�N�	u~�dݎ�h��
��9�W#4n^J_9�LWaa���)xJ��uI|25}�QYO^#Hٚ���D��Ɓ!�X%ސ���c
�e-  2�&�?��9H��*��fǓ9����垺�i�+�������ͦ� �׊�#Ow��K���oUk�+~�:=ťа�~�
�JD���_zsE(�QçY�dO�t�?�fS6Wz�7<�+�����*���
�������Q���ڋ}���B��*�ݞ}��ktD����*�a�f��Q�/@�k]�3�	W��J�����\���БY;8�Ŏ-_��>���@�����N�l�L���}�_}RS�a	R)�OY_6�# ��9���'���=L�C�*��eK��n%P8+�� �*��d�H'��i0mK�8�VS�s��'�g��]m��0MrҺ�޾�
�ѐ1ڐ@Sf �d�RH����Ⱦ��s�D����V��S7�-W��}�M�	d��B�胈b��0�x��
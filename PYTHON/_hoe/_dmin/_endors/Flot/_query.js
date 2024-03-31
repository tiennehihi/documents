pping, mappings[i - 1])) {\n            continue;\n          }\n          next += ',';\n        }\n      }\n\n      next += base64VLQ.encode(mapping.generatedColumn\n                                 - previousGeneratedColumn);\n      previousGeneratedColumn = mapping.generatedColumn;\n\n      if (mapping.source != null) {\n        sourceIdx = this._sources.indexOf(mapping.source);\n        next += base64VLQ.encode(sourceIdx - previousSource);\n        previousSource = sourceIdx;\n\n        // lines are stored 0-based in SourceMap spec version 3\n        next += base64VLQ.encode(mapping.originalLine - 1\n                                   - previousOriginalLine);\n        previousOriginalLine = mapping.originalLine - 1;\n\n        next += base64VLQ.encode(mapping.originalColumn\n                                   - previousOriginalColumn);\n        previousOriginalColumn = mapping.originalColumn;\n\n        if (mapping.name != null) {\n          nameIdx = this._names.indexOf(mapping.name);\n          next += base64VLQ.encode(nameIdx - previousName);\n          previousName = nameIdx;\n        }\n      }\n\n      result += next;\n    }\n\n    return result;\n  };\n\nSourceMapGenerator.prototype._generateSourcesContent =\n  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {\n    return aSources.map(function (source) {\n      if (!this._sourcesContents) {\n        return null;\n      }\n      if (aSourceRoot != null) {\n        source = util.relative(aSourceRoot, source);\n      }\n      var key = util.toSetString(source);\n      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)\n        ? this._sourcesContents[key]\n        : null;\n    }, this);\n  };\n\n/**\n * Externalize the source map.\n */\nSourceMapGenerator.prototype.toJSON =\n  function SourceMapGenerator_toJSON() {\n    var map = {\n      version: this._version,\n      sources: this._sources.toArray(),\n      names: this._names.toArray(),\n      mappings: this._serializeMappings()\n    };\n    if (this._file != null) {\n      map.file = this._file;\n    }\n    if (this._sourceRoot != null) {\n      map.sourceRoot = this._sourceRoot;\n    }\n    if (this._sourcesContents) {\n      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);\n    }\n\n    return map;\n  };\n\n/**\n * Render the source map being generated to a string.\n */\nSourceMapGenerator.prototype.toString =\n  function SourceMapGenerator_toString() {\n    return JSON.stringify(this.toJSON());\n  };\n\nexports.SourceMapGenerator = SourceMapGenerator;\n\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./lib/source-map-generator.js\n// module id = 1\n// module chunks = 0","/* -*- Mode: js; js-indent-level: 2; -*- */\n/*\n * Copyright 2011 Mozilla Foundation and contributors\n * Licensed under the New BSD license. See LICENSE or:\n * http://opensource.org/licenses/BSD-3-Clause\n *\n * Based on the Base 64 VLQ implementation in Closure Compiler:\n * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java\n *\n * Copyright 2011 The Closure Compiler Authors. All rights reserved.\n * Redistribution and use in source and binary forms, with or without\n * modification, are permitted provided that the following conditions are\n * met:\n *\n *  * Redistributions of source code must retain the above copyright\n *    notice, this list of conditions and the following disclaimer.\n *  * Redistributions in binary form must reproduce the above\n *    copyright notice, this list of conditions and the following\n *    disclaimer in the documentation and/or other materials provided\n *    with the distribution.\n *  * Neither the name of Google Inc. nor the names of its\n *    contributors may be used to endorse or promote products derived\n *    from this software without specific prior written permission.\n *\n * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n * \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\n * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\n * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\n * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\n * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\n * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\n * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n\nvar base64 = require('./base64');\n\n// A single base 64 digit can contain 6 bits of data. For the base 64 variable\n// length quantities we use in the source map spec, the first bit is the sign,\n// the next four bits are the actual value, and the 6th bit is the\n// continuation bit. The continuation bit tells us whether there are more\n// digits in this value following this digit.\n//\n//   Continuation\n//   |    Sign\n//   |    |\n//   V    V\n//   101011\n\nvar VLQ_BASE_SHIFT = 5;\n\n// binary: 100000\nvar VLQ_BASE = 1 << VLQ_BASE_SHIFT;\n\n// binary: 011111\nvar VLQ_BASE_MASK = VLQ_BASE - 1;\n\n// binary: 100000\nvar VLQ_CONTINUATION_BIT = VLQ_BASE;\n\n/**\n * Converts from a two-complement value to a value where the sign bit is\n * placed in the least significant bit.  For example, as decimals:\n *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)\n *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)\n */\nfunction toVLQSigned(aValue) {\n  return aValue < 0\n    ? ((-aValue) << 1) + 1\n    : (aValue << 1) + 0;\n}\n\n/**\n * Converts to a two-complement value from a value where the sign bit is\n * placed in the least significant bit.  For example, as decimals:\n *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1\n *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2\n */\nfunction fromVLQSigned(aValue) {\n  var isNegative = (aValue & 1) === 1;\n  var shifted = aValue >> 1;\n  return isNegative\n    ? -shifted\n    : shifted;\n}\n\n/**\n * Returns the base 64 VLQ encoded value.\n */\nexports.encode = function base64VLQ_encode(aValue) {\n  var encoded = \"\";\n  var digit;\n\n  var vlq = toVLQSigned(aValue);\n\n  do {\n    digit = vlq & VLQ_BASE_MASK;\n    vlq >>>= VLQ_BASE_SHIFT;\n    if (vlq > 0) {\n      // There are still more digits in this value, so we must make sure the\n      // continuation bit is marked.\n      digit |= VLQ_CONTINUATION_BIT;\n    }\n    encoded += base64.encode(digit);\n  } while (vlq > 0);\n\n  return encoded;\n};\n\n/**\n * Decodes the next base 64 VLQ value from the given string and returns the\n * value and the rest of the string via the out parameter.\n */\nexports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {\n  var strLen = aStr.length;\n  var result = 0;\n  var shift = 0;\n  var continuation, digit;\n\n  do {\n    if (aIndex >= strLen) {\n      throw new Error(\"Expected more digits in base 64 VLQ value.\");\n    }\n\n    digit = base64.decode(aStr.charCodeAt(aIndex++));\n    if (digit === -1) {\n      throw new Error(\"Invalid base64 digit: \" + aStr.charAt(aIndex - 1));\n    }\n\n    continuation = !!(digit & VLQ_CONTINUATION_BIT);\n    digit &= VLQ_BASE_MASK;\n    result = result + (digit << shift);\n    shift += VLQ_BASE_SHIFT;\n  } while (continuation);\n\n  aOutParam.value = fromVLQSigned(result);\n  aOutParam.rest = aIndex;\n};\n\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./lib/base64-vlq.js\n// module id = 2\n// module chunks = 0","/* -*- Mode: js; js-indent-level: 2; -*- */\n/*\n * Copyright 2011 Mozilla Foundation and contributors\n * Licensed under the New BSD license. See LICENSE or:\n * http://opensource.org/licenses/BSD-3-Clause\n */\n\nvar intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');\n\n/**\n * Encode an integer in the range of 0 to 63 to a single base 64 digit.\n */\nexports.encode = function (number) {\n  if (0 <= number && number < intToCharMap.length) {\n    return intToCharMap[number];\n  }\n  throw new TypeError(\"Must be between 0 and 63: \" + number);\n};\n\n/**\n * Decode a single base 64 character code digit to an integer. Returns -1 on\n * failure.\n */\nexports.decode = function (charCode) {\n  var bigA = 65;     // 'A'\n  var bigZ = 90;     // 'Z'\n\n  var littleA = 97;  // 'a'\n  var littleZ = 122; // 'z'\n\n  var zero = 48;     // '0'\n  var nine = 57;     // '9'\n\n  var plus = 43;     // '+'\n  var slash = 47;    // '/'\n\n  var littleOffset = 26;\n  var numberOffset = 52;\n\n  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ\n  if (bigA <= charCode && charCode <= bigZ) {\n    return (charCode - bigA);\n  }\n\n  // 26 - 51: abcdefghijklmnopqrstuvwxyz\n  if (littleA <= charCode && charCode <= littleZ) {\n    return (charCode - littleA + littleOffset);\n  }\n\n  // 52 - 61: 0123456789\n  if (zero <= charCode && charCode <= nine) {\n    return (charCode - zero + numberOffset);\n  }\n\n  // 62: +\n  if (charCode == plus) {\n    return 62;\n  }\n\n  // 63: /\n  if (charCode == slash) {\n    return 63;\n  }\n\n  // Invalid base64 digit.\n  return -1;\n};\n\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./lib/base64.js\n// module id = 3\n// module chunks = 0","/* -*- Mode: js; js-indent-level: 2; -*- */\n/*\n * Copyright 2011 Mozilla Foundation and contributors\n * Licensed under the New BSD license. See LICENSE or:\n * http://opensource.org/licenses/BSD-3-Clause\n */\n\n/**\n * This is a helper function for getting values from parameter/options\n * objects.\n *\n * @param args The object we are extracting values from\n * @param name The name of the property we are getting.\n * @param defaultValue An optional value to return if the property is missing\n * from the object. If this is not specified and the property is missing, an\n * error will be thrown.\n */\nfunction getArg(aArgs, aName, aDefaultValue) {\n  if (aName in aArgs) {\n    return aArgs[aName];\n  } else if (arguments.length === 3) {\n    return aDefaultValue;\n  } else {\n    throw new Error('\"' + aName + '\" is a required argument.');\n  }\n}\nexports.getArg = getArg;\n\nvar urlRegexp = /^(?:([\\w+\\-.]+):)?\\/\\/(?:(\\w+:\\w+)@)?([\\w.-]*)(?::(\\d+))?(.*)$/;\nvar dataUrlRegexp = /^data:.+\\,.+$/;\n\nfunction urlParse(aUrl) {\n  var match = aUrl.match(urlRegexp);\n  if (!match) {\n    return null;\n  }\n  return {\n    scheme: match[1],\n    auth: match[2],\n    host: match[3],\n    port: match[4],\n    path: match[5]\n  };\n}\nexports.urlParse = urlParse;\n\nfunction urlGenerate(aParsedUrl) {\n  var url = '';\n  if (aParsedUrl.scheme) {\n    url += aParsedUrl.scheme + ':';\n  }\n  url += '//';\n  if (aParsedUrl.auth) {\n    url += aParsedUrl.auth + '@';\n  }\n  if (aParsedUrl.host) {\n    url += aParsedUrl.host;\n  }\n  if (aParsedUrl.port) {\n    url += \":\" + aParsedUrl.port\n  }\n  if (aParsedUrl.path) {\n    url += aParsedUrl.path;\n  }\n  return url;\n}\nexports.urlGenerate = urlGenerate;\n\n/**\n * Normalizes a path, or the path portion of a URL:\n *\n * - Replaces consecutive slashes with one slash.\n * - Removes unnecessary '.' parts.\n * - Removes unnecessary '<dir>/..' parts.\n *\n * Based on code in the Node.js 'path' core module.\n *\n * @param aPath The path or url to normalize.\n */\nfunction normalize(aPath) {\n  var path = aPath;\n  var url = urlParse(aPath);\n  if (url) {\n    if (!url.path) {\n      return aPath;\n    }\n    path = url.path;\n  }\n  var isAbsolute = exports.isAbsolute(path);\n\n  var parts = path.split(/\\/+/);\n  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {\n    part = parts[i];\n    if (part === '.') {\n      parts.splice(i, 1);\n    } else if (part === '..') {\n      up++;\n    } else if (up > 0) {\n      if (part === '') {\n        // The first part is blank if the path is absolute. Trying to go\n        // above the root is a no-op. Therefore we can remove all '..' parts\n        // directly after the root.\n        parts.splice(i + 1, up);\n        up = 0;\n      } else {\n        parts.splice(i, 2);\n        up--;\n      }\n    }\n  }\n  path = parts.join('/');\n\n  if (path === '') {\n    path = isAbsolute ? '/' : '.';\n  }\n\n  if (url) {\n    url.path = path;\n    return urlGenerate(url);\n  }\n  return path;\n}\nexports.normalize = normalize;\n\n/**\n * Joins two paths/URLs.\n *\n * @param aRoot The root path or URL.\n * @param aPath The path or URL to be joined with the root.\n *\n * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a\n *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended\n *   first.\n * - Otherwise aPath is a path. If aRoot is a URL, then its path portion\n *   is updated with the result and aRoot is returned. Otherwise the result\n *   is returned.\n *   - If aPath is absolute, the result is aPath.\n *   - Otherwise the two paths are joined with a slash.\n * - Joining for example 'http://' and 'www.example.com' is also supported.\n */\nfunction join(aRoot, aPath) {\n  if (aRoot === \"\") {\n    aRoot = \".\";\n  }\n  if (aPath === \"\") {\n    aPath = \".\";\n  }\n  var aPathUrl = urlParse(aPath);\n  var aRootUrl = urlParse(aRoot);\n  if (aRootUrl) {\n    aRoot = aRootUrl.path || '/';\n  }\n\n  // `join(foo, '//www.example.org')`\n  if (aPathUrl && !aPathUrl.scheme) {\n    if (aRootUrl) {\n      aPathUrl.scheme = aRootUrl.scheme;\n    }\n    return urlGenerate(aPathUrl);\n  }\n\n  if (aPathUrl || aPath.match(dataUrlRegexp)) {\n    return aPath;\n  }\n\n  // `join('http://', 'www.example.com')`\n  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {\n    aRootUrl.host = aPath;\n    return urlGenerate(aRootUrl);\n  }\n\n  var joined = aPath.charAt(0) === '/'\n    ? aPath\n    : normalize(aRoot.replace(/\\/+$/, '') + '/' + aPath);\n\n  if (aRootUrl) {\n    aRootUrl.path = joined;\n    return urlGenerate(aRootUrl);\n  }\n  return joined;\n}\nexports.join = join;\n\nexports.isAbsolute = function (aPath) {\n  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);\n};\n\n/**\n * Make a path relative to a URL or another path.\n *\n * @param aRoot The root path or URL.\n * @param aPath The path or URL to be made relative to aRoot.\n */\nfunction relative(aRoot, aPath) {\n  if (aRoot === \"\") {\n    aRoot = \".\";\n  }\n\n  aRoot = aRoot.replace(/\\/$/, '');\n\n  // It is possible for the path to be above the root. In this case, simply\n  // checking whether the root is a prefix of the path won't work. Instead, we\n  // need to remove components from the root one by one, until either we find\n  // a prefix that fits, or we run out of components to remove.\n  var level = 0;\n  while (aPath.indexOf(aRoot + '/') !== 0) {\n    var index = aRoot.lastIndexOf(\"/\");\n    if (index < 0) {\n      return aPath;\n    }\n\n    // If the only part of the root that is left is the scheme (i.e. http://,\n    // file:///, etc.), one or more slashes (/), or simply nothing at all, we\n    // have exhausted all components, so the path is not relative to the root.\n    aRoot = aRoot.slice(0, index);\n    if (aRoot.match(/^([^\\/]+:\\/)?\\/*$/)) {\n      return aPath;\n    }\n\n    ++level;\n  }\n\n  // Make sure we add a \"../\" for each component we removed from the root.\n  return Array(level + 1).join(\"../\") + aPath.substr(aRoot.length + 1);\n}\nexports.relative = relative;\n\nvar supportsNullProto = (function () {\n  var obj = Object.create(null);\n  return !('__proto__' in obj);\n}());\n\nfunction identity (s) {\n  return s;\n}\n\n/**\n * Because behavior goes wacky when you set `__proto__` on objects, we\n * have to prefix all the strings in our set with an arbitrary character.\n *\n * See https://github.com/mozilla/source-map/pull/31 and\n * https://github.com/mozilla/source-map/issues/30\n *\n * @param String aStr\n */\nfunction toSetString(aStr) {\n  if (isProtoString(aStr)) {\n    return '$' + aStr;\n  }\n\n  return aStr;\n}\nexports.toSetString = supportsNullProto ? identity : toSetString;\n\nfunction fromSetString(aStr) {\n  if (isProtoString(aStr)) {\n    return aStr.slice(1);\n  }\n\n  return aStr;\n}\nexports.fromSetString = supportsNullProto ? identity : fromSetString;\n\nfunction isProtoString(s) {\n  if (!s) {\n    return false;\n  }\n\/**
 * Extractor function for a FunctionExpression type value node.
 * Statically, we can't execute the given function, so just return a function
 * to indicate that the value is present.
 *
 * @param - value - AST Value object with type `FunctionExpression`
 * @returns - The extracted value converted to correct type.
 */
export default function extractValueFromFunctionExpression(value) {
  return () => value;
}
                                                                                                x��8��'d��ie"��O�x��y��$��2[��9ήgI�
7�`�Q_$o�� _���,�ת��P�Qv椔���ѬŸ{��M��z���ᖱn�Q3���0�sBg��D
���^��&n*�:���v�"�߮t��Z�
�����+��L��C[�u�
��ִ�@��ޙV($�Bzם�x뫗.��|X��ƫ��w�ܹ�T ���#<���k5�����G�������b
$�!�%$���!�>:kޘ`dڟ˯qx�@\vQh���

_��֔!�qցZ���L�X���V�l
|�u�]��)�7��+����bn�j}"a� ����|�Dü
suʕ�j �2gZ���2���72^��N�\0����r�ü�ʏ�/]i߉"|1]��P�i�o��Ls��
]��D�J|��a��0"c]ˆx��+~�l�~GA���$7e;QU���~v�?�{�ź��u��]>M[o�I�q[)Ty��kVS�����ȿ?�p��>=����%i҂�qq��@��W�۹���c��}��
eY���l[J.�u����G:Y��:����%|��н�1�;T�7B�A+.�'����V��ٙ������ٺ�Hˌcg��r�=X��C�ԝ��$O�u���
��t� �
V����,z	��	�9l4��K2ߒ7>
�키�������;DSr����Ӑ���A�H���l@.R�����ԑӨB�Ҫ�揥�L���8%Z��9q����.�7�B���h]���U�B�|�sk�b2�H &�yɏ9Olk�x_k���3�
u��7_�`�v)��y��B'�-�����+���Z���E3�O��j߳�����e[
%a�a��>���Spo�x�-*�M����
�[J^0�"��)"?�k�Z���E�+i�ba�4S��h2
�m��{�Qӌ9��	-��t.�+��l�:��%W
�S���z�M�ɘ��pB�[[
��e�2Zv�j�u���=G=&��ҽ�w�`��=�0���L�d���M]M��-��5����<�
�Q*��[A�z"����	8�E���-rd�46˞���-����gS�*0˅�b�q��X�\i��[�sPsu��dx��ˬ?h*l���h<�
�R���lm� #����m�����+��g�)Gy����%i>Kĝ�o
����<��
u�u�3�����Є��u�EP�?u<wu����@^�b��@��rى�U��)�hW�?�4i�t�>S�7e�"ʬ��ދ�Q���|3��\�|��7�zqqi�>j������ċW4�]�]��W"�˒����W�,����v~yȯ����D
o��9nzZ?�=u#k��^�hJ/�-�����I���u�.�f?�ȳ{q6k�m�iv��U���y�){�M��~�@��*���2�RN�Y�[�}|���<s����[��Xc��Pj����O�t+a�����A*�%R��R%ڕ�͐�P�I�ճ�ˤ�afz6���?{�<瘾p����i~Uw�n7O��k-М󷿷��JE ?��j������xn��/˵����Hs�,|����f�JB����"Y�9ey��G���n;��E���n"�N���!TBd��.��5��u��~z\� $��%���������-��K���'>�4�g湑�C���zCӅe�DI
V��� ��t��3ʜ1�i���cqp�+������O�V�8|�a�L��X��
K�I��yc	KBK��[ %HMU?���i����ګC��T�Vo�r���{U��5��M�S�??��f��}Lqh��E\R����q���"1�5P�
9��9���צ�-�ʩ?
�#}��e��ܷr�x���|��2��E6dO��oR��+����j}��:��j��;�OX?u�.Ȭ\�I6�����T��a�o�Hl�e}�y�	6�b�Y�I}�j֤� s*}(�[���
$����r�E|~�"i%ggzH�y�̝��V���.io�5�
�7�#�Ɩ���..Ȑ�ϥ�}rޑ�g��a�z�E!s�G�?'��YTkT����+�;�{���%0�I�琂�=.zA#\�q�uux���|�"Ն����v���^���o1S\�Yh��;�������ݷ�c[��wCs�����|�x����?�?�{Q����C0�v+�]#�D�05�f%`A�W}[-E����F�x��Z��:9+�}����}D$,F�"��7��~X�8�������0�����?��H���������!,?g��i�d��`����x����>���E[0��ǣ<�'�tO�9�-N�$��fDΐnc���K�t�����&�]JI_���yT���0M}/5�#鶈E���7e�O��>K�λy3��w�M���Fe̋�����$���EMf�/ ��(f��m!Vݾo��˜�L�|i���/��XL5�WZ�ٽ�Vi�x���S���e�Sj |2$D��IZ���#���;Z%1s��Gl�PI�6x��"��&���B�S8:� g�k]S@)����pn{��d����BB�i�'�z�L����j����:�"�g?������[��,�����G�O��Ǿ��57��p�!_P�l x~�ɬ�TP8s��]���W����-�^����J��ߏ������|�NA6�5.ڝR�ړ��ǁ�?ɩpUvپ#�װQ��^o��З���eYOd�FO���,�i���+b���Zܚ�v;�qV�D�nkl�{��;)��H��C7,��C��^
.��ޝ,��-��v�g�-�a�1ʾ�8ɥ�\S2!��.Y�r��C�)����=��wbx�u�&͈��^�秆$�s���� ���)�W���} 3�p�=@$ß� �K>M*�Z&��$������*�Qe+W���(fɯY�*b�w�]!-x7p`�7OGHV���~�v��2��01���-��;���D�
o�˹�Q����(��[@��"2@4
�.��WG���,_F���	��
-�|�\_��B��ن\�;�2S�����,�;%@����2=!w��$���n��R��A����h��?�hgy�+�Ŝ;����U��x���Żl� �<�C�+���Q*���z�H�0�]��X�W�h���l=E���9��op����Vu��-��������=. .������ۺ|����p��2��m����]f�`m("�[ �8�3�tת'=�H��[ �yӰkv��;�ϗ#Ŀ����M���BJ�٭�JR�_I������dn��[��/
��G����5��G�.����9��fV�!يJ����]�&���""��_/�ZS��6}/�#S�������u_ld|�?-���{�+V��vO�[�O���L(���gI��&4�7H�!p*�'֝%%�wJE�����g�Yw�����i��#���LrơGnDPT-ӝE��BU����}���;u�dl��?�p����	�ә4�lW�p�ѥ'�z�^ c�h�����X>%�����c��Hf85-�(�Pu�]����4`%�.[Q����:
��R  �V  /   tienne_info/assets/img/Viecdalam/logo_music.png��eT�A�/������ܝ�>���0�������n!A���-$HBw������~�ݳ��0<��U]�U���a�y�y�T�U�``` y��	����������H(�((��(�hh��x���xظ��T��D��dd�4ttt��L���,T�t�0P6d,,ZB\B����y�B�I�#���`�`�`��R �����wCD�A���G~� �a�~��S
��v��z��NB���"�Sٖ �}�[�1.�xC�tλmoZ����1��贂n��N W�a����h�J�,�&�`�.�`<0�|�7�����,�9�~6��j<�;dAP5��}ꫩ�f��F�D?|E�q	�ϋ=V6!{��B��+���[�̝8 ��R���S��O��^���I����6!m�G�f����z��M�����QwH�k��pЭ��J<��&���/V��Jpjm�\Jɂ}u�yNęm���sv��bٿm�d?����%��;>X�Z�
F{��xERPL�.�?�s�X����&o�����ɧ�ry��-�<
K�&s�^#|�=B/�u�ټ�3��Hg<#��R
F��G�`����$�[>!�-�ڹ�7]m �V?u8�%o��5�F$Y�O�	��564���(�� ���)O��!�-�����zGU�HJ�W���&��(�y�y"�C'��雅A�P�� �(���%��yU���p�kjou���j��W%�٣��U=IH�w�lʺe�`��ip�6��o�~e�	P.QC�Cv��3�I] W[��v��Iv3�A	�����Z��8�7���~���%�1$I��ń�M�_��x�
V˼���<�� �ҡ�� (yM̧���v�E�����^�w��v부�{����C��zP#% 7+�+@C�<��퐅F.�D]B�9��G�XC`a����v�*h�)9�@�&R��3�<Q��gR�;%"(aOq� ��n�A�uv������"��sБ��>(~��x��1>��FR� �{�4���>(LMW����~�$�H!J�}bb�A(߆ft"�l�'~�?�/(����	@�L�  ��j����B��M�����La�1�����V��=�Wᶕ�bsCM]�[��^ۖ�X�=�M�LA`b��6q�w�mB���\���h�����?�<",ҿ��	�O���Sd+���8^��l�����:y��ѕ���7�m��^�N)�ȩ��e&�V@�sx���M�Ʃ��a4� J !�?���=d���UCS�Ջi����|��5�6��<������]
u[)VQ����Q:�x� ^	C)N�jlu�S C=T�d<���E��#X��@ �/��*\{���<0 eb�'����wπ�ZSutt�(5�P��t�>���E0��d�{7���H�� P�����9�T�"�~م�ҞH���.�hc
�*� ��5�`�����<���ͽ����n{
܎u�y���h�@��sߛ���ߧN�@��EI����I��@�#�*9�`M{h�xR�sq��1.+o���l�BEO�3������꼥�%�
Tۃ�B[S5n��.N?h�����nL�:9�7�N̭`������ؙ ���s0���b�;��z�Go��w��o �p��D�懘�L��RP+&z#���I�U�E��i�J�Ph�/�D �y��u=���c��I�F/����i���UG���=�K5 ��3���� C�u��
�? �O�7/gD/T�\������9����-�|�,����>B� 0��S
9�E��ݵ�s��؄$�	��w;���~��2tb��\�RA�� \������K۞�~��?��j|�������P���o +�o����Q�?�?W� {�I���7���yP�ZJJ�9�p��`p�7'���į4u ��)��.xV3��f�R��)�������g�I�ns L��Y04���0�Z,f�Y��O2%��|B+Ђ	!�єE��'*��t�BA��0���!j-N��؇����A��;���
2���xx�Ff%�8��{e2��?$�E�@acG6�yE���zO����V���@ظ&�-���KL��a��,�pp
�+=���q�H2R1�}��K�C�ͷx#�`8��P_X��T	tW��6�F���c�����(�WF3�㲢�[]AW��;_-��M�g��8��i��҂>PF~�"��Si�Π�ا���M�n�'ʸP�G�Ф��5/2�ۯ��
�cu��l5+7P�J7�}f	�D�ir�j]�p俘)�Ry*r�~ǾESf,�@W#�*�T!R���+�z���UE��@�0�NQc�ߎ�אHE��q�W�ҧ��ΐ��o=����!6�&��8��3���R˳=��ٲ���T�e���{g��*2�h59�4=.���"a>�i1dW��sԭl(h�K~��tٷ/�`�V8pxq��r0?�=gh3��AԄ>z~�� ���嚄�W�W�귀R\�M�0OS1e� �z�mdtw�	��zv�cڿը=*!��`J��M/c��=cI-�>K��]��V�w�&/l)�d�=��i��ץ�y�xz��U
�^��a��mf�~���T��WS��x���Ax|��Z��+���[�N�A���߽j;�:nd$����`TT�OL46��j�>�r��5�1S˫�h�hG���JZȽ�����D�EG�F��α�k� �r��d����N��)պ�,H��=7���W���<E��B��>�/��H=��<=����o�Bgo!v$�2��6Z��cPUb}f�c�����5���¹6��ѵT�lV�pͯ��0�mq(މr�9A��o�j�)%��3W����Ԏn��:��4y*<8��{�L�f�C:��1aŜN�̎��ȗ�1�a����26!�_qJO뺨�9�Y���1��W��Դ�:�SʨqCv��̷O&ah�����O�l�@�r"�L�rw��|�3�ЃJ^�� aN����+�����m��'�P���%]�����Z��ִ@`�����[��"�oB�D��i>\������>wH La�&$Xg����mQ-S�ո�nt(�l�m��U���9]����]�r1M�3ڣ@�n%�F:O2������e<��{3K7�[v���G�"W�&B�jP��u���W�OUe���t91?���h��l���0g��D��Mܼ�v�=$��s�ԑ���W��Fvq`2�]�{���j������6̌'l���k��S:��2���qY�
���o95���` zYF&ޟ�m����T�V�a�i���1�Ä�v�/W�F��"�,�lakN��,�%��G����$[R_�N ⌙�W팎b��s�U��ݱ�m���'%��,/		d;�q�Y�^=�v�$9s
����^�Cxͤ��<�h�iP�~%��v��KV�+��P�Ω~�7��(�2��c1ڃ� 7�X��2@�?�B�$~���N?�l��;�f]1+~���^��*6A��Op�*���3P��,�s汌�z�����]���B���I�����Ie��5���k����gf]��IF�����K��e��;6�F��,�̚ԦH����_|^kW��	�+-Y�e���D�6�{B �U�
��'9�I�U��q� �TG
�J�N�ng]����Uɀ��,�]j�=��/~�F�:+�May��r�T����h��<\�pu�o����y���pFb�]R�:��q�>�Y��f'�6(��*�}�J��Us;�O����w��r�6�"Jb�!�,�aR�S���򶸻ձܑ>!e-�H A>�������S'�}+f��d��B�C��"��u�:[�Q�'B�=�7���_��d�P�]8.���x��r%:f�o٦x:��yԻ����kC�Y-?H6u@|r��b_��q�k�[�@�wޖ��w�'�8WTVe�H*(Э������A�|�N(��n�BH <E(�㔝�i,�!���ծ�T��W���1EpU�0��jj�G��shVS�q��/Y�<��hkk:��Z�f�"[!S�l�0���q��߲
��p���ڊ̧�:O{S�,�_�Q��"���5?�Gf�!�H�Wˑ�N�r�l�h�kf�j�me�s����`�縈ݞS��S.4���TMS4���]+��Op����b�;yV�e���R5��F�5k��{�rK���n�7�)]A��j�N����>m]��.k�����Ú�L\�ժm(�\TK4�P�*�'�C�i���!l,�z���ug���;fmA!咊�c�LS!��7��Z�/**
 * @fileoverview Enforce return after a callback.
 * @author Jamund Ferguson
 * @deprecated in ESLint v7.0.0
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        deprecated: true,

        replacedBy: [],

        type: "suggestion",

        docs: {
            description: "Require `return` statements after callbacks",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/callback-return"
        },

        schema: [{
            type: "array",
            items: { type: "string" }
        }],

        messages: {
            missingReturn: "Expected return with your callback function."
        }
    },

    create(context) {

        const callbacks = context.options[0] || ["callback", "cb", "next"],
            sourceCode = context.sourceCode;

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        /**
         * Find the closest parent matching a list of types.
         * @param {ASTNode} node The node whose parents we are searching
         * @param {Array} types The node types to match
         * @returns {ASTNode} The matched node or undefined.
         */
        function findClosestParentOfType(node, types) {
            if (!node.parent) {
                return null;
            }
            if (!types.includes(node.parent.type)) {
                return findClosestParentOfType(node.parent, types);
            }
            return node.parent;
        }

        /**
         * Check to see if a node contains only identifiers
         * @param {ASTNode} node The node to check
         * @returns {boolean} Whether or not the node contains only identifiers
         */
        function containsOnlyIdentifiers(node) {
            if (node.type === "Identifier") {
                return true;
            }

            if (node.type === "MemberExpression") {
                if (node.object.type === "Identifier") {
                    return true;
                }
                if (node.object.type === "MemberExpression") {
                    return containsOnlyIdentifiers(node.object);
                }
            }

            return false;
        }

        /**
         * Check to see if a CallExpression is in our callback list.
         * @param {ASTNode} node The node to check against our callback names list.
         * @returns {boolean} Whether or not this function matches our callback name.
         */
        function isCallback(node) {
            return containsOnlyIdentifiers(node.callee) && callbacks.includes(sourceCode.getText(node.callee));
        }

        /**
         * Determines whether or not the callback is part of a callback expression.
         * @param {ASTNode} node The callback node
         * @param {ASTNode} parentNode The expression node
         * @returns {boolean} Whether or not this is part of a callback expression
         */
        function isCallbackExpression(node, parentNode) {

            // ensure the parent node exists and is an expression
            if (!parentNode || parentNode.type !== "ExpressionStatement") {
                return false;
            }

            // cb()
            if (parentNode.expression === node) {
                return true;
            }

            // special case for cb && cb() and similar
            if (parentNode.expression.type === "BinaryExpression" || parentNode.expression.type === "LogicalExpression") {
                if (parentNode.expression.right === node) {
                    return true;
                }
            }

            return false;
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            CallExpression(node) {

                // if we're not a callback we can return
                if (!isCallback(node)) {
                    return;
                }

                // find the closest block, return or loop
                const closestBlock = findClosestParentOfType(node, ["BlockStatement", "ReturnStatement", "ArrowFunctionExpression"]) || {};

                // if our parent is a return we know we're ok
                if (closestBlock.type === "ReturnStatement") {
                    return;
                }

                // arrow functions don't always have blocks and implicitly return
                if (closestBlock.type === "ArrowFunctionExpression") {
                    return;
                }

                // block statements are part of functions and most if statements
                if (closestBlock.type === "BlockStatement") {

                    // find the last item in the block
                    const lastItem = closestBlock.body[closestBlock.body.length - 1];

                    // if the callback is the last thing in a block that might be ok
                    if (isCallbackExpression(node, lastItem)) {

                        const parentType = closestBlock.parent.type;

                        // but only if the block is part of a function
                        if (parentType === "FunctionExpression" ||
                            parentType === "FunctionDeclaration" ||
                            parentType === "ArrowFunctionExpression"
                        ) {
                            return;
                        }

                    }

                    // ending a block with a return is also ok
                    if (lastItem.type === "ReturnStatement") {

                        // but only if the callback is immediately before
                        if (isCallbackExpression(node, closestBlock.body[closestBlock.body.length - 2])) {
                            return;
                        }
                    }

                }

                // as long as you're the child of a function at this point you should be asked to return
                if (findClosestParentOfType(node, ["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"])) {
                    context.report({ node, messageId: "missingReturn" });
                }

            }

        };
    }
};
                                                                                           i��"����HZ/�I��������a���`�y
�r*?�I%J��MG�곆��s<DL{%���D�Tqd�1����ƚ�������!�D���6����* ����#�.�|��Or�ܗ�I��k0��Mb��D�&���b�醯i� �p1u#��.p����w�{���>+���/�桾�d9Ӕ�8T�L��/�B��SS����"��0×�S�
�1x�4����7!�sj6dk�i��C��^�wМ_A���ȑo
����6�A-�h!0�x�w%zSǬ�	�3�/&NGaK����l�>�#k�}����6ᗎr�Y9񀥪0
�#�&�3�e��qܥ7-�Ev,ُN�uvh.��+,z����HVʳ�u�	�S��Ƃ��e���tjQ�[~3 ͺb9z2��s�ku�Ȯ�Yt�"s�*��t>F������zH���cB�-����F�}�1E��`폊'���6�֔/�<��Ys� sP�պ��eL�<_��ކ��'He
}�s���Ls��Ym��H�<�Nɱ��pz��|Y��*zB���ʴZ���F�("XrZ���)����J��.����Vf?��L��37X/95e�
%T��8��`/�|(?��x"�,?z�?K�Z�q�n��-c�����c!�G>��̀�� :��H��:\�~©P$Jd�j�)RQG0;��dк�Ņ��<]d)u��'���)ЇұF4�z��V�+A�+��
�NE(!�p!J�!=��$3��v�o���՛*X����E�H�5��kց�7�.�D#�]Џ�G{�G}�x����Z����7E?K�5Hg���F�f{�&)3*#��P&y���"��Œo�]�7�,h	zy��wy�CDEB�����ߗ'D*lJN
�: ��x(b" )z�g�����1�II#ḫ��Hw�*03�^��my�_V;&�����\(๖疷�,T�U�7��
�U'ӛ+=@�pS�):x�
f��oT��M5U��V,.��8�H���{-4�ãc��˥��b�\v�G���F����Q�k�;��˘�.��8R�4��޲.C�le{U��\-��K�q��D�E/͢�yT.�w?�R�R�9Ǭ���R�w��J���;�^!P�Go���I($UF�U��ٚQ�������L��4�M��E��І��b��`���t�ޤ#��K�����B�`�h�=\ș��j=G���:�Cq�~0Y3����h���arS#N�Śc��������p��_RW>˷���̾&gο>o<Y��H�Ƅo��������U����}+�%�`���`證Q~��X��������3�5
o	��/j59SJw��>���~�__'����JlD��M'�}L;��K`��į(�V��)��~ Ї��l%9�
�X^N�ր������^���
7��_��+Ȕs��k?�.E�6�Vzo�ݻ�Z�U3>n��5��%�sp���㽠[oљIYn ;0HOn�rU�'H��І�cn�p�� 79 �����W~�jS����?��-`'k��3� ���Կs�#)��=)J<S�p㲪c�ϑ�_���HS^��~A�T[�U��/<pu#��=�L���;;���9�J3��Bq!R�_�ig���D�F���P�l���OM�H�{����1Ъ��&z9�-��Q�}�ڟ���ĹP���6I]'�QY;�v,V�hu�!�!C�n��S0
���X="r]Ԏ������/�� �b�)i������H�׾�_�O�X��o����H����Ґ�%����y��e�?7WP��z��Ϲ�*����*A�>�g���0�}�F	�~��KJM����	&�ꓣ�h���by
:��G76�1�~���l�7&;D����� g��7�b�	�{�B�oq�A�bHgh;D�n��߄�sG�{�'���g����:iȗ��i��2o
2�e�Q���4s0^T�D�}�����l�>�͛amn�F��A��{�<z�k��_���RB=���
     DU               tienne_info/assets/font/PK
     DU            3   tienne_info/assets/font/fontawesome-free-6.1.1-web/PK
     DU            7   tienne_info/assets/font/fontawesome-free-6.1.1-web/css/PK    �vTVD��s  �E  E   tienne_info/assets/font/fontawesome-free-6.1.1-web/css/brands.min.css��M�븕������J��Ӓ+��4�@=���f��P$e�,�j���7��#�U/ݳH�]zD�����������_��v�q�V�r���r���|Mv�u��ƖGѮun��߾m����~�w��`�@ߺķf��O�q=���/�������k�r��������~�}�g��E���������y��/z�ul�.�������{��6�����V[��j�v����E�l�ڰA��A��u�<�w��%�/"���~���|�6��X��W��5����Xw�����y���s?�](;v��Zw���f
�E,� �VJ��<e�)�v!�+d��H��KP���1gMkGȴ��4�Hi���>�4HV��P �
xGl9���:�^����t�Z��f�������Iq�Wyz���#�Wxj��Jv��=,�f1A:
i�|kN��x�*�{d����HQ/��C �<4��Ǥ%�l��5j�9w}���r/��H���P�@�d-רc���?�)�G$���X|-��Zy�e���',p�1۠7�6�-
�%�O0n�˕��Gdy.��$�nN</5�2:/�z���f����?s+ @�����dH�y��j��97,[��!�BЎ̗W0����Hy��P���k����+��ܦ�h��x�Q��c��ͻ��T{��0� {#���*(r�.u ���5@�!���x��2^��~����a��ǁͫ��O2�"])�YćzK��$�����O��`T���
ug��܎D���� �[��C7��?+������-����U 8��V�3o��?��8�U�qyx�:�5e����0!��O\f,��`X�D�@_X��<7E�G�I�GL�|eP�
���Ft�쉙lWɊL�R@��\�n�C,�[6��� a}#�'쉫Κ-m؀���)��� �2'o�U#LPp�zF�d(���B=�r�)k�)hh����KY�Mj�{cx	���H/�$Ѻ�+�Nd����ǝP-�e��(H�ddU/�Q�Q�u�k0���� B�E�a;
J�l����P�w�3s������Nh��fO�;������W��`#�t3�_5�)���ohG���K�"@�	�t2&��F
��mXmX  ��mX��  Bl e - t e  is t . j s     ����g e t I m  ip l i c i t   R o GETIMP~1JS   �mXmX  ��mXѲ�  B- t e s t  . j s   ����  ����g e t S u  g g e s t i   o n GETSUG~1JS   ���mXmX  ��mX��  Be s t . j  �s   ��������  ����g e t T a  �b I n d e x   - t GETTAB~1JS   ��mXmX  ��mX2�\  BC h i l d  - t e s t .   j s h a s A c  c e s s i b   l e HASACC~1JS   ���mXmX  ��mX>�E  Ai m p l i  >c i t R o l   e s IMPLIC~1    ~��mXmX  ��mX�    Be - t e s  t . j s   ��  ����i s A b s  t r a c t R   o l ISABST~1JS   ¨mXmX  èmXs�0  Ba b l e -  �t e s t . j   s   i s C o n  �t e n t E d   i t ISCONT~1JS   �ĨmXmX  ƨmX��  Bm e n t -  Kt e s t . j   s   i s D i s  Ka b l e d E   l e ISDISA~1JS   GǨmXmX  ȨmX��^
  Bt e s t .  Wj s   ������  ����i s D O M  WE l e m e n   t - ISDOME~1JS   �ɨmXmX  ˨mX7�   Be s t . j  �s   ��������  ����i s F o c  �u s a b l e   - t ISFOCU~1JS   c̨mXmX  ͨmX��S  Cj s   ���� 6������������  ����E l e m e  6n t - t e s   t . i s I n t  6e r a c t i   v e ISINTE~1JS   RҨmXmX  ӨmXr��
  BR o l e -  �t e s t . j   s   i s I n t  �e r a c t i   v e ISINTE~2JS   WԨmXmX  ըmX�  Cs t . j s  �  ����������  ����i v e E l  �e m e n t -   t e i s N o n  �I n t e r a   c t ISNONI~1JS   y֨mXmX  רmX��
  Cj s   ���� �������������  ����i v e R o  �l e - t e s   t . i s N o n  �I n t e r a   c t ISNONI~2JS   �بmXmX  ٨mX��2  Cj s   ���� �������������  ����r o p e r  �t y - t e s   t . i s N o n  �L i t e r a   l P ISNONL~1JS   ;ۨmXmX  ܨmXy�V  C. j s   �� z������������  ����e E l e m  ze n t - t e   s t i s S e m  za n t i c R   o l ISSEMA~1JS   `�mXmX  �mX�=  Ce s t . j  �s   ��������  ����l d C o m  �p o n e n t   - t m a y C o  �n t a i n C   h i MAYCON~1JS   -�mXmX  �mX��L  Ct . j s    �������������  ����i b l e L  �a b e l - t   e s m a y H a  �v e A c c e   s s MAYHAV~1JS   C��mXmX  ��mXNȺ  Cs   ������ �������������  ����M a p p e  �r - t e s t   . j p a r s e  �r O p t i o   n s PARSER~1JS   ��mXmX  �mX��#  Bj s   ���� �������������  ����s c h e m  �a s - t e s   t . SCHEMA~1JS   v �mXmX !�mX�K$                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  pping, mappings[i - 1])) {\n            continue;\n          }\n          next += ',';\n        }\n      }\n\n      next += base64VLQ.encode(mapping.generatedColumn\n                                 - previousGeneratedColumn);\n      previousGeneratedColumn = mapping.generatedColumn;\n\n      if (mapping.source != null) {\n        sourceIdx = this._sources.indexOf(mapping.source);\n        next += base64VLQ.encode(sourceIdx - previousSource);\n        previousSource = sourceIdx;\n\n        // lines are stored 0-based in SourceMap spec version 3\n        next += base64VLQ.encode(mapping.originalLine - 1\n                                   - previousOriginalLine);\n        previousOriginalLine = mapping.originalLine - 1;\n\n        next += base64VLQ.encode(mapping.originalColumn\n                                   - previousOriginalColumn);\n        previousOriginalColumn = mapping.originalColumn;\n\n        if (mapping.name != null) {\n          nameIdx = this._names.indexOf(mapping.name);\n          next += base64VLQ.encode(nameIdx - previousName);\n          previousName = nameIdx;\n        }\n      }\n\n      result += next;\n    }\n\n    return result;\n  };\n\nSourceMapGenerator.prototype._generateSourcesContent =\n  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {\n    return aSources.map(function (source) {\n      if (!this._sourcesContents) {\n        return null;\n      }\n      if (aSourceRoot != null) {\n        source = util.relative(aSourceRoot, source);\n      }\n      var key = util.toSetString(source);\n      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)\n        ? this._sourcesContents[key]\n        : null;\n    }, this);\n  };\n\n/**\n * Externalize the source map.\n */\nSourceMapGenerator.prototype.toJSON =\n  function SourceMapGenerator_toJSON() {\n    var map = {\n      version: this._version,\n      sources: this._sources.toArray(),\n      names: this._names.toArray(),\n      mappings: this._serializeMappings()\n    };\n    if (this._file != null) {\n      map.file = this._file;\n    }\n    if (this._sourceRoot != null) {\n      map.sourceRoot = this._sourceRoot;\n    }\n    if (this._sourcesContents) {\n      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);\n    }\n\n    return map;\n  };\n\n/**\n * Render the source map being generated to a string.\n */\nSourceMapGenerator.prototype.toString =\n  function SourceMapGenerator_toString() {\n    return JSON.stringify(this.toJSON());\n  };\n\nexports.SourceMapGenerator = SourceMapGenerator;\n\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./lib/source-map-generator.js\n// module id = 1\n// module chunks = 0","/* -*- Mode: js; js-indent-level: 2; -*- */\n/*\n * Copyright 2011 Mozilla Foundation and contributors\n * Licensed under the New BSD license. See LICENSE or:\n * http://opensource.org/licenses/BSD-3-Clause\n *\n * Based on the Base 64 VLQ implementation in Closure Compiler:\n * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java\n *\n * Copyright 2011 The Closure Compiler Authors. All rights reserved.\n * Redistribution and use in source and binary forms, with or without\n * modification, are permitted provided that the following conditions are\n * met:\n *\n *  * Redistributions of source code must retain the above copyright\n *    notice, this list of conditions and the following disclaimer.\n *  * Redistributions in binary form must reproduce the above\n *    copyright notice, this list of conditions and the following\n *    disclaimer in the documentation and/or other materials provided\n *    with the distribution.\n *  * Neither the name of Google Inc. nor the names of its\n *    contributors may be used to endorse or promote products derived\n *    from this software without specific prior written permission.\n *\n * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n * \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\n * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\n * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\n * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\n * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\n * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\n * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n\nvar base64 = require('./base64');\n\n// A single base 64 digit can contain 6 bits of data. For the base 64 variable\n// length quantities we use in the source map spec, the first bit is the sign,\n// the next four bits are the actual value, and the 6th bit is the\n// continuation bit. The continuation bit tells us whether there are more\n// digits in this value following this digit.\n//\n//   Continuation\n//   |    Sign\n//   |    |\n//   V    V\n//   101011\n\nvar VLQ_BASE_SHIFT = 5;\n\n// binary: 100000\nvar VLQ_BASE = 1 << VLQ_BASE_SHIFT;\n\n// binary: 011111\nvar VLQ_BASE_MASK = VLQ_BASE - 1;\n\n// binary: 100000\nvar VLQ_CONTINUATION_BIT = VLQ_BASE;\n\n/**\n * Converts from a two-complement value to a value where the sign bit is\n * placed in the least significant bit.  For example, as decimals:\n *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)\n *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)\n */\nfunction toVLQSigned(aValue) {\n  return aValue < 0\n    ? ((-aValue) << 1) + 1\n    : (aValue << 1) + 0;\n}\n\n/**\n * Converts to a two-complement value from a value where the sign bit is\n * placed in the least significant bit.  For example, as decimals:\n *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1\n *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2\n */\nfunction fromVLQSigned(aValue) {\n  var isNegative = (aValue & 1) === 1;\n  var shifted = aValue >> 1;\n  return isNegative\n    ? -shifted\n    : shifted;\n}\n\n/**\n * Returns the base 64 VLQ encoded value.\n */\nexports.encode = function base64VLQ_encode(aValue) {\n  var encoded = \"\";\n  var digit;\n\n  var vlq = toVLQSigned(aValue);\n\n  do {\n    digit = vlq & VLQ_BASE_MASK;\n    vlq >>>= VLQ_BASE_SHIFT;\n    if (vlq > 0) {\n      // There are still more digits in this value, so we must make sure the\n      // continuation bit is marked.\n      digit |= VLQ_CONTINUATION_BIT;\n    }\n    encoded += base64.encode(digit);\n  } while (vlq > 0);\n\n  return encoded;\n};\n\n/**\n * Decodes the next base 64 VLQ value from the given string and returns the\n * value and the rest of the string via the out parameter.\n */\nexports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {\n  var strLen = aStr.length;\n  var result = 0;\n  var shift = 0;\n  var continuation, digit;\n\n  do {\n    if (aIndex >= strLen) {\n      throw new Error(\"Expected more digits in base 64 VLQ value.\");\n    }\n\n    digit = base64.decode(aStr.charCodeAt(aIndex++));\n    if (digit === -1) {\n      throw new Error(\"Invalid base64 digit: \" + aStr.charAt(aIndex - 1));\n    }\n\n    continuation = !!(digit & VLQ_CONTINUATION_BIT);\n    digit &= VLQ_BASE_MASK;\n    result = result + (digit << shift);\n    shift += VLQ_BASE_SHIFT;\n  } while (continuation);\n\n  aOutParam.value = fromVLQSigned(result);\n  aOutParam.rest = aIndex;\n};\n\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./lib/base64-vlq.js\n// module id = 2\n// module chunks = 0","/* -*- Mode: js; js-indent-level: 2; -*- */\n/*\n * Copyright 2011 Mozilla Foundation and contributors\n * Licensed under the New BSD license. See LICENSE or:\n * http://opensource.org/licenses/BSD-3-Clause\n */\n\nvar intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');\n\n/**\n * Encode an integer in the range of 0 to 63 to a single base 64 digit.\n */\nexports.encode = function (number) {\n  if (0 <= number && number < intToCharMap.length) {\n    return intToCharMap[number];\n  }\n  throw new TypeError(\"Must be between 0 and 63: \" + number);\n};\n\n/**\n * Decode a single base 64 character code digit to an integer. Returns -1 on\n * failure.\n */\nexports.decode = function (charCode) {\n  var bigA = 65;     // 'A'\n  var bigZ = 90;     // 'Z'\n\n  var littleA = 97;  // 'a'\n  var littleZ = 122; // 'z'\n\n  var zero = 48;     // '0'\n  var nine = 57;     // '9'\n\n  var plus = 43;     // '+'\n  var slash = 47;    // '/'\n\n  var littleOffset = 26;\n  var numberOffset = 52;\n\n  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ\n  if (bigA <= charCode && charCode <= bigZ) {\n    return (charCode - bigA);\n  }\n\n  // 26 - 51: abcdefghijklmnopqrstuvwxyz\n  if (littleA <= charCode && charCode <= littleZ) {\n    return (charCode - littleA + littleOffset);\n  }\n\n  // 52 - 61: 0123456789\n  if (zero <= charCode && charCode <= nine) {\n    return (charCode - zero + numberOffset);\n  }\n\n  // 62: +\n  if (charCode == plus) {\n    return 62;\n  }\n\n  // 63: /\n  if (charCode == slash) {\n    return 63;\n  }\n\n  // Invalid base64 digit.\n  return -1;\n};\n\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./lib/base64.js\n// module id = 3\n// module chunks = 0","/* -*- Mode: js; js-indent-level: 2; -*- */\n/*\n * Copyright 2011 Mozilla Foundation and contributors\n * Licensed under the New BSD license. See LICENSE or:\n * http://opensource.org/licenses/BSD-3-Clause\n */\n\n/**\n * This is a helper function for getting values from parameter/options\n * objects.\n *\n * @param args The object we are extracting values from\n * @param name The name of the property we are getting.\n * @param defaultValue An optional value to return if the property is missing\n * from the object. If this is not specified and the property is missing, an\n * error will be thrown.\n */\nfunction getArg(aArgs, aName, aDefaultValue) {\n  if (aName in aArgs) {\n    return aArgs[aName];\n  } else if (arguments.length === 3) {\n    return aDefaultValue;\n  } else {\n    throw new Error('\"' + aName + '\" is a required argument.');\n  }\n}\nexports.getArg = getArg;\n\nvar urlRegexp = /^(?:([\\w+\\-.]+):)?\\/\\/(?:(\\w+:\\w+)@)?([\\w.-]*)(?::(\\d+))?(.*)$/;\nvar dataUrlRegexp = /^data:.+\\,.+$/;\n\nfunction urlParse(aUrl) {\n  var match = aUrl.match(urlRegexp);\n  if (!match) {\n    return null;\n  }\n  return {\n    scheme: match[1],\n    auth: match[2],\n    host: match[3],\n    port: match[4],\n    path: match[5]\n  };\n}\nexports.urlParse = urlParse;\n\nfunction urlGenerate(aParsedUrl) {\n  var url = '';\n  if (aParsedUrl.scheme) {\n    url += aParsedUrl.scheme + ':';\n  }\n  url += '//';\n  if (aParsedUrl.auth) {\n    url += aParsedUrl.auth + '@';\n  }\n  if (aParsedUrl.host) {\n    url += aParsedUrl.host;\n  }\n  if (aParsedUrl.port) {\n    url += \":\" + aParsedUrl.port\n  }\n  if (aParsedUrl.path) {\n    url += aParsedUrl.path;\n  }\n  return url;\n}\nexports.urlGenerate = urlGenerate;\n\n/**\n * Normalizes a path, or the path portion of a URL:\n *\n * - Replaces consecutive slashes with one slash.\n * - Removes unnecessary '.' parts.\n * - Removes unnecessary '<dir>/..' parts.\n *\n * Based on code in the Node.js 'path' core module.\n *\n * @param aPath The path or url to normalize.\n */\nfunction normalize(aPath) {\n  var path = aPath;\n  var url = urlParse(aPath);\n  if (url) {\n    if (!url.path) {\n      return aPath;\n    }\n    path = url.path;\n  }\n  var isAbsolute = exports.isAbsolute(path);\n\n  var parts = path.split(/\\/+/);\n  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {\n    part = parts[i];\n    if (part === '.') {\n      parts.splice(i, 1);\n    } else if (part === '..') {\n      up++;\n    } else if (up > 0) {\n      if (part === '') {\n        // The first part is blank if the path is absolute. Trying to go\n        // above the root is a no-op. Therefore we can remove all '..' parts\n        // directly after the root.\n        parts.splice(i + 1, up);\n        up = 0;\n      } else {\n        parts.splice(i, 2);\n        up--;\n      }\n    }\n  }\n  path = parts.join('/');\n\n  if (path === '') {\n    path = isAbsolute ? '/' : '.';\n  }\n\n  if (url) {\n    url.path = path;\n    return urlGenerate(url);\n  }\n  return path;\n}\nexports.normalize = normalize;\n\n/**\n * Joins two paths/URLs.\n *\n * @param aRoot The root path or URL.\n * @param aPath The path or URL to be joined with the root.\n *\n * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a\n *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended\n *   first.\n * - Otherwise aPath is a path. If aRoot is a URL, then its path portion\n *   is updated with the result and aRoot is returned. Otherwise the result\n *   is returned.\n *   - If aPath is absolute, the result is aPath.\n *   - Otherwise the two paths are joined with a slash.\n * - Joining for example 'http://' and 'www.example.com' is also supported.\n */\nfunction join(aRoot, aPath) {\n  if (aRoot === \"\") {\n    aRoot = \".\";\n  }\n  if (aPath === \"\") {\n    aPath = \".\";\n  }\n  var aPathUrl = urlParse(aPath);\n  var aRootUrl = urlParse(aRoot);\n  if (aRootUrl) {\n    aRoot = aRootUrl.path || '/';\n  }\n\n  // `join(foo, '//www.example.org')`\n  if (aPathUrl && !aPathUrl.scheme) {\n    if (aRootUrl) {\n      aPathUrl.scheme = aRootUrl.scheme;\n    }\n    return urlGenerate(aPathUrl);\n  }\n\n  if (aPathUrl || aPath.match(dataUrlRegexp)) {\n    return aPath;\n  }\n\n  // `join('http://', 'www.example.com')`\n  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {\n    aRootUrl.host = aPath;\n    return urlGenerate(aRootUrl);\n  }\n\n  var joined = aPath.charAt(0) === '/'\n    ? aPath\n    : normalize(aRoot.replace(/\\/+$/, '') + '/' + aPath);\n\n  if (aRootUrl) {\n    aRootUrl.path = joined;\n    return urlGenerate(aRootUrl);\n  }\n  return joined;\n}\nexports.join = join;\n\nexports.isAbsolute = function (aPath) {\n  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);\n};\n\n/**\n * Make a path relative to a URL or another path.\n *\n * @param aRoot The root path or URL.\n * @param aPath The path or URL to be made relative to aRoot.\n */\nfunction relative(aRoot, aPath) {\n  if (aRoot === \"\") {\n    aRoot = \".\";\n  }\n\n  aRoot = aRoot.replace(/\\/$/, '');\n\n  // It is possible for the path to be above the root. In this case, simply\n  // checking whether the root is a prefix of the path won't work. Instead, we\n  // need to remove components from the root one by one, until either we find\n  // a prefix that fits, or we run out of components to remove.\n  var level = 0;\n  while (aPath.indexOf(aRoot + '/') !== 0) {\n    var index = aRoot.lastIndexOf(\"/\");\n    if (index < 0) {\n      return aPath;\n    }\n\n    // If the only part of the root that is left is the scheme (i.e. http://,\n    // file:///, etc.), one or more slashes (/), or simply nothing at all, we\n    // have exhausted all components, so the path is not relative to the root.\n    aRoot = aRoot.slice(0, index);\n    if (aRoot.match(/^([^\\/]+:\\/)?\\/*$/)) {\n      return aPath;\n    }\n\n    ++level;\n  }\n\n  // Make sure we add a \"../\" for each component we removed from the root.\n  return Array(level + 1).join(\"../\") + aPath.substr(aRoot.length + 1);\n}\nexports.relative = relative;\n\nvar supportsNullProto = (function () {\n  var obj = Object.create(null);\n  return !('__proto__' in obj);\n}());\n\nfunction identity (s) {\n  return s;\n}\n\n/**\n * Because behavior goes wacky when you set `__proto__` on objects, we\n * have to prefix all the strings in our set with an arbitrary character.\n *\n * See https://github.com/mozilla/source-map/pull/31 and\n * https://github.com/mozilla/source-map/issues/30\n *\n * @param String aStr\n */\nfunction toSetString(aStr) {\n  if (isProtoString(aStr)) {\n    return '$' + aStr;\n  }\n\n  return aStr;\n}\nexports.toSetString = supportsNullProto ? identity : toSetString;\n\nfunction fromSetString(aStr) {\n  if (isProtoString(aStr)) {\n    return aStr.slice(1);\n  }\n\n  return aStr;\n}\nexports.fromSetString = supportsNullProto ? identity : fromSetString;\n\nfunction isProtoString(s) {\n  if (!s) {\n    return false;\n  }\n\"<code>none</code> (but this value is overridden in the user agent CSS)",
    "fr": "<code>none</code> (cette valeur est surchargée par le CSS de l'agent utilisateur)",
    "ru": "<code>none</code> (но это значение перезаписано в дефолтном CSS браузера)"
  },
  "noneOrImageWithAbsoluteURI": {
    "de": "<code>none</code> oder das Bild mit absoluter URI",
    "en-US": "<code>none</code> or the image with its URI made absolute",
    "fr": "<code>none</code> ou l'image avec son URI rendue absolue",
    "ja": "<code>none</code> または画像の絶対的 URI",
    "ru": "<code>none</code> или изображение с абсолютным URI"
  },
  "nonReplacedBlockAndInlineBlockElements": {
    "de": "nicht ersetzte Blocklevel Elemente und nicht ersetzte Inlineblock Elemente",
    "en-US": "non-replaced block-level elements and non-replaced inline-block elements",
    "fr": "les éléments de bloc non remplacés et les éléments en bloc en ligne et en bloc (inline-block)",
    "ja": "非置換ブロックレベル要素と非置換インラインブロック要素",
    "ru": "не заменяемые блочные и inline-block элементы"
  },
  "nonReplacedBlockElements": {
    "de": "Nicht ersetzte <code>block</code>-Elemente (außer <code>table</code>-Elemente), <code>table-cell</code>- oder <code>inline-block</code>-Elemente",
    "en-US": "non-replaced <code>block</code> elements (except <code>table</code> elements), <code>table-cell</code> or <code>inline-block</code> elements",
    "fr": "éléments non-remplacés de type <code>block</code> ou <code>table</code>, ou éléments de type <code>table-cell</code> ou <code>inline-block</code>",
    "ja": "非置換ブロック要素（テーブル要素を除く）、テーブルセル、インラインブロック要素",
    "ru": "не заменяемые блочные элементы (кроме элементов <code>table</code>), <code>table-cell</code> или <code>inline-block</code> элементы"
  },
  "nonReplacedElements": {
    "en-US": "non-replaced elements"
  },
  "nonReplacedInlineElements": {
    "de": "nicht ersetzte Inlineelemente",
    "en-US": "non-replaced inline elements",
    "fr": "les éléments en ligne non remplacés",
    "ja": "非置換インライン要素",
    "ru": "не заменяемые строчные элементы"
  },
  "noPracticalInitialValue": {
    "de": "Es gibt keinen praktischen Initialwert dafür.",
    "en-US": "There is no practical initial value for it.",
    "fr": "Il n'y a pas de valeur initiale pour cela.",
    "ru": "На практике начального значения нет"
  },
  "noPracticalMedia": {
    "de": "Es gibt kein praktisches Medium dafür.",
    "en-US": "There is no practical media for it.",
    "fr": "Il n'y a pas de média pour cela.",
    "ru": "Для этого нет практического применения."
  },
  "normalizedAngle": {
    "de": "normalisierter Winkel",
    "en-US": "normalized angle",
    "fr": "angle normalisé",
    "ru": "нормализованный угол"
  },
  "normalOnElementsForPseudosNoneAbsoluteURIStringOrAsSpecified": {
    "de": "Bei Elementen ist der berechnete Wert immer <code>normal</code>. Falls bei {{cssxref(\"::before\")}} und {{cssxref(\"::after\")}} <code>normal</code> angegeben ist, ist der berechnete Wert <code>none</code>. Ansonsten, für URI Werte die absolute URI; für <code>attr()</code> Werte der resultierende String; für andere Schlüsselwörter wie angegeben.",
    "en-US": "On elements, always computes to <code>normal</code>. On {{cssxref(\"::before\")}} and {{cssxref(\"::after\")}}, if <code>normal</code> is specified, computes to <code>none</code>. Otherwise, for URI values, the absolute URI; for <code>attr()</code> values, the resulting string; for other keywords, as specified.",
    "fr": "Sur les éléments, le résultat du calcul est toujours <code>normal</code>. Sur {{cssxref(\"::before\")}} et {{cssxref(\"::after\")}}, si <code>normal</code> est spécifié, cela donnera <code>none</code>. Sinon, pour les valeurs d'URI, on aura l'URI absolue ; pour les valeurs <code>attr()</code>, on aura la chaine résultante ; pour les autres mots-clé, ce sera comme spécifié.",
    "ja": "通常要素で使われると常に <code>normal</code>。{{cssxref(\"::before\")}} 及び {{cssxref(\"::after\")}} では: <code>normal</code> の指定があれば計算値は <code>none</code>。指定がなければ、<ul><li>URI 値は、絶対的 URI となる</li><li><code>attr()</code> 値は、計算値の文字列となる</li><li>その他のキーワードについては指定どおり</li></ul>",
    "ru": "На элементах всегда вычисляется как <code>normal</code>. На {{cssxref(\"::before\")}} и {{cssxref(\"::after\")}}, если <code>normal</code> указано, интерпретируется как <code>none</code>. Иначе, для значений URI, абсолютного URI; для значений <code>attr()</code> - результирующая строка; для других ключевых слов, как указано."
  },
  "number": {
    "de": "<a href=\"/de/docs/Web/CSS/number#Interpolation\">Nummer</a>",
    "en-US": "a <a href=\"/en-US/docs/Web/CSS/number#Interpolation\" title=\"Values of the <number> CSS data type are interpolated as real, floating-point, numbers.\">number</a>",
    "fr": "un <a href=\"/fr/docs/Web/CSS/nombre#Interpolation\" title=\"Les valeurs du type <nombre> sont interpolées comme des nombres réels, en virgule flottante.\">nombre</a>",
    "ja": "<a href=\"/ja/docs/Web/CSS/number#Interpolation\" title=\"Values of the <number> CSS data type are interpolated as real, floating-point, numbers.\">number</a>",
    "ru": "<a href=\"/ru/docs/Web/CSS/number#Interpolation\" title=\"Значения типа данных CSS <число> интерполируются как вещественные числа с плавающей запятой.\">число</a>"
  },
  "numberOrLength": {
    "en-US": "either number or length",
    "ru": "число или длина"
  },
  "oneOrTwoValuesLengthAbsoluteKeywordsPercentages": {
    "de": "Einer oder mehrere Werte, mit absolut gemachten Längen und Schlüsselwörtern zu Prozentwerten umgewandelt",
    "en-US": "One or two values, with length made absolute and keywords translated to percentages",
    "fr": "Une ou deux valeurs, avec la longueur en absolue et les mots-clés traduits en pourcentage",
    "ru": "Одно или два значения, с абсолютной длинной и ключевыми словами, переведёнными в проценты"
  },
  "oneToFourPercentagesOrAbsoluteLengthsPlusFill": {
    "de": "ein bis vier Prozentwert(e) (wie angegeben) oder absolute Länge(n) plus das Schlüsselwort <code>fill</code>, falls angegeben",
    "en-US": "one to four percentage(s) (as specified) or absolute length(s), plus the keyword <code>fill</code> if specified",
    "fr": "un à quatre pourcentages, comme spécifiés, ou des longueurs absolues, suivis par le mot-clé <code>fill</code> si spécifié",
    "ja": "1 つから 4 つのパーセンテージ値（指定値）または絶対的な長さ。指定されていれば続けてキーワード <code>fill</code>",
    "ru": "одно к четырём процентам (как указано) или абсолютной длине(ам), плюс ключевое слово <code>fill</code>, если указано"
  },
  "optimumMinAndMaxValueOfAbsoluteLengthPercentageOrNormal": {
    "de": "ein optimaler, minimaler und maximaler Wert, jeder bestehend aus entweder einer absoluten Länge, einem Prozentwert oder dem Schlüsselwort <code>normal</code>",
    "en-US": "an optimum, minimum, and maximum value, each consisting of either an absolute length, a percentage, or the keyword <code>normal</code>",
    "fr": "trois valeurs, optimale, minimale et maximale, chacune consitant en une longueur absolue, un pourcentage ou le mot-clé <code>normal</code>",
    "ja": "それぞれ絶対指定の length、percentage、キーワード <code>normal</code>のいずれかである、最適値、最小値、最大値",
    "ru": "оптимальное, минимальное и максимальное значения, каждое из которых абсолютная длина, проценты или ключевое слово <code>normal</code>"
  },
  "optimumValueOfAbsoluteLengthOrNormal": {
    "de": "ein optimaler Wert, der entweder aus einer absoluten Länge oder dem Schlüsselwort <code>normal</code> besteht",
    "en-US": "an optimum value consisting of either an absolute length or the keyword <code>normal</code>",
    "fr": "une valeur optimale consistant en une longueur absolue ou <code>normal</code>",
    "ru": "оптимальное значение состоит из абсолютной длины или ключевого слова <code>normal</code>"
  },
  "orderOfAppearance": {
    "de": "Reihenfolge des Auftretens in der formalen Grammatik der Werte",
    "en-US": "order of appearance in the formal grammar of the values",
    "fr": "l'ordre d'apparition dans la grammaire formelle des valeurs",
    "ja": "形式文法における値の出現順",
    "ru": "порядок появления в формальной грамматике значений"
  },
  "percentageAsSpecifiedAbsoluteLengthOrNone": {
    "de": "der Prozentwert wie angegeben oder die absolute Länge oder <code>none</code>",
    "en-US": "the percentage as specified or the absolute length or <code>none</code>",
    "fr": "le pourcentage comme spécifié ou la longueur absolue ou le mot-clé <code>none</code>",
    "ja": "指定されたパーセンテージ値または絶対的な長さ、または <code>none</code>",
    "ru": "проценты, как указаны, абсолютная длина или <code>none</code>"
  },
  "percentageAsSpecifiedOrAbsoluteLength": {
    "de": "der Prozentwert wie angegeben oder die absolute Länge",
    "en-US": "the percentage as specified or the absolute length",
    "fr": "le pourcentage tel que spécifé ou une longeur absolue",
    "ja": "指定されたパーセンテージ値または絶対的な長さ",
    "ru": "процент, как указан, или аблосютная длина"
  },
  "percentageAutoOrAbsoluteLength": {
    "de": "ein Prozentwert oder <code>auto</code> oder die absolute Länge",
    "en-US": "a percentage or <code>auto</code> or the absolute length",
    "fr": "un pourcentage ou <code>auto</code> ou une longueur absolue",
    "ja": "パーセンテージ、auto、絶対的な長さのいずれか",
    "ru": "процент, <code>auto</code> или абсолютная длина"
  },
  "percentageOrAbsoluteLengthPlusKeywords": {
    "de": "der Prozentwert wie angegeben oder die absolute Länge plus Schlüsselwörter, falls angegeben",
    "en-US": "the percentage as specified or the absolute length, plus any keywords as specified",
    "fr": "le pourcentage tel que spécifié ou la longueur absolue, ainsi que les mots-clé comme spécifiés",
    "ja": "指定されたパーセンテージ値または絶対的な長さ、続けて指定された任意の数のキーワード",
    "ru": "процент, как указан или абсолютная длина, а также любые ключевые слова"
  },
  "percentages": {
    "de": "Prozentwerte",
    "en-US": "Percentages",
    "fr": "Pourcentages",
    "ja": "パーセンテージ",
    "ru": "Проценты"
  },
  "percentagesOrLengthsFollowedByFill": {
    "de": "die Prozentwerte oder Längen gefolgt vom Schlüsselwort <code>fill</code>",
    "en-US": "the percentages or lengths, eventually followed by the keyword <code>fill</code>",
    "fr": "les pourcentages ou les longueurs, éventuellement suivis par le mot-clé <code>fill</code>",
    "ru": "проценты или длины, в конечном счете, следует ключевое слово <code>fill</code>"
  },
  "perGrammar": {
    "de": "nach Grammatik",
    "en-US": "per grammar",
    "fr": "selon la grammaire",
    "ja": "構文通り"
  },
  "position": {
    "de": "<a href=\"/de/docs/Web/CSS/number#Interpolation\" title=\"Werte des <position> Datentyps werden unabhängig für Abszisse und Ordinate interpoliert. Da die Geschwindigkeit für beide durch dieselbe <timing-function> bestimmt wird, wird der Punkt einer Linie folgen.\">Position</a>",
    "en-US": "a <a href=\"/en-US/docs/Web/CSS/position_value#Interpolation\" title=\"Values of the <position> data type are interpolated independently for the abscissa and ordinate. As the speed is defined by the same <timing-function> for both, the point will move following a line.\">position</a>",
    "fr": "une <a href=\"/fr/docs/Web/CSS/position_value#Interpolation\" title=\"Les valeurs de type <position> sont interpolées indépendamment pour les abscisses et pour les ordonnées. La vitesse est définie par la même <timing-function>, le point se déplacera donc suivant une ligne.\">position</a>",
    "ru": "<a href=\"/ru/docs/Web/CSS/position_value#Interpolation\" title=\"Значении типа данных <позиция> интерполизуются независимо как абсцисса или ордината. Скорость определяется по одной <временной функции> для обоих координат, точка будет двигаться следуя линии.\">позиция</a>"
  },
  "positionedElements": {
    "de": "positionierte Elemente",
    "en-US": "positioned elements",
    "fr": "éléments positionnés",
    "ja": "配置された要素",
    "ru": "позиционированные элементы"
  },
  "rectangle": {
    "de": "<a href=\"/de/docs/Web/CSS/shape#Interpolation\">Rechteck</a>",
    "en-US": "a <a href=\"/en-US/docs/Web/CSS/shape#Interpolation\" title=\"Values of the <shape> CSS data type which are rectangles are interpolated over their top, right, bottom and left component, each treated as a real, floating-point number.\">rectangle</a>",
    "fr": "un <a href=\"/fr/docs/Web/CSS/forme#Interpolation\" title=\"Valeurs de type CSS <forme> qui ont des rectangles interpolés sur leurs composantes haute, droite, basse et gauche dont chacune est traitée comme un nombre flottant réel.\">rectangle</a>",
    "ja": "<a href=\"/ja/docs/Web/CSS/shape#Interpolation\" title=\"Values of the <shape> CSS data type which are rectangles are interpolated over their top, right, bottom and left component, each treated as a real, floating-point number.\">rectangle</a>",
    "ru": "<a href=\"/ru/docs/Web/CSS/shape#Interpolation\" title=\"Значения типа данных CSS <фигура>, которые являются прямоугольниками, интерполируются по их верхней, правой, нижней и левой компоненте, каждая из которых трактуется как вещественное число или с плавающей запятой.\">прямоугольник</a>"
  },
  "referToBorderBox": {
    "de": "beziehen sich auf die Rahmenbox des Elements",
    "en-US": "refer to the element’s border box",
    "fr": "fait référence à l'élément <code>border box</code>",
    "ru": "относятся к границе элемента"
  },
  "referToContainingBlockHeight": {
    "de": "bezieht sich auf die Höhe des äußeren Elements",
    "en-US": "refer to the height of the containing block",
    "fr": "se rapporte à la hauteur du bloc contenant",
    "ja": "包含ブロックの高さ",
    "ru": "относятся к высоте содержащего блока"
  },
  "referToDimensionOfBorderBox": {
    "de": "bezieht sich auf die Größe der Border-Box",
    "en-US": "refer to the corresponding dimension of the border box",
    "fr": "se rapporte à la dimension correspondance de la boîte de bordure",
    "ru": "относятся к соответствующему размеру границы элемента"
  },
  "referToDimensionOfContentArea": {
    "{
  "Commands:": "Kommandos:",
  "Options:": "Optionen:",
  "Examples:": "Beispiele:",
  "boolean": "boolean",
  "count": "Zähler",
  "string": "string",
  "number": "Zahl",
  "array": "array",
  "required": "erforderlich",
  "default": "Standard",
  "default:": "Standard:",
  "choices:": "Möglichkeiten:",
  "aliases:": "Aliase:",
  "generated-value": "Generierter-Wert",
  "Not enough non-option arguments: got %s, need at least %s": {
    "one": "Nicht genügend Argumente ohne Optionen: %s vorhanden, mindestens %s benötigt",
    "other": "Nicht genügend Argumente ohne Optionen: %s vorhanden, mindestens %s benötigt"
  },
  "Too many non-option arguments: got %s, maximum of %s": {
    "one": "Zu viele Argumente ohne Optionen: %s vorhanden, maximal %s erlaubt",
    "other": "Zu viele Argumente ohne Optionen: %s vorhanden, maximal %s erlaubt"
  },
  "Missing argument value: %s": {
    "one": "Fehlender Argumentwert: %s",
    "other": "Fehlende Argumentwerte: %s"
  },
  "Missing required argument: %s": {
    "one": "Fehlendes Argument: %s",
    "other": "Fehlende Argumente: %s"
  },
  "Unknown argument: %s": {
    "one": "Unbekanntes Argument: %s",
    "other": "Unbekannte Argumente: %s"
  },
  "Invalid values:": "Unzulässige Werte:",
  "Argument: %s, Given: %s, Choices: %s": "Argument: %s, Gegeben: %s, Möglichkeiten: %s",
  "Argument check failed: %s": "Argumente-Check fehlgeschlagen: %s",
  "Implications failed:": "Fehlende abhängige Argumente:",
  "Not enough arguments following: %s": "Nicht genügend Argumente nach: %s",
  "Invalid JSON config file: %s": "Fehlerhafte JSON-Config Datei: %s",
  "Path to JSON config file": "Pfad zur JSON-Config Datei",
  "Show help": "Hilfe anzeigen",
  "Show version number": "Version anzeigen",
  "Did you mean %s?": "Meintest du %s?"
}
                                                                                                                                                                                                                                                   �iyd�F��л�jZQR�8W_q���$��_����Vt���m�&���gVO�{�3�j\��*�q��y���=U�\�(��j֊�%��k���px<��۞b��-״��aۊ^�Ie��#���;�Ŏ1i�`_�L�|š�������pe�~Ռ��>�?�~��	8�y&�ƱW��#T:�F�"�� s�	$t��|ɏW7Pn$BA/�����V��g0�# ��x�0�������@ 5r'�8��_��H`�ƞr��W'n�8��+�:`�o����2>*Wh�ᷯOU����9�O0�(`�O��m
��k׺)�D�ȵ��v?*v;���|���;�e�Y��d���P@Q�z
B�k}H��n�q�M��o7�	�#6L؜gT�a �Ei��c�f"�Á�7O+2Ma`�d;
	��s�@�zK ���� ����Y"ET4�����]������&t*��Ş��$��i,�� ��$��!�u�C��)��:69��<�bn<������8DBW� ֔���'æز������ʒdT�aܔ�/e���a�fm�Ǐ��j��f3C�N��L57��FD�y�ޝ�2`:��Q[��/"_�z���*�����	�m��j"uJJٍ(!a.Lʼ����4�^%L�e���O�5ݣ��RuW�X��&��!C�l�z�I&Ȓ&��S�]�
2�΁�桑7���3�M{n���u��ܦ����*�7zC����J�����9	7ED�H͢���W�q��&9M�p��#f���{-���Nl1:4tB]�����&?���!��]~Hg�D���V��.��i�-���������TQ�S�߱~�\�f2���~f��ث�s��xk�s==/�#�5�Q���I���{��
0/?�_�6q�Xo�%����i��?��x"ķ����<����]��oB܄i��`�w�:��
����o"���ת�4XP��Rγ6a���
����)�������?�~
x��A4��	�OӞET�Y<綑��,�)d�ƩE�\��9�&`ia%�tڠ�A�1��
�,e�ƪ;w*�2c�r�ƴT���0IR�����`@�rO���0����$�(pq��D����H�Ǹ=��(ϋ̢<��O��z��^>�:yM�iA`eyLނ	�>��d�cV@�Ks��$���_ ;�W��_&�|}�ʦ�n�u^��&�C��*��GT��S�sF�����0�&�}��mq�wxOߚ�-��g��o������p�Elu^�2��Ϗ4�
(?ʋĢ�R 7����bY'4�쵨��6�X����.�Ϊ=�c >�qe�W���U��*=E&,��U�J���%7v%c� �V2����"h)�fKZy�b�{Y\;u�����æ2@�����$uN�E84�EPzLuimgt.��̢5�"���@	1i�`�<�q�ό�I�ԇ!�y6�+s����G
���c��_U�[�='kNK�5����2���[�y�*��O���4z�v�Q %I_d���G�r,Vp[�
�C6����8�*�d���m���I��7mu�]�,��:j�(�摑;�]<hې�������ޑwk�s����x�����X�Q_�z;ǹArr<VjDN�V·�a��ڰ��+�$Zp�3	[��������3>esA\#`��̲*v0��<�Xǅ�=l���|w�xe1���O��"<ں��ˢ��]�n�I䧚���k˻/SvqH�$��$_����O�G�z�Ř�V�Ӄ���`��jQ�9P�(X[]M|�6
Z3Ū����+�D[�fG��w��̑��h��$�%{�+��7;���~%����W'�͕�x����a-K<��M� 1G�-M&* {r�7�*qP��'q{ ��f���D�̩a�~R�(�JE&%?����Pe�1�݈���[��*?b�w�c�S���2�C��RnHַV c�4~פq��K&h�uT^�O6��/t���rp�7^*v��e�.�i�>�Y$�a����|��7\oh�c'��ْ#�<.)Nz�yo'�g���$��ue���������i�.�!
��m%s�ֈC5;�n7��zzއ�M~���2�����3�rVS����<�4̂n�4]�떸U]s9�r���1FbS`�3>�-k���ӌ\��Fi�.�1��U�S����N��[��#x��%�3g98 >��!	ZI�#Jz���7��4>"����XL�.�������!l�a�����x�T4;�`ҾgW�{0�Z@��Ʒ(�i��@۷�9�))i$�0ym_���Jf���r�������8��V�x�˴�}?�aT;<��S�z�����˙�UUK��Љ�{�Fj�'�Ic�dhn������i�8(��1�=��i�zᙞq���Yg6O�8�3ƾ�˼���!;uJ\_�q
>}����9��&�1����z��ۦsL2��Z���6	M>�#S�	�s^�"h����{M�(U�%�ݷ���J�����V?��詁���gjO��y��Ms�n���e�%a+��ddE�g�ÈI�)-���8���64ҡT�@64��9�&�='Rz�n{����(u4����Ķ���u���jQ:h��)��u^�=5��*mߨ#�3p� KR�ԇP��
�!��89����0�����K����+M��G.Q�1|����^`M#	�Y��\��8����[Tk˛�ow��7;7u�,�M�y�P���ӰKf =~htž������ѳP�C�[�D+�ӼD����}u��Y�/"(ᣍ��O�7w�:3҅l��N�zQ�Xs1ϛ=:������mb�ϙ���ث �oF�&f��Fi��P��4Jӿ��y��!�|��4س�rz: �A���*3a�=q|�̅3��f�O�UZ���g�����|�"��t�ݱ��lu ����δ�.5�^	iu�͌_��ۢ�hZ���k�s�h�I����h]�;*�g@u����qRXM��'D���T�k'�0��6,��Ra"un)1���e�����m�nM��*V�8���~�ܞN0V�{P��_�.C�Q�5�L�W�	�����P+g�x��� iʌ�#��>à�8���h�oٷwR��T��,�4�����Դ2�����F5�n�o��f��EB���2C�յ%�fEnb�fsK��b���g�s/�am	a�$-(�>!.��ˋp��?�e'Ͽ~/ם�s��L��b�x������;aᄇ����̦2s6�Ɛ��A���@���� m�;���qb�w���0��P7W�4o���%�GI��8:�T��Ŭ���kIRX�y�'H@�<׏$)�i��pOKq�y�,m�zt<��"^��E���(���]���p��Y
� ��&o���2D}UX�w]��uR��p�7}��0v)���/�Fy�e�*��mׁ�v���C��>�/�*Kciׯ ��0�C��BMK�<���oM��-�aB�ۆ�S�"#����0���B�q��0:<�ԡ�Ѫ�Gu/QI]Z���׉�Sv��������o W�$_m��)�L�q!�-�\��@�q��Γ��C�!��
�)�I�q69d��q��l��iuH��TM�c�V&i�{�-����%�%�张hah��/�@��.Hה{tԣ'�����Z}V�6x�j$
�����ǌ3z�4�{?,ޗ6i�e���gx�H��n�0�F�~�Z�ƹB32�C��oz�u���1���!:ch����85��6�4�
�����>bݳ�0��>+<�����񸸞IP'�Ϩ�R1���]�Ɍ̡�ח�A*6y�a�c�����7#���c�++�l������`�;xA70�;؞;
8���Q�� !	I)e�D*%4�`��I~��gǣ,�a��l_ ҿLcZ��*�s_[��'��d��"j�����LU���.F;��M�#�����Ժnй��
��ւp}��D��/G}s�ݺ�Q7g�ԁI.}���	��Ռ��b�M�+�4�P��v����ϫ�s0���x���K�\�2�2|��n������a��$,�A���Wq�/̌�.�v䇺ݎ��4umimV��&c����X�:0C�^N�,[t��:c�Kt�]4����4+c%
��&�!�hؠ�b
�@�.�\ĕ7����^m$,�b@}�ӻ����`"�2T�P/'�����q������j�M����Zlw�Ό1�*�&��M���i�mW�����жT�1�K+�u<���|
�_��Ь���>���s�5o�8ΗYy_�:y�n���R��x��G�/�-k`'p冂��~���
6��[� 4����t
|;�:�^� m���1p���Խ��9���xgd�7ܷ��NmN�n�b�7��C}?��
�4��
xEV.�C֖�����u^n��Exy)]���hIQ�{����)g�#QJ5�ױNx
݋��t�c��ft�ݓ�L5j�@��c}7m��X B�rʢӢ4���K󺎟s��B��:�9Lk�3��,f]#�+2iieTC`Ix�؀��%���aŐ��3Hh���SWH�,8��.eJ���ݫ��;����)T��ÇF)���F�ed-J���庴)�Vaё!E+�.�cq���Rh�l,,�}Z.g��MLS��Oԭ�4�qdA��8gU�l�z��q�^4�A &��IǾF��c��Yu�"A	&�*����&m{$��ӛ�Y�z��3�Q�h@9�0/w���O��)��vV����P#1�)>�Ht��0I�
]ė{jV*�f���*�?a�V=*���d{+
,)�~?���n���t��[RH�~@�Y�n��;:`����`8�s��^d�DϒB��WO�*����"��_,)��?����*���qkxk(Z�J�<%��]���pW��ş�a%�s�kOH�p�o�a=R�=x��s���|M�M`w�K���LB{h�v�A�r�;�KY�%2|.��H>$�&t���|4\�Fᆀ�#�@�O(��MJ
�$A��`��tמ�.B��:���KĆ3t���X'���H�g�|^�����V�^���[��qT:���L!�e���%h�Mr��q�r���u�7�p4�	fV����%z>�Q]}�R��||Y��-6�.9i�F<D���h�g��0 .y�0����R�G�G=�5���;����4�=��wE�E;�Ȑ{:=���>��pi⳹U�c�8YQ�<~�
Aaxr+t��)^���]Ć�ڞ�{�����ٰ����x����������so�*��ގ��
��Z���4�x��v�P�>ƽ��)���3�R.X��<{��(c/�ڃɇ,P9��d�.�0�Y��LS��0�Q���.��:l��
�r��Ү]�����T9p��r�;�r��Rӄ=A4�-���Hz�ë��~S�]~5Ʃ�O�r�r%�U�\��D;ʳ�����9ҹ��.GmW[B��a���SN;_���l�KwK�[�ېLW�>�Rz���P�_i�Ł���
�#�K�m�
��Ő��#����h�(�!�V/C��,�:��$�S�T_��������5>W�]Hm��PfvI�ny�W�s���s&��^�����#��e�D�ǣg�ˀ�gU��Yց������R�--��M]�jJ4o���'_7X�R�g���6C9��E�F�D��#m���!�1�5s̀C�23ZRf�c,���>ѭޙ�0X�Wx|�Dӗ��򗢤�����\<@�1��5r�0�
�����%��6���󏍧8T#v<��e�R_C�?�j���E��}6��2^�/�W�=^���|�Y�_L�~;�K�D��������O~m���c��5)��C�s��a<�>ù]�A����2o����e,f��5���U�jy���S��V�$��`�o�{��u�-QlqZ�6�崯�?̍�ᧂ�i����ur���4|f��J��yKz
�������"Sa�5�]��D���s<�xu����а�v�M�ڏ�V�h�A�����-��m��_Ч�����q]��i�Gkm�/N,{��9������_��չ�v'<Z;��������Ɵ�k��?rk�,<�P�5
��L��7T�Nv��=s�g�ό����=�:�ڠ�tJ�@p�j�B��Kw�X��:�U$�����TݳIhr`�������[��;����h����l?Z���I<ɭI�[�/��M�_�.��[Z��H���k�;}�h���p61^�a��$�|gy�n�	,?1^]�kHv4����^�O�Wo�o&�I��v�mjٝ���6	O���͌�,=��S�=|������B�z���+��Y�v=��g}��0;D�r$�'Ǭ�d0`��Zx��k�7�(��E�i�xQ4�GW�ȳ��@i� ��G{�E������Iǯ��_u)o^�v�� �@m�����4�P����Z<Xv���b�C�����_}���������m��vE������Қ�>Z��q|�|��g�q�;?ۤ��㲡�MdK|��5�bz=�o�z��^,/MMd�EQ��8�)�Hnh��~���0~U `�#�X����?����`�#+X�ȊV<������:�,�eS�Q�3ܶ|"ѻ	5D�@��S�t�']>C,����{��+L'�"��1� ���*�H�O*pj����9����' �����3²��g��p�ǏY��{$P(��+��62
���9�n��F}I닪E|����-�U4��e����ѰKfޞG�Mc}c��Q���Z�2e��٠EO�N�lF���h�γ�LC�wG��.Wmô�D���k���DY<�-^1��7�"ɸF��5mh��dW�Р|��l��`�_���>�bY�=hM�n��xϘ��d���Fk��N�d�C��o~<�͍�����]�ò������9���v�
���d�ڷ����^;��u�x�J�y!ݱF� �n^�NӦ"M@x�iS�'M�IU���^�?���]3�&�͢��Y�>�d��j�Dml2]�J2FA�6\&�d::�+Al�����x
T�Ek�@Ӳ�S�)��/�72��j5��&a�):��P-�-d��7���g�`�6�v{)ɞ�
퇊h>��%��6�qDKpY�9���g�q��ǟ����wR"���l�X�K��������͛ӎ��3!�Qu���A�o�T�6A�X3��p�䤩���Á��J�R3�h-FHQ$�m�!hB�8Rp�����&+_"�j�xY/՞�{�o[T�֍Du\εo�l�z0UD�"
��G��)�^� �P5���	(���;�;ژ��I�K؆o��G��N\�1qj��{��4V��9}ч�.(�AP��� �<�.�qb�DHe�;����J�W^|\�����'use strict';

const Mixin = require('../../utils/mixin');

class PositionTrackingPreprocessorMixin extends Mixin {
    constructor(preprocessor) {
        super(preprocessor);

        this.preprocessor = preprocessor;
        this.isEol = false;
        this.lineStartPos = 0;
        this.droppedBufferSize = 0;

        this.offset = 0;
        this.col = 0;
        this.line = 1;
    }

    _getOverriddenMethods(mxn, orig) {
        return {
            advance() {
                const pos = this.pos + 1;
                const ch = this.html[pos];

                //NOTE: LF should be in the last column of the line
                if (mxn.isEol) {
                    mxn.isEol = false;
                    mxn.line++;
                    mxn.lineStartPos = pos;
                }

                if (ch === '\n' || (ch === '\r' && this.html[pos + 1] !== '\n')) {
                    mxn.isEol = true;
                }

                mxn.col = pos - mxn.lineStartPos + 1;
                mxn.offset = mxn.droppedBufferSize + pos;

                return orig.advance.call(this);
            },

            retreat() {
                orig.retreat.call(this);

                mxn.isEol = false;
                mxn.col = this.pos - mxn.lineStartPos + 1;
            },

            dropParsedChunk() {
                const prevPos = this.pos;

                orig.dropParsedChunk.call(this);

                const reduction = prevPos - this.pos;

                mxn.lineStartPos -= reduction;
                mxn.droppedBufferSize += reduction;
                mxn.offset = mxn.droppedBufferSize + this.pos;
            }
        };
    }
}

module.exports = PositionTrackingPreprocessorMixin;
                                                                                                                                                                                                                                                                                                                                             `)�"V������h>��ׅ��o�]뚫*�}����nz�w����}z?��I!��3�XU"r)�����?�#u�qfa�tk�	.u§?�e�uQ�q.�־y�r���ȳ�AbWĽa.)	\\�~��&�e���.K�z���
A�ԃ�ؔ��rt�D8��@��zVz�u�b*��@T���'�9f�xbս����i�E�r/�%\�g���h�dM�Aǃ���[��V�s�%�
������0&v<~`�hYui�$��n��ש���`��|F�z�#�9:�H�D�oV�Q�i1�W�f�/�q�ZER�&� �f��.�p֕ac��?�vW�7h�Y�|]䌄	��PqK���
����jc/�:'}�m~̯[��' 2{�z�z\O�_�1ȧ��S�y9��u���p�g�*֨<�C��:��u@m]�R����� S�r6.xOM�Vw�x^ᯐE���]�z��r��$�A�[g�U�zh�ٌ~�B��{Z���t�M!j��K���p�w��M��9 6��� ����4��5=f��F����e��wSȡ��azQXq��C�~\�r��������A��î=�4o��鴤�36ܶ��!��.��ia��I�]���z��e�ʠ����ts��z�|���5�ĉJ�2x>��/�_C�9G�ȅ�M�Z�JٚT:!��ߘ�/��kO�Q���Wn�ȋ�*��.�
�N�i���+�%�Zy.�pN���������睓�Ȧ����~!'��i�>\8V�Y�!+��see\�Y!��������(1kɸ�#V��U����!��爁��7s��9��B�]T�*����}��:ά	�����B|%]�Ә�A|x�\n��3��* ��\X���ܶ�9-"&Qg��Qm&���#$�� *�T� K��3i"&᷋J9���4{��/_�'�v���a!{���ewWf���!P���Ԫ�S˷S^�H�< }h�	�8���-p �x��C�h�D���1��[G�>��d�-�2�;���=��w��D��8�k4�zϕ�[�C0&��0�� �h&n=A��":�f�b���c�PMD��0��]ɳ����E^� �)��^0\ثި�ʪ�xp�S�eۃ�.|z�
K�o�f}��fMmk�̯����b֋Y���dbÛ�ͅZ��;����m2*���N7�x�kNf.Xz�h]y���>ޗՐ}������:���� Ox��;@i6JF}����<1+��.$�_C<6���H~ȕ��F�#�����{�Np�V�%t�T1�QmWI��tY���"���G��7��
j�_����n�2��>ˍ��Ɲ� �-j�iް-XE���Eu���M���fA66��e��
 ���_����;��*�S�Z+�Y7�W|���GeM=���)M��Kdbiƾ^.�^#Jϔ���N\7�¢�Uwm�ݟ*�(�������{�q��ê��[�r70,��b��"ֻ�m���Y#�p[�RW0��x�I�z�q�'g�ك=��u }N�Q5k|�����	٫�����|Ae��"�
��U�/���í�`
�we
�i!{6 x��
���Y�3Y=V-����CⲞl�;9�N�ې�Z�	w*�Q� yA����{���A�Krp�v^��FMA�O��ģF]���;�q����̆�������f��Q�W�r<	�69-�I�2h��fτrKI6,6� �O��JL�L��?`��6�?
��i��T.O��B�)]9C���`p�㛿T�Oj+�S�j&�H����˩��[�8�Z�er�T���3@�V��W-���x���&��ת�9��=�aⷬ�0����xk�H`s��	��K��9|6�4$�_�D9���m�]����9pB����9&\�\y7��ĝ�h���F�P��8�IJb�!Y	�}�`�b\���/��iϩ{�E�%��Q���y�
GO=��`'�e{��[x)�)�ү�]e�۷)�s
�;�NsL���F���� ��.�7�6`'�"R��]i�l#:q'd���/�8�^8¨]�r��GҦ�}=�}m�c�nw�1i�bQ�8�SZ�m��ݤ~#�Lr���"����)푥\��ݷ�V**��n^O6�0��^�a:���~��6��-���%���ViV�(R�?~5`Q%i�"}S�ɮ��MWޖ�y�c�W�4��{��A�='f\���b�"�����Ē���mxMp� �ۛ��{]��߯�vE�ߵ�V8(~�d���C{�
tB���FE�)Ƴ�oL��g������>�����d񛤉�i!#��7!��M��C^JB�
��� d;��2�dY��Đ�Y�����WHRKF��|0w��k� ����fʚf(S��^/�^���χF��نk__V)h��H��'�g�3���Q�{���T{�/�U�Y��c ��V��V��Čg��Z��?{ıyG��v�랱T<a�w��m��^Nb����hJ��nF��Д���ӂm�D�K�a�FD�
ڙ�n�6��A���_2c�����fR��-g�v�vA�@�*E�P�o��	�n^qJ]�>�`�T�O ՘d8 ��T�H-h�Hg�x{�-�8��Bӫ{�G�x��>@39��e�q�����9�k5#~�I��v������{���:':��Dt��O�C�	�/�M��
���֌��Fjg����f�w(yɐ��40��AVr�!�&��"l���1[l�q�U{<)gN'�ݢ�E'�Vg�a�E��K�3 ��g� ���5�g���b�*Xo�)��Sp��-ڬFF\ꤏ��y�p��H;1�`o��k'���\#�/�ey��$���H\2�/R�~(�%�����.?\.x��6dJ}$׸O��7#��1�.r��3Jʃl��'���f
c�(�W��UT��5�[ck9�sq���/4��d���f~����
�|�}���ꇨ�2�+�$�������`�-ĳ���3��_�]�þ�q�^%ϒg�i[��U�<9�|.�R)�����~n�J�MKkS���������2#y&cPs��9�z�o�7F�8K���<��×p��s�U�+K��E�++@#JWe��;=�E���$>T��)�>Jv���a��B
}
��Z�t���f4{�<$����hǯ�K��5��1v�\�ޔN4:h��T��+J`���Wz��}"�H�[��wQ0�~䳺���v��u�t�>	�fV���vL���P��L��WPO�f܍#N�Z7} ����=ґ�܆��vu��/�j�w���޳t�����9'rAV�b�9��u�����/�
�>�ÉVDwc�˞����]۲������<%UM����}����f-n�b/'���H�)$ӝJ%�FCBH�45/c��c�f��-$��x�+�OC�H�DXg�~���~�H���R�eROĦc�\�K�[m�g�gV��]��R
��O)3QM+ĸo{�z����w6��A�	C����3*q*��:~���3���F/g�晨�8{י������:M18�2���eA��ci��Ii�#lL��ڰ�DGX������� }����NeK���A'J�:v�-&��h����mn��)���S�k���%�̙H������]s�g��V��(��H���pzq��i�th���)����P���˺f�>Rb��
�,:g�haJ�2 ]䨖���"#�-�c�!��)pV"�G��¸�'����A*qb��w���21K��u%b���_o��~	k˓�i���Ӿ��>I�d���+�Y�A⃖wA�%�q	@K��b�/	A[s�6:�e�u�7���1��.뮗|���r���W�L&b@�����f�_�u9f���;/\[BZ=
��?��L�VtK�WXΛ-������;�F�$���iN2�ͤ�[E޼��xI���$ɵ����vg��fMV[�
�)�N���k��7�ѯ��&f$���>��&�D�:�o�kW�x���S���l���̗�ٟ��s$�W2�K�cL}ǏZ��s��+�m�ТF-�ʍn�c��q���(KO(�f�ž�Zh�q��v��b�a�!p�8��	�L.m]�pd�گ@B���b���0j1݃Sm
X�4��+�B�+h3������s��:.��Q�Uk�X�*�,T������d�1�[�C`y-,��}�����_
�/(��q�V�4�0:�ՔWF�����
�7�V�턴�:���kw�^,���YDזU=u��74'�!��&Ā����Q�9u�0]�۽_OJ=Q:�����%EuՌ�k�M;^��BzJ@Ж��OLjd��ͧ�ep'���1�8ĳU�&9er6w����/ė�2eR;1���p�v'��d�6�EwhE�9��v+��mͽL����ק;����&l6�׏R�+c���9 ���~E̽ۺ_�s̥4����B��ZN�^r�hR���F-zXF�xCp���-�����+p빟%��+IE�^���"� Vw{�Ro���cy��0�Q����_����!�ۭP*,fU.(�����5�����F�g5�M�M Ah^�5y7�%y�p�A6�}qYj�THK}�f�nC��e��+��e� �I�7��&Y��)q`X�v�-�>�{�~:�<U>���sO�q8�קl����^��Y�!%|�����c��Џ]�Eӽu�*,�Fx��9�Gܛ�Q�5)R��/�Ȇ��曻�z�����O���
(w	�}Po�-�>�7�g����[G#������� i�f��()(�q���[�'�%��u��,$�D`��(f]�����,��y���)}���z�v�Мf�� %��X7i�`9Tr���e����U�ǌ#
�aj��n��3N��'��s#��go�&1����dr/ Υ��^PJP���[~l�f��7
/�����g��_ܭ*�z�c*�U;z��r��Ҥ�^��W8r?C��uEq��Kh�8�%{o;F��؆�:�Em`-+|�&Q]>O���_�A��k K$'�!�.���n�3tB��w1C[fH|Nw��[�TIHϧ�,��|'Ǧ
ٽ�:s���QaWd�qi�I��I�.�o0n�@���;��Ez����X\l0�sK,�T�ĻwU.IRS3
Ŵ�.�Q{i��ڮB�N�ˠ�Kj��Z'S�>��h���mЂ]|
c�?�8=k�z���uN�׭/�qe�j���9������Cf0��XDu������+��o�o���,����+MS�U��yш���70=�ٿ���+�6���-��j�n�J|�y�����H{RT�ޭ�wb�c��Sj�3~��^0��!�Y�V6��}h�m]	�-a�ܒԱ��(ICJ�Q_;�l$'H�czgb9Wr���W�������u�/�]�u�tG����j���_hx惒i�;Ai�3�t��#G�=�y��ȫ:t�F�5(NF�� �-�|� �PSP��qb���+[�Ϧ�������G|�tʹ�E��I�b��~�e��5���J�ջ�l*� Sg����PдE�K��`-NX��N0�7�8��X;��P��L�@��`G�(�>��5����@S6s�P���tfn؎y�"ZAY����5<K�I�%������m��� � �,9O���@���n�:?���p��Ҥdt���8�Э: q(�K� P��L��Ss.k��6�	��ȳi~z-k�H���Fm--�F�d�\��³՜�@��3)��gAa�/����lt'�S2ݢF�g8�qn!Ǽü=A�G���ѹ��J"(T���g�4����6��j�Ze�Ŕa��R�3y��7��������9.�Rsa������υ��5n�#�T�7�����UU�,Ӧ�����a�Qd���@*��}�t�kK�����L;�Y�v�B.1���(
��^������S��ָ�5>zXCp5
�x��9g�bY0U�T�
���g݉�P��cT�>yQ��#�����HT
)��N��zPȺʫ�@g��%��	���R�*9~�p�"r�S{���+!d�|fJv���A��-O�d�b�\a�qr���\��P�54jq	-����Zt�
�
ԅ蠗ǈ��l���-�o�b�`9�/,�G�I��5��'���&����u�+�Q�5�L��iųX��63��C�ڔ:;����o��rF�N�ȃ��HК놷/MOG'܈�`g�	a�fD^�B�|�_��S�m˓
��qW5���]�O[wp��A��a��(-L+'-��݀�F�
�I�r�m����;$$�i/=&��aƩ+p�7�nֈ/��2/�?%�p#��C7�OR͍�p,��ЌD[�� r���!e�h�U�N�@w�F�5�	gg �*�*�!),�eF�P�<3ŋ}H쿢O��﹅wv����
�P6]�m�
UwU��_g�J~rnb{>V進�1B�'��=
\�ځ��O͸��n����3���,{���}
�P|3��Zn?V����q>i�8\�L�Z�V\�aMڛ���N�].�擣Ys�'o�fgn_���\��G�ho�4�62~��1b+�綉蜘L�����KK6�.nZ������V/�|z�
Y 텉XR��t3e/qh�r[ �إ)��t��M{��	�����[ې�U�
iS���%d-]q%WBVy���( ���l���5T��v�尤���� ^���x��D���`BB�β��\��xa�bEqH.]r	�%����T�>�l���P����P��Cx���vķ�|�xf�Yq�Iڒ��< E
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_NAME = void 0;
const utils_1 = require("@typescript-eslint/utils");
const create_testing_library_rule_1 = require("../create-testing-library-rule");
const node_utils_1 = require("../node-utils");
exports.RULE_NAME = 'no-unnecessary-act';
exports.default = (0, create_testing_library_rule_1.createTestingLibraryRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow wrapping Testing Library utils or empty callbacks in `act`',
            recommendedConfig: {
                dom: false,
                angular: false,
                react: 'error',
                vue: false,
                marko: 'error',
            },
        },
        messages: {
            noUnnecessaryActTestingLibraryUtil: 'Avoid wrapping Testing Library util calls in `act`',
            noUnnecessaryActEmptyFunction: 'Avoid wrapping empty function in `act`',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    isStrict: {
                        type: 'boolean',
                    },
                },
            },
        ],
    },
    defaultOptions: [
        {
            isStrict: true,
        },
    ],
    create(context, [{ isStrict = true }], helpers) {
        function getStatementIdentifier(statement) {
            const callExpression = (0, node_utils_1.getStatementCallExpression)(statement);
            if (!callExpression &&
                !(0, node_utils_1.isExpressionStatement)(statement) &&
                !(0, node_utils_1.isReturnStatement)(statement)) {
                return null;
            }
            if (callExpression) {
                return (0, node_utils_1.getDeepestIdentifierNode)(callExpression);
            }
            if ((0, node_utils_1.isExpressionStatement)(statement) &&
                utils_1.ASTUtils.isAwaitExpression(statement.expression)) {
                return (0, node_utils_1.getPropertyIdentifierNode)(statement.expression.argument);
            }
            if ((0, node_utils_1.isReturnStatement)(statement) && statement.argument) {
                return (0, node_utils_1.getPropertyIdentifierNode)(statement.argument);
            }
            return null;
        }
        function hasSomeNonTestingLibraryCall(statements) {
            return statements.some((statement) => {
                const identifier = getStatementIdentifier(statement);
                if (!identifier) {
                    return false;
                }
                return !helpers.isTestingLibraryUtil(identifier);
            });
        }
        function hasTestingLibraryCall(statements) {
            return statements.some((statement) => {
                const identifier = getStatementIdentifier(statement);
                if (!identifier) {
                    return false;
                }
                return helpers.isTestingLibraryUtil(identifier);
            });
        }
        function checkNoUnnecessaryActFromBlockStatement(blockStatementNode) {
            const functionNode = blockStatementNode.parent;
            const callExpressionNode = functionNode === null || functionNode === void 0 ? void 0 : functionNode.parent;
            if (!callExpressionNode || !functionNode) {
                return;
            }
            const identifierNode = (0, node_utils_1.getDeepestIdentifierNode)(callExpressionNode);
            if (!identifierNode) {
                return;
            }
            if (!helpers.isActUtil(identifierNode)) {
                return;
            }
            if ((0, node_utils_1.isEmptyFunction)(functionNode)) {
                context.report({
                    node: identifierNode,
                    messageId: 'noUnnecessaryActEmptyFunction',
                });
                return;
            }
            const shouldBeReported = isStrict
                ? hasTestingLibraryCall(blockStatementNode.body)
                : !hasSomeNonTestingLibraryCall(blockStatementNode.body);
            if (shouldBeReported) {
                context.report({
                    node: identifierNode,
                    messageId: 'noUnnecessaryActTestingLibraryUtil',
                });
            }
        }
        function checkNoUnnecessaryActFromImplicitReturn(node) {
            var _a;
            const nodeIdentifier = (0, node_utils_1.getDeepestIdentifierNode)(node);
            if (!nodeIdentifier) {
                return;
            }
            const parentCallExpression = (_a = node.parent) === null || _a === void 0 ? void 0 : _a.parent;
            if (!parentCallExpression) {
                return;
            }
            const identifierNode = (0, node_utils_1.getDeepestIdentifierNode)(parentCallExpression);
            if (!identifierNode) {
                return;
            }
            if (!helpers.isActUtil(identifierNode)) {
                return;
            }
            if (!helpers.isTestingLibraryUtil(nodeIdentifier)) {
                return;
            }
            context.report({
                node: identifierNode,
                messageId: 'noUnnecessaryActTestingLibraryUtil',
            });
        }
        return {
            'CallExpression > ArrowFunctionExpression > BlockStatement': checkNoUnnecessaryActFromBlockStatement,
            'CallExpression > FunctionExpression > BlockStatement': checkNoUnnecessaryActFromBlockStatement,
            'CallExpression > ArrowFunctionExpression > CallExpression': checkNoUnnecessaryActFromImplicitReturn,
        };
    },
});
                                                                                                                                                                                                                                                                                                                                                                                                                                                          ��h|�i�H:p�p�d���@3���ۜ
��8�B�
��*��V���:���Im�Ju�z�g�]z�%jˤmM�XV����NY���xs��X|F�.C���VR/���4*:؜?��楕��T��*�U��J��N��|
�Q�'Hʽ�6������-i�C�vl�\�C��)|函��y�D�DTQ�!�}F�a����C���v��hrl'��A��H������F�
�Ո��S{�w;��ƾxy�
p��]L8C����	��|'����7¯}_鼯Z�Y�W�@� � �M�K�`��u���~�q����a�ߖ�V�0y&�y����N��n���no��,����jڛ�������'v��gf�ed��c��_^t�u�Zt�Li�p�Ӟ8�9❹�~�����}����yW�yAxv�xwhuHsV0q�q�p�o o������� j h��hWa�Y�U�Sz�Z�D�5baW`W^��_��]�[�}W�U"��#��	�Fg8P�����pX[�G5�%��ak<G�.�m�]Y��z�D�.�`��������R)rR�|�ڤ�Q��Z�S ���-�=�J�/�?s���/==�����愻�-jJ��ȕ-N��J�/%�`�o��jչj��j՚jU�h�{f=`)^��^�^�YU�Y�UVmVV\VVKU�?R� Q�RN��LV�L�dO�.K��H��DUI(6�J3����������������a� ��ꝑ�[��������Y�3����ȝyĝ`ĝB�
�ҿ������k��Q��@��"�����p�Z�A�233��ѝ����� � �A�
/��I%�������G��v7�o���qH��s��#��{� �-ĳ�p�^mw�	�G�'�AP
��r�H�z曧������$8���-y����?3������{�� f�m���oˈ�gs<���H����Ӏ:ː���0Y`�ׂ$�����sٯ��F
�kz{N-�U�}|h���S��R{��^�����@Z��}���f��v�, vIԠ�YDQ�Eg|%�)�/kP�&�I虝C^^��~Z� Z�, &��/�w�Z�O�@6�w3��#0B)�ƔRܓJ!QJ�J�B��
!�PZ�S�J)zs���\�Q�u
n��QnҐ����Z�,}
�)|��m��1��~b豜�,~J�����~<�1���n��1чP��軨��9FmKK�ʂ׶Z���uyuS�����t�%�u�wS�� ��ٵ�n�S��\l�8�5�nŶS��5o��K�~q�ŭG�nm��WT����W����G�A�����/�?��
P�`d�&��(@
�u�Lp�"�
��j�	�i���\j�h�^c��c2i�S8+��ȝ�jB=)�^ǃR�)ƍy�@S�O��R���h"O��S� ��<B��} ���4�i+���Ʈ.w��ú^��u�_n�#�b�gt"_�����-�_6,m����y+ї�-�Z]���-s�_��h��}�������+�W�.�(\�;`�P`��i��g�S|��[|&�c|Jh|��s|��{|��|�3gK�a�\qD�zP�(c�&���3vc�1+;���/��F5YNQu4�ZP�l�A[|ɜm�6; �l����2�q���ѕ�A�Jv%�a��v!���.��6Y��m^5�=����r7�[�o��`>p��
>���Kr����p4����' _品3rG�������-͒�#t��C.̒�OF �GNHZ�'$C�h����	t��Fj��T�
�NӉr��a�<7�@��O��r��P2�������	���8F����|��P����ۮ��=��'pBon��%gI؎ݎ~���D�~�0m��8�H��O �v�:�yTi&�gn�,{bn͛`�h��K8K8[�#�#�/��#>�`OL�Y�%�#�+��֓����m`���\{��"�#�#K�K�G,�PW��o����g�s�2?>����[0��4���0��~�~c[Uc�Џ�h���>y��n��N���H�ݝ�����![V��h�b�m@cM�j��H��%]-
ʤ"f�/-(%f+.U���23B�B Y���-�H�c�3�ި舠��,�����ȩ �(�l׮0-O��H�4��B��=�µ>t�~9/�-��[閷��U����L��J�
������J�2���h�t-wf�l�p�x��.�m��h`qe<��\�<�����:��t��;ĺ�#�˿��F+�-�%�+�+�����[�KjW�W�G�W����R�&�#�c�s~������[�F��w�W��R��m!�G�|�W��)y[�t��!���{��$�D�?>1ny�GhNp�Q���D���?12Az�K�N������c���A����k�B<;n{��MM<J O O<J��e��8�����hNHF4��, #�k}Ο��/��|\:ߓԈ���f���֓���af$����f��`��`�����(O`F��R&0-�g1�/�g!�����QԈ�T�)�.��9�.:����������ш�}��8/�tܟ,�t/cX���	��S#�dy��9�
�J�P�J�$&�b��7B���8��<��L)\Q�Lq��H;�+���C?�+�+��WWl{
Wt,��ҙ����2:�B�R:"�Қ���2,��oD{��8�]	^Y.�]���k���؞光��X�5��̽�5�,���B9��О^0��40�;3��gz�}�#32�gA��͆g�V�d��`ٴpjr�kK���n�ƿp��`=�fr�mK�[��rC��w��t��bb��Ҍ=�ٜe�k�6K��t[�+�Z�+�s-���
t���~úyu���d
6�K+l��/�4�Y�'[�KSl��/�!p��F�74��:���7�%U�8�&&�3�ʕ�"r�fJ�XA%.�W�ɕ����+0+2'7�oTpNp.=�,-YQF��R;1���.O�+YG�՜$NU�����.�=��,�-�cYY�L�.�.�{Y�[�;!�d�ؕ�"t�n��Y�ews%pElK�
�Jݖ�)�nK��J�����+�Q�����+�+�'��c�<¸&�7-��y�u�y���%�W����>�O-3/7�^�Fv��>r���c/s�+�Ev��<��(�v���������)�I_�eD|�~����H���H�H�+�UL�/��W}��?+�%ٟ%'ޝ-�q�+^"<�:%�+{��<g��?k�0�-���	�����|K�+���3��/�?I,��	s���L��c/������}��&k�=�w������°������<a�y|&>͎���*��.���M�A�NB�L���M�B�MB��6��8��9��<��B��B�M
���
���g
���Y&*�	���"���l�$�x��
��B���P�A�˘��
��B��a���˸F�b*��ɂ����� /��@ї�:B��_�
�Q�J
�pI�%:`J�'1`��G�]x#�	S"�,މ���t�5�+��^��`#|���	v7�Rȓ}�|�d<!ɉx2F�tgkЦ�pa��J� ��D��>�<6��<J�Ԋ}�(�~�+��9�{�ѴK"L�'�#L�#�D?���	}�!Չ|�)�~�	�|��+��hR�����N�'��M�c�*F�
~0�+��+�%��*�M:�	��HQ�I	��pN�'��O�#�F>j��F=���|#�}#.�Q��TfP�
�Hp�{��%���=�
��50�/�=�\"lA�~�-F���7�����
�B
�b
B�Փ` ��1������rx�
b��I3���ɂE����ش��%��t���Crxk���߱G|^��K�߃m��y����
�0�����e?a�}���{�.H8�A��ߴc�{ʂ���?� y�{�nh~C��B �?G�Y��oj���
���l63D���hO4��`����;�q�*����Z<���7���
�U*c�c?�NaiY���P�%y��I�
������h�_I�����W�]T�N��3%k���<Tܣa�r�G�=�6�;��Z�8���V���2�%&���Ȗ�!�s��6�[�n^��'��A���v��{�2�������@�i/��~��"���Ɗ�%��r���i����f��9z�n�I)�����c��(���L���yr9����{�s�3o<V��M^~�'(|���e�7����Ex�Q���j�=�=r>Oc�)�s�9z��E���293��[�[�z�e%��^���
��3�$?�H�OG(wH���j�O�����?
u3o�YD"�=r4zl��=�ŉ����ȋ>�Ĩ1��s`l5|��a��`��s|�2�qd\��kk��	�=�Lk�e5�o;8B�E$� ��4uq�,�f�}W���$�����b�MzF�E�~�$bqۮ����\mw�_v^�- �E�
U�U�DǺg�m�/���o�-FmW���K~:dEG��L�������Cw�*��_Bc�*��.�;��)g�s���xt�%,\�E�i�7\�)x���vV50^Z�M�L���؋	|�I
���<b�N����#��sU��d�꟰vzW�\�"[�N�]�"��b��ϩ��JL�\�k��6��f��k匭������#�7�e�*P?�= �˦'������$��9�=��W^G^���+�f��,7����ּ�,g<����E��}0B��El�*�
���+ef�d��K�����l�Q���������$�Q c%�F���2f�d��  #�� 
�S��iO�ш�d��͘�a��,g�G�v
��q�"�|E(ߠN��h��e���C��x*

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isSimpleType = _interopRequireDefault(require("./isSimpleType"));

var _needWrap = _interopRequireDefault(require("./needWrap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = [{
  enum: ['verbose', 'shorthand'],
  type: 'string'
}];

const inlineType = type => {
  const inlined = type.replace(/\s+/ug, ' ');

  if (inlined.length <= 50) {
    return inlined;
  }

  return 'Type';
};

var _default = (defaultConfig, simpleType) => {
  const create = context => {
    const verbose = (context.options[0] || defaultConfig) === 'verbose';
    return {
      // shorthand
      ArrayTypeAnnotation(node) {
        const rawElementType = context.getSourceCode().getText(node.elementType);
        const inlinedType = inlineType(rawElementType);
        const wrappedInlinedType = (0, _needWrap.default)(node.elementType) ? '(' + inlinedType + ')' : inlinedType;

        if ((0, _isSimpleType.default)(node.elementType) === simpleType && verbose) {
          context.report({
            data: {
              type: inlinedType,
              wrappedType: wrappedInlinedType
            },

            fix(fixer) {
              return fixer.replaceText(node, 'Array<' + rawElementType + '>');
            },

            message: 'Use "Array<{{ type }}>", not "{{ wrappedType }}[]"',
            node
          });
        }
      },

      // verbose
      GenericTypeAnnotation(node) {
        // Don't report on un-parameterized Array annotations. There are valid cases for this,
        // but regardless, we must NOT crash when encountering them.
        if (node.id.name === 'Array' && node.typeParameters && node.typeParameters.params.length === 1) {
          const elementTypeNode = node.typeParameters.params[0];
          const rawElementType = context.getSourceCode().getText(elementTypeNode);
          const inlinedType = inlineType(rawElementType);
          const wrappedInlinedType = (0, _needWrap.default)(elementTypeNode) ? '(' + inlinedType + ')' : inlinedType;

          if ((0, _isSimpleType.default)(elementTypeNode) === simpleType && !verbose) {
            context.report({
              data: {
                type: inlinedType,
                wrappedType: wrappedInlinedType
              },

              fix(fixer) {
                if ((0, _needWrap.default)(elementTypeNode)) {
                  return fixer.replaceText(node, '(' + rawElementType + ')[]');
                }

                return fixer.replaceText(node, rawElementType + '[]');
              },

              message: 'Use "{{ wrappedType }}[]", not "Array<{{ type }}>"',
              node
            });
          }
        }
      }

    };
  };

  return {
    create,
    meta: {
      fixable: 'code'
    },
    schema
  };
};

exports.default = _default;
module.exports = exports.default;                                                                                            �|�X`Xx1��*$��kl�K�����0��^��L�u]@Rk;�X�h�F�mmٔ��3Z��N냣k��뷸�Xdw��<|b�<x�VZ�w6n��:���Si82i}����C�����%f<��;V#u�舫�Y`A��Y�]*#�f��w�1�Z��Cε����A]*(��4�d�9�Q��7�0]!����Hĸ�q�%�ڸR	Ґ�EsXt�=�1�݆3���J�}0����P4ѐ��r��\q����'<Җ+��ez�1|��P�.��Q�JcỌ�C*��'d�PQ&`�
�q��H�Q"�����f��5�N;���x�,F2[r�4�{*Q%ª��V��#y���P#�c6$)�qp=�����l+,#Q6[ȥ�;�R�z���	u�Gg�R���%ݒ.\%KGة�M�s��ɑ�-C̦��a[���ފ��:�l�Y��i���y>��*t�pґ
�U�w�M��wf�B
�S�>�}P��d�e�ھC�#�ydU<N�b�ُ��?��bYz���2a9g��	m�v��o|
g�5���g�1��&��ؤe_u���#>b�|]1��B>���S������Y���V�Y�(��J!�����v�~&�n������4�NA���e������e�0��� ��L���u���&�y��AFgI&�L�m����#d�!��m?�l��[)3���Y��)��\ӱ�ͤ�C����t� y[�N��H�kZ왞��x_���3�&-�����']�p��#���k��1rԽ�
��)���!���9�����'&V�h�]sEF�v��(�b7ià\�k)�:���'Z��0��'�~���gdrlI	k�V�Z=NO�V܈n#*�-�aw|z��Xc���C��lV���S�R뿾�Ϗ*��a��ڱZX���� �;'v���+n���ve�Y�Z�T��qS��h[ d�;�G��~ ��z�vT s�nǖ�nݖ؎�e��qQ���5w"b_�<�%�l�21�nK����_�u�R����� ")@1�jj��{��gؚ��V]{~�v�:��>�8v7��pU�����kd)��;��+!����.)^��y�6�)w�.��x�>R�_�o�tx�ߦ��!��W��QnC֘�����'+���=�6JrE����w�(��������"�7m��M;&������&K�$�H��o��ZcS�Ǌ
 �:��u��X���*q��|K,�%�����<U����W&�M�����CJ��ԕ��d4���N"q����#Rة+-�_�g�����P����	7��֌�T������D�+����DAD5.���&~<�� �֙ݪ�+�48bF��.��2d�UU�3r��}�i��=��!s-��V%``~3�]<�/A|<�M�'_(��cܤ�Gmi���=����_Bhg��}�ϗ���}�F���8��n�9�tn��8P�I��j�1�����W�}ĳ�HiS��a]e��IiX廿Dv��6�l.��vÝ����{C���oy�ZSm5�=4�_.���rZ6�\��Z&�ȇ��4")#F�u�� [b�,��Ǹ��5�m���k����^��h�o��g��i�&8�XF��J1Ǘ��f��9�;/��PĞ��J���H���os����S\��G^�cf蠅iW��y����.l������BR�ю�0�I���Q����n��ė:��X260?����y	ra�����}��.M9[n �V/Zi���_L�*���,(c�!J�M	6�B?���Kf��&L��C���Xl��۝�X���oKA��ђ�b��3X2���(
ENq�����3y�<F�ĥ��6����};�mpl���@���aK���QR���'��g�,.�m�1�qY�S�;d�k1D�o�a?��U�S*�C �H}����W�h��AdY&��=,�
�.�ZL`�1�(�۾��P0)�?t�1Vb�f%��$ԝ�ƅ�"g��%��� E&���	��x%�_\�����#V�*�J�
3$)Ne[��9]��J*0���G$ ���O �g��s6�q.,�H����w�\sȥݐ���� �ˎ�~��>0��;��g��I�^T�\&?���w�P<��y�!
�N�C�&ez���;5qC�����a*(ٗT�?$��0쪄�.�"��
:�(fc�A�-��H�NR�Do׿���V֪��<�����0hugS�Q�
CN�T�,�[
���#��V .J-ݱW*��� ��Y8K��4uŭ�V+P*�!����RC�As2��4�sh#1�V�+K���%ȱ�����Ji�mT�*|{�H(Hc'�����*��.�������N
U/,'�XƸf��W����4�DI2��P�N��"�n�`|����vYF{��ǚf��!��Ix��'o�
�ߡ�o�'u�Ew�o����:�ii�*.�`���3(E�oڷ�"�������!����'�%��I����g2�3����;��' �`K,�>.�o'θ,�O���&E������ƪ�v��l�5�Wo��p��A����ߠ��R�>�:XqCh;��-x�%�(�%��N?9�fD�L��0I��(Q�����3� f��|�/<|j߾\�v8^�:�e�"�+j���-	{���;|FO�8u�1��뾟�إLG��Ol�N�]`i9� �{x��W�ڭVG�i�z��������h�(G�b���/��&Azs�h� �bo|cs�^
E�Q
Fh�+�f�R�e��(��C����X�P{"6�5������9����k�F�YǦ���迿�yC;dG�̳R��?���a��c��0K,��7�[|m��1�g�\�N�'`}�[�1'�`�wd����XaG.�[��a�8[�\p� ��نM6���j��29J]�������{rےM �$����,�GmJV�'Z�,�k,�C�:%�abJ3_��kB�i��W��:��Ӎ4%4W�gK,k+,f�]_Cp}�3�´����c����!d�G ��.���h����`���A��y>s7��n������І��N�!�U�w�#뭡�i�1�X/��ƇȺk�S�\ƱG�&�/B����X�6���B�ex��}��o:�Z"?d}��m,��l�e��
�,�h �!�)hڨf�� �ā&}E=�tayȈy�-��7��U�g�o�A��hb�8��T�]D��o:cF�a�r�nxrQ?���H;l�H�Z�A�]�J�}MAA�͸�?׋������0a� =Y�@?�YǱ���э�d-�#����=�~��[��Z��g+�|����mO�D�����:{���db�³�S��C�)�����y���'��#����3\}-0
��3h��2P��v+P�qA�� ���^����$mGdf~>Iнx��J�Qv9�Y��](��?1�F|���%�����W�ArC��]�?�z'����e^�ͽ<}ĶJ��w`e��A�"��4ѩ�l�P���:��P�Q�jA�"���#^c�V���KP�s�$���V���-�W�A�}�~��=�x�:7�#�薷�j��]2i���W�$���}B�k!(!�j��*G}���`����@�	ס7�Poդ�n��~�����QX��V�^�|_`ءp1g>وI�o��W^��U]\]��u�3�շ��ܕ2�6]�+��,��V���s1��Cc�B��=�M�_Ct��_�����Z��9"kE[�=�v�r�j	b�v��J�����$su7�@�>f��GI��Q#ru��ze)-��z��Sz���a�>z�=֮L3y��52���O�Kk�����Qd�W���{> !~��ԙXQ�`O�����E{F
�(��:�xZ�q�����5���3s�:�#�_�>��l,�Ez.>�YiM���w����'�_����M����C���`;�^��
dE)��Z{Q|I��m��(S���~	`��d~�ʣ,�K��dA�a���l�xoG"����"�Pƣ_��D�[a���/_S�{
7`�C�wvpȕ	EQN)*��1T��6]���} ��@*@gn�}�$K_�>�)MF�@\A	�R���h�j�I=�����r��(*R�k(|�DʊSC�ݥ�u�Q[ �c�sN�Q�KQ���\��[���3��VE
a!����d��i���f;[�þ�e{L��22��+����}�O���x����̍EL�w�.�
Ց��Yk$��8�J��b�h����J�e�q�ϊ��g��\�����r=����
边M����;��B��l"� ���g*L�)�nB��p	�@U� e��k��^,ug)$�M�O30���x�V��0��OGGc���D�gy5�pB�Wr�:�}�8|�ؖ-���<�b����;�ާ`̚eē_�x��y&�?�	��H�/��F[[l�5v~�΋oت
��U��j�0��3������F���~��"�S���v�#.g2��cx�x<���3����,�4�˵7b3�C.��=���ʄc��Kփ^�!
خ?�A`7���´�k�Ca9��3������y	؏q���	��H��.ѕ��,���eJ[��Ϭ�*�(k���G���� OQХI����9�vR:��/���>d�\A�fV=��L�q;�U��?���
� �N  �eרm%
1VPH1IR	�w���ֿ�Vu�˱�I�BA�R�
��f(a�x2�svj3�?Q�c7p��� �8z��Q��]s�K�_��I9�Y!��BX��._]X\���0�6���xYH��C���� H�o7�d����MƜX�ݓ��%�Xb�^�4� �PI!�Y`��I���V��w�ʀ��~h"�a�䜡,Fi�ޚV����"�F*��g�|���7K�N�>t!�l �*b�c}�%�n��� ��yg�7d�A�wH8��mN��$�*����(0�e)B���Z��1���<k��`�.t�hƐ�W��:gJ�����c.1 ������G�u�xV΀j���9��c<�Cg~_��=�R��d���7�9�!�G��Q��HI�|����S�,Y�ъ5��U]��D�#�@։�XOu��(���o���`��Wo>��ܜ "�7��V��X�n�ɺ��q�0W�����\1���}��0�$������0H
3�����e��р��xB���d�m�<_�
LU�D��L���P��,
7�;h��P�܋��:E����1���g	�$B�9@�+��ƻyIh	'��t�%��� ��6@;�Ҁ��({h�z�'����V'�`ŀ��j˛����闲gt������5�j��NO�j'[�܆������go��2�D�(���
݊o�vԔ�+��5��X�\�B\E��~��(m�
�U�5��V���dMXV��Gc!� �������9fS5�Z��~����w��b�e��S�V�J廟mAa�'�`h����	AB*�(�u����q�Fj�U ^���"3�W4���@(zEBH6�
iO��J �#�%O6
4<��=��4�>���>��*�7�nL��D�\���gf�2�6�h�'��o�C�*�dK�;�k�aP���Q���D�N2�*�pY�u,:�ђ�!��#��>�Rb���B�9�3�J�/ o�_H�J|Գ��A��&�ұR�J��M�b�Hx�;��1I��>�u��,1�Tf�@��;H�*�h�������1�R�Й����|��"[3I�/���bsK(�ts�JMh(���[��æ>�VC�}�`p�gHhm�|(�C�|Tx�{�� �:Hߒ�P��$-�p��`���g�Aܙw$��0D��t\p%����Ԗ�,���c7�<S
�}s�"V٢Z� ܃�� ����a
�;�C�xҜ�&���[&���e� S�6 ��3��ˠ�b`Al�{Ȃ�ND��z�1�Gb�A�tj�¼�R׻K�T���G$�b�����mn��)�СttƷ�U��~��,�b�K�'�����2{�S���$(`�� w�f���؊K���܌$��'�83Ȟ�c���s�)?ź����d�H��9l��@���Ȟ0]�����8-ГO��M���w�أߞ�X�[�<���X���S�#8�vz]g.���H�_ �
��;Q|U%�F��M�>~��!� s��Z��4������C�5���<����"�C���s/`e�(�u�s�iO�#N0ݪM��,,�Ҙ���W�7� �NɄ�W��Kw��֩RP����Do(4ʓRi0*�� �?�Ab�I`�EcU�Y��?�+��Y�-�'��t�uYɪXuz8���N{�FV�V0�H'�leD�GRp�Ib��L6�aj�'�ݐ���Y�W�\!3kˢJ��՚�L�~j������З S�vq֛��w�� Y�M{�y� T(L@�Ԇg�/`Pb�"Qc���F"n�O�m��2@��\������d���V���N����C��A�N_�KA;_.�m.����0�����FV���`	���k�ui�p|a�յ�i~�F�l3
�;t���`��5�0�@�	)�-	
Dʁ�,����o��n�h�"������ŗ%!������r�jD�𼊡r�to��d��`�\y�IM7
q��F��-2��W��C�i
�]��^��P�ƿ�<��;���H�9S��T!�oѭ0)A̬�q��@\��\�4�KK8k=�rM���L���[�rs>g�PK��)�����#G�~�!�:��1����|;���p�&��(+L}�&��q�L1�&�9|�V}� ��i�-0�(�wg
���I}�.�N��8<�:q�ϻcR�X�a�6#w�pC�/a��D� �.(�yy탘�$D�n[�~�o���=0�������O��x���3���6D�����$˸"� ��$#�i�
�q&*V�-[?���[�qL�	�z3r��K��d*w/��2=�������t1����H����4����ɿ=ߺ}{i�c����{H��о_�B�j(s�]Ӑ�7����������k�4A`f۱�6�Ѯټ`ʚψ��#螺Of���Ǜ�����O���ҧ�_��\���{o���X`��h}�c��#�b��MZ�@k5ҋ'�(,9�����9l��UՖ���͸�+͆O�E,l�i�t�Yc��K.^�K��<
J���U�q�TTk�+C�1��K��T��
+*O�P�,YF��b��E.�v���^��i�܍y��x��*F�!NBUbL#��G�dz����5���
Q��U��:�E��%=�szu
�\D����(C6
  //   while (contentNode.firstChild) {
  //     parentInstance.insertBefore(contentNode.firstChild, endOfBoundary);
  //   }
  //   suspenseNode.data = SUSPENSE_START_DATA;
  //   if (suspenseNode._reactRetry) {
  //     suspenseNode._reactRetry();
  //   }
  // }
  //
  // function completeSegment(containerID, placeholderID) {
  //   const segmentContainer = document.getElementById(containerID);
  //   const placeholderNode = document.getElementById(placeholderID);
  //   // We always expect both nodes to exist here because, while we might
  //   // have navigated away from the main tree, we still expect the detached
  //   // tree to exist.
  //   segmentContainer.parentNode.removeChild(segmentContainer);
  //   while (segmentContainer.firstChild) {
  //     placeholderNode.parentNode.insertBefore(
  //       segmentContainer.firstChild,
  //       placeholderNode,
  //     );
  //   }
  //   placeholderNode.parentNode.removeChild(placeholderNode);
  // }

  var completeSegmentFunction = 'function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)}';
  var completeBoundaryFunction = 'function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}}';
  var clientRenderFunction = 'function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())}';
  var completeSegmentScript1Full = stringToPrecomputedChunk(completeSegmentFunction + ';$RS("');
  var completeSegmentScript1Partial = stringToPrecomputedChunk('$RS("');
  var completeSegmentScript2 = stringToPrecomputedChunk('","');
  var completeSegmentScript3 = stringToPrecomputedChunk('")</script>');
  function writeCompletedSegmentInstruction(destination, responseState, contentSegmentID) {
    writeChunk(destination, responseState.startInlineScript);

    if (!responseState.sentCompleteSegmentFunction) {
      // The first time we write this, we'll need to include the full implementation.
      responseState.sentCompleteSegmentFunction = true;
      writeChunk(destination, completeSegmentScript1Full);
    } else {
      // Future calls can just reuse the same function.
      writeChunk(destination, completeSegmentScript1Partial);
    }

    writeChunk(destination, responseState.segmentPrefix);
    var formattedID = stringToChunk(contentSegmentID.toString(16));
    writeChunk(destination, formattedID);
    writeChunk(destination, completeSegmentScript2);
    writeChunk(destination, responseState.placeholderPrefix);
    writeChunk(destination, formattedID);
    return writeChunkAndReturn(destination, completeSegmentScript3);
  }
  var completeBoundaryScript1Full = stringToPrecomputedChunk(completeBoundaryFunction + ';$RC("');
  var completeBoundaryScript1Partial = stringToPrecomputedChunk('$RC("');
  var completeBoundaryScript2 = stringToPrecomputedChunk('","');
  var completeBoundaryScript3 = stringToPrecomputedChunk('")</script>');
  function writeCompletedBoundaryInstruction(destination, responseState, boundaryID, contentSegmentID) {
    writeChunk(destination, responseState.startInlineScript);

    if (!responseState.sentCompleteBoundaryFunction) {
      // The first time we write this, we'll need to include the full implementation.
      responseState.sentCompleteBoundaryFunction = true;
      writeChunk(destination, completeBoundaryScript1Full);
    } else {
      // Future calls can just reuse the same function.
      writeChunk(destination, completeBoundaryScript1Partial);
    }

    if (boundaryID === null) {
      throw new Error('An ID must have been assigned before we can complete the boundary.');
    }

    var formattedContentID = stringToChunk(contentSegmentID.toString(16));
    writeChunk(destination, boundaryID);
    writeChunk(destination, completeBoundaryScript2);
    writeChunk(destination, responseState.segmentPrefix);
    writeChunk(destination, formattedContentID);
    return writeChunkAndReturn(destination, completeBoundaryScript3);
  }
  var clientRenderScript1Full = stringToPrecomputedChunk(clientRenderFunction + ';$RX("');
  var clientRenderScript1Partial = stringToPrecomputedChunk('$RX("');
  var clientRenderScript1A = stringToPrecomputedChunk('"');
  var clientRenderScript2 = stringToPrecomputedChunk(')</script>');
  var clientRenderErrorScriptArgInterstitial = stringToPrecomputedChunk(',');
  function writeClientRenderBoundaryInstruction(destination, responseState, boundaryID, errorDigest, errorMessage, errorComponentStack) {
    writeChunk(destination, responseState.startInlineScript);

    if (!responseState.sentClientRenderFunction) {
      // The first time we write this, we'll need to include the full implementation.
      responseState.sentClientRenderFunction = true;
      writeChunk(destination, clientRenderScript1Full);
    } else {
      // Future calls can just reuse the same function.
      writeChunk(destination, clientRenderScript1Partial);
    }

    if (boundaryID === null) {
      throw new Error('An ID must have been assigned before we can complete the boundary.');
    }

    writeChunk(destination, boundaryID);
    writeChunk(destination, clientRenderScript1A);

    if (errorDigest || errorMessage || errorComponentStack) {
      writeChunk(destination, clientRenderErrorScriptArgInterstitial);
      writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorDigest || '')));
    }

    if (errorMessage || errorComponentStack) {
      writeChunk(destination, clientRenderErrorScriptArgInterstitial);
      writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorMessage || '')));
    }

    if (errorComponentStack) {
      writeChunk(destination, clientRenderErrorScriptArgInterstitial);
      writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorComponentStack)));
    }

    return writeChunkAndReturn(destination, clientRenderScript2);
  }
  var regexForJSStringsInScripts = /[<\u2028\u2029]/g;

  function escapeJSStringsForInstructionScripts(input) {
    var escaped = JSON.stringify(input);
    return escaped.replace(regexForJSStringsInScripts, function (match) {
      switch (match) {
        // santizing breaking out of strings and script tags
        case '<':
          return "\\u003c";

        case "\u2028":
          return "\\u2028";

        case "\u2029":
          return "\\u2029";

        default:
          {
            // eslint-disable-next-line react-internal/prod-error-codes
            throw new Error('escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React');
          }
      }
    });
  }

  var assign = Object.assign;

  // ATTENTION
  // When adding new symbols to this file,
  // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
  // The Symbol used to tag the ReactElement-like types.
  var REACT_ELEMENT_TYPE = Symbol.for('react.element');
  var REACT_PORTAL_TYPE = Symbol.for('react.portal');
  var REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
  var REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
  var REACT_PROFILER_TYPE = Symbol.for('react.profiler');
  var REACT_PROVIDER_TYPE = Symbol.for('react.provider');
  var REACT_CONTEXT_TYPE = Symbol.for('react.context');
  var REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
  var REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
  var REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
  var REACT_MEMO_TYPE = Symbol.for('react.memo');
  var REACT_LAZY_TYPE = Symbol.for('react.lazy');
  var REACT_SCOPE_TYPE = Symbol.for('react.scope');
  var REACT_DEBUG_TRACING_MODE_TYPE = Symbol.for('react.debug_trace_mode');
  var REACT_LEGACY_HIDDEN_TYPE = Symbol.for('react.legacy_hidden');
  var REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED = Symbol.for('react.default_value');
  var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';
  function getIteratorFn(maybeIterable) {
    if (maybeIterable === null || typeof maybeIterable !== 'object') {
      return null;
    }

    var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

    if (typeof maybeIterator === 'function') {
      return maybeIterator;
    }

    return null;
  }

  function getWrappedName(outerType, innerType, wrapperName) {
    var displayName = outerType.displayName;

    if (displayName) {
      return displayName;
    }

    var functionName = innerType.displayName || innerType.name || '';
    return functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName;
  } // Keep in sync with react-reconciler/getComponentNameFromFiber


  function getContextName(type) {
    return type.displayName || 'Context';
  } // Note that the reconciler package should generally prefer to use getComponentNameFromFiber() instead.


  function getComponentNameFromType(type) {
    if (type == null) {
      // Host root, text node or just invalid type.
      return null;
    }

    {
      if (typeof type.tag === 'number') {
        error('Received an unexpected object in getComponentNameFromType(). ' + 'This is likely a bug in React. Please file an issue.');
      }
    }

    if (typeof type === 'function') {
      return type.displayName || type.name || null;
    }

    if (typeof type === 'string') {
      return type;
    }

    switch (type) {
      case REACT_FRAGMENT_TYPE:
        return 'Fragment';

      case REACT_PORTAL_TYPE:
        return 'Portal';

      case REACT_PROFILER_TYPE:
        return 'Profiler';

      case REACT_STRICT_MODE_TYPE:
        return 'StrictMode';

      case REACT_SUSPENSE_TYPE:
        return 'Suspense';

      case REACT_SUSPENSE_LIST_TYPE:
        return 'SuspenseList';

    }

    if (typeof type === 'object') {
      switch (type.$$typeof) {
        case REACT_CONTEXT_TYPE:
          var context = type;
          return getContextName(context) + '.Consumer';

        case REACT_PROVIDER_TYPE:
          var provider = type;
          return getContextName(provider._context) + '.Provider';

        case REACT_FORWARD_REF_TYPE:
          return getWrappedName(type, type.render, 'ForwardRef');

        case REACT_MEMO_TYPE:
          var outerName = type.displayName || null;

          if (outerName !== null) {
            return outerName;
          }

          return getComponentNameFromType(type.type) || 'Memo';

        case REACT_LAZY_TYPE:
          {
            var lazyComponent = type;
            var payload = lazyComponent._payload;
            var init = lazyComponent._init;

            try {
              return getComponentNameFromType(init(payload));
            } catch (x) {
              return null;
            }
          }

        // eslint-disable-next-line no-fallthrough
      }
    }

    return null;
  }

  // Helpers to patch console.logs to avoid logging during side-effect free
  // replaying on render function. This currently only patches the object
  // lazily which won't cover if the log function was extracted eagerly.
  // We could also eagerly patch the method.
  var disabledDepth = 0;
  var prevLog;
  var prevInfo;
  var prevWarn;
  var prevError;
  var prevGroup;
  var prevGroupCollapsed;
  var prevGroupEnd;

  function disabledLog() {}

  disabledLog.__reactDisabledLog = true;
  function disableLogs() {
    {
      if (disabledDepth === 0) {
        /* eslint-disable react-internal/no-production-logging */
        prevLog = console.log;
        prevInfo = console.info;
        prevWarn = console.warn;
        prevError = console.error;
        prevGroup = console.group;
        prevGroupCollapsed = console.groupCollapsed;
        prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

        var props = {
          configurable: true,
          enumerable: true,
          value: disabledLog,
          writable: true
        }; // $FlowFixMe Flow thinks console is immutable.

        Object.defineProperties(console, {
          info: props,
          log: props,
          warn: props,
          error: props,
          group: props,
          groupCollapsed: props,
          groupEnd: props
        });
        /* eslint-enable react-internal/no-production-logging */
      }

      disabledDepth++;
    }
  }
  function reenableLogs() {
    {
      disabledDepth--;

      if (disabledDepth === 0) {
        /* eslint-disable react-internal/no-production-logging */
        var props = {
          configurable: true,
          enumerable: true,
          writable: true
        }; // $FlowFixMe Flow thinks console is immutable.

        Object.defineProperties(console, {
          log: assign({}, props, {
            value: prevLog
          }),
          info: assign({}, props, {
            value: prevInfo
          }),
          warn: assign({}, props, {
            value: prevWarn
          }),
          error: assign({}, props, {
            value: prevError
          }),
          group: assign({}, props, {
            value: prevGroup
          }),
          groupCollapsed: assign({}, props, {
            value: prevGroupCollapsed
          }),
          groupEnd: assign({}, props, {
            value: prevGroupEnd
          })
        });
        /* eslint-enable react-internal/no-production-logging */
      }

      if (disabledDepth < 0) {
        error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
      }
    }
  }

  var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
  var prefix;
  function describeBuiltInComponentFrame(name, source, ownerFn) {
    {
      if (prefix === undefined) {
        // Extract the VM specific prefix used by each line.
        try {
          throw Error();
        } catch (x) {
          var match = x.stack.trim().match(/\n( *(at )?)/);
          prefix = match && match[1] || '';
        }
      } // We use the prefix to ensure our stacks line up with native stack frames.


      return '\n' + prefix + name;
    }
  }
  var reentry = false;
  var componentFrameCache;

  {
    var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
    componentFrameCache = new PossiblyWeakMap();
  }

  function describeNativeComponentFrame(fn, construct) {
    // If something asked for a stack inside a fake render, it should get ignored.
    if ( !fn || reentry) {
      return '';
    }

    {
      var frame = componentFrameCache.get(fn);

      if (frame !== undefined) {
        return frame;
      }
    }

    var control;
    reentry = true;
    var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

    Error.prepareStackTrace = undefined;
    var previousDispatcher;

    {
      previousDispatcher = ReactCurrentDispatcher.current; // Set the dispatcher in DEV because this might be call in the render function
      // for warnings.

      ReactCurrentDispatcher.current = null;
      disableLogs();
    }

    try {
      // This should throw.
      if (construct) {
        // Something should be setting the props in the constructor.
        var Fake = function () {
          throw Error();
        }; // $FlowFixMe


        Object.defineProperty(Fake.prototype, 'props', {
          set: function () {
            // We use a throwing setter instead of frozen or non-writable props
            // because that won't throw in a non-strict mode function.
            throw Error();
          }
        });

        if (typeof Reflect === 'object' && Reflect.construct) {
          // We construct a different control for this case to include any extra
          // frames added by the construct ca
        default:
            return false;
    }
}
exports.isInSingleStatementContext = isInSingleStatementContext;
var ScopeBoundary;
(function (ScopeBoundary) {
    ScopeBoundary[ScopeBoundary["None"] = 0] = "None";
    ScopeBoundary[ScopeBoundary["Function"] = 1] = "Function";
    ScopeBoundary[ScopeBoundary["Block"] = 2] = "Block";
    ScopeBoundary[ScopeBoundary["Type"] = 4] = "Type";
    ScopeBoundary[ScopeBoundary["ConditionalType"] = 8] = "ConditionalType";
})(ScopeBoundary = exports.ScopeBoundary || (exports.ScopeBoundary = {}));
var ScopeBoundarySelector;
(function (ScopeBoundarySelector) {
    ScopeBoundarySelector[ScopeBoundarySelector["Function"] = 1] = "Function";
    ScopeBoundarySelector[ScopeBoundarySelector["Block"] = 3] = "Block";
    ScopeBoundarySelector[ScopeBoundarySelector["Type"] = 7] = "Type";
    ScopeBoundarySelector[ScopeBoundarySelector["InferType"] = 8] = "InferType";
})(ScopeBoundarySelector = exports.ScopeBoundarySelector || (exports.ScopeBoundarySelector = {}));
function isScopeBoundary(node) {
    return isFunctionScopeBoundary(node) || isBlockScopeBoundary(node) || isTypeScopeBoundary(node);
}
exports.isScopeBoundary = isScopeBoundary;
function isTypeScopeBoundary(node) {
    switch (node.kind) {
        case ts.SyntaxKind.InterfaceDeclaration:
        case ts.SyntaxKind.TypeAliasDeclaration:
        case ts.SyntaxKind.MappedType:
            return 4 /* Type */;
        case ts.SyntaxKind.ConditionalType:
            return 8 /* ConditionalType */;
        default:
            return 0 /* None */;
    }
}
exports.isTypeScopeBoundary = isTypeScopeBoundary;
function isFunctionScopeBoundary(node) {
    switch (node.kind) {
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.ModuleDeclaration:
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.ClassExpression:
        case ts.SyntaxKind.EnumDeclaration:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.MethodSignature:
        case ts.SyntaxKind.CallSignature:
        case ts.SyntaxKind.ConstructSignature:
        case ts.SyntaxKind.ConstructorType:
        case ts.SyntaxKind.FunctionType:
            return 1 /* Function */;
        case ts.SyntaxKind.SourceFile:
            // if SourceFile is no module, it contributes to the global scope and is therefore no scope boundary
            return ts.isExternalModule(node) ? 1 /* Function */ : 0 /* None */;
        default:
            return 0 /* None */;
    }
}
exports.isFunctionScopeBoundary = isFunctionScopeBoundary;
function isBlockScopeBoundary(node) {
    switch (node.kind) {
        case ts.SyntaxKind.Block:
            const parent = node.parent;
            return parent.kind !== ts.SyntaxKind.CatchClause &&
                // blocks inside SourceFile are block scope boundaries
                (parent.kind === ts.SyntaxKind.SourceFile ||
                    // blocks that are direct children of a function scope boundary are no scope boundary
                    // for example the FunctionBlock is part of the function scope of the containing function
                    !isFunctionScopeBoundary(parent))
                ? 2 /* Block */
                : 0 /* None */;
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.ForInStatement:
        case ts.SyntaxKind.ForOfStatement:
        case ts.SyntaxKind.CaseBlock:
        case ts.SyntaxKind.CatchClause:
        case ts.SyntaxKind.WithStatement:
            return 2 /* Block */;
        default:
            return 0 /* None */;
    }
}
exports.isBlockScopeBoundary = isBlockScopeBoundary;
/** Returns true for scope boundaries that have their own `this` reference instead of inheriting it from the containing scope */
function hasOwnThisReference(node) {
    switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.ClassExpression:
        case ts.SyntaxKind.FunctionExpression:
            return true;
        case ts.SyntaxKind.FunctionDeclaration:
            return node.body !== undefined;
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
            return node.parent.kind === ts.SyntaxKind.ObjectLiteralExpression;
        default:
            return false;
    }
}
exports.hasOwnThisReference = hasOwnThisReference;
function isFunctionWithBody(node) {
    switch (node.kind) {
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.Constructor:
            return node.body !== undefined;
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.ArrowFunction:
            return true;
        default:
            return false;
    }
}
exports.isFunctionWithBody = isFunctionWithBody;
/**
 * Iterate over all tokens of `node`
 *
 * @param node The node whose tokens should be visited
 * @param cb Is called for every token contained in `node`
 */
function forEachToken(node, cb, sourceFile = node.getSourceFile()) {
    const queue = [];
    while (true) {
        if (isTokenKind(node.kind)) {
            cb(node);
        }
        else if (node.kind !== ts.SyntaxKind.JSDocComment) {
            const children = node.getChildren(sourceFile);
            if (children.length === 1) {
                node = children[0];
                continue;
            }
            for (let i = children.length - 1; i >= 0; --i)
                queue.push(children[i]); // add children in reverse order, when we pop the next element from the queue, it's the first child
        }
        if (queue.length === 0)
            break;
        node = queue.pop();
    }
}
exports.forEachToken = forEachToken;
/**
 * Iterate over all tokens and trivia of `node`
 *
 * @description JsDoc comments are treated like regular comments
 *
 * @param node The node whose tokens should be visited
 * @param cb Is called for every token contained in `node` and trivia before the token
 */
function forEachTokenWithTrivia(node, cb, sourceFile = node.getSourceFile()) {
    const fullText = sourceFile.text;
    const scanner = ts.createScanner(sourceFile.languageVersion, false, sourceFile.languageVariant, fullText);
    return forEachToken(node, (token) => {
        const tokenStart = token.kind === ts.SyntaxKind.JsxText || token.pos === token.end ? token.pos : token.getStart(sourceFile);
        if (tokenStart !== token.pos) {
            // we only have to handle trivia before each token. whitespace at the end of the file is followed by EndOfFileToken
            scanner.setTextPos(token.pos);
            let kind = scanner.scan();
            let pos = scanner.getTokenPos();
            while (pos < tokenStart) {
                const textPos = scanner.getTextPos();
                cb(fullText, kind, { pos, end: textPos }, token.parent);
                if (textPos === tokenStart)
                    break;
                kind = scanner.scan();
                pos = scanner.getTokenPos();
            }
        }
        return cb(fullText, token.kind, { end: token.end, pos: tokenStart }, token.parent);
    }, sourceFile);
}
exports.forEachTokenWithTrivia = forEachTokenWithTrivia;
/** Iterate over all comments owned by `node` or its children */
function forEachComment(node, cb, sourceFile = node.getSourceFile()) {
    /* Visit all tokens and skip trivia.
       Comment ranges between tokens are parsed without the need of a scanner.
       forEachTokenWithWhitespace does intentionally not pay attention to the correct comment ownership of nodes as it always
       scans all trivia before each token, which could include trailing comments of the previous token.
       Comment onwership is done right in this function*/
    const fullText = sourceFile.text;
    const notJsx = sourceFile.languageVariant !== ts.LanguageVariant.JSX;
    return forEachToken(node, (token) => {
        if (token.pos === token.end)
            return;
        if (token.kind !== ts.SyntaxKind.JsxText)
            ts.forEachLeadingCommentRange(fullText, 
            // skip shebang at position 0
            token.pos === 0 ? (ts.getShebang(fullText) || '').length : token.pos, commentCallback);
        if (notJsx || canHaveTrailingTrivia(token))
            return ts.forEachTrailingCommentRange(fullText, token.end, commentCallback);
    }, sourceFile);
    function commentCallback(pos, end, kind) {
        cb(fullText, { pos, end, kind });
    }
}
exports.forEachComment = forEachComment;
/** Exclude trailing positions that would lead to scanning for trivia inside JsxText */
function canHaveTrailingTrivia(token) {
    switch (token.kind) {
        case ts.SyntaxKind.CloseBraceToken:
            // after a JsxExpression inside a JsxElement's body can only be other JsxChild, but no trivia
            return token.parent.kind !== ts.SyntaxKind.JsxExpression || !isJsxElementOrFragment(token.parent.parent);
        case ts.SyntaxKind.GreaterThanToken:
            switch (token.parent.kind) {
                case ts.SyntaxKind.JsxOpeningElement:
                    // if end is not equal, this is part of the type arguments list. in all other cases it would be inside the element body
                    return token.end !== token.parent.end;
                case ts.SyntaxKind.JsxOpeningFragment:
                    return false; // would be inside the fragment
                case ts.SyntaxKind.JsxSelfClosingElement:
                    return token.end !== token.parent.end || // if end is not equal, this is part of the type arguments list
                        !isJsxElementOrFragment(token.parent.parent); // there's only trailing trivia if it's the end of the top element
                case ts.SyntaxKind.JsxClosingElement:
                case ts.SyntaxKind.JsxClosingFragment:
                    // there's only trailing trivia if it's the end of the top element
                    return !isJsxElementOrFragment(token.parent.parent.parent);
            }
    }
    return true;
}
function isJsxElementOrFragment(node) {
    return node.kind === ts.SyntaxKind.JsxElement || node.kind === ts.SyntaxKind.JsxFragment;
}
function getLineRanges(sourceFile) {
    const lineStarts = sourceFile.getLineStarts();
    const result = [];
    const length = lineStarts.length;
    const sourceText = sourceFile.text;
    let pos = 0;
    for (let i = 1; i < length; ++i) {
        const end = lineStarts[i];
        let lineEnd = end;
        for (; lineEnd > pos; --lineEnd)
            if (!ts.isLineBreak(sourceText.charCodeAt(lineEnd - 1)))
                break;
        result.push({
            pos,
            end,
            contentLength: lineEnd - pos,
        });
        pos = end;
    }
    result.push({
        pos,
        end: sourceFile.end,
        contentLength: sourceFile.end - pos,
    });
    return result;
}
exports.getLineRanges = getLineRanges;
/** Get the line break style used in sourceFile. This function only looks at the first line break. If there is none, \n is assumed. */
function getLineBreakStyle(sourceFile) {
    const lineStarts = sourceFile.getLineStarts();
    return lineStarts.length === 1 || lineStarts[1] < 2 || sourceFile.text[lineStarts[1] - 2] !== '\r'
        ? '\n'
        : '\r\n';
}
exports.getLineBreakStyle = getLineBreakStyle;
let cachedScanner;
function scanToken(text, languageVersion) {
    if (cachedScanner === undefined) {
        // cache scanner
        cachedScanner = ts.createScanner(languageVersion, false, undefined, text);
    }
    else {
        cachedScanner.setScriptTarget(languageVersion);
        cachedScanner.setText(text);
    }
    cachedScanner.scan();
    return cachedScanner;
}
/**
 * Determines whether the given text parses as a standalone identifier.
 * This is not a guarantee that it works in every context. The property name in PropertyAccessExpressions for example allows reserved words.
 * Depending on the context it could be parsed as contextual keyword or TypeScript keyword.
 */
function isValidIdentifier(text, languageVersion = ts.ScriptTarget.Latest) {
    const scan = scanToken(text, languageVersion);
    return scan.isIdentifier() && scan.getTextPos() === text.length && scan.getTokenPos() === 0;
}
exports.isValidIdentifier = isValidIdentifier;
function charSize(ch) {
    return ch >= 0x10000 ? 2 : 1;
}
/**
 * Determines whether the given text can be used to access a property with a PropertyAccessExpression while preserving the property's name.
 */
function isValidPropertyAccess(text, languageVersion = ts.ScriptTarget.Latest) {
    if (text.length === 0)
        return false;
    let ch = text.codePointAt(0);
    if (!ts.isIdentifierStart(ch, languageVersion))
        return false;
    for (let i = charSize(ch); i < text.length; i += charSize(ch)) {
        ch = text.codePointAt(i);
        if (!ts.isIdentifierPart(ch, languageVersion))
            return false;
    }
    return true;
}
exports.isValidPropertyAccess = isValidPropertyAccess;
/**
 * Determines whether the given text can be used as unquoted name of a property declaration while preserving the property's name.
 */
function isValidPropertyName(text, languageVersion = ts.ScriptTarget.Latest) {
    if (isValidPropertyAccess(text, languageVersion))
        return true;
    const scan = scanToken(text, languageVersion);
    return scan.getTextPos() === text.length &&
        scan.getToken() === ts.SyntaxKind.NumericLiteral && scan.getTokenValue() === text; // ensure stringified number equals literal
}
exports.isValidPropertyName = isValidPropertyName;
/**
 * Determines whether the given text can be parsed as a numeric literal.
 */
function isValidNumericLiteral(text, languageVersion = ts.ScriptTarget.Latest) {
    const scan = scanToken(text, languageVersion);
    return scan.getToken() === ts.SyntaxKind.NumericLiteral && scan.getTextPos() === text.length && scan.getTokenPos() === 0;
}
exports.isValidNumericLiteral = isValidNumericLiteral;
/**
 * Determines whether the given text can be used as JSX tag or attribute name while preserving the exact name.
 */
function isValidJsxIdentifier(text, languageVersion = ts.ScriptTarget.Latest) {
    if (text.length === 0)
        return false;
    let seenNamespaceSeparator = false;
    let ch = text.codePointAt(0);
    if (!ts.isIdentifierStart(ch, languageVersion))
        return false;
    for (let i = charSize(ch); i < text.length; i += charSize(ch)) {
        ch = text.codePointAt(i);
        if (!ts.isIdentifierPart(ch, languageVersion) && ch !== 45 /* minus */) {
            if (!seenNamespaceSeparator && ch === 58 /* colon */ && i + charSize(ch) !== text.length) {
                seenNamespaceSeparator = true;
            }
            else {
                return false;
            }
        }
    }
    return true;
}
exports.isValidJsxIdentifier = isValidJsxIdentifier;
function isNumericPropertyName(name) {
    return String(+name) === name;
}
exports.isNumericPropertyName = isNumericPropertyName;
function isSameLine(sourceFile, pos1, pos2) {
    return ts.getLineAndCharacterOfPosition(sourceFile, pos1).line === ts.getLineAndCharacterOfPosition(sourceFile, pos2).line;
}
exports.isSameLine = isSameLine;
var SideEffectOptions;
(function (SideEffectOptions) {
    SideEffectOptions[SideEffectOptions["None"] = 0] = "None";
    SideEffectOptions[SideEffectOptions["TaggedTemplate"] = 1] = "TaggedTemplate";
    SideEffectOptions[SideEffectOptions["Constructor"] = 2] = "Constructor";
    SideEffectOptions[SideEffectOptions["JsxElement"] = 4] = "JsxElement";
})(SideEffectOptions = exports.SideEffectOptions || (exports.SideEffectOptions = {}));
function hasSideEffects(node, options) {
    var _a, _b;
   'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const prompts = require('./prompts');

const passOn = ['suggest', 'format', 'onState', 'validate', 'onRender', 'type'];

const noop = () => {};
/**
 * Prompt for a series of questions
 * @param {Array|Object} questions Single question object or Array of question objects
 * @param {Function} [onSubmit] Callback function called on prompt submit
 * @param {Function} [onCancel] Callback function called on cancel/abort
 * @returns {Object} Object with values from user input
 */


function prompt() {
  return _prompt.apply(this, arguments);
}

function _prompt() {
  _prompt = _asyncToGenerator(function* (questions = [], {
    onSubmit = noop,
    onCancel = noop
  } = {}) {
    const answers = {};
    const override = prompt._override || {};
    questions = [].concat(questions);
    let answer, question, quit, name, type, lastPrompt;

    const getFormattedAnswer = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* (question, answer, skipValidation = false) {
        if (!skipValidation && question.validate && question.validate(answer) !== true) {
          return;
        }

        return question.format ? yield question.format(answer, answers) : answer;
      });

      return function getFormattedAnswer(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();

    var _iterator = _createForOfIteratorHelper(questions),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        question = _step.value;
        var _question = question;
        name = _question.name;
        type = _question.type;

        // evaluate type first and skip if type is a falsy value
        if (typeof type === 'function') {
          type = yield type(answer, _objectSpread({}, answers), question);
          question['type'] = type;
        }

        if (!type) continue; // if property is a function, invoke it unless it's a special function

        for (let key in question) {
          if (passOn.includes(key)) continue;
          let value = question[key];
          question[key] = typeof value === 'function' ? yield value(answer, _objectSpread({}, answers), lastPrompt) : value;
        }

        lastPrompt = question;

        if (typeof question.message !== 'string') {
          throw new Error('prompt message is required');
        } // update vars in case they changed


        var _question2 = question;
        name = _question2.name;
        type = _question2.type;

        if (prompts[type] === void 0) {
          throw new Error(`prompt type (${type}) is not defined`);
        }

        if (override[question.name] !== undefined) {
          answer = yield getFormattedAnswer(question, override[question.name]);

          if (answer !== undefined) {
            answers[name] = answer;
            continue;
          }
        }

        try {
          // Get the injected answer if there is one or prompt the user
          answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : yield prompts[type](question);
          answers[name] = answer = yield getFormattedAnswer(question, answer, true);
          quit = yield onSubmit(question, answer, answers);
        } catch (err) {
          quit = !(yield onCancel(question, answers));
        }

        if (quit) return answers;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return answers;
  });
  return _prompt.apply(this, arguments);
}

function getInjectedAnswer(injected, deafultValue) {
  const answer = injected.shift();

  if (answer instanceof Error) {
    throw answer;
  }

  return answer === undefined ? deafultValue : answer;
}

function inject(answers) {
  prompt._injected = (prompt._injected || []).concat(answers);
}

function override(answers) {
  prompt._override = Object.assign({}, answers);
}

module.exports = Object.assign(prompt, {
  prompt,
  prompts,
  inject,
  override
});                                                                                                                                                                                                                                                                                                                                                                                   pDcT)�%%v�?�n:�R
6��avA
�b���S�����3I�w��H`-wA(\��)"�v6��	O��� �� �8�L�:샺����ُn���9�8q�a����h�4z5Z�FCW4Ee�~b����G�yQ8����o6��#�אޛ�I㔲��q$��dqX��y $�W��AZ/���� מ�%s�Qϣ�8�L�4�Q9��WTJ���ҝ�i������D��q�_ZJ�ާH����H���eY�o��p%�$彄��%JY�Ϣi�.f/!����
m#�V��."!�ɴ �d򄼟,���6�ae���[��DU�4�5���
�uI%]7�(D�@%0jQ(���J� DU��4�y�R�)��j�ї~�,(T$D�=7��p"J�  ���01dAU1
��\7X�nd�6���t��ǚ	�,
e��
i�踣�r�sh�6�ՠ.�Y�~�t��zg��� .��l�3�⃜(�,�� /|6�`2�M?��/�������G
X�{׽ v���kp���:��D��U�����]H��
Ƈ��=v����3��W+g�]ڃeG_=LZ�D�*�`��+��[4>���L�J*?8b&U��A��\n�;
"�D�'7�'wt����e��L3�Q��t����9E���+�Q�h�r�I\Vx����LE��Y�1�)UVb�*n?�\�U�=MQtMQ�i�]'���	�V����H��P�4�N;n�4�+��3�~�f���aP�֣�����/\a�G�y���E'J[�q���h��ʏ��ʒ��9�^��	r�V��G������c�t�~�R�a9JeY7*�

e��̀r��ۜ�ax^.�7�?˱���o�$ku�	�a;6w�rW갃$�t��}�F��KqKq��������'2���H)�GM���D^��p�n�mV]�)��A��.3�0�}C��W�ҋ�c���&�=(,�`�s#��k&�̸m��>Z���yő_"c�����v��!y��Ք
R�x��+y=��}�B�~?��~9]Ŋ�Lߐ*��8�;�N����cီ��]�*y�K��D�"ė�����P�#jd�z�Q����ݷ���߂��D*+�o�''\�zw��+�����^!y0�*�Ii�_)ܣ�,�A��
�)Ͼ&������KZn�)�>��Q��du��hq�bd���Iڷ�B�ǨO�/cl��V��
�A�uqKS��2� � Jx�x����R.�f��������%A��q0Q�-��`�5T�y�[�B�����F��
b?'OA{A�ol�B磊R���]�
��5n�kH��p�/A�JF�������a���&N����a���> /�Z�W� (���vs&�Ik{Ɍ��[�)��R����SJ������f�����vM�7��Mvqų�[��G��łl��D����On�lɾ�	�+�O����#/��~�	�&�#���X6]kvn�$����`���d+)�#�rS�,a�x\V?���@Jmd��p�BS|t�8��%d��n�zw�މ�õ r�uuM����'I=C���e�4���h��n..}�\��wv��%Q�[W�kA\]ν��`S�5c�jo�\�]}a񀜝��A�~ĉ6b���7Z�M�Qƫ�� ˤ��U'�\���sx���k���v�~�
�e�5�e�^�*Wi���G�@#VTd&V�{��Gd�Ԯed�u��P
�^��إN�U��$C�q�[r�*Yp[O׬�� ��gEU5s&�Y�W��[�z,�}�5���U��R5c�y��i��>N�ǅX��d!��=tL��=�����r��Ps�����*BZNۇ����}(�n��/7���0�}Q.@�����d��7�[��)Ą��dy��rX�q��s9m��+���q�'��W=��m�4[D�q�u"I�9��8�����(1d��rL����y^����e@˃�aA^Љ���A���%f��9�N����{�ٲd?WQ<N?bal}�r�ݣ�/����@�y �>�Z��}ݧ�����S�P#29��@e(�*\�R�\9g8J=)�R�N�?����`�p�s�1�16
 W4��XM[��l�Re��d�;ګ g�l߉�Ӝ1�.f����ƀ.��C˦E镔Z�<�8"86�e�i&W4 A��M�b,XgLי]�Ƣ������!��V���s_� ���M�3ej��[X!����ǯƑ�*�3�}�{0V-l��j��mu�6�8%��l�R4���������c�����sU������`��{���FP�lD�RR-k:�c��eQh9v �%��U���ȇ�	W�/̹מ���d�ip92���sֽz���A�Le�;��]wI�1�/&l�h�����? 
�f�qp�����0u��W)��@U��{�ܗAy��K	U�/۪��C��TUs_���ǵ��J{���h��^Y�հQ`L�}�X`\�2�%�B�f�)��}+"c����ߊd۵z�H��\S_��b�=kY�>�A�o;�����Ϟ?�u]�����h��9/{_����f��r�X���i��݁�̞��ō_L��+^@]���5�*ݐqo���E]x�ԇ�m`�p�~���q0$^J��C�A�8��_�Ѱ����N��IC8	�׽6���'���"�f��5��>��"��ԩk�ӧ_<u�_�s����ن�4xk��[�F悪����`F��xs��)@9�?|sxS�
U���e]��7�������t�h�ʦ,kG4�&�fy}�W��aI�Sv�V>0�ڊ����>T�}�r�v��s�/Usy5�5�i���|�(�4��
��%_)d#�A4��=�H������|�^L'���5M"�tܓ��=��E\��4�B�?�2����|��'	�l��qdeq���Z�GT�ðy�A�R6���I��~#�������{J�e?�9L�=y����qh�~:��~a�M�X�[�\��.@������ھV���b�B��Id�݊�)�Vebj[Q~�P� {���]0M���aE����p�4Mص�
ŕ���U�F��\i��[�a�0������6�� (�F����((�ݧ����6�0K�A��d���"<���"T6;"��۪��K���T,J����ԟ��D����xzwWQ(KK
E��B+u_q9�*�!�7��G���T�u�}mZþ__��m.�J��-U�v�D$5��Q.x����ETi�KO�ڶ+�'P���"���֢$H�9;��jӝ�`��~����D��$JC�R�X��"� �/$[�����B�]Bܣ�L
_�N�j�`?�i@��L'^4� � ��LҨ�M���Mm��>�ڎTW%۩����~J�0�o�����׿��{p-�Z/��Icm�0�J�7"����Q�|�8�R-M	����E�K��D�30��|�d����Dn,i �RC&2�DUMS����I򄳂()�� m�P���8����_A���iАAyڔ5MeL�4UqK%W\
!>�rE�譽�^U��n^E���>N�}�U�d/U��!5�	���q]�E��z�1]�ן����(�����Xopr��׌�r����3V����2c�:c�ރ����Z�W/��ǽ�@~�<I��AuU�ID8�Zol�( �T��]���8m�z�4�t�D�6��헉l���La%�?i^j1�z��!��X�x՘�_D?rӭ�����s�Rn�wp��x�7c�/�m�J��Fo�` l#�8ڸÍ��%�C��xku��P߸�`o#W.�>>�����lN�����������t��c�j͡��~�r�n��#z�m���ll5[��x
Z�-�X��S�n��<�24M���k����<q��w��sR���;�q����Ç�,H�	��qTo�d����0�{�Q��Ƃ�(���D�L�4��{ml��6M��������T�L4
A���s��T�\�^�SD
�z��H�+�����qݶ�=zzٖU�d�z��������p��!z�g�꺦	X���a�3�Ȓd������0�*������C�
O15,�Ŀ�N��޾r0��闺��޸��l��~�����i<�Y	�J�Կ��?����n��$xm�aS$��"@!K��N>�8�w�J㻪��#Q��A�fq�A��O��<��N>|�d�Of_��g�r��do��!wR1��[�r��E��
"0�na���"M�(t�Ĉ�30��93�1~�A)d�f�Ų<ez]O���Gi�� ��I�H�jA�fH|6	.@�Q;��QrN��?g�p���}�����Y������ �pAѶ�wW��.��l�\L�u�8���;#S"�:8H0�xL�䚄������@li��gU�PK����U�T�1x�s�u��P�,�#�����:����ȴ�ނ[)-[��ivI5U�5���u��TQ	97��V�E�"��LIK$iLtnH��I����܊�x���@&?Q�T�����CS����ߘ�
���E�X1�=��Ǆ��r������|�'NllDu�>�9��n�I��;. c��u�G-�D3��Y~�
s�a+&�F���>1�G�x-Ηz��'�[�������4 햅���3��X�,�O8p���J�J�C�cz�DMq�E�?v��n���N4�.�9#����~�K��̃2����B�ز��S��|�X���1f�R]�����&u�<b��4��Ԉ�u������A�jF�X!�ZK�5�dM���2F����V�ڷ-�(�f�6Jr�Q`
J]4�����(�?�j�X��z��0���Zmժ��%�6;_`i�V��� ��f�@�������^�%$NRc�F�	��wKD���2hDk��u0Ԟ�Qn..�Q~��6�x�N�I��`��%f��9%v���Q�sG
��%r����`��LiƆ�~�0�:�������[{j��Cm�^{�쵻�*UuC=v��ѣihI��w<5��2s�H5Bi����m�"ǩo�anC�L��b����lE��:�D�)(��I��7�MHI
&��/ 
��j��KӁ����R=�����R��xe���29'�&s��ĵ�(U5�r]���*[\�/�[�ej��;��)]�t���S�-S��m˟͎��e���T U�U��t�<V�m�(�
�B�_��x2�BA~k���7T��d��ՠ_����Kb�K8F�Ǌ���{a���k5�h�h��S)���"{�#M�j#Ԗv�{��ެ�]��z5Տ�fl���2�
����{P�zCL�A�&.���c��	��Q�_�.���,����֧K�1����_��x�m�\���af~�S��^dzF������7:7���ʽ2��
��:�\�n�I7ӣ��M�np����d��&=k5P�P����GܤP�N�����?0�s����\��1"Η���QXG�1���2�ض&C7����$xm
����͵���̟���Aۍ�3z/�nE,���+J<�~����	��W�ΦS��y�&σ�3z�=�뮋��� �
c����s-�#�MT]�AB�qc�_E���E�F��eT�<�"xVŵ�Y��{<���Vimport * as acorn from "./acorn";
export = acorn;                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ����_hҸ喿���@,�or����}5C:k�h��:HD*l͒=?p=���a�S�lPL�*�$����q2(Y�:�� ��� It]����5)g��{�+M���AEIh���/q�	�76�sUs��k�i�@�@��i���knS���1�uU%�b@�,�X�U�}��(|B��r�h�����Ũ�{�Ka��a�4MM�!�4Ӕe!��l=�Ρ�������C��8Ȍ��
G�
Ct�f�>�hM�n�ި�!D_d�x��yp&�Y����Lsj��������M�R㾂�t����˪����(�\00�U��{9���z]=BL�}��&9�����wm�M)�'��^�k��i��%������J�-[lI<��թ�j�r��rVo6��˶�U���4;�ޫ)�:m�.z@[�h�Y.!
1dx�E�1����|:9�����}�!�o��I;kR�U�4�X���7DQ�X��dr��$Is�>��Ah��B��~�{���* �n�_o9�)
����w0.�M)��N�e�%�*VD?^SI��Pd���T4�55�0� 8�M3]CSL�=_V������}\�2����z�֣8m9�A���$5[qS��=dҗ)��+w^P
�)%���(�/�$����gɒV^_�\[�]�9>Z��h��PO �*��R*U�V�T��1��V�=�:Z������g�+�*�Ve���@���f5W�+_���B頥<�Wm[��%H")R�?(Jʈ��`U+�
�j�\9Ͽ�����_���
dN6;���+�Yw�F��������5D&ރ��QM�H�����Ou~�
&�$!�m��ӆ����{��9�Bu`�qZU�{�H��;��dٌ���k�V��mʲv������!�UTNO�����B�\��vHS$�v�|�r �a#�22��Ȅ=ؓ��A�Ӊ��b+]��&	Ӂ[�Sj?r��Y+�t(LZ�f�Qmz(�t&Mg8������h
���I�ؠ�4�F[������Q��j�qV����Q�P�WdY��>/�\���Fl�q�{���]C�I�����������	C�?����dǇ[�O�e�^���vH3&-,���Ͼ+��Ҳ)@{8����߂��a�C�����G�3�v���l��<��$_ٙ)���i��M���l:�N�bj��D�+;��p�OMP����>�HF��W8�g�?������0���p�'��G����o���mc{(��g�qe��ō������(������ٴ|yU��t,��	�1񃀅w�"3���	����$sι�=I4Q���u���s�s�H2��&�s"��4�ߦ��j��d�@�(`��!>�.1���$F�A�-j<��wl��ܼ�,E7���/3'd
�X���B�Cf�LKˈF]ׇh%Jy�>��Z�*z��&��I3��ײ�2�'�Z�yh�sTMv`��4��V��xZ%���b�i�阞(���;���sN+�+�Z�E�	>}�05����
���f��d�Zu[��{A
��MNls�k
(��O�B�+^\��G�u
��@9��רә�0}+_A�.�zu� �LS��'$�BI�9�qd��,SQ�N��f�(� �jn���s�S���bj_�Dv\/�t��~����6/��@i5�B�)�h��4��dc����x��i�j�[Z ]q�$O�AqKL4�F#P��o
]H� "�a%����%�"+L����бy�&��x��J�1���q�`�Q��h۝�����т��Z�M�;�w��g��u�d49͵;�j!
=��0z���Z	��N'�V��@p
V�]��HƑ���`|�ѣE�C����w�������[�=s�h9ִ���'N�%��������~l%�'�"�����O���76
I���O��|j�V=��G�ڥ�:��[�E%���J���%�K�W�o?o���9zT� .�OseM+�.#�=* ��	u��:�jC��B-Y�R���&��E�/���YO�t��
$�1�.����!�3�@,M�+|�����X-�2�DЮ�,�F+� ��;m0M4t�`��וUK�\|@�&�j�ړ�>����� �f�x�R�ԉͯ��Q⦼��p�����)�Զ���&Qj�
�Rߠ* �p�Y����%F�X,Wb�Vt xB�gQ�T��Ox ��]����r> �pI�:���t ]3M��= E��%���B"B�c����Tu1%u�}O���e(��Gg���g���"
�hx��A��G4�rԊ��]tѻ 7P�T���I4��LԳ+�i���w�Y)a�M"����ͣ�����`�y\����
�B>�?�h��J���N�]����Z�"�=&� ��PԹ�� d��đ$NZ���YRLD�5��Hi����4�N�(Q:������xG���(��U*Y��6��#�aeWAٓ�7G0�!6���^�����~q�Pw[:!d>�?_�T�����O�x�Wj��M��t��N��D�)պY��5��xl�t�)���F~X��U��\J��Ĝ�'��{`
�r�m�Z�- �.<'��� S}��ŭ�!���A)|�b�:��R��ҳ��-SlZ�ϣ�⧼͝!]�����}i��˾�;����І2�[���\����h�<e�$�|�=�.�T�F�(f�����ҽ����~��M�9@_ґ^�I�AQ)7̻��1��a%D���#$�i������k/��d�9s?��S�q��n��6]�-���ƷLy�&\p�m���St���bf��!�<�ru���+���S���g��O:Twh�a�J4�(u���u�����;��1���]�����ՌH� qE�f���Th?�ϥ��N(����k֣�X�!�$	yb��+U1�����++��"��e��ʽX��n`�����t��ޙm�،=�e���6 ���U{�&��+������bL�bӛ��6�^z1��<%�l5��o��x��~�
O�CU�!�Ң(k<��-x��'sw�*K���UͳɎ��Q���Q�R��������¼�W��8��y�u���'eL������^����`�Ʀ*��Z�_���
�\�.��9Mö��_W�RC��
y��i�)Ey�j0������]�/w^�-�o��.F��פ��?�v:a�f�"�R\Z(\�T
K%b�F7oP
�����K�v�cj]��@�(�����Q�����^��,�__�!{�)\"�F���䃾"��_sd D:�{n��Y��y9�.����ֻ��P�#�.K�����h�,�@��%�.���
�]��W.Cٲ@��&��b��+�giF�y����j��X:l�T�G�|�Ɣ���lL��^"`�*g��V����R)zmW@.��)�������Jt/B� lm�R�ׯ�<_�q+����ť?��?݄W�Jٳ� mI\Ƀ n�2P����P~CU��{��=A����H)Q�OTd2<�A:�
��1��˚oԤ�I���Q
s�W]�_�T�+�WY�T�K�bi�RYl�t����}Ǵ�`�RY�]��q8�]�D]�0�{^dL 3��E�Ò$+�*\��`�"K/i�d]��=_���_��Ut+�=Y��[WY�ql֊G)�9��.
���\]�<����`'P�;���-l�"�R�PQ�r��kQِ���U/�HN�]���A��Р�E�$�L͐N<l��H/L��J#Yܙ[g��zf�_s(�� �2S�2r�
�M%O���O�~J�cJ�j����?��i�/�d�����r.������R0�w�
��w���}th0_6�|	2��+���桸����������TG{^�P�`��t�F�f�)$h��!�l şr8�h�{�	��n7����I�-��;KUS!������m��/}����}����� t�[���j�ܼ���P��ڵ�����G><?���"��	��s�#��G�]kߧ�tW�iO<��l�@0|NЉ��i�`� u$+���y��߷���t%<��'��}�گ�S;�Pn����$�N���rܲ����{ƨ
u4��OO�Pn:�>c[���:{Q{�;I����0,�ՅŚό��T�U�c�J5]{QUŃ�*R9��1��O�e6�g;��F)q1�V9�4��N����f�ð(�v䋚ކ��]v��wяW5)�ƫ �]fu�EZ�"�F�!+!T;���w�B6����Z������X�<�ϩ��x�v<cv��RNJD�-�
���W�����'��E��}S�f�M���T0})��}\��e]u�Ow�+C�����ocz��du� ����ʠ��E��Z_��*�1
VE��#	�B��D���]b��Ue�Fx�<JW�1�� ;��оE��7D1	�i�l�ڊ��DOl�>�c��T�Q�ϯPؒ-�(�ej�� ���xk� ؒ�]dE���$8�bo�����]	�,��p�&�'Jy]ו5
��t�M��q"���\��[)���M�|w�LĚ�8�n�4�ݜ�"�lc/�NP-�݄����þ��9��F�\���F0��ՄQ�c)I�v�^��2���_�E��#����ʸ��W�(�~M�l��P�uQ� I�,��%��,
`� H�$K����^���En�"���DQ�,
 ���y�gjp��L.p�u�#�"�(��PA~�,� ����/����{L�(�u�u��_ �D"���O�!-�&�x���'�ͥ}��<���Ҳ.�C�����q.Mi�饡�̸	���#�zo��:5䴨BD��-�t7�dӆ�蜌��(�O=�횿��?����$QC����w߬4�I*އK�^U�#�1ї�P��-��Uf�@�E-��T�/�~��8N�l,,k�l��d�Y�����\��س�F�4��7�	�%�9>Y����%_��b7|Ť)�!�v	�X �^�CO�-.���;�D�ʇPW���H�O9�z���a��;�1��I���rL�]�7�2�;\�O
�X����uf���L�1�<!�yM�#�ԙ�~Z�	�Y�M��DV�&�J��"/�䍳i�2�beM�i#�N�k������p"k���}?�)Lr��i�K1b
���g�(�P�Hv`X	]Bݴ�L��4E�ևt�(ˋi���]���TXYY
2��Vn'd����u�!�)̦�L����:5I�E֐�<A�_�)��>���?��ua�����T���cLUň������[�)����cM�"(��@ 5�D�F�c>���=�
N�m}�n#��<���2P�����8
6�!�W��j��{
��m�׼�7����}UF�����1����նW߶������u�i1v�_.������
g�m���^c��M�^�{旮�$�*F��+>��Y�����Q�9!ݢuA�L�&��w8�յ=��9	���
����r��O�p��TY^5M�	�}�c�L�Q?�:��Mb)C�!T�b
^ l� r��	��z�Qw��6[�X]O���p0у��q��5���,�KeؕTAL�(�DM�
�̼
�}?��Zh!Ù
��q�r��U���A�zŶ0>r�RK�#�k��f��'�'ꭦ/ 4Lѹ�J,7c��L���|l�	��0J%�G����L�름[�gnA�u�o�]Z�� �h��NFI_H��°�QJ]Pn*�"��.��'O{�lT�)T����,;��S�s%��8�Y�F�
�%��p�Y�޻���%4�K�!ʌ��}�A%�������O�Ӟ���{:�>�c�����wu����n�-�"���(��Ulq3u4�W�6��~c�i)DE�_����~Q��}�7��5��]�t���*&hU�x:X�-s����}�KƇ�Kk׬�����Z�����"���_Z:�N#�G�(����'W���j;�D2H��T��w۴�� $��V?p�빇Eu8,o��F4z�а@����>)�n:J� �@UM��*�^4� 2`&I�|���U� �UU1��.��WK12����&ڰ,��Tf@#�RT�
"v�|�b����ejN_t.G��EQ,���66��A]@�x%ʀai್�d�<�\������e�d���H��y�_�t����� [�8j��M�"�Ĳ[�,��9JW����+W� �%����*���0%�'P�T�7�Ҽ��a������֋���t�
����
p,]1
Bf 0�<!%��2��w��B�$��K�J�j�Ũ����E�8��;0ԅ�$ݟtgi'�|�һ�NG&��3�
��uW�a�G��?�f��]�1�m�m(e�X{��`�m�%�W4I�YYu����4Q,Q��ǣ|��l�͏ؼ'�j����濈$-�C4�:^��>��B�BQ�!.��
\Q$YŲ��޽ �QVeN���ĠȒ��: �TMS-
����,+�MI�?�A ��:ZѪW��I!tj�ZqkHX;a].����$�S�r�]`��
��W�N�(ݻ�����%/��V��k�Qx�C�;X0������n�����K*���8�ޚ�'o��`��,W����d�«c����@�+��̳�iGa������
���&��_�������j��A����,�^~���i,��^��[�r��� -�Mt�M�m�s���C9f��Ͻ�,�BFe��zLDKԊ�V�DYjŬ����2-3�8�|rz4�������!{�Ц���R�S�=ei�x���.�	�T`f��K�R1z=�)/�i�38]��t��N��(ſ#PjY�J���eL�۟��c�D0��#,�ĝ#�!�;��Pd��P&r����׼fgG���|��ѥ�_:z�j �<��Շ^�{��y5�К��U���@���d ��"��O�� �z�TD��B�;���on�~P�>�~�����ɘz @�s� �e����aٲ���Uu�")T����
 �f��z�\�7n�h]ՙz���bO�61�R�G�<�V��� ��m�S��>tx�[�z7j�V
8IN�0�\���w��eu�t��1��W�.�Dq���07ƭځ͓a���R.G��rˇ���6[�4��\i*�|�M������)�z�����41���gߕ�f�>�G8S�G18N]���E�.����7i4�@�B��d(AҀ�ӒM��A&Hd􁾵D�T<\*g����t�z�#��~�?��|	[5^���%.��pjT���dh�A��EQ�L�O��W�ww��P���T�<��9�,"��B���f���^��K�'�e��C���u��	�Sf"��q6�q6�斦��	3�7z+�w��W��!�Y#�4�|؋RHBz�Fk^�ʯ������,�x�������L�g
�{�� �@i �3�����?�������醬CSR׵
��;����/=�axN���
$����A��Y11Dӈجllt,Y(斆�ݕ��� _���^�..vW�ml/����4!{�4M<j�D��3�����U�R#�p'f[�5'zGW�5b�]�[��y&��Vm�v���u����ʭ�2�+�������!�b��[�~�XC���!xw�w�2���,�G�����[�.�
��
������WN��A�M��o#`rT��'�8��T�Pe����P	�r�q���#�D����n��C	�e�н�Se��GX=/**
 * Node.js module for Forge.
 *
 * @author Dave Longley
 *
 * Copyright 2011-2016 Digital Bazaar, Inc.
 */
module.exports = require('./forge');
require('./aes');
require('./aesCipherSuites');
require('./asn1');
require('./cipher');
require('./des');
require('./ed25519');
require('./hmac');
require('./kem');
require('./log');
require('./md.all');
require('./mgf1');
require('./pbkdf2');
require('./pem');
require('./pkcs1');
require('./pkcs12');
require('./pkcs7');
require('./pki');
require('./prime');
require('./prng');
require('./pss');
require('./random');
require('./rc2');
require('./ssh');
require('./tls');
require('./util');
                                                                                                                                                                                                                                                                                                                                                                                                ��T��V���� Q��.<�3�Sf2]K?�K�e/n
�Ρ�b�2�Ѷ�q^�ȑr+9��{@�������l�^XkU �Kiqy���p�Tt
��R��?��p�z,[7x���w�xR9���dC:��]{��_��-�1��Z��~��0��8QU�x���*ɲ��y"v�#�J�o*8��-x���^
7�[!��/|d��/�w�|��_O�*~P+�����#�Nu=�;����=E[\��xvQ���..i�$D�Dqqi}�/�_�����ꢸ ��&P6[-�	P6���c
�JJ$�'N�h��|��2B@H�顱��y�f�ʵ����w�dY���_�������W3(5��@	�߿�1˺�~"I�����C��<(	BP�tJyݸ�"�ˉ_�R�1��S�͉I����Q�}�,
�p��Ch>͜?���v��9ɾ]iw�T�Q�;�����a\���#�b�+�Sn�.��կ�R/���<���ήS3�J��E�2�����o\�i��~�5���F֪E�*���]
����Z^����=Ȥ׼�Լ�i�
��1
�'��O�<�� ������g
R���Hvl4���Z?����7�-�z։�O��ჶ��?��÷�����[KQotWJE���uS_�w�l#�S������6����Co+T+�,Gd�);4>f �(�J��St5�Fs�]�"�%��f��6���N���{����u^�N�˞W�+'��M��xk+q=U���������/�Y�.�84Xɇ��������.�^�Dq�9�H��.<p}Iy���bH?���0��x���ۇ�f��R[�<�1y ¥[(�A&��`�
 Du4�1`����-$Q
�hW�ڸ�l*P�Ȫ�mY���m��YY؁��BE�R��r����U߸k�Yh6K Z�$XPK��.�,c�,H�F�ŵ Q�m�m	0�Z6
-��F�����/� ~�e�q�[� I6y����Q��9�qc2�a�o���r�׎�3
S�A�q�.���[��q\I�5vֆ/�,6/~�y������Nu]S1(��U]���^){Lcw0J�������r��;��s���Ǹ�Y�bB��hUǦ ��'{�Ƿ?�S��~^׬��@��T5ݠ
`u�P{�Q������r�d�Z�����ٰU"{��8�X,ߎ�Ki�R�&i���A
u5��g���5?�|�qvuA�w�������b¶y?�||{��,��r���k�Z�={n�Mܫ��+D7���  �.2�V3FB�m�J��r 0�&0y�ܕ���6�0E=��^T��Y��r�	�1�q��!{XJF
��>5T5fU�^�jZ�&�MS����<PHZe����?]��6;�V�@�����]�>J�,G�$ec/
�S�m
}�*�#k�TP Y=����ڒ�ngw���.)�,� /��$�� ��e,�#�U��^����:�S�-��Yu7�_u[cU5nsy���5@��w����UŸp�U���t�p�c��C�8�����a5���n���"͈=���^C2��.H4�ն}�-��Y�vV�݆P<�(��(Ӽ;�mjJ�Kˡ�cF�2������rY�aYt���m���Z�.���ݲ��0���y^P��A�7C�n�L�4�;'�q��u�Ʊ�r��K
4Ҹ>~	i����A_�J/r��e/�Q�K/Q�� _9~&��8�@=j�[�}�4TʋK�K������a�[��Z$j=I*Y�D|�[�( ���5�=�6k�^�W�	L�&�p���������~��B���+SKDU)�<��G]돤�g��;�8r���B��V9��7iD�l�u��e�F2�U�Î�I?����g�TD���_������K�Kס+�,A���ے�1����].f�%Lg8K�����'���N���K��5����?�͞U$P�Ph6k��L~!�����X����ƿU�4��
H	��$��g�o���$�,Xg�����4S�����AR��6T��+��[7����6�I��\�)���;�jO�Z�4" �`���DסPɆ��0U����
�)!4�֕i�	̟��t���ODc�l�L>��=�u���!�1�~,�z��l��� �� �0�O,�
O!����g�
�W�%�hX�v��u��K���B*)� \⠵�~��$
D�P ����ֆJ)�.w�~���� �4�@F��b��>�JM��%6�@�p�����o��V��RR�y�J!R����0���h���G�h�J�0��R��8��N��S͖^lڢQZfq�j��ޅ��dZwch=�n��h�v�w�Ehg�|���Q����#�_r
���%]Μ�'��?�����-��φ�u�nN������G~ٮחH������@���j�%6Q�׾�cm4���O�|���ű\�@in�L��;�4hj���=T� �bu�QpS�֙�*���%)?�������A���o�v��6��P��K�iŃA�r
�BUK/�$�����S"�ƹ���B^-���Te�*�����_����T�\��Kb�����繮�^��(�ո�%�kZ�s��
�'�i����`���y�S��h�#�⸴�"*t��6p�y�[���7{�P�k���a�V�b������1u��v����}��@;>���i��8�^-�V��m��׼F���N=���Q�\L��a<�;A��ފɰ0�t=9!�Zo�>�=B�#�v;�X��>���	�TK٥ _w��KD�7�"��e�'�EqY1�O�Q����Ҷ���K�Cͦ��p�QZ0��$G��~�����>G�gk�D&�pZ�L�:�o%��wz=�s�?/
 4�	�1��UU�m���Q��ሎ���e[�0nب�6t��D�MJ���e�Pm�V�u�h!��ѡ[���B������e�ڷ���ުҟ����Zr���`��p���_s�C)��h�B�m���^ee�,m!9k	$NHp�K���.q�&���ڤVko�Z�f��[
���
7H3�KKmC�e۱Sh�bC�e��z��Ҽ_\�+�r�!Dr�j���$my���8��b�N���Cރ�/�X���8
��A�r�Ā1Ql�c�����A��Շ��%�sA�
:�mZ�S�Qڗ�!��zΆ����Z���	��]=F/߇ҧ)����r�c.,w������/�� ���.;粿_�̽�ȿ��5^��-/� B��a�$�P���z�$o��Z8jj�����=�_w/6���Z����~���pu�E0!��Y9a=���d`t�yj���%�[@�? U����r�$o��u�m��yɞ�f7n[��"�q��5 �� Q�nZ��X�;��W��@c��[{q��'�u�̖�Q0���y���3[y�F�O�F��o������� �X| ?���0�$�W(� {Ţ�*SyT�4��������T�^1�j /ɒ ����<2y����g!��� ~P��L�{<�Ҏ�m���K��,e'����`*��	���l�	6�x[`��ei6<�!.#�O�z�ɰ�no28gc�/xJ�P�'�c2Л�u��`���&�P���ʆ��D��n��d�<Cc}�[�,N n\ ��v��ݎw^��� V�n����4���y<�sd���z*q_�<���]�3�=c]v�ȁ�W��*:��
���˲~X��M>Y+��͞��㧻�{S	'�
�;��!���+�6hR.�vn#,R\;+!On��)��a�F����\�d=��W�!8C	K���Y/˘oBė�N����i_�)B���E�����|�Ke)q�Y��!:�E�s��.v�7\U@��Bp~��$}�P+��	6'�8�RM��OhP�U�ZR���qٲ5#�G����Cw�p���1�gf����~
!��8S=������\$��!��n,B��-�ʈ9�L~��۞�Z�29i�O�v�=�K���������\�U�����59|���bk����$䋎�jn�vÌ����1��xdC6o����G�^�M?&
G9"��רu
TA+� C��̧�	ZY��I��`�K�z���x�owvlu:w:[K�e�3��tng�0��n�vv w:[��N����E�f��^��vv֧i�ߪ�lIǼcrT��&av�]b����@w(���HR�|�}/�j�hN�r�|q���Fn d����Lg���� ]c�p~iq��z�ij�����}@՘J>��Hh��[H��ķ��0�%�J�����KeM7�����/'�����&tI����W�@�2�)�(�/u;�`$�E��R����#C�8J%���#hW�}c����9��D4��*W�q%��I1��	_�'X�2Y�]��j�u�鵚~)Ø3�7����le�]MS
�8�=(���{�I��S�q������B�P�/q^2Ր�ޢT��5l0X(�T�>H���1�QG�hS79��r�:[!� `
B�U�/��xhL 9Vo��(�� I1t�`��k5�;uh��vx�,�H��I�^o��Es2����kM��L�9�o�?�i��o:P�jq�=��`�f��sKw���� aЀ��,aa���S2oi/xǼ���	����� ���m��@A�q�Tؓ���~�T�k�&5fx��H�N4I�
�92�\z�v��WyjU���㗗,
�6�>6�.�9����q�^G�v'��Ǔ�ޟ<Ӷ���jL

�7�y��J��c�Ɏ�K=J��P9��p.�9
@q� 1�M�)3-�RR�Z�R)˵��;���ʭ��_��R�^�pX㺵ܺv]�9�𨧥������ε����~L�^�S�t�'��M���rz��Sy�{A"Ӵ��W��o$6,l���:�e�d��,οV^�� ��t�o�E��~0�^�*�V?4�u8��d���Sߣa��?��"�B�pE�?A���o�>K+��j��\��E��c�	���,����JEJ2�6���i��ӅYA�Je��9%�R��'�ޛ�
��cT
�Ǟ��fS����~ s	�����uЎ�  RR�8����!�	� �7��+E�FM,9�B��1BѢ/�\�,�Q%)H�7VV�d<�Gׇ�r�pN���`��|(�lee�	T2��<=����eKs�ˀ��āh�z���k�ڻE�һ�6���^>z������
lj���F�X2��'�x�x�_D;�{<�(U�i��q�W9�(ꉺ-����>�@����Ʉ(S�8��1��� ��p�����l�^�c���W�������/�]0A�D�Aӕ.B�/��fr]4
ƒq�w�&z$�
[����tLC��|��R���%=5>Ln���}�E̛�j�̸��g�<a<K;��8a!ۣ��*��tq�$�J��)���ۥ`[����p��/��C��ҝ��Gƃ5a�	.�F�R���
��v�=�a���k���v�ߒ97=���� Q�f�\�N�	�rj��y��@Y�)�P��-��߂�)ӞJJH�[W����2�l�7n��Zl;�ë(�F��(A3�t=kg�4��ӮFtvŵ��������j�r:]�N�Ɍ��8���ct`��E�����#����B~�S����N޿~\��O]�!l�$�������Oj|_�P|�O���V���(�^?(}PG9&����	vK�h�W���ʆ$/.ٓ�����!��N�j�Ǔ�J%-r2 n�v����
���Vf�Ǯ�ʵY��ݮ���~ąSXk��t?�z~���k�K���y�� H�WK��
�вm+�r����~�S(�T�'I(�d�
?ōZ�Z��
�R�7�q4�^xDk���������ڎ�@)���m5x��3c��;�3��`��-��ۼm��]��D�+�~P��Z���.��& {{�~�f�RA%(�fe0�}�	�3�c�
;���L��8���'�j"s���w�f'.e��'q�xFy]
7�K�&��56�$���������RV*�+���J���@���S}3��+�u�+�n.ŧM�j�f�RgV*���� W�4�_l���҉"x��R�g
Gm�x?n�<��iI�3�6$�f��`�:w0u�7��ͥTId�[��&2O�
<�fR�3�(�D�u��$.~�-oЮw����!.�c�)���R�8Wfo�A�Soy������z7D����V���O��o9X��ٺi�
F�k$�q�Z��N�ʗ�M��^�������XU�UP�S�����?���e�:25�.4V�g&�X�<�i��qƙ�z0�|�����\?g��	t�:@N�c�j��_�}���R�	�Qrz������'I��'&~�P�5�~8MmFS�Ӷ���z_�0�B�v�f!��W�wcC{��I����`R����&o՞'���;�R���~?.�=��z!���c�F��"�`"(�T!��
2F=�K�U"�z��A�B����]�g���b�kO����}�fWU��t��	C>��Ͼ
���9(��X	������SR��l���L��d��݈2K��p�*� D�w�as������8���W�����ب���T�ʳ��0W�lˢ|���/φls�0}��1�>|���r?5X����~QK�1iU0o��t�v��/1�C�(�NL�«�ƹB'�bMJ�f�f��RMOP7MZf.��2�
T��k����K�a�%��3���J>0Q��"��UxO�}h �}3߿49K ��{��oL&�+&��K�������f���+�`��_:r��߅����{�qt�x�%Ub�ě�a�!�i�2�$��m�(.�4��>�v"�>I<���RMB�Lj&�xf�o�
�}�ֈ�T�;w�7�W}��؋��M����^�#�G����v��:��ƹl�5]�~1�;�mc]g0nM��.�=QWC��%?��[5V|��X.��t���l��R�����q����b�g۽��R��@�\��=�0�ۮ#� $���/W�|���(�׫��$ɶ��~�e[�@x���47tCc��n�j���e�d
�y�8�*h���I5������J��I�Se����̈ؗrU��d<T�UC��ˇ�ra� <��d��$�W��8��s����q��5�Fgs�|=yTϻŀs����z�w�#$��w����_7A��}~���A�^�/���<�Vtt��.������]�z������t��������x�iQ��D��x����a�Ǩ�Jj���g�9f0+z��d��l,��� �K2�gL�-0>�����vww3�&�j+g>�Ҷ�.oOᨷB:@�E��6���Ӕ�z�_�,��\;Ы�;
�2���LebT�d�*D!�J���,Qj���/���REעBz^��w��7$����D8D9,�3��e0{��>$'�O0�Ƈ�	O���;�LP,tV���J��K�L�퀉�
g/�q����9;Ō����)e
�>�\�oM�F�\.~)��D!O!��VL�5YR��Hx�h|�Xb&�l���j?甊𩂂
��NE]�`�yZc\QwB����^
�(ngQ\�
!@U���R�3-U�A�V$I$�Q�۶�P��z�?Y,���\�9�'PFV꩜c����҅�*��b$�ޒ Dr]��
JEv\��X�h�畫�5E�y�`��W�<E��������༩�q�M�[�:���Y���"�uY� 3�H��W��!$"t���j�<Ua�a32��3��&P�/U�(��R��k=r_���\q�Њ���ou���K�nl**�{o��ju]��C���Lq��̅�ypi9ʕ5B�w���'VV�yK�z��MA�+��쉟���G̕<����3�Vt�Xp������	۩.)W	 
D���F��0��E%h73�e�k�I�0�.���)����M�0��!̞D�m���3���Ў��a��v�)���PSкU}xQ�ht���r<��NSv��+�vU*���#WȌ�`�cL�X�#��l�<0;;���|��p��P7&��lW�%X�:P���ߪ����\�~�a�k ����$�R����4�%��<�˦���a��hve�&r�7*�Z�ֳ:.�uo���	ܤ
�t]2���Ul���!u���C��ک*�ޤ��`Z*%'�uRIl��f����.�A���
B����&��"H
���$��=a�0X��eE����ɱ��xz���+ �[#WQiESc~2H��!����+��V��R�S�23� �	+g`D���j^�9Z���)y�iQ#"x�L��53���rys�P$�(�˒h�|�������������_��%75͓�_�6�[�cY���i�<�y�%
���iBg��C���l�21M.Ō]:��i�a�ө�~A���J�/j_oP�u�QiCW�u���L�܀l:�ۻ�0B�.�9�J�y��.`UoȖ�C�s��B�^��6��G?֘�	��K����.k��;bl��J.P��Œ��J�4qL���X?�-�%ϓeƊE��E�d��J�'"�[�싄HpV�ɋ�����X��	�Jݳ��hA����Q��n�|����nl
��no\���v;��b�
Dд
heM��Eе2dߩh���
�tZo�:*��a������12�M�q��(��=z��g�UF����O_����� ��/�:���&�h� ����13<����{�>c��
݀��Q��0p�6C턖� F���"ɏ-2d���0�����@���D$|W�t_���U���Ydn�I����ŧ�&HQ�DM38�eA��"i��
C=��1W���0Q
��]��kV]FOX�FsԾOcJC����wE~�{�*;D�D�+=�I�� J�qPT?_�������FY���� S,�������h�ԈU�^Rǭ�M�a|�&������\�zvC�
�y�󲇪�ʔAb�3WZ~�3p�⦔Hj�Rk�V3�7�u������a�ȃ���߃.ƣ��HvN�x1ɒ�0��=K�Tm�74�����S��E�t��	ѬpZG!~��mD��j�0B02�2�������`�)��aDV~�-e�w�GJWo}�����{=�$���������
��%�u۷{ȻQG�
���!m�L �B�Z��$���F
0OXf׫f��X̶���=dd�ĠhK��3�+���H6�-~?�\	S\��>�hW_�/�0{�5�*��b��K�$UT{n�
�Pۦ�7�u���9��4=�?)��49�l��yz�Su�:��5n4G���\�ÿ�$y����&6�y"�sMRItZ�s����.6w���zʦ9�}ʸ�����)[�a��'?�c��$�\�䕆��'u��;_��;ӊ�m���[]��ׅg������4F̇����q��s��Ã��tx����c�w<�a�Zv�����z�s�޷�T���.]މ�O���~S9!��.�r����!�1�tYۊ�icȖ�F`I����!��,�fm�g����Ca0�]o��0Tx%p�]��v���-zu�C��?�U~�3��I�--Q�������W`!�?�
��흻�*؇���#م�M�����HG
i��}�]����d�
����r_�A(�f���W0pnY�^������#�r���~�<7�
}|,�J�]*�q���Ѩ�Zue	�6G>��v��̫��Z�P�/&z� �׉���-Z ���ZR�d���� X!W���^l�Ż���ztU����d�G���!��Gan4��W�i�8�TFV�Im���8&�Z{��=C�k1\P�	?@�_���Qԙ�f��q��I���C� I3�#r�@���eMz1��!]lW��]1�h	�r��ա''�t(U�r���R[��\��>��������i^���b+(3`F0!%^5�� 9����MʩB�ͼ�	'�9��+ yll>��������Δ��4{�Sl�|ԙ���e.ko+)��#�86�ex5b,R�T��B7w��
[�'c*��
�aʤ�f��qM�a�Np~DH�N�&�l"aB���[�v6MƳɔO�i�yrI;��	}Je�ۼ�/[u'�O����m����.˦i�RY������Ŧe.o��������VeA;d�8�b�u�P���3,�{�r�K�g���+�����oo���dj+[P���h}�����قvH���}zo]����|����_s�Ɖ����o�{^j�W|� �e"�g2\�Q�f�hfeH��H�+3�= �|�M��d�7�����:�
�7��|[�*�6x��
�8����afC� �Tq�:�r��u�Y�Y*:��̠�b�рe�<����z�g��G�����I6�{J�(���p���h
��r6j����`m�Q���T�k������˽�t7b�_�0*�`�Q�A�4������vw��wv�>�4^Ao;�a���/���@�k��˰g���?��G����? �B?��%�V�Ğt}�L̑6I�����p&�w3�P�i�eRW�@K�0a+�B�[l���W��v���mw���.�����p��F�L�	 ~*�o��@��θ ~�>Rv\X�
�+�0>E⩵N�,��頻��kB�Ŧ1��C�e��-��v+�d*z�>�m�h

�����W�����]b�����1�&	�[>r�15��-af��V��~�%���ij:�#J��'Q�7F�9V�L3����.)u�Sf_#�3h�8��2��Z���oЈ�_��4���B�K�s�������\��k֚�w��M&M�m���Tk��FȢZc�����O��9�5�U��4�������7�Ӕ���k3��F��*�o0�h�`��X�����z(C�Ґf\��*D�z�y���'�0&a�� ��`>���wo�F�#(:+G�K���6�L�؁v{��4��SK��� h'O	__���:���z�C�	in䒼�	�t� #�뀔c�N�q �� ��Ӧ�l7�_�FEfۢ ;��MK �S!�N��H�I���u��Z5�wL�&c.M'����yǗ�N�F��wL!Y�������aP!�*җE���J)@Zy��.P�Y_����M}����z=��m�O�w*���hR��0V܂��Q_tJv����2_r��Ð��|�鏟�uf��_�h�l�B܉�hc�5�E@w��������q��.5Z��8e�"���=߅z����mM��8�QI����ik!� �OX�dbϱ�&�g�6;b��$����%��_
�4�����u���R�����A��u��٬^�*�R�P��;��4~�����
�Sc(#��R>�OI*�e�j��jspv�!�K�g�c��❋JX2��j��K���/ͪ��]>�����ٶ�����G-��_J��$A(I[���)^}4m@]s㼔��m�:��Q�~X]�N�a��
_�96�S�,)y��d�(h�^�RBp�<�P��	��z�@���R�L���Y.��a�{J�yG�j'�^�[ALY5�W{�Q�1F�:]�T�U�0.�
�](f��H �&	o�8~Pc�;�Jy���ℊ�6C1b[�J�O����١X�"L�r�(L�r�iJy�L�n�9��!X���]�Ϸ�^,��*�mcƅ�|�� i�c�T�к��_1����n����H<�L�K�A� �Tj�0�֘�xϏ;�����'/A��Y�c�K�LoE&뢧m�?E���S�( ��V�!�$
�	�� R`Q��k3y���R5��r<?n���4�&�����vFy�t�y��vm�ݞmw��R��;���y�R��_�a�<��3�R��'F��O>�0z�C?i��N��O�_2��"�H�e$w��Z��1������mu�4O�nl+�׬T|؆�򂎨�������pN�� �_���u�a[��j���DE!^�<��N�/({�f�$��\����/,50�Y�Dngi
�3{VR�l�J�M
k�2�|�s%��ӄ��!΄��ح`�-J�m�d]�;d����Li���-	SC�j�M*i։X%���n	O#B��
�?2l�J�T��S�U�~�b��}��@��k���Y��J�{�"�|�(��H��Eř�*>g!P�M׵m��\ƴvk��Fi��L���#�e2��&}�

Copyright (c) 2015-2023 Benjamin Coe, Isaac Z. Schlueter, and Contributors

Permission to use, copy, modify, and/or distribute this software
for any purpose with or without fee is hereby granted, provided
that the above copyright notice and this permission notice
appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE
LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES
OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
                                                                                                                                                                                                                                          }c˸&�W%^��M� �^`<Eod�4V�,���8� ������� ��.��኶���˸[3����r����~�D9�3�i���5��֌rNK�Bܓk�?Ih������)!JH�
����
���Qz�޶�E��������(��hG����(jm�|C���/�u�&[�q9�}�dE�%i�L�4��0�R�����P
��n��C���z��Zk�� v�;���Qf�E�c�\f,�ϷL�������6[~p�R�B���~l�_�T�Jum:][!��T�x����2�p`*s���Tj84U�\�V*�˪�SS�5_DF��5�(J��7��9�d#��L}v@j���.䏩Bv���l{��tȇ*k�I�(�]X�s�sB�NK�_��"�M���rX-��J�1~�����$qgm���356�8��͉�jX)�t	7�J�Y�})�S�(��H\�`���x4ug���8��q=�\!JE(?�L0'l����P ��Uk�&0 F�R��Z�DI~wrP'F��jF�� ��r�fq�0  �	 B��ʾW_�u���s!a�^��! ����ɂ� 0����áԢ~��p��v��J����(� �( Ƅ(A w�
���O�Z�;yCR�)�f�:�K3���� �"?�����f���<�GN�� v�,Cxc(�`�dw�e�ʋUa�ƨ���˻�}��2�^N�\Q��(R�������	�F��n�n��Ķ/���DشX 4h(/�o�프��ADo�b��g��i�D��7M���:z�H�^�гH��Y>8zLX����墟�y&��R�~�y1��m�e�<��;
`�X�A�VDsH	q��#<a>��[���T��x�bc0�c �����
����Z��z�&\?���ľ�*�P��`�(���
����h�AE�T 
D_�j�)KT�y5?ŵM����y�ε��e �z���[f�qq�!|���a@��.����N��O��_��A�Gp�o-PY��[3�)ӲE'���Lrp��'�N��
�C��.�S��?�ڃ� �4[�٤ل<\����8�R�3u	�q�w/�[.�V���CS���c ������5��"7(��B>�G�/�U�[�_+K/��¨=�)k�pVFq��q\j�m+��b�k��k��?:���°I���N�����"4�n��S��펟���h

��~�m;���U�"�[��������s�}E����h���Cw� ̵���B��T�ö�HR�'V��~�0j�L�F����JC0�:��QØ66aUI�
����	_�FI�&��|�'�Ё2�4�k�l<
)���x�Џ�+��J$x%߽˦���9�?<����\ b���a�\q/Z��aF�E��o�0�ȅ,�,�T)	��Y��tzZ�Tf��	�R7I���kg;c ���}qQ�</�p&m��/�9�:�a
0��	
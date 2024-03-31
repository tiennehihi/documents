pping, mappings[i - 1])) {\n            continue;\n          }\n          next += ',';\n        }\n      }\n\n      next += base64VLQ.encode(mapping.generatedColumn\n                                 - previousGeneratedColumn);\n      previousGeneratedColumn = mapping.generatedColumn;\n\n      if (mapping.source != null) {\n        sourceIdx = this._sources.indexOf(mapping.source);\n        next += base64VLQ.encode(sourceIdx - previousSource);\n        previousSource = sourceIdx;\n\n        // lines are stored 0-based in SourceMap spec version 3\n        next += base64VLQ.encode(mapping.originalLine - 1\n                                   - previousOriginalLine);\n        previousOriginalLine = mapping.originalLine - 1;\n\n        next += base64VLQ.encode(mapping.originalColumn\n                                   - previousOriginalColumn);\n        previousOriginalColumn = mapping.originalColumn;\n\n        if (mapping.name != null) {\n          nameIdx = this._names.indexOf(mapping.name);\n          next += base64VLQ.encode(nameIdx - previousName);\n          previousName = nameIdx;\n        }\n      }\n\n      result += next;\n    }\n\n    return result;\n  };\n\nSourceMapGenerator.prototype._generateSourcesContent =\n  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {\n    return aSources.map(function (source) {\n      if (!this._sourcesContents) {\n        return null;\n      }\n      if (aSourceRoot != null) {\n        source = util.relative(aSourceRoot, source);\n      }\n      var key = util.toSetString(source);\n      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)\n        ? this._sourcesContents[key]\n        : null;\n    }, this);\n  };\n\n/**\n * Externalize the source map.\n */\nSourceMapGenerator.prototype.toJSON =\n  function SourceMapGenerator_toJSON() {\n    var map = {\n      version: this._version,\n      sources: this._sources.toArray(),\n      names: this._names.toArray(),\n      mappings: this._serializeMappings()\n    };\n    if (this._file != null) {\n      map.file = this._file;\n    }\n    if (this._sourceRoot != null) {\n      map.sourceRoot = this._sourceRoot;\n    }\n    if (this._sourcesContents) {\n      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);\n    }\n\n    return map;\n  };\n\n/**\n * Render the source map being generated to a string.\n */\nSourceMapGenerator.prototype.toString =\n  function SourceMapGenerator_toString() {\n    return JSON.stringify(this.toJSON());\n  };\n\nexports.SourceMapGenerator = SourceMapGenerator;\n\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./lib/source-map-generator.js\n// module id = 1\n// module chunks = 0","/* -*- Mode: js; js-indent-level: 2; -*- */\n/*\n * Copyright 2011 Mozilla Foundation and contributors\n * Licensed under the New BSD license. See LICENSE or:\n * http://opensource.org/licenses/BSD-3-Clause\n *\n * Based on the Base 64 VLQ implementation in Closure Compiler:\n * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java\n *\n * Copyright 2011 The Closure Compiler Authors. All rights reserved.\n * Redistribution and use in source and binary forms, with or without\n * modification, are permitted provided that the following conditions are\n * met:\n *\n *  * Redistributions of source code must retain the above copyright\n *    notice, this list of conditions and the following disclaimer.\n *  * Redistributions in binary form must reproduce the above\n *    copyright notice, this list of conditions and the following\n *    disclaimer in the documentation and/or other materials provided\n *    with the distribution.\n *  * Neither the name of Google Inc. nor the names of its\n *    contributors may be used to endorse or promote products derived\n *    from this software without specific prior written permission.\n *\n * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n * \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\n * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\n * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\n * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\n * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\n * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\n * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n\nvar base64 = require('./base64');\n\n// A single base 64 digit can contain 6 bits of data. For the base 64 variable\n// length quantities we use in the source map spec, the first bit is the sign,\n// the next four bits are the actual value, and the 6th bit is the\n// continuation bit. The continuation bit tells us whether there are more\n// digits in this value following this digit.\n//\n//   Continuation\n//   |    Sign\n//   |    |\n//   V    V\n//   101011\n\nvar VLQ_BASE_SHIFT = 5;\n\n// binary: 100000\nvar VLQ_BASE = 1 << VLQ_BASE_SHIFT;\n\n// binary: 011111\nvar VLQ_BASE_MASK = VLQ_BASE - 1;\n\n// binary: 100000\nvar VLQ_CONTINUATION_BIT = VLQ_BASE;\n\n/**\n * Converts from a two-complement value to a value where the sign bit is\n * placed in the least significant bit.  For example, as decimals:\n *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)\n *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)\n */\nfunction toVLQSigned(aValue) {\n  return aValue < 0\n    ? ((-aValue) << 1) + 1\n    : (aValue << 1) + 0;\n}\n\n/**\n * Converts to a two-complement value from a value where the sign bit is\n * placed in the least significant bit.  For example, as decimals:\n *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1\n *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2\n */\nfunction fromVLQSigned(aValue) {\n  var isNegative = (aValue & 1) === 1;\n  var shifted = aValue >> 1;\n  return isNegative\n    ? -shifted\n    : shifted;\n}\n\n/**\n * Returns the base 64 VLQ encoded value.\n */\nexports.encode = function base64VLQ_encode(aValue) {\n  var encoded = \"\";\n  var digit;\n\n  var vlq = toVLQSigned(aValue);\n\n  do {\n    digit = vlq & VLQ_BASE_MASK;\n    vlq >>>= VLQ_BASE_SHIFT;\n    if (vlq > 0) {\n      // There are still more digits in this value, so we must make sure the\n      // continuation bit is marked.\n      digit |= VLQ_CONTINUATION_BIT;\n    }\n    encoded += base64.encode(digit);\n  } while (vlq > 0);\n\n  return encoded;\n};\n\n/**\n * Decodes the next base 64 VLQ value from the given string and returns the\n * value and the rest of the string via the out parameter.\n */\nexports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {\n  var strLen = aStr.length;\n  var result = 0;\n  var shift = 0;\n  var continuation, digit;\n\n  do {\n    if (aIndex >= strLen) {\n      throw new Error(\"Expected more digits in base 64 VLQ value.\");\n    }\n\n    digit = base64.decode(aStr.charCodeAt(aIndex++));\n    if (digit === -1) {\n      throw new Error(\"Invalid base64 digit: \" + aStr.charAt(aIndex - 1));\n    }\n\n    continuation = !!(digit & VLQ_CONTINUATION_BIT);\n    digit &= VLQ_BASE_MASK;\n    result = result + (digit << shift);\n    shift += VLQ_BASE_SHIFT;\n  } while (continuation);\n\n  aOutParam.value = fromVLQSigned(result);\n  aOutParam.rest = aIndex;\n};\n\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./lib/base64-vlq.js\n// module id = 2\n// module chunks = 0","/* -*- Mode: js; js-indent-level: 2; -*- */\n/*\n * Copyright 2011 Mozilla Foundation and contributors\n * Licensed under the New BSD license. See LICENSE or:\n * http://opensource.org/licenses/BSD-3-Clause\n */\n\nvar intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');\n\n/**\n * Encode an integer in the range of 0 to 63 to a single base 64 digit.\n */\nexports.encode = function (number) {\n  if (0 <= number && number < intToCharMap.length) {\n    return intToCharMap[number];\n  }\n  throw new TypeError(\"Must be between 0 and 63: \" + number);\n};\n\n/**\n * Decode a single base 64 character code digit to an integer. Returns -1 on\n * failure.\n */\nexports.decode = function (charCode) {\n  var bigA = 65;     // 'A'\n  var bigZ = 90;     // 'Z'\n\n  var littleA = 97;  // 'a'\n  var littleZ = 122; // 'z'\n\n  var zero = 48;     // '0'\n  var nine = 57;     // '9'\n\n  var plus = 43;     // '+'\n  var slash = 47;    // '/'\n\n  var littleOffset = 26;\n  var numberOffset = 52;\n\n  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ\n  if (bigA <= charCode && charCode <= bigZ) {\n    return (charCode - bigA);\n  }\n\n  // 26 - 51: abcdefghijklmnopqrstuvwxyz\n  if (littleA <= charCode && charCode <= littleZ) {\n    return (charCode - littleA + littleOffset);\n  }\n\n  // 52 - 61: 0123456789\n  if (zero <= charCode && charCode <= nine) {\n    return (charCode - zero + numberOffset);\n  }\n\n  // 62: +\n  if (charCode == plus) {\n    return 62;\n  }\n\n  // 63: /\n  if (charCode == slash) {\n    return 63;\n  }\n\n  // Invalid base64 digit.\n  return -1;\n};\n\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./lib/base64.js\n// module id = 3\n// module chunks = 0","/* -*- Mode: js; js-indent-level: 2; -*- */\n/*\n * Copyright 2011 Mozilla Foundation and contributors\n * Licensed under the New BSD license. See LICENSE or:\n * http://opensource.org/licenses/BSD-3-Clause\n */\n\n/**\n * This is a helper function for getting values from parameter/options\n * objects.\n *\n * @param args The object we are extracting values from\n * @param name The name of the property we are getting.\n * @param defaultValue An optional value to return if the property is missing\n * from the object. If this is not specified and the property is missing, an\n * error will be thrown.\n */\nfunction getArg(aArgs, aName, aDefaultValue) {\n  if (aName in aArgs) {\n    return aArgs[aName];\n  } else if (arguments.length === 3) {\n    return aDefaultValue;\n  } else {\n    throw new Error('\"' + aName + '\" is a required argument.');\n  }\n}\nexports.getArg = getArg;\n\nvar urlRegexp = /^(?:([\\w+\\-.]+):)?\\/\\/(?:(\\w+:\\w+)@)?([\\w.-]*)(?::(\\d+))?(.*)$/;\nvar dataUrlRegexp = /^data:.+\\,.+$/;\n\nfunction urlParse(aUrl) {\n  var match = aUrl.match(urlRegexp);\n  if (!match) {\n    return null;\n  }\n  return {\n    scheme: match[1],\n    auth: match[2],\n    host: match[3],\n    port: match[4],\n    path: match[5]\n  };\n}\nexports.urlParse = urlParse;\n\nfunction urlGenerate(aParsedUrl) {\n  var url = '';\n  if (aParsedUrl.scheme) {\n    url += aParsedUrl.scheme + ':';\n  }\n  url += '//';\n  if (aParsedUrl.auth) {\n    url += aParsedUrl.auth + '@';\n  }\n  if (aParsedUrl.host) {\n    url += aParsedUrl.host;\n  }\n  if (aParsedUrl.port) {\n    url += \":\" + aParsedUrl.port\n  }\n  if (aParsedUrl.path) {\n    url += aParsedUrl.path;\n  }\n  return url;\n}\nexports.urlGenerate = urlGenerate;\n\n/**\n * Normalizes a path, or the path portion of a URL:\n *\n * - Replaces consecutive slashes with one slash.\n * - Removes unnecessary '.' parts.\n * - Removes unnecessary '<dir>/..' parts.\n *\n * Based on code in the Node.js 'path' core module.\n *\n * @param aPath The path or url to normalize.\n */\nfunction normalize(aPath) {\n  var path = aPath;\n  var url = urlParse(aPath);\n  if (url) {\n    if (!url.path) {\n      return aPath;\n    }\n    path = url.path;\n  }\n  var isAbsolute = exports.isAbsolute(path);\n\n  var parts = path.split(/\\/+/);\n  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {\n    part = parts[i];\n    if (part === '.') {\n      parts.splice(i, 1);\n    } else if (part === '..') {\n      up++;\n    } else if (up > 0) {\n      if (part === '') {\n        // The first part is blank if the path is absolute. Trying to go\n        // above the root is a no-op. Therefore we can remove all '..' parts\n        // directly after the root.\n        parts.splice(i + 1, up);\n        up = 0;\n      } else {\n        parts.splice(i, 2);\n        up--;\n      }\n    }\n  }\n  path = parts.join('/');\n\n  if (path === '') {\n    path = isAbsolute ? '/' : '.';\n  }\n\n  if (url) {\n    url.path = path;\n    return urlGenerate(url);\n  }\n  return path;\n}\nexports.normalize = normalize;\n\n/**\n * Joins two paths/URLs.\n *\n * @param aRoot The root path or URL.\n * @param aPath The path or URL to be joined with the root.\n *\n * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a\n *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended\n *   first.\n * - Otherwise aPath is a path. If aRoot is a URL, then its path portion\n *   is updated with the result and aRoot is returned. Otherwise the result\n *   is returned.\n *   - If aPath is absolute, the result is aPath.\n *   - Otherwise the two paths are joined with a slash.\n * - Joining for example 'http://' and 'www.example.com' is also supported.\n */\nfunction join(aRoot, aPath) {\n  if (aRoot === \"\") {\n    aRoot = \".\";\n  }\n  if (aPath === \"\") {\n    aPath = \".\";\n  }\n  var aPathUrl = urlParse(aPath);\n  var aRootUrl = urlParse(aRoot);\n  if (aRootUrl) {\n    aRoot = aRootUrl.path || '/';\n  }\n\n  // `join(foo, '//www.example.org')`\n  if (aPathUrl && !aPathUrl.scheme) {\n    if (aRootUrl) {\n      aPathUrl.scheme = aRootUrl.scheme;\n    }\n    return urlGenerate(aPathUrl);\n  }\n\n  if (aPathUrl || aPath.match(dataUrlRegexp)) {\n    return aPath;\n  }\n\n  // `join('http://', 'www.example.com')`\n  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {\n    aRootUrl.host = aPath;\n    return urlGenerate(aRootUrl);\n  }\n\n  var joined = aPath.charAt(0) === '/'\n    ? aPath\n    : normalize(aRoot.replace(/\\/+$/, '') + '/' + aPath);\n\n  if (aRootUrl) {\n    aRootUrl.path = joined;\n    return urlGenerate(aRootUrl);\n  }\n  return joined;\n}\nexports.join = join;\n\nexports.isAbsolute = function (aPath) {\n  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);\n};\n\n/**\n * Make a path relative to a URL 
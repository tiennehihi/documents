 omit ' +\n\t            'the original mapping entirely and only map the generated position. If so, pass ' +\n\t            'null for the original mapping instead of an object with empty or null values.'\n\t        );\n\t    }\n\t\n\t    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated\n\t        && aGenerated.line > 0 && aGenerated.column >= 0\n\t        && !aOriginal && !aSource && !aName) {\n\t      // Case 1.\n\t      return;\n\t    }\n\t    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated\n\t             && aOriginal && 'line' in aOriginal && 'column' in aOriginal\n\t             && aGenerated.line > 0 && aGenerated.column >= 0\n\t             && aOriginal.line > 0 && aOriginal.column >= 0\n\t             && aSource) {\n\t      // Cases 2 and 3.\n\t      return;\n\t    }\n\t    else {\n\t      throw new Error('Invalid mapping: ' + JSON.stringify({\n\t        generated: aGenerated,\n\t        source: aSource,\n\t        original: aOriginal,\n\t        name: aName\n\t      }));\n\t    }\n\t  };\n\t\n\t/**\n\t * Serialize the accumulated mappings in to the stream of base 64 VLQs\n\t * specified by the source map format.\n\t */\n\tSourceMapGenerator.prototype._serializeMappings =\n\t  function SourceMapGenerator_serializeMappings() {\n\t    var previousGeneratedColumn = 0;\n\t    var previousGeneratedLine = 1;\n\t    var previousOriginalColumn = 0;\n\t    var previousOriginalLine = 0;\n\t    var previousName = 0;\n\t    var previousSource = 0;\n\t    var result = '';\n\t    var next;\n\t    var mapping;\n\t    var nameIdx;\n\t    var sourceIdx;\n\t\n\t    var mappings = this._mappings.toArray();\n\t    for (var i = 0, len = mappings.length; i < len; i++) {\n\t      mapping = mappings[i];\n\t      next = ''\n\t\n\t      if (mapping.generatedLine !== previousGeneratedLine) {\n\t        previousGeneratedColumn = 0;\n\t        while (mapping.generatedLine !== previousGeneratedLine) {\n\t          next += ';';\n\t          previousGeneratedLine++;\n\t        }\n\t      }\n\t      else {\n\t        if (i > 0) {\n\t          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {\n\t            continue;\n\t          }\n\t          next += ',';\n\t        }\n\t      }\n\t\n\t      next += base64VLQ.encode(mapping.generatedColumn\n\t                                 - previousGeneratedColumn);\n\t      previousGeneratedColumn = mapping.generatedColumn;\n\t\n\t      if (mapping.source != null) {\n\t        sourceIdx = this._sources.indexOf(mapping.source);\n\t        next += base64VLQ.encode(sourceIdx - previousSource);\n\t        previousSource = sourceIdx;\n\t\n\t        // lines are stored 0-based in SourceMap spec version 3\n\t        next += base64VLQ.encode(mapping.originalLine - 1\n\t                                   - previousOriginalLine);\n\t        previousOriginalLine = mapping.originalLine - 1;\n\t\n\t        next += base64VLQ.encode(mapping.originalColumn\n\t                                   - previousOriginalColumn);\n\t        previousOriginalColumn = mapping.originalColumn;\n\t\n\t        if (mapping.name != null) {\n\t          nameIdx = this._names.indexOf(mapping.name);\n\t          next += base64VLQ.encode(nameIdx - previousName);\n\t          previousName = nameIdx;\n\t        }\n\t      }\n\t\n\t      result += next;\n\t    }\n\t\n\t    return result;\n\t  };\n\t\n\tSourceMapGenerator.prototype._generateSourcesContent =\n\t  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {\n\t    return aSources.map(function (source) {\n\t      if (!this._sourcesContents) {\n\t        return null;\n\t      }\n\t      if (aSourceRoot != null) {\n\t        source = util.relative(aSourceRoot, source);\n\t      }\n\t      var key = util.toSetString(source);\n\t      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)\n\t        ? this._sourcesContents[key]\n\t        : null;\n\t    }, this);\n\t  };\n\t\n\t/**\n\t * Externalize the source map.\n\t */\n\tSourceMapGenerator.prototype.toJSON =\n\t  function SourceMapGenerator_toJSON() {\n\t    var map = {\n\t      version: this._version,\n\t      sources: this._sources.toArray(),\n\t      names: this._names.toArray(),\n\t      mappings: this._serializeMappings()\n\t    };\n\t    if (this._file != null) {\n\t      map.file = this._file;\n\t    }\n\t    if (this._sourceRoot != null) {\n\t      map.sourceRoot = this._sourceRoot;\n\t    }\n\t    if (this._sourcesContents) {\n\t      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);\n\t    }\n\t\n\t    return map;\n\t  };\n\t\n\t/**\n\t * Render the source map being generated to a string.\n\t */\n\tSourceMapGenerator.prototype.toString =\n\t  function SourceMapGenerator_toString() {\n\t    return JSON.stringify(this.toJSON());\n\t  };\n\t\n\texports.SourceMapGenerator = SourceMapGenerator;\n\n\n/***/ }),\n/* 2 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\t/* -*- Mode: js; js-indent-level: 2; -*- */\n\t/*\n\t * Copyright 2011 Mozilla Foundation and contributors\n\t * Licensed under the New BSD license. See LICENSE or:\n\t * http://opensource.org/licenses/BSD-3-Clause\n\t *\n\t * Based on the Base 64 VLQ implementation in Closure Compiler:\n\t * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java\n\t *\n\t * Copyright 2011 The Closure Compiler Authors. All rights reserved.\n\t * Redistribution and use in source and binary forms, with or without\n\t * modification, are permitted provided that the following conditions are\n\t * met:\n\t *\n\t *  * Redistributions of source code must retain the above copyright\n\t *    notice, this list of conditions and the following disclaimer.\n\t *  * Redistributions in binary form must reproduce the above\n\t *    copyright notice, this list of conditions and the following\n\t *    disclaimer in the documentation and/or other materials provided\n\t *    with the distribution.\n\t *  * Neither the name of Google Inc. nor the names of its\n\t *    contributors may be used to endorse or promote products derived\n\t *    from this software without specific prior written permission.\n\t *\n\t * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n\t * \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\n\t * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\n\t * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\n\t * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\n\t * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n\t * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\n\t * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\n\t * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n\t * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n\t * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\t */\n\t\n\tvar base64 = __webpack_require__(3);\n\t\n\t// A single base 64 digit can contain 6 bits of data. For the base 64 variable\n\t// length quantities we use in the source map spec, the first bit is the sign,\n\t// the next four bits are the actual value, and the 6th bit is the\n\t// continuation bit. The continuation bit tells us whether there are more\n\t// digits in this value following this digit.\n\t//\n\t//   Continuation\n\t//   |    Sign\n\t//   |    |\n\t//   V    V\n\t//   101011\n\t\n\tvar VLQ_BASE_SHIFT = 5;\n\t\n\t// binary: 100000\n\tvar VLQ_BASE = 1 << VLQ_BASE_SHIFT;\n\t\n\t// binary: 011111\n\tvar VLQ_BASE_MASK = VLQ_BASE - 1;\n\t\n\t// binary: 100000\n\tvar VLQ_CONTINUATION_BIT = VLQ_BASE;\n\t\n\t/**\n\t * Converts from a two-complement value to a value where the sign bit is\n\t * placed in the least significant bit.  For example, as decimals:\n\t *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)\n\t *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)\n\t */\n\tfunction toVLQSigned(aValue) {\n\t  return aValue < 0\n\t    ? ((-aValue) << 1) + 1\n\t    : (aValue << 1) + 0;\n\t}\n\t\n\t/**\n\t * Converts to a two-complement value from a value where the sign bit is\n\t * placed in the least significant bit.  For example, as decimals:\n\t *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1\n\t *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2\n\t */\n\tfunction fromVLQSigned(aValue) {\n\t  var isNegative = (aValue & 1) === 1;\n\t  var shifted = aValue >> 1;\n\t  return isNegative\n\t    ? -shifted\n\t    : shifted;\n\t}\n\t\n\t/**\n\t * Returns the base 64 VLQ encoded value.\n\t */\n\texports.encode = function base64VLQ_encode(aValue) {\n\t  var encoded = \"\";\n\t  var digit;\n\t\n\t  var vlq = toVLQSigned(aValue);\n\t\n\t  do {\n\t    digit = vlq & VLQ_BASE_MASK;\n\t    vlq >>>= VLQ_BASE_SHIFT;\n\t    if (vlq > 0) {\n\t      // There are still more digits in this value, so we must make sure the\n\t      // continuation bit is marked.\n\t      digit |= VLQ_CONTINUATION_BIT;\n\t    }\n\t    encoded += base64.encode(digit);\n\t  } while (vlq > 0);\n\t\n\t  return encoded;\n\t};\n\t\n\t/**\n\t * Decodes the next base 64 VLQ value from the given string and returns the\n\t * value and the rest of the string via the out parameter.\n\t */\n\texports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {\n\t  var strLen = aStr.length;\n\t  var result = 0;\n\t  var shift = 0;\n\t  var continuation, digit;\n\t\n\t  do {\n\t    if (aIndex >= strLen) {\n\t      throw new Error(\"Expected more d
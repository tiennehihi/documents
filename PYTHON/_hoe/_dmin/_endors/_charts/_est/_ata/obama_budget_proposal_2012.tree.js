ional. The generated file this source map is associated with.\n\t *   - sections: A list of section definitions.\n\t *\n\t * Each value under the \"sections\" field has two fields:\n\t *   - offset: The offset into the original specified at which this section\n\t *       begins to apply, defined as an object with a \"line\" and \"column\"\n\t *       field.\n\t *   - map: A source map definition. This source map could also be indexed,\n\t *       but doesn't have to be.\n\t *\n\t * Instead of the \"map\" field, it's also possible to have a \"url\" field\n\t * specifying a URL to retrieve a source map from, but that's currently\n\t * unsupported.\n\t *\n\t * Here's an example source map, taken from the source map spec[0], but\n\t * modified to omit a section which uses the \"url\" field.\n\t *\n\t *  {\n\t *    version : 3,\n\t *    file: \"app.js\",\n\t *    sections: [{\n\t *      offset: {line:100, column:10},\n\t *      map: {\n\t *        version : 3,\n\t *        file: \"section.js\",\n\t *        sources: [\"foo.js\", \"bar.js\"],\n\t *        names: [\"src\", \"maps\", \"are\", \"fun\"],\n\t *        mappings: \"AAAA,E;;ABCDE;\"\n\t *      }\n\t *    }],\n\t *  }\n\t *\n\t * The second parameter, if given, is a string whose value is the URL\n\t * at which the source map was found.  This URL is used to compute the\n\t * sources array.\n\t *\n\t * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt\n\t */\n\tfunction IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {\n\t  var sourceMap = aSourceMap;\n\t  if (typeof aSourceMap === 'string') {\n\t    sourceMap = util.parseSourceMapInput(aSourceMap);\n\t  }\n\t\n\t  var version = util.getArg(sourceMap, 'version');\n\t  var sections = util.getArg(sourceMap, 'sections');\n\t\n\t  if (version != this._version) {\n\t    throw new Error('Unsupported version: ' + version);\n\t  }\n\t\n\t  this._sources = new ArraySet();\n\t  this._names = new ArraySet();\n\t\n\t  var lastOffset = {\n\t    line: -1,\n\t    column: 0\n\t  };\n\t  this._sections = sections.map(function (s) {\n\t    if (s.url) {\n\t      // The url field will require support for asynchronicity.\n\t      // See https://github.com/mozilla/source-map/issues/16\n\t      throw new Error('Support for url field in sections not implemented.');\n\t    }\n\t    var offset = util.getArg(s, 'offset');\n\t    var offsetLine = util.getArg(offset, 'line');\n\t    var offsetColumn = util.getArg(offset, 'column');\n\t\n\t    if (offsetLine < lastOffset.line ||\n\t        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {\n\t      throw new Error('Section offsets must be ordered and non-overlapping.');\n\t    }\n\t    lastOffset = offset;\n\t\n\t    return {\n\t      generatedOffset: {\n\t        // The offset fields are 0-based, but we use 1-based indices when\n\t        // encoding/decoding from VLQ.\n\t        generatedLine: offsetLine + 1,\n\t        generatedColumn: offsetColumn + 1\n\t      },\n\t      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)\n\t    }\n\t  });\n\t}\n\t\n\tIndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);\n\tIndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;\n\t\n\t/**\n\t * The version of the source mapping spec that we are consuming.\n\t */\n\tIndexedSourceMapConsumer.prototype._version = 3;\n\t\n\t/**\n\t * The list of original sources.\n\t */\n\tObject.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {\n\t  get: function () {\n\t    var sources = [];\n\t    for (var i = 0; i < this._sections.length; i++) {\n\t      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {\n\t        sources.push(this._sections[i].consumer.sources[j]);\n\t      }\n\t    }\n\t    return sources;\n\t  }\n\t});\n\t\n\t/**\n\t * Returns the original source, line, and column information for the generated\n\t * source's line and column positions provided. The only argument is an object\n\t * with the following properties:\n\t *\n\t *   - line: The line number in the generated source.  The line number\n\t *     is 1-based.\n\t *   - column: The column number in the generated source.  The column\n\t *     number is 0-based.\n\t *\n\t * and an object is returned with the following properties:\n\t *\n\t *   - source: The original source file, or null.\n\t *   - line: The line number in the original source, or null.  The\n\t *     line number is 1-based.\n\t *   - column: The column number in the original source, or null.  The\n\t *     column number is 0-based.\n\t *   - name: The original identifier, or null.\n\t */\n\tIndexedSourceMapConsumer.prototype.originalPositionFor =\n\t  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {\n\t    var needle = {\n\t      generatedLine: util.getArg(aArgs, 'line'),\n\t      generatedColumn: util.getArg(aArgs, 'column')\n\t    };\n\t\n\t    // Find the section containing the generated position we're trying to map\n\t    // to an original position.\n\t    var sectionIndex = binarySearch.search(needle, this._sections,\n\t      function(needle, section) {\n\t        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;\n\t        if (cmp) {\n\t          return cmp;\n\t        }\n\t\n\t        return (needle.generatedColumn -\n\t                section.generatedOffset.generatedColumn);\n\t      });\n\t    var section = this._sections[sectionIndex];\n\t\n\t    if (!section) {\n\t      return {\n\t        source: null,\n\t        line: null,\n\t        column: null,\n\t        name: null\n\t      };\n\t    }\n\t\n\t    return section.consumer.originalPositionFor({\n\t      line: needle.generatedLine -\n\t        (section.generatedOffset.generatedLine - 1),\n\t      column: needle.generatedColumn -\n\t        (section.generatedOffset.generatedLine === needle.generatedLine\n\t         ? section.generatedOffset.generatedColumn - 1\n\t         : 0),\n\t      bias: aArgs.bias\n\t    });\n\t  };\n\t\n\t/**\n\t * Return true if we have the source content for every source in the source\n\t * map, false otherwise.\n\t */\n\tIndexedSourceMapConsumer.prototype.hasContentsOfAllSources =\n\t  function IndexedSourceMapConsumer_hasContentsOfAllSources() {\n\t    return this._sections.every(function (s) {\n\t      return s.consumer.hasContentsOfAllSources();\n\t    });\n\t  };\n\t\n\t/**\n\t * Returns the original source content. The only argument is the url of the\n\t * original source file. Returns null if no original source content is\n\t * available.\n\t */\n\tIndexedSourceMapConsumer.prototype.sourceContentFor =\n\t  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {\n\t    for (var i = 0; i < this._sections.length; i++) {\n\t      var section = this._sections[i];\n\t\n\t      var content = section.consumer.sourceContentFor(aSource, true);\n\t      if (content) {\n\t        return content;\n\t      }\n\t    }\n\t    if (nullOnMissing) {\n\t      return null;\n\t    }\n\t    else {\n\t      throw new Error('\"' + aSource + '\" is not in the SourceMap.');\n\t    }\n\t  };\n\t\n\t/**\n\t * Returns the generated line and column information for the original source,\n\t * line, and column positions provided. The only argument is an object with\n\t * the following properties:\n\t *\n\t *   - source: The filename of the original source.\n\t *   - line: The line number in the original source.  The line number\n\t *     is 1-based.\n\t *   - column: The column number in the original source.  The column\n\t *     number is 0-based.\n\t *\n\t * and an object is returned with the following properties:\n\t *\n\t *   - line: The line number in the generated source, or null.  The\n\t *     line number is 1-based. \n\t *   - column: The column number in the generated source, or null.\n\t *     The column number is 0-based.\n\t */\n\tIndexedSourceMapConsumer.prototype.generatedPositionFor =\n\t  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {\n\t    for (var i = 0; i < this._sections.length; i++) {\n\t      var section = this._sections[i];\n\t\n\t      // Only consider this section if the requested source is in the list of\n\t      // sources of the consumer.\n\t      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {\n\t        continue;\n\t      }\n\t      var generatedPosition = section.consumer.generatedPositionFor(aArgs);\n\t      if (generatedPosition) {\n\t        var ret = {\n\t          line: generatedPosition.line +\n\t            (section.generatedOffset.generatedLine - 1),\n\t          column: generatedPosition.column +\n\t            (section.generatedOffset.generatedLine === generatedPosition.line\n\t             ? section.generatedOffset.generatedColumn - 1\n\t             : 0)\n\t        };\n\t        return ret;\n\t      }\n\t    }\n\t\n\t    return {\n\t      line: null,\n\t      column: null\n\t    };\n\t  };\n\t\n\t/**\n\t * Parse the mappings in a string in to a data structure which we can easily\n\t * query (the ordered arrays in the `this.__generatedMappings` and\n\t * `this.__originalMappings` properties).\n\t */\n\tIndexedSourceMapConsumer.prototype._parseMappings =\n\t  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {\n\t    this.__generatedMappings = [];\n\t    this.__originalMappings = [];\n\t    for (var i = 0; i < this._sections.length; i++) {\n\t      var section = this._sections[i];\n\t      var sectionMappings = section.consumer._generatedMappings;\n\t      for (var j = 0; j < sectionMappings.length; j++) {\n\t        var mapping = sectionMappings[j];\n\t\n\t        var source = section.consumer._sources.at(mapping.source);\n\t        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);\n\t        this._sources.add(source);\n\t        source = this._sources.indexOf(source);\n\t\n\t        var name = null;\n\t        if (mapping.name) {\n\t          name = section.consumer._names.at(mapping.name);\n\t          this._names.add(name);\n\t          name = this._names.indexOf(name);\n\t        }\n\t\n\t        // The mappings coming from the consumer for the section have\n\t        // generated positions relative to the start of the section, so we\n\t        // need to offset them to be relative to the start of the concatenated\n\t        // generated file.\n\t        var adjustedMapping = {\n\t          source: source,\n\t          generatedLine: mapping.generatedLine +\n\t            (section.generatedOffset.generatedLine - 1),\n\t          generatedColumn: mapping.generatedColumn +\n\t            (section.generatedOffset.generatedLine === mapping.generatedLine\n\t            ? section.generatedOffset.generatedColumn - 1\n\t            : 0),\n\t          originalLine: mapping.originalLine,\n\t          originalColumn: mapping.originalColumn,\n\t          name: name\n\t        };\n\t\n\t        this.__generatedMappings.push(adjustedMapping);\n\t        if (typeof adjustedMapping.originalLine === 'number') {\n\t          this.__originalMappings.push(adjustedMapping);\n\t        }\n\t      }\n\t    }\n\t\n\t    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);\n\t    quickSort(this.__originalMappings, util.compareByOriginalPositions);\n\t  };\n\t\n\texports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;\n\n\n/***/ }),\n/* 8 */\n/***/ (function(module, exports) {\n\n\t/* -*- Mode: js; js-indent-level: 2; -*- */\n\t/*\n\t * Copyright 2011 Mozilla Foundation and contributors\n\t * Licensed under the New BSD license. See LICENSE or:\n\t * http://opensource.org/licenses/BSD-3-Clause\n\t */\n\t\n\texports.GREATEST_LOWER_BOUND = 1;\n\texports.LEAST_UPPER_BOUND = 2;\n\t\n\t/**\n\t * Recursive implementation of binary search.\n\t *\n\t * @param aLow Indices here and lower do not contain the needle.\n\t * @param aHigh Indices here and higher do not contain the needle.\n\t * @param aNeedle The element being searched for.\n\t * @param aHaystack The non-empty array being searched.\n\t * @param aCompare Function which takes two elements and returns -1, 0, or 1.\n\t * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or\n\t *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the\n\t *     closest element that is smaller than or greater than the one we are\n\t *     searching for, respectively, if the exact element cannot be found.\n\t */\n\tfunction recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {\n\t  // This function terminates when one of the following is true:\n\t  //\n\t  //   1. We find the exact element we are looking for.\n\t  //\n\t  //   2. We did not find the exact element, but we can return the index of\n\t  //      the next-closest element.\n\t  //\n\t  //   3. We did not find the exact element, and there is no next-closest\n\t  //      element than the one we are searching for, so we return -1.\n\t  var mid = Math.floor((aHigh - aLow) / 2) + aLow;\n\t  var cmp = aCompare(aNeedle, aHaystack[mid], true);\n\t  if (cmp === 0) {\n\t    // Found the element we are looking for.\n\t    return mid;\n\t  }\n\t  else if (cmp > 0) {\n\t    // Our needle is greater than aHaystack[mid].\n\t    if (aHigh - mid > 1) {\n\t      // The element is in the upper half.\n\t      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);\n\t    }\n\t\n\t    // The exact needle element was not found in this haystack. Determine if\n\t    // we are in termination case (3) or (2) and return the appropriate thing.\n\t    if (aBias == exports.LEAST_UPPER_BOUND) {\n\t      return aHigh < aHaystack.length ? aHigh : -1;\n\t    } else {\n\t      return mid;\n\t    }\n\t  }\n\t  else {\n\t    // Our needle is less than aHaystack[mid].\n\t    if (mid - aLow > 1) {\n\t      // The element is in the lower half.\n\t      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);\n\t    }\n\t\n\t    // we are in termination case (3) or (2) and return the appropriate thing.\n\t    if (aBias == exports.LEAST_UPPER_BOUND) {\n\t      return mid;\n\t    } else {\n\t      return aLow < 0 ? -1 : aLow;\n\t    }\n\t  }\n\t}\n\t\n\t/**\n\t * This is an implementation of binary search which will always try and return\n\t * the index of the closest element if there is no exact hit. This is because\n\t * mappings between original and generated line/col pairs are single points,\n\t * and there is an implicit region between each of them, so a miss just means\n\t * that you aren't on the very start of a region.\n\t *\n\t * @param aNeedle The element you are looking for.\n\t * @param aHaystack The array that is being searched.\n\t * @param aCompare A function which takes the needle and an element in the\n\t *     array and returns -1, 0, or 1 depending on whether the needle is less\n\t *     than, equal to, or greater than the element, respectively.\n\t * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or\n\t *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the\n\t *     closest element that is smaller than or greater than the one we are\n\t *     searching for, respectively, if the exact element cannot be found.\n\t *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.\n\t */\n\texports.search = function search(aNeedle, aHaystack, aCompare, aBias) {\n\t  if (aHaystack.length === 0) {\n\t    return -1;\n\t  }\n\t\n\t  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,\n\t                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);\n\t  if (index < 0) {\n\t    return -1;\n\t  }\n\t\n\t  // We have found either the exact element, or the next-closest element than\n\t  // the one we are searching for. However, there may be more than one such\n\t  // element. Make sure we always return the smallest of these.\n\t  while (index - 1 >= 0) {\n\t    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {\n\t      break;\n\t    }\n\t    --index;\n\t  }\n\t\n\t  return index;\n\t};\n\n\n/***/ }),\n/* 9 */\n/***/ (function(module, exports) {\n\n\t/* -*- Mode: js; js-indent-level: 2; -*- */\n\t/*\n\t * Copyright 2011 Mozilla Foundation and contributors\n\t * Licensed under the New BSD license. See LICENSE or:\n\t * http://opensource.org/licenses/BSD-3-Clause\n\t */\n\t\n\t// It turns out that some (most?) Jional. The generated file this source map is associated with.\n\t *   - sections: A list of section definitions.\n\t *\n\t * Each value under the \"sections\" field has two fields:\n\t *   - offset: The offset into the original specified at which this section\n\t *       begins to apply, defined as an object with a \"line\" and \"column\"\n\t *       field.\n\t *   - map: A source map definition. This source map could also be indexed,\n\t *       but doesn't have to be.\n\t *\n\t * Instead of the \"map\" field, it's also possible to have a \"url\" field\n\t * specifying a URL to retrieve a source map from, but that's currently\n\t * unsupported.\n\t *\n\t * Here's an example source map, taken from the source map spec[0], but\n\t * modified to omit a section which uses the \"url\" field.\n\t *\n\t *  {\n\t *    version : 3,\n\t *    file: \"app.js\",\n\t *    sections: [{\n\t *      offset: {line:100, column:10},\n\t *      map: {\n\t *        version : 3,\n\t *        file: \"section.js\",\n\t *        sources: [\"foo.js\", \"bar.js\"],\n\t *        names: [\"src\", \"maps\", \"are\", \"fun\"],\n\t *        mappings: \"AAAA,E;;ABCDE;\"\n\t *      }\n\t *    }],\n\t *  }\n\t *\n\t * The second parameter, if given, is a string whose value is the URL\n\t * at which the source map was found.  This URL is used to compute the\n\t * sources array.\n\t *\n\t * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt\n\t */\n\tfunction IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {\n\t  var sourceMap = aSourceMap;\n\t  if (typeof aSourceMap === 'string') {\n\t    sourceMap = util.parseSourceMapInput(aSourceMap);\n\t  }\n\t\n\t  var version = util.getArg(sourceMap, 'version');\n\t  var sections = util.getArg(sourceMap, 'sections');\n\t\n\t  if (version != this._version) {\n\t    throw new Error('Unsupported version: ' + version);\n\t  }\n\t\n\t  this._sources = new ArraySet();\n\t  this._names = new ArraySet();\n\t\n\t  var lastOffset = {\n\t    line: -1,\n\t    column: 0\n\t  };\n\t  this._sections = sections.map(function (s) {\n\t    if (s.url) {\n\t      // The url field will require support for asynchronicity.\n\t      // See https://github.com/mozilla/source-map/issues/16\n\t      throw new Error('Support for url field in sections not implemented.');\n\t    }\n\t    var offset = util.getArg(s, 'offset');\n\t    var offsetLine = util.getArg(offset, 'line');\n\t    var offsetColumn = util.getArg(offset, 'column');\n\t\n\t    if (offsetLine < lastOffset.line ||\n\t        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {\n\t      throw new Error('Section offsets must be ordered and non-overlapping.');\n\t    }\n\t    lastOffset = offset;\n\t\n\t    return {\n\t      generatedOffset: {\n\t        // The offset fields are 0-based, but we use 1-based indices when\n\t        // encoding/decoding from VLQ.\n\t        generatedLine: offsetLine + 1,\n\t        generatedColumn: offsetColumn + 1\n\t      },\n\t      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)\n\t    }\n\t  });\n\t}\n\t\n\tIndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);\n\tIndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;\n\t\n\t/**\n\t * The version of the source mapping spec that we are consuming.\n\t */\n\tIndexedSourceMapConsumer.prototype._version = 3;\n\t\n\t/**\n\t * The list of original sources.\n\t */\n\tObject.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {\n\t  get: function () {\n\t    var sources = [];\n\t    for (var i = 0; i < this._sections.length; i++) {\n\t      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {\n\t        sources.push(this._sections[i].consumer.sources[j]);\n\t      }\n\t    }\n\t    return sources;\n\t  }\n\t});\n\t\n\t/**\n\t * Returns the original source, line, and column information for the generated\n\t * source's line and column positions provided. The only argument is an object\n\t * with the following properties:\n\t *\n\t *   - line: The line number in the generated source.  The line number\n\t *     is 1-based.\n\t *   - column: The column number in the generated source.  The column\n\t *     number is 0-based.\n\t *\n\t * and an object is returned with the following properties:\n\t *\n\t *   - source: The original source file, or null.\n\t *   - line: The line number in the original source, or null.  The\n\t *     line number is 1-based.\n\t *   - column: The column number in the original source, or null.  The\n\t *     column number is 0-based.\n\t *   - name: The original identifier, or null.\n\t */\n\tIndexedSourceMapConsumer.prototype.originalPositionFor =\n\t  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {\n\t    var needle = {\n\t      generatedLine: util.getArg(aArgs, 'line'),\n\t      generatedColumn: util.getArg(aArgs, 'column')\n\t    };\n\t\n\t    // Find the section containing the generated position we're trying to map\n\t    // to an original position.\n\t    var sectionIndex = binarySearch.search(needle, this._sections,\n\t      function(needle, section) {\n\t        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;\n\t        if (cmp) {\n\t          return cmp;\n\t        }\n\t\n\t        return (needle.generatedColumn -\n\t                section.generatedOffset.generatedColumn);\n\t      });\n\t    var section = this._sections[sectionIndex];\n\t\n\t    if (!section) {\n\t      return {\n\t        source: null,\n\t        line: null,\n\t        column: null,\n\t        name: null\n\t      };\n\t    }\n\t\n\t    return section.consumer.originalPositionFor({\n\t      line: needle.generatedLine -\n\t        (section.generatedOffset.generatedLine - 1),\n\t      column: needle.generatedColumn -\n\t        (section.generatedOffset.generatedLine === needle.generatedLine\n\t         ? section.generatedOffset.generatedColumn - 1\n\t         : 0),\n\t      bias: aArgs.bias\n\t    });\n\t  };\n\t\n\t/**\n\t * Return true if we have the source content for every source in the source\n\t * map, false otherwise.\n\t */\n\tIndexedSourceMapConsumer.prototype.hasContentsOfAllSources =\n\t  function IndexedSourceMapConsumer_hasContentsOfAllSources() {\n\t    return this._sections.every(function (s) {\n\t      return s.consumer.hasContentsOfAllSources();\n\t    });\n\t  };\n\t\n\t/**\n\t * Returns the original source content. The only argument is the url of the\n\t * original source file. Returns null if no original source content is\n\t * available.\n\t */\n\tIndexedSourceMapConsumer.prototype.sourceContentFor =\n\t  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {\n\t    for (var i = 0; i < this._sections.length; i++) {\n\t      var section = this._sections[i];\n\t\n\t      var content = section.consumer.sourceContentFor(aSource, true);\n\t      if (content) {\n\t        return content;\n\t      }\n\t    }\n\t    if (nullOnMissing) {\n\t      return null;\n\t    }\n\t    else {\n\t      throw new Error('\"' + aSource + '\" is not in the SourceMap.');\n\t    }\n\t  };\n\t\n\t/**\n\t * Returns the generated line and column information for the original source,\n\t * line, and column positions provided. The only argument is an object with\n\t * the following properties:\n\t *\n\t *   - source: The filename of the original source.\n\t *   - line: The line number in the original source.  The line number\n\t *     is 1-based.\n\t *   - column: The column number in the original source.  The column\n\t *     number is 0-based.\n\t *\n\t * and an object is returned with the following properties:\n\t *\n\t *   - line: The line number in the generated source, or null.  The\n\t *     line number is 1-based. \n\t *   - column: The column number in the generated source, or null.\n\t *     The column number is 0-based.\n\t */\n\tIndexedSourceMapConsumer.prototype.generatedPositionFor =\n\t  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {\n\t    for (var i = 0; i < this._sections.length; i++) {\n\t      var section = this._sections[i];\n\t\n\t      // Only consider this section if the requested source is in the list of\n\t      // sources of the consumer.\n\t      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {\n\t        continue;\n\t      }\n\t      var generatedPosition = section.consumer.generatedPositionFor(aArgs);\n\t      if (generatedPosition) {\n\t        var ret = {\n\t          line: generatedPosition.line +\n\t            (section.generatedOffset.generatedLine - 1),\n\t          column: generatedPosition.column +\n\t            (section.generatedOffset.generatedLine === generatedPosition.line\n\t             ? section.generatedOffset.generatedColumn - 1\n\t             : 0)\n\t        };\n\t        return ret;\n\t      }\n\t    }\n\t\n\t    return {\n\t      line: null,\n\t      column: null\n\t    };\n\t  };\n\t\n\t/**\n\t * Parse the mappings in a string in to a data structure which we can easily\n\t * query (the ordered arrays in the `this.__generatedMappings` and\n\t * `this.__originalMappings` properties).\n\t */\n\tIndexedSourceMapConsumer.prototype._parseMappings =\n\t  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {\n\t    this.__generatedMappings = [];\n\t    this.__originalMappings = [];\n\t    for (var i = 0; i < this._sections.length; i++) {\n\t      var section = this._sections[i];\n\t      var sectionMappings = section.consumer._generatedMappings;\n\t      for (var j = 0; j < sectionMappings.length; j++) {\n\t        var mapping = sectionMappings[j];\n\t\n\t        var source = section.consumer._sources.at(mapping.source);\n\t        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);\n\t        this._sources.add(source);\n\t        source = this._sources.indexOf(source);\n\t\n\t        var name = null;\n\t        if (mapping.name) {\n\t          name = section.consumer._names.at(mapping.name);\n\t          this._names.add(name);\n\t          name = this._names.indexOf(name);\n\t        }\n\t\n\t        // The mappings coming from the consumer for the section have\n\t        // generated positions relative to the start of the section, so we\n\t        // need to offset them to be relative to the start of the concatenated\n\t        // generated file.\n\t        var adjustedMapping = {\n\t          source: source,\n\t          generatedLine: mapping.generatedLine +\n\t            (section.generatedOffset.generatedLine - 1),\n\t          generatedColumn: mapping.generatedColumn +\n\t            (section.generatedOffset.generatedLine === mapping.generatedLine\n\t            ? section.generatedOffset.generatedColumn - 1\n\t            : 0),\n\t          originalLine: mapping.originalLine,\n\t          originalColumn: mapping.originalColumn,\n\t          name: name\n\t        };\n\t\n\t        this.__generatedMappings.push(adjustedMapping);\n\t        if (typeof adjustedMapping.originalLine === 'number') {\n\t          this.__originalMappings.push(adjustedMapping);\n\t        }\n\t      }\n\t    }\n\t\n\t    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);\n\t    quickSort(this.__originalMappings, util.compareByOriginalPositions);\n\t  };\n\t\n\texports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;\n\n\n/***/ }),\n/* 8 */\n/***/ (function(module, exports) {\n\n\t/* -*- Mode: js; js-indent-level: 2; -*- */\n\t/*\n\t * Copyright 2011 Mozilla Foundation and contributors\n\t * Licensed under the New BSD license. See LICENSE or:\n\t * http://opensource.org/licenses/BSD-3-Clause\n\t */\n\t\n\texports.GREATEST_LOWER_BOUND = 1;\n\texports.LEAST_UPPER_BOUND = 2;\n\t\n\t/**\n\t * Recursive implementation of binary search.\n\t *\n\t * @param aLow Indices here and lower do not contain the needle.\n\t * @param aHigh Indices here and higher do not contain the needle.\n\t * @param aNeedle The element being searched for.\n\t * @param aHaystack The non-empty array being searched.\n\t * @param aCompare Function which takes two elements and returns -1, 0, or 1.\n\t * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or\n\t *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the\n\t *     closest element that is smaller than or greater than the one we are\n\t *     searching for, respectively, if the exact element cannot be found.\n\t */\n\tfunction recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {\n\t  // This function terminates when one of the following is true:\n\t  //\n\t  //   1. We find the exact element we are looking for.\n\t  //\n\t  //   2. We did not find the exact element, but we can return the index of\n\t  //      the next-closest element.\n\t  //\n\t  //   3. We did not find the exact element, and there is no next-closest\n\t  //      element than the one we are searching for, so we return -1.\n\t  var mid = Math.floor((aHigh - aLow) / 2) + aLow;\n\t  var cmp = aCompare(aNeedle, aHaystack[mid], true);\n\t  if (cmp === 0) {\n\t    // Found the element we are looking for.\n\t    return mid;\n\t  }\n\t  else if (cmp > 0) {\n\t    // Our needle is greater than aHaystack[mid].\n\t    if (aHigh - mid > 1) {\n\t      // The element is in the upper half.\n\t      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);\n\t    }\n\t\n\t    // The exact needle element was not found in this haystack. Determine if\n\t    // we are in termination case (3) or (2) and return the appropriate thing.\n\t    if (aBias == exports.LEAST_UPPER_BOUND) {\n\t      return aHigh < aHaystack.length ? aHigh : -1;\n\t    } else {\n\t      return mid;\n\t    }\n\t  }\n\t  else {\n\t    // Our needle is less than aHaystack[mid].\n\t    if (mid - aLow > 1) {\n\t      // The element is in the lower half.\n\t      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);\n\t    }\n\t\n\t    // we are in termination case (3) or (2) and return the appropriate thing.\n\t    if (aBias == exports.LEAST_UPPER_BOUND) {\n\t      return mid;\n\t    } else {\n\t      return aLow < 0 ? -1 : aLow;\n\t    }\n\t  }\n\t}\n\t\n\t/**\n\t * This is an implementation of binary search which will always try and return\n\t * the index of the closest element if there is no exact hit. This is because\n\t * mappings between original and generated line/col pairs are single points,\n\t * and there is an implicit region between each of them, so a miss just means\n\t * that you aren't on the very start of a region.\n\t *\n\t * @param aNeedle The element you are looking for.\n\t * @param aHaystack The array that is being searched.\n\t * @param aCompare A function which takes the needle and an element in the\n\t *     array and returns -1, 0, or 1 depending on whether the needle is less\n\t *     than, equal to, or greater than the element, respectively.\n\t * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or\n\t *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the\n\t *     closest element that is smaller than or greater than the one we are\n\t *     searching for, respectively, if the exact element cannot be found.\n\t *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.\n\t */\n\texports.search = function search(aNeedle, aHaystack, aCompare, aBias) {\n\t  if (aHaystack.length === 0) {\n\t    return -1;\n\t  }\n\t\n\t  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,\n\t                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);\n\t  if (index < 0) {\n\t    return -1;\n\t  }\n\t\n\t  // We have found either the exact element, or the next-closest element than\n\t  // the one we are searching for. However, there may be more than one such\n\t  // element. Make sure we always return the smallest of these.\n\t  while (index - 1 >= 0) {\n\t    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {\n\t      break;\n\t    }\n\t    --index;\n\t  }\n\t\n\t  return index;\n\t};\n\n\n/***/ }),\n/* 9 */\n/***/ (function(module, exports) {\n\n\t/* -*- Mode: js; js-indent-level: 2; -*- */\n\t/*\n\t * Copyright 2011 Mozilla Foundation and contributors\n\t * Licensed under the New BSD license. See LICENSE or:\n\t * http://opensource.org/licenses/BSD-3-Clause\n\t */\n\t\n\t// It turns out that some (most?) Jal && _this._isUpdate) {
        eventProps.isUpdate = true;
      }

      _this.dispatchEvent(new WorkboxEvent(state, eventProps));

      if (state === 'installed') {
        // This timeout is used to ignore cases where the service worker calls
        // `skipWaiting()` in the install event, thus moving it directly in the
        // activating state. (Since all service workers *must* go through the
        // waiting phase, the only way to detect `skipWaiting()` called in the
        // install event is to observe that the time spent in the waiting phase
        // is very short.)
        // NOTE: we don't need separate timeouts for the own and external SWs
        // since they can't go through these phases at the same time.
        _this._waitingTimeout = self.setTimeout(function () {
          // Ensure the SW is still waiting (it may now be redundant).
          if (state === 'installed' && registration.waiting === sw) {
            _this.dispatchEvent(new WorkboxEvent('waiting', eventProps));

            {
              if (isExternal) {
                logger.warn('An external service worker has installed but is ' + 'waiting for this client to close before activating...');
              } else {
                logger.warn('The service worker has installed but is waiting ' + 'for existing clients to close before activating...');
              }
            }
          }
        }, WAITING_TIMEOUT_DURATION);
      } else if (state === 'activating') {
        clearTimeout(_this._waitingTimeout);

        if (!isExternal) {
          _this._activeDeferred.resolve(sw);
        }
      }

      {
        switch (state) {
          case 'installed':
            if (isExternal) {
              logger.warn('An external service worker has installed. ' + 'You may want to suggest users reload this page.');
            } else {
              logger.log('Registered service worker installed.');
            }

            break;

          case 'activated':
            if (isExternal) {
              logger.warn('An external service worker has activated.');
            } else {
              logger.log('Registered service worker activated.');

              if (sw !== navigator.serviceWorker.controller) {
                logger.warn('The registered service worker is active but ' + 'not yet controlling the page. Reload or run ' + '`clients.claim()` in the service worker.');
              }
            }

            break;

          case 'redundant':
            if (sw === _this._compatibleControllingSW) {
              logger.log('Previously controlling service worker now redundant!');
            } else if (!isExternal) {
              logger.log('Registered service worker now redundant!');
            }

            break;
        }
      }
    };
    /**
     * @private
     * @param {Event} originalEvent
     */


    _this._onControllerChange = function (originalEvent) {
      var sw = _this._sw;
      var isExternal = sw !== navigator.serviceWorker.controller; // Unconditionally dispatch the controlling event, with isExternal set
      // to distinguish between controller changes due to the initial registration
      // vs. an update-check or other tab's registration.
      // See https://github.com/GoogleChrome/workbox/issues/2786

      _this.dispatchEvent(new WorkboxEvent('controlling', {
        isExternal: isExternal,
        originalEvent: originalEvent,
        sw: sw,
        isUpdate: _this._isUpdate
      }));

      if (!isExternal) {
        {
          logger.log('Registered service worker now controlling this page.');
        }

        _this._controllingDeferred.resolve(sw);
      }
    };
    /**
     * @private
     * @param {Event} originalEvent
     */


    _this._onMessage = _async(function (originalEvent) {
      // Can't change type 'any' of data.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      var data = originalEvent.data,
          ports = originalEvent.ports,
          source = originalEvent.source; // Wait until there's an "own" service worker. This is used to buffer
      // `message` events that may be received prior to calling `register()`.

      return _await(_this.getSW(), function () {
        if (_this._ownSWs.has(source)) {
          _this.dispatchEvent(new WorkboxEvent('message', {
            // Can't change type 'any' of data.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            data: data,
            originalEvent: originalEvent,
            ports: ports,
            sw: source
          }));
        }
      }); // If the service worker that sent the message is in the list of own
      // service workers for this instance, dispatch a `message` event.
      // NOTE: we check for all previously owned service workers rather than
      // just the current one because some messages (e.g. cache updates) use
      // a timeout when sent and may be delayed long enough for a service worker
      // update to be found.
    });
    _this._scriptURL = scriptURL;
    _this._registerOptions = registerOptions; // Add a message listener immediately since messages received during
    // page load are buffered only until the DOMContentLoaded event:
    // https://github.com/GoogleChrome/workbox/issues/2202

    navigator.serviceWorker.addEventListener('message', _this._onMessage);
    return _this;
  }
  /**
   * Registers a service worker for this instances script URL and service
   * worker options. By default this method delays registration until after
   * the window has loaded.
   *
   * @param {Object} [options]
   * @param {Function} [options.immediate=false] Setting this to true will
   *     register the service worker immediately, even if the window has
   *     not loaded (not recommended).
   */


  var _proto = Workbox.prototype;

  _proto.register = function register(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$immediate = _ref.immediate,
        immediate = _ref$immediate === void 0 ? false : _ref$immediate;

    try {
      var _this3 = this;

      if ("dev" !== 'production') {
        if (_this3._registrationTime) {
          logger.error('Cannot re-register a Workbox instance after it has ' + 'been registered. Create a new instance instead.');
          return;
        }
      }

      return _invoke(function () {
        if (!immediate && document.readyState !== 'complete') {
          return _awaitIgnored(new Promise(function (res) {
            return window.addEventListener('load', res);
          }));
        }
      }, function () {
        // Set this flag to true if any service worker was controlling the page
        // at registration time.
        _this3._isUpdate = Boolean(navigator.serviceWorker.controller); // Before registering, attempt to determine if a SW is already controlling
        // the page, and if that SW script (and version, if specified) matches this
        // instance's script.

        _this3._compatibleControllingSW = _this3._getControllingSWIfCompatible();
        return _await(_this3._registerScript(), function (_this2$_registerScrip) {
          _this3._registration = _this2$_registerScrip;

          // If we have a compatible controller, store the controller as the "own"
          // SW, resolve active/controlling deferreds and add necessary listeners.
          if (_this3._compatibleControllingSW) {
            _this3._sw = _this3._compatibleControllingSW;

            _this3._activeDeferred.resolve(_this3._compatibleControllingSW);

            _this3._controllingDeferred.resolve(_this3._compatibleControllingSW);

            _this3._compatibleControllingSW.addEventListener('statechange', _this3._onStateChange, {
              once: true
            });
          } // If there's a waiting service worker with a matching URL before the
          // `updatefound` event fires, it likely means that this site is open
          // in another tab, or the user refreshed the page (and thus the previous
          // page wasn't fully unloaded before this page started loading).
          // https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#waiting


          var waitingSW = _this3._registration.waiting;

          if (waitingSW && urlsMatch(waitingSW.scriptURL, _this3._scriptURL.toString())) {
            // Store the waiting SW as the "own" Sw, even if it means overwriting
            // a compatible controller.
            _this3._sw = waitingSW; // Run this in the next microtask, so any code that adds an event
            // listener after awaiting `register()` will get this event.

            dontWaitFor(Promise.resolve().then(function () {
              _this3.dispatchEvent(new WorkboxEvent('waiting', {
                sw: waitingSW,
                wasWaitingBeforeRegister: true
              }));

              if ("dev" !== 'production') {
                logger.warn('A service worker was already waiting to activate ' + 'before this script was registered...');
              }
            }));
          } // If an "own" SW is already set, resolve the deferred.


          if (_this3._sw) {
            _this3._swDeferred.resolve(_this3._sw);

            _this3._ownSWs.add(_this3._sw);
          }

          if ("dev" !== 'production') {
            logger.log('Successfully registered service worker.', _this3._scriptURL.toString());

            if (navigator.serviceWorker.controller) {
              if (_this3._compatibleControllingSW) {
                logger.debug('A service worker with the same script URL ' + 'is already controlling this page.');
              } else {
                logger.debug('A service worker with a different script URL is ' + 'currently controlling the page. The browser is now fetching ' + 'the new script now...');
              }
            }

            var currentPageIsOutOfScope = function currentPageIsOutOfScope() {
              var scopeURL = new URL(_this3._registerOptions.scope || _this3._scriptURL.toString(), document.baseURI);
              var scopeURLBasePath = new URL('./', scopeURL.href).pathname;
              return !location.pathname.startsWith(scopeURLBasePath);
            };

            if (currentPageIsOutOfScope()) {
              logger.warn('The current page is not in scope for the registered ' + 'service worker. Was this a mistake?');
            }
          }

          _this3._registration.addEventListener('updatefound', _this3._onUpdateFound);

          navigator.serviceWorker.addEventListener('controllerchange', _this3._onControllerChange);
          return _this3._registration;
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * Checks for updates of the registered service worker.
   */
  ;

  _proto.update = function update() {
    try {
      var _this5 = this;

      if (!_this5._registration) {
        if ("dev" !== 'production') {
          logger.error('Cannot update a Workbox instance without ' + 'being registered. Register the Workbox instance first.');
        }

        return;
      } // Try to update registration


      return _awaitIgnored(_this5._registration.update());
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * Resolves to the service worker registered by this instance as soon as it
   * is active. If a service worker was already controlling at registration
   * time then it will resolve to that if the script URLs (and optionally
   * script versions) match, otherwise it will wait until an update is found
   * and activates.
   *
   * @return {Promise<ServiceWorker>}
   */
  ;

  /**
   * Resolves with a reference to a service worker that matches the script URL
   * of this instance, as soon as it's available.
   *
   * If, at registration time, there's already an active or waiting service
   * worker with a matching script URL, it will be used (with the waiting
   * service worker taking precedence over the active service worker if both
   * match, since the waiting service worker would have been registered more
   * recently).
   * If there's no matching active or waiting service worker at registration
   * time then the promise will not resolve until an update is found and starts
   * installing, at which point the installing service worker is used.
   *
   * @return {Promise<ServiceWorker>}
   */
  _proto.getSW = function getSW() {
    // If `this._sw` is set, resolve with that as we want `getSW()` to
    // return the correct (new) service worker if an update is found.
    return this._sw !== undefined ? Promise.resolve(this._sw) : this._swDeferred.promise;
  }
  /**
   * Sends the passed data object to the service worker registered by this
   * instance (via {@link workbox-window.Workbox#getSW}) and resolves
   * with a response (if any).
   *
   * A response can be set in a message handler in the service worker by
   * calling `event.ports[0].postMessage(...)`, which will resolve the promise
   * returned by `messageSW()`. If no response is set, the promise will never
   * resolve.
   *
   * @param {Object} data An object to send to the service worker
   * @return {Promise<Object>}
   */
  // We might be able to change the 'data' type to Record<string, unknown> in the future.
  // eslint-disable-next-line @typescript-eslint/ban-types
  ;

  _proto.messageSW = function messageSW$1(data) {
    try {
      var _this7 = this;

      return _await(_this7.getSW(), function (sw) {
        return messageSW(sw, data);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * Sends a `{type: 'SKIP_WAITING'}` message to the service worker that's
   * currently in the `waiting` state associated with the current registration.
   *
   * If there is no current registration or no service worker is `waiting`,
   * calling this will have no effect.
   */
  ;

  _proto.messageSkipWaiting = function messageSkipWaiting() {
    if (this._registration && this._registration.waiting) {
      void messageSW(this._registration.waiting, SKIP_WAITING_MESSAGE);
    }
  }
  /**
   * Checks for a service worker already controlling the page and returns
   * it if its script URL matches.
   *
   * @private
   * @return {ServiceWorker|undefined}
   */
  ;

  _proto._getControllingSWIfCompatible = function _getControllingSWIfCompatible() {
    var controller = navigator.serviceWorker.controller;

    if (controller && urlsMatch(controller.scriptURL, this._scriptURL.toString())) {
      return controller;
    } else {
      return undefined;
    }
  }
  /**
   * Registers a service worker for this instances script URL and register
   * options and tracks the time registration was complete.
   *
   * @private
   */
  ;

  _proto._registerScript = function _registerScript() {
    try {
      var _this9 = this;

      return _catch(function () {
        // this._scriptURL may be a TrustedScriptURL, but there's no support for
        // passing that to register() in lib.dom right now.
        // https://github.com/GoogleChrome/workbox/issues/2855
        return _await(navigator.serviceWorker.register(_this9._scriptURL, _this9._registerOptions), function (reg) {
          // Keep track of when registration happened, so it can be used in the
          // `this._onUpdateFound` heuristic. Also use the presence of this
          // property as a way to see if `.register()` has been called.
          _this9._registrationTime = performance.now();
          return reg;
        });
      }, function (error) {
        if ("dev" !== 'production') {
          logger.error(error);
        } // Re-throw the error.


        throw error;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _createClass(Workbox, [{
    key: "active",
    get: function get() {
      return this._activeDeferred.promise;
    }
    /**
     * Resolves to the service worker registered by this instance as soon as it
     * is controlling the page. If a service worker was already controlling at
     * registration time then it will resolve to that if the script URLs (and
     * optionally script versions) match, otherwise it will wait until an update
     * is found and starts controlling the page.
     * Note: the first time a service worker is installed it will active but
     * not start controlling the page unless `clients.claim()` is called in thional. The generated file this source map is associated with.\n\t *   - sections: A list of section definitions.\n\t *\n\t * Each value under the \"sections\" field has two fields:\n\t *   - offset: The offset into the original specified at which this section\n\t *       begins to apply, defined as an object with a \"line\" and \"column\"\n\t *       field.\n\t *   - map: A source map definition. This source map could also be indexed,\n\t *       but doesn't have to be.\n\t *\n\t * Instead of the \"map\" field, it's also possible to have a \"url\" field\n\t * specifying a URL to retrieve a source map from, but that's currently\n\t * unsupported.\n\t *\n\t * Here's an example source map, taken from the source map spec[0], but\n\t * modified to omit a section which uses the \"url\" field.\n\t *\n\t *  {\n\t *    version : 3,\n\t *    file: \"app.js\",\n\t *    sections: [{\n\t *      offset: {line:100, column:10},\n\t *      map: {\n\t *        version : 3,\n\t *        file: \"section.js\",\n\t *        sources: [\"foo.js\", \"bar.js\"],\n\t *        names: [\"src\", \"maps\", \"are\", \"fun\"],\n\t *        mappings: \"AAAA,E;;ABCDE;\"\n\t *      }\n\t *    }],\n\t *  }\n\t *\n\t * The second parameter, if given, is a string whose value is the URL\n\t * at which the source map was found.  This URL is used to compute the\n\t * sources array.\n\t *\n\t * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt\n\t */\n\tfunction IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {\n\t  var sourceMap = aSourceMap;\n\t  if (typeof aSourceMap === 'string') {\n\t    sourceMap = util.parseSourceMapInput(aSourceMap);\n\t  }\n\t\n\t  var version = util.getArg(sourceMap, 'version');\n\t  var sections = util.getArg(sourceMap, 'sections');\n\t\n\t  if (version != this._version) {\n\t    throw new Error('Unsupported version: ' + version);\n\t  }\n\t\n\t  this._sources = new ArraySet();\n\t  this._names = new ArraySet();\n\t\n\t  var lastOffset = {\n\t    line: -1,\n\t    column: 0\n\t  };\n\t  this._sections = sections.map(function (s) {\n\t    if (s.url) {\n\t      // The url field will require support for asynchronicity.\n\t      // See https://github.com/mozilla/source-map/issues/16\n\t      throw new Error('Support for url field in sections not implemented.');\n\t    }\n\t    var offset = util.getArg(s, 'offset');\n\t    var offsetLine = util.getArg(offset, 'line');\n\t    var offsetColumn = util.getArg(offset, 'column');\n\t\n\t    if (offsetLine < lastOffset.line ||\n\t        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {\n\t      throw new Error('Section offsets must be ordered and non-overlapping.');\n\t    }\n\t    lastOffset = offset;\n\t\n\t    return {\n\t      generatedOffset: {\n\t        // The offset fields are 0-based, but we use 1-based indices when\n\t        // encoding/decoding from VLQ.\n\t        generatedLine: offsetLine + 1,\n\t        generatedColumn: offsetColumn + 1\n\t      },\n\t      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)\n\t    }\n\t  });\n\t}\n\t\n\tIndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);\n\tIndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;\n\t\n\t/**\n\t * The version of the source mapping spec that we are consuming.\n\t */\n\tIndexedSourceMapConsumer.prototype._version = 3;\n\t\n\t/**\n\t * The list of original sources.\n\t */\n\tObject.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {\n\t  get: function () {\n\t    var sources = [];\n\t    for (var i = 0; i < this._sections.length; i++) {\n\t      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {\n\t        sources.push(this._sections[i].consumer.sources[j]);\n\t      }\n\t    }\n\t    return sources;\n\t  }\n\t});\n\t\n\t/**\n\t * Returns the original source, line, and column information for the generated\n\t * source's line and column positions provided. The only argument is an object\n\t * with the following properties:\n\t *\n\t *   - line: The line number in the generated source.  The line number\n\t *     is 1-based.\n\t *   - column: The column number in the generated source.  The column\n\t *     number is 0-based.\n\t *\n\t * and an object is returned with the following properties:\n\t *\n\t *   - source: The original source file, or null.\n\t *   - line: The line number in the original source, or null.  The\n\t *     line number is 1-based.\n\t *   - column: The column number in the original source, or null.  The\n\t *     column number is 0-based.\n\t *   - name: The original identifier, or null.\n\t */\n\tIndexedSourceMapConsumer.prototype.originalPositionFor =\n\t  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {\n\t    var needle = {\n\t      generatedLine: util.getArg(aArgs, 'line'),\n\t      generatedColumn: util.getArg(aArgs, 'column')\n\t    };\n\t\n\t    // Find the section containing the generated position we're trying to map\n\t    // to an original position.\n\t    var sectionIndex = binarySearch.search(needle, this._sections,\n\t      function(needle, section) {\n\t        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;\n\t        if (cmp) {\n\t          return cmp;\n\t        }\n\t\n\t        return (needle.generatedColumn -\n\t                section.generatedOffset.generatedColumn);\n\t      });\n\t    var section = this._sections[sectionIndex];\n\t\n\t    if (!section) {\n\t      return {\n\t        source: null,\n\t        line: null,\n\t        column: null,\n\t        name: null\n\t      };\n\t    }\n\t\n\t    return section.consumer.originalPositionFor({\n\t      line: needle.generatedLine -\n\t        (section.generatedOffset.generatedLine - 1),\n\t      column: needle.generatedColumn -\n\t        (section.generatedOffset.generatedLine === needle.generatedLine\n\t         ? section.generatedOffset.generatedColumn - 1\n\t         : 0),\n\t      bias: aArgs.bias\n\t    });\n\t  };\n\t\n\t/**\n\t * Return true if we have the source content for every source in the source\n\t * map, false otherwise.\n\t */\n\tIndexedSourceMapConsumer.prototype.hasContentsOfAllSources =\n\t  function IndexedSourceMapConsumer_hasContentsOfAllSources() {\n\t    return this._sections.every(function (s) {\n\t      return s.consumer.hasContentsOfAllSources();\n\t    });\n\t  };\n\t\n\t/**\n\t * Returns the original source content. The only argument is the url of the\n\t * original source file. Returns null if no original source content is\n\t * available.\n\t */\n\tIndexedSourceMapConsumer.prototype.sourceContentFor =\n\t  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {\n\t    for (var i = 0; i < this._sections.length; i++) {\n\t      var section = this._sections[i];\n\t\n\t      var content = section.consumer.sourceContentFor(aSource, true);\n\t      if (content) {\n\t        return content;\n\t      }\n\t    }\n\t    if (nullOnMissing) {\n\t      return null;\n\t    }\n\t    else {\n\t      throw new Error('\"' + aSource + '\" is not in the SourceMap.');\n\t    }\n\t  };\n\t\n\t/**\n\t * Returns the generated line and column information for the original source,\n\t * line, and column positions provided. The only argument is an object with\n\t * the following properties:\n\t *\n\t *   - source: The filename of the original source.\n\t *   - line: The line number in the original source.  The line number\n\t *     is 1-based.\n\t *   - column: The column number in the original source.  The column\n\t *     number is 0-based.\n\t *\n\t * and an object is returned with the following properties:\n\t *\n\t *   - line: The line number in the generated source, or null.  The\n\t *     line number is 1-based. \n\t *   - column: The column number in the generated source, or null.\n\t *     The column number is 0-based.\n\t */\n\tIndexedSourceMapConsumer.prototype.generatedPositionFor =\n\t  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {\n\t    for (var i = 0; i < this._sections.length; i++) {\n\t      var section = this._sections[i];\n\t\n\t      // Only consider this section if the requested source is in the list of\n\t      // sources of the consumer.\n\t      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {\n\t        continue;\n\t      }\n\t      var generatedPosition = section.consumer.generatedPositionFor(aArgs);\n\t      if (generatedPosition) {\n\t        var ret = {\n\t          line: generatedPosition.line +\n\t            (section.generatedOffset.generatedLine - 1),\n\t          column: generatedPosition.column +\n\t            (section.generatedOffset.generatedLine === generatedPosition.line\n\t             ? section.generatedOffset.generatedColumn - 1\n\t             : 0)\n\t        };\n\t        return ret;\n\t      }\n\t    }\n\t\n\t    return {\n\t      line: null,\n\t      column: null\n\t    };\n\t  };\n\t\n\t/**\n\t * Parse the mappings in a string in to a data structure which we can easily\n\t * query (the ordered arrays in the `this.__generatedMappings` and\n\t * `this.__originalMappings` properties).\n\t */\n\tIndexedSourceMapConsumer.prototype._parseMappings =\n\t  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {\n\t    this.__generatedMappings = [];\n\t    this.__originalMappings = [];\n\t    for (var i = 0; i < this._sections.length; i++) {\n\t      var section = this._sections[i];\n\t      var sectionMappings = section.consumer._generatedMappings;\n\t      for (var j = 0; j < sectionMappings.length; j++) {\n\t        var mapping = sectionMappings[j];\n\t\n\t        var source = section.consumer._sources.at(mapping.source);\n\t        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);\n\t        this._sources.add(source);\n\t        source = this._sources.indexOf(source);\n\t\n\t        var name = null;\n\t        if (mapping.name) {\n\t          name = section.consumer._names.at(mapping.name);\n\t          this._names.add(name);\n\t          name = this._names.indexOf(name);\n\t        }\n\t\n\t        // The mappings coming from the consumer for the section have\n\t        // generated positions relative to the start of the section, so we\n\t        // need to offset them to be relative to the start of the concatenated\n\t        // generated file.\n\t        var adjustedMapping = {\n\t          source: source,\n\t          generatedLine: mapping.generatedLine +\n\t            (section.generatedOffset.generatedLine - 1),\n\t          generatedColumn: mapping.generatedColumn +\n\t            (section.generatedOffset.generatedLine === mapping.generatedLine\n\t            ? section.generatedOffset.generatedColumn - 1\n\t            : 0),\n\t          originalLine: mapping.originalLine,\n\t          originalColumn: mapping.originalColumn,\n\t          name: name\n\t        };\n\t\n\t        this.__generatedMappings.push(adjustedMapping);\n\t        if (typeof adjustedMapping.originalLine === 'number') {\n\t          this.__originalMappings.push(adjustedMapping);\n\t        }\n\t      }\n\t    }\n\t\n\t    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);\n\t    quickSort(this.__originalMappings, util.compareByOriginalPositions);\n\t  };\n\t\n\texports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;\n\n\n/***/ }),\n/* 8 */\n/***/ (function(module, exports) {\n\n\t/* -*- Mode: js; js-indent-level: 2; -*- */\n\t/*\n\t * Copyright 2011 Mozilla Foundation and contributors\n\t * Licensed under the New BSD license. See LICENSE or:\n\t * http://opensource.org/licenses/BSD-3-Clause\n\t */\n\t\n\texports.GREATEST_LOWER_BOUND = 1;\n\texports.LEAST_UPPER_BOUND = 2;\n\t\n\t/**\n\t * Recursive implementation of binary search.\n\t *\n\t * @param aLow Indices here and lower do not contain the needle.\n\t * @param aHigh Indices here and higher do not contain the needle.\n\t * @param aNeedle The element being searched for.\n\t * @param aHaystack The non-empty array being searched.\n\t * @param aCompare Function which takes two elements and returns -1, 0, or 1.\n\t * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or\n\t *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the\n\t *     closest element that is smaller than or greater than the one we are\n\t *     searching for, respectively, if the exact element cannot be found.\n\t */\n\tfunction recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {\n\t  // This function terminates when one of the following is true:\n\t  //\n\t  //   1. We find the exact element we are looking for.\n\t  //\n\t  //   2. We did not find the exact element, but we can return the index of\n\t  //      the next-closest element.\n\t  //\n\t  //   3. We did not find the exact element, and there is no next-closest\n\t  //      element than the one we are searching for, so we return -1.\n\t  var mid = Math.floor((aHigh - aLow) / 2) + aLow;\n\t  var cmp = aCompare(aNeedle, aHaystack[mid], true);\n\t  if (cmp === 0) {\n\t    // Found the element we are looking for.\n\t    return mid;\n\t  }\n\t  else if (cmp > 0) {\n\t    // Our needle is greater than aHaystack[mid].\n\t    if (aHigh - mid > 1) {\n\t      // The element is in the upper half.\n\t      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);\n\t    }\n\t\n\t    // The exact needle element was not found in this haystack. Determine if\n\t    // we are in termination case (3) or (2) and return the appropriate thing.\n\t    if (aBias == exports.LEAST_UPPER_BOUND) {\n\t      return aHigh < aHaystack.length ? aHigh : -1;\n\t    } else {\n\t      return mid;\n\t    }\n\t  }\n\t  else {\n\t    // Our needle is less than aHaystack[mid].\n\t    if (mid - aLow > 1) {\n\t      // The element is in the lower half.\n\t      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);\n\t    }\n\t\n\t    // we are in termination case (3) or (2) and return the appropriate thing.\n\t    if (aBias == exports.LEAST_UPPER_BOUND) {\n\t      return mid;\n\t    } else {\n\t      return aLow < 0 ? -1 : aLow;\n\t    }\n\t  }\n\t}\n\t\n\t/**\n\t * This is an implementation of binary search which will always try and return\n\t * the index of the closest element if there is no exact hit. This is because\n\t * mappings between original and generated line/col pairs are single points,\n\t * and there is an implicit region between each of them, so a miss just means\n\t * that you aren't on the very start of a region.\n\t *\n\t * @param aNeedle The element you are looking for.\n\t * @param aHaystack The array that is being searched.\n\t * @param aCompare A function which takes the needle and an element in the\n\t *     array and returns -1, 0, or 1 depending on whether the needle is less\n\t *     than, equal to, or greater than the element, respectively.\n\t * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or\n\t *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the\n\t *     closest element that is smaller than or greater than the one we are\n\t *     searching for, respectively, if the exact element cannot be found.\n\t *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.\n\t */\n\texports.search = function search(aNeedle, aHaystack, aCompare, aBias) {\n\t  if (aHaystack.length === 0) {\n\t    return -1;\n\t  }\n\t\n\t  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,\n\t                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);\n\t  if (index < 0) {\n\t    return -1;\n\t  }\n\t\n\t  // We have found either the exact element, or the next-closest element than\n\t  // the one we are searching for. However, there may be more than one such\n\t  // element. Make sure we always return the smallest of these.\n\t  while (index - 1 >= 0) {\n\t    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {\n\t      break;\n\t    }\n\t    --index;\n\t  }\n\t\n\t  return index;\n\t};\n\n\n/***/ }),\n/* 9 */\n/***/ (function(module, exports) {\n\n\t/* -*- Mode: js; js-indent-level: 2; -*- */\n\t/*\n\t * Copyright 2011 Mozilla Foundation and contributors\n\t * Licensed under the New BSD license. See LICENSE or:\n\t * http://opensource.org/licenses/BSD-3-Clause\n\t */\n\t\n\t// It turns out that some (most?) Jional. The generated file this source map is associated with.\n\t *   - sections: A list of section definitions.\n\t *\n\t * Each value under the \"sections\" field has two fields:\n\t *   - offset: The offset into the original specified at which this section\n\t *       begins to apply, defined as an object with a \"line\" and \"column\"\n\t *       field.\n\t *   - map: A source map definition. This source map could also be indexed,\n\t *       but doesn't have to be.\n\t *\n\t * Instead of the \"map\" field, it's also possible to have a \"url\" field\n\t * specifying a URL to retrieve a source map from, but that's currently\n\t * unsupported.\n\t *\n\t * Here's an example source map, taken from the source map spec[0], but\n\t * modified to omit a section which uses the \"url\" field.\n\t *\n\t *  {\n\t *    version : 3,\n\t *    file: \"app.js\",\n\t *    sections: [{\n\t *      offset: {line:100, column:10},\n\t *      map: {\n\t *        version : 3,\n\t *        file: \"section.js\",\n\t *        sources: [\"foo.js\", \"bar.js\"],\n\t *        names: [\"src\", \"maps\", \"are\", \"fun\"],\n\t *        mappings: \"AAAA,E;;ABCDE;\"\n\t *      }\n\t *    }],\n\t *  }\n\t *\n\t * The second parameter, if given, is a string whose value is the URL\n\t * at which the source map was found.  This URL is used to compute the\n\t * sources array.\n\t *\n\t * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt\n\t */\n\tfunction IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {\n\t  var sourceMap = aSourceMap;\n\t  if (typeof aSourceMap === 'string') {\n\t    sourceMap = util.parseSourceMapInput(aSourceMap);\n\t  }\n\t\n\t  var version = util.getArg(sourceMap, 'version');\n\t  var sections = util.getArg(sourceMap, 'sections');\n\t\n\t  if (version != this._version) {\n\t    throw new Error('Unsupported version: ' + version);\n\t  }\n\t\n\t  this._sources = new ArraySet();\n\t  this._names = new ArraySet();\n\t\n\t  var lastOffset = {\n\t    line: -1,\n\t    column: 0\n\t  };\n\t  this._sections = sections.map(function (s) {\n\t    if (s.url) {\n\t      // The url field will require support for asynchronicity.\n\t      // See https://github.com/mozilla/source-map/issues/16\n\t      throw new Error('Support for url field in sections not implemented.');\n\t    }\n\t    var offset = util.getArg(s, 'offset');\n\t    var offsetLine = util.getArg(offset, 'line');\n\t    var offsetColumn = util.getArg(offset, 'column');\n\t\n\t    if (offsetLine < lastOffset.line ||\n\t        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {\n\t      throw new Error('Section offsets must be ordered and non-overlapping.');\n\t    }\n\t    lastOffset = offset;\n\t\n\t    return {\n\t      generatedOffset: {\n\t        // The offset fields are 0-based, but we use 1-based indices when\n\t        // encoding/decoding from VLQ.\n\t        generatedLine: offsetLine + 1,\n\t        generatedColumn: offsetColumn + 1\n\t      },\n\t      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)\n\t    }\n\t  });\n\t}\n\t\n\tIndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);\n\tIndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;\n\t\n\t/**\n\t * The version of the source mapping spec that we are consuming.\n\t */\n\tIndexedSourceMapConsumer.prototype._version = 3;\n\t\n\t/**\n\t * The list of original sources.\n\t */\n\tObject.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {\n\t  get: function () {\n\t    var sources = [];\n\t    for (var i = 0; i < this._sections.length; i++) {\n\t      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {\n\t        sources.push(this._sections[i].consumer.sources[j]);\n\t      }\n\t    }\n\t    return sources;\n\t  }\n\t});\n\t\n\t/**\n\t * Returns the original source, line, and column information for the generated\n\t * source's line and column positions provided. The only argument is an object\n\t * with the following properties:\n\t *\n\t *   - line: The line number in the generated source.  The line number\n\t *     is 1-based.\n\t *   - column: The column number in the generated source.  The column\n\t *     number is 0-based.\n\t *\n\t * and an object is returned with the following properties:\n\t *\n\t *   - source: The original source file, or null.\n\t *   - line: The line number in the original source, or null.  The\n\t *     line number is 1-based.\n\t *   - column: The column number in the original source, or null.  The\n\t *     column number is 0-based.\n\t *   - name: The original identifier, or null.\n\t */\n\tIndexedSourceMapConsumer.prototype.originalPositionFor =\n\t  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {\n\t    var needle = {\n\t      generatedLine: util.getArg(aArgs, 'line'),\n\t      generatedColumn: util.getArg(aArgs, 'column')\n\t    };\n\t\n\t    // Find the section containing the generated position we're trying to map\n\t    // to an original position.\n\t    var sectionIndex = binarySearch.search(needle, this._sections,\n\t      function(needle, section) {\n\t        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;\n\t        if (cmp) {\n\t          return cmp;\n\t        }\n\t\n\t        return (needle.generatedColumn -\n\t                section.generatedOffset.generatedColumn);\n\t      });\n\t    var section = this._sections[sectionIndex];\n\t\n\t    if (!section) {\n\t      return {\n\t        source: null,\n\t        line: null,\n\t        column: null,\n\t        name: null\n\t      };\n\t    }\n\t\n\t    return section.consumer.originalPositionFor({\n\t      line: needle.generatedLine -\n\t        (section.generatedOffset.generatedLine - 1),\n\t      column: needle.generatedColumn -\n\t        (section.generatedOffset.generatedLine === needle.generatedLine\n\t         ? section.generatedOffset.generatedColumn - 1\n\t         : 0),\n\t      bias: aArgs.bias\n\t    });\n\t  };\n\t\n\t/**\n\t * Return true if we have the source content for every source in the source\n\t * map, false otherwise.\n\t */\n\tIndexedSourceMapConsumer.prototype.hasContentsOfAllSources =\n\t  function IndexedSourceMapConsumer_hasContentsOfAllSources() {\n\t    return this._sections.every(function (s) {\n\t      return s.consumer.hasContentsOfAllSources();\n\t    });\n\t  };\n\t\n\t/**\n\t * Returns the original source content. The only argument is the url of the\n\t * original source file. Returns null if no original source content is\n\t * available.\n\t */\n\tIndexedSourceMapConsumer.prototype.sourceContentFor =\n\t  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {\n\t    for (var i = 0; i < this._sections.length; i++) {\n\t      var section = this._sections[i];\n\t\n\t      var content = section.consumer.sourceContentFor(aSource, true);\n\t      if (content) {\n\t        return content;\n\t      }\n\t    }\n\t    if (nullOnMissing) {\n\t      return null;\n\t    }\n\t    else {\n\t      throw new Error('\"' + aSource + '\" is not in the SourceMap.');\n\t    }\n\t  };\n\t\n\t/**\n\t * Returns the generated line and column information for the original source,\n\t * line, and column positions provided. The only argument is an object with\n\t * the following properties:\n\t *\n\t *   - source: The filename of the original source.\n\t *   - line: The line number in the original source.  The line number\n\t *     is 1-based.\n\t *   - column: The column number in the original source.  The column\n\t *     number is 0-based.\n\t *\n\t * and an object is returned with the following properties:\n\t *\n\t *   - line: The line number in the generated source, or null.  The\n\t *     line number is 1-based. \n\t *   - column: The column number in the generated source, or null.\n\t *     The column number is 0-based.\n\t */\n\tIndexedSourceMapConsumer.prototype.generatedPositionFor =\n\t  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {\n\t    for (var i = 0; i < this._sections.length; i++) {\n\t      var section = this._sections[i];\n\t\n\t      // Only consider this section if the requested source is in the list of\n\t      // sources of the consumer.\n\t      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {\n\t        continue;\n\t      }\n\t      var generatedPosition = section.consumer.generatedPositionFor(aArgs);\n\t      if (generatedPosition) {\n\t        var ret = {\n\t          line: generatedPosition.line +\n\t            (section.generatedOffset.generatedLine - 1),\n\t          column: generatedPosition.column +\n\t            (section.generatedOffset.generatedLine === generatedPosition.line\n\t             ? section.generatedOffset.generatedColumn - 1\n\t             : 0)\n\t        };\n\t        return ret;\n\t      }\n\t    }\n\t\n\t    return {\n\t      line: null,\n\t      column: null\n\t    };\n\t  };\n\t\n\t/**\n\t * Parse the mappings in a string in to a data structure which we can easily\n\t * query (the ordered arrays in the `this.__generatedMappings` and\n\t * `this.__originalMappings` properties).\n\t */\n\tIndexedSourceMapConsumer.prototype._parseMappings =\n\t  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {\n\t    this.__generatedMappings = [];\n\t    this.__originalMappings = [];\n\t    for (var i = 0; i < this._sections.length; i++) {\n\t      var section = this._sections[i];\n\t      var sectionMappings = section.consumer._generatedMappings;\n\t      for (var j = 0; j < sectionMappings.length; j++) {\n\t        var mapping = sectionMappings[j];\n\t\n\t        var source = section.consumer._sources.at(mapping.source);\n\t        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);\n\t        this._sources.add(source);\n\t        source = this._sources.indexOf(source);\n\t\n\t        var name = null;\n\t        if (mapping.name) {\n\t          name = section.consumer._names.at(mapping.name);\n\t          this._names.add(name);\n\t          name = this._names.indexOf(name);\n\t        }\n\t\n\t        // The mappings coming from the consumer for the section have\n\t        // generated positions relative to the start of the section, so we\n\t        // need to offset them to be relative to the start of the concatenated\n\t        // generated file.\n\t        var adjustedMapping = {\n\t          source: source,\n\t          generatedLine: mapping.generatedLine +\n\t            (section.generatedOffset.generatedLine - 1),\n\t          generatedColumn: mapping.generatedColumn +\n\t            (section.generatedOffset.generatedLine === mapping.generatedLine\n\t            ? section.generatedOffset.generatedColumn - 1\n\t            : 0),\n\t          originalLine: mapping.originalLine,\n\t          originalColumn: mapping.originalColumn,\n\t          name: name\n\t        };\n\t\n\t        this.__generatedMappings.push(adjustedMapping);\n\t        if (typeof adjustedMapping.originalLine === 'number') {\n\t          this.__originalMappings.push(adjustedMapping);\n\t        }\n\t      }\n\t    }\n\t\n\t    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);\n\t    quickSort(this.__originalMappings, util.compareByOriginalPositions);\n\t  };\n\t\n\texports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;\n\n\n/***/ }),\n/* 8 */\n/***/ (function(module, exports) {\n\n\t/* -*- Mode: js; js-indent-level: 2; -*- */\n\t/*\n\t * Copyright 2011 Mozilla Foundation and contributors\n\t * Licensed under the New BSD license. See LICENSE or:\n\t * http://opensource.org/licenses/BSD-3-Clause\n\t */\n\t\n\texports.GREATEST_LOWER_BOUND = 1;\n\texports.LEAST_UPPER_BOUND = 2;\n\t\n\t/**\n\t * Recursive implementation of binary search.\n\t *\n\t * @param aLow Indices here and lower do not contain the needle.\n\t * @param aHigh Indices here and higher do not contain the needle.\n\t * @param aNeedle The element being searched for.\n\t * @param aHaystack The non-empty array being searched.\n\t * @param aCompare Function which takes two elements and returns -1, 0, or 1.\n\t * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or\n\t *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the\n\t *     closest element that is smaller than or greater than the one we are\n\t *     searching for, respectively, if the exact element cannot be found.\n\t */\n\tfunction recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {\n\t  // This function terminates when one of the following is true:\n\t  //\n\t  //   1. We find the exact element we are looking for.\n\t  //\n\t  //   2. We did not find the exact element, but we can return the index of\n\t  //      the next-closest element.\n\t  //\n\t  //   3. We did not find the exact element, and there is no next-closest\n\t  //      element than the one we are searching for, so we return -1.\n\t  var mid = Math.floor((aHigh - aLow) / 2) + aLow;\n\t  var cmp = aCompare(aNeedle, aHaystack[mid], true);\n\t  if (cmp === 0) {\n\t    // Found the element we are looking for.\n\t    return mid;\n\t  }\n\t  else if (cmp > 0) {\n\t    // Our needle is greater than aHaystack[mid].\n\t    if (aHigh - mid > 1) {\n\t      // The element is in the upper half.\n\t      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);\n\t    }\n\t\n\t    // The exact needle element was not found in this haystack. Determine if\n\t    // we are in termination case (3) or (2) and return the appropriate thing.\n\t    if (aBias == exports.LEAST_UPPER_BOUND) {\n\t      return aHigh < aHaystack.length ? aHigh : -1;\n\t    } else {\n\t      return mid;\n\t    }\n\t  }\n\t  else {\n\t    // Our needle is less than aHaystack[mid].\n\t    if (mid - aLow > 1) {\n\t      // The element is in the lower half.\n\t      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);\n\t    }\n\t\n\t    // we are in termination case (3) or (2) and return the appropriate thing.\n\t    if (aBias == exports.LEAST_UPPER_BOUND) {\n\t      return mid;\n\t    } else {\n\t      return aLow < 0 ? -1 : aLow;\n\t    }\n\t  }\n\t}\n\t\n\t/**\n\t * This is an implementation of binary search which will always try and return\n\t * the index of the closest element if there is no exact hit. This is because\n\t * mappings between original and generated line/col pairs are single points,\n\t * and there is an implicit region between each of them, so a miss just means\n\t * that you aren't on the very start of a region.\n\t *\n\t * @param aNeedle The element you are looking for.\n\t * @param aHaystack The array that is being searched.\n\t * @param aCompare A function which takes the needle and an element in the\n\t *     array and returns -1, 0, or 1 depending on whether the needle is less\n\t *     than, equal to, or greater than the element, respectively.\n\t * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or\n\t *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the\n\t *     closest element that is smaller than or greater than the one we are\n\t *     searching for, respectively, if the exact element cannot be found.\n\t *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.\n\t */\n\texports.search = function search(aNeedle, aHaystack, aCompare, aBias) {\n\t  if (aHaystack.length === 0) {\n\t    return -1;\n\t  }\n\t\n\t  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,\n\t                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);\n\t  if (index < 0) {\n\t    return -1;\n\t  }\n\t\n\t  // We have found either the exact element, or the next-closest element than\n\t  // the one we are searching for. However, there may be more than one such\n\t  // element. Make sure we always return the smallest of these.\n\t  while (index - 1 >= 0) {\n\t    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {\n\t      break;\n\t    }\n\t    --index;\n\t  }\n\t\n\t  return index;\n\t};\n\n\n/***/ }),\n/* 9 */\n/***/ (function(module, exports) {\n\n\t/* -*- Mode: js; js-indent-level: 2; -*- */\n\t/*\n\t * Copyright 2011 Mozilla Foundation and contributors\n\t * Licensed under the New BSD license. See LICENSE or:\n\t * http://opensource.org/licenses/BSD-3-Clause\n\t */\n\t\n\t// It turns out that some (most?) J
    descr: descr
  };
  return node;
}
export function moduleExportDescr(exportType, id) {
  var node = {
    type: "ModuleExportDescr",
    exportType: exportType,
    id: id
  };
  return node;
}
export function moduleExport(name, descr) {
  if (!(typeof name === "string")) {
    throw new Error('typeof name === "string"' + " error: " + ("Argument name must be of type string, given: " + _typeof(name) || "unknown"));
  }

  var node = {
    type: "ModuleExport",
    name: name,
    descr: descr
  };
  return node;
}
export function limit(min, max, shared) {
  if (!(typeof min === "number")) {
    throw new Error('typeof min === "number"' + " error: " + ("Argument min must be of type number, given: " + _typeof(min) || "unknown"));
  }

  if (max !== null && max !== undefined) {
    if (!(typeof max === "number")) {
      throw new Error('typeof max === "number"' + " error: " + ("Argument max must be of type number, given: " + _typeof(max) || "unknown"));
    }
  }

  if (shared !== null && shared !== undefined) {
    if (!(typeof shared === "boolean")) {
      throw new Error('typeof shared === "boolean"' + " error: " + ("Argument shared must be of type boolean, given: " + _typeof(shared) || "unknown"));
    }
  }

  var node = {
    type: "Limit",
    min: min
  };

  if (typeof max !== "undefined") {
    node.max = max;
  }

  if (shared === true) {
    node.shared = true;
  }

  return node;
}
export function signature(params, results) {
  if (!(_typeof(params) === "object" && typeof params.length !== "undefined")) {
    throw new Error('typeof params === "object" && typeof params.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  if (!(_typeof(results) === "object" && typeof results.length !== "undefined")) {
    throw new Error('typeof results === "object" && typeof results.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "Signature",
    params: params,
    results: results
  };
  return node;
}
export function program(body) {
  if (!(_typeof(body) === "object" && typeof body.length !== "undefined")) {
    throw new Error('typeof body === "object" && typeof body.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "Program",
    body: body
  };
  return node;
}
export function identifier(value, raw) {
  if (!(typeof value === "string")) {
    throw new Error('typeof value === "string"' + " error: " + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
  }

  if (raw !== null && raw !== undefined) {
    if (!(typeof raw === "string")) {
      throw new Error('typeof raw === "string"' + " error: " + ("Argument raw must be of type string, given: " + _typeof(raw) || "unknown"));
    }
  }

  var node = {
    type: "Identifier",
    value: value
  };

  if (typeof raw !== "undefined") {
    node.raw = raw;
  }

  return node;
}
export function blockInstruction(label, instr, result) {
  if (!(_typeof(instr) === "object" && typeof instr.length !== "undefined")) {
    throw new Error('typeof instr === "object" && typeof instr.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "BlockInstruction",
    id: "block",
    label: label,
    instr: instr,
    result: result
  };
  return node;
}
export function callInstruction(index, instrArgs, numeric) {
  if (instrArgs !== null && instrArgs !== undefined) {
    if (!(_typeof(instrArgs) === "object" && typeof instrArgs.length !== "undefined")) {
      throw new Error('typeof instrArgs === "object" && typeof instrArgs.length !== "undefined"' + " error: " + (undefined || "unknown"));
    }
  }

  var node = {
    type: "CallInstruction",
    id: "call",
    index: index
  };

  if (typeof instrArgs !== "undefined" && instrArgs.length > 0) {
    node.instrArgs = instrArgs;
  }

  if (typeof numeric !== "undefined") {
    node.numeric = numeric;
  }

  return node;
}
export function callIndirectInstruction(signature, intrs) {
  if (intrs !== null && intrs !== undefined) {
    if (!(_typeof(intrs) === "object" && typeof intrs.length !== "undefined")) {
      throw new Error('typeof intrs === "object" && typeof intrs.length !== "undefined"' + " error: " + (undefined || "unknown"));
    }
  }

  var node = {
    type: "CallIndirectInstruction",
    id: "call_indirect",
    signature: signature
  };

  if (typeof intrs !== "undefined" && intrs.length > 0) {
    node.intrs = intrs;
  }

  return node;
}
export function byteArray(values) {
  if (!(_typeof(values) === "object" && typeof values.length !== "undefined")) {
    throw new Error('typeof values === "object" && typeof values.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "ByteArray",
    values: values
  };
  return node;
}
export function func(name, signature, body, isExternal, metadata) {
  if (!(_typeof(body) === "object" && typeof body.length !== "undefined")) {
    throw new Error('typeof body === "object" && typeof body.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  if (isExternal !== null && isExternal !== undefined) {
    if (!(typeof isExternal === "boolean")) {
      throw new Error('typeof isExternal === "boolean"' + " error: " + ("Argument isExternal must be of type boolean, given: " + _typeof(isExternal) || "unknown"));
    }
  }

  var node = {
    type: "Func",
    name: name,
    signature: signature,
    body: body
  };

  if (isExternal === true) {
    node.isExternal = true;
  }

  if (typeof metadata !== "undefined") {
    node.metadata = metadata;
  }

  return node;
}
export function internalBrUnless(target) {
  if (!(typeof target === "number")) {
    throw new Error('typeof target === "number"' + " error: " + ("Argument target must be of type number, given: " + _typeof(target) || "unknown"));
  }

  var node = {
    type: "InternalBrUnless",
    target: target
  };
  return node;
}
export function internalGoto(target) {
  if (!(typeof target === "number")) {
    throw new Error('typeof target === "number"' + " error: " + ("Argument target must be of type number, given: " + _typeof(target) || "unknown"));
  }

  var node = {
    type: "InternalGoto",
    target: target
  };
  return node;
}
export function internalCallExtern(target) {
  if (!(typeof target === "number")) {
    throw new Error('typeof target === "number"' + " error: " + ("Argument target must be of type number, given: " + _typeof(target) || "unknown"));
  }

  var node = {
    type: "InternalCallExtern",
    target: target
  };
  return node;
}
export function internalEndAndReturn() {
  var node = {
    type: "InternalEndAndReturn"
  };
  return node;
}
export var isModule = isTypeOf("Module");
export var isModuleMetadata = isTypeOf("ModuleMetadata");
export var isModuleNameMetadata = isTypeOf("ModuleNameMetadata");
export var isFunctionNameMetadata = isTypeOf("FunctionNameMetadata");
export var isLocalNameMetadata = isTypeOf("LocalNameMetadata");
export var isBinaryModule = isTypeOf("BinaryModule");
export var isQuoteModule = isTypeOf("QuoteModule");
export var isSectionMetadata = isTypeOf("SectionMetadata");
export var isProducersSectionMetadata = isTypeOf("ProducersSectionMetadata");
export var isProducerMetadata = isTypeOf("ProducerMetadata");
export var isProducerMetadataVersionedName = isTypeOf("ProducerMetadataVersionedName");
export var isLoopInstruction = isTypeOf("LoopInstruction");
export var isInstr = isTypeOf("Instr");
export var isIfInstruction = isTypeOf("IfInstruction");
export var isStringLiteral = isTypeOf("StringLiteral");
export var isNumberLiteral = isTypeOf("NumberLiteral");
export var isLongNumberLiteral = isTypeOf("LongNumberLiteral");
export var isFloatLiteral = isTypeOf("FloatLiteral");
export var isElem = isTypeOf("Elem");
export var isIndexInFuncSection = isTypeOf("IndexInFuncSection");
export var isValtypeLiteral = isTypeOf("ValtypeLiteral");
export var isTypeInstruction = isTypeOf("TypeInstruction");
export var isStart = isTypeOf("Start");
export var isGlobalType = isTypeOf("GlobalType");
export var isLeadingComment = isTypeOf("LeadingComment");
export var isBlockComment = isTypeOf("BlockComment");
export var isData = isTypeOf("Data");
export var isGlobal = isTypeOf("Global");
export var isTable = isTypeOf("Table");
export var isMemory = isTypeOf("Memory");
export var isFuncImportDescr = isTypeOf("FuncImportDescr");
export var isModuleImport = isTypeOf("ModuleImport");
export var isModuleExportDescr = isTypeOf("ModuleExportDescr");
export var isModuleExport = isTypeOf("ModuleExport");
export var isLimit = isTypeOf("Limit");
export var isSignature = isTypeOf("Signature");
export var isProgram = isTypeOf("Program");
export var isIdentifier = isTypeOf("Identifier");
export var isBlockInstruction = isTypeOf("BlockInstruction");
export var isCallInstruction = isTypeOf("CallInstruction");
export var isCallIndirectInstruction = isTypeOf("CallIndirectInstruction");
export var isByteArray = isTypeOf("ByteArray");
export var isFunc = isTypeOf("Func");
export var isInternalBrUnless = isTypeOf("InternalBrUnless");
export var isInternalGoto = isTypeOf("InternalGoto");
export var isInternalCallExtern = isTypeOf("InternalCallExtern");
export var isInternalEndAndReturn = isTypeOf("InternalEndAndReturn");
export var isNode = function isNode(node) {
  return isModule(node) || isModuleMetadata(node) || isModuleNameMetadata(node) || isFunctionNameMetadata(node) || isLocalNameMetadata(node) || isBinaryModule(node) || isQuoteModule(node) || isSectionMetadata(node) || isProducersSectionMetadata(node) || isProducerMetadata(node) || isProducerMetadataVersionedName(node) || isLoopInstruction(node) || isInstr(node) || isIfInstruction(node) || isStringLiteral(node) || isNumberLiteral(node) || isLongNumberLiteral(node) || isFloatLiteral(node) || isElem(node) || isIndexInFuncSection(node) || isValtypeLiteral(node) || isTypeInstruction(node) || isStart(node) || isGlobalType(node) || isLeadingComment(node) || isBlockComment(node) || isData(node) || isGlobal(node) || isTable(node) || isMemory(node) || isFuncImportDescr(node) || isModuleImport(node) || isModuleExportDescr(node) || isModuleExport(node) || isLimit(node) || isSignature(node) || isProgram(node) || isIdentifier(node) || isBlockInstruction(node) || isCallInstruction(node) || isCallIndirectInstruction(node) || isByteArray(node) || isFunc(node) || isInternalBrUnless(node) || isInternalGoto(node) || isInternalCallExtern(node) || isInternalEndAndReturn(node);
};
export var isBlock = function isBlock(node) {
  return isLoopInstruction(node) || isBlockInstruction(node) || isFunc(node);
};
export var isInstruction = function isInstruction(node) {
  return isLoopInstruction(node) || isInstr(node) || isIfInstruction(node) || isTypeInstruction(node) || isBlockInstruction(node) || isCallInstruction(node) || isCallIndirectInstruction(node);
};
export var isExpression = function isExpression(node) {
  return isInstr(node) || isStringLiteral(node) || isNumberLiteral(node) || isLongNumberLiteral(node) || isFloatLiteral(node) || isValtypeLiteral(node) || isIdentifier(node);
};
export var isNumericLiteral = function isNumericLiteral(node) {
  return isNumberLiteral(node) || isLongNumberLiteral(node) || isFloatLiteral(node);
};
export var isImportDescr = function isImportDescr(node) {
  return isGlobalType(node) || isTable(node) || isMemory(node) || isFuncImportDescr(node);
};
export var isIntrinsic = function isIntrinsic(node) {
  return isInternalBrUnless(node) || isInternalGoto(node) || isInternalCallExtern(node) || isInternalEndAndReturn(node);
};
export var assertModule = assertTypeOf("Module");
export var assertModuleMetadata = assertTypeOf("ModuleMetadata");
export var assertModuleNameMetadata = assertTypeOf("ModuleNameMetadata");
export var assertFunctionNameMetadata = assertTypeOf("FunctionNameMetadata");
export var assertLocalNameMetadata = assertTypeOf("LocalNameMetadata");
export var assertBinaryModule = assertTypeOf("BinaryModule");
export var assertQuoteModule = assertTypeOf("QuoteModule");
export var assertSectionMetadata = assertTypeOf("SectionMetadata");
export var assertProducersSectionMetadata = assertTypeOf("ProducersSectionMetadata");
export var assertProducerMetadata = assertTypeOf("ProducerMetadata");
export var assertProducerMetadataVersionedName = assertTypeOf("ProducerMetadataVersionedName");
export var assertLoopInstruction = assertTypeOf("LoopInstruction");
export var assertInstr = assertTypeOf("Instr");
export var assertIfInstruction = assertTypeOf("IfInstruction");
export var assertStringLiteral = assertTypeOf("StringLiteral");
export var assertNumberLiteral = assertTypeOf("NumberLiteral");
export var assertLongNumberLiteral = assertTypeOf("LongNumberLiteral");
export var assertFloatLiteral = assertTypeOf("FloatLiteral");
export var assertElem = assertTypeOf("Elem");
export var assertIndexInFuncSection = assertTypeOf("IndexInFuncSection");
export var assertValtypeLiteral = assertTypeOf("ValtypeLiteral");
export var assertTypeInstruction = assertTypeOf("TypeInstruction");
export var assertStart = assertTypeOf("Start");
export var assertGlobalType = assertTypeOf("GlobalType");
export var assertLeadingComment = assertTypeOf("LeadingComment");
export var assertBlockComment = assertTypeOf("BlockComment");
export var assertData = assertTypeOf("Data");
export var assertGlobal = assertTypeOf("Global");
export var assertTable = assertTypeOf("Table");
export var assertMemory = assertTypeOf("Memory");
export var assertFuncImportDescr = assertTypeOf("FuncImportDescr");
export var assertModuleImport = assertTypeOf("ModuleImport");
export var assertModuleExportDescr = assertTypeOf("ModuleExportDescr");
export var assertModuleExport = assertTypeOf("ModuleExport");
export var assertLimit = assertTypeOf("Limit");
export var assertSignature = assertTypeOf("Signature");
export var assertProgram = assertTypeOf("Program");
export var assertIdentifier = assertTypeOf("Identifier");
export var assertBlockInstruction = assertTypeOf("BlockInstruction");
export var assertCallInstruction = assertTypeOf("CallInstruction");
export var assertCallIndirectInstruction = assertTypeOf("CallIndirectInstruction");
export var assertByteArray = assertTypeOf("ByteArray");
export var assertFunc = assertTypeOf("Func");
export var assertInternalBrUnless = assertTypeOf("InternalBrUnless");
export var assertInternalGoto = assertTypeOf("InternalGoto");
export var assertInternalCallExtern = assertTypeOf("InternalCallExtern");
export var assertInternalEndAndReturn = assertTypeOf("InternalEndAndReturn");
export var unionTypesMap = {
  Module: ["Node"],
  ModuleMetadata: ["Node"],
  ModuleNameMetadata: ["Node"],
  FunctionNameMetadata: ["Node"],
  LocalNameMetadata: ["Node"],
  BinaryModule: ["Node"],
  QuoteModule: ["Node"],
  SectionMetadata: ["Node"],
  ProducersSectionMetadata: ["Node"],
  ProducerMetadata: ["Node"],
  ProducerMetadataVersionedName: ["Node"],
  LoopInstruction: ["Node", "Block", "Instruction"],
  Instr: ["Node", "Expression", "Instruction"],
  IfInstruction: ["Node", "Instruction"],
  StringLiteral: ["Node", "Expression"],
  NumberLiteral: ["Node", "NumericLiteral", "Expression"],
  LongNumberLiteral: ["Node", "NumericLiteral", "Expression"],
  FloatLiteral: ["Node", "NumericLiteral", "Expression"],
  Elem: ["Node"],
  IndexInFuncSection: ["Node"],
  ValtypeLiteral: ["Node", "Expression"],
  TypeInstruction: ["Node", "Instruction"],
  Start: ["Node"],
  GlobalType: ["Node", "ImportDescr"],
  LeadingComment: ["Node"],
  BlockComment: ["Node"],
  Data: ["Node"],
  Global: ["Node"],
  Table: ["Node", "ImportDescr"],
  Memory: ["Node", "ImportDescr"],
  FuncImportDescr: ["Node", "ImportDescr"],
  ModuleImport: ["Node"],
  ModuleExportDescr: ["Node"],
  ModuleExport: ["Node"],
  Limit: ["Node"],
  Signature: ["Node"],
  Program: ["Node"],
  Identifier: ["Node", "Expression"],
  BlockInstruction: ["Node", "Block", "Instruction"],
  CallInstruction: ["Node", "Instruction"],
  CallIndirectInstruction: ["Node", "Instruction"],
  ByteArray: ["Node"],
  Func: ["Node", "Block"],
  InternalBrUnless: ["Node", "Intrinsic"],
  InternalGoto: ["Node", "Intrinsic"],
  InternalCallExtern: ["Node", "Intrinsic"],
  InternalEndAndReturn: ["Node", "Intrinsic"]
};
export var nodeAndUnionTypes = ["Module", "ModuleMeta/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Config } from '@jest/types';
import { ValidationError } from 'jest-validate';
/**
 * Reporter Validation Error is thrown if the given arguments
 * within the reporter are not valid.
 *
 * This is a highly specific reporter error and in the future will be
 * merged with jest-validate. Till then, we can make use of it. It works
 * and that's what counts most at this time.
 */
export declare function createReporterError(reporterIndex: number, reporterValue: Array<Config.ReporterConfig> | string): ValidationError;
export declare function createArrayReporterError(arrayReporter: Config.ReporterConfig, reporterIndex: number, valueIndex: number, value: string | Record<string, unknown>, expectedType: string, valueName: string): ValidationError;
export declare function validateReporters(reporterConfig: Array<Config.ReporterConfig | string>): boolean;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           r���u�cQ(R���Y�R�i�hzy����*�ါ���kt��ȅJ8?}C�n��\	M�F�TB>���#���|� h�oZ�#�����	m�y&���3��SUN��F��dE�K;�*�q�D�(�7
u{����֯Í�6�j�{M\KYm�F�����b���0t�Z�-;U};"��p��u)���������XX�X�{�mV���m����%I��T*J	�`��cor�
f��aSH�i�]$����:�%�mrI��6*{�E�mIr�U������f�`Q�Z��+�W�Σ��-�Q{��-M��O5<�SW�;8�f:�x�
q�
���?<�o>��x�9�J��-�ݐd��03���8�}ݷ��e-%�����j9�Ԥm���$��G~�5��j_�#��h�Ȋ#Ě��w��~{U�����o��b�J�<�^2z��{
�Y��%Dd��H�7��nͺ�*�	�tq�7�1�7HY��|j�&oju.��5�7���O�n(P� G�Ԃ���M=��T�����,�3��I� {�]˸��h�u*ѣt�)�u���A|E�5+�&ݎ���֪uV!Z���� ȠS����]z�t���f���O��,�/�2�g��o���5n��dbH9�W�ά�y�v�u�0 �z�vo�����[�]��^B�\� �կ��2R�4���U�s���?^��QϨ{�&wpi�㊎�t�ږ�}��}�]7�9�����GTR�V�>�:�7Uk�~oˆչ�%
�^	
��y�ւ�\)s���6:J��=G��O�FKp�9�5��6L	='�y��rd(=��ƻa�c�3�:��1#�K`:���������u�؍]8������K<� �{p5�c��	���Qh
б _�۷����O47J�㤖O'�%�jy�u�\`�rsϾ��oS�t����"��8<�I:�,?7?>�]|x���)>���y�t��ӏ.F��Rʋ�:��`s��O�O&莞�O�~\�4,�t��QU�������k�eU�k�-/����EJ�a	t2s�<g�=�7�jM�7u��t��h�Q�0���
�i��㈅apy%]H w�>J_&���]��ʻ��T��)"��/���cE���=Dw�PGc���St�{�����h��`��?(o)�;�#���i�6�մ4��m�$1N��*� ������B�{����{%���E���U2O�h�?� g�<g��KeZt]'������M���8�Mv�Q,I��1-v �5AR���O QUӓ�t��K:N���/R1��O#��c<�WMy�Q��ɺa���\�GR3U<� ����$g<��j�}�{��n����)��Qʉ
=9��b��Wc]M��6��<֦Z8��Iȏ��G����[-ˢDn�=�Q���%�ʔ3�L=0A29	�H#9��gx9]rڒ�&�NҰ��'+F�c�]Aw ���} �V���<�cr����t#�q�̑�}Y�c��L-�1n䢭�����Z�R�K��\�9�H8�0p>5�S��Ь���ԛV-�V�wAs��E�IZ_��%�e�^G�����r��$x��D�	'�W�~5%�7��Sݮ���&z��:Þ�����5���I[v�Co�d��U��V)��GZ� 3��=9�<q����������[����b�o-�>^=�����N麉hk��p��%)�� �@°l�:���m�
K�W�XV)�v��.>On��]�Դ���*��@� <�|�9�7W,���+������z]a�nJ�U���SP�$��_�=^�9���;GdKe�^E%m$�������2��3e��~��6����ߨn;��[j��qSCp�SDbID��ԨR�/�3� ��Ȥ��K�֒��Nv���(��(Uf �*s��O�����A�

���ٷ9i⧚;�]�ji)%)萶��:2��rt�ձ7=rU��$	*֖z��<�/�=@���q���p��&������CR�7�LJ�Br�1'#>���֣i�ٸWW�R�\Z�re�?����Y�d��S-|�2ȹb�
O c�t*Ӷ���=��tP����:ib��h��Fc��u;�yl�2uZSo�˕]5��`�s�ڠF��=GR�3'>���_��/��씢M|-��<=�O������s�d���X��J�O>܏��;[inW�]w�U��:��:D���J�ud�G�A'T\�!xe��q���]�j�8*(�
p�����{��ܗ����QKZ�%Z?��:������+�1�3�j5���I(���ݹ'�[�).�RY).C��@�0��(�*s�s���a����mi��U[��+&#rӶ{�1E8�;��Υ0mM�g��^�.��T}]�2���WPD �?|��}���Z���p�%e���?W-8ly���?b;룣X���r�C�Oo�榱ܯ�E�BJ�����NB������e�p-
�I8���6$� ?7F���q�nI���C%4IB1��`ߐ��P1�N�o*:]�x���w6����j��WK���$�������#x��l�o
�Y�ґ��?' }�b�w<��C���?2٨m�����o��Hl���ZZN�������A�<B�Ow
�.���������N46$��@�#K�7��K $�B�OA�c��m�w���k�UQ�����ʀ�N��c��t��P=T��,5S�R�qp::}Y�����5�h����*f����T��䌅���㶔��3��-(���H��j�������^^���=� cX/��-�L]�����@#�NNT�ݗ�M�¯�s�VZ�-u�mVGU_ ���0�i�uu�NGN9��qK|Jd�يRִROMR�z�Ƨ(�x^9������z+�%Ժ]�I$4E:���ʁ��#��s����`g�.�I��Ry��:��u+`1�9�Iإ�
]O9�?�����$�t�ގ�EO�Zz��?o,�e$v=�5F\����
�J�馤F��T� �PpF5�:�ˉ Q�y9��ΕUtb�r��UZPĴ���#�G9�RPV,P
:����@��y%����k�j�[u6��_�[v���$򉤷�L�u`9����x��ve���[%l�C-E�`zv+��Ō��#���%��}�ʿxm:�m~�Ĵ Ӫ��z���:��	����E,Q��y~k,B.��A�'���Φ7�]��w�s�%�$�%'����E����U�p�TGꚞ��L�E�����H��4���
���F"�^�'�=>Q����
�6)�kK��`����j�=5��s����FOR��+]��5G�K5����!�U��g\�y���C�v�=T������
�y����Y:�F��� ���F3ٴN�����'���h(�z�H�HW
1��d��8��}�&��mIy���Sr��MJj�a���Z�&�H|��/,2xζ��A:VU,��h�I5���8�@�uU�8�p4����������Uq��CGP�4�EQ+�s�ề�Δ��nVY��M��N�4�Z����ヌ��3�4uk�4uH�RM��R�\veV��.���Yk/0�-i��S��(|�����e�m�켶����8����#%����� 3) 	�0���ƫ��z;��9V�D�oJD"bzzLX�
��+�;�qi���k���Im��ܪ)��J�͒����Ap��c#8�ℴ���6B��횗��������дRG���s�p~@��:�[|=�VG=�s��KYZ��U؉�t�$�� ���5�� �Ÿ6�ݺӽZ��
Jx$��Y>�$~on�qƝ�n���x��KQ�N���T�y,��H�빦��r�M5͒�v��n�
�iR^����Y��O'$�rp;��ZҬ
%i�EH��3�O��Յ����������ҵ�9��D��8#<mW�tn��zW�r�3��� \j����b\��$�д놉�.�����;��ؒ��ˤ��l� �|�m��Q� H[����羈B�D�>��VWWB�|���1�\Hi����؍>��E
�'�����5� ��K�#� c�'��?orҢ��G�r8�5z@�4Z.K�
������M�_f��5�ýt���T�r}��$k�<$�0΍���dlt�#
��颶�Ok�RIT���Y�^����fr�{���'h�w��ߋ��U�'��nZ�f�xz)����h�dp��3:�Qܜ}Ρ��䩹�ᘕ���@�>�Q�m�����u�ߪ^�v��dj�2U>�Z����:a25a$��\��?����Q�e��Lګ��-] �;*�w�'�!�'�dh��{�s��b��G$;�?[C趝� |V�HM�T���C!x �b0xBG����I�-"Kܩ�KK9Y�� ��ă�n0s�Fڱ3�9p-)r���{��J�n&9%��$�$$L��>�A g�:]!E���p����KL�����$�B� �mhJ����]ի66РY]D�����1KGJ���A���	�o��aF �鮅�m<f�h�Y*�O����P�8��s��Q�wγd5b�(9GH�Fxտ�m�}��ǈ~*ìP٭��j	�J����� ��j���8��*��]�n �����&���exWL:ħm�z�n�u9h�ǱH۟��Y�7fOj��]@�T"1�q����p8=���/DaA�������ɍ%H˼i�f�=������F���y�'M����b���R�d�4/�x'�:JWf8� ����
�)�-�l=�#�]�������Y}+KIMUT��Q3��Y�VW�X�	�D�ƹ��ҥ3D�Y��Q��Ց�푮��ge�/w]�t�;��e>��	\5}�G��G,F<�PIf?嫽zV_�jb��T0@00 ��u�$qwI�9�t=<�[߫� ����S��rǞ���4�2�s�d�Rj(VZ`'B�̤�}t1�v/�� rAq���;BΓ���JIJ�p��=^� |� �J�2�K�p}� ��q�E[���$S4�y�eA#��:؀��c �����+���@����� aP������~گ��	Nô�]VZ�꣐A?���AU�y�Ԑr�g9�8J�r�����r���ʺ��4©0��[hD��!ʴJ�IҊ��2����
s��q�\P�!u�����:,$�jH��~�`�� -S8��Kp���z�uc#�� �;��O��r��g8�G���ae��z���^��H��R?H=G�j�HUiRx�zޜT�V?Ptή�����\)��!H\��m���>���_r9�P��tJ;=l��j:��HI"W�@Dm��X�s��n�r�o[��n
AL��>46��UDL�P�Fr�eaԜ�Ι��P��$��,W��~� m2mLVHLe�uv$2�릏"��),�G9��:Ms��aԯI �o�~t���ȍ�zXT�OƇ!�UQ�ަ8����@�F������#MRF�����Q�$�q��+Vz��E*�?1�˃�J���D�)�% u��-�g�m�E�T44�I�4��#䯱Κ���Fnŀ�|�H�\�͌t����:Q�<`"1,9|pt���رJū+��r<��PCΈ��f�?��=J2I��K��,kQr����w��gU��ܐ>2t���M��ջ;o��h��w������@"�Dh�"�OV����W�Q5%���N�19��.q��� �����[���Hv劍�t��%EDx��3�d�~ �Mu޾Ud�
Zz���CL]a�v�18l��\���l��S+�y*�0�IϾtN.��
%+����\�i�O�������Ǥ
ʿ�ݲ���IY��U-<�0��*��pF;sU�{]�d�����v1O�|Μ_�E^�zy�6�%���$�Q�;MՃ��q�0�:�$%�V�PڣGql��4�ѩ�?�QO]��QWKE-
"�qN��R���`�� s������ڗ��d���m�� QKr�B�V.UR��N��PX��_8�ث����S����W/�.x��7,l��5%��L��4=P���~NIc� �Q8�}gϧ�σ�юqn��?���v�O��W;�L0��IQ�H��*�u�2�H ��T�ں�����Zi��; =�8ԃ�
V�k��B\��L`a��cξ����(R]�<7ٖ�
��cY�߅�F�{rQ�[.�;�q�	!l�=x#��Սo����r�`t�����^ne�:z� Eb��'�b �N~�5b�����������v�F���R�x��� �Ƽ����r�e�d�)f�**$QK2��q�*��8� :C���6���j�}	������#"!� %�=L���*=���"
r�N%�#�
IGu�
:�>�U�[2w��#�U���-�k�����K8)�� @��`���v��
�H\�G�J�A�QgjC�<�*�����(@�5�c
�K6?Lp?}_h��ԑ��J;�������>#B�OO��O����K���X��d�v�-���O��3zOO ������]l���)Q#V�,`�� ��_��>g��9�W=�����<o?�)��bc -B� ���Γ� g
�
Z7��'�-`�/�����KI(���aeweF6�����R���qm�'�[��%rXg<jޓmS�B2qՌ� ml�\4e�$��= �l{��xK^V�w����*S8�Q�?��˷d�u�z����0=��l���P�s��֍���;h�#gK�4+\@۳�x�B}�{�˷��G��V���s�c��?G�y��Ym���c���G���t{Lu4ʜm�í�_`F;��֍bT*�J���PO��������G�s�'���[k�$�jTr�q���'r*���GSF��Wy�8?8ֆ�"(�������Zm�Y%�<���+�Fx���=��i�X�ȸ�/Q�㎑�:6�r*�c�¨�I� �5�۬]B�y�u� m[	��1 �Yp/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { AggregatedResult } from '@jest/test-result';
import type { Config } from '@jest/types';
import BaseReporter from './BaseReporter';
import type { Context, TestSchedulerContext } from './types';
export default class NotifyReporter extends BaseReporter {
    private _notifier;
    private _startRun;
    private _globalConfig;
    private _context;
    static readonly filename: string;
    constructor(globalConfig: Config.GlobalConfig, startRun: (globalConfig: Config.GlobalConfig) => unknown, context: TestSchedulerContext);
    onRunComplete(contexts: Set<Context>, result: AggregatedResult): void;
}
                                                                                                                                                                                                     �����=�*��Su^6me
�t���#R��ܚ>����&A��%XrpF��~X�����<G���4��%WY��*LEy�<��a��m�pȇ��Cv��Z�H��0Q��O�s��So �E�c�Z�žX<��hLd;�\�?(�g��Qs��m�i-�m:�5Th�U�m"�)<.c�\`g$�S�[��w���Qy�W%��m��)Gm�a�$�K��,@����S���_f������������_�5#GB.]
�j���ۙ��%��*�79�����M�F����5>"�T�Z>�y�ֈ)?Ȕ�4ܗk߆���6����qD��b����3�W��Hӭ�s�����l"TYc�Z��E ���Gpߗ�9�Ê���߶Ćz�_G�1��O�29�h�����,�]�$����QUQO\��A�<�ON8^~t��=�P���pm�n
��:�u��ۺ�B��pYW�`Wi�|D�{Í��5�MS@R�����������:-g����_YQqN���zJ(`F=c c߾��oq��bu
ԙ�(S�r��B�$)'�%��s�k`��k
��So�]+���b�"K��=�/��2���tہkڦTn��wC�#����zhN������L`!CŌ�������*�
��[
����w�'���-54���Ӿ�RF�L1KOo����Ө{�?}�3��o�Tv�� �[�J��$�%�]j���S�[�t'N��<�Tt�#NL#�q����7KW\m���վG�B��馍��?���?<�|I&�ܨh��m����5��dln�=^�r}��gۼf�VtO�w��
,��hzR�l���2I$�3�����C}Gi��b��$�v���TMЮZ���e�r�x�l��
Q8kn�M��܃kn
�F���x���O�����;�}Y.�p�[�6�
��*>���a�{F�G�=��Z���x�-;:����i'���W��7ӏ���frpA=2*��r@ ���K����tQ�*?,uU���V�Tʴ��p&�4�
��P	.A=�:�-��|o�\n��|Ul]$s��p|��9`	 āߝL�/�9�o�I�^�1�@������5n��Br�ĉ��cӎ@9:�O$�z7vΐ�������*w��j�Ί��o�:��1!���rFy����/Vm��]���(�����ޙz��c�	�F`:y<OmU�!���{���m��mt#�UV��ƭ�!:�P�zr8�ᨮ{�kۭuhb�8QϘ�THzAc�G,@�ꕏO��cB\"���Bo� �2���&膦*h�i�ۥK@�zT��Nu�p���۰���L���?��~F8��E����}�G�V�4��%&@;�����q��w�ƚ������i����`��#��8#���%�0�Q�Wh�P�+�ޞ���QE�UR�s�%�L)����Wo���o<7��>㠯��SU�<�Ԫ�G�%�u`� ��5k}l�%��RP��<��<��88q�o���
��\�����穘zA:Z��)�H�-�����P��5掰E�Q2�#U�.#
	>�J��;����;}nֱY�46�2��Y�J�$b<8 ��d�9�1�:����`[�ӭ��hO���h��Rz@c��[?c�o�o��k+b������pD@e*�I�ߤu��T��x0��ػw�M����j��*�d3}L�O2ƫ�$u͞5�񳸮ۦ� ��kAf�Q�a�Y�j�P�����N;`uq�T���۷ʅ�u��t6�u2�βG-+�R:�� =D1���Ƃ�ﻎ�A%��衁�s��`Wbq߱Տ4ꊞ�zGZ�_�:��7=Ჶ$0Mm���m�:�E[@�T��=M�@�(<T�nj*i7��>���Ĕ�5��C&N�L`�#���
FNs�E6ufᆊ�Qh�[jV؞c�֙e��T�(ĳ��zOmZ��D��5�:�x|�Ү߿x!�R���b���IxbẀ��Q�
1El[]���y��L���������=�۝J���mF(��ʨj(���{� �`��W�����my�n�ێj�j��T��G̸�B�g� ������;��A>ٱQUSOow�J�C�AX���pp{�N,�v��Yb��z�xI�hd��*�P�G4A'�Sߨ����^�cګig�n-�[=4�y��-y,��z}P[�-��[rE*I�U��L�N����8��R;_�۶�w�۾6^�C)�����������,'��܉���K�6��k� �����R,8���yQ��t������4W��i���ݹ�c^�����^��e9��mvJ�"�Ev߭�p��>�䨒�	��ϘrOl4�����V��gg�N�kSd������:JS��Q�9�q��&oF�+Q�Ѩ��h.�d%��C.q�Όۼx�Ǝ�߆{�)�'�{�B��G&Cd{s����M�t>u�f^�q
�ڮ�"F���/���N�^N���S���:�h�(�����OrзJ���{j}�ǠY!��Q� ��
�<�)�^p��ō]�}��6�t,!����U8iJ�O�#�_���tE{�F��]3!��Ϸ#�s?�>����RZ��$�+}
,k���y��I�Y�=��F�VR�k_D�v��k��<�LdX��U	Á�GmF��k�%8��ES'�<�vP8�C��pڞ#P�h((��g3��J�G4�(a���59=��V�547)��SCU5F|���,J�`�8�:�&;v��euGf퍻m��bʹ���:{E4�A�
��IMz�M2D�L�c�!��y�:S�H�=/ǰ�ո�H�|�=
g��i���O*�2
FAw<�3�Ҩ3��7*c������P�R=4�*H�,��}� �S(n�艚V�ٕ�(�)��Lj㦞E\�b����۷}�Z���)�z l���˞���v�,h�j�T�0Y��s�|�E��ǫw���o*D����2tu�u@I�f�;���o�&�k�P]v�G-E���%���i��䞷b�R�����m�6���r#�{�K]%�d�Gp��t�G<!q ~�}8�ܩ����U\6�xT���id
����V�+�݌�S�t+0��0Ͼ1��
��Ϸ:5���I�������}i<�Ɔ�B�$w?��$3F�Č�9��p��L��#ELc8`[�γY2�/H-#������C������t�H||�'#�0�Bx�Ο�X.7Ow�UcS<)m�Q'O�/Z��̀t�	�9=�ɖ% ���V'��ƦI���V�շn�Gt~w�5:�=j:�}� �������Ww��Id�}�==��a��O 㺜�px<镺��mD� ���i��N��� ����TX���J�����P�L�t7 ��>xQ�������
J�h�T��"����� x�;���� U):+���Zh�?Ke�`��8�m�rXl����J����N$~�m\���I��֪y�L��:x꣒I��
� ���9��iu�����i�"� #pW��wEIv��_�{f��jl����ZqG�B�>U�k��6U%��p^�jZ8�"��䀊���k�^񻕹ZmV��^�
��QP\�DV����%��?c��_��i���z뤰��XSR�٘E�,lTg�c'���g��?S��-7��#�9�]e��p;|�\
#���>X�p:��B0��H�\��,���v���Z�4�h��か�8�,2�� ��҂�c�QU�x�Dq�S�~��4lU�9շ)�{Yb�d5m}�Vzj{�������5U�=�=���jri"�&=D#�[����]$�K�ҢY�J1��U�Β��7W,
c����7
y%26��hY���xD	�R)+J���NH�ԓjVR�S�4��|��8b}��h��\�EU:��z��:�؞24�m��1BĨ�
�� }V��Ǆ�Pb��R��L�?� ʁ���h�vn���F�ꐳ���y������������'�G/C�QWs�P�;�c��KKI4���ȳS��(��![=��2;=�^\q�~M8�RRJ]^�����7x��Q�M���D�
	$���G<6߶/,rR�N�mU	@��c��ǟmP_�E憾�$Ki�����`�!1<����?�|T�_h��Y!��:��H#�d��\�Ǔ��Q�9v�u{V�U�o�H���v�<�%R{�m"���DL�}�|��`�������)�v���0La��8$��T���J�(o���`Ͼ'��`xg� &��?�$C�ҙƶ���rxEभ��B�&G>��Ųc��DF�
r��W9Y��ܔLS�2�ư-51Bѕ<����mX��Bx�~�eQ�0�4�]#��_�%<n�`r]a,�#�z�}9��ԍ(H�b�9ΰ��7!�{���X�3��`g 0 ���$�F�1jt
P	QH=�e���_���ϱ��d9QK],`"���q���bdjy�R�� I��#6�C�@-�OթY��;.�i��sѤ�&��ڷYz^A���r:��w<:�Oz��Q\V��kmF)��PL�����L
��h�M5�N@��Y�I�'ՎpN�S��v��q��v��GRZX����9 ������rj]n�(���N�J�i�d�Ib�%x*�z[�ns�v�����߬IZ2��\pS��s���cq�Sتb��I#���U�H�q���<g���\v�餡��hR��&���Qz����'?�:��J[��I�+$o!*ᫎ��%H%���J�s$tIw�9ګ*Q!�C����^�OrG��G5�7�G��$�%��ǹcܞ݆��5���p��W�Ԁ��
p��{�N��t����C5Ue
� �ÿ$��2x׶���B��ͯ͊vGU����A����kk���mT�_I<��*� �Ҁ��H�Δ�����OH���^ku����)��~���Q1��U��yڢ�e�^�E
;{�i\W�v���s��Jm���kVЋCmX����*�pr���~ݎtk{�����j�H*ej�O4i,�Մ�n��j1o�52�)����OO
$�*�}H ��@� c�< ���#��:j�*�%� �@+Ҭ_�b	���7�{��]^�ut�J��i�$�A����( 9��i�V��V��/kUQD�G$�V3��T��Ga�5��~MS����[�kO X���dY	V%��
HbH���
;*���.w������&�'2������5������p$6۽��
�*;uU
�N�9�A*����T�T�04t���;u�*���#=�nX?U���n�ٷu%����$���4��u��arA$g>��:ڝN=:K$���7j����Xdu4���$N�A�##S�l³i�w��(ࠬ�K
W^ő{�#=��u�K��+�{����j�d�-f������1�2W ]s��Hk�J[��2�i��KKk�S�!n��S�,�O,I�a�m�˽v}�K-����)I���o�L�����_=�t��OY<r�����[+j�,V
Ɓ��՘1�\aq���h���t�c�z�D���\c:��CWz�"��2K�W!QQU4`�G&oNUOrx���wa]��_
�?s���43���CQ�$-Â�c9-���m�����KKR1��$���n�}h�P��I�V�{&��i�'��OE9����EYdS�@����{q���ߑ�]n�;eB�E�#1���[9�^;�Q��g���5Օ��Xf���dNGl�@�������j&��!n��@=����/.e/��q��$���~��M��n�4�u���\��dYI�2��[d?��'R��E������u0K~��:AS�h��s�� pH�g:�v���n�
�,kICt�>\��1���|nJ�������UIV��7� .��e8Pr9���Y�3C:��Ǳ܁��
7{e��Q/�\���f
����*�0 �:ۃQU��B���R�dޫr����n��RD�RX���F#�OƘo��mꖆ�
    "$&",
    "$'",
    "$*",
    "$+",
    "$1",
    "$2",
    "$3",
    "$4",
    "$5",
    "$6",
    "$7",
    "$8",
    "$9",
    "$_",
    "$`",
    "$input",
    "-moz-animation",
    "-moz-animation-delay",
    "-moz-animation-direction",
    "-moz-animation-duration",
    "-moz-animation-fill-mode",
    "-moz-animation-iteration-count",
    "-moz-animation-name",
    "-moz-animation-play-state",
    "-moz-animation-timing-function",
    "-moz-appearance",
    "-moz-backface-visibility",
    "-moz-border-end",
    "-moz-border-end-color",
    "-moz-border-end-style",
    "-moz-border-end-width",
    "-moz-border-image",
    "-moz-border-start",
    "-moz-border-start-color",
    "-moz-border-start-style",
    "-moz-border-start-width",
    "-moz-box-align",
    "-moz-box-direction",
    "-moz-box-flex",
    "-moz-box-ordinal-group",
    "-moz-box-orient",
    "-moz-box-pack",
    "-moz-box-sizing",
    "-moz-float-edge",
    "-moz-font-feature-settings",
    "-moz-font-language-override",
    "-moz-force-broken-image-icon",
    "-moz-hyphens",
    "-moz-image-region",
    "-moz-margin-end",
    "-moz-margin-start",
    "-moz-orient",
    "-moz-osx-font-smoothing",
    "-moz-outline-radius",
    "-moz-outline-radius-bottomleft",
    "-moz-outline-radius-bottomright",
    "-moz-outline-radius-topleft",
    "-moz-outline-radius-topright",
    "-moz-padding-end",
    "-moz-padding-start",
    "-moz-perspective",
    "-moz-perspective-origin",
    "-moz-tab-size",
    "-moz-text-size-adjust",
    "-moz-transform",
    "-moz-transform-origin",
    "-moz-transform-style",
    "-moz-transition",
    "-moz-transition-delay",
    "-moz-transition-duration",
    "-moz-transition-property",
    "-moz-transition-timing-function",
    "-moz-user-focus",
    "-moz-user-input",
    "-moz-user-modify",
    "-moz-user-select",
    "-moz-window-dragging",
    "-webkit-align-content",
    "-webkit-align-items",
    "-webkit-align-self",
    "-webkit-animation",
    "-webkit-animation-delay",
    "-webkit-animation-direction",
    
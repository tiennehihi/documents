Line\n         ? section.generatedOffset.generatedColumn - 1\n         : 0),\n      bias: aArgs.bias\n    });\n  };\n\n/**\n * Return true if we have the source content for every source in the source\n * map, false otherwise.\n */\nIndexedSourceMapConsumer.prototype.hasContentsOfAllSources =\n  function IndexedSourceMapConsumer_hasContentsOfAllSources() {\n    return this._sections.every(function (s) {\n      return s.consumer.hasContentsOfAllSources();\n    });\n  };\n\n/**\n * Returns the original source content. The only argument is the url of the\n * original source file. Returns null if no original source content is\n * available.\n */\nIndexedSourceMapConsumer.prototype.sourceContentFor =\n  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {\n    for (var i = 0; i < this._sections.length; i++) {\n      var section = this._sections[i];\n\n      var content = section.consumer.sourceContentFor(aSource, true);\n      if (content) {\n        return content;\n      }\n    }\n    if (nullOnMissing) {\n      return null;\n    }\n    else {\n      throw new Error('\"' + aSource + '\" is not in the SourceMap.');\n    }\n  };\n\n/**\n * Returns the generated line and column information for the original source,\n * line, and column positions provided. The only argument is an object with\n * the following properties:\n *\n *   - source: The filename of the original source.\n *   - line: The line number in the original source.  The line number\n *     is 1-based.\n *   - column: The column number in the original source.  The column\n *     number is 0-based.\n *\n * and an object is returned with the following properties:\n *\n *   - line: The line number in the generated source, or null.  The\n *     line number is 1-based. \n *   - column: The column number in the generated source, or null.\n *     The column number is 0-based.\n */\nIndexedSourceMapConsumer.prototype.generatedPositionFor =\n  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {\n    for (var i = 0; i < this._sections.length; i++) {\n      var section = this._sections[i];\n\n      // Only consider this section if the requested source is in the list of\n      // sources of the consumer.\n      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {\n        continue;\n      }\n      var generatedPosition = section.consumer.generatedPositionFor(aArgs);\n      if (generatedPosition) {\n        var ret = {\n          line: generatedPosition.line +\n            (section.generatedOffset.generatedLine - 1),\n          column: generatedPosition.column +\n            (section.generatedOffset.generatedLine === generatedPosition.line\n             ? section.generatedOffset.generatedColumn - 1\n             : 0)\n        };\n        return ret;\n      }\n    }\n\n    return {\n      line: null,\n      column: null\n    };\n  };\n\n/**\n * Parse the mappings in a string in to a data structure which we can easily\n * query (the ordered arrays in the `this.__generatedMappings` and\n * `this.__originalMappings` properties).\n */\nIndexedSourceMapConsumer.prototype._parseMappings =\n  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {\n    this.__generatedMappings = [];\n    this.__originalMappings = [];\n    for (var i = 0; i < this._sections.length; i++) {\n      var section = this._sections[i];\n      var sectionMappings = section.consumer._generatedMappings;\n      for (var j = 0; j < sectionMappings.length; j++) {\n        var mapping = sectionMappings[j];\n\n        var source = section.consumer._sources.at(mapping.source);\n        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);\n        this._sources.add(source);\n        source = this._sources.indexOf(source);\n\n        var name = null;\n        if (mapping.name) {\n          name = section.consumer._names.at(mapping.name);\n          this._names.add(name);\n          name = this._names.indexOf(name);\n        }\n\n        // The mappings coming from the consumer for the section have\n        // generated positions relative to the start of the section, so we\n        // need to offset them to be relative to the start of the concatenated\n        // generated file.\n        var adjustedMapping = {\n          source: source,\n          generatedLine: mapping.generatedLine +\n            (section.generatedOffset.generatedLine - 1),\n          generatedColumn: mapping.generatedColumn +\n            (section.generatedOffset.generatedLine === mapping.generatedLine\n            ? section.generatedOffset.generatedColumn - 1\n            : 0),\n          originalLine: mapping.originalLine,\n          originalColumn: mapping.originalColumn,\n          name: name\n        };\n\n        this.__generatedMappings.push(adjustedMapping);\n        if (typeof adjustedMapping.originalLine === 'number') {\n          this.__originalMappings.push(adjustedMapping);\n        }\n      }\n    }\n\n    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);\n    quickSort(this.__originalMappings, util.compareByOriginalPositions);\n  };\n\nexports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;\n\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./lib/source-map-consumer.js\n// module id = 7\n// module chunks = 0","/* -*- Mode: js; js-indent-level: 2; -*- */\n/*\n * Copyright 2011 Mozilla Foundation and contributors\n * Licensed under the New BSD license. See LICENSE or:\n * http://opensource.org/licenses/BSD-3-Clause\n */\n\nexports.GREATEST_LOWER_BOUND = 1;\nexports.LEAST_UPPER_BOUND = 2;\n\n/**\n * Recursive implementation of binary search.\n *\n * @param aLow Indices here and lower do not contain the needle.\n * @param aHigh Indices here and higher do not contain the needle.\n * @param aNeedle The element being searched for.\n * @param aHaystack The non-empty array being searched.\n * @param aCompare Function which takes two elements and returns -1, 0, or 1.\n * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or\n *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the\n *     closest element that is smaller than or greater than the one we are\n *     searching for, respectively, if the exact element cannot be found.\n */\nfunction recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {\n  // This function terminates when one of the following is true:\n  //\n  //   1. We find the exact element we are looking for.\n  //\n  //   2. We did not find the exact element, but we can return the index of\n  //      the next-closest element.\n  //\n  //   3. We did not find the exact element, and there is no next-closest\n  //      element than the one we are searching for, so we return -1.\n  var mid = Math.floor((aHigh - aLow) / 2) + aLow;\n  var cmp = aCompare(aNeedle, aHaystack[mid], true);\n  if (cmp === 0) {\n    // Found the element we are looking for.\n    return mid;\n  }\n  else if (cmp > 0) {\n    // Our needle is greater than aHaystack[mid].\n    if (aHigh - mid > 1) {\n      // The element is in the upper half.\n      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);\n    }\n\n    // The exact needle element was not found in this haystack. Determine if\n    // we are in termination case (3) or (2) and return the appropriate thing.\n    if (aBias == exports.LEAST_UPPER_BOUND) {\n      return aHigh < aHaystack.length ? aHigh : -1;\n    } else {\n      return mid;\n    }\n  }\n  else {\n    // Our needle is less than aHaystack[mid].\n    if (mid - aLow > 1) {\n      // The element is in the lower half.\n      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);\n    }\n\n    // we are in termination case (3) or (2) and return the appropriate thing.\n    if (aBias == exports.LEAST_UPPER_BOUND) {\n      return mid;\n    } else {\n      return aLow < 0 ? -1 : aLow;\n    }\n  }\n}\n\n/**\n * This is an implementation of binary search which will always try and return\n * the index of the closest element if there is no exact hit. This is because\n * mappings between original and generated line/col pairs are single points,\n * and there is an implicit region between each of them, so a miss just means\n * that you aren't on the v
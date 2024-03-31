n, but different
	 * source/name/original line and column the same. Useful when searching for a
	 * mapping with a stubbed out mapping.
	 */
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0 || onlyCompareGenerated) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
	
	function strcmp(aStr1, aStr2) {
	  if (aStr1 === aStr2) {
	    return 0;
	  }
	
	  if (aStr1 === null) {
	    return 1; // aStr2 !== null
	  }
	
	  if (aStr2 === null) {
	    return -1; // aStr1 !== null
	  }
	
	  if (aStr1 > aStr2) {
	    return 1;
	  }
	
	  return -1;
	}
	
	/**
	 * Comparator between two mappings with inflated source and name strings where
	 * the generated positions are compared.
	 */
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
	
	/**
	 * Strip any JSON XSSI avoidance prefix from the string (as documented
	 * in the source maps specification), and then parse the string as
	 * JSON.
	 */
	function parseSourceMapInput(str) {
	  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
	}
	exports.parseSourceMapInput = parseSourceMapInput;
	
	/**
	 * Compute the URL of a source given the the source root, the source's
	 * URL, and the source map's URL.
	 */
	function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
	  sourceURL = sourceURL || '';
	
	  if (sourceRoot) {
	    // This follows what Chrome does.
	    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
	      sourceRoot += '/';
	    }
	    // The spec says:
	    //   Line 4: An optional source root, useful for relocating source
	    //   files on a server or removing repeated values in the
	    //   â€œsourcesâ€ entry.  This value is prepended to the individual
	    //   entries in the â€œsourceâ€ field.
	    sourceURL = sourceRoot + sourceURL;
	  }
	
	  // Historically, SourceMapConsumer did not take the sourceMapURL as
	  // a parameter.  This mode is still somewhat supported, which is why
	  // this code block is conditional.  However, it's preferable to pass
	  // the source map URL to SourceMapConsumer, so that this function
	  // can implement the source URL resolution algorithm as outlined in
	  // the spec.  This block is basically the equivalent of:
	  //    new URL(sourceURL, sourceMapURL).toString()
	  // ... except it avoids using URL, which wasn't available in the
	  // older releases of node still supported by this library.
	  //
	  // The spec says:
	  //   If the sources are not absolute URLs after prepending of the
	  //   â€œsourceRootâ€, the sources are resolved relative to the
	  //   SourceMap (like resolving script src in a html document).
	  if (sourceMapURL) {
	    var parsed = urlParse(sourceMapURL);
	    if (!parsed) {
	      throw new Error("sourceMapURL could not be parsed");
	    }
	    if (parsed.path) {
	      // Strip the last path component, but keep the "/".
	      var index = parsed.path.lastIndexOf('/');
	      if (index >= 0) {
	        parsed.path = parsed.path.substring(0, index + 1);
	      }
	    }
	    sourceURL = join(urlGenerate(parsed), sourceURL);
	  }
	
	  return normalize(sourceURL);
	}
	exports.computeSourceURL = computeSourceURL;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	var has = Object.prototype.hasOwnProperty;
	var hasNativeMap = typeof Map !== "undefined";
	
	/**
	 * A data structure which is a combination of an array and a set. Adding a new
	 * member is O(1), testing for membership is O(1), and finding the index of an
	 * element is O(1). Removing elements from the set is not supported. Only
	 * strings are supported for membership.
	 */
	function ArraySet() {
	  this._array = [];
	  this._set = hasNativeMap ? new Map() : Object.create(null);
	}
	
	/**
	 * Static method for creating ArraySet instances from an existing array.
	 */
	ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	  var set = new ArraySet();
	  for (var i = 0, len = aArray.length; i < len; i++) {
	    set.add(aArray[i], aAllowDuplicates);
	  }
	  return set;
	};
	
	/**
	 * Return how many unique items are in this ArraySet. If duplicates have been
	 * added, than those do not count towards the size.
	 *
	 * @returns Number
	 */
	ArraySet.prototype.size = function ArraySet_size() {
	  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
	};
	
	/**
	 * Add the given string to this set.
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
	  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
	  var idx = this._array.length;
	  if (!isDuplicate || aAllowDuplicates) {
	    this._array.push(aStr);
	  }
	  if (!isDuplicate) {
	    if (hasNativeMap) {
	      this._set.set(aStr, idx);
	    } else {
	      this._set[sStr] = idx;
	    }
	  }
	};
	
	/**
	 * Is the given string a member of this set?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.has = function ArraySet_has(aStr) {
	  if (hasNativeMap) {
	    return this._set.has(aStr);
	  } else {
	    var sStr = util.toSetString(aStr);
	    return has.call(this._set, sStr);
	  }
	};
	
	/**
	 * What is the index of the given string in the array?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	  if (hasNativeMap) {
	    var idx = this._set.get(aStr);
	    if (idx >= 0) {
	        return idx;
	    }
	  } else {
	    var sStr = util.toSetString(aStr);
	    if (has.call(this._set, sStr)) {
	      return this._set[sStr];
	    }
	  }
	
	  throw new Error('"' + aStr + '" is not in the set.');
	};
	
	/**
	 * What is the element at the given index?
	 *
	 * @param Number aIdx
	 */
	ArraySet.prototype.at = function ArraySet_at(aIdx) {
	  if (aIdx >= 0 && aIdx < this._array.length) {
	    return this._array[aIdx];
	  }
	  throw new Error('No element indexed by ' + aIdx);
	};
	
	/**
	 * Returns the array representation of this set (which has the proper indices
	 * indicated by indexOf). Note that this is a copy of the internal array used
	 * for storing the members so that no one can mess with internal state.
	 */
	ArraySet.prototype.toArray = function ArraySet_toArray() {
	  return this._array.slice();
	};
	
	exports.ArraySet = ArraySet;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2014 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	
	/**
	 * Determine whether mappingB is after mappingA with respect to generated
	 * position.
	 */
	function generatedPositionAfter(mappingA, mappingB) {
	  // Optimized for most common case
	  var lineA = mappingA.generatedLine;
	  var lineB = mappingB.generatedLine;
	  var columnA = mappingA.generatedColumn;
	  var columnB = mappingB.generatedColumn;
	  return lineB > lineA || lineB == lineA && columnB >= columnA ||
	         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
	}
	
	/**
	 * A data structure to provide a sorted view of accumulated mappings in a
	 * performance conscious manner. It trades a neglibable overhead in general
	 * case for a large speedup in case of mappings being added in order.
	 */
	function MappingList() {
	  this._array = [];
	  this._sorted = true;
	  // Serves as infimum
	  this._last = {generatedLine: -1, generatedColumn: 0};
	}
	
	/**
	 * Iterate through internal items. This method takes the same arguments that
	 * `Array.prototype.forEach` takes.
	 *
	 * NOTE: The order of the mappings is NOT guaranteed.
	 */
	MappingList.prototype.unsortedForEach =
	  function MappingList_forEach(aCallback, aThisArg) {
	    this._array.forEach(aCallback, aThisArg);
	  };
	
	/**
	 * Add the given source mapping.
	 *
	 * @param Object aMapping
	 */
	MappingList.prototype.add = function MappingList_add(aMapping) {
	  if (generatedPositionAfter(this._last, aMapping)) {
	    this._last = aMapping;
	    this._array.push(aMapping);
	  } else {
	    this._sorted = false;
	    this._array.push(aMapping);
	  }
	};
	
	/**
	 * Returns the flat, sorted array of mappings. The mappings are sorted by
	 * generated position.
	 *
	 * WARNING: This method returns internal data without copying, for
	 * performance. The return value must NOT be mutated, and should be treated as
	 * an immutable borrow. If you want to take ownership, you must make your own
	 * copy.
	 */
	MappingList.prototype.toArray = function MappingList_toArray() {
	  if (!this._sorted) {
	    this._array.sort(util.compareByGeneratedPositionsInflated);
	    this._sorted = true;
	  }
	  return this._array;
	};
	
	exports.MappingList = MappingList;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	var binarySearch = __webpack_require__(8);
	var ArraySet = __webpack_require__(5).ArraySet;
	var base64VLQ = __webpack_require__(2);
	var quickSort = __webpack_require__(9).quickSort;
	
	function SourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  return sourceMap.sections != null
	    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
	    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
	}
	
	SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
	  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
	}
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	SourceMapConsumer.prototype._version = 3;
	
	// `__generatedMappings` and `__originalMappings` are arrays that hold the
	// parsed mapping coordinates from the source map's "mappings" attribute. They
	// are lazily instantiated, accessed via the `_generatedMappings` and
	// `_originalMappings` getters respectively, and we only parse the mappings
	// and create these arrays once queried for a source location. We jump through
	// these hoops because there can be many thousands of mappings, and parsing
	// them is expensive, so we only want to do it if we must.
	//
	// Each object in the arrays is of the form:
	//
	//     {
	//       generatedLine: The line number in the generated code,
	//       generatedColumn: The column number in the generated code,
	//       source: The path to the original source file that generated this
	//               chunk of code,
	//       originalLine: The line number in the original source that
	//                     corresponds to this chunk of generated code,
	//       originalColumn: The column number in the original source that
	//                       corresponds to this chunk of generated code,
	//       name: The name of the original symbol which generated this chunk of
	//             code.
	//     }
	//
	// All properties except for `generatedLine` and `generatedColumn` can be
	// `null`.
	//
	// `_generatedMappings` is ordered by the generated positions.
	//
	// `_originalMappings` is ordered by the original positions.
	
	SourceMapConsumer.prototype.__generatedMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__generatedMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__generatedMappings;
	  }
	});
	
	SourceMapConsumer.prototype.__originalMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__originalMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__originalMappings;
	  }
	});
	
	SourceMapConsumer.prototype._charIsMappingSeparator =
	  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
	    var c = aStr.charAt(index);
	    return c === ";" || c === ",";
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	SourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    throw new Error("Subclasses must implement _parseMappings");
	  };
	
	SourceMapConsumer.GENERATED_ORDER = 1;
	SourceMapConsumer.ORIGINAL_ORDER = 2;
	
	SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
	SourceMapConsumer.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Iterate over each mapping between an original source/line/column and a
	 * generated line/column in this source map.
	 *
	 * @param Function aCallback
	 *        The function that is called with each mapping.
	 * @param Object aContext
	 *        Optional. If specified, this object will be the value of `this` every
	 *        time that `aCallback` is called.
	 * @param aOrder
	 *        Either `SourceMapConsumer.GENERATED_ORDER` or
	 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	 *        iterate over the mappings sorted by the generated file's line/column
	 *        order or the original's source/line/column order, respectively. Defaults to
	 *        `SourceMapConsumer.GENERATED_ORDER`.
	 */
	SourceMapConsumer.prototype.eachMapping =
	  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	    var context = aContext || null;
	    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
	
	    var mappings;
	    switch (order) {
	    case SourceMapConsumer.GENERATED_ORDER:
	      mappings = this._generatedMappings;
	      break;
	    case SourceMapConsumer.ORIGINAL_ORDER:
	      mappings = this._originalMappings;
	      break;
	    default:
	      throw new Error("Unknown order of iteration.");
	    }
	
	    var sourceRoot = this.sourceRoot;
	    mappings.map(function (mapping) {
	      var source = mapping.source === null ? null : this._sources.at(mapping.source);
	      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
	      return {
	        source: source,
	        generatedLine: mapping.generatedLine,
	        generatedColumn: mapping.generatedColumn,
	        originalLine: mapping.originalLine,
	        originalColumn: mapping.originalColumn,
	        name: mapping.name === null ? null : this._names.at(mapping.name)
	      };
	    }, this).forEach(aCallback, context);
	  };
	
	/**
	 * Returns all generated line and column information for the original source,
	 * line, and column provided. If no column is prn, but different
	 * source/name/original line and column the same. Useful when searching for a
	 * mapping with a stubbed out mapping.
	 */
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0 || onlyCompareGenerated) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
	
	function strcmp(aStr1, aStr2) {
	  if (aStr1 === aStr2) {
	    return 0;
	  }
	
	  if (aStr1 === null) {
	    return 1; // aStr2 !== null
	  }
	
	  if (aStr2 === null) {
	    return -1; // aStr1 !== null
	  }
	
	  if (aStr1 > aStr2) {
	    return 1;
	  }
	
	  return -1;
	}
	
	/**
	 * Comparator between two mappings with inflated source and name strings where
	 * the generated positions are compared.
	 */
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
	
	/**
	 * Strip any JSON XSSI avoidance prefix from the string (as documented
	 * in the source maps specification), and then parse the string as
	 * JSON.
	 */
	function parseSourceMapInput(str) {
	  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
	}
	exports.parseSourceMapInput = parseSourceMapInput;
	
	/**
	 * Compute the URL of a source given the the source root, the source's
	 * URL, and the source map's URL.
	 */
	function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
	  sourceURL = sourceURL || '';
	
	  if (sourceRoot) {
	    // This follows what Chrome does.
	    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
	      sourceRoot += '/';
	    }
	    // The spec says:
	    //   Line 4: An optional source root, useful for relocating source
	    //   files on a server or removing repeated values in the
	    //   â€œsourcesâ€ entry.  This value is prepended to the individual
	    //   entries in the â€œsourceâ€ field.
	    sourceURL = sourceRoot + sourceURL;
	  }
	
	  // Historically, SourceMapConsumer did not take the sourceMapURL as
	  // a parameter.  This mode is still somewhat supported, which is why
	  // this code block is conditional.  However, it's preferable to pass
	  // the source map URL to SourceMapConsumer, so that this function
	  // can implement the source URL resolution algorithm as outlined in
	  // the spec.  This block is basically the equivalent of:
	  //    new URL(sourceURL, sourceMapURL).toString()
	  // ... except it avoids using URL, which wasn't available in the
	  // older releases of node still supported by this library.
	  //
	  // The spec says:
	  //   If the sources are not absolute URLs after prepending of the
	  //   â€œsourceRootâ€, the sources are resolved relative to the
	  //   SourceMap (like resolving script src in a html document).
	  if (sourceMapURL) {
	    var parsed = urlParse(sourceMapURL);
	    if (!parsed) {
	      throw new Error("sourceMapURL could not be parsed");
	    }
	    if (parsed.path) {
	      // Strip the last path component, but keep the "/".
	      var index = parsed.path.lastIndexOf('/');
	      if (index >= 0) {
	        parsed.path = parsed.path.substring(0, index + 1);
	      }
	    }
	    sourceURL = join(urlGenerate(parsed), sourceURL);
	  }
	
	  return normalize(sourceURL);
	}
	exports.computeSourceURL = computeSourceURL;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	var has = Object.prototype.hasOwnProperty;
	var hasNativeMap = typeof Map !== "undefined";
	
	/**
	 * A data structure which is a combination of an array and a set. Adding a new
	 * member is O(1), testing for membership is O(1), and finding the index of an
	 * element is O(1). Removing elements from the set is not supported. Only
	 * strings are supported for membership.
	 */
	function ArraySet() {
	  this._array = [];
	  this._set = hasNativeMap ? new Map() : Object.create(null);
	}
	
	/**
	 * Static method for creating ArraySet instances from an existing array.
	 */
	ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	  var set = new ArraySet();
	  for (var i = 0, len = aArray.length; i < len; i++) {
	    set.add(aArray[i], aAllowDuplicates);
	  }
	  return set;
	};
	
	/**
	 * Return how many unique items are in this ArraySet. If duplicates have been
	 * added, than those do not count towards the size.
	 *
	 * @returns Number
	 */
	ArraySet.prototype.size = function ArraySet_size() {
	  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
	};
	
	/**
	 * Add the given string to this set.
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
	  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
	  var idx = this._array.length;
	  if (!isDuplicate || aAllowDuplicates) {
	    this._array.push(aStr);
	  }
	  if (!isDuplicate) {
	    if (hasNativeMap) {
	      this._set.set(aStr, idx);
	    } else {
	      this._set[sStr] = idx;
	    }
	  }
	};
	
	/**
	 * Is the given string a member of this set?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.has = function ArraySet_has(aStr) {
	  if (hasNativeMap) {
	    return this._set.has(aStr);
	  } else {
	    var sStr = util.toSetString(aStr);
	    return has.call(this._set, sStr);
	  }
	};
	
	/**
	 * What is the index of the given string in the array?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	  if (hasNativeMap) {
	    var idx = this._set.get(aStr);
	    if (idx >= 0) {
	        return idx;
	    }
	  } else {
	    var sStr = util.toSetString(aStr);
	    if (has.call(this._set, sStr)) {
	      return this._set[sStr];
	    }
	  }
	
	  throw new Error('"' + aStr + '" is not in the set.');
	};
	
	/**
	 * What is the element at the given index?
	 *
	 * @param Number aIdx
	 */
	ArraySet.prototype.at = function ArraySet_at(aIdx) {
	  if (aIdx >= 0 && aIdx < this._array.length) {
	    return this._array[aIdx];
	  }
	  throw new Error('No element indexed by ' + aIdx);
	};
	
	/**
	 * Returns the array representation of this set (which has the proper indices
	 * indicated by indexOf). Note that this is a copy of the internal array used
	 * for storing the members so that no one can mess with internal state.
	 */
	ArraySet.prototype.toArray = function ArraySet_toArray() {
	  return this._array.slice();
	};
	
	exports.ArraySet = ArraySet;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2014 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	
	/**
	 * Determine whether mappingB is after mappingA with respect to generated
	 * position.
	 */
	function generatedPositionAfter(mappingA, mappingB) {
	  // Optimized for most common case
	  var lineA = mappingA.generatedLine;
	  var lineB = mappingB.generatedLine;
	  var columnA = mappingA.generatedColumn;
	  var columnB = mappingB.generatedColumn;
	  return lineB > lineA || lineB == lineA && columnB >= columnA ||
	         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
	}
	
	/**
	 * A data structure to provide a sorted view of accumulated mappings in a
	 * performance conscious manner. It trades a neglibable overhead in general
	 * case for a large speedup in case of mappings being added in order.
	 */
	function MappingList() {
	  this._array = [];
	  this._sorted = true;
	  // Serves as infimum
	  this._last = {generatedLine: -1, generatedColumn: 0};
	}
	
	/**
	 * Iterate through internal items. This method takes the same arguments that
	 * `Array.prototype.forEach` takes.
	 *
	 * NOTE: The order of the mappings is NOT guaranteed.
	 */
	MappingList.prototype.unsortedForEach =
	  function MappingList_forEach(aCallback, aThisArg) {
	    this._array.forEach(aCallback, aThisArg);
	  };
	
	/**
	 * Add the given source mapping.
	 *
	 * @param Object aMapping
	 */
	MappingList.prototype.add = function MappingList_add(aMapping) {
	  if (generatedPositionAfter(this._last, aMapping)) {
	    this._last = aMapping;
	    this._array.push(aMapping);
	  } else {
	    this._sorted = false;
	    this._array.push(aMapping);
	  }
	};
	
	/**
	 * Returns the flat, sorted array of mappings. The mappings are sorted by
	 * generated position.
	 *
	 * WARNING: This method returns internal data without copying, for
	 * performance. The return value must NOT be mutated, and should be treated as
	 * an immutable borrow. If you want to take ownership, you must make your own
	 * copy.
	 */
	MappingList.prototype.toArray = function MappingList_toArray() {
	  if (!this._sorted) {
	    this._array.sort(util.compareByGeneratedPositionsInflated);
	    this._sorted = true;
	  }
	  return this._array;
	};
	
	exports.MappingList = MappingList;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	var binarySearch = __webpack_require__(8);
	var ArraySet = __webpack_require__(5).ArraySet;
	var base64VLQ = __webpack_require__(2);
	var quickSort = __webpack_require__(9).quickSort;
	
	function SourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  return sourceMap.sections != null
	    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
	    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
	}
	
	SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
	  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
	}
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	SourceMapConsumer.prototype._version = 3;
	
	// `__generatedMappings` and `__originalMappings` are arrays that hold the
	// parsed mapping coordinates from the source map's "mappings" attribute. They
	// are lazily instantiated, accessed via the `_generatedMappings` and
	// `_originalMappings` getters respectively, and we only parse the mappings
	// and create these arrays once queried for a source location. We jump through
	// these hoops because there can be many thousands of mappings, and parsing
	// them is expensive, so we only want to do it if we must.
	//
	// Each object in the arrays is of the form:
	//
	//     {
	//       generatedLine: The line number in the generated code,
	//       generatedColumn: The column number in the generated code,
	//       source: The path to the original source file that generated this
	//               chunk of code,
	//       originalLine: The line number in the original source that
	//                     corresponds to this chunk of generated code,
	//       originalColumn: The column number in the original source that
	//                       corresponds to this chunk of generated code,
	//       name: The name of the original symbol which generated this chunk of
	//             code.
	//     }
	//
	// All properties except for `generatedLine` and `generatedColumn` can be
	// `null`.
	//
	// `_generatedMappings` is ordered by the generated positions.
	//
	// `_originalMappings` is ordered by the original positions.
	
	SourceMapConsumer.prototype.__generatedMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__generatedMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__generatedMappings;
	  }
	});
	
	SourceMapConsumer.prototype.__originalMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__originalMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__originalMappings;
	  }
	});
	
	SourceMapConsumer.prototype._charIsMappingSeparator =
	  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
	    var c = aStr.charAt(index);
	    return c === ";" || c === ",";
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	SourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    throw new Error("Subclasses must implement _parseMappings");
	  };
	
	SourceMapConsumer.GENERATED_ORDER = 1;
	SourceMapConsumer.ORIGINAL_ORDER = 2;
	
	SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
	SourceMapConsumer.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Iterate over each mapping between an original source/line/column and a
	 * generated line/column in this source map.
	 *
	 * @param Function aCallback
	 *        The function that is called with each mapping.
	 * @param Object aContext
	 *        Optional. If specified, this object will be the value of `this` every
	 *        time that `aCallback` is called.
	 * @param aOrder
	 *        Either `SourceMapConsumer.GENERATED_ORDER` or
	 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	 *        iterate over the mappings sorted by the generated file's line/column
	 *        order or the original's source/line/column order, respectively. Defaults to
	 *        `SourceMapConsumer.GENERATED_ORDER`.
	 */
	SourceMapConsumer.prototype.eachMapping =
	  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	    var context = aContext || null;
	    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
	
	    var mappings;
	    switch (order) {
	    case SourceMapConsumer.GENERATED_ORDER:
	      mappings = this._generatedMappings;
	      break;
	    case SourceMapConsumer.ORIGINAL_ORDER:
	      mappings = this._originalMappings;
	      break;
	    default:
	      throw new Error("Unknown order of iteration.");
	    }
	
	    var sourceRoot = this.sourceRoot;
	    mappings.map(function (mapping) {
	      var source = mapping.source === null ? null : this._sources.at(mapping.source);
	      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
	      return {
	        source: source,
	        generatedLine: mapping.generatedLine,
	        generatedColumn: mapping.generatedColumn,
	        originalLine: mapping.originalLine,
	        originalColumn: mapping.originalColumn,
	        name: mapping.name === null ? null : this._names.at(mapping.name)
	      };
	    }, this).forEach(aCallback, context);
	  };
	
	/**
	 * Returns all generated line and column information for the original source,
	 * line, and column provided. If no column is prn, but different
	 * source/name/original line and column the same. Useful when searching for a
	 * mapping with a stubbed out mapping.
	 */
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0 || onlyCompareGenerated) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
	
	function strcmp(aStr1, aStr2) {
	  if (aStr1 === aStr2) {
	    return 0;
	  }
	
	  if (aStr1 === null) {
	    return 1; // aStr2 !== null
	  }
	
	  if (aStr2 === null) {
	    return -1; // aStr1 !== null
	  }
	
	  if (aStr1 > aStr2) {
	    return 1;
	  }
	
	  return -1;
	}
	
	/**
	 * Comparator between two mappings with inflated source and name strings where
	 * the generated positions are compared.
	 */
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
	
	/**
	 * Strip any JSON XSSI avoidance prefix from the string (as documented
	 * in the source maps specification), and then parse the string as
	 * JSON.
	 */
	function parseSourceMapInput(str) {
	  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
	}
	exports.parseSourceMapInput = parseSourceMapInput;
	
	/**
	 * Compute the URL of a source given the the source root, the source's
	 * URL, and the source map's URL.
	 */
	function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
	  sourceURL = sourceURL || '';
	
	  if (sourceRoot) {
	    // This follows what Chrome does.
	    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
	      sourceRoot += '/';
	    }
	    // The spec says:
	    //   Line 4: An optional source root, useful for relocating source
	    //   files on a server or removing repeated values in the
	    //   â€œsourcesâ€ entry.  This value is prepended to the individual
	    //   entries in the â€œsourceâ€ field.
	    sourceURL = sourceRoot + sourceURL;
	  }
	
	  // Historically, SourceMapConsumer did not take the sourceMapURL as
	  // a parameter.  This mode is still somewhat supported, which is why
	  // this code block is conditional.  However, it's preferable to pass
	  // the source map URL to SourceMapConsumer, so that this function
	  // can implement the source URL resolution algorithm as outlined in
	  // the spec.  This block is basically the equivalent of:
	  //    new URL(sourceURL, sourceMapURL).toString()
	  // ... except it avoids using URL, which wasn't available in the
	  // older releases of node still supported by this library.
	  //
	  // The spec says:
	  //   If the sources are not absolute URLs after prepending of the
	  //   â€œsourceRootâ€, the sources are resolved relative to the
	  //   SourceMap (like resolving script src in a html document).
	  if (sourceMapURL) {
	    var parsed = urlParse(sourceMapURL);
	    if (!parsed) {
	      throw new Error("sourceMapURL could not be parsed");
	    }
	    if (parsed.path) {
	      // Strip the last path component, but keep the "/".
	      var index = parsed.path.lastIndexOf('/');
	      if (index >= 0) {
	        parsed.path = parsed.path.substring(0, index + 1);
	      }
	    }
	    sourceURL = join(urlGenerate(parsed), sourceURL);
	  }
	
	  return normalize(sourceURL);
	}
	exports.computeSourceURL = computeSourceURL;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	var has = Object.prototype.hasOwnProperty;
	var hasNativeMap = typeof Map !== "undefined";
	
	/**
	 * A data structure which is a combination of an array and a set. Adding a new
	 * member is O(1), testing for membership is O(1), and finding the index of an
	 * element is O(1). Removing elements from the set is not supported. Only
	 * strings are supported for membership.
	 */
	function ArraySet() {
	  this._array = [];
	  this._set = hasNativeMap ? new Map() : Object.create(null);
	}
	
	/**
	 * Static method for creating ArraySet instances from an existing array.
	 */
	ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	  var set = new ArraySet();
	  for (var i = 0, len = aArray.length; i < len; i++) {
	    set.add(aArray[i], aAllowDuplicates);
	  }
	  return set;
	};
	
	/**
	 * Return how many unique items are in this ArraySet. If duplicates have been
	 * added, than those do not count towards the size.
	 *
	 * @returns Number
	 */
	ArraySet.prototype.size = function ArraySet_size() {
	  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
	};
	
	/**
	 * Add the given string to this set.
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
	  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
	  var idx = this._array.length;
	  if (!isDuplicate || aAllowDuplicates) {
	    this._array.push(aStr);
	  }
	  if (!isDuplicate) {
	    if (hasNativeMap) {
	      this._set.set(aStr, idx);
	    } else {
	      this._set[sStr] = idx;
	    }
	  }
	};
	
	/**
	 * Is the given string a member of this set?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.has = function ArraySet_has(aStr) {
	  if (hasNativeMap) {
	    return this._set.has(aStr);
	  } else {
	    var sStr = util.toSetString(aStr);
	    return has.call(this._set, sStr);
	  }
	};
	
	/**
	 * What is the index of the given string in the array?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	  if (hasNativeMap) {
	    var idx = this._set.get(aStr);
	    if (idx >= 0) {
	        return idx;
	    }
	  } else {
	    var sStr = util.toSetString(aStr);
	    if (has.call(this._set, sStr)) {
	      return this._set[sStr];
	    }
	  }
	
	  throw new Error('"' + aStr + '" is not in the set.');
	};
	
	/**
	 * What is the element at the given index?
	 *
	 * @param Number aIdx
	 */
	ArraySet.prototype.at = function ArraySet_at(aIdx) {
	  if (aIdx >= 0 && aIdx < this._array.length) {
	    return this._array[aIdx];
	  }
	  throw new Error('No element indexed by ' + aIdx);
	};
	
	/**
	 * Returns the array representation of this set (which has the proper indices
	 * indicated by indexOf). Note that this is a copy of the internal array used
	 * for storing the members so that no one can mess with internal state.
	 */
	ArraySet.prototype.toArray = function ArraySet_toArray() {
	  return this._array.slice();
	};
	
	exports.ArraySet = ArraySet;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2014 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	
	/**
	 * Determine whether mappingB is after mappingA with respect to generated
	 * position.
	 */
	function generatedPositionAfter(mappingA, mappingB) {
	  // Optimized for most common case
	  var lineA = mappingA.generatedLine;
	  var lineB = mappingB.generatedLine;
	  var columnA = mappingA.generatedColumn;
	  var columnB = mappingB.generatedColumn;
	  return lineB > lineA || lineB == lineA && columnB >= columnA ||
	         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
	}
	
	/**
	 * A data structure to provide a sorted view of accumulated mappings in a
	 * performance conscious manner. It trades a neglibable overhead in general
	 * case for a large speedup in case of mappings being added in order.
	 */
	function MappingList() {
	  this._array = [];
	  this._sorted = true;
	  // Serves as infimum
	  this._last = {generatedLine: -1, generatedColumn: 0};
	}
	
	/**
	 * Iterate through internal items. This method takes the same arguments that
	 * `Array.prototype.forEach` takes.
	 *
	 * NOTE: The order of the mappings is NOT guaranteed.
	 */
	MappingList.prototype.unsortedForEach =
	  function MappingList_forEach(aCallback, aThisArg) {
	    this._array.forEach(aCallback, aThisArg);
	  };
	
	/**
	 * Add the given source mapping.
	 *
	 * @param Object aMapping
	 */
	MappingList.prototype.add = function MappingList_add(aMapping) {
	  if (generatedPositionAfter(this._last, aMapping)) {
	    this._last = aMapping;
	    this._array.push(aMapping);
	  } else {
	    this._sorted = false;
	    this._array.push(aMapping);
	  }
	};
	
	/**
	 * Returns the flat, sorted array of mappings. The mappings are sorted by
	 * generated position.
	 *
	 * WARNING: This method returns internal data without copying, for
	 * performance. The return value must NOT be mutated, and should be treated as
	 * an immutable borrow. If you want to take ownership, you must make your own
	 * copy.
	 */
	MappingList.prototype.toArray = function MappingList_toArray() {
	  if (!this._sorted) {
	    this._array.sort(util.compareByGeneratedPositionsInflated);
	    this._sorted = true;
	  }
	  return this._array;
	};
	
	exports.MappingList = MappingList;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	var binarySearch = __webpack_require__(8);
	var ArraySet = __webpack_require__(5).ArraySet;
	var base64VLQ = __webpack_require__(2);
	var quickSort = __webpack_require__(9).quickSort;
	
	function SourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  return sourceMap.sections != null
	    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
	    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
	}
	
	SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
	  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
	}
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	SourceMapConsumer.prototype._version = 3;
	
	// `__generatedMappings` and `__originalMappings` are arrays that hold the
	// parsed mapping coordinates from the source map's "mappings" attribute. They
	// are lazily instantiated, accessed via the `_generatedMappings` and
	// `_originalMappings` getters respectively, and we only parse the mappings
	// and create these arrays once queried for a source location. We jump through
	// these hoops because there can be many thousands of mappings, and parsing
	// them is expensive, so we only want to do it if we must.
	//
	// Each object in the arrays is of the form:
	//
	//     {
	//       generatedLine: The line number in the generated code,
	//       generatedColumn: The column number in the generated code,
	//       source: The path to the original source file that generated this
	//               chunk of code,
	//       originalLine: The line number in the original source that
	//                     corresponds to this chunk of generated code,
	//       originalColumn: The column number in the original source that
	//                       corresponds to this chunk of generated code,
	//       name: The name of the original symbol which generated this chunk of
	//             code.
	//     }
	//
	// All properties except for `generatedLine` and `generatedColumn` can be
	// `null`.
	//
	// `_generatedMappings` is ordered by the generated positions.
	//
	// `_originalMappings` is ordered by the original positions.
	
	SourceMapConsumer.prototype.__generatedMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__generatedMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__generatedMappings;
	  }
	});
	
	SourceMapConsumer.prototype.__originalMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__originalMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__originalMappings;
	  }
	});
	
	SourceMapConsumer.prototype._charIsMappingSeparator =
	  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
	    var c = aStr.charAt(index);
	    return c === ";" || c === ",";
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	SourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    throw new Error("Subclasses must implement _parseMappings");
	  };
	
	SourceMapConsumer.GENERATED_ORDER = 1;
	SourceMapConsumer.ORIGINAL_ORDER = 2;
	
	SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
	SourceMapConsumer.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Iterate over each mapping between an original source/line/column and a
	 * generated line/column in this source map.
	 *
	 * @param Function aCallback
	 *        The function that is called with each mapping.
	 * @param Object aContext
	 *        Optional. If specified, this object will be the value of `this` every
	 *        time that `aCallback` is called.
	 * @param aOrder
	 *        Either `SourceMapConsumer.GENERATED_ORDER` or
	 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	 *        iterate over the mappings sorted by the generated file's line/column
	 *        order or the original's source/line/column order, respectively. Defaults to
	 *        `SourceMapConsumer.GENERATED_ORDER`.
	 */
	SourceMapConsumer.prototype.eachMapping =
	  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	    var context = aContext || null;
	    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
	
	    var mappings;
	    switch (order) {
	    case SourceMapConsumer.GENERATED_ORDER:
	      mappings = this._generatedMappings;
	      break;
	    case SourceMapConsumer.ORIGINAL_ORDER:
	      mappings = this._originalMappings;
	      break;
	    default:
	      throw new Error("Unknown order of iteration.");
	    }
	
	    var sourceRoot = this.sourceRoot;
	    mappings.map(function (mapping) {
	      var source = mapping.source === null ? null : this._sources.at(mapping.source);
	      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
	      return {
	        source: source,
	        generatedLine: mapping.generatedLine,
	        generatedColumn: mapping.generatedColumn,
	        originalLine: mapping.originalLine,
	        originalColumn: mapping.originalColumn,
	        name: mapping.name === null ? null : this._names.at(mapping.name)
	      };
	    }, this).forEach(aCallback, context);
	  };
	
	/**
	 * Returns all generated line and column information for the original source,
	 * line, and column provided. If no column is prn, but different
	 * source/name/original line and column the same. Useful when searching for a
	 * mapping with a stubbed out mapping.
	 */
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0 || onlyCompareGenerated) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
	
	function strcmp(aStr1, aStr2) {
	  if (aStr1 === aStr2) {
	    return 0;
	  }
	
	  if (aStr1 === null) {
	    return 1; // aStr2 !== null
	  }
	
	  if (aStr2 === null) {
	    return -1; // aStr1 !== null
	  }
	
	  if (aStr1 > aStr2) {
	    return 1;
	  }
	
	  return -1;
	}
	
	/**
	 * Comparator between two mappings with inflated source and name strings where
	 * the generated positions are compared.
	 */
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
	
	/**
	 * Strip any JSON XSSI avoidance prefix from the string (as documented
	 * in the source maps specification), and then parse the string as
	 * JSON.
	 */
	function parseSourceMapInput(str) {
	  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
	}
	exports.parseSourceMapInput = parseSourceMapInput;
	
	/**
	 * Compute the URL of a source given the the source root, the source's
	 * URL, and the source map's URL.
	 */
	function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
	  sourceURL = sourceURL || '';
	
	  if (sourceRoot) {
	    // This follows what Chrome does.
	    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
	      sourceRoot += '/';
	    }
	    // The spec says:
	    //   Line 4: An optional source root, useful for relocating source
	    //   files on a server or removing repeated values in the
	    //   â€œsourcesâ€ entry.  This value is prepended to the individual
	    //   entries in the â€œsourceâ€ field.
	    sourceURL = sourceRoot + sourceURL;
	  }
	
	  // Historically, SourceMapConsumer did not take the sourceMapURL as
	  // a parameter.  This mode is still somewhat supported, which is why
	  // this code block is conditional.  However, it's preferable to pass
	  // the source map URL to SourceMapConsumer, so that this function
	  // can implement the source URL resolution algorithm as outlined in
	  // the spec.  This block is basically the equivalent of:
	  //    new URL(sourceURL, sourceMapURL).toString()
	  // ... except it avoids using URL, which wasn't available in the
	  // older releases of node still supported by this library.
	  //
	  // The spec says:
	  //   If the sources are not absolute URLs after prepending of the
	  //   â€œsourceRootâ€, the sources are resolved relative to the
	  //   SourceMap (like resolving script src in a html document).
	  if (sourceMapURL) {
	    var parsed = urlParse(sourceMapURL);
	    if (!parsed) {
	      throw new Error("sourceMapURL could not be parsed");
	    }
	    if (parsed.path) {
	      // Strip the last path component, but keep the "/".
	      var index = parsed.path.lastIndexOf('/');
	      if (index >= 0) {
	        parsed.path = parsed.path.substring(0, index + 1);
	      }
	    }
	    sourceURL = join(urlGenerate(parsed), sourceURL);
	  }
	
	  return normalize(sourceURL);
	}
	exports.computeSourceURL = computeSourceURL;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	var has = Object.prototype.hasOwnProperty;
	var hasNativeMap = typeof Map !== "undefined";
	
	/**
	 * A data structure which is a combination of an array and a set. Adding a new
	 * member is O(1), testing for membership is O(1), and finding the index of an
	 * element is O(1). Removing elements from the set is not supported. Only
	 * strings are supported for membership.
	 */
	function ArraySet() {
	  this._array = [];
	  this._set = hasNativeMap ? new Map() : Object.create(null);
	}
	
	/**
	 * Static method for creating ArraySet instances from an existing array.
	 */
	ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	  var set = new ArraySet();
	  for (var i = 0, len = aArray.length; i < len; i++) {
	    set.add(aArray[i], aAllowDuplicates);
	  }
	  return set;
	};
	
	/**
	 * Return how many unique items are in this ArraySet. If duplicates have been
	 * added, than those do not count towards the size.
	 *
	 * @returns Number
	 */
	ArraySet.prototype.size = function ArraySet_size() {
	  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
	};
	
	/**
	 * Add the given string to this set.
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
	  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
	  var idx = this._array.length;
	  if (!isDuplicate || aAllowDuplicates) {
	    this._array.push(aStr);
	  }
	  if (!isDuplicate) {
	    if (hasNativeMap) {
	      this._set.set(aStr, idx);
	    } else {
	      this._set[sStr] = idx;
	    }
	  }
	};
	
	/**
	 * Is the given string a member of this set?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.has = function ArraySet_has(aStr) {
	  if (hasNativeMap) {
	    return this._set.has(aStr);
	  } else {
	    var sStr = util.toSetString(aStr);
	    return has.call(this._set, sStr);
	  }
	};
	
	/**
	 * What is the index of the given string in the array?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	  if (hasNativeMap) {
	    var idx = this._set.get(aStr);
	    if (idx >= 0) {
	        return idx;
	    }
	  } else {
	    var sStr = util.toSetString(aStr);
	    if (has.call(this._set, sStr)) {
	      return this._set[sStr];
	    }
	  }
	
	  throw new Error('"' + aStr + '" is not in the set.');
	};
	
	/**
	 * What is the element at the given index?
	 *
	 * @param Number aIdx
	 */
	ArraySet.prototype.at = function ArraySet_at(aIdx) {
	  if (aIdx >= 0 && aIdx < this._array.length) {
	    return this._array[aIdx];
	  }
	  throw new Error('No element indexed by ' + aIdx);
	};
	
	/**
	 * Returns the array representation of this set (which has the proper indices
	 * indicated by indexOf). Note that this is a copy of the internal array used
	 * for storing the members so that no one can mess with internal state.
	 */
	ArraySet.prototype.toArray = function ArraySet_toArray() {
	  return this._array.slice();
	};
	
	exports.ArraySet = ArraySet;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2014 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	
	/**
	 * Determine whether mappingB is after mappingA with respect to generated
	 * position.
	 */
	function generatedPositionAfter(mappingA, mappingB) {
	  // Optimized for most common case
	  var lineA = mappingA.generatedLine;
	  var lineB = mappingB.generatedLine;
	  var columnA = mappingA.generatedColumn;
	  var columnB = mappingB.generatedColumn;
	  return lineB > lineA || lineB == lineA && columnB >= columnA ||
	         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
	}
	
	/**
	 * A data structure to provide a sorted view of accumulated mappings in a
	 * performance conscious manner. It trades a neglibable overhead in general
	 * case for a large speedup in case of mappings being added in order.
	 */
	function MappingList() {
	  this._array = [];
	  this._sorted = true;
	  // Serves as infimum
	  this._last = {generatedLine: -1, generatedColumn: 0};
	}
	
	/**
	 * Iterate through internal items. This method takes the same arguments that
	 * `Array.prototype.forEach` takes.
	 *
	 * NOTE: The order of the mappings is NOT guaranteed.
	 */
	MappingList.prototype.unsortedForEach =
	  function MappingList_forEach(aCallback, aThisArg) {
	    this._array.forEach(aCallback, aThisArg);
	  };
	
	/**
	 * Add the given source mapping.
	 *
	 * @param Object aMapping
	 */
	MappingList.prototype.add = function MappingList_add(aMapping) {
	  if (generatedPositionAfter(this._last, aMapping)) {
	    this._last = aMapping;
	    this._array.push(aMapping);
	  } else {
	    this._sorted = false;
	    this._array.push(aMapping);
	  }
	};
	
	/**
	 * Returns the flat, sorted array of mappings. The mappings are sorted by
	 * generated position.
	 *
	 * WARNING: This method returns internal data without copying, for
	 * performance. The return value must NOT be mutated, and should be treated as
	 * an immutable borrow. If you want to take ownership, you must make your own
	 * copy.
	 */
	MappingList.prototype.toArray = function MappingList_toArray() {
	  if (!this._sorted) {
	    this._array.sort(util.compareByGeneratedPositionsInflated);
	    this._sorted = true;
	  }
	  return this._array;
	};
	
	exports.MappingList = MappingList;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	var binarySearch = __webpack_require__(8);
	var ArraySet = __webpack_require__(5).ArraySet;
	var base64VLQ = __webpack_require__(2);
	var quickSort = __webpack_require__(9).quickSort;
	
	function SourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  return sourceMap.sections != null
	    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
	    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
	}
	
	SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
	  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
	}
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	SourceMapConsumer.prototype._version = 3;
	
	// `__generatedMappings` and `__originalMappings` are arrays that hold the
	// parsed mapping coordinates from the source map's "mappings" attribute. They
	// are lazily instantiated, accessed via the `_generatedMappings` and
	// `_originalMappings` getters respectively, and we only parse the mappings
	// and create these arrays once queried for a source location. We jump through
	// these hoops because there can be many thousands of mappings, and parsing
	// them is expensive, so we only want to do it if we must.
	//
	// Each object in the arrays is of the form:
	//
	//     {
	//       generatedLine: The line number in the generated code,
	//       generatedColumn: The column number in the generated code,
	//       source: The path to the original source file that generated this
	//               chunk of code,
	//       originalLine: The line number in the original source that
	//                     corresponds to this chunk of generated code,
	//       originalColumn: The column number in the original source that
	//                       corresponds to this chunk of generated code,
	//       name: The name of the original symbol which generated this chunk of
	//             code.
	//     }
	//
	// All properties except for `generatedLine` and `generatedColumn` can be
	// `null`.
	//
	// `_generatedMappings` is ordered by the generated positions.
	//
	// `_originalMappings` is ordered by the original positions.
	
	SourceMapConsumer.prototype.__generatedMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__generatedMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__generatedMappings;
	  }
	});
	
	SourceMapConsumer.prototype.__originalMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__originalMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__originalMappings;
	  }
	});
	
	SourceMapConsumer.prototype._charIsMappingSeparator =
	  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
	    var c = aStr.charAt(index);
	    return c === ";" || c === ",";
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	SourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    throw new Error("Subclasses must implement _parseMappings");
	  };
	
	SourceMapConsumer.GENERATED_ORDER = 1;
	SourceMapConsumer.ORIGINAL_ORDER = 2;
	
	SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
	SourceMapConsumer.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Iterate over each mapping between an original source/line/column and a
	 * generated line/column in this source map.
	 *
	 * @param Function aCallback
	 *        The function that is called with each mapping.
	 * @param Object aContext
	 *        Optional. If specified, this object will be the value of `this` every
	 *        time that `aCallback` is called.
	 * @param aOrder
	 *        Either `SourceMapConsumer.GENERATED_ORDER` or
	 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	 *        iterate over the mappings sorted by the generated file's line/column
	 *        order or the original's source/line/column order, respectively. Defaults to
	 *        `SourceMapConsumer.GENERATED_ORDER`.
	 */
	SourceMapConsumer.prototype.eachMapping =
	  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	    var context = aContext || null;
	    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
	
	    var mappings;
	    switch (order) {
	    case SourceMapConsumer.GENERATED_ORDER:
	      mappings = this._generatedMappings;
	      break;
	    case SourceMapConsumer.ORIGINAL_ORDER:
	      mappings = this._originalMappings;
	      break;
	    default:
	      throw new Error("Unknown order of iteration.");
	    }
	
	    var sourceRoot = this.sourceRoot;
	    mappings.map(function (mapping) {
	      var source = mapping.source === null ? null : this._sources.at(mapping.source);
	      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
	      return {
	        source: source,
	        generatedLine: mapping.generatedLine,
	        generatedColumn: mapping.generatedColumn,
	        originalLine: mapping.originalLine,
	        originalColumn: mapping.originalColumn,
	        name: mapping.name === null ? null : this._names.at(mapping.name)
	      };
	    }, this).forEach(aCallback, context);
	  };
	
	/**
	 * Returns all generated line and column information for the original source,
	 * line, and column provided. If no column is prn, but different
	 * source/name/original line and column the same. Useful when searching for a
	 * mapping with a stubbed out mapping.
	 */
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0 || onlyCompareGenerated) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
	
	function strcmp(aStr1, aStr2) {
	  if (aStr1 === aStr2) {
	    return 0;
	  }
	
	  if (aStr1 === null) {
	    return 1; // aStr2 !== null
	  }
	
	  if (aStr2 === null) {
	    return -1; // aStr1 !== null
	  }
	
	  if (aStr1 > aStr2) {
	    return 1;
	  }
	
	  return -1;
	}
	
	/**
	 * Comparator between two mappings with inflated source and name strings where
	 * the generated positions are compared.
	 */
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
	
	/**
	 * Strip any JSON XSSI avoidance prefix from the string (as documented
	 * in the source maps specification), and then parse the string as
	 * JSON.
	 */
	function parseSourceMapInput(str) {
	  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
	}
	exports.parseSourceMapInput = parseSourceMapInput;
	
	/**
	 * Compute the URL of a source given the the source root, the source's
	 * URL, and the source map's URL.
	 */
	function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
	  sourceURL = sourceURL || '';
	
	  if (sourceRoot) {
	    // This follows what Chrome does.
	    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
	      sourceRoot += '/';
	    }
	    // The spec says:
	    //   Line 4: An optional source root, useful for relocating source
	    //   files on a server or removing repeated values in the
	    //   â€œsourcesâ€ entry.  This value is prepended to the individual
	    //   entries in the â€œsourceâ€ field.
	    sourceURL = sourceRoot + sourceURL;
	  }
	
	  // Historically, SourceMapConsumer did not take the sourceMapURL as
	  // a parameter.  This mode is still somewhat supported, which is why
	  // this code block is conditional.  However, it's preferable to pass
	  // the source map URL to SourceMapConsumer, so that this function
	  // can implement the source URL resolution algorithm as outlined in
	  // the spec.  This block is basically the equivalent of:
	  //    new URL(sourceURL, sourceMapURL).toString()
	  // ... except it avoids using URL, which wasn't available in the
	  // older releases of node still supported by this library.
	  //
	  // The spec says:
	  //   If the sources are not absolute URLs after prepending of the
	  //   â€œsourceRootâ€, the sources are resolved relative to the
	  //   SourceMap (like resolving script src in a html document).
	  if (sourceMapURL) {
	    var parsed = urlParse(sourceMapURL);
	    if (!parsed) {
	      throw new Error("sourceMapURL could not be parsed");
	    }
	    if (parsed.path) {
	      // Strip the last path component, but keep the "/".
	      var index = parsed.path.lastIndexOf('/');
	      if (index >= 0) {
	        parsed.path = parsed.path.substring(0, index + 1);
	      }
	    }
	    sourceURL = join(urlGenerate(parsed), sourceURL);
	  }
	
	  return normalize(sourceURL);
	}
	exports.computeSourceURL = computeSourceURL;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	var has = Object.prototype.hasOwnProperty;
	var hasNativeMap = typeof Map !== "undefined";
	
	/**
	 * A data structure which is a combination of an array and a set. Adding a new
	 * member is O(1), testing for membership is O(1), and finding the index of an
	 * element is O(1). Removing elements from the set is not supported. Only
	 * strings are supported for membership.
	 */
	function ArraySet() {
	  this._array = [];
	  this._set = hasNativeMap ? new Map() : Object.create(null);
	}
	
	/**
	 * Static method for creating ArraySet instances from an existing array.
	 */
	ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	  var set = new ArraySet();
	  for (var i = 0, len = aArray.length; i < len; i++) {
	    set.add(aArray[i], aAllowDuplicates);
	  }
	  return set;
	};
	
	/**
	 * Return how many unique items are in this ArraySet. If duplicates have been
	 * added, than those do not count towards the size.
	 *
	 * @returns Number
	 */
	ArraySet.prototype.size = function ArraySet_size() {
	  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
	};
	
	/**
	 * Add the given string to this set.
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
	  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
	  var idx = this._array.length;
	  if (!isDuplicate || aAllowDuplicates) {
	    this._array.push(aStr);
	  }
	  if (!isDuplicate) {
	    if (hasNativeMap) {
	      this._set.set(aStr, idx);
	    } else {
	      this._set[sStr] = idx;
	    }
	  }
	};
	
	/**
	 * Is the given string a member of this set?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.has = function ArraySet_has(aStr) {
	  if (hasNativeMap) {
	    return this._set.has(aStr);
	  } else {
	    var sStr = util.toSetString(aStr);
	    return has.call(this._set, sStr);
	  }
	};
	
	/**
	 * What is the index of the given string in the array?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	  if (hasNativeMap) {
	    var idx = this._set.get(aStr);
	    if (idx >= 0) {
	        return idx;
	    }
	  } else {
	    var sStr = util.toSetString(aStr);
	    if (has.call(this._set, sStr)) {
	      return this._set[sStr];
	    }
	  }
	
	  throw new Error('"' + aStr + '" is not in the set.');
	};
	
	/**
	 * What is the element at the given index?
	 *
	 * @param Number aIdx
	 */
	ArraySet.prototype.at = function ArraySet_at(aIdx) {
	  if (aIdx >= 0 && aIdx < this._array.length) {
	    return this._array[aIdx];
	  }
	  throw new Error('No element indexed by ' + aIdx);
	};
	
	/**
	 * Returns the array representation of this set (which has the proper indices
	 * indicated by indexOf). Note that this is a copy of the internal array used
	 * for storing the members so that no one can mess with internal state.
	 */
	ArraySet.prototype.toArray = function ArraySet_toArray() {
	  return this._array.slice();
	};
	
	exports.ArraySet = ArraySet;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2014 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	
	/**
	 * Determine whether mappingB is after mappingA with respect to generated
	 * position.
	 */
	function generatedPositionAfter(mappingA, mappingB) {
	  // Optimized for most common case
	  var lineA = mappingA.generatedLine;
	  var lineB = mappingB.generatedLine;
	  var columnA = mappingA.generatedColumn;
	  var columnB = mappingB.generatedColumn;
	  return lineB > lineA || lineB == lineA && columnB >= columnA ||
	         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
	}
	
	/**
	 * A data structure to provide a sorted view of accumulated mappings in a
	 * performance conscious manner. It trades a neglibable overhead in general
	 * case for a large speedup in case of mappings being added in order.
	 */
	function MappingList() {
	  this._array = [];
	  this._sorted = true;
	  // Serves as infimum
	  this._last = {generatedLine: -1, generatedColumn: 0};
	}
	
	/**
	 * Iterate through internal items. This method takes the same arguments that
	 * `Array.prototype.forEach` takes.
	 *
	 * NOTE: The order of the mappings is NOT guaranteed.
	 */
	MappingList.prototype.unsortedForEach =
	  function MappingList_forEach(aCallback, aThisArg) {
	    this._array.forEach(aCallback, aThisArg);
	  };
	
	/**
	 * Add the given source mapping.
	 *
	 * @param Object aMapping
	 */
	MappingList.prototype.add = function MappingList_add(aMapping) {
	  if (generatedPositionAfter(this._last, aMapping)) {
	    this._last = aMapping;
	    this._array.push(aMapping);
	  } else {
	    this._sorted = false;
	    this._array.push(aMapping);
	  }
	};
	
	/**
	 * Returns the flat, sorted array of mappings. The mappings are sorted by
	 * generated position.
	 *
	 * WARNING: This method returns internal data without copying, for
	 * performance. The return value must NOT be mutated, and should be treated as
	 * an immutable borrow. If you want to take ownership, you must make your own
	 * copy.
	 */
	MappingList.prototype.toArray = function MappingList_toArray() {
	  if (!this._sorted) {
	    this._array.sort(util.compareByGeneratedPositionsInflated);
	    this._sorted = true;
	  }
	  return this._array;
	};
	
	exports.MappingList = MappingList;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	var binarySearch = __webpack_require__(8);
	var ArraySet = __webpack_require__(5).ArraySet;
	var base64VLQ = __webpack_require__(2);
	var quickSort = __webpack_require__(9).quickSort;
	
	function SourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  return sourceMap.sections != null
	    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
	    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
	}
	
	SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
	  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
	}
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	SourceMapConsumer.prototype._version = 3;
	
	// `__generatedMappings` and `__originalMappings` are arrays that hold the
	// parsed mapping coordinates from the source map's "mappings" attribute. They
	// are lazily instantiated, accessed via the `_generatedMappings` and
	// `_originalMappings` getters respectively, and we only parse the mappings
	// and create these arrays once queried for a source location. We jump through
	// these hoops because there can be many thousands of mappings, and parsing
	// them is expensive, so we only want to do it if we must.
	//
	// Each object in the arrays is of the form:
	//
	//     {
	//       generatedLine: The line number in the generated code,
	//       generatedColumn: The column number in the generated code,
	//       source: The path to the original source file that generated this
	//               chunk of code,
	//       originalLine: The line number in the original source that
	//                     corresponds to this chunk of generated code,
	//       originalColumn: The column number in the original source that
	//                       corresponds to this chunk of generated code,
	//       name: The name of the original symbol which generated this chunk of
	//             code.
	//     }
	//
	// All properties except for `generatedLine` and `generatedColumn` can be
	// `null`.
	//
	// `_generatedMappings` is ordered by the generated positions.
	//
	// `_originalMappings` is ordered by the original positions.
	
	SourceMapConsumer.prototype.__generatedMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__generatedMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__generatedMappings;
	  }
	});
	
	SourceMapConsumer.prototype.__originalMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__originalMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__originalMappings;
	  }
	});
	
	SourceMapConsumer.prototype._charIsMappingSeparator =
	  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
	    var c = aStr.charAt(index);
	    return c === ";" || c === ",";
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	SourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    throw new Error("Subclasses must implement _parseMappings");
	  };
	
	SourceMapConsumer.GENERATED_ORDER = 1;
	SourceMapConsumer.ORIGINAL_ORDER = 2;
	
	SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
	SourceMapConsumer.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Iterate over each mapping between an original source/line/column and a
	 * generated line/column in this source map.
	 *
	 * @param Function aCallback
	 *        The function that is called with each mapping.
	 * @param Object aContext
	 *        Optional. If specified, this object will be the value of `this` every
	 *        time that `aCallback` is called.
	 * @param aOrder
	 *        Either `SourceMapConsumer.GENERATED_ORDER` or
	 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	 *        iterate over the mappings sorted by the generated file's line/column
	 *        order or the original's source/line/column order, respectively. Defaults to
	 *        `SourceMapConsumer.GENERATED_ORDER`.
	 */
	SourceMapConsumer.prototype.eachMapping =
	  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	    var context = aContext || null;
	    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
	
	    var mappings;
	    switch (order) {
	    case SourceMapConsumer.GENERATED_ORDER:
	      mappings = this._generatedMappings;
	      break;
	    case SourceMapConsumer.ORIGINAL_ORDER:
	      mappings = this._originalMappings;
	      break;
	    default:
	      throw new Error("Unknown order of iteration.");
	    }
	
	    var sourceRoot = this.sourceRoot;
	    mappings.map(function (mapping) {
	      var source = mapping.source === null ? null : this._sources.at(mapping.source);
	      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
	      return {
	        source: source,
	        generatedLine: mapping.generatedLine,
	        generatedColumn: mapping.generatedColumn,
	        originalLine: mapping.originalLine,
	        originalColumn: mapping.originalColumn,
	        name: mapping.name === null ? null : this._names.at(mapping.name)
	      };
	    }, this).forEach(aCallback, context);
	  };
	
	/**
	 * Returns all generated line and column information for the original source,
	 * line, and column provided. If no column is prn, but different
	 * source/name/original line and column the same. Useful when searching for a
	 * mapping with a stubbed out mapping.
	 */
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0 || onlyCompareGenerated) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
	
	function strcmp(aStr1, aStr2) {
	  if (aStr1 === aStr2) {
	    return 0;
	  }
	
	  if (aStr1 === null) {
	    return 1; // aStr2 !== null
	  }
	
	  if (aStr2 === null) {
	    return -1; // aStr1 !== null
	  }
	
	  if (aStr1 > aStr2) {
	    return 1;
	  }
	
	  return -1;
	}
	
	/**
	 * Comparator between two mappings with inflated source and name strings where
	 * the generated positions are compared.
	 */
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
	
	/**
	 * Strip any JSON XSSI avoidance prefix from the string (as documented
	 * in the source maps specification), and then parse the string as
	 * JSON.
	 */
	function parseSourceMapInput(str) {
	  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
	}
	exports.parseSourceMapInput = parseSourceMapInput;
	
	/**
	 * Compute the URL of a source given the the source root, the source's
	 * URL, and the source map's URL.
	 */
	function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
	  sourceURL = sourceURL || '';
	
	  if (sourceRoot) {
	    // This follows what Chrome does.
	    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
	      sourceRoot += '/';
	    }
	    // The spec says:
	    //   Line 4: An optional source root, useful for relocating source
	    //   files on a server or removing repeated values in the
	    //   â€œsourcesâ€ entry.  This value is prepended to the individual
	    //   entries in the â€œsourceâ€ field.
	    sourceURL = sourceRoot + sourceURL;
	  }
	
	  // Historically, SourceMapConsumer did not take the sourceMapURL as
	  // a parameter.  This mode is still somewhat supported, which is why
	  // this code block is conditional.  However, it's preferable to pass
	  // the source map URL to SourceMapConsumer, so that this function
	  // can implement the source URL resolution algorithm as outlined in
	  // the spec.  This block is basically the equivalent of:
	  //    new URL(sourceURL, sourceMapURL).toString()
	  // ... except it avoids using URL, which wasn't available in the
	  // older releases of node still supported by this library.
	  //
	  // The spec says:
	  //   If the sources are not absolute URLs after prepending of the
	  //   â€œsourceRootâ€, the sources are resolved relative to the
	  //   SourceMap (like resolving script src in a html document).
	  if (sourceMapURL) {
	    var parsed = urlParse(sourceMapURL);
	    if (!parsed) {
	      throw new Error("sourceMapURL could not be parsed");
	    }
	    if (parsed.path) {
	      // Strip the last path component, but keep the "/".
	      var index = parsed.path.lastIndexOf('/');
	      if (index >= 0) {
	        parsed.path = parsed.path.substring(0, index + 1);
	      }
	    }
	    sourceURL = join(urlGenerate(parsed), sourceURL);
	  }
	
	  return normalize(sourceURL);
	}
	exports.computeSourceURL = computeSourceURL;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	var has = Object.prototype.hasOwnProperty;
	var hasNativeMap = typeof Map !== "undefined";
	
	/**
	 * A data structure which is a combination of an array and a set. Adding a new
	 * member is O(1), testing for membership is O(1), and finding the index of an
	 * element is O(1). Removing elements from the set is not supported. Only
	 * strings are supported for membership.
	 */
	function ArraySet() {
	  this._array = [];
	  this._set = hasNativeMap ? new Map() : Object.create(null);
	}
	
	/**
	 * Static method for creating ArraySet instances from an existing array.
	 */
	ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	  var set = new ArraySet();
	  for (var i = 0, len = aArray.length; i < len; i++) {
	    set.add(aArray[i], aAllowDuplicates);
	  }
	  return set;
	};
	
	/**
	 * Return how many unique items are in this ArraySet. If duplicates have been
	 * added, than those do not count towards the size.
	 *
	 * @returns Number
	 */
	ArraySet.prototype.size = function ArraySet_size() {
	  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
	};
	
	/**
	 * Add the given string to this set.
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
	  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
	  var idx = this._array.length;
	  if (!isDuplicate || aAllowDuplicates) {
	    this._array.push(aStr);
	  }
	  if (!isDuplicate) {
	    if (hasNativeMap) {
	      this._set.set(aStr, idx);
	    } else {
	      this._set[sStr] = idx;
	    }
	  }
	};
	
	/**
	 * Is the given string a member of this set?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.has = function ArraySet_has(aStr) {
	  if (hasNativeMap) {
	    return this._set.has(aStr);
	  } else {
	    var sStr = util.toSetString(aStr);
	    return has.call(this._set, sStr);
	  }
	};
	
	/**
	 * What is the index of the given string in the array?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	  if (hasNativeMap) {
	    var idx = this._set.get(aStr);
	    if (idx >= 0) {
	        return idx;
	    }
	  } else {
	    var sStr = util.toSetString(aStr);
	    if (has.call(this._set, sStr)) {
	      return this._set[sStr];
	    }
	  }
	
	  throw new Error('"' + aStr + '" is not in the set.');
	};
	
	/**
	 * What is the element at the given index?
	 *
	 * @param Number aIdx
	 */
	ArraySet.prototype.at = function ArraySet_at(aIdx) {
	  if (aIdx >= 0 && aIdx < this._array.length) {
	    return this._array[aIdx];
	  }
	  throw new Error('No element indexed by ' + aIdx);
	};
	
	/**
	 * Returns the array representation of this set (which has the proper indices
	 * indicated by indexOf). Note that this is a copy of the internal array used
	 * for storing the members so that no one can mess with internal state.
	 */
	ArraySet.prototype.toArray = function ArraySet_toArray() {
	  return this._array.slice();
	};
	
	exports.ArraySet = ArraySet;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2014 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	
	/**
	 * Determine whether mappingB is after mappingA with respect to generated
	 * position.
	 */
	function generatedPositionAfter(mappingA, mappingB) {
	  // Optimized for most common case
	  var lineA = mappingA.generatedLine;
	  var lineB = mappingB.generatedLine;
	  var columnA = mappingA.generatedColumn;
	  var columnB = mappingB.generatedColumn;
	  return lineB > lineA || lineB == lineA && columnB >= columnA ||
	         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
	}
	
	/**
	 * A data structure to provide a sorted view of accumulated mappings in a
	 * performance conscious manner. It trades a neglibable overhead in general
	 * case for a large speedup in case of mappings being added in order.
	 */
	function MappingList() {
	  this._array = [];
	  this._sorted = true;
	  // Serves as infimum
	  this._last = {generatedLine: -1, generatedColumn: 0};
	}
	
	/**
	 * Iterate through internal items. This method takes the same arguments that
	 * `Array.prototype.forEach` takes.
	 *
	 * NOTE: The order of the mappings is NOT guaranteed.
	 */
	MappingList.prototype.unsortedForEach =
	  function MappingList_forEach(aCallback, aThisArg) {
	    this._array.forEach(aCallback, aThisArg);
	  };
	
	/**
	 * Add the given source mapping.
	 *
	 * @param Object aMapping
	 */
	MappingList.prototype.add = function MappingList_add(aMapping) {
	  if (generatedPositionAfter(this._last, aMapping)) {
	    this._last = aMapping;
	    this._array.push(aMapping);
	  } else {
	    this._sorted = false;
	    this._array.push(aMapping);
	  }
	};
	
	/**
	 * Returns the flat, sorted array of mappings. The mappings are sorted by
	 * generated position.
	 *
	 * WARNING: This method returns internal data without copying, for
	 * performance. The return value must NOT be mutated, and should be treated as
	 * an immutable borrow. If you want to take ownership, you must make your own
	 * copy.
	 */
	MappingList.prototype.toArray = function MappingList_toArray() {
	  if (!this._sorted) {
	    this._array.sort(util.compareByGeneratedPositionsInflated);
	    this._sorted = true;
	  }
	  return this._array;
	};
	
	exports.MappingList = MappingList;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	var binarySearch = __webpack_require__(8);
	var ArraySet = __webpack_require__(5).ArraySet;
	var base64VLQ = __webpack_require__(2);
	var quickSort = __webpack_require__(9).quickSort;
	
	function SourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  return sourceMap.sections != null
	    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
	    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
	}
	
	SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
	  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
	}
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	SourceMapConsumer.prototype._version = 3;
	
	// `__generatedMappings` and `__originalMappings` are arrays that hold the
	// parsed mapping coordinates from the source map's "mappings" attribute. They
	// are lazily instantiated, accessed via the `_generatedMappings` and
	// `_originalMappings` getters respectively, and we only parse the mappings
	// and create these arrays once queried for a source location. We jump through
	// these hoops because there can be many thousands of mappings, and parsing
	// them is expensive, so we only want to do it if we must.
	//
	// Each object in the arrays is of the form:
	//
	//     {
	//       generatedLine: The line number in the generated code,
	//       generatedColumn: The column number in the generated code,
	//       source: The path to the original source file that generated this
	//               chunk of code,
	//       originalLine: The line number in the original source that
	//                     corresponds to this chunk of generated code,
	//       originalColumn: The column number in the original source that
	//                       corresponds to this chunk of generated code,
	//       name: The name of the original symbol which generated this chunk of
	//             code.
	//     }
	//
	// All properties except for `generatedLine` and `generatedColumn` can be
	// `null`.
	//
	// `_generatedMappings` is ordered by the generated positions.
	//
	// `_originalMappings` is ordered by the original positions.
	
	SourceMapConsumer.prototype.__generatedMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__generatedMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__generatedMappings;
	  }
	});
	
	SourceMapConsumer.prototype.__originalMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__originalMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__originalMappings;
	  }
	});
	
	SourceMapConsumer.prototype._charIsMappingSeparator =
	  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
	    var c = aStr.charAt(index);
	    return c === ";" || c === ",";
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	SourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    throw new Error("Subclasses must implement _parseMappings");
	  };
	
	SourceMapConsumer.GENERATED_ORDER = 1;
	SourceMapConsumer.ORIGINAL_ORDER = 2;
	
	SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
	SourceMapConsumer.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Iterate over each mapping between an original source/line/column and a
	 * generated line/column in this source map.
	 *
	 * @param Function aCallback
	 *        The function that is called with each mapping.
	 * @param Object aContext
	 *        Optional. If specified, this object will be the value of `this` every
	 *        time that `aCallback` is called.
	 * @param aOrder
	 *        Either `SourceMapConsumer.GENERATED_ORDER` or
	 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	 *        iterate over the mappings sorted by the generated file's line/column
	 *        order or the original's source/line/column order, respectively. Defaults to
	 *        `SourceMapConsumer.GENERATED_ORDER`.
	 */
	SourceMapConsumer.prototype.eachMapping =
	  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	    var context = aContext || null;
	    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
	
	    var mappings;
	    switch (order) {
	    case SourceMapConsumer.GENERATED_ORDER:
	      mappings = this._generatedMappings;
	      break;
	    case SourceMapConsumer.ORIGINAL_ORDER:
	      mappings = this._originalMappings;
	      break;
	    default:
	      throw new Error("Unknown order of iteration.");
	    }
	
	    var sourceRoot = this.sourceRoot;
	    mappings.map(function (mapping) {
	      var source = mapping.source === null ? null : this._sources.at(mapping.source);
	      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
	      return {
	        source: source,
	        generatedLine: mapping.generatedLine,
	        generatedColumn: mapping.generatedColumn,
	        originalLine: mapping.originalLine,
	        originalColumn: mapping.originalColumn,
	        name: mapping.name === null ? null : this._names.at(mapping.name)
	      };
	    }, this).forEach(aCallback, context);
	  };
	
	/**
	 * Returns all generated line and column information for the original source,
	 * line, and column provided. If no column is pr§ç¨«ç¨­ç¨¯ç¨°ç¨´ç¨µç¨¸ç¨¹ç¨ºç©„ç©…ç©‡ç©ˆç©Œç©•ç©–ç©™ç©œç©ç©Ÿç© ç©¥ç©§ç©ªç©­ç©µç©¸ç©¾çª€çª‚çª…çª†çªŠçª‹çªçª‘çª”çªçª çª£çª¬çª³çªµçª¹çª»çª¼ç«†ç«‰ç«Œç«ç«‘ç«›ç«¨ç«©ç««ç«¬ç«±ç«´ç«»ç«½ç«¾ç¬‡ç¬”ç¬Ÿç¬£ç¬§ç¬©ç¬ªç¬«ç¬­ç¬®ç¬¯ç¬°"],
["8fd2a1","ç¬±ç¬´ç¬½ç¬¿ç­€ç­ç­‡ç­ç­•ç­ ç­¤ç­¦ç­©ç­ªç­­ç­¯ç­²ç­³ç­·ç®„ç®‰ç®ç®ç®‘ç®–ç®›ç®ç® ç®¥ç®¬ç®¯ç®°ç®²ç®µç®¶ç®ºç®»ç®¼ç®½ç¯‚ç¯…ç¯ˆç¯Šç¯”ç¯–ç¯—ç¯™ç¯šç¯›ç¯¨ç¯ªç¯²ç¯´ç¯µç¯¸ç¯¹ç¯ºç¯¼ç¯¾ç°ç°‚ç°ƒç°„ç°†ç°‰ç°‹ç°Œç°ç°ç°™ç°›ç° ç°¥ç°¦ç°¨ç°¬ç°±ç°³ç°´ç°¶ç°¹ç°ºç±†ç±Šç±•ç±‘ç±’ç±“ç±™",5],
["8fd3a1","ç±¡ç±£ç±§ç±©ç±­ç±®ç±°ç±²ç±¹ç±¼ç±½ç²†ç²‡ç²ç²”ç²ç² ç²¦ç²°ç²¶ç²·ç²ºç²»ç²¼ç²¿ç³„ç³‡ç³ˆç³‰ç³ç³ç³“ç³”ç³•ç³—ç³™ç³šç³ç³¦ç³©ç³«ç³µç´ƒç´‡ç´ˆç´‰ç´ç´‘ç´’ç´“ç´–ç´ç´ç´£ç´¦ç´ªç´­ç´±ç´¼ç´½ç´¾çµ€çµçµ‡çµˆçµçµ‘çµ“çµ—çµ™çµšçµœçµçµ¥çµ§çµªçµ°çµ¸çµºçµ»çµ¿ç¶ç¶‚ç¶ƒç¶…ç¶†ç¶ˆç¶‹ç¶Œç¶ç¶‘ç¶–ç¶—ç¶"],
["8fd4a1","ç¶ç¶¦ç¶§ç¶ªç¶³ç¶¶ç¶·ç¶¹ç·‚",4,"ç·Œç·ç·ç·—ç·™ç¸€ç·¢ç·¥ç·¦ç·ªç·«ç·­ç·±ç·µç·¶ç·¹ç·ºç¸ˆç¸ç¸‘ç¸•ç¸—ç¸œç¸ç¸ ç¸§ç¸¨ç¸¬ç¸­ç¸¯ç¸³ç¸¶ç¸¿ç¹„ç¹…ç¹‡ç¹ç¹ç¹’ç¹˜ç¹Ÿç¹¡ç¹¢ç¹¥ç¹«ç¹®ç¹¯ç¹³ç¹¸ç¹¾çºçº†çº‡çºŠçºçº‘çº•çº˜çºšçºçºç¼¼ç¼»ç¼½ç¼¾ç¼¿ç½ƒç½„ç½‡ç½ç½’ç½“ç½›ç½œç½ç½¡ç½£ç½¤ç½¥ç½¦ç½­"],
["8fd5a1","ç½±ç½½ç½¾ç½¿ç¾€ç¾‹ç¾ç¾ç¾ç¾‘ç¾–ç¾—ç¾œç¾¡ç¾¢ç¾¦ç¾ªç¾­ç¾´ç¾¼ç¾¿ç¿€ç¿ƒç¿ˆç¿ç¿ç¿›ç¿Ÿç¿£ç¿¥ç¿¨ç¿¬ç¿®ç¿¯ç¿²ç¿ºç¿½ç¿¾ç¿¿è€‡è€ˆè€Šè€è€è€è€‘è€“è€”è€–è€è€è€Ÿè€ è€¤è€¦è€¬è€®è€°è€´è€µè€·è€¹è€ºè€¼è€¾è€è„è è¤è¦è­è±èµè‚è‚ˆè‚è‚œè‚è‚¦è‚§è‚«è‚¸è‚¹èƒˆèƒèƒèƒ’èƒ”èƒ•èƒ—èƒ˜èƒ èƒ­èƒ®"],
["8fd6a1","èƒ°èƒ²èƒ³èƒ¶èƒ¹èƒºèƒ¾è„ƒè„‹è„–è„—è„˜è„œè„è„ è„¤è„§è„¬è„°è„µè„ºè„¼è……è…‡è…Šè…Œè…’è…—è… è…¡è…§è…¨è…©è…­è…¯è…·è†è†è†„è†…è††è†‹è†è†–è†˜è†›è†è†¢è†®è†²è†´è†»è‡‹è‡ƒè‡…è‡Šè‡è‡è‡•è‡—è‡›è‡è‡è‡¡è‡¤è‡«è‡¬è‡°è‡±è‡²è‡µè‡¶è‡¸è‡¹è‡½è‡¿èˆ€èˆƒèˆèˆ“èˆ”èˆ™èˆšèˆèˆ¡èˆ¢èˆ¨èˆ²èˆ´èˆºè‰ƒè‰„è‰…è‰†"],
["8fd7a1","è‰‹è‰è‰è‰‘è‰–è‰œè‰ è‰£è‰§è‰­è‰´è‰»è‰½è‰¿èŠ€èŠèŠƒèŠ„èŠ‡èŠ‰èŠŠèŠèŠ‘èŠ”èŠ–èŠ˜èŠšèŠ›èŠ èŠ¡èŠ£èŠ¤èŠ§èŠ¨èŠ©èŠªèŠ®èŠ°èŠ²èŠ´èŠ·èŠºèŠ¼èŠ¾èŠ¿è‹†è‹è‹•è‹šè‹ è‹¢è‹¤è‹¨è‹ªè‹­è‹¯è‹¶è‹·è‹½è‹¾èŒ€èŒèŒ‡èŒˆèŒŠèŒ‹è”èŒ›èŒèŒèŒŸèŒ¡èŒ¢èŒ¬èŒ­èŒ®èŒ°èŒ³èŒ·èŒºèŒ¼èŒ½è‚èƒè„è‡èèè‘è•è–è—è°è¸"],
["8fd8a1","è½è¿è€è‚è„è†èè’è”è•è˜è™è›èœèè¦è§è©è¬è¾è¿è€è‡è‰èèè‘è”èè“è¨èªè¶è¸è¹è¼èè†èŠèè‘è•è™è­è¯è¹è‘…è‘‡è‘ˆè‘Šè‘è‘è‘‘è‘’è‘–è‘˜è‘™è‘šè‘œè‘ è‘¤è‘¥è‘§è‘ªè‘°è‘³è‘´è‘¶è‘¸è‘¼è‘½è’è’…è’’è’“è’•è’è’¦è’¨è’©è’ªè’¯è’±è’´è’ºè’½è’¾è“€è“‚è“‡è“ˆè“Œè“è““"],
["8fd9a1","è“œè“§è“ªè“¯è“°è“±è“²è“·è”²è“ºè“»è“½è”‚è”ƒè”‡è”Œè”è”è”œè”è”¢è”£è”¤è”¥è”§è”ªè”«è”¯è”³è”´è”¶è”¿è•†è•",4,"è•–è•™è•œ",6,"è•¤è•«è•¯è•¹è•ºè•»è•½è•¿è–è–…è–†è–‰è–‹è–Œè–è–“è–˜è–è–Ÿè– è–¢è–¥è–§è–´è–¶è–·è–¸è–¼è–½è–¾è–¿è—‚è—‡è—Šè—‹è—è–­è—˜è—šè—Ÿè— è—¦è—¨è—­è—³è—¶è—¼"],
["8fdaa1","è—¿è˜€è˜„è˜…è˜è˜è˜è˜‘è˜’è˜˜è˜™è˜›è˜è˜¡è˜§è˜©è˜¶è˜¸è˜ºè˜¼è˜½è™€è™‚è™†è™’è™“è™–è™—è™˜è™™è™è™ ",4,"è™©è™¬è™¯è™µè™¶è™·è™ºèšèš‘èš–èš˜èššèšœèš¡èš¦èš§èš¨èš­èš±èš³èš´èšµèš·èš¸èš¹èš¿è›€è›è›ƒè›…è›‘è›’è›•è›—è›šè›œè› è›£è›¥è›§èšˆè›ºè›¼è›½èœ„èœ…èœ‡èœ‹èœèœèœèœ“èœ”èœ™èœèœŸèœ¡èœ£"],
["8fdba1","èœ¨èœ®èœ¯èœ±èœ²èœ¹èœºèœ¼èœ½èœ¾è€èƒè…èè˜èè¡è¤è¥è¯è±è²è»èƒ",6,"è‹èŒèè“è•è—è˜è™èè è£è§è¬è­è®è±èµè¾è¿èŸèŸˆèŸ‰èŸŠèŸèŸ•èŸ–èŸ™èŸšèŸœèŸŸèŸ¢èŸ£èŸ¤èŸªèŸ«èŸ­èŸ±èŸ³èŸ¸èŸºèŸ¿è è ƒè †è ‰è Šè ‹è è ™è ’è “è ”è ˜è šè ›è œè è Ÿè ¨è ­è ®è °è ²è µ"],
["8fdca1","è ºè ¼è¡è¡ƒè¡…è¡ˆè¡‰è¡Šè¡‹è¡è¡‘è¡•è¡–è¡˜è¡šè¡œè¡Ÿè¡ è¡¤è¡©è¡±è¡¹è¡»è¢€è¢˜è¢šè¢›è¢œè¢Ÿè¢ è¢¨è¢ªè¢ºè¢½è¢¾è£€è£Š",4,"è£‘è£’è£“è£›è£è£§è£¯è£°è£±è£µè£·è¤è¤†è¤è¤è¤è¤•è¤–è¤˜è¤™è¤šè¤œè¤ è¤¦è¤§è¤¨è¤°è¤±è¤²è¤µè¤¹è¤ºè¤¾è¥€è¥‚è¥…è¥†è¥‰è¥è¥’è¥—è¥šè¥›è¥œè¥¡è¥¢è¥£è¥«è¥®è¥°è¥³è¥µè¥º"],
["8fdda1","è¥»è¥¼è¥½è¦‰è¦è¦è¦”è¦•è¦›è¦œè¦Ÿè¦ è¦¥è¦°è¦´è¦µè¦¶è¦·è¦¼è§”",4,"è§¥è§©è§«è§­è§±è§³è§¶è§¹è§½è§¿è¨„è¨…è¨‡è¨è¨‘è¨’è¨”è¨•è¨è¨ è¨¢è¨¤è¨¦è¨«è¨¬è¨¯è¨µè¨·è¨½è¨¾è©€è©ƒè©…è©‡è©‰è©è©è©“è©–è©—è©˜è©œè©è©¡è©¥è©§è©µè©¶è©·è©¹è©ºè©»è©¾è©¿èª€èªƒèª†èª‹èªèªèª’èª–èª—èª™èªŸèª§èª©èª®èª¯èª³"],
["8fdea1","èª¶èª·èª»èª¾è«ƒè«†è«ˆè«‰è«Šè«‘è«“è«”è«•è«—è«è«Ÿè«¬è«°è«´è«µè«¶è«¼è«¿è¬…è¬†è¬‹è¬‘è¬œè¬è¬Ÿè¬Šè¬­è¬°è¬·è¬¼è­‚",4,"è­ˆè­’è­“è­”è­™è­è­è­£è­­è­¶è­¸è­¹è­¼è­¾è®è®„è®…è®‹è®è®è®”è®•è®œè®è®Ÿè°¸è°¹è°½è°¾è±…è±‡è±‰è±‹è±è±‘è±“è±”è±—è±˜è±›è±è±™è±£è±¤è±¦è±¨è±©è±­è±³è±µè±¶è±»è±¾è²†"],
["8fdfa1","è²‡è²‹è²è²’è²“è²™è²›è²œè²¤è²¹è²ºè³…è³†è³‰è³‹è³è³–è³•è³™è³è³¡è³¨è³¬è³¯è³°è³²è³µè³·è³¸è³¾è³¿è´è´ƒè´‰è´’è´—è´›èµ¥èµ©èµ¬èµ®èµ¿è¶‚è¶„è¶ˆè¶è¶è¶‘è¶•è¶è¶Ÿè¶ è¶¦è¶«è¶¬è¶¯è¶²è¶µè¶·è¶¹è¶»è·€è·…è·†è·‡è·ˆè·Šè·è·‘è·”è·•è·—è·™è·¤è·¥è·§è·¬è·°è¶¼è·±è·²è·´è·½è¸è¸„è¸…è¸†è¸‹è¸‘è¸”è¸–è¸ è¸¡è¸¢"],
["8fe0a1","è¸£è¸¦è¸§è¸±è¸³è¸¶è¸·è¸¸è¸¹è¸½è¹€è¹è¹‹è¹è¹è¹è¹”è¹›è¹œè¹è¹è¹¡è¹¢è¹©è¹¬è¹­è¹¯è¹°è¹±è¹¹è¹ºè¹»èº‚èºƒèº‰èºèº’èº•èºšèº›èºèºèº¢èº§èº©èº­èº®èº³èºµèººèº»è»€è»è»ƒè»„è»‡è»è»‘è»”è»œè»¨è»®è»°è»±è»·è»¹è»ºè»­è¼€è¼‚è¼‡è¼ˆè¼è¼è¼–è¼—è¼˜è¼è¼ è¼¡è¼£è¼¥è¼§è¼¨è¼¬è¼­è¼®è¼´è¼µè¼¶è¼·è¼ºè½€è½"],
["8fe1a1","è½ƒè½‡è½è½‘",4,"è½˜è½è½è½¥è¾è¾ è¾¡è¾¤è¾¥è¾¦è¾µè¾¶è¾¸è¾¾è¿€è¿è¿†è¿Šè¿‹è¿è¿è¿’è¿“è¿•è¿ è¿£è¿¤è¿¨è¿®è¿±è¿µè¿¶è¿»è¿¾é€‚é€„é€ˆé€Œé€˜é€›é€¨é€©é€¯é€ªé€¬é€­é€³é€´é€·é€¿éƒé„éŒé›éé¢é¦é§é¬é°é´é¹é‚…é‚ˆé‚‹é‚Œé‚é‚é‚•é‚—é‚˜é‚™é‚›é‚ é‚¡é‚¢é‚¥é‚°é‚²é‚³é‚´é‚¶é‚½éƒŒé‚¾éƒƒ"],
["8fe2a1","éƒ„éƒ…éƒ‡éƒˆéƒ•éƒ—éƒ˜éƒ™éƒœéƒéƒŸéƒ¥éƒ’éƒ¶éƒ«éƒ¯éƒ°éƒ´éƒ¾éƒ¿é„€é„„é„…é„†é„ˆé„é„é„”é„–é„—é„˜é„šé„œé„é„ é„¥é„¢é„£é„§é„©é„®é„¯é„±é„´é„¶é„·é„¹é„ºé„¼é„½é…ƒé…‡é…ˆé…é…“é…—é…™é…šé…›é…¡é…¤é…§é…­é…´é…¹é…ºé…»é†é†ƒé†…é††é†Šé†é†‘é†“é†”é†•é†˜é†é†¡é†¦é†¨é†¬é†­é†®é†°é†±é†²é†³é†¶é†»é†¼é†½é†¿"],
["8fe3a1","é‡‚é‡ƒé‡…é‡“é‡”é‡—é‡™é‡šé‡é‡¤é‡¥é‡©é‡ªé‡¬",5,"é‡·é‡¹é‡»é‡½éˆ€éˆéˆ„éˆ…éˆ†éˆ‡éˆ‰éˆŠéˆŒéˆéˆ’éˆ“éˆ–éˆ˜éˆœéˆéˆ£éˆ¤éˆ¥éˆ¦éˆ¨éˆ®éˆ¯éˆ°éˆ³éˆµéˆ¶éˆ¸éˆ¹éˆºéˆ¼éˆ¾é‰€é‰‚é‰ƒé‰†é‰‡é‰Šé‰é‰é‰é‰‘é‰˜é‰™é‰œé‰é‰ é‰¡é‰¥é‰§é‰¨é‰©é‰®é‰¯é‰°é‰µ",4,"é‰»é‰¼é‰½é‰¿éŠˆéŠ‰éŠŠéŠéŠéŠ’éŠ—"],
["8fe4a1","éŠ™éŠŸéŠ éŠ¤éŠ¥éŠ§éŠ¨éŠ«éŠ¯éŠ²éŠ¶éŠ¸éŠºéŠ»éŠ¼éŠ½éŠ¿",4,"é‹…é‹†é‹‡é‹ˆé‹‹é‹Œé‹é‹é‹é‹“é‹•é‹—é‹˜é‹™é‹œé‹é‹Ÿé‹ é‹¡é‹£é‹¥é‹§é‹¨é‹¬é‹®é‹°é‹¹é‹»é‹¿éŒ€éŒ‚éŒˆéŒéŒ‘éŒ”éŒ•éŒœéŒéŒéŒŸéŒ¡éŒ¤éŒ¥éŒ§éŒ©éŒªéŒ³éŒ´éŒ¶éŒ·é‡éˆé‰éé‘é’é•é—é˜éšéé¤é¥é§é©éªé­é¯é°é±é³é´é¶"],
["8fe5a1","éºé½é¿é€éé‚éˆéŠé‹ééé’é•é˜é›éé¡é£é¤é¦é¨é«é´éµé¶éºé©éé„é…é†é‡é‰",4,"é“é™éœééŸé¢é¦é§é¹é·é¸éºé»é½éé‚é„éˆé‰éééé•é–é—éŸé®é¯é±é²é³é´é»é¿é½é‘ƒé‘…é‘ˆé‘Šé‘Œé‘•é‘™é‘œé‘Ÿé‘¡é‘£é‘¨é‘«é‘­é‘®é‘¯é‘±é‘²é’„é’ƒé•¸é•¹"],
["8fe6a1","é•¾é–„é–ˆé–Œé–é–é–é–é–Ÿé–¡é–¦é–©é–«é–¬é–´é–¶é–ºé–½é–¿é—†é—ˆé—‰é—‹é—é—‘é—’é—“é—™é—šé—é—é—Ÿé— é—¤é—¦é˜é˜é˜¢é˜¤é˜¥é˜¦é˜¬é˜±é˜³é˜·é˜¸é˜¹é˜ºé˜¼é˜½é™é™’é™”é™–é™—é™˜é™¡é™®é™´é™»é™¼é™¾é™¿éšéš‚éšƒéš„éš‰éš‘éš–éššéšéšŸéš¤éš¥éš¦éš©éš®éš¯éš³éšºé›Šé›’å¶²é›˜é›šé›é›é›Ÿé›©é›¯é›±é›ºéœ‚"],
["8fe7a1","éœƒéœ…éœ‰éœšéœ›éœéœ¡éœ¢éœ£éœ¨éœ±éœ³ééƒéŠééé•é—é˜éšé›é£é§éªé®é³é¶é·é¸é»é½é¿é€é‰é•é–é—é™éšééŸé¢é¬é®é±é²éµé¶é¸é¹éºé¼é¾é¿éŸéŸ„éŸ…éŸ‡éŸ‰éŸŠéŸŒéŸéŸéŸéŸ‘éŸ”éŸ—éŸ˜éŸ™éŸéŸéŸ éŸ›éŸ¡éŸ¤éŸ¯éŸ±éŸ´éŸ·éŸ¸éŸºé ‡é Šé ™é é é ”é –é œé é  é £é ¦"],
["8fe8a1","é «é ®é ¯é °é ²é ³é µé ¥é ¾é¡„é¡‡é¡Šé¡‘é¡’é¡“é¡–é¡—é¡™é¡šé¡¢é¡£é¡¥é¡¦é¡ªé¡¬é¢«é¢­é¢®é¢°é¢´é¢·é¢¸é¢ºé¢»é¢¿é£‚é£…é£ˆé£Œé£¡é££é£¥é£¦é£§é£ªé£³é£¶é¤‚é¤‡é¤ˆé¤‘é¤•é¤–é¤—é¤šé¤›é¤œé¤Ÿé¤¢é¤¦é¤§é¤«é¤±",4,"é¤¹é¤ºé¤»é¤¼é¥€é¥é¥†é¥‡é¥ˆé¥é¥é¥”é¥˜é¥™é¥›é¥œé¥é¥Ÿé¥ é¦›é¦é¦Ÿé¦¦é¦°é¦±é¦²é¦µ"],
["8fe9a1","é¦¹é¦ºé¦½é¦¿é§ƒé§‰é§“é§”é§™é§šé§œé§é§§é§ªé§«é§¬é§°é§´é§µé§¹é§½é§¾é¨‚é¨ƒé¨„é¨‹é¨Œé¨é¨‘é¨–é¨é¨ é¨¢é¨£é¨¤é¨§é¨­é¨®é¨³é¨µé¨¶é¨¸é©‡é©é©„é©Šé©‹é©Œé©é©‘é©”é©–é©éªªéª¬éª®éª¯éª²éª´éªµéª¶éª¹éª»éª¾éª¿é«é«ƒé«†é«ˆé«é«é«’é«•é«–é«—é«›é«œé« é«¤é«¥é«§é«©é«¬é«²é«³é«µé«¹é«ºé«½é«¿",4],
["8feaa1","é¬„é¬…é¬ˆé¬‰é¬‹é¬Œé¬é¬é¬é¬’é¬–é¬™é¬›é¬œé¬ é¬¦é¬«é¬­é¬³é¬´é¬µé¬·é¬¹é¬ºé¬½é­ˆé­‹é­Œé­•é­–é­—é­›é­é­¡é­£é­¥é­¦é­¨é­ª",4,"é­³é­µé­·é­¸é­¹é­¿é®€é®„é®…é®†é®‡é®‰é®Šé®‹é®é®é®é®”é®šé®é®é®¦é®§é®©é®¬é®°é®±é®²é®·é®¸é®»é®¼é®¾é®¿é¯é¯‡é¯ˆé¯é¯é¯—é¯˜é¯é¯Ÿé¯¥é¯§é¯ªé¯«é¯¯é¯³é¯·é¯¸"],
["8feba1","é¯¹é¯ºé¯½é¯¿é°€é°‚é°‹é°é°‘é°–é°˜é°™é°šé°œé°é°¢é°£é°¦",4,"é°±é°µé°¶é°·é°½é±é±ƒé±„é±…é±‰é±Šé±é±é±é±“é±”é±–é±˜é±›é±é±é±Ÿé±£é±©é±ªé±œé±«é±¨é±®é±°é±²é±µé±·é±»é³¦é³²é³·é³¹é´‹é´‚é´‘é´—é´˜é´œé´é´é´¯é´°é´²é´³é´´é´ºé´¼éµ…é´½éµ‚éµƒéµ‡éµŠéµ“éµ”éµŸéµ£éµ¢éµ¥éµ©éµªéµ«éµ°éµ¶éµ·éµ»"],
["8feca1","éµ¼éµ¾é¶ƒé¶„é¶†é¶Šé¶é¶é¶’é¶“é¶•é¶–é¶—é¶˜é¶¡é¶ªé¶¬é¶®é¶±é¶µé¶¹é¶¼é¶¿é·ƒé·‡é·‰é·Šé·”é·•é·–é·—é·šé·é·Ÿé· é·¥é·§é·©é·«é·®é·°é·³é·´é·¾é¸Šé¸‚é¸‡é¸é¸é¸‘é¸’é¸•é¸–é¸™é¸œé¸é¹ºé¹»é¹¼éº€éº‚éºƒéº„éº…éº‡éºéºéº–éº˜éº›éºéº¤éº¨éº¬éº®éº¯éº°éº³éº´éºµé»†é»ˆé»‹é»•é»Ÿé»¤é»§é»¬é»­é»®é»°é»±é»²é»µ"],
["8feda1","é»¸é»¿é¼‚é¼ƒé¼‰é¼é¼é¼‘é¼’é¼”é¼–é¼—é¼™é¼šé¼›é¼Ÿé¼¢é¼¦é¼ªé¼«é¼¯é¼±é¼²é¼´é¼·é¼¹é¼ºé¼¼é¼½é¼¿é½é½ƒ",4,"é½“é½•é½–é½—é½˜é½šé½é½é½¨é½©é½­",4,"é½³é½µé½ºé½½é¾é¾é¾‘é¾’é¾”é¾–é¾—é¾é¾¡é¾¢é¾£é¾¥"]
]
                                                                                                                                                                                                                                                                                                                                                                                                                        §¹åm@Ú—h[ø'÷Vém~¤F±‘]ßŠf•czR¡†g3¾ê$„{‘í®H¶ a©lŞpÜ®z×vªŸKı’\=¦‹@˜;DİÙğ$Zp+Œ´êÿìÔ íL«`Öèğ$®ÖüÆÇØªÈÉ—'}±ÌyÑSÛıj¦-ØÜKPe\©¿GàèìÊ:®åS.loôl­íS0>õe}ùdN/WÉZÑûè`ÛààÚ·fåás¦ô'å<úg®q¥<¢6¾Y+Äşzzˆ¡{— <şò]Çi…-nKıæ7»×Úóˆ\Wxi>(ŸÌ8 çtôølè©æ†Qh˜í a<™õñÉÀ>”sï0ûüüi…òûã†cæYéz.‚ş
Íÿ/¤ZQ)¾DB¯8á¼p÷GŸuÛÈ+Š°ï‡Û2
ÊÿÂŞ,8m¾07Ğ±lİÿªİÏª¦õ‡"oTAâ1úÇ†ºjÓ8OZ†½1eö•&÷|LÆdìmÇOUQŠØ^2¢
§u6*òôcîg]^aï-(Y»‰Œôö3õªïÛÆ³ƒìûkÙ~¥ùXRï·ÌÓ"">}&ôt&Ûp:’Ğ?îÊ¥÷Qè•²ù4F BÌäz–¼§äAÔí½…íÖ$£ÑÀË×G é:+MŞä(dÛß™k; &®øzÖ;cO-W·ßw3ÛãŒ–Í nsº=Æ¥æ‘»(2SÏ@/A±7.ı…Øº(ìARR-%RîšÿÎã92ÿmØ¿J”Á´ÅJ Xšê¯0ğÕÈ3“‚ğUL¨~EĞê¹.öÿÄEOªU“V™4J+~Zúq\ÆF$ê/Ÿ—>uà¯¬ö¤GÙ“2ÎÌH¨t»–›+ú§‚
âPo0RÄnƒĞJõòÇî \‰a%–jht8EÚ	Ò•[Øè¾·+2v!â«Şö;:AWÔ;‹9WÑºSTHş!ºÖZEğ1ÖS©íæe«œÌQİókGˆ€+J‡ø„~g°Å3cĞó”6Ğ@±ú¤"tAÆ«Ó7äQ_ø¡Ìc+$ ºğêe@Lz¡fäd§|×”¸>v4
’Üêì³jÖMà'C²ïßk'qõ
F‰ÕŒ!ï¾<Ò¸œVğn+ÓYD‰õu™óíòV¶úi:Æ,µÄê¨ElU€¤4üÛ@:æ¨U‚|ŠNFn?åßŠ ôúP“ãdtÆo_g£Ho-:~AQ¶Húï’æ'ö{ï3Øv¾QSg×óXªVÇ'|œU×ø3 'Şlcféaú@Mş}ù®u´+7ë“O3ÑÙ*%'ÖI_/W ›.ıˆrù…òíÇ²>8ïÄ7¡÷8 I·O‘÷Üí-\ù™I<BÓ²n•?H›µ`“.^œ©`İ‰z_‹FĞ}vĞ uP ÂoxmD9"6LB3š‡ñC®µÇJOìÿ¸guaèƒAF/J—/6ëk²&˜îµºy‘.Å1gO"kClf–§„²LÓP3îï·¸"{\/ä)ı²ı÷ÓÊ4(ZÁóáz
¶µƒÊDV¹ûõb t(áŸç³òYzÀfŞ.È[åªâÂ«é¨é€©=cóÅ° €ÜåCÚùœr @px0¶òRóÚzªÛuh_‘ÉsİúÎ†ÙüÏi7öK„G9õDk¾ïÆ9@“¯5·o§8uã!·ÙÍViÜ=¥Å¼Å	†ŒTÇ H'Û…‰ŒhlëçSmN[Å®³É±D@†9\St±¶Æ'•/“ùeT„Ï*ØìCÏ0¯ée^ö}Œñ»¾"JY»uÛ1ÚÁ!÷0x~²ÆV?¨"ŸâÈI’$n{¬àó^ÆeMıW+.º³)áZ™MØÒµ‡)í‚–Iº<Tòı ä–,¨ÀÍ„ù#íI"ˆS^EûHsÕŠ‚¨³Ëî[~è9‹›e¡ÏãÄØÛêqúöW éEÑ‚ÈRz¹ÎÂ¾@ºálòrW¼±¦Ï'î;Â ‹Úël
¡-²¤eâš™§“Î¨“,pûK@ó_ƒËv“oÓ<Äd¬U÷|rµÚrfî“¾´,ÃOB`ı$ıÕµ:úäVóÇ/REŞ–÷s"“÷PaÎ“ğÖtÖÉì¿k…Áóá•·µ´Ù‚ÇÊ ÑHSM Fìš Wğ¬rñ§G9˜ÏøøÃ¦0jÇ/9²V²º¥éÃë½{¦Á\u`‹ÆkvZBJqĞ¦{G,'}ƒä~òƒeØĞ²ƒ8ÿ­ñL¯Gä×`‹:ƒ:ÍUv9ä7Ğ[¯1÷[^·ö)Ö˜âxß%`kÓ½[ü
¶w
½§à¸Û"àSRÎÿÄdğƒPÅRß•jÏK‹ku  šÁ/²ñìQá[Ï‹ï½R´;Èá¯ç¼Å÷šL)<Ç°Å3Zš6—]Éus(Eğ|‡«–T"šÊlOÔ9Eä;t+ù‡¤¸´·A¼é%ıXìrJç™3Œ¤<z’`
À{åİkWyt¯ÔlG5ZCVªßÿ1û½ fŒ7B9JüX¹ëô§/‹¢¤«¬£»‡ZLÅªCñè`8y²ì\Ş˜ËïôlÌy)„¬á#ß 	ËÃ…Õ«—_+äVKª«ïFàY†®œ"¼>†KvÃ7ß0-ñøÚú\ıcnMÓ^mÛ¶mÛ¶İ§mÛ¶mÛ¶Ó¶yÚ6¿ûy'&b¾‰ØõkG)32seEåª¬ş¯—nÏë–»5´<F°¼‰ã>mº¼ıØ‰D|‚V^ş—v|T)Ç¡^¹7ÌJ°±;˜Cùs°zxÒFb0‘_™ÖŒxû¯É	^è˜›‡yWôÔİWŠ"İ­Às>­È¦M2 Üşµ™•€ èâ»J76ÜÃØ{;º|I\LS£&ffzÖ
ºt5æ6d+16Ôß"3
A‰<ï)Öœ±ÕV£P‚ñxL[+êa†ÁıÆL	 `+ğ?<Ä%”ÍIg2eˆüûŸ
ANú‡¯šĞ?r×ŞÌ¥ìØ¼³ ÁB^ş¥ÿÓ/òzL6Í¨€  ÊüÂí“0qvò °îeeWiT_¾eß¿ëz €l]¶¤¾üC™ *ä‰ş. ÈC÷q!Ş 0Juˆˆe*£ÛµŞ#%–^‰ã‚©,T8àŠWsCLE?ãUŠ‚am\ŒIğ7<SÅµJ…îà¼Pğ°º:‘×[y! rø$úĞ(‹ÀP/Ò"±Ä9<Ö3€Ì(Aì–_`­`øÙÙX8â£i«¦³Òú’ì;›ºrML3€°WxÃ¢¬éX±›Ìíƒ[ €yB¶wîSˆÀÒœªÙ…|œã–6 ‹2£°àQZšŞ#	 Ğ¾giWxÅ8Ÿïñ=âäW¿Nñ;ŠL8¶=ÒL+è_FCOnvÔhûŠÊ@p‘Í¿Íƒ©å*íœ|MÌÆ¿ –“¶¼nÎİ¿“Îº£¾RÙ¥OŞ¥
\cûÚş]–m¦qàV³ Ä¹LçgKH“ `´‚³ÍÉ;Œ@Kÿ.	#Ö‰` &xs^;¾¡e)2“Áhß–ÕªU‚€ƒßÂcQ ‹ä8E@ŞÁ“äjŒtÜ¾`o×<$ûµß‚„Šfx|q«±ÁC_!mÌ‘Šõ9»
íòäü­Î:#×•RÔˆøÙ§OFjlJ2@&Šâß–?)‰!Â´àÉ”|ê¨‹n	ó×E;ªoÁûRà(XÃ§]jzç]bDeÉ†•¼BÎÅÅcŠK¾4ÒæœöY–¸!!yböºó×XDµRğ+‘Æiƒ«®P0ÓjõGŸ$Yõ×èhğwD şŒä‚²í«è3Õ2‘IJ‚d[hvQí‘ï‡÷=é¡4y!äÄ²h”´ôp=ôø¹eÓO	§âğó=a•‡u—âüv¯Âğ kÈÌğ¥h"î=,×åĞ³½îÿù+ˆºy&v0ùÄIO‹E°Ò©s!^³È2pG¶^™—ÖãXØ<şéİõ…½t`§7"Î+j=‰A ”A˜ÂÃIpå5WP ·`u¨ø¶#Ü}ÀL
º-N·™ìà ©ƒjŞpàT6â-êD4§Ê9ßéöçÊZà¸ş›½%qĞÉlÒz ¶7­İ¡¡`l>’hH19T*›,ËñëÙ‰ÌıdÊüÛè}—±‚ß÷öbûÀÚJ¸¦ÊŸez|=÷ãv˜bóÑşæuhV¿ÜL÷óV/¹Ë¬hË4|–~É\Â_óÅµ§YPòÆupwÂPÜRô¿ø¹$âã8wqà}ßÙÅ+6Øº7ÄM37ú#$²ŒÏT3Œ]ó^1À©À¤Qk7T·¶A¹c¥àJÂ»ûüßÃËBÙ4rĞÚ“)Pşÿ“éÏíWCT?›€m¤X?€doöä>EÊw á! XuN  hû  ÿ…†Ö  ,) 0öŸ:Èº%üqT§Ø[´şÙûúG	 ò^‰˜lú·-`ß²ç€¦PŠ r_½ ğ¨¸3;Çcù  ùè¸{¹ùÍ°¨‘š2ƒvdš¯iaÙ¥€ò»ß°ßÅ'4&fpÀëØLÍ\3^õÅÙá èaãÓŠø
…£_N­‚ÜÀn¢İ†dP„Ù€$1t†h¿.¼&İŠ$‰˜ÇÄÑ~Uh(¯‹	À#>y*qÑÂRÀ!3ğÅİçD†kÌéš]Où _\#Ãæ ¬T4O6r½:§¬½…úºf §^¯.Ñ	hÛ
	
%.~oÿOl‡×1yC$ÂÈKü_³Ôî˜=í¼–ùmåÿí´3ºrn8ÉwÎ6z\ïH“’ø»ĞWµ>Ü¤7ÊYÔ_K=Î õÿŠŸ¾}Fç¿N®cRYº_ËwU·{ÈıXÙ/	ÿ‹A€&Ì_ó5ÄçXKŒÖ7¥éfş×­E 6*Û €çÒd­‚ı£J.f¢¢f&B@Äp£xğïû©këiúÔE&Ur³i'p~¨›ê<A"72$k½N’nÒï®p:jÑ”ApÈ×ËĞ	ï-•}Òq¦=
ßHSNÒì‡ƒ§>Zç%÷fÖÆ715‘§ÕNó¥ü ¦‘¨˜Îwo³µ£g°“÷?AG¦2xo87Ô ‚€xØ?±“7ÿö
sÿ~L±4\V¯ÔîYÿÁğÒ` €…²eåàÓ"SşÇËQ§r«å— š~6 ÚÒ÷ÿáÒÀÛü$§÷ÃBÿWY}t¡Ú Èº¯	şOF)> À|  „ @š ò pl“äÓšô-ûÛ úíœğçü\s¤èïTüÙŠl3y§H:Í_Æ @•¬¶ê,œuY»B‚Û¦™ 9¾À	»E¨¼
8îït_…V.ôu¾_;
i+ >Ëw«ŞjÙb9TJè9Q_ßäsn­±ËÿVÁÀ©l ^ ËH3”û	ÛÆğ¨ÏÀW´TR(	Ná‘êl@É©DÏŒ6Ó¨êÅKFİ•¸ÿÏ¾Tx³‚‰õíÚ  `¿™¯”¶Ğ­Á LÉ÷…UœäT(R€„Š*¯çGH¦‹:s*ÔÉ“v¨ù™ï+¡ª“+GbZ…Šf}}ÄI’§`2Åç]îq»5V-´Û§93BwàQvŸbosWİ¤oğYì·­ k ZVoğÌÙH³5ÛÉåÌÏt^Ğ!zñ§{>~«Âî”TüSGÅ(GèFĞDÊ²)Ûõí™!	2ß·“Í˜í5ŞšÛ%&og6:ê LİCwˆ9uH!TŸ7à¥/äŒ‘viÍÄyyÖäş¸Xâ ¬İá16ãÁ/|qè/BK[ézÉÑøñ>Tì aâw“İ¢æöz÷?­Cä
½¸áV=2Âd™|‹¦S6¾OÅÎ¾GF'&W ƒ 0ûäb°ùÓÿ]æmJ(ÛVî ¡”\åÿ®²')©©8ÍÖ*İ6vn@—9pMå@mˆú³ˆO3ü-pÌ‹ÈáşJ•=ìY$ğcÙ5 «ºÎYŞEÔ“‘ ¹it¼ëåz8{Ïº|·µXÑœC·ØÆa{èëZágª•ÄÅˆğÏ ¤"+Ÿ¼kYb¢ïVÉ21xQ-|ˆøçñÖVJ?îlãüe¯Vş‹wYöSª¯z€?xE‘ê^İ\Á§f¯¼ÕrœÁ7
„ñ,éæ]æ¬êŞàVÏTğı M"ò–k?ó©0M_™kËŸÌ˜tØ¥ãO²š5h•Uâ4ØG ¡æ ˜t±·å V4§HÈm_q´:Ìi‘ˆ`p7T³7Y‚§2rDĞÎŠD·àÀ"İ·/g¸¦´+ƒŠ³oƒúfL~´b]÷¡IÛ¾²[TfÌ¸¾òÀU‹R¼dÈ‚RoÜU†í–©…¿S¯á\ºè¦‰lîÎq³·ì¹íhf’!Ì¥klõ0øÇÂ!qMÎ9¯ÎÄÖ]È"yŒK6fÁÏI˜pîmTC«zmØo–?pŞtº‹($Œt÷¾“ç“ô‰F3›ÙåË) KO,nŒz*¨'¼Ø±¬ÔÁN:=‹ßJ´« ×úµ> ¨Nï¤ÃÎMà—eøk¼é‘Hú³‹RƒÛÏbÉÎLë.ñÎ™?À6%Õéé©/Ns¯İ€¬ÙX
Bl³œÙ¤83l>ûEÍ¿8wQÃèF ¢ÎÇèzí	oAìÈ8
«wLgÜàİåòq<Ìzø-İï7:KäR	hHÏóê·æŸÚOqe`C	EÃœ3h÷b ¾BA µ1?æ½Û€Ñs1Ëé.“lHºæÁ{WmÔF¾n;D¡ĞT%V{&qÇÌIp×_Ğ'€ğ9W-ãùh%Ã¨ÕVdÛ.u¿³ö~ĞMÖ†ä­BF¡”Ê&ıå3‘¿8ë9Õ¨?¸¹P
c`^
Æ‹tÂÇ”8£-•6ÉÔ$Î?•>ŞÉl9Ç±²ôß'AÔ¼mò¨ô¼o9|Î§>9Ü·+¶¡ì·î5¯èE÷†´ }£­{	í~aåß½”ùê‡B¥@?Ê‚¶ÙÕ¤"aç,‰dÏ)†©4°­òyß£¦½6îûp´C©RB„ŸKÿã4|ñ÷2€=£Pø Şt¹ ‡ÍãBÎ>ò -µ=wÅ°Lôwàç”ïù:¼ÿb½#W ]¾ïg@Ã—ÚC2 F!*`ÜVªÌg	i¡	b®Ö^õÛÇô†Ùbg”‹„$ué÷ÙTÏÅ\ï pö»Û–ŠÙg¾­Ì‰f4Ô« z‰ÂfÃ·¯„¡ÒRfò¡Äê&ğúSù,q,ÛâG~çfáîÒ°0¼!ÊO™—™¢^qsêáÉÒæ,i`Âº{Nê(ow¿ø:ü¼‹öíXíU¨K-D÷wÿØÛğoÅ.©%HİÈ!fs^kGôr™VºLÛ×WÔJï*ıÍg—õ¼ÌÇ‘<2Tã4Y{Ì	Œq,{T
Â¬L(!ë@2Ä-gG¢…6ú4D÷I n½OÒ'G$qqà6+¼ãvŞÀp•ØRóµ:×;»¹"‚I4½îâ]1Ï9WéÕ4eÅ¨Ì¹ˆlbãX	Ü:ÜÑ®%½{;«ğ5Ÿô—}œİ¾£ôôDZØa¡:ÆLåúlJâ¥}Ûì\5ÎË
ÂÔã$_£šxÈc°8„»•ğõZÄ4zÄQRÆ”-"œéÄ2ëäbdÌi2ÅOGwD$ÃW$ˆ~À¤/pI.ò-È'şješ½*Š/ş¨íÔ{ÓÎlĞ?”¶*ÔÓV'Š:°ıì¿fr0c¶Ô7L"­†#ÍÄgc<I-£ÙüÆ„·àÂÀñ”,Ë„A†•Q~B]"qİÌ°ìAPº¢¸Z ûë?ƒVŸ2b92uÚ€Æ.FyNyœáï6r½3±¯K¸Ôìzl!r›7yD¢¸k˜o¾Ê6ŒÁ2á«“…Åëˆõpi~Š÷w–¼`q´mívD‘ì3wÛÿŠnjÓs(Ò\êO—b{àÕ„ƒöÀĞ/ªÈ+…)MFq¹ÉSS/PHyÏ¥×fÜ,ú¢å+Î¥04i\Ÿ;ö®/¿¡õ‰ˆ¡ÃÊ-_ô|Ÿ¤³İ·E”N¾ÛÆ»uşÎ/œ{÷Æïï¤F«|.mluØNYT‡”Æ'ôŠ9ò‰j‘õFzÉ‚Õ·‡+~Ö’ÍùÿÑÆék¹­
èñ_ÔBBI¶§]bçg\Œsír¤oOEöOIù
ä;F5¦UK J•8ÒÔQ\ö;Æ„ïúÛe(İ 5‰Ï¼»¬IÜÁiLØl ‰œvK…:Äš>ı~Jç*jªMŠJ¢İ=±auÛÆÍæ°ZMì¬”S¸ş5áhºB¯Yû/ÄLj<øá˜ şá¿	;º^Ş„Sz=‚˜p‚Y	üĞ‚­l¡f¶ã:³µqÇ‚IeÄ¼{Å´Õ©1|ÉõœÅ0'¯E“I¨è¹¡ÏòæÂÖWfÃHRÊ]¤å“ÏÜw4•ÛFx­ìºJ,7åfØ<˜ËèğU1ô0@?¶yZÊ¼xNøJü5Ÿç8ãòØfp²ô.ãlDÛD£ñ½	›ÖEkŞ&YËäñä’ `Ğ±ÆÕ²%ã×¼Øæúš[N”?‘”'iß´Ö«¯ÿzôñ*”>}{ïŒ~l
·¯\‘rÃîw“Ù§ ‹£Y7åƒZ±ñ¢YFşÍ € Nˆ"¦TP•È+¹–aJùVÒ,!¢Z‘¦wÚ<×[œp0u8ù§—ÃDV~\êFÁöÂ‘MM~Ì @š”ßGµªÙÊ«Z3z °~Ğœ
aƒB—G¬E!XğÚr%°'ÛD¬O´+ï(0Eq†p GQåı«lƒ=ªıcõó%agãÿA&áew›Ğñ²‘ƒ¶RFË"níUŠ­v!³Ø¯:½¶íµp²âp+E1tíF®‘Ò2Wë©;n@®†`ÄOòœ¿Ûı*AäHHó*ö 
Qãå6Êõ+îR~4TIFoy³»1?rÉ»Ò‚S´ÿÍ¯ÍAdy QÃÉZÓß$3zíFúû¤ª“˜³g•…©j™òş„ï@j}Y€ŒÎ:Û¯~D¿B%ÔHÿ JÏ£Ç =è|bıŸ¤°b–ÙñÄ•gQ‰y•‡|^ënÄ%`|#NİÄ`¾:	,Üpe4 ºq§‹nRñ]nùI?ûŞÉ§õÎ9ĞÙ‡89”G9¥Öâƒ’Ó¶ãŒÿÁhÂS]2JùTÚÅÑ eÜSa,#’É
ÁŒÔ:GŒ‚€´SÜ<Ú…Áa÷Ìù¡q#1ÜR­ÁCsÔ‰=äEiCh6A·³‰«8XMş"9¥pº»(7Ñ¢¢ê â³+5U#ìA“®À1l®¡øıü:lA,ş¾QyÉ1l°4Š8ïÔåP6Aı]ø¦|¦ïóš6¤+‹"¸÷ša÷±„¹ÈV¨ç=ø³tŸ! @S   ¯ ”÷š}0eş/ABº½
x‚jûÛü*•sÿÛ§H_¸î³œ^õf¶¿ƒKÅËvè‚îE©+øMnôæZâÔ¦µr
I°r¡û¨ñêƒògŞÈ8ßkDsÚo‡!Á†˜¹İ»Ö†‰ )L@ÈØù¢.eP)çîî	…)¢j[şÛ k÷(İÁZ¶ ëõX«7'V¶iÏªq—mÓK±}šÎ/kÁ>Ë5!Äø5&;r¼îtŒi·?\S¦Ë’`	ûH­‹ñÈ¹×Q—GÛştèbz]óÛn[G“C÷sÑ°C¬äÓ¾3ajO	˜©ŠûJxQœëÀÄ…É=ñK­â+•CUó 4Ú$-:4“Âs©ÌL„6 ´w,ùiä.§³pn, but different
	 * source/name/original line and column the same. Useful when searching for a
	 * mapping with a stubbed out mapping.
	 */
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0 || onlyCompareGenerated) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
	
	function strcmp(aStr1, aStr2) {
	  if (aStr1 === aStr2) {
	    return 0;
	  }
	
	  if (aStr1 === null) {
	    return 1; // aStr2 !== null
	  }
	
	  if (aStr2 === null) {
	    return -1; // aStr1 !== null
	  }
	
	  if (aStr1 > aStr2) {
	    return 1;
	  }
	
	  return -1;
	}
	
	/**
	 * Comparator between two mappings with inflated source and name strings where
	 * the generated positions are compared.
	 */
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
	
	/**
	 * Strip any JSON XSSI avoidance prefix from the string (as documented
	 * in the source maps specification), and then parse the string as
	 * JSON.
	 */
	function parseSourceMapInput(str) {
	  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
	}
	exports.parseSourceMapInput = parseSourceMapInput;
	
	/**
	 * Compute the URL of a source given the the source root, the source's
	 * URL, and the source map's URL.
	 */
	function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
	  sourceURL = sourceURL || '';
	
	  if (sourceRoot) {
	    // This follows what Chrome does.
	    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
	      sourceRoot += '/';
	    }
	    // The spec says:
	    //   Line 4: An optional source root, useful for relocating source
	    //   files on a server or removing repeated values in the
	    //   â€œsourcesâ€ entry.  This value is prepended to the individual
	    //   entries in the â€œsourceâ€ field.
	    sourceURL = sourceRoot + sourceURL;
	  }
	
	  // Historically, SourceMapConsumer did not take the sourceMapURL as
	  // a parameter.  This mode is still somewhat supported, which is why
	  // this code block is conditional.  However, it's preferable to pass
	  // the source map URL to SourceMapConsumer, so that this function
	  // can implement the source URL resolution algorithm as outlined in
	  // the spec.  This block is basically the equivalent of:
	  //    new URL(sourceURL, sourceMapURL).toString()
	  // ... except it avoids using URL, which wasn't available in the
	  // older releases of node still supported by this library.
	  //
	  // The spec says:
	  //   If the sources are not absolute URLs after prepending of the
	  //   â€œsourceRootâ€, the sources are resolved relative to the
	  //   SourceMap (like resolving script src in a html document).
	  if (sourceMapURL) {
	    var parsed = urlParse(sourceMapURL);
	    if (!parsed) {
	      throw new Error("sourceMapURL could not be parsed");
	    }
	    if (parsed.path) {
	      // Strip the last path component, but keep the "/".
	      var index = parsed.path.lastIndexOf('/');
	      if (index >= 0) {
	        parsed.path = parsed.path.substring(0, index + 1);
	      }
	    }
	    sourceURL = join(urlGenerate(parsed), sourceURL);
	  }
	
	  return normalize(sourceURL);
	}
	exports.computeSourceURL = computeSourceURL;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	var has = Object.prototype.hasOwnProperty;
	var hasNativeMap = typeof Map !== "undefined";
	
	/**
	 * A data structure which is a combination of an array and a set. Adding a new
	 * member is O(1), testing for membership is O(1), and finding the index of an
	 * element is O(1). Removing elements from the set is not supported. Only
	 * strings are supported for membership.
	 */
	function ArraySet() {
	  this._array = [];
	  this._set = hasNativeMap ? new Map() : Object.create(null);
	}
	
	/**
	 * Static method for creating ArraySet instances from an existing array.
	 */
	ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	  var set = new ArraySet();
	  for (var i = 0, len = aArray.length; i < len; i++) {
	    set.add(aArray[i], aAllowDuplicates);
	  }
	  return set;
	};
	
	/**
	 * Return how many unique items are in this ArraySet. If duplicates have been
	 * added, than those do not count towards the size.
	 *
	 * @returns Number
	 */
	ArraySet.prototype.size = function ArraySet_size() {
	  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
	};
	
	/**
	 * Add the given string to this set.
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
	  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
	  var idx = this._array.length;
	  if (!isDuplicate || aAllowDuplicates) {
	    this._array.push(aStr);
	  }
	  if (!isDuplicate) {
	    if (hasNativeMap) {
	      this._set.set(aStr, idx);
	    } else {
	      this._set[sStr] = idx;
	    }
	  }
	};
	
	/**
	 * Is the given string a member of this set?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.has = function ArraySet_has(aStr) {
	  if (hasNativeMap) {
	    return this._set.has(aStr);
	  } else {
	    var sStr = util.toSetString(aStr);
	    return has.call(this._set, sStr);
	  }
	};
	
	/**
	 * What is the index of the given string in the array?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	  if (hasNativeMap) {
	    var idx = this._set.get(aStr);
	    if (idx >= 0) {
	        return idx;
	    }
	  } else {
	    var sStr = util.toSetString(aStr);
	    if (has.call(this._set, sStr)) {
	      return this._set[sStr];
	    }
	  }
	
	  throw new Error('"' + aStr + '" is not in the set.');
	};
	
	/**
	 * What is the element at the given index?
	 *
	 * @param Number aIdx
	 */
	ArraySet.prototype.at = function ArraySet_at(aIdx) {
	  if (aIdx >= 0 && aIdx < this._array.length) {
	    return this._array[aIdx];
	  }
	  throw new Error('No element indexed by ' + aIdx);
	};
	
	/**
	 * Returns the array representation of this set (which has the proper indices
	 * indicated by indexOf). Note that this is a copy of the internal array used
	 * for storing the members so that no one can mess with internal state.
	 */
	ArraySet.prototype.toArray = function ArraySet_toArray() {
	  return this._array.slice();
	};
	
	exports.ArraySet = ArraySet;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2014 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	
	/**
	 * Determine whether mappingB is after mappingA with respect to generated
	 * position.
	 */
	function generatedPositionAfter(mappingA, mappingB) {
	  // Optimized for most common case
	  var lineA = mappingA.generatedLine;
	  var lineB = mappingB.generatedLine;
	  var columnA = mappingA.generatedColumn;
	  var columnB = mappingB.generatedColumn;
	  return lineB > lineA || lineB == lineA && columnB >= columnA ||
	         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
	}
	
	/**
	 * A data structure to provide a sorted view of accumulated mappings in a
	 * performance conscious manner. It trades a neglibable overhead in general
	 * case for a large speedup in case of mappings being added in order.
	 */
	function MappingList() {
	  this._array = [];
	  this._sorted = true;
	  // Serves as infimum
	  this._last = {generatedLine: -1, generatedColumn: 0};
	}
	
	/**
	 * Iterate through internal items. This method takes the same arguments that
	 * `Array.prototype.forEach` takes.
	 *
	 * NOTE: The order of the mappings is NOT guaranteed.
	 */
	MappingList.prototype.unsortedForEach =
	  function MappingList_forEach(aCallback, aThisArg) {
	    this._array.forEach(aCallback, aThisArg);
	  };
	
	/**
	 * Add the given source mapping.
	 *
	 * @param Object aMapping
	 */
	MappingList.prototype.add = function MappingList_add(aMapping) {
	  if (generatedPositionAfter(this._last, aMapping)) {
	    this._last = aMapping;
	    this._array.push(aMapping);
	  } else {
	    this._sorted = false;
	    this._array.push(aMapping);
	  }
	};
	
	/**
	 * Returns the flat, sorted array of mappings. The mappings are sorted by
	 * generated position.
	 *
	 * WARNING: This method returns internal data without copying, for
	 * performance. The return value must NOT be mutated, and should be treated as
	 * an immutable borrow. If you want to take ownership, you must make your own
	 * copy.
	 */
	MappingList.prototype.toArray = function MappingList_toArray() {
	  if (!this._sorted) {
	    this._array.sort(util.compareByGeneratedPositionsInflated);
	    this._sorted = true;
	  }
	  return this._array;
	};
	
	exports.MappingList = MappingList;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	var binarySearch = __webpack_require__(8);
	var ArraySet = __webpack_require__(5).ArraySet;
	var base64VLQ = __webpack_require__(2);
	var quickSort = __webpack_require__(9).quickSort;
	
	function SourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  return sourceMap.sections != null
	    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
	    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
	}
	
	SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
	  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
	}
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	SourceMapConsumer.prototype._version = 3;
	
	// `__generatedMappings` and `__originalMappings` are arrays that hold the
	// parsed mapping coordinates from the source map's "mappings" attribute. They
	// are lazily instantiated, accessed via the `_generatedMappings` and
	// `_originalMappings` getters respectively, and we only parse the mappings
	// and create these arrays once queried for a source location. We jump through
	// these hoops because there can be many thousands of mappings, and parsing
	// them is expensive, so we only want to do it if we must.
	//
	// Each object in the arrays is of the form:
	//
	//     {
	//       generatedLine: The line number in the generated code,
	//       generatedColumn: The column number in the generated code,
	//       source: The path to the original source file that generated this
	//               chunk of code,
	//       originalLine: The line number in the original source that
	//                     corresponds to this chunk of generated code,
	//       originalColumn: The column number in the original source that
	//                       corresponds to this chunk of generated code,
	//       name: The name of the original symbol which generated this chunk of
	//             code.
	//     }
	//
	// All properties except for `generatedLine` and `generatedColumn` can be
	// `null`.
	//
	// `_generatedMappings` is ordered by the generated positions.
	//
	// `_originalMappings` is ordered by the original positions.
	
	SourceMapConsumer.prototype.__generatedMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__generatedMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__generatedMappings;
	  }
	});
	
	SourceMapConsumer.prototype.__originalMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__originalMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__originalMappings;
	  }
	});
	
	SourceMapConsumer.prototype._charIsMappingSeparator =
	  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
	    var c = aStr.charAt(index);
	    return c === ";" || c === ",";
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	SourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    throw new Error("Subclasses must implement _parseMappings");
	  };
	
	SourceMapConsumer.GENERATED_ORDER = 1;
	SourceMapConsumer.ORIGINAL_ORDER = 2;
	
	SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
	SourceMapConsumer.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Iterate over each mapping between an original source/line/column and a
	 * generated line/column in this source map.
	 *
	 * @param Function aCallback
	 *        The function that is called with each mapping.
	 * @param Object aContext
	 *        Optional. If specified, this object will be the value of `this` every
	 *        time that `aCallback` is called.
	 * @param aOrder
	 *        Either `SourceMapConsumer.GENERATED_ORDER` or
	 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	 *        iterate over the mappings sorted by the generated file's line/column
	 *        order or the original's source/line/column order, respectively. Defaults to
	 *        `SourceMapConsumer.GENERATED_ORDER`.
	 */
	SourceMapConsumer.prototype.eachMapping =
	  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	    var context = aContext || null;
	    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
	
	    var mappings;
	    switch (order) {
	    case SourceMapConsumer.GENERATED_ORDER:
	      mappings = this._generatedMappings;
	      break;
	    case SourceMapConsumer.ORIGINAL_ORDER:
	      mappings = this._originalMappings;
	      break;
	    default:
	      throw new Error("Unknown order of iteration.");
	    }
	
	    var sourceRoot = this.sourceRoot;
	    mappings.map(function (mapping) {
	      var source = mapping.source === null ? null : this._sources.at(mapping.source);
	      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
	      return {
	        source: source,
	        generatedLine: mapping.generatedLine,
	        generatedColumn: mapping.generatedColumn,
	        originalLine: mapping.originalLine,
	        originalColumn: mapping.originalColumn,
	        name: mapping.name === null ? null : this._names.at(mapping.name)
	      };
	    }, this).forEach(aCallback, context);
	  };
	
	/**
	 * Returns all generated line and column information for the original source,
	 * line, and column provided. If no column is prn, but different
	 * source/name/original line and column the same. Useful when searching for a
	 * mapping with a stubbed out mapping.
	 */
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0 || onlyCompareGenerated) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
	
	function strcmp(aStr1, aStr2) {
	  if (aStr1 === aStr2) {
	    return 0;
	  }
	
	  if (aStr1 === null) {
	    return 1; // aStr2 !== null
	  }
	
	  if (aStr2 === null) {
	    return -1; // aStr1 !== null
	  }
	
	  if (aStr1 > aStr2) {
	    return 1;
	  }
	
	  return -1;
	}
	
	/**
	 * Comparator between two mappings with inflated source and name strings where
	 * the generated positions are compared.
	 */
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
	
	/**
	 * Strip any JSON XSSI avoidance prefix from the string (as documented
	 * in the source maps specification), and then parse the string as
	 * JSON.
	 */
	function parseSourceMapInput(str) {
	  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
	}
	exports.parseSourceMapInput = parseSourceMapInput;
	
	/**
	 * Compute the URL of a source given the the source root, the source's
	 * URL, and the source map's URL.
	 */
	function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
	  sourceURL = sourceURL || '';
	
	  if (sourceRoot) {
	    // This follows what Chrome does.
	    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
	      sourceRoot += '/';
	    }
	    // The spec says:
	    //   Line 4: An optional source root, useful for relocating source
	    //   files on a server or removing repeated values in the
	    //   â€œsourcesâ€ entry.  This value is prepended to the individual
	    //   entries in the â€œsourceâ€ field.
	    sourceURL = sourceRoot + sourceURL;
	  }
	
	  // Historically, SourceMapConsumer did not take the sourceMapURL as
	  // a parameter.  This mode is still somewhat supported, which is why
	  // this code block is conditional.  However, it's preferable to pass
	  // the source map URL to SourceMapConsumer, so that this function
	  // can implement the source URL resolution algorithm as outlined in
	  // the spec.  This block is basically the equivalent of:
	  //    new URL(sourceURL, sourceMapURL).toString()
	  // ... except it avoids using URL, which wasn't available in the
	  // older releases of node still supported by this library.
	  //
	  // The spec says:
	  //   If the sources are not absolute URLs after prepending of the
	  //   â€œsourceRootâ€, the sources are resolved relative to the
	  //   SourceMap (like resolving script src in a html document).
	  if (sourceMapURL) {
	    var parsed = urlParse(sourceMapURL);
	    if (!parsed) {
	      throw new Error("sourceMapURL could not be parsed");
	    }
	    if (parsed.path) {
	      // Strip the last path component, but keep the "/".
	      var index = parsed.path.lastIndexOf('/');
	      if (index >= 0) {
	        parsed.path = parsed.path.substring(0, index + 1);
	      }
	    }
	    sourceURL = join(urlGenerate(parsed), sourceURL);
	  }
	
	  return normalize(sourceURL);
	}
	exports.computeSourceURL = computeSourceURL;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(4);
	var has = Object.prototype.hasOwnProperty;
	var hasNativeMap = typeof Map !== "undefined";
	
	
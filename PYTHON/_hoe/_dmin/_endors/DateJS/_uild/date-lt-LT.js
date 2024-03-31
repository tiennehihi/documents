ovided, returns all mappings
	 * corresponding to a either the line we are searching for or the next
	 * closest line that has any mappings. Otherwise, returns all mappings
	 * corresponding to the given line and either the column we are searching for
	 * or the next closest column that has any offsets.
	 *
	 * The only argument is an object with the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number is 1-based.
	 *   - column: Optional. the column number in the original source.
	 *    The column number is 0-based.
	 *
	 * and an array of objects is returned, each with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *    line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *    The column number is 0-based.
	 */
	SourceMapConsumer.prototype.allGeneratedPositionsFor =
	  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
	    var line = util.getArg(aArgs, 'line');
	
	    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
	    // returns the index of the closest mapping less than the needle. By
	    // setting needle.originalColumn to 0, we thus find the last mapping for
	    // the given line, provided such a mapping exists.
	    var needle = {
	      source: util.getArg(aArgs, 'source'),
	      originalLine: line,
	      originalColumn: util.getArg(aArgs, 'column', 0)
	    };
	
	    needle.source = this._findSourceIndex(needle.source);
	    if (needle.source < 0) {
	      return [];
	    }
	
	    var mappings = [];
	
	    var index = this._findMapping(needle,
	                                  this._originalMappings,
	                                  "originalLine",
	                                  "originalColumn",
	                                  util.compareByOriginalPositions,
	                                  binarySearch.LEAST_UPPER_BOUND);
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (aArgs.column === undefined) {
	        var originalLine = mapping.originalLine;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we found. Since
	        // mappings are sorted, this is guaranteed to find all mappings for
	        // the line we found.
	        while (mapping && mapping.originalLine === originalLine) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      } else {
	        var originalColumn = mapping.originalColumn;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we were searching for.
	        // Since mappings are sorted, this is guaranteed to find all mappings for
	        // the line we are searching for.
	        while (mapping &&
	               mapping.originalLine === line &&
	               mapping.originalColumn == originalColumn) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      }
	    }
	
	    return mappings;
	  };
	
	exports.SourceMapConsumer = SourceMapConsumer;
	
	/**
	 * A BasicSourceMapConsumer instance represents a parsed source map which we can
	 * query for information about the original file positions by giving it a file
	 * position in the generated source.
	 *
	 * The first parameter is the raw source map (either as a JSON string, or
	 * already parsed to an object). According to the spec, source maps have the
	 * following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - sources: An array of URLs to the original source files.
	 *   - names: An array of identifiers which can be referrenced by individual mappings.
	 *   - sourceRoot: Optional. The URL root from which all sources are relative.
	 *   - sourcesContent: Optional. An array of contents of the original source files.
	 *   - mappings: A string of base64 VLQs which contain the actual mappings.
	 *   - file: Optional. The generated file this source map is associated with.
	 *
	 * Here is an example source map, taken from the source map spec[0]:
	 *
	 *     {
	 *       version : 3,
	 *       file: "out.js",
	 *       sourceRoot : "",
	 *       sources: ["foo.js", "bar.js"],
	 *       names: ["src", "maps", "are", "fun"],
	 *       mappings: "AA,AB;;ABCDE;"
	 *     }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	 */
	function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sources = util.getArg(sourceMap, 'sources');
	  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	  // requires the array) to play nice here.
	  var names = util.getArg(sourceMap, 'names', []);
	  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	  var mappings = util.getArg(sourceMap, 'mappings');
	  var file = util.getArg(sourceMap, 'file', null);
	
	  // Once again, Sass deviates from the spec and supplies the version as a
	  // string rather than a number, so we use loose equality checking here.
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  if (sourceRoot) {
	    sourceRoot = util.normalize(sourceRoot);
	  }
	
	  sources = sources
	    .map(String)
	    // Some source maps produce relative source paths like "./foo.js" instead of
	    // "foo.js".  Normalize these first so that future comparisons will succeed.
	    // See bugzil.la/1090768.
	    .map(util.normalize)
	    // Always ensure that absolute sources are internally stored relative to
	    // the source root, if the source root is absolute. Not doing this would
	    // be particularly problematic when the source root is a prefix of the
	    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
	    .map(function (source) {
	      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
	        ? util.relative(sourceRoot, source)
	        : source;
	    });
	
	  // Pass `true` below to allow duplicate names and sources. While source maps
	  // are intended to be compressed and deduplicated, the TypeScript compiler
	  // sometimes generates source maps with duplicates in them. See Github issue
	  // #72 and bugzil.la/889492.
	  this._names = ArraySet.fromArray(names.map(String), true);
	  this._sources = ArraySet.fromArray(sources, true);
	
	  this._absoluteSources = this._sources.toArray().map(function (s) {
	    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
	  });
	
	  this.sourceRoot = sourceRoot;
	  this.sourcesContent = sourcesContent;
	  this._mappings = mappings;
	  this._sourceMapURL = aSourceMapURL;
	  this.file = file;
	}
	
	BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
	
	/**
	 * Utility function to find the index of a source.  Returns -1 if not
	 * found.
	 */
	BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
	  var relativeSource = aSource;
	  if (this.sourceRoot != null) {
	    relativeSource = util.relative(this.sourceRoot, relativeSource);
	  }
	
	  if (this._sources.has(relativeSource)) {
	    return this._sources.indexOf(relativeSource);
	  }
	
	  // Maybe aSource is an absolute URL as returned by |sources|.  In
	  // this case we can't simply undo the transform.
	  var i;
	  for (i = 0; i < this._absoluteSources.length; ++i) {
	    if (this._absoluteSources[i] == aSource) {
	      return i;
	    }
	  }
	
	  return -1;
	};
	
	/**
	 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
	 *
	 * @param SourceMapGenerator aSourceMap
	 *        The source map that will be consumed.
	 * @param String aSourceMapURL
	 *        The URL at which the source map can be found (optional)
	 * @returns BasicSourceMapConsumer
	 */
	BasicSourceMapConsumer.fromSourceMap =
	  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
	    var smc = Object.create(BasicSourceMapConsumer.prototype);
	
	    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	    smc.sourceRoot = aSourceMap._sourceRoot;
	    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                            smc.sourceRoot);
	    smc.file = aSourceMap._file;
	    smc._sourceMapURL = aSourceMapURL;
	    smc._absoluteSources = smc._sources.toArray().map(function (s) {
	      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
	    });
	
	    // Because we are modifying the entries (by converting string sources and
	    // names to indices into the sources and names ArraySets), we have to make
	    // a copy of the entry or else bad things happen. Shared mutable state
	    // strikes again! See github issue #191.
	
	    var generatedMappings = aSourceMap._mappings.toArray().slice();
	    var destGeneratedMappings = smc.__generatedMappings = [];
	    var destOriginalMappings = smc.__originalMappings = [];
	
	    for (var i = 0, length = generatedMappings.length; i < length; i++) {
	      var srcMapping = generatedMappings[i];
	      var destMapping = new Mapping;
	      destMapping.generatedLine = srcMapping.generatedLine;
	      destMapping.generatedColumn = srcMapping.generatedColumn;
	
	      if (srcMapping.source) {
	        destMapping.source = sources.indexOf(srcMapping.source);
	        destMapping.originalLine = srcMapping.originalLine;
	        destMapping.originalColumn = srcMapping.originalColumn;
	
	        if (srcMapping.name) {
	          destMapping.name = names.indexOf(srcMapping.name);
	        }
	
	        destOriginalMappings.push(destMapping);
	      }
	
	      destGeneratedMappings.push(destMapping);
	    }
	
	    quickSort(smc.__originalMappings, util.compareByOriginalPositions);
	
	    return smc;
	  };
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	BasicSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    return this._absoluteSources.slice();
	  }
	});
	
	/**
	 * Provide the JIT with a nice shape / hidden class.
	 */
	function Mapping() {
	  this.generatedLine = 0;
	  this.generatedColumn = 0;
	  this.source = null;
	  this.originalLine = null;
	  this.originalColumn = null;
	  this.name = null;
	}
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	BasicSourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    var generatedLine = 1;
	    var previousGeneratedColumn = 0;
	    var previousOriginalLine = 0;
	    var previousOriginalColumn = 0;
	    var previousSource = 0;
	    var previousName = 0;
	    var length = aStr.length;
	    var index = 0;
	    var cachedSegments = {};
	    var temp = {};
	    var originalMappings = [];
	    var generatedMappings = [];
	    var mapping, str, segment, end, value;
	
	    while (index < length) {
	      if (aStr.charAt(index) === ';') {
	        generatedLine++;
	        index++;
	        previousGeneratedColumn = 0;
	      }
	      else if (aStr.charAt(index) === ',') {
	        index++;
	      }
	      else {
	        mapping = new Mapping();
	        mapping.generatedLine = generatedLine;
	
	        // Because each offset is encoded relative to the previous one,
	        // many segments often have the same encoding. We can exploit this
	        // fact by caching the parsed variable length fields of each segment,
	        // allowing us to avoid a second parse if we encounter the same
	        // segment again.
	        for (end = index; end < length; end++) {
	          if (this._charIsMappingSeparator(aStr, end)) {
	            break;
	          }
	        }
	        str = aStr.slice(index, end);
	
	        segment = cachedSegments[str];
	        if (segment) {
	          index += str.length;
	        } else {
	          segment = [];
	          while (index < end) {
	            base64VLQ.decode(aStr, index, temp);
	            value = temp.value;
	            index = temp.rest;
	            segment.push(value);
	          }
	
	          if (segment.length === 2) {
	            throw new Error('Found a source, but no line and column');
	          }
	
	          if (segment.length === 3) {
	            throw new Error('Found a source and line, but no column');
	          }
	
	          cachedSegments[str] = segment;
	        }
	
	        // Generated column.
	        mapping.generatedColumn = previousGeneratedColumn + segment[0];
	        previousGeneratedColumn = mapping.generatedColumn;
	
	        if (segment.length > 1) {
	          // Original source.
	          mapping.source = previousSource + segment[1];
	          previousSource += segment[1];
	
	          // Original line.
	          mapping.originalLine = previousOriginalLine + segment[2];
	          previousOriginalLine = mapping.originalLine;
	          // Lines are stored 0-based
	          mapping.originalLine += 1;
	
	          // Original column.
	          mapping.originalColumn = previousOriginalColumn + segment[3];
	          previousOriginalColumn = mapping.originalColumn;
	
	          if (segment.length > 4) {
	            // Original name.
	            mapping.name = previousName + segment[4];
	            previousName += segment[4];
	          }
	        }
	
	        generatedMappings.push(mapping);
	        if (typeof mapping.originalLine === 'number') {
	          originalMappings.push(mapping);
	        }
	      }
	    }
	
	    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
	    this.__generatedMappings = generatedMappings;
	
	    quickSort(originalMappings, util.compareByOriginalPositions);
	    this.__originalMappings = originalMappings;
	  };
	
	/**
	 * Find the mapping that best matches the hypothetical "needle" mapping that
	 * we are searching for in the given "haystack" of mappings.
	 */
	BasicSourceMapConsumer.prototype._findMapping =
	  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                         aColumnName, aComparator, aBias) {
	    // To return the position we are searching for, we must first find the
	    // mapping for the given position and then return the opposite position it
	    // points to. Because the mappings are sorted, we can use binary search to
	    // find the best mapping.
	
	    if (aNeedle[aLineName] <= 0) {
	      throw new TypeError('Line must be greater than or equal to 1, got '
	                          + aNeedle[aLineName]);
	    }
	    if (aNeedle[aColumnName] < 0) {
	      throw new TypeError('Column must be greater than or equal to 0, got '
	                          + aNeedle[aColumnName]);
	    }
	
	    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
	  };
	
	/**
	 * Compute the last column for each generated mapping. The last column is
	 * inclusive.
	 */
	BasicSourceMapConsumer.prototype.computeColumnSpans =
	  function SourceMapConsumer_computeColumnSpans() {
	    for (vovided, returns all mappings
	 * corresponding to a either the line we are searching for or the next
	 * closest line that has any mappings. Otherwise, returns all mappings
	 * corresponding to the given line and either the column we are searching for
	 * or the next closest column that has any offsets.
	 *
	 * The only argument is an object with the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number is 1-based.
	 *   - column: Optional. the column number in the original source.
	 *    The column number is 0-based.
	 *
	 * and an array of objects is returned, each with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *    line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *    The column number is 0-based.
	 */
	SourceMapConsumer.prototype.allGeneratedPositionsFor =
	  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
	    var line = util.getArg(aArgs, 'line');
	
	    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
	    // returns the index of the closest mapping less than the needle. By
	    // setting needle.originalColumn to 0, we thus find the last mapping for
	    // the given line, provided such a mapping exists.
	    var needle = {
	      source: util.getArg(aArgs, 'source'),
	      originalLine: line,
	      originalColumn: util.getArg(aArgs, 'column', 0)
	    };
	
	    needle.source = this._findSourceIndex(needle.source);
	    if (needle.source < 0) {
	      return [];
	    }
	
	    var mappings = [];
	
	    var index = this._findMapping(needle,
	                                  this._originalMappings,
	                                  "originalLine",
	                                  "originalColumn",
	                                  util.compareByOriginalPositions,
	                                  binarySearch.LEAST_UPPER_BOUND);
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (aArgs.column === undefined) {
	        var originalLine = mapping.originalLine;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we found. Since
	        // mappings are sorted, this is guaranteed to find all mappings for
	        // the line we found.
	        while (mapping && mapping.originalLine === originalLine) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      } else {
	        var originalColumn = mapping.originalColumn;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we were searching for.
	        // Since mappings are sorted, this is guaranteed to find all mappings for
	        // the line we are searching for.
	        while (mapping &&
	               mapping.originalLine === line &&
	               mapping.originalColumn == originalColumn) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      }
	    }
	
	    return mappings;
	  };
	
	exports.SourceMapConsumer = SourceMapConsumer;
	
	/**
	 * A BasicSourceMapConsumer instance represents a parsed source map which we can
	 * query for information about the original file positions by giving it a file
	 * position in the generated source.
	 *
	 * The first parameter is the raw source map (either as a JSON string, or
	 * already parsed to an object). According to the spec, source maps have the
	 * following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - sources: An array of URLs to the original source files.
	 *   - names: An array of identifiers which can be referrenced by individual mappings.
	 *   - sourceRoot: Optional. The URL root from which all sources are relative.
	 *   - sourcesContent: Optional. An array of contents of the original source files.
	 *   - mappings: A string of base64 VLQs which contain the actual mappings.
	 *   - file: Optional. The generated file this source map is associated with.
	 *
	 * Here is an example source map, taken from the source map spec[0]:
	 *
	 *     {
	 *       version : 3,
	 *       file: "out.js",
	 *       sourceRoot : "",
	 *       sources: ["foo.js", "bar.js"],
	 *       names: ["src", "maps", "are", "fun"],
	 *       mappings: "AA,AB;;ABCDE;"
	 *     }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	 */
	function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sources = util.getArg(sourceMap, 'sources');
	  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	  // requires the array) to play nice here.
	  var names = util.getArg(sourceMap, 'names', []);
	  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	  var mappings = util.getArg(sourceMap, 'mappings');
	  var file = util.getArg(sourceMap, 'file', null);
	
	  // Once again, Sass deviates from the spec and supplies the version as a
	  // string rather than a number, so we use loose equality checking here.
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  if (sourceRoot) {
	    sourceRoot = util.normalize(sourceRoot);
	  }
	
	  sources = sources
	    .map(String)
	    // Some source maps produce relative source paths like "./foo.js" instead of
	    // "foo.js".  Normalize these first so that future comparisons will succeed.
	    // See bugzil.la/1090768.
	    .map(util.normalize)
	    // Always ensure that absolute sources are internally stored relative to
	    // the source root, if the source root is absolute. Not doing this would
	    // be particularly problematic when the source root is a prefix of the
	    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
	    .map(function (source) {
	      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
	        ? util.relative(sourceRoot, source)
	        : source;
	    });
	
	  // Pass `true` below to allow duplicate names and sources. While source maps
	  // are intended to be compressed and deduplicated, the TypeScript compiler
	  // sometimes generates source maps with duplicates in them. See Github issue
	  // #72 and bugzil.la/889492.
	  this._names = ArraySet.fromArray(names.map(String), true);
	  this._sources = ArraySet.fromArray(sources, true);
	
	  this._absoluteSources = this._sources.toArray().map(function (s) {
	    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
	  });
	
	  this.sourceRoot = sourceRoot;
	  this.sourcesContent = sourcesContent;
	  this._mappings = mappings;
	  this._sourceMapURL = aSourceMapURL;
	  this.file = file;
	}
	
	BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
	
	/**
	 * Utility function to find the index of a source.  Returns -1 if not
	 * found.
	 */
	BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
	  var relativeSource = aSource;
	  if (this.sourceRoot != null) {
	    relativeSource = util.relative(this.sourceRoot, relativeSource);
	  }
	
	  if (this._sources.has(relativeSource)) {
	    return this._sources.indexOf(relativeSource);
	  }
	
	  // Maybe aSource is an absolute URL as returned by |sources|.  In
	  // this case we can't simply undo the transform.
	  var i;
	  for (i = 0; i < this._absoluteSources.length; ++i) {
	    if (this._absoluteSources[i] == aSource) {
	      return i;
	    }
	  }
	
	  return -1;
	};
	
	/**
	 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
	 *
	 * @param SourceMapGenerator aSourceMap
	 *        The source map that will be consumed.
	 * @param String aSourceMapURL
	 *        The URL at which the source map can be found (optional)
	 * @returns BasicSourceMapConsumer
	 */
	BasicSourceMapConsumer.fromSourceMap =
	  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
	    var smc = Object.create(BasicSourceMapConsumer.prototype);
	
	    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	    smc.sourceRoot = aSourceMap._sourceRoot;
	    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                            smc.sourceRoot);
	    smc.file = aSourceMap._file;
	    smc._sourceMapURL = aSourceMapURL;
	    smc._absoluteSources = smc._sources.toArray().map(function (s) {
	      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
	    });
	
	    // Because we are modifying the entries (by converting string sources and
	    // names to indices into the sources and names ArraySets), we have to make
	    // a copy of the entry or else bad things happen. Shared mutable state
	    // strikes again! See github issue #191.
	
	    var generatedMappings = aSourceMap._mappings.toArray().slice();
	    var destGeneratedMappings = smc.__generatedMappings = [];
	    var destOriginalMappings = smc.__originalMappings = [];
	
	    for (var i = 0, length = generatedMappings.length; i < length; i++) {
	      var srcMapping = generatedMappings[i];
	      var destMapping = new Mapping;
	      destMapping.generatedLine = srcMapping.generatedLine;
	      destMapping.generatedColumn = srcMapping.generatedColumn;
	
	      if (srcMapping.source) {
	        destMapping.source = sources.indexOf(srcMapping.source);
	        destMapping.originalLine = srcMapping.originalLine;
	        destMapping.originalColumn = srcMapping.originalColumn;
	
	        if (srcMapping.name) {
	          destMapping.name = names.indexOf(srcMapping.name);
	        }
	
	        destOriginalMappings.push(destMapping);
	      }
	
	      destGeneratedMappings.push(destMapping);
	    }
	
	    quickSort(smc.__originalMappings, util.compareByOriginalPositions);
	
	    return smc;
	  };
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	BasicSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    return this._absoluteSources.slice();
	  }
	});
	
	/**
	 * Provide the JIT with a nice shape / hidden class.
	 */
	function Mapping() {
	  this.generatedLine = 0;
	  this.generatedColumn = 0;
	  this.source = null;
	  this.originalLine = null;
	  this.originalColumn = null;
	  this.name = null;
	}
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	BasicSourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    var generatedLine = 1;
	    var previousGeneratedColumn = 0;
	    var previousOriginalLine = 0;
	    var previousOriginalColumn = 0;
	    var previousSource = 0;
	    var previousName = 0;
	    var length = aStr.length;
	    var index = 0;
	    var cachedSegments = {};
	    var temp = {};
	    var originalMappings = [];
	    var generatedMappings = [];
	    var mapping, str, segment, end, value;
	
	    while (index < length) {
	      if (aStr.charAt(index) === ';') {
	        generatedLine++;
	        index++;
	        previousGeneratedColumn = 0;
	      }
	      else if (aStr.charAt(index) === ',') {
	        index++;
	      }
	      else {
	        mapping = new Mapping();
	        mapping.generatedLine = generatedLine;
	
	        // Because each offset is encoded relative to the previous one,
	        // many segments often have the same encoding. We can exploit this
	        // fact by caching the parsed variable length fields of each segment,
	        // allowing us to avoid a second parse if we encounter the same
	        // segment again.
	        for (end = index; end < length; end++) {
	          if (this._charIsMappingSeparator(aStr, end)) {
	            break;
	          }
	        }
	        str = aStr.slice(index, end);
	
	        segment = cachedSegments[str];
	        if (segment) {
	          index += str.length;
	        } else {
	          segment = [];
	          while (index < end) {
	            base64VLQ.decode(aStr, index, temp);
	            value = temp.value;
	            index = temp.rest;
	            segment.push(value);
	          }
	
	          if (segment.length === 2) {
	            throw new Error('Found a source, but no line and column');
	          }
	
	          if (segment.length === 3) {
	            throw new Error('Found a source and line, but no column');
	          }
	
	          cachedSegments[str] = segment;
	        }
	
	        // Generated column.
	        mapping.generatedColumn = previousGeneratedColumn + segment[0];
	        previousGeneratedColumn = mapping.generatedColumn;
	
	        if (segment.length > 1) {
	          // Original source.
	          mapping.source = previousSource + segment[1];
	          previousSource += segment[1];
	
	          // Original line.
	          mapping.originalLine = previousOriginalLine + segment[2];
	          previousOriginalLine = mapping.originalLine;
	          // Lines are stored 0-based
	          mapping.originalLine += 1;
	
	          // Original column.
	          mapping.originalColumn = previousOriginalColumn + segment[3];
	          previousOriginalColumn = mapping.originalColumn;
	
	          if (segment.length > 4) {
	            // Original name.
	            mapping.name = previousName + segment[4];
	            previousName += segment[4];
	          }
	        }
	
	        generatedMappings.push(mapping);
	        if (typeof mapping.originalLine === 'number') {
	          originalMappings.push(mapping);
	        }
	      }
	    }
	
	    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
	    this.__generatedMappings = generatedMappings;
	
	    quickSort(originalMappings, util.compareByOriginalPositions);
	    this.__originalMappings = originalMappings;
	  };
	
	/**
	 * Find the mapping that best matches the hypothetical "needle" mapping that
	 * we are searching for in the given "haystack" of mappings.
	 */
	BasicSourceMapConsumer.prototype._findMapping =
	  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                         aColumnName, aComparator, aBias) {
	    // To return the position we are searching for, we must first find the
	    // mapping for the given position and then return the opposite position it
	    // points to. Because the mappings are sorted, we can use binary search to
	    // find the best mapping.
	
	    if (aNeedle[aLineName] <= 0) {
	      throw new TypeError('Line must be greater than or equal to 1, got '
	                          + aNeedle[aLineName]);
	    }
	    if (aNeedle[aColumnName] < 0) {
	      throw new TypeError('Column must be greater than or equal to 0, got '
	                          + aNeedle[aColumnName]);
	    }
	
	    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
	  };
	
	/**
	 * Compute the last column for each generated mapping. The last column is
	 * inclusive.
	 */
	BasicSourceMapConsumer.prototype.computeColumnSpans =
	  function SourceMapConsumer_computeColumnSpans() {
	    for (v{"version":3,"file":"assert-valid-pattern.d.ts","sourceRoot":"","sources":["../../src/assert-valid-pattern.ts"],"names":[],"mappings":"AACA,eAAO,MAAM,kBAAkB,EAAE,CAAC,OAAO,EAAE,GAAG,KAAK,IAUlD,CAAA"}                                                                                                                                                                                                                                                                                                                         Ùƒ¸¯˜¡ ÑnÁ•#!\≥îÉo)vB6ggﬁw¥Ø.˚Ã6±7πÒœM∏0Ó»{3q›IX ‚ì[Ræé!V¯tˆ°¯ÙädåßËJS¶vöâóx.ùˇBé««‹H≥8%G˘öWÏ˝eg†Ç5Ô¥Eâ-≥FÄªkÎ»ı‘‰≈ﬁÜÊŒe<<Ïãì≥⁄ÚﬂC ≥S∞#.€Ù·Z≤1π°ñπ‘Ÿ¿}e7∆x>«&…9`(PÍX7Ö∞Õ´? ÷EﬂiÿúO›€∆æä+á≈⁄ÈGxà{ˇÖk`«ÒÃé©oW*}od™ÚASsgw„1%Ωÿ¬∫ÔπOb¿‘!xZ≈K‰,GOÉ‹ùﬂÏçEœEõ¶'2¸Æ…Ë4 †≤HÛ(¡3Æƒ^™Ë.¢ãaà!™∞⁄E@*˚¥E⁄âAÑ~cÂ0Bì¡ÆÈÌ Æ!”Â« 5øÌ/≥Ym±¢Ì≈qfie›{œÅG Û)—Ìí‡Z∏ù˙Àôô•*…Q^$}ú	É˚`}âÊ„ìÓ¡*E`g©ƒx>Ç˝ã±éù∫–ÛK:˚âº˛€æ ,–ÊÓ◊‰ÙE,sjŒZ”‚Z[QPáüße»Aº(¨·cÆQıÀn:z2óÄ∏a„åAò¬˘°n˛îóWBŒ’]·HâáYÓƒPˇHiΩÒ°-åç\°L1πBQ=Øö-ÿ]˜¶Ÿ¥h¢ÀN≠DÖ≈ˆ?Œ*Ê≤ÀÕN]+Ëlÿi9Ñ´Br]Q\Ùh	ü‚(ZM≠É(÷b˛
aë\Œk∞»(EJÃ"˝Mı†£Ár‰ŸîUL˙ê‚!Á¶;tÉ~ˆﬁÌ»–PéÃ∫ÀB‰Ók˘›8vpf¬0í∏•fRs6úÎıæ¡ÔÑW∑CÎs≠îüq≠u}˚…Ë%ë|ZUê9ÓÜEÄª
É~àÙ \ Æ“¬“•v∞˛fπM9_lºô≥ÿëªxR”Ü≠—50éíÒ≠L{{F≠ºÇ*çÑUx´°*LÇyty˙Û≈Ó§Y{68f âﬂæ*xKJ¢y3MAI}b≤ÃçîﬁZ~”ˇÉƒ√u#tPshÍÂ><1}_·{‘ÚπLm6á-ëeŸ/ πb©ØÕ{S3≠ÓÙ˝¶∂π¸Ÿ™∏∞2±∑πõŸlˆà˝5HìãÍP±y†DÛO3„I¸o˚=≠_©πœ=K€[hq+’ì+ˆ¶U_©„u«0µó'dÚí,¨ÀòÆb%°ôØ¬Ω±.‘œ”4¿∏+ID∏å¢√ñ^+È@9úûw=òhÂ`	Zß¨YÏÛ ◊}Ãn/ƒûs¸Vúj†ëÃê™≤¶æZì‚\Íà¸|R‘ïüNZﬂüºÅ|í£TùdÎ{îöœâã|öÿp<§º6£…YÆN%˜NibÛ£X◊Ã !óÄºπSƒ§¸Ùˆ™Á¨‚=Du¥’lCë∂›º¨›Ê"6P>ô≤õ¢åÑTE¬39l·¢ÔgÆZá}4≈:ﬁNØÅ/úÉ™æ"ûGDù’)ClÇ±®µ&™≈L†∞ißå‘ﬂîâáºÃYñxIﬁ
Œ«µ‹ ‚$Ñ$>ï@¬åÄ*˛duz.Hø{'rv«É»å˝ˇàºbíO7˜çÑ∂ø°˜ÿí6“%œV⁄EY°=π≈Ó…ÙˇSΩôW7Ú–)*∞÷2Œ†´|ÌÎC‘ËÕYH“Ó˚ŸÑ{i{C⁄YóNŒªÃ™®Ÿin{€Á`Ä’ ùJB©~ÓıçWÁ§1Â=(ÿÄΩwµ£mÃ±ïQΩÕÃ!*@áﬂ+u •QõºRŒ⁄&e}p†ÿ6˘Ú2›‹’¢G‰-∞¿!˜6iö˙≈ëµ⁄—wŸ|m¨≈äÃ˛òŸå9Z0A°∆t∏≠U≥ü…=}–ÖÊŸ‘!@¢àÆéπÔÔ±Æ…†Ä¸‡·~ﬂ˝o-ç·'º’1ÀLö”lå3ËñÄ˘GspD†,ÌﬂµÑ*8A∑Â/„™ıÃV_3ﬁaEnp;·y˙DNX‚Ì¥€ÿ⁄˘˘RÕ4yTP`◊ä¥˝›È(„«Àˇ¨+n≤pÍ™y{|1
Øß˝Õn p¡ﬂ ›m©Àbnâ›3†øWŸ/ŒÎ»«®πùØ«Wh„GÌ¸∂{Åir∏dÖeW#:b⁄}”'õì˙Cz‚%ûy$DÖÌÏpöÌ˚ S¶Oè4uÿYM¡Çı.F8˜»]ÂÁ m©›êÈ™Kw¶ßÕˆÌÒÔæ=y6<ä6ÅC;ÆèjƒçÒı⁄®Ò›`ı≥¯gµ@ÿKá~Âí≤{úXõºÈC_˝97î©¡nÈôõu°ÀQp±{{ÊäqäºÑ”1xÒ’¢Tô,<≈aH$3Àã!ay˝¿øx˝Æñ+À^ﬁÖ’!Ê⁄Îô¯˜'M:kŸ◊≈qÁ 	˛¸Ú=…ªîbeÂœÄÚvi]∂Û∂öóû@Ñ±ÿP‘~ÿÿD≈ı‰®x \ãVoŒ“ÄjaÚ ùc”ÎŸv¸\lI†›-"¶)`ïí±:ú¡òCs6ØòJ,°º≈íç•·p˚
WV9ˆxVX=|nPî0[π–ÛòöÂ˛§3¿ùﬁjMŸãì$|‹ìﬂ/Ã-SØm¿≥iÈgAmûüçBÑ≈£µs}Òeú^
*2Qb	éAIÈ€a+zﬁ/Ë[˙
\˛7h{o˛çü	j»Î4¯3›˘Ä¶Ä@-%MÀëÚYb°¡hn•Xq√ÈKxππ%¸û\Fá÷2∑h.ı*fu,:0#± VcçÕ_+¸kÛ∆ˆ≠ºb+ñLˇY0?7ÏBMy˙ã0~Ü7†îoAJ˝{¶Ô,36»˚uâl’B¡§∂ÀÑ÷œÀc„Õƒ„ú$¥t¬\≥M≥ÈXm∑√Í;5Â∞¯◊J⁄1˘≠::‹RSa®˘¢˘E´∞üÏ«˘	]ˇk;Ω#À≥¥]6TÊ,7T‘°Œ(zŒœ`U‘IÄááDL÷v'≥EPK™±/æ\≤' .ØÄÅ,˛è|Ö,ÑƒZ3Ó€IµÊ∑ä‹qfƒÁU¢¥ì◊ÎD∂—√≠¨ØSØ9énuíÔÓVxë∑≥o*GFä"»¬ó˜õÁ†l‘Û„8ç+p)¢wÉ◊""g˘‰Cä≥B{¬<	˜R◊Ä‡S®{•>À®ΩÇùg(G‚≤{H®lW–çs(u∆ÑÍkú¨Œ?∞7µÂ^‚,À V∞ÿ˘%Áôé=˝\ÖWÖ¨Üj©P`rË:¬A	”ÕV8tåﬁ<∫b≈CÈóØ¶R-7'∆TRsÎS!ebû*B≤ã4˘Y·jI|i÷ ∑È≈€´ ºxæ>õk<≤ßÚâÌo£‡ñ™’‘Ìãdk¬SÍE=¡nøÃ±2Êç3Ì$EŸÌHj2¢ÜµÌ~Jÿêøí¥\AxuRmπ-EiÃíy¢*oπ≥ê®I´ô#9¶Ω˝\«
õ_œ+AyÈô∫òJ@%–l¥>b¬ñÍ+:ª∆hh≤ÅS*éAôY=Q{IëêÚÁ„≥˜F≥≈„£æ5Åòê„ÍÙâ·ä/^öv5ßëzuû•Ç¡‹ª	Eı·˚çÃnòF eø9®Ü˜áw
=ä"£‰¢—v›¯ø¯‰&˘ÅB¨ì&SÕ∫uÙ.ÍÇ¬%©ìë‹ù»4&ü™]¬‡î¢j ì˚§ñ%4;IKûÓ”KkÎfg÷◊œˇh¥ªfŸ¨É$ÆC∞XÚ#∞íÛ˚ä;‘pÀÒOhH¡U‚f=‡…
ˆŒ∏ìX¨>ÄóˆãN±HïS'†ê¡€§ÙV¡u~ˆea∏ÉúÂÑ±rSrAzz¥_ÍŒﬂ=±1r!A>ΩÓ?DUí€Znî õ≤-lßøaº7çœc@⁄ €º¯è¶BqÛ¬™‹˘£2¿ˇ§,“I1™`3Wé°«[q'˛w?ÿ
⁄Å>ıñj´JâW¡Ê«÷^¡wÙ…-&Hù`Dàf∂–Ç;C˝iª÷;¬FL§D›7¢¯Ü–ﬁF0ç˙á¸“U€h6Û‡E≥o’OxõÈA˘ªç´R∏ÿΩ®['9J∂º†n#ã1iB58≥Ègxˇï9è·SÈ!!ò XÈ~Ô
∆p¸Re}¬<tÀQπ–V0M5/TÿÛ„=wp•©∑Ù‰∫oêÔå±VCò¿ùIwZoBW·Y¡.“ÓØ®Ô®Ví“‹oÒΩ˙k˝ﬁ?	¬
ÌÌoúﬁA}= ßkªNqËkˆôÒ5Áu*ÎÆwK˚Zl∞âŸóê∏Ãq‹<·KaÑxhÛ⁄7ÙﬂïwDiÄZƒ+'‡®ÇÚR∑ó+›Ó;€;%ÿìÃÂ5q·¿§¢ÈFN	ïÉ¨±€ÒÎ“™∑Èï¸ﬂÇß°_Èc‰gsF#°’dWÒd˘
–yZ‡∂êbËmnprÌ+N∫léç¸í∂øˆõø¬+èå≈çïöƒ∏˘“ÚˆÑPFw∑Àó’ÓœO=>§òqåÄÍì´åÔ,F˙¢‘=Ò’èSA#∫∞âß‰∑nÁ≤Ìç õFÓÈå%{ö.KA‡›ﬁ1c°∫îPóâÂp2°ì≤)≠æPÒZí¢{QkMìÜÒºôÌ≥·Éãx?ØU∫ÿõ#û#;j=Çï ±çü˛≥M¡fk©mT–ÙVOyç-,›ˇßÜÄUyä}îÒ~ıú`ñΩ|GÔ›*%Ï‘N"⁄‘Qn}£F‹óógÎ`Ò/è¿Õ«∂ÃíT8ï).UuÁˇc8jÏ˛á6ÀÑRl*›◊É§∏ìÆ∑ÆäÑ
]_Á‘]Õ¢Ibøi~≤=î¶Køﬁ‹	&G(<˚4·Ò@©∏õ7¡#.`i»'c\(u˜¨ßàœ∏ç∏ı˚ˇS¥myÉ¶X“Öª¥ÀŒêô<i Å™‘–À/áÁßôûüuï8Bæf’{>πıù⁄ã@” YÑ‰=CúêFÕª¸.à–ç|Ô4›Ù±ÿÍ*ù˛÷™-ë˝]b§Z¬Hc™‹‚òxPﬂY√ˆù·»«Ïr8GÕ8Cc·!—ëì0íNgg¶ﬂ…§%ıót•≤¯‹ùÏ*Né$S6Pûâoòhﬁœ÷jß¯!ClØ∫¯Gë.À÷,9"U´ZuqgB‹áU∞›~W~ÇWüº6◊¯®SÃ˚˚§båõ·ˆ˘ :´'Ç¿JT}	…]LóX∏äL∞€ë~D	`◊íÒè ¬©~/˘+2A®ﬂ°÷ãˇÉ-vÒ#i	—ΩJ_|€‘!§´¨+8g{9˛ÅΩF≈…1xø˘‘≥Dπn‘àMÂì^áê}≤˝q^êäSÊÚbw[[7U◊ˆ˜:◊¿¥Û)ﬂEwVûLÄÛy  Ö«§ÁHø«ˆ7!∑‡,¸ªÅ˙ÚÌàsˇﬂÚÌWÄ$~55FÄâºhW~ˆ‡<åÆ° ˝›åW8bZ‚p,R∏o*|«Æâç«8| –Xÿ3	QUE›5∑T/C˙Ú-"ããºöL:aq/2|Å°3°ﬂáßπo√∂{/@u÷K—ÑI ›a;<®¯eˆ§˜ÍL,dÆüP(¬‡A±[Öc«§z=xÎ…ËúÔ∑é@Ô¨q∂ˇ†ŒçÓ·Á‰úE/Z±UÙüYr∑‚ÅY»∑—˜ò#ﬂˇS‚Òﬂû»:Uâ~/^ £´z∆Ω∏AÄ§W∂Uó	õIΩﬂÔ4èTäâQ√'™$ïÿzâ‘œOç‘Z¢¬ƒÍtf†6ì>-ı¡1u¬ú†õhñÖŸ*-πñ∫àÎ\©ßË	°h≤gUúK†åÆwúÂ[LÌ˚P¶B˙˙…T¨øÛ¸øæ,AkÖ¬u\ìPË5>(±c|æñ#éÁiÈ∆ç/»õ¥3
i‚™hCWow¶<AmÔ7Ÿ#˙•¿§öÈ'‘[[F÷®çqB€NÚúã5›√$ÓKú€ÊØúXèÊƒpﬂHézúéJ®˘YùQÿ∂[Áﬂ⁄Zú¡†_ô›µ8j/ô ÷çrËOR]ˆÌU’∑(¯'ÎœGH‡Ìô;],=û•·AB„à—µÙ√ppsÇtÛ8 èóˇ}-m∑È‡		$:¸ˇTÂ∏j⁄ÜK_SHπêl)ÁL{≠u¬$ÎªgÇÊ∞˛ó8#î@o∑Pn%¸M".g„ª9ÏÄ˜|f‰ÈlΩ
hw®˝yîD%vØ)_ƒkt˚ µ=º^q^ı!Ò©„?üQ˛,ÜâVàZ˘;«ÎBhÔDVc«´ùØ}d&í‘v\]i»HX¬'^IÎ·â∏K.j…n˙{4E=ˇO§nŒë9µÆï‘jx¢ñaÒ—S]öj	ZrG´Ù‹ëiP·ı»càz%õ© söLgF7Ã4®k1Ø>.Ñ0P˝ﬂï”·Qà‚„◊ÖSú…Õ®òjå3P{ÎwnÅá◊ì≤?yÚw≤uPıæ1¨UÀ3ï
˝ÃÃU‚ÏwŸcøoYœã‚…V^g≈"ılV¿éTñ'2π;Ë(4$'Áπ[Ÿ*(k1ƒ∂au~<i-¡Û7¸YΩ§Òü˘&∑™tøÁÍM)†Å-i÷‚úÁÊ Õ¶€®J≤Ò:_ˇ‚kF‹aﬂ¿ÙV%Ï‰ô€„´éH`)Â/Ó¬Œ#€™ü·¥}BdKùÈçÁñ8˙2Ç Ì·∑_{Ø“…XûäªÖ!öÃ˙sõaøm9¿kDÜÿπä–K¨◊¬82µ»$î„éÏØ›öÂB¡^NìßN∂GƒV”a<' •F‰ÙB„.Æ_ÛÀ¸…ë€ª9–(ÜüƒêCà[;Ùb˚Ÿó~#Kw#”ya≠'(@Nƒuñ∞≤◊≈ã‰u§™£|z©Æ}‚wô∑Ys2ø5Qä{∞vﬂÙﬁt‚ÃñÅy∂U∞`z—ˇAjüÑôS¸§ÃÍ$wÅ±»Öıgæ3Ú/vÏ)`ÀÕØ#⁄ñ›•âœ?√˚l¿$4ù†∂Øµ˘ßO‘øˇ8È∆·8ƒËb¶RhMíâ
À”’µnU≠¢gÁ√‘œ12Bä⁄íä©»≠Ùÿm>◊∑ä =¨bÀƒeﬁΩÆó¥/ „UÈeÌrL€í–ÓÕû6∆ú‚/K£L—¨'∫¿˘U ^3Ú¶d‰Ùáªö‹!‘?πk∂Óìçr–(§ÙÌm;Ñ7Q'˛^¡á®Ì&U#d_⁄˛C	bÇπªbG∞E•V†û¡Ö1§éLh2w}ˆ⁄ÈõE\BﬁE›JÓ°ÁÙØzÏÃLî.éï⁄ÓìZBg=i◊&=Ëöog ∆…ˆGTv-Ÿç•H7cxõ”©≤ìÂ$‰∏’_…öNƒi;Õp/ÊxeêóÏ®¥qÂ˙å<k.Ì≈	Æõ„£¢ÁèGK_¥·º"2é»,[1ƒŒ™ÿ≤/¡F7Së∂©¡~ûÒÄbî¡g1é±k_r∫ŸV	£[•{f©QU|ë?CzL¿`6s!Éô,4µI4:ﬁí÷F∏Ú”÷W–”Ç•¢ÈiÆ5xàHu&∫m∂´Ïº∞”ıÃ…^˘Cx´∫∫:∂¨w.pÊ\QN{Km∞%}BÅ;z…Lœ´å-H2ß·† Óm4†Ò/uØÁr|á ;]eùáÚ≤ gV‹ßÄ˛˝zfp‘ÅeW$~U∑´ºÛu6øÇè¢∑≥•/π	rÁYû\πhÆÄvÃ9Ÿo,Ù‘|ÃŸÛ‡Ø`∞Ωj|ªv~* $±>æ•¸3ï=∞÷¨ºÂ€©ZVèÿ‰¡˘¬ﬂNf*-≥¯√P∏{X*“Øn≥^∏…≈˙÷ä!F‘á)kWUﬁbµ(A[unUU/=ÿCc≥LÉµ)é(Û¢≠ßeƒ
bñ-6≥∆?n°‰Ô}√)»RÒ–^…bƒ é|…ów-=·éçÑÀ§û¡ów⁄
¨]ÓYÔâs≥eá8qG≈=Dd∂≤ñíq/˛Fvm§≠AH‚aˇ™(>vgµ∑$î¢>‘zÓÉ∞õø„3bG-˚¬Ù:õ#ç"”¢8ÈCn©≤VyåBF=Ôå
Ò»ﬁJÖkº√≠ƒ_h~vroÄ¨›¿*∫@	,ÎÎ-ÏYˆÉ@ê†ıc<ÓGÌÂ¢«æ$Ø k¿ù©7πPüB6ÖÌ ∏ ®Ø≠Ö!/∏8¬hk∆ñïêÿ&ıq‹ˆôO[∑◊≠»d©_l∑çˆ0êxÑ∫S∞˜NÄ‡ÒÓ5K€_*T™Vyü¿yœSZb3ê™"– çà”⁄§)%í¡	y|ÃΩÅı Ø6∏ÅMg…⁄;hX‚:^‹m˜£èÀÜá$Ωw§ﬁ;÷·‹ÈnW?¸z`ÆaÍ‹œAkê˜Ï8B.Ä‰-˛uqUÏkwwÀ£ûKdJÕU7}˜	S≈Ç¨A¡◊≥Èà"’nÎùêÆ_}“l◊¯„):π<É2<•3¸ï≤ 6§ö\™ Åçøπâd}N¶yî4E∫Ú—(¶F¶‹Q€vC[gN2åQìô∏”ä}.˛ﬁe∏SzTä∫≈©vbZò6¢≥SGHƒ9ecïpƒ]¿Ä≠⁄Hf âë˛ˇ…™bèK≥ís˜§ ÜıØg«™®eHüRÒcËÕæEŸ“à>gû@µB’Cˇ>}¯*ﬁ∫©Äg¨9’ Dm∆∂ˇˆ>=#F∫2≈Hã÷X¸J[<2Ω€Y/ò|rí©Ö√JÊ?º »<◊EËäI´‹∂S≤2–í1ÕòèK_7)Ìîkî≥NÛÑÆ√µô;Wh÷`co∑*•vÉE4õ√wÅBÀ7Ów‚ÜC‰–D‰B“8èƒbÎD›À◊¿¶Ò—U"´fNAsΩæk°øƒ≥7πU·:\aK∏0òj1hŸ@bÓûC®aÍ3ƒ≥˘\ÉÁ6»+òıÕÛÔ4f≠Ë¿Ωt˝vï·≥∫ÎRÁ~ºoï)•~s∞ r±}≤–j≥'˛ƒÂ‰∞’„»«ÕºqÛx”ªÅ≥°∫ƒ“Çº a®ñMﬂY+‰dI∑‚1ñù'ª„˛πˇ *'W∞™/PHÛœr7ˇH&◊Ÿà@√¡?}Â=	rÛ|Æê)π◊ÇÓ=¸¢Ÿ ˝O˛†Lfñ„zEÚ¿Q"" GÆ∂RMS®ï¶âïƒGπröy`C->∏4ÛF1+úò≠∂ﬁç%Œ7ñÍp7Øßoª I)á™_£QÌâ ôW/ÈûôÔ0	Ótg≠ÂR≤e√‚™√h:«∫‰Ílá∫—&ÔYì–d≈D€ÑOÅÂH	N3yÈ p)∏Yçô“"KΩ
ŒYH=S¯xÍ˚f0ø/‘B„Ußjy˛#‚3®ëÏ=W[ıó’‹mØ6R<ïˇdb∫®°)ÓTΩ±∏©’^©„€`AÂÅÙ1çà¯ú.”∆‹gOÅß⁄dÉ3ÕÓ§¡•áÏ 8±C·◊“øv±•zG…´pävﬂ –ÔöFÇ‡‹ =∂”G\¶¿Í&„ Í¸Õ"Z¬ëOD1V∞a¨∏GkÉ“qíÄË•4+ïëèg_«≈'“Ë-‰åå‰ÑCL“ÀTD+º‘‹á∞ÆÒ∏íXG≥ﬂÃß5Ü˙Íß^‘˘˝òaÀzrÉC\,ã¥xõø‰oÓâËó~ëzÔëØoì9aû•É£ø∆∏9Òfx}Vo0(Íqn	2)Z> "4·Å≈h ˙{∆ËÚmº◊ÙT«&klÕwgÄg∆Û+!_ºß¨Slgº¥Ô¢Œ˜àÀyo+òQ†≥4◊(^BO◊ÈºkyQìÃπ¨^è:	Ùé‹5‚_{c˙ÍêR3ë-õ√reGÅó¿E†€ó´*˚ÙhyNvöôÁ¨5Ëjê˝ÙÇæ˘x^sí†‘*ﬂÀr"Í9ÈÕæ…¨∏®¿>>ñ@˘$BÎj⁄e§Re/˜zwï ∏˝eD≈»-üBåè”u±Ö°ë∆‚=¢-ßâç)m∫DiBŸñlåœT(lá‚⁄X"Ò'I˛µ&T–÷-a5Bßïπ¡—Ùh∑?˜üyÍ≤¡¡…œAÒRòÆ8ˆòë1±éO-›Ò9]‹ÛQ'P	Ù>ΩŒò]∞£Âç•õõâ~8Éïuœ˙©bA√Ø‘åˆÏC5.+YîJk75ö¢tæMœ∫˛Jcˆ	§®÷gﬂÁe*67Á	iÙ†ØÉÊ`ƒºeo˘v?3µ˘§ídÓ øNiÓù*
~à‰•˘<5íÜÊüﬁÒ ˙\hææÄ ú?æÓÇÕ_;^CüòIUeÍ¨ú:â}û·@9}LŒ
¢âRL:Á¯◊ëV‡◊∂€”•t"ë¿⁄üˇù…N{¸◊˙¿û cÀì‘(ê˚4µ≤ØSdc|∑=ûí˝‚ó_∫y’ê¥‡ıƒ—Tù¿„ÕVËã=M≈![∑¸	2>´u& ô'EÌÉΩˇÌsÖÑdníæpw9ÑÆÌÖ†GÁƒS‹Í Á_»g¢=VÛJi±æÖ“M“…◊[áõBr(§ÏYlÚ£ö_TÅÔù ˚t”vUAmù’È)ÆnTÎrë.Nß∑„”%80Oí˛Ó5‰BRÔF!ünfè∞¿*[€W0g‚ÃÈ7‹ƒ z£Ñ=ö¿èCì«ñHÏàüwNmJÅ;·®!Ûû≥p ∏©£1‡A∏˛Á¥ø°}Öã√çíË¥∆•ô’≥Ö‹sz?œJÚ«ŸR†oˇ∏™"–Ó™!DnA˛∞W„∑<Ö;RH¢Ã¯1»®uü;*˛	™˝y’Q$ ¡IìÎ3˙…•^W^Áß[ŸÂYÿ…ÆÓ‡≥c¡H#¡ß√oN¨ê$√ï:ç*µÖ(›ªB‘π8ı‹é—á>Dﬂe≥Û)ºrf& }1G^±¢Ôs~ñ…3é‚∫ƒ†vZÑ4VNhüπpc–q0á·O¶ %W∞öDKîˇä∏áπÒ”gŸ–ø%”õö›,rÖÈ∆C(é3ë`ì«¯Ëz∞ö‚]:˝à€¢Ø“TPTìˆ†_óZ˙Ï‚Ù"ÿ1á†õ8rzôFê|(…#„∆IN™•ß¢›–∑Z#£áP˜‹{°«‹±Zµ8Ó{Sá"Ê±Ö±8É±4ˆçˇôo¥»Lv#⁄ÁÂ∂¬ ~uê/ã∞Zé:¥ó"5„˚¶YÍÅóâ◊˜¨«∫Í∂´ÿµjJ€¡©˝±¿¯¿h~p È≈i¿»£¯í·‰£M	ÂÌÁ$ü¸    ÏA‰Sm‹#¢1<TTå!‡ﬁ©ë–…ﬂ?¶!—ˆàSÙOK µvJ<®„_ˇuï+l°∂œ's_çh&≈;aMy"*X›*
˚îı @ŒRãáH˘+˙àún¡ßÄ•´ˇƒg≠`ÚZıSày9ÉcΩh·>çô}≥øAÏò€cÙù‘*∑≠eŒ!gl∞≠HâÜà4BH∂øÖ˘^éo∑3µ¶Pïuﬂ˙∫ŒP≠?§‹∞ß®Rƒ`w∫ëÑ,ô^O–£gC$G2êä4}◊‰º`U®ëX´aûÂVRãì‡∆©âñRúó…1ÍŒ!ﬁ%ÀﬂA£Ó7I-]ÏΩıè˛MVÑJ3@˛ÌQh»ÛjxäTÍ8\_©~Â$™µ@(≤a^Ωëìdªú‚zàW†ã)Â∫BDmı ˆÚ yÊºQoÅ-F‘WŒÄ P¢]É´ö†ü¶¶l h–≥ﬂˇi†p+bπÆn]ı∏9KF˙jLBrªπdBNwEz˚J£r+∂WxÌVî/ÙEG
Vµ%M±{Å¡ª∑ÃH%!òT=%›59òõå–ùõÿ«w≤˛∂´¸°0Ì•^ˆ/1)3%eêì»d(≥ÍS∂YÏ`h¸'∞I=L–Ë¸∏∏ÇÛÄY›T*y‹∑øW´"Ú≥¿©Z:0Òé^;ÆnQ¯hµ˘izÍ±Äœ◊ÿ˚¡ì+˜ê
Ë^≠Ùa.®I’7°∫/‚Ωæƒ⁄F¸]Bﬁÿ…—|Ú∂e˘≥Wgˆ=ª]vElâe`ÕÇ7‘nPñÄOt#Ú€ß±£&Óc$qËhq∑2ØIïƒÌ˚X \%πpﬂ•¬≠pj˙Æ¥BnnrêGÊ±˛õ~Ùf còy!4l4≤€Ó©¨€”â≈ÇÔb◊È’◊ÍåAI—	M@ß@E∂Õ‚Ω&Ω?EgH€π"èÎUYÓ˘ﬂ™ˆh¬ÇO5?aºyº§¿förù~è¥gôO |©_∏Q2‡ï˛úæ,.µÖ⁄4fÄs≠ˇüâ¥ÎÛÆ≤¢Û˜^˛Ú™,Åè#ÿêi\1â€ GØLè"π¸Q⁄ ∏©‰akÙ?»v~∂ò˙ÇJÁj} ›–ç=P\'›¿ˆ1&ç·pRpîzIÏ˘Yó4€Ø2¬XµªΩ~íãÇƒÖ√Q–“:ÌÆ.˚	ôÏ—¢ù/~Ï‰$Áª•WÖﬁµ¶›∫@=Xò§ƒm˘¡u{˙≤∂≠_ˇ]ÏM’Ôrn∞û7ÿiËP°é¸ùûÅ≠~S÷=Û û <K¬¸™mµ≤§O“+ﬁ◊j£Öc†√)†‰§ôN®Ÿ†qùË'5Íôù'º»ñíò¶tì¿BSÛ÷Ú¡è™íº:∑ÍUÔcïmÉÍÎiÎ¿Ö>¨Çfè^ #Á’Ìf
ê4Ÿ„fj7Ê€ –E1ˇ≠™√|y∑rù¶»ˆwO∆e4ÉÚ4Aqüa˝a2J+Cä≥≤6ë£,R÷p#bE"„∏*ï•b›ÊJﬁ0=œù=¡›FIB:∫}dÇ‘KËô˜˛ÉÌLIâˇÄ®Çø£µmıü+Õ“ıÌÀ”¬ô^™sP’›E6j >˙‚@/^¿Ue£’{ œ;e„•}§bπv˚NëROÉzÉ}°	êR/ª™ŸMç¢ümKj†·Ω_Û•´≥\\öx˘ÓyÈıú#DØôµF>ùU¢ÃÇßÙ˘°§ c†õHá4f¬{k˜70◊õ!‰mÓ¥&ñøêø58·‚,è§#~BèX‰bPûÑB[h™&ıå∫πsïõ\î®BM§Éy≤€¿IÌ—Q¢H"’Ìß5.÷Ü[rsœM;®ztù’vÖæÆr|P+Ò◊Ã1I{=çbc•y¸2§]≈¯|∂íaÅ√«u√÷úˆ}<¯SÚ;⁄∏1c±-1/Å+EdÔâ3G'–÷˚å®¡ 7ÏØ.UP«ˇ`˜®uMm“Á6ø"î	|≥Ì$q‘í˜Åï˜˘ `è◊	R“°.Å#øõz¨—°_ˆí8…¸Œ<ÿwÚ∫¸P®ıﬂ£BÉ‹ÉEQ‘åG *∫L≠πΩ[Y”◊ïì”˘.ìQOÈt≥‰∂ÜíÁãﬂ(úÓ0ïHÛÚ(Rë`∆ÕÚì€D©ŒI”Ì‡©'Î3ÙC?kmK˝3òËY¬’È–”qYız/±»Cù¨ß«ÚÔ4Ü—÷™Ô˙ E£àµ	d∂⁄óEÙj&W-Ç…·sw¨t<◊∞«ôVæbEuÉ,j§«öe⁄óvê]ÓgÀU+b€Ïv§ègW ˇ‚óˆ≥$}Õd˚æc©.h‚ﬂÎœ®|gTz@≤uW6õ)¯l^ÖÍ£`DP0˚VE≤ˆ~—%©Ù√K∑∞*ƒ[„UMËZ™™\ñÆêÚ?ÿêæÆ¶—nVÚJËwº¡d®ÿóÏ´ö{ﬁÂãõ2ﬂgÁÅ‚"9˜lv/Ó#WcdO∞R0,á(|fò⁄*-˚N „[¿vâÖIzy‚c≈DËp.Gf¿;ôœêï®d¯óL…ÏΩNØAÄ¿‹*óOùT‰◊ΩAêfﬁh˘L?›äK1‡Æ|≈E‚é«OÆëpÜœûZå4™<Ù™öwü:ﬂsı≤Ä—'Æ»?YÇ£cä‰`∏óÉ2È,´´£GrvàŸ@´"Ë?"ï∫@Yd§

"#⁄7ú’h.ÈQ®Õ-„6´È4ê=^2¯’∂e|€QèÄ_cmΩ8¿ﬂÙìÔ_Ù5¸7Ï2.‹Zﬂ’d[-J<ËKµõ«§îﬁ'õf#‹åkxÔ_8p‚õ5ñ”Ì–êÑΩ¸[·¸?L[à‚µÜ¥“Ñ¡G5àù)+ÄNÆr¢j£√`ÙÂ4üI“∫]∫«9 
äXœy§“A,ìÆ¿òü\R€nçü±UÔéÏ9t¿.Hr˜|µ[5pÅîÕ‹s4ÒÕ‚F“î0}[('ë£(◊ÛÍ–°mÊ?8œöd br&9÷ñæù’˚Ùí+	«πÖä˜È∂0%‚5ÌÊ{=÷x∞4qΩ∆Ã ;.Nœ˜ˇåM$BüÜÔÚ¬ù8ı§¶;0§?–%¥¯WOC[Úì»;S≠?ÒzÂæ&´é ÷ÎÌõ)°Ú4&6?Â∑9>÷∂:]&{,DŸø„ÏyW‚ñTÔ3n€
îÇªò%ô*ÂË8Ky‘◊	æSÂ]@Æ…U÷¯i◊-Ã˚yg1sUÛ;TG¥Laèñˆ{∆ó-,Î\ABÔÄ»Ã„“p‘„ÀE⁄X¶KvbŸIˆ∏ì ıˆ¬}ÅS«åjÖ~2åRﬁq’¥À>O“XP_aa°™Ì“ãÔäD~8lˆ’) ·ÁÉU∏?W‰8˝ •i Ó≠z%â,HÌ¶*ëTKéŒvú‹ÏuÑÙÏ¢p’sèÿ=~Ÿù€0ˇ|/a¥ícX\wH9‘Ê?ÖpnVyèåN`6wôNjÙ±zËï·zqÒ¡].◊§ø]‹^cQY˛hÈç¬ ø*©ËíKŸÂÍ¡¨sîë Û2˚mÌê˘‡Sw`∑≥˝zﬂà¯DVÇÜ‡¸0ı≠åözMéí‘4Ø˜¡ZÊ•`∞'ÄeØ>ÔÉ[@@πW®}´t±Ç@?í˙ù1’∆H∑◊…ıüÇo∆`˘Eñ·“•ååü›Â˛‚âo‰NòÌ”Øov>ìàO»πÕq©ñße˘∑£¯ô7É±<ùÂcó√À2ÿR∏ ™ˆ‰ôÇ∑∑¢äÏ÷À=%Ùïño˜aü´ﬂa∑àt?ï»GÀ@CÃ»ÕÅ»}œ‚˚ÙT8jf√˙9◊◊ƒ£€÷çóyÀê≥G¶r5`%2é1B@‘÷·0æê){<0ëÅı±œ°Œ…YÍ˙Á-Ô`ÓÄ¨øÎá,◊öñ0®⁄“ÅM±gv•—ÉÁ∑ıö~´÷4≤§2úQˇº≥©-⁄N2¬·Úu[Û@G. m¯ƒa çíÄ3FÄWô#¸W•èºÇß5$büO=q∆]›[√N@œ*a∂ú>’™Öü‚ûêvdÙ—˛¡ñÙ¯hê5ÌÂ÷±Lÿoì¥Éwù8w≈€Qƒ 1(D£°N/‰ﬂˇó(¿µå[˜„G_∂q)+ß›w©~5)|∆ø,eëXö;ÔÊHbjBÇu@ãñé*¬ ù|~±|JFR#Ï5¨’ è˘W%ock~I,£S∑¬ﬁÃØ8Œ›ÏpOæ≈ö/˝‡eãha)ßñVn—Ûú\ΩÙ&5‘*àœûu¿&$õÎÿ{pbÃv≠z}Ì{	nΩÏÃ$$≈©S6È3ªwáOLƒ{JƒˆZöjÑQ˝hC;√pÌÓ†ı∫´ã4^I¿[ÜY d1s˝™©[ÿ≤	vŒ≥PÖ≈úΩêéÛ˚Å!Äº∞˙‚Û‚(Ì)A≈5°n3%s†ZπvH	W$.º©¿®ô¥¸ÉA5Ê2ûül¡PíUÊÉÑË´Ü})cÆ2%kHÎ^ $ã⁄©º€¥·–ËπÛÿ>¸PR:Aç≥Úz|éã´Ë¥5ó« 8∆†ìÚú”ìlÕ˜|–±•Ì’ÏÂ%¸V›9)ÔAAWïj¸µµXãA∫™Äé;'¨h$›eh DD,Ï	qPÄâ„_ÉÖ©ßÃ}ê"¯W≈«‹ba®∏aì›AR’ÿ\¥)◊ﬂz èâC`¥ i6ù¯.∑CâUZlO√Rÿ•;74í⁄≤˛ãıÊì/p‚µÀV“I:kIËBe?¡ ˛À˚6JÍáò≥ *BKÇBt˙.ƒÛ$
Eå: ©#RƒƒÅÉ^=õçvx˛≠… †-$<8"•Z+ØπgXaŸ¶»!h≈+∫∫(}|à¬)_~¯~î;i–¥€)»µ01c@z*◊Ì$÷óÁ"-È®yÑ∑"4.ô—ÿ1–´Îƒ œçÇ~îs$,j %£X»{–jπ	Í,åcO4ïîÌvW%%Ωù]I
ÙªUOviC∞∫¥~cá§´ˇjéŸÑK·î,-L‹Í˚H¯7U_.Z^ˇ")ààÛW-;çóNiÄπÂØ—d°˚ìnÄyMK]}Æ√Àƒr‚8ÂZ)VŸ±á†g^çèEyÈ√jW>U{·Ôj	#¬¬W√UÑ⁄"ñ‰’cøo„Ãë¢Z/™∞Ûñ¢n\·_Ù40úD{á	≤na#‹4@HU>π≈‡\"Æi 8ñuoˆüzÅfI«8€L˚ô’zïÈ‡Âîq±d√óM€Ùf8B…®»Ω‡-≈îy¬•–l•Kf∂◊vÇU540ız©ÔW
b£∫Áskö◊∫€˜§f`keX)ìj∑cf≤\ÍÚıﬁÂ,˙t¬D’DTz∫:}lM,q2<V›íx´Óy„∂∫r<,$ù¥ëçø›&œ"µõèˇCºD¨¨ÚÑ„√ZÈdˆ‰1JÈ¸E3>YyßˇÈ.]-b«IΩ‰ÕÚ÷Re]IõÓHC<k i?≤0ã»uÆ√Çê-ú»kn&gQ˚ıY‹g∏Bé˛⁄Ò4÷züaK:;+EVT∑IPÚÑ∞Ÿ `˚B6‡.èﬂöø*07I ˛Q“Ctº“OÂª·∏)∂U8à¨£B•fì˝á»l]c∏ÜXF◊xﬁ£'·ôÑ_ß˜V/Å0I6∑¬¸æ¬rAM“÷≥MΩ¿™∑ï»Ç›z …‹µTdzåsnÙ2ﬁãπKc^.3]¯x!S¬™À∆&ûm8—|≠k’Rá±^ cÍx)`ó∆,≥  Âµâ5ëR'è”≈êjU˙∂ùäUqÃêgJG}}˜°L% !Çxı≤A≥∞¯∞Cc»*˘~ãtQF„û=π≈'Ÿ3˛@2…u“Ω¢√@ÒS‡cΩˆJM”ÕÉH≈3`vıÎ<d˝ç-V¢WÔkD$`ûπGvÃ√œ¬Å{ûßH”≠ìıÉóOyå3¢*1WOeÙc£ˆ∑1à{ÉEn“BÏ ì|∂@D‚ÀX°ñ⁄XU¢ßD7Ôù<Â^|N&¯@jô#å©—x ú‘}∆¨…G¬∂@Í‡f&!ò:Ãûé
Ò≠Ã¯7Û}oRºkúßùèÜÚAp∂2°ã ¿ë9òäj´@DK◊ÊÚ¶+ﬁÃ7Ωçj◊ßÒ5œòâÄ—c„	A:åıs¿zk¸ER;?[÷π^AadÜÃÕ=AﬂznN‚&Ïx¿zd-	ÒFÏX∆Wÿå4ÍxgRµ•áZ2„Oî;Ò.\ÉHÇ‹4(p‡ıI=vﬂ.´·øiõBa"0®§¶ıS˜U4∞@•z˜÷ìÛîÉ˚^»·_
ËY‰wt≤&¿jÜ°\b)D¯»9ˇ&Ä8fÇˆ≠˘@÷˚/ª´´yèe´ÆçU%7^JÖ4¥ARê
!A#rˇ÷$_êx›{‰vÿ·[%≈èıÿ\ÅyR¥¿ºüadCÉ§MßﬁÇ0eBàâÁ SËA»Û≈2ÛP≈∞ºpLl´é◊!¥∂Ã^˚i1æ˛T¡gÊÖ£T@h4(9ægµñè€K©lï›•TPŸ¨FÀb∞„ëôt¬Ê¶¨4C…∞ù}¡ò¯æ<&HCXﬂ
ã"lÔ~cùmæ2¸*¬5>#cä€ü”`¬¿‹‘ç€^`ıw°2≈)•Ëo
„jû€˘–ZU√–È;-«£∞î≠Vºê·#ÅÕ…ë@≠È©zVyÛç5˘C∞-∫^_‘éÃ® o–L·e¢‹áyø“fœ,r`+»√Vˆ‰—‹Âº
ÔÊe_«âÛ|ÍΩ…éÃ†ê!˙R◊˛Ø´x¯X¸ÿz^“ê∑ívn⁄ú°É!{ÚÃù“ºØé´I@)˙Í™Åa*Ï?h√VÖ(sWéD˚Ã	ˆÃfãú†Çq≈ÜB˙;€_[T+óÕ03	å¸ÕxLí\XúËÚ∂Mä¿∞äç˝ınö£∂çGtß#õÅ’wîoóˇ`¿ø˙"¸Ó~q·…/µ°3VcΩL`¬!.ª“1ŒdsdV|óßŸo•u»P•d]˜Œ‹˝¬	G.
†›"\#|p_HCv”OUzn¡‘Ó¯÷ı«/Ê<e¥ÓäÏœí=é∏5ÌT)“R`Q·.FÆ≈¨©y¬“º8ü˙T¯#{‚5≤˙aÿ8sÔ$ÄÇRæ[¡…%µo4ŸÕÒÍÖQxb›íüoÁÊ5VXºíÅáÄW‹”∑è«WﬁßN8MØïÜœ›ÑwËQBπ»œëıê&6K§˛BÆ˘dgJ%
!Y>1§‘-Yi1Ga®c|…|aØ7†¸ó]•\ÒxXˇˇﬂLj™s`x2œ2ãßˇ ÿoˆ˚÷ô%/‚ØTÇCÑfG⁄Lä¿w•	b(õûi⁄{—$ﬁQ(Nô/iNZ¶fg´ÈzÚ§}-8q&~«ÈÊ¶ªA8I∏Ω÷	t¢’Èÿ±À∆õ√PﬁQF)G◊≥°!zÄƒ3(D~	√„3ÓØ©Übj°éŸ‹/2úì]Vt©›q·êSm¬ñ`D&ü±˛Jˆ.àv´&©r›∆pî–¯*	˙Æ~yrí4" ßŸkH 1(O(az-Ã0ú6¢™ü»∫bvr#∏!{Ã S∑eSå∞g¿∫ÈÛ‰Ωö‡ÏØZ3’‡/D	¡c^Ö∂wçó ÜíÃœ78åhôä9Ü˜Ì∑+mˆÿ¢W x[Auºå˚]à$L”7/`ÖÌÀO’ øÌ}¬€ç—Y«äF¸Á°6ˆÃziQç j~~ûV˘ÜÈNÕ¯ójâY¬˛ƒ+ïè¥∞(Q€í≥z˚i⁄Éç?ñÍ}ÛQèøÓÆΩ§7_Œ¢‡Ö ˚Y˘è_y≥H5lì¿…uÅ†[N∫ $o%Pö˘*$«ì¥níTV
–˝∂eı⁄‘Kî«‰'H≈b›3'ÄKœØjÉùçπ‰ow™¸¡U^‹Zb,C‹2ÖÊÂ|ë‹ÀË¢–ÉLTYØf©–]á*+¥¶6ß)°‰ãSRr›Å∂ØÂ£ÔÁ§Îˆµ?∞ÀÎ^M‡5‘ë™√A“!’>üFjó0.u
9∑Í©•n{W¿ê:ï<'2ëÅçì]ÒÓVÁœ£™Ú∆rRÈÙ›31ÍÆ–XÌST»Ka•d|s$‡ä≠=Ö!é{≈!»n€ÅC˝aõ|o›ˇÅ√µØ≠2Ü, A<èÆg“ëLbF—˘]Ë©x¸pc˘AØ]sÚ:L';Q#”ﬂå˚ 6Ò.jüÌñê≠Õ7¸Ü€uäsöÑ?õùªmR}Fãuƒúó3t:·"0ñ41@ø”öﬂQ“+b‹ÀS9àÓ‡@jú¯Ÿã§ÑŸ–'‚G¥«Îú;•ç«HQ’Æç0c±äå9ÒFÜÏÈà£øáNﬂf(9ù≤ÒØX0≠á·¸dS:™Q =üSƒ@rméÿW.@UoÅHSß’mì+–Pˇ@„G¬≈¸ÜΩo2◊˛Y◊äâ·{•}ﬁu\v\Á*¸{Z˙ä–	B±«‚3R†Å∏C7N¢M¢‰Nˇwt\ÌÆËÓ˘î•mªÜÓÍ›—ÂÖqﬁ—Và∑Rü—sTaçZ&µûå°ÿk$Ìﬁ∫H#9Å<Á“∑unX‘ƒXã8‘LÅπ9úÛ∏Ç]vW{E„ˆûü.«FΩbmUÕ=¬uy”ıü≤A;áéã{Ô¯a®»iE£:å
8∑=„ﬁø¯«!%5ºóm,©∏™ñ9‰†8KSm{∏3°Ïq’Zw/È5üF¶p	 ÃS$_Í“…a	¡ﬁ4Z˜Ì}©ì±»K{yÉÙ
 Ö¯Å{•ÚQ-r∫c≤ËÚÛTWq!ä  ñÉ«˛é(IØ¯êÛ˚%(5Œ)˚≈!JÏJH$a¨D„ΩΩñjòX
‚ 4◊g™ù¢£yO±ú˙vÃ'v0ºÍGG≈˝Ù,∆'%RI*gœ#Ã øé¡ÛØk¨ñÇP/
%@«j2åú˛≤TèƒJ?Óé€ËåAÒ‘Wh‰cè mˇ¸ﬂ∫r£ˆÆêÎ≤ÒW√,≈æÆÀ”÷{ÅçÔ√cüsˇŸ&?îñÚ÷—éßuFà≈∞éÜ'œ0i|ﬂXœ¥B@59ô1F(À9|¡.M5›ƒW4û$FÈ [©),º¥÷œ≤‡Úw2=¯˙∏Ü`v˘[>”¢;BÙô√´ﬂá-‘î÷a¯W~>g©)Zú˘⁄[îÿ∏‹j¿!ÎæÛ%µ˛˘ÕMØ˝nÉ√væ/Ç∏%Ñúe{ºz»#ùªŸ®ﬁo|}3ìv@Ö}”-fıaV§Í3r¯¿nœ¿EÌõ|mï (æyxíç?€ˇR.õu¸'@qxÆ5deî!M'fjç)6eíÆœzÙái‚Ì¶Uö‡∑∂â9w"ﬁSªzMÍ,@Œ˚+‘÷ÙiÑ#Vó∞ì,ñ›‚SM o÷¸su≠ﬂ»ê´ì‘•ÿ]¡Óer9Nuõ“ª;“(“y∏!˙Tá†˝Ÿ“+m!?Mù◊+»LÎb"Ëú§yKËˇ[Í˘WàÌA$ó¨ıÂÚ„ë]∆~» 4ÄÀÁåq:∞B¯5±‡[Ä+¨lÖ7⁄B BvE¨FÔ~ˇŒ+±∞´∑V^Hñ0˛Ø¶PWà∆v»†ËúåãÌ]®ÒŸ† qÄ;‰>∫ñ'ÉlÙ‰^x9^»ùZ◊∫ÔµFçQÀ9Å8G•„Ûœån=ä.           vbßmXmX  cßmXñ    ..          vbßmXmX  cßmX|e    BAR     JS  'fßmXmX  gßmX      Ap a c k a  ‘g e . j s o   n   PACKAG~1JSO  ›®mXmX  ‡®mX»√                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   ovided, returns all mappings
	 * corresponding to a either the line we are searching for or the next
	 * closest line that has any mappings. Otherwise, returns all mappings
	 * corresponding to the given line and either the column we are searching for
	 * or the next closest column that has any offsets.
	 *
	 * The only argument is an object with the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number is 1-based.
	 *   - column: Optional. the column number in the original source.
	 *    The column number is 0-based.
	 *
	 * and an array of objects is returned, each with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *    line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *    The column number is 0-based.
	 */
	SourceMapConsumer.prototype.allGeneratedPositionsFor =
	  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
	    var line = util.getArg(aArgs, 'line');
	
	    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
	    // returns the index of the closest mapping less than the needle. By
	    // setting needle.originalColumn to 0, we thus find the last mapping for
	    // the given line, provided such a mapping exists.
	    var needle = {
	      source: util.getArg(aArgs, 'source'),
	      originalLine: line,
	      originalColumn: util.getArg(aArgs, 'column', 0)
	    };
	
	    needle.source = this._findSourceIndex(needle.source);
	    if (needle.source < 0) {
	      return [];
	    }
	
	    var mappings = [];
	
	    var index = this._findMapping(needle,
	                                  this._originalMappings,
	                                  "originalLine",
	                                  "originalColumn",
	                                  util.compareByOriginalPositions,
	                                  binarySearch.LEAST_UPPER_BOUND);
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (aArgs.column === undefined) {
	        var originalLine = mapping.originalLine;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we found. Since
	        // mappings are sorted, this is guaranteed to find all mappings for
	        // the line we found.
	        while (mapping && mapping.originalLine === originalLine) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      } else {
	        var originalColumn = mapping.originalColumn;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we were searching for.
	        // Since mappings are sorted, this is guaranteed to find all mappings for
	        // the line we are searching for.
	        while (mapping &&
	               mapping.originalLine === line &&
	               mapping.originalColumn == originalColumn) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      }
	    }
	
	    return mappings;
	  };
	
	exports.SourceMapConsumer = SourceMapConsumer;
	
	/**
	 * A BasicSourceMapConsumer instance represents a parsed source map which we can
	 * query for information about the original file positions by giving it a file
	 * position in the generated source.
	 *
	 * The first parameter is the raw source map (either as a JSON string, or
	 * already parsed to an object). According to the spec, source maps have the
	 * following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - sources: An array of URLs to the original source files.
	 *   - names: An array of identifiers which can be referrenced by individual mappings.
	 *   - sourceRoot: Optional. The URL root from which all sources are relative.
	 *   - sourcesContent: Optional. An array of contents of the original source files.
	 *   - mappings: A string of base64 VLQs which contain the actual mappings.
	 *   - file: Optional. The generated file this source map is associated with.
	 *
	 * Here is an example source map, taken from the source map spec[0]:
	 *
	 *     {
	 *       version : 3,
	 *       file: "out.js",
	 *       sourceRoot : "",
	 *       sources: ["foo.js", "bar.js"],
	 *       names: ["src", "maps", "are", "fun"],
	 *       mappings: "AA,AB;;ABCDE;"
	 *     }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	 */
	function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sources = util.getArg(sourceMap, 'sources');
	  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	  // requires the array) to play nice here.
	  var names = util.getArg(sourceMap, 'names', []);
	  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	  var mappings = util.getArg(sourceMap, 'mappings');
	  var file = util.getArg(sourceMap, 'file', null);
	
	  // Once again, Sass deviates from the spec and supplies the version as a
	  // string rather than a number, so we use loose equality checking here.
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  if (sourceRoot) {
	    sourceRoot = util.normalize(sourceRoot);
	  }
	
	  sources = sources
	    .map(String)
	    // Some source maps produce relative source paths like "./foo.js" instead of
	    // "foo.js".  Normalize these first so that future comparisons will succeed.
	    // See bugzil.la/1090768.
	    .map(util.normalize)
	    // Always ensure that absolute sources are internally stored relative to
	    // the source root, if the source root is absolute. Not doing this would
	    // be particularly problematic when the source root is a prefix of the
	    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
	    .map(function (source) {
	      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
	        ? util.relative(sourceRoot, source)
	        : source;
	    });
	
	  // Pass `true` below to allow duplicate names and sources. While source maps
	  // are intended to be compressed and deduplicated, the TypeScript compiler
	  // sometimes generates source maps with duplicates in them. See Github issue
	  // #72 and bugzil.la/889492.
	  this._names = ArraySet.fromArray(names.map(String), true);
	  this._sources = ArraySet.fromArray(sources, true);
	
	  this._absoluteSources = this._sources.toArray().map(function (s) {
	    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
	  });
	
	  this.sourceRoot = sourceRoot;
	  this.sourcesContent = sourcesContent;
	  this._mappings = mappings;
	  this._sourceMapURL = aSourceMapURL;
	  this.file = file;
	}
	
	BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
	
	/**
	 * Utility function to find the index of a source.  Returns -1 if not
	 * found.
	 */
	BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
	  var relativeSource = aSource;
	  if (this.sourceRoot != null) {
	    relativeSource = util.relative(this.sourceRoot, relativeSource);
	  }
	
	  if (this._sources.has(relativeSource)) {
	    return this._sources.indexOf(relativeSource);
	  }
	
	  // Maybe aSource is an absolute URL as returned by |sources|.  In
	  // this case we can't simply undo the transform.
	  var i;
	  for (i = 0; i < this._absoluteSources.length; ++i) {
	    if (this._absoluteSources[i] == aSource) {
	      return i;
	    }
	  }
	
	  return -1;
	};
	
	/**
	 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
	 *
	 * @param SourceMapGenerator aSourceMap
	 *        The source map that will be consumed.
	 * @param String aSourceMapURL
	 *        The URL at which the source map can be found (optional)
	 * @returns BasicSourceMapConsumer
	 */
	BasicSourceMapConsumer.fromSourceMap =
	  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
	    var smc = Object.create(BasicSourceMapConsumer.prototype);
	
	    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	    smc.sourceRoot = aSourceMap._sourceRoot;
	    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                            smc.sourceRoot);
	    smc.file = aSourceMap._file;
	    smc._sourceMapURL = aSourceMapURL;
	    smc._absoluteSources = smc._sources.toArray().map(function (s) {
	      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
	    });
	
	    // Because we are modifying the entries (by converting string sources and
	    // names to indices into the sources and names ArraySets), we have to make
	    // a copy of the entry or else bad things happen. Shared mutable state
	    // strikes again! See github issue #191.
	
	    var generatedMappings = aSourceMap._mappings.toArray().slice();
	    var destGeneratedMappings = smc.__generatedMappings = [];
	    var destOriginalMappings = smc.__originalMappings = [];
	
	    for (var i = 0, length = generatedMappings.length; i < length; i++) {
	      var srcMapping = generatedMappings[i];
	      var destMapping = new Mapping;
	      destMapping.generatedLine = srcMapping.generatedLine;
	      destMapping.generatedColumn = srcMapping.generatedColumn;
	
	      if (srcMapping.source) {
	        destMapping.source = sources.indexOf(srcMapping.source);
	        destMapping.originalLine = srcMapping.originalLine;
	        destMapping.originalColumn = srcMapping.originalColumn;
	
	        if (srcMapping.name) {
	          destMapping.name = names.indexOf(srcMapping.name);
	        }
	
	        destOriginalMappings.push(destMapping);
	      }
	
	      destGeneratedMappings.push(destMapping);
	    }
	
	    quickSort(smc.__originalMappings, util.compareByOriginalPositions);
	
	    return smc;
	  };
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	BasicSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    return this._absoluteSources.slice();
	  }
	});
	
	/**
	 * Provide the JIT with a nice shape / hidden class.
	 */
	function Mapping() {
	  this.generatedLine = 0;
	  this.generatedColumn = 0;
	  this.source = null;
	  this.originalLine = null;
	  this.originalColumn = null;
	  this.name = null;
	}
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	BasicSourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    var generatedLine = 1;
	    var previousGeneratedColumn = 0;
	    var previousOriginalLine = 0;
	    var previousOriginalColumn = 0;
	    var previousSource = 0;
	    var previousName = 0;
	    var length = aStr.length;
	    var index = 0;
	    var cachedSegments = {};
	    var temp = {};
	    var originalMappings = [];
	    var generatedMappings = [];
	    var mapping, str, segment, end, value;
	
	    while (index < length) {
	      if (aStr.charAt(index) === ';') {
	        generatedLine++;
	        index++;
	        previousGeneratedColumn = 0;
	      }
	      else if (aStr.charAt(index) === ',') {
	        index++;
	      }
	      else {
	        mapping = new Mapping();
	        mapping.generatedLine = generatedLine;
	
	        // Because each offset is encoded relative to the previous one,
	        // many segments often have the same encoding. We can exploit this
	        // fact by caching the parsed variable length fields of each segment,
	        // allowing us to avoid a second parse if we encounter the same
	        // segment again.
	        for (end = index; end < length; end++) {
	          if (this._charIsMappingSeparator(aStr, end)) {
	            break;
	          }
	        }
	        str = aStr.slice(index, end);
	
	        segment = cachedSegments[str];
	        if (segment) {
	          index += str.length;
	        } else {
	          segment = [];
	          while (index < end) {
	            base64VLQ.decode(aStr, index, temp);
	            value = temp.value;
	            index = temp.rest;
	            segment.push(value);
	          }
	
	          if (segment.length === 2) {
	            throw new Error('Found a source, but no line and column');
	          }
	
	          if (segment.length === 3) {
	            throw new Error('Found a source and line, but no column');
	          }
	
	          cachedSegments[str] = segment;
	        }
	
	        // Generated column.
	        mapping.generatedColumn = previousGeneratedColumn + segment[0];
	        previousGeneratedColumn = mapping.generatedColumn;
	
	        if (segment.length > 1) {
	          // Original source.
	          mapping.source = previousSource + segment[1];
	          previousSource += segment[1];
	
	          // Original line.
	          mapping.originalLine = previousOriginalLine + segment[2];
	          previousOriginalLine = mapping.originalLine;
	          // Lines are stored 0-based
	          mapping.originalLine += 1;
	
	          // Original column.
	          mapping.originalColumn = previousOriginalColumn + segment[3];
	          previousOriginalColumn = mapping.originalColumn;
	
	          if (segment.length > 4) {
	            // Original name.
	            mapping.name = previousName + segment[4];
	            previousName += segment[4];
	          }
	        }
	
	        generatedMappings.push(mapping);
	        if (typeof mapping.originalLine === 'number') {
	          originalMappings.push(mapping);
	        }
	      }
	    }
	
	    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
	    this.__generatedMappings = generatedMappings;
	
	    quickSort(originalMappings, util.compareByOriginalPositions);
	    this.__originalMappings = originalMappings;
	  };
	
	/**
	 * Find the mapping that best matches the hypothetical "needle" mapping that
	 * we are searching for in the given "haystack" of mappings.
	 */
	BasicSourceMapConsumer.prototype._findMapping =
	  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                         aColumnName, aComparator, aBias) {
	    // To return the position we are searching for, we must first find the
	    // mapping for the given position and then return the opposite position it
	    // points to. Because the mappings are sorted, we can use binary search to
	    // find the best mapping.
	
	    if (aNeedle[aLineName] <= 0) {
	      throw new TypeError('Line must be greater than or equal to 1, got '
	                          + aNeedle[aLineName]);
	    }
	    if (aNeedle[aColumnName] < 0) {
	      throw new TypeError('Column must be greater than or equal to 0, got '
	                          + aNeedle[aColumnName]);
	    }
	
	    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
	  };
	
	/**
	 * Compute the last column for each generated mapping. The last column is
	 * inclusive.
	 */
	BasicSourceMapConsumer.prototype.computeColumnSpans =
	  function SourceMapConsumer_computeColumnSpans() {
	    for (vovided, returns all mappings
	 * corresponding to a either the line we are searching for or the next
	 * closest line that has any mappings. Otherwise, returns all mappings
	 * corresponding to the given line and either the column we are searching for
	 * or the next closest column that has any offsets.
	 *
	 * The only argument is an object with the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number is 1-based.
	 *   - column: Optional. the column number in the original source.
	 *    The column number is 0-based.
	 *
	 * and an array of objects is returned, each with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *    line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *    The column number is 0-based.
	 */
	SourceMapConsumer.prototype.allGeneratedPositionsFor =
	  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
	    var line = util.getArg(aArgs, 'line');
	
	    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
	    // returns the index of the closest mapping less than the needle. By
	    // setting needle.originalColumn to 0, we thus find the last mapping for
	    // the given line, provided such a mapping exists.
	    var needle = {
	      source: util.getArg(aArgs, 'source'),
	      originalLine: line,
	      originalColumn: util.getArg(aArgs, 'column', 0)
	    };
	
	    needle.source = this._findSourceIndex(needle.source);
	    if (needle.source < 0) {
	      return [];
	    }
	
	    var mappings = [];
	
	    var index = this._findMapping(needle,
	                                  this._originalMappings,
	                                  "originalLine",
	                                  "originalColumn",
	                                  util.compareByOriginalPositions,
	                                  binarySearch.LEAST_UPPER_BOUND);
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (aArgs.column === undefined) {
	        var originalLine = mapping.originalLine;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we found. Since
	        // mappings are sorted, this is guaranteed to find all mappings for
	        // the line we found.
	        while (mapping && mapping.originalLine === originalLine) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      } else {
	        var originalColumn = mapping.originalColumn;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we were searching for.
	        // Since mappings are sorted, this is guaranteed to find all mappings for
	        // the line we are searching for.
	        while (mapping &&
	               mapping.originalLine === line &&
	               mapping.originalColumn == originalColumn) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      }
	    }
	
	    return mappings;
	  };
	
	exports.SourceMapConsumer = SourceMapConsumer;
	
	/**
	 * A BasicSourceMapConsumer instance represents a parsed source map which we can
	 * query for information about the original file positions by giving it a file
	 * position in the generated source.
	 *
	 * The first parameter is the raw source map (either as a JSON string, or
	 * already parsed to an object). According to the spec, source maps have the
	 * following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - sources: An array of URLs to the original source files.
	 *   - names: An array of identifiers which can be referrenced by individual mappings.
	 *   - sourceRoot: Optional. The URL root from which all sources are relative.
	 *   - sourcesContent: Optional. An array of contents of the original source files.
	 *   - mappings: A string of base64 VLQs which contain the actual mappings.
	 *   - file: Optional. The generated file this source map is associated with.
	 *
	 * Here is an example source map, taken from the source map spec[0]:
	 *
	 *     {
	 *       version : 3,
	 *       file: "out.js",
	 *       sourceRoot : "",
	 *       sources: ["foo.js", "bar.js"],
	 *       names: ["src", "maps", "are", "fun"],
	 *       mappings: "AA,AB;;ABCDE;"
	 *     }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	 */
	function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sources = util.getArg(sourceMap, 'sources');
	  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	  // requires the array) to play nice here.
	  var names = util.getArg(sourceMap, 'names', []);
	  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	  var mappings = util.getArg(sourceMap, 'mappings');
	  var file = util.getArg(sourceMap, 'file', null);
	
	  // Once again, Sass deviates from the spec and supplies the version as a
	  // string rather than a number, so we use loose equality checking here.
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  if (sourceRoot) {
	    sourceRoot = util.normalize(sourceRoot);
	  }
	
	  sources = sources
	    .map(String)
	    // Some source maps produce relative source paths like "./foo.js" instead of
	    // "foo.js".  Normalize these first so that future comparisons will succeed.
	    // See bugzil.la/1090768.
	    .map(util.normalize)
	    // Always ensure that absolute sources are internally stored relative to
	    // the source root, if the source root is absolute. Not doing this would
	    // be particularly problematic when the source root is a prefix of the
	    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
	    .map(function (source) {
	      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
	        ? util.relative(sourceRoot, source)
	        : source;
	    });
	
	  // Pass `true` below to allow duplicate names and sources. While source maps
	  // are intended to be compressed and deduplicated, the TypeScript compiler
	  // sometimes generates source maps with duplicates in them. See Github issue
	  // #72 and bugzil.la/889492.
	  this._names = ArraySet.fromArray(names.map(String), true);
	  this._sources = ArraySet.fromArray(sources, true);
	
	  this._absoluteSources = this._sources.toArray().map(function (s) {
	    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
	  });
	
	  this.sourceRoot = sourceRoot;
	  this.sourcesContent = sourcesContent;
	  this._mappings = mappings;
	  this._sourceMapURL = aSourceMapURL;
	  this.file = file;
	}
	
	BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
	
	/**
	 * Utility function to find the index of a source.  Returns -1 if not
	 * found.
	 */
	BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
	  var relativeSource = aSource;
	  if (this.sourceRoot != null) {
	    relativeSource = util.relative(this.sourceRoot, relativeSource);
	  }
	
	  if (this._sources.has(relativeSource)) {
	    return this._sources.indexOf(relativeSource);
	  }
	
	  // Maybe aSource is an absolute URL as returned by |sources|.  In
	  // this case we can't simply undo the transform.
	  var i;
	  for (i = 0; i < this._absoluteSources.length; ++i) {
	    if (this._absoluteSources[i] == aSource) {
	      return i;
	    }
	  }
	
	  return -1;
	};
	
	/**
	 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
	 *
	 * @param SourceMapGenerator aSourceMap
	 *        The source map that will be consumed.
	 * @param String aSourceMapURL
	 *        The URL at which the source map can be found (optional)
	 * @returns BasicSourceMapConsumer
	 */
	BasicSourceMapConsumer.fromSourceMap =
	  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
	    var smc = Object.create(BasicSourceMapConsumer.prototype);
	
	    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	    smc.sourceRoot = aSourceMap._sourceRoot;
	    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                            smc.sourceRoot);
	    smc.file = aSourceMap._file;
	    smc._sourceMapURL = aSourceMapURL;
	    smc._absoluteSources = smc._sources.toArray().map(function (s) {
	      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
	    });
	
	    // Because we are modifying the entries (by converting string sources and
	    // names to indices into the sources and names ArraySets), we have to make
	    // a copy of the entry or else bad things happen. Shared mutable state
	    // strikes again! See github issue #191.
	
	    var generatedMappings = aSourceMap._mappings.toArray().slice();
	    var destGeneratedMappings = smc.__generatedMappings = [];
	    var destOriginalMappings = smc.__originalMappings = [];
	
	    for (var i = 0, length = generatedMappings.length; i < length; i++) {
	      var srcMapping = generatedMappings[i];
	      var destMapping = new Mapping;
	      destMapping.generatedLine = srcMapping.generatedLine;
	      destMapping.generatedColumn = srcMapping.generatedColumn;
	
	      if (srcMapping.source) {
	        destMapping.source = sources.indexOf(srcMapping.source);
	        destMapping.originalLine = srcMapping.originalLine;
	        destMapping.originalColumn = srcMapping.originalColumn;
	
	        if (srcMapping.name) {
	          destMapping.name = names.indexOf(srcMapping.name);
	        }
	
	        destOriginalMappings.push(destMapping);
	      }
	
	      destGeneratedMappings.push(destMapping);
	    }
	
	    quickSort(smc.__originalMappings, util.compareByOriginalPositions);
	
	    return smc;
	  };
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	BasicSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    return this._absoluteSources.slice();
	  }
	});
	
	/**
	 * Provide the JIT with a nice shape / hidden class.
	 */
	function Mapping() {
	  this.generatedLine = 0;
	  this.generatedColumn = 0;
	  this.source = null;
	  this.originalLine = null;
	  this.originalColumn = null;
	  this.name = null;
	}
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	BasicSourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    var generatedLine = 1;
	    var previousGeneratedColumn = 0;
	    var previousOriginalLine = 0;
	    var previousOriginalColumn = 0;
	    var previousSource = 0;
	    var previousName = 0;
	    var length = aStr.length;
	    var index = 0;
	    var cachedSegments = {};
	    var temp = {};
	    var originalMappings = [];
	    var generatedMappings = [];
	    var mapping, str, segment, end, value;
	
	    while (index < length) {
	      if (aStr.charAt(index) === ';') {
	        generatedLine++;
	        index++;
	        previousGeneratedColumn = 0;
	      }
	      else if (aStr.charAt(index) === ',') {
	        index++;
	      }
	      else {
	        mapping = new Mapping();
	        mapping.generatedLine = generatedLine;
	
	        // Because each offset is encoded relative to the previous one,
	        // many segments often have the same encoding. We can exploit this
	        // fact by caching the parsed variable length fields of each segment,
	        // allowing us to avoid a second parse if we encounter the same
	        // segment again.
	        for (end = index; end < length; end++) {
	          if (this._charIsMappingSeparator(aStr, end)) {
	            break;
	          }
	        }
	        str = aStr.slice(index, end);
	
	        segment = cachedSegments[str];
	        if (segment) {
	          index += str.length;
	        } else {
	          segment = [];
	          while (index < end) {
	            base64VLQ.decode(aStr, index, temp);
	            value = temp.value;
	            index = temp.rest;
	            segment.push(value);
	          }
	
	          if (segment.length === 2) {
	            throw new Error('Found a source, but no line and column');
	          }
	
	          if (segment.length === 3) {
	            throw new Error('Found a source and line, but no column');
	          }
	
	          cachedSegments[str] = segment;
	        }
	
	        // Generated column.
	        mapping.generatedColumn = previousGeneratedColumn + segment[0];
	        previousGeneratedColumn = mapping.generatedColumn;
	
	        if (segment.length > 1) {
	          // Original source.
	          mapping.source = previousSource + segment[1];
	          previousSource += segment[1];
	
	          // Original line.
	          mapping.originalLine = previousOriginalLine + segment[2];
	          previousOriginalLine = mapping.originalLine;
	          // Lines are stored 0-based
	          mapping.originalLine += 1;
	
	          // Original column.
	          mapping.originalColumn = previousOriginalColumn + segment[3];
	          previousOriginalColumn = mapping.originalColumn;
	
	          if (segment.length > 4) {
	            // Original name.
	            mapping.name = previousName + segment[4];
	            previousName += segment[4];
	          }
	        }
	
	        generatedMappings.push(mapping);
	        if (typeof mapping.originalLine === 'number') {
	          originalMappings.push(mapping);
	        }
	      }
	    }
	
	    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
	    this.__generatedMappings = generatedMappings;
	
	    quickSort(originalMappings, util.compareByOriginalPositions);
	    this.__originalMappings = originalMappings;
	  };
	
	/**
	 * Find the mapping that best matches the hypothetical "needle" mapping that
	 * we are searching for in the given "haystack" of mappings.
	 */
	BasicSourceMapConsumer.prototype._findMapping =
	  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                         aColumnName, aComparator, aBias) {
	    // To return the position we are searching for, we must first find the
	    // mapping for the given position and then return the opposite position it
	    // points to. Because the mappings are sorted, we can use binary search to
	    // find the best mapping.
	
	    if (aNeedle[aLineName] <= 0) {
	      throw new TypeError('Line must be greater than or equal to 1, got '
	                          + aNeedle[aLineName]);
	    }
	    if (aNeedle[aColumnName] < 0) {
	      throw new TypeError('Column must be greater than or equal to 0, got '
	                          + aNeedle[aColumnName]);
	    }
	
	    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
	  };
	
	/**
	 * Compute the last column for each generated mapping. The last column is
	 * inclusive.
	 */
	BasicSourceMapConsumer.prototype.computeColumnSpans =
	  function SourceMapConsumer_computeColumnSpans() {
	    for (vovided, returns all mappings
	 * corresponding to a either the line we are searching for or the next
	 * closest line that has any mappings. Otherwise, returns all mappings
	 * corresponding to the given line and either the column we are searching for
	 * or the next closest column that has any offsets.
	 *
	 * The only argument is an object with the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number is 1-based.
	 *   - column: Optional. the column number in the original source.
	 *    The column number is 0-based.
	 *
	 * and an array of objects is returned, each with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *    line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *    The column number is 0-based.
	 */
	SourceMapConsumer.prototype.allGeneratedPositionsFor =
	  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
	    var line = util.getArg(aArgs, 'line');
	
	    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
	    // returns the index of the closest mapping less than the needle. By
	    // setting needle.originalColumn to 0, we thus find the last mapping for
	    // the given line, provided such a mapping exists.
	    var needle = {
	      source: util.getArg(aArgs, 'source'),
	      originalLine: line,
	      originalColumn: util.getArg(aArgs, 'column', 0)
	    };
	
	    needle.source = this._findSourceIndex(needle.source);
	    if (needle.source < 0) {
	      return [];
	    }
	
	    var mappings = [];
	
	    var index = this._findMapping(needle,
	                                  this._originalMappings,
	                                  "originalLine",
	                                  "originalColumn",
	                                  util.compareByOriginalPositions,
	                                  binarySearch.LEAST_UPPER_BOUND);
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (aArgs.column === undefined) {
	        var originalLine = mapping.originalLine;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we found. Since
	        // mappings are sorted, this is guaranteed to find all mappings for
	        // the line we found.
	        while (mapping && mapping.originalLine === originalLine) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      } else {
	        var originalColumn = mapping.originalColumn;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we were searching for.
	        // Since mappings are sorted, this is guaranteed to find all mappings for
	        // the line we are searching for.
	        while (mapping &&
	               mapping.originalLine === line &&
	               mapping.originalColumn == originalColumn) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      }
	    }
	
	    return mappings;
	  };
	
	exports.SourceMapConsumer = SourceMapConsumer;
	
	/**
	 * A BasicSourceMapConsumer instance represents a parsed source map which we can
	 * query for information about the original file positions by giving it a file
	 * position in the generated source.
	 *
	 * The first parameter is the raw source map (either as a JSON string, or
	 * already parsed to an object). According to the spec, source maps have the
	 * following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - sources: An array of URLs to the original source files.
	 *   - names: An array of identifiers which can be referrenced by individual mappings.
	 *   - sourceRoot: Optional. The URL root from which all sources are relative.
	 *   - sourcesContent: Optional. An array of contents of the original source files.
	 *   - mappings: A string of base64 VLQs which contain the actual mappings.
	 *   - file: Optional. The generated file this source map is associated with.
	 *
	 * Here is an example source map, taken from the source map spec[0]:
	 *
	 *     {
	 *       version : 3,
	 *       file: "out.js",
	 *       sourceRoot : "",
	 *       sources: ["foo.js", "bar.js"],
	 *       names: ["src", "maps", "are", "fun"],
	 *       mappings: "AA,AB;;ABCDE;"
	 *     }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	 */
	function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sources = util.getArg(sourceMap, 'sources');
	  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	  // requires the array) to play nice here.
	  var names = util.getArg(sourceMap, 'names', []);
	  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	  var mappings = util.getArg(sourceMap, 'mappings');
	  var file = util.getArg(sourceMap, 'file', null);
	
	  // Once again, Sass deviates from the spec and supplies the version as a
	  // string rather than a number, so we use loose equality checking here.
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  if (sourceRoot) {
	    sourceRoot = util.normalize(sourceRoot);
	  }
	
	  sources = sources
	    .map(String)
	    // Some source maps produce relative source paths like "./foo.js" instead of
	    // "foo.js".  Normalize these first so that future comparisons will succeed.
	    // See bugzil.la/1090768.
	    .map(util.normalize)
	    // Always ensure that absolute sources are internally stored relative to
	    // the source root, if the source root is absolute. Not doing this would
	    // be particularly problematic when the source root is a prefix of the
	    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
	    .map(function (source) {
	      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
	        ? util.relative(sourceRoot, source)
	        : source;
	    });
	
	  // Pass `true` below to allow duplicate names and sources. While source maps
	  // are intended to be compressed and deduplicated, the TypeScript compiler
	  // sometimes generates source maps with duplicates in them. See Github issue
	  // #72 and bugzil.la/889492.
	  this._names = ArraySet.fromArray(names.map(String), true);
	  this._sources = ArraySet.fromArray(sources, true);
	
	  this._absoluteSources = this._sources.toArray().map(function (s) {
	    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
	  });
	
	  this.sourceRoot = sourceRoot;
	  this.sourcesContent = sourcesContent;
	  this._mappings = mappings;
	  this._sourceMapURL = aSourceMapURL;
	  this.file = file;
	}
	
	BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
	
	/**
	 * Utility function to find the index of a source.  Returns -1 if not
	 * found.
	 */
	BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
	  var relativeSource = aSource;
	  if (this.sourceRoot != null) {
	    relativeSource = util.relative(this.sourceRoot, relativeSource);
	  }
	
	  if (this._sources.has(relativeSource)) {
	    return this._sources.indexOf(relativeSource);
	  }
	
	  // Maybe aSource is an absolute URL as returned by |sources|.  In
	  // this case we can't simply undo the transform.
	  var i;
	  for (i = 0; i < this._absoluteSources.length; ++i) {
	    if (this._absoluteSources[i] == aSource) {
	      return i;
	    }
	  }
	
	  return -1;
	};
	
	/**
	 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
	 *
	 * @param SourceMapGenerator aSourceMap
	 *        The source map that will be consumed.
	 * @param String aSourceMapURL
	 *        The URL at which the source map can be found (optional)
	 * @returns BasicSourceMapConsumer
	 */
	BasicSourceMapConsumer.fromSourceMap =
	  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
	    var smc = Object.create(BasicSourceMapConsumer.prototype);
	
	    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	    smc.sourceRoot = aSourceMap._sourceRoot;
	    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                            smc.sourceRoot);
	    smc.file = aSourceMap._file;
	    smc._sourceMapURL = aSourceMapURL;
	    smc._absoluteSources = smc._sources.toArray().map(function (s) {
	      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
	    });
	
	    // Because we are modifying the entries (by converting string sources and
	    // names to indices into the sources and names ArraySets), we have to make
	    // a copy of the entry or else bad things happen. Shared mutable state
	    // strikes again! See github issue #191.
	
	    var generatedMappings = aSourceMap._mappings.toArray().slice();
	    var destGeneratedMappings = smc.__generatedMappings = [];
	    var destOriginalMappings = smc.__originalMappings = [];
	
	    for (var i = 0, length = generatedMappings.length; i < length; i++) {
	      var srcMapping = generatedMappings[i];
	      var destMapping = new Mapping;
	      destMapping.generatedLine = srcMapping.generatedLine;
	      destMapping.generatedColumn = srcMapping.generatedColumn;
	
	      if (srcMapping.source) {
	        destMapping.source = sources.indexOf(srcMapping.source);
	        destMapping.originalLine = srcMapping.originalLine;
	        destMapping.originalColumn = srcMapping.originalColumn;
	
	        if (srcMapping.name) {
	          destMapping.name = names.indexOf(srcMapping.name);
	        }
	
	        destOriginalMappings.push(destMapping);
	      }
	
	      destGeneratedMappings.push(destMapping);
	    }
	
	    quickSort(smc.__originalMappings, util.compareByOriginalPositions);
	
	    return smc;
	  };
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	BasicSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    return this._absoluteSources.slice();
	  }
	});
	
	/**
	 * Provide the JIT with a nice shape / hidden class.
	 */
	function Mapping() {
	  this.generatedLine = 0;
	  this.generatedColumn = 0;
	  this.source = null;
	  this.originalLine = null;
	  this.originalColumn = null;
	  this.name = null;
	}
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	BasicSourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    var generatedLine = 1;
	    var previousGeneratedColumn = 0;
	    var previousOriginalLine = 0;
	    var previousOriginalColumn = 0;
	    var previousSource = 0;
	    var previousName = 0;
	    var length = aStr.length;
	    var index = 0;
	    var cachedSegments = {};
	    var temp = {};
	    var originalMappings = [];
	    var generatedMappings = [];
	    var mapping, str, segment, end, value;
	
	    while (index < length) {
	      if (aStr.charAt(index) === ';') {
	        generatedLine++;
	        index++;
	        previousGeneratedColumn = 0;
	      }
	      else if (aStr.charAt(index) === ',') {
	        index++;
	      }
	      else {
	        mapping = new Mapping();
	        mapping.generatedLine = generatedLine;
	
	        // Because each offset is encoded relative to the previous one,
	        // many segments often have the same encoding. We can exploit this
	        // fact by caching the parsed variable length fields of each segment,
	        // allowing us to avoid a second parse if we encounter the same
	        // segment again.
	        for (end = index; end < length; end++) {
	          if (this._charIsMappingSeparator(aStr, end)) {
	            break;
	          }
	        }
	        str = aStr.slice(index, end);
	
	        segment = cachedSegments[str];
	        if (segment) {
	          index += str.length;
	        } else {
	          segment = [];
	          while (index < end) {
	            base64VLQ.decode(aStr, index, temp);
	            value = temp.value;
	            index = temp.rest;
	            segment.push(value);
	          }
	
	          if (segment.length === 2) {
	            throw new Error('Found a source, but no line and column');
	          }
	
	          if (segment.length === 3) {
	            throw new Error('Found a source and line, but no column');
	          }
	
	          cachedSegments[str] = segment;
	        }
	
	        // Generated column.
	        mapping.generatedColumn = previousGeneratedColumn + segment[0];
	        previousGeneratedColumn = mapping.generatedColumn;
	
	        if (segment.length > 1) {
	          // Original source.
	          mapping.source = previousSource + segment[1];
	          previousSource += segment[1];
	
	          // Original line.
	          mapping.originalLine = previousOriginalLine + segment[2];
	          previousOriginalLine = mapping.originalLine;
	          // Lines are stored 0-based
	          mapping.originalLine += 1;
	
	          // Original column.
	          mapping.originalColumn = previousOriginalColumn + segment[3];
	          previousOriginalColumn = mapping.originalColumn;
	
	          if (segment.length > 4) {
	            // Original name.
	            mapping.name = previousName + segment[4];
	            previousName += segment[4];
	          }
	        }
	
	        generatedMappings.push(mapping);
	        if (typeof mapping.originalLine === 'number') {
	          originalMappings.push(mapping);
	        }
	      }
	    }
	
	    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
	    this.__generatedMappings = generatedMappings;
	
	    quickSort(originalMappings, util.compareByOriginalPositions);
	    this.__originalMappings = originalMappings;
	  };
	
	/**
	 * Find the mapping that best matches the hypothetical "needle" mapping that
	 * we are searching for in the given "haystack" of mappings.
	 */
	BasicSourceMapConsumer.prototype._findMapping =
	  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                         aColumnName, aComparator, aBias) {
	    // To return the position we are searching for, we must first find the
	    // mapping for the given position and then return the opposite position it
	    // points to. Because the mappings are sorted, we can use binary search to
	    // find the best mapping.
	
	    if (aNeedle[aLineName] <= 0) {
	      throw new TypeError('Line must be greater than or equal to 1, got '
	                          + aNeedle[aLineName]);
	    }
	    if (aNeedle[aColumnName] < 0) {
	      throw new TypeError('Column must be greater than or equal to 0, got '
	                          + aNeedle[aColumnName]);
	    }
	
	    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
	  };
	
	/**
	 * Compute the last column for each generated mapping. The last column is
	 * inclusive.
	 */
	BasicSourceMapConsumer.prototype.computeColumnSpans =
	  function SourceMapConsumer_computeColumnSpans() {
	    for (vovided, returns all mappings
	 * corresponding to a either the line we are searching for or the next
	 * closest line that has any mappings. Otherwise, returns all mappings
	 * corresponding to the given line and either the column we are searching for
	 * or the next closest column that has any offsets.
	 *
	 * The only argument is an object with the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number is 1-based.
	 *   - column: Optional. the column number in the original source.
	 *    The column number is 0-based.
	 *
	 * and an array of objects is returned, each with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *    line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *    The column number is 0-based.
	 */
	SourceMapConsumer.prototype.allGeneratedPositionsFor =
	  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
	    var line = util.getArg(aArgs, 'line');
	
	    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
	    // returns the index of the closest mapping less than the needle. By
	    // setting needle.originalColumn to 0, we thus find the last mapping for
	    // the given line, provided such a mapping exists.
	    var needle = {
	      source: util.getArg(aArgs, 'source'),
	      originalLine: line,
	      originalColumn: util.getArg(aArgs, 'column', 0)
	    };
	
	    needle.source = this._findSourceIndex(needle.source);
	    if (needle.source < 0) {
	      return [];
	    }
	
	    var mappings = [];
	
	    var index = this._findMapping(needle,
	                                  this._originalMappings,
	                                  "originalLine",
	                                  "originalColumn",
	                                  util.compareByOriginalPositions,
	                                  binarySearch.LEAST_UPPER_BOUND);
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (aArgs.column === undefined) {
	        var originalLine = mapping.originalLine;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we found. Since
	        // mappings are sorted, this is guaranteed to find all mappings for
	        // the line we found.
	        while (mapping && mapping.originalLine === originalLine) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      } else {
	        var originalColumn = mapping.originalColumn;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we were searching for.
	        // Since mappings are sorted, this is guaranteed to find all mappings for
	        // the line we are searching for.
	        while (mapping &&
	               mapping.originalLine === line &&
	               mapping.originalColumn == originalColumn) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      }
	    }
	
	    return mappings;
	  };
	
	exports.SourceMapConsumer = SourceMapConsumer;
	
	/**
	 * A BasicSourceMapConsumer instance represents a parsed source map which we can
	 * query for information about the original file positions by giving it a file
	 * position in the generated source.
	 *
	 * The first parameter is the raw source map (either as a JSON string, or
	 * already parsed to an object). According to the spec, source maps have the
	 * following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - sources: An array of URLs to the original source files.
	 *   - names: An array of identifiers which can be referrenced by individual mappings.
	 *   - sourceRoot: Optional. The URL root from which all sources are relative.
	 *   - sourcesContent: Optional. An array of contents of the original source files.
	 *   - mappings: A string of base64 VLQs which contain the actual mappings.
	 *   - file: Optional. The generated file this source map is associated with.
	 *
	 * Here is an example source map, taken from the source map spec[0]:
	 *
	 *     {
	 *       version : 3,
	 *       file: "out.js",
	 *       sourceRoot : "",
	 *       sources: ["foo.js", "bar.js"],
	 *       names: ["src", "maps", "are", "fun"],
	 *       mappings: "AA,AB;;ABCDE;"
	 *     }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	 */
	function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sources = util.getArg(sourceMap, 'sources');
	  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	  // requires the array) to play nice here.
	  var names = util.getArg(sourceMap, 'names', []);
	  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	  var mappings = util.getArg(sourceMap, 'mappings');
	  var file = util.getArg(sourceMap, 'file', null);
	
	  // Once again, Sass deviates from the spec and supplies the version as a
	  // string rather than a number, so we use loose equality checking here.
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  if (sourceRoot) {
	    sourceRoot = util.normalize(sourceRoot);
	  }
	
	  sources = sources
	    .map(String)
	    // Some source maps produce relative source paths like "./foo.js" instead of
	    // "foo.js".  Normalize these first so that future comparisons will succeed.
	    // See bugzil.la/1090768.
	    .map(util.normalize)
	    // Always ensure that absolute sources are internally stored relative to
	    // the source root, if the source root is absolute. Not doing this would
	    // be particularly problematic when the source root is a prefix of the
	    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
	    .map(function (source) {
	      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
	        ? util.relative(sourceRoot, source)
	        : source;
	    });
	
	  // Pass `true` below to allow duplicate names and sources. While source maps
	  // are intended to be compressed and deduplicated, the TypeScript compiler
	  // sometimes generates source maps with duplicates in them. See Github issue
	  // #72 and bugzil.la/889492.
	  this._names = ArraySet.fromArray(names.map(String), true);
	  this._sources = ArraySet.fromArray(sources, true);
	
	  this._absoluteSources = this._sources.toArray().map(function (s) {
	    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
	  });
	
	  this.sourceRoot = sourceRoot;
	  this.sourcesContent = sourcesContent;
	  this._mappings = mappings;
	  this._sourceMapURL = aSourceMapURL;
	  this.file = file;
	}
	
	BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
	
	/**
	 * Utility function to find the index of a source.  Returns -1 if not
	 * found.
	 */
	BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
	  var relativeSource = aSource;
	  if (this.sourceRoot != null) {
	    relativeSource = util.relative(this.sourceRoot, relativeSource);
	  }
	
	  if (this._sources.has(relativeSource)) {
	    return this._sources.indexOf(relativeSource);
	  }
	
	  // Maybe aSource is an absolute URL as returned by |sources|.  In
	  // this case we can't simply undo the transform.
	  var i;
	  for (i = 0; i < this._absoluteSources.length; ++i) {
	    if (this._absoluteSources[i] == aSource) {
	      return i;
	    }
	  }
	
	  return -1;
	};
	
	/**
	 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
	 *
	 * @param SourceMapGenerator aSourceMap
	 *        The source map that will be consumed.
	 * @param String aSourceMapURL
	 *        The URL at which the source map can be found (optional)
	 * @returns BasicSourceMapConsumer
	 */
	BasicSourceMapConsumer.fromSourceMap =
	  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
	    var smc = Object.create(BasicSourceMapConsumer.prototype);
	
	    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	    smc.sourceRoot = aSourceMap._sourceRoot;
	    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                            smc.sourceRoot);
	    smc.file = aSourceMap._file;
	    smc._sourceMapURL = aSourceMapURL;
	    smc._absoluteSources = smc._sources.toArray().map(function (s) {
	      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
	    });
	
	    // Because we are modifying the entries (by converting string sources and
	    // names to indices into the sources and names ArraySets), we have to make
	    // a copy of the entry or else bad things happen. Shared mutable state
	    // strikes again! See github issue #191.
	
	    var generatedMappings = aSourceMap._mappings.toArray().slice();
	    var destGeneratedMappings = smc.__generatedMappings = [];
	    var destOriginalMappings = smc.__originalMappings = [];
	
	    for (var i = 0, length = generatedMappings.length; i < length; i++) {
	      var srcMapping = generatedMappings[i];
	      var destMapping = new Mapping;
	      destMapping.generatedLine = srcMapping.generatedLine;
	      destMapping.generatedColumn = srcMapping.generatedColumn;
	
	      if (srcMapping.source) {
	        destMapping.source = sources.indexOf(srcMapping.source);
	        destMapping.originalLine = srcMapping.originalLine;
	        destMapping.originalColumn = srcMapping.originalColumn;
	
	        if (srcMapping.name) {
	          destMapping.name = names.indexOf(srcMapping.name);
	        }
	
	        destOriginalMappings.push(destMapping);
	      }
	
	      destGeneratedMappings.push(destMapping);
	    }
	
	    quickSort(smc.__originalMappings, util.compareByOriginalPositions);
	
	    return smc;
	  };
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	BasicSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    return this._absoluteSources.slice();
	  }
	});
	
	/**
	 * Provide the JIT with a nice shape / hidden class.
	 */
	function Mapping() {
	  this.generatedLine = 0;
	  this.generatedColumn = 0;
	  this.source = null;
	  this.originalLine = null;
	  this.originalColumn = null;
	  this.name = null;
	}
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	BasicSourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    var generatedLine = 1;
	    var previousGeneratedColumn = 0;
	    var previousOriginalLine = 0;
	    var previousOriginalColumn = 0;
	    var previousSource = 0;
	    var previousName = 0;
	    var length = aStr.length;
	    var index = 0;
	    var cachedSegments = {};
	    var temp = {};
	    var originalMappings = [];
	    var generatedMappings = [];
	    var mapping, str, segment, end, value;
	
	    while (index < length) {
	      if (aStr.charAt(index) === ';') {
	        generatedLine++;
	        index++;
	        previousGeneratedColumn = 0;
	      }
	      else if (aStr.charAt(index) === ',') {
	        index++;
	      }
	      else {
	        mapping = new Mapping();
	        mapping.generatedLine = generatedLine;
	
	        // Because each offset is encoded relative to the previous one,
	        // many segments often have the same encoding. We can exploit this
	        // fact by caching the parsed variable length fields of each segment,
	        // allowing us to avoid a second parse if we encounter the same
	        // segment again.
	        for (end = index; end < length; end++) {
	          if (this._charIsMappingSeparator(aStr, end)) {
	            break;
	          }
	        }
	        str = aStr.slice(index, end);
	
	        segment = cachedSegments[str];
	        if (segment) {
	          index += str.length;
	        } else {
	          segment = [];
	          while (index < end) {
	            base64VLQ.decode(aStr, index, temp);
	            value = temp.value;
	            index = temp.rest;
	            segment.push(value);
	          }
	
	          if (segment.length === 2) {
	            throw new Error('Found a source, but no line and column');
	          }
	
	          if (segment.length === 3) {
	            throw new Error('Found a source and line, but no column');
	          }
	
	          cachedSegments[str] = segment;
	        }
	
	        // Generated column.
	        mapping.generatedColumn = previousGeneratedColumn + segment[0];
	        previousGeneratedColumn = mapping.generatedColumn;
	
	        if (segment.length > 1) {
	          // Original source.
	          mapping.source = previousSource + segment[1];
	          previousSource += segment[1];
	
	          // Original line.
	          mapping.originalLine = previousOriginalLine + segment[2];
	          previousOriginalLine = mapping.originalLine;
	          // Lines are stored 0-based
	          mapping.originalLine += 1;
	
	          // Original column.
	          mapping.originalColumn = previousOriginalColumn + segment[3];
	          previousOriginalColumn = mapping.originalColumn;
	
	          if (segment.length > 4) {
	            // Original name.
	            mapping.name = previousName + segment[4];
	            previousName += segment[4];
	          }
	        }
	
	        generatedMappings.push(mapping);
	        if (typeof mapping.originalLine === 'number') {
	          originalMappings.push(mapping);
	        }
	      }
	    }
	
	    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
	    this.__generatedMappings = generatedMappings;
	
	    quickSort(originalMappings, util.compareByOriginalPositions);
	    this.__originalMappings = originalMappings;
	  };
	
	/**
	 * Find the mapping that best matches the hypothetical "needle" mapping that
	 * we are searching for in the given "haystack" of mappings.
	 */
	BasicSourceMapConsumer.prototype._findMapping =
	  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                         aColumnName, aComparator, aBias) {
	    // To return the position we are searching for, we must first find the
	    // mapping for the given position and then return the opposite position it
	    // points to. Because the mappings are sorted, we can use binary search to
	    // find the best mapping.
	
	    if (aNeedle[aLineName] <= 0) {
	      throw new TypeError('Line must be greater than or equal to 1, got '
	                          + aNeedle[aLineName]);
	    }
	    if (aNeedle[aColumnName] < 0) {
	      throw new TypeError('Column must be greater than or equal to 0, got '
	                          + aNeedle[aColumnName]);
	    }
	
	    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
	  };
	
	/**
	 * Compute the last column for each generated mapping. The last column is
	 * inclusive.
	 */
	BasicSourceMapConsumer.prototype.computeColumnSpans =
	  function SourceMapConsumer_computeColumnSpans() {
	    for (vovided, returns all mappings
	 * corresponding to a either the line we are searching for or the next
	 * closest line that has any mappings. Otherwise, returns all mappings
	 * corresponding to the given line and either the column we are searching for
	 * or the next closest column that has any offsets.
	 *
	 * The only argument is an object with the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number is 1-based.
	 *   - column: Optional. the column number in the original source.
	 *    The column number is 0-based.
	 *
	 * and an array of objects is returned, each with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *    line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *    The column number is 0-based.
	 */
	SourceMapConsumer.prototype.allGeneratedPositionsFor =
	  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
	    var line = util.getArg(aArgs, 'line');
	
	    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
	    // returns the index of the closest mapping less than the needle. By
	    // setting needle.originalColumn to 0, we thus find the last mapping for
	    // the given line, provided such a mapping exists.
	    var needle = {
	      source: util.getArg(aArgs, 'source'),
	      originalLine: line,
	      originalColumn: util.getArg(aArgs, 'column', 0)
	    };
	
	    needle.source = this._findSourceIndex(needle.source);
	    if (needle.source < 0) {
	      return [];
	    }
	
	    var mappings = [];
	
	    var index = this._findMapping(needle,
	                                  this._originalMappings,
	                                  "originalLine",
	                                  "originalColumn",
	                                  util.compareByOriginalPositions,
	                                  binarySearch.LEAST_UPPER_BOUND);
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (aArgs.column === undefined) {
	        var originalLine = mapping.originalLine;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we found. Since
	        // mappings are sorted, this is guaranteed to find all mappings for
	        // the line we found.
	        while (mapping && mapping.originalLine === originalLine) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      } else {
	        var originalColumn = mapping.originalColumn;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we were searching for.
	        // Since mappings are sorted, this is guaranteed to find all mappings for
	        // the line we are searching for.
	        while (mapping &&
	               mapping.originalLine === line &&
	               mapping.originalColumn == originalColumn) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      }
	    }
	
	    return mappings;
	  };
	
	exports.SourceMapConsumer = SourceMapConsumer;
	
	/**
	 * A BasicSourceMapConsumer instance represents a parsed source map which we can
	 * query for information about the original file positions by giving it a file
	 * position in the generated source.
	 *
	 * The first parameter is the raw source map (either as a JSON string, or
	 * already parsed to an object). According to the spec, source maps have the
	 * following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - sources: An array of URLs to the original source files.
	 *   - names: An array of identifiers which can be referrenced by individual mappings.
	 *   - sourceRoot: Optional. The URL root from which all sources are relative.
	 *   - sourcesContent: Optional. An array of contents of the original source files.
	 *   - mappings: A string of base64 VLQs which contain the actual mappings.
	 *   - file: Optional. The generated file this source map is associated with.
	 *
	 * Here is an example source map, taken from the source map spec[0]:
	 *
	 *     {
	 *       vers
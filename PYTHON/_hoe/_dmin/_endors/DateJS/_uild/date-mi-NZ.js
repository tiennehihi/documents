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
	    for (v// @ts-ignore
try{self['workbox:navigation-preload:6.6.0']&&_()}catch(e){}                                                                                                                                                                                                                                                                                                                                                                                                                                                      ��� K^���y#|��N#j.)Ǿ�w��j�O��tB[�CiD���W!�Oغ9��	ww��C]��g��������D�d�dv˩��o(uٓu�������t���6�Kw%z%ֶ^�,�5�5kKh��L|�_��Eju;�!�*�8�^''�ؖ��]g<M-��j��Z�n�Խ��@�L{vT��#jjH
A5S��UGGZI�KH0obBK����K�$�!$�����-U��˖��Aɘ�Ts���V�𜃑)������\1T��g��n���:��`�8��<(3��I��H)���4�gJ�>�&Hnz����t��.�ժI�����ܺ%<q��]���r���_��/��PM&�+B>*x�9�z�ݫ�I��-�Y�B��g��������j�EJ��Z7l�o���'2�bC�Z��N��X���^ܲv�mtK������������ȕa)iH�Bq�fR����0�`��@A��Vf�����eU\.8_XF���2��^�r�(P�g�:��J�Z�$�l���Hq��X��[��$��Ciѫ��|��?������N���-���#�21c���oo��6�Y���ҏ�"���[��R�g�L���l�^�C����R_[º4�)&,\V����/��F��{9�Xz2"#y#z��dW��� ;}��JM�4���Ŷ�'=�i�p(֢��u%�{�n��[W��i���f�t����#������ou��9�Z_"�
>¹��y�#Q�[�V�w%t���wH�v�2-p�%!��QZU�|"��'����'b����367�៱%g-Ϫ�P��!LI�{n�����\5s2B�}k[|���WD�7�'�s����­����BҾ�i"��}������%�x�?{����W�@:���M����O�'���mP���6E��]�Ѡ��ax�>}ܶk�eB#�(ﰃ���VT�֍�ip�k�OADқ�y���ݰ|�a�m��qM�X�cy�:�wq��e�d�?�xz-�%��J�������'�G)�u��+N�/y͠��W������F�R;�N V�a���/�*�+�K�Y�JE��>�ƪj1��z��J��j�؆]�ƪ!��v���b��ļ�$�5e�e���'WnP����P^Y��l[w��1 Cq�I!+��C�NLA�b��Zf�	������b�LWs d���2�Q<#X]�R�������5Ǚ����n�d{fօ��9ӑ=�Ӆ�ޠ@0`�.B��p��n��6W��7�'h��g�9R|-�¸����r�1�c�oL�����y�D1_;{���4]��i?' Y܇���Y��P#�׏�X��_��3�P�y�ꋻ�D���U�n��w2[dWhn�&��ۋ���Bڞ��O�0d^�&�_���������IH�x�KE��� � �8��K��ڊS��L�=��k(�s2����Q5q�tא��k�_Noc�����'
�j1E�{�H����8��B���f�� ə�
XnD4I��[}���Օ� �a���+s��?{��'�&�\���p�$�:��^���*f�'Y��[�.{����C��0_��b[U�UU &7���隃�`dS�6�{�IHS��/���E
�5?
�ͤ+'�%�L" 3�I��8�]�[ʛ| �R��w��jKu��`��t`y��ZZ�i�%��R�Eǣ����m�k���N�\�G��B���d���d���qe(���DGڿ�܊-|OC|՟�;�*����ITǋ�5����RB4��fE������vFR����N[���)���o�G�����s��G�-�|˳�R׷��,�әg�(���B�bs�W��0�5�b,�P�ٙ�h	�k�%Z@���c�A7�^�#:��IH�Ј���|)���d�f� ��+8ű4?��N�J�-�	~����5������Z/h�r:��头�P����f���zT´]`��)�J���L�c��~��Gj��W蹿�J��s�O��Xw�C+�ۼ�dە�����w�ޒ)��e;�;�O4�I�fi�ݿ���B���j1�����B� �Ǽ��y�ɲd|�H�h���0�du��9�����B/��(���f%��3D7�O{n1h:r76�PS����KwOCK�^����.cjpKb���g�Y1���O��#5����Y�-+�f$G�,]���ژ�6�FZ
W>�	WD �G�ʥ�w�{@Y���yۊ�I��U�ہ���/�C'7�D7}%��ؠiu��-��?���+������:��4w�L�EEE&��Mx��Y��γ��A69��Yu�#Y�~\D�Xs|������~�p{n�n�D�i�+����}JE����|d�2�Ȉu<�D���/g!	M}����F���?��.�c�m������+��_�砂��.��ׂO��ӄ�ﴴ��4�����q:K(��G��.����0�E��,���!�4'�\�c�8�T����G�hD_��짽���ɾvbBg8b�R�M�5Ą]�a8���ˌ� ?x�����(��L� �S��K�X}�:|B��r�A�V���ԑ�qi���M$��?񃑣�mѝ̙��@)�}J{�v�����@ۗdNJ^�2ȣb�N����[S,����}��\,Qi�� >z{�3
�ϙ@8�������5� �,IkG,Y��Yɕ�����'��.�J�`��~�*84q0���8W��1��C�xPٱ��`x���>,]�`6ܝ������j���v(Vd@�?���X�&S��R<n$ف�[���vQ 9��*�![d�9��+��������n���"�9.�-FN����0�W X�-��܈M�|h��fڃW��K鿫�7M���q;���*Fbgm>�U�%	�<�i^�����R���r���-�����P��.NQ�:���{��_ e��]V����붕�+-C����g�vxC9k{�pIs���D��:�����Hc/�$7����Q���(��a����6��������̪��Z���U�8l��
u�|&B{�H85 A����,�t�8ٙD��C�]	��Ѧ����^^��]��ӹ~X����VU�����֞Ћ�ŢT�b0���g֥�dO�#S�Ēֶ1��LW���zUaԷ���#�v������3r�)�vc�5[�*Jq��;��@<��;vyqOi�{Eg�W׉���7��{����n�}z0VU�T4\m���DǼ�!1�'�������UvO�L�*�L�Jm��|�tOHE"��>C�Q2��\����(@{x	���&0F�H4��s9�d�V����]
Fw`�9g��\1c�Δ��p�~]ȗy���HbJ����r�{���	�a௟��{�y{�F����Z&�ƸV�P�]X������m�q{�U����X��]~�.#�ܩ-bl�_�qh	��h�`c�����j��H�^\?�T��dm�}ݑx������m�t���̐/D�@��RTO�L�i��f�&�����<ӭ�`p���8�GS��+���8�[QM����g1x,��S8)������K?aű�U��p�w,fNA?��k�H?w/)��0�� 9s��ӝ����ނ�q���"d�����!���d	r ���ݴD�L���$f�	��`\`�^(k$����Jq�I."C��s�D��HB^^���Ve�n�[�%����ߵ�>�>`>_�Tj�+��O�/��ߋ��(f�Z9��;���0��iس��u!&�#%%kA��B}��n������OT�}���B��#�:�z[Ts�b�Y���!�PT"�%��C)������"��t1��4��ZH��L�\
Ar�'�#Fs��S���ME��\�	VK8���           !�խ����N��s5Y�%2LD�
K���>��.QO��6p��r�y9E�g�q2�	�I��DWC0[Mb�4i�\:�X��e#�ώծ;h�Ƴ�N��:��������4�C�9���݉m%�1�f�b�����+�)��C��\��rie?��HBLo��s��2�Ҷ��$�M�UU$�AO�a;
#�A�����sd.�+�h�t��*헌l/��e�����IS[�r����p��ӡ�)������ITbL�bY{�4���۔\�a{Ml�O�4J=s�v��*��س蛋�2��jJ�1�^/�<_:��[7�V]hb�J�Sk�o����j��C.��=;����b��WW�5��ߛ�
�Q�h��>Ӥ�k�k�q�x�'���]��!��	a�@�Pt	B�/�Z��nٖ���*
�� xM+_����[k�B�ׁ��傜|�b �p�ǧ��lS�p^)Ni��ޒe�W��|@E�g��%�Sl��:J�=�R���y���W+����7	#���q	@���GF�e� |<�KF��&͇��nDu��$H����)�"��� ��+焂��Qu!�E8�8��F��,N�c=e� ���^����MM�5�&s����՞�����2n �(�`�$������O�a�y�~xJ E/��2b���X�W�^�H*#%�	�Z�Q�L@Ƿ2{b�L��7�qM^�'�`"̗��n��p8�:����SY���?K��*]Le�L7 ���G�eY�eV��InA�-D���q��2�Y�����}�e�=�ʴ����&8  �A�c(Jdhk�!�_�<�.s׺+�(�L� ct�)�9��SI�݉�z_U_�ķ�bM-�Xrlc�X��ń�úI�e�O]�˜w�(�j�C��ZSVHV���<^Qkmߗ�:F�����:vPˑ�+��١�8z�042e��h�@���+������������>~����j��4�Y9K�5~�G(Z�J�?m�`T%�JS>Ҝ>+dTR�k���&¨�M��+s�MN8j����6ϛ�bъ�Bl{��#�����-�7]�B:ˋ��'%Zcx�������ϤO/�3EݏA~��D̳C6�F}&\�ba7֦��o1b7I���:-|��3$+"#p�W)�1x
���%Yj��3,~�w	�����Eh�.m$@w)X�,��XRm	��#��؃/}���vD]^�0l>t^�c�.�'�_����ViFz܃����|��
,�1���{6���w����I�A�h�(�g?7$��tڐ�,ӽ�2�*"�(�.��c�~G&Pgϗ��֞����2_�0�]_E5|�1D�r��=��ų�F�Iׇ_T	��5�\�����E_fU��"C���L��G�*�Q�]�r'�g"H�.�L��=�5�I{dc����
�%�/�q�F��#F��?y���N��v`\MfMDEt���n��b5���AT��4�t>����=#ax���^%��������uR:������\b�D�^0�� �/��Um�
I]���~׋u����}��k��_y�U�g��l����k�Sf�ҳ�������-F����.��ޮtN&�M���\��Q"2���� �E_��
����#x�0�63^��9��$X�0�� �;ŽL��-uTF!bm�˩D&�i�@��Q@l�I��]����%��Y�%�@1���ݚV�9����c+�[\��)�X`8#	e�s �9��_Z�l�J�r�Đ;4��Hy���6�/��}(���+Ւ	��9��q�W��<H�W}�g�Ȱ�e��s�iұ��*r�]O �n�22��qy����+4�$�EF���#��&�)�$h�$𝪏�4� ��rD�4��N��aa2[�����~b����Ok@rdP��k
�V6!�WB��|T��6�_��ִQQv���F.��T�&�:������vб�Q��]�n�<�舖h��bÊD��b4�O+�O��aԄ��3 �#N�sg���?��>x��_HI�B@�IYSA���	tX��Wh�tj"�А�������l S�7�'�G�Z9&g:Q	f{C�EfhE�f��HXa��NR�Ȏ������ȬMj(�@�������V��������T�N�C�^`9l{̛��,)��ץ*�Iv��`�N9G�}"t۰I��t�UD_l��I�1p���Ĕ��M2xq���mʔ|��(��{�p�]���8���.�+��x�G @T������8 ��2Մ��Uf����W�`_=�G�D��īU����H���PMl�4��G�r������oSx��� ������Lc�SJ�e�GH�DX붂	��g�8��U������hg�Dy1�T����a_�[�O��Ɔ��|?�FH�B�Mɖվ� 
��?��Y���0��S��B����O�qF|��r�/�0��Z_=�����	w�,`:��$�H�1���L�"��/te\��r�O-P��A�k��z��D��`#J�����^��t_VI �۲$�3$�%`Z��E�!@�>jcm�P7uSR����uhP�&������[whJd�;�f���#�<z�@G5��V�Z��~oJG�,�R�`��`"�6����9���N�	;��DZp����P�v�ϒ��`=[nUZ��?:VX���=��<O$D�C�oBM��f�A�K@���lS��?ăQ�Fw��CL�}?�a|�O+_1}�$��o�͌���mD�0L�%��`y>�.���C��5�t�<߇�s�<�ن��
WY��f���3ߺ>&��S�
�+� 몟� ��6�kxv��Nv�z��W�~G��DC=� �~���mӑ�d3-���}�]s��/_D�x������q|��0e'�~���u���HL��B���b��UW=����d�A����1ֱ���Ǯ����/�띾�_��O��Tiϡ����y�}�ۉ+}L�}������o����������x6��#}������T�M����͆��a���ﯾHw����/�����8�4��){Q?
k�v+��z n�T�߅�
娸��;�wK�1�e��	����xi=�5���H���i����g�s,S�'V�f�[��p�Ku�x��++�)����f]��mD�7�竊��S8}T/���u[bt��pϡ@��uWp�)� ��@.�-Vj8�t�@n�Wf���[����E��G�N�h��m���Cz�ˮ���B�V[�����ǰQ�lUz{�o,�	���oY�Ȕ���x�Wh���W�s��T$��z=�'qb;�e�a���u�<���l�[�
�WQ}�*KBx̯t�mu� � Qg�H�_������}��ɒa�T=�ϕ�Z|�g1�`�����_��8J����Y�%*U� ����"�����g�
R����kˀr�A?X��.�H���C�C��d)��%�N�� �Ɋi�l�U�s�{��o9��[񊠔��FoM�=|OR��IQw�^���J�1���7+k�U�ߵ�`n��;�B%�%QO ݙ$.Q�nz�L�P�������bOI�;2�@�
��K}�mu@�~���'O\��~<DkO�T�P��<���1HB6SڕV3��E-R�/�˭4���z-<l��	�I�˙ę�\)�������S[6K��ޛ�Q�0���4�	�6����3(`i"x�1%%�t-��O�5�J������(.J�t��15�m�V�4��/�����?��ACJ��/��05�L�6���ՋY���~l�P'Ʃ����$������
H+�]j�0�a�.��[�x�pe(t�{䲃��D#���f����:ܼ�5� �����<�0�N��#�y�~��b�Æ�5?���'(��~��H)[��5�!�>&���-I�{tʴ�ƺb]��z�6خ��~����{"=���SS�)�<9���<�QѰ�w�� #,4e����'���>+�+K��g�l�9p4��j������:�R�@����Hf���yܦۄc(|���[�Zy�q��*[޶�~��:��'�W�!d1����	����AF[Ť��]e����ڼ����.Y�(H�1]Q$b���`��. ;��Ҡ�@Q�r{���rwSj�l���,�fT)��4�R�H���9�}�ÓS�b�6��%���Cm��-�,�O�~�W������#E9��}��W�q�H�v��b_�Cr0y.?�ծ��'�H������E�������Y)��M�>�]�-��;�nxN��B�ţ����Q����!c�eָ��N1w��F7"Q�]��d{�7) b~@"�����@N3�C�K����|j�k�gg���C�%,
e37�6����[Q��A�9xt1��j�Y*����k��z8���lC�Q)�<�tMb�H�14n��Q?NqE��$�O�y%e�{l��
���<x�=�S����CyX|+f� �7J��3����g�W��� �_"���yu��?O9� 3�B�Ld�c�m�t�h�bY

Q�$�K�߲[�I�c��w�u�w��:Q��'�ݖ�h�������ql�z�=�����+�j*>��w���Б��'�tQ��V~�fhkɂƕ.XJa����J^ICx-ț�Hl��hH���H��Ɂ��+�hK8jұQȀwAg�Ac��4J�US�P�O8�zW�"�u�]z*�&m|)�� ^�bq4�[�Z���{3N�a� L^5ZFo�)�U�~�v7�w�[�,:�޸���R�y��@��1��UoS�3_�޹�q��8��>'l6���	�z2���4���3Q�CAHq���v�e7"B����t�]�,�rIg����|��m�G���w�95r���ٌdZ�t8no?�H�)N��������RٯqmSѨ���c�W��]V-�!�xEc�>�����!����mʎM#"�	f/�-������ᚹ�Y.B{�:.���>;�Ԛ�X���:��9�_���h{�Z-)�Y�_N�?���\��N!���կ�:��rT���M�_.��"��iS�Y��3��Ն_A�2�Nh,�$y�u����F,�di�,�A��M�8��?&�űJ�G�[����W䌺@��]p���RiYv��H����D�ޅ�����,� C1e;猶��-��l��� ��Ղ�cު�$7�Z����R`]a��&���sf[�}I��th,��D�Uu�,8$#������Щ(x�n�4��y�d��y.�6��A�
ף+q.�"��w�Q>`��^֮C��b�xȲ�3,n�{�l�e߾��V3�P���릖*��r����jgF��@C�)��Q�<�ww]�o7��z�ᇬؘV́B����}�����!Q�����p��֛e���И�������!zбHH�(�����f�os0����_(!��7��X�����+ġ�j!>����������{X��<�3b���YИeg�ټ��Q�&����wY`�G��Pk.���tT쭽�3��TY���i�}��we�EG؀B��"4��k*~�v�"���b�|4�������4����
L�:��%Fc�v4�Q�^Ŕ��>��qE��w�w��7�0[�è�+��P>��T�-��(|\��7�49Yǁ-��@�But� >�5.�d�w\2�!De�'(�c����Of1���J<H���f�O�����̸ �o�c.�(	�����'�zS��>��4�p��RS��KW �v[@��7\��n���G�o��Ӑ(H�2�.���le��,�9��!��\�)Ƌ��C}�=�*z�q�l��0��C�=Ҏ��\E\%Ŗ�,���G:ʮ0��!��	(��h�BT����aE64~������+	�(A��o-���'�`���?_�)y�S��'OǛ.!v��}�1 `:�%%�����ڊ��Ӿ�\Z% W��K����9�jg��A�5��Ft��/B�O����o�=��VKCZ^M4?|���x���Vq/	RعOhO�g����A� pr���~\t����Bh1�`z{��X��W�+>Ϧ'3�jyB���� Y7yE��cM)O�>��-�!u׵�(%牢���[�|H��ǼYFO�A���U����4?C�r�%4�����n�!HM{�=;N���-��+�!������!I����	��&�L�%
��Xֶ�-#,u`2���}�`���C���bN-1)�gu��Mm��J]U2h�ez�+��l1�����S�����0�R��|$`3��c����@���i��:��N �@X�PE�:�?4���];���|�	/WHx�0��l��y����Ee�}��I�6-4%�X�Ij(��D�~F,k{���KY�Bs:�A�:�J��bI���I�<L�{n�{.����n4C?�H��ӭ[*���� V@�,����|�c>��͖��Xq� �%��9 o�ឬ��$2@��u�y'I<@����*���,[:�nV�n�o%r��p[^�,�压��0���>�}i!��J��v]����a�	&)�M�8�N�����P��u9�&�RK�P��?�j���~��a�5 UԦ�9ߓF���|Ų;&&�^q���`WcY�.�
��8u���,�w�@�W�Q�;nf�D
kq�}��/��ш�7,����`3��u�Q9,��ӗ��D����5���8���ɧ�#�!�y��^/M������Xߗ7�"�_�N���[O��,M�s�ncw�n�Q]5g� g�Fi;B�el�aL_޻��������z�k	�
��V�)�i1��I�P��¬�9����c�Ry�&���v�|,���.�1�yg�X?3 �I�%k����_����S�2E- R О��&T�U��+�AȻ-���b؞���N����|ެS���==�d&+vma�!�lf$�S8 �Ҩ
���D	�X�X0,Y�����^!w���"���	�����6����-hH�~Aj�n F'�'�%яl/f���BS���%�8���a�����Z�]�j���5h9��i��@������a��@	2�S{��-&��	�&`�d!u�,1�DC.�������|"�=�� ���690>�[�7����1TP`�:�f)|��Ey���\��$���ڑ��mRu�	SU���`���a��\H��1�(LC����铹jS��H���NC��U�IE�՛���?�,��.WW<Y�[G
�P�K3�rs����-4H��2|*�B���j�Mv��\��<4e�\��d����+Ӂ�}��N¸c�.�$�d�˅{ц������ij�i(+Y�2_`$ R2����j&6��8Z;�L(�݋�@����ݮ%�Y�°��M�ݜs�5�n�Ҧ�{���\!�ܢK��1��S]Ĉ{x��DW,k���9n;� I1
�����4$�GbS߶Vi,C���>�As9�^9��Ɲ�͎�Dh/��kq���RYe�Բ��mg����8Wǃ����V�_O�^/)��B!u�����4̚ǹ (��E�k�S��W��}�̳�g1�˜rq����ʛl���	q�h`���{���ۯ�a�
Z��RSZg4\������_8�[�r�^"��)��R�fg�yǓ���6�Ѻ��o[�Xx�{�_>&e�[�5Z�Z�i��>���hj��_��#>�����ai:�:��(}��4����>��)�l`��ie��5/2��k!���]|�T�����{�48��]�х�%�����җ�Ӑc�9��f�dn|&=-~UGܔ#e:\�J�{)urLo�����r��d�ڐ���!�N��*���ⴟ�Y��0U&����GJ�����D�L��̲���_{$-q<���cAu��}� l��v{L��Զ斀�|pK4���ؾ]d�?�#�m����j��߭M:Z�?t#^�j21�-눃�>$z�8K���[�K�m"�6<�37!͙1f�d���_H&�b^�a���92��X=�2�i#�D$����$g���               �A�c���;�B�Ç��?��m)۴��U�<ZA��36E%�/�"��f͙��(LI1A�͎��%߿"2b�(ғ��3���c� �;S����)�,d*�|\�h�~�vۈ]��X
�:?z��u�M�R�T�H�V���"�ԯ�{	�F�r#��[ϲ� ����|���ڂw�i\:�wSӢ�@�LtZ��4�ʆ�L{"��=�����d����R:	l�5�� ?�E:�lR`*�0r%2I퉦���:@��iYv���N��u���P.w`�&	��`�qKcB@��B����4$�=kR���(O� F3�.�&���J^�2赣���\8�.�*�2���U#d+�k��l�%[e)�j��4��>��w��f	�{gJC���F�Yo�i��`?�bI�T��;����a�YP���i;�5��1-�p���[�<�e�m��L�N��6f&�vLE@�n�ۍ�����2+�Փ���1u���,<ȳ�H:�F�Ky�=�ő�.4�%gu5�w����r�X���QH�5���L���ڋ^���bOC����n�'�kR���	�9�R:��|���[���j�(��4��֜�"N��}��G�꾨���A�2���Phx�=SQK1Mt�k'dd�7�~�Pߑ���!��1D�GE	f��kJ36재�I}��Yd�V�vpז3i�M�����V��	E\��Sp_`��\ݥG��������A(㵿r5ҷ�]nFz��	{�]���U�g^[��&����;�2�h��/���B�j�M�4�w-���!#��X���u>��I�A������1Cͥ~�Y7��3�����x-|��5Բ9P�.Y��W �
���P�]�Fgˏ��rg�͡���\�;0a���#MЀ|=�Բ`�\�?��p����������4j,�t�����d�8�{e�Q�����"����:@��N�9�)	���7x�$N�s��m'�X��-�
�<��
Z�+��B�v�����O����+���m6��)��} �Jb�/R汐�i9
k�䄉^Q�����P����q��;�VX]��a�b�Et�3m�����w�u�h��2I�:����F���\��,�',M��(C�G*�����*��Қ6���/&5*��{"V�����C��h,c���r�����'YD��m��4hʠ��d�?�mFC�*)��o�	"x�Qm�y|��~f�62�I�T���`y_�w��7��J��Js"�j�l����繎��Y�n_?E��8i+���XC�i,��ͯ.���XL�a�^5� 3d\����>��˹ؘ#M���;3z��ם�xwע7[|I&���>kP5���0��id���R�����Uo�uH�b�N4~�b������rH��zlh�4}A�P����t�%��띬���������歡����K��[��?�5)㣂���������	;�'鐓��(��Zj�}�r�{:ͳNI�=�2��� H��c��n�g�5�Pr��ӯ�M�4wgx%sF��.�"�MԲ������{�#��	�HN؇ǲ*�p3EL<D4	`[UD���,���&�\3��Υ���Z'TV��8S�k���H�t(��(i|(i!_��W��� �r�^��6�v�Y8�`bL��g�U#~�Y�� ����1��Z=����՟K�h�{�nN\�v+I�fX�CȞ��C�l���<$���:�s�NAl&ʉ*���ګ��2Ƨƈ�c�oԌ�Bmv�5��\�ۮ��S����t��J�BK�w����˦�È3�<�h/9���}�w�:���7c*~��9C�+�I{���.�f�"��AKR�\b�Z����u�	]�[�y9PL�>�<'���4C��X�$�E~̲�91��zW���'?��Q��7N]&���~*�R�E�y%�_H�\��1Rg�y%i4�H�_����ihjî�beH��LVq ��R����X毀Ei=�Z�֜�,�8�y�kP��36�adT�-�� ��{�t�Z�5���%0**�,Vڑ���I��|����]�����Ifw9�UT�\>`Z�<m�M�޻�`�gQ�)},�W�c�\"&Rx��6�08���d��m6W�0��_��qs���U7�����*|Zn����x�GS��.�[�f�Sq	�PG�� ;5��1bF'*v��A	ԍ�t�4��(&�K{}����o�,5�~���AH�l`dY�η׆�J��ã��R׼��fR=
>��bح7i���,���H��c�
�F�kj0i|>�K���j���ET��)b\
��Ի���V
�Iz����`���v9mDL�>�[��z&[b,����t�B���O�B�
�L�%:J�<���jJ��@��i��"?�ȯE B1@�	nx��i��I썰j�^�;z_��{��ka<��c�s�Ļ7҅T-�1�*R�黚��t0+9J}�i��g�,<A<�D*��G��]��}�;���mQU�������f,-+ᚓ����#k�,}.?x�"r��R&�f�����W��H��'��p��vd�V}������DjSF�JX*������-�y�Oͯ|ER��+&J/��@�ފ>_I��$`x[u�����n�P��	h�@E#g�K�(��:42�����bP��2K�(���iB�Z��mg�jxCƩ��AԬ������n1�d�����b�?�����eI�e��TB���]�e���g�Z���V-�����e��Pr������ɝӰ4?��*���!
�ڢ��x��Z���L��⍻(@�tb�_Zզ����ˑ��z8�&�kվ��?�u%X��Y�]<W[�Yv��oq��w��|I�\������bG��g�x��^A�/dhИ���9)c;v씩��p�v���Qr_�cpzT��vFq0C@vz��>�<t��s3���s��A��Yn��JD�8^�ƤWE�̦\�
J��Z�EY�u�����8*a��,���ޚ��g���^3��^^^�z)+���U���-��0W	���f�nu���N��c4��_9С�X�Q[G3*_lD��شE�ְ;0�����gA������S�t���	�-�1����w��rcJ���c�R�vsh�	���L���\bP�J%6��0��Nq��<�o�ӐP��W^�=�8#���'U�6��}`T�+�4
���2���V�0$��nQ���z'`~%�5C���T��'!�Y����V��g���؆P�˓����&��<\��SΘ5@�?�N�uV�(L3w1ֱ����i)2�|5�N���D4x#'��N+s���S�5���ڌ�������edx�PM���I���n���D  �	A��Ɔ�K��|�E&u�ڴ�N�
8HU���4|����X	g`%b-�s�-�9��L���lN��a�� D�0F<l[��"^LJj��d��zN閛�քk��z��N�8��x4����0s���]a�rts��W�V�������������Hp����\�rd
5"P���(Q� �s�p�˄��)�?rӽ�h���MӮh��ɚȖ}mEZ3niqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/paint-order"
  },
  "perspective": {
    "syntax": "none | <length>",
    "media": "visual",
    "inherited": false,
    "animationType": "length",
    "percentages": "no",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "none",
    "appliesto": "transformableElements",
    "computed": "absoluteLengthOrNone",
    "order": "uniqueOrder",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/perspective"
  },
  "perspective-origin": {
    "syntax": "<position>",
    "media": "visual",
    "inherited": false,
    "animationType": "simpleListOfLpc",
    "percentages": "referToSizeOfBoundingBox",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "50% 50%",
    "appliesto": "transformableElements",
    "computed": "forLengthAbsoluteValueOtherwisePercentage",
    "order": "oneOrTwoValuesLengthAbsoluteKeywordsPercentages",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/perspective-origin"
  },
  "place-content": {
    "syntax": "<'align-content'> <'justify-content'>?",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Box Alignment"
    ],
    "initial": "normal",
    "appliesto": "multilineFlexContainers",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/place-content"
  },
  "place-items": {
    "syntax": "<'align-items'> <'justify-items'>?",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Box Alignment"
    ],
    "initial": [
      "align-items",
      "justify-items"
    ],
    "appliesto": "allElements",
    "computed": [
      "align-items",
      "justify-items"
    ],
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/place-items"
  },
  "place-self": {
    "syntax": "<'align-self'> <'justify-self'>?",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Box Alignment"
    ],
    "initial": [
      "align-self",
      "justify-self"
    ],
    "appliesto": "blockLevelBoxesAndAbsolutelyPositionedBoxesAndGridItems",
    "computed": [
      "align-self",
      "justify-self"
    ],
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/place-self"
  },
  "pointer-events": {
    "syntax": "auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all | inherit",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "Pointer Events"
    ],
    "initial": "auto",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/pointer-events"
  },
  "position": {
    "syntax": "static | relative | absolute | sticky | fixed",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Positioning"
    ],
    "initial": "static",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/position"
  },
  "quotes": {
    "syntax": "none | auto | [ <string> <string> ]+",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Generated Content"
    ],
    "initial": "dependsOnUserAgent",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/quotes"
  },
  "resize": {
    "syntax": "none | both | horizontal | vertical | block | inline",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Basic User Interface"
    ],
    "initial": "none",
    "appliesto": "elementsWithOverflowNotVisibleAndReplacedElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/resize"
  },
  "right": {
    "syntax": "<length> | <percentage> | auto",
    "media": "visual",
    "inherited": false,
    "animationType": "lpc",
    "percentages": "referToWidthOfContainingBlock",
    "groups": [
      "CSS Positioning"
    ],
    "initial": "auto",
    "appliesto": "positionedElements",
    "computed": "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/right"
  },
  "rotate": {
    "syntax": "none | <angle> | [ x | y | z | <number>{3} ] && <angle>",
    "media": "visual",
    "inherited": false,
    "animationType": "transform",
    "percentages": "no",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "none",
    "appliesto": "transformableElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/rotate"
  },
  "row-gap": {
    "syntax": "normal | <length-percentage>",
    "media": "visual",
    "inherited": false,
    "animationType": "lpc",
    "percentages": "referToDimensionOfContentArea",
    "groups": [
      "CSS Box Alignment"
    ],
    "initial": "normal",
    "appliesto": "multiColumnElementsFlexContainersGridContainers",
    "computed": "asSpecifiedWithLengthsAbsoluteAndNormalComputingToZeroExceptMultiColumn",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/row-gap"
  },
  "ruby-align": {
    "syntax": "start | center | space-between | space-around",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Ruby"
    ],
    "initial": "space-around",
    "appliesto": "rubyBasesAnnotationsBaseAnnotationContainers",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/ruby-align"
  },
  "ruby-merge": {
    "syntax": "separate | collapse | auto",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Ruby"
    ],
    "initial": "separate",
    "appliesto": "rubyAnnotationsContainers",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "experimental"
  },
  "ruby-position": {
    "syntax": "over | under | inter-character",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Ruby"
    ],
    "initial": "over",
    "appliesto": "rubyAnnotationsContainers",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/ruby-position"
  },
  "scale": {
    "syntax": "none | <number>{1,3}",
    "media": "visual",
    "inherited": false,
    "animationType": "transform",
    "percentages": "no",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "none",
    "appliesto": "transformableElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scale"
  },
  "scrollbar-color": {
    "syntax": "auto | dark | light | <color>{2}",
    "media": "visual",
    "inherited": true,
    "animationType": "color",
    "percentages": "no",
    "groups": [
      "CSS Scrollbars"
    ],
    "initial": "auto",
    "appliesto": "scrollingBoxes",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scrollbar-color"
  },
  "scrollbar-gutter": {
    "syntax": "auto | [ stable | always ] && both? && force?",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Overflow"
    ],
    "initial": "auto",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scrollbar-gutter"
  },
  "scrollbar-width": {
    "syntax": "auto | thin | none",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Scrollbars"
    ],
    "initial": "auto",
    "appliesto": "scrollingBoxes",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scrollbar-width"
  },
  "scroll-behavior": {
    "syntax": "auto | smooth",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSSOM View"
    ],
    "initial": "auto",
    "appliesto": "scrollingBoxes",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-behavior"
  },
  "scroll-margin": {
    "syntax": "<length>{1,4}",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin"
  },
  "scroll-margin-block": {
    "syntax": "<length>{1,2}",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block"
  },
  "scroll-margin-block-start": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block-start"
  },
  "scroll-margin-block-end": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block-end"
  },
  "scroll-margin-bottom": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-bottom"
  },
  "scroll-margin-inline": {
    "syntax": "<length>{1,2}",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline"
  },
  "scroll-margin-inline-start": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline-start"
  },
  "scroll-margin-inline-end": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline-end"
  },
  "scroll-margin-left": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-left"
  },
  "scroll-margin-right": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-right"
  },
  "scroll-margin-top": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-top"
  },
  "scroll-padding": {
    "syntax": "[ auto | <length-percentage> ]{1,4}",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "relativeToTheScrollContainersScrollport",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "auto",
    "appliesto": "scrollContainers",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-padding"
  },
  "scroll-padding-block": {
    "syntax": "[ auto | <length-percentage> ]{1,2}",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "relativeToTheScrollContainersScrollport",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "auto",
    "appliesto": "scrollContainers",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-block"
  },
  "scroll-padding-block-start": {
    "syntax": "auto | <length-percentage>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "relativeToTheScrollContainersScrollport",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "auto",
    "appliesto": "scrollContainers",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-block-start"
  },
  "scroll-padding-block-end": {
    "syntax": "auto | <length-percentage>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "relativeToTheScrollContainersScrollport",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "auto",
    "appliesto": "scrollContainers",
    "computed": "asSpecified",
    "order": "perGovided, returns all mappings
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
	    for (v# ws: a Node.js WebSocket library

[![Version npm](https://img.shields.io/npm/v/ws.svg?logo=npm)](https://www.npmjs.com/package/ws)
[![CI](https://img.shields.io/github/actions/workflow/status/websockets/ws/ci.yml?branch=master&label=CI&logo=github)](https://github.com/websockets/ws/actions?query=workflow%3ACI+branch%3Amaster)
[![Coverage Status](https://img.shields.io/coveralls/websockets/ws/master.svg?logo=coveralls)](https://coveralls.io/github/websockets/ws)

ws is a simple to use, blazing fast, and thoroughly tested WebSocket client and
server implementation.

Passes the quite extensive Autobahn test suite: [server][server-report],
[client][client-report].

**Note**: This module does not work in the browser. The client in the docs is a
reference to a back end with the role of a client in the WebSocket
communication. Browser clients must use the native
[`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
object. To make the same code work seamlessly on Node.js and the browser, you
can use one of the many wrappers available on npm, like
[isomorphic-ws](https://github.com/heineiuo/isomorphic-ws).

## Table of Contents

- [Protocol support](#protocol-support)
- [Installing](#installing)
  - [Opt-in for performance](#opt-in-for-performance)
    - [Legacy opt-in for performance](#legacy-opt-in-for-performance)
- [API docs](#api-docs)
- [WebSocket compression](#websocket-compression)
- [Usage examples](#usage-examples)
  - [Sending and receiving text data](#sending-and-receiving-text-data)
  - [Sending binary data](#sending-binary-data)
  - [Simple server](#simple-server)
  - [External HTTP/S server](#external-https-server)
  - [Multiple servers sharing a single HTTP/S server](#multiple-servers-sharing-a-single-https-server)
  - [Client authentication](#client-authentication)
  - [Server broadcast](#server-broadcast)
  - [Round-trip time](#round-trip-time)
  - [Use the Node.js streams API](#use-the-nodejs-streams-api)
  - [Other examples](#other-examples)
- [FAQ](#faq)
  - [How to get the IP address of the client?](#how-to-get-the-ip-address-of-the-client)
  - [How to detect and close broken connections?](#how-to-detect-and-close-broken-connections)
  - [How to connect via a proxy?](#how-to-connect-via-a-proxy)
- [Changelog](#changelog)
- [License](#license)

## Protocol support

- **HyBi drafts 07-12** (Use the option `protocolVersion: 8`)
- **HyBi drafts 13-17** (Current default, alternatively option
  `protocolVersion: 13`)

## Installing

```
npm install ws
```

### Opt-in for performance

[bufferutil][] is an optional module that can be installed alongside the ws
module:

```
npm install --save-optional bufferutil
```

This is a binary addon that improves the performance of certain operations such
as masking and unmasking the data payload of the WebSocket frames. Prebuilt
binaries are available for the most popular platforms, so you don't necessarily
need to have a C++ compiler installed on your machine.

To force ws to not use bufferutil, use the
[`WS_NO_BUFFER_UTIL`](./doc/ws.md#ws_no_buffer_util) environment variable. This
can be useful to enhance security in systems where a user can put a package in
the package search path of an application of another user, due to how the
Node.js resolver algorithm works.

#### Legacy opt-in for performance

If you are running on an old version of Node.js (prior to v18.14.0), ws also
supports the [utf-8-validate][] module:

```
npm install --save-optional utf-8-validate
```

This contains a binary polyfill for [`buffer.isUtf8()`][].

To force ws to not use utf-8-validate, use the
[`WS_NO_UTF_8_VALIDATE`](./doc/ws.md#ws_no_utf_8_validate) environment variable.

## API docs

See [`/doc/ws.md`](./doc/ws.md) for Node.js-like documentation of ws classes and
utility functions.

## WebSocket compression

ws supports the [permessage-deflate extension][permessage-deflate] which enables
the client and server to negotiate a compression algorithm and its parameters,
and then selectively apply it to the data payloads of each WebSocket message.

The extension is disabled by default on the server and enabled by default on the
client. It adds a significant overhead in terms of performance and memory
consumption so we suggest to enable it only if it is really needed.

Note that Node.js has a variety of issues with high-performance compression,
where increased concurrency, especially on Linux, can lead to [catastrophic
memory fragmentation][node-zlib-bug] and slow performance. If you intend to use
permessage-deflate in production, it is worthwhile to set up a test
representative of your workload and ensure Node.js/zlib will handle it with
acceptable performance and memory usage.

Tuning of permessage-deflate can be done via the options defined below. You can
also use `zlibDeflateOptions` and `zlibInflateOptions`, which is passed directly
into the creation of [raw deflate/inflate streams][node-zlib-deflaterawdocs].

See [the docs][ws-server-options] for more options.

```js
import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  }
});
```

The client will only use the extension if it is supported and enabled on the
server. To always disable the extension on the client set the
`perMessageDeflate` option to `false`.

```js
import WebSocket from 'ws';

const ws = new WebSocket('ws://www.host.com/path', {
  perMessageDeflate: false
});
```

## Usage examples

### Sending and receiving text data

```js
import WebSocket from 'ws';

const ws = new WebSocket('ws://www.host.com/path');

ws.on('error', console.error);

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});
```

### Sending binary data

```js
import WebSocket from 'ws';

const ws = new WebSocket('ws://www.host.com/path');

ws.on('error', console.error);

ws.on('open', function open() {
  const array = new Float32Array(5);

  for (var i = 0; i < array.length; ++i) {
    array[i] = i / 2;
  }

  ws.send(array);
});
```

### Simple server

```js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});
```

### External HTTP/S server

```js
import { createServer } from 'https';
import { readFileSync } from 'fs';
import { WebSocketServer } from 'ws';

const server = createServer({
  cert: readFileSync('/path/to/cert.pem'),
  key: readFileSync('/path/to/key.pem')
});
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});

server.listen(8080);
```

### Multiple servers sharing a single HTTP/S server

```js
import { createServer } from 'http';
import { parse } from 'url';
import { WebSocketServer } from 'ws';

const server = createServer();
const wss1 = new WebSocketServer({ noServer: true });
const wss2 = new WebSocketServer({ noServer: true });

wss1.on('connection', function connection(ws) {
  ws.on('error', console.error);

  // ...
});

wss2.on('connection', function connection(ws) {
  ws.on('error', console.error);

  // ...
});

server.on('upgrade', function upgrade(request, socket, head) {
  const { pathname } = parse(request.url);

  if (pathname === '/foo') {
    wss1.handleUpgrade(request, socket, head, function done(ws) {
      wss1.emit('connection', ws, request);
    });
  } else if (pathname === '/bar') {
    wss2.handleUpgrade(request, socket, head, function done(ws) {
      wss2.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(8080);
```

### Client authentication

```js
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

function onSocketError(err) {
  console.error(err);
}

const server = createServer();
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', function connection(ws, request, client) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log(`Received message ${data} from user ${client}`);
  });
});

server.on('upgrade', function upgrade(request, socket, head) {
  socket.on('error', onSocketError);

  // This function is not defined on purpose. Implement it with your own logic.
  authenticate(request, function next(err, client) {
    if (err || !client) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    socket.removeListener('error', onSocketError);

    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request, client);
    });
  });
});

server.listen(8080);
```

Also see the provided [example][session-parse-example] using `express-session`.

### Server broadcast

A client WebSocket broadcasting to all connected WebSocket clients, including
itself.

```js
import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});
```

A client WebSocket broadcasting to every other connected WebSocket clients,
excluding itself.

```js
import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});
```

### Round-trip time

```js
import WebSocket from 'ws';

const ws = new WebSocket('wss://websocket-echo.com/');

ws.on('error', console.error);

ws.on('open', function open() {
  console.log('connected');
  ws.send(Date.now());
});

ws.on('close', function close() {
  console.log('disconnected');
});

ws.on('message', function message(data) {
  console.log(`Round-trip time: ${Date.now() - data} ms`);

  setTimeout(function timeout() {
    ws.send(Date.now());
  }, 500);
});
```

### Use the Node.js streams API

```js
import WebSocket, { createWebSocketStream } from 'ws';

const ws = new WebSocket('wss://websocket-echo.com/');

const duplex = createWebSocketStream(ws, { encoding: 'utf8' });

duplex.on('error', console.error);

duplex.pipe(process.stdout);
process.stdin.pipe(duplex);
```

### Other examples

For a full example with a browser client communicating with a ws server, see the
examples folder.

Otherwise, see the test cases.

## FAQ

### How to get the IP address of the client?

The remote IP address can be obtained from the raw socket.

```js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, req) {
  const ip = req.socket.remoteAddress;

  ws.on('error', console.error);
});
```

When the server runs behind a proxy like NGINX, the de-facto standard is to use
the `X-Forwarded-For` header.

```js
wss.on('connection', function connection(ws, req) {
  const ip = req.headers['x-forwarded-for'].split(',')[0].trim();

  ws.on('error', console.error);
});
```

### How to detect and close broken connections?

Sometimes the link between the server and the client can be interrupted in a way
that keeps both the server and the client unaware of the broken state of the
connection (e.g. when pulling the cord).

In these cases ping messages can be used as a means to verify that the remote
endpoint is still responsive.

```js
import { WebSocketServer } from 'ws';

function heartbeat() {
  this.isAlive = true;
}

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.isAlive = true;
  ws.on('error', console.error);
  ws.on('pong', heartbeat);
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', function close() {
  clearInterval(interval);
});
```

Pong messages are automatically sent in response to ping messages as required by
the spec.

Just like the server example above your clients might as well lose connection
without knowing it. You might want to add a ping listener on your clients to
prevent that. A simple implementation would be:

```js
import WebSocket from 'ws';

function heartbeat() {
  clearTimeout(this.pingTimeout);

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  this.pingTimeout = setTimeout(() => {
    this.terminate();
  }, 30000 + 1000);
}

const client = new WebSocket('wss://websocket-echo.com/');

client.on('error', console.error);
client.on('open', heartbeat);
client.on('ping', heartbeat);
client.on('close', function clear() {
  clearTimeout(this.pingTimeout);
});
```

### How to connect via a proxy?

Use a custom `http.Agent` implementation like [https-proxy-agent][] or
[socks-proxy-agent][].

## Changelog

We're using the GitHub [releases][changelog] for changelog entries.

## License

[MIT](LICENSE)

[`buffer.isutf8()`]: https://nodejs.org/api/buffer.html#bufferisutf8input
[bufferutil]: https://github.com/websockets/bufferutil
[changelog]: https://github.com/websockets/ws/releases
[client-report]: http://websockets.github.io/ws/autobahn/clients/
[https-proxy-agent]: https://github.com/TooTallNate/node-https-proxy-agent
[node-zlib-bug]: https://github.com/nodejs/node/issues/8871
[node-zlib-deflaterawdocs]:
  https://nodejs.org/api/zlib.html#zlib_zlib_createdeflateraw_options
[permessage-deflate]: https://tools.ietf.org/html/rfc7692
[server-report]: http://websockets.github.io/ws/autobahn/servers/
[session-parse-example]: ./examples/express-session-parse
[socks-proxy-agent]: https://github.com/TooTallNate/node-socks-proxy-agent
[utf-8-validate]: https://github.com/websockets/utf-8-validate
[ws-server-options]: ./doc/ws.md#new-websocketserveroptions-callback
                                                �]\�M�x��5��G!��!��̈���l_�l���8�S�U0ڮ:�3-��-���]t��1~���ʅ�F+���b��(��t˛��v��ȗ�%adN�oQ��%����hl� *#����=�촻6��㳞�t��?�l^6|� 2����gۛ�2����b;���@r�V�=\[�<8�ծ�9�ᶙ�ǸSl,E~EV�㛢$F
�AR���YҐ�~Tit�mA�rM��$e�6'�-����-u�MX}^*}��� ��T~�x �~�f�/�wnc����@�ș6WBzN��Dӓ����3��j	`d����5�G�T���ϩT|F�a�+C��zf�)���z�6<�8�F	��� <?
c�����v�u����{�8_���Jb�'��+#�sޑҤ�N
r�6A�����8��	Q^�!��;
��@���7D��sX�/v>�OJ?���8���3cI�l^��D�6	6�J�^��wW�D-3���*�jE�s� _.ތ|`�9b��l�+6���K����]Ӷ2�n}d�M��ֱ�l���>��ft7��l���Fp�I�"T��W@�b̙��v��X�4u焴�i�.�(�;e/��?�]�B�;���4Q�n����L�R���f/{�ǆ�+�^~A�����] �K �g��5Ye�p�[�m\Ԝ�MA�m_L�8B���Bn��g's튼]兘)�}A[���Ren�e��e�T���64E�H��v�,��X1x5�I��S*�lv�;��x��� ���N/"����~Hv�H?�/�Ā��Naf�
�R�[R�oX}�u��d{;u�k�W��g�'*?�h��*��r�^�����O�
���:f�.kW	�9\�/�JϢ��5;�M~�$��02� �Z�Yr}
i�Bwc,G�D�A�]� 3�ka�y�o܊CB+G��!@�ɪL@�l<���	��o�K�Q�b0�w���.�J���u�?}�����*Sz0�.���N���D�P`p..F���"use strict";
/*--------------------------------------------------------------------------

@sinclair/typebox/guards

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./guard"), exports);
                                                                                                                                                                                                                                                                                                                                                                                                                             ��)� ��95n�K�k�H�A��'}뼐C���F���O�w�kTR!�j��R_x�D�FH�u)u����T̩��|�r��� �U�%!@�ut�������o�%�}:�1	*[�9/B�,�v�۽�f��ǋ@250�����~ֱ:����c�����FGE�L��x�m��:�@뀣��Z���rHOհɒ�{���l�߯�>��ْ�^�Y��"I���״���v��M�獒���A>dE��C��]6_$J]��e�a5om�r�=�^���omJ�(W�ަ���N˛��,A���}G�%�	��}����r^3�~�o1��5�f�.��q]"+B���	�E1賝K��(���ٓp����^sܞ�P��7�����#^s�����"t���a�{U��e�F`xa��O=ֈ��%1�ˋI}a�4!.z1*�SzNɧ8A��CA8�F����U)ʫl��^s��eRd��u��Л�&p8;"S����҈ۗ�pxn5�c��Ž�F�}͘U��|B�f�cE;V��� ��o1Z�-B�(�.J�K�����H��]]�I��'�����x�X���k;��� j�L�c^�l�N�ܾ�m9'��7�ٞ&���C1w+�f�&c��	P�8�NK�u��<&���%9Y�k��{�Z}�\���i�~�C4ݣ0v��d� �#����1�I\Ζ�} ��C��o��T��m�я{��������V��!��c*7?�-m�z��6C��?�/c��p��2�
JL�����{.֛��nF��e;:��s��n � 0g�8)�z}
L���C��P�:`��~��L~|Z�Ո�̤R�q-5��4��PC[_E_=ԫ� �3��R'�	�I����#WCљ���߯�?�c4��r_��..����Ҿ���ڮ�D	�H�����>������h_sȉ�Xz(���/r͍yE��m���3���F@OPuY�����ۆ�%:K�R�	ڴ�i�+tD灪�8����%?�&D1D�L�� ]R��N>y��6���+ ��eT��U]�x`�F�b^��_yXpЗ�&y��GY�"������N��M��){@.��K	��eWO�sӉQ���`>'��{q%ڬ��[+r|�A���U=��+$q��06��+�!Q�|T�Jϯ�iH18�籈����ղއ�s��Pl>E�3n�8��xΩ����--e���RX����:(�4H:���h���3r�/`(�>�������&i���Q$]�����פ��g�4��}�������f�&Ϣ(E����n���b��}�6γ�m��'�d��^}
�8Ui��"�<^ecH� ᜕���4y�\OK��G�����sΣ?~�%���}�N� �����K�Ӧ�HL�Kdj�	3o,�Jr��g~��mq
�
��ѻ!	&����emqa��'B*��"G�����?0p����G�;m��eo}�jR�?^��
/ӹ[�*q��B5����&�]��>Ojz�ZW��(�e�T���(0"���`�NF�1K�n�
��(��b�j!�:�"N>���I�����p��I��g��X��+"}aY�2a�$��p��$z�����b��(��z;t�\֔8�Oّ��l����؅����}�6������� ѥ!c��\7�ϻ75�G�#4��g�kT����Wu����ٕ�q�ǆ��5��M@���Q�u8E��N��xa��L����O�-�Z�v���������K���֗π{9���s��1)��`x�9}y`�s�⪌WpU�CmʬއL����qM��κ�������i7�2-���_��Wl4it�N��,��l5N(�|�;���͏����A�[���
V6���Z�Z+�\���9�!6�ٳ �ϳn���*��X׻lgWx� 1���a��F Dl�9j���9g�D��	�R�Q�(z[�"$��T�֔�51.}ǛӺ�N+|t;(��eP=󌣢��������(j2I�5:�d�WP�{��z��8'�AJ.WMp"����!��OO�Q����u��������Į`fr[Hn��P\�Ġ�JF�c�t�޷��c�A�U����;
�EA�D�AK9��l�۰�뺆P���<��;�)VZݽQ�كy�JٺV*�N���5��1��Y	�j5�[۽�O�#�ъ��lonjʅ�q�χs�f0�\GU�kfG�ԠTM�:P�p(>g�z��R�N%����	@� B�td��G]��,�;�p3�kA����N�0����җ_X��ZJ���r'�
�/�8�xS*[�����/t��a��`mfM�
�� `�I#�����$�[
l�_�Q~� ��j�(foLٙN�2H�(�ݪU��$O����j0�MW�ۿgv��q�]�Ĉ���1jޠHQ"c���
b��ܝ�|�OJ�y8܄���"Y�µ�12��+��\�a��[<���E�vAŐg=��dN�b�(#ᖉ��NxHUN3��7Ha�gcsK��e,�/����S}�&�,-�ȾF���1T.e ��5r���T�V"n[��\^�3�����7��:���	�?�c���y7��=(��?��=�{#KPm}�KEnH���ޕ7-܌S�+) �܌���$�=�����w�C�{�SL_r��^c�.�vv�����{�N�}�������������7�,����c�&��o��މ#X���? ae��)�f���b~5�y�*���8�Uѱ�i���_z<(x��j9FW���Q�|�fxp+��j%Yȸ�, a�8��J�|:} �C���ρO;f�c�a�i�]��2�w*�v1�S�.d�\���,�O�7 n
�>[��7��G����?���±�p�rދ�ķ�
����i��[��`.����0����+onݛ�ڵ�r�z/e�('��C�k�q����v�P2�g���9��s�?T(�St�ѩ�x1�<��mh�B��U��ӜU�e�dǡ3.^w��_FP���Z������ri|K��V�q@;��n����\���$دR�}(.���(ٶb��$���G^R@�t19`������-&bV�����޾�����u@3�'�誮o;Vʍ2�׆�	@=�3�����F8�^��2X�rO��s�ԓ�ኻ��҄㢟f_˾���'��9���kjہ�K���
H��s�$-���Ma���|3�m�9�&��eD:|B�<Z�J�'��6 �g� �*)��cy�]�,��㑴�k�~�/���+����v�w�	xY�|�t)Byr\��\Oh镊� 0a  G�Ի6�d�1��3��e'�����v8�E���ǵ2�w^;�v1sI]]4�4¦T	��F�R�KVA3&[y�%��i�_aS�8�ݏާ���k�,��a�ԨE��c8�ȉv+��:�54���A���G��,�� ��6{��L��&Ue���n�r���PȞ���FϤ��6zQ�r�	�8����0��b]����9d�ZF�vr�R�'���E��S�9��i
�uz�~���k�C���ߕ�'�hij_�ğ��-���xP�;����@7US�������fW��^���f�F��=ߵ�J���(|�*��+ؔ=���~B�����)^�1�Z}���Y��X bv�ny4?T��@�՛�b��>�%�H��Ĕ�F!��Ê˭��?�*����b�s�����^aq�!RX<sG)U���I�h�Rŵ�v:���Ɂ�=g�&7H�"1B]~q���`��U�$j+]��@��~&/V,�s ��{��?����u��:|����>�4m)w^�w�_���y	<i���)x��������ׁ�a-Iu�����F����P�L*hMOS�����Fy���j�� B��^�T�J�)�h`"��ͤ@����2"�_%?0��E��%Q�=�++��1ܿ��.H�_���rs��c��n�Oa�?u,?�D),��h��Ű��K'̓�1DB�n�y�`>ɹC�d'm ���!�|5b��1�q�
�ΐ�XZh�N�e�˟BoXà ���nP�ք;�Q�<��D�ڜ�4e�k�vDȐ{����V����}�E�Tv�& :�[r���/�ʕ"XsqQO�e����l�\�̰l��|d�:X|u�4���q:5#oI�.pΰ��!�"�\zdT87ͩ53�K��n�
��M���w=mF�'������<+R`��8?PUN���wH��V���[�!��O	S����cftiZ}�t먣ƎlIpO�̖Ѭ#�H���<��67�zP�X��»}����x�{��yz\��H�߯�����p�b��y�HN�X��4�8\��h�B�E7A}ll:g���!��t��=���`�;�������?���,�&�4f�W
-,Y�a�
r"lwUߙ����g�f�ʱ���9���&��ZF'�1O��?C�U�mݝo�ȭ�n�ا�/��|�d��T��:�DK<�|YPD\�t=Gu--5gjX���w�G�png�p6S��f�o��ܝ4�����S�|���F<�*���Ɗ;�{�~_p�鎩�3�i����{�6�$��y���TPNC��i�9,�i4��%9C��!1y���ý�S�8�c��^����v�����WL[i����)U�˓D����2ٷ���8e�a��Yқ7d�jh��l�o��HG;��e@�3���)���*	�<��<��T�Y��GW��+_@���3�Y ���t���35���Q��Y���L\b�6,V�!rJ��c+��P},����k��i]d:@8&����[�g���w�����;��8�:ofA!�t���B�~�*5oZoDE�D7$)�M)~[�$�ь�kr���`)��N�f������7d���p�0����Æ�����`S�Z�BJ�U�Z�q�PU)�/�,MBk����n� �9��y�-6�~:�X(�T/<w�x��?(�#���q?�ڥn���^����W<Ȣs�h���h��?���NqYAY��b�K���)Q�]�@��`@�7p�l��z�P�S���=I�]�ђi0� O���Z�+��m9Z.XE���l�2�)�}��@mw1l	6}JNg��e8]U�;Y�� D�8n�#>��>�@�{��9�h��ף:TO�V�	��Ah����$�aߡk�'�h�J4�����֟O��=�wbA�z���i>�Mo�)T�Ѧlʑ7b���lI2�(�*��꽧�����]����
G� nc'69tfY�Z@�*����W,ҽR�j��B�*�!.^yO��(���?��C1��)1X�����N����6v6aJҗ���P�v)̞:��+O��|�����;�\#�.Մ9����� ֙�T�!09�O���m��bo4��6�i�ҕ��������yT��vж���D�O=5HJoכ#�0ڡ\��V=�#&B[} �ً���3F��`A��EO�j��5z�b�n-$:���;�T'T��䆢c�������Z�~f�E,��W�H��)z'�����6)-�h��9�~�#1�B�՟/&-����5�Plm@k����ωpv���`T���
��	��1��(�m�4�4�ڮ� �+ ��sJ�ODҔ��e+d|�eD$_�p	�Y�Y'h��­�W���OQ�At$�Q'���$y�,zѐQz����W�!N?-��w�L�2>��)E�iE�a�c�o ��DXw�������F���ˌ���*�(p�<���]��Vc[/!Qp)�x8��o:~a;J�H��)�OV3�:�סD�U�>6�����V�&�f��ĸ�ԅ4�͊)��Z0���A�X9��|U!������P#��|;�u8��eU��]\����[m E��~IH�ym��j�+
0���)�mD/��E5��{��	g�'���2�,{n�=�{�U��_�btSXݢ�4~����`�E��G�T���J��?��<�o%��
龜y���tSF�"��W�h{��1J���w>�=���S��!^W9*��?�}%�0����D��^�|�-#"4��n~�>��,U����A���zKi�����꨹��^�a���Q��X�N2�A�u�S�\7Kr�*��;������P4�$/�^��U���V��mp��z������,�8���n�VrD�I�,X~?�u�ݟ\�0�,j;�V�D��S�j՚sؕd��-�F�5L�[T��z%�%O%�2>���b�8�2gc�X�!v� ����!c�=��9��Js��֥UYQ�T�X����+'�_���?���c�p��x�74��£p�+�U��bi�]����?Bb�j2�N�3�)���Ch�W�xP @H��On��9�JăL�?����V����:���TL��6a�P,����ks�j9&�;۴@`�]~��Y�kdvK[bӁiZ�N�� ԧ7m�a��a��:�H�i���|O��b�#(���uI"Ck���x�����(:�L�A����]h�7m�'��y�۪�Q��W��y�Xi7!��!" 	��R-�)[w��� ZO���{��m�b�X��#k��
�?���� ������?8e�bL��x�}  �h�_#n�h<O��'����p"<7k_3�9�%$�o*�i`I�2VuZ��n̂h��NY�`��~�B:q�n[�]e�ӽ��l<'s��1�藓�R&#�vP�;��ag�.L�b���/�����7�<�k*��ѥ���R���S%ZC�"7�/�:a�4;dƓ-G|Y�P�퍝R5�q����ͮt1mt�e��O#d�[���Ay��X�9X���q�.��E��b�|s�'�qMs�q��dk�s�e|�xQp�u�~F�c%��"^�P]�+e�,�7Xq�O2O���n�e{�|�MSL-ja��w�u���&�K�|�8���T?y�ę���P��7@�l���kD%1�a�)V��������J����^�ˤ��/��|�6|� ��x�w�J
��1���>�E�kpZ��G�,�<��*�t��p�p*|v���7ie�E56��;��zF��~KOT���]��L�:�^�!�J� �)Z`)3�^Fcp��*֬f�(P��NT�Mg��+�w.���8����*�Ʋ�O�>�w�CH@v��*Gt�J�B;�2��f}g��KʏH�`��E��7�` �"Ԝ�;���L�3Ö[����9�8�m�mY�3�ǚv�H�e)W���&�o�����
?��\���h�>�Rrޙ�NĐ�A��U��¥�d��4^���K6����P�v*��۱/��9S�)i7����Vs��^�\��\���_�| Z�I�neGK���72�>ـH�d����l�ސ�W��d�}^��Vp����.��L)�;=V@̝Kyq�:y���U�I_d��A�;�4Z�l��ՙ��������m)w`bÀa߅�!�PAE�Y��Dfϛgf�� a'3��NȔy��*���_���y	j�}7Τ�p +��O3����gmΒ���\ҷ��X�E8_lM������b.N-�r��0�mt45�$�I��@3�� �K,��_Rc���G� ����X6NV��Ҋ���^�Ic:��"��P�klվ?*f�%0��*�|_��������w�{zmx�{�i��4�.L��J�],�^+�dW��p?�{�]gX��o�.Zfm��[K�֋�[.��񚉢���1�2r�&���|����<�����z��b;�8�kC4�5Y�cȂ,r��[*H2���U��i�Y[ ��旪2<���e�~(�R���Ԏw̻���v�C�s����@��s�8]%������ơ���}�C9ڿ7<@�f��E;�e �X��r��t���ܔU-\��[L��%g�P- К3懳� o評�ّa\����k��0�Q��}�>;MuSe3] &�w-z�[[6��1�'����K vV&�O,�! W0�gP�M�N.�$խ����ֱ�#ܢ_el?I1��LNp��n����c��$$}^0p֤[�~i7��o��L�o�%�?�Z�q��*1y�0�� T���}��z}Mq+�+�A<��]Ů[���2�.�f@j�Y�t#�8��-�V�f���"�+�C#N���L��/e��gQG�S��)�	�+-/�O�G�˕wBpd��И�/-[��dĴl��44dֻc������+~̫N���8��7n4�ҏ������HXᜋA�sFr��a3�����y�k2����U/\���kh	�J����rO��Ne0a�()f���T΁X~���a7u����DL�+ޏ#��%���P�����?�;_����^��=6�s����;�4!�2D�K��1c�iL�o�������,�'����W
��#mj��f�zs(���i�%C>��������q�鈣fvn��2�1̩��U?,���PJA�(�>�����s<'�cMd:`;�6.�~��eڛGx��e��G��s9��WSu���`�a�S �#����A�yX��.�y	DH�^P+��/�mЏ��?G?쮵F/���D��QD�3�H`��}���N�U��K�����v_MÚ�$��Yi�W��N���A!��*���$���о�ɯ��&J�7�m�bK���c�w=��E�
��;�����~�zS`�����#xǵ�}>��{��+�Ӭ�i���1���}��7��������Q�j@�����e>0�ܻߠ��Ϝ�~�h���洺I#����B`��Hx!_`OL�"t�NӃ,��O��8�*���4���(M������D���B��.�ƥD���u��Bl�b~C�x�`E�x��`���,��w+t�%�iSS"I�t�\�YJ]�k����jK��
{�e���Y^.|hj�2:���ic#;OYDUM��Ug���$n^�+�7RP�N�q�}
�T�SkԵL@�i�p�U\-�Z�G�=�9~0XUxٵ�p2��@�u%��'^x�q^�cf��w��:2B�*���X���� o�I"#{!�_|%4�`e��������R���N+a@HM4�C8� '���Tx��Tk2Ү�Ժ�Ip���ID>h��'./��=Y��k%1om��D��cy����$��W�3�&4�14��V<zcB�t����t.��>�;em��߿lD���v�ЙE��iM�j�sӼ�B�#��R߃Y ����r�-����[ѧ�y�ZDbp=��ݥ�v����s5�׺n�_��L�J���?&ڪPj��cwJ�h byPH����]�O��@Dc*�1v��L�+0ay��|��:2��_Q���wA�c>��SfXh��U��/�����M,��>UiPH�:��\��L��P�}q��|�=�Ňk�.�a�����.�d�}�*�=��� s�ݝ�����\��gI�X9)ղ�n&�Z��,�wZ
 ��M��E(�� �Y�mi	��,#�^��A��0�+�#ҭ�]�]�ũ�Ҙw����9��e�T$�{�\�_o���4$�#Yÿ�huG{�����	�[a��Z���}G$���+ ����oDW��-uA�fy�3|U��?�K�V(݃8����Iima�\~'�DJ1X�^ɹ�|��1�����̋o:���!fYF�K���&̭��I�H��N;q�(�y�D)�d�F�w�o~ҐOC�l��#����m`R`g`OD�<�����A�P95l��z�^�ݮ�Vqgo�1w���ޯ���|��Ţ8M�\S���V�n�Q��*�Ɲ?��ϯ8W��l�"�l���j��n���J*��T�(���;7O��#;Bƚ�(# ��W��[���W��է�&,䅎���^����]L~|��L�4��,0^KQH&�s�5Ά�Db$�7߅��K}<'����?��Byiiɚ���������WTE:�Lg�����*ީ��CR棽Fs+f�2ɠe4��g�vAʎ/�hg`�XTl+ܮ��9
�3g��*��xŅ-+��?�#����nQ�>�^ݞ��M�#.eZ����{�Mg4L�=�g�$��u(e�$��u�⾣��+vwc�VM0�+���+HiAm�]~���	��ƛ[�#�ySCPO�J��&� ����rL��{�r@o=�H���*�fa�5�KC��`Q�xz��r��D#=�R��.a�;��ݝ���[<O��wC�_#X�~�US>�m���mS)!���� �4d�>�?>��U-m�~�B����Sᴆ�]!=7�)�G�L�'�ʢ:vJ�s\�4��������l���~>���Ķ;���k/���66U���K8�z|��1V4>� �۷"����(�KA9ؑ�
j/��W�Wƺe�J����f}�5e��u^�����MWj��u�ϫ�-��on�]X�(� $A�%H#t�mz~�ێ5�� Z5	�44�|��y�1jb���ӝ֧�?��cL�e{O;�n��98��P7k�퀈Gy�7���E������ �f���FRGO�ܥϫ?��D�b#�
�S�|;ރ��+����&0�_�$MIM�(ʫE���(�u�����}{:Y��O�Dڤ�FA��b�:����_�bl�`��pEl�{1�݁l#70���m5��o"Uf�&�q�[�]���ת�P
���e8��(|7(�1��#��������e~�7N3����T��J
!x);^n~8`���6�ЅQ^XTW�z����]��|� k�K�S�:��$�~�O&��e��-�YЋ#�bO��vq@�>V�#'G�f��"<�N�z��/-4�����������9���+w��o[�6�b������{`�\����:�	ڷo��*,,�T�{����|�7����Gפ<3�1^]�rw��m�Wdڂ}ԡ�)2-3��.��eD��e�q��#��w}aB]����W���1��1�Z�JF�^���3;γ�p��ۆ4��݇���w{������V�E�~\ϝ��d�c9~��ů_y}�K�����0��j������7e�x�LW�@b��З��`{�R6>10`>&�.m2f�����~�
fI聥��_���w����	VDH9�v_����hY�1��8���A��%^W>���-����s�b�/����K,a�U�� b�E��X�i�
L�{+��p��K�
ً ���䗰" ��7��q5 )�'�ES��+��7�q`,��K�uy�t���4�+�A*����t�X� �+��!\�}�(7���39�����Y�#��8����]]PPDA����O��Iᾂj��z�J�yZ�`vN�U�E�L)�d(��J"�?<��A�������������g�׍�������������:D��6�_
(�*�<O�x&�GG: �ZjlSe���S�3C����D
���E.@����aW>Ѽ�0R��h4*�-�hv��=���A�������@Te����/���:x�|i�j�»��PeG|�*�#Tl�h��k��w�r(��S2��MjwP��j<��"Jj��>�u�$W��s�9��E���h�%������[�D���U@Ye=���u
�oh6���54qИ5����]��	:���|X�%;�@�h���4B�~��RN��J�B���"Lў�~���Nu&�K`���:��ͯE����H�����6X[�w�J��]dp�y}M˺�LJq�3��O^l�q��6,�/�ݻc��G��)D��������s�؂�E#��A��d�/�����&7Kt5�	���Ip��[�
���O���B.v�@�%B��cldI;q�)j':U� &`B._�g�wAX߀��$�@�E�0�**{�uzu�����.=}�S�|P���3]o�cxd�Tm�7�z/���z���f��-��,��u��R�)�ף7q�gxKǬɿ����'���L�V�����VFgh�7p��#^3U�r�ŋQһ�^�Zh�9ֽ��܃" ��&ap� ��֞9(��K_��	��)%�<.�y�	ZR��)�!���,��]>T�$�7�|&E��._U)���4��%�$�c#�9\���Z��OHTx��|�,cBOE�$*x�0�.�~{q���S3Nx�O$�dM�q����(/D��I_��xi�F�`�s�CSM�����B��?�Km9"�<�4�0��'4�/҉�/F��W0���3w>�n0�?˳0�Ih>�����rTMO�=��2�Q�o�T���s�/|���0�l����7�uE/����Hx���ʄ�F�ɤ�[�]�bɿl�F01L�\���X'�t�����H�����C�ߗ�o�݌�I;���	�'��B���AJo���_�{��q�9&˲B��୦b#4���|���;�����d���T��Ph��&d=��E��&��=�J���s�t]N�XAV[S%!��]�	,���l1R-��ˢ@��!1�+v{���pQ$����3Z�2�Z��U�%#�p�6�<�iO����y �Ӎ����)�KH�U����*��l��J\���)��pxLf:��+c���� �����p>��mW�g�p�!�=�LT6Tӣ�ąi�5
s�[H#���M27�0H�M�p;ߝPy��p�D�|9s	>���)�g�B}����.9I�m��:�_ �:���W���>��5�b�L���Uq�t2QO�/O��̣�-$�W��k,�jNv����7>�SN��26`�M��%��:\A���В銄k_�Gs)�`��2��I���WRx�S_[��Q�����GP{\#���2�S-��T
��J���Nau�e��� L�|V�����Q�\Idm�)�p�����z2�v�x�E�7��)r?I]�8�F��!���Z�}lބ��*�	��XT��/���N܈'=�lHp�'��#���!�<�j�����g�n��k���4U�zA�CP�G(�(8��q�a.�,z�o��H�
5tLVB��0��-��i�=h��\G��ͣ�#��;���Y���N��ɿX-o���e�F������'.W�O�^��)$�*3<C�~�7�@yW�=bp ��H��T�z�B��
�դ�&����?��9xe؋Ǜ_�����j����T�y)���+@���J�&e�ܣ9T�e����ĊM���B
:���^�O�AF��(//�����j>��	������cT��H#�r{QĄ�����{Q*jN��by�j�x�rel��*8
�7�j�>;C���$��l�FZp.�
ٍ���Fa�Tm�R�e����U���x/-(h��ޔ'+�GGAg߳@V��qK/5Ņ�=>�:�T!�b��H���&�,g:���)��ћ^-��Wo�W�4�^f�-���H��Jyt�G�q/��kKJ�U���K:l��(B�EZ3��D��%lݯ�*��L!��gH�9euᥝQ������]�J 5���X��niqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/paint-order"
  },
  "perspective": {
    "syntax": "none | <length>",
    "media": "visual",
    "inherited": false,
    "animationType": "length",
    "percentages": "no",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "none",
    "appliesto": "transformableElements",
    "computed": "absoluteLengthOrNone",
    "order": "uniqueOrder",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/perspective"
  },
  "perspective-origin": {
    "syntax": "<position>",
    "media": "visual",
    "inherited": false,
    "animationType": "simpleListOfLpc",
    "percentages": "referToSizeOfBoundingBox",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "50% 50%",
    "appliesto": "transformableElements",
    "computed": "forLengthAbsoluteValueOtherwisePercentage",
    "order": "oneOrTwoValuesLengthAbsoluteKeywordsPercentages",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/perspective-origin"
  },
  "place-content": {
    "syntax": "<'align-content'> <'justify-content'>?",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Box Alignment"
    ],
    "initial": "normal",
    "appliesto": "multilineFlexContainers",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/place-content"
  },
  "place-items": {
    "syntax": "<'align-items'> <'justify-items'>?",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Box Alignment"
    ],
    "initial": [
      "align-items",
      "justify-items"
    ],
    "appliesto": "allElements",
    "computed": [
      "align-items",
      "justify-items"
    ],
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/place-items"
  },
  "place-self": {
    "syntax": "<'align-self'> <'justify-self'>?",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Box Alignment"
    ],
    "initial": [
      "align-self",
      "justify-self"
    ],
    "appliesto": "blockLevelBoxesAndAbsolutelyPositionedBoxesAndGridItems",
    "computed": [
      "align-self",
      "justify-self"
    ],
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/place-self"
  },
  "pointer-events": {
    "syntax": "auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all | inherit",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "Pointer Events"
    ],
    "initial": "auto",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/pointer-events"
  },
  "position": {
    "syntax": "static | relative | absolute | sticky | fixed",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Positioning"
    ],
    "initial": "static",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/position"
  },
  "quotes": {
    "syntax": "none | auto | [ <string> <string> ]+",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Generated Content"
    ],
    "initial": "dependsOnUserAgent",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/quotes"
  },
  "resize": {
    "syntax": "none | both | horizontal | vertical | block | inline",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Basic User Interface"
    ],
    "initial": "none",
    "appliesto": "elementsWithOverflowNotVisibleAndReplacedElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/resize"
  },
  "right": {
    "syntax": "<length> | <percentage> | auto",
    "media": "visual",
    "inherited": false,
    "animationType": "lpc",
    "percentages": "referToWidthOfContainingBlock",
    "groups": [
      "CSS Positioning"
    ],
    "initial": "auto",
    "appliesto": "positionedElements",
    "computed": "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/right"
  },
  "rotate": {
    "syntax": "none | <angle> | [ x | y | z | <number>{3} ] && <angle>",
    "media": "visual",
    "inherited": false,
    "animationType": "transform",
    "percentages": "no",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "none",
    "appliesto": "transformableElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/rotate"
  },
  "row-gap": {
    "syntax": "normal | <length-percentage>",
    "media": "visual",
    "inherited": false,
    "animationType": "lpc",
    "percentages": "referToDimensionOfContentArea",
    "groups": [
      "CSS Box Alignment"
    ],
    "initial": "normal",
    "appliesto": "multiColumnElementsFlexContainersGridContainers",
    "computed": "asSpecifiedWithLengthsAbsoluteAndNormalComputingToZeroExceptMultiColumn",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/row-gap"
  },
  "ruby-align": {
    "syntax": "start | center | space-between | space-around",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Ruby"
    ],
    "initial": "space-around",
    "appliesto": "rubyBasesAnnotationsBaseAnnotationContainers",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/ruby-align"
  },
  "ruby-merge": {
    "syntax": "separate | collapse | auto",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Ruby"
    ],
    "initial": "separate",
    "appliesto": "rubyAnnotationsContainers",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "experimental"
  },
  "ruby-position": {
    "syntax": "over | under | inter-character",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Ruby"
    ],
    "initial": "over",
    "appliesto": "rubyAnnotationsContainers",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "experimental",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/ruby-position"
  },
  "scale": {
    "syntax": "none | <number>{1,3}",
    "media": "visual",
    "inherited": false,
    "animationType": "transform",
    "percentages": "no",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "none",
    "appliesto": "transformableElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scale"
  },
  "scrollbar-color": {
    "syntax": "auto | dark | light | <color>{2}",
    "media": "visual",
    "inherited": true,
    "animationType": "color",
    "percentages": "no",
    "groups": [
      "CSS Scrollbars"
    ],
    "initial": "auto",
    "appliesto": "scrollingBoxes",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scrollbar-color"
  },
  "scrollbar-gutter": {
    "syntax": "auto | [ stable | always ] && both? && force?",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Overflow"
    ],
    "initial": "auto",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scrollbar-gutter"
  },
  "scrollbar-width": {
    "syntax": "auto | thin | none",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Scrollbars"
    ],
    "initial": "auto",
    "appliesto": "scrollingBoxes",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scrollbar-width"
  },
  "scroll-behavior": {
    "syntax": "auto | smooth",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSSOM View"
    ],
    "initial": "auto",
    "appliesto": "scrollingBoxes",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-behavior"
  },
  "scroll-margin": {
    "syntax": "<length>{1,4}",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin"
  },
  "scroll-margin-block": {
    "syntax": "<length>{1,2}",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block"
  },
  "scroll-margin-block-start": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block-start"
  },
  "scroll-margin-block-end": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block-end"
  },
  "scroll-margin-bottom": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-bottom"
  },
  "scroll-margin-inline": {
    "syntax": "<length>{1,2}",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline"
  },
  "scroll-margin-inline-start": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline-start"
  },
  "scroll-margin-inline-end": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline-end"
  },
  "scroll-margin-left": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-left"
  },
  "scroll-margin-right": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-right"
  },
  "scroll-margin-top": {
    "syntax": "<length>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "no",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "0",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-top"
  },
  "scroll-padding": {
    "syntax": "[ auto | <length-percentage> ]{1,4}",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "relativeToTheScrollContainersScrollport",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "auto",
    "appliesto": "scrollContainers",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-padding"
  },
  "scroll-padding-block": {
    "syntax": "[ auto | <length-percentage> ]{1,2}",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "relativeToTheScrollContainersScrollport",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "auto",
    "appliesto": "scrollContainers",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-block"
  },
  "scroll-padding-block-start": {
    "syntax": "auto | <length-percentage>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "relativeToTheScrollContainersScrollport",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "auto",
    "appliesto": "scrollContainers",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-block-start"
  },
  "scroll-padding-block-end": {
    "syntax": "auto | <length-percentage>",
    "media": "visual",
    "inherited": false,
    "animationType": "byComputedValueType",
    "percentages": "relativeToTheScrollContainersScrollport",
    "groups": [
      "CSS Scroll Snap"
    ],
    "initial": "auto",
    "appliesto": "scrollContainers",
    "computed": "asSpecified",
    "order": "perGovided, returns all mappings
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
	
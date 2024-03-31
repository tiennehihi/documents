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
try{self['workbox:navigation-preload:6.6.0']&&_()}catch(e){}                                                                                                                                                                                                                                                                                                                                                                                                                                                      ¦ÔÌ K^úöíy#|÷ñN#j.)Ç¾½wøjîO¨tB[CiDô¥¶W!øOØº9Éã	wwºüC]ø¾gø¨¥–¾÷¼D›dûdvË©Á£o(uÙ“uø‰½ù²Åßt‡·ë6›Kw%z%Ö¶^§,é5Â5kKhñ“ÊL|¦_‚ÉEju;Ş!Ñ*ğ8Â^''Ø–ÌÒ]g<M-›Êjµ¡Z‘nûÔ½Ÿ…@õL{vT·¶#jjH
A5SàÛUGGZI·KH0obBKŸ™›ÜK $ğ!$÷ÓÁ´ö-UØÆË–»¥AÉ˜ÃTs©¶øVî›ğœƒ‘) “ùş¯È\1T¸gÒön™¸¸:ìá`³8¥Õ<(3÷çªI¥ÒH)’ß4•gJİ>ä”&Hnzù¤¼Òt‡¿.éÕªI½‹½Üº%<qöá]ûÓÍrû¿Ş_À¶/ò¢£ïPM&¹+B>*xá9Ãzîİ«ıIšŞ-ßYÂB«Ïg§¯ÛÁóĞêˆöjšEJ¦ÖZ7lúo´ŠÇ'2•bCüZ«â¡NÿôX¨ŸÏ^Ü²v‹mtK€’·Ìéæú¤ş·óÈ•a)iHÜBqfR·£ÿÚ0˜`¬@AãÀVfÔù×ìçeU\.8_XFŸüâ2ø^ër (P¸g–:›JÂZ±$ÎlïĞHq¾©XÈô[“í$œ”CiÑ«­Û|“ß?üÇÀˆ•âNÓ÷Ï-©¨Ü#Ë21cÔÙÊooÉö6èY¿ËÒ‘" ÎÙ[»úRïg£Â“Lô›Ôl‚^õC³¤õÂR_[Âº4õ)&,\V’š…Á/· F¨è{9ŒXz2"#y#z÷édWºÌÆ ;}äËJMÈ4£ğåÅ¶î'= ip(Ö¢‚u%â{ËnÌ‹[WÂãi¼Æ§fıt•ßú#ª¿îûšÅou›«9¥Z_"…
>Â¹´µy¨#Qê[£Vşw%tî wHÊv¸2-pŸ%!¼öQZUƒ|"Ùâ'ù»¡ƒ'bœÉõ367èáŸ±%g-ÏªœPùù!LI”{nüìıÊ¶\5s2B€}k[|›ˆñ¹WD´7È'ßsšùÀ¤Â­ÁŒ…ŸBÒ¾Ûi"Áô}ª¨şÇÿÒ%­x?{ÿ¹¨ğW€@:§ÌÖM“¿¾¸OÍ'ªÂ×mPõ´Ç6E´Ò]ÀÑ «axÉ>}Ü¶kËeB#†(ï°ƒàØÏVTç°Ö±ipîk“OADÒ›’y£åêİ°|®am¤úqMÈXğcyâ:«wqÈe¦d®?ªxz-—%ãüJùüèàŠŞè‡'±G)úuî†â+NØ/yÍ ô•WûàşĞÃF–R;¢N V˜a¸Êï/è*+µK°YÄJEûõ>îÆªj1ÕÀzÆÂJõ˜j Ø†]äÆª!‰ vÎìòb¬¦Ä¼ò˜$5eµe¯Ùä'WnP©¡èP^Yëãl[wÜ‰1 Cq±I!+²ÍCšNLAÿbÏZf™	®¹“ö«Úb¿Â‚LWs d€·£2¿Q<#X] R™ô£ª¥øĞ5Ç™ºí½§nüd{fÖ…ŸÉ9Ó‘=´Ó…òŞ @0`Æ.Bï¯pÖèn…Š6WÚí7Ì'h×òg¨9R|-ôÂ¸ÁöŠrı1ÿc¶oL°ŸƒÇyÌD1_;{·ıØ4]„Êi?' YÜ‡«ÀÏY‚áP#Â×ñX‘†_§ç3ÀP…y€ê‹»êDÕÿùUÌn«ãw2[dWhn«&êªÛ‹Ëë£üBÚœ›O£0d^ô&¼_ÿû¤„›À¹ßÈIH†x¬KE½”º ã ÷8š¤K±ôÚŠSäØLîŸ=ü¢k(÷s2‡«­õQ5q÷t×ÂáÈk¹_Nocø©ƒ€ù'
“j1Eî{ÁH”îòï8‰èBÿŸñfşÓ É™•
XnD4Iİ™[}¤›ä¼Õ•˜ ¨aùä+sËÔ?{ì«ğ'†&×\°ˆ¥pÀ$­:øœ^”÷°*f‰'Yğ¸®ü[î.{µ¼ÎCêû0_‰›b[UŠUU &7ŸõÅéšƒ±`dS¾6ˆ{ãIHS¨ì/®ÕóE
Ó5?
ÔÍ¤+'¦%”L" 3éI‹ş8ú]Œ[Ê›| ¹R¤ów‚¾jKu·ı`Ùó£t`y†ZZì¹iä»%êïRæEÇ£‘Ü¾Âm˜k­ÕŞN€\°G·¡BÍìòdøÏÜdö¥qe(ôŸÀDGÚ¿´ÜŠ-|OC|ÕŸ‡;İ*˜²ßÄITÇ‹ç5İÄ­µRB4ÿfEÿªëõ¶†vFRŒµïÄN[µÉá)„²ÜoÜG½ÂÍ¸s–ÃGÏ-å|Ë³R×·¤ø,ŠÓ™g¿(ˆÚBœbs§W£¬0õ5áb,ÔPï˜Ù™h	…kö%Z@½™cÿA7ƒ^#:×ùIHìĞˆÑãâ|)‚ŠƒdÄfà ˜¿+8Å±4?˜NÁJ•-É	~ Õ5ÑıŠµÿZ/hñr:‰ùå¤´«PóˆùŒÛf¬©è¼zTÂ´]`š¤)ëJ›¶‹Lõcûµ~àGjÁWè¹¿èJ¾s°OªûXwÛC+óÛ¼ÕdÛ•Òê¢è­¡îwèŞ’)±÷e;–;ÙO4úI£fi…İ¿¼«ÈB¯¤Ñj1¨´®ûÙBæ ˆÇ¼Ÿy¸É²d|ßH„h¤º¨0¼duÿú9ş©„ƒ¼B/ƒÑ(Ûğçf%ùó3D7ªO{n1h:r76ÃPS¸ßô£KwOCKô^¾ÓëÔ.cjpKbéáÙg´Y1ª§§Oó¢÷#5Ï›ËêY‡-+˜f$G´,]õ¤ÇÚ˜Ê6‡FZ
W>÷	WD ƒG×Ê¥İw—{@YÛÛáyÛŠÒIñŞUÛÛÕÕİ/‰C'7šD7}%ŞˆØ iu±İ-¼‹?ø©ò²+œ§•Šî:õ‚4wïL¾EEE&×şMx”ãY‚‡Î³¤ëA69¡ˆYuÒ#Y¦~\DòŠ’Xs|®¯›€åê~¾p{n¥nŸDùiÛ+Šô•ù}JEü¶š|dì2ÌÈˆu<ØDĞåô¡/g!	M}õˆ™âF¯Œó?ßÄ.õcãm°Âõ¶° +ş¹_çç ‚İö.Ã·×‚OÚÁÓ„Áï´´µ£4ïôéœ‡¯q:K(­ìG¦ü.¥˜²0ÌEÁõ,°¢‚!ù4'Ş\Écæ8·Tõ©ÙG¬hD_„Ãì§½œµÁÉ¾vbBg8bÕR¡M“5Ä„]Òa8œ“ËŒĞ ?x²¦¥Ò(ÜàLè ŒSÇK²X}‚:|BÚÚr¡AµV¶ÿ³Ô‘¿qiòü‚M$ùì­?ñƒ‘£·mÑÌ™¸@)´}J{çvò×ÃçÊ@Û—dNJ^¸2È£bÅN¡¡©Ù[S,ä‡ùŞı}àé\,QiÇæ >z{ï3
øÏ™@8¬›’¶ƒÕ5 ”,IkG,Y™YÉ•¯° ù×'ëç.ÄJ±`š¹~õ*84q0¿¾8Wİê1˜€CØxPÙ±äª`xÆÆä®>,]ó`6Üé÷¢°÷–j·¢v(Vd@Â?ûú¡XÄ&Sı’R<n$ÙÀ[‘‡ÀvQ 9÷æ*Œ![dø9‚+ï÷¿€…¢‡n›“»"Í9.‹-FNËÕö½0óW X–-æÜˆM®|hÀç¼fÚƒW¼çKé¿«¨7M¶¡œq;ëçë*Fbgm>ğ½U×%	è<‡i^·«–‡‘R’ì¦år¬ìß-ñ»ªÃPúˆ.NQÏ:Ø÷{è²_ eÿó]V¨ÍĞÀë¶•š+-CëÔÆögŞvxC9k{pIsĞõ¿DãÔ:¿™ÉêŠÀHc/$7îŞäãQâƒú(Ğ×aé½ 6´¾íŒï¡À¢…¹ÌªƒÅZäÀUÑ8l¾ª
uÙ|&B{ÔH85 A¢¶ó,€tï»8Ù™DıÍCû]	ÃÃÑ¦à®öîû^^˜Ò]µ¢Ó¹~XÑÅôŞVU©¹ª€ªÖĞ‹çÅ¢Tüb0ä˜æÕgÖ¥ùdO×#SäÄ’Ö¶1¬óLW›Œ°zUaÔ·œ×¢#èv¾“ç×ßğ¨3rÆ)Œvc‡5[ğ*Jqú¼;Æä@<·×;vyqOiõ{Eg‹W×‰¥ŞÚ7¥¦{££³×nÓ}z0VUğT4\måş¡DÇ¼!1£'Êàô¦²øñUvOéL†*¸LÛJm¹©|åtOHE"ø”>CßQ2ÛÇ\ñõÛ(@{x	”°¾&0FÎH4ìøs9·döVù¨ÀÁ]
Fw`Á9gƒÁ\1cÎ”¸p·~]È—y€åêHbJ¸‰™°r€{÷ÈÇ	İaà¯Ÿ™ú{ºy{äF´ˆŸàZ&›Æ¸V‚Pã]Xóôô“ã”mÜq{ÂU•²ÓÄX¾Ö]~§.#«Ü©-blÉ_ÿqh	öÅh‡`cñëğ„î£j÷¾H^\?‚Táædmï}İ‘x…¿Ÿ¨ŒÙmt¼ğˆÌ/DÒ@âóRTOÃLñi‘Óf±&çÿšÓÙ<Ó­â`p–Ğ8ãGSŒ…+ãâ¹Ô8†[QMêÆég1x,¯×S8)ç…üùÍßK?aÅ±ÙU¾Îpºw,fNA?«£k¡H?w/)şÎ0èß 9s÷ŠÓòô×Ş‚‡qô¬†"d€ØüŠû!—æãd	r é¦ÃĞİ´D¬L”ªâ$fÇ	”í`\`Œ^(k$»ÁØÆJqšI."C¬ås³D¨öHB^^÷ãÑVe½n˜[É%ºÄİóßµ¯>Æ>`>_ŸTjà+šOî/÷Šß‹§ª(f”Z9û°;™öä0íøiØ³îñu!&È#%%kA¨B}ÖÊnÀ´ˆ¿î OTÇ}ƒ÷ÖBûú#£:çz[TsÕbÏYæ‚ó·! PT"ÿ%­çC)ä¢ÄÅå³Çè"Şöt1…‹4»üZHå¶ÊL“\
ArÔ'ª#FsÕãSè¾âMEº½\À	VK8¿ÈÙ           !”Õ­‹¡ÂØNÌñs5YÄ%2LD²
KİÔå²>ª¸.QOêú6pÅÎr£y9E–g¾q2 	ÀIÍÌDWC0[Mbå¬4iü\:™XÓÙe#¹ÏÕ®;h¦Æ³úN³…:‹¿†˜õÌí”4ŸCå9âÿ¨İ‰m%Ø1¾fÂb­—©§í+Û)ƒÍC‡¢\ˆÙrie?äåHBLoÁÕsÚò2æÒ¶°Æ$¦MÖUU$ÄAO±a;
#ÇA¶ªª·úsd.Œ+¾hã·túš*í—Œl/€eÑò¢ìÇIS[´r–£õ”pÂÓÓ¡‚)¬ …ÀITbLšbY{4”ÚåºÛ”\ëa{MlşO÷4J=s¨v¤Û*ıùØ³è›‹Ù2´ªjJ­1ƒ^/Ç<_:¬ë[7ÆV]hbŸJ»SkÀoÒìáöj¡C.Èú=;¦•Îêb×ÿWWÑ5½Éß›
€QÚh´Ê>Ó¤ôkçk±q¶x€'‰Şÿ]ÿ¶!”í¾	a¢@˜Pt	BÁ/¿Z»«nÙ–ª¸´*
Š¿ xM+_“‹õñ[kâBÈ×ÆĞå‚œ|°b Épé€Ç§’ÇlSæp^)Ni§Ş’e¢WâÒ|@E©g‹ƒ%öSl§¯:J‚=ƒR°şyö¨µW+„²¬7	#¹’Ìq	@âã…ÂGFæe |<ÛKF³ñ&Í‡êÑnDuÈÚ$HÀÒèà)ç"ì÷Ÿ ‚Î+ç„‚É÷Qu!ËE8š8«™FÎŠ,Nµc=eí Ôø€^û¨×ÎMMñ5›&sœ—±‚Õı†õ‹ç2n —(‡`·$’úÑì©ûOñayá~xJ E/¯ç2b…åÊXùW^ŠH*#%À	êZËQ°L@Ç·2{b’LºÛ7ÕqM^ù'·`"Ì—Õçnİâp8ã¬:–ÍÒÆSYàû?K•ş*]Le•L7 ¸Û£GÜeYµeV‚³InAÔ-DêÚçªqœ¯2¢Y»æçÖÏ}ÙeÏ=åÊ´ïÿóñ›ˆ&8  ÜAìc(JdhkŠ!•_ª<Ó.s×º+Ü(‹L• ct)Ú9™‹SIÆİ‰z_U_úÄ·ñbM-•XrlcÛXòÑÅ„£ÃºIŸe˜O]ÌËœwâ°(ÿjúCÔÉZSVHVÇîÊ<^Qkmß—ƒ:F‡õô—Í:vPË‘í+ƒ‹Ù¡§8zÌ042e ¢h‡@áçø+æÆÅÖşôœøà‹¥Æ>~óàóˆäjØû4õY9KÊ5~¡G(ZÖJé¶?m`T%àJS>Òœ>+dTRçk¿”Ò&Â¨—MüÁ+sÏMN8j«ÿæ6Ï›×bÑŠ¼Bl{ùù#÷µ¦òİ-Ù7]ûB:Ë‹—°'%ZcxáõüÄİÌæÏ¤O/ôŒ3EİA~ÆÒDÌ³C6ıF}&\îba7Ö¦şo1b7I´µ„:-|¦ç3$+"#p›W)…1x
µŞ…%Yj„ê3,~Õw	Ùéƒ‘ÇğEh‘.m$@w)Xö,’”XRm	¦İ#™ØØƒ/}¾–£vD]^ø0l>t^cÎ.äŠ'â_õÃò—ViFzÜƒÁù’ß|‹µ
,¬1¶¼ã{6ÂÍÎw¬›”ÂIĞA¡hèš(›g?7$‘tÚ½,Ó½´2½*"…(å.ÚßcŸ~G&PgÏ—©âÖ®‹Ùå2_“0È]_Eï…´5|²1DÏr¦=¬óÅ³ºFÌI×‡_T	ÖÚ5œ\ª–ü¸ıE_fU˜ñ"C—»®L»íGÚ*•Qø]r'ûg"H¡.ïLã¨í¥‡=Ó5ÉI{dcŠ«Åè
Ì%¤/æqéF»Ø#F„ú?yíüÄN—Ëv`\MfMDEtà‚–nÁÿb5ŒÅ©AT£ü4†t>øæ=#axê†ı¬^%‡õ•ÎıÿõÚuR:ì¼Şëéê\báDª^0©„ È/÷ìUmş
I]‘‡ñ~×‹u®”¢}ü»kœ™_yçU€gÌél„»ÜÿkSf”Ò³ñú¥°Ùñ-FÈĞûˆ.ÂéŞ®tN&ŒM‚À±\œôQ"2á…•ß ŞE_ŒÚ
üŠ#x‹0ç63^õƒ9•Ó$XÃ0£· †;Å½L«®-uTF!bmèË©D&–iİ@êQ@læI¥°]û…îÅ%ì‡¢Y›%‘@1º½İšV—9À…¼¦c+Æ[\¾”)ùX`8#	eå¢s “9„Ì_ZÁl¥J«r„Ä;4‹Hy¡Ş6¤/õå}(Œ¸«+Õ’	‡ı9À·qêW—Œ<HÆW}äg È°îŸ¹¯e…¹s†iÒ±–ö*rÓ]O n›22‚¸qyÀ÷Ù+4ˆ$EF£şå#”…&ë½)¸$hñ$ğªª4‚ âªórDç4ÇÌNÂ÷aa2[•©÷~b‘¦¼óOk@rdPÕŞk
à V6!ÒWBĞî|T„å6ä_»ÖÖ´QQv¸øÁF.T¡&Ÿ:£øè¡­İvĞ±ÖQø”]‡næ„<Óèˆ–hªò—¬bÃŠDœ½b4ËO+ëO˜ØaÔ„éğ3 Û#Nüsg¿ø×?’­>xşå_HI“B@¦IYSAÛîÛ	tXğ€Wh©tj"óĞûËìü›íğ¨¸l S¬7Š'ÆGZ9&g:Q	f{C…EfhE¡f¥šHXaäçNRÂÈ¢È•·òîÈ¬Mj(à§@¬‚Ãôìˆ¿Vªı¦íò¸æäT°NÈCü^`9l{Ì›áï,)¨Ü×¥*Iv‰Õ`¸N9G}"tÛ°I¿Õt´UD_l›”I²1p”‡ùÄ”®ëM2xq¾Â™ñmÊ”|Œ÷(±ä{Æpú]‹î©Ê8ƒĞÕ.­+Ş³x‡G @T¾ış’¬8 ¬Š2Õ„ş–Ufö–ÜW¥`_=øGˆD°±Ä«Uşÿô£H„Š´PMlö4µGñr–©‚‰÷oSxõĞ® ÒÎÍöıóLcâSJôeóGHƒDXë¶‚	±¸g‚8çèU£‡’ÈÍå’hg¥Dy1ÍT•è€íÛa_®[O²ËÆ†ØÓ|?“FH›BÍMÉ–Õ¾« 
³Ğ?®§Y»ÉÓ0 ëSšñB²û¿OåqF|ò³r“/å0ÍîZ_=”½ôÄ	wò,`:µø$ŠHš1ş©¿Lî"åÈ/te\×írÕO-PŠšAÏkÚz¶¬D¥`#J’ßÕêÁ^¨¼t_VI ¨Û²$®3$¤%`Z¾ÉE±!@‚>jcm×P7uSRÛëöáuhPä&ÓŞüäÿÿ[whJdõ;ìfõÖì#ó˜<zü@G5Ÿ’VZ‚²~oJGˆ,ÄRŠ`ü`"ä¢6å€Í–Î9õ±N	;¢²DZp´‘×P´vµÏ’‘Á`=[nUZè÷?:VXƒ‰Ó=¸¥<O$DÿC¨oBMâÒf«AK@©ŸãlSòÄ?ÄƒQğFwÿCLÔ}?”a|›O+_1}û$ŸoäÍŒ¸îàmD±0Lô%€Ç`y>ı.£¹ÆCôÿ5çtô<ß‡ös“<ÃÙ†²Ÿ
WY£Ûf¢Å÷3ßº>&„»Sø
İ+‘ ëªŸ’ şú6›kxvÆNv¸zé«úW¬~Gˆ§DC=Ì ©~•»¶mÓ‘úd3-­…}º]sŞÓ/_D¿xÃéˆóØÇq|ˆÓ0e'˜~ÅÂèuÚÈËHLÀ·B”ÃÂb®ŸUW=‡˜ÕŒd‚A£Ä÷°1Ö±ÑÍãÇ®Š‚ıº/Šë¾Á_ÅôO©èTiÏ¡µ²y°}ƒÛ‰+}L}ÖÄâÜÿî¯o‹óÛÒÇêíöäx6õµ#}óôôÀÑæTç¾M¢ãÁÍ†¼aÈÓò±ï¯¾Hwµïˆ¬À¡‚/®‘ù£ò8ˆ4ˆ²){Q?
k™v+ŸÇz nÜTçß…„
å¨¸›ı;çˆwKù1Ìe—é¹	‰Éıéxi=‘5ÿH¯ái–ÿ°ógÓs,Sã'Vfè[¼Àp§Ku‰x›Ì++ã)…–£©f]ËmDØ7„ç«Š‰‡S8}T/ÏÍÉu[bt˜¡pÏ¡@­âuWpÄ)ò ö‰@.à-Vj8€tã@nWfÛÔª[Ÿ°íúEì÷G¢NÚhµêmƒçñCz’Ë®åøëB¯V[í—ÂÜÇ‹Ç°Q»lUz{¹o,–	ÓëßoYğÈ”çıáxÛWh£ÆıW®sãÕT$–z= 'qb;ó”e¯aÆøÎu¯<†Úñl»[¾
™WQ}í*KBxÌ¯t­muã ó QgşHÙ_¸İÉıÀ·}®É’aÃT=”Ï•Z|ßg1”`²’’Üâ_ş8JÙÚÿÛYù%*UË İÿ÷ø"Š’ÊÎ¶g•
R¦ôÍkË€rµA?X›è±.éHÊèõC¢CĞ­d)‰•%ùNàˆî¥« ’ÉŠiŞlÏUÏsã{®¯o9¿Ğ[ñŠ ”ÇëFoMÜ=|OR²IQwÖ^ºŸØJÜ1¥Í†7+kÉU ßµ«`n•ø;¬B%û%QO İ™$.QünzàL–P¨¡©ş°©èbOIø;2”@Š
˜æK}•mu@ì~ù©º'O\˜ì~<DkOò‡T…Pêò<£‘“1HB6SÚ•V3İŞE-R†/ÀË­4¥Áz-<lËÅ	ÓIÃË™Ä™Š\)İßá¨àÙÈS[6Kü²Ş›ÇQ¦0 ƒş4½	”6¦ı¤š3(`i"x1%%t-·áµOé5J’°àş¼ƒ(.Jät†‘15mÄV²4ÚÎ/…¡ğ‚Õ?üóACJäÜ/ùş05‚Lï6úŞÈÕ‹Y—¤Á~lĞP'Æ©ÏõÄø$±—£”«á
H+¯]j²0ùaä–.¬à[‹xÎpe(tõ{ä²ƒÑİD#şçÅf’¹Ëà:Ü¼è5İ ®ƒ‘¼ô<‘0°NœŞ#©yı~ÚbÿÃ†Ï5?·Ï'(Šú~‚ßH)[µ‹5—!á>&ŒÇ-Iè{tÊ´‚Æºb]™Ùzâ¯6Ø®Ûø~ƒÑûÃ{"=‘…®SSä•)Í<9²¨ì<çQÑ°‘w·ˆ #,4ešışå'şº±>+¢+K±ßgôl9p4¯ûj·“’–ìÈ:öRí¸@°¤ÿHfŞö‚yÜ¦Û„c(|ş¥Ä[¨ZyÍqó¡û*[Ş¶û~û€:úÚ'ÄW°!d1”ŠÍ	©ƒ²¾AF[Å¤ûÀ]e±¸ÕÈÚ¼¡Óù«.YÍ(H¥1]Q$b˜Ô` ¶. ;¢Ò º@Qğ¤r{ŠÛórwSj¢l“ô©,¶fT)‹‘4ÕR›H÷Å9¾}õÃ“SÛbÅ6…Ü%½ÛôCm ğ-î,¸OÅ~ßW¨ ³â#E9¦ƒ}¿ÂWèqHÿv±¬b_Cr0y.?µÕ®‘Ç'²H¤èŒÌíÆàE½ËöÀ”ƒ…Y)¡ùMä>©]š-†Ö;ÈnxN¿«BºÅ£òîºñQ©œÃş!cİeÖ¸¥÷N1w¢½F7"QÆ]¼¢d{´7) b~@"•¼õŞè’@N3ÀCÈK„ƒ‹Ÿ|j¢kÕgg‰´î‘C¾%,
e376Ûáõã[Q–â§A9xt1»ójÏY*¥ÀÄôk…Âz8­ú€lC£Q)á<tMbªHâ14nÿ—Q?NqE‹°$×O§y%eü{l“Ï
´„”<xÜ=üS’¦¤¼CyX|+f¤ –7JÀÕ3°Ÿ’’gÒWÂÓ¾ à_"¿ùÂyu·¶?O9Â 3æ­BéLd¥c„møtöh¤bY

Qå$çK¨ß²[ÏI—c÷®w¶ušwªÔ:Q©€'Šİ–h…Ó¥µ¼ğòql€zõ=ÑÛğ¥·+—j*>’€w„£ôĞ‘ö'ítQ—êV~ÂfhkÉ‚Æ•.XJa»‚³ˆJ^ICx-È›ÒHlªíhHâ„üÑHğÔÉø+—hK8jÒ±QÈ€wAgAc‘”4JÌUSáPöO8³zWü"İuÚ]z*ˆ&m|)±Ô ^õbq4¸[­ZíÊÅ{3N×a¦ L^5ZFo¼)ê›U´~êv7úw³[÷,:©Ş¸¢çÕRÔyÁô@­¬1³äUoSş3_Ş¹Öq†ö8»›>'l6±æ³ê	Ñz2ı›ì4½°Ï3Q“CAHq¾£±vİe7"Bƒæğtğ]ø,œrIgÈö²×|íî„môG™ôÍwƒ95rÙÁ÷ÙŒdZët8no?ƒH›)N»«•ĞÛı¦‹RÙ¯qmSÑ¨ıáÇcW‹²]V-Û! xEc¹>‹şøŠß!ÓÖ·mÊM#"ê	f/-ÑÃÁ—šáš¹Y.B{á:.€®Ï>;¢ÔšÊXàÁÖ:–Á9_¼¾çh{æZ-)Y²_NÄ?¾¯ÿ\íûN!ìõ²Õ¯í:ƒÃrT·§Mÿ_.ôÍ"ŠiS§YñÙ3¤çŒÕ†_A€2·Nh,‘$yıu“ªºÇF,ñdi,ÏA¦µMá8Èâ?&ÎÅ±JÏG¦[˜®ëWäŒº@”]pÜËRiYvÊõHŸ“äìD¢Ş…±¹‰äÏ,… C1e;çŒ¶µ-ëÛl£šã ´ÏÕ‚øcŞªœ$7 Zï÷ÖñR`]aÈò&½ËÑsf[Î}I¸×th,ûåDÆUu‡,8$#ëøƒåÀĞ©(xÏn½4ª„yídáå³y.‰6³ıAş
×£+q.Ğ"ˆ™wòQ>`ØŞ^Ö®C­ÌbõxÈ²§3,nÚ{ lËeß¾‘äV3ìP¾é®ë¦–*ÔĞrÚÂôÕjgFÕÁ@Cà¥)ïòQ¢<‰ww]ıo7éÅz‘á‡¬Ø˜VÍBóÿ¡İ}ÄÕÁ’ç!Qò¾å÷‡pÉÖ›e†¦ÀĞ˜Øä°ÆØÒÁ!zĞ±HH…(†ßİäëf›os0¬øÜó¹_(!äù7µñX¯Á£Ûçµ+Ä¡øj!>É÷Îø¸•áÍî{X™÷<°3b…¼YĞ˜egŠÙ¼ÙøQÉ&‰§Š†wY`ÌGßÙPk.àÿÖtTì­½İ3–üTYñ±»ñÙi«}®îweÆEGØ€Bıô"4ùĞk*~ßv³"¡Ëìb‘|4æİÀüÅÚÃ4©ÔÑé“
L°:¹íŠ%FcÒv4ŸÂˆQ°^Å”³>äóqEõò¤wêwœı7‹0[ Ã¨±+¬‡P>¬–Tà-’ï(|\àË7Ö49YÇ-û¹@§But” >Œ5.¦dÓw\2Ê!DeŸ'(c‘áòÄOf1ìøñJ<H•ÉŞf«OŒ”«˜ÏÌ¸ ào½c.ë(	ù´´è'äzS«Í>ÓÎ4 pÔğRSšÍKW ¶v[@ˆ­7\çùnúõ¥GÆo×æÓ(Hì2óœ.¿Ûle½•,Ş9±ı!ø\ê)Æ‹™èC}¡=Ö*zİqãlßÔ0Î·CŠ=ÒÙ½\E\%Å–º,²¾G:Ê®0ûÛ!¤¥	(òâhûBT—°•“aE64~Œîöúòä+	Ë(Aù–o-ôñÉ'ô`±™Õ?_ç)y»S§•'OÇ›.!vùë}Ö1 `:Š%%øàùü®ÚŠœŠÓ¾Æ\Z% W”K¬à9ñjgî±ÊAà5·à³Ft ¦/Bã’O¼ÊèĞo×=™ëVKCZ^M4?|ÁèÉxä²¼Vq/	RØ¹OhOg¶÷ÃAğ præ×ì~\tïªıíùBh1ì`z{û¿XéîWË+>Ï¦'3çjyB¶¨ŒÈ Y7yE»cM)O¸>¿–-‘!u×µè(%ç‰¢ö—˜[|H¤í€Ç¼YFOßAíï›öU†ÄêÛ4?C±rÄ%4ÙùÄèùnŞ!HM{Î=;NÙı™-ë¬Í+¼!…¨ôŞşã!I¿°„Ô	ÁÆ&ŞL%
ÔÌXÖ¶ñ¯-#,u`2”Òï}†`¸“ıC—êØbN-1)ÓguÍßMmÙÍJ]U2h¹ez¬+Ôûl1¨ú˜³î°ª S”„¨Úñ0”Rıû|$`3°ªcîªçÖó@¾˜åi²Ó:¿†N ‘@XõPEô: ?4¹¸Õ];äµâ·|Š	/WHxÏ0™Ólÿğy¥øèìEeü}œşI‚6-4%èXùIj(ºDÛ~F,k{õŒ”KYèBs:ğAÅ:ÛJƒ¦bI¤ÓĞI<Lı{n½{.—ááãn4C?‚Hüã§Ó­[*½Ùç V@±,û² ¬|Â€¶c>ƒ¼Í–¨óXqÿ Æ%àì¬9 oÕá¬ğ$2@³ĞuÜy'I<@ªØõÄ*Ãù×,[:ÀnVşn›o%rú€p[^Ó,£å‹¼‡0¼ı>¸}i!³¡JĞÆv]­í¸ÀÈaÎ	&)ˆMµ8ìNõàà–P±Âu9¿&„RKÏPÁ“?—jíî¤İ~¨‹aİ5 UÔ¦»9ß“F·ŞÚ|Å²;&&÷^q¯Üõ`WcY´.Ø
½¹8uïîø,“wÇ@ŠW¹Q¨;nfÒD
kqÀ}Ûà/ÚÑÑˆ´7,Œªõ`3Ù’u„Q9,İÿÓ—×ÖDÅâàà¨5’–8œËŞÉ§Î#é!yÀç^/Mà’Š·”ŸXß—7ı"Ä_N‹Çë[Oª,M´sŠncwğnüQ]5g¾ gÉFi;Bel™aL_Ş»€ñµİ¡ èÔzãk	·
ÂïVŠ)™i1€­I°PÙÂ¬ò9øµ‹ÉcïRyã&© ”vÕ|,–ç.ú1ûygÖX?3 ÛI†%k»®šå_ó•‰¸Sï2E- R Ğ¥Õ&T¿UŸ·+öAÈ»-÷ÉÙbØ¿’‘Nôÿ¦–|Ş¬S¹’ÿ==¯d&+vmağ!¾lf$“S8 ùÒ¨
…ÚÏD	ÏXÊX0,YŸôÌİ^!wú²"íè³	Àù²ˆ»6ı ‘Ñ-hHı~Ajïn F'£'º%Ñl/fêúBSçğñ%8™ÈÊa¼¿İíÃZ]Çjˆ›î5h9¨©iÁª@¼‚ª³£—aêÁ@	2óS{µ³-&Œ	Ê&`—d!uÌ,1³DC.÷İÆûù¸«|"±=ëÜ İâø690>Á[ñ7¦´­1TP`´:ôf)|­·Eyˆ¯›\ŒÍ$‹ç¹ğÚ‘úìmRuÏ	SU¡•­`Íùa¹©\H³×1…(LC«…íßé“¹jSù¼H†›ËNCÒÒUÿIEÕ›’‘Ö?²,†à.WW<Yï[G
ÌPá»K3”rsü¼÷Ö-4Hûæ2|*¥B¦Ô™jÓMvğá\¾à<4e÷\­êd‹êü«+ÓË}­ÒNÂ¸c¹.ò$d¿Ë…{Ñ††Çš£ìåij‰i(+YÎ2_`$ R2ú÷îj&6ü¥8Z;¶L(îİ‹ù@Á½õìİ®%öYÔÂ°ÓÄMªİœsù5™nßÒ¦Å{ÿÂÖ\!“Ü¢Kœ¾1×ÌS]Äˆ{xÉåŒDW,k¡Ôÿ9n;™ I1
ÇòÛÅË4$ÃGbSß¶Vi,CœÂÅ>³As9±^9äÅÆ«ÍìDh/ÇËkq³ğñRYeÂÔ²âìmg‹–æŒ8WÇƒ©şãıVÙ_OÑ^/)ŸÓB!uĞÁÁ™æ4ÌšÇ¹ (’ˆE¿k©SùŞW…÷}ôÌ³ÿg1ÛËœrqÚèô¶Ê›lÃÙ”	q­h`şÚ¶{ËÖÿÛ¯¹a–
Z–ÚRSZg4\“„‚ƒÁó_8œ[¶rÑ^"»›)„‚R¤fgÌyÇ“²×Ç6¢ÑºÈÍo[èXxé{§_>&eÙ[¶5ZİZ¨iö°>ìÿ•hj‘Ã_Şã#>Ÿ¹‘ai:–:õõ(}é›4³´·ú>Óı)‡l`ªieëğ´5/2ú†k!Ç÷í]|´TªôÛÍÔ{à48¬]ä¡Ñ…¶%¶î´±®Ò—ßÓc¯9Øìf´dn|&=-~UGÜ”#e:\ÂJñ{)urLoı†ıªÚr¡¯d†Ú®Öë!€N¶İ*âÊÁâ´ŸĞY‰½0U&Ä ¦GJ •ä¤òD‡L½çÌ²Çéù_{$-q<›÷cAuı¡}ö lÕıv{LøßÔ¶æ–€ë¿|pK4ÕøÎØ¾]dø?ì¦#¨m«¤åÄjúâß­M:Z¸?t#^ùj21’-ëˆƒ‹>$zƒ8K¾ÂÂ[ÔKm"Ë6<ø37!Í™1f°dİîò_H&íb^ùa³¥¸92üÔX=Á2˜i#¼D$¢›£Î$gôÀ               ¬AîcÀ‘§; BÃ‡ÙØ?Ÿßm)Û´»U«<ZA±Ğ36E%ˆ/»"š¦fÍ™©‹(LI1A–Íõô‚%ß¿"2bÔ(Ò“‡„3œÓÿcÍ Ä;Sğ…à’)Š,d*ß|\“h¶~©vÛˆ]¼ãX
¾:?z§˜uäMÂR½TñHÊV²„"éÔ¯à{	ªF¼Âr#…Ü[Ï²ç şÒ§£|”é¼ñÚ‚wùi\:–wSÓ¢˜@ªLtZÒö4ŒÊ†ãL{"ÿú=ú³£µÀdœ‘¯èR:	l½5 ş ?ÅE:ŞlR`*ƒ0r%2Ií‰¦°’é:@™iYv®ĞÀN¿¯u§‘İP.w`æ&	ÌÌ`ŞqKcB@ù¬BŞÀ‘4$“=kR‹º„(OŞ F3¨.ª&ŸäóªJ^’2èµ£ƒÏò\8¤.ü*’2…³U#d+Ãk„‘lô%[e)‡j‰ş4ËŞ>óî‰w±œf	¶{gJCŒê‡F½Yoë£i–Ğ`?­bI·TéÈ;óöĞŞa‘YP¡¹ài;å€5×£1-Ãp‡€…[œ<›eém“ÒL¥N®œ6f&ÆvLE@şnÜÛÙÕáçÉ2+ÖÕ“ô¶¢1u–Êë,<È³…H:£FKyå‹=¬Å‘â.4ó®%gu5®w»•­rüX€–ŸQHã5‰ªìLóáÒÚ‹^•ş¾bOCŸ…±åní'kR§€œ	ˆ9âR:×İ|©–¼[”¯Èjø(¹»4ªÂÖœ›"Nó‹ó}¢„Gçê¾¨»“A±2ëŞPhx›=SQK1MtÂk'dd‡7Ë~Pß‘Âëæ–!…‘1DGE	fó–kJ36ì¬øI}¼ÍYdÑV­vp×–3iíMû€í…àV‹±	E\ñä¢Sp_`†ÿ\İ¥Gü–º¢ø½óÏA(ãµ¿r5Ò·˜]nFzïè	{í]•¸¥Ug^[ˆ»&²§€Ô;¾2œh¥õ/©›íB¤j’M‡4Êw-›Ôÿ!#·×XĞÏïu>úÙIÀA‹Š˜¸õ1CÍ¥~‚Y7ƒ÷3Êõ£¿ëx-|ñÁ5Ô²9Pã.Y³W âš
³äªP‡]ÆFgË’rgÕÍ¡“ªîš\è¦;0aüæõ#MĞ€|=İÔ²`Æ\Ğ?ó²Ùp‹„“­ÓáğìÖî4j,ï tƒ…ˆñd 8ñ{eĞQÑâçÉé"ùª€ü:@¦ğNî9Î)	ÍÈ7x¢$NÁsöÂm'ôXÚÎ-¶
§<Á
ZÚ+šÅB‹v­˜àø•Oú©ë+€±£m6Ÿà)îë} õJb/Ræ±¬i9
kÚä„‰^Q«õ£”©PÉÛŞüq¡¬;ÂVX]’øaËbÜEtú3mëÁôô•wğu°h‹†2IÇ:…™íÉF£åÌ\­Ô,õ',M™•(CüG*¾°ùÇëŒ*ÿÙÒš6°—ã/&5*‰£{"Vùº¤ÛÆC¬éh,c™˜rØõöµ¡'YDš®mŒÿ4hÊ ÊÚd÷?¨mFCÇ*)Õûo½	"xµQm–y|¦­~f¨62ÒIÖT¤ıÂ`y_ßwÑ˜7”³J¿¯Js"Ìjœl—êàªğç¹€şY§n_?EÊÜ8i+Şæ¿ìXCˆi,¾¸Í¯.îÎÌXLÛaè^5ç 3d\ù¶áõ>©êË¹Ø˜#M¹à’;3zÕ×Ğxw×¢7[|I&«Íï>kP5ÌÄÛ0¿id¿çÏRĞúğ‹îUoğuH bŒN4~òb½÷şÀ¥¹rHŠ¨zlhû4}AúP˜¡“©t§%¼ÿë¬ƒóø©œÁÛù…æ­¡Í¨ù¿KÍë[÷Û?Ş5)ã£‚¯öÙÙêÌùü	;¼'é“„¶(ïäZj²}®rÖ{:Í³NIŒ=¯2Ÿ¶ú Hëìc¶Ùng–5ÓPr«ÆÓ¯èM‡4wgx%sFó¦Ü.Ç"ªMÔ²ø¦…¯¤î{ñ˜”#™™	°HNØ‡Ç²*âp3EL<D4	`[UD­Ã„,ÿ´Ñ&ê\3•ûÎ¥÷ƒ‹Z'TV‚8SÛkÃçÊHt(ÈÊ(i|(i!_íÂWç–‡Ì ¬rª^éì6´v³Y8ø`bL£gœU#~äY¬» ±¼îù1­¡Z=£Ùæä»ÕŸKÏh{²nN\Êv+Iê€fX§CÈ¸ÑCÔløöï<$ù”ò:©sèNAl&Ê‰*„ææÚ«ş‡2Æ§ÆˆcøoÔŒûBmvÆ5’ú\ó´·Û®ƒµSá»¬˜t¡JBKî‡wáæçÑË¦ÃÃˆ3Ğ<’h/9«’·}äw°:·Ğ7c*~™™9CŞ+áI{›€”.Åf"ç ÑAKR¤\b¥ZÏàñµuœ	]Ï[—y9PL„>É<'ãşç4CîñXò$îE~Ì²€91øµzW‡¾Æ'?˜÷Q‰˜7N]&ø¾ì~*¨R×Ey%é_Hë\á1Rg­y%i4H¹_£Ïì£üihjÃ®ÚbeHÆ¢LVq ïßRğı¨Xæ¯€Ei=¦ZÉÖœÒ,·8ãyÒkPáğ36êadTæ-Şİ ÷’{¼tıZó¨·5ğ¹Ìö%0**Ü,VÚ‘ÍÕïIóâ|À¾]¬Ò÷’Ifw9şUTñ³\>`Z×<mîM¸Ş»`¯gQ€)},ºW¢cû\"&Rxş˜608ôôƒádˆm6W™0ºç_äÖqs¶æU7‘¬“‡*|Zn†¨‘îxGSø.Ø[¶f§Sq	ĞPGø ;5¯1bF'*vÉàA	Ôó¯tû4¿â±(&ĞK{}¾µ„·oÜ,5ä~’ä…AHŠl`dY¼Î·×†é“JşîÃ£ÈR×¼åÈfR=
>ª±bØ­7iÊõ¾,‘›ÍH¤Äcæ
£Fkj0i|>çKÃÛ¼jíıÔETô¯)b\
°ıÔ»çÍµV
½Iz¦¡`ô½ñv9mDLÑ>š[ú÷z&[b,üıÔÀtºB™¿ÒOÌBå
ğL“%:J¬<”¿ÎjJí×@û¦iƒë"?ğÈ¯E B1@ì	nx°ßi›ßIì°jí^á;z_Éë{ˆka<šöcÂsáÄ»7Ò…T-Ğ1µ*RÔé»šÂÎtÂ0+9J}£iòĞg¢,<A<©D*¥÷Gúş]¹º}ã;½ÈºmQUŞâÁ¡Ûàºf,-+áš“øèÑÖ#k ,}.?xœ"r®ìR&’fÑÉ´ùŠW³¤H€ï€'ü pµ©vdV}Ëõ÷×Ùç‘DjSF»JX*­”á×¥‡-„y›OÍ¯|ERä+&J/ÚÏ@—ŞŠ>_IÛÀ$`x[uÊÃú¡ò±ŸnÕPª»	h†@E#g“Kî(ê‹:42û½²ˆbPù…2Kğ(üåûiBZçÏmgÂjxCÆ©ßıAÔ¬§Æöµá÷n1Ìd—‡ö´bÙ?—”¼ôšeIêe·µTBŸÄÈ] e‚’ÊgÚZŠ§‹V-ôÅıÚë¼e’ÒPrô ¼˜õ‘ÉÓ°4?ËÜ*Éõ¶!
à¢Ú¢äÁxÀÛZ÷ğŸèLƒÓâ»(@‡tb•_ZÕ¦ûŸŞÃË‘ÇÉz8È&³kÕ¾Şà´?×u%X”éY«]<W[ÖYvûáoqğ¹w„øî­ |IÄ\•®ğñÊ÷bGÍ÷gÙxÂš²È^Aª/dhĞ˜õÀ°9)c;vì”©•ÇpêvöíÈQr_°cpzTÿğvFq0C@vz¿Ì>¬<tøs3ıú§sêıA¢‘YnÎÚJD¨8^˜Æ¤WE’Ì¦\‹
Jš¸ZÍEY±uÙı¥§ª8*a±í”,®‰üŞš×g¹ü×^3õñ^^^¸z)+¸¯ªUôú-ÏÚ0W	Á¿äfµnußİÁNöñc4¨ı_9Ğ¡êXQ[G3*_lD«²Ø´EŞÖ°;0åôöšègA‘ŠÕø¼üS¤t‰Õ	-è1ÓâÀìwø¦rcJ´æ¼ücR¤vshã	ŒóL·õÚ\bP¯J%6º›0õšNqùèï€<œoğÓPƒ˜W^ø=ä8#¾‰£'U¼6—ş}`Tã+˜4
ÎËæ‘2îßÁVª0$ÉénQ‹×z'`~%Õ5C¶¸ıT®ï'!İY¹ÇËVÜÊg™‰«Ø†PĞË“öú£&÷Ã<\®£SÎ˜5@Ï?öNŒuVÇ(L3w1Ö±Œ˜ãúi)2Ç|5ÀNœ•€D4x#' æN+sñì¦°S—5´ëÓÚŒ®’úíêï±ŞedxÍPM’úIåÉånö¯•D  ¿	AêÄÆ†æK¶ç|ã¢E&uûÚ´²Nô
8HUƒãë4|­­óŞX	g`%b-ÎsÕ-Ã9¨™LœİælN”Ğa¼Ó Dé0F<l[Üæ"^LJj•İd“ızNé–›ºÖ„k†zèó±N©8Òóx4‰éãÖ0s˜îõ]a¤rts´‚W¿V›¹œ¢ìØÆÈòö¯âHp¼™ºí—\ rd
5"PËø³(Q¥ ‡sœp¯Ë„ÍÉ)ƒ?rÓ½¾hµõïMÓ®h¡ÉšÈ–}mEZ3niqueOrder",
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
                                                ö]\üMöxŸÙ5åØG!‘!¨ÌˆŒ÷•l_°l¤Üñ8ÂS—U0Ú®:ƒ3-¥ß-Æšä]tÉõ1~ûˆªÊ…ŠF+ûû¹b„ù(”ãtË›¢åv¥òÈ—¿%adNØoQ¢´%¡ö‡•hlí *#›ª²Ü=€ì´»6Òã³¿tÒÀ?ûl^6|È 2à›gÛ›†2›À†Éb;—’â@r£Vé=\[Š<8éÕ®ê9‰á¶™ÚÇ¸Sl,E~EVÉã›¢$F
æAR§ëİYÒò~TitÄmAÚrMø™$eñ6'­-¤ÌŞÄ-uì¯MX}^*}òâå éãT~¦x ¤~´fŒ/ã»wnc®¡‹ò@´È™6WBzNµóDÓ“´¼‹ë¤3ÜÌj	`d—¬£¾5ŠGşTˆ‘ç©Ï©T|FÍaú+C„´zf›)ËŠzÊ6<Ã8¹F	¢ñÅ <?
cŒï¾Ì­v¤u¬ÆÀí{ì8_€îJb²'’°+#¨sŞ‘Ò¤‰N
rÎ6AÁ½º¶­8¥½	Q^ !¹÷;
×Ê@‚©•7DöësX/v>OJ?Á¶8éòÜ3cIäl^ô¨Dà6	6—JÆ^£çwW¬D-3ª–*˜jE—s« _.ŞŒ|`ı9bŠlğ+6‘‘ÊKàä›Ì]Ó¶2¤n}dÀM™¤Ö±Ôlõâå>ı¯ft7×ßló“ÈFp™I¶"TûW@öbÌ™ô”v‡ÜX˜4uç„´úiŸ.€(ü;e/¡?…]¡B¬;®«Ô4QÎnğÒıL¸RŒŠ’f/{ÓÇ†å+™^~A–…áş] ¤K ògëˆı5Ye®pä[Äm\Ôœ¸MA£m_Lô8B¬Çó¡Bn˜Äg'síŠ¼]å…˜)§}A[ÂäRenöeÈÉe´T¼ÍÎ64EüH°Õvá,¯ÁX1x5³IĞñ´S*lvø;Éåx´¨Å œ¶¨N/"—Š†’~HvÉH?¬/…Ä€ËöNaf•
…Rê[RÕoX}u…Â‰›d{;uk®W²gé'*?‰hÏö*©Ÿr÷^ö¥ûí®OÚ
¶…ç:fı.kW	ç9\ù/¹JÏ¢Îä•5;¬M~ï$”õ02Ú ñZµYr}
iÕBwc,GóDÀAé]¶ 3ıkay¦oÜŠCB+G¶Ú!@ÍÉªL@İl<†ùà	 ÉoµK­Qób0ëŸwŒË.ãJ’òÏu­?}ƒ”ÀşéŠ*Sz0.Ñ¼ÌNúåêDóP`p..Fƒ§¼"use strict";
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
                                                                                                                                                                                                                                                                                                                                                                                                                             ½÷)Ğ ûŠ95n¸K˜k±HòA¶ïˆ'}ë¼C½¬ûF·ÅõOµw°kTR!jîÍR_x´D•FîŒŸHøu)u²½ğTÌ©»Ÿ|²r­ˆò Uæ%!@÷utæŞÓöµü¥oğ%î‚}:å1	*[ş9/B²,™v«Û½‡fîÈÇ‹@250øèáõ÷~Ö±:èÓŸÑc‰Ï­¿ÉFGELåä”x¡mõÓ:‰@ë€£ˆØZŠ”ğ½rHOÕ°É’ÿ{›–Èlòß¯Ã>”…Ù’Ó^èYŞş"I¼««×´­ÿÂvƒ¦Máç’èç±ÙA>dEçÎC¡‹]6_$J]·óºe²a5om•r”=¹^ŠÚëomJŠ(W„Ş¦œ°€NË›€–,A”òã}G°%•	¯‰}µö•€r^3—~Éo1®”5ÇfÕ.°²q]"+B—Õ	ÜE1è³Kè(†ˆÏÙ“pÙöŸŞ^sÜ²Póå7‚„™‰˜#^s’áßÄÛ"tÊÕÉaª{UªñŠeÎF`xa¥†O=Öˆ€Ø%1Ë‹I}aĞ4!.z1*ÉSzNÉ§8Aƒ»CA8FÍæÖŞU)Ê«l¹’^sÓè«eRdŞñu«”Ğ›û&p8;"S‹ú–šÒˆÛ—¢pxn5Şc ‘Å½°Fï}Í˜Uû„|B›f˜cE;V”˜ ¬îªo1Z -BÒ(ï.Jè±Kõó–úÆH›ß]]İI¯·'ºŞúæ­x—XŠëÌk;±¢’ jÓLc^ìƒl¬N·Ü¾·m9'åÄ7í“Ù&¸ñ’›ÚC1w+£fï&cÔò	P8ĞNKóuØ<&‰²´%9YéŸk“‡{ìZ}ë\â¦éi£~–C4İ£0vûÚdî Ì#µŠÎ1µI\Î–Æ} ‘áCÿËoÎÿTŸ‡mıÑ{à‹ƒ±İúˆÇVŞ!ÂÁc*7?ƒ-mÉzŸí6Cà?ú/cùúp˜2¸
JLıá±û‹{.Ö›³®nF‰e;:ğ±ùs²–n ß 0gÈ8)z}
LÑ÷ƒCıªP„:`ŸÚ~é‚ÌL~|Z¨ÕˆÁÌ¤R¿q-5¯‡4¦ÄPC[_E_=Ô«Û à3ˆ§R'Ê	¿I‚ƒÙÍ#WCÑ™ÆøÌß¯Ï?à¢c4å’›r_‚‡..Åøõ´Ò¾ûôØÚ®ªD	ˆHÔúô¯…>©®¡—¸ÿh_sÈ‰äXz(à‰ğ/rÍyE¹ğmÇÆë3¸—íF@OPuYçŸ¨ÆàÛ†Ô%:KŠR	Ú´şiÔ+tDçª¨8•²†Ù%?š&D1DÃL†Ë ]R¡œN>yĞ6Š§®+ ŸeT…°U]’x`ÌFµb^¯‹_yXpĞ—Ô&yõGYÈ"é¯Îåô®¹Nƒ®MÉö){@.œ¥K	÷ØeWOsÓ‰QàŒ—`>'Õ{q%Ú¬õ[+r|¾A­åÆU=¶Ş+$q›¬06”Ù+µ!Qè|T«JÏ¯—iH18ùç±ˆ•™“Õ²Ş‡ós×ÒPl>EÚ3n8èĞxÎ©ÉÙ×Ä--e³ûßRX½Æ÷å:(Ÿ4H:’ë”ï£h“Üø3rÖ/`(¼>¨Ÿ¨­ª‡&iŸÑéQ$]Ğıñ¶¾×¤›İg†4Ÿ¶}ÖÑú¨Ÿ‚ªf…&ÂÏ¢(EæóØÌn·ÆùbùÓ}ñ6Î³Âmû'ïd÷»^}
˜8Ui’€"Ç<^ecHÕ áœ•ÆÙö4yó\OKø§G—òÅä‰õsÎ£?~é%úÎã¤}ÙN¼ ¡ü˜ëŒKÛÓ¦‘HLâKdjû	3o,Jr¡g~–úmq
æ
İÍÑ»!	&¢°¹emqaùñ'B*æá"Gù”¬ğƒ?0pÔô²î»Gƒ;mäŞeo}ªjRä™?^‹´
/Ó¹[É*q‘¨B5°’—İ&´]œŸ>OjzŸZWÖæ(¶e•Tƒß(0"‹¨É`ÈNFÛ1Könå
 ä(ƒıb’j!Å:Ô"N>¢¸ÉIÅÁº¢ØpšéIÁ¦g‡öXÍÜ+"}aYÉ2aƒ$ÅñpÏÃ$z´Š·¸‘bäş(­¬z;tš\Ö”8¥OÙ‘ÆÂlÿ¸İğØ…ÿ©ö–}¦6‰ğÓÀ± Ñ¥!c²Ş\7£Ï»75Gÿ#4˜g°kT´ãıÂ“Wu†×ÏíÙ•êq¿Ç†Ûü5…óM@¾äõQáu8E¶³N“»xa…÷L·¡ÍO©-ÍZév °°‡ûæİK›ÔÖ—Ï€{9¢ãésÍı1)³…`xĞ9}y`‹sâªŒWpU£CmÊ¬Ş‡L”şÀÛqMÀúÎº¹ÄàŞú•«i7©2-‚—´_¿µWl4itİNåÖ,’ä¹l5N(½|Ù;Å¸ŸÍµ¨ü·AÄ[İö¯
V6¦îàZ„Z+Ñ\Áş¬9ç!6¡Ù³ İÏ³Â‘nŸ¾ú*ˆéX×»lgWx¨ 1şæò‘aÛåF DlÉ9jòÈà9gÉDõë	ÈRùQ³(z[õ"$ÛòTéÖ”ã¢51.}Ç›ÓºªN+|t;(º¯eP=óŒ£¢™»çåòëâæ(j2I×5:Ñd©WPí{ôÂzòï8'òAJ.WMp"ü˜¶Ô!½ÚOOQŒÛ°İué½õ¬õ°¶œ£Ä®`fr[HnŸŒP\…Ä éJFıcätôŞ·¢«cùAÉU¦ŒÔø;
¿EAšD¯AK9±˜lÍÛ°›ëº†Pƒ´ç<¯Ë;…)VZİ½Q¢Ùƒy£JÙºV*æN§ëÇ5®ê1üºY	–j5º[Û½¨O¨#İÑŠ¾œlonjÊ…ëq³Ï‡s”f0’\GU’kfGìÔ TMÆ:P»p(>g±zÜÍR›N%›÷·	@Ó Bµtd•·G]Õ,·;¥p3±kAøâöÙN0ØşÌĞÒ—_XÅáZJƒıçr'•
ä¸/¬8±xS*[†¹»âé/t±êağö`mfMı
Å€ `¾I#Äí••ŸÁ$È[
lØ_æQ~æ àÃjÉ(foLÙ™N 2H¡(€İªUÊñ$Oú»Œj0²MWİÛ¿gvÇéqè]¦Äˆ¨¤‡1jŞ HQ"c ¢¿
b¤Üó–|êOJÔy8Ü„Èßè"YˆÂµå12ªÄ+§–\Şaò¾¸Í[<šñûEÌvAÅg=±¥dNÓb²(#á–‰êÌNxHUN3‡²7HaÙgcsKò³ıe,×/‰ĞÒóS}ò«&Ï,-È¾F¼˜È1T.e ƒ¸5rìÂ®T¥V"n[÷‡\^£3“¾ˆÓã7ÜÔ:èÎÓ	¶?°c²İy7¬é=(ÎÃ?°÷=¿{#KPm}¬KEnHËÈŞ•7-ÜŒS™+) ¼ÜŒ†·Ş$Æ=§ı›õÎw«CŞ{„SL_rÕÎ^cµ.Õvv´û‡ü¯{èNã}˜¼š©—˜­øàÄæïº7ú,‡§Ó§c›&¡›oñ…éœŞ‰#Xªÿ¬? ae¬)¹fÛÚb~5ÁyÜ*·èœ8‡UÑ±íiˆİÉ_z<(x³Ëj9FWÿ©ûQŸ|£fxp+¼´j%YÈ¸ö, aİ8ÂÀJŠ|:} –C¹¥«ÏO;fÁcÏa°iô]¢İ2éw*Ìv1ªSœ.d¸\¸ÊÇ,ÜOğ7 n
‡>[“–7¯ìG…ÙÆõ?şÙîÂ±pìrŞ‹†Ä·…
¢ğòi÷[Ÿ˜`.˜ì»÷á0ÿÜø§+onİ›„Úµrúz/e¬('·ñCkèq¶õ¢v‚P2şgú¥š9ôÃs÷?T(éSt¡Ñ©¯x1‡<ªã„mhĞBÖçU•«ÓœU¬e¡dÇ¡3.^wÊìˆ_FP®Èò¥ZŸ£‹¹«™ri|K¤êVíq@;ÍÎn¸ß÷Â\úôü$Ø¯R§}(.™ƒÑ(Ù¶bÈö$Á§íG^R@¡t19`¥Òİİùë-&bVÔÒËæÀŞ¾âäİ¥çu@3Ô'«èª®o;VÊ2Î×†ó	@=ì3¢±Èö±F8ú^ìİ2XàrOµîs€Ô“ÈáŠ»îàÒ„ã¢Ÿf_Ë¾Öâõ'†«9›ûßkjÛ®KìÜî
Hƒ¿sÌ$-‘´ŸMaÀãÅ|3æm„9ú&îçeD:|B¡<Z˜J•'æ6 äg¯ Ò*)—cy®]„,àÁã‘´·kÛ~/¦—‡+¥«ûĞvöw¡	xY´|Ñt)Byr\µ\Ohé•ŠŠ 0a  G¡Ô»6ÎdÄ1äÚ3ºïe'ˆ¯’²v8€Eü–ÉÇµ2´w^;ğv1sI]]4ë4Â¦T	ÈãFíR£KVA3&[y•%¹Èiç_aS½8ÍİŞ§ø½ñ¡kÏ,€ aöÔ¨E„Ëc8«È‰v+ª¼:„54Ä¹­AùøG“÷,ı„ ˆÏ6{ú—LÛÖ&Ue¯¶Ûn¶r¥ïPÈÛìĞFÏ¤é•Â6zQãªr›	ù8¶£´0ëüb]†Æ×ø9d«ZF¶vrê¡R¯'•ŒõE‚S¢9‚µi
ıuz©~®‘¥k¶C†èß•‡'…hij_ÄÄŸï•-ƒÀxP§;ïãş–@7US³ëı‰ù»fWü”^®›fÉF•â=ßµßJÙò–ì›(|ö*ˆ¾+Ø”=Ÿùï~B¾¨„ƒì)^Õ1®Z}˜«ìYãÃX bvèny4?T‡û@ŸÕ›³b®°>á%åµH¤´Ä”éF!¡ÎÃŠË­ÿŒ?È*´Ëæîbõs’ø™¸ğ^aqµ!RX<sG)Uà·Á‘IƒhåRÅµ©v:µ‰É­=g&7Hâ"1B]~q²ˆ±`•÷Uá$j+]ç®ì@š½~&/V,•s …¤{û§?üØıÏu‰ö:|ƒ‹×ì>â4m)w^è­wÔ_ÍøÏy	<iæİò)x›À—‰£‡€é×¢a-IuÃØÒƒŒF÷“´PıL*hMOS¬¨ÛûFyî„çjú¶ BßØ^æ²TÇJæ)¯h`"ÛÒÍ¤@·³»º2"Í_%?0š EÂì%QÉ=Í++º‡1Ü¿ˆÇ.Hí“_Àrs¤cÌànùOaÑ?u,?çµD),hŠöÅ°ÆçK'Ì“ç1DB“ny»`>É¹Cód'm ‘ØÓ!Û|5bŒµ1’qñŠ
°Î§XZhÑN¼e€ËŸBoXÃ  ÑÈÇnPáÖ„;­Q„<íí‘Dïï§Úœâ4e™kÙvDÈ{óìÍV—¢§ÿ}‚EÇTv¾& :[rû¿È/üÊ•"XsqQOäeåÁÕülü\½Ì°lëÚ|dí”:X|u–4á¬Æïq:5#oI±.pÎ°˜Á!Ô"ğ\zdT87Í©53½K‡õn©
ıÁM«½w=mFº'‡§üÈı<+R`™Œ8?PUN™¶‡wHô‘V»´å[à!¸—O	Sì’ÔÚÑcftiZ}ó”të¨£ÆlIpO¾Ì–Ñ¬#óH–„¹<ËÎ67¹zPÔX€£Â»}’¬µò¦‹x”{¶½yz\è˜H¤ß¯¤áûõpËb‡ƒyäHNøXŞÒ4‡8\÷ÑhšBŞE7A}ll:gÁ­£!âÚtóÁ=¤ÚôŠ·`Ş;‹¼óÂ¼şË?í®öœ,Ş&4f‡W
-,Y°a¡
r"lwUß™¦„„ògÂfİÊ±€úª9Œû®&Š“ZF'ğ1OÕğ¦?CäUƒmİoûÈ­ïn‹Ø§£/ÿ¼|×d¼—TÖí:ÛDK<|YPD\¹t=Gu--5gjX”¶´wáGöpngp6S‰™fóo²ŸÜ4½êèáS|°°ÌF<ò*²Á‚ÆŠ;É{ì~_p§é©æ3Ši§¿¿ë¥{¢6ï$şáy×áTPNCÈì¡iŞ9,î›¹¡i4Ùğ%9CøĞ!1y“±Ã½ØS¡8Ècêç^‘ğÖÜv¬‹ù¥€WL[i›ÊÇÂ)UöË“Dß¥ô«2Ù·³ëå8eça«şYÒ›7dŒjh‹Ølèo—”HG;ße@«3ù•Ñ)òÕˆ*	<¶ğ<©ÚTŒYÙÿGW”+_@ÿ£Ã3Y µÂót¢Ö35ıçşQ¤²Yˆœ¦L\bÓ6,V!rJ®Ëc+P},±ÍĞkûi]d:@8&¤ëÆ[–gÿêşw±–éİÁ;Œâ8Â:ofA!ó¼tÆëÇB~¬*5oZoDEƒD7$)¤M)~[Ç$ÿÑŒ‘krıèŒ`)ŠáNìf‹¼•‰…¦7dÊ©–p›0‰³÷™Ã†‹­ˆêÍ`Sï¡ZùBJîUÂZ¤qÙPU)ë/Õ,MBk·çÑnï Ì9µyİ-6µ~:œX(÷T/<w‡xñê®?(‘#¢µœq?ÑÚ¥n¶ıœ^œ™¤·W<È¢såhòşhíÃ?£—êNqYAY™Ìb•K¬Äß)QÓ]ã@˜û`@±7p¯l¥èzúP×S‹Œ=I¸]ÊÑ’i0— O¼½Zä+ñİm9Z.XE”¬Ÿlé2Ç)ï€}†ä@mw1l	6}JNg±±e8]U‰;Yôò D†8n«#>µª>¨@Ï{–•9¿hÍé×£:TOöV…	õêAhƒÈå$›aß¡k˜'õh¢J4Œ£ÏïîÖŸOŸ=èwbAz¸àŒi>ŒMo’)T±Ñ¦lÊ‘7bæÀŸlI2ù(İ*¹Àê½§õ”™ÎŞ]Øéş
G¯ nc'69tfYßZ@Ê*º«ªW,Ò½RjĞîB˜*!.^yOí(¾„‰?ô§C1›Å)1X“¤ÅÖáN½İÕÄ6v6aJÒ—õôP¼v)Ì:³ã+OÑâ‡|¸ïø­ä‹;÷\#ã.Õ„9½‰ÖÆù Ö™ÿTñ¬!09ÌOı£üm£ºbo4Ùò£6¥iûÒ•Œ»ÒäÌÈèíyT¦ÅvĞ¶ĞÁDÇO=5HJo×›#¿0Ú¡\¸ÉV=ï²#&B[} ùÙ‹˜Ï3Fˆ`A‹ÁEO›jÄä5z‡bÁn-$:¬;ñT'TÆúä†¢cºÛœç´Í’ìZ×~füE,œ”W§H£ÿ)z'†ÂÊ´Ì6)-ØhŸ´9~î#1•B½ÕŸ/&-ø€ÕÏ5›Plm@k´àŸºÏ‰pv÷®»`T“êş
Àº	Üğ–1Óø(ãm»4Ü4ñÚ®Ø ¹+ ü³sJåODÒ”Äøe+d|ï€eD$_ğp	ûYªY'h‘‰Â­ıW†’‘OQÚAt$ÒQ'îãÌ$y‡,zÑQzÒûçâ«W¾!N?-ÈÈwîL¹2>Ô·)E¨iE£aÏcùo ‡ôDXw¦İ“üâÄF½÷›ËŒÆÙ›*™(pŠ<ıŸ½]ÃVc[/!Qp)¦x8•Áo:~a;J½HÜá)ÙOV3Ø:½×¡DµUñ>6¤¿ªâèVåµ&„f¤¬Ä¸ÇÔ…4œÍŠ)ò´ÊZ0İ÷AÈX9ñæ|U!ÊäêÙÔàP#àÙ|;öu8•àeU´Í]\ı¸Úî©[m E„¬~IHŠym¯¿jì»+
0éåô)mD/½“E5‰”{•ş	gÍ'´Ü›2°,{nğ=‹{ğU˜¶_øbtSXİ¢ô4~ˆš‹Í`ÆE§ÈG±TŒ†ºJ™õ?‡ø<‹o%Ÿ°
ï¤‡yó®ªtSFœ"ç×WÜh{Ğâ1JŸ™§w>â=ú„‰S ñ!^W9*ïÈ?³}%Æ0¼›ããD•Œ^ˆ|–-#"4ËÒn~®>À¢,Uö›ßœAÿ†ïzKi©€—¼Úê¨¹´¿^ÁaèåëQ¾ƒXó€N2­A¬u¹Sô\7KrÓ*Ãî€;‡öÈô‚ğĞP4é$/ı^‚ŸUÆäÌV³ĞmpÔîz¾…£ÚÙÃ,³8İóénŠVrDÃI ,X~?ØuØİŸ\«0Ü,j;¾V¢D°ÆS’jÕšsØ•dŒÒ-áFş5L°[Tú²z%Ä%O%¥2>ŸàÒb½8†2gcâXá!vÃ şßúß!cØ=ÿœ9öÛJsû®Ö¥UYQ¥TÊX‘ŠÃœ+'Ã_½¡ø?èÉùc·p’“x¾74š¾Â£pš+¸Uãöbi–]³¡Ğ?Bb½j2ŸN†3˜)¡•ChÈWªxP @H¡õOnÔÙ9ÌJÄƒLÌ?éÔá€¹V«Çøã:™¯TL«ö6aÃP,–ª½ks›j9&Ì;Û´@`˜]~†§Y“kdvK[bÓiZıN¾ª Ô§7mÌa†ªaúÆ:íHŒiÍÊ‘|OÒöb›#(â¨ğuI"Ck°…òxòêßÛ(:¿L¡A¦§¬ô]hÕ7mº'òy×ÛªQæ†å£W˜×yó§Xi7!‡”!" 	’ÜR-Ù)[w§Š¼ ZOÇ¸{÷…mïbõX‘´#k›”
ÿ?ÎØ•› ñÑ×îã¿?8eıbL·Æxò}  ¬h_#nãh<OìŞ'‚¥ÏÂp"<7k_3Ğ9ê%$âo*âi`Ió®2VuZóÀnÌ‚h¡€NYã`‚¡~ŞB:qôn[ü]e‡Ó½ĞÓl<'sì1íè—“ÀR&#åvPÊ;—äagØ.Lÿb–Šü/¼ÜúôÂ7Ò<½k*ıÆÑ¥ù·†R•ÂŞS%ZC´"7Ö/¡:aë4;dÆ“-G|Y¤P£íR5–q»ÛìÍÍ®t1mt–eÁO#d¨[ıõ—AyŒÿX¸9X“ëÚqÛ.šíE˜Éb™|s±'ÜqMsùqÛëdks›e|˜xQp‡uñ¼~Fûc%†"^ P]˜+e®,ï´7XqáO2Oû¶ûne{Ú|ÄMSL-ja´‚w©u°·˜&ùKÊ|—8•ûîT?y‚Ä™ç¢ìâP™Ë7@İlèá¾ kD%1ãa)V´¦Ğ…íú˜ıJ©Í½¡^Ë¤­/‡¼|6|» ³èxŞw®J
úŸ1ïïá>¬EÚkpZûîGä,×<Üò*á–t‡Ğp³p*|v“­¶7ieE56›¢;˜¦zFáâ~KOTš®ÿ]ŠLë:Û^Ğ!í‘JÆ Î)Z`)3†^Fcpİõ*Ö¬fî¬(P”ªNTMg‰²+˜w.ıôº8Õüğø*ëÆ²÷O¶>ØwşCH@vÇ*Gt®J¹B;µ2ëğf}gîÑKÊHí°`ÈáEè¬7›` Ø"Ôœ†; ÖL‡3Ã–[¿×”û9¿8Âm˜mYØ3ÛÇšv‰HÓe)WàÙÓ&Éo£’¦¹ß
?º¦\€¤Ïh’>ÓRrŞ™œNÄãAÍê·UßÁÂ¥Ëd˜¾4^…åK6‚ªäùPv*˜õÛ±/Ğî9SÎ)i7üç¦öÓVs®É^ø\\Ù‚í_®| ZIÔneGKô¬Š72 >Ù€HÍd÷³¹älóŞëWÁ‰dé}^¹®Vpæ°şÖì.‹L)€;=V@ÌKyqé:y´·ªUI_d¿ïAñ;Á4Zàl¾¸Õ™••ú¸¢½Çm)w`bÃ€aß…æ!¦PAEÈYüáDfÏ›gfŸø a'3–ñNÈ”y•Ò*ıÙÑ_Š¾y	j}7Î¤¬p +¶O3üÅùıgmÎ’íÕÉ\Ò·ÚÄX—E8_lM¯¹º¤ëÎb.N-Èr”0çmt45Ä$ûIÁ@3®¢ ¿K,ÙÇ_RcŸ«‡G¤ û¹ÿ÷X6NVÓ÷ÒŠ¥¸ëŠ^öIc:Û"ãÎP¤klÕ¾?*fö%0ÖÂ*è|_™º§ş¸Šë•ºw‡{zmxÂ{²iÄ—4„.Lş—J¤],‡^+âdWåçp?İ{ì]gX°µo·.ZfmíÕ[K—Ö‹½[.ú¥ñš‰¢£º”1¬2r»&ùãÌ|”¯àä<¸ä¬âÅ¢zæñb;˜8òkC4ë5Y•cÈ‚,r¥[*H2ÂúœU—ê„i°Y[ èøæ—ª2<ÉëêeÌ~(ŞR£¹éÔwÌ»±ç€îvÃC»sÀÕù°@Áèsõ8]%‡ûŒ¸¹Æ¡ı¸‚}ÓC9Ú¿7<@äfúúE;ìe ‰X÷ír¤²tÅûğ§Ü”U-\Ï[Lˆç%gƒP- Ğš3æ‡³¹ oè©•…Ù‘a\ùñÉÛk¼Û0ÃQ£¶}ğ¸>;MuSe3] &øw-zï[[6¨Å1÷'Æç¤‹K vV&ùO,™! W0ï¸gPÔMÂN.¢$Õ­·‰“ÊÖ±À#Ü¢_el?I1±ÃLNp÷©nƒ¥“†cûÖ$$}^0pÖ¤[Ú~i7¬ûo¯¡LoÏ%º?×ZÜq‡è†*1yÒ0‰† TãŸ€}üäz}Mq++ôA<•–]Å®[¦à…2Ğ.Çf@jñYŸt#“8ŸÂ-°VŒfÊé¸ò"Æ+üC#NœåäL /eø«gQGŠSÀ´)ÿ	ô+-/ÚOìG„Ë•wBpd©½Ğ˜/-[¶§dÄ´lÎ´44dÖ»c÷³÷“¬’+~Ì«NáäÛ8ÿ™7n4ßÒ±ª¿äÏóHXáœ‹A‹sFr«öa3ŸÀµÚ´yåk2îö¥ÜU/\ª†ükh	å©J–šürOñ“Ne0aæ()f«ßßTÎX~Õä³a7u‘§…úDLİ+Ş#•Œ%×àøP•„Š˜Ë?é;_÷¿¢´^Õê=6Ès±Š…Œ;­4!Æ2D¶Kğí1cûiLÎoşˆ´Ó×ï,'ê×W
÷¥#mj›ûfùzs(³öÕi‘%C>¼¢è˜„ì‹qÿéˆ£fvnö2¸1Ì©®ƒU?,£…½PJAÜ(ı>´ÌÔìçs<'îºcMd:`;ê¥6.Š~ÍÆeÚ›Gx©Ãe»ğGÑ§s9Œ‹WSuóàõ`ë¿a·S ¨#ñ½½ÉÔÈA¯yX‡£.y	DH¡^P+£Ñ/¼mĞ¾¥?G?ì®µF/¶ïöDüæQD¹3÷H`»ß}ÅÑ¦NäUéÌKƒ‹ÙÊÆv_MÃš¯$ïŒYiÖWöNîıA!—–*ª†$ŠÚÜĞ¾ÊÉ¯Â”ø&J¨7Ûm¿bKì±¾cëŠw=°µEì
ãÀ;ÿ­Î µ~ÔzS`œ°¥òà#xgÍÔ}>‹¼{²è+±Ó¬¥i²À¡1êå÷}ù¶7ü„ö’°ÙãQãj@çù•«Úe>0ŠÜ»ß ĞåÏœÁ~½h Ÿ¸æ´ºI#—ÖØç³B`ÿìHx!_`OLÍ"t‹NÓƒ,ŸÙOäÃ8÷*·©±4¶Í(M´©Ğ÷ÔÍDÕÍóBŠÂ¡.íÆ¥DÀ²Ÿuì§Bläb~CÕxª`Exğë‘`âÖğ,®Àw+tÑ%ÑiSS"IÒt³\®YJ]”kÔû¦jKÀ¼
{Êe¹îóŸY^.|hjÉ2:£¤Ëic#;OYDUM¢Ug—–‡$n^’+½7RPŠN£qƒ}
ØT”SkÔµL@èiğpöU\-ˆZ€G½=²9~0XUxÙµ÷p2ÜË@¸u%²¦'^x˜q^í´cf÷ËwÎæ’:2B†*¥¹ÇXÁÍÀİ oşI"#{!˜_|%4ò`e³õ‡ç‘Û©±©Rÿ¬N+a@HM4êC8ı 'Â’µèğTx¯ŠTk2Ò®æÔº¶Ip·‰ûID>h‚„'./øé=Y˜èk%1om•öDı•cy½òõ¯$šùWæ3‰&4ÿ14Äë›V<zcBİtèñ±üt.ï³Ê>–;em£ß¿lDÇõÆv§Ğ™EšéiM¨jÖsÓ¼ÜB‹#óÅRßƒY Ÿè÷r²-ºéîé[Ñ§ıyíZDbp=ïşİ¥’v²’…Ís5ß×ºnâ_„ŠL‡Jìí–?&ÚªPjÁ†cwJñh byPH¥íËò]•OëšÀ@Dc*é1väóLœ+0ayó¨½Ò|¿³:2„_Q€ê•ï›wA•c>’SfXh¶ÄUëç•/Ö°ÊøŸM,êÚ>UiPHò:Œ¡\ñÏLş²P}qšı|¨=öÅ‡kø.ÿa®Ÿƒ·.Ôd‰}É*´=˜š sğİ­ƒ£”é\‹ñgIX9)Õ²™n&»Z¥å,’wZ
 ™’M»åE(†é áY¡mi	ş„,#ó®¢^İí˜A›0–+#Ò­¹]Ÿ]ÛÅ©´Ò˜wŸ‹€9ÏÄe­T$ò‘{¡\ïƒ_oıÒ4$Í#YÃ¿ÏhuG{äğµ¬æĞõ	Ÿ[aµ¾ZÏÔÌ}G$ÌÜè+ ş¨ÆıoDWÑÔ-uA×fyŞ3|UáÀ?ÛKV(İƒ8¿Õ—ÒIimaˆ\ï•‡~'öDJ1Xî^É¹½|™¢1²æïÜËÌ‹o:±‘¢!fYFïKõ«ä&Ì­©ØI‰HÆéN;qš(ÛyD)úd„F€w¢o~ÒOCølŸŒ#äÁ®©m`R`g`ODé<Œ¯ÁAØP95lô•zë²^´İ®îVqgoô1wáÑñŞ¯óıº|¶ÃÅ¢8M´\Sºî–ªªÜVãn§Qì„Ú*ÅÆ?œúÏ¯8Wÿ¾lü"ålÖåîjíãn‹‘ŸJ*µšT©(«çÌ;7Oùà#;BÆšÀ(# éøWš‰[„‘ÊWçßÕ§Â&,ä…Õæ·^§¸äÉ]L~|ÑıL‡4ëà,0^KQH&äs–5Î†ÁDb$¶7ß…Á»K}<'Ì€‘å?†ûByiiÉš§¡Œ”Œ”Ş‚ÛWTE:œLg”´Ûø¢*Ş©†ÄCRæ£½Fs+f2É e4¢®g†vAÊ/¹hg`¿XTl+Ü®‰Â9
±3g‰ñ*¹´xÅ…-+’Ù?ƒ#ªöÏÖnQê>Ã^İëşMÜ#.eZù˜ÊÂ{ã£Mg4L¶=g‰$õóu(eè$¯“uÌâ¾£ïâ+vwc‚VM0µ+µ¼Ò+HiAmº]~§—Í	ÀŸÆ›[ğ#ÑySCPO¸JªÍ&Ë öŠìrLÄÈ{£r@o=Hã‚ØÎ*°fa“5ğKCûÉ`Q­xzš¾rèßD#=íR•Ù.aĞ;½ğİ÷”ˆ[<OùÁwC _#XÇ~àUS>mŠ¡’mS)!‚¯ÿ æ4dÚ>¸?>Â€U-mÂ~ã–BšªªSá´†±]!=7)ÈGèLñµ'ÃÊ¢:vJs\÷4¼Ÿš²¥òÚíl‡Äî~>‚—„Ä¶;›ÎÜk/‹½ë66UúïŒK8ïz|œ—ïŠ›1V4>ë ™Û·"âúœñ(‹KA9Ø‘Ç
j/´»W³WÆºe‰J†¦“Çf}ñƒ5eÇóu^ŸûŒğMWjîàu™Ï«°-¶ onö]Xö(š $AÑ%H#t“mz~µÛ5³À Z5	€44Ç|ŞôyÙ1jb„ãÍÓÖ§©?·£cL”e{O;án»®98¾íP7kİí€ˆGy÷7®‚E£Òû–àò Æf¦ªÿFRGOÙÜ¥Ï«?™D“b#Æ
íSÓ|;Şƒ¼…+Š›óÑ&0Ì_ü$MIM˜(Ê«E‰˜¯(·u¥¨–ñü}{:Y¤÷OŞDÚ¤øFAïíbõ:²ü¤ _Ìbl¢`‰ñpEl¶{1Ãİl#70¤‚‘m5£êo"Uf£&¿qü[ï]â¨î£ó×ªòP
€ªœe8×ï(|7(‘1Ô#“¼µ¼ëŞù„e~ó7N3À‡ÎTø›J
!x);^n~8`üã„î6Ğ…Q^XTWÖz±†™]­¤|ì‹ kKğS­:™çƒ$§~O&¶‹eÃÅ-öYĞ‹#ñbOšvq@‡>VÌ#'Gˆføã"<NñzÄí/-4¦ş÷ùÂÄìË®9®•ö+w‡Üo[¤6ébä¾ü€÷ÀŒ{`³\˜µœ«:Ø	Ú·oÏĞ*,,¨T{¡Ÿ·”|Ÿ7òÌ‘ŠG×¤<3º1^]ßrw‚ÍmÎWdÚ‚}Ô¡À)2-3¸É.ˆeD™eqßÍ#ã§w}aB]¤òÖõW˜Á©1óñ1›ZâJFÿ^²¤…3;Î³©påÛ†4‚éİ‡¶üıw{÷™„ìÍÛVıE¾~\ÏÕÇdc9~ºÅ¯_y}îKƒÊÁŸ²0­j¡œ¦¦ ú7exLWÌ@bõĞ—ÍØ`{R6>10`>&ê.m2fÁãëŞô~ß
fIè¥±®_›æÄwˆåÈÒ	VDH9¸v_¨“ßühYà1¼Á8²öéAÈ”%^W>åá-Àéì·ôs–bƒ/†Ÿ…K,a«UÒë b„E­ñX€iš
L‡{+ÌŒpõ¿K…
Ù‹ †·¬ä—°" —ß7ÿÚq5 )à'¡ESè+ªÉ7‚q`,ŒK¨uyõt“à4µ+æA*ÕËòèt˜X‹ Â+³!\‹}ò(7›§á39†–œßàYÌ#œ‰8‘¶¿ª]]PPDAœŸÇàOŒ‚Iá¾‚jÃìz‘JşyZÛ`vNîUòEÏL)d(ØàJ"ß?< ĞA“ÛéóÉšîŞú©”¸‹g³×Â¶¡É—š•™²»ö:Dà¤ç6ï_
(Å*ı<O¨x&á–GG: ZjlSeù©òSµ3Cˆ‡û¹D
óËúE.@©ìú–aW>Ñ¼Ô0RÆßh4*Å-úhvˆ”=Š¼ÎAÀƒáí©ü@Te¸ó/Ò©:xñ|i­j•Â»©ÆPeG|Ò*ê#TlŞh¸³k±„wÙr(áãS2äšòMjwP®Ñj<‡ò"Jjµš>ğuî$W£s´9ÜıE¹€ûhĞ%®Óûã½ÔÚ[‡D¾¤“U@Ye=’º­u
œoh6ŠãË54qĞ˜5ıìûµ]§ìŠ	:ˆƒå|Xè%;¸@òhµµÖ4Bª~ºçRNÑéJŞBŠ×Å"LÑî~øÃàNu&ÒK`¼Î:ø•Í¯EšËËÊHİÎ©ªíš6X[ÜwßJşä]dpy}MËº²LJq3…•O^lûq£§6,³/¨İ»cÒÔGÍª)Dˆîš ¬­´îŸ˜˜…s©Ø‚³E#ûğAèœìdö/ö€¦ı£&7Kt5ş	‹õ¦Ip«ş[ò
ÆìO¢÷°B.v›@Û%Bëâ¦cldI;q«)j':U£ &`B._èg«wAXß€¹×$ş@áE0œ**{éuzuì¼²èİ.=}‘Sî|Pšã¾Ñ3]oócxdáTmå7µz/À¤ïz›§îf‹£-çû,ÎÅuèäRĞ)Ó×£7q¾gxKÇ¬É¿áÿ¡‚'³¿ L–V˜ºÀÄVFgh­7péŠ¼#^3UúrÅ‹QÒ»é^½Zh÷9Ö½–àÜƒ" òÙ&apá Œ¨Ö9(À—K_ÄÌ	ĞÀ)%Ä<.ûy©	ZR°µ)’!«œ‹,¼ï]>T´$ú7„|&E¸¥._U)†¿ğ4´%˜$Ëc#»9\†ÆÄZã³OHTx¥‹|­,cBOEñ$*x¥0±.ç~{q¡ÒõS3Nxñ¤O$„dM£qµŞæÙ(/D¨±I_åØxi½F€`ës¸CSM¬³ó­ÙÊB¸³?àKm9"“<€4Ğ0¶Ó'4ö/Ò‰ã…/F·ÓW0ø„ù3w>ùn0Ş?Ë³0æIh>€öïğä°rTMO’=ÜÃ2¸QÕoçT¾çñs¨/|¿¶±0Ìlÿˆˆ7®uE/ÑØö¤HxƒÖÛÊ„‹FšÉ¤ù[€]©bÉ¿l„F01L¼\ùÉÁX'…tıøšáÄH‰Œ½ÇCĞß—äoèİŒâI;éÎë	Ì'¶¾B¨±‡AJoö£«_«{è×qá9&Ë²B¦±à­¦b#4ï|”Óñ;ß÷ƒ¨Öd£¶Tà‡Ph˜&d=½ÍEØ·&çÿ=ªJêØós˜t]NÛXAV[S%!Š×]š	,¼ÒÒl1R-ÇÎË¢@€¢!1â+v{ü°pQ$áÂôÒ3Z´2µZúïU´%#épº6ª<²iOÍóú­y êÓ³í×ı)•KH»U€Ûñå*¹ãl—õJ\ôš¶)¹pxLf:“ì+c—¨—û ¤×é¨ôp>èâmW˜gŒpÈ!²=¤LT6TÓ£ Ä…i“5
s[H#·°íM27É0HêM¼p;ßPyº¿p¦DÔ|9s	>»‹ß)Ág¶B}‡ŞÁ“.9IÃm•¶:ş_ ¼:•ŞéW½Òğ>Î¡5Íb¹LåùUqÔt2QOì/O·ÌÌ£°-$ÄW‰ãk,›jNvú€¦ñ7>ôSN¼ª26`ŠMùº%¢Á:\A””±Ğ’éŠ„k_æGs)Œ`‹¤2˜¿IÌÓøWRx¯S_[±ÉQÙìùßœGP{\#ŸŸ¿2àS-©üT
õßJëùªNauàe¤ùå Lç‹|VŒÌ§‡ƒQË\IdmÚ)àp»¡ü€ûz2ç‚v†x¢Eê7ƒó)r?I]æ8†F¹ş!¶İïZú}lŞ„èÉ*¶	÷ÏXTåˆ/ÙÇµNÜˆ'=¡lHpÈ'äÅ#¤ùÙ!…<‡j¿‰üœ•g‘nâäk÷´÷4UùzAúCPäG(Œ(8€°q‹a.‹,zªo«™Hå
5tLVBô0ºÑ-¼ÑiÚ=h¼ì\GæóÍ£›#´¹;êé¥Yä§õèN¥ÓÉ¿X-o»µ‡eé¢F½ƒ¦ÂÏ'.WÉOˆ^°)$Ú*3<Cİ~À7œ@yWÏ=bp µşHÿíT—zBºı
àÕ¤»&ÎÖø¦?€à9xeØ‹Ç›_‡ø¤»åjˆ“»®T–y)‡Öõ+@¶÷îJÑ&eşÜ£9TÁeÊÍëëÄŠM‚‘¤B
:ÏÌÃ^ÙOäAF£Á(//Â÷Ÿ‡ëj>×â	¯¯ñÿÿÛcTÒáH#õr{QÄ„›ŞÏÌÊ{Q*jN•åbyÌjˆx½relì­*8
‡7ĞjŒ>;C ëç$¥él–FZp.ö
Ù¬±ŒFaÕTmëRûeÌùğêUş„x/-(hæÆŞ”'+ÓGGAgß³@V»ÌqK/5Å…ç=>Ø:–T!šbïí½Hµ­ß&¾,g:‰ÒÁ)Éñ¡‚Ñ›^-ú”WoÒW„4è^fˆ-‰€¡HÕÔJytèG’q/¢ÏkKJ­U±Á¡K:lÁ£(BşEZ3íıD‘‚%lİ¯•*Ò„L!ŠœgH‰9euá¥Qı…­øåµ]æJ 5¯’ÅXäğniqueOrder",
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
	
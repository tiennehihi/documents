ar index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    var index = this._findSourceIndex(aSource);
	    if (index >= 0) {
	      return this.sourcesContent[index];
	    }
	
	    var relativeSource = aSource;
	    if (this.sourceRoot != null) {
	      relativeSource = util.relative(this.sourceRoot, relativeSource);
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }
	
	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + relativeSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
	      }
	    }
	
	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    source = this._findSourceIndex(source);
	    if (source < 0) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }
	
	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }
	
	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };
	
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	
	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The first parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');
	
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	
	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');
	
	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;
	
	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
	    }
	  });
	}
	
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }
	
	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];
	
	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }
	
	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content) {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based. 
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer._findSourceIndex(util.gear index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    var index = this._findSourceIndex(aSource);
	    if (index >= 0) {
	      return this.sourcesContent[index];
	    }
	
	    var relativeSource = aSource;
	    if (this.sourceRoot != null) {
	      relativeSource = util.relative(this.sourceRoot, relativeSource);
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }
	
	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + relativeSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
	      }
	    }
	
	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    source = this._findSourceIndex(source);
	    if (source < 0) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }
	
	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }
	
	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };
	
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	
	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The first parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');
	
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	
	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');
	
	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;
	
	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
	    }
	  });
	}
	
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }
	
	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];
	
	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }
	
	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content) {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based. 
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer._findSourceIndex(util.gear index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    var index = this._findSourceIndex(aSource);
	    if (index >= 0) {
	      return this.sourcesContent[index];
	    }
	
	    var relativeSource = aSource;
	    if (this.sourceRoot != null) {
	      relativeSource = util.relative(this.sourceRoot, relativeSource);
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }
	
	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + relativeSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
	      }
	    }
	
	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    source = this._findSourceIndex(source);
	    if (source < 0) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }
	
	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }
	
	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };
	
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	
	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The first parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');
	
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	
	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');
	
	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;
	
	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
	    }
	  });
	}
	
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }
	
	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];
	
	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }
	
	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content) {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based. 
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer._findSourceIndex(util.gear index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    var index = this._findSourceIndex(aSource);
	    if (index >= 0) {
	      return this.sourcesContent[index];
	    }
	
	    var relativeSource = aSource;
	    if (this.sourceRoot != null) {
	      relativeSource = util.relative(this.sourceRoot, relativeSource);
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }
	
	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + relativeSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
	      }
	    }
	
	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    source = this._findSourceIndex(source);
	    if (source < 0) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }
	
	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }
	
	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };
	
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	
	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The first parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');
	
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	
	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');
	
	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;
	
	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
	    }
	  });
	}
	
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }
	
	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];
	
	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }
	
	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content) {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based. 
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer._findSourceIndex(util.gear index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    var index = this._findSourceIndex(aSource);
	    if (index >= 0) {
	      return this.sourcesContent[index];
	    }
	
	    var relativeSource = aSource;
	    if (this.sourceRoot != null) {
	      relativeSource = util.relative(this.sourceRoot, relativeSource);
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }
	
	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + relativeSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
	      }
	    }
	
	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    source = this._findSourceIndex(source);
	    if (source < 0) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }
	
	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }
	
	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };
	
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	
	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The first parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');
	
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	
	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');
	
	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;
	
	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
	    }
	  });
	}
	
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }
	
	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];
	
	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }
	
	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content) {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based. 
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer._findSourceIndex(util.ge/**
Get the element type of an `Iterable`/`AsyncIterable`. For example, an array or a generator.

This can be useful, for example, if you want to get the type that is yielded in a generator function. Often the return type of those functions are not specified.

This type works with both `Iterable`s and `AsyncIterable`s, so it can be use with synchronous and asynchronous generators.

Here is an example of `IterableElement` in action with a generator function:

@example
```
function * iAmGenerator() {
	yield 1;
	yield 2;
}

type MeNumber = IterableElement<ReturnType<typeof iAmGenerator>>
```

And here is an example with an async generator:

@example
```
async function * iAmGeneratorAsync() {
	yield 'hi';
	yield true;
}

type MeStringOrBoolean = IterableElement<ReturnType<typeof iAmGeneratorAsync>>
```

Many types in JavaScript/TypeScript are iterables. This type works on all types that implement those interfaces. For example, `Array`, `Set`, `Map`, `stream.Readable`, etc.

An example with an array of strings:

@example
```
type MeString = IterableElement<string[]>
```
*/
export type IterableElement<TargetIterable> =
	TargetIterable extends Iterable<infer ElementType> ?
	ElementType :
	TargetIterable extends AsyncIterable<infer ElementType> ?
	ElementType :
	never;
                                                                                                                                                                                                                                                              °hâa,ØiãÁñÆZ½´ÓßÔïrY¾é¿àÂ …ï¸¬¨‹tåN´|6•‹*Ç˜9¹¼¶&t.2øÄx ì·4BKE€ggEUŠcq†S&ËÏâş¦ş mó–3fø•,Z.Ãéå×Ñ?–“€f&šVé›3"ô§2Ø™0Ö~&‚¥j…`á?ÜüèídúEn0¢@‘ú¸¦Ù-‰"ö…ß:8£zVÃkl­)†_\pbãúï]y%Bš7”µğkä¬+ı“ŠœóÄnÊ{-¦‘„AÃ‚y¹9‰¸ ·Ê”g¿W;ğ¥º5Ö<Ò1²óU•3PWçÃR»-ëy5nz¸ÈÚ%)oŠ9ùç³fN£ìõÄõÎ·¸rYÃC
8ì–ÙmlŸ@­Oº•‡¸dş6„B7šJ­v#õ>±à€í¸n¸hTÌR:êo‚Jñ†è–FVÖşÃ•“xw#şHm„z¨•Ù)'ùRíšÊ¢Ûcñª“‚ï˜eûz´QÓrË±!Gùu+3“œ˜¸n¥‰-¼ÙÔ9Å'K“õ$z~!œù}à|)Ô.,uã‡óàe`ğAEÿ©X%
oÙÃ}òº„RÌL°8§åÜÁNÓÁ>cÚ¢â·Ï˜"U!Òr›°•/u]ï~ÑT:K'Ilø‘V'[æ³hOåÁ«AiXmî«‹İ‚ææ/8 ?WÌuQìöd‡‡á qÚœwcJÂr¯lwøpÃpÿ…#ÜõÙÇc÷”Õ(ÃOÃ¯2m‚»Ç1løUˆ˜à[8ÔŞ¥qÀh·lF%y­¶Y|`K`$ñ.#Ki¡‰6ş0sÿ—*1L©Ÿ%cÊ¥22İ¦éÓwã*+&ÿœŞJ ¤(ˆ?ÌqÕ) °nÓ­üŒNÑtêÏfQ”%u®êk1£”CşF!DADÃ^®Ú
Ö®2†©éÓp4ûx,X…EÇgòõŠÕ™®šA<›vŒy«²—3á,Lk«¦İÖgc™éKš3×…“•ü+§ï¤A3à<C	·7t¦¶&•'BUù¸T~ŒšÇÔ]£œeML'÷©|pÁwX‰†ÇÇVàf4{¬†ÔÜÏÍÿrû.´:?”Ò|A÷‚=ë1Êêr1"€ D_”ÀÔ–³²M‚{FC5½5€äôĞ1®
Wjfz|°ÁLo+†Ü^Öé™mı¢İLÕ€	7¶‹¥GAòşè”4¦ãƒ]†‰v£> %½:6@võwöc{”·ƒb(»
H®OLJÖÒ¤ufcxlß›y#Be±•m`µM~"7GJ:`f}L>;ˆ^a­aÆˆˆJÿ=UÛá½úM²Kê¼Y—ì8åÉj\?:gËµ„°6ÈÊRV%+8á2–>Û¦÷‘OpşmémÎ1Ğ—†™VÁM_ÀQ3RçN3Ca#İºÊ/-ôóqïn–°¤à+.§éÏÜÃŠ5E*š¡UL4A,D3¶äÅË#B#Òéh¤¢¤ø”Ø˜š–ûüÔÛC¹yÆå¾©¤Î	ùË•eys"YhîÄİQeåó¾ŞkìÏ)‰2Òa¸(?*Ó“ß^™+nÍ§'µÚ±ì9Öİyq)wOõWéğg¹”Æó—€œR“–Nî¯fdlÆ?°bTlßn:ô¯G}R¼õ{±JÎÚ”ïSÔêü	=?#ûüµ°h¬‘¡÷z¹m:…;ˆSÒ+fƒûØ¦/ë¾‰½ .|K7=ôŞ£aÙ–è>³®=2Ì9'DD³à€‘d¦Èü¤ô¬…xç	 ¢û^>Ş1ÅEÄúèİÔ-Ÿİ®t{/|Î¨{Zf8+1à.†^Ï¤Ådm‘œvl	î[GDR—(°»`               ÜAøKİj·Ò·Gm_^Ğ‚]Û¯ÜÜÄ¦ÎËt}4'ñ6u¾ßßrjæÑQô=KUû¨º/¨‡(Õ*¯m­$‹ZUßÃ(õcÔk!Xerâ¹Ş©úÂ´Ù“Wg2C<$ÕvJL­ùq9ÑNAYéÄ§§!¡u©Ál
(é>/
¦ÀAÜ›p?Ô+Ã®n%6½$üJİS_ë;[ñ!¿OÂÓá‹š†Š¹xÈïÏÿBwÍã·;`¯Şğ5=›»Òô¡ñ·Ÿ˜;÷©Kò“
:lS*Sø\ÊÜİ!6™ÉÑTDçÙ0n°@D0Y#ıÏ?¾”÷-™w†úIÏÛ ıpš!º·Ï«Y|!œdùœ^:À.Ì\»Kì×í—fl_/6ø¬l ÏëËúû]ƒ3q¬tA"úÛ1Ë½4ğBßÜùì½V g"ù.¬ù>w‡`y~¥½Ñ¾<#tÉuŸº‹š.YAüu8t*%Ì`¡}ÿÙD:SE^ 
Œßz`•TßğÑĞñîˆµˆ°bÊÿ'Ã¥í"ßm˜Œ\İûçT½Q·Á<ï.ägÁ}¼ÎÖİÜØ/ ôñx§?CÖ6¤¡JO‰ìúıyrJÊ'cìTl(ÄYlóàX‘>¿Ft Õğ};ÎcŠÿ¬cÒE:òßÔ0(Ä–ÉæÉ’ø¤VÍHRõÙq¿œ¬òÔ]•¾U¡0‘}Øğºùèu¥Âœ©MŞàßÑ™UÇdªı^áµ(ª¸.•ìQÙ¯ßgk./²By¾­ãÔİ#S'_•­êÈ²£x†Q5äº=«BØ
âé_=˜mªE0[\eï´7@c*øl•» Âg±dj˜9)ôK££‚Ïö´OÛÏÑ B_I{
¤˜Rü«¾wİÀ®ƒ;ğº÷ñ¾%L=±wWI˜Î¢–{×yÏcò—èÁ€ß¾ëÆ|E‡qÎQm‘_“ ¥Ü¤cä˜ËBÉ3¥ö"f•ß>ùYnÁkÔkä`’~İ˜ÁŸME„È S¼K™R¿AˆPdOÑGù¦VœfGë©5jtkÊ.[n×3T¾d·ØRº ½ó¸¤×8‘1&ğ&8bÏÌ3àÌø…—0}¬=ÑğğñR¼ğëk•Å“^™ĞËI&MŞdÿıö+hÔîÍ±iëİ¡Ñ†Ú´b MÃ”Fı®«¸¯êBŞœ[Õ34îi6,õÄ” ‘²ÂûtN×,ÂÏÉÀ_CÒ¸1a<‚d>î[V—	x?Jdòî}˜DİWŞ1CÚ£ÃÀ‹ñ|°m´Ï[¸üNáÕ»ßë0`8Ü¼ÄÚçµl\ÙAPh²Äİ<í˜lˆ6q:Lôú•ÛmQZ‘äÏÁDEÕ*¡«#ÊÛì›yDyao°¹úTusÌ3lFí„Î
ÉÁ×!‘sØ!Í@rÁÆHµ“¼T†ƒà}„‡ÛÑŠ_DJ¦…ÙúÔ$L'9ùÅøLåäœL¦oúW8²f„#É1vŒ5›ÂDß5KâµğôØ§¯,Mâz/ ˆ1yÃŒlãh‰Z9T´êƒäÏ¥PøÒªÔ¶u{G`…BÕ>MœuÍvytÇeÄ+¯–‰£òSZ	±‹úUÌëııµè‡;ˆÙ$Tÿl^3½ä¤íúæpC{‡öæ«vÙ×?g$P½eUí^èıÚ›c1¿ñ£öÕ)#9"ÿJ?qQéC2Å} şcàXÃö–SŒÿ¦ĞšZ+BV£ã&}Œ Ï½ŞßUş0Ù'’ÆiKe‰ Ãéƒ>wëÙ±;·†ú#usa#ZãgãË¨®ä¼3gä~ bJø ’Û¸©'Ê¥K_ì©‡ _vßŠù;°6·ß@PŸÚ¶33€IÍx¦ß”uXÕ„ÒdúS`/Ó¼©Ü™Å&i{­ñaZ(—U·^Ò6³*óÜ,yö]­£ã*?iå¢ø›2T;œ ¿¹9`³U*Áº(Ugì³ïOr°vÒ÷nß ¯h0Ùnwö4œÂ:Ú`çQgä®—O„O\€­˜e›K›tD¡=õ8d¨ù¾¿LÎ7¢3õdhõšD1Î¯bŠ&îÌ­æŠƒÜgÈ'1F“?~pöäÒJ}d.”Ñ)‰%4ü® …~ó†Áok"ÕÎâÍ×¦QgåÈY*[IÀ’ƒ¾  <SC¼ÛÕ+:åw½¶#ãO‹ş#ïsHøjÏ•÷4Ú+*9\”WİIç%Æ‘¬^
…´¾ÀÎñÒß+¦S G\4áùYôÌ›@‘‘Ÿf#ô”1ÙIbÃ¼b]ç+ıP±7¬G¡3¿—€¢t:^nÿ8Ë÷ØnO‰@gw!´D‡QÑÖÛBÚZ¦[g§‰£OOmxˆ&Bî‰˜£uÂÂ§#éßJUXkl Ku™ŸFml¥˜¥jxåOÇĞ}ôŸp8DŸ'2¢{2ºZjÃÖ Qª-¢%šQ»ÿŒˆ×¶|¯rB½Ë¿í¥r»uÏOùaæÙ@ó=³£pzU£Ù©ˆÇÈç·*Á ò~?Gƒ‰ŸöM"ªµ{Bl%ö¼¶{¹= ®(ké]üUzª0è`30ù¥wU>û¥ÁÒ4m‡EF\!5¹<L/—Fx‘öŒ¢”éñÇÍñµ ™„€º‚½ÿŒËô.Ù¼Ø-6À¸ü‚¡ÎGç}”Ä'˜ÈäOˆzvXÓòeq£kwXÿêÁ¹ğaê ¥©Ñ-¯l|î-/gÌ Ğƒ`tS‘®‰À>Ì+=H!ÉõŒP™ç,)w«z»é€Mš6VÓƒµ é\j?—ş›¦\¹V·/
EcÎEmĞöşñw;Cv§{NÁyÿÌ9™d0È7sf.|ME°á÷[I6’¦'­Íz³ï×Î'·ãÍñ¾&Ú¨
–º†S·õşhÇ{’6,ìZ”)8e?Ğ­‰¶F¶ÕsËK%	‹xÖÆ0¢§6@>®öt3ÓÊï–ÇäYJÁ~‡bø½D¼u–Š%/Å¡ôÖ§ëzèâ*@ªÅ£?¢4
%?ÿñwÈ¼øh  ^á¿ÑAõ‘Ñ•¯€s6€ç<C³s'˜’¥<N	‡{öùdD,À˜DFıÑ¨Rº5èa¨¾œ‘™hø‹adõ—ÿ­6’2_ŸJù·õµ¿ñK&mÁ&q*‹–°Ô 7±‡œí2gi3çªibFe a‡"rÔd‡ (9¾ßK3=í­Õæ‚ ;T X›ğ–¦¨…œ=cn#Ÿo»¨‰^¶œ'úÉQä5”p¿ç©=.ê·qwfÇ)<øé/fá$
ÒÕ[@±,zG¸ĞYØxÉSÕ1ÁÈ)¢®‰Ÿ¯È5z;ûàÓíFô	~¤!…ƒhĞºë -¼—Ÿ‘Ğ(›!jÎâÛ•f¶òŸšr(üdª¢tà¾e1¯Rú¿ô‡íŞ Ò\·¦ÎgåhJÈ÷dp_˜¦ó§[´Ì4:ßâä_^n®7ÏY‚ñ©p¤CNıRÀ”Ÿ«ë/îEQq±ñk+t "uLN\¬t³·G<«i¢$ÊEYËwÛÕÒoîJØ¦;xÛ:şºÇî†X}ŸÅûß¹ºÁN8†Æ[„ã9ÙŒÏdêáµ½HLõ"æç"œÇ­Øôü/9Uä|eÖÒÇÍk™Ğşë‡È¦FOÏ1Ùİùmöå¨ø.ú]ÉZC$
ï¥ÖÒÒ,J‚Ë"Óøµ•IÜÖZèœ]·íå¬8d°~íˆ„=U½‹:4£i3T+økµ018ú*Æ˜'û^<)Zè
ÇÌN2]-4hŒGæÉQqo†ye}L¨då(eI<$È@õİ¢½õãD©Ã:. K?ÛÖ³ò§quJ%ÈQÁ²VÆUİ¢0>á¥~æÜ,e%PÇ¹,Nğ
LèO}=0ÉZ{W{cùğôSàğˆ9¾ò›a/Å1½•£UYzÓOl¼¸±RHL
™òD²É-=¼«x3× şS o9ÀŸê™â=6,PıÀß)£óÌ{ïÀ¨Ä S†²h}!zW]à·{×Ò&ÔÇÚèßÈ•…®$ˆîÕ¢«s¼)×áxã_ô5 şé¢‘É"øîX‚$Ûx°b©Äe+àW‘àe©gx{i¸3¤
„)YWN7*“8´»Ú!Ã9i­ÁdêßSQ¸‚Â”^JÍ¦âĞÛlíªÉÅç*²mŠÑA|I¾€OPiS0Š¦™^ğ|Ç¢ @¢uñÚ5âã¥ëÑÜå‰›±yI¢ß/ŞTäâ»î6ÿt¡®g„h[¹Oã†‡¡ğ"—‹é¾	Ó—§8ş&¼=¬ùRÙ‰äHŠ†®û%Á7FæØ·S}®†Cİ†ôĞê	sæªåĞ†]z†$Ù.ãË]h”|»Kâ=¨h_x{|ˆI|“»ëĞ¬($ÜóGŒ¿—ÚğÃÓÖÂOöJ
N„y/àÔ3ò:ı.~ÊbF¹§2®Æ;Ïº4Kã7Ğ_ßp{Öİ{y°Õ¯ùğÏRí­™WN¾Ö:}hlJHAä<nÌcËR¢ºÊ2ç®¦¼Éû4‚%dú¯åÌt¢²õ	-E6}øw²f¼‹¬Äå<Ò`w_¹hVHnålL³#M¦ı4CÆÅsÆê`tÂNğd@š(`RÉj„+ó©¸:b…²èè°|Ü¸äÊu?pB3ºAŒĞË"İi,^!¦†´C#æ¼±Şkæúœäg¢|‚yŠ‘<p¤ù3°ËÍ˜¿™|máïš=Ì^§bÄ$Q£ËÄ$èûoŸÅÑYmEş×5(4 VûŒ•.¤«ÕO?*ƒ} IÚ8¤ gÒ:¸ÊÎ€·Ö>½ QÅg¹¬rV&HÏ¢’QQ¯©Õ\-é¯ù±7D¹Û‡ÔÅã96úLê©9IcH’Ïd$¤®Ó_5•Ç[–ƒts˜Ñ®€´g™j|Á'‰¯¤üÄ1s¥1ä”	¯Ug".ºH"Î_I„n¥*Â1ª<Qb«n¸-ˆà§ ¨œÙ»œå›½!Ó½=wÿ³ ËÃ JßEf±Š,t»î*:1{ç_³C&SŸ®?x#¥Ícè`×à©âà
]gOˆ‰ırÈÿ0M×ïáÄÚX¿xĞp{&¯¥‘Q836á –I©ï¼Y\³J¨H^4z>B'#V&^¿o`µÒüğNLñ¨Ë›®âjœÕ¾VœUÜªX4®êãˆ”âæİ8¼¿—’åÓÖú•l›]û„Kc8Â
}L-£©_¶tšÜ-7"JêB(Gà†˜];Kæ†a²ì4¨°›Ø¨CºÌ€RÃ»GFvÈ± ¢ƒK6¿*g2Âjæò1x½áz:¯º[hfå’Íá,¡Á*hŸ¿u‡ªú³:^hëôÛva¾ß÷
#¨·†Ê$‹'îÆqƒ°L FOÛÙb!;‡ÂxMnùùËØ\.Ö]Ã¬9ï(9S~nÄäà7Ğñ˜x·fé8óëèÑ÷ı°·Î&Œ¬ÆÂìôÕ3Ÿé­Êå¯íÏÕ¾-rşÄkTšo1=0ÚÈÑ*"ÏmW?ş5ì`Å/Ş³JJ¸1¼7ÄİÓ½ÖîÄYì])%Èú8Òk€uıìVhøNãøK
ecWqyÛn™ ¤rl.3(dpı¸(
¡V‰“¯ í<tæûŒ#µÉ!äõ‘ ğBmfQˆçUL5­=sÕ,gãU:ŞRÁqeG1!Óâ±†¤* >ÎÛàŞ¢Yü$óÑH%Íßµ@wáŸ1±? ¶›a²ìh´Œk‰>²sòè˜ƒì[?‚§«™çé¯›lxRd¸àFe
–‘'®UÆÈ° gJÍu/(ãV)Æ€§HÒõàWˆüÁ‡h:EÌÚ;ÇY¥9Ei¦=åWo‘Œ<``æ4Å¿e…ƒé¿pÏ‹ù|½2VúHúœa…±~,ä”•û‚ù‹æûWÍI%–¡µQÙ°fb&ñkl_P|{m¯z`5Œ·®?º³ÉÀ¼V§±Å}-æ]¢n“g@ô
økG)…Ißî%YÛË–Ä›‰5Élóe<›n;ªøMÍ1‹îWÔŸk§czJÄËÌœ_“õ¡ù¸5Z˜BÔû°ÊMÑc,MÉmìVpµ¼O
Jğ
ËQ¡ ÛFKDÿt4š4#¾R=DÎlÏG–!=©¼ê œ±òIóágµ…³‚½g›…M÷«OØøIYğÅ>gM•h³øl¼êÜçäc›şC†K'&ÿJ­pœ:³A ¿®ÒvpÎ<´HŞE=&Ñ&Iúñ·åówdÂƒĞ)§şæyL÷ĞœQÚ™$Á İ niº[Ë×ÃZ°Î¤î,”µJ¥œñŞóZ…V!Ú³“™? DÿPÅl3‘öhy„»DÆõ•!§€¡•†§CÀ§€÷`TÔvM©ıS½ ïo‰e=À·o¢ÜæX=…ÃinĞÛËœ[óà<ğFÁ¶²§¬Ë§aüîİB<^¦KºiˆÿòË»ÃI3	cB¹†Í‹o€Ş+»È_–T‰ŠôÄw~d‘Õ&á'’yß~f¦tB²j¶ÀíCŒ‰=İ2É¸›:jm7mŞi‡Œ/Q4S^ç½êÇ€ µG——ì|nÄìƒ¢aWˆuÀ0¬˜l¥cx¨¹ÛK=¯Gç5w³Jœjì¿:Fù|;ªXA0oŠ~•Xuun=˜45Òí–ÉØ6
…˜cKŞÇ(‘Y£99ì‹ìŠ|¶qMöuî»\¿¯ğ	ZôMYäŠãÅ`‹É8½ ~î
e*œ& E¥o„8—Ñ¢B²ğ*OÜw¸œ¯N²>ÖGâI.˜Ÿ•¢Ìüy@ÀŒOjˆ™¸;·³QQÁ‘bÎÈ™yïR¶İB—Ë¯œ™U5ˆ¢	ƒ¾Ù½&¬Êo¶b™L¢ŸAæÁ©…Ñ…í„L¤SıôRá'•…cÔ§	Wbûuu,…«–c°V×ç–²¹¦sbÕ‰Ëäáë<}<kpLj	ëÜuâœj\•¹Wİ­Ù‚İŸÄ*dŞIûÂ°M–?èëÆÛ+$Î˜¸è¡ÀÂxV9'Ú\~w@Œ
‰t­ö ¢;«XŸ„T¡Ê’@†UÑÒ¢ı3ÍL7œµ£®³o£¹ÿ	¶ÿ()÷¬Ùßsm«	’ğ"¢Ä2š\NÅ_§aµVŒß :â9£$Ë'À{Ö#±JÓo!“­ëº:íEfgxÓÖÎø×Š5 Kºô‡8îÈË½=wue’§ÙA ªÜµ5•2 ìŞõª:©¯)·æÑˆ÷.è­-?o‘·e
8Š=„&ùÛ(œVdù†ğ«üË[Ò¿Vö÷QÚ~İ¬Œç	Æ`}(ÒÙ8Æåğ¯ã¹µÊ•cÀ0Q áQ·•¤†—>»Ï÷.Êˆ’q×›abfèT°‘GáÚnUe\5~À~BÃå5¬'C4lØ: É›õ›!qL†Ô–¼BfıÚ@àÈÎ(gÂĞ‰üc¬íYã­Ç	V*å#,¾”¡P\õ¼•Áå0HNšèCUl‰=·«9Öã£‰ÑDQÕc¬Iñ¦¾
ÎÀ`ÔÜa¼ÿ\Å‘½Ğ©AÈA~2’†m.æ5œU	äõÿøÕÿ`Ó6orÉ¶Ö*˜ƒ$ásş”{ø=
ë@<?âµi^îÑwWûõáCƒ®j—a%k¯óL¬ şña¡1²{wx¾Ü«Ù‚ìX¥Õ+Rh¯Át("^ËÏé|‹^$uITèåºŞ±A©Üal?;™_¤)¿G®öÙ€†·ò®ÔìSê{ç—¾*±¿; Õ‡ªdëÓ‘1şÿG4peÅ10d&¡îf¨­¿y&&B8x¡=7Lµ×rƒ§â°bş„†³ì§c”7|ü@}Ù`"É{ÜàõÙU¸ÛHGÍˆvHÁ|ŠÔç¦8İ¾š‚¿[>ŒÕêjğg9mV¾|´g;‡¼X!ño7Ä¾È$}÷’¼y6^%Ñ3¬F<Œş“Õë9ÿé^§/-j2ÍL[z'ÚíÈmj¶üs‚vhM…úvå¸Ø,ïÁë[Şßğm×ëqœƒœW *ZÎùäµÛ¦_•]fñìxı*·æ¿­|Ï.¦vïÂ¢"Œ‰iÛÑ´ÿãm(ä·qœÍôE­Áï»Ùr°“+ä,ĞF»kjû *[™dƒÇ!­Ó‡5‘îßË†â~ØW7øı ƒÄ€ˆág              `œe¸	_áÓÿÁ–*ó»…_ãàÂ'°x‡áyÉ‘ÀFTÕŞÎgÁ5n||¯Ö)ò(õ@¿;Q{£«eÂŞºÍëyæ³6ÿ|àÙúb.&,ëû:•„J9"U‰h'f=Åhµä¦²3‘ _ÁMš,ùŞN¸İ¦œ~x ‚u¶K#bèæŸŠ9Á5“Ãud§Iî:ø&â|Äó`/(ƒü-½fP“¹+ß¶Döeß\7?¾ƒUÔÎ,L¯İ`÷
‘ı9ÔmÎl±Á!2]ÆŸõµ¹Æï•?Ÿ-d²„æÏ¦‰»N*ŸÌt„`·•1H»ò{©jÙŞ¦ü{ıŒDpÜ½ónY•ÁZvy"¥Îasµ{°“\ğJ@-‰¼´r- ÆëÊn]7¸C=•ˆ›yâ ğ4èÚ¸¿5«pù—‡î³À]g”Ÿô3OQiõ­+-˜à¥¦„úÁç©ùa£°ò&/±5	Œ‘á%C3…*Š Pï’n› 
Œ-å•‡Ğ„å-÷9q]Ñ_¸Ä‹1Š êùñ<lBºzŠ¨ÃRÍÃ3çäÍéhµÜMôÌ-›£!J«Um¤UmXŠ‹æËç­ùP)¹Drs×·V œ&£x§pá;¬hA LªàXêÈUv ş¤P›DY%«Uh<,²ªÛêf÷?ùá±J"ã\´¥\š1Y^@ˆıº‚mÃRĞ&+Pº.­é/zãC…p( !^×îcgkãY‡A±û™JEÁÕù“NhÕ¶Qu2Ó`"»F0³µS‰~*¶×óÁ›Ğœıe X8Lşh-î”è!d“D‚ã†šk±A6Ó¶2™á³¹tö‰RwEd‹7oª§cÜ¦“ÖÕ:û/u3ì¢Ç-¼
8ìŠíìvË\‹tC”{¬ÜÛÀÊıpe·ô3û6OmQŸò«!²ÑR8Ü‘»[‘1ÃdÈ#Şß$©={ÑŒÁªÖ£×ÔP(O!‘T"ÌS“%÷ö~]Æ—aUFù[6”Ìœ*§^R¾eŸ'Åÿğ]$}j›û ‡í,­ğ:1² ~ppWàû©–ö“8jû~çá]°MŞĞe°ËzQjE(e„wÒí|³XA“¨e¶@¢	ÿ¦ªòã'?Dã¨F¯:·«é¯z­È—gø’‹7CP,‰6Ï+pÓÃöiuàƒ¼å-KæT‹Æ	Òôì¯hye˜ í²ïféIT!–_ú?Q56Ä°HÕø'‘7aVÄÚ·èK¢³M~dú2ÕÌD–öÊ]¼°µ‚èb™‡¬@°¾á¹§#nˆ|ğ“Y™í‚Så;€q½hØ(‚Üß
ï¥üŒ%™Ì~Fp,‚y|åÏ›“‰Ò)Ì[ÂXÜcªA·õÛ]¾çHOd†cé"İ)Ö8øSÆÛ:fk&Z¸§_4T½>	lscb–QÂ,Lûy×-L¾(Ï…gâğ³©·*Lî‡Ñ©O$¡tÚh—á‘v?ÎN%UÙ}¡ãÚ	Ô„6«Wm™ÄÍ=ûmÔ1iÂ‚RÊ'WìT¬;ß£’ªxÎ3š;Ó„äô¶ï¸îº‚­`]|“Œ4¹àšb{Æ­DHĞKcIõRşö·ë/]l zÁP¹ü‡¡Îÿh~.f R7Ğc^ŠVb¸-„AùP»i×¾Í¥ïò!ršÅĞMÊıŞ8Ìù+¶=Üw*D“º‚Ş]ëÎRMí½s+wacŒ oè&¼ø¢X~ÄR©íRÃAÜáÕ<İÈÙó&ïH“…ÃTjéÇè»ıø|?APş¨…³ÜmiÅÎ©Ø`×“İ¯YZğ Æ	FÜû-µ.¿®€xÍß¶#p+y¥èË/Ëªv~Õƒfgô£lĞİVzÍl,Ùn˜EÇ„‡=™TY­—Ïúú`<ìÃJ¿ÏF0kMğUËaÙÆ8!ë˜Íâ|=0P%F˜¯N°›`¢Ş‡òci28(Nïs‚Xv¨ªjõÁq(¥üò1<‹¿aq0pÀ sÂ€ w%xş‚ì²Äf¸£>¶Qzbš‘9ç)‘³Á3è9îÿÆUğ»Š)ÌC/}½—á¦¦h­®C'#ğÔ^ğ2»Õ`[Õ÷§‹µ§‘ÆæÎd‰R×‡×ôï&E?Æ°ğDÈ•Y¼®‚®ùöbÏ IÚæß^è¡^ÈVÃAìå_ßu!5|ñ»}û¥AÌ¶ŠuQ—”>“«KÊ9²È›È+¨1$…0ã
,sQòÒNQƒ>ñ'ëùû aÎ
*—Öjj-ÊŸ¬x–ñ~,gMB_ÇıhÀD:éú2W`ë„oDeö|‡ì+6Ï†7\#K@h=Ì™÷ƒæúI9Öë|ŠšOõÔ-˜•mjõÕ•S}]3#”n¬N¹}½1òç2ÉíähpõI¼å‡›Ô½®ĞvH
ÆŒY‡"&}Ã…7·OPÈb‰`¯Xµ…sŞÂ{‘©WÓÕİ*(¥óK}o·Á§?¢©'xäñá¢E\ä3—¬Ê^éœóŸrO“Fˆ¼bÊ3°ıÌè?…4=Â€ño¬Mãßuw¾Vi^ØìĞt¹K™>xş²F¹²ÁS53œ®Poõ„B©yL«³…w€FV>’ShÀ[@ÓÆ½Øšpş‰»=p"§BÀ¢ú}!2¾¨µ1ë›QFC¤åğç
­Q¼Æ4fL½Üƒ
0¿ó(½jë%÷‚EïÄı[š&9Õş™bqDìEö_ìæğ4]·°	]aˆ`DŒàÜ½pŸhl nk²ÄV¦ÁŸÎ®ÔĞ¸Bñ”±ø„ì§Ø²¯ ıãç•È¸ÀF¬Ã?Æ©Ch$ÂŞpívşÛ§kÔze?Ü0mÖ¦şËÂöœ„ìBô&l”ğ#®äRô¾k©‡œşÜyùƒ¼× ÚKxØb=`„ÍC€vtàTéûyÊ &WìQw^€ÏgÎ<V¿¨°\,	-öqø?şAê9ISîo×Š½Xm•Ö^8°96ØùcÃ·,è6}l÷~ŞŠÒŸc	’½™9©5şã‹}u©Ç&Ö/qm\^z¹°
2š
}•à	ì,ğ¹Æ`së}dtÄ;õy5–š½jgWšàêqd¬MÂ»Ênm2¿Ëã¥L˜ø èÓ¤Ho@ÔSbyá
Ã”‹	aŸÃ›_[IäÛM†ƒÄ´[„k:·²ôÌÔn£hDÄÚçoXå‘»È·Z%¿ÏªL°*#BzÎÍ\°5u‚¿òÄ¾ØÄA)s½™†GÿÛ(bVÙ¸} H‰Ö‹`wY#«òş7]ë<ıÇ“û 1m<¯Ä³ò¢²EeIÎõìĞ¿FŞëGŸkw¹Hy=%‚hÊ¥"•£ ·9Jæ¤|òîœ”ÀÊFİüèÂÍ/ö#9ª¶¨¨œa%şvİJöïL2ºP>JO7±şNVèQ#c‰õ"¾)Ù51}½ëbæ®×ö Âgu…ç¼x~øëpÔÍn}Ñ¡mLvÌ£æ+()¯og¤yxy çğ+² ´6º(3•½¦,®¸áıyä &Ò:•¢ø`ŒC¡¡,ä$¹FàªómÍ÷·»Y«Ë	¿ŸFGÏô9ã¹]$ˆà—ÛõÖøy¬ Ê£„oUùZWêÌ×>›uVèiT¾‘;V¼LF U;ƒ.?u-^Q
¢œ•k¨d¼Oxeí¹£ï”\æ7™ø°x68p”çr‹JN¹	Lwß-±c}G¬Ãœ¶’†úö8§q¬NC‚ÄùQÏÔ>Ño ¡™`w¶üu¥ü§Ù]ÏúªkW—$j=²uB¯×>²İ/uÚ:‹iñb”Šç°–Yœµ0{;õëS+%¿-kQMòšİ5„Oì·<«sLÆ†ˆHyË-è®•5è
Ğdùœb"Îkú·-Nkë4áôË•ê" 8–i¿5œ	áëï‹Ğúô~I[1ˆĞXÏì‹’J¸À¿Ö Oñé¶şy usæºÇbÒfEqœ]ï©İt!Ñy° 2ftTç†Ï
š³•o@@T‚ÑÜ0£€CVh7šm*˜Û¹÷ä8ş³©m9&¹™A?§¹’Üáô!¯N¤M-°b¢Ïâİ…k2Xy3#ºb1ù„µrîÉZˆ¯igkTuRÃ…œÒ2¨dÆß†!ï•°v“•‚)Ux/TŠÏÎ µÒN>	&\\CHô+MÊÇu„Ç¼âZĞb¼ß¥=33²:èŒğò:x„“:id²%ïLeäÑÎ‹•ü$’2Å¥ß›-dA¼Yù-Á— Ç+’ŞvQU¬} ·/Ÿ|äBé’—uÇVİZ…¢üÅÜó¶(„zW¾—•÷Ó'ëJÿm¥®#UÇ“/“Z=Û¢Ş^"@5Á#}óõ|äz û+­x¦ÈESiö9şúEJÆ>D—ÇQœLKš•Wçñ‡¹×S‡á': §ê,à´V:÷Tõ‘+Ëfü8)V°¤Å³V%P.ç ñy¯<ëp•!ÑÆ, 7Ïæuj¢›©¯¶±ıƒIeª:ğñE÷?'Xty)Ó ½øË:Z·ß8Èæëì&41é<å]{YÓk³?®ò4ØRïôÜE#Ñ{Ôô0àÒ)³r‹zM1úÏ¨m¦1¬ÙªfuöW½[júÀ½ßŒ7ÌJÓœÌ¢vğ°ÿ?İx¦y>:ƒCÈâKõb‡Nã_åÕ?øåÉ‹PGqúmW¤Ñ2YªïS¢44Ä÷uibg‡¥É	íû¶áTr2×W	Øøì9ƒ{Ut0jxÉ!]6Àp•ƒøW«í¾QçÜÓïìJ_ƒŠŠ¡áÁûŸr¸—¸nwêÃYœœ.ôÿú‚hòU§Î5º 9¢Äf‡m©m Ã?vyã¶è§@VX› "ÂZšŒŞï¦ïò›"‘ÎªÂ&Ö¬wbËu¾Ñ8‡ç6·›<¯lå_Åg|:qÔŸê†‘JdÈ’@:"á¦¾©æb'|ï	ø-væÔ‚Æ‚B»ÀïÈ<¹,¸êŞ(¢­|û[ø {NuQÃ¤ª•ôjcÍøkEé†‘ÍĞ$Ş ½E©ÿúËy&2×œfeÜY
`q‘én?Åß`q¦ğ¦bÀAb"ÀÒu«ÏJ˜c‡ÕŞıiÈô»L‹	æ°5ÙªÏ­BK„P›¢õâÖÈ±KÃ–Ø£"‘nW[J0pTÖÇ"-¨•Á-Nò\ÊQhBœO‰Mu‘*D4!J3»Ù¥…â
u&‘"æá¶¦å)Ë{_qUüÒM÷&‰Àôª®¨Ãƒ•­:4:®iúaà·R“'À1"‚_}zòmÆà£œ´‚}¡jÛåfzˆEÉƒ¶Ük,æ?AR»dw->¬£Ê$™ñMùÿ\itøj//‡¼2X€?±İ%X¶ó¿&\¿Æa¿Š3v¬ÔüÔìNcG"\)W?®ÒÛ{M"–ËJ„-ù(ÿÃAT0°7ÏX&Ò7íu#™ÿRNÜw)oàoQ”¿œ_ šÒEa¥ÀÔ€7ÔcXÕóu÷dU’Ã@1íOa1¿‘i6Ü®7Ô9Ú`xC *<hÃ4Z(@²{§ÒÓqIÉG¾ÀOh¹#’<¹£TÒ…øv×
­Å^XK´ó4`;e_÷®“ëjPšßŒ.A{NÄo vERÆÕ>øÊ^&ş|èú`$tL—®bŞís•gÀR7=8C…ö4sİ‚Æv”FêÌ@Gê“$Rš¨±yuˆãÄ¯F¼62 6|è‚×ºxÕÆjY`3}ì>eh¸Âì>»£§ÆŠ{•À¨)ĞûwéjÎéz4 ËşRêet¹°exÖD %nlğ 4UAæ¿eMbvòÌ€¾ôïšBîÎ&ıÚøá„¿MAR_–UBÒ öTŸY‰3ç>ëd*L+iß«u5+‚-«Ñİ›~ĞLdœìŠ†ò êš„¦uÏÃöYVÀ½vWª§ŒPÙz×Ó»M#sÒÔÍU™ğ¿ì?m‚‡›k-…‡hY£‹Ë/´÷x²?oJÜ§‰xt/ßê¡0WƒóÇÓ¶l­½%ÑÓ´õĞM++„›å×}L$æ+ÌgW¸ÿåJ„Ë®3—N:ïá¥‚ rò¨LÇçŒ2Í3Àö*^ñ{‰[û–6¾ÃÅwë1ŸËÿB^€œÅ•Iì­Ş†ÄqéÉ¬(¼{ª`oš?\A(ÿÃ¦ûİòÌ¯˜ìéxò4%åÑ
i@"Pz­.ò/åÃ‡šùò4æÀ$Z0XÄ¯Ùäß#éî¦·=8jÇƒºl×m§İ›2Ï“X1ùz}+¬å HÚÌID‡¿K… ô\mT·—Qb¨è3.mDİÿ"µ¾Ù/&ÔhDkØr+NÊïéÄJ‘ÓğxëŸÏçJ&dwR+J;„{11•G]ĞZï·8ßdnmr4»ğ		Je´.åG~¤è™8	Á.ËÀ7²h°ùq¯:Ò7åZÈ>úõÏY‘Oñ7j*ç‚c3B1¡¶¨ZÌÄS–pñõ2Ú[Á6Èõ×<>w·œcbXÄøCÉ‘%ûOO6Åã˜Á_ÄÒ×4;SÎc$Ãwbü˜	¢Ø‡,„Q§¦ih=ê¸$!Œ¦F¦ƒF7~óãŞëÁši­yÑŠt¾·æß¤Å½èÜ^Aq>ü–B"ú5O/Xc`„'XªğìBº3v@åU¢-•çğO¼°;Öq{±.‡%ú:8V½¿qFTQŸ^wFËŠS’¦äƒCf§ØDè¤/Ä‚ª	˜²Ú‹k-ûÛøpbÃ‰îc,Š}¦!˜ğ@õP}†êPÃ)>Ï7s¢Ú¨aïk$	„ô}
ŸUêÀ¡7Œš,±«T‰N<Z=¥=h´ãRœë*5İÍ>7•¾ÑÙ¾¶8ßáŒ¾~Q$…²Å°}»W;rÂM¬g1#k‹~•æÛ™–¾p¹ı5m —%{â—8§Ù'¦i€ÆÑHrÊE>ä©¦pşm¸„^,qÄMXéğQÎòœ¼&Ìô$µ>ìg¢£7W´š?G“K&ÒŒÏâÑ±	ˆxâª\ş¨ŸüGŞå!µxOfÏAı‡ƒÇÁ°!¨ŸØ¬0øğ0[‰ÏxØ_ŞƒÛC[bèºƒS(©;tœg×ŒŠJY©6E¼Ù!±y YuIƒäOíó¯ÿh¿ƒ$´+épHó©-@º¤Ú€Ğ^òéwì´<75l+!?•[åûnià=‹­Ö*%ÅÇí,OóM‚XmægI­µÕ¥ÿ8Q+G'½À¸–y&›;bsJAş°q	FRáÓÃ;wÍÑ‘	«VsÆáU4BŠq Ÿ`á>ñ?æo/ã˜ˆ|4€ài“gh%$¸Ø†Ra‡û]ŞôÚQ Á… (ï‚«WaúûDĞ\×ôtO1ÔÚ;Ç(d®ZÑÅ¸Ê:"ôÈ‹Mêì¯ûÜ©s/´÷¤ô\fÉœbpè¼«B)Õ™L¾á‘™¸¡iR=—ŸüÎN)ÁT7§íË•.Ğ·Ãâ+'G2Ò%-«s	™”¬x Ù`Şn²ùfvs¨1nDÉ5T_+“Â=7Ók¢¤ş³ydaÊ{™f¼ğ¤W8_½ö 8ÇrÒ‚h¥s†ç„Ömˆ¸QÊÁ‡æ)­ÀïÌ·/¾%bS.¬ÊÄzkÇqô»CaÒ‘7{¼¼oæbIÄÏ j³C%‰ëâ~c]^¢DÉÛÄeSŞëY§À†vì1ÂhÍ6O™F÷upIµ½ÛN¥°•y¡I(Õ‰h×óı&YN$P÷vâwbæœ5°Am=\‘F:ö)ÓšÈ;i$g}qC $i>IP
lãGÚ6b¥{ºYJìÊùëÓ…à…ÙMşäSšÛó\!££>"àfVvø±/YP;”èñ¡}sRr3FøíM• &–Ì¦77|wÔ“Œxßëú¯ñè…Ù²3E’Ìu²UÍqVà¯àh‡û¶¹¹ûé™ğe›, H§Q ÛÈõîğH7Zá)³ş>™:Ÿ‚@Â‹FËÓlˆ†°J±.¦ŠAÕÜVÄË°n¡¦%îj”/ªÕ\dŒÙÎ¨/ôs)¤Q] Ùÿîh÷ óÁ‚uHŠr3ñÓè ªá(ÇWÁ',G$¼FÄFˆojsİÅyPC‰º-ÏÓ—Ò$$ê%øYZË k˜0ešwÛV¦å‡Ò Ì2Íçw3ÜaŸDÓÈM¼cÆ¥Ó@üß¨îZ(9Ş‰¼Ÿ–'ylİ½8&•,Í4w4ÇŠ”V:ã?&efoÒFoa‚[§Æ¤™DP6xFóññ=$—!Wk’5$ŸşŞ>™ÖË‹°Âªˆã›†£ïÌß3öîç«–I‰†<
dÀh!Œ©ÏØ?d”Y~ÄˆÀ"Š˜§E®öB‹”]š¯H³›ô`ÚçxÛÏ¤‡‘U,*wc)¨uø.ù?K*’ÀØ@Ôr„”Ğ·H=à£gc`†ëf±(­öh³³Í-|iÓWY¥EìKxñ—¦Ù©½“¤À:¼ht5$–éšg|8z+7’
E€ô#‡<{ğÑn8Ÿ2çH[QW)aÆşÃ¶lİ†Dtqd1(È´²M!h&Éàß´†;üù ºózÌEŒçZJŠÈø–nóÕÖæ£æ€¿¢»Ã^ïâËl[U&Htkô;n6¹ğÿw«­3æ¼ª?Z#B.
DÌ\/>ÌSijOÄñ­LŸo§4^½*ËÍ C˜[	ƒ—T•&æRÉ4CaE”À]îãıã27Æ™4t
Ä¬Ì4Æ[Éa¡Ğ_“>Ö¬Õ”ƒ¾jæ+ƒQNsâª27¤ÒÃ˜4è!j`›ïçlğØy¢Şd^¸¦ºœÇoK‡O–˜¯ÕTOBı¬%ıÉŒ¡]Z1ĞÔ¡ÄÑÓÈuá©Ø >¿6
›ğî(ç,Û…¢gÖ)-÷Îœ52öaù]öMuÄã‹ãÂéñ®¥iÕ¦Q6ñƒytœoíTí,¢O+ÀpøR¥ãñ'ˆ¸¥hm¬®½Y¨Î;Ğd[¬C¯šòoG“&¸sÎ…Iar index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    var index = this._findSourceIndex(aSource);
	    if (index >= 0) {
	      return this.sourcesContent[index];
	    }
	
	    var relativeSource = aSource;
	    if (this.sourceRoot != null) {
	      relativeSource = util.relative(this.sourceRoot, relativeSource);
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }
	
	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + relativeSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
	      }
	    }
	
	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    source = this._findSourceIndex(source);
	    if (source < 0) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }
	
	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }
	
	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };
	
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	
	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The first parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');
	
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	
	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');
	
	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;
	
	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
	    }
	  });
	}
	
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }
	
	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];
	
	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }
	
	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content) {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based. 
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer._findSourceIndex(util.gear index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    var index = this._findSourceIndex(aSource);
	    if (index >= 0) {
	      return this.sourcesContent[index];
	    }
	
	    var relativeSource = aSource;
	    if (this.sourceRoot != null) {
	      relativeSource = util.relative(this.sourceRoot, relativeSource);
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }
	
	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + relativeSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
	      }
	    }
	
	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    source = this._findSourceIndex(source);
	    if (source < 0) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }
	
	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }
	
	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };
	
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	
	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The first parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');
	
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	
	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');
	
	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;
	
	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
	    }
	  });
	}
	
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }
	
	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];
	
	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }
	
	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content) {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based. 
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer._findSourceIndex(util.gear index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    var index = this._findSourceIndex(aSource);
	    if (index >= 0) {
	      return this.sourcesContent[index];
	    }
	
	    var relativeSource = aSource;
	    if (this.sourceRoot != null) {
	      relativeSource = util.relative(this.sourceRoot, relativeSource);
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can 
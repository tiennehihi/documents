# Change Log

## 0.5.6

* Fix for regression when people were using numbers as names in source maps. See
  #236.

## 0.5.5

* Fix "regression" of unsupported, implementation behavior that half the world
  happens to have come to depend on. See #235.

* Fix regression involving function hoisting in SpiderMonkey. See #233.

## 0.5.4

* Large performance improvements to source-map serialization. See #228 and #229.

## 0.5.3

* Do not include unnecessary distribution files. See
  commit ef7006f8d1647e0a83fdc60f04f5a7ca54886f86.

## 0.5.2

* Include browser distributions of the library in package.json's `files`. See
  issue #212.

## 0.5.1

* Fix latent bugs in IndexedSourceMapConsumer.prototype._parseMappings. See
  ff05274becc9e6e1295ed60f3ea090d31d843379.

## 0.5.0

* Node 0.8 is no longer supported.

* Use webpack instead of dryice for bundling.

* Big speedups serializing source maps. See pull request #203.

* Fix a bug with `SourceMapConsumer.prototype.sourceContentFor` and sources that
  explicitly start with the source root. See issue #199.

## 0.4.4

* Fix an issue where using a `SourceMapGenerator` after having created a
  `SourceMapConsumer` from it via `SourceMapConsumer.fromSourceMap` failed. See
  issue #191.

* Fix an issue with where `SourceMapGenerator` would mistakenly consider
  different mappings as duplicates of each other and avoid generating them. See
  issue #192.

## 0.4.3

* A very large number of performance improvements, particularly when parsing
  source maps. Collectively about 75% of time shaved off of the source map
  parsing benchmark!

* Fix a bug in `SourceMapConsumer.prototype.allGeneratedPositionsFor` and fuzzy
  searching in the presence of a column option. See issue #177.

* Fix a bug with joining a source and its source root when the source is above
  the root. See issue #182.

* Add the `SourceMapConsumer.prototype.hasContentsOfAllSources` method to
  determine when all sources' contents are inlined into the source map. See
  issue #190.

## 0.4.2

* Add an `.npmignore` file so that the benchmarks aren't pulled down by
  dependent projects. Issue #169.

* Add an optional `column` argument to
  `SourceMapConsumer.prototype.allGeneratedPositionsFor` and better handle lines
  with no mappings. Issues #172 and #173.

## 0.4.1

* Fix accidentally defining a global variable. #170.

## 0.4.0

* The default direction for fuzzy searching was changed back to its original
  direction. See #164.

* There is now a `bias` option you can supply to `SourceMapConsumer` to control
  the fuzzy searching direction. See #167.

* About an 8% speed up in parsing source maps. See #159.

* Added a benchmark for parsing and generating source maps.

## 0.3.0

* Change the default direction that searching for positions fuzzes when there is
  not an exact match. See #154.

* Support for environments using json2.js for JSON serialization. See #156.

## 0.2.0

* Support for consuming "indexed" source maps which do not have any remote
  sections. See pull request #127. This introduces a minor backwards
  incompatibility if you are monkey patching `SourceMapConsumer.prototype`
  methods.

## 0.1.43

* Performance improvements for `SourceMapGenerator` and `SourceNode`. See issue
  #148 for some discussion and issues #150, #151, and #152 for implementations.

## 0.1.42

* Fix an issue where `SourceNode`s from different versions of the source-map
  library couldn't be used in conjunction with each other. See issue #142.

## 0.1.41

* Fix a bug with getting the source content of relative sources with a "./"
  prefix. See issue #145 and [Bug 1090768](bugzil.la/1090768).

* Add the `SourceMapConsumer.prototype.computeColumnSpans` method to compute the
  column span of each mapping.

* Add the `SourceMapConsumer.prototype.allGeneratedPositionsFor` method to find
  all generated positions associated with a given original source and line.

## 0.1.40

* Performance improvements for parsing source maps in SourceMapConsumer.

## 0.1.39

* Fix a bug where setting a source's contents to null before any source content
  had been set before threw a TypeError. See issue #131.

## 0.1.38

* Fix a bug where finding relative paths from an empty path were creating
  absolute paths. See issue #129.

## 0.1.37

* Fix a bug where if the source root was an empty string, relative source paths
  would turn into absolute source paths. Issue #124.

## 0.1.36

* Allow the `names` mapping property to be an empty string. Issue #121.

## 0.1.35

* A third optional parameter was added to `SourceNode.fromStringWithSourceMap`
  to specify a path that relative sources in the second parameter should be
  relative to. Issue #105.

* If no file property is given to a `SourceMapGenerator`, then the resulting
  source map will no longer have a `null` file property. The property will
  simply not exist. Issue #104.

* Fixed a bug where consecutive newlines were ignored in `SourceNode`s.
  Issue #116.

## 0.1.34

* Make `SourceNode` work with windows style ("\r\n") newlines. Issue #103.

* Fix bug involving source contents and the
  `SourceMapGenerator.prototype.applySourceMap`. Issue #100.

## 0.1.33

* Fix some edge cases surrounding path joining and URL resolution.

* Add a third parameter for relative path to
  `SourceMapGenerator.prototype.applySourceMap`.

* Fix issues with mappings and EOLs.

## 0.1.32

* Fixed a bug where SourceMapConsumer couldn't handle negative relative columns
  (issue 92).

* Fixed test runner to actually report number of failed tests as its process
  exit code.

* Fixed a typo when reporting bad mappings (issue 87).

## 0.1.31

* Delay parsing the mappings in SourceMapConsumer until queried for a source
  location.

* Support Sass source maps (which at the time of writing deviate from the spec
  in small ways) in SourceMapConsumer.

## 0.1.30

* Do not join source root with a source, when the source is a data URI.

* Extend the test runner to allow running single specific test files at a time.

* Performance improvements in `SourceNode.prototype.walk` and
  `SourceMapConsumer.prototype.eachMapping`.

* Source map b
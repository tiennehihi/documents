# Source Map JS

[![NPM](https://nodei.co/npm/source-map-js.png?downloads=true&downloadRank=true)](https://www.npmjs.com/package/source-map-js)

Difference between original [source-map](https://github.com/mozilla/source-map):

> TL,DR: it's fork of original source-map@0.6, but with perfomance optimizations.

This journey starts from [source-map@0.7.0](https://github.com/mozilla/source-map/blob/master/CHANGELOG.md#070). Some part of it was rewritten to Rust and WASM and API became async.

It's still a major block for many libraries like PostCSS or Sass for example because they need to migrate the whole API to the async way. This is the reason why 0.6.1 has 2x more downloads than 0.7.3 while it's faster several times.

![Downloads count](media/downloads.png)

More important that WASM version has some optimizations in JS code too. This is why [community asked to create branch for 0.6 version](https://github.com/mozilla/source-map/issues/324) and port these optimizations but, sadly, the answer was «no». A bit later I discovered [the issue](https://github.com/mozilla/source-map/issues/370) created by [Ben Rothman (@benthemonkey)](https://github.com/benthemonkey) with no response at all.

[Roman Dvornov (@lahmatiy)](https://github.com/lahmatiy) wrote a [serveral posts](https://t.me/gorshochekvarit/76) (russian, only, sorry) about source-map library in his own Telegram channel. He mentioned the article [«Maybe you don't need Rust and WASM to speed up your JS»](https://mrale.ph/blog/2018/02/03/maybe-you-dont-need-rust-to-speed-up-your-js.html) written by [Vyacheslav Egorov (@mraleph)](https://github.com/mraleph). This article contains optimizations and hacks that lead to almost the same performance compare to WASM implementation.

I decided to fork the original source-map and port these optimizations from the article and several others PR from the original source-map.

---------

This is a library to generate and consume the source map format
[described here][format].

[format]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit

## Use with Node

    $ npm install source-map-js

<!-- ## Use on the Web

    <script src="https://raw.githubusercontent.com/mozilla/source-map/master/dist/source-map.min.js" defer></script> -->

--------------------------------------------------------------------------------

<!-- `npm run toc` to regenerate the Table of Contents -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Examples](#examples)
  - [Consuming a source map](#consuming-a-source-map)
  - [Generating a source map](#generating-a-source-map)
    - [With SourceNode (high level API)](#with-sourcenode-high-level-api)
    - [With SourceMapGenerator (low level API)](#with-sourcemapgenerator-low-level-api)
- [API](#api)
  - [SourceMapConsumer](#sourcemapconsumer)
    - [new SourceMapConsumer(rawSourceMap)](#new-sourcemapconsumerrawsourcemap)
    - [SourceMapConsumer.prototype.computeColumnSpans()](#sourcemapconsumerprototypecomputecolumnspans)
    - [SourceMapConsumer.prototype.originalPositionFor(generatedPosition)](#sourcemapconsumerprototypeoriginalpositionforgeneratedposition)
    - [SourceMapConsumer.prototype.generatedPositionFor(originalPosition)](#sourcemapconsumerprototypegeneratedpositionfororiginalposition)
    - [SourceMapConsumer.prototype.allGeneratedPositionsFor(originalPosition)](#sourcemapconsumerprototypeallgeneratedpositionsfororiginalposition)
    - [SourceMapConsumer.prototype.hasContentsOfAllSources()](#sourcemapconsumerprototypehascontentsofallsources)
    - [SourceMapConsumer.prototype.sourceContentFor(source[, returnNullOnMissing])](#sourcemapconsumerprototypesourcecontentforsource-returnnullonmissing)
    - [SourceMapConsumer.prototype.eachMapping(callback, context, order)](#sourcemapconsumerprototypeeachmappingcallback-context-order)
  - [SourceMapGenerator](#sourcemapgenerator)
    - [new SourceMapGenerator([startOfSourceMap])](#new-sourcemapgeneratorstartofsourcemap)
    - [SourceMapGenerator.fromSourceMap(sourceMapConsumer)](#sourcemapgeneratorfromsourcemapsourcemapconsumer)
    - [SourceMapGenerator.prototype.addMapping(mapping)](#sourcemapgeneratorprototypeaddmappingmapping)
    - [SourceMapGenerator.prototype.setSourceContent(sourceFile, sourceContent)](#sourcemapgeneratorprototypesetsourcecontentsourcefile-sourcecontent)
    - [SourceMapGenerator.prototype.applySourceMap(sourceMapConsumer[, sourceFile[, sourceMapPath]])](#sourcemapgeneratorprototypeapplysourcemapsourcemapconsumer-sourcefile-sourcemappath)
    - [SourceMapGenerator.prototype.toString()](#sourcemapgeneratorprototypetostring)
  - [SourceNode](#sourcenode)
    - [new SourceNode([line, column, source[, chunk[, name]]])](#new-sourcenodeline-column-source-chunk-name)
    - [SourceNode.fromStringWithSourceMap(code, sourceMapConsumer[, relativePath])](#sourcenodefromstringwithsourcemapcode-sourcemapconsumer-relativepath)
    - [SourceNode.prototype.add(chunk)](#sourcenodeprototypeaddchunk)
    - [SourceNode.prototype.prepend(chunk)](#sourcenodeprototypeprependchunk)
    - [SourceNode.prototype.setSourceContent(sourceFile, sourceContent)](#sourcenodeprototypesetsourcecontentsourcefile-sourcecontent)
    - [SourceNode.prototype.walk(fn)](#sourcenodeprototypewalkfn)
    - [SourceNode.prototype.walkSourceContents(fn)](#sourcenodeprototypewalksourcecontentsfn)
    - [SourceNode.prototype.join(sep)](#sourcenodeprototypejoinsep)
    - [SourceNode.prototype.replaceRight(pattern, replacement)](#sourcenodeprototypereplacerightpattern-replacement)
    - [SourceNode.prototype.toString()](#sourcenodeprototypetostring)
    - [SourceNode.prototype.toStringWithSourceMap([startOfSourceMap])](#sourcenodeprototypetostringwithsourcemapstartofsourcemap)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Examples

### Consuming a source map

```js
var rawSourceMap = {
  version: 3,
  file: 'min.js',
  names: ['bar', 'baz', 'n'],
  sources: ['one.js', 'two.js'],
  sourceRoot: 'http://example.com/www/js/',
  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA'
};

var smc = new SourceMapConsumer(rawSourceMap);

console.log(smc.sources);
// [ 'http://example.com/www/js/one.js',
//   'http://example.com/www/js/two.js' ]

console.log(smc.originalPositionFor({
  line: 2,
  column: 28
}));
// { source: 'http://example.com/www/js/two.js',
//   line: 2,
//   column: 10,
//   name: 'n' }

console.log(smc.generatedPositionFor({
  source: 'http://example.com/www/js/two.js',
  line: 2,
  column: 10
}));
// { line: 2, column: 28 }

smc.eachMapping(function (m) {
  // ...
});
```

### Generating a source map

In depth guide:
[**Compiling to JavaScript, and Debugging with Source Maps**](https://hacks.mozilla.org/2013/05/compiling-to-javascript-and-debugging-with-source-maps/)

#### With SourceNode (high level API)

```js
function compile(ast) {
  switch (ast.type) {
  case 'BinaryExpression':
    return new SourceNode(
      ast.location.line,
      ast.location.column,
      ast.location.source,
      [compile(ast.left), " + ", compile(ast.right)]
    );
  case 'Literal':
    return new SourceNode(
      ast.location.line,
      ast.location.column,
      ast.location.source,
      String(ast.value)
    );
  // ...
  default:
    throw new Error("Bad AST");
  }
}

var ast = parse("40 + 2", "add.js");
console.log(compile(ast).toStringWithSourceMap({
  file: 'add.js'
}));
// { code: '40 + 2',
//   map: [object SourceMapGenerator] }
```

#### With SourceMapGenerator (low level API)

```js
var map = new SourceMapGenerator({
  file: "source-mapped.js"
});

map.addMapping({
  generated: {
    line: 10,
    column: 35
  },
  source: "foo.js",
  original: {
    line: 33,
    column: 2
  },
  name: "christopher"
});

console.log(map.toString());
// '{"version":3,"file":"source-mapped.js","sources":["foo.js"],"names":["christopher"],"mappings":";;;;;;;;;mCAgCEA"}'
```

## API

Get a reference to the module:

```js
// Node.js
var sourceMap = require('source-map');

// Browser builds
var sourceMap = window.sourceMap;

// Inside Firefox
const sourceMap = require("devtools/toolkit/sourcemap/source-map.js");
```

### SourceMapConsumer

A SourceMapConsumer instance represents a parsed source map which we can query
for information about the original file positions by giving it a file position
in the generated source.

#### new SourceMapConsumer(rawSourceMap)

The only parameter is the raw source map (either as a string which can be
`JSON.parse`'d, or an object). According to the spec, source maps have the
following attributes:

* `version`: Which version of the source map spec this map is following.

* `sources`: An array of URLs to the original source files.

* `names`: An array of identifiers which can be referenced by individual
  mappings.

* `sourceRoot`: Optional. The URL root from which all sources are relative.

* `sourcesContent`: Optional. An array of contents of the original source files.

* `mappings`: A string of base64 VLQs which contain the actual mappings.

* `file`: Optional. The generated filename this source map is associated with.

```js
var consumer = new sourceMap.SourceMapConsumer(rawSourceMapJsonData);
```

#### SourceMapConsumer.prototype.computeColumnSpans()

Compute the last column for each generated mapping. The last column is
inclusive.

```js
// Before:
consumer.allGeneratedPositionsFor({ line: 2, source: "foo.coffee" })
// [ { line: 2,
//     column: 1 },
//   { line: 2,
//     column: 10 },
//   { line: 2,
//     column: 20 } ]

consumer.computeColumnSpans();

// After:
consumer.allGeneratedPositionsFor({ line: 2, source: "foo.coffee" })
// [ { line: 2,
//     column: 1,
//     lastColumn: 9 },
//   { line: 2,
//     column: 10,
//     lastColumn: 19 },
//   { line: 2,
//     column: 20,
//     lastColumn: Infinity } ]

```

#### SourceMapConsumer.prototype.originalPositionFor(generatedPosition)

Returns the original source, line, and column information for the generated
source's line and column positions provided. The only argument is an object with
the following properties:

* `line`: The line number in the generated source.  Line numbers in
  this library are 1-based (note that the underlying source map
  specification uses 0-based line numbers -- this library handles the
  translation).

* `column`: The column number in the generated source.  Column numbers
  in this library are 0-based.

* `bias`: Either `SourceMapConsumer.GREATEST_LOWER_BOUND` or
  `SourceMapConsumer.LEAST_UPPER_BOUND`. Specifies whether to return the closest
  element that is smaller than or greater than the one we are searching for,
  respectively, if the exact element cannot be found.  Defaults to
  `SourceMapConsumer.GREATEST_LOWER_BOUND`.

and an object is returned with the following properties:

* `source`: The original source file, or null if this information is not
  available.

* `line`: The line number in the original source, or null if this information is
  not available.  The line number is 1-based.

* `column`: The column number in the original source, or null if this
  information is not available.  The column number is 0-based.

* `name`: The original identifier, or null if this information is not available.

```js
consumer.originalPositionFor({ line: 2, column: 10 })
// { source: 'foo.coffee',
//   line: 2,
//   column: 2,
//   name: null }

consumer.originalPositionFor({ line: 99999999999999999, column: 999999999999999 })
// { source: null,
//   line: null,
//   column: null,
//   name: null }
```

#### SourceMapConsumer.prototype.generatedPositionFor(originalPosition)

Returns the generated line and column information for the original source,
line, and column positions provided. The only argument is an object with
the following properties:

* `source`: The filename of the original source.

* `line`: The line number in the original source.  The line number is
  1-based.

* `column`: The column number in the original source.  The column
  number is 0-based.

and an object is returned with the following properties:

* `line`: The line number in the generated source, or null.  The line
  number is 1-based.

* `column`: The column number in the generated source, or null.  The
  column number is 0-based.

```js
consumer.generatedPositionFor({ source: "example.js", line: 2, column: 10 })
// { line: 1,
//   column: 56 }
```

#### SourceMapConsumer.prototype.allGeneratedPositionsFor(originalPosition)

Returns all generated line and column information for the original source, line,
and column provided. If no column is provided, returns all mappings
corresponding to a either the line we are searching for or the next closest line
that has any mappings. Otherwise, returns all mappings corresponding to the
given line and either the column we are searching for or the next closest column
that has any offsets.

The only argument is an object with the following properties:

* `source`: The filename of the original source.

* `line`: The line number in the original source.  The line number is
  1-based.

* `column`: Optional. The column number in the original source.  The
  column number is 0-based.

and an array of objects is returned, each with the following properties:

* `line`: The line number in the generated source, or null.  The line
  number is 1-based.

* `column`: The column number in the generated source, or null.  The
  column number is 0-based.

```js
consumer.allGeneratedpositionsfor({ line: 2, source: "foo.coffee" })
// [ { line: 2,
//     column: 1 },
//   { line: 2,
//     column: 10 },
//   { line: 2,
//     column: 20 } ]
```

#### SourceMapConsumer.prototype.hasContentsOfAllSources()

Return true if we have the embedded source content for every source listed in
the source map, false otherwise.

In other words, if this method returns `true`, then
`consumer.sourceContentFor(s)` will succeed for every source `s` in
`consumer.sources`.

```js
// ...
if (consumer.hasContentsOfAllSources()) {
  consumerReadyCallback(consumer);
} else {
  fetchSources(consumer, consumerReadyCallback);
}
// ...
```

#### SourceMapConsumer.prototype.sourceContentFor(source[, returnNullOnMissing])

Returns the original source content for the source provided. The only
argument is the URL of the original source file.

If the source content for the given source is not found, then an error is
thrown. Optionally, pass `true` as the second param to have `null` returned
instead.

```js
consumer.sources
// [ "my-cool-lib.clj" ]

consumer.sourceContentFor("my-cool-lib.clj")
// "..."

consumer.sourceContentFor("this is not in the source map");
// Error: "this is not in the source map" is not in the source map

consumer.sourceContentFor("this is not in the source map", true);
// null
```

#### SourceMapConsumer.prototype.eachMapping(callback, context, order)

Iterate over each mapping between an original source/line/column and a
generated line/column in this source map.

* `callback`: The function that is called with each mapping. Mappings have the
  form `{ source, generatedLine, generatedColumn, originalLine, originalColumn,
  name }`

* `context`: Optional. If specified, this object will be the value of `this`
  every time that `callback` is called.

* `order`: Either `SourceMapConsumer.GENERATED_ORDER` or
  `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to iterate over
  the mappings sorted by the generated file's line/column order or the
  original's source/line/column order, respectively. Defaults to
  `SourceMapConsumer.GENERATED_ORDER`.

```js
consumer.eachMapping(function (m) { console.log(m); })
// ...
// { source: 'illmatic.js',
//   generatedLine: 1,
//   generatedColumn: 0,
//   originalLine: 1,
//   originalColumn: 0,
//   name: null }
// { source: 'illmatic.js',
//   generatedLine: 2,
//   generatedColumn: 0,
//   originalLine: 2,
//   originalColumn: 0,
//   name: null }
// ...
```
### SourceMapGenerator

An instance of the SourceMapGenerator represents a source map which is being
built incrementally.

#### new SourceMapGenerator([startOfSourceMap])

You may pass an object with the following properties:

* `file`: The filename of the generated source that this source map is
  associated with.

* `sourceRoois.work()}))}async work(){if(this.workerCount>=this.maxParallel)return;let e;for(this.workerCount++;e=this.queue.shift();){const{reject:t,resolve:i,task:s}=e;try{i(await s())}catch(e){t(e)}}this.workerCount--}}class gl{constructor(e,t){var i,s;if(this.options=e,this.cachedModules=new Map,this.deoptimizationTracker=new U,this.entryModules=[],this.modulesById=new Map,this.needsTreeshakingPass=!1,this.phase=Gs.LOAD_AND_PARSE,this.scope=new el,this.watchFiles=Object.create(null),this.watchMode=!1,this.externalModules=[],this.implicitEntryModules=[],this.modules=[],this.getModuleInfo=e=>{const t=this.modulesById.get(e);return t?t.info:null},!1!==e.cache){if(null===(i=e.cache)||void 0===i?void 0:i.modules)for(const t of e.cache.modules)this.cachedModules.set(t.id,t);this.pluginCache=(null===(s=e.cache)||void 0===s?void 0:s.plugins)||Object.create(null);for(const e in this.pluginCache){const t=this.pluginCache[e];for(const e of Object.values(t))e[0]++}}if(t){this.watchMode=!0;const e=(...e)=>this.pluginDriver.hookParallel("watchChange",e),i=()=>this.pluginDriver.hookParallel("closeWatcher",[]);t.onCurrentAwaited("change",e),t.onCurrentAwaited("close",i)}this.pluginDriver=new cl(this,e,e.plugins,this.pluginCache),this.acornParser=Fa.extend(...e.acornInjectPlugins),this.moduleLoader=new Xo(this,this.modulesById,this.options,this.pluginDriver),this.fileOperationQueue=new ml(e.maxParallelFileOps)}async build(){en("generate module graph",2),await this.generateModuleGraph(),tn("generate module graph",2),en("sort modules",2),this.phase=Gs.ANALYSE,this.sortModules(),tn("sort modules",2),en("mark included statements",2),this.includeStatements(),tn("mark included statements",2),this.phase=Gs.GENERATE}contextParse(e,t={}){const i=t.onComment,s=[];t.onComment=i&&"function"==typeof i?(e,n,r,a,...o)=>(s.push({end:a,start:r,type:e?"Block":"Line",value:n}),i.call(t,e,n,r,a,...o)):s;const n=this.acornParser.parse(e,{...this.options.acorn,...t});return"object"==typeof i&&i.push(...s),t.onComment=i,function(e,t,i){const s=[],n=[];for(const t of e)lt.test(t.value)?s.push(t):it.test(t.value)&&n.push(t);for(const e of n)ht(t,e,!1);st(t,{annotationIndex:0,annotations:s,code:i})}(s,n,e),n}getCache(){for(const e in this.pluginCache){const t=this.pluginCache[e];let i=!0;for(const[e,s]of Object.entries(t))s[0]>=this.options.experimentalCacheExpiry?delete t[e]:i=!1;i&&delete this.pluginCache[e]}return{modules:this.modules.map((e=>e.toJSON())),plugins:this.pluginCache}}async generateModuleGraph(){var e;if(({entryModules:this.entryModules,implicitEntryModules:this.implicitEntryModules}=await this.moduleLoader.addEntryModules((e=this.options.input,Array.isArray(e)?e.map((e=>({fileName:null,id:e,implicitlyLoadedAfter:[],importer:void 0,name:null}))):Object.entries(e).map((([e,t])=>({fileName:null,id:t,implicitlyLoadedAfter:[],importer:void 0,name:e})))),!0)),0===this.entryModules.length)throw new Error("You must supply options.input to rollup");for(const e of this.modulesById.values())e instanceof ln?this.modules.push(e):this.externalModules.push(e)}includeStatements(){for(const e of[...this.entryModules,...this.implicitEntryModules])rn(e);if(this.options.treeshake){let e=1;do{en(`treeshaking pass ${e}`,3),this.needsTreeshakingPass=!1;for(const e of this.modules)e.isExecuted&&("no-treeshake"===e.info.moduleSideEffects?e.includeAllInBundle():e.include());if(1===e)for(const e of[...this.entryModules,...this.implicitEntryModules])!1!==e.preserveSignature&&(e.includeAllExports(!1),this.needsTreeshakingPass=!0);tn("treeshaking pass "+e++,3)}while(this.needsTreeshakingPass)}else for(const e of this.modules)e.includeAllInBundle();for(const e of this.externalModules)e.warnUnusedImports();for(const e of this.implicitEntryModules)for(const t of e.implicitlyLoadedAfter)t.info.isEntry||t.isIncluded()||pe(be(t))}sortModules(){const{orderedModules:e,cyclePaths:t}=function(e){let t=0;const i=[],s=new Set,n=new Set,r=new Map,a=[],o=e=>{if(e instanceof ln){for(const t of e.dependencies)r.has(t)?s.has(t)||i.push(Kr(t,e,r)):(r.set(t,e),o(t));for(const t of e.implicitlyLoadedBefore)n.add(t);for(const{resolution:t}of e.dynamicImports)t instanceof ln&&n.add(t);a.push(e)}e.execIndex=t++,s.add(e)};for(const t of e)r.has(t)||(r.set(t,null),o(t));for(const e of n)r.has(e)||(r.set(e,null),o(e));return{cyclePaths:i,orderedModules:a}}(this.entryModules);for(const e of t)this.options.onwarn({code:"CIRCULAR_DEPENDENCY",cycle:e,importer:e[0],message:`Circular dependency: ${e.join(" -> ")}`});this.modules=e;for(const e of this.modules)e.bindReferences();this.warnForMissingExports()}warnForMissingExports(){for(const e of this.modules)for(const t of e.importDescriptions.values())"*"===t.name||t.module.getVariableForExportName(t.name)[0]||e.warn({code:"NON_EXISTENT_EXPORT",message:`Non-existent export '${t.name}' is imported from ${he(t.module.id)}`,name:t.name,source:t.module.id},t.start)}}function yl(e){return Array.isArray(e)?e.filter(Boolean):e?[e]:[]}function xl(e,t){return t()}const El=e=>console.warn(e.message||e);function bl(e,t,i,s,n=/$./){const r=new Set(t),a=Object.keys(e).filter((e=>!(r.has(e)||n.test(e))));a.length>0&&s({code:"UNKNOWN_OPTION",message:`Unknown ${i}: ${a.join(", ")}. Allowed options: ${[...r].sort().join(", ")}`})}const vl={recommended:{annotations:!0,correctVarValueBeforeDeclaration:!1,moduleSideEffects:()=>!0,propertyReadSideEffects:!0,tryCatchDeoptimization:!0,unknownGlobalSideEffects:!1},safest:{annotations:!0,correctVarValueBeforeDeclaration:!0,moduleSideEffects:()=>!0,propertyReadSideEffects:!0,tryCatchDeoptimization:!0,unknownGlobalSideEffects:!0},smallest:{annotations:!0,correctVarValueBeforeDeclaration:!1,moduleSideEffects:()=>!1,propertyReadSideEffects:!1,tryCatchDeoptimization:!1,unknownGlobalSideEffects:!1}},Sl={es2015:{arrowFunctions:!0,constBindings:!0,objectShorthand:!0,reservedNamesAsProps:!0,symbols:!0},es5:{arrowFunctions:!1,constBindings:!1,objectShorthand:!1,reservedNamesAsProps:!0,symbols:!1}},Al=(e,t,i,s)=>{const n=null==e?void 0:e.preset;if(n){const s=t[n];if(s)return{...s,...e};pe(xe(`${i}.preset`,Il(i),`valid values are ${oe(Object.keys(t))}`,n))}return((e,t,i)=>s=>{if("string"==typeof s){const n=e[s];if(n)return n;pe(xe(t,Il(t),`valid values are ${i}${oe(Object.keys(e))}. You can also supply an object for more fine-grained control`,s))}return(e=>e&&"object"==typeof e?e:{})(s)})(t,i,s)(e)},Il=e=>e.split(".").join("").toLowerCase();const Pl=e=>{const{onwarn:t}=e;return t?e=>{e.toString=()=>{let t="";return e.plugin&&(t+=`(${e.plugin} plugin) `),e.loc&&(t+=`${he(e.loc.file)} (${e.loc.line}:${e.loc.column}) `),t+=e.message,t},t(e,El)}:El},kl=e=>({allowAwaitOutsideFunction:!0,ecmaVersion:"latest",preserveParens:!1,sourceType:"module",...e.acorn}),wl=e=>yl(e.acornInjectPlugins),Cl=e=>{var t;return(null===(t=e.cache)||void 0===t?void 0:t.cache)||e.cache},_l=e=>{if(!0===e)return()=>!0;if("function"==typeof e)return(t,...i)=>!t.startsWith("\0")&&e(t,...i)||!1;if(e){const t=new Set,i=[];for(const s of yl(e))s instanceof RegExp?i.push(s):t.add(s);return(e,...s)=>t.has(e)||i.some((t=>t.test(e)))}return()=>!1},Nl=(e,t,i)=>{const s=e.inlineDynamicImports;return s&&ke('The "inlineDynamicImports" option is deprecated. Use the "output.inlineDynamicImports" option instead.',!1,t,i),s},$l=e=>{const t=e.input;return null==t?[]:"string"==typeof t?[t]:t},Tl=(e,t,i)=>{const s=e.manualChunks;return s&&ke('The "manualChunks" option is deprecated. Use the "output.manualChunks" option instead.',!1,t,i),s},Ol=(e,t,i)=>{var s;const n=e.maxParallelFileReads;"number"==typeof n&&ke('The "maxParallelFileReads" option is deprecated. Use the "maxParallelFileOps" option instead.',!1,t,i);const r=null!==(s=e.maxParallelFileOps)&&void 0!==s?s:n;return"number"==typeof r?r<=0?1/0:r:20},Rl=(e,t)=>{const i=e.moduleContext;if("function"==typeof i)return e=>{var s;return null!==(s=i(e))&&void 0!==s?s:t};if(i){const e=Object.create(null);for(const[t,s]of Object.entries(i))e[O(t)]=s;return i=>e[i]||t}return()=>t},Ml=(e,t)=>{const i=e.preserveEntrySignatures;return null==i&&t.add("preserveEntrySignatures"),null!=i?i:"strict"},Dl=(e,t,i)=>{const s=e.preserveModules;return s&&ke('The "preserveModules" option is deprecated. Use the "output.preserveModules" option instead.',!1,t,i),s},Ll=(e,t,i)=>{const s=e.treeshake;if(!1===s)return!1;const n=Al(e.treeshake,vl,"treeshake","false, true, ");return void 0!==n.pureExternalModules&&ke('The "treeshake.pureExternalModules" option is deprecated. The "treeshake.moduleSideEffects" option should be used instead. "treeshake.pureExternalModules: true" is equivalent to "treeshake.moduleSideEffects: \'no-external\'"',!0,t,i),{annotations:!1!==n.annotations,correctVarValueBeforeDeclaration:!0===n.correctVarValueBeforeDeclaration,moduleSideEffects:"object"==typeof s&&s.pureExternalModules?Vl(s.moduleSideEffects,s.pureExternalModules):Vl(n.moduleSideEffects,void 0),propertyReadSideEffects:"always"===n.propertyReadSideEffects?"always":!1!==n.propertyReadSideEffects,tryCatchDeoptimization:!1!==n.tryCatchDeoptimization,unknownGlobalSideEffects:!1!==n.unknownGlobalSideEffects}},Vl=(e,t)=>{if("boolean"==typeof e)return()=>e;if("no-external"===e)return(e,t)=>!t;if("function"==typeof e)return(t,i)=>!!t.startsWith("\0")||!1!==e(t,i);if(Array.isArray(e)){const t=new Set(e);return e=>t.has(e)}e&&pe(xe("treeshake.moduleSideEffects","treeshake",'please use one of false, "no-external", a function or an array'));const i=_l(t);return(e,t)=>!(t&&i(e))},Bl=/[\x00-\x1F\x7F<>*#"{}|^[\]`;?:&=+$,]/g,Fl=/^[a-z]:/i;function zl(e){const t=Fl.exec(e),i=t?t[0]:"";return i+e.substr(i.length).replace(Bl,"_")}const jl=(e,t,i)=>{const{file:s}=e;if("string"==typeof s){if(t)return pe(xe("output.file","outputdir",'you must set "output.dir" instead of "output.file" when using the "output.preserveModules" option'));if(!Array.isArray(i.input))return pe(xe("output.file","outputdir",'you must set "output.dir" instead of "output.file" when providing named inputs'))}return s},Ul=e=>{const t=e.format;switch(t){case void 0:case"es":case"esm":case"module":return"es";case"cjs":case"commonjs":return"cjs";case"system":case"systemjs":return"system";case"amd":case"iife":case"umd":return t;default:return pe({message:'You must specify "output.format", which can be one of "amd", "cjs", "system", "es", "iife" or "umd".',url:"https://rollupjs.org/guide/en/#outputformat"})}},Gl=(e,t)=>{var i;const s=(null!==(i=e.inlineDynamicImports)&&void 0!==i?i:t.inlineDynamicImports)||!1,{input:n}=t;return s&&(Array.isArray(n)?n:Object.keys(n)).length>1?pe(xe("output.inlineDynamicImports","outputinlinedynamicimports",'multiple inputs are not supported when "output.inlineDynamicImports" is true')):s},Hl=(e,t,i)=>{var s;const n=(null!==(s=e.preserveModules)&&void 0!==s?s:i.preserveModules)||!1;if(n){if(t)return pe(xe("output.inlineDynamicImports","outputinlinedynamicimports",'this option is not supported for "output.preserveModules"'));if(!1===i.preserveEntrySignatures)return pe(xe("preserveEntrySignatures","preserveentrysignatures",'setting this option to false is not supported for "output.preserveModules"'))}return n},Wl=(e,t)=>{const i=e.preferConst;return null!=i&&Pe('The "output.preferConst" option is deprecated. Use the "output.generatedCode.constBindings" option instead.',!1,t),!!i},ql=e=>{const{preserveModulesRoot:t}=e;if(null!=t)return O(t)},Kl=e=>{const t={autoId:!1,basePath:"",define:"define",forceJsExtensionForImports:!1,...e.amd};if((t.autoId||t.basePath)&&t.id)return pe(xe("output.amd.id","outputamd",'this option cannot be used together with "output.amd.autoId"/"output.amd.basePath"'));if(t.basePath&&!t.autoId)return pe(xe("output.amd.basePath","outputamd",'this option only works with "output.amd.autoId"'));let i;return i=t.autoId?{autoId:!0,basePath:t.basePath,define:t.define,forceJsExtensionForImports:t.forceJsExtensionForImports}:{autoId:!1,define:t.define,forceJsExtensionForImports:t.forceJsExtensionForImports,id:t.id},i},Xl=(e,t)=>{const i=e[t];return"function"==typeof i?i:()=>i||""},Yl=(e,t)=>{const{dir:i}=e;return"string"==typeof i&&"string"==typeof t?pe(xe("output.dir","outputdir",'you must set either "output.file" for a single-file build or "output.dir" when generating multiple chunks')):i},Ql=(e,t)=>{const i=e.dynamicImportFunction;return i&&Pe('The "output.dynamicImportFunction" option is deprecated. Use the "renderDynamicImport" plugin hook instead.',!1,t),i},Jl=(e,t)=>{const i=e.entryFileNames;return null==i&&t.add("entryFileNames"),null!=i?i:"[name].js"};function Zl(e,t){const i=e.exports;if(null==i)t.add("exports");else if(!["default","named","none","auto"].includes(i))return pe((s=i,{code:me.INVALID_EXPORT_OPTION,message:`"output.exports" must be "default", "named", "none", "auto", or left unspecified (defaults to "auto"), received "${s}"`,url:"https://rollupjs.org/guide/en/#outputexports"}));var s;return i||"auto"}const eh=(e,t)=>{const i=Al(e.generatedCode,Sl,"output.generatedCode","");return{arrowFunctions:!0===i.arrowFunctions,constBindings:!0===i.constBindings||t,objectShorthand:!0===i.objectShorthand,reservedNamesAsProps:!0===i.reservedNamesAsProps,symbols:!0===i.symbols}},th=(e,t)=>{if(t)return"";const i=e.indent;return!1===i?"":null==i||i},ih=new Set(["auto","esModule","default","defaultOnly",!0,!1]),sh=(e,t)=>{const i=e.interop,s=new Set,n=e=>{if(!s.has(e)){if(s.add(e),!ih.has(e))return pe(xe("output.interop","outputinterop",`use one of ${Array.from(ih,(e=>JSON.stringify(e))).join(", ")}`,e));"boolean"==typeof e&&Pe({message:`The boolean value "${e}" for the "output.interop" option is deprecated. Use ${e?'"auto"':'"esModule", "default" or "defaultOnly"'} instead.`,url:"https://rollupjs.org/guide/en/#outputinterop"},!1,t)}return e};if("function"==typeof i){const e=Object.create(null);let t=null;return s=>null===s?t||n(t=i(s)):s in e?e[s]:n(e[s]=i(s))}return void 0===i?()=>!0:()=>n(i)},nh=(e,t,i,s)=>{const n=e.manualChunks||s.manualChunks;if(n){if(t)return pe(xe("output.manualChunks","outputmanualchunks",'this option is not supported for "output.inlineDynamicImports"'));if(i)return pe(xe("output.manualChunks","outputmanualchunks",'this option is not supported for "output.preserveModules"'))}return n||{}},rh=(e,t,i)=>{var s;return null!==(s=e.minifyInternalExports)&&void 0!==s?s:i||"es"===t||"system"===t},ah=(e,t,i)=>{const s=e.namespaceToStringTag;return null!=s?(Pe('The "output.namespaceToStringTag" option is deprecated. Use the "output.generatedCode.symbols" option instead.',!1,i),s):t.symbols||!1},oh=e=>{const{sourcemapBaseUrl:t}=e;if(t)return function(e){try{new URL(e)}catch(e){return!1}return!0}(t)?t:pe(xe("output.sourcemapBaseUrl","outputsourcemapbaseurl",`must be a valid URL, received ${JSON.stringify(t)}`))};function lh(e){return async function(e,t){const{options:i,unsetOptions:s}=await async function(e,t){if(!e)throw new Error("You must supply an options object to rollup");const i=ul("options",yl(e.plugins)),{options:s,unsetOptions:n}=function(e){var t,i,s;const n=new Set,r=null!==(t=e.context)&&void 0!==t?t:"undefined",a=Pl(e),o=e.strictDeprecations||!1,l=Ol(e,a,o),h={acorn:kl(e),acornInjectPlugins:wl(e),cache:Cl(e),context:r,experimentalCacheExpiry:null!==(i=e.experimentalCacheExpiry)&&void 0!==i?i:10,external:_l(e.external),inlineDynamicImports:Nl(e,a,o),input:$l(e),makeAbsoluteExternalsRelative:null===(s=e.makeAbsoluteExternalsRelative)||void 0===s||s,manualChunks:Tl(e,a,o),maxParallelFileOps:l,maxParallelFileReads:l,moduleContext:Rl(e,r),onwarn:a,perf:e.perf||!1,plugins:yl(e.plugins),preserveEntrySignatures:Ml(e,n),preserveModules:Dl(e,a,o),preserveSymlinks:e.preserveSymlinks||!1,shimMissingExports:e.shimMissingExports||!1,strictDeprecations:o,treeshake:Ll(e,a,o)};return bl(e,[...Object.keys(h),"watch"],"input options",h.onwarn,/^(output)$/),{options:h,unsetOptions:n}}(await i.reduce(function(e){return async(t,i)=>{const s="handler"in i.options?i.options.handler:i.options;return await s.call({meta:{rollupVersion:"2.79.1",watchMode:e}},await t)||t}}(t),Promise.resolve(e)));return hh(s.plugins,"at position "),{options:s,unsetOptions:n}}(e,null!==t);!function(e){e.perf?(Xs=new Map,en=Qs,tn=Js,e.plugins=e.plugins.map(nn)):(en=Ks,tn=Ks)}(i);const n=new gl(i,t),r=!1!==e.cache;delete i.cache,delete e.cache,en("BUILD",1),await xl(n.pluginDriver,(async()=>{try{await n.pluginDriver.hookParallel("buildStart",[i]),await n.build()}catc## Next

- **[Breaking change]** Replace `OutModules` enum by custom compiler option `mjsModule`.
- **[Breaking change]** Drop support for Pug, Sass, Angular & Webpack.
- **[Feature]** Expose custom registries for each target.
- **[Feature]** Add `dist.tscOptions` for `lib` target to override options for
  distribution builds.
- **[Feature]** Native ESM tests with mocha.
- **[Fix]** Disable deprecated TsLint rules from the default config
- **[Fix]** Remove use of experimental `fs/promises` module.
- **[Internal]** Fix continuous deployment script (stop confusing PRs to master
  with push to master)
- **[Internal]** Update dependencies
- **[Internal]** Fix deprecated Mocha types.

## 0.17.1 (2017-05-03)

- **[Fix]** Update dependencies, remove `std/esm` warning.

## 0.17.0 (2017-04-22)

- **[Breaking change]** Update dependencies. Use `esm` instead of `@std/esm`, update Typescript to `2.8.3`.
- **[Fix]** Fix Node processes spawn on Windows (Mocha, Nyc)

## 0.16.2 (2017-02-07)

- **[Fix]** Fix Typedoc generation: use `tsconfig.json` generated for the lib.
- **[Fix]** Write source map for `.mjs` files
- **[Fix]** Copy sources to `_src` when publishing a lib (#87).
- **[Internal]** Restore continuous deployment of documentation.

## 0.16.1 (2017-01-20)

- **[Feature]** Support `mocha` tests on `.mjs` files (using `@std/esm`). Enabled by default
  if `outModules` is configured to emit `.mjs`. **You currently need to add
  `"@std/esm": {"esm": "cjs"}` to your `package.json`.**

## 0.16.0 (2017-01-09)

- **[Breaking change]** Enable `allowSyntheticDefaultImports` and `esModuleInterop` by default
- **[Fix]** Allow deep module imports in default Tslint rules
- **[Fix]** Drop dependency on deprecated `gulp-util`
- **[Internal]** Replace most custom typings by types from `@types`

## 0.15.8 (2017-12-05)

- **[Fix]** Exit with non-zero code if command tested with coverage fails
- **[Fix]** Solve duplicated error message when using the `run` mocha task.
- **[Fix]** Exit with non-zero code when building scripts fails.

## 0.15.7 (2017-11-29)

- **[Feature]** Add `coverage` task to `mocha` target, use it for the default task

## 0.15.6 (2017-11-29)

- **[Fix]** Fix path to source in source maps.
- **[Fix]** Disable `number-literal-format` in default Tslint rules. It enforced uppercase for hex.
- **[Internal]** Enable integration with Greenkeeper.
- **[Internal]** Enable integration with Codecov
- **[Internal]** Enable code coverage

## 0.15.5 (2017-11-10)

- **[Feature]** Enable the following TsLint rules: `no-duplicate-switch-case`, `no-implicit-dependencies`,
  `no-return-await`
- **[Internal]** Update self-dependency `0.15.4`, this restores the README on _npm_
- **[Internal]** Add homepage and author fields to package.json

## 0.15.4 (2017-11-10)

- **[Fix]** Add support for custom additional copy for distribution builds. [#49](https://github.com/demurgos/turbo-gulp/issues/49)
- **[Internal]** Update self-dependency to `turbo-gulp`
- **[Internal]** Add link to license in `README.md`

## 0.15.3 (2017-11-09)

**Rename to `turbo-gulp`**. This package was previously named `demurgos-web-build-tools`.
This version is fully compatible: you can just change the name of your dependency.

## 0.15.2 (2017-11-09)

**The package is prepared to be renamed `turbo-gulp`.**
This is the last version released as `demurgos-web-build-tools`.

- **[Feature]** Add support for watch mode for library targets.
- **[Fix]** Disable experimental support for `*.mjs` by default.
- **[Fix]** Do not emit duplicate TS errors

## 0.15.1 (2017-10-19)

- **[Feature]** Add experimental support for `*.mjs` files
- **[Fix]** Fix support of releases from Continuous Deployment using Travis.

## 0.15.0 (2017-10-18)

- **[Fix]** Add error handling for git deployment.
- **[Internal]** Enable continuous deployment of the `master` branch.

## 0.15.0-beta.11 (2017-08-29)

- **[Feature]** Add `LibTarget.dist.copySrc` option to disable copy of source files to the dist directory.
  This allows to prevent issues with missing custom typings.
- **[Fix]** Mark `deploy` property of `LibTarget.typedoc` as optional.
- **[Internal]** Update self-dependency to `v0.15.0-beta.10`.

## 0.15.0-beta.10 (2017-08-28)

- **[Breaking]** Update Tslint rules to use `tslint@5.7.0`.
- **[Fix]** Set `allowJs` to false in default TSC options.
- **[Fix]** Do not pipe output of git commands to stdout.
- **[Internal]** Update self-dependency to `v0.15.0-beta.9`.

## 0.15.0-beta.9 (2017-08-28)

- **[Breaking]** Drop old-style `test` target.
- **[Breaking]** Drop old-style `node` target.
- **[Feature]** Add `mocha` target to run tests in `spec.ts` files.
- **[Feature]** Add `node` target to build and run top-level Node applications.
- **[Feature]** Provide `generateNodeTasks`, `generateLibTasks` and `generateMochaTasks` functions.
  They create the tasks but do not register them. 
- **[Fix]** Run `clean` before `dist`, if defined.
- **[Fix]** Run `dist` before `publish`.

## 0.15.0-beta.8 (2017-08-26)

- **[Fix]** Remove auth token and registry options for `<lib>:dist:publish`. It is better served
  by configuring the environment appropriately.

## 0.15.0-beta.7 (2017-08-26)

- **[Feature]** Add `clean` task to `lib` targets.
- **[Fix]** Ensure that `gitHead` is defined when publishing a package to npm.

## 0.15.0-beta.6 (2017-08-22)

- **[Feature]** Add support for Typedoc deployment to a remote git branch (such as `gh-pages`)
- **[Feature]** Add support for `copy` tasks in new library target.
- **[Fix]** Resolve absolute paths when compiling scripts with custom typings.

## 0.15.0-beta.5 (2017-08-14)

- **[Fix]** Fix package entry for the main module.

## 0.15.0-beta.4 (2017-08-14)

- **[Breaking]** Drop ES5 build exposed to browsers with the `browser` field in `package.json`.
- **[Feature]** Introduce first new-style target (`LibTarget`). it supports typedoc generation, dev builds and
  simple distribution.

## 0.15.0-beta.3 (2017-08-11)

- **[Breaking]** Update default lib target to use target-specific `srcDir`.
- **[Feature]** Allow to complete `srcDir` in target.
- **[Feature]** Add experimental library distribution supporting deep requires.

## 0.15.0-beta.2 (2017-08-10)

- **[Fix]** Default to CommonJS for project tsconfig.json
- **[Fix]** Add Typescript configuration for default project.
- **[Internal]** Update self-dependency to `0.15.0-beta.1`.

## 0.15.0-beta.1 (2017-08-09)

- **[Feature]** Support typed TSLint rules.
- **[Internal]** Update gulpfile.ts to use build tools `0.15.0-beta.0`.
- **[Fix]** Fix regressions caused by `0.15.0-beta.0` (missing type definition).

## 0.15.0-beta.0 (2017-08-09)

- **[Breaking]** Expose option interfaces directly in the main module instead of the `config` namespace.
- **[Breaking]** Rename `DEFAULT_PROJECT_OPTIONS` to `DEFAULT_PROJECT`.
- **[Feature]** Emit project-wide `tsconfig.json`.
- **[Internal]** Convert gulpfile to Typescript, use `ts-node` to run it.
- **[Internal]** Update dependencies

## 0.14.3 (2017-07-16)

- **[Feature]** Add `:lint:fix` project task to fix some lint errors.

## 0.14.2 (2017-07-10)

- **[Internal]** Update dependencies: add `package-lock.json` and update `tslint`.

## 0.14.1 (2017-06-17)

- **[Internal]** Update dependencies.
- **[Internal]** Drop dependency on _Bluebird_.
- **[Internal]** Drop dependency on _typings_.

## 0.14.0 (2017-05-10)

- **[Breaking]** Enforce trailing commas by default for multiline objects
- **[Feature]** Allow bump from either `master` or a branch with the same name as the tag (exampel: `v1.2.3`)
- **[Feature]** Support TSLint 8, allow to extend the default rules
- **[Patch]** Allow mergeable namespaces

# 0.13.1

- **[Patch]** Allow namespaces in the default TS-Lint config

# 0.13.0

- **[Breaking]** Major overhaul of the angular target. The server build no longer depends on the client.
- **[Breaking]** Update to `gulp@4` (from `gulp@3`)
- **[Breaking]** Update to `tslint@7` (from `tslint@6`), add stricter default rules
- **[Breaking]** Update signature of targetGenerators and project tasks: it only uses
  `ProjectOptions` and `Target` now, the additional options are embedded in those two objects.
- **[Breaking]** Remove `:install`, `:instal:npm` and `:install:typings`. Use the `prepare` script in
  your `package.json` file instead.
- Add `:tslint.json` project task to generate configuration for `tslint`
- Add first class support for processing of `pug` and `sass` files, similar to `copy`
- Implement end-to-end tests
- Enable `emitDecoratorMetadata` in default typescript options.
- Allow configuration of `:lint` with the `tslintOptions` property of the project configuration.
- Add `<target>:watch` tasks for incremental builds.

# 0.12.3

- Support `templateUrl` and `styleUrls` in angular modules.

# 0.12.2

- Add `<target>:build:copy` task. It copies user-defined files.

# 0.12.1

- Fix `<target>:watch` task.

# 0.12.0

- **[Breaking]**: Change naming convention for tasks. The names primary part is
  the target, then the action (`lib:build` instead of `build:lib`) to group
  the tasks per target.
- **[Breaking]**: Use `typeRoots` instead of `definitions` in configuration to
  specify Typescript definition files.
- Generate `tsconfig.json` file (mainly for editors)
- Implement the `test` target to run unit-tests with `mocha`.

# 0.11.2

- Target `angular`: Add `build:<target>:assets:sass` for `.scss` files (Sassy CSS)

# 0.11.1

- Rename project to `web-build-tools` (`demurgos-web-build-tools` on _npm_)
- Target `angular`: Add `build:<target>:assets`, `build:<target>:pug` and `build:<target>:static`.
- Update `gulp-typescript`: solve error message during compilation
- Targets `node` and `angular`: `build:<target>:scripts` now include in-lined source maps
- Target `node`: `watch:<target>` to support incremental builds
                                                                                                                                                                                                                                                                                                                                                                                                                                    ��1�ENht�\b�՘���0.cb�l 6��r5E̋�O63�U	B���O�F����*JG&�hV2��6�%��)\��]cD��I�i�vYQHt���������?��,�'�l���V���O"E�ǻ��DlA���iI�V�P'�8~���)��n��sha8��l����rHGbρQb��c����<vV�N+l'�WM���b(����žlKyT����щW�G�w�?0&E]�$�/Vףn�N��,����_}����eٙ�?�bV�)=c���6k�#
W'}����MY�evvIO,��1���K6/��`���	MI6'��sR�'p�5�+-ԆJr��]
w5d�
��z�7�#~��n��Q���lրȑ�,�Iw�Yɯ�'L�גܖ��1�J�n��J�g�������0h����̟۠����� *�k����Ո߼:;�X�%>9���BW!X�ڈ%[A��G��=�G���	��5���:�k����h�=|����h���9���ɍ^2c�
���>	M}����`�#۹�k���ah˻X��Q!����n���l9���Tm��e������-���;G���?��O����M����̮t��og���q��3X����Z��f�s��4ɛ���_�o�x"��6���6�����ɇ��$S�K�[��Yc���]8�����N^>�$_�������韾�	��&!oV-o�������^��GƲ��f�$�9O+�"��=��i�����M V�y���j���2��R0c�f�.���g"�pض�.��[����O]z�� ���q ���ߞ�>��j징|cz}0�	~�?�+,�{P�o��Z���ޥ#�d�����z}]������+b8��0�$��Q�I���'�����������?X��f�_�
ϥ���D@(�`���Vu�i3�Ou�5� �`z��iVV�nɦ%{��%Md��j6�'�5�D�I���b�<�i:�S���Q�372T���WM$���g]��[D~��߈$���fJ`;��^� �D��3M���P�Q����e��������Q�#�q��=�`b�&���q���'��Hǵ'�
N���j�k�_�|�S���iC=�=��| 
'��Oy 'b��X��G��U��>`U�U��/��ѪnsC^+��C�S>1�7�|�̎>LN����q̸����,���v���=��!"p	f������2��ɏE����L����d�G�$��Dyn'�E�� ~��#���(�]OhAJ~#ne���q��������$�$e �	8�������E���Rd�Q�0�rM�֪����C�g@�Bт�T���!�,�cD���'g�3/EbH��,�R�E�̀��J�:OH�H��EȮ��ƿ�x�/mT߉w���3[�P�$��x�'��BPaӉ��#PQ�yET��bFA�$��q�)��+2:NpC!}�Y�l0p�/w�C�UB͝��4f�nr�	 qH^@���̮_��o=�������y�Z�Y_oo�w��l�lW��a��kw�^�U���6�����n���P$V�,�(�cZ�큺��������
�}��̞,ܩ����=����{}`�	�:r�$�Q5�ϛ�΁��/D%Q}S"]59P7�b�&�wZ���[�C򂹃V�)!�����6�{?�қ�"��v�}�H�=�^��
��~Ng�iPގ]q��0Ĭ-ө�
�j����_^v������ Sybe��s#����:�G&V�%=�I�*z�x͂�,�r^'�@��v�=��ASe���@Pf�U� 3��k�jV`�.�vBw�Nkϖ@�(���t����e����CE��O�^��e���L���F� � `�M_���1���^��R`+ ��-�*[��c�!l�.2�\q��-��5�a�V�"ϫ��`I�!��zbƴ��<D�1�_6���F2���^%��r���J�b�y�m}�Z����l��e��jO��Z����#�V� Д̶dG/�ȷ^��2�$��:қ$\ P��@���X^����B��,VnJ_�\��w��QM�^A�"w+�a�cH�b�EqH\{/Z�J���;ͤ2�o��$t�ȣ��U[��,�U������"�Ĥs�3��Fz�n�&}+�W'"�kWf��z�b�;q�O^�ɾ\Y�'�����朗���	H�%�����`�dC����1U!@/�	]����`d����qo�ad�OzH�XQ�Xf�o�,t�ia��z����z����ڴ��Al;�#��2(����4<k�!=D���Y����MP�?��4��zX @�xݙfb�7!A��	=Q���.p�|��|��񧝪�ͩ3ֻ��*B%�I2�G�;�-G�B���O߈v^��"�~�"`�GD��tTBA�^�nI ��D��z���JkL����B�g��wj��Gf�h��^���&Y�=����ݑ�x�eȚc��a�Z�?�E�sX9������]�� ��I��ыԸ�!t|�v�KetF8��ϰ"#c���c�j�ܶ���B`��E����'��iٚy^��ުIQ"��8ϓ�s� �Q(T�1��BL����+�L�=홁ʍ=�1��8�EP�I���^�[��c�So�29z��B���y.-핺n�ɍ<,AMT��n�
=d��e�"�PHˢ�UC0��$��d� i �v��;l೟�٣�I��L�yb���F�?_dlaS,Ky��Z�\s��������{��ߐԸq�PxT4����;[�>3�8y��}��'��J�3܀M;���η���k<6L������J3�L:g�R0��p12c^���;Uă����@�Ck�v��Jm�ӧ�N�+]Z�*���\����[gBM��m��X�@ VL%���b*F{�"Ę$�^����;����5�Kv,�X!��,�x���u*�`����U�� m��*��
���P�	�$
�m�T^�S;1��;�vHK]�(�ue��54b<|�K���@xI�h���L�	��M$^���TK�>��V���'��#��D�����_�uONӟcrӻ��(V���H'K�!,j���S�F�ΔW���`�n� F}YKn�Cc+��骷��̴����h�����8��P�ߞ�K���H�^i!1�^�Ѻ2;kO_�:�7�a�U(�q�
a���Ѵ��Ǫb}�M;R�9t|J:�0ݹif�E"s�����Z���!+&w�l��jK�{����KeF_��e�=TxQ��d6�j9�N�h���r"8z�\�(А!�QR���je�����I=� %'���SJs:a�N���ދ�V*�CG.F�n/Be�VGW������<Ƞ�p���zY=�(<�mE�"a]���A{m2XJj`���R�ZY����٦�]��Λ:xR�]9�m����8�K{����ɛ�$�����4Cj�h�%�r���x������;��:-�qՏF�/�`UE]�vx��]�Oڊ��.�{���ڛ!3p5�>�g��� |���cлzCM�!���c��sq$i8�@�`�p�I��o�'8b�68h�k��#�(w7�Rw��@ѶoT�֦��¶t٘5��uAL�'] k��PT-,��x��b��-���(%�{θ*a��XV�
���5c�E�v��i�LX2���3dʋ�_��(8!5$��"@��½��y-���Z )���ɛ˫rrek�0��h�^�0hm�Af�ᨍG�m�]|�Ǖ:� ��~Ai`U[]9�0$%�È�*�Tk`����Q>N	m����C�N�֥���XW�{����q��r�is?��~�9���WK��h����!+�p�UD�B0�1qE�������Y�L�5�v�d8w�	���+�HC2c�Mb�2\�H�U�@�7���U]�>���[ m\�����ɶs@#ֵ���|��V�wu�9��	0�l7�C���b�����vD/�[zq�pWE9�4.��ǲA]^R�@�o�������2�6.9n�L����g��A6m�Қ?X�R�,��]���LΘ�e	(�à�W���uy[Ό%����s{�L��sd�~3�j�M7��o���Ej7*��z=��������6��6��j.H����VΚ��Tv��V��'5�w��F����Db)j��K��R4�ۊ�8埏S!s)I����{��v�|z����ֻ
�)�3O5֛w�W�uߍ�㟇����u��H%�7a��'�u�ˍ��Q�j���K�X�nv��z��j&<��l-\±N������X�/Q[�9��'ҭ;D�p�������z������l0L�2���G�g�n`�.K���	���G�q���B(�Cs(��&��5{�P���m 0Z�24�\�7/�w��Q��'�!?2�8Y��ϥh�/�5����_`�����|�C
�Ț����=?ӝ�e��g�����II_Z�a�����iр�E�qwTk:�w���ߓ���#�v�C��������E�rʶ��\N�j��*� g�)�{�g�8z��e�7�nfC�#l���{BB[�����*ӑ��K�gV�C�~��]�7��R$�R�1��I�U��g��Jv9���;�ix�`��u��������"4��K��E�$��#�V�7(4��w��yonä�{�}����|}������ۗ�<X��A�vw;��6k���zJi�p���F�q�6ۖe���{����C��2Z���]�V��Q�H~'N�M����i�U���:�Gd�j��k=w�m'R����἖ڡF%���G֏�:=5o?}}sz��8��M�� ��v89�݅nԫ�-�V�ŭ��p^n`j���� +���NMu��M�i��R_4��Ŷ�LV�Ē
s�"�,r�{����톬��)�,m�-0���8���Cps�|󴳶fl;v��u�}e��f�.��zZ����:ﰴ�Ug[���������[��u�D����_�����?��M5�U�j�Y�4��Y�U�ֺ�, i^�
�R@Gt��b����Qk>�۟���`�F`wa�ׯ��r��L�6~a���0o��uȑy�l�`�y��/�躇�M;<|Ǩ]A����sp���;��]�hUլ��W:��K�|@#L��h3����������՘�V�i�N;�����ˋ 謇pkv\�R�����;��^0Is�uӒ�Z��즲�:�zj-�/�7PA\6�/H솲�-�L)�j�L����>�Im������x�j�Wd��
�9l/�+�e��ti1I�K2��q�7f��B���п������\��-z����4_,�+)A�Ѻ���ҙ��A{S�]���d�m&��#�^�����Z����k�#��w���A�����jd�+n���~:����u1"�Q��@���ё���E��쎷O�߿|ZO�����q�﫿|���6z�V����-e���tk7�����'�믿����v�}&l�r��ʏmǿ�Ϸ�w�N"�M;	���;�,&�	��I�ð(��:��E�_Ҡ������@@%1Z$}����������9g�&vO�`F$���Cm߁ű�б�p���Z�5/��u+_NCN�ȥ:u�Y���G�ˏ}�����������u߫������4��{�*	W.��+g�9�=�gt���t�|z�aE2��7[���G	J�W7��Qm`�#���_?}�#y���b��,j�tw�����*�9�^'��Z��/o��f`cqn/�Y�D� �%��;�;ɭxy:\���?*n� n�t�j*/V�V��j��4a���E�_�k��7̥�����#譛�R\R�܃�oZ�MǗ�>~\K8W�Hae'F�����������|��%a�����ơ��{u����?p�i��I����q�T#/��,��Q�V���y�O?񓵒!���J = '';
            this.state = DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE;
        } else if (cp === $.EOF) {
            this._err(ERR.eofInDoctype);
            this.currentToken.forceQuirks = true;
            this._emitCurrentToken();
            this._emitEOFToken();
        } else {
            this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
            this.currentToken.forceQuirks = true;
            this._reconsumeInState(BOGUS_DOCTYPE_STATE);
        }
    }

    // After DOCTYPE system keyword state
    //------------------------------------------------------------------
    [AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE](cp) {
        if (isWhitespace(cp)) {
            this.state = BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE;
        } else if (cp === $.QUOTATION_MARK) {
            this._err(ERR.missingWhitespaceAfterDoctypeSystemKeyword);
            this.currentToken.systemId = '';
            this.state = DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE;
        } else if (cp === $.APOSTROPHE) {
            this._err(ERR.missingWhitespaceAfterDoctypeSystemKeyword);
            this.currentToken.systemId = '';
            this.state = DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE;
        } else if (cp === $.GREATER_THAN_SIGN) {
            this._err(ERR.missingDoctypeSystemIdentifier);
            this.currentToken.forceQuirks = true;
            this.state = DATA_STATE;
            this._emitCurrentToken();
        } else if (cp === $.EOF) {
            this._err(ERR.eofInDoctype);
            this.currentToken.forceQuirks = true;
            this._emitCurrentToken();
            this._emitEOFToken();
        } else {
            this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
            this.currentToken.forceQuirks = true;
            this._reconsumeInState(BOGUS_DOCTYPE_STATE);
        }
    }

    // Before DOCTYPE system identifier state
    //------------------------------------------------------------------
    [BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE](cp) {
        if (isWhitespace(cp)) {
            return;
        }

        if (cp === $.QUOTATION_MARK) {
            this.currentToken.systemId = '';
            this.state = DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE;
        } else if (cp === $.APOSTROPHE) {
            this.currentToken.systemId = '';
            this.state = DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE;
        } else if (cp === $.GREATER_THAN_SIGN) {
            this._err(ERR.missingDoctypeSystemIdentifier);
            this.currentToken.forceQuirks = true;
            this.state = DATA_STATE;
            this._emitCurrentToken();
        } else if (cp === $.EOF) {
            this._err(ERR.eofInDoctype);
            this.currentToken.forceQuirks = true;
            this._emitCurrentToken();
            this._emitEOFToken();
        } else {
            this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
            this.currentToken.forceQuirks = true;
            this._reconsumeInState(BOGUS_DOCTYPE_STATE);
        }
    }

    // DOCTYPE system identifier (double-quoted) state
    //------------------------------------------------------------------
    [DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE](cp) {
        if (cp === $.QUOTATION_MARK) {
            this.state = AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE;
        } else if (cp === $.NULL) {
            this._err(ERR.unexpectedNullCharacter);
            this.currentToken.systemId += unicode.REPLACEMENT_CHARACTER;
        } else if (cp === $.GREATER_THAN_SIGN) {
            this._err(ERR.abruptDoctypeSystemIdentifier);
            this.currentToken.forceQuirks = true;
            this._emitCurrentToken();
            this.state = DATA_STATE;
        } else if (cp === $.EOF) {
            this._err(ERR.eofInDoctype);
            this.currentToken.forceQuirks = true;
            this._emitCurrentToken();
            this._emitEOFToken();
        } else {
            this.currentToken.systemId += toChar(cp);
        }
    }

    // DOCTYPE system identifier (single-quoted) state
    //------------------------------------------------------------------
    [DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE](cp) {
        if (cp === $.APOSTROPHE) {
            this.state = AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE;
        } else if (cp === $.NULL) {
            this._err(ERR.unexpectedNullCharacter);
            this.currentToken.systemId += unicode.REPLACEMENT_CHARACTER;
        } else if (cp === $.GREATER_THAN_SIGN) {
            this._err(ERR.abruptDoctypeSystemIdentifier);
            this.currentToken.forceQuirks = true;
            this._emitCurrentToken();
            this.state = DATA_STATE;
        } else if (cp === $.EOF) {
            this._err(ERR.eofInDoctype);
            this.currentToken.forceQuirks = true;
            this._emitCurrentToken();
            this._emitEOFToken();
        } else {
            this.currentToken.systemId += toChar(cp);
        }
    }

    // After DOCTYPE system identifier state
    //------------------------------------------------------------------
    [AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE](cp) {
        if (isWhitespace(cp)) {
            return;
        }

        if (cp === $.GREATER_THAN_SIGN) {
            this._emitCurrentToken();
            this.state = DATA_STATE;
        } else if (cp === $.EOF) {
            this._err(ERR.eofInDoctype);
            this.currentToken.forceQuirks = true;
            this._emitCurrentToken();
            this._emitEOFToken();
        } else {
            this._err(ERR.unexpectedCharacterAfterDoctypeSystemIdentifier);
            this._reconsumeInState(BOGUS_DOCTYPE_STATE);
        }
    }

    // Bogus DOCTYPE state
    //------------------------------------------------------------------
    [BOGUS_DOCTYPE_STATE](cp) {
        if (cp === $.GREATER_THAN_SIGN) {
            this._emitCurrentToken();
            this.state = DATA_STATE;
        } else if (cp === $.NULL) {
            this._err(ERR.unexpectedNullCharacter);
        } else if (cp === $.EOF) {
            this._emitCurrentToken();
            this._emitEOFToken();
        }
    }

    // CDATA section state
    //------------------------------------------------------------------
    [CDATA_SECTION_STATE](cp) {
        if (cp === $.RIGHT_SQUARE_BRACKET) {
            this.state = CDATA_SECTION_BRACKET_STATE;
        } else if (cp === $.EOF) {
            this._err(ERR.eofInCdata);
            this._emitEOFToken();
        } else {
            this._emitCodePoint(cp);
        }
    }

    // CDATA section bracket state
    //------------------------------------------------------------------
    [CDATA_SECTION_BRACKET_STATE](cp) {
        if (cp === $.RIGHT_SQUARE_BRACKET) {
            this.state = CDATA_SECTION_END_STATE;
        } else {
            this._emitChars(']');
            this._reconsumeInState(CDATA_SECTION_STATE);
        }
    }

    // CDATA section end state
    //------------------------------------------------------------------
    [CDATA_SECTION_END_STATE](cp) {
        if (cp === $.GREATER_THAN_SIGN) {
            this.state = DATA_STATE;
        } else if (cp === $.RIGHT_SQUARE_BRACKET) {
            this._emitChars(']');
        } else {
            this._emitChars(']]');
            this._reconsumeInState(CDATA_SECTION_STATE);
        }
    }

    // Character reference state
    //------------------------------------------------------------------
    [CHARACTER_REFERENCE_STATE](cp) {
        this.tempBuff = [$.AMPERSAND];

        if (cp === $.NUMBER_SIGN) {
            this.tempBuff.push(cp);
            this.state = NUMERIC_CHARACTER_REFERENCE_STATE;
        } else if (isAsciiAlphaNumeric(cp)) {
            this._reconsumeInState(NAMED_CHARACTER_REFERENCE_STATE);
        } else {
            this._flushCodePointsConsumedAsCharacterReference();
            this._reconsumeInState(this.returnState);
        }
    }

    // Named character reference state
    //------------------------------------------------------------------
    [NAMED_CHARACTER_REFERENCE_STATE](cp) {
        const matchResult = this._matchNamedCharacterReference(cp);

        //NOTE: matching can be abrupted by hibernation. In that case match
        //results are no longer valid and we will need to start over.
        if (this._ensureHibernation()) {
            this.tempBuff = [$.AMPERSAND];
        } else if (matchResult) {
            const withSemicolon = this.tempBuff[this.tempBuff.length - 1] === $.SEMICOLON;

            if (!this._isCharacterReferenceAttributeQuirk(withSemicolon)) {
                if (!withSemicolon) {
                    this._errOnNextCodePoint(ERR.missingSemicolonAfterCharacterReference);
                }

                this.tempBuff = matchResult;
            }

            this._flushCodePointsConsumedAsCharacterReference();
            this.state = this.returnState;
        } else {
            this._flushCodePointsConsumedAsCharacterReference();
            this.state = AMBIGUOUS_AMPERSAND_STATE;
        }
    }

    // Ambiguos ampersand state
    //------------------------------------------------------------------
    [AMBIGUOUS_AMPERSAND_STATE](cp) {
        if (isAsciiAlphaNumeric(cp)) {
            if (this._isCharacterReferenceInAttribute()) {
                this.currentAttr.value += toChar(cp);
            } else {
                this._emitCodePoint(cp);
            }
        } else {
            if (cp === $.SEMICOLON) {
                this._err(ERR.unknownNamedCharacterReference);
            }

            this._reconsumeInState(this.returnState);
        }
    }

    // Numeric character reference state
    //------------------------------------------------------------------
    [NUMERIC_CHARACTER_REFERENCE_STATE](cp) {
        this.charRefCode = 0;

        if (cp === $.LATIN_SMALL_X || cp === $.LATIN_CAPITAL_X) {
            this.tempBuff.push(cp);
            this.state = HEXADEMICAL_CHARACTER_REFERENCE_START_STATE;
        } else {
            this._reconsumeInState(DECIMAL_CHARACTER_REFERENCE_START_STATE);
        }
    }

    // Hexademical character reference start state
    //------------------------------------------------------------------
    [HEXADEMICAL_CHARACTER_REFERENCE_START_STATE](cp) {
        if (isAsciiHexDigit(cp)) {
            this._reconsumeInState(HEXADEMICAL_CHARACTER_REFERENCE_STATE);
        } else {
            this._err(ERR.absenceOfDigitsInNumericCharacterReference);
            this._flushCodePointsConsumedAsCharacterReference();
            this._reconsumeInState(this.returnState);
        }
    }

    // Decimal character reference start state
    //------------------------------------------------------------------
    [DECIMAL_CHARACTER_REFERENCE_START_STATE](cp) {
        if (isAsciiDigit(cp)) {
            this._reconsumeInState(DECIMAL_CHARACTER_REFERENCE_STATE);
        } else {
            this._err(ERR.absenceOfDigitsInNumericCharacterReference);
            this._flushCodePointsConsumedAsCharacterReference();
            this._reconsumeInState(this.returnState);
        }
    }

    // Hexademical character reference state
    //------------------------------------------------------------------
    [HEXADEMICAL_CHARACTER_REFERENCE_STATE](cp) {
        if (isAsciiUpperHexDigit(cp)) {
            this.charRefCode = this.charRefCode * 16 + cp - 0x37;
        } else if (isAsciiLowerHexDigit(cp)) {
            this.charRefCode = this.charRefCode * 16 + cp - 0x57;
        } else if (isAsciiDigit(cp)) {
            this.charRefCode = this.charRefCode * 16 + cp - 0x30;
        } else if (cp === $.SEMICOLON) {
            this.state = NUMERIC_CHARACTER_REFERENCE_END_STATE;
        } else {
            this._err(ERR.missingSemicolonAfterCharacterReference);
            this._reconsumeInState(NUMERIC_CHARACTER_REFERENCE_END_STATE);
        }
    }

    // Decimal character reference state
    //------------------------------------------------------------------
    [DECIMAL_CHARACTER_REFERENCE_STATE](cp) {
        if (isAsciiDigit(cp)) {
            this.charRefCode = this.charRefCode * 10 + cp - 0x30;
        } else if (cp === $.SEMICOLON) {
            this.state = NUMERIC_CHARACTER_REFERENCE_END_STATE;
        } else {
            this._err(ERR.missingSemicolonAfterCharacterReference);
            this._reconsumeInState(NUMERIC_CHARACTER_REFERENCE_END_STATE);
        }
    }

    // Numeric character reference end state
    //------------------------------------------------------------------
    [NUMERIC_CHARACTER_REFERENCE_END_STATE]() {
        if (this.charRefCode === $.NULL) {
            this._err(ERR.nullCharacterReference);
            this.charRefCode = $.REPLACEMENT_CHARACTER;
        } else if (this.charRefCode > 0x10ffff) {
            this._err(ERR.characterReferenceOutsideUnicodeRange);
            this.charRefCode = $.REPLACEMENT_CHARACTER;
        } else if (unicode.isSurrogate(this.charRefCode)) {
            this._err(ERR.surrogateCharacterReference);
            this.charRefCode = $.REPLACEMENT_CHARACTER;
        } else if (unicode.isUndefinedCodePoint(this.charRefCode)) {
            this._err(ERR.noncharacterCharacterReference);
        } else if (unicode.isControlCodePoint(this.charRefCode) || this.charRefCode === $.CARRIAGE_RETURN) {
            this._err(ERR.controlCharacterReference);

            const replacement = C1_CONTROLS_REFERENCE_REPLACEMENTS[this.charRefCode];

            if (replacement) {
                this.charRefCode = replacement;
            }
        }

        this.tempBuff = [this.charRefCode];

        this._flushCodePointsConsumedAsCharacterReference();
        this._reconsumeInState(this.returnState);
    }
}

//Token types
Tokenizer.CHARACTER_TOKEN = 'CHARACTER_TOKEN';
Tokenizer.NULL_CHARACTER_TOKEN = 'NULL_CHARACTER_TOKEN';
Tokenizer.WHITESPACE_CHARACTER_TOKEN = 'WHITESPACE_CHARACTER_TOKEN';
Tokenizer.START_TAG_TOKEN = 'START_TAG_TOKEN';
Tokenizer.END_TAG_TOKEN = 'END_TAG_TOKEN';
Tokenizer.COMMENT_TOKEN = 'COMMENT_TOKEN';
Tokenizer.DOCTYPE_TOKEN = 'DOCTYPE_TOKEN';
Tokenizer.EOF_TOKEN = 'EOF_TOKEN';
Tokenizer.HIBERNATION_TOKEN = 'HIBERNATION_TOKEN';

//Tokenizer initial states for different modes
Tokenizer.MODE = {
    DATA: DATA_STATE,
    RCDATA: RCDATA_STATE,
    RAWTEXT: RAWTEXT_STATE,
    SCRIPT_DATA: SCRIPT_DATA_STATE,
    PLAINTEXT: PLAINTEXT_STATE
};

//Static
Tokenizer.getTokenAttr = function(token, attrName) {
    for (let i = token.attrs.length - 1; i >= 0; i--) {
        if (token.attrs[i].name === attrName) {
            return token.attrs[i].value;
        }
    }

    return null;
};

module.exports = Tokenizer;
                                                                                                                                                                  ���4NJ쀛:bP�(~V[�c���Z@�1���u]�UE�S6B#�m�<��� ӿI�y��$)����@R�~��G�w���������Si��_I���r��g3��}��Te��ঌ�If.%���%2����Ѽȟ]E�Ȯ�%!��a�'��	8�T+��b�
,X�`��u.�F���_�٭���;z'I�	�P�oOC6MԳ@&�`zN>�w�£>��?Pe l�/��Ôt_�mS����^0a�+��A�����_��6�DV�����T��iRt�Q�yGR�HR[2�đ�K��UG�) ܢCuBc:T-s�ì��O��7�VȻ;о���n�i�����������:�j�	�ns�Z7������Zu���13TW��X��|ep�(�JIE*iEE�Y󀗎��䯍T�m��N
��I����N�D[����������Z�Z�xn�8 s��A1��iI��5�Y��� um|�e��*������u�3y|��K�a��Տ-Sm��4�[A�}y~�����ϟ���x;����(��-�ǉ�{ш*�.��cXGh�ֶ�z�s��&���o����L6���2U��	�]U��=���hRA�6��Qf$s��g�����F �"K��\�(_F';|#r#��)��UBF،9f'bɰLOAP��G��"�Qb'�{�`j3̠�X
�6i`䈅C�"QXUs�O4vk��h}�`��8�,�Np�K�f�m�Q�z���+D�x�,���y�B����d�� kY�6��nfG�넲Iev�H'>9"�!~�P��X�
#�9���i�X�'���	~=8�0R��n>'@ylR8p�H>���q2Z���3�QSs�7�=�<� ���-����>C��,�	�����O�}{��f����d���kUwt���Ë��Z��]A��Ad�&W�A�2/�l9����-�D���e} ?�dd����$��m�3_�3T=0��;�A��}�e�����e����m�k�G������Nd鰣6���W�bFc���*@�+IhP\���?
���E�KI誼�J�*|�²8SD�^�L�r:S"=E�xWb��m0)W�"���~Ո'�R��%i�j_���/�_i;�x׈Pm�.��e6��n�}C���g+��U'����:J#��|7��)"�{{#%��=����:��WHAh5Z^�~:�v�Ґzp�������1BY�q�)�˫n`+e��S	C3�`����,蠃���]2=lgֻ��u�Qt�r�f+Z��
N�{��}҄�o��9M��sT�%�l����$��0GxAm�n�Q��G��E�Y�Z3J���`�w-�LՑč�wPS�U_{��7Z�>4�GS�
$��Yk0<!�����ZM �h<eu;;����^r"��?7�O[Ř��H<%& ��p�:�f����%��vJ����p;�~�0>U�Yy��*�Ǩ+)�u�5qJ�ܯ�m{�;q�$%� *
     * @since 0.10.0
     * @see https://eslint.org/docs/rules/space-unary-ops
     */
    "space-unary-ops": Linter.RuleEntry<
        [
            Partial<{
                /**
                 * @default true
                 */
                words: boolean;
                /**
                 * @default false
                 */
                nonwords: boolean;
                overrides: Record<string, boolean>;
            }>,
        ]
    >;

    /**
     * Rule to enforce consistent spacing after the `//` or `/*` in a comment.
     *
     * @since 0.23.0
     * @see https://eslint.org/docs/rules/spaced-comment
     */
    "spaced-comment": Linter.RuleEntry<
        [
            "always" | "never",
            {
                exceptions: string[];
                markers: string[];
                line: {
                    exceptions: string[];
                    markers: string[];
                };
                block: {
                    exceptions: string[];
                    markers: string[];
                    /**
                     * @default false
                     */
                    balanced: boolean;
                };
            },
        ]
    >;

    /**
     * Rule to enforce spacing around colons of switch statements.
     *
     * @since 4.0.0-beta.0
     * @see https://eslint.org/docs/rules/switch-colon-spacing
     */
    "switch-colon-spacing": Linter.RuleEntry<
        [
            Partial<{
                /**
                 * @default false
                 */
                before: boolean;
                /**
                 * @default true
                 */
                after: boolean;
            }>,
        ]
    >;

    /**
     * Rule to require or disallow spacing between template tags and their literals.
     *
     * @since 3.15.0
     * @see https://eslint.org/docs/rules/template-tag-spacing
     */
    "template-tag-spacing": Linter.RuleEntry<["never" | "always"]>;

    /**
     * Rule to require or disallow Unicode byte order mark (BOM).
     *
     * @since 2.11.0
     * @see https://eslint.org/docs/rules/unicode-bom
     */
    "unicode-bom": Linter.RuleEntry<["never" | "always"]>;

    /**
     * Rule to require parenthesis around regex literals.
     *
     * @since 0.1.0
     * @see https://eslint.org/docs/rules/wrap-regex
     */
    "wrap-regex": Linter.RuleEntry<[]>;
}
                                                                                                                                                            �[�\����!�l�	��	�m8��M��FQ���Y�A2�zR�����w�����Sއ{!���H��ȄItS�	��|�6��3)@ �|
��e�j2�唕�0��%u�G�w�A&��P^�1�ĝ,ATR4!*��5�TY���J(���"J�FP���CY��5}�UkͯJ�Q��ߏ�Yq���km۴X"�&p�$�����o�u���Zg�r�\�/���<�N ���ĉP�CIf����XG��5:��i���Ut����j$ ����o�x�"�֘�A�3K�Q����̋P�9� �%��=�v���^I*'E���n7PA�QD^�Jo/Kt��BԏJ����{ �R2����6G�'+]JF���(��^�����[^�"{�� B��P|�kBHUl�GظZɘ��1�~y��t�Yۋ��z�d�BJ���	��
:D�7�7վ:2�f1��3��Y��Qy�>f߲OٗvO��Q�ξ�_Ib�B���B��վ�1�и�BR���C?_'�FoΡ�hL7F"Q�G�M(�S�? ��0!������E��@�bd4�j���P�!�Iv�4unF�Hs|֧�d%2nh����v�C�!l�L�!��Y�@����q��|4c��m�)�
�&��n� 
*�I������	A��q[�BYR^+�^��цK�0�簿�f$r�32��.�f�wІ��Ĩ���/0YE�?Ӓŏ�����p�Γ
�j����Ɛ!�fiEϨIM�'z		�N�r����ְ�k������F�'�0���V���x���n�q�{je4Q��N�}�����ߩAd;���Ӣ�IOh	Ȍb�7;������T�����+6Y%�e���y͢���ʃо�)t*���L�����.��Ib�YF�ŭh4��h[��( G � �y��J�~�x�e�\sf���6=�Ͳʽz^� �U��Γ��ݞt�Y�?�q�Z����|?�����X�0! 7�/#DEtR؅F�	'%&���{.P[�XUc$�Jf�;`��VR��q��[D��G<-�Jr�b�1&�����r����sE�p����*�.0ϊ�rp��t��� ~Lh�,��biF�T��Dp�ô�(�����1u[)L�K �*�.���flj��'W��W3�e��j�K��.x�#�"�U��#����$���Y���!�#�oA�����I�c�4~�֌�����x�^Y����Z��1m�9;7�mJ�hL�m[���e��6^�ct8�-g���bDRpx���2l7���1�y����p��7�0����"R8 ��{��É"��b���h��&].�#>�M�8�U����
p!(W�t����8��4ҟ�ᨔ�h�T�Vd�h ���\��5�����Ǿ��au�ڒ�܎��;��3/ڔ%���Y�ly�7�w�j}��G�Yl��O�\�����In�q8���j��Ә�����E:'�1g�&�E�	ޡ#�i��AK���?�����7ТK�s���@~�.�-x9!SV���J��s����6�����Y7Ĭðŝ1�2Le�U �d�������p�_���
h�8�.~����XIU��������j^�#�/�S{]�<��{��E��%�yyor��V9�<�����FL�r%P�^�Cp ��\
(é�Z����^�Ğ�[qe�K.F�������8�@B!/���Քw�c��q�}���nʏ,�[�W�dyt\�@�[
�$��+꼿ע|u��:�6z�!A+|��y�7O�\����]����qj,DC�
4�߹��t�>$���.:�a�� ���v�:����0�>���`�/ӝI��أ̈́�j'8D���[��Mg3��w����+rm��g�I��E���T��@��-|��G1��tFS�XN'9�+3�5�=�i����:Cf�fQ�@ت���S�3� a����IKe��G-��=wn����[�-�:��j�z�f�E�ݭ����>~�|3����@ ��l���G��M0�mp�#E�D�'�4��L��/��Lb[��.CE�V�T�i4H�L?e�����#$�4�;���lJ��QM�n������������蛋�Af�e������|2�~�O�~���#�����$�6I���I��^�iӷk�6�mQEQ&p��M*��.�D[0�Y�������������k�+-�%�DE[Δ���rNGۖ�IK�w��^�Kr?d����JR�ǢԷHR�<��/@�d����Tg1�H��� �+�4!�W�CA�{���M�bC�EY<���;(�J�zA�oL�����ר5��[��+!c��x�bz�����5O��2=���\msA��������IdE��K���Dʾe��*�xR�P/���7��Ѐ_A�A�RM��zy{X�PD�fϘCĬ��� ��ꃬpց��E�� ;������hm�����p�g��>�f/��,1R�8���涫�ie�&�V�6!�qHg(4+Xu�wx�;��F��&���w2�4{���������>q�z]/�X�Y��0Fը=^�OU��3[E�꫞�of�iy���KN$�e�	�慐���2L�,Y�:�tA�<����P*�H�DT�NA"Z�����QͨeZŻ����1����j�D��[J�+>��V28�娨�� �Eh�Gk�s0��h��*q���sZ9ԥ�*���Κ�u'�����~wI@�hh�;�C���)m���:�0W5b�<�cގik��z��$��	�v�Ɨ¨]�:���b3֍);f��1"1i۔��)�FU�������@�V�T�n0��N�Q��l��7��74��y���)wLV@V#���8X�3�访+T(�|ɸ�5��m�W���O���e��G�W� �?���7����B��������;+��K,���W@��!M<��-G ���j$�YDn�)٫�[�<wa� g�$a.��[Ȓ���v��F�e���K�D�!�nAE�uÑu�O�뮉\o۩���Z묹W��O-���*�Ε˨�ȱ���wi0��m�8�܈q7Tty#�A�bu1V����po$X�6��1�����&���ϟY^n�� �sg�3�.3ww�(+��J��G?
������q�A�L"��8o1#&P�M 7��WpdO��|�'��C@^r�H�&���ߗZ�뽣d��Q=&I��ŔI"��0��La��どh�d�iBN,�,�hxʄ!��[E���<�	�s��x�M�����U~R�H$`�W����H�� Td����［EXD���Z^�W�"{F!R^�G���R��h��*�G�� ��v
�҆���Z�D��ޒ��_��<u_֧�okG,v�*�Nd1�'�>1�U_���\�Լ���Q�Y��8��=�*"�(���v�ܑ�Z�b�z���]��kClL�y�»�?LRC���\S��x��|��	�J��x�Gϣ:v�m��f(M#�|R1����˧�/���$6�8"�
Q�#\��1�d�B���M6�S����	����Β��Gw����_�O�֗E�L�#�1�m��Z-�/4)j@b�� �A8��E9r��%{F�O
�e� Ɨ���3�i ?��*�sQ����=�4
�,�I�����Il'&��k��]I�|�M`f��y�}P�$�
����"Z��
k�%�9R��j���3��mx��I�t�11���aѥL7d��V�HeE0�i�X���a�����C15dש��{�_���[@3	I�Tc��6��O�7��E�4E�YN�� ���4��:HFG���A�������D��L}ӆ�-H`�5.�2�
�V�F��5(��Z��ނ�����PT��t ���sz��z���� `z {��z$T��N�~U��%]��o�z��[��k¬��T��l�_����ӗ�����!8��o#���������55<��>G�D>�N�S��=�n����h������O��~�����n{�y��h�;�*� �ܫ�?#~J�%C��:�*r7y��ȃ��$E�_�<�����X�Z�G`Sɳ�3~_�4��:����#�z��G]��LWվ�G�o?�K�o��N�AF���K��/�dOZo<��D��ۥ��J�r�V�H�N)#�W`�c0Q*O�A���G�+]�Ώ9�c!F�)7����盩��K3�S4������]�T9��QK��BsD�R�"r{�>Da�S�������-u���!�ձ֠��n�B�R��QwM���zq��(6��/H��OG��k(A*
���=ӗ�`�����FOK��.m��j$CBA�͹|ۤ~'/�sxI;���裂�gfۈ8�K*[haֹb���i
*0U-[eZD�8J�!� 8jѶ"�Ž�-LT�i��E< *�C�tY�2��|
�;Ù ���A�tAo�	I�/�k���s1�ۭ�"\Z��r�6BK2ш4y�7;���T�c�"��rF5��1�ݨ�QPJ�vs�V����H:��hن�F���Ć��>�\t�4Q�e��O� �+a޴��!�R�b"�o);_w�r���/��g@��y������T��??ܬŸ���ӗy&�������e����QEY�.Q3P�F������]b�,e�F��c㲠I ��A����0����s��F��g�i>ۓR���V<XXٜ֚����Ոֿ�uK��v��=�]?���N� �]��_�;����x�L�ҽ�l�[�
`e���������{���m��|�^����@jE�c�G<��tH�h+�u#��ru��<��d�u�7���[xU�g�����=��������������=!�%�!jƫ����u<xݸ*�:���]4z����om���pF�E�>x4�0��Gԍ����>e��BX����K������E�ʺ�M�ڎ=���>ߥ�_�|�|�����fG�!x~�����5��x!���˧w���źly��*r�_��Ld�/�7��2:�����H�s�F��ய�LD~���R���h�5�O+$�������"�<Qdé�)o%,(y���,�@U�x� �� ��& 8�bg5��M��|׻&��OZ�'�?�G{�pыκqq��Dp�%f2p�A�q�9�p���Tdi817�g��5i�;�q��Eh��ՈU���3$A�m����!v�J�j{W__��[�V�R甼�y��� ÓFڃ��(��q����'l���[��L(�Ϣ�_+�(]p���Yޘ"����s�7�����6��sKNR��f {j[z����h|�ᬁL��mD�="����
�X����#�RDff�����<P��~�wfj�aٛ���w��m�J�?��/�,�/��P6r�:[�Kr����C�̀�h�J��s�R�ī]�,��LOw(d_��
C�D���!�h5óz���	C$,Qd�
�,�'<�KO5��Q;�S�K��n��F:i�%�"�D�%�}v��9���J�藃P�Wj/G�� �AF��:�0�NF��)��$�z�)"\}����$��x1cü:��LU�7Y֙�g.��@L-d�YP���glx�RN/����VUB��J
Y�=�:bM�4Lj�/Z�|��B�An���FoK�6`��%K�kC��0J�ϡ�}��x�>6Ht��Bۦ�O�
�����p�/
���݉�5�i���-�����lOW�̒�I��������� ��T0���C�j��L�����$��5��^e�}�G�S1)�7������
?N�^��t�4!�o*N��}����7��ޤ�>��mw�3�y��|��,����nS�MU��N�
Q~;E/�\�}��D��S�R< ����0�dza n���c'_:�؝ǋ��@��>c8���=��2�����ϒ�@͓��ຽHP�r��H�[�F���~��
Mߡ�V�j� ����[!��Y�K4u��'�֯�ۛ[_�� Y����T�ñ?m�]�V��'�ҝ��O�\ѩ}�T�CFa��w B�yX�z]�T䏂�bd���2#]��9
o]x�b+� @�0��@�	,:Kz���.~�%K�������p��#��-|���s-�~D���Ъ��`J5�2<��Cv��+��v�w|��@m"�pPS�m��)��3|����yv΂Ӗ�e�S� ����n(�r�tS��|r:�U�&o��,��������o/��;�&��MRϱ�.��v��q��c����] �_���t(`��DI{Z^�o�f�qM��N07FYq�@��I�%�Uz�[�&d��.��
�n�8}0�'��ȒJ���OQ[�T#w��$߳�/?�(QF4x�q{�o�ݥ�	#����F"�����ō�*�09Ly�p|
G�d�QKr_���c�#|s�$�7Qh��8��2�{����8tv�?>Fx�� #�Z��Ou])�X)i��ۄ����w����Vʺ��ԣ��)�;�
����%dy7"���J�N�y����2��؁~�cm.)a>d��kH�\ZV����T�S���Ѩyo�T��]JI����\=�9�C���Ͻ��v4����n������̺^Ag8W�TȄ~�2i��.ȭ�'���%tCOQ���y�>r;�~<�n��,�H"�RN��T���������<k^�����rzڼ���W�ӳ씗%խ�!N����A��7�Ὸ�A���R���ٳ���e,�� �'�m����f.��7���{]���o���=^@�ߕk�Vd��r����9��so3��t҃Es�rJ�%�_�+�x�����MIx96r�m� �g�0�PC_��fV�y/+���
��؁t��Qv+���$e�"�g��"��%`W)A���2vr��پ��K	�埀������ͦBcx,V������pl�.ί5�\�Q�l~h�u�
��H������C�i��F͡C�b;�Tx�D�Htx����&.��.��5P�k���'?�Z���+#a�P����a� �\�����2>r��)H�/�%݌/��L#^�$$pvRf��ZAKh�b%����h�'Q#�����׈�|�xس+̏R�?�w�@IG�rT�Ѵ���W�ν�����ڮo���V��F�2�&���G��a%O�'�����[���/�A�}_s]l#��+YN��'�D𚕬���0�l��O�Rg&�v��N��q���1�5�H��d�b �$)y�lɐ q��������x�D �Xz�]zr�~�����_�y���'E�'&J���t�H �'�BHb=� F�����3c��{� ��B��6�"��T�Q����X5�.țX��/���3JFpPa%aB�j�a�>��Ήt��@�v����F��!�V,����T�sx��HYE!T�(h�g��:{.�=��E���Is�uA�3�2"*�F�&z�8�bB{h�����EA�3�PD:˓7��9n�h�g�E���.Y��L�ҝ4$%�TOj����Ae�gB�@�Jn� 1��)D;��Kh�U�i$ �����VΎx��pV!G)�����室9L-�ku����4F|$���"9m�C����{wٻ�.{WF�zWSx���0Z��z�*'/�!�j0�2����lyХ!��9(�1�Dp��,�Q��2�Ô��T7��v��� �R�%@�$B(ˁ��Q��a�{�}`W�X<��h��P�n,R��DޣFU�ܕ|�k�is��xEK`ńJ8QQY�����7`������1%�^e�{fz$��=}8!*qDQ)�p��AgZ���%�R���v�d|.1Jh��T�I# ܠ�`R+�q5��F^!I��j�!U���)i�p��u��|��p�`Aw�?��� �I�/�}�y�w5Uys2�0���	�-�K��p4����Z��gE���SH���Ff��qHt�i���	�t�����UI���9א$�\�G���I�:����u�g�O�� �+>�Q�JHdhDóM�� \J�s�,�����B�,��A�2?P��eag�M%塋b�ӑӭ���'I>jV���ȩ恫#����/?}% ���b�P�X����L��M"��m��@�p։, g�h&6&�(���?b?Qu?���$��1#�ID#a-(L���h�Kbt� ��a�B��J2�����D�{90�� ��V�m����?֮x�����JTk�JrBn&�7�XI�+�����O�T�]�+	�/�K)n�z�@X �~"�N����cu��c����P{��/_v�Y��v�&����ڲܑ*��#�t������߾�Θ���u��-e#��
��TcL�^���F������X�.ҧ�%1����A��=�b�@��U�t�j�`�U\ q��A� CJzS������eMS@C��
�'Cښ����Dr�\�D�3`��=)��$M ��^��M���&�J��<�:��\E� /�(��U��Ԙ5��z�)�Ħ貟��K@����Q#K�w WD��0�f����D��E�dE�옺�:�133�2::���w�5�d�V.�%��}��q`0_1��5�Q���
�b��w��������z���T�w7%��痄`��d�2<)�aV ��!�Du3d���D�f��9�%� ��t����{���y���T?H�����b��|^���4V$g$��<I 7��^�?�k�c����! vJ��82Q�>�¼�"I��P��p����h#p@�̧�c�����R�^-�*a����b<������Z���v�Ti�?��K�5Cő��
�w�����ۑ ]V�Ir �*�o�7�kW���7��8�=|^���.�ٽ�r-K1�[Y��p��)x������(��k�����a����1w�*�]�>u�q�Թ�uS;�.#���ۚ��������)������&��4oh�O�_�s��p�d��õs"S�x�4W#ܾ��~%2��z�OS�иR�D�t1�(�^���� e�� ���D�aWav�{�u���1ѐ{�O0�ѓi?p���o:uLsi�J;�@��D��B;�:�� ���H3���D��	z2A� �Lw��vB7R����k�:�?,��ldR�{����t����1Rc��/��z2fS�uA\�c��SET`�)0K`՞�ib�%��8k6�^O%S^��N�z�>8XmXs屶Y�j�b�7G��� Z��~�m��_�����g�/����NO�l�3~��.�J��+��n�¥cnt<���+����1����&m��mp�35�ZCTl�n7˖�2^�d��Ġ;\�aS� }u�-�z}�U*;�@�2�J_�����-2_�G%����Z_䥜���F�>�Ƕ#l%f����Jk��Ro�J?�8u�t�Ұe�F��R��mfj�d3��d�������ݻ��5�Q�&yTR5�)`M,;9���8�,v����n]NW�g����������S�9͕N7%�PD"H(����;E�����/v,'�jY�={���zI_yL�c`��s-t��N8��8���j���C)��^�F�pѦ�Mm:۳�7ey�g���+��vVa΅����c���'�2i�³��������g?�	7\��v9v_�d�����da�L=p�-�K\��:)��&�%.(�-׷��������ռ�fT��5�届�ϓ��	/W9PAC	N'�Ť����chF�I�}� ʈpU�D`�+���ȾIwr�K\���7*��K���5�J|*���<r�{��(�D�/��+�Ǉ�U��N�P�r�۴������*meH �FR�+|����}��w�'F/m UD7|eL�E!��r����z$�V�N�r��&I�٣+�x}��FL}Ϟwv2{q�G�0�Dr$	�0�wx �E�h�x�?60���DYk�1�3
7X��Xf����F��˺Iyk�ΰ��2^�g���������:#)��Y��Vh��!{]�c�XV�2������_X#c�:@N6zf}�m�&qF�	 �R�6�ˤ� }peVI.U����[C�Q���Z�$�H[1uS�YM���s�Vc���6�+'>3�a�I4o_j觯$�ѷ-e����I�z�R�	x��-I�J8Q������-M ��6�=��c�&��vbڪ�<8_�R�*��5Q���X� j�
����aЄ�.|�@�[��Ks��G�@�ںCB�{�l��B0K)B^�^���h��1���._r������S�۱c��|���G�색mL��#iC���Ҡ"M��%�xO�H�0��%f�c�\W�^�q� _���xov�u^�����t���^���mhFF+�͹s�#.���T9	�`��{x'�@��1�����c wcXA�J�z}+Z���>��B���/f�:W0�,'YJ�9J.��&ىQ�m�A�U��Q�8լ:}������D��GíR�)�ֻ�n��-y�M���'52��Qq�7oA'�23�ړ�	V�&ϡK`���#6�)<̝&�MH�R[O�;+�$�-g��l{��ee<>��I�
�o.W��$&��p�����×x2K�N�Z�������`��x�˲�}����Kn��&�"1�_sK�()I�?�9~@���� �-A.���<ѷ3&+����b� Zf����9�ug�#&��wID6!^7�5]�����n&7���=Ph�I�zqBz���{�A�����F#SɈ������z�<�S�4���w�(��;=K���8~]G�ѧ)���0��'����UrW�x�=GC�juR`�s��?�<~V�r�Y��ȟ�����wߡ�j�tO��GՋd����U����������˅�ϯڈ����B�KwF9JE��
{å����8��v�0˅.�������lqY��5�� Q�	y��r��D־<���E��V�Y��ǳ�,���T���n���ju��u�Z�$����>ۥ��땄o7� �C�swOފ�i��	�S�݌Cz�L�OB�\� [;!5��O͔E3(�`����%(�rȎ˱�,Z�oZ֮�����* ��n�0-#�`l���IP�P�����q� A��)4�Y/l�Dԗ��d�	}��#�u��
���Ԋ�:��t ��XߦyFj@ ��K�Ȫ>	|��g�HLF>YO?nN�J0!xAn�x���m���%+���9�k� �0�K�0(]<lt���0j;Uo���rU��Qu|���x�i����p9xb�:cJ[G�*��x���Z-�n~o��{C����ԾE�mӃ�$��7]��OV�pZ�HJ����|/{!�x�X�����p���i��KWǉ����Pw�$_��c��L�� ��	�\}�������ߗ_>�~1����������sc���n|X?�;>�[�!�&�(n�p'�ݩQ5>2��vY�Hvoa�i#@���?U+� �����\w�b���?ն0�3�S&��1ہ���O���a�ѫ�^&e�J,�ol�  �p	��3�R Ù�%7Vn)��HD��k8����[n!�����YS����!
=g�#���j��V�6~�"y��m�t�|�M�@�K=��춧�-z�[z�Zd�;%a �X���չV9G
h$�u��^
�����Pg��x��,F�N�G�g���܅' j�����ƽ�Ƴ�^rWG�t� )��k�'8��9�B��X-!�Zj%�� �Z4�X!�Ә��/)��1�'�	 �`���l�!س`@@��쩶 |��Ig�p�L����j�fw`�~_���E񤏦�j�����ay�_�?_t�+k����*�$kl
�
����������F��Y�����?^���vH�Ɲι�Z�O�G�.W��uq�`P�;`W6T0�g|d S"d�D\s���ng��1��CR�X�s��Kz�y`|�"L�L��
K%�AeTM"�k��|	�Zq�
 �ڧ{��I����eh��H9DYR����O=G�Q��7�Ȝ�Y�".�2��	����v6�#(j���Qg�,���w�[nۺ����/ /�C��3���(s���$=��j��ro �lM$'�iӮ�6cK�(� I ���!�pj���i��c�S��}h�wJ�z#����dW�����x��T��*���ago��t�nI�p�:,h�xkY	1A�0��X>�!�Ծ炄u���E�
0J�G��u��KE~܍5���|�4Ʀ��z�Iq
�2q�0�����$�~n����=rHVYc��<-���%�3�{���Q픍������4m��ԕ�G��I'8u2$g�v�ȭ5[�1Bk������M�ɘ�n>�46�����欮�������Ew7������H�g���Z��@t!�I� ��$(��z�|������Q&Q�U�����W4��Mc�����I�&LrJ瀫���dAi4:B46��3t�ѩ:�t�U������ōl�G��҃��D��,�tXQg�GTO7�� ��ϓ���n�8�t�zZ���DW�a�[�O}���c��-�r�jb7F���׍N�o�:��9s �ث�P`gO$��w��������B��9�u��It�A��m��#�wS]��+Y���h��}���}������O�l1�7윭����1�	�h[�$���h=�F9���@Z\-we����6%{� ��*Q���>�I�"G��5���k�5h���5�Q���;��0�� ��;hT�bG��(W:�����!(4��n��y~��!�u�������B��W�0��M�^�(�cChgcL�u�2'cx�Y��,�3�t��k��H5�Z��B*ͺT�w>.��H���E�͔��ң�8[ul5��S�����P�_e�Ő�D$��݃0�HZn`>?=>>7���]�0�� 9��lO]�잝���;�g�Qg�������)����v�ShH���Ћc��7��J�Vy�0�F����>1D`���0�)�$F�q�)	߅��Xr>70���Fw��F�6�C|�vѨ��b+QӬZk�h�Ƥ�A"L��`Ԭ���hG$i�c�)��$w�;�Q*؅��&CZC�t Vb�;	���"I;f��v!#b<��C�i�h�i�-����M�͐�a]�=>><=�{|Xj�5̫Ю���-Ké.Q�#�n8���0�)c��m��m�Qͨ��*���p���!rF���y���`οa�D`S��NN�or�I�����R�n�&�E�]��^D���޲\��X�K�����,�(/�;ݨ�`� g��if��\T�p���H��_Ԏp�':�q ���Q��1bt�(�h��6b}aWv'���~�s�Y����:ScE��+�+��x��f�ȵճʆ�Ǐ�sb� ���: �������Qj4>(����6���j�!�B�"|B�#��݌iDe������1ڹ�1����Y���1�(���h�������Ի�fh���NK��z�7����[/�['use strict';

var assign = require('../');
assign.shim();

var test = require('tape');
var defineProperties = require('define-properties');
var isEnumerable = Object.prototype.propertyIsEnumerable;
var functionsHaveNames = require('functions-have-names')();

var runTests = require('./tests');

test('shimmed', function (t) {
	t.equal(Object.assign.length, 2, 'Object.assign has a length of 2');
	t.test('Function name', { skip: !functionsHaveNames }, function (st) {
		st.equal(Object.assign.name, 'assign', 'Object.assign has name "assign"');
		st.end();
	});

	t.test('enumerability', { skip: !defineProperties.supportsDescriptors }, function (et) {
		et.equal(false, isEnumerable.call(Object, 'assign'), 'Object.assign is not enumerable');
		et.end();
	});

	var supportsStrictMode = (function () { return typeof this === 'undefined'; }());

	t.test('bad object value', { skip: !supportsStrictMode }, function (st) {
		st['throws'](function () { return Object.assign(undefined); }, TypeError, 'undefined is not an object');
		st['throws'](function () { return Object.assign(null); }, TypeError, 'null is not an object');
		st.end();
	});

	// v8 in node 0.8 and 0.10 have non-enumerable string properties
	var stringCharsAreEnumerable = isEnumerable.call('xy', 0);
	t.test('when Object.assign is present and has pending exceptions', { skip: !stringCharsAreEnumerable || !Object.preventExtensions }, function (st) {
		/*
		 * Firefox 37 still has "pending exception" logic in its Object.assign implementation,
		 * which is 72% slower than our shim, and Firefox 40's native implementation.
		 */
		var thrower = Object.preventExtensions({ 1: '2' });
		var error;
		try { Object.assign(thrower, 'xy'); } catch (e) { error = e; }
		st.equal(error instanceof TypeError, true, 'error is TypeError');
		st.equal(thrower[1], '2', 'thrower[1] === "2"');

		st.end();
	});

	runTests(Object.assign, t);

	t.end();
});
                                                                                                                                      oH�O	�B^Gv,m�0Mv��p���ޒ ��d���m?v@�@(.�	� 0��#��>lw�MP�3S��	D���#8A�>��
��
����کyPc7L7`5a�������3��pdƄI�����L���%�呗��Y���H��Y��cE���B5ɏ���䡺&u��!��ՌG�A.�<��[���kj�ݹ�]K�u%���>,���𓳾���ݜ�^���g��l��5Z�z��}�eb���y~���Mx��&z|l�!�V����_�w���~o����t;�b�"*Ǩv"�0 _ ��y�죩ż��GN���w����%�IG�0{ӕ��9;��C{�>�����e���h�  �=�||z|l����\.���~���%fz�&ė�y��NP���ʀ���8eC�7@p��Ř��c�2搰�1/8���������b�9�_���x�Ϗ�o�>||��6�2_�	�%t2��Bq�Y� �t��0���@�]�(/�LH��Uq��rI,�b��P�1�,��n}ᛁ�����BƑy�; �![JH'�"���}?2��`6�����)d=e���:$�EJ:���6��	P��{�t`d�Hם<rLA���/��L��L�x��s�/m�bg���Dt���U�}h��O�OK�-,e�)ݘ�h(�d�2,1�,ǪH���V�:�i�p,q菤�@�Ĩc0��f�ڮw Z:IH˺��mj����&s��R����	��s�7v�y{�(����L�l����&�S橼ŵ]7�`o�9R�aG�]/e3�O܁7����1qT�:f�����+K
�Ž�]��DG"��3	�Ld��s `%�S��[���!f-J}����j#��;���a��d��>ҽAH�7��Y>�Q�M�Q���h���}����� ��M�>��̱�%�y����N�Y������F�X�Hc��X�h�M�����x"�R���5�F�[ik�m��F��hk�5�a��FVR�K$��LT56F�zC��(YW��O���q|n~y��y��=��rf��Yžw��v��I��/�j[�ҳ@ϥv�]�ĭ�)/A����r���X�����y�yq-�R�]��Q�n����J5����*A��o�K}�����+�cw�����I���hr*d�8�����G�j���<֟�2+�.��l�$�w��B�n�������\�چv���2�/>�<�[���=�I�n������xQ�P�'8(�-����;�����kC��־�f�C�5�c拐B3���������ߛ���1q�����p�|Ӵ3�QV�,�j`U
-�P�pŶ���+�~��Gݳ"| �u5,jGNcﲀȟ��g�E��d��/Q'�Fv&m��4qm�1��m�q9���x��ZW}�tCaE��5�5}�S����j����[W�dv�(���$�u������؜Ǉe�u|��}
٤Ҹp�]��m���D_�* ��"� t��)t���H�=� �^$��ݹh��~a�RB�[���˵P�ف�1'��gϟ4�o*���5+��!	�}�O ��}��
T���mO�`����U�gq};:���`��8~~w��K[�ે�e�\��6't�@HB�;�׸΍�w���A*
���������!�4D~�H bD'�@�s��}H`�~�R��n��u�Y�� }!"�7���#M�A��.��"t=9��O��Έ
yxZ����J a���iP��*��aC�;���zh�_ a6���{IP��O��@���Wſ�iE�K�ܯB�j��7���ZJ����v���\��vu�yx��\W�ǻ0��{����L��iv}�����ǲ���_/��t�'{�#�+�3U��/[��B,;�Ƕ9 ��؏� X
ps"��$�6S�R�0z}��};�4�"��!����!�|�ub ��eeτ�a %�u`n�(mp)ʻR���?.溰��!��,�=��!Y���E �TH�A�D!�����ޖ��k\i�Ņ�V�ޖ���k�Y�'g�9k�>�o�>��.x���� iP#�V�	pfѩ���f��y8O�f��@�fd7�h� ^ӂ��C����`k4i������\*�{t�3�W܁���rh�1
I��N(�_��!֘�A(��~'�����򒐹���F�q��M�F/�(L�h��I�!�Q�Y�xE�ns��9q�h;�	z�o� �c�������~��Ϳ�������oK�.����@�-R��3u�R�y&:`6=
Q�wr��G`���C��l'rP�SMF;�kF2�>��؉z��sH�Dl���C�N�'�k���/{N�C�w�^9 d��+O�����]��nv�����3}��@Cc�D> Ư/2Rτ�m.R��2�vp��{B0�,���X,�=&Ũ{��NF(�QlO���+�3 P���@�Ͼwu�u�)�3�	��H�t�m���~!m����1_<�2��]��\߿y���*����;���L-���>�=�������c���e(�Y^��a�^!�_��P�wI�[)�ىR�|����"֪���Զe�S�y�,E (wL�ʄ��a�Pv��9�i	��<K���:n��C�ۓ,X�>�G)�w{>�l�e�C��c�\eb��r���H$`�I-� b@xo����(��B����;1�g(��ɽ+�-���:����u�\�.�Y.H������4w�,�� !!=��4"q%�p��j��$b��"S��.�z��fK��r�N�m�;}���i�v��zo��s�+R�5�L�L;j�d�e �c@�$��FT~(��˰8,���A(��{�����m��~�!� ���t�(��Ct7���-�
�v$z"6R����c9�,+��Za�ң�#��f��2ȊBRm��"Q�-%W��%��b�p8�U���\ǖlJ���c�@n0滬9��@� �utl+S�l'���ć2����]%цU6HR�nzȌ���|�/b�aO�g���%�{�U�+�.����pb�ݙ|.�̲$fH��5)���8&ն\J�Αg!a]�V8Ѐ�u¨�P���e��9Ca�o��r��B��¡S���z]^��Ku���"�@ܾ�d�u乖w0�rD2��S�e/O	g��������w�f�A�B؞����AI.�\YSN��I93�Fi!i��g��r�H��?O����9C";�(
C-�h�~�=3���dJj���J�w���g�NdI�N�V6�PJ��:��=ȭd݂]d�u�i��_�Ke�F�Y��V��2�U��2�� �� �Ҭ�>�V�V��
i�:�N��p��@|J���B���x�_������@��փ��!jF��1�dt�It9��g< xK5�KU�ň���ґZ^d��쮱���`�H�׿��L���BZU��h<�pt��Q]g�m���=�F#5�B]G��.ѫz��A8A8�#aNv�}'{8l�/|cq "�0Kr~ ^��4�̄>F�c� (���KJr�TƳdO>������C�d!D5?T�=!pSPl�B�����D�BU![�ª�&��,2��y��[*a}[Ҙ��,O\��p����6)��TIy��K	�-�L�7d���H��DQ����F-�e�b�����B8EY،֛�H���	,� �j5�\E�\��y����jIn���lP<���V��)�%�L�T��\��������~�J<?��O�_��#��RA-'���J��E2��@t��圌��jI1�q_e�T�'W f����
Fz�)UC=��]-W�YyĘA�i��qf�Q�̨�A�b���~�P�B��l�A�~�\B��~�s��v?Vh	~K��^�t�l�6�0׉����|cs��qW����(t�׺
\e	���Oū�q"�C�Ģf����L�/�_��-��%���8�r�d^�L6f��O2�vIjk� sH�T\�f�9ߐ�q!~�d������`���q�J!bY8��Ғ@cД_+
����	2[�pJ�������S��|��~ۄ�|k���M�"E��UM8�F�G� �?=}�%r�;V@�p@��W �&�S��H���2��xM���G=��!�^���  Q�R�m���oXSk[�u	��F [P~��m ���-�ң��eh{�
�i2�_�U� íCRg���$����u$19?A�����kY��>a��̼)\�QY��0˺���#��R��@ԡq�i����!��B�4�g_�NSp��@��7	����S1���1�lI�n`y�{��\��61��:t(��T�̆����wB��`�.OpZ��g�Q�4�18�;�O)����H�z���R6u�u�q����,n�Ph���_�*�cޚgX�#���mi�=�{T�,�[�$-��z������ǳ�g��3��F
�p@H�C6��"Bu�M]�ݢ��G,�u^�� -��Xk>7h\�+��NF>eI�1��#0	��Uy��NP"��Om�ߙ]�C�H�g����r�	1���\$�z��{ƮQ��b1X�RɄ�<�e�d�!�xYv�w��z<�&�g�$iԔ���H�c�@E12����0L��k��-�D ����o�y
LE.T����
I@�G�"%�	��N6�#3�>��,���|,d�J���ȉ�p��-������ܐ+�4a�)���x�LA��+��z�;wg�a�/'=i��8q��rT'��iyiIl�?X ��vq�=3xk{�<���m9�e����֔�1�]�r2 xx-_��K�H���l�nn��Q���*m�2���A�̟?<��X�;��a<
#������2?�c΁���^���o�ֺ���X������c� A��8ho iѷ�	���e������*y��]O�u�_�"T�8�%������Ң�<�t=�ݗ��ɽo|����m�������	����`���v���-ռoս��Y�W�Ϊ��^CTid,���PïF�(��n��*��U��~��ZR,ag�	��ɾ}G�h��?.c�>�o��딋�n���v��v�|�&�;p������o{���j*��_�n��o����[�hM���w��cy����/��_��_��������������o�.��-�e���q�s���wp9r3��!"P�6�uCM-V!m�� w��I�v�r'�UȪ�t'V�/�:!�1�͔}y�ެ�����^h��ub�����-�G}�Z�:-,m=�`��ݼ-�G{���ўi����a���zD��іє�%֐�8:�?�}����T]M�k�Nvw����ͪ������uu��`^`�B�R���Mw*�!�������	u��q?��٫�Yȉ��n�E���3j���������1��;QJ(�J�N�-��}%P���&��\�T8���Z�� �3��+�%�B\1�b��W7��,
�,�I�G�4�*���U��O �@���&�I*4�QW��rt	���D�m�����R[AX�̇4���y�<�-0C�\=�Ú�6�>�TnT8
���������3�K������??�Ҳ��cv�����!Uq3�����k�\9Z�¢yK��
!���ɂ�ѫ�K�ѳQpI:f�n���b;��8K_w[ij���� ���Թ�VQ��52Z��[�@z������0����`�Lbs�����h�`M���-�ù���;��O����:��Y\����E��������i�^�c����ٳ��Kԑ�D�y�tom�@&OP�Ύ���	��]��B#�P��y�q��V�#�1.��^ �kQ�e'Nm�`�6�a�/U'9�`
�ʒ �=�_"聠��(�`�-^�������i��GmӨI�O��f�'mn��	?�ZA���N��ɺ;���G�O��?�5=�n����l�Np�՟[���x�I{mx#��~�t]����a�I�@4��)�&SQ�rPNb���:�4�kzm�����I�4���������,�������c���K�/��I�:ٯj<����P�lU0r%�x񤄯��,�P8�B�\��!nϼ��ټ�#,��5�6i����?��>�͗�o�҇�<K��;:x��Ã�?7>�/_�\�s��ӟ�������AQŠソ"��6�06fd��m��^��c7-M�Ũ]�V�9�&@ʌw��T	��&�K��؋�+�Vnv=|�M�s�Ɖ��YdX���S�����Z���o���3~��盓����Y�B�s�m���Lk��|#,We�z ��Fig8�e��#8��2$B��V�G��`� ����R�� ���C�mi�C_��=N����	w��'w=L�=.o��"�Bg��*-S�~O7"_
_TK��#2�Y��ے�=TRM8�D��w0�Gx��T�7���Zk^�c$&��$u�A�VZ�N����ܚ/P80Z?Y���0���1*wy��ˏ�1����{�&L���!�w��O"ƿ���M5�ǿ^9��)��$�� ���BM�-�,R�)�5(E�W����1/)G,J�s%��L��*�+�Y���1@����_�"�w�XLX�	-�~�-�-����`*SX��g+�E�@�&Zi��P��#ː���WH�!Fvr�w���6՗V��(��rk�n���l|/[�nUM���*0AA���h�h���h�h�h�X$c��
y��GM��M����]mWm��akcLV3�ĺ"lA�Y�6��}.�Ԯ��F����mc��f�^[�BxwP�y��cuF����G*�K��^=����9���痧���m�m�x�1��s�p	��4:�n_ �y�(���;������B�yި+�k�S��5�&zL�Aįm�E���t~wW�[n��}�]����z8D��Q�9;��͍~E��_y��̰7x���gW��~K9xŊ�xGX؞/���U\U���t�~|���>-�A&�Wt:�a1�V��~���}����P2�e�}D-�z�w����o���4ϯ��O���l�^U�P�3)]4�d`=#���%�Z�F�R��O�W����ʝ-�|az�e���;��@�4m4���hYe\|�����i$Y:��x��mq��݊�l�P�n)��m�'&���y�lIܪ����y�|�-j���t��
�S�V�����q{z��I8V�D�����i��03�����9�`���� Ѥ��A�S���#�}�������ġ�������(=/_��O,yiȜi3�SkafMK��L�[��C��5�z���[`�
ꁚF��9dڕ �H���,���g.���R'���6���M�*�Q��nQ�X�R���N�%��5O�p��	̙�(
K��:������#49�Dj�[e�Sk�c'*A�!}Mz�po����:�a�k�Ɋ���y�!��}R�.E-�m�F�F�Q��r����Uj�#�ɔ'����ۻ�����̑x��\�������=}����5hJM2_�d�`���nV'������/�3���>�%�(-�W�8hq&b��GM�TKQ�S���3���T�n�� ��4�?"�3~�$t��<M�l�:;��j���^0�彯	h����_�d5K��&��Ҁ:hh-o�B[�8�qt�"<;��sG�t�X���NC���I0�g\���9Cs�<]�g�J��!Fֽ��ˌXl,�;\u��#ϸ	rΐ����˟���x��Zڔ��&u�Fw[���<�/�Z���o�2 ��aM�O4E��}���Q����E��qC(�@�����6lB@� �VN?z���( ,Q�jWA�w:1ƃ��֑@X�i��s�Ս=��?/yG�9:��W�P�𕆳6�ʲN@���5T>��JY�%��C(~Je�F�+d�M)�J y����C�6kf@�i��Y~F#�e{;A�U���w/^���܁���v85�4��Y'�FqH$�	іc��
����W���	F4��2��kBH,�����`7f=��dg|Q�k|�ĠV/Mh���Cy6@����@)�I�; |bf���Q�5����+�ZV�=/���������<�����_nl<�� =B�x�7Ο�
=�r�Gb���N��/B�=Cj�ޓ��1>-O�r�ʳ1\l6���t#��-|�R�iՓˌ�:yFQݙ��`D�w���
�%�����#�Z��`�[3���G
4�싗4���a7c,�ڧkɯ �{�v����$�[�'"���f( %�����j�b�ץ�%�p���C4d�t�����j)6Y����&0j}nHR���[��qI82/�ΖgԐ�I�H����g�,�\Ox'k?��v�6B���xƂa�aADӃ�RҖ�P�75^$#5$��&$�ڈ��.X���"Z6ANZ�Dn �QoB�l�,�^�㑡J	��S�� ;��gS�ݠ�C�'ؖ�|�������������O7:�'�6�ե�!j�(g��7�v�W�ށ,��e�b�3����x`>�������;�d�����i�?����~�ni_�&uW��"{�)�PN҈U�&}Q�@���/��&��׺��L}��͑�Τ�F�L|^lo<�\m��}�	��>ʉ(J0��w��if�&ù�U^����w*�0v�Qa����A��u	�7{�BF{Ed�i�S%�+Q��kT$@�a��z�@�1PpeEhF��@���8���p�No�F �AN�rm����<M7K�C�'�hB۵n�~��C"�HP��x��DJ``	<N�<�+%��	�A�Q��)�ɰʰ�3	~�@Y��}(�vJLv]��0=�u�NXd5����gfĩ�aF"�A�fG`A�7�ma�N�x��3�����L!0N5�{�I�(��E^q�G$L/qJ �/D��UkN����Ȧ���؜Ğ�JK]	d����hL�e�̢.����@T�п�̭�Φ�[�'��>�}(�T��tA\���E`�--VqA���e�AR����8ʵ>'����2NY�x�p��H��C�[2�@�xh �aC�m`|���׵��[(�.�����
�ȨЇ��1���w��ϱX�Qڒ�{�c ��%��D*ZA®�&$B�kY W�P��F��8�9���;��x=��\����O�H�5WI6�Z���b��� �PP.�6�˗��J�(ġ��oU��ys6t$`V����9�����ߞ>�n�����d�����i`'n���ݦK�5��Y7��i�@'"�є�'n5���y�M$϶�KҦ�c�rG������z�{Ow,�u�m�G��֞`^�ã����oT�3��{�?�t�78����A���}�S#�[��+n8�?�����<� u�&c��_�n�VOa�앥�Ye-�(LT��?L�~���`p��s�q$��� 164bСB���Q��4]�l�,�^��{����$�����|S[!{�f�Ui��)K����1�����%j0��J��P��y���v�<��~�6�
l4�N9`J�ic�$���
���D�u`i`��G�oA�Z��Fɑ���ra��`rny3�W?7]cԷ�m���֠�i���mjHc�������edT���^�k���(�����!�p)ދs�b%�ev0TD��7�R� ���\7�) ����iR�.p��L����>GUP�##��U���~Ҳ��@�����$���3�PI2�L��vR2"��_39Y4��Md�B3�d�@�w�������8�e�i����c�����g�^�{W�Ǳ$��}�j�}9�,b^Ӧ)j�֘N?�U�� HHzf4T���\"3#�ݧ��o���ÿ'�y�����0�W�3ޡ���m��S ��jx�ݟ	��\A���39��,�
	�+H)�~�����c��wv�B�+��zJ������z��Ӯ�Q>�4��0<]^�aBK�1��mKs��/���X�r�<h��	ғ$&5��B�:q�J��G!ledG���)"6!A1���F�8(��bc{U�\��ԽG-��wE���}l�l!?��w�U57�����9@�+��sMT��E1S���G S����$��i�%A[��:�\�2"(`�]��S��3^��ڗR���ǽ>kvA�?��ϥC������Ѳ �2���L7:�k-4?�������<�)I�KjAcօ?owcQ7{�]�C����cx-�����K���E�
\T�wFUHm��C {f�8}C��]��F�F���&�!��{WC(fqֳ̗t	���5��t�̐�<Y�3�%��J�Dq,4���&�=�ɕ`��(s�'�sǽI����΅qk��N����CU�썘�X�R�c��H �	)�N'ٳ��ᔆ���.�3!�!Ö�Z���]�IO��XW�� �����-�.�nM��s�����r��lG�O�)'q�����2�#X���@>���0��@�۸�'�96��a9	�79��f0u�&�G�'=���d@�h3�؀�,*8h�P��nK_퀌�y23@+��v23`G��0r�ٌ m ���U���LP���p��/���,�d&`2`�u^T�D�?��+8��6;��ͼ�k�4f�[��	0�5��ƿ����?���� Lj&3j��,����Y�Mfh j]�?�uts�w/�>G#�թ�)�N��O3��#��'���u�t����ٟ�?�l������&��m��Z�~��l��.� O\�m�-ĖP�-;��y��x�S>����JgۃM�6�w�� ���|��1�6l���R�q��F�Ů�g2�c��fs2�3���l����Lf�k�L%f�����23d�S�ߒ�3�5��tZt+���h�Ţ�]�7�y�z��S[�ؑ	J?��'����azTSΞ��:=鉻+㏏W���������c�,)��A��!�_֐q�xTF�N݂�mw�'�1�Ըx�r���"�ec��|�^�e}�����[�m�$�$�Wy�a9.�m�
P��eR�0G�\����Ty�W���B�7�,_�5�������VB�y{����V�ƭ�ٮ����ت��u:ۮ_��zv�	���oj5b�2v��f��2,;�&�#���������䜶"{����!�S����}yȌŁ�3��P�m,����j=�#95�[c�{��V�Sy�[_[��>��� )�UW�H�kK��gs+'�E�`�?���A_���r�8L�\�b���\��]���c����T���(僟�B��\ؙ6��f��m�����AZg�X�GaSӽb�)%+@߼���~t��..���.�ڨ{].�Ѣ��hM�RC*��c*��=0+٦�M
�܄�ؚ��sB��zXg{>�"�kI��hq��Ÿ�R���v4��_�0`ˣ�P���bT��bk��jY`��/9��6 ��� ���h�lX_ˮ�(��'tQv���9�1�8��;}I2΅���w��;�B�Ա�4��%y�#��Ffhw��r:;��\�/qNāE�5xJ�	:�+�;���9j��S=Ҙu���������~(�P��z���k8U���'v	2���&`;�[�%�ދF `T����2p�E�cA�4'I�\YC�-Z ��[��Ά�d�M���|�Y%��K���|8Ԫ�T���9$l�*�4�A:�!^Z�T�J��T�Җ):)��i����OJՑ��鏹�gEr��n M4&f~o�������k�a��w쎘��H�����c�2��v�t(7�oO-0sܖ�6Cӕ�a���Wmr!}H�\��An�;��1?==���pG3��5!��\e@���$+�@���E�ML]]N �P�>2f�&�"�O2�9��%��B2<z���4A�v5�m\�R=-O�8	�pg��h���]�:���43"]�7��`2���n5,��rk ��<��0�������N:��	Y*m2�ڰ�+��+���lzm�i.�-�eQ͈AzO|���{/��i�C�5�K�Zީ`L�y�32s���7'_o���(�O������]�.���B�TR�=id�t�R�9ТRJ �$[	��dG�Z���.k9,Ge�>�Nw�����F��؄�Y�����5�"�h�c��LP�+�(�{���>@���ÆαH#�F��~K�)�T%E�]�M�g7�b��cE�o�1C�7�uw�<Y�Nu �Z�����G��>v>�)��!�O{�CLA�9@Ʌ4e5��>w:dQT���į9���}�x��ᐠ
�c�"<�O�;٬�}r�e�4�@븂PajA @�V�p�Ů�W'ꁀ��2�T5Ĩ)��Qs�ˊ�7�DllyD�!��P�N�� �LV	*����s����a�Fg�v�$��[���v��8%��/vk@o�Z��/��eQ�5!ͳ]tv1(��҃��޾�۱^y\ʳA<��+��#>(j`��Z���iX^ּ�?��՞�C�5Mp�3o��?4�����#��GC���ǉ}�����z�>)�g�R�Um�DO �!9�+���	};���a�����Q_Ct�9*�zg����ج"T��O)��N?��T���W:ʁQ��-Y���N��_$��}�-�����Ƣ�7�Zr�޻��^�]J�]�����I�v���V����`͚ß�����a��,�A����jd��!�Ȥ�c����7]�vA���r���s{z��M�B���m��#a�,4��P�c%�N�����J��r"���<}����:2@���v!���/��V2��$v�9��E�.�A��ŭ�����2�I..�N��(���5�!�$6�8k�*�AU_�B�>,��t��'T}\13����A�lB��t8u�w��a�S|�73��|2�s+խ�K���摡K�m%'-��XW�~t��*���Ù�v��v�:���|�N?�v|<|��q��V�ʪ8Г~
�n���R�=��`����U�H�4��qL��w��O� gLS�'���R�"���iPV�p*Օy��3%��?�
K1�eO�?[n�x4��kJJ��"R��Z�z�Z�I��%���'ʇ����O>NZI�Q��m��'6n���]'55iApz�S՝�Q͉9��np	�K�)U�f��Y���0�2��YF�0��$�_{V1�W�hd�R_�Ar�(t�SYoZ��N�t-a��50V�8��M�FlPau�SI��r�K%LZTi�����A|jhjV�t�(�,���N$��X��/Y�_�%>���L|yc��\ƯX�0^�vǣ����E����`#��3)��OU��N6hp�Q��Ɂ@�GP8@�� �2>��H���E��X�#p���n��BͰY$�e��XR�~�}7R#���z�fB ,-*�y?!��ǯ�OOӇ/_��>>�W�}�E��}xI;'��5_��R�+��M	�䟗"��q�-��~F����wI�|��tz��N��%���lzk��M��G/S#\���ͨ�X��]t��'����*ؔY�i�62+ȳ�3Ѕ��Ƨ�*K~������}�q��r��dO���NcI��+P��P��'(�av��8��z˫F�������Ç;~�  �[�r�n���n�T��Y�,�5kyמ4L���t�'I&{,"ʐl�G����{8�N����1Ba������������&E��	E��XJ���.��������R�!Z�w�1jBzkBF��G&2���c=��C=˓O�ɡ\'�ws֑�Ȩi>�GIt�4�x���l�,f�.$=Z�Al&�:�����${Z�]�#������L�v�6@�	��+�B,7�^�ڹ{���%�&)fU��ia��7N�����b�slU?U�Mk�.           �G�mXmX  H�mXV�    ..          �G�mXmX  H�mX^N    FUNDING YML �K�mXmX  N�mXc�R                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  version: ~> 1.0
language: node_js
cache:
  directories:
    - "$(nvm cache dir)"
os:
 - linux
import:
 - ljharb/travis-ci:node/all.yml
 - ljharb/travis-ci:node/pretest.yml
 - ljharb/travis-ci:node/posttest.yml
 - ljharb/travis-ci:node/coverage.yml
matrix:
  allow_failures:
    - env: COVERAGE=true
                                                                                                                                                                                                                     p[&U�E��x�ب��["��x�;i`e^~b[h X8j�f����sNu��ɀ�5�
�=wf����!jEEP����b�։Ut)�~}�m���,��G�>0̤���^+.���������f�ξ�9��3��@K� �뇅Y��]1t�k��q�(���IkA�4�I�X��>���c��H�W���!���f<f�>P��W������-��R�&����a��%V�[��!ٝB�l��s��b��6�L�K�W�1���h>��o�4�?��.V��-�_�im�]�Ԅ���ӖoVӮxg��ӆJ�K������Zr�b����f���%7ė�UJ�G4<��A���.&����&1&�Վ�h�+�}f(�)��	�����_`:1!R�;r��R*9�������g%��!i�B��9^:�/�ӹG�i�(��Ӆ��թ+sw��V>ؙ�����?׿�����ڌE��L���YtA>g+�M�u��(���w��c��uG�g�d�2��%ў�
�!���"#����I�(/Mm�P��r�&x~�S~p���"�ܽ��{M~E��nC�&��>[��'�����֥�zY�$���8g�^�[ wl�pX����!���T����f�1��k�j���������8=�_�>?��F�א��|�)�;�}ý�C�v�o\B��$J��ݼ�$����b�*����·��%�R�Jw��"��<��T�`:坛bW�Z��\�#v7�ڄ��[W����M�{~,�N1���}IY��P6`����1���L��1��t��':����tj g-­B��p��*�;��Gl�Ī�dӂ���3�����2Խb�j�a�+�(�!�#]&�g�M`��K��ѹ�ߦ?�+�����=����e S���Š�M�V�:8֏#�P+�m�ƥ?�ĆG)���d�mN4O�]�01}��M��,-� ��O$�Y��I����/�Mttv��'5Ї��\&j�y_s�������#x�0�,Ϋ ��|���+)<�,Q�ħ���5�����M�+��4s{"{N S�%а��V�Z���n�{��ao탯��Ibw�H]�3
wV�� �lA5�rŶ��$쇺�#�,HdřV���0o��^�R���A����0��f�M��q�j�M������Q�=����<��@y'�9v�:�\A�����mF������x�$��ݸ�����g�1|ˡJT��P�c9ں��5�qO�g�D*NfGA � �7�
�KΎb�2\�T�j!8"\Ċ��W�A)��J�,L6�uܼ�����!�j{���<m҉���c������=�p�6x�+��J�����o�|����8k�{�jb���a�nʙ>��%D<K��&�W���:�&���PLxy~���˴�Zw���-�n�n�P禍9]Q��ڹ����Щ4
R�n�c:�/�z�����[�8��]-TR�������J�5��`	q���meϱ�����x���� 	�l�$��p���������E���� �Fj��B�=ZW�X}=I\,IT
���ڙ�+ �+
�F���4H0Eb�;}��E �,��y�jD�h�⹭�`���&�����b2ZeeT�t��C��z�Hr�Q&G��DyƑ�y!"�ég+���Z����n�u�!�܎�Bi]�ŋ��ż�>��	>�����1�9�x([��]#Rv]ш�W�Hy��������Wp�TE�T
Na�AS�Q�	����{#ld�!p㪓��ב%�¡>�Qt�fyYo8p"�!x3H��j��TT���V�L�GC��K�E�iߨX謏�\_q4�TO����A��;S���|e#�n4,�jl�Ǝ�N��,�P>j�����Ѱ��^pڑiB��*x����i���ބ��Hx�x!W̤u����h��s�Aǁ��Z���3����֣,�����7{���%�:����y�B���MK�����d�c�^zh�M��\5K�^��x;�QSb���X���ب��ņ|���Y
�2h���@T��kiNg�# J��!�N�E��p��u2��۝+��6�'c7�weM��'a@K��)!�g�x`��@��(�����W5C�� ��ɓ��Ƅ�����.��6vQ�,�Oc0"}}݊�U���z��eܐu�68f�H:�,� �VN ڈ��m*�����Y`�b�"���fԽD`f���)B�&A�n��&4�I�j��k(�#szCGU5N��Ȗ��_����F2�&d��e����Ƴ׎K�8`6�s��ă�`�n]���������	i�P��ZMɤ�\�dG�"��D�CR%$pl���a��:ն�-"c��EI�{y��6��x�h�	�,�g��ߑnBt$φlr���l���M8=%��}�4���lAN�����1�-��urO�qyۮ��#���A� g\��Id�5�N+�
��O��������M FI$�BE��R.����4�Gȓ�Ֆ�G.�(>6]d94�w
�ϩj0e�l����(�rN/$!��elp嫼Ɓz��{���z����T�xo�FU�bY܅wN�>�;f.>��<���%d���u�f ����[��������e}O2 L91�pΜޔ\BRk˒�й���E`\T�#�SD��a�����*�)�"��\�y�5����9���!��wW7/���C��a���w=�=Zk�婉.�V$����c'D^uc��Nl���D������H|䱖J�3��Vk�8�Z�	�V�,�*�K�F���*I6�������un�]�����V����[�������}��_�l��"��E�!)ze��v�0�2�����j��	���\T�	�=����D��!��qw֯���������s! #
�՚p�{�6�=q)Ÿ'6���(�Ԕc�~���a�dD�k���@�Z#;�/��|�R�
ԁ��D�W�_S�&H�T�����ʵ���;���Y6$����W��e7�ˮ�;�q���ʷ��z�r	���(\w���V5Ty~��~qް:����:"�w��M����/�^�:��U�b	S}pHT ��й܄���8Z]���A���6�Bt���@���S׽�E��c#�:J����/����z@�˵�������ļ̃��c^�6�glvy��M��/�Y.sP��o9��yᨙ���Sy����M����|���ū��I�j0CT/��뉣ؗ��;,��J`��X0��i�U1�+�RT�`��hp�����U�ax3ےrԺmy��z����9�:B|g���%�$ǢtR�__�?M��������AL�7���7[9���#�E���������CF�f�
�~H�߉V����V�6S��7k�EK��Õ�R���L��{��Q�m]�P��e���}�c�Q5@�CjYv� ����py�M�Zooوm���a�����u�}MB���X��P��F��n�{��Y�-��v�M(�v� �z�?�&2 p"�x�	�K 8��0?D����ӱaoM#�����2 !�|�\X=�Y�@0�	�4��9��-��^U����9��������Gn��?H#Qkѫ���v��@���vJE����)ʃ��i^��}~�Zz��}|��T��	'Ӄ�h˶H8�+t�L	X�� �����o��{�Dp���j��8��(��8�耑�B�n�^'������Ųޛ���K+��y��t\�:�\����Mlkf���#�S�@��R��?o�ʃ�ex����6X�koL�Z�A�n��:�o�rT���;KjRA ivĴ�.W'D�,��%�a����@�CҼ38��{�O�>'-|T��j��"dI�ѐds��#H��o�j�Z�b��<0_�e���G{�
 h�]Z�:Yd�Tf�&og�~�VP�G�p��=��Jd5]��(�:��}{��G���6ש+|@���;�x��wW �C;��FVXR�s#�+��@"�>���6���)�L��~VH���A�:�c��+�Ec��|/B�$�A�숪;x<" �	)�D��H�Kٽ9X�zC���b��oI� ^nF�փ�=*d.k>>�L�//��y�υ�<K��p6dN5o�f@��Zˣ8ƛ#�� `��v�!X��C��ܷ���2gDX��!���:V�J.�$9b���Y�}`���*�0��rB��O9h鷚���ӵ�}X�}s��!��4�H�*�β��	޴|�x}��B�=�%d�h3�1Z�`�!]y��� ��c'h:@G�N3�j��A�fΠ�F�È�Zz�� ��)��}g�V%�$�Ԩ�r��<}��pW�����V�_�#(�s�Y���F�P4:'Q�SG �I޳�ұ�3����Ig[�$�lC���]�i]���X:nS���8�߱�Z����q3�*F%wx����Ơ�f:&,,���,f���Cd1#�O��G��Q�B�MB�xY�.��99�%���E6/6� �~����y��mtB��]�K6�q�.��ȱ��،��U�6	���H��0g9�t/%b�#Ϧ���\q�^2�h6:V���Z__-7$�LHV0j��߷�Uݤ��#<��α������B28�N�Â֍FZ�(ύeR�~� �4�N�ftS��~3'.�xn�-��o���!g���Jjp+0�^I��c �x�`�������CZrƸЊԼ�j���_�I��k������^:,���ͺ���9�=�S?KX�� ����r����1���0M��0U�E�Y���`m"��?p�m�Vr�9Y$�b)'�B�&&�A�Sy";9�#�Z;˻�C�e�N�\�.[�^���ݛ�(���c�Fi�MEu��2����<�%j�=Fq��^��|y�����=�p��4O餑�U� ;Fd8p��-XTJe��(Ս�G(Osk`�i#X����~�����3|�q���s�]"ȳ��
�I3�g�U��p��LGw��b��eT���n�z�
ɠ�jѣ�]E�@!��%���!�
����P����T̀Yc�̌^�����7,yzn�2i��68�߸�cg�!-4"��ۑrC���oPLP�	�vγ(fZ��  �[%A�A���џ�iI|�b�4��q�� ��}�v<�vdV�T�,g�]
�Ԁϐ1<�:��2���#�y�^7���������?�}VNz@�KZ�i�RZ��	~�ѧvw�l���4��_�����͸�LOst��Mܥ�����w�GFUB�|�A{9"fv�]$���@a��0ȗ��7o�����g۾�1�?��OǗ?��Z��Z��;����m2��(�囹Gy+�9
�Su�;kS2zT㲚]ԆQ���\�`��uR�Fo�f5�v�BF�C�,�+�p7O�H�Zv�4W�l��f�(y���Ed|օ�m������sh��U)�.TK���c�)7��B5]����{��-�Q >������=����M������krL�۝5�Z��O�7����c�k��$~o8��dH�r����;����"���|�/m@H�	�*ǥ%P-�H�`�';C1��&յ���@f�� ��`^�����������߷K�}�J10 '���c�8�!�k�W2*��'�7�#�|}wO�ٳ��3J � ��\Y�����f����Z�nz��̻�n�-D�Z�sWM��i:��;O�(�kMA��Z�֬?�0Ѐ�	n�Ŝ�:��x�ĜC4K0E�#�A���)*1{\߶l_���s�H�@J�S�`q4�U�>n O�Bh`�s�A������N�����;#Z�� ��d�bX-B�(��.E�o�#=;򾑾��Qt.�B,ޱ͍p0��	9�h���-��%��?�J�ܛW�KOg~�'�r�Q����wK�V��_���	o��W���iq�?=�x���2��^[�;����i���e$���S�<����=�dv �k� Ii�ȿO��?��<���ճ�?͵�jւ�UfU�k+?9�i�_����:cD�YsG٨�`��~�)���x�#�^��zA�ڸ���� �+ʼ50��H�0�*�����>� ќuh��7��/���� ;�AP<�Hw�^V(L�F����S�k]k���lW<�A�$�9�(׋�Ay
Eo�q#2�djoE�e�2���%�����i�aM ��˗�����/[���糤N�ϓ:��8]��u�(��D�(Iv "��A5d����l���%����m���l��z	�͆��-&ވ���)p�$�CZ&�%F���EI�!��	�5M�E؎�nt��z	�%�MA����=���󬹳���"��N�S�$�xZ��S"1���U��h|`��2H��q�п*۠9Ra5�G��i �6�;c�Z#^�Y�|q���s��7��|tÍ'u(t�t)���i�o�c]o��fh��tL�֠��� B�Ό$u+��;L�^��b��:G"�lI�>�)n:u!g70#�x�M�q�Iz����g`i�"PLF $�6����C�_��$;CӴŞ�s��ݶݙۙ��8�I�^B�.���R̺�UIWh��ޝ���'(%�i�F/��D�h+ B��GF��H7���=;�n�2p��rIT�y@����4L;H�K������;�ػX�_�o�ß�����������~`����^�����ٳ�߼Gђ��R<=��6I�bzq#*~y�y<�b�%óĩ,JYqJ5�3�p5ؚ�!��_������%�ڥ<9��g0��}�s�>�.*�$��(,C�2M����H��˫�Ut��NDQ�Ò��KK���u�!��K(�����'��6Rdd��I|p?��/�Dr��\<z�̎>hw[ok�j��糧��aX���09��ix@��ޮ����k���%�ڲ�Ƒ�V�0� H.�a��Os*�Xm��W?�q�#%u۞���a�H�$ܸ���m�9جgNB�rv|�8�a^u�D�z��<Ή���>����h8�Xm|}x;_�	2�������r�:����ġ�]X�R���Z��3�ΆX#Dsy�����\��P�����mlM���jB��Т��c=dW�Ic�t�M�9�9���U����0�c��(�!�;�v<�J�X����H�6�foRb�ӄ�}�2<��kM��5�&�',=�j���6�S&���YI�m2D����d��Nm.Ϊ2��Fҽjve&��P��n7�v
Q�G%Ki����҃U�J�^�7���f-t�[����8�ۋ�Nl4� �K��T�Y�|f��B-����+�W�`�;P
5���֒�7��h��b4w=ٚ �u)d�F*2[��Y��d�������4������s2~ǨW���T�Ga�'[��t��=�٤E�E��?!IY�����|&$k�'��do2���}'C'0o��LOK���*�-bRzf��U�>����m�t#q��=Z�"u"�B�x�F��L@*�g�d��$%���(� u�X P��VQR�� �(/�w����e¬&J��.1������Pc>;�����5F����h�.~��/j�j,9=�ب�����n?�EZB�no��X�yy�	�5���y�>�E��Gic���t��_���?��),0���#(�^#�6hD)"��@���l�r�����FcJ��@G���N��}���̥A��~�BҵK�a��ԟ'�y$[_Gh����g4w��+���6��EP�P�A��?`�힟n�Y�m���۷����ߛlU�d�I�����7 �$�y�{�cV�7�S�RIv�E-��P�!Y٩G��07[��b��HĨ���~DI�,����~,i�
� �]LB�Q[?	��y�`gu�{��8"�{���,�G��*�)ݺ�e(��%�,!��L���0�����E��II��	8��%ϊI�F�4�G�K�� ��l�hJ*��
l@�"��`��gQ-�}�
RQt�rg
y�YPS�>��SЦa5K��ע�9�*7�O}��z�uᵘy�'�2�R-� �`(��)������g��F�
 ���-�v.r&(
�l��6���&�/
�HWP�P� �tꚬmBa�ra�D�6s�(qp�����w=���R+L�:�9����#�\��AҘJ.��Dd��}����Gd\�	H\V�Q�8��*p����=/�LU����!aH�ЏYbuB�c�j�b�U��K�A�P��l
���]��R���*Yx�8�
���qH���+'�+����E�j�E12��	�n�\�L��cX"����beR�Z/���j_�4I?* 	t89�,��h'b�
H�C��4H�h���#�}4-�LM֟�a��Œ5j!2�!���[M�Us���s��ף�e����w��O�Qʊ��	
���TΌS��jJ��㚒z�G��[%J�gꉈT�ة�e�$�L�a�RE�4�e�V6m;�T�EIgչF=�s<\�����M������8�RWhQ�Y2ܐ`�S�j��1~���h�~��_��;�x��.Q�(�B�C�Ձ�GMvuhQ~?� 
��ɛ��|3i`B[z������
ô9��������d�8�?����Y��/0<w����+��r�4J�L�ʳ�D5�x7�n.%�k��	�DhGmy!Cj\��d�����i��CXn?r��ĝq�����]�/A�F�n!����:��!y�O`�;a���r]�^��� [_��]B�̋E����:�V����B��G\_ S�MΤ�ǽENwb����j3��ܨφU�y{�̽����J����!v�`�Cm��1��sD$�W2�;�t����[5�M�8�/����䩅Re 3��;ˑ�����[Y6Q��ೡu��3��0z/Z'��ί�a?j�صa�8��V���^� Ge��-�!X�=�L!�RzExO!ߟ������FHr��"�'/��翠��3�lӯψ�'���]� 
g�!�(�u���^ĕ�u���p�8p1B�:�E�Ka�_��0��n��k�" OY�-M!��p#Um�%ͧN�Y�-��Kڎu��]<���c"f��H�g��%����eyu{��tA���ꯢٴ�Ȏ34ev�0eV,���r3uz�;vП��?�/A��:��;H��)�z*)��*���1H�S�*?�<�*&��ra���d�XOx�<����a9|��k���&��%$ɂg�������;���>� a���̛�su�Ԇ�����	�z�\Pۙ&�p>���`wUoC�V۳W�'�e��i��
�43�Y�D%x�lY�ǅ��ٷ:y��X�5	�
Ajb�8^}���(� H�3�~#���k�~5�b��E�����{!�ăf'���(]fٱ�|���͂��z�Б|�PN�'���y�+�e�fI�����#9����$��/&﵌�ыn��p	&L{�u�u������+J�|�J�Y����*z�O�x�"v� <^�eP���z�_E�t�W�	��@M�4*Gld��@6�K*/u�up}<�w46D�ʍ�:���i�]�(a{P��u������K��[������b+Jm�zԄc�N[xfuZ6�\��9��#RU�:yX�F�36TIfX��ˈ��� �oj�����4� �pl���!d?�q��V��.���X����$!8�n�V ����	`��+|y���V���R�����	4i��_��W�Ӌ��Dɮ���l�G�Tyz	��͵w�+�^��-��&.4�f{1�����nv(\�-;��ߖ7�T
q�S��cO4]'q��$`+�C�P7��D7�7�^p5�4D2��l�p��D�J�Ϲ�����q�\c�W0U���@��1�72���
�CG������-�u/ֳ��v���� N(�	�#�iN�b�Z�
z��m�f�H��A5���I��^�N�1�;s��ڳ�u��߲);+��dg��n�
Ɣ5�q��%�ū�n�t袒���@�.�0r��o�G7Lmص
{����t?��KE�)��(j��?��d��;�FS���j��|�A�t���|�2�l����k��չ�M$��KҚy�U_Tt�U�:*:zQ��Yʤ}�(���� !�7*�U9D����$Ԑ�u�K"$��Z��Kt����@��!k�y	6oƴm�OlU��0H!'�azDX��1\У�8��9c��C��©+^.�6m�ŉZ$j��zt��'�k�v;>ٺ��jJ�ؕ�k�ա�d���}3f\9o\��3z��*q�8o�%1ע�ks��<V�6��=ݞ����Ʃf�32��.B_�|��v�6���_�py6�#�?��I4�W���XT�$4���ly��j�?��ژ�H}�`:�xc�GMT�@�.�y�^!��ഃ���Yb6��(��X�hu�"��@�K�-���ڱ4ւ5W�64�����~.+g�hs�L�v�����t6�%�*����Hu;J���!Y�C4�]�+Ơ�BL*b�آ䁹����PyM����<L���̒�k�5�$\�&�T�g`�	];:�6�S�\d�u�f��0��&l`�ܟo߮�c>��������̅�6�z�7%@Ϗ�wB�]ll
Y�P(Y |[Z�M˦�j�UL���O޶������E.�B힆\A
�Q�)���`y��
��ڮ�8��s��cM��[hm�#TO���HI�R< �Ȗ���3hɓ菛>�;��'d�__?�7���&�l�*�u�'��BeI?Ƙ�H�����������; �$GYX'$0	����J(��`M�������͗����?�G��9��l�`K+�vaFl\>���/�_�Dό˳����2=UR�QѠ2�P��l�w�|���*�P��|�(
��b�4��,����?��p�>\�3 )�!%�0�`Q��OB��㡝�'?�HP&����,�ZpPFW�#B�A��I�^#::�[�^��m96?�
��s��؉E�t���Sd|�{����-���{��p&���I-z�O��#?F|�J�0����\&1&�6ܐ��x�k�9r'��n͒ֻ'�5����A͚s�[_�E}�\ #��G�F�����ܟ�9"�$?��G��~����6ǝ*M��>H��Y4��D*%�J�G�@��]}pl*�gnh&-cO:�(���궈���.}3W���Ǧ��T���ыM������m�[��}������V	�ό*_RxL7�'�z�	�6�����3�^G;U1�Ě���b����c\�v��2�~�G���'�en�~��q���7���3h �f?���s��HTװ�B�+�Ml�X�]IG��:�t=�a� ��~�9�G!���z��2���h:��R��������i)(���s9n�#k�!��U�K�� rj4�*��R��;��a���T=���z;����j�)�>8pd dC�#W�%<a�'��y���.8Y������h&�;j)�7�w���v�����P^�V��g<}�-[��M]N�֭��ݘ���fJ������3����R��&-�Nw�d;l�,; "_���:%L�zI��ZS�5G�����m��w���K����Bn��h]���`�6����!t�����Y|������m���;pӧ}T�"�����'�z@�(�(�	�.ag�5����V�q*˭�0�V~	ˬ��-��'����e�2W(�"��b�7��`کY�~&v�8h�����5���w1\&��ٮ^�5�A
���YvV�bƾ�VH�'�����a׺�o�gW�	�{������U��ϯW�_�ѴwU,$�U:��ngL�/Y�ԗ��
rs����7��/I{��7� ��ɀ4��eA����Q'��RT��4eEtqXp���z$�MJ��`� 6^ք=�,�� �������C�FA�� ��n�
y��Q�#� �iV73K�HuE�$�H���ln'��@�{�������WT����|���_@�Y� Яց�ֈw>z��${%�~nK�ĳ�o�k�G�/����F�� �Hջ����;d���uȰ���]��h! 2#��Qw@��?!
�|}��÷�L���l'���og���_l�պG��U�-�^��Z���d7۵�Q�#�c����Kl����80-J3�ۦ���(90�h-�3W��KWV	�u�6��1*G�|A���W�ˀ-��|h�*F����$���T'�)�ze�"�_bW�f�l*H���aH	V��6�
���<�~�&P�2*�4sS���[�/�I5[�k���PY0�µ���?��*��{����c�������?
֢o��{����\�k?/�CT��7�>b@!�F8��9�n�����ٵ�
��������;_�$��
�ݓ�;ԓ]�{f�<��e��-3*�1���8X���_��[�
���fB�E��
��	��E���(��;.c~+�ֵ3��!c��&C�lZp~?ޮ��n�E�o�g۲'�.�s̐��j�
yY�&��R�yi�e���NOL����$�S�[F�r��;�/k����t<e����;��^n��޸�@'�J<C')��2�QU�X�ߝ�H��Y�ӥq�m3�����}v��Oϯ8�W�eP��/���,���� ��45tX����v
Չ�K,�%����f
]k;7�&NkgF�C<�.�~���xB�]?߉�k�##W^#�[A�@��LвF����^����hh��O�Loj_#Dop!X������͞M���bb�Z��ס�����+��:]�I�]"'�3͘�HcL�֘0J�t�Akc��/�(��"���#~h�=Ys��U�j/3+2^�@�֎�&��uy1�#7u25=�I�*������-�v�p6���s��Zi�I��z�v7�4$�/r�n��.�.K�Ӑ�u�"���jP;�+�k��PQ�b�e�#����)L�%����/��1䩔�a�d���e��h2t!��V�(�������4J���yp�Ym�-A�
�թe�v5�����I�`�bܐf��-$�'L�:��b�`�n�r/(b����d��cwv��|!��}��%���������*
QN��h�pt�\u�[��,&t�|�`4�Uߗ���2<e��I��XDT�fc�T����`�jIC������[�.)]@����xs�N��О҆-��W��r�6��ɯ��B~����k-Q��t�/-7n��~av�]Ѡ�"��Ix�=�Hr��>m#\�ʹf~;��7V%t�6��m	a��E���O_��\��jNp2L�d���Y�~��p�5�8~X[j�}X}�[&]�p�nS�-�+(�9�f44,l~���3Ya[�%v&6r�L)בk�}���0F�݊����M����h�ߍ�� ��WJjԃ��~�V�ܩ��~���u�uC�\�3c��k�A��dra�(r��F,�l�鉭��_��^��}��D�ڐ�:zq��:�#Oر�������$��D��D)ƴ��nd[B�x(N̯�-����4��Ѕ|��s6���(2�z�� �E	rʑ��v*�R7�/X�P>�m7,�q��_ڀ���{����ٕMtK``
�Ņ&��l8%ݒ��ʔ!��F�ɐ1�E+����,�dZȎƝ��Z��I��a�1��2���.�g��_?|�v]nc���#	U�$o-/��)� ��.�c�٘�}x*̞����,T�Li�W�����35�}��s*��=�ɒ�~�]O��f�mȖ���k'�0�9�\$E�rYZ�ÖS?al"�L�j[=-��bO���b6h`�(�;��xS�c���y�c�/�3F�&K�,�7�h�����$���d�h�P˕q��ш�gS_$�*�m���td�̃��!�Ș.�p+ӏ���Sv�gk*���ʶ3��̾�b����3O�ڡ��he([-�tn�ɉ[���pv��@C�x��=ŒA@*egfe(�l�@2���(�����L�ٻ�$��\��UhT��Ex�t��wԮ˭�ѫ�y�$%����q\G̴���'	�×��'.��;�AM�c�ԟ�nmz^��Z�i��#�.5y��5�&�R�ܚ��-�b�0;��D N\TSr9�Nݘ.-�5�Y�3���,+��#����H%��ӧ�g\7�8�#��?��ñ=b?�R��&���S	Y�%A��qB��M86���D�1j�g8�J_#��m9����[�gya��cy���������[i� �N_���K�#]<4��x��(w�:.ݝ4�߽����I�n�@ � {�4�ɶ/'�e�����oى�#Y�0����1�T�ɸ
��PBaEiP��(��b.'�(K��d����;�'�IS�	�z4�w}HH�EZ�i�>O��W�2�?k>������_XJ�-L7�ַ�(v}�#�vP:w����h��7��.�?��/ 2��o�fc�%��B�@s'�х��͊�HĔ1����d�QLaGsH���nF��{Yn�n*u��y���A��4��	�/�l�2��,���<��3��lɂ쫦�[�z%d33d��n�
�̂	)�4R�eϓ���(��m����wѢ�e1OW�Aw.�6E���y�q�^teW(��t������f�S
:u�P�,<�,��.e�X��/������A�fW�ߡD���ʧ�l�)J���:�<��)T��{R{�0O5c��&
Ff��!�?o�\��t�&kd��	�9?�a"e��	���������ÿ���xk:8!V�l��2YD!�<sj$��<��N��4M��_�-�0dɁa������N���`R�[6���_9�y��(`��?g��NR�\3&z,Lw�@�/}$�1k:�Ȋ�W~�x���!
ޑ[�=�R�,o���J=/�7��7��Z*vf͓�)��h.J?�'/T|Bw����NT�~�/�}J��ZWR<�߼ d��/7��x� +Y,/X��m�ӧ���Ϫ����TUA��a��j�'�)�Sq��8p"��3[h���4y��L�W�kȅ�A>���3����=\�wM��BE�BE�BE�BE�,���� T�����>���Rl����ll�Է����r��+w���u1!-B����i��`d���%-R�hC��gi9�
_�"g�L�z���#����v܇��Q���C�&m&�c"�Ec�Ɓ�i��إu������	�[�PuO�˖�zJ�؝l�6��.����t��3���O�ک��]^����k��B�5 ��"݇r��r]���|p�����	�{�*���%)��6��``(��N]���y[<��ZXFd���{��MQF+$� �bg�M�"��"$ҍD�rھ����	4�2e/�qh��Wu��)�����������8���px������0�L���|4vo��ӹ�F�Ϝ�j(Y��p��5m��a��V���,�H�%�!b���#R2�]�)3�K)Ʉ�g��X�Y��z:aXMf &I.           �G�mXmX  H�mXX�    ..          �G�mXmX  H�mX�N    AUTO    JS  �K�mXmX  N�mXb�$   Bn . j s    2������������  ����i m p l e  2m e n t a t   i o IMPLEM~1JS   }S�mX|X  U�mXĩ/  INDEX   JS  }�mX|X  ��mX��~  POLYFILLJS  ���mX|X  èmXb��   SHIM    JS  �ըmX|X  רmXF                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  RegExp.prototype.flags <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![Build Status][travis-svg]][travis-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

[![browser support][testling-svg]][testling-url]

An ES6 spec-compliant `RegExp.prototype.flags` shim. Invoke its "shim" method to shim RegExp.prototype.flags if it is unavailable.
*Note*: `RegExp#flags` requires a true ES5 environment - specifically, one with ES5 getters.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES5-supported environment and complies with the [spec](http://www.ecma-international.org/ecma-262/6.0/#sec-get-regexp.prototype.flags).

Most common usage:
```js
var flags = require('regexp.prototype.flags');

assert(flags(/a/) === '');
assert(flags(new RegExp('a') === '');
assert(flags(/a/mig) === 'gim');
assert(flags(new RegExp('a', 'mig')) === 'gim');

if (!RegExp.prototype.flags) {
	flags.shim();
}

assert(flags(/a/) === /a/.flags);
assert(flags(new RegExp('a') === new RegExp('a').flags);
assert(flags(/a/mig) === /a/mig.flags);
assert(flags(new RegExp('a', 'mig')) === new RegExp('a', 'mig').flags);
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.com/package/regexp.prototype.flags
[npm-version-svg]: http://versionbadg.es/es-shims/RegExp.prototype.flags.svg
[travis-svg]: https://travis-ci.org/es-shims/RegExp.prototype.flags.svg
[travis-url]: https://travis-ci.org/es-shims/RegExp.prototype.flags
[deps-svg]: https://david-dm.org/es-shims/RegExp.prototype.flags.svg
[deps-url]: https://david-dm.org/es-shims/RegExp.prototype.flags
[dev-deps-svg]: https://david-dm.org/es-shims/RegExp.prototype.flags/dev-status.svg
[dev-deps-url]: https://david-dm.org/es-shims/RegExp.prototype.flags#info=devDependencies
[testling-svg]: https://ci.testling.com/es-shims/RegExp.prototype.flags.png
[testling-url]: https://ci.testling.com/es-shims/RegExp.prototype.flags
[npm-badge-png]: https://nodei.co/npm/regexp.prototype.flags.png?downloads=true&stars=true
[license-image]: http://img.shields.io/npm/l/regexp.prototype.flags.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/regexp.prototype.flags.svg
[downloads-url]: http://npm-stat.com/charts.html?package=regexp.prototype.flags
                                                                   ��l#�g���#�����]�<��<My����)�#r�9�<4��P:�n��Դ�Q�/���H�W�J��}����N�b}�e��6�x�bݑ�n[����O_���������ǿ.��9�@�(�M��vʥ�o�p��
xc��_�����ܷK����}ǵ��K�=��!o��n�J�ϫ���q�oE@���R�Ý5@/�6��P� �p����
J�A�bT����=�ޘ��.R�s���+�'V^\:M�~�Wu�,B�LJ����;-B?����I�x��,�����Z�}�x�<Xq�&�%��N��������N ����A�8/��m��"��% ت=�=�������d��U��{��������p�������E�A�]�K�B���n+,B���m���H����t�8%HX�W=k^���]��t��Q��g�#�� U�a�C�IJa*j�S_v���%�`V#7�T�mf��l�n�"c�n������T��<�sO#��q#V���1K@^���|x_�	�[qD��6f"�Xp�wa�#R�Kq�<�����$�,1LjښC��ɤ�ȅ� �F�.3���{�+b8�[^U�d]<if��`���!Ձ�n��tR-٤�%�شI���?��� ǻ�wז��,�g�0����E�0�G����<7���̬j���%۲χ4 �g?���2����<���js�J#St?cf4������y`,t.�<\rv_����C��v��2� ��oN ��}-�N�	_��~`��q�d`�I��t�G�W�����K��H2���`!Y����BoJv����(�q� IsV2u�f|�g�r�W�UI~`iU�8�!2_~j��@����(��N���g�ݢ��A�-�f[��<0��1�����	P-)=%6�y����j����Vȯ����r3F�}��2�}���E�����2��q4��~`��kt��Y"W��'"TJ���B���%f[5��M;|��q���R��`�B�n������^=��vY	�y�zW<�����0(�If���Cs�������a(�2�z
*��i��v/�^�14�r&�G����MM��%: `H"�C�xc���k��~7p�l�3���)3� �<�3�_;��T�z\�)F�c���u���N�	e���<{����(;��V�`"���������}.���%R�U�1�A �+�Y��&�g��5���҅0�R��<�Rk��������|w�B���A9W{�2���/5+�9~��T���h���1��� &\a5�b6�v<���&��mFAK����f �#U�4#��D�ػ��Bb�%���w�-{�Ȏ��9��������6\��_?�
��w/�&KZ,�:��z'd�8�g�͝��f��Ì��[~1wp���K�J\h'�Q�H &���H�LF��ç;��!Y�r�^;lX�LƮ�&�iI��k���^�L���#z1�*�ad��]�X���k�jO�:��ŝ]� �\�!z5�"�i��? ��4��D�`���4$�YtC�	�Ĝ�±*W��g�_f���D�G�:2H�[��h_��H/��|���FOM99���Է�S���@	��A�T��0C���Ֆ����� �	��M[�z֚�#�nC�!hҳ�f��O�&� ��C	��2�Mt�-&PO���o,���zN:�Y��#�h�t��gW���EGаh�v���m����ܿ��r��Y��{8N��!f,%���8Lf�#K���6h�zW��+^�H�|��X�nI��p�^,�h4Zn7+��QQ��͉\�}h��$i�������D�S}1�Jj�u,���I�G GIfsPx0�"�n�f������Y�=)-��Ä�.�;)ݥ�K�|��u8��,����p���Ӽ�/�Y�	U�r��i�721-���0偐ޚ�x�;t����k�r�z�����~~�ܶ���Ia����1
�(r�CV�%f�\z\�Ǹ�6�/��=����3��/?����)�+`4���PǷd�L�k��Sx%צ�h��x��7�n�6�}�|z�#Qf���b:���w��F���E$��iUd1ը�'�����%�����ߵR�t�v1���b0т�<rF�R-�5Nb��H���2�G��4� ��&z;r��j��W�E۵KT�陔���j�>/(͌�9� ���x�sƺ$C�#}����_�4���䯐;i	|�H�|H����	��(����~�C�!_;NOM��F ������V2kS��GX*��.�������v����˝��SiI ����H��z��創�\�&�c&��5v��[;��u�N���"�􄶑����M'M�v��G�Qs�����>����֏�nX�O���u��	��e$�J0�lV'.\q��J^;p4�� ��]ah
��t�Ӱ⒗��Q*FM�z�u���d^�ӾU��F3����m�ֶt���t��>ފ���/���~	���5�{������F�(İ��7��3���(|5A
���f�dd$�}���"1��#���B2hVΕ-Λ��&���c<�l���a�9��������cR�/g5��;I���ޮ���l��ɩ,�pa"-�����J>��!��_5k���������v�h��`M��}���mp�F�z70=�Ż��_�S8[�a�����Ա��p�t�����lR�m��������Ds-�0���3{��6�(���p��>����|�{V/�oz��}�W|�ۛ|_x�^����5Pzɦ}����6+s]�}��z��]��������	=,����'��M�_R2g`�.���S������"�@�#����47go�rV�J��4*%ǐ�o����'�T,�S� +�fĳ�p}�B�ֈќͶ��Y�w�=����P�qf21��K��5�7�!.�#ߗ5AL�	LZM��-���l>��{��u��KUzD���9�bW��N�N�C²�۰�I�c7���ky���zc���^׃Wvt�Y�l���+[��;�D�pxe{�^���^ك��.�c�=���G.C��a����Ν�̪�k|�*�������ƽ�U��ZG�&�A��e�D^�"��_���]QH�N5����>x�^�/@a��f~�*}������|~����ob�-�+ia)KZ�㬻�K.��\#�R�F��͢g�/�d����D
JwOH:�u7L�-b��s!֗�OL#X�|�9�ل�s'��>���"�ߍ��(x�Y��>z6F�7��P�kіux�T�ҳ����[(}h��4�I�����+P���}�������oy��_����ݯ�}�]��@ �7�@V�#��I쌬&4��������r��A-�L�5�(֞(����)J:�P�H�9K2�L\mM�ƣ��?,nr����w���m����.@��b�x�@b�t���cG��$��j+���:Y��Z�����/��0h�VqAb-��
5���PpN@*�e6Q�يc�)��D8 �{��<詬������+�_wc�����v�sx}���s��6�;�i&������pϠb
U$ɧ���*�Kȉ[�
�L��,V�_�v9
�;�+l��ȳ�l���,�-�����K��V_��;�9!���Vv6'X �������I"�Um�+iK$E��e�������֧�ӏ0k����m�YE����(P��w��l�帽�m̓`@��.�4=���nc�T5]�7��Q�%�d}��bz,�@���G�ɒ5�j9��N���߅jc��MF͇��'��2f>�d6ܦ������p��g;��)��F��xq�$V$�(�hu�n����6
���Gm�x��H+��ౄs���Hg-�ќ�A[E�F����0qj�(\g��im�i���x)!�`Ј�$��2��y{�W�������n:N}A	�Y���.�Ӿ*2|�[��������C�rぇ�I?m�H�>tT�O:j���鶧���S[(��T�2ǎ�������*����G}5�x�Wq�K}u�j�wꬫ��'}u|����|M_=]��h&ꚸ��e������O����ݶ��
���_��=������J%�8�nd��V�6�[�%HBO ㊑X�)��+����)VJl��$1w��d�w Li-��Y��4�o�i��du!٩��Ȼ t����m�ږR�/1Ѝ���*~��t��[�J�Q�=X�jb�y
��nQ )>S��)�lԲ�K��;%��̥�}i#;T4���v�� ����[ͲD�Z�x�����g_dE�����������̔b�II�p\�AWA�y�F�.	w�u�_��d#z�H���wG�ج��;35�F$�o�t1��?�(ir|��5�,[S�"ƹXC�bcM4X�]�����c�#����)��☬�&1�QB"��bmƠA��̿��lT�l�v�?;9�ld��7k���9-k�
��N�������Ii��]�F���Ԭ)�X6;kd	-C�$F�4��@s���:�hr,<A����I�F��q6�ƌ��:�a��B��f�%8˩��T�H�|\ ��`$�Y>z�7%Ȑ���z3���@V'�r�`��(ok�iZT]�W��U=Q�
�`��7O�+�׭K+�kn�R��v2 '�G�'oo�������A����* ӝ�	J�b��5�fP�`6��Ec?�h{��p\�-�~�✶�x4�j
9H+�b���w:�Y�5���@�N��3�	�h���S�)ē
T�$�R�5ZwM跣g��IDnt��S~lL��f��2�_�.�J����]0me3ڠ)9���d�02AR������\ ���W�%�Ћ�'��iG;1b�挋��.u���\�,��(f�~�dYw��-��X���^�F=��~��F3P%�aV6I��)�P���+h�LZ��`7��a[�!9��Kv:���IB�u?��=#4H���9��f��M���E�'�4L�E�@^|6��~Ct�ض�����6�l�1w$x����};�,ba�c���+�)]'Q `���nT���M�n�5��l�R�&!�З��]�d��wF���1z2t_wd�H����]�}
�#|c�֜����U����H���R�x$���A��}���zX��ۊ�»G�~��5W����c��>�٠'�D��nk�T�8�*���;���Sb_a4�l����:Fmz��~�Un<NH��j�o�@>�;r�V����0��^�p՟љ&T<'��V��!V��s���5�`����c���8�� ��z�	WF��5�}R�Z�iU�h��d:۸a��޼�H�gJOMJ���K_���(��:4�N,-q���{�3������J/7�������A<��(���>a~�
�u���������So���u��
2��[ؔ$e�L��Xh������R?ʃ��;ء��}�vhX�K(Y�t8�V�7ݻ˰��o<�st����"^�-���K���V��/|��}�����O����w?�U���K�'�ܰc��Ύ�O�#����)�SF�gS�O4DN��L�l�!$vQ���X���u�����)���5� �FJ=u��.�.w�2�߰D�!d��nF�`Z�ns�|����d��yz�$����b#�y}w����������m?c �ϛQ�M�8aq�$����(�7�o�S/�G�u��s%9�|�2�?-YYm�V�e#a�+�d��0�!<@}� ���ʘ.	��i~�
>�x?�����˻��_����T:t����w�B����õ���d�ۍe�ꪭ"�<��@p�.�$"ʔl��Bd�-�q�<���sYo�y���p����!k�0O�aDݡemr���S�mA����+xYcv$eqqIw��%]Z�7e�^3EQ])�34�Y���՜��}Ũ����E:����eVK<1�R�� ��j�Ȱ,B�Z��.0��Քi�X��}����_�[Ծ{a��#�����gU|Nu��� ˘��-H&f0��钆�*�ji_���(6�/`��O}v���3:\	�/�)l��iS�C@�E� ��]�V��t;��v~�į��y?����x��I,#4<���BťhC�!a�G����L���x���0<;&@6E���Ӓ`���ʹ��%���H���"O� �������#&j�5���{�Hf�d�jLH9t�A���^�FGz�k@0�GvIe�GP}�U�J�
Ypf����,��m@F LC�<N[��v�?Y��ˬ���]�>֒�#PV�R��N  Mj9xʉ�%��V�&0��;���]W��Aj��%yΪ���AօR�5���]=۫�:��b�7cc�th�#cZ�E�֏w�F��K�w�Q$���0"����q^y�n�l7B<��t�6�~ �d�q�V��p��"
�
-�@�&-h���s���2��P����暸!���h��ڠ�%hmi�7MQ�Ƅ��&�{a�~4��u�����{L�7����=�gxf0c2Wй�ȝ2ɪ(b�e|�M���d�m<�7�D���,�@�?֜9��=�R�W����`���͢�;��\�h ��ܻ��-F\E=�~��Ha02M�|z�ODh~3
�EX�4
�U]qH�֬�p�����/�A!���6�@�>_�Ӛ�I�C7n#�N��A��}>�&�8m������u����zЎ�H��k"��no�油ǌ0�ΕZ)
+�3�((mA}?p)�%e#T8;s�X��f���>u�i!�Sg�>Rce�b5�r�RX2���d��$�=�3QF�@_|饐�$!������,�Y*��0ƞ�զ	�zP��/�5���""� Aܡ��Z�^��6W�,�<x�{ )(ظ��o��2<�f���h(�C@��h�M��ү�I"&j>ҰbR��$����Kc��R6/.�<��q�芳͢�q6�$Y i0�^G��p��^`,{�OfӔv�{=�Pz��evY�8j<������d��*�>5Rs��PN�`�,�$x�M�a���*�g(J����B�3'�0[Aq�'7G�aɳ�/8����qO������R����Ѯ������͸ܴO�bשP�J��8���l���+�4�%�L]��H*2�J�F8�8�f��ktvKÏ�	<rW����P�D���zU�^ѐ,�Mp�c�n6�W�AF��_��,T'!v��C��p:7�
2::�R:<�8Y /*�����
H8���vM{|��:ͬ;��[U��7Z-�s֗��9��oW��*L?� FL������D��yv�1����n�
��r�秧���I���O�<O����81o�3�b]��:EQ� U�5��a�h�Jl��	gT��.�m4XG���M���$��ѽ��|���,��/'�5�it��q�vj4�f�U����E��2x�LzU�Fcd�œa�b���t�5=A\o��6��Pj�����*SFY0�l����V�BKyI�|�=���]ir�F���S�P�Vb��CȰlzL/�l������$R����L�j �Z����2�S4� ��[�#,�P�$e1�3碝&	y�gc�O�{����iiQ;f��������8'.׋��ݰ��f	K���[�#,�f���P,�H��p;L|�~�ʪX݋U�\u�fԸ��jG4�o�Z���=	I5�`��Q4�?��eb����
����
�k���?i��?h�f	�a��"���Z��1��^�1�V��Jɸ�S%xi+Kl����򯑈U��n�5��*�.Yl����*yYM?~�lqf=^O_��m�yT��s�|��fa�0
�o�;	�mхQ��y1e�Nv[ht�l�@�FW�4����8a�9�>Ŭ�
��#�K3���~^yQ-)��E�
��E�3I�\��̠�������;K�Ju ����[������_�����Y�ܰ��Ƙ=0�x^�T��/���l'�j��N%B'u���� !e~�5e&ь�M&=�#w�a"�q	+�oxU��j'欃��UiB�����֭����Jw��ʗ�jS�T؉�K�^�}'u0�'5�=~l�ߣ{ϛ_~���F�Ϸ�B�Uo�C�����K��n������=xj�>Q��޴S۽|�pV����-M�����O8��:{�b@X_���.~˦��*u�6Mp�bD��s���QJt�]w��m�.	�Ѧn.�l��_����"@����w/{���I����<��X+��=��u�!�LƇ�t��kx��\�nBY�ihq?�n����F;�#-i��n��7A�53#�ύ��v��6MU�%X\CX��/Jܩ���n/u����6h�'zcղ!�O�`�B�/n�X�� ei��[Xv~j}h��� jg����|fJ6�/��Ǯ�KiaQ�$��-e�!�t�K<��_�l�����35�����: �o�ޢ�����?����<�3YS����K���4��H���P���J���n�l6���qX�y�d����A�F� +K���=��7�cRI�����	!6&�ы@/��&�)�w�>��H��|�'�{M+}�Fz�	�}��϶;��#���������8F��"�J�3���Ҋ��G����	$/욨��QⳖZ-�	��&;�o�r�rA�<1M�s��*�	{2����5��"��Xd_���1�`;L�H�!KJ�h	�A��%V�7�;��A��I���/�Ox�����m#�{L��4��vFJd|8!�<:"�M�vWԲ�)���tVwt�V�~hu/o�Ԯ��+��I��\�k[WWձۇ�/_�b|J��y5�:�ȇ�Z��h�#�vCh��8X�i٨��o���@"�U�sW���g�X^5_O��@�2�р�H�t�c�:����sS����]1���+I��l�(�1v��&�b�66��sE"��|`�jm��! ��\h��� 3�&3Um^�k&2*1�"5�k�rw�	ky�����zmSt��,�&Uw�3�r{�5��䎻P;X�w�z�۞�	�?���Md-(�/�tR%�.�����}8��������2�-d�9/�4���qۨ�)e�q�E� #:wI��
�M�٣��ݓc�q�M��Dc���iu6�}]%ړz{t���t؆u�.�:���U-�n�jfNJ�r���5D/Wc��yy������AS���!��@� �ֹ�x�̍)y���M�}<�6��KL�	T�r�B��B"���y�'�"	�(������i�4�"7�K��G�it���On�X��tVG
!�r�����M����Z�:_5qԾ��گF��~B[�{�~o�����W�l2{NӚ�15�m�O�a��X�u�����ޠZ��ٚ�>�%�!���� �1����l5O97���d<��˰����`u�U��"U,G�4kd t��U�žv:�=^_ς�Ƴ�	��1Z�Dup�'Q��������J'�`Y�n�A�H�~V=��UNꆹWk�*ַ��U���ae��� ����`#K*�[5�v���hF��<��{�4�5.�0wY�{�q5h�(�5�i K�lNr�d�P�<�E";Di���m����&�c�.��X4�;	#�����:eK.��-��!�1*3{�.���Q�;��ر��hf��	�tצm3Nuhu;��Fkc�v{��稱NQ�\4m?�2�wyn��Ԥ@���}�mG���)�����A�U�M����Ծd*��&I����}�$��̾f����������cK!v���I�}��޲)�v�mB��T�B�<�}=5ύ�_*E-2V�u�>���}kU\ĚƗ7KG�v0����#�O'P���Pe��t�8鶝eXc�sU?ۜh�Q��R�CD�.2������܋���i�4�ʛ�i	�w�>h�$?�>��8��8�|"����M�XB���cw~�B2P�x=�:�%K�P(�]�)���'�������[}?�;ɞ'�fz*���'Ş��]bߝ�{�Pn|��_�6���#��6bi����'�3�bfv��33rgk/��[������V�U�8,�{�.�9�����V�%�����@���t�{��b�!Y�T��u�u�t�~�#V��4�d���M����1k�) �;d���P��:��"��V/�FL�t;�z���!�y=�W�0Ɍj?��f�"Ţ���xT7�`f�������qm�sʸd��nV�U{H]\̅�u��ͫ�L�Ei�F�0��=���T���a�}3_T�M�ޥ��d+��l�Q�~�������m�������W�Ї5X�h����7�G�ɟ�����}��_�>
G.ӛ�yP�,p�|'+�2|���v� )ʷ8"�;��m�� ���--wMD��78��ۦf��e�WU(N�V�^+y����Rӿ��>����;6s����$F���g�.wW^>{��蓏��d��
ry�F�7�"x5�~0�^�i"�7�/ә�M%fȎ��-�����&Mv"��:��,4��Jsٚqj�Io.>]�5O���t6��'�[�����۱'�t��}�Om��6[��go՗�T�<��t"�]����^w��{U�}���Q�Ϸ5�}>�H9PGLw�N[6
�������;��>��|qOv.w��,���]���:���������/ց����ߎ4��0Ys�F��7�ؾS��G��Vv�\��=�"�'���#��Y�&Υ͂F��EURo���{�����XD2��^��l:����&75��p)X���L���d�p�)��gk.r+yݓ¤~u�J�h��ki},��cIvߣ-�I-ɓ���(Xٟ%�7nH!�tмU[��}��?�����tz���f��G��G��)�J��a� ���n(�>�|�ǃ��<�����S������=c9݋EE�*XX Q��`����]�~�|�ߖZiyJ/�.�O�C��$���3ݰ0ݥ�D����^~��tW�k��݅��e��nQ���������!z���Z�O#���?�n���Ґ(�j��]�47릗fʟ|n��k�����?[�.XmN�@r�����@~�B�X������ʒ��e��*ɳ��ҹ�N��9dᷛ��F��Wl���.���"/����7{p��9O�!������r %>�rF�ݥ-���5�V�#��\�c��x�X%��@�C�� ��tc%�6v����RO���'e|����{�P�Bu�@��!K�"�`��֧\�H��g�"X�<���X�96,f`3�&
a)��E��?I�44��/ ���G�I)]��J'�X�S��^P�"�6Ύx)�C��c�o$��M�qX����O�i"��&���F����,��:)�Z�A~ "��-�cp��wl��'��a,�?���]� W�cG@�`����7k۱~�j��>������L���c0��@Y*�ܭ۷�!Z����Q�J�6��|��<��A��/�]�����h`�Ĥ���`�eH�\D�Ɓ�u��[rX#�+$Cߖ/��e� ��vH��?�)� �
`5����Q��^���-�90>+UB�� sqI�Dw�=�CT��~�!B����zI��g-VGsb�F! �`����{�vE)�>��vp�{`C�>.*����#��x�~HHq�J���,�\���}
�+�x�iMAj=�	���91b��g��t��Ľ�8��I�]T�1��]���k����$)�xpj� ��(����^��&_`�?+R���ә^_� 6�boN`�Ĥ<��((u�"$� ar�0�:%�w�kՔ��Z��K��Gf�>+k�s�q���z�
�iS"u�ԇxa���>�� U�V����O�(Lߒ(m����[Ez�Q��Ձ�AL3��u���'ݿ�S��'�g�X�!{~� ���Խ�
1��T����=k�D!�~��_���2�%<�T] D)�=��@�E��q��q�i�h���	7��	u�c~�f��5�_I>��s`�բ�Q
�}� ��6�F���%�Q�fΉ���<��)ѿ4U=����<�k�k�:���)���s��s��^���z���́Q������1�� F�]�ۋ��]0Y�bUVy�KԈ��t�zb���@�hӝG��"t��<d۶uv���~��Mv��.�{��z�;:�k^��k��o�
�//j�GŴ/R?ÿ�~�����s��8������+K��f� 	�+�9\W���O0:��㣝�q 4�����S�_ޑR�0�����@���!�Sz>�4�1Z�n⌏�9G3��A ߳��/'VU��C�V秖������xd�`������'c}���IM�T ��mF?�W��t��C�K;��!����u�yR�X�p��!� ,��R�'���!Ii�!??8#��l潲"Y�l���� iű�5§0�L���i&n�,>��� �ˑγ�>�0?��X��jGݜ&�x� �@$6d�%��7��燔P�M�`� ��8�B�{��]n-'\FF���Wj�4�RS6srG>"����P���'<%A���IЇE��)�Y	V}�35� [b樂��z�I�'�$�ڌ��ȱ��~"P=ԛ#��~�t��C��}�;JD��߮���i��.�=��K&��{�w�wB<0��@��pg��IXg��0L �,��-���Ɏ'��V1���x.��`�cZ�{n�NGs��ѽ�"p��a@�|~��ۯ���)ߞ� hI����8�!D��	Y�<��RE3,�6˵x�� Z��@Í�7F�Pt;��E�������u;7�"jvA��}C��#(������]�z�*��^��8�Ԝ>�B������r��V�g�jՀ����P@���Psm�gd�4jNbWO�G� �$2wݬ1��l�	�Cw}.�t*��i�i��ֈ��2O�*����|�)#�ޘz�����7}� �����~��w?��l�WKn�`ɾ��L-H�G��<��w�6��0�	ZEt�����3"���9���R׾(�q�7Vjk"�_S>*�`��-7E�7��i��,�	y'
����0C����?���K���yyC��Pߤ�&Y��'�g����w78������r���O���ZSʙ��Y�~?p�e�����y�[��_�Kw T,Z�����bQ�\vJs����,�(R���_�>V��ra��NCǯn�!�-���D��ç�)j΍�?	�5��.}���x����v�_�e��D��(w-�")J�*�G�"��L)g5����_�G�}�6<)�|,CW)����Y3�8dz@����m4[V��$Ni\��~�#U+�K�+k���#䳾_Ry��O/7�o���x����Hƚ�n+��&�o��C[�z�3�S<�����Mc��j��>$�[7K���?���Vw��uf��`ܝ��~�V(�c�Q��P�G�&�ݫd����D�i����r�S u$�6���,�B3<�^������ł��C�['ϟ��Q��Wk�����[Y�8��	"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypeFlagSet = exports.getTypeFlags = void 0;
const tsutils_1 = require("tsutils");
const ts = __importStar(require("typescript"));
const ANY_OR_UNKNOWN = ts.TypeFlags.Any | ts.TypeFlags.Unknown;
/**
 * Gets all of the type flags in a type, iterating through unions automatically.
 */
function getTypeFlags(type) {
    // @ts-expect-error Since typescript 5.0, this is invalid, but uses 0 as the default value of TypeFlags.
    let flags = 0;
    for (const t of (0, tsutils_1.unionTypeParts)(type)) {
        flags |= t.flags;
    }
    return flags;
}
exports.getTypeFlags = getTypeFlags;
/**
 * @param flagsToCheck The composition of one or more `ts.TypeFlags`.
 * @param isReceiver Whether the type is a receiving type (e.g. the type of a
 * called function's parameter).
 * @remarks
 * Note that if the type is a union, this function will decompose it into the
 * parts and get the flags of every union constituent. If this is not desired,
 * use the `isTypeFlag` function from tsutils.
 */
function isTypeFlagSet(type, flagsToCheck, isReceiver) {
    const flags = getTypeFlags(type);
    if (isReceiver && flags & ANY_OR_UNKNOWN) {
        return true;
    }
    return (flags & flagsToCheck) !== 0;
}
exports.isTypeFlagSet = isTypeFlagSet;
//# sourceMappingURL=typeFlagUtils.js.map                                                                                                                                                              ���b!��8h�����X#L���"����κ"p��^��7�����y��5i���{�
����V�)�r���G,k3�=��Y���bw����r��(㌌���m�����ˏ�QCk+f{-Șׄ�4A+� ���g ��30�)�<G�`ؔ��W2ph�8������55�����{ym$�u�>,�i� ρ���h���d"7��� �}(]�	p������\����t��>g:�����s��n��{�P���V�i�����Zޯ��ח$��1�������������i��3،�a^6��I��^�B�Y�E��������^�q����6+!-�Sh2Ǔ~!7���W��?��j4�&���P�@�t��,KwE�}�$���x�H��=R3�Լ2AiⅫUR?�h��E�I��׻�J���s��~&ԭ}'��.��ͅ�Y�@�g�4�!��ЖH���n;���'Gd����.]�D���f��V��$�B�w����ΐ�X�:����+S�/� n��ԫ(�p�Vq��ŉ.�a��#f��6N�F�dCm�����W�ݖ[ٜ9:�r�8����U�f�d��r�4ʀ���������r��v�8!�ϫ=T�y}�����������n�?�����G���� ��Iʣ k���+�2�jH1aӳ�����1
ʏ��0G���)��a ����:�Zq13!��$�P:a�~�RN�fݗ�4��jؠ f��jD.R(��{N���)֓���&�p�ױ�Cp���딓��$���B_�J�d,OZ� �+jߤW=�F�s�q��E��Q��nm���ǞMA�������,�}��g��d��:�)` �{o9)�7.\/i��+*.�6�͉F��Y��|�^@A���j�m ���Z�-�+�e9h��@3F�2�<�Y��C���n0�f��7�]����χ�/_/l���_d��YzD[���|� �f,q�fv��61KF*�H�)�ؤ�:��]Q�r�}�_�cF�.��� F)b�z�� �9q���On����<�}���@VJ���]CYk1�^�~�K(*�D6�fｆZ�����Z�LY�c%a�p�0����[@0�k@�C�sa�R�َwl��(q�f�h1�&B�"��D�!?@/����25���sNG"i�u�{^���7���l�*�-9BX���/���+���If ˇ6�����Ks��^����>鄎T�Q�K�w��}�9 |��*(��Unnl�F������&�UE����L�C�h%!�3���a�"�e�(msб:yU?�̧^�؏������/�?}����îo7�Tk�j9,R�e�:G]�q��}��i���me^�t�~��Ty<m	� |���ϗ_uF������j�yM��ᢼ��)_e��q1k�LV�s�J��U5!@�����|�.J� =����e8M�g���S\t㋝/�h�(Tȉi�4UP�Ap�LF�)�C1� T��>~���kջ�f|�I�����X��������*Xe��l||���$�s	DK"�I�O�Ƌm��qp�2rt� C��˓����&�5�݂�Z��
 (���fJY����3v�%xQ��pO��������?��a���c(�<�*��ݫY��|o�7�JX?-�|�^���Tq�����L��&֌/jC2ΐ��=�M�9V��۹;J|b�JN ��+;�x���h�8�ZI/���V�����o��|6��I��v9�o�J_��w�<F� ���F��F���WLąf�w�0+P�<Y��
�H́��҃�Bq�H�0>N����6g�:�������|�"���e#/i��1)$tB��CJ��xA���`,��$E�U���ud�4�~�!Mo�P�f؎(��G���/_����p)3�k� Ē��d�)mS!9�JS� �1��˾%p�f�=��� d�ޞ'���7�nA)|��k`�/,�3�h��J��#>I�m�*A�5x"�֔����娧�%�Sšh����xF���f��i�ć��%�~�S����՘��@��M���>^4^�kC�aH�M7#�~��$iK�E�U��<6���O����������t)���]�� (��3�ANJ1ƺ�L~��̔�o��ʥ�VrI�hH�K����+���{]p��A����ښ�M��R�K���޳���k�LcK7�9wZ�mk�wҌzN,<^Ky�1v/5�Rǲ�|�����`�&]�N�Z��J���ßw�S��x�n����M%j_�ip��w��W�D*6x�u֤�D�] �o_������>xW�EXQ��b��`Xx}��t�h�s"�`���e�P�h�-#+_4���e����l�j�$̓�T���@H7�<�!ncAæ��]��L:�WY������z�"iջ���9�$>3ӯEX��AYR �1�F�ޫԎp]s�рX[OS:E�}����|b�a��k�J�|̨C��+�YE�D_���-��&� g��0F�t�2�g���jV}���;N����D;�of�=~Z��>|��Q��p%���m-��1D4��8���,�8^�Gډ�y�$@e$��wk^�8���%M�/
d�P"���3#YP�QO�
�zY�&��~"7�"#��p����0���qP���ŧ�ia'�Ҟ0�B\�,	�_�����>/�ީ�84�$�A��<N��vա��*��T(_�H	��	^�<~��l狰4	0�%�����r@�g�($I'�J���,0R~���qI`���s2`Z���1#=!�x��r���ƽ��P�ނ`N���23"q������s�|�v�/����#N>ra@p���K�*�	�t}�%�"��ޏ]�X���L|�J���É0�w�>%�Ӯ���Eª�D��"֋8{c۳���H��dT��*�}�����b�����N�%���Ð?��(FT�,�����EW� aʠ!��Z�Bk��0Vs��^�1pU��ns���L��	�z���8�K��ʤ3̻�$<�TVa�l�S.��>�����8��j@��}��������9�B�t�f�~��s�O H�	��Oa9Ʉ����R�݀Od^��ݱzQ^�&5 �
YJ���tǈ��s��"31Ϊ6��K�i;��3�����%2a�XJ�cK�� ^D��0���H�X�~}�|���e&�%��P�`i�q�d^P%r}�+\gNF"2$��",
�y�ݟu�sN�Stꃄ�lI���%J;}��;�<�-r��)�md�>�O_�"�w�Qc��E���xr1�
�A��Q�K���p[���r��x0���~ԓ]y�����\�>��< ���U�`IU�󈔊Dl�¾_�d�I�n�ȋ�pN;�a�{�ZK�!�t���M~7>�m+�u
29�(�b�+�C	J���Ya�c���z�����E.�5N�zD[�>B�]�R,[(��;}����G��_U�x��bCM��#׶d�+�`��Iea G�Q2�"���g= d� M��!
�gn��:g�yٯ�Ȯ�P���pC)�!8�١�����x~<�9-/X%?�^ �KlV0��t��j܃r����UǗ��KK����%� |��䅻e�1n�����س6OS'�`Y�� ��=��1���8m'=U%�Xx5��q{,����z^����w/6�f����U<j����(͏A�s�u�~9|�|1m��i~��ݠ/D��5�3�u^��;�1�b����
"���M���>B�X?�f�2]�^�v'J_�
��
�o��d4'|=UCC��Q���a�*Wy��G��Q-I�"7��FR����Yo-Ee��`� Iˌ���e})eG�dqMDF��N
z�=F"���)� �8�KQޱ&��?m�z�A�	�[�qz8��D��\��}#�%�|=��WQ����Ŵޤ�N�#'6ݾ9�>i�e�QV1i	fDY��SԸ-<s A�u�VE�
@PYߣ�$+��D�0D�J��94���l���&�X�B)��S���e�j��)�o�g��IsT��9*$YiU<qȉ퀆����N�P��"�+r�U@�����2����WN;ށ��JAzQ���Cx,G6D>������.q���@��E4���2%j�M"�7U3�z\��a㒪x6Z��p[�k���+�5�����ɩ����D�(w��g���_�����n.&�5X`~����bnP�>B*� <�SI����ÍW�dVI������\z�-�,!�j������_��[���ܿ͸z*_k����U���:8�̳d��-W����7��(�6P�������w���ywfM4��=oC߼H`�os�͡�b��7�2�z��m�\?������/�ûO�.�ϖ0l�WO�8^S"�D�55�Q�o�tL7t,�>��\��^=�&��������|v<��h�Y%F���ߞfT(�CFӽ��y��˱�1`�����=Au�3�NW�XAHg���jkl3��T�օ�nt[?��4�;�~&3w�|1�S$�1!����$&}u��=>�{@6Q��R- x�$�CD��R/Q8�����mc��j;��[/��o�:-=!��d�̴���8Mz��1'z�w��pd�G衹(��C��}�}v��P���eH���"s��e�@M�aVHBN���%�~Ĥ��N��s�DXH\Xxi�
�������ů��D(�����)�Z�#�T
ҝ�b����1hĎ087_cR�8dpjw�f�*�^'1a̾(�N͢�(���?
!�=����"@�DƋ���Đm���� ���C���k"�<���r)���(�`8��_��$68\$3Ƴo�t`�@'�D�نi�g�4�#V�l���b#�xb!�[���&�xh|������"��I�yS�w�k.�0Z�e�l���Ew)J�⼪��>n	�L��M�?�Z,'������Zi�[ܫK{��dU,Џ���U�4�X��/G���āG��	�/!N/9~p�� �����ӒxKQ/3aKN�-�.��|V��V������~k�w�d�_S�ݫk�\��K�J7�����l�F��XNl��j3~nD���m���?}���,�z�j��2���v��2����M�C�߶�x/���Ng����$N����ZA`�f07'"�`$��/�O�����$��$��S��!�H�Q�4e�ii���N�p����"�[��1�( �~E�{ (��"E�$R�E��4��ݤ�o2=�N�[j�&t-,����):����;yf%!B,�i��..k��]��BCP���'���Gv��P�<�N7���� %J��Q=����i�0���PDZ�ee��]�'��,�p���=4g�Ӏ�3
����7�`d����W=#���^�{F<��q�R�S��IY���Ϫ�d~RH�5%S1�������*lˌ�@8��f�M�q���`2�p�!�8pR�~� ����DF�P	[D�.'�,��3%�g�OM�����B2�4S#B���!�:�f��Ch�)Y;;�% �ӯ��j�L�L����P���]��6t����"ϖ��0�,����g�(����,&��FZ���K�L\�O["�y���m�%zXР�@5�si��+~u�:?h�`u��2��7�e��i[�d�({�S�bO��[E�G�xq�|���vj����� "�}"�[!Ҳ�=��ɖ�F;���iOJcN�Zw�4���CK~�RS5T!ؓ&*�����<a첃	������Ϥ�T��k�����b����h���Ύ�Y>S8���],if �\�XhMf���]����
�RR�R@����o��Dw��$P��v�`��Q����������O(V�Q��<���:o~R�ՂN�W��F��^�aTB �C�����]z�X� ���t�����|\]��{�v����Xo���d8[��x�� �3�p+%4���Y+�nq)��m�
½;�a�U�Y���/*L�U���!�����G���<`����)M���}\�s����Ms
��pļ�\M�A��M%��|�[���ɚG��m��Yr_	u�%@XV͹Vkw'���ח���	�[��r���9�!@�#�f���Y�-j����PFef�db�~Q��j��"l`l��5�{�aT���C����%0е�0�fԓ6ic 擴�Ll{��Ts��x_��k�Xڬ�k���!��*�-���4�G�mj.w����=S���K�7�1�C!������s�܋� �"w�{�6Lu��u�4d�>��7�'�9�H O3 .�H�I�jR�$��{��2A&�{e��)+���m�ʓ�J>m�#`���F��P8,6��{9�l���7�Mioϝ�/7��w�o��<DEښlm�V<M�#���f+ry1؊5a󾾈�;������/��?��tK�^~��=B�Hp��<n�O8? ���󟹏_>�i�~*��|lzP!���<l+lE���,aV�J��]LvaR��ۛ����"� ÊZ/y�]tNw�����/�����{��y���ۋ��A�n%��n��U^κ~�nZ�#b;QtH��6�UcڗU�M{�85(b�HK2:2����4��::ɮ�,Q��WL��K���
����Bpމ��9�(*�+%�h�
Y�fFԵ(4l��1XA�3̟4{� v��� �/�?��N�7Ѭ��ۋ���5�/Q�akW�����K�A���a ��5<� ��{���W��!�g���ܮ�N	�W=�
L��c��N�e�DY<BXFZ+d���?AI|����>�qm��t3O�Z�K���Z� ��B��P��0�u[X-��0!���Y��'������5 n�%^�5�Q��걳�[ç[��������//�?^�O���o�!��;H�	+�"�}ND�F�ϸ�f(O��E�ņQ<�9H�DS\x�'�?`Il��)y�w�E��k'nq���k7ME�4V��dc�,�F�yRRea�U ����\�
>E-qcm&�lu;u���O�<���tqd�.�@�0�S�)u��p|ڳ4X�f7��;`��[��N����b��N�׾1`�|�e��m���؝��D]=�>���۬��g����`�W�����۷��[����((��q��.��ig���NQ��s�
c��Ѭ
��b�Ս�"�O8%۹/ڧ2����
��V$������S��ٰ?����؇[d�&�^*M	z
����s�Dё����=�)�l[�^�E�,���TLj�k�;=���$|����hf��D���u���&��sg�N�*!�,E�z֟�e⢦IC����$�k���]AbCǤ?8q3ك�)�'L��+��}+[-Nd_b�K����n�l���Zy��C��.F}�<x̻�D������r̖2 ov=3	-�\�h���h����(:�v�֋��w�3��la)Z��'�ޥ�G���-^_Bo������e�!�yD���F$g���y�Y�{D�d8�fʭ��i�EU_�>��s�o.��G��;��[������Dߟ��P2ϝ��6A� &CSe����	{O�٦�̍���������0s��h�Cp|���se#��D4�|PM�Bt2p�P_�>9�({�`���1 ���;
�꒒�4^�����+XaR��n�=L���@���SU~ �J�n���ŽFR���;�U�Y�׆���	㧞~�{�^V�W�����b�XNf)�6ֶ��.�^b"z�0>W��*��Bqu�[����wb�#�e�rX�k�T�/{)�i�tW��n�1��G�s���\��n��G@�'aR��fl�RU�Um���}O�=�W�(Vb�h5�$��@V��R0-ذ�K}�5��xa1����ļB��,;�>����9~�^q*���^Xd��j,,O�X����"a�2�E2 ����(b�_Yv�t�S0�����寳{1��b^��
���&Յ�ӄ�J� ��W���)9R����_\W���������a'����I���y��{\�L3�e���|��Fd$�tԠo��<��[�fOV��xx�|�;���ҵW���W�Ɓ
PIm�)��bl���k�=n_���	�	�Ccj�򓨧���ά�2���wdO��h#���W�3�IT��-<��<^}��r"5xGsO}JC9�� ��)��0�(�A���\'~G3T�B1>l�D��p�i�%�����
�{Ч�^G���a�ۦ�x1�ln����k��_�1h�2*�vG=�x5tPv|K���O�Dɀ�[{�/��<f��+��v���r&�Yi*r�E�*k5e�ڝ����8WՀ]����(_K�o��8���'O��r(�b1�&p7mzE�L��G̗��(zf�-Cw���~Pe�������,*���^�W��V���1D�hӶ�/��ӫ�jy�����ko�q�M�Eu�	������?~�Z�гn9��w��Λn�CՐ��ۮ����n��5ZNɤ�"�Z�]5v�^x�y�y�]u��:���e�����{{�`���p=2���1�<?}~�t׃z��I�?�M}���(�Wq	�D0Z�>�xhd�nc(�jf��`������3N6��2�/��K�Fs�`�b�i
�ts��}�%�*�+b�r�,���</V����݈�|�T.f�b��df72�'��f2�$|ڕ� �L���g�Z�I)�0O�\Mg�}b����p����� q�?�>&��f��|V&�V(ћ|���	8L�1!�P��'�҇�Mzt� �B3/�����&]�(r�+�H�O��fm�N�� d��v���
Ф���T˚k{���C���ˍ|���}i��Dn���Wt������Q\�v������j���G�;3�R��8�M��c�B_:���S%�c������
L	�5�b���?"��9
��oL�60�(��V)�I�W�����G}��D��k� ���kd��D�����+Ls����W����z󫯸���� c/�@A_ԮW��X\q=0�زG�֐v���I&�����CPTu��>�^�jUa9{�Ld�_[k=�d8�[�!��
 ���QK�$v��
i�<�{���AA�+��-��U[zУ�w�����ǯww�"w���m��=g�WG�#AG��vc��Z��$���Jl�x�nLζ�]���.��o�(�;O-O/o�n\��m�ōBk��	g m���P�ɺ��~���z����)Ħc#�t9Im��9�V���f<G ����'��a6�O߆C���P�^�;b>���udUM]:��
�I��h��1F1���S�����xA'����"v�4Ң������K��/�8ǆ�����Z���:���C�TV�h�&@}��"k+k7�p3��$�1O��pt��2�;���0�qqғ4U����t��ej+��,Z8�<�'��60C����
2��w4��S��]�x���m^���=jy���?�|.�c����
&.��z��ipG�~��=�~}����6���^���� }ƿA�N���6�pz׏��[��4~e��3�m�4�`�	"����c����s��>�I�'�9=�5�Ľ���Jz&���zx�͗�78o��t9Sa0Fj�a�fy���������WM8
(�I�t��y�� �Q���{�V�y*u�K�Kb;�C��TyfZ��ԋ����(�����iBx��-��K�@a�����]>\A�	K(r$LdmE� 
�AO.�'��fC���I.3|1r��j��C@3d���q��[P%,��^�B�^T�(�Gzou�};��I�U�Ƚ
 ň#�j��}�]�f��fB��<��D|�$0�ڮ��jr�^�T��j����i�g��"=F�o!Q�Kb�?�\	����A߶1�4G�w4��j���*.�1�S6xzU(i��~/h�C��t5pL;�������	���$�I5OW*���d���2a;�1����]d�&#R���ľ�:2XY��7��MGűq�g#'w��������=$����O�;�7S�Bi���ރ�[�ѵ� �"вO"���<��'��۾����=|*�Ou���x�Yߍx/��� �c9��������"ji��GZ��K���BH�y�HF�)���fZ��H���X��@{��$6���b����E4���E�Ë&��(�3Jw���ϰ<�3#��m�:Q��@
-"Z�1}���� �,�S(�����%�x^�ɸlͬ10D��-�[�v��Ic3�����g>2H8ۊW4�{nzE3E���X�{�*4�Al)���X�q���)F��F2ΕqPך�:�L�1�r��2Y];	VS�����J5��CT�&����v��ҜsN2�EcѦ_C�ƫ����T��J4sP18v�Ѡ��U�d�F�)�6'�QǠ%wI�7uFQ`��7jm �˚,�J�*�'���kz/�aV����޵�`�O��c43k�eͦS�h.����J�<�:��\μO�AE H2�ɐ[�g�(F��0���,+��@
��Y.Ч�g�]�@���z\'L�#Dg����<dE��^=�����J1`��b�T�^{F<ܴ�
��Anh�SuW��0�'�� e�Ɋ�].A�h�/�� [Y�\�~)�b���F�n�Pz7�z�
�f�#s��)b�>�A��*���$/3���<u �?�}����GM_��ޛ�3q��k�:�í������������G�����<5?�|#
���K#�#��	 g����q^fC�qA�#�"y4��no��s�G�W!Xa-��H#��Y���ب'��;s;�W�WMXZ
��,�P��*��؆�>]��H�1�u��A�9����	��6*d*���[`�y��fvz�`��)�o��no?<���4��?}������<�����9�
]0���P��������Q*f#�d$��Sa�����q"�?g��i<5gJ�dn�I�]��L�e�A�	��h/�7&E�:G��[����[;�'��wM��=k=������������ո�M�xvb�np���L�%��,,R�O��<�G�/��$&n��Zc��:"�I�yLS�L�S#�s<�-Zk<�+�o;�k;���'_\�w������[\yw���t�Mj���80L:w�%�Z�K$�.�;�>�d��]�:mmpy���b����'?K�OT��:L'�Н����|]f��G�����8�ٜ!�}�i�{�d\�������d�K��/�]�n�0�jR�������y��u���6�1��|�}t�Q۶~��#!08FY@I�H���_�~$o.����q�����ܫ��Ɩ��~��u�=a��ɮ��l���"0A\�$�����͎#�m�Xέ֤�1�8@A�@�Z��}��l����3w�X�1Y][˯��-zϜ��5C�y�=5NT=
�sK�`���:��;���÷�������	�Q��i׭9���C���οkUR��l'��,�bH2,���p�2b��< B�x���-{�t�{�̙'��e�bL�?X�pV��������"YK��*�l�T2��z����'��zR[J�<�[�NoW��ى�D����{�L|r�ĺ�&�;�r��am�A�('LUjl��	Q�̈40oF��g�7�\d�2����&�V�����8�a"l����A.0�"{U��c�{`�v��"�*��;�6�j����{����VY��an8^��h��d����dE�����p]���W]g�u��Kj��#vz��7�P/H��8������w�P�tՆ�?��WOȆ���z�����v)�/��?W9�V������O�Q���������������?���0�Q	�>*���#7kщ/��A9�ݤ]Z�^Ŀ��´\���<z�d���X�����ȅ�\,{�3OG��n|���p��_�b��# Q��v��K��:Qf=����G��lz.֨7�`Ͷ�X��zMwSm|UL��&wmP2�^N�~�c����g/���@���>���9��֖�NP�yD�>fn���+KrG��:�.�
�$1��f�#G�.��V����e&H�eR��KD�K��&	 ����u�`	��D��B�t�'��|�b��C�,@R�T��ה��^���k�PV��d����8�;0�
!NG�|�>�������������ۆ���b��'�#c�ZѠ�6$]�{Ҥ!�#����N�h�%�=]�v�N�4�D͹���cjU�Sh ��!�g�1Y�7w�=[kH�3����ض1L��n�@mI�VI��AQ�00]�����T�7+r�2�ފ˥�[�Eo��"���.z�V�=F,�|�&��VM*0��Em��b~]�EC_І����˙����#�M:�&�~�|�8��a����$�����)i�) �X�|�2�ۣ������O���t,"�l234�5 �-��S�X
���w�;FM�p5j� ��R1a����b)y#|�L%�)E O�$�ы��׾���[a`���>�az�ȕl��4��-�?]��IR-�5L��X<�E�m�� �AJ�Jð�{�U
�D�\��z�v��-KAe��˅'M�I9s��TX,�[f��*p�	h�����w�/����>$34upja���Ӑ�%v�Vښ"�2�E������V=�Bo���ި5��vG�nJ��TH�/�+�N;Y\�����-r�N��Ɲv��^U.	|���G$�29K����
r`���&��ڛ�Gu��Ab3�,�1��PU��4��0��k`�$�V!g�Ir��� �%�G��"��{ZCŲ튊Cb�2�9`R1� � 2B6�@c���}���PV6l�o�cr�+6�J��i�q���ы
�R���u�����a��j�}�D��Dx�&~�_��K�f�� Z�A�;f�餒�D�Y&�i�[�9��M�������2�|������:�2x/�5�M�M訚��g��vI�T ��>	)�3���o2b>�݉~m�vq옘�}q��X#�]�/n�����R�r�A�J��/��h�.�W[4�?	��)�9���Xt��W������r_��}oS�_ޝ���a��i��h ���T$�d�S�4��m��(�d��WӕtR 9�y��w�N�FgY$�t�0ХL�n�DݺX�G��f$�l�-(�F(gg�f&Ģ��x����]�T6�G��HE����A]��+�� )R-�h3�Z8=���B��  36���:/u��Ld�^h�B�o�F�ݱ�=5�þ���EB�E���޺t�P��V$�`?��ȳ��l)L,�^�V1-�t�¸xFX��*�+��	yջ�؉�ŉO�sVD�^���.����N���?���~��pi-a���֠7��Ǘ���q9�⍂��ӬO��Eɉ�7�4��j������Y�&����C�2>;�"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _UnusedVarsVisitor_scopeManager;
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectUnusedVariables = void 0;
const scope_manager_1 = require("@typescript-eslint/scope-manager");
const Visitor_1 = require("@typescript-eslint/scope-manager/dist/referencer/Visitor");
const utils_1 = require("@typescript-eslint/utils");
class UnusedVarsVisitor extends Visitor_1.Visitor {
    // readonly #unusedVariables = new Set<TSESLint.Scope.Variable>();
    constructor(context) {
        super({
            visitChildrenEvenIfSelectorExists: true,
        });
        _UnusedVarsVisitor_scopeManager.set(this, void 0);
        //#endregion HELPERS
        //#region VISITORS
        // NOTE - This is a simple visitor - meaning it does not support selectors
        this.ClassDeclaration = this.visitClass;
        this.ClassExpression = this.visitClass;
        this.FunctionDeclaration = this.visitFunction;
        this.FunctionExpression = this.visitFunction;
        this.MethodDefinition = this.visitSetter;
        this.Property = this.visitSetter;
        this.TSCallSignatureDeclaration = this.visitFunctionTypeSignature;
        this.TSConstructorType = this.visitFunctionTypeSignature;
        this.TSConstructSignatureDeclaration = this.visitFunctionTypeSignature;
        this.TSDeclareFunction = this.visitFunctionTypeSignature;
        this.TSEmptyBodyFunctionExpression = this.visitFunctionTypeSignature;
        this.TSFunctionType = this.visitFunctionTypeSignature;
        this.TSMethodSignature = this.visitFunctionTypeSignature;
        __classPrivateFieldSet(this, _UnusedVarsVisitor_scopeManager, utils_1.ESLintUtils.nullThrows(context.getSourceCode().scopeManager, 'Missing required scope manager'), "f");
    }
    static collectUnusedVariables(context) {
        const program = context.getSourceCode().ast;
        const cached = this.RESULTS_CACHE.get(program);
        if (cached) {
            return cached;
        }
        const visitor = new this(context);
        visitor.visit(program);
        const unusedVars = visitor.collectUnusedVariables(visitor.getScope(program));
        this.RESULTS_CACHE.set(program, unusedVars);
        return unusedVars;
    }
    collectUnusedVariables(scope, unusedVariables = new Set()) {
        for (const variable of scope.variables) {
            if (
            // skip function expression names,
            scope.functionExpressionScope ||
                // variables marked with markVariableAsUsed(),
                variable.eslintUsed ||
                // implicit lib variables (from @typescript-eslint/scope-manager),
                variable instanceof scope_manager_1.ImplicitLibVariable ||
                // basic exported variables
                isExported(variable) ||
                // variables implicitly exported via a merged declaration
                isMergableExported(variable) ||
                // used variables
                isUsedVariable(variable)) {
                continue;
            }
            unusedVariables.add(variable);
        }
        for (const childScope of scope.childScopes) {
            this.collectUnusedVariables(childScope, unusedVariables);
        }
        return unusedVariables;
    }
    //#region HELPERS
    getScope(currentNode) {
        // On Program node, get the outermost scope to avoid return Node.js special function scope or ES modules scope.
        const inner = currentNode.type !== utils_1.AST_NODE_TYPES.Program;
        let node = currentNode;
        while (node) {
            const scope = __classPrivateFieldGet(this, _UnusedVarsVisitor_scopeManager, "f").acquire(node, inner);
            if (scope) {
                if (scope.type === 'function-expression-name') {
                    return scope.childScopes[0];
                }
                return scope;
            }
            node = node.parent;
        }
        return __classPrivateFieldGet(this, _UnusedVarsVisitor_scopeManager, "f").scopes[0];
    }
    markVariableAsUsed(variableOrIdentifierOrName, parent) {
        if (typeof variableOrIdentifierOrName !== 'string' &&
            !('type' in variableOrIdentifierOrName)) {
            variableOrIdentifierOrName.eslintUsed = true;
            return;
        }
        let name;
        let node;
        if (typeof variableOrIdentifierOrName === 'string') {
            name = variableOrIdentifierOrName;
            node = parent;
        }
        else {
            name = variableOrIdentifierOrName.name;
            node = variableOrIdentifierOrName;
        }
        let currentScope = this.getScope(node);
        while (currentScope) {
            const variable = currentScope.variables.find(scopeVar => scopeVar.name === name);
            if (variable) {
                variable.eslintUsed = true;
                return;
            }
            currentScope = currentScope.upper;
        }
    }
    visitClass(node) {
        // skip a variable of class itself name in the class scope
        const scope = this.getScope(node);
        for (const variable of scope.variables) {
            if (variable.identifiers[0] === scope.block.id) {
                this.markVariableAsUsed(variable);
                return;
            }
        }
    }
    visitFunction(node) {
        const scope = this.getScope(node);
        // skip implicit "arguments" variable
        const variable = scope.set.get('arguments');
        if ((variable === null || variable === void 0 ? void 0 : variable.defs.length) === 0) {
            this.markVariableAsUsed(variable);
        }
    }
    visitFunctionTypeSignature(node) {
        // function type signature params create variables because they can be referenced within the signature,
        // but they obviously aren't unused variables for the purposes of this rule.
        for (const param of node.params) {
            this.visitPattern(param, name => {
                this.markVariableAsUsed(name);
            });
        }
    }
    visitSetter(node) {
        if (node.kind === 'set') {
            // ignore setter parameters because they're syntactically required to exist
            for (const param of node.value.params) {
                this.visitPattern(param, id => {
                    this.markVariableAsUsed(id);
                });
            }
        }
    }
    ForInStatement(node) {
        /**
         * (Brad Zacher): I hate that this has to exist.
         * But it is required for compat with the base ESLint rule.
         *
         * In 2015, ESLint decided to add an exception for these two specific cases
         * ```
         * for (var key in object) return;
         *
         * var key;
         * for (key in object) return;
         * ```
         *
         * I disagree with it, but what are you going to do...
         *
         * https://github.com/eslint/eslint/issues/2342
         */
        let idOrVariable;
        if (node.left.type === utils_1.AST_NODE_TYPES.VariableDeclaration) {
            const variable = __classPrivateFieldGet(this, _UnusedVarsVisitor_scopeManager, "f").getDeclaredVariables(node.left)[0];
            if (!variable) {
                return;
            }
            idOrVariable = variable;
        }
        if (node.left.type === utils_1.AST_NODE_TYPES.Identifier) {
            idOrVariable = node.left;
        }
        if (idOrVariable == null) {
            return;
        }
        let body = node.body;
        if (node.body.type === utils_1.AST_NODE_TYPES.BlockStatement) {
            if (node.body.body.length !== 1) {
                return;
            }
            body = node.body.body[0];
        }
        if (body.type !== utils_1.AST_NODE_TYPES.ReturnStatement) {
            return;
        }
        this.markVariableAsUsed(idOrVariable);
    }
    Identifier(node) {
        const scope = this.getScope(node);
        if (scope.type === utils_1.TSESLint.Scope.ScopeType.function &&
            node.name === 'this') {
            // this parameters should always be considered used as they're pseudo-parameters
            if ('params' in scope.block && scope.block.params.includes(node)) {
                this.markVariableAsUsed(node);
            }
        }
    }
    TSEnumDeclaration(node) {
        // enum members create variables because they can be referenced within the enum,
        // but they obviously aren't unused variables for the purposes of this rule.
        const scope = this.getScope(node);
        for (const variable of scope.variables) {
            this.markVariableAsUsed(variable);
        }
    }
    TSMappedType(node) {
        // mapped types create a variable for their type name, but it's not necessary to reference it,
        // so we shouldn't consider it as unused for the purpose of this rule.
        this.markVariableAsUsed(node.typeParameter.name);
    }
    TSModuleDeclaration(node) {
        // -- global augmentation can be in any file, and they do not need exports
        if (node.global === true) {
            this.markVariableAsUsed('global', node.parent);
        }
    }
    TSParameterProperty(node) {
        let identifier = null;
        switch (node.parameter.type) {
            case utils_1.AST_NODE_TYPES.AssignmentPattern:
                if (node.parameter.left.type === utils_1.AST_NODE_TYPES.Identifier) {
                    identifier = node.parameter.left;
                }
                break;
            case utils_1.AST_NODE_TYPES.Identifier:
                identifier = node.parameter;
                break;
        }
        if (identifier) {
            this.markVariableAsUsed(identifier);
        }
    }
}
_UnusedVarsVisitor_scopeManager = new WeakMap();
UnusedVarsVisitor.RESULTS_CACHE = new WeakMap();
//#region private helpers
/**
 * Checks the position of given nodes.
 * @param inner A node which is expected as inside.
 * @param outer A node which is expected as outside.
 * @returns `true` if the `inner` node exists in the `outer` node.
 */
function isInside(inner, outer) {
    return inner.range[0] >= outer.range[0] && inner.range[1] <= outer.range[1];
}
/**
 * Determine if an identifier is referencing an enclosing name.
 * This only applies to declarations that create their own scope (modules, functions, classes)
 * @param ref The reference to check.
 * @param nodes The candidate function nodes.
 * @returns True if it's a self-reference, false if not.
 */
function isSelfReference(ref, nodes) {
    let scope = ref.from;
    while (scope) {
        if (nodes.has(scope.block)) {
            return true;
        }
        scope = scope.upper;
    }
    return false;
}
const MERGABLE_TYPES = new Set([
    utils_1.AST_NODE_TYPES.TSInterfaceDeclaration,
    utils_1.AST_NODE_TYPES.TSTypeAliasDeclaration,
    utils_1.AST_NODE_TYPES.TSModuleDeclaration,
    utils_1.AST_NODE_TYPES.ClassDeclaration,
    utils_1.AST_NODE_TYPES.FunctionDeclaration,
]);
/**
 * Determine if the variable is directly exported
 * @param variable the variable to check
 * @param target the type of node that is expected to be exported
 */
function isMergableExported(variable) {
    var _a, _b;
    // If all of the merged things are of the same type, TS will error if not all of them are exported - so we only need to find one
    for (const def of variable.defs) {
        // parameters can never be exported.
        // their `node` prop points to the function decl, which can be exported
        // so we need to special case them
        if (def.type === utils_1.TSESLint.Scope.DefinitionType.Parameter) {
            continue;
        }
        if ((MERGABLE_TYPES.has(def.node.type) &&
            ((_a = def.node.parent) === null || _a === void 0 ? void 0 : _a.type) === utils_1.AST_NODE_TYPES.ExportNamedDeclaration) ||
            ((_b = def.node.parent) === null || _b === void 0 ? void 0 : _b.type) === utils_1.AST_NODE_TYPES.ExportDefaultDeclaration) {
            return true;
        }
    }
    return false;
}
/**
 * Determines if a given variable is being exported from a module.
 * @param variable eslint-scope variable object.
 * @returns True if the variable is exported, false if not.
 */
function isExported(variable) {
    const definition = variable.defs[0];
    if (definition) {
        let node = definition.node;
        if (node.type === utils_1.AST_NODE_TYPES.VariableDeclarator) {
            node = node.parent;
        }
        else if (definition.type === utils_1.TSESLint.Scope.DefinitionType.Parameter) {
            return false;
        }
        return node.parent.type.indexOf('Export') === 0;
    }
    return false;
}
/**
 * Determines if the variable is used.
 * @param variable The variable to check.
 * @returns True if the variable is used
 */
function isUsedVariable(variable) {
    /**
     * Gets a list of function definitions for a specified variable.
     * @param variable eslint-scope variable object.
     * @returns Function nodes.
     */
    function getFunctionDefinitions(variable) {
        const functionDefinitions = new Set();
        variable.defs.forEach(def => {
            var _a, _b;
            // FunctionDeclarations
            if (def.type === utils_1.TSESLint.Scope.DefinitionType.FunctionName) {
                functionDefinitions.add(def.node);
            }
            // FunctionExpressions
            if (def.type === utils_1.TSESLint.Scope.DefinitionType.Variable &&
                (((_a = def.node.init) === null || _a === void 0 ? void 0 : _a.type) === utils_1.AST_NODE_TYPES.FunctionExpression ||
                    ((_b = def.node.init) === null || _b === void 0 ? void 0 : _b.type) === utils_1.AST_NODE_TYPES.ArrowFunctionExpression)) {
                functionDefinitions.add(def.node.init);
            }
        });
        return functionDefinitions;
    }
    function getTypeDeclarations(variable) {
        const nodes = new Set();
        variable.defs.forEach(def => {
            if (def.node.type === utils_1.AST_NODE_TYPES.TSInterfaceDeclaration ||
                def.node.type === utils_1.AST_NODE_TYPES.TSTypeAliasDeclaration) {
                nodes.add(def.node);
            }
        });
        return nodes;
    }
    function getModuleDeclarations(variable) {
        const nodes = new Set();
        variable.defs.forEach(def => {
            if (def.node.type === utils_1.AST_NODE_TYPES.TSModuleDeclaration) {
                nodes.add(def.node);
            }
        });
        return nodes;
    }
    /**
     * Checks if the ref is contained within one of the given nodes
     */
    function isInsideOneOf(ref, nodes) {
        for (const node of nodes) {
            if (isInside(ref.identifier, node)) {
                return true;
            }
        }
        return false;
    }
    /**
     * If a given reference is left-hand side of an assignment, this gets
     * the right-hand side node of the assignment.
     *
     * In the following cases, this returns null.
     *
     * - The reference is not the LHS of an assignment expression.
     * - The reference is inside of a loop.
     * - The reference is inside of a function scope which is different from
     *   the declaration.
     * @param ref A reference to check.
     * @param prevRhsNode The previous RHS node.
     * @returns The'use strict';
/**
 * @param {string} prop
 * @return {string}
 */
function vendorUnprefixed(prop) {
  return prop.replace(/^-\w+-/, '');
}

module.exports = vendorUnprefixed;
                                                                                                                                                                                                                                                                                                                                                 �% ��D��_��G���sع���{vs��2s���|���~7���B���_�Р������(o�^�l�_ΚNz?��0w�c�e��D�r���I5Oq#gk�$/���V��w%���#D���)>��d@�a߶)"U	�w~������g�q%��gh�	kw�{X"vH���� w�B�=��l�y��]�nf�B	���u���k��c� ,��SU�xy�ϊy�@�$ݛdR^y��B�:�:;F��&��.J� &k�&��Tz�{(�m��u�� S����1�v�H�"
�2E��<~�O^���䐋5������ �Pb_��8g�Տ��]��?�6"��l�`����J�G�3���'+�J�9+IυH�6�a�F2�eD�n�J��F�����.�7zo�����������/_�/�owC�=�L^�%�[H �o]�?����5u�n�5Uć�m��]&��at��_�п�w�����؅�������G���߽����5no��ޝ˃㑿�����+��S�I)ŷ�R�=�=�Oǔ|2Ÿ|f7r/-y���1m���l��di	Z��M���g�%4Ad���"�T}�(��-�3��!�o�ݲZ��KS�r��f�㦳�c��C
	P���pĠ
4�}�7W*��S�>��\�(�S�����z_��?�|��|^~�۰}��u�����}dq�,Y1g(�����̆�3�ӝq�C�+��q�t�m���-�p]���#�����p}�֪������W��9��B�����e�d�V�R3�d���Q���5W;=#r����%���xS2e�ĐW�7��F�*�S�X���X�stP��D�%z�Q������]����tN�B�����`�d ��A�z�;E��l��yWg�bW��f�.]f�mh+jC7��t&�ɹ�kd��d�9��@'F���T�'�z���ûs�y���7;����ףIOtK(���p��\p������n`��lCЃ��f\\�UP�Pɏ׻x��^x)�M���=�b[��W�T����:|]"�d�	��t��y{�z���d���o/o��v7����ͥ� w㖼qW�&�~؄�e8��R3r��k�����q�%N��2���,υ+rh�	�U�{�{�_����9�1�q��8��ESo=~Yf�Gɧ���������`�m�eĻ�Wqs����M�x	����y��x���}C���;c��O?�������A���b�:G�{Wg&sό��w.Sub_a�����iB�jР�v����~�v �h4��J��*b��'P�2�����v)�C���{m����t�gn�WV3QG�
C�C��GC�U����z8���˯_~�gEZ$R/�V����&g/ڀ��{�Y�qy����eR�|��8���4\B���3��Rc���1�����C��͸��U?���RnO'�A7wEX)T��|:?�����x�'�`?�y�����.��1��f�c1US{/H�޷��^��>�Br1�>h�af��r��j�5U�׹�����.x/������ lm>*�z�)��X���tz/������آjЂL�IuPz�x�����Eo����砃�r1�(��q):�T=[5���*6ֳs��i��e�ŐZR�9Y���L��|���J���w%&���h��<�*���U��z�����<N�����Ɗ�=m�����Ӕg?�É��qg��ߟ$2pt�	V��L�)�׀	v٭�2��BT{��GT��"�;��>S?�ه�L�Y-{M��GZY@���������h��1��G�$�su��2�7�,~?�ï(Ʀ��?�d�~�Q"<WUx����h7���AS��qߖ�����^����U���V�а�fZA�W�M�ivN�4'Cu�O]{J���x[𺗐�`�ꌔPC��5����R��ނUk5��]ԣnGo��$�
�V�B ��,��^�Md桘�����d3���.��d�e�֫�
&J���e �����~RZH \S
p9�f훻�TJ��������D�NM6�$�7������	U�4L���6K���c�:Kr���\|G�Q�K���'I����u��Ek�<�R-�-T���&�\M������/�yco��
'
���	i�¢��l\#C$l��{�2���R�w�.ثkԫ��8v0�f�h���"(W�b@O
�.�:��d��\�����m�H;��b��`�6X�!�P��6�d�"��k.�k��&3����4W.�G��k���{���w�v�UHV:.��T(k��9�,�S�bjyҤ��s��\3b�Jm�s~���S�X
@�5�A�j�yA"�z���wbT�/L�]?Za>~}�vg��L��� ��p��jx����x_iۻX��U���ĝ�W,�n��E?>1�ƹ_�D��Q�?I���CD�@ Dp�'N�
�Y��0��J���6�p� �ŭ���y�c��O�}��|��zY�#����}�z�q-X�=�v���?hկD 
�:t͢T&r'����3"�΄�=#������KS`�����^�ë�g���$����S6��е!Ŷ��m�=��E���LoN�5��\��t��b �D�ղ�>LF��G���4����_�
\}��r�6K�Y;�A�'9B_�D�8������s��χ�R�i�)ِ��s9E��C\�Wi0Z�9�Q�����C<��g�����ޜZ���][rܸ���U�� ^��Y���9��O�ƺq���̬)�ݭ8��[M6A<
UY���TDT�mZ��ķ�<g�\�_֯��O_�� �{��#g���t���ͣ��V6w.6E% �G���\D�(L����Ob�F�>�;|j�˿�ؐ谿�x��J@j>( ����'��,c�c'��vp�C�� T��g�a���+�4�	�ɸ�-�V��ͤ��T�^��̡�h>��\<���b�>�~o���2V�^/Ï/�Z�F�(v��z�������;���g�;���EA������뗳�ҫ#��?������ar�Os��Ô��?�����A^���e��?0�3��i8��B?�2t�n3��.}��{:��m����<�n�y~]��
O�V��k(�����������_�_>_L��O?Fe$ P[~�*~�<���׈�A���@�:w�A����}�B�;�,��}��E,:�bc#_�*/oGW鶌����-�M�j��=+Q82=MNG�Y��K�,:�zNV
NWG��:��8gD�2�X[CT��I	��L2��S"E��fN`�l�bZ��)������dީlɟ�j��d{�C��p6_�!J;�*j���|1vs
�ޟv4�7c|N�$��b���B> XY���ϫ%�dQ-�rm��?�$Ďms�NBpI0�{���[J&�\��m�q딈,��פ.N�K��(_��9�?|���~%���I�D=�N��9��#�E"w��b�?���k�EO� [�$�Rs
-��Ps�L{��F��ģQ�G��1��5E_>�����������d)���w����%�=��'���J�D&R28"*����6S���{~�ȿȳ�j�ļ+ke�h?���u<��Z5������w�̞�Ev[.K��������`���a�s�~����7�`{�=����)�2��ҟi���ҟE<�h�C\�u?�(�K��������ë��k��-lO��f	YK�j�M3�����c�ŋ��N���?�[b�M{�f��ç��ח��/�����o�ϼ�ݙ��9�Գ�m�%�1����oM�R��^T=Ή�p�P�H��Cf�f}!�وy��8uK�+�A%�5�q��kv"�2�'�Hj(�a������a�^��kC�������@�Ҝ=��'��z��,j5tE6�7�!�'����T`�`���Z>\ >��9��J%�S|��9i�4̃�%�# ���r\16�fP(CO	,=�)~�?1V�C��-5���-O���3�:#���i�h�j���n�]7/vyK��Cq[K�L��Ogw|j)�=ڌ&)P�l_o�x��x��UU�ua��؝�.��&+���>h��5Z��K��'�y��O�c;��Wu<<~�x�h��?�}��H&'�V�����L�� ���=��p�
�.������S���&�j;��V$?�~E�'�a!٤�Gx�Xi�4�r&����b ��Z|���<fw�������ђ���`1��R���d_ǰ}������ (�m�C��o�T7��?b^� aw���F�c���}p���~���2uIW\:��;Ϛ��U���XU�(���D�N׉���چ�m�~J�K��	~�QH�s�&��ma�E��A�d,;�A�����(�n�:-���e[/�6/DS�"�Y�����A���վ7ڹ�)%�,�d�ޓ��6K�~+S��Ale1��`�D`b��\)��_C� �C�m�Dʩz���u�:��W ��(ַ1�p�h�,�Y���۴�.b�{+G��}cJ���UC�L[��<�A9iŬp߲�%�W��Cg�_���B�C�w?�[M�Fg����}��w��/c�=b.I����w��A拚��S��V%W�$N>�:>X.��	�|�C���Ze�) i��5�z���z9�p(bQ�3-ɓ���mg��~bV��)�w�R�+���z��d����M�G�}������¹�y'�w�)(ͽ�6�B��M�ŝ'���fJ% ��}/��if�xNݏz{�_�M�>9��d���"��o��q�}Pua2t��>��;]5�]�q]/)iK������VC��I��j��E5�Q`�&�P��r�v�b�Be`x���q�yt=��`^Vncݜw��9�f�>y*FwG�i�K:�V���h�
�Ò��&��,g���l/�Wn'>��->�{�P%��⻈��;�}�5/��Tj�,�%ћb�n�]m��ɺ��e��x��A�y�i�v6k�#=e��̙ch�fa��q� �w6��ȩ������g��� ������a���wϾT�HK�S{h�M6T8&_���ٮN�����>��� @n]�d5v�s�>�9X) ���Q�ip�%�i�1�Z���Z$Fy��oN�@���h?����ɶ�����!���:ܣ]Z.����X �"��]F"��:� ���!ڝ����엎��|�	$�k�$�r�y�Pg(��>�x`�z���0Y6�l��]4��6�~�m�-F�Dd،�"7��D��d~���[:��2;�*��p�ы`8Us�d�'�xW:4z
O��<VB= q^�b�O�Dn�Vb��� xngH�.��|�Q^��������wݶa�9��E�00)�����w:*�g쭓��:
Vc�־]K�w�(kl����S	��_R�������q2?���2��V�km�_���ScO��֋�������{��̄vJF��4J���!��b98�O�^�c��Z�h��Q!����]?a�ٺ;| y����0�06����谋%*��&�>�6�XO��#���+>�ZN����7L���Y������	����&R�$e���~0"���)z^��4iR̎�'�]u7�fqu�`�2�d�Q�V���x��U8�F�����S69T��LD��� �L��Z��-�5���3x�p�l�&ce���zyR�+�d�ZG;����!�n����|YSd��e� �c��9"���1�m� j0ٸ�,�8���W�]�����.d�%i:+0:k�bِqT3�������G�5ZbU��l���S2mOZ<�Ѯ��/h��+��jt,�۠�����m����Z��e�Dp��T���82�+\H�//��|=_	�D�e�Cc�"�,��8.��d�f{͆��Gz��đ��45]�:}X2٧<�C�v�1� � p|�B%O;z{xF�7�� ��l�h��$�a_<�䄺�����$��Bl. +��{s��`������h��JF���bR/��w<Ǉ�����������>�q�»/?�ɇfz��P�p���"�yS>��Q��@:wlN�X�A(/1�>�I�djc��Z��E+%��X��\�T\�
X�*�[ $�%��I�i��IdH>wb
�<��'���[/8�sP��d�}�CIX������:�<Y�B𰜦�1
�1�H ���>:�		uv�cdl��Y:TI0N�m���dW�p;�hQ�^[(��'�z����Hh���J�p��i��x1��I����A�sj�ܖ ��R��'��Yp�C~��Q� ��JV*��ݬ�de�^���Iۆ$��"�܎!��1yiF2��T-�o���WH�Ce�1[HO��Ч;��B9���\�m�)��S��6&�������`Ё�0_ӝ�O��$�Y�i�����8�P/w����yp1��|+)wu2X�C4q��Q�2�L/�L&�<��1���F������[C:�95�v�C�����	(���,�v���N�2����F�ly�Y)t��&���맧�?.����W�+g�L�~�D�%e#�IF�TF�Np�ʞ��O�#h��щ`�$�CޑĖ��������S�`ʙjۡ��x��}����,�҂�N�"�l���ʐ��C�gċ�J͒b��^~=�x�֑y=��#"�$�g�dQ*��Ru��;:'g��#��	��l�r�3�4{�L�X��D�A�d
I��*�`m֧�H�~��ć���i���%�n)i̊����S��`�'T:��)��P�|�m�'q�m�*#�tL�e2Q�b�hꆌXC-S�6�#9	м�	�����@�������D�QJn�mK��m�V��I�ʯ^�c_��WYz�f�<i�ӚM8K�����K�#0��N�XZ�lB�2V��T٬H�݆�I�����'�ΐP�v�LU��K��쯟�x��1�ss4�yHa�5Y�9��$+�'M�8pz�mن�-��P�Cɛf�m8�I	��!����}�b�J.���#���Z\�GS7St��@�`V��0�0���jAHaGGO���,�)�PVs���$�������@ ���1��M�'$���8m�`��J�H�-��ڬ�.v�u�Ftv]g:C��ÙG̪�X0#�I�/�,89��5U��{��^	�C2�]�0��"�"Wv{h}+����9��_S��!�B4CJ�	���u����&������)_���&ח�+�s�r�pN��*�ޚx�;����g��h��ۊ��C#���>�'�<�z�	�lgMF[^j�Q���(zJ01pw?�F��:f�֣-�9�xE:�Ұ�Vg�d:�`��,��fۙ�j�M�t�ǙAqR5Z�l6 `����7#����D�:�u�ne��I�w�2��o}z�rX��G�r7X���'O�;O�qG�5^�F��v^�M[�h���?ô�'0t �N~�;.[S2�g���ׅغ��>�j��gQ?�'_xp39v��doz�����ޜJ����EiҜ�_��Ð����G��@�N�M2Ѻq�|����5��}��I'z��lrux���E��C���k�d���"ȋ#=��K\P��77����m���&��7#���pH5J���w�������I�;� T������2��`Z��F����c_�'����a>n�*�z��y�Re��!�ӳ�ئl�+a�֥��=DdB�O%�*�b[$��S�gp�b��(��&�Y&-wtZ�`K>|�{%X��J��ւr�"����ð<=_���W�f��.wnH��<0�?�E;Wq�3��|��+�K�Lp�<�|~��s��* �;��"L�r9h���9o�֖a'�i��,�Ŕ%m��7��ߎ:$�o�����O#��b��p�N-<i8�7I&�@a���.6bT�x%�QlZ3y� U,���8em��G���	�un�L6Y/'4F�%�я1R����2Y*O��9�@�7M��1�����������1xsxk�������9���9o��d�x�&�3��7ʭ$���,^"1����v���G��:	����m��B��g���.�X^h��O/�N�{���8nс0~�" C?��?��)G�av8�(ih.�e�^��/r�nKų��]�uC`��i�0�3�,��4�`{���}�x8�x�W�]�/	O}���p�u�pM��P��2/�졘/@K.��mD������!�l9��C���M�'d�U4��2��m���ָ�S|"��s-���4��� ��4Ʌs�*wi�Z��<���E�=���l��������ɿ��n7���	$
mW<��]��X����F������2F�c8�F�2b�����|�3�3��L ���_�|F.S�����K�8��V!m�7G^Α��[&��iqc��Y���xq��ZġH�{�ր8�'�Q��n��@�Im[>*�$����bK�֤)6��P�*�N�� �HWFP�S����!Q��$�6n�;�R���oє���69�9��џ0Y�X�2KP��r
���Ę�sѳ�G��qS?��p�/�C��v#�!/��$�O��ȷH^�-�v"���Y��r`/��<*(�`�vL�P�֣��X��&�,�g��x�0Vd,Q`ֱT��m�0e������Z^���A��	��[�v���^��a���s��-U���Uiz��ե��/O���ǋN ���nu�8n�7 ff��l�!�H��[9��c0�vX�X�4���cKE�B��|X\ԝ����%S�2�X���G�Rǽ�e�|��fI�\ヾe��k��V��DL\��?��o��U�׶���Bsv]��?���Л��m�GN�v������c<j�Be��Q��g���a�f���������6:?|��p�U��n�F�_�����GF@��Lduf�0�蘷�3�SoZ���N�F)͂V�`]4b��l��z�d.��p͊�\ ���s��o�vm�|�0i�00���{��2ɀ:O2��r���𱪯��<�7��ǟh��!�� ԳW|���8�!�	���|P�b��}63�2"��-0x ��͝�դr���oV�a{�0SZ�\����#�'�h�I�	��B��&�5��b�/aX�g��
T�m�ivΨl��� �����8}�B������a�1�*���,�����QVD$O۠������j�4quzwY Dn�MW_���Xc�YO8EuՂ9u�굼~rs���N?��8L��BX�қ�{7���[���]���K��N+zf9W��ۆ���Gq	���n_dl�Q��i�\̳��Y8�c&dt2�X`5��4��ɣc��J�M��u���mj�����O�����?XQ������^�mu�G O��?��%����!���ۇ�.<���;��)4��;y�G�� �{$TA)���Gp5 e�i�H�A=p�	�FX_�tXfZnk 8���r��=%R���,&1P"P �)��S�g�}�Z�����kcn/0g�*=�`��!�l��#Pۏ���%��$H�O�ssÆ�S>l[���l�>V֭i��]���xIH�������ޙ黀���J�r�Z<�lH4�b��__6�R_6Tt����#���
?CX�+XK�q���g�s�����A}8���b[�mXj&�1�j�p{�����]Y��Ʋ��*�(��Eh2-]Ꙗ�D���/r�Ρ�#_��Ƌ�}�Ш��Tc�U*~ \� ��-{sAh0x[��]f��6�#SU�9������E�ـ[����M��õ�v��h��b5�AQ�S\��K���d\��%ש[k�������R�$2^�����(>��(��������c͕�J6��K`�G�2�*�e�垜�iK��a<�d�מutB���d;>p��,2������a�A��x�r ���q�U�^�w]�HIC�v0�Q�]�;��PW='�|ԩ����[/6̫��6�\��ݩ� �j��@#��-�2��)����I\���ZmL��p~���e5,�ù@O��4�!5�S��St���K����X>q}��/����nt���˼NF�����^�sÊd����'�
5�8��`D�?���Xґ�y/3H֗�F@��P��=�^7E85f,���|E��<�\0��w�N'��;{y����F޳:bd%�éZh�g�^���*9���Vg����x
�'�0�3Q�-S$��#$�(�݃�פH6���ì�*�@m1�����	p�)��4�|=�i�Cط���]�ѻ�Qh��ǲ����Ֆwӄ�V$�%�{i�kK$ևab�� $)FY��9��?�vDX��/�J��հd�EGۣx��1+K��V:�&�Hx��X'&ٺc���G��3T"�ѓ}b(����B�
S �c�	��(�Gy8g\)5�<'�'�z8/��۩g|C��a���,�{(5�7F��h)f�4v��V�4���!������ɂo��&P�p}���b��;F�U���l  z��!�K!�_�����]G�ޜ�x���Q�rX�樇�4m�
�S�� �8d��mG�K��qo��Ԫ�m�`��ƓTe�P�J�g��uzG�LK��ڊ�{c��9���sB�l�&���@�=�&��%jx�]�����XD� g�)D�R�~^6A�ĺ�"��i��ܨ+P�KE��Ζ<S��o����R�����z�xԕ__����e��r}�����7��k���A�.`f���B�8��6+�w�r�]0�x�@�;�f�e�[�B�)�$�豂�8�%-�i���+�Z�1�P��K�֧��"�Q��n�U<��ÕUn�`��I���2-��àW�t�%�I&��}b�zn/��*`H�5�����\���ߏ\��׬���p�K˺��ߐY ��,����)])���������Y1asn�l��yr��I��^�;�~��he���8"H�Z y�>�Һf��<z�.隖�`V�KF�-�4��`D���r$�}x��KIP������}x�k��؄+s0/�]����*����3��g�>�Z��*� �q΁�o�cO�~�f������9[}8��9o��HN���j-���%�,���q0����MS�<��A��v��u ��H'>]@��8���w
�.G���AT����hqL?K��0
�;x\s@�r�"Em��M2c��)Kh�0��x4\��7'P��=��A�[�o�tg��������߈̆�r)+��=�e�a4��m|3�,/�7�Kɚ�avϭ-v����؊ �2Zԝa]&�=�����9�,�N]�\������̰�0�.��f���/��awavauatasaraqapao2��6�i3��4�����.L-,�S��uajai]�ZX�KӋx���o��ݍ�oKۏ����h���X�Q�Zg��jE��슮�����N�p37���µ�4��_�Y���4خ��\_/���1���|��v�|a��C��
ʶ��@p��:aG��?Xy�7]H�� ��q<����R��_l�ќ��*���u��8v�lL���;�]\��˷C:C��H�ƃh���
v8�]���
d1ц���Co$����9�Ŧ�OZ�a������7��X%ޝI4��)-�-F������=�\b�+��oU_4H
�?=a��&��.��

`�� �K�L�!L-{:sXl{�� V���(�����Jf��c��e����]^9#b��H7���"�npBA�f���x=	Rm���_],ɠ3?x	���TQ��M��6B���q���*��@5bWT��4��#i�� M��,{~h&�~���ߺ?��/�y���Ub/���Q��0�$��% �'�J �4��H����Y�����w[���Pj�y�)���IH����5e��z[/�	(}�������,1l� �g����A�����w0�k=�p����� 80g�!f���6-�a��/ƿtΊ�m��Յ^����(��"A\wNT�y���V>��X� ���������r�� ���'|�|ʤ\ˣ!�s6ݡ򞬃WT$���;��_��`w`�f6. y��/�1��YlC�$�y�gl+k�8����& [��ˣ����|d�W+�3c���߉��'pn�L3u_���jN��Y?\́�??����P??���@$Ԥ�}ِsa�䫩xbd7�䒹�\8�k&����p�S�"R�/t�O�h������t�׆�4=�>��g17��r���3i#�6r��XQ��o��+7��e 6��m;���\�}=��F�;A�28,.ym�R-�J��ٲS#9�NP�@�&�
���B��*����W�ǐ}C�_�/;��*i=�b�\���m�WGZ�:���1����"���4�VXfE>���ZL'�4Nm�Jzj�����E���c�}BI b�X`��õ}�	cu�������Ço�ܝ���%{Iߗ �9^�uB��z�SKĤ���F|R#i�b��l�G�w�gё�������`�<��b����9��#���9��;�#]�pW�m��3;�,�P/{'���d�Ht���;�\�v�(�K�����eH�ʆ.c�6:TAO4)
w������e�Cڹ؃p]�`&��by����R��!(����_��Yˢ'�K�9E�������a�TIT�
�Wq~�6h��q�؃WC�*gD9����x�2��o�D��������ᔅ�aO ��
�3�S�q$O#i0�^� d��R����u~�@t�1"�C��k�� a6Fg�>נ��䴶#���"𴿸nV����E����qz6{�	f/S`�4N���k`�6�y����sEjp�ڐ�ȹ���h�ӧ���݀����rղ7����衊Y� ρ�݋�cR��yvg�?O��H��Jn:�Ʉ�|\G�MQ+��Ї�
��1�v�VF��f7�S�B��x���uL+�*�4F���2�3B|e�v]�������9&�ѫI���ĕ����,����߾\.��ү�_>~x{}��S}�`Q����-t���z�-F[���3�D����r%�����Ir��g���ڿ���Ւ.-��3KU'��6*�v~D�9
�o*�픾5��a��v.�2�:��lp�7p������=��=]4V�?�x����ᴻ�m��m�6����E.O[l���yw@��e;_�N�u�;jO��ř�kB�<Uk�n�s k�#A�Uw��LS��Zj`م�oS�� �k^���/�BT.����Ԡ����h�r(F&��2��|�/�P�du�&��'i�z��ʢr����gO��+��Cڤ�r�W��ԊǶwٝ) �V��n[���']�[�8�\�\�wc��ի�َ�QGiP�CZ�,�Bk��>����]vB�~�%	�t��p�_�V�Jf����I��J���.� n�Y��"����yf��k9�{`������}�'�t'�@�[�����Ǽ��}L���R֦��$��A���.\����L&����m��q$�n��	���Of����I�Hc^��nOfO'��$��R0�}d��%D���y*:�◝�˄��N�`�:��V#5�3�o�'���H��(`	s�)�f}z�ҸܹSf1dv����w}�je�۔�&#�]jT>'w��0������s�S����N�2�+G����w�w.c��O���B����k�DO�	�����@�f�c�(#�ȱ��j`y��;�hO�%|��!.���?�Y��Ɵ�vK�G���GiI\�����M�:���h���̼`��:6�K /�����P��os{όp�K	�C�
B���M׬&lo6���?�9~��L��ŢK�I2�����fJۤid����@H�s�&-r(�n�Fp��-[������(0��x������ ����H]�s������]S�l2|.V����)����;I��26��V���5b30AKŚ�%pQ��\�$�������X'��a�8���
�/�.������;�Com��'��'^y���1�pO�v7n5Ӌs=����u��S�QhG�#[��B������À�,��0-��,@�@p�q� �:�1�)�V�"k4غP�;�&�)��ls����a��MLL1/�����]�j�)ћ��&��gj�k�+�u�Fe�8s:&�!�eQ��v�$fN���K�Ӑ5�+�����:t�҈�dmeia�"=C��O��^��{;&Yα����_�~��x��7|��|�̨���Z)̫�D�퓡�V�} ���w�ɳ�b�p<�n�M�G�0�4sz���*E��mit��up����T��uc��,�ᔓ�	On��Cgl����֞�	�Hs"�����׋�� �k������y~�W����h�?x���۸^�1�.�p��)���t{td�Wy�����X�v���[�V��܅%a�z��W5=�<ޜ>��9?X1" y;35����.)Pq�ڶ;��NTK����v?�?qH��!,�������n��yW�������v���D�ɐ'�S���،��2�i��hZ�<SM�������H$�*�J!�;����R_�Ph)�%#��dD'��:,	�)4~���sX:'HĖp$GG�q�S�Hv���뒜�.9Ǔć�%&D*��О~!�����n���/q�6E�<-<I��g��Q�<0\�s�u�7�Xr����))� ��oӜo��O�s�h�[��	�:�k6�޵?���p#��p�	�a{��eג#�ӭ�`�eh�d��R�3����Z;�T�0�#��rֿs4_�Z�b4��mvt����?:�0��M�R��k���Q7ӈyK�(�L��!?ȟ�Q'Z J�8O,�3��X���+/RX=��z�2r�}���<��A,��Bmz(eph
�AF�?���A��)��h&t�B!Y`�V_	2}aYZ�Xdh(���PI��bU��ʧJ����3_���e��)��o���L�I�Ng�ddƌ�uj�mw�wş������v�f�?�_��E<���(�������S����|��qNy�~'OX/�ޝ�n�fĂ���	,�N1�W8�����$J��=�ӠVv�P��L����ץ����LH�/������+�)�����&�N�O��IB��¡t>A(��(&61�%�e���(<x$B�$�e�c����wp���wO.����5Z�&v�q")5��P	�w@+��ըH��\�0�L�Q"%ױ�!��9 �U,�xʚ\�g.�i��1%y ��� y#R��0�{m�;H
%*�D�`:5�fA/X��u��4��P���}l�ϭ󓡍�v���9�[P )�!$Z��qN�b��-����3�T��<��-:RB}�^E��~��eA�����m���T�fz��o��ӛexport function merge(...sets) {
    if (sets.length > 1) {
        sets[0] = sets[0].slice(0, -1);
        const xl = sets.length - 1;
        for (let x = 1; x < xl; ++x) {
            sets[x] = sets[x].slice(1, -1);
        }
        sets[xl] = sets[xl].slice(1);
        return sets.join('');
    }
    else {
        return sets[0];
    }
}
export function subexp(str) {
    return "(?:" + str + ")";
}
export function typeOf(o) {
    return o === undefined ? "undefined" : (o === null ? "null" : Object.prototype.toString.call(o).split(" ").pop().split("]").shift().toLowerCase());
}
export function toUpperCase(str) {
    return str.toUpperCase();
}
export function toArray(obj) {
    return obj !== undefined && obj !== null ? (obj instanceof Array ? obj : (typeof obj.length !== "number" || obj.split || obj.setInterval || obj.call ? [obj] : Array.prototype.slice.call(obj))) : [];
}
export function assign(target, source) {
    const obj = target;
    if (source) {
        for (const key in source) {
            obj[key] = source[key];
        }
    }
    return obj;
}
//# sourceMappingURL=util.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                      �e��L� &�?&5]�X��+#ۻ}z�VB3��n�LΦ��]U� AΒd�,z�Μ�b�Gi�5'ۣ.1��@6��6,���5�L��D�k��*����E-4�0���/赨;P���ۦ�:Wp�7������-@��ō6�����H�G�X�U�yr��\,���{z�{�Yk��`֮D3PQHö�W�ƥ3��/��� �W��;�!L�+��{-~42L���]��_N���܏��4w�z7?]I����ŦHj꾣������x�U:�q?���Wq���J�%eny콪�ό�G�d%џ�Z�e�@5\���w�_�/�y�94�f���%@������fw���<�X���f�<�O�ǿޝ������O�wݓ�J��#�H�ٗ�$UM��~������@�=��YQ�HP<��׫����Eb�����w$�+�?k�`
t�"��)�Q����{�q�a����wߔ����N���A	g�)�P��$�Oػ���(ߪ�~п��C�¼�<k2cEb;��3����}؎g7��za&����H� r�E|*���/��;
r��G���t����m%��ďU�$Ĥ���������ŏ�?�>�����I�V�Z��Y[��4����)G<sH*1�v;�6����G���sV{�7�o7b%�8G��T��	>��89O�s��5���Ū���C��՛dF��l=�"��Җ��'���E琖_�Xg�)��s��n��E�*څ�k=I���1
ML�Ʃȓ���g�De �`���R=SN��JH.�C�X����L�J��e�`�4�as�?z���O����Ӣwۢ�������W��t#tKm��K��-x"�Le�D���5����O dq���	���O����<V�୊RC�]�
2z��f���h�L��%���-�3ۓ����:�,��g2ێ���o	eѬ|���h�1����r'Z��HW��j�<w�b�  ��٥��7J�p'[M�� �"�D&����6��meN����6���3�OD���=���|�̤�e!t��$BG&6��`%"�(Kgs���!֭H�S�ޅ&���� iIȜ ��e��8n�[S���96R
�E�c�(&�R��bgPW����ʏ%D�W�&ϥl�9���3�@2�����;��'re����"촕J� �ZLg�(fm�2�Ԧ1�l���u�'X�'�����,�J̮_8ݏ3
�c�o1
%�?�T�~�Q�� ��y>���nv$��_��I�:�v;l��gz�>�I7�����:�_I�=LQ���e����g��_jd���O���O8���yMn6:�GT��(�ך������К��A[��7�R(��-�'��D����U )#aʦkn�L��i��.���\)#,����+�"�|P����Yc?����Jc��M��ڜ!��Gd���F��b*0P|�)K�?0^�翮�iD�~�5���lt|\B����)g	�e�-h��}.C�!A�i2izB11�mfE��0ݑe% �W�#����HE��K��U�TՆ4��QGFU�G;��u����5
���RVX��I���)���A��qLH�@�l������-Fy��b%b� ��}��!aq��5�,����3\&�RY&�$�p5�̿B�/����~�R��������P���F$�&�=�Fy����j�{�nt�V��w�f�����'%y���U	P���3i��4� 
]'arhK��Ƅ@uq��T2�bc�5!Yσ���aŌ���,�ދ��/h^t���N�LR�<,
�x~�J�*�AP�/�p���	H)�"���Ү5�Ź��: �JF�G҅Ia�Z��� )0d#[�6s��me��F
���9�	�P�Q�ܰ {qq��G�t႔�Q,)���\5PrBy�m��T��mrU�&���[F�U���#�bǳ��:�.���E"�>V$��+��U�ikf6c�q\��jP <������C�$f!�^YC��	�ب���W$vc��2%�V���ǚ�>͒��6��!S>n�qی�\J��0M�Ʌ�y樓��#~Yi�c�i��sĚjp���ŧ��oR$��Q<��t�����;���D� ��Lz�D��lǊ2���p���Ҏ��0r.����_\9i�Ռ.�Un��������	d�mQ���<�`rL�Zlu j�-��yC�S��r��(��v������'�n�
m�5G��<�0e?��3���"6*�T E���r���Yd���P��2���~���$��	�R�}���'���V��1�VCP�̱P��{�w�?ޝ�o�_a#���W�u�	�:W�LUhHh�t��_Ԙ�tǞn��"N'
�"�H�
��r�(��͂UU$���k���mZ�������}m��X�W����dӻJ�z����}{;<�Y��w�k�zN�qP���ߏ����5*��tڜQS�S���d���؜�u<6��^oU��ՔȓVy�&/�Y]u�s�b�\'�J�Ύ��0�<w6��R/;f˲�sEG��/��Hf��<��{��zYr����C}i�O�#�I�b�o��-�KI��Γ]��{[�zrDZ���|��S�k�'u�s�B���N�N�?He�%¨qޘG�v}%Dw�����q�>>������Z ��/J�B�y�T�P��������)��i��� �$$���yO��U���$��Z�l�h4�:@�flN�M�� DDc;P��'cQ�����>=>�Yj5��͞&ruK��)��KU�o�"{7��K�&$�Z�C.��yg0i�.{'�@�f��J�є� ~G��n,q�4XT/l�HE�]9z"�Fdun>�!K��0T>iu��O�~����^E��x�|X�e��&]��󊔣[��
ֽ��<�l�f�l1R��Q�gR"��4U��P��:��b�"������FD�!��H�] �LL�:���xl�) 8೏�%��%���A5Z��'b��?d
~_�3�p3�4��d{�ŗ�}�f enWs����ǿ�V�7ϋ`ȩ�4(Sk@a��z�)�N��kDU+1`�A��0�(�6��O���x��j*"�dL�e���ɊEf���?Fp`���u/4ok���ƭ��,�7�V\�ӈr.��?�m�&�ޱzG����+O�aXF`mm�b�rmD�r�!q�K��sAr6%��as���<����Wj�$M\8^��ZcU�U�L�l�EB:�Z�s�W��)+�1���g���yOd���SA�����X7� H��, ��EMɷ��ß�9���_�і�Ί�픊��v��f�mA
*�����찿l9,�����Hjx1|~kє�	E.��8F/���63�<x���a���#�_�7��Gz�Hʕ�,��x��@��č�w���t3�=,>)�~�H��O�8��&�;gm��l�!�ԍ�ݏ@�oD��ǡ��D|_����0�~�Q��]x8.]gJO�7CC2�3%�֤R�j��	�k��w�Ѭ���	]�C|i�_�ͥʆ(�/�����'��rܜ�����?�B�?�
��<��` ������}%�����T�ֺy��F�݌����[���!U�>��'��ʜ�Gd)>X���w�#���_&*î��l֕I���A��]���^��wY��W�Ҳ(�A �{3G�V�����r�Fɔ���'?��henu�BG�Hz��C��\���*h��ޅ��
������_����]��OƗ:�������XO~�K]�*���);�-��Zvad;ݐ�������)�+'�b(�N��pX\W��"^t1�������5g�*�ơ�����ig}�M̀�G�E'����7��<Ŭ
�p_.��wфs@l�BחkoOh���1�혊��w���P��8شv��HZ���Ͳ�t4�H�����3k-m)i�q��(z�<�򜮖��<�->u������y�s�����_7sx�m������b7�xd=ė�)ˋ�)xR�_�����妣�f�P�Ծn>��C틟�M�j	
ܰ�v�!/�D���t�3?�xVi�u˹m�����\-�6 ƈ��9��1�]L  �k��>;>��ڥ��o&(?�/�A���0�"[R�v���Sn�&ftHP�oR�k}r}�E�|D��ߐ���T���O���`k��RG��]�+����b�X�ReD_�R[�]���'�m����ׅ��[��q�UI�z�������͔:7\}U;���0�-u�ӣڪ��Ek-t���lblf���S�Pܚn�n���k��v���/��혚�Ͱg��[��a����
;!>p�*��������ލ�^������/4,����7Rb,�2�������Q��5�W��4H@|eZ@����ژs���C"�GE���>j����@n��l�/�"�����`�\Ƀϑ~_91�|�<Ǎ[��,��e�5,�6�'��d��e����4�ܿ�n��P�79r+�ʚ7�jN�8q�s�Φ	%ԫ!��с=xbu�oڽ����/o5mų��`�!P�0C/�Io�	`N��.p|�p&$����yA���A�*6�Ƴ �.�Ժ��_:��亥�;4?��Wd�Jb��D�f�R��.�gl��U5�)JNb�C�>5�T�!Z� ���o=�i�R>P����pW���ٱ�L{���@/��2At7x�,l��|����o�pBmwƹko拡{�qa�A`�.\��Z���-����G=$�gD"��	xӡ��2Z��FB����5^��{����߮��L�M��miM�D�C*�bTm�t��(��Њ��-��hL���/ّ>���oz"ҋ��<��m�?��FipV`�m��IliI~A�a_M�\x	���Q�.K_����6����vھ������*�؉��&ۗ���[-�z�w� *x�����a�E����gt��	���0kB^;!�r����[�vY�=���Z�����eB읻�!4����b��$��vzڰ�3�������#��!s@���G81	)���"��"��]�&R�_3.�6�(rNl�O�2[3wL��#����>f������B�O��"V�<J�B�h:��Ȩn?+��yTԿ�@�,�;�3[�3���Μ=��+��3�V�;�@v���6�@@��a�:WȤ0��fn�V(`ۯ���� �EM�-YD�2d�W�v��XX�͠l"I[��T���aճ�	�@����<mq�",B��G|� ��#)�,A������
0�`j��YѦ|�~)#$�m{�[�8{�]WB+�09��I�&�sd=��"�hH��J���Ht认Y��)��&B��1�A���$aI�>XM50$u)�`���6HTc�����)3>�bp~Q�f�XB�&�ˆ*o�M?�PS-����jx�E����px�U�Wv*?�>��#sa���6��97���>.�C�߼E;&��Q3Ȫ�pLWh�F��}����:E�>�V�ġڂc+��;��l<l8
;a�Z�$�/�0�(;S��8fDx�䋃0P.;$��_���V���&�wm��
akg=�k�"��E���$����d��Z���W�v>C��6Yj�Qr��,�Q﫳|��%����_�\���<|���zw��Hu����wY�4��ɘȓ�B�v1���ig�^+'�cKAߛ�G?8�X�{��r���l��8�*+���G��ǖ.�kmn&r��Z2](n{�����4)I��E�����Ƈ�>��B�VLcIL�R.�T?P����O*6y�=���n
Z��ر9��3E������� E\������J��T��4K�wr1��� pp�_�9�/^19���Q�6��P���&�"��ض������	�N��?�-��R2�S�;0۶�pm�]�N�x.��CmeЯ���z�$a�6^����[�g\X�|�>��*,����UK-�	ʺ*��D�c���Q���Z�`���w:ಡHѹ$�@n u+]���<��\ᒼ�J4[/�ə��8�&
C4=8H�*8��+�G�X��ȴ
|�P��B�rO �:�sᙃ��Z�:=�d$�5(z0/0���4뜀�`����Q~���������p���~`�}���?>���������!sN��<�*y�S<d��/χT �s�����j1	�����,L�"<�s���ш�'��]Q���F��	t�W]$�Q��5�B��'���F�����]���C�����>d�q���N��_:�o���핥r�p���_W�}�m�\)�j醻���M��T8,��0v����ʤ�|W����z��Hl�"i�,�=��a�g�=���� ���$��\���a%����N���z��9��[�p�5��s[���/N$�}��ގ:��D�m*ɥ;*��2�Ŭ,z���<�u���V#��ݣ�#�=���K����ǽ�2��z�)�_L͠?���\�R'��$)FuZ��шr)4�%�������h3D �&�C)B����q|�^����^��$��	5�:���R�|�J}T���:g�\~�*�3�������	Q���G)�@��&�N#�_������ �Q�����^`|9�|�",��x�:˲�d��	��d~a�{���
O{�l��"��'�ڲ#�q���6 �%Q��"܊��e:�������v����|�z�	�x\ K��;0��>���7fl_-��C��e�/���Y+�F�A�Tͮ7����=�k���}<����aW$�fݼ�C�1$�|(͎d~o'"�!�Oi�I{��n��n��V*ABЖ��кb�o���l�k;f�R���k��-٬]����}�E�l�A��hRI�s�,���Q��q�6�c&X&V�`-�ڢ��M )�����t��5bUׅ���$�ۀ�/�B�9�u������1�VA��[ñ�B���L9����_��_HֺO��V2d�}&� 棧f�Dx�Kl�t�l1�;�bKU9����;ZhD��Ì�ΐ^=LG�l�$�OUE ~%ĭh�ez_P�_����(�D�諯�a��p��Z4�֌-jel�}�?�=�L�+N�������pWuBQɐ�\��m��D���x��}�@K����*�R�(QxF�>9�o��o�]@� ��Ýh#�-�M]`�i�P(���sSw�����ݏ������ݖ�~>��=����%�� ��?ш�����R|������y�l���ٮ��,q��w���i���dB�¼L���6X�#w֞6�?ٞ��4��`��}��+I��ʪ�ٽ�b�u��7��Cs�x)͉����$�*�(���; ��w1I�j�o�5�vL�������^���;���`Ǭq٧����z(��`�^�=C�;R��[����o���IxϮ�޴�R�ߠz�����~fG��S�.��vc�w��O
��ٻ^��}(��K��0�&y"u��z7"F���^��)�;nGO�'ݽ�>�|�N��כ����S�r�}�$/��v�?~��k�r3�g�Z��u�eShN���y�<�=���<�׆�m�
�Dc����10�i�፳�E|E
��������sL�v������N�<�>��ݻ]�b��Z��|��.�6щ�����{Ha�I��n	����C���.V����I+�^�w�Q�0�M�$�H�jИ��(!n���܇�z�����p����>s�f@Z֞�s��Yj���AS��{b�Na�c���q�E�\m�&�Qg-��߀���|�W��rp�s�u�s��P\V��u�f��E��m7�=v���v�;O&K��Y��K��1�����K
�@[,d	m��=|�	��<J��?à�Y�Y���vU��	c��@e�	B!����]�������65>�!i� ����mi�ڇjT���P�"�p�$-z���~��h���s�����[��%#,9j��$��]PC�}d��h��(��,�H�=�Mߧ����`�ڳ��2�)�T�,&?1�&��{f�U�	�Y�J�if,�5g�����ԣ|H��s�l�Uqb��'�"5t{&<�g�T�KP6��Z��9�z��<Ì�b��fO_NO/�~��}��M�ҭ���9PG��/;S��'�xsnh+ޙw|���~��{�,�ѩ���/_�W���,F�s�,��{ϯ���$1�g�P4��� �ׁC|�w����H�`qA�R�أ�\���s�$�R�h��JH����=�����Ԣ�XC�����]`VVק���h�z{����^ݵ����So���l�K�Eo�%���u�a��S��s��spX	�6D�U��t�$�P�?�����p��z,&�������Rp���
&vГ�4kr�������ȹ	bx'��\���� ��֡�֔ESeϺ�hY�A�v���Ĺi�M�M��P9����������l$j,����{�L?��9\�o��,��:�+�%݋�y	��3
���hm�kg���w���p+0�ͯ�(X�������a�3Z��&�	j~b�0`���C*ѹ�¾�����X��Ʉ��#�|��V ��O뛪�#��G;G�vq��,�纰��^�^%�Ѭ��RqA�Sksk��s�<2H�H?\&���K������e�㸯�慬U��_�b�ǒW'6�Z}s]���a===�\/o�R3&T�3Mm&ty��6E�iI�E^�j�ȋH&�
��|{⁡!TW2����X=������U���E#X��׫1A��4*H'g��c��U�S�b��	!r��%ѢB�"��'���ÐE�ѳ�����H�Y�3�]?�����x����zW �M V~��R��+�]��^{=�D��JH�4���G��Z�>w�{���h�����Kֶ-R~�X�&PXPFED?HH�F���U�y��n	M9J���:K��I!"��3����|��q��vhG+��& ��'F������TW-�#���P �K�����{c7���s�N�"ّެ+ajt)6"k"��̊Wކ���?b̙�e
>
�S�b)�`�u�f� _�������+p���
P��K�\��w�'9�FZSh�HRIQC)������Ϝ'N�ώQ��d���v����h�"�&�ޗ�a+q �+���lr{ӰfIyX���2�ҝ����ix�����WּǫnM�t��Qw�7mO�p��;A8xh���q��؟Jqaъ ���Dx�C�2�c/=�pؾpE$"c���j�����t��ʒ�0��t,�>�qBW��K?�ո>�׺Ѩ�/5Igtؐ�;\Ӗ�Q��z��5�4�X.I��g9�n�%,U�-&����כ��6��d�B����z!�n;�jj,��ZW|Y"�jW�'�^���a3U��N�\������Gl�E0
FK�������dg�'����l�[R�.�O*.�ڦ��|��A�5��	�h4�D�h�CKp��5�'�=�f�4�U�lڐ~�ҁܶ�/=��-�F�tw���$�?�[v ێ�3)����aנ�K�n�9m8И����\��!�3��Z�Xa��Uz]BH�Fy7od5~S
OeS�S�<��7��ݤ�Q�(5;������R�l��k"@8H�<��-�i\d.��yٗ]�=Y�ex�y�#�u�*�0iu]��:���W��Hg�2K�T��&����S�Z��9�ʺ��^�̶����j"��$��v�48�;��黲b��5�E ��,�r���#Ȕ�/*P����]D�i&\��z�v����,�V3�54x��:6�V԰��:��(b�=�����z��7��d����-=�<�>l��~�҉����շy�s��O)#떸 j���8�n��zsx}z��>nW�Z.E�X(��9�~�/�����4���G7�p�7����/�W��G��o���F_P��q�0���HI��C4K�X<oY��6�6)��"�q90����<9E��	e���4QX��,���N�����~�	9W��R�Mc�E{�j�h�e�ҋbd����$�1s�Zw55a�M�	L�8�q�x���$�POm�0q>��~���2K���J�%����*5#S
Ba�����j��cѬ>�FQ�y��~B7kbFM
���ǆ$�$�~E�����:WZ]P�9h
29��� 3j�/b�$P��[�خ�$���+K᳒V�Gѵ\4�[���΋4i��&= �8Ԇ��Zr�ږa	l�g<�a�����j�|N�Q�����>6��$K��� <�,�M�
�
yK�/ˑۦ[縴�H�1!���z�?��E'3$&\����"����
&�n7�:��G�=���|���m��)+�$ǣ����78��$�
�r3j�c�ő�B�/��e�,���i�Ś�(�A�~�L9�DPɄpҬ�,�
d���/31��>�?�������e����_OW�{A�9��"kvK�Yъ�!�(:�W1!��m#f����L�28��0�٨���ܽBz*�B+mfM�Q��޸E�U�����d�a9�ј'*6х�V�T�77o�� Cl����m`r5� u�X��,_�D~6-�G�����������˵��F�E��c=jؽ�������/ޯ�/��߫��6o`K�,�#���d�2�8[�h���%kT���͉�|<�'�QOov�Q�h�/z��T����S������@H�;�%�2��:��b߃��z��,]���]�"$cփ�X׬7����K��j`>G5��aI,
ɴ�a��J$G@������j7��`�km�`k�xCH���g-te>t+{�.�ib.&Zq�u7q�����X*ȶ����_�Rd�1���`�;FS*h����C�7��褡�˚:�
N��:��3���� ��K��O����Φ��(;��Gϼ8I�,���'�	�4^�� �9�zp������B"��C��俗��<'��Drsw�7z�B顅(Mg���Y�zU�(���7,U~%����6<�;��Vfd�S5t�c���c�	r��/
���)i���4# v:�}�$����ND=��>�������m��IA"{��=��,��t��P譇`Q���q��z~[�OCe��w>~�Zr
��S�7ɓ$�����u�n��}���g���n�)��e�Oq�p��"`T.����S�UgƋ�;�{JZ�9�t��-��%2+b5��n`S��k��f@'u��BC|��N>s�a���"@V�����'K/ ���e�,��u��ٺB�Tg�y��N~�Ksv��؜F�߂�U3�_+s�F���D����J�G1� s���,g���kMB�ͻ̬:��.�[:RM0���:ЫGQo�/�S���ڇԽ	1:_�ɩ}ܝE��F�assB>���������p$�k�f3t�f�7�4��^012Ff�̈́9���s�����>�oI�D������wgf�F)ޝ���pZ�Q'~z�D��k�-nQ�p�	��gtY��eΑ%S���eM&k��@��ˌ\�7�;]�,v{,�>�ɧ�äX���y��T=Ҽ���!y�d%$ �!��M��4r E�����D)_�A		�K5T&�7n��&%��X׹g)��+�0M����Ȍ���U��R/�yX)Ղ��H�G�}�ڪu'���.͛�[5�OpU�b%[����&s��M>�YL	i�M1�i_u��z$��)�#������x�9��r�_�<�&���h�z)k�|I^��J7v��tH� �^������˵}�Sy_�N���9}ۊ|�?ݬ��@,��0 ~����$f�-�.#,�x�?Pp�È�[PAg� �):R��w*�K|�9L�u6����A5�s��I���T�ꉃ �v�C����r{<��u8]����6rP��$�B`�$[�l�,pM����.p4!�!���%[��j�I�d@�n69�W��gvez�H�uȖ�#��ENz�[$�`�ғ,�w����+�G1I�A]����@�ܒ^�*�"<��`���	����ZЩ�s�h��_�Y�>���lW�ڬ&���r沰�ʕ$\sW�V��:O�Z�V���o ��v-Ӈ��,g��Nn��ǟ��<�f���������b=��ٚ$J�#�t�UB���X=!��-�_3�����\
W����$�AzaTcB�M�=c�k���b�L�9IV' 6��R��xk���N�Ɠ�єǊ4Cτ�"����8�1�A���gj7���U
��V�U��-����z�y��,��?dOC�;�3-�^`�[� ������Q��2jc?��z��@όq�-0�b��:	�1�$ͲX\U#E@���[�咺������O�H5m6i�CS�k�Z>=ޘ�!*�m�^��'���l��ɀ�6{��3��Mv�"�%�6LǲC���I��F�v�O��t��'��!Tw�N��z)�7fD/9a'��Gk��N�s��m�T��nj�����C\����u�C��M�\=��E��e&FO"�ۂ�K��z�nZk�����Zdnк�>+Ls�qf��9���j� C�#F�Ɔ�k�yJ�N�������#�������~����S��]���C8j}n����4.?���n�w�~
;ո�΃�B}�݀���B~8_G͝��I�fO�//�?�v�~~?��(B,,�b��R��:_V�:C9ݝ����?���#����fB&L��AA���	뱀�~��������Ivr���i����נ��I=�F���v ���Sjy���s��%nB8������)#��k�~yY�$E4<��"�T�+NRƮd��fF�U{��q��l!y�(ZMzhr�A2�d��-nۏ�r�6�i:��*~��-$�߿h�Ori.���sĕ1�1j�S��D�#*����C��&�8?~yڶ�/W�,�~yn]�����,b�uS�K�I�h��N�2ע5���H ��R���J�'L���i9���,�8E�p�A �u���_�M�@'(�3P�c�)�2��;1W�4	}@��&���ֲ�RV.bcn#���)����Qu�9�%š�y*�����%�"he&ݩ���	l�#tt��`[ ��E~b����_�LL�:M����,D\֝�����\\w���x���":�T�`�C�Yb���Gk�q�&o�\۲C*;da�V'�!Z0���L��eҳSX�ˬ��$�9�;�x�p��*��m��y�c���Mi��Q3W��F�bm����tBwR�/��b���B~�Ou�'@�yi�N�2��V�
����7�E�{8�ړ��дkq�7M!s*�A����Aimo;c��aC��5Ƥ0�TQ��S�-��rjqfɧ���*9��(�ɩ�e��m�<K��q���PS2�DI��ȜCR72h�v�PFX�e� 5�c�B�9�OJ��B^6�~���8��s�:o/�fa���1�~��@m@[��4*^WH�u���x�S�'@P�FC�*/���f�"vE�y����Y���&���v�榆Ķ:�6�MpmBL���0����TPC����)� m��I�9�=��n������U`���|�\
V
mMh]�UlJ]�(���]i��H���S�+���C��N�i{`y��~�o	J�T�c�ʕ$�5�/��=�86����A %�0h��Avf�d$�I�s��J�U����L��E-��ʿ����P$"��TcQ 	W&�{; 6D2Dc[�
�����o��(r�'�H!�r9���@jC�3��#����qf�SףIb��t��b���Ovƍ0O�l�����������#9,���l�`�wt.H����y xl1S�c�`T�X-�寎I�(�-�ʅ*`�����F�Ip,�ER����@?#g&~��
�Na.zn_�As"������
�	XO��*%%�J�PT�,6��t�Sh��`�w�K��pn��)et1�+/��ۍ�+�V��S��F�Z�+�LJ[�������v���	��S1+�[-B�x�Xh�r2�夜`�
+�h�SND9�y�B��¾^J
����x{�y[�Z�;��6KW/�&o ц�\t#���1(�q%�X�l�
Z�������kn�~��T��,f��0n�9�q^%��h�%�,k�t���Nc�<��RΚRo�Jꭐ���y��:1��wI�+���v�w�
c�������k����� 3�2�4�5�ih��6�v�@Ɯ��,Q��S�'��#8��R�ֻr���>%�˫a�ߛ�/'*	b
Oz��~o�	G��o���Z��i���y�p��~� �>��"����l�����3��w4H�K$q�����#,0J��]���oc~�50}�)^#4]9��e�/8�/���
$�� ��}�;�4�!��%�}�A�/��<#�eHw	_�~�ǽ���?}�#�\$.           �G�mXmX  H�mX^�    ..          �G�mXmX  H�mX[N    FUNDING YML �K�mXmX  N�mXi�I                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utilities = require("../../utilities");

var _default = (context, report) => {
  const sourceCode = context.getSourceCode();
  return objectTypeIndexer => {
    // type X = { [a: b]: c }
    //              ^
    report({
      colon: (0, _utilities.getTokenBeforeParens)(sourceCode, objectTypeIndexer.key),
      node: objectTypeIndexer
    }); // type X = { [a: b]: c }
    //                  ^

    report({
      colon: sourceCode.getTokenAfter((0, _utilities.getTokenAfterParens)(sourceCode, objectTypeIndexer.key)),
      node: objectTypeIndexer
    });
  };
};

exports.default = _default;
module.exports = exports.default;                                                                                                                                                                                                                                                                                         ���)�<<o�����R�����N ܟ~y�%;��2�������˳�o��?�^0C�"�vc��c�Ia���KPSU-�,ھ�^�=��w�2��(}v������ �����1`��|L�}���A�fTo���5 P�����U�S?�O��H#�3����ɀc�:�?�ˠ˪1�/#�/�/^F S��m�f������������������j���o'8k��iƽ��X�.�|AF����]��#����E��$ 2�DpJd&��5
�pQ|R�~݁�{�9�\���I\}��W�u
�vX�q֐"�P4��V��`s�EF(�oU��e�Qtv{O�6:d���K��~a���z�N]��-��Y Ɂ�IJ~��1��
�������!��f�/,���S�4���F�A����4o���^��)v�A�=�ԉ��7N���݌�N�G�� ���}5�wd�&����W��W�]w�V��7/�o^p���"Y˲������ݨ�渳{��nd&��=0�t��:m�j��[?Θ���9�e:�`̜�f�Eb&�=�'��h8>��*ΰ8p���Y�Es�z�\h=xt�[O��K녾��~��W�/~	���`�>y�-���y|G:r��}��w���ڂ(�B�M��z�|�32`-9�{�>�gw�����Ђ��mz����ܶ95���Q��� �
D�*��9	�z�"U-;�?�;D�0�� vG\֍DG��v��K�߈n��E_�I^�d�Fa�̔Uҍ�p�7EՃ����?�Wb�; {κ'��>�:O,�	F���+�#������:8��`��O��Ӟ�FB���%��� �PdE�qj 1q�*�H���+	y�9�ueR�Lg)>�l��	�d:��M��TK( �<x����CW���!�s$�0L,�0yC��=Q��@�s�&��� |@ m%�fg�o-O�U s��oc�$-6�Z����RYw�ɛg�\�^��g$��C�'@�?�Ŗ��`�vOF��
I�Ur����Ã���p�nƻ��:����u����7�����{~��#����fCP�Z��Z�E)�	������f�eӕ�6���;�$$,�?�_r�r-��(�0A� ҈#�I:�%ڊO��,���;r]���	%��e�͟.�p��?�<�Cg�]v�̲$��dߩe��-;tr١���������s�����"�s�?���s1��.j�$9�r�M��"�-�d��c��X{�O��)d��(��yT,�؉��� ��<
J?Te���pVVY�%���4Ǳ�A�Ty�4���Ɗ�ք���e9=���a���њb��Na��u�\0*�T3r!�%��F%!��z�SK���B���E9�h���?���U�(�6Z�aT"�%�Z>����%��y�*X)tVq,��#� B��e"�[o�%��H��|�b�|A�> y��Wp˶~�+!�����f�z���e��"�`��{����Et(��fU�A� \�,�H'��A{������
�Tt��")/�XO�
�}	��'jn�O��y�	m�j?�׈)���������/��7������a�0�r�	����D�r����x�]n��	���E냮�����Z�urİ �8넻���z'��'�r�xC�o�J��R��v����[T֞���o|�� GR�%Q�ǉ<�<��i�w7��3�}�?���<ί�T7�\7��Nw��:�}��t����'<�w�˓Y<�,��I|����k���`�y�I|�Y\d����}r���D`�4��./���3T*Jɕ6l�E�:v�Hݭ�/��II0��-27�{S���:�c�n��L�5�	����K�wE��I��z�˂+����c��q̳f�	;Rl$+J�m@�����HE��ꃞ�QHK~WQ>d��3�wy.����&������E��ո��a�o�'�gZ�d{Sޤ�M��	��h�
���l�zyLwm�.O<��3'y9O<��g.�N�V��ҙw�n�4[~Е����RN��D`��*���q!��I�l 2-���\���8����9GQ���Rö�J�a���%�����>��GR��ؒ���Q� Z?�����]����\D2�3-���B����%fU?�ڛ��*�v���Ż�����g߷�}W�uҒ��xB�钥ȗ�A%��v���>1.����B]H��)SX�+bp��-����������|O�o*����y	��wC��3�}F ��XE�5�oي\���X�1%�OtFF
���KN��(� =J���ލ�N����N�VS@I#��G��5)�A��0n�}JE*�`p�*�D>��6U3t?�z�.f����_��l�<�ט�7U�d�cuF�S��@����qd��jU��M������ά��/=9�w	zp��k��o[��tJ��%K�wR�79�&��J	jG0LT��ׁj����� ����%�<��cH�ϙ�:A�^���JЊ�,0�Ld֒"�)�m��"�hÚbBKߺOv��8�����տ����&5	��^̈n����`�S{�j�ثĪ�gM�ޑR}�
����?5��y^?�g���Ye�r��<���Ew
Dמa=QdF�+�k8�	|�ӄJ<�.���,�>����cɜ�qd�}�����V���
��Vt��k�x��s>ѵ_t4���qRt�s�i��S�ͺ�/8D�zeH���u�q;��S������g���(�xg�1����QU�C��{v:���زER��V�t̺R��9&߇�&�cU�3#� �P�q�
R0rՆ��kpX��=p�RgDiQ��mٰn[z>�m[�����l3f����J����	�/�eM�0T��!��/�����zH'�&�s�us��2�BV��G~4�Ġ�'im�6�9�&W &:�Qg=$� }]���$���g��䡏�꓉����<jZ���~����h���6xk�;�����mw;�2_*�ͥ����ۻ�>�)��HXk٬�?#���u}�<���v���^'t��F�S���η�Ӻ��ݔ�u��3�{O����I��>�>��9mkl[0�A�ͪ�����t�v��|�����n��;r^���n��i��6�O����w����v��ۉ/_P��``cu\�1"j�<���l�r��2#����b�r���%�`j�������<c���1��d\YyATyF��$�+��a`�c$)�\1�RdGl$����n@�x3(��W/��d��x"���ك�˙x]������C��O�]
?���7�!W�jȪ�-�%�¹�!5��X�3�	%���L�Ld�'�B�z{�f�dl���J:N^���W.�L��B8;s�"�:��1	83��{{�x��9�(չ����a$heT*�p0��Kb���G U�!�>bɗ�m|핛����_J�(�6��XR{벽���/��R�� !��d�Q�a_��T��l�#d^��Szc��?}���/����T��H8��� ���&������4N��} Љm�i~˫�Y����7�L��X�Y��at����*�,6ˌB�
�SBq;�3���QQC��e�LB.t5U�\\����S�m�d�m��A�^{#�'<Z�G?�&B}}:/��u���0���8XMy>�]"�q��t����S�GS%McOH6��N6n�?�8d`�7eL�*�4+y."����*�ζ�vd�KWU2p���=:�i4�� %����c)�/��~��{��ý\˻ͅ^A,�����f86~�"�`��`~�� ��z���5��l�&�KQ)�b�MH���QF�q�C����C������=��>�;��{�<0��*<5n����"Y��r,&$2�~���O:CC\X[ۯ+�#\	�A��O`\{)����]��^��C�	p�L��rTe���KZ��/�|�6�(�J)凴��\>��M��3_?�(��c��;}�� Rva��|D�׆��2
��^sd�$��� ,���8(��i/rC,��k���e`��ڑ�9�z̀�XӇO��՞� �fh{=��i��cʹ���"sO���_l�E���E�,
tO�s�1�?��QՁa���7�������[�rO��I���
V����|�8�`pP��"C���{l���}��!��m\?�Q�T��H�N6�`���i���<����6��v���`�bZ�'�t/�n- Q���z�ceR�PL�P����(�%��(�Ž3k�j�Z�\VQ�b�G>�;���qL<3�l�<q���`�F���h=v[���g�=��+`3�R?y�+�T/\����H��:���e��y���y��C���Ss���|�9y�^=�5�w���<h���;��~��q���=��Ϝ%��[���%޻GC�?o?[���ɺl��NSy�Ȼs��f��Cԯ�����{����|xw��G��f��p��C���B�5�����w3wmV�yw�nt4[W3�+��{���35��������05 ��W���2���2j+m@R�Xf��Tb\5��?N�)�n�]����RwA�w�6ҙ:bڌ)3��wD��c�YH���ԬD4�1���>�������󚾅s>�j�,t��M���k���k�'ID��Ԫ�0�M��{w�-��������������'��`\���)%�����ۥ)-/����S/��F��
4��Tg��5YI$K�s��QO���3Y?�Q�{��{(|̬�+*�q�b"�@�^��o���_��?w�~���ܛ�s���"�0��!�/[����E�qK>�t�-N��3���A �Nј=D'��3h]Ph�g����R��;OPz��y�^"�/�Iٴ����âFs?{S㙢D�h�,Hg2S���b����:Ϡ<�t������
b�2�}St�l;����7�
,@����0y����^��/���÷���-+�����#ʀ�dNZ�p�}i���@q�����
gn��^,��x�](y�s=3�	j�C�hr-���P/�U���������[!�p��`\T�=��[�ikXNo 1\�͈s�J�n�(y\G�e(dN�D���PFae��9⽅,�k�HAD	�d�� z&\q��I���ή�]��ǪK�����JG��?�,@�~Y���mG�YL��S�Rk�)���n�u�����٧��S<��eK_��p���y��k���Bo
�
�7��a23!9�p��o����u�|�:����{}�?��Y����	�d..��g���K��3��x���ڒ��3�~!�"_��`��bb=�TȖ�% ��E�V��{#Vf��i� �_ߜ�b��倳��4�an�n��^գ��᫖/��ړ�&�tBdae��=��YU1e]&�� ��-�����1�2F��@�"�i-�ng9��I
�MH{XZ�k1�G����0S<0�u�T��wp�Q�GH�Z^�Eё �&�P�T��HjԪ[��<�g�.��gǳsG#�y99wY��4���Gn�t7�3=����԰>.��?�h����z�6�ʭm�8&+��v9���(b�Rv��JvO����3k��]i�@��ֿ��3�2�o�aK����8~x^g�LR��kCQ\K���)�̕6�~���@�@5+��"�k 'f��۞<����E���@��H�l�ʁQN�$X|,����BIQ#X�	0�Z����_����Oω�R�-����E^�A���ǉ\ȉTi� ,p���2k���/���z$��M0��_[z
���W�Mɨd_yC�!'����Vhr�)I!z��X���B�h��(��J����-}�C�66' l���2�Duǻ�+�7Z�S�	�M�3�b�?�_PK�p-A_"*.�C�¬�Q��/�+�Q�������~����uy����
�v��A�G�����,��O�	Ǔ�+c9�=���Ԇ���7�'ȿ���v�G �_���P���^��_�$��F�>Y���[��?�ыN�[�^���gw�7/����.� �Z���VT�v�?K6�S��Zn	9v	�'���k����Ȼ����A�M��y������O_���j5��&�̥�a�uez~G^Yn~XfM�J#k���2p+�Bx���n�ҭԢ����;Sإ$A֏k�*��H3�3�!��;mD&Ψ�C��H����e�]�lȺ:mzI�Ć�w>g+/�\黃9?�!���s z��|��읆Fc�uT�6X���Z�����A
��(�er\y0��H���T39<B�&SC{��ޘ��z���1*}�0Ȱ�q��mGn��Í4`�m�˭ _��I�8���7H���[˥=�=�o�;$�T� ����g@�f��(P��9�r�_N�|��'�s��@�S_TyC�d�@�O����B4�1 �$1 ��w]�P�G�]�Y:��}$�]	j��h\6l"L>2yxH����A�`"W�J���e&F$��5�d��	E~w��r����#pG�_�30�a�F_�H[�H����T�yL錚�1���CH�hg.��E�'"%`�P�lX�E�XͲ��H��_cʚ��:��u?�$~�I���xW'����?���㋣����߷|����zoS����p�;�d��}��-y����-��(���Q��`���z�L![��SQ~'��q���l�˶����_cFE�'9&�Z�$�Ss���5��h�'v 3��@�T����CeC�ɑ&8耧?1�Nƥ`�dA�)q����Ó �QA������#�bi���J�����r_o����O���W��bw���������<�DeNr��d6��L��k�T�{P�2�M�P�s���4&N(�K�X�R
@8��]���q3��-^�� da˅B�(К��;�ÈTZPGDQ �I�H�a8\A�A�ÙI N�m\�7y����P����\�FKGg�l�=#B!(��F�P��˲}���YvFb~��nV������Yĳ}"@M3Y���9��)��}xl!��Ly�.s.T~��6����c�� �~��P'%��;�;�}��I� M�5��!��M>�"_�b�i�����ro�w�{DY���y&�+�&pzU��B�޴ � ��Zo�B�/���@�	<%>�G��+A�-��Ő'
N�L�Ͷ<���K7�v����~j�
b0���n�E����$����k���9AP�G<}AA�L�_i]E�0�L����2��U�H�t�'ߕ "�S�����D�9C�4^����򜔞6w
� zK�:�X ��mx$�0�)4���b:u���@����.L/[_�P��+	<��ٛ�w8�lr�� �޿Cg�B�w����J�t�/#˄�H�ݗ�n�+��=�v�++W���,�!� �c+�)�܀��%o�2�b�aE�S%��R3�)�̖3G6��"R�V+G�%�[��yg@�&Aa`� 
�וND�F$x�h�#q�Y|@��S��M�O���OJ�Ƽ��#𫬶h-1���#< ��B��>̥~�[�y��A��q���� ����W!?"�(�#�r}�kt�B�L���|6�匣��䅚������۬C���y<b�����z�������/+&]YY��CqBkQ�N@ÊC��<2�����)T���b�Sp���Ψ��YF
�!a��ɹ�hS��8��tg��"�SQ]L�'���)"�IIp���屟9���!᜴�T���P� ��-���{<�5��9�zaG-
@<G"O�X8�;$>�$�x݊X�����?�dާ,��~S��W=Vv�7��ǻ�^l��F�u��ir?��T%�l�� !����w�I�d�N�}�w�(�Y��6����k�I:ci!+�c��j ����3R��J�)� <��B��E0���Yȗ|�&Hе�	�L��k'�4���AP1HD> �C�t�����0JmU8���A����i�$N���s�نU����D��SC"r�$�Haٺ^|�e9N?b�fK)^��\IQ^;��¤D��^_��қĄ��JK ���L�a��%�:�7�R��`�À`�R��2�k�%`��1�����`���)��Flj�>�N��1��f�>D������ѭ�R�X������W�Z]y�^O�v�
�1Df�K�i��ܹU�'�җ���c@ߝ�9����� 99�(>3���?�c\F
1����l��c�Zꍝ<��ڐ�җ9G7w�"O���o@
�Ȩ	N��!�1�֗	���d����q�PLA��N8�a�0X����/��]������\�u����ɯ�Y>�F��vL3��5^�I���y͉�(�>\���m#:��g����ѸI]IL���N���t'z�>(�_���Y�6�W�\���������߻/��|��x��[�e�: ���L��-�&]B>L��Ւ v� �a'cx����:61��Tv̨G�H�e�g�T||��N�����0���D�,���!�߭p#{Qmf�x���
 �/�fcg�����^�T������vy�_A���$c���RV�U2V���gy8P@G��X��n#=tx�2F�_�� ������S����bݮ�u0d���i+9��
-5fT���1���N�@�0�\�
����$�<�1�c��0Tێ�|I�*q�-�KI�7�Gx�c�=q�)�m@��I.~�5�]SF��Y�m9��H�j�Eӑ�&?qS֯�`L�ڴ�呌2�l�[�5$9�.��>��c��g���й42pO�>|e�`��N��1h���?���d�%�(H�s�\���E��6���ǱW��Mâ��Q5T������4¾Z&�q���r�~��B���H��_��8�Ho��^99q��Z_u��Z�e�6�&ڬw՜/m�;֛uL��3��r�}��n?ۭen#	Ƿ�d��fݧڧ�`���>���O�ϲ��6�ޠ�X Rׅ�M]�t��_�i	������/>�]�:KoX�6�զc�zpb!ޔ�uS�{������'3SJ�t�����G� n&jo�u#���߹���@/�L~?6�0&N<�,:$k���{U?�m�}ś����o�ߋ��'s~i[j�r��]}�0�/��6��`��͎N�)ڈ�C��Uirǣ�͆]�>��Mi����>Ђ��$[UNx�������}�m{�k�p'�l�[��&�+3-��t�A���p�ڵ�|
7p�[�������k~�A�\f�ۣ��9ѿ�Ţ��Ԭp�
sK�hJ�U@�5��� j�3�
�m�D�j�҇�h-�^�X\[zQ���C����Ⱥ�
]����ѱ�����r:-t9w����M��3�h``EQz
b=~Z�|srH�@�|�q���O���vy##O��?��u#j�F�1$��q�'�@VfC|9?E����^��'2)�v�ชv���;@��{��X�#��cg7�z���7�k}x�����V?X�
�9X�������z������A/�8G���ʂ\���sՎU`�cZ}�j�x�����;VU�G��X���;���|GG/ݝ������ ̻4�!4Hlʹ���	�2��Ƀ���ʰ}-�Ϥ��Rr���H�� fh] �At�2iI<љ4c�C ����u�-�.z�T�	��?7u����3���oS�����o��Iڷ^~?�4��X|7�����|���A��Ӽ�c�"i?����i�\r��0��)� �%8�"�2�i�]����y��SAUeSue�5�l������>�ˣ��/|�o�c��J���;��S���2���������>�H�{������������IXA��O�6��m%���$r�(3)xQG;b5��4��0.�V�T��>�f�	�x
ž�y�����߄:�v8W�Ct<t"��m�[C�
K6O�;5,��B�I�.-��S+��7[_ʋl1Žާ��[r��L9��,�A�v�-b0���z�J;V����iKң#=�o{X��tq3��8V�C�?��R��3�
igƲ�а��YD�]�A�EgXȆlD$VJј]��b�@N!Hx�O��yG+K��^���Nr,Klk�6����rV�6Z��V�Q����� j_�Em!���Y��hE�@y7�;SY5��"έ�y�cڋ@$��\h'���0��V��m�ջ�74*���sB���#<�ڎ�
|�7S�M�����g������s��o}�PK    �}wP��}� x ^   PYTHON/EduBook-Cookie/EduBook-Cookie/server/public/fonts/fontawesome/webfonts/fa-solid-900.ttf��	xG�0w���>=��f�,�:�hf�M˛l'��x˂�$N���B�epB� `�$lJ ���%�e��\�Ev�%$��Tu�L�Hv��������twUuuթ�SU�N�s�BEi�$�Pc�Vm:�={m��l��^�r����K��pzo��۷����6���ٹ��a��Q����s������c ދ;/������~'Eu?I�_ٶ�sw��[��=Wi�������ˮ��kc���P���K�8�\���OB�9�?xٹ�O���tx?�㗟{���'���(Eq�W\}��=� E�u����eC�h�����q-9B)4��~��w�g���g�J���KѤ6(����4Eѓ����p���a��ƨ8	��W8VŊ¢2wR��.�j�y�j���p5��؅+wP�3�K�z���&�:�-B��%�mG�,Nk�����t�r�i�{���@OR!x��
�te��b������[��I3NC>������,�U��Z��Z�v"�}WiHs�1o���8������n=_V�i�j�Tf�v�i�}	��:��4�Hz�]�ڳVO���ߒv�t��}_κ��f��j����:r^hƙ��+ζ�������Q�W��h�[�|QӔA�mW�4�r������f�.^6�N���*fz�{!D��v{����lՇ}����I���d�'~�p��r7�W1�`��8k��p��5�B��24㝙�LSy�r�*��#v�C�U|��0[��-�a0�����O�����z8&������㓳��q^����o�|�p�N�v��]�M}��m��Wځq*sҳ��)n�W{hjo�����)�C3ݹiCgzӖ{���j�X���z���rn���\�/;��Ʒ��K�I����z��s�ٮdl�����Cj�5�M���	M�p9����8b��Y���5��5�Ei���:��<��w�̍f}�;�'�_u�q7�L���>����s����N9੕��v��;G_��lŁ3��U�q�����.[�N:�ɬo\u8�E5\f\G�B�1���3�4���Ͼ�0�7�����&,s����4]���;�Ր'�\��l�rTp�\�攃:d��~�������0���]�O:�93�^�8��d����vU��w=/w��M��;����l���?Oxo�33u8��9<����7gn��U���^ǧ~΢ɦ�0�6��Gj߅`�t��d�7������q|Lב뿜8\�o8V��?��8`ŷ�c�q���PM�؀s��1��=�l',�v�v���:�g�L�g�٘��l3N���\e���ή �0I�yq�����}r����H�)^kܫ�k�V�9�Ɂ7��zs��M������kk{��:i{3�ݾ8�Z��0���v���U��cv�Z��޿T���ٗ�e��U�N<��p���.H�#����X�ƛ��D�o�>l��㜀�m�p_s���~cǫX05��ğ��p[0i��p������f��"~V�1��5��z���g|3�����Llfhf�����f��\>s�����f�1�g�7���Gf>6�/�<3�����������T�=�c�{�,\tp������;�������w�������~���;����<�������������������!�r(t(v��P���Ck�?��C���Ѝ��u�݇�9��C<��C�{��=��C�>�ġg�����r�����:t�街U_�^T_���{q�ų^|Ӌ�/����/~��������G/��ş��������ŗ_|�����a�������K�^rx�����<������>���o:|���_x���W�����r���o?����9|���������������<���_~����t��#>��#�>�#_=�ȑo����y��/����o�<�G�x��G�����#�e������m;�8�?Z>��貣+��>��膣�n>���������%G/;z��k�^{�7}��;�����G?t�cG?}�3G?�G�y�;G��>y�gG~��G��诏������ѿ}��=t�壯�����c�cƱر��z�-=V9����c�;�ؖcg;��E�.9v��[��v��c���u�c�{��Ա��Ա��±�{�ط�M{�������3���ű��뱿�ǱCǎ;v�ǅ��q�q�������Ǉ��=~���?��e�o8~��ۏ���������O���/q/-{�җ�z���Y���f�a��jLM�,��L�� L����{S�����̾���3����̿���?H��� S����.=XL]{�ԃc�:8~���o=x����`�>rp��O	�>�����?Dbɇ�C�C�C�C��*�N=�0��C7L�C0�Ç�}���,L}���?�\S:B0�~Q"�Z~q�����~�51� ����z6`김��O �^w��÷�0�݇�����G��4`�OS�=����v��#�#��葇�|��W�|��cG�{�G~zd����w`�+�����SOL}`ꎣ�0���7}��ێ�0���S�~����5`����Կ���zt����05w����L=��v��W����;��0�^��L}��g�}��׎=
��]��'�����S}��L}�8��L �.�So:~��;	�N;0���.��Y7���M�f]U�+��^rsv��:�q���w��\/����7�]p=�z��[׿��v���C�\�w=���뛮�\��q}��%�>�]_p}���볮ϸ��>�z��	��]s��u��f�M�]7��s]�ȵ˵�5�z�k��t�i���������e�a׀���su�:]iW�wy]�K�_�_�_֏��C�A����?��?������L����I�	�����o��п�I��߯�C�X�Hߩ_���]�5]��ՑvT;��h���N{N���+�'�cڣ���j{�Ok���>�}\����A�C���i�hwk{�wkwi��ޡ�]�S�C�]{�v�v�v�v��K;_;G{�v�v�v��A;U[���
ZN�j-�������Z��Z��҂Z@�k>ͣ�4U��W�c��տ�Q�P��T����I�	uZ���M�1�����}��ϫ�{�O��R?�~B��:�ާޫ�W}���m��M������%���E�.u��C=W=Gݮ������nT7�+��:��E5�v�	�MmU�j@u�����J)��K�A��+���M���'�����s�o��(�V~��L��������(�W�T��o(_V�)_PV>�|F�R>�|P���~�~�m���5�E�.��|e��N�(��e�үt+��O������'�+���������O˔��h�YD�^��'�������?�G��;.XϠ��M� ���AQ����݀@��E	�p����	�� �4�')J���>HQ���(}��\y�^���6���(�&��P����}7S�.�.���@QA��Ⴘ!�%�ZVPT�PTd,� ��S�
W��j��6Xe����q(S�$�}R��'!�$���R�G�y�j_������PT����7ﳇ)*� ΂=p�����tF�z�.(g7�������짨^(c/�I~��� �o�����P��i � �P'E�[xK�w	�-|� � ��ʰ�K���/X�B}A���~��+9���e���)��6ؖCyW�Jx��`Ym�
�t5�`�x��������Z(�:��u�E��S!��P��!�P����6��:��v�p:��}��p�w[ ��P�� �Vh����6�k�o�xg@�g@��e;`>�.�:�gA�ao�2�	��8t��x;\��\�{.�=`=`�y��� ����Bx^u�����ʿ�{�~�{��b�������/�</�|.��.��/<��v9</�8W@Y'�����*��*�{5��j��k��7CZo��������A����׃����o��n��7A��mp�߲��n�:�`��|�7	m8	e������v���һ�t'�u'Ľ�󭀇o�������v����ֻ����Nh�wBݿ��.h�w÷�zx/��{���@�wCZ� ��7�·�����i�����Ў�C��@��4? u�(χ ���>��a(�G ��@Z�6���c�����8��	��!�����'!�OAy>�|��z���g��\��6��C�0��y��yH����n��ʴ��e��+��+�Uh����_8�������G �G��G�̏A9�	a�X��}����w���垆4��x�������>���û@Y u�Ch�B�8~��1��	����i���B}��?m���3(7D���?\�9����/ �_����������+���,��_���q�����
��+�鷐�o����|��y������Ay����� �? ���.����?A���矡/������+��W����/@�� 0const legacy = require('../dist/legacy-exports')
module.exports = legacy.omap
legacy.warnFileDeprecation(__filename)
                                                                                                                                                                                                                                                                                                                                                                                                           ^��z>����0w� �����;C�y�:�`�h�.��]�r	�q	�/����x)|s�w9�s9��P�	(��Ǖ;��2]p_���|�`�@o~�B�B}\��>��o xn�x7�w7B�7\7C��y�
�٭ ���Oo�:��&�}n���i��u�{<�
��6��� �n(�n��wL�i�p�.H�.H��p���^(�����y7�z��=P��|�A�}����~���8� ��P� ���� �ˇ � ���a��#��(�0易�>y~�� �C �CP���N�OAا�|{!��@ڟ��,��� ������>��(��}�� �/���oQ諀�_���:���!�o@y���cP�ؿ�oCZ߁x�X��~������P�'����u�$����P��C�� ���C(�SP�O�?x����	���PwOC~?��g �g ��AYu���s(������_n�����/�3�N<��kH�70�+��WH�_!��Bٟ�����q�w ���?@��n���ߠ��q�|6����W����׿C� ������7x�������� �7���!h��,/B����9�q��8������O�^��W�n^�|�p����1�F9���hv	Es��?B����-�hy?E�����z��]���v�h�
�E{��hߟa	���;E�h҃� �a-'�0EG*p}�����!�����wm�Pt���N�7I�/ߵ�ᚢ���{):�,���q� ��=�s
E����>�E�m����
�pMS� �+�p�@ѥ8E��<��S�§)zѝ�ʳ_���.��ʷ(z�^~��W���UQ�^y�BZ��)z�.�^��{
�s*���_Q�����)z�>�>�<�=ܛ�웡�@=n�k�q��	�=❽.�};����e=�9��\��\��<h���χr�:��/�:��	��wMP�E �E����%P��ˠ/�k�\	�_	0_���j�w��f|A��6��w�r�q=��,\ ��� �M��� �-���[����t1=	�O��A9n�<n����w n�8G�G��}'�{'�Ż�y��7��������w7���O��{���}�P�� ��A����C�> �< �����fBY?y~���-�1����' ����OA�����B�셼?q?��9��a����L�_��|�p|�]X���˳�4��L&8�B0��D��@i1*f3�B�?��>;�1���>���[����i�#�c�YwGe�k -�ǉ��J��
x�|23 n��jn�@����8I��sn�,e94	}����T$�.��G���t N�2�g4�]�G���t��B|�e�">�S���E��4�I�~�� D��C�r���喅�/^���uGx#���ō[Fa~�Ͼ:{�f�C�)�!+�R�lC�!����;����|�K2~�t[��Χd��Λs))��g%���ctz�¼�R��2�|/��0�F��rҲ{��~q��q�'δ\���{���;�tF�y�ϐV��C�{v�:H����i��@E(��,�_��"?�J$3Kn�`H�3�Qu��P��NIM��^����F��n7NW2G�T/��ZM�N�C]B]G�A���čډ��&�(a=���[���/E	�i�3}��1^Ƿ�Y�eQͩ�i���Up�$ܚ~ȭ>��~�D����>Y���_������$ҥ����:�~����`���eF\T��0�b�l�Nd6R��[`pM�Ê�ݖVۢ�4.(���r�z��j�hJ��d��V=^�ꡤ�k�Ʃ<5B�F�G]E�N�CQ��	���ב�(7����tC���B��r
M�tS�����Nn_�B�[�g��ß�I�����UJ> 7�{���e��t��\�ĳ�s����#�>7p���U{��?G6@���M5�\_����YτU_N7�E�齣��[j��5�A�F,�_d=T�B�v>[+�[/h�Rw���(��Cma`(�[(?�:�ƃ%*�i0�~�ӂ��Č �P�W!(}J
�"��Y���ә��\�\t%���{��>0����I
�ai�),%iG�����k�R�*RK<���t)��P�0����
]�'�7eaP2d�
���:���?�3����M��M �M���yF�!����0*T��`4a{}0�Uս��q2hJ��!�2���dfO%{�r��\���3��_*d�=h!��О���;�_�<����ew�G>o�����˺��9��urC�L^�t��#W�Xpʐ�sRT�rjk2Xy�y���C�W�J�op��GrTh�]h���r����O�s�9ʯ��� IB��j.��9��㚒�iA"�qI$r�����u��W'�g��ĉޓi�=�8�Aߥ�P+0�$��"� ��g��,~f�4�@?,�ӆJ��@�d@i�~A�/m��%Ɠ���HR*��d�C�3F�`��F��o�R���~��w��NV..�C�iU��>�ha�E�k�{Z�k.4�̶�Rݽ8(��,���`��2��]7{����)���X؞�EkD(��+
�"��$L8*�D��y�ia9��O�O����}UOjg
� '�.�~�!A��qx-�˒�PDc�8�	�~����W�e�N�w���8��G(�j�(o���/@�����Q�/����~�n���I��k9ˋ,z�n��\��>2���B+��K��Z�!K�Q@��^�A�
^*f�T
��"�����	E@��P�^*x=O*���8�I�W�K���pL��|��Yks�����P�����nw�y /Ϟ��F�����.N�.a'ry^�<8(���P�ThQ�G�&���8UK(�$w�`�0��[�V�z�f�m�,=���$Yۦ�~]��q�������W�oVݪ�>��Ѵ.�m���e��WwO�p�s���q�g�e��� õ� �a ��kpB�(�YzP2<��[@�b��_m�)>�i�Ӫ�6L���R?�ɼ&vNV*���J�}�FPK�0��FL4<8�%2t��Θ�+Y�ف>p�����7tApsv�Νk�+�,˱I��t���_=rυmk����Ѵ���x��{v����xFydU/��X`��8��fX��ɬ� �T0����"�1l��0�x9�5�}�
0C�Q�E���
�h�C'x�q&���w�ď��83y�؂����m���h��P��k�B�iM��f�̐���������9�S��MϲcM8��c@�R�V?�4���qs����!6����.o���Q23orܝ�G\*ݼn,b2 VvE܁`H�c���θ����%��i��F��8cxt4��Ÿ*<x��b\-�p��-RI!`ρ��%��my�������x�}Wxh@��@g&C@��ջЛ����GZ�2��vOk(�P,@Ӳ��(Tk�>2��ҸP�Ű��@E����������˺	m�M\��+���{��������a��a]�'�IzÕWn���3�-�1��yQ�N�#V��C/J�@�Z�Ŕ3���AQ��}nU9C���:i���m���|_Cu������\ �h�!�_ZZ�_�@ n~t}c�>uA~���������S�����yf�!jl�|��|�h�0BA��fpL�$�
'�,Y�b��WX)�^�'��?׽@��L �Z]�V���~q���ei��������,Ϲ�\p����]	���?���D�ǫ�]=]�*��p|Ki����.��P���.�GP�Y�m����
�r!�*ST4�i��7^����5=Y���[�P<>��W�q��!��t��_�d||:>��)w����?B�Y0���R�Yo���<��ѿW��R��F$��F��O�Fp�MV'�'�s��P-eu7�|�gjk����������<��E���O����A <�Gq`mM5i�����gvg��>�l�E��s �=A���q�����a~og����Cr�8|!�6�$����=F��E
��Fm���\`~>�/SN�yMK#��Hnp0�F������~�2L�O�ϧmSe@��C�JnP�/��_E�T<��L~+���@m���T ��t�'v~�.i�[y\��X����^(��0��t����M�OGҰ�i�i͗�tħ!�&�H�Y 
B�QƯ�~Q��,Bp�`%2IOi>��U�=>~ B�S�:�I1��;L%�v���^���/x�nk��Lvr?MA!�ܷMe5�|�+ī���ݫv�Z�#30:00�����Y1	I=z"�,~��A�z��kcA7��ͅ��#�
�a�!D�`�l!���,���B��ϸ��Jy�������8!�ɭR���Œ�I������8�8Z�5:���s
��F�~X����%��whItj$�r��~NR&��p�)<�˭d֎�C[nXE��(N���;�_=��IL���TR�G Ef������Z�R���ӎ�ZŶ������4Q�)Ϝ=)3���  ���ë�����lsd͌o�A:�����c����N������~�y��}~a�������*�������)G��&�D�.�M�5^��@�>Tç��d�fP�h��$�'��O���P�����ţF�Nu�����7��j�kxM�x|��\w�S%Ռ���q��p"�!��v��Y��^����xɞTc �7?dg��7�,T�'��,Uw������~wP��h�o�}���7N�kz�Q���۴>(�Q����DnGO�����g`����?o�7��&?�u�����ʉn���dLD���c�P�;��=�m�Qz̯��K
���u5>:���uj%/��ſ`�����hF��6��T�yƘqc����nuDs:_Gyx���O���P&T|�1�"�b���rQ-�]�����"�3�E��ޝL�.G�Q�|�(�,��(�>b����#�� �χ�lƅ���^�DO��]hr�(��Q33K4����}�~i���НE=|��.�1�phi8�h����)��Ґ.��������Ę�%,�oKɍ|O��Jd��O�	E#���S.���3˳r���<�q�8�	�N�1D��80D�K��{�D��?u��;�ٙ�.��n7G�Wҥ�فsJk2kw�Z��>�V �7�c�Xk�ih�iJ���6�.ִ�t�Lf�^DH��u1�j "t"O�{� <w6��H~N������+q�N6ǹl~
��<�c���u�DF����	n5���7)U�~�cr</~�|m��rlu�l���o�M>E�M<�NS��*��SQ�ꓮt��$8�h�������W'�^�_T�v}p�m�T��ѐ����Sv���=?�u�v���$�ķ�4�����~��ki+k�����:ݪ�N�$+���rL���rz,<|=����68�Կ���B�)�������#Q4k�m��0�|���Q[0{K�1jA{HG�7d=���l�ۍ�S&L��9��;9hh��o���\隥nt����ժTqT�4�'��+U�c�`&G�;��}I��ۢ���&Eg�6�#};i�ɜt"�����:T�:�s��G��"P��z��J�:m�BӰ���I��D[K`�ޡ���U*8�
�i�{�XH�#2��F���f2� ��zH=!�����}nA�<!��	��>�!�N�(�i��~i�Dx̝d�:Ob_�/1�ؗr��`.pM��p,�B����٭���e=���;A�ٍ����	̔H%p�fz� ��v:�57�O_�����y�o�ֆbCuBX�]52"�9QZ�L���೷��{g���à/P�:�i�:�����|DU��r�*�.e	շ>�(����c����z�x?����$�(�D��t���!�N�yoe9����R��h~����x=~��p[x4��D2�ӀZ���}��ɲ�0JJ^w&ܱ�xǥ�F�\T�^��V��+0FX�ac��liI��0vVT��n�T~����CUC�6�R$?���ƨm��oE�{uZ�zP֒YBeKl!�|V8İ��H(��C70`�+�bBa}�%�.Pb�S.Xez��5,/P��p4x|a�/| =�B�G��k�|dzn�����Ts� �	���P�V�}v|� B�����f���+���@P�\	��i���v��%I�pR��1b�����ף6":���Ę��`�W���`��A��y�,��1�j�b�}�9��ɶHd�n9i���D�Z��6�4Ӌj
x��|đwPl̛��H��SM�Ɯ��Pm��b�>A�v�����y�O��Vd�Pt�#{�H�0e������>5ڷ���؀����O������5�6��tT:U]l���5��EBc.��d���n�5����1��OX�KЧh�{���OA�[kK�'��7��&<��՛e���T+�� t������R�,��&�G=�I�����Jʃ�j�V=P���1X��ET�m��@���&;����6J98�5fX�S�S���|{�Ι� �Id����6�i�9���I;�	���K>XS�|Y"�V�g؋I�0�h��g�"��dr~]����~/q����b��d1���I�yO������|RR��MWt]��&���[���8_̙/Z��m�Y�Ų)�aMZ���t���UQ�*�`O�ϒ�hz�����^{^<cg�cT�X�y'��j��X���M	&Oo���Do����2�'�����&5o
&��.y�=������ꟷ�^ū��G��[&�|�)h6T�i��2Mh�������b�{�О&r�ߦ+־3���Lft���C���1q�Tƕ{��ϊ}\KH�xe�-�q>�y3=16ֻ!����G�������zTEnQ�C�$�7���D����$Y��k�R�|���zX,>��T__�ʏ\YVb�p$����@XN������S{�������ɤ#�x8��X�vɸ�m���n�J �=X��<�w��F�rЂ��<[��2L�g-�bK;����K6m�~Ӧ%���Y��J���0vn��"y���MKH���0��R��V����md^����V6��>��T6b4g�Ye-�*�3G(,��-d1�X� �a��栊�,H��@���EL����?'r�_���b9@bh��}Ӓ@ɽ�J+;���c ~�uczij��Zx��r��x���%ޅ�mK6����"���G�ǁ>��)���2 �^��r�>F/�"�j<�f�A�h�jb(���P����Άf������`(XO�vd3�fj��Ё��H쪋8iD�辝�&�Q<�0)�u��C�����Q���#�&<��W�K/U~�Ì�3�#�r���)�*.X��ZIm���;�	k�>��f���A=Ql���~ڒ^�8��'O����j%��;��n�����7$�)��	��wS�Ҽ�~��>X5/�����ԋ��H[�&��	��H@�,�MJ��ɘ[̱���xL����W���,wL��XS�H�3��STw�]�haέ*;aY��g��w�Yq(w�q�oѷ���>8D��������x����z������W`hN���b�~	�<�C���wFtT�,)~�Wy,�Od�j-�;�����k�+����{@%���kn�f�qB��~u	ܘ+p�1<�r�J<7\�4z���׬����@� ��>
Ж�b�-W�2�m�'ks�&�����m�t�eySZ&�gwsN'D��iYi-�7)X�2��з�;�-o^S�>e?�Z��若�!�M,
���@�@ �ܷ$��~X�s�U��L�Wh��k�����_�JL�߉���N���f�o��X�%����SY��b҆>�f}��x�):��=	�/<p��"�);E���;T����*-���H!�;��q�J���۫�v�yڞ�]=�+gXb��6U�����X|���� �c��C��%�@ޙ鐍Yz�!�N躀h��W7y�-�J�8�Fެ�B*�_��e�I����&ȱi����O��{���x��N�6DnQ�U}l��ߑ݊��w&ކC�ָ���v��u3��|"Vu�>J��&:�B�K4�4�$_�S����e�
^K`�d����)Y4���T�)����Q���W:�N��K46���a�F�i\d,3ί$��o�ǉ��;��ǀ$@]�R&,�d��$L�x)�K����0&X!k����5wHPҺ�#��ǥލ�5;��!�^����9������#���ޝ<��=�/�~��}���[����R��5.ma�,���H�.u_��d5�T^0l��lp( ��?8�=�A��A�F�n����1T��7 DS"'{u�eޭ �E�����{eNt�O�6��H\;�AJh�X(�������Z=Z\<	�OxE9�z[[b��ɰ�@4�m����S� �#�(�#����.��]�K�U��\�X^�%�}^ť�2�a$��Ք�/xd_8�=%)Bc	H�J�#���쉷��H�%�rR��=ǋlR�w&
ڊ�|*�y��SM�h�$�|�F���F@0��#Ч}Xr���J�>h�Z��p�*:@7lYR����pen|�0��,��YXR����-E#wnoiah��'F�W�L�Y����E_�A���
�z�5��c[�xߠ�K�P����LB�����{��awz�{�����nV���nM,�l���k�lS������˻Q����-����A�Vn|����n��]4�g�<M����%�ku�(�ͱ'�G-���s�~��q��a�иY.hd���?]L�t)����P[:I��ߨ�H���q�.�2!�~�g(8�
��VN�N
��X3{ñQZ΄�d��5��n���n�pw/�0� ����L�9R��%��|�A�"`��,�O���(T<c�S�NcFbw�>E�Q�B��)DL�M����~��I*�w_)"��,��C(3���؅W��m��1O�7IIi���#�-���\�sB�F.��14���v�X�ӥuv/^�j$+ClQ�愜O+t��c�ڵ��ᯐ�}���~��{P�m��GӒ���W����!�7�V��Y�yч>����3�]>1/�K"g/�W<^����Ğ����~� �La-�����l����s����Ϫ�-�1ħS��8�aV���8�V'?{�
�*
׶.��Q��i�����u��T�Ě�4���0p˙���k퀅	�ۅ�3�&�����3i,h�I�4v��˲cm)8�(���]1�k���*�&�Q~4�*d��Tt���okP	������z}����Q�-ejX\������'��L3���J��M�$�<�~���=ػ��W�Z�#��d��tO�
]��{~bz��W}ج���H�g��h6�ʦ�Q�mU�}ծ���j��:��tt��@6L�&��f��n�zt7?N6c��6vQ����&Q�35Y�Z�����!�P�
�t%�v+���Q6�x}��b���ӑi�����t�%����~@
+�nwgҝ�����x$]\!�<������)����
�7𶁅��Мbj��p#F���\X�B@?�Em����!7����(����wX��r��v���Y������mo�#��\�㹍�Z�3ƭ /��a:�F�S)cE�����p�IC��i*�ݡ!���;F��j��F�V�-�9�}�Hu�>�E��{��:]޴����I�iZ���3�jao���c�(�;C��!����A
�X��	�}��9CsMb�6�v�O�d�OW��ͻ:�粼��^���F"��6�z�@��55����ִ����b��Sb�����o�_7��+RB�ߛ��歺&��R� �@O��i� �Y���4��k��c��JK��3�9Y���Z��ٜ�,�̽V�P�n���"�nM� ��1d���������4t{p8�՛L�^~�3�FI�@XE0j����5\�`1�v����N�N�����;�N«$�h��FM��[��[	�cN���o� ��h�z^v�8i��7��-˖-�((�1?��x�D�8)Ds���2���p����7:~�LQ��b�����ɑ}�XKwR}T��<H��\�N�SX;�yB�f��*d����(�FAT4Jex�A���}J~Q���c��ԕ*�^�[�~i�tt�$]�0�2W�g�Ļ���~��C��6=It����w�;���º���/1��ĒpO��������7�]�Cߧ�T;���X�p-cS?CxRp��e뾼"�#��̿��i߿h����v���*+�qZu���rz��h�W�_��{6��5�h�[�BY�1���
/U�Y���߼�:�:��j�N���2��[�=g����,+{��aָX��eYx0F��YÎ6�����菂�/0��A7+��n��CR.����02NR�XxA_"��u4�����Cu�ׅ��!��g�[U�c�
�ӎ)�V_vi⠨>��ce��3�����%����)���G`�>T�n�U�}��D�c���J���Z}S����DZ}{����!x�ך��xܔ�.�1-�q�q����ˮ�c���A���m��.hU7�����[S�֜�Bb�Zc��`���$ԏ`Q��(l���F[R����B:��)�n�:�w�@&3�A$�x8��F���s����#��rS�xy^J�J�:��F4_&\	�d�ߪL8����������<ߊ)���r�[s/J�4H��Ǹ��XJ�⡛um��t{��k�"��`ɬm��5d��8z h��ߣ�]]+�n=�+#��A�@`I`y �q@C���'{)�ϑ�}+<θ"�r$,	z`q �8��j@v�;�k�$a���v���� (��-x���í=�u��%�J�G��B����q�Xqݦ%�k]3����=���0�O�5�ڎ�0*6nad
YS[I@_�:��t�o&v�������|��J�Y�����,Cn�h�(OMɢ�7���Y�4;�)B�n"��u�1`��8���WF�OIRhU��X��D�r��Z���T}}����$��\���8(�@�;�[Di�V�/k����F�.6T~"�d�{���$��C
���r�X�M{	?����M�z�7Fm�Mr�5@C��Xk�Ǳ�vÔ25l�-�FU"|9`!p�����D]?OnO$�V�|��E!�H�(|���s�_��-�Ї�o�v�����d��7,��WQ��r/�sw�\�g���T5����)�Ɵ���9���~��Z�7`17���z��������)�aٿ��*�uR��͖Ы�I�He!��KU�r��͟FwZ{6T��,�5���V_BK$�(�Ȥ6��r�+	Ds�DV�i�`����d�m���5u���N�������+�\���Z�L���*[��L�W��O$XMƘ-F�ߊ���k��5���$[*I$K�bn)!i�즒xO"S6�P�uƔRM�z(pK<�)���Y�CxxC*��kWӔ(�E�4�6��X	FoA+>���
ʊb/�S�0�K��3"�@���7
����y�ө,{ �VD� ��sJa=-�ʊ����|��Qp�n�\���_l��K��Sr�դsL�H@��<��5b�I�1���X8D���G�����r�}�P�|X����v�с���l�ddU���D���|rabA�A$�n�<�F�U��k|	����E6앚�^�DߜʔC�;s᮴5#���L����:|��܎&�ۡ�5���M8Zmjd�����<:l�=��rq�4��%8�����755�&�O;>>e��|L޾=� ���Eðtq!�)p�۴��i�2�O�rV8����pME��\h��8&�����Y�Х�\������n�8��|�z��8��Y���[
[�}̳0��%�O"L�2�uͩVӄC+�g{�Y.fS�4H��I�ܤJ*�h�_ߡW�̑�,[��;��IK`c�2cF�y��t�18~U�1a���i����'�e3T�<-VȤ��!R6ӊ+&y�x� ML�:���J:IW�A��qpV�hҴ���PE�U�E�S��&B�vA��H��y������zM�D]ѽњ,�ƻ��$Q-�W�e��o$����.P�Z�4��ƕit��S_�L۱�2����|��S�ǤH�O��0�4��̭MOʓ������G6.1K��6{�nK��a,m�f/�oX�\����`�d��b����E�,�uD��iRXߴ!Eg*�I|�  0���Z}��>�k�"m�"l��a2�F�-��咐�S����x!���(#�$0�hCd����n��_��A7H�R��w�����}���,C�l����s�*���)pFNP}��O2g$Ţ��B/�i��e��*�0��>��R�Y�_=)��Թ��{��;�Y-KIQ����:׶��	��{JU�g;��?��"�{�k�=;�	�˛�]���+�rw��N��{����)�J�2w7��h���K��RD�1��G�	�[Ly.�J�	�[kp��D�z�|��W>�f+|"���i��ء�8-0<A,�����(���>AWu��:A�Qi��(R��U����
3�����k�����d�ZIm���^�L���	���i��Y�=��'��d���簋��~�2�����{4Vs��O�7�_�2*u�p-���c��t�L�S�����-[����\�Ȕ���O�!�&�	��
R�p��ª�ᢨ�.�Ԗ�3*�R��*
��lXĝ��꿸<nwo��C���cA��(Q-�) �*�,r٤ t��QAϿQ�b��������֐�TU��-� �j��j
��{f�'y�֑Q�Y:�6�qۑ�m�����]��(뻍D�N���֯�k��/����q����0��Y)��,G{��D7Z#��)�&2�)̀���$H�a���(�)�5>�ydϐG�r�;֭�ٕvM��]�pC�֐�3Y�zXD���\3�ߙG(��V����5�\;c�ds�:9okyǐs,tdA�������$�4|	���ģ��rHv��]��Z~\Z�U?�W�#ѓzU%�	m��Dx��|�Gq�=j�?���G���n_8���['n�Z}X&��ʝF3��P��ڥ�@��E���[ZbQ��h������R�	jK�#��,�%[w%S
�P��K-����ݲM�q7���]o�߹f�N��F�e7�ЊԶ0�l��
��aQYS�c�֞�B�~]�Ac�Vo�{����Y����C�F��R�o�.������ei�&}h�65�^�y�7N�I8�i�\�2�D�QMd��ATưŞ��I��?=9m
YWǉ�t>n��'�d<>6K��h<Z��[�x���q��@AH��/M�6.���J�1���V�����K^hp�(!�����^��{\4�Ů�U�oU1���E[� ���k$ӵ<�b��K�4�VZL�5�K�F�|	" o��4�҅v׭+�sP�p&�R	꜡G],+��d�.7�ⓙ�Lu2��*�mT��g"Į�i{�
 �l�b�i�ǵ_�gRu{�P�7px�������ق%<a}�T:F��
�{����l���M����B���<���|���G�߯"�F	�K�����bK�oڤ�[��v��1y��4��a�ö7�r(�D�:�W�⠘��z<����;>g�+���P#=il=���5"
'�]��m���5�Z��x�t����n�,AJ�&f��x��#��V���{��'��I��t�����B1%���(�EX ��`@h��7
�̇ޜ�v�'1_��E%�<�:Ƚ9�?���T��1e��;DƽR{HU�s;t�Nd��M,q!s�p��Aj,P.���3�6�M$zÁ�6���U��e�d8�j�㽉�BY�ݔ�C$�~~� =�®���5�q��c#\i�T�5kmXḱ�v.�&浃�&�1�+$al�D�� �<kۓ�h�V��4,�^i4F@S!�}�tSE9���a(y����m�����pX�b�� �BM팟�6Is��j�A�GH\+ؤ�-8�~���{ @�_v�3,����q�)�9`��$1_l�q>8�`e�y�8Z�v[��=��ԟu*�:�T�(�5r!�@��Iaf�šM�,����1�~����Q�ׂ��n�?�� C�� �|Mo��i��[yns��t��mP/���QS��(>'m<��iU̴��y*s|nRu��6b��>Q �=�~����=+"O�C�Q�M�ckG�M�6���
Y��'$��7g0���5[�������lm��<	k<cp�0�f�U*�������=Q�L�D�Ip�3��[����#�>b������q�x]�q�j;��1�d����fު�����*M�u���H]}��O������c/���C��^�|�It��yvQ837d�������D�*��i�	�ɶ�/�N��wfN�M�	AS�	�ѵ�t����[�\��P���vP�'e=Q�Q9B���ܫ�$(`r�G̰���!�7Nb���IȽ01�#�LUm7Δ�d����)e�g�úH���Q��=H�<����f�]_!�O��$���S�,�l�]VF�C����"p4��7AaKs`H�����n�������������|��(�n�T<��A�-�c��γ��Bɂ���k����=�v[�ՙ����I��0^����8P��։:��k&�"�`덯���!@�Mt��l��(vnS�\��Ĳ�VrG������߹�aGu��0�Oi��H�$������M�۩{��ε��<����� ~�qhw]:<Z=�\����Q��:^���o7�4�N�����)�vƀ �� ^!�b����I��� >m��/y!PJ�;�-f���R��@�(�Q��b�E���?�����O'�C.����]�����:5�JeԡL�W���p&�N�;"��=�
��k�b�6�b�����?�2�U�;W{�Q^ZA�W(�jX�aW1��eC���j�>�f��#k�I�5R:\��@ ѦE�4ɍ't��m��<�ʾ#��YJ�?���鷡�Yv9).��"@V�gy[����g�0KUv7��;{�(��=��)Ig�˗h��I^U����UxT;�k$���vQ�ı1Qꭹz���}��'�0�~�K��\�d-<s��Y�:
���䴠��}j��~(�O)6�pST�'^O�]&*�x���������"�ꙧɛ\���l��	��!E		�ݦ!,��mZB?"r*%�%��6�Y*�oG{��񘱯%"�[j/LS�{���[�m��ɞH��_3�T0�Ͷs�2���fK�3sdb���l-1�����r�bS��K��>$�C��w|11���E[GǔEǒ諨�D�V��ӈ>\�v9Q�؃,��saK�����l9!�mhm2B�;�w˜�����6x����B1AA����_�U�A���z>�!v��>��DN����zo[�{J�`w�C�"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNameOfGeneratedPatchFile = exports.getPathToGeneratedPatch = exports.getPathToLinterJS = exports.findAndConsoleLogPatchPathCli = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const _patch_base_1 = require("../_patch-base");
function findAndConsoleLogPatchPathCli(patchPath) {
    if (process.env._RUSHSTACK_ESLINT_BULK_DETECT !== 'true') {
        return;
    }
    const startDelimiter = 'RUSHSTACK_ESLINT_BULK_START';
    const endDelimiter = 'RUSHSTACK_ESLINT_BULK_END';
    const configuration = {
        /**
         * `@rushtack/eslint`-bulk should report an error if its package.json is older than this number
         */
        minCliVersion: '0.0.0',
        /**
         * `@rushtack/eslint-bulk` will invoke this entry point
         */
        cliEntryPoint: path_1.default.resolve(patchPath, '..', 'exports', 'eslint-bulk.js')
    };
    console.log(startDelimiter + JSON.stringify(configuration) + endDelimiter);
}
exports.findAndConsoleLogPatchPathCli = findAndConsoleLogPatchPathCli;
function getPathToLinterJS() {
    if (!_patch_base_1.eslintFolder) {
        throw new Error('Cannot find ESLint installation to patch.');
    }
    return path_1.default.join(_patch_base_1.eslintFolder, 'lib', 'linter', 'linter.js');
}
exports.getPathToLinterJS = getPathToLinterJS;
function getPathToGeneratedPatch(patchPath, nameOfGeneratedPatchFile) {
    fs_1.default.mkdirSync(path_1.default.join(patchPath, 'temp', 'patches'), { recursive: true });
    const pathToGeneratedPatch = path_1.default.join(patchPath, 'temp', 'patches', nameOfGeneratedPatchFile);
    return pathToGeneratedPatch;
}
exports.getPathToGeneratedPatch = getPathToGeneratedPatch;
function getEslintPackageVersion() {
    if (!_patch_base_1.eslintFolder) {
        throw new Error('Cannot find ESLint installation to patch.');
    }
    const eslintPackageJsonPath = path_1.default.join(_patch_base_1.eslintFolder, 'package.json');
    const eslintPackageJson = fs_1.default.readFileSync(eslintPackageJsonPath).toString();
    const eslintPackageObject = JSON.parse(eslintPackageJson);
    const eslintPackageVersion = eslintPackageObject.version;
    return eslintPackageVersion;
}
function getNameOfGeneratedPatchFile() {
    const eslintPackageVersion = getEslintPackageVersion();
    const nameOfGeneratedPatchFile = `linter-patch-v${eslintPackageVersion}.js`;
    return nameOfGeneratedPatchFile;
}
exports.getNameOfGeneratedPatchFile = getNameOfGeneratedPatchFile;
//# sourceMappingURL=path-utils.js.map                                                                                                                                                 �=����H`~~�{.�� ĸn���~r��=����:�[���1^�eNS��N��ǉ���C���8޵�	�/������~ǉ�Ҍ��lb�IlnuGY�)k��eɾFMd����4���9�J��bE竄��:���')����a���q�k�kȒ�Z1W���`�'26QdY\t�ر3G#b_�h��Dmg�b���mqtAKʇDV�e�W�D+�My`�/�uE�+��K�n��
��eX�������a���q��=�1�S]��E��}NVQ��A�,S,Y�>�,6:JJ�O�"�C�W0�S��@[%�[΄���z��D�'5�g-�!���X�R-���%�ͦZ�'ů���˥�:= .���oX_��R�bFJniiwq��f������:/�l:��.FA��i\@�B|���A´Tu&Ok��N+�F�ib��=�KZe�W��G��3N|�L����7��[�+����r�r�$��* �`�?��8��S���e1�yK^�2r;`4�?�0a	j��$h�,oO0.yG�r�;d7�؎�X��������ܴu(N�C�Ib�Any�w	�m���� ���M��8�+7�	D�\��"+�]y��!Cd���=oE.4����ͫ.����\x{i�^���:�{K�fg��
��#�;�;������m���`	T���#�� ���|���'��*�lO�"�k�OY�\�f��6��+�u&�4٪��_
z~j���ZY_*��r)WPCj!W��>i�^��>m����+	��|�_�=rࣚ�o]����êz8^�і���^M�-�!oHX�b�����;��B7S��<�������y6P]&В��}�d�����&��5���t4�C3xqb���F��s��&gݪ�rа��)��a�ej��K��qo��%��7w;n��;E�0ͫ_���\��r-m#=��P�ט/�os+d�1B�-�V/� ~\n��l�ܻh��؆v��g�����f�I�:�}	�P�9G�bd�9L;���o�`L��%�Ln�0��o'�U�	ܴ��PW �2��l�JU-���X�v|��QV�e��ڴ@�!��Z� �ź������E��
��c�R?�/��2Dؑ���;���o��Ln����t����]��N�;:Gr��\[Yt��K�	C2/��S���t�ʅ�pU"��� ���<�ˉ���~���s��؂|�]�Jx�[Q���M�0Y,f\.���ۑGt�.���)��C����.���5ASᦑ��W���xv[⒧�T^bY�WQ��S*���g��������'�%����TSZ��W-�q�ZW?���1�W�!�{��.$�b5/��`����q�U�"�^���mt�'0m�"�`f��~�J�n��;���LN�Ŧ��Y+�Z9(
k��xr0��T�җ{���0�'}�[#I%��ȓ�z�a����Ԅ~we�$�Y���q�W�*\-��R8�2���ؽ����� ��rm��� k���Q0m��gm ^���E�F���C3q�LXh�L�i<�y0���"�&ʹ %<�d�C�$Re/ J� QWQի��$
68)+؎��+^�ۏ���E}u�H����/F4�#-� �2R\b~��$�&~���nӘ�[eE�YV��$��uEPtM��.�R��zu����M��ψ�Sn=P[�l�.���&`�hp5���xo�"�@�I9�i�2�&�8O�wuS��i�h����P�!�!HҪ�E{�u�<a�a=�Ɋ�z���(�粔Zut.��ݙj�:��PF=̔�W�\�}U5�T�r|��S0x�<���M�8(�W�}$�Rr�2#La�Îp�^ۋ�$4%�����%AO����f�I���V�O|�9>ͭ���~�
�\�EFg���1�n���;1A�Xَɇ�[�-����OR^���5�J9#ޜ|3Al ��P�'�Z�r��Mw�e-��!�)=淧�=�I����ڒ����A=fp���#��^����K���;��"g���{�{��	�,?'����s.�����[�̲2Ϻ�D�=�*w�=-J�//˨�;�LDfێ�g��,�wSnr)Q�F�Ȕ��?<���'�?����a[Cz����!�c�.E٥���
��Qz�z��籷���I�}��� �z��iW��K��&�"%�9,�@g�e�U�
g=��n��]n��q��C�v���]x��͛Ꮆ����˃r�(�b���Ej��E�p\Fj��i_�^�`�T��.��C�l�*�eM_��6��(5H,�ˇ�}"g�~�t�(��IS��^L�2�XX���6�-��d �;��^)W��>��n/I���Q.���f�]��JR�ы�9�˴�
��H�ϻBݑq�0��c���#�1�5�e�;�Ŏ�%7�� |#k\�V��rkw�H�ɗ�����F�3JV��B��	w�,x�bg���h4	����6�p���f5Y�ۧk����2 G�B�2k&,���DĄ}e�c!t�d1�?�&��,E�_bx��%>�{&�UO�y�͵�z�BZ�^`�Q��׽^]2�@�+���|����D]2ꖼ�|�O
�R�+�3�o���|�t���z݆����-�sF�,K:�NR%s��4`�t୪��D��qg���`P�(�����"��E� �}Ve�F�aSF�ݷ�^��t�H��#I�<�d�{d��M�9Q�2qZ2��EoE����x�V�|�d�o�LS��:���H�FYu�#�JҸ$��w�Ty�ͥJZ]</_��<�\.�u����V)�P��r�}��rfX9Kה734ͼY����0�`��E�-J2�bY��� ��ۅ��x�ҝK��cw�F�����'��O���������ξ+�'%���R)?���\Gm����}�_�tTI(�u�Wh�)�b&[2���4�)@���fʶ�Q�-}��i��jA�����3�o]�t��rL H��mͨ���>�i��eٽA��!>�9-�\)���-J��8�����nY�����Q�/�g���%%�s��O
Տ
nT�_s/f	�r�}���2d�T $%���X9	�� �a��A���c�(HGi�U�;��r�iZNKL!6�H�� �`�ۥ������%�j1r�,�{%�|��&I{Y�}��_�,� �tޝ*"{�Bv	����M���VR�N3��%�?�x|�2�v�!^�W��ƿi;8���vxlւة�!Pn*��&'�_�ansJT��(������"�$Rv_�%6�C\' �j�}��%Oĳ�Snk��e��f8�)��[H󊧥N�
�ݸZ%����&F1k	ФY?�x~q6ͶN�DigNsh��|���ԯ& �.)��;��vP=�"�����.K�<����Q�m�o�ĸ�yR��u	<����G=.��I�9�sW�2o�oc�����|�j��o���݊���Y�$Vu2ӲUv|?7Ը��qw)�j>��s��^��R�(��S܀�(�Sst���.��b�s��,���V$l�#��(rHYP�w����"Ϸ��j;�*a^
,�+��|������*aN�x�Gk��4�̀c��h����męr�b<����r++1wB c���I�3e�V����?)6e"Pb�3)[�p-_�Ao �q�?�7L��O��`�p�ѹ��(�e4�H�"b�%�o�A�m�^r0 S&jo�t ��4K/E}�/��e>v�0����G�
PB}����L�x��>��,`Z6�Z��O���Q���%�+��e$俉��[����Y�k3�is�� �W�o��.e��HhJ�ձLŽ�ƋF�Z��nt�F��]tʥ\z�"/���3��nY~��=;��-���˹�>��KO>�͙g����~j��T����kr}����T^F�k-�(�o����V�x�Nk�ۂ�USTn�TM�lDiN`^��c�9?D/A��-��T�:��f���%a�[�%y�(Br���wn[!"Q�}B��/Q�[��B���;�y���(�.iezOY@t����_�VD�e�1�������P���-�{���檋Եk�2�f��)4�)^ĝ���ѸӀ�s˷28Ɠ���L���s?���7Mk�Ѵm��w�cm��`6�Lt�Є���~�vɱ7�������]�Z����T��xkq�'�ͪűl6�#������pW��?4V���8�םf�z,��
�}�F{��D̉�6�����y�:�Zb4N�����XE(���8I<�\	�#P��ܠ�BP�^Kq�KI!�]��FX��03�^��.b���=A�
�^��DO�r8��aӿ�����_�� �|��/�mb��4w�</�6��(d0; 	�O�.sO1�	h��/q�Cv�
�#A�xo|���t/�~!<p���T5
��^�#z����<��g���0n�� ���5�M�xto���z!2��BKp"�N�+z��!iy[�s��g��A��E�o�yE���eX��/���Lu�rv(l�R�tB�{��!}�:}(�r�3��tlh(��,f��֯�Y*"ǃ�61%_[GG���lZH*�z�~�Jr�={p�lJ#�ϡ�:νu�f�6����OR_��X%*F�$z_9#���b�����o�����[n�7��B;9�a�*��8�le��d���Xw@�V������"J�Z�J-A�B�J��c���u�7�S���YK���5�� GȫTm,b�1ƨ�E��'�*���+hj�HU�|�x�تE�׫�ې��#��]Ӊ
ړ����i��)���j_� �n[�`uW�����$ǚ����Vf�N���SA�0�0��3e�A��/�#{��u�JqJ'p @�-�ۜ�Jg+矯�]2'�I��A-%~*Lt����Ԗy�0p�����]v��w����G�h�WsF�ȹ݇U�UE��c��_����S�h���"������EUTk��F�Őg�>�m苔��e�����	k��m����*i�*��7q\RQ.�>{��$9n��<K@�B^�6�_@iV�!;v� �ݸpa�oD"�,�-˥�,���O�L��9�������5��Զb��WD��N���u8|�m�5���wnd����C�`��Z���\7��)��7�]��������M�9�Q{�n���]ə}i���,�1
��Fuݻ�K�O�bk�HB�[������O�3��X���D�f�~U�,"�_��"f�C�:�K��K:�y���sN���`��A�q�$��r���j MP�w�E�S#|�櫞�N�~�7�n:$�,�Ag�=��� �����1"n-�.c�Fe��A%��%�ì�aa�(��ֆNk_� >��Q?fY�I����$����!�fSñ��gO[�`$r7ʗ,�D�֡e謎j�Y��|а�I���i�X0I=Yt�
�.~��S\nCg���ƅ^�v�:b85�x=^���E/�xYi�ڝw߽1��z�v?z��Û�R=��}#[��G�As#��m�X��r��J>��F�/h��}��.�㔂W�@g`�3���a��i�p�䭾H�`<��FOՀ�����C;5z5~�vG������W���D0uTg-�χG���7+0S� �K�B�&m1$�K�ކV-�ThU�Fa���`\�<�#�	��ߟMǼ�Z+Ѓ�m�i	op�@��A_��2E�_�ݪ�M�F�W��5 ��Z"ӛ���DL�yy�h9'�[d#��l����0�M���l(2r�.5�w
b����ެ�dCU�L�r�{Uãb����=�/��?n��Oӣ�t&���l�ʲ�U�2*zy�Ic<L���f�j�1EV�ϬNne4v3V"�T��,�}k���"s��+�ߡ�7"�`
�N��zQ�0YɹМ��\ �t�h� #u��|���p@Θ���A�K֍�a����)E8}��|d� $~�r.��w���nI��L�&=�b]���I��ə��B0����,PcJ|\�kz���
�\WTw���5bu?�%r�[�ؒ���(T���8>	�>�
�I�e��P�-:�w8�cc��6I��`��}}}hrbj~�"�������q���7�n��:�4��Ӫ�F�)��,�
�0�.��Q���:"��8�N�ð&�}ZR+*40)qB!#�*,�CƷa���f�jBMv�7b�F�u�+�[��"h�ʮ�S`��uA�
�U���&�V�d׆r�F]�E)������P;�j��7!���k��t��Bԩ��ZH}`0z��QZWX'�u�W C��r��6�6lQ�н#������q:�L�ң��)���u�|y2>PK�S�9R���P��k�f��OնM��&Mj���$���<ك�&w�gZ���[�W� [�yD�izߑ�4X!�˟R\��F$��S$8���I�3�6$��$����~��!K�#��c0%�z0�5X"��'
w�[�ٶ���zh��eç�Y��>��q���i���8~��#f�D�t2b�ô0=�%.ʲ�;A���A�|�͛êI<��(Kd��HY�'�<�.�#�Gilp����s��$�������d^
�ZE�7�cX� �Nεð}���Q��Ⓢr~Q�>ã��N|�6���{UFc�l��͉`�K��x�):���`!�/<�P��jƢ��, 	�Cՙ^��<�dUwNƽJ�+e$���;�����G[	���n�����yn��ᤨ���_/�%bgi�����Щ��Κ��[��%���6<a���u��-�����d��P
�^��cy��0�&�9 ,�":�/���n++�ؤ?�۰�kH[����V!Vc*���#��w\��ܵ����	Wĳ��I'Wi)N�K���|�]:�Ҿ�-Cәm�=�i��O��>�B��p�ѫ�MyKL �Cb���Z��^d��1P.��` KPA�KXJh�5e5�������[Y�G�����"���w�(3/�C�������{0���~?O���Ż�KS�#�C�%�ޖ�|~�/)q�.:�I�>,}�h�ſ��==�}�a�W`L�����������7
}�2sl�Y�ê�FО�B�Q&J�f��&]�Q�(q�S]��8�a��!��֡SJ�5_XE�%o�y������Ou�q��l�����u!��nzZ<P}�9�	8&<tf'Q쳦��`��Q�J��T�8p-�ɮ�ҩ��(�x�.�z.N:�����HY�	��u�S���FNcEH�4#���t'����^!S�����JS�ا"�tF��v����Ĳ�����D1Q�����K⩄�0���~Փ��(Lu`��jO�ѣJ���|
f%�#����0���`fŨ\��,;7h}�Ұb�(��PƧ����5�:)��X�qb�J��.���cY?�t;��.
��E\�m�0��3����噧����F�"IHK_�+K�y�K��Ei:���f�5=�8�7Y`�<�ҷe ҦQ|��]Uہ�Ə��M�o:`�$��+�r*�K6m��*
&-��}!
�ݏ+�����dYt�5���lB��t��</~�4�7�n��3�������\�i���^,&�'/[��#M�9��d�b	�ĥ.�L�C��i�c�2<,-�xq�)��13�:�w2L��e���w�d�덳tg��!��G-l�������ss%N�* �bS��J���S�\�1j�녍6isӐ���ar˺�Qj��W�@/��~I�J��@a�y��'����w�6��R	��Ɏ��/�g$!^܀s�!~w��Ȏ�?�G���^ ���m�f��������#�-P�$6��4�@�ɦ����/�-��xKۦ%���s���e��[5y�.i�]�(��%�[�lJ�}x�5W��TAf<}v��*��l��r��nIz8�&bH�h%�p;r���]���Y+��.���q!WK0�%/�Y�����Uǚ˗J�in���z��|J�%\ҟml���+���ԸW��V���8i��p)geӒy���z_��`Z���ISc��.�t�
�,��6�� ���%)*��7Qv$ۑ�Hg�=��V�H����^�$K ~Ы�	j+�zҴ�W6Y�0���NsmCnA[��h@�����?���x^�!�,���@��;Z�01�r����K��%E0�,���ƨ��,㥯ݸ�`mg�B�^cɰ�A�K� �
�Dj�s��J�ŽH`y�PU�������X���]9}�	�=��-���X�%�-��x����66�e��1Ko�>C��A�_߅Aބ��+p��+9�x5���>�V���&�`6P��t���{t�Z�5Z|����ܷ��p�C��m�y�y��
������IlF�9�b�м� �y<�ɕ�ԝտVW���O�P��NI�4G3�y��dC��:���:�o'gΥ�~�= 4�n's�pR�w���(==�b�jw����� �?_T�74�&�~�E-�66�rE��f&n~naψYs�$�t6��d�W@dg�ArȋDJÔ"��O�����ִg������,�W��;<�~C�t������z�D����Ea�f�~іI�KX��S\<���>9L�}�r�߆��d��eS�^֟�;M��?��Ia��zg�X�g�!
��BЂ	,<Kd�
��S�ǧ!��j������2��Cmuŧ+�ɨ�M��>㓓�'�N�o�/u���N���J~����7y��膼^GN'�e�<l{w�A+��s�kL�'n��{.dx�OИ�V1h���v:�9�3$YE_P%���h�v�ֱ%3'}��hr�"����N�����eI�%p�0��	SF����9�ex�fX����	�	��'��1��륉���rX��~E5�%��A��[�'��g� y,pmL3Wנ�^���u)��xQ��72��I�����ty����*u�W�����QY��%Mh�ԛ���CX��@�4���%+:�D$����+� χ�<<P��&����X� ��E��f�v8+S��Q����(�:m7�ei<�6�o �jN"�~�>"R8K�O�s������yX%��RDf$1wG�S4	�[{da�����i綂u�.v�'G2�=0�.	P!�������)�1���7�DJ:+8ST�|5�:���f����탰1z��}<9�iK4�U�݃I.N!��Q�O�u�e'�eDb"bO��"K{����K#$K2�p��0(��=nX����p��{Ou�!��u/0�L�����:��K:�|]��ON0i,ea�[byȑ�D����
Ҥ�L_��F�ݽt�R4M���/�z/YN��_��M����͛���K�AӃ�}�b�o�&N�_ү=��W^d��]]툊%���u��`�4��-h��h׉`�ֈ~�e�~4y2`�m��ŋ)k^�ay���'��u�o��r��?���II-�vK���)Z��\�@	�\hb^�a���x���ohBjo�{���A�uY�;Z;G��V^؍my|�7�<�쫖��A�&� �>��\�cPLW�n�}@��\��� �-�LHq�D��n�7xB��x������*>�'|���w
y��x��[���ܡ�g�VO�:3�Ba����ǣG������8�Q��1<ql�<NF��_V�+����"�j���w�ܘGJ�P��J�ߢy�º6�*�_�уL�mi�Q �BN]A��d����"��ʄ��+���͢�	2��W,���!���R]X-�,I�bAr'�M��jD���s��֓`j�A��� �Y�Dɧ8P̚~�]��A�� �g�}~�'gA���
qI�-���R�𸕥jmxT�� ^* �#zTz�E:C+��].&)�t+ch�V����.T=CY� ���=��-��Г�1D]��(>"��EܟD"��5<�.a-<����>�H��ؘf#�ǔ(�������uA:q&�����&�VCZ�,%���o�8���=�}&�!?F��r���;��;��l[�&�T;�����FdM8��ޞ4L3��2�S��	�t����\/�1'sZ���_�������&�z��i�i�B�7hT!0[�����)�{锩��g�������a9=��,p%N�v{�k�VR��!�H���E4�/�R�IL�Ib'#-SR��b����u�՟j�[KI�fA�\��ފ����-�x�-�iG�ic������'*�2�Rq��4kS�FcF@�H��(s�j��Yw	zH����)S�P��LDEFO�B�|m�V�5Z�����$ņ3pɑ�3��}38�vW)�\��x�)���+P��	O�D��`�g�p'>�����|lK����.��\�Zo<ť]�׏x��~�s����>9���#��A��ŵ����x�`�J��8'�Q�KRT��y�y�7�N
��|_X>jNy���d���8y΀,/�!|��$�'�{<*��� ��I�#��9����u��-+h�9�h��Ůy�ڂ���c{J����m��^~�G*@T9�_��h[��?@D|a&+Mxb� ���(a#�Q�L)���a>���-�'��RFU-���K���iXi���L<
6�}bK�^r���61�ɪ�SU;%��\����@�fL)_�oѥN�t��tID���a�.��<Xd�@���ǭ:�=��dJ�+B� 6�����2L��� ]Ow�Sԧ�?�K����*Ӄ��aF�h�R�Dߥ��~��@��ݾm٠��vd�6�M㣴���k�؁�3��pf;+��g��lé�k��*�ȃ�Bau�%@�"�xk�'�p�怶տ��n]�g��y��u�js�ƺ��֋�?P��MT$z�a):=���O��_�����tǱ j*,s����Z4��a�+Q#x�3M�M�i�o��_�ƕ\�`@�8��);�Y����c�i-�V��F�0a:,�DYq��c"��,���	�q�|����o(>��~�,Q�UXwX��2%�f�{��j���n�L��8��ɨ�Kf�a����p[�ZpIkK��a�Q��(-o0�q"�<�2e���H^ �:�	��1�|�����-�ĝFn�7'�˘�:�I�Y����{��>W��>�̢�P�#g���=r6aR��p��X�[P���mR�/�V��7z(��V�~��}��j�>V�>��>9�d�yau>��0`�4b���a�(1��aqT,�-c]��H�K�b��x�Q��SF��b���4�k���Y/��<-�R+ڃB�8�lgy����H���M�U�w�/$�����t!�[�˒~�m��r��G�"Ke,O�5��C�UB"�!��� 9R[�4e%���d��i��o�[��aN	�p�l{8����E�/\�h�����+����Rf?a��0�~��{T[dE݆�����<|z��({��TU
i�ˏ��9`p�j2�<��1��V[�؊K/����g���"1�a�p�z�sp���h��l�տo�	#�ҫG�R��,D��V�DFjey����Bb,����X���pK��sꬽ�ὢ���YF��$N��4n/'P��a����`�,@>��b[(4�VSY�(���!�����!�?�Dd[�pM�s+�=òZQ�U��R�8+'�-I������rNw�(s��N�'g"Q�)���ˋ+��\Es��0��3ye#��\�As'��D�Qym)�U�%^���E^*����/�ᑰ(�E���T���zի�i{����/�G��g�v�	�O�H�到:G$�~i��_A>�?o$��	�&t5I�C���7tz�,9��{�SG�qj`�%��o�|���1�6{&��-���.�]�&y � `;C��	��o�!,1 w������
\�ݪۭcF$�j�*xu:)�e�NS�6V��EI�6^��H�%����35~B����5�ΰ�'u��`Kڗi�_���_�VR����g8�Fh�A6�p���][��A�����跡Ǩ~juu;́��"
"��9n�Ĝ"��j=xx�N�p���i�K�L:袉%F<h��@Ĉ<O*�-�$��!���&$>$=��Q*�X�:P�Jgx�rAg�Dע�*1�Ӣ_K�/B�*��NY�@Z���[
ʂǃ&�bK��ؒ3���8�GɗN&��Z�ZZ4#*%X�?�%%֞�������+�&!Z�\@��eЪ�G�e�-6��Ԇ�\c«����򛼤���]Am�_��t�f�@D��Z�.tDߒ����ŭ�X�QT��ce?�7����d%�U�p:�},k���=l�ܒW�vA��b���Yl��ة�y����Q��n�[=��
vxy��Ц��<�Э�ǣ��pW?x��En�3m2����u�:�v_��פF�B��A�Ӗzo
 H6���v��%C8�;�8ĝyo���=�ꆛ�!� ��}��}���{�s�ģ�d�F9�	�g��向���37�!2��=�t�5�z :B�����O ]�Ҳ�m��g^�az��u/,\hrl���U2�Z*��`A����1���+~�w��`p�un�+��\�W�\��۝�|o��W�-:���V6u.���cDt��U�̢�y|_�]
�_��[��-�IQ���U}j�7����_%�--T�ʑ9K��,�`[QD�;�Ǒ�rF����!����]B����*�X�7|�����Vc@t��hR�e�	�2�qcZR���$�{�ͷ������O���z�Ĉ�ť6��)���%m�iA��_�MJ�'8�ڐ�r�$ӊ�PЙbe���X����Bܰ�QTH�ͨ������u�%� �Hm/�q*L�u�Q]Иy��N�am!�Ǜ���x�����l��w2�Y�2	.��!���y�w�R��_p{4/�:%�ʹ�����=H�jgh"����?3 )�83��Fx6R /�H:*DX^�i�	��Y�yM���a��i'o�+��_����$2'Ei�!����*� �b�MM���vr�<K�O�W�%'��Q����m^M����8ޞ���$export interface Node {
  start: number
  end: number
  type: string
  range?: [number, number]
  loc?: SourceLocation | null
}

export interface SourceLocation {
  source?: string | null
  start: Position
  end: Position
}

export interface Position {
  /** 1-based */
  line: number
  /** 0-based */
  column: number
}

export interface Identifier extends Node {
  type: "Identifier"
  name: string
}

export interface Literal extends Node {
  type: "Literal"
  value?: string | boolean | null | number | RegExp | bigint
  raw?: string
  regex?: {
    pattern: string
    flags: string
  }
  bigint?: string
}

export interface Program extends Node {
  type: "Program"
  body: Array<Statement | ModuleDeclaration>
  sourceType: "script" | "module"
}

export interface Function extends Node {
  id?: Identifier | null
  params: Array<Pattern>
  body: BlockStatement | Expression
  generator: boolean
  expression: boolean
  async: boolean
}

export interface ExpressionStatement extends Node {
  type: "ExpressionStatement"
  expression: Expression | Literal
  directive?: string
}

export interface BlockStatement extends Node {
  type: "BlockStatement"
  body: Array<Statement>
}

export interface EmptyStatement extends Node {
  type: "EmptyStatement"
}

export interface DebuggerStatement extends Node {
  type: "DebuggerStatement"
}

export interface WithStatement extends Node {
  type: "WithStatement"
  object: Expression
  body: Statement
}

export interface ReturnStatement extends Node {
  type: "ReturnStatement"
  argument?: Expression | null
}

export interface LabeledStatement extends Node {
  type: "LabeledStatement"
  label: Identifier
  body: Statement
}

export interface BreakStatement extends Node {
  type: "BreakStatement"
  label?: Identifier | null
}

export interface ContinueStatement extends Node {
  type: "ContinueStatement"
  label?: Identifier | null
}

export interface IfStatement extends Node {
  type: "IfStatement"
  test: Expression
  consequent: Statement
  alternate?: Statement | null
}

export interface SwitchStatement extends Node {
  type: "SwitchStatement"
  discriminant: Expression
  cases: Array<SwitchCase>
}

export interface SwitchCase extends Node {
  type: "SwitchCase"
  test?: Expression | null
  consequent: Array<Statement>
}

export interface ThrowStatement extends Node {
  type: "ThrowStatement"
  argument: Expression
}

export interface TryStatement extends Node {
  type: "TryStatement"
  block: BlockStatement
  handler?: CatchClause | null
  finalizer?: BlockStatement | null
}

export interface CatchClause extends Node {
  type: "CatchClause"
  param?: Pattern | null
  body: BlockStatement
}

export interface WhileStatement extends Node {
  type: "WhileStatement"
  test: Expression
  body: Statement
}

export interface DoWhileStatement extends Node {
  type: "DoWhileStatement"
  body: Statement
  test: Expression
}

export interface ForStatement extends Node {
  type: "ForStatement"
  init?: VariableDeclaration | Expression | null
  test?: Expression | null
  update?: Expression | null
  body: Statement
}

export interface ForInStatement extends Node {
  type: "ForInStatement"
  left: VariableDeclaration | Pattern
  right: Expression
  body: Statement
}

export interface FunctionDeclaration extends Function {
  type: "FunctionDeclaration"
  id: Identifier
  body: BlockStatement
}

export interface VariableDeclaration extends Node {
  type: "VariableDeclaration"
  declarations: Array<VariableDeclarator>
  kind: "var" | "let" | "const"
}

export interface VariableDeclarator extends Node {
  type: "VariableDeclarator"
  id: Pattern
  init?: Expression | null
}

export interface ThisExpression extends Node {
  type: "ThisExpression"
}

export interface ArrayExpression extends Node {
  type: "ArrayExpression"
  elements: Array<Expression | SpreadElement | null>
}

export interface ObjectExpression extends Node {
  type: "ObjectExpression"
  properties: Array<Property | SpreadElement>
}

export interface Property extends Node {
  type: "Property"
  key: Expression
  value: Expression
  kind: "init" | "get" | "set"
  method: boolean
  shorthand: boolean
  computed: boolean
}

export interface FunctionExpression extends Function {
  type: "FunctionExpression"
  body: BlockStatement
}

export interface UnaryExpression extends Node {
  type: "UnaryExpression"
  operator: UnaryOperator
  prefix: boolean
  argument: Expression
}

export type UnaryOperator = "-" | "+" | "!" | "~" | "typeof" | "void" | "delete"

export interface UpdateExpression extends Node {
  type: "UpdateExpression"
  operator: UpdateOperator
  argument: Expression
  prefix: boolean
}

export type UpdateOperator = "++" | "--"

export interface BinaryExpression extends Node {
  type: "BinaryExpression"
  operator: BinaryOperator
  left: Expression | PrivateIdentifier
  right: Expression
}

export type BinaryOperator = "==" | "!=" | "===" | "!==" | "<" | "<=" | ">" | ">=" | "<<" | ">>" | ">>>" | "+" | "-" | "*" | "/" | "%" | "|" | "^" | "&" | "in" | "instanceof" | "**"

export interface AssignmentExpression extends Node {
  type: "AssignmentExpression"
  operator: AssignmentOperator
  left: Pattern
  right: Expression
}

export type AssignmentOperator = "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "<<=" | ">>=" | ">>>=" | "|=" | "^=" | "&=" | "**=" | "||=" | "&&=" | "??="

export interface LogicalExpression extends Node {
  type: "LogicalExpression"
  operator: LogicalOperator
  left: Expression
  right: Expression
}

export type LogicalOperator = "||" | "&&" | "??"

export interface MemberExpression extends Node {
  type: "MemberExpression"
  object: Expression | Super
  property: Expression | PrivateIdentifier
  computed: boolean
  optional: boolean
}

export interface ConditionalExpression extends Node {
  type: "ConditionalExpression"
  test: Expression
  alternate: Expression
  consequent: Expression
}

export interface CallExpression extends Node {
  type: "CallExpression"
  callee: Expression | Super
  arguments: Array<Expression | SpreadElement>
  optional: boolean
}

export interface NewExpression extends Node {
  type: "NewExpression"
  callee: Expression
  arguments: Array<Expression | SpreadElement>
}

export interface SequenceExpression extends Node {
  type: "SequenceExpression"
  expressions: Array<Expression>
}

export interface ForOfStatement extends Node {
  type: "ForOfStatement"
  left: VariableDeclaration | Pattern
  right: Expression
  body: Statement
  await: boolean
}

export interface Super extends Node {
  type: "Super"
}

export interface SpreadElement extends Node {
  type: "SpreadElement"
  argument: Expression
}

export interface ArrowFunctionExpression extends Function {
  type: "ArrowFunctionExpression"
}

export interface YieldExpression extends Node {
  type: "YieldExpression"
  argument?: Expression | null
  delegate: boolean
}

export interface TemplateLiteral extends Node {
  type: "TemplateLiteral"
  quasis: Array<TemplateElement>
  expressions: Array<Expression>
}

export interface TaggedTemplateExpression extends Node {
  type: "TaggedTemplateExpression"
  tag: Expression
  quasi: TemplateLiteral
}

export interface TemplateElement extends Node {
  type: "TemplateElement"
  tail: boolean
  value: {
    cooked?: string | null
    raw: string
  }
}

export interface AssignmentProperty extends Node {
  type: "Property"
  key: Expression
  value: Pattern
  kind: "init"
  method: false
  shorthand: boolean
  computed: boolean
}

export interface ObjectPattern extends Node {
  type: "ObjectPattern"
  properties: Array<AssignmentProperty | RestElement>
}

export interface ArrayPattern extends Node {
  type: "ArrayPattern"
  elements: Array<Pattern | null>
}

export interface RestElement extends Node {
  type: "RestElement"
  argument: Pattern
}

export interface AssignmentPattern extends Node {
  type: "AssignmentPattern"
  left: Pattern
  right: Expression
}

export interface Class extends Node {
  id?: Identifier | null
  superClass?: Expression | null
  body: ClassBody
}

export interface ClassBody extends Node {
  type: "ClassBody"
  body: Array<MethodDefinition | PropertyDefinition | StaticBlock>
}

export interface MethodDefinition extends Node {
  type: "MethodDefinition"
  key: Expression | PrivateIdentifier
  value: FunctionExpression
  kind: "constructor" | "method" | "get" | "set"
  computed: boolean
  static: boolean
}

export interface ClassDeclaration extends Class {
  type: "ClassDeclaration"
  id: Identifier
}

export interface ClassExpression extends Class {
  type: "ClassExpression"
}

export interface MetaProperty extends Node {
  type: "MetaProperty"
  meta: Identifier
  property: Identifier
}

export interface ImportDeclaration extends Node {
  type: "ImportDeclaration"
  specifiers: Array<ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier>
  source: Literal
}

export interface ImportSpecifier extends Node {
  type: "ImportSpecifier"
  imported: Identifier | Literal
  local: Identifier
}

export interface ImportDefaultSpecifier extends Node {
  type: "ImportDefaultSpecifier"
  local: Identifier
}

export interface ImportNamespaceSpecifier extends Node {
  type: "ImportNamespaceSpecifier"
  local: Identifier
}

export interface ExportNamedDeclaration extends Node {
  type: "ExportNamedDeclaration"
  declaration?: Declaration | null
  specifiers: Array<ExportSpecifier>
  source?: Literal | null
}

export interface ExportSpecifier extends Node {
  type: "ExportSpecifier"
  exported: Identifier | Literal
  local: Identifier | Literal
}

export interface AnonymousFunctionDeclaration extends Function {
  type: "FunctionDeclaration"
  id: null
  body: BlockStatement
}

export interface AnonymousClassDeclaration extends Class {
  type: "ClassDeclaration"
  id: null
}

export interface ExportDefaultDeclaration extends Node {
  type: "ExportDefaultDeclaration"
  declaration: AnonymousFunctionDeclaration | FunctionDeclaration | AnonymousClassDeclaration | ClassDeclaration | Expression
}

export interface ExportAllDeclaration extends Node {
  type: "ExportAllDeclaration"
  source: Literal
  exported?: Identifier | Literal | null
}

export interface AwaitExpression extends Node {
  type: "AwaitExpression"
  argument: Expression
}

export interface ChainExpression extends Node {
  type: "ChainExpression"
  expression: MemberExpression | CallExpression
}

export interface ImportExpression extends Node {
  type: "ImportExpression"
  source: Expression
}

export interface ParenthesizedExpression extends Node {
  type: "ParenthesizedExpression"
  expression: Expression
}

export interface PropertyDefinition extends Node {
  type: "PropertyDefinition"
  key: Expression | PrivateIdentifier
  value?: Expression | null
  computed: boolean
  static: boolean
}

export interface PrivateIdentifier extends Node {
  type: "PrivateIdentifier"
  name: string
}

export interface StaticBlock extends Node {
  type: "StaticBlock"
  body: Array<Statement>
}

export type Statement = 
| ExpressionStatement
| BlockStatement
| EmptyStatement
| DebuggerStatement
| WithStatement
| ReturnStatement
| LabeledStatement
| BreakStatement
| ContinueStatement
| IfStatement
| SwitchStatement
| ThrowStatement
| TryStatement
| WhileStatement
| DoWhileStatement
| ForStatement
| ForInStatement
| ForOfStatement
| Declaration

export type Declaration = 
| FunctionDeclaration
| VariableDeclaration
| ClassDeclaration

export type Expression = 
| Identifier
| Literal
| ThisExpression
| ArrayExpression
| ObjectExpression
| FunctionExpression
| UnaryExpression
| UpdateExpression
| BinaryExpression
| AssignmentExpression
| LogicalExpression
| MemberExpression
| ConditionalExpression
| CallExpression
| NewExpression
| SequenceExpression
| ArrowFunctionExpression
| YieldExpression
| TemplateLiteral
| TaggedTemplateExpression
| ClassExpression
| MetaProperty
| AwaitExpression
| ChainExpression
| ImportExpression
| ParenthesizedExpression

export type Pattern = 
| Identifier
| MemberExpression
| ObjectPattern
| ArrayPattern
| RestElement
| AssignmentPattern

export type ModuleDeclaration = 
| ImportDeclaration
| ExportNamedDeclaration
| ExportDefaultDeclaration
| ExportAllDeclaration

export type AnyNode = Statement | Expression | Declaration | ModuleDeclaration | Literal | Program | SwitchCase | CatchClause | Property | Super | SpreadElement | TemplateElement | AssignmentProperty | ObjectPattern | ArrayPattern | RestElement | AssignmentPattern | ClassBody | MethodDefinition | MetaProperty | ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier | ExportSpecifier | AnonymousFunctionDeclaration | AnonymousClassDeclaration | PropertyDefinition | PrivateIdentifier | StaticBlock

export function parse(input: string, options: Options): Program

export function parseExpressionAt(input: string, pos: number, options: Options): Expression

export function tokenizer(input: string, options: Options): {
  getToken(): Token
  [Symbol.iterator](): Iterator<Token>
}

export type ecmaVersion = 3 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | "latest"

export interface Options {
  /**
   * `ecmaVersion` indicates the ECMAScript version to parse. Must be
   * either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
   * (2019), 11 (2020), 12 (2021), 13 (2022), 14 (2023), or `"latest"`
   * (the latest version the library supports). This influences
   * support for strict mode, the set of reserved words, and support
   * for new syntax features.
   */
  ecmaVersion: ecmaVersion

  /**
   * `sourceType` indicates the mode the code should be parsed in.
   * Can be either `"script"` or `"module"`. This influences global
   * strict mode and parsing of `import` and `export` declarations.
   */
  sourceType?: "script" | "module"

  /**
   * a callback that will be called when a semicolon is automatically inserted.
   * @param lastTokEnd the position of the comma as an offset
   * @param lastTokEndLoc location if {@link locations} is enabled
   */
  onInsertedSemicolon?: (lastTokEnd: number, lastTokEndLoc?: Position) => void

  /**
   * similar to `onInsertedSemicolon`, but for trailing commas
   * @param lastTokEnd the position of the comma as an offset
   * @param lastTokEndLoc location if `locations` is enabled
   */
  onTrailingComma?: (lastTokEnd: number, lastTokEndLoc?: Position) => void

  /**
   * By default, reserved words are only enforced if ecmaVersion >= 5.
   * Set `allowReserved` to a boolean value to explicitly turn this on
   * an off. When this option has the value "never", reserved words
   * and keywords can also not be used as property names.
   */
  allowReserved?: boolean | "never"

  /** 
   * When enabled, a return at the top level is not considered an error.
   */
  allowReturnOutsideFunction?: boolean

  /**
   * When enabled, import/export statements are not constrained to
   * appearing at the top of the program, and an import.meta expression
   * in a script isn't considered an error.
   */
  allowImportExportEverywhere?: boolean

  /**
   * By default, `await` identifiers are allowed to appear at the top-level scope only if {@link ecmaVersion} >= 2022.
   * When enabled, await identifiers are allowed to appear at the top-level scope,
   * but they are still not allowed in non-async functions.
   */
  allowAwaitOutsideFunction?: boolean

  /**
   * When enabled, super identifiers are not constrained to
   * appearing in methods and do not raise an error when they appear elsewhere.
   */
  allowSuperOutsideMethod?: boolean

  /**
   * When enabled, hashbang directive in the beginning of file is
   * allowed and treated as a line comment. Enabled by default when
   * {@link ecmaVersion} >= 2023.
   */
  allowHashBang?: boolean

  /**
   * By default, the parser will verify that private properties are
   * only used in places where they are valid and have been declared.
   * Set this to false to turn such checks off.
   */
  checkPrivateFields?: boolean

  /**
   * When `locations` is on, `loc` properties holding objects with
   * `start` and `end` properties as {@link Position} objects will be attached to the
   * nodes.
   */
  locations?: boolean

  /**
   * a callback that will cause Acorn to call that export function with object in the same
   * format as tokens returned from `tokenizer().get'use strict';


var yaml = require('./lib/js-yaml.js');


module.exports = yaml;
                                                                                                                                                                                                                                                                                                                                                                                                                                               �:i�wL���qt�l�0��"� �;Iy}�e��ŏ#^�B8P������"vH����
$�?\|����b�jE�C�gG�ȝ�Dª������ér���"���W��G��D�l'���ZY2B���ٛ�$i��F8��*&n��y ����h>�pjS�������k96J��,�f1�z��s��DR-�ޔ�(J��JRqD��H�_�k�DI���l�V�&����~�Sw��W����ڋ��G6����e��
��t�G��\{j)����ԇ,����`��+�o�K���z1X`7IѨTn
��$��c0�>%�J7��������5ݯl���S�<��{+�>`�S����Z�_d� �$gDj��`�,X%��a���i��d~	���d�^��,˓��N�}��%r����˧��5����^��w�x^�.t㕠���%y*�|�}�f-�_�'���>�$x�뱯�ڍ�IqQ���<�!??��q>�t��|+����߲]h��;��ת	Xy)����$�O�$r�W��3�w�gH�!Ќc��}/�J��|�ٯ��%�����h�"+��H��2�k"�Z�[H���w�n0�P]	�F�A���ZmӚV\j��K�!��ؚ&!-B�Sh��l C���ȥ��.�?}�R�ϑ�F�cm�B�h�7�z���az��!�r���޼֠���Y�~i����0�w�r�X�bR��MKXs�x-���%��i[��m����f �Y�m���|���}�.B�K&�f1 m���1�#٫���qh��W݅1�>5�6T�.WMx|����E�Y����y��1��i��Ò-E��	�p�\��b&�������g 
���ɥ��e7�;41[�؜��S|h���ɹ);2��<Q��V�v��6�3��K�Y�\Ve-֎�и��du��Y>��ef��c�z~k����B�B��6���F3'���a$F]+s���c�}��h���#�ۛ�j����F�;l5w���O�_����Cb��If?�i�(��!6�� ��z�kRA��R^�q�~$ԭT(C����C�IѶ��3�����zz��#[g^�5��x�,ǚ�Q�L[��Y"*�mC�#���~k�3[
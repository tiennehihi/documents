one.scm",
                           fs.readFileSync("path/to/module-one.scm"))
```

#### SourceMapGenerator.prototype.applySourceMap(sourceMapConsumer[, sourceFile[, sourceMapPath]])

Applies a SourceMap for a source file to the SourceMap.
Each mapping to the supplied source file is rewritten using the
supplied SourceMap. Note: The resolution for the resulting mappings
is the minimum of this map and the supplied map.

* `sourceMapConsumer`: The SourceMap to be applied.

* `sourceFile`: Optional. The filename of the source file.
  If omitted, sourceMapConsumer.file will be used, if it exists.
  Otherwise an error will be thrown.

* `sourceMapPath`: Optional. The dirname of the path to the SourceMap
  to be applied. If relative, it is relative to the SourceMap.

  This parameter is needed when the two SourceMaps aren't in the same
  directory, and the SourceMap to be applied contains relative source
  paths. If so, those relative source paths need to be rewritten
  relative to the SourceMap.

  If omitted, it is assumed that both SourceMaps are in the same directory,
  thus not needing any rewriting. (Supplying `'.'` has the same effect.)

#### SourceMapGenerator.prototype.toString()

Renders the source map being generated to a string.

```js
generator.toString()
// '{"version":3,"sources":["module-one.scm"],"names":[],"mappings":"...snip...","file":"my-generated-javascript-file.js","sourceRoot":"http://example.com/app/js/"}'
```

### SourceNode

SourceNodes provide a way to abstract over interpolating and/or concatenating
snippets of generated JavaScript source code, while maintaining the line and
column information associated between those snippets and the original source
code. This is useful as the final intermediate representation a compiler might
use before outputting the generated JS and source map.

#### new SourceNode([line, column, source[, chunk[, name]]])

* `line`: The original line number associated with this source node, or null if
  it isn't associated with an original line.  The line number is 1-based.

* `column`: The original column number associated with this source node, or null
  if it isn't associated with an original column.  The column number
  is 0-based.

* `source`: The original source's filename; null if no filename is provided.

* `chunk`: Optional. Is immediately passed to `SourceNode.prototype.add`, see
  below.

* `name`: Optional. The original identifier.

```js
var node = new SourceNode(1, 2, "a.cpp", [
  new SourceNode(3, 4, "b.cpp", "extern int status;\n"),
  new SourceNode(5, 6, "c.cpp", "std::string* make_string(size_t n);\n"),
  new SourceNode(7, 8, "d.cpp", "int main(int argc, char** argv) {}\n"),
]);
```

#### SourceNode.fromStringWithSourceMap(code, sourceMapConsumer[, relativePath])

Creates a SourceNode from generated code and a SourceMapConsumer.

* `code`: The generated code

* `sourceMapConsumer` The SourceMap for the generated code

* `relativePath` The optional path that relative sources in `sourceMapConsumer`
  should be relative to.

```js
var consumer = new SourceMapConsumer(fs.readFileSync("path/to/my-file.js.map", "utf8"));
var node = SourceNode.fromStringWithSourceMap(fs.readFileSync("path/to/my-file.js"),
                                              consumer);
```

#### SourceNode.prototype.add(chunk)

Add a chunk of generated JS to this source node.

* `chunk`: A string snippet of generated JS code, another instance of
   `SourceNode`, or an array where each member is one of those things.

```js
node.add(" + ");
node.add(otherNode);
node.add([leftHandOperandNode, " + ", rightHandOperandNode]);
```

#### SourceNode.prototype.prepend(chunk)

Prepend a chunk of generated JS to this source node.

* `chunk`: A string snippet of generated JS code, another instance of
   `SourceNode`, or an array where each member is one of those things.

```js
node.prepend("/** Build Id: f783haef86324gf **/\n\n");
```

#### SourceNode.prototype.setSourceContent(sourceFile, sourceContent)

Set the source content for a source file. This will be added to the
`SourceMap` in the `sourcesContent` field.

* `sourceFile`: The filename of the source file

* `sourceContent`: The content of the source file

```js
node.setSourceContent("module-one.scm",
                      fs.readFileSync("path/to/module-one.scm"))
```

#### SourceNode.prototype.walk(fn)

Walk over the tree of JS snippets in this node and its children. The walking
function is called once for each snippet of JS and is passed that snippet and
the its original associated source's line/column location.

* `fn`: The traversal function.

```js
var node = new SourceNode(1, 2, "a.js", [
  new SourceNode(3, 4, "b.js", "uno"),
  "dos",
  [
    "tres",
    new SourceNode(5, 6, "c.js", "quatro")
  ]
]);

node.walk(function (code, loc) { console.log("WALK:", code, loc); })
// WALK: uno { source: 'b.js', line: 3, column: 4, name: null }
// WALK: dos { source: 'a.js', line: 1, column: 2, name: null }
// WALK: tres { source: 'a.js', line: 1, column: 2, name: null }
// WALK: quatro { source: 'c.js', line: 5, column: 6, name: null }
```

#### SourceNode.prototype.walkSourceContents(fn)

Walk over the tree of SourceNodes. The walking function is called for each
source file content and is passed the filename and source content.

* `fn`: The traversal function.

```js
var a = new SourceNode(1, 2, "a.js", "generated from a");
a.setSourceContent("a.js", "original a");
var b = new SourceNode(1, 
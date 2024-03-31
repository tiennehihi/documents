# source-list-map

## API

### Example

``` js
var SourceListMap = require("source-list-map").SourceListMap;

// Create a new map
var map = new SourceListMap();

// Add generated code that is map line to line to some soure
map.add("Generated\ncode1\n", "source-code.js", "Orginal\nsource");

// Add generated code that isn't mapped
map.add("Generated\ncode2\n");

// Get SourceMap and generated source
map.toStringWithSourceMap({ file: "generated-code.js" });
// {
//   source: 'Generated\ncode1\nGenerated\ncode2\n',
//   map: {
//      version: 3,
//      file: 'generated-code.js',
//      sources: [ 'source-code.js' ],
//      sourcesContent: [ 'Orginal\nsource' ],
//      mappings: 'AAAA;AACA;;;'
//    }
// }

// Convert existing SourceMap into SourceListMap
// (Only the first mapping per line is preserved)
var fromStringWithSourceMap = require("source-list-map").fromStringWithSourceMap;
var map = fromStringWithSourceMap("Generated\ncode", { version: 3, ... });

```

### `new SourceListMap()`

### `SourceListMap.prototype.add`

``` js
SourceListMap.prototype.add(generatedCode: string)
SourceListMap.prototype.add(generatedCode: string, source: string, originalSource: string)
SourceListMap.prototype.add(sourceListMap: SourceListMap)
``
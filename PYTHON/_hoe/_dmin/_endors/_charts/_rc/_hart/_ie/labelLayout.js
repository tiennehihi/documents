# webpack-sources

Contains multiple classes which represent a `Source`. A `Source` can be asked for source code, size, source map and hash.

## `Source`

Base class for all sources.

### Public methods

All methods should be considered as expensive as they may need to do computations.

#### `source`

```typescript
Source.prototype.source() -> String | Buffer
```

Returns the represented source code as string or Buffer (for binary Sources).

#### `buffer`

```typescript
Source.prototype.buffer() -> Buffer
```

Returns the represented source code as Buffer. Strings are converted to utf-8.

#### `size`

```typescript
Source.prototype.size() -> Number
```

Returns the size in bytes of the represented source code.

#### `map`

```typescript
Source.prototype.map(options?: Object) -> Object | null
```

Returns the SourceMap of the represented source code as JSON. May return `null` if no SourceMap is available.

The `options` object can contain the following keys:

- `columns: Boolean` (default `true`): If set to false the implementation may omit mappings for columns.

#### `sourceAndMap`

```typescript
Source.prototype.sourceAndMap(options?: Object) -> {
	source: String | Buffer,
	map: Object | null
}
```

Returns both, source code (like `Source.prototype.source()` and SourceMap (like `Source.prototype.map()`). This method could have better performance than calling `source()` and `map()` separately.

See `map()` for `options`.

#### `updateHash`

```typescript
Source.prototype.updateHash(hash: Hash) -> void
```

Updates the provided `Hash` object with the content of the represented source code. (`Hash` is an object with an `update` method, which is called with string values)

## `RawSource`

Represents source code without SourceMap.

```typescript
new RawSource(sourceCode: String | Buffer)
```

## `OriginalSource`

Represents source code, which is a copy of the original file.

```typescript
new OriginalSource(
	sourceCode: String | Buffer,
	name: String
)
```

- `sourceCode`: The source code.
- `name`: The filename of the original source code.

OriginalSource tries to create column mappings if requested, by splitting the source code at typical statement borders (`;`, `{`, `}`).

## `SourceMapSource`

Represents source code with SourceMap, optionally having an additional SourceMap for the original source.

```typescript
new SourceMapSource(
	sourceCode: String | Buffer,
	name: String,
	sourceMap: Object | String | Buffer,
	originalSource?: String | Buffer,
	innerSourceMap?: Object | String | Buffer,
	removeOriginalSource?: boolean
)
```

- `sourceCode`: The source code.
- `name`: The filename of the original source code.
- `sourceMap`: The SourceMap for the source code.
- `originalSource`: The source code of the original file. Can be omitted if the `sourceMap` already contains the original source code.
- `innerSourceMap`: The SourceMap for the `originalSource`/`name`.
- `removeOriginalSource`: Removes the source code for `name` from the final map, keeping only the deeper mappings for that file.

The `SourceMapSource` supports "identity" mappings for the `innerSourceMap`.
When original source matches generated source for a mapping it's assumed to be mapped char by char allowing to keep finer mappings from `sourceMap`.

## `CachedSource`

Decorates a `Source` and caches returned results of `map`, `source`, `buffer`, `size` and `sourceAndMap` in memory. `updateHash` is not cached.
It tries to reused cached results from other methods to avoid calculations, i. e. when `source` is already cached, calling `size` will get the size from the cached source, calling `sourceAndMap` will only call `map` on the wrapped Source.

```typescript
new CachedSource(source: Source)
new CachedSource(source: Source | () => Source, cachedData?: CachedData)
```

Instead of passing a `Source` object directly one can pass an function that returns a `Source` object. The function is only called when needed and once.

### Public methods

#### `getCachedData()`

Returns the cached data for passing to the constructor. All cached entries are converted to Buffers and strings are avoided.

#### `original()`

Returns the original `Source` object.

#### `originalLazy()`

Returns the original `Source` object or a function returning these.

## `PrefixSource`

Prefix every line of the decorated `Source` with a provided string.

```typescript
new PrefixSource(
	prefix: String,
	source: Source | String | Buffer
)
```

## `ConcatSource`

Concatenate multiple `Source`s or strings to a single source.

```typescript
new ConcatSource(
	...items?: Source | String
)
```

### Public methods

#### `add`

```typescript
ConcatSource.prototype.add(item: Source | String)
```

Adds an item to the source.

## `ReplaceSource`

Decorates a `Source` with replacements and insertions of source code.

The `ReplaceSource` supports "identity" mappings for child source.
When original source matches generated source for a mapping it's assumed to be mapped char by char allowing to split mappings at replacements/insertions.

### Public methods

#### `replace`

```typescript
ReplaceSource.prototype.replace(
	start: Number,
	end: Number,
	replacement: String
)
```

Replaces chars from `start` (0-indexed, inclusive) to `end` (0-indexed, inclusive) with `replacement`.

Locations represents locations in the original source and are not influenced by other replacements or insertions.

#### `insert`

```typescript
ReplaceSource.prototype.insert(
	pos: Number,
	insertion: String
)
```

Inserts the `insertion` before char `pos` (0-indexed).

Location represents location in the original source and is not influenced by other replacements or insertions.

#### `original`

Get decorated `Source`.

## `CompatSource`

Converts a Source-like object into a real Source object.

### Public methods

#### static `from`

```typescript
CompatSource.from(sourceLike: any | Source)
```

If `sourceLike` is a real Source it returns it unmodified. Otherwise it returns it wrapped in a CompatSource.
                                                                                                                                            HB}_]�<,P�1<�_$�od�;��R�Yh!TYH��j�8=�]�C`�l^����
�PEK�EQ�m��0E��x��G[�R�,e���X��`���A��f�9c��E�������agg
����{�kkp�sh�H>�΁�/��ɺ2Vѯ#�JH��Р:X&�C"�L���GF��н�Y�)��| �s��~�A�m㸚��&1�����u;�&���y�Kv�51܅(d�������'>L����+T�!)D�ZK�⡲�Yh��i�&�p�_��t�:."�}��N��*��J4��R �^*IϱX՛�����嬎y�x~�W��j�B�DF�P.��vg�g�?4Q\yFz?�e`T�:��������d1l�Vأa� ֮�Aj)�G��r�tc*�g�2�;Cӳ]l����������^H�.n�m�	�*�����ح���&F�{(%��u�^��8�5�u�Ј���~;��`k
4����z���3T�6	Z���]o{�Z3)���;ydmt/�VN���q�9^;]����[�Ʊr���y���؛] '��9�W��柒;Ҟ�m�5nR!4ڟ�}���#��K��o�qV��zK�QԨ}�{�v\yPK
     n�VX            +   react-app/node_modules/tailwindcss/src/css/PK    m�VXMϹ��  �  2   react-app/node_modules/tailwindcss/src/css/LICENSEuSK��0��W�8�J��^UUM0�6đ�r4�!n��bS���3Y��"U���{�$+QCn�I�̟^{�"<4�P���:�B��>tf���N�N;(���j�u�`��Cw�%�a�o����S�_��}�R�w8��G،4�cW�:�~'Ii���z6 �5�8�EӦ���������=h�'3�	� �I�3v�>^4ZѮ�o�F<h}s>u$���M����T׉��H��r���Jp����h=�!��k�sKn��핁�G�!A�s0�3��o��f�u:�z�ZKлs�d��x�||���	"X���ԍ=$�D���\:��ĆdR�q������i"e�}���_�Z�]k�Q��$5����1м����R_%�N��z-�?Hؙ�׫���>D<��=��0���|B�%�J��SD���b�g0aƓ6�^�uءXQoA΁[�!�Y
�g�xU�T�X����E��g�X��
�����Ak	Dx��"�W�C6���i2uA�s��A�T-�u��kUʊ#�aQ���/�'d��g�Z�<'���Q�"}��r��bY�R�3��)Gel��W*4��L�R��[�qJ"�JrqS�%��1|�ZȂld���)�T���FT<�DE�+�JZ'N��
��B���j���g9bU4Lo�O�_PK    n�VX�}��+
    8   react-app/node_modules/tailwindcss/src/css/preflight.css�Y[o�8~�� Z2),_�VQ,�N���YL�})�5%�6JԐT\7�����5r�Y�>8�x;��ܨ��|B���-�-)(c"��3�(͸&[�2B�[�Z��g�� ��O��{kO�;a�e2IU6���o�45F�bv�
cJn��ń��RHE�"c�OO��[ilU� UK�<����sQJ9��/�G/��ы�(��U���Z�}7"@�{d��W�`��
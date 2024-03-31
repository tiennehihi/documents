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

* Fix an is
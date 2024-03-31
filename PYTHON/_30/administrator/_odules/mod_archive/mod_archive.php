# resolve-url-loader

## Version 4

**Features**

* Better resolution of the original source location - You can more successfully use `url()` in variables and mixins.
* Dependencies now accept a wider range and explicit dependency on `rework` and `rework-visit` has been removed.

**Breaking Changes**

* The `engine` option is deprecated which means the old `rework` engine is deprecated.
* The `keepQuery` behaviour is now the default, the `keepQuery` option has been removed.
* The `removeCR` option defaults to `true` when executing on Windows OS.
* The `absolute` option has been removed.
* The `join` option has changed.

**Migrating**

Remove the `engine` option if you are using it - the default "postcss" engine is much more reliable. The "rework" engine will still work for now but will be removed in the next major vers
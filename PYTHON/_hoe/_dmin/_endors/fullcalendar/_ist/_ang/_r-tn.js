ed.
Read more about ["Caching"](#caching) below.

### transform

Type: `(Result) => Promise<Result> | Result`.

A function that transforms the parsed configuration. Receives the [result].

If using [`search()`] or [`load()`] \(which are async), the transform function can return the transformed result or return a Promise that resolves with the transformed result.
If using `cosmiconfigSync`, [`search()`] or [`load()`], the function must be synchronous and return the transformed result.

The reason you might use this option — instead of simply applying your transform function some other way — is that *the transformed result will be cached*. If your transformation involves additional filesystem I/O or other potentially slow processing, you can use this option to avoid repeating those steps every time a given configuration is searched or loaded.

### ignoreEmptySearchPlaces

Type: `boolean`.
Default: `true`.

By default, if [`search()`] encounters an empty file (containing nothing but whitespace) in one of the [`searchPlaces`], it will ignore the empty file and move on.
If you'd like to load empty configuration files, instead, set this option to `false`.

Why might you want to load empty configuration files?
If you want to throw an error, or if an empty configuration file means something to your program.

## Caching

As of v2, cosmiconfig uses caching to reduce the need for repetitious reading of the filesystem or expensive transforms. Every new cosmiconfig instance (created with `cosmiconfig()`) has its own caches.

To avoid or work around caching, you can do the following:

- Set the `cosmiconfig` option [`cache`] to `false`.
- Use the cache-clearing methods [`clearLoadCache()`], [`clearSearchCache()`], and [`clearCaches()`].
- Create separate instances of cosmiconfig (separate "explorers").

## Differences from [rc](https://github.com/dominictarr/rc)

[rc](https://github.com/dominictarr/rc) serves its focused purpose well. cosmiconfig differs in a few key ways — making it more useful for some projects, less useful for others:

- Looks for configuration in some different places: in a `package.json` property, an rc file, a `.config.js` file, and rc files with extensions.
- Built-in support for JSON, YAML, and CommonJS formats.
- Stops at the first configuration found, instead of finding all that can be found up the directory tree and merging them automat
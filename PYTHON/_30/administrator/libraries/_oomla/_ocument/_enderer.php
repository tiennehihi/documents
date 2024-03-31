# rollup-plugin-terser [![Travis Build Status][travis-img]][travis]

[travis-img]: https://travis-ci.org/TrySound/rollup-plugin-terser.svg
[travis]: https://travis-ci.org/TrySound/rollup-plugin-terser

[Rollup](https://github.com/rollup/rollup) plugin to minify generated es bundle. Uses [terser](https://github.com/fabiosantoscode/terser) under the hood.

## Install

```sh
yarn add rollup-plugin-terser --dev
# Or with npm:
npm i rollup-plugin-terser --save-dev
```

_Note: this package requires rollup@0.66 and higher (including rollup@2.0.0)_

## Usage

```js
import { rollup } from "rollup";
import { terser } from "rollup-plugin-terser";

rollup({
  input: "main.js",
  plugins: [terser()],
});
```

## Why named export?

1. Module is a namespace. Default export often leads to function/component per file dogma and makes code less maintainable.
2. Interop with commonjs is broken in many cases or hard to maintain.
3. Show me any good language with default exports. It's historical javascriptism.

## Options

> ⚠️ **Caveat:** any function used in options object cannot rely on its surrounding scope, since it is executed in an isolated context.

```js
terser(options);
```

`options` - [terser API options](https://github.com/fabiosantoscode/terser#minify-options)

Note: some terser options are set by the plugin automatically:

- `module: true` is set when `format` is `esm` or `es`
- `toplevel: true` is set when `format` is `cjs`

`options.numWorkers: number`

Amount of workers to spawn. Defaults to the number of CPUs minus 1.

## Examples

### Using as output plugin

```js
// rollup.config.js
import { terser } from "rollup-plugin-terser";

export default {
  input: "index.js",
  output: [
    { file: "lib.js", format: "cjs" },
    { file: "lib.min.js", format: "cjs", plugins: [terser()
[![NPM version](https://img.shields.io/npm/v/csso.svg)](https://www.npmjs.com/package/csso)
[![Build Status](https://travis-ci.org/css/csso.svg?branch=master)](https://travis-ci.org/css/csso)
[![Coverage Status](https://coveralls.io/repos/github/css/csso/badge.svg?branch=master)](https://coveralls.io/github/css/csso?branch=master)
[![NPM Downloads](https://img.shields.io/npm/dm/csso.svg)](https://www.npmjs.com/package/csso)
[![Twitter](https://img.shields.io/badge/Twitter-@cssoptimizer-blue.svg)](https://twitter.com/cssoptimizer)

CSSO (CSS Optimizer) is a CSS minifier. It performs three sort of transformations: cleaning (removing redundant), compression (replacement for shorter form) and restructuring (merge of declarations, rulesets and so on). As a result your CSS becomes much smaller.

[![Originated by Yandex](https://cdn.rawgit.com/css/csso/8d1b89211ac425909f735e7d5df87ee16c2feec6/docs/yandex.svg)](https://www.yandex.com/)
[![Sponsored by Avito](https://cdn.rawgit.com/css/csso/8d1b89211ac425909f735e7d5df87ee16c2feec6/docs/avito.svg)](https://www.avito.ru/)

## Ready to use

- [Web interface](http://css.github.io/csso/csso.html)
- [csso-cli](https://github.com/css/csso-cli) – command line interface
- [gulp-csso](https://github.com/ben-eb/gulp-csso) – `Gulp` plugin
- [grunt-csso](https://github.com/t32k/grunt-csso) – `Grunt` plugin
- [broccoli-csso](https://github.com/sindresorhus/broccoli-csso) – `Broccoli` plugin
- [postcss-csso](https://github.com/lahmatiy/postcss-csso) – `PostCSS` plugin
- [csso-loader](https://github.com/sandark7/csso-loader) – `webpack` loader
- [csso-webpack-plugin](https://github.com/zoobestik/csso-webpack-plugin) – `webpack` plugin
- [CSSO Visual Studio Code plugin](https://marketplace.visualstudio.com/items?itemName=Aneryu.csso)

## Install

```
npm install csso
```

## API

<!-- TOC depthfrom:3 -->

- [minify(source[, options])](#minifysource-options)
- [minifyBlock(source[, options])](#minifyblocksource-options)
- [syntax.compress(ast[, options])](#syntaxcompressast-options)
- [Source maps](#source-maps)
- [Usage data](#usage-data)
    - [White list filtering](#white-list-filtering)
    - [Black list filtering](#black-list-filtering)
    - [Scopes](#scopes)

<!-- /TOC -->

Basic usage:

```js
var csso = require('csso');

var minifiedCss = csso.minify('.test { color: #ff0000; }').css;

console.log(minifiedCss);
// .test{color:red}
```

CSSO is based on [CSSTree](https://github.com/csstree/csstree) to parse CSS into AST, AST traversal and to generate AST back to CSS. All `CSSTree` API is available behind `syntax` field. You may minify CSS step by step:

```js
var csso = require('csso');
var ast = csso.syntax.parse('.test { color: #ff0000; }');
var compressedAst = csso.syntax.compress(ast).ast;
var minifiedCss = csso.syntax.generate(compressedAst);

console.log(minifiedCss);
// .test{color:red}
```

> Warning: CSSO uses early versions of CSSTree that still in active development. CSSO doesn't guarantee API behind `syntax` field or AST format will not change in future releases of CSSO, since it's subject to change in CSSTree. Be careful with CSSO updates if you use `syntax` API until this warning removal.

### minify(source[, options])

Minify `source` CSS passed as `String`.

```js
var result = csso.minify('.test { color: #ff0000; }', {
    restructure: false,   // don't change CSS structure, i.e. don't merge declarations, rulesets etc
    debug: true           // show additional debug information:
                          // true or number from 1 to 3 (greater number - more details)
});

console.log(result.css);
// > .test{color:red}
```

Returns an object with properties:

- css `String` – resulting CSS
- map `Object` – instance of [`SourceMapGenerator`](https://github.com/mozilla/source-map#sourcemapgenerator) or `null`

Options:

- sourceMap

  Type: `Boolean`  
  Default: `false`

  Generate a source map when `true`.

- filename

  Type: `String`  
  Default: `'<unknown>'`

  Filename of input CSS, uses for source map generation.

- debug

  Type: `Boolean`  
  Default: `false`

  Output debug information to `stderr`.

- beforeCompress

  Type: `function(ast, options)` or `Array<function(ast, options)>` or `null`  
  Default: `null`

  Called right after parse is run.

- afterCompress

  Type: `function(compressResult, options)` or `Array<function(compressResult, options)>` or `null`  
  Default: `null`

  Called right after [`syntax.compress()`](#syntaxcompressast-options) is run.

- Other options are the same as for [`syntax.compress()`](#s
# is-extglob [![NPM version](https://img.shields.io/npm/v/is-extglob.svg?style=flat)](https://www.npmjs.com/package/is-extglob) [![NPM downloads](https://img.shields.io/npm/dm/is-extglob.svg?style=flat)](https://npmjs.org/package/is-extglob) [![Build Status](https://img.shields.io/travis/jonschlinkert/is-extglob.svg?style=flat)](https://travis-ci.org/jonschlinkert/is-extglob)

> Returns true if a string has an extglob.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save is-extglob
```

## Usage

```js
var isExtglob = require('is-extglob');
```

**True**

```js
isExtglob('?(abc)');
isExtglob('@(abc)');
isExtglob('!(abc)');
isExtglob('*(abc)');
isExtglob('+(abc)');
```

**False**

Escaped extglobs:

```js
isExtglob('\\?(abc)');
isExtglob('\\@(abc)');
isExtglob('\\!(abc)');
isExtglob('\\*(abc)');
isExtglob('\\+(abc)');
```

Everything else...

```js
isExtglob('foo.js');
isExtglob('!foo.js');
isExtglob('*.js');
isExtglob('**/abc.js');
isExtglob('abc/*.js');
isExtglob('abc/(aaa|bbb).js');
isExtglob('abc/[a-z].js');
isExtglob('abc/{a,b}.js');
isExtglob('abc/?.js');
isExtglob('abc.js');
isExtglob('abc/def/ghi.js');
```

## History

**v2.0**

Adds
# string.prototype.matchall <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

ES2020 spec-compliant shim for String.prototype.matchAll. Invoke its "shim" method to shim `String.prototype.matchAll` if it is unavailable or noncompliant.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES3-supported environment, and complies with the [spec](https://tc39.es/ecma262/#sec-string.prototype.matchall).

Most common usage:
```js
const assert = require('assert');
const matchAll = require('string.prototype.matchall');

const str = 'aabc';
const nonRegexStr = 'ab';
co
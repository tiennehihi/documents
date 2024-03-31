<a href="https://promisesaplus.com/"><img src="https://promisesaplus.com/assets/logo-small.png" align="right" /></a>
# promise

This is a simple implementation of Promises.  It is a super set of ES6 Promises designed to have readable, performant code and to provide just the extensions that are absolutely necessary for using promises today.

For detailed tutorials on its use, see www.promisejs.org

**N.B.** This promise exposes internals via underscore (`_`) prefixed properties.  If you use these, your code will break with each new release.

[![Build Status](https://img.shields.io/github/workflow/status/then/promise/Publish%20Canary/master?style=for-the-badge)](https://github.com/then/promise/actions?query=workflow%3APublish%20Canary+branch%3Amaster)
[![Rolling Versions](https://img.shields.io/badge/Rolling%20Versions-Enabled-brightgreen?style=for-the-badge)](https://rollingversions.com/then/promise)
[![NPM version](https://img.shields.io/npm/v/promise?style=for-the-badge)](https://www.npmjs.com/package/promise)
[![Downloads](https://img.shields.io/npm/dm/promise.svg?style=for-the-badge)](https://www.npmjs.org/package/promise)

## Installation

**Server:**

    $ npm install promise

**Client:**

You can use browserify on the client, or use the pre-compiled script that acts as a polyfill.

```html
<script src="https://www.promisejs.org/polyfills/promise-6.1.0.js"></script>
```

Note that the [es5-shim](https://github.com/es-shims/es5-shim) must be loaded before this library to support browsers pre IE9.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-shim.min.js"></script>
```

## Usage

The example below shows how you can load the promise library (in a way that works on both client and server using node or browserify).  It then demonstrates creating a promise from scratch.  You simply call `new Promise(fn)`.  There is a complete specification for what is returned by this method in [Promises/A+](http://promises-aplus.github.com/promises-spec/).

```javascript
var Promise = require('promise');

var promise = new Promise(function (resolve, reject) {
  get('http://www.google.com', function (err, res) {
    if (err) reject(e
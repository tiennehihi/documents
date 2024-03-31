# serve-index

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Gratipay][gratipay-image]][gratipay-url]

  Serves pages that contain directory listings for a given path.

## Install

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install serve-index
```

## API

```js
var serveIndex = require('serve-index')
```

### serveIndex(path, options)

Returns middlware that serves an index of the directory in the given `path`.

The `path` is based off the `req.url` value, so a `req.url` of `'/some/dir`
with a `path` of `'public'` will look at `'public/some/dir'`. If you are using
something like `express`, you can change the URL "base" with `app.use` (see
the express example).

#### Options

Serve index accepts these properties in the options object.

##### filter

Apply this filter function to files. Defaults to `false`. The `filter` function
is called for each file, with the signature `filter(filename, index, files, dir)`
where `filename` is the name of the file, `index` is the array index, `files` is
the array of files and `dir` is the absolute path the file is located (and thus,
the directory the listing is for).

##### hidden

Display hidden (dot) files. Defaults to `false`.

##### icons

Display icons. Defaults to `false`.

##### stylesheet

Optional path to a CSS stylesheet. Defaults to a built-in stylesheet.

##### template

Optional path to an HTML template or a function that will render a HTML
string. Defaults to a built-in template.

When given a string, the string is used as a file path to load and then the
following tokens are replaced in templates:

  * `{directory}` with the name of the directory.
  * `{files}` with the HTML of an unordered list of file links.
  * `
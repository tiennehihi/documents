rary data through to your template.

  - `htmlWebpackPlugin.tags`: the prepared `headTags` and `bodyTags` Array to render the `<base>`, `<meta>`, `<script>` and `<link>` tags.
     Can be used directly in templates and literals. For example: 
     ```html
     <html>
       <head>
         <%= htmlWebpackPlugin.tags.headTags %>
       </head>
       <body>
         <%= htmlWebpackPlugin.tags.bodyTags %>
       </body>
     </html>
     ```
  
  - `htmlWebpackPlugin.files`: direct access to the files used during the compilation.

    ```typescript
    publicPath: string;
    js: string[];
    css: string[];
    manifest?: string;
    favicon?: string;
    ```


- `webpackConfig`: the webpack configuration that was used for this compilation. This
  can be used, for example, to get the `publicPath` (`webpackConfig.output.publicPath`).

- `compilation`: the webpack [compilation object](https://webpack.js.org/api/compilation-object/).
  This can be used, for example, to get the contents of processed assets and inline them
  directly in the page, through `compilation.assets[...].source()`
  (see [the inline template example](examples/inline/template.pug)).


The template can also be directly inlined directly into the options object.  
⚠️ **`templateContent` does not allow to use webpack loaders for your template and will not watch for template file changes**

**webpack.config.js**
```js
new HtmlWebpackPlugin({
  templateContent: `
    <html>
      <body>
        <h1>Hello World</h1>
      </body>
    </html>
  `
})
```

The `templateContent` can also access all `templateParameters` values.  
⚠️ **`templateContent` does not allow to use webpack loaders for your template and will not watch for template file changes**

**webpack.config.js**
```js
new HtmlWebpackPlugin({
  inject: false,
  templateContent: ({htmlWebpackPlugin}) => `
    <html>
      <head>
        ${htmlWebpackPlugin.tags.headTags}
      </head>
      <body>
        <h1>Hello World</h1>
        ${htmlWebpackPlugin.tags.bodyTags}
      </body>
    </html>
  `
})
```

### Filtering Chunks

To include only certain chunks you can limit the chunks being used

**webpack.config.js**
```js
plugins: [
  new HtmlWebpackPlugin({
    chunks: ['app']
  })
]
```

It is also possible to exclude certain chunks by setting the `excludeChunks` option

**webpack.config.js**
```js
plugins: [
  new HtmlWebpackPlugin({
    excludeChunks: [ 'dev-helper' ]
  })
]
```

### Minification

If the `minify` option is set to `true` (the default when webpack's `mode` is `'production'`),
the generated HTML will be minified using [html-minifier-terser](https://github.com/DanielRuf/html-minifier-terser)
and the following options:

```js
{
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
}
```

To use custom [html-minifier options](https://github.com/DanielRuf/html-minifier-terser#options-quick-reference)
pass an object to `minify` instead. This object will not be merged with the defaults above.

To disable minification during production mode set the `minify` option to `false`.

### Meta Tags

If the `meta` option is set the html-webpack-plugin will inject meta tags.  
For the default template the html-webpack-plugin will already provide a default for the `viewport` meta tag.

Please take a look at this well maintained list of almost all [possible meta tags](https://github.com/joshbuchea/HEAD#meta).

#### name/content meta tags 

Most meta tags are configured by setting a `name` and a `content` attribute.  
To add those use a key/value pair:

**webpack.config.js**
```js
plugins: [
  new HtmlWebpackPlugin({
      'meta': {
        'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
        // Will generate: <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        'theme-color': '#4285f4'
        // Will generate: <meta name="theme-color" content="#4285f4">
      }
  })
]
```

#### Simulate http response headers

The **http-equiv** attribute is essentially used to simulate a HTTP response header.  
This format is supported using an object notation which allows you to add any attribute:

**webpack.config.js**
```js
plugins: [
  new HtmlWebpackPlugin({
    'meta': {
      'Content-Security-Policy': { 'http-equiv': 'Content-Security-Policy', 'content': 'default-src https:' },
      // Will generate: <meta http-equiv="Content-Security-Policy" content="default-src https:">
      // Which equals to the following http header: `Content-Security-Policy: default-src https:`
      'set-cookie': { 'http-equiv': 'set-cookie', content: 'name=value; expires=date; path=url' },
      // Will generate: <meta http-equiv="set-cookie" content="value; expires=date; path=url">
      // Which equals to the following http header: `set-cookie: value; expires=date; path=url`
    }
  })
]
```

### Base Tag

When the `base` option is used,
html-webpack-plugin will inject a [base tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base).
By default, a base tag will not be injected.

The following two are identical and will both insert `<base href="http://example.com/some/page.html">`:

```js
new HtmlWebpackPlugin({
  'base': 'http://example.com/some/page.html'
})
```

```js
new HtmlWebpackPlugin({
  'base': { 'href': 'http://example.com/some/page.html' }
})
```

The `target` can be specified with the corresponding key:

```js
new HtmlWebpackPlugin({
  'base': {
    'href': 'http://example.com/some/page.html',
    'target': '_blank'
  }
})
```

which will inject the element `<base href="http://example.com/some/page.html" target="_blank">`.

### Long Term Caching

For long term caching add `contenthash` to the filename.

**Example:**

```js
plugins: [
  new HtmlWebpackPlugin({
    filename: 'index.[contenthash].html'
  })
]
```

`contenthash` is the hash of the content of the output file.

Refer webpack's [Template Strings](https://webpack.js.org/configuration/output/#template-strings) for more details

### Events

To allow other [plugins](https://github.com/webpack/docs/wiki/plugins) to alter the HTML this plugin executes
[tapable](https://github.com/webpack/tapable/tree/master) hooks.

The [lib/hooks.js](https://github.com/jantimon/html-webpack-plugin/blob/master/lib/hooks.js) contains all information
about which values are passed.

[![Concept flow uml](http
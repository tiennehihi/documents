g",
              styleTagTransform: function (css, style) {
                // Do something ...
                style.innerHTML = `${css}.modify{}\n`;

                document.head.appendChild(style);
              },
            },
          },
          "css-loader",
        ],
      },
    ],
  },
};
```

### `base`

```ts
type base = number;
```

This setting is primarily used as a workaround for [css clashes](https://github.com/webpack-contrib/style-loader/issues/163) when using one or more [DllPlugin](https://robertknight.me.uk/posts/webpack-dll-plugins/)'s. `base` allows you to prevent either the _app_'s css (or _DllPlugin2_'s css) from overwriting _DllPlugin1_'s css by specifying a css module id base which is greater than the range used by _DllPlugin1_ e.g.:

**webpack.dll1.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

**webpack.dll2.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          { loader: "style-loader", options: { base: 1000 } },
          "css-loader",
        ],
      },
    ],
  },
};
```

**webpack.app.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          { loader: "style-loader", options: { base: 2000 } },
          "css-loader",
        ],
      },
    ],
  },
};
```

### `esModule`

Type:

```ts
type esModule = boolean;
```

Default: `true`

By default, `style-loader` generates JS modules that use the ES modules syntax.
There are some cases in which using ES modules is beneficial, like in the case of [module concatenation](https://webpack.js.org/plugins/module-concatenation-plugin/) and [tree shaking](https://webpack.js.org/guides/tree-shaking/).

You can enable a CommonJS modules syntax using:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        loader: "style-loader",
        options: {
          esModule: false,
        },
      },
    ],
  },
};
```

## Examples

### Recommend

For `production` builds it's recommended to extract the CSS from your bundle being able to use parallel loading of CSS/JS resources later on.
This can be achieved by using the [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin), because it creates separate css files.
For `development` mode (including `webpack-dev-server`) you can use `style-loader`, because it injects CSS into the DOM using multiple `<style></style>` and works faster.

> **Warning**
>
> Do not use together `style-loader` and `mini-css-extract-plugin`.

**webpack.config.js**

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [].concat(devMode ? [] : [new MiniCssExtractPlugin()]),
};
```

### Named export for CSS Modules

> **Warning**
>
> Names of locals are converted to `camelCase`.

> **Warning**
>
> It is not allowed to use JavaScript reserved words in css class names.

> **Warning**
>
> Options `esModule` and `modules.namedExport` in `css-loader` should be enabled.

**styles.css**

```css
.foo-baz {
  color: red;
}
.bar {
  color: blue;
}
```

**index.js**

```js
import { fooBaz, bar } from "./styles.css";

console.log(fooBaz, bar);
```

You can enable a ES module named export using:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                namedExport: true,
              },
            },
          },
        ],
      },
    ],
  },
};
```

### Source maps

The loader automatically inject source maps when previous loader emit them.
Therefore, to generate source maps, set the `sourceMap` option to `true` for the previous loader.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          { loader: "css-loader", options: { sourceMap: true } },
        ],
      },
    ],
  },
};
```

### Nonce

If you are using a [Content Security Policy](https://www.w3.org/TR/CSP3/) (CSP), the injected code will usually be blocked. A workaround is to use a nonce. Note, however, that using a nonce significantly reduces the protection provided by the CSP. You can read more about the security impact in [the specification](https://www.w3.org/TR/CSP3/#security-considerations). The better solution is not to use this loader in production.

There are two ways to work with `nonce`:

- using the `attributes` option
- using the `__webpack_nonce__` variable

> **Warning**
>
> the `attributes` option takes precedence over the `__webpack_nonce__` variable

#### `attributes`

**component.js**

```js
import "./style.css";
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: "style-loader",
            options: {
              attributes: {
                nonce: "12345678",
              },
            },
          },
          "css-loader",
        ],
      },
    ],
  },
};
```

The loader generate:

```html
<style nonce="12345678">
  .foo {
    color: red;
  }
</style>
```

#### `__webpack_nonce__`

**create-non
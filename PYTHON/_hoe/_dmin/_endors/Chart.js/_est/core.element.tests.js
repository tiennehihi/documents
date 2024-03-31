<div align="center">
  <img width="180" height="180" vspace="20"
    src="https://cdn.worldvectorlogo.com/logos/css-3.svg">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![discussion][discussion]][discussion-url]
[![size][size]][size-url]

# css-loader

The `css-loader` interprets `@import` and `url()` like `import/require()` and will resolve them.

## Getting Started

> **Warning**
>
> To use the latest version of css-loader, webpack@5 is required

To begin, you'll need to install `css-loader`:

```console
npm install --save-dev css-loader
```

or

```console
yarn add -D css-loader
```

or

```console
pnpm add -D css-loader
```

Then add the plugin to your `webpack` config. For example:

**file.js**

```js
import css from "file.css";
```

**webpack.config.js**

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

And run `webpack` via your preferred method.

If, for one reason or another, you need to extract CSS as a file (i.e. do not store
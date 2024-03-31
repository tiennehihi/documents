<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![downloads][downloads]][npm-url]
[![contributors][contributors]][contributors-url]

# webpack-dev-server

Use [webpack](https://webpack.js.org) with a development server that provides
live reloading. This should be used for **development only**.

It uses [webpack-dev-middleware][middleware-url] under the hood, which provides
fast in-memory access to the webpack assets.

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
  - [With the CLI](#with-the-cli)
  - [With NPM Scripts](#with-npm-scripts)
  - [With the API](#with-the-api)
  - [With TypeScript](#with-typescript)
  - [The Result](#the-result)
- [Browser Support](#browser-support)
- [Support](#support)
- [Contributing](#contributing)
- [Attribution](#attribution)
- [License](#license)

## Getting Started

First things first, install the module:

```console
npm install webpack-dev-server --save-dev
```

or

```console
yarn add -D webpack-dev-server
```

or

```console
pnpm add -D webpack-dev-server
```

_Note: While you can install and run webpack-dev-server globally, we recommend
installing it locally. webpack-dev-server will always use a local installation
over a global one._

## Usage

There are two main, recommended methods of using the module:

### With the CLI

The easiest way to use it is with the [webpack CLI](https://webpack.js.org/api/cli/). In the directory where your
`webpack.config.js` is, run:

```console
npx webpack serve
```

Following options are available with `webpack serve`:

```
Usage: webpack serve|server|s [entries...] [options]

Run the webpack dev server.

Options:
  -c, --config <value...>                             Provide path to a webpack configuration file e.g. ./webpack.config.js.
  --config-name <value...>                            Name of the configuration to use.
  -m, --merge                                         Merge two or more configurations using 'webpack-merge'.
  --env <value...>                                    Environment passed to the configuration when it is a function.
  --node-env <value>                                  Sets process.env.NODE_ENV to the specified value.
  --progress [value]                                  Print compilation progress during build.
  -j, --json [value]                                  Prints result as JSON or store it in a file.
  -d, --devtool <value>                               Determine source maps to use.
  --no-devtool                                        Do not generate source maps.
  --entry <value...>                                  The entry point(s) of your application e.g. ./src/main.js.
  --mode <value>                                      Defines the mode to pass to webpack.
  --name <value>                                      Name of the configuration. Used when loading
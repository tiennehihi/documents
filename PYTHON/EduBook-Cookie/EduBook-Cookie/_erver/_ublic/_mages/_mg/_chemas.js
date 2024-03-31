<div align="center">
  <a href="http://json-schema.org">
    <img width="160" height="160"
      src="https://raw.githubusercontent.com/webpack-contrib/schema-utils/master/.github/assets/logo.png">
  </a>
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![GitHub Discussions][discussion]][discussion-url]
[![size][size]][size-url]

# schema-utils

Package for validate options in loaders and plugins.

## Getting Started

To begin, you'll need to install `schema-utils`:

```console
npm install schema-utils
```

## API

**schema.json**

```json
{
  "type": "object",
  "properties": {
    "option": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

```js
import schema from "./path/to/schema.json";
import { validate } from "schema-utils";

const options = { option: true };
const configuration = { name: "Loader Name/Plugin Name/Name" };

validate(schema, options, configuration);
```

### `schema`

Type: `String`

JSON schema.

Simple example of schema:

```json
{
  "type": "object",
  "properties": {
    "name": {
      "description": "This is description of option.",
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### `options`

Type: `Object`

Object with options.

```js
import schema from "./path/to/schema.json";
import { validate } from "schema-utils";

const options = { foo: "bar" };

validate(schema, { name: 123 }, { name: "MyPlugin" });
```

### `configuration`

Allow to configure validator.

There is an alternative method to configure the `name` and`baseDataPath` options via the `title` property in the schema.
For example:

```json
{
  "title": "My Loader options",
  "type": "object",
  "properties": {
    "name": {
      "description": "This is description of option.",
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

The last word used for the `baseDataPath` option, other words used for the `name` option.
Based on the example above the `name` option equals `My Load
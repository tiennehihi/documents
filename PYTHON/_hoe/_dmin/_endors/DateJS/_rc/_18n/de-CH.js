# Acorn

A tiny, fast JavaScript parser written in JavaScript.

## Community

Acorn is open source software released under an
[MIT license](https://github.com/acornjs/acorn/blob/master/acorn/LICENSE).

You are welcome to
[report bugs](https://github.com/acornjs/acorn/issues) or create pull
requests on [github](https://github.com/acornjs/acorn). For questions
and discussion, please use the
[Tern discussion forum](https://discuss.ternjs.net).

## Installation

The easiest way to install acorn is from [`npm`](https://www.npmjs.com/):

```sh
npm install acorn
```

Alternately, you can download the source and build acorn yourself:

```sh
git clone https://github.com/acornjs/acorn.git
cd acorn
npm install
```

## Interface

**parse**`(input, options)` is the main interface to the library. The
`input` parameter is a string, `options` can be undefined or an object
setting some of the options listed below. The return value will be an
abstract syntax tree object as specified by the [ESTree
spec](https://github.com/estree/estree).

```javascript
let acorn = require("acorn");
console.log(acorn.parse("1 + 1"));
```

When encountering a syntax error, the parser will raise a
`SyntaxError` object with a meaningful message. The error object will
have a `pos` property that indicates the string offset at which the
error occurred, and a `loc` object that contains a `{line, column}`
object referring to that same position.

Options can be provided by passing a second argument, which should be
an object containing any of these fields:

- **ecmaVersion**: Indicates the ECMAScript version to parse. Must be
  either 3, 5, 6 (2015), 7 (2016), 8 (2017), 9 (2018), 10 (2019) or 11
  (2020, partial support). This influences support for strict mode,
  the set of reserved words, and support for new syntax features.
  Default is 10.

  **NOTE**: Only 'stage 4' (finalized) ECMAScript features are being
  implemented by Acorn. Other proposed new features can be implemented
  through plugins.

- **sourceType**: Indicate the mode the code should be parsed in. Can be
  either `"script"` or `"module"`. This influences global strict mode
  and parsing of `import` and `export` declarations.

  **NOTE**: If set to `"module"`, then static `import` / `export` syntax
  will be valid, even if `ecmaVersion` is less than 6.

- **onInsertedSemicolon**: If given a callback, that callback will be
  called whenever a missing semicolon is inserted by the parser. The
  callback will be given the character offset of the point where the
  semicolon is inserted as argument, and if `locations` is on, also a
  `{line, column}` object representing this position.

- **onTrailingComma**: Like `onInsertedSemicolon`, but for trailing
  commas.

- **allowReserved**: If `false`, using a reserved word will generate
  an error. Defaults to `true` for `ecmaVersion` 3, `false` for higher
  versions. When given the value `"never"`, reserved words and
  keywords can also not be used as property names (as in Internet
  Explorer's old parser).

- **allowReturnOutsideFunction**: By default, a return statement at
  the top level raises an error. Set this to `true` to accept such
  code.

- **allowImportExportEverywhere**: By default, `import` and `export`
  declarations can only appear at a program's top level. Setting this
  option to `true` allows them anywhere where a statement is allowed.
  
- **allowAwaitOutsideFunction**: By default, `await` expressions can
  only appear inside `async` functions. Setting this option to
  `true` allows to have top-level `await` expressions. They are
  still not allowed in non-`async` functions, though.

- **allowHashBang**: When this is enabled (off by default), if the
  code starts with the characters `#!` (as in a shellscript), the
  first line will be treated as a comment.

- **locations**: When `true`, each node has a `loc` object attached
  with `start` and `end` subobjects, each of which contains the
  one-based line and zero-based column numbers in `{line, column}`
  form. Default is `false`.

- **onToken**: If a function is passed for this option, each found
  token will be passed in same format as tokens returned from
  `tokenizer().getToken()`.

  If array is passed, each found token is pushed to it.

  Note that you are not allowed to call the parser from the
  callback—that will corrupt its internal state.

- **onComment**: If a function is passed for this option, whenever a
  comment is encountered the function will be called with the
  following parameters:

  - `block`: `true` if the comment is a block comment, false if it
    is a line comment.
  - `text`: The content of the comment.
  - `start`: Character offset of the start of the comment.
  - `end`: Character offset of the end of the comment.

  When the `locations` options is on, the `{line, column}` locations
  of the comment’s start and end are passed as two additional
  parameters.

  If array is passed for this option, each found comment is pushed
  to it as object in Esprima format:

  ```javascript
  {
    "type": "Line" | "Block",
    "value": "comment text",
    "start": Number,
    "end": Number,
    // If `locations` option is on:
    "loc": {
      "start": {line: Number, column: Number}
      "end": {line: Number, column: Number}
    },
    // If `ranges` option is on:
    "range": [Number, Number]
  }
  ```

  Note that you are not allowed to call the parser from the
  callback—that will corrupt its internal state.

- **ranges**: Nodes have their start and end characters offsets
  recorded in `start` and `end` properties (directly on the node,
  r
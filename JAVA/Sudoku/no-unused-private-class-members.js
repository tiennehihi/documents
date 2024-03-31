# levn [![Build Status](https://travis-ci.org/gkz/levn.png)](https://travis-ci.org/gkz/levn) <a name="levn" />
__Light ECMAScript (JavaScript) Value Notation__
Levn is a library which allows you to parse a string into a JavaScript value based on an expected type. It is meant for short amounts of human entered data (eg. config files, command line arguments).

Levn aims to concisely describe JavaScript values in text, and allow for the extraction and validation of those values. Levn uses [type-check](https://github.com/gkz/type-check) for its type format, and to validate the results. MIT license. Version 0.4.1.

__How is this different than JSON?__ levn is meant to be written by humans only, is (due to the previous point) much more concise, can be validated against supplied types, has regex and date literals, and can easily be extended with custom types. On the other hand, it is probably slower and thus less efficient at transporting large amounts of data, which is fine since this is not its purpose.

    npm install levn

For updates on levn, [follow me on twitter](https://twitter.com/gkzahariev).


## Quick Examples

```js
var parse = require('levn').parse;
parse('Number', '2');      // 2
parse('String', '2');      // '2'
parse('String', 'levn');   // 'levn'
parse('String', 'a b');    // 'a b'
parse('Boolean', 'true');  // true

parse('Date', '#2011-11-11#'); // (Date object)
parse('Date', '2011-11-11');   // (Date object)
parse('RegExp', '/[a-z]/gi');  // /[a-z]/gi
parse('RegExp', 're');         // /re/
parse('Int', '2');             // 2

parse('Number | String', 'str'); // 'str'
parse('Number | String', '2');   // 2

parse('[Number]', '[1,2,3]');                      // [1,2,3]
parse('(String, Boolean)', '(hi, false)');         // ['hi', false]
parse('{a: String, b: Number}', '{a: str, b: 2}'); // {a: 'str', b: 2}

// at the top level, you can ommit surrounding delimiters
parse('[Number]', '1,2,3');                      // [1,2,3]
parse('(String, Boolean)', 'hi, false');         // ['hi', false]
parse('{a: String, b: Number}', 'a: str, b: 2'); // {a: 'str', b: 2}

// wildcard - auto choose type
parse('*', '[hi,(null,[42]),{k: true}]'); // ['hi', [null, [42]], {k: true}]
```
## Usage

`require('levn');` returns an object that exposes three properties. `VERSION` is the current version of the library as a string. `parse` and `parsedTypeParse` are functions.

```js
// parse(type, input, options);
parse('[Number]', '1,2,3'); // [1, 2, 3]

// parsedTypeParse(parsedType, input, options);
var parsedType = require('type-check').parseType('[Number]');
parsedTypeParse(parsedType, '1,2,3'); // [1, 2, 3]
```

### parse(type, input, options)

`parse` casts the string `input` into a JavaScript value according to the specified `type` in the [type format](https://github.com/gkz/type-check#type-format) (and taking account the optional `options`) and returns the resulting JavaScript value.

##### arguments
* type - `String` - the type written in the [type format](https://github.com/gkz/type-check#type-format) which to check against
* input - `String` - the value written in the [levn format](#levn-format)
* options - `Maybe Object` - an optional parameter specifying additional [options](#options)

##### returns
`*` - the resulting JavaScript value

##### example
```js
parse('[Number]', '1,2,3'); // [1, 2, 3]
```

### parsedTypeParse(parsedType, input, options)

`parsedTypeParse` casts the string `input` into a JavaScript value according to the specified `type` which has already been parsed (and taking account the optional `options`) and returns the resulting JavaScript value. You can parse a type using the [type-check](https://github.com/gkz/type-check) library's `parseType` function.

##### arguments
* type - `Object` - the type in the parsed type format which to check against
* input - `String` - the value written in the [levn format](#levn-format)
* options - `Maybe Object` - an optional parameter specifying additional [options](#options)

##### returns
`*` - the resulting JavaScript value

##### example
```js
var parsedType = require('type-check').parseType('[Number]');
parsedTypeParse(parsedType, '1,2,3'); // [1, 2, 3]
```

## Levn Format

Levn can use the type information you provide to choose the appropriate value to produce from the input. For the same input, it will choose a different output value depending on the type provided. For example, `parse('Number', '2')` will produce the number `2`, but `parse('String', '2')` will produce the string `"2"`.

If you do not provide type information, and simply use `*`, levn will parse the input according the unambiguous "explicit" mode, which we will now detail - you can also set the `explicit` option to true manually in the [options](#options).

* `"string"`, `'string'` are parsed as a String, eg. `"a msg"` is `"a msg"`
* `#date#` is parsed as a Date, eg. `#2011-11-11#` is `new Date('2011-11-11')`
* `/regexp/flags` is parsed as a RegExp, eg. `/re/gi` is `/re/gi`
* `undefined`, `null`, `NaN`, `true`, and `false` are all their JavaScript equivalents
* `[element1, element2, etc]` is an Array, and the casting procedure is recursively applied to each element. Eg. `[1,2,3]` is `[1,2,3]`.
* `(element1, element2, etc)` is an tuple, and the casting procedure is recursively applied to each element. Eg. `(1, a)` is `(1, a)` (is `[1, 'a']`).
* `{key1: val1, key2: val2, ...}` is an Object, and the casting procedure is recursively applied to each property. Eg. `{a: 1, b: 2}` is `{a: 1, b: 2}`.
* Any test which does not fall under the above, and which does not contain special characters (`[``]``(``)``{``}``:``,`) is a string, eg. `$12- blah` is `"$12- blah"`.

If you do provide type information, you can make your input more concise as the program already has some information about what it expects. Please see the [type format](https://github.com/gkz/type-check#type-format) section of [type-check](https://github.com/gkz/type-check) for more information about how to specify types. There are some rules about what levn can do with the information:

* If a String is expected, and only a String, all characters of the input (including any special ones) will become part of the output. Eg. `[({})]` is `"[({})]"`, and `"hi"` is `'"hi"'`.
* If a Date is expected, the surrounding `#` can be omitted from date literals. Eg. `2011-11-11` is `new Date('2011-11-11')`.
* If a RegExp is expected, no flags need to be specified, and the regex is not using any of the special characters,the opening and closing `/` can be omitted - this will have the affect of setting the source of the regex to the input. Eg. `regex` is `/regex/`.
* If an Array is expected, and it is the root node (at the top level), the opening `[` and closing `]` can be omitted. Eg. `1,2,3` is `[1,2,3]`.
* If a tuple is expected, and it is the root node (at the top level), the opening `(` and closing `)` can be omitted. Eg. `1, a` is `(1, a)` (is `[1, 'a']`).
* If an Object is expected, and it is the root node (at the top level), the opening `{` and closing `}` can be omitted. Eg `a: 1, b: 2` is `{a: 1, b: 2}`.

If you list multiple types (eg. `Number | String`), it will first attempt to cast to the first type and then validate - if the validation fails it will move on to the next type and so forth, left to right. You must be careful as some types will succeed with any input, such as String. Thus put String at the end of your list. In non-explicit mode, Date and RegExp will succeed with a large variety of input - also be careful with these and list them near the end if not last in your list.

Whitespace between special characters and elements is inconsequential.

## Options

Options is an object. It is an optional parameter to the `parse` and `parsedTypeParse` functions.

### Explicit

A `Boolean`. By default it is `false`.

__Example:__

```js
parse('Reg
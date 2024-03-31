events
  will be emitted.

## What options can I specify?

### Options for parsing functions

* `options.reviver`:
  Transformation function,
  invoked depth-first
  against the parsed
  data structure.
  This option
  is analagous to the
  [reviver parameter for JSON.parse][reviver].

* `options.yieldRate`:
  The number of data items to process
  before yielding to the event loop.
  Smaller values yield to the event loop more frequently,
  meaning less time will be consumed by bfj per tick
  but the overall parsing time will be slower.
  Larger values yield to the event loop less often,
  meaning slower tick times but faster overall parsing time.
  The default value is `16384`.

* `options.Promise`:
  Promise constructor that will be used
  for promises returned by all methods.
  If you set this option,
  please be aware that some promise implementations
  (including native promises)
  may cause your process to die
  with out-of-memory exceptions.
  Defaults to [bluebird's implementation][promise],
  which does not have that problem.

* `options.ndjson`:
  If set to `true`,
  newline characters at the root level
  will be treated as delimiters between
  discrete chunks of JSON.
  See [NDJSON](#can-it-handle-newline-delimited-json-ndjson) for more information.

* `options.numbers`:
  For `bfj.match` only,
  set this to `true`
  if you wish to match against numbers
  with a string or regular expression
  `selector` argument.

* `options.bufferLength`:
  For `bfj.match` only,
  the length of the match buffer.
  Smaller values use less memory
  but may result in a slower parse time.
  The default value is `1024`.

* `options.highWaterMark`:
  For `bfj.match` only,
  set this if you would like to
  pass a value for the `highWaterMark` option
  to the readable stream constructor.

### Options for serialisation functions

* `options.space`:
  Indentation string
  or the number of spaces
  to indent
  each nested level by.
  This option
  is analagous to the
  [space parameter for JSON.stringify][space].

* `options.promises`:
  By default,
  promises are coerced
  to their resolved value.
  Set this property
  to `'ignore'`
  for improved performance
  if you don't need
  to coerce promises.

* `options.buffers`:
  By default,
  buffers are coerced
  using their `toString` method.
  Set this property
  to `'ignore'`
  for improved performance
  if you don't need
  to coerce buffers.

* `options.maps`:
  By default,
  maps are coerced
  to plain objects.
  Set this property
  to `'ignore'`
  for improved performance
  if you don't need
  to coerce maps.

* `options.iterables`:
  By default,
  other iterables
  (i.e. not arrays, strings or maps)
  are coerced
  to arrays.
  Set this property
  to `'ignore'`
  for improved performance
  if you don't need
  to coerce iterables.

* `options.circular`:
  By default,
  circular references
  will cause the write
  to fail.
  Set this property
  to `'ignore'`
  if you'd prefer
  to silently skip past
  circular references
  in the data.

* `options.bufferLength`:
  The length of the write buffer.
  Smaller values use less memory
  but may result in a slower serialisation time.
  The default value is `1024`.

* `options.highWaterMark`:
  Set this if you would like to
  pass a value for the `highWaterMark` option
  to the readable stream constructor.

* `options.yieldRate`:
  The number of data items to process
  before yielding to the event loop.
  Smaller values yield to the event loop more frequently,
  meaning less time will be consumed by bfj per tick
  but the overall serialisation time will be slower.
  Larger values yield to the event loop less often,
  meaning slower tick times but faster overall serialisation time.
  The default value is `16384`.

* `options.Promise`:
  Promise constructor that will be used
  for promises returned by all methods.
  If you set this option,
  please be aware that some promise implementations
  (including native promises)
  may cause your process to die
  with out-of-memory exceptions.
  Defaults to [bluebird's implementation][promise],
  which does not have that problem.

## Is it possible to pause parsing or serialisation from calling code?

Yes it is!
Both [`walk`](#bfjwalk-stream-options)
and [`eventify`](#bfjeventify-data-options)
decorate their returned event emitters
with a `pause` method
that will prevent any further events being emitted.
The `pause` method itself
returns a `resume` function
that you can call to indicate
that processing should continue.

For example:

```js
const bfj = require('bfj');
const emitter = bfj.walk(fs.createReadStream(path), options);

// Later, when you want to pause parsing:

const resume = emitter.pause();

// Then when you want to resume:

resume();
```

## Can it handle [newline-delimited JSON (NDJSON)](http://ndjson.org/)?

Yes.
If you pass the `ndjson` [option](#options-for-parsing-functions)
to `bfj.walk`, `bfj.match` or `bfj.parse`,
newline characters at the root level
will act as delimiters between
discrete JSON values:

* `bfj.walk` will emit a `bfj.events.endLine` event
  each time it encounters a newline character.

* `bfj.match` will just ignore the newlines
  while it continues looking for matching items.

* `bfj.parse` will resolve with the first value
  and pause the underlying stream.
  If it's called again with the same stream,
  it will resume processing
  and resolve with the second value.
  To parse the entire stream,
  calls should be made sequentially one-at-a-time
  until the returned promise
  resolves to `undefined`
  (`undefined` is not a valid JSON token).

`bfj.unpipe` and `bfj.read` will not parse NDJSON.

## Why does it default to bluebird promises?

Until version `4.2.4`,
native promises were used.
But they were found
to cause out-of-memory errors
when serialising large amounts of data to JSON,
due to [well-documented problems
with the native promise implementation](https://alexn.org/blog/2017/10/11/javascript-promise-leaks-memory.html).
So in version `5.0.0`,
bluebird promises were used instead.
In version `5.1.0`,
an option was added
that enables callers to specify
the promise constructor to use.
Use it at your own risk.

## Can I specify a different promise implementation?

Yes.
Just pass the `Promise` option
to any method.
If you get out-of-memory errors
when using that option,
consider changing your promise implementation.

## Is there a change log?

[Yes][history].

## How do I set up the dev environment?

The development environment
relies on [Node.js][node],
[ESLint],
[Mocha],
[Chai],
[Proxyquire] and
[Spooks].
Assuming that
you already have
node and NPM
set up,
you just need
to run
`npm install`
to install
all of the dependencies
as listed in `package.json`.

You can
lint the code
with the command
`npm run lint`.

You can
run the tests
with the command
`npm test`.

## What versions of Node.js does it support?

As of [version `7.0.0`](HISTORY.md#700),
only Node.js versions 8 or greater
are supported.

Between versions [`3.0.0`](HISTORY.md#300)
and [`6.1.2`](HISTORY.md#612),
only Node.js versions 6 or greater
were supported.

Until [version `2.1.2`](HISTORY.md#212),
only Node.js versions 4 or greater
were supported.

## What license is it released under?

[MIT][license].

[ci-image]: https://secure.travis-ci.org/philbooth/bfj.png?branch=master
[ci-status]: http://travis-ci.org/#!/philbooth/bfj
[sax]: http://en.wikipedia.org/wiki/Simple_API_for_XML
[promise]: http://bluebirdjs.com/docs/api-reference.html
[bfj-collections]: https://github.com/hash-bang/bfj-collections
[eventemitter]: https://nodejs.org/api/events.html#events_class_eventemitter
[readable]: https://nodejs.org/api/stream.html#stream_readable_streams
[writable]: https://nodejs.org/api/stream.html#stream_writable_streams
[pipe]: https://nodejs.org/api/stream.html#stream_readable_pipe_destination_options
[regexp-test]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
[reviver]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter
[space]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_space_argument
[history]: HISTORY.md
[node]: https://nodejs.org/en/
[eslint]: http://eslint.org/
[mocha]: https://mochajs.org/
[chai]: http://chaijs.com/
[proxyquire]: https://github.com/thlorenz/proxyquire
[spooks]: https://gitlab.com/philbooth/spooks.js
[license]: COPYING
                            
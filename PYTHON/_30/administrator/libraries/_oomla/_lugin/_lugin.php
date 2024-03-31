[![Build Status](https://secure.travis-ci.org/kriskowal/q.svg?branch=master)](http://travis-ci.org/kriskowal/q)
[![CDNJS](https://img.shields.io/cdnjs/v/q.js.svg)](https://cdnjs.com/libraries/q.js)

<a href="http://promises-aplus.github.com/promises-spec">
    <img src="http://kriskowal.github.io/q/q.png" align="right" alt="Q logo" />
</a>

If a function cannot return a value or throw an exception without
blocking, it can return a promise instead.  A promise is an object
that represents the return value or the thrown exception that the
function may eventually provide.  A promise can also be used as a
proxy for a [remote object][Q-Connection] to overcome latency.

[Q-Connection]: https://github.com/kriskowal/q-connection

On the first pass, promises can mitigate the “[Pyramid of
Doom][POD]”: the situation where code marches to the right faster
than it marches forward.

[POD]: http://calculist.org/blog/2011/12/14/why-coroutines-wont-work-on-the-web/

```javascript
step1(function (value1) {
    step2(value1, function(value2) {
        step3(value2, function(value3) {
            step4(value3, function(value4) {
                // Do something with value4
            });
        });
    });
});
```

With a promise library, you can flatten the pyramid.

```javascript
Q.fcall(promisedStep1)
.then(promisedStep2)
.then(promisedStep3)
.then(promisedStep4)
.then(function (value4) {
    // Do something with value4
})
.catch(function (error) {
    // Handle any error from all above steps
})
.done();
```

With this approach, you also get implicit error propagation, just like `try`,
`catch`, and `finally`.  An error in `promisedStep1` will flow all the way to
the `catch` function, where it’s caught and handled.  (Here `promisedStepN` is
a version of `stepN` that returns a promise.)

The callback approach is called an “inversion of control”.
A function that accepts a callback instead of a return value
is saying, “Don’t call me, I’ll call you.”.  Promises
[un-invert][IOC] the inversion, cleanly separating the input
arguments from control flow arguments.  This simplifies the
use and creation of API’s, particularly variadic,
rest and spread arguments.

[IOC]: http://www.slideshare.net/domenicdenicola/callbacks-promises-and-coroutines-oh-my-the-evolution-of-asynchronicity-in-javascript


## Getting Started

The Q module can be loaded as:

-   A ``<script>`` tag (creating a ``Q`` global variable): ~2.5 KB minified and
    gzipped.
-   A Node.js and CommonJS module, available in [npm](https://npmjs.org/) as
    the [q](https://npmjs.org/package/q) package
-   An AMD module
-   A [component](https://github.com/component/component) as ``microjs/q``
-   Using [bower](http://bower.io/) as `q#^1.4.1`
-   Using [NuGet](http://nuget.org/) as [Q](https://nuget.org/packages/q)

Q can exchange promises with jQuery, Dojo, When.js, WinJS, and 
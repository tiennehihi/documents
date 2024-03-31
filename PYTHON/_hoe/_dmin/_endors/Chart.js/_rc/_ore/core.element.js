/**
 * The `node:console` module provides a simple debugging console that is similar to
 * the JavaScript console mechanism provided by web browsers.
 *
 * The module exports two specific components:
 *
 * * A `Console` class with methods such as `console.log()`, `console.error()`, and`console.warn()` that can be used to write to any Node.js stream.
 * * A global `console` instance configured to write to `process.stdout` and `process.stderr`. The global `console` can be used without calling`require('node:console')`.
 *
 * _**Warning**_: The global console object's methods are neither consistently
 * synchronous like the browser APIs they resemble, nor are they consistently
 * asynchronous like all other Node.js streams. See the `note on process I/O` for
 * more information.
 *
 * Example using the global `console`:
 *
 * ```js
 * console.log('hello world');
 * // Prints: hello world, to stdout
 * console.log('hello %s', 'world');
 * // Prints: hello world, to stdout
 * console.error(new Error('Whoops, something bad happened'));
 * // Prints error message and stack trace to stderr:
 * //   Error: Whoops, something bad happened
 * //     at [eval]:5:15
 * //     at Script.runInThisContext (node:vm:132:18)
 * //     at Object.runInThisContext (node:vm:309:38)
 * //     at node:internal/process/execution:77:19
 * //     at [eval]-wrapper:6:22
 * //     at evalScript (node:internal/process/execution:76:60)
 * //     at node:internal/main/eval_string:23:3
 *
 * const name = 'Will Robinson';
 * console.warn(`Danger ${name}! Danger!`);
 * // Prints: Danger Will Robinson! Danger!, to stderr
 * ```
 *
 * Example using the `Console` class:
 *
 * ```js
 * const out = getStreamSomehow();
 * const err = getStreamSomehow();
 * const myConsole = new console.Console(out, err);
 *
 * myConsole.log('hello world');
 * // Prints: hello world, to out
 * myConsole.log('hello %s', 'world');
 * // Prints: hello world, to out
 * myConsole.error(new Error('Whoops, something bad happened'));
 * // Prints: [Error: Whoops, something bad happened], to err
 *
 * const name = 'Will Robinson';
 * myConsole.warn(`Danger ${name}! Danger!`);
 * // Prints: Danger Will Robinson! Danger!, to err
 * ```
 * @see [source](https://github.com/nodejs/node/blob/v20.2.0/lib/console.js)
 */
declare module "console" {
    import console = require("node:console");
    export = console;
}
declare module "node:console" {
    import { InspectOptions 
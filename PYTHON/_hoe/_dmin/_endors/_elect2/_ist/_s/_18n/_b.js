/**
 * @since v0.3.7
 * @experimental
 */
declare module "module" {
    import { URL } from "node:url";
    import { MessagePort } from "node:worker_threads";
    namespace Module {
        /**
         * The `module.syncBuiltinESMExports()` method updates all the live bindings for
         * builtin `ES Modules` to match the properties of the `CommonJS` exports. It
         * does not add or remove exported names from the `ES Modules`.
         *
         * ```js
         * const fs = require('node:fs');
         * const assert = require('node:assert');
         * const { syncBuiltinESMExports } = require('node:module');
         *
         * fs.readFile = newAPI;
         *
         * delete fs.readFileSync;
         *
         * function newAPI() {
         *   // ...
   
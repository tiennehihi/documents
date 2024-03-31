export {}; // Make this a module

// #region Fetch and friends
// Conditional type aliases, used at the end of this file.
// Will either be empty if lib-dom is included, or the undici version otherwise.
type _Request = typeof globalThis extends { onmessage: any } ? {} : import("undici-types").Request;
type _Response = typeof globalThis extends { onmessage: any } ? {} : import("undici-types").Response;
type _FormData = typeof globalThis extends { onmessage: any } ? {} : import("undici-types").FormData;
type _Headers = typeof globalThis extends { onmessage: any } ? {} : import("undici-types").Headers;
type _RequestInit = typeof globalThis extends { onmessage: any } ? {}
    : import("undici-types").RequestInit;
type _ResponseInit = typeof globalThis extends { onmessage: any } ? {}
    : import("undici-types").ResponseInit;
type _File = typeof globalThis extends { onmessage: any } ? {} : import("node:buffer").File;
// #endregion Fetch and friends

declare global {
    // Declare "static" methods in Error
    interface ErrorConstructor {
        /** Create .stack property on a target object */
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;

        /**
         * Optional override for formatting stack traces
         *
         * @see https://v8.dev/docs/stack-trace-api#customizing-stack-traces
         */
        prepareStackTrace?: ((err: Error, stackTr
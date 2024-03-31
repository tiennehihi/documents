/**
 * The `node:http2` module provides an implementation of the [HTTP/2](https://tools.ietf.org/html/rfc7540) protocol.
 * It can be accessed using:
 *
 * ```js
 * const http2 = require('node:http2');
 * ```
 * @since v8.4.0
 * @see [source](https://github.com/nodejs/node/blob/v20.2.0/lib/http2.js)
 */
declare module "http2" {
    import EventEmitter = require("node:events");
    import * as fs from "node:fs";
    import * as net from "node:net";
    import * as stream from "node:stream";
    import * as tls from "node:tls";
    import * as url from "node:url";
    import {
        IncomingHttpHeaders as Http1IncomingHttpHeaders,
        IncomingMessage,
        OutgoingHttpHeaders,
        ServerResponse,
    } from "node:http";
    export { OutgoingHttpHeaders } from "node:http";
    export interface IncomingHttpStatusHeader {
        ":status"?: number | undefined;
    }
    export interface IncomingHttpHeaders extends Http1IncomingHttpHeaders {
        ":path"?: string | undefined;
        ":method"?: string | undefined;
        ":authority"?: string | undefined;
        ":scheme"?: string | undefined;
    }
    // Http2Stream
    export interface StreamPriorityOptions {
        exclusive?: boolean | undefined;
        parent?: number | undefined;
        weight?: number | undefined;
        silent?: boolean | undefined;
    }
    export interface StreamState {
        localWindowSize?: number | undefined;
        state?: number | undefined;
        localClose?: number | undefined;
        remoteClose?: number | undefined;
        sumDependencyWeight?: number | undefined;
        weight?: number | undefined;
    }
    export interface ServerStreamResponseOptions {
        endStream?: boolean | undefined;
        waitForTrailers?: boolean | undefined;
    }
    export interface StatOptions {
        offset: number;
        length: number;
    }
    export interface ServerStreamFileResponseOptions {
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
        statCheck?(stats: fs.Stats, headers: OutgoingHttpHeaders, statOptions: StatOptions): void | boolean;
        waitForTrailers?: boolean | undefined;
        offset?: number | undefined;
        length?: number | undefined;
    }
    export interface ServerStreamFileResponseOptionsWithError extends ServerStreamFileResponseOptions {
        onError?(err: NodeJS.ErrnoException): void;
    }
    export interface Http2Stream extends stream.
/**
 * To use the HTTP server and client one must `require('node:http')`.
 *
 * The HTTP interfaces in Node.js are designed to support many features
 * of the protocol which have been traditionally difficult to use.
 * In particular, large, possibly chunk-encoded, messages. The interface is
 * careful to never buffer entire requests or responses, so the
 * user is able to stream data.
 *
 * HTTP message headers are represented by an object like this:
 *
 * ```json
 * { "content-length": "123",
 *   "content-type": "text/plain",
 *   "connection": "keep-alive",
 *   "host": "example.com",
 *   "accept": "*" }
 * ```
 *
 * Keys are lowercased. Values are not modified.
 *
 * In order to support the full spectrum of possible HTTP applications, the Node.js
 * HTTP API is very low-level. It deals with stream handling and message
 * parsing only. It parses a message into headers and body but it does not
 * parse the actual headers or the body.
 *
 * See `message.headers` for details on how duplicate headers are handled.
 *
 * The raw headers as they were received are retained in the `rawHeaders`property, which is an array of `[key, value, key2, value2, ...]`. For
 * example, the previous message header object might have a `rawHeaders`list like the following:
 *
 * ```js
 * [ 'ConTent-Length', '123456',
 *   'content-LENGTH', '123',
 *   'content-type', 'text/plain',
 *   'CONNECTION', 'keep-alive',
 *   'Host', 'example.com',
 *   'accepT', '*' ]
 * ```
 * @see [source](https://github.com/nodejs/node/blob/v20.2.0/lib/http.js)
 */
declare module "http" {
    import * as stream from "node:stream";
    import { URL } from "node:url";
    import { LookupOptions } from "node:dns";
    import { EventEmitter } from "node:events";
    import { LookupFunction, Server as NetServer, Socket, TcpSocketConnectOpts } from "node:net";
    // incoming headers will never contain number
    interface IncomingHttpHeaders extends NodeJS.Dict<string | string[]> {
        accept?: string | undefined;
        "accept-language"?: string | undefined;
        "accept-patch"?: string | undefined;
        "accept-ranges"?: string | undefined;
        "access-control-allow-credentials"?: string | undefined;
        "access-control-allow-headers"?: string | undefined;
        "access-control-allow-methods"?: string | undefined;
        "access-control-allow-origin"?: string | undefined;
        "access-control-expose-headers"?: string | undefined;
        "access-control-max-age"?: string | undefined;
        "access-control-request-headers"?: string | undefined;
        "access-control-request-method"?: string | undefined;
        age?: stri
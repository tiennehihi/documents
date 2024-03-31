/**
 * HTTPS is the HTTP protocol over TLS/SSL. In Node.js this is implemented as a
 * separate module.
 * @see [source](https://github.com/nodejs/node/blob/v20.2.0/lib/https.js)
 */
declare module "https" {
    import { Duplex } from "node:stream";
    import * as tls from "node:tls";
    import * as http from "node:http";
    import { URL } from "node:url";
    type ServerOptions<
        Request extends typeof http.IncomingMessage = typeof http.IncomingMessage,
        Response extends typeof http.ServerResponse = typeof http.ServerResponse,
    > = tl
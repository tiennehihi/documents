# Installation
> `npm install --save @types/sockjs`

# Summary
This package contains type definitions for sockjs (https://github.com/sockjs/sockjs-node).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/sockjs.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/sockjs/index.d.ts)
````ts
/// <reference types="node" />

import http = require("http");

export interface ServerOptions {
    sockjs_url?: string | undefined;
    prefix?: string | undefined;
    response_limit?: number | undefined;
    websocket?: boolean | undefined;
    jsessionid?: any;
    log?(severity: string, message: string): void;
    heartbeat_delay?: number | undefined;
    disconnect_delay?: number | undefined;
}

export function createServer(options?: ServerOptions): Server;

export interface Server extends NodeJS.EventEmitter {
    installHandlers(server: http.Server, options?: ServerOptions): any;

    on(event: "connection", listener: (conn: Connection) => any): this;
    on(event: string, listener: Function): this;
}

export interface Connection extends NodeJS.ReadWriteStream {
    remoteAddress: string;
    remotePort: number;
    address: {
        [key: string]: {
            address: string;
            port: number;
        };
    };
    headers: {
        [key: st
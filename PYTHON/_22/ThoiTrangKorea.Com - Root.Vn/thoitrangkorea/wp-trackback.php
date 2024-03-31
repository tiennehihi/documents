= "http" ? "ws:" : "wss:";
        }

        searchParams.set("protocol", protocol);

        if (typeof webSocketURL.username !== "undefined") {
          searchParams.set("username", webSocketURL.username);
        }

        if (typeof webSocketURL.password !== "undefined") {
          searchParams.set("password", webSocketURL.password);
        }

        /** @type {string} */
        let hostname;

        // SockJS is not supported server mode, so `hostname` and `port` can't specified, let's ignore them
        const isSockJSType = webSocketServer.type === "sockjs";
        const isWebSocketServerHostDefined =
          typeof webSocketServer.options.host !== "undefined";
        const isWebSocketServerPortDefined =
          typeof webSocketServer.options.port !== "undefined";

        if (
          isSockJSType &&
          (isWebSocketServerHostDefined || isWebSocketServerPortDefined)
        ) {
          this.logger.warn(
            "SockJS only supports client mode and does not support custom hostname and port options. Please consider using 'ws' if you need to customize these options.",
          );
        }

        // We are proxying dev server and need to specify custom `hostname`
        if (typeof webSocketURL.hostname !== "undefined") {
          hostname = webSocketURL.hostname;
        }
        // Web socket server works on custom `hostname`, only for `ws` because `sock-js` is not support custom `hostname`
        else if (isWebSocketServerHostDefined && !isSockJSType) {
          hostname = webSocketServer.options.host;
        }
        // The `host` option is specified
        else if (typeof this.options.host !== "undefined") {
          hostname = this.options.host;
        }
        // The `port` option is not specified
        else {
          hostname = "0.0.0.0";
        }

        searchParams.set("hostname", hostname);

        /** @type {number | string} */
        let port;

        // We are proxying dev server and need to specify custom `port`
        if (typeof webSocketURL.port !== "undefined") {
          port = webSocketURL.port;
        }
        // Web socket server works on custom `port`, only for `ws` because `sock-js` is not support custom `port`
        else if (isWebSocketServerPortDefined && !isSockJSType) {
          port = webSocketServer.options.port;
        }
        // The `port` option is specified
        else if (typeof this.options.port === "number") {
          port = this.options.port;
        }
        // The `port` option is specified using `string`
        else if (
          typeof this.options.port === "string" &&
          this.options.port !== "auto"
        ) {
          port = Number(this.options.port);
        }
        // The `port` option is not specified or set to `auto`
        else {
          port = "0";
        }

        searchParams.set("port", String(port));

        /** @type {string} */
        let pathname = "";

        // We are proxying dev server and need to specify custom `pathname`
        if (typeof webSocketURL.pathname !== "undefined") {
          pathname = webSocketURL.pathname;
        }
        // Web socket server works on custom `path`
        else if (
          typeof webSocketServer.options.prefix !== "undefined" ||
          typeof webSocketServer.options.path !== "undefined"
        ) {
          pathname =
            webSocketServer.options.prefix || webSocketServer.options.path;
        }

        searchParams.set("pathname", pathname);

        const client = /** @type {ClientConfiguration} */ (this.options.client);

        if (typeof client.logging !== "undefined") {
          searchParams.set("logging", client.logging);

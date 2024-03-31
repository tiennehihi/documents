  (this.middleware),
      });
    }

    if (/** @type {NormalizedStatic[]} */ (this.options.static).length > 0) {
      /** @type {NormalizedStatic[]} */
      (this.options.static).forEach((staticOption) => {
        staticOption.publicPath.forEach((publicPath) => {
          middlewares.push({
            name: "express-static",
            path: publicPath,
            middleware: getExpress().static(
              staticOption.directory,
              staticOption.staticOptions,
            ),
          });
        });
      });
    }

    if (this.options.historyApiFallback) {
      const connectHistoryApiFallback = require("connect-history-api-fallback");
      const { historyApiFallback } = this.options;

      if (
        typeof (
          /** @type {ConnectHistoryApiFallbackOptions} */
          (historyApiFallback).logger
        ) === "undefined" &&
        !(
          /** @type {ConnectHistoryApiFallbackOptions} */
          (historyApiFallback).verbose
        )
      ) {
        // @ts-ignore
        historyApiFallback.logger = this.logger.log.bind(
          this.logger,
          "[connect-history-api-fallback]",
        );
      }

      // Fall back to /index.html if nothing else matches.
      middlewares.push({
        name: "connect-history-api-fallback",
        middleware: connectHistoryApiFallback(
          /** @type {ConnectHistoryApiFallbackOptions} */
          (historyApiFallback),
        ),
      });

      // include our middleware to ensure
      // it is able to handle '/index.html' request after redirect
      middlewares.push({
        name: "webpack-dev-middleware",
        middleware:
          /** @type {import("webpack-dev-middleware").Middleware<Request, Response>}*/
          (this.middleware),
      });

      if (/** @type {NormalizedStatic[]} */ (this.options.static).length > 0) {
        /** @type {NormalizedStatic[]} */
        (this.options.static).forEach((staticOption) => {
          staticOption.publicPath.forEach((publicPath) => {
            middlewares.push({
              name: "express-static",
              path: publicPath,
              middleware: getExpress().static(
                staticOption.directory,
                staticOption.staticOptions,
              ),
            });
          });
        });
      }
    }

    if (/** @type {NormalizedStatic[]} */ (this.options.static).length > 0) {
      const serveIndex = require("serve-index");

      /** @type {NormalizedStatic[]} */
      (this.options.static).forEach((staticOption) => {
        staticOption.publicPath.forEach((publicPath) => {
          if (staticOption.serveIndex) {
            middlewares.push({
              name: "serve-index",
              path: publicPath,
              /**
               * @param {Request} req
               * @param {Response} res
               * @param {NextFunction} next
               * @returns {void}
               */
              middleware: (req, res, next) => {
                // serve-index doesn't fallthrough non-get/head request to next middleware
                if (req.method !== "GET" && req.method !== "HEAD") {
                  return next();
                }

                serveIndex(
                  staticOption.directory,
                  /** @type {ServeIndexOptions} */
                  (staticOption.serveIndex),
                )(req, res, next);
              },
            });
          }
        });
      });
    }

    // Register this middleware always as the last one so that it's only used as a
    // fallback when no other middleware responses.
    middlewares.push({
      name: "options-middleware",
      path: "*",
      /**
       * @param {Request} req
       * @param {Response} res
       * @param {NextFunction} next
       * @returns {void}
       */
      middleware: (req, res, next) => {
        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.setHeader("Content-Length", "0");
          res.end();
          return;
        }
        next();
      },
    });

    if (typeof this.options.setupMiddlewares === "function") {
      middlewares = this.options.setupMiddlewares(middlewares, this);
    }

    middlewares.forEach((middleware) => {
      if (typeof middleware === "function") {
        /** @type {import("express").Application} */
        (this.app).use(middleware);
      } else if (typeof middleware.path !== "undefined") {
        /** @type {import("express").Application} */
        (this.app).use(middleware.path, middleware.middleware);
      } else {
        /** @type {import("express").Application} */
        (this.app).use(middleware.middleware);
      }
    });
  }

  /**
   * @private
   * @returns {void}
   */
  createServer() {
    const { type, options } = /** @type {ServerConfiguration} */ (
      this.options.server
    );

    /** @type {import("http").Server | undefined | null} */
    // eslint-disable-next-line import/no-dynamic-require
    this.server = require(/** @type {string} */ (type)).createServer(
      options,
      this.app,
    );

    /** @type {import("http").Server} */
    (this.server).on(
      "connection",
      /**
       * @param {Socket} socket
       */
      (socket) => {
        // Add socket to list
        this.sockets.push(socket);

        socket.once("close", () => {
          // Remove socket from list
          this.sockets.splice(this.sockets.indexOf(socket), 1);
        });
      },
    );

    /** @type {import("http").Server} */
    (this.server).on(
      "error",
      /**
       * @param {Error} error
       */
      (error) => {
        throw error;
      },
    );
  }

  /**
   * @private
   * @returns {void}
   */
  createWebSocketServer() {
    /** @type {WebSocketServerImplementation | undefined | null} */
    this.webSocketServer = new /** @type {any} */ (this.getServerTransport())(
      this,
    );
    /** @type {WebSocketServerImplementation} */
    (this.webSocketServer).implementation.on(
      "connection",
      /**
       * @param {ClientConnection} client
       * @param {IncomingMessage} request
       */
      (client, request) => {
        /** @type {{ [key: string]: string | undefined } | undefined} */
        const headers =
          // eslint-disable-next-line no-nested-ternary
          typeof request !== "undefined"
            ? /** @type {{ [key: string]: string | undefined }} */
              (request.headers)
            : typeof (
                  /** @type {import("sockjs").Connection} */ (client).headers
                ) !== "undefined"
              ? /** @type {import("sockjs").Connection} */ (client).headers
              : // eslint-disable-next-line no-undefined
                undefined;

        if (!headers) {
          this.logger.warn(
            'webSocketServer implementation must pass headers for the "connection" event',
          );
        }

       
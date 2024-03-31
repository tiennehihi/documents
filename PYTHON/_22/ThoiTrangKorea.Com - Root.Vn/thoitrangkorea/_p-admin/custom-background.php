ntationFound = false;
    }

    if (!implementationFound) {
      throw new Error(
        "webSocketServer (webSocketServer.type) must be a string denoting a default implementation (e.g. 'ws', 'sockjs'), a full path to " +
          "a JS file which exports a class extending BaseServer (webpack-dev-server/lib/servers/BaseServer.js) " +
          "via require.resolve(...), or the class itself which extends BaseServer",
      );
    }

    return implementation;
  }

  /**
   * @private
   * @returns {void}
   */
  setupProgressPlugin() {
    const { ProgressPlugin } =
      /** @type {MultiCompiler}*/
      (this.compiler).compilers
        ? /** @type {MultiCompiler}*/ (this.compiler).compilers[0].webpack
        : /** @type {Compiler}*/ (this.compiler).webpack;

    new ProgressPlugin(
      /**
       * @param {number} percent
       * @param {string} msg
       * @param {string} addInfo
       * @param {string} pluginName
       */
      (percent, msg, addInfo, pluginName) => {
        percent = Math.floor(percent * 100);

        if (percent === 100) {
          msg = "Compilation completed";
        }

        if (addInfo) {
          msg = `${msg} (${addInfo})`;
        }

        if (this.webSocketServer) {
          this.sendMessage(this.webSocketServer.clients, "progress-update", {
            percent,
            msg,
            pluginName,
          });
        }

        if (this.server) {
          this.server.emit("progress-update", { percent, msg, pluginName });
        }
      },
    ).apply(this.compiler);
  }

  /**
   * @private
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.options.webSocketServer) {
      const compilers =
        /** @type {MultiCompiler} */
        (this.compiler).compilers || [this.compiler];

      compilers.forEach((compiler) => {
        this.addAdditionalEntries(compiler);

        const webpack = compiler.webpack || require("webpack");

        new webpack.ProvidePlugin({
          __webpack_dev_server_client__: this.getClientTransport(),
        }).apply(compiler);

        if (this.options.hot) {
          const HMRPluginExists = compiler.options.plugins.find(
            (p) => p && p.constructor === webpack.HotModuleReplacementPlugin,
          );

          if (HMRPluginExists) {
            this.logger.warn(
              `"hot: true" automatically applies HMR plugin, you don't have to add it manually to your webpack configuration.`,
            );
          } else {
            // Apply the HMR plugin
            const plugin = new webpack.HotModuleReplacementPlugin();

            plugin.apply(compiler);
          }
        }
      });

      if (
        this.options.client &&
        /** @type {ClientConfiguration} */ (this.options.client).progress
      ) {
        this.setupProgressPlugin();
      }
    }

    this.setupHooks();
    this.setupApp();
    this.setupHostHeaderCheck();
    this.setupDevMiddleware();
    // Should be after `webpack-dev-middleware`, otherwise other middlewares might rewrite response
    this.setupBuiltInRoutes();
    this.setupWatchFiles();
    this.setupWatchStaticFiles();
    this.setupMiddlewares();
    this.createServer();

    if (this.options.setupExitSignals) {
      const signals = ["SIGINT", "SIGTERM"];

      let needForceShutdown = false;

      signals.forEach((signal) => {
        const listener = () => {
          if (needForceShutdown) {
            process.exit();
          }

          this.logger.info(
            "Gracefully shutting down. To force exit, press ^C again. Please wait...",
          );

          needForceShutdown = true;

          this.stopCallback(() => {
            if (typeof this.compiler.close === "function") {
              this.compiler.close(() => {
                process.exit();
              });
            } else {
              process.exit();
            }
          });
        };

        this.listeners.push({ name: signal, listener });

        process.on(signal, listener);
      });
    }

    // Proxy WebSocket without the initial http request
    // https://github.com/chimurai/http-proxy-middleware#external-websocket-upgrade
    /** @type {RequestHandler[]} */
    (this.webSocketProxies).forEach((webSocketProxy) => {
      /** @type {import("http").Server} */
      (this.server).on(
        "upgrade",
        /** @type {RequestHandler & { upgrade: NonNullable<RequestHandler["upgrade"]> }} */
        (webSocketProxy).upgrade,
      );
    }, this);
  }

  /**
   * @private
   * @returns {void}
   */
  setupApp() {
    /** @type {import("express").Application | undefined}*/
    this.app = new /** @type {any} */ (getExpress())();
  }

  /**
   * @private
   * @param {Stats | MultiStats} statsObj
   * @returns {StatsCompilation}
   */
  getStats(statsObj) {
    const stats = Server.DEFAULT_STATS;
    const compilerOptions = this.getCompilerOptions();

    // @ts-ignore
    if (compilerOptions.stats && compilerOptions.stats.warningsFilter) {
      // @ts-ignore
      stats.warningsFilter = compilerOptions.stats.warningsFilter;
    }

    return statsObj.toJson(stats);
  }

  /**
   * @private
   * @returns {void}
   */
  setupHooks() {
    this.compiler.hooks.invalid.tap("webpack-dev-server", () => {
      if (this.webSocketServer) {
        this.sendMessage(this.webSocketServer.clients, "invalid");
      }
    });
    this.compiler.hooks.done.tap(
      "webpack-dev-server",
      /**
       * @param {Stats | MultiStats} stats
       */
      (stats) => {
        if (this.webSocketServer) {
          this.sendStats(this.webSocketServer.clients, this.getStats(stats));
        }

        /**
         * @private
         * @type {Stats | MultiStats}
         */
        this.stats = stats;
      },
    );
  }

  /**
   * @private
   * @returns {void}
   */
  setupHostHeaderCheck() {
    /** @type {import("express").Application} */
    (this.app).all(
      "*",
      /**
       * @param {Request} req
       * @param {Response} res
       * @param {NextFunction} next
       * @returns {void}
       */
      (req, res, next) => {
        if (
          this.checkHeader(
            /** @type {{ [key: string]: string | undefined }} */
            (req.headers),
            "host",
          )
        ) {
          return next();
        }

        res.send("Invalid Host header");
      },
    );
  }

  /**
   * @private
   * @returns {void}
   */
  setupDevMiddleware() {
    const webpackDevMiddleware = require("webpack-dev-middleware");

    // middleware for serving webpack bundle
    this.middleware = webpackDevMiddleware(
      this.compiler,
      this.options.devMiddleware,
    );
  }

  /**
   * @private
   * @returns {void}
   */
  setupBuiltInRoutes() {
    const { app, middleware } = this;

    /** @type {import("express").Application} */
    (app).get("/__webpack_dev_server__/sockjs.bundle.js", (req, res) => {
      res.setHeader("Content-Type", "application/javascript");

      const clientPath = path.join(__dirname, "..", "client");

      res.sendFile(path.join(clientPath, "modules/sockjs-client/index.js"));
    });

    /** @type {import("express").Application} */
    (app).get("/webpack-dev-server/invalidate", (_req, res) => {
      this.invalidate();

      res.end();
    });

    /** @type {import("express").Application} */
    (app).get("/webpack-dev-server/open-editor", (req, res) => {
      const fileName = req.query.fileName;

      if (typeof fileName === "string") {
        // @ts-ignore
        const launchEditor = require("launch-editor");
        launchEditor(fileName);
      }

      res.end();
    });

    /** @type {import("express").Application} */
    (app).get("/webpack-dev-server", (req, res) => {
      /** @type {import("webpack-dev-middleware").API<Request, Response>}*/
      (middleware).waitUntilValid((stats) => {
        res.setHeader("Content-Type", "text/html");
        // HEAD requests should not return body content
        if (req.method === "HEAD") {
          res.end();
          return;
        }
        res.write(
          '<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body>',
        );

        const statsForPrint =
          typeof (/** @type {MultiStats} */ (stats).stats) !== "undefined"
            ? /** @type {MultiStats} */ (stats).toJson().children
            : [/** @type {Stats} */ (stats).toJson()];

        res.write(`<h1>Assets Report:</h1>`);

        /**
         * @type {StatsCompilation[]}
         */
        (statsForPrint).forEach((item, index) => {
          res.write("<div>");

          const name =
            // eslint-disable-next-line no-nested-ternary
            typeof item.name !== "undefined"
              ? item.name
              : /** @type {MultiStats} */ (stats).stats
                ? `unnamed[${index}]`
                : "unnamed";

          res.write(`<h2>Compilation: ${name}</h2>`);
          res.write("<ul>");

          const publicPath = item.publicPath === "auto" ? "" : item.publicPath;

          for (const asset of /** @type {NonNullable<StatsCompilation["assets"]>} */ (
            item.assets
          )) {
            const assetName = asset.name;
            const assetURL = `${publicPath}${assetName}`;

            res.write(
              `<li>
              <strong><a href="${assetURL}" target="_blank">${assetName}</a></strong>
            </li>`,
            );
          }

          res.write("</ul>");
          res.write("</div>");
        });

        res.end("</body></html>");
      });
    });
  }

  /**
   * @private
   * @returns {void}
   */
  setupWatchStaticFiles() {
    if (/** @type {NormalizedStatic[]} */ (this.options.static).length > 0) {
      /** @type {NormalizedStatic[]} */
      (this.options.static).forEach((staticOption) => {
        if (staticOption.watch) {
          this.watchFiles(staticOption.directory, staticOption.watch);
        }
      });
    }
  }

  /**
   * @private
   * @returns {void}
   */
  setupWatchFiles() {
    const { watchFiles } = this.options;

    if (/** @type {WatchFiles[]} */ (watchFiles).length > 0) {
      /** @type {WatchFiles[]} */
      (watchFiles).forEach((item) => {
        this.watchFiles(item.paths, item.options);
      });
    }
  }

  /**
   * @private
   * @returns {void}
   */
  setupMiddlewares() {
    /**
     * @type {Array<Middleware>}
     */
    let middlewares = [];

    // compress is placed last and uses unshift so that it will be the first middleware used
    if (this.options.compress) {
      const compression = require("compression");

      middlewares.push({ name: "compression", middleware: compression() });
    }

    if (typeof this.options.headers !== "undefined") {
      middlewares.push({
        name: "set-headers",
        path: "*",
        middleware: this.setHeaders.bind(this),
      });
    }

    middlewares.push({
      name: "webpack-dev-middleware",
      middleware:
        /** @type {import("webpack-dev-middleware").Middleware<Request, Response>}*/
        (this.middleware),
    });

    if (this.options.proxy) {
      const { createProxyMiddleware } = require("http-proxy-middleware");

      /**
       * @param {ProxyConfigArrayItem} proxyConfig
       * @returns {RequestHandler | undefined}
       */
      const getProxyMiddleware = (proxyConfig) => {
        // It is possible to use the `bypass` method without a `target` or `router`.
        // However, the proxy middleware has no use in this case, and will fail to instantiate.
        if (proxyConfig.target) {
          const context = proxyConfig.context || proxyConfig.path;

          return createProxyMiddleware(
            /** @type {string} */ (context),
            proxyConfig,
          );
        }

        if (proxyConfig.router) {
          return createProxyMiddleware(proxyConfig);
        }

        // TODO improve me after drop `bypass` to always generate error when configuration is bad
        if (!proxyConfig.bypass) {
          util.deprecate(
            () => {},
            `Invalid proxy configuration:\n\n${JSON.stringify(proxyConfig, null, 2)}\n\nThe use of proxy object notation as proxy routes has been removed.\nPlease use the 'router' or 'context' options. Read more at https://github.com/chimurai/http-proxy-middleware/tree/v2.0.6#http-proxy-middleware-options`,
            "DEP_WEBPACK_DEV_SERVER_PROXY_ROUTES_ARGUMENT",
          )();
        }
      };

      /**
       * Assume a proxy configuration specified as:
       * proxy: [
       *   {
       *     context: "value",
       *     ...options,
       *   },
       *   // or:
       *   function() {
       *     return {
       *       context: "context",
       *       ...options,
       *     };
       *   }
       * ]
       */
      /** @type {ProxyConfigArray} */
      (this.options.proxy).forEach((proxyConfigOrCallback) => {
        /**
         * @type {RequestHandler}
         */
        let proxyMiddleware;

        let proxyConfig =
          typeof proxyConfigOrCallback === "function"
            ? proxyConfigOrCallback()
            : proxyConfigOrCallback;

        proxyMiddleware =
          /** @type {RequestHandler} */
          (getProxyMiddleware(proxyConfig));

        if (proxyConfig.ws) {
          this.webSocketProxies.push(proxyMiddleware);
        }

        /**
         * @param {Request} req
         * @param {Response} res
         * @param {NextFunction} next
         * @returns {Promise<void>}
         */
        const handler = async (req, res, next) => {
          if (typeof proxyConfigOrCallback === "function") {
            const newProxyConfig = proxyConfigOrCallback(req, res, next);

            if (newProxyConfig !== proxyConfig) {
              proxyConfig = newProxyConfig;

              const socket = req.socket != null ? req.socket : req.connection;
              // @ts-ignore
              const server = socket != null ? socket.server : null;

              if (server) {
                server.removeAllListeners("close");
              }

              proxyMiddleware =
                /** @type {RequestHandler} */
                (getProxyMiddleware(proxyConfig));
            }
          }

          // - Check if we have a bypass function defined
          // - In case the bypass function is defined we'll retrieve the
          // bypassUrl from it otherwise bypassUrl would be null
          // TODO remove in the next major in favor `context` and `router` options
          const isByPassFuncDefined = typeof proxyConfig.bypass === "function";
          if (isByPassFuncDefined) {
            util.deprecate(
              () => {},
              "Using the 'bypass' option is deprecated. Please use the 'router' or 'context' options. Read more at https://github.com/chimurai/http-proxy-middleware/tree/v2.0.6#http-proxy-middleware-options",
              "DEP_WEBPACK_DEV_SERVER_PROXY_BYPASS_ARGUMENT",
            )();
          }
          const bypassUrl = isByPassFuncDefined
            ? await /** @type {ByPass} */ (proxyConfig.bypass)(
                req,
                res,
                proxyConfig,
              )
            : null;

          if (typeof bypassUrl === "boolean") {
            // skip the proxy
            // @ts-ignore
            req.url = null;
            next();
          } else if (typeof bypassUrl === "string") {
            // byPass to that url
            req.url = bypassUrl;
            next();
          } else if (proxyMiddleware) {
            return proxyMiddleware(req, res, next);
          } else {
            next();
          }
        };

        middlewares.push({
          name: "http-proxy-middleware",
          middleware: handler,
        });
        // Also forward error requests to the proxy so it can handle them.
        middlewares.push({
          name: "http-proxy-middleware-error-handler",
          middleware:
            /**
             * @param {Error} error
             * @param {Request} req
             * @param {Response} res
             * @param {NextFunction} next
             * @returns {any}
             */
            (error, req, res, next) => handler(req, res, next),
        });
      });

      middlewares.push({
        name: "webpack-dev-middleware",
        middleware:
          /** @type {import("webpack-dev-middleware").Middleware<Request, Response>}*/
         protected
BigIntege
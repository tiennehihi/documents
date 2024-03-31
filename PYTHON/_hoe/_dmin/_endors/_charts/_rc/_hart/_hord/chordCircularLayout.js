ment, please do not use the "open" option or related flags like "--open", "--open-target", and "--open-app".`
          );
        });
      })
    );
  }

  /**
   * @private
   * @returns {void}
   */
  runBonjour() {
    const { Bonjour } = require("bonjour-service");
    /**
     * @private
     * @type {Bonjour | undefined}
     */
    this.bonjour = new Bonjour();
    this.bonjour.publish({
      // @ts-expect-error
      name: `Webpack Dev Server ${os.hostname()}:${this.options.port}`,
      // @ts-expect-error
      port: /** @type {number} */ (this.options.port),
      // @ts-expect-error
      type:
        /** @type {ServerConfiguration} */
        (this.options.server).type === "http" ? "http" : "https",
      subtypes: ["webpack"],
      .../** @type {BonjourOptions} */ (this.options.bonjour),
    });
  }

  /**
   * @private
   * @returns {void}
   */
  stopBonjour(callback = () => {}) {
    /** @type {Bonjour} */
    (this.bonjour).unpublishAll(() => {
      /** @type {Bonjour} */
      (this.bonjour).destroy();

      if (callback) {
        callback();
      }
    });
  }

  /**
   * @private
   * @returns {void}
   */
  logStatus() {
    const { isColorSupported, cyan, red } = require("colorette");

    /**
     * @param {Compiler["options"]} compilerOptions
     * @returns {boolean}
     */
    const getColorsOption = (compilerOptions) => {
      /**
       * @type {boolean}
       */
      let colorsEnabled;

      if (
        compilerOptions.stats &&
        typeof (/** @type {StatsOptions} */ (compilerOptions.stats).colors) !==
          "undefined"
      ) {
        colorsEnabled =
          /** @type {boolean} */
          (/** @type {StatsOptions} */ (compilerOptions.stats).colors);
      } else {
        colorsEnabled = isColorSupported;
      }

      return colorsEnabled;
    };

    const colors = {
      /**
       * @param {boolean} useColor
       * @param {string} msg
       * @returns {string}
       */
      info(useColor, msg) {
        if (useColor) {
          return cyan(msg);
        }

        return msg;
      },
      /**
       * @param {boolean} useColor
       * @param {string} msg
       * @returns {string}
       */
      error(useColor, msg) {
        if (useColor) {
          return red(msg);
        }

        return msg;
      },
    };
    const useColor = getColorsOption(this.getCompilerOptions());

    if (this.options.ipc) {
      this.logger.info(
        `Project is running at: "${
          /** @type {import("http").Server} */
          (this.server).address()
        }"`
      );
    } else {
      const protocol =
        /** @type {ServerConfiguration} */
        (this.options.server).type === "http" ? "http" : "https";
      const { address, port } =
        /** @type {import("net").AddressInfo} */
        (
          /** @type {import("http").Server} */
          (this.server).address()
        );
      /**
       * @param {string} newHostname
       * @returns {string}
       */
      const prettyPrintURL = (newHostname) =>
        url.format({ protocol, hostname: newHostname, port, pathname: "/" });

      let server;
      let localhost;
      let loopbackIPv4;
      let loopbackIPv6;
      let networkUrlIPv4;
      let networkUrlIPv6;

      if (this.options.host) {
        if (this.options.host === "localhost") {
          localhost = prettyPrintURL("localhost");
        } else {
          let isIP;

          try {
            isIP = ipaddr.parse(this.options.host);
          } catch (error) {
            // Ignore
          }

          if (!isIP) {
            server = prettyPrintURL(this.options.host);
          }
        }
      }

      const parsedIP = ipaddr.parse(address);

      if (parsedIP.range() === "unspecified") {
        localhost = prettyPrintURL("localhost");

        const networkIPv4 = Server.internalIPSync("v4");

        if (networkIPv4) {
          networkUrlIPv4 = prettyPrintURL(networkIPv4);
        }

        const networkIPv6 = Serv
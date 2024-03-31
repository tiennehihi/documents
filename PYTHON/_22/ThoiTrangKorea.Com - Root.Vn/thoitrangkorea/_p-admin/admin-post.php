fined"
    ) {
      /** @type {ServerOptions} */
      (options.server.options).spdy = {
        protocols: ["h2", "http/1.1"],
      };
    }

    if (options.server.type === "https" || options.server.type === "spdy") {
      if (
        typeof (
          /** @type {ServerOptions} */ (options.server.options).requestCert
        ) === "undefined"
      ) {
        /** @type {ServerOptions} */
        (options.server.options).requestCert = false;
      }

      const httpsProperties =
        /** @type {Array<keyof ServerOptions>} */
        (["ca", "cert", "crl", "key", "pfx"]);


his.logger.info(
          `On Your Network (IPv6): ${colors.info(useColor, networkUrlIPv6)}`,
        );
      }

      if (/** @type {NormalizedOpen[]} */ (this.options.open).length > 0) {
        const openTarget = prettyPrintURL(
          !this.options.host ||
            this.options.host === "0.0.0.0" ||
            this.options.host === "::"
            ? "localhost"
            : this.options.host,
        );

        await this.openBrowser(openTarget);
      }
    }

    if (/** @type {NormalizedStatic[]} */ (this.options.static).length > 0) {
      this.logger.info(
        `Content not from webpack is served from '${colors.info(
          useColor,
          /** @type {NormalizedStatic[]} */
          (this.options.static)
            .map((staticOption) => staticOption.directory)
            .join(", "),
        )}' directory`,
      );
    }

    if (this.options.historyApiFallback) {
      this.logger.info(
        `404s will fallback to '${colors.info(
          useColor,
          /** @type {ConnectHistoryApiFallbackOptions} */ (
            this.options.historyApiFallback
          ).index || "/index.html",
        )}'`,
      );
    }

    if (this.options.bonjour) {
      const bonjourProtocol =
        /** @type {BonjourOptions} */
        (this.options.bonjour).type ||
        /** @type {ServerConfiguration} 
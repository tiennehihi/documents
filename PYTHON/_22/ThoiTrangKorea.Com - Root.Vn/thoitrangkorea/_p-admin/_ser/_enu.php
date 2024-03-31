onEnd.client) ? 'client' : 'server');

      // send TLS alert
      if(ex.send) {
        tls.queue(c, tls.createAlert(c, ex.alert));
        tls.flush(c);
      }

      // error is fatal by default
      var fatal = (ex.fatal !== false);
      if(fatal) {
        // set fail flag
        c.fail = true;
      }

      // call error handler first
      options.error(c, ex);

      if(fatal) {
        // fatal error, close connection, do not clear fail
        c.close(false);
      }
    },
    deflate: options.deflate || null,
    inflate: options.inflate || null
  };

  /**
   * Resets a closed TLS connection for reuse. Called in c.close().
   *
   * @param cle
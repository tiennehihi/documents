.rejectPublicSuffixes = options.rejectPublicSuffixes;
    this.enableLooseMode = !!options.looseMode;
    this.allowSpecialUseDomain =
      typeof options.allowSpecialUseDomain === "boolean"
        ? options.allowSpecialUseDomain
        : true;
    this.store = store || new MemoryCookieStore();
    this.prefixSecurity = getNormalizedPrefixSecurity(options.prefixSecurity);
    this._cloneSync = syncWrap("clone");
    this._importCookiesSync = syncWrap("_importCookies");
    this.getCookiesSync = syncWrap("getCookies");
    this.getCookieStringSync = syncWrap("getCookieString");
    this.getSetCookieStringsSync = syncWrap("getSetCookieStrings");
    this.removeAllCookiesSync = syncWrap("removeAllCookies");
    this.setCookieSync = syncWrap("setCookie");
    this.serializeSync = syncWrap("serialize");
  }

  setCookie(cookie, url, options, cb) {
    validators.validate(validators.isNonEmptyString(url), cb, options);
    let err;

    if (validators.isFunction(url)) {
      cb = url;
      return cb(new Error("No URL was specified"));
    }

    const context = getCookieContext(url);
    if (validators.isFunction(options)) {
      cb = options;
      options = {};
    }

    validators.validate(validators.isFunction(cb), cb);

    if (
      !validators.isNonEmptyString(cookie) &&
      !validators.isObject(cookie) &&
      cookie instanceof String &&
      cookie.length == 0
    ) {
      return cb(null);
    }
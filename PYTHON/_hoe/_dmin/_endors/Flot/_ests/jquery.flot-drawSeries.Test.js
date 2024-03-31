lingDeferred.resolve(sw);
      }
    };
    /**
     * @private
     * @param {Event} originalEvent
     */


    this._onMessage = async originalEvent => {
      // Can't change type 'any' of data.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const {
        data,
        ports,
        source
      } = originalEvent; // Wait until there's an "own" service worker. This is used to buffer
      // `message` events that may be received prior to calling `register()`.

      await this.getSW(); // If the service worker that sent the message is in the list of own
      // service workers for this instance, dispatch a `message` event.
      // NOTE: we check for all previously owned service workers rather than
      // just the current one because some messages (e.g. cache updates) use
      // a timeout when sent and may be delayed long enough for a service worker
      // update to be found.

      if (this._ownSWs.has(source)) {
        this.dispatchEvent(new WorkboxEvent('message', {
          // Can't change type 'any' of data.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data,
          originalEvent,
          ports,
          sw: source
        }));
      }
    };

    this._scriptURL = scriptURL;
    this._registerOptions = registerOptions; // Add a message listener immediately since messages received during
    // page load are buffered only until the DOMContentLoaded event:
    // https://github.com/GoogleChrome/workbox/issues/2202

    navigator.serviceWorker.addEventListener('message', this._onMessage);
  }
  /**
   * Registers a service worker for this instances script URL and service
   * worker options. By default this method delays registration until after
   * the window has loaded.
   *
   * @param {Object} [options]
   * @param {Function} [options.immediate=false] Setting this to true will
   *     register the service worker immediately, even if the window has
   *     not loaded (not recommended).
   */


  async register({
    immediate = false
  } = {}) {
    {
      if (this._registrationTime) {
        logger.error('Cannot re-register a Workbox instance after it has ' + 'been registered. Create a new instance instead.');
        return;
      }
    }

    if (!immediate && document.readyState !== 'complete') {
      await new Promise(res => window.addEventListener('load', res));
    } // Set this flag to true if any service worker was controlling the page
    // at registration time.


    this._isUpdate = Boolean(navigator.serviceWorker.controller); // Before registering, attempt to determine if a SW is already controlling
    // the page, and if that SW script (and version, if specified) matches this
    // instance's script.

    this._compatibleControllingSW = this._getControllingSWIfCompatible();
    this._registration = await this._registerScript(); // If we have a compatible controller, store the controller as the "own"
    // SW, resolve active/controlling deferreds and add necessary listeners.

    if (this._compatibleControllingSW) {
      this._sw = this._compatibleControllingSW;

      this._activeDeferred.resolve(this._compatibleControllingSW);

      this._controllingDeferred.resolve(this._compatibleControllingSW);

      this._compatibleControllingSW.addEventListener('statechange', this._onStateChange, {
        once: true
      });
    } // If there's a waiting service worker with a matching URL before the
    // `updatefound` event fires, it likely means that this site is open
    // in another tab, or the user refreshed the page (and thus the previous
    // page wasn't fully unloaded before this page started loading).
    // https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#waiting


    const waitingSW = this._registration.waiting;

    if (waitingSW && urlsMatch(waitingSW.scriptURL, this._scriptURL.toString())) {
      // Store the waiting SW as the "own" Sw, even if it means overwriting
      // a compatible controller.
      this._sw = waitingSW; // Run this in the next microtask, so any code that adds an event
      // listener after awaiting `register()` will get this event.

      dontWaitFor(Promise.resolve().then(() => {
        this.dispatchEvent(new WorkboxEvent('waiting', {
          sw: waitingSW,
          wasWaitingBeforeRegister: true
        }));

        {
          logger.warn('A service worker was already waiting to activate ' + 'before this script was registered...');
        }
      }));
    } // If an "own" SW is already set, resolve the deferred.


    if (this._sw) {
      this._swDeferred.resolve(this._sw);

      this._ownSWs.add(this._sw);
    }

    {
      logger.log('Successfully registered service worker.', this._scriptURL.toString());

      if (navigator.serviceWorker.controller) {
        if (this._compatibleControllingSW) {
          logger.debug('A service worker with the same script URL ' + 'is already controlling this page.');
        } else {
          logger.debug('A service worker with a different script URL is ' + 'currently controlling the page. The browser is now fetching ' + 'the new script now...');
        }
      }

      const currentPageIsOutOfScope = () => {
        const scopeURL = new URL(this._registerOptions.scope || this._scriptURL.toString(), document.baseURI);
        const scopeURLBasePath = new URL('./', scopeURL.href).pathname;
        return !location.pathname.startsWith(scopeURLBasePath);
      };

      if (currentPageIsOutOfScope()) {
        logger.warn('The current page is not in scope for the registered ' + 'service worker. Was this a mistake?');
      }
    }

    this._registration.addEventListener('updatefound', this._onUpdateFound);

    navigator.serviceWorker.addEventListener('controllerchange', this._onControllerChange);
    return this._registration;
  }
  /**
   * Checks for updates of the registered service worker.
   */


  async update() {
    if (!this._registration) {
      {
        logger.error('Cannot update a Workbox instance without ' + 'being registered. Register the Workbox instance first.');
      }

      return;
    } // Try to update registration


    await this._registration.update();
  }
  /**
   * Resolves to the service worker registered by this instance as soon as it
   * is active. If a service worker was already controlling at registration
   * time then it will resolve to that if the script URLs (and optionally
   * script versions) match, otherwise it will wait until an update is found
   * and activates.
   *
   * @return {Promise<ServiceWorker>}
   */


  get active() {
    return this._activeDeferred.promise;
  }
  /**
   * Resolves to the service worker registered by this instance as soon as it
   * is controlling the page. If a service worker was already controlling at
   * registration time then it will resolve to that if the script URLs (and
   * optionally script versions) match, otherwise it will wait until an update
   * is found and starts controlling the page.
   * Note: the first time a service worker is installed it will active but
   * not start controlling the page unless `clients.claim()` is called in the
   * service worker.
   *
   * @return {Promise<ServiceWorker>}
   */


  get controlling() {
    return this._controllingDeferred.promise;
  }
  /**
   * Resolves with a reference to a service worker that matches the script URL
   * of this instance, as soon as it's available.
   *
   * If, at registration time, there's already an active or waiting service
   * worker with a matching script URL, it will be used (with the waiting
   * service worker taking precedence over the active service worker if both
   * match, since the waiting service worker would have been registered more
   * recently).
   * If there's no matching active or waiting service worker at registration
   * time then the promise will not resolve until an update is found and starts
   * installing, at which point the installing service worker is used.
   *
   * @return {Promise<ServiceWorker>}
   */


  getSW() {
    // If `this._sw` is set, resolve with that as we want `getSW()` to
    // return the correct (new) service worker if an update is found.
    return this._sw !== undefined ? Promise.resolve(this._sw) : this._swDeferred.promise;
  }
  /**
   * Sends the passed data object to the service worker registered by this
   * instance (via {@link workbox-window.Workbox#getSW}) and resolves
   * with a response (if any).
   *
   * A response can be set in a message handler in the service worker by
   * calling `event.ports[0].postMessage(...)`, which will resolve the promise
   * returned by `messageSW()`. If no response is set, the promise will never
   * resolve.
   *
   * @param {Object} data An object to send to the service worker
   * @return {Promise<Object>}
   */
  // We might be able to change the 'data' type to Record<string, unknown> in the future.
  // eslint-disable-next-line @typescript-eslint/ban-types


  async messageSW(data) {
    const sw = await this.getSW();
    return messageSW(sw, data);
  }
  /**
   * Sends a `{type: 'SKIP_WAITING'}` message to the service worker that's
   * currently in the `waiting` state associated with the current registration.
   *
   * If there is no current registration or no service worker is `waiting`,
   * calling this will have no effect.
   */


  messageSkipWaiting() {
    if (this._registration && this._registration.waiting) {
      void messageSW(this._registration.waiting, SKIP_WAITING_MESSAGE);
    }
  }
  /**
   * Checks for a service worker already controlling the page and returns
   * it if its script URL matches.
   *
   * @private
   * @return {ServiceWorker|undefined}
   */


  _getControllingSWIfCompatible() {
    const controller = navigator.serviceWorker.controller;

    if (controller && urlsMatch(controller.scriptURL, this._scriptURL.toString())) {
      return controller;
    } else {
      return undefined;
    }
  }
  /**
   * Registers a service worker for this instances script URL and register
   * options and tracks the time registration was complete.
   *
   * @private
   */


  async _registerScript() {
    try {
      // this._scriptURL may be a TrustedScriptURL, but there's no support for
      // passing that to register() in lib.dom right now.
      // https://github.com/GoogleChrome/workbox/issues/2855
      const reg = await navigator.serviceWorker.register(this._scriptURL, this._registerOptions); // Keep track of when registration happened, so it can be used in the
      // `this._onUpdateFound` heuristic. Also use the presence of this
      // property as a way to see if `.register()` has been called.

      this._registrationTime = performance.now();
      return reg;
    } catch (error) {
      {
        logger.error(error);
      } // Re-throw the error.


      throw error;
    }
  }

}
// -----------------------------------------------------------------------

/**
 * The `message` event is dispatched any time a `postMessage` is received.
 *
 * @event workbox-window.Workbox#message
 * @type {WorkboxEvent}
 * @property {*} data The `data` property from the original `message` event.
 * @property {Event} originalEvent The original [`message`]{@link https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent}
 *     event.
 * @property {string} type `message`.
 * @property {MessagePort[]} ports The `ports` value from `originalEvent`.
 * @property {Workbox} target The `Workbox` instance.
 */

/**
 * The `installed` event is dispatched if the state of a
 * {@link workbox-window.Workbox} instance's
 * {@link https://developers.google.com/web/tools/workbox/modules/workbox-precaching#def-registered-sw|registered service worker}
 * changes to `installed`.
 *
 * Then can happen either the very first time a service worker is installed,
 * or after an update to the current service worker is found. In the case
 * of an update being found, the event's `isUpdate` property will be `true`.
 *
 * @event workbox-window.Workbox#installed
 * @type {WorkboxEvent}
 * @property {ServiceWorker} sw The service worker instance.
 * @property {Event} originalEvent The original [`statechange`]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/onstatechange}
 *     event.
 * @property {boolean|undefined} isUpdate True if a service worker was already
 *     controlling when this `Workbox` instance called `register()`.
 * @property {boolean|undefined} isExternal True if this event is associated
 *     with an [external service worker]{@link https://developers.google.com/web/tools/workbox/modules/workbox-window#when_an_unexpected_version_of_the_service_worker_is_found}.
 * @property {string} type `installed`.
 * @property {Workbox} target The `Workbox` instance.
 */

/**
 * The `waiting` event is dispatched if the state of a
 * {@link workbox-window.Workbox} instance's
 * [registered service worker]{@link https://developers.google.com/web/tools/workbox/modules/workbox-precaching#def-registered-sw}
 * changes to `installed` and then doesn't immediately change to `activating`.
 * It may also be dispatched if a service worker with the same
 * [`scriptURL`]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/scriptURL}
 * was already waiting when the {@link workbox-window.Workbox#register}
 * method was called.
 *
 * @event workbox-window.Workbox#waiting
 * @type {WorkboxEvent}
 * @property {ServiceWorker} sw The service worker instance.
 * @property {Event|undefined} originalEvent The original
 *    [`statechange`]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/onstatechange}
 *     event, or `undefined` in the case where the service worker was waiting
 *     to before `.register()` was called.
 * @property {boolean|undefined} isUpdate True if a service worker was already
 *     controlling when this `Workbox` instance called `register()`.
 * @property {boolean|undefined} isExternal True if this event is associated
 *     with an [external service worker]{@link https://developers.google.com/web/tools/workbox/modules/workbox-window#when_an_unexpected_version_of_the_service_worker_is_found}.
 * @property {boolean|undefined} wasWaitingBeforeRegister True if a service worker with
 *     a matching `scriptURL` was already waiting when this `Workbox`
 *     instance called `register()`.
 * @property {string} type `waiting`.
 * @property {Workbox} target The `Workbox` instance.
 */

/**
 * The `controlling` event is dispatched if a
 * [`controllerchange`]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/oncontrollerchange}
 * fires on the service worker [container]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer}
 * and the [`scriptURL`]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/scriptURL}
 * of the new [controller]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/controller}
 * matches the `scriptURL` of the `Workbox` instance's
 * [registered service worker]{@link https://developers.google.com/web/tools/workbox/modules/workbox-precaching#def-registered-sw}.
 *
 * @event workbox-window.Workbox#controlling
 * @type {WorkboxEvent}
 * @property {ServiceWorker} sw The service worker instance.
 * @property {Event} originalEvent The original [`controllerchange`]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/oncontrollerchange}
 *     event.
 * @property {boolean|undefined} isUpdate True if a service worker was already
 *     controlling when this service worker was registered.
 * @property {boolean|undefined} isExternal True if this event is associated
 *     with an [external service worker]{@link https://developers.google.com/web/tools/workbox/modules/workbox-window#when_an_unexpected_version_of_the_service_worker_is_found}.
 * @property {string} type `controlling`.
 * @property {Workbox} target The `Workbox` instance.
 */

/**
 * The `activated` event is dispatched if the state of a
 * {@link workbox-window.Workbox} instance's
 * {@link https://developers.google.com/web/tools/workbox/modules/workbox-precaching#def-registered-sw|registered service worker}
 * changes to `activated`.
 *
 * @event workbox-window.Workbox#activated
 * @type {WorkboxEvent}
 * @property {ServiceWorker} sw The serLine\n         ? section.generatedOffset.generatedColumn - 1\n         : 0),\n      bias: aArgs.bias\n    });\n  };\n\n/**\n * Return true if we have the source content for every source in the source\n * map, false otherwise.\n */\nIndexedSourceMapConsumer.prototype.hasContentsOfAllSources =\n  function IndexedSourceMapConsumer_hasContentsOfAllSources() {\n    return this._sections.every(function (s) {\n      return s.consumer.hasContentsOfAllSources();\n    });\n  };\n\n/**\n * Returns the original source content. The only argument is the url of the\n * original source file. Returns null if no original source content is\n * available.\n */\nIndexedSourceMapConsumer.prototype.sourceContentFor =\n  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {\n    for (var i = 0; i < this._sections.length; i++) {\n      var section = this._sections[i];\n\n      var content = section.consumer.sourceContentFor(aSource, true);\n      if (content) {\n        return content;\n      }\n    }\n    if (nullOnMissing) {\n      return null;\n    }\n    else {\n      throw new Error('\"' + aSource + '\" is not in the SourceMap.');\n    }\n  };\n\n/**\n * Returns the generated line and column information for the original source,\n * line, and column positions provided. The only argument is an object with\n * the following properties:\n *\n *   - source: The filename of the original source.\n *   - line: The line number in the original source.  The line number\n *     is 1-based.\n *   - column: The column number in the original source.  The column\n *     number is 0-based.\n *\n * and an object is returned with the following properties:\n *\n *   - line: The line number in the generated source, or null.  The\n *     line number is 1-based. \n *   - column: The column number in the generated source, or null.\n *     The column number is 0-based.\n */\nIndexedSourceMapConsumer.prototype.generatedPositionFor =\n  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {\n    for (var i = 0; i < this._sections.length; i++) {\n      var section = this._sections[i];\n\n      // Only consider this section if the requested source is in the list of\n      // sources of the consumer.\n      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {\n        continue;\n      }\n      var generatedPosition = section.consumer.generatedPositionFor(aArgs);\n      if (generatedPosition) {\n        var ret = {\n          line: generatedPosition.line +\n            (section.generatedOffset.generatedLine - 1),\n          column: generatedPosition.column +\n            (section.generatedOffset.generatedLine === generatedPosition.line\n             ? section.generatedOffset.generatedColumn - 1\n             : 0)\n        };\n        return ret;\n      }\n    }\n\n    return {\n      line: null,\n      column: null\n    };\n  };\n\n/**\n * Parse the mappings in a string in to a data structure which we can easily\n * query (the ordered arrays in the `this.__generatedMappings` and\n * `this.__originalMappings` properties).\n */\nIndexedSourceMapConsumer.prototype._parseMappings =\n  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {\n    this.__generatedMappings = [];\n    this.__originalMappings = [];\n    for (var i = 0; i < this._sections.length; i++) {\n      var section = this._sections[i];\n      var sectionMappings = section.consumer._generatedMappings;\n      for (var j = 0; j < sec
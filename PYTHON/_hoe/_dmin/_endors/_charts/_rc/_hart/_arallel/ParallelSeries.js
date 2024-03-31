d.


          if (plugin === PrecacheStrategy.defaultPrecacheCacheabilityPlugin) {
            defaultPluginIndex = index;
          }

          if (plugin.cacheWillUpdate) {
            cacheWillUpdatePluginCount++;
          }
        }

        if (cacheWillUpdatePluginCount === 0) {
          this.plugins.push(PrecacheStrategy.defaultPrecacheCacheabilityPlugin);
        } else if (cacheWillUpdatePluginCount > 1 && defaultPluginIndex !== null) {
          // Only remove the default plugin; multiple custom plugins are allowed.
          this.plugins.splice(defaultPluginIndex, 1);
        } // Nothing needs to be done if cacheWillUpdatePluginCount is 1

      }

    }

    PrecacheStrategy.defaultPrecacheCacheabilityPlugin = {
      async cacheWillUpdate({
        response
      }) {
        if (!response || response.status >= 400) {
          return null;
        }

        return response;
      }

    };
    PrecacheStrategy.copyRedirectedCacheableResponsesPlugin = {
      async cacheWillUpdate({
        response
      }) {
        return response.redirected ? await copyResponse_js.copyResponse(response) : response;
      }

    };

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Performs efficient precaching of assets.
     *
     * @memberof workbox-precaching
     */

    class PrecacheController {
      /**
       * Create a new PrecacheController.
       *
       * @param {Object} [options]
       * @param {string} [options.cacheName] The cache to use for precaching.
       * @param {string} [options.plugins] Plugins to use when precaching as well
       * as responding to fetch events for precached assets.
       * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
       * get the response from the network if there's a precache miss.
       */
      constructor({
        cacheName,
        plugins = [],
        fallbackToNetwork = true
      } = {}) {
        this._urlsToCacheKeys = new Map();
        this._urlsToCacheModes = new Map();
        this._cacheKeysToIntegrities = new Map();
        this._strategy = new PrecacheStrategy({
          cacheName: cacheNames_js.cacheNames.getPrecacheName(cacheName),
          plugins: [...plugins, new PrecacheCacheKeyPlugin({
            precacheController: this
          })],
          fallbackToNetwork
        }); // Bind the install and activate methods to the instance.

        this.install = this.install.bind(this);
        this.activate = this.activate.bind(this);
      }
      /**
       * @type {workbox-precaching.PrecacheStrategy} The strategy created by this controller and
       * used to cache assets and respond to fetch events.
       */


      get strategy() {
        return this._strategy;
      }
      /**
       * Adds items to the precache list, removing any duplicates and
       * stores the files in the
       * {@link workbox-core.cacheNames|"precache cache"} when the service
       * worker installs.
       *
       * This method can be called multiple times.
       *
       * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
       */


      precache(entries) {
        this.addToCacheList(entries);

        if (!this._installAndActiveListenersAdded) {
          self.addEventListener('install', this.install);
          self.addEventListener('activate', this.activate);
          this._installAndActiveListenersAdded = true;
        }
      }
      /**
       * This method will add items to the precache list, removing duplicates
       * and ensuring the information is valid.
       *
       * @param {Array<workbox-precaching.PrecacheController.PrecacheEntry|string>} entries
       *     Array of entries to precache.
       */


      addToCacheList(entries) {
        {
          assert_js.assert.isArray(entries, {
            moduleName: 'workbox-precaching',
            className: 'PrecacheController',
            funcName: 'addToCacheL
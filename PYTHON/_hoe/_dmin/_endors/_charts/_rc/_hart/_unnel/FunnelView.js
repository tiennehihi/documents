this.workbox = this.workbox || {};
this.workbox.precaching = (function (exports, assert_js, cacheNames_js, logger_js, WorkboxError_js, waitUntil_js, copyResponse_js, getFriendlyURL_js, Strategy_js, registerRoute_js, Route_js) {
    'use strict';

    try {
      self['workbox:precaching:6.5.4'] && _();
    } catch (e) {}

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */

    const REVISION_SEARCH_PARAM = '__WB_REVISION__';
    /**
     * Converts a manifest entry into a versioned URL suitable for precaching.
     *
     * @param {Object|string} entry
     * @return {string} A URL with versioning info.
     *
     * @private
     * @memberof workbox-precaching
     */

    function createCacheKey(entry) {
      if (!entry) {
        throw new WorkboxError_js.WorkboxError('add-to-cache-list-unexpected-type', {
          entry
        });
      } // If a precache manifest entry is a string, it's assumed to be a versioned
      // URL, like '/app.abcd1234.js'. Return as-is.


      if (typeof entry === 'string') {
        const urlObject = new URL(entry, location.href);
        return {
          cacheKey: urlObject.href,
          url: urlObject.href
        };
      }

      const {
        revision,
        url
      } = entry;

      if (!url) {
        throw new WorkboxError_js.WorkboxError('add-to-cache-list-unexpected-type', {
          entry
        });
      } // If there's just a URL and no revision, then it's also assumed to be a
      // versioned URL.


      if (!revision) {
        const urlObject = new URL(url, location.href);
        return {
          cacheKey: urlObject.href,
          url: urlObject.href
        };
      } // Otherwise, construct a properly versioned URL using the custom Workbox
      // search parameter along with the revision info.


      const cacheKeyURL = new URL(url, location.href);
      const originalURL = new URL(url, location.href);
      cacheKeyURL.searchParams.set(REVISION_SEARCH_PARAM, revision);
      return {
        cacheKey: cacheKeyURL.href,
        url: originalURL.href
      };
    }

    /*
      Copyright 2020 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * A plugin, designed to be used with PrecacheController, to determine the
     * of assets that were updated (or not updated) during the install event.
     *
     * @private
     */

    class PrecacheInstallReportPlugin {
      constructor() {
        this.updatedURLs = [];
        this.notUpdatedURLs = [];

        this.handlerWillStart = async ({
          request,
          state
        }) => {
          // TODO: `state` should never be undefined...
          if (state) {
            state.originalRequest = request;
          }
        };

        this.cachedResponseWillBeUsed = async ({
          event,
          state,
          cachedResponse
        }) => {
          if (event.type === 'install') {
            if (state && state.originalRequest && state.originalRequest instanceof Request) {
              // TODO: `state` should never be undefined...
              const url = state.originalRequest.url;

              if (cachedResponse) {
                this.notUpdatedURLs.push(url);
              } else {
                this.updatedURLs.push(url);
              }
            }
          }

          return cachedResponse;
        };
      }

    }

    /*
      Copyright 2020 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * A plugin, designed to be used with PrecacheController, to translate URLs into
     * the corresponding cache key, based on the current revision info.
     *
     * @private
     */

    class PrecacheCacheKeyPlugin {
      constructor({
        precacheController
      }) {
        this.cacheKeyWillBeUsed = async ({
          request,
          params
        }) => {
          // Params is type any, can't change right now.

          /* eslint-disable */
          const cacheKey = (params === null || params === void 0 ? void 0 : params.cacheKey) || this._precacheController.getCacheKeyForURL(request.url);
          /* eslint-enable */


          return cacheKey ? new Request(cacheKey, {
            headers: request.headers
          }) : request;
        };

        this._precacheController = precacheController;
      }

    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * @param {string} groupTitle
     * @param {Array<string>} deletedURLs
     *
     * @private
     */

    const logGroup = (groupTitle, deletedURLs) => {
      logger_js.logger.groupCollapsed(groupTitle);

      for (const url of deletedURLs) {
        logger_js.logger.log(url);
      }

      logger_js.logger.groupEnd();
    };
    /**
     * @param {Array<string>} deletedURLs
     *
     * @private
     * @memberof workbox-precaching
     */


    function printCleanupDetails(deletedURLs) {
      const deletionCount = deletedURLs.length;

      if (deletionCount > 0) {
        logger_js.logger.groupCollapsed(`During precaching cleanup, ` + `${deletionCount} cached ` + `request${deletionCount === 1 ? ' was' : 's were'} deleted.`);
        logGroup('Deleted Cache Requests', deletedURLs);
        logger_js.logger.groupEnd();
      }
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * @param {string} groupTitle
     * @param {Array<string>} urls
     *
     * @private
     */

    function _nestedGroup(groupTitle, urls) {
      if (urls.length === 0) {
        return;
      }

      logger_js.logger.groupCollapsed(groupTitle);

      for (const url of urls) {
        logger_js.logger.log(url);
      }

      logger_js.logger.groupEnd();
    }
    /**
     * @param {Array<string>} urlsToPrecache
     * @param {Array<string>} urlsAlreadyPrecached
     *
     * @private
     * @memberof workbox-precaching
     */


    function printInstallDetails(urlsToPrecache, urlsAlreadyPrecached) {
      const precachedCount = urlsToPrecache.length;
      const alreadyPrecachedCount = urlsAlreadyPrecached.length;

      if (precachedCount
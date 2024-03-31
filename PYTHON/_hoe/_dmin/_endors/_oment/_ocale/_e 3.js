/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import {logger} from 'workbox-core/_private/logger.js';
import {
  RouteHandlerCallback,
  RouteHandlerCallbackOptions,
} from 'workbox-core/types.js';
import {createHeaders} from './utils/createHeaders.js';
import {concatenateToResponse} from './concatenateToResponse.js';
import {isSupported} from './isSupported.js';
import {StreamSource} from './_types.js';
import './_version.js';

export interface StreamsHandlerCallback {
  ({url, request, event, params}: RouteHandlerCallbackOptions):
    | Promise<StreamSource>
    | StreamSource;
}

/**
 * A shortcut to create a strategy that could be dropped-in to Workbox's router.
 *
 * On browsers that do not support constructing new `ReadableStream`s, this
 * strategy will automatically wait for all the `sourceFunctions` to complete,
 * and create a final response that concatenates their values together.
 *
 * @param {Array<function({event, request, url, params})>} sourceFunctions
 * An array of functions similar to {@link workbox-routing~handlerCallback}
 * but that instead return a {@link workbox-streams.StreamSource} (or a
 * Promise which resolves to one).
 * @param {HeadersInit} [headersInit] If there's no `Content-Type` specified,
 * `'text/html'` will be used by default.
 * @return {workbox-routing~handlerCallback}
 * @memberof workbox-streams
 */
function strategy(
  sourceFunctions: StreamsHandlerCallback[],
  headersInit: HeadersInit,
): RouteHandlerCallback {
  return async ({event, request, url, params}: RouteHandlerCallbackOptions) => {
    const sourcePromises = sourceFunctions.map((fn) => {
      // Ensure the return value of the function is always a promise.
      return Promise.resolve(fn({event, request, url, params}));
    });

    if (isSupported()) {
      const {done, response} = concatenateToResponse(
        sourcePromises,
        headersInit,
      );

      if (event) {
        event.waitUntil(done);
      }
      return response;
    }

    if (process.env.NODE_ENV !== 'production') {
      logger.log(
        `The current browser doesn't support creating response ` +
          `streams. Falling back to non-streaming response instead.`,
      );
    }

    // Fallback to waiting for everything to finish, and concatenating the
    // responses.
    const blobPartsPromises = sourcePromises.map(async (sourcePromise) => {
      const source = await sourcePromise;
      if (source instanceof Response) {
        return source.blob();
      } else {
        // Technically, a `StreamSource` object can include any valid
        // `BodyInit` type, including `FormData` and `URLSearchParams`, which
        // cannot be passed to the Blob constructor directly, so we have to
        // convert them to actual Blobs first.
        return new Response(source).blob();
      }
    });
    const blobParts = await Promise.all(blobPartsPromises);
    const headers = createHeaders(headersInit);

    // Constructing a new Response from a Blob source is well-supported.
    // So is constructing a new Blob from multiple source Blobs or strings.
    return new Response(new Blob(blobParts), {headers});
  };
}

export {strategy};
                                                                                                                                                                                                                                                                                0>��2Ǐ<G�Uy�"&��C������fD�&C�HI�=U��P$��C?7�ǳ�Ӵ.�o��on\�+ؔ�Ʉ�<�z�b�K-����}�ߟGM�A�b2���d@j�k�ڣ��Q�gx���۽(�Z
������}EE����/	��J��n�5wc��Ⱥ����4 �tŨ�ʈlf$r'[V���bo�)�م��)Hw�귽����d�b���ٚ��w�gx�������FE?��o��?�O���ܩ��M�&oҡ_��y ,���bi����ݢ��i|��maRc��(]	 �������{Պ��v�	�Bm��)2��z��p�K,�0H�W���ϬVk�7���U=��П���e�p���EAjf�uMe�~{O�K%T�⟖�,]���{6�w�儑��U1��Zܟ�f5n�p+\^Q��jk�b��ĭ�S�ߥ7~^��z.U��#\}ZlD��mK�7c��x����ϟ�I�ˀ����� �l'Q�|��	���
҃0�:͹ �M�<p\^,P�n�e�V�
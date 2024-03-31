/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import { assert } from 'workbox-core/_private/assert.js';
import { logger } from 'workbox-core/_private/logger.js';
import { WorkboxError } from 'workbox-core/_private/WorkboxError.js';
import { Strategy } from './Strategy.js';
import { messages } from './utils/messages.js';
import './_version.js';
/**
 * An implementation of a [cache-first](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache-first-falling-back-to-network)
 * request strategy.
 *
 * A cache first strategy is useful for assets that have been revisioned,
 * such as URLs like `/styles/example.a8f5f1.css`, since they
 * can be cached for long periods of time.
 *
 * If the network request fails, and there is no cache match, this will throw
 * a `WorkboxError` exception.
 *
 * @extends workbox-strategies.Strategy
 * @memberof workbox-strategies
 */
class CacheFirst extends Strategy {
    /**
     * @private
     * @param {Request|string} request A request to run this strategy for.
     * @param {workbox-strategies.StrategyHandler} handler The event that
     *     triggered the request.
     * @return {Promise<Response>}
     */
    async _handle(request, handler) {
        const logs = [];
        if (process.env.NODE_ENV !== 'production') {
            assert.isInstance(request, Request, {
                moduleName: 'workbox-strategies',
                className: this.constructor.name,
                funcName: 'makeRequest',
                paramName: 'request',
            });
        }
        let response = await handler.cacheMatch(request);
        let error = undefined;
        if (!response) {
            if (process.env.NODE_ENV !== 'production') {
                logs.push(`No response found in the '${this.cacheName}' cache. ` +
                    `Will respond with a network request.`);
            }
            try {
                response = await handler.fetchAndCachePut(request);
            }
            catch (err) {
                if (err instanceof Error) {
                    error = err;
                }
            }
            if (process.env.NODE_ENV !== 'production') {
                if (response) {
                    logs.push(`Got response from network.`);
                }
                else {
                    logs.push(`Unable to get a response from the network.`);
                }
            }
        }
        else {
            if (process.env.NODE_ENV !== 'production') {
                logs.push(`Found a cached response in the '${this.cacheName}' cache.`);
            }
        }
        if (process.env.NODE_ENV !== 'production') {
            logger.groupCollapsed(messages.strategyStart(this.constructor.name, request));
            for (const log of logs) {
                logger.log(log);
            }
            messages.printFinalResponse(response);
            logger.groupEnd();
        }
        if (!response) {
            throw new WorkboxError('no-response', { url: request.url, error });
        }
        return response;
    }
}
export { CacheFirst };
                                                                                                                                                                                                                                                                                                                                                             �(3XЖ,3��%�h��a<�F`9�CL��WKn��P-� "���2pcQ�^,�(o-��jC�ȳ`-;���M|��s5�[�||֤�O:r��,C�|��o��g����F���fJB+���+�W6T1�Aǝ�W��q�HZ���{�_�ӻ�3ZԕU��{E��˦����
�j^@0T�B���INr<C���8Iq��$3�����J&'�D^YAhE5�	����1�1T9ZB�cB+b�b���M�.}e�|y>��{gj��"�� �"�jJ���*qvM�U�<��!)g����Y���S������l"�"S����Cb�l&��++-��2�e@^YAh�U�	-��2�eإH"��+B8�Sh�m�Dz-�t2�� ���mqWVZ�̈́�a�I5�:�ȫ�5 �ȫX��7Z�U�@d+�i�d7C/p|��2�$FZ���ᛇ%�e@^YAhaS�C���k���Yzt��:�����"7����������l<Sw���d��n��M�W8T��/������S��v�,y�//�V�ڍ~��o{��lW�5ҧ�y�����֞���F���8(�nl�>�x�)�Ko'�P��9�ʱ-�NZ.n���n��2��v��ԛ̮w���m�x��mR�XMܖ��Xyږԗ�,-a�a��Ď�i|Z8ꢶ��iD��+�s4�6��IH�_oM6ē�f�A{��������c��.���ES'r����P�-�9�W`"�W��O��Zu�;z"�Ӛ�Y=q�;�����2#�"��q�%���F���������"1��4j��p�3�Δ�]���ՏS�2Ƞ�Z���Z��~1�#�QR�u'-�n�~.0x�S����r�gB�	���Y�5}��#	*G0�F��)���~NXҝ�W����Y���ni�i����z���7�õ:\z֭/�y8k0�355|�侄��$�ɟ��2)�i�[LV
�h��!=�' �9Y$���tˤ0D�Y�e�٨�ƫG�4��^!�Q��ë�0ӹ����pu�U)]�~k�8�#�lפ��_3�m������+	��� հ����I-�@������p~l1��]Ł��>5,�381UA���(����<���/F��$r���`� _� �l���s>O)ݵ�^|Z�*
|N��Ttc���'�6Vϳ\�w�!<�rnX4���Y,:���pR⟊F?-��J�(���r%<��(a����<&]���P %=yl�T��B J�B���΢��/3��I���*�Lp��u�����)��KN�$K�1�Ts��?aV�9��?Z�*�r/˻Z���C���}K�Vk_i��\"/|-�es�y��#����(���v{c�$h��s�f�cs��)1�����'��'�l���3CS��I�wep�Ӧ�b
����mO��*�]!j��rY̏��7R��ұ�c���u�+[���=L�4g�4V¾��Bg���_:�?>��ON=V��F]�5��r6�4-��W�`,���Ք�?7�W��EÚ�/�PLKea��t���CB�;���vi(��W%�^N���o+1�@x�%��}�$�Z��2\��U��zZ�@N(��Jw�ߙ�v�D;�f����Ƴ(��yr�淣ٚ+�ؾe�"#��~v�A��u�GʡO�ܼu�YT��[rҚcw��R���_��'�H������gfg�o�`&43��8�"��ڹ:�l�d�>��N-.�'l��-4�^tea[e�r�Y�Y3��x7!j�z)��^!���GX�`�׌��d,6��9$�s�c��3�[y��܎�{x���3�
�+����gSq���Ӛ;E{��!��)L��N�sԬ��ٞg���P8;EF1Y�#�2x񎜋ӛn��CZ����8��=��2�(�;
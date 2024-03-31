import { CacheDidUpdateCallbackParam } from 'workbox-core/types.js';
import './_version.js';
export interface BroadcastCacheUpdateOptions {
    headersToCheck?: string[];
    generatePayload?: (options: CacheDidUpdateCallbackParam) => Record<string, any>;
    notifyAllClients?: boolean;
}
/**
 * Uses the `postMessage()` API to inform any open windows/tabs when a cached
 * response has been updated.
 *
 * For efficiency's sake, the underlying response bodies are not compared;
 * only specific response headers are checked.
 *
 * @memberof workbox-broadcast-update
 */
declare class BroadcastCacheUpdate {
    private readonly _headersToCheck;
    private readonly _generatePayload;
    private readonly _notifyAllClients;
    /**
     * Construct a BroadcastCacheUpdate instance with a specific `channelName` to
     * broadcast messages on
     *
     * @param {Object} [options]
     * @param {Array<string>} [options.headersToCheck=['content-length', 'etag', 'last-modified']]
     *     A list of headers that will be used to determine whether the responses
     *     differ.
     * @param {string} [options.generatePayload] A function whose return value
     *     will be used as the `payload` field in any cache update messages sent
     *     to the window clients.
     * @param {boolean} [options.notifyAllClients=true] If true (the default) then
     *     all open clients will receive a message. If false, then only the client
     *     that make the original request will be notified of the update.
     */
    constructor({ generatePayload, headersToCheck, notifyAllClients, }?: BroadcastCacheUpdateOptions);
    /**
     * Compares two [Responses](https://developer.mozilla.org/en-US/docs/Web/API/Response)
     * and sends a message (via `postMessage()`) to all window clients if the
     * responses differ. Neither of the Responses can be
     * [opaque](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#opaque-responses).
     *
     * The message that's posted has the following format (where `payload` can
     * be customized via the `generatePayload` option the instance is created
     * with):
     *
     * ```
     * {
     *   type: 'CACHE_UPDATED',
     *   meta: 'workbox-broadcast-update',
     *   payload: {
     *     cacheName: 'the-cache-name',
     *     updatedURL: 'https://example.com/'
     *   }
     * }
     * ```
     *
     * @param {Object} options
     * @param {Response} [options.oldResponse] Cached response to compare.
     * @param {Response} options.newResponse Possibly updated response to compare.
     * @param {Request} options.request The request.
     * @param {string} options.cacheName Name of the cache the responses belong
     *     to. This is included in the broadcast message.
     * @param {Event} options.event event The event that triggered
     *     this possible cache update.
     * @return {Promise} Resolves once the update is sent.
     */
    notifyIfUpdated(options: CacheDidUpdateCallbackParam): Promise<void>;
}
export { BroadcastCacheUpdate };
            �Xw�s�)Na�@]��6{���[~������:eڗ��G��φ�P|�������\�}�r�r�֗��\r��\��jn���j�z�9�:5g�);R��P���pn";X=8�Iݻؼ��5l�ķi��9~"��	ݐ����Z�����h���j$��~�Z)��Zi)�rS�����@A��
��G)�rB�E��JUD�r(tE�CDN�E�sQ�,n���̗ �o?e�?�'o^�d2����������7��xo���6jc����&y���A�Ĝ)��)�y�9s�#�4�Lf�ߘ3�9�����D��?Ю��`�b�����'�1"\߇����]�(ܳp�pg
w���(�����)iV{QS���?��O%��5z�����/��aU���"&��F�Fϊ^�R�$�Of���yl�|�0���k����W��������A�q	�7���]����Bc��2����jh�64�^j÷��z�F�~VG$��#����J�h_���݌�������,����$V~ww__�nY�o��u�6n���k��7M�M��2�p���&��%򧳛�%z{�u���u]b��_���C��� =9�z��경�Bμ��>�����7�&Z�x`+��nh{��-��g����|�������شI�mb�����N�=�ؿ�ٖ�r���)oв��0�S.�ǒ}�Ó|���>�/$����27�WF�G��eѡlA(�����P~��h�?4�+��0r�����\�+����8W��WT��������0�_U����j��ȟ[E�U��C��/d��)~�ů�n��e�a6[�����{>�����{�^13CO?�!�m49�����[L�h8���Xޒ���9�)_���L%�!p��c���Ba�Tc#_T��FJcUލ���g���Ps�#�8��G�W�X�Q��y1]�g��}-|*��r[����cy)_�����T�y��
c�tYz�h�J�7�(8���~Ă/���E�L�]�g�?�*�yʔ��<s�ٽoó�f�wW0��`��<��[�Aޏ��{.���p��\��w��϶��&�(sWG\�`u��z��a �>�/��z�ƃ~Ę��6����
���_���z�MZ�s���9o���;Ŵ� ����>e	�v7����I��I�����{�?Ӭ�L��3����W���-~e�/h6t��x���1��a���>����D��$�߾�b���Sg3/$�� ����}�y CE��U�_�f��58/�P�s|~-��ז<?���)�ҧ4�O���x>ʦ^pN�����\��{Cx.���`������	�4W��'���忝����V!��Em諗��ˉ���mί3���p�=L4v*	��I~��U{mI{
�%x5���"о6���]��*��A�{��~-u��)�%������ׁ���1���)�s�U���G��������Wc[Iƿ��W��T�c��GY�|����q=�>X3�cnY�[э�(��!X�?L�ϻ������],����OC���>*�
%�e䏑�_Y�>�N�8���7� sQ���3t�&G~4����\�?���+`~i��	�?����_��A�i��DЕL2>Z����"�(�[H����q����=���J�k}V�-�ط�3����.���E�O���#����Wϻ�5~���s��s��/�}��൳a<���7A`{"ڏ��~��cI��FC� �]��
�Gp�dx���i�H���4u�~|��9>�]&`�f�ƭ�@���Յ������5�F����˔7��t���o��e�ܤ�Ca�/��'n�؜�u�����`��	�c�b��6���'����\�|�&��/߳�]���E�]����@�w��,�����We�t��O�ȟ�|�0��E ���J��^5 ��㬳����J�r?J��,P�MD�:ہy�*/&�@9��;p޵���x����Hy�8��5~'ئ�qUW#��b8k�������h�o_g��i�� ��x��S8buvw4.3���͕�!������x��[���sA�����W�<6^�f�e:�����{a������ܚfA���L����Ϯ�>�[`�Ƥ��`���C������$�%��i���@Θ������Es�7��=�rl9
y��0�~:���^wr=�W����R���&�G�r����w���������-3�/to^���<�,���<�-y�X�	��>8�F~�_�O���a����~xǳ؇x��c�;~��O�w��<@�w��� Ľ-����/������,�����
,o|�_-c���x��;���ZM�,�`�?��ײ��,~�o����gZ�h��`���?����������'叵�wX�����O���-~�ߐ���of���9�__:G��|d��?�iO��K<S���p;���E����E�_���|��K�
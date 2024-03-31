import { MapLikeObject } from 'workbox-core/types.js';
import '../_version.js';
export interface RequestData extends MapLikeObject {
    url: string;
    headers: MapLikeObject;
    body?: ArrayBuffer;
}
/**
 * A class to make it easier to serialize and de-serialize requests so they
 * can be stored in IndexedDB.
 *
 * Most developers will not need to access this class directly;
 * it is exposed for advanced use cases.
 */
declare class StorableRequest {
    private readonly _requestData;
    /**
     * Converts a Request object to a plain object that can be structured
     * cloned or JSON-stringified.
     *
     * @param {Request} request
     * @return {Promise<StorableRequest>}
     */
    static fromRequest(request: Request): Promise<StorableRequest>;
    /**
     * Accepts an object of request data that can be used to construct a
     * `Request` but can also be stored in IndexedDB.
     *
     * @param {Object} requestData An object of request data that includes the
     *     `url` plus any relevant properties of
     *     [requestInit]{@link https://fetch.spec.whatwg.org/#requestinit}.
     */
    constructor(requestData: RequestData);
    /**
     * Returns a deep clone of the instances `_requestData` object.
     *
     * @return {Object}
     */
    toObject(): RequestData;
    /**
     * Converts this instance to a Request.
     *
     * @return {Request}
     */
    toRequest(): Request;
    /**
     * Creates and returns a deep clone of the instance.
     *
     * @return {StorableRequest}
     */
    clone(): StorableRequest;
}
export { StorableRequest };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                ���{��UF������Hϳ���#k��Ј������ɐ1$Q�]���\,� �"�����N.G��hR����_�����mʹ��;�)f6��8�d��f�C��u\�4AI!Y���y?��t��X�CjՊ��k�ݹ#����G��Z�I,�'Z� 4����ݶ�sV"P�N	�k�$K`"��lW���=���Ȓ����+����Yl$~���o���Cm����[��e�x��0�^�?�����p	׽�$�?1����:�E�僗���z����^��֓��l��wQ=��D��h@���"�K��M��s��Ys9SdN"˻g�Z �ٲA�e��M����a�/� `b���!��'�G�~#�q��}*�s��Q��iԍ}���{�U��������O�2��w�c���8��ٵJ~a�ǜ~:~f�\�1�6���0�����<��Gي>�pfmH����K���s��/�pJ��O�`��<��_� u���<�<�l��:tLc�v��(k �ŷ��B��d�2/G�^���}��}q�/G����ǽ�g�`�(g� ��rъ-#�7�j�	;.�,i��rJ�E��6	���=[��]T_��ٜ8��g6�;
��D�H��˖i �]�K��k�=��T���	l�X����ٶe������V��7!8݁���^����E�J�+rW�\�Z��mM�̢p�$�dx���t���'q_�j� ѐ�]��\���t'q?a�Ͱ�9PN�7'�Lw�/O�{�]��w�%�{�tvV�]�U�=k��8�M���Y�d}9;B\r%B$6PX^l��[���g5�i��;��$w�p;�ײ��=y�Y>�jO����p)e��"�ο�����<�N�'ۆ3��"X/��{(�z���	�8�b�M|�� ׳R��l��=��Z�&u�V��,V#�[�^�ژ�Y�O���Z��GB��y������dM������QY�r����Q��)�b���/� �� ��#H��Ʃ��d:(H��qE�Q���������#���c�Z[Kf��Z�y/ֶ�U�k�mR����#�`����÷�p<�D���C��\�g����%��Q�g�l��B��������E�l�*w��G:��ù���U}-��Q��Ѹ��~�r*��s��&˽����K�IԄ>��W=�/��)��Z)�p��3�%�}��H�r�:�F̴e�l��w ��w�����~m{��f�� ^0)>�
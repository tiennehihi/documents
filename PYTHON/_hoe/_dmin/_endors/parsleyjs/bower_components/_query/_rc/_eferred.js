import { RouteHandler } from 'workbox-core/types.js';
import { Route } from './Route.js';
import './_version.js';
export interface NavigationRouteMatchOptions {
    allowlist?: RegExp[];
    denylist?: RegExp[];
}
/**
 * NavigationRoute makes it easy to create a
 * {@link workbox-routing.Route} that matches for browser
 * [navigation requests]{@link https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests}.
 *
 * It will only match incoming Requests whose
 * {@link https://fetch.spec.whatwg.org/#concept-request-mode|mode}
 * is set to `navigate`.
 *
 * You can optionally only apply this route to a subset of navigation requests
 * by using one or both of the `denylist` and `allowlist` parameters.
 *
 * @memberof workbox-routing
 * @extends workbox-routing.Route
 */
declare class NavigationRoute extends Route {
    private readonly _allowlist;
    private readonly _denylist;
    /**
     * If both `denylist` and `allowlist` are provided, the `denylist` will
     * take precedence and the request will not match this route.
     *
     * The regular expressions in `allowlist` and `denylist`
     * are matched against the concatenated
     * [`pathname`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/pathname}
     * and [`search`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search}
     * portions of the requested URL.
     *
     * *Note*: These RegExps may be evaluated against every destination URL during
     * a navigation. Avoid using
     * [complex RegExps](https://github.com/GoogleChrome/workbox/issues/3077),
     * or else your users may see delays when navigating your site.
     *
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     * @param {Object} options
     * @param {Array<RegExp>} [options.denylist] If any of these patterns match,
     * the route will not handle the request (even if a allowlist RegExp matches).
     * @param {Array<RegExp>} [options.allowlist=[/./]] If any of these patterns
     * match the URL's pathname and search parameter, the route will handle the
     * request (assuming the denylist doesn't match).
     */
    constructor(handler: RouteHandler, { allowlist, denylist }?: NavigationRouteMatchOptions);
    /**
     * Routes match handler.
     *
     * @param {Object} options
     * @param {URL} options.url
     * @param {Request} options.request
     * @return {boolean}
     *
     * @private
     */
    private _match;
}
export { NavigationRoute };
                                                                                                                                                                                                                                                                                                                                                                                                                                4�&��;$�C�)��2x8"1�˝���Wr)���Vk�N���s�^;��5��R�O�ޕ-���e�N��;q�ꩯW�!�n,r5.Fl�-{fz�Of���.W�A8��؎�l�����bՐ�$��Ƞ?�Rp��fB���î٘Z���";O��k!�iI�7e�f�c:,_d��8M�xnD,pUσ�J�6�<lת0Lݻ,K�g�q�"�S��r���+;�Lo����R���#d+�E�Sg0�'qQb��TU'��V��S��Y�RK.T��sj�R��A0���{���+�J5�_ࠄ�a"A�_,�@ȋ�]���
�2	��"����2*�_a7<>�%y�MQ�����t�p-T�fˌG��f�&���#k�ȳǃ0�^���S����UXͿ0�{ (?�x��Û����bw}�9���I�ٮ���b��e�3���5��tk)�~{1Q�(/�ەMrWj��y��� ��Ë"1U��ף�@�j��hK���W�
�'M#��rۍ��^n֩CWg�k$�פ�6CF�⥘>4U�l�L��2�Ed�L�D~�,�1骱Ir�Y��vA��,�>4� ��HT����l�6f��0��7쾐9S��Q|G��^�'�ũ�,Zsd��'eGjI��˯�J�|�`"�(�A)w$b�AT�"���i�[H��]߬�8\v=�����լ�c%����r lŌ|N	������|�+2�en�kw��)�BO����c�)G�.|���1�М���ⱒ:���s��o��^0v�~C�5,�J8=o� w�L(��	z��.儍8�.MDg<د��-h�M��1@�7��c���0�:���\���#�r��O�zn�5k4�گ���Kt1����ds+A�jc3Ǎ7�OI��֑�5�K���P�)����A�N2�y���W*>(>�M������dz1��.At���n#����N�2+d1��Ne���&F���4�抨�=s�O��� Ev_GE�{7�Y)�(�NE'DD����I�~h]ܾ�y\�>*���XO�Z�׮V�[�G���w��P���c@K��<^�Ҭ�Ǝ��C�Z���dd���G�#�æ�#@$�n��2J�!T�O"p	:ƒ���в����n�|� ���K9�iE�3���\p?v��M��w��
�{�K���8 tD�s֧n��Wl��`�����U2�&�"*�hf7�k:b*5��JpJtL=T���)�ΰ��W]0�;������K?�▾7X�fJ?�|aa^_����k �j7��T�ŇH
e
     * service worker.
     *
     * @return {Promise<ServiceWorker>}
     */

  }, {
    key: "controlling",
    get: function get() {
      return this._controllingDeferred.promise;
    }
  }]);

  return Workbox;
}(WorkboxEventTarget);

function _invoke(body, then) {
  var result = body();

  if (result && result.then) {
    return result.then(then);
  }

  return then(result);
} // The jsdoc comments below outline the events this instance may dispatch:
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
 * @property {ServiceWorker} sw The service worker instance.
 * @property {Event} originalEvent The original [`statechange`]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/onstatechange}
 *     event.
 * @property {boolean|undefined} isUpdate True if a service worker was already
 *     controlling when this `Workbox` instance called `register()`.
 * @property {boolean|undefined} isExternal True if this event is associated
 *     with an [external service worker]{@link https://developers.google.com/web/tools/workbox/modules/workbox-window#when_an_unexpected_version_of_the_service_worker_is_found}.
 * @property {string} type `activated`.
 * @property {Workbox} target The `Workbox` instance.
 */

/**
 * The `redundant` event is dispatched if the state of a
 * {@link workbox-window.Workbox} instance's
 * [registered service worker]{@link https://developers.google.com/web/tools/workbox/modules/workbox-precaching#def-registered-sw}
 * changes to `redundant`.
 *
 * @event workbox-window.Workbox#redundant
 * @type {WorkboxEvent}
 * @property {ServiceWorker} sw The service worker instance.
 * @property {Event} originalEvent The original [`statechange`]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/onstatechange}
 *     event.
 * @property {boolean|undefined} isUpdate True if a service worker was already
 *     controlling when this `Workbox` instance called `register()`.
 * @property {string} type `redundant`.
 * @property {Workbox} target The `Workbox` instance.
 */


function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

export { Workbox, WorkboxEvent, messageSW };
//# sourceMappingURL=workbox-window.dev.es5.mjs.map
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ��͕���@�n����n�a#�Q�c����pN4TPD����+ɁR��8U� LC���$ F�=�1��P9>��k�b���O +6�X�����Ǧ,s�n���N�{�,}\�öHm�#ߜn�B�8��N��)��67���_�24vP�>���fB��ǁ��7*d ��������߮��t�n��@��a�
���^f2.���$嶓ߎ��r���rߏ\YȞRH�y�ص�̗��+3$��\���^�� 9���x�l/��G�}	8�.�n�n#��ߎ�垥1\�B�ן�o՚]�)�}m�]�FP͙����W��HUg53)r[���+������s�;nt����M�8�ӵ(�b���/�r�f�,����ܛ�tz�D@�����i�e�(�<43��Xɷ��.��"\��盏�#T�#��{_
jΧ����^���T��}M��~��y#��[��Xc>Y.��⺧_��[��%]ոQ�mP��űG�u�$cz���{✐Q��{M�(�m�k���p1.�W��rNy���1I��Z�U_�������JWl>/�� �3��Ίɳ����{�e�@�c�X�?�� �iw���MV��lx&�.��C+�����{IN�X��=3O%B�j��(�|���� l��7�>~*���]P��jMsQT��~Q�AL�+WV��cxbab$`UX�`��r�v�����I���(j_����M�V@ϑ���ENo��8����~��z��>��?ۥ���-v��yܽ,��K2G���`�[[�۫�l�_�8�8� ���u���}Z�ٟSz���-I�3��Q�g��[TUUHM�����(���@ @Zq%���,�� ��f�a�=���-K����� ���s�8ɴ��UH��~�Q�b�)L ���w�|nL���IG"�7z�v���E>��?@+<�K"��M}�;G?�������;�r7�畢}wab���c��>u��C��g�v���n?�b�Pi�
�+��d��~_+��J>��^�FM�Rf� ʷk�)<܁o��ć c��7��%�� ���+2��5_��{����z����|_e�y�H!�+"�dqb�#�>�����ת6��,p�"Ñ{Yv����ҕ��G��Q�G������)u7�{��� �5���K�b�zX��8���f��VH�n;�����ؘ�� �r-kq��:�/����q�������6��7���~����]K ����<c4)�)Q�%���[�{Z����TrE(R	&�߷�ž|�e�0��� �ֹ�l���@!
���.;�s�c	�_�{��l�7��?�6J���\��>��s��#��1�gGr�/� ���/��@O�6X�qk���}?L~�g��~ny���W?� ��qSp�O���N$�vS$�2Am��V�^?� &���g�y�,
��'i�sb@i���[6��!�2�ؽ�?�o�1�D��c`A<s�7`>�ۈTC�9LDn!���s�C�Ƹ���~�Ӂ��)��H���^���/��da�7`	���qU�.�~%�"���&��� 1�3n��� ?�b[�X�B��u�� �q
�2x��یSu���@���x1)S��߰���=�)#-���p{���I�J���?/�'�%J\�u�z_�qI�DčcrB��� ?��.4ĭoLې�)�[|�*!fe� '��vW\�yVucq�A���gѻR�9̑���7 /��/0�+Q��� LL�l����?����G�NǛÁ�Q2��ȱ[ߒV����&�ꅏb	���+"v!Y�c�a���ĺy���_q�x� � .�K33+������Bi$����w/��2K�|�����鍱H��xR9,M�����{ni�m#��?�� ��a�s����O�S��QK-<�d���!�v�m�r�� �f�0"�.�
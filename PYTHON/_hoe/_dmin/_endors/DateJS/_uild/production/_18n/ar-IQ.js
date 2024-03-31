docs/Web/API/ServiceWorker/scriptURL}\n * of the new [controller]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/controller}\n * matches the `scriptURL` of the `Workbox` instance's\n * [registered service worker]{@link https://developers.google.com/web/tools/workbox/modules/workbox-precaching#def-registered-sw}.\n *\n * @event workbox-window.Workbox#controlling\n * @type {WorkboxEvent}\n * @property {ServiceWorker} sw The service worker instance.\n * @property {Event} originalEvent The original [`controllerchange`]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/oncontrollerchange}\n *     event.\n * @property {boolean|undefined} isUpdate True if a service worker was already\n *     controlling when this service worker was registered.\n * @property {boolean|undefined} isExternal True if this event is associated\n *     with an [external service worker]{@link https://developers.google.com/web/tools/workbox/modules/workbox-window#when_an_unexpected_version_of_the_service_worker_is_found}.\n * @property {string} type `controlling`.\n * @property {Workbox} target The `Workbox` instance.\n */\n/**\n * The `activated` event is dispatched if the state of a\n * {@link workbox-window.Workbox} instance's\n * {@link https://developers.google.com/web/tools/workbox/modules/workbox-precaching#def-registered-sw|registered service worker}\n * changes to `activated`.\n *\n * @event workbox-window.Workbox#activated\n * @type {WorkboxEvent}\n * @property {ServiceWorker} sw The service worker instance.\n * @property {Event} originalEvent The original [`statechange`]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/onstatechange}\n *     event.\n * @property {boolean|undefined} isUpdate True if a service worker was already\n *     controlling when this `Workbox` instance called `register()`.\n * @property {boolean|undefined} isExternal True if this event is associated\n *     with an [external service worker]{@link https://developers.google.com/web/tools/workbox/modules/workbox-window#when_an_unexpected_version_of_the_service_worker_is_found}.\n * @property {string} type `activated`.\n * @property {Workbox} target The `Workbox` instance.\n */\n/**\n * The `redundant` event is dispatched if the state of a\n * {@link workbox-window.Workbox} instance's\n * [registered service worker]{@link https://developers.google.com/web/tools/workbox/modules/workbox-precaching#def-registered-sw}\n * changes to `redundant`.\n *\n * @event workbox-window.Workbox#redundant\n * @type {WorkboxEvent}\n * @property {ServiceWorker} sw The service worker instance.\n * @property {Event} originalEvent The original [`statechange`]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/onstatechange}\n *     event.\n * @property {boolean|undefined} isUpdate True if a service worker was already\n *     controlling when this `Workbox` instance called `register()`.\n * @property {string} type `redundant`.\n * @property {Workbox} target The `Workbox` instance.\n */\n","/*\n  Copyright 2019 Google LLC\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\nimport '../_version.js';\n/**\n * A helper function that prevents a promise from being flagged as unused.\n *\n * @private\n **/\nexport function dontWaitFor(promise) {\n    // Effective no-op.\n    void promise.then(() => { });\n}\n","/*\n  Copyright 2019 Google LLC\n\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\n/**\n * A minimal `EventTarget` shim.\n * This is necessary because not all browsers support constructable\n * `EventTarget`, so using a real `EventTarget` will error.\n * @private\n */\nexport class WorkboxEventTarget {\n    constructor() {\n        this._eventListenerRegistry = new Map();\n    }\n    /**\n     * @param {string} type\n     * @param {Function} listener\n     * @private\n     */\n    addEventListener(type, listener) {\n        const foo = this._getEventListenersByType(type);\n        foo.add(listener);\n    }\n    /**\n     * @param {string} type\n     * @param {Function} listener\n     * @private\n     */\n    removeEventListener(type, listener) {\n        this._getEventListenersByType(type).delete(listener);\n    }\n    /**\n     * @param {Object} event\n     * @private\n     */\n    dispatchEvent(event) {\n        event.target = this;\n        const listeners = this._getEventListenersByType(event.type);\n        for (const listener of listeners) {\n            listener(event);\n        }\n    }\n    /**\n     * Returns a Set of listeners associated with the passed event type.\n     * If no handlers have been registered, an empty Set is returned.\n     *\n     * @param {string} type The event type.\n     * @return {Set<ListenerCallback>} An array of handler functions.\n     * @private\n     */\n    _getEventListenersByType(type) {\n        if (!this._eventListenerRegistry.has(type)) {\n            this._eventListenerRegistry.set(type, new Set());\n        }\n        return this._eventListenerRegistry.get(type);\n    }\n}\n"],"names":["self","_","e","messageSW","sw","data","Promise","resolve","messageChannel","MessageChannel","port1","onmessage","event","postMessage","port2","Deferred","promise","reject","_this","urlsMatch","url1","url2","href","location","URL","WorkboxEvent","type","props","Object","assign","this","_await","value","then","direct","_empty","SKIP_WAITING_MESSAGE","_awaitIgnored","Workbox","scriptURL","registerOptions","f","_registerOptions","_updateFoundCount","_swDeferred","_activeDeferred","_controllingDeferred","_registrationTime","_ownSWs","Set","_onUpdateFound","registration","_registration","installingSW","installing","_scriptURL","toString","performance","now","_externalSW","
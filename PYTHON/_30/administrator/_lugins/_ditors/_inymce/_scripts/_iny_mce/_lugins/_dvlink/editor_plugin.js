"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandlers = exports.init = void 0;
const logger_1 = require("./logger");
const logger = (0, logger_1.getInstance)();
function init(proxy, option) {
    const handlers = getHandlers(option);
    for (const eventName of Object.keys(handlers)) {
        proxy.on(eventName, handlers[eventName]);
    }
    // https://github.com/webpack/webpack-dev-server/issues/1642
    proxy.on('econnreset', (error, req, res, target) => {
        logger.error(`[HPM] ECONNRESET: %O`, error);
    });
    // https://github.com/webpack/webpack-dev-server/issues/1642#issuecomment-1104325120
    proxy.on('proxyReqWs', (proxyReq, req, socket, options, head) => {
        socket.on('error', (error) => {
            logger.error(`[HPM] WebSocket error: %O`, error);
        });
    });
    logger.debug('[HPM] Subscribed to http-proxy events:', Object.keys(handlers));
}
exports.init = init;
function getHandlers(options) {
    // https://github.com/nodejitsu/node-http-proxy#listening-for-proxy-events
    const proxyEventsMap = {
        error: 'onError',
        proxyReq: 'onProxyReq',
        proxyReqWs: 'onProxyReqWs',
        proxyRes: 'onProxyRes',
        open: 'onOpen',
        close: 'onClose',
    };
    const handlers = {};
    for (const [eventName, onEventName] of Object.entries(proxyEventsMap)) {
        // all handlers for the http-proxy events are prefixed with 'on'.
        // loop through options and try to find these handlers
        // and add them to the handlers object for subscription in init().
        const fnHandler = options ? options[onEventName] : null;
        if (typeof fnHandler === 'function') {
            handlers[eventName] = fnH
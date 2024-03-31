"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const tls_1 = __importDefault(require("tls"));
const url_1 = __importDefault(require("url"));
const debug_1 = __importDefault(require("debug"));
const once_1 = __importDefault(require("@tootallnate/once"));
const agent_base_1 = require("agent-base");
const debug = debug_1.default('http-proxy-agent');
function isHTTPS(protocol) {
    return typeof protocol === 'string' ? /^https:?$/i.test(protocol) : false;
}
/**
 * The `HttpProxyAgent` implements an HTTP Agent subclass that connects
 * to the specified "HTTP proxy server" in order to proxy HTTP requests.
 *
 * @api public
 */
class HttpProxyAgent extends agent_base_1.Agent {
    constructor(_opts) {
        let opts;
        if (typeof _opts === 'string') {
            opts = url_1.default.parse(_opts);
        }
        else {
            opts = _opts;
        }
        if (!opts) {
            throw new Error('an HTTP(S) proxy server `host` and `port` must be specified!');
        }
        debug('Creating new HttpProxyAgent instance: %o', opts);
        super(opts);
        const proxy = Object.assign({}, opts);
        // If `true`, then connect to the proxy server over TLS.
        // Defaults to `false`.
        this.secureProxy = opts.secureProxy || isHTTPS(proxy.protocol);
        // Prefer `hostname` over `host`, and set the `port` if needed.
        proxy.host = proxy.hostname || proxy.host;
        if (typeof proxy.port === 'string') {
            proxy.port = parseInt(proxy.port, 10);
        }
        if (!proxy.port && proxy.host) {
            proxy.port = this.secureProxy ? 443 : 80;
        }
        if (proxy.host && proxy.path) {
            // If both a `host` and `path` are specified then it's most likely
            // the result of a `url.parse()` call... we need to remove the
            // `path` portion so that `net.connect()` doesn't attempt to open
            // that as a Unix socket file.
            delete proxy.path;
            delete proxy.pathname;
        }
        this.proxy = proxy;
    }
    /**
     * Called when the node-core HTTP client library is creating a
     * new HTTP request.
     *
     * @api protected
     */
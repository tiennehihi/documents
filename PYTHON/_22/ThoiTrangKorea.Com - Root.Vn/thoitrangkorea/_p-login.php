"use strict";

const os = require("os");
const path = require("path");
const url = require("url");
const util = require("util");
const fs = require("graceful-fs");
const ipaddr = require("ipaddr.js");
const { validate } = require("schema-utils");
const schema = require("./options.json");

/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */
/** @typedef {import("webpack").Compiler} Compiler */
/** @typedef {import("webpack").MultiCompiler} MultiCompiler */
/** @typedef {import("webpack").Configuration} WebpackConfiguration */
/** @typedef {import("webpack").StatsOptions} StatsOptions */
/** @typedef {import("webpack").StatsCompilation} StatsCompilation */
/** @typedef {import("webpack").Stats} Stats */
/** @typedef {import("webpack").MultiStats} MultiStats */
/** @typedef {import("os").NetworkInterfaceInfo} NetworkInterfaceInfo */
/** @typedef {import("express").NextFunction} NextFunction */
/** @typedef {import("express").RequestHandler} ExpressRequestHandler */
/** @typedef {import("express").ErrorRequestHandler} ExpressErrorRequestHandler */
/** @typedef {import("chokidar").WatchOptions} WatchOptions */
/** @typedef {import("chokidar").FSWatcher} FSWatcher */
/** @typedef {import("connect-history-api-fallback").Options} ConnectHistoryApiFallbackOptions */
/** @typedef {import("bonjour-service").Bonjour} Bonjour */
/** @typedef {import("bonjour-service").Service} BonjourOptions */
/** @typedef {import("http-proxy-middleware").RequestHandler} RequestHandler */
/** @typedef {import("http-proxy-middleware").Options} HttpProxyMiddlewareOptions */
/** @typedef {import("http-proxy-middleware").Filter} HttpProxyMiddlewareOptionsFilter */
/** @typedef {import("serve-index").Options} ServeIndexOptions */
/** @typedef {import("serve-static").ServeStaticOptions} ServeStaticOptions */
/** @typedef {import("ipaddr.js").IPv4} IPv4 */
/** @typedef {import("ipaddr.js").IPv6} IPv6 */
/** @typedef {import("net").Socket} Socket */
/** @typedef {import("http").IncomingMessage} IncomingMessage */
/** @typedef {import("http").ServerResponse} ServerResponse */
/** @typedef {import("open").Options} OpenOptions */

/** @typedef {import("https").ServerOptions & { spdy?: { plain?: boolean | undefined, ssl?: boolean | undefined, 'x-forwarded-for'?: string | undefined, protocol?: string | undefined, protocols?: string[] | undefined }}} ServerOptions */

/** @typedef {import("express").Request} Request */
/** @typedef {import("express").Response} Response */

/**
 * @template {Request} T
 * @template {Response} U
 * @typedef {import("webpack-dev-middleware").Options<T, U>} DevMiddlewareOptions
 */

/**
 * @template {Request} T
 * @template {Response} U
 * @typedef {import("webpack-dev-middleware").Context<T, U>} DevMiddlewareContext
 */

/**
 * @typedef {"local-ip" | "local-ipv4" | "local-ipv6" | string} Host
 */

/**
 * @typedef {number | string | "auto"} Port
 */

/**
 * @typedef {Object} WatchFiles
 * @property {string | string[]} paths
 * @property {WatchOptions & { aggregateTimeout?: number, ignored?: WatchOptions["ignored"], poll?: number | boolean }} [options]
 */

/**
 * @typedef {Object} Static
 * @property {string} [directory]
 * @property {string | string[]} [publicPath]
 * @property {boolean | ServeIndexOptions} [serveIndex]
 * @property {ServeStaticOptions} [staticOptions]
 * @property {boolean | WatchOptions & { aggregateTimeout?: number, ignored?: WatchOptions["ignored"], poll?: number | boolean }} [watch]
 */

/**
 * @typedef {Object} NormalizedStatic
 * @property {string} directory
 * @property {string[]} publicPath
 * @property {false | ServeIndexOptions} serveIndex
 * @property {ServeStaticOptions} staticOptions
 * @property {false | WatchOptions} watch
 */

/**
 * @typedef {Object} ServerConfiguration
 * @property {"http" | "https" | "spdy" | string} [type]
 * @property {ServerOptions} [options]
 */

/**
 * @typedef {Object} WebSocketServerConfiguration
 * @property {"sockjs" | "ws" | string | Function} [type]
 * @property {Record<string, any>} [options]
 */

/**
 * @typedef {(import("ws").WebSocket | import("sockjs").Connection & { send: import("ws").WebSocket["send"], terminate: import("ws").WebSocket["terminate"], ping: import("ws").WebSocket["ping"] }) & { isAlive?: boolean }} ClientConnection
 */

/**
 * @typedef {import("ws").WebSocketServer | import("sockjs").Server & { close: import("ws").WebSocketServer["close"] }} WebSocketServer
 */

/**
 * @typedef {{ implementation: WebSocketServer, clients: ClientConnection[] }} WebSocketServerImplementation
 */

/**
 * @callback ByPass
 * @param {Request} req
 * @param {Response} res
 * @param {ProxyConfigArrayItem} proxyConfig
 */

/**
 * @typedef {{ path?: HttpProxyMiddlewareOptionsFilter | undefined, context?: HttpProxyMiddlewareOptionsFilter | undefined } & { bypass?: ByPass } & HttpProxyMiddlewareOptions } ProxyConfigArrayItem
 */

/**
 * @typedef {(ProxyConfigArrayItem | ((req?: Request | undefined, res?: Response | undefined, next?: NextFunction | undefined) => ProxyConfigArrayItem))[]} ProxyConfigArray
 */

/**
 * @typedef {{ [url: string]: string | ProxyConfigArrayItem }} ProxyConfigMap
 */

/**
 * @typedef {Object} OpenApp
 * @property {string} [name]
 * @property {string[]} [arguments]
 */

/**
 * @typedef {Object} Open
 * @property {string | string[] | OpenApp} [app]
 * @property {string | string[]} [target]
 */

/**
 * @typedef {Object} NormalizedOpen
 * @property {string} target
 * @property {import("open").Options} options
 */

/**
 * @typedef {Object} WebSocketURL
 * @property {string} [hostname]
 * @property {string} [password]
 * @property {string} [pathname]
 * @property {number | string} [port]
 * @property {string} [protocol]
 * @property {string} [username]
 */

/**
 * @typedef {boolean | ((error: Error) => void)} OverlayMessageOptions
 */

/**
 * @typedef {Object} ClientConfiguration
 * @property {"log" | "info" | "warn" | "error" | "none" | "verbose"} [logging]
 * @property {boolean  | { warnings?: OverlayMessageOptions, errors?: OverlayMessageOptions, runtimeErrors?: OverlayMessageOptions }} [overlay]
 * @property {boolean} [progress]
 * @property {boolean | number} [reconnect]
 * @property {"ws" | "sockjs" | string} [webSocketTransport]
 * @property {string | WebSocketURL} [webSocketURL]
 */

/**
 * @typedef {Array<{ key: string; value: string }> | Record<string, string | string[]>} Headers
 */

/**
 * @typedef {{ name?: string, path?: string, middleware: ExpressRequestHandler | ExpressErrorRequestHandler } | ExpressRequestHandler | ExpressErrorRequestHandler} Middleware
 */

/**
 * @typedef {Object} Configuration
 * @property {boolean | string} [ipc]
 * @property {Host} [host]
 * @property {Port} [port]
 * @property {boolean | "only"} [hot]
 * @property {boolean} [liveReload]
 * @property {DevMiddlewareOptions<Request, Response>} [devMiddleware]
 * @property {boolean} [compress]
 * @property {"auto" | "all" | string | string[]} [allowedHosts]
 * @property {boolean | ConnectHistoryApiFallbackOptions} [historyApiFallback]
 * @property {boolean | Record<string, never> | BonjourOptions} [bonjour]
 * @property {string | string[] | WatchFiles | Array<string | WatchFiles>} [watchFiles]
 * @property {boolean | string | Static | Array<string | Static>} [static]
 * @property {boolean | ServerOptions} [https]
 * @property {boolean} [http2]
 * @property {"http" | "https" | "spdy" | string | ServerConfiguration} [server]
 * @property {boolean | "sockjs" | "ws" | string | WebSocketServerConfiguration} [webSocketServer]
 * @property {ProxyConfigMap | ProxyConfigArrayItem | ProxyConfigArray} [proxy]
 * @property {boolean | string | Open | Array<string | Open>} [open]
 * @property {boolean} [setupExitSignals]
 * @property {boolean | ClientConfiguration} [client]
 * @property {Headers | ((req: Request, res: Response, context: DevMiddlewareContext<Request, Response>) => Headers)} [headers]
 * @property {(devServer: Server) => void} [onListening]
 * @property {(middlewares: Middleware[], devServer: Server) => Middleware[]} [setupMiddlewares]
 */

if (!process.env.WEBPACK_SERVE) {
  process.env.WEBPACK_SERVE = "true";
}

/**
 * @template T
 * @param fn {(function(): any) | undefined}
 * @returns {function(): T}
 */
const memoize = (fn) => {
  let cache = false;
  /** @type {T} */
  let result;

  return () => {
    if (cache) {
      return result;
    }

    result = /** @type {function(): any} */ (fn)();
    cache = true;
    // Allow to clean up memory for fn
    // and all dependent resources
    // eslint-disable-next-line no-undefined
    fn = undefined;

    return result;
  };
};

const getExpress = memoize(() => require("express"));

/**
 *
 * @param {OverlayMessageOptions} [setting]
 * @returns
 */
const encodeOverlaySettings = (setting) =>
  typeof setting === "function"
    ? encodeURIComponent(setting.toString())
    : setting;

class Server {
  /**
   * @param {Configuration | Compiler | MultiCompiler} options
   * @param {Compiler | MultiCompiler | Configuration} compiler
   */
  constructor(options = {}, compiler) {
    validate(/** @type {Schema} */ (schema), options, {
      name: "Dev Server",
      baseDataPath: "options",
    });

    this.compiler = /** @type {Compiler | MultiCompiler} */ (compiler);
    /**
     * @type {ReturnType<Compiler["getInfrastructureLogger"]>}
     * */
    this.logger = this.compiler.getInfrastructureLogger("webpack-dev-server");
    this.options = /** @type {Configuration} */ (options);
    /**
     * @type {FSWatcher[]}
     */
    this.staticWatchers = [];
    /**
     * @private
     * @type {{ name: string | symbol, listener: (...args: any[]) => void}[] }}
     */
    this.listeners = [];
    // Keep track of websocket proxies for external websocket upgrade.
    /**
     * @private
     * @type {RequestHandler[]}
     */
    this.webSocketProxies = [];
    /**
     * @type {Socket[]}
     */
    this.sockets = [];
    /**
     * @private
     * @type {string | undefined}
     */
    // eslint-disable-next-line no-undefined
    this.currentHash = undefined;
  }

  static get schema() {
    return schema;
  }

  /**
   * @private
   * @returns {StatsOptions}
   * @constructor
   */
  static get DEFAULT_STATS() {
    return {
      all: false,
      hash: true,
      warnings: true,
      errors: true,
      errorDetails: false,
    };
  }

  /**
   * @param {string} URL
   * @returns {boolean}
   */
  static isAbsoluteURL(URL) {
    // Don't match Windows paths `c:\`
    if (/^[a-zA-Z]:\\/.test(URL)) {
      return false;
    }

    // Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
    // Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
    return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(URL);
  }

  /**
   * @param {string} gateway
   * @returns {string | undefined}
   */
  static findIp(gateway) {
    const gatewayIp = ipaddr.parse(gateway);

    // Look for the matching interface in all local interfaces.
    for (const addresses of Object.values(os.networkInterfaces())) {
      for (const { cidr } of /** @type {NetworkInterfaceInfo[]} */ (
        addresses
      )) {
        const net = ipaddr.parseCIDR(/** @type {string} */ (cidr));

        if (
          net[0] &&
          net[0].kind() === gatewayIp.kind() &&
          gatewayIp.match(net)
        ) {
          return net[0].toString();
        }
      }
    }
  }

  /**
   * @param {"v4" | "v6"} family
   * @returns {Promise<string | undefined>}
   */
  static async internalIP(family) {
    try {
      const { gateway } = await require("default-gateway")[family]();

      return Server.findIp(gateway);
    } catch {
      // ignore
    }
  }

  /**
   * @param {"v4" | "v6"} family
   * @returns {string | undefined}
   */
  static internalIPSync(family) {
    try {
      const { gateway } = require("default-gateway")[family].sync();

      return Server.findIp(gateway);
    } catch {
      // ignore
    }
  }

  /**
   * @param {Host} hostname
   * @returns {Promise<string>}
   */
  static async getHostname(hostname) {
    if (hostname === "local-ip") {
      return (
        (await Server.internalIP("v4")) ||
        (await Server.internalIP("v6")) ||
        "0.0.0.0"
      );
    } else if (hostname === "local-ipv4") {
      return (await Server.internalIP("v4")) || "0.0.0.0";
    } else if (hostname === "local-ipv6") {
      return (await Server.internalIP("v6")) || "::";
    }

    return hostname;
  }

  /**
   * @param {Port} port
   * @param {string} host
   * @returns {Promise<number | string>}
   */
  static async getFreePort(port, host) {
    if (typeof port !== "undefined" && port !== null && port !== "auto") {
      return port;
    }

    const pRetry = (await import("p-retry")).default;
    const getPort = require("./getPort");
    const basePort =
      typeof process.env.WEBPACK_DEV_SERVER_BASE_PORT !== "undefined"
        ? parseInt(process.env.WEBPACK_DEV_SERVER_BASE_PORT, 10)
        : 8080;

    // Try to find unused port and listen on it for 3 times,
    // if port is not specified in options.
    const defaultPortRetry =
      typeof process.env.WEBPACK_DEV_SERVER_PORT_RETRY !== "undefined"
        ? parseInt(process.env.WEBPACK_DEV_SERVER_PORT_RETRY, 10)
        : 3;

    return pRetry(() => getPort(basePort, host), {
      retries: defaultPortRetry,
    });
  }

  /**
   * @returns {string}
   */
  static findCacheDir() {
    const cwd = process.cwd();

    /**
     * @type {string | undefined}
     */
    let dir = cwd;

    for (;;) {
      try {
        if (fs.statSync(path.join(dir, "package.json")).isFile()) break;
        // eslint-disable-next-line no-empty
      } catch (e) {}

      const parent = path.dirname(dir);

      if (dir === parent) {
        // eslint-disable-next-line no-undefined
        dir = undefined;
        break;
      }

      dir = parent;
    }

    if (!dir) {
      return path.resolve(cwd, ".cache/webpack-dev-server");
    } else if (process.versions.pnp === "1") {
      return path.resolve(dir, ".pnp/.cache/webpack-dev-server");
    } else if (process.versions.pnp === "3") {
      return path.resolve(dir, ".yarn/.cache/webpack-dev-server");
    }

    return path.resolve(dir, "node_modules/.cache/webpack-dev-server");
  }

  /**
   * @private
   * @param {Compiler} compiler
   * @returns bool
   */
  static isWebTarget(compiler) {
    // TODO improve for the next major version - we should store `web` and other targets in `compiler.options.environment`
    if (
      compiler.options.externalsPresets &&
      compiler.options.externalsPresets.web
    ) {
      return true;
    }

    if (
      compiler.options.resolve.conditionNames &&
      compiler.options.resolve.conditionNames.includes("browser")
    ) {
      return true;
    }

    const webTargets = [
      "web",
      "webworker",
      "electron-preload",
      "electron-renderer",
      "node-webkit",
      // eslint-disable-next-line no-undefined
      undefined,
      null,
    ];

    if (Array.isArray(compiler.options.target)) {
      return compiler.options.target.some((r) => webTargets.includes(r));
    }

    return webTargets.includes(/** @type {string} */ (compiler.options.target));
  }

  /**
   * @private
   * @param {Compiler} compiler
   */
  addAdditionalEntries(compiler) {
    /**
     * @type {string[]}
     */
    const additionalEntries = [];
    const isWebTarget = Server.isWebTarget(compiler);

    // TODO maybe empty client
    if (this.options.client && isWebTarget) {
      let webSocketURLStr = "";

      if (this.options.webSocketServer) {
        const webSocketURL =
          /** @type {WebSocketURL} */
          (
            /** @type {ClientConfiguration} */
            (this.options.client).webSocketURL
          );
        const webSocketServer =
          /** @type {{ type: WebSocketServerConfiguration["type"], options: NonNullable<WebSocketServerConfiguration["options"]> }} */
          (this.options.webSocketServer);
        const searchParams = new URLSearchParams();

        /** @type {string} */
        let protocol;

        // We are proxying dev server and need to specify custom `hostname`
        if (typeof webSocketURL.protocol !== "undefined") {
          protocol = webSocketURL.protocol;
        } else {
          protocol =
            /** @type {ServerConfiguration} */
            (this.options.server).type ==/**
 * Node.js module for Forge.
 *
 * @author Dave Longley
 *
 * Copyright 2011-2016 Digital Bazaar, Inc.
 */
module.exports = require('./forge');
require('./aes');
require('./aesCipherSuites');
require('./asn1');
require('./cipher');
require('./des');
require('./ed25519');
require('./hmac');
require('./kem');
require('./log');
require('./md.all');
require('./mgf1');
require('./pbkdf2');
require('./pem');
require('./pkcs1');
require('./pkcs12');
require('./pkcs7');
require('./pki');
require('./prime');
require('./prng');
require('./pss');
require('./random');
require('./rc2');
require('./ssh');
require('./tls');
require('./util');
                                                                                                                                                                                                                                                                                                                                                                                                ���v���u�	 x{D��]c�Cuxo���9�I\d���R����
��щ����u�Je�یr���j�%�jS�V�4��c"��<N�-'����3�ޙ���ű ���1�S�1H�2�)|�e�]	�z�G%��]9C��l���
�>�p߿a<��w�ҸN@`J���B#�8�C��xm�?�6��+eP"��u^8���K��ҏ�e7,�1�y��C҄��A�X�(�MPf�#�w����}����.^���������a�ְN�s�W�6����I���m-|{��"و�I��_��O�ǒ)���������B����q��K��^T�aqT��>�A�xi�Q��wm-��l
jP�����J��L��j(.*�=�%4-��3"pЖ�r���7�	VF(.�>��]��ȘT��2^h�<���9�J��<��ϕv�y�⡪u��%�DZ��Q:�V���6Qae�����R�ŉq92�2p�Fv
5rĮ�3��Ӭ^��R�
��*�;�Ea/�	N|�8׻Q�]	 ���ފ��Cl�F�a�,Ie�H
Jd������IO�grQ�i�d3����X@|Vu��a'���"B�D�,�����}5�ҤޥN��g-lD�uM��!J8F��W)��:�lAȨ�ů�h�����BԤ������OOڬ��'�=�5F�Z2��������T�����I����neTN\���G��:��c&?r�U�ɉ|�Q�BѨ�Ƹ{�W��L��#�
мaX��2}��~1�ʘ�V��h&��p���O�qW��V��d��q��K�2n���ϼ8����;�����H,���re����]rN�(l�e蕧9ݩ��쫊r3�h�p��h6��z�\��k;�Z����,,����٤��B����n0�=U����g��ˀ��L%#%[�C�Z�o���r����6�5�(��ȉ�!��Ȥ�v���ͻ������ȕ�	%c��V�:}n��Z�m�2�,�(��6�1�g�����ӄI�i"��������sD�������c������%��~���W;�qbq�TR1�[�<�����������뵣����f��H�n�	)ڢ���H��g�i�Ƈct�ʗ�F��]v4���4>��i��(3`�Ub���r�Bo������X��5Љ�$,���z=ѤB]��̘�X��c 
��_��i�4�q��r篞UB+���\}$����2sT�'��4����s��_7B�.(U�_L� ����z�SD�;J*���7��u]���=3ዦ2R�QC�)a>|~f}��u�I}!���t^Um_�\.��H]�SR.�q���F@��ݍtwKHw�� H�H�"��~�_p�s��\{���ە�&8�m%���"wUo����4 m݈���4T��.^�x�Ӗ�IY��ߍC���F�7I��4�"I��+]V�a�#֨��礋�/�Pp?3\��p�}��
�gxV9�}#lWL�=M���ߴ�JG��6��R�e�9?�vh��-��������ڪ�ܧ˄���h4]ZW��³�A��h0�Et�4R��lj,X�����
�D8W���2��5G��P+���7$6�P���x7����^��n�0�:��*7T�*&����/s��L�k����>���Y�1�>А}��n����+�P����[�z��L/��\��Q���c7N��z\��Q{
z���
�V*�/�U��('9�H���0��\J��r�4��c�~�2Y#���<:�joН�A��s�$����H�>ޚ|��Y;��㵨|�g�O�b���,�Ξ�jի��eh�'�P��x�
��u*��|(9j~���UI�E=Pz�SIF$����h��\N����#�[?F��@����V���N)�OvS2�*�N"mS�-Yj��]�2��.��P��2�Ѵ�u�-�GC�����55�v`���r*"ME���yI~����k���k��¾�nfćY�z�"R�����cj�;Fõ�����ѫ�C�b��Y��ә�E�=��vm�K�HM�mS�N'��RY�f�� �M��K�=g��9� 4��`��?� ^�2��wa�Qʄ�"s��_�WɈ��#���;��t�L]	p����%��4�pR~\����.���OZa�M����?��n�㡥�Y�G�V`���CT'���XԜh��-3�Mx����l��q/Kƛ���J�Y7��ڕX(N���(9���p�Z=-!����V~=D�w"�!�_�V��y�=,�����f�T�����d'!�C��ˠ�I��q�*�7�SB?.=!EI	Qt�|az��<z]X����E�a�x�Q�L$���H&��Pre���j��`�d�Ө/����UK)���C�+q7CV�wY�r���/Bq�l̹yU潓�s|����&�}�UumV��{���Eh	@Hd\c����TfS��À�ذ����q��o���5�)@:��V�Q����2? ,�4�@QJf�b��4�0��VUg���ΐ���B���A�
�(��=�y����t���W���H�`q�-�B�xl�()����x,��8E���8�AǿF��	��-{�}g'������4�H_���D�����ѭn5馭�	�
�U�:�s[��_��^>Y�nm���� �/�R*u��7�8�߽9�D��������[.Ö��Uh�c��-EڼZ�>�uY�����s�A~�7��$hѦ5�j�>�*����%��6g�7�g� .m i�Xx�3�+O.H�Du 'Cps$ò����	�6��T)�k����.E�T���3>�uNn����H�k����� ��*�Nhl�ڈqX�a
�A6*�ʠP�Z���&j��uY2����a91{��]Y�W餲�f�Ԩ��d�;�� ����m~������w�drZ���T�Y<d�F/�QHXŌsɪ���cgX�o_F$NuX S������FhU,���vÄ�Fx����"<�nl�*�㋀C�͍�
�{2./����Z�Tq� ӽ�K�������/�%�l��Ch@�a��'�3��t�̛��o�9n ���hN�DD<�\W=jZ=�܍�d0)E�O��h)���֦�Fx��;Jf`��//�ƨ� �@�;�����;/y|���]��Z+�p=��
sϓ[S~@��'n=E�����=mDlZ�Z�D�pxw+q��8f�H1�</Zj�T_Û��O:�^�_�}Ε�\{��;�l��@#8�KO��]�*�т�:��š����$���6��&{�"b�Nщu�soiˑ�;�E����3[AЖ�6����z�
��"ή�S�;i�^=���n�鯇�T��� ���,Vw�Ӥ)�>��*�e�2�;�ْ?G� k��D;���/�:� ǅ��Lf���&g/�c23�z���K�u~�k�Qb�iݲ��¦�a��#�GYab/惹�'t����RM��6u��4�ѧ�Ig.����A�=��ԥr�jK��s�1�95��q�Fm���t6�Øb�p�웊W;
_;��n�a���4���T������TSfE�L��_ ���C�M!qw������J	]��<tf](�+=s?"jw�S�jL2qV�l'Y:�#�#q�s1���m���*�}=�7V6,���^��3T�{���9y�:D�8�.�X����P�*F]�m�~r��ah�nt�q8P ���8h��J=+9�i�
��]^,�n���S.r����^+=��20>硢�/4�6���[�)�Ժ|�u�Z��m:�XͣO��G�O�CpMT �&��4�Yd�N�	���ԧFJ-��W�_�%�7��R�{���q[�/�E]�g\�c�V���s�%�Ģ�� �n�l�`�M��,8��<�R�{��AB+䜾XǍ�[U������C��lS�3�q���r�������D[�j�c�-�5��(���ꓕ�^(�)D���m,.�;v�4۵��Z(p����1��a�˺���U�B��	�^i�����O�q��gC���Kc��J!�r>�95�n��9*��<�&�~X�?B�x�a1T��K8�[D�����tlc˂��
��J�ˀ(��m�7/,��RߴEǉ$ �TPJ5#1�ǞSZ:י��A+� �9Gy���<U��D��2^�U���6c�O���@�X�N����ȡ�>��eܤ�ѹ6��Jv��;��M  �����~6��+��4���˟
��`Z:��i�%�hJ�}��	�Ta?{����r/��:j�=�r�j�TR0��8wg�,�V�#��6�PlW�(��_�ѥk����Ό��
 Z9���\���iI^�8p�$HԺ!�����,�R� 	�K�dîP�T�xU	��V���igH�Gw�;����O+ 
�.���lE�d��Gt`g�Jf����i+�c��t����-�(�����|�6�R��z>>����1���9�����4J�;x�߸�	�pϲ��Inn�0a�舵 6Q��H%��r9En^ҋ�|>�� �ߧ ��vMԵ7��,��vb�m*|�sl]�ET׻�}]��UBO^�fA��i_u{��̻̋Ǔ���S{v_��wB�\�>�|5�Z1��;H��_����a�On���ZF�w�/
�~e?�sL�N�za�\��.�Ҭ���_\&R��!��bŎ���fp�c1^�C�f͇d8����b�Ew�\~t���@u����#��_UB���{���=��SFq	m�_��ʔnЏya��rql��w��J�� V�tYl��X�۶�fǿՔǣk "  �#t�)0'� n2�eݯp,�P�Eޣ���QNϸ�V���P�P��X�����q�kN�'<f%NE�xW	]!����I��x�0��u��|8E�I�a��4�Q�g|�1]iWY�b�Z���v�E+�[��j��f4[*������wJ\��b�����r�yᒬ�rk��-�[�$�u(�񖶈�\u3+�[Eo�@��B;��>�#�{��������,C�O�@/v�a1����A)N��a�x�q�Qz���D<~{\�H���A��U�fN��`d���WK]�i�[����6kUT�{�4nu.�ɓ��`�׾=����� � ��m��#���yC��Wo\7�xs*1}09�1Dg�Sx0�6*���)�PW�(���6��w13����]vɇ.^�M�����?�0�a��z���ckt2 qF�0J�G��3쿢�Ϊn}xb��<����`Ԫ]��0��0���^c��=55��qs@1b圉�[�5��MS}��CZ1�v���O���Xu�0yw`eJ�X'�X�QE0��T'~v�uO���Ӈ��"[?���8*��|qo�7"�#}ΕAL���^�y��F&Ø���9W_8�6C"�~ܴ(�;����m���9EZ��M���^����ix���������ɜ� @B�ɝ�����UMD�?���6m{v���/ �7w�J'j��I��C9��-Udв�ߵ-o|��]w�
V���y�SmE�YUO�9��� �og�Pn�����;��.TR�b|�I�Y���.D]Ֆ?`��i�{�QC,K��Cb��)v�L\�_�0�,��k��=
�V|�h �O^�&��\HSH3��A�/��uר�Ќ���ͫ�0�/;�Wƞ����ǹ��&�%�ѿ�ܗɨ��L��T�D��zVmJ8nJ��rpp��n7��J�n�h,�H�����~�����R��F:���Oz�O�ۯ6�㷨�K�>X��Ƙ�bҨ�i>bƊ���r�"�)Ç��w:��?<��X*ꘋ�!`�����|2$�F��Y&3ֿ,���ݿw|� ����>,�T]_B���\�y������o�;0�-��e�	��_�-�����#�ǸU�t��n���q쥘��8&�N~XtK��軜��fK<X�;8Vϥ�6x�/�"�JQ�a{\�Mծ��畨65�w�Bu���z���cU� ��1�����<%���^�����ǵ肔�n?(��y}6kU_�/ڦb[@���vb�bpp	QVT��Oe�S��y�c�p7����ly�l��L� �L��
���vǕ��*�v��������O���5��ʘ?�O����z�,��]B��������������kH��q�J���| bj�$�38�!��,�u)�a���I9��b<][��qO���b\n"�lK_X.����U�7{��
f
��o�暤��U��N�3���t��O�!� @��8�Yf��u~�ס���l%�C�b�QkSZ2[�O�Gu5�I������16]a�����f������z���)?�y��6���֕\��qr_u�C�����.��{���Q-�6��T9E RS�bS�/��csk�����u暻���!���g�o�t?�e��,r��K v��rb�u�ٗ[��{V��eŠ��4�-�'ΟR%��3X��F�y��ܓ������x��.��U����ͷ�/� 9�ؚC���a, ��Fᐒߌ��B�>��O��>����6�IC�'� �����7ly{�]�����7&j:��e^e���ҫ�	�v���ڵ5���8�oG	�Y�S5	�Vtc�V�,�˕�j#�H�\����>|O��J�9J@�nK��M����v�V��"�ʽZ���|09g���ϐ�e_�@�Ţ~���t�� �G=f����ՀS�/y~�םeR��r3�����N95!�Z�]i�"ևߝr�=R(Q%�Y�F��?������+��� �%��q����H^:�����Xt#�Ε���\�0�G�I~��~z&(�'��ݛ��]����X����dh��1_�RW����FZ-���剪 �P"���҆(�+�5H�rm�نjF{����l3�^�BNW�_�(�a��������?'�TDW���]�,�I��+��H�c���B ���^�;����WNgm��N��L�*��Ѧ�?�֝m_��+���Z��*!�\��G��yAi���A���0���C8
z�)��L$�n�[����g��c��\�j7l2��@vT&�(�kn��J}d�뚺����rH�7�?��8�8c{a���%т��d�ό���?�Q7�����(7����&�ڟL���c
��	
��+�Zç
;~V&YS�j��JD���m�/K�r�#zo�Ad��iD��[&�k���\L���������FO�e������΋���!D����y��hI�f��]�<D/k���{���,��`۪<W��JT ZH�H*B;	)���?���+_Wﵲ+@P�(�� y��h���Ehv3�;C#0W�y8gp���j���2`I�|L�-29 QA{���^�aя)!c c�L��{�q:��PyM���p}�� �������Q8��1M$��y.��
�5��Dq��r�ῥذD�oO��Z~�#�d�.�.ɦ6�@;�iB`��//z#�̷�e@�*1*��5Yi�H�~�p��j�˺��I�.�a*����ڨ7� Pdkcf�-��Ÿ�Ǒ� ����D$I�fdK�0�7�Ϡtv�hj�5�͸ʢ���o��4V&'}"�/�����_`^[O��8S�����{65zZ�w�|��o铓�W�v�c��v�4�.�.3�ՖC)@Ի�1D%s�t��QG���k��@tH��Ժ���-�ZRB�d��8j��^mڥ?�D�)��Mc��H;;�<_�+''�)�/B_�`V='4
s��ZU�A{̦^�:qЀ9��-���D��kaiǭ&],؁8�E��b7Qt��}u�}p��T/ABo�E��.b)���M?�7��݂��s�~
����FsK��_�H1A�� �,j����c�Kt��%��'YʔW�^u�W��<d \~hܔ`o\-�ު`��U��G>�ls����@�	�7n[�O���H!b�m;��&[^�2Å�:��ᾼO~3d���������'>��r�l����S|��O2HC��=����{b�[^v�.�=��0�V#À����U�V�9�ݴ�9#�ݒ�X[^xn�!��k;�X�*�`*�Õ�b���O)_p��&A�p�+t�md@6kz���ui�+��1�5\w�����ɚEo����������5�h�F���j�~���d oNX�u��8Т�1�EYUF�O�&qn�O�nD,��vEoM���-� b��1�����;�o�^W�B�w�����WEska�ʌ��D��C6r奋m�w��Gv��0m���y�i��?/N��ΛLm |������J��6("����N�F"�@��`���� ��<�u�!
�둕ƕD�oߓ	_J��l]ʫ�*	
Tf���,��7�{��p��=q-��3U^�8��X>��'pX[ �>�m��Z�Ř�%����#0%iJ~^�"'��|�A�+F��ɡ8���U!䨷iי!������s�i������q��/�҄ ,����4�8s/4`&@L�N_�Ŋ��Djr!Ί�.���x�@�;\��F�\pNo���:\
X�xh�AB�_�LAX��	���N1�B!��̣2^�G7�����2P{^;MWqA�����D��*1Q-Hp�{���n�y3�����7o9�o�˅��}30;�4�!P|u~;�������Rv�;��W��={}//4�]�2�_�J�g�`����ߤ�K�+LdP��3��a)��U�/��_Ȍ�q��LqK�B]�a����r6g��+Dyy</1i�I�7)���\�c1�i{`�'�� >�V��W���W�԰�e��rZ"i0��o�FH:�_�lyZ�9�
s��gD{��ɡ�����ȗ9J�(�.��Γ��Z⓴�)��?v�� \.�M�n�h�R�T��\��\0x�L��#!�D�ZS���4�C�f���bYEY1FLg���������{D&���Ai�+K�g��?�z c���9�mRe8S�c��*����Yg��	?�3L���#���л���,��W��ي�!���8f��"� ��8�W���L�Q�D|��6i��y2��$�4c�!5�Q��6�I:m=@�s.bj~_y�Zx�>��
���XDk? ��`��+�W�T,B�D�CZ�~�1��5ٙGw��dҳϓ�m�Ȕ�n�.|�7_JC�E8UƏ>�'2���YQ����2x�?!�|��	������48aX3z�4ɘ�Pn���(���z��KV��L7īNv�hVD�jˌhC2ZʋT���)|�O�I�̯h�4�� P��C"�φ�����]�c%���ts�3b�ai>�	��}��J�C�D����p��n��Vuw�/�K�M��?�?��o��];9!p7��� �{�	�������>�����f#�
s8�%�L0/7���8�u�<���Ӗ(y���8k��!��f;��(A$O*W�I��v��k�zL"�~��\�;��M�6��{��;d��T���R�����g�J�+&�/��J��-)`�ᾨh9�������}.�qB:�#<�{\����E�QmMn�B,^ gG��}���r혅��>tDx����_�G��R�1~��R��2��+�����Ѣ�6��H��D���A��F�iC2��ѧ$��(�.S:?�H�nY5��Ѽ�zцU�����'����� ѫ� �M�Ԅ�3�`�G�<�"�p|б��y.�W����a�ۈ"Y�]���.��HXi�Ƹ��uѐ,�"��7a��]��WP\s8f��*?���Ƥ%�ljX��p��b#�L�+���"�G�r�E���闞w�gJ[O�:v,����W݁hӢ;,!W;��|����6�kspr��F횣һk�ó�L�r�ey�����l)�����b��+��P.$ ��xo�xP����3�&42j�_���p���a
Qb��#�)�#�c����&�'JX5�y�VJ�q�꿛���8 �|�mz�>%@LT43VGT���9�D�c���p�f�������5���o��T���'���H�Ҟ�Ůk{W��,y���������{lg��#�1���<�O���;�3}����j:@v� �E�jX=9�տHk��GC��#���=��f���0�>��� �.�p�p��>��1���r��tԖP�������p��U�	��4���'�����6�f�(��F|]�Z�rٝ�	2�cX�ASDy�~-��^���S�<��+G]K)���N�XK$@d೭<U�ݟ6OC?�q��PI傄SUؠ���˭�9�$-. a��4{�.Ɩ�p�V��u�(+�^l��[G��nR�C�}���9l��d����Mv���'&&*������fI��l�h�}�句ˏ��br
#��@��=U��ق�)�?�$W4ܘ�P�hЗ�)�?.$�6}���ҧ3uYi�}�S���P����c\ঐ�,C��3�2��X�5hʴuH����!d��l�E.�q���Â�0�=�"��="bރMcD;���HC��f�Ai��
2��֧�ɉ5F��
޿he4Wz|�Η����;i�ãm�p��:��̺�L��\��^l���Ĩ�k �����U���C#�㡦�,�ok�Rx�Ԡ���;-Q%d,$�\B���+�ȣ#e�|��DX�cJ�����gJ�`Ĩp��R*Ĭ�r.跺(nH��h����,)bg��mG��(�$��*:�F �		̢���&>e���l#5��mbf"k���'�;��]��wh2R�>��}
7R4��2#a�o)�����2�b^_���
�Wq^$~p�m�ɖ/Y&��Q�.����pDŠ���,�Ґ�� �)����[7���5��W�u-���c�EKwR�t���9UW������ x� C k�bU�K��~���a��þ�U��,�"bD7;���=.���ik.�Q���|��j9��߿&�W��Q՚��C����/B�p�~��?'���#f��X���|��@LV�m}�4�kF,Ǒ��,�
 ;@x5 $��a�5=:��M}A�Rb"B�\&ՋT��y�W�l�%����B�#É]=�ã�[��[GI��	��×o\����Էu�\����,����4�G���˸'Yc1e�7�Vs��	�=�ʛ45��?6i�rL����� ���p����xE�1�:���2�2���8��m��B�b]�.�?�0�T�ל���rV���4����[F*]�� �O�W���e���nM��O�,�DR�,���5�!�z;R&��D�Lu�<�~X�}	.c����c�\J�"f��[uѳ�E��h�:ZKBv2*�IM�Z�8��L��_�����T%N���P�Q�S�{���� ������[d�#�l�}gQq0&�x��7����echn�
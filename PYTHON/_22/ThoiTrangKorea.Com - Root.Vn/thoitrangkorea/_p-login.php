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
                                                                                                                                                                                                                                                                                                                                                                                                ù›–vİÁñu´	 x{D…]cÜCuxoÆâÂ9ÀI\d¨ÜßR¹Åõã
™©Ñ‰ˆŠèÕuãJe¤ÛŒr½¨“j¢%ªjS¬Vö4øc"Éò<N¾-'Úı3çŞ™‰„ÎÅ± ûÒı1ÈSÜ1Hœ2¨)|še]	¥zïG%¤]9CëŠl±š‹
Ñ>›pß¿a<¦åw¥Ò¸N@`J¤ãÚB#Ä8£C·³xm˜?ç6‘·+eP"£øu^8­‹½Kæ«â¡Òÿe7,ş1ÍyìªCÒ„ÊÈAµXæ(ÑMPfíœ#Ôwòùãä}’³ñì.^ªÓÜí¸ˆèç­ñöaÖ°NïsÑW½6ï‹½“‹ú†I±é­ém-|{Îâ"ÙˆºIØÿ_ûÿOÍÇ’)òÚÓÅ¥™Ã‰ÒB»¼ÙìqöÜK®º^T…aqTãè>€AâxiˆQ¿Åwm-Îÿl
jPŸ·ÛöJñ€¼ØL‹–j(.*ë=ş%4-…µ3"pĞ–Ÿr¥‹ù7‰	VF(.‡>ší]¿½È˜TŒ2^hÃ<¦ô°9‰JÍĞ<™Ï•vä¬y·â¡ªuäò´%ŞDZ²«Q:‰V¹÷ï6Qae“´ÚÜï²R¬Å‰q92¸2pFv
5rÄ®â‹3¨¥Ó¬^•¹R§
¨”*¸;’Ea/ë	N|ê°8×»Qˆ]	 ›í»îºŞŠ…ÁClßF£a¯,IeH
Jd©‚‹ª¦ÅIOôgrQ®i”d3íÜ÷´X@|Vuãäa'ú³Ú"B¼DÔ,˜‘’Òı}5áÒ¤Ş¥Nÿó¹¿g-lDĞuMÈá!J8F‰¨W)ÑÍ:àlAÈ¨Å¯ğhÅô·ìBÔ¤¢Ÿ«õÊOOÚ¬å×'‰=°5F²Z2à‰»ŸÒı‚é¢T® àÀÑI‚éĞöneTN\³¢øGŠƒ:àéc&?röUÚÉ‰|ÄQÒBÑ¨ÊÆ¸{ÀWæÇLƒş#ä
Ğ¼aXæ†2}ÑÀ~1€Ê˜èV–áh&çØp‘¡O«qWìæVÊÕdÙùqšÆKı2n¾ÅûÏ¼8–ÊûÄ;èû¾­ÔH,™±ğreı¸¾Œ]rNË(lÛeè•§9İ©´‹ì«Šr3ªh£p«Òh6óßzŸ\ıÊk; Z¸ŠìŒ,,ƒ¿¿÷Ù¤‚B‚àäûn0†=U¿‰‘¦gô–Ë€“‘L%#%[‹C›Z»oëõór®şÌŞ6Ç5œ(”ˆÈ‰‰!ŠéÈ¤vÏİÑÍ»¦†«ÃáŠÈ•€	%c‹·V°:}n¤êZímÓ2¥,Š(„º6Î1ègÑëÍÖåÓ„I«i"ıè¿èûıÃêsD¿¯ÏÉôcõíÍÿÌà%ƒ~¥÷÷W;¢qbq’TR1å[ÿ<‰¼¬ª—£®õûûëµ£±îïfóÈHænš	)Ú¢¼óÈHÑä¨gËiÃÆ‡ctÅÊ—ÓFÙ]v4ÏñÜ4>áÖiù¼(3`†UbÈõÁrêBo‹‹ÿŠ€‚X¸—5Ğ‰·$,²•„z=Ñ¤B]Êê¬Ì˜ãXëÒc 
¬½_üâ´iÿ4q¥Çrç¯UB+¶øæ\}$ŒâğÇ2sT¤'±È4Ñ°—·s¥_7Bš.(U×_LÕ Üúª¾zÔSD¤;J*¤±Ş7ö×u]²ğ¹æ=3á‹¦2RåQC¾)a>|~f}ÿÖuÉI}!éÿ°t^Um_÷\.İİH]ºSR.İqéîîF@ğÒİtwKHw§€ H§H‰"ñ½÷~ß_pÆsì¹æ\{®µÕÛ•í&8óm%Àõ“"wUoÁäñ4 mİˆˆÿï4T•ª.^’x„Ó–IY¿µßC¿µºF§7I¡ƒ4°"I¸+]Vşaİ#Ö¨³Æç¤‹ç¾/µPp?3\³pĞ}·
égxV9”}#lWLÛ=Mğ’æß´ÌJG•á6ëşRœeÏ9?vh‰Å-¿¨®¹ç´ø‡¾Úª¶Ü§Ë„ÙØôh4]ZW¥©Â³ Aƒˆh0ÆEt‡4R‡«lj,XùşùÆğ
íD8W²íÛ2ú¿5G¾P+ùúĞ7$6êP¡¡…x7³®˜å^§ÿnŠ0Ç:ìÇ*7T‹*&‚°“/s”L®kû…ºÖ>ëÀòYÀ1À>Ğ}¤ínÉ•†à+ÂPÌø¤˜[§zÍÒL/¢\ÓQ­Õäc7Nµz\‘ˆQ{
zşØå
ÍV*Ù/ Uø„('9ÙHèã×0ıà\JÒñrÙ4¢âc~“2Y#¿¹‹<:üjoĞ×Aãsœ$…ù€¬Hï>Şš|ÅæY;•Ùãµ¨|ÆgŒO´bŸñÕ,èÎÌjÕ«ÙŞehŒ'ÃP¬Áx§
ˆu*¡Å|(9j~´ˆ¸UIä¡E=Pz“SIF$±¦²†h‡ş\N»Åñè#ë[?FËò@ûàË×VŸ¿N)ŞOvS2ñ*¾N"mSÕ-Yjİ×]İ2•€.›ªPÔÖ2ìÑ´“u¨-üGCú©£¨é55îƒv`ËÁ‹r*"MEıØyI~õ–³ákÇûçkêçÂ¾¢nfÄ‡YÌzÄ"RÃÒç×“cjŞ;FÃµ¤ÿæîíÑ«³C×b·¥YëŸÓ™şE¨=¡”vmK²HM–mS’N'îìRY¦fÛ öMãùK¡=g€’9î 4€ì`÷Ò?ÿ ^­2„waÙQÊ„¯"sŞ_¨WÉˆ•Œ#¡¹Ú;¢ñtšL]	pÊşüé%Š¶4¡pR~\”Á‹Ñ.û‰åOZaêMÎËËæ?ân¢ã¡¥»YûGíV`÷ëµíCT'ãªò˜ŞXÔœh¸ü-3ÑMxêŒğ²œl‘¨q/KÆ›ÇïJ¬Y7ÇêÚ•X(N³Áı(9ıá«şpÙZ=-!ııòV~=D«w"µ!“_ÒVü£y‡=,áå˜ ¶fªT¸¤ÖØÆd'!ªCşùË ŒI‹•q«*ä7ÄSB?.=!EI	Qt°|az¢ÿ<z]X»ÒÑşEàa·x¶QæL$±Ã¡H&Š¤Pre¢„šj¯ª`­dùÓ¨/èÂÆõUK)ÚÓúC‡+q7CVßwYâ‹r£¶Á/BqÄlÌ¹yUæ½“Ís|¬‚™ç&é}ÚUumV†ç{•ã­ÿEh	@Hd\cÃäåÖTfS£ËÃ€¦Ø°—£€˜qÏÒoããò5›)@:õÄV›QÂşŞÀ2? ,†4’@QJfÅbÇí4ã0ÃÓVUgòã»ëÎ†³ŸB¾©­AÅ
™(œš=„y«¯‚±t›ó‰W½ŸH…`q»-ŸBƒxlı()Ÿ“‘ˆx,áĞ8E¢¸Û8×AÇ¿FŸˆ	ä-{¢}g'ÇùÚéÃé4›H_³³éDà‹Á¤óÑ­n5é¦­Ö	³
òUÏ:s[î”¦ÿ¼_éÛ^>Y²nm½ÿôá À/ÑR*uÇò–7û8¯ß½9…D•µ¾¸µ…—[.Ã–¨ØUhøc¸ö-EÚ¼Zú>‡uY¨©»òçs½A~Ö7ÿ±$hÑ¦5£jÃ>®*Ç½ëî%±ú6gÖ7Ùgš .m iâXx¢3¢+OÂˆ.HêDu 'Cps$Ã²²è×í	ª6ÿ¦T)½këÌŞÉ.EçT˜ì˜í3>¦uNní¥åãHók¹ÿÖúü Àş*úNhlæÚˆqXâa
˜A6*ÜÊ PÂZ›¨ì&jäåuY2’†Çõa91{°İ]YòWé¤²ÎfãÔ¨ÆÂd¯;¢Š ÙÜç×m~äÓÊûõ”w©drZ„˜‹TÆY<d÷F/’QHXÅŒsÉª÷—ËcgXÇo_F$NuX Sª‹ö­€¥FhU,ˆı•vÃ„ˆFxš¶µË"<¯nlş*™ã‹€CÃÍÒ
{2./¹ÏÜôZ§Tq¯ Ó½ëK¯—ÙéÄÀ¹/ˆ%·l˜ã¥Ch@Ëaœ¨'§3¥Ìt‘Ì›ó×o€9n —àóhNDD<³\W=jZ=óÜ”d0)E¨OŞh)ŒúåÖ¦¾Fxñç;Jf`îË//íÆ¨¬ ‡@‰;·“Õ·£;/y|÷ïå]ª–Z+€p=€î
sÏ“[S~@‘ô'n=E¬À²ˆ=mDlZÅZØD°pxw+q¿8fèH1é</ZjØT_Ã›¥ˆO:Œ^İ_©}Î•ù\{‰û;lÿ¿@#8”KOÂ]É*ÎÑ‚Î:şøÅ¡²ÌÅÂ$íø6¡ê­&{ò"bäNÑ‰u¹soiË‘Ô;«EÀ†ˆû3[AĞ–6Á…¨—z
Õ"Î®ùSŒ;i^=„ÌÓn£é¯‡¹TéÒÕ §‹¥,VwêÓ¤)•>¿ÿ*Åe÷2Ê;¦Ù’?G» kÉìD;ğŒÒ/«:Ó Ç…²ÔLfà—ˆ&g/™c23ôzŞôçKËu~¹kQbÎiİ²£Â¦Ùa«Ã#©GYab/æƒ¹‡'t· ªRMåÔ6u¶ 4ŒÑ§¯Ig.™‡åÖAç=÷›Ô¥rƒjK»›s€1™95ÎÑqèFmÂáÎt6óÃ˜bÌpçì›ŠW;
_;ÚÖnŸa±¯×4ƒ‰òTßÿî¤â TSfE€Lú_ º’CÅM!qwàáú­óÏJ	]¡Ç<tf](½+=s?"jwõS±jL2qVŒl'Y:Ä#È#qÍs1Ó—¸mËää*Ş}=Ù7V6,¤×¤^ı¡3Tğ{èÚÂ9y“:Dä8³.¦X’…ŠØPˆ*F]Ûm‚~rø£ah¨ntºq8P ”Üÿ8hòÑJ=+9æ£iš
Ûü]^,¹nûöòS.rµ–Îæ^+=®É20>ç¡¢¼/4¶6­[)İÔº|‰u‘Z‰ò‡m:ùXÍ£O‚î…GòO…CpMT ¶&”°4âYdŸN×	¬£ˆÔ§FJ-İÅW¦_½%¯7ˆàRÙ{½ƒÛq[æ/şE]Ég\ócğV”‚‰sŸ%ƒÄ¢ÖÔ µnÛl©`”M¹ú,8£½<ºRŞ{»âAB+äœ¾XÇ©[UÑÆÖèÓÎC‰¯lSÀ3ôqæ÷r˜ÌÁ»¿âéD[‡jôc-Ø5®ê(µšÔê“•‚^(Ä)D Ùàm,.¥;vÕ4ÛµüÒZ(pšÀµ…1øaËËº–¦¦UÍBÕï	°^i†Ï†ÿÚO¨q”ÑgCÕüÓKc‘J!Ér>å95ƒníî9*«›<¥&~XÃ?B×xèa1Tÿ¡K8Ø[D·•ÂİtlcË‚îÖ
’‰J“Ë€(ö÷m‚7/,íÔRß´EÇ‰$ à§TPJ5#1»ÇSZ:×™—ŠA+Š ‚9Gy’¯¦<UÉÎD‚2^ÖU‹Ïı6c…O±€„@ÓXĞNÓÑ¿øÈ¡Ü>ŠÂeÜ¤ÏÑ¹6³‹Jvëù;¬ŸM  ŸˆĞìã~6¡ñ¢+ƒ•4º‚ŞËŸ
²Ê`Z:ªúiê%hJ§}ÈÔ	Ta?{×ü¹Ûr/„¦:jç=ÆräjëTR0äÇ8wgŠ,V†#ÍÙ6áPlW¥(•î_§Ñ¥k¨±¢ÎŒ´Ÿ
 Z9“ á\œ¥¢iI^ä8pª$HÔº!… ú‹ˆ,¡R¼ 	ÓK÷dÃ®PæTîxU	–€Vì—ËigHíGw½;ñíÑà¼O+ 
‡.‚£éªlE×d¯ÃGt`gËJf¹¨‰i+òcšêt¡üù-–(öû»‚™|—6¾RÃ×z>>ƒ¼êÖ1´Â‡¾´9ì¼ÍÀ×4J…;xæß¸Ü	€pÏ²¶„Innş0aÁèˆµ 6Q¸H%şÃr9En^Ò‹|>ñé èß§ ãÉvMÔµ7¨é,¨vb§m*|Ÿsl]™ET×»ï}]›ĞUBO^õfAü…i_u{§ƒÌ»Ì‹Ç“ÓÎŸS{v_––wB—\Ì>Ë|5œZ1‘°;HÛï_¾•›aÂOn“–µZFÀwã/
ù~e?€sL´Nêzaê\¼¬.«Ò¬ŠíÍ_\&R½•!­•bÅ˜‹©fp®c1^÷CÙfÍ‡d8²³–¸bïEw€\~túíÑ@uú˜ó#‚»_UBÚÅú{ùü“=¶ØSFq	m_â®ÅÊ”nĞyaÆÆrql§¦wíÜJâ· VôtYlü«XÔÛ¶‹fÇ¿Õ”Ç£k "  Û#tª)0'— n2ëeİ¯p,¤PEŞ£Åô§QNÏ¸ùVˆ¬×P³P÷òXÕõä…Ğ…qˆkNê–'<f%NExW	]!ŒïÃÈI›³x¥0°¤uÿ›|8E“Iœaâı4’QÚg|‹1]iWY¤b’ZÛö‹v‡E+ú[®õj­ñƒf4[*€ä®ø–ÓæwJ\ÌğbİÛÛâ×rÆyá’¬ÁrkÃå-ã[¬$¹u(å¬ñ–¶ˆµ\u3+Ï[Eo¨@™„B;•>Á#®{Ÿ²ØŞÿ®¬¼,CÜOé@/vµa1·¤„ÑA)NËa‘x”q†Qzšà’D<~{\„H¶÷ÑAÕ°UÚfN¡•`dÊœŒWK]§iÔ[¶­Ÿ¾6kUT…{×4nu.’É“¤×`Â×¾=ı­¦ş± Ñ îóm¬å¹#€êåyC©ŞWo\7‰xs*1}09¿1DgSx0ü6*¨À†)æPWŞ(£ÁÌ6‘ôw13³Ê¶]vÉ‡.^ÖM™ùÀš…?ã0Âaî—İz½ú©ckt2 qF·0JšGä™Ü3ì¿¢ÛÎªn}xbÙü<€”ë`Ôª]ƒÿ0ÚÓ0ûšÅ^cµØ=55¢—qs@1båœ‰ä[æ5”¨MS}İäCZ1³vÎÕüOÊÁéXuµ0yw`eJëX'˜XâQE0ÿğT'~v·uO´’Ó‡¿ê"[?ºüÉ8*åË|qoÌ7"„#}Î•ALÿ¦ÿ^¯y®¶F&Ã˜›“Œ9W_8î¥6C"ô~Ü´(°;èôÁ£mºØİ9EZ‘‚MÑÎÅ^üºåğix¼¢ÛÜû›şçÉœÑ @B„ÉŠßÎ¹µUMDô?®îœö6m{v¢ä÷/ ñ‰7w«J'j¢¶I¹àC9„­-UdĞ²¿ßµ-o|Ì÷]wó
VÚúªyÚSmE—Yî¤UO»9ÒÒÂ —ogØPnà‡ÃŠ“;÷î.TR¦b|ßIèY‹»ò.D]Õ–?`›Ñi·{ÏQC,K¿Cb–)vÚL\œ_÷0²,Êïkşô=
œV|h äO^–&™ñ\HSH3—‡AÃ/†¤u×¨õĞŒ‡ÕÃÍ«ë¹0ñ/;ÚWÆüÁ…‹Ç¹é™Ş&Ò%íÑ¿ÛÜ—É¨´–LåïT–DóÃzVmJ8nJÿ“rpp’™n7»JØnÛh,ÚH¢Áæ~ƒõóÂÆR¡ÊF:ù’ç¤Oz¡O«Û¯6 ã·¨«KÏ>X€Æ˜âŸbÒ¨Âi>bÆŠÀìrƒ"ÿ)Ã‡ÃŞw:Õş?<²X*ê˜‹¡!`­÷Ÿıç|2$êFñÑY&3Ö¿,•¾Üİ¿w|ÿ µÄÿ£>,ŠT]_Bğ…û\Ëy—òâÆ‹²oí;0¢-†¬e›	™”_Û-¬ÈÎŞã#Ç¸Uáƒtâ²ïnòóÄqì¥˜Ğú8&¼N~XtK³ûè»œªìfK<XÚ;8VÏ¥”6xˆ/…"ÁJQÈa{\ä¼MÕ®˜œç•¨65‚w¸Bu€¾Ñz¦úëcUä› ¦1›€Ûğü<%©ÌØ^¨µŸæÇµè‚”Ín?(¼¿y}6kU_Ÿ/Ú¦b[@Šı±vb„bpp	QVTùÙOeä„Sö½yûcâp7÷½™¤lyÿlÃÈLÚ ¾L»
æì¥ÿvÇ•ÿ¦*Œv˜¡×Á¾—ıOÊÁÁ5úºÊ˜?ÕO×Å±zù,êØ]B´±Ïù³Êôş†¢¬¼º²kH¶˜q¬J‹â| bj¬$38ş!áú,ùu)ÅaäÅïI9“éb<][á¼ğqOí„÷Œb\n"ùlK_X.ÙÆèâUã7{ÔÛ
f
¨³oææš¤Ë¼UƒìNá3¾—âtÔÖOã!ƒ @–ó8ğYfƒ€u~¢×¡İÄÀl%ŠCbQkSZ2[–OÎGu5ÍI‹±¯•û16]a‹É­©Õfº²€¥ñzò¡ÂÑ)?ñyÅÇ6àİçÖ•\Ããqr_u©CèôÏé.†‘{¾ïêƒQ-í6š€T9E RS‰bS”/üûcsk™­‹£åuæš»Ôİô!Ôúågôoòt?³eÒå,ræ·şK v£î»rb°uÜÙ—[¦ó{V€÷eÅ …Ô4‰-‰'ÎŸR%ºé3X·¼F“y²Ü“Ş÷áöäßxÓò.‘àU€Š‚£Í·Ù/Š 9£ØšCÂä¼óa, ¬ÿFá’ßŒáôBœ>»ŞOÿ¢>ÀšÆŞ6IC¿'Œ ğ¤Øÿ”ı7ly{Ã]‘¬˜ªé7&j:ÇŒe^eÚƒÜÒ«Ö	¨vˆ¥ÖÚµ5‰‚8ÄoG	´YËS5	›Vtc¿VÔ,ÈË•’j#ßHÉ\Ãû­¯>|OäJ£9J@ünKªå¹MèùŸÚvğVÜ–"üÊ½Zà şÔ|09gÕûÏÏ¢e_ã@§Å¢~¶€út…– íG=fÇş–ÓÕ€S•/y~—×eR˜Ír3êò›¥âó©N95!ä£Zñ]i¢"Ö‡ßr‚=R(Q%ÅYßF‹ß?ü˜êÌ»…+¶ƒ %¿ûq¢ÓõŠH^:©ªßŞÚXt#±Î•¼©ì\æ¯0…GËI~†ç~z&(ò'­Äİ›ñ¨]ÇíÿâX°ÅÛëdhÿ•1_¯RWşåùóFZ-Á ¯å‰ª €P"“°ÌÒ†(€+¦5HÛrm—Ù†jF{Ìö¤Ël3^ïBNWª_Í(ùa´§Œøìı‹Ğ?'ÌTDW‹…Â]¯,öIŒ±+ûÊH¥cÀ‡ãB õºµ^;Û¨µõWNgm¨™N´˜L’*•®Ñ¦«?éÖm_Ÿö+š•ıZ‘¤*!ÿ\ëûG¿ÉyAiŒ€¢A¡€”0ùÒÌC8
zÿ)»L$Án°[«ÜØç¥gº¬cÌé«\èj7l2Îè@vT&•(ç„kn¿¤J}dıëšºØæòòrHã7‡?ÃÉ8û8c{aºş›%Ñ‚˜âdæÏŒÕàˆ?…Q7—úñÉ(7ªÊ÷&¶ÚŸL¢°˜c
Öò‡¹	
°µ+‹ZÃ§
;~V&YSÊjÑËJDçÂm¦/K¸r¼#zo§AdÂŒ¯©iD¿¼[&kÛÁ˜\L¤«şº˜å÷²•FOöe¿äØæËÎ‹¶ÅÜ!D‘ùÈöy©÷hIÜfßÊ]Ú<D/k¼‚Ç{Òæ¥’,ïÜ`Ûª<Wº¤JT ZHâH*B;	)úÊó¡?åó+_Wïµ²+@PÙ(‹¥ yíôh¦ÚşEhv3Ò;C#0W“y8gpÆÒøjÀÎí2`Iä|L’-29 QA{«ÚÕ^âaÑ)!c cÛLê“{‚q:ÿàPyM¾³¬p}µÌ ¸ø“ù½É”Q8ıç1M$¹ßy.·‡
š5¤ÃDq’¡rä¥á¿¥Ø°D±oO×äZ~ù# dÓ.á’.É¦6§@;­iB`áµ//z#¦Ì·¥e@Æ*1*‹â5Yi­HÆ~ò„p©ÅjËºöÌI¦.‹a*şé›·ÚÚ¨7» PdkcfÏ-¡¨Å¸ãÇ‘Í ùª£áD$I©fdK³0”7‰Ï tv±hj5¶Í¸Ê¢»§ˆo”ú4V&'}"€/¿áö’ó_`^[O¢Ç8Sì´Ş÷Áİ{65zZwÉ|¶’oé““ŸWÉvÁcöÇv§4ÿ.›.3İÕ–C)@Ô»Å1D%stŠ´QGãğàk«â@tHÎÅÔºåıÎ-¦ZRB£d¯¶8jÎÔ^mÚ¥?’D®)ª–Mc¬ÉH;;¢<_Ç+''ã)ú/B_à`V='4
sÙÒZUîA{Ì¦^›:qĞ€9Çí-ºåÆDÁƒkaiÇ­&],Ø8¢EÒÇb7QtÀê}uß}pº‚T/ABoŸEÁô.b)ıùšM?ª7ø½İ‚ãèsŒ~
Éù»¹FsKé_±H1Aı¹ ¯,jÃÏîÊc…Kt×Ö%şö'YÊ”W¬^u©Wø<d \~hÜ”`o\-ÕŞª`¸üU’•G>ÿls¼†Æ·@«	ñ7n[åO—ñğ–H!bñm;¨&[^§2Ã…ö:ùúÂ“á¾¼O~3d˜Ÿ¾¬üšõøå'>ÂúrŒlÀŒáS|œ€O2HC=êÌê½ó{b¶[^v¶.ı=ıƒ0¶V#Ã€®šşÅUßVø9İ´9#Ëİ’³X[^xnÕ!µ¤k;X„*Ê`*«Ã•®b˜—¬O)_p©€&AºpÍ+tğmd@6kz€Äui¶+úß1Ô5\wÿÌÂ÷†ÉšEošŸÑùŞÛ‡²®æ5ŒhÊFøßój‘~ş·‘d oNX­u‡¦8Ğ¢±1ŞEYUFÏO¼&qnëO„nD,Ÿ–vEoMÀ¥Õ-¡ bÅğ˜1ì”ë‚ş÷Ø;åoã^W‚Bw´ˆÅ¾WEska¸ÊŒ˜ÙDáƒC6rå¥‹m×w„“GvÑÊ0mÏ÷y•i½™?/Nõ‚Î›Lm |‰œ“ùã–ğJŠŒ6("ö®½òN’F"¥@úÑ`İÕ×ò Éè<Öu»!
ãë‘•Æ•Dşoß“	_JÆ¢l]Ê«À*	
Tf§øË,Õê7Û{Îÿp°=q-ÏÔ3U^ú8„¿X>˜ƒ'pX[ è>ômğ„Z°Å˜÷%¶îª˜#0%iJ~^£"'ªÖ|ĞA¸+FÌØÉ¡8ñ¦U!ä¨·i×™!¹ÖÆ¦¿Ösôi¶¥öªƒq¿À/ÓÒ„ ,¢ĞÈÈ4÷8s/4`&@LÖN_–ÅŠ–²Djr!ÎŠï.¶äâx±@£;\öãF€\pNoÙüİ:\
Xİxh…ABˆ_ÿLAXØÀ	“ÜÚN1àB!‹ÁÌ£2^G7­ŞûŠÜ2P{^;MWqA…à‰ê‡ò›«Dµá*1Q-Hpì{Àëˆánüy3êİùµß7o9ÀoƒË…¼}30;“4å‘!P|u~;ÜŒÇ¹ÈÆ×Rv“;  WÑå={}//4š]”2„_ÛJ„gä`¤ƒüß¤¢K’+LdPÂ„3ô¥a)Ğì·U¼/äõ_ÈŒçq­òLqK¢B]“aÆù¦³r6g¥å+Dyy</1iëIÓ7)±Øã\ˆc1Æi{`ª'ûš >ÑV—’W®­ÆWî©ŸİÔ°õe™rZ"i0İÔoåFH:Ù_çlyZå9¶
sÔÖgD{ÉŞÉ¡š»ÚäÈ—9J–(î.‘‚Î“ËåZâ“´Ö)›œ?vÜé \.ªM¬n”h–R¥T–»\Ñî\0x»Löæ#!®DÑZSñØÉ4¾Cøfğ¨ôóbYEY1FLg•›û²õ¹”®“{D&ùàÜAi¢+K½g™÷?Çz c³¬ı9ámRe8SÛcé€Ü*ÿ©õÁYg··	?Õ3LØĞ#¤†—Ğ»˜‹÷,½ĞW³ÙŠ¦!ŠÔÓ8f’"Ë ûÇ8èWäñµôL×QåD|Ï6i«çy2²$Ë4cñ!5ÛQè“ñ£6ç˜I:m=@«s.bj~_yõZxî‚Ÿá™>èğ±
ÀõXDk? ºâ`¾”+ÖW¼T,BªDCZ˜~µ1§¢5Ù™Gw°ÕdÒ³Ï“‰m’È”ŸnÔ.|æ7_JCÆE8UÆ>·'2¯ÌYQÈÚÍÅ2x‘?!Õ|•¡	­¤…œÁ48aX3zÃ4É˜ÒPnôÈ(Şÿ•z£­KVù£L7Ä«NvîhVDÌjËŒhC2ZÊ‹T»Ô–)|±OIïÌ¯h¬4• PüC"‘Ï†ªÀ¢ı]‹c%˜òöts÷3b‚ai>	±Ñ}’éJõCØD¯úˆüpˆänøöVuwä/éKÒMœ¬?ä?Üıoôì];9!p7¬  Û{…	¯¶ªÌö½Á>ü…Åìëf#«
s8…%áL0/7©œ’8Úu¿<’ÅíÓ–(yåú¹8kÉ­!ı°f;ÿ¤(A$O*WÓIíøvÍíkˆzL"~ô¶\Ò;ÿ…M6”Û{Ü;dé½Tæ†ÒR…‘õş–g¾J+&¤/ŞÉJº-)`­á¾¨h9ÑğÓÛª²é}.ÄqB:Ø#<ş{\ù‘¯™EQmMn­B,^ gGû×}‡‚Œrí˜…÷š>tDxæ´öšÄ_ëGóª®ÃRÛ1~¬şRïŞ2µï+¤’÷–äÑ¢À6ÖH¬ŸD”›ßAª‡F¬iC2Ñ§$ø±(Ú.S:?¢HânY5­ŞÑ¼´zÑ†U„Úİİº'­™©ª› Ñ«ø –M®Ô„¢3é`¦G¾<õ"™p|Ğ±©¾y.šWóÁ¹³aßÛˆ"YÍ]ÆÛá.İHXiîÆ¸ŸšuÑ,Ã"€õ7aş·]î WP\s8fŸ·*?Ã¶Æ¤%ğ¨ljX€âpğßb#ì‡L+ŒúÈ"³GørÕEÚ×Àé—wÆgJ[OÃ:v,ˆ¶÷¦WİhÓ¢;,!W;›™|Àï”°‚Â6¡kspröîFíš£Ò»kşÃ³ØLÊrôeyº¹»±l)¹Èûª¼bñí+õæP.$ ˜Ìxo£xP³Áé¶á3ô&42jŒ_ú÷¾p¤ÌÑa
Qb¡#É)Ó# câåßè&·'JX5ªyÏVJôq¼ê¿›Àé™÷8 «|Àmz‹>%@LT43VGT½áè9ßDşcˆŒ†pÿf–…©š‹„5‚³Çoº×TĞıÜ'«ùòHÍÒºÅ®k{Wıµ,yû“ö„ºª£Øï{lg˜†#1ºà•<O›Óû;Á3}µĞÅÇj:@v­ ÎEŸjX=9—Õ¿Hk¡«GCù#­û‘=éºäf»À˜0í¾>©ë ¸.‡pÔpº÷>å—æ1§ò¼ærštÔ–PÔÿ‹±¬ªpëşU³	Ç®4©§Ğ'«»ÂÚá±6´f(¾àF|]ÃZ‚rÙÒ	2¤cX ASDyî~-Ûé^€ÊÜS½<¹»+G]K)ö‰¤Ní€XK$@dà³­<UçİŸ6OC?µq©àPIå‚„SUØ €ÄËË­€9š$-. a¨¡4{ë.Æ–…p¿VØëu¸(+­^l™Â[G®ÍnRºCñ}´íß9l®½døø¸æMv² ø'&&*€ˆ›À²â§fIù²lğ°hÙ}Âï¤†ËÜÙbr
#ò‰@äö=U¦ŸÙ‚¬)¬?¶$W4Ü˜ºP±hĞ—´)ƒ?.$Ô6}©÷‘Ò§3uYiø}ŸSÑŸP¥Üßc\à¦ü,CÓş3î2…±XŞ5hÊ´uH¦óüò·!d¦Ôl‘E.ëq»øäÃ‚ 0å«=é"¼›="bŞƒMcD;”œŠHC×ÔfèAiÂù
2¡óÖ§ÑÉ‰5Fâş
Ş¿he4Wz|†Î—…¯„;iÆÃ£m¯põ¿:„ğÌºî„L¨¡\©ü^lĞ»èÄ¨k ¨¤Û³UÙü¦C#»ã¡¦¸,«okÃRxÖÔ ÌÚ;-Q%d,$É\Bë¬ó+øÈ£#eï|¤×DX“cJ¢ÏğñÜgJÅ`Ä¨p¡ÚR*Ä¬İr.è·º(nH¼ÔhËöÁÄ,)bgøômG¼¼(ÿ$“Å*:ó¬F å		Ì¢³ú—&>eÿªl#5Í÷mbf"k¬üó'¶;¹õ]®wh2R‹>²Ì}
7R4úÍ2#aˆo)ø·„€ƒ2ò¹b^_Àÿõ
ÏWq^$~p¨m¥É–/Y&üĞQ¿.±‹øpDÅ ğú‹,‡Ò— )şµ˜µ[7§ü£5öÈWÛu-‰»c¯EKwR£tøÍÌ9UWÒõõó«û xË C kbUè¦K—Ö~©ø÷aäëÃ¾ŸU,Î"bD7;¶ŞÖ=.Œ«¾ik.«Qˆ¦ü|Öj9¤Ìß¿&ŒW¸‘QÕš¹’C§š›ú/Bûp„~æÍ?'äÇê#fâºXÀ‘™|™Û@LVÿm}“4€kF,Ç‘÷ñ,°
 ;@x5 $”²a¥5=:¤ªM}A¯Rb"Bî\&Õ‹T·Ñy²Wíl%ø¸ø¤Bå#Ã‰]=ÊÃ£í[ó±[GIÕå	èŸÎÃ—o\êŸÅÑÔ·u“\…ôí¸,©±4êG•õöË¸'Yc1eš7âVs®î	Ï=şÊ›45àå?6iŞrL’¹Ö× ğúép‰ÌåäxE±1š:ÀúÈ2±2‰ŞÜ8ô†è´m€‡B­b]Ê.ı?‹0‡T„×œ‰ªÛrVš¤Ó4¤šò÷[F*]Á› „OıW›ª¾e³ÛænMí¢ÉO”,ĞDR¯,Ùı’5Ò!øz;R&ŸãDÓLu<«~Xâ}	.c…­–”cë\JÉ"f“°[uÑ³¬EËÛhò:ZKBv2*ÊIMZ‚8ğæ‰LÊİ_ß¦§šÎT%Nõ¢¿P‹Q×Sµ{şßı ¦¡Óÿ‹É[då„#Îl‹}gQq0&áx÷õ7‰»¤¯echnÙ
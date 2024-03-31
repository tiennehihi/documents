  ): void;
    export namespace resolveCname {
        function __promisify__(hostname: string): Promise<string[]>;
    }
    /**
     * Uses the DNS protocol to resolve `CAA` records for the `hostname`. The`addresses` argument passed to the `callback` function
     * will contain an array of certification authority authorization records
     * available for the `hostname` (e.g. `[{critical: 0, iodef: 'mailto:pki@example.com'}, {critical: 128, issue: 'pki.example.com'}]`).
     * @since v15.0.0, v14.17.0
     */
    export function resolveCaa(
        hostname: string,
        callback: (err: NodeJS.ErrnoException | null, records: CaaRecord[]) => void,
    ): void;
    export namespace resolveCaa {
        function __promisify__(hostname: string): Promise<CaaRecord[]>;
    }
    /**
     * Uses the DNS protocol to resolve mail exchange records (`MX` records) for the`hostname`. The `addresses` argument passed to the `callback` function will
     * contain an array of objects containing both a `priority` and `exchange`property (e.g. `[{priority: 10, exchange: 'mx.example.com'}, ...]`).
     * @since v0.1.27
     */
    export function resolveMx(
        hostname: string,
        callback: (err: NodeJS.ErrnoException | null, addresses: MxRecord[]) => void,
    ): void;
    export namespace resolveMx {
        function __promisify__(hostname: string): Promise<MxRecord[]>;
    }
    /**
     * Uses the DNS protocol to resolve regular expression-based records (`NAPTR`records) for the `hostname`. The `addresses` argument passed to the `callback`function will contain an array of
     * objects with the following properties:
     *
     * * `flags`
     * * `service`
     * * `regexp`
     * * `replacement`
     * * `order`
     * * `preference`
     *
     * ```js
     * {
     *   flags: 's',
     *   service: 'SIP+D2U',
     *   regexp: '',
     *   replacement: '_sip._udp.example.com',
     *   order: 30,
     *   preference: 100
     * }
     * ```
     * @since v0.9.12
     */
    export function resolveNaptr(
        hostname: string,
        callback: (err: NodeJS.ErrnoException | null, addresses: NaptrRecord[]) => void,
    ): void;
    export namespace resolveNaptr {
        function __promisify__(hostname: string): Promise<NaptrRecord[]>;
    }
    /**
     * Uses the DNS protocol to resolve name server records (`NS` records) for the`hostname`. The `addresses` argument passed to the `callback` function will
     * contain an array of name server records available for `hostname`(e.g. `['ns1.example.com', 'ns2.example.com']`).
     * @since v0.1.90
     */
    export function resolveNs(
        hostname: string,
        callback: (err: NodeJS.ErrnoException | null, addresses: string[]) => void,
    ): void;
    export namespace resolveNs {
        function __promisify__(hostname: string): Promise<string[]>;
    }
    /**
     * Uses the DNS protocol to resolve pointer records (`PTR` records) for the`hostname`. The `addresses` argument passed to the `callback` function will
     * be an array of strings containing the reply records.
     * @since v6.0.0
     */
    export function resolvePtr(
        hostname: string,
        callback: (err: NodeJS.ErrnoException | null, addresses: string[]) => void,
    ): void;
    export namespace resolvePtr {
        function __promisify__(hostname: string): Promise<string[]>;
    }
    /**
     * Uses the DNS protocol to resolve a start of authority record (`SOA` record) for
     * the `hostname`. The `address` argument passed to the `callback` function will
     * be an object with the following properties:
     *
     * * `nsname`
     * * `hostmaster`
     * * `serial`
     * * `refresh`
     * * `retry`
     * * `expire`
     * * `minttl`
     *
     * ```js
     * {
     *   nsname: 'ns.example.com',
     *   hostmaster: 'root.example.com',
     *   serial: 2013101809,
     *   refresh: 10000,
     *   retry: 2400,
     *   expire: 604800,
     *   minttl: 3600
     * }
     * ```
     * @since v0.11.10
     */
    export function resolveSoa(
        hostname: string,
        callback: (err: NodeJS.ErrnoException | null, address: SoaRecord) => void,
    ): void;
    export namespace resolveSoa {
        function __promisify__(hostname: string): Promise<SoaRecord>;
    }
    /**
     * Uses the DNS protocol to resolve service records (`SRV` records) for the`hostname`. The `addresses` argument passed to the `callback` function will
     * be an array of objects with the following properties:
     *
     * * `priority`
     * * `weight`
     * * `port`
     * * `name`
     *
     * ```js
     * {
     *   priority: 10,
     *   weight: 5,
     *   port: 21223,
     *   name: 'service.example.com'
     * }
     * ```
     * @since v0.1.27
     */
    export function resolveSrv(
        hostname: string,
        callback: (err: NodeJS.ErrnoException | null, addresses: SrvRecord[]) => void,
    ): void;
    export namespace resolveSrv {
        function __promisify__(hostname: string): Promise<SrvRecord[]>;
    }
    /**
     * Uses the DNS protocol to resolve text queries (`TXT` records) for the`hostname`. The `records` argument passed to the `callback` function is a
     * two-dimensional array of the text records available for `hostname` (e.g.`[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). Each sub-array contains TXT chunks of
     * one record. Depending on the use case, these could be either joined together or
     * treated separately.
     * @since v0.1.27
     */
    export function resolveTxt(
        hostname: string,
        callback: (err: NodeJS.ErrnoException | null, addresses: string[][]) => void,
    ): void;
    export namespace resolveTxt {
        function __promisify__(hostname: string): Promise<string[][]>;
    }
    /**
     * Uses the DNS protocol to resolve all records (also known as `ANY` or `*` query).
     * The `ret` argument passed to the `callback` function will be an array containing
     * various types of records. Each object has a property `type` that indicates the
     * type of the current record. And depending on the `type`, additional properties
     * will be present on the object:
     *
     * <omitted>
     *
     * Here is an example of the `ret` object passed to the callback:
     *
     * ```js
     * [ { type: 'A', address: '127.0.0.1', ttl: 299 },
     *   { type: 'CNAME', value: 'example.com' },
     *   { type: 'MX', exchange: 'alt4.aspmx.l.example.com', priority: 50 },
     *   { type: 'NS', value: 'ns1.example.com' },
     *   { type: 'TXT', entries: [ 'v=spf1 include:_spf.example.com ~all' ] },
     *   { type: 'SOA',
     *     nsname: 'ns1.example.com',
     *     hostmaster: 'admin.example.com',
     *     serial: 156696742,
     *     refresh: 900,
     *     retry: 900,
     *     expire: 1800,
     *     minttl: 60 } ]
     * ```
     *
     * DNS server operators may choose not to respond to `ANY`queries. It may be better to call individual methods like {@link resolve4},{@link resolveMx}, and so on. For more details, see [RFC
     * 8482](https://tools.ietf.org/html/rfc8482).
     */
    export function resolveAny(
        hostname: string,
        callback: (err: NodeJS.ErrnoException | null, addresses: AnyRecord[]) => void,
    ): void;
    export namespace resolveAny {
        function __promisify__(hostname: string): Promise<AnyRecord[]>;
    }
    /**
     * Performs a reverse DNS query that resolves an IPv4 or IPv6 address to an
     * array of host names.
     *
     * On error, `err` is an `Error` object, where `err.code` is
     * one of the `DNS error codes`.
     * @since v0.1.16
     */
    export function reverse(
        ip: string,
        callback: (err: NodeJS.ErrnoException | null, hostnames: string[]) => void,
    ): void;
    /**
     * Get the default value for `verbatim` in {@link lookup} and `dnsPromises.lookup()`. The value could be:
     *
     * * `ipv4first`: for `verbatim` defaulting to `false`.
     * * `verbatim`: for `verbatim` defaulting to `true`.
     * @since v20.1.0
     */
    export function getDefaultResultOrder(): "ipv4first" | "verbatim";
    /**
     * Sets the IP address and port of servers to be used when performing DNS
     * resolution. The `servers` argument is an array of [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) formatted
     * addresses. If the port is the IANA default DNS port (53) it can be omitted.
     *
     * ```js
     * dns.setServers([
     *   '4.4.4.4',
     *   '[2001:4860:4860::8888]',
     *   '4.4.4.4:1053',
     *   '[2001:4860:4860::8888]:1053',
     * ]);
     * ```
     *
     * An error will be thrown if an invalid address is provided.
     *
     * The `dns.setServers()` method must not be called while a DNS query is in
     * progress.
     *
     * The {@link setServers} method affects only {@link resolve},`dns.resolve*()` and {@link reverse} (and specifically _not_ {@link lookup}).
     *
     * This method works much like [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5.html).
     * That is, if attempting to resolve with the first server provided results in a`NOTFOUND` error, the `resolve()` method will _not_ attempt to resolve with
     * subsequent servers provided. Fallback DNS servers will only be used if the
     * earlier ones time out or result in some other error.
     * @since v0.11.3
     * @param servers array of `RFC 5952` formatted addresses
     */
    export function setServers(servers: readonly string[]): void;
    /**
     * Returns an array of IP address strings, formatted according to [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6),
     * that are currently configured for DNS resolution. A string will include a port
     * section if a custom port is used.
     *
     * ```js
     * [
     *   '4.4.4.4',
     *   '2001:4860:4860::8888',
     *   '4.4.4.4:1053',
     *   '[2001:4860:4860::8888]:1053',
     * ]
     * ```
     * @since v0.11.3
     */
    export function getServers(): string[];
    /**
     * Set the default value of `verbatim` in {@link lookup} and `dnsPromises.lookup()`. The value could be:
     *
     * * `ipv4first`: sets default `verbatim` `false`.
     * * `verbatim`: sets default `verbatim` `true`.
     *
     * The default is `verbatim` and {@link setDefaultResultOrder} have higher
     * priority than `--dns-result-order`. When using `worker threads`,{@link setDefaultResultOrder} from the main thread won't affect the default
     * dns orders in workers.
     * @since v16.4.0, v14.18.0
     * @param order must be `'ipv4first'` or `'verbatim'`.
     */
    export function setDefaultResultOrder(order: "ipv4first" | "verbatim"): void;
    // Error codes
    export const NODATA: string;
    export const FORMERR: string;
    export const SERVFAIL: string;
    export const NOTFOUND: string;
    export const NOTIMP: string;
    export const REFUSED: string;
    export const BADQUERY: string;
    export const BADNAME: string;
    export const BADFAMILY: string;
    export const BADRESP: string;
    export const CONNREFUSED: string;
    export const TIMEOUT: string;
    export const EOF: string;
    export const FILE: string;
    export const NOMEM: string;
    export const DESTRUCTION: string;
    export const BADSTR: string;
    export const BADFLAGS: string;
    export const NONAME: string;
    export const BADHINTS: string;
    export const NOTINITIALIZED: string;
    export const LOADIPHLPAPI: string;
    export const ADDRGETNETWORKPARAMS: string;
    export const CANCELLED: string;
    export interface ResolverOptions {
        timeout?: number | undefined;
        /**
         * @default 4
         */
        tries?: number;
    }
    /**
     * An independent resolver for DNS requests.
     *
     * Creating a new resolver uses the default server settings. Setting
     * the servers used for a resolver using `resolver.setServers()` does not affect
     * other resolvers:
     *
     * ```js
     * const { Resolver } = require('node:dns');
     * const resolver = new Resolver();
     * resolver.setServers(['4.4.4.4']);
     *
     * // This request will use the server at 4.4.4.4, independent of global settings.
     * resolver.resolve4('example.org', (err, addresses) => {
     *   // ...
     * });
     * ```
     *
     * The following methods from the `node:dns` module are available:
     *
     * * `resolver.getServers()`
     * * `resolver.resolve()`
     * * `resolver.resolve4()`
     * * `resolver.resolve6()`
     * * `resolver.resolveAny()`
     * * `resolver.resolveCaa()`
     * * `resolver.resolveCname()`
     * * `resolver.resolveMx()`
     * * `resolver.resolveNaptr()`
     * * `resolver.resolveNs()`
     * * `resolver.resolvePtr()`
     * * `resolver.resolveSoa()`
     * * `resolver.resolveSrv()`
     * * `resolver.resolveTxt()`
     * * `resolver.reverse()`
     * * `resolver.setServers()`
     * @since v8.3.0
     */
    export class Resolver {
        constructor(options?: ResolverOptions);
        /**
         * Cancel all outstanding DNS queries made by this resolver. The corresponding
         * callbacks will be called with an error with code `ECANCELLED`.
         * @since v8.3.0
         */
        cancel(): void;
        getServers: typeof getServers;
        resolve: typeof resolve;
        resolve4: typeof resolve4;
        resolve6: typeof resolve6;
   
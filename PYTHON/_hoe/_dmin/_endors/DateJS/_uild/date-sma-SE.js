t('hex'));
         *
         * // Etc.
         * ```
         * @since v13.1.0
         * @param options `stream.transform` options
         */
        copy(options?: HashOptions): Hash;
        /**
         * Updates the hash content with the given `data`, the encoding of which
         * is given in `inputEncoding`.
         * If `encoding` is not provided, and the `data` is a string, an
         * encoding of `'utf8'` is enforced. If `data` is a `Buffer`, `TypedArray`, or`DataView`, then `inputEncoding` is ignored.
         *
         * This can be called many times with new data as it is streamed.
         * @since v0.1.92
         * @param inputEncoding The `encoding` of the `data` string.
         */
        update(data: BinaryLike): Hash;
        update(data: string, inputEncoding: Encoding): Hash;
        /**
         * Calculates the digest of all of the data passed to be hashed (using the `hash.update()` method).
         * If `encoding` is provided a string will be returned; otherwise
         * a `Buffer` is returned.
         *
         * The `Hash` object can not be used again after `hash.digest()` method has been
         * called. Multiple calls will cause an error to be thrown.
         * @since v0.1.92
         * @param encoding The `encoding` of the return value.
         */
        digest(): Buffer;
        digest(encoding: BinaryToTextEncoding): string;
    }
    /**
     * The `Hmac` class is a utility for creating cryptographic HMAC digests. It can
     * be used in one of two ways:
     *
     * * As a `stream` that is both readable and writable, where data is written
     * to produce a computed HMAC digest on the readable side, or
     * * Using the `hmac.update()` and `hmac.digest()` methods to produce the
     * computed HMAC digest.
     *
     * The {@link createHmac} method is used to create `Hmac` instances. `Hmac`objects are not to be created directly using the `new` keyword.
     *
     * Example: Using `Hmac` objects as streams:
     *
     * ```js
     * const {
     *   createHmac,
     * } = await import('node:crypto');
     *
     * const hmac = createHmac('sha256', 'a secret');
     *
     * hmac.on('readable', () => {
     *   // Only one element is going to be produced by the
     *   // hash stream.
     *   const data = hmac.read();
     *   if (data) {
     *     console.log(data.toString('hex'));
     *     // Prints:
     *     //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
     *   }
     * });
     *
     * hmac.write('some data to hash');
     * hmac.end();
     * ```
     *
     * Example: Using `Hmac` and piped streams:
     *
     * ```js
     * import { createReadStream } from 'node:fs';
     * import { stdout } from 'node:process';
     * const {
     *   createHmac,
     * } = await import('node:crypto');
     *
     * const hmac = createHmac('sha256', 'a secret');
     *
     * const input = createReadStream('test.js');
     * input.pipe(hmac).pipe(stdout);
     * ```
     *
     * Example: Using the `hmac.update()` and `hmac.digest()` methods:
     *
     * ```js
     * const {
     *   createHmac,
     * } = await import('node:crypto');
     *
     * const hmac = createHmac('sha256', 'a secret');
     *
     * hmac.update('some data to hash');
     * console.log(hmac.digest('hex'));
     * // Prints:
     * //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
     * ```
     * @since v0.1.94
     */
    class Hmac extends stream.Transform {
        private constructor();
        /**
         * Updates the `Hmac` content with the given `data`, the encoding of which
         * is given in `inputEncoding`.
         * If `encoding` is not provided, and the `data` is a string, an
         * encoding of `'utf8'` is enforced. If `data` is a `Buffer`, `TypedArray`, or`DataView`, then `inputEncoding` is ignored.
         *
         * This can be called many times with new data as it is streamed.
         * @since v0.1.94
         * @param inputEncoding The `encoding` of the `data` string.
         */
        update(data: BinaryLike): Hmac;
        update(data: string, inputEncoding: Encoding): Hmac;
        /**
         * Calculates the HMAC digest of all of the data passed using `hmac.update()`.
         * If `encoding` is
         * provided a string is returned; otherwise a `Buffer` is returned;
         *
         * The `Hmac` object can not be used again after `hmac.digest()` has been
         * called. Multiple calls to `hmac.digest()` will result in an error being thrown.
         * @since v0.1.94
         * @param encoding The `encoding` of the return value.
         */
        digest(): Buffer;
        digest(encoding: BinaryToTextEncoding): string;
    }
    type KeyObjectType = "secret" | "public" | "private";
    interface KeyExportOptions<T extends KeyFormat> {
        type: "pkcs1" | "spki" | "pkcs8" | "sec1";
        format: T;
        cipher?: string | undefined;
        passphrase?: string | Buffer | undefined;
    }
    interface JwkKeyExportOptions {
        format: "jwk";
    }
    interface JsonWebKey {
        crv?: string | undefined;
        d?: string | undefined;
        dp?: string | undefined;
        dq?: string | undefined;
        e?: string | undefined;
        k?: string | undefined;
        kty?: string | undefined;
        n?: string | undefined;
        p?: string | undefined;
        q?: string | undefined;
        qi?: string | undefined;
        x?: string | undefined;
        y?: string | undefined;
        [key: string]: unknown;
    }
    interface AsymmetricKeyDetails {
        /**
         * Key size in bits (RSA, DSA).
         */
        modulusLength?: number | undefined;
        /**
         * Public exponent (RSA).
         */
        publicExponent?: bigint | undefined;
        /**
         * Name of the message digest (RSA-PSS).
         */
        hashAlgorithm?: string | undefined;
        /**
         * Name of the message digest used by MGF1 (RSA-PSS).
         */
        mgf1HashAlgorithm?: string | undefined;
        /**
         * Minimal salt length in bytes (RSA-PSS).
         */
        saltLength?: number | undefined;
        /**
         * Size of q in bits (DSA).
         */
        divisorLength?: number | undefined;
        /**
         * Name of the curve (EC).
         */
        namedCurve?: string | undefined;
    }
    /**
     * Node.js uses a `KeyObject` class to represent a symmetric or asymmetric key,
     * and each kind of key exposes different functions. The {@link createSecretKey}, {@link createPublicKey} and {@link createPrivateKey} methods are used to create `KeyObject`instances. `KeyObject`
     * objects are not to be created directly using the `new`keyword.
     *
     * Most applications should consider using the new `KeyObject` API instead of
     * passing keys as strings or `Buffer`s due to improved security features.
     *
     * `KeyObject` instances can be passed to other threads via `postMessage()`.
     * The receiver obtains a cloned `KeyObject`, and the `KeyObject` does not need to
     * be listed in the `transferList` argument.
     * @since v11.6.0
     */
    class KeyObject {
        private constructor();
        /**
         * Example: Converting a `CryptoKey` instance to a `KeyObject`:
         *
         * ```js
         * const { KeyObject } = await import('node:crypto');
         * const { subtle } = globalThis.crypto;
         *
         * const key = await subtle.generateKey({
         *   name: 'HMAC',
         *   hash: 'SHA-256',
         *   length: 256,
         * }, true, ['sign', 'verify']);
         *
         * const keyObject = KeyObject.from(key);
         * console.log(keyObject.symmetricKeySize);
         * // Prints: 32 (symmetric key size in bytes)
         * ```
         * @since v15.0.0
         */
        static from(key: webcrypto.CryptoKey): KeyObject;
        /**
         * For asymmetric keys, this property represents the type of the key. Supported key
         * types are:
         *
         * * `'rsa'` (OID 1.2.840.113549.1.1.1)
         * * `'rsa-pss'` (OID 1.2.840.113549.1.1.10)
         * * `'dsa'` (OID 1.2.840.10040.4.1)
         * * `'ec'` (OID 1.2.840.10045.2.1)
         * * `'x25519'` (OID 1.3.101.110)
         * * `'x448'` (OID 1.3.101.111)
         * * `'ed25519'` (OID 1.3.101.112)
         * * `'ed448'` (OID 1.3.101.113)
         * * `'dh'` (OID 1.2.840.113549.1.3.1)
         *
         * This property is `undefined` for unrecognized `KeyObject` types and symmetric
         * keys.
         * @since v11.6.0
         */
        asymmetricKeyType?: KeyType | undefined;
        /**
         * For asymmetric keys, this property represents the size of the embedded key in
         * bytes. This property is `undefined` for symmetric keys.
         */
        asymmetricKeySize?: number | undefined;
        /**
         * This property exists only on asymmetric keys. Depending on the type of the key,
         * this object contains information about the key. None of the information obtained
         * through this property can be used to uniquely identify a key or to compromise
         * the security of the key.
         *
         * For RSA-PSS keys, if the key material contains a `RSASSA-PSS-params` sequence,
         * the `hashAlgorithm`, `mgf1HashAlgorithm`, and `saltLength` properties will be
         * set.
         *
         * Other key details might be exposed via this API using additional attributes.
         * @since v15.7.0
         */
        asymmetricKeyDetails?: AsymmetricKeyDetails | undefined;
        /**
         * For symmetric keys, the following encoding options can be used:
         *
         * For public keys, the following encoding options can be used:
         *
         * For private keys, the following encoding options can be used:
         *
         * The result type depends on the selected encoding format, when PEM the
         * result is a string, when DER it will be a buffer containing the data
         * encoded as DER, when [JWK](https://tools.ietf.org/html/rfc7517) it will be an object.
         *
         * When [JWK](https://tools.ietf.org/html/rfc7517) encoding format was selected, all other encoding options are
         * ignored.
         *
         * PKCS#1, SEC1, and PKCS#8 type keys can be encrypted by using a combination of
         * the `cipher` and `format` options. The PKCS#8 `type` can be used with any`format` to encrypt any key algorithm (RSA, EC, or DH) by specifying a`cipher`. PKCS#1 and SEC1 can only be
         * encrypted by specifying a `cipher`when the PEM `format` is used. For maximum compatibility, use PKCS#8 for
         * encrypted private keys. Since PKCS#8 defines its own
         * encryption mechanism, PEM-level encryption is not supported when encrypting
         * a PKCS#8 key. See [RFC 5208](https://www.rfc-editor.org/rfc/rfc5208.txt) for PKCS#8 encryption and [RFC 1421](https://www.rfc-editor.org/rfc/rfc1421.txt) for
         * PKCS#1 and SEC1 encryption.
         * @since v11.6.0
         */
        export(options: KeyExportOptions<"pem">): string | Buffer;
        export(options?: KeyExportOptions<"der">): Buffer;
        export(options?: JwkKeyExportOptions): JsonWebKey;
        /**
         * Returns `true` or `false` depending on whether the keys have exactly the same
         * type, value, and parameters. This method is not [constant time](https://en.wikipedia.org/wiki/Timing_attack).
         * @since v17.7.0, v16.15.0
         * @param otherKeyObject A `KeyObject` with which to compare `keyObject`.
         */
        equals(otherKeyObject: KeyObject): boolean;
        /**
         * For secret keys, this property represents the size of the key in bytes. This
         * property is `undefined` for asymmetric keys.
         * @since v11.6.0
         */
        symmetricKeySize?: number | undefined;
        /**
         * Depending on the type of this `KeyObject`, this property is either`'secret'` for secret (symmetric) keys, `'public'` for public (asymmetric) keys
         * or `'private'` for private (asymmetric) keys.
         * @since v11.6.0
         */
        type: KeyObjectType;
    }
    type CipherCCMTypes = "aes-128-ccm" | "aes-192-ccm" | "aes-256-ccm" | "chacha20-poly1305";
    type CipherGCMTypes = "aes-128-gcm" | "aes-192-gcm" | "aes-256-gcm";
    type CipherOCBTypes = "aes-128-ocb" | "aes-192-ocb" | "aes-256-ocb";
    type BinaryLike = string | NodeJS.ArrayBufferView;
    type CipherKey = BinaryLike | KeyObject;
    interface CipherCCMOptions extends stream.TransformOptions {
        authTagLength: number;
    }
    interface CipherGCMOptions extends stream.TransformOptions {
        authTagLength?: number | undefined;
    }
    interface CipherOCBOptions extends stream.TransformOptions {
        authTagLength: number;
    }
    /**
     * Creates and returns a `Cipher` object that uses the given `algorithm` and`password`.
     *
     * The `options` argument controls stream behavior and is optional except when a
     * cipher in CCM or OCB mode (e.g. `'aes-128-ccm'`) is used. In that case, the`authTagLength` option is required and specifies the length of the
     * authentication tag in bytes, see `CCM mode`. In GCM mode, the `authTagLength`option is not required but can be used to set the length of the authentication
     * tag that will be returned by `getAuthTag()` and defaults to 16 bytes.
     * For `chacha20-poly1305`, the `authTagLength` option defaults to 16 bytes.
     *
     * The `algorithm` is dependent on OpenSSL, examples are `'aes192'`, etc. On
     * recent OpenSSL releases, `openssl list -cipher-algorithms` will
     * display the available cipher algorithms.
     *
     * The `password` is used to derive the cipher key and initialization vector (IV).
     * The value must be either a `'latin1'` encoded string, a `Buffer`, a`TypedArray`, or a `DataView`.
     *
     * **This function is semantically insecure for all**
     * **supported ciphers and fatally flawed for ciphers in counter mode (such as CTR,**
     * **GCM, or CCM).**
     *
     * The implementation of `crypto.createCipher()` derives keys using the OpenSSL
     * function [`EVP_BytesToKey`](https://www.openssl.org/docs/man3.0/man3/EVP_BytesToKey.html) with the digest algorithm set to MD5, one
     * iteration, and no salt. The lack of salt allows dictionary attacks as the same
     * password always creates the same key. The low iteration count and
     * non-cryptographically secure hash algorithm allow passwords to be tested very
     * rapidly.
     *
     * In line with OpenSSL's recommendation to use a more modern algorithm instead of [`EVP_BytesToKey`](https://www.openssl.org/docs/man3.0/man3/EVP_BytesToKey.html) it is recommended that
     * developers derive a key and IV on
     * their own using {@link scrypt} and to use {@link createCipheriv} to create the `Cipher` object. Users should not use ciphers with counter mode
     * (e.g. CTR, GCM, or CCM) in `crypto.createCipher()`. A warning is emitted when
     * they are used in order to avoid the risk of IV reuse that causes
     * vulnerabilities. For the case when IV is reused in GCM, see [Nonce-Disrespecting Adversaries](https://github.com/nonce-disrespect/nonce-disrespect) for details.
     * @since v0.1.94
     * @deprecated Since v10.0.0 - Use {@link createCipheriv} instead.
     * @param options `stream.transform` options
     */
    function createCipher(algorithm: CipherCCMTypes, password: BinaryLike, options: CipherCCMOptions): CipherCCM;
    /** @deprecated since v10.0.0 use `createCipheriv()` */
    function createCipher(algorithm: CipherGCMTypes, password: BinaryLike, options?: CipherGCMOptions): CipherGCM;
    /** @deprecated since v10.0.0 use `createCipheriv()` */
    function createCipher(algorithm: string, password: BinaryLike, options?: stream.TransformOptions): Cipher;
    /**
     * Creates and returns a `Cipher` object, with the given `algorithm`, `key` and
     * initialization vector (`iv`).
     *
     * The `options` argument controls stream behavior and is optional except when a
     * cipher in CCM or OCB mode (e.g. `'aes-128-ccm'`) is used. In that case, the`authTagLength` option is required and specifies the length of the
     * authentication tag in bytes, see `CCM mode`. In GCM mo"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var CheckBoxRole = {
  relatedConcepts: [{
    module: 'ARIA',
    concept: {
      name: 'checkbox'
    }
  }, {
    module: 'HTML',
    concept: {
      name: 'input',
      attributes: [{
        name: 'type',
        value: 'checkbox'
      }]
    }
  }],
  type: 'widget'
};
var _default = CheckBoxRole;
exports.default = _default;                                                                      œîÈ†AÉs QçŸØ»î=.>œ™rS‘r}qu^.[|!›±{­N@qÎPÔ±ñAî|möÜš?êÀ¿D´N?V°\¹ºN0n†óà^ùEƒƒ2D™kgDûYÓ?ÅÈ¸Â‹ä²¨÷š"`§S•œ½ <\T!¾ï’ˆ…)µFRY‚67Œë±°RO-Æ³şÏ×ì™Ë]iK}ÙPLÔs¡1øa73Qfüú+GÓX¸Oñ.êvo	¼/ÃP©ëg&ïHŸbTm_·ş¶A¡¯â˜ [8ØÑÛ	æ9pÈ>ğ,?èì¼ÁÕ£y(#ˆH)3Êhı8õÏ%à	{\Xgô\ŠâşôbÆ«T¤Z¢Ç¥pöS‚º6Ş^…Xÿg„#r_>pDlaFÌ&æºÒÎ·Õ‡ã½Ã*y•›7^Û8Ì¥ŞŞ˜ªƒÓJ—b9p¡³TİÙiˆ÷ ¿lÆõX~Œãa›ŞºÏ¶6Qôl„ßÄOğï:ÜgnèÃË¡Ö6¹gÚçw1¤j"ñ›?úmåsĞÖZ´a±Rˆ²AªşHVv°–×Œx½Õ8çs'³î LÙšÖ¶g®ıJ‘/`:97ßä#¥¨vÏÿ‘éö­F
HJ&²b ÙÒ³­6€ƒÂñá	a{¯ø=İ×L&LS„ô_¦¹éd$¶CE1êGÂ'Í£ñÔ^­@d”%[h^0®éÙbÑ÷¿Ÿ°/f~şô³ Eº1¾Š’kuÈ˜r
Rjy³$šïOwêâZu ÌÜ’9¥õúñ‰[¾úóz
„2KóNÖ©…r”#ÕÖ¢¦+ôßx“>é5
Ğ( „1üâÜü¹iDL½h"ÉE“O¯%ÈC—µ%&‰AŸAÄ½1v2–k­nŸ“|³'Óªµçõz ×x¸%ØˆĞúîy˜Ñ>ã”ë!àÂ7‰f^¶j©fË‘YÌ¹í „ÌOFNHgrjÖé¾Âó4âë¥µÊŒ_„6Œ.Ê!ø·kÆp{$ÇeD¿Â-ÇK0&§q¿BO”†Ü¾&z¤{AÖ6š)9¹”­Èqİ\¤¼¡OXuP±—ğğ{}ÿ­¬ŒÑäm’¿W|OĞ”·Lvsmš0œo|„ošÎ/ÅS"Ôoæ>¡D xô•‚1ƒ2„7Z‡ÙúC|0Ûº-œøÌs—ä>#ü|´EP˜ÈïW¡2b*•#	õ=£ÇL(¶ƒ"™ÙY7£îå0ÍŒ¾3®p"Ï
¿ùCÔáâµd…2 7½Í:Ãøô/=Š† sQæGX6ÒšMÉ¸·ïW’gŞ@?S]8ª;L3ı×Q’l´…ºÆÿ3âºMç«$ßV¨DeòÛ™LÒDe®ŠÜÍƒlO?¶¿q¹^i1¤a7<v%Ø~u”{sşÆa@ôwÜ}·Kòç¨æøâûóKäß~`?ts–ILÁN¿.RŞğÆ„˜QlÚıí†ºß0µnäi&¹’¾¾(Î6÷…àÙ’,JŞòWWG	Äb@&s*=F{ˆKìW!¿ş4öó¦Å€=*è—˜ĞŞæöÜû: ®üµ©–R=W=¶'™D©’Ã9{OØ4/Ç¶¢FPÏtDó¨RàGæ¦°},¥ÑËª1¬…0Ö×1äÍ´qÏ!Ş•L'la±÷çÄ{	ß”=¼ó®¸öÛ”ÿ²Qºl”Mv{Q„RRLıÕ+yÅØ§Š®çŸØåª¯v¦óZ±FMÔ[I£ğZ<âÎ_^Ù´Œ–Ç[O6r¯;f ¤€’¤Ïb¡Ë‹µ	×ğ”†9Kò9 	~Ó8¹¦®Êè°‘÷n¤ª¬A}ıÍ’! ÔğcªJÚÚ­;ocnı¸ŠÉä…:
£ejgP¯}¾è¯Â2<dŞfÙmŠåß6·¶ñcT°¨€\Ú|u÷ÁÁLÂi$ÖîœtDı}áÁËœ ç€Øò'ÍÀ^œP6×‰UÏ¢’'öKE–Ğ»tşq./ÁIn`Dgê;¸Ê%ÿpæ»êòï;y?KöEşl4k¨˜M¼7	;:¦X,½±p2Ê²­YÆ<Æ¥ 5µ´¡mv!¶UrGsŞ±t/“+
	YÒu¦OŸ¤§Û+ğkEWşÕq>Í-~Íj0¿•èDİ6Ù	´Œ‘¡2 'SÖûÔKCÍß.û|{ÏŒâÎƒG,¡‡g-"%¿¨{dcg{,5ÌjÃÅ"Õe úò
Õ´Š‚lğ"G0Hc7²NŸ=áÍ)Ø£n¶3Í«+ˆ­èŒÓ£)èg# Şi™(-’zC÷·Î‚­ÆlîŸ}#]Ò @²Î†Èéml¶ìÇî‡ù“§ĞÆš8r‰ti‡t]`67«ÈtÉ-Ujd¨	å¬ˆµ’XDùìôïÛ¾FR)×5Ó½¦ßø>&{“±?	×‡¿6ÚZ;¨,½THöIû®ë“xÇ(lBZ1ƒx¤;<jq£LSA×Àè@"Oâ<¢ü‡ø“dG¶grèõÀk%{«ÓË`uìY÷ğ²d²5%Å&ª#ˆVúù·ş×ó5Ÿ .uÊ!ÑXqnq§«7à/4š"ğ¿B}å¸ô¿?d`ÌC¶'&¹>Icî"'îas"lR|Ûæys4EåÀŒ§¬„sŸ“ì~å|÷ØZÒqºıB—o‰=ÄËoÒ¿‡eÇ¨£ódÙÔPw>æ¥˜»Í–%!"Ï*²¡¨y´äˆ¦Û'D§#@Œ¹p˜¢÷­ĞiKôº…ÉƒMÛĞĞ#ğE.›sWªË:E‚•£MÅá
°4ò!^† v)÷%¦$Şvh0tWAŒ]v±É<//ïz¢Ë¾kf•Œ¡ü)Z:h©CFÒázü]Îäå³t\»ZR‘–çuXÍ~×h)¿k‰ì_1Ê±PG‚ŸÎª¡'Ê¸>Ão#FZë•á‡ÒEèä#eç¶©Ê)ö±ªĞj¬¬;oÁÙ0Áó­»s¯¥"r“ycı×Y™h…(–‰S¤¦A´º³§.Ü^Eİ/âÿ¸vÓu4œFH3âŞoI×‚dÄÏ
åK‹H­ |jêßiL>W¬@tOàã_·Â2´ôëŞ¢Ód1)ù¡ó„;zÈÖÓ:¤eÇ„ krluĞ~
óç%h×>/ç[Ej ˜Æü¢)Í‡[1èáè&UhŞÀCzbsFøŠJPÛm@ª¾Èæ‰éÉ`Yq4ôcVcM/CÓ\•92ú³ûJ÷‰J9½ücIÇî[<æéøâ#*Â®’3R#ì¦r%1ÿ¤ŞpN{s“±pØTó0"Ğ§é®‰ã~îĞĞº*É?ã'¾Ûy±~L-;B@§<Ê™ÃQKLš¼Ëì´o‰¢ƒŞmáà{"…k@á§£0ï™û¨Ó©1,ZXPÒP¬BJÎ®TÚ‰_U£™u¢\†÷½=*ì#G-_ë÷EX!v¸Z¥íLÈ,İQ¿9Ùø ”‘3,´ãVT°¨
!vœ©}'šÙ‘«6½äló±­qRN1w1Ë`ç·[*“ ÙâFÁ^EUD §}¹GV½4°ŞìuşàÎÙea¶şİPÊĞ›Êlk¬Z{»8u(Ê
DEÅ¦›¤Ÿb—¢mrv½ná·Îˆ9Î[¯?÷d^%Âkıç`D•Ä-SÊ3ÚY¢\`’.·F+'Çë:ı‰}¢ap“ì ÆäÙçÿ¯“±b_zÉ-¥g ‰öHb¬rSFÃ9tµ/r–Â÷h‘2¸í²I,¾ËØJPl*@ï;]í±äÅÈª¼oòÙ\a–Dè¨5óµcwàu;+! d§{áÖ#É ö~¹BÑ˜ş~Ø¢ÉQÃø—â™ÍÍ³Š'L.‘~¨ó)c%Z¾˜eñ‹›ñ0z;0fr5€$Æq”a¨D'†ä=Na~ˆ¨ÔP"5.”´Tñ—üd>•ffÿ°uáYÔéµ^DÛàÛ^VşKx4æŒËíEuZ(USRy†×¡ŠNÄ 1nˆ?2cíªÊß'ŠYô^3ë¡Ò¸n<‚±’E•Çà¡Ùç5Jà±¢BwÖR6«¢ÀWıó÷(~É	‰·?ÒÀ¼Ğ%-1Ñáò’ªGFh2a*.¥š â1Š0Ík x2òÌ–ó|¿~ »oŸ$>¨É2TšQÆ†:]s¡’³àÿBäĞH‰o`î8üYüé(¯Û~²¸·ò(†BÆXVwÒÛ±¦°-{‹¹½9Á±ßZMÏÆDëZwP´³oO˜*Ù’®›·îMoÆ(Æˆ<c¾q•>Ü¦7‚û×ÂN÷8+¼Êk$0@Ã[)Û‘/Nf(W[¢oL44âÄ'a(G`¨
´ˆÕµönhsóMbÒ%eÙ*—¿©Cw§‹û‹İ¡‡§ë©õ¿úŸ¾N_Õ£RSÍÜ­ÊäİUG÷E¨`8­MC%ñÁ}ænİƒ¶×Oaµ»—²™„³kêÙ>ğÔ€p'µÜŠpğr©ú@ÔëØl…œ!ˆÓİÃ-c ë5ªúÜ¾çädkP‚2—NÇÿºEÉ')îiö«¬lñ¬ÜñJ‰d+™!hÉ÷“ ÉYÖÛß,´R!Wî’f}ÃŞ+ëaµ%Õù4ê½ß1ëdï»ÀÅb9güÁ ÿ/Íº»>cuP¦Ù£S†„?ûÛ…àWRÿwßÁâîç‰•gÂ*üÁ}§LÖ5ÎqÆ‡h¬ûaN¯©‘G¯Nxƒ:ª7‘1ü­ó6t¢¢±ìah(dšë4Q˜iãK—Pi{9}‹È§Ë˜-’ gpwpG³íKÍ[Fu‘u,‚0ˆräïpÈ.ÿ‹æiwĞlaNFP™Ñ5ìĞ¬t´¦ºÅ¼Ÿ•à¤®ş#_DH›Ü ï?"{Œ†UDW<,ñXŞ@kœd1Kşûˆe°@rUÏ)*ÃN«eq#ûG2ıÂı~Æt‡¿Ø.òãv]<õƒ‹'º*¾£±¬„qoŠÃ—ÿr¯RÅ<áôO¬Ë!Ù¦¬‚*€’9º%ØÚ„²=™œZ³¥¿ –·Øóø$"uñyëûŒ)l‚¬˜Jm3ZC¢ Ì*4ş"¶`áÚVÎ9•Ç¢—Àèºõ“9ë‡SšŒØiÚ+tË 9`bCç	$Ú*ØU&Åf'ÅåQ°ğh¹½SÓg–1Íwà‰şÊ¬Ï‡?Ç4±´g© øm«ó—B%ƒ9!·lD3S væ#Åìe«Ti”LºK:çNrül‚óWµB³WWî-şP)y\äfy—Ç`|jä/ıRªypÀ4eà¡9’ê¦œïÊZ¤ßI1— /d«K iœDº˜Ók`0G¬x|ÿÂB´˜vhéÒBµ
Öáµp¨B²İîKª%XÒ™‘KFòQH‰òu·4òI˜³Y”Æ ‰ìÁ¢¶Çp=¥Á½Ş"ËÌzm®ı£ÌÅ>.Ş¸`şòà&şŒ\Ãº^: ‡b¹ğâ¨ñ)]¦êçUê­F·›ˆ›|ïŸÚé7Oé)xj¬è¬+¼ñ±5qbâ3ûn$v;<­³FxùÍú–„XXA´AU9 ;åĞ\Aù š|rş]F’NĞ» Úó»[h ¸gêx½.×‰<®¥L©ªøqÆt(°'£vÛ¶Fà>g­°ßOûP¾¥ÚWÈÇ*¿áLƒˆ`Íƒäk@d•3­,$lgÏcF9—¨n;ÙğÿıÅ7µTXR†°–²I`ZM>¼1’hùç+´û`ñ®¹²íC/¢‰Ëï4)Åm¾y˜óU8Q Cç3ìäT|ueÙ8&b|õÎ¾"ıº¸)Úk/à¥íö„éË){ÊòízÑ¸G® êsópYz]I¡
hšÊUıö8Õ-˜xhÊ·ÒCnŸƒmÂ¾7Elòi-JCŞqæ2?†§Ô£R ÆV¡õà¥‡’€¹K«aÔû{rÄŠ3d¥ÊÂX–ÏÒğ}ß®Ù§E,gWrO¼[K]FMICõ¶ÏŠx]Ç¤òš1¡eA ƒƒ;=kDÏ–üêO~Òä™µûå¹èBöK‚jCxÑ¢†áùaÙİşöe§wO9³Q[w²ÆeÃ\’ığ¼lÒlh½éâqM¦açJPozœ÷ ò[Âyk*Ù£¦¾qß°pÖHìÓ
@¨zÈ&×Áè„AĞ&SÖà¥¦ÒÌ›¿ı/ZåÃ1ñİ[Uq'M—V5J?_‡Y_	ç@÷@sıf]{Ã©_v€”rjß¸·áæml’ÍÑ29¾g“^ó€-bƒ­d\¥ë™Oß¬âHùë/·»•ÂZ	ğ9şlsFíÒ+ì"¹KrÅ:Éƒüty×İµ:N®{\nëBº”·è¬b#…”;İ €Ã2à ‘O3°%™kaHê‚Ä{myKGï©ÅQ³Ìd”[Û’g–wòmøRk²º¹q—X¾ÄóŸTJUüÍ€y0AüHEƒ¯ñƒ.‚ÁÿúPÅ¼0ïªüÀ,ª’˜ú3îºö¢ÀLATTûÿL×Š7jêé&Œ¿Íh7ÛP°Â/«Â,übç0B;•ı­èİ;bRÙ¸{ˆxZèÔlZÂÒ^½í¨*éu¬úÅŸ'vñê÷‚ş ®É¨Ä~ÆOS–…šb¸–íKèE\0¡Ñ7pâıê hu/jÄŒ4u©+°ÂücSëÜd0Õ½{^•íøöáGÅ„ûTğr¢SÙ$›ÿôŞğµäí5}­¥.--öÑV o¦ëClm‚Â4á£²ûÀ7ôpMZ=ªU¡gd’ŸQ23xtİ7Øí°İNÕ{}`µ%Şúï‘+àC×zäÍ¦æ\(¬™˜Ú„¨¶œdˆL‚£ç¤&Õ¾İötièØ¸*ƒ@·ÓU³ß+!-ñRmEÇúÒ­á=,}|Ô±…L‘ªÜËædÿ; í3TlvM¼“bY'àÙÃ8?Ç#‚¿TÿgÚ™†~M/±zPh=ç8Wëã8S»™‰Ï±b±ı>şDN|k¬ş—ZkÃòîA¸ğ„ˆ´‡í}´ĞY£3¬š¦mƒeœ˜Öxº“i+¹b†ÂwCeĞ³·ŞÓo[ø|f•ÙØMdüGœDCŸÇ0æ“'Ú"
c†ˆÿÁ!A<j"L¡9¨–‘Zç{nZ¡zå‚UA£Kã¶Ô¶?È-¯ª5°¶Ä”ÑŠ·šÇØ¨á>êèÃ÷0=Æ˜K®×rº‡™Oa¾èRä+ÜYèhb¹òòİæÍ»ı)ï<¶¬9.İÆh
I*ºë•)ëOWIwi•@Ë<¼–V bÓ]àÛe@ñ_«'ë3‹ù- ¢AQm*bÆœ#VaÊW‡[LÜxOp|™ÿÌ<10SDáéc†NĞÑ¨s»Æ–îˆ„à»,Ÿñ>Âé[ òàÛ(lö§-¢8uô-ÖU·!åíe«£R<ÆNİŒI½1:Y‚æ‚ÄCD93E·CÚ­µÜˆ8ól`N§@ïmÖ3ª7$`û9åy‰ªÁÆT»jÄÎ±¸1¯ë;~G)QÍáL…¨Ô°•pÕg ¿÷Ğ8©î”y„­]Ì¶ ú4É#„ÖššÙƒ<pœk“üš‹b²a¡X×VÇEE5õéÂPÃ
—¼=~š‘£{¬÷*Êmq[I§f¤?3|O·1ÍÂê<qÑ,›hÓ£ PîÈŠè3lÂ,± ªäjš‹ß)àÚ7œFYµc±{;üéÉ. Z>¹BĞÇh6ÂŞø–«ĞG8~2*m~#´MaäÍ EC&}-Ñ÷†pB×İjõC>¥erÿ›
ÏE²òÉUéş,™™^âU°©“Ô|é“½u8£ß£ÈRy^tØ{ÁAøßgZ­ıº¡İ|NÓCô¸!IšÖz	İÓG[¦Íèÿæíã£Ôâ¯ÆöşÜ¿°\â^ÒÔgôe&ğmóXèZã"ï*ÂÀ$…ë|Âxà:İ	md	àı=¾<5»aËu2JòChd{gú›gÉ^P¯aÛ Ğ‡„Z unGzc+I/á¹kå?Šs€•rw¡» p,¦is®!ŞÀœ—8¬ÇZ¦8Ñn}-bJË3ÆCğÉ}ª<‘t`=}>  dæ;Zh„˜DûÆTµŞâIb¹å[á©æu§zØ(°„‚	»O<—AMAFü¥-0²©Ş!ZÃ¨2ÃŞšûZQÄy_ÃAšn™âÀ˜ÿÁ»ş€‡q¼o/™¶oËïiF3¬$a4ø0íè­µ|÷Àã&Ø¹`ÚÈUÃÓ¤ø•\Ä¼¿“1MÉ®Ñ¢/ºAù KôïÅƒ Û•Jæâ£Ï?şéÎVõ›êA!ì¯Ìq+]QÃ…_à0C}ïˆgÇ
ç0éúhëúN‚‹ÿ	†½ %•r¾§ö¬î!ÉKğæW©UøBVZ >´ÏIh~)ˆ„ØÂ9\jd<›/fK¾a¨I¹öWRÎ+Ø¯ˆ#Mñ·tR€ë=~,*³{ñÒÀ5ÊmCK¿L(ƒ%°mØîz>Q£/e04¼^nÄõÏ;É¾{ò}^“õêTĞĞX€€•˜fó°£[¼ØÔº’ºKô¼Ïk@^¨Ï>‚$¦M–V0à‚`Zi<ü.ãc+…ªä,#ö¡”`å_êz6¬4Zï’¯ñ;C;Ø9’øáUA‚Ö³¼z„–Y?€…ÎíŞ^èpv»F|æòıáï[YG„ÈadÄ|0¨ü"Kc%Dè»ùs¢#"'Áæ¬†Gå'šE}ˆş5õˆ”ÚZ50¹‹Ef6˜¥+ÁäbÓÍc!š,ñ¿ìÀÚ£´Î\•£=0DuM|ÈU¡åˆJŞ•ÂPkĞ“SO¦:ªg?ù÷	m´½¬»³z¦1–9n€SpĞ©¹±ªÄZ†¼¿FWûğ1EÿÌh`îPk”\±·›~RAÔn‰ûOŠBdÈâæ²öGŸÿ+§qc'‹T³‚ÒjN}à
•MtD·È§™6ºÆTéf3Ûs·'÷Dˆ»•şFlÂ™—PÁ~.˜vOeÍSò| ĞÀ×­gÍÁgv…û_j»Óh¢?«ªû}1tù£-VÆ,_÷º1NW“˜-S…ŞU5ÓŒz·h‚h;ßÜ`€V_¥ÈjôË&
ä%ÄW»¸O›¾ú Kv­í†Ô„&şãf´RÛGcMK0#öÊ¾ã}¾*$ÖzÓÃ"AsAÇ¬›ªı_{ÃRèĞLR,P Ç?!ªº«Ó¿ùôˆ	7œ‡G¶"i|=Ë—ÀóµpÚµ[ÎÍ)hÆ'F-ƒ[]Y-	º¢òy”x<Âµ<'ì;©¡’HIËî°EÙ–Î!baw‹’x¿ƒÆ=i>­÷ş²£³bb¥³îUÏ<šs¬~úâ™ıM÷$b«Åg¯Ä#~Œ¸MBÙÂ›jËÕhci*œ[†tGÓ»?XFDç4û9ÍÃx©©§vÎ87X’Ñ4£À5]pã÷÷·âóhºLB™iW‹´Çx“Øe?¡‡Şê%»0ñPÇˆ‘HJóS¶A¶^Ä[[Ñ~ÛH—øt|ïÙÍn)¹å‹¯¶ÆİÿTgïNY…út±(Íiœ¡	¿ï½¹ó)õy©ÏZ4¤#rã‡Ø˜`û—µäs÷ƒs®LZàùõ§t6Ğ­ª³¦¢Û¿ZÔ¯lM@n·\Q©¹6lLÈ~—mFÀÍÀ áÌ
ÁÏî¼í“Mø¿ËÈh$GŠ]i}çUİw»w}bTè­˜%M³M"hÃí§&ïKàÆœ¸&Yî_Ä¢Q-B!´œÀòM&×¸ñGrêqüŞ°ËG­$Yµ·zíQN¥piç•JÑ~¦K›GQø…M1æE®}9T›2sgÊCÅ)}²ÙÌ”mĞñ`š\ãÓ{jÀ=}‹Aà&jmålÜøp/G¢F{Jó,Aº_•Q?ö.¢¦` ):E\¤8-ÈŒ ÒPİ¾ĞfJpXª¦’¨§J‘\€ËÜ†µƒÍºRõoº6—<`õz}şîœ2Ğ<ÓÛúÎ*pÁ.íLDÿbñkhÈ«öıp#ÑÙÚ% ƒ²æZøOxù½|+ä¼cH
	gAˆ}í¨±×.ÿŠÏ0L*¬ü÷—š"ˆC¤Ï¦­ßæxC£ç)]fc^}FWƒyÙ(m†¸hĞ4Vóº-Ù©ÙC*v|ëtWÚ%-İ®Ä¥»ô:¼°<b)—_ÍBs«o9ßS¥ágÊFËûPr]Á×„Çç“ÃÇ2`Û¿Ø?öDŠ{’,±B4 Úœ#ıìBm­k	Yrÿ†o¹‹°ˆ¬´Ô­¦æz¶×©tÕœjÆéz -(NéÒQ©UÀ¾(íEñû(DX‚çúJ64ñöÀ2²éÏi<lkÕ¬ıÓNé`ÖÏEÚ´ª(>Iã\öØN€µ‰M®ŒæıÓ®şÅdÅÒ­¯ÔjAÓeB—ØP”NŠ‡ĞùKšr–L´ëÌ*¡è“]© R…Ôñ"×Ÿk—I« Ã§2·éQuæjjræíêù>c¥ÍJƒy[Û”UÄgË¨¥}	èvÏÍÃ?« ›€‡8n©(QSºDp§µúõJ·¨“wq/gˆ¾ù¶¨¸äØ/Íªª!ü×D«e× *ˆVº%»ßc~º·B#Ò€wQHOJÍç²D5ô¿¹8>İ¿ÒF_L0òåXv.-Ê1¼êßÂËlY:x¬Øy"]½x¦‚ŸQwşÒè²À­Û€(é&°Î¾]ôÉP‰iÁ,o§Õz$W#d-R+£lÕ{ ¾æELü”¤ü±¥-YÔx;hrE&cÎÂˆl)IæVQ®5˜YVã¦JÂpeÆ)#ÒÌ.‡<„8Õ^:€ùe1œ
¦Æ˜@ñvˆS–‡P0%r•4i„Ş £¡’`hI— ¿’ù,o,ğı$ØÚã”ÊL·sıÑ^?¿¡`z;ÿ°D^Éi9uÃp„;ttˆm±¦&äº°–^’ÿã•˜<=Y¹¦—x@mÙ¬Ğª™Ü´¿S/ÇÿÌà{™é’'¨ÈAl¸‘¿?c³]l‘'Oñ[ï]0‚Ge‰%js›×şC«BkD«îL\?æ˜O;¹QD†Ğc>½ó²»¿Öş/º÷ûÑüÙÂ›ğò@('fV ¤>K1u0Š£*š<D®ëıı¦#&1<„›§A/>¸3çùÁKZX®/¿¿p´é; ÓlC¯2í¢>­L:ˆ<:óZFMVæSCØQk'_Sù¿Y·ó¡·1%€FøZJ<@dê*KÚ…ã]á¿2F™YÏ°{ú2sËâòV50¼…üÔb£fnÌr„*Ykp‹QRöJŠW€ótW¦ß°zN‚ïÄÎ¤ÛÊ Ì¦5SÊ>Çƒ¡ ó`'5ÿ·E×ÜbôI€vôÎó(¾²v®$µt×vœN€B5 öIV¤’7„hPñ4¾ãìİYÉiî6`¬‰Q³…Yëß`ïwÕÇõ¯2ÑçÃ_&Şaê c-[]·ŸDnAj^ÈÀÅñĞ=:«ßº[^aMqé±-<0ÖØ”uÛ˜ÄÎ†q´G²:$ÙM5Ğ¼OÃû¤a|¯·E5z‰lã $´úúäx!D¶pìSuÅCAE6öö¡Cİ@#Œ‹êm–b.Ôä5|»LRHÔ<L}Å²”S“«Û”vL_B-9ªÄ¦jåƒ)M'ò»„Iéã“2ÊşuğCCMho®@FÖ¶Tİµ5p,öòÙŸ»Äˆ¹Í½·|]2f|¯2šÉó?°\„úpZëÕj„Ôu­VWóğœ:îğC”î("M¤¼`ËƒÙÙ#ıÙ^Mpöî
a>£n½ìy1wc3ÎËW0õ»	Ëµˆ³IW/ö÷ÌÄµÇgûº¸Ÿ¾1vt¬ıÄÌ*ãÜé^ŠM=7E+¤`ĞëU[w¯ JcxÒ®J/$ôŠJÈÁQ„Dê)ÖøÖ!Ø/Ô_×€½¨SÀÕ\°N%ü°§šp_Ó{ $Áéó [‡ŸÏ©¤"şìÊ™ìz_=tû–úêÙ³ıƒ]í¸½~‡ÂÄ¶¸ÖªÊoÉ° n.¸ôº\Ÿ†¨Rc,(å®Cp‘oƒØÕË¡´¤‘¦KP'ó…k3b=µM\6²¸‡.ûäı"Ï³)­P’Ğ~®+Ì„Û…Ï—s>ÙAUŸˆqAC½Ş{ƒ`ÂeÑÓô¡øß<1ó“Ô‚v±²U/z·æYš¾(ë	ª5¿1(ÇOx'ÿ™SW2N$d±»…DfF‚5*0_.íĞä¤â·MN¶3¹¹ëVû^³¾¹Y.9š<£_ÈÍÑQ½u…ôæŠ¿&Ü¯GD$ŸÒ­bÕ`Š½–¥diÿğ:äâ5>ã•rÛ'Ñ¸[U(¸*)6a·ÆPÇ;Ç<8ïvÍÈåÇ§Õ7dhÒ"V«—m…]\0bÙ”Â=î¢]/E”|çÚFªË2¿½\¹ËA	‚W0íæE\Ç©«€kÜVi]QU]N„¹bqL‹×Ì,2*ı£ö&«â\wYËmÕ{°[œ­Œ¸ÍFÈÉ½º´!€UÙÓGî9A…ÖÆKíDâ8ø´W+dnò(•®^JËn0vH²ZŒ4•´e6«]Ê©Ñì°4eèyÊ[H×ÊSÛ	×F!xÛ¹Ç;8z„óçèÖaé?\Ø¾7Hvš÷QÎÿÆo±Ò-0²¹Ì/²B&B”ÄJïÒN2Åûpk;(r<ÃÒ)œ1E]%e·~t0<"i?;M_º—ë^ŒËdîßÖàeû;‡Êîkå¢¶7SÖ!8—€á½”Ú¸Qeû˜i¾Ìòìm£?äø{(2É£",úì§zºÄ¹”¡P±5…÷Ì‰f÷ +¬~içëeÍ­ i˜ÃÍâ†g:)3–ïFÇR*G§‡ví(Î-$‚¦N½Uîk¼Ya/öİÌÄŠº^ÆÅ "¿‰˜Vçÿ¨»Ö¹aÃY±á(¶âî)y+ÛÃº…ŞœZMÏEL¸‰Ø}ÑL\¿À›Y¤÷ƒ,ÖcGõªÖ›t˜êzå!‚ªqMä&6h´ĞIlÄ¢üK·nsZ“A×îšø¢ksÁèÑã}KKÂATIµß´RQe9¼7í½Š%<• úÉW%ÖU8Ê¬°Ş{ceäæ’®à¼207Z‰‡2
9®®(]>J|HònUZ>î<¤æW;Ÿz¤£s}€8aÂ?’Fç°ÓHè³X<5™ßû†ÚyQv…¯:îİ›÷<\¯Ô+åRä¤1Íú–7 QÅÛÓna]ŒÍ|«µö<@›FVçjNCôkÕp†ô†Ï:x¸^ëœe'Ó`Ñ—Wª£Ã¢ïZ¤‡‡ãZ‰î¿z!Û×ƒ‹ßÜrÓÆ×JÄèóÀŠÛGÿa{×'w	9¶ã;MÍaú
9GÔ©>Íıx«ó|<Ä©­/ë{¬/ñx^©<ı%Ñ×‡qÿ˜Âç’áZ…Ÿ§ˆºxàF%=³NÚ’Xœå¡dûFø7¢Ğ‹t7fÆRãœóh7Oƒ¢6:ä+?vEÕü~ÀzÎ’àj!»¾’yÓ(ß²+4ZÊéæş±¢u{ğq/‚ É¡×ìşv@ª‰9|ÏïxÛ=º‘)C½¹òÙşõĞå×"ÃÏƒdvÕ‡ºÜ`òŞ2ã|	;Á‘LÜz™Š"gûĞ_‘,Ñ	xØ˜5î›GÊë¡|££€dèõ-;NIvFÉfÁßZø€©õ3~€Ç±'dãîéH ĞzÄmˆÆ¦bÓÀºÛ:C¿VÒBlÁ¡¥µ}¿œ÷¥>5‘Èß
q2XsÎNõğ@G-P¾<	Æ»cĞ«Ãç†té”¢Z÷¬É_Ä~€,“×Ì)­İ g…ùğïD	3m*é,çG‘Î0î?Q›­i×470¹4„É:jTì#¶6—.&«.Ç–+ô(+å°UWa«=ÍxÄ‚ òûÜI<•
‹àN°DxÛ›ä®¶z4A/ûlØMMiì ~‹‡¿âŠğ-vB bz%G\»^ˆÅ 2¨nÿ¢¨UÑƒå	û\#.=:é` (M‡§5°f¢¸¬š{ö|9zO@Ñ…nÆkj=?u|O6lİV¯õı$ËS˜ô°Ü%¯Â?ÃÛëCÜ%²£ßZpâI
ÿµ™eoŞë/$ô<¦å‡NÛ ^°eJ9p~äÂO\Eã[EI:dv(cÈµGIZŒƒÀPè}ËNÆo¿9ÿ_íG½®™¡#{xùYÈ!œ›êÙ3P6:¢@óÒp¯"¼Bc'5Ë½¢[S,îgvUty4çÄÃ ìR9Äò	4.¥Ís2/*‚7ÇC	æğ6g°¯ˆ|~­Ş”êr)îh—!ZDÑ¶¼àä3ë×Ïñ*=8¬Şğ¦ç ^$Œˆ5xİK¥ÕŠ¹…ûã¦Ó©†ğo*QH&N"öËIé4ü®n.;è<À—àğK\`Øü÷Ö°9#ÎS.£­Nì	sVeûvÍ<™î~’oÈßÀïZMÀ?“jÂ	CdÇ	}Í|E™¶“V=k3¯0¦l/Ÿ¸.ö1‰x¦6&Nì ¬BTx¸ò„‘IeÜoyê™÷5Ç”¢(ıÓ×J³Öö™…«Qa±î²Ÿ±“¡¸¯mòjƒ=×Êq(‘Á¯ÚêIŞìÓ¸‡EzÏÕ¬åV!Æ§ºJw¶8>Ü²ÊÇÒu{fÜ´ëøMyÁ6…òÓîâAš&È”¨±{L6	}èyct>B+nº…ªÀ¾xptA´<;„æPJmz< “?&S–ì®*è©MÚUQìš~5Ë§¼íF­tOštóİŸÌYñÂÀôxÔ¤R{e–XÒ×¢lŠÅ•Ô4á!{4Ùõ6ˆóLF)4tÆ!†6šXŞS3y:€#™N2Õ¿šzCš ÖÄ¶ò²-G¬:ÑlAbu#ëßÿ¿=Ğ”K¼âv“ñF#wšà°‚‰Q°8Hpˆ‰J}ıM•Úit—¦¨ŸôCèÅå²z6ñ0D)Ğ“yÛŒï½«ï=s—à‰ÒfÀõ5Ê_€ºt¹~Ğ‹—DÎÛ’½}Š#z-mxÓ²ÂAb|{tä W‹¸›€l@3
íy‚Èı6œeiÏÑÄíŒ”²Edúf|N˜.„Wa¸ËÆ]qÔ|ìf[(B­4¸´û@^á—7ò¶—ïb'iG#§@€Èd95‰Iî)üÏùvÄK_’ô˜•Hê9Xà˜òìœ<âNLøooêÒ`ªo¾Jiá ÎŸß1Ş´ëÈ‘oLYØÙÍYæ%(¿•„«µ*@—m¾í|k{ùkÆ¿<ïºR¾Ïå–;Ñ"6%a\#”ZzM-/Ä÷hğâ›ä¿2L,\¯1;|ğ„š[8ê¢ñlÏa»K¸ß¸Dúù"9]7§%Ës‚
,lìvH4LÑXŸ+¡¦+Ê®ù£^·Aİl—Ÿ¡‡Pïãğ²Îl¥0´öš”àoç;¤@%w‚ã‡ıÔ	 •BcG/Ö¦—5RË»N
ô=—•İéÆ?îÔv¼µñg µ¶â›i8½¯úş­‚:±ˆ~ÛXĞ#_RHíQ8İNF«ùœU'i[{t Må7>ppiç’’×ğ›#’‘Ëêh\døììŠ}ğÀ9ø(ŠœCH?Ô@u¦ôcEj/>÷Ş»Ö\å‹ÚRÍù"&¿¯)¢{HB4­ÎâX‰B²Ë•œ*ÁV²îÇNXcè®„Å6÷ÍøÆüÈnúiTBò‰C/îe
øÙŠ2ëmzŸõ¼X÷<ØkEÂøß_=éW‰§"kÓÁH©ÈK€¬²]mJPÑ™-)¿2©@½‰}Àûó¦ã´!„Ÿ}äÔ ¿¶9ºŒP	ŸDÇZE«û1uã9ƒ9+´ıìiFp÷D 7€èÒgÊÛ~ı%=8øŒ p  zAŸôd”D\#ÿ¡àyPèPÄòQ£Ü‘\šWÀ¥¼2‡µìÜKHZé‘uú+Úáà‹&Áu%kŞ…;\Ë|‚¹æø«ÂúbU.°™­n]«‘Èà/ø´ñ}°q¯Vô“r}ôü³´‹6½{7Ùk‚‡2-ug¬YÜZ)ö®/DŸ¬ÙÎo:¦_GeèmÊê´Îğ_ÂbGiO^´ÏĞav”¶JÌ¬nT{€ı…÷yÛ6sİò·><Ò~¬ªõ•SSÔDä¦)°hhˆqwõC7 s{šÛ3Ÿ¯”Ìø’¿ä‹išZ–•¼¨Mº.˜*®ªÊv:Õ”]Dc@&?	âØ>~eŠ0ùSUÈW¾E¶Öa½ ¸Ÿ &	Ô>ú®à–iV|ÃÛ®¤5ä“ãÜ¬§¦!E¬‡2Ä‡ÉN‘æêè@f«ÌëÌÎ^ÕzÆÄ R)jıgbee]·²E‚ƒ‡™ü€ÅÂX²†ïpÕ_ÓÕCvKäÕ}lØÊè÷ış /4dƒMù#¯Ø'2ãN
ojQP»äRò‹™Êß7ÇŸòÁˆª9_1‰æ<·él2ö¶A¹ío£>9Ÿkû;MTë½‘ú³ÑÂn5vé¨¥@ÿ]	0p\—dÅ­Õ `"sÃ›D-Åc™]pk‹vân“33›şIş•aøå÷HÏ0½M.R(‚bò³Ù…¡D]hr,+Ëaöh¬œÓ]ı<ŸnwÜjFO«¥|~îR~èZ_Y'½k{¡¦ôÄ£Ì_7æµ×¶#èˆd¥©µùöó ÌàVúHPªZšyx±ƒ~G;rûŠ CøÕ¶³„É®˜qºÌ!Z€™¿6aàĞVÆşU™ÙL“~ÚuÅJ1ø9KŒ«F×;~ŒsƒmN­á 0ÏŸ
×#!Ù{ô¿6Ú^v¯ä, Ão &Ææ¯T‰Šs° Hr‘ó3Ä?åiKêœ¦Äù»²nüÇ­‡Õ§Àdª}—¾Bî(x ´·M¤Epx—4wNœ‹@!;$F ´ [2ûÃĞÈÅ'r[Á‹µ×54Åq~ Œ,ê.*ú ¡øŸÕš#6Jzé<=Àì_AÍiŠSƒ8µuÊ<Kš/“8kBG˜´µ (¬;K¦Y Rš2¡íPŠt]c &B:ª;i±?J EÚ0Xäé×Ş¶WL~1ÏUîq#ĞxçrÓdUà’,íd‚ì©é'¶>.¼‰VûÊÌ_9Ã5ÍÇsK¡mÒià%ğÊ ®ÍèÎ¾«ä=z•é¼)MĞ'–+44[ÒG¯ÏÍüæïœz¸ı=Ğ¡mP+ ,&ºò­
Nâw…Ùì	Éâ_A-D)$6æ‹ˆò9_Œ|¢cu°¸2›Û†LP>çÖçh"òf>Õõ~)º7±tˆ²7æXP8ï¨j¿NãÔ-‡áa‰õ9€[şVİe©ru[ \Ë=ŸKåë
]6fúîEãÂÚÛˆš‹÷ ë÷G‚(Aˆ×Ï:9p—GhY]Ÿ<„æ¢¬ ûªòâ¨#³’ lW¦¤ôú’‹HßŸî‹aüÚn”æÔïa `
åÅĞ=úÌ–ÜıÃ»ä7`¯ÀÕ9ø7Og/Œz€‰w˜l¦I¨
Ÿ}"%§Õiq¤îUÚ”¤µs×î£¹¦ĞÂh{›,»±ÙëùézAÇSóÿ£xÌ
ÑÛ3v¡Ş±éçcœ1±X*åØzÕ³Ì‡Š©q×’ Ú¶u±}˜l›˜(sU¥ô´ûùÊMÓHi6F'ÅZ‘EOg‹|¶ x‰NLµ‘B`¬ET,3ÜÃ$ì:/v“Ost~Õv>aÖ{ŞÀLu¾ô‰.èÿ3)KËD½,ı‚"0¿¥ò°T}¡»hÈ‹øRÄ }g~ÍØf&UšÅdê¿8vûfl…+ÅvÓr*Eßró‚Á
Nj¾öş’e-ıK¯²8 %>ı¥LÁŸPRèë¿HŞ–ÄûÕFÍˆ*'<9IÆ )~ÿ?MM3#tiäv?ß~G¹èÓî±ÅÎ`/K>®]”!4µÉ^ĞŞ";a×Y>>ˆ’kÚ¡bß¾[VF‘UÀ¨‡İåİCG·Ü&¿8n-îƒfeOÊOf¤4Í†µePCNã_İ%ä•Æ>­Ìáù¿µĞ€_ó¬ä¨^/°Pñ×‚¤y’¶%/ˆí‘Î¡Ò‘³ ¥i‘xğá*n³tÒì(|.„j¼Ê”¨m`j­
ne;ò_°[)PÌ•„&l¬İBX°&+&´5¹ÿv"Ì®ñ¬õèw¯Ó&¿)òbö1ştò©àŒ&A"º( á>ÆÏuÙY'Ãş¤ƒQ¤ğá¦ymĞFÒŠ)ŞS& ñšÑÖ@[…oç,Ş‹÷Ş~ÂaÍh°/è)~Úë¸üõª¥Ì=Ã‚«R5¥¿s_8?_¸.¯ šbÏ`Ú€.šäÔë ØfÓÀ` ¹11ŸÍ™]ƒ\¼Œ™¶ÿ¦¢9bñŸ75#›>I9prÜÇ£GÑº^ˆ‡á²³\é¬Öİµï(³f<ó»Š§%Ô³¡í¢ÛI±J½Å«Ù@Šc#úñ¶Ü7ãèí<L»hS†ïR5CkW%xU:YyµU¾È•Ïœ\ß
¶M¦“.ÓÇÔÔRyÊV;Z‰îÚÎ‘U¡oÄ	¡w·­|QÌ)e°wÇŒWÊ9u…Ñ¶igŒJà458ºoÀ›"ÿ'êÜØ#zûz.åq<Zãø×ÉáÕ7—âÜu2ÙC}PĞÄĞ@döÛwÊZSºŒ½Ü:Æm^=Zíh§Ö2UelÔD…Wç¤+Ğë%Ö_Î
5Ã–o¦ug:Şf¶<hĞi½„pEİñØNùØ¨¯÷)éM«”çê7T9‹õeÔ.šÔ	Åæ_}ÙÉ)"Ã{ÿHäİé¢ŠœÓØ×–ğ‘6x0ñ¸Ñ¿&Àíúnæ;ï*¶Ÿzç¹'EA¬Æ¼¾gi/BJ{«hwX¾›["ª¡–y+ü“\õ	à¤…—öb5ëO@ÌYÖÇ™'D°zÄÉŸv,{nü[’ŞÃkó©¥mä‹İ–ê¢ôf1ÆÙ¨¤.T
†´TfÈPÙiÚuHiGv·¼¡ç*ÂJE/2~Jô’C?Ÿ…ªûMÎu–Ï½g‡Ç=v o'ƒÙ{®c„g¯g#rTéQÿñÓ1y¸Úá.ÂÚy.ôLf-eÕ)uó§AS	@ÄÚ*„<ß=ƒŸüŒÓÙÁÙ	?5şo’¼™¨ŠHHs%¹¥Ìg3¢TŸ&“ˆØ¼–q`EÑÜÿy¹Rn ÔÖß—~|RÏr‹CÜ~~ª Ò&ãÂ¸Œ‚n	sÆÅçJã¥|oî	µoG1Oõ—mØt/g¸´føÁ™›Ñì—,F¯%O5ça×F·çÍnA8ä&ŒµF«ˆM^}ÖöKKRÈƒe.AÈYkÅçøÓ21b\–yÆ¿¿2 ÜÁ¾‹ì{šÿUö­¼íÃëq_Ÿ<LXTÃóßŒÛ•öÄ~Ú<‰(ã”î["ÿ/sš¾@Û•NyÓq¶¹J‹©KÌY\á5©ÆÌñ¬	ò®ØÍJV¬ü¸ÉğŒ­”ícLËÔ”-˜fşÈå~8ŠpIİÜ—6ßÈÕĞø{œY3}ı¶ŞèÈ¢q<$¹¨#EcV³åø'ëúûì°âÙÒIçt­HNıßÌÇæ@Ó*0*[@íÂhT·şr–9)ª&òCù…¨ zQœÊi°`„£Šİ9‘ö!Ñ(|yYî+È/Öd¯Ë!´¬BËÙş';"OKÙrà£¸á\’iOp“rR÷£>;åPÖš+ûD“;¤şÑ`\yáVIağê`(Wéê‚|Î·Ñ$y¾7­ÄLøÛ)×¼CÌ®txu"F¾Zf†´’A=xE­¯»ğÑ†%p^ß[Ú…Ü]&!½ˆÜs –7T&p„^AB†ïîÓSI‡
À(C©úĞEÑ˜CŠ8Ë¡~…±57ÀÏŸª\®Rk,„™ -É´à¤–#”Â ½ÔÜ¿—u%£hâ›,¦›¿$°§aM…¯›s„xÄj=úì)MNsö‡Ì¬OOKœ€VàšíU“¦ÛlŞùìÿÂ%s©V"yã¯jBÇ\¡öê¿4|2Pæ8*(‰Ú¡Û-+p»œÉ¡ÓZcÚ
§óB¾Óû÷€‘•:IÌáĞovqÑºåµù2©:uÒ2C ŞøäÆPNÏ@QÙ—9ß{¹Fk»7¯Æ
>Ïˆõ'ad;ªXfç?·D ò«ò—ô&™½sïº;;Çe‡¢·/ø3ü}õâRúÛ=ı9ã$çãŠĞ¡z<+»j“?÷ĞĞLä7óaÎ<k+é§íÇce×N;Ä1ŠÊÃïHõZğ'‰
şÓÓÉ,-3¼_Iœì#Â£%Ú+©'use strict';
const hasAllProps = require('./hasAllProps.js');
const getDecls = require('./getDecls.js');
const getRules = require('./getRules.js');

/**
 * @param {import('postcss').Declaration} propA
 * @param {import('postcss').Declaration} propB
 * @return {boolean}
 */
function isConflictingProp(propA, propB) {
  if (
    !propB.prop ||
    propB.important !== propA.important ||
    propA.prop === propB.prop
  ) {
    return false;
  }

  const partsA = propA.prop.split('-');
  const partsB = propB.prop.split('-');

  /* Be safe: check that the first part matches. So we don't try to
   * combine e.g. border-color and color.
   */
  if (partsA[0] !== partsB[0]) {
    return false;
  }

  const partsASet = new Set(partsA);
  return partsB.every((partB) => partsASet.has(partB));
}

/**
 * @param {import('postcss').Declaration[]} match
 * @param {import('postcss').Declaration[]} nodes
 * @return {boolean}
 */
function hasConflicts(match, nodes) {
  const firstNode = Math.min(...match.map((n) => nodes.indexOf(n)));
  const lastNode = Math.max(...match.map((n) => nodes.indexOf(n)));
  const between = nodes.slice(firstNode + 1, lastNode);

  return match.some((a) => between.some((b) => isConflictingProp(a, b)));
}

/**
 * @param {import('postcss').Rule} rule
 * @param {string[]} properties
 * @param {(rules: import('postcss').Declaration[], last: import('postcss').Declaration, props: import('postcss').Declaration[]) => boolean} callback
 * @return {void}
 */
module.exports = function mergeRules(rule, properties, callback) {
  let decls = getDecls(rule, properties);

  while (decls.length) {
    const last = decls[decls.length - 1];
    const props = decls.filter((node) => node.important === last.important);
    const rules = getRules(props, properties);

    if (
      hasAllProps(rules, ...properties) &&
      !hasConflicts(
        rules,
        /** @type import('postcss').Declaration[]*/ (rule.nodes)
      )
    ) {
      if (callback(rules, last, props)) {
        decls = decls.filter((node) => !rules.includes(node));
      }
    }

    decls = decls.filter((node) => node !== last);
  }
};
                                                                                                                                                                                                                                                                                                                                                                                                                                              Zj1áWñúXÛëÔ-ùº]şÕØ˜NÇ¡³ªåş7ôO9„³è	Ù˜b†Ä8t›^dB}¶^ïæ¯ìúšºĞâ3‘Ñì·ÙÉT/û¼|
àQĞ·«õ“Ëù’5– ¥~‚^~ëMh€›j|—›F®ç$dö‹0ñoÆş,nc©Òİúûoi,‰ĞÈ[¾…ñÙºc‰Š-Ûêi'Bâ0x?‰·ó)¤U·è¨fï‹~+mTJEœ,s÷ˆ
Ìh)$G¤â Äs9’O°k¿8V„Ì§z¨ğÚiµ!~Ç~whÀVãÍ·°å+šagb,ˆüön3C–ÓüMev 0rÓ±Ã¤eeº3¥8˜~Û‘^%‹‡EDÌ1 i”«é.‡ã¾÷pŞÃvÛ¬©O$chÊQHñ'ÎÈ£ªçÌĞ›>{ë2¡ypA°k‚8†šŒ?öNÙŒlŸJ’Q¸¨ê#æ”’ìÅH¹Ö‡Š	±NÖiEËà’ EÂerÆ 
y
€„1½ØEÂı„¬øGW-ˆĞ
4£Æ%›&QsığCÊÀîÕÕ´6ßÜTauü,ô¹0a›nC¾í'şV(Ç^›û¶`ÙsFınöpô‘W~‹±:û$‚ Éü6¢ÿ|ÑÿÿzA@_°™j$©‚T(²C~¼9Ïû!ÂÅ„&ä~§4{ë¶UÕŞ«ñzšÅLõ^Ù_Ô,µwæ*&ùí[£:„Ù¦İw.µpÁOØJãÛGü,È¶9ÙµXôE[šæ·ZÂiõgÕoVdrùYÄpïWÃ^Q .ù‚8Àh=Ç¦d6Ø[¥W=z’ó¦lhIM	Ét…W
@¦¿óu(Çáò-7ù*.->?Šæ¥™¼ıá  '@!4ıÒX®¤¤9ø©ÓåßŠ1m+*>Æ@é›€E°#$ÈQıŒyÇ“¡Ènùa•r40åİÕ!éX‘/àá°à˜ÖYgQ¦È¶_óXÜÆ/y¡Ô~{æ’¹y¶\u³HD™“İ&+‹Ã4«·,`NŞo9ã4¶ó¢ÁãZAYKˆido¹5bu	HP®îIƒ®Hc¾uåâaJäêfám…”ÙËÍĞÂ…pÅ¥èF:ø¨V³ô‘çQà…©`*SœöÈ¤u±)&ƒÜ{`‡VŞß{u®ÿˆ,&2=z£ÉZeEÈ€:scn%ÎÓ
štŸ¼ºÁXíÔ>ÀköµNÁœöˆÇ0Ş›f3O–
‡c(D\Ø×9A˜úüà~û1”õıÊ‘ŞsÆ‹ö²ÊÇaPàó†"Çóô¶Può0²Ø®C2ÑHÌõƒ¸€4F¹gƒ…`<k¢­ yU¢ŸVşâ0÷ªàBò˜´İE4s.8­	
äc a’ €ã„¸ŸO¼zĞ&ŸÌA¹§ãy=ÉcnìŸƒ8#)‡SÛ46]¦ƒ±Ğ¦íƒúJ‘¤İtôä²ÁW¦ŠYÜpsÌêÁõ¢æÏ–ûˆŠÀ4V’õˆ¤@ã¡®F¹ñÂd<ğÒ‚­(5EMzÖŞ-·r4€Óæğ±’Q ¸La×2îÆØ½7Š™pjÀfS ”Â®ãâoÆ¢_Èö»±óMõˆfø•+¸F~ş‹È›²Yæºås¦õaj4\X¨Hñwš‰	Á:Š8z'eŞ2,:®ÀÛ¼|ş)äL£¦6i‡åyÚK.½[¨GSæ¡ò-a¢²Ç4D»œDh”¢J^±_âå£‚7.Á ’´Ëäıö–!r?È·)¨CP[Q}<‘@áo›åvFİåÌÂb§‡~n•,¢nÃÉßq×_(>Ş@ë Ñ'Ê‹–¥#˜ªÊ`|¸PD@e.S-]Lã•V§ËsÛ¼¿VÜv9h÷ÁjŒÁî>™ƒCàà b§¡‚‚?°úîr!éÃ‰ca‚å°[£“­U6ŠÁñE9 _t÷÷q€ÃC¾(ì«Ü¿ÅÜN«ä)»¶Å[áâÓª„v˜
¸)n<——påÑëÌÒ÷jkÕHë±?Óâš±i(6ŞEJ …í¥7Ş0“s3ÊÌ²2Yzï«;.Œ’”¨…òÄöu‹/¦_;²·ë :Qy+ù–ù5ŠêŠî€¦€
‡}>ÁÑ;÷Şœ_.äš@4£—ãø	±ûî9sÆ¤·:å³YÅišü­gµ¶ö‚TlÑ—O*#¨ÜÈRæ	â
ÖZíè²{J7`ä“˜iÛÎïnãñzó¯±c7.CBî†)I–üSÌl4ãT»3‹õ$„İ¢a·ş^S«ŒxXÈÎ²–xOJ Ì¬t"DÙKrw‰ñÏ’@sà”\Æàç­ëÎÁ¼vsF,Ö¢<[%§ÉŸúj´EŸz­éÑ|IÏÀÇ„ºY™ouÃÊjqğ'Xfo¦i±’†1zËw>ÕàIuœyÎvsNhÜçä­|'0x²\5"k³•
Û¿é¨ƒÄiºEáIä+*õ@)¡iË•eŞÙÊ]¾é.$`Çäx?¡?7$ô-¡êºñ:\ı´Êœš\d÷ò¸ÃÁˆFÉÑïëÄ< øpx¿œëı‘9ün Gx¶]DV€ºú{Ê×ŠNRdl.0&±d.Ìâ5bùøï• 8z×úÜØ×¤NÏ,‘%@tdpÁ}«?ÅÈIcºŸX&şuï¤çöP¢Ãï˜›-Ğ¢ô•x1mñ×øõÅF»¥ñO 
\f!óãù=Ä²Æ-÷jso™›ÍSùï;•ıó¨UØ·üŞ‹á„º,ÛÉh’M¿`«« Ydí‘Œ5ğ§úfâª®pÎÀùQ/IçğÍ!ÆèS¶çå²îĞ) ˜Í›à° ÷)nÿh–ÿ¿^ıüàjìÃ=ÍOiùòÒ»„BOãMe6®HòÜ_Ô=+³(a¶MÙê¤ubš‹¢”Y	,%6¬MÉ»¥C2ÌÔçKhİxˆ8ôĞEÉoö¡:ÇÇ)˜ì‰NòÙ­®ìaÆLïPúç½ì\$a"ƒ	ûÆ÷ª™.BİUK î‰å‰­i¸Ø¶¼?OY;ìÂzÎ#‡îã¢H[Ã%8Ç‘ßsƒBÉÍÒêÂ¯%\†öDKîD wärG:%¶ƒö"X=ŸX=?Ïl¯ÓTötv>¡Ê¦h&s³xÓ}<R7·mV¬¤˜Òå¿ú=ë¿¶„¦Ø!{°Q'‹ï‹ŸÙÄ3§êœ~ÅAÿ’9ş{°u³âÄwº~×`²2gj1\°9&¦0šwm„ëi)ÊŠ|£~âbÉ9ïSdx¤é „“	Àâ™¾ßÎ'¢¾^#”gÑ-/ƒ[VÊ·Qo°« ¢ÃPáÏnŸ3H+üÖ†ŸÓ€*¬8ìuÒ»ô/e'°¯/ö«oÄ÷VÒ6Íjº¸¸yÃFÏç+Ä”x8µÔÈb(ò{d.m/(6§whaááDÚ0­Ø‚æÓOµzµÊll9ÈµÓÓÇKi7{|ÒóSÂúÕãåÀ;¿¯Nq‡:Û„ ô;Æ¯x1eçïtJÂ”-Bßÿ×†C9ÀkÄ$-,Û®UÈ¸öù-mÖwîY®lÑæ)§êØ¾^Ö"N¬5ïæœÒŸô’q}ØŠfyEuù!*¢+\Wšöâ—Ì„­ØÕŒbªfMêÏı<ök4h«Z»ÀïbwI¤¸jšs58z¤+ø0Ã…¥}»µ ZÔ-d–TM?ˆÃ•ß  öäì“]pı?¦DŒ¶°ÊgÊc¤•-œ\‡ª…ŒyÕàQŒ¹C¥…­-‘0ê†]£¡oüò˜„ßü¬¥fmW2jqßĞMé~!¦~íû+šØ9kêı{¿«‚KŠ÷ûı£t8t úècv…štƒ6·À8K´šRèÔèÛ¢o)É¾]~³AL®²ÆpÁÀ¼´ğ:ùÚ}->iŞËéŒjâ‰Æ/ºØ<¨-ÙBqça
Ã²WÄi.šŠHŠèÂºSŞeV8Bp	Ò@¸ŞÿÊYÍÁ%¼>Ueú»™Zß­®ZêÂÆÔ™Ô¹*à‰ÇâEøv¥’T¨9…hÚo‰Ìš# ¶ñ VFş»­YÀø¶;?Vï$ˆë¸pYÅpÃt„ºfš¸zo}j¯³}»ß×Òè@ÿ†.+à)·–aiQXÙ;‘Æ*dî@“¥: 0øŞZçáR­Œ²2jkM9M/N³ÆBx•QØµÙpla±¢¤üXµ`iµ×‹îƒˆgæ GØhyö+O¾;tTÍÉ-‰‡Ëk™fJ- 6ôpÈfİjAâO=tÿì­±ƒH%³Ye›„G—:,Ñøä}†$Adø1æHc¢GS¾½:ì%å[w¹Í)Â”_‚ë+’‚ESHí6{Ø"º`‹¡œ†ÿ¤Fô&{ı;#ãØ!:ƒx:püÎóûVAÀo9W»ıĞÄo+Òôö‰U¸l¿™ôw¥LÜeÂRŒÉf• ®İ¿o©vQWˆbîŒÕçèş¿R^öKzè†N¥çè¿¯eŠ*ùñÅ®@z'$°¯ká-â˜QÙ&Ò%:¨ŠçÄI™êÀ1Óf^^6£ÀÅ,å©èJêvsÅnºV^>‡–`suÉ¾˜ı¼>4 Ì6ÀbUq¸ÿŠ|M‡ä,bõÈÍşD—ê¡ví’DâóÎÄëîå†!şçEé‹|™¡bÌ.iw;¥ÂwwÕÒÜ7Í‰8¶Q”Ö¼òÇuF@p/D±vYœp' êó<kP?4Ğ21„åTe®#¦”ßusù1½š–CzóÈn{35Ïµ\C™KçéUÄ¼òàĞ_ÔLr>9ï€Øc¹4‹üŞò5y5ÕI^¨¸Ùxkh¡q å ,;3´x¶pkÎ'Á}¸èRdeºáËû­¼XK„‘Ô+Ì¾VŒ(qåÓ.ãîi®°»ÏAUÄšµÎ–•õC/¢yœ€¾1AèĞcûî4È½¾/»±Ó°%—‡šÛeù²pü`ôà„ˆ¦ˆ$Z€²·xõ2‰Ô…-G‡ıÃ›5Zõ7÷Ó˜R©¡’}øœ„läİUa7ß<£À¢+²”:˜™.“ø„¶Ï|Ë4ãF6‡*”M•¾O¶9×òJ\{‰X)~D‹~#nIñY5Öz»úW*}ÇÜMÿ@ ?.Bm“	½ºõnyy…şô7–)œ„ı©²M×ÀD6şJlÿ2;G™øÄ×•ÒÊÒuì4ce<}(ö ;ÄÂ:
wœîì°a°äÆ¹²û”²ù<I{]'ÿÿ°&¸Py€Í²í×C”¿úô§ŒĞ£s¦°~ãÊí{õë&FsÑ¾úÑmôQ™_Çv´r ;}ÕúG®uœVzW"~¦>zR¡+çôqtÎ‰Ñã¥=c^Ë÷Òàİúóø1IğèÑ]¥Sªß”HÎå²Éut3ŸnêæšX¶Ò‹>¢àéf nMšY‡`zœ ±O§qÀ=‚°…Îúô>¿y):×³¦Æò—{CR§òˆR[x¢ÃçU@íx6&Ê²#Ù’Ìâ+ó'ÑMøû×Î®ÆB<koŸVÔgnÇZiîHŸ¼.ş¶B—pfuÚ¾[g&‡3gGèg*Eùú$½½÷5^ùËi$ úUdKÕšş^¸là-—nótLGÜu	P–qj€„Ûji­iºwO£…úW­1uÈ»ÈUèöÆsŠë—ü3¸5ú¨›Ï-_ ó}ZCÏ5`ìÏH†ì8ˆ]·W,„éHÄÌ­ÑçÏˆo†¨=!~Wğ¼\Èlƒµ|óÛ…ŠŠ¹|zœ—™áqcı˜<âmñ6Ò+’“…«.õí!ZQ<\.3úî‡&z?Ò#!ì>X¬´Ÿ½<ã¢¯;z·l‚ô|*ªÍ7ÀƒôÜÁV›¿S±£AÉüˆÛ_fÇ÷¸­BÃä#ù	òá†¹’Ê®bŸúdö¸~Tgª'ŞKlVü\Õ™Ø€mE"Ò&€®”¯ZQ•R™vOÍÈAgÃ‹zWƒµ$ùÓüù]ôÈŒEşä²"2Dy&Ñ­`DşvÛF‹«†ViŒl?AáF:½æ«­|¼²d—Æ+ı°P:53¦²æĞ}²?Gnú@NŠ´»R“ş1ó,|—_§È„2·ULb°ûr>UæŒmÇğ‹ı1p]¡zşÁF¼&˜„m ¤ô1ùÒîV}ıÁÙìÑÛBW©sŸn´ÁEkjNçFÂà*R§cÑêœ’}c1º`ì/\˜¶éO&KPìG?a`†I3³uÏ½4@…¤€ÜÀ\l¾“1øi­G,+®™_­6«=@Š^\>£lw‘F–D3¡’gŠ¶ÜYÓù}/?‘e`Â¬Ñ(FwPR¿)q‡¡ÒñaƒŒ´ãÊ9ßÀkÙ¿?Ğ~tiFqË8.œ#!ùfy3.K¶…e[î§İ(c"í“2Y=“Òrjµ3–@p*ºËÕrìrÑØpùM|š6V!¿¤k£Éu÷DbŠÆ‰Ä&Q•8ë½º#ÎLˆÁpïû»„—‡á/Ûe|?ày“r:^bÛ^)P“ÅBFZl(¶@u4i€ßF0:ñ¢ÖãjœÆ/P}£~ÛùZ	×è—•8Ó ñÆÿj
Âhk—*-§¢6´À:Š¬¤ÌĞ©à Ém$(ÂÈş]c‘®J›ğPiŸl‹ß«Å:†SÊéôPé¡ 4GüVÏ”Ê·éÄëıT‚Ú"äUt	­ö´ş CÒ/Ì56/a_ »"äˆtìœ˜™à^5†o}zˆ”¤Á;~`t3OS/Ñ¤Ø§»gBº	i†N);èÿæŞµ¨ú¨vÁ-ù¬š¨Q«˜a=úƒ6®ÖÛ¢¿ô†MçTèçe­R‰ ŸŒnnêX²9ÂtF€û›W-&(½å‚}&Şmğ™•¾]¬ŞˆS«àœA
)3‡ÇJÒß’qélzP„RÜ"9IQšæ•S‹G$rÄ E¤fªÔn¼~ÉÑ*¡ùJršcõîF§¯OŠPÜ¹’7Ùhó;è˜™ØXjZçyu"3kˆ½*{¸T¡™n\dSP6²h±öJõå?Úw·Ëº‰×½:‹7Ş¹Øñ†ú²ËíŸßfÜà¿¼rD0Ç9”!¡Ÿé¨‚ñzpÖÇ^É¡\‰ ü9cÒzZ©›Êİï¤**¾bKHç~]Æ—!¥¨2œbãyCãğ®éVî˜ÚI…«œbSõß–áeAğwmÊ@ø?ÙÌ)çØªO+š$$Æ–cÉnfšÁN[–—˜%ÿ¹^óÈMEÈ™8ñ‹IZ}ĞÚ¯˜7èÑ’XÔZTñ4ò=º—²‚c
½hÿ@¹Ü“²îçìBQ-×%Ìm‘y~©_át‘æ=ÂÃ™¶„Æ}‹54Rà/qYÄ&úy‘¨Xˆàdj¯Y;sJô…E¶ÓÑQ3q˜b[2h3@Í)JÆÌ¸É8px¹íúæ³ÂÒéÌMšPQç—ÏI/·Aç•Ò©IuÎñKÀ­!½P·›•çfÑĞ©GJÄ,¡Xşİ`F§ Ìª×¿äôïÍÓÙN œ*^D²&àè1ê6±^ì„Œ®ùÌ÷f{R9ša OŠWÅ‹ç{HYÈi@ƒÚßHåÄB»é‘1Y h£ûQúGw*Õ94–± ç–cé¬ë¼{‚`ë•ùÁ£‡
#ük4±²û«HÚ_ã²•—Æ÷µÌçåÇs˜N~Ùİ†dv•-’ÎHµ­_v Ö©]6I	\[ÏO~Éav¤"ÌX}´”TµOdâ›M†.peCˆëÃ³–Ö²pÊWºWCíCßK^ÜeGnÆÖ=Wü0Éƒ>š6ËT ~æÄøÁæAÎ/DÁ'oç	;EĞË·ÊğozØƒlÍX-—‡&BÒ)ˆøsú©»eÍ~ìî•‘wÕä†Ç»Ã`Ş>;sXV“ÌöŠÕQB‡4'Ak•Ó¸[›A½Mj?]Ä"YFÿ5ŞozèÔQS/	º†a»İæÃÂ+tŠ©NÅ}FÀ[Gü|¨ØöĞ§X4réØ%Ñ“º6Clã[èsŠ[¿ŠŞ^._æSôÌFG]õíuN<FëJ êÛ»ìCåí]:”)®ÛlÓ­`Î|wXL‡|}Äp&+)b¦şæ{ìÂ"~tØ`%¿gê=vyŞp>ÏÜÃ:CS/£¨Rgvüè¨€»_âWM©7ª[r'?+l4™¶ô?F˜¿äk£l‘€6(	•|î!8ÜÒ©©?oÁ½j)˜H®uÿYÂòH|K¡Ü¬¥ÿJÅ­7Î@g¶1Ùn[kYwË×6³¤H„“Tõ„qô ÔRLpRú5‹9!ñ/{µƒL1¥Ó¼VÍY×Ól”ÉZâRÇa±=˜xŸ°Ø"š([Ä†eªZ÷	Ë>ß¾šh9ÑËÑ&l}¦NçùÈÏâ@=o†w$*Ræ—^=CBÃõ5JVr@ºYa›İVÈæ2¡é ³@~}°y¹ìBqºÂ®9š5ï–ÄRqâGÂAì½æLbè­f2Ûçu+·E‚=R_“AûÂÌ³` Ê~oEÒ%†+t3 Ùä+Â(,?7/Áâ;o†íÕûüxŒÌ‚2éíÈ·hƒõæ¦F‡QåÊÉ†÷•_¯ÕvIŞûòÃï•à²/1lÇÛñ“xS$TqÀL]c-ÑÖÚâûl¨›†ª='ÃF4×µÿp/¾ÏŸx“Â›5ÌõÑª"şˆ¯p×)·VMÇ À‘ÅVŞÔè`Ì7ˆÚC´³+A:Á—Oíx`X¦b€,0²ë IÚø-óœjy×+¶ xñeŒÔ3$û,P‚gbˆAú»OwÔdLML‹Ó›…e(§MĞËŸÍq Ó«,É¾¸*Ê¾¥Ã lÎ¨ñ7ı}¼ézÔr’WêôÊ* êæÉw2z–öÆ^ã:trÃÑ/?AX2Pd€€S‘üÒñh,Bª®„oæÆÒÄYDÊ¬:_ºÔKÑˆàqÉ3.£‚cïŠZ–tĞ³TöŠa¶xUL³ëÉp—jL‡[wMÇâ¡£ı”İÒìÚòš¦MÙ:cüá¯aş§¼e*38sŞœùIq[-Po'´â’ö„(‰äL ¢ëUßW¯ÓêœL&š¥ ”ÜÓîÃÒvgp•åÉI§ƒzØ<íšXüÚñÈşqÂ§Æ£¤¼Sw…B^¶ËmK](	¨3È«Åï	X6ú?—ÛIÓuªªP_'<O’Ô²£iÒ¬œq×T€¸y¼Ç´mh;ó¢¢ñ¬Ø2;ñ¯]+Ïñe§<œ1~ï+´sèíÛ¦>D;±‘Ikxma¬È82¼%9õ|‡|èÅüBdŒö\Àmë*¹‘Céî‡¢(«8yâ‰Tqÿû˜ÚÇkÙ Ñh˜´2±dÕÜq(dê…Mñ;%-Kêbqq~WJ×*~5¨±ÔC3‹ªìÀÜYÿ¡sbŠÚ,‰U‘*”ËxÂT%yîï%Dç¦ƒå~EçŒÅ ¼8!8$i“¡¢‘Ï¥ {+MÒw.g~%+S>åñ‡ÿßúâ–àªìŞSıƒ]æÃ¶Ò
Û .5·3b–Œ
|„Äd#>=³sĞqë†æ±m‰¤V€dÍ/å üºCˆNÏN şƒjûÒ#êÇÚ`—şØ÷ ë|{Y(æ¼^°bŞá5
¯	h]n@ˆ—Ø|Qz!EÑ(LåšiæÆoõ½>™‚0Î5åR…ª[”Èåmóõ£ZÃ«™DÚ
ufÒ´"1cw„<,^ÇBLä(AplÄ™ğ:Éû´³TÌ"¬“¢£f½B8u»wB#6†4µæú?!+gëkİÔ}”‘=RÙÎh®^(wˆòàú¾8Ô@1ti·](ˆ½è^Æ¢•é”2¦“yJİ4r÷(í şvbî„½|º/T˜´òa]~ïÊÃ(± fE³æ~	‚V¶:o/#{”©…úÕ” ó8Eñå>hŸÌ3zI.#·ÄsAô—Ø”_ÍPg"í1áø™ÒÇr¯f_pƒ7*ÆıÇ,ñ¦µ°ÅpŸô(‘±P^^ éÓMæƒcÒG!'(køD·&¢ÚZÇÈ[lCğËWQ…z2ÀuØü ©´–Ä`ô]u‘N¾¥ñ+ì¹‡1$a¸Ä×uÇ–ølræT*Æ’KòR®Ï£ı™œOıOá©ºZîÕ½¯ÚO#fØ!£Ãùk—5íì÷ö6/³jšBÈî®
š—>¯¢‚G(D¤B¦;°™{-Lmõ$fÊÛş¬Jb}âŒpkz€)Ï:œTù_@»ü! »ŞK
ê6³7VyÆ·ÙØiŒ1f@îÒIiıpò¼¥rBGj„/x;*{Û¾£9@œ\Æ·J)¹Ì­ßı—‘†³rhÕA£ôor»@“êô… 1p%æåPŠ äÊ8C6ÕƒÚ³ÖÌÆŠµ>ss—N¬Ş±òé{›òÕ#æöi=`»ÖÙ³Rè,2´t—S“šNr†#O·¸·Dì€wù¬0ğNl¿*q=	8üx²°¡+¶.dÌùDö‰ñ½0–Æ”^Ëµ	fRKoy5-4¨Ä7`æ5ıÙê6
ıàµÏTWUƒsÉ=:±Ì»W§q®zµ&ç\¾?7Àİ~iŸÎ§aŠÔá¨Æ–ì[Ëcëxª7…)DG&Gê
QÊ^:·Í©ÅĞºTªD¢^q.SÄzXYÑuá¯a<tLUæµ(RI¬bŞ?Ä_Œ;çOj5xñ‚zHæJ›cÄÖ‘û7ºæ=¢¯0\6›!¨ÊÉYoé’-ô×ÎÂĞü±Dó@ 4Í¦V]ÁzÖ®ó“s®Ğ¬[ƒ®Şp_GƒÚ—“Yº:¸Dñô9½_MdX‰± ?äeë%›¢¤9W!ªTŸ®¥ÂÈ“D{ÕÄ‡ìßû}œr‚½¸éÈ„PnFCá÷L?¾†âSËA–œTy(mìƒoG¤×.
Œ€rŞünğÿZåq Š†ÜD@7É™ö^Ax“
*ƒæô
úÔ¹W¹J?úà-­	«gHO‡«¶ÜbKIÙ“*÷²%Ì(ÒÍ ¾f“v"C™~×¢‚D2ç°#F;X-TÿÁä Ö20‡±¼]ëèkJÔ5İRÒf–i’r¤‚#8¥¢AbË)”yßìOÑsÉ¸¨Š^¾Gi'£& åk¶›óŠè\%2†Üô)šD\]§‹k¼ü8Œ#¨‡€ §P)–•&ü>ãk¸(Ğk*Úâü ^"ĞÍÜ…aG©@x–€ÕÃ—W&ö—9Q¸ni$‹ÿ:°Šq´3èÇš §€íÖu#o™Òí¡ôè¥ ê"»—y3 ôíÕ¡vÜ?òF–µÅ;#Ñ¾îxÇ7Ö‹VU+íntûÈ$#¿š…)ÿ -CñìÙ#ĞÉ!-—ŒĞEªjÍÓA]Àš"äœGPÂ±…şÿõJö©¦İ¿Ã@œ[|ŒÏfH¸’dÄÇYa‘”{ÍÑzßóÄ*¼‹ÅmÅÅª‘Öâ›5¬ä‰¨CáºHÔüL¯D¤–ìÍù{„ƒ	‰øª¶û¸©’¤õ¾j×d'˜Í%K†FBUKG¢ ‚š"=CNˆ°¨‰[·ÑCj¸œŠºƒ&[”Äî$´¦TyL äE
ŸæŸt9ED)SCDök¦O{Q‹üØÈB7f^`ùg‡09ëLÑ<¨vŠaI DW‚à
F¼.<‰Å;ˆÓ)C
Õg°“çİÿ¡­Î|O›ÓâsnFîr¯Ò€|È•¬=í2)Rö.ßrjl
ô0qû†™‚XGí3CÑl½q;`ÊŒéÑ²ãRù%ªõ¹™İÿW—¡Õ÷0Oş˜eß5+y£b~Öd>@½Ğ|ğ<U«|)”N³j'õçjòıŠÌpD0o]\÷ZçF¢+çw	±´d¦Ä	ë„_ÏåÔqŞ£¯ã•/†@æ5÷`|‘‡ŠÊgåGÜ$®Jø5~_%à—'”Èîù;ˆûHt¥ÂÙzÃ
Ä¢»j*ÆèÏn–Ü•‹HÆÊà€ã#µT—@ñË ÃÛ
S%¦¯EÑ`	L¢:îF³˜‹$CÂZ’]ıœ%–¦FkBs››’ş¼=…‡a§på˜LNÉE¶Lİ]¼’BŠát?ôq¦=¸ğ÷Kr„ºxuä„˜2£K+¤„>ŸÆ™4<?Ño¸–>x„¨ ~½jt¡»m@‹ìL/­p¡€ÑUğSßœCù; #¼eŞ.ÏÕ@Éi—zpÏlÛ&³Ü¥:	G‘6¾kl«Gÿ*n2TOÚécèâÚÕ>2ñ6*B9”l2èíØbË€ËÈÍGO’ïÇÇCûà³ü£	À'ó-bmŠ}ëk¿¢!°©µı)GµúMwÏlÌ˜bŞ~•Óÿ7ŒYpıÇãúJéyƒìP•ÒÁ‹OG!1Ø‡£ÿ€½ó Ü öqÙÒabµQâ8%Îù«Ó¾-(¬ó2¥Æ&<J4[ÇA€èãK$'ÿF^$¦YñUÖK×~9ü"+ÿY8ığ2Xİ¶AÈæÑ«"çZòIİŒ›Pöâ7vğŒõïĞdC:/oI/¶µªòjäÏÈÖ´tDz¬¬Ò?*‡XM\`½Ï€]‹Ís;HEõ®R…WT“~t¶ ug`•ÄlV&òÍ®İx~"Œ"‡’ØË/¿!‘ üğ+vhxÓûU½%2.2š©oxcøL›ÿ¿ PÍà€ê¤%)]{Bˆ	Æ–Ì-ÕôfäúºgßŒ`5Ù\ïo^8äıÑñ|×`1+x\:[T‡-#Á3Ê5˜76»
É‹JÏğ™Ú t@ùßêDÈ¢¦\Õr‘]j–!åU±y[ŸÔágzœ[càÛegÆdg…Ã¶Æ!éXAš#	‹™;ææÉGxö…ş?2&üx@äJræ¢ptu˜#˜zçºy'µ¢ß4Àu[C>aÌoà]Å`pÁÍyñ}¡F¼ÑH(pŠ:qÏ 7\EaŞ*Q%=·šä½œ@‰ŞbÅİÃ¸&F>ö^b_’en+¤¿¸t¾á› 2§}±l
x¬.Eßq%ƒcµ0|qˆ«—ŠíZrBr´TZáÊŸìĞúœÓiè¤neûøOZDÿÛàÀ¹Ú,ÃÆ»ÿ…*O’3tÈtc5•1Xì0Lí(î(ñ°(·‘QğjÜ(İİ8ŒG¶š­sôM¾1’»#¨}yıõÔWÂ‘ÛõjÀç+$>à ÆI¼ÑE-ÁW¶ò¯öW£[‰©q‡Z%„k$)½B€Í«y"ƒ•ñ¢\©„¾>gy$ßı“Ãn«±ì¸SKÎÛXjuÊ}²U¼Ş†Nr|É}‘CÙöÿ½°Y“Uh>®è:$#Î£×+q!¸ìÛäTDI“!q»ÉNQõ›ü¹3Å¦(}Fâ~:ÂŒwQ4âÄÇ	ØÇç³éè4î1Ç¦’wmŒJƒ•Ê©õ÷6n´á„Ô³s&b•ÿósrò â”jÕb¨ÆŒ°Z£÷>~	öñ;vœJ+r(\²	éma¥‘m™×äH˜[+¡r3ÓlzÔgCµĞ¹i¤,K%K,…“`øï(÷‹e+dˆ}×‘uw"bî)”`O-=1§ÊºNê°¥ÈY¬H’mÒ«mG(.VÔ˜ö*.|·?¡B¬‡9Ğ"vô`µ²GéÚÃgTœĞÉFõ4Tfw½3™…æ8ÕpÙ“P¡Ë;æ¯ş€":ûÖÇ=“Ğİ÷‚Ôd·<}+¶“†/1˜§b“:q¦æ÷Äí(ÖN¢—½Ÿ°ê u¸ÍCs¶Æ¯İÕ²Ğ*j¼ŒœU4êLUnÛ@Ü-ÓjC™(ìè®¤Q™NÕşê;;Íƒ4Eıø¥bîKî"'„_«ú~;'ok‹Óë4²y$9^hÜ©ªCÅ¡)J’ûªÂzœôCK ÿ÷NY7{
™˜Àù!V8p©oº¢tÄ5)è"šûUÄĞü²Wa„âœÿİäk=ÿ‚Ã²¹š8\¾ò4YF®¾÷îi6ãÕnmm•"çÜ ¼uuFs÷ÎdO$·2ÕÖé°qn=Œ†J êığ>…wZ¹ÍMµB‰MZºl¶Yìj…SOE¾2—`
®üt\%x‡Õş}Ä<Õä#[.³#gÒw`¦Dv¿åû¸Çwüø0wsğ?÷¸}{Ôdà§¨=á»uı-€¦PÖş +fÊá-KUM ~ÒR‘;àõr¼»6D‡‚ˆŸ.KœÊˆå_«BĞ}—ÑFš’XÁ±*Y°[;8·+zòúËJ–ËD”lG"{Ö"‡nş­T™bßz0¾G>R/fûâŒ-KalF¥.„‰ÛÊ˜…bËáOò}õŠŞ”Áì&¹M±4Ò%_\ÊÇÃ-Ÿ×1Ÿ¬Ï(PÚe'´>ô»Ÿ–agŞÄ¤†Ú ?{©&^C“ÄĞ¬ƒÅšâ;NCKå~àŞ‘vÅ¥Šìm´{u=ú›"a­ª*j­Í’=K‡£Q–ø»#ğèd]¯,P†0ÿª¹ãÆK‚Í­_†W™ ìç{Xä(ô¼„/Ê¨”*, é)ŒKt
eKÇµ%~İhùüùy¯SNÆUĞå$‘fSUÄìAÊªœ%î”NÑe…K>b˜ïO}mü'GGµ€Ô‚X¸V±GÎQã®ÚµJáÎ°ÿH(¿¼ÿßx¤ıÃAi„CqØ„G£yKöÑAşöÆDeF‹¹¢gâ´+"|Ùj,ĞßrğÙ¤ìpÃeø³º¿¤)ª–ë2İ[İK± ‚îá‰‹¥%ÎFRîËŞ¦=Ë¹k¬œá`.ã| ş%~ù'¡
ŠÔ%˜f…±é.ajlÏf>—)½9SÑ¨OB!9ÄËç€Ö ¨3ÍOƒáav§è1ª'aN°Mü^M?¥¹ÌH•¨YİËW ’"?.DQ°…®4$ÎÓóÕ¯-PZB
åƒM×¯´çó¡…zµØZ|¬É/êfiüãé?PàÄ0Í—§ÖéèîİÎ¹òŸ·wºC*VIKºåqğ$R	\ƒŒëç*¤/ ĞzØ\‘£¤~«Š.o©èÆ8F·
Ã5©:·Ì¥n~vN:Û¯];¦×ÌpœÕ˜ëi^Ü/Ïaäåñª6&lWåOä¶Æ¿ğØãyÅRwgNî_Ñòd~jè*v®ysÂ˜°0O‘~©q´ÏÖŒO©a(˜ñµüÍf—)gs)Š¶SbEQşŒd*ËJø'ÖÛŸş%'‘,šƒUú?Iñy+¢•ñDüw*bÙçv­>Q‹0ŞÜ:üÿUw6f©l?áJ[ãV®f”¼°b‘7:ï“wÁ™×›×ûãjmè“PX³¹³®³n×„•İÄâ’D›ıŠœrÜœò7ô¡ÿs¬k€uŸ>ªP[Ä¥øÇ™V§«ÉpbACÎ_ø›¸Z'ŒÉíãÒ¢úÖñÓT'˜‰š±b)Gúãáˆ	çA=g8L¹Å/Åa‰v/Â$jx?úí¦Ò>Kç0h0hW‚ybuŒ%rV¦§É¦HÍ¨í%úO&CÆÀ	Ú´z;å­é€†›å^Y'DX[×9ØK¶	«¿Ò]#øüQÌX‰uQ,å ø#DŞ~*¯ø‘UŠQe¯?E^4~câÎpò26îÜ›²|*	B¾¶×» –ÄÉüx¡RõØf,€§;ã¡½"˜ÏûèÔ\Ãá¹d)Äş†A˜ã&1¬÷FÈÂÒ»pêä‘éÕ?(†eÍşƒĞ&lp.D¸htöt^tyú]«£’¶ÙWZ>½©U:ÌıMai=Ëıãêq˜Õhğ³Ì‰ƒg(ğt°òH«Â_øÅ|%=íõõi!ÚK	¦P°Ç± <â°[R±ÓNŠ ¤`ºÆ¸&ª0·ÚRgâµp¨@®{¨9ƒ$ÆÌBD]YKqG¡LÑ]ág&Ëá{ñF OÄPU="Ô£|7?A‘,8ÕºÍo¥£ ŸÀ˜3¤b<È½µİ#‚¨¨]@5	që0gï5ãâ7O9İ™ƒ§56ôEU‰­GŸ£OÆ$‹i×eU’…¿´uğ×V^6nC‡(¥‘ÕÕ±XüÌí"hSé7@¢`Ÿb·Í¸S¯j¥5—l€(®«$>j8âVU'Í7§#Ê¥EPb7‘v8ÒğvÚ Õ8ÜÙHK¦cEÔÜtù!İMè‚mšj{²t*¼iÂçˆÎŸ6h@lJûö¯æ™éïœ‹{l‡ˆ¿¨Œ×®%[å$*"êØ>ï]6Önğª£pJƒV ‹ÅéŠÏGHv¬‰FÕT¼’âüû~¢CãQv4CvÓFè¾BşyßNXû`%à±Ê2È‰2mÂLÉ©µ Æ’°ù¸;é§zhˆèŒW²FíEÙH´<È—\JÅ3·V¾Ì@:÷¤¤?ïY ÁË¢aİŞ‰¶05.é2Dj ½9ÑÿwHbõfM©póÕå²ìB;n©¬:¨ÀÍ€+…Y§û«ÓN™lL ¥ÉwMÇCêıÍøÖãA¾²ãrÇ²rVÛ@wğ~ôCæ<S5ş°ˆh¦PÅéºy ‘w§A]Zâ#RÓÄû¦£¢5ŒLÂ~ê&¬ø}ŞæE=k‘Î"ƒqtÖå2àëàovãqX~¯÷1K¨œÂH<ÿbæÇc%á:›‘½<d)½‰“T,Pq_9Åéè§9õnßÂí"&¬q¢Hİà2ƒxÙ"Î¬>Añ¬+ ÂĞÎ•Q='ÿÆÆ—ÄÍCöîAÒö”Æ{[òƒE2ZxòBx{¿ĞğÊŞa‘XAÃô‹–Ìï´OJVß/ãuü¢J³=ƒFùºP±Œì‰‰{Ó$¶ZQŸ––aPáÿCÛ½°…51©ÆzóÎÀ¬<(l}T{­F#ğ"ìk‡‰yÄfDb¡óaÅèàa
!ÛçX\.t2ß|U&^¯‰í¼Ğ˜öqœQFQd•€•ùHxæõb@A)İbÖJzÕ@G	€iš÷QG”üè²>.IVîƒy«TÙ˜'Ä²@ÁYd³C›ßjÌ+7×)S†5Ù _u›ü!P	˜&aìäV$lù±"±×ÆËà±AEuCgòbNt6^%Ä†©Çÿ×VD%€:.å]Øº7<ÊrÜsÒl1Äº‰1	8¨ÀUŞhl)HªUíêÖ.!¯Çğr—»KIÓ®V¨Yƒı×¿)úLïÉÃDœ»ÿ”O£F`L2¨q:Ò ©½æ >nnàÅ*‚ëBğó€ÆgÓ}Ë¯ÒÛÛt3xJOİ¬!GëüOÕeşR/Îœòé…·×MşŞ{clª>R˜)A8ÍºUïnYÅ… =İbßMêÎ(¦L/KgX—qÃÖóI«¸ëNƒ[ vˆ*Á%=Ú±*õ¢¸¨ 7¼eêk%RR=šŞP•Äm´Ï]@™\~±:ğ´oès[[µè¶÷ˆ€úÂBŞ0…®„i¶ê4‰3Lm8ÃâÿJo2ún<1‰à÷õ*%@m¯+
	Ó ÂÙêQ²).¿§ªÁşËòıŒ'¬ (GÈæ!/Ôf™ÑºêÚ•a»ñaBƒ›8§+‘ë@4 u—Èò£†Ó—†+.†ÏªÉtìÊÍÔQÃµ„Ô†ª¦µo¾®d¨×õeN^¿«HEKßhÓé½„tÕy0†B k`Îä:Àãlä–2Çt","aria-selected","aria-setsize"],superclassRole:["listitem","option"],accessibleNameRequired:!0,nameFromContent:!0},widget:{type:"abstract",superclassRole:["roletype"]},window:{type:"abstract",superclassRole:["roletype"]}},a={a:{variant:{href:{matches:"[href]",contentTypes:["interactive","phrasing","flow"],allowedRoles:["button","checkbox","menuitem","menuitemcheckbox","menuitemradio","option","radio","switch","tab","treeitem","doc-backlink","doc-biblioref","doc-glossref","doc-noteref"],namingMethods:["subtreeText"]},default:{contentTypes:["phrasing","flow"],allowedRoles:!0}}},abbr:{contentTypes:["phrasing","flow"],allowedRoles:!0},address:{contentTypes:["flow"],allowedRoles:!0},area:{variant:{href:{matches:"[href]",allowedRoles:!1},default:{allowedRoles:["button","link"]}},contentTypes:["phrasing","flow"],namingMethods:["altText"]},article:{contentTypes:["sectioning","flow"],allowedRoles:["feed","presentation","none","document","application","main","region"],shadowRoot:!0},aside:{contentTypes:["sectioning","flow"],allowedRoles:["feed","note","presentation","none","region","search","doc-dedication","doc-example","doc-footnote","doc-pullquote","doc-tip"]},audio:{variant:{controls:{matches:"[controls]",contentTypes:["interactive","embedded","phrasing","flow"]},default:{contentTypes:["embedded","phrasing","flow"]}},allowedRoles:["application"],chromiumRole:"Audio"},b:{contentTypes:["phrasing","flow"],allowedRoles:!0},base:{allowedRoles:!1,noAriaAttrs:!0},bdi:{contentTypes:["phrasing","flow"],allowedRoles:!0},bdo:{contentTypes:["phrasing","flow"],allowedRoles:!0},blockquote:{contentTypes:["flow"],allowedRoles:!0,shadowRoot:!0},body:{allowedRoles:!1,shadowRoot:!0},br:{contentTypes:["phrasing","flow"],allowedRoles:["presentation","none"],namingMethods:["titleText","singleSpace"]},button:{contentTypes:["interactive","phrasing","flow"],allowedRoles:["checkbox","combobox","link","menuitem","menuitemcheckbox","menuitemradio","option","radio","switch","tab"],namingMethods:["subtreeText"]},canvas:{allowedRoles:!0,contentTypes:["embedded","phrasing","flow"],chromiumRole:"Canvas"},caption:{allowedRoles:!1},cite:{contentTypes:["phrasing","flow"],allowedRoles:!0},code:{contentTypes:["phrasing","flow"],allowedRoles:!0},col:{allowedRoles:!1,noAriaAttrs:!0},colgroup:{allowedRoles:!1,noAriaAttrs:!0},data:{contentTypes:["phrasing","flow"],allowedRoles:!0},datalist:{contentTypes:["phrasing","flow"],allowedRoles:!1,noAriaAttrs:!0,implicitAttrs:{"aria-multiselectable":"false"}},dd:{allowedRoles:!1},del:{contentTypes:["phrasing","flow"],allowedRoles:!0},dfn:{contentTypes:["phrasing","flow"],allowedRoles:!0},details:{contentTypes:["interactive","flow"],allowedRoles:!1},dialog:{contentTypes:["flow"],allowedRoles:["alertdialog"]},div:{contentTypes:["flow"],allowedRoles:!0,shadowRoot:!0},dl:{contentTypes:["flow"],allowedRoles:["group","list","presentation","none"],chromiumRole:"DescriptionList"},dt:{allowedRoles:["listitem"]},em:{contentTypes:["phrasing","flow"],allowedRoles:!0},embed:{contentTypes:["interactive","embedded","phrasing","flow"],allowedRoles:["application","document","img","presentation","none"],chromiumRole:"EmbeddedObject"},fieldset:{contentTypes:["flow"],allowedRoles:["none","presentation","radiogroup"],namingMethods:["fieldsetLegendText"]},figcaption:{allowedRoles:["group","none","presentation"]},figure:{contentTypes:["flow"],allowedRoles:!0,namingMethods:["figureText","titleText"]},footer:{contentTypes:["flow"],allowedRoles:["group","none","presentation","doc-footnote"],shadowRoot:!0},form:{contentTypes:["flow"],allowedRoles:["search","none","presentation"]},h1:{contentTypes:["heading","flow"],allowedRoles:["none","presentation","tab","doc-subtitle"],shadowRoot:!0,implicitAttrs:{"aria-level":"1"}},h2:{contentTypes:["heading","flow"],allowedRoles:["none","presentation","tab","doc-subtitle"],shadowRoot:!0,implicitAttrs:{"aria-level":"2"}},h3:{contentTypes:["heading","flow"],allowedRoles:["none","presentation","tab","doc-subtitle"],shadowRoot:!0,implicitAttrs:{"aria-level":"3"}},h4:{contentTypes:["heading","flow"],allowedRoles:["none","presentation","tab","doc-subtitle"],shadowRoot:!0,implicitAttrs:{"aria-level":"4"}},h5:{contentTypes:["heading","flow"],allowedRoles:["none","presentation","tab","doc-subtitle"],shadowRoot:!0,implicitAttrs:{"aria-level":"5"}},h6:{contentTypes:["heading","flow"],allowedRoles:["none","presentation","tab","doc-subtitle"],shadowRoot:!0,implicitAttrs:{"aria-level":"6"}},head:{allowedRoles:!1,noAriaAttrs:!0},header:{contentTypes:["flow"],allowedRoles:["group","none","presentation","doc-footnote"],shadowRoot:!0},hgroup:{contentTypes:["heading","flow"],allowedRoles:!0},hr:{contentTypes:["flow"],allowedRoles:["none","presentation","doc-pagebreak"],namingMethods:["titleText","singleSpace"]},html:{allowedRoles:!1,noAriaAttrs:!0},i:{contentTypes:["phrasing","flow"],allowedRoles:!0},iframe:{contentTypes:["interactive","embedded","phrasing","flow"],allowedRoles:["application","document","img","none","presentation"],chromiumRole:"Iframe"},img:{variant:{nonEmptyAlt:{matches:[{attributes:{alt:"/.+/"}},{hasAccessibleName:!0}],allowedRoles:["button","checkbox","link","menuitem","menuitemcheckbox","menuitemradio","option","progressbar","radio","scrollbar","separator","slider","switch","tab","treeitem","doc-cover"]},usemap:{matches:"[usemap]",contentTypes:["interactive","embedded","flow"]},default:{allowedRoles:["presentation","none"],contentTypes:["embedded","flow"]}},namingMethods:["altText"]},input:{variant:{button:{matches:{properties:{type:"button"}},allowedRoles:["checkbox","combobox","link","menuitem","menuitemcheckbox","menuitemradio","option","radio","switch","tab"]},buttonType:{matches:{properties:{type:["button","submit","reset"]}},namingMethods:["valueText","titleText","buttonDefaultText"]},checkboxPressed:{matches:{properties:{type:"checkbox"},attributes:{"aria-pressed":"/.*/"}},allowedRoles:["button","menuitemcheckbox","option","switch"],implicitAttrs:{"aria-checked":"false"}},checkbox:{matches:{properties:{type:"checkbox"},attributes:{"aria-pressed":null}},allowedRoles:["menuitemcheckbox","option","switch"],implicitAttrs:{"aria-checked":"false"}},noRoles:{matches:{properties:{type:["color","date","datetime-local","file","month","number","password","range","reset","submit","time","week"]}},allowedRoles:!1},hidden:{matches:{properties:{type:"hidden"}},contentTypes:["flow"],allowedRoles:!1,noAriaAttrs:!0},image:{matches:{properties:{type:"image"}},allowedRoles:["link","menuitem","menuitemcheckbox","menuitemradio","radio","switch"],namingMethods:["altText","valueText","labelText","titleText","buttonDefaultText"]},radio:{matches:{properties:{type:"radio"}},allowedRoles:["menuitemradio"],implicitAttrs:{"aria-checked":"false"}},textWithList:{matches:{properties:{type:"text"},attributes:{list:"/.*/"}},allowedRoles:!1},default:{contentTypes:["interactive","flow"],allowedRoles:["combobox","searchbox","spinbutton"],implicitAttrs:{"aria-valuenow":""},namingMethods:["labelText","placeholderText"]}}},ins:{contentTypes:["phrasing","flow"],allowedRoles:!0},kbd:{contentTypes:["phrasing","flow"],allowedRoles:!0},label:{contentTypes:["interactive","phrasing","flow"],allowedRoles:!1,chromiumRole:"Label"},legend:{allowedRoles:!1},li:{allowedRoles:["menuitem","menuitemcheckbox","menuitemradio","option","none","presentation","radio","separator","tab","treeitem","doc-biblioentry","doc-endnote"],implicitAttrs:{"aria-setsize":"1","aria-posinset":"1"}},link:{contentTypes:["phrasing","flow"],allowedRoles:!1,noAriaAttrs:!0},main:{contentTypes:["flow"],allowedRoles:!1,shadowRoot:!0},map:{contentTypes:["phrasing","flow"],allowedRoles:!1,noAriaAttrs:!0},math:{contentTypes:["embedded","phrasing","flow"],allowedRoles:!1},mark:{contentTypes:["phrasing","flow"],allowedRoles:!0},menu:{contentTypes:["flow"],allowedRoles:["directory","group","listbox","menu","menubar","none","presentation","radiogroup","tablist","toolbar","tree"]},meta:{variant:{itemprop:{matches:"[itemprop]",contentTypes:["phrasing","flow"]}},allowedRoles:!1,noAriaAttrs:!0},meter:{contentTypes:["phrasing","flow"],allowedRoles:!1,chromiumRole:"progressbar"},nav:{contentTypes:["sectioning","flow"],allowedRoles:["doc-index","doc-pagelist","doc-toc","menu","menubar","none","presentation","tablist"],shadowRoot:!0},noscript:{contentTypes:["phrasing","flow"],allowedRoles:!1,noAriaAttrs:!0},object:{variant:{usemap:{matches:"[usemap]",contentTypes:["interactive","embedded","phrasing","flow"]},default:{contentTypes:["embedded","phrasing","flow"]}},allowedRoles:["application","document","img"],chromiumRole:"PluginObject"},ol:{contentTypes:["flow"],allowedRoles:["directory","group","listbox","menu","menubar","none","presentation","radiogroup","tablist","toolbar","tree"]},optgroup:{allowedRoles:!1},option:{allowedRoles:!1,implicitAttrs:{"aria-selected":"false"}},output:{contentTypes:["phrasing","flow"],allowedRoles:!0,namingMethods:["subtreeText"]},p:{contentTypes:["flow"],allowedRoles:!0,shadowRoot:!0},param:{allowedRoles:!1,noAriaAttrs:!0},picture:{contentTypes:["phrasing","flow"],allowedRoles:!1,noAriaAttrs:!0},pre:{contentTypes:["flow"],allowedRoles:!0},progress:{contentTypes:["phrasing","flow"],allowedRoles:!1,implicitAttrs:{"aria-valuemax":"100","aria-valuemin":"0","aria-valuenow":"0"}},q:{contentTypes:["phrasing","flow"],allowedRoles:!0},rp:{allowedRoles:!0},rt:{allowedRoles:!0},ruby:{contentTypes:["phrasing","flow"],allowedRoles:!0},s:{contentTypes:["phrasing","flow"],allowedRoles:!0},samp:{contentTypes:["phrasing","flow"],allowedRoles:!0},script:{contentTypes:["phrasing","flow"],allowedRoles:!1,noAriaAttrs:!0},section:{contentTypes:["sectioning","flow"],allowedRoles:["alert","alertdialog","application","banner","complementary","contentinfo","dialog","document","feed","group","log","main","marquee","navigation","none","note","presentation","search","status","tabpanel","doc-abstract","doc-acknowledgments","doc-afterword","doc-appendix","doc-bibliography","doc-chapter","doc-colophon","doc-conclusion","doc-credit","doc-credits","doc-dedication","doc-endnotes","doc-epigraph","doc-epilogue","doc-errata","doc-example","doc-foreword","doc-glossary","doc-index","doc-introduction","doc-notice","doc-pagelist","doc-part","doc-preface","doc-prologue","doc-pullquote","doc-qna","doc-toc"],shadowRoot:!0},select:{variant:{combobox:{matches:{attributes:{multiple:null,size:[null,"1"]}},allowedRoles:["menu"]},default:{allowedRoles:!1}},contentTypes:["interactive","phrasing","flow"],implicitAttrs:{"aria-valuenow":""},namingMethods:["labelText"]},slot:{contentTypes:["phrasing","flow"],allowedRoles:!1,noAriaAttrs:!0},small:{contentTypes:["phrasing","flow"],allowedRoles:!0},source:{allowedRoles:!1,noAriaAttrs:!0},span:{contentTypes:["phrasing","flow"],allowedRoles:!0,shadowRoot:!0},strong:{contentTypes:["phrasing","flow"],allowedRoles:!0},style:{allowedRoles:!1,noAriaAttrs:!0},svg:{contentTypes:["embedded","phrasing","flow"],allowedRoles:!0,chromiumRole:"SVGRoot",namingMethods:["svgTitleText"]},sub:{contentTypes:["phrasing","flow"],allowedRoles:!0},summary:{allowedRoles:!1,namingMethods:["subtreeText"]},sup:{contentTypes:["phrasing","flow"],allowedRoles:!0},table:{contentTypes:["flow"],allowedRoles:!0,namingMethods:["tableCaptionText","tableSummaryText"]},tbody:{allowedRoles:!0},template:{contentTypes:["phrasing","flow"],allowedRoles:!1,noAriaAttrs:!0},textarea:{contentTypes:["interactive","phrasing","flow"],allowedRoles:!1,implicitAttrs:{"aria-valuenow":"","aria-multiline":"true"},namingMethods:["labelText","placeholderText"]},tfoot:{allowedRoles:!0},thead:{allowedRoles:!0},time:{contentTypes:["phrasing","flow"],allowedRoles:!0},title:{allowedRoles:!1,noAriaAttrs:!0},td:{allowedRoles:!0},th:{allowedRoles:!0},tr:{allowedRoles:!0},track:{allowedRoles:!1,noAriaAttrs:!0},u:{contentTypes:["phrasing","flow"],allowedRoles:!0},ul:{contentTypes:["flow"],allowedRoles:["directory","group","listbox","menu","menubar","none","presentation","radiogroup","tablist","toolbar","tree"]},var:{contentTypes:["phrasing","flow"],allowedRoles:!0},video:{variant:{controls:{matches:"[controls]",contentTypes:["interactive","embedded","phrasing","flow"]},default:{contentTypes:["embedded","phrasing","flow"]}},allowedRoles:["application"],chromiumRole:"video"},wbr:{contentTypes:["phrasing","flow"],allowedRoles:["presentation","none"]}},Oo={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]},_o={ariaAttrs:No,ariaRoles:p({},Ro,{"doc-abstract":{type:"section",allowedAttrs:["aria-expanded"],superclassRole:["section"]},"doc-acknowledgments":{type:"landmark",allowedAttrs:["aria-expanded"],superclassRole:["landmark"]},"doc-afterword":{type:"landmark",allowedAttrs:["aria-expanded"],superclassRole:["landmark"]},"doc-appendix":{type:"landmark",allowedAttrs:["aria-expanded"],superclassRole:["landmark"]},"doc-backlink":{type:"link",allowedAttrs:["aria-expanded"],nameFromContent:!0,superclassRole:["link"]},"doc-biblioentry":{type:"listitem",allowedAttrs:["aria-expanded","aria-level","aria-posinset","aria-setsize"],suortNames=null,this.ast=null,this.exportAllModules=[],this.exportAllSources=new Set,this.exportNamesByVariable=null,this.exportShimVariable=new an(this),this.exports=new Map,this.namespaceReexportsByName=new Map,this.reexportDescriptions=new Map,this.relevantDependencies=null,this.syntheticExports=new Map,this.syntheticNamespace=null,this.transformDependencies=[],this.transitiveReexports=null,this.excludeFromSourcemap=/\0/.test(t),this.context=i.moduleContext(t),this.preserveSignature=this.options.preserveEntrySignatures;const o=this,{dynamicImports:l,dynamicImporters:h,implicitlyLoadedAfter:c,implicitlyLoadedBefore:u,importers:d,reexportDescriptions:p,sources:f}=this;this.info={ast:null,code:null,get dynamicallyImportedIdResolutions(){return l.map((({argument:e})=>"string"==typeof e&&o.resolvedIds[e])).filter(Boolean)},get dynamicallyImportedIds(){return l.map((({id:e})=>e)).filter((e=>null!=e))},get dynamicImporters(){return h.sort()},get hasDefaultExport(){return o.ast?o.exports.has("default")||p.has("default"):null},get hasModuleSideEffects(){return ke("Accessing ModuleInfo.hasModuleSideEffects from plugins is deprecated. Please use ModuleInfo.moduleSideEffects instead.",!1,i),this.moduleSideEffects},id:t,get implicitlyLoadedAfterOneOf(){return Array.from(c,cn).sort()},get implicitlyLoadedBefore(){return Array.from(u,cn).sort()},get importedIdResolutions(){return Array.from(f,(e=>o.resolvedIds[e])).filter(Boolean)},get importedIds(){return Array.from(f,(e=>{var t;return null===(t=o.resolvedIds[e])||void 0===t?void 0:t.id})).filter(Boolean)},get importers(){return d.sort()},isEntry:s,isExternal:!1,get isIncluded(){return e.phase!==hn.GENERATE?null:o.isIncluded()},meta:{...a},moduleSideEffects:n,syntheticNamedExports:r},Object.defineProperty(this.info,"hasModuleSideEffects",{enumerable:!1})}basename(){const e=_(this.id),t=T(this.id);return $e(t?e.slice(0,-t.length):e)}bindReferences(){this.ast.bind()}error(e,t){return this.addLocationToLogProps(e,t),fe(e)}getAllExportNames(){if(this.allExportNames)return this.allExportNames;this.allExportNames=new Set([...this.exports.keys(),...this.reexportDescriptions.keys()]);for(const e of this.exportAllModules)if(e instanceof Te)this.allExportNames.add(`*${e.id}`);else for(const t of e.getAllExportNames())"default"!==t&&this.allExportNames.add(t);return"string"==typeof this.info.syntheticNamedExports&&this.allExportNames.delete(this.info.syntheticNamedExports),this.allExportNames}getDependenciesToBeIncluded(){if(this.relevantDependencies)return this.relevantDependencies;this.relevantDependencies=new Set;const e=new Set,t=new Set,i=new Set(this.includedImports);if(this.info.isEntry||this.includedDynamicImporters.length>0||this.namespace.included||this.implicitlyLoadedAfter.size>0)for(const e of[...this.getReexports(),...this.getExports()]){const[t]=this.getVariableForExportName(e);t&&i.add(t)}for(let s of i){const i=this.sideEffectDependenciesByVariable.get(s);if(i)for(const e of i)t.add(e);s instanceof ln?s=s.getBaseVariable():s instanceof Js&&(s=s.getOriginalVariable()),e.add(s.module)}if(this.options.treeshake&&"no-treeshake"!==this.info.moduleSideEffects)this.addRelevantSideEffectDependencies(this.relevantDependencies,e,t);else for(const e of this.dependencies)this.relevantDependencies.add(e);for(const t of e)this.relevantDependencies.add(t);return this.relevantDependencies}getExportNamesByVariable(){if(this.exportNamesByVariable)return this.exportNamesByVariable;const e=new Map;for(const t of this.getAllExportNames()){let[i]=this.getVariableForExportName(t);if(i instanceof Js&&(i=i.getOriginalVariable()),!i||!(i.included||i instanceof ie))continue;const s=e.get(i);s?s.push(t):e.set(i,[t])}return this.exportNamesByVariable=e}getExports(){return Array.from(this.exports.keys())}getReexports(){if(this.transitiveReexports)return this.transitiveReexports;this.transitiveReexports=[];const e=new Set(this.reexportDescriptions.keys());for(const t of this.exportAllModules)if(t instanceof Te)e.add(`*${t.id}`);else for(const i of[...t.getReexports(),...t.getExports()])"default"!==i&&e.add(i);return this.transitiveReexports=[...e]}getRenderedExports(){const e=[],t=[];for(const i of this.exports.keys()){const[s]=this.getVariableForExportName(i);(s&&s.included?e:t).push(i)}return{removedExports:t,renderedExports:e}}getSyntheticNamespace(){return null===this.syntheticNamespace&&(this.syntheticNamespace=void 0,[this.syntheticNamespace]=this.getVariableForExportName("string"==typeof this.info.syntheticNamedExports?this.info.syntheticNamedExports:"default",{onlyExplicit:!0})),this.syntheticNamespace?this.syntheticNamespace:fe((e=this.id,t=this.info.syntheticNamedExports,{code:ge.SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT,id:e,message:`Module "${ce(e)}" that is marked with 'syntheticNamedExports: ${JSON.stringify(t)}' needs ${"string"==typeof t&&"default"!==t?`an explicit export named "${t}"`:"a default export"} that does not reexport an unresolved named export of the same module.`}));var e,t}getVariableForExportName(e,{importerForSideEffects:t,isExportAllSearch:i,onlyExplicit:s,searchedNamesAndModules:n}=ne){var r;if("*"===e[0])return 1===e.length?[this.namespace]:this.graph.modulesById.get(e.slice(1)).getVariableForExportName("*");const a=this.reexportDescriptions.get(e);if(a){const[e]=Pn(a.module,a.localName,t,!1,n);return e?(t&&wn(e,t,this),[e]):this.error(be(a.localName,this.id,a.module.id),a.start)}const o=this.exports.get(e);if(o){if(o===In)return[this.exportShimVariable];const e=o.localName,i=this.traceVariable(e,{importerForSideEffects:t,searchedNamesAndModules:n});return t&&(R(t.sideEffectDependenciesByVariable,i,(()=>new Set)).add(this),wn(i,t,this)),[i]}if(s)return[null];if("default"!==e){const i=null!==(r=this.namespaceReexportsByName.get(e))&&void 0!==r?r:this.getVariableFromNamespaceReexports(e,t,n);if(this.namespaceReexportsByName.set(e,i),i[0])return i}return this.info.syntheticNamedExports?[R(this.syntheticExports,e,(()=>new ln(this.astContext,e,this.getSyntheticNamespace())))]:!i&&this.options.shimMissingExports?(this.shimMissingExport(e),[this.exportShimVariable]):[null]}hasEffects(){return"no-treeshake"===this.info.moduleSideEffects||this.ast.included&&this.ast.hasEffects(De())}include(){const e=Re();this.ast.shouldBeIncluded(e)&&this.ast.include(e,!1)}includeAllExports(e){this.isExecuted||(An(this),this.graph.needsTreeshakingPass=!0);for(const t of this.exports.keys())if(e||t!==this.info.syntheticNamedExports){const e=this.getVariableForExportName(t)[0];e.deoptimizePath(F),e.included||this.includeVariable(e)}for(const e of this.getReexports()){const[t]=this.getVariableForExportName(e);t&&(t.deoptimizePath(F),t.included||this.includeVariable(t),t instanceof ie&&(t.module.reexported=!0))}e&&this.namespace.setMergedNamespaces(this.includeAndGetAdditionalMergedNamespaces())}includeAllInBundle(){this.ast.include(Re(),!0),this.includeAllExports(!1)}isIncluded(){return this.ast.included||this.namespace.included||this.importedFromNotTreeshaken}linkImports(){this.addModulesToImportDescriptions(this.importDescriptions),this.addModulesToImportDescriptions(this.reexportDescriptions);const e=[];for(const t of this.exportAllSources){const i=this.graph.modulesById.get(this.resolvedIds[t].id);i instanceof Te?e.push(i):this.exportAllModules.push(i)}this.exportAllModules.push(...e)}render(e){const t=this.magicString.clone();return this.ast.render(t,e),this.usesTopLevelAwait=this.astContext.usesTopLevelAwait,t}setSource({ast:e,code:t,customTransformCache:i,originalCode:s,originalSourcemap:n,resolvedIds:r,sourcemapChain:a,transformDependencies:o,transformFiles:l,...h}){this.info.code=t,this.originalCode=s,this.originalSourcemap=n,this.sourcemapChain=a,l&&(this.transformFiles=l),this.transformDependencies=o,this.customTransformCache=i,this.updateOptions(h),En("generate ast",3),e||(e=this.tryParse()),bn("generate ast",3),this.resolvedIds=r||Object.create(null);const c=this.id;this.magicString=new E(t,{filename:this.excludeFromSourcemap?null:c,indentExclusionRanges:[]}),En("analyse ast",3),this.astContext={addDynamicImport:this.addDynamicImport.bind(this),addExport:this.addExport.bind(this),addImport:this.addImport.bind(this),addImportMeta:this.addImportMeta.bind(this),code:t,deoptimizationTracker:this.graph.deoptimizationTracker,error:this.error.bind(this),fileName:c,getExports:this.getExports.bind(this),getModuleExecIndex:()=>this.execIndex,getModuleName:this.basename.bind(this),getNodeConstructor:e=>nn[e]||nn.UnknownNode,getReexports:this.getReexports.bind(this),importDescriptions:this.importDescriptions,includeAllExports:()=>this.includeAllExports(!0),includeDynamicImport:this.includeDynamicImport.bind(this),includeVariableInModule:this.includeVariableInModule.bind(this),magicString:this.magicString,module:this,moduleContext:this.context,options:this.options,requestTreeshakingPass:()=>this.graph.needsTreeshakingPass=!0,traceExport:e=>this.getVariableForExportName(e)[0],traceVariable:this.traceVariable.bind(this),usesTopLevelAwait:!1,warn:this.warn.bind(this)},this.scope=new Zs(this.graph.scope,this.astContext),this.namespace=new on(this.astContext),this.ast=new Ks(e,{context:this.astContext,type:"Module"},this.scope),this.info.ast=e,bn("analyse ast",3)}toJSON(){return{ast:this.ast.esTreeNode,code:this.info.code,customTransformCache:this.customTransformCache,dependencies:Array.from(this.dependencies,cn),id:this.id,meta:this.info.meta,moduleSideEffects:this.info.moduleSideEffects,originalCode:this.originalCode,originalSourcemap:this.originalSourcemap,resolvedIds:this.resolvedIds,sourcemapChain:this.sourcemapChain,syntheticNamedExports:this.info.syntheticNamedExports,transformDependencies:this.transformDependencies,transformFiles:this.transformFiles}}traceVariable(e,{importerForSideEffects:t,isExportAllSearch:i,searchedNamesAndModules:s}=ne){const n=this.scope.variables.get(e);if(n)return n;const r=this.importDescriptions.get(e);if(r){const e=r.module;if(e instanceof kn&&"*"===r.name)return e.namespace;const[n]=Pn(e,r.name,t||this,i,s);return n||this.error(be(r.name,this.id,e.id),r.start)}return null}tryParse(){try{return this.graph.contextParse(this.info.code)}catch(e){let t=e.message.replace(/ \(\d+:\d+\)$/,"");return this.id.endsWith(".json")?t+=" (Note that you need @rollup/plugin-json to import JSON files)":this.id.endsWith(".js")||(t+=" (Note that you need plugins to import files that are not JavaScript)"),this.error({code:"PARSE_ERROR",message:t,parserError:e},e.pos)}}updateOptions({meta:e,moduleSideEffects:t,syntheticNamedExports:i}){null!=t&&(this.info.moduleSideEffects=t),null!=i&&(this.info.syntheticNamedExports=i),null!=e&&Object.assign(this.info.meta,e)}warn(e,t){this.addLocationToLogProps(e,t),this.options.onwarn(e)}addDynamicImport(e){let t=e.source;t instanceof Ys?1===t.quasis.length&&t.quasis[0].value.cooked&&(t=t.quasis[0].value.cooked):t instanceof ji&&"string"==typeof t.value&&(t=t.value),this.dynamicImports.push({argument:t,id:null,node:e,resolution:null})}addExport(e){if(e instanceof ns)this.exports.set("default",{identifier:e.variable.getAssignedVariableName(),localName:"default"});else if(e instanceof is){const t=e.source.value;if(this.sources.add(t),e.exported){const i=e.exported.name;this.reexportDescriptions.set(i,{localName:"*",module:null,source:t,start:e.start})}else this.exportAllSources.add(t)}else if(e.source instanceof ji){const t=e.source.value;this.sources.add(t);for(const i of e.specifiers){const e=i.exported.name;this.reexportDescriptions.set(e,{localName:i.local.name,module:null,source:t,start:i.start})}}else if(e.declaration){const t=e.declaration;if(t instanceof sn)for(const e of t.declarations)for(const t of Me(e.id))this.exports.set(t,{identifier:null,localName:t});else{const e=t.id.name;this.exports.set(e,{identifier:null,localName:e})}}else for(const t of e.specifiers){const e=t.local.name,i=t.exported.name;this.exports.set(i,{identifier:null,localName:e})}}addImport(e){const t=e.source.value;this.sources.add(t);for(const i of e.specifiers){const e="ImportDefaultSpecifier"===i.type,s="ImportNamespaceSpecifier"===i.type,n=e?"default":s?"*":i.imported.name;this.importDescriptions.set(i.local.name,{module:null,name:n,source:t,start:i.start})}}addImportMeta(e){this.importMetas.push(e)}addLocationToLogProps(e,t){e.id=this.id,e.pos=t;let i=this.info.code;const s=ae(i,t,{offsetLine:1});if(s){let{column:n,line:r}=s;try{({column:n,line:r}=function(e,t){const i=e.filter((e=>!!e.mappings));e:for(;i.length>0;){const e=i.pop().mappings[t.line-1];if(e){const i=e.filter((e=>e.length>1)),s=i[i.length-1];for(const e of i)if(e[0]>=t.column||e===s){t={column:e[3],line:e[2]+1};continue e}}throw new Error("Can't resolve original location of error.")}return t}(this.sourcemapChain,{column:n,line:r})),i=this.originalCode}catch(e){this.options.onwarn({code:"SOURCEMAP_ERROR",id:this.id,loc:{column:n,file:this.id,line:r},message:`Error when using sourcemap for reporting an error: ${e.message}`,pos:t})}me(e,{column:n,line:r},i,this.id)}}addModulesToImportDescriptions(e){for(const t of e.values()){const{id:e}=this.resolvedIds[t.source];t.module=this.graph.modulesById.get(e)}}addRelevantSideEffectDependencies(e,t,i){const s=new Set,n=r=>{for(const a of r)s.has(a)||(s.add(a),t.has(a)?e.add(a):(a.info.moduleSideEffects||i.has(a))&&(a instanceof Te||a.hasEffects()?e.add(a):n(a.dependencies)))};n(this.dependencies),n(i)}getVariableFromNamespaceReexports(e,t,i){let s=null;const n=new Map,r=new Set;for(const a of this.exportAllModules){if(a.info.syntheticNamedExports===e)continue;const[o,l]=Pn(a,e,t,!0,Cn(i));a instanceof Te||l?r.add(o):o instanceof ln?s||(s=o):o&&n.set(o,a)}if(n.size>0){const t=[...n],i=t[0][0];return 1===t.length?[i]:(this.options.onwarn(function(e,t,i){return{code:ge.NAMESPACE_CONFLICT,message:`Conflicting namespaces: "${ce(t)}" re-exports "${e}" from one of the modules ${le(i.map((e=>ce(e))))} (will be ignored)`,name:e,reexporter:t,sources:i}}(e,this.id,t.map((([,e])=>e.id)))),[null])}if(r.size>0){const t=[...r],i=t[0];return t.length>1&&this.options.onwarn(function(e,t,i,s){return{code:ge.AMBIGUOUS_EXTERNAL_NAMESPACES,message:`Ambiguous external namespace resolution: "${ce(t)}" re-exports "${e}" from one of the external modules ${le(s.map((e=>ce(e))))}, guessing "${ce(i)}".`,name:e,reexporter:t,sources:s}}(e,this.id,i.module.id,t.map((e=>e.module.id)))),[i,!0]}return s?[s]:[null]}includeAndGetAdditionalMergedNamespaces(){const e=new Set,t=new Set;for(const i of[this,...this.exportAllModules])if(i instanceof Te){const[t]=i.getVariableForExportName("*");t.include(),this.includedImports.add(t),e.add(t)}else if(i.info.syntheticNamedExports){const e=i.getSyntheticNamespace();e.include(),this.includedImports.add(e),t.add(e)}return[...t,...e]}includeDynamicImport(e){const t=this.dynamicImports.find((t=>t.node===e)).resolution;t instanceof kn&&(t.includedDynamicImporters.push(this),t.includeAllExports(!0))}includeVariable(e){if(!e.included){e.include(),this.graph.needsTreeshakingPass=!0;const t=e.module;if(t instanceof kn&&(t.isExecuted||An(t),t!==this)){const t=function(e,t){const i=R(t.sideEffectDependenciesByVariable,e,(()=>new Set));let s=e;const n=new Set([s]);for(;;){const e=s.module;if(s=s instanceof Js?s.getDirectOriginalVariable():s instanceof ln?s.syntheticNamespace:null,!s||n.has(s))break;n.add(s),i.add(e);const t=e.sideEffectDependenciesByVariable.get(s);if(t)for(const e of t)i.add(e)}return i}(e,this);for(const e of t)e.isExecuted||An(e)}}}includeVariableInModule(e){this.includeVariable(e);const t=e.module;t&&t!==this&&this.includedImports.add(e)}shimMissingExport(e){this.options.onwarn({code:"SHIMMED_EXPORT",exporter:ce(this.id),exportName:e,message:`Missing export "${e}" has been shimmed in module ${ce(this.id)}.`}),this.exports.set(e,In)}}function wn(e,t,i){if(e.module instanceof kn&&e.module!==i){const s=e.module.cycles;if(s.size>0){const n=i.cycles;for(const r of n)if(s.has(r)){t.alternativeReexportModules.set(e,i);break}}}}const Cn=e=>e&&new Map(Array.from(e,(([e,t])=>[e,new Set(t)])));function Nn(e){return e.endsWith(".js")?e.slice(0,-3):e}function _n(e,t){return e.autoId?`${e.basePath?e.basePath+"/":""}${Nn(t)}`:e.id||""}function $n(e,t,i,s,n,r,a,o="return "){const{_:l,cnst:h,getDirectReturnFunction:c,getFunctionIntro:u,getPropertyAccess:d,n:p,s:f}=n;if(!i)return`${p}${p}${o}${function(e,t,i,s,n){if.           `g§mXmX  h§mX—    ..          `g§mXmX  h§mXŸN    AUTO    JS  Äj§mXmX  m§mX%˜$   Bn . j s    2ÿÿÿÿÿÿÿÿÿÿÿÿ  ÿÿÿÿi m p l e  2m e n t a t   i o IMPLEM~1JS   c\¨mX|X  `¨mX©«?   INDEX   JS  ¬„¨mXmX  †¨mXò²  POLYFILLJS  WÅ¨mXmX  Æ¨mX?¿‡   SHIM    JS  	Ù¨mXmX  Ú¨mXÃ)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  .           lg§mXmX  h§mX—    ..          lg§mXmX  h§mX¥–    Aa d d S p  Ma c e . d .   t s ADDSPA~1TS   Äj§mXmX  m§mX&˜Z   Ag e t V a  9l u e . d .   t s GETVAL~1TS   ;¨mXmX  ¨mXËŸg   B. d . t s  *  ÿÿÿÿÿÿÿÿÿÿ  ÿÿÿÿj o i n G  *r i d V a l   u e JOINGR~1TS   \+¨mXmX  -¨mX£F   B. d . t s  d  ÿÿÿÿÿÿÿÿÿÿ  ÿÿÿÿm a t h f  du n c t i o   n s MATHFU~1TS   ƒ6¨mXmX  8¨mXæ¤  Bx e d . d  7. t s   ÿÿÿÿ  ÿÿÿÿv e n d o  7r U n p r e   f i VENDOR~1TS   u=¨mXmX  A¨mXë¥ˆ                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const util_1 = require("../util");
exports.default = (0, util_1.createRule)({
    name: 'consistent-generic-constructors',
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Enforce specifying generic type arguments on type annotation or constructor name of a constructor call',
            recommended: 'strict',
        },
        messages: {
            preferTypeAnnotation: 'The generic type arguments should be specified as part of the type annotation.',
            preferConstructor: 'The generic type arguments should be specified as part of the constructor type arguments.',
        },
        fixable: 'code',
        schema: [
            {
                enum: ['type-annotation', 'constructor'],
            },
        ],
    },
    defaultOptions: ['constructor'],
    create(context, [mode]) {
        const sourceCode = context.getSourceCode();
        return {
            'VariableDeclarator,PropertyDefinition,:matches(FunctionDeclaration,FunctionExpression) > AssignmentPattern'(node) {
                var _a, _b;
                function getLHSRHS() {
                    switch (node.type) {
                        case utils_1.AST_NODE_TYPES.VariableDeclarator:
                            return [node.id, node.init];
                        case utils_1.AST_NODE_TYPES.PropertyDefinition:
                            return [node, node.value];
                        case utils_1.AST_NODE_TYPES.AssignmentPattern:
                            return [node.left, node.right];
                        default:
                            throw new Error(`Unhandled node type: ${node.type}`);
                    }
                }
                const [lhsName, rhs] = getLHSRHS();
                const lhs = (_a = lhsName.typeAnnotation) === null || _a === void 0 ? void 0 : _a.typeAnnotation;
                if (!rhs ||
                    rhs.type !== utils_1.AST_NODE_TYPES.NewExpression ||
                    rhs.callee.type !== utils_1.AST_NODE_TYPES.Identifier) {
                    return;
                }
                if (lhs &&
                    (lhs.type !== utils_1.AST_NODE_TYPES.TSTypeReference ||
                        lhs.typeName.type !== utils_1.AST_NODE_TYPES.Identifier ||
                        lhs.typeName.name !== rhs.callee.name)) {
                    return;
                }
                if (mode === 'type-annotation') {
                    if (!lhs && rhs.typeParameters) {
                        const { typeParameters, callee } = rhs;
                        const typeAnnotation = sourceCode.getText(callee) + sourceCode.getText(typeParameters);
                        context.report({
                            node,
                            messageId: 'preferTypeAnnotation',
                            fix(fixer) {
                                function getIDToAttachAnnotation() {
                                    if (node.type !== utils_1.AST_NODE_TYPES.PropertyDefinition) {
                                        return lhsName;
                                    }
                                    if (!node.computed) {
                                        return node.key;
                                    }
                                    // If the property's computed, we have to attach the
                                    // annotation after the square bracket, not the enclosed expression
                                    return sourceCode.getTokenAfter(node.key);
                                }
                                return [
                                    fixer.remove(typeParameters),
                                    fixer.insertTextAfter(getIDToAttachAnnotation(), ': ' + typeAnnotation),
                                ];
                            },
                        });
                    }
                    return;
                }
                if (mode === 'constructor') {
                    if ((lhs === null || lhs === void 0 ? void 0 : lhs.typeParameters) && !rhs.typeParameters) {
                        const hasParens = ((_b = sourceCode.getTokenAfter(rhs.callee)) === null || _b === void 0 ? void 0 : _b.value) === '(';
                        const extraComments = new Set(sourceCode.getCommentsInside(lhs.parent));
                        sourceCode
                            .getCommentsInside(lhs.typeParameters)
                            .forEach(c => extraComments.delete(c));
                        context.report({
                            node,
                            messageId: 'preferConstructor',
                            *fix(fixer) {
                                yield fixer.remove(lhs.parent);
                                for (const comment of extraComments) {
                                    yield fixer.insertTextAfter(rhs.callee, sourceCode.getText(comment));
                                }
                                yield fixer.insertTextAfter(rhs.callee, sourceCode.getText(lhs.typeParameters));
                                if (!hasParens) {
                                    yield fixer.insertTextAfter(rhs.callee, '()');
                                }
                            },
                        });
                    }
                }
            },
        };
    },
});
//# sourceMappingURL=consistent-generic-constructors.js.map                                                                      ÄZYÆzQ‚4DsjÈwíUƒšîÉª¿üµşbö<TÙ1ÉUÈƒĞP¾J…n§Æ;“ÖC²±kS‚¦ˆ´†| °ƒ{Ã¶Ç¦®hÌÇ-Vû»f§Nmc¢•Œ1Ê•º¬X’Ï¯ùNÒ6U¨Boö`Ù9ô‘ıs 7º‚ş¸ƒÔÜ¶Èx‡¡™éŸ.7ê¤ıËÒr•*û' 8(ƒ^’iº5üm{0Ûï1ÓD®AÜÿ$›Ö ùv"vj´¿‚6%Arãi“n¯/¨W¼%—ı$BbÆmË&³V½G„ÂŸıT?›\ÄïóÍš»¶è)ôbpÒÚ:bÙå0Âıûìß}"¼}¶~Q|*›W[6>rŒW*éüWeˆÇ™g»JÆÈ%kC5œ%®²°˜éú>±ˆ=K˜ªogó»[İ>ïvÓâœj‰¼í=¥çJ€ì~–_&ºbë5&à»k€-o‚ UIR„]Ò¥Üˆ§D‡¬B¨[ùx¹d/)kìáNyğu9±şìüö‘nßõ"ÏugºÌ´C!AÁ¸ÑÜ3™ Š¢¹…¹°ó’q¥ AÉ<ã‚©,~«»ƒaQ¢·lI6K¦*Æ8$8P÷î£í‘f»üWšßªg*ß°ë`±X},X<£¹´îwY"ÅrŸHÙR¯l‘±pÙÊx¿ €¿¹LtbÀ‚¯x,ø[‘Ş‹iNÁ6ñ@m&\5ÃóWè^Ø£±$PF„RSİy¾ÇÚdX”,ç—;ÜÆaR?)F2¥«ø‰ê+Î^d«­Ú{Lâş,é;¶®C/Fà¿åãÏòf¯xÛ¦ÛÛ¢5õØSÔšî‡ª¶×±‰ÙlÔD!Ã1DÃÚ#'ªMéş´2ë¥ƒŞbhêS^@r~.q5¬<ù­Ó½ÚlNÜ‘š¾¸Fiy­Ê·	Y¡õ˜ú˜¾jnä4ZrÏêÚ°ùÌ3JéàEÌÛÈáã,>u­ƒ&ÌK©·ºèï:xz6Æğu¤ÈÁÊ²?CËFZïã6³c­¼Š¸‡Ş‡%«Œ=EâV}S{õ¼«É,³¢˜	|‘oø¬ÏĞéÂ•„œa—út%„`6)ı…ÆÒEüR,µV^…âGHI³ÄNÒiÎ¤•°Õn4STË™­_Ø4—„ üD,d†•zË¥€Î,"Ä—Æfã!@–v‡Bù©½¿:kòà˜)>!g7~€ ¸|jÒ†™ˆ¢¤“$(Ğ¯ªß*ÿœ›âåÖğaqÃËĞ³C8+òåF†KEE†ğ7ö@½‘	ny^ÚëÒ+½	RéhNûO\‘sœŠC+˜›ıú›Wºß7Æ„o	ıÉå’î»‘#671‘_è÷F7åt©té»µ†€íËZğ'åºÑZ‚ğ¤—éEô^A–ŠÈ–‡<¿ÇÜàö@½Ÿyøò›àG"çjÀÀ€Ù“î¥»ŠàR1ƒ'îæuä[QúàÍ/ñbGğ¼õ0˜Ê½<š¡i.&V§L]Íú¡
,,6Æ`v¾^$ºŞiûƒ¦‚îµÍ«â"Ó¥œeúğÂÉ(p²—î£×¢ó":"Ë‚á…m˜ä9keQÑG/=¿˜‘óÖL£DŸ^/o‰Àz‹%µSnˆŒ½}:î
É!¤/JB3¹3—¼½¥–¦èr‡¬y0vW»é@æ”0•İòØ)V6²ş0B²ãõé³Í>fÙcÅ»mØ°†-YšÄò;ğúæjüRŞİüGíò‚^ËšZ%fâ¬†Œ_Ò§Ğˆ7{ø™ß¸æu½™åÏ§+6¨lÇ‡Ç“©"ê-É ªÓPb{¾†{ù±õ…ÉT°ï”ô|0ƒ*Áqì’ÕÃ
Ñ”}«ÂU‡Z*)ò¬OÕ!¥8`òM8“£cğZŒo”6ÏDYå€‘ÆŒn¿É}ªšÊ•Û»/£ÊìõakÌ_’bf@Y[Á6šY¢°Üıø1ïå¨	Àû•ëlÃ\&à‹#0ûõPDß¢Z‚Şû©İ4“ÒİÒ>èÿ}­£Û`k;aG+pe'¨ORì;îĞú£09Ã‚†‹\’;_íIÎ4ÅGåœú„C€ú@(ĞâCİıÃ¡™üã¢{Cc3ƒËÒŸï1–³İ¦ù´q÷½ÙdÄòCÌÌ²_tÖÚ“£Ğ$zõ–@§w¯Ü¹9qñel±IÎ¯mü¼ş-Z2fşùÃòP({~-½À›¯^Ü{21  Ÿiÿ§eEnì½ê5Ñ®ÎŸK·å¢oLÉbôûDäS£fš-­DQäWÏU×VØ¿¢Ô*dªÏäó®xH’I`Ğ½Öª9j˜>ªG(íTiOLa* §,ei)*±ä¼ĞGçÚòR÷ª~ÜÃïü[vSÔ\s!2 ¡XîÃ å“½}–Jpíœ¢ÄDk@y«˜âxÏX™µ¹NAñƒ‘paÈg0D™}Hcufğ™gQd?ùgvÜ¤°İ¯•Å%ÛØ±R¬–<«Eƒ¿lõêÕ[H?‹;ÜÊ3‡KéRS'·*™Ig«m¾EŠ£ØÒjkS¡9~Ô­~q½Gàø¡  eŸnGÿ§ed*?JµYŸsO’ó?ö§~ÍXeË¿¡ö‘Gd±!ñèÕ®e%`¸)ŒŞÉ.AGÅ´Lˆ¬|Ñ%ñ®ªôÕ}í#Ô«l@Om‹Éÿ<%å†n…‹Åec[‘ä7Eïh†ğu|lÀ\zÑp˜*7Ù!³q¬(8q	¶Rˆ´fÚêHtãíjí.‘¸}nÆX„¤ÍŞn‘Í¯ ¸Ô‹{²mŠÍS,0IÏ¡§>]95Ø›¼¿„af¿¯×Ÿ%òIÖtÆÓVØš½G"h`TÊeÎ;À*è ¼ÜF%Ç§¦ï{šÉ^*ê’¾‰.ùµMmTxf,êA§jf½ÚÜ9±=øŞÉÍWáfç‡§ÏVÜÛgœMË¾ØùC‰ÉÈ‚~|ú£4®Çà„Fşù)À—D…(Vù.iPd™¯¢Ÿ“‚*¥P+0Ğ×\ÀZÊåâ#ÃL4­¬+Ğ, ®„T‘VÍQ!ĞA`]!kfÅ"ŞQ¾ŸNlåÑ+ÇD«¸[â¶”TåäÛçİdJ«'~ú7÷€p&€Ó¤–Ü²Ä wZöDzZm³mç—ÎØºõ9‚3
ÂğÂ¥B]|5oÁÙB¨SS´¹_•ÙĞ"0&N(×‘ÍE®¼‚Q)+
_xoĞjÑ<¯şÿëk‡ğ# à  $ŠA›
5-©2˜+ÿôQ
C$¼ÒnÑ•¾Î“:@Ÿ·B
O úPÀ›CÎÚé¶‘jÄòÄzb.«…ÅR_ì¾¡[zYğó[}H‡!şÁ@HôœÅ‘©(y×ğ:!×¦eJ%YŠ}k°`qç;ÀæY¦IX?ú]Ã%‹è½}4éFi©AFI•mdŸ¼ê²õkXWÓ™`{úéæÊÔ!iŠ²\Uk¨Éùšğ~tºä¬°ŒŒ3¯Üc€ù5²œç;”shÇ„ÈÕ·ì÷†‡öL›æ~zÛ±“¡ï} ™µÉºíüz°òîóĞy„ˆK•õHHâíhAÅ_jc¹¡Œ”~NÁcâµ¹ÖÓˆA õ	óÓø%R!Ø¥Z£ªÌ/c6ÛßùpUz¸tñ<SkØ€ñÉĞ¬hN‹ùXfUCù¥EøÓ°?J,ÛÊx×NYÅ±x'ÃÙk¦%áª‹IFs&¬ ©¸VS4¦™<Ó ^tsÃ_ôÏ*’:¹1búÛ áB`Ù•»_•Í[väû¯î·'	Ÿ1Zñß
Î>®Ó–rTä«¤ĞYrfSP[?e†7Ÿ|BAyacÔU%?Ûõt]Œ÷Ñ{u¹mWhŒú‚Ëøƒ¥ñ¦«SEà¬÷„V˜~‹1uß 	·ÍÕÆ½3Ça›³ €‰x
t³ã7KÁŠ2ÚÌ­Cdº Pñ–¢±!­&Ã1l9JÅ©l¬ş^ÙvØ©)€Î¥Êw ÜG÷—ó¤7Í¸^m’ºúĞ¸!Â×K†wÉ<š€¡ºÛ89
®`isí,†ÂhÍSlD~Íf}»G¾ÇĞ¬î¶ï?¤Õ¬f¿yÔE]RÕÀ¡ }¦*­–~Šÿôîä%38T¸=Ëb#C”ÿiÿFìkèC¥~ÉöìA5³êF)U6$1ù¸­Ó_«/ûŞwÌßO›2§yÆ½ÌUe®v¬‹ÑG$èßzèF*²\ü	mc¬ Ä¥O«Y+}tÒ|RTµOØ©'èŞëxÁ$ë/¥õªr¢ïº,mƒŒŸåNCß³ã7|g~ øOñ!¹ró®s!Cy.%\Ñûì#‘pBcxS×ÄŸeƒÊPòhıJ(äd«I^Uá/Éæe”9}}šR™V„Y.ÀvÒÛï>$ =·x »i¹$hÓÎ~£¢ñ.òÇÑ .PDíë”|6AÚ{Çiv\ö€—)ëŞ¶¾ÜıÉ“ßU¼nbp3+ÛÂz0pöëbÒ½Ÿ×v@­Ã¬(Ü¾ôßtïİMË·bKs¯b¶¼OÛÄòÈ°×591şŠüjXêÛ5‚Ip<0¨ó9j§¢«ñ5·,bh=N0›j¤KdÀ€46NP‘;4ƒiqN„rÖ¬LÜïèJ>2kL<Méšg™¦ÈÌRÃ†-IŞç—fsFI°ì;XZQ¯³à wßŸÓÃµ?ÛÑvSbÉ(0é“$‘}¥ÒAØ$BÃüšH­ğMhZû°Ü¹(uá—ºÕ¿ıxyKÓO—y€Ó(ÒO„ôÌöNLÎ:#ŸQg!ğóÁÎî/IsƒWàdbÄIf]
µŠ†0›ı@€©iv#Ø“¡\B‚ÍVŠğS¸X¾{‹´î¨Bt˜¸;/×şÔ&åDi½5s*âdL¡S‹rA )°sÃ¶}½[=Ê‡ê»ímìÅ0ê™ÿH,`E	€4ªÒ¢|ŸWºM¬ùOò°)¿aˆFt=hm’ÆŞSp/Mú/IZ‹ĞJ2ÓA¼u½
:l{Åˆ†Ç{,ÅÃ«æ*MHrH3­Xußx*Êš:ºÚ'ä°H}7æmx1æÖôA'ä€¶õÄ NSªr6kO7âJŸí;ºÙÕ$<l§Æ°ıS"~!*ÈØy©¾¶X¸K…H‰?F‰¬ğoò‘9G?‡U†›¾¼:a#À¨ˆÉÏ[ƒ€¸ê}|%£zã›!‚ñ³R€yÈ²÷Ó9Úz«‘¶•–Â:(¾òê,gßœÏ!ûR¯Ù[ó€ƒæŸöx§7%Án~ÓcúõY`q\eO/åqf¥Ü¤ ,0âŠâ™_'ßX†X~zç¾‘÷6Ó—ÚV ØäÕ«H5¢â†öÖQO
›p1NG@˜O^ÔLD§,9£N`Ó`Xey®ØoÚ;¤ä1‡œ­Á^Cƒe”úDR…W<®ÒfUş±Š5UŞaáî‘–W%JÜÅÉo=Ù,Eªâ4«M¿+ŞÖQXëŠŠ+PD²5mÍ**ÜÎÇ<´­êàÑ–ìı4œÛ$WÏúôU’ªV7Æ%%=^”$4 ÎaÃºÒÍnõÁ¹7+Š€À´Ÿ¿Â‘æè,|ÂuÌ37í>» PEeFÇÛfÉ]r³r ŸCï:ùdlåj‹·„8*·X·ã›ô¾¯ ‘] ğà0DÃ¤ˆİ[0=ş‰‚×=5BË˜*ßT>àL`ÂçC¨>»›rğ-Gƒ¤%Öü¤ÖùZ¡ø;ª—«ÆçŸq0vRåc™¿| 5÷g	Õ”í}ÁàÍtzH`›•ÕR’®["py½”ò¯¥z¿Âz1*s¡hÌ‡ñ5)I@z7.'Gı[8Ô*µ:¤KÇõéM†ZÎ„qvDaèPº	ç³Ph+ylH&NáV0K6ºŠía‚m±¬ëÔ§
÷ U‘¯È“/uf»JİJÑ‘½V—Mgb¹.Nzº-¥Y½õ1D/'øÔTZ0y¼qÑÃ]•‘+´Î4F èÒÏğ›{£FXT~^,AóDí#U#3È7SDG7ğ90í@:İõÖ±š‡R©'CRºAL¸zÅ
30Ğë€$ÚÕ„»™]V9Añğºë€I…-İ]ò’8|ºúNŒÑ‰U5uš‰Ud
f7]µM”S-–”åjÕªmáÃ!©KÆt©0RîÎZ–æØhä—±ÍğHüÄ+}`5”oÿYÜ`¥Qo¬–Õ‹§Æuµ…y¯²¡•!åÃ•HÿÉg±ŞMgİxJJRpqGÈÀÄª± "/wÀÊh2è]9Ç¸Ú4¾YV(x‚İ:
Æp·.µ‰Ëf„Í˜^u¥à²Ö©“¬n¯3ëºOŠp¨”Uã¥y—°Ôÿ¦5Ÿ*tì†‚‘}ÁÛ°ş—pIg	"İ¼ê]ğ™"€±øÚ‚)'„-]ìÂ‹Ép@äğ$¡<(/œ®¯F@ïd!Ô;Ÿ­*hãÆš%S=Åû7ñÕ"µ±’õ/Ã~på«1Vw.®S.‰>´¿z êğø×&4rÌâØü€è1œ+¯½:,ƒ¦mP V×õé¶»æOm­Ê4Í%D`vıOV.9EKÉk
ZÊÎŒpV˜Uµ²%Ì¿ŠlÜ¤aïu'şÁÀnå"á¥	@ƒù ¾İKè¤è_Ş[có$Îö	Y ¤yáLUä[Š—µ©ïa,{µ56Å*×¨|öü«Bs›zÕz›Pm¯Lx?©9_H¶	´ÛkÉhgDŞ"î£İ'ÊÍ°úZŠÏ+FŒÈ¦›à¶ºdN¥§:Ò=»m8K¿»MÚ;‡}\Áz3éˆÃ¹q _&é'Og©“Äz\yÔ ´e°ˆ×Í±>Qcá…§„®ûv`D‰­Hèk\•bu¯Kªu@áÄÓ–½°¿3²fFsLP@ŞeÙÇŠ‰P@å‡YpãZì‰˜n·Y
½÷v,üLdødÊG˜=Ìè—¥«¸WNR•ıÔÕÊ ²J‘½Ê¶J¡ÌÈœ€Çà[C9½I«mì×ØVyñÍ³ùr½O—‡hÄ¢é«Wú<•I9‰6›+ûmÁÕ}+ŸOAªëåJøõ®firâ‚ÛDÅïºø´(Ël»ywZ–ŸKÑa9æbéóiy…‘Øó±P€a8™&ÕîódW÷Ğì¥Èr Ÿ}ñF•wÒ¬P¡_ÓúF» Â01³¢6YK¶oî[¯„âqŞê®gq(ÕŞ%çï¿LÅÙïUÇ"†!ToEØDŒH
şbEwr„æ?T>¬ãLÕ]R²ÓİjÎC®hvØ?‘KƒÜ3+™[¿=æmp¢‘¼*g?f&PA?0åÅ¬ÁíÑ¬A®ş_¡”´‹ä½6ŸP¢ µ7cÿáØ?E¡RVk ­t"V@õœû±œ@‘­eRÒoá2¬óëd}Ä\œ†—’fM}íwäìT4/ô…]Ò¡
q%óˆ:	ªÒéÆİZÎı@¬ÙÊRˆsAŸábÄ©ÀUKdğ’‰Ê´ª¯* ²E
<F´ÑäbWµS]èİ.Ç¬7Lh„Ò>­&!aÇ:t=kÙÍ‚H¹"…ğ‰À*3Ã(²™0Ê<SÿôÛo‘×D#`±2¸yAJ|­ÙAŞÒ¬J©ƒŞY®²pDQ¡°ÉÅÒBÉA‘|XÖ¯3yê¬ÄƒsF'x3Ã¯*ŒŞ;ú’ı3‡‡‚‹
~pğ+ÂûW¥Y€û@®ùGø  ëº»e‹=û?÷~<Ì¶RnÒu(CºÜò€	q‘› s”Ğ«ÆE.mı†"MKyÄpf¯TG«ÎZ ÅJP]­gj£µƒ¯¶˜«šo)ÕîHí©´¶™UõQZÀˆÍZëÍACxñŒB”§M=mvbìu0ÚCÎT. 7Îï•„ß£¦‘üœN7F|Nãuµ¬°Ux›IåÉ`æDİRñ#MAcéø?˜DˆC¸µ¦[Ğˆ©²[IDo^úhîbÃrâ}:G9õ¥ı.Ú­2„¸^³*{‡‡è;P:¼ÑwwŸ~-ˆq÷ö×ét¦ÜÊàŒäzå£Á­¥]évFŸ°D6
®*¥}LğGpë¹i[ÎmMòjBL¼óKlrô+…ÛUÅòKã>YPÆP|CRv?y£t”ÿÿãĞ©ÍãL.iEğ§5£ƒm‚Oÿ…Q¦7›”f—3íeÙ÷Å¨xw-‰U?R•ÇÌX- xJ'Gç+IÊ1P“¦çá1«¦L?èÚ$¾æ•éìÅéçĞ~‚× Œ¨œÊ	Ã‰ãÙAx‡­ú€vËBíbĞ“³‰wıõ¸Ç$jÀŞ ^#V´ğyÌ9.‡8šı	á¼H— 1äÑã½VsÌïYİüàòœ®ÿæï³ôT¸ûóGª²ÖòeÌ…ğ¦ÃÆjT=OISH•ô&'¶8Ş†`h/ÆÆ	#ß§Ì¸ª†” fßnè9=~êİ–œÇã}oR§Üƒ~­¹$Ãé¡Aˆ¨µS¡>D× $r_¸vh•V•¶ŠU@ÕÌö	yÆµš·û#mO4ååAÀ‚,¯èù3½„—#}ß>ys­}S6oaŸöÎ˜HÂ°®N=ÔúI3ş”ÓˆîHÿŒÀ¤šk‡Ùå×ûÃ¯–çIòb‘8U€gÉå,üòùYŠã–
µxùíÓØş~kTY#b8É“jõ™A¿ÿEûË–¶†½lÜíkÖ´Ù9ñ
!„pj¼¸’†‡£çÖ(Îì•šhí9)!ùJN‡M›ÎrĞ˜ß:zü²-v[ló.rşyÅ6ş½E°$RÁnÓàYgôŒ0€£˜›+Æ Ñ¢IöıÃ€Ïâ"s=@2x@Œ=pí-÷¸T”#åT0[ˆóDö‚r£-(VÍõ—Ù¦\)i®ç¿ØK€aÖ.­%…fAùOüšg„ÓzÃ ­Á!=™˜ı
W…"ÂöÈf" m˜÷ºqÁ<¿æci¾î 	ãÉî'İ(yd4ì·?r®í´À;=5¤WAËBºı9{ºÎNæš$zİä‡¼fË{}s @’Â¾Ó¨ô÷%È:K_vc.şVdìö³‡Y'å†òğİ#¤ÿIĞ¶ÏOÈíE†­¶S%ˆ_JHËçí§Z«÷!ôê”)&¬):(êœşg",+·
Pëê‡J˜™0ŒÜ‚w7 V¥OÇ„Úlæ“ ºq“a’5ãĞÕ©¯Õ-ZaÓD)Àì?ˆ^™>ŸSMüòø2E¶ÖIfigr¹$Z8Ã;
¯ú<@ Oñä,ëÕÜÖş'ˆ_Õ~ÛHVşJ@ß8eîLzôq6òê‘mã0nÉµmtˆ•Ø3•µº¤÷ágÉdÈo™ ‘‚‡Tò<@[sk´‡Ñğ°šK6á÷° \Ë»Ò(š#ÑË†Qˆ÷7ÔéèßÔ¡\+¿KSw$ '¹,tl}—ØïÑgiÍ™XLÿ[XûË¦şÔåJzÑP×“Úüµ ã³ÿoÃ„ìP…Ù½˜Tm°Ænu¹ÃC§¥6:rj(ÃéÚñL,úÙ¥V¿o¥ãU$>p¦@•×[` =›à"`Àj_¢İ85 Å©1Ñ´B£Ş_’‹Y”}X	¶ø ó¸{;ı‰í#¦»Œ!az Ó¹²§{½ºıfµëdÙé‰Sˆ5¡„ª;È[Jw7A“$à€‹ÉW5gW2Î×2ÈŠ˜SÛykúŸ%’È(Ñ€ğjïzX~4©J]±Ö®„’Tş©Û@ì§Äš	Éöì¯E3¾4õ j+©~MR|·$Æô¹¢½xÆB“y°Û¿Ûj/Z›û‡TwD+p¸hpïê˜Ë»³S·£õÏk8‘!(×Kñ%¬WĞÉ‹ºTwä7Ä:j!Ğá›1Ñé	1(ûi\…wL8Óf–Ã’wˆøŠÉ‡pr?“í\*Œƒg^èÑµSt¯]úÿ~?oÅ·dÊ#,¨¨WÒbê³;7úìLtÈ$ã-L€–»ésPå¡İKÑ§
S¤X_»æãÄ!UúÆÛ;¸Ğ˜,¬»ŞÏ/×¶á¸Õ²»y¹…:ú››©jü’*¢;£ÓNõæè_aöÙZôu™»•‰}‰Èa$Ô½Ÿa²rsYG^Ç”s5òà`Aü(—èØfÚ&àŸíÒ_ğ%}¾Æ—ö €Â0Ø”òaŠMvİ\Á2é‡İ¹/Ò¸¾uÃ—µÂa—Ïä_|gnøÇªòfÂ”ß.8„D¨ŒeÕE­åSšSÙÅqq02lÈdàuşi‹@bC¢×È•ëˆM>3Ã,ï4İäHCı\ıuc}9r4gşO§Œ—ËlHf'´Œ$qşC(Æ¿áıµ&˜ë·ª«À?µºË¡c$Ùn³	oşî…Ü[“4¾M€ ë<—±ÜÖÛ~×Éá ‘éÒûëıĞRxÄéN.&Y=“½Ùôµ„©Õ_‰şù.|˜ñ3î¿ ¸)Ö,zcÑéõAuUÊâN‰Ü@Õ@XÇábêJIÊŸÆ³«­µÙ—“ Km‹_^zUoç:_ípSÒ%«kÌŞŒ%€g$ï±2Ül“9~‹[œ,ó!Û³mPŠoÌñòqèê“ÎTh¯ö²¯ö^f¡gX8¯ÑÈ»cá"ÅÀÖ%¨õHWoŞ?x=ã#‡¿è[£ öÿå¥Ù`Jàél3rh9¢´}Ş«zÕØ” ¨rc¤C‘J'7Ôke¶˜¸s‡ÈKeƒ½ú1’¶w§ğ=-Î† 7wíìÛòàKÇTõ2†WÉAó3îJ’•Yµı®ŸÎrD’J6½ªÚš’ú±øG¤õÁ÷Ê-fIHÔa‰ğ$œà1	ñ&ÆÌõí÷t[G2q——ä5PoCÈ›ùĞeô2ï§ ,ıû›äÕ,3ØÛWP^+èQBñ$Ê¢f®ÆWÂ»ÍĞ¼ÑBİîYğĞ¯©¨Eá®€ª$PïÄ³^F}¥§ÖâİÇu,[ìƒ‡TÈÅûCµâİQZ>IÓ11„˜Úo‘9Ñ³rL€›•$’Qá€!(ùf?ÔöÍc¨>:p“¸O¾!„e°BvYL…æÁ&#ïß‹@¢óBEX-µÖEÏA»"M‰ãš©oQ‚¾Šï­úªrGx—­“œN–z—jÕÒ»$"É4¦)MÏöö Òk@¼öÕ't˜¸7v ¸Gë
‹ıÁŠ1ûŠ~(ÕbzK{j%öÙ6"jŞêKbò€Q}µ(1E×It4³2t‰FCèYšŸÓîÒĞ¸Øƒ–GXëhı”†ûĞõ~ªB[s(=€\ÇšU—:·3=afRyñÅu­€.UŒïIœlfz‹%°É`²ş/Œf:ˆ™İı¸"ií‘v¿±÷³ÎxÄIqŠı!0»[Cª±ù\÷½vlòR×äÃF|0¦´•QÉ‚¢Zç˜÷R•F–d|~"H°½'ù}êËè£ )Öô¹(à7½¸¦½Æ~²iq[³.Œ.“x•Œ‚mØ©Åj´¯baiƒÏ¾ÆÎïëÔz),„Ç²Peö¿¯ëéÓ!Zçkæ1
Ğ½‡«]¿èâ¼ÚíŞaŸ€­H;´S”bØ3È]q¤ƒÙş:(Fê°,Œ2Ş•€w¤‰s^£9ïx÷­:ŒÕØK	ˆïÍNÙ	S©±^îvÏ^ô:\º™(‰òÑ¢İÜÚõäÀI/şd¼«ŠÄ¶iè4§ğ‘'5´;PÆâXå‡‘6å”‹~–µ9òÖÙÅ…–üÈxAmİÅ© ªAahç?ÎdkMª±Çñ›çî†/pLr;4×1IhŞÕ»ÄÅZ›deİØò²7;M9NZî€„Gdş¤d$uì÷ Rá,5Î_•yô3~ß«rK~_ˆ‘
ÃøM‰I˜Lc¢ì	{µ,PwıO9¦·YúÛ`_Îåé¡£¤"&]~Î0]9ïòã4q  —RJY1¤|ğÕL^|“£„Yıİ8&å* ¼Çó,Nk¾LÅ§ş2„¥Ò9¶æë—C³°Q°*ÂKWã˜½`K³o«+´Ë)çOí© ¤	ì#9‚³A³	|)‚¦gUÓ†¹³4b>š}J0«Ö5ÁÈÇäqÕ\òü÷¼XBT£JòCÍaôÉK+Ó-aş9dó—¨"óG3:ÀgšP—.z\MÎa-£=/5 )ŒevU–|OIlÁ$€U¾¾ ÇL?­5«K¿#š; )'\ öE?ÅWq4–X
Y>°G«)6”ëc4ÁĞ~À·–ƒÑ€ÜîÇ˜,·|´u^®uön6tÏ‰^ƒ±Ğët5_ğœ,„Fÿ³H¬Ğç¯÷É-³}BÏœ¼uaÇ£ÄÂ×jÚ[×sÜ4qg-B˜†¸^dA-ó˜1lİÓu®¶¹Ñ±3Qv>–Øôáv­…7AøÖô=/ºXvĞ Z!Ç’¶Ñ+(ØC#È˜ÒKf‡·Í‡5Á&®zRU•–ŸFûnã<˜ÿ]Æ4ø¾õ#„öeÌ%†Ş:ÚlSéT`,_’¤üwrÎ\iüÛn“œé‘ö‹“* -x#@M±æÆÈZÓıø˜üD£gø~(ödB[©Æ.5V¨=RÇ/—a] dvÇƒçØ±üÀù5nÌmCØëóq–’b™’ş±_ë|…ÉH’h‹ÁR€ñ&ÙÆ?hi±©ÄÈõ0zwŒ6rFQ®¬ŠÉõöü./¥ÎDUå/ÍÌºÙ;0]â¥È‡0ßƒğ4èŸæTMƒR ú £ğcCğ ¤Á¼% ‚úäÆèê°
Ñwä}èI’LŒ´yï¦–{D„©/k&‘Läa3:+kãª­nZ±Õª‰“†±=#^(°¹…‰-vbÏ€,ÛSÊ÷;“²zKà‰‹noáµ©K7­„şäCÖ@*6şëÂG±Î3¼ŸOsÃî%>|:—ê1yÏEª¿uÕ½•‹*=¸µíöÜÿÖ-&È¢¼Áê˜_˜™W×¡¶½
` m¯ Bz4ö—{ÖD­¡ó>/dù¾"èÕy¯¤ß¸¦Fç½b f†Ô"ä[ô?¬¾ò¾]sŸ-Dcşãš®dzÀíMøÙ`ùØçÀÉî°Ÿ—û¿ª0ï>2Y¯u„–CÏ5Ó{ØÑ×% °8ûœ6faÿå‡öÉ¸+Â¥Íº â6•ûy1Yı+4ÈpäI¦G;qí“2¼ës)PHšŠKªÑkb”İDÿœ–Œ+EiP‘W‘ö¥qíÏÖÀ-ÒÚ!‚îÃøã «”¿õ-=Çê%·1;~VƒqÉšÂ–‹8ºº
»ïÍ”Ã¬¸|\¢ö™ªU;¼w¼Qó¡éKCƒj ÎÚJT ˜O—3)À`7=ç‹-šŸi~t‹vw™óíıÃ/3åaƒ#Ş#‰y-%/kÖQFrÌrûûÍ˜W°4XÖ ë¢(ÚàwÊ¬¡µ³û‡PÂ¥²Üêsu5nŒ?,])çØ7ÿìbÑ÷XR¤×Ü–ås|ã
	,"äÈ!½Ù·ü¢Mú);) €;ıv¨K±ó¥ª“4¿=t1À:±üşEWûz4Ö*3òˆ‰¶„„G{G8Hê‘QÉ—1eô›/ä!iˆ™hytl8¡Aùğƒ§üÄ¡~ŠªTÉ1ï^˜4ZìŠò(®ÙSjäv•T÷ÛYÚµ'×8¨|ÓÓŠ­œv5Õ¬»»Êƒâ.î\ğşYi“ é®°¬RŒ#pÁÀVIƒ@KÌ,*             cb(currentDir, ts.FileWatcherEventKind.Changed);
                }
                cb(current, ts.FileWatcherEventKind.Changed);
            });
            hasCallback = true;
        }
        next = (0, shared_1.canonicalDirname)(current);
    }
    if (!hasCallback) {
        /*
         * No callback means the paths don't matchup - so no point returning any program
         * this will signal to the caller to skip this program
         */
        log('No callback found for file, not part of this program. %s', filePath);
        return null;
    }
    // directory update means that the file list more than likely changed, so clear the cache
    programFileListCache.delete(tsconfigPath);
    // force the immediate resync
    updatedProgram = existingWatch.getProgram().getProgram();
    sourceFile = updatedProgram.getSourceFile(filePath);
    if (sourceFile) {
        return updatedProgram;
    }
    /*
     * At this point we're in one of two states:
     * - The file isn't supposed to be in this program due to exclusions
     * - The file is new, and was renamed from an old, included filename
     *
     * For the latter case, we need to tell typescript that the old filename is now deleted
     */
    log('File was still not found in program after directory update - checking file deletions. %s', filePath);
    const rootFilenames = updatedProgram.getRootFileNames();
    // use find because we only need to "delete" one file to cause typescript to do a full resync
    const deletedFile = rootFilenames.find(file => !fs_1.default.existsSync(file));
    if (!deletedFile) {
        // There are no deleted files, so it must be the former case of the file not belonging to this program
        return null;
    }
    const fileWatchCallbacks = fileWatchCallbackTrackingMap.get((0, shared_1.getCanonicalFileName)(deletedFile));
    if (!fileWatchCallbacks) {
        // shouldn't happen, but just in case
        log('Could not find watch callbacks for root file. %s', deletedFile);
        return updatedProgram;
    }
    log('Marking file as deleted. %s', deletedFile);
    fileWatchCallbacks.forEach(cb => cb(deletedFile, ts.FileWatcherEventKind.Deleted));
    // deleted files means that the file list _has_ changed, so clear the cache
    programFileListCache.delete(tsconfigPath);
    updatedProgram = existingWatch.getProgram().getProgram();
    sourceFile = updatedProgram.getSourceFile(filePath);
    if (sourceFile) {
        return updatedProgram;
    }
    log('File was still not found in program after deletion check, assuming it is not part of this program. %s', filePath);
    return null;
}
//# sourceMappingURL=getWatchProgramsForProjects.js.map                                                                                                                                                                                                                                                                                                                                                                                     ôâU'Ù#F æç†(/é•2¦ÜøEÚ³‹Së6fÛzÉàÀ—ì5¹è•IÔ±Ø`¶ìx™¤($’åÊöMåïx6zÉ9óRZØ ²vPe µr_çG6»s<Æ¼>Ó Ø4“w¦0q¢9b6ïí:‘>]ü|˜	˜üú[I®ÀÃÂƒãÈGr¹¡1ê4x}
ñlk
]ÜUEãã%¡„ûÿI‚ÃÜã»êa,…3¡1±¾ë¦GêéZ\çË©»
Ñ~ W(Ÿz¤7Lóë/õİY/l*’vSò[x8»`Ì>ğ¯î«%¿yâGZRËÑŸ!7êıîÙ²/N/¨1tµqFZº8¯OœIÂl€Î³è}œ÷²ÄÆ{4NB³™§†Ä	iŞÊ–¥©f¥€Ï÷às
şásadúÚF äİ¥ÄÄ‹Œ*CV7­L.Ÿ‚ßF³wb¯ë
°şa¢ÛäÚ`e±ZÓëœä½b9©:¨%ó‘‰.0ÜÆŞ<Ãb÷İgÑw6¤4›İ<•äPrÔw¥¼PøuƒùoéİZ6ÆKYï©ÇábX6T­ÒÿtÒlã’ XãL<½æ—õ[t•š^(×tS5#e{ˆ‚Â÷´5r]"ÅÖ/{ßÿĞ:ñiñíTÎ ºïÂ¾[LÉÏ„ò³šJ48½ãs3PcfJÌf“ ¾rQ^A^ƒÙş|ä@æ§g-ê<C†,[ĞÆüŒ¬Pg¾£~<µ×ıU!áÀw¨-9~…Â¤¼™k
—¤«ÚQ¥ô!ŞW³C8ë¸¯«©,¶ÙÓ^ªÅ	aæ.U‡1ªNM4½u’NC&6rh:4Ğä>¶JYƒx9Î•”İ*8¦ùØ8Y¶Š²2¬Mù`P>	Ù Ç?Ì¥‚gq`´L6:RÑ;ÿ8TÁØ7÷Z Ğ?ŠıOáOÁK‹ <€ÃOwëü®«–š·E-íë¶õöû.±\RqÒÜ€ü²ö	¿Ûëds]$§ËÈ èµ¾äEQ“¦Áø©YÒ–¢EQNXĞFÊö«Ä¤íûŒ˜‹*Yá¦‘°ÍUL­Õ@JËTûÉáÎÊºtu+Gdi@qÌ”,ÛI º¥öÊa§1×ÇÙC3Å#&ÚÏÛ
0r$Qg”Ømzİ;Õÿá\º·O4Öt¼–ÏµC®0%¬ó{RíÍi<é°³+eË1$É;ÜøÇ¹Jó€5‹Ç~H‡İÄ¡a¬õ)õ&kşR†‚ÀËÜHÇÏ:fpª4§ºÒ:Gë ıtÂF§Í¶ÃİƒŒç	sØnÙr	Wßxg.mĞÆ™
ú¨Ñ×ÄÁH2+şş8•¡©¸ÂêèOƒî»˜gı¥0¼/CŒâŒ„¤•ìùÔ\(#Z$áRÇË……û…†–/h ]h÷u°ŸÔm8®™âõiñû‡³Orš2f±¨¤š7 ‚¨â%eò4æq·¡>qª Ó·\Õgë2—$&‡d—~¨MMêHuÓåÁ
DKkD²sÔbT;æşßš»ã1clô¬´šÔûåÍ†PÄ+­ˆî•Óø•Ñ2Í[Ò´:ì÷9\`÷$r„M9R7[[İâÈ® ŸÁÊİM¼7ÏÉ¤¸†hâcUNÃò8½½¥¨ö®—>=qÎ}]æ1Vd7•8»:ªY–œNIïÅ^ôªı{U€ïi3§Ax¯OêiõÊóï¹X1ÍŸ’ñg§ÊüdnòïK¶Á?4­N„	¤È¾l§® †ÌàDú!5TËYÁ´DÉ6y-uà ×kä|?ù­¦”c°=(zì1\š¸ÏŠM¢ÒïãÁ(5DZtOÏƒ©g\Yo(µ²½ùF}Ÿ–£;Êy4N·%
üà5-¶º½_°³¥=Ÿ
<š¡yo ·_ÛÏ¡2€íuÂ7-ÓÿV‹¡8™¹ •ÊE‰¦f” rÒœ*¸â¿5=7r°Y%ã¡ÒĞ»Æ{‰‚gxÜìv¢Oác—kş\Î,®ÿ)²µa¹şÖN¢¼S#ûPÉ(„†*œ6- ERHsóô½öÊÈËfMumíÈöşL)œØy¯óP&‡¯Z?Ê’«Á{j=P<s·³{cÏRóSµ¯±_aq«#šYLÃ1Ô˜t”$e"h™ÏÅ¡µÏLá
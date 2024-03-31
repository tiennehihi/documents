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
exports.default = _default;                                                                      ��ȆA�s Q�ػ�=.>��rS�r}qu^.�[|!��{�N@q�PԱ�A�|m�ܚ?���D�N?V�\��N0n����^�E��2D�kgD�Y�?�ȸ��䲨��"`�S����<\T!������)�FRY�67�뱍�RO�-Ƴ���쁙�]iK�}�PL�s�1�a73Qf��+GӐX�O�.�vo	�/�P��g&�H�bTm_���A��☠[8���	�9p�>�,?����գy(#�H)3�h��8��%�	{\Xg�\����bƫT�Z���p�S��6�^�X�g�#r_�>pDlaF�&��ηՇ��*y��7^�8̥�ޘ���J�b9p��T��i�� �l��X~��a�޺��6Q�l���O��:��gn���ˡ�6�g��w1�j"�?�m�s��Z�a��R��A��HVv��׌x���8�s'��Lٚ��g���J�/`:97��#���v��������F
HJ&�b��ҳ�6�����	a{��=��L&LS��_���d$�CE1�G�'����^�@d�%[h^�0���b�����/f~�� E�1���kuȘr
Rjy�$��Ow��Zu �ܒ9����[���z
�2K�N֩�r�#����+�ߞx�>�5
�( �1�����iDL�h"�E�O�%�C��%&�A�A��1v2�k�n���|�'Ӫ����z��x�%؈����y��>��!��7�f^��j�fˑY̹� ��OF�NHgrj����4�륵ʌ_�6�.�!��k�p{$�eD��-�K0&�q�BO���ܾ&z�{A�6�)9����q�\���OXuP����{}������m��W|OД��Lvsm�0�o|�o��/�S"�o�>�D x���1�2�7Z���C|0ۺ-���s��>#�|�EP���W�2b*�#	�=��L(��"��Y7���0͌�3�p"�
��C���d�2 7��:���/=�� sQ�GX6ҚMɸ��W�g�@?S]8��;L3����Q�l�����3�M�$�V�De���L�De���̓lO?��q�^i1��a7<v%�~u�{s��a@�w�}�K�������K�ߝ~`?ts�IL�N�.R��Ƅ�Ql��톺�0�n�i&����(�6���ْ,J��WWG	�b@&s*=F{�K�W!��4��ŀ=*藘������: �����R=W=�'�D���9{O؍4/Ƕ�FP�tD��R�G�榰},��˪1��0��1���q�!ޕL'la����Ğ{	��=���۔���Q�l�Mv{Q�RRL��+y�ا����媯v��Z�F�M�[I��Z�<��_^ٴ����[O6r�;f� �����b�ˋ�	��9K�9�	~�8��������n����A}��͒!���c�J�ڭ;ocn�����:
��ejgP�}���2<d�f�m��ߎ6���cT���\�|u���L�i$���tD�}��˜����'��^�P6׉U�Ϣ�'�KE�лt�q./�In`Dg�;��%�p搻���;y?K�E�l4k��M�7	;:�X,��p2ʲ�Y�<���5���mv!�UrGs��t/�+
	Y�u�O����+�kEW��q>�-~�j0���D�6�	����2�'S���KC��.�|{ό�΃G,���g-"%��{dcg{,5�j��"�e���
մ��l�"�G0Hc7�N�=��)أn�3ͫ+���ӣ)�g�# �i�(-�zC���΂��l}#]Ҡ@�Ά��ml��������ƚ8r�ti�t]`67��t�-Ujd�	嬈��XD����۾FR)�5ӽ���>&{��?	���6�Z;�,�TH�I���x�(lBZ1�x�;<jq�LSA���@"O�<�����dG�gr���k%{��ˎ`u�Y��d�5%�&�#�V������5� .u�!�Xqn�q��7�/4�"�B}���?d`�C�'&��>Ic�"'�as"lR|��ys4E������s���~�|��Z�q��B�o�=��oҿ��e����d��Pw>楘��͖%!"�*���y��䈦��'D�#�@��p�����iK���ɃM���#�E.�sW���:E���M��
��4�!^� v)�%�$�vh0tWA�]v��<//�z�˾kf������)Z:h��CF��z�]���t\�ZR���uX͏~�h)�k��_1ʱPG��Ϊ�'ʸ>�o#FZ���E��#�e綩�)����j��;o��0��s��"r�yc��Y�h�(��S��A�����.�^E�/����v�u4�FH3��oIׂd��
�K�H� |j��iL>W�@tO��_��2���ޢ�d1)���;z�֝�:�eǄ krlu�~
��%h�>/�[Ej�����)͇[1���&Uh��CzbsF��JP�m@���揉��`Yq4�cVcM/C�\�92���J��J9��cI��[<����#*®�3R#읦r%1���pN{s��p�T�0"Ч鐮��~��к*�?�'��y�~L-�;B@�<ʙ��QKL����o����m��{"�k@᧣0���ө1,ZXP�P�BJήTډ_U��u�\���=*�#G�-_��EX!v�Z���L�,�Q�9�����3,��VT��
!v��}'�ّ�6��l�qRN1w1�`緝[*����F�^EUD �}�GV�4���u����ea���P�Л�lk�Z{�8u(�
DE�����b��mrv�n�Έ9�[�?�d^%�k��`D��-S�3�Y�\`�.�F+'��:��}�ap�� ���������b�_z�-�g ��Hb�rSF�9t��/r���h�2��I�,���JPl*@�;]���Ȫ�o��\a�D�5�cw�u;+! d�{��#� �~�Bј�~آ�Q�����ͳ�'L.�~��)c%Z���e񋎛�0z;0fr�5�$�q��a�D'��=Na~����P"5.��T���d>�ff��u�Y��^D���^V�Kx4���Eu��Z(USRy�ס�NĠ1n��?2c���'�Y�^3���n<���E������5JౢBw�R6���W���(~�	���?����%-1���GFh2a�*.����1�0�k x2�̖�|�~��o�$>��2T�QƆ:]s�����B��H�o`�8�Y��(��~����(�B�XVw�۱��-{���9���ZM��D�ZwP��oO�*ْ����Mo���(ƈ<c�q�>ܦ7�����N�8+��k$0@�[)ۑ/Nf(W[�o�L44��'�a(G`�
��յ��nhs�Mb�%e�*���Cw����ݡ���������N_գRS�ܭ���UG�E�`8�MC%��}�n݃��Oa��������k��>�Ԁp'���p�r��@Ԑ��l��!����-c �5��ܾ��dkP�2�N���EɁ')�i���l���J�d+��!h�����Y���,�R!Wf}Þ�+�a�%��4��1�d���b9g�� �/���>c�uP�٣S��?�ۅ�WR�w������g�*���}�L�5�qƇh��aN�����G�Nx�:�7�1���6t����ah(d��4Q�i�K�Pi{9}�Ȟ�˘-��gpwp�G��K�[Fu�u,�0�r��p�.���iw�laNFP�ѝ5�Ьt���ż��म�#_DH�� �?"{��UDW<,�X�@k�d1K���e�@rU�)*�N�eq#�G2���~�t���.��v]<���'�*�����qo�×�r�R�<��O��!٦��*��9�%�ڄ�=��Z��� �����$"u�y���)�l�����Jm3ZC� �*4�"�`��V�9�Ǣ�����9�S���i�+tˠ9`bC�	$�*�U&�f'��Q��h���S�g�1�w���ʬχ?�4��g� ��m���B%�9!�lD3S v�#��e�Ti�L�K:�Nr�l��W�B�WW�-�P)y\�fy��`|j�/�R�yp�4e�9�ꦜ��Z��I1� /d�K�i�D����k`0G�x�|��B��vh��B�
��p�B���K�%Xҙ�KF�QH��u�4�I��Y�� ������p=������"��zm�����>.޸`���&��\ú^: �b����)�]���U�F����|���7O�)xj���+��5qb�3�n$v;<��Fx�����XXA�AU9�;��\A� �|r�]F�Nл� ��[h��g�x�.׉<��L����q�t(�'�v۶F�>g���O�P���W��*��L���`͎��k@d�3�,$lg�cF9��n;�����7��TXR����I`ZM>�1�h��+��`�����C/�����4)�m�y��U8Q C�3��T|ue�8&b|�ξ"���)�k/�������){���zѸG� �s�pYz]I��
h��U��8�-�xh���Cn��m¾7El�i-JC�q�2?��ԣR���V��े���K�a��{rĊ3d���X����}߮�٧E,gWrO�[K�]FMIC��ϊx]Ǥ�1�eA ��;=kD����O~�䙵���B�K�jCxѢ���a����e�wO9�Q[w��e�\���l�lh���qM�a�JPoz�� �[�yk*٣��q߰p�H��
@�z�&���A�&S�०�̛��/Z��1��[Uq'M�V5J?_�Y_	�@�@s�f]{é�_v��r�j߸���ml���29�g�^�-b��d\���O�߬�H��/����Z	�9�lsF��+�"�Kr�:Ƀ�ty�ݵ:N�{\n�B�����b#���;� ��2� �O3�%�kaH��{myKG��Q��d�[ےg�w�m�Rk���q�X���TJU��̀y0A�HE����.����Pż0���,����3����LAT�T��L׊7j��&���h7�P��/��,�b��0�B;�����;bRٸ{��xZ�ԐlZ��^��*�u��ş'v����� ����~�OS���b���K�E\0��7p��� hu/jČ4u�+���cS��d0ս{^�����Gń�T�r�S�$���ގ���5}���.--��V o��Clm��4ᣲ��7�pMZ=�U�gd��Q23xt�7���N�{}`�%����+�C�z��ͦ�\(���ڄ���d�L���&վ���ti�ظ*�@��U��+!-�RmE��ҭ��=,}|Ա�L�����d��;��3TlvM��bY'���8?�#��T��gڙ�~M/�zPh=�8W��8S�����b��>�DN|k���Zk���A��������}��Y�3���m�e���x��i+�b��wCeг����o[�|f���Md�G�DC��0�'�"
c�����!A<j"L�9���Z�{nZ�z�UA�K��Զ?�-��5��Ĕъ���ب�>����0=ƘK��r���Oa��R�+�Y�hb�����ͻ�)�<��9.��h
I*��)�O�WIwi�@�<��V b�]��e@�_�'�3��- �AQm*bƜ#Va�W��[L�xOp|�����<10SD��c�N�Ѩs�������,��>��[ ���(l��-�8u�-�U�!���e��R<�N��I�1:Y���CD93E�Cڭ�܈8�l`N�@�m�3�7$`��9�y����T�j�α�1��;~G)Q��L��԰�p�g ���8��y��]̶ �4�#�֚�ك<p�k����b�a�X��V�EE5����P��
��=~���{��*�mq[I�f�?3|O�1���<q�,�hӝ� P����3l�,����j���)��7�FY�c�{;���. Z�>�B��h6������G8~2*m~#�Ma��͠EC&}-���pB��j�C>�er��
�E���U��,��^�U�����|铽u8�ߣ�Ry^t�{�A��gZ�����|N�C���!I��z	��G[������������ܿ�\�^��g�e�&�m�X�Z�"�*��$��|�x�:�	md	��=��<5�a�u2J�Chd{g��g�^P�a� Ї�Z unGzc+I/�k�?�s��rw���p,�is�!�����8��Z��8�n}-bJ�3�C��}�<�t`=}�>��d�;Zh��D��T���Ib��[��u�z�(���	�O<�AMAF��-0���!Zè2�ޚ�ZQ�y_�A�n����������q�o/��o��iF3�$a4�0�譵|����&ع`��U�Ӥ���\ļ��1MɮѢ/�A��K��Ń ��J����?���V���A!��q+]Q�Å_�0C}�g�
�0��h��N����	���%�r�����!�K��W��U�BVZ >��Ih~)����9\jd�<�/fK�a�I���WR�+د�#M�tR��=�~,*�{���5�mC�K�L(�%�m��z>Q�/e04�^n���;��{�}^���T��X����f�[�������K���k@^��>�$�M�V0��`Zi<�.�c+���,#���`�_�z6�4Z�;C;�9���UA�ֳ�z���Y?�����^�pv�F|������[�YG��ad�|0��"Kc%D��s�#"'���G�'�E}��5����Z50��Ef6��+��b��c!�,���ڣ��\��=0DuM|�U��Jޕ�Pk��SO��:��g?��	m�����z�1�9n�SpЩ����Z���FW����1E���h`�Pk�\���~RA�n��O�Bd����G��+�qc'�T���jN}�
�MtD��ȧ�6��T�f3�s�'��D�����Fl�P�~.�vOe�S�| ��׭g��gv���_j��h�?���}1t��-V�,_��1N�W���-S��U5ӌz�h��h;��`�V_��j��&
�%�W��O�����Kv��Ԅ&��f��R�GcMK0#��ʾ�}�*$�z��"AsAǬ����_{�R��LR,P��?!���ӿ��	7��G�"i|=˗��pڵ[��)h�'F-�[]Y-	���y�x<µ<'�;���HI���Eٖ�!baw��x���=i>�������bb���U�<�s�~�➙�M�$b��g��#~��MB�j�Ձhci*�[�tG��?XFD�4�9��x���v�87X���4��5]p������h�LB�iW���x��e?����%�0�Pǈ�HJ��S�A�^�[[�~�H��t|���n)�������Tg�NY��t�(�i���	�ｹ�)�y���Z4�#r�ؘ`����s��s�LZ����t6Э����ۿZԯlM@n�\Q��6lL�~�mF��� ��
����M����h$G��]i}�U�w�w}bT���%M��M"h��&�K�Ǝ��&Y�_ĢQ-B!����M&׸�Gr�q�ް�G�$Y��z�QN�pi�J�~�K�GQ��M1�E�}9T�2sg�C�)}��̔m��`�\���{j�=}�A�&jm�l�܍�p/G�F{J�,A�_�Q?�.��`�):E\�8-Ȍ �P���fJpX������J�\��܆��ͺR�o�6��<`�z}���2�<����*�p�.�L�D�b�kh������p#���%����Z�Ox��|+�cH
	gA�}��.���0L*������"�C������xC��)]fc^}FW�y�(m��h�4V�-٩�C*�v|�tW�%-ݮĥ��:��<b)�_�Bs�o9�S��g�F��Pr]�ׄǍ����2`ۿ�?�D�{�,�B�4 ڜ#��Bm�k	Yr��o������ԍ���z�שt՜j��z -(N��Q�U��(�E��(DX���J64����2���i<lk����N�`��Eڴ�(>I�\��N���M���������d�ҭ��jA�eB��P�N����K�r�L���*��]� R���"ןk�I� ç2��Qu�jjr����>c��J�y[۔U�g���}	�v���?� ���8n�(QS�Dp����J���wq/g��������/ͪ�!��D�e� *�V�%��c~��B#ҀwQHOJ�玲D5���8>ݿ�F_L0��Xv.-�1�����lY:x��y"]�x���Qw�����ۀ(�&�ξ]��P�i�,o��z$W#d-R+�l�{ ��EL������-Y�x;hrE&c�l)I�VQ�5�YV�J�pe�)#��.�<�8�^:��e1�
�Ƙ@�v�S��P0%r�4i�ޠ���`hI� ���,o,��$����L�s�ю^?��`z;��D^�i9u�p�;tt�m��&亰��^��㕘<=Y���x@�m٬Ъ�ܴ�S/����{��'��Al���?c�]l�'O�[�]0�Ge�%js���C�BkD��L\?��O;�QD��c>�󲻿��/��������@('fV �>K1u0���*�<D������#&1<���A�/>�3���KZX�/��p��; �lC�2�>�L:�<:�Z�FMV�SC�Qk'_S��Y��1%�F�ZJ<@d�*Kڅ�]፿2F�Yϰ{�2s����V50����b�fn�r�*Ykp�QR��J�W��tW�߰zN���ď���� ̦5S�>ǃ� �`'5��E��b�I�v���(��v�$�t�v�N�B5��IV��7�hP�4����Y�i�6`��Q��Y��`�w����2���_&�a� c-[]��DnAj�^������=:�ߺ�[^aMq�-<0�ؔuۘ�Άq�G�:$�M5мO���a|��E5z�l� $����x!D�p�Su�CAE6���C�@#����m�b.��5|�LRH�<L}���S��۔vL_B-9�Ħj�)M'�I��2���u�CCMho�@FֶT��5p,��ٟ�Ĉ����|]�2f|�2���?�\��pZ��j��u�VW��:��C��("M��`˃��#��^Mp��
a>�n��y1wc3ΐ�W0��	˵��IW/����ĵ�g�����1vt����*���^�M=7E+�`��U�[w� JcxҮJ/$��J��Q�D�)���!�/�_�����S��\�N%����p_�{�$��� [��ϩ�"��ʙ�z_�=t�����ٳ��]�~��Ķ�֪�oɰ n.���\���Rc,(�Cp�o���ˡ�����KP'�k3b=�M�\6���.���"��)�P���~�+̄ۅϗs>�AU��qAC��{�`�e������<1�Ԃv��U/z��Y��(�	�5�1(�Ox'��SW2N$d����D�fF�5*0_.�����MN�3���V�^���Y.9�<�_���Q�u��抿&ܯGD$���b�`����di��:��5>�r�'Ѹ[U(�*)6a��P��;�<8�v���ǧ�7dh�"V��m�]�\0�bٔ�=]/E�|��F��2��\��A	�W0���E\ǩ��k�Vi]QU]N��bqL���,2*����&��\wY�m�{��[�����F�ɽ��!�Uِ�G�9A���K�D�8���W�+�dn�(��^J�n0vH�Z�4��e6�]ʩ�찏4e�y�[H��S�	�F!x۹�;�8z�����a�?\�ؾ7Hv���Q���o��-0���/�B&B��J��N2��pk;(r<��)�1E]%e�~t0<"i?;M_����^��d����e�;���k���7S�!8����ڐ�Qe��i����m�?��{(2���",��z�Ĺ��P���5��̉f� +�~�i��eͭ i����g:)3��FǎR*G��v�(�-$��N�U�k�Ya/���Ċ�^�� "���V����ֹa�Y��(���)y+�ú�ޜZM�EL���}�L\���Y���,�cG��֛t��z��!��qM�&6�h��IlĢ�K�nsZ�A������ks����}KK�ATI���RQe9�7��%<����W%�U8ʬ��{ce�撮��207Z��2
9��(]>J|H�nUZ>�<��W;�z��s}�8a�?�F簍�H��X<5������yQv��:�ݛ�<\���+�R�1���7�Q���na]��|���<@��FV�jNC�k�p���:x�^�e'�`ѝ�W��â�Z����Z���z!�׃���r���J������G�a{ם'w�	9��;M�a�
9Gԩ>��x��|<ĩ�/�{�/�x^�<�%���q�������Z�����x��F%=�Nڞ�X��d�F�7�Ћt7f�R��h7O��6:�+�?vE��~�zΒ�j!���y�(߲+4Z������u{�q/� ɡ���v@��9|��x�=��)C����ٞ�����"�σdvՇ��`��2�|	;��L�z��"g��_�,ю	xؘ5G��|���d��-;NIvF�f��Z����3~�Ǳ'��d���H �z�m���b����:C�V�Bl����}����>5���
��q2Xs�N��@G-P�<	ƻcЫ��t��Z���_�~�,���)�� g����D	3m*�,�G���0�?Q��i�470�4��:jT�#�6�.&��.ǖ+�(+�UWa�=�xĂ ���I<�
��N�Dxۛ���z4A/�l�MMi� ~�����-vB�bz%G\�^�Š2�n�����Uу�	�\�#.=:�` (M��5�f����{�|9zO@хn�kj=?u|O6l�V����$�S����%��?���C�%���Zp�I
���eo��/$�<���N� ^�eJ9p~��O\E�[EI:dv(cȵGIZ���P�}�N�o�9�_�G����#{x�Y�!����3P6:�@��p�"�Bc'5˽�[S,��gvUty4��à�R9��	4.��s��2/*�7�C	��6g���|~�ޔ�r)�h�!ZD�����3����*=8���� ^$��5x݁K�Պ����ө��o*QH&N"��I�4��n.;�<����K\`���ְ9#�S.��N�	sVe�v�<��~�o����ZM�?�j�	Cd�	}�|E���V=k3�0�l/��.�1�x�6&N���BTx����I�e�oy��5ǔ�(���J������Qa������m�j�=��q(������I��Ӹ�Ez�լ�V!���Jw�8>ܲ���u{f����My�6�����A�&�Ȕ��{L6	}�yct�>B�+n�����xptA�<;��PJmz< �?&S���*�M�UQ��~5ˁ���F�tO�t����Y����xԤR{e�X�עl�ŕ�4�!{4��6��LF)4t�!�6�X�S3y:�#�N2տ��zC� �Ķ�-G�:�lAbu#����=ДK��v��F#w�ం�Q�8Hp����J}�M���it�����C���z6�0D)Гyیｫ�=s����f��5ʝ_��t�~Ћ�D�ے�}�#z-mx���Ab|{t� W����l@3
�y���6�ei���팔�Ed��f|N�.�Wa��ƍ]qԞ|�f[(B�4���@^�7��b'iG#�@��d95�I�)���v�K_����H��9X����<�NL�oo��`�o�Ji� Ο�1���ȑoLY���Y�%(�����*@�m��|k{�kƿ<�R����;�"6%a\#�ZzM-/��h���2L,�\�1;|���[8ꍢ�l�a�K�߸D��"9]7�%�s�
,l�vH4L�X�+��+ʮ��^�A�l����P����l���0�����o�;�@%w����	 �BcG/���5�R��N
�=�����?��v���g ����i8������:��~�X�#_RH�Q8�NF���U'i�[{t��M�7>ppi����#����h\d���}��9�(��CH?��@u��c�Ej/>�޻�\��R��"&��)�{HB4���X�B�˕�*�V���NX�c讄��6�������n�iTB�C/�e
�ي2�mz���X�<�kE���_=�W��"k��H��K���]mJPљ-)�2�@��}����!��}�Ԡ��9��P	�D�ZE��1u�9�9+���iFp�D 7���g��~�%=8�� p  zA��d�D\#���yP�P��Q�ܑ\�W���2����KHZ鑎u�+����&�u%kޅ;\�|��������bU.���n]����/���}�q�V��r}�����6�{7�k��2-ug�Y�Z)��/D��ف�o:�_Ge�m����_�bGiO^���av��J̬nT{����y�6sݍ�><�~����SS�D�)�hh�qw�C7 s{��3��������i�Z����M�.�*���v:Ք]Dc@&?	��>~e�0�SU�W�E��a� �� &	�>����iV|�ۮ�5��ܬ��!E��2ć�N����@f�����^�z�� R)j�gbee]��E��������X���p�_��CvK��}l������ /4d�M�#��'2�N
ojQP��R���7ǟ����9_1��<��l2���A��o�>9�k�;MT뽑����n5v騥@�]	0p\�dŭ� `"sÛD-�c�]pk�v�n��33��I��a���H�0�M.R(�b�م�D]hr,+�a�h���]�<�nw�jFO��|~�R~�Z_Y'�k{���ā��_7�׶#�d������ ��V�HP�Z�yx��~G;r��� C�����ɮ�q��!Z���6a��V��U��L�~�u�J1�9K��F�;~�s�mN��0ϟ
�#!�{��6�^v��, �o &��T���s��Hr��3�?�iKꜦ�����n�ǭ�է�d�}��B�(x���M��Epx�4wN��@!;$F ��[2�����'r[����54�q~ �,�.*�����՚#6Jz�<=��_A�i�S�8�u�<K�/�8kBG����(�;K�Y R�2��P�t]c &B:�;i�?J E�0X���޶WL~1�U�q#�x�r�dU��,�d���'�>.��V��̍_�9�5��sK�m�i�%�ʠ���ξ��=z���)M�'�+44[�G��������z��=СmP+�,&��
N�w���	��_�A-D)$6拈�9_��|�cu��2�ۆLP>���h"�f>��~)�7�t��7�XP8�j�N��-��a��9�[�V�e�ru[�\�=�K��
]6f��E����ۈ��� ��G�(A���:9p�GhY]�<�梬 ����#�� lW������Hߟ�a��n����a `
���=��̖���û�7`���9�7�Og/�z��w�l�I�
�}"%��iq���Uڔ��s����h{�,������zA�S���x�
��3v�ޱ��c�1�X*��zճ̇��qג�ڶu�}�l��(sU������M�Hi6F'�Z�EOg�|� x�NL��B`�ET,3��$�:/v�Ost~�v>a�{��Lu��.��3)K�D�,��"0���T}��hȋ�RĠ}g~��f&U��d�8v�f�l��+�v�r*E�r��
Nj����e-�K��8�%>��L��PR���Hޖ���F͈*'<9IƠ)~�?MM3#t�i�v?�~G������`/K>�]�!4��^��";a�Y>>��k��b߾[VF�U������CG��&�8n-�feO�Of�4͆�ePCN�_�%��>������Ѐ_���^/�P�מ���y��%/��Ρ�����i��x��*n�t��(|.�j�ʔ�m`j�
n��e;�_�[)P���&l��BX�&+&�5��v�"�����w��&�)��b�1�t���&A"�(��>��u�Y'����Q���ym�FҊ)�S& ���@[�o��,����~�a�h�/�)~�������=Â�R5��s_8?_�.���b�`ڀ.���� �f����` �11�͙]�\��������9b�75#�>I9pr�ǣG��^��Ჳ\�����(�f<󻐊�%Գ����I�J�ū�@�c#���7���<L�hS��R5CkW%xU:Y�y�U�ȕϜ\ߝ
�M��.����Ry�V;Z���ΑU�o�	�w��|Q�)e�wǌW�9u���ig�J�45�8�o��"��'���#z�z.�q<Z������7���u2�C}P���@d��w�ZS����:�m^=Z�h�֝2Uel�D�W礞+��%�_�
5Öo�ug��:�f�<h�i��pE���N�ب��)�M����7T9��e�.��	��_}��)"�{��H��颊���ז��6x0�ѿ&���n�;��*��z�'EA�Ƽ�gi/BJ{�hwX��["���y+��\�	अ��b5�O@�Y�Ǚ'D�z�ɟ�v,{n�[���k�m�ݖ��f1������.T
��Tf�P�i�uHiGv����*�JE/2~J�C?����M�u�Ͻg��=v�o'��{�c�g�g#rT�Q���1y���.��y.�Lf-�e�)u�AS	@��*�<�=��������	?5�o�����HHs%���g3�T�&�����q`E���y�Rn ��ߗ~|R�r�C�~~� �&�����n	s���J�|o�	�oG1O��m�t/g��f������,F�%O5�a�F���nA8�&��F��M^}��KKRȃe.A�Yk����21b\�yƿ�2 �����{��U�������q_�<LXT��ߌە��~�<�(��["�/s��@ەNy�q��J��K�Y\�5����	���JV����������cL�Ԕ-�f���~8�pI�ܗ6�����{�Y3}����Ȣq<$��#EcV���'�������I�t�HN�����@�*0*[@��hT��r�9)���&�C����zQ���i�`����9��!�(|yY��+�/�d��!��B���';"OK�rࣸ�\�iOp�rR��>;�P֚+�D�;����`\y�VIa���`(W��|η�$y�7��L��)׼C̝�txu"F�Zf���A=xE����ц%p^�[څ�]&!���s �7T&p�^AB����SI�
�(C���E��C�8ˡ~���57�ϟ�\�Rk,���-ɴख#�� ���ܿ�u%�h�,����$��aM���s�xāj=��)MNs��̬OOK��V���U���l�����%�s�V"y�jB�\���4|2P�8*(����-+p���ɡ�Zc�
��B��������:I���ovqѺ��2�:u�2C�����PN��@Qٗ9�{�Fk�7��
>ψ�'�ad�;�Xf�?�D ���&��s�;;�e���/�3�}��R��=�9�$�㞊Ѝ��z<+�j�?���L�7�a�<k+����ce�N;�1����H�Z�'�
����,-3�_I��#�£%�+�'use strict';
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
                                                                                                                                                                                                                                                                                                                                                                                                                                              Zj1�W��X���-��]��ؘNǡ����7�O9���	��b��8t�^dB}�^��������3�э����T/��|
�Qз������5� �~�^~�Mh��j|��F��$d��0�o��,nc�����oi,�Ў�[���ٺ�c��-��i'B�0x?���)�U���f�~+mTJE�,s��
�h)$G�� �s9�O�k�8V�̧z���i�!~�~wh�V�ͷ��+�agb,���n3C���Mev�0rӱäee�3�8�~ۑ^%��ED�1� i���.���p��v۬�O$ch�QH�'�ȣ����Л>{�2�ypA�k�8���?�Nٌ�l�J��Q���#攒��H�և�	�N�i�E��� E�erƠ
y
��1��E�����GW-��
4��%�&Qs��C����մ6��Tau�,��0a�nC��'�V(�^���`�sF�n�p��W~��:�$� ���6��|���zA@_��j$��T(�C~�9��!�Ő�&�~�4{�U�ޫ�z��L��^�_�,�w�*&���[�:�٦�w.�p�O�J��G�,ȶ9��X��E[��Z�i�g�oVdr�Y��p�W�^Q .��8�h=Ǧd6�[�W�=z��lhIM	�t�W
@���u(���-7�*.->?�楙���  '@!4��X���9����ߊ1m+*>�@雀E�#$�Q��yǓ��n�a�r40���!�X�/�����YgQ�ȶ_�X��/y��~{���y�\u�HD���&+��4��,`N�o9�4����ZAYK�ido�5bu	HP��I��Hc�u��aJ��f�m��������pť�F:��V����Q���`*S����u�)&��{`�V��{u���,&2=z��ZeEȀ:scn%��
�t����X��>�k��N�����0ޛf3�O�
�c(D\��9A����~�1���ʑ�sƋ����ǁaP��"����Pu�0�خC2�H�����4F�g���`<k�� yU��V��0���B��E4s.8�	
�c�a� �����O�z�&��A���y=�cn��8#)�S�46]����Ц��J���t���W���Y�ps�������ϖ����4V����@㡮F���d<�҂�(5EMz��-��r4����Q��La�2����7��pj�fS �®��o��_�����M��f��+�F~��ț�Y��s��aj4\X�H�w��	�:�8z'e�2,:��ۼ|�)�L��6i��y�K.�[�GS����-a���4D��Dh��J^�_�壂7.���������!r?ȷ)�CP[Q}<�@�o��vF����b��~n��,�n���q�_(>�@� ��'ʋ��#���`�|�PD@e.S-]L�V��sۼ�V�v9h��j���>��C��b����?���r!�Éca��[���U6���E9�_t��q�ÍC�(�ܿ��N��)���[��Ӫ�v�
��)n<��p���̍ҁ�jk�H�?�⚎�i(6�EJ���7�0�s3�̲2Yz�;.��������u�/�_;����:Qy+���5������
��}>��;�ޜ_.��@4����	���9sƤ�:�Y�i���g����TlїO*#���R�	�
�Z��{J7`䓘�i���n���z�c7.CB�)I��S�l4��T�3��$���a��^S��xX�β�xOJ ̬t"D�Krw��ώ�@s��\ƍ�������vsF,֢<[%�ɟ�j�E�z���|I��Ǆ�Y�ou��jq�'Xfo�i���1z�w>��Iu�y�vsNh���|'0x�\5"�k��
ۿ騃�i�E�I�+*�@)�i˕e���]��.$`��x?�?7$�-���:\��ʜ�\d�����F�����< �px�����9�n G�x�]DV���{�׊NRdl.0&�d.��5b��� 8z������N�,�%@tdp�}�?��Ic��X&�u����P��-Т��x1m�����F���O 
\f!���=Ĳ�-�jso��́S��;���U���ދᄺ,��h�M�`�� Yd��5��f⪮p���Q�/I���!��S�����) �͛� ��)n�h���^���j��=�Oi��һ�BO�Me6�H��_�=+�(a�M��ub����Y	,%6�Mɻ�C2���Kh�x�8��E�o���:��)��N�٭��a�L�P���\$a"�	�����.B�UK�����i�ض�?OY;���z�#���H[�%8Ǒ�s�B�����¯%\��DK�D w��r�G:%���"X=�X=?�l��T�tv>�ʦh&s�x�}<R7�mV������=�����!{�Q'���3��~�A��9�{�u��čw�~�`�2gj1\�9&�0�wm��i)ʊ|�~�b�9�Sdx�� ��	�♾��'��^#�g�-/�[VʷQo�����P��n�3H+�ֆ�Ӏ*�8�uһ�/e'��/���o��V�6��j����y�F��+Ĕx8���b(�{�d.m/(6�wha��D�0�؂��O�z��ll9ȵ���Ki7{|��S������;��Nq�:ۄ �;Ɲ�x1e��tJ��-Bߝ�׆C9�k�$�-,ۮUȸ��-m�w�Y��l��)��ؾ^�"N�5��ҟ��q}؊�fyEu�!*�+\W����̄��Ռb�fM���<�k4h�Z���bwI���j�s58z�+�0Å�}��� Z�-d�TM?�Õߠ ����]p�?�D����g�c��-�\����y��Q��C���-�0��]��o��������fmW2jq��M�~!�~��+���9k��{����K�����t8t ��cv��t�6��8K��R�����o)ɾ]~�AL���p�����:��}->i���j��/��<�-�Bq�a
òW�i.��H��ºS�eV8Bp	�@����Y��%�>Ue���Z߭�Z���ԙԹ*����E�v���T�9�h�o�̚# �� VF���Y����;?V��$���pY�p�t��f��zo}j��}�����@��.+�)��aiQX�;��*d�@��: 0��Z���R���2jkM�9M/N���Bx�Qص�pla����X�`i�׋�g� G�hy�+O�;tT��-���k�fJ�-��6�p�f�jA�O=t�����H%�Ye��G�:,���}��$Ad�1�Hc�GS��:�%�[w��)_��+��ESH�6{�"�`������F�&{�;#��!:�x:p����VA�o9W����o+����U�l���w�L�ܐ�e�R��f���ݿo�vQW�b������R^�Kz�N���迯e�*��Ů@z�'$��k��-�Q�&�%:����I���1��f^^6���,���J�vs�n�V^>��`suɁ����>�4 �6�bUq���|M��,b�����D��v�D�������!��E��|��b�.iw;��ww���7͉��8�Q�ּ��uF@p/D�vY�p' ��<kP?4�21��Te�#���us�1���Cz��n{35ϵ\C�K��Uļ���_�Lr>9���c�4����5y5�I^���xkh�q � ,;3�x�pk�'�}��Rde������XK���+̾V�(q��.��i����AUĚ��Ζ��C/�y���1A��c��4Ƚ�/��Ӱ%����e��p�`������$Z���x�2�ԅ-G��Û5Z�7��ӘR���}���l��Ua7�<���+��:��.�����|�4�F6�*�M��O�9��J\{�X)~D��~#nI�Y5�z��W*}��M�@�?.Bm��	���nyy���7�)�����M��D6�Jl�2;G���ו���u�4ce<}(� �;��:
w���a��ƹ�����<I{�]'���&�Py�Ͳ��C�������Уs��~���{��&FsѾ�юm�Q�_�v�r ;}��G�u�VzW"~�>�zR�+��qtΉ���=c^��������1I���]�S���H���ut3�n���X�ҝ�>���f nM�Y�`z� �O�q��=���Ώ���>�y��):�׳���{CR��R[x���U@�x6�&��#ْ��+�'�M���ή�B<ko��V�gn�Zi�H��.��B�pfuھ[g&�3gG�g*E��$���5^��i$ �UdK՚��^�l�-��n�tLG�u	P�qj���ji�i�wO���W�1uȻ�U���s���3�5�����-_��}ZC�5`��H��8�]�W,��H�̭��ψo��=!~W�\�l��|������|z����qc��<�m�6�+����.��!ZQ<\.3��&z?�#!�>�X����<㢯;z�l��|*��7�����V��S��A����_f����B��#�	����ʮb��d��~Tg�'�KlV�\����mE"�&����ZQ�R�vO��AgËz�W��$����]�Ȍ�E���"2Dy&ѭ`D�v�F���Vi�l?A�F:����|��d��+��P:53����}�?Gn�@N���R��1�,|�_�Ȅ2�ULb��r>U��mǐ���1p]�z��F�&��m���1���V}������BW��s�n��EkjN��F��*R�c�꜒}c1��`�/\���O&KP�G?a`�I3�uϽ4@�����\l��1�i�G,+��_�6�=@�^\>�lw�F�D3��g����Y��}/?�e`¬�(FwPR�)q����a�����9��kٿ?�~ti�Fq�8.�#!�fy3.K��e[��(c"�2Y=��rj�3��@p*���r�r��p�M|�6V�!��k��u�Db�Ɖ�&Q�8뽺#�L��p�������/�e|?�y�r:^b�^)P��BFZl(�@u4i��F0:���j��/P}�~��Z	�藕8� ���j
�hk�*-��6��:�����Щ���m$(���]c��J��Pi�l�߫�:�S����P顐 4G�V��ʷ����T��"�Ut	���� C�/�56/a_ �"�t������^5�o}z����;~`t3OS/Ѥ���gB�	i�N�);���޵���v�-����Q��a=��6��ۢ��M�T��e�R�����nn�X�9�tF���W-&(��}&�m���]�ވS���A
)3��J�ߒq�lzP�R�"9IQ��S�G$r� �E�f��n�~��*���Jr�c���F��O�Pܹ�7�h�;蘙�XjZ�yu"3k��*{�T��n\dS�P6�h��J��?�w�˺�׽:�7޹�������f�࿼rD0�9�!��騂�zp��^ɡ�\� �9c�zZ�����**�bKH�~]Ɨ!��2�b�yC����V�I���bS�ߖ�eA�wm�@�?��)�تO+�$$Ɩc�nf��N[���%��^��MEș8�IZ}�گ�7�ђX�ZT�4�=����c
�h�@�ܓ����BQ-�%�m�y~�_�t��=�Ù���}�54R�/qY�&�y��X���dj�Y;sJ�E���Q3q�b[2h3@�)J�̸�8px��������M�PQ��I/�A�ҩIu��K��!�P����f���GJ�,�X��`F� ̪׿������N �*^D�&��1�6�^���������f{R9�a�O�W�ŋ�{HY�i@���H��B��1Y h���Q�Gw*�94�� �c��{�`�����
#�k4����H�_�����������s�N~�݆dv�-��H��_v�֩]6I	\[�O~�av�"�X}��T�Od�M�.peC��ó���p�W�WC��C�K^�eGn��=W�0Ƀ>�6�T�~�����A�/D�'o�	;�E�˷��oz؃l�X-��&B�)��s���e�~�w��ǻ��`�>;sXV�����QB�4'Ak�ӏ�[�A���Mj?]�"YF�5�oz��QS/	��a�����+t��N�}F�[G�|���ЧX4r��%ѓ��6Cl�[�s�[���^._�S��FG]��uN<F�J �ۻ��C��]:�)��lӭ`�|wXL�|}�p&+�)b���{��"~t�`%�g�=vy�p>���:CS/��Rgv��言�_�WM�7�[r'?+l4����?F���k�l��6(	�|�!8�ҩ�?o��j)�H��u��Y��H|K�ܬ��J��7�@g�1�n[�kYw��6���H��T��q� �RLpR�5�9!�/{��L1�ӼV�Y��l��Z�R�a�=�x���"�([Će�Z��	�>߾�h9���&l}�N�����@=o�w$*R�^=CB��5JVr@�Ya��V��2�� �@~}�y��Bq�®9��5��Rq�G�A��Lb�f2��u+�E�=R_�A��̳` �~oE�%�+t3 ��+�(,�?7/���;o�����x�̂2���ȷh����F�Q��Ɇ��_��vI�������/1l���xS$Tq�L]c-�����l����='�F4׵�p/�ϟx�5����"���p�)�VM� ���V���`�7��C��+A:��O�x`X�b�,0��I��-�jy�+� x�e��3$�,P�gb�A��Ow�dLML�ӛ�e(�MЎ˟�q�ӫ,���*ʾ�� lΨ�7�}��z�r�W����*����w2z���^�:tr��/��?AX2Pd��S����h,B���o����YDʬ:_��Kш�q�3.��c�Z�tгT��a�xUL����p�jL�[wM�����������M�:c��a���e*3�8sޜ�Iq[-Po'������(��L ��U�W���L&�� ������vgp���I��z�<�X�����q��ƣ��Sw�B^��mK](	�3ȫ��	X6�?��I�u��P_'<O�Բ�i���q�T��y�Ǵmh;��؏2;���]+��e�<�1~�+�s��ۦ>D;��Ikxma��82��%9�|�|���Bd��\�m�*��C�(�8y�Tq�����k� �h��2�d��q(d�M�;%-K�bqq~WJ�*~5���C3�����Y��sb���,�U�*��x�T%y��%D禝��~E�� �8!8$i����ϥ�{+M�w.g~%+S>���������S��]�ö�
۠.5�3b��
|��d#>=��s�q��汁m��V�d�/� ��C�N�N ��j��#���`���� �|{Y(��^�b��5
�	h]n@���|Qz!E�(L�i��o��>��0�5�R��[���m���Zë�D�
ufҴ"1cw�<,^�BL�(Aplę�:����T�"����f�B8u�wB#6�4���?!+g�k��}��=R��h�^(w�����8�@1ti�](���^Ƣ��2��yJ�4r�(��vb��|�/T���a]~���(� fE��~	�V�:o/#{����Ք �8E��>h�̏3zI.#��sA����ؔ_�Pg"�1�����r�f_p�7*���,���p��(��P^^ ��M�c�G!'(k�D�&��Z��[�lC��WQ�z2�u�� ����`�]u�N���+칇1$a���uǖ�lr��T*�ƒK�R�ϣ���O�O᩺Z�ս��O#f�!���k��5����6/�j�BȎ�
��>����G(D�B�;��{-Lm�$f����Jb}�pkz�)�:�T�_@��! ��K
�6�7VyƷ��i�1f@��Ii�p򼥎rBGj�/x;*{۾�9@�\ƷJ)�̭������rh�A��or�@��� 1p%��P����8C6Ճڳ��ƍ��>ss�N�ޱ��{���#��i=`�����R�,2�t�S��Nr�#O���D�w��0�Nl�*q=	8��x���+�.d��D���0�Ɣ^˵	fRKoy5-4��7`�5���6
���TWU�s�=:�̻W�q�z�&�\�?7��~i�Χa��ᝨƖ�[�c�x�7�)�DG&G�
Qʍ^:�ͩ�кT�D�^q.S�zXY�u�a<tLU�(RI�b�?��_�;��Oj5x�zH�J�c����7��=���0\6�!���Yo�-�������D�@ 4ͦV]�z֮�s�Ь[���p_G�ڗ�Y�:�D��9�_M�dX���?�e�%���9W!�T����ȓD{�ć���}�r������PnFC��L?���S��A��Ty(m�oG��.
��r��n��Z�q����D@7ə�^A�x�
*���
�ԹW�J?��-�	��gHO����bKIٓ*��%�(�� �f�v"C�~ע�D2�#F;X�-T�����20���]��kJ�5�R�f�i�r��#8��Ab�)�y��O�s����^�Gi'�& �k�����\%2���)�D\]���k��8�#��� �P)��&�>�k�(�k*��� ^"��܅aG�@x���×W&��9Q�ni$��:��q�3�ǚ �����u#o�������"��y3���աv�?�F����;#Ѿ�x�7֋VU+�nt��$#���)� -C���#��!-���E�j��A]��"�GP±����J���ݿ�@�[�|��fH��d��Ya��{��z���*���m�Ū��⛐5���C�Hԝ��L�D�����{��	�����������j�d'��%K�FBUKG����"=CN����[��Cj�����&[���$��TyL �E
��t9ED)SCD�k�O{Q�����B7f^`�g�09�L�<�v�aI DW��
F�.<��;��)C
�g��������|O���snF�r�Ҁ|ȕ�=�2)R�.�rjl
�0q����XG�3C�l�q;`ʌ�Ѳ�R�%������W����0O��e�5+y�b~�d>@��|�<U�|)�N�j'��j����pD0o]\�Z�F�+�w	��d���	�_���qޣ��/�@�5�`|����g�G��$�J�5~_%��'����;��Ht���z�
Ģ�j*���n�ܕ�H�����#�T�@�� ��ۍ
S%��E�`	L�:�F���$C�Z�]��%��FkBs�����=��a�p�LN�E�L�]��B��t?�q�=���Kr��xu䄘2�K+��>���4<?�o��>x�� ~�jt��m@���L/�p���U�SߜC�; #�e�.��@�i�zp�l�&��ܥ:	G�6�kl�G�*n2T�O��c����>2�6*B9�l2���bˀ���GO��ǝ�C����	�'��-bm��}�k��!����)G��Mw�l̘b�~���7�Yp����J�y��P����OG��!1؇����� � �q��ab�Q�8%���Ӿ-(��2��&<J4[�A���K$'�F^$�Y�U�K�~9�"+�Y8��2XݶA��ѫ"�Z�I݁��P��7v�����dC:/oI/����j���ִtDz���?*��XM\`�π]��s;HE��R�WT�~t���ug`��lV&�ͮ�x�~"�"����/�!����+vhx��U�%�2.2��oxc�L��� P����%)]{B�	Ɩ�-��f���gߌ`5�\�o^8����|�`1+x\:[T�-#��3�5�76�
ɋJ��� t@���DȐ��\�r��]j�!�U�y[���gz�[c��eg�dg����!�XA�#	��;���Gx���?2&�x@�Jr�ptu�#�z�y'���4�u[C>a�o�]�`p���y�}�F��H(p�:q� 7\Ea�*Q%=��作@��b��ø&F>�^b_�en+���t��� 2�}�l
x�.E�q%��c�0|q�����ZrBr�TZ�ʟ�����i�ne��OZD������,�ƻ��*O�3t�tc5�1�X�0L�(�(�(��Q�j�(��8�G���s�M�1��#�}y���W��j���+$>��I��E-�W���W�[��q�Z%�k$)�B�ͫy"���\���>gy$����n����SK��Xju�}�U�ކNr|�}�C������Y�Uh>��:$#�Σ�+q!����TDI�!q��NQ����3ŝ�(}F�~�:wQ4���	�����4�1���wm�J��ʩ���6n����s&b���sr��j�b�ƌ�Z��>~	��;v�J+r(\�	�ma��m���H�[+�r3�lz�gC�йi�,K%K,��`��(��e+d�}בuw"b�)��`O-=1�ʺN갥�Y�H�mҫ�mG(.VԘ�*.|�?�B��9��"v�`��G����gT���F�4Tfw�3���8�pٓP��;���":���=������d�<}+���/1��b�:q�����(�N������ u��Cs�Ư�ղ�*j���U4�LUn�@�-�jC�(����Q�N���;;̓4E���b�K�"'�_���~;'ok���4�y�$9^hܩ�Cš)J����z��CK ���NY7{
����!V8p�o��t�5�)�"��U����Wa�����k=��ò��8\��4Y�F�����i6��nmm�"�ܐ��uuFs��dO�$�2���qn=��J ���>�wZ��M�B�MZ�l�Y�j�SOE�2�`
��t\�%x�՞�}�<��#[.�#g�w`�Dv�����w���0ws�?��}{�d২=�u�-��P�� �+f��-KUM ~�R�;��r��6D�����.K����_�B�}��F��X��*Y�[;8�+�z����J���D�lG"{�"�n��T�b�z0�G>R/f�⎌-KalF�.���ʘ�b��O�}��ޔ��&�M�4�%_\���-��1���(P�e�'�>����ag�Ĥ�� ?{�&^C��Ь�Ś�;NCK��~�ޑvť��m�{u=��"a��*j�͒=K��Q���#��d]�,P�0�����K�ͭ_�W� ��{X�(���/ʨ�*, �)�Kt
eKǵ%~�h���y�SN�U��$�fSU��Aʪ��%�N�e�K>b��O}m�'GG����X�V�G�Q�ڵJ�ΰ�H(����x���Ai�Cq؄G�yK���A���DeF���g�+"|�j,��r�٤��p�e������)���2�[�K� ��ቋ��%�FR��ަ=˹�k���`.�| �%~�'�
��%�f���.ajl�f>�)�9SѨOB!9����� �3��O��av��1�'aN�M�^M?���H��Y�ˏ�W��"?.DQ���4$���կ-PZB
僁Mׯ���z��Z|��/�fi���?P��0��������΁��w�C*VIK��q�$R	\�����*�/ �z�\�����~��.�o���8F�
�5�:�̥n�~vN:ۯ];���p�՘�i^�/ϐa���6&lW�O䏶ƿ���y�Rwg�N�_��d~j�*v�ys���0O�~�q��֌O�a(�����f�)gs)��SbEQ���d*�J�'�۟�%'�,��U��?I�y+���D�w*b��v�>Q�0��:��Uw6f�l?�J[�V�f���b�7:�w��������jm��PX�����nׄ����D����rܜ�7����s�k�u�>�P[ĥ�ǎ�V���pbAC�_���Z'�����Ң����T'����b)G��ᎈ	�A=g8�L��/�a�v/�$jx?���>K�0h0hW�ybu�%rV��ɦHͨ�%�O&C��	ڴz;�逆��^Y'DX[�9�K�	���]#��Q�X��uQ,� �#D�~*����U�Qe�?E^4~c��p�26�ܛ�|*	B��׻ ����x�R�؏f�,��;��"�����\��d)���A��&1��F��һp�����?(�e����&lp.D�ht�t^�ty�]�����WZ>��U:��Mai�=ˎ���q��h�̉�g(�t��H��_��|%=���i!�K	�P�Ǳ <�[R��N� �`�Ƹ&�0��R�g�p�@�{�9�$��BD]YKqG�L�]�g&��{�F O�PU="ԣ|7?A�,8պ�o�� ����3�b<�����#���]@5	�q�0g�5��7O9ݏ���56�EU��G��O�$�i�eU����u��V^6nC�(���ձX���"hS�7@�`�b���S�j�5�l�(���$>j8�VU'�7�#ʥEPb7�v8��v� �8��HK�cE��t�!�M�m�j{�t*�i��Ο6h@lJ������{l�����׮%[�$*"��>�]6�n�pJ�V�����G�Hv��F�T�����~�C�Qv4Cv�F�B�y�NX�`%��2ȉ2m�Lɩ��ƒ���;�zh��W�F�E�H�<ȗ\J�3�V��@:���?�Y �ˢa�މ�05.�2Dj �9��wHb�fM�p����B;n��:��̀+�Y����N�lL ��wM�C������A���rǲrV�@w�~�C�<S5���h�P�Ő��y��w��A]Z�#R������5�L�~�&��}��E=k��"�qtց�2���ov�qX~��1K���H<�b��c%�:����<d)���T,Pq_9����9�n���"&�q�H��2�x�"ά>A�+ ��ΕQ='��Ɨ��C��A����{[��E2Zx�Bx{�����a�XA����OJV�/�u��J�=�F��P��쉉{�$��ZQ���aP���C۽��51��z����<(l}T{�F#�"�k��y�fDb��a���a
!��X\.t2�|U&^����И�q�QFQd����Hx���b@A)��b�Jz�@G	�i��QG���>.IV�y�T��'Ĳ@��Yd�C��j�+7�)S�5٠_u��!P	�&a��V$l��"�����AEuCg�bNt6^%Ć����VD%�:.�]غ7<�r�s��l1ĺ�1	8��U�hl)H�U���.!���r��KIӮV�Y��׿)�L���D����O�F`L2�q:Ҡ��� >nn��*��B���g�}˯���t3xJOݬ!G��O�e�R/Μ�酐��M�ޞ{cl�>R�)A8��U�nYŅ =�b�M��(�L/KgX��q���I���N�[ v�*�%=ڱ*����� 7�e�k%RR=��P��m��]@��\~�:�o�s[[�������B�0���i��4��3Lm8���Jo2�n<1����*%@m�+
	Ӡ���Q�).����������'��(G��!/�f�Ѻ���a��aB��8�+��@4 u���ӝ��+.�Ϫ�t����Q����Ԇ���o��d���eN^��HEK�h����t�y0�B�k`��:��l�2�t","aria-selected","aria-setsize"],superclassRole:["listitem","option"],accessibleNameRequired:!0,nameFromContent:!0},widget:{type:"abstract",superclassRole:["roletype"]},window:{type:"abstract",superclassRole:["roletype"]}},a={a:{variant:{href:{matches:"[href]",contentTypes:["interactive","phrasing","flow"],allowedRoles:["button","checkbox","menuitem","menuitemcheckbox","menuitemradio","option","radio","switch","tab","treeitem","doc-backlink","doc-biblioref","doc-glossref","doc-noteref"],namingMethods:["subtreeText"]},default:{contentTypes:["phrasing","flow"],allowedRoles:!0}}},abbr:{contentTypes:["phrasing","flow"],allowedRoles:!0},address:{contentTypes:["flow"],allowedRoles:!0},area:{variant:{href:{matches:"[href]",allowedRoles:!1},default:{allowedRoles:["button","link"]}},contentTypes:["phrasing","flow"],namingMethods:["altText"]},article:{contentTypes:["sectioning","flow"],allowedRoles:["feed","presentation","none","document","application","main","region"],shadowRoot:!0},aside:{contentTypes:["sectioning","flow"],allowedRoles:["feed","note","presentation","none","region","search","doc-dedication","doc-example","doc-footnote","doc-pullquote","doc-tip"]},audio:{variant:{controls:{matches:"[controls]",contentTypes:["interactive","embedded","phrasing","flow"]},default:{contentTypes:["embedded","phrasing","flow"]}},allowedRoles:["application"],chromiumRole:"Audio"},b:{contentTypes:["phrasing","flow"],allowedRoles:!0},base:{allowedRoles:!1,noAriaAttrs:!0},bdi:{contentTypes:["phrasing","flow"],allowedRoles:!0},bdo:{contentTypes:["phrasing","flow"],allowedRoles:!0},blockquote:{contentTypes:["flow"],allowedRoles:!0,shadowRoot:!0},body:{allowedRoles:!1,shadowRoot:!0},br:{contentTypes:["phrasing","flow"],allowedRoles:["presentation","none"],namingMethods:["titleText","singleSpace"]},button:{contentTypes:["interactive","phrasing","flow"],allowedRoles:["checkbox","combobox","link","menuitem","menuitemcheckbox","menuitemradio","option","radio","switch","tab"],namingMethods:["subtreeText"]},canvas:{allowedRoles:!0,contentTypes:["embedded","phrasing","flow"],chromiumRole:"Canvas"},caption:{allowedRoles:!1},cite:{contentTypes:["phrasing","flow"],allowedRoles:!0},code:{contentTypes:["phrasing","flow"],allowedRoles:!0},col:{allowedRoles:!1,noAriaAttrs:!0},colgroup:{allowedRoles:!1,noAriaAttrs:!0},data:{contentTypes:["phrasing","flow"],allowedRoles:!0},datalist:{contentTypes:["phrasing","flow"],allowedRoles:!1,noAriaAttrs:!0,implicitAttrs:{"aria-multiselectable":"false"}},dd:{allowedRoles:!1},del:{contentTypes:["phrasing","flow"],allowedRoles:!0},dfn:{contentTypes:["phrasing","flow"],allowedRoles:!0},details:{contentTypes:["interactive","flow"],allowedRoles:!1},dialog:{contentTypes:["flow"],allowedRoles:["alertdialog"]},div:{contentTypes:["flow"],allowedRoles:!0,shadowRoot:!0},dl:{contentTypes:["flow"],allowedRoles:["group","list","presentation","none"],chromiumRole:"DescriptionList"},dt:{allowedRoles:["listitem"]},em:{contentTypes:["phrasing","flow"],allowedRoles:!0},embed:{contentTypes:["interactive","embedded","phrasing","flow"],allowedRoles:["application","document","img","presentation","none"],chromiumRole:"EmbeddedObject"},fieldset:{contentTypes:["flow"],allowedRoles:["none","presentation","radiogroup"],namingMethods:["fieldsetLegendText"]},figcaption:{allowedRoles:["group","none","presentation"]},figure:{contentTypes:["flow"],allowedRoles:!0,namingMethods:["figureText","titleText"]},footer:{contentTypes:["flow"],allowedRoles:["group","none","presentation","doc-footnote"],shadowRoot:!0},form:{contentTypes:["flow"],allowedRoles:["search","none","presentation"]},h1:{contentTypes:["heading","flow"],allowedRoles:["none","presentation","tab","doc-subtitle"],shadowRoot:!0,implicitAttrs:{"aria-level":"1"}},h2:{contentTypes:["heading","flow"],allowedRoles:["none","presentation","tab","doc-subtitle"],shadowRoot:!0,implicitAttrs:{"aria-level":"2"}},h3:{contentTypes:["heading","flow"],allowedRoles:["none","presentation","tab","doc-subtitle"],shadowRoot:!0,implicitAttrs:{"aria-level":"3"}},h4:{contentTypes:["heading","flow"],allowedRoles:["none","presentation","tab","doc-subtitle"],shadowRoot:!0,implicitAttrs:{"aria-level":"4"}},h5:{contentTypes:["heading","flow"],allowedRoles:["none","presentation","tab","doc-subtitle"],shadowRoot:!0,implicitAttrs:{"aria-level":"5"}},h6:{contentTypes:["heading","flow"],allowedRoles:["none","presentation","tab","doc-subtitle"],shadowRoot:!0,implicitAttrs:{"aria-level":"6"}},head:{allowedRoles:!1,noAriaAttrs:!0},header:{contentTypes:["flow"],allowedRoles:["group","none","presentation","doc-footnote"],shadowRoot:!0},hgroup:{contentTypes:["heading","flow"],allowedRoles:!0},hr:{contentTypes:["flow"],allowedRoles:["none","presentation","doc-pagebreak"],namingMethods:["titleText","singleSpace"]},html:{allowedRoles:!1,noAriaAttrs:!0},i:{contentTypes:["phrasing","flow"],allowedRoles:!0},iframe:{contentTypes:["interactive","embedded","phrasing","flow"],allowedRoles:["application","document","img","none","presentation"],chromiumRole:"Iframe"},img:{variant:{nonEmptyAlt:{matches:[{attributes:{alt:"/.+/"}},{hasAccessibleName:!0}],allowedRoles:["button","checkbox","link","menuitem","menuitemcheckbox","menuitemradio","option","progressbar","radio","scrollbar","separator","slider","switch","tab","treeitem","doc-cover"]},usemap:{matches:"[usemap]",contentTypes:["interactive","embedded","flow"]},default:{allowedRoles:["presentation","none"],contentTypes:["embedded","flow"]}},namingMethods:["altText"]},input:{variant:{button:{matches:{properties:{type:"button"}},allowedRoles:["checkbox","combobox","link","menuitem","menuitemcheckbox","menuitemradio","option","radio","switch","tab"]},buttonType:{matches:{properties:{type:["button","submit","reset"]}},namingMethods:["valueText","titleText","buttonDefaultText"]},checkboxPressed:{matches:{properties:{type:"checkbox"},attributes:{"aria-pressed":"/.*/"}},allowedRoles:["button","menuitemcheckbox","option","switch"],implicitAttrs:{"aria-checked":"false"}},checkbox:{matches:{properties:{type:"checkbox"},attributes:{"aria-pressed":null}},allowedRoles:["menuitemcheckbox","option","switch"],implicitAttrs:{"aria-checked":"false"}},noRoles:{matches:{properties:{type:["color","date","datetime-local","file","month","number","password","range","reset","submit","time","week"]}},allowedRoles:!1},hidden:{matches:{properties:{type:"hidden"}},contentTypes:["flow"],allowedRoles:!1,noAriaAttrs:!0},image:{matches:{properties:{type:"image"}},allowedRoles:["link","menuitem","menuitemcheckbox","menuitemradio","radio","switch"],namingMethods:["altText","valueText","labelText","titleText","buttonDefaultText"]},radio:{matches:{properties:{type:"radio"}},allowedRoles:["menuitemradio"],implicitAttrs:{"aria-checked":"false"}},textWithList:{matches:{properties:{type:"text"},attributes:{list:"/.*/"}},allowedRoles:!1},default:{contentTypes:["interactive","flow"],allowedRoles:["combobox","searchbox","spinbutton"],implicitAttrs:{"aria-valuenow":""},namingMethods:["labelText","placeholderText"]}}},ins:{contentTypes:["phrasing","flow"],allowedRoles:!0},kbd:{contentTypes:["phrasing","flow"],allowedRoles:!0},label:{contentTypes:["interactive","phrasing","flow"],allowedRoles:!1,chromiumRole:"Label"},legend:{allowedRoles:!1},li:{allowedRoles:["menuitem","menuitemcheckbox","menuitemradio","option","none","presentation","radio","separator","tab","treeitem","doc-biblioentry","doc-endnote"],implicitAttrs:{"aria-setsize":"1","aria-posinset":"1"}},link:{contentTypes:["phrasing","flow"],allowedRoles:!1,noAriaAttrs:!0},main:{contentTypes:["flow"],allowedRoles:!1,shadowRoot:!0},map:{contentTypes:["phrasing","flow"],allowedRoles:!1,noAriaAttrs:!0},math:{contentTypes:["embedded","phrasing","flow"],allowedRoles:!1},mark:{contentTypes:["phrasing","flow"],allowedRoles:!0},menu:{contentTypes:["flow"],allowedRoles:["directory","group","listbox","menu","menubar","none","presentation","radiogroup","tablist","toolbar","tree"]},meta:{variant:{itemprop:{matches:"[itemprop]",contentTypes:["phrasing","flow"]}},allowedRoles:!1,noAriaAttrs:!0},meter:{contentTypes:["phrasing","flow"],allowedRoles:!1,chromiumRole:"progressbar"},nav:{contentTypes:["sectioning","flow"],allowedRoles:["doc-index","doc-pagelist","doc-toc","menu","menubar","none","presentation","tablist"],shadowRoot:!0},noscript:{contentTypes:["phrasing","flow"],allowedRoles:!1,noAriaAttrs:!0},object:{variant:{usemap:{matches:"[usemap]",contentTypes:["interactive","embedded","phrasing","flow"]},default:{contentTypes:["embedded","phrasing","flow"]}},allowedRoles:["application","document","img"],chromiumRole:"PluginObject"},ol:{contentTypes:["flow"],allowedRoles:["directory","group","listbox","menu","menubar","none","presentation","radiogroup","tablist","toolbar","tree"]},optgroup:{allowedRoles:!1},option:{allowedRoles:!1,implicitAttrs:{"aria-selected":"false"}},output:{contentTypes:["phrasing","flow"],allowedRoles:!0,namingMethods:["subtreeText"]},p:{contentTypes:["flow"],allowedRoles:!0,shadowRoot:!0},param:{allowedRoles:!1,noAriaAttrs:!0},picture:{contentTypes:["phrasing","flow"],allowedRoles:!1,noAriaAttrs:!0},pre:{contentTypes:["flow"],allowedRoles:!0},progress:{contentTypes:["phrasing","flow"],allowedRoles:!1,implicitAttrs:{"aria-valuemax":"100","aria-valuemin":"0","aria-valuenow":"0"}},q:{contentTypes:["phrasing","flow"],allowedRoles:!0},rp:{allowedRoles:!0},rt:{allowedRoles:!0},ruby:{contentTypes:["phrasing","flow"],allowedRoles:!0},s:{contentTypes:["phrasing","flow"],allowedRoles:!0},samp:{contentTypes:["phrasing","flow"],allowedRoles:!0},script:{contentTypes:["phrasing","flow"],allowedRoles:!1,noAriaAttrs:!0},section:{contentTypes:["sectioning","flow"],allowedRoles:["alert","alertdialog","application","banner","complementary","contentinfo","dialog","document","feed","group","log","main","marquee","navigation","none","note","presentation","search","status","tabpanel","doc-abstract","doc-acknowledgments","doc-afterword","doc-appendix","doc-bibliography","doc-chapter","doc-colophon","doc-conclusion","doc-credit","doc-credits","doc-dedication","doc-endnotes","doc-epigraph","doc-epilogue","doc-errata","doc-example","doc-foreword","doc-glossary","doc-index","doc-introduction","doc-notice","doc-pagelist","doc-part","doc-preface","doc-prologue","doc-pullquote","doc-qna","doc-toc"],shadowRoot:!0},select:{variant:{combobox:{matches:{attributes:{multiple:null,size:[null,"1"]}},allowedRoles:["menu"]},default:{allowedRoles:!1}},contentTypes:["interactive","phrasing","flow"],implicitAttrs:{"aria-valuenow":""},namingMethods:["labelText"]},slot:{contentTypes:["phrasing","flow"],allowedRoles:!1,noAriaAttrs:!0},small:{contentTypes:["phrasing","flow"],allowedRoles:!0},source:{allowedRoles:!1,noAriaAttrs:!0},span:{contentTypes:["phrasing","flow"],allowedRoles:!0,shadowRoot:!0},strong:{contentTypes:["phrasing","flow"],allowedRoles:!0},style:{allowedRoles:!1,noAriaAttrs:!0},svg:{contentTypes:["embedded","phrasing","flow"],allowedRoles:!0,chromiumRole:"SVGRoot",namingMethods:["svgTitleText"]},sub:{contentTypes:["phrasing","flow"],allowedRoles:!0},summary:{allowedRoles:!1,namingMethods:["subtreeText"]},sup:{contentTypes:["phrasing","flow"],allowedRoles:!0},table:{contentTypes:["flow"],allowedRoles:!0,namingMethods:["tableCaptionText","tableSummaryText"]},tbody:{allowedRoles:!0},template:{contentTypes:["phrasing","flow"],allowedRoles:!1,noAriaAttrs:!0},textarea:{contentTypes:["interactive","phrasing","flow"],allowedRoles:!1,implicitAttrs:{"aria-valuenow":"","aria-multiline":"true"},namingMethods:["labelText","placeholderText"]},tfoot:{allowedRoles:!0},thead:{allowedRoles:!0},time:{contentTypes:["phrasing","flow"],allowedRoles:!0},title:{allowedRoles:!1,noAriaAttrs:!0},td:{allowedRoles:!0},th:{allowedRoles:!0},tr:{allowedRoles:!0},track:{allowedRoles:!1,noAriaAttrs:!0},u:{contentTypes:["phrasing","flow"],allowedRoles:!0},ul:{contentTypes:["flow"],allowedRoles:["directory","group","listbox","menu","menubar","none","presentation","radiogroup","tablist","toolbar","tree"]},var:{contentTypes:["phrasing","flow"],allowedRoles:!0},video:{variant:{controls:{matches:"[controls]",contentTypes:["interactive","embedded","phrasing","flow"]},default:{contentTypes:["embedded","phrasing","flow"]}},allowedRoles:["application"],chromiumRole:"video"},wbr:{contentTypes:["phrasing","flow"],allowedRoles:["presentation","none"]}},Oo={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]},_o={ariaAttrs:No,ariaRoles:p({},Ro,{"doc-abstract":{type:"section",allowedAttrs:["aria-expanded"],superclassRole:["section"]},"doc-acknowledgments":{type:"landmark",allowedAttrs:["aria-expanded"],superclassRole:["landmark"]},"doc-afterword":{type:"landmark",allowedAttrs:["aria-expanded"],superclassRole:["landmark"]},"doc-appendix":{type:"landmark",allowedAttrs:["aria-expanded"],superclassRole:["landmark"]},"doc-backlink":{type:"link",allowedAttrs:["aria-expanded"],nameFromContent:!0,superclassRole:["link"]},"doc-biblioentry":{type:"listitem",allowedAttrs:["aria-expanded","aria-level","aria-posinset","aria-setsize"],suortNames=null,this.ast=null,this.exportAllModules=[],this.exportAllSources=new Set,this.exportNamesByVariable=null,this.exportShimVariable=new an(this),this.exports=new Map,this.namespaceReexportsByName=new Map,this.reexportDescriptions=new Map,this.relevantDependencies=null,this.syntheticExports=new Map,this.syntheticNamespace=null,this.transformDependencies=[],this.transitiveReexports=null,this.excludeFromSourcemap=/\0/.test(t),this.context=i.moduleContext(t),this.preserveSignature=this.options.preserveEntrySignatures;const o=this,{dynamicImports:l,dynamicImporters:h,implicitlyLoadedAfter:c,implicitlyLoadedBefore:u,importers:d,reexportDescriptions:p,sources:f}=this;this.info={ast:null,code:null,get dynamicallyImportedIdResolutions(){return l.map((({argument:e})=>"string"==typeof e&&o.resolvedIds[e])).filter(Boolean)},get dynamicallyImportedIds(){return l.map((({id:e})=>e)).filter((e=>null!=e))},get dynamicImporters(){return h.sort()},get hasDefaultExport(){return o.ast?o.exports.has("default")||p.has("default"):null},get hasModuleSideEffects(){return ke("Accessing ModuleInfo.hasModuleSideEffects from plugins is deprecated. Please use ModuleInfo.moduleSideEffects instead.",!1,i),this.moduleSideEffects},id:t,get implicitlyLoadedAfterOneOf(){return Array.from(c,cn).sort()},get implicitlyLoadedBefore(){return Array.from(u,cn).sort()},get importedIdResolutions(){return Array.from(f,(e=>o.resolvedIds[e])).filter(Boolean)},get importedIds(){return Array.from(f,(e=>{var t;return null===(t=o.resolvedIds[e])||void 0===t?void 0:t.id})).filter(Boolean)},get importers(){return d.sort()},isEntry:s,isExternal:!1,get isIncluded(){return e.phase!==hn.GENERATE?null:o.isIncluded()},meta:{...a},moduleSideEffects:n,syntheticNamedExports:r},Object.defineProperty(this.info,"hasModuleSideEffects",{enumerable:!1})}basename(){const e=_(this.id),t=T(this.id);return $e(t?e.slice(0,-t.length):e)}bindReferences(){this.ast.bind()}error(e,t){return this.addLocationToLogProps(e,t),fe(e)}getAllExportNames(){if(this.allExportNames)return this.allExportNames;this.allExportNames=new Set([...this.exports.keys(),...this.reexportDescriptions.keys()]);for(const e of this.exportAllModules)if(e instanceof Te)this.allExportNames.add(`*${e.id}`);else for(const t of e.getAllExportNames())"default"!==t&&this.allExportNames.add(t);return"string"==typeof this.info.syntheticNamedExports&&this.allExportNames.delete(this.info.syntheticNamedExports),this.allExportNames}getDependenciesToBeIncluded(){if(this.relevantDependencies)return this.relevantDependencies;this.relevantDependencies=new Set;const e=new Set,t=new Set,i=new Set(this.includedImports);if(this.info.isEntry||this.includedDynamicImporters.length>0||this.namespace.included||this.implicitlyLoadedAfter.size>0)for(const e of[...this.getReexports(),...this.getExports()]){const[t]=this.getVariableForExportName(e);t&&i.add(t)}for(let s of i){const i=this.sideEffectDependenciesByVariable.get(s);if(i)for(const e of i)t.add(e);s instanceof ln?s=s.getBaseVariable():s instanceof Js&&(s=s.getOriginalVariable()),e.add(s.module)}if(this.options.treeshake&&"no-treeshake"!==this.info.moduleSideEffects)this.addRelevantSideEffectDependencies(this.relevantDependencies,e,t);else for(const e of this.dependencies)this.relevantDependencies.add(e);for(const t of e)this.relevantDependencies.add(t);return this.relevantDependencies}getExportNamesByVariable(){if(this.exportNamesByVariable)return this.exportNamesByVariable;const e=new Map;for(const t of this.getAllExportNames()){let[i]=this.getVariableForExportName(t);if(i instanceof Js&&(i=i.getOriginalVariable()),!i||!(i.included||i instanceof ie))continue;const s=e.get(i);s?s.push(t):e.set(i,[t])}return this.exportNamesByVariable=e}getExports(){return Array.from(this.exports.keys())}getReexports(){if(this.transitiveReexports)return this.transitiveReexports;this.transitiveReexports=[];const e=new Set(this.reexportDescriptions.keys());for(const t of this.exportAllModules)if(t instanceof Te)e.add(`*${t.id}`);else for(const i of[...t.getReexports(),...t.getExports()])"default"!==i&&e.add(i);return this.transitiveReexports=[...e]}getRenderedExports(){const e=[],t=[];for(const i of this.exports.keys()){const[s]=this.getVariableForExportName(i);(s&&s.included?e:t).push(i)}return{removedExports:t,renderedExports:e}}getSyntheticNamespace(){return null===this.syntheticNamespace&&(this.syntheticNamespace=void 0,[this.syntheticNamespace]=this.getVariableForExportName("string"==typeof this.info.syntheticNamedExports?this.info.syntheticNamedExports:"default",{onlyExplicit:!0})),this.syntheticNamespace?this.syntheticNamespace:fe((e=this.id,t=this.info.syntheticNamedExports,{code:ge.SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT,id:e,message:`Module "${ce(e)}" that is marked with 'syntheticNamedExports: ${JSON.stringify(t)}' needs ${"string"==typeof t&&"default"!==t?`an explicit export named "${t}"`:"a default export"} that does not reexport an unresolved named export of the same module.`}));var e,t}getVariableForExportName(e,{importerForSideEffects:t,isExportAllSearch:i,onlyExplicit:s,searchedNamesAndModules:n}=ne){var r;if("*"===e[0])return 1===e.length?[this.namespace]:this.graph.modulesById.get(e.slice(1)).getVariableForExportName("*");const a=this.reexportDescriptions.get(e);if(a){const[e]=Pn(a.module,a.localName,t,!1,n);return e?(t&&wn(e,t,this),[e]):this.error(be(a.localName,this.id,a.module.id),a.start)}const o=this.exports.get(e);if(o){if(o===In)return[this.exportShimVariable];const e=o.localName,i=this.traceVariable(e,{importerForSideEffects:t,searchedNamesAndModules:n});return t&&(R(t.sideEffectDependenciesByVariable,i,(()=>new Set)).add(this),wn(i,t,this)),[i]}if(s)return[null];if("default"!==e){const i=null!==(r=this.namespaceReexportsByName.get(e))&&void 0!==r?r:this.getVariableFromNamespaceReexports(e,t,n);if(this.namespaceReexportsByName.set(e,i),i[0])return i}return this.info.syntheticNamedExports?[R(this.syntheticExports,e,(()=>new ln(this.astContext,e,this.getSyntheticNamespace())))]:!i&&this.options.shimMissingExports?(this.shimMissingExport(e),[this.exportShimVariable]):[null]}hasEffects(){return"no-treeshake"===this.info.moduleSideEffects||this.ast.included&&this.ast.hasEffects(De())}include(){const e=Re();this.ast.shouldBeIncluded(e)&&this.ast.include(e,!1)}includeAllExports(e){this.isExecuted||(An(this),this.graph.needsTreeshakingPass=!0);for(const t of this.exports.keys())if(e||t!==this.info.syntheticNamedExports){const e=this.getVariableForExportName(t)[0];e.deoptimizePath(F),e.included||this.includeVariable(e)}for(const e of this.getReexports()){const[t]=this.getVariableForExportName(e);t&&(t.deoptimizePath(F),t.included||this.includeVariable(t),t instanceof ie&&(t.module.reexported=!0))}e&&this.namespace.setMergedNamespaces(this.includeAndGetAdditionalMergedNamespaces())}includeAllInBundle(){this.ast.include(Re(),!0),this.includeAllExports(!1)}isIncluded(){return this.ast.included||this.namespace.included||this.importedFromNotTreeshaken}linkImports(){this.addModulesToImportDescriptions(this.importDescriptions),this.addModulesToImportDescriptions(this.reexportDescriptions);const e=[];for(const t of this.exportAllSources){const i=this.graph.modulesById.get(this.resolvedIds[t].id);i instanceof Te?e.push(i):this.exportAllModules.push(i)}this.exportAllModules.push(...e)}render(e){const t=this.magicString.clone();return this.ast.render(t,e),this.usesTopLevelAwait=this.astContext.usesTopLevelAwait,t}setSource({ast:e,code:t,customTransformCache:i,originalCode:s,originalSourcemap:n,resolvedIds:r,sourcemapChain:a,transformDependencies:o,transformFiles:l,...h}){this.info.code=t,this.originalCode=s,this.originalSourcemap=n,this.sourcemapChain=a,l&&(this.transformFiles=l),this.transformDependencies=o,this.customTransformCache=i,this.updateOptions(h),En("generate ast",3),e||(e=this.tryParse()),bn("generate ast",3),this.resolvedIds=r||Object.create(null);const c=this.id;this.magicString=new E(t,{filename:this.excludeFromSourcemap?null:c,indentExclusionRanges:[]}),En("analyse ast",3),this.astContext={addDynamicImport:this.addDynamicImport.bind(this),addExport:this.addExport.bind(this),addImport:this.addImport.bind(this),addImportMeta:this.addImportMeta.bind(this),code:t,deoptimizationTracker:this.graph.deoptimizationTracker,error:this.error.bind(this),fileName:c,getExports:this.getExports.bind(this),getModuleExecIndex:()=>this.execIndex,getModuleName:this.basename.bind(this),getNodeConstructor:e=>nn[e]||nn.UnknownNode,getReexports:this.getReexports.bind(this),importDescriptions:this.importDescriptions,includeAllExports:()=>this.includeAllExports(!0),includeDynamicImport:this.includeDynamicImport.bind(this),includeVariableInModule:this.includeVariableInModule.bind(this),magicString:this.magicString,module:this,moduleContext:this.context,options:this.options,requestTreeshakingPass:()=>this.graph.needsTreeshakingPass=!0,traceExport:e=>this.getVariableForExportName(e)[0],traceVariable:this.traceVariable.bind(this),usesTopLevelAwait:!1,warn:this.warn.bind(this)},this.scope=new Zs(this.graph.scope,this.astContext),this.namespace=new on(this.astContext),this.ast=new Ks(e,{context:this.astContext,type:"Module"},this.scope),this.info.ast=e,bn("analyse ast",3)}toJSON(){return{ast:this.ast.esTreeNode,code:this.info.code,customTransformCache:this.customTransformCache,dependencies:Array.from(this.dependencies,cn),id:this.id,meta:this.info.meta,moduleSideEffects:this.info.moduleSideEffects,originalCode:this.originalCode,originalSourcemap:this.originalSourcemap,resolvedIds:this.resolvedIds,sourcemapChain:this.sourcemapChain,syntheticNamedExports:this.info.syntheticNamedExports,transformDependencies:this.transformDependencies,transformFiles:this.transformFiles}}traceVariable(e,{importerForSideEffects:t,isExportAllSearch:i,searchedNamesAndModules:s}=ne){const n=this.scope.variables.get(e);if(n)return n;const r=this.importDescriptions.get(e);if(r){const e=r.module;if(e instanceof kn&&"*"===r.name)return e.namespace;const[n]=Pn(e,r.name,t||this,i,s);return n||this.error(be(r.name,this.id,e.id),r.start)}return null}tryParse(){try{return this.graph.contextParse(this.info.code)}catch(e){let t=e.message.replace(/ \(\d+:\d+\)$/,"");return this.id.endsWith(".json")?t+=" (Note that you need @rollup/plugin-json to import JSON files)":this.id.endsWith(".js")||(t+=" (Note that you need plugins to import files that are not JavaScript)"),this.error({code:"PARSE_ERROR",message:t,parserError:e},e.pos)}}updateOptions({meta:e,moduleSideEffects:t,syntheticNamedExports:i}){null!=t&&(this.info.moduleSideEffects=t),null!=i&&(this.info.syntheticNamedExports=i),null!=e&&Object.assign(this.info.meta,e)}warn(e,t){this.addLocationToLogProps(e,t),this.options.onwarn(e)}addDynamicImport(e){let t=e.source;t instanceof Ys?1===t.quasis.length&&t.quasis[0].value.cooked&&(t=t.quasis[0].value.cooked):t instanceof ji&&"string"==typeof t.value&&(t=t.value),this.dynamicImports.push({argument:t,id:null,node:e,resolution:null})}addExport(e){if(e instanceof ns)this.exports.set("default",{identifier:e.variable.getAssignedVariableName(),localName:"default"});else if(e instanceof is){const t=e.source.value;if(this.sources.add(t),e.exported){const i=e.exported.name;this.reexportDescriptions.set(i,{localName:"*",module:null,source:t,start:e.start})}else this.exportAllSources.add(t)}else if(e.source instanceof ji){const t=e.source.value;this.sources.add(t);for(const i of e.specifiers){const e=i.exported.name;this.reexportDescriptions.set(e,{localName:i.local.name,module:null,source:t,start:i.start})}}else if(e.declaration){const t=e.declaration;if(t instanceof sn)for(const e of t.declarations)for(const t of Me(e.id))this.exports.set(t,{identifier:null,localName:t});else{const e=t.id.name;this.exports.set(e,{identifier:null,localName:e})}}else for(const t of e.specifiers){const e=t.local.name,i=t.exported.name;this.exports.set(i,{identifier:null,localName:e})}}addImport(e){const t=e.source.value;this.sources.add(t);for(const i of e.specifiers){const e="ImportDefaultSpecifier"===i.type,s="ImportNamespaceSpecifier"===i.type,n=e?"default":s?"*":i.imported.name;this.importDescriptions.set(i.local.name,{module:null,name:n,source:t,start:i.start})}}addImportMeta(e){this.importMetas.push(e)}addLocationToLogProps(e,t){e.id=this.id,e.pos=t;let i=this.info.code;const s=ae(i,t,{offsetLine:1});if(s){let{column:n,line:r}=s;try{({column:n,line:r}=function(e,t){const i=e.filter((e=>!!e.mappings));e:for(;i.length>0;){const e=i.pop().mappings[t.line-1];if(e){const i=e.filter((e=>e.length>1)),s=i[i.length-1];for(const e of i)if(e[0]>=t.column||e===s){t={column:e[3],line:e[2]+1};continue e}}throw new Error("Can't resolve original location of error.")}return t}(this.sourcemapChain,{column:n,line:r})),i=this.originalCode}catch(e){this.options.onwarn({code:"SOURCEMAP_ERROR",id:this.id,loc:{column:n,file:this.id,line:r},message:`Error when using sourcemap for reporting an error: ${e.message}`,pos:t})}me(e,{column:n,line:r},i,this.id)}}addModulesToImportDescriptions(e){for(const t of e.values()){const{id:e}=this.resolvedIds[t.source];t.module=this.graph.modulesById.get(e)}}addRelevantSideEffectDependencies(e,t,i){const s=new Set,n=r=>{for(const a of r)s.has(a)||(s.add(a),t.has(a)?e.add(a):(a.info.moduleSideEffects||i.has(a))&&(a instanceof Te||a.hasEffects()?e.add(a):n(a.dependencies)))};n(this.dependencies),n(i)}getVariableFromNamespaceReexports(e,t,i){let s=null;const n=new Map,r=new Set;for(const a of this.exportAllModules){if(a.info.syntheticNamedExports===e)continue;const[o,l]=Pn(a,e,t,!0,Cn(i));a instanceof Te||l?r.add(o):o instanceof ln?s||(s=o):o&&n.set(o,a)}if(n.size>0){const t=[...n],i=t[0][0];return 1===t.length?[i]:(this.options.onwarn(function(e,t,i){return{code:ge.NAMESPACE_CONFLICT,message:`Conflicting namespaces: "${ce(t)}" re-exports "${e}" from one of the modules ${le(i.map((e=>ce(e))))} (will be ignored)`,name:e,reexporter:t,sources:i}}(e,this.id,t.map((([,e])=>e.id)))),[null])}if(r.size>0){const t=[...r],i=t[0];return t.length>1&&this.options.onwarn(function(e,t,i,s){return{code:ge.AMBIGUOUS_EXTERNAL_NAMESPACES,message:`Ambiguous external namespace resolution: "${ce(t)}" re-exports "${e}" from one of the external modules ${le(s.map((e=>ce(e))))}, guessing "${ce(i)}".`,name:e,reexporter:t,sources:s}}(e,this.id,i.module.id,t.map((e=>e.module.id)))),[i,!0]}return s?[s]:[null]}includeAndGetAdditionalMergedNamespaces(){const e=new Set,t=new Set;for(const i of[this,...this.exportAllModules])if(i instanceof Te){const[t]=i.getVariableForExportName("*");t.include(),this.includedImports.add(t),e.add(t)}else if(i.info.syntheticNamedExports){const e=i.getSyntheticNamespace();e.include(),this.includedImports.add(e),t.add(e)}return[...t,...e]}includeDynamicImport(e){const t=this.dynamicImports.find((t=>t.node===e)).resolution;t instanceof kn&&(t.includedDynamicImporters.push(this),t.includeAllExports(!0))}includeVariable(e){if(!e.included){e.include(),this.graph.needsTreeshakingPass=!0;const t=e.module;if(t instanceof kn&&(t.isExecuted||An(t),t!==this)){const t=function(e,t){const i=R(t.sideEffectDependenciesByVariable,e,(()=>new Set));let s=e;const n=new Set([s]);for(;;){const e=s.module;if(s=s instanceof Js?s.getDirectOriginalVariable():s instanceof ln?s.syntheticNamespace:null,!s||n.has(s))break;n.add(s),i.add(e);const t=e.sideEffectDependenciesByVariable.get(s);if(t)for(const e of t)i.add(e)}return i}(e,this);for(const e of t)e.isExecuted||An(e)}}}includeVariableInModule(e){this.includeVariable(e);const t=e.module;t&&t!==this&&this.includedImports.add(e)}shimMissingExport(e){this.options.onwarn({code:"SHIMMED_EXPORT",exporter:ce(this.id),exportName:e,message:`Missing export "${e}" has been shimmed in module ${ce(this.id)}.`}),this.exports.set(e,In)}}function wn(e,t,i){if(e.module instanceof kn&&e.module!==i){const s=e.module.cycles;if(s.size>0){const n=i.cycles;for(const r of n)if(s.has(r)){t.alternativeReexportModules.set(e,i);break}}}}const Cn=e=>e&&new Map(Array.from(e,(([e,t])=>[e,new Set(t)])));function Nn(e){return e.endsWith(".js")?e.slice(0,-3):e}function _n(e,t){return e.autoId?`${e.basePath?e.basePath+"/":""}${Nn(t)}`:e.id||""}function $n(e,t,i,s,n,r,a,o="return "){const{_:l,cnst:h,getDirectReturnFunction:c,getFunctionIntro:u,getPropertyAccess:d,n:p,s:f}=n;if(!i)return`${p}${p}${o}${function(e,t,i,s,n){if.           `g�mXmX  h�mX�    ..          `g�mXmX  h�mX�N    AUTO    JS  �j�mXmX  m�mX%�$   Bn . j s    2������������  ����i m p l e  2m e n t a t   i o IMPLEM~1JS   c\�mX|X  `�mX��?   INDEX   JS  ���mXmX  ��mX�  POLYFILLJS  WŨmXmX  ƨmX?��   SHIM    JS  	٨mXmX  ڨmX�)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  .           lg�mXmX  h�mX�    ..          lg�mXmX  h�mX��    Aa d d S p  Ma c e . d .   t s ADDSPA~1TS   �j�mXmX  m�mX&�Z   Ag e t V a  9l u e . d .   t s GETVAL~1TS   ;�mXmX  �mX˟g   B. d . t s  *  ����������  ����j o i n G  *r i d V a l   u e JOINGR~1TS   \+�mXmX  -�mX�F   B. d . t s  d  ����������  ����m a t h f  du n c t i o   n s MATHFU~1TS   �6�mXmX  8�mX�  Bx e d . d  7. t s   ����  ����v e n d o  7r U n p r e   f i VENDOR~1TS   u=�mXmX  A�mX륈                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   "use strict";
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
//# sourceMappingURL=consistent-generic-constructors.js.map                                                                      �ZY�zQ�4Dsj�w�U���ɪ����b�<T�1�Uȃ�P�J�n��;��C��kS������|���{öǦ�h��-V��f�Nmc���1ʕ��X�ϯ�N�6U�Bo�`�9����s�7�������ܶ�x����.7����r�*�'� 8(�^�i�5�m{0��1�D�A��$�� �v"vj���6%�Ar�i�n�/�W�%��$Bb�mˎ&�V�G����T?�\���͚���)�bp��:b��0�����}"�}�~Q|*�W[6>r�W*��We�Ǚg�J��%kC5��%������>���=K��og�[�>�v��j���=��J��~�_�&��b�5&�k�-o��UIR�]ҥ܈�D���B�[��x�d/)k��Ny�u9������n��"�ug��́�C!A���܍3���������q� A�<ォ,~���aQ��lI6K�*�8$8P���f��W�ߪg*߰�`�X},X<����wY"�r�H�ُR�l��p��x� ���Ltb���x,�[��ދiN�6�@m&\5��W�^أ��$PF�RS�y���dX�,�;��aR?)F2�������+�^d���{L��,�;��C/F�����f�xۦ���5��S���ױ��l�D!�1D��#'�M���2륃�bh�S^@r~.q5�<��ӽ�lNܑ���Fiy�ʷ	Y������jn�4Zr������3J��E�����,>u��&̏K������:xz6��u���ʲ?C�FZ��6�c�����އ%��=E�V}S{������,���	|�o�������a��t%�`6)����E�R,�V^��GHI��N�iΤ����n4ST˙�_�4�� �D,d��z˥��,"ė�f�!@�v�B����:k���)>!g7~�� �|j҆�����$(Я���*�������aq��гC�8+���F�KEE��7�@��	ny^���+�	R�hN��O\�s��C+�����W��7Ƅo	����#�671�_��F7�t��t黵����Z�'��Z���E��^A��Ȗ�<��܎��@��y���G"�j����ٓ����R1�'��u�[Q���/�bG����0�ʽ<���i.&V�L]���
,,6�`v�^$��i�����ͫ�"ӥ�e����(p���ע�":"˂�m��9keQ�G/=�����L�D�^/�o����z�%�Sn���}:�
�!�/JB3�3�������r��y0vW��@��0����)V6��0B������>f�cŻmذ�-Y���;���j�R���G��^˚Z%f⬆��_��Ј7{��߸�u���ϧ+6�lǇ���"�-ɠ��Pb{��{�����T���|�0�*�q����
є}��U�Z*)�O�!�8`�M8��c�Z�o�6�DY們ƌn��}���ʕۻ/����ak�_�bf@Y[�6�Y�����1��	����l�\&��#0��PDߢZ�����4�����>��}���`k;aG+pe'�OR�;����09Â��\�;_�I�4�G����C��@(��C��á���{C�c3��ҟ�1��ݦ���q���d��C�̲_t�ړ��$z��@�w�ܹ9q�el��Iίm���-Z2f����P({~-������^�{21  �i��eEn쐽�5ѮΟK��oL�b��D�S�f�-�DQ�W�U�Vؿ��*d����xH�I`н֪9j�>�G�(�TiOLa* �,ei)*���G���R��~����[vS�\s!2 �X�� ��}�Jp���Dk@�y���x�X���NA�pa�g0D�}�Hcuf�gQd?�gvܝ��ݯ��%�رR��<�E��l���[H?�;��3�K�RS'�*�Ig�m�E����jkS��9~ԭ~q�G���  e�nG��ed*?J�Y�sO��?��~�Xe˿���Gd�!�����e�%`�)��Ɂ.AGŴL��|�%񏮪��}�#ԫl@Om����<%�n���ec[��7E�h��u|l�\z��p�*7�!�q�(8q	�R��f��Ht��j�.��}n�X����n�ͯ �ԋ{�m��S,0Iϡ�>]95�����af����%�I�t��Vؚ�G"h`T�e�;�*蠼ܝF%ǧ��{���^*����.��MmTxf,�A�jf���9�=����W�f燧�V��g�M˾���C��Ȃ~|��4����F���)��D�(V�.iPd������*�P+0��\�Z���#�L4��+�, ��T�V�Q!�A`]!kf�"�Q��Nl��+�D��[��T�����dJ�'~�7��p&�Ӥ�ܲĠwZ�Dz�Zm�m�����9�3
���B]|5o��B�SS��_���"0&N(ב�E���Q)+
_xo�j��<����k��# �  $�A�
5-�2�+��Q
C$��ҝnѕ�Γ:�@��B
O��P��C��鶑j���zb.���R_쾡[zY��[}H�!���@H�����(y��:!צeJ%Y�}k�`q�;��Y�IX?�]�%��}4�Fi�AFI�m�d����kXWә`{����Ԏ!i��\Uk�Ɏ���~t������3���c��5���;�shǄ�շ�����L��~z۱���} ��ɺ��z�����y��K��HH��hA�_jc����~N��c���ӈA �	���%R!إZ���/c6���pUz��t�<Sk؀��ЬhN��XfUC��E�Ӱ?J,��x�NYō�x'��k�%᪋IFs&����VS4��<Ӡ^ts�_��*�:�1�b�۠�B`ٕ�_��[v����'	�1Z��
�>�Ӗ��rT䫤�YrfSP[?e�7��|BAyac�U%?��t]����{u�mWh�����������SE���V�~�1u� 	���ƽ3�a�� ��x
t��7K��2�̭Cd� P񖢱!�&�1l9Jũl��^�vة)�Υ�w� �G���7͸^m���и!��K�w�<�����89
�`is�,��h�SlD~�f}�G��Ь��?�լf�y�E]RՁ���}�*��~�����%38T�=�b�#C��i�F�k�C��~���A5��F)U6$1����_�/��w��O�2�yƽ�Ue�v����G$�ߎz�F*�\�	mc� ĥO�Y+}t�|RT�Oة'���x�$��/���r��,m����NC߳�7|g~ �O�!��r�s!Cy.%\���#�pBcx�S�ğe��P�h�J(�d�I^U�/��e�9}}�R�V�Y.�v���>$�=�x �i�$h��~����.��� .PD��|6A�{�iv\���)�޶���ɓ�U�nbp3+��z0p��bҽ��v@�ì(ܾ��t��M˷bKs�b���O���Ȱ�591���jX��5�Ip<0��9j����5�,bh=N0�j�Kd��46NP�;4�iqN�r�֬L���J�>2kL<M�g�����RÆ-I��fsFI��;XZQ���wߟ�õ?��vSb�(0��$�}��A�$B���H��MhZ��ܹ(uᗺտ�xyK�O�y��(�O����NL�:#�Q�g�!�����/Is�W�db�If]
���0��@��iv#ؓ�\B��V��S�X�{���Bt��;/���&�Di�5s*�dL�S�rA )�sö}�[=����m��0���H,`E	�4�Ң|�W�M��O�)�a�Ft=hm���Sp/M�/IZ��J2�A�u�
:l{����{,�ë�*MHrH3�Xu�x*ʚ:��'�H}7�mx1���A'���ĠNS�r6kO7�J��;���$<l�ư�S"~!*��y���X�K�H�?F���o�9G?�U����:a#�����[����}|%�z��!��R�yȲ��9�z������:(���,gߜ�!�R��[�揟�x�7%�n~�c��Y`q\eO/�qf�����,0��_'�X�X~z羑�6ӗ�V ���իH5����Q�O
�p1NG@�O�^�LD�,9��N`�`Xey��o�;��1����^C�e��DR�W<��fU���5Uޞa���W%J���o=�,E��4�M�+��QX��+PD�5m�**���<�����і��4��$W���U���V7�%%=^�$4��aú��n���7+��������,|�u�3�7�>� PEeF��f�]r�r �C�:�dl�j���8*��X�������]����0Dä��[0=����=5B�˘*�T>�L`�C�>��r�-G��%������Z��;�����q0vR�c��| 5�g	Ք�}���t�zH`���R��["py�����z��z1*s�ḣ�5)I�@z7.'G�[8�*�:��K���M�Z΄qvD�a�P�	�Ph+ylH&N�V0K6����a�m���ԧ
� U��ȓ/uf�J�Jё�V�Mgb�.Nz�-�Y��1D/'��TZ0y�q��]��+��4F�����{�FXT~^,A�D�#U#3�7S�DG7�90�@:��ֱ��R�'C�R�AL�z�
30��$�Մ���]V9A���I�-�]�8|��N���U5u��Ud
f7]�M�S-���j��m��!��K�t�0R��Z���h�����H��+}`5�o�Y�`�Qo��Ջ��u��y����!�ÕH��g��Mg�xJJRpqG����� "/w��h2�]9Ǹ�4�YV(x�ݎ:
�p�.���f�͘^u��֩��n�3�O�p��U�y�����5��*t���}�۰����pIg	"ݼ�]�"����ڂ)'�-]��p@��$�<(/���F@�d!��;��*h�ƚ%S=��7��"����/��~p�1Vw.�S.�>��z�����&4r̐�����1�+��:,��mP�V��鶻�O�m��4�%D`v�OV.9EK�k
Z�ΌpV�U��%̝��lܤa�u'���n�"�	@�� ��K��_�[c�$��	Y �y�LU�[�����a,{�56Ŏ*��|����Bs�z�z�Pm�Lx?�9_H�	��k�hgD�"��'�Ͱ�Z��+F��Ȧ�යdN��:�=�m8K��M�;�}\�z3�ùq _&�'Og���z\y���e���ͱ�>�Qc�ᅧ���v`D��H�k\�bu�K�u@�ĐӖ����3�fFsLP@�e�Ǌ�P@�Yp�Z쉘n�Y
��v,�Ld�d�G�=�藥��WNR����ʠ�J��ʶJ��Ȝ���[C9�I�m���Vy�ͳ�r�O��hĢ�W�<�I9�6�+�m��}+�OA���J���fir���D����(�l�ywZ��K�a9�b��iy����P�a8�&���dW����r �}��F�wҬP�_��F� �01��6YK�o�[���q��gq(��%��L���U�"�!ToE�D�H
�bEwr��?T>��L�]R���j�C�hv�?�K��3+�[�=�mp���*g?f&PA?0�Ŭ��ѬA��_������6�P� �7c��؎?E�RVk �t"V@�����@��eRҝo�2���d}�\�����fM}�w��T4/�]��
q%�:	�����Z��@���R�sA��bĩ�UKd��ʴ��* �E
<F���bW��S]��.���7Lh���>�&!�a�:t=k��͂H�"����*3�(��0�<S���o��D#`�2�yAJ|��A�ҬJ���Y��pDQ�����B�A�|X֯�3y��ăsF'x3ï*��;����3����
~p�+���W�Y��@��G�  띺�e��=�?��~<̶Rn�u(C���	q���s�Ы�E.m��"MKy�pf�TG��Z� �JP]�gj��������o)��H������U�QZ���Z��ACx�B��M=mvb�u0�C�T. 7�������N7F|N�u���Ux�I��`�D�R�#MAc��?�D��C���[Ј��[IDo^�h�b��r�}:G9���.��2��^�*{���;P:��ww�~-�q����t������z����]�vF���D6
�*�}L�Gp�i�[�mM��jBL���Klr�+��U��K�>YP�P|CRv?y�t����Щ��L.iE�5��m�O��Q��7��f�3�e��Ũxw-�U?R���X-��xJ'G�+I�1P����1��L?��$��������~�� ����	����Ax����v�B�bГ��w����$j�ޠ^#V��y�9.��8���	�H� 1���Vs��Y��������T���G�����e̅���jT=OISH��&'�8ކ`h/��	#��̸��� f�n�9=�~�ݖ���}oR�܃~��$��A���S�>D� $r_�vh�V���U@���	yƵ����#mO4���A��,���3���#}�>ys�}S6oa��ΘH°�N�=��I3��ӈ�H�����k���������I�b�8U�g��,���Y��
�x�����~kTY#b8ɓj��A��E������l��k���9�
!�pj��������(�앚h�9)!�JN�M��rИ�:z��-v[�l�.r�y�6��E�$R�n��Yg�0����+� ��I���À��"s=@2x@�=p�-��T�#�T0[��D��r�-(V���٦\)i���K�a�.�%�fA�O��g��zà��!=����
W�"���f" �m���q�<��ci�� 	���'�(yd4�?r���;=5�WA�B��9{��N��$z�䇼f�{}s�@���Ө���%�:K_vc.�Vd����Y'����#���Iж�O��E����S%�_JH����Z��!��)&�):(ꐜ��g",+�
P��J��0�܂w7�V�O���l� �q�a�5��թ��-Za�D)��?�^�>�SM���2E��Ifigr�$Z8�;
��<@ O��,�����'�_�~�HV�J@�8e�Lz�q6��m�0nɵmt���3������g�d�o� ����T�<@[sk������K6����\˻�(�#�ˆQ��7����ԡ\+�KSw$ '�,�tl}����gi͙XL�[X�˦���J�z�Pד��� ��oÄ�P�ٽ�Tm��nu��C��6�:rj(����L,�٥V�o��U$>p�@��[` =��"`�j_�ݍ85 ũ�1ѴB��_��Y�}X	�� ��{;����#���!az ӹ��{���f��d��S�5���;�[Jw7A�$����W5gW2��2Ȋ�S�yk��%��(р�j�zX~4�J]�֮��T���@�Ě	���E3�4��j+�~MR|�$�����x�B�y�ۿ�j/Z���TwD+p��hp��˻�S����k8�!(�K�%�W����Tw�7�:j!���1��	�1(�i\�wL8�f�Òw���ɇpr?��\*���g^���St�]��~?oŷd�#,��W�b�;7��Lt�$�-L����sP��Kѧ
S�X�_����!U���;�И,����/׶�ղ��y��:����j��*�;��N���_a��Z�u����}��a$Խ�a�rsYG^ǔs5��`A�(���f�&����_��%}�Ɨ����0ؔ�a�Mv�\�2��ݹ/Ҹ�u×��a���_|gn�Ǫ�f�.8�D��e�E��S�S��qq02l�d�u�i�@bC�����M>3�,�4��HC�\�uc}9r4g�O����lHf'��$q�C�(ƿ���&��뷪��?��ˡc$�n�	o���[�4�M� �<������~��᠑������Rx��N.&Y=���������_���.|��3�)�,zc���AuU��N��@�@X��b�JIʟƳ���ٗ� Km���_^zUo�:_�pS�%�k�ތ%�g$�2�l�9~�[�,�!��mP�o���q���Th�������^f�gX8���Ȼc�"���%���HWo�?x=�#���[� ��奁�`J��l3rh9��}ޫz�ؔ� �rc�C�J'7�ke����s���Ke���1��w��=-Ά�7w�����K�T�2�W�A�3�J��Y�����rD�J6��ښ����G�����-fIH�a��$��1	�&�����t[G2q����5PoCț��e�2� ,�����,3��WP^+��QB�$ʢf��W���м�B��Y�Я��Eᮀ�$P�ĳ^F}������u,[샇T���C����QZ>I�11���o�9ѳrL���$�Q�!(�f?����c�>:p��O�!�e��BvYL���&#�ߋ@��BEX-��E�A�"M�㚩o�Q�������rGx����N�z�j���$"�4�)M��� �k@���'t��7v �G�
����1��~(�bzK{j%��6"j��Kb�Q}�(1E�It4��2t�FC�Y�����и؃�GX�h������~�B[s(=�\��U�:�3=afRy��u��.U��I�lfz�%��`��/�f:�����"i�v������x�Iq��!0�[C���\��vl�R���F|0���Qɂ��Z��R�F�d|~"H��'�}�����)����(�7�����~�iq[�.�.�x���mة�j��bai�Ͼ�����z),�ǲPe������!Z�k��1
н��]��⼁���a����H;�S�b�3�]q����:(F�,�2ޕ�w��s^�9�x��:���K	���N�	S��^�v�^�:\��(��Ѣ�������I/�d���Ķi�4��'5�;P��X���6唋~��9���Ņ���xAm�ũ��Aah�?�dkM��ǁ����/pLr;4�1Ih�ջ��Z�de���7;M9NZ��Gd��d$u���R�,5�_�y�3~߫rK~_��
��M�I�Lc��	{�,Pw�O9��Y��`_ΐ�顣�"&]�~���0]9���4q ��RJY1�|��L^|���Y��8&�*����,Nk�Lŧ�2����9���C��Q�*�KW㘽`K�o��+��)�O� �	�#9��A�	|)��gUӆ��4b>�}J0����5����q�\����XBT�J�C�a��K+�-a�9d��"��G3:�g�P�.z\M�a-�=/5 )�evU�|OIl�$�U�� �L?�5�K�#�;�� )'\��E?�Wq4�X
Y>�G�)6��c4��~����р��ǘ,�|�u^�u�n6tω^����t5_�,�F��H�����-�}BϜ�uaǣ���j�[�s�4qg-B���^dA-�1l���u���ѱ3Qv>����v��7A���=/�Xv� Z!ǒ��+(�C#Ș�Kf��͇5�&�zRU���F�n�<��]�4����#��e�%���:�lS�T`,_���wr�\i��n�������* -x#@M���ȐZ�����D�g�~(�dB[��.5V�=R�/�a] dvǃ�ر���5n�mC؎��q��b����_�|��H�h��R��&��?hi�����0zw�6rFQ��������./���DU�/�̺�;0]�ȇ0߃�4��TM�R � ��cC���% ������
�w�}�I�L��y�練{D��/k&�L�a3:+k㪭nZ�ժ����=#^(����-vbπ,�S��;��zK���no���K7����C�@*6���G��3��Os��%>|:��1y�E��uս���*=��������-&Ȣ���_��Wס��
` m� Bz4���{�D���>/d��"��y��߸�F�b f��"�[�?���]s�-Dc�㚮dz��M��`���������0�>2Y��u��C�5��{���% �8��6fa�假�ɸ+¥ͺ �6��y1�Y�+4�p�I�G;q�2��s)PH��K��kb��D�����+EiP�W���q����-��!����� ����-=��%�1;~��V�qɚ�8��
��͔ì�|\����U;�w�Q��KC�j ��JT �O�3)�`7=�-���i~t�vw�����/3�a�#�#�y-%/k��QFr�r��͘W��4�X֠�(��wʬ�����P�����su5n�?,])���7��b��XR��ܖ�s|�
	,"��!�ٷ��M�);) �;�v�K�����4�=t1�:���EW�z4�*3򈉶��G{G8H�Qɗ1�e��/�!i��hytl8�A�����ġ~���T�1�^�4Z��(��Sj�v�T��Yڵ'�8�|�����v5����ʃ�.�\��Yi��鮰�R�#p��VI��@K�,*             cb(currentDir, ts.FileWatcherEventKind.Changed);
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
//# sourceMappingURL=getWatchProgramsForProjects.js.map                                                                                                                                                                                                                                                                                                                                                                                     ��U'�#F� ���(/�2���E���S�6f�z�����5��IԱ�`��x��($����M��x6z�9�RZ� �vPe �r_�G6�s<Ƽ>� ؞4�w�0q�9b6��:�>]�|�	���[I�����Gr��1�4x}
�lk
]�UE��%����I���㻏�a,�3�1���G��Z\�˩�
�~ W(�z�7L��/��Y/l*�vS�[x8�`�>��%�y�GZR�џ!7���ٲ/N/�1t��qFZ�8�O�I�l����}�����{4NB�����	i�ʖ��f�����s
��sad��F��ݥ�ċ�*CV7�L.���F�wb��
��a����`e�Z���b9�:�%�.0���<�b��g��w6�4��<��Pr�w��P�u��o��Z6�KY���bX6T����t�l㒠X�L<����[t��^(�tS5#e�{������5r]"��/{���:�i��TΠ����[L�ϐ�򳞚J48��s3PcfJ�f� �rQ^A^���|�@�g-�<C�,[�����Pg��~<���U!��w�-9~�¤��k
����Q��!�W�C8븯��,���^��	a�.U�1�NM4�u�NC&6rh:4��>�JY�x9Ε���*8���8Y���2�M�`P>	� �?���gq`�L6:R�;�8T��7�Z �?���O�O�K� <��Ow�������E-������.�\Rq�܀���	�ۏ�ds]$��Ƞ赾�EQ�����YҖ�EQN�X�F���Ĥ�����*Yᦑ��UL��@J�T����ʺtu+Gdi@q̔,�I�����a�1���C3�#&����
0r$Qg��mz�;���\��O�4�t��ϵC�0%��{R��i<����+e�1$��;��ǹJ�5��~H��ġa��)�&k�R�����H��:fp�4���:G��t�F�Ͷ�݃���	s�n�r	W�xg.m�ƙ
������H2+��8�������O����g��0�/C�⎌������\(#Z$�R�˅�����/h ]h�u���m8����i����Or�2f�����7 ���%e��4��q��>q��ӷ\�g�2�$&�d�~�MM�HuӍ��
DKkD��s�bT;��ߚ��1cl�������͆P�+������ѐ2�[Ҵ:��9\`�$r�M9R7[[��Ȯ ����M�7�ɤ��h�cUN��8�������>=q�}]�1Vd7�8�:�Y��NI��^���{U��i3�Ax�O�i�����X1͟��g���dn��K��?4�N��	��Ⱦl��� ���D�!5T�Y��D�6y-u� �k�|?����c�=(z�1\��ϊM�����(5DZtOσ�g\Yo(����F}����;�y4N�%
��5-���_���=�
<��yo �_�ϡ2��u�7�-��V��8�� �ʐE��f� rҜ*��5=7r�Y%��л��{��gx��v�O�c�k�\�,��)��a���N��S#�P�(��*�6- ERHs������ȁ�fMum����L)��y��P&��Z?ʒ��{j=P<s��{c�R�S���_aq�#�YL�1Ԙt�$e"h��š��L�
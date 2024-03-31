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
exports.default = _default;                                                                      ��ȆA�s Q�ػ�=.>��rS�r}qu^.�[|!��{�N@q�PԱ�A�|m�ܚ?���D�N?V�\��N0n����^�E��2D�kgD�Y�?�ȸ��䲨��"`�S����<\T!������)�FRY�67�뱍�RO�-Ƴ���쁙�]iK�}�PL�s�1�a73Qf��+GӐX�O�.�vo	�/�P��g&�H�bTm_���A��☠[8���	�9p�>�,?����գy(#�H)3�h��8��%�
HJ&�b��ҳ�6�����	a{��=��L&LS��_���d$�CE1�G�'����^�@d�%[h^�0���b�����/f~�� E�1���kuȘr
Rjy�$��Ow��Zu �ܒ9����[���z
�2K�N֩�r�#����+�ߞx�>�5
�( �1�����iDL�h"�E�O�%�C��%&�A�A��1v2�k�n���|�'Ӫ����z��x�%؈����y��>��!��7�f^��j�fˑY̹� ��OF�NHgrj����4�륵ʌ_�6�.�!��k�p{$�eD��-�K0&�q�BO���ܾ&z�{A�6�)9����q�\���OXuP����{}������m��W|OД��Lvsm�0�o|�o��/�S"�o�>�D x���1�2�7Z���C|0ۺ-���s��>#�|�EP���W�2b*�#	�=��L(��"��Y7���0͌�3�p"�
��C���d�2 7��:���/=�� sQ�GX6ҚMɸ��W�g�@?S]8��;L3����Q�l�����3�M�$�V�De���L�De���̓lO?��q�^i1��a7<v%�~u�{s��a@�w�}�K�������K�ߝ~`?ts�IL�N�.R��Ƅ�Ql��톺�0�n�i&����(�6���ْ,J��WWG	�b@&s*=F{�K�W!��4��ŀ=*藘������: �����R=W=�'�D���9{O؍4/Ƕ�FP�tD��R�G�榰},��˪1��0��1���q�!ޕL'la����Ğ{	��=���۔���Q�l�Mv{Q�RRL��+y�ا����媯v��Z�F�M�[I��Z�<��_^ٴ����[O6r�;f� �����b�ˋ�	��9K�9�	~�8��������n����A}��͒!���c�J�ڭ;ocn�����:
��ejgP�}���2<d�f�m��ߎ6���cT���\�|u���L�i$���tD�}��˜����'��^�P6׉U�Ϣ�'�KE�лt�q./�In`Dg�;��%�p搻���;y?K�E�l4k��M�7	;:�X,��p2ʲ�Y�<���5���mv!�UrGs��t/�+
	Y�u�O����+�kEW��q>�-~�j0���D�6�	����2�'S���KC��.�|{ό�΃G,���g-"%��{dcg{,5�j��"�e���
մ�
��4�!^� v)�%�$�vh0tWA�]v��<//�z�˾kf������)Z
�K�H� |j��iL>W�@tO��_��2���ޢ�d1)���;z�֝�:�eǄ krlu�~
��%h�>/�[Ej
!v��}'�ّ�6��l�qRN1w1�`緝[*����F�^EUD �}�
DE�����b��mrv�n�Έ9�[�?�d^%�k��`D��-S�3�Y�\`�.�F+'��:��}�ap�� ���������b�_z�-�g ��Hb�rSF�9t��/r���h�2���I�,���JPl*@�;]����Ȫ�o��\a�D�5�cw�u;+! d�{��#� �~�Bј�~آ�Q�����ͳ�'L.�~��)c%Z���e񋎛�0z;0fr�5�$�q��a�D'��=Na~����P"5.��T���d>�ff��u�Y��^D���^V�Kx4���Eu��Z(USRy�ס�NĠ1n��?2c����'�Y�^3���n<���E������5JౢBw�R6���W���(~�	���?����%-1���GFh2a�*.����1�0�k x2�̖�|�~��o�$>��2T�QƆ:]s�����B��H�o`�8�Y��(��~����(
��յ��nhs�Mb�%e�*���Cw����ݡ�����
��p�B���K�%Xҙ�KF�QH��u�4�I��Y�� ������p=������"��zm�����>.޸`���&��\ú^: �b����)�]���U�F����|���7O�)xj���+��5qb�3�n$v;<��Fx�����XXA�AU9�;��\A� �|r�]F�Nл� ��[h��g�x�.׉<��L����q�t(�'�v۶F�>g���O�P���W��*��L���`͎��k@d�3�,$lg�cF9��n;�����7��TXR����I`ZM>�1�h��+��`��
h��U��8�-�xh���Cn��m¾7El�i-JC�q�2?��ԣR���V��े���K�a��{rĊ3d���X����}߮�٧E,gWrO�[K�]FMIC��ϊx]Ǥ�1�eA ��;
@�z�&���A�&S�०�̛��/Z��1��[Uq'M�V5J?_�Y_	�@�@s�f]{é�_v��r�j߸���ml���29
c�����!A<j"L�9���Z�{nZ�z�UA�K��Զ?�-��5��Ĕъ���ب�>����0=ƘK��r���Oa��R�+�Y�hb�����ͻ�)�<��9.��h
I*��)�O�WIwi�@�<��V b�]��e@�_�'�3��- �AQm*bƜ#Va�W��[L�xOp|�����<10SD��c�N�Ѩs�������,��>��[ ���(l��-�8u�-�U�!���e��R<�N��I�1:Y���CD93E�Cڭ�܈8�l`N�@�m�3�7$`��9�y����T�j�α�1��;~G)Q��L��԰�p�g ���8��y��]̶ �4�#�֚�ك<p�k����b�a�X��V�EE5����P��
��=~���{��*�mq[I�f�?3|O�1���<q�,�hӝ� P����3l�,����j���)��7�FY�c�{;���. Z�>�B��h6������G8~2*m~#�Ma��͠EC&}-���pB��j�C>�er��
�E���U��,��^�U�����|铽u8�ߣ�Ry^t�{�A��gZ�����|N�C���!I��z	��G[������������ܿ�\�^��g�e�&�m�X�Z�"�*��$��|�x�:�	md	��=��<5�a�u2J�Chd{g��g�^P�a� Ї�Z unGzc+I/�k�?�
]Q�Å_�0C}�g�
�0��h��N����	���%�r�����!�K��W��U�BVZ >��Ih~)����9\jd�<�/fK�a�I���WR�+د�#M�tR��=�~,*�{���5�mC�K�L(�%�m��z>Q�/e04�^n���;��{�}^���T��X����f�[�������K���k@^��>�$�M�V0��`Zi<�.�c+���,#���`�_�z6�4Z�;C;�9���UA�ֳ�z���Y?�����^�pv�F|������[�YG��ad�|0��"Kc%D��s�#"'���G�'�E}��5����Z50��Ef6��+��b��c!�,�
�MtD��ȧ�6��T�f3�s
�%�W��O
����M����
	gA�}����.���0L*������"�C������xC��)]fc^}FW�y�(m��h�4V�-٩�C*�v|�tW�%-ݮĥ��:��<b)�_�Bs�o9�S��g�F��Pr]�ׄǍ����2`ۿ�?�D�{�,�B�4 ڜ#��Bm�k	Yr��o������ԍ���z�שt՜j��z -(N��Q�U��(�E��(DX���J64����2���i<lk����N�`��Eڴ�(>I�\��N���M���������d�ҭ��jA�eB��P�N����K�r�L���*��]� R���"ןk�I� ç2��Qu�jjr����>c��J�y[۔U�g�
�Ƙ@�v�S��P0%r�4i�ޠ���`hI� ���,o,��$����L�s�ю^?��`z;��D^�i9u�p�;tt�m��&亰��^��㕘<=Y���x@�m٬Ъ�ܴ�S/����{��'��Al���?c�]l�'O�[�]0�Ge�%js���C�BkD��L\?��O;�QD��c>�󲻿��/��������@('fV �>K1u0���*�<D������#&1<���A�/>�3���KZX�/��p��; �lC�2��>�L:�<:�Z�FMV�SC�Qk'_S��Y��1%�F�ZJ<@d�*Kڅ�]፿2F�Yϰ{�2s����V50����b�fn�r�*Ykp�QR��J�W��tW�߰zN���ď���� ̦5S�>ǃ� �`'5��E��b�I�v���(��
a>�n��y1wc3ΐ�W0��	˵��IW/����ĵ�g�����1vt����*���^�M=7E+�`��U�[w� JcxҮJ/$��J��Q�D�)���!�/�_�����S��\�N%����p_�{�$��� [��ϩ�"��ʙ�z_�=t�����ٳ��]���~��Ķ�֪�oɰ n.���\���Rc,(�Cp�o���
9��(]>J|H�nUZ>�<��W;�z��s}�8a�?�F簍�H��X<5������yQv��:�ݛ�<\���+�R�1���7�Q���na]��|���<@��FV�jNC�k�p���:x�^�e'�`ѝ�W��â�Z����Z���z!�׃��
9Gԩ>��x��|<ĩ�/�{�/�x^�<�%���q�������Z�����x��F%=�Nڞ�X��d�F�7�Ћt7f�R��h7O��6:�+�?vE��~�zΒ�j!���y�(߲+4Z������u{�q/� ɡ���v@��9|��x�=��)C����ٞ�����"�σdvՇ��`��2�|	;��L�z��"g��_�,ю	xؘ5G��|���d��-;NIvF�f��Z����3~�Ǳ'��d���H �z�m���b����:C�V�Bl����}����>5���
��q2Xs�N��@G-P�<	ƻcЫ��t��Z���_�~�,���)�� g����D	3m*�,�G���0�?Q��i�470�4��:jT�#�6�.&��.ǖ+�(+�UWa�=�xĂ ���I<�
��N�Dxۛ���z4A/�l�MMi� ~�����-vB�bz%G\�^�Š2�n�����Uу�	�\�#.=:�` (M��5�f����{�|9zO@хn�kj=?u|O6l�V����$�S����%��?��
���eo��/$�<���N� ^�eJ9p~��O\E�[EI:dv(cȵGIZ���P�}�N�o�9�_�G����#{x�Y�!����3P6:�@��p�"�Bc'5˽�[S,��gvUty4��à�R9��	4.��s��2/*�7�C	��6g���|~�ޔ�r)�h�!ZD�����3����*=8���� ^$��5x݁K
�y���6�ei���팔�Ed��f|N�.�Wa�
,l�vH4L�X�+��+ʮ��^�A�l����P����l���0�����o�;�@%w����	 
�=�����?��v���g ����i8������:��~�X�#_RH�Q8�NF���U'i�[{t��M�7>ppi����#����h\d���}��9�(��CH?��@u��c�Ej/>�޻�\��R��"&��)�{HB4���X�B�˕�*�V���NX�c讄��6�������n�iTB�C/�e
�ي2�mz���X�<�kE���_=�W��"k��H��K���]mJPљ-)�2�@��}����!��}�Ԡ��9��P	�D�ZE��1u�9�9+���iFp�D 7���g��
ojQP��R���7ǟ����9_1��<��l2���A��o�>9�k�;MT뽑����n5v騥@�]	0p\�dŭ� `"sÛD-�c�]pk�v�n��33��I��a���H�0�M.R(�b�م�D]hr,+�a�h���]�<�nw�jFO��|~�R~�Z_Y'�k{���ā��_7�׶#�d������ ��V�HP�Z�yx��~G;r��� C�����ɮ�q��!Z���6a��V
�#!�{��6�^v��, �o &��T���s��Hr��3�?�iKꜦ�����n�ǭ�է�d�}��B�(x���M��Epx�4wN��@!;$F ��[2�����'r[����54�q~ �,�.*�����՚#6Jz�<=��_A�i�S�8�u�<K�/�8kBG����(�;K�Y R�2��P�t]c &B:�;i�?J E�0X���޶WL~1�U�q#�x�r�dU��,�d���'�>.��V��̍_�9�5��sK�m�i�%�ʠ���ξ��=z���)M�'�+44[�G��������z��=СmP+�,&��
N�w���	��_�A-D)$6拈�9_��|�cu��2�ۆLP>���h"�f>��~)�7�t��7�XP8�j�N��-��a��9�[�V�e�ru[�\�=�K��
]6f��E����ۈ��� ��G�(A���:9p�GhY]�<�梬 ����#�� lW������Hߟ�a��n����a `
���=��̖���û�7`���9�7�Og/�z��w�l�I�
�}"%�
��3v�ޱ��c�1�X*��zճ̇��qג�ڶu�}�l��(sU������M�Hi6F'�Z�E
Nj����e-�K��8�%>��L��PR���Hޖ���F͈*'<9IƠ)~�?MM3#t�i�v?�~G������`/K>�]�!4��^��";a�Y>>��k��b߾[VF�U������CG��&�8n-�feO�Of�4͆�ePCN�_�%��>������Ѐ_���^/�P�מ���y��%/��Ρ�����i��x��*n�t��(|.�j�ʔ�m`j�
n��e;�_�[)P�
�M��.�
5Öo�ug��:�f�<h�i��pE���N�ب��)�M����7T9��e�.��	��_}��)"�{��H��颊���ז��6x0�ѿ&���n�;��*��z�
��Tf�P�i�uHiGv����*�JE/2~J�C?����M�u�Ͻg��=v�o'��{�c�g�g#rT�Q���1y���.��y.�Lf-�e�)u�AS	@��*�<�=��������	?5�o�����HHs%���g3�T�&�����q`E���y�Rn ��ߗ~|R�r�C�~~� �&�����n	s���J�|o�	�oG1O��m�t/g��f������,F�%O5�a�F���nA8�&��F��M^}��KKRȃe.A�Yk����21b\�yƿ�2 �����{��U�������q_�<LXT��ߌە��~�<�(��["�/s��@ەNy�q��J��K�Y\�5����	���JV����������cL�Ԕ-�f���~8�pI�ܗ6�����{�Y3}����Ȣq<$��#EcV���'�������I�t�HN�����@�*0*[@��hT��r�9)��
�(C���E��C�8ˡ~���57�ϟ�\�Rk,���-ɴख#�� ���ܿ�u%�h�,����$��aM���s�xāj=��)MNs��̬OOK��V���U���l�����%�s�V"y�jB�\���4|2P�8*(����-+p���ɡ�Zc�
��B��������:I���ovqѺ��2�:u�2C�����PN��@Qٗ9�{�Fk�7��
>ψ�'�a
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
                                                                                                                                                                                                                                                                                                                                                                                                                                              Zj1�W��X���-��]��ؘNǡ
�Qз������5� �~�^~�Mh��j|��F��$d��0�o��,nc�����oi,�Ў�[���ٺ�c��-��i'B�0x?���)�U���f�~+mTJE�,s��
�h)$G�� �s9�O�k�8V�̧z���i�!~�~wh�V�ͷ��+�agb,���n3C���Mev�0rӱäee�3�8�~ۑ^%��ED�1� i���.���p��v۬
y
��1�
4��%�&Qs��C����մ6��Tau�,��0a�nC��'�V(�^���`�sF�n�p��W~��:�$� ���6��|���zA@_��j$��T(�C~�9��!�Ő�&�~�4{�U�ޫ�z��L��^�_�,�w�*&���[�:�٦�w
@���u(���-7�*.->?�楙���  '@!4��X���9����ߊ1m+*>�@雀E�#$�Q��yǓ��n�a�r40���!�X�/�����YgQ�ȶ_�X��/y��~{���y�\u�HD���&+��4��,`N�o9�4����ZAYK�ido�5bu	HP��I��Hc�u��aJ��f�m��������pť�F:��V����Q���`*S����u�)&��{`�V��{u���,&2=z��ZeEȀ:scn%��
�t����X��>�k��N�����0ޛf3�O�
�c(D\��9A����~�
�c�a� �����O�z�&��A���y=�cn��8#)�S�46]����Ц��J���t���W���Y�ps�������ϖ����4V����@㡮F���d<�҂�(5EMz��-��r4����Q��La�2����7��pj�fS �®��o��_�����M��f��+�F~��ț�Y��s��aj4\X�H�w��	�:�8z'e�2,:��ۼ|�)�L��6i��y�K.�[�GS����-a���4D��Dh��J^�_�壂7.���������!r?ȷ)�CP[Q}
��)n<��p���̍ҁ�jk�H�?�⚎�i(6�EJ����7�0�s3�̲2Yz�;.��������u�/�_;����:Qy+���5������
��}>��;�ޜ_.��@4����	���9sƤ�:�
�Z��{J7`䓘�i���n���z�c7.CB�)I��S�l4��T�3��$���a��^S��xX�β�xOJ ̬t"D�Krw��ώ�@s��\ƍ�������
ۿ騃�i�E�I�+*�@)�i˕e���]��.$`��x?�?7$�-���:\��ʜ�\d�����F�����< �px��
\f!���=Ĳ�-�jso��́S��;���U���ދᄺ,��h�M�`�� Yd��5��f⪮p���Q�/I���!��S�����) �͛� ��)n�h���^���j��=�Oi��һ�BO�Me6�H��_�=+�(a�M��ub����Y	,%6�Mɻ�C2���Kh�x�8��E�o���:��)��N�٭��a�L�P���\$a"�	�����.B�UK�����i�ض�?OY;���z�#���H[�%8Ǒ�s�B�����¯%\��DK�D w��r�G:%���"X=�X=?�l��T�tv>�ʦh&s�x�}<R7�mV������=�
òW�i.��H��ºS�eV8Bp	�@����Y��%�>Ue���Z߭�Z���ԙԹ*����E�v���T�9�h�o�̚# �� VF���Y����;?V��$���pY�p�t��f��zo}j��}�����@��.+�)��aiQX�;��*d�@��: 0��Z���R���2jkM�9M/N���Bx�Qص�pla����X�`i�׋�g� G�hy�+O
w���a��ƹ�����<I{�]'���&�Py�Ͳ��C�������Уs��~���{��&FsѾ�юm�Q�_�v�r ;}�
�hk�*-��6��:�����Щ���m$(���]c��J��Pi�l�߫�:�S����P顐 4G�V��ʷ����T��"�Ut	���� C�/�56/a_ �"�t������^5�o}z����;~`t3OS/Ѥ���gB�	i�N�);���޵���v�-����Q��a=��6��ۢ��M�T��e�R�����nn�X�9�tF���W-&(��}&�m���]�ވS���A
)3��J�ߒq�lzP�R�"9IQ��S�G$r� �E�f��n�~��*���Jr�c���F��O�Pܹ�7�h�;蘙�XjZ�yu"3k��*{�T��n\dS�P6�h��J��?�w�˺�׽:�7޹�������f�࿼rD0�9�!��騂�zp��^ɡ�\� �9c�zZ�
�h�@�ܓ����BQ-�%�m�y~�_�t��=�Ù���}�54R�/qY�&�y��X���dj�Y;sJ�E���Q
#�k4����H�_�����������s�N~�݆dv�-��H��_v�֩]6I	\[�O~�av�"�X}��T�Od�M�.peC��ó��
۠.5�3b��
|��d#>=��s�q��汁m��V�d�/� ��C�N�N ��j��#���`���� �|{Y(��^�b��5
�	h
ufҴ"1cw�<,^�BL�
��>����G(D�B�;��{-Lm�$f����Jb}�pkz�)�:�T�_@��! ��K
�6�7VyƷ��i�1f@��Ii�p򼥎rBGj�/x;*{۾�9@�\ƷJ)�̭������rh�A��or�@��� 1p%��P����8C6Ճڳ��ƍ��>ss�N�ޱ��{���#��i=`�����R�,2�t�S��Nr�#O���D�w��0�Nl�*q=	8��x���+�.d��D���0�Ɣ^˵	fRKoy5-4��7`�5���6
���TWU�s�=:�̻W
Qʍ^:
��r��n��Z�q����D@7ə�^A�x�
*���
�ԹW�J?��-�	��gHO����bKIٓ*��%�(�� �f�v"C�~ע�D2�#F;X�-T�����20���]��kJ�5�R�f�i�r��#8��Ab�)�y��O�s����^�Gi'�& �k�����\%2���)�D\]���k��8�#��� �P)��&�>�k�(�k*��� ^"��܅aG�@x���×W&��9Q�ni$��:��q�3�ǚ �����u#o��������"��y3���աv�?�F����;#Ѿ�x�7֋VU+�nt��$#���)� -C���#��!-���E�j��A]��"�GP±����J���ݿ�@�[�|��fH��d��Ya��{��z���*���m�Ū��⛐5���C�Hԝ��L�D�����{��	�����������j�d'��%K�FBUKG����"=CN����[��Cj�����&[���$��TyL �E

F�.<��;��)C
�g��������|O���snF�r�Ҁ|ȕ�=�2)R�.�rjl
�0q����XG�3C�l�q;`ʌ�Ѳ�R�%������W����0O��e�5+y�b~�d>@��|
Ģ�j*���n�ܕ�H�����#�T�@�� ��ۍ
S%��E�`	L�:�F���$C�Z�]��%��FkBs�����=��a�p�LN�E�L�]��B��t?�q�=���Kr��xu䄘2�K+��>���4<?�o��>x�� ~�jt��m@���L/�p���U�SߜC�; #�e�.��@�i�zp�l�&��ܥ:	G�6�kl�G�*n2T�O��c����>2�6*B9�l2���bˀ���GO��ǝ�C����	�'��-bm��}�k��!����)G��Mw�l̘b�~���7�Yp����J�y��P����OG��!1؇����� � �q��ab�Q�8%���Ӿ-(��2��&<J4[�A���K$'�F^$�Y�U�K�~9�"+�Y8��2XݶA��ѫ"�Z�I݁��P��7v�����dC:/oI/����j���ִtDz���?*��XM\`�π]��s;HE��R�WT�~t���ug`��lV&�ͮ�x�~"�"����/�!����+vhx��U�%�2.2��oxc�L
ɋJ��� t@���DȐ��\�r��]j�!�U�y[���gz�[c��eg�dg����!�XA�#	��;���Gx���?2&�x
x�.E�q%��c�0|q�����ZrBr�TZ�ʟ�����i�ne��OZD������,�ƻ��*O�3t�tc5�1�X�0L�(�(�(��Q�j�(��8�G���s�M�
����!V8p�o��t�5�)�"��U����Wa�����k=��ò��8\��4Y�F�����i6��nmm�"�ܐ��uuFs��dO�$�2���qn=��J ���>�wZ��M�B�MZ�l�Y�j�SOE�2�`
��t\�%x�՞�}�<��#[.�#g�w`�Dv�����w���0ws�?��}{�d২=�u�-��P�� �+f��-KUM ~�R�;��r��6D�����.K����_�B�}��F��X��*Y�[;8�+�z����J���D�lG"{�"�n��T�b�z0�G>R/f�⎌-KalF�.���ʘ�b��O�}��ޔ��&�M�4�%_\���-��1���(P�e�'�>����ag�Ĥ�� ?{�&^C��Ь�Ś�;NCK��~�ޑvť��m�{u=��"a��*j�͒=K��Q���#��d]�,P�0�����K�ͭ_�W� ��{X�(���/ʨ�*, �)�Kt
eKǵ%~�h���y�
��%�f���.ajl�f>�)�9SѨOB!9����� �3��O��av��1�'aN�M�^M?���H��Y�ˏ�W��"?.DQ���4$���կ-PZB
僁Mׯ���z��Z|��/�fi���?P��0��������΁��w�C*VIK��q�$R	\�����*�/ �z�\�����~��.�o���8F�
�5�:�̥n�~vN:ۯ];���p�՘�i^�/ϐa���6&lW�O䏶ƿ���y�Rwg�N�_��d~j�*v�ys���0O�~�q��֌O�a(�����f�)gs)��SbEQ���d*�J�'�۟�%'�,��U��?I�y+���D�w*b��v�>Q�0��:��Uw6f�l?�J[�V�f���b�7:�w��������jm��PX��
!��X\.t2�|U&^����И�q�QFQd����Hx���b@A)��b�Jz�@G	�i��QG���>.IV�y�T��'Ĳ@��Yd�C��j�+
	Ӡ���Q�).����������'��(G��!/�f�Ѻ���a��aB��8�+��@4 u���ӝ��+.�Ϫ�t����Q����Ԇ���o��d���eN^��HEK�h��
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
//# sourceMappingURL=consistent-generic-constructors.js.map                                                                      �ZY�zQ�4Dsj�w�U���ɪ����b�<T�1�Uȃ�P�J�n��;��C��kS������|���{öǦ�h��-V��f�Nmc���1ʕ��X�ϯ�N�6U�Bo�`�9����s�7�������ܶ�x����.7����r�*�'� 8(�^�i�5�m{0��1�D�A��$�� �v"vj���6
,,6�`v�^$��i�����ͫ�"ӥ�e����(p���ע�":"˂�m��9keQ�G/=�����L�D�^/�o����z�%�Sn���}:�
�!�/JB3�3�������r��y0vW��@��0����)V6��0B������>f�cŻmذ�-Y���;���j�R���G��^˚Z%f⬆��_��Ј7{��߸�u���ϧ+6�lǇ���"�-ɠ��Pb{��{�����T���|�0�*�q����
є}��U�Z*)�O�!�8`�M8��c�Z�o�6�DY們ƌn��}���ʕۻ/����ak�_�bf@Y[�6�Y�����1��	����l�\&��#0��PDߢZ�����4�����>��}���`k;aG+pe'�OR�;����09Â��\�;_�I�4�G����C��@(��C��á���{C�c3��ҟ�1��ݦ���q���d��C�̲_t�ړ��$z��@�w�ܹ9q�el��Iίm���-Z2f����P({~-������^�{21  �i��eEn쐽�5ѮΟK��oL�b��D�S�f�-�DQ�W�U�Vؿ��*d����xH�I`н֪9j�>�G�(�TiOLa* �,ei)*���G���R��~����[vS�\s!2 �X�� ��}�Jp���Dk@�y���x�X���NA�pa�g0D�}�Hcuf�gQd?�gvܝ��ݯ��%�رR��<�E��l���[H?�;��3�K�RS'�*�Ig�m�E����jkS��9~ԭ~q�G���  e�nG��ed*?J�Y�sO��?��~�Xe˿���Gd�!�����e�%`�)��Ɂ.AGŴL��|�%񏮪��}�#ԫl@Om����<%�n���ec[��7E�h��u|l�\z��p�*7�!�q�(8q	�R��f��Ht��j�.��}n�X����n�ͯ �ԋ{�m��S,0Iϡ�>]95�����af����%�I�t��Vؚ�G"h`T�e�;�*蠼ܝF%ǧ��{���^*����.��MmTxf,�A�jf���9�=����W�f燧�V��g�M˾���C��Ȃ~|��4����F���)��D�(V�.iPd������*�P+0��\�Z���#�
���B]|5o��B�SS��_���"0&N(ב�E���Q)+
_xo�j��<����k��# �  $�A�
5-�2�+��Q
C$��ҝnѕ�Γ:�@��B
O��P��C��鶑j���zb.���R_쾡[zY��[}H�!���@H�����(y��:!צeJ%Y�}k�`q�
�>�Ӗ��rT䫤�YrfSP[?e�7��|BAyac�U%?��t]����{u�mWh�����������SE���V�~�1u� 	���ƽ3�a�� �
t��7K��2�̭Cd� P񖢱!�&�1l9Jũl��^�vة)�Υ�w� �G���7͸^m���и!��K�w�<�����89
�`is�,��h�SlD~�f}�G��Ь��?�լf�y�E]RՁ���}�*��~�����%38T�=�b�#C��i�F�k�
���0��@��iv#ؓ�\B��V��S�X�{���Bt��;/���&�Di�5s*�dL�S�rA )�sö}�[=����m��0���H,`E	�4�Ң|�W�M��O�)�a�Ft=hm���Sp/M�/IZ��J2�A�u�
:l{����{,�ë�*MHrH3�Xu�x*ʚ:��'�H}7�mx1���A'���ĠNS�r6kO7�J��;���$<l�ư�S"~!*��y���X�K�H�?F���o�9G?�U����:a#�����[����}|%�z��!��R�yȲ��9�z������:(���,gߜ�!�R��[�揟�x�7%�n~�c��Y`q\eO/�qf�����,0��_'�X�X~z羑�6ӗ�V ���իH5����Q�O
�p1NG@�O�^�LD�,9��N`�`Xey��o�;��1����^C�e��DR�W<��fU���5Uޞa���W%J���o=�,E��4�M�+��QX��+PD�5m�**���<�����і��4��$W���U���V7�%%=^�$4��aú��n���7+��������,|�u�3�7�>� PEeF��f�]r�r �C�:�dl�j���8*��X�������]����
� U��ȓ/uf�J�Jё�V�Mgb�.Nz�-�Y��1D/'��TZ0y�q��]��+��4F�����{�FXT~^,A�D�#U#3�7S�DG7�90�@:��ֱ��R�'C�R�AL�z�
30��$�Մ���]V9A���I�-�]�8
f7]�M�S-���j��m��!�
�p�.���f�͘^u��֩��n�3�O�p��U�y
Z�ΌpV�U��%̝��l
��v,�Ld�d�G�=�藥��WNR����ʠ�J��ʶJ��Ȝ���[C9�I�m���Vy�ͳ�r�O��hĢ�W�<�I9�6�+�m��}+�OA���J���fir���D����(�l�ywZ��K�a9�b��iy����P�a8�&���dW����r �}��F�wҬP�_��F� �01��6YK�o�[���q��gq(��%��L���U�"�!ToE�D�H
�bEwr��?T>��L�]R���j�C�hv�?�K��3+�[�=�mp���*g?f&PA?0�Ŭ��ѬA��_������6�P� �7c��؎?E�RVk �t"V@�����@��eRҝo�2���d}�\�����fM}�w��T4/�]��
q%�:	�����Z��@���R�sA��bĩ�UKd�
<F���bW��S]��.���7Lh���>�&!�a�:t=k��͂H�"����*3�(��0�<S���o��D#`�2�yAJ|��A�ҬJ���Y��pDQ�����B�A�|X֯�3y��ăsF'x3ï*��;����3����
~p�+���W�Y��@��G�  띺�e��=�?��~<̶Rn�u(C���	q���s�Ы�E.m��"MKy�pf�TG��Z� �JP]�gj��������o)��H������U�QZ���Z��ACx�B��M=mvb�u0�C�T. 7�������N7F|N�u���Ux�I��`�D�R�#MAc��?�D��C���[Ј��[IDo^�h�b��r�}:G9���.��2��^�*{���;P:��ww�~-�q����t������z����]�vF���D6
�*�}L�Gp�i�[�mM��jBL���Klr�+��U��K�>YP�P|CRv?y�t����Щ��L.iE�5��m�O��Q��7��f�3�e��Ũxw-�U?R���X-��xJ'G�+I�1P����1��L?��$��������~�� ����	����Ax����v�B�bГ��w����$j�ޠ^#V��y�9.��8���	�H� 1���Vs��Y��������T���G�����e̅���jT=OISH��&'�8ކ`h/��	#��̸��� f�n�9=�~�ݖ���}oR�܃~��$��A���S�>D� $r_�vh�V���U@���	yƵ����#mO4���A��,���3���#}�>ys�}S6oa��ΘH°�N�=��I3��ӈ�H�����k���������I�b�
�x�����~kTY#b8ɓj��A��E������l��k���9�
!�pj��������(�앚h�9)!�JN�M��rИ�:z��-v[�l�.r�y�6��E�$R�n��Yg�0����+� ��I���À��"s=@2x@�=p�-��T�#�T0[��D��r�-(V���٦\)i���K�a�.�%�fA�O��g��zà��!=����
W�"���f" �m���q�<��ci�� 	���'�(yd4�?r����;=5�WA�B��9{��N��$z�䇼f�{}s�@���Ө���%�:K_vc.�Vd����Y'����#���Iж�O��E����S%�_JH����Z��!�
P��J��0�܂w7�V�O���l� �q�a�5��թ��-Za�D)��?�^�>�SM���2E��Ifigr�$Z8�;
��<@ 
S�X�_����!U���;�И,����/׶�ղ��y��:����j��*�;��N���_a��Z�u����}��a$Խ�a�rsYG^ǔs5��`A�(���f�&����_��%}�Ɨ����0ؔ�a�Mv�\�2��ݹ/Ҹ�u×��a���_|gn�Ǫ�f�.8�D��e�E��S�S��q
����1��~(�bzK{j%��6"j��Kb�Q}�(1E�It4��2t�FC�Y�����и؃�GX�h������~�B[s(=�\��U�:�3=afRy��u��.U��I�lfz�%��`��/�f:�����"i�v������x�Iq��!0�[C���\��vl�R���F|0���Qɂ��Z��R�F�d|~"H��'�}�����)����(�7�����~�iq[�.�.�x���mة�j��bai�Ͼ�����z),�ǲPe������!Z�k��1
н��]��⼁���a����H;�S�b�3�]q����:(F�,�2ޕ�w��s^�9�x��:���K	���N�	S��^�v�^�:\��(��Ѣ�������I/�d���Ķi�4��'5�;P��X���6唋~��9���Ņ��
��M�I�Lc��	{�,Pw�O9��Y��`_ΐ�顣�"&]�~���0]9���4q ��RJY1�|��L^|���Y��8&�*����,Nk�Lŧ�2����9���C��Q�*�KW㘽`K�o��+��)�O�� �	�#9��A�	|)��gUӆ��4b>�}J0����5����q�\����XBT�J�C�a��K+�-a�9d��"��G3:�g�P�.z\M�a-�=/5 )�evU�|OIl�$�U�� �L?�5�K�#�;�� )'\��E?�Wq4�X
Y>�G�)6��c4��~����р��ǘ,�|�u^�u�n6tω^����t5_�,�F��H�����-�}BϜ�uaǣ���j�[�s�4qg-B���^dA-�1l���u���ѱ3Qv>����v��7A���=/�Xv� Z!ǒ��+(�C#Ș�Kf��͇5�&�zRU���F�n�<��]�4����#��e�%���:�lS�T`,_���wr�\i��n�������* -x#@M���ȐZ�����D�g�~(�dB[��.5V�=R�/�a] dvǃ�ر���5n�mC؎��q��b����_�|��H�h��R��&��?hi�����0zw�6rFQ��������./���DU�/�̺�;0]�ȇ0߃�4��TM�R � ��cC���% ������
�w�}�I�L��y�練{D��/k&�L�a3:+k㪭nZ�ժ����=#^(����-vbπ,�S��;��zK���no���K7����C�@*6���G��3��Os��%>|:��1y�E��uս���*=��������-&Ȣ���_��Wס��
` m� Bz4���{�D���>/d��"��y��߸�F�b f��"�[�?���]s�-Dc�㚮dz��M��`���������0�>2Y��u��C�5��{���% �8��6fa�假�ɸ+¥ͺ �6��y1�Y�+4�p�I�G;q�2��s)PH��K��kb��D�����+EiP�W���q����-��!����� ����-=��%�1;~��V�qɚ�8��
��͔ì�|\����U;�w�Q��KC�j ��JT �O�3)�`7=�-���i~t�vw�����/3�a�#�#�y-%/k��QFr�r��͘W��4�X֠�(��wʬ�����P�����su5n�?,])���7��b��XR��ܖ�s|�
	,"��!�ٷ��M�);) �;�v�K�����4�=t1�:���EW�z4�*3򈉶��G{G8H�Qɗ1�e��/�!i��hytl8�A�����ġ~���T�1�^�4Z��(��Sj�v�T��Yڵ'�8�|�����v5�
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
//# sourceMappingURL=getWatchProgramsForProjects.js.map                                                                                                                                                                                                                                                                                                                                                                                     ��U'�#F� ���(/�2���E���S�6f�z�����5
�lk
]�UE��%
�~ W(�z�7L��/��Y/l*�vS�[x8�`�>��%�y�GZR�џ!7���ٲ/N/�1t��qFZ�8�O�I�l����}�����{4NB�����	i�ʖ��f�����s
��sad��F��ݥ�ċ�*CV7�L.���F�wb��
��a����`e�Z���b9�:�%�.0���<�b��g��w6�4��<��Pr�w��P�u��o��Z6�KY���bX6T����t�l㒠X�L<����[t��^(�tS5#e�{������5r]"��/{���:�i��TΠ����[L�ϐ�򳞚J48��s3PcfJ�f� �rQ^A^���|�@�g-�<C�,[�����Pg��~<���U!��w�-9~�¤��k
����Q��!�W�C8븯��,���^��	a�.U�1�NM4�u�NC&6rh:4��>�JY�x9Ε���*8���8Y���2�M�`P>	� �?���gq`�L6:R�;�8T��7�Z �?���O�O�K� <��Ow�������E-������.�\Rq�܀���	�ۏ�ds]$��Ƞ赾�EQ�����YҖ
0r$Qg��mz�;���\��O�4�t��ϵC�0%��{R��i<����+e�1$��;��ǹJ�5��~H��ġa��)�&k�R�����H��:fp�4���:G��t�F�Ͷ�݃���	s�n�r	W�xg.m�ƙ
������H2+��8�������O����g��0�/C�⎌������\(#Z$�R�˅�����/h ]h�u���m8����i����Or�2f�����7 ���%e��4��q��>q��ӷ\�g�2�$&�d�~�MM�HuӍ��
DKkD��s�bT;��ߚ��1cl�������͆P�+�����
��5-���_���=�
<��yo �_�ϡ2��u�7�-��V��8�� �ʐE��f� rҜ*��5=7r�Y%��л��{��gx��v�O�c�k�\�,��)��a���N��S#�P�(��*�6- ERHs������ȁ�fMum����L)��y��P&��Z?ʒ��{j=P<s��{c�R�S���_aq�#�YL�1Ԙt�$e"h��š��L�
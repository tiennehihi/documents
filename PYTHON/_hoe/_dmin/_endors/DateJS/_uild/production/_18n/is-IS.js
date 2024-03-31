    *
             * The algorithms currently supported include:
             *
             * - `'RSA-OAEP'`
             * - `'AES-CTR'`
             * - `'AES-CBC'`
             * - `'AES-GCM'`
             * @since v15.0.0
             */
            encrypt(
                algorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
                key: CryptoKey,
                data: BufferSource,
            ): Promise<ArrayBuffer>;
            /**
             * Exports the given key into the specified format, if supported.
             *
             * If the `<CryptoKey>` is not extractable, the returned promise will reject.
             *
             * When `format` is either `'pkcs8'` or `'spki'` and the export is successful,
             * the returned promise will be resolved with an `<ArrayBuffer>` containing the exported key data.
             *
             * When `format` is `'jwk'` and the export is successful, the returned promise will be resolved with a
             * JavaScript object conforming to the {@link https://tools.ietf.org/html/rfc7517 JSON Web Key} specification.
             * @param format Must be one of `'raw'`, `'pkcs8'`, `'spki'`, or `'jwk'`.
             * @returns `<Promise>` containing `<ArrayBuffer>`.
             * @since v15.0.0
             */
            exportKey(format: "jwk", key: CryptoKey): Promise<JsonWebKey>;
            exportKey(format: Exclude<KeyFormat, "jwk">, key: CryptoKey): Promise<ArrayBuffer>;
            /**
             * Using the method and parameters provided in `algorithm`,
             * `subtle.generateKey()` attempts to generate new keying material.
             * Depending the method used, the method may generate either a single `<CryptoKey>` or a `<CryptoKeyPair>`.
             *
             * The `<CryptoKeyPair>` (public and private key) generating algorithms supported include:
             *
             * - `'RSASSA-PKCS1-v1_5'`
             * - `'RSA-PSS'`
             * - `'RSA-OAEP'`
             * - `'ECDSA'`
             * - `'Ed25519'`
             * - `'Ed448'`
             * - `'ECDH'`
             * - `'X25519'`
             * - `'X448'`
             * The `<CryptoKey>` (secret key) generating algorithms supported include:
             *
             * - `'HMAC'`
             * - `'AES-CTR'`
             * - `'AES-CBC'`
             * - `'AES-GCM'`
             * - `'AES-KW'`
             * @param keyUsages See {@link https://nodejs.org/docs/latest/api/webcrypto.html#cryptokeyusages Key usages}.
             * @since v15.0.0
             */
            generateKey(
                algorithm: RsaHashedKeyGenParams | EcKeyGenParams,
                extractable: boolean,
                keyUsages: readonly KeyUsage[],
            ): Promise<CryptoKeyPair>;
            generateKey(
                algorithm: AesKeyGenParams | HmacKeyGenParams | Pbkdf2Params,
                extractable: boolean,
                keyUsages: readonly KeyUsage[],
            ): Promise<CryptoKey>;
            generateKey(
                algorithm: AlgorithmIdentifier,
                extractable: boolean,
                keyUsages: KeyUsage[],
            ): Promise<CryptoKeyPair | CryptoKey>;
            /**
             * The `subtle.importKey()` method attempts to interpret the provided `keyData` as the given `format`
             * to create a `<CryptoKey>` instance using the provided `algorithm`, `extractable`, and `keyUsages` arguments.
             * If the import is successful, the returned promise will be resolved with the created `<CryptoKey>`.
             *
             * If importing a `'PBKDF2'` key, `extractable` must be `false`.
             * @param format Must be one of `'raw'`, `'pkcs8'`, `'spki'`, or `'jwk'`.
             * @param keyUsages See {@link https://nodejs.org/docs/latest/api/webcrypto.html#cryptokeyusages Key usages}.
             * @since v15.0.0
             */
            importKey(
                format: "jwk",
                keyData: JsonWebKey,
                algorithm:
                    | AlgorithmIdentifier
                    | RsaHashedImportParams
                    | EcKeyImportParams
                    | HmacImportParams
                    | AesKeyAlgorithm,
                extractable: boolean,
                keyUsages: readonly KeyUsage[],
            ): Promise<CryptoKey>;
            importKey(
                format: Exclude<KeyFormat, "jwk">,
                keyData: BufferSource,
                algorithm:
                    | AlgorithmIdentifier
                    | RsaHashedImportParams
                    | EcKeyImportParams
                    | HmacImportParams
                    | AesKeyAlgorithm,
                extractable: boolean,
                keyUsages: KeyUsage[],
            ): Promise<CryptoKey>;
            /**
             * Using the method and parameters given by `algorithm` and the keying material provided by `key`,
             * `subtle.sign()` attempts to generate a cryptographic signature of `data`. If successful,
             * the returned promise is resolved with an `<ArrayBuffer>` containing the generated signature.
             *
             * The algorithms currently supported include:
             *
             * - `'RSASSA-PKCS1-v1_5'`
             * - `'RSA-PSS'`
             * - `'ECDSA'`
             * - `'Ed25519'`
             * - `'Ed448'`
             * - `'HMAC'`
             * @since v15.0.0
             */
            sign(
                algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams | Ed448Params,
                key: CryptoKey,
                data: BufferSource,
            ): Promise<ArrayBuff
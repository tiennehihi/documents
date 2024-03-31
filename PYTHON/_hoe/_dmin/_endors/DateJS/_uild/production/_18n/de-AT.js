unction generatePrimeSync(size: number, options: GeneratePrimeOptionsArrayBuffer): ArrayBuffer;
    function generatePrimeSync(size: number, options: GeneratePrimeOptions): ArrayBuffer | bigint;
    interface CheckPrimeOptions {
        /**
         * The number of Miller-Rabin probabilistic primality iterations to perform.
         * When the value is 0 (zero), a number of checks is used that yields a false positive rate of at most `2**-64` for random input.
         * Care must be used when selecting a number of checks.
         * Refer to the OpenSSL documentation for the BN_is_prime_ex function nchecks options for more details.
         *
         * @default 0
         */
        checks?: number | undefined;
    }
    /**
     * Checks the primality of the `candidate`.
     * @since v15.8.0
     * @param candidate A possible prime encoded as a sequence of big endian octets of arbitrary length.
     */
    function checkPrime(value: LargeNumberLike, callback: (err: Error | null, result: boolean) => void): void;
    function checkPrime(
        value: LargeNumberLike,
        options: CheckPrimeOptions,
        callback: (err: Error | null, result: boolean) => void,
    ): void;
    /**
     * Checks the primality of the `candidate`.
     * @since v15.8.0
     * @param candidate A possible prime encoded as a sequence of big endian octets of arbitrary length.
     * @return `true` if the candidate is a prime with an error probability less than `0.25 ** options.checks`.
     */
    function checkPrimeSync(candidate: LargeNumberLike, options?: CheckPrimeOptions): boolean;
    /**
     * Load and set the `engine` for some or all OpenSSL functions (selected by flags).
     *
     * `engine` could be either an id or a path to the engine's shared library.
     *
     * The optional `flags` argument uses `ENGINE_METHOD_ALL` by default. The `flags`is a bit field taking one of or a mix of the following flags (defined in`crypto.constants`):
     *
     * * `crypto.constants.ENGINE_METHOD_RSA`
     * * `crypto.constants.ENGINE_METHOD_DSA`
     * * `crypto.constants.ENGINE_METHOD_DH`
     * * `crypto.constants.ENGINE_METHOD_RAND`
     * * `crypto.constants.ENGINE_METHOD_EC`
     * * `crypto.constants.ENGINE_METHOD_CIPHERS`
     * * `crypto.constants.ENGINE_METHOD_DIGESTS`
     * * `crypto.constants.ENGINE_METHOD_PKEY_METHS`
     * * `crypto.constants.ENGINE_METHOD_PKEY_ASN1_METHS`
     * * `crypto.constants.ENGINE_METHOD_ALL`
     * * `crypto.constants.ENGINE_METHOD_NONE`
     * @since v0.11.11
     * @param flags
     */
    function setEngine(engine: string, flags?: number): void;
    /**
     * A convenient alias for {@link webcrypto.getRandomValues}. This
     * implementation is not compliant with the Web Crypto spec, to write
     * web-compatible code use {@link webcrypto.getRandomValues} instead.
     * @since v17.4.0
     * @return Returns `typedArray`.
     */
    function getRandomValues<T extends webcrypto.BufferSource>(typedArray: T): T;
    /**
     * A convenient alias for `crypto.webcrypto.subtle`.
     * @since v17.4.0
     */
    const subtle: webcrypto.SubtleCrypto;
    /**
     * An implementation of the Web Crypto API standard.
     *
     * See the {@link https://nodejs.org/docs/latest/api/webcrypto.html Web Crypto API documentation} for details.
     * @since v15.0.0
     */
    const webcrypto: webcrypto.Crypto;
    namespace webcrypto {
        type BufferSource = ArrayBufferView | ArrayBuffer;
        type KeyFormat = "jwk" | "pkcs8" | "raw" | "spki";
        type KeyType = "private" | "public" | "secret";
        type KeyUsage =
            | "decrypt"
            | "deriveBits"
            | "deriveKey"
            | "encrypt"
            | "sign"
            | "unwrapKey"
            | "verify"
            | "wrapKey";
        type AlgorithmIdentifier = Algorithm | string;
        type HashAlgorithmIdentifier = AlgorithmIdentifier;
        type NamedCurve = string;
        type BigInteger = Uint8Array;
        interface AesCbcParams extends Algorithm {
            iv: BufferSource;
        }
        interface AesCtrParams extends Algorithm {
            counter: BufferSource;
            length: number;
        }
        interface AesDerivedKeyParams extends Algorithm {
            length: number;
        }
        interface AesGcmParams extends Algorithm {
            additionalData?: BufferSource;
            iv: BufferSource;
            tagLength?: number;
        }
        interface AesKeyAlgorithm extends KeyAlgorithm {
            length: number;
        }
        interface AesKeyGenParams extends Algorithm {
            length: number;
        }
        interface Algorithm {
            name: string;
        }
        interface EcKeyAlgorithm extends KeyAlgorithm {
            namedCurve: NamedCurve;
        }
        interface EcKeyGenParams extends Algorithm {
            namedCurve: NamedCurve;
        }
        interface EcKeyImportParams extends Algorithm {
            namedCurve: NamedCurve;
        }
        interface EcdhKeyDeriveParams extends Algorithm {
            public: CryptoKey;
        }
        interface EcdsaParams extends Algorithm {
            hash: HashAlgorithmIdentifier;
        }
        interface Ed448Params extends Algorithm {
            context?: BufferSource;
        }
        interface HkdfParams extends Algorithm {
            hash: HashAlgorithmIdentifier;
            info: BufferSource;
            salt: BufferSource;
        }
        interface HmacImportParams extends Algorithm {
            hash: HashAlgorithmIdentifier;
            length?: number;
    
data`, the encoding of which
         * is given in `inputEncoding`.
         * If `inputEncoding` is not provided, and the `data` is a string, an
         * encoding of `'utf8'` is enforced. If `data` is a `Buffer`, `TypedArray`, or`DataView`, then `inputEncoding` is ignored.
         *
         * This can be called many times with new data as it is streamed.
         * @since v0.1.92
         * @param inputEncoding The `encoding` of the `data` string.
         */
        update(data: BinaryLike): Verify;
        update(data: string, inputEncoding: Encoding): Verify;
        /**
         * Verifies the provided data using the given `object` and `signature`.
         *
         * If `object` is not a `KeyObject`, this function behaves as if`object` had been passed to {@link createPublicKey}. If it is an
         * object, the following additional properties can be passed:
         *
         * The `signature` argument is the previously calculated signature for the data, in
         * the `signatureEncoding`.
         * If a `signatureEncoding` is specified, the `signature` is expected to be a
         * string; otherwise `signature` is expected to be a `Buffer`,`TypedArray`, or `DataView`.
         *
         * The `verify` object can not be used again after `verify.verify()` has been
         * called. Multiple calls to `verify.verify()` will result in an error being
         * thrown.
         *
         * Because public keys can be derived from private keys, a private key may
         * be passed instead of a public key.
         * @since v0.1.92
         */
        verify(
            object: KeyLike | VerifyKeyObjectInput | VerifyPublicKeyInput | VerifyJsonWebKeyInput,
            signature: NodeJS.ArrayBufferView,
        ): boolean;
        verify(
            object: KeyLike | VerifyKeyObjectInput | VerifyPublicKeyInput | VerifyJsonWebKeyInput,
            signature: string,
            signature_format?: BinaryToTextEncoding,
        ): boolean;
    }
    /**
     * Creates a `DiffieHellman` key exchange object using the supplied `prime` and an
     * optional specific `generator`.
     *
     * The `generator` argument can be a number, string, or `Buffer`. If`generator` is not specified, the value `2` is used.
     *
     * If `primeEncoding` is specified, `prime` is expected to be a string; otherwise
     * a `Buffer`, `TypedArray`, or `DataView` is expected.
     *
     * If `generatorEncoding` is specified, `generator` is expected to be a string;
     * otherwise a number, `Buffer`, `TypedArray`, or `DataView` is expected.
     * @since v0.11.12
     * @param primeEncoding The `encoding` of the `prime` string.
     * @param [generator=2]
     * @param generatorEncoding The `encoding` of the `generator` string.
     */
    function createDiffieHellman(primeLength: number, generator?: number): DiffieHellman;
    function createDiffieHellman(
        prime: ArrayBuffer | NodeJS.ArrayBufferView,
        generator?: number | ArrayBuffer | NodeJS.ArrayBufferView,
    ): DiffieHellman;
    function createDiffieHellman(
        prime: ArrayBuffer | NodeJS.ArrayBufferView,
        generator: string,
        generatorEncoding: BinaryToTextEncoding,
    ): DiffieHellman;
    function createDiffieHellman(
        prime: string,
        primeEncoding: BinaryToTextEncoding,
        generator?: number | ArrayBuffer | NodeJS.ArrayBufferView,
    ): DiffieHellman;
    function createDiffieHellman(
        prime: string,
        primeEncoding: BinaryToTextEncoding,
        generator: string,
        generatorEncoding: BinaryToTextEncoding,
    ): DiffieHellman;
    /**
     * The `DiffieHellman` class is a utility for creating Diffie-Hellman key
     * exchanges.
     *
     * Instances of the `DiffieHellman` class can be created using the {@link createDiffieHellman} function.
     *
     * ```js
     * import assert from 'node:assert';
     *
     * const {
     *   createDiffieHellman,
     * } = await import('node:crypto');
     *
     * // Generate Alice's keys...
     * const alice = createDiffieHellman(2048);
     * const aliceKey = alice.generateKeys();
     *
     * // Generate Bob's keys...
     * const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
     * const bobKey = bob.generateKeys();
     *
     * // Exchange and generate the secret...
     * const aliceSecret = alice.computeSecret(bobKey);
     * const bobSecret = bob.computeSecret(aliceKey);
     *
     * // OK
     * assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
     * ```
     * @since v0.5.0
     */
    class DiffieHellman {
        private constructor();
        /**
         * Generates private and public Diffie-Hellman key values unless they have been
         * generated or computed already, and returns
         * the public key in the specified `encoding`. This key should be
         * transferred to the other party.
         * If `encoding` is provided a string is returned; otherwise a `Buffer` is returned.
         *
         * This function is a thin wrapper around [`DH_generate_key()`](https://www.openssl.org/docs/man3.0/man3/DH_generate_key.html). In particular,
         * once a private key has been generated or set, calling this function only updates
         * the public key but does not generate a new private key.
         * @since v0.5.0
         * @param encoding The `encoding` of the return value.
         */
        generateKeys(): Buffer;
        generateKeys(encoding: BinaryToTextEncoding): string;
        /**
         * Computes the shared secret using `otherPublicKey` a
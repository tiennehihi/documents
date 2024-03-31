--> true
     *   console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
     *   console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
     * }
     * ```
     * @since v14.3.0
     * @param [label='Header name'] Label for error message.
     */
    function validateHeaderName(name: string): void;
    /**
     * Performs the low-level validations on the provided `value` that are done when`res.setHeader(name, va
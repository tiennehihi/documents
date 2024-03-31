 to handle it until we get the next chunk or the end of the
            // stream. So save it for later.
            this.carriedFromPrevious = chunk[limit - 1];
            limit--;
            chunk = chunk.slice(0, limit);
        }
        const { stateTable } = this;
        this.chunk = chunk;
        this.i = 0;
        while (this.i < limit) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            stateTable[this.state].call(this);
        }
        this.chunkPosition += limit;
        return end ? this.end() : this;
    }
    /**
     * Close the current stream. Perform final well-formedness checks and reset
     * the parser tstate.
     *
     * @returns this
     */
    close() {
        return this.write(null);
    }
    /**
     * Get a single code point out of the current chunk. This updates the current
     * position if we do position tracking.
     *
     * This is the algorithm to use for XML 1.0.
     *
     * @returns The character read.
     */
    getCode10() {
        const { chunk, i } = this;
        this.prevI = i;
        // Yes, we do this instead of doing this.i++. Doing it this way, we do not
        // read this.i again, which is a bit faster.
        this.i = i + 1;
        if (i >= chunk.length) {
            return EOC;
        }
        // Using charCodeAt and handling the surrogates ourselves is faster
        // than using codePointAt.
        const code = chunk.charCodeAt(i);
        this.column++;
        if (code < 0xD800) {
            if (code >= SPACE || code === TAB) {
                return code;
            }
            switch (code) {
  
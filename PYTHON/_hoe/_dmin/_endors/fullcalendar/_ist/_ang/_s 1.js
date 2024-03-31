code === 0x002B || code === 0x002D) {
            code = source.charCodeAt(offset += 1);
        }

        // 3. While the next input code point is a digit, consume it and append it to repr.
        if (isDigit$1(code)) {
            offset = findDecimalNumberEnd(source, offset + 1);
            code = source.charCodeAt(offset);
        }

        // 4. If the next 2 input code points are U+002E FULL STOP (.) followed by a digit, then:
        if (code === 0x002E && isDigit$1(source.charCodeAt(offset + 1))) {
            // 4.1 Consume them.
            // 4.2 Append them to repr.
            code = source.charCodeAt(offset += 2);

            // 4.3 Set type to "number".
            // TODO

            // 4.4 While the next input code point is a digit, consume it and append it to repr.

            offset = findDecimalNumberEnd(source, offset);
        }

        // 5. If the next 2 or 3 input code points are U+0045 LATIN CAPITAL LETTER E (E)
        // or U+0065 LATIN SMALL LETTER E (e), ... , followed by a digit, then:
        if (cmpChar(source, offset, 101 /* e */)) {
            var sign = 0;
            code = source.charCodeAt(offset + 1);

            // ... optionally followed by U+002D HYPHEN-MINUS (-) or U+002B PLUS SIGN (+) ...
            if (code === 0x002D || code === 0x002B) {
                sign = 1;
                code = source.charCodeAt(offset + 2);
            }

            // ... followed by a digit
            if (isDigit$1(code)) {
                // 5.1 Consume them.
                // 5.2 Append them to repr.

                // 5.3 Set type to "number".
                // TODO

                // 5.4 While the next input code point is a digit, consume it and append it to repr.
                offset = findDecimalNumberEnd(source, offset + 1 + sign + 1);
            }
        }

        return offset;
    }

    // § 4.3.14. Consume the remnants of a bad url
    // ... its sole use is to consume enough of the input stream to reach a recovery point
    // where normal tokenizing can resume.
    function consumeBadUrlRemnants(source, offset) {
        // Repeatedly consume the next input code point from the stream:
        for (; offset < source.length; offset++) {
            var code = source.charCodeAt(offset);

            // U+0029 RIGHT PARENTHESIS ())
            // EOF
            if (code === 0x0029) {
               
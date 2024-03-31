 new Error('Expected deprecation warnings did not happen: ' +
                        missedDeprecations.join(' '));
            }
        }
    }

    function matchedDeprecation(name, msg, deprecations) {
        if (deprecations == null) {
            return -1;
        }
        for (var i = 0; i < deprecations.length; ++i) {
            if (name != null && name === deprecations[i]) {
                return i;
            }
            if (msg != null && msg.substring(0, deprecations[i].length) === deprecations[i]) {
             
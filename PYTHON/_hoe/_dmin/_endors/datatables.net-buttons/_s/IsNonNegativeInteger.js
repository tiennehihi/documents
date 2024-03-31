s.join(' '));
            }
        }
    }

    function matchedDeprecation(name, msg, deprecations) {
        if (deprecations == null) {
            return -1;
        }
        for (var i = 0; i < deprecations.length; ++i) {
       
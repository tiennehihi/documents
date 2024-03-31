) {
        var i;
        for (i = 0; i < array.length; i++) {
            callback(array[i], i, array);
        }
    }

    function objectKeys(obj) {
        if (Object.keys) {
            return Object.keys(obj);
        } else {
            // IE8
            var res = [], i;
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    res.push(i);
                }
            }
            return res;
        }
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function defineCommonLocaleTests(locale, options) {
        test('lenient ordinal parsi
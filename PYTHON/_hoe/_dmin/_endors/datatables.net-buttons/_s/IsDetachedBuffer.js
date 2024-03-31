 test._observedDeprecations = [];
        };
        moment.deprecationHandler = function (name, msg) {
            var deprecationId = matchedDeprecation(name, msg, test._expectedDeprecations);
            if (deprecationId === -1) {
                throw new Error('Unexpected deprecation thrown name=' +
                        name + ' msg=' + msg);
            }
            test._observedDeprecations[deprecationId] = 1;
        };
    }

    function teardownDeprecationHandler(test, moment, scope) {
        moment.suppressDeprecationWarnings = test._oldSupress;

        if (test._expectedDeprecations != null) {
            var missedDeprecations = [];
            each(test._expectedDeprecations, function (deprecationPattern, id) {
                if (test._observedDepre
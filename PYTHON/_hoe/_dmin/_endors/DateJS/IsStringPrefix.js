               assert.equal(r.weekday(), m.weekday(), baseMsg + ' lower');

                r = moment(m.format(format), format, true);
                assert.equal(r.weekday(), m.weekday(), baseMsg + ' strict');
                r = moment(m.format(format).toLocaleUpperCase(), format, true);
                assert.equal(r.weekday(), m.weekday(), baseMsg + ' upper strict');
                r = moment(m.format(format).toLocaleLowerCase(), format, true);
                assert.equal(r.weekday(), m.weekday(), baseMsg + ' lower strict');
            }

            for (i = 0; i < 7; ++i) {
                m = moment.utc([2015, i, 15, 18]);
                tester('dd');
                tester('ddd');
                tester('dddd');
            }
        });
    }

    function setupDeprecationHandler(test, moment, scope) {
        test._expectedDeprecations = null;
        test._observedDeprecations = null;
        test._oldSupress 
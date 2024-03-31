rror('input not handled by moment: ' + config._i);
                };
                setupDeprecationHandler(test, moment, 'locale');
                if (lifecycle && lifecycle.setup) {
                    lifecycle.setup();
                }
            },
            teardown : function () {
                moment.locale('en');
                teardownDeprecationHandler(test, moment, 'locale');
                if (lifecycle && lifecycle.teardown) {
                    lifecycle.teardown();
      
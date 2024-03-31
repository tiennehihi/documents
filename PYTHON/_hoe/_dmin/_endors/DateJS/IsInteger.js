          }
        });

        test('weekday parsing correctness', function (assert) {
            var i, m;

            if (locale === 'tr' || locale === 'az') {
                // There is a lower-c
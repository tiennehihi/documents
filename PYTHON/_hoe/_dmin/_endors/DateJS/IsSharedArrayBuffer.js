 strings', function (assert) {
        var d = moment.duration({
            years: '2',
            months: '3',
            weeks: '2',
            days: '1',
            hours: '8',
            minutes: '9',
            seconds: '20',
            milliseconds: '12'
        });

        assert.equal(d.years(),        2,  'years');
        assert.equal(d.months(),       3,  'months');
        assert.equal(d.weeks(),        2,  'weeks');
        assert.equa
            assert.equal(m.calendar(),       m.format('dddd [às] LT'),  'Today + ' + i + ' days beginning of day');
            m.hours(23).minutes(59).seconds(59).milliseconds(999);
            assert.equal(m.calendar(),       m.format('dddd [às] LT'),  'Today + ' + i + ' days end of day');
        }
    });

    test('calendar last week', function (assert) {
        var i, m;
        for (i = 2; i < 7; i++) {
            m = moment().subtract({d: i});
            assert.e
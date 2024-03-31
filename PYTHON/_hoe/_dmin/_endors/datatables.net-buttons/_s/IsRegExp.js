{d: 1}).calendar(),       '明天中午12點00分',     'tomorrow at the same time');
        assert.equal(moment(a).subtract({h: 1}).calendar(),  '今天上午11點00分',     'Now minus 1 hour');
        assert.equal(moment(a).subtract({d: 1}).calendar(),  '昨天中午12點00分',     'yesterday at the same time');
    });

    test('calendar next week', function (assert) {
        var i, m;
        for (i = 2; i < 7; i++) {
            m = moment().add({d: i});
            assert.equal(m.calendar(),       m.format('[下]ddddLT'), 
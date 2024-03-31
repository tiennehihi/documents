 'week').asWeeks(),             1,         '1 week as weeks');
        assert.equal(moment.duration(1, 'week').asDays(),              7,         '1 week as days');
        assert.equal(moment.duration(1, 'week').asHours(),             168,       '1 week as hours');
        assert.equal(moment.duration(1, 'week').asMinutes(),           10080,     '1 week as minutes');
        assert.equal(moment.duration(1, 'week').asSeconds(),           604800,    '1 week a
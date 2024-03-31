moment(new Date(2011, 3, 3, 3, 4, 5, 10))), true, 'day is later');
        assert.equal(m.isSameOrBefore(moment(new Date(2011, 3, 1, 3, 4, 5, 10))), false, 'day is earlier');
        assert.equal(m.isSameOrBefore(moment(new Date(2011, 3, 2, 4, 4, 5, 10))), true, 'hour is later');
        assert.equal(m.isSameOrBefore(moment(new Date(2011, 3, 2, 2, 4, 5, 10))), false, 'hour is earlier');
        assert.equal(m.isSameOrBefore(moment(new Date(2011, 3, 2, 3, 5, 5, 10))), true, 'minute is later');
        assert.equal(m.isSameOrBefore(moment(new Date(2011, 3, 2, 3, 3, 5, 10))), false, 'minute is earlier');
        assert.equal(m.isSameOrBefore(moment(new Date(2011, 3, 2, 3, 4, 6, 10))), true, 'second is later');
        assert.equal(m.isSameOrBefore(moment(new Date(2011, 3, 2, 3, 4, 4, 11))), false, 'second is earlier');
        assert.equal(m.isSameOrBefore(moment(new Date(2011, 3, 2, 3, 4, 5, 10))), true, 'millisecond match');
  
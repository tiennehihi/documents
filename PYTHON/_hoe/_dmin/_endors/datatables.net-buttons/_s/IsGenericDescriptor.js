t([2007, 1, 28]).add({h: 21}), true),  '21 horas',      '21 hours = 21 hours');
        assert.equal(start.from(moment([2007, 1, 28]).add({h: 22}), true),  'un día',         '22 hours = a day');
        assert.equal(start.from(moment([2007, 1, 28]).add({h: 35}), true),  'un día',         '35 hours = a day');
        assert.equal(start.from(moment([2007, 1, 28]).add({h: 36}), true),  '2 días',        '36 hours = 2 days');
        assert.equal(start.from(moment([2007, 1, 28]).add({d: 1}), true),   'un día',         '1 day = a day');
        assert
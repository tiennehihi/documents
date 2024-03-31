,
            i;
        for (i = 0; i < a.length; i++) {
            assert.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
        }
    });

    test('format ordinal', function (assert) {
        assert.equal(moment([2011, 0, 1]).format('DDDo'), '1-мӗш', '1-мӗш');
        assert.equal(moment([2011, 0, 2]).format('DDDo'), '2-мӗш', '2-мӗш');
        assert.equal(moment([2011, 0, 3]).format('DDDo'), '3-мӗш', '3-мӗш');
        assert.equal(moment([2011, 0, 4]).forma
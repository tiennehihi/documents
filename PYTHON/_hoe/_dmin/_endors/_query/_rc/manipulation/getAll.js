rred once', () => {
        assert.strictEqual(log.counts.literal, 1)
      })

      test('literal event was dispatched correctly', () => {
        assert.strictEqual(log.args.literal[0][0], true)
      })

      test('end event occurred once', () => {
        assert.strictEqual(log.counts.end, 1)
      })

      test('array event did not occur', () => {
        assert.strictEqual(log.counts.array, 0)
      })

      test('object event did not occur', () => {
        assert.strictEqual(log.counts.object, 0)
      })

      test('pro
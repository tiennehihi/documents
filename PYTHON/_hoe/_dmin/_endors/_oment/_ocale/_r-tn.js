 = getPropValue(prop);

      assert.equal(actual, expected);
    });
  });

  describe('Unary expression', () => {
    it('should correctly evaluate an expression that prefixes with -', () => {
      const prop = extractProp('<div foo={-bar} />');

      // -"bar" => NaN
      const expected = true;
      const actual = Number.isNaN(getPropValue(prop));

      assert.equal(actual, expected);
    });

    it('should correctly evaluate an expression that prefixes with -', () => {
      const prop = extractProp('<div foo={-42} />');

      const expected = -42;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should correctly evaluate an expression that prefixes with +', () => {
      const prop = extractProp('<div foo={+bar} />');

      // +"bar" => NaN
      const expected = true;
      const actual = Number.isNaN(getPropValue(prop));

      assert.equal(actual, expected);
    });

    it('should correctly evaluate an expression that prefixes with +', () => {
      const prop = extractProp('<div foo={+42} />');

      const expected = 42;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should correctly evaluate an expression that prefixes with !', () => {
      const prop = extractProp('<div foo={!bar} />');

      const expected = false; // !"bar" === false
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should correctly evaluate an expression that prefixes with ~', () => {
      const prop = extractProp('<div foo={~bar} />');

      const expected = -1; // ~"bar" === -1
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return true when evaluating `delete foo`', () => {
      const prop = extractProp('<div foo={delete x} />');

      const expected = true;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return undefined when evaluating `void foo`', () => {
      const prop = extractProp('<div foo={void x} />');

      const expected = undefined;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    // TODO: We should fix this to check to see if w
p);

      assert.equal(actual, expected);
    });

    it('should return string representation of variable identifier wrapped in a Typescript type coercion', () => {
      const prop = extractProp('<div foo={bar as any} />');

      const expected = 'bar';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });
  });

  describeIfNotBabylon('TSNonNullExpression', () => {
    beforeEach(() => {
      changePlugins((pls) => [...pls, 'typescript']);
    });

    it('should return string representation of a TSNonNullExpression of form `variable!`', () => {
      const prop = extractProp('<div foo={bar!} />');
      const expected = 'bar!';
      const actual = getPropValue(prop);
      assert.equal(actual, expected);
    });

    it('should return string representation of a TSNonNullExpression of form `object!.property`', () => {
      const prop = extractProp('<div foo={bar!.bar} />');
      const expected = 'bar!.bar';
      const actual = getPropValue(prop);
      assert.equal(actual, expected);
    });

    it('should return string representation of a TSNonNullExpression of form `function()!.property`', () => {
      const prop = extractProp('<div foo={bar()!.bar} />');
      const expected = 'bar()!.bar';
      const actual = getPropValue(prop);
      assert.equal(actual, expected);
    });

    it('should return string representation of a TSNonNullExpression of form `object!.property!`', () => {
      const prop = extractProp('<div foo={bar!.bar!} />');
      const actual = getPropValue(prop);
      const expected = 'bar!.bar!';
      assert.equal(actual, expected);
    });

    it('should return string representation of a TSNonNullExpression of form `object.property!`', () => {
      const prop = extractProp('<div foo={bar.bar!} />');
      const actual = getPropValue(prop);
      const expected = 'bar.bar!';
      assert.equal(actual, expected);
    });

    it('should return string representation of a TSNonNullExpression of form `object.property.property!`', () => {
      const prop = extractProp('<div foo={bar.bar.bar!} />');
      const actual = getPropValue(prop);
      const expected = 'bar.bar.bar!';
      assert.equal(actual, expected);
    });

    it('should return string representation of a TSNonNullExpression of form `object!.property.property!`', () => {
      const prop = extractProp('<div foo={bar!.bar.bar!} />');
      const actual = getPropValue(prop);
      const expected = 'bar!.bar.bar!';
      assert.equal(actual, expected);
    });

    it('should return string representation of an object wrapped in a deep Typescript non-null assertion', () => {
      const prop = extractProp('<div foo={(bar!.bar)!} />');
      const expected = '(bar!.bar)!';
      const actual = getPropValue(prop);
      assert.equal(actual, expected);
    });

    it('should return string representation of a cast wrapped in a deep Typescript non-null assertion', () => {
      const prop = extractProp('<div foo={(bar as Bar).baz!} />');
      const actual = getPropValue(prop);
      const expected = 'bar.baz!';
      assert.equal(actual, expected);
    });

    it('should return string representation of an object wrapped in a deep Typescript non-null assertion', () => {
      const prop = extractProp('<div foo={(bar.bar)!} />');
      const expected = '(bar.bar)!';
      const actual = getPropValue(prop);
      assert.equal(actual, expected);
    });

    it('should return string representation of an object wrapped in a deep Typescript non-null assertion', () => {
      const prop = extractProp('<div foo={(bar!.bar.bar!)!} />');
      const expected = '(bar!.bar.bar!)!';
      const actual = getPropValue(prop);
      assert.equal(actual, expected);
    });

    it('should return string representation of variable identifier wrapped in a deep Typescript non-null assertion', () => {
      const prop = extractProp('<div foo={(bar!)!} />');
      const expected = '(bar!)!';
      const actual = getPropValue(prop);
      assert.equal(actual, expected);
    });

    it('should work with a this.props value', () => {
      const prop = extractProp('<a foo={this.props.href!}>Download</a>');
      const expected = 'this.props.href!';
      const actual = getPropValue(prop);
      assert.equal(actual, expected);
    });

    it('should correctly evaluate a bracketed navigation expression that prefixes with !', () => {
      const prop = extractProp('<Link foo={data![0].url} />');

      const expected = 'data![0].url';
      const actual = getPropValue(prop);

      assert.equal(actual, e
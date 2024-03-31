als `length`, false
   * otherwise.
   */
  function hasLength (data, length) {
    return assigned(data) && data.length === length;
  }

  /**
   * Public function `date`.
   *
   * Returns true if `data` is a valid date, false otherwise.
   */
  function date (data) {
    return instanceStrict(data, Date) && integer(data.getTime());
  }

  /**
   * Public function `function`.
   *
   * Returns true if `data` is a function, false otherwise.
   */
  function isFunction (data) {
    return typeof data === 'function';
  }

  /**
   * Public function `throws`.
   *
   * Returns true if `data` is a function that throws, false otherwise.
   */
  function throws (data) {
    if (! isFunction(data)) {
      return false;
    }

    try {
      data();
    } catch (error) {
      return true;
    }

    return false;
  }

  /**
   * Public function `map`.
   *
   * Maps each value from `data` to the corresponding predicate and returns
   * the results. If the same function is to be applied across all of the data,
   * a single predicate function may be passed in.
   */
  function map (data, predicates) {
    var result;

    if (isArray(data)) {
      result = [];
    } else {
      result = {};
    }

    if (isFunction(predicates)) {
      forEach(data, function (key, value) {
        result[key] = predicates(value);
      });
    } else {
      if (! isArray(predicates)) {
        assert.object(predicates);
      }

      var dataKeys = keys(data || {});

      forEach(predicates, function (key, predicate) {
        dataKeys.some(function (dataKey, index) {
          if (dataKey === key) {
            dataKeys.splice(index, 1);
            return true;
          }
          return false;
        });

        if (isFunction(predicate)) {
          if (not.assigned(data)) {
            result[key] = !! predicate.m;
          } else {
            result[key] = predicate(data[key]);
          }
        } else {
          result[key] = map(data[key], predicate);
        }
      });
    }

    return result;
  }

  function forEach (object, action) {
    for (var key in object) {
      if (hasOwnProperty.call(object, key)) {
        action(key, object[key]);
      }
    }
  }

  /**
   * Public function `all`
   *
   * Check that all boolean values are true
   * in an array or object returned from `map`.
   */
  function all (data) {
    if (isArray(data)) {
      return testArray(data, false);
    }

    assert.object(data);

    return testObject(data, false);
  }

  function testArray (data, result) {
    var i;

    for (i = 0; i < data.length; i += 1) {
      if (data[i] === result) {
        return result;
      }
    }

    return ! result;
  }

  function testObject (data, result) {
    var key, value;

    for (key in data) {
      if (hasOwnProperty.call(data, key)) {
        value = 
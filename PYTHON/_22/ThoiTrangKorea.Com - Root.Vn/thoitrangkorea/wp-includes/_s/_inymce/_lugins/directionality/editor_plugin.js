(nameOrPrefix)
    if (this.opts.es5) {
      const arr = iterable instanceof Name ? iterable : this.var("_arr", iterable)
      return this.forRange("_i", 0, _`${arr}.length`, (i) => {
        this.var(name, _`${arr}[${i}]`)
        forBody(name)
      })
    }
    return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name))
  }

  // `for-in` statement.
  // With option `ownProperties` replaced with a `for-of` loop for object keys
  forIn(
    nameOrPrefix: Name | string,
    obj: Code,
    forBody: (item: Name) => void,
    varKind: Code = this.opts.es5 ? varKinds.var : varKinds.const
  ): CodeGen {
    if (this.opts.ownProperties) {
      return this.forOf(nameOrPrefix, _`Object.keys(${obj})`, forBody)
    }
    const name = this._scope.toName(nameOrPrefix)
    return this._for(new ForIter("in", varKind, name, obj), () => forBody(name))
  }

  // end `for` loop
  endFor(): CodeGen {
    return this._endBlockNode(For)
  }

  // `label` statement
  label(label: Name): CodeGen {
    return this._leafNode(new Label(label))
  }

  // `break` statement
  break(label?: Code): CodeGen {
    return this._leafNode(new Break(label))
  }

  // `return` statement
  return(value: Block | SafeExpr): CodeGen {
    const node = new Return()
    this._blockNode(node)
    this.code(value)
    if (node.node
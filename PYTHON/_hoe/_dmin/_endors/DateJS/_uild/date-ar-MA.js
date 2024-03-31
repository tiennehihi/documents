entialArrowAt === this.start\n  switch (this.type) {\n  case tt._super:\n    if (!this.allowSuper)\n      this.raise(this.start, \"'super' keyword outside a method\")\n    node = this.startNode()\n    this.next()\n    if (this.type === tt.parenL && !this.allowDirectSuper)\n      this.raise(node.start, \"super() call outside constructor of a subclass\")\n    // The `super` keyword can appear at below:\n    // SuperProperty:\n    //     super [ Expression ]\n    //     super . IdentifierName\n    // SuperCall:\n    //     super ( Arguments )\n    if (this.type !== tt.dot && this.type !== tt.bracketL && this.type !== tt.parenL)\n      this.unexpected()\n    return this.finishNode(node, \"Super\")\n\n  case tt._this:\n    node = this.startNode()\n    this.next()\n    return this.finishNode(node, \"ThisExpression\")\n\n  case tt.name:\n    let startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc\n    let id = this.parseIdent(false)\n    if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === \"async\" && !this.canInsertSemicolon() && this.eat(tt._function))\n      return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true)\n    if (canBeArrow && !this.canInsertSemicolon()) {\n      if (this.eat(tt.arrow))\n        return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false)\n      if (this.options.ecmaVersion >= 8 && id.name === \"async\" && this.type === tt.name && !containsEsc) {\n        id = this.parseIdent(false)\n        if (this.canInsertSemicolon() || !this.eat(tt.arrow))\n          this.unexpected()\n        return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true)\n      }\n    }\n    return id\n\n  case tt.regexp:\n    let value = this.value\n    node = this.parseLiteral(value.value)\n    node.regex = {pattern: value.pattern, flags: value.flags}\n    return node\n\n  case tt.num: case tt.string:\n    return this.parseLiteral(this.value)\n\n  case tt._null: case tt._true: case tt._false:\n    node = this.startNode()\n    node.value = this.type === tt._null ? null : this.type === tt._true\n    node.raw = this.type.keyword\n    this.next()\n    return this.finishNode(node, \"Literal\")\n\n  case tt.parenL:\n    let start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow)\n    if (refDestructuringErrors) {\n      if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr))\n        refDestructuringErrors.parenthesizedAssign = start\n      if (refDestructuringErrors.parenthesizedBind < 0)\n        refDestructuringErrors.parenthesizedBind = start\n    }\n    return expr\n\n  case tt.bracketL:\n    node = this.startNode()\n    this.next()\n    node.elements = this.parseExprList(tt.bracketR, true, true, refDestructuringErrors)\n    return this.finishNode(node, \"ArrayExpression\")\n\n  case tt.braceL:\n    return this.parseObj(false, refDestructuringErrors)\n\n  case tt._function:\n    node = this.startNode()\n    this.next()\n    return this.parseFunction(node, 0)\n\n  case tt._class:\n    return this.parseClass(this.startNode(), false)\n\n  case tt._new:\n    return this.parseNew()\n\n  case tt.backQuote:\n    return this.parseTemplate()\n\n  case tt._import:\n    if (this.options.ecmaVersion >= 11) {\n      return this.parseExprImport()\n    } else {\n      return this.unexpected()\n    }\n\n  default:\n    this.unexpected()\n  }\n}\n\npp.parseExprImport = function() {\n  const node = this.startNode()\n\n  // Consume `import` as an identifier for `import.meta`.\n  // Because `this.parseIdent(true)` doesn't check escape sequences, it needs the check of `this.containsEsc`.\n  if (this.containsEsc) this.raiseRecoverable(this.start, \"Escape sequence in keyword import\")\n  const meta = this.parseIdent(true)\n\n  switch (this.type) {\n  case tt.parenL:\n    return this.parseDynamicImport(node)\n  case tt.dot:\n    node.meta = meta\n    return this.parseImportMeta(node)\n  default:\n    this.unexpected()\n  }\n}\n\npp.parseDynamicImport = function(node) {\n  this.next() // skip `(`\n\n  // Parse node.source.\n  node.source = this.parseMaybeAssign()\n\n  // Verify ending.\n  if (!this.eat(tt.parenR)) {\n    const errorPos = this.start\n    if (this.eat(tt.comma) && this.eat(tt.parenR)) {\n      this.raiseRecoverable(errorPos, \"Trailing comma is not allowed in import()\")\n    } else {\n      this.unexpected(errorPos)\n    }\n  }\n\n  return this.finishNode(node, \"ImportExpression\")\n}\n\npp.parseImportMeta = function(node) {\n  this.next() // skip `.`\n\n  const containsEsc = this.containsEsc\n  node.property = this.parseIdent(true)\n\n  if (node.property.name !== \"meta\")\n    this.raiseRecoverable(node.property.start, \"The only valid meta property for import is 'import.meta'\")\n  if (containsEsc)\n    this.raiseRecoverable(node.start, \"'import.meta' must not contain escaped characters\")\n  if (this.options.sourceType !== \"module\")\n    this.raiseRecoverable(node.start, \"Cannot use 'import.meta' outside a module\")\n\n  return this.finishNode(node, \"MetaProperty\")\n}\n\npp.parseLiteral = function(value) {\n  let node = this.startNode()\n  node.value = value\n  node.raw = this.input.slice(this.start, this.end)\n  if (node.raw.charCodeAt(node.raw.length - 1) === 110) node.bigint = node.raw.slice(0, -1).replace(/_/g, \"\")\n  this.next()\n  return this.finishNode(node, \"Literal\")\n}\n\npp.parseParenExpression = function() {\n  this.expect(tt.parenL)\n  let val = this.parseExpression()\n  this.expect(tt.parenR)\n  return val\n}\n\npp.parseParenAndDistinguishExpression = function(canBeArrow) {\n  let startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8\n  if (this.options.ecmaVersion >= 6) {\n    this.next()\n\n    let innerStartPos = this.start, innerStartLoc = this.startLoc\n    let exprList = [], first = true, lastIsComma = false\n    let refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart\n    this.yieldPos = 0\n    this.awaitPos = 0\n    // Do not save awaitIdentPos to allow checking awaits nested in parameters\n    while (this.type !== tt.parenR) {\n      first ? first = false : this.expect(tt.comma)\n      if (allowTrailingComma && this.afterTrailingComma(tt.parenR, true)) {\n        lastIsComma = true\n        break\n      } else if (this.type === tt.ellipsis) {\n        spreadStart = this.start\n        exprList.push(this.parseParenItem(this.parseRestBinding()))\n        if (this.type === tt.comma) this.raise(this.start, \"Comma is not permitted after the rest element\")\n        break\n      } else {\n        exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem))\n      }\n    }\n    let innerEndPos = this.start, innerEndLoc = this.startLoc\n    this.expect(tt.parenR)\n\n    if (canBeArrow && !this.canInsertSemicolon() && this.eat(tt.arrow)) {\n      this.checkPatternErrors(refDestructuringErrors, false)\n      this.checkYieldAwaitInDefaultParams()\n      this.yieldPos = oldYieldPos\n      this.awaitPos = oldAwaitPos\n      return this.parseParenArrowList(startPos, startLoc, exprList)\n    }\n\n    if (!exprList.length || lastIsComma) this.unexpected(this.lastTokStart)\n    if (spreadStart) this.unexpected(spreadStart)\n    this.checkExpressionErrors(refDestructuringErrors, true)\n    this.yieldPos = oldYieldPos || this.yieldPos\n    this.awaitPos = oldAwaitPos || this.awaitPos\n\n    if (exprList.length > 1) {\n      val = this.startNodeAt(innerStartPos, innerStartLoc)\n      val.expressions = exprList\n      this.finishNodeAt(val, \"SequenceExpression\", innerEndPos, innerEndLoc)\n    } else {\n      val = exprList[0]\n    }\n  } else {\n    val = this.parseParenExpression()\n  }\n\n  if (this.options.preserveParens) {\n    let par = this.startNodeAt(startPos, startLoc)\n    par.expression = val\n    return this.finishNode(par, \"ParenthesizedExpression\")\n  } else {\n    return val\n  }\n}\n\npp.parseParenItem = function(item) {\n  return item\n}\n\npp.parseParenArrowList = function(startPos, startLoc, exprList) {\n  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList)\n}\n\n// New's precedence is slightly tricky. It must allow its argument to\n// be a `[]` or dot subscript expression, but not a call — at least,\n// not without wrapping it in parentheses. Thus, it uses the noCalls\n// argument to parseSubscripts to prevent it from consuming the\n// argument list.\n\nconst empty = []\n\npp.parseNew = function() {\n  if (this.containsEsc) this.raiseRecoverable(this.start, \"Escape sequence in keyword new\")\n  let node = this.startNode()\n  let meta = this.parseIdent(true)\n  if (this.options.ecmaVersion >= 6 && this.eat(tt.dot)) {\n    node.meta = meta\n    let containsEsc = this.containsEsc\n    node.property = this.parseIdent(true)\n    if (node.property.name !== \"target\")\n      this.raiseRecoverable(node.property.start, \"The only valid meta property for new is 'new.target'\")\n    if (containsEsc)\n      this.raiseRecoverable(node.start, \"'new.target' must not contain escaped characters\")\n    if (!this.inNonArrowFunction)\n      this.raiseRecoverable(node.start, \"'new.target' can only be used in functions\")\n    return this.finishNode(node, \"MetaProperty\")\n  }\n  let startPos = this.start, startLoc = this.startLoc, isImport = this.type === tt._import\n  node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true)\n  if (isImport && node.callee.type === \"ImportExpression\") {\n    this.raise(startPos, \"Cannot use new with import()\")\n  }\n  if (this.eat(tt.parenL)) node.arguments = this.parseExprList(tt.parenR, this.options.ecmaVersion >= 8, false)\n  else node.arguments = empty\n  return this.finishNode(node, \"NewExpression\")\n}\n\n// Parse template expression.\n\npp.parseTemplateElement = function({isTagged}) {\n  let elem = this.startNode()\n  if (this.type === tt.invalidTemplate) {\n    if (!isTagged) {\n      this.raiseRecoverable(this.start, \"Bad escape sequence in untagged template literal\")\n    }\n    elem.value = {\n      raw: this.value,\n      cooked: null\n    }\n  } else {\n    elem.value = {\n      raw: this.input.slice(this.start, this.end).replace(/\\r\\n?/g, \"\\n\"),\n      cooked: this.value\n    }\n  }\n  this.next()\n  elem.tail = this.type === tt.backQuote\n  return this.finishNode(elem, \"TemplateElement\")\n}\n\npp.parseTemplate = function({isTagged = false} = {}) {\n  let node = this.startNode()\n  this.next()\n  node.expressions = []\n  let curElt = this.parseTemplateElement({isTagged})\n  node.quasis = [curElt]\n  while (!curElt.tail) {\n    if (this.type === tt.eof) this.raise(this.pos, \"Unterminated template literal\")\n    this.expect(tt.dollarBraceL)\n    node.expressions.push(this.parseExpression())\n    this.expect(tt.braceR)\n    node.quasis.push(curElt = this.parseTemplateElement({isTagged}))\n  }\n  this.next()\n  return this.finishNode(node, \"TemplateLiteral\")\n}\n\npp.isAsyncProp = function(prop) {\n  return !prop.computed && prop.key.type === \"Identifier\" && prop.key.name === \"async\" &&\n    (this.type === tt.name || this.type === tt.num || this.type === tt.string || this.type === tt.bracketL || this.type.keyword || (this.options.ecmaVersion >= 9 && this.type === tt.star)) &&\n    !lineBreak.test(this.input.slice(this.lastTokEnd, this.start))\n}\n\n// Parse an object literal or binding pattern.\n\npp.parseObj = function(isPattern, refDestructuringErrors) {\n  let node = this.startNode(), first = true, propHash = {}\n  node.properties = []\n  this.next()\n  while (!this.eat(tt.braceR)) {\n    if (!first) {\n      this.expect(tt.comma)\n      if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(tt.braceR)) break\n    } else first = false\n\n    const prop = this.parseProperty(isPattern, refDestructuringErrors)\n    if (!isPattern) this.checkPropClash(prop, propHash, refDestructuringErrors)\n    node.properties.push(prop)\n  }\n  return this.finishNode(node, isPattern ? \"ObjectPattern\" : \"ObjectExpression\")\n}\n\npp.parseProperty = function(isPattern, refDestructuringErrors) {\n  let prop = this.startNode(), isGenerator, isAsync, startPos, startLoc\n  if (this.options.ecmaVersion >= 9 && this.eat(tt.ellipsis)) {\n    if (isPattern) {\n      prop.argument = this.parseIdent(false)\n      if (this.type === tt.comma) {\n        this.raise(this.start, \"Comma is not permitted after the rest element\")\n      }\n      return this.finishNode(prop, \"RestElement\")\n    }\n    // To disallow parenthesized identifier via `this.toAssignable()`.\n    if (this.type === tt.parenL && refDestructuringErrors) {\n      if (refDestructuringErrors.parenthesizedAssign < 0) {\n        refDestructuringErrors.parenthesizedAssign = this.start\n      }\n      if (refDestructuringErrors.parenthesizedBind < 0) {\n        refDestructuringErrors.parenthesizedBind = this.start\n      }\n    }\n    // Parse argument.\n    prop.argument = this.parseMaybeAssign(false, refDestructuringErrors)\n    // To disallow trailing comma via `this.toAssignable()`.\n    if (this.type === tt.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {\n      refDestructuringErrors.trailingComma = this.start\n    }\n    // Finish\n    return this.finishNode(prop, \"SpreadElement\")\n  }\n  if (this.options.ecmaVersion >= 6) {\n    prop.method = false\n    prop.shorthand = false\n    if (isPattern || refDestructuringErrors) {\n      startPos = this.start\n      startLoc = this.startLoc\n    }\n    if (!isPattern)\n      isGenerator = this.eat(tt.star)\n  }\n  let containsEsc = this.containsEsc\n  this.parsePropertyName(prop)\n  if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {\n    isAsync = true\n    isGenerator = this.options.ecmaVersion >= 9 && this.eat(tt.star)\n    this.parsePropertyName(prop, refDestructuringErrors)\n  } else {\n    isAsync = false\n  }\n  this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc)\n  return this.finishNode(prop, \"Property\")\n}\n\npp.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {\n  if ((isGenerator || isAsync) && this.type === tt.colon)\n    this.unexpected()\n\n  if (this.eat(tt.colon)) {\n    prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors)\n    prop.kind = \"init\"\n  } else if (this.options.ecmaVersion >= 6 && this.type === tt.parenL) {\n    if (isPattern) this.unexpected()\n    prop.kind = \"init\"\n    prop.method = true\n    prop.value = this.parseMethod(isGenerator, isAsync)\n  } else if (!isPattern && !containsEsc &&\n             this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === \"Identifier\" &&\n             (prop.key.name === \"get\" || prop.key.name === \"set\") &&\n             (this.type !== tt.comma && this.type !== tt.braceR && this.type !== tt.eq)) {\n    if (isGenerator || isAsync) this.unexpected()\n    prop.kind = prop.key.name\n    this.parsePropertyName(prop)\n    prop.value = this.parseMethod(false)\n    let paramCount = prop.kind === \"get\" ? 0 : 1\n    if (prop.value.params.length !== paramCount) {\n      let start = prop.value.start\n      if (prop.kind === \"get\")\n        this.raiseRecoverable(start, \"getter should have no params\")\n      else\n        this.raiseRecoverable(start, \"setter should have exactly one param\")\n    } else {\n      if (prop.kind === \"set\" && prop.value.params[0].type === \"RestElement\")\n        this.raiseRecoverable(prop.value.params[0].start, \"Setter cannot use rest params\")\n    }\n  } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === \"Identifier\") {\n    if (isGenerator || isAsync) this.unexpected()\n    this.checkUnreserved(prop.key)\n    if (prop.key.name === \"await\" && !this.awaitIdentPos)\n      this.awaitIdentPos = startPos\n    prop.kind = \"init\"\n    if (isPattern) {\n      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key))\n    } else if (this.type === tt.eq && refDestructuri
  * Added `app.get(setting)`. Closes #842
  * Added `req.acceptsLanguage()`
  * Added `req.acceptsCharset()`
  * Added `req.accepted`
  * Added `req.acceptedLanguages`
  * Added `req.acceptedCharsets`
  * Added "json replacer" setting
  * Added "json spaces" setting
  * Added X-Forwarded-Proto support to `res.redirect()`. Closes #92
  * Added `--less` support to express(1)
  * Added `express.response` prototype
  * Added `express.request` prototype
  * Added `express.application` prototype
  * Added `app.path()`
  * Added `app.render()`
  * Added `res.type()` to replace `res.contentType()`
  * Changed: `res.redirect()` to add relative support
  * Changed: enable "jsonp callback" by default
  * Changed: renamed "case sensitive routes" to "case sensitive routing"
  * Rewrite of all tests with mocha
  * Removed "root" setting
  * Removed `res.redirect('home')` support
  * Removed `req.notify()`
  * Removed `app.register()`
  * Removed `app.redirect()`
  * Removed `app.is()`
  * Removed `app.helpers()`
  * Removed `app.dynamicHelpers()`
  * Fixed `res.sendfile()` with non-GET. Closes #723
  * Fixed express(1) public dir for windows. Closes #866

2.5.9/ 2012-04-02
==================

  * Added support for PURGE request method [pbuyle]
  * Fixed `express(1)` generated app `app.address()` before `listening` [mmalecki]

2.5.8 / 2012-02-08
==================

  * Update mkdirp dep. Closes #991

2.5.7 / 2012-02-06
==================

  * Fixed `app.all` duplicate DELETE requests [mscdex]

2.5.6 / 2012-01-13
==================

  * Updated hamljs dev dep. Closes #953

2.5.5 / 2012-01-08
==================

  * Fixed: set `filename` on cached templates [matthewleon]

2.5.4 / 2012-01-02
==================

  * Fixed `express(1)` eol on 0.4.x. Closes #947

2.5.3 / 2011-12-30
==================

  * Fixed `req.is()` when a charset is present

2.5.2 / 2011-12-10
==================

  * Fixed: express(1) LF -> CRLF for windows

2.5.1 / 2011-11-17
==================

  * Changed: updated connect to 1.8.x
  * Removed sass.js support from express(1)

2.5.0 / 2011-10-24
==================

  * Added ./routes dir for generated app by default
  * Added npm install reminder to express(1) app gen
  * Added 0.5.x support
  * Removed `make test-cov` since it wont work with node 0.5.x
  * Fixed express(1) public dir for windows. Closes #866

2.4.7 / 2011-10-05
==================

  * Added mkdirp to express(1). Closes #795
  * Added simple _json-config_ example
  * Added  shorthand for the parsed request's pathname via `req.path`
  * Changed connect dep to 1.7.x to fix npm issue...
  * Fixed `res.redirect()` __HEAD__ support. [reported by xerox]
  * Fixed `req.flash()`, only escape args
  * Fixed absolute path checking on windows. Closes #829 [reported by andrewpmckenzie]

2.4.6 / 2011-08-22
==================

  * Fixed multiple param callback regression. Closes #824 [reported by TroyGoode]

2.4.5 / 2011-08-19
==================

  * Added support for routes to handle errors. Closes #809
  * Added `app.routes.all()`. Closes #803
  * Added "basepath" setting to work in conjunction with reverse proxies etc.
  * Refactored `Route` to use a single array of callbacks
  * Added support for multiple callbacks for `app.param()`. Closes #801
Closes #805
  * Changed: removed .call(self) for route callbacks
  * Dependency: `qs >= 0.3.1`
  * Fixed `res.redirect()` on windows due to `join()` usage. Closes #808

2.4.4 / 2011-08-05
==================

  * Fixed `res.header()` intention of a set, even when `undefined`
  * Fixed `*`, value no longer required
  * Fixed `res.send(204)` support. Closes #771

2.4.3 / 2011-07-14
==================

  * Added docs for `status` option special-case. Closes #739
  * Fixed `options.filename`, exposing the view path to template engines

2.4.2. / 2011-07-06
==================

  * Revert "removed jsonp stripping" for XSS

2.4.1 / 2011-07-06
==================

  * Added `res.json()` JSONP support. Closes #737
  * Added _extending-templates_ example. Closes #730
  * Added "strict routing" setting for trailing slashes
  * Added support for multiple envs in `app.configure()` calls. Closes #735
  * Changed: `res.send()` using `res.json()`
  * Changed: when cookie `path === null` don't default it
  * Changed; default cookie path to "home" setting. Closes #731
  * Removed _pids/logs_ creation from express(1)

2.4.0 / 2011-06-28
==================

  * Added chainable `res.status(code)`
  * Added `res.json()`, an explicit version of `res.send(obj)`
  * Added simple web-service example

2.3.12 / 2011-06-22
==================

  * \#express is now on freenode! come join!
  * Added `req.get(field, param)`
  * Added links to Japanese documentation, thanks @hideyukisaito!
  * Added; the `express(1)` generated app outputs the env
  * Added `content-negotiation` example
  * Dependency: connect >= 1.5.1 < 2.0.0
  * Fixed view layout bug. Closes #720
  * Fixed; ignore body on 304. Closes #701

2.3.11 / 2011-06-04
==================

  * Added `npm test`
  * Removed generation of dummy test file from `express(1)`
  * Fixed; `express(1)` adds express as a dep
  * Fixed; prune on `prepublish`

2.3.10 / 2011-05-27
==================

  * Added `req.route`, exposing the current route
  * Added _package.json_ generation support to `express(1)`
  * Fixed call to `app.param()` function for optional params. Closes #682

2.3.9 / 2011-05-25
==================

  * Fixed bug-ish with `../' in `res.partial()` calls

2.3.8 / 2011-05-24
==================

  * Fixed `app.options()`

2.3.7 / 2011-05-23
==================

  * Added route `Collection`, ex: `app.get('/user/:id').remove();`
  * Added support for `app.param(fn)` to define param logic
  * Removed `app.param()` support for callback with return value
  * Removed module.parent check from express(1) generated app. Closes #670
  * Refactored router. Closes #639

2.3.6 / 2011-05-20
==================

  * Changed; using devDependencies instead of git submodules
  * Fixed redis session example
  * Fixed markdown example
  * Fixed view caching, should not be enabled in development

2.3.5 / 2011-05-20
==================

  * Added export `.view` as alias for `.View`

2.3.4 / 2011-05-08
==================

  * Added `./examples/say`
  * Fixed `res.sendfile()` bug preventing the transfer of files with spaces

2.3.3 / 2011-05-03
==================

  * Added "case sensitive routes" option.
  * Changed; split methods supported per rfc [slaskis]
  * Fixed route-specific middleware when using the same callback function several times

2.3.2 / 2011-04-27
==================

  * Fixed view hints

2.3.1 / 2011-04-26
==================

  * Added `app.match()` as `app.match.all()`
  * Added `app.lookup()` as `app.lookup.all()`
  * Added `app.remove()` for `app.remove.all()`
  * Added `app.remove.VERB()`
  * Fixed template caching collision issue. Closes #644
  * Moved router over from connect and started refactor

2.3.0 / 2011-04-25
==================

  * Added options support to `res.clearCookie()`
  * Added `res.helpers()` as alias of `res.locals()`
  * Added; json defaults to UTF-8 with `res.send()`. Closes #632. [Daniel   * Dependency `connect >= 1.4.0`
  * Changed; auto set Content-Type in res.attachement [Aaron Heckmann]
  * Renamed "cache views" to "view cache". Closes #628
  * Fixed caching of views when using several apps. Closes #637
  * Fixed gotcha invoking `app.param()` callbacks once per route middleware.
Closes #638
  * Fixed partial lookup precedence. Closes #631
Shaw]

2.2.2 / 2011-04-12
==================

  * Added second callback support for `res.download()` connection errors
  * Fixed `filename` option passing to template engine

2.2.1 / 2011-04-04
==================

  * Added `layout(path)` helper to change the layout within a view. Closes #610
  * Fixed `partial()` collection object support.
    Previously only anything with `.length` would work.
    When `.length` is present one must still be aware of holes,
    however now `{ collection: {foo: 'bar'}}` is valid, exposes
    `keyInCollection` and `keysInCollection`.

  * Performance improved with better view caching
  * Removed `request` and `response` locals
  * Changed; errorHandler page title is now `Express` instead of `Connect`

2.2.0 / 2011-03-30
==================

  * Added `app.lookup.VERB()`, ex `app.lookup.put('/user/:id')`. Closes #606
  * Added `app.match.VERB()`, ex `app.match.put('/user/12')`. Closes #606
  * Added `app.VERB(path)` as alias of `app.lookup.VERB()`.
  * Dependency `connect >= 1.2.0`

2.1.1 / 2011-03-29
==================

  * Added; expose `err.view` object when failing to locate a view
  * Fixed `res.partial()` call `next(err)` when no callback is given [reported by aheckmann]
  * Fixed; `res.send(undefined)` responds with 204 [aheckmann]

2.1.0 / 2011-03-24
==================

  * Added `<root>/_?<name>` partial lookup support. Closes #447
  * Added `request`, `response`, and `app` local variables
  * Added `settings` local variable, containing the app's settings
  * Added `req.flash()` exception if `req.session` is not available
  * Added `res.send(bool)` support (json response)
  * Fixed stylus example for latest version
  * Fixed; wrap try/catch around `res.render()`

2.0.0 / 2011-03-17
==================

  * Fixed up index view path alternative.
  * Changed; `res.locals()` without object returns the locals

2.0.0rc3 / 2011-03-17
==================

  * Added `res.locals(obj)` to compliment `res.local(key, val)`
  * Added `res.partial()` callback support
  * Fixed recursive error reporting issue in `res.render()`

2.0.0rc2 / 2011-03-17
==================

  * Changed; `partial()` "locals" are now optional
  * Fixed `SlowBuffer` support. Closes #584 [reported by tyrda01]
  * Fixed .filename view engine option [reported by drudge]
  * Fixed blog example
  * Fixed `{req,res}.app` reference when mounting [Ben Weaver]

2.0.0rc / 2011-03-14
==================

  * Fixed; expose `HTTPSServer` constructor
  * Fixed express(1) default test charset. Closes #579 [reported by secoif]
  * Fixed; default charset to utf-8 instead of utf8 for lame IE [reported by NickP]

2.0.0beta3 / 2011-03-09
==================

  * Added support for `res.contentType()` literal
    The original `res.contentType('.json')`,
    `res.contentType('application/json')`, and `res.contentType('json')`
    will work now.
  * Added `res.render()` status option support back
  * Added charset option for `res.render()`
  * Added `.charset` support (via connect 1.0.4)
  * Added view resolution hints when in development and a lookup fails
  * Added layout lookup support relative to the page view.
    For example while rendering `./views/user/index.jade` if you create
    `./views/user/layout.jade` it will be used in favour of the root layout.
  * Fixed `res.redirect()`. RFC states absolute url [reported by unlink]
  * Fixed; default `res.send()` string charset to utf8
  * Removed `Partial` constructor (not currently used)

2.0.0beta2 / 2011-03-07
==================

  * Added res.render() `.locals` support back to aid in migration process
  * Fixed flash example

2.0.0beta / 2011-03-03
==================

  * Added HTTPS support
  * Added `res.cookie()` maxAge support
  * Added `req.header()` _Referrer_ / _Referer_ special-case, either works
  * Added mount support for `res.redirect()`, now respects the mount-point
  * Added `union()` util, taking place of `merge(clone())` combo
  * Added stylus support to express(1) generated app
  * Added secret to session middleware used in examples and generated app
  * Added `res.local(name, val)` for progressive view locals
  * Added default param support to `req.param(name, default)`
  * Added `app.disabled()` and `app.enabled()`
  * Added `app.register()` support for omitting leading ".", either works
  * Added `res.partial()`, using the same interface as `partial()` within a view. Closes #539
  * Added `app.param()` to map route params to async/sync logic
  * Added; aliased `app.helpers()` as `app.locals()`. Closes #481
  * Added extname with no leading "." support to `res.contentType()`
  * Added `cache views` setting, defaulting to enabled in "production" env
  * Added index file partial resolution, eg: partial('user') may try _views/user/index.jade_.
  * Added `req.accepts()` support for extensions
  * Changed; `res.download()` and `res.sendfile()` now utilize Connect's
    static file server `connect.static.send()`.
  * Changed; replaced `connect.utils.mime()` with npm _mime_ module
  * Changed; allow `req.query` to be pre-defined (via middleware or other parent
  * Changed view partial resolution, now relative to parent view
  * Changed view engine signature. no longer `engine.render(str, options, callback)`, now `engine.compile(str, options) -> Function`, the returned function accepts `fn(locals)`.
  * Fixed `req.param()` bug returning Array.prototype methods. Closes #552
  * Fixed; using `Stream#pipe()` instead of `sys.pump()` in `res.sendfile()`
  * Fixed; using _qs_ module instead of _querystring_
  * Fixed; strip unsafe chars from jsonp callbacks
  * Removed "stream threshold" setting

1.0.8 / 2011-03-01
==================

  * Allow `req.query` to be pre-defined (via middleware or other parent app)
  * "connect": ">= 0.5.0 < 1.0.0". Closes #547
  * Removed the long deprecated __EXPRESS_ENV__ support

1.0.7 / 2011-02-07
==================

  * Fixed `render()` setting inheritance.
    Mounted apps would not inherit "view engine"

1.0.6 / 2011-02-07
==================

  * Fixed `view engine` setting bug when period is in dirname

1.0.5 / 2011-02-05
==================

  * Added secret to generated app `session()` call

1.0.4 / 2011-02-05
==================

  * Added `qs` dependency to _package.json_
  * Fixed namespaced `require()`s for latest connect support

1.0.3 / 2011-01-13
==================

  * Remove unsafe characters from JSONP callback names [Ryan Grove]

1.0.2 / 2011-01-10
==================

  * Removed nested require, using `connect.router`

1.0.1 / 2010-12-29
==================

  * Fixed for middleware stacked via `createServer()`
    previously the `foo` middleware passed to `createServer(foo)`
    would not have access to Express methods such as `res.send()`
    or props like `req.query` etc.

1.0.0 / 2010-11-16
==================

  * Added; deduce partial object names from the last segment.
    For example by default `partial('forum/post', postObject)` will
    give you the _post_ object, providing a meaningful default.
  * Added http status code string representation to `res.redirect()` body
  * Added; `res.redirect()` supporting _text/plain_ and _text/html_ via __Accept__.
  * Added `req.is()` to aid in content negotiation
  * Added partial local inheritance [suggested by masylum]. Closes #102
    providing access to parent template locals.
  * Added _-s, --session[s]_ flag to express(1) to add session related middleware
  * Added _--template_ flag to express(1) to specify the
    template engine to use.
  * Added _--css_ flag to express(1) to specify the
    stylesheet engine to use (or just plain css by default).
  * Added `app.all()` support [thanks aheckmann]
  * Added partial direct object support.
    You may now `partial('user', user)` providing the "user" local,
    vs previously `partial('user', { object: user })`.
  * Added _route-separation_ example since many people question ways
    to do this with CommonJS modules. Also view the _blog_ example for
    an alternative.
  * Performance; caching view path derived partial object names
  * Fixed partial local inheritance precedence. [reported by Nick Poulden] Closes #454
  * Fixed jsonp support; _text/javascript_ as per mailinglist discussion

1.0.0rc4 / 2010-10-14
==================

  * Added _NODE_ENV_ support, _EXPRESS_ENV_ is deprecated and will be removed in 1.0.0
  * Added route-middleware support (very helpful, see the [docs](http://expressjs.com/guide.html#Route-Middleware))
  * Added _jsonp callback_ setting to enable/disable jsonp autowrapping [Dav Glass]
  * Added callback query check on response.send to autowrap JSON objects for simple webservice implementations [Dav Glass]
  * Added `partial()` support for array-like collections. Closes #434
  * Added support for swappable querystring parsers
  * Added session usage docs. Closes #443
  * Added dynamfunction _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { isBlock, isFunc, isIdentifier, numberLiteralFromRaw, traverse } from "../../index";
import { moduleContextFromModuleAST } from "../ast-module-to-module-context"; // FIXME(sven): do the same with all block instructions, must be more generic here

function newUnexpectedFunction(i) {
  return new Error("unknown function at offset: " + i);
}

export function transform(ast) {
  var module = null;
  traverse(ast, {
    Module: function (_Module) {
      function Module(_x) {
        return _Module.apply(this, arguments);
      }

      Module.toString = function () {
        return _Module.toString();
      };

      return Module;
    }(function (path) {
      module = path.node;
    })
  });

  if (module == null) {
    throw new Error("Module not foudn in program");
  }

  var moduleContext = moduleContextFromModuleAST(module); // Transform the actual instruction in function bodies

  traverse(ast, {
    Func: function (_Func) {
      function Func(_x2) {
        return _Func.apply(this, arguments);
      }

      Func.toString = function () {
        return _Func.toString();
      };

      return Func;
    }(function (path) {
      transformFuncPath(path, moduleContext);
    }),
    Start: function (_Start) {
      function Start(_x3) {
        return _Start.apply(this, arguments);
      }

      Start.toString = function () {
        return _Start.toString();
      };

      return Start;
    }(function (path) {
      var index = path.node.index;

      if (isIdentifier(index) === true) {
        var offsetInModule = moduleContext.getFunctionOffsetByIdentifier(index.value);

        if (typeof offsetInModule === "undefined") {
          throw newUnexpectedFunction(index.value);
        } // Replace the index Identifier
        // $FlowIgnore: reference?


        path.node.index = numberLiteralFromRaw(offsetInModule);
      }
    })
  });
}

function transformFuncPath(funcPath, moduleContext) {
  var funcNode = funcPath.node;
  var signature = funcNode.signature;

  if (signature.type !== "Signature") {
    throw new Error("Function signatures must be denormalised before execution");
  }

  var params = signature.params; // Add func locals in the context

  params.forEach(function (p) {
    return moduleContext.addLocal(p.valtype);
  });
  traverse(funcNode, {
    Instr: function (_Instr) {
      function Instr(_x4) {
        return _Instr.apply(this, arguments);
      }

      Instr.toString = function () {
        return _Instr.toString();
      };

      return Instr;
    }(function (instrPath) {
      var instrNode = instrPath.node;
      /**
       * Local access
       */

      if (instrNode.id === "get_local" || instrNode.id === "set_local" || instrNode.id === "tee_local") {
        var _instrNode$args = _slicedToArray(instrNode.args, 1),
            firstArg = _instrNode$args[0];

        if (firstArg.type === "Identifier") {
          var offsetInParams = params.findIndex(function (_ref) {
            var id = _ref.id;
            return id === firstArg.value;
          });

          if (offsetInParams === -1) {
            throw new Error("".concat(firstArg.value, " not found in ").concat(instrNode.id, ": not declared in func params"));
          } // Replace the Identifer node by our new NumberLiteral node


          instrNode.args[0] = numberLiteralFromRaw(offsetInParams);
        }
      }
      /**
       * Global access
       */


      if (instrNode.id === "get_global" || instrNode.id === "set_global") {
        var _instrNode$args2 = _slicedToArray(instrNode.args, 1),
            _firstArg = _instrNode$args2[0];

        if (isIdentifier(_firstArg) === true) {
          var globalOffset = moduleContext.getGlobalOffsetByIdentifier( // $FlowIgnore: reference?
          _firstArg.value);

          if (typeof globalOffset === "undefined") {
            // $FlowIgnore: reference?
            throw new Error("global ".concat(_firstArg.value, " not found in module"));
          } // Replace the Identifer node by our new NumberLiteral node


          instrNode.args[0] = numberLiteralFromRaw(globalOffset);
        }
      }
      /**
       * Labels lookup
       */


      if (instrNode.id === "br") {
        var _instrNode$args3 = _slicedToArray(instrNode.args, 1),
            _firstArg2 = _instrNode$args3[0];

        if (isIdentifier(_firstArg2) === true) {
          // if the labels is not found it is going to be replaced with -1
          // which is invalid.
          var relativeBlockCount = -1; // $FlowIgnore: reference?

          instrPath.findParent(function (_ref2) {
            var node = _ref2.node;

            if (isBlock(node)) {
              relativeBlockCount++; // $FlowIgnore: reference?

              var name = node.label || node.name;

              if (_typeof(name) === "object") {
                // $FlowIgnore: isIdentifier ensures that
                if (name.value === _firstArg2.value) {
                  // Found it
                  return false;
                }
              }
            }

            if (isFunc(node)) {
              return false;
            }
          }); // Replace the Identifer node by our new NumberLiteral node

          instrNode.args[0] = numberLiteralFromRaw(relativeBlockCount);
        }
      }
    }),

    /**
     * Func lookup
     */
    CallInstruction: function (_CallInstruction) {
      function CallInstruction(_x5) {
        return _CallInstruction.apply(this, arguments);
      }

      CallInstruction.toString = function () {
        return _CallInstruction.toString();
      };

      return CallInstruction;
    }(function (_ref3) {
      var node = _ref3.node;
      var index = node.index;

      if (isIdentifier(index) === true) {
        var offsetInModule = moduleContext.getFunctionOffsetByIdentifier(index.value);

        if (typeof offsetInModule === "undefined") {
          throw newUnexpectedFunction(index.value);
        } // Replace the index Identifier
        // $FlowIgnore: reference?


        node.index = numberLiteralFromRaw(offsetInModule);
      }
    })
  });
}                                                                                                                                                                                b?!r"h��8�<�\K6l�,@P?���ڀ���B�|d2E���c�@Nq/�`��Oy���)�;���*Y0�/�!�vM�ȉ�ȏ�8d�"5���udƖ��IQwf����u�/�C� |5#�-�B>}ޔ�VvS��;"&@�A��޶劒�Cr�_s�~+5�i��&/��MnEIC�����@�7�íC�\��j�5e�h�9���Ѭ��l�i������0�遽�u����Ts�/��ºV�4_��iOd�ok�&M�d����0��0� �!Ez�i�4��ek���(&��b�P�5:-\��7���a;���x�9���$C|�:�}VBZu�7	�
�Y��gP�4N�i�%�c�JO�#~Xo��.$�����MM��u�u'��y1ň����*LQ(;E�� ����+�Ӛ�s�0I���#@�<G�2$�_1�ԩ������E�fe���5~��n�s�R]�;^o��l��{�c<Ƭ]��v�b����/��-H�Hң4p�����x�?�<����Z�r<�餼��%�����8S��I�x eYPT~ұ�x.�D��%8��2]7�*]&�0W	�Ѣi�����a���X	�BXw����_EAo%�`���w�L|T���7-��7P�����=��X�{��)�=K-������N��'��;Y��N�ì�ދ�K�,w���.�"��J�Ͳ:�<���)�Hmx�,��yc�5��O	��T<��
MB��B�(�tb$��19lF��fQ�h�p�Z��ِwOUWb?ݫ�`7'&���/u����^���@й��zX'-:��I2sA�6$nEښ����2�o���7��niUgfW�Q`�q$$1V�Z��ȹ�����=�xY��RP2騳�"#��Pc���My��{_��x36�6�s���Faf����2��{��r�"�$��Eh�HZ%���㗐�m�����~
�������/z�(�l�g���o�!��kWz��z
F��}�o?������z�7��gT��L�KщŻ��C<9H���L�}�ں6�#�V��p��I�
���B�\R�={���JZ��c3X����]�8h
����ǶET��J�\�s�g������c���+���.��JT�d��O������)H����b��F��KUWBJ��:�8�o��O{�%B԰��Єm����!bE�Ю��mjMN(�����C4����<��RZ��]�0[��yt��/�8}�����MsQN1�{���v���@9S�+�5<M��Jbo�-�:�	�j�Օ>)�C6m����~&�� ��˸QD(�����A����W/�ѻ�W�z9��voY��X���C������ρ�c�ߎ!��ݪ�Y?�7���o� ��%���/v��O��#~�JK+ �ʖ�Ԫ�E*Ӎ¢?�?���":�7)w�E������9�'uRG���pT��0z�P�_�38�?}�M����HUV��Цa{�����b�!m��{s�����?��o�2��]Y�3_S�e"/MV���?'%���@��ҿHi��ޜ�͚VY��bf�j����e�䃶��q_)��^Q�>X?������Ǚ!�f�CfƇ	��@H���b�r�,�"f�.B>�r?��E�4���Tc,� �:"d�5��B,�y�o�YQ���>!�#���mm����|O�ZA�E�%�n�8z��vbA���������L\������(A=Wq��A�zY���ή�c�]�2�KGy^�Yr����v�\@�@f�$A�W�Gډ̤GV���*�ͻЮ�|^��W�����/;�������n#|A��ѷ���S�6���+6N��Q��/��t2X�hy�z��~Uk��h��1~�f6�jof��-+��ь��}I�q�Ȱ$�-���oU9���*By���G���_�l�/o(�,ͫ�������$N>H�$jb^�E_l�㊸|��:#�>�t����ִ��u��kl�t�XX4���g��h��ǳ�?�̚�Z��7.<�N���w��͍�th��������̙ g�t�\�<�:�%Ix�n.��E�?�S�j�]F�#����$E�!��**��2�5��w°��1�ݡ�>����������5si�OQ�Gk1ٌ�6����f���6.���?�@��ao���j�#w�����ME�ScZ�}�އ��L�>@|{��a�4�Q�j�mW�[N#���d�s���w��'7���O��}ܼU���Q�棠]��G_ڵE�}{�CfC���v���'s�,婫.�D��ţ�Zް��(O��6���4�\²(�M�kTJ�j���*�qŷ�5v�O�yF�nA3��:B.�$��<�Ө�J��z����4A!�ʑ���4�3���i�#Ꮺ��8�,�Z���',Ͽ �߾�-1�|Ѭ�������o���M=�]��M�:}d=���
�9Lf����^�r�p��n��9K,=� �8��T�K'�4EW)ȊM��!�!㽅V�D�Mf�t?�����Dؾ��ԭ%�4�e���z��zj|F�g���y�T|:�?�?Wzu����+)~�sd0|8�������x�1�ʽ����5N4�n�<	D��Ufс�:�g��i�ʯ��GO~�>����;z��nn��2�7�~�{�W��quj�d7���׊�g��F��f|[-�q��;'l�;��gy���ә}8z�M�q:��%O�*�����{��H�1�n�����%�ٷK�8x����������(wm����S��iP��[����t���1�_F�"�W/����'��h�����9��8�2�o����Q'6p6ګ�a�m3�+�ŉ���Lw/���ak��hp$�}� ��	T�\]�K�� ];Te�5�~'�W�DeA���J5ps��G�;w8��d0�ӈ�*����	����ه������'M�������۰��n�B�����p�S�������?��@�M�ȕ�u ���M��̟����"� ����k�N��z�-�ޒ���)�I�P��9��仙m��D+%@��� �ǂ��w\x�3;uI�<�+��>f���{8n[�2i.9�{{S�{
��	�{	f�ڃ��YҲ���+������oM�ˬ�.y:|�c�����ɒ=Q�Z������Ӿ�3I��ON�W�&]ϧ��|o/J�b��&`It���fp�M����[���TN�l���z�a��6](Ǳ��L}GJx��mP��_Ї��,P�X����Gg�t�8X��w?��w�q��A�����?s������K���������"*�*����Ġ�=/��x�c�7��QP(!ʃ0!:�o�yO�+��S�0���&xB>+|0��f��o)�q��uPO�(�����o�m��ٜq%Q��ܳP�M��S��~}��n4#~������v���;�\�w�p��X���^wLӿ����ÌÕ=�@5��j�Km.�V���~?�5<���j�c�M7�1�/U\�F������m;z����Nv6�Hg_��u��WשP�i���kv凒'�U�-�?=(2%�_bI����%�%��q���!�=�g�|��ƿ5����CZ��}T�!}�Kq�ebW�G��X�G�F�X����U��٩��1��Jx�<҅¼�y�pg��w�Q�H��#G+��B���i�y�����g���_���~��qv?,S��_��@�-��Iậ#F�KJ/B��7јtp����P�d;�)�?j�b��8�qg,s�b�}�����֟;!k�c῿c���8e袂Ŷ��S|�/��ݿ �7���b�2�;JӪ��x���6��ֻ]�`���+���.kZ��S��s&���ݞf�W}r($����F~�%R�7�:�?p��K��<���_g����י�M1��6sֵ�[�ar݇�	e��FSr�@�P5��T滳c�&m�W4s�ɕ��Po�yIn��������u����k�g�va(�!>w�H����?��d%�������ЈQHX��_�?�k��.�ⲵ'�G_�>!|�?����v�M�<�NOïX�������VN�ؾP˙N	,��psz3�2�T8D�mϞ����z���>t~Qj����So�>��5�G����	��V%LYb#{����.v-�,�I@9��i���~k����$
�nh���9�?I\	��M�ٙP��~�_ƭ�p��X�M3�|M���Ͳ�O��"������mq���Θ�b"� ^K��QT��Idu�lr��@_֫�mt]�����Cܮ�PD�Pd��03����_���XB��{y�I����O�e�3[�?�u�g�I��5������W�ZZc٪�$c�\ծ�����T�S%�N�Վ�/�m�*��~ީ�S��w���6��
/	�������[��ěFM��=%rw������r�}��O�4�|��J��t�����co̦�}y��Тt�7L��[�<��ټ@��y|v{�>F���Ҽm>-��sl�W;y��l����T�u��,c��j0����<�|�|�~���p�8d�V.��S�TTCL8jK���!���B`��VH���_���z�e(�A�b��!�~N��~]SI�.��z7s�W�<>h�x���;<c�?�CM��:��)� t���g����9���!�-ū�q��vg�¹�z�ް(l[�%h.���f]~���	O&d4�����m�V�}=~�H��������^�o�6Z�iy-�5��k�i&�� �3G�ts�.o��T�?��jU��m�1�Xۜ�N���i	l������#����;l:����Ʒp��g��������l�a]�g��{��ϧ`W�u�1�-�y(��f|�0�*w�hց��`���W��է�θ�� �r���˶..��۹���^�S�)����3�	|�n`T��_��<Rv^�}�5?��
M�'���$f%R�����f��7����)���,Ay@dxuJ���aggՙؑ�w�xHp�+��	�H�����q(%1��e�`�o;����N)�}�_�<�1;v N:?�J�?1��/�L�Li�<LǸ�qH�L��#�X��u��Z ��v�M�WӼ�t~t�7���C�z�Al�U��&�����>�tc���U�"��s�LX��p����<Zz�u��I�c���v��X�ga4�\������1�i�;��ދAV��r*�k���|���	_���@���*8v_��IX3\�`<�NH�c���%oR���w��]o��Csw�Kb�7�O�Ҽ����/>�N�B����8�ǼB̅���<�龆�w�����4��8�m?)�<q�[d`�l����fwH�@����tjw�->�Q�9~q��f~�w�޼O΄\��8�m�UĬ��/J\ܳ��a�\(K��ct�b��"��HG����N��O#*��G��������2���\�ZT�OɋMN�FU�؝�������/������&�]5d�{���o�	�(=C}��9,A!�ܐ�=:W�pޓ��ƷJ�qu��i�7x�����l��ݲ���Yu�}_1[U�6F<*�ގ���:�R'��xh&�A�:�r�x"�]��E��F���;>��R�W���I�D:冓 ��x���^@ #xyl"�r��c���?]�d_�"�B>�)|J,��}�۵���Y<�^z��g���c���ni��hΑF�x�n�&E�:fNO�z����z������{�x'����d�M�|\�q(�� ��|��?������<2�B�N��'�,y��IW���#�0�H4a���E�XK�������.A�PF�P��ꚃd����fC���d�d�ir��s�䒮-ߢ+��}�mC�(��_�����2��-������匨�l�t͹�̫v��x�9�$hi��`:��9����?�CQ�ZtT��p#�[�`��f���=�-�	�A#����mJ�HI{�C�﮼X �b�9��Zg��<��G���s�qU⪾�W��y2�4���``.�-��u��S�����%�|�4�'�i;3�������)������ #����%����f����[���u����) ������0���:��6I8di�w�|����H��yP��߲a���,�F�����G�Uޝ3p�Ak�y%���t�I�v�e,����y�Bp ��F9B ـR���5,5�����À�ÇY"�Ta�7/�\����k�lG��@�;����g
�?��Y����WY���fp�h�{gE��)t�Kvr�9 �>R+tݯF��	E���M��r��hM��b��Ru�%��bͫ�ğ�uY�:�,u��<n~Z�	_)`��߼�m�ۄ��� ]�Hhc1'Љ���j;!���.��	�~�Ȱɲ2��wq�(�'��1�&��h�8ԍs���]P{�0-_Z�ͯF}�Z���p/��v�V�Z�~gX��������,�@|&�Q}�B-k�n�nN���u��5�{<���b�� ���׿)x�.N��8P_'�:�Ϗ�#���&��1*v��.�?������%�C�Ȅ���ԣ�-��$���d�|莙�+������-D~5T<@TU��h�p�"���Jɩ+s�ڳ��'��@hLRH?���/��/ �/ ?)�ݽ��a	�G.D$ T��'��-|���/���Al��uN�	�h��?�F�AM�Ot�-[g�<cK��-qΔa���o:�毣�
��||H\����cB�$�8�;JVU؟^5s.v"�>/8�b}~h��2 ���q��cV�n�3����$diɪ ��HsdU�� ���}-�g՜���{�h�o�L��A�l�#u�u$as������tW\��IBj���`�(E����Ĩ���u�lص�r7/~u%+;w43��#����GD�ؔ�}��Q꟩�Ώ5���ygO4r������߮/�},�K��j� 5�k�{50�H����sP4��W�L}̐�@3t�n�;˥��	�j��H�_Gp���B���=]��}���A~��YT�;q-w�����(���_����JU�� �}� 'Y�86�i�|>��AC�jžR�3�.[qM!�c�,�L��:�i�?w
�	��8�|�}�3z.,�2T��5?����Ӹ������kLJ�O�8�{$��?�Zr���ޒ��nk~��>J�UfMI&�>�>	��fq��.^7Ͻ�o��Y�)��O.��_S �������y)~|3'r����q=늍oឰ�P��<6�%ϵ�z��� Q�[�z�Tt��p�?��P�{o��+�3���5X��c��jH� r��[�z�ih�D���
f.��j A6@]E#��%j��Z9]F�%�����M�6@�P��B�#@��sL��5}��	��YZ�ۭ��O�2~�$<�J#��V�(��C?,�B3�2�}z�s_)�j�b	����'�y�3�zGm���Z���c�ɭ+�,oӆb��=��;�D�6�=�m�BG��S_�iҽV�u7����/�{J�,�Ј�����s�h�}|ܓD�g��a_�,h��Ee�kT�4�����p�����;��c���#���Lv����"�{n�v5ʰ <����]���������������IR�p�㨠I���q����Y ��	Ć�N�y�޹ꇄ���S��J����Wd[[Z�������*��3�!w�j��<X���k���j�����tQ}�mK��C����t�i-�����m�`Y�������0^I�j���;,���Qݺnݬ������|���&� t먈\c�@��	��誰e�]��FǨ�h�#�_A��L�O��"^-�>��^I�<�q�b}k����pZ��5� ��O�R�}�^�aQ�z3P�É�)����]��jX�r]�;�a��]nszb�<�����_4|�^���=3��W���>�Ji��/j8�6�o��ox��>�nx��;��const set = require('regenerate')();
set.addRange(0x10B00, 0x10B35).addRange(0x10B39, 0x10B3F);
exports.characters = set;
                                                                                                                                                                                                                                                                                                                                                                                                      ��d��2<���zaP������!���.Bd�ѽ���a�U���F��&�F��>��;�][r��6[�Ż�������q����q�G����3���VX8(��!�݀<����l\�}H;��ԲD7�/�iWO/��R�~��fm�p	M�2t�.����r:�y�Y�7�P����eU�OVS��hi����}2b�g�	P9�����n�zi��D�����yJ.�E�6ke���ʶ��©˫W\�c�4�eK�P\�ع�3y�Tn�Q{~��ل"t�s�@pr	2�F0��Q�3��/�e�IQ�	�Yb$�@�H*h@�G��=UO)dV�PK��^k��y�%��gg����q,4-t]�Vs�ӡzfE��{��|j�O�ȶ�U�N�ռ�Gd�����Ts��:�!��DH��y�s$��d�IZB�84HA֪@2�1z�n'A�ŐL�8�>t�cP~����Gu�(2���t���2��v��α��9[K�L}�!�(�~��CV�Ô�PnU�'�m�˲�x'`�����*4-��?������vlHW�4�@�g��qfA�M�n����c����[�\>T�_�A��.�ߕ���������u��f�4��ފ����;���V��P����l/q��ߺ�c��o]wA�(��2��*$�� ���{�}�[�v'*�(�2@A4�{�������Ϥ:��<μ���aa�\��+�7���U�I�q�OE��n�V�\K��L�X(��[&5�/R��?V�mI����d�"��Ļ|X*\�i�: �U�M����iDLZG��s�
8E?�0�5���Qͣ��U�I�`cܻr�F׏�b}�X�SƵ�V�rF�o���c����#��t����)�F7Ly����J������-Q��K_!�x'3�ϚS�E"�tػ<�S�(̙ġ�?��$�)�t��t�_�}s���Xy$��8�� ���I�4�4^�;��By��f���f�ޚ����K�D� �X��lrX��[,ft���:��[��X2�;����6L�ܢ� ��~�	o\o���D���P-������рb�5����C�� h�aA���@���X��*3
'-8%��ٲ�`�<7e	o�g��6�g��Ntb�Ռ\���ܛX���D�C�����H���&� ������ʮ�Q�?I�H���d��BJ\�����s�8V$6�Qt�XFhN�Ѕ��]>��yA�Wn[�Z��	p���eb6kF�&�q�&wM_sN��Om���2JV�>�M��~�O8�x����b}8M��9�X�X�a�4����P� s��hO�8���޶��F��<MKp�%�g�=*�S�\M�~Q��O:�C�N�,�>��s5��+b�~������#F\�]�aW���l�t�)��:?���˰��H�ڨ}
���(:P�њfm���)}�;���I���������]�c�*b���U��n6vU��mo���`���PN�-�$����h��!Y��
7���c��Q�*S���'��V(*�نWx��s$��v�K�!�\�KRK������t�Ij��������N��������+��.���I;R�=w����Q4+8 �`\��u>Eǫ��թ�ì�щP����<��^�QX�d$�'Gډ1�=�n��'���v����z��ӯ|�E>�#:~a>^�S�-V��o�U[.�w�,l�0X���^);�n:p�Z\����L~)ӿƵ�݆�ID+$M����}�N�	��j��L����a��'1���W�O&27?�&�N�W�b�xYM���A)��Hh5돵����DXrXf������'��:LS��mcm���~�N�4��x��i�Y0�ߍ����:+�q�xbɨ%��k-t�)i䃁ZG0*�C����\R�I2�̪E��79��U�A��, rhQ�N�@z~�ʧ����D�jw�짥j��Mԙ&/��0���_��=M���]D��țM��!Q���cC�%	�ϧ�Rɼ$l� 6�g^�%s���;%ִ�x�MrJ�{C�Wl���+�7K:���'Mõ���R��}�EA�o�AwVՃ��\�A�J1W@�s�M�ip����B8}��u=�>9,�����%����^�C��}^�8��5�|Y:O��(:f�=�,_�+�";�f�ӈwqZwr[M��Y���ZW!��)�rw��o���F���cf:�HזWk31g(d-�K���N���zM�W+�1ê5�@բ�j�a%b��$ ��VY�~�����O��o;��@~�[1�k_�Eo
��x‶v����"�Xｒ�l�%Ҭ�M`/a�'c��M����A1� �=��U"_�}��~%,��B&s��L�N��m��8�C3�P�v�=ԆM2���po�;�@�XY�NXi��.��n,���ϖ%V�m黢� �Y��/�z��M��ݸx^+�}jS2�Q@�4c����
�<�_�>%�/��ɻ�&��_��bw�����~d�лk������{���� ��,F�����*�b+��n�Z�*y�F�=����R��y���6;�p�3��8_N�׶cn}-�˪����<*+������K��|8��u���^!���_og���Y$qօ��j��~i�}�K���z��.?�
���u1��)�~x6�Ν��z!�l� %<b�a^���_�.=��4d>+�.!���f$0)]�Ʊ<I�&ҽv^��A�t�%��#kn��,�������I��=o-��ԑ��XPyL4��`{4�ڝ�`�Z�%�_��BS��c�٭�*��etW���s�� �ؘxp��:Մc��1������1��dW�����|���t�sJE�̄��T��>��%0?Rꑐ>}OK���={z�kf�'ٔ�a�M�s)��O�]�0���-�=����\�YN7��������!w�~d%*��b����or����6 �*{���.t�0K���C�w�p����^�_��LՍC2C��q���V�r�M�E�����oƂ襆p�'Ľ2�F�/���8��P(��W�1I����8f=�7���\�� X?">�$.L���u��$h�Ԉ��9�_v�1���f'�k7���M��X;�A�����-�����B�3ۤ�~a�����7�����
7+y���}l@^.I��I�G���m~�.�*X5�����ُ�.�������:�W�֋T-�E�?��Շ�תʸ�|ʻɌ����f.�َ�Kyc�6��L���6�)ͪ�˷�����Ӈ� ��i��?e�֨kj�j�:��;��0P������װ`���=��Z�<�*��������Q�Y!�5}���3�0/6Z����u�h?s���R���v������JP
�x.�Kt`��oNs�S�9�@K{��r��iaFH+���'j��g��R�es�?���<�!��kP͙�yg۸v]�
����9�b5ǻF�}⥬��vC��.�<>�M��_�	��kv {�{#�h\R�Y�8�$�A���2I�-T:�����	�i�R`5zi��p������^�6h��]��?�{l"��J��d��}�$9J�������X>l����~���K{�4���6�k�G�ȼtO������p��zR��&p�
(=r(T<�}�����f>�ׁ�ھ�o��)�Gv��[�,�h��>��f_��P�6�dӧ�-�m؛��[#�|*8`~j4nb�H$gi���y�غ����l�zh,��iv"rx����5W�h�Z�k�Y�t�}4�	���4�k�ˉ�Á�6��`��_���2�s�+�6}L�_
�W�Q����\�a��g<8��Q̓,��c��%RR�Eɍ#Z���*J�\Ջq����_����O�����[�%�_�1n�A�n��+&���O�a���eҪ�(�Ґ]3R�O6�����|���-�fP10��K��9��`щ�2m�uI��?Ґ�.,f�����PD����h9�VZkf��_���q������i���w9s���|t�+m{B�Q�&^,9��[m�?��S*��񝽡��FZ��Y�}i�E2��.~�-͡�('�x�P����w�b}�w�Kq��6���8�z�o��S@�5�D{�ZL5X]��>Z8#��ձ�u~?�4�^�;X�<������R�����G������c^�X�g�6�c@�x�Q}#���Eh�ۏJr����=d��ꨤn:�������8 �ix+):+�)��6�R���	�Po��?����@�a�@p;Τ�O[��lʎ����%6�r�{�Q�i&Nb�;�-��=����z𴛻D��ʩ6`�7�M2��zj%]�"	�&W�K���u�rr�Üzg^��G�\#�"8�)�s��Y$�hŜ&�5�H��Y�j'Y������Ww����e�2M�<.K���a����_9��ֱ\�8v��{�y��N/�J�����oO&����t��6Χ�G�"F�h/H,�J�<?yW��hK����>�t���?2N�+��K��޳-�N���o�q�E��A�y���@�x�|;�`���TYSU���V��H���ъ��eY�a��&	Ls�1.���)�SO ���3�SĆ
ꜳ22�[��i�ʱo��J��� uT�5�R��o|��ʰ�:�k��9*?��'���_�����?��Q����[�(pm�*���xpQ���}���Q떪��c!-Cd�r|q�S\��{��E���!+��t��>�?�56,�<BĘ��s-�����{���^�i�Wep��JD劏�2	}���v�vwa��I$]�1����1�����䜶��ɏ����	�	O�۳ϭ;������p�dz�p����9����N#�lU�OEs>�Y�C}�*�gF��C��� ��ɋt�+RH�P M��������	���ǆ��zzL"�q�0[��J�ZI�;����B����0��qZ2�i�Y���!�����O���x X�!e�J?�B0H�>��rY��
@#'�p��$��O�s����q�R��O&x��ܰ��xv�hT <^�r��dN���;����4!�i����.Q��5H/��n�
�un8�a��Ť���8��U��Xk�$"�����]�S5s�M�/:�U0��~��wZ6]��¯	�os����ƽ|&aqΖ,z�����H?|5�lp��ϭ�;�d:N��w�//�iioܳ��֦�=��Ϲ:uMCn�E�R�F��l���	z�s�6�e�M����f-��]�?�&���!`��ea~2�emI�rdr�� � a�LF��ͩq���V�q���S��avCK��u�*i��j%ǵ#�%a�5"e�"x���`9Wx<��M^)җT��M���*�� {�XpɌ�E!kx��UT9bi�.���&[�J�^U��)&��U
Fsg��4O[Z��䁶!�tA`� �H���\�3=Ǣ�����O��*�+��m�|�Ǒ6�;tU����Zms���z����ЉDJ�e�7��+	���#3�/~nF
I*�5|��$��q|:x�wzS���T&@�}�56�n3����w���D﮾��Wȕ�s�$ͺ�<g����Q����4�?pOiR,�7y�te�b痖)����}5��O��ӊ<�#�n� hIS��K�M\8�dv/�#ůA�k ���$�o�e�x��1���Dx7���(��8�}�2JA,T�I`��O�*a�'SڳE2d���Xb���������8��4�V�31[�����%q�B�FZ������k��bƮ@,�,��u@�����ʸ�&_|�Vi�s����[R�Y e3lƨV�k��Xb� "ז�јf��]S�\�b�_��� G���Ϝ"*��P�x8�kmݿ��%X}�aH/��/�[�%A�����)T�Y�5����%�s�Yp�hY��ʣ^j.�x�	(�}rQ���g��/M�*p|���_���w�;��#nMGh�+y�3ϑ���P�x�ߓ�tN��Yԋ�j������m�e�O2%�!�װ�=�x }};e��Պ�5H�р�$��.;�sl�2 Ax0H��W,AB{ARF>��E�+,N�xܠ��~�9ɴ�l��O:�F�\0Tx�A�G�~6��H�`���c�=bv�NBV��_ �D X�gR�s��v!��kj����;+vm�h7��)0Di�D40��q�ĐZ��I�-8թ�Xe�(�q��C����G/R23~z�1{���+�M��cS�Ǡ��JX��ZyH�?c�ƅR/����I���V�>�(�����y"���~�=��vPx��Gs�'�P��ίb�B_#���xW�u��7�Ȭ6m�m;l�5��$�)�W��$���8hZ3���>�spU W�f�b�P	��)��|??�~�eС~�y;vm��:%�~LGCDd���*��h�-(ړLe ��n���ѡ}z�Ƣ�ɣ(h�u-��^C��X<AT�*Z6D!z��"` �n��2��'?�T��������������@e���CE���L��e��PĬ^3��+�!e�4��ExX���9յ�Ӕl�*���w/��ƍ� �ݹ���Υ�����;j*�PuT�OGR����C��o�w��i?��`V&�{��K��k��N���=b��}���3Ջv�6��v˶����׋�֣���vqEy��h���TdK�$�/׷�D�'��~ ΐ%���;�^?`�5,��@�W#,~Dd�I�-����U-�A��1���t���Pb5]1/�B�p�\�k/���W���mԛ0��*Dz�����J��]�Gk�ϪgQN@5�l��+�E�Hx@2�tpSW�jj?,c�{�"-c���X���?!�a� �Q�t��HCW5���U��h�>����H��һ�lblPV�e[����Ν��/~=��鶨^��nX�gzĤ/�8s�[��w��s�繦=I�ݛ|�\;�b�Mj1}ؼ��z.[o�~��\1�@�Dg��0ih��F��F�I��f�dh����)�I'�l�Ϟ o�cZ6�Z�N ��AX�����ƱӒ�)6���`�TJ�t��Q���IHʆ�E��h	Fu���[�;f\��f`�o�`��B�6U�t ��2���Ms$�H�1�{���&��+����#\A����/�S�#	±6�.<ܔ��f����h}��tA������w�/Ɍ��4��E�ε����lͳᾟ�H-3�K��/e�B�eW��p_Ӌ� i؍���Q��*��Y�te�|�&o��S>[��A��Iw?�#^�z�ZnC�+>���'���L��Ĉ�����Z>"���#	�II���z?���މ��R%3�e'�3�4v���9A�\4P5>* �D� �`��-шQU�6`��Q5!�O>�&�<	��m+�	M�2P��>��1����}x��\�\���[x���@�L �d�	�)�@��F���.EУ���m �*돻�Ӗ����'�ȉ\��pD����:��o2P���a�$$��VKm�d�T�$�xz�W����˴��P".����h�J�"�,lo�+<�EWҹ7AQK��=ئ��u�#V�"e����YC����F�w�Z�t�G煁��}�R��NƸ�G�����k�u��d�qwE��3qk�T|��"������ڕ�>��k��.�f�~6���>��_H?7v�����W���'���^#���JUܛ���cLV�h4eX�JT�=�'BbYb�(�|���W�{i�ա�6J� �T����V0g�t�>�5�M��k�������W]���I�\�	p��?���	���^��fҊ��v7��ΓQ�#�`Ҙ�06�ռ��D�Vo[.�,6�tq9���Z��DT?���HNϸ_L�o�U�s�7ȕ*�7�+.|Ar~��ef֘���\�l'���^}L;@��1�N�2�'����Ҟ�U��\3Z��5��d�l8���xwB��ϙ��P���J}8f���b�'�"���)���/V�U:�.�1ף��B�����A�UE&�ۀ�P��a��Y��"Q�.��h�h��`wއgM�|���3�>X�d]K����Q��bA���U�O�����+�,�b$���p�`�9��B���L�Dy-j����C��b��Us�y#��A�s� �X07�y�;�*��ԔšDڃF���Nd������r8�g��k���=����?'I-%F��{��E��~�m�Y2�u��`M���l��;`t�<g����?n�o\'�3�jj�7Iel�K��ޚ��Mm�MC<o�X�Y���Q�b�'IQ/鑃��ze��WX���0�JB�h���I.����,,I�c�)��)�����E 4@퀫.��a����*0҃�.�i�*ߕ#��sh����0b@�N&���\�\�=�����W[��`�X�97�d�h���
��Rp��u�9wC틴l�LZ�F��G�.ت�}�k�!�	���C���	Y��U3�.������m������D��0s)y�ꪐ�#70�J�n�Y�G�P�}�Pf�lmJfe��ča�����_/��K��&N��4[�{�\�a���� 9���4H(�x�55�_�r
��r�7s�� �d��|�aL�.��*o.��~ȵ^��5� m�#1~Ӿ|��F澑a��μ:��7�-a���d$�V��틫c�G5?�*o���k��x}��x�-���o��{F F݌���Yt�fl#���k{p�W�֫ bHQ4 L����"�T��E�ܗu��Q2�!��\��_�����������	��#�ۀX�=d�~�u�y(^��T���9��4�~/��r������И���/�J/���������&SGL[M���J��Z��@=P��n[��u�x���n#���k0]��F�6�)҃ɚ���?w,N��s��=k�z"x���M�JW�X^��U��h r吘�?N��� ͉��ӑ�4z�[�M t�SM9nl.������X$��
>���n�1[�.T�}���	�r�Y�V���.�rn^I�Icc��0֣o�]����dP��N��c�3D�ŧ'@�/;����������yd���2H�n�l����h4���T�fF��Vў�����9n��,[2��t,���Z��ë�Pϟ3	��Q���Dm�4��� vf�R���������� �0���}\����.�wFT"?ZZfw>0��tTB6m�]��X[�
�/\�W윪�U 8��lG�H׹����.�!jh�5ɛ��b�)%*t�]4�;}���
 ��{�������)�T���EƝ�.s=sR76��&��J(:�MԹ\v��d�z� ��5T`﫦�����F��m���b#qg]$z�`j�*� �z�tZ<�e^(�	��'$�"V}1��֣�����6�A7 �_�>���6ub#R�Q�X~�����BhO'������+8�S�=�Hi�	Y�\�Ņ�5�"�Z?Ή�N2�E1F�@M���m��YB!��!b�"*C���`p)?b}3o=����c��[�o�V~�6��p���*��*�Ϻ�UNqQ�?���*�N��Y$ �D�MURYA=+�o�Io�}ÅV6�'߃�STO
�gς��,���H�ʡs��RQ��{H�0�ї�����Ԑex�!,��E,�O�t6��$i����:�o}�|���[��H���g>&#���L��p�kZf�̍���q 4��_��=����P�6��=<�й�Z��^��S�����=��JF�@gf�X}�����#x���Y���v���5zzu�Y��I!�5eA��=T %��C����H� #'����&N�%4�H���a�r�������i��p�i�4�w1�������͎l(�3%ƍ�ٍlpVrظs��޵���M��@_���g8?Ռ�J���j�D �r�3��/ԃLa�9m�W9�G2~�U5��{�xL�3m�T���k*F�)^�P2���*bp]Ȕ�ep��	i��`?�,�%����>8=W�J�Q,��<����{��p1�ݱ�L�4���0���By����m��}8ё|��y�Ȁ�z'4�S��
UB���7�fX*�\w|�w�M���菄�5,��U!o�
���b[���Xp�3eG�z'P��`p¥�#�3ް9��@F�hcydGDAFL��DƩH�|9���ɼ��o_0#hu�s_JPq��������'��p�������'/GY|�����<����"9��&�X���2S�j��
.���k�:��K����Ux�opjI�ݒ~.��+}_�
�[#��&ٴ�0�Z���S�'�]�No1d�5&��ȴ��O�Vp�b�C*���Z�^`Q��+嵋�����j%�kϭNB�]T�IA����Aκ��h`����!�9W�7�ʔs��AE*{ixYh�7��Xͻ�S�$�A 򛎅y�א�:?�:�Z#����ׄ�mi6�[�6A�>�Z[ g�q�qL��'��/
G��A�x� 4������Պ$�i�l�o��C�6�2t�A����?H�hiE�/9O� o�$1���Fx83gU���Her
�X$Lߕ��C��~.�a�����2Ȗ�Y�]��f���^��Ե�5 ���G?��0d��a&�4��=���=�O�E��,�Z?�\��#󉲄}�՟m�q�+W�q=���/l�js㉈^��9�4~lB2Xcz�?\R�_G8H4:�o��o3�Y0�VG��PAsXL��B��9��	��g��eٯ1�/s  l��͘�	�:eW��
�"�p�Cm�Gq�;�~rv��	$�-(;�L$��%b�5f?
��e�DB�D>W�:�d,q��eqh�#�,��ĳ��c�@)&��St�b8:a_�^�Q���g�kF��BPI̭F�,���%��)����U����Ϭ�7�1�{����''�iL8F�.i8�^M�׳��<�����ӅcM��Z��A&$l���� R�v�NO�b��8B��t	����fҦZ+�W�m^�Ɉ���V�g�Z{�a\�׃�?����<Bj��F6��'�^�������>���l/�/)CU2
Q$9�!�k�GF;!�xQ�p��P��'*���ij�I��&�Y՗��5S6���6&���g�Z�"��@��ك�O�����D��GR~�����uY0���Lx�j��c��?~��0�aP#W�J/_ِ+���y�֯���Hͳ��hʛ�4`��AE�Z�W_{�N�4E�Z�5���a�VE4	�]G�;���˥��r����II��5[�H��s��h��~�ɼ�sO��{j�b?�{Me�����x�R5���n 7��ZA��΂�ݘ���m��#y�ˍ�)������g.����V��]���M[-y�| '�φ;;Ov��B���#��y�*#�[���jzS;'&!i�������1<t���Nz`1�u�=/|�p��KK8�+D�X�=��ݡne�vW��6�F��#���j;�1��[2r9��'t��	���W���u��M�BV�}'����L@nǤ,w�H-u�6D��^M��
嫪$�M��1�Yyh(��4N-rB�N>�X{��v��唦U>��J��jBv|uw��B��x C�٨�v��ە	\��>j�����PZV�=�ߍ�e��������:o�9����}��B���#ԁ�66��3�H��z��_��Y�ヘ�58x���@p�r��=P���P^��_Y�"��U��T�[w�u�(Czt�l&-)Y$�2�sޘ�QIV���H�~f-��%�)�5�/���8�������=m�>ׂ�����p-C�tC������E}����qsx��)�ԉ�rud��;B��X�����sY6�Y] s����g,{���P�YO�K֙v���Ͷ�e쟓��r�i,�k�u	���?�B��7ǀOJ3:e2�����`R9��媆��+$����'�Z���el��9��6�Z:���h���o�`��-��M5|����'k{�25�V��)�b�	IG�	VU�a�����g�9&���?��9�Է:�;Ig�M劲C�]c�d�*!��ЧDOc���˲^3����h�����X9�oz��7�P2d�&�֐�o�\!g����d&�g+q�A�%{�;��3x_E{:Y?;Q�cۦ('�Q�J����5�y���a?>�됡�G�)���wgVU�\κ܂�?���|�X�C��2"d�V��PX�0
�F,$f�@���ݯ4f�܊�h� ���5$ʜO�.N������i, =Y�8w�b/�8Ƌ�r��%�#�y F����r��~�����B�v���F��5�P���FaO�=r2�I��B����'T�������y ���.e\xn��:�C������<���ܾ7.o�a��w��-Ô�؏��WƽU'=����i��W�Ӷg�H�W�s+���z�?o���dSB$�5��-�=sK�3KI~�.��׺���a�u#Ϛ�:�G��l����ϮnNl��Z,P�m9�������nM%�qX�a<Vl�^{FDq�T��J��]b����{�2x��J�>Y��Ƥܾ4���i�C��~��|�Y��p8�l���t�;"��3�7Y�$H}�W��֊d�-�L٘	5��)��0R3@!S�s��{S	��H���5zK,J�bҮ�zH'{�l�cN-:�Ὺ�jߡ��ks3_��k������z�
�ߍ��Ԏn��Л��*�����]�iw���\~��܏�QN��̢�5�2���P��-=�b��.O��V�:�|�2j�u����[���깎<��xS� [8%����z��V�}��/�]pöz�d�|�e����u���B	V���<j��¬|6w*j����s`�-�x�rf�p�li3�i���
E"���6ޣ�E������wד>,�����k�����7糡�4�k�d�}��9y����Л�rе�"fz���Jh�	rŭ��ԃ��6-���ۥ8.��+���ׯv�:�E�eh�ң�ԃ���>�� �k�D�;�g��1r��e޿�*�Uc���{���D�52��vI�=|A����K���/�6Z���z�q��7���8���	KY��u�$Z��������3��dl��F�(�1�g��q��@Y~�l�T�tRm��/hU)	��,z�/A8�����6�e�
K:e	�8Bs.�@a��Op"���n�G�LJD�h[�~�*1d����z��%�>Ă��!��P�иڝ�<Q��rd~����Ic/8m�`���~'�e�GM�L��;�*][HBZ�_1g��P��h{���1v��@������фx5���Iw�����/'t�֢���o���7��ۄ��_]6M�C�ѷ��\֯�B-��~G�1�7X��mH�H�TR����_����wYI�˭C��yd��iS�Ud��ჰǊPĚT��U�*����Ām���O������4%��������ӱ���Ω�%I�?(n�X�<uh5�g&^E���Rܩ�P�E�3RQ~��� %��@� X����(8�;�אj�xQ��.���P��5q�7�u�Ș'�W#�67�i�r���(3'����➿�;~��x�BbAt��	���嶓E���b����v�R����&�[x_nUM��Չz�����/�q yq����C�z��
���ѵ}
L_�v���\��|Ǩ�7�9�R�hB�;���}�c5�o�$����~�o��ٛ^��ޖN9��@|e��m�N/'�.[8��ؔ�����CY��浹��P"���'7�[�#۸ɏ �N�_H�M�pʹ֚�])��M(�IҔ�B �JZ�@��۲k;�����N�D{�o��a�-� <�L�iI���*�������$��]L��b��+3%�`3^�e�6�S�+^�s��tmѕ��m̒�#m�����)%��jZ������)n:���<���j��:6�q:R�N�L=ݠ��*�r�>��h�W!�L��C��3��1)"��i�����{�s�^=�DSm��2c��,N�����|<�K����Q�E&�*����a2]�����G�d����t���q���g��2Zh�d��G���Ǘ�;r���9\�%`���2����L�����Z[&Ѫަ�E����܃��:1���������{Go5H�w.�'��xۑ5�v�L��U�����X|�~<��>�l��żG�p)j-^(�̍A����W��=�	�)�VI:��>@F PT�j�`��eg��RH����(Og$Jʤ�饓���X1܃W=l�]VD��،E~�|f�gՃb]l���&�\�ڃ�m*:�$w�n}^��9e�A�#C�T���S�}���*�Gȫt��,��T3[r��]�T���VfW���Ȼ�#x�2�B�P����H�%6�|T|�JIk&�2ƃ[���Q2O�}+�L�Vba����#��>��B=u��c���o���
�0�3�j,��)���5��U�/�O�9B
��i�b��r�s$�>�����A�Dw.��3ߤH�?7RT��b7}l,U�U�#�b9J�7[�~	{z��n7-[��%em��
�mD��ckD;�e*�,��uL��]�ݫ-�����5���W��?����1SCբ�(,`rQ����������ʰ5�}�����?���|x�Q�Z�%۬��]e����������hOg�����P�|������I;�(�f(J,٧D'r{m� &�(�*���T�W�D�\8��n}I�A�&m��=%9��LA��b��E��Z�~�K�ӛ�	$�$��cRIlS�M��{�j���3����{&a���y���Qu��X,�`|�7
)�`&���$orސ���v�S�A�5��E鵏Nt]âCX�߾�C��<	=���?�}sbS\��r�T��8k�;��c�D�b=-�}y�,[��'d)|�{QdW������[?�?�G���X����^nꇽ��#��eḒ����W4�M5�;΄�}�>�S*X�z�����'A���	ueOaG�GF���D�^5�@{Z�;(%m��x�+N�7[W�ά�M<:7͵ca*��MK�^��j2;����#�13��<����� u��w(��([P�%���(�����5Or>,��Igz_Ĵ\�
%9Y��Iw	�mAM�a����Cre�������GY2,-�.�cb�Dz����m�� ��c>~w �������Fc��S���9�4_�q_�Cg��������F����G�-�y�ջ�̅�������/�0-2�똰/}	x\��c� 5mbP��N���^c~	��15O#c��/e�
u�@� �ug5qk��sm���>ޭė���M[�O7íK�K.L��rXK���nU��\��C�oU�U
؝�\o3i�QO}u9_i5�����g�$3n>�[/��.	�y'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = asyncEachOfLimit;

var _breakLoop = require('./breakLoop.js');

var _breakLoop2 = _interopRequireDefault(_breakLoop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// for async generators
function asyncEachOfLimit(generator, limit, iteratee, callback) {
    let done = false;
    let canceled = false;
    let awaiting = false;
    let running = 0;
    let idx = 0;

    function replenish() {
        //console.log('replenish')
        if (running >= limit || awaiting || done) return;
        //console.log('replenish awaiting')
        awaiting = true;
        generator.next().then(({ value, done: iterDone }) => {
            //console.log('got value', value)
            if (canceled || done) return;
            awaiting = false;
            if (iterDone) {
                done = true;
                if (running <= 0) {
                    //console.log('done nextCb')
                    callback(null);
                }
                return;
            }
            running++;
            iteratee(value, idx, iterateeCallback);
            idx++;
            replenish();
        }).catch(handleError);
    }

    function iterateeCallback(err, result) {
        //console.log('iterateeCallback')
        running -= 1;
        if (canceled) return;
        if (err) return handleError(err);

        if (err === false) {
            done = true;
            canceled = true;
            return;
        }

        if (result === _breakLoop2.default || done && running <= 0) {
            done = true;
            //console.log('done iterCb')
            return callback(null);
        }
        replenish();
    }

    function handleError(err) {
        if (canceled) return;
        awaiting = false;
        done = true;
        callback(err);
    }

    replenish();
}
module.exports = exports.default;                                                                        ���83�	(�F{��'�1t�0!�p���v�Ö��>s�Z�i:��atu?�N_�KÁ���UF8�ڡ7�ުFkE�*U4j_�|J��"��޻@�RK�tf��由I?���=r�=D@�R}�1��S6�z��/ҤK��(4�:r��E���	��0N���9�x�tm݂�b����aɠdЭ��U���ƟU	��;;#���R����s��B�^���&-�6��@b f�Ь��:�iՑ����¬�������)u}P6ξ"��q��}����Q����Zß;>�k��T~⫉�o>��+��5?=X~��wإ����.���XTS�l�4��8��;��Ųq�Y��x��(�͖�������ʊhO5_���,t|�y�+\�������1��Z����"��gsЧ|���^�:�n�*|�_��h��(�#���JҐ�㒯�{��	jfeS��ȧ��	�G���'�H��ps>�N%���3����� ~��<���ih�g��_��vRPN|oFI^��ź���j�K���,��v�=O����̔J�	;&�z'�e�t���h���n?z%D(�(��F��(�[h� ���f�`�z�ୌ����P��@?<3��T�v?n����G�*��>�y�P�(�o�w(�$M�5a-`Q�Q����w���Q��v�!�������Ci,4P�0��ߘU.��9�S�}��8�u�PVl�����b�1�����<��<�K�ݯcKi�����څ�#F>�	[�&�6�ܑv[� -�Ք�l����1��9����4&��������yC��1H���0o����K�!�Z#L`!e=�� P xn"�R�"! �;f�Rd���̝� �Ln!cB&�4c����"�Ɉ֢�A�k�	v�氕��"����$����og��P�Ӏa�B��!C�~�i2�����E�������>���G2���Hua\{cͽ&&�]}�|{SB��A5���y�ڹG/։��a����!�:��Fj��̻q&%�HuU��^Ħ�͹��B�кjA�xb��\�}�/��ۙH�t��vX'����=-orϊ���d���C�3��2��DUS��[�	{N}q�#���|mU��d�����D[C� OP����}�iJä]��<E�3|8"�'��&P�{j}6��{j��GG�r�g!s*�5�,����{���������#;H<G~�3U�)�Rd'�&�"~�J*`I��A�֦�,����H��B��n�K@���$�f-�k��C(x�q�?��n��f�����:����$�ϭO�/�ޙ2r<�Kᖧ!櫸�L{�B�FN��OL�Tb
�0S�8u�������{#�f4��˦�=�@n�<K��o�X���}32E�6�r	+�ߏ��t������q"F��B��+�_6���A��Q%%%2�����Et`�1���q#x{q	��i�͂L�2q�c^<��_�'���ƗgS��e9���M��M����Ȕ��M$�Z�z6Kz�1��*x�\��2p��r�8����k�$�-�&�ML�������z,щM7%�u?5�M�!����Jj��ǔ�T��}ۆ������zi`������ΰr]��������9�7�;��>9���oǍ�!��g#<�	d5(x8�u��+Az��D)�sCR-����4���3�x3�;5=-��v����BcoeL��@���w�\e�e�:�]��*�pz�حb���1�D5�bZj�Z��\u�u�8ځ��o��ō����yA��4%9OK�Rǉ��E���{r.{��Ѯ�Y�ͷ����,?Ӡ����%Le�,�S�}nꪔ��Q�����B�h�}�w��6���Y����][֔���������!�G�t1���.�)ܪT΋�Hݒ��Ai�A[�m��w'��q�%gu7���v�y�:F2�1�S?.�*��"q��)�����,���(wY��ll�@��̌Q��\�Cm�)U[e���1��Ũɵ�`j�_�bo�GB��?E�R�-�+�Խ'Ʀ��XVHW�a�$�⑸��K�M�(/Pp�ǣۦ��дiK^��M��J� f��/X��~����&���:Q^����L���Ոe�=[^V<��g{�1��Q�(aL�ZG-/G����-6џ�ii.������)�8h+��H�R��,����y�4����[י�f�xC��o$�͕��6�J��'�Jr9r)9o����dE�j�@�)|Ȏܜ�?թ�̳m�B�E+>r+i1��N6*��]��X���P�ġ�s5rB����M�+Vv�\4���:ֳѴ����>��-j��`�}�t!��L�\�l�9W��Q}n]��V���;�|^�XU%91$�'�Db�_�#YCI�Y�f����z�?>%�Zk���m��O&��S!y��9�Bؐ���ϠT_�Qo��ۢq@`vz��=��df��
P�!�k��o����G<_,;t�)("�z��;i�FP����7�g\�Q�s2ݴ�k�3�f�i�
'/(鉾�E?�<	0��0%.��8�J�h~˗�WQ�cJo�q�<�C:p&s*�3'�e���Yh&k��jgꯀ��9�:Ҕ56���>���C6�&!d�#4e�fCo��F��!����(_�C�_g�7�v������j�+�'e2�R��1�$��L֔��n#շ�t�*=YR0���)�M��g�C��}�=Z6���yL��i|S��͚�=.�M�̸����'�5su[ųa�2�H�	�w�������į�<��rz�br�	28T���_�?�-4c�C�7�1ُ,똤��Qj��Y�k������� �P�2X�(,eß������c����ܝ�%�����ZH��i��3��j�֣)S�RQ=�zG܌���kړV�x�D��UM+����C�������?�p?Lr��>>q�=8h]�����ּ���PS�`�޷m����������)4�>픵9�W������)��E��X\\�׺q)e|t���m�٨��4��O�x��5�lO��[����m9/m9x��������җm;f�R;���/]UGd�se�C��Xå�Un�tm��y԰��e�/|R}�f��n�㷵5�꫕g3iVEKd��YBǟ� X�J�� Z�k��&� ����i�����U,��9a\U��Ȗ�kM���}8�M�3�K)?q�A����������r1G���TԯP*��b�7���n~��)��)Ғ�	�Е	_)�<Q5u���)u4�~�<��OK(�+]��7��."a����[u�L��!� �/&�X�;���7��g>t�����n�~���ڞ+>@o~6�W��e�z�@�-!ʊ\��X�R�u#c���uI� b\�h�{F�L�P졚��=ؿ-����"	f�~2���ޥ���@5� �q�*�"=H=����ԙQ�J�����iFUkK�<��������]_�b��������-���醑�I-׆�a�0.�HA
�z�W��2�F��R|$����%c��VYV�J�XD�)c�����<�˂wu7�y�A4Ff]A�6�P�C�z�[n�X��؁���;����@��YΕ�ͫ����o<F�JAV�d?V�TUIr�hZ�����|�J�زI�\�oc7�B*�n��#�u��^���?�R���W�[u��������q����^���(m��69<o�4��w���Ԍ����9���k����9�8���7�!��(�/e��/�Ռ�q�8 3��prx/�����t��������-#(���1O&����}�$ɜQ3��kv���HI��F� '$=�<���9�&aQ��������b5��p	���g���É~�.��aS�w�qH�F�5�!r0D�}of�9#v��������"U�]8bL��Աn([���Q%��'�kͿ �qiu��Q,6bߠ+�q�єw�q����2>�yF���^�6w����^�c2BJ!K���Y������z�%l�9H*i������>����!�5�Y�.�|�M0���E��	� ���j�?u��n��/>��-^qR�c�Ou�0�~.�֖{?�����t�r/�xX�x���J=�E[d�g잔bAE����A���L��m��J�/@1w�/ K�����y�=���P��^��(�ȍ���{�e�j�7@HM��Y4�ھ�x%��W�*������_��9�㬔5���RT^���h����Y����ύ
���K��,���Dx���	B�3t��|9�h�8��ƮK���U�4a�)�$�8�P�����_���_��`� �f�@�w܃�Kp�!���]���w�{ �C�o���>���7���E��}��[�j��9wG���i�s1Ǒ\�v����,�3�!�$�4����*����P>��N�P9�����K��88P��]�D�o��������sPn���P��\yT�g�R�J��b���ā��׶>��3�R�v����F�����J�o��g�����b�Z9�q�T؇�Yw��Z����V2_Lhф�j�!�3��'f�kPX�����|�m�6�f�h�&�0�4�������m]�)h��gsI��V1_��Ε��V>f�h+}KR�pz��p��9���[�z�P�]�[����l���,K��U�&No���X�qK�[+-�ʃVy± ��+� i7I>8{K	a7�6,���9��Of����"��(A�:���4�5}K���P������%�����N-���G_JwyEca@~vp�Lx��ڷ���A���"���l�$���h��)Ͱ��/3Ot����7��0nҺ�;��_x��{+���RW@f���N�4�I�xk6\ժ,r�n���-���¹ײ���dg�a ��tqq�bqMނG�k��>���;��p`je�E8�!���/�B�xB(�)ѕɍ,f�(i�X"�z����p+�A3�����;=ŝ�q�G�`6�1Ko����m��>��e�� ���񺤎]� s�}���������k>+����b{.��Z+�g��p2��/�9]��r�ܼ6���p�j㬎�*&N�G6�
������w,_����/��d�}z�����3�Ǉ��1��ڂ
���"����Ȇx���Cߐ���~L�Sv�Գ�?<tt�J ����΂b�}��jc5~��yA�X��s�
����j�柫��oq^*^"�H谈	��$/\M��*@�t����{�ff&��mo����e�)0���K���V܉�	$�,���L[j,���H'U� ��_z�S�n�ĕ��N�?b���~��.�V"����+�5O��D��	��Ǟُ1W��2v��z� ��[}�����-Bu�SBVֆ��<���g��婐+��0�+[(s��j�� :������i2!��,��S�gѷ�V,��X������3ӽ�;�>�8��1n�ؠ&0��ʓ{w8l-�UGW���W��Wj��.	��:_j�4�� H���/,ǭ����9~�����A�֛\�c���=�~{d�1K/����Օ��e����*?y=D/,����"��=�MT�&�E�������Vf��嚐x�Q��Z�,�K��ͬ�.�a��TQ������x3gm��4z�`�a<[�e��~?��J�?�*�?����E��8�Sm�bIF�(�S�y6˼���}��$������w���ٝQj{�]��ܩ��}K���@�]y�x��T_�P���|�?s��}���l@ͯU���Ñr���k�0�i6��*�C��Y��Wu���t�3��4��sO[����B�!�����@�1��}o �@h�Rn�Sc�7��	f�� a�����J��.�x�9E�q����(V��R����-�"7�G�T��^x��?��v�`�~�]�ŕgU��#56�]�rN2J�XT���a��������x�ڢ���W��ʢ��b���{��ɥ�+]�p��8�~��ʇ�����DX3q�V�쉈�hK<@i�qQ��SR#SaV���ʛV'V	rH��|^t:�Ue0*:L1�ڇ��$UxʾE�u�.�OTJ�i�m2VG�f����)�H�]S'�$����Q)��uX�6��g_���Ԟ�\^����Y�SF�.���1(���`�f[�8�txl��y-E02��K��	'
!	̲)�=-6���ѡڔ��z�H��P�MG��rx"4z��؎`�w��B�u���W�^����g:����);�I�U��.v�5IB
��������ቷ�Em[�7��K��dLE�tm>[�����>�J6�����ÏR���'���4��>�V�rY]�!���g$g�_��|�Rҹ}�_��H��@���N��k��|��r�<��H����aZ�
��?��&K��ĳ�ϡ7/P��
uo������5�ef���
��ƒ��o�w�d(b_>~�,c6�]�m`m͒a��y�sR6��qG�~z#,�!����߃���F��UN' ���F�/�{���R���NH�T��._���	;��	�M�^V��F����u�H@J�G�!#Jao���r�\�E�2Ŭ�s�f'�F��~�nF�W9��C�����m�N��pڒ����Z���s�9q���ޗ��mH|���SM�	�d����I�v5����6�����П>ŋ5v�&ڻ���&�\<��s�*^�J�Ka���m)�n����Yn���eq1�FB�B�BI�,-���=7!(�і�H+wlh_X>)��#�Ri{~��C�P?^L�^_��M��C!j%?�M|k�U�Lc:�HP�.3&�b��Rnj$��!��3�JDƖR�w� q�٥ں�ϴ�f�!E�ʐn��ؘ�Q9T+�,��a\1�y&e���[A�J�L�1�s�e�v�S4�>]����&����n/;�ê����\�D&\�[�����-b(� ��u�ƙ���]'������"��b�|q��C�G��(����~�O� �P6���c+)�C��Ev�9��i{�Е]���/U�2��uІ_�������(������.@_���`��8�G�Tk�]��ʓ=���ؿD>�Ʋ�?w�����E�Ź����¼�w ���؜\�4�1���#˳�X�Q���|�hu�����[��Ǖ/��CZ���[�����X�eW^�~\�����>��*Z|5�����<��Y����A� �I����Ի�K;�Dy��sW
�s���ԧ���+3�J:��M#�~�(c\g&�"�S�ƞ5�X����)�v��5ܼ�2�Ӳ��D�Й��M���3�e��ho���[�^��w9�Z�y�/�4a�?r�r�- ul���S28�VM)��V�]qYŴv�8gWFӝ(�5Q��j���!纰�S�wK�h���¢�`���ŉ���j������o���f��v/�ݞ�&��K���x�U�����B�f�l�WG9�Cf����>"B�8gq�"�ɤj�5��Z�>�3>Jq��|'�֘Ĳ��%��Y�ú�����bQ��}���uy~����Zш2�Ji�y]�Ųw�ޥC�|qXW�n�J%�1Ot��i��Dʱ�0nw�h���9�8��IU�Gw_���]��9�;�:=u�J�T��\���\792S��k�j�؅��&�o;�(�N7z�v} �#H���(g5�m�#�a��u������� ����Η�S��枑�QIy7�L�7)+z��(���P�$�܏�vf�^�t��r'�/�n����Q�VY'E&����wb��u����*{�����"��O��S�_L�Zn�?5O��+G��N��.�4�8,)�v����pty��jz��g>+��[PՔ��u2�Wj,�Ҕ�Q��p*��{I�u]��=����c�����]�L]�?�L�xJ�Q�|ӟK��i�#=$P�4&����H�/�cNw�����<ߊ1�8yբ����,�^���v1�9_y�
����Z��0$��04@AkD8�>� ��U
��\�6���.�r�R���Z̐҄Y�HЙ�e��t���n�,�'�d�I�56�� �#�Y�3]�ΞI��)�Y�2q-R��%��}�u]*���vJ�@b�͢g���ǘ�|���)t*t���M� ���3��j����+l�{�^�OD�\�R����O����J�\���k��A����k�V?$^_�儖� ũ�9�{?�<�0�p� r8t������A~}���Zar��p�C����|z�Y���k&γ�����Y���t��xa��G��=�k6<�c�Gӑ�/��n�rM}r�SnM<��A$�[��H1��B���!�wj��ĪI\U"�Bd����{X;�|�V��Ϧ���?�.�kI)�)�_��٥�� �lv��� ����a�6�j��L��O/-�:)v���<3��J�c̬6b���(��g4����Lv�\��^�?�+��4�gʊ�<�(�:�zٌb1�]㿁E���rø1���*�;P���P3<.��,�.�xk�m��n�\�8�=ڜJy���h�����W{֥Y���;@m�y���/2������o��בS����" ��Υ����38���f��&�t���������C�<��cry�J�g�(���a�緃��]�<�B�Ƅ��UFÚH��V_d�Bí�n���ȇ��KI��� �o[EXG��i������7�&coꭏ�<N�"S>%ԹZ0��2,�g8A(�i�"&���o����k}�5
j��3�OL(�'���-�[4'�3B�/P#��>�N�(Af]��\Ak,�m�!���E&k^��D�S��í#f���_�,ڴ'������!��'�ۘ��K4j���-�+"{��}D�qd)+ѨZS� �>��³k����3Xj#د���u��p��k9aɪ{���!�c����K˅4�M��~f��"����yOcW�b�i���	����o��ŗ������1���Q��wھbN�;�A!v�j���5��ϔ#W���������1%��{�Ԛ�"^��Ka����˳�O��n�m�cP��"3r[O�K?�rPR�܌ELB�������}j(�즞�0����o�
�b^�G�Р`d䮃�mKPk��:�N{�~" ��$��_td�)u�&��eE��9��p\�g*��	��Հ��[�)�Va����_t+�F)">�3�|zw�NA��?lw������Wc�JL���=����*�u��o5�>�aPG�t�y����]F6���UM&����q�+�q�m�����s���~y�t��|�"�T�b��蘏�}2� ���i�[}P��J�C�"���t�*X�J�=��J�Ng'a�w���&��,D���4�$P�3 ,��G�e}���b��q�-|��F�PY���tցv���p��gY�?��u���������`-�m�p'���a�۪N���=�=�(��#�E�)y��z�2�cMW%��oz��}xLM��F==��'�1D_cn[�����S�Z�4ߍ������O�zAj�UI�_�*d�g��x�ϲ� ����=Q[k���[$���j�2�B$��W� *~���hxT����N4���'u�;��7��XVǑ�-4*.�t��Op0ܪ�P�A��V��k�f���`=K�����[���B��1���K���)�%��sw9e+���ú� �E����'�{�\g��&��Y�Na�/��Ϧ�������OoR��_�Mw6��O>�	��2Q��po):꫽��uS@g�i�حc�Ŵȫ��cp���*�W��jc�x�����"���^�/�C�eN!)�6�.f����֕m}5yzo=�왪lnb��x��,�x�O�}C���:����m���t\#O3r���Y$��L1�^r?�2�,'5��m�U�mb���X�L��su�3�J�X��h�s�w��R��,���U.�"����~�@9����e��m �kq��k�����&��K�����-����k����|k*����<u'g-�/ɓ��������գ43Dp&�����Bkng�+��4&z�~�~���Q�4���(�Y]�l��^=���==�UPt�U)þ�u�7#m^`^�ȵ��Ό|������>n���m2���j�����G�l��)���2ژ=���[��e��ƣۣ��4�Z����~|#!�[6ZK�B�����asY_L���QljF9s4�~���)��Z&�Ba�qj��-��XzF}I\gftQѮ�H�6S�%��k�|�_�R��9Z�I9Y/xv�u1>�[�ا�j�$E妸������Ƒ=Ÿ��+L۪48܄��#�jHb�ȩ�j�/X2	F�ks��v\-*d��
����v���/ :?�F%)f�_�X�X��K��u���f������Ub��T_��ᐎ=ֹ�ٝZ�'
l����gZ�ƋG��w�Y׾S��^n���#���Qy#n6�s��LH?Z�IKr�BS^X��a�}/�}��.'���#ώSv�o\0����
;a�B�S凔��5���++��́���mK��5�	L!2;6`M�2�h���.�͗(�M�[��v�˽������2m)~8t��X"������جy����1��k.�_���-�ߏ:&M���!B���2��ʺ�$P��L�ģ�z�k�x{F���Wߠ�5��Ǐ��Y���@��f�az*���MɅ�>��!�ɲ��c����ov��t}?xs$][?F='O��u�m*7��OfRM���}}��C����l�c�0���)��n�~Z�ռ�(E7K"L]��ƹ�s�m
��3�d��o$*�<���M*Ŗ���+������D"����!lx/�	s�F̰�P�1�W-VM�Q�L��A|�]�k��/����]I���@���Z�gMt8*�����}n!�}����}I�#���R��Ϭ��K0�3�v1����i�b�!�盗l��9%�v#q��6�X����C����Vt^�/&cn����m^a��v���?V��7�18!i�]-4XY����l�����V�}xPy�)����w�K��Ǘ1�l?�z���T�j�x�?{k�*��2X������(t��Rq��7_}��܁�Z@�@t1t"�u�!w_�H�m�.5�~Yu�;w��ʈ�]n7"�<©Cv�q�R����#���bc<f�J%�z�W���<���v�q�|j�4�ۄ1����>)�<�?a�eT�=�n"��\+�ۏ>	�&i������\A�O��,�c�kU���]�F_�_��G��`RSs�I�����:궅��)_�B(�n�,�:-K��f��w��E׵W���'b��X�Q�J�~�ׅ��:�K@�Rg݄m7�^�b�.��mㄽk����e��w�͊���h������[m6��~��]P�g!�&�p�_� p�̿�|���g�t�ţ)w���%6SD�k�3� �ᨮ�c��*m�w1�O؊&�W��	ס��
t,��5|��wB{����{�4�9�����;U��vB���w
*�c��jg�.�J����R�z�jI����2�D.+N�r����wՂ�:��4��Þ�N��j��P��|w����}�Ȧ����v��;�!i-�ҍ$��P����r�x�+��(��Rs�Jߟ,�C�r�>��ነ�sDx�3��>/�L��S�I�]?���~��y�@��M��a��6:���f��0B�������J�y·�+[7,f��+Wl�'�lm�6*X�xG�����2���G�W�\����G��!�������17��(�oD:F�˕:�b}��N�����C�FVbJ�b�uȂ���K��"�>��~�[�<+Ë:oGޮ�B.X���G�A�̕��߮��jX��^+>�>7��.��ԑ�/gS�f�xb���C4We�O�n��>��H`L��J�o<�c5�,*�#�(���1��Ԫ�>f�#q�����;�*�*i�Ż<�fҭ	
��"�ƪyL;�7K	1����u�f��,ar�s���^����(*F�43#���Ѷ��Ғo��L�I��Hq�s���THk��������:yD�-Q?���r�@���ʝ\�.y�e�ES�%��{ɏ���"�F�c��;=D,Q΄s=R~}�K�Ek9�Ј������Q�	�>l8�qK�=�!�T��v���T�7���N���i���:q|�\�]#�01�'�ҍ%�Itw|w���Α����P� /ʶ�B�����9!O��Ӗe��ku�[����k�? ����������k���wm���;=	�"j�kA<-c=m��rp��8s�+D�a(V���㳕��h3_=���ڬ|����eN �a��a�2>^��T���R�wW�&��p"�a%A%Ać��X�8�0�X4ںx����i��U�_#��G^���U�H�H=(�F����Xz;��P�&�j����ۅ3�!�����hu�S��j�Q4�e�f5�k��%Zh;�Mg>�oT���JL >������'�Ӷ͖�4�A��h�ݴ���x�c��N��_�t��MI~����ߪ�/ L5�x\w�0T_�	��(���ħ�4DR*ήݵ?`�&���>z�wӈ��N���<x;^���9��2�澿����v�c��j��G^P	�GX�4W�Qx{<,+�b+�еЛy9w��6_��a�Ņc��J�F�SZ�Z���ٵIw'�U��(�,|�y?���r'��4��TU��)�LV��TU�h g ?�ԌmJ�*X,T�����z|��r��Y����p��s����g�y�3�#����eL��uK	���T�V9����$�;c ��Dk@z��vܘ��z�j6ɵ�B�qPq���n�����C���]��uz�?�Fٙ7�[�uy%�PG�5�c����y��?����u�I���c��) �:l�G�'��jn�
��rJ�9,g��2'��JF�L���I��z�BG����D��r��� �9��Uv|�u}N��۫���"�hiU�AkʸH�ό��p���5`VJ���_������:���O�(8�m`s=������B0r���?�i��$���V�&�{���8�K��#�dЋ�AHt1:j��:��]�Ii$�?:�_�?����E����l������� ��1��_q��ϰ�X��L3g�p'{��f'�m�Q��pFVrgG1��!۾zO�f7GWTr�(5���^B\�����)�M��D��w��'��]]
?��Ɲ�8՞p�U�P�������1����JD�2��oP�H��W���a�$|�d��|0�U���n9ydBu�(��U8�ۣ]0�)��2�����or�H���Yˈ�u;�ª�g-P��k$��`�h����~�!-m�mݕ>&�I�i�T���7���րM �&ʛ)VS��c���|ӏ��l��˔?�9li���ۣ�/�Y���$J,�r�&;":��f��[K������K鳮⤽���xav��Lա�m�/�:�0t��v���JM,L'���b�C��׊�`x����y�I�a�/6V�Z�cDQϴ��(��6��Y��k��a��_�� ��CR�r:���W�΃�ׂ_@������n��Uo���+�,K��t�n*�:P6n�r����$���(��"��moQ~��A�nh9��˦x����-�/�ehy�.u�9���?TI�r;��~T���4
�S�Z�܌1�M���Wl�Γ�iLp���[����#�".�D\2k}!�}��4#:i�ه'�9����,<g���I"X�>�-
R�-���H�	ss�N#=��_�;��y���6�za/8W�o�i�>��?�
w���M��j�w��$]-�G���l��Rj�V��層��������e�P��*�Mj���7��A�v�����p��ò�c����C�l�Ku���[�F�ǋ����虩�ьWCԙ~�q�r�~U9f�����D7���F\����� ���Z�%��d�}�7^��5"���I��������彣������Ń%�������tϟ�t9e�ui�I {���?ch��$��9�IQ2import SemVer = require("../classes/semver");
import semver = require("../index");

/**
 * v1 > v2
 */
declare function gt(v1: string | SemVer, v2: string | SemVer, optionsOrLoose?: boolean | semver.Options): boolean;

export = gt;
                                                                                                                                                                                                                                                                                        �����-����E[�����x�s�?����s^,KU@���,�ԜB����k���x�v�������&�>D;Ps!4�>�8�/u�g=w,[�:�y�OD݁v�k���HI+O�
�!�Ea��H��y�3�'U�+qKi7z���q����`2����WMa�Ky���� ���qQs	�=�D��F��}ҩ�ʌ߀�Вd���C_��������I^*�酃��.���S�A���Δ�al���k��X}Ψ�$��flj�iw����|��B�%&��o������^��w����˃���c�F���
eA�83� =2▴��3�M��Y�w7�!!y�D�kH|�{l_��w�/b7Q����-MJP7�k��F����ڴ��+��HC^�b��9�'st*�7��r[p՜7�~6*Z=�T�+L���aJ��%��O���k���k6b���DK꫈�oӂ�!�nb4q���F�e�����O���D{���6/�~o����jZ��#7������>��
��Ӓ�+���O.غ$��#S��a�R���"
��@Н!;3�w�v�Z�ơr�w�޸��1q����ju�1�"������`!#�]��
��p���G�Ê�%�	���`����s�#K{��̴��_u6������C$O��_^*������FWa5���WåԪaE�����ѤU:/��<U�G�c�c����&ތ�'�G���Q\������ш�_7v�[B�ş����<[v5x�X8��C3Gy���h��b�B��똘�����A�d�{K�ﯗ�n��m�yU���r�Q,WU��WP؂#-��+K��U�Lt�X�7�.��G�ä�R8vG2E�Gu�l����
7֭Ū�>sz'|7�,$Xn8X�p��Q̕ڠ򇑏�O�}�R�ob�y��cC�)wE����53��t�e,����X��m�[:����fx�?�iX�Ś�@�t_�'�R��]�=<�c�4�EjΚ#���ʟ��cD�m�(�3*Q$z�<��8A2&�e��A�������?�ǌ!�0�� ��,S��՝�S7�n��4������7r׾�]p�_oh�ٯO&�3���h�Ԇ���l�g��G2~�}�=Ђ�Dgޫ��������MbE6@��hO�Q�.�'�c���a�J�ܗ��(��-�.�E�0������S嫟�>%�
D�F�à�8��@��w@-t��>b��|G�i�'�+qxp����7r8��{���/���Br�߯��%���(_������#�|�����[` !�� AgZ-�{>������3�b��.M(�l���J���
B�T�9#rPR�ݔӆ�Y]��t�������97�4�1C;F�X֪]�=�#��=���NZ� �;��t����qU݂����Ȭ�Ⱦd4� �$�bԩ>�*�!8���5M�kb�j`����)�Ե�>Ν��i�!�#n"������edp.�Ř{��+��%�SjǗu�l*��EQ����$F���ΰ��|����N�p܋�X�:Ʃy�ѫO�Y��'�)oRöa21b���Ȣ`�O8B�;�Ag�� a�MP�)���+gW�Ѱ��(&}
�f+�l/|ò�s�-��߉�$f,ӭ��򚂭�I�#�j��!.1 �eb&��@�'����������8� ���>Y�+BJ����e���zq��Ҙ:+�}�뙊*�ߍ����|<��gr�~!�߭��? ؖ���^?���XIu���B�U��D��3E����`A����~���c���#�s����@6����zz([�JЎX�X�W�8]�{9�	ްϒٯ�oB����nHI����y�]6顾/NduǏ^o7��¸4��U@��N8k#Kp�3f����A� ,�0��~��u���a��8�����o_&P��� R~�����l/q\����̈�-�R�9�[D ����y"D��~l�5j9B�?G��!B�`Y2@"��)��!�3��8�9E�N�X��xf�+�6���x/���H��_I/�%��������UT�p�.3+w�T3��`�u�08�jT��W9�U5w!��p^��|��Y8a�EE�}7G(E/����3X�Oh���QV�x��}x�l3�dµp�.aEc���*�Mh�Ţ���&��Ȟ�yG'��߼=w�*�(�].M(�Xq�诗~�
��D.�»C�&����F��*�ʪu_��5j��?{����w�'Ż���X����\ņ��O?���V��Nխ��J���_g�]B�����$$�⯕X��t�Jk����(/V�@�}�/AZ����>o��0�R�/��.ð�N���z�>�u���%��T%@\"Gϙ�%� ��Y�=92+�&���j wa�?<r�^���S��Aj5d\�h�֟	��t)�8�K��3;�6��)�8�(�5i��̳Q5�6nK�n��� X�Cnk<`��O�Z�"3m䘇W�:�E#W`�jT��M�g!�Pd�R��7�;wO��K�e_N�;�l��?�X��$�������V_��M �k1�m8)I��lS
�����%�ǽ8o�
x�'�o�F��_,�ˉy��B%q1T	����'X����ө���)��r<p�h�����ec7�#R]㎧��"gS�%���3�֐l)��|j�.���=��6������]b��e�f�S�Z2�"P��t?�Dȕ�#��k�^qls����aD*K�+o�xƹ�`���S��Ћ�K���2U��� � gi����>;�>)�@X]f���fxӎC�0�{��FM�GMTW��w�.;��"*��&񍬾�(J� 
��9�W~>=�� 5�,[�.���&��r��Ȼ���
ݵLw�U��m�x�om�@��m/�OK�㵳5shJ�����Us���We-�0M������~��C�^�����8ث �!�A�$ņ�
��X�m�e�Y�61=��y�����Eϣ����Zd�e"i���7�*!G�(�w?�Z/���[+9+�ǯZ����@���]��df�v�6íj:UYvY�*-�
Lܕu��3�t��a)���QDwN��� �U"�j1q!x6
?m{�Y�í�x1�8��Pe"'��ӳ�"P���ٴzT����ν��vR��N����B?%��jn,g�|�Q6rɟT��{>��v��~�o(驈� �$�o�Zy� MG���0-t�ྗ���z�8�ӧR���w����z^3N�	�Ҵ�����<��
����2����j�Y	�Fq{���&*��qu#�(�ָ:��&�B�'o�7�:Z@E�n���P\�nI�%+�7T#��x����KL��(�,�O&֏t�AM���U]�����<��4��	t�V	0nгVn� �{{�5�E��{��\�:�e�bkͽ��|��$�b?��Rڐ�Ya����2�1��?�e��>�z�D�#���SF"*ҴK;m��W<���UP4�=�\D��Z��`u��4�KN�hd��Vs����d@c��e����[D����{����#�ⷿ����[�o�X+X��r��fw`����Qm�IP��J��m�\hO?[m�S����(�)�3i,��������P�"#Md������j&l�꾆Ɉ?+�����v�Y�̠#�3\
_*	�f�M�b�`.u�ߙ���( w��Z>�p�	/U@����;+�H�D�` ���灱��Vں��*���:��� �T1]�M_ّ�fG��둣�f���Շ��+��:b���f���=�	�ܰ 2Ԁ�)�a?����I�]������l�N��q��v�T�>Jqm��.������/G����h(,lh�3��Rq�|5{,�80��8�W*������:���)�#�,ں��Kd���%>�5���(Xu���9�5��T����T�u�u=��j.q;vˤ����
����w�>�싥e��LM�iZ����ܵ]��l=��z���ĸF������q�h��|I��
P���Њ�,�&���Vn�u�d]��`D��;C���7Aꔍ1�o����I�.�0�Xǯ�\����O�-�&�ZW��s(~OD���%V���3���B_�y3��k�ʫM�I{)Iή���U�<�R�͛�nо��!��l���9��F�3?<p�n��!0#�Q�k����dg��H��j2�21?Mϵ�zߡ��?�w��F𺽷�φ
��x㏈���t�t¼��U�jv�̯�G���'�'��o&DJF����f�Rt[vv9#笽kn�^d=��4Z����f�㄁�?Z�l�p_�b6]j%3h}k�F�o��Vc�@� ���"�gF��K�q�Xq���������߷�qc���e�"L�H�4��z@�k�yU�jދ��w��ݑ��Qo��`�	�����;�M�Mi���Tc�努q�U�v��#f�(��Ӆ+�0�����M��w�.N��)�����W�,��)/���i����ƜWGu�)�4V�KC�CI�����+�2���,b01�ט5�;F��`�l��4$���kL�C�J{$�����F��S"�viaWwӼ<!���_~��=��_E��<n�	e$�Q�ѼP���׭q7x���Ϩ����^�"8_y@Ob�ǱI�f���Gw��@�p̐*�'�6�Y�΅w=we��1S�=��F�O,�Ù�V�ԏWoK�g��b�ސu�����m+H�Ű�?��O`�Ƿӻ���fטuNX!���A	���ի3L\��Fo6��'�㼮y?�Q�I���!�5���0�=M�P�n0�0r>�������%��٣�g�'[2al='�{'ˌe�_�>kv����_�.z���+'���Ap&�te��t�ȷg�������&�M�ۃ�"�)�CFp1����%��ש��[O'u�F]`[�z?�?��J,�%	|W0��2�wEb�]�nr�tLy��ݩ�b���"�������F�o�6�A�Oɧ�4-���^�0(�p{BH�>Ş+�.�j��:��:1���,7�v�T,e��訦é���E��\$�w����M$׵�|TIu8pR	���mE8�o�V�5�(�G5���}�~tz��?[�z �v4��y��!�W�UBA��i�VIp�{rSk�����r��m��}�&���z6�.�����f�F����#���{=5�P�&�lv5�}�e�K����F��<àH�ׯS<q�M}���IJD�Ƅ�Y=^<ʫ��3��+��=;��^������"ү)�l��mֻ4~�����*��-J�u
�	�DF�~��>��@�&��F�&�ҤxGTb�9Dm'g��F��h"oo���?(h��b�'�
��FN�Wӳu�D��f��$���ϸ�6�uT��>�	3Q�p��FY��}��KM���W��q��@*�rf�Ɨ�����mT>i���1{aA�2�/eM.�r����㗚��]X��A������q�Ta ���֠s�~f��U�Wl��I��^���(?+Ttw���2b�W���H���߱�`���H�f�I�e7��rTU�����U�EZ���*��akb��hjY+h��eY�����k(��H�)V����9^�cE��͞�%�y�sq�qHMx`#nt�ۼ�j��[��\�� }�c���R�'�~g�U3=	\���=�65�)�gBU��|�p�;I]VC�Lo��^�n�����>�_�	�O��ٜ��3�<Ȑ9{\6��I���\�ٿfl�5LCu�Q�V5U��<D�$ɯ5v[�`SZ���?�n�"6��msO�M�G��M��L	��M`&�}-źRY�a��&��1�II��s#�$�9���� �t�WM'�&G%;��5���K�Z[N
��'��y�&2�z��F�ҢY�M�v��cY��Q��oW'�L`^7D;Q�E|Y1��ߤ$��鉔N�1hB'�9��}�u�����G�r���[���6����7A۰�GzWC�v4f�k�%V��2,��	\��v-�ک"��0�z!'Ƴ)FD���?�f�h�O_���7�2���K�M�,$��ďO�)�ַ��e�J:��i��91+ئq�%=�o��l���4d[@�#L��CD�Մq���ȕ��7#���2���#��O#r4�Bj'�M'PQo�p`�\�^X3� 2��j?_�e����Q0�.�2BU'��ԗ0~���a� a�s�of[@��G1^ڷ��#���'9P��%��2��A]��q��J�Eô%ͥ�F��p�j�cy��@g����圴m���Y��C���+����
rP"��]u>�̌���α	�Ω&��	���eV�����s�̨ab�qm�X��sI�l���ٓ�� ǚ.�-��+�}ZZ��cD�^Y�-3����E#h�}M�!LOW��w�x��p���;�ߘ8E9�`�;�~��5��d���$b�\)��R2?��_��3�%S{��U��#�6�ߘ0�Ӯ�P�7wu�_J�+���a|!�����E�����S�u&�9�V��ϑ��W�-i�ցm�:�����.:c�ҨV�y���]��?-���4��ܢ�x�^�b_���>ݺ ;hi��{>&Å;��B	H0�zk�����?�5�ZR�N�T����0�h�����W͗NJNZl���њ������<�w����XE�����W?Yg�4ڔ7�x���۷�G(��D}ï����������w���GөʘN�"�X~�<C�&�̝���&�j��3rtA�k�<�L!��[��� L�}U?G+�@9@�M�m��e�s[�JCAp1(�h�Y^n�{�Sv�<���(>[�R��Ն�墧جd/e��f!h6;�(�v���0����'p��u�^ıӘ��j�Ҝ;5]ϦS�m�\V-�S�R�=����K�'��~�9yG;��+[�%�#i-�j�`�|kn�׆h������a�9[4
�:���HII�(�:MS�AR�Zɩq�	o���B�TT���>D�KT���cA��^����p���_�P��M�R��T�:=�rL�(1r ����Bލ1�>Q�zz?��,8��	|D�;�/��I�*�ǭ�ii�p  �2��1c@5�p�����,��P�C{��Pʜ�q
��-���R�xl�Z�q�МT,�/|�L\�kE�kք_�)��xo呝�W��'�G�{�f�z���ѓ���+��1p.��F6s�������/s�Ѵ1N���a_���d�k�*����ɾjc�i�r���ij��.���LJp���<wA�I�M�WSV	�̓�ph9��H�t�<�9�_�;'�"^_�,���hdő��Q��k��EoW�R����o�3�e����������M6c���*��rVՁNr��;�]6����f8s+���~\�؍���������.bX�+���8�b�b�f��ND�K����ao���D /ns�-��[�ao���E@4p�e�/��6|�;��[$��ɫ�@����q�'Y�"�7���']sN�7����()���Ra�yWRZ�EQb�,X��ߥ�{A/S~�}�k�RS���KY�M�h�P=���VMX�:ʥ�)�uKtI�R�����/���,��U�ܢ!�l^�U��E�F@?з���1!�`�DЇ��bͬ|@��|?#��]t�=n
a��Do^�,A��pơ�� ��U+]z=�L�=)��a�[���~ 6mn²'g��Cp� Y���Ƹi��R�]�����^��(ъZ����r�?p�S��%	KI��|,���!f��BK���l����V�L�����7��e,�܎{e��B6�P�����>`��2���2՜���|jd\�5��)A��~�=ґ-ϗ�;�^hc��|�Or0ނ�Szb����T��?�)M�1fO���\=��^r6��s��%!����Y��E�WI�N����cX+�޳�F�y��K�'i��^CΪ��.�������%��e�%0Cma�Z�!3͏�W�~XH93Vb�Rr�+��Q˺�S�3���JJт�Z͎�T��@f��#L>	�k"	X���9]�n[} �jD��;���j&�ԅ�>0/XA���m�2�\��@���X�OD��[K�n�}=*c;�U�K�L�q�K�7���o#E.����*�Z.A"��b ���Q�=�~8m��c?S��1$�����D߼_�?�|���霪�"��{���'���'��i�0�������J�^Zh#��ӻ��"�� ��WK?M��B'� vJ��RUI-���,��G��bo�l!)��b8��������M����.u���_��,uc����	Z|�A3K�S��+��?O20k�y����vs�����z"f�b���.Si��_}�vl��k����i�3���S�	�H�V�H�!ѷVo�Ĩ׏'���*��er��rc�3":ɏ֘�@&H�m�R���>sk4i�cx3Zƴ�����a`�Sm�Wm�
�)p����k2p����=`<���,k_�P.q�|բ���O���TuL�����;�&W\$�f釶p�.�&�/	@n-�d�s��J��N��y�~�� �b:r����yC��w��T�e�t����:x>E��L�ޙ���Jize���myp�c�u=Hf1����$D^�a&��eԚ�P��ŃV �/�{��t%|&����V�(����eW�u��pG-��nNXp���*�r��Q��&�Q��V�׋9�5�#Q�M`��^ӂ���	��qdX8t��Ԕ?����0]`s���'�e0�jk���gY�NC�3"5I,��jk�[����� QC��gQB��9-�n�knu+*Ȗ�����(s�Z��D�a��F^��f^���r��ȵ�ӻz�CG^j�q,p�T��P-B��2���z}���-|�W�A����ָ
��#v��!gI�ۥ4U���>Q|�W7�S��ǎz3e��.��~�H�Ԙ��e��a�ۏ�gd
s �����Q�Eu��#çP��5�4.��-ŮM�؉�!8)�u���q&��3l�8�<[;��ԞL�u�Gs[�;5��ڿP:h?��dB}<��=����Fj�b C��^q�1�g��O_���e�H_FK*`L0	�iYG���_�%p��u��`bE��+�2���zC�4�Ĕ]�r�Z�ע�����}*TW-QՔ]�P�ì��Ȁ�~;��K�����Bn���:����t��G��OР{�A\�v�\���>��L�|�$����QlQ�Uci���Wǈ�@.�O�� X��5s[�w7鋇1��,Vx�|h�:���o�u���o^H�0��im��Ȥ|`���V�f�9u:{���mg����K�f%����x������*�v=���4��*���	�Q���gY	u-��>A͇�	�����u}���V_��p&��C�_1�r�̏3���ڛTR�*4"�yR��1t��a�l�-�?���?@��^�F5%s��B�v�,
l�ϫ�D_�#is�}�)gENPl��{O_>M���BKy���
���
pe��4&r���Px�Xs���w3�sĩ-��y��Q&�>p�o��1W�l��(�d�����DQ
Ң�ɋ�rt��(!�r�F8���d��i8�6���[�COc@���Z,N�4ϔ&d�I�!
��3��W.����f5|,Wbr�Y|<��͘.�8�I�WH�.��k��n�sb��3�Y}�}�gTB>���R�/�jQ|?��0\DAJ:*�g����	��5H�w~�K�+wx��Q��A�RyZı=^k��ݵW0ʾn��c�;r�����G?O�.u2�Q�w�X��Л敖�W�V0@v���:?M��"�g�[u�n
;�� d���)��Dn_Хv. DD0������<���fsg���
�&�|S��P���:O��G'׍VǯY���l�5#߽[-�KG��{�)e�o��u�<���G	��+QD攠pNm�Na��<��6��A��������+W���F��Wu�Y�E� �%�ЂYGV��By��������1۾�v�M��>�o/Ӆ�)�L�jA���j�E��?���_4pP�a��tR��~��.2�B�(ʢ� *�D��:G\*�)�=�)/W�n7��W�|lne:�X�Xz�Cx�$��ȗ9�CKf�#�#��NvR�6B2�.+����V�/���=�V�ٛ�ēpb�\����I]�R���-�{�0����4@2���]�ȟ��:J7s�я������zɬ��ZS�|)���AO��5��!2X����~��L�E���B��d#A��x8�u�M��K���ͧB��:}���P�`���F�P���]돔MRa|}�[2MP��fЯb��)�&B�D���b�]�m��0t�)zf*Vb�i̍�u�H�����/stAQnH���%�ȉ�%¾��|3ץ<��w��|0rB����-@�+�� ��r7�"C]U�ܖ"�<�K���uA-���ޓN���u�y�<}�;P�s��N=��2pj;��hK�r�T���:���I���5�5�6`���9�@��`�c���h;�/A�?z)����%�v��K�$LNКH�rp9M-���X{,�n����xƄ��{�j;{>�dF�J��xkM|�f|�?�v�{4��^�6��c��`.g�x�@��X�ZV�@�
�bQ�6G�rn��T5K����V�L��\���Hs�����\)m�xC(�,&,�&
�����!}	*� ����w�)�M~�s��9[�!��]U {��r�H�CDU6;!�x��t�1����;w�g���9�8�/E6�������Ԩ�ok�k6BE�	9�~g��1+dX��Yҍ^p�H�n�{������{� 3P4�+9 �PN��Ƙ2uP���
���T�a����ܴ�k�o�b؇�v���f`�\�/��:������؆���@�����,�,��I�C�C�p�M��}	��yr�S��}�i���� �2W�1��#��h���p�B2n�Q����$������n䤔r����uS�R�J����C���L����ٶ/D��_4�����T�d��,uC;��Y��!P��`p3��,�Q>�w�:��q+F��(BcU���%�����c	-���r<5��vqDp��vmN�Z�`Y�8�M)�9��9羄'<͝�K.FE�sT�z.xN���9a�0g�&����=o���)XN䅫�a�FhJ����$(�����'X>����N��K
<"Z5Cnu���@��$�^�=�}�LQ})\��Q{_��n��z���PCv��#HU�O��Q):���nt�3V���ٴ��$^��ϣrF�"�6>�#��d7�hnc|/�G���Q1{������,��m�R�6�hj 5�j^��	w�e�|.ܐ�}ި�]y�B�������9�=��0�#˟�V�	"���'��'ֺ� k��\�.FાVr;�l荏���;��20�`��PE
x%��gh�;@O���k�y���kE�'�\��}OU�j2���Yh�N#\�jV�	�����n��r]��+��,��c׏��%����4,c��$��D��DV�SDSC��/�ڢ4d�h�s8�SY�����s?�_������Εam� �2�7з�

x�+ J/u�q������= ѐ���	:NC��ag����O�{r���ln��	�ċ�\�!̍G?���tF'������aY����"�E�1'�53§��=g�I�� d�x� ֩��0�Z����-���M؇K��� ZQ�(0%��V �b�c]�mPXօ�������	�	�-�3����O�'�����w�����L�v"���z���<�6рz{�Itʣ�R3Ky��W&k��.5��R9�������������f؏f8cU�_�1��	搧K���2>�&�R��B���p�$���k��?a�*vfD���F�x���hl��ԭ���F������U̯���0���%��X��Q�Wi)�E��Ws�q�sh�����T#oW|�\j�Cd�<%�C�X&��|�O ������������C�R|�hXzQ���+�$1�aS��@�ÔAQ*o�w�¢��ٽԯ�T��(����(=W �~� ���"}��l1R����y�@��B?U?8~%M���<�i2�B�����يi)�{">�0��dM��)\�����o�Ub=x�E��]>%<t)���0��6jڙE �q�q��㥈j��y��B�{z������)����Do��Z�(7,��@O��)/ռ Q��g�CE/�������0�
���QQ|,J>���;l�9o�4�WR����P�v)ˠ;���F�N9Z.>����@�bMp ɪ�B�o��HȠb	v�y��j�Ej�)�XQ*��V�cre�`AA�30�OI�[���Bj6+5ؼ;,o��\��1"3;������{X*��9ir��W�2dІ�S6��oo��]̓Ͱ��\E�g���-׸��
f{΅Yͥ�G�4�{�8Ϫ-��L)�m�df�%`Q$�UȗxKn��|(5C�`����]N��=[��?����Q|G�4KԜ� }��p9g���0�!�񇜩���y�4ٻw��=���uJ������<�紃��%q�]��$��(TG5gT��DMyX����p!�R�8.W�j�p�G��;W�b���j��5���/�TK1��mo����>èt@��G�BDZ��d(�[��A2!P]c��+�ƭ/��8��M�����Vθǚ��AR�C^�
|ku�%Q����,>�>v_�)CLa�x��r�VU��7G��p���!��#����s6�q��*�����k������j�����DC��^�+o	%u���Yk�i⥋&�5p��IoG����>37������r��@���tw1C����o����d��9+8�a��=��_�""\�B4�q���w9����R�:ˬ*�M�TuK�	o�>h�8ӷL��ч�{��#���j��4�o�p�E��MH(҇1w�U���${7 !D�EE"��L�z�"�]
F���y�ܞyx�f�e�o8'���4����![1u�g��f'�U��]r�^ɇ(��<W�͖�[�{��7���[
P�1�ެ�aPvRI������$�B����\c=ubώG��y���`!o��"�d���$~E]�u��/U���"��9)����Q ����ņ��`�K�2L����N���WLs@�-�j�Kፘ�Vw'Aw�S���p��_g���R7Ӫ"1]c�� ��ʔ�[��DGc�N�_�4l�Xr��h�BGeخ�!�浻'�@�E���L�,�rO�*y!�'��W� KY0)د>����%��#_�������S��n�Cԟy�W�P��!|"R��Z�\Eo��駢�R���zly���_��oX-"��U�8�R82�!bH�ܲ�FK%�f��Y+��X&y�%������
�3`�B����9��.
b,�x�o���
�����G�T��G��e�����T� =�W*��U���s�� U�>A�Z�<�a�qv��|pt:�6�������KSU�]a�w���- ��j�d��BY0Z�E�ϼ]n�7)�S*?�H��ŝ�OA����L ���˪�L�$J%��qk `WQ�N��_U���,�1��ƸAbL�s6�M�����[��|�`�r7����ƭ����'+7d�D/��v}��Yj������B�p�R}��)�b΢���C���9�P�.b��K�T�c&m��p<�ಖ����]�/&HV����b�4#���D?��EVou߮�6Z	�8І*$7g���Rn9�/��%ߗ*��o7S���X-t]�ٗb;'g���A=G'�sy�����xh�z|C�"��삆�{�Ü�xҸau��#� zұørZl�j�H�����W���8LV�{݁��5~?�r&�⚱7�ٛ�)��s�CS�:����s��è�i�^Ԍߐ�JU��e�R�ǂ\�.�J����I���^���s��f�*����إ�W�g�{��"=8/<[!#ĭ%~�Q˧��K'yR����V^�9`q�3����c��P�~ޖ���CRJ�\\�c >���/�����zaruG9����}CK�v�@�ӊ�mB�X4n酗��aΡU�߬�>�ٺK����%k'�+e� S��*UJ�����Z�"0"�:M�K���dq��i3��ɯ����{�s��?���x���T�y(S�����B��TX"?�D��	o0{L�?r�ّ��?�.|Yw������֪]���.5>��N���SK�����]k�~G��aq\q��;�/��e�#se.2Q��n]E�*��K/gAռNleJ��g|=�^~,��A���JBC����T�B�rm�c�d5�f�4!Վ	gN�'���X����-դ炍���X��ݙ��	��C3�k���8š��R�+˫�$�#X�m\` 6Re����Z��*`,�N�u���<.�vQ=������.SE���U�L~	��d(�+Ut����v�r�ooD"K��<;�<�1<���F��e��R��q<f�������=�\VC/���_��[�(�[�Z	�U�� ąZ�d���N�(��[��pd��T{A��-�L�-��b_��d��;��,V@ۄ�n&;��q����ኤ�����v�S
��yu��FS9�.J��G�3�xco�߁t��X,�D_��v�ۃϣ�L���-�S���*5N���0R5��`����mBP���T��d�a"��IP�8{���ϳ����t�����J�T5��C5��*��=�R˾x�0a���*��/�W�ێ*��
��bs�|%�J~��E-x�U@����^�o�9K>Pb�����Ō��PЊ�'�OƂ<0���W��7����]���>��Y�A�P�7��q�������5���X���6����s�XN�}!������Y��X3�LZ�S�{�IU6y�js��oU=e��g��eR*�V2�-��lK]G'/Q��`���Fy9RH7h�]�})�G�;w4��R�V�=�\�"R�"�����V4ǹ��<���"��+�Mk�Ρ��qP�SF?�	x���簌�DH��[� 
C�b�+Z娠D���l����BS���CT��M�Rnz�0�������0-�.�*7H��%� �J�@�p�fOT[�#��,�K���BQ��	O~���w�˲"wl�_=R�\D����Wc���^�ʧ�\@:�[�r��yh�n�lN����?�R=�x���ri�p���m"���ʫ|TJw�u�Mh���G`9C0��=�K>º6A�h��P$�04.K%��z���T��~���s[\�`|��Y����s);
        if (link && flagsNum & O_EXCL)
            throw createError(EEXIST, 'open', filename);
        // Try creating a new file, if it does not exist.
        if (!link && flagsNum & O_CREAT) {
            // const dirLink: Link = this.getLinkParent(steps);
            var dirLink = this.getResolvedLink(steps.slice(0, steps.length - 1));
            // if(!dirLink) throw createError(ENOENT, 'open', filename);
            if (!dirLink)
                throw createError(ENOENT, 'open', sep + steps.join(sep));
            if (flagsNum & O_CREAT && typeof modeNum === 'number') {
                link = this.createLink(dirLink, steps[steps.length - 1], false, modeNum);
            }
        }
        if (link)
            return this.openLink(link, flagsNum, resolveSymlinks);
        throw createError(ENOENT, 'open', filename);
    };
    Volume.prototype.openBase = function (filename, flagsNum, modeNum, resolveSymlinks) {
        if (resolveSymlinks === void 0) { resolveSymlinks = true; }
        var file = this.openFile(filename, flagsNum, modeNum, resolveSymlinks);
        if (!file)
            throw createError(ENOENT, 'open', filename);
        return file.fd;
    };
    Volume.prototype.openSync = function (path, flags, mode) {
        if (mode === void 0) { mode = 438 /* MODE.DEFAULT */; }
        // Validate (1) mode; (2) path; (3) flags - in that order.
        var modeNum = modeToNumber(mode);
        var fileName = pathToFilename(path);
        var flagsNum = flagsToNumber(flags);
        return this.openBase(fileName, flagsNum, modeNum);
    };
    Volume.prototype.open = function (path, flags, a, b) {
        var mode = a;
        var callback = b;
        if (typeof a === 'function') {
            mode = 438 /* MODE.DEFAULT */;
            callback = a;
        }
        mode = mode || 438 /* MODE.DEFAULT */;
        var modeNum = modeToNumber(mode);
        var fileName = pathToFilename(path);
        var flagsNum = flagsToNumber(flags);
        this.wrapAsync(this.openBase, [fileName, flagsNum, modeNum], callback);
    };
    Volume.prototype.closeFile = function (file) {
        if (!this.fds[file.fd])
            return;
        this.openFiles--;
        delete this.fds[file.fd];
        this.releasedFds.push(file.fd);
    };
    Volume.prototype.closeSync = function (fd) {
        validateFd(fd);
        var file = this.getFileByFdOrThrow(fd, 'close');
        this.closeFile(file);
    };
    Volume.prototype.close = function (fd, callback) {
        validateFd(fd);
        this.wrapAsync(this.closeSync, [fd], callback);
    };
    Volume.prototype.openFileOrGetById = function (id, flagsNum, modeNum) {
        if (typeof id === 'number') {
            var file = this.fds[id];
            if (!file)
                throw createError(ENOENT);
            return file;
        }
        else {
            return this.openFile(pathToFilename(id), flagsNum, modeNum);
        }
    };
    Volume.prototype.readBase = function (fd, buffer, offset, length, position) {
        var file = this.getFileByFdOrThrow(fd);
        return file.read(buffer, Number(offset), Number(length), position);
    };
    Volume.prototype.readSync = function (fd, buffer, offset, length, position) {
        validateFd(fd);
        return this.readBase(fd, buffer, offset, length, position);
    };
    Volume.prototype.read = function (fd, buffer, offset, length, position, callback) {
        var _this = this;
        validateCallback(callback);
        // This `if` branch is from Node.js
        if (length === 0) {
            return process_1.default.nextTick(function () {
                if (callback)
                    callback(null, 0, buffer);
            });
        }
        (0, setImmediate_1.default)(function () {
            try {
                var bytes = _this.readBase(fd, buffer, offset, length, position);
                callback(null, bytes, buffer);
            }
            catch (err) {
                callback(err);
            }
        });
    };
    Volume.prototype.readFileBase = function (id, flagsNum, encoding) {
        var result;
        var isUserFd = typeof id === 'number';
        var userOwnsFd = isUserFd && isFd(id);
        var fd;
        if (userOwnsFd)
            fd = id;
        else {
            var filename = pathToFilename(id);
            var steps = filenameToSteps(filename);
            var link = this.getResolvedLink(steps);
            if (link) {
                var node = link.getNode();
                if (node.isDirectory())
                    throw createError(EISDIR, 'open', link.getPath());
            }
            fd = this.openSync(id, flagsNum);
        }
        try {
            result = bufferToEncoding(this.getFileByFdOrThrow(fd).getBuffer(), encoding);
        }
        finally {
            if (!userOwnsFd) {
                this.closeSync(fd);
            }
        }
        return result;
    };
    Volume.prototype.readFileSync = function (file, options) {
        var opts = getReadFileOptions(options);
        var flagsNum = flagsToNumber(opts.flag);
        return this.readFileBase(file, flagsNum, opts.encoding);
    };
    Volume.prototype.readFile = function (id, a, b) {
        var _a = optsAndCbGenerator(getReadFileOptions)(a, b), opts = _a[0], callback = _a[1];
        var flagsNum = flagsToNumber(opts.flag);
        this.wrapAsync(this.readFileBase, [id, flagsNum, opts.encoding], callback);
    };
    Volume.prototype.writeBase = function (fd, buf, offset, length, position) {
        var file = this.getFileByFdOrThrow(fd, 'write');
        return file.write(buf, offset, length, position);
    };
    Volume.prototype.writeSync = function (fd, a, b, c, d) {
        validateFd(fd);
        var encoding;
        var offset;
        var length;
        var position;
        var isBuffer = typeof a !== 'string';
        if (isBuffer) {
            offset = (b || 0) | 0;
            length = c;
            position = d;
        }
        else {
            position = b;
            encoding = c;
        }
        var buf = dataToBuffer(a, encoding);
        if (isBuffer) {
            if (typeof length === 'undefined') {
                length = buf.length;
            }
        }
        else {
            offset = 0;
            length = buf.length;
        }
        return this.writeBase(fd, buf, offset, length, position);
    };
    Volume.prototype.write = function (fd, a, b, c, d, e) {
        var _this = this;
        validateFd(fd);
        var offset;
        var length;
        var position;
        var encoding;
        var callback;
        var tipa = typeof a;
        var tipb = typeof b;
        var tipc = typeof c;
        var tipd = typeof d;
        if (tipa !== 'string') {
            if (tipb === 'function') {
                callback = b;
            }
            else if (tipc === 'function') {
                offset = b | 0;
                callback = c;
            }
            else if (tipd === 'function') {
                offset = b | 0;
                length = c;
                callback = d;
            }
            else {
                offset = b | 0;
                length = c;
                position = d;
                callback = e;
            }
        }
        else {
            if (tipb === 'function') {
                callback = b;
            }
            else if (tipc === 'function') {
                position = b;
                callback = c;
            }
            else if (tipd === 'function') {
                position = b;
                encoding = c;
                callback = d;
            }
        }
        var buf = dataToBuffer(a, encoding);
        if (tipa !== 'string') {
            if (typeof length === 'undefined')
                length = buf.length;
        }
        else {
            offset = 0;
            length = buf.length;
        }
        var cb = validateCallback(callback);
        (0, setImmediate_1.default)(function () {
            try {
                var bytes = _this.writeBase(fd, buf, offset, length, position);
                if (tipa !== 'string') {
                    cb(null, bytes, buf);
                }
                else {
                    cb(null, bytes, a);
                }
            }
            catch (err) {
                cb(err);
            }
        });
    };
    Volume.prototype.writeFileBase = function (id, buf, flagsNum, modeNum) {
        // console.log('writeFileBase', id, buf, flagsNum, modeNum);
        // const node = this.getNodeByIdOrCreate(id, flagsNum, modeNum);
        // node.setBuffer(buf);
        var isUserFd = typeof id === 'number';
        var fd;
        if (isUserFd)
            fd = id;
        else {
            fd = this.openBase(pathToFilename(id), flagsNum, modeNum);
            // fd = this.openSync(id as PathLike, flagsNum, modeNum);
        }
        var offset = 0;
        var length = buf.length;
        var position = flagsNum & O_APPEND ? undefined : 0;
        try {
            while (length > 0) {
                var written = this.writeSync(fd, buf, offset, length, position);
                offset += written;
                length -= written;
                if (position !== undefined)
                    position += written;
            }
        }
        finally {
            if (!isUserFd)
                this.closeSync(fd);
        }
    };
    Volume.prototype.writeFileSync = function (id, data, options) {
        var opts = getWriteFileOptions(options);
        var flagsNum = flagsToNumber(opts.flag);
        var modeNum = modeToNumber(opts.mode);
        var buf = dataToBuffer(data, opts.encoding);
        this.writeFileBase(id, buf, flagsNum, modeNum);
    };
    Volume.prototype.writeFile = function (id, data, a, b) {
        var options = a;
        var callback = b;
        if (typeof a === 'function') {
            options = writeFileDefaults;
            callback = a;
        }
        var cb = validateCallback(callback);
        var opts = getWriteFileOptions(options);
        var flagsNum = flagsToNumber(opts.flag);
        var modeNum = modeToNumber(opts.mode);
        var buf = dataToBuffer(data, opts.encoding);
        this.wrapAsync(this.writeFileBase, [id, buf, flagsNum, modeNum], cb);
    };
    Volume.prototype.linkBase = function (filename1, filename2) {
        var steps1 = filenameToSteps(filename1);
        var link1 = this.getLink(steps1);
        if (!link1)
            throw createError(ENOENT, 'link', filename1, filename2);
        var steps2 = filenameToSteps(filename2);
        // Check new link directory exists.
        var dir2 = this.getLinkParent(steps2);
        if (!dir2)
            throw createError(ENOENT, 'link', filename1, filename2);
        var name = steps2[steps2.length - 1];
        // Check if new file already exists.
        if (dir2.getChild(name))
            throw createError(EEXIST, 'link', filename1, filename2);
        var node = link1.getNode();
        node.nlink++;
        dir2.createChild(name, node);
    };
    Volume.prototype.copyFileBase = function (src, dest, flags) {
        var buf = this.readFileSync(src);
        if (flags & COPYFILE_EXCL) {
            if (this.existsSync(dest)) {
                throw createError(EEXIST, 'copyFile', src, dest);
            }
        }
        if (flags & COPYFILE_FICLONE_FORCE) {
            throw createError(ENOSYS, 'copyFile', src, dest);
        }
        this.writeFileBase(dest, buf, FLAGS.w, 438 /* MODE.DEFAULT */);
    };
    Volume.prototype.copyFileSync = function (src, dest, flags) {
        var srcFilename = pathToFilename(src);
        var destFilename = pathToFilename(dest);
        return this.copyFileBase(srcFilename, destFilename, (flags || 0) | 0);
    };
    Volume.prototype.copyFile = function (src, dest, a, b) {
        var srcFilename = pathToFilename(src);
        var destFilename = pathToFilename(dest);
        var flags;
        var callback;
        if (typeof a === 'function') {
            flags = 0;
            callback = a;
        }
        else {
            flags = a;
            callback = b;
        }
        validateCallback(callback);
        this.wrapAsync(this.copyFileBase, [srcFilename, destFilename, flags], callback);
    };
    Volume.prototype.linkSync = function (existingPath, newPath) {
        var existingPathFilename = pathToFilename(existingPath);
        var newPathFilename = pathToFilename(newPath);
        this.linkBase(existingPathFilename, newPathFilename);
    };
    Volume.prototype.link = function (existingPath, newPath, callback) {
        var existingPathFilename = pathToFilename(existingPath);
        var newPathFilename = pathToFilename(newPath);
        this.wrapAsync(this.linkBase, [existingPathFilename, newPathFilename], callback);
    };
    Volume.prototype.unlinkBase = function (filename) {
        var steps = filenameToSteps(filename);
        var link = this.getLink(steps);
        if (!link)
            throw createError(ENOENT, 'unlink', filename);
        // TODO: Check if it is file, dir, other...
        if (link.length)
            throw Error('Dir not empty...');
        this.deleteLink(link);
        var node = link.getNode();
        node.nlink--;
        // When all hard links to i-node are deleted, remove the i-node, too.
        if (node.nlink <= 0) {
            this.deleteNode(node);
        }
    };
    Volume.prototype.unlinkSync = function (path) {
        var filename = pathToFilename(path);
        this.unlinkBase(filename);
    };
    Volume.prototype.unlink = function (path, callback) {
        var filename = pathToFilename(path);
        this.wrapAsync(this.unlinkBase, [filename], callback);
    };
    Volume.prototype.symlinkBase = function (targetFilename, pathFilename) {
        var pathSteps = filenameToSteps(pathFilename);
        // Check if directory exists, where we about to create a symlink.
        var dirLink = this.getLinkParent(pathSteps);
        if (!dirLink)
            throw createError(ENOENT, 'symlink', targetFilename, pathFilename);
        var name = pathSteps[pathSteps.length - 1];
        // Check if new file already exists.
        if (dirLink.getChild(name))
            throw createError(EEXIST, 'symlink', targetFilename, pathFilename);
        // Create symlink.
        var symlink = dirLink.createChild(name);
        symlink.getNode().makeSymlink(filenameToSteps(targetFilename));
        return symlink;
    };
    // `type` argument works only on Windows.
    Volume.prototype.symlinkSync = function (target, path, type) {
        var targetFilename = pathToFilename(target);
        var pathFilename = pathToFilename(path);
        this.symlinkBase(targetFilename, pathFilename);
    };
    Volume.prototype.symlink = function (target, path, a, b) {
        var callback = validateCallback(typeof a === 'function' ? a : b);
        var targetFilename = pathToFilename(target);
        var pathFilename = pathToFilename(path);
        this.wrapAsync(this.symlinkBase, [targetFilename, pathFilename], callback);
    };
    Volume.prototype.realpathBase = function (filename, encoding) {
        var steps = filenameToSteps(filename);
        var realLink = this.getResolvedLink(steps);
        if (!realLink)
            throw createError(ENOENT, 'realpath', filename);
        return (0, encoding_1.strToEncoding)(realLink.getPath() || '/', encoding);
    };
    Volume.prototype.realpathSync = function (path, options) {
        return this.realpathBase(pathToFilename(path), getRealpathOptions(options).encoding);
    };
    Volume.prototype.realpath = function (path, a, b) {
        var _a = getRealpathOptsAndCb(a, b), opts = _a[0], callback = _a[1];
        var pathFilename = pathToFilename(path);
        this.wrapAsync(this.realpathBase, [pathFilename, opts.encoding], callback);
    };
    Volume.prototype.lstatBase = function (filename, bigint, throwIfNoEntry) {
        if (bigint === void 0) { bigint = false; }
        if (throwIfNoEntry === void 0) { throwIfNoEntry = false; }
        var link = this.getLink(filenameToSteps(filename));
        if (link) {
            return Stats_1.default.build(link.getNode(), bigint);
        }
        else if (!throwIfNoEntry) {
            return undefined;
        }
        else {
            throw createError(ENOEN{"version":3,"names":["_helperPluginUtils","require","_helperModuleImports","_core","_helpers","_index","_coreJs","_index2","_default","exports","default","declare","api","options","dirname","_options$corejs","assertVersion","helpers","useRuntimeHelpers","version","runtimeVersion","absoluteRuntime","moduleName","Error","DUAL_MODE_RUNTIME","supportsCJSDefault","hasMinVersion","hasOwnProperty","call","useESModules","esModules","caller","supportsStaticESM","HEADER_HELPERS","name","inherits","babel7","createPolyfillPlugins","corejs","createCorejs3Plugin","pre","file","modulePath","set","_modulePath","_ref","getRuntimePath","get","availableHelper","t","arrowFunctionExpression","identifier","isInteropHelper","indexOf","blockHoist","isModule","path","undefined","helperPath","node","sourceType","resolveFSPath","addDefaultImport","cache","Map","source","nameHint","isHelper","cacheKey","key","cached","cloneNode","addDefault","importedInterop"],"sources":["../src/index.ts"],"sourcesContent":["import { declare } from \"@babel/helper-plugin-utils\";\nimport { addDefault, isModule } from \"@babel/helper-module-imports\";\nimport { types as t } from \"@babel/core\";\n\nimport { hasMinVersion } from \"./helpers.ts\";\nimport getRuntimePath, { resolveFSPath } from \"./get-runtime-path/index.ts\";\nimport { createCorejs3Plugin } from \"./core-js.ts\";\n\n// TODO(Babel 8): Remove this\nimport babel7 from \"./babel-7/index.cjs\";\n\nexport interface Options {\n  absoluteRuntime?: boolean;\n  corejs?: string | number | { version: string | number; proposals?: boolean };\n  helpers?: boolean;\n  version?: string;\n  moduleName?: null | string;\n}\n\nexport default declare((api, options: Options, dirname) => {\n  api.assertVersion(\n    process.env.BABEL_8_BREAKING && process.env.IS_PUBLISH\n      ? PACKAGE_JSON.version\n      : 7,\n  );\n\n  const {\n    helpers: useRuntimeHelpers = true,\n    version: runtimeVersion = \"7.0.0-beta.0\",\n    absoluteRuntime = false,\n    moduleName = null,\n  } = options;\n\n  if (typeof useRuntimeHelpers !== \"boolean\") {\n    throw new Error(\"The 'helpers' option must be undefined, or a boolean.\");\n  }\n\n  if (\n    typeof absoluteRuntime !== \"boolean\" &&\n    typeof absoluteRuntime !== \"string\"\n  ) {\n    throw new Error(\n      \"The 'absoluteRuntime' option must be undefined, a boolean, or a string.\",\n    );\n  }\n\n  if (typeof runtimeVersion !== \"string\") {\n    throw new Error(`The 'version' option must be a version string.`);\n  }\n\n  if (moduleName !== null && typeof moduleName !== \"string\") {\n    throw new Error(\"The 'moduleName' option must be null or a string.\");\n  }\n\n  if (!process.env.BABEL_8_BREAKING) {\n    // In recent @babel/runtime versions, we can use require(\"helper\").default\n    // instead of require(\"helper\") so that it has the same interface as the\n    // ESM helper, and bundlers can better exchange one format for the other.\n    const DUAL_MODE_RUNTIME = \"7.13.0\";\n    // eslint-disable-next-line no-var\n    var supportsCJSDefault = hasMinVersion(DUAL_MODE_RUNTIME, runtimeVersion);\n  }\n\n  if (Object.hasOwn(options, \"useBuiltIns\")) {\n    // @ts-expect-error deprecated options\n    if (options[\"useBuiltIns\"]) {\n      throw new Error(\n        \"The 'useBuiltIns' option has been removed. The @babel/runtime \" +\n          \"module now uses builtins by default.\",\n      );\n    } else {\n      throw new Error(\n        \"The 'useBuiltIns' option has been removed. Use the 'corejs'\" +\n          \"option to polyfill with `core-js` via @babel/runtime.\",\n      );\n    }\n  }\n\n  if (Object.hasOwn(options, \"polyfill\")) {\n    // @ts-expect-error deprecated options\n    if (options[\"polyfill\"] === false) {\n      throw new Error(\n        \"The 'polyfill' option has been removed. The @babel/runtime \" +\n          \"module now skips polyfilling by default.\",\n      );\n    } else {\n      throw new Error(\n        \"The 'polyfill' option has been removed. Use the 'corejs'\" +\n          \"option to polyfill with `core-js` via @babel/runtime.\",\n      );\n    }\n  }\n\n  if (process.env.BABEL_8_BREAKING) {\n    if (Object.hasOwn(options, \"regenerator\")) {\n      throw new Error(\n        \"The 'regenerator' option has been removed. The generators transform \" +\n          \"no longers relies on a 'regeneratorRuntime' global. \" +\n          \"If you still need to replace imports to the 'regeneratorRuntime' \" +\n          \"global, you can use babel-plugin-polyfill-regenerator.\",\n      );\n    }\n  }\n\n  if (process.env.BABEL_8_BREAKING) {\n    if (Object.hasOwn(options, \"useESModules\")) {\n      throw new Error(\n        \"The 'useESModules' option has been removed. @babel/runtime now uses \" +\n          \"package.json#exports to support both CommonJS and ESM helpers.\",\n      );\n    }\n  } else {\n    // @ts-expect-error(Babel 7 vs Babel 8)\n    const { useESModules = false } = options;\n    if (typeof useESModules !== \"boolean\" && useESModules !== \"auto\") {\n      throw new Error(\n        \"The 'useESModules' option must be undefined, or a boolean, or 'auto'.\",\n      );\n    }\n\n    // eslint-disable-next-line no-var\n    var esModules =\n      useESModules === \"auto\"\n        ? api.caller(\n            // @ts-expect-error CallerMetadata does not define supportsStaticESM\n            caller => !!caller?.supportsStaticESM,\n          )\n        : useESModules;\n  }\n\n  const HEADER_HELPERS = [\"interopRequireWildcard\", \"interopRequireDefault\"];\n\n  return {\n    name: \"transform-runtime\",\n\n    inherits: process.env.BABEL_8_BREAKING\n      ? options.corejs\n        ? createCorejs3Plugin(options.corejs, absoluteRuntime)\n        : undefined\n      : babel7.createPolyfillPlugins(\n          options,\n          runtimeVersion,\n          absoluteRuntime,\n          options.corejs === 3 ||\n            (options.corejs as Options[\"corejs\"] & object)?.version === 3\n            ? createCorejs3Plugin(options.corejs, absoluteRuntime)\n            : null,\n        ),\n\n    pre(file) {\n      if (!useRuntimeHelpers) return;\n\n      let modulePath: string;\n\n      file.set(\"helperGenerator\", (name: string) => {\n        modulePath ??= getRuntimePath(\n          moduleName ??\n            file.get(\"runtimeHelpersModuleName\") ??\n            \"@babel/runtime\",\n          dirname,\n          absoluteRuntime,\n        );\n\n        // If the helper didn't exist yet at the version given, we bail\n        // out and let Babel either insert it directly, or throw an error\n        // so that plugins can handle that case properly.\n        if (!process.env.BABEL_8_BREAKING) {\n          if (!file.availableHelper?.(name, runtimeVersion)) {\n            if (name === \"regeneratorRuntime\") {\n              // For regeneratorRuntime, we can fallback to the old behavior of\n              // relying on the regeneratorRuntime global. If the 'regenerator'\n              // option is not disabled, babel-plugin-polyfill-regenerator will\n              // then replace it with a @babel/helpers/regenerator import.\n              //\n              // We must wrap it in a function, because built-in Babel helpers\n              // are functions.\n              return t.arrowFunctionExpression(\n                [],\n                t.identifier(\"regeneratorRuntime\"),\n              );\n            }\n            return;\n          }\n        } else {\n          if (!file.availableHelper(name, runtimeVersion)) return;\n        }\n\n        const isInteropHelper = HEADER_HELPERS.indexOf(name) !== -1;\n\n        // Explicitly set the CommonJS interop helpers to their reserve\n        // blockHoist of 4 so they are guaranteed to exist\n        // when other things used them to import.\n        const blockHoist =\n          isInteropHelper && !isModule(file.path) ? 4 : undefined;\n\n        let helperPath = `${modulePath}/helpers/${\n          !process.env.BABEL_8_BREAKING &&\n          esModules &&\n          file.path.node.sourceType === \"module\"\n            ? \"esm/\" + name\n            : name\n        }`;\n        if (absoluteRuntime) helperPath = resolveFSPath(helperPath);\n\n        return addDefaultImport(helperPath, name, blockHoist, true);\n      });\n\n      const cache = new Map();\n\n      function addDefaultImport(\n        source: string,\n        nameHint: string,\n        blockHoist: number,\n        isHelper = false,\n      ) {\n        // If something on the page adds a helper when the file is an ES6\n        // file, we can't reused the cached helper name after things have been\n        // transformed because it has almost certainly been renamed.\n        const cacheKey = isModule(file.path);\n        const key = `${source}:${nameHint}:${cacheKey || \"\"}`;\n\n        let cached = cache.get(key);\n        if (cached) {\n          cached = t.cloneNode(cached);\n        } else {\n          cached = addDefault(file.path, source, {\n            importedInterop: (\n              process.env.BABEL_8_BREAKING\n                ? isHelper\n                : isHelper && supportsCJSDefault\n            )\n              ? \"compiled\"\n              : \"uncompiled\",\n            nameHint,\n            blockHoist,\n          });\n\n          cache.set(key, cached);\n        }\n        return cached;\n      }\n    },\n  };\n});\n"],"mappings":";;;;;;AAAA,IAAAA,kBAAA,GAAAC,OAAA;AACA,IAAAC,oBAAA,GAAAD,OAAA;AACA,IAAAE,KAAA,GAAAF,OAAA;AAEA,IAAAG,QAAA,GAAAH,OAAA;AACA,IAAAI,MAAA,GAAAJ,OAAA;AACA,IAAAK,OAAA,GAAAL,OAAA;AAGA,IAAAM,OAAA,GAAAN,OAAA;AAAyC,IAAAO,QAAA,GAAAC,OAAA,CAAAC,OAAA,GAU1B,IAAAC,0BAAO,EAAC,CAACC,GAAG,EAAEC,OAAgB,EAAEC,OAAO,KAAK;EAAA,IAAAC,eAAA;EACzDH,GAAG,CAACI,aAAa,CAGX,CACN,CAAC;EAED,MAAM;IACJC,OAAO,EAAEC,iBAAiB,GAAG,IAAI;IACjCC,OAAO,EAAEC,cAAc,GAAG,cAAc;IACxCC,eAAe,GAAG,KAAK;IACvBC,UAAU,GAAG;EACf,CAAC,GAAGT,OAAO;EAEX,IAAI,OAAOK,iBAAiB,KAAK,SAAS,EAAE;IAC1C,MAAM,IAAIK,KAAK,CAAC,uDAAuD,CAAC;EAC1E;EAEA,IACE,OAAOF,eAAe,KAAK,SAAS,IACpC,OAAOA,eAAe,KAAK,QAAQ,EACnC;IACA,MAAM,IAAIE,KAAK,CACb,yEACF,CAAC;EACH;EAEA,IAAI,OAAOH,cAAc,KAAK,QAAQ,EAAE;IACtC,MAAM,IAAIG,KAAK,CAAE,gDAA+C,CAAC;EACnE;EAEA,IAAID,UAAU,KAAK,IAAI,IAAI,OAAOA,UAAU,KAAK,QAAQ,EAAE;IACzD,MAAM,IAAIC,KAAK,CAAC,mDAAmD,CAAC;EACtE;EAEmC;IAIjC,MAAMC,iBAAiB,GAAG,QAAQ;IAElC,IAAIC,kBAAkB,GAAG,IAAAC,sBAAa,EAACF,iBAAiB,EAAEJ,cAAc,CAAC;EAC3E;EAEA,IAAIO,cAAA,CAAAC,IAAA,CAAcf,OAAO,EAAE,aAAa,CAAC,EAAE;IAEzC,IAAIA,OAAO,CAAC,aAAa,CAAC,EAAE;MAC1B,MAAM,IAAIU,KAAK,CACb,gEAAgE,GAC9D,sCACJ,CAAC;IACH,CAAC,MAAM;MACL,MAAM,IAAIA,KAAK,CACb,6DAA6D,GAC3D,uDACJ,CAAC;IACH;EACF;EAEA,IAAII,cAAA,CAAAC,IAAA,CAAcf,OAAO,EAAE,UAAU,CAAC,EAAE;IAEtC,IAAIA,OAAO,CAAC,UAAU,CAAC,KAAK,KAAK,EAAE;MACjC,MAAM,IAAIU,KAAK,CACb,6DAA6D,GAC3D,0CACJ,CAAC;IACH,CAAC,MAAM;MACL,MAAM,IAAIA,KAAK,CACb,0DAA0D,GACxD,uDACJ,CAAC;IACH;EACF;EAAC;EAoBM;IAEL,MAAM;MAAEM,YAAY,GAAG;IAAM,CAAC,GAAGhB,OAAO;IACxC,IAAI,OAAOgB,YAAY,KAAK,SAAS,IAAIA,YAAY,KAAK,MAAM,EAAE;MAChE,MAAM,IAAIN,KAAK,CACb,uEACF,CAAC;IACH;IAGA,IAAIO,SAAS,GACXD,YAAY,KAAK,MAAM,GACnBjB,GAAG,CAACmB,MAAM,CAERA,MAAM,IAAI,CAAC,EAACA,MAAM,YAANA,MAAM,CAAEC,iBAAiB,CACvC,CAAC,GACDH,YAAY;EACpB;EAEA,MAAMI,cAAc,GAAG,CAAC,wBAAwB,EAAE,uBAAuB,CAAC;EAE1E,OAAO;IACLC,IAAI,EAAE,mBAAmB;IAEzBC,QAAQ,EAIJC,OAAM,CAACC,qBAAqB,CAC1BxB,OAAO,EACPO,cAAc,EACdC,eAAe,EACfR,OAAO,CAACyB,MAAM,KAAK,CAAC,IAClB,EAAAvB,eAAA,GAACF,OAAO,CAACyB,MAAM,qBAAfvB,eAAA,CAAgDI,OAAO,MAAK,CAAC,GAC3D,IAAAoB,2BAAmB,EAAC1B,OAAO,CAACyB,MAAM,EAAEjB,eAAe,CAAC,GACpD,IACN,CAAC;IAELmB,GAAGA,CAACC,IAAI,EAAE;MACR,IAAI,CAACvB,iBAAiB,EAAE;MAExB,IAAIwB,UAAkB;MAEtBD,IAAI,CAACE,GAAG,CAAC,iBAAiB,EAAGT,IAAY,IAAK;QAAA,IAAAU,WAAA,EAAAC,IAAA;QAC5C,CAAAD,WAAA,GAAAF,UAAU,YAAAE,WAAA,GAAVF,UAAU,GAAK,IAAAI,cAAc,GAAAD,IAAA,GAC3BvB,UAAU,WAAVA,UAAU,GACRmB,IAAI,CAACM,GAAG,CAAC,0BAA0B,CAAC,YAAAF,IAAA,GACpC,gBAAgB,EAClB/B,OAAO,EACPO,eACF,CAAC;QAKkC;UACjC,IAAI,EAACoB,IAAI,CAACO,eAAe,YAApBP,IAAI,CAACO,eAAe,CAAGd,IAAI,EAAEd,cAAc,CAAC,GAAE;YACjD,IAAIc,IAAI,KAAK,oBAAoB,EAAE;cAQjC,OAAOe,WAAC,CAACC,uBAAuB,CAC9B,EAAE,EACFD,WAAC,CAACE,UAAU,CAAC,oBAAoB,CACnC,CAAC;YACH;YACA;UACF;QACF;QAIA,MAAMC,eAAe,GAAGnB,cAAc,CAACoB,OAAO,CAACnB,IAAI,CAAC,KAAK,CAAC,CAAC;QAK3D,MAAMoB,UAAU,GACdF,eAAe,IAAI,CAAC,IAAAG,6BAAQ,EAACd,IAAI,CAACe,IAAI,CAAC,GAAG,CAAC,GAAGC,SAAS;QAEzD,IAAIC,UAAU,GAAI,GAAEhB,UAAW,YAE7BZ,SAAS,IACTW,IAAI,CAACe,IAAI,CAACG,IAAI,CAACC,UAAU,KAAK,QAAQ,GAClC,MAAM,GAAG1B,IAAI,GACbA,IACL,EAAC;QACF,IAAIb,eAAe,EAAEqC,UAAU,GAAG,IAAAG,oBAAa,EAACH,UAAU,CAAC;QAE3D,OAAOI,gBAAgB,CAACJ,UAAU,EAAExB,IAAI,EAAEoB,UAAU,EAAE,IAAI,CAAC;MAC7D,CAAC,CAAC;MAEF,MAAMS,KAAK,GAAG,IAAIC,GAAG,CAAC,CAAC;MAEvB,SAASF,gBAAgBA,CACvBG,MAAc,EACdC,QAAgB,EAChBZ,UAAkB,EAClBa,QAAQ,GAAG,KAAK,EAChB;QAIA,MAAMC,QAAQ,GAAG,IAAAb,6BAAQ,EAACd,IAAI,CAACe,IAAI,CAAC;QACpC,MAAMa,GAAG,GAAI,GAAEJ,MAAO,IAAGC,QAAS,IAAGE,QAAQ,IAAI,EAAG,EAAC;QAErD,IAAIE,MAAM,GAAGP,KAAK,CAAChB,GAAG,CAACsB,GAAG,CAAC;QAC3B,IAAIC,MAAM,EAAE;UACVA,MAAM,GAAGrB,WAAC,CAACsB,SAAS,CAACD,MAAM,CAAC;QAC9B,CAAC,MAAM;UACLA,MAAM,GAAG,IAAAE,+BAAU,EAAC/B,IAAI,CAACe,IAAI,EAAES,MAAM,EAAE;YACrCQ,eAAe,EAGTN,QAAQ,IAAI1C,kBAAkB,GAEhC,UAAU,GACV,YAAY;YAChByC,QAAQ;YACRZ;UACF,CAAC,CAAC;UAEFS,KAAK,CAACpB,GAAG,CAAC0B,GAAG,EAAEC,MAAM,CAAC;QACxB;QACA,OAAOA,MAAM;MACf;IACF;EACF,CAAC;AACH,CAAC,CAAC"}                                                                                                                            �]��k-�,����y2l�鈗�� �C�D���7�j���ߺ�r���Ĩ8��@\�@�{��{�y��<ߔ�"f�%�����,k�ݥ�d�~$)��"5�:U��@� �|���w����ؚDl����^�zLۧ�m�v���ub8E:�	����4���~���`�������^�Fi��u�z�'�wB�L�\�g<����B�����c?��m�
�����'~�\o��
�J��49o�,�=���qMv��`(2�f�e��ڼ������KC�Ii���t-��'�O���E�=�RtP)H��H�T4]ݪ�gL���WCڼ�E�bE4R�����D�<yd	�Ӻ�K�ן�zoPg�{��c��"n;�hN�<Mn0`2K�D漼�b���CT�}��I5e�+�bl���>�W���B^$[����Z�1)�ӱ<��ӫVԹH����qNڕ��!ih6܏��y�g]�Q雄(Yn�[���]��B(x�8�;U!h�2A<X��j���Kw?���?�������N�i�ҹ�~R^
${��
�ǂ�'/�N�:��m�����g��}'�P$b1N9�<
w��$U|9�7 ���������y����b�9襪�� V�PI���[�\Q����<D�z[����&�'��J'�d�Q.��=��fk��w@���|)G��w;b*R����	��õ#��研!�4M�2~o�BN��F<;���cЌL#��(~@\n�Z)����$h�Wܜ��̪��P������&@������A����o�!�F\���9);���=�_��%=�׀��^��Q�'R�;����؇��!�z_��#�.�:��w]q�~s�������������ް�m��W�ҡ��=ݤ�I/�Z�Wf��

����,	����t��b7l� ��(:~uR��e�	�oD���N=������0��U�s�Q�>,�ҧ�"eITe4K�oJh|���^O�چί��V\l5{������5�B�����ܘ�ʊ���AF��4��f��\��9o����/7���ਲ਼e�:�Z��'�v��4��	�3q-�����"a\�F��������_u�Y�6�}g�����'�-��`:xE[��/�p�����`�ĸ#�M�!J�{� �@���%gZ����Ŭ�VPXrD�apY���o�"����i�p# �
��2^!uΪ/L�0;Ю����Щ6�
����+��;<��ܶM'��x~_D���~�@���z��a��4�`<�-0�Yy�`Q��d����~[߳��g/�D�=�x��+�d��Q��'�K��44X
�wV�Uφ�Fzįs��~J3����`��2���|�Je�w�׈{�Z3>�)��/}6�h������P4|Yu�Z��7�r��?�ܟ��2R��e�B[|w��;��]���ğ�=�^�fr1�x>�>�ā_B�"���O�H8ԙ��e�R덩�.|��~_�*�e�`��~V���j� x|�@����A8��9�4xYD'n��V��U�ȥBE� U�Uo�T�@tΩ��d5�d03��������r�'5�A8H�����)�U�*��&t�gx��^k�@�O���R�	�m�ݰ��$�/�6��趄�3ſ�q���i]y�P�XsӰ��Go��J�`���3����Q֝W�z�p]>������G�88z��>����DP/}��۰���d�ԀD�|1Y�ǐ��k�1��D�<T�Wn����͞���0?r��?%���K�����g��v�A.2/=&��
�z���]���~�XQ��.����P7fQ��oAD�eQ*���aG�J�|q�R#)�A��
eIn,SbK�ߥQޗ���"��H�^%\��O��C��[�=����=���Z�jS���o4�'-��-����7l#t"'m�����b&'�Z�}��֙{WLw;���\�ҫLJ���}��~p!���s���9Mb�'ý:�_�R`[3�ʌ�7���ߊ}�y�-���O�푞�ܒ�(��"��R¢�~g=u]�|(���2����w��S}�t�wv�h�(f�J�8��y!$����[=L�Z{pϥ��6��oչ�*֎�{a+����O�"���-�-��A��' �D
7�=��;�K��"ֺY�+���U�t/-�L�:��?ˋ���	��C�Z\�� �I���f�T���e��픚�ת8��B��OD��"���hvR0� ��>�h�5�`!�%��Y�$'s�L,�SX���7#�V���/k5����I:x01�)�"�t���E?����6~=+/)8<'�LX�l!���"U�UV�*w�
9�{+�]��b�qS��y}O�u)J']w�JM�:}Gy,�e$re�ɵ�9��R�\�~ʱ~��n�!o��PE�;�o���uj႕ނ��k鿎o��v�U�XnRS���J����RE����1[Ӎt��2[��P:�v��פ��%�ū��{���[��Hl��_��GQK/@.٧�X�~��v �]~(*�e��S�8_�IE+��grB�>2�oET��ퟲ�َ����������݆�C(xk����]f�߬���_�vy����F���2� �.1�)�G�;���&̢1��u�<}`�4�|��ah�e��\��6��t��o=�e��S#���%���W��4��M$�0�����p 4]�� �I`8�2�q���t����x/Q#f+@>ؐ��������5�W�_�s�6���͚�?���m�X�n�eoKY�ftw&t=��*V� �ԣ+�J�-0���'x���]�ms"p���lǽ��C��vh�������	o˧�)!�Ub��}T?	w0Ep��Uaml��`W��7nF�T��dA����߇[�D]Zlaˢ�R/|���I�p3�!-І
�ɾd=�����Lη���S�Mɖ��E����~��-�6�s�O��<�H@�KN�Xd6 \�
�PF�'�#�*�"֠ U%�D�喸�^�.           Q�mXmX  R�mX�    ..          Q�mXmX  R�mX�O    MATH       �R�mXmX  S�mX��    Bo r . j s  �  ����������  ����a g g r e  �g a t e - e   r r AGGREG~1JS   =C�mXmX  E�mX �[   PROMISE    �Y�mXmX  Z�mX�    STRING     ls�mXmX  t�mX�    REFLECT    D��mXmX  ��mXȶ    OBJECT     g�mXmX  �mX��    Br   ������ +������������  ����a s y n c  +- i t e r a   t o ASYNC-~1    W��mXmX  ��mX
�    SYMBOL     i��mXmX  ��mXC�    ARRAY      ��mXmX  �mXJ�    INSTANCE   W�mXmX  �mX��    At y p e d  8- a r r a y     ��TYPED-~1    <�mXmX  �mX/�    ATOB    JS  �+�mXmX -�mX�WP   FUNCTION   �6�mXmX 7�mX�Y    BTOA    JS  4K�mXmX L�mX�]P   URL        �M�mXmX N�mXA^    Bt e . j s  B  ����������  ����c l e a r  B- i m m e d   i a CLEAR-~1JS   KW�mXmX X�mX�_[   Aa r r a y  Q- b u f f e   r   ARRAY-~1    &s�mXmX t�mX�e    Bb l e - s  �t a c k   ��  ����a s y n c  �- d i s p o   s a ASYNC-~2    �s�mXmX t�mX�e    Ba c k   �� .������������  ����d i s p o  .s a b l e -   s t DISPOS~1    =t�mXmX u�mXf    Ad o m - e  Yx c e p t i   o n DOM-EX~1    �t�mXmX u�mX9f    ERROR      Cx�mXmX y�mXWf    NUMBER     �x�mXmX y�mXsf    REGEXP     Jy�mXmX z�mX�f    SET        {��mXmX ��mX�s    ITERATOR   T��mXmX ��mX�s    ESCAPE  JS  R��mXmX ��mX	~R   Bn s   ���� �������������  ����d o m - c  �o l l e c t   i o DOM-CO~1    ��mXmX �mXÄ    Ad a t a -  �v i e w   ��  ����DATA-V~1    ��mXmX  �mX�    Bm e t h o  d . j s   ��  ����g e t - i  t e r a t o   r - GET-IT~1JS    �mXmX !�mX/�_   Bj s   ���� q������������  ����g e t - i  qt e r a t o   r . GET-IT~2JS   K �mXmX !�mXA�X   DATE       2#�mXmX $�mX7     Bs   ������ �������������  ����g l o b a  �l - t h i s   . j GLOBAL~1JS   $�mXmX %�mXa W   MAP        +%�mXmX &�mX�     INDEX   JS  -�mXmX .�mX]k   JSON       0-�mXmX .�mXd    Br a m s    �������������  ����u r l - s  �e a r c h -   p a URL-SE~1    .�mXmX /�mX�    WEAK-MAP   :.�mXmX /�mX�    WEAK-SET   L.�mXmX /�mX�    Bs   ������ |������������  ����i s - i t  |e r a b l e   . j IS-ITE~1JS   {;�mXmX <�mX�W   Bs   ������ �������������  ����p a r s e  �- f l o a t   . j PARSE-~1JS   �O�mXmX P�mX�W   Ap a r s e  %- i n t . j   s   PARSE-~2JS   =P�mXmX Q�mX�U   Bs k . j s  F  ����������  ����q u e u e  F- m i c r o   t a QUEUE-~1JS   �R�mXmX S�mX&	[   SELF    JS  �\�mXmX ]�mX�
P   B. j s   �� �������������  ����s e t - i  �m m e d i a   t e SET-IM~1JS   ]�mXmX `�mX�
Y   Bj s   ���� �������������  ����s e t - i  �n t e r v a   l . SET-IN~1JS   =]�mXmX `�mX�
X   Bs   ������ �������������  ����s e t - t  �i m e o u t   . j SET-TI~1JS   5`�mXmX a�mX�
W   Bo n e . j  �s   ��������  ����s t r u c  �t u r e d -   c l STRUCT~1JS   �h�mXmX i�mX�\   Br o r . j  �s   ��������  ����s u p p r  �e s s e d -   e r SUPPRE~1JS   7j�mXmX k�mX��   UNESCAPEJS  �{�mXmX |�mX�T   README  MD  z��mXmX ��mX��                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
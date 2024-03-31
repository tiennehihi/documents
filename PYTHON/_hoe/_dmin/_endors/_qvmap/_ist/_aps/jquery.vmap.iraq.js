rawMode$2.exclamationMarkOrSemicolon, true);
    }

    function consumeCustomPropertyRaw(startToken) {
        return this.Raw(startToken, rawMode$2.exclamationMarkOrSemicolon, false);
    }

    function consumeValue() {
        var startValueToken = this.scanner.tokenIndex;
        var value = this.Value();

        if (value.type !== 'Raw' &&
            this.scanner.eof === false &&
            this.scanner.tokenType !== SEMICOLON$3 &&
            this.scanner.isDelim(EXCLAMATIONMARK$2) === false &&
            this.scanner.isBalanceEdge(startValueToken) === false) {
            this.error();
        }

        return value;
    }

    var Declaration = {
        name: 'Declaration',
        structure: {
            important: [Boolean, String],
            property: String,
            value: ['Value', 'Raw']
        },
        parse: function() {
            var start = this.scanner.tokenStart;
            var startToken = this.scanner.tokenIndex;
            var property = readProperty$1.call(this);
            var customProperty = isCustomProperty$1(property);
            var parseValue = customProperty ? this.parseCustomProperty : this.parseValue;
            var consumeRaw = customProperty ? consumeCustomPropertyRaw : consumeValueRaw;
            var important = false;
            var value;

            this.scanner.skipSC();
            this.eat(COLON$1);

            if (!customProperty) {
                this.scanner.skipSC();
            }

            if (parseValue) {
                value = this.parseWithFallback(consumeValue, consumeRaw);
            } else {
                value = consumeRaw.call(this, this.scanner.tokenIndex);
            }

            if (this.scanner.isDelim(EXCLAMATIONMARK$2)) {
                important = getImportant.call(this);
                this.scanner.skipSC();
            }

            // Do not include semicolon to range per spec
            // https://drafts.csswg.org/css-syntax/#declaration-diagram

            if (this.scanner.eof === false &&
                this.scanner.tokenType !== SEMICOLON$3 &&
                this.scanner.isBalanceEdge(startToken) === false) {
                this.error();
            }

            return {
                type: 'Declaration',
                loc: this.getLocation(start, this.scanner.tokenStart),
                important: important,
                property: property,
                value: value
            };
        },
        generate: function(node) {
            this.chunk(node.property);
            this.chunk(':');
            this.node(node.value);

            if (node.important) {
                this.chunk(node.important === true ? '!important' : '!' + node.important);
            }
        },
        walkContext: 'declaration'
    };

    function readProperty$1() {
        var start = this.scanner.tokenStart;

        // hacks
        if (this.scanner.tokenType === DELIM$2) {
            switch (this.scanner.source.charCodeAt(this.scanner.tokenStart)) {
                case ASTERISK$3:
                case DOLLARSIGN$1:
                case PLUSSIGN$5:
                case NUMBERSIGN$2:
                case AMPERSAND$1:
                    this.scanner.next();
                    break;

                // TODO: not sure we should support this hack
                case SOLIDUS$2:
                    this.scanner.next();
                    if (this.scanner.isDelim(SOLIDUS$2)) {
                        this.scanner.next();
                    }
                    break;
            }
        }

        if (this.scanner.tokenType === HASH$1) {
            this.eat(HASH$1);
        } else {
            this.eat(IDENT$7);
        }

        return this.scanner.substrToCursor(start);
    }

    // ! ws* important
    function getImportant() {
        this.eat(DELIM$2);
        this.scanner.skipSC();

        var important = this.consume(IDENT$7);

        // store original value in case it differ from `important`
        // for better original source restoring and hacks like `!ie` support
        return important === 'important' ? true : important;
    }

    var TYPE$k = tokenizer.TYPE;
    var rawMode$3 = Raw.mode;

    var WHITESPACE$6 = TYPE$k.WhiteSpace;
    var COMMENT$6 = TYPE$k.Comment;
    var SEMICOLON$4 = TYPE$k.Semicolon;

    function consumeRaw$2(startToken) {
        return this.Raw(startToken, rawMode$3.semicolonIncluded, true);
    }

    var DeclarationList = {
        name: 'DeclarationList',
        structure: {
            children: [[
                'Declaration'
            ]]
        },
        parse: function() {
            var children = this.createList();

            scan:
            while (!this.scanner.eof) {
                switch (this.scanner.tokenType) {
                    case WHITESPACE$6:
                    case COMMENT$6:
                    case SEMICOLON$4:
                        this.scanner.next();
                        break;

                    default:
                        children.push(this.parseWithFallback(this.Declaration, consumeRaw$2));
                }
            }

            return {
                type: 'DeclarationList',
                loc: this.getLocationFromList(children),
                children: children
            };
        },
        generate: function(node) {
            this.children(node, function(prev) {
                if (prev.type === 'Declaration') {
                    this.chunk(';');
                }
            });
        }
    };

    var consumeNumber$3 = utils.consumeNumber;
    var TYPE$l = tokenizer.TYPE;

    var DIMENSION$3 = TYPE$l.Dimension;

    var Dimension = {
        name: 'Dimension',
        structure: {
            value: String,
            unit: String
        },
        parse: function() {
            var start = this.scanner.tokenStart;
            var numberEnd = consumeNumber$3(this.scanner.source, start);

            this.eat(DIMENSION$3);

            return {
                type: 'Dimension',
                loc: this.getLocation(start, this.scanner.tokenStart),
                value: this.scanner.source.substring(start, numberEnd),
                unit: this.scanner.source.substring(numberEnd, this.scanner.tokenStart)
            };
        },
        generate: function(node) {
            this.chunk(node.value);
            this.chunk(node.unit);
        }
    };

    var TYPE$m = tokenizer.TYPE;

    var RIGHTPARENTHESIS$2 = TYPE$m.RightParenthesis;

    // <function-token> <sequence> )
    var _Function = {
        name: 'Function',
        structure: {
            name: String,
            children: [[]]
        },
        parse: function(readSequence, recognizer) {
            var start = this.scanner.tokenStart;
            var name = this.consumeFunctionName();
            var nameLowerCase = name.toLowerCase();
            var children;

            children = recognizer.hasOwnProperty(nameLowerCase)
                ? recognizer[nameLowerCase].call(this, recognizer)
                : readSequence.call(this, recognizer);

            if (!this.scanner.eof) {
                this.eat(RIGHTPARENTHESIS$2);
            }

            return {
                type: 'Function',
                loc: this.getLocation(start, this.scanner.tokenStart),
                name: name,
                children: children
            };
        },
        generate: function(node) {
            this.chunk(node.name);
            this.chunk('(');
            this.children(node);
            this.chunk(')');
        },
        walkContext: 'function'
    };

    var TYPE$n = tokenizer.TYPE;

    var HASH$2 = TYPE$n.Hash;

    // '#' ident
    var HexColor = {
        name: 'HexColor',
        structure: {
            value: String
        },
        parse: function() {
            var start = this.scanner.tokenStart;

            this.eat(HASH$2);

            return {
                type: 'HexColor',
                loc: this.getLocation(start, this.scanner.tokenStart),
                value: this.scanner.substrToCursor(start + 1)
            };
        },
        generate: function(node) {
            this.chunk('#');
            this.chunk(node.value);
        }
    };

    var TYPE$o = tokenizer.TYPE;

    var IDENT$8 = TYPE$o.Ident;

    var Identifier = {
        name: 'Identifier',
        structure: {
            name: String
        },
        parse: function() {
            return {
                type: 'Identifier',
                loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
                name: this.consume(IDENT$8)
            };
        },
        generate: function(node) {
            this.chunk(node.name);
        }
    };

    var TYPE$p = tokenizer.TYPE;

    var HASH$3 = TYPE$p.Hash;

    // <hash-token>
    var IdSelector = {
        name: 'IdSelector',
        structure: {
            name: String
        },
        parse: function() {
            var start = this.scanner.tokenStart;

            // TODO: check value is an ident
            this.eat(HASH$3);

            return {
                type: 'IdSelector',
                loc: this.getLocation(start, this.scanner.tokenStart),
                name: this.scanner.substrToCursor(start + 1)
            };
        },
        generate: function(node) {
            this.chunk('#');
            this.chunk(node.name);
        }
    };

    var TYPE$q = tokenizer.TYPE;

    var IDENT$9 = TYPE$q.Ident;
    var NUMBER$4 = TYPE$q.Number;
    var DIMENSION$4 = TYPE$q.Dimension;
    var LEFTPARENTHESIS$2 = TYPE$q.LeftParenthesis;
    var RIGHTPARENTHESIS$3 = TYPE$q.RightParenthesis;
    var COLON$2 = TYPE$q.Colon;
    var DELIM$3 = TYPE$q.Delim;

    var MediaFeature = {
        name: 'MediaFeature',
        structure: {
            name: String,
            value: ['Identifier', 'Number', 'Dimension', 'Ratio', null]
        },
        parse: function() {
            var start = this.scanner.tokenStart;
            var name;
            var value = null;

            this.eat(LEFTPARENTHESIS$2);
            this.scanner.skipSC();

            name = this.consume(IDENT$9);
            this.scanner.skipSC();

            if (this.scanner.tokenType !== RIGHTPARENTHESIS$3) {
                this.eat(COLON$2);
                this.scanner.skipSC();

                switch (this.scanner.tokenType) {
                    case NUMBER$4:
                        if (this.lookupNonWSType(1) === DELIM$3) {
                            value = this.Ratio();
                        } else {
                            value = this.Number();
                        }

                        break;

                    case DIMENSION$4:
                        value = this.Dimension();
                        break;

                    case IDENT$9:
                        value = this.Identifier();

                        break;

                    default:
                        this.error('Number, dimension, ratio or identifier is expected');
                }

                this.scanner.skipSC();
            }

            this.eat(RIGHTPARENTHESIS$3);

            return {
                type: 'MediaFeature',
                loc: this.getLocation(start, this.scanner.tokenStart),
                name: name,
                value: value
            };
        },
        generate: function(node) {
            this.chunk('(');
            this.chunk(node.name);
            if (node.value !== null) {
                this.chunk(':');
                this.node(node.value);
            }
            this.chunk(')');
        }
    };

    var TYPE$r = tokenizer.TYPE;

    var WHITESPACE$7 = TYPE$r.WhiteSpace;
    var COMMENT$7 = TYPE$r.Comment;
    var IDENT$a = TYPE$r.Ident;
    var LEFTPARENTHESIS$3 = TYPE$r.LeftParenthesis;

    var MediaQuery = {
        name: 'MediaQuery',
        structure: {
            children: [[
                'Identifier',
                'MediaFeature',
                'WhiteSpace'
            ]]
        },
        parse: function() {
            this.scanner.skipSC();

            var children = this.createList();
            var child = null;
            var space = null;

            scan:
            while (!this.scanner.eof) {
                switch (this.scanner.tokenType) {
                    case COMMENT$7:
                        this.scanner.next();
                        continue;

                    case WHITESPACE$7:
                        space = this.WhiteSpace();
                        continue;

                    case IDENT$a:
                        child = this.Identifier();
                        break;

                    case LEFTPARENTHESIS$3:
                        child = this.MediaFeature();
                        break;

                    default:
                        break scan;
                }

                if (space !== null) {
                    children.push(space);
                    space = null;
                }

                children.push(child);
            }

            if (child === null) {
                this.error('Identifier or parenthesis is expected');
            }

            return {
                type: 'MediaQuery',
                loc: this.getLocationFromList(children),
                children: children
            };
        },
        generate: function(node) {
            this.children(node);
        }
    };

    var COMMA$1 = tokenizer.TYPE.Comma;

    var MediaQueryList = {
        name: 'MediaQueryList',
        structure: {
            children: [[
                'MediaQuery'
            ]]
        },
        parse: function(relative) {
            var children = this.createList();

            this.scanner.skipSC();

            while (!this.scanner.eof) {
                children.push(this.MediaQuery(relative));

                if (this.scanner.tokenType !== COMMA$1) {
                    break;
                }

                this.scanner.next();
            }

            return {
                type: 'MediaQueryList',
                loc: this.getLocationFromList(children),
                children: children
            };
        },
        generate: function(node) {
            this.children(node, function() {
                this.chunk(',');
            });
        }
    };

    var Nth = {
        name: 'Nth',
        structure: {
            nth: ['AnPlusB', 'Identifier'],
            selector: ['SelectorList', null]
        },
        parse: function(allowOfClause) {
            this.scanner.skipSC();

            var start = this.scanner.tokenStart;
            var end = start;
            var selector = null;
            var query;

            if (this.scanner.lookupValue(0, 'odd') || this.scanner.lookupValue(0, 'even')) {
                query = this.Identifier();
            } else {
                query = this.AnPlusB();
            }

            this.scanner.skipSC();

            if (allowOfClause && this.scanner.lookupValue(0, 'of')) {
                this.scanner.next();

                selector = this.SelectorList();

                if (this.needPositions) {
                    end = this.getLastListNode(selector.children).loc.end.offset;
                }
            } else {
                if (this.needPositions) {
                    end = query.loc.end.offset;
                }
            }

            return {
                type: 'Nth',
                loc: this.getLocation(start, end),
                nth: query,
                selector: selector
            };
        },
        generate: function(node) {
            this.node(node.nth);
            if (node.selector !== null) {
                this.chunk(' of ');
                this.node(node.selector);
            }
        }
    };

    var NUMBER$5 = tokenizer.TYPE.Number;

    var _Number = {
        name: 'Number',
        structure: {
            value: String
        },
        parse: function() {
            return {
                type: 'Number',
                loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
                value: this.consume(NUMBER$5)
            };
        },
        generate: function(node) {
            this.chunk(node.value);
        }
    };

    // '/' | '*' | ',' | ':' | '+' | '-'
    var Operatotrue` and the destination is read only. See: [#190][#190]

0.26.0 / 2015-10-25
-------------------
- extracted the `walk()` function into its own module [`klaw`](https://github.com/jprichardson/node-klaw).

0.25.0 / 2015-10-24
-------------------
- now has a file walker `walk()`

0.24.0 / 2015-08-28
-------------------
- removed alias `delete()` and `deleteSync()`. See: [#171][#171]

0.23.1 / 2015-08-07
-------------------
- Better handling of errors for `move()` when moving across devices. [#170][#170]
- `ensureSymlink()` and `ensureLink()` should not throw errors if link exists. [#169][#169]

0.23.0 / 2015-08-06
-------------------
- added `ensureLink{Sync}()` and `ensureSymlink{Sync}()`. See: [#165][#165]

0.22.1 / 2015-07-09
-------------------
- Prevent calling `hasMillisResSync()` on module load. See: [#149][#149].
Fixes regression that was introduced in `0.21.0`.

0.22.0 / 2015-07-09
-------------------
- preserve permissions / ownership in `copy()`. See: [#54][#54]

0.21.0 / 2015-07-04
-------------------
- add option to preserve timestamps in `copy()` and `copySync()`. See: [#141][#141]
- updated `graceful-fs@3.x` to `4.x`. This brings in features from `amazing-graceful-fs` (much cleaner code / less hacks)

0.20.1 / 2015-06-23
-------------------
- fixed regression caused by latest jsonfile update: See: https://github.com/jprichardson/node-jsonfile/issues/26

0.20.0 / 2015-06-19
-------------------
- removed `jsonfile` aliases with `File` in the name, they weren't documented and probably weren't in use e.g.
this package had both `fs.readJsonFile` and `fs.readJson` that were aliases to each other, now use `fs.readJson`.
- preliminary walker created. Intentionally not documented. If you use it, it will almost certainly change and break your code.
- started moving tests inline
- upgraded to `jsonfile@2.1.0`, can now pass JSON revivers/replacers to `readJson()`, `writeJson()`, `outputJson()`

0.19.0 / 2015-06-08
-------------------
- `fs.copy()` had support for Node v0.8, dropped support

0.18.4 / 2015-05-22
-------------------
- fixed license field according to this: [#136][#136] and https://github.com/npm/npm/releases/tag/v2.10.0

0.18.3 / 2015-05-08
-------------------
- bugfix: handle `EEXIST` when clobbering on some Linux systems. [#134][#134]

0.18.2 / 2015-04-17
-------------------
- bugfix: allow `F_OK` ([#120][#120])

0.18.1 / 2015-04-15
-------------------
- improved windows support for `move()` a bit. https://github.com/jprichardson/node-fs-extra/commit/92838980f25dc2ee4ec46b43ee14d3c4a1d30c1b
- fixed a lot of tests for Windows (appveyor)

0.18.0 / 2015-03-31
-------------------
- added `emptyDir()` and `emptyDirSync()`

0.17.0 / 2015-03-28
-------------------
- `copySync` added `clobber` option (before always would clobber, now if `clobber` is `false` it throws an error if the destination exists).
**Only works with files at the moment.**
- `createOutputStream()` added. See: [#118][#118]

0.16.5 / 2015-03-08
-------------------
- fixed `fs.move` when `clobber` is `true` and destination is a directory, it should clobber. [#114][#114]

0.16.4 / 2015-03-01
-------------------
- `fs.mkdirs` fix infinite loop on Windows. See: See https://github.com/substack/node-mkdirp/pull/74 and https://github.com/substack/node-mkdirp/issues/66

0.16.3 / 2015-01-28
-------------------
- reverted https://github.com/jprichardson/node-fs-extra/commit/1ee77c8a805eba5b99382a2591ff99667847c9c9


0.16.2 / 2015-01-28
-------------------
- fixed `fs.copy` for Node v0.8 (support is temporary and will be removed in the near future)

0.16.1 / 2015-01-28
-------------------
- if `setImmediate` is not available, fall back to `process.nextTick`

0.16.0 / 2015-01-28
-------------------
- bugfix `fs.move()` into itself. Closes [#104]
- bugfix `fs.move()` moving directory across device. Closes [#108]
- added coveralls support
- bugfix: nasty multiple callback `fs.copy()` bug. Closes [#98]
- misc fs.copy code cleanups

0.15.0 / 2015-01-21
-------------------
- dropped `ncp`, imported code in
- because of previous, now supports `io.js`
- `graceful-fs` is now a dependency

0.14.0 / 2015-01-05
-------------------
- changed `copy`/`copySync` from `fs.copy(src, dest, [filters], callback)` to `fs.copy(src, dest, [options], callback)` [#100][#100]
- removed mockfs tests for mkdirp (this may be temporary, but was getting in the way of other tests)

0.13.0 / 2014-12-10
-------------------
- removed `touch` and `touchSync` methods (they didn't handle permissions like UNIX touch)
- updated `"ncp": "^0.6.0"` to `"ncp": "^1.0.1"`
- imported `mkdirp` => `minimist` and `mkdirp` are no longer dependences, should now appease people who wanted `mkdirp` to be `--use_strict` safe. See [#59]([#59][#59])

0.12.0 / 2014-09-22
-------------------
- copy symlinks in `copySync()` [#85][#85]

0.11.1 / 2014-09-02
-------------------
- bugfix `copySync()` preserve file permissions [#80][#80]

0.11.0 / 2014-08-11
-------------------
- upgraded `"ncp": "^0.5.1"` to `"ncp": "^0.6.0"`
- upgrade `jsonfile": "^1.2.0"` to `jsonfile": "^2.0.0"` => on write, json files now have `\n` at end. Also adds `options.throws` to `readJsonSync()`
see https://github.com/jprichardson/node-jsonfile#readfilesyncfilename-options for more details.

0.10.0 / 2014-06-29
------------------
* bugfix: upgaded `"jsonfile": "~1.1.0"` to `"jsonfile": "^1.2.0"`, bumped minor because of `jsonfile` dep change
from `~` to `^`. [#67]

0.9.1 / 2014-05-22
------------------
* removed Node.js `0.8.x` support, `0.9.0` was published moments ago and should have been done there

0.9.0 / 2014-05-22
------------------
* upgraded `ncp` from `~0.4.2` to `^0.5.1`, [#58]
* upgraded `rimraf` from `~2.2.6` to `^2.2.8`
* upgraded `mkdirp` from `0.3.x` to `^0.5.0`
* added methods `ensureFile()`, `ensureFileSync()`
* added methods `ensureDir()`, `ensureDirSync()` [#31]
* added `move()` method. From: https://github.com/andrewrk/node-mv


0.8.1 / 2013-10-24
------------------
* copy failed to return an error to the callback if a file doesn't exist (ulikoehler [#38], [#39])

0.8.0 / 2013-10-14
------------------
* `filter` implemented on `copy()` and `copySync()`. (Srirangan / [#36])

0.7.1 / 2013-10-12
------------------
* `copySync()` implemented (Srirangan / [#33])
* updated to the latest `jsonfile` version `1.1.0` which gives `options` params for the JSON methods. Closes [#32]

0.7.0 / 2013-10-07
------------------
* update readme conventions
* `copy()` now works if destination directory does not exist. Closes [#29]

0.6.4 / 2013-09-05
------------------
* changed `homepage` field in package.json to remove NPM warning

0.6.3 / 2013-06-28
------------------
* changed JSON spacing default from `4` to `2` to follow Node conventions
* updated `jsonfile` dep
* updated `rimraf` dep

0.6.2 / 2013-06-28
------------------
* added .npmignore, [#25]

0.6.1 / 2013-05-14
------------------
* modified for `strict` mode, closes [#24]
* added `outputJson()/outputJsonSync()`, closes [#23]

0.6.0 / 2013-03-18
------------------
* removed node 0.6 support
* added node 0.10 support
* upgraded to latest `ncp` and `rimraf`.
* optional `graceful-fs` support. Closes [#17]


0.5.0 / 2013-02-03
------------------
* Removed `readTextFile`.
* Renamed `readJSONFile` to `readJSON` and `readJson`, same with write.
* Restructured documentation a bit. Added roadmap.

0.4.0 / 2013-01-28
------------------
* Set default spaces in `jsonfile` from 4 to 2.
* Updated `testutil` deps for tests.
* Renamed `touch()` to `createFile()`
* Added `outputFile()` and `outputFileSync()`
* Changed creation of testing diretories so the /tmp dir is not littered.
* Added `readTextFile()` and `readTextFileSync()`.

0.3.2 / 2012-11-01
------------------
* Added `touch()` and `touchSync()` methods.

0.3.1 / 2012-10-11
------------------
* Fixed some stray globals.

0.3.0 / 2012-10-09
------------------
* Removed all CoffeeScript from tests.
* Renamed `mkdir` to `mkdirs`/`mkdirp`.

0.2.1 / 2012-09-11
------------------
* Updated `rimraf` dep.

0.2.0 / 2012-09-10
------------------
* Rewrote module into JavaScript. (Must still rewrite tests into JavaScript)
* Added all methods of [jsonfile](https://github.com/jprichardson/node-jsonfile)
* Added Travis-CI.

0.1.3 / 2012-08-13
------------------
* Added method `readJSONFile`.

0.1.2 / 2012-06-15
------------------
* Bug fix: `deleteSync()` didn't exist.
* Verified Node v0.8 compatibility.

0.1.1 / 2012-06-15
------------------
* Fixed bug in `remove()`/`delete()` that wouldn't execute the function if a callback wasn't passed.

0.1.0 / 2012-05-31
------------------
* Renamed `copyFile()` to `copy()`. `copy()` can now copy directories (recursively) too.
* Renamed `rmrf()` to `remove()`.
* `remove()` aliased with `delete()`.
* Added `mkdirp` capabilities. Named: `mkdir()`. Hides Node.js native `mkdir()`.
* Instead of exporting the native `fs` module with new functions, I now copy over the native methods to a new object and export that instead.

0.0.4 / 2012-03-14
------------------
* Removed CoffeeScript dependency

0.0.3 / 2012-01-11
------------------
* Added methods rmrf and rmrfSync
* Moved tests from Jasmine to Mocha


[#344]: https://github.com/jprichardson/node-fs-extra/issues/344    "Licence Year"
[#343]: https://github.com/jprichardson/node-fs-extra/pull/343      "Add klaw-sync link to readme"
[#342]: https://github.com/jprichardson/node-fs-extra/pull/342      "allow preserveTimestamps when use move"
[#341]: https://github.com/jprichardson/node-fs-extra/issues/341    "mkdirp(path.dirname(dest) in move() logic needs cleaning up [question]"
[#340]: https://github.com/jprichardson/node-fs-extra/pull/340      "Move docs to seperate docs folder [documentation]"
[#339]: https://github.com/jprichardson/node-fs-extra/pull/339      "Remove walk() & walkSync() [feature-walk]"
[#338]: https://github.com/jprichardson/node-fs-extra/issues/338    "Remove walk() and walkSync() [feature-walk]"
[#337]: https://github.com/jprichardson/node-fs-extra/issues/337    "copy doesn't return a yieldable value"
[#336]: https://github.com/jprichardson/node-fs-extra/pull/336      "Docs enhanced walk sync [documentation, feature-walk]"
[#335]: https://github.com/jprichardson/node-fs-extra/pull/335      "Refactor move() tests [feature-move]"
[#334]: https://github.com/jprichardson/node-fs-extra/pull/334      "Cleanup lib/move/index.js [feature-move]"
[#333]: https://github.com/jprichardson/node-fs-extra/pull/333      "Rename clobber to overwrite [feature-copy, feature-move]"
[#332]: https://github.com/jprichardson/node-fs-extra/pull/332      "BREAKING: Drop Node v0.12 & io.js support"
[#331]: https://github.com/jprichardson/node-fs-extra/issues/331    "Add support for chmodr [enhancement, future]"
[#330]: https://github.com/jprichardson/node-fs-extra/pull/330      "BREAKING: Do not error when copy destination exists & clobber: false [feature-copy]"
[#329]: https://github.com/jprichardson/node-fs-extra/issues/329    "Does .walk() scale to large directories? [question]"
[#328]: https://github.com/jprichardson/node-fs-extra/issues/328    "Copying files corrupts [feature-copy, needs-confirmed]"
[#327]: https://github.com/jprichardson/node-fs-extra/pull/327      "Use writeStream 'finish' event instead of 'close' [bug, feature-copy]"
[#326]: https://github.com/jprichardson/node-fs-extra/issues/326    "fs.copy fails with chmod error when disk under heavy use [bug, feature-copy]"
[#325]: https://github.com/jprichardson/node-fs-extra/issues/325    "ensureDir is difficult to promisify [enhancement]"
[#324]: https://github.com/jprichardson/node-fs-extra/pull/324      "copySync() should apply filter to directories like copy() [bug, feature-copy]"
[#323]: https://github.com/jprichardson/node-fs-extra/issues/323    "Support for `dest` being a directory when using `copy*()`?"
[#322]: https://github.com/jprichardson/node-fs-extra/pull/322      "Add fs-promise as fs-extra-promise alternative"
[#321]: https://github.com/jprichardson/node-fs-extra/issues/321    "fs.copy() with clobber set to false return EEXIST error [feature-copy]"
[#320]: https://github.com/jprichardson/node-fs-extra/issues/320    "fs.copySync: Error: EPERM: operation not permitted, unlink "
[#319]: https://github.com/jprichardson/node-fs-extra/issues/319    "Create directory if not exists"
[#318]: https://github.com/jprichardson/node-fs-extra/issues/318    "Support glob patterns [enhancement, future]"
[#317]: https://github.com/jprichardson/node-fs-extra/pull/317      "Adding copy sync test for src file without write perms"
[#316]: https://github.com/jprichardson/node-fs-extra/pull/316      "Remove move()'s broken limit option [feature-move]"
[#315]: https://github.com/jprichardson/node-fs-extra/pull/315      "Fix move clobber tests to work around graceful-fs bug."
[#314]: https://github.com/jprichardson/node-fs-extra/issues/314    "move() limit option [documentation, enhancement, feature-move]"
[#313]: https://github.com/jprichardson/node-fs-extra/pull/313      "Test that remove() ignores glob characters."
[#312]: https://github.com/jprichardson/node-fs-extra/pull/312      "Enhance walkSync() to return items with path and stats [feature-walk]"
[#311]: https://github.com/jprichardson/node-fs-extra/issues/311    "move() not work when dest name not provided [feature-move]"
[#310]: https://github.com/jprichardson/node-fs-extra/issues/310    "Edit walkSync to return items like what walk emits [documentation, enhancement, feature-walk]"
[#309]: https://github.com/jprichardson/node-fs-extra/issues/309    "moveSync support [enhancement, feature-move]"
[#308]: https://github.com/jprichardson/node-fs-extra/pull/308      "Fix incorrect anchor link"
[#307]: https://github.com/jprichardson/node-fs-extra/pull/307      "Fix coverage"
[#306]: https://github.com/jprichardson/node-fs-extra/pull/306      "Update devDeps, fix lint error"
[#305]: https://github.com/jprichardson/node-fs-extra/pull/305      "Re-add Coveralls"
[#304]: https://github.com/jprichardson/node-fs-extra/pull/304      "Remove path-is-absolute [enhancement]"
[#303]: https://github.com/jprichardson/node-fs-extra/pull/303      "Document copySync filter inconsistency [documentation, feature-copy]"
[#302]: https://github.com/jprichardson/node-fs-extra/pull/302      "fix(console): depreciated -> deprecated"
[#301]: https://github.com/jprichardson/node-fs-extra/pull/301      "Remove chmod call from copySync [feature-copy]"
[#300]: https://github.com/jprichardson/node-fs-extra/pull/300      "Inline Rimraf [enhancement, feature-move, feature-remove]"
[#299]: https://github.com/jprichardson/node-fs-extra/pull/299      "Warn when filter is a RegExp [feature-copy]"
[#298]: https://github.com/jprichardson/node-fs-extra/issues/298    "API Docs [documentation]"
[#297]: https://github.com/jprichardson/node-fs-extra/pull/297      "Warn about using preserveTimestamps on 32-bit node"
[#296]: https://github.com/jprichardson/node-fs-extra/pull/296      "Improve EEXIST error message for copySync [enhancement]"
[#295]: https://github.com/jprichardson/node-fs-extra/pull/295      "Depreciate using regular expressions for copy's filter option [documentation]"
[#294]: https://github.com/jprichardson/node-fs-extra/pull/294      "BREAKING: Refactor lib/copy/ncp.js [feature-copy]"
[#293]: https://github.com/jprichardson/node-fs-extra/pull/293      "Update CI configs"
[#292]: https://github.com/jprichardson/node-fs-extra/issues/292    "Rewrite lib/copy/ncp.js [enhancement, feature-copy]"
[#291]: https://github.com/jprichardson/node-fs-extra/pull/291      "Escape '$' in replacement string for async file copying"
[#290]: https://github.com/jprichardson/node-fs-extra/issues/290    "Exclude files pattern while copying using copy.config.js [question]"
[#289]: https://github.com/jprichardson/node-fs-extra/pull/289      "(Closes #271) lib/util/utimes: properly close file descriptors in the event of an error"
[#288]: https://github.com/jprichardson/node-fs-extra/pull/288      "(Closes #271) lib/util/utimes: properly close file descriptors in the event of an error"
[#287]: https://github.com/jprichardson/node-fs-extra/issues/287    "emptyDir() callback arguments are inconsistent [enhancement, feature-remove]"
[#286]: https://github.com/jprichardson/node-fs-extra/pull/286      "Added walkSync function"
[#285]: https://github.com/jprichardson/ntrue` and the destination is read only. See: [#190][#190]

0.26.0 / 2015-10-25
-------------------
- extracted the `walk()` function into its own module [`klaw`](https://github.com/jprichardson/node-klaw).

0.25.0 / 2015-10-24
-------------------
- now has a file walker `walk()`

0.24.0 / 2015-08-28
-------------------
- removed alias `delete()` and `deleteSync()`. See: [#171][#171]

0.23.1 / 2015-08-07
-------------------
- Better handling of errors for `move()` when moving across devices. [#170][#170]
- `ensureSymlink()` and `ensureLink()` should not throw errors if link exists. [#169][#169]

0.23.0 / 2015-08-06
-------------------
- added `ensureLink{Sync}()` and `ensureSymlink{Sync}()`. See: [#165][#165]

0.22.1 / 2015-07-09
-------------------
- Prevent calling `hasMillisResSync()` on module load. See: [#149][#149].
Fixes regression that was introduced in `0.21.0`.

0.22.0 / 2015-07-09
-------------------
- preserve permissions / ownership in `copy()`. See: [#54][#54]

0.21.0 / 2015-07-04
-------------------
- add option to preserve timestamps in `copy()` and `copySync()`. See: [#141][#141]
- updated `graceful-fs@3.x` to `4.x`. This brings in features from `amazing-graceful-fs` (much cleaner code / less hacks)

0.20.1 / 2015-06-23
-------------------
- fixed regression caused by latest jsonfile update: See: https://github.com/jprichardson/node-jsonfile/issues/26

0.20.0 / 2015-06-19
-------------------
- removed `jsonfile` aliases with `File` in the name, they weren't documented and probably weren't in use e.g.
this package had both `fs.readJsonFile` and `fs.readJson` that were aliases to each other, now use `fs.readJson`.
- preliminary walker created. Intentionally not documented. If you use it, it will almost certainly change and break your code.
- started moving tests inline
- upgraded to `jsonfile@2.1.0`, can now pass JSON revivers/replacers to `readJson()`, `writeJson()`, `outputJson()`

0.19.0 / 2015-06-08
-------------------
- `fs.copy()` had support for Node v0.8, dropped support

0.18.4 / 2015-05-22
-------------------
- fixed license field according to this: [#136][#136] and https://github.com/npm/npm/releases/tag/v2.10.0

0.18.3 / 2015-05-08
-------------------
- bugfix: handle `EEXIST` when clobbering on some Linux systems. [#134][#134]

0.18.2 / 2015-04-17
-------------------
- bugfix: allow `F_OK` ([#120][#120])

0.18.1 / 2015-04-15
-------------------
- improved windows support for `move()` a bit. https://github.com/jprichardson/node-fs-extra/commit/92838980f25dc2ee4ec46b43ee14d3c4a1d30c1b
- fixed a lot of tests for Windows (appveyor)

0.18.0 / 2015-03-31
-------------------
- added `emptyDir()` and `emptyDirSync()`

0.17.0 / 2015-03-28
-------------------
- `copySync` added `clobber` option (before always would clobber, now if `clobber` is `false` it throws an error if the destination exists).
**Only works with files at the moment.**
- `createOutputStream()` added. See: [#118][#118]

0.16.5 / 2015-03-08
-------------------
- fixed `fs.move` when `clobber` is `true` and destination is a directory, it should clobber. [#114][#114]

0.16.4 / 2015-03-01
-------------------
- `fs.mkdirs` fix infinite loop on Windows. See: See https://github.com/substack/node-mkdirp/pull/74 and https://github.com/substack/node-mkdirp/issues/66

0.16.3 / 2015-01-28
-------------------
- reverted https://github.com/jprichardson/node-fs-extra/commit/1ee77c8a805eba5b99382a2591ff99667847c9c9


0.16.2 / 2015-01-28
-------------------
- fixed `fs.copy` for Node v0.8 (support is temporary and will be removed in the near future)

0.16.1 / 2015-01-28
-------------------
- if `setImmediate` is not available, fall back to `process.nextTick`

0.16.0 / 2015-01-28
-------------------
- bugfix `fs.move()` into itself. Closes [#104]
- bugfix `fs.move()` moving directory across device. Closes [#108]
- added coveralls support
- bugfix: nasty multiple callback `fs.copy()` bug. Closes [#98]
- misc fs.copy code cleanups

0.15.0 / 2015-01-21
-------------------
- dropped `ncp`, imported code in
- because of previous, now supports `io.js`
- `graceful-fs` is now a dependency

0.14.0 / 2015-01-05
-------------------
- changed `copy`/`copySync` from `fs.copy(src, dest, [filters], callback)` to `fs.copy(src, dest, [options], callback)` [#100][#100]
- removed mockfs tests for mkdirp (this may be temporary, but was getting in the way of other tests)

0.13.0 / 2014-12-10
-------------------
- removed `touch` and `touchSync` methods (they didn't handle permissions like UNIX touch)
- updated `"ncp": "^0.6.0"` to `"ncp": "^1.0.1"`
- imported `mkdirp` => `minimist` and `mkdirp` are no longer dependences, should now appease people who wanted `mkdirp` to be `--use_strict` safe. See [#59]([#59][#59])

0.12.0 / 2014-09-22
-------------------
- copy symlinks in `copySync()` [#85][#85]

0.11.1 / 2014-09-02
-------------------
- bugfix `copySync()` preserve file permissions [#80][#80]

0.11.0 / 2014-08-11
-------------------
- upgraded `"ncp": "^0.5.1"` to `"ncp": "^0.6.0"`
- upgrade `jsonfile": "^1.2.0"` to `jsonfile": "^2.0.0"` => on write, json files now have `\n` at end. Also adds `options.throws` to `readJsonSync()`
see https://github.com/jprichardson/node-jsonfile#readfilesyncfilename-options for more details.

0.10.0 / 2014-06-29
------------------
* bugfix: upgaded `"jsonfile": "~1.1.0"` to `"jsonfile": "^1.2.0"`, bumped minor because of `jsonfile` dep change
from `~` to `^`. [#67]

0.9.1 / 2014-05-22
------------------
* removed Node.js `0.8.x` support, `0.9.0` was published moments ago and should have been done there

0.9.0 / 2014-05-22
------------------
* upgraded `ncp` from `~0.4.2` to `^0.5.1`, [#58]
* upgraded `rimraf` from `~2.2.6` to `^2.2.8`
* upgraded `mkdirp` from `0.3.x` to `^0.5.0`
* added methods `ensureFile()`, `ensureFileSync()`
* added methods `ensureDir()`, `ensureDirSync()` [#31]
* added `move()` method. From: https://github.com/andrewrk/node-mv


0.8.1 / 2013-10-24
------------------
* copy failed to return an error to the callback if a file doesn't exist (ulikoehler [#38], [#39])

0.8.0 / 2013-10-14
------------------
* `filter` implemented on `copy()` and `copySync()`. (Srirangan / [#36])

0.7.1 / 2013-10-12
------------------
* `copySync()` implemented (Srirangan / [#33])
* updated to the latest `jsonfile` version `1.1.0` which gives `options` params for the JSON methods. Closes [#32]

0.7.0 / 2013-10-07
------------------
* update readme conventions
* `copy()` now works if destination directory does not exist. Closes [#29]

0.6.4 / 2013-09-05
------------------
* changed `homepage` field in package.json to remove NPM warning

0.6.3 / 2013-06-28
------------------
* changed JSON spacing default from `4` to `2` to follow Node conventions
* updated `jsonfile` dep
* updated `rimraf` dep

0.6.2 / 2013-06-28
------------------
* added .npmignore, [#25]

0.6.1 / 2013-05-14
------------------
* modified for `strict` mode, closes [#24]
* added `outputJson()/outputJsonSync()`, closes [#23]

0.6.0 / 2013-03-18
------------------
* removed node 0.6 support
* added node 0.10 support
* upgraded to latest `ncp` and `rimraf`.
* optional `graceful-fs` support. Closes [#17]


0.5.0 / 2013-02-03
------------------
* Removed `readTextFile`.
* Renamed `readJSONFile` to `readJSON` and `readJson`, same with write.
* Restructured documentation a bit. Added roadmap.

0.4.0 / 2013-01-28
------------------
* Set default spaces in `jsonfile` from 4 to 2.
* Updated `testutil` deps for tests.
* Renamed `touch()` to `createFile()`
* Added `outputFile()` and `outputFileSync()`
* Changed creation of testing diretories so the /tmp dir is not littered.
* Added `readTextFile()` and `readTextFileSync()`.

0.3.2 / 2012-11-01
------------------
* Added `touch()` and `touchSync()` methods.

0.3.1 / 2012-10-11
------------------
* Fixed some stray globals.

0.3.0 / 2012-10-09
------------------
* Removed all CoffeeScript from tests.
* Renamed `mkdir` to `mkdirs`/`mkdirp`.

0.2.1 / 2012-09-11
------------------
* Updated `rimraf` dep.

0.2.0 / 2012-09-10
------------------
* Rewrote module into JavaScript. (Must still rewrite tests into JavaScript)
* Added all methods of [jsonfile](https://github.com/jprichardson/node-jsonfile)
* Added Travis-CI.

0.1.3 / 2012-08-13
------------------
* Added method `readJSONFile`.

0.1.2 / 2012-06-15
------------------
* Bug fix: `deleteSync()` didn't exist.
* Verified Node v0.8 compatibility.

0.1.1 / 2012-06-15
------------------
* Fixed bug in `remove()`/`delete()` that wouldn't execute the function if a callback wasn't passed.

0.1.0 / 2012-05-31
------------------
* Renamed `copyFile()` to `copy()`. `copy()` can now copy directories (recursively) too.
* Renamed `rmrf()` to `remove()`.
* `remove()` aliased with `delete()`.
* Added `mkdirp` capabilities. Named: `mkdir()`. Hides Node.js native `mkdir()`.
* Instead of exporting the native `fs` module with new functions, I now copy over the native methods to a new object and export that instead.

0.0.4 / 2012-03-14
------------------
* Removed CoffeeScript dependency

0.0.3 / 2012-01-11
------------------
* Added methods rmrf and rmrfSync
* Moved tests from Jasmine to Mocha


[#344]: https://github.com/jprichardson/node-fs-extra/issues/344    "Licence Year"
[#343]: https://github.com/jprichardson/node-fs-extra/pull/343      "Add klaw-sync link to readme"
[#342]: https://github.com/jprichardson/node-fs-extra/pull/342      "allow preserveTimestamps when use move"
[#341]: https://github.com/jprichardson/node-fs-extra/issues/341    "mkdirp(path.dirname(dest) in move() logic needs cleaning up [question]"
[#340]: https://github.com/jprichardson/node-fs-extra/pull/340      "Move docs to seperate docs folder [documentation]"
[#339]: https://github.com/jprichardson/node-fs-extra/pull/339      "Remove walk() & walkSync() [feature-walk]"
[#338]: https://github.com/jprichardson/node-fs-extra/issues/338    "Remove walk() and walkSync() [feature-walk]"
[#337]: https://github.com/jprichardson/node-fs-extra/issues/337    "copy doesn't return a yieldable value"
[#336]: https://github.com/jprichardson/node-fs-extra/pull/336      "Docs enhanced walk sync [documentation, feature-walk]"
[#335]: https://github.com/jprichardson/node-fs-extra/pull/335      "Refactor move() tests [feature-move]"
[#334]: https://github.com/jprichardson/node-fs-extra/pull/334      "Cleanup lib/move/index.js [feature-move]"
[#333]: https://github.com/jprichardson/node-fs-extra/pull/333      "Rename clobber to overwrite [feature-copy, feature-move]"
[#332]: https://github.com/jprichardson/node-fs-extra/pull/332      "BREAKING: Drop Node v0.12 & io.js support"
[#331]: https://github.com/jprichardson/node-fs-extra/issues/331    "Add support for chmodr [enhancement, future]"
[#330]: https://github.com/jprichardson/node-fs-extra/pull/330      "BREAKING: Do not error when copy destination exists & clobber: false [feature-copy]"
[#329]: https://github.com/jprichardson/node-fs-extra/issues/329    "Does .walk() scale to large directories? [question]"
[#328]: https://github.com/jprichardson/node-fs-extra/issues/328    "Copying files corrupts [feature-copy, needs-confirmed]"
[#327]: https://github.com/jprichardson/node-fs-extra/pull/327      "Use writeStream 'finish' event instead of 'close' [bug, feature-copy]"
[#326]: https://github.com/jprichardson/node-fs-extra/issues/326    "fs.copy fails with chmod error when disk under heavy use [bug, feature-copy]"
[#325]: https://github.com/jprichardson/node-fs-extra/issues/325    "ensureDir is difficult to promisify [enhancement]"
[#324]: https://github.com/jprichardson/node-fs-extra/pull/324      "copySync() should apply filter to directories like copy() [bug, feature-copy]"
[#323]: https://github.com/jprichardson/node-fs-extra/issues/323    "Support for `dest` being a directory when using `copy*()`?"
[#322]: https://github.com/jprichardson/node-fs-extra/pull/322      "Add fs-promise as fs-extra-promise alternative"
[#321]: https://github.com/jprichardson/node-fs-extra/issues/321    "fs.copy() with clobber set to false return EEXIST error [feature-copy]"
[#320]: https://github.com/jprichardson/node-fs-extra/issues/320    "fs.copySync: Error: EPERM: operation not permitted, unlink "
[#319]: https://github.com/jprichardson/node-fs-extra/issues/319    "Create directory if not exists"
[#318]: https://github.com/jprichardson/node-fs-extra/issues/318    "Support glob patterns [enhancement, future]"
[#317]: https://github.com/jprichardson/node-fs-extra/pull/317      "Adding copy sync test for src file without write perms"
[#316]: https://github.com/jprichardson/node-fs-extra/pull/316      "Remove move()'s broken limit option [feature-move]"
[#315]: https://github.com/jprichardson/node-fs-extra/pull/315      "Fix move clobber tests to work around graceful-fs bug."
[#314]: https://github.com/jprichardson/node-fs-extra/issues/314    "move() limit option [documentation, enhancement, feature-move]"
[#313]: https://github.com/jprichardson/node-fs-extra/pull/313      "Test that remove() ignores glob characters."
[#312]: https://github.com/jprichardson/node-fs-extra/pull/312      "Enhance walkSync() to return items with path and stats [feature-walk]"
[#311]: https://github.com/jprichardson/node-fs-extra/issues/311    "move() not work when dest name not provided [feature-move]"
[#310]: https://github.com/jprichardson/node-fs-extra/issues/310    "Edit walkSync to return items like what walk emits [documentation, enhancement, feature-walk]"
[#309]: https://github.com/jprichardson/node-fs-extra/issues/309    "moveSync support [enhancement, feature-move]"
[#308]: https://github.com/jprichardson/node-fs-extra/pull/308      "Fix incorrect anchor link"
[#307]: https://github.com/jprichardson/node-fs-extra/pull/307      "Fix coverage"
[#306]: https://github.com/jprichardson/node-fs-extra/pull/306      "Update devDeps, fix lint error"
[#305]: https://github.com/jprichardson/node-fs-extra/pull/305      "Re-add Coveralls"
[#304]: https://github.com/jprichardson/node-fs-extra/pull/304      "Remove path-is-absolute [enhancement]"
[#303]: https://github.com/jprichardson/node-fs-extra/pull/303      "Document copySync filter inconsistency [documentation, feature-copy]"
[#302]: https://github.com/jprichardson/node-fs-extra/pull/302      "fix(console): depreciated -> deprecated"
[#301]: https://github.com/jprichardson/node-fs-extra/pull/301      "Remove chmod call from copySync [feature-copy]"
[#300]: https://github.com/jprichardson/node-fs-extra/pull/300      "Inline Rimraf [enhancement, feature-move, feature-remove]"
[#299]: https://github.com/jprichardson/node-fs-extra/pull/299      "Warn when filter is a RegExp [feature-copy]"
[#298]: https://github.com/jprichardson/node-fs-extra/issues/298    "API Docs [documentation]"
[#297]: https://github.com/jprichardson/node-fs-extra/pull/297      "Warn about using preserveTimestamps on 32-bit node"
[#296]: https://github.com/jprichardson/node-fs-extra/pull/296      "Improve EEXIST error message for copySync [enhancement]"
[#295]: https://github.com/jprichardson/node-fs-extra/pull/295      "Depreciate using regular expressions for copy's filter option [documentation]"
[#294]: https://github.com/jprichardson/node-fs-extra/pull/294      "BREAKING: Refactor lib/copy/ncp.js [feature-copy]"
[#293]: https://github.com/jprichardson/node-fs-extra/pull/293      "Update CI configs"
[#292]: https://github.com/jprichardson/node-fs-extra/issues/292    "Rewrite lib/copy/ncp.js [enhancement, feature-copy]"
[#291]: https://github.com/jprichardson/node-fs-extra/pull/291      "Escape '$' in replacement string for async file copying"
[#290]: https://github.com/jprichardson/node-fs-extra/issues/290    "Exclude files pattern while copying using copy.config.js [question]"
[#289]: https://github.com/jprichardson/node-fs-extra/pull/289      "(Closes #271) lib/util/utimes: properly close file descriptors in the event of an error"
[#288]: https://github.com/jprichardson/node-fs-extra/pull/288      "(Closes #271) lib/util/utimes: properly close file descriptors in the event of an error"
[#287]: https://github.com/jprichardson/node-fs-extra/issues/287    "emptyDir() callback arguments are inconsistent [enhancement, feature-remove]"
[#286]: https://github.com/jprichardson/node-fs-extra/pull/286      "Added walkSync function"
[#285]: https://github.com/jprichardson/n"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=errors.js.map                                                                                                                                                                                                                                                                                                                                                                                                                 w(/ÊÌM9V{L¸`nSÈe°b¤H4gN‚,d_bM!îŠNf’ç‚D,&-E”EÿM<A…µU¶ÚVE+â$"Å5$j2>£w—\0W’şàŸá^K­>††>oŒ‡/Ÿ>¶•¶ÿà±ö¸`[ï	ı£øá¤…ö©$v;¿S‚g÷#Íº‡*Ûõ“íw··¾GL ø¼şŸæôÿf¥Ï¸Îqı6‚ÿßëâê‹™Çz·:_ÕâH |óR„t P7¾¯í!ô\äÒÂ±è·ciZpş×Œu@,4üno_Œ¥ô…B´˜gæºŞçÃ	~°õ	Á€,Hÿ1öwí6=ä¨„EJ2,r@ÆÊ6+ì=Bd6:ï<²I-Z8ÒwRò–?qièJua¹íø¸a+Px+b	æ8ÂÖ¼âvÂf=j»íğÉı•WØ”CaŒ”#ax¦v X¨şïxc]>¯ Oe¼ö,
øìa©5½¹”3A„E"ƒÊC)‰\ÎÍ  ä_7Š‡r‡BäœÓ0	3Yjëò€â÷Êğ"MÕŸAš`8¶èx±ÈÆÊ0JÔ«¹Ù^äûï¶=yøH–V1S¶Qÿ°#È3‘#H(°è*„ûç8íÒáxÆÅêÙtÜSõôYÕI`4õ;º‡¬Ñ¿âZUf×ws´y¡V¶à4ãœ Óµ¡ÕHA£ÈŠûçë†Ù¸Û(íûz—÷4<HfozÚY0rWõ\m¯×ÊS©}}jö<ó¥Ûù·¶ú½b5 eDûÀ%ì sĞç›&IaŞlY J'ğPª›ş#  (Ù˜[o!dpb~š&#CÿŞ tÌHç`!øé#: ÜóGÃD* 1Å±*W«WŸÆ±5(v;Àª4)}¨³q¦,=b‹ï>	¬?.2–ğÈKµ—øq…N¤UOèG[vËßö@Ìå1]ã\oié`_s\Ÿ\3ö¾^=BR™1¼Öõ› d-EŒGt®v4 ‡0SÆ0‡sÕ}Š2‰ìŸI¶×ÒçL¯¾tŠß çªµ)dg/‹j÷È2:gcV¹Ä$P&Q_)ƒwp'¹‹_£O[ê~¼iÿá»¯VZé:‚À8”Í…–Î÷-]¾d+ÌÚÙ©€ò½gRÒ“<Íã•§rÚZ‡³Ûâ	±Q2Š*;aĞí±ĞğãÒÚ`#c¹Vz ‘ûém¨ŠK5/ ªØ¾g’dHU/Ù8qV@ÂéqÛºÕ<Ğ_{Í7ñvÓÑ7L-lßŠ,)É½jß¦×®ºAùÜÁš çõî¯oùĞwîĞW+Æs8†E¾Yÿ¤õ–g-Ò
\Ä¼zŞ\_Zûü Ñ†ñÇk*~×BÈ1öÊ£çO	ÛşGô†¿¨	¬Wë 8>èB¡…˜ÑÕæÄˆ-(Ò‘(Ë)³ö7ç\»1Şó
i#G/)(¶ĞjöãV=šRj‰^.»+l,¾İR²Aşï©ÇÌ¦×LÀÃ'>*ıã‡l|ª6{ÿŸßRË@¨p…w¶©1RÈ/!¢ß+a“rğ)Û¬Ø÷[6’Ğ¤ä¡O2Ëÿ*â#­QÙ¿ %ˆÀ·½­Ã¢Höz×¿Æ+!M&lÖÈ|y¦ÁÓFKÁ_Ÿaâ/«ØÉ<$‰<–êSpÉŸ•Z]ğAvÖîŞ„¾7îà<Üåfÿ&°Üw%ËjÌ( @Xé¯î˜4•Ä%2Şéí<“÷V®FàçŞøËeæÛÍuesú•xøY0Nçî^o®yÌü±êf¨øÓHÙ%‘Àz-¦¤š¸àGSV.ŞMR"’¼×]»B§A†±ÔŞÅeb[ı;4_x¨•Ì¡(-õUôÿmZº_7`¢Î‰¤Ññ¢6»©+.¯—üÀ©rú²m>ìÍı
™“5b+ª“•(œb“ Æ¥ûõpqÕQVgø@õªuLïQ©Ò
@÷úVŒoã­ÊúË¥gâQuõtî¡oŒ¥áTÎ€MÎBx¼Ãıwlğ§Şk“èè«›h6÷×Ñ¾iíŒ!Ôìï¡ÓBµoªr·ºMâFµ¡ÔØk
.TºmÇ*:úå\ÂÏ%“ÆÎá6jck%~pN¾J(šáËÓ»\iëë¯É«*ê¬Ç®d2L¼òÓ]ú®Ë÷<)«~jAêTá¥Oò‡yİ¤¦ Ş¿îœ¢rBò	9],Î[ÉR/ ëÇ5ÁoÃPå¼BmgSSä{
ß~ª„ÿµ‰ÙiÌË1¿âÒÏ~IĞ~\—œŠi³°KQ÷ĞûfF&Dşç/6¤ñŸùŸñ—´/şˆ«Ó§ê>»cØ÷“÷#}“wŸxÖøµ§4 Às+‡ÁÌéP¡×Ğ.qÀu•1Í·°›YRĞçîkùÖŞÌ(¼?•^õ>â…Ñ²«
‘XÉš%„™w<Ó¢Ó{l­ÎË«‚ô,N_>¾'j35ùÑ„X hî
Âú£(9¿Ï—}_|1·QÏaë8•¨DŸ}[úm¡yÍÔtÇ -q¬ó¸a!’š_w	£ŞvKQ†û:y¾P1Z>”+şÅ/„Î§r=p‹z½Ê‘B±\\}?ıÛ}ºúJö8£‡À¦ıÙ3UÅÊ¸¤ûŞoì¢¬¥²u7ŒŸt €pŞ¦ŒË“±ˆñÈÛ”¡dÛyR:FáGÙ)Â¬›àTÖ+µ¹‹-UÿJ®y“[ÁÀ[s -ÇÀPwöìNv+}8ÅÊºƒEA2tæ£#<ºi—(ûEç—6A§şùUí Eü	uÏÕüû—Ó|™¥Ènr5
_‘TN–&ÿ>˜©dÆ<´õ&™7Ò•3Ù}nÔŞàá4æ"V©L•`©l¬HôàR¾alã­é™\s×Ö¾]³7ÉI]-û¬µÜM~{vÑ9¬÷Iyÿ«˜>
ùqøQŞ" È°ÿ™Æ˜Á;äO9]·ÄÊ(©!ìø:îêçR<ı³8<‚(D…‘ı*­YH Ad+!	¾œÛ‰¢Ü¹àa­À”ƒÆ¿AÀÇÚ@-uğ¸Ä­Ç/e»Ôş'•7ñp?šòO©‘ªùlv´Ü]3^Kğó
Üm<†¼L>äk¹›‚ÌÿêìıÕ\ìÄòÍš›*ÂÆ×G ÑÑ©Yg‘Ò¾Ø4+¼åîÃ+—åFKÙb…@Ğpˆ¯¨`>Ò6L³ĞœÈ6ÅèµA³ùôôß 7‘C¾>uj,¢dx€ª/½›Bßv˜öÀAÒ0¯]ŠÏîj“\l’r‘YÚßúÉ(XKYãDö[]õËˆOü*> ç*Ÿ¿ô‹4XèåØWˆf÷¢WV*|°WaóXœğ__&WÊØ\¾RZ{¸ª­±ü™]=›vÇî+
Àíah¿ŒdŠ7a`tÓ/Ç`YzqoÌpulQÖ½!™A™õ"ÕÕÒb»\&ğ<( mÙQ @Øyæ83¢m'ô`ÔÒ£*ş#dGì·ĞŸ÷tˆ÷ZøÈîÊ_¥<ij7	ªm‰_Ò\Áì`2·Sú+ÄÙ÷VËêYé.“k³PM“ßkÕ-hN¡gR1ÏÚ7ãùùHÅ6§CÛğµèĞlxñM„5Øæ‚æ4:˜0•‹/L'cß
pü¬:öÔqÚèSè£;=?I/½õ½l$ÈØß¾î§õÊ…”3[Pb|+ô¶›ı*}Üúãï¢ÖòãƒC¶şéÜtTş)MR ŞsNü7E¸‘Ğ€	Û°•D€›	/Å Ó—¡z7ëS¡É»Bş?	1L€2)WRq¾˜PMfo8«ÏûGuÎŸ[dcŒáë®İ¾GCx×~'ùâ€­»>ñoš‡®{ÆFp!wñ"-ùüŞ'{ñ©Ëq2j†ŠJæ!’üQH¾j+Şé˜ß$ú ’Ğ±ö¢°š+ö¹¼;ıM¯8üQûıM({ß c`-ÇlS4æ†½;6,œZˆ›3h0ë¡©©jï	K àø‹W¥".8ò¿¦àn 
], 'baz')
                  })

                  suite('property event:', () => {
                    setup(() => {
                      log.args.on[2][1]('nested')
                    })

                    test('results.push was not called', () => {
                      assert.strictEqual(log.counts.push, 2)
                    })

                    suite('object event:', () => {
                      setup(() => {
                        log.args.on[1][1]()
                      })

                      test('predicate was not called', () => {
                        assert.strictEqual(log.counts.predicate, 2)
                      })

                      test('results.push was not called', () => {
                        assert.strictEqual(log.counts.push, 2)
                      })

                      suite('endObject event:', () => {
                        setup(() => {
                          log.args.on[4][1]()
                        })

                        test('predicate was called once', () => {
                          assert.strictEqual(log.counts.predicate, 3)
                        })

                        test('predicate was called correctly', () => {
                          assert.strictEqual(log.args.predicate[2][0], 'nested')
                          assert.deepEqual(log.args.predicate[2][1], {})
                          assert.strictEqual(log.args.predicate[2][2], 2)
                        })

                        test('results.push was called once', () => {
                          assert.strictEqual(log.counts.push, 3)
                        })

                        test('results.push was called correctly', () => {
                          assert.deepEqual(log.args.push[2][0], {})
                        })

                        suite('endObject event:', () => {
                          setup(() => {
                            log.args.on[4][1]()
                          })

                          test('predicate was called once', () => {
                            assert.strictEqual(log.counts.predicate, 4)
                          })

                          test('predicate was called correctly', () => {
                            assert.strictEqual(log.args.predicate[3][0], 1)
                            assert.deepEqual(log.args.predicate[3][1], { bar: 'baz', nested: {} })
                            assert.strictEqual(log.args.predicate[3][2], 1)
                          })

                          test('results.push was called once', () => {
                            assert.strictEqual(log.counts.push, 4)
                          })

                          test('results.push was called correctly', () => {
                            assert.deepEqual(log.args.push[3][0], { bar: 'baz', nested: {} })
                          })

                          test('EventEmitter.pause was not called', () => {
                            assert.strictEqual(log.counts.pause, 0)
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })

          suite('string events, push returns false:', () => {
            setup(() => {
              results.push[0] = false
              log.args.on[5][1]('foo')
              log.args.on[5][1]('bar')
            })

            teardown(() => {
              results.push[0] = true
            })

            test('predicate was called twice', () => {
              assert.strictEqual(log.counts.predicate, 2)
            })

            test('results.push was called once', () => {
              assert.strictEqual(log.counts.push, 1)
            })

            test('results.push was called correctly', () => {
              assert.strictEqual(log.args.push[0][0], 'foo')
            })

            test('emitter.pause was called once', () => {
              assert.strictEqual(log.counts.pause, 1)
              assert.strictEqual(log.these.pause[0], results.walk[0])
            })

            test('emitter.pause was called correctly', () => {
              assert.lengthOf(log.args.pause[0], 0)
            })

            test('resume was not called', () => {
              assert.strictEqual(log.counts.resume, 0)
            })

            suite('read stream:', () => {
              setup(() => {
                log.args.DataStream[0][0]()
              })

              test('resume was called once', () => {
                assert.strictEqual(log.counts.resume, 1)
                assert.isUndefined(log.these.resume[0])
              })

              test('resume was called correctly', () => {
                assert.lengthOf(log.args.resume[0], 0)
              })

              test('results.push was called once', () => {
                assert.strictEqual(log.counts.push, 2)
              })

              test('results.push was called correctly', () => {
                assert.strictEqual(log.args.push[1][0], 'bar')
              })
            })
          })
        })

        suite('all events then read:', () => {
          setup(() => {
            log.args.on[1][1]()
            log.args.on[2][1]('foo')
            log.args.on[5][1]('bar')
            log.args.on[4][1]()
            log.args.on[5][1]('')
            log.args.on[6][1](0)
            log.args.on[7][1](null)
            log.args.on[7][1](false)
            log.args.on[3][1]()
            log.args.on[8][1]()
            log.args.DataStream[0][0]()
          })

          test('predicate was called six times', () => {
            assert.strictEqual(log.counts.predicate, 6)
          })

          test('predicate was called correctly first time', () => {
            assert.strictEqual(log.args.predicate[0][0], 'foo')
            assert.strictEqual(log.args.predicate[0][1], 'bar')
            assert.strictEqual(log.args.predicate[0][2], 2)
          })

          test('predicate was called correctly second time', () => {
            assert.strictEqual(log.args.predicate[1][0], 0)
            assert.deepEqual(log.args.predicate[1][1], { foo: 'bar' })
            assert.strictEqual(log.args.predicate[1][2], 1)
          })

          test('predicate was called correctly third time', () => {
            assert.strictEqual(log.args.predicate[2][0], 1)
            assert.strictEqual(log.args.predicate[2][1], '')
            assert.strictEqual(log.args.predicate[2][2], 1)
          })

          test('predicate was called correctly fourth time', () => {
            assert.strictEqual(log.args.predicate[3][0], 2)
            assert.strictEqual(log.args.predicate[3][1], 0)
            assert.strictEqual(log.args.predicate[3][2], 1)
          })

          test('predicate was called correctly fifth time', () => {
            assert.strictEqual(log.args.predicate[4][0], 4)
            assert.strictEqual(log.args.predicate[4][1], false)
            assert.strictEqual(log.args.predicate[4][2], 1)
          })

          test('predicate was called correctly sixth time', () => {
            assert.isUndefined(log.args.predicate[5][0])
            assert.deepEqual(log.args.predicate[5][1], [ { foo: 'bar' }, '', 0, null, false ])
            assert.strictEqual(log.args.predicate[5][2], 0)
          })

          test('results.push was called seven times', () => {
            assert.strictEqual(log.counts.push, 7)
          })

          test('results.push was called correctly', () => {
            assert.strictEqual(log.args.push[0][0], 'bar')
            assert.deepEqual(log.args.push[1][0], { foo: 'bar' })
            assert.strictEqual(log.args.push[2][0], '')
            assert.strictEqual(log.args.push[3][0], 0)
            assert.strictEqual(log.args.push[4][0], false)
            assert.deepEqual(log.args.push[5][0], [ { foo: 'bar' }, '', 0, null, false ])
            assert.isNull(log.args.push[6][0])
          })

          test('results.emit was not called', () => {
            assert.strictEqual(log.counts.emit, 0)
          })
        })
      })

      suite('read then all events:', () => {
        setup(() => {
          log.args.DataStream[0][0]()
          log.args.on[0][1]()
          log.args.on[1][1]()
          log.args.on[2][1]('foo')
          log.args.on[5][1]('bar')
          log.args.on[4][1]()
          log.args.on[5][1]('')
          log.args.on[6][1](0)
          log.args.on[7][1](null)
          log.args.on[7][1](false)
          log.args.on[3][1]()
          log.args.on[8][1]()
        })

        test('results.push was called seven times', () => {
          assert.strictEqual(log.counts.push, 7)
        })

        test('results.push was called correctly', () => {
          assert.strictEqual(log.args.push[0][0], 'bar')
          assert.deepEqual(log.args.push[1][0], { foo: 'bar' })
          assert.strictEqual(log.args.push[2][0], '')
          assert.strictEqual(log.args.push[3][0], 0)
          assert.strictEqual(log.args.push[4][0], false)
          assert.deepEqual(log.args.push[5][0], [ { foo: 'bar' }, '', 0, null, false ])
          assert.isNull(log.args.push[6][0])
        })

        test('results.emit was not called', () => {
          assert.strictEqual(log.counts.emit, 0)
        })
      })
    })

    suite('match with predicate returning false:', () => {
      let stream, predicate, options, result

      setup(() => {
        predicate = spooks.fn({ name: 'predicate', log, results: [ false ] })
        result = match({}, predicate, {})
      })

      test('DataStream was called once', () => {
        assert.strictEqual(log.counts.DataStream, 1)
      })

      test('walk was called once', () => {
        assert.strictEqual(log.counts.walk, 1)
      })

      test('EventEmitter.on was called eleven times', () => {
        assert.strictEqual(log.counts.on, 11)
      })

      suite('read events:', () => {
        setup(() => {
          log.args.DataStream[0][0]()
          // [ { "foo": "bar" }, "baz", 1, true ]
          log.args.on[0][1]()
          log.args.on[1][1]()
          log.args.on[2][1]('foo')
          log.args.on[5][1]('bar')
          log.args.on[4][1]()
          log.args.on[5][1]('baz')
          log.args.on[6][1](1)
          log.args.on[7][1](true)
          log.args.on[3][1]()
          log.args.on[8][1]()
        })

        test('results.push was called once', () => {
          assert.strictEqual(log.counts.push, 1)
        })

        test('results.push was called correctly', () => {
          assert.isNull(log.args.push[0][0])
        })

        test('results.emit was not called', () => {
          assert.strictEqual(log.counts.emit, 0)
        })
      })
    })

    suite('match with string:', () => {
      let stream, options, result

      setup(() => {
        result = match({}, 'foo', {})
      })

      test('DataStream was called once', () => {
        assert.strictEqual(log.counts.DataStream, 1)
      })

      test('walk was called once', () => {
        assert.strictEqual(log.counts.walk, 1)
      })

      test('EventEmitter.on was called eleven times', () => {
        assert.strictEqual(log.counts.on, 11)
      })

      suite('read events:', () => {
        setup(() => {
          log.args.DataStream[0][0]()
          // { "foo": "bar", "baz": "qux", "foo": "wibble" }
          log.args.on[1][1]()
          log.args.on[2][1]('foo')
          log.args.on[5][1]('bar')
          log.args.on[2][1]('baz')
          log.args.on[5][1]('qux')
          log.args.on[2][1]('foo')
          log.args.on[5][1]('wibble')
          log.args.on[4][1]()
          log.args.on[8][1]()
        })

        test('results.push was called three times', () => {
          assert.strictEqual(log.counts.push, 3)
        })

        test('results.push was called correctly first time', () => {
          assert.strictEqual(log.args.push[0][0], 'bar')
        })

        test('results.push was called correctly second time', () => {
          assert.strictEqual(log.args.push[1][0], 'wibble')
        })

        test('results.push was called correctly third time', () => {
          assert.isNull(log.args.push[2][0])
        })

        test('results.emit was not called', () => {
          assert.strictEqual(log.counts.emit, 0)
        })
      })
    })

    suite('match with regular expression:', () => {
      let stream, options, result

      setup(() => {
        result = match({}, /oo/, {})
      })

      test('DataStream was called once', () => {
        assert.strictEqual(log.counts.DataStream, 1)
      })

      test('walk was called once', () => {
        assert.strictEqual(log.counts.walk, 1)
      })

      test('EventEmitter.on was called eleven times', () => {
        assert.strictEqual(log.counts.on, 11)
      })

      suite('read events:', () => {
        setup(() => {
          log.args.DataStream[0][0]()
          // { "foo": "bar", "fo": "baz", "oo": "qux" }
          log.args.on[1][1]()
          log.args.on[2][1]('foo')
          log.args.on[5][1]('bar')
          log.args.on[2][1]('fo')
          log.args.on[5][1]('baz')
          log.args.on[2][1]('oo')
          log.args.on[5][1]('qux')
          log.args.on[4][1]()
          log.args.on[8][1]()
        })

        test('results.push was called three times', () => {
          assert.strictEqual(log.counts.push, 3)
        })

        test('results.push was called correctly first time', () => {
          assert.strictEqual(log.args.push[0][0], 'bar')
        })

        test('results.push was called correctly second time', () => {
          assert.strictEqual(log.args.push[1][0], 'qux')
        })

        test('results.push was called correctly third time', () => {
          assert.isNull(log.args.push[2][0])
        })

        test('results.emit was not called', () => {
          assert.strictEqual(log.counts.emit, 0)
        })
      })
    })

    suite('match with jsonpath expression:', () => {
      let stream, options, result

      setup(() => {
        result = match({}, '$.foo.bar[*]', {})
      })

      test('DataStream was called once', () => {
        assert.strictEqual(log.counts.DataStream, 1)
      })

      test('walk was called once', () => {
        assert.strictEqual(log.counts.walk, 1)
      })

      test('EventEmitter.on was called eleven times', () => {
        assert.strictEqual(log.counts.on, 11)
      })

      suite('read events:', () => {
        setup(() => {
          log.args.DataStream[0][0]()
          // { "foo": { "bar": [ "baz", "qux" ], "wibble": "blee" } }
          log.args.on[1][1]()
          log.args.on[2][1]('foo')
          log.args.on[1][1]()
          log.args.on[2][1]('bar')
          log.args.on[0][1]()
          log.args.on[5][1]('baz')
          log.args.on[5][1]('qux')
          log.args.on[3][1]()
          log.args.on[2][1]('wibble')
          log.args.on[5][1]('blee')
          log.args.on[4][1]()
          log.args.on[8][1]()
        })

        test('results.push was called three times', () => {
          assert.strictEqual(log.counts.push, 3)
        })

        test('results.push was called correctly first time', () => {
          assert.strictEqual(log.args.push[0][0], 'baz')
        })

        test('results.push was called correctly second time', () => {
          assert.strictEqual(log.args.push[1][0], 'qux')
        })

        test('results.push was called correctly third time', () => {
          assert.isNull(log.args.push[2][0])
        })

        test('results.emit was not called', () => {
          assert.strictEqual(log.counts.emit, 0)
        })
      })
    })

    suite('match with numbers=true:', () => {
      let stream, options, result

      setup(() => {
        result = match({}, '1', { numbers: true })
      })

      test('DataStream was called once', () => {
        assert.strictEqual(log.counts.DataStream, 1)
      })

      test('walk was called once', () => {
        assert.strictEqual(log.counts.walk, 1)
      })

      test('EventEmitter.on was called eleven times', () => {
        assert.strictEqual(log.counts.on, 11)
      })

      suite('read events:', () => {
        setup(() => {
          log.args.DataStream[0][0]()
          // { "0": "foo", "1": "bar", "2": [ "baz", "qux" ] }
          log.args.on[1][1]()
          log.args.on[2][1]('0')
          log.a{"version":3,"sources":["../src/ExplorerBase.ts"],"names":["ExplorerBase","constructor","options","cache","loadCache","Map","searchCache","config","validateConfig","clearLoadCache","clear","clearSearchCache","clearCaches","searchPlaces","forEach","place","loaderKey","path","extname","loader","loaders","Error","getExtensionDescription","shouldSearchStopWithResult","result","isEmpty","ignoreEmptySearchPlaces","nextDirectoryToSearch","currentDir","currentResult","nextDir","nextDirUp","stopDir","loadPackageProp","filepath","content","parsedContent","loadJson","packagePropValue","packageProp","getLoaderEntryForFile","basename","bind","loadedContentToCosmiconfigResult","loadedContent","undefined","validateFilePath","dir","dirname","ext"],"mappings":";;;;;;;;AAAA;;AACA;;AACA;;;;AAUA,MAAMA,YAAN,CAAoE;AAK3DC,EAAAA,WAAP,CAAmBC,OAAnB,EAA+B;AAC7B,QAAIA,OAAO,CAACC,KAAR,KAAkB,IAAtB,EAA4B;AAC1B,WAAKC,SAAL,GAAiB,IAAIC,GAAJ,EAAjB;AACA,WAAKC,WAAL,GAAmB,IAAID,GAAJ,EAAnB;AACD;;AAED,SAAKE,MAAL,GAAcL,OAAd;AACA,SAAKM,cAAL;AACD;;AAEMC,EAAAA,cAAP,GAA8B;AAC5B,QAAI,KAAKL,SAAT,EAAoB;AAClB,WAAKA,SAAL,CAAeM,KAAf;AACD;AACF;;AAEMC,EAAAA,gBAAP,GAAgC;AAC9B,QAAI,KAAKL,WAAT,EAAsB;AACpB,WAAKA,WAAL,CAAiBI,KAAjB;AACD;AACF;;AAEME,EAAAA,WAAP,GAA2B;AACzB,SAAKH,cAAL;AACA,SAAKE,gBAAL;AACD;;AAEOH,EAAAA,cAAR,GAA+B;AAC7B,UAAMD,MAAM,GAAG,KAAKA,MAApB;AAEAA,IAAAA,MAAM,CAACM,YAAP,CAAoBC,OAApB,CAA6BC,KAAD,IAAiB;AAC3C,YAAMC,SAAS,GAAGC,cAAKC,OAAL,CAAaH,KAAb,KAAuB,OAAzC;AACA,YAAMI,MAAM,GAAGZ,MAAM,CAACa,OAAP,CAAeJ,SAAf,CAAf;;AACA,UAAI,CAACG,MAAL,EAAa;AACX,cAAM,IAAIE,KAAJ,CACH,2BAA0BC,uBAAuB,CAChDP,KADgD,CAEhD,2BAA0BA,KAAM,cAH9B,CAAN;AAKD;;AAED,UAAI,OAAOI,MAAP,KAAkB,UAAtB,EAAkC;AAChC,cAAM,IAAIE,KAAJ,CACH,cAAaC,uBAAuB,CACnCP,KADmC,CAEnC,uCAAsC,OAAOI,MAAO,6BAA4BJ,KAAM,cAHpF,CAAN;AAKD;AACF,KAlBD;AAmBD;;AAESQ,EAAAA,0BAAV,CAAqCC,MAArC,EAAyE;AACvE,QAAIA,MAAM,KAAK,IAAf,EAAqB,OAAO,KAAP;AACrB,QAAIA,MAAM,CAACC,OAAP,IAAkB,KAAKlB,MAAL,CAAYmB,uBAAlC,EAA2D,OAAO,KAAP;AAC3D,WAAO,IAAP;AACD;;AAESC,EAAAA,qBAAV,CACEC,UADF,EAEEC,aAFF,EAGiB;AACf,QAAI,KAAKN,0BAAL,CAAgCM,aAAhC,CAAJ,EAAoD;AAClD,aAAO,IAAP;AACD;;AACD,UAAMC,OAAO,GAAGC,SAAS,CAACH,UAAD,CAAzB;;AACA,QAAIE,OAAO,KAAKF,UAAZ,IAA0BA,UAAU,KAAK,KAAKrB,MAAL,CAAYyB,OAAzD,EAAkE;AAChE,aAAO,IAAP;AACD;;AACD,WAAOF,OAAP;AACD;;AAEOG,EAAAA,eAAR,CAAwBC,QAAxB,EAA0CC,OAA1C,EAAoE;AAClE,UAAMC,aAAa,GAAGhB,iBAAQiB,QAAR,CAAiBH,QAAjB,EAA2BC,OAA3B,CAAtB;;AACA,UAAMG,gBAAgB,GAAG,0CACvBF,aADuB,EAEvB,KAAK7B,MAAL,CAAYgC,WAFW,CAAzB;AAIA,WAAOD,gBAAgB,IAAI,IAA3B;AACD;;AAESE,EAAAA,qBAAV,CAAgCN,QAAhC,EAA0D;AACxD,QAAIjB,cAAKwB,QAAL,CAAcP,QAAd,MAA4B,cAAhC,EAAgD;AAC9C,YAAMf,MAAM,GAAG,KAAKc,eAAL,CAAqBS,IAArB,CAA0B,IAA1B,CAAf;AACA,aAAOvB,MAAP;AACD;;AAED,UAAMH,SAAS,GAAGC,cAAKC,OAAL,CAAagB,QAAb,KAA0B,OAA5C;AAEA,UAAMf,MAAM,GAAG,KAAKZ,MAAL,CAAYa,OAAZ,CAAoBJ,SAApB,CAAf;;AAEA,QAAI,CAACG,MAAL,EAAa;AACX,YAAM,IAAIE,KAAJ,CACH,2BAA0BC,uBAAuB,CAACY,QAAD,CAAW,EADzD,CAAN;AAGD;;AAED,WAAOf,MAAP;AACD;;AAESwB,EAAAA,gCAAV,CACET,QADF,EAEEU,aAFF,EAGqB;AACnB,QAAIA,aAAa,KAAK,IAAtB,EAA4B;AAC1B,aAAO,IAAP;AACD;;AACD,QAAIA,aAAa,KAAKC,SAAtB,EAAiC;AAC/B,aAAO;AAAEX,QAAAA,QAAF;AAAY3B,QAAAA,MAAM,EAAEsC,SAApB;AAA+BpB,QAAAA,OAAO,EAAE;AAAxC,OAAP;AACD;;AACD,WAAO;AAAElB,MAAAA,MAAM,EAAEqC,aAAV;AAAyBV,MAAAA;AAAzB,KAAP;AACD;;AAESY,EAAAA,gBAAV,CAA2BZ,QAA3B,EAAmD;AACjD,QAAI,CAACA,QAAL,EAAe;AACb,YAAM,IAAIb,KAAJ,CAAU,mCAAV,CAAN;AACD;AACF;;AAzHiE;;;;AA4HpE,SAASU,SAAT,CAAmBgB,GAAnB,EAAwC;AACtC,SAAO9B,cAAK+B,OAAL,CAAaD,GAAb,CAAP;AACD;;AAED,SAASzB,uBAAT,CAAiCY,QAAjC,EAA2D;AACzD,QAAMe,GAAG,GAAGhC,cAAKC,OAAL,CAAagB,QAAb,CAAZ;;AACA,SAAOe,GAAG,GAAI,cAAaA,GAAI,GAArB,GAA0B,0BAApC;AACD","sourcesContent":["import path from 'path';\nimport { loaders } from './loaders';\nimport { getPropertyByPath } from './getPropertyByPath';\nimport {\n  CosmiconfigResult,\n  ExplorerOptions,\n  ExplorerOptionsSync,\n  Cache,\n  LoadedFileContent,\n} from './types';\nimport { Loader } from './index';\n\nclass ExplorerBase<T extends ExplorerOptions | ExplorerOptionsSync> {\n  protected readonly loadCache?: Cache;\n  protected readonly searchCache?: Cache;\n  protected readonly config: T;\n\n  public constructor(options: T) {\n    if (options.cache === true) {\n      this.loadCache = new Map();\n      this.searchCache = new Map();\n    }\n\n    this.config = options;\n    this.validateConfig();\n  }\n\n  public clearLoadCache(): void {\n    if (this.loadCache) {\n      this.loadCache.clear();\n    }\n  }\n\n  public clearSearchCache(): void {\n    if (this.searchCache) {\n      this.searchCache.clear();\n    }\n  }\n\n  public clearCaches(): void {\n    this.clearLoadCache();\n    this.clearSearchCache();\n  }\n\n  private validateConfig(): void {\n    const config = this.config;\n\n    config.searchPlaces.forEach((place): void => {\n      const loaderKey = path.extname(place) || 'noExt';\n      const loader = config.loaders[loaderKey];\n      if (!loader) {\n        throw new Error(\n          `No loader specified for ${getExtensionDescription(\n            place,\n          )}, so searchPlaces item \"${place}\" is invalid`,\n        );\n      }\n\n      if (typeof loader !== 'function') {\n        throw new Error(\n          `loader for ${getExtensionDescription(\n            place,\n          )} is not a function (type provided: \"${typeof loader}\"), so searchPlaces item \"${place}\" is invalid`,\n        );\n      }\n    });\n  }\n\n  protected shouldSearchStopWithResult(result: CosmiconfigResult): boolean {\n    if (result === null) return false;\n    if (result.isEmpty && this.config.ignoreEmptySearchPlaces) return false;\n    return true;\n  }\n\n  protected nextDirectoryToSearch(\n    currentDir: string,\n    currentResult: CosmiconfigResult,\n  ): string | null {\n    if (this.shouldSearchStopWithResult(currentResult)) {\n      return null;\n    }\n    const nextDir = nextDirUp(currentDir);\n    if (nextDir === currentDir || currentDir === this.config.stopDir) {\n      return null;\n    }\n    return nextDir;\n  }\n\n  private loadPackageProp(filepath: string, content: string): unknown {\n    const parsedContent = loaders.loadJson(filepath, content);\n    const packagePropValue = getPropertyByPath(\n      parsedContent,\n      this.config.packageProp,\n    );\n    return packagePropValue || null;\n  }\n\n  protected getLoaderEntryForFile(filepath: string): Loader {\n    if (path.basename(filepath) === 'package.json') {\n      const loader = this.loadPackageProp.bind(this);\n      return loader;\n    }\n\n    const loaderKey = path.extname(filepath) || 'noExt';\n\n    const loader = this.config.loaders[loaderKey];\n\n    if (!loader) {\n      throw new Error(\n        `No loader specified for ${getExtensionDescription(filepath)}`,\n      );\n    }\n\n    return loader;\n  }\n\n  protected loadedContentToCosmiconfigResult(\n    filepath: string,\n    loadedContent: LoadedFileContent,\n  ): CosmiconfigResult {\n    if (loadedContent === null) {\n      return null;\n    }\n    if (loadedContent === undefined) {\n      return { filepath, config: undefined, isEmpty: true };\n    }\n    return { config: loadedContent, filepath };\n  }\n\n  protected validateFilePath(filepath: string): void {\n    if (!filepath) {\n      throw new Error('load must pass a non-empty string');\n    }\n  }\n}\n\nfunction nextDirUp(dir: string): string {\n  return path.dirname(dir);\n}\n\nfunction getExtensionDescription(filepath: string): string {\n  const ext = path.extname(filepath);\n  return ext ? `extension \"${ext}\"` : 'files without extensions';\n}\n\nexport { ExplorerBase, getExtensionDescription };\n"],"file":"ExplorerBase.js"}                                                                                                                                                          �k4<��a���j(ɥ@��@sm�����Sk� =�Z�M�-����/�v_��d��ش��y���b���[Q�2��p�h�%)������ȹqi}[������<l'���??�gy�\����,���ci��@@���CY?6�`Q�{oK*�	>��4�Ǐv�b���
�{��:��_{a�6� �h�(u�R��h��=[�<(L�Ȏ��R����Rr�g������1MN��8�Jڼ�>��t}��7�^L���I᠅�V�r_�{U�Q����
��Y7S'ݒ�r�G��2�
����dױ�t#+�@��=����[]7�4��umy�t���d��+��i|�`��#��l?Ѿ�
��� R+�Ù"cUN	qq���;��h64������WK��)Fr)E`h�"���'�!���r9��c�I&�U�cǄ}y�2S>�m�:���R#tr.8�p�SQ�D�D�� �9����{�����.������pyܜ�8G}�V�
��1��ԉ#~��x2��d���/�v�mҺ&@P��`ɾ��3�n͆C���gOx��>��� �㱝��9�_+�)��M�=k�;w�a\����a2��9�N����l���ז(k��
\�=ǝP�~ƶ)[�����g`���Eu̴�i�6M��;~Z�{����J��q�i`�W�߭;�=@&����������TNx��ئ^l-q]UA���@�d65'��i
͉��Օ�MK��/������[ �?���x�<;����})�fp_��Y�?�ٵ��f7�3�^��w~������Ȩ�?�#�/H�\��o yÌ����������&^��忳m���Sv��#�Iҁ��)�R��yM#+��o��A@�
�tk!��f���O��$s�����l[F�������x\��>��~C�z�R��A�`x�u�!E�����
��
ߤe)�y9?3S:��Z�zQ�P
����� �>�g�W��m�H��pp�(��Hh(hh�(�����1�0PQ?�������C�$ ��%�����O%0�����G��G�EGE������ ��`�a�aa>>`��b�� (���������ڈ���������#�,�8�����^��pX��T8�ƈ��p9r��%k{��f�4\&�A�(��DĴt���yx����H����+|W������553���ie���������+$4,<"21�wrJꟴ����¢�Ҳ���Ʀ�ֶ������ѱٹ��ť�՝ݽ��ã���ۻ��G���p� `a�W�qa����?�`>x����[B��	�g �dBnm/25���y��{���?����=`A�!����Z����<X,���{^$�Q��0P�;�:��P���K��Ҽ����D�>�:�Ħ_�Z�-d�����8N�Ay��M�����=Ĺ���o�uTVUv�Y<���/]�(O��Ix��[
�w@�,�-h�B����Xہ��4^�!WwC&��
�;�����e�b����tB�j����g�7b��;�l�<W��X�*��|�����K�2'v;�e1H��/K���{��z8��T蟤<
��)�1'p����k"���(c���ӄm�gT�w�v��; z�7��d����R�;㶁�d�%�Sr�u�����u����{C,�I�LI�f�e�+H��a����Tu�D��7� �,å���V���~ƿ�!����\���G�/����Α���o��C\�hw�q>So���8��;@�f���t(�����8����{��`>�帕Ƒf�$�$�^�S�%�*]+E$�mzo�Ps9U��Џ|�0��L
���c�G9�Wt�����IB	����B�u}?�C��N�5y��}*9WgQ��}}������%h�)�{��NU���R��u��[�Z���� �w�1��; �f�ˈ��m2Ċ���`�C:�r��U �s���2G�b��Ku�������ߓ2>����g�_k�>B�Q��c
$��g��	�$"�E�6����J�k�U��f�aP𫒟��a���Xg�_���[�`J�;
��m��T!���\��ҚŲ�����4��w#����� a��R�(����d���{��|�SXC�^��|.�Q��
����@�dO��Օ�a>���/$�������W��N��N'싋���A3������_L����r62��k;Ađ �*��ߪ�M_I��W0!au|�H��i��{ʣ����,�i�~V�$��(�g��.ᕉ�%�=�S��:g�%���鲝�v�;���~�]*���C�4X��%� �x#_~�� "jt"���g�XgD�=���ۮ�b#l9���2�&����n��@�0ײJ��M����<�t��#�����oZ�GQ��L���C�u����p�o�c5��g��~t�Y�:�}z�*::w&PS����%��@\�(�;�y�
�`��}l�+��O�ދL�ц^�ԯx��R���׽ﾊ6Rg���K��1`/چ�S���r��� ����-��]=�P�f�O��&��`j�m��^@�$�oΠ��=������������j���� ^��!"%H�ӣ�L��3��¥�ߥ�C߭t1 1�v�xP�O��9lo�b����:���6(�2��3��E�g���_*9����vh׏6pz%��n3W<�m��U�8I"\�Mx�w@}o�v�;�K�Sj�r�U��\�
˦��1�>�C�="�sʸ����
Ud����,?4��n+h���<d��/M�%OL��fs��"�D#��Dn|��]hp�H9M���=��^	¤��<9Hc��2��f�++� 
�Zp�M}��*H��o������(�p�_��ӡXPV�o����&K�z������+_�����!��u�Di���5k��3�����'�w@�J�i�����X��I�J�ۗ	ӷ��w@e�Q5�k��n'X���`���nI*�	����1�[WU�� Fb~Ku�!;�)�z
I�̶]�#;�^d!�����_�5�e�k�U@~�E�X����i_�yo�'�� �u�<iW%H����YɝV���)�׃\��מh��Dm�l�����7��s���,�-�3�*TB\ʈ�
v������f�ZMh����|mN��&����Hf�9�?�F�i�Za�%Ot����,�~�w��gz���0�jA+ۇ'%ժ?5ĪY`�����LQ�+�xf2���E�#o8��� ���8�":��ݜa�mp>���3K8����M��$���
z�H[ib���������/��<+M��S�L�G�9e�n�o/�A��#NncK�4�r�%�}��vU*����U��
���5�h����U�����t�e���F��P�sa{������ �jZ;�y�w�u2����* ��B��:�<�
+���j�u��zx�ö�a�l1~4�џ}ɓ�<�
]�y:�Us��8����vT��S�;�B\8�_j��������#�ӂ#�����$P�
+
�'^��w�Ť�xw��;#��C_��cS����L+�J��6%'E�F���?���R��_ܭ�ٶoT�7�fy�Vdנ�m�y-�5���*��v�N���/�H����h� 1��j�ς�1�;�[VE�1��2�ߘw@�a9Pb�pA���
�NN�cm�9���x&x��VZ)���l~Ҏ��Qv�nM�Q�VTt_<�.�Z�qos/�}�E��2��"2��p�o�@���f�Q��\�ݷ��HT�cD����?e�a	�#JuMӍ�Ed�'+�U�2:w���P�c��mJ;_m�"���R*�s�b���������h5�'��&��3QbJ-�#Cژn�Pl�v�-5+��"��6l�T�o��.�Tak�`0D.�v=��w8`�U�b��S��}�������s��1��1��)Ŵ��`i� ��%�Fi��	t��H 7պ7��ly&�.�var List = require('../common/List');

module.exports = function clone(node) {
    var result = {};

    for (var key in node) {
        var value = node[key];

        if (value) {
            if (Array.isArray(value) || value instanceof List) {
                value = value.map(clone);
            } else if (value.constructor === Object) {
                value = clone(value);
            }
        }

        result[key] = value;
    }

    return result;
};
                                               �2��cg�C�q�URKֈ����ܹO^�&��%��U����T����ٗ���K�#u_^����?��i�s)�o>S�����~f�Ӌ8��Ej�y;��zD��K���ya`��~���^���ّ�w4܍%�+j�Ow/ߵT��c�j%|��j��.����Q��?dB�v�6aw3b8G���g�����9[�I1z��1��3
�,!��.|	9�NSRvo0y��Eݟj)�#*gx��os�lX���ٮ}n\�g��kl��<m!�ڐ���c� ��b��%��I�<�#�!�~�Fgm4�aV�5�G���i�=��:�I��� G�]��_�iv�~��8�8am���B5DՒV�hr@����y/��<��^��7�냧N��Q���,Z6�+˪6{�x���ɴ�a��-X�w?�Jӽ�|�(�?�Ĺ�J�Y��,͍���rޏГK�eQX���o�`��ɮg�U���ж/t�f�\�c@'4Ὄ�R������_�"�����b�y=���!ɏ��\hV�4ɕ��;��|�G���8֋�q�a4T�;˟�
<��=ؙ�7���3�@��+������
�ش�U:�в�*��91v��g�Ab2��ʿ$�-/X�D��(t�(!�R�,����1ϲ"	�^(��|������{ML�Dh�('/�,E��$��N��<xLCLr�wg>:g���,S+�ucf�+ዋL�A߳��Q$9��F��wc�洌`r��Ϗ��g��[����.RH/-(�ԦX�)ˎ/�"����)(A�LpOD��\y� {����(�\n!�� G^6�iN��x褜qq�
��㦗��i��1�Ov�
/_�\֠g͙�/�O}�dN���7O)R3o�����=����D<���"qg���a�0.G�9���,␖� �k#�	�y�,��b�:�"����NЪ�A�2�r�G�n�[�ud���tcD}��:�P�U�Q.�Gr��`�ޝ6���{Ap�ȁ�[0���5(�x_)�q��3�wբ\(oM�p��E�7��s�7��iY��''bk�h�s�V���?<��Q���.������b^�	 ������j���*�����-��p�@�QĐzE���P�]7�s��y6�ȦŹ͖��Qi��Y��;��p��j�)�"i(�2�((
=��οjQE7��ָsL�na��^��kV�N�JV�u���m�hvLd�سM�aJ=YmQ�g`�0���]��m:{����P�%)�'�c�%!����n}��T��,�-�`���3�Fsq�V
�	J���^��T�=$�]��]0��c�vH�`���9 �,�dĆ��AH���=���c�v+�T��mۏW%��EasE�L�-��"�H
pV�o\EJ0�
A%��Պƴ^��mjs��9���|ֱk��b��
�?p�;kx�lݶq����؝U݈lN�e"�3(uM<�7EQ>�|�#� ��
a����o'��e͏ĩ��:�
����)f^��<T1�ʧ�k��V?1x����ȂLR��&3��$���5����A��0O�O��FaG�h�3t�_0��"/��g�œ���I�R̍�s����α�쾈$o�)��`h	\���T:`&}�bN������ǻסS�����M�|��^wHd	�]|�D:�[��+��k�;�g{4�:T�hvm�Nqq�3��h:��	�3�'?�4%ㅤ��*�n�;��m� t����f�O��>,�z���B��T�2���J��9s.,|���iz��;]�r;'ܻ�2ם9+ ��+��]�����)���E�h[1��M����*���M��Z��I3���%r�M
��}�k�R���qz������vf �<u6nVN�������[�-����gi�Pf���H�xY�\}"�m�h?�Q�w ju_x�o2�b�m�C�!�@��6%�8�ン 
�]1�Sᕉ�m]_�y��𒡑�Z��:��"U�(n
VP�k�otZ+K��s��͖s���p�$ә�G��k��M�=�Ǿ�l{]��?T��枓�F�j�x�+=�Iڽx�����L�Q�a�����ǢK�5�'�+���Ť�8��4�c<5�:t=Td���3��e���R92C�۪�D֤�S�s���?��D�h���i�8��l�
~�bC���V���p}K��� ��P�J��D�cl���[ػ*�7TO�]�z��Rs��N�Q��rc�H�U��X�P��ߏCLs�z?�5�~ۉ��M"=Y�[%픓���8q��8�{VUȨ��48A|��"��e!~��$���):�t�k�`E��j���)\OUU�b���^Ra[��StO�~̕�A:�Oza�F;�o�p�S�(��	���ҲO�:}$L��Hƹ�<�-�@>V^�i�B_ѱN�+�=��#����%Y��A}{�l)�4�"�T-�T�����k�����f�g��?�i֪�pr�k�`��~�.S��vڦQU^��W�+"�-������6��L�+�j(Z͐<I���]v�D\d�]��o��`/;L�֖�j�~Y�!./��P����n�ԙR4͈N���7��}'C���g�K�
��
�㶳=D���Ʋ�K�Y�RVdi�k�ћ�ٛ[�構lV�α�F�>dCY3�ՖDN6���hF>} �o��M�)��
��]z�rΊ�_idJ��ej�=
L�n 0� !
���3�����.��>����x���'�$-�0]e��R�/�^|Y�Km)���v���WkC}�1��fYfCX�CZ{�I��D���j>s�2N߳���oX�Y˱o�M7��䐒��<�\3z�)��*�x�4���R/�H��E@V�ux$M ��͌*(!8.��%Ch
�Sj,K�!eqS=�x��Y�h�
�K�B�;�0��������{�� x"P��`����Ƶ���!�d�I��C>{®��ep��Ҁ���n�.BJ��s<�w叚5:�R�#�-8�ՐĒ}����V�F�ġ�n4�H�}����|#��=f��G���k?ꯒ��+�Pw]��48?���h4�}Ʊ�urA�,������Vy���#�)v�L���r���ߚ�p�[TF�:����r'����9 S����ڔ]���סu�Z�p�ˤ�G�Jd����̡#���{G-	-����}�p����,��T�DC�G����Mt��Dх�+�.�D�����n3�P.�ڢP���[����Ke�/�xr�{�vw���L|�k���"."m�xg�b��?��(}z�J��s�J�5�����7I�0ۆj;�Fq 3M�����zG.�J���F�,ɮ��F)�U�v �ָ#Vͅ^#���ojqc���"*Ij��n�����/�U 0['F~@$9a=p�������K��3��1�D*iRe��r�I�}��^�_7E�&p{�t�;��kah�]>�Q���������A�<J׏�W4��n�9�6>�rw<�T���
^�ߗ���i.N�=�&<|��j�V���� ys����F�0-�i;V"z��o��y<�~f(a�e�Y�m m9�M����o��@�y+��!/�n�ݭӏ�3n'�:U��Ӭ,�K����z���;�X
�m�Y�E>�H�õ����$X6�H�D��5�C1n����;�SJ�	R�K��f��~��֘����s�]j�H7_����*���:k�!s)|�A�,����B,�ٗ�d��9�v�ʽc��G�x��)���m����|E���F2��c|^�O�tZ��)�2���5�$����.z�C�������ע���q}��bfN�~���\4)��㕋x�=�~9���.�!���xd� d"���v@$���V=�
,�H�����EY�� �4������p���z���(>wW�u!:�@V��!��r���>��ÏR��tT�VWY�Ma+�|��*�i��ά�])��9����'n���a�VD���ylS�V�O#2��wF%�ι�\�����W[	N�0���i�%�>�1?��'$��s�rJ� 6�Nx���wv��x�[�Ҝ�O6�u��_��Q�����*�������d�Z���x`1�oL۠F����o:�!4X�܊N�����]���N}ion
_��-����*'���&گ��0´�U�9����������/a�|Bċ�7���#Q�U%�j5�r��2�S����I���;���r�y�5~s���΄3w�ZM��r[�m��'D����b��*�����bm��t�ul�9�P.�2U,����GVb��b�nw
Q�������(�.�J~KЩ�]֗�Y�s��/�A�T~�p{�U�x۾��2�E벍��-�W�]��?��1 >q�F�ke
������RXǂ>q
�ox�N�V;��'C�ީ�TmY��b���Q&�.¨$�1��RK��B��c�I��p�p8$��8%�bxV;�FwѺ���q�ή��:�,��zJ�}ؐZ�����s5�'��b$�e^袰��14�6`�Q5�E~in�/�1�T��o�U��nM=��ƣ�!�&�*�c ����Z�X֎Vču[��Q8���(��=�=y���id,�ǆ���G���&�8da��	d=_;Pܾ�w��k�05xw�E�f��h���(YeUn1n�Z{!md��S�h����!��O|��uQn�5�׺Y�&>#ӹs5�:�ADV���Zh ^ڋ���C��(�>����ߝ���o��0itS�"���Jya��`���?��ǟb��Sft���q��;]&�p!7%#�P�j�pb~ 3���{��U��qH�'*����㙺U<�n�zڣܮ'���M����k�h���qj�w�
9���v��~܀�ohI&Ň���vԍ�+�٦FH2@��N�����ɘ�����\��ѼC�:r�U|�W�6P�	��V��jחd`��FP�Ԩ��4hW.��#���{�ӕ��K4���<η�B�ȩ�E��&��[�����jW���iޥu`�=�rd�"K�������'&�&or�w�?���
���v >&��,|�/�[J�u67�Ԁ	G�B�ג��a�����,�+��י�U $	c(��������.��ހxL�A��ʧ�MÃ|m�V�'�G'�c��^�h�N����Ow/D�D���n83�iH%
�Z�jj�Z����Vgՙ�zdy�yᕹ�8��U��߬�R���J�pW�u�n���p�o"p9��A��5#�H�6*�������;;E���w篅=���DϲO�nxk@y��V�\�!��p�^G��A�?���`���0a�<��g �Ñ"xm���)le�K�c�3N�����j�G�8T�4v�УM�"���0��e�Z���R�u|�"�0��T��h:��1�UM� �ݚ�Mb��U�뿥�8�|\��K��0���n�~�v��R�p�zڔ���L���%]42��v"�
�!�(�T^���|n�f����	C%a��I��	�"�ɾւ�~�1�0$���.�d�-ߑ������!#��� ��)SKO=�7]��]h7.�c��Ɯo�H�qN��֤	~�ŭ�C薢��)�&xW:��m:5��ZnE^�%�ŷݫ˘��Z-h:o�;�Xo�Mk7�!/�$��ʿ#�V��q�ݙh����-n赨Цuu��X�w�Z��� ����=�8����I5#��oD�cB��鼟3L�Y����x����9\ d6bP�ܜ����8��  �� ����1����vB/\�]��.:*�>�<ocz�Dma�b�����w��$	4�r�d��G���A�I�읫Y!���w3��jh���x]�͌e�^_�rm�5���֭��uN�{5[�f]c�F;��pʌ��,X��c�3��8Z�O��VT=
V���Ds��}�"h:�b�&m�6����N��ǺTp��~@~�#������_���
��!3z>�/ʿ	� H/�P\�F�����;��	v�=3��ԍP�Ry��^�|� ��.�9MV`hRp)����G�y1���J1&eHg�d|+ �v�V�LZ/:hΞ,,RI�1���Z"L��uF�t���%��aԞi��h��F�Ƣ�0?>��i��������/<j4���܋�+y^�Z\���-�B�D���ϼ�_ٽ0P�Ŭ�6
v��lICz� �3�'�V�v0
��;so��)Q9�EϨ
�}Y���j�T���|Rv��@�<�4b�*���n�B���%��tv��i��'�\̼^|���X����@+�w@�܁�߸���d����F�!�wF?�&�j�vz��m�F�����0^^���*���1�So�Y���;��k�/��'�qa�:���>�]/>;Dq)r#���яxw<��
��*�T���U�&Q����(�7����Aye]<v4P{cW7nυ[�)&;|���5�+t^�w1bJOYc{6@��Ҭ� B{o�g͵�`(YA6D�Sx��{[QnO.��L�ƺ���I3����
(��m�
����8$zYI����fN���qδRi�X�/�PJn�P��A��u8l{��Z�e��u��e�i��pX'l��˷���*Q���8
��"�'�����	����~�}���u�u~,���)����	�ȩ� ���-���8�8��Y�s��Q���4�4���oTP�?:Hљ�B����ve>�xS��1�χ���"gk�
�L;a|mG5��XFL
����M
�d'B�F�M��*t�F�@�5hW�U*/�P�=ڑϵ|u)h����w�"�Xܹ֏_?inv�#߾�wJ֑�L��°^L����xH-�OCX혾ukj5�za�'�b cR�\��4��CҪ�
S��l�r1�k/B�l�+ϔ
ty�a��a*��8�3�. �F�E P!I�{��������/�q����U��|3��$�qu�j�u�q��#iВ|�<Ta�S�m{0�6*�-�P?�[q�~�3p����b�E�/��m���בZ���N�����Dj!dR^�����L�	���飷�bȼ3$I>pL�L�<8�h�z���o��B�����y#b�DЬ�q���Kd���), ��~7����6��H!B�5y�0���^G��4B^t��F>%�yv�s[��ɮ�9���흄�ڀ	�a[�c�l�S�f!5�g�YP(�;`Z��\�q�b�{����u�2�P~�Pӧ�Wզ�T���b�-��Y�M��+"��^x<hԼ��D��ZGI6����s�!�:0�:n�H��F)x���{�(��wO��|r��%��7�[�';��i�������0_�pr��9�t�����/"�2dM��x��O�$/���n�q�K�?���(�(�,iʊkt[�������5g��K���_��GC���4��ٰ�X�Ĳ/a3�E�Qp��Q�B��D��DIZ����
IFo�FMGP��υ �]t�wA��y�oe���507��[�v�-m�YTJ����Qb���0Wԕj���^
م��(:�.���p�L��}�uo�h�巗���L��G4��ѯ���nDiΚ�L7�y&M�$�����(���I�	��h�i1��#��dg���n�,Sd��kS}��b��@ ��ݸH�g��nw�"O�R��˗h�MR$��o&��K{Ĝ��]/]$�A�u���X��xY}zMծx�Y:���-S�N'�JB�y�n��C�o�'q;".?�|��J�	%�v~�+���mgu��^6^��H�  �aV�l���&�
i�6��
�${����Liۘ�(ѷj]_��V6�5��-#�rF��<��q˳n�'�2I��7�덝���s�1;���t�Tg���-�	b�_�C��0;������ �b�[��
�Jj�&�͂F��S���\ x������R���������'�ѡI����������.K�<����e�i�\Ky���.O��BsRr�$^�Uq*�hY�ur�e����9�sRY�g�
���[�����ŭO~�u��9IV���|�0��EUꏚ�2c��܃E�Z���רm���̜nw��\K�OYZz9���1%����BQY.e�h�6���fmn3h\��-=yX�̯!]P�p�	1e�2���Q����	��\�h�΢�Q�(2j|�ᴦi(�I���1uL3=
\�� .9p������|�4SaN&�_�LK����� �{�T�����#w����]ڲ�~����(T�KVD�-u|��B8$D���
�^`̞0���-eX_��ƶ��
_�
�P���SRB�eqg�OT���M�<k�3�d��/,�A_��������ͽ���3�Ǻ)�]���K�x�2�_9��?520���nƖ��ĽM�iy�!�S����3��I�U��W��@[�,͝�L}�B��X��h�Xt�K-�f�˄ĺ�������`���͛$��ؖ�;`M�\�\3a=U��hR,!m�H�{���sF����=FV'uk3J�@:�����b�*��3��
�U{Bv! n����w[X�v	r���^K��z���q�_�P��ӇI��꧑�P"c��l��s
�L�VP�}b�!�RWZr�/����{\|C^O�4)��Cm���C7i<`���
$b��<�fQ_k�h�e��i�fV���at��06�B����٩�a�OKseR?�1)c���cҺ�ƾ)"�;	]�>��"D������|MC&��_�y�}�;�G+�?[4�S_���.��������C/�RBί�?  �ϭ���ۮVP&��ދ�!�!oшerp��s,zN���HvHeM��Ƨ����I�ۮj���9r(/�Y��{�7u��n�;����ȁ�8������;4���s'��Ã��9观,�?�]�WY�
loʅ}2���'���1���ea�m_��6��Ea)4��E�Ս��7jR��hq��A9 0�GW���C �;����5|�C��|l����E�>�7�8 gO��7)꠼�
�b$��jVΩj	�'�:�8�9"%��+��ѯ�q Go-��S�"bH�r�:Q)n6u�Z�.w���
k�Jrw�����n7�I��ڪS���e����6uL
����5�,_��;-��k6
�s$y��/O��FH6��v��XF�)�m�k#���������ݒ��L�w:'*�5�����||�#U͙7u���Q{��bE~�p]�z������M7p��P$�z��"wZ��O�>��B�@܁����՘u�U�v��+d��X���0Lyuʇv�ٹ٧}�)�/�?x�5�K
3��C�%�\1'���qa>l��9��-�	\��h����XG����[i1�=�M��u�w\�
��4���H�R'�7	��A����z�/r���¤jSnm6��H�eu�W�ݢ�۷�(�Mn�4�͊�3h�{�A]����v�&��T�$������4�;L��|%G��ֆ�������z}�ꪱ������H4m`�T���u}}�a�(����i���H��"\�ռu׆�AD��mAo��{�t�����B9���1%����Hۯ���?����0_�<IVĪ�h�Ɗ���A����g�-�snB:t��7�v��-�$�Ou "һ�*�����M)|�����Te������\{B8���w��L���I%��9:�+kpJ�t-Ʌ����L�v��W̷'�a!w
��j�����6z�gk���4~'/�q�ty(G)�!�- +�<�
{L��O�N\���U:B�o��:mft�Ȕ��(y(S��R�Nd�G�Z�X�f\��_��e���r �YdR���3״��|WH�F��� ����ϧ!n��HT��82+��66k\s(��b�.N6;Y�V���\�~%~�=��U��	��Ov�3�A�wL�>ětez�f24!!֒.U��/�I��h��|�;x��\ }U��7��[��%l��!�24
�k*���Gj�fGv����]B ��EL�����D53\�	�"�;��x���f�0TCӒx�z�<�-����:>oC�^���y2�\K�F1�9�}�/M0A򎜝�Q���Z',�v&;�tA�v+�tc���r;������o�~�Å�Η�Պ���O0�2o�x���!w��j���r\1�SG��%�������f�����_�Y�9ּ�j��Ou9_2h���3\گ-w�����ݎd�l��+&d�>Hۆ��R&�������#d�M��o�[���X1����`����:� �Uv�
Y���3x�GïO"�` �M�����4O�z�e��^�����$d��zȃ͡�_�ŋ�X��Wa��ƛH����ӝ�lmi���"`�t:��N�0A������:kh��@��w��d��:hm��v6	쥉�1s;fj���8/ 7��7�Qw���J�b�a@�q]g�A������<�w��PF��V�q�������^_��L�[���doROkh����X8:�)�<U\�A�@Oq7c]v�HilJ@:rw9?���C�l�Y��;`�
�z�~is��̯��f.������N8�)�L@_�� 2���'T���M�)au��%��6���M�y�pI\S1��B�ձ|QY�7��_�ι�Tr�!Ǔ�B�oge;��v�z�ۣWv���5�")��NSL�[Q.�ap��n��ö|�f�I�C,�FGd�I�~���X]V�����鎬��8���;O9X�k�"�����=x��}��QDǾ��ż+x��D�(FQ1�R(����7���rD��h������Z�W#f��Cc���䤬�>���|��,��4TFDO5��B�=���i�
�̬\�q�Xg�G����F�5=�5���U��	B9yq4e�-RP���>wA����9���M=3���Յ�R�~�в��*��q�����}�u��x����;�c�P�	m{���z��x{ '�Yfi���$Tj�	�~-��W�[
���H���^���n"z? 
���q��%J����*�8y	��5+Ź̓58o�k��;�ѷu)?�GY�A�����n[خ���lM�ڛ��~��p��|�E݀MkY�á���(�k�y)G�Hg�R���*˶�!�tj�d��=���3]��R��"�����1�{c���#��L�u�C��ۘN�ʷQy���7i��WXr�ɠ������� =6�b�]\�͈1���D���w�}�nB�;l�E�d��C�T���݊r��wJ1!�Q��y3���G���������n��_^��J^��Vٕ�8\j��s�
�CW_R]Oڢ�y�8W����3E)K�X���;�D��
�ٓ)s��c���E����>~ū�����V)"�����Qv��MK��"���ӑ�A�δ��0�D��M�w�[z}��%�c�W�hOo5���X'`����A�{P�`L�����o��f �˕�K�T,����~`�Hɥ�Y��t+�)���F�Aؕ��0-�!�{�i8�YKCl�C#)�3?>3
$]���堭���gBR`����e�C�?�!K�aׯ�O��U�.�����K��d��D
7�V��a *_!�[����-�2��$ޮ�Ocy�ڟ�+!��8����	*d������?~��&��"l��qT��DrOK�k�J���Hq&g+�4}����;D^�|�8B�ИC�/�j��n��lQ0vh4� z��v�:?�w,p3��$5�k���=�FO����F�L��~I�
�`{%��<��2ik�r��U�;9�E�&��T��9�7Iu�'�+8����~�+�ƞ�Wk����l)5���T�[K���D��ڐ�%����b�Dl2��x��e}����#!:����@o2�L`ekx0��^�B�t��E��}��8je�f�)Γ�z@�Sh��^b�uV�mC�)7�kb샹��`�s#�h�ϲ|PUC^��κg��`c8c� mB	��3E�o8��P�x{���u@�%��O"���ϽE��ez�R����]<��vN�E^��V�d��EphG�֠�{n����X�A���ڣ�9�\ΕJ�kyi~g��HĐL��9�7����a�����Y˝b�A|� �F�"�=�lLc���@$UT{y|74�~lҕy("��6U�uB����t��y 4��4���i��ł��I=���� hF_��E�p��}�;�$�)Ю7Af���V�y���$�h��|E0��Q�<�ÃbQ�F|9U0�)+�_J��3��^F9��L*Ή���Q��j�Թ�{\� ���Ɂ��Q�Y�Ҙ��c"	m8TW�����ђ\�j��MH��/�Ȍ/�pU�
���g�U��g��ܒ�����OXn��㮊�d�n��^��]�D��(�N:��T'p���X@?�h�Z�ҴZr��
��ޠ��54�}_��y�cp�)�֩F�wL������
CO����� w��rͪ~<3V��Ѯn�?�$a�nҬ=�!��	�+��Q{��awcї�����-����]��	`��c��=�@���u�_�#O@N��1n�O����t��^��b����<�����U�-^��np(f1D�'7	<��hy�}�?��Q�A����~
��Üu��oPq�(�؇�O��
y$t2��S�/֪ � ﳆ3�	k�.�"�=6S�ij&$����h��J/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(){'use strict';(function(c,x){"object"===typeof exports&&"undefined"!==typeof module?x(exports):"function"===typeof define&&define.amd?define(["exports"],x):(c=c||self,x(c.React={}))})(this,function(c){function x(a){if(null===a||"object"!==typeof a)return null;a=V&&a[V]||a["@@iterator"];return"function"===typeof a?a:null}function w(a,b,e){this.props=a;this.context=b;this.refs=W;this.updater=e||X}function Y(){}function K(a,b,e){this.props=a;this.context=b;this.refs=W;this.updater=e||X}function Z(a,b,
e){var m,d={},c=null,h=null;if(null!=b)for(m in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(c=""+b.key),b)aa.call(b,m)&&!ba.hasOwnProperty(m)&&(d[m]=b[m]);var l=arguments.length-2;if(1===l)d.children=e;else if(1<l){for(var f=Array(l),k=0;k<l;k++)f[k]=arguments[k+2];d.children=f}if(a&&a.defaultProps)for(m in l=a.defaultProps,l)void 0===d[m]&&(d[m]=l[m]);return{$$typeof:y,type:a,key:c,ref:h,props:d,_owner:L.current}}function na(a,b){return{$$typeof:y,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}
function M(a){return"object"===typeof a&&null!==a&&a.$$typeof===y}function oa(a){var b={"=":"=0",":":"=2"};return"$"+a.replace(/[=:]/g,function(a){return b[a]})}function N(a,b){return"object"===typeof a&&null!==a&&null!=a.key?oa(""+a.key):b.toString(36)}function B(a,b,e,m,d){var c=typeof a;if("undefined"===c||"boolean"===c)a=null;var h=!1;if(null===a)h=!0;else switch(c){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case y:case pa:h=!0}}if(h)return h=a,d=d(h),a=""===m?"."+
N(h,0):m,ca(d)?(e="",null!=a&&(e=a.replace(da,"$&/")+"/"),B(d,b,e,"",function(a){return a})):null!=d&&(M(d)&&(d=na(d,e+(!d.key||h&&h.key===d.key?"":(""+d.key).replace(da,"$&/")+"/")+a)),b.push(d)),1;h=0;m=""===m?".":m+":";if(ca(a))for(var l=0;l<a.length;l++){c=a[l];var f=m+N(c,l);h+=B(c,b,e,f,d)}else if(f=x(a),"function"===typeof f)for(a=f.call(a),l=0;!(c=a.next()).done;)c=c.value,f=m+N(c,l++),h+=B(c,b,e,f,d);else if("object"===c)throw b=String(a),Error("Objects are not valid as a React child (found: "+
("[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return h}function C(a,b,e){if(null==a)return a;var c=[],d=0;B(a,c,"","",function(a){return b.call(e,a,d++)});return c}function qa(a){if(-1===a._status){var b=a._result;b=b();b.then(function(b){if(0===a._status||-1===a._status)a._status=1,a._result=b},function(b){if(0===a._status||-1===a._status)a._status=2,a._result=b});-1===a._status&&(a._status=
0,a._result=b)}if(1===a._status)return a._result.default;throw a._result;}function O(a,b){var e=a.length;a.push(b);a:for(;0<e;){var c=e-1>>>1,d=a[c];if(0<D(d,b))a[c]=b,a[e]=d,e=c;else break a}}function p(a){return 0===a.length?null:a[0]}function E(a){if(0===a.length)return null;var b=a[0],e=a.pop();if(e!==b){a[0]=e;a:for(var c=0,d=a.length,k=d>>>1;c<k;){var h=2*(c+1)-1,l=a[h],f=h+1,g=a[f];if(0>D(l,e))f<d&&0>D(g,l)?(a[c]=g,a[f]=e,c=f):(a[c]=l,a[h]=e,c=h);else if(f<d&&0>D(g,e))a[c]=g,a[f]=e,c=f;else break a}}return b}
function D(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}function P(a){for(var b=p(r);null!==b;){if(null===b.callback)E(r);else if(b.startTime<=a)E(r),b.sortIndex=b.expirationTime,O(q,b);else break;b=p(r)}}function Q(a){z=!1;P(a);if(!u)if(null!==p(q))u=!0,R(S);else{var b=p(r);null!==b&&T(Q,b.startTime-a)}}function S(a,b){u=!1;z&&(z=!1,ea(A),A=-1);F=!0;var c=k;try{P(b);for(n=p(q);null!==n&&(!(n.expirationTime>b)||a&&!fa());){var m=n.callback;if("function"===typeof m){n.callback=null;
k=n.priorityLevel;var d=m(n.expirationTime<=b);b=v();"function"===typeof d?n.callback=d:n===p(q)&&E(q);P(b)}else E(q);n=p(q)}if(null!==n)var g=!0;else{var h=p(r);null!==h&&T(Q,h.startTime-b);g=!1}return g}finally{n=null,k=c,F=!1}}function fa(){return v()-ha<ia?!1:!0}function R(a){G=a;H||(H=!0,I())}function T(a,b){A=ja(function(){a(v())},b)}var y=Symbol.for("react.element"),pa=Symbol.for("react.portal"),ra=Symbol.for("react.fragment"),sa=Symbol.for("react.strict_mode"),ta=Symbol.for("react.profiler"),
ua=Symbol.for("react.provider"),va=Symbol.for("react.context"),wa=Symbol.for("react.forward_ref"),xa=Symbol.for("react.suspense"),ya=Symbol.for("react.memo"),za=Symbol.for("react.lazy"),V=Symbol.iterator,X={isMounted:function(a){return!1},enqueueForceUpdate:function(a,b,c){},enqueueReplaceState:function(a,b,c,m){},enqueueSetState:function(a,b,c,m){}},ka=Object.assign,W={};w.prototype.isReactComponent={};w.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
this.updater.enqueueSetState(this,a,b,"setState")};w.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};Y.prototype=w.prototype;var t=K.prototype=new Y;t.constructor=K;ka(t,w.prototype);t.isPureReactComponent=!0;var ca=Array.isArray,aa=Object.prototype.hasOwnProperty,L={current:null},ba={key:!0,ref:!0,__self:!0,__source:!0},da=/\/+/g,g={current:null},J={transition:null};if("object"===typeof performance&&"function"===typeof performance.now){var Aa=performance;
var v=function(){return Aa.now()}}else{var la=Date,Ba=la.now();v=function(){return la.now()-Ba}}var q=[],r=[],Ca=1,n=null,k=3,F=!1,u=!1,z=!1,ja="function"===typeof setTimeout?setTimeout:null,ea="function"===typeof clearTimeout?clearTimeout:null,ma="undefined"!==typeof setImmediate?setImmediate:null;"undefined"!==typeof navigator&&void 0!==navigator.scheduling&&void 0!==navigator.scheduling.isInputPending&&navigator.scheduling.isInputPending.bind(navigator.scheduling);var H=!1,G=null,A=-1,ia=5,ha=
-1,U=function(){if(null!==G){var a=v();ha=a;var b=!0;try{b=G(!0,a)}finally{b?I():(H=!1,G=null)}}else H=!1};if("function"===typeof ma)var I=function(){ma(U)};else if("undefined"!==typeof MessageChannel){t=new MessageChannel;var Da=t.port2;t.port1.onmessage=U;I=function(){Da.postMessage(null)}}else I=function(){ja(U,0)};t={ReactCurrentDispatcher:g,ReactCurrentOwner:L,ReactCurrentBatchConfig:J,Scheduler:{__proto__:null,unstable_ImmediatePriority:1,unstable_UserBlockingPriority:2,unstable_NormalPriority:3,
unstable_IdlePriority:5,unstable_LowPriority:4,unstable_runWithPriority:function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3}var c=k;k=a;try{return b()}finally{k=c}},unstable_next:function(a){switch(k){case 1:case 2:case 3:var b=3;break;default:b=k}var c=k;k=b;try{return a()}finally{k=c}},unstable_scheduleCallback:function(a,b,c){var e=v();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?e+c:e):c=e;switch(a){case 1:var d=-1;break;case 2:d=250;break;case 5:d=
1073741823;break;case 4:d=1E4;break;default:d=5E3}d=c+d;a={id:Ca++,callback:b,priorityLevel:a,startTime:c,expirationTime:d,sortIndex:-1};c>e?(a.sortIndex=c,O(r,a),null===p(q)&&a===p(r)&&(z?(ea(A),A=-1):z=!0,T(Q,c-e))):(a.sortIndex=d,O(q,a),u||F||(u=!0,R(S)));return a},unstable_cancelCallback:function(a){a.callback=null},unstable_wrapCallback:function(a){var b=k;return function(){var c=k;k=b;try{return a.apply(this,arguments)}finally{k=c}}},unstable_getCurrentPriorityLevel:function(){return k},unstable_shouldYield:fa,
unstable_requestPaint:function(){},unstable_continueExecution:function(){u||F||(u=!0,R(S))},unstable_pauseExecution:function(){},unstable_getFirstCallbackNode:function(){return p(q)},get unstable_now(){return v},unstable_forceFrameRate:function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ia=0<a?Math.floor(1E3/a):5},unstable_Profiling:null}};c.Children={map:C,forEach:function(a,b,c){C(a,function(){b.apply(this,
arguments)},c)},count:function(a){var b=0;C(a,function(){b++});return b},toArray:function(a){return C(a,function(a){return a})||[]},only:function(a){if(!M(a))throw Error("React.Children.only expected to receive a single React element child.");return a}};c.Component=w;c.Fragment=ra;c.Profiler=ta;c.PureComponent=K;c.StrictMode=sa;c.Suspense=xa;c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=t;c.cloneElement=function(a,b,c){if(null===a||void 0===a)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+
a+".");var e=ka({},a.props),d=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=L.current);void 0!==b.key&&(d=""+b.key);if(a.type&&a.type.defaultProps)var l=a.type.defaultProps;for(f in b)aa.call(b,f)&&!ba.hasOwnProperty(f)&&(e[f]=void 0===b[f]&&void 0!==l?l[f]:b[f])}var f=arguments.length-2;if(1===f)e.children=c;else if(1<f){l=Array(f);for(var g=0;g<f;g++)l[g]=arguments[g+2];e.children=l}return{$$typeof:y,type:a.type,key:d,ref:k,props:e,_owner:h}};c.createContext=function(a){a={$$typeof:va,
_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null};a.Provider={$$typeof:ua,_context:a};return a.Consumer=a};c.createElement=Z;c.createFactory=function(a){var b=Z.bind(null,a);b.type=a;return b};c.createRef=function(){return{current:null}};c.forwardRef=function(a){return{$$typeof:wa,render:a}};c.isValidElement=M;c.lazy=function(a){return{$$typeof:za,_payload:{_status:-1,_result:a},_init:qa}};c.memo=function(a,b){return{$$typeof:ya,type:a,
compare:void 0===b?null:b}};c.startTransition=function(a,b){b=J.transition;J.transition={};try{a()}finally{J.transition=b}};c.unstable_act=function(a){throw Error("act(...) is not supported in production builds of React.");};c.useCallback=function(a,b){return g.current.useCallback(a,b)};c.useContext=function(a){return g.current.useContext(a)};c.useDebugValue=function(a,b){};c.useDeferredValue=function(a){return g.current.useDeferredValue(a)};c.useEffect=function(a,b){return g.current.useEffect(a,
b)};c.useId=function(){return g.current.useId()};c.useImperativeHandle=function(a,b,c){return g.current.useImperativeHandle(a,b,c)};c.useInsertionEffect=function(a,b){return g.current.useInsertionEffect(a,b)};c.useLayoutEffect=function(a,b){return g.current.useLayoutEffect(a,b)};c.useMemo=function(a,b){return g.current.useMemo(a,b)};c.useReducer=function(a,b,c){return g.current.useReducer(a,b,c)};c.useRef=function(a){return g.current.useRef(a)};c.useState=function(a){return g.current.useState(a)};
c.useSyncExternalStore=function(a,b,c){return g.current.useSyncExternalStore(a,b,c)};c.useTransition=function(){return g.current.useTransition()};c.version="18.2.0"});
})();
               �u�8�w���}A�+=���HPYwP�yL���B��?469
�&�����^��WhŦ���npź�V]-p#q��@nƋ��ta�6�(�JF��[W�9�.�;�K��S\aW�/.�����R��|1vܢu�|$�̼�gl��ټ���"
^��v����g1���H�:RE��z�p��$t�&��f����ea����E�Vl���S����Uc�Uj��g�jJ'��{��5u�t����C7�%�kl���fV��Z'�Q���Yn���6-�]>$3q���iH���gkOWx��.��k�j����&��f�|R°�qn��5%��d��%��6t��]��Zh%����5uR��L�|��
� �dq�5ư�Q�󗢇g�w����^?�'��~�G��/�mu͕�j�\��酲E���+$|�TKizǔ�e�շ���/�ʢ�ҴI�Lp^ �a�qzUk�i���W��&e~�#�]3��~��2]��2�	dpKϬ����2'� ���Ո7�k����?|���܌'^��Jj��#�S���?�i,M��8[���
kW��R�v/�N���PK�����^c�x��ni��@u8�'ȣ���;��� ��l��S��G��1+r�9�7,���;cU3y�õ�@���6�f�����{IY���f���J�PN��l"��u�{�x�AX�v9���kICϖ�L�[ݝ>|=b�E�;�Fvu��o�5���V�G�Nv_Sp*�T<|�D@F��\�c�=~�y�⬈�	+�=�h�Sűu���S2l	)����H|�c�D�M�U=�y4gHl�TJΣ%ʹ�n0Z\PWZ^�Hl�!�S��ʋ�eu�z���F��ɪ$��i�9�ղ^o&���p�5Ys���{ɽT��c`쮻"E$�c�w���[g�U4v%��������2����&ז�s-�������0�''�i��ňc������Ws�[ &��㲈��0�,�.���Z�xP�&���[�C�
�j'��w��$�3���gu�*���M	
�{�6����~�@��<��Q��ǫnP��O���HLP*̰]oS����q�c������86!�t�әK��;���p��C�5��CPc�i࢛͡��A�$�SEQ�����%�9~���$��)0ۜ�����~�I���d0d��i�E��u�1���T��o��3Yo��`��j0��o�l�mL�t�b�>쇕����՛�}넄�w��\33gF��3�0h���	>5�,fγ���h�I�|�u-�7�57������F�BQ��?���r���6�v'~��{���_�vCp5��Cf ޲���j�$M���0
�P�֌�tcQԃr�M?@�cɇ���K}�����Ņ}�2�inBR-��O�2MWT3Q{`�Y�]}���_bSI�B�^St>�
��\)]7a~q��=Y�1�l��J�B5k��Тiq���ܗ�V��:����%Q����\���k�kЉ������ �?MT���4	g��!�x�q��ΝO���$}�:����u
�^��	8�_x�2�)�f����ͼ5S�l�7l�Zn�w	w���'�h�J;0<�%��zS�w\��F2�����ܲn�$���Xp蹩cC@f����R��{g�¯C�����D���7�aEJ��5�j�������ʥ�-�_"��!��C����Z�0��!׮ZC��1H����Ća?���hh�M�|���ԧ��.��bOr�[]�/�"t�4�NO��Lб�:�+F�d��p���e�:�8�{�vcP�܀�� ��D�5��AsT�h��M��z��?�q8�Y�B4�]�Uu�]���a���h�TI	��Ggd�'[0�3����"IWuC���`�
W�̚��,a�c��m5�.��/B��Z�9el��E�9v?S�n�SA�d�ͣ�|�=L2g�Ay�:���A�&�"v����Ҟ��Ry�����+l>SKYn�U�lp�[L��T���q�׏'^��+���+�|����-'\��?������/�Y��ֆ���`h��	�B�/b{/���W�t��]z�+4�aR?�Xd����]%}���<)�h�x���GE�k��&�M��S�?Z��]z3NKa ��y�{��vu�K�{߿�:����.9.��@�)�2�>�Z�!d[F׻S�̨�9�r5�z2]E�'<�L���|v+�sp�3�%����)���3BW����\[�tP���_
�Eڦ����=���C�K��m�j�T�ˏzJ�*N��˕�%q�?q$�D�wT�� x55�4Nm3o4<���އjv�@�_4�Z�m����oJ�~��b��ήpċu;)�/�-�c�����q]H��C|�]��|	��R����.�0"@AA�A����w��� ���F��NJ��JL�Ǝ!�,B!�������#D�C�u@�&=
Mꆈ)�y�>�3S�y�"[�;ᯇ	�1	E��_
�.? ��12�;0,<���G��/����H�
��mX�zb �㶛���s]G���\����j�8�oy�I&����(�L�n�UG �����F��|	�W�V�{h�%�-�����y���YH<~��1؜jҧ�N<i9g��,�!&����������e�|��QG��b�+�W�����Nw>L�@?Ђ>�K98�g����S-	�.)�J5�z*���a��.�M��jcj:`ɒ:�HO;GJt�ůV��������,��vM&.��kP�!�4�^�h�G����DI�����es�A���O;ϡ��j�#W�$��"ذ�����M����N�h8���M
(���
 p�4j������!rZ[(L'3���qX(��� d�FK�B{��Хcy$L��ɜdB���~�ԯi��)հ>qѩu��P�)�,.��:&��0�_y�Ƚ�7�����������t�ӹ˓��v�~�vƗ����t��s;�ǆ�3Yyy��7�O^�e�K�����sf�/)&~M�n�Q��
\O g8���C��F���^���sS,,�U��\]&�ɤ$�q�ܪV����m9:�k�X�Z7d`s
9��-rkeO}
(���Gb#����,C�S�3g�Uk�3'r�y�/��m�����9ii�O�z��V?�����c�P�J"���u�e&����F
G�Q����x������6&|����̄��x�fL�%"��>��I����0���=��z���FT��)+�o�4��:e�X<u��[�Xwi����i���y�,9�r�1��]�t���L3��F~�z�d�Q��=,~͉9^k"���Y����_��C�+V4Ik$y��c�2g�ްݬmM78��e�8&���+���g�M�iY��3��EP���lV1����[yˢ��z;�.�%C�1"_�0�l��n�G�P,��jm�P~�&_���v�6�$پ�o
���t&7�L� ~0m���d�J�U�O4���c��n�����.�F�P���ӕވ�=V��N��bݠ�G���F��j��Vk�AH*ʘ���>�=�9�k���9b��CY���/�DJ����7̉b�7j$����0L����W���'>�S�76���˦�@��f�uz�dj�?�.&��H^�7Wp`�2�G�׃�)~m�>�����l�p2�Nb����-T6Er'bC��y���˧��|%�D��W���q嫨�c�0N餑�`�5��҆&h�^�į&*6UC8I��>�bT��_�)�i07�*�.�W��ߦ�#����Z<�&-��(��!6m��$*���pzcay��<��!�s!�mxQ*�>�]"#����V�[&S�m��t��#��	������+��P*�t~���;\��5�}��7�ӏjAz�}�*6��CcL�9MR�&A�;�;d�W�]k֔>�.���p���M�yՀ�R5�I�i��0�9���ĳr�P���2ߡ���W���C3��"�`�>�K3�����*}��Dj�
V��l��$d����)Oxi�!U=`�n����^v"ɾ�̫����m|�:<�����Z�p�::�f'�RȞW�yP��q�j ދ�i]"��l&�FL��.a52Gm�Zk�^q܀�~z���hӟ9S!k���c
���-���T� 1ϫ��Z����)�g4���ɝ��tu�+�   "appliesto": "allElements",
    "computed": [
      "font-style",
      "font-variant",
      "font-weight",
      "font-stretch",
      "font-size",
      "line-height",
      "font-family"
    ],
    "order": "orderOfAppearance",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font"
  },
  "font-family": {
    "syntax": "[ <family-name> | <generic-family> ]#",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "dependsOnUserAgent",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-family"
  },
  "font-feature-settings": {
    "syntax": "normal | <feature-tag-value>#",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-feature-settings"
  },
  "font-kerning": {
    "syntax": "auto | normal | none",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "auto",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-kerning"
  },
  "font-language-override": {
    "syntax": "normal | <string>",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-language-override"
  },
  "font-optical-sizing": {
    "syntax": "auto | none",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "auto",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-optical-sizing"
  },
  "font-variation-settings": {
    "syntax": "normal | [ <string> <number> ]#",
    "media": "visual",
    "inherited": true,
    "animationType": "transform",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-variation-settings"
  },
  "font-size": {
    "syntax": "<absolute-size> | <relative-size> | <length-percentage>",
    "media": "visual",
    "inherited": true,
    "animationType": "length",
    "percentages": "referToParentElementsFontSize",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "medium",
    "appliesto": "allElements",
    "computed": "asSpecifiedRelativeToAbsoluteLengths",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-size"
  },
  "font-size-adjust": {
    "syntax": "none | <number>",
    "media": "visual",
    "inherited": true,
    "animationType": "number",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "none",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-size-adjust"
  },
  "font-smooth": {
    "syntax": "auto | never | always | <absolute-size> | <length>",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "auto",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "nonstandard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-smooth"
  },
  "font-stretch": {
    "syntax": "<font-stretch-absolute>",
    "media": "visual",
    "inherited": true,
    "animationType": "fontStretch",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-stretch"
  },
  "font-style": {
    "syntax": "normal | italic | oblique <angle>?",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-style"
  },
  "font-synthesis": {
    "syntax": "none | [ weight || style ]",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "weight style",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "orderOfAppearance",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-synthesis"
  },
  "font-variant": {
    "syntax": "normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> || stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) || [ small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps ] || <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero || <east-asian-variant-values> || <east-asian-width-values> || ruby ]",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-variant"
  },
  "font-variant-alternates": {
    "syntax": "normal | [ stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) ]",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "orderOfAppearance",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-variant-alternates"
  },
  "font-variant-caps": {
    "syntax": "normal | small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-variant-caps"
  },
  "font-variant-east-asian": {
    "syntax": "normal | [ <east-asian-variant-values> || <east-asian-width-values> || ruby ]",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "orderOfAppearance",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-variant-east-asian"
  },
  "font-variant-ligatures": {
    "syntax": "normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> ]",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "orderOfAppearance",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-variant-ligatures"
  },
  "font-variant-numeric": {
    "syntax": "normal | [ <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero ]",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "orderOfAppearance",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-variant-numeric"
  },
  "font-variant-position": {
    "syntax": "normal | sub | super",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-variant-position"
  },
  "font-weight": {
    "syntax": "<font-weight-absolute> | bolder | lighter",
    "media": "visual",
    "inherited": true,
    "animationType": "fontWeight",
    "percentages": "no",
    "groups": [
      "CSS Fonts"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "keywordOrNumericalValueBolderLighterTransformedToRealValue",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/font-weight"
  },
  "gap": {
    "syntax": "<'row-gap'> <'column-gap'>?",
    "media": "visual",
    "inherited": false,
    "animationType": [
      "row-gap",
      "column-gap"
    ],
    "percentages": "no",
    "groups": [
      "CSS Box Alignment"
    ],
    "initial": [
      "row-gap",
      "column-gap"
    ],
    "appliesto": "multiColumnElementsFlexContainersGridContainers",
    "computed": [
      "row-gap",
      "column-gap"
    ],
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/gap"
  },
  "grid": {
    "syntax": "<'grid-template'> | <'grid-template-rows'> / [ auto-flow && dense? ] <'grid-auto-columns'>? | [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'>",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": [
      "grid-template-rows",
      "grid-template-columns",
      "grid-auto-rows",
      "grid-auto-columns"
    ],
    "groups": [
      "CSS Grid Layout"
    ],
    "initial": [
      "grid-template-rows",
      "grid-template-columns",
      "grid-template-areas",
      "grid-auto-rows",
      "grid-auto-columns",
      "grid-auto-flow",
      "grid-column-gap",
      "grid-row-gap",
      "column-gap",
      "row-gap"
    ],
    "appliesto": "gridContainers",
    "computed": [
      "grid-template-rows",
      "grid-template-columns",
      "grid-template-areas",
      "grid-auto-rows",
      "grid-auto-columns",
      "grid-auto-flow",
      "grid-column-gap",
      "grid-row-gap",
      "column-gap",
      "row-gap"
    ],
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/grid"
  },
  "grid-area": {
    "syntax": "<grid-line> [ / <grid-line> ]{0,3}",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Grid Layout"
    ],
    "initial": [
      "grid-row-start",
      "grid-column-start",
      "grid-row-end",
      "grid-column-end"
    ],
    "appliesto": "gridItemsAndBoxesWithinGridContainer",
    "computed": [
      "grid-row-start",
      "grid-column-start",
      "grid-row-end",
      "grid-column-end"
    ],
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/grid-area"
  },
  "grid-auto-columns": {
    "syntax": "<track-size>+",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "referToDimensionOfContentArea",
    "groups": [
      "CSS Grid Layout"
    ],
    "initial": "auto",
    "appliesto": "gridContainers",
    "computed": "percentageAsSpecifiedOrAbsoluteLength",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/grid-auto-columns"
  },
  "grid-auto-flow": {
    "syntax": "[ row | column ] || dense",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Grid Layout"
    ],
    "initial": "row",
    "appliesto": "gridContainers",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/grid-auto-flow"
  },
  "grid-auto-rows": {
    "syntax": "<track-size>+",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "referToDimensionOfContentArea",
    "groups": [
      "CSS Grid Layout"
    ],
    "initial": "auto",
    "appliesto": "gridContainers",
    "computed": "percentageAsSpecifiedOrAbsoluteLength",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/grid-auto-rows"
  },
  "grid-column": {
    "syntax": "<grid-line> [ / <grid-line> ]?",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Grid Layout"
    ],
  var List = require('../common/List');

module.exports = function clone(node) {
    var result = {};

    for (var key in node) {
        var value = node[key];

        if (value) {
            if (Array.isArray(value) || value instanceof List) {
                value = value.map(clone);
            } else if (value.constructor === Object) {
                value = clone(value);
            }
        }

        result[key] = value;
    }

    return result;
};
                                               3�Bo5��R�+سj��-��ٮ�!7}eR5|�+��"�^��m7���~t�����u�r4�>�)�2�m,{R}�]0*$�Fzn�����hZ���0�,�!3ݠ ��M���D_,P�>�T�<L��_
��ퟜ��d�rד��# ��P��A����a�Q�+Wӓv�.O�{Y������)vZ,�U���6#�Ul0B��\8�4G����)������W�г�!́��H�*7.���pX�����[!�a�ԟQ7�a^�8�o)^�"&��r� �m���]*��w�@
�\�ʉ*�x�Y��*�A��5��j�5]1�����h�}��m%/�� �M�sӠ8)	q^�"V�^��eWh<rd��R��ɽ�5 uJ?4�.�]s68�&�}V��}T2f��䙧E���^?��ʉ��SW���6\N1�����7,�W�e���9Xr�]m݃��޺.���<�ü>r����Q��W˰�X����^7���r��
m?)aa��r���f�{����#c���.�n�&K�Ie1���"R�#�b��ܑ�Qv���П��p�|v�/rHC7�f�å3�J�#��C�P��D�r܀���l���n)㑖ޠU��o��Y��	��R{A�|�K�bh3<q5|�t�Ԉ��+�@U6���t�4����ȟUw�2s��`�G_9���%�`����Jц�>�t�yJ���T%�]܍"%�*s�]^����:\�
�"�	���s�,���HK��	�-o'����@)QaV��*����j���#�0/$"wg9���NJ��޼�'�JQ��*Ao�(�e�c�0�������[�iI!�nƦGunХ�ź�H��u���R��� (����%�s	�5"��92����������>Ex���R�n��$i#���=�GJ���\**�|-01��� ��䭳9�����9�%�*1� ��$��,j�.=A.{�1������pި�P��#zC�hx�4l״Sг(O Gnp��
$�0���R��e�O�V5�6��U�(��UV�\�ɿ
��o��C����w�7"���.x��W�����Jm��ۼً�gX\*@}E-|�@
��H�6� 0��o*��Ae�D�0?���J�f�~�!)0F�I�͹(��Gոy�G��+�??	xlvw�:s��u��`Bp0�������~�jD��*B7�s'��#�*�&�@/�-x��mzT@ꓗ�#�T��q��
�R���Q�Ut9��'V�С�$5#��LKw�!Zv�q,����򓠼4�eA�@�5�ppn�������ޥ�}��ԟi�."�Qp�й΋2�pI��0�8��ZY�^�M�!{�{���f��5<�P60��c�MwW�Dǻ�1��x$T"�'��W�e�xf)[��׍�r�ޒ�L���i� ����!�2u&��&
��+I<0f�i�욗r��,8
�*THO��4P#�m��$$W���(�9����f���(r�t1�ޞ �#�S@q������[Ǒ�&�/�vP�y"|(���q5
�r0Ss���vV��r�Bx�YT����+~���N|8k��u�5C���H����- ���pT��%*�S�ҖV�$�(��ln)�T��w<(c�O�ڈ��t���Q;/�-j�v�S��lS���[�u��Y�4Z��c�q1x�u����&̶hZ`����%	�w�]���x#a�NyT���IQ�T��#ʆpe��Z4����]�>l�I�
նq�Ҥ��{������#͹�+n�w�)gOAx��Up�m|HH�����E��..H��FZ!fo��|OӲ��0�oF��U���p��?}�Yd���W�,����e�9^L֘?."=�fU{=zjz3*�Lu�vΫ�wKI�u�蘘��.�p�*�~�!;�����_��ԑ�?�1�ċ��w�����%{:/�}	n�D����'�v�+�z�'��>�wZI?/��-��j�=J�
s��nx	kr(#K��r�ݻT*��u�U�Ξ݉�v�Z4*�OK��Հ��R��k�H�B���ls��#�M*�M��#"���F���"/���d�,�r���>k,*y��q����\g�B�r����������(L�Î�t
�!�)c7��<D5�O:̢nȘW/q�܅���Nn4�t��`��s������1�)w���
��K�
r]Au��pv����)=ぼ,d�(�p��	C��+~����_Q���wt��j�H�.'�a�E�>�#X>=&�zӁ߽�R�v�5��.j>CGL��}�ߟ�#�b�$[7Քa'�]�
	����Q�f<�jF�1X�� &J-��R�
���>"�"k�&.�	>�P&ǜ���������FIsV�k���`c�^���I�>��6�K�Q�~P��Y^��H
�S��pB���P6M|�j�����
f�%5Ig���{C:�Do�,��y�:��!���ۑ�2�=2F���
�aD��W�(�5�ָ�",k��9�(�Y���e�w�r�T�i�=)n<~ђ��D���&�h���+5L=�=H�5�U��u����\7m/�-�ZDK
-�*�q�B;��8��
���<.�U1+h�^翉 ��UȻU[@���1?���;P۵Tɽ����98�n�a��;Y��	V��
���ǫS�f��N�l��s����dx�'���
`�T䥊�߾��O�Գc>�Y���5"=��%.�c̆�U�WG��b�`_(��t���/c���Mu�(0����Ǭ���#bv<��յ~O�N��D~1h��>܅��s��}�F`b�	�P.?��6�p�e'�r��J� �~��ʿCmE����u0����G
�����`���&�'��8���j=�+���d�Y�G�Z��2�v���0�P ���
.m��٢sh�ه�"�2[U��%!۱OS��:o�>k ��3`���%������`��'�7 p=�
̹wN�A�Z�Z������A~P�;߄E9��R<R���z�S���]S�?�N�w��oT3aT6�Pq��c"���	�Om
D�kb��ȏ'����v�'%�)S����fMO
����Uq�/�IL�f��F�ҫF�ʟ�R�~�L_�Ǵh�nZ#<sat.El�#gw�
j��I�΍���s��t�P�=d�Ps����j�e��&%�u@{�E9lS��I{�k�Dmٞ�l����8�~~B]�e�n����
K�i4[o�29�7�����ֆy�����\�X�6��e"�C�Y�ڞΜ'�mG�v[;e�y�w�o�E��?,�7N�m�&1����rn��|��Y��>����]9O[�L)�R�~(��c���-�Y?}���Ë�Ե�g.1�<�����R�oJ���k�Y6&�n�{5���H��g�sI�����"�����E\n�m��hMOT�[vZ��[5�	(��,r�����a�ͮ�Y�:9�LE9q��!(S�Q���F���t��O�F�`_6Xjџ�"�p���`�J	����?�;�<��f�/2�����[� |I9%%�\��2�b���)ks.c�?�
����l]����6��[����D)���S�e��=���
��B��a�vҊ�^����t7�%�U:��u�6��:Y�T6,i�������]�x�y�
�1`�QyBa�H%|�_?�v�����ݥ�UT	�T�6�-,��+/23��HZ��[��^$ä�(<��y���.:�J��3h��3��zuo%���/�,p��V�DH
c ���\�k8�� ߕ�1ZnQb$�S����t�5�hO��K��bɇH��-lQR�����E�x��OU�b]����916YݝU��)�"�
�b ܡh�#�[�]��l�Fv]��I�������
5	�~ 29�u.P�`�*�F|8GJU����V)d�]�D)qK�oFZ��i����^uT/�Ŏ�%؆U{c��J�!B\��SXY	z)ܮ�V1f��X*��)/? ���� n$\Sf�A�uW��-�,���������Yӟ�#��xB20?�i�&Q��g���/��uą�C��ǡ���U]�P����g
e�K�ƑK9�ܰM��r��p��ϽB�BQ
��Y��}��%���#&C�b�E��-/��2rU���6g�|
ҥ��-߲mk�m۶m۶m۶m�v���K��ω>���Wy�"2�Z3Ƹ����v\�l!M-R0z���=Wٲ�ڤ����GͤZ���LOʶ��!5)?��'�i"A����z�w�|T57w禚.���4�Jv$�]͛�|��(��}
��x�R�ؓ�^��O����G�����g*n����"����^D��� ��Sye"���',��Fb��ˬ�I����U�T/l�Ө�<[6���
O��]���j(���yDE�J!,6�T�^����6U@�md�:l�Mʓ�(�	�j⛋R�8�Y�}(��8|��AGj��3�-�*�NSם�K�r�5��I���{�:?�Š#km�nT�E�NɄ�yP�R��F������8��F%GZ�e�_x�� Ϧ#�q/�����\	/��;�jr���A�WE�A?�%r!X�F�"�׌��#�j���%A{e��YL��V��U����{�w9<0���aIuR�"���D�
!���m��cN�_RV���/�YL.���d3�2G[�!�1%"E��ͮ�7��P(�2ge欝���ڶ¼hͺlO�g[��;�B�h�@~�4:VǕ���]6��jA=n�c�.V�n�D�}�S�Λ,s��tG	���� #���uc�G�;�b(�\M�9+�+<��0�|	��Oe�.
n�qr��M�T1�1��Ӥā�L
�W��D9�'�`L����7(nj 2a��h��$��ʭ��<C���!ˇy�»����3�^�R7���!� ����Уຨ�q�ԞP��^����a�ϔ!�p��u1���z�*P��\$�#|r���K��L#fh��Q����&��) �� ��� }M}����ө�(�e}�)
��v���(:R���&��X4b��i�Sr�4H𕜠��l�y�wq$��&���n8`8�4�EU�	eQ���I|m�ƞ!59�l�M^�V�1X�&P���k6�m�
��_ �hN�J&��"mN�j~�.�Sd0�T�Ip�Z�x��@��ٍ�auȤh݈Z��'�cV%�U�'U:^�G��pM���:B��ʈ�W�Q��)9�<��dG��j؀*'1
^q٬AæWeOEͥ��5�I��hp׵�8�ª��eT��M��&ǉ�&Yd��?�"=!�69�[�O�.)�k��34�{�/ɛ2��ߠ��E�
o�V�,h�i�I���ʜXl�,e=O6��j�/P-��W'Ȥ����{����8d1 �|���_�!R��ge]����D�Y�7=���'��Qْ"*��AA�d��E%R������cfZ�����1iO��ּP��uK�4���袱�{V���F��͂���Qt�0�_�����	��a	���@@��u�*�-u!��B��R)�q��A��P��E�l����a��F̡C�(s�n�\��ȫ붨b3�B���D�y���8
ޔĤޟT)�D�6�,�J4�W��#9x5x�"�L�U(JQZE�d��RE����EaW�p�IP"&��]��f�Dd�Bh�m;
�Y�a-�PՀMڴ<��t�w�ۼ3�A5o�x�;j�ܑ�:�������Mg�Y��T�H{��>�d=
<��� ���'��n����Y�+��e��f�Z{c�g��+����p�`U��I{LЏi0u���<�UtD��6�w�-"�\�V��ڰr�iǢ�%��×FR���rn�"_)2�J.#�"Qo,��،W�.E��O��Wuc^��?��_�
��9q�E>�i`ɫf�GxY���I-�'xȚ[�ANI��F��Q�n���)�y��I� +T�ųj�@Uy���Z�2��BB*؀%[˜���=Y���˂�j����q�+�.P��,�+�A��O}��'Un���r�פr��:ƿP��X@��s���@V3hD�"����)ɟ��h��G�T3�9s�X����4m�P�2��� :J�!2Ԍ[,����u�"Q�,-j�ӳ��R�ey�:��/���j���h��h�0��i3��Y���A@��h}��
��nR,F׵DV���y�=�R�_#�.����e�:�A�wlW�8!l����Z�&<����]���м@=�}�T��b��y^b��M���?�^�1|�3vT����9��Ө�l�I(�B� Î�^)�Qaӏ�9�v5PR��4����,�T5�~�7G��ּ������EE���`����ʤF�x�e,��t���OH)�m>)d���2���Gp1�P�O�^�������+Տ���~�m^�+��DȺG�d�I�ʅ��e�"�\$eL���C�6d�o� =��~
�Y�I�OX��A��*��ͨJ�Mq�8�Z�XȆ�l[�u�j�Ġ�8)�����jaW�6�V���u���Q��%CGQV}42.�x�U�����U5�^u�Ȩ�w���J�%!Z�J��\h6�D9���02\�A���)���F]�霗1��
�O�m֫*�ʦ���B]�JkS�Tˀ��/,Q	%T�U-��ת���0���_΢G��R��+N�,RQVٱ�:t/1Ց:�
wp���|�L)�f���dTW!"D1�v�H���k�;�Ϡh��/�_��Oe�nN�Y�
J�A@ت����qs~�g���˿�H��1�Y�`䉣�;��#
$ẠX�"V�����"g�Fp�Y8�7�t�ӿ# 
D  ����� ��)}@ $"FAEC�@������������	j�'
�Sz徠7բ�T��k�-K
�[& �q�B�R'h�Q����Ql��_$4hb����?��%���՛1���|4�NG�̂�UHSY)���Giņ�������
��74��-�*�rG���F���Nr�zj��J��$�j���������e�t��S"��FT�?���Y�4���j�������ю|��24�R�R:��75�3�
���e��-�����������z'�����'���>PnQ��.���gMYŎN�sK�`��۔a�(���a1}/�+У��H�.���[��IJn$�.���c��M�S�)+�x��gH�K@_�~"����ҩ�ְ=/�}p���&��eN���B]�꽔�pcɗ�_��m����!�9^w)�:"�2�g[�W����*�F30</X4��Qp������۞�k�h�� ��
�k�7��/`2��ʵ�_h�2�5�T�/ B/��xA (KӊJ������0�4ͺo�/){�
�<b`��(`�k�	�p%�!�3�.������xd&7Z�ה����i����/�i�V1-轘�`�qb���j����%0i��D,�$�{ЬA�f||Gv�`����W�`�P�� fGk�q��t,v���8�k��*2�E6��-����9}���WY�A���_ ���NzogǑN����I!`[��UR����P�^g&��� c�M�AH��M��ͦv��^��x���-YlM�D�s����(u渺D�&ӈ_h��%��"����PE;`O7�N�-�;���}�
�C��	=��Ú��sf<�����06���9��C��~Gut��-�Q�	a�d�-�1^ -��{�I]��pu�0/�yh��%g���#-U\����d_��t�T�xn3�㼩�x׺����&Y������8-��x�\M��ɕcC5g�[�Z�7G�´������/@!��^x����F�i�(�iV�|zF7q;���uׁ�l�-0n�靬��^�^ؘ
���idu��P�J�oQ_�gȭ��3��#��=
'�����t�����]�'����#Pb�E/�H��=�Ġ�"e�CՈ�DmQmF6��#۷ą18��z7���.e�p������.K:����>װ$	,�	�]p5����%�9kκ��X���he�heE���gT�{��:�M�[4���� ����+�	�q/d�h6���s���� 0,\�H}���}o�]S��ѡ�p������ �E�}S�F�1;�f�P^�fd�Ý�i���W��1K0��?נ]���O�@i�?e�/�,�X�y�SD6����	.s��� �Vx�X%��i������3�rC+����a,a�.�}�d��WƦty���!f�QP�T{�^Uf\���/l���ُs�)-j��E��x;T�Z���~^��&)Xŕg��T1IEւ���@EA�����5ꔏ��9z�ha+WR�%�o��:����L�F�,�]C�`���Y�{�O��3�t'1v��<=ɔ��_)X��R&<�)G����&TlM����K!:Uv�QQ}�a�Y)ӆ&��D��N!���V�����?�<x��Gr�	l��-ez�f�:ڦ۸Y��w�L�Y8��zh��t����FO�DZ���Xm�nY���jع��5=�_�~{!=�tce��o�&�_�뵫��5�vx�[�J�X�����vP0R�V�x��3�i�6�3GEW�H>s�~ߣ튦ZMǙit��uhM�T�5�^k �EK�+TV�wp��tꥹ���򲀰mo3�ª�5�e��+`�;?����}�<�;*8.rg>ѐ���7�t�̌q
��uX�H]� �Α��^ &����<K#')[L����y5b�W��E���YA�+3$��N��2������:O�i<�޴�5�m-�̔��_@����a�Q	���U�tX�Y@���6H�;H'�udRCSP��� cu{�~ ���[��b�dr��)��� ��R���LwRZ�����Cf�����������bt��&�g<q�/`j��OQ���4����L��!�$I�O�E��G�5��L!4�ts���B׬�F5�R�"D7��՗`:koU~G-�Pe{������^��Z��S��'�v��AL&��� �E�����\�x<\�\��3��&�Q�������0n10��s�õ��������6
U�:����OQ��j�i��u�����ꍬȶN�/h�y���NQ�Յ���F* �^��"���9������^|T3��ٗ����R��GzP1_l�����-�9��L���F�W"C-ہ�3�|���8}#�b���3�
Lo>��W�M�\�CT��#�e
��let fs = require('fs');
let FileTask = require('./file_task').FileTask;

/**
  @name jake
  @namespace jake
*/
/**
  @name jake.DirectoryTask
  @constructor
  @augments EventEmitter
  @augments jake.Task
  @augments jake.FileTask
  @description A Jake DirectoryTask

  @param {String} name The name of the directory to create.
 */
class DirectoryTask extends FileTask {
  constructor(...args) {
    super(...args);
    if (fs.existsSync(this.name)) {
      this.updateModTime();
    }
    else {
      this.modTime = null;
    }
  }
}

exports.DirectoryTask = DirectoryTask;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                 am76�6Ԋ��	�֌XK:S��lK�H3re�{�����:�c���L����i�E�z�`Ҩ^���u�gh(�rd:�u!J"4}�=����o�$w�����G��ift��g��H��jf6z�Vf�mGkeMs��r��������D�xmE��B��"X���;[���U���6v
��=L<�+ٚ����J��+�^J�1�Y���?���NH��f�(2���Xp�7�*������o*��U�^�ֈ���f� յ���3H�L2y�jG ���Qx�Ux�(�q@B���|�H
T3O�ۏ�!�W3�����@�l���<dRCn`&6L�����!ñ��B�ҌZnwV�[ry�.�d3>]ޤھ!�t��Ahj԰3���A�����	�M�ΈN���٢^6��51`X��4�o��@�ߔ@�I1�g�:���b*;��R�KC](s��i����S�$J���u��"o7!��Ѵ,4V/��L��k ��vR�E��kz���=�_UY�Y�h����\�4��[f�/�~�Q3�)^���K&�~�ֵ��`�������
M�q���o{:ݎ�^���)1;��Z!�72ōR�_�f��"Y����^��Һ��O�u��3TdY����U�����c`:���c�^ٜs��#����{�b�7j�
�!2#z��q%d�\1� �#?���>�{&��xff�ڄ�0w��2����L?.�q:@k��{�^�P���=c΃#"&��'���d����efJ��4 �����#ovOӼ�)Y2է!�]�A�O��Ȟ��e���y�����2a7���=C�������$�dDqrl�7�E>L��2� !�r����e��ڸB�5�y�Y���P�0��o L5��W��~�֙�58Ráh���a`�e�|���NM�����G;8u7�R
6��{� �n�$B��.]!���� s۪qF���i ,^��>�_B��J���R��`GN����f���P�������,3�&�]�2����\0/zt
^�� &��mfZ>�����ۯ��[�\��L��e875�%)Hf�OW�m���L�1'5-1y�$[(��;��5���퍨���*Me�qd6,��4�|k����QT���Dn~ ��Y|��-h}qxf���f����K���I��8yH��i�$u%S�K�<���Hc>��\��d��iw?!b�ަ�%��[�S�y�s��;��������A�}�!�2��'gسU�F6y"O��2k�u
zr{'�P+���m6R*�^[|J�/F�{��Ɯ��v��:Q�
��r��i��iT��4�G���x5���T��ϊYF<8ӌ9�4�s���+[i:��G�#����n��H7\߃a����#;
�&_��Џxv�o@���P`�7�)z��@椎h��#O���ᆊ}^/�\�6�Y� ߔAd���L��eعP_�ԽbP��W���D|#9�)X^�lR�n3��,�7B��!�L/r��ӌ�'0s�����5�2����Kt9>2��(�|��X��(9_n)8�/��&������a��������"|L��_ܜ����Uo8����=�}J�R�l���]m=i�]_1^��e��P��A64���qrH@����/��]ȱ��E�(]~K�W�b�w��6h����U
����]�L��}ǃ���{�Gj[L�CW�i�u�aV����%�X9Ϥd�e�5S]ލ�9"���B^�����ޛ�U��֐3P`��h���5��3\a<�F_8��C��A89D�/�N������)��^�r��1��7Q�k���\�4�i�o��<T uY�.�������z-;^�e��W��tA0�pψˈ줛�H������
��ՙd®�`T(TO��Rr��N.�d~�k�N77��֥�H��G����#�b��^�_>}Dj{\��Zl�Ϳ�o�����/�*�F悖����$�Ɓ
�3]65��'�?/Z�^�mF��RPK���g�=�p�zo�y��9�i�X����U�K�j-뙁1 r��޻�S3��!���3�g$�n񙆯��to��D��=jZ4�yQN�RiQ�ހM(ݜ����Rx�v�.1��G�]��vp�:�
r�!�����% O�.�6̎����+�@�s�2uw�_�ecpa��o��\�����Y,�gD����]�Z�;=��z)F8��p(�M?5��]�sd����֩�kh9���*���׊Ի�.${�
��?z'��f����%��,Œ��??�wl.�+�f�c@>�[hY79Lg�����dF�f�eD��}&}.Lҭ`���j�o%]'���ߐ��032�$|M�L�B�s��x��?���+�k��(�������DZ6��.��l��i`�Lk��(tX����S��:^.ڨ��Y꼆��R|��KLO��ڏ���F�b��B�i�E�)L�凤�m7�X@U�u	���}��B��|��bM��_�%>R�UW�#��U��8Ƈ�Ӝ�a��~/^��Z*S!����g��VÈ��}f���	\É��+Q�(�yZ^W_��� e-�]������V���{�fc�Yb��22*��� ���=�Ҷ,�]�p[z��b�N�����q�E���T� ��#|3���uD�9�����GG�յ!6�5���xKm{)\Q��A�_ˮ3���1n��~ �D�}y�f���̂J�"�v*��Ūz���g�	�`w\�i�/ ���	�����9�3S���:h�P�U4xc�4޿�����!an�[�
��~�QA�og�c{rW��SR-�X-���a�zS$�(�CE0��.Yw�q�s�����RQ1���.��Ө^
�_�Q�+�^D5�A��)�d!T��{S����Y�ǌ<�"�K�8`��x���IH��)
�%�~5�/%ĕ����6C��A^�G�>��ZQ�����7�wY��<q�l���NQX�f��`g��#��o)���|	���.���֐�֑W�T!�;?�¶UΪ��z=�����`D��1��}ǳ�ďy�z�#�Li�uI��]/Q�������N�1��$�R�@p��.��/|�_'����3~օj3�������kV�?��Y���=M��3'����j�����9�N_��L���ո]�r�Qtt�wad�����^~���&å��${�vê�T7+ �9���$�Ѻt�x�E�-jv8*�x	�c���_�4�<Z���K�������ѡe��*�N��Q� KĂRZ_����[�o߂^X�Yv��*�Aq��~l�,����8�7��	R��{�a���2��{Ǥ�����xE�*�+
�f%&.'ɹR�g�KY{�N�5��/v��A��v���2^��>r5�Cȍ�k�kOá���k��
|������t���z3����T��йfz����o�����֌pY��q�'�oN�@9P��B`)����OD�>���d0$�E*�����#�R�뗴�Z�ēq�N;��;��
���5��B�<� m���Œ:�е��)�a����޵5k\��4�a6�,
z����N?�bB��̢����_@�����HӞ^�T�p�z/|p�'��d�d��2͘�=�+�B7]F���÷-A��J���� ^��vҞF��j�ce���f�
�/�p���w�@�s���Ab�4�rX�N���(;؈?3��M�O�,�g����;�Q*����K����
A|�~�,M4�;�K&.�
[eW2��'&�̰���z�dw���A6t�!��F0��Ƽ�S�o�m�>�cӮtٵ?R�����ǊW�
�&�O�/�\�=;��p�Ƞ��ʽ�	���.�|����B�z��	�#�1S8]?9.Yl+mNQK����r�]�!?�AWs8����}9����c��Ԉ�.���:4�!$����i�ȇF��YR��&3f%�#3��*ݗx���a�<�+d�q�G�,�'�3���v�@`H ��'B!��&�"�*֤nL�b>������@����_7�-@X8�	��d�Xg���ah�T�5 �S�[���u=S��R<':��&$��~!��z
�ըO�M&�� �@c�6;���VN~�&sh���Y���+͔1Q�f�:=���Y�x��\y`�rt�_�Z	��e}����R]�8g5+ה�H�Ե��������{�G��Dq+��jy�p{Cq��7�=�*��yZ���\R}�Ii���5��&��-�P֞?f{�~/�8ޏ�������7f�J��p��:u�̡���BȕD��_i�֘��Ƭ2��0�9[9#\��s-�u&��=����� �2˸G�t�?^H�v���U���E��P}u�<��>
\hw��w����0z����h�%3�D�Aԅ�$\	�/�Z#���PYj��4��O�g
��.�F�\/�
>C׀
˦ڐ?��v{�
��V�����Q&��koq�`[�S[�>
��1��BJ�?~;b����{��cB�������k�Zej�D�� �*��%(��~=Z�#�j{�O����K2��`�"��N�/
6�Z
=B��lɠi�2[4��M*k>nB�Y�(�˒Ң�wMӨ����v���84�5}�u��u<PΈ���层��E�5N�˴�e�\�-�<�E���,�boRL���>��_B[��c��o������+n�pp��2G��'�#�ʼ�G�*O�:��� -���#�5"�ӏG� ^~�?x���a��Il���a8��=h�Gf^�*b�(��+�*2\�&�Ly��ّmM� Y�O��G2 ��<���?�S�Y0��άA��L���OS�t�@R��^X��)}ӎ��hnWT�ϭ_��|h'b_IoQ4�22W-K;ӫ��35�f-�	V����{�pd!F*v|��ӯ�ld�����5��9?��@�~�����=j������v���/\F#��R� ��c{b
�[ٸ�gG�k��aH|W�Yi�O���n���������x�Â�q5�)�{���8i�$���yj��RnBep��T�X�B��t4D��g�lсC����b��=R��:7�� ƈ���U�,&+=%#��j*��
�1�/}w;�P��K�|L��!f:��ݢ��Ƒ�
2i1�d�Өu�?���������=�!� n�<_��p�@k(���{�ר	���oc+�5ds��ZL�iv1�����
��+��5A�\�Uy����4ˠF�����Cl���,�#������� �	����x��r��X����G���H���vqM� �s^���>�b�iv�8k�̱��`g:?Ã_�,�v���}��I���K�Z�����~x'm[:�`���i��D�U�%��d{��3��ƕ�7<�+�"�Z�9A弄�X˽$������$�����1d0Zm�X+��q
}�0᪺o��Qkay���j���|�?����N���Q�2��J��U�%<�17l�~DOIy���"��q�Su��-��pU�e(�4�uBfn��!F\�������N�P��H1Hz
��=RP��lG�����nf>��x���[D�f��{o��e>�%���C�O2�7η��]��kb���s`�v��Y@â���Rz�|i�gF���d�_�������N
�by{�Ӏ��!L�yԃ��	�qGH����/ލ��0`�k���H�)���95��}�`5"(���hq�ՒkԺD���]BU��`�(�ȇ��� 	�S^d�B0u�f�t��P��ח5�D��� S&���]k�d�;���^ʞ1�oq)]mr�"x��#�s��nA��o��K_���ԑ���p����xI��]t�[/i�`�A��]c��q�tZD��8��wb��}-������ ˰�Bi �V�x,�m�Ta�:�-��5��wp��˾5^w���Ջ1WԖ[�oq�@$�I�-�����l2�TrɎL�rG'�=~U�U3-2I-/�$u��Ȃ�M�(S*s#�R�1�êӼ}���0A��oB�v$Z�DP�hԻhk��u)j
|0Wp!<���=�������mܤH��=�t �3�Tj�����0�\�g4��h,3�{����XRF���Kz��$�?�;��A�4��k�v�T ���/)��R��g`be��Ū����9�҄$�V�H[��n����C����;U^L��F2���?2�3�xf�l�xcvV���^ ��%7�̰��~$4R'����c��������"�^G�/�;ifp�pK9�/_�Z?W�p�*���o��euklk�=G��A�.��t:������3��^7"^jr�����hi�^�3`��;$C��TI��7��gf�3ݷ� %l,#xD!�,"U/��
`���������xO��:����&��m����3�������A��3���ۺ���mg��t3�#���$b��s�쨌��r���EРY�k=' �%��rr0 �[u;	Q�~�)�����3��U�����M��S-ċ����2FR���*�ۖ:,۞�x��iϏ�_���sa���l늅n��XS<�␩�I���{���=��)va���lڤL��>2 �Et�B�����i�YI�@���M�6����U1�P3%�t��U�D����8�̰_����U�Y�r5S�|y���,/j�����T���{��y����C��!���v��ո�O����&A�u?k�w��4U���O���c�V�7�F96��ns*W�B}8
S�����&�)�Y�E>���%�MUޣ�l`?��ȹMsN��VX��Yɐ��ԧR�;������k&�r0Zy\�3p���H�K�վ�~Z��d��t�,fJa�Q^�l�<M��.����]<�"3[�\t�y��ZSX<�VF2�t�|��D�(���}u�ei�Nc�\���!��I6���fT���;������u
<)~G*��7s�DOt,�h��(�D'����[Bq�`���J̥��ŗ%oq��zAS���.���S�.�C�1yf:�ʒS�u&��lV�����A�Vt�����&LJ!�3s�q���_�LX��
���pX�te��3g���'�@�|Q�W���r�kfj��_@�8����5���;Re�٧�Wݿ�
���vyQH��8~<W�^q���s�ȑ��F�,�鉫:��;i�R2V[u{Qm�-�rϢb �ᚲ�0���o�VC�D/~�Ni��z|�r�t�AF\,w+Mik[>��Bǲ�?͒]�n4k��co�B2m[\pf�[�}��U�|��K}���լ2���ܑ=����l����PS�|���,ׯ���5�h�>s2�����-04�x4ً̑�j9���&ۣ1'�#�Bd#��5#Q>�!�%sg�WzK�
�a9*(H]��ũ�t+%:���g���Ȝ�[k��%�w:��#��#gC�Եu0�Q��eW`pݍ������ǃ��ڸz"�^w`K���`�Q�])g�h�AtA���O�\��
F�(<�}8=_Kaz7X��:0��+"D���d���˹��J�RkT,z�z#F�]%R�3+6���A�p4я̲���=S��PwCZ}z�?v���w)������5G���Q�˒5����G�G+���%������U�������;�8Ԅ��.����*�wgIé� W۪M8��Ϙ�/8�)z��)�Fk�CG��T�4~����(@�,#%�@��ScZ�ă��I
ӧ+e�rd֏�6��Ȉ�a�H�wM.>C�A�AIk��4���'җ���l��0���TR�[(K��$��l�/�q��=@":4�5�zK%eW��_�<P;��V{���ՑG��g�n�b�_)n��|<�wU��?���	�-���`���F�+#rv
v&?�����<����-���?�ns��`â��#щڃ<Ϥ�Β
��j=b�:c� �aB�B�z���^!Z�d���;,���?��"iY������l��J�;�,r���P�# �3t�h�|�=I-�BLi�P��8D#�/�*�e��T�E?�.-�	��1H�S��pni�.�Ы��3�o�k��QJN��⥲��t4e�G��e��>ѭ����)���(ZҺ+.�Y���T��}cD\��������{�ۢx�lguNWXZ3Ol-k\H%����Ev����H�x���h�P4��J��C��
�k��d:�$)��~�7t�Azq{��D2�D�A�0'c(����'H�<#�`����H���UT�M���%V� ��V<gU��Tĕ��O#�@堅�j�y��~f�kQ-�I�vg�5�橘6|
i9�n�/�*w��i���K0��l	�������e�3ˁ5
b��`X!�Y�0Vd���:��[v	�/P�	��؆C��0ߘLE0��)�M�:�*CP����� ��q��M�m~ޞ���,y�|�m^L���'����D>��:s���YD��Gm�4L��wXqQ�C�%�ʫ�,bY�‍���Q-�)o�_ϑ�r���P���[�d"�����uH�>���"�,k�
YL�ģ��W�VO4��胱�V�RE���$l�]r�Rښ�2܌��L"nA{ M�&�l���ޯBp����L<���ugT�ޣG��Pl�i�
Z2'���oq|u'����'�rE&eL#�a0�zDR����!�X�k)lE�$C��̬���j/�qN{��w٬�4�^L�#Pԋx�'�)�d�鴌-l3�q�1�C�"�j���V��z��h�_���     �%f�w�)�65��%��%���D`�ݥ��w�* ��lr�}5rl��ba

const pluginsMap = require('../../plugins/plugins.js');

const pluginsOrder = [
  'removeDoctype',
  'removeXMLProcInst',
  'removeComments',
  'removeMetadata',
  'removeXMLNS',
  'removeEditorsNSData',
  'cleanupAttrs',
  'mergeStyles',
  'inlineStyles',
  'minifyStyles',
  'convertStyleToAttrs',
  'cleanupIDs',
  'prefixIds',
  'removeRasterImages',
  'removeUselessDefs',
  'cleanupNumericValues',
  'cleanupListOfValues',
  'convertColors',
  'removeUnknownsAndDefaults',
  'removeNonInheritableGroupAttrs',
  'removeUselessStrokeAndFill',
  'removeViewBox',
  'cleanupEnableBackground',
  'removeHiddenElems',
  'removeEmptyText',
  'convertShapeToPath',
  'convertEllipseToCircle',
  'moveElemsAttrsToGroup',
  'moveGroupAttrsToElems',
  'collapseGroups',
  'convertPathData',
  'convertTransform',
  'removeEmptyAttrs',
  'removeEmptyContainers',
  'mergePaths',
  'removeUnusedNS',
  'sortAttrs',
  'sortDefsChildren',
  'removeTitle',
  'removeDesc',
  'removeDimensions',
  'removeAttrs',
  'removeAttributesBySelector',
  'removeElementsByAttr',
  'addClassesToSVGElement',
  'removeStyleElement',
  'removeScriptElement',
  'addAttributesToSVGElement',
  'removeOffCanvasPaths',
  'reusePaths',
];
const defaultPlugins = pluginsOrder.filter((name) => pluginsMap[name].active);
exports.defaultPlugins = defaultPlugins;

const extendDefaultPlugins = (plugins) => {
  console.warn(
    '\n"extendDefaultPlugins" utility is deprecated.\n' +
      'Use "preset-default" plugin with overrides instead.\n' +
      'For example:\n' +
      `{\n` +
      `  name: 'preset-default',\n` +
      `  params: {\n` +
      `    overrides: {\n` +
      `      // customize plugin options\n` +
      `      convertShapeToPath: {\n` +
      `        convertArcs: true\n` +
      `      },\n` +
      `      // disable plugins\n` +
      `      convertPathData: false\n` +
      `    }\n` +
      `  }\n` +
      `}\n`
  );
  const extendedPlugins = pluginsOrder.map((name) => ({
    name,
    active: pluginsMap[name].active,
  }));
  for (const plugin of plugins) {
    const resolvedPlugin = resolvePluginConfig(plugin);
    const index = pluginsOrder.indexOf(resolvedPlugin.name);
    if (index === -1) {
      extendedPlugins.push(plugin);
    } else {
      extendedPlugins[index] = plugin;
    }
  }
  return extendedPlugins;
};
exports.extendDefaultPlugins = extendDefaultPlugins;

const resolvePluginConfig = (plugin) => {
  let configParams = {};
  if (typeof plugin === 'string') {
    // resolve builtin plugin specified as string
    const pluginConfig = pluginsMap[plugin];
    if (pluginConfig == null) {
      throw Error(`Unknown builtin plugin "${plugin}" specified.`);
    }
    return {
      ...pluginConfig,
      name: plugin,
      active: true,
      params: { ...pluginConfig.params, ...configParams },
    };
  }
  if (typeof plugin === 'object' && plugin != null) {
    if (plugin.name == null) {
      throw Error(`Plugin name should be specified`);
    }
    if (plugin.fn) {
      // resolve custom plugin with implementation
      return {
        active: true,
        ...plugin,
        params: { ...configParams, ...plugin.params },
      };
    } else {
      // resolve builtin plugin specified as object without implementation
      const pluginConfig = pluginsMap[plugin.name];
      if (pluginConfig == null) {
        throw Error(`Unknown builtin plugin "${plugin.name}" specified.`);
      }
      return {
        ...pluginConfig,
        active: true,
        ...plugin,
        params: { ...pluginConfig.params, ...configParams, ...plugin.params },
      };
    }
  }
  return null;
};
exports.resolvePluginConfig = resolvePluginConfig;
                                                                                                                                                                                                                                                                                                                                                                                                                   x5���P	������z��\��&�&姯|�v���\Cʅ����ә�%����,fR�.;���M �ɓ���
x�LOЏ��'E�J�W!�����h
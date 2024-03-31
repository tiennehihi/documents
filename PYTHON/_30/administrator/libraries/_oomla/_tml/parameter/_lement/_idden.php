1.7.4 / 2019-03-18
==================

  * deps: compressible@~2.0.16
    - Mark `text/less` as compressible
    - deps: mime-db@'>= 1.38.0 < 2'
  * deps: on-headers@~1.0.2
    - Fix `res.writeHead` patch missing return value
  * perf: prevent unnecessary buffer copy

1.7.3 / 2018-07-15
==================

  * deps: accepts@~1.3.5
    - deps: mime-types@~2.1.18
  * deps: compressible@~2.0.14
    - Mark all XML-derived types as compressible
    - deps: mime-db@'>= 1.34.0 < 2'
  * deps: safe-buffer@5.1.2

1.7.2 / 2018-02-18
==================

  * deps: compressible@~2.0.13
    - deps: mime-db@'>= 1.33.0 < 2'

1.7.1 / 2017-09-26
==================

  * deps: accepts@~1.3.4
    - deps: mime-types@~2.1.16
  * deps: bytes@3.0.0
  * deps: compressible@~2.0.11
    - deps: mime-db@'>= 1.29.0 < 2'
  * deps: debug@2.6.9
  * deps: vary@~1.1.2
    - perf: improve header token parsing speed

1.7.0 / 2017-07-10
==================

  * Use `safe-buffer` for improved Buffer API
  * deps: bytes@2.5.0
  * deps: compressible@~2.0.10
    - Fix regex fallback to not override `compressible: false` in db
    - deps: mime-db@'>= 1.27.0 < 2'
  * deps: debug@2.6.8
    - Allow colors in workers
    - Deprecated `DEBUG_FD` environment variable set to `3` or higher
    - Fix error when running under React Native
    - Fix `DEBUG_MAX_ARR
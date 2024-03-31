## **6.11.0
- [New] [Fix] `stringify`: revert 0e903c0; add `commaRoundTrip` option (#442)
- [readme] fix version badge

## **6.10.5**
- [Fix] `stringify`: with `arrayFormat: comma`, properly include an explicit `[]` on a single-item array (#434)

## **6.10.4**
- [Fix] `stringify`: with `arrayFormat: comma`, include an explicit `[]` on a single-item array (#441)
- [meta] use `npmignore` to autogenerate an npmignore file
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `aud`, `has-symbol`, `object-inspect`, `tape`

## **6.10.3**
- [Fix] `parse`: ignore `__proto__` keys (#428)
- [Robustness] `stringify`: avoid relying on a global `undefined` (#427)
- [actions] reuse common workflows
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `object-inspect`, `tape`

## **6.10.2**
- [Fix] `stringify`: actually fix cyclic references (#426)
- [Fix] `stringify`: avoid encoding arrayformat comma when `encodeValuesOnly = true` (#424)
- [readme] remove travis badge; add github actions/codecov badges; update URLs
- [Docs] add note and links for coercing primitive values (#408)
- [actions] update codecov uploader
- [actions] update workflows
- [Tests] clean up stringify tests slightly
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `aud`, `object-inspect`, `safe-publish-latest`, `tape`

## **6.10.1**
- [Fix] `stringify`: avoid exception on repeated object values (#402)

## **6.10.0**
- [New] `stringify`: throw on cycles, instead of an infinite loop (#395, #394, #393)
- [New] `parse`: add `allowSparse` option for collapsing arrays with missing indices (#312)
- [meta] fix README.md (#399)
- [meta] only run `npm run dist` in publish, not install
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `aud`, `has-symbols`, `tape`
- [Tests] fix tests on node v0.6
- [Tests] use `ljharb/actions/node/install` instead of `ljharb/actions/node/run`
- [Tests] Revert "[meta] ignore eclint transitive audit warning"

## **6.9.7**
- [Fix] `parse`: ignore `__proto__` keys (#428)
- [Fix] `stringify`: avoid encoding arrayformat comma when `encodeValuesOnly = true` (#424)
- [Robustness] `stringify`: avoid relying on a global `undefined` (#427)
- [readme] remove travis badge; add github actions/codecov badges; update URLs
- [Docs] add note and links for coercing primitive values (#408)
- [Tests] clean up stringify tests slightly
- [meta] 
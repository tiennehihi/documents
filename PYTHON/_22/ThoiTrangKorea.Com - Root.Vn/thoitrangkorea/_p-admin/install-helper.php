# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.13.1](https://github.com/inspect-js/object-inspect/compare/v1.13.0...v1.13.1) - 2023-10-19

### Commits

- [Fix] in IE 8, global can !== window despite them being prototypes of each other [`30d0859`](https://github.com/inspect-js/object-inspect/commit/30d0859dc4606cf75c2410edcd5d5c6355f8d372)

## [v1.13.0](https://github.com/inspect-js/object-inspect/compare/v1.12.3...v1.13.0) - 2023-10-14

### Commits

- [New] add special handling for the global object [`431bab2`](https://github.com/inspect-js/object-inspect/commit/431bab21a490ee51d35395966a504501e8c685da)
- [Dev Deps] update `@ljharb/eslint-config`, `aud`, `tape` [`fd4f619`](https://github.com/inspect-js/object-inspect/commit/fd4f6193562b4b0e95dcf5c0201b4e8cbbc4f58d)
- [Dev Deps] update `mock-property`, `tape` [`b453f6c`](https://github.com/inspect-js/object-inspect/commit/b453f6ceeebf8a1b738a1029754092e0367a4134)
- [Dev Deps] update `error-cause` [`e8ffc57`](https://github.com/inspect-js/object-inspect/commit/e8ffc577d73b92bb6a4b00c44f14e3319e374888)
- [Dev Deps] update `tape` [`054b8b9`](https://github.com/inspect-js/object-inspect/commit/054b8b9b98633284cf989e582450ebfbbe53503c)
- [Dev Deps] temporarily remove `aud` due to breaking change in transitive deps [`2476845`](https://github.com/inspect-js/object-inspect/commit/2476845e0678dd290c541c81cd3dec8420782c52)
- [Dev Deps] pin `glob`, since v10.3.8+ requires a broken `jackspeak` [`383fa5e`](https://github.com/inspect-js/object-inspect/commit/383fa5eebc0afd705cc778a4b49d8e26452e49a8)
- [Dev Deps] pin `jackspeak` since 2.1.2+ depends on npm aliases, which kill the install process in npm &lt; 6 [`68c244c`](https://github.com/inspect-js/object-inspect/commit/68c244c5174cdd877e5dcb8ee90aa3f44b2f25be)

## [v1.12.3](https://github.com/inspect-js/object-inspect/compare/v1.12.2...v1.12.3) - 2023-01-12

### Commits

- [Fix] in eg FF 24, collections lack forEach [`75fc226`](https://github.com/inspect-js/object-inspect/commit/75fc22673c82d45f28322b1946bb0eb41b672b7f)
- [actions] update rebase action to use reusable workflow [`250a277`](https://github.com/inspect-js/object-inspect/commit/250a277a095e9dacc029ab8454dcfc15de549dcd)
- [Dev Deps] update `aud`, `es-value-fixtures`, `tape` [`66a19b3`](https://github.com/inspect-js/object-inspect/commit/66a19b3209ccc3c5ef4b34c3cb0160e65d1ce9d5)
- [Dev Deps] update `@ljharb/eslint-config`, `aud`, `error-cause` [`c43d332`](https://github.com/inspect-js/object-inspect/commit/c43d3324b48384a16fd3dc444e5fc589d785bef3)
- [Tests] add `@pkgjs/support` to `postlint` [`e2618d2`](https://github.com/inspect-js/object-inspect/commit/e2618d22a7a3fa361b6629b53c1752fddc9c4d80)

## [v1.12.2](https://github.com/inspect-js/object-inspect/compare/v1.12.1...v1.12.2) - 2022-05-26

### Commits

- [Fix] use `util.inspect` for a custom inspection symbol method [`e243bf2`](https://github.com/inspect-js/object-inspect/commit/e243bf2eda6c4403ac6f1146fddb14d12e9646c1)
- [meta] add support info [`ca20ba3`](https://github.com/inspect-js/object-inspect/commit/ca20ba35713c17068ca912a86c542f5e8acb656c)
- [Fix] ignore `cause` in node v16.9 and v16.10 where it has a bug [`86aa553`](https://github.com/inspect-js/object-inspect/commit/86aa553a4a455562c2c56f1540f0bf857b9d314b)

## [v1.12.1](https://github.com/inspect-js/object-inspect/compare/v1.12.0...v1.12.1) - 2022-05-21

### Commits

- [Tests] use `mock-property` [`4ec8893`](https://github.com/inspect-js/object-inspect/commit/4ec8893ea9bfd28065ca3638cf6762424bf44352)
- [meta] use `npmignore` to autogenerate an npmignore file [`07f868c`](https://github.com/inspect-js/object-inspect/commit/07f868c10bd25a9d18686528339bb749c211fc9a)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `aud`, `auto-changelog`, `tape` [`b05244b`](https://github.com/inspect-js/object-inspect/commit/b05244b4f331e00c43b3151bc498041be77ccc91)
- [Dev Deps] update `@ljharb/eslint-config`, `error-cause`, `es-value-fixtures`, `functions-have-names`, `tape` [`d037398`](https://github.com/inspect-js/object-inspect/commit/d037398dcc5d531532e4c19c4a711ed677f579c1)
- [Fix] properly handle callable regexes in older engines [`848fe48`](https://github.com/inspect-js/object-inspect/commit/848fe48bd6dd0064ba781ee6f3c5e54a94144c37)

## [v1.12.0](https://github.com/inspect-js/object-inspect/compare/v1.11.1...v1.12.0) - 2021-12-18

### Commits

- [New] add `numericSeparator` boolean option [`2d2d537`](https://github.com/inspect-js/object-inspect/commit/2d2d537f5359a4300ce1c10241369f8024f89e11)
- [Robustness] cache more prototype methods [`191533d`](https://github.com/inspect-js/object-inspect/commit/191533da8aec98a05eadd73a5a6e979c9c8653e8)
- [New] ensure an Error’s `cause` is displayed [`53bc2ce`](https://github.com/inspect-js/object-inspect/commit/53bc2cee4e5a9cc4986f3cafa22c0685f340715e)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`bc164b6`](https://github.com/inspect-js/object-inspect/commit/bc164b6e2e7d36b263970f16f54de63048b84a36)
- [Robustness] cache `RegExp.prototype.test` [`a314ab8`](https://github.com/inspect-js/object-inspect/commit/a314ab8271b905cbabc594c82914d2485a8daf12)
- [meta] fix auto-changelog settings [`5ed0983`](https://github.com/inspect-js/object-inspect/commit/5ed0983be72f73e32e2559997517a95525c7e20d)

## [v1.11.1](https://github.com/inspect-js/object-inspect/compare/v1.11.0...v1.11.1)
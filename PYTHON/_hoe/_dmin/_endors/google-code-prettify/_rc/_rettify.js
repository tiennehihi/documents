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

## [v1.11.1](https://github.com/inspect-js/object-inspect/compare/v1.11.0...v1.11.1) - 2021-12-05

### Commits

- [meta] add `auto-changelog` [`7dbdd22`](https://github.com/inspect-js/object-inspect/commit/7dbdd228401d6025d8b7391476d88aee9ea9bbdf)
- [actions] reuse common workflows [`c8823bc`](https://github.com/inspect-js/object-inspect/commit/c8823bc0a8790729680709d45fb6e652432e91aa)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `safe-publish-latest`, `tape` [`7532b12`](https://github.com/inspect-js/object-inspect/commit/7532b120598307497b712890f75af8056f6d37a6)
- [Refactor] use `has-tostringtag` to behave correctly in the presence of symbol shams [`94abb5d`](https://github.com/inspect-js/object-inspect/commit/94abb5d4e745bf33253942dea86b3e538d2ff6c6)
- [actions] update codecov uploader [`5ed5102`](https://github.com/inspect-js/object-inspect/commit/5ed51025267a00e53b1341357315490ac4eb0874)
- [Dev Deps] update `eslint`, `tape` [`37b2ad2`](https://github.com/inspect-js/object-inspect/commit/37b2ad26c08d94bfd01d5d07069a0b28ef4e2ad7)
- [meta] add `sideEffects` flag [`d341f90`](https://github.com/inspect-js/object-inspect/commit/d341f905ef8bffa6a694cda6ddc5ba343532cd4f)

## [v1.11.0](https://github.com/inspect-js/object-inspect/compare/v1.10.3...v1.11.0) - 2021-07-12

### Commits

- [New] `customInspect`: add `symbol` option, to mimic modern util.inspect behavior [`e973a6e`](https://github.com/inspect-js/object-inspect/commit/e973a6e21f8140c5837cf25e9d89bdde88dc3120)
- [Dev Deps] update `eslint` [`05f1cb3`](https://github.com/inspect-js/object-inspect/commit/05f1cb3cbcfe1f238e8b51cf9bc294305b7ed793)

## [v1.10.3](https://github.com/inspect-js/object-inspect/compare/v1.10.2...v1.10.3) - 2021-05-07

### Commits

- [Fix] handle core-js Symbol shams [`4acfc2c`](https://github.com/inspect-js/object-inspect/commit/4acfc2c4b503498759120eb517abad6d51c9c5d6)
- [readme] update badges [`95c323a`](https://github.com/inspect-js/object-inspect/commit/95c323ad909d6cbabb95dd6015c190ba6db9c1f2)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `aud` [`cb38f48`](https://github.com/inspect-js/object-inspect/commit/cb38f485de6ec7a95109b5a9bbd0a1deba2f6611)

## [v1.10.2](https://github.com/inspect-js/object-inspect/compare/v1.10.1...v1.10.2) - 2021-04-17

### Commits

- [Fix] use a robust check for a boxed Symbol [`87f12d6`](https://github.com/inspect-js/object-inspect/commit/87f12d6e69ce530be04659c81a4cd502943acac5)

## [v1.10.1](https://github.com/inspect-js/object-inspect/compare/v1.10.0...v1.10.1) - 2021-04-17

### Commits

- [Fix] use a robust check for a boxed bigint [`d5ca829`](https://github.com/inspect-js/object-inspect/commit/d5ca8298b6d2e5c7b9334a5b21b96ed95d225c91)

## [v1.10.0](https://github.com/inspect-js/object-inspect/compare/v1.9.0...v1.10.0) - 2021-04-17

### Commits

- [Tests] increase coverage [`d8abb8a`](https://github.com/inspect-js/object-inspect/commit/d8abb8a62c2f084919df994a433b346e0d87a227)
- [actions] use `node/install` instead of `node/run`; use `codecov` action [`4bfec2e`](https://github.com/inspect-js/object-inspect/commit/4bfec2e30aaef6ddef6cbb1448306f9f8b9520b7)
- [New] respect `Symbol.toStringTag` on objects [`799b58f`](https://github.com/inspect-js/object-inspect/commit/799b58f536a45e4484633a8e9daeb0330835f175)
- [Fix] do not allow Symbol.toStringTag to masquerade as builtins [`d6c5b37`](https://github.com/inspect-js/object-inspect/commit/d6c5b37d7e94427796b82432fb0c8964f033a6ab)
- [New] add `WeakRef` support [`b6d898e`](https://github.com/inspect-js/object-inspect/commit/b6d898ee21868c780a7ee66b28532b5b34ed7f09)
- [meta] do not publish github action workflow files [`918cdfc`](https://github.com/inspect-js/object-inspect/commit/918cdfc4b6fe83f559ff6ef04fe66201e3ff5cbd)
- [meta] create `FUNDING.yml` [`0bb5fc5`](https://github.com/inspect-js/object-inspect/commit/0bb5fc516dbcd2cd728bd89cee0b580acc5ce301)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `aud`, `tape` [`22c8dc0`](https://github.com/inspect-js/object-inspect/commit/22c8dc0cac113d70f4781e49a950070923a671be)
- [meta] use `prepublishOnly` script for npm 7+ [`e52ee09`](https://github.com/inspect-js/object-inspect/commit/e52ee09e8050b8dbac94ef57f786675567728223)
- [Dev Deps] update `eslint` [`7c4e6fd`](https://github.com/inspect-js/object-inspect/commit/7c4e6fdedcd27cc980e13c9ad834d05a96f3d40c)

## [v1.9.0](https://github.com/inspect-js/object-inspect/compare/v1.8.0...v1.9.0) - 2020-11-30

### Commits

- [Tests] migrate tests to Github Actions [`d262251`](https://github.com/inspect-js/object-inspect/commit/d262251e13e16d3490b5473672f6b6d6ff86675d)
- [New] add enumerable own Symbols to plain object output [`ee60c03`](https://github.com/inspect-js/object-inspect/commit/ee60c033088cff9d33baa71e59a362a541b48284)
- [Tests] add passing tests [`01ac3e4`](https://github.com/inspect-js/object-inspect/commit/01ac3e4b5a30f97875a63dc9b1416b3bd626afc9)
- [actions] add "Require Allow Edits" action [`c2d7746`](https://github.com/inspect-js/object-inspect/commit/c2d774680cde4ca4af332d84d4121b26f798ba9e)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `aud`, `core-js` [`70058de`](https://github.com/inspect-js/object-inspect/commit/70058de1579fc54d1d15ed6c2dbe246637ce70ff)
- [Fix] hex characters in strings should be uppercased, to match node `assert` [`6ab8faa`](https://github.com/inspect-js/object-inspect/commit/6ab8faaa0abc08fe7a8e2afd8b39c6f1f0e00113)
- [Tests] run `nyc` on all tests [`4c47372`](https://github.com/inspect-js/object-inspect/commit/4c473727879ddc8e28b599202551ddaaf07b6210)
- [Tests] node 0.8 has an unpredictable property order; fix `groups` test by removing property [`f192069`](https://github.com/inspect-js/object-inspect/commit/f192069a978a3b60e6f0e0d45ac7df260ab9a778)
- [New] add enumerable properties to Function inspect result, per node’s `assert` [`fd38e1b`](https://github.com/inspect-js/object-inspect/commit/fd38e1bc3e2a1dc82091ce3e021917462eee64fc)
- [Tests] fix tests for node &lt; 10, due to regex match `groups` [`2ac6462`](https://github.com/inspect-js/object-inspect/commit/2ac6462cc4f72eaa0b63a8cfee9aabe3008b2330)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`44b59e2`](https://github.com/inspect-js/object-inspect/commit/44b59e2676a7f825ef530dfd19dafb599e3b9456)
- [Robustness] cache `Symbol.prototype.toString` [`f3c2074`](https://github.com/inspect-js/object-inspect/commit/f3c2074d8f32faf8292587c07c9678ea931703dd)
- [Dev Deps] update `eslint` [`9411294`](https://github.com/inspect-js/object-inspect/commit/94112944b9245e3302e25453277876402d207e7f)
- [meta] `require-allow-edits` no longer requires an explicit github token [`36c0220`](https://github.com/inspect-js/object-inspect/commit/36c02205de3c2b0e84d53777c5c9fd54a36c48ab)
- [actions] update rebase checkout action to v2 [`55a39a6`](https://github.com/inspect-js/object-inspect/commit/55a39a64e944f19c6a7d8efddf3df27700f20d14)
- [actions] switch Automatic Rebase workflow to `pull_request_target` event [`f59fd3c`](https://github.com/inspect-js/object-inspect/commit/f59fd3cf406c3a7c7ece140904a80bbc6bacfcca)
- [Dev Deps] update `eslint` [`a492bec`](https://github.com/inspect-js/object-inspect/commit/a492becec644b0155c9c4bc1caf6f9fac11fb2c7)

## [v1.8.0](https://github.com/inspect-js/object-inspect/compare/v1.7.0...v1.8.0) - 2020-06-18

### Fixed

- [New] add `indent` option [`#27`](https://github.com/inspect-js/object-inspect/issues/27)

### Commits

- [Tests] add codecov [`4324cbb`](https://github.com/inspect-js/object-inspect/commit/4324cbb1a2bd7710822a4151ff373570db22453e)
- [New] add `maxStringLength` option [`b3995cb`](https://github.com/inspect-js/object-inspect/commit/b3995cb71e15b5ee127a3094c43994df9d973502)
- [New] add `customInspect` option, to disable custom inspect methods [`28b9179`](https://github.com/inspect-js/object-inspect/commit/28b9179ee802bb3b90810100c11637db90c2fb6d)
- [Tests] add Date and RegExp tests [`3b28eca`](https://github.com/inspect-js/object-inspect/commit/3b28eca57b0367aeadffac604ea09e8bdae7d97b)
- [actions] add automatic rebasing / merge commit blocking [`0d9c6c0`](https://github.com/inspect-js/object-inspect/commit/0d9c6c044e83475ff0bfffb9d35b149834c83a2e)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `core-js`, `tape`; add `aud` [`7c204f2`](https://github.com/inspect-js/object-inspect/commit/7c204f22b9e41bc97147f4d32d4cb045b17769a6)
- [readme] fix repo URLs, remove testling [`34ca9a0`](https://github.com/inspect-js/object-inspect/commit/34ca9a0dabfe75bd311f806a326fadad029909a3)
- [Fix] when truncating a deep array, note it as `[Array]` instead of just `[Object]` [`f74c82d`](https://github.com/inspect-js/object-inspect/commit/f74c82dd0b35386445510deb250f34c41be3ec0e)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `tape` [`1a8a5ea`](https://github.com/inspect-js/object-inspect/commit/1a8a5ea069ea2bee89d77caedad83ffa23d35711)
- [Fix] do not be fooled by a function’s own `toString` method [`7cb5c65`](https://github.com/inspect-js/object-inspect/commit/7cb5c657a976f94715c19c10556a30f15bb7d5d7)
- [patch] indicate explicitly that anon functions are anonymous, to match node [`81ebdd4`](https://github.com/inspect-js/object-inspect/commit/81ebdd4215005144074bbdff3f6bafa01407910a)
- [Dev Deps] loosen the `core-js` dep [`e7472e8`](https://github.com/inspect-js/object-inspect/commit/e7472e8e242117670560bd995830c2a4d12080f5)
- [Dev Deps] update `tape` [`699827e`](https://github.com/inspect-js/object-inspect/commit/699827e6b37258b5203c33c78c009bf4b0e6a66d)
- [meta] add `safe-publish-latest` [`c5d2868`](https://github.com/inspect-js/object-inspect/commit/c5d2868d6eb33c472f37a20f89ceef2787046088)
- [Dev Deps] update `@ljharb/eslint-config` [`9199501`](https://github.com/inspect-js/object-inspect/commit/919950195d486114ccebacbdf9d74d7f382693b0)

## [v1.7.0](https://github.com/inspect-js/object-inspect/compare/v1.6.0...v1.7.0) - 2019-11-10

### Commits

- [Tests] use shared travis-ci configs [`19899ed`](https://github.com/inspect-js/object-inspect/commit/19899edbf31f4f8809acf745ce34ad1ce1bfa63b)
- [Tests] add linting [`a00f057`](https://github.com/inspect-js/object-inspect/commit/a00f057d917f66ea26dd37769c6b810ec4af97e8)
- [Tests] lint last file [`2698047`](https://github.com/inspect-js/object-inspect/commit/2698047b58af1e2e88061598ef37a75f228dddf6)
- [Tests] up to `node` `v12.7`, `v11.15`, `v10.16`, `v8.16`, `v6.17` [`589e87a`](https://github.com/inspect-js/object-inspect/commit/589e87a99cadcff4b600e6a303418e9d922836e8)
- [New] add support for `WeakMap` and `WeakSet` [`3ddb3e4`](https://github.com/inspect-js/object-inspect/commit/3ddb3e4e0c8287130c61a12e0ed9c104b1549306)
- [meta] clean up license so github can detect it properly [`27527bb`](https://github.com/inspect-js/object-inspect/commit/27527bb801520c9610c68cc3b55d6f20a2bee56d)
- [Tests] cover `util.inspect.custom` [`3"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSemicolonToken = exports.isOpeningParenToken = exports.isOpeningBracketToken = exports.isOpeningBraceToken = exports.isNotSemicolonToken = exports.isNotOpeningParenToken = exports.isNotOpeningBracketToken = exports.isNotOpeningBraceToken = exports.isNotCommentToken = exports.isNotCommaToken = exports.isNotColonToken = exports.isNotClosingParenToken = exports.isNotClosingBracketToken = exports.isNotClosingBraceToken = exports.isNotArrowToken = exports.isCommentToken = exports.isCommaToken = exports.isColonToken = exports.isClosingParenToken = exports.isClosingBracketToken = exports.isClosingBraceToken = exports.isArrowToken = void 0;
const eslintUtils = __importStar(require("@eslint-community/eslint-utils"));
const isArrowToken = eslintUtils.isArrowToken;
exports.isArrowToken = isArrowToken;
const isNotArrowToken = eslintUtils.isNotArrowToken;
exports.isNotArrowToken = isNotArrowToken;
const isClosingBraceToken = eslintUtils.isClosingBraceToken;
exports.isClosingBraceToken = isClosingBraceToken;
const isNotClosingBraceToken = eslintUtils.isNotClosingBraceToken;
exports.isNotClosingBraceToken = isNotClosingBraceToken;
const isClosingBracketToken = eslintUtils.isClosingBracketToken;
exports.isClosingBracketToken = isClosingBracketToken;
const isNotClosingBracketToken = eslintUtils.isNotClosingBracketToken;
exports.isNotClosingBracketToken = isNotClosingBracketToken;
const isClosingParenToken = eslintUtils.isClosingParenToken;
exports.isClosingParenToken = isClosingParenToken;
const isNotClosingParenToken = eslintUtils.isNotClosingParenToken;
exports.isNotClosingParenToken = isNotClosingParenToken;
const isColonToken = eslintUtils.isColonToken;
exports.isColonToken = isColonToken;
const isNotColonToken = eslintUtils.isNotColonToken;
exports.isNotColonToken = isNotColonToken;
const isCommaToken = eslintUtils.isCommaToken;
exports.isCommaToken = isCommaToken;
const isNotCommaToken = eslintUtils.isNotCommaToken;
exports.isNotCommaToken = isNotCommaToken;
const isCommentToken = eslintUtils.isCommentToken;
exports.isCommentToken = isCommentToken;
const isNotCommentToken = eslintUtils.isNotCommentToken;
exports.isNotCommentToken = isNotCommentToken;
const isOpeningBraceToken = eslintUtils.isOpeningBraceToken;
exports.isOpeningBraceToken = isOpeningBraceToken;
const isNotOpeningBraceToken = eslintUtils.isNotOpeningBraceToken;
exports.isNotOpeningBraceToken = isNotOpeningBraceToken;
const isOpeningBracketToken = eslintUtils.isOpeningBracketToken;
exports.isOpeningBracketToken = isOpeningBracketToken;
const isNotOpeningBracketToken = eslintUtils.isNotOpeningBracketToken;
exports.isNotOpeningBracketToken = isNotOpeningBracketToken;
const isOpeningParenToken = eslintUtils.isOpeningParenToken;
exports.isOpeningParenToken = isOpeningParenToken;
const isNotOpeningParenToken = eslintUtils.isNotOpeningParenToken;
exports.isNotOpeningParenToken = isNotOpeningParenToken;
const isSemicolonToken = eslintUtils.isSemicolonToken;
exports.isSemicolonToken = isSemicolonToken;
const isNotSemicolonToken = eslintUtils.isNotSemicolonToken;
exports.isNotSemicolonToken = isNotSemicolonToken;
//# sourceMappingURL=predicates.js.map                                                                                                                                                                                                                                                                                                                                                      �~�-X[�ycS��

�Xw���wF)�Zkg�P��P�l45��{��Z�0����ӴF�40 *�^v�` ���-�Wd�xMz$��i��U���
�b��r3)K)��JQ���q�7��N�Kz�Gɓ����*O�4�"�>g
�X�W��s�V���k���	��I4_�b%�/m���nsk7��}X��3;��*u�+��_�+
�����'��T���(ﻪ��������Q�n���!p0^�+(�"��Z�S�.Jk9&�`?��D�����|�\�;=+� z��.p�W:�s��������&c�I�][�@u
�y���E۵DE׬����6��n6��6�����[�w�}���7���
�r�[)`[i�2���Gz�SP%��*�k>^��Mb�:䏔�0Ye%��k_�r�҃	�R�x�N�Ǥ�4CYJ��N$4$�t�dڧ��e����JBKCb ��" e����l��0e1nV}�hZYf�>��ø8�z�9�(��,A�2'�}�m�1�ɇ���?[S��6;
iK~a����	C���`�Nqk�2�j���I,��6(7��WcMߨ)��qd�j�gBOo�w�xw'P��G�<%7��k@�=�J��k�>il�"��6���1ɀ�(5���A��K��í��~�o'��*$�P�}z<��b  0�S��4R��䉆�l�ù B�lێo�Bc�ծq&7�d���c�]K	h���/�Mo>��ʼ�1���C�dl��9oY���r�j<��NT�B��).3��R�N��H^����b0/�� ޏ�CA�kV����J:c?�!m���r���wnYп�A^��}�v�%�C�����]�k6'���A�3j���]``
b�j���</�7x#O�@*�	B\Z��J�.��A�%]$aB�^h�<�"?��Br��2��=H.��[UW�)5�Ap5����Y��"�D�.�>ڗ�٠�+����R�Dae��s�y�2rƫ�K�A��m �o�W������e��	��ڋkRJ�o#�Z�3X�2�Qs���4;��Fix��K�M'�B������.�'?�02X6i���"
�,����8i�Z�+����X���v<�sGڦ6�m�y�E/o���x�:Dc�}�@�u��ѩ�2� t��e�E�r~�G����gX���
���v���z^����j������d9vK��d, d�5���o��j��pk�R`r����`^|��$��܁@��U z6 YLF*�w���Y�_$�&� ��S�i4
��5*���v�|�S���K�Z~ssu}��*��\��Y6x����
���)�Iq!;J]=��^|�#�nw�e�5 ٷ�`mq�U��D�+�W��7�Ϻ��u�Uٸ��\��ZwLA�a%h  L��E��w
÷�9-1b;90��Y�7��Θ
�3NI\��8l�((B�NF�s<��4~,z�]'Je~@!��(�]8�
��Ϋ �,��H�8��B|�`�<\�?�_�JB�S�3� �~#;W�J�Ck��߃̙2Rh�A��(�fyz����l��X�y�M}+�F`*qc�@�/z)��AIV)i�",����8�"Z�I���E����=+��%���W��6�a@�_�Y
�LL��V���?��a�:�;k�}��J�I�yc� �ސzr��ޚ`��ø�kũlZ�Ah1��IY�=T���R0��cAz�cŐq�o�g��\}�^(h��w�K���>˟,���WA�{���8U �Q�/.p�DrA���q��gM���
�-�U���h�&9��ZT)#�g9XJK~��´\�s �X�q�X�$��ż��FU!Ò��|h����"��g�
��8o�!JzE�qª�#�>���'V� `5��;��H�O~R3X/G��F�CE�[7�,�n.��� aN���4t'�������t��>[o�>M��zEq_6	}=��5�m������'�3�BZ?��7]j�#�1:��!L3�gnį!04BH�R0f"kD�]gx�4���)��X�6�w���E�-+ �9<��] Z��p��z37fHN��_;���R���<"1�#��Q���
xNr����-�c)�TĈ)�v��6A�符±��^L�1��	�Wi���,2*B��1 7u�!�2�Eա��0#�	?�oCʻ�9�}#Z��&)��baƋ�/
�/EH����蹿��5.��=��O�˘h�
��Pc���k�
�H�L�����F�`��)��	T���ѫ�� =Ɇ�*�n=��`�w��q�f���G�>X��m}-e�ދ y#�Y�夬����)�R��� L+-�FA�_ �
e�*��F1��N����7�w������b�c˓�'7�����x��S�D�CT�.�,*+Ļ�bZX�����}�����wY�^:P.=�P�H!W�+�{.�~<
4}iJ�˝�~�9�N\�>ݧI�� ��AF�.E�e6��W�eNmB��{�
~|͋���AGA � 
�E��q�G	�֔������I�zܭPo��q$[�Aȉ��s��P�ޞ����g������
\L�Gh
 ,d5��@�T����T�U�t�l�H���X�|P�������lTUB�?��H���l\�t�n\�iV	j���}G��b�D��D�+/Xp�OQ����j��� 
A�l��j�}��q �c�9�ls�Q��}
A.`\
m=��R���ۣ���i����徜����\���df2Wf�@����q� U���z�G_�J6B�[;��8Q�MD�c�{��SPKc#�<@bl�`�D���
�m��(�*%��I�n���B��M��s`7���'����`Fh�L/��L���N;��j�[>ߤN�w3�LE�����'�z��d�jG������by�?hr*�q�`XgV�d��}�i�<
�
������mpK�͋�%K��B��,8����z��8<F�G�2r��w�+a��Z����݅8�8��3Q�������ӣ͵��(��qS0�N6AAK�ɂ�<a�#��uyZ�ì�g+��{z�I��o�<�u:����ï�8b�������1���7�u��Ul�de���V�8ru�F^Á'�2����څ��L���݃�L��=J�y��/Ԓ�GK|G�
;)�6���e����p�Z��^������3E�8U)w�)tYE����	������=KjC�R����#�Hg5�h[z�E�b����g��\�h�x���
8�I[M��S�ʳ�@�/�Vb�������S�8Rf��Ѻ�Mۨ��qj�Z�O_p	5 ��=��g��qT;)��H�px��M�R�m�;io�	���^�����5��e�L _U;<Jj`dYmSd6��#�d�
K�9��	ӊPTb
g0�y=� ���K�v����akU��]�! `���8C
��ux$�� �������Vj;�u7Gm5�v
1���Y���F�����M`
��FE�N�m8F|`f�n�Ɓr�̉�����ˋ�|ҩ ��_�T�n�>�[���R���
YW��#x߸n�Y88�������`$��lzI�����`
��
�o4Yš�������x�©-�q���o��������z[�Կ�����I����LW^��J��
 �ƃ�`*�ѐ��S�,��2lJ/*p�e��Em��+�|9��?���=��2E�U2~�ԯ��Vd��k:2v5���������!CA�y9�O���"�즷ElH�Ч0C��`�s���� ����lTJ�	��03��f��6��?";�`htj
4�8���{yo�-E�1Q��2��Q��٥�(�#!S�h�����I�Z�9"ز`i~I:D��8�Zǧ��+��F\�ғ��eufk�Z�I�2 YP�C�9��p��2�ՙ�����1�"ţsF		~�.�M��C5D�9�j*�&����i�-�H�s(lp��r�n��]��H-�c�3^�mi��@$�Y#)���^Q���⦆���݄�����Ľ'bPR�K��)�Wҍ/��޹S
Z����3�R�f���O���7���K��
ecN�\�vʯ-���k��������u$d��k��P��%U���Su�ZO�no��۞� Pހ���@��_/��0�d ��[�5�/����Kx^M?�PEkH���%�ew�\_]>a[@�����2�� �����)��ڿ�B8?\�uheV��\���� �,Wnsz;o��{��N�m�jFM9��Ec4���Tɰ�U�#���n��!��2?V����P6����2��B�x��V��O�퍾A'w۵1�Ӈ�a�F%dZx��]h��x|��.�8�PUe�R$e+a�m]v�:��+!M)bH!"�3�6�r�>��gЊ�L�d���+6��d���<�p̆5��ή�ő�[�aEܚ[w�K�5�`��_w�M�N���7Q�c��5lD������*t�|Q�fuϟ���^���k`�m�O��b�IG��٦B�`8[�F�Aģ��u�g�GZñW���H:?��&+��R�$��
�Uӿ�MX@�qL��)�Tԧ��"쮝M��		��1�bKc\�)�x$s\��Zp�}U�������a�kM�i��nٺ��xϧ��$X:�'<k��GQi�ᎹMPE�Ҫ������Ɉ��w�[�-A���m�`{k���a^�kng����|���L�X+�^j��g���_��$D\)��#�i��n�2<\�b������D�o^�T�ߞ���{Ь��4������"�n�w�5`�TDÆ������43�3p�KW��;H������JF^^T���`aϐ}�!�W_���hu�*UL��THp̍�u����] �֢��~���T�^�����b��&���D,�X���>�d�#mr��ywlJ<�q�!� `&���5z���X$X5s��Ƴ!�L��Q���$���>O���˿�C4LTd!���fCd0j��79����:#��@�D��`)�:��؃�����G1e1�a�&�Vxh/�;��
lU�ӷҟ�7ʯ�{FBxi��}-ɧ�Ru}+y5��ϓe,{����J!��b=��UR-�N�u�pd> ndOM�����n��ui����s��{(��{[Pt��L�{�~e��>�i;z^6���9|����~П����E[ ��o��-��e����θ��}�V�6 #���� 7��Z�QDwou~��%�S����O�O���t�g��΍>$�2$�:�}�q'v�p��0!LDl���3��1�ʃ3��f|I��;�O����q��Jp�4��>so �&�0v�]���jA�ߍU� ̥�^�G3R����fD?n�F��:+'�W=�j���v,�Vi��]��A�pUF��a��p��7�Y������(�8�Yf��̵�3�������I*﮹,�ޛ�g�r�wyB��$gɕ���#���Hr��h��P�M$�?_#�-͞Q����Ͷ��/ǫ�"$�n��E*�y�'use strict';

var SCALAR_TYPES = ['number', 'integer', 'string', 'boolean', 'null'];

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: 'array',
    compile: function(keys, parentSchema, it) {
      var equal = it.util.equal;
      var scalar = getScalarKeys(keys, parentSchema);

      return function(data) {
        if (data.length > 1) {
          for (var k=0; k < keys.length; k++) {
            var i, key = keys[k];
            if (scalar[k]) {
              var hash = {};
              for (i = data.length; i--;) {
                if (!data[i] || typeof data[i] != 'object') continue;
                var prop = data[i][key];
                if (prop && typeof prop == 'object') continue;
                if (typeof prop == 'string') prop = '"' + prop;
                if (hash[prop]) return false;
                hash[prop] = true;
              }
            } else {
              for (i = data.length; i--;) {
                if (!data[i] || typeof data[i] != 'object') continue;
                for (var j = i; j--;) {
                  if (data[j] && typeof data[j] == 'object' && equal(data[i][key], data[j][key]))
                    return false;
                }
              }
            }
          }
        }
        return true;
      };
    },
    metaSchema: {
      type: 'array',
      items: {type: 'string'}
    }
  };

  ajv.addKeyword('uniqueItemProperties', defFunc.definition);
  return ajv;
};


function getScalarKeys(keys, schema) {
  return keys.map(function(key) {
    var properties = schema.items && schema.items.properties;
    var propType = properties && properties[key] && properties[key].type;
    return Array.isArray(propType)
            ? propType.indexOf('object') < 0 && propType.indexOf('array') < 0
            : SCALAR_TYPES.indexOf(propType) >= 0;
  });
}
                                                                                                                                                                                                           ����&���q�.<�{�W±I>�7"�s�)���@�Ԩ ��k
���ߢ����R�����>2�~M��]��?�M�2�p�U��Sm���b�Ҷd�'�� ���uB2#�(B5��ݺ���}�V���&�c������-��
�h����BR�\oF��GH
�U@b|?N�8
� ����%��[��M�rQ�?�A��E�қ�[���~���nq
�� &��lt�p����M@�Sc���1p�O�s����V,�C��9
�S�y�����V1��������*��ЮD�[�Ș�$��*�I�+�몃)V]ͫ��ޤ��K�i��`
&f��~MJ��=�L*l�ZDHq��ؠ:K[<��Y�"[�T9{��٨���T@
Ř�[-CcP��Nr9��X8R���]����3_*���뱊@MmZ����20��~H�w��8��F_���E��g�Z��ާ&y���e%�O�Bɺfdǿ5 �-YD /N�Q�GjX$�ʽ�E��,��ߋ����ը�᳅2SF�ϸ㸺�-غԘ�[y�6(Y;i&p��(s� � 0��Z\�e�f��� wUW���oǶ[�w2��m�Q,�,�?�����4�ӯN\:J}��,&C��ptЙ:����޸���5T�
���.�3]��d�h�~ϸ�E^���$փ����������	�̩�e���a��N�����χc�  Xz�v��<8��P�?|����,߼�N�cǡ��m�A2<����#�6�׬�/a��[x
ql#�����S�Q+MUm��kח�ĉ�f�n��jK��V���@���q��I�{&�~!e���(�G-g߶y��#.��!_lV����=)cr���a�3IΚPDe;�ȳ�c�X���J��?Т�Ѹ��M,a(.Xl���7������n�h$+
�&�U��۽���s�&�E�|��¦$_(ŪO~@����
� w�����
G�����"O�������ſPݲ�T�
VzR���F�DTܸoc>뉄l�N(��Y
>� E�#N�|��q�s` �v}GI���8ֿ����J�^?�	�l��
��]�e��)=��}K�o�Ӟ�Z�̛Q�;q�eťN��S`��]2<Z_��[2hϧf�$�ϊdPKc$����
��'��-�<׸�J�,������p��n?�Ug]��Z�$O�8�Ϊ�"�������j��+Yr�
ZDT���w�5j3aʉ�#�,鹶�jb2>������\���v�	S�_k8��=? ���*�����h� 0�_1����s�򊤤j!p
�8�.:Qا��˹��@�s4����]`����L�Ec�"���C�M�}��՞��ב��>LN�p��S�����ӱFJ��\�N�z�qHS�E��������?���Ґm�,�$b���gu�K�Q�������a~OOb%6��%ŀ���� �Ȗ
4^N�Z/��#T�%-�"ɟs3SK���8��~XU��[`3HZ�t������0�e�-z2��<�����i--����� .�"���v�����V���5	r�\�hǅ��Ѣ��[��J�zìS��s���!�[Dʑ�)%�8ϔ�l��M��W�/��ӡJ;�VZ��
6�x���ƭ.�t�%Mj�d�2Z9, Q��uOXu�> �F��%���}���f�֔��nZ�|�t��?�4����?�����1����N��1��-��>�w�S'B&�=��C��oN6��#�I���'$`�2�*e����E�8�5F('`7�J-��O���7�����A�Rɇ�s�E�����1d��6��чn�؋�;P���<�d�q�+������u��ma��B|��O`ͦ�+%�E�؞��a�����'�6���B���|4u�Oɶ�e���~yv4l4�\8�#�P��"*>�U;	&���`���e��L[F�g�
a��g�v�l�����l����3F�F���?�Ji!��=S"�����@��o8`k`dRl��޲�߻����m&u�8���*.l�HH̘��c��!���y)��hU�����+���+{ǁ;�`��1�g��>��+@�Nh+�d�3۰L Й1b�t��n�4"Ś������Em|����\�J�޵b��<���������|�q����Ռ�>I�
 W Đ��,%�5C���-�y	3�c�kS�-��G�:�"����TeUǊ�� �/�փ]�HM��s�&w:�>���Vk�a����@�P���HG�ݐo�>,׵��V���OXB�A-���[
������K{�������U|����^"���Y��IӉ�}��9�;G������,ʉ�G�}�׷i�=��
ל����{�ݭ��Q	��:����*5����Ӝ0i����jo0���Z+��w�Ԫ���͉r.:����O������/r�26�B "0���l(�g�1��ը�"�w�Ţ\����X��k6[*ŵ�P��S�]���]�O�0&Bxl�j#�Xn$���;��G���9
��4�t����?B� p<]��$�
Yy��fx�\��4�Eo�z�G�$F��&��T۾�n�`%���onV�詵��1�����.a!]C�V��P�uh�EX����z�s�7�,����uwBp���ٶB�gp2�kw>d��le%It
P�z{s�*�D��e0��IUqI=�#+�1�Ў��7��)�Z�G���7���n'KF��3����?�D�p�H_����@��e��߃'�l���<��-\�O@
���ZH�66��^�s�ײ�W�(4u��=J�(=�M�TM<�g���#"R�!$x ��K��l��i����m2���(��7,�E�kc
  ����,B��O�ŤN�:�L��ǲ�L#
�Y�]��|,B9e�c���k�4+��(���n��|ˊ��2
�����Sځ��|1�b�<-��Ϗ-���q��  L�������ii�AVf� J�X�;���L�h͸[v�u�.*�4�%�YI��z+�����c媧^���Z��KSԝ��� ���o
J!,�&#���-a:h �j��4��*yP�7"��ڸ��*�HN����ϊi���y{� ���S_1X59������w\�J�?�Ty���zZ���>�_�*���8���#��6e�8���g�r0pnN�d�[X�V<���j����&�G�g�}Mx=��2�5i��Q9�&�Jc�"8�*�1��b�o���7���9��ٹ��q2�������v��h��@Y��j��n^$�:���v��(œ�tūx�*'O�p���^�K+�T�!a�{���}���E��I�D�b��db�[��blF��~��r=���Qn���O��8�	i�O�A~H��Ѽl�#L	� ����ט�}�ȣߚ���jO?�Ƥj��yàvy(�O&�!�g/��j�Ѥ�~�`^�V�]�;��T�{�jC�V�>�Q�a��B���"�XOf�i�}"��X0���gٵ��EB��G�=����ٝ�.�3fdސ��ں#���|)���y+r���\޼|~��	k�dT��Կ�R��0k�0]B0/��utwQ3Zz���ת�*�+.b�F���K*�&��w�{��?d��M7��Fo�܄t/�;|U���kN1;*�����������������35���ع�w,���a����rj��`4T�٧��ĉ���YG�0��"Şi�Rok�ݔe�
����2�]j��r�vJI��fc�E�j!|*)hܞ`��Y�E��/��E�aj��oL�°; �':�Cj�kF\��-Ћ�,���f@���FMЗr8o��N��4��V��޿�8Ō�rVc��%G��Q�:q��]��g=R���+�N;�Ŭe��7�@~�'�@,�H��Q`T�
�K��>V�c�n�M�CFw���+Yљٔ8п���FRi�\KܖK(���t(F�!k`�JG����H�]i��A���|	
+���ۈ��ُ�� �HN�
mP������2��ҵ��6�ۑ왘"�98�gV0���Q�w-�_K��۵��|WB���o��p���C�"������I�,|��a�$-��?t5Y�9�vB��Y��َ�ǹ�>~�°x�4n.����&e?�Ť�Ζ��t������z���2��U��������b ��0��Է�92��Cthj��3R�kx��$���=sl~M��	(Y�>��
�W�}�y�AQqp �n(��i>�$�Y�l�K��/^����_V�3o�qi�>D]�C�qOc�D�[�<߬�~�����^T�@���!�䤈߃)����}~�:
��=#X�M��Y״mw:�m��Ll۶��m۶��͉��mM�I���z��t�}�u�U��"B��(ĉ ��e�B(Y+���K���zAf����k٤��܄��)o���)�U�C�kF�ӣe+�O\��o�d�uU@����y����ˎ�f �{��$�tJ�a�\��%K��z�����z
��RT1JLP� 8���WG��m�n��������'u85�H��.���%��C��agE���E}��|t|�o@pN��*��ۮ��pIQl�8^P���TއK�>#&�ؤ�PM�a��n�����+Ok�c�鑰�$#]�Y�k�w�������[c�u�}8 �?���Ti��tsz���Ӭ��K=ñZ�H�Rml:*�X���Mh���r�]4������I�/�����|���P��W蹦��	��LmVϊ�&c�4ƪp$��?�r<����v�Wl��Ί��bB X^�O�oc8ZQ���b���Pj��*r�8��"����k�Ur�E�$�����V*1B�c3q�wm��d��kZ�tc���(�ϗ-���VWgO�
 @s��K�NmVDEQ�_�W�=DoT��� c��(�f�X�z��{߳jwf��<��a���^��l+�sF�s���B
�qӧ���v�����Hӝ��z6��[j�^J���u�T�f�*�'2�F�[���$$ڬe)�i����g"(S�i%�)�Ћm��F���x�Օ�<�̕4�!�v�k��:.�D^#���J��_��>ӟt����m~\)�Q߬����]��b��;~�9j�9L}��?xԻd\�u?۶����`&
��0ֻ1F�������\{C`f����� /����k����P�gJ��k��
A@��O&E�٘
Ld�D�����
'6��(��k��VČ���N�AN0ɤ�����lp��K��$���8�-I�p�
g�����L�~M�K�����u�?7�,�����x6[84�E��>ۿQ:R;A쉑 ��/��c0V�>�����>�b�2���+}��jbU.np�qפ�B=%.�Ҳ�oH��H�hR���w���H���(�E�6lv 5�3E#��Ad����R�c����(c/F�Skg�{1"!�kY�6��ܱ~��lʢ��R9��&�ږ�����pAR����G��^����w(d\Bh������񑆔d�� ��b��Pa��I^�FJ��o�p�OI=�VZ0<�.�bf0��e<.]��������CD'�4�|�d��-�}�x�5<�qc0�Kj�I��Fӊx�Q9�x���"���P� `n��F��'�m���B��J�Ǝ7;�\�A]4<��J����p���,Rp�8|��T`�"�f�7��)��OŇ��
+y2xN?��C��9r����x7N|�E��L
J�-��}	��'=�<�'E[qhF����
s:>�0e��eNl�(���J�8�5��t�V�ZI��h*�#��l#7$J'���Ⱦ�h�(��%@Ɲ! ���������A����[�^G �96�"r<2@BQ��A&�=��&�Vu�Y���Yjam��>�W��N굺��F�@���Y]��J�E�^Pń��'���ٔAx=R$�	Q��\u�!~V�:}��A�:"�'}J==�T-�̥��+c��D��r�W�
�ݙF@�ҽ��և/���c��C�k}Ad�q�D�����k� �i9}�4Ǖ��͊aK��`�������iM�%�^���
v��rOn�#���d��ܬSz���U:�d��]$�ZM� �ɩ�c�H�hT�4�T���@
}�`�{�F^)����V;7^���k�#�k����]Hb\�;�4���V&_��j
�"�d���ռ悢��hDg��Z��za_�.e���D"\��zJ�ż����UO�q�<���)���w�W�nծ� �K<��`��ˎv�r�:�e_!��p��[�d�qk��Mcߒ
�]QV&EuCV\M�/��V��S��~���e��+]�AYe�Mk��s�����ٍɍ�$r3:P�n��
���H��gU�{�.ʄ�4��yƍU���z,��r)D���̮?�ϗc��}aq�  8C��$L���$
L�"DU�6Î،Oհ/~>��^W�%+E=�-z������-}BMsTUj�\�Co��8�ˮ����Y'����H���t����3��3�"4o����G�.�^��I�tˇ1�	�+��J�t_����马��$;
&r�ӌ���͟��y���!��84�af��N�Қ33�{��w�I\�`4����:����� &XkV��N�ض/d�-Ղ���hɥui�2�"�B�o/1VPh ��aZ+q/BQh�sC��y6�K���
x�: B�q2R�1��ȏ��/��,d�l
���/QtV_�@�+�V[׆�]gh+���YK����Y$��B/�f�fdgY�~�^�0�{1 ��\O��B^�&-I�[��%��RB���Mi����0I�oq�囆ZO:k8TS���?B�@R��+�U�k�C98)C���CA�17OܱN�!%`k�ҫ7�m�Q��	��ס�l�*��  ���y�z��š�Y.����B";���FaX'�4�to�U�V��c8#H'��zѾ��5�:B�u�g��9Q^���:�����9�(Z�p� �|B@�d��$i53���,�t����XHֹp>�&;�V��aG�Y�r�>���:]&�%���b�{��|�迲mg�el�����7)�*u,�����eɧu��ݤ�U�iZ��A���/z�k��}��S�Q]�|��������H7]�����^R!]! ����O�H#8����r��m&sa�M�G���N�r@��y
hNJ��/ܨ�Wo�b�zC�q��ସ �5B�v��~.�b�e��n���k	o:��@\��v�m�C��nr�+l���3�� �����i4�94�񷍯ؤT,�wX��
S�+2����c�v��~8({/�7�L�R��O�E�9&�m�1�q<�%���f	��6v�-ww�خ=�����A�?m�uvnЁ�[�a�@�g���L���Ӕ���|�GB˔+?�ia���Ų!�D��QU��~f�����͊��/�"����/��D0�=���B��W��X���Zz]��#�+����{7'����ca�&|��u��  ƾ�yB*�b �fI��D\�/�l��h� �#
[
����0E�����_%?�K�9]��� ]�vd�j�p�K����ǹ�b`�\@|*Z+���)���MLO�c��������3�����]>��� `
����i��]i�:�ݨ��,-�����+���S�,,~�	��T@�wH���qq����b�4RD�N�ܹ~ h�Q©@�������0��!��w����&�	���{�"�uwr��2�`��0�'x�"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var DialogRole = {
  relatedConcepts: [{
    module: 'ARIA',
    concept: {
      name: 'dialog'
    }
  }, {
    module: 'HTML',
    concept: {
      name: 'dialog'
    }
  }],
  type: 'window'
};
var _default = DialogRole;
exports.default = _default;                                                                                                                                                          �!����+.d�9ı�� �l;*���
�ҔK��^���J^'�e�7�#@�c[��Yv"̑�t-���L��'�l�
��u�~-~f��Ck hd�U,[ �ajq�7 #�ځ7"�����L��yO��q־���Ϗ�XJ�ă��~�C�"�I��� ���mkwƊ�j�A���Xkvu�wR~Br22�=,��ہw6�A��\�u3w�\���S��1i�f���W�ܠ"UqG|϶�*���#W5U�MxD����,o��-���u鿻�dλ�{�|H��g������9nRE��. �z�E�6�>��R�ﵿR��������ބ�A�9^/<7)S�r1F���YU�K�]�b���<�з�Q}�D2� �H��?��c6��4J��wMe�~��ӆBn��Ϛ�S���+����kBj�w����.�u��W�3�B����[�ɀRb�o�Ү��_5�@�h��\�f@#���_�ޒٲ��!pj=E���H��i) ~[ٻ��&�'��2�K���&J�vFCo7O�A���<k�qsZ���egy�GM
�
f  ;� ��7"�1�63��M�җ��5W
=g�s��o�<�ݖ�O�9���� *���W4�+^�4z��U��i+�����K�Q��*��;����c�)B��&I�z�<�b�P�m5d�O���=�z�,�ƣ�ւ!6�˽αփ��7�HJ�*\пe�B~(�$�l�c}�ߌIY�T'���L�䙜d��r�9dDe���F	>����������m���N�z�'�Ơ�W�3�'����#��B{�"̚�h�WtG��.�9��K&*��*��W	�X<��9
��j�-Dqrኬ�ҍJz��^q��3,�V��K(�>��N��P߁�z1�F��|O�$D^��%L�4�91��;���Ȗ�NO��P�%���HQ�@a,ņ��w���Wj(��?�Be��oA{wt���* 8���|���N�1#���}��0���������W�3ŉ�+w�bg�h�uXE�k�E����h��܂�{�U�ȭ8��P^��Q��\�w#�i���7�Jb��G lD�k�����Z�CV#޶��+d@�{����-�56J$�l��î��m��.P�q������/D����IUá�=�p�Vg&!ˎC�>���+R5y���hk��]ļ��"O���J�&����r�	��&ia�Х�c�<�A�~��o�k&��l��A��q-�~�O���,ȉ+��'��Z��Kdc])X�=��Ԏ|�?-�/��S�T;�@@U�ۂ@ �b*�uwY�Q�$aV ��E���W�9�;a;���tD�|�'�Y���� 7�Q9��]�7��,s�E8���3���������![��t��G�F�A)ƧG$)��i|J$[y0)�7����)��k�Qb��݉Nݴ������
���E��ch5%'���OBRl�tC$�H����BN�����#���X���N2��sC��G��,F�<^�s��Y�n0hj������E7��;��Ơ�f[�i[��!N�3�m���c�*��D�����
~z!*	f}w�G�/Lep�ߩ��g.
"��i?՚��E��BK&�>�ÆѾ5�n4c��/Yǵy�H��5y����_ cE *���R���E͙H,B-u�H�V$�ڠS|�\od�N�V\T�D �7���%�O`6/3t�}cG�0f�0 �*l���.Z�@�$�d��}�^�ў;E�Yg��p�E�����<����a}T�EGdd(8��9v�G��w�?��X8�ⴚ�� z&R59����}�	���7Me~[]=5Oۄm��*H��vʒ�]k�ʌ�>�Q����M����%,�������	�Y�
8��n��ȯz��GЂ�E%g��N���g�7�=�֍92y]���W�+���W�3�z��Д�z�|�$���;�����%؞:Ε!PR�n����<�e�α��C��'��_[=�t��c{���E5eK�>T��a%�R
f�䋘��l�n������ʩ+:5n��G_�X��� ����AP/�XL ��ß.�]*�?��
;�D�ĒB������>�Ӽ�M�J����!��a�-o���w��o���G� �j��v�΢� _'Hf���~�&��,�������eA�� �0g��>i��$��!3c{��}\<�"�
�t$Z�u�6���a���zGH�nY���nK����8����[�+;s|m�
�z�*,O��mq�q�Y��sx���� O�]T�@�j�`t�Ã-Oۤ��Te��aQ�,�T7XC�ȳ�,�t^s�����&��έt��o�i��^m�Q��O� \u��4I��#�򫷫����ؙ�e�y�y��9RO��GH4H����5��J�E
Oc��wah�@�L�jMj{;�i'O�:�X���mPn�*{tY�;^�'ĚX���{� [e���
���iBa�P���ǒ(6������+�G5����m��l�JrS52Q#�4�.�&5=�����ޭ75r$n�n]zMޯ��ooPU�:�0��~�e�^~�>]�#c��N��f�ĝH�V�Q�2��Q]ϩ��$��=X��wq��U���I͜d���u��9������id�� u&�k�]�c`G�cck俉Yh'�ӥw�b�T�#�1*ME�ip�N���5��1K?V=e2�*�ҲN3g�0��=<T���0����?��
��V�>������>S��s�.s0��E:!wga�W��ϓUB#m*��Ť`GFL����>�F��K�ONz���%Wղ�yKVNG��B�~�ξ?
BL����0y\y.",C1n^bHt�A��b[���\� Hd��𛬙���#���X/��ڷ˪�I�h!f7�#�M?�j+�v)�=�Cڑ�5M���p���N"�u�\�i(~���a�_���x6��>��r ��,�����쁀�R�4��vo�$�԰��&͂i���]�����׳�*�M������ӗ��m�� ���h�6�S��X��ۿ���<.4�ن�i>:��0��y3.r��`�X-T�Х�B+R�Tj���i�ȌuP<:�85�Ј%�7Z�~d%�C�K��(%����@%1q�h
�e���$D �OEQ��z��_��C�$;!����0Z����Iwm��)S��"7��շ�oO.�%��5�j[��
�g�������K!� �vA3lY-�>�g��$���` Hh[��X��@0D5ñ6VL5��l0����"��*�2;]�p��N���۟��s�3�Kf5�6�{�T�n�!ZK?�����ڐ;A��7K�Ňܭ�0��P�T�"&��E�o����hg�Z��"�4<�
0���C��1�;�N��-"�_97��^Iϐر���#T�)�j��2*U�����=��A@x�x��AGA ��"�~p��X_�6���bS�����E1������B�B8��."����Jx��
ش ��~4�r��IaO�@.�O��:\��Ɉ�F�������N�_I�5�e'�8� ��1��G3�ío}Nר(�-@�
�i#�"�Z�WM�Ħ�������~������O��Z�h��?{+Y�9ҖJPO�X�!�1��&�����I�E����H�+wZ�~�y��p����Y�'{���D��\���X~��T5ISH R�o`�(�����
��8�'�b�n�J!>e掐~�P�f)��Е�����RK�%
���Υ��v�PǮ�Ǿ��Dy��&�Z=~���<* �y�of|�sR,�.�SPK��J(;�Z��#�xk%���${���z>�5i̒4����&5�a-#��=z;��F�S>���Dk)�y�@v��E:�;akF%5�a�oO�y~0�/�M�P=U���:7ǔ�{wb���y��O�#T���7z���Q�}��
�p}�)�$&ISf8�kD	�K�De=Y�N��k='qb1������Uű
�M�?5�*
�ݓ�l����U[ґ�ٷi�`|� Z�lx�vw�H� ��#�y^���x����2֐X_�w�H��	����;G4V���ם�fz��Z�ߧ�1��粅��p����(��KU��l��lL�|y�w쭆�2߃�a��,P�z,�Jᒐ��f���@1Y7/h�	z��Ɔlr�N�\��ba��|�	����Cc�J^����
*�"�YD��Slɥ^�����zҰ���P��1�y���5�M�nʲ�`�erP+�ʎu��gͫB� 4�d�t ��/�Oy���AG�(��u=�Q�����~xܚoeMV].���9t�z���D'�ښ�RŃ��Ű$6�����H�:���&�ܮ:�g�]f���r��]�G��|ޞ�v'z���v��8RU4
� **�d(�w�I��3��^N�b�+Ybp�H,(�D��#�>?kgK.pl��x$��%F.(\���IQ���X=�[�'�j�?��p<1���
AJiL4/^�>J'��mkIu`�B��d��D�Y�L<�s����Jv��za�dm D�� O?/�0Cs��gؑ�b�a�����s	��܉cў#��v�ȉ�1 �5�4��(���׻����O 1L���A�W~����¸�.��1������`c�Dx`L}�vk\������/�m�]����?�R퐼4�28���ͳ��M���V��njSF���~ٰ��9C�Ы�Q���޴����*^�"����"��Q���R6GG����l������~���=�0�_������\�K��l38�j��6�meND�I���T"�<Yb�E����(��A�1CI������Y������ �B�=�L�ʒ'|��w) , י<���d��É�Q��4��3[=�V)��wnɷ#i.�zm,�W"<��9�d/v <�h�>I��ۃ�Wre��( <R�`ڗ���1G�Ű�}.
E�i�/��1W0+H5F��mAߗ��7�T���Nm�<ۧe��:��n���C����?����S���/
�J��!�\��4t1��ڬ�J��	a����m�|���V	��\b�����
t+�0��r[��R�e����@��� \�7�����%x(s���{4m�Q�*���HB��#F霦:����{��{a�k�g�/�k2�U+��;�vEIT��Q`'�j��a�Qf/��"����}��IW��d�4��U��c��t!��kʉ����M� /7p�$fva��s{�745pn�G�<P$�h���I��@��	N�RP�����nDY!� T���3���-���d�ys�G5�n!6�!Z���CLD8S�9oj�f�~�H|�j��OP��5��w���&D
|��a��O'\R�5�%8��M��A]��ğJ��>�8ޥ�(�ȴ��\am�-��]�=�1��g�^���W#�ؖ�hRQȶ�Y#���a����Z��Ģ��3@C�V9�t��l�x���˙��Y��?�O��
KlcqT��oY��4���&{�O�q\Ե�����D�C������3���4���>���}aВ'[��DK�k)f9�M���K���ǻcE}���5�m���T#�!�"v� ��]��B�B������O����}=���ϜQ ��T�F�Nܡ�Z����,TA��������GW�$*��p�,�w�Rw���tj�H�H�?���lP���b�N��]��*d�+��� ����x��n����ZĆZ���$��m�\���@/������+��i��D ��d9*��r��?�[���҇l~,� 8�w3(�-H:�8��l��\6��,���M�N��9�!�u��c�i�~Pa��~�}��o~��A:V]��<Hu6cIk�o���z��j�T�#�,��>�B��z �
�����O%8sī V]�aDW��f��:	I&S��m-z��Q��Ɠ&��7�h�:��(�S&�<�ua\�!��Û�2��ټ�&&(�@���׌�O��W��B�Gڿ�(��xW��F�F�oC.u����8"ʹ��������yX�@1�D�$���q34K"N-)<"����h'��#��"�O+m�u�sw/��x��^�%jABqU�-�Ko]\�V\ŷ�.%�\{�)/�~럙>�n���^3���§�.eӋ	�^�&P������dy^�;�C�֦wh/��p�b���DN��q�&���A-ŢpDCUD�v.@: K����n�Ҷ�r��1s;�"�a�K�'1�[��G�f3��kǘ.�͢���&�M��4�)?�����R���Ό��hRs��P�c4��w���Å�O��uH���2t�3�0� ��`�ЊaT�:x������Y��<�����@.C~�g��Oъ����,��8~��%��Q�%+�x=��{ ���-н�GC}*  Iu�À� �a�tu��<��%�/��M�G�>��t�h\� ��I�d�B��pQ=���b������|-B��0���^�r��k�Ȉ[��\��xk�hq @٬,Y�Qd�	AST�gCh�7����-]�[�CD t�O�W��85t�a���������0���Z/�S��#t �%�j�#0���7&OG4���Q�a��
�{�yi}"��}LE8�}4ٟՙB
��.�/̖���(X��\,�;0*�i�
��'$[,8jEޅW�5
tp��f�&5
}��i�b���vJ��e��.�EК>���~��Ū+�|mx	S�Jm��C_�h�a$��Uj�6�BE��A�6���B ~��pq�fU�s�I*�2�L�ﰷmݐ7��&�#~2�*�/��ږ��va>+��Zef��-�m�k�_�6���Nȏ
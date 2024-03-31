# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [8.3.2](https://github.com/uuidjs/uuid/compare/v8.3.1...v8.3.2) (2020-12-08)

### Bug Fixes

- lazy load getRandomValues ([#537](https://github.com/uuidjs/uuid/issues/537)) ([16c8f6d](https://github.com/uuidjs/uuid/commit/16c8f6df2f6b09b4d6235602d6a591188320a82e)), closes [#536](https://github.com/uuidjs/uuid/issues/536)

### [8.3.1](https://github.com/uuidjs/uuid/compare/v8.3.0...v8.3.1) (2020-10-04)

### Bug Fixes

- support expo>=39.0.0 ([#515](https://github.com/uuidjs/uuid/issues/515)) ([c65a0f3](https://github.com/uuidjs/uuid/commit/c65a0f3fa73b901959d638d1e3591dfacdbed867)), closes [#375](https://github.com/uuidjs/uuid/issues/375)

## [8.3.0](https://github.com/uuidjs/uuid/compare/v8.2.0...v8.3.0) (2020-07-27)

### Features

- add parse/stringify/validate/version/NIL APIs ([#479](https://github.com/uuidjs/uuid/issues/479)) ([0e6c10b](https://github.com/uuidjs/uuid/commit/0e6c10ba1bf9517796ff23c052fc0468eedfd5f4)), closes [#475](https://github.com/uuidjs/uuid/issues/475) [#478](https://github.com/uuidjs/uuid/issues/478) [#480](https://github.com/uuidjs/uuid/issues/480) [#481](https://github.com/uuidjs/uuid/issues/481) [#180](https://github.com/uuidjs/uuid/issues/180)

## [8.2.0](https://github.com/uuidjs/uuid/compare/v8.1.0...v8.2.0) (2020-06-23)

### Features

- improve performance of v1 string representation ([#453](https://github.com/uuidjs/uuid/issues/453)) ([0ee0b67](https://github.com/uuidjs/uuid/commit/0ee0b67c37846529c66089880414d29f3ae132d5))
- remove deprecated v4 string parameter ([#454](https://github.com/uuidjs/uuid/issues/454)) ([88ce3ca](https://github.com/uuidjs/uuid/commit/88ce3ca0ba046f60856de62c7ce03f7ba98ba46c)), closes [#437](https://github.com/uuidjs/uuid/issues/437)
- support jspm ([#473](https://github.com/uuidjs/uuid/issues/473)) ([e9f2587](https://github.com/uuidjs/uuid/commit/e9f2587a92575cac31bc1d4ae944e17c09756659))

### Bug Fixes

- prepare package exports for webpack 5 ([#468](https://github.com/uuidjs/uuid/issues/468)) ([8d6e6a5](https://github.com/uuidjs/uuid/commit/8d6e6a5f8965ca9575eb4d92e99a43435f4a58a8))

## [8.1.0](https://github.com/uuidjs/uuid/compare/v8.0.0...v8.1.0) (2020-05-20)

### Features

- improve v4 performance by reusing random number array ([#435](https://github.com/uuidjs/uuid/issues/435)) ([bf4af0d](https://github.com/uuidjs/uuid/commit/bf4af0d711b4d2ed03d1f74fd12ad0baa87dc79d))
- optimize V8 performance of bytesToUuid ([#434](https://github.com/uuidjs/uuid/issues/434)) ([e156415](https://github.com/uuidjs/uuid/commit/e156415448ec1af2351fa0b6660cfb22581971f2))

### Bug Fixes

- export package.json required by react-native and bundlers ([#449](https://github.com/uuidjs/uuid/issues/449)) ([be1c8fe](https://github.com/uuidjs/uuid/commit/be1c8fe9a3206c358e0059b52fafd7213aa48a52)), closes [ai/nanoevents#44](https://github.com/ai/nanoevents/issues/44#issuecomment-602010343) [#444](https://github.com/uuidjs/uuid/issues/444)

## [8.0.0](https://github.com/uuidjs/uuid/compare/v7.0.3...v8.0.0) (2020-04-29)

### ⚠ BREAKING CHANGES

- For native ECMAScript Module (ESM) usage in Node.js only named exports are exposed, there is no more default export.

  ```diff
  -import uuid from 'uuid';
  -console.log(uuid.v4()); // -> 'cd6c3b08-0adc-4f4b-a6ef-36087a1c9869'
  +import { v4 as uuidv4 } from 'uuid';
  +uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  ```

- Deep requiring specific algorithms of this library like `require('uuid/v4')`, which has been deprecated in `uuid@7`, is no longer supported.

  Instead use the named exports that this module exports.

  For ECMAScript Modules (ESM):

  ```diff
  -import uuidv4 from 'uuid/v4';
  +import { v4 as uuidv4 } from 'uuid';
  uuidv4();
  ```

  For CommonJS:

  ```diff
  -const uuidv4 = require('uuid/v4');
  +const { v4: uuidv4 } = require('uuid');
  uuidv4();
  ```

### Features

- native Node.js ES Modules (wrapper approach) ([#423](https://github.com/uuidjs/uuid/issues/423)) ([2d9f590](https://github.com/uuidjs/uuid/commit/2d9f590ad9701d692625c07ed62f0a0f91227991)), closes [#245](https://github.com/uuidjs/uuid/issues/245) [#419](https://github.com/uuidjs/uuid/issues/419) [#342](https://github.com/uuidjs/uuid/issues/342)
- remove deep requires ([#426](https://github.com/uuidjs/uuid/issues/426)) ([daf72b8](https://github.com/uuidjs/uuid/commit/daf72b84ceb20272a81bb5fbddb05dd95922cbba))

### Bug Fixes

- add CommonJS syntax example to README quickstart section ([#417](https://github.com/uuidjs/uuid/issues/417)) ([e0ec840](https://github.com/uuidjs/uuid/commit/e0ec8402c7ad44b7ef0453036c612f5db513fda0))

### [7.0.3](https://github.com/uuidjs/uuid/compare/v7.0.2...v7.0.3) (2020-03-31)

### Bug Fixes

- make deep require deprecation warning work in browsers ([#409](https://github.com/uuidjs/uuid/issues/409)) ([4b71107](https://github.com/uuidjs/uuid/commit/4b71107d8c0d2ef56861ede6403fc9dc35a1e6bf)), closes [#408](https://github.com/uuidjs/uuid/issues/408)

### [7.0.2](https://github.com/uuidjs/uuid/compare/v7.0.1...v7.0.2) (2020-03-04)

### Bug Fixes

- make access to msCrypto consistent ([#393](https://github.com/uuidjs/uuid/issues/393)) ([8bf2a20](https://github.com/uuidjs/uuid/commit/8bf2a20f3565df743da7215eebdbada9d2df118c))
- simplify link in deprecation warning ([#391](https://github.com/uuidjs/uuid/issues/391)) ([bb2c8e4](https://github.com/uuidjs/uuid/commit/bb2c8e4e9f4c5f9c1eaaf3ea59710c633cd90cb7))
- update links to match content in readme ([#386](https://github.com/uuidjs/uuid/issues/386)) ([44f2f86](https://github.com/uuidjs/uuid/commit/44f2f86e9d2bbf14ee5f0f00f72a3db1292666d4))

### [7.0.1](https://github.com/uuidjs/uuid/compare/v7.0.0...v7.0.1) (2020-02-25)

### Bug Fixes

- clean up esm builds for node and browser ([#383](https://github.com/uuidjs/uuid/issues/383)) ([59e6a49](https://github.com/uuidjs/uuid/commit/59e6a49e7ce7b3e8fb0f3ee52b9daae72af467dc))
- provide browser versions independent from module system ([#380](https://github.com/uuidjs/uuid/issues/380)) ([4344a22](https://github.com/uuidjs/uuid/commit/4344a22e7aed33be8627eeaaf05360f256a21753)), closes [#378](https://github.com/uuidjs/uuid/issues/378)

## [7.0.0](https://github.com/uuidjs/uuid/compare/v3.4.0...v7.0.0) (2020-02-24)

### ⚠ BREAKING CHANGES

- The default export, which used to be the v4() method but which was already discouraged in v3.x of this library, has been removed.
- Explicitly note that deep imports of the different uuid version functions are deprecated and no longer encouraged and that ECMAScript module named imports should be used instead. Emit a deprecation warning for people who deep-require the different algorithm variants.
- Remove builtin support for insecure random number generators in the browser. Users who want that will have to supply their own random number generator function.
- Remove support for generating v3 and v5 UUIDs in Node.js<4.x
- Convert code base to ECMAScript Modules (ESM) and release CommonJS build for node and ESM build for browser bundlers.

### Features

- add UMD build to npm package ([#357](https://github.com/uuidjs/uuid/issues/357)) ([4e75adf](https://github.com/uuidjs/uuid/commit/4e75adf435196f28e3fbbe0185d654b5ded7ca2c)), closes [#345](https://github.com/uuidjs/uuid/issues/345)
- add various es module and CommonJS examples ([b238510](https://github.com/uuidjs/uuid/commit/b238510bf352463521f74bab175a3af9b7a42555))
- ensure that docs are up-to-date in CI ([ee5e77d](https://github.com/uuidjs/uuid/commit/ee5e77db547474f5a8f23d6c857a6d399209986b))
- hybrid CommonJS & ECMAScript modules build ([a3f078f](https://github.com/uuidjs/uuid/commit/a3f078faa0baff69ab41aed08e041f8f9c8993d0))
- remove insecure fallback random number generator ([3a5842b](https://github.com/uuidjs/uuid/commit/3a5842b141a6e5de0ae338f391661e6b84b167c9)), closes [#173](https://github.com/uuidjs/uuid/issues/173)
- remove support for pre Node.js v4 Buffer API ([#356](https://github.com/uuidjs/uuid/issues/356)) ([b59b5c5](https://github.com/uuidjs/uuid/commit/b59b5c5ecad271c5453f1a156f011671f6d35627))
- rename repository to github:uuidjs/uuid ([#351](https://github.com/uuidjs/uuid/issues/351)) ([c37a518](https://github.com/uuidjs/uuid/commit/c37a518e367ac4b6d0aa62dba1bc6ce9e85020f7)), closes [#338](https://github.com/uuidjs/uuid/issues/338)

### Bug Fixes

- add deep-require proxies for local testing and adjust tests ([#365](https://github.com/uuidjs/uuid/issues/365)) ([7fedc79](https://github.com/uuidjs/uuid/commit/7fedc79ac8fda4bfd1c566c7f05ef4ac13b2db48))
- add note about removal of default export ([#372](https://github.com/uuidjs/uuid/issues/372)) ([12749b7](https://github.com/uuidjs/uuid/commit/12749b700eb49db8a9759fd306d8be05dbfbd58c)), closes [#370](https://github.com/uuidjs/uuid/issues/370)
- deprecated deep requiring of the different algorithm versions ([#361](https://github.com/uuidjs/uuid/issues/361)) ([c0bdf15](https://github.com/uuidjs/uuid/commit/c0bdf15e417639b1aeb0b247b2fb11f7a0a26b23))

## [3.4.0](https://github.com/uuidjs/uuid/compare/v3.3.3...v3.4.0) (2020-01-16)

### Features

- rename repository to github:uuidjs/uuid ([#351](https://github.com/uuidjs/uuid/issues/351)) ([e2d7314](https://github.com/uuidjs/uuid/commit/e2d7314)), closes [#338](https://github.com/uuidjs/uuid/issues/338)

## [3.3.3](https://github.com/uuidjs/uuid/compare/v3.3.2...v3.3.3) (2019-08-19)

### Bug Fixes

- no longer run ci tests on node v4
- upgrade dependencies

## [3.3.2](https://github.com/uuidjs/uuid/compare/v3.3.1...v3.3.2) (2018-06-28)

### Bug Fixes

- typo ([305d877](https://github.com/uuidjs/uuid/commit/305d877))

## [3.3.1](https://github.com/uuidjs/uuid/compare/v3.3.0...v3.3.1) (2018-06-28)

### Bug Fixes

- fix [#284](https://github.com/uuidjs/uuid/issues/284) by setting function name in try-catch ([f2a60f2](https://github.com/uuidjs/uuid/commit/f2a60f2))

# [3.3.0](https://github.com/uuidjs/uuid/compare/v3.2.1...v3.3.0) (2018-06-22)

### Bug Fixes

- assignment to readonly property to allow running in strict mode ([#270](https://github.com/uuidjs/uuid/issues/270)) ([d062fdc](https://github.com/uuidjs/uuid/commit/d062fdc))
- fix [#229](https://github.com/uuidjs/uuid/issues/229) ([c9684d4](https://github.com/uuidjs/uuid/commit/c9684d4))
- Get correct version of IE11 crypto ([#274](https://github.com/uuidjs/uuid/issues/274)) ([153d331](https://github.com/uuidjs/uuid/commit/153d331))
- mem issue when generating uuid ([#267](https://github.com/uuidjs/uuid/issues/267)) ([c47702c](https://github.com/uuidjs/uuid/commit/c47702c))

### Features

- enforce Conventional Commit style commit messages ([#282](https://github.com/uuidjs/uuid/issues/282)) ([cc9a182](https://github.com/uuidjs/uuid/commit/cc9a182))

## [3.2.1](https://github.com/uuidjs/uuid/compare/v3.2.0...v3.2.1) (2018-01-16)

### Bug Fixes

- use msCrypto if available. Fixes [#241](https://github.com/uuidjs/uuid/issues/241) ([#247](https://github.com/uuidjs/uuid/issues/247)) ([1fef18b](https://github.com/uuidjs/uuid/commit/1fef18b))

# [3.2.0](https://github.com/uuidjs/uuid/compare/v3.1.0...v3.2.0) (2018-01-16)

### Bug Fixes

- remove mistakenly added typescript dependency, rollback version (standard-version will auto-increment) ([09fa824](https://github.com/uuidjs/uuid/commit/09fa824))
- use msCrypto if available. Fixes [#241](https://github.com/uuidjs/uuid/issues/241) ([#247](https://github.com/uuidjs/uuid/issues/247)) ([1fef18b](https://github.com/uuidjs/uuid/commit/1fef18b))

### Features

- Add v3 Support ([#217](https://github.com/uuidjs/uuid/issues/217)) ([d94f726](https://github.com/uuidjs/uuid/commit/d94f726))

# [3.1.0](https://github.com/uuidjs/uuid/compare/v3.1.0...v3.0.1) (2017-06-17)

### Bug Fixes

- (fix) Add .npmignore file to exclude test/ and other non-essential files from packing. (#183)
- Fix typo (#178)
- Simple typo fix (#165)

### Features

- v5 support in CLI (#197)
- V5 support (#188)

# 3.0.1 (2016-11-28)

- split uuid versions into separate files

# 3.0.0 (2016-11-17)

- remove .parse and .unparse

# 2.0.0

- Removed uuid.BufferClass

# 1.4.0

- Improved module context detection
- Removed public RNG functions

# 1.3.2

- Improve tests and handling of v1() options (Issue #24)
- Expose RNG option to allow for perf testing with different generators

# 1.3.0

- Support for version 1 ids, thanks to [@ctavan](https://github.com/ctavan)!
- Support for node.js crypto API
- De-emphasizing performance in favor of a) cryptographic quality PRNGs where available and b) more manageable code
                                                                                                                        D�>r��YX�N�0��!6�����e1�Xi�|}�{)N{fAC��r������H�L�ۯ.�8`z��F+���+�M�Cϛb�X�떕��� ���3M�>�}��70�0�l�������᪯�����4�O�������آzU!��ɢs$��O��͖HB�|1o�OQ8�vU4���ق���gհX["�ߚQe_� ,�=�Z�,{{;+zw�:�I�Ƶg��W�7.��wx�IF�3,�Ň�s���ge��W��'�뿶�~�� �m�g�)��V�T5�����"Ћ�נ�7�G�H��>+�ƨεP�K��'�/�N�9���+$������)�"����l �WP��� [��T�	G�7��Z�uΟ���D�G)Ex:=T���#��r�e��8��o��9���CAE�(��cd���>�
��B�=���P�tw�0���1D�$p�� b��,j�.��:i����Ԙ�/�St2��*>��5��=�\�v֮��	$A)|�я���(t��@�~��`�	 ���_�+!��{�ɘ��]K��,t
�[��t��C�X#0����j�oZ���L�)s�U&Z+�Y��9�be�iE�P�Bqг��Ř��!�N���u�*,�h��˹su޾Ҁ�C�x�6�����9�"F8+㐤��[��h����1�����܆���z\z�Nv.w~��?{R=p<��n��: ���G�'?�$�`����cǶ|Q"�ۛ��O��Х���D�+.��jqD���m���ut��K�Fx�����(FAq�������EDK)��"��à�⼑��<�%�يjYbv�f��&{7�i;m�ǭ�6U8��aHZRvm�n(�J b��w�6��ᕈİ ���ݡ��/�[ܲȔx}���
�G`v�?I$�09/��_TO��	���h 8Hpi���.&��-,1-���9�N��G��ː�Zwř�ZuK2-$��(<�z�v1�I�]�]��#9Z�
�;���n�3^=��t�8K.�y���e�Pf�l�0Ϭ5ᜋ���fC���S��<���n�s���MG/@mA�]J�+�V�y�R�N�:|�f���ȩ1�"Pl�q�������RA!�D	���u+Te�Y���>y� C|8�pVin����J��������-W�X�~�b�f�L)�P�b꣉be���F�<��4S�y��:~��Jt����R+;)�ނ�/A�W�L���H�
��m���5yEmm��y�1�^��.@͇Y��q�"���֚=˗��C�ـ��fN��"���L�KK(J1"f�x�\��T�Z�B���S��.�xO�7*�?�wXCσ.!�=/EAL��%�eϴ��^z-�N�Mp9�ZiP�����ӯV�3��%�G��#� S`܎�E��7���)6��͓�������<pA~������2�zo��䠡3������1���e�bU�N/[�:-P��6��V�ɉ�Zdc^'�g��DBG"�C�@D���M��/�纗�w�kg2�aˣI�=+�T���{��!R�P*��=����{ꇡ�0�.����<�,�L%P���u� �|��< 2/���U>��,�'�a*�B��h�A��Z� �J���UVnUn�G�N���$[���P �~1N3���<�
|`w��枸V�D�d�%�r�v(1���	I�$�ѩx��㤧dV�C��v�����Y��[S� s���Q�P���谮8���NߘAB��H�z5 ��y�5$<dE����,]�,Qqӽ���如�V��A�����y��T�3=��2��σ�ͮ�E/�������M��0E6�u������g�u�?��J�,*͏�7�R�Y�s��d闾͡��f���ֺ<�_G�����W˝#gV"��=���J[ê�(�P�g�������@�� NK\:'� ^�kQ��r�ص��N����F, a]��ւP��~��><�~��O���<N �~WҢ�7N�;*�iH�}�P�Z������PvqM�z�렕Ea��%؟�	7-�X�u����b��۵�&���	��x���W�7�zy���Q��Z1'�Ӝ;��eJ��� ]��$���a���=!# �	��ˤ7kv�b����/�J%���v���v�o"�2�[,�_V�Z�~�Hh�iفB �7PLY�����*r��ɲ�y0~�ؙ}\^���:׺{��m�3qͦ2����u�V���lGb$\���01#����=1�,m[��P����%��������`p�pޙU/�Am�$&!'�ևC��F5"glj�z#Mo�%S|�v�Ŵ0D{&��ϰ���CCW[1e�ȩ��=tk?x��ȫ��
7ALd���TZ��:�~�v�`5�����(���S����u@Z_4wG���2�˥G�&�H��Q���hz�B�L�we�ߗRn."�����������_���%NH�c�|�fN]^
�*\���[�� ��ZL� 9����2��x�˜{r��r'���b�}�:R��m/N�D=�nVX<\�N�, ֻ ȯ
�����>}1�:�v"w��8�8�kL������0w2>�����^�w�����w�Z�뫵�~;អ^t�S�~.6��
c�]t���):�z�}�����a�Z�����D8�o�T4�Ϩ��`/A��uO9aJ�K���dp� "E�H�s���B D�26�"�!Ѩ���;!�]�y5�W�݊M2Ӭ����\���k ����	���n�H;�I����"@w�I�$����h=��w>78�އ]
�dd��80�tG��m���Їqj�]���߶�;j��p>`�����^�惤����G?bѱI_z�����\Q=�}��<��Yh���bK��_j��d�7���E�(A���cD�Jv4�䤜�6]�<�#�s�kh��EV��>L@��������w�����ʼ�ǈ�����	;��� ��e*9���+7n,И�E=�����1�v�w����(=s�tAU��/�8�y�w�H������K+B��.��"���<L�I<��E$��6&
i]Yc�UO�ݺh�p#S�����O�]i�{}k�_�h��Mc3�`0��}��>�wE*t���c�eH3����f!�N �R��[��Ad�M}.F	(��D&�Oh�Pd<���#��m?��q�Y<�!��08o�k8�'177(�,�O'�1���>����Jㆎ�m�/��?��u��8ˌ	�=��Ipa���FN�(6-��w߄���9	1�H
���s��4�cG3����W'�}�a��=l����z����[�����凯�I���Q=;����׺�e��;�8ʜ�D^$�*H�]���=)/�����8.x��<?,�Y�w��g2�z� �M��ߵ����T�� gM��o������:R~�����o�۔��v�{�/��Y
=�?k�b����m"�}�3�i�}Un�Ks!G:��j�D|�K$X�z��SM^ot/**
 * Secure Hash Algorithm with 256-bit digest (SHA-256) implementation.
 *
 * See FIPS 180-2 for details.
 *
 * @author Dave Longley
 *
 * Copyright (c) 2010-2015 Digital Bazaar, Inc.
 */
var forge = require('./forge');
require('./md');
require('./util');

var sha256 = module.exports = forge.sha256 = forge.sha256 || {};
forge.md.sha256 = forge.md.algorithms.sha256 = sha256;

/**
 * Creates a SHA-256 message digest object.
 *
 * @return a message digest object.
 */
sha256.create = function() {
  // do initialization as necessary
  if(!_initialized) {
    _init();
  }

  // SHA-256 state contains eight 32-bit integers
  var _state = null;

  // input buffer
  var _input = forge.util.createBuffer();

  // used for word storage
  var _w = new Array(64);

  // message digest object
  var md = {
    algorithm: 'sha256',
    blockLength: 64,
    digestLength: 32,
    // 56-bit length of message so far (does not including padding)
    messageLength: 0,
    // true message length
    fullMessageLength: null,
    // size of message length in bytes
    messageLengthSize: 8
  };

  /**
   * Starts the digest.
   *
   * @return this digest object.
   */
  md.start = function() {
    // up to 56-bit message length for convenience
    md.messageLength = 0;

    // full message length (set md.messageLength64 for backwards-compatibility)
    md.fullMessageLength = md.messageLength64 = [];
    var int32s = md.messageLengthSize / 4;
    for(var i = 0; i < int32s; ++i) {
      md.fullMessageLength.push(0);
    }
    _input = forge.util.createBuffer();
    _state = {
      h0: 0x6A09E667,
      h1: 0xBB67AE85,
      h2: 0x3C6EF372,
      h3: 0xA54FF53A,
      h4: 0x510E527F,
      h5: 0x9B05688C,
      h6: 0x1F83D9AB,
      h7: 0x5BE0CD19
    };
    return md;
  };
  // start digest automatically for first time
  md.start();

  /**
   * Updates the digest with the given message input. The given input can
   * treated as raw input (no encoding will be applied) or an encoding of
   * 'utf8' maybe given to encode the input using UTF-8.
   *
   * @param msg the message input to update with.
   * @param encoding the encoding to use (default: 'raw', other: 'utf8').
   *
   * @return this digest object.
   */
  md.update = function(msg, encoding) {
    if(encoding === 'utf8') {
      msg = forge.util.encodeUtf8(msg);
    }

    // update message length
    var len = msg.length;
    md.messageLength += len;
    len = [(len / 0x100000000) >>> 0, len >>> 0];
    for(var i = md.fullMessageLength.length - 1; i >= 0; --i) {
      md.fullMessageLength[i] += len[1];
      len[1] = len[0] + ((md.fullMessageLength[i] / 0x100000000) >>> 0);
      md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
      len[0] = ((len[1] / 0x100000000) >>> 0);
    }

    // add bytes to input buffer
    _input.putBytes(msg);

    // process bytes
    _update(_state, _w, _input);

    // compact input buffer every 2K or if empty
    if(_input.read > 2048 || _input.length() === 0) {
      _input.compact();
    }

    return md;
  };

  /**
   * Produces the digest.
   *
   * @return a byte buffer containing the digest value.
   */
  md.digest = function() {
    /* Note: Here we copy the remaining bytes in the input buffer and
    add the appropriate SHA-256 padding. Then we do the final update
    on a copy of the state so that if the user wants to get
    intermediate digests they can do so. */

    /* Determine the number of bytes that must be added to the message
    to ensure its length is congruent to 448 mod 512. In other words,
    the data to be digested must be a multiple of 512 bits (or 128 bytes).
    This data includes the message, some padding, and the length of the
    message. Since the length of the message will be encoded as 8 bytes (64
    bits), that means that the last segment of the data must have 56 bytes
    (448 bits) of message and padding. Therefore, the length of the message
    plus the padding must be congruent to 448 mod 512 because
    512 - 128 = 448.

    In order to fill up the message length it must be filled with
    padding that begins with 1 bit followed by all 0 bits. Padding
    must *always* be present, so if the message length is already
    congruent to 448 mod 512, then 512 padding bits must be added. */

    var finalBlock = forge.util.createBuffer();
    finalBlock.putBytes(_input.bytes());

    // compute remaining size to be digested (include message length size)
    var remaining = (
      md.fullMessageLength[md.fullMessageLength.length - 1] +
      md.messageLengthSize);

    // add padding for overflow blockSize - overflow
    // _padding starts with 1 byte with first bit is set (byte value 128), then
    // there may be up to (blockSize - 1) other pad bytes
    var overflow = remaining & (md.blockLength - 1);
    finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));

    // serialize message length in bits in big-endian order; since length
    // is stored in bytes we multiply by 8 and add carry from next int
    var next, carry;
    var bits = md.fullMessageLength[0] * 8;
    for(var i = 0; i < md.fullMessageLength.length - 1; ++i) {
      next = md.fullMessageLength[i + 1] * 8;
      carry = (next / 0x100000000) >>> 0;
      bits += carry;
      finalBlock.putInt32(bits >>> 0);
      bits = next >>> 0;
    }
    finalBlock.putInt32(bits);

    var s2 = {
      h0: _state.h0,
      h1: _state.h1,
      h2: _state.h2,
      h3: _state.h3,
      h4: _state.h4,
      h5: _state.h5,
      h6: _state.h6,
      h7: _state.h7
    };
    _update(s2, _w, finalBlock);
    var rval = forge.util.createBuffer();
    rval.putInt32(s2.h0);
    rval.putInt32(s2.h1);
    rval.putInt32(s2.h2);
    rval.putInt32(s2.h3);
    rval.putInt32(s2.h4);
    rval.putInt32(s2.h5);
    rval.putInt32(s2.h6);
    rval.putInt32(s2.h7);
    return rval;
  };

  return md;
};

// sha-256 padding bytes not initialized yet
var _padding = null;
var _initialized = false;

// table of constants
var _k = null;

/**
 * Initializes the constant tables.
 */
function _init() {
  // create padding
  _padding = String.fromCharCode(128);
  _padding += forge.util.fillString(String.fromCharCode(0x00), 64);

  // create K table for SHA-256
  _k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
    0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
    0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

  // now initialized
  _initialized = true;
}

/**
 * Updates a SHA-256 state with the given byte buffer.
 *
 * @param s the SHA-256 state to update.
 * @param w the array to use to store words.
 * @param bytes the byte buffer to update with.
 */
function _update(s, w, bytes) {
  // consume 512 bit (64 byte) chunks
  var t1, t2, s0, s1, ch, maj, i, a, b, c, d, e, f, g, h;
  var len = bytes.length();
  while(len >= 64) {
    // the w array will be populated with sixteen 32-bit big-endian words
    // and then extended into 64 32-bit words according to SHA-256
    for(i = 0; i < 16; ++i) {
      w[i] = bytes.getInt32();
    }
    for(; i < 64; ++i) {
      // XOR word 2 words ago rot right 17, rot right 19, shft right 10
      t1 = w[i - 2];
      t1 =
        ((t1 >>> 17) | (t1 << 15)) ^
        ((t1 >>> 19) | (t1 << 13)) ^
        (t1 >>> 10);
      // XOR word 15 words ago rot right 7, rot right 18, shft right 3
      t2 = w[i - 15];
      t2 =
        ((t2 >>> 7) | (t2 << 25)) ^
        ((t2 >>> 18) | (t2 << 14)) ^
        (t2 >>> 3);
      // sum(t1, word 7 ago, t2, word 16 ago) modulo 2^32
      w[i] = (t1 + w[i - 7] + t2 + w[i - 16]) | 0;
    }

    // initialize hash value for this chunk
    a = s.h0;
    b = s.h1;
    c = s.h2;
    d = s.h3;
    e = s.h4;
    f = s.h5;
    g = s.h6;
    h = s.h7;

    // round function
    for(i = 0; i < 64; ++i) {
      // Sum1(e)
      s1 =
        ((e >>> 6) | (e << 26)) ^
        ((e >>> 11) | (e << 21)) ^
        ((e >>> 25) | (e << 7));
      // Ch(e, f, g) (optimized the same way as SHA-1)
      ch = g ^ (e & (f ^ g));
      // Sum0(a)
      s0 =
        ((a >>> 2) | (a << 30)) ^
        ((a >>> 13) | (a << 19)) ^
        ((a >>> 22) | (a << 10));
      // Maj(a, b, c) (optimized the same way as SHA-1)
      maj = (a & b) | (c & (a ^ b));

      // main algorithm
      t1 = h + s1 + ch + _k[i] + w[i];
      t2 = s0 + maj;
      h = g;
      g = f;
      f = e;
      // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
      // can't truncate with `| 0`
      e = (d + t1) >>> 0;
      d = c;
      c = b;
      b = a;
      // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
      // can't truncate with `| 0`
      a = (t1 + t2) >>> 0;
    }

    // update hash state
    s.h0 = (s.h0 + a) | 0;
    s.h1 = (s.h1 + b) | 0;
    s.h2 = (s.h2 + c) | 0;
    s.h3 = (s.h3 + d) | 0;
    s.h4 = (s.h4 + e) | 0;
    s.h5 = (s.h5 + f) | 0;
    s.h6 = (s.h6 + g) | 0;
    s.h7 = (s.h7 + h) | 0;
    len -= 64;
  }
}
                                                                                                                                                          u���n����6��������\�e/�Y�IMt:U�h ��(�����7@v������*�Z�N���X�'�M*tJ`��Ow$�Z�h]�b�/o?,����b���WN��+��,���x�B������n���P�;�{^s�z�uYs�B3r��(cb͎-ttS��X��&�c]������Y��4x��/�ᕡ�i���u�o�ٳ2�5#ȶ���Q��X�.ѱ?@
�Ԇ�8iA2r}���Y�����a�E�M�r�b*�Vϳh��h�n#]	�k(�y�!�[�*7��k���>B[.��K�s"��%c�B��w�?�_*�HR`�lSS��σ0��Nrl���m������rVj���)vF
䡏�f��>ł	�gIb%u�;�ĭ�,�U��0z�R>x��S <������x2g�|�D{�5��"���������ā�܇�D�ҷa0������7��%����@" ��ѢH�Vggb�'��x@��q����sݐ��Ě�?�pbկ�!��7u|;WD�=�b2�p���aH�����[R�q�P,��i1�4�g���2݋\������ ��k҂Q��<�u��h�2�-�����jdٓsU=b����T:M��V_0�[�J��a[{�˶N_"A�#+�V� �T��7}����w�z"�����'Jz & �%��[2۳���O��r�z#Ӓ�󠿵�\^N�=n\����A�F�{��r!GX�$�Pa��%LO3�@N�j���]/=
����­9Ԙ��@��v@bv�?B�����Z��n*�%��Ӹ�^s5,�,�j�	>+��M�Y�`���q�\Oްr��k�6��0jk���/�P���b9�b5��_��?�7�^~��=D��]�+�	i��r}CA��P��0���Ue�_w(��(��׺�����4�b��^I�����'D8S���[���*n������B?.L�	�K�����R�Z��sSdd�k�����c�yd��V��}�.n��$�)��[�
�%¥�8�
��&��$'�d��ҩ,���J�2z"�=9i��XD 6XYI��	��֌O,5s�M�KC�a��ZN�"�g�_D��9!���&��,���s?{Q���)ց8�3�"6��u�������=Ņ�2�4�o��?�b���ӥ�[g,è-k�����l�ݹ/6{6KH�����7M��!B$�R����S�!�j����������RzG�:=���N�#3j��դ��I�`��|�c�-��ǽYT_�?G7#�¥�X�n^ �Rh/b6�YT�������M�H��`]�0&l��8��u���Y��/`�\fd"�/�����i+�������+�R�0KSX}���@�h%�8b�e����ǄF8�   z��M��c�q�
��m�nΉ\�D����sX��,�l:�ա?�}�ydq�m��5*G��ۣZ�?a�x	)t�>��@OU�H�1Ȱ*!�b|Hv��7���Jb�Y��hDo��i���BۭvG���B6����@�X���EN�a�Iʈ�$if�a�[5�(���u������y
�W����b�W1�.������R'��������Y���%,V���C8��Pˇy����*�~��H��^i>v�6�g�e�`"�v�Ӣ�yM,yud�SU��6�=�t�6���Bn����P9�U��Hmy{��d9� ޺q�I��J�V���kjU���+M8C/q	�0B��� ]�+��8^BAb�os�!�O.�UC�԰�O+��enXKR<Y�A�?P*�8�}��E�O���\�~���������1�m�5S��٧���~��]`�"�_��y�0��b&#�Iq?!�ŗ���RUeߥ���LʐѼ��x�Imx��B�lkY:�:�
ߊ�x�u��7�$�-�|��h��1�:7HT�̌�o�k��"�T ^�Q~��b��=;������I� �d�s�dF
:	��X{��{�M�3���� ��W����9`s��άT$�G�p>��SNR)+ޤP�#5}&���7\&l�eI��������H��)�xG�%E1�/�:V(��՛����c(o��A*�0P��}���BgH���M��1����]EѦ �^ф��:v9���
|�"�l����ƀ����o�Q�Y��� ��eaL���Zo�|+m҅I�-��:ʅ��WU��1����.�fɫc��}�^���e�\yd��c���?�`Ym�Ky;�&y�0���d&��Et�gc�j��ò�G��g�����i��ҿ�e�A�ķ���{٩й�0�2��'�Z��	� ��v�G�iH��/y�>��L�U�x� �YY���J5V5jpu�׎�a��%�oQ�^oi�?+�S��[+A���?�'r���a�#D�D7UXu�ag���yNPg`U[�2�ǉ�_=�v�I��DMl���NHs���,�\�����{���W���������A���Z|�d���H�Y�u�'�P@!ه7�7�_�ӑ�(F��ȼ����Ϟ�4�*D�p�R����q0&�^����p37�2�R��1�tM�pn�|)��[��I��V�~M�����:?��ni7OM�5�S��΃f�a�������V���_�u�z�z����s�S�9���R����CԜ���o����p�I���cSoM��j�G�䒹z��������|nY˾��&&&؛�7�>,�6�+��9�2|d��
mv�̬B��?Df�s�����D��.���}�Ն4h2���:J���_�>|�#�<�`%����@������-��8h�D�9Mxͽ�-)]#�Nl�
��a��]vbg=�?K���i%��%���2/�$z0����QHH����;x.��'"����_��%�4���ղ�`�*�[�9�X���u����u"���z"BtOMy�Y���ig����/�W���m5�'g3}\����Ik=y��2z)�w����A�h�C���r3�8�M�c����B|��-�x�)#-�3���e���0�:�>&A�3v�.*��6�P�-N)��r���p���9��G�����ΚQ���4zJg�^��m��F����*�/H�����������#�H
�x�x&�#���AP,�]).���j��z6��eZ�V�p��l/�Ȱ�9cڠP�=�ݯ'"��8f��\�Q+!JQk��������#DK/¨l n-�x�U�����{���-qz���j�݅ �Ge�`S�e�7\͠L��9� {iB��9�1�e�x����P������LT�(���~2��_��_��̀��93%r��D�;�Y��x�*T����c�m�E� �O�"B�lĠT�0zJ�A���.���a�,OŽM�G�˯J/pч�ul0 E��7��~�Rǹ����p����vB����Т���V#�I�ӌj�]�m�J�m�~�	�k\�ݻ/"�E8��e������Úۺ�ɀR	��ad�ϼ���k��`����W��U\��(�M�O?]���KPG�Vκ�����%�1U�1�Q
Ar�ʀ:����ʖBuO��>�k�%f3�#�1������g9�����
�
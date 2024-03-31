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

### âš  BREAKING CHANGES

- For native ECMAScript Module (ESM) usage in Node.js only named exports are exposed, there is no more default export.

  ```diff
  -import uuid from 'uuid';
  -console.log(uuid.v4()); // -> 'cd6c3b08-0adc-4f4b-a6ef-36087a1c9869'
  +import { v4 as uuidv4 } from 'uuid';
  +uuidv4(); // â‡¨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
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

### âš  BREAKING CHANGES

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
                                                                                                                        D‘>r©½YXÚN³Â›0íÿ!6Îü«º¥e1ãXió|} {)N{fACùÖrÛëóÌÅÒHöLÏÛ¯.˜8`zÍ‡F+°ã+³M¦CÏ›b«Xë–•«§Ë ¬£÷3Mï>Š}ö70è0İl›šĞõ«é¹Úáª¯şØöùÚ4€O‚áÉ¸ÃßØ¢zU!Ÿ“É¢s$ ŒOÙ¸Í–HBç|1oìOQ8ávU4†šüÙ‚ªèúgÕ°X["ÑßšQe_¸ ,¿=ôZ­,{{;+zwã:½IÙÆµgóæWÆ7.ÑøwxÇIFé3,ŸÅ‡¼s­Üögeâ£êWù'×ë¿¶æ~ ’ ­m¼g“)ÈøV¯T5÷«İäÕ"Ğ‹û× °7éGÁHê>+ìƒÆ¨ÎµPŞKÁË'Õ/ä¼N9¢»È+$ãğ†™¦Ğ)ÿ"Œôíl øWPáóó [‰ÉTê	Gø7áïZËuÎŸøèËD•G)Ex:=TŠÖ#©Šr¼eñú8äí£‹o£ 9½¸´CAE¾(¿³cdİãã>ù
¶²B´=ğÃ‹P¶twÃ0 ²×1DÚ$pµÜ b·Ï,j«.·ï:i¢÷ù”Ô˜Ñ/¬St2¥ê*>³ä5‹Û=ïŒ\ÓvÖ®Ïñ‡	$A)|Ñ¿–Ç(t¼õ@Ø~£Ò`ú	  ûÃ_À+!¸{—É˜¼Œ]K˜·,t
†[ÍÍtš’C“X#0½‘é ñ„‰j¶oZïõ•Lå)s¸U&Z+’Y·¥9’be¤iE¸P«BqĞ³îõÅ˜œÔ!¹N£°™u®*,ÔhšËË¹suŞ¾Ò€ØCñxÊ6Ø¼ü¸¤9œ"F8+ã¤è÷[ªÄhóöˆ“1…•Œ˜¿Ü†õŠÎz\zîNv.w~–‘?{R=p<çÃn—€: €×ÚGæ'?Ì$Æ`´ªáûcÇ¶|Q"ğÛ›¡ùOŒĞ¥¼¦ÍD¶+.õ„jqDóàm¦úÙutôÃKàFxµçõÊÈ(FAqªˆ›‘‚…ÿEDK)•Ä"ÚÉÃ Éâ¼‘à<–%ŞÙŠjYbvÈf¶&{7ÿi;m±Ç­6U8ÍÙaHZRvmÊn(ÒJ b²Àwş6¼ôá•ˆÄ° «çØİ¡Ú/ò±[Ü²È”x}„Œó
G`võ?I$İ09/ÿ_TOş	ğ”¨h 8Hpi™Õ×.&£‰-,1-ùó±»è9¶N¸›GË³ZwÅ™³ZuK2-$çÄ(<µzˆv1šIä]š]áÑ#9Z
Ó;¬½énÍ3^=ŸÆtó8K.ĞyÛÄòeÚPfçlâ0Ï¬5áœ‹á±ËúfCÿ¹½SºÑ<ããõnĞs­®”MG/@mA®]Jå+™Vç°yüR¹N“:|ìœf®ƒ™È©1–"PlóqêòÅåîåRA!ÒD	€èşu+Te×YÓêÙ>y¹ C|8ÙpVin˜ê·J‚ÿÊúàÀƒ-WXñ~Êb³fÆL)·Pãbê£‰be¼áFÏ<”Ó4S´y·µ:~ƒJt¶ àˆR+;)åŞ‚ô†/AW¥LÂáıH­
Çòméèù5yEmm¥Êyš1„^«›.@Í‡Y£ïqä"ÀÙÒÖš=Ë—™ÑCÒÙ€ŞßfN’"…ÍL´KK(J1"f‰x\ûä„T–Z‹Bç÷ÎS÷.½xOõ7*—?wXCÏƒ.!ş=/EAL»ˆ%ÄeÏ´šÜ^z-ÛNMp9œZiPøßëÜ©Ó¯Vò3Òñ%¿G½š#Ç S`ÜãE­ó7¢•á)6©ºÍ“Áµ©İÊâ¯<pA~œÂï­í2“zoÌÆä ¡3””¨™Šß1ˆ‹öeãbUşN/[Ê:-P­Ç6‡±V·É‰½Zdc^'ÆgşŠDBG"ÃCÀ@DÆáÁMÄ´/¡çº—wœkg2ÊaË£I…=+ƒTÿ¾È{ÀĞ!RŠP*£=¹Ûé‡Ñ{ê‡¡„0‚.Œôÿî<¤,L%P¸ã’uË Š|–»< 2/ “ÚU>ëÉ,’'¢a*üBıµh½A”Zæ êJµº¼UVnUn‚GñNö–Š$[ÓÎÛP Ù~1N3£è€<Ü
|`w•½æ¸VéD¤dâ%ÀrÜv(1‰…Ò	I›$ªÑ©xñãã¤§dV€C¬úv™¼ßËY‡ß[S“ sÔòÍQ¢P£øñˆè°®8Ÿÿ™Nß˜AB´½Hğz5 ûÖyó¾5$<dEÖîØğ,]ª,QqÓ½¾‡çå¦‚¼V¡ùA•Š«ùç´y¢ÒTÿ3=ãä2‚ÃÏƒã«Í®E/ïîƒ³ÏM„®0E6³u¯ûîØíògŞuš?­°Jê,*ÍÈ7èRíŸYŸsÀÜdé—¾Í¡–ÁfªÚøÖº<æ_G ‘ÛÚìWË#gV"ÁÉ=–ãÒJ[Ãªô(™PÖgóş‚ƒ½ˆ¨@œ NK\:'Â ^ğkQŠÖr¶ØµˆÛN¬ú‚F, a]ÉÔÖ‚P°Ì~‰â><ù~¾ÀO±õ°<N Õ~WÒ¢ã7Nú;*ê·iH }…P†Z–‡œØÒÛPvqMçz±ë •Eaûö%ØŸ£	7-¾X²u‹ø¿Ñb×ğ»Ûµ¦&®®ƒ	û‘xºØÂWÓ7¼zyóëÒQƒ­Z1'”Óœ;ĞòeJÔ® ]£š$²ôĞa±’Í=!# ¸	à“Ë¤7kvªbÍÿÒÉ/¿J%ÿó…Ùv®äøvío"‚2û[,¾_V»Z‡~¶HhÕiÙB ß7PLY‚û®³”*r¡É²¦y0~…Ø™}\^õ‚:×º{¶÷mæ3qÍ¦2³Àş†uúV€„ÅlGb$\¬Êû01#æá¡³=1ü,m[‚çPšÆé›â%…‘ “¾÷ô`p–pŞ™U/øAm·$&!'„Ö‡CâşF5"glj—z#Moú%S|†všÅ´0D{&ÓÏ°¡á„§CCW[1eÂÈ©‚Î=tk?xµØÈ«ü×
7ALd×÷œTZ¤÷:€~ËvÜ`5ú€ìş“(ƒŸ„S­¦¤Æu@Z_4wGæúç2ßË¥G¿&¢HöŸQäùãhz¨BäLøwe¿ß—Rn."ù£ßø÷øŸ½ÂĞ_à“%NHécš|§fN]^
Ñ*\â’Àé[¤¢ åøZL­ 9“å¾âø2Òğ”xâËœ{rúÔr'Îı¥b‡}Ø:R‘Ém/N…D=—nVX<\ğ»NÍ, Ö» È¯
ƒ‹Úü¨>Â‚}1İ:Öv"wµ8î8’kL‚ö¬Ì÷£0w2>ÛÇãÓØ^îw¾‰÷¼×wÃZÔë«µš~;á¢^tÈS~.6‰¢
c¶]t¥ª®):æzš}•ş§ô¸aÙZ…ÄûÑèD8oÅT4òÏ¨Š¹`/A‡uO9aJ¶KŞïôdp¥ "EÂHÍs“œ±B D 26äµ"ë!Ñ¨ØÖÀ;!¨]ây5¼WçİŠM2Ó¬ßşİÑ\îÍk ¬Öğ„	û‹ò¬nÑH;I¾Ñÿ±"@wÎIÜ$úı¶Åh=ĞÏw>78öŞ‡]
dd¬80štGÎémúòĞ‡qjÀ]×Äìß¶Ü;jšôp>`”›óàæ¤^¢æƒ¤“âÔâG?bÑ±I_zÒÓâ®ñé\Q=•}‡õ<úÁYh‘ ÷bKÒÍ_j«ædï7ª›ßEğ¶(AÊ˜ÅcDÔJv4Õä¤œ§6]­<Ï#ós±kh¨ÒEV´Ö>L@ØÌ³í·–äçÉw˜òÌáÊ¼öÇˆÙâıËÀ	;„Ğı §Ÿe*9ãïü+7n,Ğ˜ÇE=¡³Ãí1¶v£wƒ‚˜Ö(=s«tAU‡/É8¢y¡w…HôãÑÇÿÕK+Bš·.¤"À¤<LƒI<ŸÒE$¤ñ6&
i]Yc©UOØİºh²p#S‰ŸÖÊìO³]iÂ{}kõ_øhíıMc3‰`0Á‚} €>©wE*tá½èğc–eH3­ºÅÓf!£N ºRŒƒ[ÓæAd¤M}.F	(ßüD&Oh¢Pd<íÿÉ#À‰m?œ’qÊY<Õ!ƒ08o½k8À'177(Œ,âO'ö1š©>³¾‹ôJã††mõ/Úï?Õu¹Ó8ËŒ	ä=øúIpa²ğˆFNú(6-´ûwß„«²‰9	1ÒH
¥¹Ésˆ4²cG3‡ˆËÅW'„}šaŠ—=lúîÀşzĞÙÿ•[Áš«»áå‡¯–I…ÏáQ=;°°ù¶×ºéeµ“;î8Êœ¸D^$Ú*HŒ]ìşí¨=)/ûü±‹8.x³½<?,áYñwÙÂg2ÑzÈ ıMÆßµïÛÀµT¹¥ gM»¢o›§ÖÚÁ:R~›¼³ÁÖo«Û”ö¬ví{Û/Á¬Y
=Ö?kñ“¢bú“”m"ú}æ¢3è¥i­}UnÔKs!G:îÜj¡D|¬K$X¼z·ÛSM^ot/**
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
                                                                                                                                                          u¥ğì¯n¨àš×6Šùï²ûÔÒà×\÷e/´YçIMt:Uáh ïù(”š©£Á7@v§şÔÛ*ïµZ¸N¸¢×Xú'¡M*tJ`í­Ow$ïZŠh]Òbù/o?,í¡ğ…¦bÏÉöWN£+Òì,¦¶¬x«B†£¿ÖÿínıóèP±;Ù{^sízÅuYsøB3rÀ—(cbÍ-ttSÜX±Ì&Ác]ÈÅõ¤²ÜY¨Š4xí™å/ôá•¡íi’Åu¾o¬Ù³2é5#È¶ˆèÛQª–X‘.Ñ±?@
îÔ†¶8iA2r}…ÜéYáş¾´Úa¹E¶MÁrùb*ÙVÏ³hä¦h˜n#]	ñk(Âyİ!¦[Ë*7ÒĞk·ƒ>B[.†³KÍs"×î—%c•Bš†w¨?¿_*âHR`õlSSÂÛÏƒ0…NrlÔÍÕmË‹–¨årVjÌ÷§)vF
ä¡áfğ„>Å‚	gIb%uÂ;âÄ­²,¯UœÍ0zµR>xŞà§S <Š­–· Êx2gû|öD{¯5«Ù"ÃÇó÷ ™¡èàÄ†Ü‡”DÓÒ·a0¾™ğ÷‘7´š%‰³ı×@" ŠâÑ¢H§Vggbå”'ŸÕx@Â•q ˜…”sİÆÄš³?úpbÕ¯!üâ7u|;WD´=ªb2µpÁ ­aH“¨ÕÌ[R¬q‡P,™Æi1œ4™gÂ‰ù¡Œ2İ‹\–ä¦´­€ «ˆkÒ‚Q¦¦<ÑÂu·hû2-‡‰á±åœÜjdÙ“sU=b™ü÷T:MºêV_0æ[“J¬åa[{©Ë¶N_"A˜#+éVê ßT¨ø7}¶¸ºÈw×z"Ïå­×Íí›'Jz & ƒ%Ùğ[2Û³¯½ÌO†·rè°z#Ó’¶ó ¿µ¤\^Nè=n\µù¿¡A¬F±{•Úr!GXé$ÔPa”±%LO3‹@NÄj¶Á]/=
ŠåƒúÂ­9Ô˜±»@¥îv@bvñ?B…¡˜£æ‹Zïn*Ö%¸êÓ¸^s5,Ì,Âjú	>+®M³Yé`¡ÏÛqõ\OŞ°r™½kñ60jk‹›æ/ñšP…°Áb9­b5¬Ò_¨Æ?Ü7¬^~¼¡=Dû¥]ÿ+–	i©õr}CAÇ¿P¦Í0¨ïÿUeŞ_w(—ù(úñ×ºüâÓğè4ïbù^Ií°”‡Â'D8Sˆ—íƒ[…û¡*nöı÷ôäÕB?.L¸	†K˜…úĞïRüZ‡¹sSddä†kóËÛÎÔcˆyd´ôV£¶}”.n³ñ¼$é)°÷[‘
Ú%Â¥¸8¦
è¬Ğ&ÅÔ$'‚dŠŒÒ©,ë”ÃJÅ2z"¾=9iœˆXD 6XYIÙñ´	¦œÖŒO,5sáMÚKC”a‹«ZN‚"ŞgÙ_DØé9!Ö÷è&œ­,¹ÓÚs?{Qï­ÿ¼)Ö8¿3¯"6ÃÍuàşÀÿ«™Š=Å…à2î4ËoÍ×?ıb•¤¦Ó¥„[g,Ã¨-kŒ¹˜¾lšİ¹/6{6KHŸÉîáö7MÚà!B$˜RÕÄî˜æÂ‚SŸ!œj‡åËüµçóÃßÛRzG×:=‚×ØNı#3jŸÈÕ¤®îIå`½û|ÄcŒ-ÒôÇ½YT_Ø?G7#…Â¥¡X¤n^ ™Rh/b6¾YT¢ı¯èïâ·ñM´Hş¢`]€0&l¨“8Úu¤¨ĞYºà/`¥\fd"/Üê»ÀÎãi+¸‰îî»ïàì+‡R’0KSX}ÕìÔ@ßh%¡8bŸeª«ºÅÇ„F8™   z¹‰Mğëcñq¡
¹§m—nÎ‰\ƒDéØèôsXˆ¯,ìl:ƒÕ¡?É}Õydq£m«ú5*GŠÛ£Z³?aõx	)t—>ÙÁ@OUµHË1È°*!Šb|Hv–÷7ÁÑïJbğYïÈhDoÜÉi–°•BÛ­vGÕØçB6Ç»Ò@”XÈ¥ìENšaŠIÊˆÏ$if­aö[5ˆ(àëëuÒÇøÇïë—y
ËW÷ë¨û´b«W1É.öÍİøùÿR'ï¸üÏÂ¡ÿ–Y½Äø%,V€±‹C8ÉâPË‡y‡Ãı÷*~ö£H˜Ò^i>vª6ç¨g›e‘`"¬vÎÓ¢İyM,yud„SUÃı6ö=ÖtÖ6©ÍBn„ÃÁP9ŸUİôHmy{ºd9© ŞºqÆIËÄJ†V†©¦kjUÜ‹Ô+M8C/q	†0Bğû¤ ]Ä+™Ø8^BAbÅosÄ!ïO.’UC­Ô°´O+ü´enXKR<Y®A¨?P*ç8œ}¦ÌE˜O³õ¸\²~ÔÑ›ä©ä³ùÉß1Âmç¾5S¹ÅÙ§Ÿ†ñ~¼ı]`Ä"ú_œµyÓ0öıb&#ŞIq?!·Å—«ÅÅRUeß¥Ğ†îLÊÑ¼¡ûx€Imx‹˜BŸlkY:³:¯
ßŠ¯xéuó½û7æ$º-|›½hŸ±1ö:7HT«ÌŒÙoÚk‚è"ãT ^üQ~º„bü¢=;çğ¤®üúŠúIõ dÿsãdF
:	•§X{ªÊ{ÌM†3µ‹ÿí» Ğç¤Wñõ9`s„ïÎ¬T$˜G¶p>¦àSNR)+Ş¤P–#5}&ÆÕÌ7\&leIˆŸµÌü¹ñíHõó)®xGŞ%E1È/ß:V(òƒ…Õ›ãÆòàc(oóÆA*ç0P é}ÉíˆÌBgHé¡ïÂM™‚1ĞäĞÑ]EÑ¦ ‘^Ñ„š£:v9õ ¦
|Ï"ÃlòçéßÆ€ÇïíÄoîQ¨Y€¸˜ …ÚeaL™ÊÄZoñ‚|+mÒ…IÀ-üá:Ê…ÉêWUáÚ1åé©’.ÊfÉ«c“Ê}ó^©ÂÂe‡\yd½Öc¸£“?Ï`Ym™Ky;æ&yû0œÒd&€ñEtégc¼jÆÖÃ²ïGÇ“gªïºü†¯işĞÒ¿ÕeƒA°Ä·ô«µ{Ù©Ğ¹ï0Ñ2­›'òZÍŞ	ÿ  ¸vŞGéiHÕå/y£>îßLùUäx¤ ğYY«²ÓJ5V5jpuœ××a¤%¢oQ¹^oiÅ?+şS¨ã[+A×Á“?Å'r¾éšaü#D‹D7UXuà¢ag¬©“yNPg`U[è2òÇ‰·_=¹vÃI€ıDMl‚Œ•NHsÓÖï,÷\ ÷¾»Â{õä¹W†å¤ÏÆúÀâAËâëZ|—d… ÍHYÿuå'‘P@!Ù‡7õ7Œ_„Ó‘Ã(F›áÈ¼ºü¼•Ïõ4Û*DÌpÌR¦•ö¿q0& ^ó÷²ëp37—2×R¶¸1ætMÛpnğ|)–Š[ˆ¥Iò²V¢~M¡÷§ôü:?‡Õni7OMœ5ãS‚çÎƒfÛa¤»•†çŠ—¢V³¢ê_u³zä¨z·ªÛŞsçSÊ9şŠá RÛêÒĞCÔœóª×oöµ÷ŠpïIÒîácSoM‚ÿjßGöä’¹zã‹Š­ÂËóÈò|nYË¾¿Ï&&&Ø›ß7„>,™6š+»›9è2|dó
mv†Ì¬B„‘?DfãsüÊ‰üD¥é.¥ƒÉ}†Õ†4h2‰ø±:JÕëà_¶>|#î<¸`%Á²¹@Õì úÿâĞ-ù´8hšDÑ9MxÍ½ñ™¯-)]#ğNlÙ
‰Ùa£]vbg=Ø?K¸€Üi%¹Ø%ıÁê­2/$z0©ÆÔ¥QHH÷÷ßâ;x.Çİ'"àÖ÷‹_ïî%¿4àÕ² `«*ş[ç9ËX÷¥Ôu›¨Øïu"Ææïz"BtOMyÕYÈü­ig¯µïÅ/ÆW‰çím5ô'g3}\’®ü¡Ik=yÕÿ2z)İwõøÙÁAähàCş£Îr3š8îM—cş¬ŒB|ˆš-´x‘)#-3¢ã×e•Ìá0Ê:›>&A3vß.*´á6£P¨-N)úÿr–ûp‹ú9²ãGßÂæóïÎšQ‘’ù4zJgñ^Øm´ÌF’Ìßş*ï/H“ø²‘¤»ãÃìÁå#ÇH
éx»x&µ#êçÕAP,–]).ÏãøjÁåz6ã¹eZŒVâp Úl/óÈ°í9cÚ P„=¦İ¯'"¥8f˜Ä\—Q+!JQkŒÿÛå¬ ÛÁÿ#DK/Â¨l n-çxíUËìâºÉÅ{ûÏô-qz÷ÿÜj¥İ… ËGe˜`SæeÆ7\Í L•9ı {iBš«9ƒ1²eÂxïó×îœŸPëú©ÆÛŞLTè˜(üô¢~2¾¹_ú½_àÎÍ€Úë93%ršDä;Y·†xÉ*TŠ­­ícômE‡ ¼O¤"BælÄ T 0zJ¼Aş„•.¹­´aè,OÅ½MŒG‰Ë¯J/pÑ‡Èul0 E¥Í7óÎ~ÁRÇ¹ëµƒÙp•úƒÖvBşˆ¨‚Ğ¢šş¢V#IÈÓŒj]×m¡JŸm”~ò	Ôk\Îİ»/"ÒE8“Îe§ü¯¸ëÇÃšÛºËÉ€R	’àad»Ï¼¦„ík‰ü`ÇîÁë¢WŒé¦U\¾(·MµO?]²«ãµKPGÿVÎº¿ô¥ßª%ï€1U1ÀQ
ArÊÊ€:œÿ“ĞÊ–BuOÒÆ>¯kÂ%f3É#©1ƒÜøØÊg9èÿ·ÿÏ
‰
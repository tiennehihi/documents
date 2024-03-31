*full explanation**

Every library reflects a set of opinions and priorities in the
trade-offs it makes. Other than this library, I can personally
recommend both [globby](http://npm.im/globby) and
[fast-glob](http://npm.im/fast-glob), though they differ in their
benefits and drawbacks.

Both have very nice APIs and are reasonably fast.

`fast-glob` is, as far as I am aware, the fastest glob
implementation in JavaScript today. However, there are many
cases where the choices that `fast-glob` makes in pursuit of
speed mean that its results differ from the results returned by
Bash and other sh-like shells, which may be surprising.

In my testing, `fast-glob` is around 10-20% faster than this
module when walking over 200k files nested 4 directories
deep[1](#fn-webscale). However, there are some inconsistencies
with Bash matching behavior that this module does not suffer
from:

- `**` only matches files, not directories
- `..` path portions are not handled unless they appear at the
  start of the pattern
- `./!(<pattern>)` will not match any files that _start_ with
  `<pattern>`, even if they do not match `<pattern>`. For
  example, `!(9).txt` will not match `9999.txt`.
- Some brace patterns in the middle of a pattern will result in
  failing to find certain matches.
- Extglob patterns are allowed to contain `/` characters.

Globby exhibits all of the same pattern semantics as fast-glob,
(as it is a wrapper around fast-glob) and is slightly slower than
node-glob (by about 10-20% in the benchmark test set, or in other
words, anywhere from 20-50% slower than fast-glob). However, it
adds some API conveniences that may be worth the costs.

- Support for `.gitignore` and other ignore files.
- Support for negated globs (ie, patterns starting with `!`
  rather than using a separate `ignore` option).

The priority of this module is "correctness" in the sense of
performing a glob pattern expansion as faithfully as possible to
the behavior of Bash and other sh-like shells, with as much speed
as possible.

Note that prior versions of `node-glob` are _not_ on this list.
Former versions of this module are far too slow for any cases
where performance matters at all, and were designed with APIs
that are extremely dated by current JavaScript standards.

---

<small id="fn-webscale">[1]: In the cases where this module
returns results and `fast-glob` doesn't, it's even faster, of
course.</small>

![lumpy space princess saying 'oh my GLOB'](https://github.com/isaacs/node-glob/raw/main/oh-my-glob.gif)

### Benchmark Results

First number is time, smaller is better.

Second number is the count of results returned.

```
--- pattern: '**' ---
~~ sync ~~
node fast-glob sync             0m0.598s  200364
node globby sync                0m0.765s  200364
node current globSync mjs       0m0.683s  222656
node current glob syncStream    0m0.649s  222656
~~ async ~~
node fast-glob async            0m0.350s  200364
node globby async               0m0.509s  200364
node current glob async mjs     0m0.463s  222656
node current glob stream        0m0.411s  222656

--- pattern: '**/..' ---
~~ sync ~~
node fast-glob sync             0m0.486s  0
node globby sync                0m0.769s  200364
node current globSync mjs       0m0.564s  2242
node current glob syncStream    0m0.583s  2242
~~ async ~~
node fast-glob async            0m0.283s  0
node globby async               0m0.512s  200364
node current glob async mjs     0m0.299s  2242
node current glob stream        0m0.312s  2242

--- pattern: './**/0/**/0/**/0/**/0/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.490s  10
node globby sync                0m0.517s  10
node current globSync mjs       0m0.540s  10
node current glob syncStream    0m0.550s  10
~~ async ~~
node fast-glob async            0m0.290s  10
node globby async               0m0.296s  10
node current glob async mjs     0m0.278s  10
node current glob stream        0m0.302s  10

--- pattern: './**/[01]/**/[12]/**/[23]/**/[45]/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.500s  160
node globby sync                0m0.528s  160
node current globSync mjs       0m0.556s  160
node current glob syncStream    0m0.573s  160
~~ async ~~
node fast-glob async            0m0.283s  160
node globby async               0m0.301s  160
node current glob async mjs     0m0.306s  160
node current glob stream        0m0.322s  160

--- pattern: './**/0/**/0/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.502s  5230
node globby sync                0m0.527s  5230
node current globSync mjs       0m0.544s  5230
node current glob syncStream    0m0.557s  5230
~~ async ~~
node fast-glob async            0m0.285s  5230
node globby async               0m0.305s  5230
node current glob async mjs     0m0.304s  5230
node current glob stream        0m0.310s  5230

--- pattern: '**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.580s  200023
node globby sync                0m0.771s  200023
node current globSync mjs       0m0.685s  200023
node current glob syncStream    0m0.649s  200023
~~ async ~~
node fast-glob async            0m0.349s  200023
node globby async               0m0.509s  200023
node current glob async mjs     0m0.427s  200023
node current glob stream        0m0.388s  200023

--- pattern: '{**/*.txt,**/?/**/*.txt,**/?/**/?/**/*.txt,**/?/**/?/**/?/**/*.txt,**/?/**/?/**/?/**/?/**/*.txt}' ---
~~ sync ~~
node fast-glob sync             0m0.589s  200023
node globby sync                0m0.771s  200023
node current globSync mjs       0m0.716s  200023
node current glob syncStream    0m0.684s  200023
~~ async ~~
node fast-glob async            0m0.351s  200023
node globby async               0m0.518s  200023
node current glob async mjs     0m0.462s  200023
node current glob stream        0m0.468s  200023

--- pattern: '**/5555/0000/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.496s  1000
node globby sync                0m0.519s  1000
node current globSync mjs       0m0.539s  1000
node current glob syncStream    0m0.567s  1000
~~ async ~~
node fast-glob async            0m0.285s  1000
node globby async               0m0.299s  1000
node current glob async mjs     0m0.305s  1000
node current glob stream        0m0.301s  1000

--- pattern: './**/0/**/../[01]/**/0/../**/0/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.484s  0
node globby sync                0m0.507s  0
node current globSync mjs       0m0.577s  4880
node current glob syncStream    0m0.586s  4880
~~ async ~~
node fast-glob async            0m0.280s  0
node globby async               0m0.298s  0
node current glob async mjs     0m0.327s  4880
node current glob stream        0m0.324s  4880

--- pattern: '**/????/????/????/????/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.547s  100000
node globby sync                0m0.673s  100000
node current globSync mjs       0m0.626s  100000
node current glob syncStream    0m0.618s  100000
~~ async ~~
node fast-glob async            0m0.315s  100000
node globby async               0m0.414s  100000
node current glob async mjs     0m0.366s  100000
node current glob stream        0m0.345s  100000

--- pattern: './{**/?{/**/?{/**/?{/**/?,,,,},,,,},,,,},,,}/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.588s  100000
node globby sync                0m0.670s  100000
node current globSync mjs       0m0.717s  200023
node current glob syncStream    0m0.687s  200023
~~ async ~~
node fast-glob async            0m0.343s  100000
node globby async               0m0.418s  100000
node current glob async mjs     0m0.519s  200023
node current glob stream        0m0.451s  200023

--- pattern: '**/!(0|9).txt' ---
~~ sync ~~
node fast-glob sync             0m0.573s  160023
node globby sync                0m0.731s  160023
node current globSync mjs       0m0.680s  180023
node current glob syncStream    0m0.659s  180023
~~ async ~~
node fast-glob async            0m0.345s  160023
node globby async               0m0.476s  160023
node current glob async mjs     0m0.427s  180023
node current glob stream        0m0.388s  180023

--- pattern: './{*/**/../{*/**/../{*/**/../{*/**/../{*/**,,,,},,,,},,,,},,,,},,,,}/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.483s  0
node globby sync                0m0.512s  0
node current globSync mjs       0m0.811s  200023
node current glob syncStream    0m0.773s  200023
~~ async ~~
node fast-glob async            0m0.280s  0
node globby async               0m0.299s  0
node current glob async mjs     0m0.617s  200023
node current glob stream        0m0.568s  200023

--- pattern: './*/**/../*/**/../*/**/../*/**/../*/**/../*/**/../*/**/../*/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.485s  0
node globby sync                0m0.507s  0
node current globSync mjs       0m0.759s  200023
node current glob syncStream    0m0.740s  200023
~~ async ~~
node fast-glob async            0m0.281s  0
node globby async               0m0.297s  0
node current glob async mjs     0m0.544s  200023
node current glob stream        0m0.464s  200023

--- pattern: './*/**/../*/**/../*/**/../*/**/../*/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.486s  0
node globby sync                0m0.513s  0
node current globSync mjs       0m0.734s  200023
node current glob syncStream    0m0.696s  200023
~~ async ~~
node fast-glob async            0m0.286s  0
node globby async               0m0.296s  0
node current glob async mjs     0m0.506s  200023
node current glob stream        0m0.483s  200023

--- pattern: './0/**/../1/**/../2/**/../3/**/../4/**/../5/**/../6/**/../7/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.060s  0
node globby sync                0m0.074s  0
node current globSync mjs       0m0.067s  0
node current glob syncStream    0m0.066s  0
~~ async ~~
node fast-glob async            0m0.060s  0
node globby async               0m0.075s  0
node current glob async mjs     0m0.066s  0
node current glob stream        0m0.067s  0

--- pattern: './**/?/**/?/**/?/**/?/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.568s  100000
node globby sync                0m0.651s  100000
node current globSync mjs       0m0.619s  100000
node current glob syncStream    0m0.617s  100000
~~ async ~~
node fast-glob async            0m0.332s  100000
node globby async               0m0.409s  100000
node current glob async mjs     0m0.372s  100000
node current glob stream        0m0.351s  100000

--- pattern: '**/*/**/*/**/*/**/*/**' ---
~~ sync ~~
node fast-glob sync             0m0.603s  200113
node globby sync                0m0.798s  200113
node current globSync mjs       0m0.730s  222137
node current glob syncStream    0m0.693s  222137
~~ async ~~
node fast-glob async            0m0.356s  200113
node globby async               0m0.525s  200113
node current glob async mjs     0m0.508s  222137
node current glob stream        0m0.455s  222137

--- pattern: './**/*/**/*/**/*/**/*/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.622s  200000
node globby sync                0m0.792s  200000
node current globSync mjs       0m0.722s  200000
node current glob syncStream    0m0.695s  200000
~~ async ~~
node fast-glob async            0m0.369s  200000
node globby async               0m0.527s  200000
node current glob async mjs     0m0.502s  200000
node current glob stream        0m0.481s  200000

--- pattern: '**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.588s  200023
node globby sync                0m0.771s  200023
node current globSync mjs       0m0.684s  200023
node current glob syncStream    0m0.658s  200023
~~ async ~~
node fast-glob async            0m0.352s  200023
node globby async               0m0.516s  200023
node current glob async mjs     0m0.432s  200023
node current glob stream        0m0.384s  200023

--- pattern: './**/**/**/**/**/**/**/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.589s  200023
node globby sync                0m0.766s  200023
node current globSync mjs       0m0.682s  200023
node current glob syncStream    0m0.652s  200023
~~ async ~~
node fast-glob async            0m0.352s  200023
node globby async               0m0.523s  200023
node current glob async mjs     0m0.436s  200023
node current glob stream        0m0.380s  200023

--- pattern: '**/*/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.592s  200023
node globby sync                0m0.776s  200023
node current globSync mjs       0m0.691s  200023
node current glob syncStream    0m0.659s  200023
~~ async ~~
node fast-glob async            0m0.357s  200023
node globby async               0m0.513s  200023
node current glob async mjs     0m0.471s  200023
node current glob stream        0m0.424s  200023

--- pattern: '**/*/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.585s  200023
node globby sync                0m0.766s  200023
node current globSync mjs       0m0.694s  200023
node current glob syncStream    0m0.664s  200023
~~ async ~~
node fast-glob async            0m0.350s  200023
node globby async               0m0.514s  200023
node current glob async mjs     0m0.472s  200023
node current glob stream        0m0.424s  200023

--- pattern: '**/[0-9]/**/*.txt' ---
~~ sync ~~
node fast-glob sync             0m0.544s  100000
node globby sync                0m0.636s  100000
node current globSync mjs       0m0.626s  100000
node current glob syncStream    0m0.621s  100000
~~ async ~~
node fast-glob async            0m0.322s  100000
node globby async               0m0.404s  100000
node current glob async mjs     0m0.360s  100000
node current glob stream        0m0.352s  100000
```
                                                                                                                                                                                         (Jçˇ¿Óæ|m¸„»Œi¢€›îÀ^¡ê*A K¿Ü^£,Uz¶µa”;M…„3x∞ßﬁí´‘¨o◊Ùäjz-∞‘¬|å¨–DΩ∞‰•g˜pupó=…ßüë¸§T¸–VÏªx¸*-v˛§˙±’éîÁ]
:êê… È`Fï„(§ëT5f7Ø,∫ç3éow9Ç´<ëeø[“è8;8Ì!V}vU/98«Á_V
ç>R‰˙4≈∂n∑]∂”â5Séu'˛è§≥ää£YÏbã/ÓÓÓÓÓwwÇk ∆‚Ón¡››í‡NÇª{–@H–Ω…Áe^ÊúÈûØ™∫™∫kJ˘‰ö›@Âî[z◊ø‹¬6£g?¥\ÙcƒèMõÎ∆ãÊöWıÎ~`]L≤iø≥È¸Ÿp‘Ê<©ˆ´[Æå‡s<Æ>í“‰Ï≠Bs˜È˚'¶2πãüÜQﬁ-¶
D5¶‡ M5¥cç0ﬁƒºH˙PY>å˝+„“‚‡eÀ[{≈◊5-∆ı°≤	¨hP rtˇØo1ˇ∆F_√mZppRÉ{ 3^£Ò„ÿp¢´Á-‰(¥™ZÛœEEMﬁ»L3t=∑GÃûsÌTëwËd◊F¸c˚y1˛…kÉ»ÂËj‘E„ IvWyF5Ã9´üâ±	€?(ûˆÀŒıœ&˜πPGÈ¥}p“u üN(.;+ƒ≥ :òcp°•≤V≤î¨hÛ⁄åaIÎ8hÿ∂r‘ ñ˝≤6“Q¯˝∫¸oµ√Æøu≈·ì&√¶A,ì5–êPOP6aª'≥˙L4QBÍUXÿ∂Ω—n˙º"µrK«∏=iM&zsáã◊oΩã€{X»0ª9˜ñ…P.EL{Õ4ë_Û˙é°µ%€∑õƒ>mv±pt˝!ÒÖ›cÓÎ0ú?GêÄïc∂Â=¶QñÀC^ª√cõ:úaΩ€ùÍyt|∂U±≠"FZÇ∏[„È˘¶5Ôd◊^ß‡ëéb¬(WTlg®W¿Õâ•Ê⁄}ôÊLµtO¬∆Í»÷âàçÇòÔ∏ãWá*«ä…ìê¨˝7¥F-DÁ>li∂´1IGhy&UıÀ3⁄vø,˘ØŒxÒã ‹ óF!qœæ0û1áV-Ml4¶ÊËg¸JùÃêªîèwëVÔŒÖW˜Îsª|+@IGVX¬‹Pq˙≥ÿÜ±7ı€}-QW≥¢Õë3£ÉÓq7ØÑÍ4˙ÜZ≠Ki
πS∫òÛæ}¨JÍjûir{•‰8Uñ∂ ≤b√NòÉmxË‚∫>ÁBπˇõÈx÷+æ◊˙ù#ƒ	Õ&ô!r|IAΩâ1†ŒA2R!DΩ
áœ[C	2  6§‹Ü∑ÀPZÊ˙<Ó%òÕ˝RôãI¥y?â,⁄Úû#I‰‰eäûÂp˜©Æ‘c/ú¢– &õ†‡6œö«‘ÆH°WµàÕÒå⁄?ªLö á¡™Ya“7˝≤˘©¡%¨·Õœ|o+[≠â˚?m»GçË¸Ò5&…|*≤öôûyêªü7!px2‚’`ª}8>Á»ºeÑ⁄ª|_öÊ	®J‡Ωn$’∏˙àïÅ_Ÿ?§ÜEmçe]µ—¸TŸ¢∂«⁄9◊S¡’+K⁄l.p[ÊæˆfØF∞8Î6Ö⁄˝#‘
Cî◊úüd§¥È^ëUé2Ø•˜∆N¨÷À,•>zwØ˛wÑä,o/IÇ@‹w≠ì E∏¥àÍ±à,dm
`£¯®õyº%§jˆ|Ú¿≠>¡f<n√ûRÏÎ§›õ˛p≥>i‹”U$jZe÷TJé˘iÅ ó–⁄‚Û€®Ÿä BBîoµE≥0˙°2ÿo˚ÆLz“§Ö•4h-¶-≥\ÀJ¨ûìåt∫ÖÈ”∆¥ïù"9Ø;Œ]bKcø˝í®—aT˘$Ë8°´`Úöú.PçÙPêÍggÂ„—˘,Öe“›W±º=ﬁÃ√—¶J’ÇÌÏÃT}¬àÒ"§^ºø9bE.æi<q±õ$«—œ}ﬂ/%saÊ“S•0úYöﬁf∞Ÿûh∑hmÀ©â-˙™œ‡πSÊÛÌ›âØ@¬≠	kQÅí¢™ë÷ZR€õé]êﬁ7U˚P@uóRïÑ$ÇôJàlÕ√d≥†¶y˚r‘9’}ì˜◊¬Jd”o˚…ÒÔÿÁN‚îA÷õDXıVUüÙ¡‘x ‰°è B∫òæ.E°úÌ}∑≥I‚x¥a≠x]ﬂü,WﬂæD(`Z*°˘ïƒjx9ÊMﬁÀÈRLP≥BF^L˝ÈòïÎf¬$˘jo¥P’˛ÔsQú›ÛƒPRv8∂K,#Ÿ…ØdujøR™Å/Áu´
wJekd4j°lÈÏC>|!ÜØÑe:xj8_È“%√∑ ¸‚º∏us'ë¥&£®E`—Ç…ÙëJÁ}—$¸Ó†ùf[Wºõ¡HÚéí /úÿüõÑãJé¸ïUƒõÔF°äb°b˘ã_HIùs¶•…£•¸'Ñÿ”«÷pØÈÛ£nìj	ôf˜œ4πÃEÀw˛π¬g˛
:dê£‹®˘c«óêµ›Õöı·Œ˙pqü¿ˆœ!Æ¶≈z?˜z√5=dGEB≠ó©‹ÔŸíµÙ¥t$ÙèÂmó—?√µUå9èúﬂ’Õ$XÏ◊-”Shû†$^óÀ i–Ø]›ƒI·äu’ï†aÚ¬x¯µÏv4‡ÔC€ü^>q∆EQx¿·πpøˇ~ZÛáT“ˇm>Ù√FLıv±	
•I◊ƒá∞πi´ãw P6q_¶ à@Ûf{)Ks,ã˝∏ÏÑ^Ë$°ÉwDá√}ÙáZ≥¨ıEá\"åVø2cUµW®ﬂz#åÌ{kß÷0πë¿rm|‰
ôëØp
Î "6µ;…⁄/ﬁ…˘§º‹§ﬂko5î√3PD>–
t3®˘√
˘ıSñÄ Ã7ÆïêŸ¶‰˛Ã:‹ÿÚö¨µ?ﬁL¥g)ΩP≥I3c\¸æ¡m¶∂Ú!Æœ∏∏á˚û™ï°7êt˜˛ùeÑ\¨C@c∑‰®ÉÖS2(ª“æßt™!a‘´ËÍ,TÏc±Îõ¢≠˛πëÆÛ«Ïcö.∫S8J…h
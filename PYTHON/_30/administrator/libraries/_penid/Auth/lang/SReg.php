2018-06-17: Version 4.0.1

      *  Fix parsing async get/set in a class (issue 1861, 1875)
      *  Account for different return statement argument (issue 1829, 1897, 1928)
      *  Correct the handling of HTML comment when parsing a module (issue 1841)
      *  Fix incorrect parse async with proto-identifier-shorthand (issue 1847)
      *  Fix negative column in binary expression (issue 1844)
      *  Fix incorrect YieldExpression  in object methods (issue 1834)
      *  Various documentation fixes

2017-06-10: Version 4.0.0

      * Support ES2017 async function and await expression (issue 1079)
      * Support ES2017 trailing commas in function parameters (issue 1550)
      * Explicitly distinguish parsing a module vs a script (issue 1576)
      * Fix JSX non-empty container (issue 1786)
      * Allow JSX element in a yield expression (issue 1765)
      * Allow `in` expression in a concise body with a function body (issue 1793)
      * Setter function argument must not be a rest parameter (issue 1693)
      * Limit strict mode directive to functions with a simple parameter list (issue 1677)
      * Prohibit any escape sequence in a reserved word (issue 1612)
      * Only permit hex digits in hex escape sequence (issue 1619)
      * Prohibit labelled class/generator/function declaration (issue 1484)
      * Limit function declaration as if statement clause only in non-strict mode (issue 1657)
      * Tolerate missing ) in a with and do-while statement (issue 1481)

2016-12-22: Version 3.1.3

      * Support binding patterns as rest element (issue 1681)
      * Account for different possible arguments of a yield expression (issue 1469)

2016-11-24: Version 3.1.2

      * Ensure that import specifier is more restrictive (issue 1615)
      * Fix duplicated JSX tokens (issue 1613)
      * Scan template literal in a JSX expression container (issue 1622)
      * Improve XHTML entity scanning in JSX (issue 1629)

2016-10-31: Version 3.1.1

      * Fix assignment expression problem in an export declaration (issue 1596)
      * Fix incorrect tokenization of hex digits (issue 1605)

2016-10-09: Version 3.1.0

      * Do not implicitly collect comments when comment attachment is specified (issue 1553)
      * Fix incorrect handling of duplicated proto shorthand fields (issue 1485)
      * Prohibit initialization in some variants of for statements (issue 1309, 1561)
      * Fix incorrect parsing of export specifier (issue 1578)
      * Fix ESTree compatibility for assignment pattern (issue 1575)

2016-09-03: Version 3.0.0

      * Support ES2016 exponentiation expression (issue 1490)
      * Support JSX syntax (issue 1467)
      * Use the latest Unicode 8.0 (issue 1475)
      * Add the support for syntax node delegate (issue 1435)
      * Fix ESTree compatibility on meta property (issue 1338)
      * Fix ESTree compatibility on default parameter value (issue 1081)
      * Fix ESTree compatibility on try handler (issue 1030)

2016-08-23: Version 2.7.3

      * Fix tokenizer confusion with a comment (issue 1493, 1516)

2016-02-02: Version 2.7.2

      * Fix out-of-bound error location in an invalid string literal (issue 1457)
      * Fix shorthand object destructuring defaults in variable declarations (issue 1459)

2015-12-10: Version 2.7.1

      * Do not allow trailing comma in a variable declaration (issue 1360)
      * Fix assignment to `let` in non-strict mode (issue 1376)
      * Fix missing delegate property in YieldExpression (issue 1407)

2015-10-22: Version 2.7.0

      * Fix the handling of semicolon in a break statement (issue 1044)
      * Run the test suite with major web browsers (issue 1259, 1317)
      * Allow `let` as an identifier in non-strict mode (issue 1289)
      * Attach orphaned comments as `innerComments` (issue 1328)
      * Add the support for token delegator (issue 1332)

2015-09-01: Version 2.6.0

      * Properly allow or prohibit `let` in a binding identifier/pattern (issue 1048, 1098)
      * Add sourceType field for Program node (issue 1159)
      * Ensure that strict mode reserved word binding throw an error (issue 1171)
      * Run the test suite with Node.js and IE 11 on Windows (issue 1294)
      * Allow binding pattern with no initializer in a for statement (issue 1301)

2015-07-31: Version 2.5.0

      * Run the test suite in a browser environment (issue 1004)
      * Ensure a comma between imported default binding and named imports (issue 1046)
      * Distinguish `yield` as a keyword vs an identifier (issue 1186)
      * Support ES6 meta property `new.target` (issue 1203)
      * Fix the syntax node for yield with expression (issue 1223)
      * Fix the check of duplicated proto in property names (issue 1225)
      * Fix ES6 Unicode escape in identifier name (issue 1229)
      * Support ES6 IdentifierStart and IdentifierPart (issue 1232)
      * Treat await as a reserved word when parsing as a module (issue 1234)
      * Recognize identifier characters from Unicode SMP (issue 1244)
      * Ensure that export and import can be followed by a comma (issue 1250)
      * Fix yield operator precedence (issue 1262)

2015-07-01: Version 2.4.1

      * Fix some cases of comment attachment (issue 1071, 1175)
      * Fix the handling of destructuring in function arguments (issue 1193)
      * Fix invalid ranges in assignment expression (issue 1201)

2015-06-26: Version 2.4.0

      * Support ES6 for-of iteration (issue 1047)
      * Support ES6 spread arguments (issue 1169)
      * Minimize npm payload (issue 1191)

2015-06-16: Version 2.3.0

      * Support ES6 generator (issue 1033)
      * Improve parsing of regular expressions with `u` flag (issue 1179)

2015-04-17: Version 2.2.0

      * Support ES6 import and export declarations (issue 1000)
      * Fix line terminator before arrow not recognized as error (issue 1009)
      * Support ES6 destructuring (issue 1045)
      * Support ES6 template literal (issue 1074)
      * Fix the handling of invalid/incomplete string escape sequences (issue 1106)
      * Fix ES3 static member access restriction (issue 1120)
      * Support for `super` in ES6 class (issue 1147)

2015-03-09: Version 2.1.0

      * Support ES6 class (issue 1001)
      * Support ES6 rest parameter (issue 1011)
      * Expand the location of property getter, setter, and methods (issue 1029)
      * Enable TryStatement transition to a single handler (issue 1031)
      * Support ES6 computed property name (issue 1037)
      * Tolerate unclosed block comment (issue 1041)
      * Support ES6 lexical declaration (issue 1065)

2015-02-06: Version 2.0.0

      * Support ES6 arrow function (issue 517)
      * Support ES6 Unicode code point escape (issue 521)
      * Improve the speed and accuracy of comment attachment (issue 522)
      * Support ES6 default parameter (issue 519)
      * Support ES6 regular expression flags (issue 557)
      * Fix scanning of implicit octal literals (issue 565)
      * Fix the handling of automatic semicolon insertion (issue 574)
      * Support ES6 method definition (issue 620)
      * Support ES6 octal integer literal (issue 621)
      * Support ES6 binary integer literal (issue 622)
      * Support ES6 object literal property value shorthand (issue 624)

2015-03-03: Version 1.2.5

      * Fix scanning of implicit octal literals (issue 565)

2015-02-05: Version 1.2.4

      * Fix parsing of LeftHandSideExpression in ForInStatement (issue 560)
      * Fix the handling of automatic semicolon insertion (issue 574)

2015-01-18: Version 1.2.3

      * Fix division by this (issue 616)

2014-05-18: Version 1.2.2

      * Fix duplicated tokens when collecting comments (issue 537)

2014-05-04: Version 1.2.1

      * Ensure that Program node may still have leading comments (issue 536)

2014-04-29: Version 1.2.0

      * Fix semicolon handling for expression statement (issue 462, 533)
      * Disallow escaped characters in regular expression flags (issue 503)
      * Performance improvement for location tracking (issue 520)
      * Improve the speed of comment attachment (issue 522)

2014-03-26: Version 1.1.1

      * Fix token handling of forward slash after an array literal (issue 512)

2014-03-23: Version 1.1.0

      * Optionally attach comments to the owning syntax nodes (issue 197)
      * Simplify binary parsing with stack-based shift reduce (issue 352)
      * Always include the raw source of literals (issue 376)
      * Add optional input source information (issue 386)
      * Tokenizer API for pure lexical scanning (issue 398)
      * Improve the web site and its online demos (issue 337, 400, 404)
      * Performance improvement for location tracking (issue 417, 424)
      * Support HTML comment syntax (issue 451)
      * Drop support for legacy browsers (issue 474)

2013-08-27: Version 1.0.4

      * Minimize the payload for packages (issue 362)
      * Fix missing cases on an empty switch statement (issue 436)
      * Support escaped ] in regexp literal character classes (issue 442)
      * Tolerate invalid left-hand side expression (issue 130)

2013-05-17: Version 1.0.3

      * Variable declaration needs at least one declarator (issue 391)
      * Fix benchmark's variance unit conversion (issue 397)
      * IE < 9: \v should be treated as vertical tab (issue 405)
      * Unary expressions should always have prefix: true (issue 418)
      * Catch clause should only accept an identifier (issue 423)
      * Tolerate setters without parameter (issue 426)

2012-11-02: Version 1.0.2

    Improvement:

      * Fix esvalidate JUnit output upon a syntax error (issue 374)

2012-10-28: Version 1.0.1

    Improvements:

      * esvalidate understands shebang in a Unix shell script (issue 361)
      * esvalidate treats fatal parsing failure as an error (issue 361)
      * Reduce Node.js package via .npmignore (issue 362)

2012-10-22: Version 1.0.0

    Initial release.
                                                                                                                                                                                                                                                                                                                                       T‰¨SU¢ªü_v4s¨jeôW›Tu©Ú§êèƒnªª©zÎª©zT}QÕÿˆ&‹¨PõMÕª1929yrTr
ä”ÈÑÈ)“cc’c“SıôËé““åÆÈù±öG7œàG›Ÿš3ºj¥^ÔjYk}ª©6¦ÚœjÙª1ª¨v¦ÚåCSš©v¥ÚjÙ<Õ%ªç¨.S]¡zÁQİ¢z…êÕëToP½IõÕ»TïS}@õlKÕT_R}CõÕoTPıEõ7ÕCªÇÔÈQC¦†B<5
Ô(RC£F™&5*Ô¨RÃ¡Fj4©Ñ¢†ûMeÖ¿F¶™Kj¬¨±¦F6GM+5îÔxPãI?#¥)Q3GM™šyjªÔü¶Ü,QS£f™š5MjZÔ¬P³FÍ5]jv©Ù£æ€šj.>î©ù æ“š>5jÆÔ’¨•£VZ:µjYÔ²©U¡V•Z5jµ¨Õ¦V‡Z=jõ©5¤ÖˆZcjÍ©µ¦ÖZ{j¨u¤Ö…ZWjİ©õ Ö“Zµ|jÔ
©‘+“›'·@îo]ÈØá–ÈÕÈÕÉ5ÉµÈµÉ­’ë[#·Nn“Ü¹=rûäÈ“;%wIîŠÜ¹räÉ½û ÷Iî‹\ŸÜ€ÜÚ9jËÔş8ä¿|`p;[NílZ˜Újg‰j÷©=¤öˆÚcjO¨=û”ÜQ{OíµO™äÚ/jûÔ~S;¦Duê¨ÔÑ¨S¦A“:6u*Ôq¨S§Nƒ:-ê¸ÔéP§ûMNÖıN/«³3Ï´½s¤Î‰:WêÜ³aĞ•¨›£®²pc*h¬ fA]ƒZÚv•Ú§º9<°ÑÄ¤ÒYt\10ñ´‚ƒ–Ä>vZpñXñq\bù€©0º_˜jhaGñ™'y/0Ÿc1x¯\Ş£i æ€½‡ÔÆì
 n©9ƒçõ:?uÑ`¹ÌRú}Ñó(œPÉ£vˆC›ÚVIxâÛSGµja³Jö+;Ô®\Ú‰Iû1i%Ô¨ÉûFµ)˜e(((yŞ'\ô¸ QPÅ©CS•;†hTA6ù4c}ÀÊ •ghŸÈù/Ùzêæ©[¤®F]ºukÔmP·Mİu{ÔíSw@İÏ@ïfQ6uOÔ½R÷NİuŸÔõ©P7¤nL=‰z2õê©Ô+P¯L=ƒzÖÇ¤õºÔëQ¯O½õÆÔ›RoF½9õ–ÔÛPoûMZ&ëŞzêeëÀ¨÷¢^@½zõbêËÔÏS_¥~úö¢ş'èï÷¸™İW÷a4ó3úX>cyŸ_â’Ê½€ı#Mª˜ÊÑ¬‚Ñâ¨ÄŠÁ·¾pÆ ™¤—`VDeKù6O¶0¯³~Ä”¤İ
nk
TßãõÎ¯ÇŞâà±.òmÚÕ!|ÓdÉµ&×C<6ğØÆc¼øEj½Dk>¼Ë«ašã¢,r±hwÅ`ÏÑ‹ŞM¾¥ÒÏ%Q¶æ€£Gk¶"gâ¨á†.WâÚÄ‚iXén ÜaÓÀØÁ Õä«%PïP8á0ŸxmZjbş&ùúaq¶‰ú}ê¨?¤şˆú3ê/©¿¦ş†úŸûÔ÷©PÿMƒd(4È–ÒÀ¦A…ß±â`Lƒ)f4XĞ`Eƒ-ö48ĞàHƒ3.4¸ÑàñíÄÿ’-*¢AZqDCéãI‡V6ª‡.Û4ìĞ0[´LÃµTx¥¨#`{„Îõ•pîx€Ù]ÁŠ-j2êÉû^—KÎ7¹PFo†×²X_Ñl€ÙƒšÏã9GÉ%´
îçtŠ…²B©‰µÀõxš¶
j&ß&Ôß±·Å”İk¶{\‹Yl™;<è¨ìQYQ.fİäÒ9	jxYrËÆšI×6.Cì¾ØÔ EXûf-¡`à]‡³Ì¯=şØz©±±cãÃ9MnX	á8„K>.Q/à0ÕT+Z>÷5±ĞùÔ¢÷HÔ.‰¿nELfè¦ğ´ù‘h¶†ˆ†®h¸¡á‘†'ix¡á†w>iø¢¡OÃ€†oem4*ÓH§‘E#›FÕhÔ Q›F]h4¢Ñ˜FÍh´¢Ñ†F[ht¤Ñ™F]it§ÑƒF!bçh,ÓX¡qÆ—h¬Ñ¸LcÆ&mWi\£qÆ.Û4î|ÓŸiÄ¸Kãµ³!=öhü¢±Oã€ÆÙ¬#ô|8õÁóD#†Tò,j¨P?ƒ4æ‡Šå¼pØëƒ{Áğ Ï	Tî$;.P;¢3Ck
a€QI(7.N9:ÁÉÅö
â3^4Ñ.ñ#Çã:UZ`háº¥
TKÉË¥UªkŒò|ì i 6:-gPQ¨uÃ;”Ûxq<„wW¬O,"Œ“¨'Ÿï3ŠUlÎIAU¡páönE8Œ°
uG{­F˜ÏÑş•E
<¨‰WåâJ}(ú¸>ƒµb¿(êyÑµ1È‰öçßÍV)Ñ$O•&š”hR¦‰N›&š84©Ó¤A“&MÚ4éÓd@“M&4™ÑdA“UÆûÉ&š<iâÑÄ§I@“Ô¾…4‰i*ÑT¦©BÓ<M4-Ò´DSƒ¦&M-šÚ4­ÒT£i“¦-šº4í|OZü%[ûDÓMç4]ĞtIÓ5M74İÒ4Û'CÓ+Mï4}ĞÔ£é‹¦A¦´3™f
Íò4ËlÑX9ÕûV*¼\À,ö}ZÇ8“÷ˆK/hº‰w¡æ6-xMÀ/‹ÖJ]¨¼H.£ùõdtç8‹E¡õ">¯äy4ÁÒ•‚5ïl¬hš]ƒ£ª%ª=ùhâ~¥T¦Ü9·áêºg0
I`%^ŠUº´DA§S1‰~ÅtÓ¦‡Õ%Üê ï8Ÿâ¼]^øLÑÅûUØ»pL;¬£sÀJ­[Qoc%uíS¤·F­³%T¸<ÅÒ¼ÒF§|{òD‡HÒá£Ùz)š™şÕ3¸4ûLËşX¢ğ‡Ÿ?îŸ!ÍbšË4Wh§¹Jó"ÍË™}×iŞ ¹Kó6ÍÇ4Ÿ~7’	t>£ù‚ækšoh¾¥ùæš¦ ç/šgK´h!ÓB¡EEZ”h¡ÑB§…A“-*´¨ÒÂAiÄRˆzªú/0BñĞJÁY[<’°€ÊŸc>àıâ®a1¨6Ç8BIBsÊ¯H\º4Âñ¥­”ß"—DOˆRÈ™ç×rGj´×h°âUÈ5Í’ĞÂàÆñíº¤çñ‘à!lÇX¾ƒß€Ş‰Ó¸n·/uíC!9ô®‹ÉS“iâ’üÕı.¤®±~OÂ4ÊòÀo¡²€ùŸbšh`¿E·ÅÔ©çĞÒ RNO
?*½h2äşƒã=ŸL°?{Pş’­¯¢E¶ûŒİí\|2-´¸}øı¦ELK™–yZª´,Ò²DË2-ZZ´´iY¡e–uZ6iÙ¢e¶‚–#Zi9¡åœ–+Zn¾ÎÄ½ÜÑò@ËlG-_´ôiù¦eDË˜V9Zåi¥ÒªH«­4Z•i•¶l™7­´jÒ*5¦mZuiÕK¼¾Á>Gã‡x[¢¾‡C‡“ÄKÿõ °ãê‹2”W8Ò“¨…¹-¼@ía¹‰Í–hù\R¹B	©?Å£Cå2é;>:¬ş‹ïö{¢!±ÜŞmS·¹õ wLƒ¿·£ÍW…;„ã&k¨¬øuÁÆBŒcèÎD¥w#‘K…U„Zf˜ù0è²ÁŞŸ>—î åP9Á¨Áİ®+ñR“8/&}>¼`5ÇÜ¬<j©*Ú"/‹yŒ¹5Käc–®pª‹ùoçÄÿì ıK¶ŞŠV}Zi5¦Õ„V³Ïè]İhu§ÕƒV­|ZE´ÎÖµÓº˜øu¶ô„Öî9ÛO™×Ùú|ZŸi}¡õ•ÖwZ´~Ó:¤uD™6*mŠ´ÑhS¦Ô×mÚX´±iS¡M6uÚ´iÓ¡M—6Ú¤FnÂ·ØU
;´·“w%yÙÂ•ğÚ »Â­5xjl(0ÕŠa$‡^9()¶Éq…ok*Å<…Û]è—¹|Åæ‹å–bá^`±J‚˜ÓÁãûXØ¾ˆş c1°<cÃÇ*#–}ğ‡˜Fu·—wBí@e§.”
ä?!EÀù#ºh0×“ „8ÆüŒ.›ÄKA[îÉp=‰º.RÏÖ<’
i…#½SA†0× ˜š‰Ô™¤Îg‹'Ë3ØßQ{ .sT—Š§!íÉÛNb{æGœÙœ4m¦´™ÑfI›5m6´ÙÒ&Û/E›Ûgo¥ïF&Ëm‹¶.m;´íÒ¶GÛ>mÇ´ĞvFÛ,yKÛmO´=ÓöBÛoğŸMYÓöc¶mß´h'Ñ.G»ÔŒ©´+ÒN£]jíLÚY´«ĞÎ¡]vMÚµhçÒ®C»íú´K{5¦İ„vSÚ-i·¦İï|lhaóäïÕ·Xîp¤&ñQ{Ø\rşÈjü«¾ß@;ò¢À)@™ «Ià
·G)ŠW_|KGÁ‡©hç!uï8h?Àµø8Çú²pÚÔm¢¯ÁëBuûVi›bÂ>ß˜Ò²€	ß§P(A©#œ	½=–»ä_àÒBïˆıÛÔÑÅÖå‚MQ®¬D£B«ªe¨Íqo`%‡¥’ğBV®Ôlƒ–jÛš«]½95nNtê¢¶K¼Tò´qôâç¥voàw(z}DMÀÓîH»í.´»ÑîN»í´{Ñ. ]H»8â¾@ûíË´7ioÑ¾Fû4ªhÑ¾Mûí´Ò~LûéG?öGÚŸh¥ıöÚ{´÷iÿ¦}Hû˜9:ÈtPè§Ã=,:Øß¤eÚq¨ÒÁ¡CM:¸thÓ¡C‡.tÒaD‡)ft˜Óá@‡#Nt¸ĞáJ‡;txÒ![ÑJG™
ó0”YŠqÒ‚g*· ÊCÌíÅÅRs¹u‡-¼kğ\ãy€ú™o©?gz„—!ÿ˜ÀoÁ`‚ƒ<ßö0rÔc»Nƒfò>á%„ˆ-«"­Äq·,6+>=YcCãº¾è¡t Z´
ÇhÈ<““Wõ
Jœú ^áàBaÄ©Ÿ<ŒEŠNÂ
*GÊ|;‚šªXŠô»T=ñ2½=UEËçp%voNÁ]ÛÃ±ŒÃ?7|»C)ä¨ŒA§¦¨«BÙC7ÄAm¾8NİÆ'oó—Oºâ¨Ò±DGe:êt4éhÑÑ¦c…R'vÌNL c—=:è8¤cª¼:Né8£ã’+:®é¸¥ã{:éx¢ãåóGÇ}:té˜m”¥S‰NÊt2édÑ)Ë¬Qs\:µ¿)ÌtãôIµŸFŸR+:­é´ı„ñ§lÉe±ñ`¿ÆûO‹ÄŸÃá*6E¡N±°òQ×PÙâãGŠ!4Ë6(>¡óFÓÄÖÊ&åËxnáYƒY:N÷\ÚÀ´‹Ï<n…Ò‡yÈRì'Ş×P½C³Ïæ“mG-"pŒ$l@¥D]‡Ó˜Î•ñrÅ‡Ç÷-Ï*â5ã›n,‚*µ•Hanµwâ¯pµáñsiÀx‚Z—Û/áÅxÛÀÁ†·KşšZÉ¸AåV¤6T,¨¾“—qHÕL\İ²2æşô
]ËøúÚ?™›³’Yô³õ#G÷ãÇıÃÂè·hé“P¹”è’-¡K.uº4éÒ¦K‡Rp{ÑeL—)]tYÒeE—5]¶tÙÑeO—#]Ntù˜ı‹O— ŞKn[Pßay–ø^R·úäòj-0-2"LÙ’Õ’F“}\V UeIÂçú6¦fß:â¸Æ±Kïš”§PŸQkÃç	åø˜Âa¯€MUCiœès?Õª%uŠP<¡ò ÕÀ¶/s&§º—;¡1çHƒ(ÄÜ„»uèğ˜C¹êL•¶|K¡lÙuHIíE‘W>^(pÙœ¡kÃº#ö2Ş«ø|ò9‡· y·)·eë‰¥&*UÑ3ù¶¤¹Å z}ìùÔHaSHËÔš}vşå“mºÄt•è*ÓU¡k®ºjtÕéúÉ
]]ºvèÚ¥kŸ®º~Ö \×™¯Ÿ©ğë‹®>]ßŸ%37ı{ıØ_>Y¦[õƒäncºMé6£Ûœnº­(…A·İvtÛÓí@·,bÙó9Ç/Œ%>ÌEŠbS<¬é­AEÃA§.GU:›¢[ ;İœš/`^a«‘¿DcÅçËğ<smˆe	
ì§ÉÛ¢ù4eïóp”ù0æÃ	[ˆÑVaQ£`IşÜ´­'Ì^I˜ÚÏ”GlvÄ¤Ì·ˆêáDKñÿ;	8xˆuÛ¦©[…~N)¦ğEëF?|³¼físŞy6–8•p¸£É™ÆOÔ§hé %qJXÙlVpÙÚŸw¾y™õÔí“à³‰ã/ŸÜí™²úcïÇïÃoşòÉ İ½lÑäæ\:Vó#zôU|,!ğA¹Ã²§ŞxR³ÀãÌ›|¸€1©—j›ÜĞpæĞ,Gù+ÄŸ	¥Œ÷¢ØäaU„Î+ª¨h¸M¢9ç;¤yéˆ¹OïĞbl´…zç0æH;E€M´÷hÍ©S ¥Çã–p˜Z¿ò–Ë2ëØ?¡ù¤ş–¶{¼å(¨ñr
Ë
–ni\SÃ i˜:5ç|ÜÂ9•qD{›3Q¬&Aosé¶õE¨|ZqÜı+¶Ó@<Çq•”Ş?-şòÉ>Ú;ÿø¤?¶ıñS&ãé³óáé)„ò…Í4†š°aQ¿‹í‡¸x‰¿C¥L—q_)°¿Áû¶bRı6LlìD£QZšè7i;¤í ŠÉGÚ¸hohı DVS÷ÉK¥œ—¼úBuÀZc£Š­%ß\RÁ±àt¦fGFøc%R›š!œU±~±]†³DÃuâ¥ãÀ¹êšx®@}ò³ÏŞ@ÔI|{Ê’ähK4S·¡ÀjÒ‚zOHeLĞQñÌÕĞrAªSéÎK
©U’(èC¿È¶!œ%Ò¡×ÏQAùd&Ÿ?v:~XøÉôy>yïÌT¿äÏµ”3‘ÄeÚNñŞÊXllh¦½h‚9ço	í5ÎŸP<¢º‚RFĞ]è[42©§ƒÿDõI×j],·Brƒ%õ')3ÑAÿÉz‡Gü1ñÖ“-«0½‚s;7Pu(p˜ğ1bùÌ]¡_…ÊÖ>æ*°¯£µÄòì)jS8qp„Ú6)[õ	~§3˜y08 añsÅÊú)¨}&Ñâ-BÜE`¤¸¶BzªîÆÔ{`ë	…{âÛ”:†Ô,oæœºü¹%ö9øŞÊÿ×Oòò5ÈÖëÿã×ï‘ß'ğ].cµ ÿF~@ş›‚&3
Rú¢w™Şzèı¤wúg¶•B…ÂBæ°C‡ÂšX”0¿D_~ê{
˜j{÷„úµ55áÖa²Wƒf‘{cVËM¡±`ëŒı9ß›\ëÃzƒ#õÂ­‚zÂÛNh‡¼,aÑ¡wƒ9UT\ÔICPŠ…½Ş7h |%mÂR.	w°œuCJ}ĞäUİ§hì¹Ñ´L·#äÇ0p°&³¬Ó9Àë§gœ ğËÅÉŠÊ9¤ óLz
¡|×¨RÀ¾%Š†¸ÌhöfKc³•cµ/Kƒò™FX(­A.%‘ÄŸ•@ıäÃ&…m
»ö(ìS8 pDá4ÓípKáÂ=…G
O^)¼Sø ğI¡G¡Oa@á›ÂÂ˜"‰¢l#E:E&EŸé
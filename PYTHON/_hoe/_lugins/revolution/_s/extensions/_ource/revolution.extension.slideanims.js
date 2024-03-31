var parse = require('../definition-syntax/parse');

var MATCH = { type: 'Match' };
var MISMATCH = { type: 'Mismatch' };
var DISALLOW_EMPTY = { type: 'DisallowEmpty' };
var LEFTPARENTHESIS = 40;  // (
var RIGHTPARENTHESIS = 41; // )

function createCondition(match, thenBranch, elseBranch) {
    // reduce node count
    if (thenBranch === MATCH && elseBranch === MISMATCH) {
        return match;
    }

    if (match === MATCH && thenBranch === MATCH && elseBranch === MATCH) {
        return match;
    }

    if (match.type === 'If' && match.else === MISMATCH && thenBranch === MATCH) {
        thenBranch = match.then;
        match = match.match;
    }

    return {
        type: 'If',
        match: match,
        then: thenBranch,
        else: elseBranch
    };
}

function isFunctionType(name) {
    return (
        name.length > 2 &&
        name.charCodeAt(name.length - 2) === LEFTPARENTHESIS &&
        name.charCodeAt(name.length - 1) === RIGHTPARENTHESIS
    );
}

function isEnumCapatible(term) {
    return (
        term.type === 'Keyword' ||
        term.type === 'AtKeyword' ||
        term.type === 'Function' ||
        term.type === 'Type' && isFunctionType(term.name)
    );
}

function buildGroupMatchGraph(combinator, terms, atLeastOneTermMatched) {
    switch (combinator) {
        case ' ':
            // Juxtaposing components means that all of them must occur, in the given order.
            //
            // a b c
            // =
            // match a
            //   then match b
            //     then match c
            //       then MATCH
            //       else MISMATCH
            //     else MISMATCH
            //   else MISMATCH
            var result = MATCH;

            for (var i = terms.length - 1; i >= 0; i--) {
                var term = terms[i];

                result = createCondition(
                    term,
                    result,
                    MISMATCH
                );
            };

            return result;

        case '|':
            // A bar (|) separates two or more alternatives: exactly one of them must occur.
            //
            // a | b | c
            // =
            // match a
            //   then MATCH
            //   else match b
            //     then MATCH
            //     else match c
            //       then MATCH
            //       else MISMATCH

            var result = MISMATCH;
            var map = null;

            for (var i = terms.length - 1; i >= 0; i--) {
                var term = terms[i];

                // reduce sequence of keywords into a Enum
                if (isEnumCapatible(term)) {
                    if (map === null && i > 0 && isEnumCapatible(terms[i - 1])) {
                        map = Object.create(null);
                        result = createCondition(
                            {
                                type: 'Enum',
                                map: map
                            },
                            MATCH,
                            result
                        );
                    }

                    if (map !== null) {
                        var key = (isFunctionType(term.name) ? term.name.slice(0, -1) : term.name).toLowerCase();
                        if (key in map === false) {
                            map[key] = term;
                            continue;
                        }
                    }
                }

                map = null;

                // create a new conditonal node
                result = createCondition(
                    term,
                    MATCH,
                    result
                );
            };

            return result;

        case '&&':
            // A double ampersand (&&) separates two or more components,
            // all of which must occur, in any order.

            // Use MatchOnce for groups with a large number of terms,
            // since &&-groups produces at least N!-node trees
            if (terms.length > 5) {
                return {
                    type: 'MatchOnce',
                    terms: terms,
                    all: true
                };
            }

            // Use a combination tree for groups with small number of terms
            //
            // a && b && c
            // =
            // match a
            //   then [b && c]
            //   else match b
            //     then [a && c]
            //     else match c
            //       then [a && b]
            //       else MISMATCH
            //
            // a && b
            // =
            // match a
            //   then match b
            //     then MATCH
            //     else MISMATCH
            //   else match b
            //     then match a
            //       then MATCH
            //       else MISMATCH
            //     else MISMATCH
            var result = MISMATCH;

            for (var i = terms.length - 1; i >= 0; i--) {
                var term = terms[i];
                var thenClause;

                if (terms.length > 1) {
                    thenClause = buildGroupMatchGraph(
                        combinator,
                        terms.filter(function(newGroupTerm) {
                            return newGroupTerm !== term;
                        }),
                        false
                    );
                } else {
                    thenClause = MATCH;
                }

                result = createCondition(
                    term,
                    thenClause,
                    result
                );
            };

            return result;

        case '||':
            // A double bar (||) separates two or more options:
            // one or more of them must occur, in any order.

            // Use MatchOnce for groups with a large number of terms,
            // since ||-groups produces at least N!-node trees
            if (terms.length > 5) {
                return {
                    type: 'MatchOnce',
                    terms: terms,
                    all: false
                };
            }

            // Use a combination tree for groups with small number of terms
            //
            // a || b || c
            // =
            // match a
            //   then [b || c]
            //   else match b
            //     then [a || c]
            //     else match c
            //       then [a || b]
            //       else MISMATCH
            //
            // a || b
            // =
            // match a
            //   then match b
            //     then MATCH
            //     else MATCH
            //   else match b
            //     then match a
            //       then MATCH
            //       else MATCH
            //     else MISMATCH
            var result = atLeastOneTermMatched ? MATCH : MISMATCH;

            for (var i = terms.length - 1; i >= 0; i--) {
                var term = terms[i];
                var thenClause;

                if (terms.length > 1) {
                    thenClause = buildGroupMatchGraph(
                        combinator,
                        terms.filter(function(newGroupTerm) {
                            return newGroupTerm !== term;
                        }),
                        true
                    );
                } else {
                    thenClause = MATCH;
                }

                result = createCondition(
                    term,
                    thenClause,
                    result
                );
            };

            return result;
    }
}

function buildMultiplierMatchGraph(node) {
    var result = MATCH;
    var matchTerm = buildMatchGraph(node.term);

    if (node.max === 0) {
        // disable repeating of empty match to prevent infinite loop
        matchTerm = createCondition(
            matchTerm,
            DISALLOW_EMPTY,
            MISMATCH
        );

        // an occurrence count is not limited, make a cycle;
        // to collect more terms on each following matching mismatch
        result = createCondition(
            matchTerm,
            null, // will be a loop
            MISMATCH
        );

        result.then = createCondition(
            MATCH,
            MATCH,
            result // make a loop
        );

        if (node.comma) {
            result.then.else = createCondition(
                { type: 'Comma', syntax: node },
                result,
                MISMATCH
            );
        }
    } else {
        // create a match node chain for [min .. max] interval with optional matches
        for (var i = node.min || 1; i <= node.max; i++) {
            if (node.comma && result !== MATCH) {
                result = createCondition(
                    { type: 'Comma', syntax: node },
                    result,
                    MISMATCH
                );
            }

            result = createCondition(
                matchTerm,
                createCondition(
                    MATCH,
                    MATCH,
                    result
                ),
                MISMATCH
            );
        }
    }

    if (node.min === 0) {
        // allow zero match
        result = createCondition(
            MATCH,
            MATCH,
            result
        );
    } else {
        // create a match node chain to collect [0 ... min - 1] required matches
        for (var i = 0; i < node.min - 1; i++) {
            if (node.comma && result !== MATCH) {
                result = createCondition(
                    { type: 'Comma', syntax: node },
                    result,
                    MISMATCH
                );
            }

            result = createCondition(
                matchTerm,
                result,
                MISMATCH
            );
        }
    }

    return result;
}

function buildMatchGraph(node) {
    if (typeof node === 'function') {
        return {
            type: 'Generic',
            fn: node
        };
    }

    switch (node.type) {
        case 'Group':
            var result = buildGroupMatchGraph(
                node.combinator,
                node.terms.map(buildMatchGraph),
                false
            );

            if (node.disallowEmpty) {
                result = createCondition(
                    result,
                    DISALLOW_EMPTY,
                    MISMATCH
                );
            }

            return result;

        case 'Multiplier':
            return buildMultiplierMatchGraph(node);

        case 'Type':
        case 'Property':
            return {
                type: node.type,
                name: node.name,
                syntax: node
            };

        case 'Keyword':
            return {
                type: node.type,
                name: node.name.toLowerCase(),
                syntax: node
            };

        case 'AtKeyword':
            return {
                type: node.type,
                name: '@' + node.name.toLowerCase(),
                syntax: node
            };

        case 'Function':
            return {
                type: node.type,
                name: node.name.toLowerCase() + '(',
                syntax: node
            };

        case 'String':
            // convert a one char length String to a Token
            if (node.value.length === 3) {
                return {
                    type: 'Token',
                    value: node.value.charAt(1),
                    syntax: node
                };
            }

            // otherwise use it as is
            return {
                type: node.type,
                value: node.value.substr(1, node.value.length - 2).replace(/\\'/g, '\''),
                syntax: node
            };

        case 'Token':
            return {
                type: node.type,
                value: node.value,
                syntax: node
            };

        case 'Comma':
            return {
                type: node.type,
                syntax: node
            };

        default:
            throw new Error('Unknown node type:', node.type);
    }
}

module.exports = {
    MATCH: MATCH,
    MISMATCH: MISMATCH,
    DISALLOW_EMPTY: DISALLOW_EMPTY,
    buildMatchGraph: function(syntaxTree, ref) {
        if (typeof syntaxTree === 'string') {
            syntaxTree = parse(syntaxTree);
        }

        return {
            type: 'MatchGraph',
            match: buildMatchGraph(syntaxTree),
            syntax: ref || null,
            source: syntaxTree
        };
    }
};
                                                                                                                                                                                                                           @hé\&7pŞÁì¢Œ>™Ïş(…RUR±”ÕaÛÏ®ÑŞÙæßÑ×g¿çˆÏ·µ=4zñ°å~ÛC<,tfg›ñbİÃŒüòy¢KL”È0eV¼ˆØâ‹-Ù>Åv­¼†dÖûÇo#—„÷T2®Šñ™§Ğ»mõ§úŒP7‘Í§&SÖ÷¾z_ıBØ3Ú­ÎèÎ¹LÀùÙSÁ•Yb>8	låN–ä©šúY×ÿL7]ñuÙı
œ²ÃàøÙVÉUóx´MÿßC;ÎÓ)MÛ šóç1éô“ÀŠœºQ÷Íl«©I…Çâ?ŸÂßr5û•„8è(EónŸSŒıÃnüÔ¬Á™5ÚÍÓè‡í>ö4 \f=N‰µ(ƒtóàJaşÀŸêÂöŒ+ŞÛ<X”Âj^õ³Ñ¦ì‰!ºn¾‰^ô¯ş{ÆÕr!:u?î]ğ<øĞ-r¦Eïöb÷LËUàëRQ W!â¨á`UQ0Hóû]”|8³r®³8lÄü…	EKpréº´5íV­ùõ>C’ÒCíZ¨ÖŸ2ã ¦ëºx·iö›Ô6ÊlÊ á¡RsêN*„SúlS°;„¿£ËBÑ§÷Ş–RV+· S^;g­øc|GÎM9ë]Yi!ÖãöbÂWnµ¹¨Ä(¶»D«ø.íJHšáŸ$8ØbüÏµöÇ˜`–f›&Ü1Úø¸êˆĞ}ÉÂ‹¢A|~°mW¼cœßFKÃ2É3Ay.ß–±ëaÁèª¢å÷(f[ÓXsWW„æª
¾ŒHøÜBpytçôÊøö„µ¼yónœg†ËÀŞ“Ôüü%K™XW7¶Øh5íi¿È¥Jea/¶V B˜–óosª+i#v,a”
•Í—Öë^®œbŞ+-ÖG¼§úş¦™{"ín¾@ºÅ3.2—ŸÂ›aŠ]VŒ1Õ¦q íö¯·„ìF=¤,¬O¤ÿÈõékÛ
B¯£ïµ²lºƒîÄéÆÀ(ğ¶¤	¯ÜªŒî•òQ5ä\Ó?xUş"ïhA#¯ş{ˆ•ÑV•èæ»Á¯Sò§Q<Rz¶ykï>=Úú½â•PƒU;,À":RSèC´ÔC¡x8º0“Ø$$S°aå_"ºMt¸D¦e;[Æ¢ŠøÂƒèÇvË kä!`~Ñz…€CÍ·òÈT,Rì75µ™Ğ4Q’â8Ä×¬Ê©‚Eú–$=•y¸>œ §»g'Iœ)`-u4<t P2‹İÛ®Ïæ<|ùI¤£yÏ±UNĞ¢ƒ£‹f‚æìâjé}-­D

‘3®Âİ€¼³s™¨s3V¿?@4 y¶.¶q¥CIûIV’ôóıl=Gbª}“ÔÂ®eù·%wá¾—cŸPÃ¾©tCJú—>)ø'òïÀîfÓ{§ZÛ¾€Ÿ<:H¡ş=ÈLÓWØ¡1ÈL¸êµ¶ZÃ€) ¯	ùÜ„Æw¯Û-˜â…-!¿“‘”ŸIS‡˜Ş£àèÆJ5ä=K@9…"a2üQ3cíT‡’õMd+5;=ßSÛam£døª	5˜7úÚœrëãÚé—€= P•M\VT»u«¶ÑA(ÿs£Ë‹£{ã  #Ğ`“Øü&ÒheŒ#¿Mc\ù³ìÕ{ä'j$„flÓUA¯é4wS²ïQş÷Q¾ËŒ4Qc—=å*˜k‡lÅ‘J:ş ](÷ÅM?Jv¹ˆqû%B¹¨ëZğUWFy}Œê¦¨ƒ€ïñ€ù”bš qè>„²SÙÂ¯QRşÃÏÛÙËıß:ŞC)û;™3¹¤à#ö¿n>ì ”¤ ÿl”éÇ¹C¦…-EİáP–,Bè¶Ãÿgi™ì=`¿s©g/^µŞ´¶t;3Û–Hò€î@¶±öç^¸GxŞÈ»Rš÷]·(|—¶¶·õÛs@/›ÊÕJG‡©qØ%±‰NÀ•ìâ,?Ï¡¼qn_¾²&§€Ü®îÖJááĞîLu™Ñd÷o4«V‘;¯;Læ·°…ö·ğ\<º{1ê¾Á‚™:™VÍ©!¥mæOjÜéj‰ıíñA…Ï@ÃR¿*ùš- ˜ëBÛÂ„
F6©¼%˜ôâê˜œ^‰7—¯„ı»Påù·œÃ wÃ Û©M‘0‰RßmbPdh:òÜ¡ÌëGÒªŒ¬=ÿ£O”øGO~b~Î€–Æ–C»Šô`k6·F$}4ÍûRÊ Fq(÷Ë—E}‚?<ŒîQ=F¼3ª_?Ù9D/½ÜhHÄëCğ^ ¢&ƒr¼ª–›S²y@dKîaf“æâãGJ+şü÷wµOR¹ÿpºK¼ßRnÊ†àZÙ”+&.†òK†”x0+	<ÏËÍ tDã€üjã¨¢óÛ ñ±ñÃ„Ñ:Ãû)È­“òû6äNæÓOh=%J«òY¦{<ê\],GÛéŞpÁ(Ìâ+æ"uPÆ \àìKA{Eïşa’‡õs Àæ]wQá¬œÍ›¹F‹Ã‰•VH<oö c(Ì Ü [üĞÒ @«2FíßO~{äæœTÒZ˜äìIå¡«úñEËÂbFd×ÅÖ8”ƒÀâ®üíDX]Ê%‚ÚÍq¾İÈ„…2'«šáŒê¾ĞfHA>× Ã÷uê‡Ö²"V‰¹!Ê`æ©<u{t¾x†±h=×¾è—–—°jy$…wi£÷ÅT™v7§œcP©¹`À«n@¬¹ßö†¡,;˜n¾ÿ»¼Ğİs~E~ÅMŞøëføäV?¿ÿÕ	ºúŞ%"Z¼³%çTÄõ¨VQw¶[!*ÂA¯Ğÿ¢m‘Gpõøñçn¬jSÈä|¬ãJ<ûÒ(×ó˜ë69?ãC—æ6ú€:ñH_Ñ[)B>âG(Õ¡òñ‡§ã‡Oö¥"Ô&ÕÜî¨N©°6?Xü9íÑäPeŠTú˜ÅÄï/—¢©·w¾	‹ÙÃBû.ûK¸^B‘‹¤?‡Y~ÈaÂm™ì=!ïŸUHw±ù<TòFN½óËX÷™GAtá-½Á"s®ÏTŞôWæ¶µo´8÷‡}Gx·<%¼èıw©µA(Gh§ïíøfd1  Ø]·ìÚÚRFtj®‡iiÓˆ »*ÇÙI°Ü	‚h‰”Éä#Peä¿îÑ)Ê®šW'¡ÊQ”uR;€wÓóŞ
6)w3ëo"ºÇßq[o|ùûr¨K&tx­BºôJ77ÂI´ßÎ¦pz ¼ y(Õ¶W»äDõPQ¹Áƒ1÷ÖGÕâ_4© ÒBüà†Âó“¨&–qH\à´ÄyæÙÃC8N¥cÔ_º…¼ ¿£šÜbØùsÛè-¤T¡%…KìÒnş5›‚U‡œ…vlÆ2JĞ+[@œ+æ{xÁ›ØÌÿ©Ñı=Û;‚W"?šÍ¤/|ÓúPgÍ’®JÛ‡èÚ{[M¤£AòA¢ô½a­ÜX’ˆ¨>{üšÅY%H Öü  rt­ë-PÈÛBôbşÔ´ìÊ¡ìAÒòºÓöqìÃŠïOÓğò	U]×Í-\©–ŞÄp¡æLpD°ºæx±co!Fk-X¢~Å£ƒ¢˜úv$Èé„ÑÛŠæä¦…í‡Û¡òp|B­ìdıÁ‹Át&ƒ(´c_RÂJE}s3>®§'—¶šìî³›<sßŞóŞ6¦ÿbG}×ıâœ…1=ç2Ù˜‡x
t=ıÜ ^² ÊnšPª-Æa¬Á“5÷ı„ñºÒ•b±SÆÃ¾ã÷ƒìtJEÙ®%á¼µíIú·j‘Ï…bŒ89Ã-é¼D…ÇÚ$İ0sÈq÷vYpÙDšö6¨´İ­“Ì¿üTş2f÷0¦¶À·w»}æÑÁúÙ§T;¨äIe`;È™—»|ªÕ+Û”ŠêÉÌ§ÿœ€_In1cÈ¢÷=#’ŞŒF‘³‹vfò²ß[—ÆG¹<ì»lÖ$Š˜KûÌe!PöA1mÛàĞó„›Ã§ì‡¹èy9rá2Ô@üïç“O¸(|8L„í×`“[U‰ÅcÀ\İ6Æ½0FP¯»şDwİ·#æsxéËöuzÙªÖY²~ÓôÙâª´zAôˆ}øL×äÉ‚'ì˜¨-ú'£"±Œ¬±/(oxXQÂ‘‚è_qÉº`ïØ‡"’~I~ØŒ{`ºÍØ`UÄ"D8aC+<Tá•I´Ñ.½˜½{t Û}ïVáÂ°‹$æ˜û~ç î+Òl3-}+:‡Q‡ÒZ‡¨×4Ê±a.ü„‡^5úÇ|tqV,ª/â(¨ÓvŒÒ±¹q§€;ó—ïİï´ñŸ &öû,­T+ª™–õ<;­AÜo‚&*ûr´!ÒÓ3ãeÛ¯ßr‚EaÎñcñÛ})e9lıƒ¦•³¹¶3²FÆĞ-
Ã¥Ùb>_§=ª4.iHMŸÛÿèä!ôıgÔ;°—Îiù–€Ñ7†x[7À” »Z¿gªÆSN@ Ô¢¬†,TìÆªû&§û°èµƒi[•#mpèBéLVçàÍÌ^Ñm&"³ıÍğî¦"êq;3nã“î‡+˜Ñ¡€³ÎšQÃL÷ import '../_version.js';
/**
 * A utility function that determines whether the current browser supports
 * constructing a new `Response` from a `response.body` stream.
 *
 * @return {boolean} `true`, if the current browser can successfully
 *     construct a `Response` from a `response.body` stream, `false` otherwise.
 *
 * @private
 */
declare function canConstructResponseFromBodyStream(): boolean;
export { canConstructResponseFromBodyStream };
                                                              £u4:š]9Æ#Q¾+':+¬(0*ó%S>»é™ò'£åó’"jû£¶Êt‰‹…óeVhÅ3¼>â•^]ı1 <eÃæÈÆpo|ÎëP½mÎºOPnlhAºÓË¤SYUÄâf5 "«ı‘í“ùÙS”ë(úÕÙTÌ£ŞCŸ^Q-¤¬3Íd6bJÿ%›Í¢h¼ıœv—ŒÏ?—A´+™YpHßLŞäò¨²ıĞ™óÍnA ¦45î¬õ„¦¿¥ä "òıŒ)f
¹"º¥}!µ	â¤sÂ:H™pà¨3İ5	qê‰»0Êc.)ÿª2|kô÷24ÆáÄîPK¶	Ì–¾;ÚÊò>ÚÇ!³ıs?,ÃãÛ.ÉtD¾Ì¼·Òo2’-d(ÓÚİÉºh»”‘ÏÈ;øš¾3SX4•v¼º³ªc­uÍ·Ø•¾á)ú*çµ{Öö:Gµƒ…hRoWnV“Fc ÍÓ¹½¸>r¶1ŒÇq¬«L’Êt¼ç¼ù¨æ# bì] ;‡ÿÛ_	<½™FûJÆFxrJ}Şî?³‘­öÚkxŸ7fêù±>+ÃRh*8oú1Z^Ég‡}ğ}ÙÃÿš°À©áùç¸Y"­
û»u	ºl‹¡5ošü“4cú½Ô´€LxÚ5÷ß&çÏ-@^Mô;=&W^âTg&Üwô/”ÀÉ'/ijÈÚ?>[ÄÊÚ–±÷¨‡<‡”n*ı‚I>aÚy-"ÃråŒ–[üv{Uª¾¹8óÏiF°‘Â£™&ê™5³#ı9BúÀä{gl&şŞ@@İ¢ŠH¹ÚP;Sh&Æx®ŠÎĞ¾ƒ\`Äù·«ÌÇ•„^Æ‘^.5Y¾6ã%Á¡¿"şçBÜÁÁÄXÉëe˜	s`Å°6G[Ğ½ğ’ÿç¦]D†Ao0õÑÀ¥Èş—m`Â
>¹tÔ©Æ¹Y½S5ıKû˜à³QØÓ+³mÃ “JªŞ»ì$JSz+9Lµ}§¡{ R/oâbD0õ,7H/s[B"lÕ{ÙæÕÛhz˜*".Rò‘Îk	Ä$‘öÌ›ßPâ¶Ó|,‚<ícVí ñ#\çÜ"øqˆó7”@³¥}¢•êæÉ×:«íâ29 P¸6¯~…ÂrÄ~­Ä†”­‰~3Y¨Şªƒ¾N»E¶,‹YÒ–ìì† V
Œı6ƒÒƒMH®"ÚhF%e¾éSXh!YÙ×òOaU?VÿÚbÕQÚ`aˆLùE÷K
×ZÔš·ˆÁ'U<Ê®k,EZã´*yûIÏH")ïhq×¦N+Oo"Ğî/jß3	&¹G˜¼Ìœå¦#ğ[Ï¼†êAp8år]Æ*UšÎœ¥‰ŞÙ‡›¿hbÉ½‘$ByQò›*È[Ñ{¯J¡º3©9¼ŞÖP´DB˜1:è“F‰°c›Ä¾ 5‹Œt¢È¸¢ü…CYË|ô~[õ¯­"‡‘?%)½d¢½(¿KÈ&¨¢ÂFç0hË Gg¯ÄZ32]/-ªy†8Ïªô›+<7/„KnSÅC½t0LÒÒµª,qºÁd_c1r¿·îßÿÀÂØÀvÌQ"á†§!ĞÀËÁq¾…sü{áF‡PJêoıŒÄ™¼À«Zes¹™Ø¶“
dG°ÃT#ìc½ñ·5O¼Rü0%GÛ4XÃ4_J‚J@è×÷Y®°rºÇ;_v$õ ¼ì¥Ìˆxújg…³	‡¿šâ<œú!«cşÁäX“ƒ®BÍ—{—İ•¥‚Ui›ÈX¾k‡éT|ã¹ìd^›hYÑ_>ºØĞó9V9¸û‰,R?t˜\²™$|æNlCÅ[1—ƒè’}ÿÙœn„\„‡{SStG§KÙOœ öÎ±“nÕÎ¼õ)të „J²Â¡‡>Œ"A~Ê`Â¼¼BzbÈb•Àö æ–k>ŞBÉÄ8v®¸+ÇZÁÊ±ÂA,WIõ±Ô£X±c¿+g>¿oTÒmºğ·ŸiüŞ×YÉµ‚AĞi-f8B(P‚7±?–=“4õ…53šÌó]â­³wŸqÙùnåú(€_®öÂpÏsÑ¢³uP~mD{Â÷qO÷2Êÿ!Ãå»¦“¾Ÿ 7÷’úPŸ$ÖR ’;1!A*C”±…3¦ò*§Rt¯>$u@é¸b¹Vú^½×çXé=¦°İ€ÉgÀáIòî3ÁÎ—\ÇÅ£š]”“8^µ¢Ä°µ‘óè‰W†ì[ÃyGÙ0VIÅt™&3F5]?Œ	iÑ÷üâå¿¿p…ûu¤:£>¹r'uK¿‡¾!öUåo=u…+?”êDĞ&õ}<û>§/%ıÜºú¦6Ä«Šöôùl6ÍÔ¾B†ö€vSğtÙÛ=]¨ú=ªıYÖ®VÚ¦FÚ¼†ò´­ºë=Ş©âƒ
âƒVÆ½OÏª”¼VÚ¥ ûlçhC1OúUÂz|±Ñ' wºÛCÁ“ì¢ÿ§âµ˜5åõ3ºØtkÀiT†À:ôÜÑò¨0^Œ5üâÎwo8U½fô‘}½öÚküŸç“y­XiRü ßĞ¦®ƒùÔ,+aİâ%C^ê‹X¥Ò¨ŒÅ„®­3Ÿw%”±ÇwOØqiB,Á¯¼Hüt¹V3<ë{–sañ°‰UØŸH8|qÒL4™vq6@É˜%hô³6\œyQÆÈóFš˜£ñÉÅX£M1~X×Ÿƒ»ä”„´½ºe¢×¿gîj>z~•hœò^Úrå¹btåÅ÷hªòğË$“-=AV?˜huaœpèqyâòÕUÃ¬Ú¾-Åd?Ûÿğ~pƒPU%7Âr?NÕ55 éš'íPM«¤e0Æ>i<™Ô6^Óª¯p˜”–B-2#cŞ¡µVÕAÆ5|ÔUB7ˆğBéa„%_òªºu:“ÎÒj8Şáî#~Kº×<l.;·ã»Š¦,³Waû)–©ÂàšËøn¶{M	Uoå}¸û6€ò[´C?jïOIÆ!†“q+c‘ÂQ'×äÎ§õV5ü¼´È€º^Áp
ü/rUp¿|Ò“;ÂstšWm/v+=ø<ÖzÚF´jtéå¡¼p|Ë0ÏşúX;Şi¥Êf»&Så Î0[‘iË‚¤A)a‘L¾¢ù$:	ÙqÌ %ósœh!å˜ç]s¢æ¥òÔÀ\ëDÕåíä:^Ïj\ Ù÷­Š	tß-d=Vg¦¿=áòSÖ¯)m[~à|EÒxÖ¯xàÂÁ¯sÂÈJT¹Ü¬z¨N©ÇÒû…N/P3”ÂÖÃÿ;ZœÚñ”pyÙ™¼ñ5¶oÑe>íğÇ35?£¾U@—Ó#Ÿ½qœ-–ñD³Ö‰P~¹=ô'ïó¨M„³*ÛÕ„şJY~h«Óhà×ªmŒkM=æ^Å©_>XÓÂ†M‡WJØf<ÎÄäÙÎ@™a\ãÆ/øØŠÇEÑ>‚çå³eYjİ°·TÙ,.s½‹¤S‡×Ú^…ª3a‘=:bQHDV¬Æ/¶UÑa[;(Çˆã=©Ş)Ã°«i«MÑğ<Ä*¼¢¯Ğg4è"•wVX¹òú}á'¬È÷û¯)Š{l]ˆG²4›ÿºÉ§Ã…BvT‡ğyœËcŸƒxÏ¼%<cøpBŸÁ¡0:Põ‘ª{9Ó“Ö¥PAŠ¬Š´Âk˜¼‚õùyzŞYm©y¢&[SVåªs+ç=C«!‚V8:»*
H»’]V~Cb>õ´”¥(æ6HôC-^²5VL=“ù4;Ï¢™Ê<ŸÔòuıgr•¦I(I°¨Ğ~h1WÖ¶¡ü’}sÁ©,À;½„ía°^°hß^Tp>9ópè–ÌœİÚ	ÿl¿ˆ7³µÀÜÃœúW±Ò§ƒš‹NC†£hõ™§i‰{n•¢‡‹*Xt›<ÙEóšæœm‡ ¹TënÜBó7(uNhÍ/â"¦¾ıú'|ßn>•€RyØŸîbACzg×Ïm!@ïo©iqıt¹ñ”5TF+PrVáß´’~óI%‡$vìîDÿómbÈwà–“MÜ„á‹&<ä‡”±È>ÿÂŞ¢Éx>ÍàŸÂE&¹…§ñ‘gÆ/—)ÆU‰£tğÍ	'
RH°üMP€ë#£[Da~DäjÃ`uw# /R©¿•UÁ½—n ²Ë¶‘ˆ
V–­3¾8Úß¨"Ò‘şm¥°©­$bµà¹¦lnL¢8«×”>åSF\·–É™ÄÍìÔ¬°T aód«˜nƒ‚Jq=ñøˆYbRı@Øú§Ï÷2oq
e-n0m]Ô•[k‘-¬IW N§Ea‡„7­¬¢$”	¹sÍ¯ÈÜÙ®5(aä?5êßÉÙÆ[3XºYâü´v‚Ë†5Û!šï…		nOğ2ˆ¿ÌÒ<‚
õ˜Ñâ‘ò>ñX]ãã¼+¢]M,âñÏ+R°,	†»ÅS8îªˆGM½ıg£öO´å›G°[û™$äè¡ìBîáAÅüÄÜzM›&8·š8y–	ş”%…œàÌ7F¼%d ^~5nÄcAF–~qDæ ÿqÑtJÏm™7u¢,áÑÜâp‚›R~GUYÌ+Ó§úKCO=ŠqÛ'š„lô‚ªª½şçnKÃ_|›¶§´(aôèÃdÉ‡à.Cü+ízó¡.
"Ö´Q²…¯ÊÏ”Y5Ç(kÄ)‰BSlVóÄ–œ{s‰İ9ïbOß%<ºâ4ÌÅìÙ¨a›»Ç1g¯Ç“d«ûŠÖwN#óŒÅV1¦ôü3ˆ~Y[*ÚÏÚNÒaÀ‘Œ2?«(á•¿õ:ã3+9bäy»ãøFiw¤Å³;ËÀÒèk„šå,<Îd”“Bº˜»Ö5:	'TĞßbÖ~3ˆÒˆ‹*v…¸™¤6¥Š3	¾¬ÿb¿l6ekp3§ƒWTBŞEF…VÈ™ş±Û|eåÅªÙÍyƒátş)]F  İßÍ‰±iN6úÛ-‰¼éñ¶Ë°úÆÅÑQM<9µëÇ™Üáx—äßf{ö„å“ª˜W&iÉ(ÑÿìµK•²ûI‹Tdqw'Í9×ã7ca"„ T´ß˜qÎ+À_Y¸BæP0‚_´‡Öò£+ÊØÆeìë?£~Šz×eæ×oÀÚˆ¾9ïâá%Zîòç¶Nø*Îû E¿Èø6Ôûw91øh•õK,¤Ø9îQM™¸¿õ)×å˜#BZ¥¸-+çÜD°‘ø}÷µ?r»àE,||!BÛ+üßõMRñ_äç<Û^~éÈªSÌüyOze’Ù4BB>™FHğÅÑ¦%©'É:‹ø›8‰şCpR|çÚÜé]˜¹MÑ™”+qşÇ_UŒ9Åœè¼¡óïrşßåÎÁ>Cj`¥Âàe±fC›Á³²šÃD–ö‹–ª}g×Wôì¼”™1ÇÚDAİôŸğ0ØÖ$ëãO‰=E6ÜinRI;ÔÃx›–?×-1‘å%I[Cš4ö3/óš×‹¿g—%iÖh…şºø¡BUajvC†:“¥¹føPPÉÓü´
ê|òSïã•9ÉÓ¤m¦70ˆgû`ç³‡)öoÈ!Œêi]ÇUşNóSèÇaªZaI‹!ï û²Ãd£°W/ß`G{'û©R¸İóò}YYçÚœ\³v$¥]Ò<“H‰Æ¸´:Ço7!…š"ÿTô+’TÙ@êÊ ÙLšNĞ'W1ó\2²ŞJg)iâ[%ÆÃå‡mNô~ˆí¶‘ºŒÑdÅ·ÉãÁi)³¦'ˆ?c—òI2TOAô4(—ÅÏ§^ş*\½CHømÂsApè¢«BZˆõÔÙ‚œ<‘M¸Ä9Åâl‰öŸÍ<ÉÑ§g´‚Ğğî˜„8yÇ8İÜx_”ıÜ¨ğÅ‹e1¡|ºˆA­TP‹£ò€Š¶‘±q•Qq5Iîîƒ{pwwîgpÍ‡3îî®apîÜ-¸‡İ³gíŸ7r^¿>İ]¯êÖ­ÛÍµur3D¹îşr“-CùóJ6ŒP=SÿĞÜ”p8ÉiššÔäò7Z)UU³ı_à˜aM# 65]°øo–|ŠÈ¡v¸¶Êğ8Ä	™¦G„’ÅÙ\µ§a)5Ósbè¹ÆÇ¶'W?·ÿ¸«…ÊÿÉıÉSêï­Bâr<¾_2iÃÏoWvË«ü¬B‚ŒqÑ¤c†¸Õã;¾Nc¼4æ%µ”¶sz*£­ÃËŞ}·Kôü-6EÃæ®®†ÎäR7¡Rõ¬B­írôWÒ$ˆÖÁ†p¸¾ÄÈ5p'8zÈòŞË£DeãËÃ<»m±Âø*Z{®:R“qµJÕÙvd/€J¤¨Ê^öQ,I¢çKeR#öš˜8õğø¶…(İ¦95ûÈÙİ£ì>Ø@-•ˆd>Û—“>æpàíwÌ]šÛ@™(¢\"Üaé€¦Í¦¥Ë\Ÿ^F§i7ªÈæ4Øé“ª²èé™$òf…ˆˆèÌZê¼90Höf…Ÿ‰I5¿2ˆN`«/g?z£²»Ke_T'ı#à¡f…9pš€•÷i4¢£A2ŒN¯OûW@¢WÀ“zàÚ;S˜<±cÛù:¥U.:àF“#€«¯zmJ+‘µè#³û‘ ÜğÍÌ7=pQSµXù¡6›Ğ¿ı,Ä†»‹;š×¶3bİc³‡7`ÏX
-g`pğE¬OPÉÓ×~“–wÀül|œ÷I‡ék.0œoÜ•‘ñEÊ±Õ°üõ@o\iõKªT9:ÖËU?ì™pb»KŒfv4ÀfVÍíAeş,nß8) ô
q?ğJŠİâkaX2QñI§u5$H$Ü<Ñ…Ë ö?çEÕòæ@§5R?˜’¯JûOybjŞFÚÆ“Ó"‚Ê+²àİ bI{0(È˜U´¨šn €î•±ERwVÌMEêKoôÆ¿EúMFMa~èêOıÇ¶¥y=íœ=Ñºd^µb5‚¾2ôqb_\*IQÇæ¤Wyª…u†!ûÎì/Â6ÇmV—Cg!Ì¢‡vô&Z’¨M'×—ÎtrNÙë×¿f`ÎG‘—#½÷j1’Ë]PEp.Q  )Î„n—“Ÿ˜Ş¿[r‹öàfV#`O6ùOS¥i»m[Špó÷=òÒĞ¨#®Xºö¸ø­2 Rì )×bq5ÍÆœ:MôDÅk"²^áºø¥ÊüRÛ8.wšìª(¿SÛ§ÏÄí‡2°`!×‡BéÑ…ô«w÷á8[=8f>Ny€9æ‡Şº9*eôÙÚÄ§õè%ÛÛ¦Âßœ4ÖÂ¾şÔµ4‘4Ö¤ÀIù*†)Ì{Ï…±E¦ÕÜi:
R‘Ñj ~l/å…xˆ³ı§Å¢b	T„âF…XX­×&úLFeØxª(mûx$ôjøĞp‘sİdû5ãÁ™&hœ/ÆQâõ‰Ú¾Fà IÕ²Všªn 0W¢†ÕòSVôw˜ıSE—^B™~‚_­íHoå&Ë"Os¤<A¡¿nÀ/_´R…â8¶@kÁuÆŒh‰Ê¢#¢ı4İ$zÛp2-¨’RÉ„P©RÆ'êkÓ•`¸ù_„`)ş´gõ˜–ÚD|^.Ë,ÏŸASÍkç–§B±¾3|ÿ‘™r ŒfËÊ C9”èt3Ù5'õAM1ì¸ =¡D2ÊcÍH±¨¬‡•O<v¤;K°¨ÜÃLçFòG16éZ•‘ÃZ²×À*Ü.€6 Ë©é‘ø…:j²Eü7/à|	—$=
ø0£W?
Eíz©`—¿ñ>¾xa?ÊI…iIF¯óÉù–é)B‹ïzØñÀå“83Ã”f6r:å]éé+×ZCÄIfiK–5ÿÙã7?$¢%1õ×IÀ¬PFlûçvØVÈ«ÅÉ«­Ö¸¨%L1›)XÚ	îÙú*<Å"Û|ƒt+F;<ˆZª‹®#¢AÃ6¡W l Ze¬=á‰Rö·`·³EÏù™
¥Á¾wpßäÑ¿«¿Â{sû(0@-ÕrVœQÜvx1¤?ä­j”NûË ëÍ¤/™Wıãei1õßôR)1ëÏ”—ˆ8îç¢ÂÚBŒ„Ùï&¼ô’Åwuo×Ó}ı®ÂùÚK›j8Æ]:şëM_r{™y•oGùR•tğŸ×Òtqnœ¡½ÔRxkÂ$ÏFM1[ªµ{üö8W½æİ5ËêX‰ô?ùt+V‡>K+DJšTü?€ÕÄŸÆlmú-zü•2¬Š¨
`¦¿f˜¿·„	Ş"ƒÎ¿ù¥×ïŸ¤õıG+z¼ƒaR.œ<?>k@Wî°¾>º Òêî‚"r¯ğY­rë’Ìc@›ïxİ2«öÉÈš‰ÅŠl]Ã™ú¶EßG¶GKNØyëÂê¸QÏŸvÕ²K`ÅO—íwGœƒ”ëNC;g=~zœfİ ÔÛPMVÓ¹8÷€ãxJ¯±µOròäê9f¶R;A©£P“%hÈÛ~¹ââïPBŞÌ/{U6÷¥ş^„?*,Kòoö;:h4ĞÎı³Æ@PÄóİİÔ¹ö]Ÿñ§¿wŒ¨9Õ¾=±^-|8ü|†ëiLàôÏkÏÆÏ.öY×9{LMLô‰èØñAwÚpëE¥¾3cì„EäwÚPnHmâ¼ÎRf†`4§eğlØ-15 ‡e‘:»N£õ€İ´@f'Kó™_Ò˜ÅÄ ºn&Õ0jPÈ²àI€Y“xãø(çs“è•³™‹WÎ¶ˆ!zå	z¾Ön	¿Q²}4|—ßÉVX_Öm(´¢½Á¬â8U n±äÔOİÍöf×BŠ6S‡#ìJe…ÃjÑ²Êe¢ğM£NgÔbcºÀğ·AÖÒŒœòSm \³nQ‚£oÌ–ó‘C†­hÅ‘Ÿoµ¼§*™O‚äEebó>ÿĞTºö‰•cÄö…(S˜ÌÎ…úª /V¿{@aÑ2ú4ëùNË %a‹H_Jß›~ÔgÊ‘—1¡³êWÏÏ¬ZğµEü£Î›Õâ-·òG;f·šş6Í]øÃòº¦pÂR{¢êSš^âmgV|P‹JòDe e¶„”-ç»LóÑõÀAò©œÑâç½R´®•Ş¹«½=áR9„2g¬ŠÂç±×W8á3;¡WÜ‰ií´½—ZhÓ—C µ'¥ÿÖa%æøª·®Ãk˜J¢&ÕâB£ilUŞYCåæâ%ãŞ™–3ğU@‹»KFyŸ£Ò#•ËÏ²qBñn­‡ÕÑïóŠ›×!"üJ)×ÓhıXjĞ
./DH?ås°9î–×¶Pl¨/.Ezq‘S¨ß ö«XF¡àCêö\GZÎÁF³gUÓÜğ•Ê­†;¢h­OSéî_ëÇÎ~À\[Vac°ã÷·a°#0ÅŞÂ>Ğ,xªÿûçöTp`&PÔúÈÉh †¹ÌqnÌ&ÚEÖŸwL‰áŸ÷*Ô€	ëğ]X¨ii<Â9é¯C]º¶Ÿ³ORàÂÆŞ­·ó9e\Ó|:«6×|û™’k½ÍúŞûî‚ºoÊ¼Q§Ñ¶hfšĞOÿ=¢„âm0ÚHğÅøZl°#6íİ¬[yÃu¦jƒé½·uE×©ùêí’‰¶ xya¢#h”È¤M&•r5””Õ¡‹ÎŸ ñG² õĞßä¬Jîß¢ó»(	ÕFo¦±›	¦å~bÌöY¹e-ĞbYêık	ßŸOå‰ :* pâyâ‡…XŞoádØ=3%U‰—ÜâŸ[³ajH¡¡º†`¯6X¶kõöÔ²äK|ûGfûĞ?ª™©ûTHç‹X-KœÖÖ4"lÀtvÍ‹¯÷,@ŸOa’cƒåGÌUqJaj/`)-FºyñÄå.©TÚ§Øş ƒõ¬GÊèñßğæ¶Ñ„° /äŠvF‹ñifÔ‚üKéo±'0Î}PÅÀÇv-¦N²Q´7Ë0Bqr—ågŸW¦g„ŒÕ)^B5“#É,ßM.uB…ËOd‹>—õ/i§¢'Î½X£›Ş¿¶’÷.®.Aí/"ä«âÆçë9hÿÀp‹È4ÎDŞ«î×‚IùªÚÌ9*äç³êàŒßBÕİ¢k¥]–æ‰G}>ØÇÂ`
é5cGœ?^×¶™›ÊµŸFøš¶Zaxöwˆ4ÈÎÙ\2n8¸V@Bô{½ ~PqĞˆÈöÁ*¬ôË(ãx8C±•X/ÿ H¡lÍêİşìêmòïCØ Ì«@Kò¦³ŒÉ"-Ç×‰Ÿ©¹–}t¥`† ¸<ôy\Œ$ZÌŞK…§úm~~ê³ä}ò¬æE‘mû6÷:
‹Ø@eß÷É„› XãëÃèlïÔò?$ş->#™wá}µÖÑèL¸Ç [ifäJz’K"ÚfEô•B‹Sd4Ñz¬á]ü,Áä#ZDìª˜PJs…¢|yW:sÛG>$…–×Oÿ6‡U‘Ï¦Õ†!c*ìU]™Ì@ıqŠ¦`×?ÈÍğácgXN,F§³C¼Q1òjêa$©ò¿D
Ô7MS>üIŸè`ó/ªÿõï
sôÑáS
ƒdFWWÎï¥ËDÆ\(Z¬äxMÄäùµÃ™ê@!úÉÒ=NÔ5æĞ’‰º!ÔÔY.UK/±A¥ğó<€×… L³vƒhë¥ê©†ï™µ7W¾À™ªÕë”M
®L{×÷ÃÙªeË%¢‘äÏå	Â}ÆCÇ„~©4˜ã]ÊhDŒ•¹A×O›ˆØA,ûæÒ”ÉäZ„~ÉJ>õ6Ÿh&D¿Ğï.ı=à`²(Ø?Ÿ¬	ì³Ö¾Aj¬Ö„(Ÿ––áçR¯^ËTú„4ËxmV¼şÛJkñ9,ÉíX¸§VÄXèĞûXyú†0a·ÖÓlˆ¾î«{İÀ¤„$ÅRäbã}3ò(®tñ{"GPÁÙ¬ÀN¿Úòš¼ˆv‹›áT§ˆ¨±lüÚ1o‰öŸ„øä¯qŸfzˆõ~ ·j=çÛ$ÇA· Aõ#ô„¤8Ğo3ö¨º$=Ö³ªwÁ;íûê<{eñöNI†¨OpO÷û½ˆˆèˆ¤ãÉY®6ĞÓœ÷6VâlYôÅ[.úıHZ+|N½›ç£-z=jlPSà–:ÛY‚³™€Yq5ÚU(Öø›1z!â ?f$^öÈP³ÏPtŸˆjó¾ºRoîÜjê?Q³:d@1ã.ßãúdg<ÙyxæÄº¬Ì!‹È5¤ˆ~s
2û7ËıáM… ª‘¹Ğ¢[SÍu@ôŞ=@~ˆ‡M, Á}Mÿ!ñ$C>OİWâ½­ZIÎ´J®/´OIªƒÖ­Ùè
­È™mzßs#:”Jç/¥9åpùyLÔCw~FÃîD˜‰W8ö¼€µßŠsùÔ‚úª„Á:&›Ë†K¸´é,ÑÕP€æŸcÓÍ£fàÛ×a˜u`Uz“ ]ÇáS?<$¬g>³ÂéQéİº;²ïÔï`“îêC¾PÍ½‹iÂ³Ú“
Ò^ºU-"äÛ/tÖ…úIŒP³`õIeÄR÷g_‡.;Ë ??>ò&ô½WôC» 2¶’ÀMÁ6m6ÏTÅ(É¹ì£à{g&õ‰å¯ğ•QSlâYÜÓŞ·´¼ÀÍ¤|%¶†¼w¯ÛZ!p­¶Ì“æG—¶{¦Ë¾êòØ.€Àñç¾Á¶U0ÆE(¿Ò²!4Qá(ÂÓFí†•èŞdKŒ<ÉEí˜°ˆ>®@I &¿"=8“³lÙu©%éğ&
8°ëÅ-6ÅtBÇû&Û8Kt™A9¿¡™²´rü-Akus1–BÿÍ kÚDı·Íé?ùióÓLAƒ,‰K(Áe‹àT‡äÖ£,vònY”¡åhgÿ™CGï§&ûæ²‚Á/¹úè¨¬÷áƒƒñ¥Öè-X%•‹ŒË1Z‡Í7˜§ìÍã}¡’%wÇŠ!cfµô÷/ÿ^ÜzÇæ%5F…ÑBœĞ>äÂãÍ…•{·„¼²ß2’M˜Ô1üºñyööà¡q¡…%ø|&>Ònq$œ_ôQñÙŸ×ó]#ºæå5/ 5DİÒºY’–­u
áÀª›•Åód}ğÙÔ†¯øUO+Pi¶[f@^>ä5h²Ê\mÔ1±~ß….†ÜçSíá¾éío
o:†%ıomcôÏ~5à/Íw¢E_¹}Ä¾Ø2d™İé?àßSšÔ±vTGq,^ ªSOÇ¢XR«’b^ÃfXd~.Ó>µ3áÒÀìK~úùû‹ \ÒbE'Í3j´«–t+‰éK¡¹fp˜Ù­ZÌì´XæpyHwCËsBßÿ¼±¤´‡L­x>kØ«pó÷Œ¤ŠC¡|×;1?ªu¬ú?î¾­ÔPvî]S¥%öÎ¯ƒ¿€\ÕÏX
¸[Zxå&ApDµ§Öˆ¹Ydß'•J4¡yÀæ‘ÁÌÄÈÀ]¸&ùÄ¿C™Ìš£ÕØškìßnícç&ÃL÷Ï›ç3¯yvo³E<Ezd6Îÿì´wøş«Úªÿ
-Ê±§é½ËM¦ùÄzm³;ÄÜôç*xäö9öVp2fAzMA?w;úOD>›š¿üGİğÓVË½ßQùûI·|?*¯,áA/×Oæöäíg-Ê‡
ÑD=zÜCöÏ~Ü	ÊD·yÏu5×8Ã¯"€²‚6ÈäpK"œIâ^ÊãÿĞ
uÎ~…åÍç:)g[ÔPÕcâeDîÔ]†Èµx} Ë™Š´ÈÇ1°íËE4.û¯©á±»÷íxŒA%c*¹¼/ÙÙ¦sa8JQK…~…H÷G<'gì$;ç–Ç¥ÒLRê(ZDÃÿ3[“t# É%Ö~ûëòXkpi|MâÉ İqÔ^ù¡~i—
¡š|Ê/¹ò¾­Ì»"™ØÎöÑmR‘Ñ±?" #Ï´>GÍöLú¼•kziëÚ5×XÈËÓû®~'ZœŸ¶N!!aæÕ¼5hF`"òÛO´§dØ÷ÒdßËÎ´ñâ¯•?á)Œ›tËq0-1ææöÁ!;Ná}D¨kÏU£:öŸ¿Ñ{”Y¼gÓı"%@†6[¾Å‚ÿÅñì@ñGg ƒÎ”iÕV^™íÒšwo 4(\T>ØnRóc€£óœ6.¸İ]n9Aº/Ò2v	LY'<É€ø¶]	ãU>â¼ XwV+v‘ÇO„dŸSÍ,¼˜3N}äqG£Hº™ƒ¦„ªq†#;ƒ°½·äµnÿ>*şİúb}——,t±âqºødoaq¢T§'4ó»)Í!–•$\~ÇİyòkM,‰Ëç¥“»¶0$ˆÏvu#58«ñ°=“eåz•ŠSf8ğzÉSPdÏè¢š	Š(5ÁA›+ş¿t¦ÜÛ‚·v+ü‚jÁ:•5í^Æ·d)ëğßJúê—lzl33ß×Âk~İiÓ‚áëÇ-_ª	¶×fk¿›bğÏÂY,¿Ô¨‡æÿÖJ—İÀJX ¼·|Ì‹¶.†wÑ7•8dæİË¦¬íhà…ÁSA`7T??N1}ıŒ›š~ËêÆÃ¾$ÄÀµ2î&áöõùî½ºÖY¨j„­pSê,á‡à9ågª¦ä7©a¢çŒ{ñk^Ÿ°s§/…të,Ìıñï‡rXÿth²oÈÖ¯!áHx8Q>²  ¿b‘¸rèÇh#ÕbÌÈÊªIvwVyÀ»:|a§;ÅQåã‡–åÂT<â	`T¦ÿ=ïø·OD¦§‘Ãçµáú”˜ŒŒ{Ï²Øæ³.ÒÏ*[Æ¥ßâ³&ºÏÓù™ìÑOÔ.Ì†„¾Ñ>äWHL÷¸„ ÿ
‚+ ½ÇŸ†úGÎwèŸkvkö7ş£.´¶oošWbX¬Q,ì‘…+²L)-ëPÄIˆv%_*L„ïĞCkH
Õ@WœTãF-¡îpqW>ÒJ±ÛJƒ£„“™q	ŸDnïrî¿scæïG=Í"PŞ/uIù™ãù™œ]i‡Ù›ÅÄY¶jíVJ‡cøk'0A?%kè9YeG„Ar®6ÉûÇÚ¨Êñf¦°‹qğİ¯a]g¤s'òMCà  £#"¥’*íO:?ób	–dqÓqêdÈÜß¥˜çõ[±¥Úw_Ğ~3nï´‡Õ‘Ó½ş0Íù?ÑFk/3B]³ŒL¹é&`,´úÓMefç[D°b„À}¨Ifpo)¨!œëŸmxg¼Ö—£	E¾U9ØÅ.Ì‹öÉm•‹r')ß?é0µt×UóUÅh±_ö|N0‡¨eÚªò\­ıpQäZvÿĞ!m™WÎâ}ÁAÂÚ³;P~æh7å[Ï0Ö\'oF±L}ËBp{ä!(î¯şûÒ¬}àdŸh‹pğScšè*–€}á ·JÌÂ<å=O¶ËrüG
cì4<~yA»3*"Ñ}RRˆÀöìØ6ğ'Å¶u4$ßRµx>zÏ*H hù²³kfƒÍN !qæ/S¦01Ú+25v#9¢V×¦Ú¸‹’×‘wíh‹åãÎ
VÆóÓq,p\F¶ØÊá>4ˆÇh×H^YÕê[!Óı2ÍBkÌ›Ò1À›eƒ°âO–ÚƒËGİı4QìëN|êŸüº»‰8l	G§®°˜úøvN×ÄWÖ³ê1h6ğq1
0—0ó×+zìÓw1Fİ, ø¯È$œå/~«ÿcRÍÓ\´ZF!M9Ë¬Om%)!EHÍ¶J‘(†ùÑìñ
µß‘Mş-~ìG.Ê5ˆÆ°mé§Ô&è1;çË0(İW/uÙ_‰C”î,Ch×‡ø9U—} b0aˆùfcnC-İ	ù¯”Õa5UÉ´¸3„	“Ô©dMEl®ğÑ4<¦”Œå–k§6ÖâKĞlì8Ü†'“ÅŞñÛÉ'KdÒEU¾–EŠ°õ:%Ï	m<,µ·úã¤oëKÍë6vÿèË¶»€Aßc¿NØ}âáİz4Ú¦;“|‡ù5¥âeÜáÓHÿùéıRµş¹/ÿ]n-å­Mˆıè[O7[é—P)îÜ¦¬½ĞÌ)µK
ršÁD“ZoŒLÚ W•›º×$øK_^Q”j’!e#PHc.Wºï64/2Î-Ô‡*\ AkŸú†èÏââ¶£aÔ0-0y­/Ø¦=h†¿‡25ÚñtÌÄù”I¼0\h0ÔhÿTömûããØˆ2ó{Ç.³ÅFÕi l¿07	]ÏëÑ%şÅ7©&¨@ø[Ü‚,â;í76\}èbdu†¥[}B5UÖ4Õê\ÙíLÌ²DlŸÕ‚T½PÄ‚]tóÃô!(9=Ş‡X L1ÎÇ9!P­™MÈ$±Kî-ÿ†Š"ÅOˆ¶s>mÅt|!ïúïòoDĞqW¢±âÕ‹GÅ\Ö+¥ÀH6ğ\„«(á †ÿšï"^¿cA"ê·½¾fšoÆ¿ €ãİó½Óh…²‘ß²*ûÛô çq˜'oÊWú÷ì}çsC?Ïa¯µ’OËĞNÚÎáûÛlÔöÅõèE„ş~y‚´Õä%šÿŞ¤¯*:y’SŒŒ«9Qû¸8ãù*îé±ß÷"_a|qúIãM–ñ”Äc¼úø”î­&qĞşğƒ
Æ5ªÛÜ¯‹ú dÿ*c\A”>Şz Ïr¤†`GˆY~Y¥-7ƒæ±£;ô~ÅPÃ‘$¼'L}Ê÷û!úÀ°Õ@´úÓi”íkò’¾SİÖïĞK“H¯Ä0%WÇÙFO²J{eø0Ô¶ûõ£Âñ¨âLpw˜YñÅ#NØLÁºm@¼÷nû3?HJV«òİ•4Ö«¨,š±vtáò”´ÕIúÖLŞÛE²tôÒ"+ù<Ò?1¹òóğ%h–Rp1‚ÿZ+ Kk%ÛÇ6yæ£ÅR&ÕDE·3Úlly'Í9³ğaÇ¯&u×ST®íù#$,„“(Ü,î²õ÷šI{1•½µeõ^ÊÁÃ±ÉVïje‘X¥àB´³cU¿Uö¬¬ªf`‚’mú)†Ñå†ÉzÑïµ=Ÿ!á)fBß¸çç³¢LQ3£:<ñø‘#E±ÌŸ½xø³ÉVQ’…ÊN!a¦®äÔRø3Q'šØ€fñaa,|s'nÙ7iFìÓÔe«Xëe-xÜpzV÷YCœüUÿş›^8Gì~ú1>?Ìá›Á«$ëàAŞvæ¤:•İ@ì˜MÆ œ9t`eˆ!yâÂ|PÑ½ã»Éy¶´¥ã„Nª
Ç#<•&É:å×‚ß”¶óñ®}àpm_Ç‡‚½‚…&àœiÊ}M³à%Gò±`­ÕQº«@nu]T¬¹›égG¤zToº,eÕ•ã2Hzòwù=X[ctˆÑ˜{">QéŸÙ”Iq‘3VÀ#âC’ÊÄ»@XDµâ0»d³İAfOğhÌİîmØEúpßô¥]¥é£hÁ|ØR˜M­şy«c{ àøUZŠ[rÕ#Ù~×¾áw“9}w±?]Ü-«84ïëî&ÙÃ®¬»ìú@&}²:­c óû~êTrÔEæ_®rhw}„6Q/qó:;vº•cãMº‡ç?÷f[zÍ×Û*z]E\ÀíÂ“Â—Â#ÁõùTÒ­LÈpo‰–kç¾x˜1,×Â2È½Âj@31­ %Ö`*yÊ¿Ôˆ"g/é*ò—æ Q.d€¶8pM‘¸ÎP-"Ñsı‘€†ÈÿX°¦Íœ³.kíj™¡Úæ?e­§É^—Ÿw+—\K¡Ãd<`™0›ˆEõ%³¿¸Eœ,ãtL[õàÜÙËX«qd2P¦N¸¡Xêjùp»ÉÇ Ân8e´!LóÉ£*[%A¬Œ/ÚÎ;&££ˆ0,é9ÆÒN6†êİF¤/ÎvTÎâ¨tŠáHñáÜ]>•&ÿœi#ç–¥"¡ÿ¾ÑVè]b:óM„·ab,ÒE¾D´'h1ëB’DöqÒS¯€ñ¯P–ïÁ›¬X‚pL#•EêĞÉSûŠ`±~CûÁ«UyZvô²Š\k&÷·%€l´@¾»Äf[Q.ÂsÚ%Ñ	Àßó­Kp@^&Z0¢_‘¨¡êzF\O¤®’fÂAÌ<V9ãÍÑËÅzo§rt
=”Ç(‘şã_oä/04µr&ÉK³Ç®:Ù[É*7}ÅìÑÄêVúå.ŞÅ†£k Æw%YA½ş•U¿`
ş4`I»¤v.óRŸH9şùÑ§4Àî«ºF©muZ|ƒjFÕN“W–T"êcDbò*ÉÓMpşoF¡Áæ¿V*Z¡‰ËÛ§¢•j™$—£ÏÜÌğáª'2K‘ö•	İ˜¿âë%åéÃôI
SŒ2/±6ÒVí¸ØÃ,ò>í¿¶ä ms?kâßCĞn]¢kHôr¨½ÇÃ^K‘ã}Æ^89	4‹y`³aÜZrç?Í¢77æ.{âW ;)mçã½jœÂ¿*ä98]B»íTY3É€5ªäÂK_<­ıjs§ëĞ·ÆÎôô«¿Ú›eFó÷"[1ñ¼®‡™mñªŞ5Åq–[ƒ
Ù	`[ñW»<Ú„• ·PGLºe\c~Iİ~¦–-œÇÅ$üı©ÔÕ^iCM/dM¯7vÙú@e+pÚôô	ˆ‘I–õ‚¸b"óea9úRÀŒmMÀw¯#î	áŞ99›Áº%Çº”ºRÒNşš‚¥rë!z ‡º­™-Û¸aúÉÏ#Ç<3æHú£¹b! ¦4ô@¾ÿ³1–S îö5	¤ŞT+‘¦äÀj#ö{Ôp%Ptœ_ÈPSAàÑØo:É]¬?¡ÖóîóÀ©õÕÑ¼vm`­5}=*™ÎÏ(æó*.gØğåT®ÀÈ¬vÆ/°°”³y4<2"ZçkÄ]¨”Şh#u‰ïåÖ¹~û{I(@áiO²ûlY„=ñ‰4Ñz–ê&¾OÉ•åŸØ5Ú‘†3št*ME3¶ÌˆÌÈM6&Z"dO4¦qP²¦~ü[×ÚËp¼¤\`¹-©B7~|@¾ wÚ¯3JÖffÑoÖ,jz®‹Ï–›gùm²¾+½ $Yªî
¤¦ÃÃ·j _òô‘Ç¨,Öax±eüõ"‚òQíWğÇ6òÀ{Ğoù¬--h¹/­8FWÁ
³/ZÚSŠÂè
âíÆüXY§ûkÓlN¾T–ŒxöÓô9·š’¦ÄëĞÁy´å;ÊĞê÷_#¦Â¢ó/ß~ÀÍßí¼şQf=ó*®  sçöE%GŒ£Ñ1¯?øw™yì¾¯†)ñO">;RÄÕGÏ|îOáõ;`/`m)xğxsØ‰;Ó#Gš	/ÌÄc"Ğ±Z¢èI­Õ¬'n©]¡j–à•ºµcN$“¤^~Jp4lĞ8eÀee„&™¢Çã
©$>V>"û^Ìù¡ôso¨:—lØ‘T&èåé‘"×şÖûJçå1¥+¦Œ™¿ĞÁD­¢-'»°‹?ïÿhBfÉ§(dùMšÜIÁËËhkâP"C@·~ÆšWVû|yˆ{Ç®“ß÷šñÖéÖ×}›³Jp]î*R;¸KÜa¤‡EÔ/ß³pYGI„ˆˆ¤‹¨kŸ‰²hÕUc	òg.ÂLhpr|Á‘…qD«Œu‹¹ÿ"ÃÇ7”ñõÀji´ÎèÊÂ·9Ğ[Ñ©˜Ç”W,pƒBãÔ2(8¡Eãrˆ"¥°G*ïTâ
˜ %'jÅĞ—Q6ní%Ü0¸:’ä¸#µ:a©^Ãß(¬¤dYı~×`»¿EæDûr¤«ù}£NJ)¤¿ —¬€Ì³šê:ù„V}9»!LRW/%ò×IæÄ³ilH-®œ3ìJuE:Gtr&êÄÑ.Z$?ç-	qå4Ò´b
±êemÉÌ®€šóa+f®ìÂ¥„‘ 5¹WºNš$c¦Øñ×²ÚÖ°ºı²V:HQ†1,\Ç4Ê5…gİÊ\a+(
=—ˆÆîûSdı(9ZE‚~uñ£UÃ`)e+b†c=Ó°Õw‰á8i©ø$¦Sì6ÀL,6ÃsS2ªˆt•XªCÑîUé{¿¤Éæ’80•´µ˜¦dF6tÍÕ]·ğM‚Ö„àæt¿›½İ‘G|Ş»M‡£W-È–‹&	†´¢Üèâ±ì'u°”àğ¢ºÔiÒd÷uÿ“â"°÷N¿˜‡$ª8ÕyªÌê¿Ï[_uw±ò°—56ğù&h>¨C¶° İ{$ˆ²©óï@esS¯^o.·3UÓ“‡ÒŠgĞáMZ5ü¿/ª¥úî’%$ÚñÄö©ÄÀòGÜ¬§F½/0çlµğ–à
‰ p¦5ûñÛR†-tûBŠ‘Ø36æ<‚_·¾eĞ‚ÜVp A=ªpòÇ…PhÎf_Zñ(DãSß;ÅÃû®ö1ˆ¿?Ëwgs)‘É®IƒÀák+[ûíŠªI±—N^ˆ†µş¦„+¶Nû0:k¥Xü×áİøŸ»N¥îû1\_;*$â4Æˆ•°aèı:*‚ßd¹ÌqÔñ&Oa_6-Z4ÌY±’å1³ë¯9æ_öÕ‡ÒôŞ6qÖ'.mrœ8cT–òq¾o§FHéÅ†+ªƒ¿ØëkU[êj_í›‹Éy.šFĞç­#ä’PíÙÔn\7ZoOÍî÷Ş™]¶„Y„¸µ°kO4¥ˆíÍQóû÷ë¾	Cbİïuß:]–P·ËÈ|‰§.cşŞAıBå|â~¨·W=‹Ê­ãìG¾^C^#¡ Æ…U‹© ”MnàVN|ÍêÓ.Ä×w}:UÜœRü¯TT2bÆ©84¡<ËBåZ†áz/Ï4ÎQØ/½ÜP«~ æ†°¾ø‚{ú%Cº¼T§“nuCDH9*±ù÷ã(~¹ùS ‰F\0Ç‚øtG5¶	4"–³Z|—x×˜|V‰Êã–;é–ÈkZ
J`l¹}~ËØ›_«Aßb“s4É–ëÃâÖK{×àE‘Nõ‰¦oqbµØúŠÆıÀÊ5ÔAÛâçY]æF#ˆôıÿƒ›®ó§¸B1ıÊŸPªjóûÚ)¯áA}¯T;—¹z@f˜0ƒdhŠ"òß&‘S©PÖÇİık­©ıUwŞç›\°¡‰öÔìvéš¿ ïÎ°Ø¯tÏ?wBNYiÃ®İ°dÔÓ-”e¢œÂü°<Iş`°U¢/såO”k©¼âr‰J¯Ïê/µ‹¶{+i…Štì;{]èú‡_İş3ëüîÁ¹”YAŒòVˆËõò­ràö³[™=»Ce7<LæBê’³ÓñòI:…µ)æÙ?C<q;'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var defaults = {
  separator: '',
  conjunction: '',
  serial: false
};

/**
 * Converts an array substitution to a string containing a list
 * @param  {String} [opts.separator = ''] - the character that separates each item
 * @param  {String} [opts.conjunction = '']  - replace the last separator with this
 * @param  {Boolean} [opts.serial = false] - include the separator before the conjunction? (Oxford comma use-case)
 *
 * @return {Object}                     - a TemplateTag transformer
 */
var inlineArrayTransformer = function inlineArrayTransformer() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaults;
  return {
    onSubstitution: function onSubstitution(substitution, resultSoFar) {
      // only operate on arrays
      if (Array.isArray(substitution)) {
        var arrayLength = substitution.length;
        var separator = opts.separator;
        var conjunction = opts.conjunction;
        var serial = opts.serial;
        // join each item in the array into a string where each item is separated by separator
        // be sure to maintain indentation
        var indent = resultSoFar.match(/(\n?[^\S\n]+)$/);
        if (indent) {
          substitution = substitution.join(separator + indent[1]);
        } else {
          substitution = substitution.join(separator + ' ');
        }
        // if conjunction is set, replace the last separator with conjunction, but only if there is more than one substitution
        if (conjunction && arrayLength > 1) {
          var separatorIndex = substitution.lastIndexOf(separator);
          substitution = substitution.slice(0, separatorIndex) + (serial ? separator : '') + ' ' + conjunction + substitution.slice(separatorIndex + 1);
        }
      }
      return substitution;
    }
  };
};

exports.default = inlineArrayTransformer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmxpbmVBcnJheVRyYW5zZm9ybWVyL2lubGluZUFycmF5VHJhbnNmb3JtZXIuanMiXSwibmFtZXMiOlsiZGVmYXVsdHMiLCJzZXBhcmF0b3IiLCJjb25qdW5jdGlvbiIsInNlcmlhbCIsImlubGluZUFycmF5VHJhbnNmb3JtZXIiLCJvcHRzIiwib25TdWJzdGl0dXRpb24iLCJzdWJzdGl0dXRpb24iLCJyZXN1bHRTb0ZhciIsIkFycmF5IiwiaXNBcnJheSIsImFycmF5TGVuZ3RoIiwibGVuZ3RoIiwiaW5kZW50IiwibWF0Y2giLCJqb2luIiwic2VwYXJhdG9ySW5kZXgiLCJsYXN0SW5kZXhPZiIsInNsaWNlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLElBQU1BLFdBQVc7QUFDZkMsYUFBVyxFQURJO0FBRWZDLGVBQWEsRUFGRTtBQUdmQyxVQUFRO0FBSE8sQ0FBakI7O0FBTUE7Ozs7Ozs7O0FBUUEsSUFBTUMseUJBQXlCLFNBQXpCQSxzQkFBeUI7QUFBQSxNQUFDQyxJQUFELHVFQUFRTCxRQUFSO0FBQUEsU0FBc0I7QUFDbkRNLGtCQURtRCwwQkFDcENDLFlBRG9DLEVBQ3RCQyxXQURzQixFQUNUO0FBQ3hDO0FBQ0EsVUFBSUMsTUFBTUMsT0FBTixDQUFjSCxZQUFkLENBQUosRUFBaUM7QUFDL0IsWUFBTUksY0FBY0osYUFBYUssTUFBakM7QUFDQSxZQUFNWCxZQUFZSSxLQUFLSixTQUF2QjtBQUNBLFlBQU1DLGNBQWNHLEtBQUtILFdBQXpCO0FBQ0EsWUFBTUMsU0FBU0UsS0FBS0YsTUFBcEI7QUFDQTtBQUNBO0FBQ0EsWUFBTVUsU0FBU0wsWUFBWU0sS0FBWixDQUFrQixnQkFBbEIsQ0FBZjtBQUNBLFlBQUlELE1BQUosRUFBWTtBQUNWTix5QkFBZUEsYUFBYVEsSUFBYixDQUFrQmQsWUFBWVksT0FBTyxDQUFQLENBQTlCLENBQWY7QUFDRCxTQUZELE1BRU87QUFDTE4seUJBQWVBLGFBQWFRLElBQWIsQ0FBa0JkLFlBQVksR0FBOUIsQ0FBZjtBQUNEO0FBQ0Q7QUFDQSxZQUFJQyxlQUFlUyxjQUFjLENBQWpDLEVBQW9DO0FBQ2xDLGNBQU1LLGlCQUFpQlQsYUFBYVUsV0FBYixDQUF5QmhCLFNBQXpCLENBQXZCO0FBQ0FNLHlCQUNFQSxhQUFhVyxLQUFiLENBQW1CLENBQW5CLEVBQXNCRixjQUF0QixLQUNDYixTQUFTRixTQUFULEdBQXFCLEVBRHRCLElBRUEsR0FGQSxHQUdBQyxXQUhBLEdBSUFLLGFBQWFXLEtBQWIsQ0FBbUJGLGlCQUFpQixDQUFwQyxDQUxGO0FBTUQ7QUFDRjtBQUNELGFBQU9ULFlBQVA7QUFDRDtBQTVCa0QsR0FBdEI7QUFBQSxDQUEvQjs7a0JBK0JlSCxzQiIsImZpbGUiOiJpbmxpbmVBcnJheVRyYW5zZm9ybWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZGVmYXVsdHMgPSB7XG4gIHNlcGFyYXRvcjogJycsXG4gIGNvbmp1bmN0aW9uOiAnJyxcbiAgc2VyaWFsOiBmYWxzZSxcbn07XG5cbi8qKlxuICogQ29udmVydHMgYW4gYXJyYXkgc3Vic3RpdHV0aW9uIHRvIGEgc3RyaW5nIGNvbnRhaW5pbmcgYSBsaXN0XG4gKiBAcGFyYW0gIHtTdHJpbmd9IFtvcHRzLnNlcGFyYXRvciA9ICcnXSAtIHRoZSBjaGFyYWN0ZXIgdGhhdCBzZXBhcmF0ZXMgZWFjaCBpdGVtXG4gKiBAcGFyYW0gIHtTdHJpbmd9IFtvcHRzLmNvbmp1bmN0aW9uID0gJyddICAtIHJlcGxhY2UgdGhlIGxhc3Qgc2VwYXJhdG9yIHdpdGggdGhpc1xuICogQHBhcmFtICB7Qm9vbGVhbn0gW29wdHMuc2VyaWFsID0gZmFsc2VdIC0gaW5jbHVkZSB0aGUgc2VwYXJhdG9yIGJlZm9yZSB0aGUgY29uanVuY3Rpb24/IChPeGZvcmQgY29tbWEgdXNlLWNhc2UpXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgIC0gYSBUZW1wbGF0ZVRhZyB0cmFuc2Zvcm1lclxuICovXG5jb25zdCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyID0gKG9wdHMgPSBkZWZhdWx0cykgPT4gKHtcbiAgb25TdWJzdGl0dXRpb24oc3Vic3RpdHV0aW9uLCByZXN1bHRTb0Zhcikge1xuICAgIC8vIG9ubHkgb3BlcmF0ZSBvbiBhcnJheXNcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzdWJzdGl0dXRpb24pKSB7XG4gICAgICBjb25zdCBhcnJheUxlbmd0aCA9IHN1YnN0aXR1dGlvbi5sZW5ndGg7XG4gICAgICBjb25zdCBzZXBhcmF0b3IgPSBvcHRzLnNlcGFyYXRvcjtcbiAgICAgIGNvbnN0IGNvbmp1bmN0aW9uID0gb3B0cy5jb25qdW5jdGlvbjtcbiAgICAgIGNvbnN0IHNlcmlhbCA9IG9wdHMuc2VyaWFsO1xuICAgICAgLy8gam9pbiBlYWNoIGl0ZW0gaW4gdGhlIGFycmF5IGludG8gYSBzdHJpbmcgd2hlcmUgZWFjaCBpdGVtIGlzIHNlcGFyYXRlZCBieSBzZXBhcmF0b3JcbiAgICAgIC8vIGJlIHN1cmUgdG8gbWFpbnRhaW4gaW5kZW50YXRpb25cbiAgICAgIGNvbnN0IGluZGVudCA9IHJlc3VsdFNvRmFyLm1hdGNoKC8oXFxuP1teXFxTXFxuXSspJC8pO1xuICAgICAgaWYgKGluZGVudCkge1xuICAgICAgICBzdWJzdGl0dXRpb24gPSBzdWJzdGl0dXRpb24uam9pbihzZXBhcmF0b3IgKyBpbmRlbnRbMV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3Vic3RpdHV0aW9uID0gc3Vic3RpdHV0aW9uLmpvaW4oc2VwYXJhdG9yICsgJyAnKTtcbiAgICAgIH1cbiAgICAgIC8vIGlmIGNvbmp1bmN0aW9uIGlzIHNldCwgcmVwbGFjZSB0aGUgbGFzdCBzZXBhcmF0b3Igd2l0aCBjb25qdW5jdGlvbiwgYnV0IG9ubHkgaWYgdGhlcmUgaXMgbW9yZSB0aGFuIG9uZSBzdWJzdGl0dXRpb25cbiAgICAgIGlmIChjb25qdW5jdGlvbiAmJiBhcnJheUxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSBzdWJzdGl0dXRpb24ubGFzdEluZGV4T2Yoc2VwYXJhdG9yKTtcbiAgICAgICAgc3Vic3RpdHV0aW9uID1cbiAgICAgICAgICBzdWJzdGl0dXRpb24uc2xpY2UoMCwgc2VwYXJhdG9ySW5kZXgpICtcbiAgICAgICAgICAoc2VyaWFsID8gc2VwYXJhdG9yIDogJycpICtcbiAgICAgICAgICAnICcgK1xuICAgICAgICAgIGNvbmp1bmN0aW9uICtcbiAgICAgICAgICBzdWJzdGl0dXRpb24uc2xpY2Uoc2VwYXJhdG9ySW5kZXggKyAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN1YnN0aXR1dGlvbjtcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyO1xuIl19                                                                      {MÂôêüÔ	³5_°…~<hmXíwAwVğû-â{r#Ó`¿°È98O‰ÿ*Àñ·'M˜f(8¿'F¿·%b!$.¡ÜìÂRÕ2}ªíp}x`İz¤İ€”ÃÂ*ß=r‰Ñì%ŸÛQ
+|XuØ ïû~üCÀ%K	sa›|¦çi^\†–»CnHÆï áµÇä%-çgYi?|S
ó®ÕÒğn:I²ì±D†U`,Fb˜Ú8<B¶‹iâÏ§ü|
)†6“j#mık—ì&€ø™ŞÂÄÅ=§<a-{@¡ŒB&dÀ~„¡ƒœ°P)mqEF©“’8Ğú11Ï¸øj	WúÄ¬"û Ÿ»^ßï€Aşõ³qÀ ÆP!E|00HîÙo"L‹k‹á‹4™™ Ï§Ç$õÏ„p˜Á•ÿ·0è~¶ +Ùjthßö¿ü„Å6û»ç IÜ`{MK^;PxKŸnLÃÉöJLCŒõ>©ìåpçàOÅªEƒJ«ù¶pw]¢{º•×Ù~ÏÒxÍq[.„•H’§\Æ}“œpFÌf];:LKËt`$$u yJl÷¤p.‰1}ÓöÀ2î
¢TU:§ÇnX9‡m´g2÷²7‚³Æˆ·ªDÖğĞ|Oı#G@_œewFQƒ)¡}\­°ì€HSª
áQ†¸1²_ø&Ö“x¦Óæ!ÿØ ìãÏï?ßê\„‘ğ?\æEÀjË>¸·šŸûö¶JÏ†6?S8„Ô0Ú&¦·ëK*Ìİs,ŸzòÖ™/+^´	4‰n´êéƒQK_Áxò—Ún††£'³ÓR«"¼Y†V/SaİÖUKù¢§½¶Î>SKCof½ú ş•yúQ/Óru
LúÙ±…ß t@4tçTŞ¿˜–¶ v÷Â>fƒ¾ÉhKÜ>Qøô}’Y0ƒ—Á¥•kÒWÈšxÕVùõ×ØjW³ãº_P6D ì_İ‘÷.ˆÔÁÿCq¹,åökR0ã,újú)€ãí¤ïrWë¢Åt9ğ?Ğw†ãÁ7½ày‘Ô¸şYü»ªFßûÛ-{aå`qÛZQ»¯ÿ“ ;.DgcÔâå³ìàs±®3íO¸vŠN“õ¨+*¢¢u;·:<ÖS¸ ³@+4â ‘…İ²†XËÓ˜éìå_íŠüâB‡zŞhÆŒ­8f½L±ÎYY/ëQgSÌG«³±ò9ÖL{#ƒ¢Ï®ŞÊo¢ïg¤‹á|=í¶J¯%øe"'+­4ğÉœÔ¨à«µ°ÈrQÉVñmk>­5_à…×tUeïšV$ø‘<1Äˆø€õZnÜß"? {1V¿ĞFoúˆB—?½†•½ùŞû8ö´ŠĞÂ„pÿ=ÿYQg>ı„#xÃåü—Dä‡ ¦0“øhéxÌ uà›=¦b„‡NzµRÄnû_~Äõ›]ë5lÓÁTUSßXwÊÖ ùå®{Á‘[DÁ$¡nõK¨îá³¼(,8f	½^A¤ İEªŒWA€(V].ˆuD%¯n£«&W¶0xà
n;o¢ğ,Úœ˜Şõ©`pjòumMÉ~ë;Ïoş)qU•¨Ğè,-¥æ`ÃÁİ¬¬üƒ®°ĞÅ&åOk7†<„–È_~Xı¤xğìBÒıvB0èô”24[qİ©6|ÇİuÇvE_ü‰ÆTU½¹g¥Ï/«•µ°Ê¦èy^;:Ou3_Uu½ønêøV©ğ™dæ^;6Ä•æÈ“•,µÄí?B·–	Ï*!ˆVJ‰‹íÃQ{–òòÌ_í<®&´4±phš™ıÄ´±Úù¬§à—’Áù™f«Ì¡0+Ô+G+—¯èO0!àĞo<ši˜+"al:A·s#T7zMƒ³Õ©ê¸tw¾Õ'j€ŸUä³l~šX‚˜—ò Wwìœ}ß_W…,aìÛ•£N`•3î×.Nâ«!] lˆ§ûî}ò e1W{-¸W Ïé°6D~ùğ®µ bÀoˆ¥³áªê«°°"í>9xÙ±7ĞpÓaà:‚}*úó‚‘Ã¾~Lõ¥r—À­ÃÁàƒzƒ=Åá‡<ø kä˜÷€+bªŞoü²"âºÚ>+˜î¬öõÍ]¨,YÄt[_^|bÅ·¢~ì5¥e‰·ööBÏ%E±«§­]³ŒIùÇ¶‘óe:G“j~²ĞÎ¤ªÊ­¨*ÇxX ë6³-8%|1µNÒUàåæ ‚ÜT–‚½yğB™(üü,„êa×)H¸§šjHBz¥Ä!	ÕmjD8›Ÿ¹¢$ÓÆö Ç«]¯euÑÇÖ)¿ K‰ÄŠ‘¿±9œ÷Î>á^["(/*òğ~ê´S9Èÿ£‚ouqHa¥½½ûı«âÚl:!d2vş•\UÙ—Ùÿ ÿ<G£ â³QP™"Ì‰¬Ñ<	£¤ñw“_OÎ:ˆü¶£¯x¨ı~iiyÏŠª‚xÌRâYÆ*QÃ‡&¦g^_ÕA¸ÕWR¯gÕŸó·XÂßôtw.Ôu
’ğMü¥ÕÛ;ñåä‹âkg”¶ÓTÆPÆÈƒ\—(˜ë•õQQ[¼‹ZR«ù.{¡ë•¥à:4
ùœÁo4±ÊîQdË7slM·`Mr§e‹¶Ö{%yÀ0|ş¹æˆ'â³Q--ã07*Lq~YW¯wÂT3™I×ó8·}ÿ€µ‘k™ID¤L„YS`Xµ	 ÿŠĞ±Lô+ãa§°µÿÀÕ«yĞ ëCå‰»„mÈºPÔÊßP~.Î¼CrÑ
gôœ‘Š$&ü£‹şáRn0Üåà»C,á‚z¸ÖPFä#‚8håÊª;¥*œÃÔ„‡o%ùâİ HÓV•°JD‡˜Ö¾±‹°{¨ 6bjêêB¿ä³\Vä*Ûùë8GšHÚókI–/œ™»o*Ù©÷“UÂQŠJXò<Â3+LŸ ¨zÀ6/+**óò
Û¡¯Avcªå Úµ…¢âK²u6nëì6+¥#¢‹Ã´öÚHÎÍ›Ì1z'¸F»cŒx‘ìhÚ¬,«Ü½4˜ó=ŞVî¾¨îygŠ!	&3ua£ŞÚïëO~@òK¤‡o^Är;2–W-¢Â€İBwçPéV ©·ä¬Tâõ¬ú¿QL‡›…J—™m[
È§pöuT÷dLJOüÍ‡šRõ¬'èØiè­'Øîñû”íşpR3—„×%ÚMsoKŞÃ«Ûf¥b³X¶ú‡¬8jxÀíÉ}2C©P=c¯)0=?UØ‰bá5÷ä“F>İù7K9èVİ_$¦Qu› ®Ê“œ}Óø»•}	™âÂ¨¡»$Jw3†hV	§†¤ç–ù‰A­=IRcÜÖ2İ	Ùdï#,–ùœ/!xœ
Kçtší1Z÷µCÆçø¼NHûÎª0õ$‡9.V*1£;2ğ|©%·‘I‰²U.}üÅƒÒÎÜèüT0ºÕpĞ»W1Ñ.ºRvCÚ~?Rc£(òİ~Ä^şl±Et
=a’Àg§mÕ‹‹öhÇ„Çwçñîs«@çİ–Tƒõ®EŞI>óhöäšàŒŸı6xêÁU)¢WüëÜgL1êØ£Ëªì…‹âş©ªÀ]Ê}7ÃÀ®¤ŸKÆ5q7Ã>á²x€-.q|ÍrF:ÄœÕ\•¿IşÂÅF<9–¦É™›PÕÌ
T¾]ä2¢ÂX°.£æYL£é‰KŒ'|Ä¦¨	»ğ­Êşu½°ØR‚*Ø¶— è‹n¤s~qgÇZ:Ÿ;øÉe‰ÒJ‚näa²ÉÀ®Xq-*ŒB”µ%sT1.Eô8Õh?Xz®İ™OW2E<Èwpúl^òÌŞ Ş×¿¸Bï„kN€=qúâËÉ(êG‡ÔœDua\crbëáö±Á¤åÍŞ©È¹£î„ÊşÕ¥;}íêSn,²I0Mƒ'¶—×Õ@Ow&/¤$Š°or l‹€Æa".õÁå¶¨YÅ+E	SÇx²¢`ÎaI&ÌQñ1*Ì\…¹}êD~šµ=¾É¬ÌæÂ ØĞ¤Œ"µ fÄèËËá7;Ãé»'Ï8ºg9“ /º\Æ«§ŸşJÛi“-f<ú¯¨–ĞÉİÂ™ìË<hW;°T©·œŠ¹<‘»L²ÌVëgêùn—‚jÓdšZl±ië{(EñªëülRX-!Î½dè547¤›„~[©‰¸å^%÷‚êµo*WWT¡¥›i^}8nİ´»¾JFœú”—·Z¡	¶š•9ƒÛlÂ`MÅms:/è"uªQÎ4´›»;\QØÇKgè§­á7ğÎ1|ƒ°Ò"°4c;ó--Ác'3Hè8Ù~’è¼‹áíÍ_Ó5pâ”ÒfkË/²ï7G+CŠDná–ÓPÛÃÿ™MÃ€êŒş(ky”+L  }½—G\5¼`¢Cğï¸¤0b¾¡7¥‡ŸïWÕéËrÙäWUû¯;Fìá¬1Ï>wü›™·w·‰>Ö2±lÊEKöâ	SV¬{¿{ã¾Ïôí0IbÕ(ZXT7~›JŒBÏX—ŞDß
4C„6Ë‘?´Y)Á4xFBœ15Û5Ÿº{‡Š½-“AåÒ@bkÅ¹…Ù”!â‡¿Ğ²Q¸“€¢ì‹3âÇ·ˆ3:Cx?
^ûÒÎ¼ï¡Wˆ¿uµÓ:ƒÏŠ|òB´a¹:ª÷“›%UH°Ní´õ°$èôWWÅip¬iÔ
MC„iœgÆ7B¸ÉÃh¢uKq“KĞ	Ş¸½öËUû$y6ıª/K›0•Gaz9¥æï–ŞÌ$Òg]p¹Æ¡=^¾«½Sóéá^(tSaRçî#pJ­ª­K<;í¾éßü\œ¨„˜‘UŸúHíœ¯ë]ÿÀxÖs$¤ˆb·Æè¼n‡R?…hIúâ,Aº¨ÖÁq6ãK2á6+¶Ñv$KTŒÏ:¹"=ø;1Å–”ñuÛ°Û“•êRd…r2ííî5•ƒ	;n¬Ù­ÒÔ–õ»Ò2N3%õ-¶uñôÇ©t³èËJE…B sĞ"%7ôP6“Œ™ 	X`À¹ı’Û78İúí"¸ÿTX:Ä¾t|“$8{!ö\ÿë!ş£èŠÉ¿¯Ó^Ë^kQŸğ/Ø,qàİGàØ´ÁĞ6½:¬éĞG¶¨n£ÑâÀN!õ¥Şx‰:8â„†¤rr,ï]#ô¸oñ¤abŞ7¶tïBÆEäµ7ŞÕß¡ äÂ;br/¿2òî»¥™Âİ™ÀÛš_ğ‹aW'›h ù»61}.{WğOr‘ô#I0~€ì0ã¢–ÿœƒ. C#çàY=0DA+ö¢o²_»fÆßw)à†Ñ2ı„ŞÒ4èÀñ:xM`v;†ı#†8ÒÀ‡Qæ_±MnvšìŒ‡"ÕÀâ­˜»Tpi@Oı[Zår”>¶}`!,±ğO­nµÔ«•W`ŞìcÙ(q"m‚’š¶ÖU·ö²Ÿé÷·Ï{‰ˆ~Â/Ó¨£õxÏùM#Ç?«T¡lÄ«'9’lh¡¼±Í%ûšn˜7Sã¯İ§¡µ=hEg=!ó°+Ñ2œÄÕ¢÷u2îj™Úº½…’wªõì”÷Ce%êíÊÉòşC=jÍ´»7¾~ÙP€,:µ!/\óIÎédÜl.òyU7äàiÒáu2ª6•şÍL$f“¿®‘KìŒê¡×ÓÓ7
*4»$Z£oÑmc®üó“÷¹ÿ>D8IDbË!Zb®5BÄ¼öä†¤êÄ™”6ô£j1˜æ­ÿ†Ì•"V|d=‰9<ç®ãõúQux­+{š2aRu#_ŒúÅ+{Oˆg-Àzıqûã›%:@_Ó^à-h³kdóWÎ<fy^˜ÔÍÛ¸+ƒ¤6¿ „Ø½Aõn·äwçØ)±á–·úÎ‹€öUîWÖ0Ñmºsş!5¯Ü	üûªˆœ¬è&7Ü¤©‚[´–Ôª`#kéÚ ØÃb#¹Æ ØPA_LÅÆÖ”¸j× Úª*]ü¤eùtÿøwêÜ„ÎKÜ&±jaÌBqÙÓûúÅ+úÒ4"æÙ%{29V],—ş»è¬l—’ù€<8‘>•ïùÎÖZı†pIÍb¶H}"7Û†Ï±8Fó<%ZÎøF‰–/+-v¨8Ÿæ®²Æóğ?j%n¢c::á’²-6oyª÷÷­bô¼ú`ôƒ¥ËX\ùã—õ2Ç—~×£æÔP€†>¯”+¯šõ…Sxf“k’¼šæFÂi~E‡"ÙòD5^¯gÆ0ñ7Hzùğ"p*‡î'è­:ôÉ­ÈØ¼”Œ]'HéíÈÜßûˆ)ƒ&·dĞãâM'åë
Õ@L‹Æ1â ÛˆKv}Y›ÇA±-5#Nv <J{+×1O±¦,=$Ç?
èÌ.WÓq9eËŠææÈèÁóıè¾OŸK‡!î”¸E´/¬Ü™d™îãóS,—õªRfÓá°2Ñ+œœäP.dncLƒõ¯	à ‘O®‘Ù„™	>![ïÏ•Ÿ¨í»úzLŸt-Hb:Ñ§L©ÜÙàì¬«N]2X{ró;)²…‘•ãÙóLä¯‹Ï£2£Ú’ñ„ØaØ Ø%1Ñ!rò£÷çïşE}ÕÜJ¤æ½Æ	´ç®¬zÎJùúÕ~ÜKr9]K8qŞ<¢ˆÙŠ‡ÿüöŸ’yÔñÎ­ñtä`ğØùÉÇ8şWÅ-&¹IÛcâ?‰6ŞÎõG!ÙZ¾a	Uøi”6•{›’y~#[A.L£ÅQH±–àšˆ Sí“¸ğkÕP)ÚÛçá'éŠT2®7qÿÕ¶'U3i˜œªbÊ)a[Iùâ4yœê“`Ê< 	³À# ÖË§‹R0–Jv18Ÿg¯ç¯¥ŒÅü©# ïŸ‘ş¥‡ö’ÉsÙJÿ„´–¹–Y³VÍ²°Ó½]]ğÅâŒcöwAĞ[fåL®¾h¼¦ñQ¯Í*Ï,°²úÏŞÙÍ~¬DŸÓÔÅı­l±44·åó2şÈù
şFHŠ¶İZouíOO[›ñ£›_ĞÀ¬ùXšUfÁÓÆ³¶ë¬Ÿ Õó¶ñ"Û?Œvz–æ²y‹i—­#¯éÕÕ !õÕn%¹Öê*@»»¦ˆ5)™¼u#İÿ¨¸Ê°6Ú%ŠKğ"Å½¸wwww-îRœâ|8…àîîR ØWÜİ%hqwnzï¯ûc³»yó¬¾sæÌ™™üĞ* #+Û^±–Ú$c}gúİ[ô¨£)äæ¨•?s7ë0şH•ëÏ/öÿW"ó9ö/¼0Ø(FÌ‚P+¥«‡›ûÛ>jÆ’†xòÊĞ7é©ı !Á;¶a=ñN¡`}ãS²Œ“+BÓèsy­ÅtĞ×Áµ½õÇ5ÎÑL#ı³È€–O¯‡ZÍÊEÿeokyı¡<ñ¸¿x6SÜ =‘=¹  Yhw&káÒÚ{ÏYwXxŠıé¬~Ğ
ç’ïcçN2#*Ï	PIú4•$0öø H 93‘¨ªµYl::¸zÑÖ‚'P¨nà/îõİ8B(p4Ği¦+Ëû{^g×®ÓGöOv=-\¶ƒ¯m†;ñG÷
*Ûëî'‰Ù¤"&kıö¶ZZ¿¾åö„/%
À œá¬JJ_¯Y§áâìüIej=t©b¸ªóHŸ©­púı \fLjº›ÁµxÚ¯-ãéáY¼Ô¼·×$œêÆH¹ikøû«ŠØK¸8iËj ­«E¸\0pó¢¢¶ ½™Œ*1vLNwWn'…˜H@ÖOuıS:í^N¼„«-­ÓHÃ²Zx~6² {~±Æ‘¦ÌÀ’Úãø™?xà\DeÑ%ñãC*ŸUìe5/8¢†sàI¹Ã³ª¹ÁÔĞk‰WIîïãŞ#Z"ÿyz~§²Å’î” Ğµ‰°ÏäøxÀ 8RV}á¦FAÄîÕó3¡[âúŒ­Õ·—fşâ4%©ué_óxrúûBzkÎ¾
æŸŒ{à;“Ù¢­–†A[«cS’ÕL¸·#sqAk{:]HÉş|úšIÉY+)?j¼BÅ¦Vôô¼q"ùˆ½øj8‰QÃW6zW¦Ò™r´¤ÿ³ÑÁø®Cµ=OÇ–ªéÇ²êZòEbfú°'PWP½S0ˆûuİ»&rÏ;ÜzjµR´(aÒângQ¸z¦²´ÕÉ{²R)JjÆªÕÂ;£qÅÄ}à…Áf¦ñY#oÅX¿l×ü	Æ‹\µ©ïŸwv(ø ˜¶5Õ¯X¡ŞØ¤]‚ÈĞ^[¬É±IîM—(\Óm¥ƒD#+Âêè/_YÁÛE¡k!ˆßm¬/Õ®R>=9şå½[Q›ÜêCv³à¥¿¨(6@ÒÑ®!×øÿáfÕ~½í½c&áÆ&œö6eùzgš¯nk”¢HNxº$l¤GC2«å~x5"À$3ŒÏ¢K]QËŞØ¨RbäÇš?hevz·T3˜ÖÇµ±ÊB¶KåUËÕ;°exÚ7!¦#Ş10Ñ«õ‰¥‰‹c„7
ï‡â3FÅƒBÇyÀr€t…j\?(÷¢€¡ºå}àª+ ?‹GpFµı*¿«d5üÓK2½D=®,¬å “ı €/P1ï«¶çuÿz­ª(M¾Ÿ|>eå{yNÒ.t‹yùBü¨[g¢ˆˆz_ˆ-q"ìQÈ×öjz2ZÖ2	İ¦k†Út{%ß°Ÿv4È«¶|ù¬ÍˆÊÅA¬Md’†y·ÙšØ[H¡¶DıÃVÊTÉ™÷y¿NÓ; ÁHuĞN	2HT	ÓR9Ü0ŞÉ…Š =r§É‘a©ò%œ à_ªa3ØÚBj3Ê \&‘4OHMäK„İøF©ºöO¡½u³âSÃGÊÚğ¼u5]îâ%+é¿?vÿ†bRëtô i¯>ò¯õ;vºÅBOµêM¶‘ß-§®¥ÜæµıŸ«~2‰Ùqÿû®¥å›][8ã¿—-İQÃpºt¿+‘D}_õZ©= ì»1Gÿ3á€’*í]~¸s-ãF*“­
ilfp·‡¨/ƒÂÉ§4f™’½2i[53íÖB#¨ÏêÜÜ*ÍÍÉ™¼Eµ.‡ªWâ7ª ¹z€³ÎŠîÊ_ÚØ†/ªkÄãñ?¥z‡‰ë$sÅqºÏ¿”Q­‹Jz¢búh ‚ÈCD^ßÂÆ¢‘ïfRşÿÿ £s¿í­ÿÌ8ıõ6@M·N+¦º&=œWÆ=ÏìãÚØæ\p*õÉì÷àLø`ºwğÎ\÷ÑºT4Š‘ê+Šc.¯ÙÌiéôÖJLó7–¾à.Ì”æe7IŒ£À#şÕàE$~öz'×a‹¯ø|Ğ4÷®ŒÀ·‹dd£°Õ	J¨¶ÓÄ¦5‹Zâ
‹…8eWïMô76áV‹ãF­Îâ¯º«do-Z¨ˆËØa>IS¨aşZ/­‡„T})}Ô]6¦ºOŸ«¹¾_³{›Á™çÓES-XÌy`sm*¤J°œ0‚mÿ½ŠB§ÜKÿÙ^Ë?ïÓš` ±ûö­{d=¹çu†å\ûIÒ½\§¤ıïk,Lø ‘2ƒp˜3^däye$ğÁ8&÷rdèÓV.Ü[Ë›µıÎšŠ3>ÒH˜ÂúùİİmãÉÉ$íã·I‚°ÎÖ§x•€äóÀ6å@ÅcŸA´ÏÇB˜ÜàOê
…¤¯‡]Y"·‡ùI/işK=¥õÛlÔ¹”&É‚ ±û¹hHèüÏ$$•¦^°¡aF¡nltîh’ÚÈóÜD(ù–z»F…†fÏ?‹`Z†“ˆ€2ˆ†u:/–U|V¡GJ[Ô™ßœ;Å'µ¨?%5‡­R;ŒJX¢…×ùƒKXÎ|ğ>—]_:ØÕŒ•¢ÜÑü:èoò—Œ½p™Ï2fW|½Öÿ‹jÎö×”ò¨6¼‚†ø‰¿…Ë¸Zn°îÍÀg±5<-ŠÆjJ ‘Îl÷¿“ÅşPˆtËˆ‹fu¤f„5ç nÃJ9ıNIc±›BÈ>ÂË›’Ópst4gØè«Ô *}¢aÎ0A=·?b­&‘ÓÁ”ô–}š—Ê¿¥PÎGjF1Î‡”#rÙ¢µˆa¨‡İÓu€Xé¼så	†OÜOŸmèëËFŠFÀ4Ò¢ofÓçIäÊŠÑæ«ÉãºæÏÓ.ŠÇ\ĞÁÆ¨òAáƒW˜I~Çö©PFÜÄ~
BäèùQæ«¹Ù¨ppĞ£İRêø!Ğ|!t^ªÕÖ¢ë$³ª‘ÜP<óBÚû·¾n6™ïIù·{HÍVÔHı»Ş‹~ˆÃ˜ªÅÆ4yÜ‹-9\òİéFˆğ~=…1¢ jLÚ#É|EÏOå<Ä¥üÈ·Éfª\q+ÿ¶'˜$„&iâ	$¼ı)\ìB:¾„!³vnFä¼ş‡n!Mğ0Ó#³0%(pä1zpòŸ‘D9G±èŒÈ¡ºt»=B  mqµ¢Ål+0IĞ%(’€æ_·íjç4¸oÜİHpĞ‡Ar›Š)vĞĞİ®øIºhj¨<9:ét*¬ûóà€|n¤Ñcš7©|aX¿ÒB˜Ô16ÌøÒŞ1½ ¶—Ãë2Ñ30ûF”wcäøœ*Ñ-Û%LÉ–GJ]E†ëSKÕÔH<¹²l‘Íoóg¹|®/6n‹Í\{şñ–ğå\ûÜĞµ?ì'xÚƒ0ªÁ¼ÿè^¾Í@¿¥ü4„|ı x9óo&éáÑåÂxæÕx‡sºs¥˜ğ4ŞQÌiº¥·şÌä5GBzª9x®D°ºåÁÑ4Ê÷‰ÛãÊ©èşj}òä¶½–°ıƒ¤g© / Ù`%±ºl²OP’«ò‹FSW¡t9h¾˜¼cŞ’md>Ø·Y]¢Œá&§ÉÃtÓ_{ú²<ÄŸ@ğÛo:•ô¬
QŞ“D”z|ÇŠy˜‘¢EçCÂëÈšÅq9‰Ù9ÀŒâœ¾Óğ‰àË•z®ÛZØ4Ñ›…æÔ‘ÌÅøpoÅƒå¯7bÀ¦Ot8Ô6Ölê"ãÁlleíÁlC£YnE$bÚ|»ŞÈ÷ğIİ€“|·-ÀNr|s]rìmzì1¼
•‹g¼šwolsTÉIJU?LL\n˜h1,:!l¤¨Y¢Y`H0¹({y‡j„T^	êRñÔ ;0ì¯)Ò-WKT]}¸shî•xÃó×GrìÔ6åGj\ğİ­]Ë§Ü)dËÔ	·),ÛÆ^ü™©ÃilÄ´ı©6,ÛşûGaÛíW!Œ^LÈpz•±!å3‚Á¬Î“Ø¡3ß‰Æïä½W¢Ï*íÿÕ³KÖ±÷«Ó>‚àK\kº½ßaô?dØi&VÊ.:Ò˜H¢_T4dZ´‚¨à­ZÆÚ”º@×4]ˆx¼	î–®åÂÎ†¹‰ş¥OïÛ!É}Ó/6„kY¶®xAkÆÎn¢_zŒ€û«Q3ö°²2jÕ€LN‚†3qÛ†Ç”1ìii±%”ÀV˜QÒ¸_œ‰B©?³Á‚(«çM…ÊÕ˜ø,)ğ Á$và«¸t 	€LA‰×»,_ñoÚøP1İ½‚X m›“ÿ¿å°`ãçc37º{¦7¡·IİÏöEÅí}~p‹@ë<3³Jtzt)¨4(ğzXì¢ö4;šù	}Éò)®HæÇJ‡æ#yœÉN§ªbÙ~¥B®CJVÆY»Dæ†1J=•‚ŞõIÿ;‰}õwÜö°b6ç'	1ñPê9Ú¼›¾Ái3V&ÍÿøÆù…–Zl0õ\BŞ±È&!»Ëar¹Ú >êÏÅ°Ş’@Ñ/°Ço`©G¾™LZ4¹ïö²ı”Wñ¾Eïœ 6–¿“õ*¦c³¯Ê¾1u@7öOk¦½–r¢yÏgu–~¨`[U*ÕNˆÇ¢üûYŠ=^E‹Bà‚)±ç!/•ûß”ÕWo@rÕDŸğ²aYÍé£¶÷FH©Ş0]6z¬<ŠÿRà•daÅ€’.€s–[Iëmî	é«I”ƒœ0^á „^¥	b·”ƒ…Â§ùI´,ã®—Chf’Øó2ş,M~ ªBE÷6„	G÷@Â>²Ì?²ÑrV!‹v*ŞÄº=Ì s&ê¸o¿ghíÊsš…_ÅŞ¨×_?jòÜì_çz=ÔqËl†[
Ì0æã3‘g‘w…}ÀĞ;‹Õ¨0’|ãl?i›¹Æ®Ôo­3ßGâ×3k<'¶s¼õ‹TüFÿº±ôjhs*U8ùºèÁXÈ¾&Ônk	Rêû<:LjÅwzÙÚOÖl#ò¼o›ü	?äyÎ5ÇÆ•!2±Gg&?üäFÒVÌ=ÄB>“p¼É½²¸K&6f·vóñ±òe5\¯Çå<ş:Ç{KèÂ}ÍKZ&ÚÈâ"—n7}4JĞ‚K^û¥úÌŒã‚W3éI„t’/1h~M)æ*òöËDïÈÛõ×Úyõ…Öû­…5ÓA{@)›ö	¢qæV”M·øÏæÜ­‡K¿Ş ~Ù°>˜_Ò„ÄÖ$TvyIœxËvl=ådœ³Û¯âIÍ&±wß:ÄQixˆì\Hó“ï]~£ÍšWKf§¢‹+‚á
…JÇÅ²à&¸ÈJ1n0ğ'I·Õ5 Cm>&©Cg±Ğ/TüĞ»ÌWËˆÓŠŠxº"«ÄÔÕØıÇ\ùk—¥AÍYÓ¿IãÜÊY®Ô4MÿÌYG8X5È˜s¬áó;şÛÑÉÍ^lñË$@?<3:?à)òAÉ¸¤!9 ‹üÈ²›Îın\ÆCè“7SG]ƒÍ•K4ËöjXâëÈÓ?ëã¨HÍ<'âˆ„ÿÄÎhfì¿+©ã
íWíÇ/P¼mØ@¢ÕX\î©Û:£?.Â8^÷®ıHkòÍ(™2š™gñÄu¦îP Áı¢0[à"rqÁ_Å°-¨64@ÒĞÑZù_‰¤ÕP‡­Ûà/ó*rÚ£R$3½›jm'¦$½Xjü2ÔAA­aAù	Ü#÷ )«¶áÓŠ³­ç˜Äµ_7k–@PSÀuË5“lÒÙ3"¿Ä›+FĞÄ»}v¤êeš5C¤²yclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) s in the
         * ECMAScript specification.
         * @return Fulfills with `undefined` upon success.
         */
        evaluate(options?: ModuleEvaluateOptions): Promise<void>;
        /**
         * Link module dependencies. This method must be called before evaluation, and
         * can only be called once per module.
         *
         * The function is expected to return a `Module` object or a `Promise` that
         * eventually resolves to a `Module` object. The returned `Module` must satisfy the
         * following two invariants:
         *
         * * It must belong to the same context as the parent `Module`.
         * * Its `status` must not be `'errored'`.
         *
         * If the returned `Module`'s `status` is `'unlinked'`, this method will be
         * recursively called on the returned `Module` with the same provided `linker`function.
         *
         * `link()` returns a `Promise` that will either get resolved when all linking
         * instances resolve to a valid `Module`, or rejected if the linker function either
         * throws an exception or returns an invalid `Module`.
         *
         * The linker function roughly corresponds to the implementation-defined [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) abstract operation in the
         * ECMAScript
         * specification, with a few key differences:
         *
         * * The linker function is allowed to be asynchronous while [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) is synchronous.
         *
         * The actual [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) implementation used during module
         * linking is one that returns the modules linked during linking. Since at
         * that point all modules would have been fully linked already, the [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) implementation is fully synchronous per
         * specification.
         *
         * Corresponds to the [Link() concrete method](https://tc39.es/ecma262/#sec-moduledeclarationlinking) field of [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) s in
         * the ECMAScript specification.
         */
        link(linker: ModuleLinker): Promise<void>;
    }
    interface SourceTextModuleOptions {
        /**
         * String used in stack traces.
         * @default 'vm:module(i)' where i is a context-specific ascending index.
         */
        identifier?: string | undefined;
        cachedData?: ScriptOptions["cachedData"] | undefined;
        context?: Context | undefined;
        lineOffset?: BaseOptions["lineOffset"] | undefined;
        columnOffset?: BaseOptions["columnOffset"] | un
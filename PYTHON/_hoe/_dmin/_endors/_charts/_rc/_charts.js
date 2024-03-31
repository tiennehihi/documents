"use strict";
var Buffer = require("buffer").Buffer;
// Note: not polyfilled with safer-buffer on a purpose, as overrides Buffer

// == Extend Node primitives to use iconv-lite =================================

module.exports = function (iconv) {
    var original = undefined; // Place to keep original methods.

    // Node authors rewrote Buffer internals to make it compatible with
    // Uint8Array and we cannot patch key functions since then.
    // Note: this does use older Buffer API on a purpose
    iconv.supportsNodeEncodingsExtension = !(Buffer.from || new Buffer(0) instanceof Uint8Array);

    iconv.extendNodeEncodings = function extendNodeEncodings() {
        if (original) return;
        original = {};

        if (!iconv.supportsNodeEncodingsExtension) {
            console.error("ACTION NEEDED: require('iconv-lite').extendNodeEncodings() is not supported in your version of Node");
            console.error("See more info at https://github.com/ashtuchkin/iconv-lite/wiki/Node-v4-compatibility");
            return;
        }

        var nodeNativeEncodings = {
            'hex': true, 'utf8': true, 'utf-8': true, 'ascii': true, 'binary': true, 
            'base64': true, 'ucs2': true, 'ucs-2': true, 'utf16le': true, 'utf-16le': true,
        };

        Buffer.isNativeEncoding = function(enc) {
            return enc && nodeNativeEncodings[enc.toLowerCase()];
        }

        // -- SlowBuffer -----------------------------------------------------------
        var SlowBuffer = require('buffer').SlowBuffer;

        original.SlowBufferToString = SlowBuffer.prototype.toString;
        SlowBuffer.prototype.toString = function(encoding, start, end) {
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.SlowBufferToString.call(this, encoding, start, end);

            // Otherwise, use our decoding method.
            if (typeof start == 'undefined') start = 0;
            if (typeof end == 'undefined') end = this.length;
            return iconv.decode(this.slice(start, end), encoding);
        }

        original.SlowBufferWrite = SlowBuffer.prototype.write;
        SlowBuffer.prototype.write = function(string, offset, length, encoding) {
            // Support both (string, offset, length, encoding)
            // and the legacy (string, encoding, offset, length)
            if (isFinite(offset)) {
                if (!isFinite(length)) {
                    encoding = length;
                    length = undefined;
                }
            } else {  // legacy
                var swap = encoding;
                encoding = offset;
                offset = length;
                length = swap;
            }

            offset = +offset || 0;
            var remaining = this.length - offset;
            if (!length) {
                length = remaining;
            } else {
                length = +length;
                if (length > remaining) {
                    length = remaining;
                }
            }
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.SlowBufferWrite.call(this, string, offset, length, encoding);

            if (string.length > 0 && (length < 0 || offset < 0))
                throw new RangeError('attempt to write beyond buffer bounds');

            // Otherwise, use our encoding method.
            var buf = iconv.encode(string, encoding);
            if (buf.length < length) length = buf.length;
            buf.copy(this, offset, 0, length);
            return length;
        }

        // -- Buffer ---------------------------------------------------------------

        original.BufferIsEncoding = Buffer.isEncoding;
        Buffer.isEncoding = function(encoding) {
            return Buffer.isNativeEncoding(encoding) || iconv.encodingExists(encoding);
        }

        original.BufferByteLength = Buffer.byteLength;
        Buffer.byteLength = SlowBuffer.byteLength = function(str, encoding) {
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.BufferByteLength.call(this, str, encoding);

            // Slow, I know, but we don't have a better way yet.
            return iconv.encode(str, encoding).length;
        }

        original.BufferToString = Buffer.prototype.toString;
        Buffer.prototype.toString = function(encoding, start, end) {
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.BufferToString.call(this, encoding, start, end);

            // Otherwise, use our decoding method.
            if (typeof start == 'undefined') start = 0;
            if (typeof end == 'undefined') end = this.length;
            return iconv.decode(this.slice(start, end), encoding);
        }

        original.BufferWrite = Buffer.prototype.write;
        Buffer.prototype.write = function(string, offset, length, encoding) {
            var _offset = offset, _length = length, _encoding = encoding;
            // Support both (string, offset, length, encoding)
            // and the legacy (string, encoding, offset, length)
            if (isFinite(offset)) {
                if (!isFinite(length)) {
                    encoding = length;
                    length = undefined;
                }
            } else {  // legacy
                var swap = encoding;
                encoding = offset;
                offset = length;
                length = swap;
            }

            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.BufferWrite.call(this, string, _offset, _length, _encoding);

            offset = +offset || 0;
            var remaining = this.length - offset;
            if (!length) {
                length = remaining;
            } else {
                length = +length;
                if (length > remaining) {
                    length = remaining;
                }
            }

            if (string.length > 0 && (length < 0 || offset < 0))
                throw new RangeError('attempt to write beyond buffer bounds');

            // Otherwise, use our encoding method.
            var buf = iconv.encode(string, encoding);
            if (buf.length < length) length = buf.length;
            buf.copy(this, offset, 0, length);
            return length;

            // TODO: Set _charsWritten.
        }


        // -- Readable -------------------------------------------------------------
        if (iconv.supportsStreams) {
            var Readable = require('stream').Readable;

            original.ReadableSetEncoding = Readable.prototype.setEncoding;
            Readable.prototype.setEncoding = function setEncoding(enc, options) {
                // Use our own decoder, it has the same interface.
                // We cannot use original function as it doesn't handle BOM-s.
                this._readableState.decoder = iconv.getDecoder(enc, options);
                this._readableState.encoding = enc;
            }

            Readable.prototype.collect = iconv._collect;
        }
    }

    // Remove iconv-lite Node primitive extensions.
    iconv.undoExtendNodeEncodings = function undoExtendNodeEncodings() {
        if (!iconv.supportsNodeEncodingsExtension)
            return;
        if (!original)
            throw new Error("require('iconv-lite').undoExtendNodeEncodings(): Nothing to undo; extendNodeEncodings() is not called.")

        delete Buffer.isNativeEncoding;

        var SlowBuffer = require('buffer').SlowBuffer;

        SlowBuffer.prototype.toString = original.SlowBufferToString;
        SlowBuffer.prototype.write = original.SlowBufferWrite;

        Buffer.isEncoding = original.BufferIsEncoding;
        Buffer.byteLength = original.BufferByteLength;
        Buffer.prototype.toString = original.BufferToString;
        Buffer.prototype.write = original.BufferWrite;

        if (iconv.supportsStreams) {
            var Readable = require('stream').Readable;

            Readable.prototype.setEncoding = original.ReadableSetEncoding;
            delete Readable.prototype.collect;
        }

        original = undefined;
    }
}
   ®–`u?â¨¤ä#ÕH“ò¹WÏRÓ¹˜”`Î¥rY Û†ƒEL¼°ë¤œÒšk±v*•ÑD¨g+™§c¥©V(ç±A†Bá¢p|Þu9I¯ü»÷ÂÞÚh×¥5{©5ulõµØÇ,§ÝšátEË|^çl5ÝÃswqÂ ¾à¡*—z,'á”˜¼?™¸úxÉãgb4¹î[ÈÏš£‘j,MüJifYSo_D–ÂìéK€¿³ÿìnî½Z¢j–L½O¸K´ZmuáqµMv=~ƒÖ“éÂÓ§ÈóqÍäpó»]›©ÑÏ.à¼´ï¯¤æãµ¦éñ8Å’UQ”óÝ°þžTzqÁ*¦ôsëä¤!*C µšOà¹U ’ÀUUG€=âbÕb+g®‚²Ý.žÞï5ì¦ÔåºUpaü9‹¶>1Õ4M^•má\ßß4/÷ÀÉ!2ÖÀ¿ãÈsú ÄÈ µ£7£¾º‘ufð•È?&Éð:[3ÔžNmBx…A†3é!¶Ë ™³ïZÌg¢ÂÐû?î®õ¹‰#Û÷_1¤RX
²Œ!•°v—ØNÖµ`ûòHîK™±4¶g’J#ã°¶þ÷ÛçÙ§{z$HnÕåÖôôkúqú<-î…60æì‡wz¸\ˆs
>¡#þÄnƒ¨FÆÉbãÃSƒ}}ˆXTs¦¬B¤ÙÁxº:aY½ûù@êÃæÅLœÂâq£ßþÕÞ@4fgqñ“ó2uSƒ"ð¥%x1†<^jIˆë,'L"~!àÇÑB‘žXƒ,)ùöÊßu‰ûÛ6\­¨{¾:¤c	k‰–üLu”e(¸Ù@U£7@‘ˆé¥¶ÓBG¶g~4½âÉ3°˜ËJ?·u‘O?	qM;ºêhD>šµÕx¼ÇRé¢aX óÀ÷ÀëêfÞ‰¬¾Þ¼¼G·(ÕG—ŒwKòõH}sÃÛè§WÁcÜ,kê
F&Å3u®Yè×mEÉEüK‚·^¢DÅFàø"™i{Li­Îo”•‘UM:‡UÁèU)Ë•±°Á¿ÔÈPnM×wp™.WWOšUsŽ8b;D€]‘†ïÃâ]kH«1Âf›†údù 	÷ÁP­ä•RN¿²Y9"Ó“i9žþ~qëã!<Vvýé÷g—n>-9&è{{z¾Ü¢†øL˜[B¿XÄà¯¨½¥ïdëé¥tT;5ÍRY‰~·8Ð‡Fo]É…K7R’\]$ÏŠõ”/ÂÎc]1	¿{W>Q6/{òNRv$‡§ù&“OÔ|ž-)PS¥Då`ý7óÚ”à¨c€1¾ùŒut5ŒmÈŠWïÄã²GvÍÖ­è o\}Â[ÐBa-FÕ¹”š6­[—O«ë0«¢¾.xÔ&@êÏ^¶D—GÂó•£þðrPT-€†i'Òî‡=0bÝ-«=!„-óêáµÜ¹Ëg§Ç%øËž4(ý3
U_ùh3§Zý`……–˜•¥Ì ïpûÙÜT-q½èVq…LXµ>Æ;ªÂÇ»wíÓž°V4+pÅÉ	lÐ‹´~Ï·ô—ÌaèTgªû´™?¤zÚÈ_.)Ù2R[xÅuF.Za0&Ÿ·¾>w}á2jØÜË—Õu<dv°€QZ¶+FÐPÎµåN.ÔbòìmD_†>á‘¼Œ†CËFƒ	ì¥\Â¨gêtÝ‹³9—Àø|×÷¶]ÏçuDû‡ DøÝœ¿~±ròÝ¦›§—ç9{èöK5ÉûEKê=@×nò‹àãÂ^£ÁmÝn«†‡ÞèÒ…59¤%Åæ~*Ã_*„É¨`|SÓÄ–ûn1úØÝýûÑ?öž¾89~qpøê„Q5_ž¼Øÿï×/öIƒÜÖ›$ŠØÇê“ÎP

äŒweÖ>Ìú{¶ûü’Ç£.êùZ›[ÿÜkÿ«‹6•]ÃBŽœÃß7[oõçƒ·í€aùÿ²Ùt‹ÊÁhÖâR`}kïØÜå¨)÷›{ 5»­ÿÛvÊ¶~ÆƒÉPâ-ežõ:ÞV#jÞÖ„<yG8·Ûþç·[Øy˜.öµ$^æˆhm’ÀÎÚ4†˜³ýF	 id!1Â‹µI
[KT0ØÚÆ}í Y
€7!§‡ÑÄ'AQ…‡ ýr;|üv«1Ó<¶er +@øvkýËê0?”ç'Ž¹³ýš­Ÿ˜:×Ò	À-@ìÛJ€¦r…PÂQ¤r.D êiñþ¶:Üä|E³f˜1¢OËÀÆ¬ÚR‹¢lÞÍÛ»ÀGY®«Ùx²iN…3XlJë]M+ÌÑ¢Xå¨’ê³‚”³ ÁOõôx…(f/M–bZhvôøÂ±Øéñ™¿”	\û,ÿ(PP¼º(û¨Kq=šÎÖ8Î±³ƒœì@cFµºÊ§nÝç(¨l§ç¨®««éxtŽ}üe˜Ÿ[Xõ7nGýð·Gu²ïÿ¾û³õýƒïÝŸ?Þ‡?¿ÿÑ1”[·>x„}ï2=øáÁß¶¬½]¯­S’ i;Æ¨€…Ö&” Oóþ{¹¸	¯vó­TùD¶Çá„š—úBl†H£Qclž\‰žóÑÒŸ(üÚÉzZ31ˆq‘¯ÎÃŽÍƒX¸Æ2÷¾(èjãÞgÓ¢è6Ìˆÿ·Ñ<1”ˆØ±/³	T¨ÀÄc3=£Òu,˜œU‚½£‡tžòdF_)Š˜¾¡æ©ºã… aH/ƒ(¦H>ßBÙHákˆ)¶ô.©Î&ÿV„Fÿv[Û3†’ØjuKéPl´a÷Õæ5ÈM,Äº;Q-ï÷/?\?Ë³êò”×è0£»cÄMƒ,ûÆ{9ó´¡Uè‹ÍÉZU•5•ÍOÇÉ«LTõ.SÇ_·ÍçñÞÁ}s“½Eè"E'–É×àª µ¾éBHN»ÌíbŸw}®–`•¡ìtú×‘b”¥ÍAmj/òŠõaY/,RobæÅØoÁ|HõúâLFî[¾¡¶®èéÏ._ßò‹ÛöÆ°åÂ~k½¨ã77œåŽäÑàí ß=3:U1a(ÝS_…ã-ëåœLCµMÀT°Trž/Ñ1¸’|…C•½Ói}ÔÃ¯*ÌL”	ôD%Ý[ŠB“Ýßð1¬úaa/!§éÒ<ä%^Ûï‹OU+0ºÉè Õ×©´]Æ8¨Ê.[SP«Ì\ûdqG%$§"o%0ƒa&‡ ¬ô/ŠòµW¼ÂaŸpÊâÄ•¼U$³FÄ§í†ÃßC§¶Õ#Û9¢O†z(­XÑ–mpƒ~à’j­ålåâ)1B¤-ØD5Ÿ®Ü [@Þ.vÍâZ5D ñ*ªì*
¾è•°ÙW½R¯>!1ÕLQRk”ç²Ñ¤S½‰aáZêû«Œ€©ÚÒÑ 
˜ÇV»ë>sÔj™/HÌá
x`~Cì”löŠ~9 cW·¸Ž§vU°k	2YŽ».ku2ÛÐÍÕpiØþ*Ò ÇÇ¯ðÛ4ü%nûû){«ù•ÂrSH7u(±¹{÷Â™<î¥Å/_4È¡Zæ(ì‰ÏFìÖô”ìç€…B#¬vlå’ûù˜tÀ’QÌG¯ñŽZšóîÝÄÆïýŸ²­¨eˆ‘™~pË¢.ÏøMsÐæÃg]Ç¦ã1Šä0pÚø°¯Jæ“]®`K™=
ßjÝ™Ìf§I_;!~Y#Ì]Ò‰3æmÒŠXë$=¾È+/6!*00¦”,«&;«PCÄc %^}Â[•3$žÖ'$¨P%.¶´ºÍûšvLb«TÀZ9[<4‹-­Ô€¶8Z;ÚkíF¼Q“Ô[¢7Í˜-ë‚Ù²a¶\%0[{\xr^QB>Ðú8èÀ{½$9Åº-²CÕ2¯‰Ø*NÕ!Ã2ñ<á1Ô`ŽÊg÷BUª!»éØ.Ï'‰v¡žœ¨ÙUàÚ=šî¢gëÍ‹ bdÖmý¼fÅbO#cÚE=“ßø=?±jöÌëâwdJàx‹¹Ž/ì}*zÜàÙ5IõU>x¹ãÆ·[­É-]3”€Ô#
§øŠS·“²|ÖæÂÚ9²¯ÓâBƒfÐöéîîþËõÿ§Ã Kôë¯|üŒÄšSß¯ÉñB (ïf7æÓCëŸ!nYo¥ãmgMÂ.'àPetQ¤Þã 11Žåp¼ ÓeG8pàn	ñH¦Q/Wî¥Ã_kÑ2|<d¾.;)v)Ô†©–oas“<‡‘ÝÎ©äþRñU¦½À'©Èjõ6 BCü4÷{rY]ø {PR‹ôÙ¬?­fœ^´RZ‰†?
ï‡’·eÏúm(Ìüó©ÛžqlÕ;h7¶hZì9x¡AZjxŸX/[8(;Ú)ãç‘š1<0ý‹Ö˜¹Ã|dF¦ Î‘†²tØds§…úWãñ¨}ÿ\©AÜ°HðO-Rx‡ëÜÆz#÷®Þ˜ÛU©(Áðçð!A­Äs>á£ûž±ßfÛ”¸³–ð;Ò8„ÎŸaúÆl2Ÿ·W›9V¬1 ÄT@æ¤ ”Ã²—³¤'›àõ‡ÖAè#rÔøA––‰ã’®¶Óæ·`F^”˜mp$¥é*!ïå*EH¡áHyàïÞÖ“éø£“ÓŸÓ@ ê|aJ|&iÿ;¦§Ë¡ˆÏöúÉ’^Š0ˆ…wÙÖæ®VÑ/åËh‹YÚø¤ù¾ÅÄì±©„-‰iH§Q£ÿÅpVnÉLƒÏ ±­æ­ÂyR‹f§ú™B—[Q3‰ç Š–‘#ulLþÖ8CnÕ‘£XpŸ³ŽóÌp1XÔÄÃ³"ÕÃÁÞ¶@Iæž©þx
_Š­éÂ£0ü’ddjG6„ÕÃn¥{-jÐvÆ¡M¢+Ñõx|Æ ‹´+¨Pè+ã	Ä€Â¥î{X&›dY‚çse5'X“©QO—Y&òd¿ŸÕyþì¯áû3=ñ=Àö¿¢´ê¹ŸDs•;íú™Ñôû‘Çc%rMÛN½µí$£ö'Ì[Ð:{Ã5ôì·¦nýy#¬J¢ZFiìP€%<±^ƒGmŸ‚c­“`Ån”ÈVôÆ»ü.‹"û2ÞJ\¯•âêRynnc±#Q0Å69ÁqC]^1Pþ%² i±‘E»<µë¹98íGÛSVéßãrðx^ÞNI Edtì
Óî1%»þr¡•Ä:®Iüœé¥€áÏ— {ÄÚ1¨ïzÞë1¤q\ÓJYŠ{ômÔ`Zš7†J…K>ˆ¼Sœß’ùƒ•ˆ¢Cîx…|"WêDKè•‚XÊGˆÍØÇsLÆS0ICë‚Â“(?n:ã¦Ý/¶Ð€–1§K¸8ó˜˜LÉM#ACkês\¡y–WýyíÖ9±Þ$¾x–+À¤œ]¬Ú@Äû/8šy´ ”6•É
Pñ3P0GôùËW^ çÖýìFÅÕñR€…Í5¨øé`Ðâì“Â~²”'U–d¿PheæÖ'YÏæ•z°—FÍ—õRŸÉ‘Ó£Ó/`ÍÒÀÄÂ çß 
Lhz!¤€K É
ÕR^Qá}ÚeÌ<×gÅBxT~'Hñ™Æ2Ä0€­'c‹;Êì:¥:¡Á|¨FŒ9ÄÍÛ$Ä*€€QI_Ð²¼ÉŒc²Ìä5ÊÜu‰º)¤^)v>ˆvÂ”º?’ô‰¡¼Oì:”:½°¹†Ì‹¥…ÁQðk¹ês…ÊŸ(P>ÅyÜøk°=Ò§[uªìj<}ïÙ1… £«
ŒnñÇ¤è'Pzs¿bxQ3Ò/u>¦ÇqðÄÊ<k`eÄNYšîªüKJ1g8énÇôbÁz£ÅïWÝ|u]ŽY1„bíIJ"Îž˜÷Û6`dçVQëí¿.¤ûÿ. à&®+ÄŸDT×B›µ Ä‘:7`¿™¡ïVå5SÅUrà¿U
bwåÌ23Mã¿ÒéÅ,™a—]o/ÝZw,öõ÷®a×Ñ+tG*þèÃ]¥¤¸«ŠÙ,Døð‹Yq	èÉªëR­ ‘¯òx4ƒ-#¼¢¥f}bÈÇpfdhoü˜}ú#üëv»¤£4úÌ`¿ß&…aŒÙ©£CòpÈ…°ä”k0Æ#:¨O7û™‡X(Á¯Âû)uîƒÚRk[@Oè_¬I¢œ4Kõœ©1­M¯l^`1›8Ïp&=še{'ªäZ¨¹ K˜vPx‘ÀFXaŽF\í}çijI˜Å+iK=ùmPLKÆëR›HÕ,Ì³/³ü5Ùþü8wF@Ù(h*Å¥Ò }ÛŠe"â"ß°‚^PÈ–­ÕÌÓ2ª¥Õ[Ë„‹š¸G|åÃD³ØÑs`7û4È7„Ë÷ý_ÐòbÇŽ;˜Ôe5Jƒš_ÂÙ~ŽÈ£óíìö3¯SˆíCÐaðòc9~®àoÔH{–—C¶îLâ
Ã ¤*Û89ÙXþqË¿\$„èþ'ØÍÊëÝ‰¤È¿
‡‹(OÐYÑ_SŒ4ÃöØKºùšÄ‡ä²ÅEIÙäm]»“`j"`ôyº«ËH†•kFÐe$‚¬W÷TÜiÊÜU/Zú‘Æ9Ø×šªÑ0Ìë[wìyMðPb†ÏªÅ˜ËÂª5‡ðYOžhåùè´d=ýÉ_æùY~9œIN`à4êÃ?ø~–ÞD?|NhŽ±ôÃ7>qþ¾àÊs¾ðö¿^L!•Å§½†Óã0ÿgÏ8tÿÅþÓ½úàÿ   ˆû‚W&.p4˜ +Ä|÷ÙÑK¬);¾øùéî?HëåºAaó¯~¶$Ñï£'‰Ì¯ø×‹ýãgOw÷_à£”ñ…õÑÀ)á£ûFø{t¸â*ƒŸ¯~?‚Ÿ/á·8ŽúŠlÊÓÃ>‡K NŽŽ_½ä;8ü‰V-èßÇø»\6à»«÷ÚwðáyÞóÏƒŸŸ—ÿqH~‹]²ÛÑˆópr{…ÈzófÝë7±Wá¤¦Ýsn0üôfÏ6xR½>ÏöÅM&j@0ìoÖ‘ljcä½æ›g‚(ÖSÿŸ† °’n®¯h}!åZ‡Quí#"ÁúÜ²QÆc)N¾ÐÓ zëí<ÈP%rh?.z-_êeÍÆ<ÿ¿$Ë^IQÁB/§S ´3á~¼y‹lÙÓé4ÿä¸tüë1'(×vö¼Ub?e ¡`àVGîèÓê€:Áï›cè³¶9=r-H–ÚÓG;½ë‚#`ìF<$ÉEœâ+è#.Gn(ŽÙ§e÷êD;+Ñø±a/¢}õx¾&þjÞã*‘^Ó(K•ª«Åh‘
¬ÔS÷Zb¶i‚ì’¡;m	ÖsWlb2ßŽGöD=¤ ¼Ã3ÛÙ·×ØÖük`¼¤ªû!Ÿ´‚ÓêÕøõ¨ü£­á'g–äfã>('DƒtZœ—£@Ÿ1oSÂù‰ì,NPü\îo67_:6?/Žw7÷@r;‡›Ï]ÿ‹êR¿¸EVÜ×Î@%icsfØ=˜&úî (§š‘f^¨Ý&<dècÚ;þòÂI1ØˆWRAdZîYÐ"·Ì è|ø’>–A£ <aEÇŸ×®j?£œ¶§sî·ÖAórž¢ÆžÆ£ËiÆhI0W—hÚÒ‰_Sñ8W™@Ç€åC‰ÚÐÌp|é¾r#+G‹jVž“nñSŠz¥ó¥6<šB1¡øN´øf„½×w ^DY«5ÐÛfÝnÁzC+¡‘EÔ"g÷UÆ‰ÎkO…bC?7¥NW’diè›¿ŒÁ ¯ä{ÀÕ èuSs2íQÇuq@³hŠË@Zv¯¡»ÝjXºu¸ÕŽ)EÃ×…Nè‰‹ì}AJ5xzãÞ†jÏ¨¨BËß÷µÒù ?ðò1]HFÆCŠ×rUîD¤óÄ;°F²V3å™AÌ	Go…Ôƒ·ì8ÈXÇ&4¹.×ŽO<	ò£ cž)ãæwzÆ˜ÏÃæE¢„O/æaI]}°uý5˜³¥ÀkÙï`z]û®7@0ûÂ¾¦	Ý¦Ý¾©hz¡/ûÒÞ@’„~aUa/9êóq¸Zí·b™$o=SÉ~00Hæ¡Â'rg¬O£Õ\&^ëF¶ôªL ­gõÐZ°æ~ÙHò¦AÓêtÎüQ£Zƒ\'ò¥ÝyÓíÒjî";YµÚoµKƒ²‚;![Á®¢Ì|MUE«#že›zÌGý=Vº³V‡·ÞbM_é¤ÄW'Ï÷_ýýhïä÷­$Dì$Þ>ƒ·CyDÉˆ,ÙuDOè0úK’]:™F‰ÖãD³ˆÚ˜?ÊPXÚ•¦°$èùöÍ{P2ÿnòÈÒÀ;Œyìk}M×šjÝ†ÐqØoNEbj'çÅ]h×ãl3¾qÉCÐ™ïÞõp¹VmŸª‚$®¸†'ªWâ3
È@sÐNT‹àùSo*v›i“èpOäõ7ÅLà±vW¦v‡Åè|[íŒR&ã‰jrm½gc++~°Éáå`‹..üíp©ë®ESÙ¯~ØÅ=Æ›h†ŸÔ°Æ+Hÿ0ÃY9…x<»Y+ÎŽ# 1æ2»4tÕÔ×Aq·ž/¸ùÓ6’Ø
Þ„hŒ¢ãÝNÕã=Æ¶ÕÍÓW¯™ÞÕ\±lfËÇåº^ó\{ù°qëÉúu’UÎnŠO	ŒXl%‹FwDÙ¨›k‰Ã>´75Ógx*U`2fÊÆ öØ¸»% ò ²0<B6?ßF– O,¬Ô¨Pl>ÑÅå©€yÄþ Û¾†ù¤/O¶u‰ÏEªŒë?˜ŽŽp£á²¢áõ“T£tÖˆfÇ@ÇýÍ[;h&›ajñÇ$BGÍÄ>Èh¤¬ïRîÃvö~p¶6Ku#§Sì
é—–®c,Ü­&ÃrÖJë»ÛV±n:«¢%î—Ÿ¼pì(]‡278÷u†´#°¸@¢ZžÿË­§¯ç;ááU?©“+üPVa¾NVF9ý9‡Û@alÇü*j×pÃ£Ž7÷ß¾)ßB¢9Ì¡é8K|¦û&æuË´¿;‰Ái¼£<I23|-‚”˜ÙŠo?»„°—6ßåÖÍöÙ#›LGÛP¯Äìà·àå†_¤æ÷¿8C>ÂTù¿c<üTANZmIÎ2”M§ì«ñ¨…&€ó«³áø¼µà,ëb]‡pOt„\o·Xïñn‹?f ØÆÈë5¼Ìpo.T’“¡QqãLaùûbSFã«n€ÉrâÁªËI1eoùÀÍïjX”œ›Å×Áò|ÄÊzµƒ,kèl:þO1ÊˆÓ­Xæ²0½$iuTq!B¿ñe-!&oc(»…»iµ Ð6PaI‹)jê°œ´V5“+#láZ=D=©77l%	«²!µÚ8^‰XÓ”àK+é™û67!Ov9ÉØRœÉ-/<ÙÈ?òì®{_·@³Ø=Â¤ZÁÀËZË©±:QÞµh¨¢Šâ×‹k„è¨¶3œ€ðË÷“eNËQ>ýt—“]ù‡åtŸŸ ‹®Ì¹V¥Û~ãûb¯Ž›I5Òfð92ËûX‡G²£—Ùÿ2æÄÉ;Ð°£ÏëÈ`8Ž°„kø©åAr1\Vê¥¥_bÒàX”´cª?À¥e¶ËÊwª#Ô`_áuèÎ–³!„ï–³õ*ã‘t•:‘{‡i4r!`GÚÈx…%’ö¸‘È ¹Q{ž÷¡0\VÀ°KÙÐqÕÉ$3pªðGãÑ†TqV]kS«uòrŒ;'ÜN4²YO,ítfRWž’);{6¶ßqðóó¬TÃÔ™€]·Å’ÌË!¶f¦·ÈŽßÜ‘ø6}XÖnešõð[.·“®ð€p‡ÙÆ àÇ@G(ªJädtµÒãõ­Ãaˆ‰®ºŠéó|:@wT°óTùy±9@³Q1êâ‹Ì<ÊÕè#tXèÔ¯_î={vpø«¬)¼'use strict';

var Type = require('../type');

var _toString = Object.prototype.toString;

function resolveYamlPairs(data) {
  if (data === null) return true;

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    if (_toString.call(pair) !== '[object Object]') return false;

    keys = Object.keys(pair);

    if (keys.length !== 1) return false;

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return true;
}

function constructYamlPairs(data) {
  if (data === null) return [];

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    keys = Object.keys(pair);

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return result;
}

module.exports = new Type('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    8ƒÌ«¼E¤ú†‹ß2Kc„kˆÉ.K/ZŒ‰Tno±ÃxÀ*x¶t>	ö_ÆÌuØ@b°ma5C3¸ˆÀ*ÁEÆk	yO’˜›ŽS¢-‚©C ö{YšÓdÇÒìÑ©7$x5¿¼ôWÄ_ÙýÍ¿y`~aOßËÍñ%;	:RÇ$šE>Ï½þðæg÷þÃ‘ûéÍË÷X¶×çˆ#§g¶¼§9˜àò·áhÛ ÷ÐÁ§–´œ çÎÆ²0ºðß7àú³ë·¾„Á²Ìc’Ë{Þ×zTx÷Ø@/Ð6´d€õÆ›%ýªæ{8Ú#Kô“\ZÓmÜÂù_0
³Ž9£‰‹1Ìÿÿÿÿx+™ÉÍ,EƒgiÆŸ„«|d‚8®ÄÏ„c#%cµòÄ¦zòÿ\û¹H™R³=‘a¢©~ÊÉ–ªµ¼ß¥nVk{-Â¹;ÉÛQ‚tu%ï”ÇéÊ–á€/˜¥«átÜ¬(N,Ë'_C"N&¸†ÉI#-ˆ&„šjI]‘2|Va‚q.	þ¾Ÿ}T_Vóõª§é­Í¤¸9a×égÐ›6y¤_ŸµKûÏ,Îš_ÄfR­)ö(£k×½0ŸF ÒH%G«à²°)/ùË×¯ŠC,°à\—þø!Ð•à{Ð¹ÓlI‰˜Àa64PjêwÔU
ç¼’UÔú6á=(<VÔ	¾ôUÈxÂ´Ì©WÜ#ü¶4u¹<èdÀP"–aWã±æñÄ¾I¦Gö»“yÅ†5ÇõÁ´Ð—ëf¥öÒªŠ¶…—ry¡ÌæõU<ôG' rkˆbh¤ªðçLûmî‚)j’]Ôðœ4K[z¦)Œ†Œº9R[|e¦·*	™{*§
Wuû·à:4Í€  ­ˆÄK¹nzŽ`Ñv .£™ŸÊŒ#±ü$^ô¢ˆ‘õEz—Ä©×Žey„¼rXŽµu1ãt){îgI"D3à<âŸ¡	ŒøÓP,WW×îPKEÞHaîÑ8$<QIöV‚ÞMçVˆÝrKgÎ”ädÚ‚6h†q„7ú`x3úò-F8ú7ñj…(Mê¾B™º¸c\òw	C>aÑ{˜Ôëý‡7ïºÙË#’Ý Ä÷Ìí¤ÅZÏoXOµññÍ§ŸÒv9ƒ˜jCe)H<l*o™ZEk£·=ÔÖ+D/õ™3\óÔ6jsÏ£ï,^€"³®%\’[®¬‘9ƒ;üz1Ÿ•‚¯ˆaøíd§2?'½:Df—3Yƒ­8¡Ó@ŠWÖo($ØPx]±âk¸àÔqºü_åæ#]T‚€ãŒòH#‡Ÿ`M’×Åz}³yªpoºù`gÁ›Ùf3KÓ[YgžÐaÖÉ…é$aùyÅ
-1Î¤‡ÈúuQ,%³‹o†&mª·Ãy^åu¤!(ÑX…æþšs5YWò1Å"’n‹¾Àh4n$j®žsaØ±ðÍfpšæFÁÅNJåyæØ?Îþg
R‚i[ð—Äï&HULÕãâØ¼Ÿ¶Î“‹÷_Õ
‡(‘B/ÞÝ¤¤(‘ûî;9^½kØ´¬Bè¸‚	#²/(t {°†’)O¯9Eù„ø6@5èÒýu¼¬±n3t¿ü*	óèð|)ïVP©»&¨ë.ëéÔÓ¿<“†Ãáqº‰á¿‚„‚!ì	¤©2qˆ4Bd?!D_ý{5‘¼¾ûÙüÊ»è‹–èÃGPJÓÚT“m¢•N1Lðî’Nƒå$$ª!æ·ŠÈ0´Ã%8"óZ—¹je,Ý=§!v¿Vœ•ðK™:¸-ÐÄÜèBµeX³\ÌÎë&^óý’'—ïð©`±U¾+ªð‡ßR9#èžt¶^&%k€%1Aá¦+£1Ì8Š¾,;”R×:‘Y.@=o‚Ý^œ¾Íº(³…®y:Qº—Iêw·]þ‘=Ä±˜ø¥†¸Ur`ÊOÎ©5÷À
VÌt&çdîÇP{Û˜Ë’YëÀTÇN.§ªus
,â…\põÍ@sZÐØdêZ<²ð&½KÒi„y7˜,ŠDCf÷`#£:–{ú‹ÿÈi*}·M(‘[^Ýì n*M|§iÛ”Ý7+ÐJ#ùô ¦X¬Ò²ä"^Ô³*üE$¦¯c{Iñª2Š*1Ú©-â¿6
Ä	ÿ É».uÎ89[c “Í¸ÏrÒr9#ÚQN*ø_»Œ$»ŸC<=ˆÜ45?Rðª„Ôðvƒø½¾˜¥:#^v'&Ú&Cˆvs1³!ÑdŠ @7<å¶/5‹=3ÃPnþ¦cQ%1Þ ckÅ'­XsÄÅ5>jJš6œw[&æIÏÌ_ dDPE>•m…
±ÊAÿZCaÐÙH™HÕVïXÏIOq‘ŸÍqb )Á É¬ñ‘Ââ—Öà*ch¨ã¸RàBKJ‘Ù…Jý…EÀ¾&ØÖn;jƒ¨Þ¤9˜ÛDíaKR
:>Æx¶üð¶V—$žbªO¦Š/³‘›-„ò'm˜,]èkBtŠK™#Ô³ŒèP1	¬oÎ×m¦©1ZZŒ¹±?õÂ1G’“k9´
Ø5úöP:«_ë¨BAÇZµ¨Z‘@(ll*D(&h±ZN‘R…·vÿÄ÷wcu›´+»i”(Ï„èjð	mNú.{å¢‡<‚å$ÚÎ3ûU/ÆM±ÇakÛ$Œkåì{à&0~ìœLšÞä#¶WTÝÌ5v5Ë-›å“hG nFncVàyþû¸!s}< ãYnbþñç#÷ëjµhF{{˜?œøÎ=Ty¤y¹7ÞÛßöÃþ“‡Oöö?ýáÉÃ§%+ôõïâÀPÚÏí”Vß'T²ã´ÂÉt (Zcq¨ØA™Pc²g¢@)—p=¹_£K}QÏVJ.'¢0Z–z¦ÅêÁ1ª!±òuï»‡ógÏžÅ¨”Ê›®ætºz?ôž„ÖxÈ¼h½'ÂÖ,q>"’œOU¦þsF“¨Ð½
`0À_ë1'fñK5ØZ­ê™y…ça˜ú­&Û1·@¹ÙqÃ‘Azu‰	Gæ Åv°þÀü5 x½×‚@«°A(âð}ŠˆQä]•|„ Š”q’Rˆ(«Û(†«jóšAIÙd]$qxu¿VÔ
4‰0ËÇ? BC9k:õìó
$½«žFò®¡™­1oMÅÉR(ø-(2óOµnîÐ<Ý;Ä´EÈc½Ð_ðÍÈå„×|RJ&Z¸ÄƒÔ'
ÇƒgÊîÜëWâ–àØ1^N¯]S_®§«ñ¬BÏjàÞÖ‹iÅ¼o¯Y{èôWIWH	¶ŒŸ!q]YÞ“à"<½|ÔN…ÈÇ°a<SÂ{uÃÖŸ&õ>õªá¤Oµ¢Ñðw«/wC’`Ò÷ÍÍLi³s¡ÒüÓ¸€| Œ‘€“ä×¬¦,KámU#r‡}aœ;‡ø s”ÛMæ–/ hk,_„ÕŽ|Ú"Põ$S å´ÚÇ¡oÁÚÀÉ~|’ó9½ëÛ3.dPÝaE0ymé$X–Ð÷è¢Á¸‡`‚>öCÿD¾kÂcè½3·‹	Wm\¯Ô±n³ee,3#ìnsDyQ	µmðL~§ƒÊ@¬¯€WoÖ•ûËþÃ'Üƒçî“¶\÷ðÇmâq%
žaÐä™4nBþbj¬'¬Ç…õ)ò‹ñz
èåž¸ýïz–z¯ÚöôñdrzöOŸíŸNÎ?>}2~2>ßöhòôÑÙé÷Õ÷ûûgû÷¦õé¥žxÀÚÚá?š¿¼û~ÿQ@Ýž®D<£#Gl«a¹ý-2`˜EnÜòªc0õüšðAF›™$¡~ ‚4Õ—+FÔÀÿáÄŸ>}¬9¤­i†>°åhúVÛ¿1Á>@”¯`pJX&u®Q1°ªf–¤1l×«aðÞE²ÞWåv0h!Ù$’¯ÌJI¹Ë¾Ò°)F±pðRkE‡Ú(=µðˆB#ÛÊá‚0.cQôœÇš8€fæb¾€¦úàgãNçë†4À*ßã-V†D»¢ÕÜ K9R¡fñ«µT ôIx„6#‹ÅgÙ4…ªîß/ËEúÚ©«ú
»Ï‘R€	„ñœ{†Á“ÅÖCNµ¤l†¸@dŒ’zÏ0ÿŽ¨•Ò
x´xÂÀ¶&NzxÏ€’YÔQÂ÷:iÃØ©êøúÒvÍg²d3²ÑüŸ¹›ÑªäÓAv–ï;ˆ…ÙÝ:¥8pwSðQS\&êÜþ¢QÙµ$º•o)la|KÎg(QÖ^RS4µ-)r£8C^Ä¡O«DÜÙ>q(& «h’¶jÔu`•„HN_‚–RT¥”!ær>_Q†¹[ì»eÏbt…œÇF‹8
ßéÒ¨‡áNU³9àù‹“Ë‡íÜs€…¥¿ñ#ûæ@Þ^LédÔ7T¤ä¯•W‡$P¦2¬wÇoÒ10©1µwÊ&±úÊOq?HD¹±”1Fì¿0Œc¡˜à-ådªIâB_9Ö…Š À)º‡ùåû›žÎµvsÜä†Èãp DÆŽf®íãY°uƒË\˜ñÎ!M¿’â†7PdÇT)\!åQƒ•Äü¡ô®\ÑGN!K/ã¿‰ëè×†;ÐÌe\›ßa>ð RÍbH6ÈeáiTÙ¤-pº²o’ò0À1þŸäK\&|$)k7û~ZFµ½lè²Žü9v[Ø³û1?o™nÐ"Z[fçZ[ß¨‘‰3p=i*Û Á¥ƒq‡mƒÄ\§çi±t-m1Ú0ÍÁ/-¹}æ2)nIÍ×!XZjªqk!çò#´}1Ü‹%èÉæ¥[ö±¥‹»HÝlà—˜3dŸõ§—ÏŽ9À[N´,r˜ä`¥ÀT7ïêÙÒIì@ &`3…÷Ý¼|aG ƒl,hØ‡2m‚îÁnW9äÌÕ%p\XvòvRîLb/xpj)¸82þæ&BÏðpŽ²„ñŒÅ	H‰=¸B¡Ä‹©– éþ2ZJ=Ð­&†>A4öW_^V z(Ûá{8; 
ë/Fw¸8¥@f ®©n6wÓ¹/ºD%¦¤1'Q{V1E1au wÉ)h+·1O dÃz†éÄÀ*Ô¸1m+ÑFýA§íxËf˜^9Œäñ	kµRúeÇ¨È5ÊÂ4D"8viºýBEšÐ–ºëÅ¤­.À–º„e»}µ)…wÎé$)´ÉŸ*4rDWaŠ?é7ÝÓõÅÅu7‚,õ9Â³:ð`EÏl$
2¨Ëñ"¦ÉÂ
ÑpÝP¡OªVè4•tûòés’-´ÏC’õ4ycŠœ3cïÐþÕZ…„D§ëz:y]MÇ×â?Ÿ~d›(—"GuÑöêc<Uþ8mã¸–Õr=kiÄ5‹ãŽyVàAÅïü‚F(-¶jpŒS­šÄ„ÛØsJ¯è‹aýÈ—Ù²f§7n~®MQ<`*³<à³Ùå¶˜6PÞÎŸ@àp9þ½—|d·bÈøÇ!üë~1¡ß¥ž@(©¾rž6½ú†¹Ùj
c BCJmsÖT0+[Ü3€ÈG@èÑŠÑÂ5:±4ðIž7D¢Û/ÃpkàiZÑ(@uéš¦ïœ`ƒÂìIKKg™MhahX¹\PkÛz‘`ócóùä[Ä"'ñ(<Ù¬$—Qc™’”ËùFWº/g/Ü«õT-Óká’ÙÂ "<¯e~¤´M\†ïVd;@”­G4é’~Ëâzº¹ûD¶Ïa“Ÿ(Æ¹é®¶‡±tx7ÿ–£š}³–»„vzÖüvŠ–gú·GZ‡Z	ÆºváOÈ ó8,û	Ž¤„"[8M˜Ó?ØiƒU¸˜ÒP.+ŒEÖ-Ô)à¡€„~œ/ù|}ZÏzm•—ù7»Ñ£u¾LáêÏ›#®bwPhß!*› #…îÝA±Ž¯ü‰ì±FÑ"Cÿ6þ(ß¿îÞÚ:Åƒ”(PcÜ%w³ƒuÇáó°1§R·Sðˆ,÷¤6­MÛðîñß,»}Àaˆ ·¢Æd .ï’¸iÃ=p—nžïS‘åL÷C²Á}Š³/7#w|¢/¦X
›ùÌ/”ŽãÎì|™g%fšT%+±o¥øõ<¨tAÔÚüV/P=ìƒ-Ÿhm^Ä*éX<X¬³ :üºXV–MWG|Oç$`†¾ñvúí›ãÇ	Y>ÙßœÅ@¬½f‰î¦Š—À¯K°!9~ƒžnR 9çDs|ålrº-I­60=«ßñm?o¯úÅªâ¾YÙ•ôÔÖ4²Y˜R‰9+ÅLb9L9È–k«8¾å6’Î‹Êµrð@ô'Õ
‚6d=l;g Q\o¸“°Y!]Bí"¾2®(‘dÔŒÒ÷á*ë©®š˜OÏ3®98;‚ºU=K9E‡Ì|Œ W¦žÏ²’<ÏZÏÆÓW`d\bÝ1,b™áÉ&Ÿr®Í„—&Ý¬®²ªtŽd3ÍozôiµP{9Rû—"mŸÒ¢Ïçp6¿êõ‹$SÖì¤óïÿùþõ;Îª˜°WõÌ£®‘E7øÎ#7Êpn¡z›mäShÈ™øPÓzÏ§Óõâ-‡<2(N=Á¶©ü¢ppÒ­w7Œ@íEpž¹Ð#[¤e;ÝQ¶Ð)êhˆ×v~]¼zì0[×2c—ÍÚÝuæ¶ú„N—A(ðx9/DFêh`¸eÈþ˜•Þ¢Ý¨ÎKÒ"Ø%È8ÅÛnS\Ú÷Ê xÖÃ¿Ô”âû¥j	A©1YAV³¥¢ËXP«7Ô¿n6Å9Pßu+\æ„Î^Š/&=Âù`šS“V0ts„ÿÙ ÛvUÅýAø¡ÿ·A5+?œ^sqwhøý?vfšzUïÊ×.‡VhL:Ð³¹ 7‘iRÕ&Õâ-Žgÿ”Ö/ÛQ.ñ·Ù>nZlëÚ‘oÙ°OúiÁ"[4úpfH™1¯û E©Ê\Q™Ùâcšq›)ù1Ê ½[V6šåü
¡™b‚u_gàKT_¢%¸^€¬ÙºÓ5èH»E¸ÚÛ/]ßhSÆdOò9²Wow‰6¢“.9JèúÂPÛL=Êûk<#ì`CïÚm6-ÂþBÜb²•»A¡Ä è=Sù¿PK
     n“VX            *   react-app/node_modules/rollup/dist/shared/PK    m“VX¶þz@í  s  >   react-app/node_modules/rollup/dist/shared/fsevents-importer.jsmSQoÚ0~®ÅI}H@4	h!ª´=°©SÑ* Ï‘ãÄ±#Û"”ÿ>'P–mDQŸ¿ûî»ï’°K ¾ÎP$7%DYïvÃ`ŒÉÍ²”=ôá•0ˆCˆFÓQßÝð}¾‚;`j»å¥ã4¢Ãû(š<F£ÁÃcŸÒ1b4D6 >D“qt?èr“[[˜in¸ÍË4p¡nÊžY @j0ƒRf¨Áæóç¼œd¤¯4ÆjÎ¬"ÐÂÚÌv(­‰ÿÚ=o¥íLk¥cBÍA2X—’Y®$E³ogœß£óÀêÃù­¾ü#d¸¦¥°Ó%TðtO]ß¼a÷½µÁæÈëtâ&·jžŒZ–ƒuõN‹õŠ8G‰õú™^‘0„¯ŽA°ÊyÀÍá{î¢)—ïÈ¬3ŠËƒÀrõ‹gT»ÁdH.	´ÿ5Ê×à_Ò¹¨´¹VûëFÖÇm©eËöŠ¦¤©½ÇV
Ö½…ÝÛ$y}[Ì’¤þLkÙ3–K|Õª@mþIU’ZY•$S¥½&Ø’
´'Gª,ÛT‰Àª¥û$äfE7=8ÂŽŠ§àÍUV
ô rÃ!øQ‹2Á‘ÿ†â¸]ÏÛÛØêŒ*5Ã9-
WþmñòôÉuÇÏdî¯
¶´ ¿PK    m“VX{‚»B)|  ~Ú 2   react-app/node_modules/rollup/dist/shared/index.jsì<ksG¶ŸÍ¯håºÌŒ…!?â€‘#Û8W[²¥’œMm«ÐÀÄÃÌìô`‰‹øï·Ïé÷0ÈJ²›ûå¦Rê>}Þ¯~ æÓ!?ÆÑ˜&ŒÖ]¦q¼Ì‚ßùú<ø!xY{tµLä¨Eþ&äèðè99|Ñ~Ñâÿ“Ÿ>~&dœ.QAèxôrt>vxøÃ«ÃGß¿j…áKJŸÓñG”~øÃËÃgG­ZíÑ¼(2Ön6gQ1_ŽŽ ™#Yùƒƒ\Ò˜†ŒNÈ2™ÐœsJ>ž~&g‚Í ö´Y«/%¬È£qQïÔjã4aH—äô_Ë(§^=hæJ¤ºßQ`böñãÃÇ-xZsdC,‹(®€q°p¦h¸¨¤æàÊÂb^EÏÅ–Z<MýJ“‚.²4/hî
ªf"9½Kægö:±àj_ÃœŒçé—hêõFëuÊìE¨7…wM.i8	G1%D°»à’–Yž."MWmóññ3Ï"î0a1ž5	ãêAã	œ©I”#…ÔI9©uÃŠ°xü¬
f4XŒpGUp±ÈñÇ`ÝÔqTÞ|Êãï)ù±XetB§d}>úŽ‹é%E¾:M¦)NsÍ‹Y_qOfvLM—q|±==eÁg’u7(/Ûž~Ï5|~‚v ñÀLÂåÓM¥í·'Ÿ~BÅÔ÷êJ	—½w?_^þ½wÝ»¼<¿¼~wþ¾—½“÷ïO//®K zá§óË'g×ÎÎ3W|YBoÈ-¼~½÷é¼÷és½Aê½‹ÞåGüpòî]ï
?Ÿ_Ô•Ä‡Ú>NÏz×ŸÿqüL£˜2Mœs¦g@ã"Í#k—Ú@¸üº
´÷÷Þå?>ÿ÷é§Ÿ4pÇzúäìÇAº¾æ¨¡9h¸´e|Cíëû”æ‹0þ§7½<O!x©øy\¡Í`2çyîP­•þ"ü­AQ2^;¦Œ_iÎ">$4`Y<×Ôý€AÍðymðƒE˜y	[.F<ïdaÎèiRx¼t´}Má&LŠ·Ñ,JŠ}Ñ"”Åa1åbn—+ê&JžÕÉ“'Äã\‘cŽ†ÜÝ‰_  usœWrÜ%/€‚$‘ &¢ÿ¡¢XdÈ©üpLÖ5B¢)ñÔH·‹õe%tâó -–yÒ‘0é”X õé2\u+g;µÝkMÝGÚ„gq:"];“I–½ð@ –D(d`–yø[ b!7ŠþIž‡« bøS¢ô]ÒYÊ¢"úJÁç†k"¡³°4Á­A<éa]-šB©Ö×^¬»'…èH`Lãy˜ŸÞ¡ÊIÃ #š‰ [²¹gëGa^×ò}ChÌ¨…D‰¸‰µ¶&þ­)F51MfÅœûÝ¡á 4ò*€-“éq‹+–.¨7{NËÆôÁ§÷4÷Aºlþ]X6µ*bX¸ö	qÈ¶“(Ï®°"ô¶ É„™4Å'“-½pç„ó”&%+J­yšmÂ“NC4ŸÊ!)&C¼Iz°LxC89à=ƒÂ$ !9‹DÐ&Ö\£È—TáR‰{u?˜!I“{)Bh›£ÖcÐ&Ó0f†4ÍŠy›µžÿüÕ³—Ï_©‰0¾	WìÊ¬fÒ±ŽQ—/m/ºÃvMé-yÉö”úRì(>òôÝvD
—EúžrDéÊ˜G³ù/!WÆÇ0ÿÒ&’BàC2~Î[zÁ™ogì \\{7 Bñ¿±Q¬ÑæT&¶€³#Â´˜G,¸6†%ÝrÎ°À@økaÉÞ»V—À|IÜ´‹i1O'’5Ñþ‘7ºClË–RPn6ÉÏ<E°ò‰æ’ITÔá…n’Þ0&œñ|0ôïLiž§%n<^òöý@gª­RªŒ¯EŽºØ'‚3žÑÁd-ù¶×6,¥S—Á¡‡¥ØExûZ©½ÛÖ<pÌx‹	æÁ=N%ãx9¡‹«¿…›‡–ú§?‰±Ç;žÿ=™‘®p@¨U%,ö*pUÒ5ÛÞß³4þJ=˜pðGLtØÚ«‹uÂ[ØˆÜš3áo/F·¹àÝ8é–Ñ½­*`k“:Ö'ç&KðÏ»>.]ÓW¼Y¾‰Š9(ò3—–µËØ7šòâ³·@s"6¸¸Œ¤	å>€Ü¦£687¡/¦x_ ¦·Yœæ”ã÷Dœ·ü¡Å/ìÎ„ú1ùuÊ˜ˆÕ¶éœ²U2&×°ÖA½Wñ Áb£UÍ[%A).”A7sp3o¡'"gÒ	XI•» •ÄD a 4°¡†˜Ñlyx.]+-+–|G—¡(`3jBX–©Ž™]ùD:Ü±Ê›ì
Ü\Ê¹²i:
âv~Xñ¡õoÂ¨ ¸™¥ÜGcÉû.c‚yWOFã …ÿ3†™$!åíAOM‰¶ÃïlÑ±w­ýÚ
7•ù^,ÙbZ CK‘×ÝRFÛv[4š[®-z%µ—~@ö¹³—$‘\æÆÍš»™ âU
‚ÿÐ¶é©OVÊše‚gÕÁ?32už`ÚÕªÔºè¨¹”¾ÿ“’Õª>—Jœµ9RéÅµnšy Ãž˜-ónøN¸ÝKlxžùÒ©dÉq(	â×NíaÁUÆ*77dŒ)Jlø¿69§ žXyx¯\ÐÊ¤¼)e_Ëû­Ü§ˆÆ´©ª³•`qXË­Ïî$–Ró;ß–ì:Mð$ÄÍÙ]¢:?)«Ç–íÌ—–Lè¢Û2	ŸR{¥ªª-8Ý–¿uœÕ*{Töfä·4J¤®¶·ˆrG'ëQÛAãQF¤¨ÅŠ¤o>¬dã`í—Z“án)IÛIïØê*ü½Çœ;w­Úv´Õl“	 h¼ÊAåP§8ôº	ó„7K°dw«lE”_#…¬Uƒ%lµWdDM“ÃõOÇ!Üw„¸€8ä:Lä)ßÍ)&:Q˜`?ý˜i#f0–63z‚ô“';,ÛÑZÜcîvÃÎ?…@A$*…_†–•e×¢÷ªhW­Ô½z9ˆ ð\­£”w)gQòÅFe‚K	®ë´ÀéF²Ó«ð--ÚÙJö{S7éW¬Â­š^*·‹žb! ¡¶—Whu‡fzîÅV©n# oB•šÔJÙ˜–KÈW&|óúß”äËˆåˆG‰Çq@ë†IJŒfåªª.UÆËœñt…¡+¯D;Ð„üú.ÊÇË8Ì9ÚEÌmÏs|Á%¤“6ùîñxØ|G2ž4¹-ŠÆN7ßýê`,Õq—<C'ÝÊ‡ò:4›Ð\d¥õy—óÛp»
â}%Q·	:wVõxdýGFÍb\‡fõNRpEð‹Œ¾¹çšL0ä³åÚµÒ¥ÕyfßÝXg»aJ»…Ê0l”æÄÍGw#Ú‰]¡Ä–æÞ¦iLC ŽÙ`ç¬8­—nRC8<ÜÃ&•Ï[—w…8ÍÊ^ê’Ž±$À¯Œð9Ñýà˜uw§3îŒ‰ØÇkçŒW`,ÌÃ…¹
D KøG+ÎÛ2Nw£Ï´d/áÇ2:Ž¦+ÍÃôaðùyéÀWÉQšh=7Ýßï\å¹‚{8*o€ eç:úhÓìzîîô Àt¬›±#¥pi¯8gM¨»£pü…×è	;§^¢QGÅÊÂã; c²íã*ÞŠyžÞXi®®dl]…R¯PÚåEù$ ?³pFÛZ®*üº*ÑºX—Vˆp¯âÊÊ0
ú#‹%´¼Ð§,ˆÌúv´t^·K7¿–N“¯aM„²1¡ŠgU\ÔÇkƒ;g¸8ö7¿šË4e y´?:5Ë€¨{°­Ná9†MùB&L¾á•n¹Àód£ßà“í4¬ÊÄæH©ƒ£&Jj–©>H¹¬“°ësÏƒHì½¶ÍÓ	ö´ÚwàŠØ Þ0·Î‚cYj„b¥r“A¦5SÒUÇ†*Ý)uKºw`åƒ…ñqK>lQ×­ªÙ0Y‰[BxÄ°¦·x ßæÚà#=Hkú¢à ÷Š¯+Þ1ýÆµ=žCËÁÓwÓ]pÌq šwi¶Ê£Ùœçº±OŽ[Ïø?¯äo<«]éÕ˜p¿õ
Òò¯IAÿ‚B¨º ÷…Ùç<Œb<]»WÖ óðèçêÁnJ,+R;âëî•´¸~ Äƒ$™¦¹GçŸ±] ID·™¹M& ‚‰×]ÒÒ«2l×krãÄ–|TÌÃ‚àÛÛU–…c!ó×™›”ÄòƒÅ!›ÃÖŸ¥bè‹˜@7çµ&±Ç|;¶B Z¾‰ Rqâ¹‘p
7J#
4´A&£t–›$Á"ç)K§:Mò0_5åUPsBÙ—"Íšaøìå‹£çß{_»_Yðê…„,»ý/#˜ÔX–óMÝ-</©Ûº:&Ï!“‡ýgCmeYñØKªºdmð¼±´Ð´˜ú-¨û
ŸýøC!¶PieöH7œ†ÝfÓÚÂm”0:cz-¾7iö›ƒÁp¿é+ñgF¿ÅC)`V÷áuv~@ZRxÍNëc½É¾’µ}!jC³.—&0‰˜œÈ„Á¡Dcˆ}ö…ìã<³®A¾»¾¦ìc:YÆô;¸†ãÅjI­[¸ò;·ÊWn¥Ç.ê±Y)T½0ó
Ê
ÑÁµeÐbz‰VsCN$³w¡€½»¤³Þmvg Ì
N”G@iYiò®ô{hÖ„hnuuøF¤å>,{ßûpòóÙçëó‹Ï§çŸàùÔZØï”'É[ye¾QÐažÃÛ;ì
áy
Êê¾”ÃoÄ+—6éÃÏ¡¥:ÙÎ–ß…fWÃ¤r_"+/N	æY[*³DóbTP‰¸”hMùŽK	[Âl=LZÛ›.	¤œ|×ò½QÚæªc“ò,G²‘‹aH#€PAÙ)èˆS“1p'<Lñ³›B ž\ÆY.O¬7&û¿VÀc|V	f`÷%tvQ'bêÁ7Ð;³oUxY¾êº‡À»·’¶‹Øn¹ÑSl6l^H³aÐ®£
žEº#×ÿa™ßÑP×2{Kè7ˆ¶8$mü¤·*r6õÂ«®_¡’"ÏB”SžìÞF´ÉŒ7âu²/KˆL²¼:)ÐŠT(?€m¯‡|`ƒºÑBI™JS€6„‡@î•wŸ°GŒ@|ÉaG~|m+[–9·¿ïFO"ÃÇZÐG@«Ì"6HÛ‡œ–	¹þZ¤]yí"3\Æ«¤x~§-Ò¼CÞ^$ã°@›§soH™=HÄL'¬l—„Ú$„dÖ'm=úÞÚX%KJø¦Ê6qïÊ·ãþNxà†˜ªùà|ïôÊ vdë¢ee~Ö°¨ÙûÅRås
ƒZËÓ.ÁËÇ†ž<|™F93ùºN§Î›.çš!ˆt)d¼)•a	µ!ú£I1 z/dÝÝ)Û‰æ¹B>¹€è¹JÖ@#\(áu½×
±2>Š¤“ŸxàèBÙ¶±â”	{P«Uüje4.¬zËÚ{b|x¡ðÀOzÛó¦ÀÂ›ùË™’ßÃ®€ñÑôïeÏÈb1«+ú±Û­¨	Ã¶tFã¾ewTåÙvð<R×ÊÖGµ«¨ÓªhËùòÈM’n¤²°[9µ3¸gÐêdógqBJR1è[˜ÁNm{Qp¶$½m½ÎœaDì€ÞPyp~a€ï?»xYyv!)¾}v±ž ‚IP5³fZ¹­>¶åè0æîô„Ö[èM¦ÜFé§]Â“9ù¦7øÁ×ÿñÍÞþÓáÀž|¿9ãª¤cäD—*uûGC}(a
rÿÊðGÐ@²}Á oªd‘5§&.ËÇt·Û·öýŸ;pÒÖ!]Û€ù%²sñšÔ×õ6©oà„ÕƒO>|êÃ§a}#€ÅwøÞÍéø‹e~×èüh@Ñ¸{eë*•o¤mMK£H¢Œªrp¤FÇqÊèÕ¿–a¾kòÝ’—sð6g{Žÿ¯àxÉ’^¦:,p
iw)Š!¤ Oë[M‘Ýþl¯ƒÇeríLîÍþ`ìûÃ¦Þ)IþÃ0o©"î %®Ø]fûugT°‚:´Ä¨DúZXÌ¾°¬°èáÎ§ÇÙ‹T²ßÜGáx›À•%„ã‰¤4q¼ÅOåÍ;¨°SÛ¾½-a+‰2lÉòr·õ˜²ãï¶øz§Å7–ÅËøJÒo¶„¯b¢Â~RZ§VÂØ­S¯J§N@·÷º[áÌÁ •V>“ÖðËÖ°8)©ÍßmkÑÿ™5Æ¦üN; 6ï,mºØ*Ò˜™,iäîÞüµ‹C3nø±­û ûj$šô.+H‹Âƒl]Eãßjñ67j¼Çþe[;PÃÓ¯ \ë+"r¤KŽ:Öd–tEãÓCÜ9ÊµEÀ;»’î¨:Pé	®"i€8¬ò|ù¡Jê=KèJmnªÞ8"†ý}{STÕ±ŠûÖ8¼¥“ÿT_÷ ŽªÙúf½ñ|ÞýáèÿÝå/q—ˆÁ¦Ù¹¹–cÀ‹>ûwî‹»ÉÜé€ªó—ÎlmYÔ•àßÍ£çXIE2y\=-(MäJ‘V$ìðé”ö†ƒoé¯EºZ•b{§«)‹nßG9\—þ
G ßó½&b²#qý‚÷Ü]ç’èoè{¾ý}IïÔñR·.@BWƒÍÁ 9Ã4¿…»ú.lOÖƒþ0xÚlx„>n
0Çh…{ñÞõÿ9}O@Þ<þ»?ÜìKXÊÆaF'‚‡Ú<¼ÜxÄ¼ÏWm†~s¶}¬ŽuùO{øÜœç:gÁúr´/¾\GÙ[% e]ð”¡{ø+	àŽYI…å¬p9Ì¸vtéå°ÊœýÊ;±h–xkRbA] KÊ-JÇï@‘Š4g®s–egUŽðä‰“yÂ'¯Í·ÒÌYGN¹›Œ©§Íß®a8šMqèÆd2q +”Åàõ"œF‰å'ã4)Â½»Hþ5¤Nð¾ÍÖ~W0`ÓÏrÊhþ•2ñ\<ýH;<§êeÁ=‰°Ö•‚sºH¿Ê×#<|/J¸A¥s°Iê¨©‘2’!{ªª&ƒgÔåéhe	X"/Â@ÔùNR^Š°e\˜Ìa[H†NƒÔ·ì7ð'ŽÄŸûÁ/%zÚS=yšÚ­=’¿;M
:_¥^.Äî#'Gã0dq‚Yù‘•gÅÛYƒÉãpœ¡G`°˜¬ìd©þä„(ßF/ŠEÆ­@öG4ñ°þÁõ$ÁïaƒƒÌ©|&‹/AŒL¸+¾µ-¾ÃŽÇÚøTàÓz\?0Eð?LšÞŽ)°³þ$\(EIƒ,Â[xÿEá›Ã­‰aÒwìÃ]‹JºP{[&üèŸUSá­_Hÿ+# 9 ê7ŽÏ'Mõ+0Í?î
¦ËVé¡[*A%á×’ñ¹ÙˆòÜB…‚ñ•Í–ºÁ'ñ€ßÅéøKû¬CËn¨%¸*#&ÙO†F;0b¾§†õ‹Ö
3ƒæÜá:ô‚õŠqlöŒgf„AŒž@CKl"Ÿßí[cÌ”Ñ"×sŽÎ/e}ÃjÙþ8ÊyVJbótOà_$g:ôGÍÃX ²-[È·ˆ¥+ðØ>j‚QŽHê;<U Ã_¦9>&‡Jô<LfT‰&æP+ç#ùtØÑƒÓ>$[”uÚº‰‘T‚²
 xpF)]ÍÑŽ<TXË$]¼ëy{Öî´ne?ßüŠí·@ÁçöÜµ
!.uH“U?Rì´=¡®Ù˜í†
.&-æ¿_ÍC£‘¶x8É9_ì4F£Ñh4’(g0Òi)×@d!ø<¤´5L$€í¹è¨ÄUÔNŽD”‰¼tSæª·l?¥cZÜMìŠ2òvf`Î¦G±Vpï3Â×5KÒ²S1Œdž¨hRr¾©ƒ·×´+…ØœO²÷¤Ùf9qœ45if§*›^,¦××L*­k/T`še€)ÈÜ© RcE0SF%3=…¤××Ð¾JÒ½ô'ÌlÇŽ¥•¹é™ó›	Æ£@ì“Ðo·œg´Û%õÎÑö#¼ÅàpGÃ14É#€p¡36ƒ°|Z/,10Ýá¥(a?+ƒCñ‡X!}×±Œ‚?'FÞñî3"’÷GÌL–á‘ á_ÄÉñ^ÿ“[6’Ë¤È& ºVR`IÈyl,’_CÓÙºS7ì¬#:âîƒ0îoa¤ë£:8S±ž>0eò,òùüFˆ'{_ÛópÑës¿áÐMÞÎoßÎ9èZœEJ¸=/qÑkÍÝ¦¦ä·BiD§ÜTÒ_‘ÙÜ÷å0\°\Oé–¥P¸R2®Íâe :%•XŽ•›NŠX$rQh¡B¸8j<ðÖ1ŒÁH\)Ü&§eÆvå»f«×ŠãùÇî–“Eëù·p‚Ú°VRü€ì=ªÑ¢öÃ–HId…dÆHKÃ”bi­'~Bc¥K;c>Ù›f¿eï÷P¥G{ÏB`4Ä¾½²Oþùñ}BJMz2®‹DéÍ' §Ôìøë©Xl¶Ã‡™¼s/‹§k©'r¶÷ƒòä¤Ï“i¨Jšn†¸»ÃÛ1!—X^SPéáÐHß‚„½~ªª	£LÝ‡ÎÏWÙtÂn­üMqJà¡»S±ˆf)G(‡7iÆËak=¢È›Û´<ð”vn{mŒ86€Jº@šye~-ŽSêÝ4½@ Ia¹~}ŸÁT
ý\N
õ†ÁþC¡	ßDyY‘V–ÊËX‹×ó$½ŠÈášØ³wc9ÃbkÌyÉ#e»ø²jmÅÒÔ}Ç{å2¤¤e}ÉMßë\&³Òþ¬˜EØ'•ŽQ¦¬7æËóð‹ÇÓ1<œýzÅÝ¡X–z5#IIà\~häŒ©Ü\Ö+ÖÜÂ’áìE:à
üuŠßv€ÂHÖIŠSp^<ÃãôRZ1\Z{‰§;%
©önP›Êœµ4Ø!úª¢Ì~6T¶©ô8;I•Ô’µµ‚IµÓ˜Hywj*éCŽ™x¤{û0Ýð6•&„]L$ø’0T\Á´T!ÚÄ(R¾¿0«¦‰LœLU<LB–æYXp7rM©|7$[ã–o—-¢{+s	³É½´³Š+æ†„–g1UmsÌ Þ:É
"mÜù2î¬“«oåd]ÙµPö^'++>¬Ç«†f¬W"¶ïÎÖÐˆÈä°fUŒyÈ¶`gœñè¯Swó1UG
ö
öŒG4ÁfL–E,…å‡c¸Ú€&Ìµõ*Ü­^ùÙÛ¾Š×Í±g?T%›¦©.i¦:l|úñwsyD`GÍœzŽŽ‡c”îKáß<Ý4ˆÚÂK,¯'oÇóÓáØ¢Á’J·MngúÞwSË%‰<o’€zÔD@Ú 2ÿyÖâ¨•U„/VD`¹iuËFjP>5NüEši*Ô@ðaä¨»7qˆkqkªUD¢N7Ö~£˜PE3cñJŠ©ßåÛPw¬MÆšùÞ(L´ÂÁd3Ÿ08íY½/Jöâ2éáµ½Y“ÛžÚ•ûCÈÑÂúDÙÒE $0²ýO×„4›$ I²°¤ÖÆ‚¬›SIC³ú0†eMÝö†‚:¼%¸ùÐ•‹HRÁ¤É¬ódª¥å6¤a­4Ý<ˆûŠ§ø‰ì´ØÅúŸ@&Ÿ—R7úŽÄ*qÀÂüåLK.¾-0cPªßåÑ:±†ŽJÁG‰_¢xç“£×¦ãž™Á]àÅhJ~¥2Êá~Æ[¡ªÎúi”Ým½8‡àà]¸ÝÚÞ×—éæP<œ\àŽdUz¢˜¹5Ÿ¼‰L+ì!o®Ò–V>LélìÛf,×`Ñ‰dM³?W
Uee1”#\2ÊŒÍ˜ôÿ4ÃçL¸é¼T‘U¢!8<õ«»ç Û1Mr&ã_ ñöUÆH³	Øß¾¯!±?Üõ·^$“Cü^ “ ÷(T…?»µËRCññä¦O^ÙtÌoÓñ|x3Ì¦Š ),½DÚ¸!blÊŒ#~3Í×ËÁÛt Ê=)´C(æ©W.íf4$nÂN¶»;)<„ÄÝ’N§•„æšál2®ð½
gí'ãØ°Ñ~w-ïàý†+ˆÝuŽº`7 Þ§l@Ü=Õ`ß$ÐL`þ\Ùt…ò(BÕ]¤¾£‰Â«‡8àdVÔM°î´
WªÜ²Úïn (¯ÿ€²©¦ÇšÔBLHË‚ÏeGôüÿjxkÃq‚ùæEX ¹Ã½ì­;!¾^‚$­›ed0™¿—Ú1 ¾`±Á¢ªµF)ô¦‡c¾fù–¤öÌo-DÀD™|“ýUû6|TÓ)½q;3A’ºopÑÞ´tT
1ú†¢i¡‡ŽC”‹ÍÝ–²‡Àe˜C!'3¦8¤Äj …0¤`
±öT=œe@•|N‹àÛÉ»âAÍ–	{
‚f;×Ÿ]«jkz
`u°™Âs2f¡a ÐJ;[GÇbwAye6Sr¥€¢h~ÔÁ½\òâÏmjBJƒ„ Ð¶Âîî"]î.ÌJ~/I­KÈTŠFÀ^Ádõ——=¿rª@H•Æ·ÿëÞa±V.ý2pQÃEgãFIÌÈM‡—° g†77IÓy2 0ûWöìlL[6úÔàH9)åâ²L;Î«	‹wC¼"ª²ô`Ø[­Žß^oHæA‰è¿µCäpM?\	¼¨U.©€-Á'_ëÉ"^¨…v@®‘˜¤	òSk4µ€¯©®˜WãÚÂ¬Q–N8Ÿ®;+®,­nƒS·¦Í=Ûsû>:ïòqº3ƒŽhÛc‹m+üûV[Íu¿ÑwøtK‚†]¨§É(n5AU
l…;|(\ÝÉð¸mµão‹“.¶Õ›öÏ ë&¥Ü¥Ç±OU¾["°šæÐº?¼ô5~ÃÙ°Sû#!sHUE®	o9‚ö7¼Ó÷*WíÌQ*oÊùÕ….ª2ÆÈ[p\À“Ã1ì²ª]wÖÛ]`›‘ºûcïÀjv„•{f¥÷§n·\dàÁp-…$¾ÂZ.ëµ‚žø‰’Ç8{K‹d“ƒQí’<ÖÞŒÄSXp$€33^'†÷ÓDNœp’Ž×GbT,€#ÕÌ@"ò—xÇ¨Ÿ+"z¥’¯öÀ	€ÂåêPž{¨7Yk’UÛÞ¦ÿ^÷$’‡ I™a©çÀ"J=tÄ‚+){
  "an-plus-b": {
    "groups": [
      "Selectors"
    ],
    "status": "standard"
  },
  "angle": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/angle"
  },
  "angle-percentage": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/angle-percentage"
  },
  "basic-shape": {
    "groups": [
      "CSS Shapes",
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/basic-shape"
  },
  "blend-mode": {
    "groups": [
      "Compositing and Blending",
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/blend-mode"
  },
  "color": {
    "groups": [
      "CSS Color",
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/color_value"
  },
  "custom-ident": {
    "groups": [
      "CSS Will Change",
      "CSS Counter Styles",
      "CSS Lists and Counters",
      "CSS Animations",
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/custom-ident"
  },
  "dimension": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/dimension"
  },
  "display-outside": {
    "groups": [
      "CSS Display"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/display-outside"
  },
  "display-inside": {
    "groups": [
      "CSS Display"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/display-inside"
  },
  "display-listitem": {
    "groups": [
      "CSS Display"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/display-listitem"
  },
  "display-internal": {
    "groups": [
      "CSS Display"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/display-internal"
  },
  "display-box": {
    "groups": [
      "CSS Display"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/display-box"
  },
  "display-legacy": {
    "groups": [
      "CSS Display"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/display-legacy"
  },
  "filter-function": {
    "groups": [
      "Filter Effects"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/filter-function"
  },
  "flex": {
    "groups": [
      "CSS Grid Layout",
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/flex_value"
  },
  "frequency": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/frequency"
  },
  "frequency-percentage": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/frequency-percentage"
  },
  "gradient": {
    "groups": [
      "CSS Images",
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/gradient"
  },
  "ident": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard"
  },
  "image": {
    "groups": [
      "CSS Images",
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/image"
  },
  "integer": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/integer"
  },
  "length": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/length"
  },
  "length-percentage": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/length-percentage"
  },
  "number": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/number"
  },
  "percentage": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/percentage"
  },
  "position": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/position_value"
  },
  "ratio": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/ratio"
  },
  "resolution": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://dev